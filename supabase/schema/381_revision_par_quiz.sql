-- =============================================================================
-- Studuel — Migration 381 : LA RÉVISION PAR QUIZ, agrégée en base (24/09/2026)
--
-- LE BUT. L'onglet Moi montre un récap « les matières que je révise le plus » :
-- une colonne par matière, dont la hauteur suit le nombre de QUESTIONS
-- travaillées. La maîtrise (`mastery_inputs`, 321) ne rend que le MEILLEUR
-- score de chaque quiz — elle ne dit pas combien de fois on y est revenu. Il
-- faut donc un second agrégat, aussi léger : par quiz joué, le nombre de
-- séances et la somme des questions.
--
-- POURQUOI UNE RPC ET PAS UN SELECT (le raisonnement de la 321 et de la 325).
-- `test_sessions` est la table qui grossit le plus vite de la base, et elle
-- grossit PAR ÉLÈVE : lire ses lignes pour n'en tirer que des sommes ferait
-- transférer tout l'historique d'un compte à chaque ouverture de /moi.
-- L'agrégat rend UNE ligne par quiz joué (bornée par le catalogue) au lieu
-- d'une ligne par séance (non bornée).
--
-- LA MATIÈRE SE RETROUVE CÔTÉ APP. La correspondance quiz → leçon → chapitre →
-- matière est faite par l'app avec la charpente du catalogue, déjà en cache
-- serveur (lib/catalog) : la base ne rejoue pas ici les jointures de la 325,
-- et la fonction reste une simple lecture d'une table, sur un index.
--
-- SECURITY INVOKER, ET C'EST DÉLIBÉRÉ (comme `mastery_inputs`). La fonction n'a
-- aucun privilège propre : la RLS de `test_sessions` reste seule maîtresse du
-- périmètre. Le filtre `user_id = (SELECT auth.uid())` est REDONDANT avec la
-- RLS et volontairement conservé : le jour où la couche sociale ouvrira la
-- lecture croisée des séances, ce récap restera personnel.
--
-- L'INDEX EST DÉJÀ LÀ. `test_sessions_user_quiz_idx (user_id, quiz_id)` (223)
-- sert exactement ce filtre et ce regroupement, dans l'ordre, sans tri — c'est
-- aussi celui de la 321 ; `test_sessions_user_created_idx` (003) sert le même
-- filtre si le planificateur le préfère. Jamais de parcours de toute la table.
-- Rien à ajouter : un index couvrant de plus (INCLUDE total) épargnerait la
-- lecture des lignes, mais coûterait à CHAQUE écriture de la table la plus
-- écrite de la base, pour un écran qui lit quelques centaines de lignes.
--
-- Les séances sans quiz (file « À revoir », examen blanc) ne se rattachent à
-- aucune matière, et une séance à 0 question ne pèse rien : elles sont écartées
-- en amont, comme dans la 321.
--
-- LE CODE TOLÈRE SON ABSENCE : l'app se replie sur les 1 000 dernières séances
-- si la RPC répond PGRST202. Déployer avant d'exécuter ne casse rien.
--
-- PRÉREQUIS : 003 (test_sessions), 223 (test_sessions_user_quiz_idx), 321
-- (mastery_inputs, dont c'est le pendant). À exécuter APRÈS la 380.
-- Idempotent. À exécuter à la main dans : Supabase Dashboard → SQL Editor →
-- New query → Run.
-- =============================================================================

-- [{ quiz_id, seances, questions }] : pour chaque quiz joué par l'élève
-- connecté, le nombre de séances et la somme des questions (total). Trié par
-- quiz_id (une réponse stable) ; '[]' si rien.
CREATE OR REPLACE FUNCTION public.revision_par_quiz()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_agg(jsonb_build_object(
                'quiz_id', r.quiz_id,
                'seances', r.seances,
                'questions', r.questions)
              ORDER BY r.quiz_id),
    '[]'::jsonb)
    FROM (
      SELECT ts.quiz_id,
             count(*)::INTEGER       AS seances,
             sum(ts.total)::INTEGER  AS questions
        FROM public.test_sessions ts
       WHERE ts.user_id = (SELECT auth.uid())
         AND ts.quiz_id IS NOT NULL
         AND ts.total > 0
       GROUP BY ts.quiz_id
    ) r;
$$;

REVOKE ALL ON FUNCTION public.revision_par_quiz() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revision_par_quiz() TO authenticated;

-- =============================================================================
-- MESURER (facultatif) — colle l'UUID d'un élève qui a de l'historique :
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT jsonb_array_length(public.revision_par_quiz());  -- une ligne par quiz joué
--   -- Le plan de la requête intérieure (celui d'une fonction reste opaque) :
--   EXPLAIN (ANALYZE, BUFFERS)
--   SELECT ts.quiz_id, count(*), sum(ts.total) FROM public.test_sessions ts
--    WHERE ts.user_id = (SELECT auth.uid()) AND ts.quiz_id IS NOT NULL AND ts.total > 0
--    GROUP BY ts.quiz_id;
--   -- attendu : un parcours de test_sessions_user_quiz_idx.
-- ROLLBACK;
-- =============================================================================
