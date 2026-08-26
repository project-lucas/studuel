-- =============================================================================
-- Studuel — Migration 319 : l'espace parents devient un vrai tableau de bord
--
-- L'écran parents savait dire CE QUE L'ENFANT A FAIT (temps, série, score par
-- matière). Il ne savait rien dire de trois choses que le parent cherche en
-- premier, et pour lesquelles il ouvre l'app :
--
--   1. « Est-ce qu'il a quelque chose de prévu ? » — les CONTRÔLES à venir
--      existent en base depuis la 203, déclarés par l'élève depuis Réviser.
--      Le parent ne les voyait nulle part : la seule information réellement
--      ACTIONNABLE de tout l'écran (« contrôle de maths jeudi ») lui était
--      cachée, alors qu'elle était à une jointure de là.
--   2. « Est-ce que ça monte ou ça descend ? » — le tableau de bord ne montrait
--      QUE les 7 derniers jours. Un enfant qui décroche depuis trois semaines
--      et un enfant qui vient de démarrer affichaient exactement la même carte.
--      On renvoie donc les QUATRE dernières semaines, semaine civile par
--      semaine civile (lundi → dimanche, comme partout dans l'app).
--   3. « Est-ce qu'il en fait assez ? » — sans repère, « 1 h 20 cette semaine »
--      ne veut rien dire pour un parent. `parent_prefs` lui laisse poser SON
--      objectif hebdomadaire et le seuil à partir duquel une inactivité doit
--      l'alerter. Le réglage est par COUPLE (parent, enfant) : deux enfants du
--      même foyer n'ont ni le même âge ni le même rythme.
--
-- CE QUI NE CHANGE PAS. `child_dashboard` garde à l'identique toutes les clés
-- de la 199 (`per_subject`, `avg_ratio`, `active_days`, `week_seconds`…) et
-- leurs règles — c'est-à-dire le miroir de `lib/mastery.ts` posé par la 197 et
-- le périmètre « classe courante » posé par la 199. On AJOUTE quatre clés
-- (`grade_level`, `weeks`, `controles`, `last_activity`), on n'en retouche
-- aucune : le code déployé avant cette migration continue de lire ce qu'il
-- lisait, et le code déployé après tolère leur absence (repli dans
-- `lib/parents.ts`). Sûre à exécuter avant ou après le déploiement.
--
-- POURQUOI LES CONTRÔLES PASSENT PAR `child_dashboard` ET NON PAR UNE LECTURE
-- DIRECTE : `controles` est en RLS « ses propres lignes uniquement » (203), et
-- c'est très bien ainsi — le parent n'est pas propriétaire des lignes de son
-- enfant. La fonction, elle, est SECURITY DEFINER et VÉRIFIE DÉJÀ le lien
-- `parent_children` avant de rendre quoi que ce soit : c'est le seul endroit
-- où l'autorisation « ce parent, cet enfant » est établie une fois pour toutes.
-- Ouvrir `controles` en lecture au parent par une policy dupliquerait cette
-- règle d'autorisation à un deuxième endroit — donc la ferait diverger.
--
-- ON NE REND QUE LES CONTRÔLES À VENIR ET NON NOTÉS. Un contrôle passé, ou dont
-- l'élève a déjà saisi la note, n'est plus une échéance : c'est de l'historique,
-- et l'afficher dans « à venir » ferait mentir l'écran. Bornés à 5 : au-delà,
-- ce n'est plus un agenda, c'est une liste.
--
-- PRÉREQUIS : 044 (parent_children), 084 (work_daily), 199 (child_dashboard),
-- 203 (controles). Idempotent — le rejeu est sans risque.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------- 1. RÉGLAGES DU PARENT ---
-- Un réglage par couple (parent, enfant). L'absence de ligne est un état
-- NORMAL et majoritaire (le parent n'a rien réglé) : le code lit alors ses
-- valeurs par défaut dans `lib/parents.ts` — les deux DEFAULT ci-dessous en
-- sont le miroir, un test le vérifie.
CREATE TABLE IF NOT EXISTS public.parent_prefs (
  parent_id           UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  child_id            UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  -- Objectif de temps de révision sur la semaine, en minutes.
  -- Borne haute à 20 h : au-delà, ce n'est plus un objectif, c'est une saisie
  -- erronée — et un objectif inatteignable ne motive personne.
  weekly_goal_minutes INTEGER NOT NULL DEFAULT 90
                        CHECK (weekly_goal_minutes BETWEEN 15 AND 1200),
  -- Nombre de jours sans activité au bout desquels l'écran alerte le parent.
  -- 0 = alerte désactivée (le parent ne veut pas être relancé).
  alert_after_days    INTEGER NOT NULL DEFAULT 3
                        CHECK (alert_after_days BETWEEN 0 AND 30),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (parent_id, child_id),
  CHECK (parent_id <> child_id)
);

ALTER TABLE public.parent_prefs ENABLE ROW LEVEL SECURITY;

-- Lecture : ses propres réglages. L'ÉCRITURE N'EST OUVERTE À PERSONNE ici —
-- elle passe par `set_parent_prefs` (ci-dessous), qui est le seul endroit où
-- le lien `parent_children` est vérifié. Une policy d'écriture en parallèle
-- laisserait un parent poser des réglages sur un enfant qu'il n'a pas lié.
DROP POLICY IF EXISTS parent_prefs_select_own ON public.parent_prefs;
CREATE POLICY parent_prefs_select_own ON public.parent_prefs
  FOR SELECT USING (parent_id = auth.uid());

GRANT SELECT ON public.parent_prefs TO authenticated;

-- Enregistre (ou met à jour) les réglages d'un enfant LIÉ.
-- Renvoie TRUE si la ligne a été posée, FALSE si le lien n'existe pas — le
-- même contrat silencieux que `unlink_child` : on ne dit jamais à un appelant
-- si un `child_id` inconnu existe ailleurs dans la base.
CREATE OR REPLACE FUNCTION public.set_parent_prefs(
  p_child UUID,
  p_goal_minutes INTEGER,
  p_alert_days INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
BEGIN
  IF v_parent IS NULL THEN RETURN FALSE; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = p_child
  ) THEN RETURN FALSE; END IF;

  -- Les bornes sont appliquées ICI plutôt que laissées au CHECK : une saisie
  -- hors bornes est une erreur d'IHM, pas une tentative d'attaque, et la faire
  -- remonter en 23514 obligerait chaque appelant à traduire un code Postgres.
  INSERT INTO public.parent_prefs (parent_id, child_id, weekly_goal_minutes, alert_after_days)
  VALUES (
    v_parent,
    p_child,
    LEAST(1200, GREATEST(15, COALESCE(p_goal_minutes, 90))),
    LEAST(30, GREATEST(0, COALESCE(p_alert_days, 3)))
  )
  ON CONFLICT (parent_id, child_id) DO UPDATE
    SET weekly_goal_minutes = EXCLUDED.weekly_goal_minutes,
        alert_after_days    = EXCLUDED.alert_after_days,
        updated_at          = now();

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_parent_prefs(UUID, INTEGER, INTEGER) TO authenticated;

-- ------------------------------------ 2. CHILD_DASHBOARD — quatre clés de plus ---
-- Corps repris À L'IDENTIQUE de la 199 (CTE `days`, `best_per_quiz`,
-- `subjects`, bornage à la classe courante + niveau 'tous'), augmenté de
-- `grade_level`, `weeks`, `controles` et `last_activity`.
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
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_since  DATE := (now() AT TIME ZONE 'utc')::date - 6;
  v_grade  TEXT;
  -- Lundi de la semaine en cours. ISODOW : lundi = 1 … dimanche = 7 — le même
  -- « la semaine commence lundi » que `lib/time.ts` et `weekProgress()`.
  v_monday DATE := (now() AT TIME ZONE 'utc')::date
                   - (EXTRACT(ISODOW FROM (now() AT TIME ZONE 'utc')::date)::int - 1);
BEGIN
  IF v_parent IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = p_child
  ) THEN RETURN NULL; END IF;

  SELECT grade_level INTO v_grade FROM public.profiles WHERE id = p_child;

  WITH days AS (
    SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
      FROM (
        SELECT created_at FROM public.test_sessions      WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.study_sessions     WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.lesson_completions WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.challenge_sessions WHERE user_id = p_child
      ) act
     -- Miroir d'ACTIVITY_WINDOW_DAYS (lib/streak.ts) et de la migration 170.
     WHERE created_at >= now() - INTERVAL '400 days'
  ),
  -- Miroir de lib/mastery.ts : un quiz vaut son MEILLEUR essai, ratio écrêté
  -- à 1 (un score supérieur au total ne doit pas gonfler la moyenne).
  -- Borné à la classe courante (+ le hors-programme 'tous'), comme l'anneau
  -- de progression de l'élève.
  best_per_quiz AS (
    SELECT ts.quiz_id,
           max(least(ts.score::numeric / ts.total, 1)) AS ratio,
           count(*) AS attempts
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
     WHERE ts.user_id = p_child
       AND ts.total > 0
       AND (v_grade IS NULL OR q.grade_level IS NULL
            OR q.grade_level IN (v_grade, 'tous'))
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
  ),
  -- Les 4 dernières semaines CIVILES, de la plus ancienne à celle en cours.
  -- generate_series(3, 0, -1) → lundi-21, lundi-14, lundi-7, lundi : l'ordre
  -- est celui de lecture d'un graphique, il n'a pas à être retrié côté app.
  weeks AS (
    SELECT w.start_day,
           COALESCE((SELECT sum(wd.seconds) FROM public.work_daily wd
                      WHERE wd.user_id = p_child
                        AND wd.day >= w.start_day
                        AND wd.day <  w.start_day + 7), 0) AS seconds,
           COALESCE((SELECT count(*) FROM public.work_daily wd
                      WHERE wd.user_id = p_child
                        AND wd.day >= w.start_day
                        AND wd.day <  w.start_day + 7
                        AND wd.seconds > 0), 0) AS active_days
      FROM (
        SELECT v_monday - (i * 7) AS start_day
          FROM generate_series(3, 0, -1) AS i
      ) w
  )
  SELECT jsonb_build_object(
    'full_name', (SELECT full_name FROM public.profiles WHERE id = p_child),
    -- NOUVEAU : la classe. Le parent lisait une carte sans savoir à quel
    -- programme se rapportent les matières affichées — et c'est aussi ce qui
    -- rend deux fratries distinguables d'un coup d'œil.
    'grade_level', (SELECT grade_level FROM public.profiles WHERE id = p_child),
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
    ), '[]'::jsonb),
    -- NOUVEAU : les 4 dernières semaines, pour lire une TENDANCE.
    'weeks', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'start', to_char(start_day, 'YYYY-MM-DD'),
               'seconds', seconds,
               'active_days', active_days
             ) ORDER BY start_day ASC)
        FROM weeks
    ), '[]'::jsonb),
    -- NOUVEAU : l'agenda. Contrôles À VENIR et NON NOTÉS, du plus proche au
    -- plus lointain, 5 au maximum.
    'controles', COALESCE((
      SELECT jsonb_agg(c.item)
        FROM (
          SELECT jsonb_build_object(
                   'id', ct.id,
                   'subject_slug', ct.subject_slug,
                   'chapters', ct.chapters,
                   'exam_date', to_char(ct.exam_date, 'YYYY-MM-DD')
                 ) AS item
            FROM public.controles ct
           WHERE ct.user_id = p_child
             AND ct.note IS NULL
             AND ct.exam_date IS NOT NULL
             AND ct.exam_date >= v_today
           ORDER BY ct.exam_date ASC
           LIMIT 5
        ) c
    ), '[]'::jsonb),
    -- NOUVEAU : la dernière trace d'activité, à la journée. C'est elle qui
    -- arme (ou non) l'alerte d'inactivité réglée dans `parent_prefs` — dérivée
    -- des MÊMES quatre sources que la série, sans quoi l'alerte et la grille
    -- de la semaine pourraient se contredire.
    'last_activity', (SELECT max(d) FROM days)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.child_dashboard(UUID) TO authenticated;
