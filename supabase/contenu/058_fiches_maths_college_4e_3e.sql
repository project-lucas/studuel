-- =============================================================================
-- Studuel — Migration 058 : fiches de révision Maths collège (4e · 3e)
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
    ('maths', '4e', 'Puissances', $md$# Puissances — l'essentiel

**À retenir**
- **a^n** = a × a × … × a (n facteurs). a s'appelle la **base**, n l'**exposant**.
- **a^1 = a** et **a^0 = 1** (pour a ≠ 0).
- Puissance négative : **a^(−n) = 1 / a^n**. Exemple : 10^(−2) = 0,01.

**Méthode : produit de puissances de même base**
- On **additionne** les exposants : a^m × a^n = a^(m+n).
- On **soustrait** pour un quotient : a^m ÷ a^n = a^(m−n).

**Exemple**
> 2^3 × 2^4 = 2^(3+4) = 2^7 = 128.

**Erreur classique**
- Multiplier les exposants dans un produit : 2^3 × 2^4 ne fait PAS 2^12.$md$),

    ('maths', '4e', 'Calcul littéral', $md$# Calcul littéral — l'essentiel

**À retenir**
- **Développer** : transformer un produit en somme avec la distributivité.
- **Factoriser** : transformer une somme en produit en repérant un facteur commun.
- **Réduire** : regrouper les termes semblables (mêmes lettres, même puissance).

**Méthode : double distributivité**
- (a + b)(c + d) = ac + ad + bc + bd.
- Exemple : (x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6.

**Exemple**
> Factoriser 6x + 9 : facteur commun 3, donc 6x + 9 = 3(2x + 3).

**Erreur classique**
- Oublier un produit dans la double distributivité (il y a toujours **4 produits**).$md$),

    ('maths', '4e', 'Théorème de Pythagore', $md$# Théorème de Pythagore — l'essentiel

**À retenir**
- Il s'applique **uniquement dans un triangle rectangle**.
- L'**hypoténuse** est le côté opposé à l'angle droit (le plus long).
- Théorème : hypoténuse² = somme des carrés des deux autres côtés.

**Méthode : calculer l'hypoténuse**
1. Côtés de l'angle droit : 3 cm et 4 cm.
2. hypoténuse² = 3² + 4² = 9 + 16 = 25.
3. hypoténuse = √25 = 5 cm.

**Exemple**
> Triangle de côtés 6, 8 et 10 : 6² + 8² = 36 + 64 = 100 = 10² → il est rectangle.

**Erreur classique**
- Additionner les côtés (3 + 4 = 7) au lieu des carrés. Il faut passer par les carrés.$md$),

    ('maths', '4e', 'Proportionnalité et fonctions', $md$# Proportionnalité et fonctions — l'essentiel

**À retenir**
- Une situation est **proportionnelle** si y = k × x (k = coefficient constant).
- Le **graphique** d'une proportionnalité est une **droite passant par l'origine** (0 ; 0).
- Vitesse, échelle, pourcentage sont des exemples de proportionnalité.

**Méthode : trouver le coefficient**
- Si 4 kg coûtent 10 €, alors k = 10 ÷ 4 = 2,5 €/kg. Pour 7 kg : 7 × 2,5 = 17,50 €.

**Exemple**
> Pour k = 2,5 : le point (4 ; 10) est sur la droite car 2,5 × 4 = 10.

**Erreur classique**
- Confondre une droite quelconque avec une proportionnalité : seule une droite **passant par l'origine** en est une.$md$),

    ('maths', '4e', 'Statistiques et probabilités', $md$# Statistiques et probabilités — l'essentiel

**À retenir**
- La **moyenne** = somme des valeurs ÷ nombre de valeurs.
- La **médiane** partage la série ordonnée en deux moitiés égales.
- Une **probabilité** est un nombre entre 0 et 1 (0 = impossible, 1 = certain).

**Méthode : moyenne d'une série**
- Notes 8, 12, 10, 14 : moyenne = (8 + 12 + 10 + 14) ÷ 4 = 44 ÷ 4 = 11.

**Exemple**
> Un dé équilibré : P(obtenir un 3) = 1/6 (un cas favorable sur six possibles).

**Erreur classique**
- Oublier de diviser par le bon effectif, ou confondre moyenne et médiane.$md$),

    ('maths', '3e', 'Arithmétique', $md$# Arithmétique — l'essentiel

**À retenir**
- Un **diviseur** de n divise n sans reste (24 : diviseurs 1, 2, 3, 4, 6, 8, 12, 24).
- Un nombre est **premier** s'il a exactement **deux** diviseurs : 1 et lui-même.
- Le **PGCD** est le plus grand diviseur commun à deux nombres.

**Méthode : rendre une fraction irréductible**
1. Je cherche le PGCD du numérateur et du dénominateur.
2. Je divise les deux par ce PGCD.
- 24/36 : PGCD = 12, donc 24/36 = 2/3.

**Exemple**
> PGCD(12, 18) = 6 car 6 divise 12 et 18, et c'est le plus grand à le faire.

**Erreur classique**
- Croire que 1 est un nombre premier : il n'a qu'un seul diviseur, donc il ne l'est pas.$md$),

    ('maths', '3e', 'Fonctions linéaires et affines', $md$# Fonctions linéaires et affines — l'essentiel

**À retenir**
- **Linéaire** : f(x) = a x. Sa courbe est une **droite par l'origine** (proportionnalité).
- **Affine** : f(x) = a x + b. Sa courbe est une **droite** d'ordonnée à l'origine b.
- **a** est le coefficient directeur (la pente), **b** l'ordonnée à l'origine.

**Méthode : calculer une image**
- Pour f(x) = 2x + 3 et x = 5 : f(5) = 2 × 5 + 3 = 13.

**Exemple**
> f(x) = 3x est linéaire : f(0) = 0, f(2) = 6 → la droite passe par (0;0) et (2;6).

**Erreur classique**
- Dire qu'une fonction affine avec b ≠ 0 est proportionnelle : non, sa droite ne passe pas par l'origine.$md$),

    ('maths', '3e', 'Théorème de Thalès', $md$# Théorème de Thalès — l'essentiel

**À retenir**
- Configuration : deux droites sécantes en A, coupées par deux **parallèles** (BC) // (MN).
- Le théorème donne l'**égalité de trois rapports** : AM/AB = AN/AC = MN/BC.
- Il sert à calculer une longueur manquante quand on a des parallèles.

**Méthode : calculer une longueur**
1. J'écris l'égalité des rapports.
2. AM/AB = MN/BC. Si AM = 2, AB = 4, BC = 6 → MN = (2 × 6) ÷ 4 = 3.

**Exemple**
> AM/AB = 2/4 = 1/2 et AN/AC = 3/6 = 1/2 : les rapports sont bien égaux.

**Erreur classique**
- Appliquer Thalès sans droites parallèles : la parallélisme est indispensable.$md$),

    ('maths', '3e', 'Trigonométrie', $md$# Trigonométrie — l'essentiel

**À retenir**
- Dans un triangle **rectangle**, pour un angle aigu : cosinus, sinus, tangente.
- **cos = adjacent/hypoténuse**, **sin = opposé/hypoténuse**, **tan = opposé/adjacent**.
- Moyen mnémotechnique : **SOH-CAH-TOA**.

**Méthode : calculer un côté**
- Angle 60°, hypoténuse 10 cm, côté adjacent inconnu : cos(60°) = adj/10.
- adj = 10 × cos(60°) = 10 × 0,5 = 5 cm.

**Exemple**
> Opposé 3, adjacent 4 : tan de l'angle = 3/4 = 0,75.

**Erreur classique**
- Se tromper de côté (opposé/adjacent) : l'adjacent touche l'angle, l'opposé lui fait face.$md$),

    ('maths', '3e', 'Probabilités et statistiques', $md$# Probabilités et statistiques — l'essentiel

**À retenir**
- Probabilité d'un événement = **cas favorables ÷ cas possibles** (situation équiprobable).
- La somme des probabilités de tous les résultats vaut **1**.
- Indicateurs : **moyenne**, **médiane**, **étendue** (max − min).

**Méthode : probabilité avec un dé**
- P(obtenir un nombre pair) = 3/6 = 1/2 (favorables : 2, 4, 6 sur six faces).

**Exemple**
> Étendue des notes 6, 9, 12, 15 : étendue = 15 − 6 = 9.

**Erreur classique**
- Oublier de compter tous les cas possibles, ou donner une probabilité supérieure à 1.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
