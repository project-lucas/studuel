-- =============================================================================
-- Studuel — Migration 084 : temps de travail au jour le jour
-- Le temps de travail (profiles.work_seconds, migration 014) n'est qu'un
-- compteur cumulé global : on ne peut pas en déduire « cette semaine » ni
-- « la moyenne par jour ». Cette migration ajoute un journal quotidien
-- (work_daily) alimenté par le même point d'entrée (add_work_time), puis
-- étend child_dashboard (migration 044) pour l'espace parents.
--
-- Bucket par date UTC — cohérent avec active_days de child_dashboard.
-- Aucune reprise possible de l'historique (le cumul n'était pas ventilé) :
-- work_daily se remplit à partir des nouvelles sessions, ce qui est assumé.
--
-- PRÉREQUIS : 014 (add_work_time, profiles.work_seconds), 044 (child_dashboard,
-- parent_children). Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Journal quotidien du temps de travail, en secondes, par élève et par jour.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.work_daily (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  day     DATE NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

CREATE INDEX IF NOT EXISTS work_daily_user_day_idx
  ON public.work_daily (user_id, day DESC);

ALTER TABLE public.work_daily ENABLE ROW LEVEL SECURITY;

-- L'élève lit son propre journal ; le parent y accède via child_dashboard
-- (SECURITY DEFINER). Aucune policy d'écriture : seule add_work_time écrit.
DROP POLICY IF EXISTS "work_daily_select_own" ON public.work_daily;
CREATE POLICY "work_daily_select_own" ON public.work_daily
  FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- add_work_time : incrémente le cumul ET le jour courant, dans la même
-- transaction. Remplace la version 014 (même plafond d'1 h par appel).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_work_time(p_seconds INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_add  INTEGER := GREATEST(0, LEAST(p_seconds, 3600));
BEGIN
  IF v_user IS NULL OR v_add = 0 THEN RETURN; END IF;

  UPDATE public.profiles
     SET work_seconds = work_seconds + v_add
   WHERE id = v_user;

  INSERT INTO public.work_daily (user_id, day, seconds)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date, v_add)
  ON CONFLICT (user_id, day)
  DO UPDATE SET seconds = public.work_daily.seconds + EXCLUDED.seconds;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_work_time(INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- child_dashboard : reprise intégrale de la version 044, enrichie de deux
-- champs pour l'espace parents :
--   - week_seconds      : temps travaillé sur les 7 derniers jours (glissant)
--   - week_active_days  : nb de jours travaillés sur ces 7 jours (→ moyenne/jour)
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
  v_since  DATE := (now() AT TIME ZONE 'utc')::date - 6;
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
    'week_seconds', COALESCE((SELECT sum(seconds) FROM public.work_daily
                                WHERE user_id = p_child AND day >= v_since), 0),
    'week_active_days', COALESCE((SELECT count(*) FROM public.work_daily
                                    WHERE user_id = p_child AND day >= v_since AND seconds > 0), 0),
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
