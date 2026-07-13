-- =============================================================================
-- Studuel — Migration 035 : quiz de leçon, Anglais collège 6e·5e·4e·3e
--   (19 quiz, 57 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'anglais' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Le chapitre 5e « Present simple vs continuous » a déjà son quiz.
-- Questions en français (UI FR) portant sur la grammaire et le lexique anglais.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Anglais', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 6e
  ('03500000-0000-4000-8000-000000000061'::uuid, '6e', 'Se présenter et parler de soi',    'Se présenter et parler de soi'),
  ('03500000-0000-4000-8000-000000000062'::uuid, '6e', 'Present simple : routines',        'Present simple : routines'),
  ('03500000-0000-4000-8000-000000000063'::uuid, '6e', 'La famille et les animaux',        'La famille et les animaux'),
  ('03500000-0000-4000-8000-000000000064'::uuid, '6e', 'L''école en pays anglophone',      'L''école en pays anglophone'),
  ('03500000-0000-4000-8000-000000000065'::uuid, '6e', 'Fêtes et traditions',              'Fêtes et traditions'),
  -- 5e (Present simple vs continuous déjà couvert)
  ('03500000-0000-4000-8000-000000000051'::uuid, '5e', 'Le prétérit : raconter au passé',  'Le prétérit : raconter au passé'),
  ('03500000-0000-4000-8000-000000000052'::uuid, '5e', 'Décrire un lieu, une ville',       'Décrire un lieu, une ville'),
  ('03500000-0000-4000-8000-000000000053'::uuid, '5e', 'La nourriture et les quantités',   'La nourriture et les quantités'),
  ('03500000-0000-4000-8000-000000000054'::uuid, '5e', 'Les pays anglophones',             'Les pays anglophones'),
  -- 4e
  ('03500000-0000-4000-8000-000000000041'::uuid, '4e', 'Le present perfect',               'Le present perfect'),
  ('03500000-0000-4000-8000-000000000042'::uuid, '4e', 'Comparatifs et superlatifs',       'Comparatifs et superlatifs'),
  ('03500000-0000-4000-8000-000000000043'::uuid, '4e', 'Exprimer le futur',                'Exprimer le futur'),
  ('03500000-0000-4000-8000-000000000044'::uuid, '4e', 'Les médias et les réseaux',        'Les médias et les réseaux'),
  ('03500000-0000-4000-8000-000000000045'::uuid, '4e', 'Portraits d''artistes anglophones','Portraits d''artistes anglophones'),
  -- 3e
  ('03500000-0000-4000-8000-000000000031'::uuid, '3e', 'Le passif',                          'Le passif'),
  ('03500000-0000-4000-8000-000000000032'::uuid, '3e', 'Les modaux : conseils et obligation','Les modaux : conseils et obligation'),
  ('03500000-0000-4000-8000-000000000033'::uuid, '3e', 'Present perfect vs prétérit',        'Present perfect vs prétérit'),
  ('03500000-0000-4000-8000-000000000034'::uuid, '3e', 'Le monde du travail',                'Le monde du travail'),
  ('03500000-0000-4000-8000-000000000035'::uuid, '3e', 'Préparer l''épreuve orale',          'Préparer l''épreuve orale')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 6e =====
  -- 61 — Se présenter et parler de soi
  ('03510000-0000-4000-8000-000000000611'::uuid, '03500000-0000-4000-8000-000000000061'::uuid,
   'Comment dit-on « Je m''appelle Tom » en anglais ?', 'mcq',
   '["My name is Tom", "I have Tom", "I am name Tom", "Me Tom is"]', 0,
   'On dit « My name is… » ou « I''m Tom ».', 1),
  ('03510000-0000-4000-8000-000000000612'::uuid, '03500000-0000-4000-8000-000000000061'::uuid,
   'Que signifie la question « How old are you? »', 'mcq',
   '["Quel âge as-tu ?", "Comment vas-tu ?", "Où habites-tu ?", "Comment t''appelles-tu ?"]', 0,
   'Littéralement : « quel âge as-tu ? ».', 2),
  ('03510000-0000-4000-8000-000000000613'::uuid, '03500000-0000-4000-8000-000000000061'::uuid,
   'En anglais, le pronom « I » (je) s''écrit toujours avec une majuscule.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« I » prend toujours une majuscule, où qu''il soit dans la phrase.', 3),

  -- 62 — Present simple : routines
  ('03510000-0000-4000-8000-000000000621'::uuid, '03500000-0000-4000-8000-000000000062'::uuid,
   'À la 3ᵉ personne du singulier (he/she/it) au present simple, on ajoute souvent…', 'mcq',
   '["-s au verbe", "-ing au verbe", "rien", "-ed au verbe"]', 0,
   'He plays, she works : on ajoute -s au verbe.', 1),
  ('03510000-0000-4000-8000-000000000622'::uuid, '03500000-0000-4000-8000-000000000062'::uuid,
   'Comment dit-on « Elle ne joue pas » au present simple ?', 'mcq',
   '["She doesn''t play", "She don''t play", "She not play", "She isn''t play"]', 0,
   'Négation : doesn''t + base verbale (play).', 2),
  ('03510000-0000-4000-8000-000000000623'::uuid, '03500000-0000-4000-8000-000000000062'::uuid,
   'Le present simple sert à parler d''habitudes et de routines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par exemple : « I go to school every day. »', 3),

  -- 63 — La famille et les animaux
  ('03510000-0000-4000-8000-000000000631'::uuid, '03500000-0000-4000-8000-000000000063'::uuid,
   'Que signifie le mot « sister » ?', 'mcq',
   '["une sœur", "un frère", "une cousine", "une tante"]', 0,
   'Sister = sœur ; brother = frère.', 1),
  ('03510000-0000-4000-8000-000000000632'::uuid, '03500000-0000-4000-8000-000000000063'::uuid,
   'Comment dit-on « un chien » en anglais ?', 'mcq',
   '["a dog", "a cat", "a bird", "a horse"]', 0,
   'Dog = chien ; cat = chat.', 2),
  ('03510000-0000-4000-8000-000000000633'::uuid, '03500000-0000-4000-8000-000000000063'::uuid,
   'Le mot « grandmother » signifie « grand-mère ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'grand + mother = grand-mère.', 3),

  -- 64 — L'école en pays anglophone
  ('03510000-0000-4000-8000-000000000641'::uuid, '03500000-0000-4000-8000-000000000064'::uuid,
   'Que signifie « a teacher » ?', 'mcq',
   '["un professeur", "un élève", "une salle de classe", "un cartable"]', 0,
   'Teacher = professeur ; student/pupil = élève.', 1),
  ('03510000-0000-4000-8000-000000000642'::uuid, '03500000-0000-4000-8000-000000000064'::uuid,
   'Comment dit-on « une trousse » (matériel scolaire) ?', 'mcq',
   '["a pencil case", "a schoolbag", "a ruler", "a book"]', 0,
   'Pencil case = trousse ; schoolbag = cartable.', 2),
  ('03510000-0000-4000-8000-000000000643'::uuid, '03500000-0000-4000-8000-000000000064'::uuid,
   'Le mot « homework » signifie « les devoirs ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Homework = le travail à faire à la maison.', 3),

  -- 65 — Fêtes et traditions
  ('03510000-0000-4000-8000-000000000651'::uuid, '03500000-0000-4000-8000-000000000065'::uuid,
   'Quelle fête anglophone célèbre-t-on le 31 octobre ?', 'mcq',
   '["Halloween", "Christmas", "Easter", "Thanksgiving"]', 0,
   'Halloween a lieu le 31 octobre.', 1),
  ('03510000-0000-4000-8000-000000000652'::uuid, '03500000-0000-4000-8000-000000000065'::uuid,
   'Comment dit-on « Joyeux Noël » en anglais ?', 'mcq',
   '["Merry Christmas", "Happy Birthday", "Happy New Year", "Good luck"]', 0,
   'Merry Christmas = Joyeux Noël.', 2),
  ('03510000-0000-4000-8000-000000000653'::uuid, '03500000-0000-4000-8000-000000000065'::uuid,
   '« Thanksgiving » est une fête traditionnelle célébrée notamment aux États-Unis.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La fête de l''action de grâce, en novembre aux États-Unis.', 3),

  -- ===== 5e =====
  -- 51 — Le prétérit
  ('03510000-0000-4000-8000-000000000511'::uuid, '03500000-0000-4000-8000-000000000051'::uuid,
   'Quel est le prétérit du verbe régulier « to play » ?', 'mcq',
   '["played", "plays", "playing", "will play"]', 0,
   'Verbe régulier : base + -ed → played.', 1),
  ('03510000-0000-4000-8000-000000000512'::uuid, '03500000-0000-4000-8000-000000000051'::uuid,
   'Quel est le prétérit du verbe irrégulier « to go » ?', 'mcq',
   '["went", "goed", "gone", "going"]', 0,
   'Go → went (forme irrégulière à connaître par cœur).', 2),
  ('03510000-0000-4000-8000-000000000513'::uuid, '03500000-0000-4000-8000-000000000051'::uuid,
   'Le prétérit sert à parler d''actions terminées dans le passé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par exemple : « I visited London last year. »', 3),

  -- 52 — Décrire un lieu
  ('03510000-0000-4000-8000-000000000521'::uuid, '03500000-0000-4000-8000-000000000052'::uuid,
   'Que signifie « There is a park » ?', 'mcq',
   '["Il y a un parc", "Il n''y a pas de parc", "Où est le parc ?", "Le parc est grand"]', 0,
   '« There is » = il y a (avec un singulier).', 1),
  ('03510000-0000-4000-8000-000000000522'::uuid, '03500000-0000-4000-8000-000000000052'::uuid,
   'Quelle forme emploie-t-on avec un pluriel : « ___ two shops » ?', 'mcq',
   '["There are", "There is", "There be", "It is"]', 0,
   'There are + nom pluriel.', 2),
  ('03510000-0000-4000-8000-000000000523'::uuid, '03500000-0000-4000-8000-000000000052'::uuid,
   'La préposition « next to » signifie « à côté de ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Next to = à côté de.', 3),

  -- 53 — La nourriture et les quantités
  ('03510000-0000-4000-8000-000000000531'::uuid, '03500000-0000-4000-8000-000000000053'::uuid,
   'Avec un nom dénombrable pluriel, on demande « How ___ apples? »', 'mcq',
   '["many", "much", "long", "old"]', 0,
   'How many + dénombrables ; how much + indénombrables.', 1),
  ('03510000-0000-4000-8000-000000000532'::uuid, '03500000-0000-4000-8000-000000000053'::uuid,
   'Que signifie « bread » ?', 'mcq',
   '["du pain", "de l''eau", "du lait", "du fromage"]', 0,
   'Bread = pain.', 2),
  ('03510000-0000-4000-8000-000000000533'::uuid, '03500000-0000-4000-8000-000000000053'::uuid,
   'On dit « a lot of » pour exprimer « beaucoup de ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'A lot of = beaucoup de.', 3),

  -- 54 — Les pays anglophones
  ('03510000-0000-4000-8000-000000000541'::uuid, '03500000-0000-4000-8000-000000000054'::uuid,
   'Quelle est la capitale du Royaume-Uni ?', 'mcq',
   '["Londres", "New York", "Sydney", "Dublin"]', 0,
   'La capitale du Royaume-Uni est Londres (London).', 1),
  ('03510000-0000-4000-8000-000000000542'::uuid, '03500000-0000-4000-8000-000000000054'::uuid,
   'Dans quel pays se trouve la ville de New York ?', 'mcq',
   '["aux États-Unis", "en Australie", "au Canada", "en Irlande"]', 0,
   'New York se situe aux États-Unis.', 2),
  ('03510000-0000-4000-8000-000000000543'::uuid, '03500000-0000-4000-8000-000000000054'::uuid,
   'L''anglais est l''une des langues parlées en Australie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''Australie est un pays anglophone.', 3),

  -- ===== 4e =====
  -- 41 — Le present perfect
  ('03510000-0000-4000-8000-000000000411'::uuid, '03500000-0000-4000-8000-000000000041'::uuid,
   'Comment se forme le present perfect ?', 'mcq',
   '["have/has + participe passé", "will + base verbale", "was/were + -ing", "base + -ed uniquement"]', 0,
   'Par exemple : I have finished, she has gone.', 1),
  ('03510000-0000-4000-8000-000000000412'::uuid, '03500000-0000-4000-8000-000000000041'::uuid,
   'Complète : « She ___ just arrived. »', 'mcq',
   '["has", "have", "is", "was"]', 0,
   'À la 3ᵉ personne du singulier : has.', 2),
  ('03510000-0000-4000-8000-000000000413'::uuid, '03500000-0000-4000-8000-000000000041'::uuid,
   'Le present perfect relie souvent le passé au présent (« I have lost my keys »).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Action passée dont la conséquence compte encore maintenant.', 3),

  -- 42 — Comparatifs et superlatifs
  ('03510000-0000-4000-8000-000000000421'::uuid, '03500000-0000-4000-8000-000000000042'::uuid,
   'Quel est le comparatif de supériorité de l''adjectif court « tall » ?', 'mcq',
   '["taller", "more tall", "tallest", "most tall"]', 0,
   'Adjectif court : + -er → taller (than).', 1),
  ('03510000-0000-4000-8000-000000000422'::uuid, '03500000-0000-4000-8000-000000000042'::uuid,
   'Quel est le superlatif de « big » ?', 'mcq',
   '["the biggest", "the bigger", "the most big", "more big"]', 0,
   'The biggest (redoublement du g puis -est).', 2),
  ('03510000-0000-4000-8000-000000000423'::uuid, '03500000-0000-4000-8000-000000000042'::uuid,
   'Avec un adjectif long comme « expensive », on dit « more expensive ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Adjectifs longs : more + adjectif (comparatif).', 3),

  -- 43 — Exprimer le futur
  ('03510000-0000-4000-8000-000000000431'::uuid, '03500000-0000-4000-8000-000000000043'::uuid,
   'Quelle structure exprime une intention future ?', 'mcq',
   '["be going to + base verbale", "have + participe passé", "base + -ed", "used to"]', 0,
   'Par exemple : « I''m going to travel. »', 1),
  ('03510000-0000-4000-8000-000000000432'::uuid, '03500000-0000-4000-8000-000000000043'::uuid,
   'Complète (décision spontanée) : « I ___ help you tomorrow. »', 'mcq',
   '["will", "would", "was", "am"]', 0,
   'Will + base verbale exprime une décision ou une promesse.', 2),
  ('03510000-0000-4000-8000-000000000433'::uuid, '03500000-0000-4000-8000-000000000043'::uuid,
   '« Will » est suivi de la base verbale, sans « to ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On dit « I will go » et non « I will to go ».', 3),

  -- 44 — Les médias et les réseaux
  ('03510000-0000-4000-8000-000000000441'::uuid, '03500000-0000-4000-8000-000000000044'::uuid,
   'Que signifie « news » ?', 'mcq',
   '["les informations / l''actualité", "un journal intime", "un roman", "une publicité"]', 0,
   'News = les informations, l''actualité.', 1),
  ('03510000-0000-4000-8000-000000000442'::uuid, '03500000-0000-4000-8000-000000000044'::uuid,
   'Comment dit-on « un réseau social » en anglais ?', 'mcq',
   '["a social network", "a homework", "a headline", "a channel"]', 0,
   'Social network = réseau social.', 2),
  ('03510000-0000-4000-8000-000000000443'::uuid, '03500000-0000-4000-8000-000000000044'::uuid,
   'Le verbe « to share » signifie « partager ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'To share = partager.', 3),

  -- 45 — Portraits d'artistes anglophones
  ('03510000-0000-4000-8000-000000000451'::uuid, '03500000-0000-4000-8000-000000000045'::uuid,
   'Que signifie « a singer » ?', 'mcq',
   '["un chanteur / une chanteuse", "un peintre", "un écrivain", "un acteur"]', 0,
   'Singer vient de to sing (chanter).', 1),
  ('03510000-0000-4000-8000-000000000452'::uuid, '03500000-0000-4000-8000-000000000045'::uuid,
   'Comment dit-on « un écrivain » en anglais ?', 'mcq',
   '["a writer", "a painter", "a dancer", "a player"]', 0,
   'Writer vient de to write (écrire).', 2),
  ('03510000-0000-4000-8000-000000000453'::uuid, '03500000-0000-4000-8000-000000000045'::uuid,
   'Le mot « famous » signifie « célèbre ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Famous = célèbre, connu.', 3),

  -- ===== 3e =====
  -- 31 — Le passif
  ('03510000-0000-4000-8000-000000000311'::uuid, '03500000-0000-4000-8000-000000000031'::uuid,
   'Comment se forme la voix passive en anglais ?', 'mcq',
   '["be + participe passé", "have + base verbale", "will + -ing", "do + base verbale"]', 0,
   'Par exemple : « The book was written by… ».', 1),
  ('03510000-0000-4000-8000-000000000312'::uuid, '03500000-0000-4000-8000-000000000031'::uuid,
   'Mets à la voix passive : « They built the house. » →', 'mcq',
   '["The house was built", "The house is build", "The house has build", "The house building"]', 0,
   'was + built (participe passé de build).', 2),
  ('03510000-0000-4000-8000-000000000313'::uuid, '03500000-0000-4000-8000-000000000031'::uuid,
   'Dans une phrase passive, l''auteur de l''action peut être introduit par « by ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par exemple : « … by the workers. »', 3),

  -- 32 — Les modaux
  ('03510000-0000-4000-8000-000000000321'::uuid, '03500000-0000-4000-8000-000000000032'::uuid,
   'Quel modal exprime un conseil ?', 'mcq',
   '["should", "must not", "can", "will"]', 0,
   '« You should rest. » = tu devrais te reposer.', 1),
  ('03510000-0000-4000-8000-000000000322'::uuid, '03500000-0000-4000-8000-000000000032'::uuid,
   'Quel modal exprime une obligation forte ?', 'mcq',
   '["must", "might", "could", "may"]', 0,
   '« You must stop. » = tu dois t''arrêter.', 2),
  ('03510000-0000-4000-8000-000000000323'::uuid, '03500000-0000-4000-8000-000000000032'::uuid,
   'Après un modal comme « can » ou « should », on emploie la base verbale sans « to ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On dit « You can swim » et non « You can to swim ».', 3),

  -- 33 — Present perfect vs prétérit
  ('03510000-0000-4000-8000-000000000331'::uuid, '03500000-0000-4000-8000-000000000033'::uuid,
   'Avec une date passée précise (« yesterday », « in 2010 »), on emploie…', 'mcq',
   '["le prétérit", "le present perfect", "le futur", "le présent en -ing"]', 0,
   'Par exemple : « I saw him yesterday. »', 1),
  ('03510000-0000-4000-8000-000000000332'::uuid, '03500000-0000-4000-8000-000000000033'::uuid,
   'Complète : « I ___ never been to Japan. »', 'mcq',
   '["have", "did", "was", "will"]', 0,
   'Present perfect : have + been.', 2),
  ('03510000-0000-4000-8000-000000000333'::uuid, '03500000-0000-4000-8000-000000000033'::uuid,
   'Le prétérit s''emploie pour une action passée datée et terminée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Contrairement au present perfect, il coupe le lien avec le présent.', 3),

  -- 34 — Le monde du travail
  ('03510000-0000-4000-8000-000000000341'::uuid, '03500000-0000-4000-8000-000000000034'::uuid,
   'Que signifie « a job » ?', 'mcq',
   '["un emploi / un travail", "un jeu", "un voyage", "une matière scolaire"]', 0,
   'Job = emploi, travail.', 1),
  ('03510000-0000-4000-8000-000000000342'::uuid, '03500000-0000-4000-8000-000000000034'::uuid,
   'Comment dit-on « un entretien d''embauche » ?', 'mcq',
   '["an interview", "a homework", "a meeting room", "a salary"]', 0,
   'Interview = entretien.', 2),
  ('03510000-0000-4000-8000-000000000343'::uuid, '03500000-0000-4000-8000-000000000034'::uuid,
   'Le mot « salary » signifie « salaire ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Salary = salaire.', 3),

  -- 35 — Préparer l'épreuve orale
  ('03510000-0000-4000-8000-000000000351'::uuid, '03500000-0000-4000-8000-000000000035'::uuid,
   'Pour un bon oral d''anglais, il vaut mieux…', 'mcq',
   '["parler clairement et soigner la prononciation", "parler très vite pour finir", "lire sans lever les yeux", "chuchoter"]', 0,
   'La clarté et la prononciation priment sur la vitesse.', 1),
  ('03510000-0000-4000-8000-000000000352'::uuid, '03500000-0000-4000-8000-000000000035'::uuid,
   'Comment demande-t-on poliment de répéter en anglais ?', 'mcq',
   '["Could you repeat, please?", "Give me that!", "I don''t care.", "Go away."]', 0,
   'Une formule polie avec « please ».', 2),
  ('03510000-0000-4000-8000-000000000353'::uuid, '03500000-0000-4000-8000-000000000035'::uuid,
   'Utiliser des connecteurs comme « first », « then », « finally » aide à structurer son oral.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils organisent le discours et le rendent plus clair.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03500000-%' GROUP BY 1,2 ORDER BY 1,2;
