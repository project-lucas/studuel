-- =============================================================================
-- Scolaria — Migration 019 : fondation sociale (onglet « Amis »)
-- Pose les tables et les garde-fous ; le front (AmisHome) sera branché ensuite.
--   - profiles.friend_code : code court unique pour s'ajouter entre élèves ;
--   - friendships : demandes/acceptations, écrites uniquement via fonctions ;
--   - duels : un défi d'ami par jour (mission bonus), scores via fonction.
-- La RLS de profiles reste « soi uniquement » : les infos publiques d'un ami
-- (prénom, code) ne sortent que par les fonctions SECURITY DEFINER ciblées.
-- PRÉREQUIS : 001 exécutée. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Code ami : 6 caractères lisibles (sans 0/O/1/I/L), unique.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS friend_code TEXT;

CREATE OR REPLACE FUNCTION public.generate_friend_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code TEXT;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE friend_code = code
    );
  END LOOP;
  RETURN code;
END;
$$;

-- Backfill des profils existants, un par un (unicité vérifiée à chaque tirage).
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE friend_code IS NULL LOOP
    UPDATE public.profiles
       SET friend_code = public.generate_friend_code()
     WHERE id = r.id;
  END LOOP;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_friend_code_key
  ON public.profiles (friend_code);

-- Les nouveaux profils reçoivent leur code à la création.
CREATE OR REPLACE FUNCTION public.set_friend_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.friend_code IS NULL THEN
    NEW.friend_code := public.generate_friend_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_friend_code ON public.profiles;
CREATE TRIGGER profiles_set_friend_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_friend_code();

-- -----------------------------------------------------------------------------
-- Amitiés : demande (pending) puis acceptation. Écritures via fonctions.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.friendships (
  requester_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'accepted')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (requester_id, addressee_id),
  CHECK (requester_id <> addressee_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friendships_select_own" ON public.friendships;
CREATE POLICY "friendships_select_own" ON public.friendships
  FOR SELECT USING (auth.uid() IN (requester_id, addressee_id));

DROP POLICY IF EXISTS "friendships_delete_own" ON public.friendships;
CREATE POLICY "friendships_delete_own" ON public.friendships
  FOR DELETE USING (auth.uid() IN (requester_id, addressee_id));
-- Pas de policy INSERT/UPDATE : add_friend_by_code / accept_friend (definer).

-- Demande d'ami par code. Renvoie : 'sent', 'already', 'self' ou 'not_found'.
CREATE OR REPLACE FUNCTION public.add_friend_by_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_target UUID;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;

  SELECT id INTO v_target FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_target IS NULL THEN RETURN 'not_found'; END IF;
  IF v_target = v_user THEN RETURN 'self'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.friendships
    WHERE (requester_id = v_user AND addressee_id = v_target)
       OR (requester_id = v_target AND addressee_id = v_user)
  ) THEN RETURN 'already'; END IF;

  INSERT INTO public.friendships (requester_id, addressee_id)
  VALUES (v_user, v_target);
  RETURN 'sent';
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_friend_by_code(TEXT) TO authenticated;

-- Acceptation d'une demande reçue.
CREATE OR REPLACE FUNCTION public.accept_friend(p_requester UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.friendships
     SET status = 'accepted'
   WHERE requester_id = p_requester
     AND addressee_id = auth.uid()
     AND status = 'pending'
  RETURNING true;
$$;

GRANT EXECUTE ON FUNCTION public.accept_friend(UUID) TO authenticated;

-- Vue d'ensemble : amis acceptés + demandes, avec le prénom (la RLS de
-- profiles ne laisse pas lire les autres — cette fonction expose LE minimum).
CREATE OR REPLACE FUNCTION public.friends_overview()
RETURNS TABLE (
  friend_id UUID,
  full_name TEXT,
  status    TEXT,
  incoming  BOOLEAN  -- true si c'est une demande reçue (à accepter)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE WHEN f.requester_id = auth.uid() THEN f.addressee_id ELSE f.requester_id END,
    p.full_name,
    f.status,
    (f.addressee_id = auth.uid() AND f.status = 'pending')
  FROM public.friendships f
  JOIN public.profiles p
    ON p.id = CASE WHEN f.requester_id = auth.uid()
                   THEN f.addressee_id ELSE f.requester_id END
  WHERE auth.uid() IN (f.requester_id, f.addressee_id);
$$;

GRANT EXECUTE ON FUNCTION public.friends_overview() TO authenticated;

-- -----------------------------------------------------------------------------
-- Duels : la mission bonus du jour — un duel lancé par jour et par élève.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.duels (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  opponent_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject          TEXT NOT NULL,
  total            INT  NOT NULL DEFAULT 5 CHECK (total BETWEEN 1 AND 50),
  challenger_score INT  CHECK (challenger_score BETWEEN 0 AND total),
  opponent_score   INT  CHECK (opponent_score BETWEEN 0 AND total),
  day              DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (challenger_id <> opponent_id)
);

-- Une mission duel par jour (côté lanceur).
CREATE UNIQUE INDEX IF NOT EXISTS duels_one_per_day
  ON public.duels (challenger_id, day);
CREATE INDEX IF NOT EXISTS duels_opponent_idx
  ON public.duels (opponent_id, created_at DESC);

ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "duels_select_own" ON public.duels;
CREATE POLICY "duels_select_own" ON public.duels
  FOR SELECT USING (auth.uid() IN (challenger_id, opponent_id));
-- Pas de policy INSERT/UPDATE : create_duel / submit_duel_score (definer).

-- Lance un duel contre un ami accepté. Renvoie l'id du duel, ou NULL si
-- l'adversaire n'est pas un ami / mission du jour déjà utilisée.
CREATE OR REPLACE FUNCTION public.create_duel(p_opponent UUID, p_subject TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   UUID;
BEGIN
  IF v_user IS NULL OR p_opponent IS NULL OR p_opponent = v_user THEN
    RETURN NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
      AND ((requester_id = v_user AND addressee_id = p_opponent)
        OR (requester_id = p_opponent AND addressee_id = v_user))
  ) THEN RETURN NULL; END IF;

  INSERT INTO public.duels (challenger_id, opponent_id, subject)
  VALUES (v_user, p_opponent, left(coalesce(p_subject, 'Duel'), 80))
  ON CONFLICT (challenger_id, day) DO NOTHING
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_duel(UUID, TEXT) TO authenticated;

-- Dépose son score (une seule fois par camp).
CREATE OR REPLACE FUNCTION public.submit_duel_score(p_duel UUID, p_score INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_duel public.duels%ROWTYPE;
BEGIN
  SELECT * INTO v_duel FROM public.duels WHERE id = p_duel;
  IF v_duel.id IS NULL OR v_user IS NULL THEN RETURN false; END IF;

  IF v_user = v_duel.challenger_id AND v_duel.challenger_score IS NULL THEN
    UPDATE public.duels
       SET challenger_score = GREATEST(0, LEAST(p_score, total))
     WHERE id = p_duel;
    RETURN true;
  ELSIF v_user = v_duel.opponent_id AND v_duel.opponent_score IS NULL THEN
    UPDATE public.duels
       SET opponent_score = GREATEST(0, LEAST(p_score, total))
     WHERE id = p_duel;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_duel_score(UUID, INT) TO authenticated;
