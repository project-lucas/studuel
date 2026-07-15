-- =============================================================================
-- Studuel — Migration 147 : CONTENU HGGSP Tle (+ exercices type bac)
-- Remplit les 4 chapitres de HGGSP Terminale (spécialité, programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés (dissertation guidée / étude
--                       critique de document) par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 029 (mind_map), 002 (quizzes).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Environnement : exploiter, préserver', $md$# Environnement : exploiter, préserver

## Ce que tu vas comprendre
L'environnement est un enjeu politique majeur : les sociétés exploitent la nature pour se développer, mais doivent aussi la préserver. Ce thème interroge le rapport entre sociétés et milieux, l'histoire de cette relation et la construction d'une gouvernance mondiale du climat.

## 1. Un rapport sociétés / nature qui a une histoire
La nature n'est pas seulement un décor : c'est une **ressource** et un **milieu de vie**. Le rapport à la nature est une **construction culturelle** qui varie selon les époques et les civilisations.

- La **Révolution industrielle** (XIXe siècle) accélère l'exploitation des ressources (charbon, minerais) et marque l'entrée dans un âge des énergies fossiles.
- On parle aujourd'hui d'**anthropocène** : une ère où l'humanité est devenue une force capable de modifier la planète (climat, biodiversité, cycles).

## 2. Exploiter : ressources et pressions
Les sociétés puisent dans des ressources **renouvelables** (forêts, eau) et **non renouvelables** (pétrole, gaz, minerais).

- La surexploitation entraîne **déforestation**, **épuisement des sols**, **pollution** et **perte de biodiversité**.
- La croissance démographique et la mondialisation augmentent la pression sur les milieux.

## 3. Étude de cas : les États-Unis et l'environnement
Les **États-Unis** montrent les tensions entre exploitation et préservation :
- Dès la fin du XIXe siècle, création des premiers **parcs nationaux** (Yellowstone, 1872) : naissance d'une idée de **préservation**.
- Mais un modèle de consommation très gourmand en énergie et des reculs politiques (retraits successifs d'accords climatiques) illustrent les contradictions.

## 4. Préserver : des politiques environnementales
Face aux dégâts, des **politiques de protection** émergent : aires protégées, réglementation des pollutions, transition énergétique vers les renouvelables.

- La notion de **développement durable** (rapport Brundtland, 1987) cherche à concilier économie, société et environnement.
- Les acteurs sont multiples : États, ONG, entreprises, citoyens, collectivités locales.

## 5. Une gouvernance mondiale du climat
Le climat est un **bien commun** : sa protection suppose une coopération internationale.

- **Sommet de Rio (1992)** : consécration du développement durable et création de la Convention-cadre sur le climat.
- Les **COP** (Conférences des Parties) réunissent chaque année les États ; la **COP21 (2016, accord de Paris)** fixe l'objectif de contenir le réchauffement sous **2 °C**.
- Difficultés : intérêts nationaux divergents, engagements non contraignants, tensions Nord/Sud sur la responsabilité historique.

## L'essentiel à retenir
- Le rapport sociétés/nature est une **construction historique et culturelle** ; l'**anthropocène** désigne l'empreinte humaine sur la planète.
- Exploiter les ressources crée des pressions (déforestation, pollution, perte de biodiversité).
- **Préserver** passe par des politiques (parcs, aires protégées, développement durable dès 1987).
- La **gouvernance climatique** repose sur Rio (1992) et les **COP** (accord de Paris, COP21) mais reste fragile.$md$),

    ('Guerres et paix', $md$# Faire la guerre, faire la paix

## Ce que tu vas comprendre
La guerre et la paix structurent l'histoire des relations internationales. Ce thème analyse les formes de conflits, les théories de la guerre, la manière dont on tente de bâtir la paix et le rôle des organisations internationales.

## 1. Les formes de la guerre
La guerre a changé de visage au fil du temps :
- Les **guerres classiques** (interétatiques) opposent des armées régulières d'États.
- Les **guerres irrégulières** et **asymétriques** opposent un État à des acteurs non étatiques (guérillas, groupes terroristes).
- On distingue aussi les **conflits de haute intensité** et les conflits **hybrides** mêlant cyberattaques, propagande et opérations armées.

## 2. Penser la guerre : Clausewitz
Le théoricien prussien **Carl von Clausewitz** (*De la guerre*, XIXe siècle) définit la guerre comme la **« continuation de la politique par d'autres moyens »**.

- La guerre est un **instrument politique** au service d'un objectif.
- Il distingue la **guerre absolue** (théorique, totale) et la **guerre réelle** (limitée par des contraintes concrètes).

## 3. Étude de cas : le Moyen-Orient
Le **Moyen-Orient** illustre la diversité et la persistance des conflits :
- Guerres interétatiques, conflits internes, interventions étrangères et acteurs non étatiques s'y superposent.
- Les enjeux mêlent territoires, ressources, religions et rivalités de puissances régionales et mondiales.

## 4. Construire et garder la paix
Faire la paix suppose plus que l'arrêt des combats :
- **Paix des vainqueurs** imposée (ex. traités après une guerre) ou **paix négociée** entre adversaires.
- La notion de **paix perpétuelle** (Kant) inspire l'idée d'un droit international garantissant la sécurité collective.
- Le **maintien de la paix** implique désarmement, réconciliation et reconstruction.

## 5. Le rôle de l'ONU
Créée en **1945**, l'**Organisation des Nations unies (ONU)** vise à préserver la paix et la sécurité internationales.

- Le **Conseil de sécurité** (5 membres permanents avec droit de veto) peut voter des **résolutions** et autoriser des interventions.
- Les **Casques bleus** conduisent des **opérations de maintien de la paix**.
- Limites : le **droit de veto** peut bloquer l'action, et l'ONU dépend de la volonté des États.

## L'essentiel à retenir
- Les formes de guerre évoluent : **interétatiques**, **asymétriques**, **hybrides**.
- **Clausewitz** : la guerre est la « continuation de la politique par d'autres moyens ».
- Faire la paix = paix imposée ou négociée, puis réconciliation et reconstruction.
- L'**ONU (1945)** et son **Conseil de sécurité** (résolutions, veto, Casques bleus) tentent d'assurer la sécurité collective, avec des limites.$md$),

    ('L''enjeu de la connaissance', $md$# L'enjeu de la connaissance

## Ce que tu vas comprendre
La connaissance est une ressource et un pouvoir. Ce thème étudie comment le savoir se produit, circule et devient un enjeu politique, économique et géopolitique, de la science moderne à la société de l'information et à l'intelligence artificielle.

## 1. Produire et diffuser des connaissances
La connaissance se construit dans des **lieux** (universités, laboratoires, académies) et circule par des **réseaux** (imprimerie, revues, Internet).

- La **révolution scientifique** (XVIe-XVIIe siècles) impose la **méthode expérimentale** (Galilée, Newton).
- Les **Lumières** (XVIIIe siècle) diffusent le savoir et la raison (l'*Encyclopédie*).

## 2. Sciences et pouvoirs
Le savoir scientifique entretient des liens étroits avec le **pouvoir** :
- Il peut être **soutenu** par les États (recherche, prestige national) ou au contraire **contrôlé** et censuré.
- La science est un enjeu de **puissance** (armement, industrie, prestige) : la **guerre froide** est aussi une course scientifique et technologique (conquête spatiale, nucléaire).

## 3. Étude de cas : le savoir menacé
Le savoir peut être **combattu** :
- Régimes autoritaires qui censurent, persécutent des chercheurs ou imposent une science idéologique.
- La liberté académique et l'indépendance des scientifiques sont des enjeux démocratiques.

## 4. La société de l'information
Depuis le XXe siècle, l'information est devenue une **ressource stratégique** :
- Explosion des **médias**, d'**Internet** et des **données** (*big data*).
- Enjeux de **contrôle** (surveillance, cyberespace), de **désinformation** et de **souveraineté numérique**.
- Le savoir devient une **marchandise** protégée par les **brevets** et un enjeu de rivalité entre puissances.

## 5. L'intelligence artificielle, nouvel enjeu
L'**intelligence artificielle (IA)** transforme la production et l'usage des connaissances :
- Automatisation du traitement des données, aide à la décision, recherche accélérée.
- Enjeux éthiques (biais, vie privée), économiques et géopolitiques : la maîtrise de l'IA est un facteur de **puissance** au XXIe siècle.

## L'essentiel à retenir
- La connaissance se **produit** dans des lieux et **circule** par des réseaux (imprimerie, Internet).
- Science et **pouvoir** sont liés : soutien, contrôle, enjeu de puissance (guerre froide).
- La **société de l'information** fait des données une ressource stratégique (désinformation, souveraineté numérique).
- L'**IA** est le nouvel enjeu de la connaissance : puissance, mais aussi défis éthiques.$md$),

    ('Le patrimoine', $md$# Le patrimoine

## Ce que tu vas comprendre
Le patrimoine est l'ensemble des biens hérités du passé que l'on choisit de conserver et de transmettre. Ce thème montre comment on identifie, protège et valorise le patrimoine, et comment il devient un enjeu politique, identitaire et économique.

## 1. Qu'est-ce que le patrimoine ?
Le **patrimoine** regroupe les biens **matériels** (monuments, œuvres, sites) et **immatériels** (langues, savoir-faire, traditions) transmis d'une génération à l'autre.

- Le patrimoine est une **construction** : on **choisit** ce que l'on juge digne d'être conservé.
- Il porte une dimension **identitaire** : il relie une communauté à son histoire.

## 2. Une notion qui a une histoire
La notion de patrimoine s'est élargie au fil du temps :
- La **Révolution française** invente l'idée de patrimoine **national** à protéger (nationalisation des biens, premiers musées comme le **Louvre**).
- Au XIXe siècle, la **restauration des monuments** (Viollet-le-Duc) et la naissance des **Monuments historiques** structurent la protection.
- Le champ s'étend ensuite au patrimoine **industriel**, **naturel** et **immatériel**.

## 3. Identifier et protéger
Protéger le patrimoine suppose de l'**inventorier**, de le **classer** et de le **réglementer**.

- En France : classement au titre des **Monuments historiques**, rôle de l'État et des collectivités.
- Enjeux : financement, restauration, arbitrage entre conservation et aménagement du territoire.

## 4. L'UNESCO et le patrimoine mondial
L'**UNESCO** (agence de l'ONU) protège un **patrimoine mondial** de l'humanité :
- Création de la **liste du patrimoine mondial (1972)** : sites reconnus pour leur **valeur universelle exceptionnelle**.
- Objectif : préserver des biens menacés (guerres, catastrophes, tourisme de masse) et favoriser la coopération.
- Le patrimoine immatériel est également reconnu et protégé.

## 5. Usages politiques et économiques
Le patrimoine est un **enjeu de pouvoir** et de développement :
- **Usages politiques** : affirmer une identité, une puissance, une mémoire ; sa destruction peut être une arme (ex. saccages de sites lors de conflits).
- **Usages économiques** : le **tourisme culturel** valorise le patrimoine mais peut aussi le fragiliser (surfréquentation).
- La valorisation cherche un équilibre entre **transmission**, **protection** et **développement**.

## L'essentiel à retenir
- Le patrimoine (matériel et **immatériel**) est un **choix** de conservation à valeur **identitaire**.
- La notion s'est construite historiquement (Révolution française, **Monuments historiques**).
- Protéger = inventorier, classer, réglementer ; l'**UNESCO** protège le **patrimoine mondial (1972)**.
- Le patrimoine a des **usages politiques** (identité, puissance) et **économiques** (tourisme).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'hggsp'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Environnement : exploiter, préserver', $json${
      "centre": "Environnement : exploiter, préserver",
      "branches": [
        { "titre": "Rapport sociétés / nature", "enfants": ["Construction historique et culturelle", "Révolution industrielle", "Anthropocène"] },
        { "titre": "Exploiter", "enfants": ["Ressources renouvelables / non", "Déforestation, pollution", "Perte de biodiversité"] },
        { "titre": "Préserver", "enfants": ["Parcs nationaux (Yellowstone 1872)", "Aires protégées", "Développement durable (1987)"] },
        { "titre": "Gouvernance du climat", "enfants": ["Sommet de Rio (1992)", "Les COP", "Accord de Paris, COP21 (< 2 °C)"] }
      ]
    }$json$),
    ('Guerres et paix', $json${
      "centre": "Faire la guerre, faire la paix",
      "branches": [
        { "titre": "Formes de guerre", "enfants": ["Interétatiques classiques", "Asymétriques / irrégulières", "Conflits hybrides"] },
        { "titre": "Penser la guerre", "enfants": ["Clausewitz", "« continuation de la politique »", "Guerre absolue / réelle"] },
        { "titre": "Faire la paix", "enfants": ["Paix imposée ou négociée", "Paix perpétuelle (Kant)", "Réconciliation, reconstruction"] },
        { "titre": "L'ONU (1945)", "enfants": ["Conseil de sécurité, veto", "Résolutions", "Casques bleus"] }
      ]
    }$json$),
    ('L''enjeu de la connaissance', $json${
      "centre": "L'enjeu de la connaissance",
      "branches": [
        { "titre": "Produire et diffuser", "enfants": ["Universités, laboratoires", "Méthode expérimentale", "Lumières, Encyclopédie"] },
        { "titre": "Sciences et pouvoirs", "enfants": ["Soutien ou contrôle des États", "Enjeu de puissance", "Guerre froide (espace, nucléaire)"] },
        { "titre": "Société de l'information", "enfants": ["Internet, big data", "Désinformation, surveillance", "Souveraineté numérique, brevets"] },
        { "titre": "Intelligence artificielle", "enfants": ["Traitement des données", "Enjeux éthiques (biais)", "Facteur de puissance"] }
      ]
    }$json$),
    ('Le patrimoine', $json${
      "centre": "Le patrimoine",
      "branches": [
        { "titre": "Qu'est-ce que le patrimoine ?", "enfants": ["Matériel et immatériel", "Un choix de conservation", "Dimension identitaire"] },
        { "titre": "Une histoire", "enfants": ["Révolution française, Louvre", "Monuments historiques", "Élargissement (industriel, naturel)"] },
        { "titre": "Identifier et protéger", "enfants": ["Inventorier, classer", "Réglementer", "État et collectivités"] },
        { "titre": "UNESCO et usages", "enfants": ["Patrimoine mondial (1972)", "Usages politiques (identité)", "Tourisme culturel"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'hggsp'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz HGGSP ; ce
--     bloc ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'HGGSP', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14719999-0000-4000-8000-000000000001'::uuid, 'Environnement : exploiter, préserver'),
  ('14719999-0000-4000-8000-000000000002'::uuid, 'Guerres et paix'),
  ('14719999-0000-4000-8000-000000000003'::uuid, 'L''enjeu de la connaissance'),
  ('14719999-0000-4000-8000-000000000004'::uuid, 'Le patrimoine')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'hggsp'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
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
  -- Chapitre 1 — Environnement : exploiter, préserver
  ('14710000-0000-4000-8000-000000000104'::uuid, 'Environnement : exploiter, préserver',
   'Quel terme désigne l''ère où l''humanité est devenue une force capable de modifier la planète ?', 'mcq',
   '["L''anthropocène", "Le néolithique", "Le développement durable", "La biodiversité"]', 0,
   'L''anthropocène désigne l''ère marquée par l''empreinte de l''humanité sur les grands équilibres planétaires.', 4),
  ('14710000-0000-4000-8000-000000000105'::uuid, 'Environnement : exploiter, préserver',
   'En quelle année le premier parc national (Yellowstone) est-il créé ?', 'mcq',
   '["1872", "1945", "1972", "1992"]', 0,
   'Yellowstone, créé en 1872 aux États-Unis, marque la naissance de l''idée de préservation.', 5),
  ('14710000-0000-4000-8000-000000000106'::uuid, 'Environnement : exploiter, préserver',
   'L''accord de Paris (COP21) vise à contenir le réchauffement bien en dessous de 2 °C.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''accord de Paris fixe l''objectif de limiter le réchauffement sous 2 °C par rapport à l''ère préindustrielle.', 6),
  ('14710000-0000-4000-8000-000000000107'::uuid, 'Environnement : exploiter, préserver',
   'Que désignent les « COP » dans la gouvernance du climat ?', 'mcq',
   '["Les Conférences des Parties", "Des parcs naturels", "Des ONG écologistes", "Des traités militaires"]', 0,
   'Les COP (Conférences des Parties) réunissent chaque année les États signataires de la convention sur le climat.', 7),
  ('14710000-0000-4000-8000-000000000108'::uuid, 'Environnement : exploiter, préserver',
   'Le Sommet de Rio de 1992 a consacré la notion de développement durable.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le Sommet de la Terre de Rio (1992) consacre le développement durable et crée la convention-cadre sur le climat.', 8),
  ('14710000-0000-4000-8000-000000000109'::uuid, 'Environnement : exploiter, préserver',
   'Lequel de ces éléments est une ressource NON renouvelable ?', 'mcq',
   '["Le pétrole", "Le vent", "Le soleil", "L''eau des rivières"]', 0,
   'Le pétrole est une ressource fossile non renouvelable, contrairement au vent ou au soleil.', 9),
  ('14710000-0000-4000-8000-000000000110'::uuid, 'Environnement : exploiter, préserver',
   'Le rapport Brundtland (1987) est associé à quelle notion ?', 'mcq',
   '["Le développement durable", "La guerre froide", "Le patrimoine mondial", "L''intelligence artificielle"]', 0,
   'Le rapport Brundtland (1987) popularise la notion de développement durable.', 10),

  -- Chapitre 2 — Guerres et paix
  ('14710000-0000-4000-8000-000000000204'::uuid, 'Guerres et paix',
   'Selon Clausewitz, la guerre est la « continuation de la politique par d''autres moyens ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Cette formule célèbre de Clausewitz fait de la guerre un instrument au service d''un objectif politique.', 4),
  ('14710000-0000-4000-8000-000000000205'::uuid, 'Guerres et paix',
   'Comment qualifie-t-on un conflit opposant un État à un acteur non étatique aux moyens très inégaux ?', 'mcq',
   '["Une guerre asymétrique", "Une guerre interétatique", "Une paix négociée", "Une guerre absolue"]', 0,
   'La guerre asymétrique oppose des adversaires aux moyens très inégaux, comme un État et une guérilla.', 5),
  ('14710000-0000-4000-8000-000000000206'::uuid, 'Guerres et paix',
   'En quelle année l''ONU a-t-elle été créée ?', 'mcq',
   '["1945", "1919", "1972", "1992"]', 0,
   'L''ONU est fondée en 1945, au lendemain de la Seconde Guerre mondiale.', 6),
  ('14710000-0000-4000-8000-000000000207'::uuid, 'Guerres et paix',
   'Quel organe de l''ONU peut voter des résolutions et autoriser des interventions ?', 'mcq',
   '["Le Conseil de sécurité", "L''Assemblée générale", "La Cour des comptes", "Le Secrétariat au tourisme"]', 0,
   'Le Conseil de sécurité vote les résolutions et peut autoriser le recours à la force.', 7),
  ('14710000-0000-4000-8000-000000000208'::uuid, 'Guerres et paix',
   'Les membres permanents du Conseil de sécurité disposent d''un droit de veto.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les cinq membres permanents peuvent bloquer une résolution par leur droit de veto.', 8),
  ('14710000-0000-4000-8000-000000000209'::uuid, 'Guerres et paix',
   'Comment nomme-t-on les soldats chargés des opérations de maintien de la paix de l''ONU ?', 'mcq',
   '["Les Casques bleus", "Les Casques verts", "Les Bérets rouges", "Les Marines"]', 0,
   'Les Casques bleus conduisent les opérations de maintien de la paix sous mandat de l''ONU.', 9),
  ('14710000-0000-4000-8000-000000000210'::uuid, 'Guerres et paix',
   'Faire la paix se limite à l''arrêt des combats.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : faire la paix suppose aussi réconciliation, désarmement et reconstruction dans la durée.', 10),

  -- Chapitre 3 — L'enjeu de la connaissance
  ('14710000-0000-4000-8000-000000000304'::uuid, 'L''enjeu de la connaissance',
   'Quel mouvement du XVIIIe siècle diffuse le savoir et la raison, notamment via l''Encyclopédie ?', 'mcq',
   '["Les Lumières", "La Renaissance", "La Réforme", "Le romantisme"]', 0,
   'Les Lumières diffusent le savoir et la raison, avec l''Encyclopédie comme œuvre emblématique.', 4),
  ('14710000-0000-4000-8000-000000000305'::uuid, 'L''enjeu de la connaissance',
   'La révolution scientifique des XVIe-XVIIe siècles impose la méthode expérimentale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Galilée et Newton fondent la science moderne sur l''observation et l''expérience.', 5),
  ('14710000-0000-4000-8000-000000000306'::uuid, 'L''enjeu de la connaissance',
   'La guerre froide a aussi été une compétition scientifique et technologique (espace, nucléaire).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La conquête spatiale et la course au nucléaire illustrent la dimension scientifique de la guerre froide.', 6),
  ('14710000-0000-4000-8000-000000000307'::uuid, 'L''enjeu de la connaissance',
   'Comment appelle-t-on la masse de données numériques devenue une ressource stratégique ?', 'mcq',
   '["Le big data", "Le patrimoine", "La biodiversité", "Le protectionnisme"]', 0,
   'Le big data désigne les grandes masses de données, ressource stratégique de la société de l''information.', 7),
  ('14710000-0000-4000-8000-000000000308'::uuid, 'L''enjeu de la connaissance',
   'Quel outil juridique protège une invention et fait du savoir une marchandise ?', 'mcq',
   '["Le brevet", "Le veto", "La résolution", "Le classement"]', 0,
   'Le brevet protège une invention et transforme la connaissance en bien économique.', 8),
  ('14710000-0000-4000-8000-000000000309'::uuid, 'L''enjeu de la connaissance',
   'La maîtrise de l''intelligence artificielle est aujourd''hui un facteur de puissance.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le contrôle de l''IA est un enjeu géopolitique et économique majeur au XXIe siècle.', 9),
  ('14710000-0000-4000-8000-000000000310'::uuid, 'L''enjeu de la connaissance',
   'Quel phénomène désigne la diffusion volontaire de fausses informations ?', 'mcq',
   '["La désinformation", "La restauration", "Le développement durable", "La proportionnalité"]', 0,
   'La désinformation, propagation de fausses informations, est un enjeu clé de la société de l''information.', 10),

  -- Chapitre 4 — Le patrimoine
  ('14710000-0000-4000-8000-000000000404'::uuid, 'Le patrimoine',
   'Le patrimoine comprend uniquement des biens matériels (monuments, œuvres).', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le patrimoine inclut aussi l''immatériel (langues, savoir-faire, traditions).', 4),
  ('14710000-0000-4000-8000-000000000405'::uuid, 'Le patrimoine',
   'Quelle organisation gère la liste du patrimoine mondial de l''humanité ?', 'mcq',
   '["L''UNESCO", "L''OTAN", "L''OMC", "Le FMI"]', 0,
   'L''UNESCO, agence de l''ONU, établit et protège la liste du patrimoine mondial.', 5),
  ('14710000-0000-4000-8000-000000000406'::uuid, 'Le patrimoine',
   'En quelle année est créée la liste du patrimoine mondial de l''UNESCO ?', 'mcq',
   '["1972", "1945", "1789", "1992"]', 0,
   'La convention du patrimoine mondial de l''UNESCO date de 1972.', 6),
  ('14710000-0000-4000-8000-000000000407'::uuid, 'Le patrimoine',
   'Quel événement invente l''idée d''un patrimoine national à protéger ?', 'mcq',
   '["La Révolution française", "La guerre froide", "La COP21", "La Renaissance"]', 0,
   'La Révolution française nationalise des biens et crée les premiers musées, dont le Louvre.', 7),
  ('14710000-0000-4000-8000-000000000408'::uuid, 'Le patrimoine',
   'Le patrimoine résulte d''un choix : on décide de ce qui mérite d''être conservé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le patrimoine est une construction : les sociétés choisissent ce qu''elles jugent digne de transmission.', 8),
  ('14710000-0000-4000-8000-000000000409'::uuid, 'Le patrimoine',
   'Quel usage économique valorise le patrimoine mais peut le fragiliser ?', 'mcq',
   '["Le tourisme culturel", "Le veto", "La déforestation", "La méthode expérimentale"]', 0,
   'Le tourisme culturel valorise le patrimoine mais la surfréquentation peut le menacer.', 9),
  ('14710000-0000-4000-8000-000000000410'::uuid, 'Le patrimoine',
   'La destruction d''un site patrimonial peut être utilisée comme une arme lors d''un conflit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Détruire le patrimoine de l''adversaire vise à effacer son identité et sa mémoire : c''est un usage politique de la destruction.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'hggsp'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac corrigés par chapitre (dissertation guidée avec plan /
--    analyse critique de document).
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Environnement : exploiter, préserver', $md$# Exercices types — Environnement : exploiter, préserver

## Exercice 1 — Dissertation guidée
**Sujet : Exploiter et préserver l'environnement : un défi pour les sociétés ?**

On attend une dissertation structurée (introduction, deux ou trois parties, conclusion) appuyée sur des exemples précis. Voici un plan possible.

### Correction (plan détaillé)
**Introduction.** Définir l'environnement comme ressource et milieu de vie ; poser la tension entre exploitation (développement) et préservation. Problématique : comment concilier besoins des sociétés et protection des milieux ? Annonce du plan.

**I. Les sociétés exploitent intensément la nature.**
- Ressources renouvelables et non renouvelables ; Révolution industrielle et âge des énergies fossiles.
- Conséquences : déforestation, pollution, perte de biodiversité, entrée dans l'anthropocène.

**II. La nécessité de préserver s'impose.**
- Naissance de l'idée de préservation (parcs nationaux, Yellowstone 1872).
- Politiques environnementales et développement durable (rapport Brundtland, 1987).

**III. Une gouvernance mondiale difficile à construire.**
- Sommet de Rio (1992), COP, accord de Paris (COP21, objectif < 2 °C).
- Limites : intérêts nationaux divergents, engagements peu contraignants, tensions Nord/Sud.

**Conclusion.** Exploiter et préserver ne sont pas incompatibles mais supposent un équilibre et une coopération internationale encore fragile. Ouverture sur la transition énergétique.

## Exercice 2 — Analyse critique de document
**Document : un extrait de l'accord de Paris (COP21, 2016) fixant l'objectif de contenir le réchauffement « nettement en dessous de 2 °C ».**

**Consigne : montrez en quoi ce document illustre la gouvernance mondiale du climat et ses limites.**

### Correction
- **Présenter le document** : nature (texte d'un accord international), auteur (États réunis à la COP21), date (2016), contexte (négociations climatiques dans le cadre de l'ONU).
- **Analyser** : le document montre une coopération mondiale autour d'un objectif chiffré commun (< 2 °C), preuve que le climat est traité comme un bien commun nécessitant une action collective.
- **Critiquer / mettre en perspective** : les engagements reposent largement sur la bonne volonté des États et ne sont pas juridiquement contraignants ; des retraits et reculs politiques rappellent la fragilité de cette gouvernance.
- **Conclure** : le document est représentatif d'une gouvernance climatique réelle mais imparfaite, dépendante des intérêts nationaux.$md$),

    ('Guerres et paix', $md$# Exercices types — Guerres et paix

## Exercice 1 — Dissertation guidée
**Sujet : Faire la paix est-il plus difficile que faire la guerre ?**

On attend une dissertation argumentée et illustrée d'exemples. Voici un plan possible.

### Correction (plan détaillé)
**Introduction.** Définir guerre et paix ; rappeler la formule de Clausewitz (la guerre, « continuation de la politique par d'autres moyens »). Problématique : construire une paix durable est-il un défi plus grand que mener la guerre ? Annonce du plan.

**I. La guerre, un instrument politique aux formes multiples.**
- Guerres interétatiques, asymétriques, hybrides.
- La guerre comme moyen au service d'un objectif (Clausewitz) : elle peut être planifiée et déclenchée par un acteur.

**II. Faire la paix, un processus long et complexe.**
- Paix imposée (des vainqueurs) ou paix négociée.
- Au-delà du cessez-le-feu : réconciliation, désarmement, reconstruction ; idéal de « paix perpétuelle » (Kant).

**III. Le rôle et les limites des organisations internationales.**
- L'ONU (1945), le Conseil de sécurité, les Casques bleus, les résolutions.
- Limites : droit de veto, dépendance à la volonté des États.

**Conclusion.** Faire la paix engage la durée et la confiance, ce qui la rend souvent plus difficile que déclencher un conflit. Ouverture sur les conflits contemporains.

## Exercice 2 — Analyse critique de document
**Document : un extrait d'une résolution du Conseil de sécurité de l'ONU autorisant une opération de maintien de la paix.**

**Consigne : montrez comment ce document illustre le rôle de l'ONU dans la sécurité collective, et ses limites.**

### Correction
- **Présenter le document** : nature (résolution du Conseil de sécurité), auteur (ONU), contexte (gestion d'un conflit menaçant la paix).
- **Analyser** : la résolution montre l'ONU en acteur de la sécurité collective, capable d'autoriser le déploiement de Casques bleus et d'encadrer une intervention par le droit international.
- **Critiquer / mettre en perspective** : l'adoption d'une résolution suppose l'accord des cinq membres permanents ; le droit de veto peut bloquer l'action, et l'application dépend de la volonté et des moyens des États.
- **Conclure** : le document illustre à la fois la fonction pacificatrice de l'ONU et les limites structurelles qui la contraignent.$md$),

    ('L''enjeu de la connaissance', $md$# Exercices types — L'enjeu de la connaissance

## Exercice 1 — Dissertation guidée
**Sujet : En quoi la connaissance est-elle un enjeu de pouvoir ?**

On attend une dissertation structurée et illustrée. Voici un plan possible.

### Correction (plan détaillé)
**Introduction.** Définir la connaissance comme ressource produite et diffusée ; poser l'idée qu'elle est aussi un pouvoir. Problématique : pourquoi et comment le savoir est-il un enjeu politique et géopolitique ? Annonce du plan.

**I. Produire et diffuser le savoir : des lieux et des réseaux.**
- Révolution scientifique (méthode expérimentale), Lumières et Encyclopédie.
- L'imprimerie puis Internet comme vecteurs de circulation.

**II. Science et pouvoir : soutien, contrôle et puissance.**
- Les États soutiennent ou censurent le savoir ; enjeu de prestige.
- La guerre froide comme compétition scientifique (espace, nucléaire).

**III. Société de l'information et intelligence artificielle.**
- Big data, désinformation, souveraineté numérique, brevets.
- L'IA comme nouvel enjeu de puissance et de débats éthiques.

**Conclusion.** La connaissance est un enjeu de pouvoir parce qu'elle confère puissance, influence et autonomie ; sa maîtrise structure les rivalités contemporaines. Ouverture sur la régulation de l'IA.

## Exercice 2 — Analyse critique de document
**Document : un graphique montrant l'explosion du volume de données numériques (big data) produites dans le monde depuis les années 2000.**

**Consigne : montrez en quoi ce document illustre l'entrée dans une société de l'information, et quels enjeux elle soulève.**

### Correction
- **Présenter le document** : nature (graphique statistique), thème (croissance des données numériques), période (depuis les années 2000).
- **Analyser** : la hausse spectaculaire du volume de données traduit l'entrée dans une société de l'information où la donnée devient une ressource stratégique.
- **Critiquer / mettre en perspective** : le graphique ne dit rien des enjeux de contrôle (surveillance), de désinformation, ni des inégalités d'accès et de la souveraineté numérique ; ces données alimentent aussi les intelligences artificielles.
- **Conclure** : le document illustre une transformation majeure, mais doit être complété pour saisir les rapports de pouvoir qu'elle engendre.$md$),

    ('Le patrimoine', $md$# Exercices types — Le patrimoine

## Exercice 1 — Dissertation guidée
**Sujet : Protéger le patrimoine : un choix aux enjeux politiques ?**

On attend une dissertation structurée et illustrée. Voici un plan possible.

### Correction (plan détaillé)
**Introduction.** Définir le patrimoine (matériel et immatériel) comme héritage choisi et transmis ; souligner sa dimension identitaire. Problématique : protéger le patrimoine est-il un acte neutre ou un choix politique ? Annonce du plan.

**I. Le patrimoine, une construction historique et identitaire.**
- Élargissement de la notion (Révolution française, Monuments historiques, patrimoine immatériel).
- Le patrimoine relie une communauté à son histoire : dimension identitaire.

**II. Identifier et protéger : le rôle des institutions.**
- Inventaire, classement, réglementation ; rôle de l'État et des collectivités.
- L'UNESCO et le patrimoine mondial (1972) : coopération internationale.

**III. Des usages politiques et économiques.**
- Affirmer une identité, une puissance, une mémoire ; destruction comme arme.
- Tourisme culturel : valorisation mais risque de surfréquentation.

**Conclusion.** Protéger le patrimoine est un choix qui engage l'identité, la mémoire et le développement : c'est un acte profondément politique. Ouverture sur les patrimoines menacés par les conflits.

## Exercice 2 — Analyse critique de document
**Document : une photographie d'un site classé au patrimoine mondial de l'UNESCO, accompagnée de sa notice de classement.**

**Consigne : montrez comment ce document illustre les enjeux de la protection et de la valorisation du patrimoine.**

### Correction
- **Présenter le document** : nature (photographie + notice), objet (un site inscrit au patrimoine mondial), acteur (UNESCO).
- **Analyser** : le classement reconnaît une « valeur universelle exceptionnelle » et engage une protection internationale ; il illustre l'identification et la valorisation du patrimoine.
- **Critiquer / mettre en perspective** : le classement attire le tourisme (retombées économiques) mais peut fragiliser le site (surfréquentation) ; il comporte aussi des enjeux politiques (image, identité, financements).
- **Conclure** : le document montre que protéger le patrimoine, c'est arbitrer en permanence entre transmission, protection et développement.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'hggsp'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
