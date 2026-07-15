-- =============================================================================
-- Studuel — Migration 142 : CONTENU SVT Tle (+ exercices type bac)
-- Remplit les 5 chapitres de SVT Terminale (spécialité, programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés par chapitre.
--
-- Motif idempotent (comme 090/113) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 029 (mind_map), 002 (quizzes).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Génétique et évolution', $md$# Génétique et évolution

## Ce que tu vas comprendre
La reproduction sexuée mélange les gènes à chaque génération : ce **brassage** crée une immense diversité génétique, sur laquelle agissent ensuite la **sélection naturelle** et la **dérive**. Ce chapitre relie la méiose aux grands mécanismes de l'évolution.

## 1. La méiose : deux brassages
La **méiose** produit des cellules haploïdes (les gamètes) à partir d'une cellule diploïde.
- **Brassage interchromosomique** : à la première division, les chromosomes de chaque paire se répartissent au hasard dans les gamètes.
- **Brassage intrachromosomique** : lors de la prophase I, des **crossing-over** échangent des portions entre chromosomes homologues.

*Exemple : pour n paires de chromosomes, le brassage interchromosomique produit à lui seul 2^n combinaisons possibles.*

## 2. La fécondation : un brassage supplémentaire
La **fécondation** réunit au hasard un gamète mâle et un gamète femelle. Elle multiplie encore la diversité : le nombre de génotypes possibles chez les descendants est immense.

> **À retenir :** méiose + fécondation = source majeure de la **diversité génétique** au sein d'une espèce.

## 3. Anomalies de la méiose et diversification
Des accidents (crossing-over inégal, mauvaise séparation des chromosomes) créent des **duplications de gènes** ou des variations du nombre de chromosomes. Ces anomalies, parfois transmises, sont un moteur de **diversification du vivant** (familles multigéniques).

## 4. Diversifier sans passer par la reproduction sexuée
Le vivant se diversifie aussi par d'autres voies : **transferts horizontaux** de gènes, **symbioses**, ou transmission d'un comportement par **apprentissage** (diversification non génétique).

## 5. Sélection naturelle et dérive génétique
Dans une population, la fréquence des allèles change au fil des générations :
- **Sélection naturelle** : les individus les mieux adaptés au milieu se reproduisent davantage ; les allèles favorables deviennent plus fréquents.
- **Dérive génétique** : variations **aléatoires** des fréquences alléliques, d'autant plus fortes que la population est **petite**.

## 6. La spéciation
Quand deux populations d'une même espèce cessent d'échanger leurs gènes (**isolement** géographique ou reproductif), elles évoluent séparément jusqu'à former deux **espèces** distinctes : c'est la **spéciation**.

## L'essentiel à retenir
- La **méiose** brasse les allèles (brassages inter- et intrachromosomique), la **fécondation** ajoute un brassage au hasard.
- Les **anomalies** de méiose (duplications) diversifient les génomes.
- La **sélection naturelle** (tri par le milieu) et la **dérive** (hasard, surtout en petite population) font évoluer les fréquences alléliques.
- L'**isolement** durable de deux populations conduit à la **spéciation**.$md$),

    ('Le temps et les roches', $md$# Le temps et les roches

## Ce que tu vas comprendre
Les roches enregistrent le temps. En croisant des **principes de chronologie relative** et des **mesures d'âges absolus**, les géologues reconstituent l'histoire de la Terre sur des milliards d'années.

## 1. La datation relative
La **datation relative** classe les événements les uns par rapport aux autres, sans donner d'âge chiffré. Elle repose sur quelques principes :
- **Superposition** : une couche est plus récente que celle qu'elle recouvre.
- **Recoupement** : une structure (faille, filon) qui en recoupe une autre lui est postérieure.
- **Continuité** : une même couche a le même âge sur toute son étendue.
- **Inclusion** : un fragment inclus dans une roche est plus ancien que celle-ci.

## 2. Les fossiles stratigraphiques
Certains fossiles, à répartition mondiale et à courte durée de vie, servent de **fossiles stratigraphiques** : ils permettent de dater et de corréler des couches sur de grandes distances.

## 3. La datation absolue : la radiochronologie
La **datation absolue** donne un âge en années. Elle utilise la **désintégration radioactive** : un isotope **père** se transforme en isotope **fils** à vitesse constante, mesurée par la **demi-vie** (temps au bout duquel la moitié des atomes père se sont désintégrés).

*Exemple : le couple potassium-argon (K-Ar) date les roches volcaniques ; le couple carbone 14 (demi-vie ≈ 5 730 ans) date des restes récents (< 50 000 ans).*

## 4. Choisir le bon chronomètre
On choisit le couple isotopique selon l'âge à mesurer :
- **Carbone 14** : matériaux organiques récents.
- **K-Ar, Rb-Sr, U-Pb** : roches très anciennes (millions à milliards d'années).

## 5. Reconstituer une chronologie
En combinant datation **relative** (l'ordre des événements) et datation **absolue** (les âges chiffrés), on construit l'**échelle des temps géologiques** et l'histoire d'une région (dépôts, plissements, érosion…).

## L'essentiel à retenir
- La **datation relative** ordonne les événements (superposition, recoupement, continuité, inclusion).
- Les **fossiles stratigraphiques** datent et corrèlent les couches.
- La **radiochronologie** donne un âge absolu grâce à la **demi-vie** d'un isotope.
- On choisit le **chronomètre** selon l'âge visé (C14 récent, U-Pb très ancien).$md$),

    ('Les climats de la Terre', $md$# Les climats de la Terre

## Ce que tu vas comprendre
Le climat de la Terre a toujours varié. En reconstituant les climats du passé, on comprend les mécanismes en jeu — dont l'**effet de serre** — et on mesure l'ampleur de la **perturbation actuelle** liée aux activités humaines.

## 1. Un climat qui a toujours changé
À l'échelle des temps géologiques, la Terre a connu des périodes chaudes et des **glaciations**. Ces variations passées se lisent dans les archives naturelles.

## 2. Reconstituer les climats du passé
On utilise des **indices** (proxys) :
- **Carottes de glace** : les bulles d'air piégées donnent la composition de l'atmosphère (CO2, méthane) ; le rapport des isotopes de l'oxygène renseigne sur la température.
- **Pollens** et **fossiles** : indiquent la végétation, donc le climat régional.
- **Sédiments océaniques** : leur composition trace les températures anciennes.

## 3. L'effet de serre
Certains gaz de l'atmosphère (**CO2**, **vapeur d'eau**, **méthane**) absorbent le rayonnement infrarouge émis par la surface et en renvoient une partie vers le sol : c'est l'**effet de serre**, qui réchauffe la basse atmosphère.

> **À retenir :** sans effet de serre naturel, la température moyenne de la Terre serait d'environ −18 °C au lieu de +15 °C. Le problème vient de son **renforcement** par les émissions humaines.

## 4. Les causes des variations naturelles
- **Paramètres orbitaux** (paramètres de Milankovitch) : les variations lentes de l'orbite terrestre rythment les glaciations.
- **Volcanisme** et **teneur en CO2** : modifient l'effet de serre sur de longues durées.

## 5. La perturbation climatique actuelle
Depuis l'ère industrielle, la combustion des énergies fossiles augmente fortement la teneur en **CO2**. Le climat se réchauffe **rapidement** : les modèles prévoient la poursuite du réchauffement selon les émissions futures. Les conséquences (montée des eaux, événements extrêmes) engagent la responsabilité des sociétés.

## L'essentiel à retenir
- Le climat terrestre a **toujours varié** (périodes chaudes, glaciations).
- On le reconstitue avec des **proxys** (glace, pollens, sédiments).
- L'**effet de serre** (CO2, vapeur d'eau, méthane) réchauffe la basse atmosphère.
- La hausse **rapide** et récente du CO2 d'origine humaine renforce l'effet de serre : c'est la perturbation actuelle.$md$),

    ('Comportement et stress', $md$# Comportement, mouvement et stress

## Ce que tu vas comprendre
Bouger, réagir, s'adapter à une menace : tout passe par le **système nerveux**. Ce chapitre décrit le réflexe myotatique, la commande du mouvement volontaire, puis la réponse de l'organisme au **stress** aigu et chronique.

## 1. Le réflexe myotatique
Le **réflexe myotatique** est la contraction automatique d'un muscle en réponse à son propre étirement (exemple : le réflexe rotulien). C'est un réflexe **monosynaptique** : une seule synapse relie le neurone sensoriel au neurone moteur dans la moelle épinière.

*Sa mesure clinique renseigne sur l'état du système nerveux.*

## 2. Le circuit nerveux du réflexe
Le trajet est stéréotypé : **récepteur** (fuseau neuromusculaire) → **neurone sensoriel** → **moelle épinière** → **neurone moteur (motoneurone)** → **muscle effecteur**. Le message nerveux est un **message électrique** (potentiels d'action) relayé par un **message chimique** (neurotransmetteur) au niveau des synapses.

## 3. La commande du mouvement volontaire
Le mouvement volontaire est commandé par le **cortex moteur** du cerveau. Les motoneurones reçoivent en permanence de nombreux messages (excitateurs et inhibiteurs) : ils réalisent une **intégration** avant de déclencher, ou non, la contraction.

## 4. Plasticité et apprentissage moteur
Le cerveau est **plastique** : l'entraînement et la répétition modifient les connexions (nouvelles synapses, renforcement). C'est ce qui permet l'**apprentissage moteur** et la récupération après certaines lésions.

## 5. Le stress aigu
Face à un danger, l'organisme déclenche une **réponse de stress aigu** rapide, sous contrôle du **système nerveux** et de l'axe hormonal : libération d'**adrénaline** puis de **cortisol**. Conséquences : accélération du cœur, hausse de la glycémie, mise en alerte — une réaction **adaptative** qui prépare à réagir.

## 6. Le stress chronique
Quand le stress se **prolonge**, la sécrétion durable de cortisol devient délétère : fatigue, troubles du sommeil, affaiblissement des défenses, risques cardiovasculaires. Le stress chronique résulte d'un **dérèglement** des systèmes de régulation.

## L'essentiel à retenir
- Le **réflexe myotatique** est un réflexe **monosynaptique** (étirement → contraction du même muscle).
- Circuit : récepteur → neurone sensoriel → moelle → motoneurone → muscle ; message électrique + chimique aux synapses.
- Le **mouvement volontaire** part du cortex moteur ; le motoneurone **intègre** les messages ; le cerveau est **plastique**.
- Le **stress aigu** (adrénaline, cortisol) est adaptatif ; le **stress chronique** dérègle l'organisme.$md$),

    ('De la plante sauvage à la plante cultivée', $md$# De la plante sauvage à la plante cultivée

## Ce que tu vas comprendre
Nos plantes cultivées descendent de plantes sauvages, profondément transformées par des millénaires de **sélection** humaine. Ce chapitre explique la domestication, ses effets sur la biodiversité et les enjeux actuels.

## 1. La domestication
Depuis le Néolithique, l'Homme **sélectionne** et reproduit les plantes présentant des caractères intéressants (gros grains, épis qui ne se dispersent pas, bon goût). Génération après génération, la plante cultivée s'éloigne de son ancêtre sauvage.

*Exemple : le maïs cultivé descend de la téosinte, une plante sauvage aux épis minuscules.*

## 2. La sélection artificielle
La **sélection artificielle** est le tri, par l'Homme, des individus reproducteurs. Elle joue sur la **variabilité génétique** existante : à chaque génération on garde les meilleurs plants, ce qui modifie rapidement les caractères de l'espèce cultivée.

## 3. Croisements et obtention de variétés
Les agriculteurs et sélectionneurs réalisent des **croisements** dirigés pour combiner des caractères avantageux (rendement, résistance aux maladies, adaptation au climat) et obtenir de nouvelles **variétés**.

## 4. Biodiversité cultivée et son érosion
La diversité des plantes cultivées (variétés locales, semences paysannes) constitue une **biodiversité cultivée** précieuse. Mais l'agriculture intensive, en privilégiant quelques variétés très productives, **appauvrit** cette diversité.

> **À retenir :** conserver un grand nombre de variétés (banques de graines, conservatoires) préserve des allèles utiles pour l'avenir (résistances, adaptation au changement climatique).

## 5. Les techniques modernes
Aux méthodes traditionnelles s'ajoutent les **biotechnologies** : culture in vitro, sélection assistée par marqueurs, transgenèse. Elles accélèrent l'obtention de variétés, mais soulèvent des enjeux **écologiques et sociétaux**.

## L'essentiel à retenir
- La **domestication** transforme une plante sauvage en plante cultivée par sélection humaine (maïs ← téosinte).
- La **sélection artificielle** trie les reproducteurs et exploite la variabilité génétique.
- Les **croisements** combinent des caractères avantageux pour créer des variétés.
- La **biodiversité cultivée** est un réservoir d'allèles à préserver ; les biotechnologies accélèrent la sélection.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Génétique et évolution', $json${
      "centre": "Génétique et évolution",
      "branches": [
        { "titre": "Méiose", "enfants": ["Brassage interchromosomique", "Brassage intrachromosomique (crossing-over)", "Gamètes haploïdes"] },
        { "titre": "Fécondation", "enfants": ["Réunion au hasard des gamètes", "Diversité des génotypes", "Amplifie le brassage"] },
        { "titre": "Diversification", "enfants": ["Duplications de gènes", "Transferts horizontaux, symbioses", "Familles multigéniques"] },
        { "titre": "Évolution", "enfants": ["Sélection naturelle (tri par le milieu)", "Dérive génétique (hasard, petites populations)", "Isolement → spéciation"] }
      ]
    }$json$),
    ('Le temps et les roches', $json${
      "centre": "Le temps et les roches",
      "branches": [
        { "titre": "Datation relative", "enfants": ["Superposition, recoupement", "Continuité, inclusion", "Ordre des événements"] },
        { "titre": "Fossiles stratigraphiques", "enfants": ["Répartition mondiale", "Courte durée de vie", "Datent et corrèlent"] },
        { "titre": "Datation absolue", "enfants": ["Désintégration radioactive", "Notion de demi-vie", "Âge en années"] },
        { "titre": "Bon chronomètre", "enfants": ["Carbone 14 : récent", "K-Ar, U-Pb : très ancien", "Échelle des temps géologiques"] }
      ]
    }$json$),
    ('Les climats de la Terre', $json${
      "centre": "Les climats de la Terre",
      "branches": [
        { "titre": "Variations passées", "enfants": ["Périodes chaudes", "Glaciations", "Le climat a toujours changé"] },
        { "titre": "Reconstitutions (proxys)", "enfants": ["Carottes de glace (CO2, isotopes O)", "Pollens et fossiles", "Sédiments océaniques"] },
        { "titre": "Effet de serre", "enfants": ["CO2, vapeur d'eau, méthane", "Absorbent l'infrarouge", "Réchauffent la basse atmosphère"] },
        { "titre": "Perturbation actuelle", "enfants": ["CO2 d'origine humaine", "Réchauffement rapide", "Modèles et responsabilités"] }
      ]
    }$json$),
    ('Comportement et stress', $json${
      "centre": "Comportement, mouvement et stress",
      "branches": [
        { "titre": "Réflexe myotatique", "enfants": ["Étirement → contraction", "Réflexe monosynaptique", "Ex. réflexe rotulien"] },
        { "titre": "Circuit nerveux", "enfants": ["Récepteur → neurone sensoriel", "Moelle → motoneurone → muscle", "Message électrique + chimique"] },
        { "titre": "Mouvement volontaire", "enfants": ["Cortex moteur", "Intégration par le motoneurone", "Plasticité, apprentissage"] },
        { "titre": "Stress", "enfants": ["Aigu : adrénaline, cortisol (adaptatif)", "Chronique : cortisol durable", "Dérèglement délétère"] }
      ]
    }$json$),
    ('De la plante sauvage à la plante cultivée', $json${
      "centre": "De la plante sauvage à la plante cultivée",
      "branches": [
        { "titre": "Domestication", "enfants": ["Depuis le Néolithique", "Maïs ← téosinte", "S'éloigne de l'ancêtre sauvage"] },
        { "titre": "Sélection artificielle", "enfants": ["Tri des reproducteurs", "Joue sur la variabilité génétique", "Modifie l'espèce cultivée"] },
        { "titre": "Croisements", "enfants": ["Combiner des caractères", "Rendement, résistances", "Nouvelles variétés"] },
        { "titre": "Biodiversité cultivée", "enfants": ["Variétés locales, semences", "Érosion par l'agriculture intensive", "Banques de graines, biotechnologies"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Tle ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14219999-0000-4000-8000-000000000001'::uuid, 'Génétique et évolution'),
  ('14219999-0000-4000-8000-000000000002'::uuid, 'Le temps et les roches'),
  ('14219999-0000-4000-8000-000000000003'::uuid, 'Les climats de la Terre'),
  ('14219999-0000-4000-8000-000000000004'::uuid, 'Comportement et stress'),
  ('14219999-0000-4000-8000-000000000005'::uuid, 'De la plante sauvage à la plante cultivée')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
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
  -- Chapitre 1 — Génétique et évolution
  ('14210000-0000-4000-8000-000000000104'::uuid, 'Génétique et évolution',
   'Quel phénomène de la méiose échange des portions entre chromosomes homologues ?', 'mcq',
   '["Le crossing-over", "La réplication", "La fécondation", "La mitose"]', 0,
   'Le crossing-over (brassage intrachromosomique) échange des portions entre homologues en prophase I.', 4),
  ('14210000-0000-4000-8000-000000000105'::uuid, 'Génétique et évolution',
   'La fécondation ajoute un brassage en réunissant les gamètes au hasard.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La fécondation réunit au hasard un gamète mâle et un gamète femelle : elle amplifie la diversité génétique.', 5),
  ('14210000-0000-4000-8000-000000000106'::uuid, 'Génétique et évolution',
   'Quel mécanisme évolutif correspond à un tri des individus les mieux adaptés au milieu ?', 'mcq',
   '["La sélection naturelle", "La dérive génétique", "La méiose", "La duplication"]', 0,
   'La sélection naturelle favorise la reproduction des individus les mieux adaptés : leurs allèles deviennent plus fréquents.', 6),
  ('14210000-0000-4000-8000-000000000107'::uuid, 'Génétique et évolution',
   'La dérive génétique a un effet d''autant plus fort que la population est petite.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La dérive (variation aléatoire des fréquences alléliques) est d''autant plus marquée que la population est réduite.', 7),
  ('14210000-0000-4000-8000-000000000108'::uuid, 'Génétique et évolution',
   'Qu''est-ce qui conduit deux populations isolées à devenir deux espèces distinctes ?', 'mcq',
   '["La spéciation", "La mitose", "La photosynthèse", "La respiration"]', 0,
   'L''isolement durable de deux populations aboutit à la spéciation : la formation de deux espèces distinctes.', 8),
  ('14210000-0000-4000-8000-000000000109'::uuid, 'Génétique et évolution',
   'Pour n paires de chromosomes, combien de combinaisons le brassage interchromosomique produit-il ?', 'mcq',
   '["2 puissance n", "n puissance 2", "2 fois n", "n divisé par 2"]', 0,
   'La répartition indépendante des paires donne 2^n combinaisons possibles de gamètes.', 9),
  ('14210000-0000-4000-8000-000000000110'::uuid, 'Génétique et évolution',
   'Une duplication de gène est un mécanisme de diversification du vivant.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les duplications (accidents de méiose) créent de nouveaux gènes et forment les familles multigéniques.', 10),

  -- Chapitre 2 — Le temps et les roches
  ('14210000-0000-4000-8000-000000000204'::uuid, 'Le temps et les roches',
   'Selon le principe de superposition, une couche située au-dessus d''une autre est : ', 'mcq',
   '["Plus récente", "Plus ancienne", "Du même âge", "Impossible à dater"]', 0,
   'Le principe de superposition : la couche du dessus s''est déposée après, elle est donc plus récente.', 4),
  ('14210000-0000-4000-8000-000000000205'::uuid, 'Le temps et les roches',
   'Une faille qui recoupe une couche est postérieure à cette couche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Principe de recoupement : la structure qui en recoupe une autre est plus récente qu''elle.', 5),
  ('14210000-0000-4000-8000-000000000206'::uuid, 'Le temps et les roches',
   'Sur quoi repose la datation absolue (radiochronologie) ?', 'mcq',
   '["La désintégration radioactive", "La couleur des roches", "La taille des fossiles", "La superposition"]', 0,
   'La radiochronologie mesure la transformation d''un isotope père en isotope fils à vitesse constante.', 6),
  ('14210000-0000-4000-8000-000000000207'::uuid, 'Le temps et les roches',
   'La demi-vie est le temps au bout duquel la moitié des atomes père se sont désintégrés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La demi-vie caractérise la vitesse de désintégration : la moitié des noyaux père a disparu.', 7),
  ('14210000-0000-4000-8000-000000000208'::uuid, 'Le temps et les roches',
   'Quel chronomètre convient pour dater des restes organiques récents (moins de 50 000 ans) ?', 'mcq',
   '["Le carbone 14", "L''uranium-plomb", "Le potassium-argon", "Le rubidium-strontium"]', 0,
   'Le carbone 14 (demi-vie ≈ 5 730 ans) date des matériaux organiques récents ; U-Pb sert pour les très longues durées.', 8),
  ('14210000-0000-4000-8000-000000000209'::uuid, 'Le temps et les roches',
   'Un bon fossile stratigraphique doit avoir une large répartition et une courte durée de vie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Répartition mondiale + courte durée d''existence : c''est ce qui permet de dater et corréler les couches.', 9),
  ('14210000-0000-4000-8000-000000000210'::uuid, 'Le temps et les roches',
   'Que permet de construire la combinaison des datations relative et absolue ?', 'mcq',
   '["L''échelle des temps géologiques", "La carte des vents", "Le cycle de l''eau", "Un arbre généalogique"]', 0,
   'En croisant l''ordre des événements et les âges chiffrés, on établit l''échelle des temps géologiques.', 10),

  -- Chapitre 3 — Les climats de la Terre
  ('14210000-0000-4000-8000-000000000304'::uuid, 'Les climats de la Terre',
   'Que piègent les bulles d''air des carottes de glace ?', 'mcq',
   '["La composition de l''atmosphère passée", "Des fossiles marins", "Des minéraux radioactifs", "De l''eau de mer"]', 0,
   'Les bulles emprisonnent de l''air ancien : on y mesure le CO2 et le méthane de l''atmosphère du passé.', 4),
  ('14210000-0000-4000-8000-000000000305'::uuid, 'Les climats de la Terre',
   'Le CO2, la vapeur d''eau et le méthane sont des gaz à effet de serre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ces gaz absorbent le rayonnement infrarouge émis par la surface et réchauffent la basse atmosphère.', 5),
  ('14210000-0000-4000-8000-000000000306'::uuid, 'Les climats de la Terre',
   'Comment agit l''effet de serre sur la basse atmosphère ?', 'mcq',
   '["Il la réchauffe", "Il la refroidit", "Il n''a aucun effet", "Il la fait disparaître"]', 0,
   'Les gaz à effet de serre renvoient une partie de l''infrarouge vers le sol : la basse atmosphère se réchauffe.', 6),
  ('14210000-0000-4000-8000-000000000307'::uuid, 'Les climats de la Terre',
   'Le climat de la Terre a toujours varié au cours des temps géologiques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La Terre a connu des périodes chaudes et des glaciations : le climat a toujours changé.', 7),
  ('14210000-0000-4000-8000-000000000308'::uuid, 'Les climats de la Terre',
   'Quelle est la principale cause de la perturbation climatique actuelle ?', 'mcq',
   '["Les émissions humaines de CO2", "Une baisse du volcanisme", "La disparition des pollens", "Le refroidissement du Soleil"]', 0,
   'Depuis l''ère industrielle, la combustion des énergies fossiles augmente le CO2 et renforce l''effet de serre.', 8),
  ('14210000-0000-4000-8000-000000000309'::uuid, 'Les climats de la Terre',
   'Que trace le rapport des isotopes de l''oxygène dans les archives glaciaires ?', 'mcq',
   '["La température passée", "Le niveau des mers actuel", "L''âge des fossiles", "La vitesse des vents"]', 0,
   'Le rapport isotopique de l''oxygène est un indicateur (proxy) de la température des époques passées.', 9),
  ('14210000-0000-4000-8000-000000000310'::uuid, 'Les climats de la Terre',
   'Les paramètres orbitaux de la Terre rythment les grandes glaciations.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les paramètres de Milankovitch (variations lentes de l''orbite) modulent l''ensoleillement et rythment les glaciations.', 10),

  -- Chapitre 4 — Comportement et stress
  ('14210000-0000-4000-8000-000000000404'::uuid, 'Comportement et stress',
   'Le réflexe myotatique est déclenché par : ', 'mcq',
   '["L''étirement du muscle", "La lumière", "Un son", "La chaleur"]', 0,
   'Le réflexe myotatique est la contraction automatique d''un muscle en réponse à son propre étirement.', 4),
  ('14210000-0000-4000-8000-000000000405'::uuid, 'Comportement et stress',
   'Le réflexe myotatique est un réflexe monosynaptique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une seule synapse relie le neurone sensoriel au motoneurone dans la moelle épinière : il est monosynaptique.', 5),
  ('14210000-0000-4000-8000-000000000406'::uuid, 'Comportement et stress',
   'Quel organe commande le mouvement volontaire ?', 'mcq',
   '["Le cortex moteur", "Le foie", "Le cœur", "La rétine"]', 0,
   'Le mouvement volontaire est commandé par le cortex moteur du cerveau, qui active les motoneurones.', 6),
  ('14210000-0000-4000-8000-000000000407'::uuid, 'Comportement et stress',
   'Au niveau d''une synapse, le message nerveux devient un message chimique (neurotransmetteur).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le message électrique (potentiels d''action) est relayé par un neurotransmetteur à la synapse.', 7),
  ('14210000-0000-4000-8000-000000000408'::uuid, 'Comportement et stress',
   'Quelle hormone est libérée très rapidement lors du stress aigu ?', 'mcq',
   '["L''adrénaline", "L''insuline", "La mélatonine", "La testostérone"]', 0,
   'Le stress aigu libère d''abord l''adrénaline (puis le cortisol), ce qui met l''organisme en alerte.', 8),
  ('14210000-0000-4000-8000-000000000409'::uuid, 'Comportement et stress',
   'Le stress chronique, avec un cortisol durablement élevé, est délétère pour l''organisme.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un stress prolongé dérègle la régulation : fatigue, troubles du sommeil, risques cardiovasculaires.', 9),
  ('14210000-0000-4000-8000-000000000410'::uuid, 'Comportement et stress',
   'Le rôle du motoneurone avant de déclencher une contraction est d''abord : ', 'mcq',
   '["D''intégrer les messages reçus", "De produire des hormones", "De filtrer le sang", "De capter la lumière"]', 0,
   'Le motoneurone intègre les messages excitateurs et inhibiteurs avant de commander, ou non, la contraction.', 10),

  -- Chapitre 5 — De la plante sauvage à la plante cultivée
  ('14210000-0000-4000-8000-000000000504'::uuid, 'De la plante sauvage à la plante cultivée',
   'De quelle plante sauvage descend le maïs cultivé ?', 'mcq',
   '["La téosinte", "Le blé", "La tomate", "Le riz"]', 0,
   'Le maïs cultivé descend de la téosinte, une plante sauvage aux épis minuscules.', 4),
  ('14210000-0000-4000-8000-000000000505'::uuid, 'De la plante sauvage à la plante cultivée',
   'La sélection artificielle consiste à trier, par l''Homme, les individus reproducteurs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La sélection artificielle est le choix humain des reproducteurs, qui exploite la variabilité génétique existante.', 5),
  ('14210000-0000-4000-8000-000000000506'::uuid, 'De la plante sauvage à la plante cultivée',
   'Sur quoi joue la sélection artificielle pour modifier une espèce cultivée ?', 'mcq',
   '["La variabilité génétique existante", "La couleur du ciel", "La radioactivité du sol", "La longueur des jours uniquement"]', 0,
   'Elle sélectionne, dans la variabilité génétique présente, les individus aux caractères recherchés.', 6),
  ('14210000-0000-4000-8000-000000000507'::uuid, 'De la plante sauvage à la plante cultivée',
   'Les croisements dirigés permettent de combiner des caractères avantageux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les croisements réunissent chez une même variété des caractères comme le rendement et la résistance aux maladies.', 7),
  ('14210000-0000-4000-8000-000000000508'::uuid, 'De la plante sauvage à la plante cultivée',
   'Qu''appelle-t-on la diversité des variétés de plantes cultivées ?', 'mcq',
   '["La biodiversité cultivée", "La photosynthèse", "La pollinisation", "La domestication animale"]', 0,
   'La biodiversité cultivée regroupe l''ensemble des variétés cultivées, un réservoir d''allèles à préserver.', 8),
  ('14210000-0000-4000-8000-000000000509'::uuid, 'De la plante sauvage à la plante cultivée',
   'L''agriculture intensive, en privilégiant quelques variétés, appauvrit la biodiversité cultivée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En ne cultivant que quelques variétés très productives, on érode la diversité des variétés locales.', 9),
  ('14210000-0000-4000-8000-000000000510'::uuid, 'De la plante sauvage à la plante cultivée',
   'À quoi servent les banques de graines et conservatoires ?', 'mcq',
   '["Préserver des variétés et leurs allèles utiles", "Fabriquer des engrais", "Mesurer le climat", "Dater les roches"]', 0,
   'Elles conservent de nombreuses variétés, donc des allèles utiles pour l''avenir (résistances, adaptation au climat).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac corrigés par chapitre (exploitation de documents +
--    raisonnement, ou question de synthèse).
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Génétique et évolution', $md$# Exercices types — Génétique et évolution

## Exercice 1 — Exploitation de documents : brassage et diversité
Un organisme diploïde possède **3 paires de chromosomes**. On étudie la formation de ses gamètes.

a) Sans crossing-over, combien de gamètes génétiquement différents le brassage interchromosomique peut-il produire ? Justifie par un calcul.
b) Explique comment le crossing-over augmente encore cette diversité.
c) Montre en quoi la fécondation amplifie la diversité des descendants.

### Correction
a) Chaque paire se répartit indépendamment : le nombre de combinaisons est **2^n**, avec n = 3.
2^3 = **8 gamètes** génétiquement différents par le seul brassage interchromosomique.

b) Le crossing-over (brassage intrachromosomique) échange des portions entre chromosomes homologues en prophase I. Il crée des chromosomes **recombinés**, portant de nouvelles associations d'allèles : le nombre de gamètes différents devient bien supérieur à 8.

c) La fécondation réunit **au hasard** un gamète mâle et un gamète femelle. Si chaque parent produit un très grand nombre de gamètes différents, le nombre de génotypes possibles chez les descendants est le **produit** des deux : la diversité explose. Méiose et fécondation sont donc les deux sources majeures de diversité génétique.

## Exercice 2 — Synthèse : sélection naturelle et dérive
À partir de tes connaissances, expose comment évoluent les fréquences alléliques d'une population au fil des générations.

### Correction
Deux mécanismes principaux font varier les fréquences des allèles.
- La **sélection naturelle** : dans un milieu donné, les individus porteurs d'allèles favorables survivent et se reproduisent davantage. La fréquence de ces allèles **augmente** de génération en génération : c'est un tri **orienté** par le milieu.
- La **dérive génétique** : indépendamment de tout avantage, les fréquences alléliques varient de façon **aléatoire** d'une génération à l'autre (échantillonnage au hasard des gamètes). Cet effet est **d'autant plus fort que la population est petite**.

Sur de longues durées, ces deux processus, combinés à l'**isolement** de populations, peuvent aboutir à la **spéciation** : deux populations qui n'échangent plus leurs gènes divergent jusqu'à former deux espèces distinctes.$md$),

    ('Le temps et les roches', $md$# Exercices types — Le temps et les roches

## Exercice 1 — Exploitation de documents : chronologie relative
On observe une coupe géologique montrant, de bas en haut, trois couches sédimentaires A, B puis C. Une **faille F** décale les couches A et B, mais **pas** la couche C. Un **filon de granite G** traverse A mais s'arrête sous B.

a) Classe les couches A, B, C de la plus ancienne à la plus récente. Quel principe utilises-tu ?
b) La faille F est-elle antérieure ou postérieure au dépôt de la couche C ? Justifie.
c) Situe la mise en place du filon G dans la chronologie.

### Correction
a) D'après le **principe de superposition**, la couche du dessous est la plus ancienne : ordre **A (plus ancienne) → B → C (plus récente)**.

b) La faille F décale A et B mais **pas** C : elle s'est donc formée **après** B et **avant** le dépôt de C. La faille est **antérieure** à la couche C.

c) Le filon G traverse A mais s'arrête sous B : d'après le **principe de recoupement**, il s'est mis en place **après** A et **avant** le dépôt de B. Chronologie : dépôt de A → filon G → dépôt de B → faille F → dépôt de C.

## Exercice 2 — Raisonnement : choix d'un chronomètre
Un géologue veut dater deux échantillons : une **coulée volcanique** vieille de plusieurs millions d'années et un **morceau de charbon de bois** d'un foyer préhistorique.

a) Rappelle le principe de la datation absolue.
b) Quel couple isotopique choisir pour chaque échantillon ? Justifie à l'aide de la notion de demi-vie.

### Correction
a) La datation absolue repose sur la **désintégration radioactive** : un isotope **père** se transforme en isotope **fils** à vitesse constante, caractérisée par la **demi-vie**. En mesurant la proportion père/fils, on calcule l'âge de l'échantillon.

b) On choisit le chronomètre selon l'âge à mesurer :
- Pour la **coulée volcanique** (millions d'années) : un couple à **longue demi-vie**, comme le **potassium-argon (K-Ar)**. Le carbone 14 serait totalement désintégré et inutilisable.
- Pour le **charbon de bois** (matériau organique récent) : le **carbone 14**, dont la demi-vie (≈ 5 730 ans) est adaptée aux durées de quelques milliers d'années.$md$),

    ('Les climats de la Terre', $md$# Exercices types — Les climats de la Terre

## Exercice 1 — Exploitation de documents : carottes de glace
On dispose d'une carotte de glace antarctique. Un graphique montre, sur les 400 000 dernières années, l'évolution **parallèle** de la teneur atmosphérique en **CO2** et d'un indicateur de **température**.

a) Comment les bulles d'air d'une carotte de glace renseignent-elles sur l'atmosphère du passé ?
b) Décris la relation entre CO2 et température observée sur le graphique.
c) Que peut-on en déduire sur le rôle du CO2 dans les variations climatiques ?

### Correction
a) Lors de la formation de la glace, de l'air est emprisonné sous forme de **bulles**. Cet air est un échantillon de l'atmosphère de l'époque : on y mesure directement la teneur en **CO2** et en méthane. Le rapport des **isotopes de l'oxygène** de la glace donne, lui, un indicateur de la température.

b) Les deux courbes varient **en parallèle** : les périodes de fort CO2 correspondent aux périodes chaudes, et les faibles teneurs aux périodes froides (glaciations).

c) Cette corrélation étroite montre que le **CO2**, gaz à effet de serre, est étroitement lié aux variations de température : une hausse du CO2 renforce l'effet de serre et accompagne un réchauffement. Le CO2 est donc un acteur majeur des changements climatiques.

## Exercice 2 — Synthèse : la perturbation climatique actuelle
Expose comment fonctionne l'effet de serre, puis explique en quoi le réchauffement actuel se distingue des variations climatiques passées.

### Correction
L'atmosphère contient des **gaz à effet de serre** (CO2, vapeur d'eau, méthane). La surface de la Terre, chauffée par le Soleil, émet un rayonnement **infrarouge**. Ces gaz en absorbent une partie et la **renvoient vers le sol** : la basse atmosphère se réchauffe. Sans cet effet de serre naturel, la température moyenne serait d'environ −18 °C.

Les climats du passé ont **toujours varié** (glaciations, périodes chaudes), sous l'effet notamment des **paramètres orbitaux** et du volcanisme, sur des dizaines de milliers d'années. Le réchauffement **actuel** se distingue par sa **rapidité** et par sa **cause** : depuis l'ère industrielle, la combustion des énergies fossiles a fait grimper la teneur en CO2 à une vitesse sans équivalent récent. Ce renforcement de l'effet de serre d'origine **humaine** engage la responsabilité des sociétés face aux conséquences (montée des eaux, événements extrêmes).$md$),

    ('Comportement et stress', $md$# Exercices types — Comportement et stress

## Exercice 1 — Exploitation de documents : le réflexe myotatique
On enregistre le réflexe rotulien : un choc sur le tendon sous la rotule étire le muscle de la cuisse, qui se contracte aussitôt et fait se lever la jambe.

a) Nomme, dans l'ordre, les éléments du circuit nerveux mis en jeu.
b) Pourquoi qualifie-t-on ce réflexe de « monosynaptique » ?
c) Sous quelle forme le message circule-t-il le long des neurones, puis d'un neurone à l'autre ?

### Correction
a) Le circuit est stéréotypé : **récepteur** (fuseau neuromusculaire, sensible à l'étirement) → **neurone sensoriel** → **moelle épinière** → **motoneurone** → **muscle effecteur** (qui se contracte).

b) Il est dit **monosynaptique** car une **seule synapse** relie le neurone sensoriel au motoneurone, dans la moelle épinière. Le trajet est court et rapide, sans neurone intermédiaire.

c) Le long d'un neurone, le message est **électrique** : ce sont des **potentiels d'action**. Au niveau de la synapse, entre deux neurones (ou entre neurone et muscle), le relais se fait par un **message chimique** : la libération d'un **neurotransmetteur**.

## Exercice 2 — Raisonnement : du stress aigu au stress chronique
Un document présente l'évolution du taux de **cortisol** chez une personne : un pic bref lors d'un examen (stress aigu), puis un taux durablement élevé après plusieurs mois de surcharge (stress chronique).

a) Décris la réponse de l'organisme lors d'un stress aigu et son intérêt.
b) Explique pourquoi le stress chronique devient nuisible.

### Correction
a) Face à une menace, l'organisme déclenche une **réponse de stress aigu** : libération rapide d'**adrénaline** puis de **cortisol**. Conséquences : accélération du rythme cardiaque, hausse de la glycémie, mobilisation de l'énergie, mise en alerte. Cette réaction est **adaptative** : elle prépare l'organisme à réagir efficacement (fuir, affronter), puis tout revient à la normale.

b) Lors d'un **stress chronique**, la situation stressante se **prolonge** : le cortisol reste durablement élevé. Les systèmes de régulation se **dérèglent**. Les conséquences deviennent délétères : fatigue, troubles du sommeil, affaiblissement des défenses immunitaires, augmentation des risques cardiovasculaires. Ce qui était protecteur à court terme devient nuisible quand il s'installe dans la durée.$md$),

    ('De la plante sauvage à la plante cultivée', $md$# Exercices types — De la plante sauvage à la plante cultivée

## Exercice 1 — Exploitation de documents : le maïs et la téosinte
Un document compare la **téosinte**, plante sauvage à petits épis dont les grains se dispersent facilement, et le **maïs** cultivé, à gros épis dont les grains restent attachés.

a) Quelles différences entre la téosinte et le maïs traduisent l'action de l'Homme ?
b) Explique par quel mécanisme, au fil des générations, la téosinte a donné le maïs cultivé.
c) Pourquoi le maïs cultivé aurait-il du mal à survivre seul dans la nature ?

### Correction
a) Le maïs a des **épis beaucoup plus gros**, avec plus de grains, et surtout des grains qui **ne se dispersent pas** (ils restent sur l'épi). Ce sont des caractères **avantageux pour la récolte** par l'Homme, mais rares chez la plante sauvage.

b) L'Homme a pratiqué une **sélection artificielle** : à chaque génération, il a conservé et ressemé les plants aux caractères intéressants (gros grains, épis non dispersés). En jouant ainsi sur la **variabilité génétique** de la population, il a progressivement transformé la téosinte en maïs cultivé.

c) Les grains du maïs restant attachés à l'épi, la plante ne peut plus **disperser** ses graines toute seule : elle dépend de l'Homme pour se reproduire. Ce caractère, avantageux pour la culture, la rend incapable de survivre sans intervention humaine.

## Exercice 2 — Synthèse : préserver la biodiversité cultivée
Expose ce qu'est la biodiversité cultivée, les menaces qui pèsent sur elle et l'intérêt de la préserver.

### Correction
La **biodiversité cultivée** désigne l'ensemble des **variétés** de plantes issues de la domestication : variétés locales, semences paysannes, races anciennes. Elle constitue un vaste **réservoir d'allèles**, fruit de milliers d'années de sélection.

Cette diversité est **menacée** par l'agriculture intensive, qui privilégie un petit nombre de variétés très productives et **uniformes**. En cultivant toujours les mêmes variétés, on **érode** la diversité génétique disponible.

La préserver est essentiel : ces allèles variés peuvent porter des **résistances** aux maladies ou une **adaptation** à de nouvelles conditions (sécheresse, changement climatique). Des **banques de graines** et des conservatoires stockent ces variétés pour les générations futures. Les **biotechnologies** (culture in vitro, sélection assistée par marqueurs) accélèrent la création de variétés, mais soulèvent des enjeux écologiques et sociétaux.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
