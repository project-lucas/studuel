-- =============================================================================
-- Studuel — Migration 044 : lien parent ↔ élève + tableau de bord parents
-- La RLS de toutes les tables élève est « soi uniquement » (auth.uid() = user_id).
-- Un parent n'a donc AUCUN accès direct aux données de son enfant : tout passe
-- par des fonctions SECURITY DEFINER qui vérifient d'abord le lien parent→enfant
-- (même approche que friends_overview / community_seconds).
--
--   - parent_children : lien accepté entre un compte parent et un compte élève ;
--     le parent se lie en saisissant le CODE de l'enfant (profiles.friend_code,
--     migration 019) — le partage du code vaut consentement. L'élève comme le
--     parent peuvent rompre le lien.
--   - link_child_by_code / unlink_child : écritures via fonctions (definer).
--   - parent_children_overview : la liste des enfants liés (avec prénom).
--   - child_dashboard : l'agrégat de suivi (temps, régularité, scores/matière).
--
-- PRÉREQUIS : 001, 003 (test_sessions), 007 (study_sessions), 009
-- (lesson_completions), 011 (challenge_sessions), 014 (profiles.work_seconds),
-- 019 (profiles.friend_code). Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table de liaison parent → enfant.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_children (
  parent_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  child_id   UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'accepted'
             CHECK (status IN ('accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (parent_id, child_id),
  CHECK (parent_id <> child_id)
);

CREATE INDEX IF NOT EXISTS parent_children_child_idx
  ON public.parent_children (child_id);

ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;

-- Le parent ET l'enfant voient le lien (l'enfant pour savoir qui le suit).
DROP POLICY IF EXISTS "parent_children_select_own" ON public.parent_children;
CREATE POLICY "parent_children_select_own" ON public.parent_children
  FOR SELECT USING (auth.uid() IN (parent_id, child_id));

-- Chacun peut rompre le lien de son côté.
DROP POLICY IF EXISTS "parent_children_delete_own" ON public.parent_children;
CREATE POLICY "parent_children_delete_own" ON public.parent_children
  FOR DELETE USING (auth.uid() IN (parent_id, child_id));
-- Pas de policy INSERT : le lien se crée uniquement via link_child_by_code.

-- -----------------------------------------------------------------------------
-- Lier un enfant par son code. Renvoie : 'linked', 'already', 'self',
-- 'not_found'. Le parent est l'appelant (auth.uid()).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.link_child_by_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_child  UUID;
BEGIN
  IF v_parent IS NULL THEN RETURN 'not_found'; END IF;

  SELECT id INTO v_child FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_child IS NULL THEN RETURN 'not_found'; END IF;
  IF v_child = v_parent THEN RETURN 'self'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = v_child
  ) THEN RETURN 'already'; END IF;

  INSERT INTO public.parent_children (parent_id, child_id)
  VALUES (v_parent, v_child);
  RETURN 'linked';
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_child_by_code(TEXT) TO authenticated;

-- Rompre le lien avec un enfant (côté parent).
CREATE OR REPLACE FUNCTION public.unlink_child(p_child UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.parent_children
   WHERE parent_id = auth.uid() AND child_id = p_child
  RETURNING true;
$$;

GRANT EXECUTE ON FUNCTION public.unlink_child(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- La liste des enfants liés au parent appelant, avec leur prénom.
-- (La RLS de profiles n'expose pas les autres comptes — d'où le definer.)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.parent_children_overview()
RETURNS TABLE (
  child_id  UUID,
  full_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pc.child_id, p.full_name
    FROM public.parent_children pc
    JOIN public.profiles p ON p.id = pc.child_id
   WHERE pc.parent_id = auth.uid()
   ORDER BY p.full_name NULLS LAST, pc.created_at;
$$;

GRANT EXECUTE ON FUNCTION public.parent_children_overview() TO authenticated;

-- -----------------------------------------------------------------------------
-- Le tableau de bord d'un enfant : agrégat de suivi, renvoyé en JSON.
-- Renvoie NULL si l'appelant n'est pas un parent lié à cet enfant.
--   - work_seconds  : temps de travail cumulé (profiles.work_seconds)
--   - active_days   : clés UTC 'YYYY-MM-DD' des 120 derniers jours d'activité
--                     (union quiz / révision / leçon / défi) → série & régularité
--   - sessions_total / sessions_7 : nombre de quiz passés (total, 7 derniers j.)
--   - avg_ratio     : score moyen (0..1) sur tous les quiz passés
--   - per_subject   : [{ subject, ratio, attempts }] trié du plus faible au plus
--                     fort → « matières à renforcer »
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.child_dashboard(p_child UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_result JSONB;
BEGIN
  IF v_parent IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = p_child
  ) THEN RETURN NULL; END IF;

  WITH days AS (
    SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
      FROM (
        SELECT created_at FROM public.test_sessions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.study_sessions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.lesson_completions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.challenge_sessions
          WHERE user_id = p_child
      ) act
     WHERE created_at >= now() - INTERVAL '120 days'
  ),
  subjects AS (
    SELECT q.subject AS subject,
           avg(ts.score::numeric / nullif(ts.total, 0)) AS ratio,
           count(*) AS attempts
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
     WHERE ts.user_id = p_child AND ts.total > 0
     GROUP BY q.subject
  )
  SELECT jsonb_build_object(
    'full_name', (SELECT full_name FROM public.profiles WHERE id = p_child),
    'work_seconds', COALESCE((SELECT work_seconds FROM public.profiles WHERE id = p_child), 0),
    'active_days', COALESCE((SELECT jsonb_agg(d ORDER BY d) FROM days), '[]'::jsonb),
    'sessions_total', (SELECT count(*) FROM public.test_sessions WHERE user_id = p_child),
    'sessions_7', (SELECT count(*) FROM public.test_sessions
                    WHERE user_id = p_child AND created_at >= now() - INTERVAL '7 days'),
    'avg_ratio', (SELECT round(avg(score::numeric / nullif(total, 0)), 4)
                    FROM public.test_sessions WHERE user_id = p_child AND total > 0),
    'per_subject', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'subject', subject,
               'ratio', round(ratio, 4),
               'attempts', attempts
             ) ORDER BY ratio ASC, attempts DESC)
        FROM subjects
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.child_dashboard(UUID) TO authenticated;
