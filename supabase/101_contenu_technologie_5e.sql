-- =============================================================================
-- Studuel — Migration 101 : CONTENU Technologie 5e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de Technologie 5e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
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
-- PRÉREQUIS : subjects/chapters/lessons (Technologie 5e), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le fonctionnement d''un objet technique', $md$# Le fonctionnement d'un objet technique

## Ce que tu vas comprendre
Tout objet technique existe pour **rendre un service** à l'humain. Ce chapitre t'apprend à passer du **besoin** à l'objet, en distinguant ce à quoi il sert, les **fonctions** qu'il doit assurer et les **solutions** choisies par les concepteurs.

## 1. Du besoin à l'objet technique
Un **objet technique** est fabriqué par l'humain pour **répondre à un besoin**. Le besoin, c'est ce qui manque à l'utilisateur : se déplacer, se protéger de la pluie, communiquer…

*Exemple : le besoin « me protéger de la pluie » a donné naissance au **parapluie**.*

## 2. La fonction d'usage et la fonction d'estime
- La **fonction d'usage** répond à la question : *« À quoi sert l'objet ? »* C'est le service rendu.
- La **fonction d'estime** répond à : *« Pourquoi l'utilisateur le choisit-il plutôt qu'un autre ? »* C'est ce qui plaît (couleur, forme, marque, design).

*Exemple : la fonction d'usage d'une montre est de **donner l'heure** ; sa fonction d'estime peut être son **look** ou sa marque.*

## 3. Les fonctions techniques
Pour assurer sa fonction d'usage, l'objet doit remplir plusieurs **fonctions techniques** : ce que doit faire chaque partie de l'objet.

*Exemple pour un vélo : « transmettre le mouvement », « diriger », « freiner », « porter l'utilisateur ».*

## 4. Les solutions techniques
Une **solution technique** est le **moyen concret** choisi pour réaliser une fonction technique. Une même fonction peut être remplie par **plusieurs** solutions.

*Exemple : la fonction « freiner » d'un vélo peut être assurée par des **freins à patins** OU des **freins à disque**.*

## 5. Chaîne d'énergie et chaîne d'information
Dans un objet automatisé, on distingue :
- la **chaîne d'énergie** : elle *alimente*, *distribue*, *convertit* et *transmet* l'énergie pour agir (ex : le moteur qui fait tourner les roues) ;
- la **chaîne d'information** : elle *acquiert* (capteurs), *traite* et *communique* l'information pour commander (ex : le bouton qui déclenche).

## L'essentiel à retenir
- Un objet technique répond à un **besoin**.
- **Fonction d'usage** = à quoi il sert ; **fonction d'estime** = pourquoi il plaît.
- Les **fonctions techniques** décrivent ce que fait chaque partie ; les **solutions techniques** sont les moyens concrets choisis.
- Une même fonction technique peut avoir **plusieurs** solutions techniques.$md$),

    ('Matériaux et familles', $md$# Matériaux et familles

## Ce que tu vas comprendre
Chaque objet est fabriqué dans un ou plusieurs **matériaux**. Ce chapitre t'apprend à **classer** les matériaux en grandes familles, à comprendre leurs **propriétés**, et à voir pourquoi le choix d'un matériau n'est jamais un hasard.

## 1. Les grandes familles de matériaux
On regroupe les matériaux en quatre grandes familles :
- les **métaux** (fer, aluminium, cuivre…) : solides, souvent conducteurs, recyclables ;
- les **matières plastiques** (issues du pétrole) : légères, faciles à mouler, isolantes ;
- les **céramiques et verres** : durs, résistants à la chaleur, mais cassants (fragiles) ;
- les **matériaux organiques** (bois, cuir, papier…) : issus du vivant, souvent renouvelables.

## 2. Les propriétés d'un matériau
Choisir un matériau, c'est regarder ses **propriétés** :
- **mécaniques** : dureté, résistance, souplesse ;
- **physiques** : masse (léger/lourd), conductivité (électrique, thermique) ;
- **esthétiques** : couleur, aspect, toucher ;
- **environnementales** : recyclable, renouvelable, coût.

*Exemple : on choisit l'**aluminium** pour un cadre de vélo car il est **léger** ET **résistant**.*

## 3. Le choix d'un matériau
Le concepteur choisit le matériau selon la **fonction** de l'objet, son **coût**, sa **durée de vie** et son **impact sur l'environnement**. C'est toujours un **compromis**.

*Exemple : une bouteille peut être en **verre** (recyclable, mais lourd et cassant) ou en **plastique** (léger, mais polluant).*

## 4. Le cycle de vie et le recyclage
Un matériau a un **cycle de vie** : extraction → fabrication → utilisation → fin de vie. **Recycler**, c'est réutiliser la matière d'un objet usagé pour en fabriquer un nouveau, ce qui **économise** les ressources et l'énergie.

## L'essentiel à retenir
- Quatre familles : **métaux**, **plastiques**, **céramiques/verres**, **organiques**.
- Un matériau se décrit par ses **propriétés** (mécaniques, physiques, esthétiques, environnementales).
- Le choix d'un matériau est un **compromis** entre fonction, coût, durée de vie et impact.
- **Recycler** réutilise la matière et économise les ressources.$md$),

    ('Croquis et schémas', $md$# Croquis et schémas

## Ce que tu vas comprendre
Pour concevoir ou expliquer un objet, on ne se contente pas de mots : on **dessine**. Ce chapitre t'apprend à distinguer le **croquis** du **schéma**, à respecter une **échelle** et à indiquer les **dimensions** par la cotation.

## 1. Représenter un objet
Représenter un objet, c'est le **montrer** par un dessin pour le comprendre, le fabriquer ou l'expliquer. Un bon dessin est **clair**, **soigné** et **compréhensible** par tous.

## 2. Le croquis
Un **croquis** est un dessin **à main levée** (sans instruments) qui donne rapidement une idée de la forme d'un objet. Il sert à **imaginer** et à **communiquer** une idée au début d'un projet.

*Un croquis n'a pas besoin d'être parfait : il doit surtout être rapide et lisible.*

## 3. Le schéma
Un **schéma** est un dessin **simplifié** qui explique le **fonctionnement** d'un objet, pas son aspect réel. Il utilise des **symboles** normalisés (mêmes symboles pour tout le monde).

*Exemple : le schéma d'un circuit électrique utilise des symboles pour la pile, l'interrupteur, la lampe — on comprend comment ça marche sans dessiner les vrais objets.*

> **Croquis ≠ schéma :** le croquis montre la **forme**, le schéma explique le **fonctionnement**.

## 4. L'échelle
L'**échelle** indique le rapport entre le dessin et l'objet réel :
- **échelle 1:1** → le dessin a la **taille réelle** de l'objet ;
- **échelle 1:2** → le dessin est **2 fois plus petit** que l'objet ;
- **échelle 2:1** → le dessin est **2 fois plus grand** (pour un petit objet).

## 5. La cotation
La **cotation** consiste à écrire les **dimensions réelles** de l'objet sur le dessin (longueur, largeur, hauteur), généralement en **millimètres (mm)**. Elle permet de **fabriquer** l'objet à la bonne taille.

## L'essentiel à retenir
- Un **croquis** est à **main levée** et montre la **forme** (pour imaginer vite).
- Un **schéma** est simplifié, avec des **symboles**, et explique le **fonctionnement**.
- L'**échelle** donne le rapport dessin/réel (1:1 = taille réelle, 1:2 = réduit).
- La **cotation** indique les **dimensions réelles** (souvent en mm) pour fabriquer.$md$),

    ('Habitat et ouvrages', $md$# Habitat et ouvrages

## Ce que tu vas comprendre
Les maisons, les ponts, les tours sont des **ouvrages** construits par l'humain. Ce chapitre t'apprend à reconnaître leur **structure**, à comprendre ce qui les rend **stables** et à choisir les bons **matériaux** face aux contraintes.

## 1. Qu'est-ce qu'un ouvrage ?
Un **ouvrage** est une construction réalisée par l'humain pour répondre à un besoin : se loger (**habitat**), franchir (**pont**), stocker (**barrage**), circuler (**route**). On parle d'ouvrages du **bâtiment** et de **travaux publics**.

## 2. La structure d'un ouvrage
La **structure** est l'**ensemble des éléments** qui portent l'ouvrage et le maintiennent debout :
- les **fondations** (dans le sol) qui répartissent le poids ;
- les **murs** et **poteaux** (éléments verticaux) qui portent ;
- les **poutres** et **planchers** (éléments horizontaux) qui relient et supportent ;
- la **charpente** et la **toiture** qui couvrent.

## 3. La stabilité
Un ouvrage est **stable** quand il ne bascule pas et ne s'effondre pas. La stabilité dépend :
- d'une **base large** et de **fondations** solides ;
- d'un **centre de gravité bas** ;
- de formes qui répartissent bien les forces (le **triangle** est la forme la plus stable, on l'utilise dans les charpentes et les grues).

## 4. Les contraintes
Un ouvrage subit des **contraintes** (forces) : son **propre poids**, le **vent**, la **neige**, le poids des personnes, parfois les **séismes**. Le concepteur doit dimensionner la structure pour **résister** à toutes ces contraintes sans se déformer ni casser.

## 5. Les matériaux de construction
On choisit les matériaux selon leur **résistance** et la contrainte à supporter :
- le **béton** : très résistant à l'écrasement (compression) ;
- l'**acier** : résistant à la traction, utilisé pour armer le béton (béton armé) ;
- le **bois** : léger, renouvelable, pour charpentes et maisons ;
- la **pierre** et la **brique** : traditionnelles, pour les murs.

## L'essentiel à retenir
- Un **ouvrage** est une construction humaine (habitat, pont, barrage…).
- La **structure** (fondations, murs, poutres, charpente) porte l'ouvrage.
- La **stabilité** vient d'une base large, d'un centre de gravité bas et de formes solides (le **triangle**).
- Les matériaux (**béton**, **acier**, **bois**, **pierre**) sont choisis selon les **contraintes** (poids, vent, neige).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'technologie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le fonctionnement d''un objet technique', $json${
      "centre": "Fonctionnement d'un objet technique",
      "branches": [
        { "titre": "Du besoin à l'objet", "enfants": ["L'objet répond à un besoin", "Fabriqué par l'humain", "Parapluie ← se protéger de la pluie"] },
        { "titre": "Fonctions d'usage et d'estime", "enfants": ["Usage = à quoi il sert", "Estime = pourquoi il plaît", "Montre : donner l'heure / son look"] },
        { "titre": "Fonctions techniques", "enfants": ["Ce que fait chaque partie", "Vélo : diriger, freiner, transmettre", "Découlent de la fonction d'usage"] },
        { "titre": "Solutions techniques", "enfants": ["Le moyen concret choisi", "Freiner : patins ou disque", "Plusieurs solutions possibles"] }
      ]
    }$json$),
    ('Matériaux et familles', $json${
      "centre": "Matériaux et familles",
      "branches": [
        { "titre": "Les familles", "enfants": ["Métaux (fer, alu, cuivre)", "Plastiques et organiques (bois)", "Céramiques et verres"] },
        { "titre": "Les propriétés", "enfants": ["Mécaniques : dureté, résistance", "Physiques : masse, conductivité", "Esthétiques et environnementales"] },
        { "titre": "Le choix", "enfants": ["Selon la fonction", "Coût et durée de vie", "Toujours un compromis"] },
        { "titre": "Cycle de vie", "enfants": ["Extraction → fabrication → fin", "Recycler = réutiliser la matière", "Économise ressources et énergie"] }
      ]
    }$json$),
    ('Croquis et schémas', $json${
      "centre": "Croquis et schémas",
      "branches": [
        { "titre": "Le croquis", "enfants": ["Dessin à main levée", "Montre la forme", "Pour imaginer vite"] },
        { "titre": "Le schéma", "enfants": ["Dessin simplifié", "Symboles normalisés", "Explique le fonctionnement"] },
        { "titre": "L'échelle", "enfants": ["1:1 = taille réelle", "1:2 = 2 fois plus petit", "2:1 = 2 fois plus grand"] },
        { "titre": "La cotation", "enfants": ["Dimensions réelles", "Souvent en millimètres", "Pour fabriquer à la bonne taille"] }
      ]
    }$json$),
    ('Habitat et ouvrages', $json${
      "centre": "Habitat et ouvrages",
      "branches": [
        { "titre": "Les ouvrages", "enfants": ["Constructions humaines", "Habitat, pont, barrage", "Bâtiment et travaux publics"] },
        { "titre": "La structure", "enfants": ["Fondations dans le sol", "Murs et poteaux (verticaux)", "Poutres et planchers (horizontaux)"] },
        { "titre": "La stabilité", "enfants": ["Base large, fondations solides", "Centre de gravité bas", "Le triangle = forme stable"] },
        { "titre": "Contraintes et matériaux", "enfants": ["Poids, vent, neige, séismes", "Béton (compression), acier (traction)", "Bois, pierre, brique"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'technologie'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 5e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Technologie', '5e', v.chapter, true, l.id
FROM (VALUES
  ('10119999-0000-4000-8000-000000000001'::uuid, 'Le fonctionnement d''un objet technique'),
  ('10119999-0000-4000-8000-000000000002'::uuid, 'Matériaux et familles'),
  ('10119999-0000-4000-8000-000000000003'::uuid, 'Croquis et schémas'),
  ('10119999-0000-4000-8000-000000000004'::uuid, 'Habitat et ouvrages')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'technologie'
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
  -- Chapitre 1 — Le fonctionnement d'un objet technique
  ('10110000-0000-4000-8000-000000000104'::uuid, 'Le fonctionnement d''un objet technique',
   'À quoi répond d''abord un objet technique ?', 'mcq',
   '["À un besoin", "À une couleur", "À un hasard", "À une note"]', 0,
   'Un objet technique est fabriqué par l''humain pour répondre à un besoin.', 4),
  ('10110000-0000-4000-8000-000000000105'::uuid, 'Le fonctionnement d''un objet technique',
   'La fonction d''usage d''un objet répond à la question :', 'mcq',
   '["À quoi sert l''objet ?", "Pourquoi plaît-il ?", "Combien coûte-t-il ?", "Qui l''a fabriqué ?"]', 0,
   'La fonction d''usage est le service rendu : à quoi sert l''objet.', 5),
  ('10110000-0000-4000-8000-000000000106'::uuid, 'Le fonctionnement d''un objet technique',
   'Le design et la couleur d''un objet relèvent de sa fonction d''estime.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La fonction d''estime, c''est ce qui plaît à l''utilisateur : look, couleur, marque.', 6),
  ('10110000-0000-4000-8000-000000000107'::uuid, 'Le fonctionnement d''un objet technique',
   'Une fonction technique décrit :', 'mcq',
   '["Ce que doit faire une partie de l''objet", "Le prix de l''objet", "La couleur de l''objet", "Le nom du fabricant"]', 0,
   'Les fonctions techniques disent ce que doit faire chaque partie pour assurer la fonction d''usage.', 7),
  ('10110000-0000-4000-8000-000000000108'::uuid, 'Le fonctionnement d''un objet technique',
   'Une même fonction technique ne peut avoir qu''une seule solution technique.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une fonction (ex. freiner) peut avoir plusieurs solutions (patins ou disque).', 8),
  ('10110000-0000-4000-8000-000000000109'::uuid, 'Le fonctionnement d''un objet technique',
   'Sur un vélo, « freins à patins » et « freins à disque » sont deux :', 'mcq',
   '["Solutions techniques", "Fonctions d''usage", "Besoins", "Matériaux"]', 0,
   'Ce sont deux solutions techniques différentes pour la même fonction « freiner ».', 9),
  ('10110000-0000-4000-8000-000000000110'::uuid, 'Le fonctionnement d''un objet technique',
   'Dans un objet automatisé, les capteurs appartiennent à la :', 'mcq',
   '["Chaîne d''information", "Chaîne d''énergie", "Fonction d''estime", "Cotation"]', 0,
   'Les capteurs acquièrent l''information : ils font partie de la chaîne d''information.', 10),

  -- Chapitre 2 — Matériaux et familles
  ('10110000-0000-4000-8000-000000000204'::uuid, 'Matériaux et familles',
   'Le fer, l''aluminium et le cuivre appartiennent à la famille des :', 'mcq',
   '["Métaux", "Plastiques", "Céramiques", "Matériaux organiques"]', 0,
   'Fer, aluminium et cuivre sont des métaux.', 4),
  ('10110000-0000-4000-8000-000000000205'::uuid, 'Matériaux et familles',
   'Le bois fait partie des matériaux organiques (issus du vivant).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le bois, le cuir et le papier sont des matériaux organiques, issus du vivant.', 5),
  ('10110000-0000-4000-8000-000000000206'::uuid, 'Matériaux et familles',
   'Quelle propriété rend l''aluminium intéressant pour un cadre de vélo ?', 'mcq',
   '["Il est léger et résistant", "Il est très lourd", "Il fond au soleil", "Il est cassant"]', 0,
   'L''aluminium est à la fois léger et résistant, idéal pour un cadre de vélo.', 6),
  ('10110000-0000-4000-8000-000000000207'::uuid, 'Matériaux et familles',
   'Les verres et céramiques sont surtout connus pour être :', 'mcq',
   '["Durs mais cassants", "Souples et élastiques", "Toujours légers", "Conducteurs d''électricité"]', 0,
   'Les céramiques et verres sont durs et résistants à la chaleur, mais fragiles (cassants).', 7),
  ('10110000-0000-4000-8000-000000000208'::uuid, 'Matériaux et familles',
   'Le choix d''un matériau est toujours un compromis (fonction, coût, environnement).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On choisit un matériau en équilibrant fonction, coût, durée de vie et impact : c''est un compromis.', 8),
  ('10110000-0000-4000-8000-000000000209'::uuid, 'Matériaux et familles',
   'Recycler un matériau permet surtout de :', 'mcq',
   '["Économiser les ressources et l''énergie", "Le rendre plus lourd", "Changer sa couleur", "Augmenter les déchets"]', 0,
   'Recycler réutilise la matière et économise ressources et énergie.', 9),
  ('10110000-0000-4000-8000-000000000210'::uuid, 'Matériaux et familles',
   'Les matières plastiques sont le plus souvent issues :', 'mcq',
   '["Du pétrole", "Du fer", "Du sable seul", "Du bois"]', 0,
   'Les matières plastiques sont généralement issues du pétrole.', 10),

  -- Chapitre 3 — Croquis et schémas
  ('10110000-0000-4000-8000-000000000304'::uuid, 'Croquis et schémas',
   'Un croquis est un dessin réalisé :', 'mcq',
   '["À main levée", "Uniquement à l''ordinateur", "Avec un rapporteur obligatoire", "En 3D imprimée"]', 0,
   'Un croquis est un dessin rapide, à main levée, pour donner une idée de la forme.', 4),
  ('10110000-0000-4000-8000-000000000305'::uuid, 'Croquis et schémas',
   'Un schéma sert surtout à :', 'mcq',
   '["Expliquer le fonctionnement", "Montrer la vraie couleur", "Donner le prix", "Signer l''objet"]', 0,
   'Le schéma est un dessin simplifié qui explique comment fonctionne l''objet.', 5),
  ('10110000-0000-4000-8000-000000000306'::uuid, 'Croquis et schémas',
   'Un schéma utilise des symboles normalisés, les mêmes pour tout le monde.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les symboles d''un schéma sont normalisés pour être compris par tous.', 6),
  ('10110000-0000-4000-8000-000000000307'::uuid, 'Croquis et schémas',
   'À l''échelle 1:2, le dessin est :', 'mcq',
   '["2 fois plus petit que l''objet", "2 fois plus grand que l''objet", "À la taille réelle", "Sans rapport avec l''objet"]', 0,
   'À l''échelle 1:2, le dessin est deux fois plus petit que l''objet réel.', 7),
  ('10110000-0000-4000-8000-000000000308'::uuid, 'Croquis et schémas',
   'À l''échelle 1:1, le dessin a la taille réelle de l''objet.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''échelle 1:1 signifie que le dessin est à la taille réelle.', 8),
  ('10110000-0000-4000-8000-000000000309'::uuid, 'Croquis et schémas',
   'La cotation d''un dessin technique sert à indiquer :', 'mcq',
   '["Les dimensions réelles de l''objet", "La couleur préférée", "Le nom du dessinateur", "La date du jour"]', 0,
   'La cotation écrit les dimensions réelles (souvent en mm) pour fabriquer l''objet.', 9),
  ('10110000-0000-4000-8000-000000000310'::uuid, 'Croquis et schémas',
   'En dessin technique, les dimensions sont le plus souvent exprimées en :', 'mcq',
   '["Millimètres (mm)", "Kilomètres (km)", "Litres (L)", "Degrés (°)"]', 0,
   'Les cotes d''un dessin technique sont généralement données en millimètres.', 10),

  -- Chapitre 4 — Habitat et ouvrages
  ('10110000-0000-4000-8000-000000000404'::uuid, 'Habitat et ouvrages',
   'Un pont, un barrage ou une maison sont des exemples d'':', 'mcq',
   '["Ouvrages", "Matériaux", "Croquis", "Capteurs"]', 0,
   'Un ouvrage est une construction humaine : habitat, pont, barrage…', 4),
  ('10110000-0000-4000-8000-000000000405'::uuid, 'Habitat et ouvrages',
   'Les fondations d''un ouvrage se trouvent :', 'mcq',
   '["Dans le sol", "Sur le toit", "Sur les fenêtres", "À côté de l''ouvrage"]', 0,
   'Les fondations sont dans le sol et répartissent le poids de l''ouvrage.', 5),
  ('10110000-0000-4000-8000-000000000406'::uuid, 'Habitat et ouvrages',
   'Quelle forme est la plus stable, souvent utilisée dans les charpentes et les grues ?', 'mcq',
   '["Le triangle", "Le cercle", "Le carré ouvert", "La ligne"]', 0,
   'Le triangle est la forme la plus stable : il ne se déforme pas facilement.', 6),
  ('10110000-0000-4000-8000-000000000407'::uuid, 'Habitat et ouvrages',
   'Un centre de gravité bas et une base large rendent un ouvrage plus stable.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une base large et un centre de gravité bas améliorent la stabilité.', 7),
  ('10110000-0000-4000-8000-000000000408'::uuid, 'Habitat et ouvrages',
   'Le vent, la neige et le poids sont des exemples de :', 'mcq',
   '["Contraintes subies par l''ouvrage", "Matériaux de construction", "Fonctions d''estime", "Échelles"]', 0,
   'Ce sont des contraintes (forces) que la structure doit supporter.', 8),
  ('10110000-0000-4000-8000-000000000409'::uuid, 'Habitat et ouvrages',
   'Quel matériau est surtout réputé résistant à l''écrasement (compression) ?', 'mcq',
   '["Le béton", "Le tissu", "Le papier", "Le caoutchouc"]', 0,
   'Le béton résiste très bien à la compression ; on l''arme d''acier pour la traction.', 9),
  ('10110000-0000-4000-8000-000000000410'::uuid, 'Habitat et ouvrages',
   'Dans le béton armé, l''acier est ajouté pour mieux résister à la traction.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''acier, résistant à la traction, arme le béton qui, lui, résiste à la compression.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'technologie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
