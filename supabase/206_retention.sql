-- =============================================================================
-- Studuel — Migration 206 : « Tableau de bord de rétention »
--
-- La directive n°1 : aucune décision de contenu ne se prend sans D1/D7/D30.
--
-- AUCUNE nouvelle table, aucun tracking à instrumenter. Les tables d'activité
-- existantes SONT le journal d'événements (challenge_sessions, test_sessions,
-- study_sessions, lesson_completions) et profiles.created_at donne la cohorte.
-- La rétention se calcule donc RÉTROACTIVEMENT sur tout l'historique dès la
-- première exécution — pas besoin d'attendre un mois pour savoir où on en est.
--
-- Définition : rétention « jour N » = l'élève est actif LE jour N après son
-- inscription (définition standard du jeu mobile, MIROIR de lib/retention.ts).
-- Une cohorte n'est comptée pour un horizon que si le jour N est déjà PASSÉ —
-- sinon une cohorte d'hier afficherait 0 % de J+7, ce qui est faux.
--
-- Sécurité : SECURITY DEFINER + garde `is_admin` explicite en première ligne.
-- La fonction lit les données de TOUS les élèves : sans cette garde, n'importe
-- quel compte authentifié pourrait compter la base entière avec la clé anon.
--
-- Coût : la fonction scanne les tables d'activité sur la fenêtre demandée. Un
-- index (user_id, created_at) est créé sur chacune — ils servent aussi aux
-- lectures « mon activité » de /moi et /defi, qui filtrent exactement pareil.
--
-- PRÉREQUIS : schema.sql (profiles), 008_reviser.sql (lesson_completions),
-- 011_defi.sql (challenge_sessions), test_sessions / study_sessions.
-- 028 pour profiles.is_admin. Idempotente.
-- À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Index de lecture ---------------------------------------------------------
-- Les quatre tables d'activité sont toujours lues « un élève, une fenêtre de
-- dates ». CONCURRENTLY est impossible dans un bloc transactionnel (le SQL
-- Editor en ouvre un) : création simple, ces tables restent petites.

CREATE INDEX IF NOT EXISTS challenge_sessions_user_date_idx
  ON public.challenge_sessions (user_id, created_at);
CREATE INDEX IF NOT EXISTS test_sessions_user_date_idx
  ON public.test_sessions (user_id, created_at);
CREATE INDEX IF NOT EXISTS study_sessions_user_date_idx
  ON public.study_sessions (user_id, created_at);
CREATE INDEX IF NOT EXISTS lesson_completions_user_date_idx
  ON public.lesson_completions (user_id, created_at);

-- --- Vue des jours actifs -----------------------------------------------------
-- Le journal d'événements unifié : (élève, jour UTC, nombre de sessions).
-- UNION ALL puis regroupement : une même journée avec un quiz ET un défi compte
-- pour UN jour actif mais DEUX sessions — la distinction porte toute la mesure
-- d'engagement (sessions/jour).
--
-- SECURITY INVOKER (défaut) : la vue est réservée aux RPC ci-dessous, qui sont
-- SECURITY DEFINER et gardées par is_admin. On ne l'expose pas au client.
CREATE OR REPLACE VIEW public.activity_days AS
  SELECT user_id,
         (created_at AT TIME ZONE 'utc')::date AS jour,
         count(*)::int AS sessions
    FROM (
      SELECT user_id, created_at FROM public.challenge_sessions
      UNION ALL
      SELECT user_id, created_at FROM public.test_sessions
      UNION ALL
      SELECT user_id, created_at FROM public.study_sessions
      UNION ALL
      SELECT user_id, created_at FROM public.lesson_completions
    ) tout
   WHERE user_id IS NOT NULL
   GROUP BY user_id, (created_at AT TIME ZONE 'utc')::date;

REVOKE ALL ON public.activity_days FROM PUBLIC;
REVOKE ALL ON public.activity_days FROM anon, authenticated;

-- --- RPC : le tableau de bord --------------------------------------------------
-- p_days : profondeur de l'historique de cohortes (borné 7..365, défaut 60).
-- Forme JSONB miroir de lib/retention.normalizeDashboard.
CREATE OR REPLACE FUNCTION public.retention_dashboard(p_days INTEGER DEFAULT 60)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_admin BOOLEAN := FALSE;
  v_today DATE := (now() AT TIME ZONE 'utc')::date;
  v_n     INTEGER := GREATEST(7, LEAST(COALESCE(p_days, 60), 365));
  v_from  DATE;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  SELECT COALESCE(is_admin, FALSE) INTO v_admin FROM public.profiles WHERE id = v_user;
  -- Garde explicite : la fonction agrège TOUTE la base.
  IF NOT v_admin THEN RETURN NULL; END IF;

  v_from := v_today - v_n;

  RETURN (
    WITH cohortes AS (
      SELECT p.id AS user_id,
             (p.created_at AT TIME ZONE 'utc')::date AS jour,
             p.grade_level
        FROM public.profiles p
       WHERE (p.created_at AT TIME ZONE 'utc')::date >= v_from
    ),
    -- Activité des seuls élèves des cohortes retenues : inutile de scanner
    -- l'activité des comptes plus anciens pour un calcul de cohorte.
    activite AS (
      SELECT a.user_id, a.jour, a.sessions
        FROM public.activity_days a
        JOIN cohortes c ON c.user_id = a.user_id
    ),
    par_cohorte AS (
      SELECT c.jour,
             count(*)::int AS taille,
             count(*) FILTER (
               WHERE EXISTS (SELECT 1 FROM activite a
                              WHERE a.user_id = c.user_id AND a.jour = c.jour + 1)
             )::int AS d1,
             count(*) FILTER (
               WHERE EXISTS (SELECT 1 FROM activite a
                              WHERE a.user_id = c.user_id AND a.jour = c.jour + 7)
             )::int AS d7,
             count(*) FILTER (
               WHERE EXISTS (SELECT 1 FROM activite a
                              WHERE a.user_id = c.user_id AND a.jour = c.jour + 30)
             )::int AS d30
        FROM cohortes c
       GROUP BY c.jour
    ),
    -- L'entonnoir d'arrivée, sur la même fenêtre : là où on perd les gens
    -- AVANT de pouvoir parler de rétention.
    entonnoir AS (
      SELECT
        (SELECT count(*) FROM cohortes)::int AS inscrits,
        (SELECT count(*) FROM cohortes
          WHERE grade_level IS NOT NULL AND grade_level <> '')::int AS classe,
        (SELECT count(*) FROM cohortes c
          WHERE EXISTS (SELECT 1 FROM activite a WHERE a.user_id = c.user_id))::int
          AS premiere,
        (SELECT count(*) FROM cohortes c
          WHERE EXISTS (SELECT 1 FROM activite a
                         WHERE a.user_id = c.user_id AND a.jour = c.jour + 1))::int
          AS revenus
    ),
    -- Activité globale des 14 derniers jours (TOUS les élèves, pas seulement
    -- les nouveaux) : c'est la santé courante, pas celle des cohortes.
    quotidien AS (
      SELECT jour,
             count(DISTINCT user_id)::int AS actifs,
             SUM(sessions)::int AS sessions
        FROM public.activity_days
       WHERE jour >= v_today - 14
       GROUP BY jour
    )
    SELECT jsonb_build_object(
      'total_users', (SELECT count(*) FROM public.profiles),
      'cohorts', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'day', jour,
                 'size', taille,
                 'd1', d1, 'd7', d7, 'd30', d30,
                 -- Mesurable seulement si le jour N est déjà passé.
                 'd1_measurable', (jour + 1) <= v_today,
                 'd7_measurable', (jour + 7) <= v_today,
                 'd30_measurable', (jour + 30) <= v_today
               ) ORDER BY jour DESC)
          FROM par_cohorte), '[]'::jsonb),
      'funnel', (
        SELECT jsonb_build_array(
          jsonb_build_object('id', 'inscrits',  'label', 'Comptes créés',      'count', inscrits),
          jsonb_build_object('id', 'classe',    'label', 'Classe choisie',      'count', classe),
          jsonb_build_object('id', 'activite',  'label', 'Première activité',   'count', premiere),
          jsonb_build_object('id', 'revenus',   'label', 'Revenus le lendemain','count', revenus)
        ) FROM entonnoir),
      'activity', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'day', jour, 'active_users', actifs, 'sessions', sessions
               ) ORDER BY jour)
          FROM quotidien), '[]'::jsonb)
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.retention_dashboard(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.retention_dashboard(INTEGER) TO authenticated;

-- --- Vérifications -------------------------------------------------------------
--   select public.retention_dashboard(60);   → JSONB (compte admin)
--                                            → NULL  (compte élève : garde OK)
--   select * from public.activity_days limit 5;  → doit ÉCHOUER en anon/authenticated
