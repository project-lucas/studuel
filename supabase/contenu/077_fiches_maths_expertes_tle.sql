-- =============================================================================
-- Studuel — Migration 077 : fiches de révision Maths expertes Terminale
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
    ('maths-expertes', 'Tle', 'Nombres complexes', $md$# Nombres complexes — l'essentiel

**À retenir**
- Un complexe s'écrit z = a + bi avec a, b réels et i² = −1 ; a = Re(z), b = Im(z).
- Le conjugué est z̄ = a − bi ; le module est |z| = √(a² + b²), avec z z̄ = |z|².
- Forme trigonométrique/exponentielle : z = r(cos θ + i sin θ) = r e^{iθ}, où r = |z| > 0 et θ = arg(z).

**Méthode / Propriétés**
- Module et argument sont multiplicatifs : |z z'| = |z| |z'| et arg(z z') = arg(z) + arg(z') [2π].
- Inverse : 1/z = z̄ / |z|² (z ≠ 0). Pour diviser, on multiplie haut et bas par le conjugué du dénominateur.
- Formule de Moivre : (e^{iθ})ⁿ = e^{inθ}, donc (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ).

**Exemple**
> z = 1 + i : |z| = √(1² + 1²) = √2 et arg(z) = π/4, donc z = √2 · e^{iπ/4}.
> Alors z² = (√2)² · e^{iπ/2} = 2i (vérif directe : (1+i)² = 1 + 2i + i² = 2i).

**Erreur classique**
- Écrire |z| = a + b ou |z|² = a² − b². Le module est √(a² + b²) : les DEUX carrés s'additionnent car i² = −1.$md$),

    ('maths-expertes', 'Tle', 'Arithmétique : congruences', $md$# Arithmétique : congruences — l'essentiel

**À retenir**
- a ≡ b [n] signifie que n divise a − b, c'est-à-dire a et b ont le même reste dans la division par n.
- Les congruences se conservent par addition et multiplication : si a ≡ b [n] et c ≡ d [n], alors a + c ≡ b + d [n] et a c ≡ b d [n].
- Le PGCD de a et b se calcule par l'algorithme d'Euclide ; a et b sont premiers entre eux quand PGCD(a, b) = 1.

**Méthode / Propriétés**
- Pour un reste modulo n, on remplace chaque facteur par son reste puis on réduit à chaque étape.
- Petit théorème de Fermat : si p est premier et p ne divise pas a, alors a^{p−1} ≡ 1 [p] (donc a^p ≡ a [p] pour tout a).
- Euclide : PGCD(a, b) = PGCD(b, r) où r est le reste de a par b ; on itère jusqu'au reste 0.

**Exemple**
> Reste de 2^{10} modulo 11 : 11 est premier et ne divise pas 2, donc 2^{10} ≡ 1 [11] (Fermat).
> Vérif : 2^{10} = 1024 = 93 × 11 + 1, reste bien 1.

**Erreur classique**
- Appliquer Fermat quand p n'est pas premier, ou quand p divise a. L'hypothèse « p premier ET p ∤ a » est indispensable.$md$),

    ('maths-expertes', 'Tle', 'Matrices et graphes', $md$# Matrices et graphes — l'essentiel

**À retenir**
- Une matrice de taille n × p a n lignes et p colonnes ; on note aᵢⱼ le coefficient ligne i, colonne j.
- Le produit AB n'existe que si le nombre de colonnes de A égale le nombre de lignes de B ; il est en général non commutatif : AB ≠ BA.
- La matrice identité Iₙ (des 1 sur la diagonale, des 0 ailleurs) vérifie A Iₙ = Iₙ A = A.

**Méthode / Propriétés**
- Coefficient du produit : (AB)ᵢⱼ = somme sur k de aᵢₖ bₖⱼ (ligne i de A « fois » colonne j de B).
- Matrice d'adjacence M d'un graphe à n sommets : mᵢⱼ = nombre d'arêtes du sommet i vers le sommet j.
- Le coefficient (i, j) de Mᵏ donne le nombre de chemins de longueur exactement k reliant le sommet i au sommet j.

**Exemple**
> A = [[1, 2], [0, 1]], B = [[1, 0], [1, 1]].
> AB = [[1·1 + 2·1, 1·0 + 2·1], [0·1 + 1·1, 0·0 + 1·1]] = [[3, 2], [1, 1]].
> BA = [[1, 2], [1, 3]] ≠ AB : le produit n'est pas commutatif.

**Erreur classique**
- Multiplier terme à terme (aᵢⱼ bᵢⱼ). Le produit matriciel combine LIGNES de A et COLONNES de B, pas les cases une à une.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
