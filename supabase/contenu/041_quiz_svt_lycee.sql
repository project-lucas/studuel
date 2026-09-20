-- =============================================================================
-- Studuel — Migration 041 : quiz de leçon, SVT lycée 2de·1re·Tle
--   (14 quiz, 42 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'svt' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Niveaux lycée : 2de, 1re, Tle.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'SVT', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('04100000-0000-4000-8000-000000000021'::uuid, '2de', 'La cellule, unité du vivant', 'La cellule, unité du vivant'),
  ('04100000-0000-4000-8000-000000000022'::uuid, '2de', 'Biodiversité et évolution',   'Biodiversité et évolution'),
  ('04100000-0000-4000-8000-000000000023'::uuid, '2de', 'Le métabolisme cellulaire',   'Le métabolisme cellulaire'),
  ('04100000-0000-4000-8000-000000000024'::uuid, '2de', 'Érosion et sédimentation',    'Érosion et sédimentation'),
  ('04100000-0000-4000-8000-000000000025'::uuid, '2de', 'Microorganismes et santé',    'Microorganismes et santé'),
  -- 1re
  ('04100000-0000-4000-8000-000000000011'::uuid, '1re', 'Expression du patrimoine génétique', 'Expression du patrimoine génétique'),
  ('04100000-0000-4000-8000-000000000012'::uuid, '1re', 'La dynamique interne de la Terre',   'La dynamique interne de la Terre'),
  ('04100000-0000-4000-8000-000000000013'::uuid, '1re', 'Écosystèmes et services',           'Écosystèmes et services'),
  ('04100000-0000-4000-8000-000000000014'::uuid, '1re', 'Variation génétique et santé',       'Variation génétique et santé'),
  -- Tle
  ('04100000-0000-4000-8000-000000000031'::uuid, 'Tle', 'Génétique et évolution',                    'Génétique et évolution'),
  ('04100000-0000-4000-8000-000000000032'::uuid, 'Tle', 'Le temps et les roches',                    'Le temps et les roches'),
  ('04100000-0000-4000-8000-000000000033'::uuid, 'Tle', 'Les climats de la Terre',                   'Les climats de la Terre'),
  ('04100000-0000-4000-8000-000000000034'::uuid, 'Tle', 'Comportement et stress',                    'Comportement et stress'),
  ('04100000-0000-4000-8000-000000000035'::uuid, 'Tle', 'De la plante sauvage à la plante cultivée', 'De la plante sauvage à la plante cultivée')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — La cellule
  ('04110000-0000-4000-8000-000000000211'::uuid, '04100000-0000-4000-8000-000000000021'::uuid,
   'Quelle est l''unité de base de tous les êtres vivants ?', 'mcq',
   '["la cellule", "l''atome", "la molécule d''eau", "le cristal"]', 0,
   'Tous les êtres vivants sont constitués d''une ou de plusieurs cellules.', 1),
  ('04110000-0000-4000-8000-000000000212'::uuid, '04100000-0000-4000-8000-000000000021'::uuid,
   'Comment nomme-t-on une cellule qui possède un noyau ?', 'mcq',
   '["eucaryote", "procaryote", "minérale", "inerte"]', 0,
   'Eucaryote : avec noyau. Procaryote : sans noyau (bactéries).', 2),
  ('04110000-0000-4000-8000-000000000213'::uuid, '04100000-0000-4000-8000-000000000021'::uuid,
   'Certains êtres vivants sont unicellulaires (formés d''une seule cellule).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par exemple les bactéries ou certaines algues.', 3),

  -- 22 — Biodiversité et évolution
  ('04110000-0000-4000-8000-000000000221'::uuid, '04100000-0000-4000-8000-000000000022'::uuid,
   'Que désigne la biodiversité ?', 'mcq',
   '["la diversité du vivant (espèces, gènes, écosystèmes)", "la seule diversité des roches", "la météo", "le nombre d''atomes"]', 0,
   'Elle se mesure à plusieurs échelles du vivant.', 1),
  ('04110000-0000-4000-8000-000000000222'::uuid, '04100000-0000-4000-8000-000000000022'::uuid,
   'Quel mécanisme Darwin propose-t-il pour expliquer l''évolution ?', 'mcq',
   '["la sélection naturelle", "la génération spontanée", "la photosynthèse", "l''érosion"]', 0,
   'Les individus les mieux adaptés se reproduisent davantage.', 2),
  ('04110000-0000-4000-8000-000000000223'::uuid, '04100000-0000-4000-8000-000000000022'::uuid,
   'La biodiversité évolue au cours du temps.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Des espèces apparaissent, d''autres disparaissent.', 3),

  -- 23 — Le métabolisme cellulaire
  ('04110000-0000-4000-8000-000000000231'::uuid, '04100000-0000-4000-8000-000000000023'::uuid,
   'Comment appelle-t-on l''ensemble des réactions chimiques d''une cellule ?', 'mcq',
   '["le métabolisme", "la digestion externe", "l''érosion", "la sédimentation"]', 0,
   'Le métabolisme regroupe toutes les réactions cellulaires.', 1),
  ('04110000-0000-4000-8000-000000000232'::uuid, '04100000-0000-4000-8000-000000000023'::uuid,
   'La photosynthèse est réalisée par des cellules contenant…', 'mcq',
   '["de la chlorophylle", "de l''hémoglobine", "du calcaire", "du sel"]', 0,
   'La chlorophylle capte l''énergie lumineuse.', 2),
  ('04110000-0000-4000-8000-000000000233'::uuid, '04100000-0000-4000-8000-000000000023'::uuid,
   'La respiration cellulaire libère de l''énergie à partir de nutriments.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle utilise du dioxygène et libère de l''énergie utilisable.', 3),

  -- 24 — Érosion et sédimentation
  ('04110000-0000-4000-8000-000000000241'::uuid, '04100000-0000-4000-8000-000000000024'::uuid,
   'Comment nomme-t-on l''altération et le transport des roches par l''eau, le vent ou le gel ?', 'mcq',
   '["l''érosion", "la photosynthèse", "la fécondation", "le métabolisme"]', 0,
   'L''érosion use et déplace les matériaux rocheux.', 1),
  ('04110000-0000-4000-8000-000000000242'::uuid, '04100000-0000-4000-8000-000000000024'::uuid,
   'L''accumulation et la compaction de sédiments donnent à terme…', 'mcq',
   '["des roches sédimentaires", "des volcans", "des cellules", "des étoiles"]', 0,
   'Les sédiments se transforment en roches sédimentaires.', 2),
  ('04110000-0000-4000-8000-000000000243'::uuid, '04100000-0000-4000-8000-000000000024'::uuid,
   'Les sédiments se déposent souvent en couches appelées strates.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les strates s''empilent au fil du temps.', 3),

  -- 25 — Microorganismes et santé
  ('04110000-0000-4000-8000-000000000251'::uuid, '04100000-0000-4000-8000-000000000025'::uuid,
   'Lequel de ces éléments est un microorganisme ?', 'mcq',
   '["une bactérie", "un chêne", "un éléphant", "une montagne"]', 0,
   'Bactéries, virus et levures sont microscopiques.', 1),
  ('04110000-0000-4000-8000-000000000252'::uuid, '04100000-0000-4000-8000-000000000025'::uuid,
   'Contre quoi un antibiotique agit-il ?', 'mcq',
   '["les bactéries", "les virus", "les os", "les roches"]', 0,
   'Les antibiotiques ciblent les bactéries, pas les virus.', 2),
  ('04110000-0000-4000-8000-000000000253'::uuid, '04100000-0000-4000-8000-000000000025'::uuid,
   'Certains microorganismes sont utiles (fabrication du pain, du yaourt).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Levures et bactéries lactiques sont employées en alimentation.', 3),

  -- ===== 1re =====
  -- 11 — Expression du patrimoine génétique
  ('04110000-0000-4000-8000-000000000111'::uuid, '04100000-0000-4000-8000-000000000011'::uuid,
   'Quelle molécule porte l''information génétique ?', 'mcq',
   '["l''ADN", "le calcium", "l''eau", "le sel"]', 0,
   'Les gènes sont des portions d''ADN.', 1),
  ('04110000-0000-4000-8000-000000000112'::uuid, '04100000-0000-4000-8000-000000000011'::uuid,
   'La fabrication d''une protéine passe par la transcription puis la…', 'mcq',
   '["traduction", "digestion", "respiration", "photosynthèse"]', 0,
   'ADN → ARN (transcription) → protéine (traduction).', 2),
  ('04110000-0000-4000-8000-000000000113'::uuid, '04100000-0000-4000-8000-000000000011'::uuid,
   'Une protéine est une molécule constituée d''une suite d''acides aminés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''enchaînement des acides aminés définit la protéine.', 3),

  -- 12 — La dynamique interne de la Terre
  ('04110000-0000-4000-8000-000000000121'::uuid, '04100000-0000-4000-8000-000000000012'::uuid,
   'En quoi la surface de la Terre est-elle découpée ?', 'mcq',
   '["en plaques lithosphériques (tectoniques)", "en plaques chlorophylliennes", "en couches gazeuses", "en cellules"]', 0,
   'Les plaques de la lithosphère se déplacent lentement.', 1),
  ('04110000-0000-4000-8000-000000000122'::uuid, '04100000-0000-4000-8000-000000000012'::uuid,
   'Où se concentrent surtout les séismes et les volcans ?', 'mcq',
   '["aux frontières des plaques", "au centre des océans calmes", "aux pôles seulement", "au hasard partout"]', 0,
   'L''activité se concentre aux limites de plaques.', 2),
  ('04110000-0000-4000-8000-000000000123'::uuid, '04100000-0000-4000-8000-000000000012'::uuid,
   'Le mouvement des plaques est très lent, de l''ordre de quelques centimètres par an.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Comparable à la vitesse de pousse des ongles.', 3),

  -- 13 — Écosystèmes et services
  ('04110000-0000-4000-8000-000000000131'::uuid, '04100000-0000-4000-8000-000000000013'::uuid,
   'Que comprend un écosystème ?', 'mcq',
   '["les êtres vivants et leur milieu", "seulement des roches", "uniquement l''atmosphère", "seulement des animaux"]', 0,
   'Un écosystème réunit les êtres vivants (biocénose) et leur milieu (biotope).', 1),
  ('04110000-0000-4000-8000-000000000132'::uuid, '04100000-0000-4000-8000-000000000013'::uuid,
   'La pollinisation par les insectes est un exemple de…', 'mcq',
   '["service rendu par la biodiversité", "pollution", "érosion", "réaction nucléaire"]', 0,
   'C''est un service écosystémique essentiel à l''agriculture.', 2),
  ('04110000-0000-4000-8000-000000000133'::uuid, '04100000-0000-4000-8000-000000000013'::uuid,
   'La déforestation peut réduire la biodiversité d''un écosystème.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle détruit des habitats et menace des espèces.', 3),

  -- 14 — Variation génétique et santé
  ('04110000-0000-4000-8000-000000000141'::uuid, '04100000-0000-4000-8000-000000000014'::uuid,
   'Comment appelle-t-on une modification de la séquence de l''ADN ?', 'mcq',
   '["une mutation", "une digestion", "une sédimentation", "une évaporation"]', 0,
   'Une mutation modifie l''information génétique.', 1),
  ('04110000-0000-4000-8000-000000000142'::uuid, '04100000-0000-4000-8000-000000000014'::uuid,
   'Pourquoi certaines maladies sont-elles dites héréditaires ?', 'mcq',
   '["elles sont transmises par les gènes des parents", "elles s''attrapent dans l''air", "elles viennent des roches", "elles n''ont aucune cause"]', 0,
   'Elles se transmettent par le patrimoine génétique.', 2),
  ('04110000-0000-4000-8000-000000000143'::uuid, '04100000-0000-4000-8000-000000000014'::uuid,
   'Les mutations peuvent être une source de diversité génétique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elles créent de nouvelles versions de gènes (allèles).', 3),

  -- ===== Tle =====
  -- 31 — Génétique et évolution
  ('04110000-0000-4000-8000-000000000311'::uuid, '04100000-0000-4000-8000-000000000031'::uuid,
   'Comment appelle-t-on les différentes versions d''un même gène ?', 'mcq',
   '["des allèles", "des protéines", "des cellules", "des atomes"]', 0,
   'Un gène peut exister sous plusieurs allèles.', 1),
  ('04110000-0000-4000-8000-000000000312'::uuid, '04100000-0000-4000-8000-000000000031'::uuid,
   'La dérive génétique et la sélection naturelle sont des mécanismes de…', 'mcq',
   '["l''évolution", "la digestion", "l''érosion", "la photosynthèse"]', 0,
   'Ils font évoluer la composition génétique des populations.', 2),
  ('04110000-0000-4000-8000-000000000313'::uuid, '04100000-0000-4000-8000-000000000031'::uuid,
   'Une espèce peut se diviser en deux espèces distinctes : c''est la spéciation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''isolement de populations peut mener à leur divergence.', 3),

  -- 32 — Le temps et les roches
  ('04110000-0000-4000-8000-000000000321'::uuid, '04100000-0000-4000-8000-000000000032'::uuid,
   'Comment date-t-on précisément certaines roches très anciennes ?', 'mcq',
   '["par la radioactivité (datation absolue)", "en les pesant", "avec un thermomètre", "au hasard"]', 0,
   'On utilise la désintégration d''éléments radioactifs.', 1),
  ('04110000-0000-4000-8000-000000000322'::uuid, '04100000-0000-4000-8000-000000000032'::uuid,
   'À quoi servent les fossiles présents dans une couche de roche ?', 'mcq',
   '["à la datation relative des roches", "à la cuisson des aliments", "à produire de l''électricité", "à la photosynthèse"]', 0,
   'Certains fossiles caractérisent une période géologique.', 2),
  ('04110000-0000-4000-8000-000000000323'::uuid, '04100000-0000-4000-8000-000000000032'::uuid,
   'Dans un empilement non perturbé, les couches les plus profondes sont les plus anciennes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le principe de superposition.', 3),

  -- 33 — Les climats de la Terre
  ('04110000-0000-4000-8000-000000000331'::uuid, '04100000-0000-4000-8000-000000000033'::uuid,
   'Quel gaz issu des activités humaines contribue le plus à l''effet de serre additionnel ?', 'mcq',
   '["le dioxyde de carbone (CO₂)", "l''hélium", "le diazote", "l''argon"]', 0,
   'Le CO₂ est le principal gaz à effet de serre d''origine humaine.', 1),
  ('04110000-0000-4000-8000-000000000332'::uuid, '04100000-0000-4000-8000-000000000033'::uuid,
   'Sur quoi s''appuie notamment l''étude des climats du passé (paléoclimats) ?', 'mcq',
   '["les carottes de glace", "les journaux télévisés", "les cartes routières", "les horoscopes"]', 0,
   'Les glaces polaires piègent des indices climatiques anciens.', 2),
  ('04110000-0000-4000-8000-000000000333'::uuid, '04100000-0000-4000-8000-000000000033'::uuid,
   'Le climat actuel se réchauffe principalement à cause des activités humaines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les émissions de gaz à effet de serre en sont la cause majeure.', 3),

  -- 34 — Comportement et stress
  ('04110000-0000-4000-8000-000000000341'::uuid, '04100000-0000-4000-8000-000000000034'::uuid,
   'Quelle hormone l''organisme libère-t-il face à un danger (stress aigu) ?', 'mcq',
   '["l''adrénaline", "la chlorophylle", "l''insuline", "la kératine"]', 0,
   'L''adrénaline prépare l''organisme à réagir rapidement.', 1),
  ('04110000-0000-4000-8000-000000000342'::uuid, '04100000-0000-4000-8000-000000000034'::uuid,
   'Lors d''un stress aigu, le rythme cardiaque…', 'mcq',
   '["augmente", "s''arrête", "reste nul", "diminue fortement"]', 0,
   'Le cœur s''accélère pour mobiliser l''organisme.', 2),
  ('04110000-0000-4000-8000-000000000343'::uuid, '04100000-0000-4000-8000-000000000034'::uuid,
   'Un stress chronique (prolongé) peut être néfaste pour la santé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il a des effets délétères sur le corps à long terme.', 3),

  -- 35 — De la plante sauvage à la plante cultivée
  ('04110000-0000-4000-8000-000000000351'::uuid, '04100000-0000-4000-8000-000000000035'::uuid,
   'Comment l''être humain a-t-il obtenu des plantes cultivées plus productives ?', 'mcq',
   '["par sélection au fil des générations", "en les peignant", "par pur hasard sans choix", "en les congelant"]', 0,
   'La domestication repose sur la sélection des meilleurs plants.', 1),
  ('04110000-0000-4000-8000-000000000352'::uuid, '04100000-0000-4000-8000-000000000035'::uuid,
   'Grâce à quel processus la plante fabrique-t-elle sa matière organique ?', 'mcq',
   '["la photosynthèse", "la respiration seule", "la digestion", "l''érosion"]', 0,
   'La photosynthèse produit de la matière à partir de lumière, d''eau et de CO₂.', 2),
  ('04110000-0000-4000-8000-000000000353'::uuid, '04100000-0000-4000-8000-000000000035'::uuid,
   'La domestication a modifié les caractères des plantes cultivées par rapport aux plantes sauvages.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Fruits plus gros, meilleurs rendements, etc.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '04100000-%' GROUP BY 1,2 ORDER BY 1,2;
