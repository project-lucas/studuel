-- =============================================================================
-- Studuel — Migration 047 : fiches de révision Maths collège (6e · 5e)
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
    ('maths', '6e', 'Nombres entiers et décimaux', $md$# Nombres entiers et décimaux — l'essentiel

**À retenir**
- Un nombre décimal a une **partie entière** et une **partie décimale**, séparées par la virgule.
- Chaque chiffre a une **valeur de position** : dixièmes, centièmes, millièmes après la virgule.
- On peut **encadrer** et **comparer** deux décimaux en alignant les virgules.

**Méthode : comparer 3,5 et 3,47**
1. J'aligne les virgules et je complète : 3,50 et 3,47.
2. Je compare chiffre par chiffre : 3,50 > 3,47.

**Exemple**
> 12,4 se lit « douze unités et quatre dixièmes ». Le 4 vaut 4 dixièmes = 0,4.

**Erreur classique**
- Croire que 3,47 > 3,5 « parce qu'il y a plus de chiffres ». Faux : compare les dixièmes d'abord.$md$),

    ('maths', '6e', 'Fractions', $md$# Fractions — l'essentiel

**À retenir**
- Une fraction a/b, c'est **a parts** d'un tout partagé en **b parts égales**.
- Le **numérateur** (a) est en haut, le **dénominateur** (b) en bas (b ≠ 0).
- Deux fractions sont **égales** si l'une s'obtient de l'autre en multipliant (ou divisant) haut et bas par le même nombre.

**Méthode : fraction d'une quantité**
- Les 3/4 de 20 : je divise par 4 (→ 5), je multiplie par 3 (→ 15).

**Exemple**
> 6/8 = 3/4 (on divise le haut et le bas par 2).

**Erreur classique**
- Additionner les dénominateurs : 1/2 + 1/2 ne fait pas 2/4 mais 1.$md$),

    ('maths', '6e', 'Proportionnalité', $md$# Proportionnalité — l'essentiel

**À retenir**
- Deux grandeurs sont **proportionnelles** si on passe de l'une à l'autre en multipliant **toujours par le même nombre** (le coefficient).
- Dans un tableau de proportionnalité, les colonnes sont toutes multipliées par ce coefficient.

**Méthode : le produit en croix**
- Si 3 stylos coûtent 6 €, alors 5 stylos coûtent (6 × 5) ÷ 3 = 10 €.

**Exemple**
> Vitesse constante : distance et temps sont proportionnels.

**Erreur classique**
- Ajouter au lieu de multiplier. « +2 partout » n'est PAS de la proportionnalité.$md$),

    ('maths', '6e', 'Géométrie plane', $md$# Géométrie plane — l'essentiel

**À retenir**
- Une **droite** est infinie, un **segment** a deux extrémités, une **demi-droite** a une origine.
- Deux droites peuvent être **parallèles** (jamais sécantes) ou **perpendiculaires** (angle droit).
- On code les longueurs égales par des **marques**, les angles droits par un **petit carré**.

**Méthode : tracer une perpendiculaire**
1. Je place l'équerre avec son angle droit sur la droite.
2. Je trace le long du second côté de l'équerre.

**Erreur classique**
- Confondre « parallèles » (même direction) et « perpendiculaires » (angle droit).$md$),

    ('maths', '6e', 'Aires, périmètres et volumes', $md$# Aires, périmètres et volumes — l'essentiel

**À retenir**
- Le **périmètre** = longueur du tour (en cm, m…).
- L'**aire** = surface occupée (en cm², m²…).
- Rectangle : périmètre = 2 × (L + l) ; aire = L × l.

**Méthode : aire d'un rectangle 5 cm × 3 cm**
- Aire = 5 × 3 = 15 cm². Périmètre = 2 × (5 + 3) = 16 cm.

**Exemple**
> Carré de côté 4 cm : aire = 4 × 4 = 16 cm².

**Erreur classique**
- Mélanger les unités : une aire est en cm² (surface), pas en cm (longueur).$md$),

    ('maths', '5e', 'Nombres relatifs', $md$# Nombres relatifs — l'essentiel

**À retenir**
- Un nombre relatif a un **signe** (+ ou −). Les négatifs sont plus petits que 0.
- Sur une droite graduée, plus on va à **droite**, plus le nombre est **grand**.

**Méthode : additionner deux relatifs**
- Mêmes signes : j'additionne et je garde le signe. (−3) + (−4) = −7.
- Signes différents : je soustrais et je garde le signe du plus « fort ». (−3) + (+5) = +2.

**Exemple**
> −7 < −2 : un plus grand nombre après le signe moins donne un plus petit relatif.

**Erreur classique**
- Penser que −7 > −2 : sur la droite, −7 est plus à gauche, donc plus petit.$md$),

    ('maths', '5e', 'Fractions et calculs', $md$# Fractions et calculs — l'essentiel

**À retenir**
- Pour **additionner** deux fractions, il faut le **même dénominateur**.
- Pour **multiplier** : numérateurs entre eux, dénominateurs entre eux.
- On **simplifie** en divisant haut et bas par un même nombre.

**Méthode : 1/3 + 1/6**
1. Même dénominateur : 1/3 = 2/6.
2. J'additionne les numérateurs : 2/6 + 1/6 = 3/6 = 1/2.

**Exemple**
> 2/3 × 3/4 = 6/12 = 1/2.

**Erreur classique**
- Additionner les dénominateurs. 1/3 + 1/6 ne fait pas 2/9.$md$),

    ('maths', '5e', 'Calcul littéral : initiation', $md$# Calcul littéral : initiation — l'essentiel

**À retenir**
- Une **lettre** représente un nombre inconnu ou variable.
- **3x** signifie 3 × x. On ne note pas le signe ×.
- On peut **réduire** en regroupant les termes semblables : 2x + 3x = 5x.

**Méthode : distributivité**
- k(a + b) = k×a + k×b. Exemple : 3(x + 2) = 3x + 6.

**Exemple**
> Pour x = 4 : 2x + 1 = 2×4 + 1 = 9.

**Erreur classique**
- Ajouter des termes différents : 2x + 3 ne se réduit PAS en 5x (x et un nombre seul ne se mélangent pas).$md$),

    ('maths', '5e', 'Triangles et angles', $md$# Triangles et angles — l'essentiel

**À retenir**
- La **somme des angles** d'un triangle vaut toujours **180°**.
- Triangle **isocèle** : deux côtés égaux et deux angles égaux.
- Triangle **équilatéral** : trois côtés égaux, trois angles de 60°.

**Méthode : angle manquant**
- Deux angles font 50° et 70° → le troisième = 180 − (50 + 70) = 60°.

**Exemple**
> Dans un triangle rectangle, un angle vaut 90° ; les deux autres font ensemble 90°.

**Erreur classique**
- Oublier que la somme fait 180° (et non 360°, qui est le tour complet).$md$),

    ('maths', '5e', 'Proportionnalité et pourcentages', $md$# Proportionnalité et pourcentages — l'essentiel

**À retenir**
- Un **pourcentage** est une proportion sur 100 : 25 % = 25/100 = 0,25.
- Prendre t % d'une quantité = multiplier par t ÷ 100.

**Méthode : 30 % de 80**
- 80 × 30 ÷ 100 = 24.

**Exemple**
> Une remise de 20 % sur 50 € : réduction de 10 €, prix payé 40 €.

**Erreur classique**
- Confondre la **remise** (ce qu'on enlève) et le **prix final** (ce qui reste à payer).$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
