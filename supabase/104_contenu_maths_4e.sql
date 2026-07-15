-- =============================================================================
-- Studuel — Migration 104 : CONTENU Maths 4e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Maths 4e (programme cycle 4, Éduscol) :
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
    ('Puissances', $md$# Les puissances

## Ce que tu vas comprendre
Une **puissance** est une écriture courte pour une multiplication répétée du même nombre. Ce chapitre t'apprend la notation aⁿ, les puissances de 10 et les règles de calcul (produit, quotient).

## 1. La notation puissance
Pour un nombre a et un entier n, on note **aⁿ** le produit de **n facteurs** égaux à a :

*aⁿ = a × a × … × a (n fois).*

- a s'appelle la **base**, n l'**exposant**.
- **2⁴ = 2 × 2 × 2 × 2 = 16**.
- a² se lit « a au **carré** », a³ « a au **cube** ».

*Exemples : 3² = 3 × 3 = **9** ; 5³ = 5 × 5 × 5 = **125**.*

## 2. Cas particuliers
- **a¹ = a** (un seul facteur).
- **a⁰ = 1** pour tout nombre a non nul.

## 3. Les puissances de 10
**10ⁿ** est le nombre 1 suivi de **n zéros** :
- 10³ = **1 000** ; 10⁶ = **1 000 000**.

Les puissances de 10 servent aussi à écrire les petits nombres :
- **10⁻ⁿ = 1 / 10ⁿ**, donc 10⁻² = **0,01**.

## 4. La règle du produit
Quand on **multiplie** deux puissances du même nombre, on **additionne** les exposants :

**aᵐ × aⁿ = aᵐ⁺ⁿ**

*Exemple : 2³ × 2² = 2³⁺² = 2⁵ = **32**.*

## 5. La règle du quotient
Quand on **divise** deux puissances du même nombre, on **soustrait** les exposants :

**aᵐ ÷ aⁿ = aᵐ⁻ⁿ**

*Exemple : 10⁵ ÷ 10² = 10⁵⁻² = 10³ = **1 000**.*

## L'essentiel à retenir
- **aⁿ** = produit de n facteurs égaux à a (base a, exposant n).
- **a² = carré**, **a³ = cube** ; a¹ = a et a⁰ = 1 (a ≠ 0).
- **10ⁿ** = 1 suivi de n zéros.
- Produit : on **additionne** les exposants (aᵐ × aⁿ = aᵐ⁺ⁿ).
- Quotient : on **soustrait** les exposants (aᵐ ÷ aⁿ = aᵐ⁻ⁿ).$md$),

    ('Calcul littéral', $md$# Le calcul littéral

## Ce que tu vas comprendre
Le **calcul littéral**, c'est calculer avec des **lettres** qui représentent des nombres. Ce chapitre t'apprend à **développer**, **réduire** et **factoriser** une expression.

## 1. Développer avec la distributivité
**Développer**, c'est transformer un **produit** en une **somme**. On utilise la distributivité :

**k(a + b) = k × a + k × b = ka + kb**

*Exemple : 3(x + 2) = 3 × x + 3 × 2 = **3x + 6**.*

## 2. La double distributivité
Pour un produit de deux sommes :

**(a + b)(c + d) = ac + ad + bc + bd**

*Exemple : (x + 2)(x + 3) = x × x + x × 3 + 2 × x + 2 × 3 = x² + 3x + 2x + 6 = **x² + 5x + 6**.*

## 3. Réduire une expression
**Réduire**, c'est regrouper les termes de **même nature** (les « x » avec les « x », les nombres avec les nombres) :

- 3x + 5x = **8x** (on additionne les coefficients).
- 2x + 7 + 4x − 3 = **6x + 4**.

> **Attention :** on ne peut pas additionner 3x et 5 ; ce ne sont pas des termes de même nature.

## 4. Factoriser
**Factoriser**, c'est l'inverse de développer : transformer une **somme** en un **produit** en repérant un **facteur commun**.

*Exemple : 6x + 9. Le facteur commun est 3 : 6x + 9 = 3 × 2x + 3 × 3 = **3(2x + 3)**.*

## 5. Calculer la valeur d'une expression
Pour une valeur donnée de la lettre, on **remplace** puis on calcule.

*Exemple : pour x = 3, 4x + 1 = 4 × 3 + 1 = 12 + 1 = **13**.*

## L'essentiel à retenir
- **Développer** : produit → somme (distributivité k(a+b) = ka + kb).
- **Double distributivité** : (a+b)(c+d) = ac + ad + bc + bd.
- **Réduire** : regrouper les termes de même nature (3x + 5x = 8x).
- **Factoriser** : somme → produit grâce à un facteur commun (6x + 9 = 3(2x+3)).$md$),

    ('Théorème de Pythagore', $md$# Le théorème de Pythagore

## Ce que tu vas comprendre
Le **théorème de Pythagore** relie les longueurs des trois côtés d'un **triangle rectangle**. Il sert à calculer une longueur manquante et à prouver qu'un angle est droit.

## 1. L'hypoténuse
Dans un triangle **rectangle**, le côté opposé à l'**angle droit** s'appelle l'**hypoténuse**. C'est toujours le **plus long** des trois côtés.

## 2. L'énoncé du théorème
Si un triangle ABC est **rectangle en A**, alors :

**BC² = AB² + AC²**

Autrement dit : le **carré de l'hypoténuse** est égal à la **somme des carrés** des deux autres côtés.

## 3. Calculer l'hypoténuse
On connaît les deux côtés de l'angle droit, on cherche l'hypoténuse.

*Exemple : côtés de 3 cm et 4 cm.*
- BC² = 3² + 4² = 9 + 16 = **25**.
- BC = √25 = **5 cm**.

## 4. Calculer un autre côté
On connaît l'hypoténuse et un côté, on cherche le troisième.

*Exemple : hypoténuse 13, un côté 5.*
- 13² = 5² + AC², donc 169 = 25 + AC².
- AC² = 169 − 25 = 144, donc AC = √144 = **12**.

## 5. La réciproque (prouver l'angle droit)
Si dans un triangle **BC² = AB² + AC²** (BC étant le plus grand côté), alors le triangle est **rectangle en A**.

*Exemple : côtés 5, 12 et 13. On calcule 5² + 12² = 25 + 144 = 169 et 13² = 169. Les résultats sont égaux : le triangle est **rectangle**.*

## L'essentiel à retenir
- L'**hypoténuse** est opposée à l'angle droit ; c'est le plus long côté.
- Théorème (rectangle en A) : **BC² = AB² + AC²**.
- Pour une longueur manquante : on calcule les carrés, puis on prend la **racine carrée**.
- **Réciproque** : si BC² = AB² + AC², le triangle est rectangle (preuve de l'angle droit).$md$),

    ('Proportionnalité et fonctions', $md$# Proportionnalité et fonctions

## Ce que tu vas comprendre
Beaucoup de situations (prix, vitesse, pourcentages) sont **proportionnelles**. En 4e, on les décrit avec une **fonction linéaire**. Ce chapitre fait le lien entre les deux.

## 1. Rappel : la proportionnalité
Deux grandeurs sont **proportionnelles** quand on passe de l'une à l'autre en **multipliant par un même nombre**, le **coefficient de proportionnalité**.

*Exemple : 1 kg de pommes coûte 3 € → 4 kg coûtent 4 × 3 = 12 € (coefficient 3).*

## 2. La fonction linéaire
Une situation de proportionnalité se décrit par une **fonction linéaire** :

**f(x) = a × x**

où **a** est le **coefficient**. On note f : x ↦ a x.

*Exemple : f(x) = 2x. Alors f(3) = 2 × 3 = **6** et f(5) = **10**.*

## 3. Trouver le coefficient
Le coefficient est le rapport (image) ÷ (antécédent).

*Exemple : la fonction linéaire qui à 4 associe 12 a pour coefficient a = 12 ÷ 4 = **3** (donc f(x) = 3x).*

## 4. Représentation graphique
La représentation graphique d'une fonction linéaire est une **droite passant par l'origine** (le point (0 ; 0)). Le coefficient a donne l'**inclinaison** de la droite.

## 5. Applications : vitesse et pourcentages
- **Vitesse** : vitesse = distance ÷ temps. *150 km en 2 h → 150 ÷ 2 = **75 km/h**.*
- **Pourcentage** : prendre t % d'un nombre, c'est le multiplier par t/100. *30 % de 80 = (80 ÷ 100) × 30 = **24**.*

## L'essentiel à retenir
- Proportionnalité = multiplication par un **coefficient** constant.
- **Fonction linéaire** : f(x) = a x (a = coefficient).
- Coefficient = image ÷ antécédent (f(x) = 3x si 4 ↦ 12).
- Graphique : une **droite passant par l'origine**.
- Vitesse = distance ÷ temps ; t % → × t/100.$md$),

    ('Statistiques et probabilités', $md$# Statistiques et probabilités

## Ce que tu vas comprendre
Les **statistiques** servent à résumer une série de données (moyenne, médiane…). Les **probabilités** mesurent la **chance** qu'un événement se produise. Ce chapitre présente les deux.

## 1. Les effectifs
L'**effectif** d'une valeur est le **nombre de fois** où elle apparaît dans la série. L'**effectif total** est le nombre total de données.

*Exemple : notes 8, 8, 10, 12 → l'effectif de 8 est **2**, l'effectif total est **4**.*

## 2. La moyenne
La **moyenne** = **somme des valeurs ÷ nombre de valeurs**.

*Exemple : 8, 12, 10, 6 → somme = 36, moyenne = 36 ÷ 4 = **9**.*

## 3. La médiane
Pour la **médiane**, on **range** les valeurs dans l'ordre croissant : la médiane **partage** la série en deux moitiés.

*Exemple : 3, 5, 7, 9, 11 → la valeur centrale est **7**.*

## 4. L'étendue
L'**étendue** mesure la **dispersion** : **étendue = valeur maximale − valeur minimale**.

*Exemple : 3, 7, 5, 11, 4 → étendue = 11 − 3 = **8**.*

## 5. Probabilité d'un événement simple
La **probabilité** d'un événement est un nombre entre **0 et 1**. Pour des issues **également probables** :

**P = nombre de cas favorables ÷ nombre de cas possibles**

*Exemples : un dé à 6 faces → P(obtenir 6) = **1/6** ; P(nombre pair) = 3/6 = **1/2**.*

## L'essentiel à retenir
- **Effectif** = nombre d'apparitions d'une valeur.
- **Moyenne** = somme ÷ nombre de valeurs.
- **Médiane** = valeur centrale de la série **rangée**.
- **Étendue** = maximum − minimum.
- **Probabilité** = cas favorables ÷ cas possibles ; toujours entre **0 et 1**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Puissances', $json${
      "centre": "Les puissances",
      "branches": [
        { "titre": "Notation aⁿ", "enfants": ["Base a, exposant n", "aⁿ = a × … × a (n fois)", "2⁴ = 16"] },
        { "titre": "Carré et cube", "enfants": ["a² = carré (3² = 9)", "a³ = cube (5³ = 125)", "a¹ = a, a⁰ = 1"] },
        { "titre": "Puissances de 10", "enfants": ["10ⁿ = 1 suivi de n zéros", "10³ = 1 000", "10⁻² = 0,01"] },
        { "titre": "Règles de calcul", "enfants": ["Produit : additionner (2³×2² = 2⁵)", "Quotient : soustraire (10⁵÷10² = 10³)", "Même base"] }
      ]
    }$json$),
    ('Calcul littéral', $json${
      "centre": "Le calcul littéral",
      "branches": [
        { "titre": "Développer", "enfants": ["Produit → somme", "k(a+b) = ka + kb", "3(x+2) = 3x + 6"] },
        { "titre": "Double distributivité", "enfants": ["(a+b)(c+d)", "= ac + ad + bc + bd", "(x+2)(x+3) = x² + 5x + 6"] },
        { "titre": "Réduire", "enfants": ["Regrouper les mêmes termes", "3x + 5x = 8x", "Pas 3x + 5"] },
        { "titre": "Factoriser", "enfants": ["Somme → produit", "Facteur commun", "6x + 9 = 3(2x+3)"] }
      ]
    }$json$),
    ('Théorème de Pythagore', $json${
      "centre": "Théorème de Pythagore",
      "branches": [
        { "titre": "Hypoténuse", "enfants": ["Opposée à l'angle droit", "Le plus long côté", "Triangle rectangle"] },
        { "titre": "Le théorème", "enfants": ["Rectangle en A", "BC² = AB² + AC²", "Carré de l'hypoténuse"] },
        { "titre": "Calculer une longueur", "enfants": ["3² + 4² = 25 → 5", "Racine carrée", "Côté : soustraire les carrés"] },
        { "titre": "Réciproque", "enfants": ["Prouver l'angle droit", "Si BC² = AB² + AC²", "5, 12, 13 : rectangle"] }
      ]
    }$json$),
    ('Proportionnalité et fonctions', $json${
      "centre": "Proportionnalité et fonctions",
      "branches": [
        { "titre": "Proportionnalité", "enfants": ["× un coefficient constant", "Prix, recettes", "Coefficient = bas ÷ haut"] },
        { "titre": "Fonction linéaire", "enfants": ["f(x) = a x", "a = coefficient", "f(3) = 6 si f(x) = 2x"] },
        { "titre": "Graphique", "enfants": ["Une droite", "Passe par l'origine (0 ; 0)", "a donne l'inclinaison"] },
        { "titre": "Applications", "enfants": ["Vitesse = distance ÷ temps", "75 km/h (150 km en 2 h)", "30 % de 80 = 24"] }
      ]
    }$json$),
    ('Statistiques et probabilités', $json${
      "centre": "Statistiques et probabilités",
      "branches": [
        { "titre": "Effectifs", "enfants": ["Nombre d'apparitions", "Effectif total", "8,8,10,12 : effectif de 8 = 2"] },
        { "titre": "Indicateurs", "enfants": ["Moyenne = somme ÷ nombre", "Médiane = valeur centrale", "Étendue = max − min"] },
        { "titre": "Exemples chiffrés", "enfants": ["Moyenne de 8,12,10,6 = 9", "Médiane de 3,5,7,9,11 = 7", "Étendue 11 − 3 = 8"] },
        { "titre": "Probabilités", "enfants": ["Cas favorables ÷ cas possibles", "Entre 0 et 1", "Dé : P(6) = 1/6"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu 4e ont déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10419999-0000-4000-8000-000000000001'::uuid, 'Puissances'),
  ('10419999-0000-4000-8000-000000000002'::uuid, 'Calcul littéral'),
  ('10419999-0000-4000-8000-000000000003'::uuid, 'Théorème de Pythagore'),
  ('10419999-0000-4000-8000-000000000004'::uuid, 'Proportionnalité et fonctions'),
  ('10419999-0000-4000-8000-000000000005'::uuid, 'Statistiques et probabilités')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
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
  -- Chapitre 1 — Puissances
  ('10410000-0000-4000-8000-000000000104'::uuid, 'Puissances',
   'Que vaut 3² ?', 'mcq',
   '["9", "6", "5", "8"]', 0,
   '3² = 3 × 3 = 9.', 4),
  ('10410000-0000-4000-8000-000000000105'::uuid, 'Puissances',
   'Combien font 2³ × 2² ?', 'mcq',
   '["32", "64", "16", "8"]', 0,
   'Même base : on additionne les exposants. 2³ × 2² = 2⁵ = 32.', 5),
  ('10410000-0000-4000-8000-000000000106'::uuid, 'Puissances',
   'Que vaut 10⁴ ?', 'mcq',
   '["10 000", "1 000", "100 000", "40"]', 0,
   '10⁴ = 1 suivi de 4 zéros = 10 000.', 6),
  ('10410000-0000-4000-8000-000000000107'::uuid, 'Puissances',
   'Combien font 10⁵ ÷ 10² ?', 'mcq',
   '["10³ = 1 000", "10⁷", "10²", "10¹⁰"]', 0,
   'Même base : on soustrait les exposants. 10⁵ ÷ 10² = 10³ = 1 000.', 7),
  ('10410000-0000-4000-8000-000000000108'::uuid, 'Puissances',
   'Pour tout nombre a non nul, a⁰ = 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par convention, tout nombre non nul élevé à la puissance 0 vaut 1.', 8),
  ('10410000-0000-4000-8000-000000000109'::uuid, 'Puissances',
   'Que vaut le cube de 5, c''est-à-dire 5³ ?', 'mcq',
   '["125", "15", "25", "10"]', 0,
   '5³ = 5 × 5 × 5 = 125.', 9),
  ('10410000-0000-4000-8000-000000000110'::uuid, 'Puissances',
   'L''écriture 4² signifie 4 × 2.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : 4² = 4 × 4 = 16, et non 4 × 2.', 10),

  -- Chapitre 2 — Calcul littéral
  ('10410000-0000-4000-8000-000000000204'::uuid, 'Calcul littéral',
   'Développe 3(x + 2).', 'mcq',
   '["3x + 6", "3x + 2", "x + 6", "5x"]', 0,
   'On distribue : 3 × x + 3 × 2 = 3x + 6.', 4),
  ('10410000-0000-4000-8000-000000000205'::uuid, 'Calcul littéral',
   'Réduis 3x + 5x.', 'mcq',
   '["8x", "15x", "8x²", "2x"]', 0,
   'On additionne les coefficients des termes en x : 3x + 5x = 8x.', 5),
  ('10410000-0000-4000-8000-000000000206'::uuid, 'Calcul littéral',
   'Développe (x + 2)(x + 3).', 'mcq',
   '["x² + 5x + 6", "x² + 6", "x² + 5x", "2x + 5"]', 0,
   'Double distributivité : x² + 3x + 2x + 6 = x² + 5x + 6.', 6),
  ('10410000-0000-4000-8000-000000000207'::uuid, 'Calcul littéral',
   'Factorise 6x + 9.', 'mcq',
   '["3(2x + 3)", "3(2x + 9)", "6(x + 3)", "3(6x + 3)"]', 0,
   'Le facteur commun est 3 : 6x + 9 = 3 × 2x + 3 × 3 = 3(2x + 3).', 7),
  ('10410000-0000-4000-8000-000000000208'::uuid, 'Calcul littéral',
   'L''expression 2x + 3x est égale à 5x.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On additionne les termes de même nature : 2x + 3x = 5x.', 8),
  ('10410000-0000-4000-8000-000000000209'::uuid, 'Calcul littéral',
   'Que vaut l''expression 4x + 1 pour x = 3 ?', 'mcq',
   '["13", "12", "7", "43"]', 0,
   'On remplace x par 3 : 4 × 3 + 1 = 12 + 1 = 13.', 9),
  ('10410000-0000-4000-8000-000000000210'::uuid, 'Calcul littéral',
   'Développer, c''est transformer un produit en somme.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Développer transforme un produit en somme ; factoriser fait l''inverse.', 10),

  -- Chapitre 3 — Théorème de Pythagore
  ('10410000-0000-4000-8000-000000000304'::uuid, 'Théorème de Pythagore',
   'Dans un triangle rectangle, quel côté est le plus long ?', 'mcq',
   '["L''hypoténuse", "Un côté de l''angle droit", "Ils sont égaux", "On ne peut pas savoir"]', 0,
   'L''hypoténuse, opposée à l''angle droit, est toujours le plus long côté.', 4),
  ('10410000-0000-4000-8000-000000000305'::uuid, 'Théorème de Pythagore',
   'Un triangle rectangle a des côtés de l''angle droit de 3 cm et 4 cm. Quelle est la longueur de l''hypoténuse ?', 'mcq',
   '["5 cm", "7 cm", "6 cm", "25 cm"]', 0,
   '3² + 4² = 9 + 16 = 25 = 5². L''hypoténuse mesure 5 cm.', 5),
  ('10410000-0000-4000-8000-000000000306'::uuid, 'Théorème de Pythagore',
   'Que vaut 5² + 12² ?', 'mcq',
   '["169", "119", "149", "60"]', 0,
   '5² + 12² = 25 + 144 = 169 (c''est 13²).', 6),
  ('10410000-0000-4000-8000-000000000307'::uuid, 'Théorème de Pythagore',
   'Un triangle a des côtés de 5, 12 et 13. Est-il rectangle ?', 'mcq',
   '["Oui, car 5² + 12² = 13²", "Non", "Seulement s''il est isocèle", "On ne peut pas savoir"]', 0,
   '25 + 144 = 169 = 13² : d''après la réciproque de Pythagore, le triangle est rectangle.', 7),
  ('10410000-0000-4000-8000-000000000308'::uuid, 'Théorème de Pythagore',
   'Le théorème de Pythagore s''applique à tous les triangles.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le théorème de Pythagore ne s''applique qu''aux triangles rectangles.', 8),
  ('10410000-0000-4000-8000-000000000309'::uuid, 'Théorème de Pythagore',
   'Quelle égalité traduit le théorème de Pythagore dans un triangle rectangle en A ?', 'mcq',
   '["BC² = AB² + AC²", "BC = AB + AC", "AB² = BC² + AC²", "BC² = AB × AC"]', 0,
   'L''hypoténuse est [BC] (opposée à l''angle droit en A) : BC² = AB² + AC².', 9),
  ('10410000-0000-4000-8000-000000000310'::uuid, 'Théorème de Pythagore',
   'La réciproque de Pythagore permet de prouver qu''un angle est droit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Si BC² = AB² + AC², alors le triangle est rectangle en A : c''est la réciproque.', 10),

  -- Chapitre 4 — Proportionnalité et fonctions
  ('10410000-0000-4000-8000-000000000404'::uuid, 'Proportionnalité et fonctions',
   'Une fonction linéaire s''écrit sous la forme :', 'mcq',
   '["f(x) = a × x", "f(x) = a × x + b", "f(x) = x + a", "f(x) = a"]', 0,
   'Une fonction linéaire est de la forme f(x) = a x, où a est le coefficient.', 4),
  ('10410000-0000-4000-8000-000000000405'::uuid, 'Proportionnalité et fonctions',
   'Pour la fonction f(x) = 2x, que vaut f(3) ?', 'mcq',
   '["6", "5", "23", "1,5"]', 0,
   'f(3) = 2 × 3 = 6.', 5),
  ('10410000-0000-4000-8000-000000000406'::uuid, 'Proportionnalité et fonctions',
   'Une voiture parcourt 150 km en 2 h. Quelle est sa vitesse moyenne ?', 'mcq',
   '["75 km/h", "300 km/h", "152 km/h", "50 km/h"]', 0,
   'Vitesse = distance ÷ temps = 150 ÷ 2 = 75 km/h.', 6),
  ('10410000-0000-4000-8000-000000000407'::uuid, 'Proportionnalité et fonctions',
   'Combien font 30 % de 80 ?', 'mcq',
   '["24", "30", "50", "2 400"]', 0,
   '30 % de 80 = (80 ÷ 100) × 30 = 24.', 7),
  ('10410000-0000-4000-8000-000000000408'::uuid, 'Proportionnalité et fonctions',
   'Dans une fonction linéaire, le coefficient est le nombre par lequel on multiplie x.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'f(x) = a x : a est le coefficient (aussi appelé coefficient de proportionnalité).', 8),
  ('10410000-0000-4000-8000-000000000409'::uuid, 'Proportionnalité et fonctions',
   'Le coefficient de la fonction linéaire qui à 4 associe 12 est :', 'mcq',
   '["3", "8", "48", "4"]', 0,
   'On cherche a tel que a × 4 = 12, donc a = 12 ÷ 4 = 3.', 9),
  ('10410000-0000-4000-8000-000000000410'::uuid, 'Proportionnalité et fonctions',
   'La représentation graphique d''une fonction linéaire est une droite passant par l''origine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une fonction linéaire f(x) = a x se représente par une droite qui passe par l''origine (0 ; 0).', 10),

  -- Chapitre 5 — Statistiques et probabilités
  ('10410000-0000-4000-8000-000000000504'::uuid, 'Statistiques et probabilités',
   'Quelle est la moyenne des notes 8, 12, 10 et 6 ?', 'mcq',
   '["9", "10", "8", "36"]', 0,
   'Somme = 8 + 12 + 10 + 6 = 36 ; moyenne = 36 ÷ 4 = 9.', 4),
  ('10410000-0000-4000-8000-000000000505'::uuid, 'Statistiques et probabilités',
   'Quelle est l''étendue de la série 3, 7, 5, 11, 4 ?', 'mcq',
   '["8", "11", "3", "14"]', 0,
   'Étendue = valeur maximale − valeur minimale = 11 − 3 = 8.', 5),
  ('10410000-0000-4000-8000-000000000506'::uuid, 'Statistiques et probabilités',
   'Quelle est la médiane de la série ordonnée 3, 5, 7, 9, 11 ?', 'mcq',
   '["7", "9", "5", "5,5"]', 0,
   'La médiane est la valeur centrale de la série ordonnée : 7 (deux valeurs de chaque côté).', 6),
  ('10410000-0000-4000-8000-000000000507'::uuid, 'Statistiques et probabilités',
   'On lance un dé équilibré à 6 faces. Quelle est la probabilité d''obtenir un 6 ?', 'mcq',
   '["1/6", "1/2", "6", "5/6"]', 0,
   'Un seul cas favorable sur 6 issues également probables : 1/6.', 7),
  ('10410000-0000-4000-8000-000000000508'::uuid, 'Statistiques et probabilités',
   'On lance un dé à 6 faces. Quelle est la probabilité d''obtenir un nombre pair ?', 'mcq',
   '["1/2", "1/6", "1/3", "2/3"]', 0,
   'Nombres pairs : 2, 4, 6, soit 3 cas favorables sur 6 : 3/6 = 1/2.', 8),
  ('10410000-0000-4000-8000-000000000509'::uuid, 'Statistiques et probabilités',
   'L''effectif d''une valeur est le nombre de fois où elle apparaît.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''effectif compte combien de fois une valeur apparaît dans la série.', 9),
  ('10410000-0000-4000-8000-000000000510'::uuid, 'Statistiques et probabilités',
   'Une probabilité peut être supérieure à 1.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une probabilité est toujours comprise entre 0 et 1.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
