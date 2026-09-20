-- =============================================================================
-- Studuel — Migration 321 : la maîtrise s'agrège en base, plus dans le navigateur
--
-- CE QUE FAISAIT L'APP. `getChapterMastery` (lib/mastery.ts) lisait, à CHAQUE
-- affichage :
--
--     SELECT quiz_id, score, total FROM test_sessions WHERE user_id = …
--
-- sans limite et sans agrégat — pour n'en tirer, en JavaScript, qu'un
-- `max(score / total)` par quiz. Soit une ligne transférée par SESSION JOUÉE
-- depuis l'inscription, pour produire au plus une ligne par quiz du catalogue.
--
-- POURQUOI C'EST LE POINT LE PLUS COÛTEUX DU CODE. Trois facteurs se
-- multiplient :
--   · `test_sessions` est la table qui grossit le plus vite — à cent mille
--     élèves, ~3 M de lignes par jour, ~1 Md par an ;
--   · elle grossit PAR ÉLÈVE : un élève de terminale qui a commencé en seconde
--     traîne des milliers de lignes, et il les retransfère à chaque écran ;
--   · `getChapterMastery` a SEPT sites d'appel, dont /defi, /reviser, /moi et
--     Marcel — c'est-à-dire les écrans les plus vus de l'app.
--
-- Le coût est invisible aujourd'hui (quelques dizaines de lignes par élève) et
-- devient le premier poste de charge de la base à mesure que les comptes
-- vieillissent. C'est le pire profil de dette : rien ne se dégrade tant qu'on
-- regarde, puis tout se dégrade en même temps.
--
-- CE QUE FAIT `mastery_inputs()`. Le même calcul, là où sont les données :
-- l'agrégat rend une ligne par quiz JOUÉ (quelques centaines au maximum, borné
-- par le catalogue) au lieu d'une ligne par session jouée (non borné). Le
-- `GROUP BY (user_id, quiz_id)` tombe pile sur `test_sessions_user_quiz_idx`,
-- posé de longue date et jamais exploité pour cet usage.
--
-- SECURITY INVOKER, ET C'EST DÉLIBÉRÉ. La fonction n'a aucun privilège propre :
-- la RLS de `test_sessions` et de `lesson_completions` s'applique exactement
-- comme si l'élève interrogeait les tables lui-même. Une fonction SECURITY
-- DEFINER aurait ici contourné la RLS sur les deux tables les plus
-- personnelles de la base pour un simple gain de performance — le mauvais
-- marché. Le `user_id = (SELECT auth.uid())` explicite est donc REDONDANT avec
-- la RLS, et volontairement conservé : la couche sociale ouvrira un jour la
-- lecture croisée des sessions, et la maîtrise doit rester personnelle même ce
-- jour-là.
--
-- `(SELECT auth.uid())` et non `auth.uid()` : InitPlan évalué une fois, index
-- utilisable — la règle que la 320 rend permanente.
--
-- LE CODE TOLÈRE SON ABSENCE. `getChapterMastery` appelle cette RPC et retombe
-- sur l'ancienne lecture complète si elle répond PGRST202. Déployer avant
-- d'exécuter ne casse rien, comme partout dans ce projet.
--
-- PRÉREQUIS : 003 (test_sessions), 009 (lesson_completions). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.mastery_inputs()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    -- Le MEILLEUR essai de chaque quiz, ratio écrêté à 1 : miroir exact de ce
    -- que faisait la boucle JavaScript (`Math.min(score / total, 1)` puis
    -- `Math.max` par quiz). Un score supérieur au total — arrivé une fois, via
    -- un total corrigé après coup — ne doit pas gonfler la maîtrise.
    'best_per_quiz', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('quiz_id', b.quiz_id, 'ratio', b.ratio))
        FROM (
          SELECT ts.quiz_id,
                 max(least(ts.score::numeric / ts.total, 1)) AS ratio
            FROM public.test_sessions ts
           WHERE ts.user_id = (SELECT auth.uid())
             -- Les sessions sans quiz (file « À revoir », examen blanc) ne se
             -- rattachent à aucun chapitre : elles étaient déjà écartées côté
             -- JS, elles le sont ici — et en amont, donc sans transfert.
             AND ts.quiz_id IS NOT NULL
             AND ts.total > 0
           GROUP BY ts.quiz_id
        ) b
    ), '[]'::jsonb),

    'completed_lessons', COALESCE((
      SELECT jsonb_agg(lc.lesson_id)
        FROM public.lesson_completions lc
       WHERE lc.user_id = (SELECT auth.uid())
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.mastery_inputs() TO authenticated;

-- =============================================================================
-- MESURER LE GAIN — chiffrer plutôt que croire.
-- Colle l'UUID d'un élève qui a de l'historique dans le `sub` ci-dessous.
-- Ce qu'il faut regarder : le nombre de lignes RENDUES (une par quiz joué,
-- contre une par session jouée) et le plan (index sur test_sessions_user_quiz_idx).
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   EXPLAIN (ANALYZE, BUFFERS) SELECT public.mastery_inputs();
--   -- Pour comparaison, l'ancienne lecture :
--   EXPLAIN (ANALYZE, BUFFERS) SELECT quiz_id, score, total FROM public.test_sessions;
-- ROLLBACK;
