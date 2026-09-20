-- =============================================================================
-- Studuel — Migration 079 : CLASSEMENT & TROPHÉES (mode classé du Défi)
-- Le ressort de rétention « façon Clash Royale » : un compteur de trophées par
-- élève, qui monte/descend à chaque match classé et le situe face à ses amis.
--   - profiles.trophies / profiles.best_trophies : total courant + record ;
--   - ranked_matches : journal des matchs classés (audit, historique) ;
--   - apply_ranked_match(...) : applique le résultat de façon UNSPOOFABLE — le
--     barème Elo-lite est recalculé côté serveur (miroir de lib/trophies.ts),
--     l'écart de trophées de l'adversaire est borné ±150, le gain/perte est
--     clampé. Le client ne peut donc pas s'injecter de trophées.
--   - friends_trophies() : les trophées des amis acceptés (prénom + total), pour
--     le mini-classement live — la RLS de profiles reste « soi uniquement ».
--
-- PRÉREQUIS : 001 (profiles), 019 (friendships). Idempotent.
-- =============================================================================

-- ------------------------------------------------------------------ colonnes
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trophies      INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_trophies INTEGER NOT NULL DEFAULT 0;

-- Garde-fou : jamais de trophées négatifs.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_trophies_nonneg;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_trophies_nonneg
  CHECK (trophies >= 0 AND best_trophies >= 0);

CREATE INDEX IF NOT EXISTS profiles_trophies_idx
  ON public.profiles (trophies DESC);

-- --------------------------------------------------------------- journal
CREATE TABLE IF NOT EXISTS public.ranked_matches (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  won        BOOLEAN NOT NULL,
  delta      INTEGER NOT NULL,
  trophies   INTEGER NOT NULL,          -- total APRÈS le match
  opponent   TEXT,                       -- libellé lisible (fantôme, prénom…)
  mode       TEXT NOT NULL DEFAULT 'ranked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ranked_matches_user_idx
  ON public.ranked_matches (user_id, created_at DESC);

ALTER TABLE public.ranked_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ranked_matches_select_own" ON public.ranked_matches;
CREATE POLICY "ranked_matches_select_own" ON public.ranked_matches
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT/UPDATE : tout passe par apply_ranked_match (definer).

-- ----------------------------------------------------------- application
-- Applique un résultat de match classé. Recalcule le barème côté serveur pour
-- qu'il soit infalsifiable (miroir exact de lib/trophies.ts : K=40, gain
-- 12..40, perte -6..-30, plancher 0). L'écart de l'adversaire est borné à ±150
-- du total du joueur : même en cas de valeur trafiquée, le delta reste équitable.
-- Renvoie le total avant/après, le delta et le nouveau record.
CREATE OR REPLACE FUNCTION public.apply_ranked_match(
  p_won BOOLEAN,
  p_opponent_trophies INTEGER,
  p_opponent_label TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_before   INTEGER;
  v_best     INTEGER;
  v_opp      INTEGER;
  v_expected DOUBLE PRECISION;
  v_raw      DOUBLE PRECISION;
  v_delta    INTEGER;
  v_after    INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT trophies, best_trophies INTO v_before, v_best
    FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF v_before IS NULL THEN RETURN NULL; END IF;

  -- Adversaire borné à ±150 du joueur (matchmaking équitable, anti-triche).
  v_opp := GREATEST(v_before - 150,
             LEAST(v_before + 150, COALESCE(p_opponent_trophies, v_before)));

  v_expected := 1.0 / (1.0 + power(10.0, (v_opp - v_before) / 400.0));
  v_raw := 40.0 * ((CASE WHEN p_won THEN 1 ELSE 0 END) - v_expected);

  IF p_won THEN
    v_delta := GREATEST(12, LEAST(40, round(v_raw)::int));
  ELSE
    v_delta := LEAST(-6, GREATEST(-30, round(v_raw)::int));
  END IF;

  v_after := GREATEST(0, v_before + v_delta);
  v_best  := GREATEST(v_best, v_after);

  UPDATE public.profiles
     SET trophies = v_after, best_trophies = v_best
   WHERE id = v_user;

  INSERT INTO public.ranked_matches (user_id, won, delta, trophies, opponent)
  VALUES (v_user, p_won, v_delta, v_after, left(p_opponent_label, 80));

  RETURN jsonb_build_object(
    'before', v_before,
    'after', v_after,
    'delta', v_delta,
    'best', v_best
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.apply_ranked_match(BOOLEAN, INTEGER, TEXT) TO authenticated;

-- --------------------------------------------------- trophées des amis
-- Les trophées des amis acceptés (prénom + total), pour le mini-classement
-- live du Défi. SECURITY DEFINER : la RLS de profiles ne laisse pas lire les
-- autres, cette fonction n'expose QUE le minimum (id, prénom, trophées).
CREATE OR REPLACE FUNCTION public.friends_trophies()
RETURNS TABLE (
  friend_id UUID,
  full_name TEXT,
  trophies  INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.full_name,
    p.trophies
  FROM public.friendships f
  JOIN public.profiles p
    ON p.id = CASE WHEN f.requester_id = auth.uid()
                   THEN f.addressee_id ELSE f.requester_id END
  WHERE f.status = 'accepted'
    AND auth.uid() IN (f.requester_id, f.addressee_id);
$$;

GRANT EXECUTE ON FUNCTION public.friends_trophies() TO authenticated;
