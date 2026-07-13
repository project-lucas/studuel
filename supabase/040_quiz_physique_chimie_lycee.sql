-- =============================================================================
-- Studuel — Migration 040 : quiz de leçon, Physique-Chimie lycée 2de·1re·Tle
--   (15 quiz, 45 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'physique-chimie' → (niveau, titre chapitre) →
--   « L'essentiel du cours ». Niveaux lycée : 2de, 1re, Tle.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Physique-Chimie', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('04000000-0000-4000-8000-000000000021'::uuid, '2de', 'Constitution de la matière',           'Constitution de la matière'),
  ('04000000-0000-4000-8000-000000000022'::uuid, '2de', 'Transformations chimiques : équations', 'Transformations chimiques : équations'),
  ('04000000-0000-4000-8000-000000000023'::uuid, '2de', 'Le mouvement : vitesse et référentiel', 'Le mouvement : vitesse et référentiel'),
  ('04000000-0000-4000-8000-000000000024'::uuid, '2de', 'Ondes et signaux',                      'Ondes et signaux'),
  ('04000000-0000-4000-8000-000000000025'::uuid, '2de', 'La lumière : spectres',                 'La lumière : spectres'),
  -- 1re
  ('04000000-0000-4000-8000-000000000011'::uuid, '1re', 'Suivi d''une transformation chimique', 'Suivi d''une transformation chimique'),
  ('04000000-0000-4000-8000-000000000012'::uuid, '1re', 'Structure des entités chimiques',      'Structure des entités chimiques'),
  ('04000000-0000-4000-8000-000000000013'::uuid, '1re', 'Mouvement et interactions',            'Mouvement et interactions'),
  ('04000000-0000-4000-8000-000000000014'::uuid, '1re', 'L''énergie mécanique',                 'L''énergie mécanique'),
  ('04000000-0000-4000-8000-000000000015'::uuid, '1re', 'Ondes mécaniques',                     'Ondes mécaniques'),
  -- Tle
  ('04000000-0000-4000-8000-000000000031'::uuid, 'Tle', 'Cinétique chimique',                'Cinétique chimique'),
  ('04000000-0000-4000-8000-000000000032'::uuid, 'Tle', 'Acides et bases',                   'Acides et bases'),
  ('04000000-0000-4000-8000-000000000033'::uuid, 'Tle', 'Mécanique : lois de Newton',        'Mécanique : lois de Newton'),
  ('04000000-0000-4000-8000-000000000034'::uuid, 'Tle', 'Ondes lumineuses : diffraction',    'Ondes lumineuses : diffraction'),
  ('04000000-0000-4000-8000-000000000035'::uuid, 'Tle', 'Énergie et thermodynamique',        'Énergie et thermodynamique')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — Constitution de la matière
  ('04010000-0000-4000-8000-000000000211'::uuid, '04000000-0000-4000-8000-000000000021'::uuid,
   'De quoi un atome est-il constitué ?', 'mcq',
   '["d''un noyau et d''électrons qui l''entourent", "de molécules d''eau", "de cellules", "de photons uniquement"]', 0,
   'Un noyau (protons + neutrons) entouré d''électrons.', 1),
  ('04010000-0000-4000-8000-000000000212'::uuid, '04000000-0000-4000-8000-000000000021'::uuid,
   'Quelle particule du noyau porte une charge positive ?', 'mcq',
   '["le proton", "l''électron", "le neutron", "le photon"]', 0,
   'Proton : +, électron : −, neutron : neutre.', 2),
  ('04010000-0000-4000-8000-000000000213'::uuid, '04000000-0000-4000-8000-000000000021'::uuid,
   'Un atome est électriquement neutre : il a autant de protons que d''électrons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les charges positives et négatives se compensent exactement.', 3),

  -- 22 — Transformations chimiques : équations
  ('04010000-0000-4000-8000-000000000221'::uuid, '04000000-0000-4000-8000-000000000022'::uuid,
   'Que conserve-t-on dans une équation de réaction chimique ?', 'mcq',
   '["les atomes (on les équilibre)", "seulement l''eau", "rien", "uniquement l''énergie"]', 0,
   'La matière se conserve : mêmes atomes avant et après.', 1),
  ('04010000-0000-4000-8000-000000000222'::uuid, '04000000-0000-4000-8000-000000000022'::uuid,
   'Comment appelle-t-on les substances présentes avant la réaction ?', 'mcq',
   '["les réactifs", "les produits", "les catalyseurs", "les solvants"]', 0,
   'Les réactifs se transforment en produits.', 2),
  ('04010000-0000-4000-8000-000000000223'::uuid, '04000000-0000-4000-8000-000000000022'::uuid,
   'Équilibrer une équation, c''est avoir le même nombre de chaque atome de part et d''autre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la conservation des éléments chimiques.', 3),

  -- 23 — Le mouvement
  ('04010000-0000-4000-8000-000000000231'::uuid, '04000000-0000-4000-8000-000000000023'::uuid,
   'Par rapport à quoi décrit-on le mouvement d''un objet ?', 'mcq',
   '["un référentiel", "un aimant", "un spectre", "un atome"]', 0,
   'On choisit un référentiel (un repère lié à un observateur).', 1),
  ('04010000-0000-4000-8000-000000000232'::uuid, '04000000-0000-4000-8000-000000000023'::uuid,
   'Comment calcule-t-on une vitesse ?', 'mcq',
   '["distance ÷ durée", "distance × durée", "durée − distance", "masse × distance"]', 0,
   'v = distance parcourue / durée.', 2),
  ('04010000-0000-4000-8000-000000000233'::uuid, '04000000-0000-4000-8000-000000000023'::uuid,
   'Un même mouvement peut paraître différent selon le référentiel choisi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le mouvement est relatif au référentiel.', 3),

  -- 24 — Ondes et signaux
  ('04010000-0000-4000-8000-000000000241'::uuid, '04000000-0000-4000-8000-000000000024'::uuid,
   'Le son a besoin d''un milieu matériel. Dans le vide, le son…', 'mcq',
   '["ne se propage pas", "va plus vite", "devient lumineux", "reste identique"]', 0,
   'Sans matière, pas de propagation du son.', 1),
  ('04010000-0000-4000-8000-000000000242'::uuid, '04000000-0000-4000-8000-000000000024'::uuid,
   'En quelle unité se mesure la fréquence d''un signal ?', 'mcq',
   '["le hertz (Hz)", "le mètre (m)", "le volt (V)", "le gramme (g)"]', 0,
   'La fréquence se mesure en hertz.', 2),
  ('04010000-0000-4000-8000-000000000243'::uuid, '04000000-0000-4000-8000-000000000024'::uuid,
   'La lumière, elle, peut se propager dans le vide.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La lumière du Soleil traverse le vide spatial.', 3),

  -- 25 — La lumière : spectres
  ('04010000-0000-4000-8000-000000000251'::uuid, '04000000-0000-4000-8000-000000000025'::uuid,
   'Que forme la lumière blanche décomposée par un prisme ?', 'mcq',
   '["un spectre de couleurs (arc-en-ciel)", "du son", "une seule couleur", "de la chaleur seulement"]', 0,
   'Un spectre continu, du rouge au violet.', 1),
  ('04010000-0000-4000-8000-000000000252'::uuid, '04000000-0000-4000-8000-000000000025'::uuid,
   'Un gaz chaud sous faible pression émet un spectre…', 'mcq',
   '["de raies (discontinu)", "totalement noir", "sonore", "liquide"]', 0,
   'Ce spectre de raies est caractéristique des éléments présents.', 2),
  ('04010000-0000-4000-8000-000000000253'::uuid, '04000000-0000-4000-8000-000000000025'::uuid,
   'Analyser le spectre d''une étoile renseigne sur sa composition.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les raies révèlent les éléments chimiques de l''étoile.', 3),

  -- ===== 1re =====
  -- 11 — Suivi d'une transformation chimique
  ('04010000-0000-4000-8000-000000000111'::uuid, '04000000-0000-4000-8000-000000000011'::uuid,
   'Comment appelle-t-on le réactif entièrement consommé qui arrête la réaction ?', 'mcq',
   '["le réactif limitant", "le réactif en excès", "un spectateur", "le catalyseur"]', 0,
   'Le réactif limitant s''épuise le premier et stoppe la réaction.', 1),
  ('04010000-0000-4000-8000-000000000112'::uuid, '04000000-0000-4000-8000-000000000011'::uuid,
   'En quelle unité mesure-t-on une quantité de matière ?', 'mcq',
   '["la mole (mol)", "le mètre (m)", "le watt (W)", "la seconde (s)"]', 0,
   'La quantité de matière s''exprime en moles.', 2),
  ('04010000-0000-4000-8000-000000000113'::uuid, '04000000-0000-4000-8000-000000000011'::uuid,
   'Un tableau d''avancement permet de suivre les quantités de matière au cours de la réaction.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il relie réactifs et produits à l''avancement x.', 3),

  -- 12 — Structure des entités chimiques
  ('04010000-0000-4000-8000-000000000121'::uuid, '04000000-0000-4000-8000-000000000012'::uuid,
   'À quoi correspond une liaison covalente ?', 'mcq',
   '["un partage d''électrons entre atomes", "un transfert de neutrons", "une réaction nucléaire", "un changement d''état"]', 0,
   'Les atomes mettent en commun un ou plusieurs doublets d''électrons.', 1),
  ('04010000-0000-4000-8000-000000000122'::uuid, '04000000-0000-4000-8000-000000000012'::uuid,
   'Une molécule polaire possède…', 'mcq',
   '["des charges partielles + et −", "aucune charge", "uniquement des neutrons", "un seul atome"]', 0,
   'Les électrons y sont répartis de façon inégale.', 2),
  ('04010000-0000-4000-8000-000000000123'::uuid, '04000000-0000-4000-8000-000000000012'::uuid,
   'La géométrie d''une molécule dépend de la répartition de ses doublets d''électrons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le modèle de répulsion des doublets (VSEPR).', 3),

  -- 13 — Mouvement et interactions
  ('04010000-0000-4000-8000-000000000131'::uuid, '04000000-0000-4000-8000-000000000013'::uuid,
   'D''après le principe d''inertie, un objet soumis à aucune force…', 'mcq',
   '["garde une vitesse constante (ou reste immobile)", "accélère toujours", "s''arrête aussitôt", "tourne en rond"]', 0,
   'Mouvement rectiligne uniforme, ou repos.', 1),
  ('04010000-0000-4000-8000-000000000132'::uuid, '04000000-0000-4000-8000-000000000013'::uuid,
   'En quelle unité se mesure une force ?', 'mcq',
   '["le newton (N)", "le joule (J)", "le pascal (Pa)", "le kelvin (K)"]', 0,
   'La force s''exprime en newtons.', 2),
  ('04010000-0000-4000-8000-000000000133'::uuid, '04000000-0000-4000-8000-000000000013'::uuid,
   'Le poids d''un objet est une force dirigée vers le bas (vers le centre de la Terre).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il résulte de l''attraction gravitationnelle terrestre.', 3),

  -- 14 — L'énergie mécanique
  ('04010000-0000-4000-8000-000000000141'::uuid, '04000000-0000-4000-8000-000000000014'::uuid,
   'Comment appelle-t-on l''énergie liée au mouvement d''un objet ?', 'mcq',
   '["l''énergie cinétique", "l''énergie chimique", "l''énergie lumineuse", "l''énergie sonore"]', 0,
   'Énergie cinétique = ½ × m × v².', 1),
  ('04010000-0000-4000-8000-000000000142'::uuid, '04000000-0000-4000-8000-000000000014'::uuid,
   'L''énergie mécanique est la somme de l''énergie cinétique et de l''énergie…', 'mcq',
   '["potentielle", "sonore", "électrique", "nucléaire"]', 0,
   'Em = Ec + Ep.', 2),
  ('04010000-0000-4000-8000-000000000143'::uuid, '04000000-0000-4000-8000-000000000014'::uuid,
   'En l''absence de frottements, l''énergie mécanique se conserve.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ec et Ep s''échangent, mais leur somme reste constante.', 3),

  -- 15 — Ondes mécaniques
  ('04010000-0000-4000-8000-000000000151'::uuid, '04000000-0000-4000-8000-000000000015'::uuid,
   'De quoi une onde mécanique a-t-elle besoin pour se propager ?', 'mcq',
   '["d''un milieu matériel", "d''un vide parfait", "d''un aimant", "d''un miroir"]', 0,
   'Contrairement aux ondes lumineuses, elle exige de la matière.', 1),
  ('04010000-0000-4000-8000-000000000152'::uuid, '04000000-0000-4000-8000-000000000015'::uuid,
   'Comment appelle-t-on la distance parcourue par une onde pendant une période ?', 'mcq',
   '["la longueur d''onde", "la fréquence", "l''amplitude", "la masse"]', 0,
   'La longueur d''onde est notée λ.', 2),
  ('04010000-0000-4000-8000-000000000153'::uuid, '04000000-0000-4000-8000-000000000015'::uuid,
   'La fréquence d''une onde périodique s''exprime en hertz.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '1 Hz correspond à une oscillation par seconde.', 3),

  -- ===== Tle =====
  -- 31 — Cinétique chimique
  ('04010000-0000-4000-8000-000000000311'::uuid, '04000000-0000-4000-8000-000000000031'::uuid,
   'Qu''étudie la cinétique chimique ?', 'mcq',
   '["la vitesse des réactions", "la couleur des solutions", "le prix des réactifs", "la masse de la Terre"]', 0,
   'Elle décrit la rapidité d''évolution des réactions.', 1),
  ('04010000-0000-4000-8000-000000000312'::uuid, '04000000-0000-4000-8000-000000000031'::uuid,
   'Comment appelle-t-on une substance qui accélère une réaction sans être consommée ?', 'mcq',
   '["un catalyseur", "un réactif limitant", "un produit", "un solvant"]', 0,
   'Le catalyseur n''apparaît pas dans le bilan de la réaction.', 2),
  ('04010000-0000-4000-8000-000000000313'::uuid, '04000000-0000-4000-8000-000000000031'::uuid,
   'En général, augmenter la température accélère une réaction chimique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La température est un facteur cinétique.', 3),

  -- 32 — Acides et bases
  ('04010000-0000-4000-8000-000000000321'::uuid, '04000000-0000-4000-8000-000000000032'::uuid,
   'Selon Brønsted, un acide est une espèce capable de…', 'mcq',
   '["céder un proton H⁺", "capter un électron", "émettre de la lumière", "geler l''eau"]', 0,
   'Un acide donne un proton ; une base en capte un.', 1),
  ('04010000-0000-4000-8000-000000000322'::uuid, '04000000-0000-4000-8000-000000000032'::uuid,
   'Une solution de pH = 2 est…', 'mcq',
   '["acide", "basique", "neutre", "gazeuse"]', 0,
   'Un pH inférieur à 7 correspond à une solution acide.', 2),
  ('04010000-0000-4000-8000-000000000323'::uuid, '04000000-0000-4000-8000-000000000032'::uuid,
   'Plus le pH d''une solution est petit, plus elle est acide.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''acidité augmente quand le pH diminue.', 3),

  -- 33 — Mécanique : lois de Newton
  ('04010000-0000-4000-8000-000000000331'::uuid, '04000000-0000-4000-8000-000000000033'::uuid,
   'La deuxième loi de Newton relie la somme des forces à…', 'mcq',
   '["l''accélération (ΣF = m·a)", "la couleur", "le pH", "la fréquence"]', 0,
   'C''est le principe fondamental de la dynamique.', 1),
  ('04010000-0000-4000-8000-000000000332'::uuid, '04000000-0000-4000-8000-000000000033'::uuid,
   'Que énonce la troisième loi de Newton ?', 'mcq',
   '["le principe des actions réciproques (action-réaction)", "la conservation du pH", "la diffraction", "la définition de la mole"]', 0,
   'À toute action correspond une réaction opposée et de même intensité.', 2),
  ('04010000-0000-4000-8000-000000000333'::uuid, '04000000-0000-4000-8000-000000000033'::uuid,
   'D''après le principe d''inertie, un système isolé a un mouvement rectiligne uniforme (ou reste au repos).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la première loi de Newton.', 3),

  -- 34 — Ondes lumineuses : diffraction
  ('04010000-0000-4000-8000-000000000341'::uuid, '04000000-0000-4000-8000-000000000034'::uuid,
   'Quand une onde rencontre-t-elle le phénomène de diffraction ?', 'mcq',
   '["en passant par une ouverture ou un obstacle de petite taille", "en frappant un miroir plan", "près d''un aimant", "près d''une pile"]', 0,
   'L''onde s''étale après une fente étroite.', 1),
  ('04010000-0000-4000-8000-000000000342'::uuid, '04000000-0000-4000-8000-000000000034'::uuid,
   'La diffraction est d''autant plus marquée que l''ouverture est…', 'mcq',
   '["petite (proche de la longueur d''onde)", "très grande", "colorée", "chaude"]', 0,
   'Plus la fente est fine, plus la diffraction est visible.', 2),
  ('04010000-0000-4000-8000-000000000343'::uuid, '04000000-0000-4000-8000-000000000034'::uuid,
   'La diffraction met en évidence le caractère ondulatoire de la lumière.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est une preuve du modèle ondulatoire.', 3),

  -- 35 — Énergie et thermodynamique
  ('04010000-0000-4000-8000-000000000351'::uuid, '04000000-0000-4000-8000-000000000035'::uuid,
   'Comment appelle-t-on un transfert d''énergie dû à une différence de température ?', 'mcq',
   '["un transfert thermique (chaleur)", "un courant électrique", "une diffraction", "une catalyse"]', 0,
   'La chaleur passe du corps chaud vers le corps froid.', 1),
  ('04010000-0000-4000-8000-000000000352'::uuid, '04000000-0000-4000-8000-000000000035'::uuid,
   'Que dit le premier principe de la thermodynamique sur l''énergie ?', 'mcq',
   '["elle se conserve : elle se transforme sans se perdre", "elle se crée à partir de rien", "elle disparaît totalement", "elle n''existe pas"]', 0,
   'L''énergie totale d''un système isolé se conserve.', 2),
  ('04010000-0000-4000-8000-000000000353'::uuid, '04000000-0000-4000-8000-000000000035'::uuid,
   'Spontanément, la chaleur se transfère du corps chaud vers le corps froid.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le sens naturel des transferts thermiques.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '04000000-%' GROUP BY 1,2 ORDER BY 1,2;
