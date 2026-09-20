-- =============================================================================
-- Studuel — Migration 056 : quiz de leçon, Maths expertes Tle
--   (3 quiz, 9 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés (tables quizzes,
--             quiz_questions, subjects/chapters/lessons + colonne quizzes.lesson_id).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon
--   (n'insère un quiz que si la leçon n'en a pas déjà un — le hub de leçon lit
--    le quiz en .maybeSingle(), donc une leçon ne doit porter qu'UN quiz).
-- Rattachement par clés stables : slug matière → (niveau, titre chapitre) →
--   titre leçon « L'essentiel du cours ». Aucune donnée existante n'est modifiée.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — un quiz rattaché à « L'essentiel du cours » de chaque chapitre
--    de Maths expertes (option Terminale ; le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Maths expertes', v.level, v.chapter, true, l.id
FROM (VALUES
  ('05600000-0000-4000-8000-000000000001'::uuid, 'Tle', 'Nombres complexes',          'Nombres complexes'),
  ('05600000-0000-4000-8000-000000000002'::uuid, 'Tle', 'Arithmétique : congruences', 'Arithmétique : congruences'),
  ('05600000-0000-4000-8000-000000000003'::uuid, 'Tle', 'Matrices et graphes',        'Matrices et graphes')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'maths-expertes'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — 3 questions par quiz (créées seulement si le quiz existe).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Quiz 1 — Nombres complexes
  ('05610000-0000-4000-8000-000000000011'::uuid, '05600000-0000-4000-8000-000000000001'::uuid,
   'Quelle est la forme algébrique de (1 + i)² ?', 'mcq',
   '["1 + 2i", "2", "2i", "-2i"]', 2,
   '(1 + i)² = 1 + 2i + i² = 1 + 2i - 1 = 2i, car i² = -1.', 1),
  ('05610000-0000-4000-8000-000000000012'::uuid, '05600000-0000-4000-8000-000000000001'::uuid,
   'Le module du nombre complexe z = 3 + 4i vaut 5.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le module vaut racine de (3² + 4²) = racine de 25 = 5.', 2),
  ('05610000-0000-4000-8000-000000000013'::uuid, '05600000-0000-4000-8000-000000000001'::uuid,
   'Quel est le conjugué du nombre complexe z = 2 - 5i ?', 'mcq',
   '["-2 + 5i", "2 + 5i", "2 - 5i", "5 - 2i"]', 1,
   'Le conjugué change le signe de la partie imaginaire : conjugué de 2 - 5i = 2 + 5i.', 3),

  -- Quiz 2 — Arithmétique : congruences
  ('05610000-0000-4000-8000-000000000021'::uuid, '05600000-0000-4000-8000-000000000002'::uuid,
   'Quel est le reste de la division euclidienne de 17 par 5, c''est-à-dire l''entier r tel que 17 ≡ r [5] avec 0 ≤ r < 5 ?', 'mcq',
   '["0", "1", "2", "3"]', 2,
   '17 = 3 × 5 + 2, donc 17 ≡ 2 [5] : le reste vaut 2.', 1),
  ('05610000-0000-4000-8000-000000000022'::uuid, '05600000-0000-4000-8000-000000000002'::uuid,
   'Quel est le PGCD de 24 et 36 ?', 'mcq',
   '["6", "8", "24", "12"]', 3,
   '24 = 2³ × 3 et 36 = 2² × 3², donc PGCD = 2² × 3 = 12.', 2),
  ('05610000-0000-4000-8000-000000000023'::uuid, '05600000-0000-4000-8000-000000000002'::uuid,
   'Comme 7 est premier et 2 n''est pas divisible par 7, le petit théorème de Fermat donne 2⁶ ≡ 1 [7].', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le petit théorème de Fermat donne a^(p-1) ≡ 1 [p] ; ici 2⁶ = 64 = 9 × 7 + 1, donc 64 ≡ 1 [7].', 3),

  -- Quiz 3 — Matrices et graphes
  ('05610000-0000-4000-8000-000000000031'::uuid, '05600000-0000-4000-8000-000000000003'::uuid,
   'Quelle matrice est la matrice identité d''ordre 2 (élément neutre du produit matriciel) ?', 'mcq',
   '["[[1, 1], [1, 1]]", "[[0, 0], [0, 0]]", "[[1, 0], [1, 0]]", "[[1, 0], [0, 1]]"]', 3,
   'L''identité porte des 1 sur la diagonale et des 0 ailleurs ; elle vérifie I × A = A.', 1),
  ('05610000-0000-4000-8000-000000000032'::uuid, '05600000-0000-4000-8000-000000000003'::uuid,
   'Pour deux matrices carrées A et B, le produit matriciel est toujours commutatif : AB = BA.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Le produit matriciel n''est pas commutatif en général : AB et BA peuvent différer.', 2),
  ('05610000-0000-4000-8000-000000000033'::uuid, '05600000-0000-4000-8000-000000000003'::uuid,
   'Dans la matrice d''adjacence d''un graphe non orienté simple, que représente le coefficient a_ij ?', 'mcq',
   '["Le nombre d''arêtes reliant le sommet i au sommet j", "La longueur du plus court chemin de i à j", "Le degré du sommet i", "Le nombre total de sommets du graphe"]', 0,
   'La matrice d''adjacence stocke en a_ij le nombre d''arêtes entre les sommets i et j (0 ou 1 pour un graphe simple).', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05600000-%' GROUP BY q.title;
-- =============================================================================
