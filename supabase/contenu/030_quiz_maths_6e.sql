-- =============================================================================
-- Studuel — Migration 030 : quiz de leçon, Maths 6e (4 quiz, 12 questions)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés (tables quizzes,
--             quiz_questions, subjects/chapters/lessons + colonne quizzes.lesson_id).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon
--   (n'insère un quiz que si la leçon n'en a pas déjà un — le hub de leçon lit
--    le quiz en .maybeSingle(), donc une leçon ne doit porter qu'UN quiz).
-- Rattachement par clés stables : slug matière → (niveau, titre chapitre) →
--   titre leçon. Aucune donnée existante n'est modifiée ni supprimée.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — un quiz rattaché à la leçon « L'essentiel du cours » de 4
--    chapitres de Maths 6e (uniquement si la leçon n'a pas déjà un quiz).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Maths', '6e', v.chapter, true, l.id
FROM (VALUES
  ('03010000-0000-4000-8000-000000000001'::uuid, 'Nombres entiers et décimaux', 'Nombres entiers et décimaux'),
  ('03010000-0000-4000-8000-000000000002'::uuid, 'Proportionnalité',            'Proportionnalité'),
  ('03010000-0000-4000-8000-000000000003'::uuid, 'Géométrie plane',            'Géométrie plane'),
  ('03010000-0000-4000-8000-000000000004'::uuid, 'Aires, périmètres et volumes','Aires, périmètres et volumes')
) AS v(quiz_id, title, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — 3 questions par quiz. Chaque insert est un SELECT depuis
--    quizzes : la question n'est créée QUE si son quiz existe (donc jamais de
--    violation de clé étrangère si le quiz a été ignoré à l'étape 1).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Quiz 1 — Nombres entiers et décimaux
  ('03020000-0000-4000-8000-000000000011'::uuid, '03010000-0000-4000-8000-000000000001'::uuid,
   'Dans le nombre 3 407, quel est le chiffre des centaines ?', 'mcq',
   '["4", "3", "0", "7"]', 0,
   'De droite à gauche : unités 7, dizaines 0, centaines 4.', 1),
  ('03020000-0000-4000-8000-000000000012'::uuid, '03010000-0000-4000-8000-000000000001'::uuid,
   'Dans 12,5 le chiffre 5 est le chiffre des dixièmes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le premier chiffre après la virgule est celui des dixièmes.', 2),
  ('03020000-0000-4000-8000-000000000013'::uuid, '03010000-0000-4000-8000-000000000001'::uuid,
   'Comment lit-on le nombre 7,03 ?', 'mcq',
   '["Sept unités et trois centièmes", "Sept unités et trois dixièmes", "Soixante-treize centièmes", "Sept unités et trois millièmes"]', 0,
   'Après la virgule : 0 dixième et 3 centièmes.', 3),

  -- Quiz 2 — Proportionnalité
  ('03020000-0000-4000-8000-000000000021'::uuid, '03010000-0000-4000-8000-000000000002'::uuid,
   'Si 3 stylos identiques coûtent 6 €, combien coûtent 5 stylos ?', 'mcq',
   '["10 €", "9 €", "11 €", "8 €"]', 0,
   'Prix unitaire : 6 ÷ 3 = 2 €. Donc 5 × 2 = 10 €.', 1),
  ('03020000-0000-4000-8000-000000000022'::uuid, '03010000-0000-4000-8000-000000000002'::uuid,
   'Dans un tableau de proportionnalité, on passe d''une ligne à l''autre en multipliant par un même nombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ce nombre est le coefficient de proportionnalité.', 2),
  ('03020000-0000-4000-8000-000000000023'::uuid, '03010000-0000-4000-8000-000000000002'::uuid,
   'Une recette pour 4 personnes demande 200 g de farine. Pour 6 personnes ?', 'mcq',
   '["300 g", "250 g", "350 g", "400 g"]', 0,
   '200 ÷ 4 = 50 g par personne, donc 6 × 50 = 300 g.', 3),

  -- Quiz 3 — Géométrie plane
  ('03020000-0000-4000-8000-000000000031'::uuid, '03010000-0000-4000-8000-000000000003'::uuid,
   'Comment nomme-t-on un angle qui mesure exactement 90° ?', 'mcq',
   '["Un angle droit", "Un angle aigu", "Un angle obtus", "Un angle plat"]', 0,
   'Un angle droit mesure 90°. Aigu < 90°, obtus > 90°, plat = 180°.', 1),
  ('03020000-0000-4000-8000-000000000032'::uuid, '03010000-0000-4000-8000-000000000003'::uuid,
   'Deux droites perpendiculaires se coupent en formant un angle droit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la définition de deux droites perpendiculaires.', 2),
  ('03020000-0000-4000-8000-000000000033'::uuid, '03010000-0000-4000-8000-000000000003'::uuid,
   'Quel instrument sert à mesurer un angle ?', 'mcq',
   '["Le rapporteur", "Le compas", "L''équerre", "La règle graduée"]', 0,
   'Le rapporteur mesure les angles ; le compas trace des cercles, l''équerre vérifie l''angle droit.', 3),

  -- Quiz 4 — Aires, périmètres et volumes
  ('03020000-0000-4000-8000-000000000041'::uuid, '03010000-0000-4000-8000-000000000004'::uuid,
   'Quel est le périmètre d''un rectangle de longueur 5 cm et largeur 3 cm ?', 'mcq',
   '["16 cm", "15 cm", "8 cm", "13 cm"]', 0,
   'Périmètre = 2 × (longueur + largeur) = 2 × (5 + 3) = 16 cm.', 1),
  ('03020000-0000-4000-8000-000000000042'::uuid, '03010000-0000-4000-8000-000000000004'::uuid,
   'Quelle est l''aire d''un carré de côté 4 cm ?', 'mcq',
   '["16 cm²", "8 cm²", "12 cm²", "4 cm²"]', 0,
   'Aire d''un carré = côté × côté = 4 × 4 = 16 cm².', 2),
  ('03020000-0000-4000-8000-000000000043'::uuid, '03010000-0000-4000-8000-000000000004'::uuid,
   'Le périmètre et l''aire s''expriment dans la même unité.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Le périmètre est une longueur (cm), l''aire une surface (cm²).', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, à lancer après le Run) :
--   SELECT q.title, count(qq.*) AS nb_questions
--   FROM public.quizzes q LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03010000-%' GROUP BY q.title;
-- =============================================================================
