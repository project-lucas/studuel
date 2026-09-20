-- =============================================================================
-- Studuel — Migration 095 : CONTENU Maths 5e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Maths 5e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
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
    ('Nombres relatifs', $md$# Les nombres relatifs

## Ce que tu vas comprendre
Les **nombres relatifs** permettent de compter en dessous de zéro : les températures négatives, les étages en sous-sol, un compte bancaire à découvert… Ce chapitre t'apprend à les comparer et à les additionner ou soustraire.

## 1. Qu'est-ce qu'un nombre relatif ?
Un nombre relatif possède un **signe** : **+** (positif) ou **−** (négatif).
- Les **positifs** : +3, +7,5 (souvent écrits sans le +).
- Les **négatifs** : −4, −2,5.
- **0** n'est ni positif ni négatif.

*Exemple : une température de −5 °C est plus froide que −2 °C.*

## 2. Comparer des nombres relatifs
Sur une droite graduée, un nombre est **plus grand** quand il est situé **plus à droite**.
- Un positif est toujours **plus grand** qu'un négatif : +1 > −8.
- Entre deux négatifs, **le plus grand est celui le plus proche de 0** : −2 > −7.

## 3. Additionner deux relatifs
- **Mêmes signes** : on additionne les distances à zéro et on garde le signe commun.
  *Exemple : (−3) + (−4) = **−7**.*
- **Signes différents** : on soustrait les distances à zéro et on garde le signe du plus « fort ».
  *Exemple : (−7) + (+2) = **−5** ; (+9) + (−4) = **+5**.*

## 4. Soustraire un relatif
**Soustraire, c'est ajouter l'opposé.** On change le − en + et on prend l'opposé du second nombre.

*Exemples :*
- 5 − (+8) = 5 + (−8) = **−3**.
- 5 − (−3) = 5 + (+3) = **+8**.

## 5. Règle des signes (retenir vite)
- (+) + (+) → positif ; (−) + (−) → négatif.
- Soustraire un nombre négatif **augmente** le résultat.

## L'essentiel à retenir
- Un relatif a un **signe** ; 0 n'est ni positif ni négatif.
- Un positif est toujours plus grand qu'un négatif ; entre deux négatifs, le plus proche de 0 est le plus grand.
- **Mêmes signes** : on ajoute les distances, on garde le signe ; **signes différents** : on soustrait.
- **Soustraire, c'est ajouter l'opposé** : a − (−b) = a + b.$md$),

    ('Fractions et calculs', $md$# Fractions et calculs

## Ce que tu vas comprendre
En 5e, on apprend à **calculer** avec les fractions : les additionner, les soustraire et les multiplier. Ce chapitre te donne les méthodes sûres pour ne plus te tromper.

## 1. Rappel : fractions égales
Multiplier (ou diviser) le numérateur ET le dénominateur par un même nombre donne une **fraction égale**.

*Exemple : 1/2 = 2/4 = 3/6. On multiplie en haut et en bas par le même nombre.*

## 2. Additionner avec le même dénominateur
Quand les dénominateurs sont **identiques**, on additionne (ou soustrait) les **numérateurs** et on **garde** le dénominateur.

*Exemple : 3/7 + 2/7 = **5/7**.*

## 3. Additionner avec des dénominateurs différents
On **met au même dénominateur** avant de calculer.

*Exemple : 1/2 + 1/3.*
- On transforme : 1/2 = 3/6 et 1/3 = 2/6.
- On additionne : 3/6 + 2/6 = **5/6**.

## 4. Multiplier deux fractions
On multiplie les **numérateurs entre eux** et les **dénominateurs entre eux**.

*Exemple : 2/3 × 4/5 = (2 × 4)/(3 × 5) = **8/15**.*

*Autre exemple : 3/4 × 2 = 3/4 × 2/1 = **6/4** (soit 3/2).*

## 5. Prendre une fraction d'une quantité
« Prendre les 2/3 de 12 » signifie **× 2/3** : 12 × 2/3 = (12 ÷ 3) × 2 = 4 × 2 = **8**.

> **Astuce :** pour multiplier, on n'a **jamais** besoin du même dénominateur (contrairement à l'addition).

## L'essentiel à retenir
- **Même dénominateur** : on additionne les numérateurs, on garde le dénominateur.
- **Dénominateurs différents** : on met d'abord au même dénominateur.
- **Multiplication** : numérateur × numérateur, dénominateur × dénominateur (pas besoin du même dénominateur).
- « Prendre une fraction d'une quantité » = **multiplier** par cette fraction.$md$),

    ('Calcul littéral : initiation', $md$# Calcul littéral : initiation

## Ce que tu vas comprendre
Le **calcul littéral**, c'est calculer avec des **lettres** qui représentent des nombres. Cela permet d'écrire des formules et de raisonner sur des nombres inconnus. Ce chapitre pose les bases.

## 1. Une lettre pour un nombre
Une **lettre** (souvent x, a, n) représente un nombre quelconque. Une **expression littérale** est un calcul contenant des lettres.

*Exemple : le périmètre d'un carré de côté c s'écrit **4 × c**, soit **4c**.*

## 2. Les conventions d'écriture
Pour alléger l'écriture, on **supprime le signe ×** devant une lettre :
- 4 × c s'écrit **4c** ;
- a × b s'écrit **ab** ;
- x × x s'écrit **x²**.

## 3. Calculer la valeur d'une expression
**Substituer**, c'est remplacer la lettre par un nombre, puis calculer.

*Exemple : pour x = 5, l'expression 3x + 2 vaut 3 × 5 + 2 = 15 + 2 = **17**.*

## 4. Réduire une expression
On peut **regrouper les termes semblables** (ceux qui ont la même lettre).

*Exemples :*
- 2x + 5x = **7x** (comme 2 pommes + 5 pommes = 7 pommes).
- 3a + 4 + 2a = **5a + 4** (on ne mélange pas les 5a et le 4).

## 5. La distributivité : k(a + b)
Multiplier une somme, c'est **multiplier chaque terme** :
$$k(a + b) = k \times a + k \times b$$

*Exemples :*
- 3(x + 2) = 3 × x + 3 × 2 = **3x + 6**.
- 5(2 + a) = 10 + **5a**.

## L'essentiel à retenir
- Une **lettre** représente un nombre ; on **supprime le ×** devant une lettre (4c, ab, x²).
- **Substituer** = remplacer la lettre par sa valeur, puis calculer.
- **Réduire** = regrouper les termes en même lettre : 2x + 5x = 7x.
- **Distributivité** : k(a + b) = ka + kb.$md$),

    ('Triangles et angles', $md$# Triangles et angles

## Ce que tu vas comprendre
Le triangle est la figure de base de la géométrie. Ce chapitre t'apprend deux propriétés essentielles : la **somme des angles** vaut toujours 180°, et l'**inégalité triangulaire** qui dit quand un triangle peut exister.

## 1. Angles : rappels
Un angle se mesure en **degrés (°)** au **rapporteur**.
- **aigu** < 90° ; **droit** = 90° ; **obtus** entre 90° et 180° ; **plat** = 180°.

## 2. La somme des angles d'un triangle
Dans **tout** triangle, la somme des trois angles vaut **180°**.

*Exemple : un triangle a deux angles de 50° et 60°. Le troisième mesure :*
$$180 - (50 + 60) = 180 - 110 = **70°**.$$

## 3. Triangles particuliers
- **Triangle équilatéral** : 3 côtés égaux, et **3 angles de 60°** (car 180 ÷ 3 = 60).
- **Triangle isocèle** : 2 côtés égaux et les **2 angles à la base égaux**.
- **Triangle rectangle** : un **angle droit** (90°) ; les deux autres angles font ensemble 90°.

## 4. L'inégalité triangulaire
Un triangle existe **seulement si** le plus grand côté est **plus petit** que la somme des deux autres.

*Exemple : peut-on construire un triangle de côtés 3 cm, 4 cm et 9 cm ?*
- On compare : 3 + 4 = 7, or 7 < 9. **Impossible** : le triangle ne se referme pas.

## 5. Construire un triangle
Avec la **règle** et le **compas**, on reporte les longueurs des côtés ; avec le **rapporteur**, on reporte les angles. On vérifie toujours l'inégalité triangulaire avant de commencer.

## L'essentiel à retenir
- La somme des angles d'un triangle vaut **toujours 180°**.
- **Équilatéral** : 3 angles de 60° ; **isocèle** : 2 angles égaux ; **rectangle** : un angle de 90°.
- **Inégalité triangulaire** : le plus grand côté doit être **plus court** que la somme des deux autres.
- On construit à la règle, au compas et au rapporteur.$md$),

    ('Proportionnalité et pourcentages', $md$# Proportionnalité et pourcentages

## Ce que tu vas comprendre
Les **pourcentages** sont partout : soldes, taux, statistiques. Ce sont des situations de **proportionnalité** particulières. Ce chapitre t'apprend à appliquer et à calculer un pourcentage.

## 1. Rappel : proportionnalité et coefficient
Deux grandeurs sont **proportionnelles** quand on passe de l'une à l'autre en multipliant par un même nombre, le **coefficient de proportionnalité**.

## 2. Comprendre un pourcentage
Un pourcentage est une proportion **sur 100**. « 25 % » signifie **25 pour 100**, soit la fraction 25/100 = 0,25.
- 50 % = 1/2 (la moitié) ; 25 % = 1/4 (le quart) ; 10 % = 1/10.

## 3. Appliquer (calculer) un pourcentage
Prendre « t % d'une valeur », c'est **multiplier** par t/100.

*Exemple : 30 % de 80.*
$$80 \times \frac{30}{100} = \frac{2400}{100} = **24**.$$

*Autre méthode : 10 % de 80 = 8, donc 30 % = 3 × 8 = **24**.*

## 4. Calculer un pourcentage (proportion)
Pour savoir **quel pourcentage** une partie représente, on calcule (partie ÷ total) × 100.

*Exemple : 12 élèves sur 50 aiment les maths. Cela fait :*
$$\frac{12}{50} \times 100 = 0{,}24 \times 100 = **24 %**.$$

## 5. Augmentation et réduction
- Une **réduction de 20 %** sur 50 € : réduction = 50 × 20/100 = 10 €, donc prix payé = **40 €**.
- Une **hausse de 5 %** sur 200 : hausse = 200 × 5/100 = 10, donc total = **210**.

## L'essentiel à retenir
- Un pourcentage est une proportion **sur 100** : t % = t/100.
- **Appliquer** un pourcentage = **multiplier** par t/100 (30 % de 80 = 24).
- **Calculer** un pourcentage = (partie ÷ total) × 100.
- Réduction : on **soustrait** la remise ; hausse : on **ajoute** l'augmentation.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Nombres relatifs', $json${
      "centre": "Les nombres relatifs",
      "branches": [
        { "titre": "Signe et repérage", "enfants": ["Positif (+) ou négatif (−)", "0 : ni + ni −", "Températures, étages, comptes"] },
        { "titre": "Comparer", "enfants": ["Plus à droite = plus grand", "+1 > −8", "Entre négatifs : −2 > −7"] },
        { "titre": "Additionner", "enfants": ["Mêmes signes : on ajoute", "(−3)+(−4) = −7", "Signes différents : on soustrait"] },
        { "titre": "Soustraire", "enfants": ["Ajouter l'opposé", "5 − (−3) = 5 + 3 = 8", "5 − (+8) = −3"] }
      ]
    }$json$),
    ('Fractions et calculs', $json${
      "centre": "Fractions et calculs",
      "branches": [
        { "titre": "Fractions égales", "enfants": ["× (ou ÷) en haut ET en bas", "1/2 = 2/4 = 3/6", "Même nombre partout"] },
        { "titre": "Même dénominateur", "enfants": ["On ajoute les numérateurs", "On garde le dénominateur", "3/7 + 2/7 = 5/7"] },
        { "titre": "Dénominateurs différents", "enfants": ["Mettre au même dénominateur", "1/2 = 3/6, 1/3 = 2/6", "1/2 + 1/3 = 5/6"] },
        { "titre": "Multiplier", "enfants": ["num × num, dén × dén", "2/3 × 4/5 = 8/15", "Pas besoin du même dénom."] }
      ]
    }$json$),
    ('Calcul littéral : initiation', $json${
      "centre": "Calcul littéral",
      "branches": [
        { "titre": "Une lettre = un nombre", "enfants": ["Expression littérale", "Périmètre carré = 4c", "x, a, n inconnus"] },
        { "titre": "Écriture", "enfants": ["On supprime le ×", "4 × c = 4c", "x × x = x²"] },
        { "titre": "Réduire", "enfants": ["Regrouper les mêmes lettres", "2x + 5x = 7x", "3a + 4 + 2a = 5a + 4"] },
        { "titre": "Distributivité", "enfants": ["k(a + b) = ka + kb", "3(x + 2) = 3x + 6", "Substituer pour calculer"] }
      ]
    }$json$),
    ('Triangles et angles', $json${
      "centre": "Triangles et angles",
      "branches": [
        { "titre": "Somme des angles", "enfants": ["Toujours 180°", "50° + 60° → 3e = 70°", "Vrai pour tout triangle"] },
        { "titre": "Triangles particuliers", "enfants": ["Équilatéral : 3 × 60°", "Isocèle : 2 angles égaux", "Rectangle : un angle de 90°"] },
        { "titre": "Inégalité triangulaire", "enfants": ["Plus grand côté < somme des 2 autres", "3, 4, 9 impossible (7 < 9)", "Vérifier avant de construire"] },
        { "titre": "Mesurer et construire", "enfants": ["Rapporteur (°)", "Règle et compas", "Aigu, droit, obtus, plat"] }
      ]
    }$json$),
    ('Proportionnalité et pourcentages', $json${
      "centre": "Proportionnalité et %",
      "branches": [
        { "titre": "Comprendre le %", "enfants": ["Proportion sur 100", "25 % = 25/100 = 0,25", "50 % = 1/2, 10 % = 1/10"] },
        { "titre": "Appliquer un %", "enfants": ["× t/100", "30 % de 80 = 24", "10 % de 80 = 8"] },
        { "titre": "Calculer un %", "enfants": ["(partie ÷ total) × 100", "12 sur 50 = 24 %", "Proportion en %"] },
        { "titre": "Hausse et baisse", "enfants": ["Réduction : on soustrait", "−20 % de 50 → payer 40 €", "Hausse : on ajoute"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds ont déjà créé les quiz 5e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '5e', v.chapter, true, l.id
FROM (VALUES
  ('09519999-0000-4000-8000-000000000001'::uuid, 'Nombres relatifs'),
  ('09519999-0000-4000-8000-000000000002'::uuid, 'Fractions et calculs'),
  ('09519999-0000-4000-8000-000000000003'::uuid, 'Calcul littéral : initiation'),
  ('09519999-0000-4000-8000-000000000004'::uuid, 'Triangles et angles'),
  ('09519999-0000-4000-8000-000000000005'::uuid, 'Proportionnalité et pourcentages')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
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
  -- Chapitre 1 — Nombres relatifs
  ('09510000-0000-4000-8000-000000000104'::uuid, 'Nombres relatifs',
   'Quel nombre est le plus grand : −2 ou −7 ?', 'mcq',
   '["−2", "−7", "Ils sont égaux", "On ne peut pas savoir"]', 0,
   'Entre deux négatifs, le plus grand est le plus proche de 0 : −2 > −7.', 4),
  ('09510000-0000-4000-8000-000000000105'::uuid, 'Nombres relatifs',
   'Combien font (−3) + (−4) ?', 'mcq',
   '["−7", "−1", "+7", "+1"]', 0,
   'Mêmes signes : on ajoute les distances (3 + 4 = 7) et on garde le signe − : −7.', 5),
  ('09510000-0000-4000-8000-000000000106'::uuid, 'Nombres relatifs',
   'Combien font (−7) + (+2) ?', 'mcq',
   '["−5", "−9", "+5", "+9"]', 0,
   'Signes différents : on soustrait (7 − 2 = 5) et on garde le signe du plus fort (−) : −5.', 6),
  ('09510000-0000-4000-8000-000000000107'::uuid, 'Nombres relatifs',
   'Un nombre positif est toujours plus grand qu''un nombre négatif.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sur la droite graduée, tout positif est à droite de tout négatif, donc plus grand.', 7),
  ('09510000-0000-4000-8000-000000000108'::uuid, 'Nombres relatifs',
   'Combien font 5 − (−3) ?', 'mcq',
   '["8", "2", "−8", "−2"]', 0,
   'Soustraire, c''est ajouter l''opposé : 5 − (−3) = 5 + 3 = 8.', 8),
  ('09510000-0000-4000-8000-000000000109'::uuid, 'Nombres relatifs',
   'Le nombre 0 est un nombre positif.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : 0 n''est ni positif ni négatif.', 9),
  ('09510000-0000-4000-8000-000000000110'::uuid, 'Nombres relatifs',
   'Combien font (+9) + (−4) ?', 'mcq',
   '["+5", "+13", "−5", "−13"]', 0,
   'Signes différents : 9 − 4 = 5, et on garde le signe + du plus fort : +5.', 10),

  -- Chapitre 2 — Fractions et calculs
  ('09510000-0000-4000-8000-000000000204'::uuid, 'Fractions et calculs',
   'Combien font 3/7 + 2/7 ?', 'mcq',
   '["5/7", "5/14", "6/7", "5/49"]', 0,
   'Même dénominateur : on additionne les numérateurs (3 + 2 = 5) et on garde 7 : 5/7.', 4),
  ('09510000-0000-4000-8000-000000000205'::uuid, 'Fractions et calculs',
   'Combien font 2/3 × 4/5 ?', 'mcq',
   '["8/15", "6/8", "8/8", "2/15"]', 0,
   'On multiplie les numérateurs (2 × 4 = 8) et les dénominateurs (3 × 5 = 15) : 8/15.', 5),
  ('09510000-0000-4000-8000-000000000206'::uuid, 'Fractions et calculs',
   'Pour additionner 1/2 + 1/3, il faut d''abord : ', 'mcq',
   '["Mettre au même dénominateur", "Multiplier les numérateurs", "Additionner les dénominateurs", "Rien, on additionne directement"]', 0,
   'Les dénominateurs sont différents : on met au même dénominateur (1/2 = 3/6, 1/3 = 2/6) avant d''additionner.', 6),
  ('09510000-0000-4000-8000-000000000207'::uuid, 'Fractions et calculs',
   'Combien font 1/2 + 1/3 ?', 'mcq',
   '["5/6", "2/5", "1/6", "2/6"]', 0,
   '1/2 = 3/6 et 1/3 = 2/6, donc 3/6 + 2/6 = 5/6.', 7),
  ('09510000-0000-4000-8000-000000000208'::uuid, 'Fractions et calculs',
   'Pour multiplier deux fractions, il faut le même dénominateur.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : pour multiplier, on multiplie numérateurs entre eux et dénominateurs entre eux, sans mise au même dénominateur.', 8),
  ('09510000-0000-4000-8000-000000000209'::uuid, 'Fractions et calculs',
   'Combien valent les 2/3 de 12 ?', 'mcq',
   '["8", "6", "18", "4"]', 0,
   '12 × 2/3 = (12 ÷ 3) × 2 = 4 × 2 = 8.', 9),
  ('09510000-0000-4000-8000-000000000210'::uuid, 'Fractions et calculs',
   'La fraction 3/6 est égale à 1/2.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On divise numérateur et dénominateur par 3 : 3/6 = 1/2.', 10),

  -- Chapitre 3 — Calcul littéral : initiation
  ('09510000-0000-4000-8000-000000000304'::uuid, 'Calcul littéral : initiation',
   'Comment écrit-on 4 × c plus simplement ?', 'mcq',
   '["4c", "c4", "4 + c", "4/c"]', 0,
   'Devant une lettre, on supprime le signe × : 4 × c s''écrit 4c.', 4),
  ('09510000-0000-4000-8000-000000000305'::uuid, 'Calcul littéral : initiation',
   'Combien vaut 3x + 2 quand x = 5 ?', 'mcq',
   '["17", "15", "10", "25"]', 0,
   'On remplace x par 5 : 3 × 5 + 2 = 15 + 2 = 17.', 5),
  ('09510000-0000-4000-8000-000000000306'::uuid, 'Calcul littéral : initiation',
   'Que vaut la forme réduite de 2x + 5x ?', 'mcq',
   '["7x", "10x", "7", "10x²"]', 0,
   'On regroupe les termes en x : 2x + 5x = 7x.', 6),
  ('09510000-0000-4000-8000-000000000307'::uuid, 'Calcul littéral : initiation',
   'Développe 3(x + 2). On obtient : ', 'mcq',
   '["3x + 6", "3x + 2", "x + 6", "3x + 5"]', 0,
   'Distributivité : 3 × x + 3 × 2 = 3x + 6.', 7),
  ('09510000-0000-4000-8000-000000000308'::uuid, 'Calcul littéral : initiation',
   'On peut réduire 3a + 4 en 7a.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : 3a et 4 ne sont pas des termes semblables (l''un a la lettre a, l''autre non). 3a + 4 reste 3a + 4.', 8),
  ('09510000-0000-4000-8000-000000000309'::uuid, 'Calcul littéral : initiation',
   'Comment écrit-on x × x ?', 'mcq',
   '["x²", "2x", "xx", "x + x"]', 0,
   'x × x se note x² (« x au carré »).', 9),
  ('09510000-0000-4000-8000-000000000310'::uuid, 'Calcul littéral : initiation',
   'La forme réduite de 3a + 4 + 2a est : ', 'mcq',
   '["5a + 4", "9a", "5a", "7a + 2"]', 0,
   'On regroupe les termes en a : 3a + 2a = 5a, et on garde le 4 : 5a + 4.', 10),

  -- Chapitre 4 — Triangles et angles
  ('09510000-0000-4000-8000-000000000404'::uuid, 'Triangles et angles',
   'Combien vaut la somme des angles d''un triangle ?', 'mcq',
   '["180°", "360°", "90°", "100°"]', 0,
   'Dans tout triangle, la somme des trois angles vaut 180°.', 4),
  ('09510000-0000-4000-8000-000000000405'::uuid, 'Triangles et angles',
   'Un triangle a deux angles de 50° et 60°. Que vaut le troisième ?', 'mcq',
   '["70°", "110°", "80°", "60°"]', 0,
   '180 − (50 + 60) = 180 − 110 = 70°.', 5),
  ('09510000-0000-4000-8000-000000000406'::uuid, 'Triangles et angles',
   'Combien mesure chaque angle d''un triangle équilatéral ?', 'mcq',
   '["60°", "90°", "45°", "180°"]', 0,
   'Trois angles égaux dont la somme fait 180° : 180 ÷ 3 = 60°.', 6),
  ('09510000-0000-4000-8000-000000000407'::uuid, 'Triangles et angles',
   'Peut-on construire un triangle de côtés 3 cm, 4 cm et 9 cm ?', 'mcq',
   '["Non, car 3 + 4 < 9", "Oui, toujours", "Non, car les côtés sont différents", "Oui, car 9 > 4"]', 0,
   'Inégalité triangulaire : 3 + 4 = 7, or 7 < 9. Le triangle ne peut pas se refermer.', 7),
  ('09510000-0000-4000-8000-000000000408'::uuid, 'Triangles et angles',
   'Un triangle isocèle a deux angles égaux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : un triangle isocèle a deux côtés égaux et les deux angles à la base égaux.', 8),
  ('09510000-0000-4000-8000-000000000409'::uuid, 'Triangles et angles',
   'Dans un triangle rectangle, un angle mesure : ', 'mcq',
   '["90°", "60°", "45°", "180°"]', 0,
   'Un triangle rectangle possède un angle droit, soit 90°.', 9),
  ('09510000-0000-4000-8000-000000000410'::uuid, 'Triangles et angles',
   'Un angle qui mesure 120° est : ', 'mcq',
   '["Obtus", "Aigu", "Droit", "Plat"]', 0,
   'Entre 90° et 180°, l''angle est obtus.', 10),

  -- Chapitre 5 — Proportionnalité et pourcentages
  ('09510000-0000-4000-8000-000000000504'::uuid, 'Proportionnalité et pourcentages',
   'À quelle fraction correspond 25 % ?', 'mcq',
   '["1/4", "1/2", "1/25", "25"]', 0,
   '25 % = 25/100 = 1/4 (le quart).', 4),
  ('09510000-0000-4000-8000-000000000505'::uuid, 'Proportionnalité et pourcentages',
   'Combien font 30 % de 80 ?', 'mcq',
   '["24", "30", "50", "240"]', 0,
   '80 × 30/100 = 2400/100 = 24.', 5),
  ('09510000-0000-4000-8000-000000000506'::uuid, 'Proportionnalité et pourcentages',
   'Sur 50 élèves, 12 aiment les maths. Quel pourcentage cela représente-t-il ?', 'mcq',
   '["24 %", "12 %", "38 %", "50 %"]', 0,
   '(12 ÷ 50) × 100 = 0,24 × 100 = 24 %.', 6),
  ('09510000-0000-4000-8000-000000000507'::uuid, 'Proportionnalité et pourcentages',
   'Un article à 50 € est soldé à −20 %. Combien coûte-t-il ?', 'mcq',
   '["40 €", "30 €", "45 €", "10 €"]', 0,
   'Réduction = 50 × 20/100 = 10 €, donc prix payé = 50 − 10 = 40 €.', 7),
  ('09510000-0000-4000-8000-000000000508'::uuid, 'Proportionnalité et pourcentages',
   'Prendre 50 % d''une valeur revient à en prendre la moitié.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : 50 % = 50/100 = 1/2, soit la moitié.', 8),
  ('09510000-0000-4000-8000-000000000509'::uuid, 'Proportionnalité et pourcentages',
   'Combien font 10 % de 80 ?', 'mcq',
   '["8", "10", "18", "800"]', 0,
   '80 × 10/100 = 8.', 9),
  ('09510000-0000-4000-8000-000000000510'::uuid, 'Proportionnalité et pourcentages',
   'Une hausse de 5 % sur 200 donne un total de : ', 'mcq',
   '["210", "205", "250", "195"]', 0,
   'Hausse = 200 × 5/100 = 10, donc total = 200 + 10 = 210.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
