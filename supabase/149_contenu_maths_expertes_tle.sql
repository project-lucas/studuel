-- =============================================================================
-- Studuel — Migration 149 : CONTENU Maths expertes Tle (+ exercices type bac)
-- Remplit les 3 chapitres de Maths expertes Terminale (option, programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés pas à pas par chapitre.
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
-- 1. COURS — lessons.content de « L'essentiel du cours » (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Nombres complexes', $md$# Nombres complexes

## Ce que tu vas comprendre
Les **nombres complexes** prolongent les réels pour donner un sens à √(−1). On les note avec le nombre **i** vérifiant **i² = −1**. Ce chapitre fait le tour des trois écritures (algébrique, trigonométrique, exponentielle) et de leurs usages au bac.

## 1. Forme algébrique
Tout complexe s'écrit **z = a + i b**, avec a et b réels.
- **a = Re(z)** est la partie réelle, **b = Im(z)** la partie imaginaire.
- Deux complexes sont égaux si et seulement si leurs parties réelles **et** imaginaires sont égales.

*Exemple : z = 3 + 4i a pour partie réelle 3 et pour partie imaginaire 4.*

## 2. Conjugué et module
- Le **conjugué** de z = a + i b est **z̄ = a − i b**.
- Le **module** est **|z| = √(a² + b²)** : c'est la distance de l'image de z à l'origine.
- Propriété clé : **z × z̄ = a² + b² = |z|²**.

*Exemple : |3 + 4i| = √(9 + 16) = √25 = 5.*

## 3. Argument et forme trigonométrique
Pour z ≠ 0, un **argument** θ = arg(z) est un angle tel que :

**z = |z| (cos θ + i sin θ)**

- L'argument est défini **modulo 2π**.
- arg(z̄) = −arg(z) ; arg(z₁z₂) = arg(z₁) + arg(z₂).

*Exemple : i = cos(π/2) + i sin(π/2), donc |i| = 1 et arg(i) = π/2.*

## 4. Forme exponentielle
On note **e^(iθ) = cos θ + i sin θ** (notation d'Euler). Ainsi **z = r e^(iθ)** avec r = |z|.
- Produit : r e^(iθ) × r' e^(iθ') = r r' e^(i(θ+θ')).
- Relation célèbre : **e^(iπ) = −1**.

## 5. Équations et racines
- L'équation z² = −1 a deux solutions : **i** et **−i**.
- Une équation du second degré à coefficients réels de discriminant Δ < 0 a deux solutions **complexes conjuguées**.

*Exemple : z² + 1 = 0 donne z = i ou z = −i.*

## L'essentiel à retenir
- **Forme algébrique** z = a + i b ; **i² = −1**.
- **Conjugué** z̄ = a − i b ; **module** |z| = √(a² + b²) ; z z̄ = |z|².
- **Forme trigo/exp** : z = |z|(cos θ + i sin θ) = r e^(iθ), argument modulo 2π.
- Un discriminant **négatif** donne deux racines complexes **conjuguées**.$md$),

    ('Arithmétique : congruences', $md$# Arithmétique : congruences

## Ce que tu vas comprendre
L'arithmétique des entiers structure toute la cryptographie moderne. Ce chapitre traite la **divisibilité**, le **PGCD**, les théorèmes de **Bézout** et de **Gauss**, les **congruences** et le **petit théorème de Fermat**.

## 1. Divisibilité et division euclidienne
- **b divise a** (noté b | a) s'il existe un entier k tel que a = b k.
- **Division euclidienne** : pour a et b > 0, il existe un unique couple (q, r) tel que **a = b q + r** avec 0 ≤ r < b.

*Exemple : 100 = 7 × 14 + 2, donc le reste de 100 par 7 est 2.*

## 2. PGCD et algorithme d'Euclide
Le **PGCD** de a et b est leur plus grand diviseur commun. L'**algorithme d'Euclide** l'obtient par divisions successives : PGCD(a, b) = PGCD(b, r).

*Exemple : PGCD(24, 36) = 12.*

Deux entiers sont **premiers entre eux** quand leur PGCD vaut 1.

## 3. Théorème de Bézout
**Bézout** : a et b sont premiers entre eux **si et seulement si** il existe des entiers u et v tels que **a u + b v = 1**.

Plus généralement, l'équation a u + b v = c a des solutions entières si et seulement si PGCD(a, b) divise c.

## 4. Théorème de Gauss
**Gauss** : si a divise le produit b c **et** si a est premier avec b, alors **a divise c**.

C'est l'outil pour résoudre des équations de divisibilité et des systèmes de congruences.

## 5. Congruences et petit théorème de Fermat
- **a ≡ b (mod n)** signifie que n divise a − b (a et b ont le même reste par n).
- Les congruences se **somment** et se **multiplient** : si a ≡ a' et b ≡ b' (mod n), alors a + b ≡ a' + b' et a b ≡ a' b'.
- **Petit théorème de Fermat** : si p est **premier** et ne divise pas a, alors **a^(p−1) ≡ 1 (mod p)**.

*Exemple : 3² = 9 ≡ 4 (mod 5) ; et 3⁴ = 81 ≡ 1 (mod 5) (Fermat avec p = 5).*

## L'essentiel à retenir
- **Division euclidienne** : a = b q + r, 0 ≤ r < b, couple (q, r) unique.
- **Bézout** : PGCD(a, b) = 1 ⇔ il existe u, v avec a u + b v = 1.
- **Gauss** : a | b c et PGCD(a, b) = 1 ⇒ a | c.
- **Congruences** compatibles avec + et × ; **Fermat** : a^(p−1) ≡ 1 (mod p) pour p premier.$md$),

    ('Matrices et graphes', $md$# Matrices et graphes

## Ce que tu vas comprendre
Les **matrices** rangent des nombres en tableaux et se calculent comme des « super-nombres ». Associées aux **graphes**, elles modélisent des réseaux et des évolutions aléatoires (chaînes de Markov). Ce chapitre relie les deux.

## 1. Opérations sur les matrices
- On **additionne** deux matrices de même taille terme à terme.
- On **multiplie** une matrice par un réel en multipliant chaque coefficient.
- Le **produit** A × B est défini quand le nombre de colonnes de A égale le nombre de lignes de B : le coefficient (i, j) est la somme des produits de la ligne i de A par la colonne j de B.

*Exemple : pour A = [[1, 2], [3, 4]] et I = [[1, 0], [0, 1]], on a A × I = A.*

## 2. Matrice identité et puissances
- La **matrice identité** I a des 1 sur la diagonale et des 0 ailleurs : A × I = I × A = A.
- La **puissance** Aⁿ est le produit de A par elle-même n fois.

*Exemple : [[1, 1], [0, 1]]² = [[1, 2], [0, 1]].*

## 3. Graphes et matrice d'adjacence
Un **graphe** est un ensemble de sommets reliés par des arêtes. Sa **matrice d'adjacence** M a pour coefficient **m(i, j) = nombre d'arêtes du sommet i vers le sommet j**.
- Pour un graphe **non orienté**, M est **symétrique**.

## 4. Puissances et chemins
Propriété fondamentale : le coefficient (i, j) de **Mⁿ** donne le **nombre de chemins de longueur n** allant du sommet i au sommet j.

*Exemple : le coefficient (i, j) de M² compte les chemins passant par exactement un sommet intermédiaire.*

## 5. Chaînes de Markov simples
Une **chaîne de Markov** décrit un système passant d'un état à l'autre avec des probabilités fixes, rangées dans une **matrice de transition** P.
- Chaque **ligne** de P a une somme égale à **1** (ce sont des probabilités).
- L'état après n étapes s'obtient en multipliant l'état initial par **Pⁿ**.
- Souvent, l'état se stabilise vers un **état stable** (probabilité invariante).

## L'essentiel à retenir
- Produit A × B défini si colonnes de A = lignes de B ; **A × I = A**.
- Le coefficient (i, j) de **Mⁿ** = nombre de **chemins de longueur n** de i à j.
- **Matrice d'adjacence** : m(i, j) = nombre d'arêtes ; symétrique si non orienté.
- **Chaîne de Markov** : matrice de transition, **somme de chaque ligne = 1**, évolution par Pⁿ.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths-expertes'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Nombres complexes', $json${
      "centre": "Nombres complexes",
      "branches": [
        { "titre": "Forme algébrique", "enfants": ["z = a + i b, i² = −1", "Re(z) = a, Im(z) = b", "Égalité : mêmes Re et Im"] },
        { "titre": "Conjugué et module", "enfants": ["z̄ = a − i b", "|z| = √(a² + b²)", "z z̄ = |z|² ; |3+4i| = 5"] },
        { "titre": "Trigo et exponentielle", "enfants": ["z = |z|(cos θ + i sin θ)", "z = r e^(iθ)", "arg défini modulo 2π"] },
        { "titre": "Équations et racines", "enfants": ["z² = −1 → i et −i", "Δ < 0 → racines conjuguées", "e^(iπ) = −1"] }
      ]
    }$json$),
    ('Arithmétique : congruences', $json${
      "centre": "Arithmétique : congruences",
      "branches": [
        { "titre": "Divisibilité", "enfants": ["b | a : a = b k", "Division euclidienne a = bq + r", "0 ≤ r < b, couple unique"] },
        { "titre": "PGCD et Bézout", "enfants": ["Algorithme d'Euclide", "Premiers entre eux : PGCD = 1", "Bézout : au + bv = 1"] },
        { "titre": "Gauss", "enfants": ["a | bc et PGCD(a,b)=1", "alors a | c", "Résout les divisibilités"] },
        { "titre": "Congruences et Fermat", "enfants": ["a ≡ b (mod n)", "Compatible avec + et ×", "Fermat : a^(p−1) ≡ 1 (mod p)"] }
      ]
    }$json$),
    ('Matrices et graphes', $json${
      "centre": "Matrices et graphes",
      "branches": [
        { "titre": "Opérations", "enfants": ["Addition terme à terme", "Produit : colonnes A = lignes B", "A × I = A"] },
        { "titre": "Identité et puissances", "enfants": ["I : 1 sur la diagonale", "Aⁿ = A × A × … (n fois)", "[[1,1],[0,1]]² = [[1,2],[0,1]]"] },
        { "titre": "Graphes", "enfants": ["Matrice d'adjacence m(i,j)", "Nombre d'arêtes de i à j", "Symétrique si non orienté"] },
        { "titre": "Puissances et Markov", "enfants": ["Mⁿ : chemins de longueur n", "Transition : ligne de somme 1", "Évolution par Pⁿ, état stable"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths-expertes'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths expertes', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14919999-0000-4000-8000-000000000001'::uuid, 'Nombres complexes'),
  ('14919999-0000-4000-8000-000000000002'::uuid, 'Arithmétique : congruences'),
  ('14919999-0000-4000-8000-000000000003'::uuid, 'Matrices et graphes')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths-expertes'
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
  -- Chapitre 1 — Nombres complexes
  ('14910000-0000-4000-8000-000000000104'::uuid, 'Nombres complexes',
   'Combien vaut i² ?', 'mcq',
   '["−1", "1", "i", "0"]', 0,
   'Par définition du nombre imaginaire i, on a i² = −1.', 4),
  ('14910000-0000-4000-8000-000000000105'::uuid, 'Nombres complexes',
   'Quel est le module du complexe z = 3 + 4i ?', 'mcq',
   '["5", "7", "25", "12"]', 0,
   '|z| = √(3² + 4²) = √(9 + 16) = √25 = 5.', 5),
  ('14910000-0000-4000-8000-000000000106'::uuid, 'Nombres complexes',
   'Quel est le conjugué de z = 3 − 2i ?', 'mcq',
   '["3 + 2i", "−3 + 2i", "−3 − 2i", "2 − 3i"]', 0,
   'Le conjugué de a + i b est a − i b : le conjugué de 3 − 2i est 3 + 2i.', 6),
  ('14910000-0000-4000-8000-000000000107'::uuid, 'Nombres complexes',
   'On a e^(iπ) = −1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La relation d''Euler donne e^(iθ) = cos θ + i sin θ, donc e^(iπ) = cos π + i sin π = −1.', 7),
  ('14910000-0000-4000-8000-000000000108'::uuid, 'Nombres complexes',
   'Combien vaut (1 + i)² ?', 'mcq',
   '["2i", "2", "1 + 2i", "0"]', 0,
   '(1 + i)² = 1 + 2i + i² = 1 + 2i − 1 = 2i.', 8),
  ('14910000-0000-4000-8000-000000000109'::uuid, 'Nombres complexes',
   'Un argument du nombre complexe i est : ', 'mcq',
   '["π/2", "0", "π", "π/4"]', 0,
   'i = cos(π/2) + i sin(π/2), donc arg(i) = π/2 (modulo 2π).', 9),
  ('14910000-0000-4000-8000-000000000110'::uuid, 'Nombres complexes',
   'Une équation du second degré à coefficients réels de discriminant négatif a deux solutions complexes conjuguées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Lorsque Δ < 0, les deux racines sont complexes et conjuguées l''une de l''autre.', 10),

  -- Chapitre 2 — Arithmétique : congruences
  ('14910000-0000-4000-8000-000000000204'::uuid, 'Arithmétique : congruences',
   'Quel est le reste de 17 dans la division par 5 ?', 'mcq',
   '["2", "3", "1", "0"]', 0,
   '17 = 5 × 3 + 2, donc le reste est 2, c''est-à-dire 17 ≡ 2 (mod 5).', 4),
  ('14910000-0000-4000-8000-000000000205'::uuid, 'Arithmétique : congruences',
   'Quel est le PGCD de 24 et 36 ?', 'mcq',
   '["12", "6", "24", "72"]', 0,
   'Par l''algorithme d''Euclide ou les diviseurs communs, PGCD(24 ; 36) = 12.', 5),
  ('14910000-0000-4000-8000-000000000206'::uuid, 'Arithmétique : congruences',
   'Deux entiers sont premiers entre eux lorsque leur PGCD vaut 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par définition, être premiers entre eux signifie que leur plus grand commun diviseur est 1.', 6),
  ('14910000-0000-4000-8000-000000000207'::uuid, 'Arithmétique : congruences',
   'Que donne le petit théorème de Fermat pour a non divisible par un premier p ?', 'mcq',
   '["a^(p−1) ≡ 1 (mod p)", "a^p ≡ 0 (mod p)", "a^(p−1) ≡ p (mod a)", "a^p ≡ a (mod a)"]', 0,
   'Le petit théorème de Fermat affirme que a^(p−1) ≡ 1 (mod p) quand p est premier et ne divise pas a.', 7),
  ('14910000-0000-4000-8000-000000000208'::uuid, 'Arithmétique : congruences',
   'Quel est le reste de 100 dans la division par 7 ?', 'mcq',
   '["2", "1", "3", "0"]', 0,
   '100 = 7 × 14 + 2, donc 100 ≡ 2 (mod 7).', 8),
  ('14910000-0000-4000-8000-000000000209'::uuid, 'Arithmétique : congruences',
   'D''après le théorème de Bézout, deux entiers a et b sont premiers entre eux si et seulement s''il existe des entiers u et v tels que a u + b v = 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est exactement l''énoncé du théorème de Bézout.', 9),
  ('14910000-0000-4000-8000-000000000210'::uuid, 'Arithmétique : congruences',
   'À quoi 3² est-il congru modulo 5 ?', 'mcq',
   '["4", "9", "1", "0"]', 0,
   '3² = 9 = 5 × 1 + 4, donc 9 ≡ 4 (mod 5).', 10),

  -- Chapitre 3 — Matrices et graphes
  ('14910000-0000-4000-8000-000000000304'::uuid, 'Matrices et graphes',
   'Le produit de deux matrices A × B est défini lorsque : ', 'mcq',
   '["le nombre de colonnes de A égale le nombre de lignes de B", "A et B ont la même taille", "A et B sont carrées", "toujours"]', 0,
   'Le produit A × B existe si et seulement si le nombre de colonnes de A est égal au nombre de lignes de B.', 4),
  ('14910000-0000-4000-8000-000000000305'::uuid, 'Matrices et graphes',
   'Pour la matrice identité I, on a A × I = A.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La matrice identité est le neutre du produit matriciel : A × I = I × A = A.', 5),
  ('14910000-0000-4000-8000-000000000306'::uuid, 'Matrices et graphes',
   'Dans la matrice d''adjacence d''un graphe, que représente le coefficient m(i, j) ?', 'mcq',
   '["Le nombre d''arêtes du sommet i vers le sommet j", "La distance de i à j", "Le degré du sommet i", "Le poids total du graphe"]', 0,
   'Le coefficient m(i, j) de la matrice d''adjacence compte les arêtes reliant le sommet i au sommet j.', 6),
  ('14910000-0000-4000-8000-000000000307'::uuid, 'Matrices et graphes',
   'Le coefficient (i, j) de Mⁿ donne le nombre de chemins de longueur n du sommet i au sommet j.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la propriété fondamentale des puissances de la matrice d''adjacence.', 7),
  ('14910000-0000-4000-8000-000000000308'::uuid, 'Matrices et graphes',
   'Combien vaut [[1, 1], [0, 1]]² ?', 'mcq',
   '["[[1, 2], [0, 1]]", "[[1, 1], [0, 1]]", "[[2, 2], [0, 2]]", "[[1, 0], [0, 1]]"]', 0,
   'En multipliant la matrice par elle-même, le coefficient (1, 2) devient 1 × 1 + 1 × 1 = 2 : on obtient [[1, 2], [0, 1]].', 8),
  ('14910000-0000-4000-8000-000000000309'::uuid, 'Matrices et graphes',
   'Dans une chaîne de Markov, quelle est la somme des coefficients de chaque ligne de la matrice de transition ?', 'mcq',
   '["1", "0", "le nombre d''états", "cela dépend"]', 0,
   'Chaque ligne regroupe les probabilités de passage depuis un état : leur somme vaut 1.', 9),
  ('14910000-0000-4000-8000-000000000310'::uuid, 'Matrices et graphes',
   'La matrice d''adjacence d''un graphe non orienté est symétrique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Pour un graphe non orienté, une arête entre i et j en est aussi une entre j et i : m(i, j) = m(j, i).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths-expertes'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac corrigés pas à pas par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Nombres complexes', $md$# Exercices types — Nombres complexes

## Exercice 1 — Module, conjugué et forme trigonométrique
On considère le nombre complexe z = 1 + i.

a) Calcule le module |z| et le conjugué z̄.
b) Détermine un argument de z, puis écris z sous forme exponentielle.

### Correction
a) Module : |z| = √(1² + 1²) = √2.
Conjugué : z̄ = 1 − i.

b) On cherche θ tel que z = |z|(cos θ + i sin θ) = √2 (cos θ + i sin θ).
On identifie : cos θ = 1/√2 et sin θ = 1/√2, ce qui donne θ = π/4.
Forme exponentielle : z = √2 · e^(iπ/4).

## Exercice 2 — Équation du second degré dans ℂ
Résous dans l'ensemble des nombres complexes l'équation z² − 2z + 5 = 0.

### Correction
On calcule le discriminant : Δ = (−2)² − 4 × 1 × 5 = 4 − 20 = −16.
Comme Δ < 0, il y a deux solutions complexes conjuguées.
On écrit √Δ = √16 · i = 4i (racine imaginaire).
Les solutions sont :
z₁ = (2 − 4i) / 2 = 1 − 2i,
z₂ = (2 + 4i) / 2 = 1 + 2i.
On vérifie qu'elles sont bien **conjuguées** : z₂ = z̄₁.$md$),

    ('Arithmétique : congruences', $md$# Exercices types — Arithmétique : congruences

## Exercice 1 — PGCD et Bézout
On considère les entiers a = 240 et b = 46.

a) Détermine le PGCD de 240 et 46 par l'algorithme d'Euclide.
b) Ces deux nombres sont-ils premiers entre eux ?

### Correction
a) Algorithme d'Euclide (divisions successives) :
240 = 46 × 5 + 10,
46 = 10 × 4 + 6,
10 = 6 × 1 + 4,
6 = 4 × 1 + 2,
4 = 2 × 2 + 0.
Le dernier reste non nul est 2, donc **PGCD(240 ; 46) = 2**.

b) Comme leur PGCD vaut 2 (et non 1), les nombres **ne sont pas premiers entre eux**.
Il n'existe donc pas d'entiers u et v tels que 240 u + 46 v = 1 (Bézout).

## Exercice 2 — Congruences et petit théorème de Fermat
On travaille modulo 7.

a) Détermine le reste de 2¹⁰ dans la division par 7.
b) Vérifie la cohérence avec le petit théorème de Fermat.

### Correction
a) On réduit les puissances de 2 modulo 7 :
2¹ ≡ 2, 2² ≡ 4, 2³ = 8 ≡ 1 (mod 7).
Donc 2³ ≡ 1, et 2¹⁰ = 2^(3×3+1) = (2³)³ × 2¹ ≡ 1³ × 2 = 2 (mod 7).
Le reste de 2¹⁰ par 7 est **2**.

b) Le petit théorème de Fermat (p = 7 premier, a = 2 non divisible par 7) donne 2⁶ ≡ 1 (mod 7).
On retrouve bien 2¹⁰ = 2⁶ × 2⁴ ≡ 1 × 2⁴ = 16 ≡ 2 (mod 7). C'est cohérent.$md$),

    ('Matrices et graphes', $md$# Exercices types — Matrices et graphes

## Exercice 1 — Produit et puissance de matrices
On considère la matrice A = [[1, 1], [0, 1]].

a) Calcule A² = A × A.
b) Conjecture l'expression de Aⁿ pour un entier n ≥ 1.

### Correction
a) On applique la règle du produit ligne × colonne :
- coefficient (1, 1) : 1 × 1 + 1 × 0 = 1,
- coefficient (1, 2) : 1 × 1 + 1 × 1 = 2,
- coefficient (2, 1) : 0 × 1 + 1 × 0 = 0,
- coefficient (2, 2) : 0 × 1 + 1 × 1 = 1.
Donc A² = [[1, 2], [0, 1]].

b) En calculant A³ = A² × A = [[1, 3], [0, 1]], on conjecture :
Aⁿ = [[1, n], [0, 1]] pour tout entier n ≥ 1.

## Exercice 2 — Graphe et chemins
Un graphe orienté a trois sommets 1, 2, 3 et pour matrice d'adjacence :
M = [[0, 1, 0], [0, 0, 1], [1, 0, 0]] (1 → 2, 2 → 3, 3 → 1).

a) Que représente le coefficient (1, 3) de M² ?
b) Calcule ce coefficient et interprète.

### Correction
a) Le coefficient (1, 3) de M² représente le **nombre de chemins de longueur 2** allant du sommet 1 au sommet 3.

b) Coefficient (1, 3) de M² = (ligne 1 de M) × (colonne 3 de M) :
= 0 × 0 + 1 × 1 + 0 × 0 = 1.
Il existe donc **un seul chemin de longueur 2** de 1 à 3 : le trajet 1 → 2 → 3.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths-expertes'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
