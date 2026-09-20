-- =============================================================================
-- 354 — Le catalogue compte ses questions EN BASE
--
-- LE PIÈGE (mesuré le 05/09/2026). PostgREST plafonne chaque réponse à 1 000
-- lignes (réglage « max rows » de l'API Supabase, valeur par défaut) et ne le
-- signale pas : `data` est simplement tronqué. Le catalogue a franchi ce seuil
-- sans bruit — 2 323 chapitres, 2 340 quiz, 18 262 questions. Résultats vus à
-- l'écran : des matières annoncées « Bientôt » alors qu'elles sont pleines, la
-- maîtrise calculée sur 43 % des quiz, et le nombre de questions de chaque
-- quiz (qui décide du « chapitre du jour » du Défi) connu pour une centaine de
-- quiz sur 2 340.
--
-- Côté TypeScript, TOUTES les lectures sans filtre paginent désormais
-- (lib/postgrest-pages). Mais compter 18 262 questions en 19 pages toutes les
-- cinq minutes est absurde quand Postgres sait compter : cette fonction rend
-- UNE ligne par quiz. Le code l'appelle d'abord, et pagine si elle est absente.
--
-- SECURITY INVOKER : elle lit `quiz_questions` avec les droits de l'appelant,
-- donc à travers la RLS de lecture anonyme du catalogue (026). Elle n'expose
-- rien de plus qu'un `select quiz_id from quiz_questions`, et ne rend que
-- des identifiants et des entiers.
--
-- PRÉREQUIS : 002 (quizzes, quiz_questions), 026 (lecture anon du catalogue).
-- Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.catalog_quiz_question_counts()
RETURNS TABLE (quiz_id UUID, n INTEGER)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT q.quiz_id, COUNT(*)::INTEGER AS n
  FROM public.quiz_questions q
  GROUP BY q.quiz_id
$$;

REVOKE ALL ON FUNCTION public.catalog_quiz_question_counts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.catalog_quiz_question_counts() TO anon, authenticated;

-- L'index (quiz_id) existe déjà pour les lectures par quiz ; le GROUP BY s'en
-- sert. Rien à ajouter.
