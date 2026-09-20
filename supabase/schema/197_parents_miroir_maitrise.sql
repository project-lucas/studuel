-- =============================================================================
-- Studuel — Migration 197 : le parent et l'élève voient enfin le même score
--
-- `child_dashboard` avait été écrite comme un agrégat SQL autonome, sans
-- reprendre les définitions de `lib/`. Résultat : chacun des chiffres du parent
-- avait sa propre règle, différente de celle affichée à l'élève. Deux écarts
-- sont corrigés ici.
--
-- 1. MOYENNE DE TOUTES LES TENTATIVES ↔ MEILLEUR SCORE PAR QUIZ.
--    `lib/mastery.ts` agrège le MEILLEUR ratio par quiz (choix assumé et
--    commenté). La fonction, elle, faisait `avg(score/total)` sur toutes les
--    tentatives. Or le SRS et la Revanche poussent explicitement l'élève à
--    REFAIRE ce qu'il a raté : un élève passé de 3/10 à 9/10 voyait sa couronne
--    à 90 %, pendant que son parent lisait 60 % et « Maths : à renforcer ».
--    L'écart était structurel et toujours pessimiste côté parent — soit le pire
--    sens pour un écran qui doit donner confiance.
--    `avg_ratio` (« Score moyen ») suit la même règle, sans quoi la moyenne
--    globale contredirait chacune des matières affichées juste en dessous.
--
-- 2. FENÊTRE D'ACTIVITÉ À 120 JOURS ↔ 400 JOURS.
--    `lib/streak.ts` (ACTIVITY_WINDOW_DAYS = 400) et la migration 170, écrite
--    exprès pour aligner SQL et application, sont à 400 jours.
--    `child_dashboard` était restée à 120 : au-delà, la série du parent
--    décrochait de celle de l'élève. Miroir simplement oublié.
--
-- Le reste de la fonction est repris À L'IDENTIQUE de la 084.
--
-- ⚠️ Cette migration ne change QUE des chiffres affichés : elle est sûre à
-- exécuter avant ou après le déploiement du code, dans n'importe quel ordre.
--
-- PRÉREQUIS : 044 (parent_children), 084 (child_dashboard, work_daily).
-- Idempotent.
-- =============================================================================

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
     -- Miroir d'ACTIVITY_WINDOW_DAYS (lib/streak.ts) et de la migration 170.
     WHERE created_at >= now() - INTERVAL '400 days'
  ),
  -- Miroir de lib/mastery.ts : un quiz vaut son MEILLEUR essai, ratio écrêté
  -- à 1 (un score supérieur au total ne doit pas gonfler la moyenne).
  best_per_quiz AS (
    SELECT ts.quiz_id,
           max(least(ts.score::numeric / ts.total, 1)) AS ratio,
           count(*) AS attempts
      FROM public.test_sessions ts
     WHERE ts.user_id = p_child
       AND ts.total > 0
       AND ts.quiz_id IS NOT NULL
     GROUP BY ts.quiz_id
  ),
  subjects AS (
    SELECT q.subject AS subject,
           avg(b.ratio) AS ratio,
           -- `attempts` reste le nombre d'ESSAIS : c'est la quantité de preuve
           -- que demande MIN_ATTEMPTS_FOR_SIGNAL, pas un nombre de quiz.
           sum(b.attempts) AS attempts
      FROM best_per_quiz b
      JOIN public.quizzes q ON q.id = b.quiz_id
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
    'avg_ratio', (SELECT round(avg(ratio), 4) FROM best_per_quiz),
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
