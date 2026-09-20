-- =============================================================================
-- Studuel — Migration 042 : quiz de leçon, Histoire-Géo lycée 2de·1re·Tle
--   (15 quiz, 45 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'histoire-geo' → (niveau, titre chapitre) →
--   « L'essentiel du cours ». Niveaux lycée : 2de, 1re, Tle.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Histoire-Géo', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('04200000-0000-4000-8000-000000000021'::uuid, '2de', 'La Méditerranée antique',        'La Méditerranée antique'),
  ('04200000-0000-4000-8000-000000000022'::uuid, '2de', 'La Méditerranée médiévale',      'La Méditerranée médiévale'),
  ('04200000-0000-4000-8000-000000000023'::uuid, '2de', 'L''ouverture atlantique (XVe-XVIe)','L''ouverture atlantique (XVe-XVIe)'),
  ('04200000-0000-4000-8000-000000000024'::uuid, '2de', 'Sociétés et environnements',     'Sociétés et environnements'),
  ('04200000-0000-4000-8000-000000000025'::uuid, '2de', 'Des mobilités généralisées',     'Des mobilités généralisées'),
  -- 1re
  ('04200000-0000-4000-8000-000000000011'::uuid, '1re', 'L''Europe face aux révolutions',        'L''Europe face aux révolutions'),
  ('04200000-0000-4000-8000-000000000012'::uuid, '1re', 'La Troisième République',               'La Troisième République'),
  ('04200000-0000-4000-8000-000000000013'::uuid, '1re', 'La Grande Guerre et la fin des empires', 'La Grande Guerre et la fin des empires'),
  ('04200000-0000-4000-8000-000000000014'::uuid, '1re', 'La métropolisation',                    'La métropolisation'),
  ('04200000-0000-4000-8000-000000000015'::uuid, '1re', 'Les espaces productifs français',       'Les espaces productifs français'),
  -- Tle
  ('04200000-0000-4000-8000-000000000031'::uuid, 'Tle', 'Démocraties fragiles et totalitarismes',       'Démocraties fragiles et totalitarismes'),
  ('04200000-0000-4000-8000-000000000032'::uuid, 'Tle', 'La Seconde Guerre mondiale',                    'La Seconde Guerre mondiale'),
  ('04200000-0000-4000-8000-000000000033'::uuid, 'Tle', 'La Guerre froide',                              'La Guerre froide'),
  ('04200000-0000-4000-8000-000000000034'::uuid, 'Tle', 'Mers et océans dans la mondialisation',         'Mers et océans dans la mondialisation'),
  ('04200000-0000-4000-8000-000000000035'::uuid, 'Tle', 'L''Union européenne dans la mondialisation',    'L''Union européenne dans la mondialisation')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — La Méditerranée antique
  ('04210000-0000-4000-8000-000000000211'::uuid, '04200000-0000-4000-8000-000000000021'::uuid,
   'Quelle cité grecque est le berceau de la démocratie antique ?', 'mcq',
   '["Athènes", "Rome", "Carthage", "Sparte"]', 0,
   'La démocratie naît à Athènes au Vᵉ siècle av. J.-C.', 1),
  ('04210000-0000-4000-8000-000000000212'::uuid, '04200000-0000-4000-8000-000000000021'::uuid,
   'Quel empire domine la Méditerranée au début de notre ère ?', 'mcq',
   '["l''Empire romain", "l''Empire ottoman", "l''Empire britannique", "l''Empire aztèque"]', 0,
   'Rome contrôle alors tout le pourtour méditerranéen.', 2),
  ('04210000-0000-4000-8000-000000000213'::uuid, '04200000-0000-4000-8000-000000000021'::uuid,
   'La Méditerranée antique était un espace d''échanges commerciaux et culturels.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Grecs, Romains et Phéniciens y commerçaient et échangeaient des idées.', 3),

  -- 22 — La Méditerranée médiévale
  ('04210000-0000-4000-8000-000000000221'::uuid, '04200000-0000-4000-8000-000000000022'::uuid,
   'Quelles grandes civilisations se côtoient en Méditerranée au Moyen Âge ?', 'mcq',
   '["chrétienne, musulmane et byzantine", "aztèque et inca", "chinoise et japonaise", "viking et inuit"]', 0,
   'Trois grands ensembles en contact autour de la Méditerranée.', 1),
  ('04210000-0000-4000-8000-000000000222'::uuid, '04200000-0000-4000-8000-000000000022'::uuid,
   'Que sont les croisades ?', 'mcq',
   '["des expéditions militaires et religieuses vers l''Orient", "des voyages commerciaux vers l''Amérique", "des missions vers la Lune", "des compétitions sportives"]', 0,
   'Des expéditions chrétiennes vers la Terre sainte.', 2),
  ('04210000-0000-4000-8000-000000000223'::uuid, '04200000-0000-4000-8000-000000000022'::uuid,
   'La Méditerranée médiévale est à la fois un espace de conflits et d''échanges.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Guerres, mais aussi commerce et transferts culturels.', 3),

  -- 23 — L'ouverture atlantique
  ('04210000-0000-4000-8000-000000000231'::uuid, '04200000-0000-4000-8000-000000000023'::uuid,
   'En 1492, qui atteint l''Amérique en cherchant une route vers les Indes ?', 'mcq',
   '["Christophe Colomb", "Napoléon", "Jules César", "Vercingétorix"]', 0,
   'Christophe Colomb, financé par l''Espagne.', 1),
  ('04210000-0000-4000-8000-000000000232'::uuid, '04200000-0000-4000-8000-000000000023'::uuid,
   'Comment appelle-t-on les grands voyages d''exploration des XVᵉ-XVIᵉ siècles ?', 'mcq',
   '["les Grandes Découvertes", "les Trente Glorieuses", "les guerres de religion", "les révolutions industrielles"]', 0,
   'Les Grandes Découvertes ouvrent le monde aux Européens.', 2),
  ('04210000-0000-4000-8000-000000000233'::uuid, '04200000-0000-4000-8000-000000000023'::uuid,
   'L''ouverture atlantique déplace le centre du commerce vers l''océan Atlantique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'De nouveaux échanges transatlantiques se développent.', 3),

  -- 24 — Sociétés et environnements
  ('04210000-0000-4000-8000-000000000241'::uuid, '04200000-0000-4000-8000-000000000024'::uuid,
   'À quoi s''intéresse le thème « sociétés et environnements » ?', 'mcq',
   '["à la relation entre les sociétés humaines et leur milieu", "à la seule géologie", "aux mathématiques", "à l''astronomie"]', 0,
   'Il étudie les interactions entre les hommes et leur environnement.', 1),
  ('04210000-0000-4000-8000-000000000242'::uuid, '04200000-0000-4000-8000-000000000024'::uuid,
   'Le changement climatique est un exemple de…', 'mcq',
   '["risque environnemental global", "fête traditionnelle", "règle de grammaire", "figure de style"]', 0,
   'C''est un enjeu environnemental majeur pour les sociétés.', 2),
  ('04210000-0000-4000-8000-000000000243'::uuid, '04200000-0000-4000-8000-000000000024'::uuid,
   'Les sociétés modifient leur environnement, qui en retour influence leurs activités.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La relation entre sociétés et milieux fonctionne dans les deux sens.', 3),

  -- 25 — Des mobilités généralisées
  ('04210000-0000-4000-8000-000000000251'::uuid, '04200000-0000-4000-8000-000000000025'::uuid,
   'Le tourisme international est une forme de…', 'mcq',
   '["mobilité des populations", "production agricole", "réaction chimique", "roche"]', 0,
   'C''est un déplacement de population à des fins de loisir.', 1),
  ('04210000-0000-4000-8000-000000000252'::uuid, '04200000-0000-4000-8000-000000000025'::uuid,
   'Que désignent les migrations ?', 'mcq',
   '["des déplacements durables de population", "des marées", "des éruptions", "des saisons"]', 0,
   'La migration implique une installation dans un autre lieu.', 2),
  ('04210000-0000-4000-8000-000000000253'::uuid, '04200000-0000-4000-8000-000000000025'::uuid,
   'Les mobilités humaines ont fortement augmenté avec la mondialisation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Des transports plus rapides et moins chers y ont contribué.', 3),

  -- ===== 1re =====
  -- 11 — L'Europe face aux révolutions
  ('04210000-0000-4000-8000-000000000111'::uuid, '04200000-0000-4000-8000-000000000011'::uuid,
   'En quelle année débute la Révolution française ?', 'mcq',
   '["1789", "1815", "1848", "1914"]', 0,
   'La prise de la Bastille a lieu le 14 juillet 1789.', 1),
  ('04210000-0000-4000-8000-000000000112'::uuid, '04200000-0000-4000-8000-000000000011'::uuid,
   'Quel texte de 1789 proclame des droits fondamentaux ?', 'mcq',
   '["la Déclaration des droits de l''homme et du citoyen", "le traité de Versailles", "l''édit de Nantes", "la Grande Charte"]', 0,
   'La DDHC est adoptée en août 1789.', 2),
  ('04210000-0000-4000-8000-000000000113'::uuid, '04200000-0000-4000-8000-000000000011'::uuid,
   'La Révolution française met fin à la monarchie absolue en France.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle marque la fin de l''Ancien Régime.', 3),

  -- 12 — La Troisième République
  ('04210000-0000-4000-8000-000000000121'::uuid, '04200000-0000-4000-8000-000000000012'::uuid,
   'En quelle année la Troisième République est-elle proclamée ?', 'mcq',
   '["1870", "1789", "1945", "2000"]', 0,
   'En 1870, après la chute du Second Empire.', 1),
  ('04210000-0000-4000-8000-000000000122'::uuid, '04200000-0000-4000-8000-000000000012'::uuid,
   'Quelles lois rendent l''école primaire gratuite, laïque et obligatoire ?', 'mcq',
   '["les lois de Jules Ferry", "les lois de Napoléon", "les lois de Louis XIV", "les lois de Vichy"]', 0,
   'Les lois Ferry (1881-1882).', 2),
  ('04210000-0000-4000-8000-000000000123'::uuid, '04200000-0000-4000-8000-000000000012'::uuid,
   'La Troisième République a durablement enraciné la démocratie en France.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le régime le plus durable depuis 1789 à son époque.', 3),

  -- 13 — La Grande Guerre
  ('04210000-0000-4000-8000-000000000131'::uuid, '04200000-0000-4000-8000-000000000013'::uuid,
   'En quelles années se déroule la Première Guerre mondiale ?', 'mcq',
   '["1914-1918", "1939-1945", "1870-1871", "1789-1799"]', 0,
   'La Grande Guerre dure de 1914 à 1918.', 1),
  ('04210000-0000-4000-8000-000000000132'::uuid, '04200000-0000-4000-8000-000000000013'::uuid,
   'Comment appelle-t-on la guerre où les soldats s''enterrent dans des tranchées ?', 'mcq',
   '["une guerre de position", "une guerre éclair", "une guerre froide", "une guerre navale"]', 0,
   'La guerre de position (ou de tranchées) marque 1914-1918.', 2),
  ('04210000-0000-4000-8000-000000000133'::uuid, '04200000-0000-4000-8000-000000000013'::uuid,
   'La Première Guerre mondiale a provoqué l''effondrement de plusieurs empires.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les empires russe, austro-hongrois, ottoman et allemand disparaissent.', 3),

  -- 14 — La métropolisation
  ('04210000-0000-4000-8000-000000000141'::uuid, '04200000-0000-4000-8000-000000000014'::uuid,
   'Que désigne la métropolisation ?', 'mcq',
   '["la concentration des populations et activités dans les grandes villes", "le retour à la campagne", "la fonte des glaciers", "la baisse de la population mondiale"]', 0,
   'C''est le renforcement du poids des métropoles.', 1),
  ('04210000-0000-4000-8000-000000000142'::uuid, '04200000-0000-4000-8000-000000000014'::uuid,
   'Qu''est-ce qu''une métropole concentre souvent ?', 'mcq',
   '["les fonctions de commandement (économiques, politiques)", "uniquement des champs", "seulement des forêts", "aucune activité"]', 0,
   'Sièges sociaux, centres de décision et d''innovation.', 2),
  ('04210000-0000-4000-8000-000000000143'::uuid, '04200000-0000-4000-8000-000000000014'::uuid,
   'La métropolisation peut accroître les inégalités entre les territoires.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les métropoles se renforcent au détriment d''espaces en retrait.', 3),

  -- 15 — Les espaces productifs français
  ('04210000-0000-4000-8000-000000000151'::uuid, '04200000-0000-4000-8000-000000000015'::uuid,
   'À quoi est consacré un espace productif agricole ?', 'mcq',
   '["à la production agricole", "à l''extraction de pétrole", "à l''habitat de loisir", "à la seule industrie lourde"]', 0,
   'Cultures et élevage y sont les activités principales.', 1),
  ('04210000-0000-4000-8000-000000000152'::uuid, '04200000-0000-4000-8000-000000000015'::uuid,
   'Comment classe-t-on principalement les espaces productifs ?', 'mcq',
   '["agricoles, industriels et de services", "aquatiques seulement", "polaires seulement", "aucun type"]', 0,
   'Trois grands types selon l''activité dominante.', 2),
  ('04210000-0000-4000-8000-000000000153'::uuid, '04200000-0000-4000-8000-000000000015'::uuid,
   'Le tourisme fait partie des espaces productifs de services en France.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La France est la première destination touristique mondiale.', 3),

  -- ===== Tle =====
  -- 31 — Démocraties fragiles et totalitarismes
  ('04210000-0000-4000-8000-000000000311'::uuid, '04200000-0000-4000-8000-000000000031'::uuid,
   'Lequel est un régime totalitaire de l''entre-deux-guerres ?', 'mcq',
   '["l''Allemagne nazie", "la Troisième République française", "le Royaume-Uni", "la Suisse"]', 0,
   'Nazisme, fascisme et stalinisme sont des régimes totalitaires.', 1),
  ('04210000-0000-4000-8000-000000000312'::uuid, '04200000-0000-4000-8000-000000000031'::uuid,
   'Qu''est-ce qui caractérise un régime totalitaire ?', 'mcq',
   '["un parti unique et un contrôle total de la société", "des élections libres", "la liberté de la presse", "la séparation des pouvoirs"]', 0,
   'Parti unique, propagande, terreur et embrigadement.', 2),
  ('04210000-0000-4000-8000-000000000313'::uuid, '04200000-0000-4000-8000-000000000031'::uuid,
   'La crise de 1929 a fragilisé les démocraties et favorisé les régimes autoritaires.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le chômage et l''instabilité ont nourri les extrêmes.', 3),

  -- 32 — La Seconde Guerre mondiale
  ('04210000-0000-4000-8000-000000000321'::uuid, '04200000-0000-4000-8000-000000000032'::uuid,
   'En quelles années se déroule la Seconde Guerre mondiale ?', 'mcq',
   '["1939-1945", "1914-1918", "1870-1871", "1789-1799"]', 0,
   'Elle dure de 1939 à 1945.', 1),
  ('04210000-0000-4000-8000-000000000322'::uuid, '04200000-0000-4000-8000-000000000032'::uuid,
   'Comment appelle-t-on le génocide des Juifs d''Europe par les nazis ?', 'mcq',
   '["la Shoah", "la Terreur", "la Réforme", "la Renaissance"]', 0,
   'La Shoah désigne l''extermination systématique des Juifs.', 2),
  ('04210000-0000-4000-8000-000000000323'::uuid, '04200000-0000-4000-8000-000000000032'::uuid,
   'La Seconde Guerre mondiale est le conflit le plus meurtrier de l''histoire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle a fait des dizaines de millions de morts.', 3),

  -- 33 — La Guerre froide
  ('04210000-0000-4000-8000-000000000331'::uuid, '04200000-0000-4000-8000-000000000033'::uuid,
   'Quels deux blocs s''opposent pendant la Guerre froide ?', 'mcq',
   '["les États-Unis et l''URSS", "la France et l''Allemagne", "la Chine et le Japon", "Rome et Carthage"]', 0,
   'Le bloc de l''Ouest face au bloc de l''Est.', 1),
  ('04210000-0000-4000-8000-000000000332'::uuid, '04200000-0000-4000-8000-000000000033'::uuid,
   'Quel mur, construit en 1961, symbolise la division de l''Europe ?', 'mcq',
   '["le mur de Berlin", "la Grande Muraille", "le mur d''Hadrien", "le mur des Lamentations"]', 0,
   'Le mur de Berlin incarne le « rideau de fer ».', 2),
  ('04210000-0000-4000-8000-000000000333'::uuid, '04200000-0000-4000-8000-000000000033'::uuid,
   'La Guerre froide fut surtout un affrontement idéologique, sans guerre directe entre les deux Grands.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Tensions, dissuasion nucléaire et conflits périphériques.', 3),

  -- 34 — Mers et océans dans la mondialisation
  ('04210000-0000-4000-8000-000000000341'::uuid, '04200000-0000-4000-8000-000000000034'::uuid,
   'Par quel moyen transite la majeure partie du commerce mondial de marchandises ?', 'mcq',
   '["la mer (transport maritime)", "les airs uniquement", "la route seulement", "le train uniquement"]', 0,
   'Environ 80 à 90 % du commerce se fait par voie maritime.', 1),
  ('04210000-0000-4000-8000-000000000342'::uuid, '04200000-0000-4000-8000-000000000034'::uuid,
   'Le canal de Suez est un exemple de…', 'mcq',
   '["passage maritime stratégique", "désert", "sommet montagneux", "volcan"]', 0,
   'Un point de passage clé pour le commerce mondial.', 2),
  ('04210000-0000-4000-8000-000000000343'::uuid, '04200000-0000-4000-8000-000000000034'::uuid,
   'Les océans sont à la fois des espaces de ressources et des enjeux géopolitiques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Pêche, énergie, routes commerciales et rivalités entre États.', 3),

  -- 35 — L'Union européenne dans la mondialisation
  ('04210000-0000-4000-8000-000000000351'::uuid, '04200000-0000-4000-8000-000000000035'::uuid,
   'Quelle monnaie unique de nombreux pays de l''Union européenne utilisent-ils ?', 'mcq',
   '["l''euro", "le dollar", "la livre sterling", "le yen"]', 0,
   'L''euro a été mis en circulation en 2002.', 1),
  ('04210000-0000-4000-8000-000000000352'::uuid, '04200000-0000-4000-8000-000000000035'::uuid,
   'Qu''est-ce que l''Union européenne, avant tout ?', 'mcq',
   '["une organisation d''intégration économique et politique", "une entreprise privée", "un club sportif", "une religion"]', 0,
   'Une union de pays européens partageant des règles communes.', 2),
  ('04210000-0000-4000-8000-000000000353'::uuid, '04200000-0000-4000-8000-000000000035'::uuid,
   'L''Union européenne est l''une des grandes puissances commerciales mondiales.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Son vaste marché intérieur lui donne un grand poids économique.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '04200000-%' GROUP BY 1,2 ORDER BY 1,2;
