-- =============================================================================
-- 589 — LES INSIGHTS DE STUDUEL (16/10/2026)
--
-- Lucas : « je veux avoir le maximum d'insights de l'app : les matières les
-- plus appréciées, ce qui est très utilisé, peu utilisé, ce qui doit être
-- traité… un maximum de données sur l'utilisation et le comportement de mes
-- users, pour mieux agir et faire de meilleures mises à jour ».
--
-- Tout est tiré de ce que la base contient DÉJÀ (aucun suivi nouveau ici ; le
-- journal de navigation est la 590) :
--   admin_insights(p_jours)   l'audience, l'activité jour par jour, l'usage de
--                             chaque fonctionnalité (xp_events par source), les
--                             matières (quiz et leçons), les jeux, Marcel, les
--                             heures et les jours de travail, les achats ;
--   admin_contenu_a_traiter() les questions que presque tout le monde rate,
--                             les quiz aux scores bas, les chapitres jamais
--                             ouverts, les erreurs de la semaine.
-- Réservées à l'admin (garde explicite : elles agrègent toute la base).
--
-- PRÉREQUIS : 002, 003, 008, 009, 021, 084, 183, 192, 221, 238, 352, 366,
-- 557, 559, 581. Idempotente. À exécuter à la main.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_insights(p_jours INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n     INTEGER := GREATEST(7, LEAST(COALESCE(p_jours, 30), 365));
  v_today DATE := (now() AT TIME ZONE 'utc')::date;
  v_from  DATE;
  v_ts    TIMESTAMPTZ;
  v_avant TIMESTAMPTZ;
BEGIN
  IF NOT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false) THEN
    RETURN NULL;
  END IF;
  v_from  := v_today - (v_n - 1);
  v_ts    := v_from::timestamp AT TIME ZONE 'utc';
  v_avant := v_ts - make_interval(days => v_n);

  RETURN jsonb_build_object(
    'periode', jsonb_build_object('jours', v_n, 'depuis', v_from, 'jusqua', v_today),

    'audience', (
      SELECT jsonb_build_object(
        'comptes', count(*),
        'eleves', count(*) FILTER (WHERE profile_type IS DISTINCT FROM 'parent' AND profile_type IS DISTINCT FROM 'coach'),
        'parents', count(*) FILTER (WHERE profile_type = 'parent'),
        'coachs', count(*) FILTER (WHERE profile_type = 'coach'),
        'plus', count(*) FILTER (WHERE subscription_tier IN ('tier1', 'tier2', 'tier3')),
        'nouveaux', count(*) FILTER (WHERE created_at >= v_ts),
        'nouveaux_avant', count(*) FILTER (WHERE created_at >= v_avant AND created_at < v_ts))
        FROM public.profiles),

    'classes', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('classe', classe, 'n', n) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT COALESCE(grade_level, '?') AS classe, count(*) AS n
                FROM public.profiles
               WHERE profile_type IS DISTINCT FROM 'parent' AND profile_type IS DISTINCT FROM 'coach'
               GROUP BY 1) t),

    -- L'activité jour par jour : inscrits, élèves actifs (du temps, un quiz ou
    -- de l'XP ce jour-là), minutes de travail, quiz joués.
    'jours', (
      WITH j AS (SELECT generate_series(v_from, v_today, INTERVAL '1 day')::date AS jour),
      ins AS (SELECT (created_at AT TIME ZONE 'utc')::date AS jour, count(*) AS n
                FROM public.profiles WHERE created_at >= v_ts GROUP BY 1),
      tps AS (SELECT day AS jour, sum(seconds) AS s FROM public.work_daily
               WHERE day >= v_from AND seconds > 0 GROUP BY 1),
      qz AS (SELECT (created_at AT TIME ZONE 'utc')::date AS jour, count(*) AS n
               FROM public.test_sessions WHERE created_at >= v_ts GROUP BY 1),
      act AS (SELECT jour, count(DISTINCT user_id) AS n FROM (
                SELECT day AS jour, user_id FROM public.work_daily WHERE day >= v_from AND seconds > 0
                UNION ALL
                SELECT (created_at AT TIME ZONE 'utc')::date, user_id FROM public.test_sessions WHERE created_at >= v_ts
                UNION ALL
                SELECT (created_at AT TIME ZONE 'utc')::date, user_id FROM public.xp_events WHERE created_at >= v_ts
              ) u GROUP BY jour)
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'jour', j.jour,
               'inscrits', COALESCE(ins.n, 0),
               'actifs', COALESCE(act.n, 0),
               'minutes', round(COALESCE(tps.s, 0) / 60.0),
               'quiz', COALESCE(qz.n, 0)) ORDER BY j.jour), '[]'::jsonb)
        FROM j
        LEFT JOIN ins ON ins.jour = j.jour
        LEFT JOIN tps ON tps.jour = j.jour
        LEFT JOIN qz  ON qz.jour  = j.jour
        LEFT JOIN act ON act.jour = j.jour),

    -- Les élèves actifs sur 1, 7, 30 jours et sur la période (temps ou XP).
    'actifs', (
      WITH a AS (
        SELECT user_id, day AS jour FROM public.work_daily WHERE day >= LEAST(v_from, v_today - 29) AND seconds > 0
        UNION ALL
        SELECT user_id, (created_at AT TIME ZONE 'utc')::date FROM public.xp_events
         WHERE created_at >= (LEAST(v_from, v_today - 29))::timestamp AT TIME ZONE 'utc')
      SELECT jsonb_build_object(
        'jour', count(DISTINCT user_id) FILTER (WHERE jour = v_today),
        'semaine', count(DISTINCT user_id) FILTER (WHERE jour > v_today - 7),
        'mois', count(DISTINCT user_id) FILTER (WHERE jour > v_today - 30),
        'periode', count(DISTINCT user_id) FILTER (WHERE jour >= v_from))
        FROM a),

    'temps', (
      SELECT jsonb_build_object(
        'minutes', round(COALESCE(sum(seconds), 0) / 60.0),
        'eleves', count(DISTINCT user_id),
        'jours_eleve', count(*))
        FROM public.work_daily WHERE day >= v_from AND seconds > 0),

    -- L'usage de chaque fonctionnalité : l'XP est versée par presque chaque
    -- geste de l'app, sa SOURCE dit lequel (lib/economie).
    'fonctionnalites', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('source', source, 'n', n, 'eleves', e, 'xp', xp) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT source, count(*) AS n, count(DISTINCT user_id) AS e, sum(amount) AS xp
                FROM public.xp_events WHERE created_at >= v_ts GROUP BY source) t),
    'fonctionnalites_avant', (
      SELECT COALESCE(jsonb_object_agg(source, n), '{}'::jsonb)
        FROM (SELECT source, count(*) AS n FROM public.xp_events
               WHERE created_at >= v_avant AND created_at < v_ts GROUP BY source) t),

    -- Les matières : quiz joués (et leur score moyen), leçons lues.
    'matieres', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('matiere', matiere, 'sessions', n, 'eleves', e,
               'score', round(s, 3)) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT q.subject AS matiere, count(*) AS n, count(DISTINCT ts.user_id) AS e,
                     avg(least(ts.score::numeric / NULLIF(ts.total, 0), 1)) AS s
                FROM public.test_sessions ts JOIN public.quizzes q ON q.id = ts.quiz_id
               WHERE ts.created_at >= v_ts AND ts.total > 0
               GROUP BY q.subject) t),
    'lecons', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('matiere', matiere, 'lectures', n, 'eleves', e) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT s.name AS matiere, count(*) AS n, count(DISTINCT lc.user_id) AS e
                FROM public.lesson_completions lc
                JOIN public.lessons l ON l.id = lc.lesson_id
                JOIN public.chapters c ON c.id = l.chapter_id
                JOIN public.subjects s ON s.id = c.subject_id
               WHERE lc.created_at >= v_ts
               GROUP BY s.name) t),

    'jeux', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('jeu', game_id, 'parties', n, 'eleves', e, 'victoires', w) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT game_id, count(*) AS n, count(DISTINCT user_id) AS e, count(*) FILTER (WHERE won) AS w
                FROM public.game_matches WHERE created_at >= v_ts GROUP BY game_id) t),
    'modes', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('mode', mode_id, 'parties', n, 'eleves', e) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT mode_id, count(*) AS n, count(DISTINCT user_id) AS e
                FROM public.mode_runs WHERE created_at >= v_ts GROUP BY mode_id) t),
    'marcel', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('mode', mode, 'appels', n, 'eleves', e) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT mode, count(*) AS n, count(DISTINCT user_id) AS e
                FROM public.marcel_usage WHERE cree_le >= v_ts GROUP BY mode) t),

    -- Quand on travaille : heure de Paris et jour de la semaine (lundi = 1).
    'heures', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('h', h, 'n', n) ORDER BY h), '[]'::jsonb)
        FROM (SELECT extract(hour FROM created_at AT TIME ZONE 'Europe/Paris')::int AS h, count(*) AS n
                FROM (SELECT created_at FROM public.xp_events WHERE created_at >= v_ts
                      UNION ALL
                      SELECT created_at FROM public.test_sessions WHERE created_at >= v_ts) u
               GROUP BY 1) t),
    'semaine', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('j', j, 'n', n) ORDER BY j), '[]'::jsonb)
        FROM (SELECT extract(isodow FROM created_at AT TIME ZONE 'Europe/Paris')::int AS j, count(*) AS n
                FROM (SELECT created_at FROM public.xp_events WHERE created_at >= v_ts
                      UNION ALL
                      SELECT created_at FROM public.test_sessions WHERE created_at >= v_ts) u
               GROUP BY 1) t),

    'achats', jsonb_build_object(
      'fiches', (SELECT count(*) FROM public.chapter_unlocks WHERE created_at >= v_ts),
      'capsules', (SELECT count(*) FROM public.capsule_achats WHERE achetee_le >= v_ts),
      'demandes_plus', (SELECT count(*) FROM public.subscription_interest WHERE created_at >= v_ts),
      'annales_commencees', (SELECT count(*) FROM public.annales_travail WHERE commence_le >= v_ts),
      'annales_terminees', (SELECT count(*) FROM public.annales_travail WHERE termine_le >= v_ts)),

    'gemmes', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('source', source, 'gemmes', g, 'eleves', e) ORDER BY g DESC), '[]'::jsonb)
        FROM (SELECT source, sum(amount) AS g, count(DISTINCT user_id) AS e
                FROM public.gem_events WHERE created_at >= v_ts GROUP BY source) t)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.admin_insights(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insights(INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- CE QUI DOIT ÊTRE TRAITÉ
-- -----------------------------------------------------------------------------
-- questions : une question est dans la file « À revoir » (review_items) d'un
--   élève quand il l'a ratée. Rapporté au nombre d'élèves qui ont joué son
--   quiz, cela donne un TAUX D'ÉCHEC — au-delà de 70 % sur 5 joueurs ou plus,
--   la question est souvent fausse, ambiguë ou hors programme.
-- quiz_bas : les quiz au score moyen le plus bas (10 sessions au moins).
-- chapitres_muets : par matière et par classe, les chapitres dont aucune leçon
--   n'a jamais été lue (contenu inutile, ou introuvable).
-- erreurs : les erreurs les plus fréquentes des 7 derniers jours (559).
CREATE OR REPLACE FUNCTION public.admin_contenu_a_traiter()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false) THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'questions', (
      WITH rates AS (
        SELECT item_id, count(DISTINCT user_id) AS eleves, sum(lapses) AS rechutes
          FROM public.review_items WHERE item_kind = 'question' GROUP BY item_id),
      joueurs AS (
        SELECT quiz_id, count(DISTINCT user_id) AS n FROM public.test_sessions
         WHERE quiz_id IS NOT NULL GROUP BY quiz_id)
      SELECT COALESCE(jsonb_agg(x ORDER BY (x->>'taux')::numeric DESC, (x->>'eleves')::int DESC), '[]'::jsonb) FROM (
        SELECT jsonb_build_object(
                 'id', qq.id, 'question', left(qq.question, 240), 'quiz_id', q.id, 'quiz', q.title,
                 'matiere', q.subject, 'classe', q.grade_level,
                 'eleves', r.eleves, 'joueurs', j.n, 'rechutes', r.rechutes,
                 'taux', round(r.eleves::numeric / NULLIF(j.n, 0), 3)) AS x
          FROM rates r
          JOIN public.quiz_questions qq ON qq.id = r.item_id
          JOIN public.quizzes q ON q.id = qq.quiz_id
          JOIN joueurs j ON j.quiz_id = q.id
         WHERE j.n >= 5
         ORDER BY r.eleves::numeric / NULLIF(j.n, 0) DESC, r.eleves DESC
         LIMIT 60) t),

    'quiz_bas', (
      SELECT COALESCE(jsonb_agg(x ORDER BY (x->>'score')::numeric ASC), '[]'::jsonb) FROM (
        SELECT jsonb_build_object('quiz_id', q.id, 'quiz', q.title, 'matiere', q.subject, 'classe', q.grade_level,
                                  'sessions', count(*), 'eleves', count(DISTINCT ts.user_id),
                                  'score', round(avg(least(ts.score::numeric / NULLIF(ts.total, 0), 1)), 3)) AS x
          FROM public.test_sessions ts JOIN public.quizzes q ON q.id = ts.quiz_id
         WHERE ts.total > 0
         GROUP BY q.id, q.title, q.subject, q.grade_level
        HAVING count(*) >= 10
         ORDER BY avg(least(ts.score::numeric / NULLIF(ts.total, 0), 1)) ASC
         LIMIT 30) t),

    'chapitres_muets', (
      WITH lus AS (
        SELECT DISTINCT l.chapter_id FROM public.lesson_completions lc JOIN public.lessons l ON l.id = lc.lesson_id)
      SELECT COALESCE(jsonb_agg(jsonb_build_object('matiere', matiere, 'classe', classe, 'muets', muets, 'total', total,
                                                   'exemples', exemples) ORDER BY muets DESC), '[]'::jsonb)
        FROM (SELECT s.name AS matiere, c.level AS classe,
                     count(*) FILTER (WHERE lus.chapter_id IS NULL) AS muets,
                     count(*) AS total,
                     (array_agg(c.title ORDER BY c.position) FILTER (WHERE lus.chapter_id IS NULL))[1:4] AS exemples
                FROM public.chapters c
                JOIN public.subjects s ON s.id = c.subject_id
                LEFT JOIN lus ON lus.chapter_id = c.id
               GROUP BY s.name, c.level
              HAVING count(*) FILTER (WHERE lus.chapter_id IS NULL) > 0) t),

    'erreurs', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('message', message, 'n', n, 'eleves', e, 'dernier', d) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT left(message, 200) AS message, count(*) AS n, count(DISTINCT user_id) AS e, max(cree_le) AS d
                FROM public.erreurs_app WHERE cree_le > now() - INTERVAL '7 days'
               GROUP BY left(message, 200)
               ORDER BY count(*) DESC LIMIT 15) t)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.admin_contenu_a_traiter() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_contenu_a_traiter() TO authenticated;

-- =============================================================================
-- CONTRÔLES (connecté en admin) :
--   select public.admin_insights(30) ? 'audience';        → true
--   select public.admin_contenu_a_traiter() ? 'questions'; → true
-- Sans être admin : NULL.
-- =============================================================================
