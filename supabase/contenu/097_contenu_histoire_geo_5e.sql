-- =============================================================================
-- Studuel — Migration 097 : CONTENU Histoire-Géo 5e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Histoire-Géo 5e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder initial)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons (Histoire-Géo 5e), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Byzance et l''Europe carolingienne', $md$# Byzance et l'Europe carolingienne

## Ce que tu vas comprendre
Après la chute de l'Empire romain d'Occident (476), le monde méditerranéen se réorganise autour de trois grands ensembles. Ce chapitre étudie deux d'entre eux : l'**Empire byzantin** (héritier de Rome à l'Est) et l'**Empire carolingien** (une tentative de restaurer un empire chrétien en Occident).

## 1. L'Empire byzantin, héritier de Rome
Quand Rome tombe à l'Ouest, l'**Empire romain d'Orient** survit : on l'appelle l'**Empire byzantin**, du nom de sa capitale **Constantinople** (l'ancienne Byzance, aujourd'hui Istanbul).
- On y parle le **grec**, et non le latin.
- L'empereur, comme **Justinien** (527-565), gouverne et protège l'Église : il détient à la fois le pouvoir politique et religieux.
- Justinien fait rédiger un grand recueil de lois (le **Code**) et bâtir l'église **Sainte-Sophie** à Constantinople.

## 2. Une religion chrétienne différente
Les Byzantins sont chrétiens mais leurs pratiques s'éloignent peu à peu de celles de Rome. En **1054**, c'est la rupture : le **schisme** sépare l'Église **orthodoxe** (à l'Est) de l'Église **catholique** (à l'Ouest).

## 3. Charlemagne et l'Empire carolingien
En Occident, le royaume des **Francs** s'agrandit sous **Charlemagne** (Charles le Grand). En **800**, il est **couronné empereur** à Rome par le **pape** : il veut faire revivre l'Empire romain d'Occident, mais **chrétien**.
- Sa capitale est **Aix-la-Chapelle**.
- Il organise son empire avec des **comtes** (qui gouvernent des territoires) surveillés par les **missi dominici** (les envoyés de l'empereur).

## 4. Une renaissance des savoirs
Charlemagne favorise l'école et la copie des livres dans les **monastères**. Cette relance de la culture écrite s'appelle la **renaissance carolingienne** : on invente une écriture plus lisible, la **minuscule caroline**.

## 5. Le partage de l'empire
À la mort de Charlemagne, l'empire est trop grand pour rester uni. En **843**, le **traité de Verdun** le partage entre ses trois petits-fils. C'est le début de nouveaux royaumes, dont naîtra plus tard la France.

## L'essentiel à retenir
- **Byzance** = Empire romain d'Orient, capitale **Constantinople**, langue **grecque**, apogée sous **Justinien**.
- En **1054**, le **schisme** sépare orthodoxes (Est) et catholiques (Ouest).
- **Charlemagne** est couronné **empereur en 800** par le pape ; capitale **Aix-la-Chapelle**.
- L'empire est partagé au **traité de Verdun (843)**.$md$),

    ('Société, Église et pouvoir féodal', $md$# Société, Église et pouvoir féodal

## Ce que tu vas comprendre
Entre le Xe et le XVe siècle, l'Occident s'organise selon un système où la terre et la protection font la loi : la **féodalité**. La société est très inégale et l'**Église** occupe une place centrale dans la vie de chacun.

## 1. La société féodale : les trois ordres
On imaginait la société comme trois grands groupes complémentaires :
- **ceux qui prient** : le clergé (prêtres, moines, évêques) ;
- **ceux qui combattent** : les seigneurs et les chevaliers ;
- **ceux qui travaillent** : les paysans, de très loin les plus nombreux.

## 2. Seigneurs et paysans
Le **seigneur** possède un domaine, la **seigneurie**, avec son **château fort**. Les **paysans** y vivent et travaillent la terre. En échange de sa protection, ils lui doivent :
- des **redevances** (une part de la récolte, de l'argent) ;
- des **corvées** (des journées de travail gratuit) ;
- des taxes pour utiliser le moulin ou le four du seigneur (les **banalités**).

La plupart des paysans sont des **serfs**, attachés à la terre, ou des **vilains** un peu plus libres.

## 3. Les liens entre seigneurs : la vassalité
Les seigneurs sont eux-mêmes liés entre eux. Un **vassal** jure fidélité à un **suzerain** plus puissant lors d'une cérémonie, l'**hommage**. En échange, il reçoit une terre, le **fief**. Le vassal doit alors aide militaire et conseil à son seigneur.

## 4. L'Église, au cœur de la vie
L'**Église** encadre toute la vie, de la naissance (baptême) à la mort. Elle prélève un impôt, la **dîme** (environ un dixième des récoltes). Elle bâtit d'immenses édifices : les **églises romanes** (murs épais, petites fenêtres) puis les **cathédrales gothiques** (voûtes hautes, vitraux, arcs-boutants). Les **moines**, dans leurs **monastères**, prient, copient des livres et défrichent des terres.

## 5. Un temps de croissance
Du XIe au XIIIe siècle, la population augmente : on défriche les forêts, on améliore les outils (**charrue**, moulins). De nouvelles **villes** se développent autour du commerce.

## L'essentiel à retenir
- Société des **trois ordres** : ceux qui prient, ceux qui combattent, ceux qui travaillent.
- Les **paysans** doivent au **seigneur** redevances, corvées et banalités.
- **Vassalité** : le **vassal** rend l'**hommage** au **suzerain** et reçoit un **fief**.
- L'**Église** encadre la vie, prélève la **dîme** et bâtit églises romanes puis cathédrales gothiques.$md$),

    ('L''islam médiéval : pouvoirs et cultures', $md$# L'islam médiéval : pouvoirs et cultures

## Ce que tu vas comprendre
Au VIIe siècle, une nouvelle religion et une nouvelle civilisation apparaissent au Proche-Orient : l'**islam**. En quelques décennies, un immense empire se forme, des brillantes cités s'épanouissent et les savoirs y circulent comme nulle part ailleurs.

## 1. La naissance de l'islam
L'islam naît en **Arabie** au **VIIe siècle**. Le prophète **Mahomet** prêche à **La Mecque** puis à **Médine**. L'année **622**, celle de son départ pour Médine (l'**Hégire**), marque le début du calendrier musulman. Après sa mort (632), les croyants se rassemblent autour d'un livre sacré, le **Coran**.

## 2. Un immense empire
Après Mahomet, les chefs des musulmans, les **califes**, dirigent les conquêtes. En moins d'un siècle, l'empire s'étend de l'**Espagne** (al-Andalus) jusqu'à l'**Inde**. Deux grandes dynasties se succèdent :
- les **Omeyyades**, avec **Damas** pour capitale ;
- les **Abbassides**, qui fondent **Bagdad** en 762.

## 3. Des villes brillantes
Les villes musulmanes sont de grands foyers de commerce et de culture :
- **Bagdad**, capitale des Abbassides, immense et très peuplée ;
- **Cordoue**, en Espagne, célèbre pour sa **Grande Mosquée** ;
- **Le Caire**, en Égypte.

On y trouve la **mosquée** (lieu de prière, avec son **minaret**), les **souks** (marchés) et les palais.

## 4. Un carrefour des savoirs
Les savants de l'empire traduisent en **arabe** les textes grecs, persans et indiens, puis les enrichissent. À la **Maison de la Sagesse** de Bagdad, on progresse en **mathématiques** (l'**algèbre**, les « chiffres arabes »), en **médecine**, en **astronomie** et en **géographie**. Ces savoirs passeront plus tard vers l'Europe chrétienne.

## 5. Des échanges avec les autres mondes
Grâce aux caravanes et aux navires, les marchands musulmans relient l'Afrique, l'Asie et l'Europe. Ils diffusent des produits (épices, soie, papier) mais aussi des idées et des techniques.

## L'essentiel à retenir
- L'islam naît en **Arabie au VIIe siècle** ; **Mahomet**, **La Mecque**, l'**Hégire (622)**, le **Coran**.
- Un immense empire dirigé par les **califes**, de l'**Espagne** à l'**Inde** (**Omeyyades** puis **Abbassides**).
- Grandes villes : **Bagdad**, **Cordoue**, **Le Caire** ; mosquée, minaret, souks.
- Un grand foyer de **savoirs** (algèbre, médecine, astronomie) diffusés vers l'Europe.$md$),

    ('La croissance démographique et ses effets', $md$# La croissance démographique et ses effets

## Ce que tu vas comprendre
La population mondiale n'a jamais augmenté aussi vite qu'aujourd'hui. Ce chapitre de géographie explique cette **croissance démographique**, ses différences selon les régions, et le défi de nourrir et faire vivre tous les habitants de façon **durable**.

## 1. Une population mondiale en forte hausse
La Terre compte aujourd'hui plus de **8 milliards** d'habitants, contre 1 milliard vers 1800. Cette explosion vient surtout de la **baisse de la mortalité** (meilleure santé, alimentation, hygiène) alors que la **natalité** reste longtemps élevée : la population grandit vite.

## 2. Des situations très différentes
La croissance n'est pas la même partout :
- dans les pays **en développement** (Afrique, une partie de l'Asie), la population **augmente encore beaucoup** car les familles ont souvent de nombreux enfants ;
- dans les pays **riches** (Europe, Japon), la croissance est **faible**, voire nulle, et la population **vieillit**.

## 3. Nourrir toute la population
Le premier défi est **alimentaire** : produire assez pour tous. L'agriculture s'est intensifiée (engrais, irrigation, machines), mais cela peut **abîmer l'environnement** (pollution, épuisement des sols). Certaines régions connaissent encore la **sous-alimentation**.

## 4. Le développement durable
Un **développement durable** cherche à répondre aux besoins d'aujourd'hui **sans empêcher** les générations futures de vivre bien. Il repose sur trois piliers :
- le pilier **économique** (produire des richesses) ;
- le pilier **social** (le bien-être de tous) ;
- le pilier **environnemental** (protéger la planète).

## 5. Des villes qui grandissent
La croissance de la population s'accompagne d'une forte **urbanisation** : de plus en plus d'habitants vivent en ville. Certaines deviennent des **mégapoles** (plus de 10 millions d'habitants), comme **Tokyo**, **Delhi** ou **Lagos**, ce qui pose des défis de logement, de transport et de pollution.

## L'essentiel à retenir
- La population mondiale dépasse **8 milliards** ; elle croît grâce à la **baisse de la mortalité**.
- Forte croissance dans les pays **en développement**, faible croissance et **vieillissement** dans les pays riches.
- Grand défi : **nourrir** tous les habitants sans détruire l'environnement.
- Le **développement durable** concilie **économie, social et environnement**.$md$),

    ('L''accès aux ressources : énergie et eau', $md$# L'accès aux ressources : énergie et eau

## Ce que tu vas comprendre
Une population plus nombreuse et plus urbaine a besoin de toujours plus d'**énergie** et d'**eau**. Mais ces ressources sont inégalement réparties et parfois menacées. Ce chapitre montre comment y accéder tout en respectant la planète.

## 1. Des besoins en énergie en forte hausse
L'énergie sert à se déplacer, produire, chauffer, s'éclairer. On distingue :
- les énergies **fossiles** (pétrole, charbon, gaz) : très utilisées mais **non renouvelables** et **polluantes** (elles rejettent du CO2 et accentuent le **réchauffement climatique**) ;
- les énergies **renouvelables** (soleil, vent, eau, biomasse) : **inépuisables** et plus propres, mais encore minoritaires.

## 2. Une répartition inégale
Les ressources énergétiques ne sont pas là où vivent les habitants. Le pétrole se concentre par exemple au **Proche-Orient**. Certains pays en produisent et en exportent, d'autres doivent tout **importer**. L'accès à l'électricité reste aussi très inégal : des millions de personnes, surtout en Afrique, n'en ont pas.

## 3. L'eau, une ressource vitale et fragile
L'eau douce est **indispensable** (boire, cultiver, produire) mais rare : elle ne représente qu'une petite partie de l'eau de la planète. Elle est très mal répartie :
- des régions en manquent (**stress hydrique**), comme le Sahel ou le Proche-Orient ;
- d'autres en ont en abondance.

L'agriculture consomme la plus grande partie de l'eau douce (**irrigation**).

## 4. Des tensions autour des ressources
Le manque d'eau ou d'énergie peut provoquer des **conflits** entre pays qui partagent un même fleuve ou une même réserve. La demande augmente avec la population, ce qui accentue la pression sur ces ressources.

## 5. Gérer durablement
Pour l'avenir, il faut **économiser** et mieux gérer :
- développer les énergies **renouvelables** et réduire le gaspillage ;
- éviter de polluer et de gaspiller l'eau, réutiliser l'eau usée, protéger les nappes.

C'est un enjeu de **développement durable** : assurer l'accès de tous aux ressources sans épuiser la planète.

## L'essentiel à retenir
- Les besoins en **énergie** augmentent : énergies **fossiles** (polluantes, non renouvelables) contre **renouvelables** (propres, inépuisables).
- Ressources **inégalement réparties** ; certains pays exportent, d'autres importent.
- L'**eau douce** est vitale mais rare et mal répartie : le **stress hydrique** menace plusieurs régions.
- Il faut **gérer durablement** énergie et eau pour éviter conflits et épuisement.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Byzance et l''Europe carolingienne', $json${
      "centre": "Byzance et l'Europe carolingienne",
      "branches": [
        { "titre": "Empire byzantin", "enfants": ["Héritier de Rome à l'Est", "Capitale Constantinople", "Langue grecque"] },
        { "titre": "Justinien (527-565)", "enfants": ["Le Code de lois", "Sainte-Sophie", "Empereur chef de l'Église"] },
        { "titre": "Charlemagne", "enfants": ["Roi des Francs", "Empereur en 800 (pape)", "Capitale Aix-la-Chapelle"] },
        { "titre": "Ruptures et partage", "enfants": ["Schisme de 1054", "Orthodoxes / catholiques", "Traité de Verdun (843)"] }
      ]
    }$json$),
    ('Société, Église et pouvoir féodal', $json${
      "centre": "Société et pouvoir féodal",
      "branches": [
        { "titre": "Les trois ordres", "enfants": ["Ceux qui prient (clergé)", "Ceux qui combattent (seigneurs)", "Ceux qui travaillent (paysans)"] },
        { "titre": "Seigneurs et paysans", "enfants": ["Seigneurie et château", "Redevances et corvées", "Serfs et vilains"] },
        { "titre": "La vassalité", "enfants": ["Hommage au suzerain", "Le vassal reçoit un fief", "Aide et conseil"] },
        { "titre": "L'Église", "enfants": ["Encadre toute la vie", "Impôt : la dîme", "Églises romanes puis gothiques"] }
      ]
    }$json$),
    ('L''islam médiéval : pouvoirs et cultures', $json${
      "centre": "L'islam médiéval",
      "branches": [
        { "titre": "Naissance", "enfants": ["Arabie, VIIe siècle", "Mahomet, La Mecque", "Hégire 622, le Coran"] },
        { "titre": "Un immense empire", "enfants": ["Dirigé par les califes", "De l'Espagne à l'Inde", "Omeyyades puis Abbassides"] },
        { "titre": "Villes brillantes", "enfants": ["Bagdad, Cordoue, Le Caire", "Mosquée et minaret", "Souks et palais"] },
        { "titre": "Foyer de savoirs", "enfants": ["Maison de la Sagesse", "Algèbre, médecine, astronomie", "Diffusés vers l'Europe"] }
      ]
    }$json$),
    ('La croissance démographique et ses effets', $json${
      "centre": "Croissance démographique",
      "branches": [
        { "titre": "Une population en hausse", "enfants": ["Plus de 8 milliards", "Baisse de la mortalité", "Natalité longtemps élevée"] },
        { "titre": "Des écarts régionaux", "enfants": ["Forte hausse : pays en développement", "Faible hausse : pays riches", "Vieillissement en Europe"] },
        { "titre": "Nourrir tout le monde", "enfants": ["Défi alimentaire", "Agriculture intensive", "Risques pour l'environnement"] },
        { "titre": "Développement durable", "enfants": ["Pilier économique", "Pilier social", "Pilier environnemental"] }
      ]
    }$json$),
    ('L''accès aux ressources : énergie et eau', $json${
      "centre": "Accès à l'énergie et à l'eau",
      "branches": [
        { "titre": "Besoins en énergie", "enfants": ["Fossiles : polluantes", "Renouvelables : propres", "Réchauffement climatique"] },
        { "titre": "Répartition inégale", "enfants": ["Pétrole au Proche-Orient", "Pays exportateurs / importateurs", "Inégalités d'électricité"] },
        { "titre": "L'eau, ressource fragile", "enfants": ["Eau douce rare", "Stress hydrique", "Irrigation agricole"] },
        { "titre": "Gérer durablement", "enfants": ["Économiser, moins gaspiller", "Réutiliser l'eau", "Éviter les conflits"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds ont déjà créé les quiz ; ce bloc ne fait rien
--     si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '5e', v.chapter, true, l.id
FROM (VALUES
  ('09719999-0000-4000-8000-000000000001'::uuid, 'Byzance et l''Europe carolingienne'),
  ('09719999-0000-4000-8000-000000000002'::uuid, 'Société, Église et pouvoir féodal'),
  ('09719999-0000-4000-8000-000000000003'::uuid, 'L''islam médiéval : pouvoirs et cultures'),
  ('09719999-0000-4000-8000-000000000004'::uuid, 'La croissance démographique et ses effets'),
  ('09719999-0000-4000-8000-000000000005'::uuid, 'L''accès aux ressources : énergie et eau')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3b. Questions supplémentaires (positions 4→10), attachées au quiz DE LA LEÇON
--     via la jointure leçon→quiz (donc au quiz existant, quel que soit son id).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Chapitre 1 — Byzance et l'Europe carolingienne
  ('09710000-0000-4000-8000-000000000104'::uuid, 'Byzance et l''Europe carolingienne',
   'Quelle est la capitale de l''Empire byzantin ?', 'mcq',
   '["Constantinople", "Rome", "Aix-la-Chapelle", "Athènes"]', 0,
   'L''Empire byzantin a pour capitale Constantinople, l''ancienne Byzance (aujourd''hui Istanbul).', 4),
  ('09710000-0000-4000-8000-000000000105'::uuid, 'Byzance et l''Europe carolingienne',
   'En quelle année Charlemagne est-il couronné empereur ?', 'mcq',
   '["800", "843", "1054", "622"]', 0,
   'Charlemagne est couronné empereur par le pape à Rome en l''an 800.', 5),
  ('09710000-0000-4000-8000-000000000106'::uuid, 'Byzance et l''Europe carolingienne',
   'Dans l''Empire byzantin, on parle surtout le latin.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la langue de l''Empire byzantin est le grec, pas le latin.', 6),
  ('09710000-0000-4000-8000-000000000107'::uuid, 'Byzance et l''Europe carolingienne',
   'Quel empereur byzantin fait rédiger un grand code de lois et bâtir Sainte-Sophie ?', 'mcq',
   '["Justinien", "Charlemagne", "Mahomet", "Clovis"]', 0,
   'Justinien (527-565) fait rédiger le Code et construire l''église Sainte-Sophie.', 7),
  ('09710000-0000-4000-8000-000000000108'::uuid, 'Byzance et l''Europe carolingienne',
   'Quelle est la capitale de Charlemagne ?', 'mcq',
   '["Aix-la-Chapelle", "Paris", "Rome", "Bagdad"]', 0,
   'Charlemagne installe sa capitale à Aix-la-Chapelle.', 8),
  ('09710000-0000-4000-8000-000000000109'::uuid, 'Byzance et l''Europe carolingienne',
   'Le schisme de 1054 sépare les chrétiens orthodoxes et catholiques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En 1054, le schisme sépare l''Église orthodoxe (Est) de l''Église catholique (Ouest).', 9),
  ('09710000-0000-4000-8000-000000000110'::uuid, 'Byzance et l''Europe carolingienne',
   'Que partage le traité de Verdun en 843 ?', 'mcq',
   '["L''Empire carolingien", "L''Empire byzantin", "La ville de Rome", "L''Espagne musulmane"]', 0,
   'En 843, le traité de Verdun partage l''Empire carolingien entre les petits-fils de Charlemagne.', 10),

  -- Chapitre 2 — Société, Église et pouvoir féodal
  ('09710000-0000-4000-8000-000000000204'::uuid, 'Société, Église et pouvoir féodal',
   'Dans la société féodale, quel groupe est de très loin le plus nombreux ?', 'mcq',
   '["Les paysans", "Les seigneurs", "Les prêtres", "Les rois"]', 0,
   'Les paysans (ceux qui travaillent) forment l''immense majorité de la population.', 4),
  ('09710000-0000-4000-8000-000000000205'::uuid, 'Société, Église et pouvoir féodal',
   'Comment appelle-t-on l''impôt versé à l''Église, environ un dixième des récoltes ?', 'mcq',
   '["La dîme", "La corvée", "Le fief", "La banalité"]', 0,
   'La dîme est l''impôt (environ un dixième des récoltes) prélevé par l''Église.', 5),
  ('09710000-0000-4000-8000-000000000206'::uuid, 'Société, Église et pouvoir féodal',
   'Le vassal jure fidélité à son suzerain lors d''une cérémonie appelée l''hommage.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Lors de l''hommage, le vassal jure fidélité au suzerain qui lui donne un fief.', 6),
  ('09710000-0000-4000-8000-000000000207'::uuid, 'Société, Église et pouvoir féodal',
   'Quelle terre le suzerain donne-t-il à son vassal ?', 'mcq',
   '["Le fief", "La dîme", "La corvée", "Le donjon"]', 0,
   'En échange de sa fidélité, le vassal reçoit une terre : le fief.', 7),
  ('09710000-0000-4000-8000-000000000208'::uuid, 'Société, Église et pouvoir féodal',
   'Les journées de travail gratuit que les paysans doivent au seigneur s''appellent : ', 'mcq',
   '["Les corvées", "Les vitraux", "Les croisades", "Les banalités"]', 0,
   'Les corvées sont des journées de travail gratuit dues au seigneur (les banalités, elles, sont des taxes d''usage du moulin ou du four).', 8),
  ('09710000-0000-4000-8000-000000000209'::uuid, 'Société, Église et pouvoir féodal',
   'La cathédrale gothique se reconnaît à ses voûtes hautes et ses grands vitraux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le style gothique se caractérise par des voûtes hautes, de grands vitraux et des arcs-boutants.', 9),
  ('09710000-0000-4000-8000-000000000210'::uuid, 'Société, Église et pouvoir féodal',
   'Les trois ordres de la société médiévale sont : ', 'mcq',
   '["Ceux qui prient, ceux qui combattent, ceux qui travaillent", "Les nobles, les rois, les marchands", "Les esclaves, les serfs, les libres", "Les enfants, les adultes, les vieux"]', 0,
   'On distingue ceux qui prient (clergé), ceux qui combattent (seigneurs) et ceux qui travaillent (paysans).', 10),

  -- Chapitre 3 — L'islam médiéval : pouvoirs et cultures
  ('09710000-0000-4000-8000-000000000304'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Au VIIe siècle, dans quelle région naît l''islam ?', 'mcq',
   '["En Arabie", "En Espagne", "En Égypte", "En Perse"]', 0,
   'L''islam naît en Arabie au VIIe siècle, prêché par Mahomet.', 4),
  ('09710000-0000-4000-8000-000000000305'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Quel événement de l''an 622 marque le début du calendrier musulman ?', 'mcq',
   '["L''Hégire", "Le schisme", "Le sacre de Charlemagne", "La chute de Rome"]', 0,
   'L''Hégire, le départ de Mahomet vers Médine en 622, marque le début du calendrier musulman.', 5),
  ('09710000-0000-4000-8000-000000000306'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Comment appelle-t-on le livre sacré des musulmans ?', 'mcq',
   '["Le Coran", "La Bible", "La Torah", "Le Code"]', 0,
   'Le livre sacré de l''islam est le Coran.', 6),
  ('09710000-0000-4000-8000-000000000307'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Bagdad est la capitale fondée par les Abbassides.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les Abbassides fondent Bagdad en 762 et en font leur capitale.', 7),
  ('09710000-0000-4000-8000-000000000308'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Comment appelle-t-on les chefs qui dirigent l''empire musulman après Mahomet ?', 'mcq',
   '["Les califes", "Les empereurs", "Les seigneurs", "Les papes"]', 0,
   'Après Mahomet, l''empire est dirigé par les califes.', 8),
  ('09710000-0000-4000-8000-000000000309'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Quelle ville d''Espagne musulmane est célèbre pour sa Grande Mosquée ?', 'mcq',
   '["Cordoue", "Bagdad", "Le Caire", "Damas"]', 0,
   'Cordoue, en al-Andalus, est célèbre pour sa Grande Mosquée.', 9),
  ('09710000-0000-4000-8000-000000000310'::uuid, 'L''islam médiéval : pouvoirs et cultures',
   'Les savants musulmans n''ont apporté aucune connaissance nouvelle à l''Europe.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les savoirs (algèbre, médecine, astronomie) développés dans l''empire musulman ont été diffusés vers l''Europe.', 10),

  -- Chapitre 4 — La croissance démographique et ses effets
  ('09710000-0000-4000-8000-000000000404'::uuid, 'La croissance démographique et ses effets',
   'Combien d''habitants compte aujourd''hui la population mondiale ?', 'mcq',
   '["Plus de 8 milliards", "1 milliard", "500 millions", "100 milliards"]', 0,
   'La population mondiale dépasse aujourd''hui 8 milliards d''habitants.', 4),
  ('09710000-0000-4000-8000-000000000405'::uuid, 'La croissance démographique et ses effets',
   'Quelle est la principale cause de la forte croissance de la population ?', 'mcq',
   '["La baisse de la mortalité", "La hausse de la mortalité", "La baisse des naissances", "Les migrations"]', 0,
   'La population augmente surtout grâce à la baisse de la mortalité (santé, alimentation, hygiène).', 5),
  ('09710000-0000-4000-8000-000000000406'::uuid, 'La croissance démographique et ses effets',
   'Dans les pays riches comme le Japon, la population vieillit et croît peu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dans les pays riches, la croissance est faible et la population vieillit.', 6),
  ('09710000-0000-4000-8000-000000000407'::uuid, 'La croissance démographique et ses effets',
   'Quels sont les trois piliers du développement durable ?', 'mcq',
   '["Économique, social, environnemental", "Passé, présent, futur", "Ville, campagne, mer", "Eau, air, feu"]', 0,
   'Le développement durable repose sur les piliers économique, social et environnemental.', 7),
  ('09710000-0000-4000-8000-000000000408'::uuid, 'La croissance démographique et ses effets',
   'Comment appelle-t-on une ville de plus de 10 millions d''habitants ?', 'mcq',
   '["Une mégapole", "Un village", "Un continent", "Une région"]', 0,
   'Une mégapole compte plus de 10 millions d''habitants (Tokyo, Delhi, Lagos…).', 8),
  ('09710000-0000-4000-8000-000000000409'::uuid, 'La croissance démographique et ses effets',
   'Le développement durable ne se préoccupe pas des générations futures.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le développement durable répond aux besoins d''aujourd''hui sans empêcher les générations futures de bien vivre.', 9),
  ('09710000-0000-4000-8000-000000000410'::uuid, 'La croissance démographique et ses effets',
   'Le premier grand défi lié à la croissance de la population est : ', 'mcq',
   '["Nourrir tous les habitants", "Construire des châteaux", "Réduire le nombre d''écoles", "Supprimer les villes"]', 0,
   'Le défi alimentaire (produire assez pour tous) est un enjeu majeur de la croissance démographique.', 10),

  -- Chapitre 5 — L'accès aux ressources : énergie et eau
  ('09710000-0000-4000-8000-000000000504'::uuid, 'L''accès aux ressources : énergie et eau',
   'Parmi ces énergies, laquelle est renouvelable ?', 'mcq',
   '["Le vent (éolien)", "Le pétrole", "Le charbon", "Le gaz"]', 0,
   'Le vent est une énergie renouvelable ; pétrole, charbon et gaz sont des énergies fossiles.', 4),
  ('09710000-0000-4000-8000-000000000505'::uuid, 'L''accès aux ressources : énergie et eau',
   'Les énergies fossiles rejettent du CO2 et accentuent le réchauffement climatique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les énergies fossiles (pétrole, charbon, gaz) rejettent du CO2 et accentuent le réchauffement climatique.', 5),
  ('09710000-0000-4000-8000-000000000506'::uuid, 'L''accès aux ressources : énergie et eau',
   'Dans quelle région du monde le pétrole est-il particulièrement concentré ?', 'mcq',
   '["Le Proche-Orient", "L''Antarctique", "L''Europe du Nord", "Le Groenland"]', 0,
   'Le pétrole est fortement concentré au Proche-Orient.', 6),
  ('09710000-0000-4000-8000-000000000507'::uuid, 'L''accès aux ressources : énergie et eau',
   'Comment appelle-t-on le manque d''eau douce que connaissent certaines régions ?', 'mcq',
   '["Le stress hydrique", "La marée", "L''irrigation", "La banalité"]', 0,
   'Le stress hydrique désigne le manque d''eau douce, comme au Sahel ou au Proche-Orient.', 7),
  ('09710000-0000-4000-8000-000000000508'::uuid, 'L''accès aux ressources : énergie et eau',
   'Quelle activité consomme la plus grande partie de l''eau douce ?', 'mcq',
   '["L''agriculture (irrigation)", "Les jeux vidéo", "Le tourisme spatial", "La lecture"]', 0,
   'L''agriculture, par l''irrigation, consomme la plus grande partie de l''eau douce.', 8),
  ('09710000-0000-4000-8000-000000000509'::uuid, 'L''accès aux ressources : énergie et eau',
   'L''eau douce est abondante et répartie de façon égale sur toute la planète.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''eau douce est rare et très inégalement répartie entre les régions.', 9),
  ('09710000-0000-4000-8000-000000000510'::uuid, 'L''accès aux ressources : énergie et eau',
   'Pour gérer durablement l''énergie, il faut surtout : ', 'mcq',
   '["Développer les renouvelables et économiser", "Brûler plus de charbon", "Gaspiller l''eau", "Cesser toute production"]', 0,
   'Une gestion durable développe les énergies renouvelables et réduit le gaspillage.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
