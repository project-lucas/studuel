-- =============================================================================
-- Scolaria — Migration 004 : contenu supplémentaire (5 quiz, 15 questions)
-- PRÉREQUIS : 002_quizzes.sql exécuté.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur (UUID fixes + ON CONFLICT DO NOTHING).
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free) VALUES
  ('11111111-1111-4111-8111-111111111104', 'Théorème de Pythagore',        'Maths',            '4e',        'Géométrie',                 false),
  ('11111111-1111-4111-8111-111111111105', 'Les cellules',                 'SVT',              '6e',        'Le vivant',                 true),
  ('11111111-1111-4111-8111-111111111106', 'Present simple vs continuous', 'Anglais',          '5e',        'Grammar',                   false),
  ('11111111-1111-4111-8111-111111111107', 'Les états de la matière',      'Physique-Chimie',  '5e',        'Organisation de la matière', false),
  ('11111111-1111-4111-8111-111111111108', 'La Première Guerre mondiale',  'Histoire',         '3e',        'Le monde depuis 1914',      false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position) VALUES
  -- Théorème de Pythagore (Maths 4e, Offre 1)
  ('22222222-2222-4222-8222-222222222211', '11111111-1111-4111-8111-111111111104',
   'Dans un triangle rectangle, le carré de l''hypoténuse est égal à…', 'mcq',
   '["la somme des carrés des deux autres côtés", "la somme des deux autres côtés", "le double du plus grand côté", "le produit des deux autres côtés"]', 0,
   'C''est l''énoncé du théorème de Pythagore : a² + b² = c².', 1),
  ('22222222-2222-4222-8222-222222222212', '11111111-1111-4111-8111-111111111104',
   'Un triangle de côtés 3, 4 et 5 est rectangle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '3² + 4² = 9 + 16 = 25 = 5² : la réciproque de Pythagore s''applique.', 2),
  ('22222222-2222-4222-8222-222222222213', '11111111-1111-4111-8111-111111111104',
   'Si l''hypoténuse vaut 13 et un côté vaut 5, combien vaut l''autre côté ?', 'mcq',
   '["12", "8", "10", "11"]', 0,
   '13² − 5² = 169 − 25 = 144, et √144 = 12.', 3),

  -- Les cellules (SVT 6e, GRATUIT)
  ('22222222-2222-4222-8222-222222222214', '11111111-1111-4111-8111-111111111105',
   'Quelle est l''unité de base du vivant ?', 'mcq',
   '["La cellule", "L''atome", "L''organe", "La molécule"]', 0,
   'Tous les êtres vivants sont constitués d''une ou plusieurs cellules.', 1),
  ('22222222-2222-4222-8222-222222222215', '11111111-1111-4111-8111-111111111105',
   'Toutes les cellules possèdent un noyau.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Les bactéries, par exemple, n''ont pas de noyau (procaryotes).', 2),
  ('22222222-2222-4222-8222-222222222216', '11111111-1111-4111-8111-111111111105',
   'Quel instrument permet d''observer des cellules ?', 'mcq',
   '["Le microscope", "Le télescope", "La loupe binoculaire seulement", "Le périscope"]', 0,
   'Le microscope optique grossit suffisamment pour observer des cellules.', 3),

  -- Present simple vs continuous (Anglais 5e, Offre 1)
  ('22222222-2222-4222-8222-222222222217', '11111111-1111-4111-8111-111111111106',
   'Choose the correct sentence:', 'mcq',
   '["She is reading a book right now.", "She reads a book right now.", "She reading a book right now.", "She read a book right now."]', 0,
   '« Right now » indique une action en cours → present continuous.', 1),
  ('22222222-2222-4222-8222-222222222218', '11111111-1111-4111-8111-111111111106',
   '« I am knowing the answer » is correct.', 'true_false',
   '["True", "False"]', 1,
   '« Know » est un verbe d''état : on dit « I know the answer ».', 2),
  ('22222222-2222-4222-8222-222222222219', '11111111-1111-4111-8111-111111111106',
   'Complete: « He ___ football every Saturday. »', 'mcq',
   '["plays", "is playing", "play", "playing"]', 0,
   'Habitude (« every Saturday ») → present simple, 3e personne : plays.', 3),

  -- Les états de la matière (Physique-Chimie 5e, Offre 1)
  ('22222222-2222-4222-8222-222222222220', '11111111-1111-4111-8111-111111111107',
   'Quel est le passage de l''état liquide à l''état gazeux ?', 'mcq',
   '["La vaporisation", "La fusion", "La solidification", "La condensation"]', 0,
   'Liquide → gaz = vaporisation (ébullition ou évaporation).', 1),
  ('22222222-2222-4222-8222-222222222221', '11111111-1111-4111-8111-111111111107',
   'L''eau bout à 100 °C au niveau de la mer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À pression atmosphérique normale, l''ébullition de l''eau a lieu à 100 °C.', 2),
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111107',
   'Dans quel état les particules sont-elles les plus ordonnées ?', 'mcq',
   '["Solide", "Liquide", "Gazeux", "Plasma"]', 0,
   'À l''état solide, les particules sont compactes et ordonnées.', 3),

  -- La Première Guerre mondiale (Histoire 3e, Offre 1)
  ('22222222-2222-4222-8222-222222222223', '11111111-1111-4111-8111-111111111108',
   'Quand débute la Première Guerre mondiale ?', 'mcq',
   '["1914", "1918", "1939", "1905"]', 0,
   'La guerre éclate à l''été 1914.', 1),
  ('22222222-2222-4222-8222-222222222224', '11111111-1111-4111-8111-111111111108',
   'La bataille de Verdun a eu lieu en 1916.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Verdun, de février à décembre 1916, est une bataille emblématique.', 2),
  ('22222222-2222-4222-8222-222222222225', '11111111-1111-4111-8111-111111111108',
   'Quel armistice met fin aux combats sur le front ouest ?', 'mcq',
   '["Le 11 novembre 1918", "Le 8 mai 1945", "Le 14 juillet 1919", "Le 1er septembre 1918"]', 0,
   'L''armistice est signé le 11 novembre 1918 à Rethondes.', 3)
ON CONFLICT (id) DO NOTHING;
