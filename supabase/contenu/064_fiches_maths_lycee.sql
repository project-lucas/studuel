-- =============================================================================
-- Studuel — Migration 064 : fiches de révision Maths lycée (2de · 1re · Tle)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('maths', '2de', 'Ensembles de nombres et calculs', $md$# Ensembles de nombres et calculs — l'essentiel

**À retenir**
- Les ensembles s'emboîtent : ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ (entiers naturels, relatifs, rationnels, réels).
- Un **rationnel** s'écrit a/b avec a et b entiers, b ≠ 0 ; les autres réels (comme √2, π) sont **irrationnels**.
- Puissances : aᵐ × aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁻ⁿ = 1/aⁿ.

**Méthode : rendre rationnel un dénominateur**
- Multiplier haut et bas par le conjugué : 1/(√2) = √2/(√2·√2) = √2/2.

**Exemple**
> √50 = √(25×2) = 5√2, car √(a×b) = √a × √b pour a, b ≥ 0.

**Erreur classique**
- Écrire √(a + b) = √a + √b. FAUX : √(9 + 16) = √25 = 5, alors que √9 + √16 = 3 + 4 = 7.$md$),

    ('maths', '2de', 'Équations et inéquations', $md$# Équations et inéquations — l'essentiel

**À retenir**
- Résoudre = trouver toutes les valeurs de x qui vérifient l'égalité (ou l'inégalité).
- On garde l'équivalence en ajoutant/retranchant un même nombre, ou en multipliant par un nombre **non nul**.
- **Règle du signe** : multiplier une inéquation par un nombre **négatif inverse** le sens.

**Méthode : résoudre −2x + 3 ≤ 7**
1. −2x ≤ 4.
2. Je divise par −2 (négatif) → j'inverse : x ≥ −2.

**Exemple**
> Équation produit : (x − 1)(x + 4) = 0 ⇔ x = 1 ou x = −4 (un produit est nul ssi un facteur est nul).

**Erreur classique**
- Oublier d'inverser le sens de l'inégalité en divisant par un nombre négatif.$md$),

    ('maths', '2de', 'Fonctions de référence', $md$# Fonctions de référence — l'essentiel

**À retenir**
- **Affine** f(x) = ax + b : droite, coefficient directeur a, ordonnée à l'origine b.
- **Carré** f(x) = x² : parabole, décroissante sur ]−∞ ; 0], croissante sur [0 ; +∞[, minimum 0.
- **Inverse** f(x) = 1/x : hyperbole, décroissante sur ]−∞ ; 0[ et sur ]0 ; +∞[, définie pour x ≠ 0.

**Méthode : coefficient directeur d'une droite**
- Avec deux points A(xₐ ; yₐ) et B(x_B ; y_B) : a = (y_B − yₐ)/(x_B − xₐ).

**Exemple**
> Pour f(x) = x², f(−3) = (−3)² = 9 : une image par le carré est toujours ≥ 0.

**Erreur classique**
- Écrire (−3)² = −9. FAUX : le carré d'un nombre est toujours positif, (−3)² = 9.$md$),

    ('maths', '2de', 'Vecteurs', $md$# Vecteurs — l'essentiel

**À retenir**
- Un **vecteur** est défini par une direction, un sens et une longueur (norme).
- Coordonnées : le vecteur AB a pour coordonnées (x_B − xₐ ; y_B − yₐ).
- **Relation de Chasles** : AB + BC = AC.

**Méthode : coordonnées de AB**
- A(1 ; 2), B(4 ; 6) → AB = (4 − 1 ; 6 − 2) = (3 ; 4). Norme ‖AB‖ = √(3² + 4²) = √25 = 5.

**Exemple**
> Deux vecteurs u(x ; y) et v(x' ; y') sont colinéaires ssi xy' − x'y = 0.

**Erreur classique**
- Calculer les coordonnées « xₐ − x_B » au lieu de « x_B − xₐ » : le sens du vecteur est inversé.$md$),

    ('maths', '2de', 'Statistiques et probabilités', $md$# Statistiques et probabilités — l'essentiel

**À retenir**
- **Moyenne** : somme des valeurs ÷ effectif total. **Médiane** : valeur qui partage la série ordonnée en deux moitiés.
- **Étendue** = valeur max − valeur min ; **écart interquartile** = Q₃ − Q₁.
- Probabilité d'un événement = (nombre de cas favorables) ÷ (nombre de cas possibles), entre 0 et 1.

**Méthode : probabilité d'une union**
- P(A ∪ B) = P(A) + P(B) − P(A ∩ B).

**Exemple**
> Dé équilibré à 6 faces : P(« obtenir un nombre pair ») = 3/6 = 1/2.

**Erreur classique**
- Confondre moyenne et médiane : sur 2, 3, 100, la moyenne est 35 mais la médiane est 3.$md$),

    ('maths', '1re', 'Suites numériques', $md$# Suites numériques — l'essentiel

**À retenir**
- Une **suite arithmétique** ajoute toujours la même raison r : uₙ₊₁ = uₙ + r, donc uₙ = u₀ + nr.
- Une **suite géométrique** multiplie toujours par la même raison q : uₙ₊₁ = q·uₙ, donc uₙ = u₀ · qⁿ.
- Une suite peut être croissante, décroissante ou ni l'un ni l'autre.

**Méthode : reconnaître la nature**
- Je calcule uₙ₊₁ − uₙ (constant → arithmétique) ou uₙ₊₁ ÷ uₙ (constant → géométrique).

**Exemple**
> u₀ = 5, r = 3 (arithmétique) : u₄ = 5 + 4×3 = 17.

**Erreur classique**
- Écrire uₙ = u₀ + nr pour une suite géométrique. Pour une géométrique c'est uₙ = u₀ · qⁿ (produit, pas somme).$md$),

    ('maths', '1re', 'Second degré', $md$# Second degré — l'essentiel

**À retenir**
- Un trinôme s'écrit ax² + bx + c avec a ≠ 0.
- **Discriminant** : Δ = b² − 4ac.
- Δ > 0 → deux racines ; Δ = 0 → une racine double ; Δ < 0 → aucune racine réelle.

**Méthode : résoudre ax² + bx + c = 0**
1. Je calcule Δ = b² − 4ac.
2. Si Δ ≥ 0, les racines sont x = (−b ± √Δ) / (2a).

**Exemple**
> x² − 5x + 6 = 0 : Δ = (−5)² − 4×1×6 = 25 − 24 = 1. Racines x = (5 ± 1)/2, soit 3 et 2.

**Erreur classique**
- Oublier le −4ac ou se tromper de signe : Δ = b² − 4ac, pas b² + 4ac.$md$),

    ('maths', '1re', 'Dérivation', $md$# Dérivation — l'essentiel

**À retenir**
- Le nombre dérivé f'(a) est le **coefficient directeur de la tangente** à la courbe au point d'abscisse a.
- Dérivées usuelles : (xⁿ)' = n·xⁿ⁻¹, (constante)' = 0, (√x)' = 1/(2√x).
- Une fonction est croissante là où f' ≥ 0, décroissante là où f' ≤ 0.

**Méthode : dériver un polynôme**
- Terme à terme. Pour f(x) = x² : f'(x) = 2x. Pour f(x) = x³ : f'(x) = 3x².

**Exemple**
> f(x) = 3x² − 4x + 1 → f'(x) = 6x − 4. La tangente en x = 2 a pour pente f'(2) = 8.

**Erreur classique**
- Dériver la constante en la gardant : dans 3x² − 4x + 1, le « +1 » a une dérivée nulle.$md$),

    ('maths', '1re', 'Produit scalaire', $md$# Produit scalaire — l'essentiel

**À retenir**
- Le produit scalaire de deux vecteurs : u·v = ‖u‖ × ‖v‖ × cos θ, où θ est l'angle entre eux.
- En coordonnées : u(x ; y) et v(x' ; y') → u·v = xx' + yy'.
- Deux vecteurs sont **orthogonaux** ssi u·v = 0.

**Méthode : tester l'orthogonalité**
- u(2 ; 3), v(−3 ; 2) → u·v = 2×(−3) + 3×2 = −6 + 6 = 0, donc u ⊥ v.

**Exemple**
> u(1 ; 0), v(1 ; 1) : u·v = 1×1 + 0×1 = 1 = ‖u‖‖v‖cos θ = 1×√2×cos θ, donc cos θ = √2/2, θ = 45°.

**Erreur classique**
- Écrire u·v = xx' + yy' comme un vecteur : le produit scalaire est un **nombre**, pas un vecteur.$md$),

    ('maths', '1re', 'Probabilités conditionnelles', $md$# Probabilités conditionnelles — l'essentiel

**À retenir**
- La probabilité de A sachant B : P_B(A) = P(A ∩ B) / P(B), avec P(B) ≠ 0.
- **Formule des probabilités totales** : P(A) = P(A ∩ B) + P(A ∩ B̄).
- Deux événements sont **indépendants** ssi P(A ∩ B) = P(A) × P(B).

**Méthode : lire un arbre pondéré**
- La probabilité d'un chemin = produit des probabilités le long des branches.

**Exemple**
> P(B) = 0,4 et P_B(A) = 0,3 → P(A ∩ B) = P(B) × P_B(A) = 0,4 × 0,3 = 0,12.

**Erreur classique**
- Confondre P_B(A) et P_A(B) : ces deux conditionnelles ne sont pas égales en général.$md$),

    ('maths', 'Tle', 'Limites de fonctions', $md$# Limites de fonctions — l'essentiel

**À retenir**
- Une limite décrit le comportement de f(x) quand x tend vers une valeur ou vers ±∞.
- **Croissances comparées** : en +∞, l'exponentielle l'emporte sur toute puissance, qui l'emporte sur le logarithme.
- Une asymptote horizontale d'équation y = ℓ apparaît quand lim f(x) = ℓ en ±∞.

**Méthode : forme indéterminée ∞/∞ (polynôme)**
- Je factorise par le terme de plus haut degré. lim (3x² + x)/(x² − 1) en +∞ = lim 3x²/x² = 3.

**Exemple**
> lim (1/x) = 0 quand x → +∞ ; lim (1/x) = +∞ quand x → 0⁺.

**Erreur classique**
- Conclure « ∞ − ∞ = 0 » : c'est une forme **indéterminée**, il faut lever l'indétermination.$md$),

    ('maths', 'Tle', 'Continuité et convexité', $md$# Continuité et convexité — l'essentiel

**À retenir**
- Une fonction est **continue** si on trace sa courbe sans lever le crayon.
- **Théorème des valeurs intermédiaires** : si f est continue sur [a ; b] et k est entre f(a) et f(b), alors f(x) = k a au moins une solution.
- **Convexité** : f est convexe là où f'' ≥ 0 (courbe « en creux »), concave là où f'' ≤ 0.

**Méthode : trouver les points d'inflexion**
- Je cherche où f'' s'annule **en changeant de signe** : la convexité s'y inverse.

**Exemple**
> f(x) = x³ : f''(x) = 6x, qui s'annule en 0 en changeant de signe → point d'inflexion en x = 0.

**Erreur classique**
- Confondre f' et f'' : la convexité se lit sur le signe de la dérivée **seconde**, pas de la première.$md$),

    ('maths', 'Tle', 'Logarithme népérien', $md$# Logarithme népérien — l'essentiel

**À retenir**
- ln est défini sur ]0 ; +∞[, ln(1) = 0 et ln(e) = 1.
- **Propriétés** : ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(aⁿ) = n·ln a.
- ln est la fonction réciproque de exp : ln(eˣ) = x et e^(ln x) = x.

**Méthode : dériver et résoudre**
- (ln x)' = 1/x. Pour résoudre ln x = 2 : x = e² (on applique exp des deux côtés).

**Exemple**
> ln(6) = ln(2 × 3) = ln 2 + ln 3.

**Erreur classique**
- Écrire ln(a + b) = ln a + ln b. FAUX : la propriété concerne le **produit**, ln(ab) = ln a + ln b.$md$),

    ('maths', 'Tle', 'Primitives et équations différentielles', $md$# Primitives et équations différentielles — l'essentiel

**À retenir**
- F est une **primitive** de f si F' = f. Deux primitives diffèrent d'une constante.
- Primitives usuelles : une primitive de xⁿ est xⁿ⁺¹/(n+1) (n ≠ −1) ; une primitive de 1/x est ln x.
- L'équation y' = a·y a pour solutions y = C·e^(ax), C constante réelle.

**Méthode : primitive d'un polynôme**
- Terme à terme, en remontant la dérivation. Une primitive de f(x) = 2x est F(x) = x² + C.

**Exemple**
> Une primitive de f(x) = 3x² est F(x) = x³ + C, car (x³)' = 3x².

**Erreur classique**
- Prendre la primitive de xⁿ égale à xⁿ⁻¹ : c'est l'inverse, on **augmente** l'exposant : xⁿ⁺¹/(n+1).$md$),

    ('maths', 'Tle', 'Lois de probabilité', $md$# Lois de probabilité — l'essentiel

**À retenir**
- **Espérance** d'une variable aléatoire discrète : E(X) = Σ xᵢ · P(X = xᵢ) (valeur moyenne attendue).
- **Loi binomiale** B(n ; p) : n épreuves indépendantes, P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ, avec E(X) = np.
- **Loi normale** : courbe en cloche symétrique autour de sa moyenne μ.

**Méthode : espérance d'une binomiale**
- Directement E(X) = n × p. Pour B(10 ; 0,3) : E(X) = 10 × 0,3 = 3.

**Exemple**
> B(4 ; 0,5), P(X = 2) = C(4,2) × 0,5² × 0,5² = 6 × 0,0625 = 0,375.

**Erreur classique**
- Oublier le coefficient binomial C(n,k) dans P(X = k) : il compte le nombre de façons d'obtenir k succès.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
