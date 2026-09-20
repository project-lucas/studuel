-- =============================================================================
-- Studuel — Migration 119 : CONTENU Technologie 3e (+ exercices types)
-- Remplit les 4 chapitres de Technologie 3e (programme cycle 4, Éduscol) :
--   1. Cours          → lessons.content de « L'essentiel du cours »
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10). Les
--                       questions sont attachées au quiz DE LA LEÇON via la
--                       jointure leçon→quiz (robuste à l'id existant).
--   4. Exercices types → lessons.content de « Exercices types » (position 2) :
--                       2 exercices corrigés par chapitre.
--
-- Motif idempotent (comme 090/101) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons Technologie 3e), 029 (mind_map),
-- 049 (quizzes de leçon Technologie collège).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Modélisation et simulation', $md$# Modélisation et simulation

## Ce que tu vas comprendre
Avant de fabriquer un objet, l'ingénieur en crée d'abord une **représentation** sur ordinateur : un **modèle numérique**. Ce chapitre t'apprend à quoi sert un modèle 3D et comment la **simulation** permet de tester un objet sans le construire.

## 1. Le modèle numérique 3D
Un **modèle numérique** est une représentation virtuelle d'un objet, réalisée avec un logiciel de **CAO** (Conception Assistée par Ordinateur, comme Onshape, SketchUp ou TinkerCAD).

- Il décrit la **forme**, les **dimensions** et parfois les **matériaux** de l'objet.
- On peut le faire **tourner**, le **couper** ou le **mesurer** à l'écran.

*Exemple : avant d'imprimer une pièce en 3D, on la dessine d'abord en volume dans un logiciel de CAO.*

## 2. Pourquoi modéliser plutôt que fabriquer ?
Fabriquer un vrai objet coûte du **temps**, de la **matière** et de l'**argent**. Le modèle numérique permet de :

- **vérifier** que les pièces s'assemblent bien ;
- **corriger** une erreur avant la fabrication ;
- **partager** le projet facilement (un simple fichier).

## 3. La simulation de comportement
La **simulation** utilise le modèle pour **prévoir le comportement** de l'objet dans des conditions réelles, sans le construire.

- Simulation **mécanique** : la pièce va-t-elle se **déformer** ou casser sous un poids ?
- Simulation de **fluides** : comment l'air ou l'eau s'écoule autour de l'objet ?
- Simulation **thermique** : comment la chaleur se répartit ?

*Exemple : on simule le poids d'un cycliste sur un cadre de vélo pour voir s'il résiste avant de le fabriquer.*

## 4. Les contraintes
Un objet doit respecter des **contraintes** : ce sont les **limites** et **exigences** à respecter.

- Contrainte de **résistance** : supporter un effort sans casser.
- Contrainte d'**encombrement** : tenir dans un espace donné.
- Contraintes de **coût**, de **matériau**, d'**environnement**…

La simulation sert justement à vérifier que ces contraintes sont respectées.

## L'essentiel à retenir
- Un **modèle numérique 3D** est réalisé en **CAO** : il décrit forme et dimensions.
- Modéliser permet de **tester et corriger** avant de fabriquer (gain de temps et d'argent).
- La **simulation** prévoit le **comportement** (mécanique, fluide, thermique) sans construire l'objet.
- Un objet doit respecter des **contraintes** (résistance, encombrement, coût…) que la simulation vérifie.$md$),

    ('Objets connectés', $md$# Les objets connectés

## Ce que tu vas comprendre
Une montre qui compte tes pas, un thermostat piloté par téléphone… ce sont des **objets connectés**. Ce chapitre t'explique comment un objet **mesure** son environnement, **traite** l'information et **communique** des données.

## 1. Qu'est-ce qu'un objet connecté ?
Un **objet connecté** (ou objet de l'**IoT**, *Internet of Things*, « Internet des objets ») est un objet capable d'**échanger des données** avec d'autres appareils ou avec Internet.

*Exemples : montre connectée, enceinte vocale, ampoule pilotable, capteur de qualité de l'air.*

## 2. Les capteurs
Un **capteur** transforme une **grandeur physique** (température, lumière, mouvement…) en un **signal** exploitable par l'objet. C'est l'**entrée** de la chaîne d'information.

- Capteur de **température**, de **luminosité**, de **présence**, d'**humidité**…

*Exemple : un capteur de présence détecte quelqu'un et déclenche l'allumage d'une lampe.*

## 3. Le microcontrôleur (le « cerveau »)
Le **microcontrôleur** (comme une carte **Arduino** ou **micro:bit**) est un mini-ordinateur qui **traite** les informations : il **lit** les capteurs, applique un **programme**, puis commande les **actionneurs** (moteur, LED, buzzer…).

Chaîne : **capteur → microcontrôleur → actionneur**.

## 4. La transmission des données
Pour communiquer, les objets connectés utilisent des liaisons **sans fil** :

- **Wi-Fi** et **Bluetooth** (courte distance, maison) ;
- **réseau mobile** (4G/5G) pour de longues distances.

Les données sont souvent envoyées vers un **serveur** (le *cloud*) puis consultées sur un **smartphone**.

## 5. La domotique
La **domotique** est l'ensemble des techniques qui permettent d'**automatiser** et de **piloter** une maison : chauffage, éclairage, volets, alarme… Elle repose sur des objets connectés qui apportent **confort**, **sécurité** et **économies d'énergie**.

## L'essentiel à retenir
- Un **objet connecté** échange des **données** (**IoT**, Internet des objets).
- Le **capteur** mesure une grandeur physique ; le **microcontrôleur** traite ; l'**actionneur** agit.
- Les données se transmettent surtout **sans fil** (Wi-Fi, Bluetooth, réseau mobile) vers le **cloud**.
- La **domotique** automatise la maison pour plus de confort, de sécurité et d'économies d'énergie.$md$),

    ('Algorithmes et programmation', $md$# Algorithmes et programmation

## Ce que tu vas comprendre
Un programme, c'est une suite d'**instructions** que l'ordinateur exécute. Ce chapitre t'apprend le vocabulaire de la programmation — **variables**, **conditions**, **boucles**, **fonctions** — utilisable aussi bien dans **Scratch** que dans **Python**.

## 1. Algorithme et programme
Un **algorithme** est une suite d'étapes **ordonnées** qui résout un problème. Quand on l'écrit dans un **langage** (Scratch, Python…), il devient un **programme**.

*Exemple d'algorithme : « demander l'âge, puis si l'âge ≥ 18, afficher majeur, sinon afficher mineur ».*

## 2. Les variables
Une **variable** est une **case mémoire** qui porte un **nom** et contient une **valeur** que l'on peut lire et modifier.

- En Scratch : bloc « mettre `score` à 0 ».
- En Python : `score = 0`.

## 3. Les conditions (si… alors…)
Une **condition** (instruction **si / else**) permet au programme de **choisir** selon qu'un test est **vrai** ou **faux**.

```python
if age >= 18:
    print("majeur")
else:
    print("mineur")
```

## 4. Les boucles (répéter)
Une **boucle** permet de **répéter** des instructions sans les réécrire.

- Boucle **bornée** : répéter un nombre connu de fois (`répéter 10 fois`, `for i in range(10)`).
- Boucle **non bornée** : répéter **tant qu'**une condition est vraie (`while`).

*Exemple : « répéter 4 fois : avancer, tourner » trace un carré.*

## 5. Les fonctions
Une **fonction** est un **bloc de code** que l'on nomme et que l'on peut **réutiliser** en l'**appelant** par son nom. Elle évite de **répéter** le même code.

```python
def carre(cote):
    for i in range(4):
        avancer(cote)
        tourner(90)
```

## L'essentiel à retenir
- Un **algorithme** est une suite d'étapes ordonnées ; écrit dans un langage, il devient un **programme**.
- Une **variable** est une case mémoire nommée qui stocke une valeur.
- Une **condition** (`si… sinon`) fait **choisir** ; une **boucle** fait **répéter**.
- Une **fonction** est un bloc nommé et **réutilisable**, qui évite de répéter le code.$md$),

    ('Projet : concevoir un objet', $md$# Projet : concevoir un objet

## Ce que tu vas comprendre
Concevoir un objet ne s'improvise pas : on suit une **démarche de projet**, du besoin jusqu'au test. Ce chapitre t'apprend les grandes étapes : **cahier des charges**, **prototypage** et **tests**.

## 1. La démarche de projet
La conception suit des **étapes** organisées :

1. **Identifier le besoin** : à quel problème l'objet répond-il ?
2. Rédiger le **cahier des charges**.
3. Imaginer des **solutions** (recherche d'idées).
4. **Modéliser** et fabriquer un **prototype**.
5. **Tester** et améliorer.

## 2. Le cahier des charges
Le **cahier des charges** est le document qui liste les **fonctions** que l'objet doit remplir et les **contraintes** à respecter.

- La **fonction d'usage** : à quoi sert l'objet ?
- Les **contraintes** : coût, dimensions, matériaux, sécurité, environnement…

*Exemple : « une lampe de bureau qui éclaire un plan de travail, réglable, coût < 15 €, matériaux recyclables ».*

## 3. Le prototypage
Un **prototype** est une **première version** de l'objet, construite pour **essayer** les solutions. On utilise le **carton**, l'**impression 3D**, une carte **microcontrôleur**…

Le prototype n'est pas parfait : il sert à **vérifier** que l'idée fonctionne.

## 4. Les tests et la validation
On **teste** le prototype pour vérifier qu'il respecte le **cahier des charges**. Si un test **échoue**, on **corrige** puis on recommence : c'est une **démarche itérative** (on répète pour améliorer).

Quand toutes les fonctions et contraintes sont satisfaites, l'objet est **validé**.

## L'essentiel à retenir
- La **démarche de projet** part du **besoin** et va jusqu'aux **tests**, par étapes.
- Le **cahier des charges** liste les **fonctions** (à quoi sert l'objet) et les **contraintes** (coût, dimensions…).
- Le **prototype** est une première version pour **essayer** les solutions.
- On **teste** puis on **corrige** (démarche **itérative**) jusqu'à la **validation** de l'objet.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'technologie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Modélisation et simulation', $json${
      "centre": "Modélisation et simulation",
      "branches": [
        { "titre": "Modèle numérique 3D", "enfants": ["Réalisé en CAO", "Forme et dimensions", "On tourne, coupe, mesure"] },
        { "titre": "Pourquoi modéliser ?", "enfants": ["Tester avant de fabriquer", "Corriger les erreurs", "Gain de temps et d'argent"] },
        { "titre": "Simulation", "enfants": ["Prévoir le comportement", "Mécanique, fluide, thermique", "Sans construire l'objet"] },
        { "titre": "Contraintes", "enfants": ["Résistance", "Encombrement", "Coût, matériau"] }
      ]
    }$json$),
    ('Objets connectés', $json${
      "centre": "Les objets connectés",
      "branches": [
        { "titre": "Objet connecté (IoT)", "enfants": ["Échange des données", "Internet des objets", "Montre, enceinte, ampoule"] },
        { "titre": "Capteur", "enfants": ["Mesure une grandeur physique", "Température, lumière, présence", "Entrée de la chaîne"] },
        { "titre": "Microcontrôleur", "enfants": ["Le cerveau (Arduino, micro:bit)", "Traite l'information", "capteur → traitement → actionneur"] },
        { "titre": "Transmission et domotique", "enfants": ["Wi-Fi, Bluetooth, 4G/5G", "Données vers le cloud", "Piloter la maison"] }
      ]
    }$json$),
    ('Algorithmes et programmation', $json${
      "centre": "Algorithmes et programmation",
      "branches": [
        { "titre": "Algorithme et programme", "enfants": ["Étapes ordonnées", "Écrit dans un langage", "Scratch ou Python"] },
        { "titre": "Variables", "enfants": ["Case mémoire nommée", "Contient une valeur", "score = 0"] },
        { "titre": "Conditions et boucles", "enfants": ["si… sinon : choisir", "boucle : répéter", "for, while"] },
        { "titre": "Fonctions", "enfants": ["Bloc nommé", "Réutilisable", "Évite de répéter le code"] }
      ]
    }$json$),
    ('Projet : concevoir un objet', $json${
      "centre": "Concevoir un objet",
      "branches": [
        { "titre": "Démarche de projet", "enfants": ["Partir du besoin", "Étapes ordonnées", "Jusqu'aux tests"] },
        { "titre": "Cahier des charges", "enfants": ["Fonction d'usage", "Contraintes", "Coût, dimensions, sécurité"] },
        { "titre": "Prototypage", "enfants": ["Première version", "Carton, impression 3D", "Essayer les solutions"] },
        { "titre": "Tests et validation", "enfants": ["Vérifier le cahier des charges", "Démarche itérative", "Corriger puis valider"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'technologie'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 049 a déjà créé les quiz Technologie 3e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Technologie', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11919999-0000-4000-8000-000000000001'::uuid, 'Modélisation et simulation'),
  ('11919999-0000-4000-8000-000000000002'::uuid, 'Objets connectés'),
  ('11919999-0000-4000-8000-000000000003'::uuid, 'Algorithmes et programmation'),
  ('11919999-0000-4000-8000-000000000004'::uuid, 'Projet : concevoir un objet')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'technologie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — Modélisation et simulation
  ('11910000-0000-4000-8000-000000000104'::uuid, 'Modélisation et simulation',
   'Que signifie CAO ?', 'mcq',
   '["Conception Assistée par Ordinateur", "Calcul Automatique des Objets", "Création Artistique en 3D", "Contrôle Assisté des Opérations"]', 0,
   'CAO signifie Conception Assistée par Ordinateur : on dessine l''objet avec un logiciel.', 4),
  ('11910000-0000-4000-8000-000000000105'::uuid, 'Modélisation et simulation',
   'À quoi sert principalement une simulation ?', 'mcq',
   '["Prévoir le comportement de l''objet sans le fabriquer", "Vendre l''objet plus cher", "Colorier l''objet", "Emballer l''objet"]', 0,
   'La simulation utilise le modèle pour prévoir le comportement (résistance, écoulement…) avant fabrication.', 5),
  ('11910000-0000-4000-8000-000000000106'::uuid, 'Modélisation et simulation',
   'Modéliser un objet avant de le fabriquer permet de gagner du temps et de l''argent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le modèle numérique permet de tester et corriger avant fabrication, ce qui évite de gaspiller matière et argent.', 6),
  ('11910000-0000-4000-8000-000000000107'::uuid, 'Modélisation et simulation',
   'Laquelle est une contrainte de conception ?', 'mcq',
   '["Résister à un effort sans casser", "Avoir un joli nom", "Être connu à la télé", "Plaire au professeur"]', 0,
   'La résistance mécanique est une contrainte : l''objet doit supporter les efforts prévus.', 7),
  ('11910000-0000-4000-8000-000000000108'::uuid, 'Modélisation et simulation',
   'Un modèle numérique 3D ne décrit que la couleur de l''objet.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il décrit surtout la forme et les dimensions (et parfois les matériaux), pas seulement la couleur.', 8),
  ('11910000-0000-4000-8000-000000000109'::uuid, 'Modélisation et simulation',
   'Une simulation mécanique sert à vérifier si une pièce : ', 'mcq',
   '["Se déforme ou casse sous un effort", "Sent bon", "Est bavarde", "Coûte cher à livrer"]', 0,
   'La simulation mécanique prévoit la déformation ou la rupture d''une pièce sous une charge.', 9),
  ('11910000-0000-4000-8000-000000000110'::uuid, 'Modélisation et simulation',
   'Quel outil utilise-t-on pour créer un modèle numérique en volume ?', 'mcq',
   '["Un logiciel de CAO", "Un tableur", "Un traitement de texte", "Une messagerie"]', 0,
   'On crée un modèle 3D avec un logiciel de CAO (Onshape, SketchUp, TinkerCAD…).', 10),

  -- Chapitre 2 — Objets connectés
  ('11910000-0000-4000-8000-000000000204'::uuid, 'Objets connectés',
   'Que signifie IoT ?', 'mcq',
   '["Internet des objets", "Image et texte", "Intelligence organisée", "Interface tactile"]', 0,
   'IoT (Internet of Things) signifie « Internet des objets ».', 4),
  ('11910000-0000-4000-8000-000000000205'::uuid, 'Objets connectés',
   'Quel composant transforme une grandeur physique en signal ?', 'mcq',
   '["Le capteur", "L''actionneur", "L''écran", "La batterie"]', 0,
   'Le capteur mesure une grandeur physique (température, lumière…) et la transforme en signal.', 5),
  ('11910000-0000-4000-8000-000000000206'::uuid, 'Objets connectés',
   'Dans un objet connecté, le microcontrôleur joue le rôle de « cerveau » qui traite l''information.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le microcontrôleur (Arduino, micro:bit…) lit les capteurs, exécute le programme et commande les actionneurs.', 6),
  ('11910000-0000-4000-8000-000000000207'::uuid, 'Objets connectés',
   'Quelle est la bonne chaîne d''information ?', 'mcq',
   '["Capteur → microcontrôleur → actionneur", "Actionneur → capteur → écran", "Écran → batterie → capteur", "Microcontrôleur → capteur → capteur"]', 0,
   'L''information va du capteur (entrée) au microcontrôleur (traitement) puis à l''actionneur (action).', 7),
  ('11910000-0000-4000-8000-000000000208'::uuid, 'Objets connectés',
   'Le Wi-Fi et le Bluetooth sont des liaisons sans fil.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Wi-Fi et Bluetooth permettent d''échanger des données sans câble, sur de courtes distances.', 8),
  ('11910000-0000-4000-8000-000000000209'::uuid, 'Objets connectés',
   'Qu''est-ce que la domotique ?', 'mcq',
   '["L''automatisation et le pilotage d''une maison", "L''art de dessiner des maisons", "Une matière de sport", "Un logiciel de dessin"]', 0,
   'La domotique automatise et pilote la maison (chauffage, éclairage, alarme…) pour plus de confort et de sécurité.', 9),
  ('11910000-0000-4000-8000-000000000210'::uuid, 'Objets connectés',
   'Un actionneur, par exemple un moteur ou une LED, sert à : ', 'mcq',
   '["Agir sur l''environnement", "Mesurer la température", "Stocker les données", "Se connecter au Wi-Fi"]', 0,
   'L''actionneur exécute une action (tourner, éclairer, sonner) commandée par le microcontrôleur.', 10),

  -- Chapitre 3 — Algorithmes et programmation
  ('11910000-0000-4000-8000-000000000304'::uuid, 'Algorithmes et programmation',
   'Qu''est-ce qu''un algorithme ?', 'mcq',
   '["Une suite d''étapes ordonnées qui résout un problème", "Un type d''ordinateur", "Un langage de programmation", "Un capteur"]', 0,
   'Un algorithme est une suite d''étapes ordonnées ; écrit dans un langage, il devient un programme.', 4),
  ('11910000-0000-4000-8000-000000000305'::uuid, 'Algorithmes et programmation',
   'À quoi sert une variable ?', 'mcq',
   '["À stocker une valeur dans une case mémoire nommée", "À répéter des instructions", "À dessiner un carré", "À connecter le Wi-Fi"]', 0,
   'Une variable est une case mémoire portant un nom, qui contient une valeur que l''on peut lire et modifier.', 5),
  ('11910000-0000-4000-8000-000000000306'::uuid, 'Algorithmes et programmation',
   'Une boucle permet de répéter des instructions.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La boucle répète des instructions sans les réécrire (répéter 10 fois, for, while).', 6),
  ('11910000-0000-4000-8000-000000000307'::uuid, 'Algorithmes et programmation',
   'Quelle structure permet à un programme de CHOISIR selon un test ?', 'mcq',
   '["La condition (si… sinon)", "La variable", "La fonction", "La boucle bornée"]', 0,
   'La condition (si / else) fait choisir selon que le test est vrai ou faux.', 7),
  ('11910000-0000-4000-8000-000000000308'::uuid, 'Algorithmes et programmation',
   'Une fonction sert surtout à réutiliser un bloc de code sans le réécrire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une fonction est un bloc nommé que l''on appelle par son nom ; elle évite de répéter le même code.', 8),
  ('11910000-0000-4000-8000-000000000309'::uuid, 'Algorithmes et programmation',
   'En Python, comment met-on la variable score à 0 ?', 'mcq',
   '["score = 0", "0 = score", "score == 0 fois", "print(score)"]', 0,
   'On affecte une valeur avec « = » : score = 0.', 9),
  ('11910000-0000-4000-8000-000000000310'::uuid, 'Algorithmes et programmation',
   'Pour tracer un carré, quelle boucle est la plus adaptée ?', 'mcq',
   '["Répéter 4 fois : avancer, tourner", "Répéter tant qu''il pleut", "Ne rien répéter", "Répéter 100 fois : attendre"]', 0,
   'Un carré a 4 côtés : on répète 4 fois « avancer puis tourner de 90° ».', 10),

  -- Chapitre 4 — Projet : concevoir un objet
  ('11910000-0000-4000-8000-000000000404'::uuid, 'Projet : concevoir un objet',
   'Par quoi commence en général la démarche de projet ?', 'mcq',
   '["Par identifier le besoin", "Par vendre l''objet", "Par jeter le prototype", "Par choisir la couleur"]', 0,
   'On part toujours du besoin : à quel problème l''objet doit-il répondre ?', 4),
  ('11910000-0000-4000-8000-000000000405'::uuid, 'Projet : concevoir un objet',
   'Que contient le cahier des charges ?', 'mcq',
   '["Les fonctions à remplir et les contraintes à respecter", "La liste des élèves", "Le prix de vente uniquement", "Les horaires de cours"]', 0,
   'Le cahier des charges liste les fonctions de l''objet et les contraintes (coût, dimensions, sécurité…).', 5),
  ('11910000-0000-4000-8000-000000000406'::uuid, 'Projet : concevoir un objet',
   'Un prototype est une première version de l''objet, construite pour essayer les solutions.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le prototype sert à vérifier que l''idée fonctionne ; il n''est pas encore parfait.', 6),
  ('11910000-0000-4000-8000-000000000407'::uuid, 'Projet : concevoir un objet',
   'À quoi servent les tests du prototype ?', 'mcq',
   '["Vérifier qu''il respecte le cahier des charges", "Le rendre plus lourd", "Le cacher", "Augmenter son prix"]', 0,
   'On teste le prototype pour vérifier qu''il remplit les fonctions et respecte les contraintes.', 7),
  ('11910000-0000-4000-8000-000000000408'::uuid, 'Projet : concevoir un objet',
   'Si un test échoue, on abandonne définitivement le projet.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on corrige puis on recommence. La démarche est itérative (on répète pour améliorer).', 8),
  ('11910000-0000-4000-8000-000000000409'::uuid, 'Projet : concevoir un objet',
   'La « fonction d''usage » d''un objet désigne : ', 'mcq',
   '["Ce à quoi il sert", "Sa couleur", "Son poids exact", "Son vendeur"]', 0,
   'La fonction d''usage répond à la question « à quoi sert l''objet ? ».', 9),
  ('11910000-0000-4000-8000-000000000410'::uuid, 'Projet : concevoir un objet',
   'Quel matériau est souvent utilisé pour un premier prototype rapide ?', 'mcq',
   '["Le carton", "Le diamant", "Le marbre", "L''or"]', 0,
   'Le carton (ou l''impression 3D) permet de fabriquer vite et à bas coût un premier prototype.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'technologie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPES — lessons.content de « Exercices types » (position 2)
--    2 exercices corrigés par chapitre. Même motif que la section 1, mais sur
--    la leçon d'exercices ; garde IS DISTINCT FROM.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Modélisation et simulation', $md$# Exercices types — Modélisation et simulation

## Exercice 1 — Vrai / Faux sur le modèle numérique
Pour chaque affirmation, indique si elle est **vraie** ou **fausse** et justifie.

1. Un modèle numérique 3D se réalise avec un logiciel de CAO.
2. La simulation oblige à fabriquer l'objet avant de le tester.
3. Modéliser permet de corriger une erreur avant la fabrication.
4. Une contrainte de résistance concerne la couleur de l'objet.

### Correction
1. **Vrai** : la CAO (Conception Assistée par Ordinateur) sert à créer le modèle 3D.
2. **Faux** : la simulation prévoit le comportement **sans** construire l'objet.
3. **Vrai** : c'est tout l'intérêt du modèle, corriger avant de dépenser matière et temps.
4. **Faux** : la résistance concerne la capacité à supporter un effort sans casser, pas la couleur.

## Exercice 2 — Choisir la bonne simulation
On veut vérifier trois choses sur un cadre de vélo. Associe chaque question au bon type de simulation (**mécanique**, **fluide** ou **thermique**).

- a) Le cadre casse-t-il sous le poids du cycliste ?
- b) Comment l'air s'écoule-t-il autour du cadre à grande vitesse ?
- c) Comment la chaleur du freinage se répartit-elle ?

### Correction
- a) → simulation **mécanique** (résistance à un effort).
- b) → simulation de **fluides** (écoulement de l'air).
- c) → simulation **thermique** (répartition de la chaleur).
On choisit toujours la simulation selon la **grandeur** que l'on veut prévoir.$md$),

    ('Objets connectés', $md$# Exercices types — Objets connectés

## Exercice 1 — Compléter la chaîne d'information
Un éclairage automatique s'allume quand quelqu'un entre dans une pièce. Complète la chaîne avec les mots : **capteur de présence**, **microcontrôleur**, **lampe (actionneur)**.

`____________  →  ____________  →  ____________`

Explique ensuite le rôle de chaque élément.

### Correction
`capteur de présence  →  microcontrôleur  →  lampe (actionneur)`
- Le **capteur de présence** détecte la personne (entrée, il mesure).
- Le **microcontrôleur** traite l'information et décide d'allumer.
- La **lampe** est l'**actionneur** : elle agit sur l'environnement (elle éclaire).

## Exercice 2 — Objet connecté ou non ?
Pour chaque objet, dis s'il est **connecté** (échange des données) ou **non connecté**, et pourquoi.

1. Une montre qui compte les pas et les envoie sur un smartphone.
2. Un réveil mécanique à aiguilles.
3. Un thermostat piloté depuis une application.
4. Une lampe de poche à pile.

### Correction
1. **Connecté** : elle transmet des données (les pas) à un smartphone.
2. **Non connecté** : il fonctionne seul, sans échange de données.
3. **Connecté** : il communique avec une application (domotique).
4. **Non connecté** : elle éclaire sans échanger d'information.
Un objet est **connecté** dès qu'il **échange des données** avec un autre appareil ou Internet (IoT).$md$),

    ('Algorithmes et programmation', $md$# Exercices types — Algorithmes et programmation

## Exercice 1 — Compléter un algorithme
On veut afficher « majeur » si l'âge est supérieur ou égal à 18, sinon « mineur ». Complète les trous :

```
demander age
si age ____ 18 alors
    afficher "____"
sinon
    afficher "____"
```

### Correction
```
demander age
si age >= 18 alors
    afficher "majeur"
sinon
    afficher "mineur"
```
La **condition** `si… sinon` fait **choisir** entre deux affichages selon le test `age >= 18`.

## Exercice 2 — Que trace ce programme ?
On exécute le programme suivant avec un lutin qui avance et tourne :

```
répéter 4 fois :
    avancer de 100
    tourner de 90 degrés
```

1. Quelle figure obtient-on ?
2. Comment appelle-t-on la structure « répéter 4 fois » ?
3. Que faudrait-il changer pour tracer un triangle équilatéral ?

### Correction
1. On obtient un **carré** (4 côtés égaux, angles de 90°).
2. C'est une **boucle bornée** (on répète un nombre connu de fois).
3. Pour un triangle : **répéter 3 fois**, et **tourner de 120°** (car 360 ÷ 3 = 120°).$md$),

    ('Projet : concevoir un objet', $md$# Exercices types — Projet : concevoir un objet

## Exercice 1 — Remettre la démarche dans l'ordre
Voici les étapes d'un projet, mélangées. Range-les dans le bon ordre :

- A. Tester et améliorer
- B. Identifier le besoin
- C. Fabriquer un prototype
- D. Rédiger le cahier des charges
- E. Imaginer des solutions

### Correction
Ordre correct : **B → D → E → C → A**
1. **B** Identifier le besoin (à quel problème répond l'objet ?).
2. **D** Rédiger le cahier des charges (fonctions + contraintes).
3. **E** Imaginer des solutions.
4. **C** Fabriquer un prototype.
5. **A** Tester et améliorer (démarche itérative).

## Exercice 2 — Lire un cahier des charges
Cahier des charges d'une lampe de bureau : « éclaire un plan de travail, orientable, coût inférieur à 15 €, matériaux recyclables ».

1. Quelle est la **fonction d'usage** de l'objet ?
2. Cite **deux contraintes** du cahier des charges.
3. Une lampe qui coûte 25 € respecte-t-elle ce cahier des charges ? Pourquoi ?

### Correction
1. Fonction d'usage : **éclairer un plan de travail**.
2. Deux contraintes (au choix) : **coût < 15 €**, **matériaux recyclables**, **orientable**.
3. **Non** : elle coûte 25 €, elle ne respecte pas la contrainte de **coût inférieur à 15 €**. Une seule contrainte non respectée suffit à invalider la solution.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'technologie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
