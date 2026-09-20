-- =============================================================================
-- Studuel — Migration 323 : la série se calcule en base, pas dans le navigateur
--
-- CE QUE FAISAIT `/reviser`. Quatre lectures, à chaque affichage, sur les
-- quatre tables d'activité de l'élève, sur une fenêtre de 400 jours :
--
--     SELECT created_at, score        FROM test_sessions      WHERE user_id = …
--     SELECT created_at, cards_count  FROM study_sessions     WHERE user_id = …
--     SELECT created_at              FROM lesson_completions  WHERE user_id = …
--     SELECT created_at, xp          FROM challenge_sessions  WHERE user_id = …
--
-- … pour n'en tirer, au bout du compte, qu'un `Set` de chaînes « YYYY-MM-DD » :
-- les JOURS où l'élève a travaillé, dont on déduit la flamme de série et la
-- grille de la semaine.
--
-- DEUX GASPILLAGES, ET LE SECOND EST PIRE QUE LE PREMIER.
--
--   1. Le VOLUME. Un élève assidu joue plusieurs sessions par jour : sur
--      400 jours, ce sont des milliers de lignes transférées pour produire au
--      plus 400 chaînes. Le rapport ne s'améliore jamais — il empire à chaque
--      session jouée, et `test_sessions` est la table qui grossit le plus vite
--      du projet.
--
--   2. LES COLONNES INUTILES. Ces lectures ramènent `score`, `cards_count` et
--      `xp` — le commentaire de la page dit qu'elles « alimentent l'XP du
--      header ». Ce n'est plus vrai : la seule consommation de ces quatre
--      résultats est `.map(s => s.created_at.slice(0, 10))`. On transportait
--      donc trois colonnes de données pour rien, sur les quatre tables les plus
--      volumineuses de la base.
--
-- CE QUE FAIT `jours_actifs()`. Exactement le `DISTINCT` que fait déjà la CTE
-- `days` de `child_dashboard` (199, puis 319) — les mêmes quatre sources, la
-- même fenêtre. Elle rend un tableau de clés UTC : au plus 400 entrées, quel
-- que soit l'usage de l'élève. Le calcul de la série lui-même reste en
-- TypeScript (`computeStreak`, `weekProgress`), là où il est testé.
--
-- SECURITY INVOKER : la RLS des quatre tables s'applique comme si l'élève les
-- interrogeait lui-même. Ces tables sont son historique personnel — les ouvrir
-- via une fonction à privilèges pour économiser des lignes serait un très
-- mauvais échange.
--
-- `p_since` plutôt qu'un intervalle en dur : la fenêtre d'activité est définie
-- par `ACTIVITY_WINDOW_DAYS` (lib/streak.ts) et doit le rester. Une valeur
-- écrite ici en dur finirait par diverger de celle du code, et la série
-- changerait selon le chemin — le genre d'écart qu'on ne remarque jamais.
--
-- LE CODE TOLÈRE SON ABSENCE : `/reviser` refait ses quatre lectures si la RPC
-- répond PGRST202.
--
-- PRÉREQUIS : 003, 009, 011, et les sessions d'étude. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.jours_actifs(p_since TIMESTAMPTZ)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(d ORDER BY d), '[]'::jsonb)
    FROM (
      SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
        FROM (
          SELECT created_at FROM public.test_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.study_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.lesson_completions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.challenge_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
        ) act
    ) jours;
$$;

GRANT EXECUTE ON FUNCTION public.jours_actifs(TIMESTAMPTZ) TO authenticated;

-- =============================================================================
-- MESURER — le nombre de lignes RENDUES est le point : au plus 400 ici, contre
-- une par session jouée avant.
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT jsonb_array_length(public.jours_actifs(now() - INTERVAL '400 days'));
--   EXPLAIN (ANALYZE, BUFFERS) SELECT public.jours_actifs(now() - INTERVAL '400 days');
-- ROLLBACK;
