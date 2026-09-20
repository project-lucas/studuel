-- =============================================================================
-- Studuel — Migration 351 : LA COURSE (duel classé) — les replays des élèves
--
-- Le duel classé d'une matière devient une COURSE : deux barres qui se
-- remplissent, la première pleine gagne, et le rival répond EN MÊME TEMPS que
-- l'élève. Pour que ce rival soit quelqu'un de réel sans que deux élèves aient
-- à être en ligne au même instant, on garde la TRACE de chaque course jouée :
-- ses pas (instant, juste/faux, temps de réflexion) — et on la rejoue en face
-- de quelqu'un d'autre.
--
--   - duel_replays : une trace par (élève, matière) — la dernière course.
--     Les points ne sont PAS stockés comme vérité : le client comme le serveur
--     les recalculent depuis les pas (lib/duel/rival.timelineFromSteps).
--   - duel_save_replay : dépose sa trace (SECURITY DEFINER, bornée).
--   - duel_replay_opponents : le vivier d'adversaires d'une matière — MÊME
--     NIVEAU DE CLASSE, prénom seul, avatar, trophées sur la matière, trace.
--     Même périmètre que subject_ranked_ghosts (238).
--   - duel_replay_get : une trace par id, pour que le serveur REVALIDE la
--     course annoncée par le client (même périmètre de niveau).
--
-- PRÉREQUIS : 001 (profiles), 238 (game_trophies). Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.duel_replays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL,
  -- Ses trophées sur la matière AU MOMENT de la course : c'est sur eux qu'on
  -- apparie, et ils ne bougent plus (une trace d'il y a un mois reste celle
  -- d'un joueur de ce niveau-là).
  trophies     INTEGER NOT NULL DEFAULT 0 CHECK (trophies >= 0),
  score        INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  won          BOOLEAN NOT NULL DEFAULT false,
  steps        JSONB   NOT NULL DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject_slug)
);

CREATE INDEX IF NOT EXISTS duel_replays_subject_idx
  ON public.duel_replays (subject_slug, created_at DESC);

ALTER TABLE public.duel_replays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "duel_replays_select_own" ON public.duel_replays;
CREATE POLICY "duel_replays_select_own" ON public.duel_replays
  FOR SELECT USING (user_id = (SELECT auth.uid()));
-- Pas de policy INSERT/UPDATE : tout passe par duel_save_replay.

-- -----------------------------------------------------------------------------
-- Déposer sa trace. Une par matière, la dernière remplace la précédente.
-- Bornes : au plus 50 pas, chacun un objet {at, good, ms}. Le détail des bornes
-- (instants croissants, réflexion crédible) est revérifié à la LECTURE par
-- lib/duel/replay.sanitizeSteps — une trace malformée ne fait jamais un rival.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.duel_save_replay(
  p_subject_slug TEXT,
  p_score INTEGER,
  p_won BOOLEAN,
  p_steps JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id UUID;
  v_trophies INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_subject_slug IS NULL OR length(p_subject_slug) = 0 THEN RETURN NULL; END IF;
  IF p_steps IS NULL OR jsonb_typeof(p_steps) <> 'array' THEN RETURN NULL; END IF;
  IF jsonb_array_length(p_steps) < 3 OR jsonb_array_length(p_steps) > 50 THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(sum(trophies), 0)::int INTO v_trophies
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug;

  INSERT INTO public.duel_replays (user_id, subject_slug, trophies, score, won, steps)
  VALUES (v_user, left(p_subject_slug, 64), COALESCE(v_trophies, 0),
          GREATEST(0, LEAST(COALESCE(p_score, 0), 100000)),
          COALESCE(p_won, false), p_steps)
  ON CONFLICT (user_id, subject_slug) DO UPDATE
    SET trophies = EXCLUDED.trophies,
        score = EXCLUDED.score,
        won = EXCLUDED.won,
        steps = EXCLUDED.steps,
        created_at = now()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.duel_save_replay(TEXT, INTEGER, BOOLEAN, JSONB) TO authenticated;

-- -----------------------------------------------------------------------------
-- Le vivier d'adversaires d'une matière : les traces des élèves du MÊME NIVEAU.
-- Prénom seul (imposé ici, pas dans le client), avatar (un dessin, pas une
-- photo), trophées sur la matière au moment de la course, la trace.
-- L'appariement (fourchette ±150, élargissement) se fait dans
-- lib/duel/opponent-server, comme pour subject_ranked_ghosts.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.duel_replay_opponents(
  p_subject_slug TEXT,
  p_limit INTEGER DEFAULT 40
)
RETURNS TABLE (
  replay_id UUID,
  user_id   UUID,
  name      TEXT,
  avatar    JSONB,
  trophies  INTEGER,
  score     INTEGER,
  steps     JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT grade_level FROM public.profiles WHERE id = auth.uid()
  )
  SELECT
    r.id,
    r.user_id,
    COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Un élève') AS name,
    COALESCE(p.avatar, '{}'::jsonb) AS avatar,
    r.trophies,
    r.score,
    r.steps
  FROM public.duel_replays r
  JOIN public.profiles p ON p.id = r.user_id
  JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  WHERE r.subject_slug = p_subject_slug
    AND r.user_id <> auth.uid()
    AND jsonb_array_length(r.steps) >= 3
  ORDER BY r.created_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 200));
$$;

GRANT EXECUTE ON FUNCTION public.duel_replay_opponents(TEXT, INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- Une trace par id — pour la REVALIDATION serveur d'une course. Même périmètre
-- que le vivier : jamais une trace d'un autre niveau de classe.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.duel_replay_get(p_id UUID)
RETURNS TABLE (
  steps    JSONB,
  trophies INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT grade_level FROM public.profiles WHERE id = auth.uid()
  )
  SELECT r.steps, r.trophies
  FROM public.duel_replays r
  JOIN public.profiles p ON p.id = r.user_id
  JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  WHERE r.id = p_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.duel_replay_get(UUID) TO authenticated;
