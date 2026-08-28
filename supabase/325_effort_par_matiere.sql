-- =============================================================================
-- Studuel — Migration 325 : l'EFFORT PAR MATIÈRE, agrégé en base
--
-- CE QU'IL FAUT SAVOIR AVANT DE LIRE : IL N'Y A PAS DE CHRONO PAR MATIÈRE.
--
-- Le temps de travail existe à deux endroits, et aucun des deux n'est ventilé
-- par matière : `profiles.work_seconds` (migration 014) est un cumul global, et
-- `work_daily` (084) le découpe par JOUR, pas par dossier. Le diagramme de /moi
-- demande pourtant « combien de travail dans chaque matière ». Deux sorties
-- possibles :
--
--   1. ventiler le chrono — nouvelle table alimentée par `add_work_time`, avec
--      un paramètre matière. Correct, mais la 084 dit elle-même ce que ça coûte :
--      « aucune reprise possible de l'historique ». Le diagramme serait VIDE pour
--      tous les comptes existants, et le resterait des semaines ;
--   2. mesurer le VOLUME de travail à partir de ce qui est déjà enregistré et
--      déjà rattaché à une matière. Rétroactif dès la première exécution.
--
-- C'est la 2 qui est retenue, et le mot compte : ce n'est pas un temps, c'est un
-- VOLUME — des questions répondues et des leçons lues. L'app en dérive une durée
-- affichée avec un « ≈ », jamais un chiffre au chrono (cf. lib/effort.ts).
--
-- LE CHEMIN VERS LA MATIÈRE EST LE SLUG, JAMAIS LE NOM. `quizzes.subject` et
-- `flashcard_decks.subject` sont des TEXTES libres (« Maths », « Histoire »…),
-- hérités des seeds de 2024 : les rapprocher de `subjects.name` marcherait pour
-- la moitié des matières et échouerait en silence sur l'autre. On passe donc
-- toujours par `lesson_id → lessons → chapters → subjects.slug`, qui est une
-- chaîne de clés étrangères.
--
-- CONSÉQUENCE ASSUMÉE : deux sources sont exclues.
--   · `study_sessions` (flashcards) — `flashcard_decks` n'a pas de `lesson_id`,
--     seulement un nom de matière en texte libre. Aucun chemin fiable ;
--   · `challenge_sessions` (Défi) — la table ne porte AUCUNE matière (011).
-- Le diagramme mesure donc le travail de RÉVISION (quiz + cours), et c'est ce
-- que son libellé doit dire. Le jour où l'une des deux gagne un rattachement,
-- elle s'ajoute ici sans rien changer au reste.
--
-- POURQUOI UNE RPC ET PAS UN SELECT. Même raison que la 321 : `test_sessions`
-- est la table qui grossit le plus vite de la base. Lire ses lignes pour n'en
-- tirer qu'une somme par matière ferait transférer des milliers de lignes à
-- chaque ouverture de /moi, pour produire au plus une ligne par matière du
-- catalogue. L'agrégat descend là où sont les données.
--
-- PRÉREQUIS : 003 (test_sessions), 008 (chapters/lessons/subjects), 009
-- (lesson_completions), et `quizzes.lesson_id` (008, § rattachement).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- effort_by_subject(p_days) — une ligne par matière TRAVAILLÉE sur la fenêtre.
--
-- SECURITY DEFINER et filtre sur auth.uid() : la fonction ne rend jamais que
-- l'effort de l'appelant. `search_path` figé (durcissement de la 320).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.effort_by_subject(p_days INTEGER DEFAULT 30)
RETURNS TABLE (subject_slug TEXT, questions BIGINT, lessons BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  WITH bornes AS (
    -- Fenêtre bornée des deux côtés : au moins un jour, au plus deux ans. Un
    -- appelant ne doit pas pouvoir demander « depuis toujours » et faire scanner
    -- l'historique entier d'un compte de terminale.
    SELECT now() - (LEAST(GREATEST(COALESCE(p_days, 30), 1), 730) || ' days')::INTERVAL AS depuis
  ),
  quiz AS (
    SELECT c.subject_id, SUM(t.total)::BIGINT AS questions
    FROM public.test_sessions t
    JOIN public.quizzes  q ON q.id = t.quiz_id
    JOIN public.lessons  l ON l.id = q.lesson_id
    JOIN public.chapters c ON c.id = l.chapter_id
    WHERE t.user_id = auth.uid()
      AND t.created_at >= (SELECT depuis FROM bornes)
      AND t.total > 0
    GROUP BY c.subject_id
  ),
  cours AS (
    SELECT c.subject_id, COUNT(*)::BIGINT AS lessons
    FROM public.lesson_completions lc
    JOIN public.lessons  l ON l.id = lc.lesson_id
    JOIN public.chapters c ON c.id = l.chapter_id
    WHERE lc.user_id = auth.uid()
      AND lc.created_at >= (SELECT depuis FROM bornes)
    GROUP BY c.subject_id
  )
  SELECT
    s.slug::TEXT,
    COALESCE(quiz.questions, 0)::BIGINT,
    COALESCE(cours.lessons, 0)::BIGINT
  FROM public.subjects s
  LEFT JOIN quiz  ON quiz.subject_id  = s.id
  LEFT JOIN cours ON cours.subject_id = s.id
  -- Une matière jamais touchée ne remonte PAS : le diagramme la fera apparaître
  -- lui-même à zéro si elle est au programme de l'élève. C'est à lui de décider
  -- quelles matières méritent une ligne, pas à la base.
  WHERE COALESCE(quiz.questions, 0) > 0 OR COALESCE(cours.lessons, 0) > 0;
$$;

-- Le cliquet de la 320 : « FROM PUBLIC » seul ne ferme RIEN sur ce projet — les
-- droits d'exécution sont hérités par anon ET authenticated. On révoque les
-- trois, puis on rend l'exécution au seul rôle connecté.
REVOKE ALL ON FUNCTION public.effort_by_subject(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.effort_by_subject(INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- Index de l'agrégat quiz. `test_sessions_user_created_idx` (003) couvre déjà
-- (user_id, created_at DESC) : c'est exactement le filtre de la CTE `quiz`.
-- Rien à ajouter côté sessions. Côté chaîne, les clés étrangères sont indexées
-- par leurs PK. On pose seulement l'index manquant sur `quizzes.lesson_id`, que
-- la jointure parcourt et qui n'a pas d'index propre.
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS quizzes_lesson_idx ON public.quizzes (lesson_id);
