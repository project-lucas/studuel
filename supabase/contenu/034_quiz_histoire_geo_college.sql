-- =============================================================================
-- Studuel — Migration 034 : quiz de leçon, Histoire-Géo collège 6e·5e·4e·3e
--   (18 quiz, 54 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'histoire-geo' → (niveau, titre chapitre) → « L'essentiel
--   du cours ». Chapitres déjà couverts et donc non listés : « La Révolution
--   française et l'Empire » (4e) et « La Première Guerre mondiale » (3e).
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Histoire-Géo', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 6e
  ('03400000-0000-4000-8000-000000000061'::uuid, '6e', 'La longue histoire de l''humanité',    'La longue histoire de l''humanité'),
  ('03400000-0000-4000-8000-000000000062'::uuid, '6e', 'Premiers États, premières écritures',   'Premiers États, premières écritures'),
  ('03400000-0000-4000-8000-000000000063'::uuid, '6e', 'Rome : du mythe à l''histoire',         'Rome : du mythe à l''histoire'),
  ('03400000-0000-4000-8000-000000000064'::uuid, '6e', 'Habiter une métropole',                 'Habiter une métropole'),
  ('03400000-0000-4000-8000-000000000065'::uuid, '6e', 'Habiter les littoraux',                 'Habiter les littoraux'),
  -- 5e
  ('03400000-0000-4000-8000-000000000051'::uuid, '5e', 'Byzance et l''Europe carolingienne',        'Byzance et l''Europe carolingienne'),
  ('03400000-0000-4000-8000-000000000052'::uuid, '5e', 'Société, Église et pouvoir féodal',         'Société, Église et pouvoir féodal'),
  ('03400000-0000-4000-8000-000000000053'::uuid, '5e', 'L''islam médiéval : pouvoirs et cultures',  'L''islam médiéval : pouvoirs et cultures'),
  ('03400000-0000-4000-8000-000000000054'::uuid, '5e', 'La croissance démographique et ses effets', 'La croissance démographique et ses effets'),
  ('03400000-0000-4000-8000-000000000055'::uuid, '5e', 'L''accès aux ressources : énergie et eau',  'L''accès aux ressources : énergie et eau'),
  -- 4e (Révolution française et Empire déjà couvert)
  ('03400000-0000-4000-8000-000000000041'::uuid, '4e', 'L''Europe des Lumières',                 'L''Europe des Lumières'),
  ('03400000-0000-4000-8000-000000000042'::uuid, '4e', 'L''Europe de la révolution industrielle', 'L''Europe de la révolution industrielle'),
  ('03400000-0000-4000-8000-000000000043'::uuid, '4e', 'L''urbanisation du monde',               'L''urbanisation du monde'),
  ('03400000-0000-4000-8000-000000000044'::uuid, '4e', 'Les mobilités humaines',                 'Les mobilités humaines'),
  -- 3e (Première Guerre mondiale déjà couverte)
  ('03400000-0000-4000-8000-000000000031'::uuid, '3e', 'L''Europe entre les deux guerres',   'L''Europe entre les deux guerres'),
  ('03400000-0000-4000-8000-000000000032'::uuid, '3e', 'La Seconde Guerre mondiale',         'La Seconde Guerre mondiale'),
  ('03400000-0000-4000-8000-000000000033'::uuid, '3e', 'La France de 1944 à nos jours',      'La France de 1944 à nos jours'),
  ('03400000-0000-4000-8000-000000000034'::uuid, '3e', 'Les aires urbaines en France',       'Les aires urbaines en France')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 6e =====
  -- 61 — La longue histoire de l'humanité
  ('03410000-0000-4000-8000-000000000611'::uuid, '03400000-0000-4000-8000-000000000061'::uuid,
   'Pendant quelle grande période les premiers humains étaient-ils chasseurs-cueilleurs ?', 'mcq',
   '["la Préhistoire", "l''Antiquité", "l''époque industrielle", "la Renaissance"]', 0,
   'La Préhistoire précède l''invention de l''écriture.', 1),
  ('03410000-0000-4000-8000-000000000612'::uuid, '03400000-0000-4000-8000-000000000061'::uuid,
   'Quelle transformation majeure marque le Néolithique ?', 'mcq',
   '["l''agriculture et l''élevage", "l''invention d''Internet", "la machine à vapeur", "la conquête spatiale"]', 0,
   'Au Néolithique, l''homme se sédentarise, cultive la terre et élève des animaux.', 2),
  ('03410000-0000-4000-8000-000000000613'::uuid, '03400000-0000-4000-8000-000000000061'::uuid,
   'La maîtrise du feu a été une étape importante pour les premiers humains.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le feu apporte chaleur, cuisson des aliments et protection.', 3),

  -- 62 — Premiers États, premières écritures
  ('03410000-0000-4000-8000-000000000621'::uuid, '03400000-0000-4000-8000-000000000062'::uuid,
   'Dans quelle région naissent les premières cités-États et écritures ?', 'mcq',
   '["la Mésopotamie", "l''Amérique du Nord", "l''Australie", "la Scandinavie"]', 0,
   'Entre le Tigre et l''Euphrate, vers 3300 av. J.-C.', 1),
  ('03410000-0000-4000-8000-000000000622'::uuid, '03400000-0000-4000-8000-000000000062'::uuid,
   'Comment appelle-t-on l''écriture en forme de coins tracée sur des tablettes d''argile ?', 'mcq',
   '["l''écriture cunéiforme", "l''alphabet latin", "le code morse", "les idéogrammes chinois"]', 0,
   'Le cunéiforme était tracé au calame dans l''argile humide.', 2),
  ('03410000-0000-4000-8000-000000000623'::uuid, '03400000-0000-4000-8000-000000000062'::uuid,
   'L''invention de l''écriture marque le passage de la Préhistoire à l''Histoire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''Histoire commence avec les premières traces écrites.', 3),

  -- 63 — Rome : du mythe à l'histoire
  ('03410000-0000-4000-8000-000000000631'::uuid, '03400000-0000-4000-8000-000000000063'::uuid,
   'Selon la légende, qui a fondé Rome ?', 'mcq',
   '["Romulus", "Jules César", "Vercingétorix", "Charlemagne"]', 0,
   'Romulus et Remus, nourris par une louve selon le mythe.', 1),
  ('03410000-0000-4000-8000-000000000632'::uuid, '03400000-0000-4000-8000-000000000063'::uuid,
   'Après la royauté, quel régime Rome adopte-t-elle d''abord ?', 'mcq',
   '["la République", "une colonie grecque", "la démocratie athénienne", "une monarchie absolue"]', 0,
   'La République romaine précède l''Empire.', 2),
  ('03410000-0000-4000-8000-000000000633'::uuid, '03400000-0000-4000-8000-000000000063'::uuid,
   'Auguste est considéré comme le premier empereur romain.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il fonde l''Empire à la fin du Ier siècle av. J.-C.', 3),

  -- 64 — Habiter une métropole
  ('03410000-0000-4000-8000-000000000641'::uuid, '03400000-0000-4000-8000-000000000064'::uuid,
   'Qu''est-ce qu''une métropole ?', 'mcq',
   '["une grande ville qui concentre habitants et activités", "un petit village", "un désert", "une île inhabitée"]', 0,
   'La métropole concentre population, emplois et fonctions de commandement.', 1),
  ('03410000-0000-4000-8000-000000000642'::uuid, '03400000-0000-4000-8000-000000000064'::uuid,
   'Quel problème lié aux transports est fréquent dans les grandes métropoles ?', 'mcq',
   '["les embouteillages", "l''absence totale de routes", "le manque d''habitants", "l''excès de forêts"]', 0,
   'La forte densité provoque congestion et pollution.', 2),
  ('03410000-0000-4000-8000-000000000643'::uuid, '03400000-0000-4000-8000-000000000064'::uuid,
   'Aujourd''hui, plus de la moitié de l''humanité vit dans des villes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La population mondiale est majoritairement urbaine.', 3),

  -- 65 — Habiter les littoraux
  ('03410000-0000-4000-8000-000000000651'::uuid, '03400000-0000-4000-8000-000000000065'::uuid,
   'Qu''est-ce qu''un littoral ?', 'mcq',
   '["une zone de contact entre la terre et la mer", "une chaîne de montagnes", "un grand désert", "une forêt tropicale"]', 0,
   'Le littoral est la bande côtière où se rencontrent terre et mer.', 1),
  ('03410000-0000-4000-8000-000000000652'::uuid, '03400000-0000-4000-8000-000000000065'::uuid,
   'Quelle activité est typique de nombreux littoraux ?', 'mcq',
   '["le tourisme balnéaire", "l''exploitation minière en haute montagne", "la culture du blé au pôle Nord", "l''élevage de rennes"]', 0,
   'Plages et ports attirent tourisme, pêche et commerce.', 2),
  ('03410000-0000-4000-8000-000000000653'::uuid, '03400000-0000-4000-8000-000000000065'::uuid,
   'Les littoraux sont des espaces attractifs, souvent densément peuplés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'De nombreuses grandes villes du monde sont côtières.', 3),

  -- ===== 5e =====
  -- 51 — Byzance et l'Europe carolingienne
  ('03410000-0000-4000-8000-000000000511'::uuid, '03400000-0000-4000-8000-000000000051'::uuid,
   'Quelle était la capitale de l''Empire byzantin ?', 'mcq',
   '["Constantinople", "Rome", "Paris", "Aix-la-Chapelle"]', 0,
   'Constantinople, aujourd''hui Istanbul.', 1),
  ('03410000-0000-4000-8000-000000000512'::uuid, '03400000-0000-4000-8000-000000000051'::uuid,
   'Quel roi est couronné empereur d''Occident en l''an 800 ?', 'mcq',
   '["Charlemagne", "Napoléon", "Louis XIV", "Clovis"]', 0,
   'Charlemagne, à la tête d''un vaste empire carolingien.', 2),
  ('03410000-0000-4000-8000-000000000513'::uuid, '03400000-0000-4000-8000-000000000051'::uuid,
   'L''Empire byzantin est l''héritier de l''Empire romain d''Orient.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il perdure après la chute de Rome (476).', 3),

  -- 52 — Société, Église et pouvoir féodal
  ('03410000-0000-4000-8000-000000000521'::uuid, '03400000-0000-4000-8000-000000000052'::uuid,
   'Dans la féodalité, le seigneur donne une terre (un fief) au vassal en échange de…', 'mcq',
   '["fidélité et aide militaire", "argent uniquement", "esclaves", "rien du tout"]', 0,
   'C''est le lien vassalique, scellé par l''hommage.', 1),
  ('03410000-0000-4000-8000-000000000522'::uuid, '03400000-0000-4000-8000-000000000052'::uuid,
   'Quelle institution est très puissante dans toute la société médiévale ?', 'mcq',
   '["l''Église catholique", "l''ONU", "la Bourse", "l''Assemblée nationale"]', 0,
   'L''Église encadre la vie religieuse et sociale au Moyen Âge.', 2),
  ('03410000-0000-4000-8000-000000000523'::uuid, '03400000-0000-4000-8000-000000000052'::uuid,
   'Les paysans devaient souvent des redevances et des corvées à leur seigneur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Serfs et paysans dépendants travaillaient pour le seigneur.', 3),

  -- 53 — L'islam médiéval
  ('03410000-0000-4000-8000-000000000531'::uuid, '03400000-0000-4000-8000-000000000053'::uuid,
   'Quelle ville sainte est au cœur des débuts de l''islam ?', 'mcq',
   '["La Mecque", "Athènes", "Rome", "Kyoto"]', 0,
   'La Mecque, en Arabie.', 1),
  ('03410000-0000-4000-8000-000000000532'::uuid, '03400000-0000-4000-8000-000000000053'::uuid,
   'Comment appelle-t-on le chef politique et religieux du monde musulman médiéval ?', 'mcq',
   '["le calife", "le pharaon", "le pape", "l''empereur"]', 0,
   'Le calife succède au Prophète à la tête de la communauté.', 2),
  ('03410000-0000-4000-8000-000000000533'::uuid, '03400000-0000-4000-8000-000000000053'::uuid,
   'Bagdad et Cordoue ont été de grands centres culturels et scientifiques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sciences, médecine et traductions y ont prospéré.', 3),

  -- 54 — La croissance démographique
  ('03410000-0000-4000-8000-000000000541'::uuid, '03400000-0000-4000-8000-000000000054'::uuid,
   'Que signifie « croissance démographique » ?', 'mcq',
   '["l''augmentation de la population", "la baisse des naissances", "la disparition des villes", "le refroidissement du climat"]', 0,
   'C''est l''augmentation du nombre d''habitants d''un territoire.', 1),
  ('03410000-0000-4000-8000-000000000542'::uuid, '03400000-0000-4000-8000-000000000054'::uuid,
   'Une forte croissance de la population augmente surtout les besoins en…', 'mcq',
   '["nourriture, eau et logement", "châteaux forts", "armures", "dinosaures"]', 0,
   'Nourrir et loger plus de gens met les ressources sous pression.', 2),
  ('03410000-0000-4000-8000-000000000543'::uuid, '03400000-0000-4000-8000-000000000054'::uuid,
   'La population mondiale a fortement augmenté depuis deux siècles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle est passée d''environ 1 à plus de 8 milliards d''habitants.', 3),

  -- 55 — L'accès aux ressources
  ('03410000-0000-4000-8000-000000000551'::uuid, '03400000-0000-4000-8000-000000000055'::uuid,
   'Laquelle de ces ressources est renouvelable ?', 'mcq',
   '["l''énergie solaire", "le pétrole", "le charbon", "le gaz naturel"]', 0,
   'Le soleil se renouvelle ; les énergies fossiles s''épuisent.', 1),
  ('03410000-0000-4000-8000-000000000552'::uuid, '03400000-0000-4000-8000-000000000055'::uuid,
   'L''eau douce disponible pour les humains est…', 'mcq',
   '["une ressource limitée et inégalement répartie", "illimitée partout", "surtout l''eau de mer buvable", "inutile à l''agriculture"]', 0,
   'L''eau douce est rare et mal répartie sur la planète.', 2),
  ('03410000-0000-4000-8000-000000000553'::uuid, '03400000-0000-4000-8000-000000000055'::uuid,
   'Le charbon, le pétrole et le gaz sont des énergies fossiles non renouvelables.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elles se sont formées sur des millions d''années.', 3),

  -- ===== 4e =====
  -- 41 — L'Europe des Lumières
  ('03410000-0000-4000-8000-000000000411'::uuid, '03400000-0000-4000-8000-000000000041'::uuid,
   'Au XVIIIᵉ siècle, que défendent surtout les philosophes des Lumières ?', 'mcq',
   '["la raison et la liberté", "le pouvoir absolu du roi", "l''ignorance", "le retour au Moyen Âge"]', 0,
   'Ils critiquent l''arbitraire et prônent le savoir et la tolérance.', 1),
  ('03410000-0000-4000-8000-000000000412'::uuid, '03400000-0000-4000-8000-000000000041'::uuid,
   'Lequel de ces auteurs est un philosophe des Lumières ?', 'mcq',
   '["Voltaire", "Jules César", "Napoléon", "Louis XIV"]', 0,
   'Voltaire, Rousseau, Montesquieu et Diderot en sont de grandes figures.', 2),
  ('03410000-0000-4000-8000-000000000413'::uuid, '03400000-0000-4000-8000-000000000041'::uuid,
   'L''Encyclopédie de Diderot et d''Alembert visait à diffuser les savoirs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un grand projet de partage des connaissances de son temps.', 3),

  -- 42 — L'Europe de la révolution industrielle
  ('03410000-0000-4000-8000-000000000421'::uuid, '03400000-0000-4000-8000-000000000042'::uuid,
   'Quelle invention symbolise la révolution industrielle du XIXᵉ siècle ?', 'mcq',
   '["la machine à vapeur", "le smartphone", "l''avion à réaction", "l''imprimerie de Gutenberg"]', 0,
   'La vapeur actionne usines, trains et bateaux.', 1),
  ('03410000-0000-4000-8000-000000000422'::uuid, '03400000-0000-4000-8000-000000000042'::uuid,
   'Quelle nouvelle classe de travailleurs naît avec l''industrialisation ?', 'mcq',
   '["les ouvriers", "les chevaliers", "les pharaons", "les seigneurs"]', 0,
   'Les ouvriers travaillent dans les usines nées de l''industrialisation.', 2),
  ('03410000-0000-4000-8000-000000000423'::uuid, '03400000-0000-4000-8000-000000000042'::uuid,
   'La révolution industrielle a favorisé la croissance des villes (exode rural).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les campagnes se vident vers les villes industrielles.', 3),

  -- 43 — L'urbanisation du monde
  ('03410000-0000-4000-8000-000000000431'::uuid, '03400000-0000-4000-8000-000000000043'::uuid,
   'Que désigne l''urbanisation ?', 'mcq',
   '["la croissance des villes et de la population urbaine", "le retour à la campagne", "la fonte des glaces", "la construction de chemins ruraux"]', 0,
   'De plus en plus d''humains vivent en ville.', 1),
  ('03410000-0000-4000-8000-000000000432'::uuid, '03400000-0000-4000-8000-000000000043'::uuid,
   'Comment appelle-t-on une agglomération de plus de 10 millions d''habitants ?', 'mcq',
   '["une mégapole", "un hameau", "une oasis", "un archipel"]', 0,
   'Les mégapoles sont d''immenses ensembles urbains.', 2),
  ('03410000-0000-4000-8000-000000000433'::uuid, '03400000-0000-4000-8000-000000000043'::uuid,
   'Aujourd''hui, plus de la moitié de l''humanité vit en ville.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''urbanisation dépasse 50 % au niveau mondial.', 3),

  -- 44 — Les mobilités humaines
  ('03410000-0000-4000-8000-000000000441'::uuid, '03400000-0000-4000-8000-000000000044'::uuid,
   'Comment appelle-t-on une personne qui quitte son pays pour s''installer ailleurs ?', 'mcq',
   '["un migrant", "un autochtone", "un sédentaire", "un astronaute"]', 0,
   'La migration est un déplacement durable de population.', 1),
  ('03410000-0000-4000-8000-000000000442'::uuid, '03400000-0000-4000-8000-000000000044'::uuid,
   'Le tourisme est une forme de mobilité liée surtout…', 'mcq',
   '["aux loisirs et aux voyages", "au travail à l''usine", "à la guerre", "à l''agriculture"]', 0,
   'Le tourisme déplace chaque année des centaines de millions de personnes.', 2),
  ('03410000-0000-4000-8000-000000000443'::uuid, '03400000-0000-4000-8000-000000000044'::uuid,
   'Les migrations peuvent être motivées par le travail, les guerres ou le climat.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les causes sont économiques, politiques et environnementales.', 3),

  -- ===== 3e =====
  -- 31 — L'Europe entre les deux guerres
  ('03410000-0000-4000-8000-000000000311'::uuid, '03400000-0000-4000-8000-000000000031'::uuid,
   'Dans les années 1930, quels régimes se développent en Allemagne et en Italie ?', 'mcq',
   '["des régimes totalitaires", "des démocraties parfaites", "des royaumes médiévaux", "des cités grecques"]', 0,
   'Nazisme et fascisme : des régimes autoritaires et violents.', 1),
  ('03410000-0000-4000-8000-000000000312'::uuid, '03400000-0000-4000-8000-000000000031'::uuid,
   'Qui dirige l''Allemagne nazie à partir de 1933 ?', 'mcq',
   '["Adolf Hitler", "Charles de Gaulle", "Winston Churchill", "Napoléon"]', 0,
   'Hitler, chef du parti nazi, arrive au pouvoir en 1933.', 2),
  ('03410000-0000-4000-8000-000000000313'::uuid, '03400000-0000-4000-8000-000000000031'::uuid,
   'La crise économique de 1929 a fragilisé les démocraties européennes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Chômage et misère ont favorisé la montée des extrêmes.', 3),

  -- 32 — La Seconde Guerre mondiale
  ('03410000-0000-4000-8000-000000000321'::uuid, '03400000-0000-4000-8000-000000000032'::uuid,
   'En quelle année commence la Seconde Guerre mondiale en Europe ?', 'mcq',
   '["1939", "1914", "1945", "1918"]', 0,
   'Avec l''invasion de la Pologne, le 1ᵉʳ septembre 1939.', 1),
  ('03410000-0000-4000-8000-000000000322'::uuid, '03400000-0000-4000-8000-000000000032'::uuid,
   'Comment appelle-t-on le génocide des Juifs d''Europe par les nazis ?', 'mcq',
   '["la Shoah", "la Renaissance", "la Réforme", "la Terreur"]', 0,
   'La Shoah désigne l''extermination systématique des Juifs.', 2),
  ('03410000-0000-4000-8000-000000000323'::uuid, '03400000-0000-4000-8000-000000000032'::uuid,
   'La Seconde Guerre mondiale s''est terminée en 1945.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Capitulation de l''Allemagne en mai, puis du Japon en septembre 1945.', 3),

  -- 33 — La France de 1944 à nos jours
  ('03410000-0000-4000-8000-000000000331'::uuid, '03400000-0000-4000-8000-000000000033'::uuid,
   'Quel régime politique est instauré en France en 1958 et toujours en vigueur ?', 'mcq',
   '["la Vᵉ République", "la monarchie", "l''Empire", "la Iʳᵉ République"]', 0,
   'La Vᵉ République, fondée à l''initiative du général de Gaulle.', 1),
  ('03410000-0000-4000-8000-000000000332'::uuid, '03400000-0000-4000-8000-000000000033'::uuid,
   'En 1944, les femmes françaises obtiennent…', 'mcq',
   '["le droit de vote", "l''interdiction de travailler", "le baccalauréat automatique", "le permis obligatoire"]', 0,
   'Le droit de vote est accordé aux femmes en France en 1944.', 2),
  ('03410000-0000-4000-8000-000000000333'::uuid, '03400000-0000-4000-8000-000000000033'::uuid,
   'Après 1945, la France a connu une forte croissance appelée les « Trente Glorieuses ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Environ 1945-1975 : prospérité, plein emploi et modernisation.', 3),

  -- 34 — Les aires urbaines en France
  ('03410000-0000-4000-8000-000000000341'::uuid, '03400000-0000-4000-8000-000000000034'::uuid,
   'Qu''est-ce qu''une aire urbaine ?', 'mcq',
   '["une ville et les communes autour dont beaucoup d''habitants y travaillent", "un champ agricole isolé", "une forêt protégée", "une station de ski seulement"]', 0,
   'Elle réunit la ville-centre, la banlieue et la couronne périurbaine.', 1),
  ('03410000-0000-4000-8000-000000000342'::uuid, '03400000-0000-4000-8000-000000000034'::uuid,
   'Quelle est la plus grande aire urbaine de France ?', 'mcq',
   '["Paris", "Lille", "Bordeaux", "Nantes"]', 0,
   'L''aire urbaine parisienne est de très loin la plus peuplée.', 2),
  ('03410000-0000-4000-8000-000000000343'::uuid, '03400000-0000-4000-8000-000000000034'::uuid,
   'La majorité de la population française vit dans des aires urbaines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La France est un pays très majoritairement urbain.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03400000-%' GROUP BY 1,2 ORDER BY 1,2;
