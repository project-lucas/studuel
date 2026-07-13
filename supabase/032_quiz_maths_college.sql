-- =============================================================================
-- Studuel — Migration 032 : quiz de leçon, Maths collège 5e·4e·3e
--   (14 quiz, 42 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés (tables quizzes,
--             quiz_questions, subjects/chapters/lessons + colonne quizzes.lesson_id).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon
--   (n'insère un quiz que si la leçon n'en a pas déjà un — le hub de leçon lit
--    le quiz en .maybeSingle(), donc une leçon ne doit porter qu'UN quiz).
-- Rattachement par clés stables : slug matière → (niveau, titre chapitre) →
--   titre leçon « L'essentiel du cours ». Aucune donnée existante n'est modifiée.
-- Note : le chapitre « Théorème de Pythagore » (4e) a déjà son quiz — la garde
--   anti-doublon l'ignore, il n'est donc pas listé ici.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — un quiz rattaché à « L'essentiel du cours » de chaque chapitre
--    de Maths collège encore sans quiz (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Maths', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 5e
  ('03200000-0000-4000-8000-000000000051'::uuid, '5e', 'Nombres relatifs',                 'Nombres relatifs'),
  ('03200000-0000-4000-8000-000000000052'::uuid, '5e', 'Fractions et calculs',             'Fractions et calculs'),
  ('03200000-0000-4000-8000-000000000053'::uuid, '5e', 'Calcul littéral : initiation',     'Calcul littéral : initiation'),
  ('03200000-0000-4000-8000-000000000054'::uuid, '5e', 'Triangles et angles',              'Triangles et angles'),
  ('03200000-0000-4000-8000-000000000055'::uuid, '5e', 'Proportionnalité et pourcentages', 'Proportionnalité et pourcentages'),
  -- 4e (Pythagore déjà couvert, non listé)
  ('03200000-0000-4000-8000-000000000041'::uuid, '4e', 'Puissances',                    'Puissances'),
  ('03200000-0000-4000-8000-000000000042'::uuid, '4e', 'Calcul littéral',               'Calcul littéral'),
  ('03200000-0000-4000-8000-000000000044'::uuid, '4e', 'Proportionnalité et fonctions', 'Proportionnalité et fonctions'),
  ('03200000-0000-4000-8000-000000000045'::uuid, '4e', 'Statistiques et probabilités',  'Statistiques et probabilités'),
  -- 3e
  ('03200000-0000-4000-8000-000000000031'::uuid, '3e', 'Arithmétique',                     'Arithmétique'),
  ('03200000-0000-4000-8000-000000000032'::uuid, '3e', 'Fonctions linéaires et affines',   'Fonctions linéaires et affines'),
  ('03200000-0000-4000-8000-000000000033'::uuid, '3e', 'Théorème de Thalès',               'Théorème de Thalès'),
  ('03200000-0000-4000-8000-000000000034'::uuid, '3e', 'Trigonométrie',                    'Trigonométrie'),
  ('03200000-0000-4000-8000-000000000035'::uuid, '3e', 'Probabilités et statistiques',     'Probabilités et statistiques')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — 3 questions par quiz. Chaque insert est un SELECT depuis
--    quizzes : la question n'est créée QUE si son quiz existe (aucune violation
--    de clé étrangère si le quiz a été ignoré à l'étape 1).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 5e =====
  -- 51 — Nombres relatifs
  ('03210000-0000-4000-8000-000000000511'::uuid, '03200000-0000-4000-8000-000000000051'::uuid,
   'Quel est le résultat de (−3) + (−5) ?', 'mcq',
   '["−8", "−2", "8", "2"]', 0,
   'Deux nombres négatifs : on additionne les distances (3 + 5 = 8) et on garde le signe −.', 1),
  ('03210000-0000-4000-8000-000000000512'::uuid, '03200000-0000-4000-8000-000000000051'::uuid,
   'Quel est le résultat de (−7) + (+4) ?', 'mcq',
   '["−3", "+3", "−11", "+11"]', 0,
   'Signes différents : on fait la différence 7 − 4 = 3, puis on garde le signe du plus éloigné de 0 (−).', 2),
  ('03210000-0000-4000-8000-000000000513'::uuid, '03200000-0000-4000-8000-000000000051'::uuid,
   'Sur une droite graduée, −8 est situé à gauche de −3.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Plus un nombre négatif est grand en distance, plus il est à gauche : −8 < −3.', 3),

  -- 52 — Fractions et calculs
  ('03210000-0000-4000-8000-000000000521'::uuid, '03200000-0000-4000-8000-000000000052'::uuid,
   'Combien font 2/3 + 1/6 ?', 'mcq',
   '["5/6", "3/9", "1/2", "3/6"]', 0,
   'On met au même dénominateur : 2/3 = 4/6, puis 4/6 + 1/6 = 5/6.', 1),
  ('03210000-0000-4000-8000-000000000522'::uuid, '03200000-0000-4000-8000-000000000052'::uuid,
   'Combien font 3/4 × 2/5 ?', 'mcq',
   '["3/10", "6/9", "5/9", "5/20"]', 0,
   'On multiplie les numérateurs et les dénominateurs : (3×2)/(4×5) = 6/20 = 3/10.', 2),
  ('03210000-0000-4000-8000-000000000523'::uuid, '03200000-0000-4000-8000-000000000052'::uuid,
   'La fraction 4/8 est égale à 1/2.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On divise le numérateur et le dénominateur par 4 : 4/8 = 1/2.', 3),

  -- 53 — Calcul littéral : initiation
  ('03210000-0000-4000-8000-000000000531'::uuid, '03200000-0000-4000-8000-000000000053'::uuid,
   'Que vaut l''expression 3x pour x = 4 ?', 'mcq',
   '["12", "7", "34", "3"]', 0,
   '3x signifie 3 × x, soit 3 × 4 = 12.', 1),
  ('03210000-0000-4000-8000-000000000532'::uuid, '03200000-0000-4000-8000-000000000053'::uuid,
   'Comment réduit-on l''expression 5x + 2x ?', 'mcq',
   '["7x", "10x", "7", "7x²"]', 0,
   'On additionne les coefficients des termes en x : 5 + 2 = 7, donc 7x.', 2),
  ('03210000-0000-4000-8000-000000000533'::uuid, '03200000-0000-4000-8000-000000000053'::uuid,
   'L''expression 2 × x peut aussi s''écrire 2x.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En calcul littéral, on n''écrit pas le signe × devant une lettre.', 3),

  -- 54 — Triangles et angles
  ('03210000-0000-4000-8000-000000000541'::uuid, '03200000-0000-4000-8000-000000000054'::uuid,
   'Quelle est la somme des angles d''un triangle ?', 'mcq',
   '["180°", "90°", "360°", "270°"]', 0,
   'La somme des trois angles d''un triangle vaut toujours 180°.', 1),
  ('03210000-0000-4000-8000-000000000542'::uuid, '03200000-0000-4000-8000-000000000054'::uuid,
   'Dans un triangle, deux angles mesurent 50° et 60°. Combien mesure le troisième ?', 'mcq',
   '["70°", "80°", "110°", "90°"]', 0,
   '180 − (50 + 60) = 180 − 110 = 70°.', 2),
  ('03210000-0000-4000-8000-000000000543'::uuid, '03200000-0000-4000-8000-000000000054'::uuid,
   'Un triangle équilatéral a trois angles de 60°.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ses trois angles sont égaux, et 180 ÷ 3 = 60°.', 3),

  -- 55 — Proportionnalité et pourcentages
  ('03210000-0000-4000-8000-000000000551'::uuid, '03200000-0000-4000-8000-000000000055'::uuid,
   'Quel est 25 % de 80 ?', 'mcq',
   '["20", "25", "40", "30"]', 0,
   '25 % correspond à un quart : 80 ÷ 4 = 20.', 1),
  ('03210000-0000-4000-8000-000000000552'::uuid, '03200000-0000-4000-8000-000000000055'::uuid,
   'Un article à 50 € augmente de 10 %. Quel est son nouveau prix ?', 'mcq',
   '["55 €", "60 €", "51 €", "45 €"]', 0,
   '10 % de 50 = 5 €, donc 50 + 5 = 55 €.', 2),
  ('03210000-0000-4000-8000-000000000553'::uuid, '03200000-0000-4000-8000-000000000055'::uuid,
   'Dans un tableau de proportionnalité, on passe d''une ligne à l''autre en multipliant par un même nombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ce nombre constant est le coefficient de proportionnalité.', 3),

  -- ===== 4e =====
  -- 41 — Puissances
  ('03210000-0000-4000-8000-000000000411'::uuid, '03200000-0000-4000-8000-000000000041'::uuid,
   'Que vaut 2⁴ ?', 'mcq',
   '["16", "8", "6", "24"]', 0,
   '2⁴ = 2 × 2 × 2 × 2 = 16.', 1),
  ('03210000-0000-4000-8000-000000000412'::uuid, '03200000-0000-4000-8000-000000000041'::uuid,
   'Que vaut 10³ ?', 'mcq',
   '["1000", "100", "30", "10000"]', 0,
   '10³ = 10 × 10 × 10 = 1000 (un 1 suivi de 3 zéros).', 2),
  ('03210000-0000-4000-8000-000000000413'::uuid, '03200000-0000-4000-8000-000000000041'::uuid,
   'Pour tout nombre a non nul, a⁰ = 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par convention, toute puissance d''exposant 0 vaut 1.', 3),

  -- 42 — Calcul littéral (4e)
  ('03210000-0000-4000-8000-000000000421'::uuid, '03200000-0000-4000-8000-000000000042'::uuid,
   'Développe 3(x + 2).', 'mcq',
   '["3x + 6", "3x + 2", "x + 6", "5x"]', 0,
   'On distribue : 3 × x + 3 × 2 = 3x + 6.', 1),
  ('03210000-0000-4000-8000-000000000422'::uuid, '03200000-0000-4000-8000-000000000042'::uuid,
   'Réduis 4x + 3 + 2x − 1.', 'mcq',
   '["6x + 2", "6x + 4", "8x", "6x − 2"]', 0,
   'On regroupe : (4x + 2x) + (3 − 1) = 6x + 2.', 2),
  ('03210000-0000-4000-8000-000000000423'::uuid, '03200000-0000-4000-8000-000000000042'::uuid,
   'Développer 2(a − 5) donne 2a − 10.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On distribue : 2 × a − 2 × 5 = 2a − 10.', 3),

  -- 44 — Proportionnalité et fonctions
  ('03210000-0000-4000-8000-000000000441'::uuid, '03200000-0000-4000-8000-000000000044'::uuid,
   'Une fonction linéaire est de la forme…', 'mcq',
   '["f(x) = ax", "f(x) = ax + b", "f(x) = x + a", "f(x) = a"]', 0,
   'Une fonction linéaire s''écrit f(x) = ax ; avec un « + b » ce serait une fonction affine.', 1),
  ('03210000-0000-4000-8000-000000000442'::uuid, '03200000-0000-4000-8000-000000000044'::uuid,
   'Pour la fonction f(x) = 3x, combien vaut f(5) ?', 'mcq',
   '["15", "8", "35", "3"]', 0,
   'On remplace x par 5 : f(5) = 3 × 5 = 15.', 2),
  ('03210000-0000-4000-8000-000000000443'::uuid, '03200000-0000-4000-8000-000000000044'::uuid,
   'La courbe d''une fonction linéaire est une droite qui passe par l''origine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'f(0) = 0, donc la droite passe par le point (0 ; 0).', 3),

  -- 45 — Statistiques et probabilités (4e)
  ('03210000-0000-4000-8000-000000000451'::uuid, '03200000-0000-4000-8000-000000000045'::uuid,
   'Quelle est la moyenne de 4, 6 et 8 ?', 'mcq',
   '["6", "9", "18", "5"]', 0,
   'Moyenne = (4 + 6 + 8) ÷ 3 = 18 ÷ 3 = 6.', 1),
  ('03210000-0000-4000-8000-000000000452'::uuid, '03200000-0000-4000-8000-000000000045'::uuid,
   'On lance un dé à 6 faces. Quelle est la probabilité d''obtenir un 3 ?', 'mcq',
   '["1/6", "1/3", "3/6", "1/2"]', 0,
   'Un seul cas favorable (le 3) sur 6 issues équiprobables : 1/6.', 2),
  ('03210000-0000-4000-8000-000000000453'::uuid, '03200000-0000-4000-8000-000000000045'::uuid,
   'Une probabilité est toujours comprise entre 0 et 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '0 correspond à un événement impossible, 1 à un événement certain.', 3),

  -- ===== 3e =====
  -- 31 — Arithmétique
  ('03210000-0000-4000-8000-000000000311'::uuid, '03200000-0000-4000-8000-000000000031'::uuid,
   'Quel est le PGCD de 12 et 18 ?', 'mcq',
   '["6", "3", "2", "12"]', 0,
   'Diviseurs communs de 12 et 18 : 1, 2, 3, 6 ; le plus grand est 6.', 1),
  ('03210000-0000-4000-8000-000000000312'::uuid, '03200000-0000-4000-8000-000000000031'::uuid,
   'Le nombre 7 est un nombre premier.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '7 n''a que deux diviseurs : 1 et lui-même.', 2),
  ('03210000-0000-4000-8000-000000000313'::uuid, '03200000-0000-4000-8000-000000000031'::uuid,
   'La fraction 12/18 est irréductible.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'On peut la simplifier par 6 : 12/18 = 2/3. Elle n''est donc pas irréductible.', 3),

  -- 32 — Fonctions linéaires et affines
  ('03210000-0000-4000-8000-000000000321'::uuid, '03200000-0000-4000-8000-000000000032'::uuid,
   'Une fonction affine s''écrit sous la forme…', 'mcq',
   '["f(x) = ax + b", "f(x) = ax", "f(x) = a", "f(x) = b/x"]', 0,
   'a est le coefficient directeur et b l''ordonnée à l''origine.', 1),
  ('03210000-0000-4000-8000-000000000322'::uuid, '03200000-0000-4000-8000-000000000032'::uuid,
   'Pour la fonction f(x) = 2x + 3, combien vaut f(4) ?', 'mcq',
   '["11", "8", "14", "7"]', 0,
   'f(4) = 2 × 4 + 3 = 8 + 3 = 11.', 2),
  ('03210000-0000-4000-8000-000000000323'::uuid, '03200000-0000-4000-8000-000000000032'::uuid,
   'Pour la fonction affine f(x) = 2x + 3, le nombre 3 est l''ordonnée à l''origine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'f(0) = 3 : la droite coupe l''axe des ordonnées au point d''ordonnée 3.', 3),

  -- 33 — Théorème de Thalès
  ('03210000-0000-4000-8000-000000000331'::uuid, '03200000-0000-4000-8000-000000000033'::uuid,
   'Le théorème de Thalès s''utilise dans une configuration où…', 'mcq',
   '["deux droites parallèles coupent deux sécantes", "un triangle est rectangle", "on calcule une aire", "on cherche un nombre premier"]', 0,
   'Il relie des longueurs lorsque deux droites parallèles coupent deux droites sécantes.', 1),
  ('03210000-0000-4000-8000-000000000332'::uuid, '03200000-0000-4000-8000-000000000033'::uuid,
   'Le théorème de Thalès permet de calculer des longueurs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il fournit une égalité de rapports de longueurs, qui permet de trouver une longueur manquante.', 2),
  ('03210000-0000-4000-8000-000000000333'::uuid, '03200000-0000-4000-8000-000000000033'::uuid,
   'Avec les points A, M, B alignés et A, N, C alignés, si AM/AB = AN/AC alors les droites (MN) et (BC) sont…', 'mcq',
   '["parallèles", "perpendiculaires", "sécantes", "confondues"]', 0,
   'C''est la réciproque du théorème de Thalès : l''égalité des rapports entraîne le parallélisme.', 3),

  -- 34 — Trigonométrie
  ('03210000-0000-4000-8000-000000000341'::uuid, '03200000-0000-4000-8000-000000000034'::uuid,
   'Dans un triangle rectangle, le cosinus d''un angle aigu est égal à…', 'mcq',
   '["côté adjacent / hypoténuse", "côté opposé / hypoténuse", "côté opposé / côté adjacent", "hypoténuse / côté adjacent"]', 0,
   'Moyen mnémotechnique CAH : Cosinus = Adjacent / Hypoténuse.', 1),
  ('03210000-0000-4000-8000-000000000342'::uuid, '03200000-0000-4000-8000-000000000034'::uuid,
   'Dans un triangle rectangle, le sinus d''un angle aigu est égal à…', 'mcq',
   '["côté opposé / hypoténuse", "côté adjacent / hypoténuse", "côté opposé / côté adjacent", "hypoténuse / côté opposé"]', 0,
   'Moyen mnémotechnique SOH : Sinus = Opposé / Hypoténuse.', 2),
  ('03210000-0000-4000-8000-000000000343'::uuid, '03200000-0000-4000-8000-000000000034'::uuid,
   'Dans un triangle rectangle, la tangente d''un angle vaut : côté opposé / côté adjacent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Moyen mnémotechnique TOA : Tangente = Opposé / Adjacent.', 3),

  -- 35 — Probabilités et statistiques (3e)
  ('03210000-0000-4000-8000-000000000351'::uuid, '03200000-0000-4000-8000-000000000035'::uuid,
   'On tire une carte au hasard dans un jeu de 32 cartes (4 rois). Quelle est la probabilité d''obtenir un roi ?', 'mcq',
   '["4/32", "1/32", "4/52", "8/32"]', 0,
   '4 cas favorables sur 32 issues équiprobables : 4/32 = 1/8.', 1),
  ('03210000-0000-4000-8000-000000000352'::uuid, '03200000-0000-4000-8000-000000000035'::uuid,
   'Quelle est la médiane de la série ordonnée 3, 5, 7, 9, 11 ?', 'mcq',
   '["7", "5", "9", "6"]', 0,
   'La série a 5 valeurs : la médiane est la valeur du milieu, soit la 3ᵉ, donc 7.', 2),
  ('03210000-0000-4000-8000-000000000353'::uuid, '03200000-0000-4000-8000-000000000035'::uuid,
   'La somme des probabilités de toutes les issues d''une expérience aléatoire vaut 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ensemble de toutes les issues forme l''événement certain, de probabilité 1.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, à lancer après le Run) :
--   SELECT q.grade_level, q.title, count(qq.*) AS nb
--   FROM public.quizzes q LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03200000-%' GROUP BY q.grade_level, q.title ORDER BY 1,2;
-- =============================================================================
