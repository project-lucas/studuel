-- =============================================================================
-- Studuel — Migration 124 : CONTENU Histoire-Géo 2de (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Histoire-Géo 2de (programme officiel 2de) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder du seed de structure)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant).
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons d'Histoire-Géo 2de, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La Méditerranée antique', $md$# La Méditerranée antique

## Ce que tu vas comprendre
Autour de la mer Méditerranée naissent, dans l'Antiquité, deux grandes civilisations qui ont façonné notre monde : la **Grèce** et **Rome**. Ce chapitre montre comment Athènes invente la démocratie, comment Rome bâtit un empire, et ce que ces mondes nous ont légué.

## 1. Athènes, la démocratie (Ve siècle av. J.-C.)
Au **Ve siècle av. J.-C.**, la cité d'**Athènes** invente la **démocratie** (« le pouvoir du peuple »). Sous **Périclès** (461-429 av. J.-C.), les **citoyens** se réunissent à l'assemblée, l'**ecclésia**, pour voter les lois et élire les magistrats.

Mais cette démocratie est **limitée** : seuls sont citoyens les hommes libres, majeurs, nés de parents athéniens. En sont **exclus** les femmes, les **métèques** (étrangers) et les **esclaves**, soit la grande majorité de la population.

## 2. Rome, de la cité à l'empire
Rome est d'abord une **République** dirigée par le **Sénat** et des magistrats. À force de conquêtes, elle domine tout le bassin méditerranéen, qu'elle appelle *Mare Nostrum* (« notre mer »).

En **27 av. J.-C.**, **Auguste** devient le premier **empereur** : c'est le début de l'**Empire romain** et de la *Pax Romana*, une longue période de paix. En **212 apr. J.-C.**, l'**édit de Caracalla** accorde la **citoyenneté romaine** à tous les hommes libres de l'Empire.

## 3. Les empreintes grecques et romaines
Ces civilisations nous ont laissé un héritage immense :
- la **langue** (le latin, racine du français) et l'**alphabet** ;
- le **droit** romain, base de nos lois ;
- l'**architecture** (temples, arènes, aqueducs, routes) ;
- la **philosophie**, le **théâtre** et les jeux ;
- le **christianisme**, né dans l'Empire, qui devient religion officielle à la fin du IVe siècle.

## L'essentiel à retenir
- Athènes invente la **démocratie** au **Ve siècle av. J.-C.** (Périclès, ecclésia), mais elle exclut femmes, métèques et esclaves.
- Rome passe de la **République** à l'**Empire** en **27 av. J.-C.** avec **Auguste**.
- L'**édit de Caracalla (212)** étend la citoyenneté à tout l'Empire.
- Héritages : langue, droit, architecture, philosophie, christianisme.$md$),

    ('La Méditerranée médiévale', $md$# La Méditerranée médiévale

## Ce que tu vas comprendre
Au Moyen Âge, la Méditerranée est partagée entre **trois grandes civilisations** qui se côtoient : elles s'affrontent parfois, mais commercent et échangent aussi beaucoup. Ce chapitre étudie ces contacts entre le VIIe et le XIIIe siècle.

## 1. Trois civilisations autour d'une même mer
Après l'Antiquité, la Méditerranée est bordée par trois mondes :
- l'**Occident chrétien** (la chrétienté latine, sous l'autorité du pape à Rome) ;
- l'**Empire byzantin**, chrétien d'Orient, dont la capitale est **Constantinople** ;
- le **monde musulman**, né au **VIIe siècle** avec l'islam, qui s'étend rapidement de l'Espagne à l'Orient.

## 2. Des affrontements
Ces mondes s'opposent souvent. Les **croisades** commencent en **1095**, quand le pape appelle les chrétiens à reprendre **Jérusalem**. En Espagne, la **Reconquista** est la reconquête progressive du territoire par les royaumes chrétiens sur les musulmans.

## 3. Des contacts et des échanges
Mais la Méditerranée est surtout un espace de **commerce** et de **circulation**. Des villes marchandes comme **Venise** ou **Gênes** relient l'Orient et l'Occident : épices, soieries, or et esclaves y circulent.

Les **échanges culturels** sont considérables. Dans l'Espagne musulmane (**Al-Andalus**), à **Cordoue** ou à **Tolède**, des savants **traduisent** les textes grecs antiques et les enrichissent : mathématiques, médecine, astronomie et **philosophie** passent ainsi au monde chrétien.

## L'essentiel à retenir
- Trois civilisations bordent la Méditerranée médiévale : la **chrétienté latine**, l'**Empire byzantin** (Constantinople) et le **monde musulman**.
- L'islam naît au **VIIe siècle** et s'étend rapidement.
- Les **croisades** débutent en **1095** ; la **Reconquista** oppose chrétiens et musulmans en Espagne.
- Malgré les conflits, commerce et **échanges culturels** (traductions d'Al-Andalus) circulent d'une rive à l'autre.$md$),

    ('L''ouverture atlantique (XVe-XVIe)', $md$# L'ouverture atlantique (XVe-XVIe siècle)

## Ce que tu vas comprendre
Aux XVe et XVIe siècles, les Européens explorent le monde, découvrent l'Amérique et transforment leur culture avec la Renaissance et la Réforme. Le centre de gravité se déplace de la Méditerranée vers l'**océan Atlantique**.

## 1. Les Grandes Découvertes
Portugais et Espagnols cherchent de nouvelles routes vers les richesses de l'Asie :
- en **1492**, **Christophe Colomb**, au service de l'Espagne, atteint l'**Amérique** ;
- en **1498**, le Portugais **Vasco de Gama** rejoint l'Inde en contournant l'Afrique ;
- de **1519 à 1522**, l'expédition de **Magellan** réalise le premier **tour du monde**.

## 2. La conquête de l'Amérique
Les Espagnols (les **conquistadors**) conquièrent les grands empires amérindiens : **Cortés** détruit l'empire **aztèque** (Mexique), **Pizarro** l'empire **inca** (Pérou). Commence alors l'**échange colombien** : produits, animaux mais aussi **maladies** circulent entre les continents, décimant les populations amérindiennes. La traite des esclaves africains se met en place.

## 3. La Renaissance
En Europe, la **Renaissance** est un grand renouveau artistique et intellectuel. L'**humanisme** replace l'**homme** et le savoir antique au centre. L'invention de l'**imprimerie** par **Gutenberg** (vers **1450**) diffuse largement les idées et les livres.

## 4. La Réforme
En **1517**, le moine allemand **Martin Luther** critique l'Église catholique : c'est le début de la **Réforme** protestante. La chrétienté d'Occident se divise entre **catholiques** et **protestants**. L'Église catholique réagit par la **Contre-Réforme** et le **concile de Trente** (1545-1563).

## L'essentiel à retenir
- **1492** : Colomb atteint l'**Amérique** ; **Magellan** boucle le premier tour du monde (**1519-1522**).
- Les **conquistadors** (Cortés, Pizarro) détruisent les empires **aztèque** et **inca**.
- La **Renaissance** et l'**humanisme** renouvellent les arts ; l'**imprimerie** (Gutenberg, v. 1450) diffuse le savoir.
- **1517** : **Luther** lance la **Réforme** ; la chrétienté se divise (catholiques / protestants).$md$),

    ('Sociétés et environnements', $md$# Sociétés et environnements

## Ce que tu vas comprendre
Une **société** vit dans un **environnement** dont elle tire des **ressources**, mais qu'elle transforme et parfois dégrade. Ce chapitre de géographie étudie ces relations et la recherche d'un **développement durable**.

## 1. Environnement et ressources
L'**environnement** est l'ensemble des milieux (naturels et transformés) dans lesquels vivent les sociétés. Elles y prélèvent des **ressources** : eau, sols, forêts, énergies, minerais…

Certaines ressources sont **renouvelables** (le vent, le soleil, l'eau si on la préserve), d'autres **non renouvelables** (pétrole, charbon, gaz) : leur stock s'épuise.

## 2. Des milieux sous pression
La croissance de la population et de la consommation exerce une forte **pression** sur les milieux : **déforestation**, **pollution**, épuisement des ressources, **réchauffement climatique**. Les géographes parlent parfois d'**anthropocène**, une époque où l'activité humaine bouleverse la planète.

## 3. Les risques
Un **risque** naît de la rencontre entre un **aléa** (un phénomène possible : séisme, inondation, cyclone) et des **enjeux** (populations, biens exposés). On distingue les **risques naturels** et les **risques technologiques** (industriels, nucléaires). Une même société doit s'y **adapter** et se **protéger**.

## 4. Vers un développement durable
Le **développement durable**, défini en **1987** (rapport Brundtland), cherche à « répondre aux besoins du présent sans compromettre ceux des générations futures ». Il combine trois piliers : l'**économie**, le **social** et l'**environnement**.

## L'essentiel à retenir
- Une société tire de son **environnement** des **ressources** renouvelables ou non renouvelables.
- La pression humaine dégrade les milieux (déforestation, pollution, réchauffement) : c'est l'**anthropocène**.
- Un **risque** = un **aléa** + des **enjeux** (risques naturels ou technologiques).
- Le **développement durable** (1987) concilie **économie**, **social** et **environnement**.$md$),

    ('Des mobilités généralisées', $md$# Des mobilités généralisées

## Ce que tu vas comprendre
Jamais autant d'êtres humains ne se sont déplacés qu'aujourd'hui : pour vivre ailleurs (**migrations**) ou pour voyager (**tourisme**). Ce chapitre de géographie étudie ces **mobilités** à l'échelle du monde.

## 1. Qu'est-ce qu'une mobilité ?
Une **mobilité** est un déplacement de personnes dans l'espace. Elle peut être **temporaire** (un voyage, un trajet quotidien) ou **durable** (une installation dans un autre pays). Les transports rapides et la **mondialisation** les ont énormément développées.

## 2. Les migrations internationales
Un **migrant international** est une personne qui s'installe durablement dans un autre pays. On en compte environ **280 millions** dans le monde. Les causes sont multiples :
- économiques (chercher du **travail**, une vie meilleure) ;
- politiques (fuir une guerre, une persécution : ce sont les **réfugiés**) ;
- environnementales (catastrophes, sécheresses).

Les flux vont souvent des **pays du Sud** vers les **pays du Nord**, plus riches, mais il existe aussi de grandes migrations Sud-Sud.

## 3. Le tourisme, première mobilité du monde
Le **tourisme** est le déplacement d'agrément, hors de son lieu de vie habituel. C'est aujourd'hui la mobilité la plus massive : plus d'**un milliard** de **touristes internationaux** chaque année. La France est l'un des pays les plus **visités** au monde.

Ce **tourisme de masse** a des effets : il apporte des **revenus** mais peut dégrader les sites et les milieux (surfréquentation, pollution).

## L'essentiel à retenir
- Une **mobilité** est un déplacement, temporaire ou durable ; la mondialisation les a multipliées.
- Environ **280 millions** de **migrants** dans le monde ; causes économiques, politiques (**réfugiés**), environnementales.
- Les flux migratoires vont surtout du **Sud** vers le **Nord**.
- Le **tourisme** est la première mobilité mondiale (plus d'un milliard de voyageurs/an) : richesse mais pressions sur les milieux.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La Méditerranée antique', $json${
      "centre": "La Méditerranée antique",
      "branches": [
        { "titre": "Athènes, la démocratie", "enfants": ["Ve siècle av. J.-C.", "Périclès, l'ecclésia", "Exclus : femmes, métèques, esclaves"] },
        { "titre": "Rome, de la République à l'Empire", "enfants": ["Auguste, empereur en 27 av. J.-C.", "Pax Romana, Mare Nostrum", "Édit de Caracalla (212)"] },
        { "titre": "Empreintes", "enfants": ["Langue et droit romain", "Architecture (arènes, aqueducs)", "Philosophie, théâtre"] },
        { "titre": "Une mer commune", "enfants": ["Échanges et conquêtes", "Naissance du christianisme", "Héritage jusqu'à nous"] }
      ]
    }$json$),
    ('La Méditerranée médiévale', $json${
      "centre": "La Méditerranée médiévale",
      "branches": [
        { "titre": "Trois civilisations", "enfants": ["Chrétienté latine (pape)", "Empire byzantin (Constantinople)", "Monde musulman (islam, VIIe s.)"] },
        { "titre": "Affrontements", "enfants": ["Croisades dès 1095", "Reconquête de Jérusalem", "Reconquista en Espagne"] },
        { "titre": "Commerce", "enfants": ["Venise et Gênes", "Épices, soie, or", "Orient relié à l'Occident"] },
        { "titre": "Échanges culturels", "enfants": ["Al-Andalus, Cordoue, Tolède", "Traductions des textes grecs", "Sciences et philosophie"] }
      ]
    }$json$),
    ('L''ouverture atlantique (XVe-XVIe)', $json${
      "centre": "L'ouverture atlantique",
      "branches": [
        { "titre": "Grandes Découvertes", "enfants": ["Colomb, Amérique en 1492", "Vasco de Gama (1498)", "Magellan, tour du monde 1519-1522"] },
        { "titre": "Conquête de l'Amérique", "enfants": ["Cortés vs Aztèques", "Pizarro vs Incas", "Échange colombien, maladies"] },
        { "titre": "Renaissance", "enfants": ["Humanisme", "Imprimerie de Gutenberg (v.1450)", "Renouveau des arts"] },
        { "titre": "Réforme", "enfants": ["Luther en 1517", "Catholiques / protestants", "Concile de Trente (1545-1563)"] }
      ]
    }$json$),
    ('Sociétés et environnements', $json${
      "centre": "Sociétés et environnements",
      "branches": [
        { "titre": "Ressources", "enfants": ["Eau, sols, forêts, énergies", "Renouvelables ou non", "Pétrole et charbon s'épuisent"] },
        { "titre": "Milieux sous pression", "enfants": ["Déforestation, pollution", "Réchauffement climatique", "Anthropocène"] },
        { "titre": "Risques", "enfants": ["Aléa + enjeux = risque", "Naturels (séisme, inondation)", "Technologiques (industriels)"] },
        { "titre": "Développement durable", "enfants": ["Défini en 1987 (Brundtland)", "Générations futures", "Économie, social, environnement"] }
      ]
    }$json$),
    ('Des mobilités généralisées', $json${
      "centre": "Des mobilités généralisées",
      "branches": [
        { "titre": "Les mobilités", "enfants": ["Déplacement de personnes", "Temporaire ou durable", "Boostées par la mondialisation"] },
        { "titre": "Migrations", "enfants": ["Environ 280 millions de migrants", "Causes éco, politiques, climat", "Réfugiés fuient guerres"] },
        { "titre": "Des flux", "enfants": ["Souvent Sud vers Nord", "Aussi des flux Sud-Sud", "Vers les pays plus riches"] },
        { "titre": "Tourisme", "enfants": ["Plus d'un milliard/an", "France très visitée", "Revenus mais pressions"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal le seed de structure a déjà créé les quiz ; ce bloc ne
--     fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12419999-0000-4000-8000-000000000001'::uuid, 'La Méditerranée antique'),
  ('12419999-0000-4000-8000-000000000002'::uuid, 'La Méditerranée médiévale'),
  ('12419999-0000-4000-8000-000000000003'::uuid, 'L''ouverture atlantique (XVe-XVIe)'),
  ('12419999-0000-4000-8000-000000000004'::uuid, 'Sociétés et environnements'),
  ('12419999-0000-4000-8000-000000000005'::uuid, 'Des mobilités généralisées')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
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
  -- Chapitre 1 — La Méditerranée antique
  ('12410000-0000-4000-8000-000000000104'::uuid, 'La Méditerranée antique',
   'Quelle cité grecque invente la démocratie au Ve siècle av. J.-C. ?', 'mcq',
   '["Athènes", "Sparte", "Rome", "Carthage"]', 0,
   'C''est à Athènes, notamment sous Périclès, que naît la démocratie au Ve siècle av. J.-C.', 4),
  ('12410000-0000-4000-8000-000000000105'::uuid, 'La Méditerranée antique',
   'Dans la démocratie athénienne, les femmes et les esclaves étaient citoyens.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : femmes, métèques (étrangers) et esclaves étaient exclus de la citoyenneté.', 5),
  ('12410000-0000-4000-8000-000000000106'::uuid, 'La Méditerranée antique',
   'Qui devient le premier empereur romain en 27 av. J.-C. ?', 'mcq',
   '["Auguste", "Jules César", "Néron", "Périclès"]', 0,
   'Auguste devient le premier empereur en 27 av. J.-C., marquant le début de l''Empire romain.', 6),
  ('12410000-0000-4000-8000-000000000107'::uuid, 'La Méditerranée antique',
   'Que fait l''édit de Caracalla en 212 apr. J.-C. ?', 'mcq',
   '["Il accorde la citoyenneté à tous les hommes libres de l''Empire", "Il interdit le christianisme", "Il fonde Rome", "Il crée la démocratie"]', 0,
   'En 212, l''édit de Caracalla étend la citoyenneté romaine à tous les hommes libres de l''Empire.', 7),
  ('12410000-0000-4000-8000-000000000108'::uuid, 'La Méditerranée antique',
   'Comment les Romains appelaient-ils la mer Méditerranée ?', 'mcq',
   '["Mare Nostrum", "Pax Romana", "Mare Balticum", "Oceanus"]', 0,
   'Les Romains l''appelaient Mare Nostrum, « notre mer », car ils la dominaient entièrement.', 8),
  ('12410000-0000-4000-8000-000000000109'::uuid, 'La Méditerranée antique',
   'Le latin, langue de Rome, est à l''origine du français.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le français est une langue romane, issue du latin parlé dans l''Empire romain.', 9),
  ('12410000-0000-4000-8000-000000000110'::uuid, 'La Méditerranée antique',
   'À Athènes, où les citoyens se réunissaient-ils pour voter les lois ?', 'mcq',
   '["À l''ecclésia (l''assemblée)", "Au Sénat", "Au Colisée", "À l''agora de Rome"]', 0,
   'Les citoyens athéniens votaient à l''ecclésia, l''assemblée du peuple.', 10),

  -- Chapitre 2 — La Méditerranée médiévale
  ('12410000-0000-4000-8000-000000000204'::uuid, 'La Méditerranée médiévale',
   'Quelles sont les trois civilisations qui bordent la Méditerranée médiévale ?', 'mcq',
   '["Chrétienté latine, Empire byzantin, monde musulman", "Grecs, Romains, Égyptiens", "Francs, Vikings, Ottomans", "Espagnols, Italiens, Turcs"]', 0,
   'La Méditerranée médiévale est partagée entre la chrétienté latine, l''Empire byzantin et le monde musulman.', 4),
  ('12410000-0000-4000-8000-000000000205'::uuid, 'La Méditerranée médiévale',
   'Quelle est la capitale de l''Empire byzantin ?', 'mcq',
   '["Constantinople", "Rome", "Cordoue", "Jérusalem"]', 0,
   'Constantinople est la capitale de l''Empire byzantin, chrétien d''Orient.', 5),
  ('12410000-0000-4000-8000-000000000206'::uuid, 'La Méditerranée médiévale',
   'En quelle année commence la première croisade ?', 'mcq',
   '["1095", "1492", "800", "1204"]', 0,
   'La première croisade est lancée en 1095, à l''appel du pape, pour reprendre Jérusalem.', 6),
  ('12410000-0000-4000-8000-000000000207'::uuid, 'La Méditerranée médiévale',
   'L''islam est une religion née au VIIe siècle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : l''islam naît au VIIe siècle et s''étend rapidement autour de la Méditerranée.', 7),
  ('12410000-0000-4000-8000-000000000208'::uuid, 'La Méditerranée médiévale',
   'Comment appelle-t-on la reconquête de l''Espagne par les royaumes chrétiens ?', 'mcq',
   '["La Reconquista", "La croisade", "La Renaissance", "La Réforme"]', 0,
   'La Reconquista est la reconquête progressive de l''Espagne musulmane par les royaumes chrétiens.', 8),
  ('12410000-0000-4000-8000-000000000209'::uuid, 'La Méditerranée médiévale',
   'Quelles villes marchandes italiennes reliaient l''Orient et l''Occident ?', 'mcq',
   '["Venise et Gênes", "Paris et Londres", "Cordoue et Tolède", "Athènes et Sparte"]', 0,
   'Venise et Gênes étaient de grandes villes marchandes reliant l''Orient à l''Occident.', 9),
  ('12410000-0000-4000-8000-000000000210'::uuid, 'La Méditerranée médiévale',
   'Dans l''Espagne musulmane (Al-Andalus), des savants ont traduit les textes grecs antiques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : à Cordoue ou Tolède, on traduisait et enrichissait les textes grecs, transmis ensuite à l''Occident.', 10),

  -- Chapitre 3 — L'ouverture atlantique (XVe-XVIe)
  ('12410000-0000-4000-8000-000000000304'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'En quelle année Christophe Colomb atteint-il l''Amérique ?', 'mcq',
   '["1492", "1515", "1453", "1519"]', 0,
   'En 1492, Christophe Colomb, au service de l''Espagne, atteint l''Amérique.', 4),
  ('12410000-0000-4000-8000-000000000305'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Quelle expédition réalise le premier tour du monde (1519-1522) ?', 'mcq',
   '["Celle de Magellan", "Celle de Colomb", "Celle de Vasco de Gama", "Celle de Cortés"]', 0,
   'L''expédition de Magellan réalise le premier tour du monde entre 1519 et 1522.', 5),
  ('12410000-0000-4000-8000-000000000306'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Quel conquistador détruit l''empire aztèque ?', 'mcq',
   '["Cortés", "Pizarro", "Magellan", "Vasco de Gama"]', 0,
   'Hernán Cortés détruit l''empire aztèque au Mexique ; Pizarro s''attaque à l''empire inca.', 6),
  ('12410000-0000-4000-8000-000000000307'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Qui a inventé l''imprimerie en Europe vers 1450 ?', 'mcq',
   '["Gutenberg", "Luther", "Léonard de Vinci", "Colomb"]', 0,
   'Gutenberg met au point l''imprimerie vers 1450, ce qui diffuse largement les livres et les idées.', 7),
  ('12410000-0000-4000-8000-000000000308'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Le mouvement de renouveau des arts et du savoir au XVIe siècle s''appelle la Renaissance.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la Renaissance est le grand renouveau artistique et intellectuel, porté par l''humanisme.', 8),
  ('12410000-0000-4000-8000-000000000309'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Qui lance la Réforme protestante en 1517 ?', 'mcq',
   '["Martin Luther", "Le pape", "Christophe Colomb", "Charles Quint"]', 0,
   'En 1517, Martin Luther critique l''Église catholique : c''est le début de la Réforme protestante.', 9),
  ('12410000-0000-4000-8000-000000000310'::uuid, 'L''ouverture atlantique (XVe-XVIe)',
   'Après la Réforme, la chrétienté d''Occident se divise entre catholiques et protestants.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la Réforme divise les chrétiens d''Occident entre catholiques et protestants.', 10),

  -- Chapitre 4 — Sociétés et environnements
  ('12410000-0000-4000-8000-000000000404'::uuid, 'Sociétés et environnements',
   'Parmi ces ressources, laquelle est NON renouvelable ?', 'mcq',
   '["Le pétrole", "Le vent", "Le soleil", "La force de l''eau"]', 0,
   'Le pétrole est une ressource non renouvelable : son stock s''épuise. Vent, soleil et eau sont renouvelables.', 4),
  ('12410000-0000-4000-8000-000000000405'::uuid, 'Sociétés et environnements',
   'Comment définit-on un risque en géographie ?', 'mcq',
   '["Un aléa combiné à des enjeux", "Une ressource rare", "Une pollution", "Une catastrophe passée"]', 0,
   'Un risque est la rencontre entre un aléa (phénomène possible) et des enjeux (populations, biens exposés).', 5),
  ('12410000-0000-4000-8000-000000000406'::uuid, 'Sociétés et environnements',
   'Un séisme ou une inondation sont des risques technologiques.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : séismes et inondations sont des risques naturels ; les risques technologiques sont industriels ou nucléaires.', 6),
  ('12410000-0000-4000-8000-000000000407'::uuid, 'Sociétés et environnements',
   'En quelle année le développement durable a-t-il été défini (rapport Brundtland) ?', 'mcq',
   '["1987", "1945", "2015", "1900"]', 0,
   'Le développement durable est défini en 1987 dans le rapport Brundtland.', 7),
  ('12410000-0000-4000-8000-000000000408'::uuid, 'Sociétés et environnements',
   'Quels sont les trois piliers du développement durable ?', 'mcq',
   '["Économie, social, environnement", "Air, eau, terre", "Passé, présent, futur", "Ville, campagne, mer"]', 0,
   'Le développement durable combine trois piliers : l''économie, le social et l''environnement.', 8),
  ('12410000-0000-4000-8000-000000000409'::uuid, 'Sociétés et environnements',
   'Comment nomme-t-on l''époque où l''activité humaine bouleverse la planète ?', 'mcq',
   '["L''anthropocène", "La Renaissance", "L''Antiquité", "La mondialisation"]', 0,
   'L''anthropocène désigne l''époque marquée par l''impact majeur des activités humaines sur la Terre.', 9),
  ('12410000-0000-4000-8000-000000000410'::uuid, 'Sociétés et environnements',
   'Le développement durable veut répondre aux besoins du présent sans compromettre ceux des générations futures.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : c''est exactement la définition du développement durable donnée en 1987.', 10),

  -- Chapitre 5 — Des mobilités généralisées
  ('12410000-0000-4000-8000-000000000504'::uuid, 'Des mobilités généralisées',
   'Qu''est-ce qu''un migrant international ?', 'mcq',
   '["Une personne qui s''installe durablement dans un autre pays", "Un touriste en vacances", "Un habitant d''une grande ville", "Un travailleur saisonnier local"]', 0,
   'Un migrant international s''installe durablement dans un pays différent de celui où il est né.', 4),
  ('12410000-0000-4000-8000-000000000505'::uuid, 'Des mobilités généralisées',
   'Combien y a-t-il environ de migrants internationaux dans le monde ?', 'mcq',
   '["Environ 280 millions", "Environ 10 millions", "Environ 2 milliards", "Environ 500 000"]', 0,
   'On compte environ 280 millions de migrants internationaux dans le monde.', 5),
  ('12410000-0000-4000-8000-000000000506'::uuid, 'Des mobilités généralisées',
   'Une personne qui fuit une guerre ou une persécution est un réfugié.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : un réfugié migre pour des raisons politiques, fuyant une guerre ou une persécution.', 6),
  ('12410000-0000-4000-8000-000000000507'::uuid, 'Des mobilités généralisées',
   'Vers quels pays se dirigent souvent les flux migratoires ?', 'mcq',
   '["Vers les pays du Nord, plus riches", "Vers les déserts", "Toujours vers les pays les plus pauvres", "Uniquement à l''intérieur d''un même pays"]', 0,
   'Les flux migratoires vont souvent des pays du Sud vers les pays du Nord, plus riches.', 7),
  ('12410000-0000-4000-8000-000000000508'::uuid, 'Des mobilités généralisées',
   'Quelle est aujourd''hui la mobilité la plus massive dans le monde ?', 'mcq',
   '["Le tourisme", "Les migrations de réfugiés", "Les trajets domicile-travail", "Les pèlerinages"]', 0,
   'Le tourisme est la mobilité la plus massive : plus d''un milliard de touristes internationaux par an.', 8),
  ('12410000-0000-4000-8000-000000000509'::uuid, 'Des mobilités généralisées',
   'La France est l''un des pays les plus visités au monde.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la France figure parmi les toutes premières destinations touristiques mondiales.', 9),
  ('12410000-0000-4000-8000-000000000510'::uuid, 'Des mobilités généralisées',
   'Quel est un effet négatif possible du tourisme de masse ?', 'mcq',
   '["La dégradation des sites et des milieux", "La disparition des transports", "La fin des migrations", "La baisse de la population mondiale"]', 0,
   'Le tourisme de masse apporte des revenus mais peut dégrader les sites par surfréquentation et pollution.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
