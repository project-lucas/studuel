-- =============================================================================
-- Studuel — Migration 129 : CONTENU Maths 1re (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Maths 1re (spécialité, programme Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (→ 10 questions). Les questions
--                    sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons de Maths 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Suites numériques', $md$# Suites numériques

## Ce que tu vas comprendre
Une **suite** (uₙ) est une liste ordonnée de nombres, où chaque terme porte un indice n. Ce chapitre étudie deux modèles très courants : les suites **arithmétiques** (on ajoute) et les suites **géométriques** (on multiplie).

## 1. Suites arithmétiques
Une suite est **arithmétique** si on passe d'un terme au suivant en **ajoutant toujours le même nombre** r, appelé la **raison** : uₙ₊₁ = uₙ + r.

- **Terme général :** uₙ = u₀ + n × r (ou uₙ = uₚ + (n − p) × r).
- *Exemple : u₀ = 3 et r = 2 → u₅ = 3 + 5 × 2 = **13**.*

## 2. Suites géométriques
Une suite est **géométrique** si on passe d'un terme au suivant en **multipliant toujours par le même nombre** q, la **raison** : uₙ₊₁ = q × uₙ.

- **Terme général :** uₙ = u₀ × qⁿ.
- *Exemple : u₀ = 2 et q = 3 → u₃ = 2 × 3³ = 2 × 27 = **54**.*

## 3. Sens de variation
- Suite **arithmétique** : croissante si r > 0, décroissante si r < 0.
- Suite **géométrique** (à termes positifs) : croissante si q > 1, décroissante si 0 < q < 1.

## 4. Sommes de termes
- Somme des entiers de 1 à n : **1 + 2 + … + n = n(n + 1) / 2**.
- *Exemple : 1 + 2 + … + 100 = 100 × 101 / 2 = **5 050**.*
- Suite arithmétique : somme = (nombre de termes) × (premier + dernier) / 2.

## 5. Reconnaître le modèle
- Écart **constant** entre termes consécutifs → **arithmétique**.
- Quotient **constant** entre termes consécutifs → **géométrique**.

## L'essentiel à retenir
- Arithmétique : on **ajoute** r, uₙ = u₀ + n r.
- Géométrique : on **multiplie** par q, uₙ = u₀ qⁿ.
- Variation : signe de r (arithmétique) ; position de q par rapport à 1 (géométrique).
- Somme 1 + … + n = n(n + 1)/2.$md$),

    ('Second degré', $md$# Second degré

## Ce que tu vas comprendre
Un **trinôme du second degré** s'écrit f(x) = ax² + bx + c (avec a ≠ 0). Ce chapitre apprend à trouver ses **racines**, à le **factoriser** et à étudier son **signe**.

## 1. Forme canonique
Tout trinôme s'écrit sous **forme canonique** : f(x) = a(x − α)² + β, avec **α = −b / (2a)** et β = f(α). Le sommet de la parabole a pour abscisse α.

## 2. Discriminant
Le **discriminant** est le nombre **Δ = b² − 4ac**. Il décide du nombre de racines :
- **Δ > 0** : deux racines distinctes ;
- **Δ = 0** : une racine double ;
- **Δ < 0** : aucune racine réelle.

## 3. Racines
Quand Δ ≥ 0, les racines sont **x = (−b ± √Δ) / (2a)**.

*Exemple : x² − 5x + 6. Δ = (−5)² − 4×1×6 = 25 − 24 = **1** > 0. Racines : (5 ± 1)/2 = **2 et 3**.*

## 4. Factorisation
Si Δ > 0, alors f(x) = **a(x − x₁)(x − x₂)**, où x₁ et x₂ sont les racines.

*Exemple : x² − 5x + 6 = (x − 2)(x − 3).*

## 5. Signe du trinôme
Le trinôme est **du signe de a à l'extérieur des racines**, et du signe contraire **entre** les racines.

*Exemple : pour x² − 5x + 6 (a > 0), f est positif avant 2 et après 3, négatif entre 2 et 3.*

## L'essentiel à retenir
- **Δ = b² − 4ac** décide : > 0 deux racines, = 0 une racine, < 0 aucune.
- Racines : x = (−b ± √Δ) / (2a).
- Factorisation : a(x − x₁)(x − x₂).
- Signe : celui de **a** à l'extérieur des racines.$md$),

    ('Dérivation', $md$# Dérivation

## Ce que tu vas comprendre
**Dériver** une fonction, c'est mesurer sa **vitesse de variation** en chaque point. La dérivée sert à trouver la **tangente** à une courbe et le **sens de variation** d'une fonction.

## 1. Nombre dérivé
Le **nombre dérivé** de f en a, noté **f ′(a)**, est le **coefficient directeur de la tangente** à la courbe au point d'abscisse a.

## 2. Équation de la tangente
La tangente à la courbe de f au point d'abscisse a a pour équation :
**y = f ′(a)(x − a) + f(a)**.

*Exemple : f(x) = x², f ′(x) = 2x, donc f ′(3) = 6. Tangente en 3 : y = 6(x − 3) + 9 = 6x − 9.*

## 3. Dérivées usuelles
| Fonction | Dérivée |
|---|---|
| k (constante) | 0 |
| x | 1 |
| x² | 2x |
| xⁿ | n xⁿ⁻¹ |
| 1/x | −1/x² |
| √x | 1/(2√x) |

## 4. Opérations
- (k u)′ = k × u′  (multiplier par une constante).
- (u + v)′ = u′ + v′  (dériver terme à terme).

*Exemple : (x³ + 5x)′ = 3x² + 5.*

## 5. Dérivée et variations
Sur un intervalle :
- si **f ′(x) > 0**, alors f est **croissante** ;
- si **f ′(x) < 0**, alors f est **décroissante** ;
- là où f ′ s'annule en changeant de signe, f admet un **extremum**.

## L'essentiel à retenir
- f ′(a) = coefficient directeur de la **tangente** en a.
- Tangente : y = f ′(a)(x − a) + f(a).
- Usuelles : (x²)′ = 2x, (xⁿ)′ = n xⁿ⁻¹, (constante)′ = 0.
- Signe de f ′ → sens de variation de f.$md$),

    ('Produit scalaire', $md$# Produit scalaire

## Ce que tu vas comprendre
Le **produit scalaire** de deux vecteurs est un **nombre** (pas un vecteur). Il mesure à quel point deux vecteurs « vont dans le même sens » et sert surtout à détecter l'**orthogonalité**.

## 1. Définition avec l'angle
Pour deux vecteurs non nuls u et v formant un angle θ :
**u · v = ||u|| × ||v|| × cos(θ)**,
où ||u|| est la **norme** (la longueur) du vecteur u.

## 2. Expression avec les coordonnées
Dans un repère orthonormé, si u(xᵤ ; yᵤ) et v(xᵥ ; yᵥ) :
**u · v = xᵤ × xᵥ + yᵤ × yᵥ**.

*Exemple : u(1 ; 2) et v(3 ; 4) → u · v = 1×3 + 2×4 = 3 + 8 = **11**.*

## 3. Norme et produit scalaire
Le produit scalaire d'un vecteur par lui-même donne le **carré de sa norme** :
**u · u = ||u||²**.

*Exemple : u(3 ; 4) → ||u|| = √(3² + 4²) = √25 = **5**.*

## 4. Orthogonalité
Deux vecteurs non nuls sont **orthogonaux** (perpendiculaires) **si et seulement si leur produit scalaire est nul** : u · v = 0.

*Exemple : u(2 ; 3) et v(−3 ; 2) → u · v = 2×(−3) + 3×2 = −6 + 6 = **0** : ils sont orthogonaux.*

## 5. Applications
Le produit scalaire permet de calculer un **angle**, de démontrer qu'un triangle est **rectangle**, ou de trouver une **équation de droite**.

## L'essentiel à retenir
- u · v = ||u|| ||v|| cos(θ) = xᵤxᵥ + yᵤyᵥ (repère orthonormé).
- u · u = ||u||² (carré de la norme).
- u · v = 0 ⟺ vecteurs **orthogonaux**.
- Sert à mesurer des angles et prouver des orthogonalités.$md$),

    ('Probabilités conditionnelles', $md$# Probabilités conditionnelles

## Ce que tu vas comprendre
Une **probabilité conditionnelle** mesure la probabilité d'un événement **sachant qu'un autre est déjà réalisé**. C'est l'outil des **arbres pondérés** et de la formule des probabilités totales.

## 1. Définition
La probabilité de B **sachant A**, notée **P_A(B)**, se calcule par :
**P_A(B) = P(A ∩ B) / P(A)** (avec P(A) ≠ 0).

On en déduit : **P(A ∩ B) = P(A) × P_A(B)**.

*Exemple : P(A) = 0,6 et P_A(B) = 0,5 → P(A ∩ B) = 0,6 × 0,5 = **0,3**.*

## 2. Arbre pondéré
Un **arbre pondéré** représente les probabilités :
- la somme des probabilités des branches issues d'un **même nœud** vaut **1** ;
- la probabilité d'un **chemin** est le **produit** des probabilités le long des branches.

## 3. Formule des probabilités totales
Pour retrouver P(B), on additionne tous les chemins qui mènent à B :
**P(B) = P(A ∩ B) + P(Ā ∩ B) = P(A) P_A(B) + P(Ā) P_Ā(B)**,
où Ā est l'événement contraire de A.

## 4. Indépendance
Deux événements A et B sont **indépendants** si la réalisation de l'un ne change pas la probabilité de l'autre :
**P(A ∩ B) = P(A) × P(B)**  (ce qui revient à P_A(B) = P(B)).

*Exemple : A et B indépendants, P(A) = 0,4 et P(B) = 0,5 → P(A ∩ B) = 0,4 × 0,5 = **0,2**.*

## 5. Ne pas confondre
- **Incompatibles** : P(A ∩ B) = 0 (jamais ensemble).
- **Indépendants** : P(A ∩ B) = P(A) × P(B) (sans influence).

## L'essentiel à retenir
- P_A(B) = P(A ∩ B) / P(A), donc P(A ∩ B) = P(A) × P_A(B).
- Arbre : somme des branches d'un nœud = 1 ; chemin = produit.
- Probabilités totales : P(B) = P(A) P_A(B) + P(Ā) P_Ā(B).
- Indépendance : P(A ∩ B) = P(A) × P(B).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Suites numériques', $json${
      "centre": "Suites numériques",
      "branches": [
        { "titre": "Arithmétiques", "enfants": ["On ajoute la raison r", "uₙ = u₀ + n×r", "Ex : u₀=3, r=2 → u₅=13"] },
        { "titre": "Géométriques", "enfants": ["On multiplie par q", "uₙ = u₀ × qⁿ", "Ex : u₀=2, q=3 → u₃=54"] },
        { "titre": "Sens de variation", "enfants": ["Arith. : signe de r", "Géo. (>0) : q par rapport à 1", "r>0 → croissante"] },
        { "titre": "Sommes", "enfants": ["1+…+n = n(n+1)/2", "1+…+100 = 5050", "(nb termes)×(1er+dernier)/2"] }
      ]
    }$json$),
    ('Second degré', $json${
      "centre": "Second degré",
      "branches": [
        { "titre": "Forme canonique", "enfants": ["a(x−α)² + β", "α = −b/(2a)", "Sommet de la parabole"] },
        { "titre": "Discriminant Δ", "enfants": ["Δ = b² − 4ac", "Δ>0 : 2 racines", "Δ=0 : 1 ; Δ<0 : 0"] },
        { "titre": "Racines", "enfants": ["x = (−b ± √Δ)/(2a)", "x²−5x+6 → 2 et 3", "Δ=1 dans cet exemple"] },
        { "titre": "Factorisation & signe", "enfants": ["a(x−x₁)(x−x₂)", "Signe de a à l'extérieur", "Signe opposé entre racines"] }
      ]
    }$json$),
    ('Dérivation', $json${
      "centre": "Dérivation",
      "branches": [
        { "titre": "Nombre dérivé", "enfants": ["f ′(a) = pente", "Coefficient directeur", "de la tangente en a"] },
        { "titre": "Tangente", "enfants": ["y = f ′(a)(x−a) + f(a)", "f(x)=x² → f ′(3)=6", "y = 6x − 9"] },
        { "titre": "Dérivées usuelles", "enfants": ["(x²)′ = 2x", "(xⁿ)′ = n xⁿ⁻¹", "(constante)′ = 0"] },
        { "titre": "Variations", "enfants": ["f ′>0 → croissante", "f ′<0 → décroissante", "f ′=0 → extremum"] }
      ]
    }$json$),
    ('Produit scalaire', $json${
      "centre": "Produit scalaire",
      "branches": [
        { "titre": "Avec l'angle", "enfants": ["u·v = ||u|| ||v|| cos θ", "Résultat = un nombre", "θ = angle des vecteurs"] },
        { "titre": "Coordonnées", "enfants": ["u·v = xᵤxᵥ + yᵤyᵥ", "u(1;2)·v(3;4) = 11", "Repère orthonormé"] },
        { "titre": "Norme", "enfants": ["u·u = ||u||²", "u(3;4) → ||u|| = 5", "||u|| = √(x²+y²)"] },
        { "titre": "Orthogonalité", "enfants": ["u·v = 0 ⟺ perpendiculaires", "u(2;3)·v(−3;2) = 0", "Triangle rectangle"] }
      ]
    }$json$),
    ('Probabilités conditionnelles', $json${
      "centre": "Probabilités conditionnelles",
      "branches": [
        { "titre": "Définition", "enfants": ["P_A(B) = P(A∩B)/P(A)", "P(A∩B) = P(A)×P_A(B)", "Ex : 0,6×0,5 = 0,3"] },
        { "titre": "Arbre pondéré", "enfants": ["Branches d'un nœud = 1", "Chemin = produit", "Visualise les cas"] },
        { "titre": "Probabilités totales", "enfants": ["P(B) via A et Ā", "P(A)P_A(B)+P(Ā)P_Ā(B)", "On somme les chemins"] },
        { "titre": "Indépendance", "enfants": ["P(A∩B) = P(A)×P(B)", "P_A(B) = P(B)", "≠ incompatibles"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc ne
--     fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '1re', v.chapter, true, l.id
FROM (VALUES
  ('12919999-0000-4000-8000-000000000001'::uuid, 'Suites numériques'),
  ('12919999-0000-4000-8000-000000000002'::uuid, 'Second degré'),
  ('12919999-0000-4000-8000-000000000003'::uuid, 'Dérivation'),
  ('12919999-0000-4000-8000-000000000004'::uuid, 'Produit scalaire'),
  ('12919999-0000-4000-8000-000000000005'::uuid, 'Probabilités conditionnelles')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
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
  -- Chapitre 1 — Suites numériques
  ('12910000-0000-4000-8000-000000000104'::uuid, 'Suites numériques',
   'Suite arithmétique de premier terme u₀ = 3 et de raison 2 : combien vaut u₅ ?', 'mcq',
   '["13", "10", "16", "8"]', 0,
   'uₙ = u₀ + n × r, donc u₅ = 3 + 5 × 2 = 13.', 4),
  ('12910000-0000-4000-8000-000000000105'::uuid, 'Suites numériques',
   'Suite géométrique de premier terme u₀ = 2 et de raison 3 : combien vaut u₃ ?', 'mcq',
   '["54", "18", "24", "162"]', 0,
   'uₙ = u₀ × qⁿ, donc u₃ = 2 × 3³ = 2 × 27 = 54.', 5),
  ('12910000-0000-4000-8000-000000000106'::uuid, 'Suites numériques',
   'Quel est le terme général d''une suite arithmétique ?', 'mcq',
   '["uₙ = u₀ + n × r", "uₙ = u₀ × rⁿ", "uₙ = u₀ + r", "uₙ = n × r"]', 0,
   'On ajoute n fois la raison au premier terme : uₙ = u₀ + n × r.', 6),
  ('12910000-0000-4000-8000-000000000107'::uuid, 'Suites numériques',
   'Une suite arithmétique de raison négative est décroissante.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Si r < 0, chaque terme est plus petit que le précédent : la suite décroît.', 7),
  ('12910000-0000-4000-8000-000000000108'::uuid, 'Suites numériques',
   'Combien vaut la somme 1 + 2 + 3 + … + 100 ?', 'mcq',
   '["5 050", "5 000", "10 100", "500"]', 0,
   '1 + … + n = n(n + 1)/2 = 100 × 101 / 2 = 5 050.', 8),
  ('12910000-0000-4000-8000-000000000109'::uuid, 'Suites numériques',
   'Quel est le terme général d''une suite géométrique ?', 'mcq',
   '["uₙ = u₀ × qⁿ", "uₙ = u₀ + n × q", "uₙ = u₀ × n", "uₙ = qⁿ + u₀"]', 0,
   'On multiplie le premier terme par q à la puissance n : uₙ = u₀ × qⁿ.', 9),
  ('12910000-0000-4000-8000-000000000110'::uuid, 'Suites numériques',
   'Une suite géométrique de premier terme positif et de raison q > 1 est croissante.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Avec u₀ > 0 et q > 1, chaque terme est plus grand : la suite croît.', 10),

  -- Chapitre 2 — Second degré
  ('12910000-0000-4000-8000-000000000204'::uuid, 'Second degré',
   'Quel est le discriminant du trinôme x² − 5x + 6 ?', 'mcq',
   '["1", "49", "−1", "25"]', 0,
   'Δ = b² − 4ac = (−5)² − 4×1×6 = 25 − 24 = 1.', 4),
  ('12910000-0000-4000-8000-000000000205'::uuid, 'Second degré',
   'Quelles sont les racines de x² − 5x + 6 ?', 'mcq',
   '["2 et 3", "−2 et −3", "1 et 6", "5 et 6"]', 0,
   'x = (−b ± √Δ)/(2a) = (5 ± 1)/2, soit 2 et 3.', 5),
  ('12910000-0000-4000-8000-000000000206'::uuid, 'Second degré',
   'Si le discriminant Δ est strictement négatif, combien l''équation a-t-elle de racines réelles ?', 'mcq',
   '["0", "1", "2", "une infinité"]', 0,
   'Δ < 0 : le trinôme n''a aucune racine réelle.', 6),
  ('12910000-0000-4000-8000-000000000207'::uuid, 'Second degré',
   'Quel est le discriminant de x² − 4x + 4 ?', 'mcq',
   '["0", "8", "16", "−16"]', 0,
   'Δ = (−4)² − 4×1×4 = 16 − 16 = 0 (racine double).', 7),
  ('12910000-0000-4000-8000-000000000208'::uuid, 'Second degré',
   'Si le discriminant vaut 0, le trinôme possède une unique racine (dite double).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Δ = 0 donne une seule racine : x = −b/(2a).', 8),
  ('12910000-0000-4000-8000-000000000209'::uuid, 'Second degré',
   'Quelle est la formule du discriminant ?', 'mcq',
   '["b² − 4ac", "2a", "−b / (2a)", "b² + 4ac"]', 0,
   'Le discriminant est Δ = b² − 4ac.', 9),
  ('12910000-0000-4000-8000-000000000210'::uuid, 'Second degré',
   'Pour a > 0, le trinôme est positif à l''extérieur de ses racines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le trinôme est du signe de a à l''extérieur des racines, donc positif ici.', 10),

  -- Chapitre 3 — Dérivation
  ('12910000-0000-4000-8000-000000000304'::uuid, 'Dérivation',
   'Quelle est la dérivée de la fonction x² ?', 'mcq',
   '["2x", "x", "2", "x²/2"]', 0,
   'La dérivée de xⁿ est n xⁿ⁻¹ ; pour x² cela donne 2x.', 4),
  ('12910000-0000-4000-8000-000000000305'::uuid, 'Dérivation',
   'Quelle est la dérivée de la fonction x³ ?', 'mcq',
   '["3x²", "2x³", "x²", "3x"]', 0,
   'La dérivée de xⁿ est n xⁿ⁻¹ ; pour x³ cela donne 3x².', 5),
  ('12910000-0000-4000-8000-000000000306'::uuid, 'Dérivation',
   'Pour f(x) = x², combien vaut le nombre dérivé en 3 ?', 'mcq',
   '["6", "9", "3", "2"]', 0,
   'La dérivée est 2x ; en x = 3 : 2 × 3 = 6.', 6),
  ('12910000-0000-4000-8000-000000000307'::uuid, 'Dérivation',
   'Quelle est l''équation de la tangente à la courbe de f au point d''abscisse a ?', 'mcq',
   '["y = f ′(a)(x − a) + f(a)", "y = f(a) x + a", "y = f ′(a) x", "y = a x + f ′(a)"]', 0,
   'La tangente en a a pour équation y = f ′(a)(x − a) + f(a).', 7),
  ('12910000-0000-4000-8000-000000000308'::uuid, 'Dérivation',
   'Si f ′(x) > 0 sur un intervalle, alors f est croissante sur cet intervalle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un nombre dérivé positif signifie une fonction croissante.', 8),
  ('12910000-0000-4000-8000-000000000309'::uuid, 'Dérivation',
   'Quelle est la dérivée d''une fonction constante ?', 'mcq',
   '["0", "1", "x", "la constante"]', 0,
   'La dérivée d''une constante est nulle : 0.', 9),
  ('12910000-0000-4000-8000-000000000310'::uuid, 'Dérivation',
   'Quelle est la dérivée de la fonction 5x ?', 'mcq',
   '["5", "5x", "0", "x"]', 0,
   'La dérivée de k x est k ; ici la dérivée de 5x est 5.', 10),

  -- Chapitre 4 — Produit scalaire
  ('12910000-0000-4000-8000-000000000404'::uuid, 'Produit scalaire',
   'Pour u(1 ; 2) et v(3 ; 4), combien vaut le produit scalaire u · v ?', 'mcq',
   '["11", "10", "7", "14"]', 0,
   'u · v = xᵤxᵥ + yᵤyᵥ = 1×3 + 2×4 = 3 + 8 = 11.', 4),
  ('12910000-0000-4000-8000-000000000405'::uuid, 'Produit scalaire',
   'Quelle est la norme du vecteur u(3 ; 4) ?', 'mcq',
   '["5", "7", "25", "√7"]', 0,
   '||u|| = √(3² + 4²) = √25 = 5.', 5),
  ('12910000-0000-4000-8000-000000000406'::uuid, 'Produit scalaire',
   'Deux vecteurs non nuls sont orthogonaux si et seulement si leur produit scalaire est nul.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'u · v = 0 caractérise l''orthogonalité de deux vecteurs non nuls.', 6),
  ('12910000-0000-4000-8000-000000000407'::uuid, 'Produit scalaire',
   'Pour u(2 ; 3) et v(−3 ; 2), combien vaut u · v ?', 'mcq',
   '["0", "12", "−12", "6"]', 0,
   'u · v = 2×(−3) + 3×2 = −6 + 6 = 0 : les vecteurs sont orthogonaux.', 7),
  ('12910000-0000-4000-8000-000000000408'::uuid, 'Produit scalaire',
   'Quelle est l''expression du produit scalaire avec les coordonnées ?', 'mcq',
   '["xᵤ × xᵥ + yᵤ × yᵥ", "xᵤ × yᵥ + yᵤ × xᵥ", "xᵤ × xᵥ − yᵤ × yᵥ", "xᵤ + xᵥ + yᵤ + yᵥ"]', 0,
   'Dans un repère orthonormé, u · v = xᵤxᵥ + yᵤyᵥ.', 8),
  ('12910000-0000-4000-8000-000000000409'::uuid, 'Produit scalaire',
   'Quelle formule utilise l''angle θ entre les deux vecteurs ?', 'mcq',
   '["u · v = ||u|| × ||v|| × cos θ", "u · v = ||u|| × ||v|| × sin θ", "u · v = ||u|| + ||v||", "u · v = ||u|| ÷ ||v||"]', 0,
   'Par définition, u · v = ||u|| × ||v|| × cos(θ).', 9),
  ('12910000-0000-4000-8000-000000000410'::uuid, 'Produit scalaire',
   'Le produit scalaire d''un vecteur par lui-même est égal au carré de sa norme.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'u · u = ||u||².', 10),

  -- Chapitre 5 — Probabilités conditionnelles
  ('12910000-0000-4000-8000-000000000504'::uuid, 'Probabilités conditionnelles',
   'Quelle est la formule de la probabilité de B sachant A ?', 'mcq',
   '["P(A ∩ B) / P(A)", "P(A ∩ B) × P(A)", "P(A) / P(B)", "P(A) + P(B)"]', 0,
   'Par définition, P_A(B) = P(A ∩ B) / P(A).', 4),
  ('12910000-0000-4000-8000-000000000505'::uuid, 'Probabilités conditionnelles',
   'Si P(A) = 0,6 et P_A(B) = 0,5, combien vaut P(A ∩ B) ?', 'mcq',
   '["0,3", "1,1", "0,5", "0,6"]', 0,
   'P(A ∩ B) = P(A) × P_A(B) = 0,6 × 0,5 = 0,3.', 5),
  ('12910000-0000-4000-8000-000000000506'::uuid, 'Probabilités conditionnelles',
   'Deux événements A et B sont indépendants lorsque P(A ∩ B) = P(A) × P(B).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est exactement la définition de l''indépendance de deux événements.', 6),
  ('12910000-0000-4000-8000-000000000507'::uuid, 'Probabilités conditionnelles',
   'Sur un arbre pondéré, que vaut la somme des probabilités des branches issues d''un même nœud ?', 'mcq',
   '["1", "0", "0,5", "le nombre de branches"]', 0,
   'Les probabilités des branches d''un même nœud ont pour somme 1.', 7),
  ('12910000-0000-4000-8000-000000000508'::uuid, 'Probabilités conditionnelles',
   'A et B sont indépendants avec P(A) = 0,4 et P(B) = 0,5. Combien vaut P(A ∩ B) ?', 'mcq',
   '["0,2", "0,9", "0,45", "0,4"]', 0,
   'Indépendance : P(A ∩ B) = P(A) × P(B) = 0,4 × 0,5 = 0,2.', 8),
  ('12910000-0000-4000-8000-000000000509'::uuid, 'Probabilités conditionnelles',
   'La formule des probabilités totales décompose P(B) en :', 'mcq',
   '["P(A ∩ B) + P(Ā ∩ B)", "P(A) + P(B)", "P(A) × P(B)", "P(A ∩ B) / P(A)"]', 0,
   'On somme les chemins menant à B : P(B) = P(A ∩ B) + P(Ā ∩ B).', 9),
  ('12910000-0000-4000-8000-000000000510'::uuid, 'Probabilités conditionnelles',
   'Une probabilité conditionnelle peut être supérieure à 1.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : comme toute probabilité, elle est comprise entre 0 et 1.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
