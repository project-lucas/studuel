-- =============================================================================
-- Studuel — Migration 110 : CONTENU Technologie 4e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de Technologie 4e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de la migration de structure)
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
-- PRÉREQUIS : structure (subjects/chapters/lessons), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Chaîne d''information et d''énergie', $md$# Chaîne d'information et d'énergie

## Ce que tu vas comprendre
Tout objet technique qui « fait quelque chose » repose sur deux chaînes qui travaillent ensemble : la **chaîne d'information** (elle décide) et la **chaîne d'énergie** (elle agit). Ce chapitre t'apprend à repérer ces deux chaînes et le rôle de chaque bloc.

## 1. Deux chaînes reliées
Dans un objet comme un portail automatique ou un sèche-mains, la **chaîne d'information** capte et traite les informations, puis **commande** la chaîne d'énergie, qui fournit la force pour agir. L'une pense, l'autre exécute.

## 2. La chaîne d'information : ACQUÉRIR, TRAITER, COMMUNIQUER
- **Acquérir** : le **capteur** relève une grandeur physique (présence, lumière, température, distance). Exemple : un capteur infrarouge détecte une main.
- **Traiter** : une **carte programmable** (microcontrôleur) analyse l'information et décide quoi faire.
- **Communiquer** : le système transmet une information à l'utilisateur (voyant, écran, message) ou à la chaîne d'énergie.

*Exemple : sur un éclairage automatique, le capteur détecte la nuit → le programme décide → une LED signale l'état.*

## 3. La chaîne d'énergie : ALIMENTER, DISTRIBUER, CONVERTIR, AGIR
- **Alimenter** : fournir l'énergie (secteur, pile, batterie, panneau solaire).
- **Distribuer** : laisser passer ou couper l'énergie au bon moment (interrupteur, relais).
- **Convertir** : transformer l'énergie en une autre forme utile (moteur = énergie électrique → mouvement).
- **Agir** : l'**actionneur** produit l'effet attendu (le moteur tourne, la lampe éclaire).

## 4. Capteurs et actionneurs : ne pas confondre
- Un **capteur** entre de l'information dans le système (il « lit » le monde).
- Un **actionneur** produit une action sur le monde (moteur, lampe, buzzer, vérin).

*Le capteur est au début de la chaîne d'information ; l'actionneur est à la fin de la chaîne d'énergie.*

## L'essentiel à retenir
- Un objet technique associe une **chaîne d'information** (décide) et une **chaîne d'énergie** (agit).
- Chaîne d'information : **acquérir** (capteur) → **traiter** (carte programmable) → **communiquer**.
- Chaîne d'énergie : **alimenter** → **distribuer** → **convertir** → **agir** (actionneur).
- **Capteur** = entrée d'information ; **actionneur** = sortie qui agit.$md$),

    ('La programmation par blocs', $md$# La programmation par blocs

## Ce que tu vas comprendre
Programmer, c'est écrire une suite d'instructions qu'une machine exécute. Avec un logiciel comme **Scratch**, on assemble des **blocs** au lieu d'écrire du texte : c'est plus simple pour construire un **algorithme** juste.

## 1. Algorithme et programme
Un **algorithme** est une suite d'étapes ordonnées pour résoudre un problème. Le **programme** est la traduction de cet algorithme dans un langage compris par la machine. Dans Scratch, chaque bloc est une instruction.

*Exemple d'algorithme : « avancer de 10 pas, puis tourner de 90° ».*

## 2. Les événements (déclencheurs)
Un **événement** lance le programme : « quand le drapeau vert est cliqué », « quand la touche espace est pressée ». Sans événement de départ, rien ne s'exécute.

## 3. Les boucles (répéter)
Une **boucle** répète des instructions sans les réécrire.
- **répéter 4 fois** : exécute un bloc 4 fois (utile pour tracer un carré).
- **répéter indéfiniment** : recommence tant que le programme tourne.

*Une boucle évite de copier dix fois la même instruction.*

## 4. Les conditions (si… alors)
Une **condition** fait un choix selon une situation : **si** (lutin touche le bord) **alors** (rebondir). Le bloc **si… sinon** permet deux comportements différents.

*Exemple : si le score > 10 alors afficher « Gagné ! ».*

## 5. Les variables
Une **variable** est une case mémoire qui garde une valeur pouvant changer : un **score**, un **chronomètre**, un nombre de vies. On peut la **créer**, lui **donner** une valeur, ou l'**augmenter**.

## L'essentiel à retenir
- Un **algorithme** est une suite d'étapes ordonnées ; le **programme** est sa traduction en blocs.
- Un **événement** (« quand… ») déclenche l'exécution.
- Une **boucle** répète des instructions ; une **condition** (« si… alors ») fait un choix.
- Une **variable** mémorise une valeur qui peut changer (score, temps…).$md$),

    ('Réseaux et internet', $md$# Réseaux et internet

## Ce que tu vas comprendre
Un **réseau** relie des appareils pour qu'ils échangent des données. **Internet** est le plus grand réseau du monde : il relie des millions de réseaux. Ce chapitre explique comment les machines se trouvent et se parlent.

## 1. Qu'est-ce qu'un réseau ?
Un **réseau informatique** relie plusieurs appareils (ordinateurs, tablettes, imprimantes) pour partager des données. Un **réseau local** (LAN) couvre un petit espace : une salle de classe, une maison, reliés par câble ou **Wi-Fi**.

## 2. Client et serveur
- Le **client** est l'appareil qui **demande** une information (ton navigateur).
- Le **serveur** est l'ordinateur qui **stocke** les données et **répond** à la demande.

*Exemple : quand tu ouvres un site, ton navigateur (client) demande la page au serveur, qui la renvoie.*

## 3. L'adresse IP
Chaque appareil connecté possède une **adresse IP** unique sur le réseau, comme une adresse postale. Elle permet d'**identifier** l'appareil pour lui envoyer les bonnes données.

## 4. Les protocoles
Un **protocole** est un ensemble de règles que les machines respectent pour se comprendre.
- **HTTP / HTTPS** : pour consulter des pages web (HTTPS est sécurisé).
- **IP** : pour l'adressage et l'acheminement des données.

*Sans protocole commun, deux machines ne pourraient pas se comprendre.*

## 5. Le web n'est pas internet
- **Internet** est l'**infrastructure** : le réseau mondial de câbles et d'appareils.
- Le **web** est un **service** qui circule sur internet : l'ensemble des pages reliées par des liens, consultées avec un navigateur.

## L'essentiel à retenir
- Un **réseau** relie des appareils pour partager des données ; un **réseau local** couvre un petit espace (câble ou Wi-Fi).
- Le **client** demande, le **serveur** stocke et répond.
- L'**adresse IP** identifie chaque appareil, comme une adresse postale.
- Un **protocole** (HTTP, IP…) fixe les règles d'échange ; le **web** est un service qui circule sur **internet**.$md$),

    ('Prototypage', $md$# Prototypage

## Ce que tu vas comprendre
Avant de fabriquer un objet pour de bon, on construit un **prototype** : une première version qu'on teste et qu'on améliore. Ce chapitre t'apprend la **démarche de projet** et les outils pour prototyper.

## 1. La démarche de projet
Un projet technique suit des grandes étapes ordonnées :
1. **Analyser le besoin** : à quoi doit servir l'objet, pour qui ?
2. **Rechercher des idées** : imaginer plusieurs solutions.
3. **Concevoir** : choisir une solution et la dessiner (croquis, plan, modèle 3D).
4. **Réaliser un prototype** puis **tester** et **améliorer**.

## 2. Maquette et prototype
- Une **maquette** représente l'objet, souvent à une **échelle réduite**, pour visualiser sa forme.
- Un **prototype** est une version **fonctionnelle** que l'on peut essayer pour vérifier qu'elle marche.

*La maquette montre à quoi ça ressemble ; le prototype montre si ça fonctionne.*

## 3. La modélisation 3D et l'impression 3D
On dessine l'objet dans un logiciel de **modélisation 3D** (comme un plan en volume). L'**imprimante 3D** fabrique ensuite l'objet **couche par couche**, souvent en plastique fondu, à partir de ce modèle numérique.

*L'impression 3D permet de fabriquer rapidement une pièce sur mesure.*

## 4. Tester et améliorer
On **teste** le prototype pour voir s'il répond au besoin. Si un défaut apparaît, on **corrige** puis on refait un essai. Ce cycle **tester → améliorer** se répète jusqu'à obtenir un objet satisfaisant.

## 5. Le cahier des charges
Le **cahier des charges** est le document de départ : il liste les **contraintes** et les **fonctions** que l'objet doit respecter. Il sert de référence pour vérifier que le prototype convient.

## L'essentiel à retenir
- La **démarche de projet** : analyser le besoin → rechercher → concevoir → réaliser → tester.
- Une **maquette** montre la forme (échelle réduite) ; un **prototype** est une version qu'on peut essayer.
- La **modélisation 3D** puis l'**impression 3D** (couche par couche) fabriquent une pièce à partir d'un modèle numérique.
- On **teste** puis on **améliore** en boucle, en vérifiant le **cahier des charges**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'technologie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Chaîne d''information et d''énergie', $json${
      "centre": "Chaîne d'information et d'énergie",
      "branches": [
        { "titre": "Deux chaînes", "enfants": ["Information = décide", "Énergie = agit", "L'info commande l'énergie"] },
        { "titre": "Chaîne d'information", "enfants": ["Acquérir (capteur)", "Traiter (carte programmable)", "Communiquer"] },
        { "titre": "Chaîne d'énergie", "enfants": ["Alimenter, distribuer", "Convertir, agir", "Actionneur = moteur, lampe"] },
        { "titre": "Capteur ≠ actionneur", "enfants": ["Capteur = entrée d'info", "Actionneur = action sur le monde", "Début vs fin de chaîne"] }
      ]
    }$json$),
    ('La programmation par blocs', $json${
      "centre": "Programmation par blocs",
      "branches": [
        { "titre": "Algorithme et programme", "enfants": ["Suite d'étapes ordonnées", "Traduit en blocs Scratch", "Chaque bloc = 1 instruction"] },
        { "titre": "Événements", "enfants": ["Quand drapeau cliqué", "Quand touche pressée", "Déclenche le programme"] },
        { "titre": "Boucles et conditions", "enfants": ["Répéter N fois / indéfiniment", "Si… alors (choix)", "Si… sinon"] },
        { "titre": "Variables", "enfants": ["Case mémoire", "Score, chrono, vies", "Valeur qui change"] }
      ]
    }$json$),
    ('Réseaux et internet', $json${
      "centre": "Réseaux et internet",
      "branches": [
        { "titre": "Réseau", "enfants": ["Relie des appareils", "Partage de données", "Réseau local : câble / Wi-Fi"] },
        { "titre": "Client et serveur", "enfants": ["Client demande", "Serveur stocke et répond", "Navigateur ↔ serveur"] },
        { "titre": "Adresse IP", "enfants": ["Identifiant unique", "Comme une adresse postale", "Achemine les données"] },
        { "titre": "Protocoles et web", "enfants": ["Règles d'échange (HTTP, IP)", "Internet = infrastructure", "Web = service de pages"] }
      ]
    }$json$),
    ('Prototypage', $json${
      "centre": "Prototypage",
      "branches": [
        { "titre": "Démarche de projet", "enfants": ["Analyser le besoin", "Rechercher, concevoir", "Réaliser puis tester"] },
        { "titre": "Maquette vs prototype", "enfants": ["Maquette = forme (réduite)", "Prototype = fonctionnel", "Montre si ça marche"] },
        { "titre": "3D", "enfants": ["Modélisation 3D (logiciel)", "Impression couche par couche", "Pièce sur mesure"] },
        { "titre": "Tester et cahier des charges", "enfants": ["Tester → améliorer en boucle", "Corriger les défauts", "Vérifier les contraintes"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'technologie'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal la migration de structure a déjà créé les quiz 4e ; ce
--     bloc ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Technologie', '4e', v.chapter, true, l.id
FROM (VALUES
  ('11019999-0000-4000-8000-000000000001'::uuid, 'Chaîne d''information et d''énergie'),
  ('11019999-0000-4000-8000-000000000002'::uuid, 'La programmation par blocs'),
  ('11019999-0000-4000-8000-000000000003'::uuid, 'Réseaux et internet'),
  ('11019999-0000-4000-8000-000000000004'::uuid, 'Prototypage')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'technologie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
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
  -- Chapitre 1 — Chaîne d'information et d'énergie
  ('11010000-0000-4000-8000-000000000104'::uuid, 'Chaîne d''information et d''énergie',
   'Quel élément relève une grandeur physique comme la présence ou la lumière ?', 'mcq',
   '["Le capteur", "Le moteur", "La pile", "La lampe"]', 0,
   'Le capteur « acquiert » l''information en relevant une grandeur physique (présence, lumière, température…).', 4),
  ('11010000-0000-4000-8000-000000000105'::uuid, 'Chaîne d''information et d''énergie',
   'Dans la chaîne d''information, quel est l''ordre correct des fonctions ?', 'mcq',
   '["Acquérir, traiter, communiquer", "Traiter, acquérir, communiquer", "Alimenter, convertir, agir", "Communiquer, acquérir, traiter"]', 0,
   'La chaîne d''information suit : acquérir (capteur) → traiter (carte) → communiquer.', 5),
  ('11010000-0000-4000-8000-000000000106'::uuid, 'Chaîne d''information et d''énergie',
   'Un moteur qui fait tourner un portail est un actionneur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''actionneur produit l''action attendue ; le moteur convertit l''énergie électrique en mouvement.', 6),
  ('11010000-0000-4000-8000-000000000107'::uuid, 'Chaîne d''information et d''énergie',
   'Quelle fonction de la chaîne d''énergie fournit l''énergie au système ?', 'mcq',
   '["Alimenter", "Traiter", "Acquérir", "Communiquer"]', 0,
   'Alimenter, c''est fournir l''énergie (secteur, pile, batterie, panneau solaire).', 7),
  ('11010000-0000-4000-8000-000000000108'::uuid, 'Chaîne d''information et d''énergie',
   'À quoi sert la fonction « convertir » dans la chaîne d''énergie ?', 'mcq',
   '["Transformer l''énergie en une autre forme utile", "Détecter une présence", "Afficher un message", "Couper le courant"]', 0,
   'Convertir transforme l''énergie : un moteur change l''énergie électrique en mouvement.', 8),
  ('11010000-0000-4000-8000-000000000109'::uuid, 'Chaîne d''information et d''énergie',
   'Un capteur produit une action directe sur le monde extérieur.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le capteur fait ENTRER de l''information ; c''est l''actionneur qui agit sur le monde.', 9),
  ('11010000-0000-4000-8000-000000000110'::uuid, 'Chaîne d''information et d''énergie',
   'Quel composant « traite » l''information et décide quoi faire ?', 'mcq',
   '["La carte programmable (microcontrôleur)", "Le capteur", "L''actionneur", "La batterie"]', 0,
   'La carte programmable analyse l''information acquise et commande la chaîne d''énergie.', 10),

  -- Chapitre 2 — La programmation par blocs
  ('11010000-0000-4000-8000-000000000204'::uuid, 'La programmation par blocs',
   'Qu''est-ce qu''un algorithme ?', 'mcq',
   '["Une suite d''étapes ordonnées pour résoudre un problème", "Un composant électronique", "Un type de capteur", "Une adresse réseau"]', 0,
   'Un algorithme est une suite d''étapes ordonnées ; le programme en est la traduction en blocs.', 4),
  ('11010000-0000-4000-8000-000000000205'::uuid, 'La programmation par blocs',
   'Dans Scratch, que fait un bloc « répéter 4 fois » ?', 'mcq',
   '["Il exécute les instructions 4 fois", "Il attend 4 secondes", "Il crée 4 variables", "Il arrête le programme"]', 0,
   'C''est une boucle : elle répète les instructions le nombre de fois indiqué (ici 4).', 5),
  ('11010000-0000-4000-8000-000000000206'::uuid, 'La programmation par blocs',
   'Un bloc « quand le drapeau vert est cliqué » est un événement.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un événement déclenche l''exécution du programme (« quand… »).', 6),
  ('11010000-0000-4000-8000-000000000207'::uuid, 'La programmation par blocs',
   'Quel bloc permet de faire un choix selon une situation ?', 'mcq',
   '["Si… alors", "Répéter indéfiniment", "Avancer de 10 pas", "Créer une variable"]', 0,
   'La condition « si… alors » fait un choix ; « si… sinon » propose deux comportements.', 7),
  ('11010000-0000-4000-8000-000000000208'::uuid, 'La programmation par blocs',
   'À quoi sert une variable dans un programme ?', 'mcq',
   '["À mémoriser une valeur qui peut changer", "À couper l''alimentation", "À souder des composants", "À imprimer en 3D"]', 0,
   'Une variable est une case mémoire : score, chronomètre, nombre de vies…', 8),
  ('11010000-0000-4000-8000-000000000209'::uuid, 'La programmation par blocs',
   'Une boucle sert à répéter des instructions sans les réécrire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La boucle évite de copier plusieurs fois la même instruction.', 9),
  ('11010000-0000-4000-8000-000000000210'::uuid, 'La programmation par blocs',
   'Que représente le « programme » par rapport à l''algorithme ?', 'mcq',
   '["La traduction de l''algorithme dans un langage compris par la machine", "Un défaut du logiciel", "Un capteur de lumière", "Un câble réseau"]', 0,
   'Le programme est l''algorithme traduit en instructions (ici en blocs) exécutables par la machine.', 10),

  -- Chapitre 3 — Réseaux et internet
  ('11010000-0000-4000-8000-000000000304'::uuid, 'Réseaux et internet',
   'À quoi sert un réseau informatique ?', 'mcq',
   '["À relier des appareils pour partager des données", "À produire de l''électricité", "À imprimer en 3D", "À mesurer une température"]', 0,
   'Un réseau relie des appareils (ordinateurs, tablettes, imprimantes) pour échanger des données.', 4),
  ('11010000-0000-4000-8000-000000000305'::uuid, 'Réseaux et internet',
   'Dans une relation client-serveur, qui répond à la demande ?', 'mcq',
   '["Le serveur", "Le client", "Le capteur", "Le navigateur seul"]', 0,
   'Le client demande, le serveur stocke les données et répond à la demande.', 5),
  ('11010000-0000-4000-8000-000000000306'::uuid, 'Réseaux et internet',
   'Une adresse IP identifie un appareil sur le réseau.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''adresse IP est unique et identifie l''appareil, comme une adresse postale.', 6),
  ('11010000-0000-4000-8000-000000000307'::uuid, 'Réseaux et internet',
   'Qu''est-ce qu''un protocole ?', 'mcq',
   '["Un ensemble de règles que les machines respectent pour se comprendre", "Un type de câble", "Un moteur électrique", "Un logiciel de dessin 3D"]', 0,
   'Un protocole (HTTP, IP…) fixe les règles d''échange pour que les machines se comprennent.', 7),
  ('11010000-0000-4000-8000-000000000308'::uuid, 'Réseaux et internet',
   'Le web et internet sont exactement la même chose.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : internet est l''infrastructure (réseau mondial) ; le web est un service (pages) qui circule dessus.', 8),
  ('11010000-0000-4000-8000-000000000309'::uuid, 'Réseaux et internet',
   'Un réseau qui couvre une seule salle de classe s''appelle un :', 'mcq',
   '["Réseau local (LAN)", "Serveur mondial", "Protocole HTTP", "Actionneur"]', 0,
   'Un réseau local (LAN) couvre un petit espace, relié par câble ou Wi-Fi.', 9),
  ('11010000-0000-4000-8000-000000000310'::uuid, 'Réseaux et internet',
   'Quel protocole sécurisé sert à consulter des pages web ?', 'mcq',
   '["HTTPS", "USB", "3D", "LAN"]', 0,
   'HTTPS est la version sécurisée de HTTP pour consulter des pages web.', 10),

  -- Chapitre 4 — Prototypage
  ('11010000-0000-4000-8000-000000000404'::uuid, 'Prototypage',
   'Quelle est la première étape d''une démarche de projet ?', 'mcq',
   '["Analyser le besoin", "Imprimer en 3D", "Vendre l''objet", "Jeter le prototype"]', 0,
   'On commence par analyser le besoin : à quoi doit servir l''objet, et pour qui ?', 4),
  ('11010000-0000-4000-8000-000000000405'::uuid, 'Prototypage',
   'Quelle est la différence entre une maquette et un prototype ?', 'mcq',
   '["La maquette montre la forme, le prototype est fonctionnel", "Ce sont deux mots pour la même chose", "La maquette fonctionne, la maquette pas", "Le prototype est toujours plus petit"]', 0,
   'La maquette représente la forme (souvent à échelle réduite) ; le prototype est une version qu''on peut essayer.', 5),
  ('11010000-0000-4000-8000-000000000406'::uuid, 'Prototypage',
   'Une imprimante 3D fabrique un objet couche par couche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''impression 3D dépose la matière couche par couche à partir d''un modèle numérique.', 6),
  ('11010000-0000-4000-8000-000000000407'::uuid, 'Prototypage',
   'Que fait-on après avoir testé un prototype qui a un défaut ?', 'mcq',
   '["On le corrige puis on refait un essai", "On abandonne définitivement le projet", "On l''imprime sans rien changer", "On supprime le cahier des charges"]', 0,
   'Le cycle « tester → améliorer » se répète : on corrige puis on teste à nouveau.', 7),
  ('11010000-0000-4000-8000-000000000408'::uuid, 'Prototypage',
   'À quoi sert un logiciel de modélisation 3D ?', 'mcq',
   '["À dessiner l''objet en volume avant de le fabriquer", "À couper le courant", "À mesurer une adresse IP", "À détecter une présence"]', 0,
   'La modélisation 3D crée un modèle numérique en volume, base de l''impression 3D.', 8),
  ('11010000-0000-4000-8000-000000000409'::uuid, 'Prototypage',
   'Le cahier des charges liste les contraintes et fonctions que l''objet doit respecter.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le cahier des charges sert de référence pour vérifier que le prototype convient.', 9),
  ('11010000-0000-4000-8000-000000000410'::uuid, 'Prototypage',
   'Pourquoi réalise-t-on un prototype avant la fabrication finale ?', 'mcq',
   '["Pour tester la solution et l''améliorer avant de fabriquer pour de bon", "Pour vendre plus cher", "Pour éviter de dessiner", "Pour supprimer les tests"]', 0,
   'Le prototype permet d''essayer, de repérer les défauts et d''améliorer avant la fabrication finale.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'technologie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
