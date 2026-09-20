-- =============================================================================
-- Studuel — Migration 118 : CONTENU Physique-Chimie 3e (+ exercices type brevet)
-- Remplit les 4 chapitres de Physique-Chimie 3e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--   4. Exercices brevet → lessons.content de « Exercices types » (position 2) :
--                    2 exercices type brevet + correction détaillée par chapitre.
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
    ('Ions et pH', $md$# Ions et pH

## Ce que tu vas comprendre
Certaines solutions piquent, d'autres rongent le calcaire ou brûlent la peau. Derrière ces comportements se cachent des **ions** et une grandeur qui les mesure : le **pH**. Ce chapitre t'apprend ce qu'est un ion, comment lire le pH et comment reconnaître un ion.

## 1. Qu'est-ce qu'un ion ?
Un **ion** est un **atome** (ou un groupe d'atomes) qui a **gagné ou perdu un ou plusieurs électrons**. Il n'est donc plus électriquement neutre.

- S'il a **perdu** des électrons, il porte une charge **positive** : c'est un **cation** (ex. Na⁺, Cu²⁺).
- S'il a **gagné** des électrons, il porte une charge **négative** : c'est un **anion** (ex. Cl⁻, HO⁻).

*Exemple : l'atome de cuivre qui perd 2 électrons devient l'ion cuivre Cu²⁺.*

## 2. Ions et pH
Le **pH** (potentiel Hydrogène) mesure l'acidité d'une solution. Son échelle va de **0 à 14** :
- pH **< 7** → solution **acide** (beaucoup d'ions hydrogène H⁺) ;
- pH **= 7** → solution **neutre** (eau pure) ;
- pH **> 7** → solution **basique** (beaucoup d'ions hydroxyde HO⁻).

*Plus le pH est **petit**, plus la solution est **acide**. Plus il est **grand**, plus elle est **basique**.*

## 3. Diluer une solution acide
Quand on **dilue** une solution acide en ajoutant de l'eau, le pH **se rapproche de 7** : la solution devient **moins acide**. Une solution basique diluée voit aussi son pH se rapprocher de 7.

## 4. Mesurer le pH
On mesure le pH avec :
- du **papier pH** (change de couleur) : mesure approchée ;
- un **pH-mètre** : mesure précise au dixième.

## 5. Reconnaître les ions
On identifie un ion par un **test caractéristique** : on ajoute un réactif et on observe la couleur du **précipité** formé.

| Ion à tester | Réactif | Précipité observé |
|---|---|---|
| Chlorure Cl⁻ | nitrate d'argent | blanc (qui noircit) |
| Cuivre Cu²⁺ | soude (hydroxyde de sodium) | bleu |
| Fer II Fe²⁺ | soude | vert |
| Fer III Fe³⁺ | soude | rouille (orange) |

## L'essentiel à retenir
- Un **ion** est un atome qui a **gagné** (anion, −) ou **perdu** (cation, +) des électrons.
- Le **pH** va de **0 à 14** : < 7 acide, = 7 neutre, > 7 basique.
- Plus le pH est **petit**, plus c'est **acide** ; diluer rapproche le pH de 7.
- On reconnaît un ion par un **test** (nitrate d'argent → Cl⁻ blanc ; soude → Cu²⁺ bleu).$md$),

    ('L''énergie et ses conversions', $md$# L'énergie et ses conversions

## Ce que tu vas comprendre
L'énergie ne se voit pas, mais elle est partout : elle fait avancer les voitures, chauffe les maisons, éclaire les lampes. Ce chapitre t'apprend à reconnaître ses **formes**, à suivre une **chaîne énergétique** et à comprendre le **rendement**.

## 1. Les formes d'énergie
L'énergie existe sous plusieurs **formes** :
- **cinétique** (liée au mouvement) ;
- **de position** ou potentielle (liée à la hauteur) ;
- **thermique** (chaleur) ;
- **électrique**, **lumineuse**, **chimique** (piles, aliments), **nucléaire**.

L'unité de l'énergie est le **joule (J)**.

## 2. Sources, transferts et conversions
Un objet reçoit de l'énergie d'une **source** (le Soleil, une pile, un carburant…), la **convertit** d'une forme à une autre, puis la restitue.

*Exemple : une **lampe** reçoit de l'énergie **électrique** et la convertit en énergie **lumineuse** + énergie **thermique** (elle chauffe).*

## 3. La chaîne énergétique
On représente ces conversions par une **chaîne énergétique** : des flèches qui vont de la source à l'utilisation.

*Exemple (lampe) : pile (énergie chimique) → lampe → lumière + chaleur.*

## 4. La conservation de l'énergie
Règle fondamentale : **l'énergie se conserve**. Elle ne peut être ni **créée** ni **détruite**, seulement **convertie** ou **transférée**. La quantité totale d'énergie reste la même.

## 5. Le rendement
Toute l'énergie reçue n'est pas convertie en énergie **utile** : une partie est **perdue**, souvent sous forme de **chaleur**. Le **rendement** compare l'énergie utile à l'énergie reçue.

*Exemple : une lampe basse consommation reçoit 100 J, en convertit 80 J en lumière (utile) et 20 J en chaleur (perdue). Son rendement est de 80/100 = **0,8 soit 80 %**.*

Le rendement est **toujours inférieur ou égal à 1** (100 %).

## L'essentiel à retenir
- L'énergie prend plusieurs **formes** (cinétique, thermique, électrique…), unité le **joule**.
- Une **chaîne énergétique** montre les **conversions** de la source à l'utilisation.
- **Conservation** : l'énergie n'est ni créée ni détruite, seulement convertie.
- **Rendement** = énergie utile ÷ énergie reçue ; toujours ≤ 100 %, le reste part en chaleur.$md$),

    ('La gravitation', $md$# La gravitation

## Ce que tu vas comprendre
Pourquoi une pomme tombe-t-elle ? Pourquoi la Lune tourne-t-elle autour de la Terre ? La réponse est la même : la **gravitation**. Ce chapitre t'apprend à distinguer **masse** et **poids** et à calculer un poids.

## 1. La force de gravitation
La **gravitation** est une force d'**attraction** entre deux objets qui ont une **masse**. Elle existe partout dans l'Univers.

Elle est d'autant plus **grande** que :
- les objets ont une **masse importante** ;
- ils sont **proches** l'un de l'autre.

*C'est la gravitation qui retient la Lune près de la Terre et les planètes autour du Soleil.*

## 2. Le poids
Le **poids** d'un objet est la **force d'attraction** exercée par un astre (la Terre) sur cet objet. C'est une **force**, donc il se mesure en **newtons (N)** avec un **dynamomètre**.

## 3. Masse ou poids : ne pas confondre
- La **masse** (en **kg**) mesure la **quantité de matière**. Elle **ne change pas** quand on change d'endroit.
- Le **poids** (en **N**) dépend de l'astre : il **change** entre la Terre et la Lune.

*Sur la Lune, ta masse est identique, mais ton poids est environ **6 fois plus petit** que sur Terre.*

## 4. La relation poids – masse
Le poids **P** et la masse **m** sont liés par :

**P = m × g**

où **g** est l'**intensité de la pesanteur**. Sur Terre, **g ≈ 10 N/kg**.

*Exemple : un sac de masse **m = 3 kg** a un poids P = 3 × 10 = **30 N** sur Terre.*

## 5. Le système solaire
Le **Soleil**, très massif, attire les **8 planètes** qui tournent autour de lui : Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune. La gravitation **maintient** chaque planète sur son orbite.

## L'essentiel à retenir
- La **gravitation** est une **attraction** entre objets massifs, plus forte s'ils sont **massifs et proches**.
- Le **poids** est une **force** (en **N**), la **masse** une quantité de matière (en **kg**).
- La masse **ne change pas** d'un astre à l'autre, le **poids** oui.
- Relation : **P = m × g**, avec **g ≈ 10 N/kg** sur Terre.$md$),

    ('Puissance et énergie électriques', $md$# Puissance et énergie électriques

## Ce que tu vas comprendre
Un radiateur consomme bien plus qu'une lampe, et la facture d'électricité arrive tous les mois. Derrière tout cela : la **puissance** et l'**énergie électriques**. Ce chapitre t'apprend à les calculer et à lire une facture.

## 1. La puissance électrique
La **puissance** d'un appareil indique la quantité d'énergie qu'il consomme **chaque seconde**. Elle se mesure en **watts (W)**.

Elle se calcule à partir de la tension **U** (en volts, V) et de l'intensité **I** (en ampères, A) :

**P = U × I**

*Exemple : un appareil sous **U = 230 V** parcouru par **I = 2 A** a une puissance P = 230 × 2 = **460 W**.*

## 2. Lire une plaque signalétique
Chaque appareil porte une **plaque signalétique** indiquant sa **tension** et sa **puissance** nominales (ex. « 230 V — 2000 W »). Un appareil de forte puissance consomme vite beaucoup d'énergie.

## 3. L'énergie électrique
L'**énergie** consommée dépend de la puissance **et** de la **durée** d'utilisation :

**E = P × t**

- Si P est en **watts** et t en **secondes**, E est en **joules (J)**.
- Si P est en **kilowatts** (1 kW = 1000 W) et t en **heures**, E est en **kilowattheures (kWh)**.

*Exemple : un radiateur de **2 kW** allumé pendant **3 h** consomme E = 2 × 3 = **6 kWh**.*

## 4. Le kilowattheure et la facture
Le **kWh** est l'unité utilisée par le fournisseur d'électricité. **1 kWh** correspond à un appareil de **1000 W** fonctionnant pendant **1 heure**.

La **facture** se calcule en multipliant l'énergie consommée (en kWh) par le **prix d'un kWh**.

*Exemple : 6 kWh consommés à 0,20 € le kWh coûtent 6 × 0,20 = **1,20 €**.*

## 5. Économiser l'énergie
Pour réduire la facture : baisser la **puissance** (appareils basse consommation), réduire la **durée** d'utilisation, éteindre les veilles.

## L'essentiel à retenir
- La **puissance** se mesure en **watts** : **P = U × I** (U en V, I en A).
- L'**énergie** consommée : **E = P × t** (en J si secondes, en kWh si kW × heures).
- **1 kWh** = un appareil de **1000 W** pendant **1 heure**.
- La **facture** = énergie (kWh) × **prix du kWh**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Ions et pH', $json${
      "centre": "Ions et pH",
      "branches": [
        { "titre": "Qu'est-ce qu'un ion ?", "enfants": ["Atome qui gagne/perd des électrons", "Cation +  (a perdu)", "Anion −  (a gagné)"] },
        { "titre": "L'échelle de pH", "enfants": ["De 0 à 14", "< 7 acide, = 7 neutre, > 7 basique", "Plus petit = plus acide"] },
        { "titre": "Mesurer et diluer", "enfants": ["Papier pH ou pH-mètre", "Diluer rapproche le pH de 7", "Moins acide en ajoutant de l'eau"] },
        { "titre": "Tests d'ions", "enfants": ["Cl⁻ : nitrate d'argent → blanc", "Cu²⁺ : soude → bleu", "Fe²⁺ vert, Fe³⁺ rouille"] }
      ]
    }$json$),
    ('L''énergie et ses conversions', $json${
      "centre": "L'énergie et ses conversions",
      "branches": [
        { "titre": "Formes d'énergie", "enfants": ["Cinétique, thermique, électrique", "Lumineuse, chimique, nucléaire", "Unité : le joule (J)"] },
        { "titre": "Chaîne énergétique", "enfants": ["Source → objet → utilisation", "Flèches de conversion", "Pile → lampe → lumière + chaleur"] },
        { "titre": "Conservation", "enfants": ["Ni créée ni détruite", "Seulement convertie", "Quantité totale constante"] },
        { "titre": "Rendement", "enfants": ["Énergie utile ÷ reçue", "Toujours ≤ 100 %", "Pertes en chaleur"] }
      ]
    }$json$),
    ('La gravitation', $json${
      "centre": "La gravitation",
      "branches": [
        { "titre": "Force d'attraction", "enfants": ["Entre objets qui ont une masse", "Plus forte si massifs", "Plus forte si proches"] },
        { "titre": "Masse ou poids", "enfants": ["Masse en kg (matière)", "Poids en N (force)", "Masse constante, poids variable"] },
        { "titre": "Relation P = m × g", "enfants": ["g ≈ 10 N/kg sur Terre", "3 kg → P = 30 N", "Mesure au dynamomètre"] },
        { "titre": "Système solaire", "enfants": ["Le Soleil attire les planètes", "8 planètes en orbite", "Gravitation maintient l'orbite"] }
      ]
    }$json$),
    ('Puissance et énergie électriques', $json${
      "centre": "Puissance et énergie électriques",
      "branches": [
        { "titre": "Puissance P = U × I", "enfants": ["En watts (W)", "U en volts, I en ampères", "230 V × 2 A = 460 W"] },
        { "titre": "Énergie E = P × t", "enfants": ["En joules (P en W, t en s)", "En kWh (P en kW, t en h)", "2 kW × 3 h = 6 kWh"] },
        { "titre": "Le kilowattheure", "enfants": ["1 kWh = 1000 W pendant 1 h", "Unité du fournisseur", "1 kW = 1000 W"] },
        { "titre": "La facture", "enfants": ["Énergie (kWh) × prix du kWh", "Plaque signalétique", "Économiser : puissance et durée"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 3e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11819999-0000-4000-8000-000000000001'::uuid, 'Ions et pH'),
  ('11819999-0000-4000-8000-000000000002'::uuid, 'L''énergie et ses conversions'),
  ('11819999-0000-4000-8000-000000000003'::uuid, 'La gravitation'),
  ('11819999-0000-4000-8000-000000000004'::uuid, 'Puissance et énergie électriques')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
  -- Chapitre 1 — Ions et pH
  ('11810000-0000-4000-8000-000000000104'::uuid, 'Ions et pH',
   'Qu''est-ce qu''un ion ?', 'mcq',
   '["Un atome qui a gagné ou perdu des électrons", "Un atome toujours neutre", "Une molécule d''eau", "Un noyau sans électrons"]', 0,
   'Un ion est un atome (ou groupe d''atomes) qui a gagné ou perdu un ou plusieurs électrons : il n''est plus neutre.', 4),
  ('11810000-0000-4000-8000-000000000105'::uuid, 'Ions et pH',
   'L''échelle de pH va de : ', 'mcq',
   '["0 à 14", "0 à 7", "1 à 10", "0 à 100"]', 0,
   'Le pH est compris entre 0 et 14.', 5),
  ('11810000-0000-4000-8000-000000000106'::uuid, 'Ions et pH',
   'Une solution dont le pH vaut 3 est : ', 'mcq',
   '["Acide", "Neutre", "Basique", "Pure"]', 0,
   'Un pH inférieur à 7 correspond à une solution acide.', 6),
  ('11810000-0000-4000-8000-000000000107'::uuid, 'Ions et pH',
   'Une solution neutre a un pH égal à 7.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'pH = 7 correspond à une solution neutre (comme l''eau pure).', 7),
  ('11810000-0000-4000-8000-000000000108'::uuid, 'Ions et pH',
   'Quel réactif permet de tester l''ion chlorure Cl⁻ ?', 'mcq',
   '["Le nitrate d''argent", "La soude", "L''eau distillée", "Le papier pH"]', 0,
   'Le nitrate d''argent forme un précipité blanc avec les ions chlorure.', 8),
  ('11810000-0000-4000-8000-000000000109'::uuid, 'Ions et pH',
   'Un cation est un ion qui a perdu des électrons, il est donc positif.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En perdant des électrons (négatifs), l''atome devient positif : c''est un cation.', 9),
  ('11810000-0000-4000-8000-000000000110'::uuid, 'Ions et pH',
   'Plus le pH d''une solution est petit, plus la solution est : ', 'mcq',
   '["Acide", "Basique", "Neutre", "Diluée"]', 0,
   'Un pH plus petit signifie une solution plus acide.', 10),

  -- Chapitre 2 — L'énergie et ses conversions
  ('11810000-0000-4000-8000-000000000204'::uuid, 'L''énergie et ses conversions',
   'Quelle est l''unité de l''énergie ?', 'mcq',
   '["Le joule (J)", "Le watt (W)", "Le volt (V)", "Le newton (N)"]', 0,
   'L''énergie se mesure en joules (J).', 4),
  ('11810000-0000-4000-8000-000000000205'::uuid, 'L''énergie et ses conversions',
   'Une lampe convertit l''énergie électrique en : ', 'mcq',
   '["Lumière et chaleur", "Uniquement en lumière", "Énergie chimique", "Énergie nucléaire"]', 0,
   'Une lampe transforme l''énergie électrique en lumière, avec une partie perdue en chaleur.', 5),
  ('11810000-0000-4000-8000-000000000206'::uuid, 'L''énergie et ses conversions',
   'L''énergie ne peut être ni créée ni détruite, seulement convertie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le principe de conservation de l''énergie.', 6),
  ('11810000-0000-4000-8000-000000000207'::uuid, 'L''énergie et ses conversions',
   'Comment appelle-t-on l''énergie liée au mouvement d''un objet ?', 'mcq',
   '["L''énergie cinétique", "L''énergie thermique", "L''énergie chimique", "L''énergie lumineuse"]', 0,
   'L''énergie liée au mouvement est l''énergie cinétique.', 7),
  ('11810000-0000-4000-8000-000000000208'::uuid, 'L''énergie et ses conversions',
   'Le rendement d''un appareil est toujours : ', 'mcq',
   '["Inférieur ou égal à 100 %", "Supérieur à 100 %", "Exactement égal à 100 %", "Toujours nul"]', 0,
   'Une partie de l''énergie est perdue (chaleur), donc le rendement ne dépasse jamais 100 %.', 8),
  ('11810000-0000-4000-8000-000000000209'::uuid, 'L''énergie et ses conversions',
   'Dans la plupart des appareils, l''énergie perdue part surtout sous forme de chaleur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les pertes d''énergie se font le plus souvent sous forme de chaleur (effet Joule, frottements).', 9),
  ('11810000-0000-4000-8000-000000000210'::uuid, 'L''énergie et ses conversions',
   'Que représente une chaîne énergétique ?', 'mcq',
   '["Les conversions d''énergie de la source à l''utilisation", "La masse d''un objet", "La tension d''une pile", "La couleur d''un ion"]', 0,
   'La chaîne énergétique montre, par des flèches, les conversions d''énergie de la source jusqu''à l''utilisation.', 10),

  -- Chapitre 3 — La gravitation
  ('11810000-0000-4000-8000-000000000304'::uuid, 'La gravitation',
   'Avec quelle relation calcule-t-on le poids P d''un objet ?', 'mcq',
   '["P = m × g", "P = m + g", "P = m ÷ g", "P = U × I"]', 0,
   'Le poids se calcule par P = m × g (m la masse, g l''intensité de la pesanteur).', 4),
  ('11810000-0000-4000-8000-000000000305'::uuid, 'La gravitation',
   'Sur Terre, l''intensité de la pesanteur g vaut environ : ', 'mcq',
   '["10 N/kg", "1 N/kg", "100 N/kg", "0 N/kg"]', 0,
   'Sur Terre, g ≈ 10 N/kg.', 5),
  ('11810000-0000-4000-8000-000000000306'::uuid, 'La gravitation',
   'Quel est le poids d''un objet de masse 2 kg sur Terre (g ≈ 10 N/kg) ?', 'mcq',
   '["20 N", "2 N", "12 N", "200 N"]', 0,
   'P = m × g = 2 × 10 = 20 N.', 6),
  ('11810000-0000-4000-8000-000000000307'::uuid, 'La gravitation',
   'La masse d''un objet change quand on l''emmène sur la Lune.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la masse (en kg) ne change pas. C''est le poids (en N) qui change d''un astre à l''autre.', 7),
  ('11810000-0000-4000-8000-000000000308'::uuid, 'La gravitation',
   'La gravitation est une force : ', 'mcq',
   '["D''attraction entre les objets qui ont une masse", "De répulsion entre les objets", "Qui n''existe que sur Terre", "Sans aucun effet"]', 0,
   'La gravitation est une attraction entre tous les objets qui possèdent une masse.', 8),
  ('11810000-0000-4000-8000-000000000309'::uuid, 'La gravitation',
   'Quelle est l''unité du poids ?', 'mcq',
   '["Le newton (N)", "Le kilogramme (kg)", "Le joule (J)", "Le watt (W)"]', 0,
   'Le poids est une force : il se mesure en newtons (N). La masse, elle, est en kg.', 9),
  ('11810000-0000-4000-8000-000000000310'::uuid, 'La gravitation',
   'Plus deux objets sont massifs et proches, plus la force d''attraction entre eux est grande.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La gravitation augmente avec la masse des objets et diminue avec la distance.', 10),

  -- Chapitre 4 — Puissance et énergie électriques
  ('11810000-0000-4000-8000-000000000404'::uuid, 'Puissance et énergie électriques',
   'Comment calcule-t-on la puissance électrique P ?', 'mcq',
   '["P = U × I", "P = U + I", "P = U ÷ I", "P = m × g"]', 0,
   'La puissance électrique est P = U × I (U la tension, I l''intensité).', 4),
  ('11810000-0000-4000-8000-000000000405'::uuid, 'Puissance et énergie électriques',
   'Quelle est l''unité de la puissance ?', 'mcq',
   '["Le watt (W)", "Le joule (J)", "Le volt (V)", "L''ampère (A)"]', 0,
   'La puissance se mesure en watts (W).', 5),
  ('11810000-0000-4000-8000-000000000406'::uuid, 'Puissance et énergie électriques',
   'Un appareil sous 230 V parcouru par un courant de 2 A a une puissance de : ', 'mcq',
   '["460 W", "232 W", "115 W", "228 W"]', 0,
   'P = U × I = 230 × 2 = 460 W.', 6),
  ('11810000-0000-4000-8000-000000000407'::uuid, 'Puissance et énergie électriques',
   'Comment calcule-t-on l''énergie E consommée par un appareil ?', 'mcq',
   '["E = P × t", "E = P ÷ t", "E = P + t", "E = U × I"]', 0,
   'L''énergie consommée est E = P × t (puissance × durée).', 7),
  ('11810000-0000-4000-8000-000000000408'::uuid, 'Puissance et énergie électriques',
   '1 kWh correspond à un appareil de 1000 W qui fonctionne pendant : ', 'mcq',
   '["1 heure", "1 minute", "1 seconde", "10 heures"]', 0,
   '1 kWh = 1000 W (1 kW) pendant 1 heure.', 8),
  ('11810000-0000-4000-8000-000000000409'::uuid, 'Puissance et énergie électriques',
   'Un radiateur de 2 kW allumé pendant 3 h consomme : ', 'mcq',
   '["6 kWh", "5 kWh", "2 kWh", "600 kWh"]', 0,
   'E = P × t = 2 × 3 = 6 kWh.', 9),
  ('11810000-0000-4000-8000-000000000410'::uuid, 'Puissance et énergie électriques',
   'La facture d''électricité se calcule à partir de l''énergie consommée en kWh.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le fournisseur facture l''énergie en kWh : facture = énergie (kWh) × prix du kWh.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BREVET — lessons.content de « Exercices types » (position 2)
--    2 exercices type brevet + correction détaillée par chapitre. Même jointure
--    que la section 1, mais l.title = 'Exercices types' (garde IS DISTINCT FROM).
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Ions et pH', $md$# Exercices type brevet — Ions et pH

## Exercice 1 — Les eaux du laboratoire
Au laboratoire, on mesure le pH de trois liquides à l'aide d'un pH-mètre :
- eau du robinet : pH = 7,5 ;
- jus de citron : pH = 2,5 ;
- eau savonneuse : pH = 9.

**a)** Classe ces trois liquides du plus acide au plus basique.
**b)** Lequel est acide ? Lequel est basique ?
**c)** On ajoute beaucoup d'eau distillée au jus de citron. Le pH va-t-il augmenter ou diminuer ? Justifie.

### Correction
**a)** On classe par pH croissant (du plus acide au plus basique) :
jus de citron (2,5) < eau du robinet (7,5) < eau savonneuse (9).
**b)** Un liquide est **acide** si son pH est inférieur à 7 : le **jus de citron** (2,5) est acide. Il est **basique** si son pH est supérieur à 7 : l'**eau savonneuse** (9) est basique. L'eau du robinet (7,5), très proche de 7, est quasiment neutre.
**c)** Diluer une solution acide en ajoutant de l'eau **rapproche le pH de 7**. Le pH du jus de citron va donc **augmenter** (de 2,5 vers 7) : la solution devient moins acide.

## Exercice 2 — Identifier un ion inconnu
On dispose d'une solution inconnue. On réalise deux tests :
- avec du **nitrate d'argent**, on observe un **précipité blanc** ;
- avec de la **soude**, on observe un **précipité bleu**.

**a)** Que révèle le test au nitrate d'argent ?
**b)** Que révèle le test à la soude ?
**c)** Donne le nom de deux ions présents dans cette solution.

### Correction
**a)** Le nitrate d'argent donne un **précipité blanc** avec les **ions chlorure Cl⁻**. La solution contient donc des ions chlorure.
**b)** La soude donne un **précipité bleu** avec les **ions cuivre Cu²⁺**. La solution contient donc des ions cuivre.
**c)** Les deux ions présents sont l'**ion chlorure (Cl⁻)** et l'**ion cuivre (Cu²⁺)**. La solution peut être du chlorure de cuivre.$md$),

    ('L''énergie et ses conversions', $md$# Exercices type brevet — L'énergie et ses conversions

## Exercice 1 — La chaîne énergétique de la lampe de poche
Une lampe de poche fonctionne grâce à une pile. La pile alimente une petite ampoule qui éclaire et chauffe légèrement.

**a)** Quelle est la source d'énergie de la lampe ?
**b)** Sous quelle forme est stockée l'énergie dans la pile ?
**c)** Construis la chaîne énergétique de la lampe de poche, de la pile à l'utilisation.

### Correction
**a)** La source d'énergie de la lampe de poche est la **pile**.
**b)** Dans la pile, l'énergie est stockée sous forme d'**énergie chimique**.
**c)** La chaîne énergétique est :
pile (**énergie chimique**) → ampoule → **énergie lumineuse** (utile) + **énergie thermique** (chaleur, perdue).
La pile convertit son énergie chimique en énergie électrique, puis l'ampoule la convertit en lumière et en chaleur.

## Exercice 2 — Le rendement d'une ampoule
Une ampoule reçoit **100 J** d'énergie électrique. Elle produit **15 J** d'énergie lumineuse ; le reste est perdu sous forme de chaleur.

**a)** Quelle quantité d'énergie est perdue sous forme de chaleur ?
**b)** Calcule le rendement de l'ampoule (énergie utile ÷ énergie reçue).
**c)** Une ampoule LED a un rendement de 0,80. Est-elle plus économique ? Justifie.

### Correction
**a)** L'énergie perdue = énergie reçue − énergie utile = 100 − 15 = **85 J** perdus en chaleur.
**b)** Rendement = énergie utile ÷ énergie reçue = 15 ÷ 100 = **0,15 soit 15 %**.
**c)** La LED a un rendement de 0,80 (**80 %**), bien supérieur à 15 %. Pour la même lumière produite, elle consomme **moins d'énergie** et perd moins de chaleur : elle est donc **plus économique**.$md$),

    ('La gravitation', $md$# Exercices type brevet — La gravitation

## Exercice 1 — Le poids d'un cartable
Un élève pèse son cartable : il a une masse **m = 4 kg**. On prendra **g ≈ 10 N/kg** sur Terre.

**a)** Rappelle la relation entre le poids P et la masse m.
**b)** Calcule le poids du cartable sur Terre.
**c)** Sur la Lune, l'intensité de la pesanteur vaut environ 1,6 N/kg. La masse du cartable change-t-elle ? Son poids change-t-il ?

### Correction
**a)** La relation est **P = m × g**, avec P le poids en newtons (N), m la masse en kg et g l'intensité de la pesanteur en N/kg.
**b)** Sur Terre : P = m × g = 4 × 10 = **40 N**.
**c)** La **masse ne change pas** : elle vaut toujours 4 kg, sur Terre comme sur la Lune. En revanche le **poids change** : sur la Lune, P = 4 × 1,6 = **6,4 N**, soit environ 6 fois plus petit que sur Terre.

## Exercice 2 — Astronaute et gravitation
Un astronaute a une masse de **80 kg**. On prendra **g ≈ 10 N/kg** sur Terre.

**a)** Calcule son poids sur Terre.
**b)** Explique pourquoi la Lune tourne autour de la Terre sans s'éloigner.
**c)** La force de gravitation serait-elle plus grande ou plus petite si la Terre et la Lune étaient plus éloignées ?

### Correction
**a)** Sur Terre : P = m × g = 80 × 10 = **800 N**.
**b)** La **gravitation** est une force d'attraction : la Terre, très massive, **attire** la Lune. Cette attraction retient la Lune sur son orbite et l'empêche de s'éloigner dans l'espace.
**c)** La force de gravitation est **plus grande** quand les objets sont **proches**. Si la Terre et la Lune étaient plus éloignées, l'attraction serait **plus petite**.$md$),

    ('Puissance et énergie électriques', $md$# Exercices type brevet — Puissance et énergie électriques

## Exercice 1 — Le radiateur électrique
Un radiateur porte l'indication « 230 V — 2000 W ». Il est allumé chaque jour pendant **5 heures**. Le prix d'un kWh est de **0,20 €**.

**a)** Quelle est la puissance du radiateur en kilowatts ?
**b)** Calcule l'énergie consommée en une journée (en kWh).
**c)** Calcule le coût de cette consommation journalière.

### Correction
**a)** La puissance est de 2000 W. Comme 1 kW = 1000 W, on a P = 2000 ÷ 1000 = **2 kW**.
**b)** L'énergie consommée : E = P × t = 2 × 5 = **10 kWh** par jour.
**c)** Coût = énergie × prix du kWh = 10 × 0,20 = **2,00 €** par jour.

## Exercice 2 — Puissance d'un sèche-cheveux
Un sèche-cheveux est branché sur le secteur (**U = 230 V**). Il est parcouru par un courant d'intensité **I = 4 A**.

**a)** Calcule la puissance du sèche-cheveux.
**b)** On l'utilise pendant 15 minutes, soit 0,25 h. Calcule l'énergie consommée en kWh.
**c)** Ce sèche-cheveux consomme-t-il plus ou moins qu'une lampe de 100 W allumée le même temps ? Justifie.

### Correction
**a)** P = U × I = 230 × 4 = **920 W** (environ 0,92 kW).
**b)** E = P × t = 0,92 × 0,25 = **0,23 kWh**.
**c)** La lampe de 100 W (0,1 kW) allumée 0,25 h consomme E = 0,1 × 0,25 = 0,025 kWh. Le sèche-cheveux (0,23 kWh) consomme donc **beaucoup plus** que la lampe, car sa **puissance** est bien plus grande (920 W contre 100 W).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
