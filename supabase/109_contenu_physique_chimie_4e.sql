-- =============================================================================
-- Studuel — Migration 109 : CONTENU Physique-Chimie 4e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de Physique-Chimie 4e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de contenu)
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
-- PRÉREQUIS : subjects/chapters/lessons Physique-Chimie 4e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''air et ses propriétés', $md$# L'air et ses propriétés

## Ce que tu vas comprendre
L'air est **invisible**, mais c'est bien de la **matière** : un **gaz** qui a une masse, que l'on peut comprimer et qui exerce une pression. Ce chapitre t'apprend de quoi l'air est fait et comment décrire ses propriétés.

## 1. L'air est un gaz
Comme tout gaz, l'air **occupe tout l'espace** qui lui est offert et **prend la forme** de son récipient. Il n'a ni forme propre ni volume propre.

*Exemple : gonfle un ballon, l'air remplit tout le volume et épouse sa forme.*

## 2. La composition de l'air
L'air qui nous entoure est un **mélange de gaz** :
- environ **78 % de diazote** (N₂) ;
- environ **21 % de dioxygène** (O₂) ;
- environ **1 %** d'autres gaz (argon, dioxyde de carbone, vapeur d'eau…).

> **À retenir :** le dioxygène (21 %) est le gaz nécessaire à la respiration et aux combustions.

## 3. L'air a une masse
Contrairement à ce qu'on croit, l'air **pèse** ! On le mesure avec une **balance** : on pèse un ballon gonflé, puis dégonflé.

*Ordre de grandeur : **1 litre d'air a une masse d'environ 1,2 g** (à 20 °C).*

## 4. L'air est compressible et expansible
On peut **réduire le volume** d'un gaz en le **comprimant** (seringue bouchée dont on pousse le piston) : c'est la **compressibilité**. On peut aussi le **détendre** (expansibilité). Les liquides, eux, ne sont **pas** compressibles.

## 5. La pression d'un gaz
Un gaz **appuie** sur les parois de son récipient : c'est la **pression**. Elle se mesure en **pascals (Pa)** ou en **hectopascals (hPa)** avec un **manomètre**.
- La **pression atmosphérique** au niveau de la mer vaut environ **1013 hPa**.
- Plus on comprime un gaz (volume plus petit), plus sa **pression augmente**.

## L'essentiel à retenir
- L'air est un **gaz** : il occupe tout l'espace disponible.
- Composition : **78 % diazote**, **21 % dioxygène**, ~1 % autres.
- L'air **a une masse** (≈ 1,2 g par litre) : on la mesure à la balance.
- Un gaz est **compressible** ; sa **pression** (en Pa ou hPa) se mesure au manomètre.$md$),

    ('Les transformations chimiques', $md$# Les transformations chimiques

## Ce que tu vas comprendre
Au cours d'une **transformation chimique**, des espèces **disparaissent** et de **nouvelles** apparaissent, mais rien ne se perd : la **masse se conserve**. Ce chapitre t'apprend à décrire une réaction et à comprendre les combustions.

## 1. Réactifs et produits
Dans une transformation chimique :
- les espèces **présentes au départ** et qui sont consommées sont les **réactifs** ;
- les espèces **formées** à l'arrivée sont les **produits**.

*Exemple : quand le fer rouille, le fer et le dioxygène (réactifs) forment de la rouille (produit).*

## 2. La conservation de la masse
Au cours d'une transformation chimique, la **masse totale se conserve** : la masse des **réactifs** est égale à la masse des **produits** (loi de **Lavoisier**).

> **À retenir :** « Rien ne se perd, rien ne se crée, tout se transforme. » Les **atomes** ne disparaissent pas, ils se **réorganisent**.

## 3. L'équation de réaction
On résume une transformation par une **équation de réaction** : les **réactifs** à gauche, une flèche, les **produits** à droite. On l'ajuste pour **conserver les atomes** de chaque sorte.

*Exemple : carbone + dioxygène → dioxyde de carbone, soit C + O₂ → CO₂.*

## 4. Les combustions
Une **combustion** est une transformation qui nécessite :
- un **combustible** (ce qui brûle : carbone, méthane, bois…) ;
- un **comburant** : le **dioxygène** de l'air.
- Combustion du **carbone** : elle produit du **dioxyde de carbone**.
- Combustion du **méthane** (gaz de ville) : elle produit du **dioxyde de carbone** et de l'**eau**.

## L'essentiel à retenir
- **Réactifs** = espèces de départ ; **produits** = espèces formées.
- La **masse totale se conserve** (Lavoisier) : réactifs = produits.
- Les **atomes** se réorganisent mais **ne disparaissent pas**.
- Une **combustion** a besoin d'un **combustible** et de **dioxygène** (comburant).$md$),

    ('Intensité et tension électriques', $md$# Intensité et tension électriques

## Ce que tu vas comprendre
Pour décrire un circuit, on utilise deux grandeurs : l'**intensité** du courant et la **tension**. Ce chapitre t'apprend à les mesurer et à connaître les **lois** des circuits en série et en dérivation.

## 1. L'intensité du courant
L'**intensité** mesure le « débit » du courant électrique. Elle s'exprime en **ampères (A)** et se mesure avec un **ampèremètre**.

> **Branchement :** l'ampèremètre se branche **en série** dans le circuit (il doit être **traversé** par le courant à mesurer).

## 2. La tension électrique
La **tension** représente la « poussée » électrique entre deux points. Elle s'exprime en **volts (V)** et se mesure avec un **voltmètre**.

> **Branchement :** le voltmètre se branche **en dérivation**, **aux bornes** du dipôle dont on mesure la tension.

*Exemple : une pile plate porte l'indication **4,5 V** ; une prise domestique délivre **230 V**.*

## 3. Les lois du circuit en série
Dans un circuit **en série** (une seule boucle) :
- **Loi d'unicité de l'intensité** : l'intensité est **la même en tout point** du circuit.
- **Loi d'additivité des tensions** : la tension du générateur est égale à la **somme** des tensions des autres dipôles.

*Exemple : deux lampes en série sous 6 V se partagent la tension (3 V + 3 V si elles sont identiques).*

## 4. Les lois du circuit en dérivation
Dans un circuit **en dérivation** (plusieurs branches) :
- **Loi des nœuds** : l'intensité qui **arrive** à un nœud est égale à l'intensité qui en **repart**.
- La **tension est la même** aux bornes de deux dipôles branchés en dérivation.

## L'essentiel à retenir
- **Intensité** en **ampères (A)** → **ampèremètre en série**.
- **Tension** en **volts (V)** → **voltmètre en dérivation**.
- En **série** : intensité **unique**, tensions qui **s'additionnent**.
- En **dérivation** : **loi des nœuds** (les intensités se partagent), tension identique.$md$),

    ('Vitesse et mouvement', $md$# Vitesse et mouvement

## Ce que tu vas comprendre
Décrire un **mouvement**, c'est indiquer sa **trajectoire** et sa **vitesse**. Ce chapitre t'apprend à calculer une vitesse et à reconnaître les différents types de mouvements.

## 1. La vitesse
La **vitesse** indique la distance parcourue pendant une durée. On la calcule par :

**vitesse = distance ÷ temps**, soit **v = d ÷ t**.

*Exemple : une voiture parcourt 100 km en 2 h → v = 100 ÷ 2 = **50 km/h**.*

## 2. Les unités de vitesse
La vitesse s'exprime en **km/h** (kilomètres par heure) dans la vie courante, ou en **m/s** (mètres par seconde) en physique.
- Un piéton marche à environ **5 km/h**.
- Une voiture sur autoroute roule à environ **130 km/h**.

> **À retenir :** pour retrouver une distance, on écrit **d = v × t** ; pour un temps, **t = d ÷ v**.

## 3. La trajectoire
La **trajectoire** est l'**ensemble des positions** occupées par un objet au cours de son mouvement.
- Si la trajectoire est une **droite**, le mouvement est **rectiligne**.
- Si c'est un **cercle**, le mouvement est **circulaire**.
- Sinon, il est **curviligne**.

## 4. Décrire un mouvement
On décrit un mouvement par sa **trajectoire** et l'évolution de sa **vitesse** :
- vitesse **constante** → mouvement **uniforme** ;
- vitesse qui **augmente** → mouvement **accéléré** ;
- vitesse qui **diminue** → mouvement **ralenti**.

*Le mouvement est **relatif** : il dépend de l'objet par rapport auquel on l'observe (le référentiel).*

## L'essentiel à retenir
- **Vitesse = distance ÷ temps** (v = d ÷ t) ; unités : **km/h** ou **m/s**.
- On retrouve **d = v × t** et **t = d ÷ v**.
- La **trajectoire** peut être **rectiligne**, **circulaire** ou **curviligne**.
- Vitesse constante = **uniforme** ; qui augmente = **accéléré** ; qui diminue = **ralenti**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('L''air et ses propriétés', $json${
      "centre": "L'air et ses propriétés",
      "branches": [
        { "titre": "L'air est un gaz", "enfants": ["Occupe tout l'espace", "Prend la forme du récipient", "Ni forme ni volume propre"] },
        { "titre": "Composition", "enfants": ["78 % diazote (N₂)", "21 % dioxygène (O₂)", "~1 % autres gaz"] },
        { "titre": "L'air a une masse", "enfants": ["Mesurée à la balance", "≈ 1,2 g par litre", "L'air est de la matière"] },
        { "titre": "Compressible et pression", "enfants": ["On réduit son volume", "Pression en Pa / hPa", "Mesurée au manomètre"] }
      ]
    }$json$),
    ('Les transformations chimiques', $json${
      "centre": "Les transformations chimiques",
      "branches": [
        { "titre": "Réactifs et produits", "enfants": ["Réactifs = de départ", "Produits = formés", "Fer + O₂ → rouille"] },
        { "titre": "Conservation de la masse", "enfants": ["Loi de Lavoisier", "Réactifs = produits", "Les atomes se réorganisent"] },
        { "titre": "Équation de réaction", "enfants": ["Réactifs → produits", "Conserver les atomes", "C + O₂ → CO₂"] },
        { "titre": "Les combustions", "enfants": ["Combustible + dioxygène", "Carbone → CO₂", "Méthane → CO₂ + eau"] }
      ]
    }$json$),
    ('Intensité et tension électriques', $json${
      "centre": "Intensité et tension électriques",
      "branches": [
        { "titre": "Intensité", "enfants": ["En ampères (A)", "Ampèremètre en série", "Traversé par le courant"] },
        { "titre": "Tension", "enfants": ["En volts (V)", "Voltmètre en dérivation", "Aux bornes du dipôle"] },
        { "titre": "Circuit en série", "enfants": ["Intensité unique partout", "Tensions s'additionnent", "Une seule boucle"] },
        { "titre": "Circuit en dérivation", "enfants": ["Loi des nœuds", "Les intensités se partagent", "Tension identique"] }
      ]
    }$json$),
    ('Vitesse et mouvement', $json${
      "centre": "Vitesse et mouvement",
      "branches": [
        { "titre": "Calculer la vitesse", "enfants": ["v = distance ÷ temps", "100 km en 2 h → 50 km/h", "d = v × t"] },
        { "titre": "Les unités", "enfants": ["km/h (vie courante)", "m/s (physique)", "Piéton ≈ 5 km/h"] },
        { "titre": "La trajectoire", "enfants": ["Ensemble des positions", "Rectiligne (droite)", "Circulaire (cercle)"] },
        { "titre": "Types de mouvement", "enfants": ["Uniforme = vitesse constante", "Accéléré = augmente", "Ralenti = diminue"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 4e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10919999-0000-4000-8000-000000000001'::uuid, 'L''air et ses propriétés'),
  ('10919999-0000-4000-8000-000000000002'::uuid, 'Les transformations chimiques'),
  ('10919999-0000-4000-8000-000000000003'::uuid, 'Intensité et tension électriques'),
  ('10919999-0000-4000-8000-000000000004'::uuid, 'Vitesse et mouvement')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
  -- Chapitre 1 — L'air et ses propriétés
  ('10910000-0000-4000-8000-000000000104'::uuid, 'L''air et ses propriétés',
   'Quel gaz est le plus présent dans l''air ?', 'mcq',
   '["Le diazote", "Le dioxygène", "Le dioxyde de carbone", "La vapeur d''eau"]', 0,
   'L''air contient environ 78 % de diazote et 21 % de dioxygène : le diazote est majoritaire.', 4),
  ('10910000-0000-4000-8000-000000000105'::uuid, 'L''air et ses propriétés',
   'Quelle est environ la proportion de dioxygène dans l''air ?', 'mcq',
   '["Environ 21 %", "Environ 78 %", "Environ 50 %", "Environ 1 %"]', 0,
   'L''air contient environ 21 % de dioxygène, le gaz nécessaire à la respiration.', 5),
  ('10910000-0000-4000-8000-000000000106'::uuid, 'L''air et ses propriétés',
   'L''air n''a pas de masse.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''air est de la matière. Un litre d''air a une masse d''environ 1,2 g.', 6),
  ('10910000-0000-4000-8000-000000000107'::uuid, 'L''air et ses propriétés',
   'Que se passe-t-il quand on comprime l''air dans une seringue bouchée ?', 'mcq',
   '["Son volume diminue", "Son volume augmente", "Sa masse diminue", "Il devient liquide"]', 0,
   'Un gaz est compressible : en poussant le piston, son volume diminue et sa pression augmente.', 7),
  ('10910000-0000-4000-8000-000000000108'::uuid, 'L''air et ses propriétés',
   'Dans quelle unité mesure-t-on une pression ?', 'mcq',
   '["Le pascal (Pa)", "Le gramme (g)", "Le litre (L)", "L''ampère (A)"]', 0,
   'Une pression se mesure en pascals (Pa) ou en hectopascals (hPa).', 8),
  ('10910000-0000-4000-8000-000000000109'::uuid, 'L''air et ses propriétés',
   'Un gaz est compressible : on peut réduire son volume.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : contrairement aux liquides, un gaz peut être comprimé (son volume diminue).', 9),
  ('10910000-0000-4000-8000-000000000110'::uuid, 'L''air et ses propriétés',
   'Quel instrument mesure la pression d''un gaz ?', 'mcq',
   '["Le manomètre", "La balance", "Le thermomètre", "Le voltmètre"]', 0,
   'Le manomètre mesure la pression ; la balance mesure une masse, le thermomètre une température.', 10),

  -- Chapitre 2 — Les transformations chimiques
  ('10910000-0000-4000-8000-000000000204'::uuid, 'Les transformations chimiques',
   'Dans une transformation chimique, les espèces de départ s''appellent : ', 'mcq',
   '["Les réactifs", "Les produits", "Les mélanges", "Les solutions"]', 0,
   'Les réactifs sont consommés au départ ; les produits sont formés à l''arrivée.', 4),
  ('10910000-0000-4000-8000-000000000205'::uuid, 'Les transformations chimiques',
   'Au cours d''une transformation chimique, la masse totale : ', 'mcq',
   '["Se conserve", "Augmente", "Diminue", "Disparaît"]', 0,
   'La masse totale se conserve (loi de Lavoisier) : masse des réactifs = masse des produits.', 5),
  ('10910000-0000-4000-8000-000000000206'::uuid, 'Les transformations chimiques',
   'La combustion du carbone dans le dioxygène produit : ', 'mcq',
   '["Du dioxyde de carbone", "Du dioxygène", "De l''eau salée", "Du diazote"]', 0,
   'Carbone + dioxygène → dioxyde de carbone (C + O₂ → CO₂).', 6),
  ('10910000-0000-4000-8000-000000000207'::uuid, 'Les transformations chimiques',
   'Les espèces formées lors d''une transformation chimique s''appellent les produits.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : les produits sont les nouvelles espèces formées à la fin de la transformation.', 7),
  ('10910000-0000-4000-8000-000000000208'::uuid, 'Les transformations chimiques',
   'Une combustion a besoin d''un combustible et : ', 'mcq',
   '["D''un comburant (le dioxygène)", "D''eau", "De diazote", "de sel"]', 0,
   'Une combustion nécessite un combustible (ce qui brûle) et un comburant : le dioxygène de l''air.', 8),
  ('10910000-0000-4000-8000-000000000209'::uuid, 'Les transformations chimiques',
   'Lors d''une transformation chimique, des atomes disparaissent.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les atomes se réorganisent mais ne disparaissent pas ; ils sont conservés.', 9),
  ('10910000-0000-4000-8000-000000000210'::uuid, 'Les transformations chimiques',
   'Que produit la combustion du méthane (gaz de ville) ?', 'mcq',
   '["Du dioxyde de carbone et de l''eau", "Uniquement de l''eau", "Du diazote", "Du carbone solide"]', 0,
   'La combustion complète du méthane produit du dioxyde de carbone et de l''eau.', 10),

  -- Chapitre 3 — Intensité et tension électriques
  ('10910000-0000-4000-8000-000000000304'::uuid, 'Intensité et tension électriques',
   'Dans quelle unité mesure-t-on l''intensité d''un courant ?', 'mcq',
   '["L''ampère (A)", "Le volt (V)", "Le watt (W)", "Le pascal (Pa)"]', 0,
   'L''intensité du courant se mesure en ampères (A).', 4),
  ('10910000-0000-4000-8000-000000000305'::uuid, 'Intensité et tension électriques',
   'Comment branche-t-on un ampèremètre ?', 'mcq',
   '["En série dans le circuit", "En dérivation", "Aux bornes de la pile seulement", "Sur l''interrupteur"]', 0,
   'L''ampèremètre se branche en série : il doit être traversé par le courant à mesurer.', 5),
  ('10910000-0000-4000-8000-000000000306'::uuid, 'Intensité et tension électriques',
   'Dans quelle unité mesure-t-on une tension ?', 'mcq',
   '["Le volt (V)", "L''ampère (A)", "Le gramme (g)", "Le mètre (m)"]', 0,
   'La tension électrique se mesure en volts (V).', 6),
  ('10910000-0000-4000-8000-000000000307'::uuid, 'Intensité et tension électriques',
   'Comment branche-t-on un voltmètre ?', 'mcq',
   '["En dérivation, aux bornes du dipôle", "En série", "À l''intérieur de la pile", "Sur l''interrupteur"]', 0,
   'Le voltmètre se branche en dérivation, aux bornes du dipôle dont on mesure la tension.', 7),
  ('10910000-0000-4000-8000-000000000308'::uuid, 'Intensité et tension électriques',
   'Dans un circuit en série, l''intensité est la même en tout point.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : c''est la loi d''unicité de l''intensité dans un circuit en série.', 8),
  ('10910000-0000-4000-8000-000000000309'::uuid, 'Intensité et tension électriques',
   'Dans un circuit en série, les tensions des dipôles s''additionnent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : loi d''additivité des tensions — la tension du générateur est la somme des autres.', 9),
  ('10910000-0000-4000-8000-000000000310'::uuid, 'Intensité et tension électriques',
   'À un nœud d''un circuit, l''intensité qui arrive est : ', 'mcq',
   '["Égale à l''intensité qui repart (loi des nœuds)", "Toujours nulle", "Doublée", "Perdue"]', 0,
   'Loi des nœuds : la somme des intensités qui arrivent est égale à la somme de celles qui repartent.', 10),

  -- Chapitre 4 — Vitesse et mouvement
  ('10910000-0000-4000-8000-000000000404'::uuid, 'Vitesse et mouvement',
   'Comment calcule-t-on une vitesse ?', 'mcq',
   '["v = distance ÷ temps", "v = distance × temps", "v = temps ÷ distance", "v = distance + temps"]', 0,
   'La vitesse est le quotient de la distance par le temps : v = d ÷ t.', 4),
  ('10910000-0000-4000-8000-000000000405'::uuid, 'Vitesse et mouvement',
   'Une voiture parcourt 100 km en 2 h. Quelle est sa vitesse moyenne ?', 'mcq',
   '["50 km/h", "200 km/h", "102 km/h", "25 km/h"]', 0,
   'v = d ÷ t = 100 ÷ 2 = 50 km/h.', 5),
  ('10910000-0000-4000-8000-000000000406'::uuid, 'Vitesse et mouvement',
   'Quelle est une unité de vitesse ?', 'mcq',
   '["Le mètre par seconde (m/s)", "Le mètre (m)", "La seconde (s)", "Le kilogramme (kg)"]', 0,
   'La vitesse s''exprime en m/s (physique) ou en km/h (vie courante).', 6),
  ('10910000-0000-4000-8000-000000000407'::uuid, 'Vitesse et mouvement',
   'La trajectoire est l''ensemble des positions occupées par un objet au cours de son mouvement.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la trajectoire est la ligne formée par toutes les positions successives de l''objet.', 7),
  ('10910000-0000-4000-8000-000000000408'::uuid, 'Vitesse et mouvement',
   'Un objet dont la trajectoire est une droite a un mouvement : ', 'mcq',
   '["Rectiligne", "Circulaire", "Curviligne", "Immobile"]', 0,
   'Trajectoire en ligne droite → mouvement rectiligne ; en cercle → circulaire.', 8),
  ('10910000-0000-4000-8000-000000000409'::uuid, 'Vitesse et mouvement',
   'Un mouvement dont la vitesse augmente est dit : ', 'mcq',
   '["Accéléré", "Uniforme", "Ralenti", "Immobile"]', 0,
   'Vitesse constante = uniforme ; vitesse qui augmente = accéléré ; vitesse qui diminue = ralenti.', 9),
  ('10910000-0000-4000-8000-000000000410'::uuid, 'Vitesse et mouvement',
   'Un piéton qui marche à 5 km/h va plus vite qu''une voiture sur autoroute.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : 5 km/h est une vitesse de marche, bien plus lente qu''une voiture (≈ 130 km/h).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
