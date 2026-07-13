-- =============================================================================
-- Studuel — Migration 046 : duels EN TEMPS RÉEL (Supabase Realtime)
-- Complète les duels asynchrones (019 duels / 023 fantômes) par un vrai match
-- synchrone entre deux élèves.
--   - live_duels : une session de duel live. L'hôte crée la session avec une
--     GRAINE et la liste PARTAGÉE des questions (question_ids) → les deux
--     joueurs voient exactement les mêmes questions (cf. lib/duel-live.ts).
--   - Transport temps réel = Realtime broadcast/presence (canal duel-<id>) pour
--     l'échange des manches, + postgres_changes pour détecter l'arrivée du
--     rival. La table est donc ajoutée à la publication supabase_realtime.
--   - Écritures via fonctions SECURITY DEFINER : rejoindre une session en
--     'waiting' exige de contourner la RLS (le rival n'est pas encore dessus).
--
-- PRÉREQUIS : 001 (profiles), 002 (quiz_questions). Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.live_duels (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  guest_id     UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject      TEXT NOT NULL DEFAULT 'Duel',
  seed         TEXT NOT NULL,
  question_ids UUID[] NOT NULL,
  status       TEXT NOT NULL DEFAULT 'waiting'
               CHECK (status IN ('waiting', 'active', 'done')),
  host_rounds  JSONB NOT NULL DEFAULT '[]'::jsonb,
  guest_rounds JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (guest_id IS NULL OR guest_id <> host_id)
);

CREATE INDEX IF NOT EXISTS live_duels_host_idx
  ON public.live_duels (host_id, created_at DESC);
CREATE INDEX IF NOT EXISTS live_duels_guest_idx
  ON public.live_duels (guest_id, created_at DESC);

ALTER TABLE public.live_duels ENABLE ROW LEVEL SECURITY;

-- Les deux participants voient la session (l'hôte dès la création).
DROP POLICY IF EXISTS "live_duels_select_own" ON public.live_duels;
CREATE POLICY "live_duels_select_own" ON public.live_duels
  FOR SELECT USING (auth.uid() IN (host_id, guest_id));
-- Pas de policy INSERT/UPDATE : tout passe par les fonctions ci-dessous.

-- -----------------------------------------------------------------------------
-- Créer une session : l'hôte fixe la matière, la graine et la liste partagée
-- de questions. Renvoie l'id de la session.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_live_duel(
  p_subject TEXT,
  p_seed TEXT,
  p_question_ids UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   UUID;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_question_ids IS NULL OR array_length(p_question_ids, 1) IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.live_duels (host_id, subject, seed, question_ids)
  VALUES (v_user, left(coalesce(p_subject, 'Duel'), 80),
          coalesce(nullif(p_seed, ''), gen_random_uuid()::text),
          p_question_ids)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_live_duel(TEXT, TEXT, UUID[]) TO authenticated;

-- -----------------------------------------------------------------------------
-- Rejoindre une session en attente. Passe la session en 'active' et renvoie
-- ses infos partagées (host, matière, graine, questions), ou NULL si la
-- session n'existe pas / est déjà prise / est la sienne.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_live_duel(p_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_duel public.live_duels%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT * INTO v_duel FROM public.live_duels WHERE id = p_id FOR UPDATE;
  IF v_duel.id IS NULL THEN RETURN NULL; END IF;
  IF v_duel.host_id = v_user THEN RETURN NULL; END IF; -- pas contre soi-même
  IF v_duel.status <> 'waiting' OR v_duel.guest_id IS NOT NULL THEN
    RETURN NULL; -- déjà rejointe
  END IF;

  UPDATE public.live_duels
     SET guest_id = v_user, status = 'active'
   WHERE id = p_id;

  RETURN jsonb_build_object(
    'id', v_duel.id,
    'host_id', v_duel.host_id,
    'subject', v_duel.subject,
    'seed', v_duel.seed,
    'question_ids', to_jsonb(v_duel.question_ids)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_live_duel(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- Déposer ses manches (persistance/historique). Écrit du bon côté selon que
-- l'appelant est l'hôte ou le rival ; passe la session en 'done' quand les deux
-- camps ont déposé. Le vainqueur reste déterminé côté client (lib/duel-live).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_live_rounds(p_id UUID, p_rounds JSONB)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_duel public.live_duels%ROWTYPE;
BEGIN
  SELECT * INTO v_duel FROM public.live_duels WHERE id = p_id FOR UPDATE;
  IF v_duel.id IS NULL OR v_user IS NULL THEN RETURN false; END IF;

  IF v_user = v_duel.host_id THEN
    UPDATE public.live_duels SET host_rounds = coalesce(p_rounds, '[]'::jsonb)
     WHERE id = p_id;
  ELSIF v_user = v_duel.guest_id THEN
    UPDATE public.live_duels SET guest_rounds = coalesce(p_rounds, '[]'::jsonb)
     WHERE id = p_id;
  ELSE
    RETURN false;
  END IF;

  UPDATE public.live_duels
     SET status = 'done'
   WHERE id = p_id
     AND host_rounds <> '[]'::jsonb
     AND guest_rounds <> '[]'::jsonb;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_live_rounds(UUID, JSONB) TO authenticated;

-- -----------------------------------------------------------------------------
-- Activer Realtime sur la table (postgres_changes : l'hôte voit le rival
-- arriver). Ajout idempotent à la publication supabase_realtime.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime'
       AND schemaname = 'public'
       AND tablename = 'live_duels'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.live_duels;
  END IF;
END;
$$;
