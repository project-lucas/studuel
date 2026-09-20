-- =============================================================================
-- Studuel — Migration 036 : quiz de leçon, SVT collège 6e·5e·4e·3e
--   (18 quiz, 54 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'svt' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Le chapitre 6e « Le vivant et sa diversité » a déjà son quiz.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'SVT', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 6e (Le vivant et sa diversité déjà couvert)
  ('03600000-0000-4000-8000-000000000061'::uuid, '6e', 'Le développement des êtres vivants', 'Le développement des êtres vivants'),
  ('03600000-0000-4000-8000-000000000062'::uuid, '6e', 'Les besoins des plantes vertes',     'Les besoins des plantes vertes'),
  ('03600000-0000-4000-8000-000000000063'::uuid, '6e', 'L''origine de nos aliments',         'L''origine de nos aliments'),
  ('03600000-0000-4000-8000-000000000064'::uuid, '6e', 'La Terre dans le système solaire',   'La Terre dans le système solaire'),
  -- 5e
  ('03600000-0000-4000-8000-000000000051'::uuid, '5e', 'La nutrition des êtres vivants',   'La nutrition des êtres vivants'),
  ('03600000-0000-4000-8000-000000000052'::uuid, '5e', 'La respiration en milieux variés', 'La respiration en milieux variés'),
  ('03600000-0000-4000-8000-000000000053'::uuid, '5e', 'Géologie externe : les paysages',  'Géologie externe : les paysages'),
  ('03600000-0000-4000-8000-000000000054'::uuid, '5e', 'La reproduction sexuée',           'La reproduction sexuée'),
  ('03600000-0000-4000-8000-000000000055'::uuid, '5e', 'Les besoins de l''organisme',      'Les besoins de l''organisme'),
  -- 4e
  ('03600000-0000-4000-8000-000000000041'::uuid, '4e', 'L''activité interne du globe', 'L''activité interne du globe'),
  ('03600000-0000-4000-8000-000000000042'::uuid, '4e', 'La transmission de la vie',   'La transmission de la vie'),
  ('03600000-0000-4000-8000-000000000043'::uuid, '4e', 'Le système nerveux',          'Le système nerveux'),
  ('03600000-0000-4000-8000-000000000044'::uuid, '4e', 'Météorologie et climats',     'Météorologie et climats'),
  -- 3e
  ('03600000-0000-4000-8000-000000000031'::uuid, '3e', 'Le programme génétique',    'Le programme génétique'),
  ('03600000-0000-4000-8000-000000000032'::uuid, '3e', 'L''évolution des espèces',  'L''évolution des espèces'),
  ('03600000-0000-4000-8000-000000000033'::uuid, '3e', 'Le système immunitaire',    'Le système immunitaire'),
  ('03600000-0000-4000-8000-000000000034'::uuid, '3e', 'Santé et responsabilité',   'Santé et responsabilité'),
  ('03600000-0000-4000-8000-000000000035'::uuid, '3e', 'Les risques géologiques',   'Les risques géologiques')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 6e =====
  -- 61 — Le développement des êtres vivants
  ('03610000-0000-4000-8000-000000000611'::uuid, '03600000-0000-4000-8000-000000000061'::uuid,
   'Comment appelle-t-on la transformation d''une chenille en papillon ?', 'mcq',
   '["une métamorphose", "une photosynthèse", "une digestion", "une érosion"]', 0,
   'La métamorphose est un changement complet de forme au cours du développement.', 1),
  ('03610000-0000-4000-8000-000000000612'::uuid, '03600000-0000-4000-8000-000000000061'::uuid,
   'Un être vivant qui grandit et change de la naissance à l''âge adulte réalise son…', 'mcq',
   '["développement", "extinction", "recyclage", "refroidissement"]', 0,
   'Le développement mène de l''œuf ou du jeune jusqu''à l''adulte.', 2),
  ('03610000-0000-4000-8000-000000000613'::uuid, '03600000-0000-4000-8000-000000000061'::uuid,
   'Chez certains animaux, le jeune ne ressemble pas à l''adulte (têtard / grenouille).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le têtard devient grenouille par métamorphose.', 3),

  -- 62 — Les besoins des plantes vertes
  ('03610000-0000-4000-8000-000000000621'::uuid, '03600000-0000-4000-8000-000000000062'::uuid,
   'De quoi une plante verte a-t-elle besoin pour fabriquer sa matière ?', 'mcq',
   '["lumière, eau et dioxyde de carbone", "de la viande", "de l''électricité", "du sable uniquement"]', 0,
   'C''est la photosynthèse : lumière + eau + dioxyde de carbone.', 1),
  ('03610000-0000-4000-8000-000000000622'::uuid, '03600000-0000-4000-8000-000000000062'::uuid,
   'Comment nomme-t-on la fabrication de matière par les plantes à la lumière ?', 'mcq',
   '["la photosynthèse", "la respiration", "la digestion", "la fermentation"]', 0,
   'La photosynthèse a lieu dans les feuilles, grâce à la chlorophylle.', 2),
  ('03610000-0000-4000-8000-000000000623'::uuid, '03600000-0000-4000-8000-000000000062'::uuid,
   'Les plantes puisent l''eau et les sels minéraux dans le sol par leurs racines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les racines absorbent l''eau et les minéraux nécessaires.', 3),

  -- 63 — L'origine de nos aliments
  ('03610000-0000-4000-8000-000000000631'::uuid, '03600000-0000-4000-8000-000000000063'::uuid,
   'Un steak est un aliment d''origine…', 'mcq',
   '["animale", "végétale", "minérale", "plastique"]', 0,
   'La viande provient d''un animal.', 1),
  ('03610000-0000-4000-8000-000000000632'::uuid, '03600000-0000-4000-8000-000000000063'::uuid,
   'Comment appelle-t-on la transformation du lait en yaourt par des micro-organismes ?', 'mcq',
   '["une fermentation", "une évaporation", "une congélation", "une photosynthèse"]', 0,
   'Des bactéries transforment le lait : c''est une fermentation.', 2),
  ('03610000-0000-4000-8000-000000000633'::uuid, '03600000-0000-4000-8000-000000000063'::uuid,
   'Le pain et les pâtes sont fabriqués à partir de végétaux (céréales).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils sont issus du blé, une plante.', 3),

  -- 64 — La Terre dans le système solaire
  ('03610000-0000-4000-8000-000000000641'::uuid, '03600000-0000-4000-8000-000000000064'::uuid,
   'Autour de quel astre la Terre tourne-t-elle ?', 'mcq',
   '["le Soleil", "la Lune", "Mars", "une étoile filante"]', 0,
   'La Terre est une planète en orbite autour du Soleil.', 1),
  ('03610000-0000-4000-8000-000000000642'::uuid, '03600000-0000-4000-8000-000000000064'::uuid,
   'Combien de temps met la Terre pour faire un tour complet autour du Soleil ?', 'mcq',
   '["un an", "un jour", "un mois", "une heure"]', 0,
   'Une révolution dure environ 365 jours, soit un an.', 2),
  ('03610000-0000-4000-8000-000000000643'::uuid, '03600000-0000-4000-8000-000000000064'::uuid,
   'L''alternance du jour et de la nuit est due à la rotation de la Terre sur elle-même.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La Terre tourne sur son axe en environ 24 heures.', 3),

  -- ===== 5e =====
  -- 51 — La nutrition des êtres vivants
  ('03610000-0000-4000-8000-000000000511'::uuid, '03600000-0000-4000-8000-000000000051'::uuid,
   'Comment appelle-t-on la transformation des aliments en nutriments ?', 'mcq',
   '["la digestion", "la respiration", "la circulation", "l''excrétion"]', 0,
   'La digestion découpe les aliments en petits nutriments assimilables.', 1),
  ('03610000-0000-4000-8000-000000000512'::uuid, '03600000-0000-4000-8000-000000000051'::uuid,
   'Dans quel organe les nutriments passent-ils dans le sang ?', 'mcq',
   '["l''intestin grêle", "le cœur", "le poumon", "l''œil"]', 0,
   'L''absorption des nutriments a lieu dans l''intestin grêle.', 2),
  ('03610000-0000-4000-8000-000000000513'::uuid, '03600000-0000-4000-8000-000000000051'::uuid,
   'Le sang transporte les nutriments et le dioxygène vers tous les organes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La circulation sanguine distribue nutriments et dioxygène.', 3),

  -- 52 — La respiration en milieux variés
  ('03610000-0000-4000-8000-000000000521'::uuid, '03600000-0000-4000-8000-000000000052'::uuid,
   'Avec quel organe un poisson respire-t-il dans l''eau ?', 'mcq',
   '["les branchies", "les poumons", "la peau seulement", "les racines"]', 0,
   'Les branchies prélèvent le dioxygène dissous dans l''eau.', 1),
  ('03610000-0000-4000-8000-000000000522'::uuid, '03600000-0000-4000-8000-000000000052'::uuid,
   'Quel gaz les êtres vivants prélèvent-ils lors de la respiration ?', 'mcq',
   '["le dioxygène", "le dioxyde de carbone", "l''azote", "l''hélium"]', 0,
   'La respiration absorbe du dioxygène et rejette du dioxyde de carbone.', 2),
  ('03610000-0000-4000-8000-000000000523'::uuid, '03600000-0000-4000-8000-000000000052'::uuid,
   'Les mammifères respirent grâce à leurs poumons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''homme, le chien ou la baleine respirent avec des poumons.', 3),

  -- 53 — Géologie externe
  ('03610000-0000-4000-8000-000000000531'::uuid, '03600000-0000-4000-8000-000000000053'::uuid,
   'Quel phénomène use et transporte les roches (vent, eau, gel) ?', 'mcq',
   '["l''érosion", "la fermentation", "la digestion", "la photosynthèse"]', 0,
   'L''érosion use les roches et façonne les paysages.', 1),
  ('03610000-0000-4000-8000-000000000532'::uuid, '03600000-0000-4000-8000-000000000053'::uuid,
   'Quand des débris se déposent au fond de l''eau et s''accumulent, on parle de…', 'mcq',
   '["sédimentation", "évaporation", "combustion", "respiration"]', 0,
   'Les sédiments s''accumulent en couches successives.', 2),
  ('03610000-0000-4000-8000-000000000533'::uuid, '03600000-0000-4000-8000-000000000053'::uuid,
   'L''eau, le vent et le gel participent à l''érosion des roches.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ce sont des agents d''érosion qui modèlent les reliefs.', 3),

  -- 54 — La reproduction sexuée
  ('03610000-0000-4000-8000-000000000541'::uuid, '03600000-0000-4000-8000-000000000054'::uuid,
   'La reproduction sexuée nécessite la rencontre de deux cellules :', 'mcq',
   '["un spermatozoïde et un ovule", "deux racines", "deux feuilles", "deux pierres"]', 0,
   'La cellule mâle et la cellule femelle fusionnent lors de la fécondation.', 1),
  ('03610000-0000-4000-8000-000000000542'::uuid, '03600000-0000-4000-8000-000000000054'::uuid,
   'Comment nomme-t-on l''union de la cellule mâle et de la cellule femelle ?', 'mcq',
   '["la fécondation", "la digestion", "l''érosion", "la respiration"]', 0,
   'La fécondation forme une cellule-œuf.', 2),
  ('03610000-0000-4000-8000-000000000543'::uuid, '03600000-0000-4000-8000-000000000054'::uuid,
   'La cellule-œuf issue de la fécondation se développe en un nouvel individu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle se divise de nombreuses fois et forme un embryon.', 3),

  -- 55 — Les besoins de l'organisme
  ('03610000-0000-4000-8000-000000000551'::uuid, '03600000-0000-4000-8000-000000000055'::uuid,
   'Lors d''un effort physique, les besoins des muscles en dioxygène et nutriments…', 'mcq',
   '["augmentent", "disparaissent", "restent nuls", "diminuent fortement"]', 0,
   'L''effort augmente la consommation des muscles.', 1),
  ('03610000-0000-4000-8000-000000000552'::uuid, '03600000-0000-4000-8000-000000000055'::uuid,
   'Pourquoi le cœur bat-il plus vite pendant un effort ?', 'mcq',
   '["pour apporter plus de dioxygène et de nutriments aux muscles", "pour refroidir la peau", "pour digérer plus vite", "sans aucune raison"]', 0,
   'Il augmente le débit du sang vers les muscles actifs.', 2),
  ('03610000-0000-4000-8000-000000000553'::uuid, '03600000-0000-4000-8000-000000000055'::uuid,
   'Une alimentation équilibrée et de l''activité physique sont bonnes pour la santé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elles préviennent de nombreuses maladies.', 3),

  -- ===== 4e =====
  -- 41 — L'activité interne du globe
  ('03610000-0000-4000-8000-000000000411'::uuid, '03600000-0000-4000-8000-000000000041'::uuid,
   'Qu''est-ce qui sort d''un volcan en éruption ?', 'mcq',
   '["de la lave (magma)", "de l''eau potable", "du sable sec", "de la glace"]', 0,
   'Le magma remonte et sort sous forme de lave.', 1),
  ('03610000-0000-4000-8000-000000000412'::uuid, '03600000-0000-4000-8000-000000000041'::uuid,
   'Qu''est-ce qu''un séisme ?', 'mcq',
   '["un tremblement de terre", "une marée", "un orage", "une éclipse"]', 0,
   'C''est une secousse due à une rupture dans la croûte terrestre.', 2),
  ('03610000-0000-4000-8000-000000000413'::uuid, '03600000-0000-4000-8000-000000000041'::uuid,
   'La surface de la Terre est découpée en plaques (tectoniques) qui se déplacent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Leur mouvement provoque séismes et volcans.', 3),

  -- 42 — La transmission de la vie
  ('03610000-0000-4000-8000-000000000421'::uuid, '03600000-0000-4000-8000-000000000042'::uuid,
   'Où se développe le bébé pendant la grossesse ?', 'mcq',
   '["dans l''utérus de la mère", "dans l''estomac", "dans les poumons", "dans le cerveau"]', 0,
   'Le fœtus se développe dans l''utérus.', 1),
  ('03610000-0000-4000-8000-000000000422'::uuid, '03600000-0000-4000-8000-000000000042'::uuid,
   'Comment appelle-t-on la période de transformations entre l''enfance et l''âge adulte ?', 'mcq',
   '["la puberté", "la digestion", "l''érosion", "la fécondation"]', 0,
   'La puberté rend le corps capable de se reproduire.', 2),
  ('03610000-0000-4000-8000-000000000423'::uuid, '03600000-0000-4000-8000-000000000042'::uuid,
   'Chez l''humain, la fécondation unit un spermatozoïde et un ovule.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Cette union forme une cellule-œuf.', 3),

  -- 43 — Le système nerveux
  ('03610000-0000-4000-8000-000000000431'::uuid, '03600000-0000-4000-8000-000000000043'::uuid,
   'Quel organe est le centre de commande du système nerveux ?', 'mcq',
   '["le cerveau", "l''estomac", "le foie", "le poumon"]', 0,
   'Le cerveau reçoit, traite les informations et commande les réponses.', 1),
  ('03610000-0000-4000-8000-000000000432'::uuid, '03600000-0000-4000-8000-000000000043'::uuid,
   'Quels éléments transmettent les messages nerveux dans le corps ?', 'mcq',
   '["les nerfs", "les os", "les cheveux", "les ongles"]', 0,
   'Les nerfs relient les organes des sens, le cerveau et les muscles.', 2),
  ('03610000-0000-4000-8000-000000000433'::uuid, '03600000-0000-4000-8000-000000000043'::uuid,
   'L''alcool et certaines drogues perturbent le fonctionnement du système nerveux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils ralentissent ou modifient la transmission des messages nerveux.', 3),

  -- 44 — Météorologie et climats
  ('03610000-0000-4000-8000-000000000441'::uuid, '03600000-0000-4000-8000-000000000044'::uuid,
   'Quelle est la différence entre la météo et le climat ?', 'mcq',
   '["la météo décrit le temps au jour le jour, le climat sur de longues périodes", "il n''y a aucune différence", "le climat change chaque heure", "la météo dure des siècles"]', 0,
   'Le climat décrit les tendances sur des dizaines d''années.', 1),
  ('03610000-0000-4000-8000-000000000442'::uuid, '03600000-0000-4000-8000-000000000044'::uuid,
   'Quel instrument mesure la température de l''air ?', 'mcq',
   '["le thermomètre", "la boussole", "la règle", "le microscope"]', 0,
   'Le thermomètre mesure la température.', 2),
  ('03610000-0000-4000-8000-000000000443'::uuid, '03600000-0000-4000-8000-000000000044'::uuid,
   'Les activités humaines contribuent au réchauffement climatique actuel.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les gaz à effet de serre émis par l''homme réchauffent le climat.', 3),

  -- ===== 3e =====
  -- 31 — Le programme génétique
  ('03610000-0000-4000-8000-000000000311'::uuid, '03600000-0000-4000-8000-000000000031'::uuid,
   'Où se trouve l''information génétique dans nos cellules ?', 'mcq',
   '["dans le noyau (les chromosomes)", "dans la peau", "dans les cheveux morts", "dans l''air"]', 0,
   'Les chromosomes, situés dans le noyau, portent l''ADN.', 1),
  ('03610000-0000-4000-8000-000000000312'::uuid, '03600000-0000-4000-8000-000000000031'::uuid,
   'De quelle molécule les gènes sont-ils constitués ?', 'mcq',
   '["l''ADN", "l''eau", "le calcium", "le sel"]', 0,
   'Un gène est une portion d''ADN.', 2),
  ('03610000-0000-4000-8000-000000000313'::uuid, '03600000-0000-4000-8000-000000000031'::uuid,
   'Les caractères héréditaires se transmettent des parents aux enfants.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils passent par les chromosomes des cellules reproductrices.', 3),

  -- 32 — L'évolution des espèces
  ('03610000-0000-4000-8000-000000000321'::uuid, '03600000-0000-4000-8000-000000000032'::uuid,
   'Quel scientifique a proposé la théorie de l''évolution par sélection naturelle ?', 'mcq',
   '["Charles Darwin", "Isaac Newton", "Albert Einstein", "Louis Pasteur"]', 0,
   'Charles Darwin, au XIXᵉ siècle.', 1),
  ('03610000-0000-4000-8000-000000000322'::uuid, '03600000-0000-4000-8000-000000000032'::uuid,
   'Que sont les fossiles ?', 'mcq',
   '["des restes ou des traces d''êtres vivants du passé", "des roches volcaniques récentes", "des météorites", "des minéraux fabriqués"]', 0,
   'Ils témoignent d''espèces qui ont vécu autrefois.', 2),
  ('03610000-0000-4000-8000-000000000323'::uuid, '03600000-0000-4000-8000-000000000032'::uuid,
   'Les espèces actuelles sont le résultat d''une longue évolution.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elles descendent d''espèces plus anciennes.', 3),

  -- 33 — Le système immunitaire
  ('03610000-0000-4000-8000-000000000331'::uuid, '03600000-0000-4000-8000-000000000033'::uuid,
   'Comment appelle-t-on un micro-organisme qui peut provoquer une maladie ?', 'mcq',
   '["un agent pathogène (microbe)", "un vaccin", "un nutriment", "un anticorps"]', 0,
   'Certaines bactéries et certains virus sont pathogènes.', 1),
  ('03610000-0000-4000-8000-000000000332'::uuid, '03600000-0000-4000-8000-000000000033'::uuid,
   'À quoi sert un vaccin ?', 'mcq',
   '["préparer le système immunitaire à se défendre contre une maladie", "guérir instantanément une blessure", "nourrir les muscles", "remplacer le sommeil"]', 0,
   'Le vaccin entraîne les défenses de l''organisme sans le rendre malade.', 2),
  ('03610000-0000-4000-8000-000000000333'::uuid, '03600000-0000-4000-8000-000000000033'::uuid,
   'Les globules blancs participent à la défense de l''organisme contre les infections.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils détruisent les microbes et fabriquent des anticorps.', 3),

  -- 34 — Santé et responsabilité
  ('03610000-0000-4000-8000-000000000341'::uuid, '03600000-0000-4000-8000-000000000034'::uuid,
   'Lequel de ces comportements est bon pour la santé ?', 'mcq',
   '["pratiquer une activité physique régulière", "fumer", "manger salé et sucré à l''excès", "dormir très peu"]', 0,
   'L''activité physique régulière protège le cœur et le corps.', 1),
  ('03610000-0000-4000-8000-000000000342'::uuid, '03600000-0000-4000-8000-000000000034'::uuid,
   'Le tabac est surtout nocif pour…', 'mcq',
   '["les poumons et le cœur", "les cheveux uniquement", "les ongles", "les dents seulement"]', 0,
   'Il augmente le risque de cancers et de maladies cardiovasculaires.', 2),
  ('03610000-0000-4000-8000-000000000343'::uuid, '03600000-0000-4000-8000-000000000034'::uuid,
   'Une bonne hygiène de vie (sommeil, alimentation, sport) réduit les risques de maladies.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le mode de vie joue un grand rôle dans la prévention.', 3),

  -- 35 — Les risques géologiques
  ('03610000-0000-4000-8000-000000000351'::uuid, '03600000-0000-4000-8000-000000000035'::uuid,
   'Lequel de ces phénomènes est un risque géologique ?', 'mcq',
   '["un séisme", "une bonne récolte", "un arc-en-ciel", "une éclaircie"]', 0,
   'Séismes, éruptions et glissements de terrain sont des risques géologiques.', 1),
  ('03610000-0000-4000-8000-000000000352'::uuid, '03600000-0000-4000-8000-000000000035'::uuid,
   'Comment réduire les dégâts d''un séisme dans une ville ?', 'mcq',
   '["construire des bâtiments parasismiques", "peindre les murs en rouge", "planter des fleurs", "ne rien faire"]', 0,
   'Les normes parasismiques limitent l''effondrement des bâtiments.', 2),
  ('03610000-0000-4000-8000-000000000353'::uuid, '03600000-0000-4000-8000-000000000035'::uuid,
   'On ne peut pas prévoir le jour exact d''un séisme, mais on peut s''y préparer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Prévention, alertes et constructions adaptées réduisent les risques.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03600000-%' GROUP BY 1,2 ORDER BY 1,2;
