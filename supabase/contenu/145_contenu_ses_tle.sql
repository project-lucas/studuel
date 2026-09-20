-- =============================================================================
-- Studuel — Migration 145 : CONTENU SES Tle (+ exercices type bac)
-- Remplit les 4 chapitres de SES Terminale (spécialité, programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac (épreuve composée / raisonnement sur
--                       document) corrigés par chapitre.
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
    ('Croissance et environnement', $md$# Croissance et environnement

## Ce que tu vas comprendre
La **croissance économique** désigne l'augmentation durable de la production d'un pays. Ce chapitre montre d'où elle vient, ce qu'elle apporte, et pourquoi elle se heurte aujourd'hui à des **limites écologiques**.

## 1. Mesurer la croissance : le PIB
La croissance se mesure par la variation du **PIB** (Produit Intérieur Brut), qui additionne les **valeurs ajoutées** produites sur un territoire pendant un an. On parle de croissance quand le **PIB réel** (corrigé de l'inflation) augmente d'une année sur l'autre.

> **Limites du PIB :** il ignore le travail domestique, le bénévolat, les inégalités et les **dégradations environnementales**. Un PIB qui augmente n'implique donc pas forcément un progrès du bien-être.

## 2. Les facteurs de la croissance
On distingue deux grandes sources de croissance :
- la hausse des **facteurs de production** : plus de **travail** (population active, heures) et plus de **capital** (machines, équipements) ;
- l'amélioration de leur **efficacité**, mesurée par la **productivité globale des facteurs (PGF)**.

## 3. Le progrès technique, moteur central
La croissance de long terme repose surtout sur le **progrès technique**, qui augmente la PGF. Selon Schumpeter, l'**innovation** (le rôle de l'entrepreneur) provoque une **destruction créatrice** : les nouvelles activités remplacent les anciennes.

Le progrès technique est **endogène** : il est produit par l'économie elle-même via l'**investissement** dans la recherche, l'éducation (capital humain) et les infrastructures. Ces investissements ont des **externalités positives**, ce qui justifie l'intervention publique (brevets, subventions à la R&D).

## 4. Croissance et environnement
La croissance mobilise des **ressources naturelles** (énergies fossiles, matières premières) et produit des **pollutions**. On distingue plusieurs formes de **capital** à préserver : capital physique, humain, naturel et institutionnel.

Le **développement durable** vise à répondre aux besoins présents **sans compromettre** ceux des générations futures. La question centrale est la **soutenabilité** : peut-on remplacer le capital naturel détruit par du capital produit (soutenabilité **faible**) ou certains éléments naturels sont-ils **irremplaçables** (soutenabilité **forte**) ?

## 5. Les limites écologiques
La croissance se heurte à des **limites planétaires** : réchauffement climatique, épuisement des ressources, effondrement de la biodiversité. Plusieurs instruments visent à réorienter les comportements :
- la **réglementation** (normes, interdictions) ;
- la **taxation** (taxe carbone, principe pollueur-payeur) ;
- les **marchés de quotas d'émission** (droits à polluer échangeables).

Le progrès technique est ambivalent : il peut aggraver les dégâts, mais aussi porter la **transition écologique** (énergies renouvelables, efficacité énergétique).

## L'essentiel à retenir
- La croissance se mesure par la hausse du **PIB réel**, indicateur utile mais **incomplet**.
- Ses facteurs : travail, capital et surtout la **productivité globale des facteurs**.
- Le **progrès technique** (innovation, destruction créatrice) est le moteur de la croissance de long terme.
- Le **développement durable** cherche à concilier croissance et préservation du **capital naturel** (réglementation, taxes, marchés de quotas).$md$),

    ('Le commerce international', $md$# Le commerce international

## Ce que tu vas comprendre
Le **commerce international** désigne les échanges de biens et services entre les pays. Ce chapitre explique pourquoi les nations échangent, quels sont les gains et les risques du **libre-échange**, et le rôle des **firmes multinationales**.

## 1. Pourquoi les pays échangent-ils ?
Deux théories fondent l'intérêt du commerce :
- l'**avantage absolu** (Adam Smith) : un pays exporte ce qu'il produit à moindre coût que les autres ;
- l'**avantage comparatif** (David Ricardo) : même un pays désavantagé partout a intérêt à se **spécialiser** dans le domaine où son désavantage est le **plus faible**, et à importer le reste.

*Exemple : chaque pays se concentre sur la production où il est relativement le plus efficace ; l'échange augmente alors la production mondiale totale.*

## 2. Les fondements des échanges aujourd'hui
Les échanges ne s'expliquent pas seulement par les coûts :
- la **dotation en facteurs** (théorème HOS) : un pays exporte les biens qui utilisent le facteur dont il est le mieux doté (travail, capital, ressources) ;
- la **différenciation des produits** explique le **commerce intra-branche** (la France exporte et importe des voitures) ;
- les **économies d'échelle** : produire en grande quantité réduit le coût unitaire.

## 3. La mondialisation et les chaînes de valeur
La **mondialisation** est l'intégration croissante des économies. La production est aujourd'hui fragmentée en **chaînes de valeur mondiales** : chaque étape (conception, fabrication, assemblage) est réalisée là où elle est la plus rentable. Cela intensifie le **commerce de biens intermédiaires**.

## 4. Libre-échange ou protectionnisme ?
Le **libre-échange** (suppression des barrières) élargit les débouchés, fait baisser les prix et diffuse le progrès technique. Mais il crée aussi des **perdants** : secteurs et emplois mis en concurrence avec des pays à bas coûts.

Le **protectionnisme** protège la production nationale par des **droits de douane**, des **quotas** ou des **normes**. Il peut défendre une **industrie naissante** ou des emplois, mais risque de provoquer des **représailles** et de renchérir les prix. L'**OMC** encadre ces règles pour limiter les conflits commerciaux.

## 5. Les firmes multinationales (FMN)
Une **firme multinationale** implante des filiales dans plusieurs pays. Elle recherche des **coûts plus bas**, de **nouveaux marchés** ou des **compétences** locales, via des **investissements directs à l'étranger (IDE)**. Les FMN organisent les chaînes de valeur mondiales et pèsent fortement sur les échanges et l'emploi.

## L'essentiel à retenir
- L'**avantage comparatif** (Ricardo) justifie la **spécialisation** et l'échange, même pour un pays désavantagé partout.
- Les échanges reposent aussi sur la **dotation en facteurs**, la **différenciation** et les **économies d'échelle**.
- Le **libre-échange** apporte des gains globaux mais fait des **perdants** ; le **protectionnisme** protège mais expose aux **représailles**.
- Les **FMN** structurent la mondialisation via les **IDE** et les **chaînes de valeur mondiales**.$md$),

    ('Les mutations du travail', $md$# Les mutations du travail

## Ce que tu vas comprendre
Le **travail** n'est pas seulement une source de revenu : c'est aussi un facteur d'**intégration sociale**. Ce chapitre étudie comment son organisation, l'**emploi** et le **chômage** se transforment.

## 1. L'organisation du travail
Plusieurs modèles se sont succédé :
- le **taylorisme** : division du travail, séparation entre conception et exécution, chronométrage des tâches ;
- le **fordisme** : travail à la chaîne, standardisation, hausse des salaires pour soutenir la consommation de masse ;
- le **toyotisme** (post-fordisme) : flexibilité, production en flux tendu, **polyvalence** et implication des salariés.

Aujourd'hui, on cherche à réduire la **parcellisation** des tâches et à valoriser l'**autonomie**.

## 2. Qualification et compétences
La **qualification** désigne l'ensemble des savoirs et savoir-faire d'un travailleur (par le diplôme et l'expérience). Le progrès technique déforme la demande de travail : il tend à **remplacer** les emplois peu qualifiés et **routiniers** et à **valoriser** les emplois qualifiés — c'est la **polarisation** de l'emploi.

## 3. Le chômage : mesure et formes
Un **chômeur** (au sens du BIT) est une personne sans emploi, **disponible** et qui en **recherche activement** un. On distingue :
- le chômage **conjoncturel** : lié au ralentissement de l'activité (baisse de la demande) ;
- le chômage **structurel** : lié au fonctionnement du marché du travail (inadéquation des qualifications, coût du travail, rigidités).

## 4. Les explications du chômage
- Côté **demande de travail** : un coût du travail jugé trop élevé (au regard de la productivité) peut freiner l'embauche.
- Côté **appariement** : le chômage **frictionnel** vient du temps nécessaire pour faire correspondre offres et demandes d'emploi.
- Les **asymétries d'information** et les **institutions** (salaire minimum, indemnisation) influencent aussi le niveau du chômage.

Les politiques de l'emploi agissent soit sur la **demande de travail** (baisse des cotisations, aides à l'embauche), soit sur l'**employabilité** (formation, accompagnement).

## 5. Les nouvelles formes d'emploi
L'emploi se **diversifie** et se **précarise** en partie : hausse des CDD, de l'intérim, du **temps partiel** et de l'**auto-entrepreneuriat**. Le numérique fait émerger le **télétravail** et les **plateformes**, qui offrent de la souplesse mais brouillent la frontière entre travail salarié et indépendant et posent des questions de **protection sociale**.

## L'essentiel à retenir
- L'organisation du travail a évolué du **taylorisme/fordisme** vers le **post-fordisme** (flexibilité, polyvalence).
- Le progrès technique favorise la **polarisation** : il valorise les emplois **qualifiés** et menace les tâches routinières.
- Le chômage est **conjoncturel** (demande) ou **structurel** (fonctionnement du marché du travail).
- L'emploi se transforme : **précarisation**, **télétravail** et **plateformes** interrogent la protection sociale.$md$),

    ('La justice sociale', $md$# La justice sociale

## Ce que tu vas comprendre
La **justice sociale** interroge la répartition des richesses et des chances dans une société. Ce chapitre distingue les formes d'**égalité**, présente les outils de **redistribution** et le rôle de l'**État-providence**.

## 1. Égalité et équité
Plusieurs conceptions coexistent :
- l'**égalité des droits** : les mêmes règles pour tous (droit de vote, égalité devant la loi) ;
- l'**égalité des chances** : donner à chacun les mêmes possibilités de réussite, quelle que soit son origine ;
- l'**égalité des situations** : réduire les écarts de revenus et de conditions de vie.

L'**équité** consiste à traiter différemment des situations différentes pour rétablir une forme de justice. Selon Rawls, des inégalités sont acceptables si elles profitent aux plus **défavorisés** (principe de différence).

## 2. Mesurer les inégalités
Les inégalités sont **multiformes** : de revenus, de patrimoine, mais aussi d'accès à l'éducation, à la santé ou au logement. On les mesure avec des outils comme les **déciles**, le **rapport interdécile** ou le **coefficient de Gini** (0 = égalité parfaite, 1 = inégalité maximale). Ces inégalités peuvent se **cumuler** et se **reproduire** d'une génération à l'autre.

## 3. La redistribution
L'action publique corrige la répartition primaire des revenus par la **redistribution** :
- la redistribution **verticale** transfère des plus aisés vers les plus modestes (impôt progressif, minima sociaux) ;
- la redistribution **horizontale** couvre des risques communs (maladie, chômage, retraite), quelle que soit la richesse.

Les outils sont les **prélèvements obligatoires** (impôts, cotisations) et les **prestations** (monétaires ou en nature, comme l'école et la santé publiques).

## 4. L'État-providence
L'**État-providence** est l'ensemble des interventions de l'État pour assurer la **protection sociale**. Il repose sur deux logiques : l'**assurance** (cotisations, droits liés au travail — logique bismarckienne) et l'**assistance** (solidarité financée par l'impôt — logique beveridgienne).

> **Limites :** l'État-providence est critiqué pour son **coût**, ses possibles effets **désincitatifs** (trappes à inactivité) et ses difficultés de **financement** face au vieillissement.

## 5. Discriminations et action publique
Une **discrimination** est un traitement défavorable fondé sur un critère prohibé (origine, sexe, âge, handicap). Elle est illégale et source d'inégalités. Pour la combattre, l'action publique combine **lutte contre les discriminations**, **politiques de redistribution** et **discrimination positive** (mesures ciblées en faveur de groupes défavorisés). Ces politiques peuvent entrer en tension avec l'**égalité de traitement** et l'efficacité économique.

## L'essentiel à retenir
- On distingue l'égalité des **droits**, des **chances** et des **situations** ; l'**équité** traite différemment des situations différentes.
- Les inégalités sont **multiformes** et se mesurent (déciles, **coefficient de Gini**).
- La **redistribution** (verticale et horizontale) s'appuie sur les **prélèvements** et les **prestations**.
- L'**État-providence** articule **assurance** et **assistance**, mais fait face à des limites de coût et de financement.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'ses'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Croissance et environnement', $json${
      "centre": "Croissance et environnement",
      "branches": [
        { "titre": "Mesurer : le PIB", "enfants": ["Somme des valeurs ajoutées", "PIB réel = hors inflation", "Ignore inégalités et environnement"] },
        { "titre": "Facteurs de croissance", "enfants": ["Travail et capital", "Productivité globale des facteurs", "Investissement et capital humain"] },
        { "titre": "Progrès technique", "enfants": ["Innovation (Schumpeter)", "Destruction créatrice", "Endogène : R&D, éducation"] },
        { "titre": "Environnement", "enfants": ["Développement durable", "Capital naturel à préserver", "Taxe carbone, quotas, normes"] }
      ]
    }$json$),
    ('Le commerce international', $json${
      "centre": "Le commerce international",
      "branches": [
        { "titre": "Pourquoi échanger ?", "enfants": ["Avantage absolu (Smith)", "Avantage comparatif (Ricardo)", "Se spécialiser puis échanger"] },
        { "titre": "Autres fondements", "enfants": ["Dotation en facteurs (HOS)", "Commerce intra-branche", "Économies d'échelle"] },
        { "titre": "Libre-échange / protectionnisme", "enfants": ["Gains globaux mais des perdants", "Droits de douane, quotas", "OMC encadre les règles"] },
        { "titre": "Mondialisation et FMN", "enfants": ["Chaînes de valeur mondiales", "IDE des multinationales", "Recherche de coûts et marchés"] }
      ]
    }$json$),
    ('Les mutations du travail', $json${
      "centre": "Les mutations du travail",
      "branches": [
        { "titre": "Organisation du travail", "enfants": ["Taylorisme et fordisme", "Toyotisme : flux tendu", "Flexibilité et polyvalence"] },
        { "titre": "Qualification", "enfants": ["Savoirs et savoir-faire", "Diplôme et expérience", "Polarisation de l'emploi"] },
        { "titre": "Chômage", "enfants": ["Chômeur au sens du BIT", "Conjoncturel (demande)", "Structurel (marché du travail)"] },
        { "titre": "Nouvelles formes", "enfants": ["Précarisation, temps partiel", "Télétravail", "Plateformes numériques"] }
      ]
    }$json$),
    ('La justice sociale', $json${
      "centre": "La justice sociale",
      "branches": [
        { "titre": "Égalité et équité", "enfants": ["Droits, chances, situations", "Équité : traiter différemment", "Rawls : principe de différence"] },
        { "titre": "Mesurer les inégalités", "enfants": ["Inégalités multiformes", "Déciles, rapport interdécile", "Coefficient de Gini"] },
        { "titre": "Redistribution", "enfants": ["Verticale (aisés → modestes)", "Horizontale (risques communs)", "Prélèvements et prestations"] },
        { "titre": "État-providence", "enfants": ["Assurance (cotisations)", "Assistance (impôt)", "Limites : coût, financement"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'ses'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Tle ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SES', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14519999-0000-4000-8000-000000000001'::uuid, 'Croissance et environnement'),
  ('14519999-0000-4000-8000-000000000002'::uuid, 'Le commerce international'),
  ('14519999-0000-4000-8000-000000000003'::uuid, 'Les mutations du travail'),
  ('14519999-0000-4000-8000-000000000004'::uuid, 'La justice sociale')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'ses'
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
  -- Chapitre 1 — Croissance et environnement
  ('14510000-0000-4000-8000-000000000104'::uuid, 'Croissance et environnement',
   'Que mesure principalement le PIB d''un pays ?', 'mcq',
   '["La somme des valeurs ajoutées produites", "Le bonheur des habitants", "Le montant des salaires uniquement", "La richesse des ménages les plus aisés"]', 0,
   'Le PIB additionne les valeurs ajoutées créées sur le territoire pendant un an.', 4),
  ('14510000-0000-4000-8000-000000000105'::uuid, 'Croissance et environnement',
   'Le PIB mesure parfaitement le bien-être et prend en compte les dégradations de l''environnement.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le PIB ignore le travail domestique, les inégalités et les dommages environnementaux.', 5),
  ('14510000-0000-4000-8000-000000000106'::uuid, 'Croissance et environnement',
   'Quel économiste associe l''innovation à la « destruction créatrice » ?', 'mcq',
   '["Schumpeter", "Ricardo", "Keynes", "Malthus"]', 0,
   'Schumpeter décrit la destruction créatrice : les innovations remplacent les activités anciennes.', 6),
  ('14510000-0000-4000-8000-000000000107'::uuid, 'Croissance et environnement',
   'Qu''appelle-t-on la productivité globale des facteurs (PGF) ?', 'mcq',
   '["L''efficacité avec laquelle on combine travail et capital", "Le nombre total de salariés", "Le montant du capital investi", "Le prix des matières premières"]', 0,
   'La PGF mesure l''efficacité de la combinaison des facteurs ; sa hausse reflète le progrès technique.', 7),
  ('14510000-0000-4000-8000-000000000108'::uuid, 'Croissance et environnement',
   'Le développement durable vise à répondre aux besoins présents sans compromettre ceux des générations futures.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la définition même du développement durable (rapport Brundtland).', 8),
  ('14510000-0000-4000-8000-000000000109'::uuid, 'Croissance et environnement',
   'Quel instrument applique le principe « pollueur-payeur » ?', 'mcq',
   '["La taxe carbone", "La baisse des impôts", "La hausse du PIB", "La suppression des normes"]', 0,
   'La taxe carbone fait payer les émissions de CO2, selon le principe pollueur-payeur.', 9),
  ('14510000-0000-4000-8000-000000000110'::uuid, 'Croissance et environnement',
   'Dans la soutenabilité forte, le capital naturel peut être entièrement remplacé par du capital produit.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la soutenabilité forte considère que certains éléments naturels sont irremplaçables.', 10),

  -- Chapitre 2 — Le commerce international
  ('14510000-0000-4000-8000-000000000204'::uuid, 'Le commerce international',
   'Quel économiste a formulé la théorie de l''avantage comparatif ?', 'mcq',
   '["David Ricardo", "Adam Smith", "Karl Marx", "John M. Keynes"]', 0,
   'David Ricardo a montré l''intérêt de se spécialiser selon son avantage comparatif.', 4),
  ('14510000-0000-4000-8000-000000000205'::uuid, 'Le commerce international',
   'Selon l''avantage comparatif, un pays désavantagé partout n''a aucun intérêt à commercer.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il a intérêt à se spécialiser là où son désavantage est le plus faible.', 5),
  ('14510000-0000-4000-8000-000000000206'::uuid, 'Le commerce international',
   'Qu''est-ce qu''un droit de douane ?', 'mcq',
   '["Une taxe sur les produits importés", "Une aide aux exportations", "Un salaire minimum mondial", "Une subvention à la recherche"]', 0,
   'Le droit de douane est une taxe protectionniste qui renchérit les importations.', 6),
  ('14510000-0000-4000-8000-000000000207'::uuid, 'Le commerce international',
   'Le commerce intra-branche s''explique surtout par : ', 'mcq',
   '["La différenciation des produits", "L''absence de concurrence", "Le protectionnisme", "La rareté des ressources"]', 0,
   'La différenciation permet à un pays d''exporter et d''importer des produits d''une même branche (ex. automobile).', 7),
  ('14510000-0000-4000-8000-000000000208'::uuid, 'Le commerce international',
   'Que signifie le sigle IDE en économie internationale ?', 'mcq',
   '["Investissement direct à l''étranger", "Indice des échanges", "Impôt sur la demande extérieure", "Indicateur de développement économique"]', 0,
   'Un IDE est un investissement d''une firme pour créer ou racheter une filiale à l''étranger.', 8),
  ('14510000-0000-4000-8000-000000000209'::uuid, 'Le commerce international',
   'Le libre-échange profite à tout le monde sans créer aucun perdant.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il apporte des gains globaux mais met en difficulté certains secteurs et emplois.', 9),
  ('14510000-0000-4000-8000-000000000210'::uuid, 'Le commerce international',
   'Quelle organisation encadre les règles du commerce mondial ?', 'mcq',
   '["L''OMC", "L''OTAN", "Le FMI seul", "L''OMS"]', 0,
   'L''Organisation mondiale du commerce (OMC) fixe les règles et arbitre les conflits commerciaux.', 10),

  -- Chapitre 3 — Les mutations du travail
  ('14510000-0000-4000-8000-000000000304'::uuid, 'Les mutations du travail',
   'Quelle organisation du travail repose sur le travail à la chaîne et la standardisation ?', 'mcq',
   '["Le fordisme", "Le toyotisme", "Le télétravail", "L''artisanat"]', 0,
   'Le fordisme combine travail à la chaîne, standardisation et hausse des salaires.', 4),
  ('14510000-0000-4000-8000-000000000305'::uuid, 'Les mutations du travail',
   'Au sens du BIT, un chômeur est une personne sans emploi, disponible et qui en recherche activement un.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la définition du chômage au sens du Bureau international du travail.', 5),
  ('14510000-0000-4000-8000-000000000306'::uuid, 'Les mutations du travail',
   'Le chômage lié à un ralentissement de l''activité économique est dit : ', 'mcq',
   '["Conjoncturel", "Structurel", "Frictionnel volontaire", "Naturel"]', 0,
   'Le chômage conjoncturel provient d''une baisse de la demande et de l''activité.', 6),
  ('14510000-0000-4000-8000-000000000307'::uuid, 'Les mutations du travail',
   'La polarisation de l''emploi désigne : ', 'mcq',
   '["La valorisation des emplois qualifiés et le recul des tâches routinières", "La hausse générale de tous les salaires", "La disparition du chômage", "La fin du travail salarié"]', 0,
   'Le progrès technique valorise les emplois qualifiés et menace les tâches routinières intermédiaires.', 7),
  ('14510000-0000-4000-8000-000000000308'::uuid, 'Les mutations du travail',
   'La qualification d''un travailleur dépend uniquement de son diplôme.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : elle dépend aussi de l''expérience et des savoir-faire acquis.', 8),
  ('14510000-0000-4000-8000-000000000309'::uuid, 'Les mutations du travail',
   'Le toyotisme se caractérise notamment par : ', 'mcq',
   '["La flexibilité et la production en flux tendu", "Le chronométrage strict et rigide", "L''absence totale d''organisation", "La suppression des machines"]', 0,
   'Le toyotisme (post-fordisme) mise sur la flexibilité, le flux tendu et la polyvalence.', 9),
  ('14510000-0000-4000-8000-000000000310'::uuid, 'Les mutations du travail',
   'Le développement des plateformes numériques brouille la frontière entre salariat et travail indépendant.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les plateformes créent des statuts hybrides qui posent des questions de protection sociale.', 10),

  -- Chapitre 4 — La justice sociale
  ('14510000-0000-4000-8000-000000000404'::uuid, 'La justice sociale',
   'Donner à chacun les mêmes possibilités de réussite, quelle que soit son origine, correspond à : ', 'mcq',
   '["L''égalité des chances", "L''égalité des droits", "L''égalité des situations", "La discrimination positive"]', 0,
   'L''égalité des chances vise à offrir les mêmes possibilités de départ à chacun.', 4),
  ('14510000-0000-4000-8000-000000000405'::uuid, 'La justice sociale',
   'Le coefficient de Gini vaut 0 en cas d''égalité parfaite et 1 en cas d''inégalité maximale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Plus le coefficient de Gini est proche de 1, plus les inégalités sont fortes.', 5),
  ('14510000-0000-4000-8000-000000000406'::uuid, 'La justice sociale',
   'La redistribution verticale consiste à : ', 'mcq',
   '["Transférer des revenus des plus aisés vers les plus modestes", "Couvrir les mêmes risques pour tous", "Supprimer tous les impôts", "Augmenter les inégalités"]', 0,
   'La redistribution verticale réduit les écarts de revenus (impôt progressif, minima sociaux).', 6),
  ('14510000-0000-4000-8000-000000000407'::uuid, 'La justice sociale',
   'Selon Rawls, des inégalités sont acceptables si elles profitent aux plus défavorisés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le principe de différence de John Rawls.', 7),
  ('14510000-0000-4000-8000-000000000408'::uuid, 'La justice sociale',
   'La logique d''assurance de l''État-providence repose surtout sur : ', 'mcq',
   '["Les cotisations liées au travail", "L''impôt sur la fortune uniquement", "Les dons privés", "La suppression des prestations"]', 0,
   'La logique bismarckienne (assurance) ouvre des droits en échange de cotisations.', 8),
  ('14510000-0000-4000-8000-000000000409'::uuid, 'La justice sociale',
   'Une discrimination est un traitement défavorable fondé sur un critère prohibé (origine, sexe, âge...).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La discrimination est illégale et constitue une source d''inégalités.', 9),
  ('14510000-0000-4000-8000-000000000410'::uuid, 'La justice sociale',
   'La redistribution horizontale consiste à : ', 'mcq',
   '["Couvrir des risques communs (maladie, chômage, retraite)", "Transférer des riches vers les pauvres", "Réduire les impôts des plus aisés", "Interdire toute prestation sociale"]', 0,
   'La redistribution horizontale mutualise les risques, quelle que soit la richesse.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'ses'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac (épreuve composée / raisonnement sur document) par
--    chapitre, corrigés.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Croissance et environnement', $md$# Exercices types — Croissance et environnement

## Exercice 1 — Question de l'épreuve composée (mobilisation des connaissances)
« Montrez que le progrès technique est source de croissance économique. » (raisonnement structuré, sans document)

### Correction
On attend une réponse organisée en deux temps.
- **Le progrès technique augmente la productivité globale des facteurs.** À quantités de travail et de capital données, l'innovation permet de produire davantage : elle est la source principale de la croissance de long terme, au-delà de la simple accumulation de facteurs.
- **Le progrès technique est endogène et se diffuse.** Il résulte des investissements en R&D, en éducation (capital humain) et en infrastructures, qui ont des externalités positives. Par la destruction créatrice (Schumpeter), les innovations remplacent les activités anciennes et créent de nouveaux marchés, soutenant durablement la croissance.
Conclusion : le progrès technique explique l'essentiel de la croissance non attribuable à la hausse des facteurs.

## Exercice 2 — Raisonnement s'appuyant sur un document
Un document (graphique) présente l'évolution du PIB mondial et des émissions de CO2 depuis 1990 : les deux courbes progressent, mais les émissions augmentent moins vite que le PIB dans les pays développés.

« À l'aide du document et de vos connaissances, montrez que la croissance économique se heurte à des limites écologiques. »

### Correction
- **Lecture du document :** le PIB mondial croît, mais s'accompagne d'une hausse des émissions de CO2. La croissance mobilise donc des ressources et génère des pollutions (limites planétaires).
- **Analyse :** cette croissance dégrade le capital naturel (climat, biodiversité, ressources fossiles) et met en jeu la soutenabilité. Dans une optique de soutenabilité forte, certains éléments naturels sont irremplaçables.
- **Nuance :** le document montre une hausse des émissions moins rapide que celle du PIB dans les pays développés, signe d'un possible découplage relatif grâce au progrès technique (énergies renouvelables, efficacité). Des instruments (taxe carbone, quotas, normes) visent à réorienter la croissance vers une transition écologique.
Conclusion : la croissance se heurte à des limites écologiques, mais peut être en partie verdie par l'action publique et l'innovation.$md$),

    ('Le commerce international', $md$# Exercices types — Le commerce international

## Exercice 1 — Question de l'épreuve composée (mobilisation des connaissances)
« Vous montrerez que le libre-échange présente à la fois des avantages et des inconvénients. » (raisonnement structuré, sans document)

### Correction
On attend une réponse en deux parties.
- **Les avantages :** le libre-échange, en supprimant les barrières, permet la spécialisation selon les avantages comparatifs (Ricardo). Il élargit les débouchés, fait baisser les prix pour les consommateurs, stimule la concurrence et diffuse le progrès technique. La production mondiale totale augmente.
- **Les inconvénients :** il crée des perdants. Les secteurs exposés à la concurrence de pays à bas coûts peuvent disparaître, avec des pertes d'emplois et des délocalisations. Il peut accroître certaines inégalités et créer des dépendances. C'est pourquoi des mesures protectionnistes (droits de douane, quotas) sont parfois invoquées, au risque de représailles.
Conclusion : le libre-échange apporte des gains globaux, mais sa répartition inégale justifie un accompagnement des perdants.

## Exercice 2 — Raisonnement s'appuyant sur un document
Un document (tableau) donne, pour deux pays A et B, le nombre d'heures nécessaires pour produire une unité de textile et une unité d'électronique. Le pays A est plus efficace dans les deux productions, mais son avance est bien plus grande en électronique.

« À l'aide du document et de vos connaissances, montrez l'intérêt de la spécialisation internationale. »

### Correction
- **Lecture du document :** le pays A dispose d'un avantage absolu dans les deux biens, mais son avance relative est plus forte en électronique qu'en textile.
- **Analyse :** selon la théorie de l'avantage comparatif (Ricardo), le pays A a intérêt à se spécialiser dans l'électronique (là où son avantage est le plus grand) et le pays B dans le textile (là où son désavantage est le plus faible), puis à échanger.
- **Résultat :** cette spécialisation augmente la production mondiale totale et permet aux deux pays de consommer davantage qu'en autarcie. L'échange est mutuellement bénéfique, même pour le pays désavantagé partout.
Conclusion : le document illustre que la spécialisation selon l'avantage comparatif fonde les gains à l'échange international.$md$),

    ('Les mutations du travail', $md$# Exercices types — Les mutations du travail

## Exercice 1 — Question de l'épreuve composée (mobilisation des connaissances)
« Vous présenterez deux facteurs qui permettent d'expliquer le chômage. » (raisonnement structuré, sans document)

### Correction
On attend la présentation claire de deux facteurs distincts.
- **Un facteur conjoncturel (côté demande) :** lorsque l'activité économique ralentit, la demande de biens et services baisse, les entreprises produisent moins et embauchent moins, voire licencient. Ce chômage conjoncturel est lié au cycle économique.
- **Un facteur structurel :** le chômage peut aussi tenir au fonctionnement du marché du travail. Une inadéquation entre les qualifications offertes et celles demandées, un coût du travail jugé élevé au regard de la productivité, ou des rigidités institutionnelles entretiennent un chômage durable indépendant de la conjoncture.
Conclusion : chômage conjoncturel (demande) et chômage structurel (fonctionnement du marché du travail) se combinent pour expliquer le niveau observé.

## Exercice 2 — Raisonnement s'appuyant sur un document
Un document (texte + chiffres) décrit la progression des formes particulières d'emploi (CDD, intérim, temps partiel) et l'essor du télétravail et des plateformes numériques au cours des dernières années.

« À l'aide du document et de vos connaissances, montrez que les formes d'emploi se transforment. »

### Correction
- **Lecture du document :** on observe une hausse des CDD, de l'intérim et du temps partiel, ainsi que le développement du télétravail et de l'emploi via des plateformes.
- **Analyse :** ces évolutions traduisent une flexibilisation et une précarisation partielle de l'emploi. Le modèle du CDI à temps plein n'est plus l'unique norme ; les employeurs recherchent de la souplesse et le numérique fait émerger de nouvelles organisations (télétravail, indépendants des plateformes).
- **Conséquences :** ces formes offrent de la souplesse mais fragilisent la protection sociale et brouillent la frontière entre salariat et travail indépendant.
Conclusion : le document confirme une transformation des formes d'emploi, entre flexibilité recherchée et nouvelles précarités.$md$),

    ('La justice sociale', $md$# Exercices types — La justice sociale

## Exercice 1 — Question de l'épreuve composée (mobilisation des connaissances)
« Montrez que l'action des pouvoirs publics contribue à la justice sociale. » (raisonnement structuré, sans document)

### Correction
On attend une réponse organisée autour de plusieurs instruments.
- **La redistribution :** par les prélèvements obligatoires (impôt progressif, cotisations) et les prestations (monétaires et en nature), l'État réduit les écarts de revenus (redistribution verticale) et mutualise les risques (redistribution horizontale).
- **La fourniture de services collectifs :** l'école et la santé publiques favorisent l'égalité des chances et l'accès de tous à des biens essentiels.
- **La lutte contre les discriminations et la discrimination positive :** des mesures ciblées cherchent à corriger des inégalités persistantes.
Conclusion : par la redistribution, les services publics et la lutte contre les discriminations, les pouvoirs publics agissent en faveur de la justice sociale, malgré des limites (coût, effets désincitatifs).

## Exercice 2 — Raisonnement s'appuyant sur un document
Un document (tableau) présente la distribution des revenus avant et après redistribution : le rapport interdécile (D9/D1) passe d'une valeur élevée avant transferts à une valeur nettement plus faible après impôts et prestations.

« À l'aide du document et de vos connaissances, montrez que la redistribution réduit les inégalités de revenus. »

### Correction
- **Lecture du document :** avant redistribution, l'écart entre les 10 % les plus riches et les 10 % les plus pauvres (rapport interdécile) est élevé ; après impôts et prestations, il diminue fortement.
- **Analyse :** la redistribution verticale, financée par des prélèvements progressifs et versée sous forme de prestations et minima sociaux, transfère du pouvoir d'achat des ménages aisés vers les ménages modestes.
- **Interprétation :** la baisse du rapport interdécile mesure directement l'ampleur de cette réduction des inégalités. On peut compléter avec le coefficient de Gini, qui diminue lui aussi après redistribution.
Conclusion : le document montre que la redistribution réduit sensiblement les inégalités de revenus, cœur de l'action de l'État-providence.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'ses'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
