// Mathématiques — Quatrième : LE PROGRAMME COMPLET (36 fiches).
//
// LE DÉFAUT. La page « Maths » d'un élève de 4e s'ouvre sur CINQ fiches héritées
// du tout premier jeu de données (migration 008, contenu rempli par la 104) :
// « Puissances », « Calcul littéral », « Théorème de Pythagore »,
// « Proportionnalité et fonctions » et « Statistiques et probabilités ». Cinq
// lignes pour une année entière.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 5 chapitres de la maquette de référence et
// leurs 36 fiches :
//   1. Nombres et calculs                 (10)   4. Espace et géométrie      (8)
//   2. Organisation et gestion des données (5)   5. Cours de l'ancien programme (11)
//   3. Grandeurs et mesures                (2)
//
// LE CHAPITRE 5 EST DANS LA MAQUETTE, ET ON LE SUIT. « Cours de l'ancien
// programme » rassemble onze notions que le programme actuel n'exige plus au
// niveau 4e mais que les élèves rencontrent encore — division euclidienne,
// critères de divisibilité, échelles, conversions d'unités. La maquette en fait
// un chapitre à part, clairement étiqueté, plutôt que de les mêler au programme
// en vigueur : c'est exactement le geste du chapitre « Anciens programmes » du
// français de 1re (migration 260). Un élève qui cherche « critères de
// divisibilité » la trouve ; un élève qui révise le programme sait qu'elle n'en
// fait pas partie.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (a × b, x², √n, ≈).
//
// ⚠️ Le slug `maths` porte désormais QUATRE modules (`maths-tle.mjs` = 255,
// `maths-1re.mjs` = 271, `maths-3e.mjs` = 294, celui-ci = 301) : ne JAMAIS
// générer avec `--slugs maths`. Toujours `--modules maths-4e`.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 4e — LE PROGRAMME COMPLET (36 fiches)',

  motif: `CONSTAT : les maths de 4e n'avaient que les 5 fiches du premier jeu de données
de l'app — « Puissances », « Calcul littéral », « Théorème de Pythagore »,
« Proportionnalité et fonctions », « Statistiques et probabilités ». Un élève de
4e qui révisait les nombres relatifs, les fractions, les racines carrées, la
distributivité, les équations, les probabilités, les grandeurs quotients, la
pyramide, les triangles semblables, Thalès, le cosinus ou la translation ne
trouvait RIEN. Cette migration installe les 36 fiches, rangées sous les 5
chapitres de la maquette, et retire les 5 fiches génériques.
LE CINQUIÈME CHAPITRE EST ASSUMÉ : « Cours de l'ancien programme » rassemble 11
notions que le programme actuel n'exige plus en 4e mais que les élèves
rencontrent encore (division euclidienne, critères de divisibilité, échelles,
conversions d'unités). La maquette en fait un chapitre à part, clairement
étiqueté, plutôt que de les mêler au programme en vigueur — le même geste que le
chapitre « Anciens programmes » du français de 1re (migration 260).`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 36 fiches sous 5 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 36 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les cinq lignes voulues — elles datent de la 008,
bien avant la colonne theme, tandis que les 36 fiches neuves en portent une dès
l'INSERT. Le ménage tourne AVANT les insertions et ne peut donc jamais mordre sur
elles, ni au premier passage ni au rejeu. Ce repère est ici plus sûr que le
titre : « Puissances » et « Calcul littéral » sont des mots que le programme neuf
réemploie, et un ménage par titre demanderait de vérifier à chaque relecture
qu'aucune fiche neuve ne porte exactement l'un des cinq anciens libellés.
Le filtre level = '4e' est indispensable : les maths existent sur sept niveaux,
et plusieurs portent encore des chapitres sans theme.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['4e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Nombres et calculs
        // ===================================================================
        {
          titre: 'Multiplier et diviser des nombres relatifs',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'La règle des signes',
            cours: `Un **nombre relatif** est un nombre précédé d’un signe : **positif** (+) ou **négatif** (−). Additionner et soustraire des relatifs se travaille en 5e ; la 4e ajoute la **multiplication** et la **division**.

## La règle des signes
Elle est la même pour les deux opérations :
- (+) × (+) = **+**
- (−) × (−) = **+**
- (+) × (−) = **−**
- (−) × (+) = **−**

> **Deux signes identiques donnent un résultat positif ; deux signes contraires donnent un résultat négatif.** La règle vaut mot pour mot pour la division.

## La méthode en deux temps
1. On détermine le **signe** du résultat.
2. On calcule le produit ou le quotient des **distances à zéro** (les valeurs sans le signe).

(−7) × (+3) : signes contraires → résultat négatif ; 7 × 3 = 21 ; donc **−21**.
(−36) ÷ (−4) : signes identiques → résultat positif ; 36 ÷ 4 = 9 ; donc **+9**.

## Un produit de plusieurs facteurs
On compte les facteurs **négatifs** :
- un nombre **pair** de facteurs négatifs → produit **positif** ;
- un nombre **impair** → produit **négatif**.

(−2) × (−3) × (−5) : trois facteurs négatifs, nombre impair → résultat négatif ; 2 × 3 × 5 = 30 ; donc **−30**.

## Les pièges à éviter
- **(−3)² = +9** mais **−3² = −9** : dans le second cas, le carré ne porte que sur le 3.
- L’opposé de −5 est **+5** ; l’inverse de −5 est **−1/5**. Opposé et inverse ne se confondent pas.
- Un produit est **nul** si et seulement si l’un de ses facteurs est nul.`,
          },
          questions: [
            ['Quel est le signe du produit (−7) × (+3) ?', ['Négatif', 'Positif', 'Nul', 'Cela dépend de l’ordre'], 0, 'Deux signes contraires donnent un résultat négatif.'],
            ['Combien vaut (−36) ÷ (−4) ?', ['+9', '−9', '+40', '−40'], 0, 'Deux signes identiques donnent un quotient positif.'],
            ['Quel est le signe de (−2) × (−3) × (−5) ?', ['Négatif', 'Positif', 'Nul', 'Indéterminé'], 0, 'Trois facteurs négatifs : un nombre impair donne un produit négatif.'],
            ['Combien vaut (−3)² ?', ['+9', '−9', '−6', '+6'], 0, 'Le carré porte sur le nombre entier, signe compris.'],
            ['Combien vaut −3² ?', ['−9', '+9', '−6', '+6'], 0, 'Sans parenthèses, le carré ne porte que sur le 3.'],
            ['Quel est l’opposé de −5 ?', ['+5', '−1/5', '+1/5', '−5'], 0, 'L’inverse serait −1/5 : les deux notions ne se confondent pas.'],
            ['Quand un produit de facteurs est-il nul ?', ['Quand au moins l’un des facteurs est nul', 'Quand tous les facteurs sont négatifs', 'Quand il y a un nombre pair de facteurs', 'Jamais'], 0, 'C’est la propriété qui sert à résoudre les équations produit.'],
            ['La règle des signes de la division diffère de celle de la multiplication.', ['Vrai', 'Faux'], 1, 'Elle est identique, mot pour mot.'],
          ],
        },
        {
          titre: 'Comparaison et encadrement',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Ranger les nombres, les situer entre deux bornes',
            cours: `## Comparer deux nombres relatifs
- Un nombre **positif** est toujours supérieur à un nombre **négatif**.
- Entre deux nombres **positifs**, le plus grand est celui dont la distance à zéro est la plus grande : 7 > 3.
- Entre deux nombres **négatifs**, c’est **l’inverse** : le plus grand est celui dont la distance à zéro est la plus **petite**. **−3 > −7**.

Sur une droite graduée, comparer revient à regarder qui est le plus **à droite**.

## Comparer deux fractions
- **Même dénominateur** : on compare les numérateurs. 5/7 > 3/7.
- **Dénominateurs différents** : on les **réduit au même dénominateur** avant de comparer. Pour 2/3 et 3/5, on prend 15 : 10/15 < 9/15 est faux — 10/15 > 9/15, donc 2/3 > 3/5.
- **Même numérateur** : plus le dénominateur est grand, plus la fraction est petite. 3/10 < 3/4.

## Les symboles
**<** (strictement inférieur), **>** (strictement supérieur), **≤**, **≥**. La pointe se tourne toujours vers le plus **petit**.

## Encadrer un nombre
**Encadrer**, c’est le placer entre deux bornes : a < x < b.
L’encadrement est d’autant plus **précis** que l’écart entre les bornes — l’**amplitude** — est petit.

Pour √2 ≈ 1,4142 :
- à l’unité : 1 < √2 < 2
- au dixième : 1,4 < √2 < 1,5
- au centième : 1,41 < √2 < 1,42

## Valeur approchée
- par **défaut** : la borne inférieure (1,41) ;
- par **excès** : la borne supérieure (1,42) ;
- **arrondi** : la borne la plus proche du nombre.

> Un encadrement ne se lit jamais tout seul : il faut savoir à quelle **précision** il est donné.`,
          },
          questions: [
            ['Quel nombre est le plus grand : −3 ou −7 ?', ['−3', '−7', 'Ils sont égaux', 'On ne peut pas comparer'], 0, 'Entre deux négatifs, le plus grand est celui dont la distance à zéro est la plus petite.'],
            ['Comment compare-t-on deux fractions de dénominateurs différents ?', ['On les réduit au même dénominateur', 'On compare les numérateurs directement', 'On additionne numérateur et dénominateur', 'On les convertit en pourcentages obligatoirement'], 0, 'C’est la seule méthode sûre.'],
            ['Entre 3/10 et 3/4, laquelle est la plus grande ?', ['3/4', '3/10', 'Elles sont égales', 'On ne peut pas savoir'], 0, 'À numérateur égal, plus le dénominateur est grand, plus la fraction est petite.'],
            ['Que signifie encadrer un nombre ?', ['Le placer entre deux bornes', 'L’arrondir à l’unité', 'Le multiplier par 10', 'Le convertir en fraction'], 0, 'On écrit a < x < b.'],
            ['Qu’est-ce que l’amplitude d’un encadrement ?', ['L’écart entre les deux bornes', 'La valeur du nombre encadré', 'Le nombre de décimales', 'La somme des deux bornes'], 0, 'Plus elle est petite, plus l’encadrement est précis.'],
            ['Quel est l’encadrement de √2 au dixième ?', ['1,4 < √2 < 1,5', '1 < √2 < 2', '1,41 < √2 < 1,42', '1,3 < √2 < 1,4'], 0, '√2 vaut environ 1,4142.'],
            ['Qu’est-ce qu’une valeur approchée par défaut ?', ['La borne inférieure de l’encadrement', 'La borne supérieure', 'La moyenne des deux bornes', 'La valeur exacte'], 0, 'Par excès, ce serait la borne supérieure.'],
            ['Un nombre positif peut être inférieur à un nombre négatif.', ['Vrai', 'Faux'], 1, 'Tout positif est supérieur à tout négatif.'],
          ],
        },
        {
          titre: 'Fractions égales',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Le même nombre, écrit autrement',
            cours: `Une **fraction** a/b désigne le quotient de a par b (avec b non nul). Un même nombre peut s’écrire avec **une infinité** de fractions différentes : 1/2 = 2/4 = 3/6 = 50/100.

## La propriété fondamentale
On ne change pas la valeur d’une fraction en **multipliant** ou en **divisant** son numérateur ET son dénominateur par un **même nombre non nul** :

a/b = (a × k) / (b × k) = (a ÷ k) / (b ÷ k)

## Simplifier une fraction
C’est diviser le haut et le bas par un diviseur commun.
24/36 : on divise par 12 → **2/3**.

Une fraction est **irréductible** quand plus aucune simplification n’est possible — c’est-à-dire quand numérateur et dénominateur n’ont plus de diviseur commun autre que 1.

> Simplifier n’est pas « enlever des chiffres » : on ne simplifie que par **multiplication ou division**, jamais en retirant un terme d’une somme.

## Réduire au même dénominateur
Pour comparer ou additionner, on cherche un dénominateur commun — le plus simple étant le produit des deux, le plus efficace étant leur **plus petit multiple commun**.
2/3 et 3/4 → 8/12 et 9/12.

## Reconnaître deux fractions égales
Deux fractions a/b et c/d sont égales si et seulement si **a × d = b × c** : c’est le **produit en croix**.
6/9 et 8/12 : 6 × 12 = 72 et 9 × 8 = 72 → elles sont égales.

## Les écritures particulières
- a/1 = a
- a/a = 1 (a non nul)
- 0/a = 0
- Une fraction dont le numérateur est un multiple du dénominateur est un **entier** : 20/5 = 4.`,
          },
          questions: [
            ['Que peut-on faire sans changer la valeur d’une fraction ?', ['Multiplier ou diviser numérateur et dénominateur par un même nombre non nul', 'Ajouter le même nombre en haut et en bas', 'Soustraire le même nombre en haut et en bas', 'Échanger numérateur et dénominateur'], 0, 'C’est la propriété fondamentale des fractions.'],
            ['Quelle est la forme simplifiée de 24/36 ?', ['2/3', '12/18', '4/6', '3/4'], 0, 'On divise les deux termes par 12.'],
            ['Qu’est-ce qu’une fraction irréductible ?', ['Une fraction qu’on ne peut plus simplifier', 'Une fraction inférieure à 1', 'Une fraction à dénominateur premier', 'Une fraction décimale'], 0, 'Numérateur et dénominateur n’ont plus de diviseur commun autre que 1.'],
            ['Comment vérifie-t-on que deux fractions sont égales ?', ['Par le produit en croix', 'En comparant les numérateurs', 'En additionnant les dénominateurs', 'En les arrondissant'], 0, 'a/b = c/d si et seulement si a × d = b × c.'],
            ['Les fractions 6/9 et 8/12 sont-elles égales ?', ['Oui, car 6 × 12 = 9 × 8', 'Non, car les numérateurs diffèrent', 'Non, car les dénominateurs diffèrent', 'On ne peut pas le savoir'], 0, 'Les deux produits en croix valent 72.'],
            ['Que vaut 0/a, pour a non nul ?', ['0', '1', 'a', 'Cela n’existe pas'], 0, 'En revanche a/0 n’a pas de sens.'],
            ['Quel dénominateur commun choisir pour 2/3 et 3/4 ?', ['12', '7', '6', '5'], 0, 'C’est le plus petit multiple commun de 3 et 4.'],
            ['On peut simplifier une fraction en retirant le même terme au numérateur et au dénominateur.', ['Vrai', 'Faux'], 1, 'On ne simplifie que par multiplication ou division.'],
          ],
        },
        {
          titre: 'Additionner, soustraire, multiplier et diviser les nombres rationnels',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Les quatre opérations sur les fractions',
            cours: `Un **nombre rationnel** est un nombre qui peut s’écrire sous forme de fraction a/b, avec a et b entiers et b non nul.

## Addition et soustraction
Elles exigent le **même dénominateur**.
1. Réduire au même dénominateur.
2. Additionner (ou soustraire) les **numérateurs**, en gardant le dénominateur commun.
3. Simplifier.

2/3 + 1/4 = 8/12 + 3/12 = **11/12**

> On n’additionne **jamais** les dénominateurs. 1/2 + 1/3 ne fait pas 2/5.

## Multiplication
C’est la plus simple : on multiplie les numérateurs entre eux et les dénominateurs entre eux, **sans chercher de dénominateur commun**.

3/5 × 2/7 = 6/35

Il est souvent plus rapide de **simplifier avant** de multiplier : 4/9 × 3/8 = (4 × 3)/(9 × 8), on simplifie par 4 et par 3 → **1/6**.

## Division
Diviser par une fraction, c’est **multiplier par son inverse**.

(2/3) ÷ (5/7) = 2/3 × 7/5 = **14/15**

L’**inverse** de a/b est b/a (a et b non nuls). Attention : l’inverse n’est pas l’opposé.

## Les signes
La règle des signes s’applique comme pour les entiers. Un signe « moins » peut se placer devant la fraction, au numérateur ou au dénominateur : −(3/4) = (−3)/4 = 3/(−4).

## Les priorités opératoires
1. les **parenthèses** ;
2. les **puissances** ;
3. les **multiplications et divisions**, de gauche à droite ;
4. les **additions et soustractions**, de gauche à droite.

Une barre de fraction joue le rôle d’une **parenthèse** : on calcule entièrement le numérateur et le dénominateur avant de diviser.`,
          },
          questions: [
            ['Que faut-il faire avant d’additionner deux fractions ?', ['Les réduire au même dénominateur', 'Les simplifier obligatoirement', 'Multiplier les dénominateurs entre eux', 'Les convertir en décimaux'], 0, 'On additionne ensuite les numérateurs seulement.'],
            ['Combien vaut 2/3 + 1/4 ?', ['11/12', '3/7', '2/12', '3/12'], 0, '8/12 + 3/12.'],
            ['Comment multiplie-t-on deux fractions ?', ['Numérateurs entre eux, dénominateurs entre eux', 'En cherchant un dénominateur commun', 'En multipliant en croix', 'En additionnant les numérateurs'], 0, 'Aucun dénominateur commun n’est nécessaire.'],
            ['Comment divise-t-on par une fraction ?', ['On multiplie par son inverse', 'On multiplie par son opposé', 'On divise les numérateurs entre eux', 'On soustrait les dénominateurs'], 0, '(2/3) ÷ (5/7) = 2/3 × 7/5.'],
            ['Quel est l’inverse de 3/5 ?', ['5/3', '−3/5', '−5/3', '3/5'], 0, 'L’opposé serait −3/5 : les deux notions diffèrent.'],
            ['Combien vaut 4/9 × 3/8 ?', ['1/6', '12/72', '7/17', '12/17'], 0, 'On simplifie par 4 et par 3 avant de multiplier.'],
            ['Quel rôle joue une barre de fraction dans un calcul ?', ['Celui d’une parenthèse', 'Celui d’un signe moins', 'Celui d’une puissance', 'Aucun rôle particulier'], 0, 'On calcule entièrement le numérateur et le dénominateur avant de diviser.'],
            ['Pour additionner deux fractions, on additionne aussi les dénominateurs.', ['Vrai', 'Faux'], 1, 'Le dénominateur commun reste inchangé.'],
          ],
        },
        {
          titre: 'Puissances et notations scientifiques',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Écrire court les nombres très grands et très petits',
            cours: `## La définition
Pour n entier positif, a^n est le produit de **n facteurs** égaux à a.
5³ = 5 × 5 × 5 = 125.

Conventions : **a¹ = a**, **a⁰ = 1** (a non nul), **a^(−n) = 1 / a^n**.

## Les règles de calcul
- a^m × a^n = **a^(m+n)**
- a^m ÷ a^n = **a^(m−n)**
- (a^m)^n = **a^(m×n)**
- (a × b)^n = **a^n × b^n**

Elles n’ont de sens qu’entre puissances de **même base**.

## Les puissances de 10
- 10³ = 1 000 (trois zéros)
- 10⁻³ = 0,001
- 10^n avec n positif : n zéros après le 1 ;
- 10^(−n) : le 1 se trouve au n-ième rang après la virgule.

Multiplier par 10^n **décale la virgule** de n rangs vers la droite ; par 10^(−n), de n rangs vers la gauche.

## L’écriture scientifique
Tout nombre s’écrit **a × 10^n** avec **1 ≤ a < 10** et n entier relatif.
- 45 300 = **4,53 × 10⁴**
- 0,00072 = **7,2 × 10⁻⁴**

Cette écriture est **unique**, ce qui permet de comparer deux nombres d’un coup d’œil : on regarde d’abord l’exposant, puis le facteur a.

## Les préfixes
kilo (10³), méga (10⁶), giga (10⁹), téra (10¹²) ; milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹).

> Un ordre de grandeur, c’est la puissance de 10 la plus proche : dire qu’une bactérie mesure « de l’ordre du micromètre » suffit souvent à raisonner.`,
          },
          questions: [
            ['Combien vaut 5³ ?', ['125', '15', '53', '25'], 0, 'Trois facteurs égaux à 5.'],
            ['Que vaut a⁰ pour a non nul ?', ['1', '0', 'a', 'Cela n’existe pas'], 0, 'C’est une convention cohérente avec la règle de la division.'],
            ['Que vaut 2⁵ × 2³ ?', ['2⁸', '2¹⁵', '4⁸', '2²'], 0, 'Même base : on additionne les exposants.'],
            ['Combien vaut 10⁻³ ?', ['0,001', '−1 000', '−0,001', '0,0001'], 0, 'L’exposant négatif signifie que l’on divise.'],
            ['Quelle est l’écriture scientifique de 45 300 ?', ['4,53 × 10⁴', '45,3 × 10³', '4,53 × 10⁵', '0,453 × 10⁵'], 0, 'Le premier facteur doit être compris entre 1 et 10.'],
            ['Quelle condition porte sur a dans l’écriture a × 10^n ?', ['1 ≤ a < 10', '0 < a < 1', 'a doit être entier', 'a doit être positif et supérieur à 10'], 0, 'C’est ce qui rend l’écriture unique.'],
            ['Que fait la multiplication par 10⁻² ?', ['Elle décale la virgule de deux rangs vers la gauche', 'Elle décale la virgule de deux rangs vers la droite', 'Elle rend le nombre négatif', 'Elle divise le nombre par 2'], 0, 'Multiplier par 10² la décalerait vers la droite.'],
            ['La règle a^m × a^n = a^(m+n) s’applique aussi à des bases différentes.', ['Vrai', 'Faux'], 1, 'Elle exige la même base.'],
          ],
        },
        {
          titre: 'Les racines carrées',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Le nombre positif dont le carré vaut a',
            cours: `## La définition
Pour **a positif**, la **racine carrée** de a, notée **√a**, est le nombre **positif** dont le carré vaut a.

√9 = 3, parce que 3² = 9 et que 3 est positif.

> **La racine carrée d’un nombre négatif n’existe pas** en 4e : aucun carré n’est négatif.

## Les conséquences immédiates
- (√a)² = **a**
- √(a²) = **a**, si a est positif
- √0 = 0 et √1 = 1

## Les carrés parfaits à connaître
1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225 — soit les carrés de 1 à 15.

## Les règles de calcul
- **√a × √b = √(a × b)**
- **√a ÷ √b = √(a ÷ b)** (b non nul)

⚠️ En revanche, **√(a + b) n’est PAS égal à √a + √b**. √(9 + 16) = √25 = 5, tandis que √9 + √16 = 3 + 4 = 7. C’est l’erreur la plus fréquente du chapitre.

## Simplifier une racine
On cherche le plus grand **carré parfait** contenu dans le nombre :
√50 = √(25 × 2) = √25 × √2 = **5√2**.

## Les valeurs approchées
√2 ≈ 1,414 ; √3 ≈ 1,732 ; √5 ≈ 2,236. La calculatrice donne une **valeur approchée** : √2 est un nombre **irrationnel**, sa suite de décimales est infinie et sans période.

## Où elles servent
Dans le **théorème de Pythagore**, pour retrouver une longueur à partir d’un carré ; dans le calcul du **côté d’un carré** à partir de son aire.`,
          },
          questions: [
            ['Qu’est-ce que la racine carrée de a ?', ['Le nombre positif dont le carré vaut a', 'Le nombre qui multiplié par 2 donne a', 'La moitié de a', 'Le carré de a'], 0, 'Elle n’est définie que pour a positif.'],
            ['Combien vaut √49 ?', ['7', '24,5', '±7', '9'], 0, 'La racine carrée désigne le nombre positif.'],
            ['La racine carrée d’un nombre négatif existe-t-elle ?', ['Non, aucun carré n’est négatif', 'Oui, elle est négative', 'Oui, elle vaut zéro', 'Seulement pour −1'], 0, 'C’est une impossibilité au collège.'],
            ['Que vaut √a × √b ?', ['√(a × b)', '√(a + b)', 'a × b', '√a + √b'], 0, 'La règle vaut aussi pour la division.'],
            ['Que vaut √(9 + 16) ?', ['5', '7', '25', '12'], 0, '√25 = 5 ; √9 + √16 vaudrait 7, ce qui montre que la racine ne se distribue pas sur une somme.'],
            ['Quelle est la forme simplifiée de √50 ?', ['5√2', '25√2', '2√5', '10√5'], 0, '50 = 25 × 2, et 25 est un carré parfait.'],
            ['Que vaut (√7)² ?', ['7', '√7', '49', '14'], 0, 'Élever au carré annule la racine.'],
            ['La calculatrice donne la valeur exacte de √2.', ['Vrai', 'Faux'], 1, '√2 est irrationnel : ses décimales sont infinies et sans période.'],
          ],
        },
        {
          titre: 'Les nombres premiers',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Les briques de tous les entiers',
            cours: `Un **nombre premier** est un entier **supérieur à 1** qui n’admet **que deux diviseurs** : 1 et lui-même.

## Les premiers d’entre eux
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47…
- **2 est le seul nombre premier pair** ;
- **1 n’est pas premier** : il n’a qu’un seul diviseur ;
- il en existe une **infinité** — Euclide l’a démontré il y a plus de deux mille ans.

## Comment tester si un nombre est premier
On essaie de le diviser par les nombres premiers successifs — 2, 3, 5, 7, 11… — et on peut s’arrêter dès que le **carré** du diviseur testé dépasse le nombre.

97 : il n’est divisible ni par 2, ni par 3, ni par 5, ni par 7 ; 11² = 121 > 97, donc **97 est premier**.

## La décomposition en facteurs premiers
Tout entier supérieur à 1 s’écrit d’**une seule façon** comme produit de nombres premiers (à l’ordre près).

360 = 2 × 180 = 2 × 2 × 90 = 2 × 2 × 2 × 45 = **2³ × 3² × 5**

Méthode : on divise successivement par le plus petit nombre premier possible, jusqu’à obtenir 1.

## À quoi ça sert
- **Simplifier une fraction** : on décompose numérateur et dénominateur, on barre les facteurs communs.
- Trouver **tous les diviseurs** d’un nombre.
- Reconnaître deux nombres **premiers entre eux** : ils n’ont aucun facteur premier commun, et une fraction formée de deux tels nombres est déjà irréductible.

> Les nombres premiers sont aux entiers ce que les atomes sont à la matière : les briques dont tout le reste est fait.`,
          },
          questions: [
            ['Qu’est-ce qu’un nombre premier ?', ['Un entier supérieur à 1 qui n’a que deux diviseurs', 'Un entier impair', 'Le premier entier d’une liste', 'Un entier divisible par 2'], 0, '1 et lui-même.'],
            ['Pourquoi 1 n’est-il pas premier ?', ['Il n’a qu’un seul diviseur', 'Il est trop petit', 'Il est pair', 'Il est divisible par 2'], 0, 'La définition exige exactement deux diviseurs.'],
            ['Quel est le seul nombre premier pair ?', ['2', '4', '0', 'Il n’y en a pas'], 0, 'Tout autre nombre pair est divisible par 2.'],
            ['Combien existe-t-il de nombres premiers ?', ['Une infinité', 'Exactement 100', 'Autant que d’entiers pairs, soit un nombre fini', 'Moins de 1 000'], 0, 'Euclide l’a démontré il y a plus de deux mille ans.'],
            ['Quelle est la décomposition en facteurs premiers de 360 ?', ['2³ × 3² × 5', '2² × 3² × 5', '2³ × 3 × 5²', '6 × 60'], 0, 'On divise successivement par le plus petit facteur premier possible.'],
            ['Jusqu’où faut-il tester les diviseurs pour savoir si 97 est premier ?', ['Jusqu’à ce que le carré du diviseur dépasse 97', 'Jusqu’à 96', 'Jusqu’à 50', 'Jusqu’à 97 lui-même'], 0, '11² = 121 > 97 : on peut s’arrêter là.'],
            ['Que signifie « deux nombres premiers entre eux » ?', ['Ils n’ont aucun facteur premier commun', 'Ils sont tous deux des nombres premiers', 'Ils se suivent dans la liste des premiers', 'Leur somme est un nombre premier'], 0, 'La fraction qu’ils forment est déjà irréductible.'],
            ['La décomposition en facteurs premiers d’un entier peut s’écrire de plusieurs façons.', ['Vrai', 'Faux'], 1, 'Elle est unique, à l’ordre des facteurs près.'],
          ],
        },
        {
          titre: 'Utiliser le langage littéral : la distributivité',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Développer et factoriser',
            cours: `Le **calcul littéral** manipule des lettres qui représentent des nombres. Deux gestes inverses le structurent.

## Développer
Transformer un **produit** en **somme**.

**Simple distributivité** : k(a + b) = **ka + kb**
3(x + 5) = 3x + 15

**Double distributivité** : (a + b)(c + d) = **ac + ad + bc + bd**
(x + 2)(x + 3) = x² + 3x + 2x + 6 = **x² + 5x + 6**

⚠️ Le signe **moins** devant une parenthèse change **tous** les signes à l’intérieur : −(x − 4) = −x + 4.

## Factoriser
Transformer une **somme** en **produit**, en repérant un **facteur commun**.
- 5x + 15 = **5(x + 3)**
- 7a − 7b = **7(a − b)**
- x² + 3x = **x(x + 3)**
- (x + 1)(x + 2) + (x + 1)(x − 5) = **(x + 1)(2x − 3)** — ici le facteur commun est une parenthèse entière.

## Réduire
Regrouper les termes de même nature : 3x + 5 + 2x − 1 = **5x + 4**.
Attention : 3x et 3x² ne se regroupent **jamais** — ce ne sont pas les mêmes « objets ».

## Tester une égalité
Une égalité littérale est vraie **pour toutes** les valeurs si les deux membres, développés et réduits, sont identiques. Sinon, il suffit d’**un seul contre-exemple** pour la réfuter.

## Les conventions d’écriture
- On n’écrit pas le signe × devant une lettre : 3 × x s’écrit **3x** ;
- 1 × x s’écrit **x**, et x × x s’écrit **x²** ;
- le coefficient se place **avant** la lettre.

> Développer et factoriser ne changent jamais la **valeur** d’une expression : ce sont deux écritures du même nombre, choisies selon ce qu’on veut en faire.`,
          },
          questions: [
            ['Que donne le développement de 3(x + 5) ?', ['3x + 15', '3x + 5', 'x + 15', '3x × 15'], 0, 'La simple distributivité multiplie chaque terme de la parenthèse.'],
            ['Que donne le développement de (x + 2)(x + 3) ?', ['x² + 5x + 6', 'x² + 6', 'x² + 5x', '2x + 5'], 0, 'Double distributivité, puis réduction.'],
            ['Que devient −(x − 4) ?', ['−x + 4', '−x − 4', 'x − 4', 'x + 4'], 0, 'Le signe moins change tous les signes de la parenthèse.'],
            ['Quelle est la forme factorisée de 5x + 15 ?', ['5(x + 3)', '5x(1 + 3)', '(5 + x)(5 + 15)', '5 + 3x'], 0, 'On met en facteur le nombre commun aux deux termes.'],
            ['Quelle est la forme factorisée de x² + 3x ?', ['x(x + 3)', '3x(x + 1)', '(x + 3)²', 'x²(1 + 3)'], 0, 'Le facteur commun est x.'],
            ['Comment réduire 3x + 5 + 2x − 1 ?', ['5x + 4', '5x + 6', '6x + 4', '10x'], 0, 'On regroupe les termes en x d’un côté, les nombres de l’autre.'],
            ['Que suffit-il pour prouver qu’une égalité littérale est fausse ?', ['Un seul contre-exemple', 'Trois exemples qui échouent', 'Un développement complet', 'Une factorisation'], 0, 'Pour la prouver vraie, en revanche, il faut développer et réduire les deux membres.'],
            ['Les termes 3x et 3x² peuvent être regroupés.', ['Vrai', 'Faux'], 1, 'Ce ne sont pas des termes de même nature.'],
          ],
        },
        {
          titre: 'Égalité et équation',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Trouver la valeur qui rend l’égalité vraie',
            cours: `## Vocabulaire
Une **équation** est une égalité contenant une **inconnue**, le plus souvent notée x.
- **Résoudre** une équation, c’est trouver **toutes** les valeurs de l’inconnue qui rendent l’égalité vraie ;
- ces valeurs sont les **solutions** ;
- le **membre de gauche** et le **membre de droite** encadrent le signe =.

## Les deux règles fondamentales
On ne change pas les solutions d’une équation :
1. en **ajoutant** ou en **soustrayant** un même nombre aux deux membres ;
2. en **multipliant** ou en **divisant** les deux membres par un même nombre **non nul**.

> Ce qu’on fait d’un côté, on le fait **de l’autre**. C’est la seule règle du chapitre, et toutes les autres en découlent.

## La méthode
1. Développer et réduire chaque membre.
2. Regrouper les termes en x d’un côté, les nombres de l’autre.
3. Diviser par le coefficient de x.
4. **Vérifier** en remplaçant dans l’équation de départ.

5x − 3 = 2x + 9
→ 5x − 2x = 9 + 3
→ 3x = 12
→ **x = 4**
Vérification : 5 × 4 − 3 = 17 et 2 × 4 + 9 = 17. ✔

## L’équation produit nul
Si **A × B = 0**, alors **A = 0 ou B = 0**.
(x − 2)(x + 5) = 0 a donc pour solutions **2** et **−5**.

## Les cas particuliers
- **0x = 0** : tous les nombres sont solutions ;
- **0x = 7** : aucune solution.

## Mettre un problème en équation
1. Nommer l’inconnue et dire ce qu’elle représente ;
2. traduire l’énoncé par une égalité ;
3. résoudre ;
4. **conclure par une phrase** — la solution de l’équation n’est pas encore la réponse au problème.`,
          },
          questions: [
            ['Qu’est-ce que résoudre une équation ?', ['Trouver toutes les valeurs de l’inconnue qui rendent l’égalité vraie', 'Développer les deux membres', 'Simplifier l’écriture', 'Vérifier une égalité connue'], 0, 'Ces valeurs sont les solutions.'],
            ['Que peut-on faire sans changer les solutions d’une équation ?', ['Ajouter un même nombre aux deux membres', 'Ajouter un nombre à un seul membre', 'Multiplier un seul membre par 2', 'Supprimer un terme au choix'], 0, 'Ce qu’on fait d’un côté, on le fait de l’autre.'],
            ['Quelle est la solution de 5x − 3 = 2x + 9 ?', ['x = 4', 'x = 2', 'x = 12', 'x = 6'], 0, '3x = 12 après regroupement.'],
            ['Quelles sont les solutions de (x − 2)(x + 5) = 0 ?', ['2 et −5', '−2 et 5', '2 et 5', '0 seulement'], 0, 'Un produit est nul si l’un de ses facteurs est nul.'],
            ['Combien de solutions a l’équation 0x = 7 ?', ['Aucune', 'Une seule', 'Deux', 'Une infinité'], 0, 'Aucun nombre multiplié par 0 ne donne 7.'],
            ['Combien de solutions a l’équation 0x = 0 ?', ['Une infinité', 'Aucune', 'Une seule', 'Deux'], 0, 'Tous les nombres conviennent.'],
            ['Par quoi doit se terminer la résolution d’un problème mis en équation ?', ['Une phrase de conclusion répondant à la question posée', 'Le calcul de x', 'La vérification seule', 'Le développement de l’équation'], 0, 'La solution de l’équation n’est pas encore la réponse au problème.'],
            ['On peut diviser les deux membres d’une équation par n’importe quel nombre.', ['Vrai', 'Faux'], 1, 'Le nombre doit être non nul.'],
          ],
        },
        {
          titre: 'Modéliser une situation',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Traduire un problème en langage mathématique',
            cours: `**Modéliser**, c’est traduire une situation concrète en objets mathématiques — une expression, une équation, un tableau, un graphique — pour la résoudre.

## Les étapes
1. **Lire et reformuler** : quelle est la question posée ? quelles données sont fournies ? lesquelles manquent ?
2. **Choisir l’inconnue** et écrire ce qu’elle représente : « Soit x le nombre de… ». C’est l’étape la plus souvent bâclée, et celle qui décide de tout.
3. **Traduire** l’énoncé en expressions littérales.
4. **Résoudre**.
5. **Vérifier la vraisemblance** : un âge négatif, un nombre de personnes décimal, une longueur nulle signalent une erreur.
6. **Conclure** par une phrase.

## Les traductions courantes
| Énoncé | Traduction |
|---|---|
| la somme de x et 5 | x + 5 |
| le double de x | 2x |
| le triple de x, augmenté de 4 | 3x + 4 |
| x diminué de 7 | x − 7 |
| la moitié de x | x/2 |
| le carré de x | x² |
| trois nombres entiers consécutifs | x, x + 1, x + 2 |
| un prix après une hausse de 20 % | 1,2 × p |

## Le programme de calcul
Un énoncé qui enchaîne des opérations (« choisis un nombre, ajoute 3, multiplie par 2… ») se traduit par une **expression littérale**, qu’on **développe et réduit** pour découvrir ce que le programme fait vraiment — c’est ainsi qu’on démontre une conjecture du type « on retombe toujours sur le nombre de départ ».

## Choisir le bon modèle
- Une situation de **proportionnalité** → un tableau et un coefficient.
- Une **égalité à trouver** → une équation.
- Une **évolution** → un tableau de valeurs ou un graphique.
- Un **partage** ou une **comparaison de tarifs** → une équation, puis une discussion selon les valeurs.

> Modéliser ne consiste pas à trouver le résultat, mais à écrire correctement le problème. Une fois l’équation posée, le reste est de la technique.`,
          },
          questions: [
            ['Que signifie modéliser une situation ?', ['La traduire en objets mathématiques pour la résoudre', 'La dessiner à l’échelle', 'La résumer en une phrase', 'La comparer à une autre situation'], 0, 'Expression, équation, tableau ou graphique selon le cas.'],
            ['Quelle étape décide de la réussite de la mise en équation ?', ['Le choix de l’inconnue et sa définition précise', 'Le calcul final', 'La vérification', 'La conclusion'], 0, '« Soit x le nombre de… » : c’est l’étape la plus souvent bâclée.'],
            ['Comment traduit-on « le triple de x, augmenté de 4 » ?', ['3x + 4', '3(x + 4)', 'x³ + 4', '3 + 4x'], 0, 'Le triple porte sur x seul.'],
            ['Comment note-t-on trois entiers consécutifs ?', ['x, x + 1, x + 2', 'x, 2x, 3x', 'x, x + 2, x + 4', 'x, x − 1, x − 2 uniquement'], 0, 'Chaque entier suit immédiatement le précédent.'],
            ['Comment traduit-on un prix p après une hausse de 20 % ?', ['1,2 × p', '0,2 × p', 'p + 20', '0,8 × p'], 0, 'Une baisse de 20 % donnerait 0,8 × p.'],
            ['À quoi sert de développer l’expression d’un programme de calcul ?', ['À découvrir ce que le programme fait vraiment', 'À vérifier les calculs numériques', 'À trouver l’inconnue', 'À changer le programme'], 0, 'C’est ainsi qu’on démontre une conjecture.'],
            ['Que faut-il vérifier avant de conclure ?', ['La vraisemblance du résultat dans le contexte', 'La longueur de la rédaction', 'Le nombre d’étapes', 'La présence d’un schéma'], 0, 'Un âge négatif ou un nombre de personnes décimal signale une erreur.'],
            ['Modéliser consiste d’abord à trouver le résultat.', ['Vrai', 'Faux'], 1, 'Il s’agit d’abord d’écrire correctement le problème ; le calcul vient ensuite.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Organisation et gestion des données
        // ===================================================================
        {
          titre: 'Statistiques',
          axe: 'Organisation et gestion des données',
          lecon: {
            titre: 'Lire, résumer et représenter une série',
            cours: `## Le vocabulaire
- La **population** : l’ensemble étudié (les élèves d’une classe).
- L’**individu** : un élément de cette population.
- Le **caractère** : ce qu’on observe (la taille, la couleur des yeux).
  - **quantitatif** s’il se mesure (taille, note) ;
  - **qualitatif** sinon (sport pratiqué, couleur).
- L’**effectif** d’une valeur : le nombre d’individus qui la portent.
- L’**effectif total** : la somme de tous les effectifs.
- La **fréquence** : effectif ÷ effectif total. Elle s’exprime en décimal ou en pourcentage, et la somme des fréquences vaut toujours **1** (ou 100 %).

## Les indicateurs
- L’**étendue** : plus grande valeur − plus petite valeur. Elle mesure la **dispersion**.
- La **moyenne** : somme des valeurs ÷ effectif total.
- La **médiane** : la valeur qui partage la série **ordonnée** en deux groupes de même effectif.

## Les représentations
- Le **diagramme en bâtons** : pour un caractère quantitatif discret.
- Le **diagramme circulaire** : pour des parts d’un tout. L’angle d’un secteur se calcule par **fréquence × 360°**.
- L’**histogramme** : pour des données regroupées en classes.
- La **courbe** : pour une évolution dans le temps.

> Le choix de la représentation n’est jamais neutre : une courbe raconte une évolution, un diagramme circulaire une répartition. Se tromper de graphique, c’est raconter autre chose.

## Les pièges de lecture
Un axe qui ne part pas de zéro, une échelle irrégulière ou des secteurs en trois dimensions déforment la perception sans falsifier aucun chiffre. Toujours lire les **axes** et l’**échelle** avant les barres.`,
          },
          questions: [
            ['Qu’est-ce que l’effectif d’une valeur ?', ['Le nombre d’individus qui portent cette valeur', 'La somme de toutes les valeurs', 'La valeur la plus fréquente', 'L’écart entre deux valeurs'], 0, 'L’effectif total est la somme de tous les effectifs.'],
            ['Comment calcule-t-on une fréquence ?', ['Effectif de la valeur ÷ effectif total', 'Effectif total ÷ effectif de la valeur', 'Valeur × effectif', 'Somme des valeurs ÷ 100'], 0, 'La somme des fréquences vaut 1, soit 100 %.'],
            ['Qu’est-ce que l’étendue d’une série ?', ['La différence entre la plus grande et la plus petite valeur', 'La valeur du milieu', 'La moyenne des valeurs', 'Le nombre de valeurs'], 0, 'Elle mesure la dispersion.'],
            ['Comment calcule-t-on l’angle d’un secteur dans un diagramme circulaire ?', ['Fréquence × 360°', 'Effectif × 360°', 'Fréquence ÷ 360°', 'Effectif total ÷ 360°'], 0, 'La somme des angles fait bien 360°.'],
            ['Quel caractère est qualitatif ?', ['Le sport pratiqué', 'La taille', 'La note obtenue', 'L’âge'], 0, 'Un caractère quantitatif se mesure.'],
            ['Quelle représentation convient à une évolution dans le temps ?', ['La courbe', 'Le diagramme circulaire', 'Le diagramme en bâtons', 'Le tableau d’effectifs seul'], 0, 'Le diagramme circulaire montre une répartition, pas une évolution.'],
            ['Que faut-il lire en premier sur un graphique ?', ['Les axes et l’échelle', 'La hauteur des barres', 'Le titre seulement', 'La légende des couleurs'], 0, 'Un axe qui ne part pas de zéro déforme la perception.'],
            ['La somme des fréquences d’une série peut dépasser 100 %.', ['Vrai', 'Faux'], 1, 'Elle vaut toujours exactement 1, soit 100 %.'],
          ],
        },
        {
          titre: 'Les probabilités',
          axe: 'Organisation et gestion des données',
          lecon: {
            titre: 'Mesurer une chance entre 0 et 1',
            cours: `## Le vocabulaire
Une **expérience aléatoire** a plusieurs **issues** possibles, et on ne peut pas prévoir laquelle se produira.
Un **événement** est un ensemble d’issues : « obtenir un nombre pair » avec un dé.

## La probabilité
C’est un nombre compris entre **0** et **1** :
- **0** = événement **impossible** ;
- **1** = événement **certain** ;
- plus la probabilité est proche de 1, plus l’événement est probable.

## Le calcul en situation d’équiprobabilité
Quand toutes les issues ont la même chance :

**P(A) = nombre d’issues favorables ÷ nombre d’issues possibles**

Avec un dé à six faces : P(« nombre pair ») = 3/6 = **1/2**.
Dans une urne de 5 boules rouges et 3 bleues : P(« rouge ») = **5/8**.

## L’événement contraire
**P(non A) = 1 − P(A)**.
C’est souvent le chemin le plus court : « au moins un » se calcule presque toujours par le contraire, « aucun ».

## Événements incompatibles
Deux événements qui ne peuvent pas se produire en même temps. Alors P(A ou B) = P(A) + P(B).

## Les expériences à deux épreuves
On les représente par un **arbre** ou un **tableau à double entrée** :
- on **multiplie** les probabilités le long d’une branche ;
- on **additionne** les branches qui conviennent.

## Ce que la probabilité ne dit pas
Elle ne prédit **pas** le prochain tirage. Une pièce tombée cinq fois sur pile reste à 1/2 au sixième lancer : elle n’a pas de mémoire.

> La **loi des grands nombres** dit seulement ceci : plus on répète l’expérience, plus la **fréquence observée** se rapproche de la probabilité théorique.`,
          },
          questions: [
            ['Entre quelles valeurs une probabilité est-elle comprise ?', ['Entre 0 et 1', 'Entre −1 et 1', 'Entre 0 et 100', 'Entre 1 et 6'], 0, '0 = impossible, 1 = certain.'],
            ['Comment calcule-t-on une probabilité en situation d’équiprobabilité ?', ['Issues favorables ÷ issues possibles', 'Issues possibles ÷ issues favorables', 'Issues favorables × nombre d’essais', 'Nombre d’essais ÷ 100'], 0, 'Toutes les issues doivent avoir la même chance.'],
            ['Dans une urne de 5 boules rouges et 3 bleues, quelle est la probabilité de tirer une rouge ?', ['5/8', '5/3', '3/8', '1/2'], 0, 'Cinq issues favorables sur huit possibles.'],
            ['Comment calcule-t-on la probabilité de l’événement contraire ?', ['1 − P(A)', 'P(A) − 1', '1 ÷ P(A)', '100 − P(A)'], 0, 'Utile pour les événements « au moins un ».'],
            ['Que fait-on le long d’une branche d’arbre de probabilités ?', ['On multiplie les probabilités', 'On les additionne', 'On les soustrait', 'On prend la plus grande'], 0, 'On additionne ensuite les branches favorables.'],
            ['Que sont deux événements incompatibles ?', ['Deux événements qui ne peuvent pas se produire en même temps', 'Deux événements de même probabilité', 'Deux événements impossibles', 'Deux événements contraires uniquement'], 0, 'Alors P(A ou B) = P(A) + P(B).'],
            ['Que dit la loi des grands nombres ?', ['La fréquence observée se rapproche de la probabilité quand on répète beaucoup', 'Le prochain résultat devient prévisible', 'Toutes les issues sortent le même nombre de fois exactement', 'La probabilité augmente avec le nombre d’essais'], 0, 'Elle ne dit rien d’un tirage isolé.'],
            ['Après cinq « pile » consécutifs, « face » devient plus probable.', ['Vrai', 'Faux'], 1, 'La pièce n’a pas de mémoire : la probabilité reste 1/2.'],
          ],
        },
        {
          titre: 'La proportionnalité',
          axe: 'Organisation et gestion des données',
          lecon: {
            titre: 'Reconnaître, calculer, représenter',
            cours: `Deux grandeurs sont **proportionnelles** quand on passe de l’une à l’autre en multipliant **toujours par le même nombre**, appelé **coefficient de proportionnalité**.

## Reconnaître une situation de proportionnalité
- **Dans un tableau** : le quotient de chaque valeur de la deuxième ligne par celle de la première est **constant**.
- **Graphiquement** : les points sont **alignés** avec l’**origine** du repère. Une droite qui ne passe pas par (0 ; 0) ne traduit **pas** une proportionnalité.
- **Concrètement** : si l’une double, l’autre double ; si l’une est nulle, l’autre l’est aussi.

## Les contre-exemples classiques
- Le **périmètre** d’un carré est proportionnel à son côté ; son **aire** ne l’est pas (elle est en côté²).
- L’**âge** de deux personnes n’est pas proportionnel : l’écart reste constant, pas le rapport.
- Un tarif avec **abonnement fixe** n’est pas proportionnel.

## Les méthodes de calcul
**1. Le coefficient** : on le calcule une fois, on l’applique partout.
**2. Le passage à l’unité** : on cherche la valeur pour 1, puis on multiplie.
**3. Le produit en croix** : dans un tableau de proportionnalité, a/b = c/d donne **a × d = b × c**. C’est la **quatrième proportionnelle**.
**4. Les propriétés d’additivité et de linéarité** : si 3 objets coûtent 12 € et 5 objets 20 €, alors 8 objets coûtent 32 €.

## Où on la retrouve
Échelles, vitesses, pourcentages, recettes de cuisine, agrandissements-réductions, conversions d’unités, Thalès.

> La question à se poser avant tout calcul : **est-ce vraiment proportionnel ?** Beaucoup d’erreurs viennent d’un produit en croix appliqué à une situation qui ne s’y prête pas.`,
          },
          questions: [
            ['Comment reconnaît-on une proportionnalité dans un tableau ?', ['Le quotient entre les deux lignes est constant', 'La différence entre les deux lignes est constante', 'La somme des lignes est constante', 'Les valeurs sont croissantes'], 0, 'Ce quotient est le coefficient de proportionnalité.'],
            ['Comment reconnaît-on une proportionnalité sur un graphique ?', ['Les points sont alignés avec l’origine', 'Les points sont alignés, où que passe la droite', 'La courbe est croissante', 'La courbe est une parabole'], 0, 'Le passage par (0 ; 0) est indispensable.'],
            ['L’aire d’un carré est-elle proportionnelle à son côté ?', ['Non, elle dépend du carré du côté', 'Oui, avec un coefficient 4', 'Oui, avec un coefficient 2', 'Oui, comme le périmètre'], 0, 'Le périmètre, lui, est bien proportionnel au côté.'],
            ['Qu’est-ce que la quatrième proportionnelle ?', ['La valeur manquante d’un tableau de proportionnalité', 'Le quatrième terme d’une suite', 'Le coefficient de proportionnalité', 'La moyenne des trois autres valeurs'], 0, 'On la calcule par produit en croix.'],
            ['Si 3 objets coûtent 12 € et 5 objets 20 €, combien coûtent 8 objets ?', ['32 €', '30 €', '28 €', '35 €'], 0, 'Propriété d’additivité : 12 + 20.'],
            ['Un tarif comprenant un abonnement fixe est-il proportionnel ?', ['Non, à cause de la part fixe', 'Oui, toujours', 'Oui, si l’abonnement est faible', 'Cela dépend du nombre de mois'], 0, 'La droite ne passe pas par l’origine.'],
            ['Que permet le passage à l’unité ?', ['Trouver la valeur pour 1, puis multiplier', 'Diviser par le coefficient', 'Comparer deux tableaux', 'Vérifier l’alignement des points'], 0, 'C’est l’une des méthodes les plus sûres.'],
            ['Le produit en croix s’applique à n’importe quel tableau de valeurs.', ['Vrai', 'Faux'], 1, 'Il suppose que la situation soit proportionnelle.'],
          ],
        },
        {
          titre: 'Les pourcentages',
          axe: 'Organisation et gestion des données',
          lecon: {
            titre: 'Appliquer, augmenter, diminuer, retrouver',
            cours: `Un **pourcentage** est une proportion rapportée à **100**. « 25 % » signifie 25 pour 100, soit la fraction 25/100 = 0,25.

## Appliquer un pourcentage
Prendre **t %** d’une quantité, c’est la multiplier par **t/100**.
30 % de 80 € = 80 × 0,3 = **24 €**.

## Augmenter ou diminuer
- **Augmenter de t %** : multiplier par **(1 + t/100)**. +15 % → × **1,15**.
- **Diminuer de t %** : multiplier par **(1 − t/100)**. −15 % → × **0,85**.

Le nombre par lequel on multiplie s’appelle le **coefficient multiplicateur**.

## Enchaîner deux évolutions
On **multiplie** les coefficients — on ne les additionne jamais.
- +10 % puis +10 % : 1,1 × 1,1 = 1,21, soit **+21 %**.
- −20 % puis +20 % : 0,8 × 1,2 = 0,96, soit **−4 %** : on ne revient pas au prix de départ.

## Retrouver la quantité totale
Si 24 € représentent 30 % du prix, alors le prix est **24 ÷ 0,3 = 80 €**. On **divise** par le coefficient au lieu de multiplier.

## Calculer un pourcentage
**pourcentage = (partie ÷ tout) × 100**.
15 élèves sur 25 → (15 ÷ 25) × 100 = **60 %**.

## Le taux d’évolution
**(valeur finale − valeur initiale) ÷ valeur initiale × 100**.
De 50 € à 60 € : (60 − 50) ÷ 50 × 100 = **+20 %**.

> Un pourcentage ne veut rien dire sans savoir **de quoi** il est le pourcentage. « +50 % » sur un petit nombre peut être moins qu’« +5 % » sur un grand.`,
          },
          questions: [
            ['Que signifie 25 % ?', ['25 pour 100, soit 0,25', '25 unités', '25 fois plus', 'Un quart de 25'], 0, 'C’est une proportion rapportée à 100.'],
            ['Combien font 30 % de 80 € ?', ['24 €', '30 €', '26,67 €', '2,4 €'], 0, '80 × 0,3.'],
            ['Par quel coefficient multiplie-t-on pour augmenter de 15 % ?', ['1,15', '0,15', '15', '0,85'], 0, 'Diminuer de 15 % reviendrait à multiplier par 0,85.'],
            ['Une hausse de 10 % suivie d’une autre hausse de 10 % correspond à quelle hausse totale ?', ['+21 %', '+20 %', '+11 %', '+100 %'], 0, '1,1 × 1,1 = 1,21 : les coefficients se multiplient.'],
            ['Une baisse de 20 % suivie d’une hausse de 20 % donne quel résultat ?', ['Une baisse de 4 %', 'Un retour au prix initial', 'Une hausse de 4 %', 'Une baisse de 40 %'], 0, '0,8 × 1,2 = 0,96.'],
            ['Si 24 € représentent 30 % d’un prix, quel est ce prix ?', ['80 €', '72 €', '7,2 €', '54 €'], 0, 'On divise par le coefficient : 24 ÷ 0,3.'],
            ['Comment calcule-t-on le taux d’évolution de 50 € à 60 € ?', ['(60 − 50) ÷ 50 × 100 = +20 %', '(60 − 50) ÷ 60 × 100', '60 ÷ 50 = 1,2 %', '60 − 50 = 10 %'], 0, 'On rapporte l’écart à la valeur initiale.'],
            ['Deux pourcentages successifs s’additionnent.', ['Vrai', 'Faux'], 1, 'Leurs coefficients multiplicateurs se multiplient.'],
          ],
        },
        {
          titre: 'Dépendance de deux grandeurs',
          axe: 'Organisation et gestion des données',
          lecon: {
            titre: 'Quand une grandeur en commande une autre',
            cours: `Deux grandeurs sont **dépendantes** quand la valeur de l’une **détermine** celle de l’autre. Le prix payé dépend de la quantité achetée ; la distance parcourue dépend de la durée du trajet.

## Vocabulaire
- La grandeur qu’on choisit est la **variable** ;
- celle qui en découle est la grandeur **dépendante** ;
- à chaque valeur de la variable correspond **une seule** valeur de la grandeur dépendante — c’est la première approche de la notion de **fonction**, formalisée en 3e.

## Trois façons de décrire la dépendance
**1. Une formule** : P = 2,50 × n (prix de n croissants à 2,50 €).
**2. Un tableau de valeurs** : la première ligne donne la variable, la seconde la grandeur dépendante.
**3. Un graphique** : la **variable en abscisse**, la grandeur dépendante en **ordonnée**.

## Lire un graphique
- Pour une valeur donnée de x, on monte jusqu’à la courbe puis on lit en ordonnée ;
- pour retrouver x à partir d’une ordonnée, on fait le chemin inverse ;
- une courbe **croissante** signifie que la grandeur augmente avec la variable ; **décroissante**, l’inverse ; un **palier** signifie qu’elle ne change pas.

## Dépendance n’est pas proportionnalité
- Le prix d’un abonnement à 10 € par mois **plus** 5 € de frais fixes dépend du nombre de mois, sans être proportionnel.
- L’aire d’un disque dépend du rayon, mais en R² : la courbe n’est pas une droite.

> Toute proportionnalité est une dépendance ; l’inverse est faux. Le test reste le même : **la représentation passe-t-elle par l’origine en ligne droite ?**

## Utiliser un tableur
Une colonne pour la variable, une colonne de formule pour la grandeur dépendante, et un graphique construit sur les deux : c’est la manière la plus rapide d’explorer une dépendance et d’en lire les valeurs remarquables.`,
          },
          questions: [
            ['Que signifie que deux grandeurs sont dépendantes ?', ['La valeur de l’une détermine celle de l’autre', 'Elles sont toujours égales', 'Elles varient toujours dans le même sens', 'Elles sont proportionnelles'], 0, 'Le prix payé dépend de la quantité achetée.'],
            ['Où place-t-on la variable sur un graphique ?', ['En abscisse', 'En ordonnée', 'À l’origine', 'Sur la diagonale'], 0, 'La grandeur dépendante se lit en ordonnée.'],
            ['Combien de valeurs de la grandeur dépendante correspondent à une valeur de la variable ?', ['Une seule', 'Autant qu’on veut', 'Deux au maximum', 'Aucune'], 0, 'C’est la première approche de la notion de fonction.'],
            ['Que signifie un palier sur une courbe ?', ['La grandeur dépendante ne change pas', 'La grandeur augmente brusquement', 'La courbe change de sens', 'Les données sont manquantes'], 0, 'Une courbe croissante signifierait une augmentation.'],
            ['Le prix d’un abonnement de 10 € par mois plus 5 € de frais fixes est-il proportionnel au nombre de mois ?', ['Non, à cause des frais fixes', 'Oui, avec un coefficient 10', 'Oui, avec un coefficient 15', 'Cela dépend du nombre de mois'], 0, 'La représentation ne passe pas par l’origine.'],
            ['L’aire d’un disque est-elle proportionnelle à son rayon ?', ['Non, elle dépend du carré du rayon', 'Oui, avec le coefficient π', 'Oui, avec le coefficient 2π', 'Elle n’en dépend pas'], 0, 'La courbe n’est pas une droite.'],
            ['Quelles sont les trois façons de décrire une dépendance ?', ['Une formule, un tableau, un graphique', 'Un texte, un dessin, un calcul', 'Une équation, une inéquation, un système', 'Un tableur, une calculatrice, un compas'], 0, 'Les trois décrivent la même relation.'],
            ['Toute dépendance entre deux grandeurs est une proportionnalité.', ['Vrai', 'Faux'], 1, 'C’est l’inverse qui est vrai : toute proportionnalité est une dépendance.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Grandeurs et mesures
        // ===================================================================
        {
          titre: 'Grandeurs produits et grandeurs quotients',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Des grandeurs fabriquées avec d’autres',
            cours: `Certaines grandeurs se mesurent directement — longueur, masse, durée. D’autres sont **composées** : elles se calculent à partir de deux grandeurs simples.

## Les grandeurs produits
Elles s’obtiennent en **multipliant** deux grandeurs.
- **Aire** = longueur × longueur → m², cm², km²
- **Volume** = longueur × longueur × longueur → m³, cm³
- **Énergie** = puissance × durée → le **kilowattheure** (kW × h)
- Le **kilomètre-passager**, la **personne-heure** de travail.

## Les grandeurs quotients
Elles s’obtiennent en **divisant** une grandeur par une autre.
- **Vitesse** = distance ÷ durée → m/s, km/h
- **Masse volumique** = masse ÷ volume → g/cm³, kg/m³
- **Débit** = volume ÷ durée → L/min, m³/s
- **Prix au kilo** = prix ÷ masse → €/kg
- **Densité de population** = habitants ÷ superficie → hab/km²
- **Consommation** = volume ÷ distance → L/100 km

## L’unité dit la formule
C’est le point à retenir : l’**unité** d’une grandeur composée porte en elle son mode de calcul.
- « km/h » se lit « kilomètres **par** heure » : c’est bien une **division** d’une distance par une durée ;
- « kWh » est un **produit** d’une puissance par une durée ;
- « g/cm³ » : une masse divisée par un volume.

> Devant un énoncé, lire l’unité demandée indique **l’opération** à faire. C’est la meilleure vérification d’un résultat.

## La cohérence des unités
Avant tout calcul, les unités doivent être **compatibles** : une durée en heures avec une distance en kilomètres donne des km/h ; en mélangeant minutes et kilomètres, le résultat n’a pas de nom.`,
          },
          questions: [
            ['Qu’est-ce qu’une grandeur produit ?', ['Une grandeur obtenue en multipliant deux grandeurs', 'Une grandeur obtenue par division', 'Une grandeur mesurée directement', 'Une grandeur sans unité'], 0, 'L’aire et le volume en sont.'],
            ['Quelle grandeur est un quotient ?', ['La vitesse', 'L’aire', 'Le volume', 'L’énergie en kilowattheures'], 0, 'Distance divisée par durée.'],
            ['Que signifie l’unité « km/h » ?', ['Des kilomètres divisés par des heures', 'Des kilomètres multipliés par des heures', 'Des kilomètres et des heures additionnés', 'Une unité d’aire'], 0, 'L’unité indique l’opération à effectuer.'],
            ['Quelle est l’unité de la masse volumique ?', ['g/cm³', 'cm³/g', 'g × cm³', 'g/cm'], 0, 'Masse divisée par volume.'],
            ['Le kilowattheure est-il un produit ou un quotient ?', ['Un produit : puissance × durée', 'Un quotient : puissance ÷ durée', 'Une grandeur simple', 'Un quotient : durée ÷ puissance'], 0, '1 kW pendant 1 h.'],
            ['Quelle grandeur mesure une densité de population ?', ['Le nombre d’habitants par km²', 'La superficie par habitant', 'Le nombre d’habitants multiplié par la superficie', 'Le nombre de logements'], 0, 'C’est un quotient : hab/km².'],
            ['Comment vérifier rapidement l’opération à effectuer ?', ['En lisant l’unité demandée', 'En comptant les données', 'En regardant l’ordre des nombres', 'En arrondissant le résultat'], 0, 'L’unité porte en elle le mode de calcul.'],
            ['On peut calculer une vitesse en km/h à partir d’une durée en minutes sans conversion.', ['Vrai', 'Faux'], 1, 'Les unités doivent être cohérentes avant tout calcul.'],
          ],
        },
        {
          titre: 'Étudier des grandeurs quotients',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Vitesse, débit, consommation : calculer et convertir',
            cours: `## La vitesse moyenne
**v = d ÷ t** — et les deux formules dérivées : **d = v × t** et **t = d ÷ v**.

Un triangle mnémotechnique aide : d en haut, v et t en bas ; on masque la grandeur cherchée pour lire l’opération.

## Les conversions
- **km/h → m/s** : diviser par **3,6** (36 km/h = 10 m/s) ;
- **m/s → km/h** : multiplier par **3,6**.

Et pour les durées : 1 h = 60 min = 3 600 s. **1 h 30 min = 1,5 h**, jamais 1,30 h — c’est l’erreur la plus fréquente du chapitre.

## Vitesse moyenne et vitesse instantanée
La **moyenne** se calcule sur l’ensemble du trajet ; l’**instantanée** est celle d’un instant donné, celle du compteur. Une vitesse moyenne de 90 km/h ne dit rien des vitesses réellement atteintes.

⚠️ La vitesse moyenne d’un aller-retour n’est **pas** la moyenne des deux vitesses : il faut repasser par la **distance totale** et la **durée totale**.

## Le débit
**débit = volume ÷ durée**, en L/min ou m³/h. On en déduit le volume : V = débit × durée.
Un robinet à 12 L/min remplit une baignoire de 150 L en 150 ÷ 12 = **12,5 min**.

## La consommation
Exprimée en **L/100 km** : consommation = (volume consommé ÷ distance) × 100.
Une voiture qui consomme 6,5 L/100 km utilise 6,5 × 4,2 = **27,3 L** pour 420 km.

## La méthode générale
1. Repérer l’unité demandée — elle donne l’opération ;
2. convertir les données dans des unités **compatibles** ;
3. calculer ;
4. **vérifier l’ordre de grandeur** : un piéton à 300 km/h ou une baignoire remplie en 2 secondes signalent une erreur.`,
          },
          questions: [
            ['Quelle est la formule de la vitesse moyenne ?', ['v = d ÷ t', 'v = d × t', 'v = t ÷ d', 'v = d + t'], 0, 'On en déduit d = v × t et t = d ÷ v.'],
            ['Comment convertit-on des km/h en m/s ?', ['On divise par 3,6', 'On multiplie par 3,6', 'On divise par 1 000', 'On multiplie par 60'], 0, '36 km/h correspondent à 10 m/s.'],
            ['Comment s’écrit 1 h 30 min en heures décimales ?', ['1,5 h', '1,30 h', '1,3 h', '90 h'], 0, 'C’est l’erreur la plus fréquente du chapitre.'],
            ['Quelle est la différence entre vitesse moyenne et vitesse instantanée ?', ['La moyenne porte sur tout le trajet, l’instantanée sur un instant', 'La moyenne est toujours plus grande', 'L’instantanée ne se mesure pas', 'Ce sont deux mots pour la même grandeur'], 0, 'Le compteur affiche la vitesse instantanée.'],
            ['Comment calcule-t-on la vitesse moyenne d’un aller-retour ?', ['Distance totale ÷ durée totale', 'Moyenne des deux vitesses', 'Somme des deux vitesses', 'Vitesse de l’aller uniquement'], 0, 'La moyenne des vitesses donnerait un résultat faux.'],
            ['En combien de temps un robinet de 12 L/min remplit-il 150 L ?', ['12,5 min', '18 min', '1 800 min', '12 min'], 0, '150 ÷ 12.'],
            ['Combien consomme une voiture à 6,5 L/100 km sur 420 km ?', ['27,3 L', '2,73 L', '65 L', '15,5 L'], 0, '6,5 × 4,2.'],
            ['Une vitesse moyenne indique les vitesses réellement atteintes pendant le trajet.', ['Vrai', 'Faux'], 1, 'Elle ne dit rien du détail : seule la vitesse instantanée le fait.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Espace et géométrie
        // ===================================================================
        {
          titre: 'Se repérer dans un pavé droit',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Trois coordonnées pour situer un point dans l’espace',
            cours: `## Le pavé droit
Un **pavé droit** (ou parallélépipède rectangle) a **6 faces** rectangulaires, **12 arêtes** et **8 sommets**. Le **cube** en est le cas particulier où toutes les arêtes sont égales.

## Se repérer sur ses faces
On choisit un sommet comme **origine** et trois arêtes issues de ce sommet comme **axes**. Chaque point du pavé est alors repéré par **trois coordonnées** — souvent notées (x ; y ; z) : une pour la longueur, une pour la largeur, une pour la hauteur.

Le sommet origine a pour coordonnées (0 ; 0 ; 0) ; le sommet opposé, (L ; l ; h).

> C’est le même principe qu’un repère du plan, avec un axe de plus. Deux coordonnées situent un point sur une **face**, trois le situent dans l’**espace**.

## Lire un dessin en perspective cavalière
Le pavé se dessine en **perspective cavalière** : la face avant est en vraie grandeur, les **fuyantes** sont parallèles entre elles, et les arêtes **cachées** se tracent en **pointillés**.

Conséquence à retenir : ce qui est **parallèle dans la réalité** reste **parallèle sur le dessin**, mais les **angles droits** et les **longueurs** des fuyantes ne sont **pas conservés**. Une face carrée peut apparaître comme un parallélogramme.

## Positions relatives dans l’espace
- Deux droites peuvent être **parallèles**, **sécantes**, ou **non coplanaires** (elles ne sont pas dans un même plan et ne se coupent jamais) — ce dernier cas n’existe pas dans le plan.
- Une droite et un plan : la droite est **parallèle** au plan, **sécante** en un point, ou **contenue** dans le plan.
- Deux plans sont **parallèles** ou **sécants** selon une **droite**.

## Calculs
- **Volume** = L × l × h
- **Aire totale** = somme des aires des 6 faces = 2(L×l + L×h + l×h)
- La **diagonale d’une face** se calcule par **Pythagore** dans le rectangle correspondant.`,
          },
          questions: [
            ['Combien de faces, d’arêtes et de sommets a un pavé droit ?', ['6 faces, 12 arêtes, 8 sommets', '4 faces, 8 arêtes, 6 sommets', '8 faces, 12 arêtes, 6 sommets', '6 faces, 8 arêtes, 12 sommets'], 0, 'Le cube en est le cas particulier.'],
            ['Combien de coordonnées faut-il pour situer un point dans l’espace ?', ['Trois', 'Deux', 'Une', 'Quatre'], 0, 'Une par dimension : longueur, largeur, hauteur.'],
            ['Comment se tracent les arêtes cachées en perspective cavalière ?', ['En pointillés', 'En trait plein épais', 'On ne les trace pas', 'En rouge'], 0, 'La face avant, elle, est en vraie grandeur.'],
            ['Que conserve la perspective cavalière ?', ['Le parallélisme', 'Les angles droits', 'Toutes les longueurs', 'Les aires'], 0, 'Une face carrée peut y apparaître comme un parallélogramme.'],
            ['Que sont deux droites non coplanaires ?', ['Deux droites qui ne sont pas dans un même plan et ne se coupent jamais', 'Deux droites parallèles', 'Deux droites perpendiculaires', 'Deux droites confondues'], 0, 'Ce cas n’existe pas dans le plan.'],
            ['Quelle est la formule du volume d’un pavé droit ?', ['L × l × h', '2(L + l + h)', 'L × l', '(L × l × h) ÷ 3'], 0, 'Le tiers concernerait une pyramide.'],
            ['Comment calcule-t-on la diagonale d’une face du pavé ?', ['Par le théorème de Pythagore dans cette face', 'En additionnant les deux côtés', 'En multipliant les deux côtés', 'Par le théorème de Thalès'], 0, 'La face est un rectangle, donc un triangle rectangle s’y trouve.'],
            ['Deux plans sécants se coupent en un point.', ['Vrai', 'Faux'], 1, 'Ils se coupent selon une droite.'],
          ],
        },
        {
          titre: 'Pyramide et cône de révolution',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Deux solides pointus, une même formule',
            cours: `## La pyramide
Elle a une **base polygonale** et des **faces latérales triangulaires** qui se rejoignent en un point : le **sommet**.
- La **hauteur** est le segment issu du sommet, **perpendiculaire** à la base.
- Une pyramide est **régulière** quand sa base est un polygone régulier et que son sommet se projette au centre de la base.
- Le **tétraèdre** est une pyramide à base triangulaire : quatre faces, toutes des triangles.

## Le cône de révolution
Il s’obtient en faisant tourner un **triangle rectangle** autour de l’un de ses côtés de l’angle droit. Sa base est un **disque**, sa surface latérale est engendrée par l’hypoténuse, appelée **génératrice**.

## La formule du volume, commune aux deux

**V = (1/3) × aire de la base × hauteur**

- Pyramide : V = (1/3) × aire du polygone × h
- Cône : V = (1/3) × π × R² × h

> **Le tiers est le facteur que les copies oublient le plus.** Une pyramide occupe exactement le tiers du prisme de même base et de même hauteur — on peut le vérifier en versant du sable.

## Les patrons
- **Pyramide** : la base, plus autant de triangles que la base a de côtés.
- **Cône** : un disque et un **secteur circulaire** — pas un triangle. Le rayon du secteur est la génératrice, et sa longueur d’arc est le périmètre de la base.

## Les sections planes
Un plan **parallèle à la base** coupe une pyramide selon un polygone **de même forme** que la base, et un cône selon un **disque**. Dans les deux cas, la section est une **réduction** : longueurs × k, aires × k², volumes × k³.

## Les unités
Un volume s’exprime en unités **cubes**. 1 L = 1 dm³ ; 1 cm³ = 1 mL ; 1 m³ = 1 000 L.`,
          },
          questions: [
            ['Quelle est la formule du volume d’une pyramide ?', ['(1/3) × aire de la base × hauteur', 'Aire de la base × hauteur', '(1/2) × aire de la base × hauteur', 'Périmètre de la base × hauteur'], 0, 'La même formule vaut pour le cône.'],
            ['Quelle est la formule du volume d’un cône de rayon R et de hauteur h ?', ['(1/3) × π × R² × h', 'π × R² × h', '(4/3) × π × R³', '2 × π × R × h'], 0, 'C’est l’aire du disque de base, multipliée par la hauteur puis divisée par 3.'],
            ['Comment obtient-on un cône de révolution ?', ['En faisant tourner un triangle rectangle autour d’un côté de l’angle droit', 'En faisant tourner un carré', 'En empilant des disques de même rayon', 'En pliant un secteur circulaire seulement'], 0, 'L’hypoténuse engendre la surface latérale.'],
            ['Qu’est-ce que la génératrice d’un cône ?', ['L’hypoténuse du triangle qui l’engendre, du sommet au bord de la base', 'Le rayon de la base', 'La hauteur du cône', 'Le diamètre du disque'], 0, 'C’est le rayon du secteur dans le patron.'],
            ['De quoi se compose le patron d’un cône ?', ['D’un disque et d’un secteur circulaire', 'D’un disque et d’un triangle', 'De deux disques', 'D’un rectangle et d’un disque'], 0, 'Le rectangle serait le patron latéral d’un cylindre.'],
            ['Qu’est-ce qu’un tétraèdre ?', ['Une pyramide à base triangulaire', 'Une pyramide à base carrée', 'Un cône tronqué', 'Un prisme à trois faces'], 0, 'Ses quatre faces sont des triangles.'],
            ['Quelle figure obtient-on en coupant un cône par un plan parallèle à sa base ?', ['Un disque plus petit que la base', 'Un triangle', 'Un rectangle', 'Une ellipse'], 0, 'C’est une réduction de la base.'],
            ['Une pyramide a le même volume que le prisme de même base et de même hauteur.', ['Vrai', 'Faux'], 1, 'Elle en occupe exactement le tiers.'],
          ],
        },
        {
          titre: 'Agrandissement et réduction d’une figure géométrique',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Les longueurs, les aires et les volumes ne suivent pas la même règle',
            cours: `Agrandir ou réduire une figure, c’est multiplier **toutes** ses longueurs par un même nombre **k**, appelé **rapport** (ou coefficient) d’agrandissement-réduction.
- **k > 1** : agrandissement ;
- **k < 1** : réduction ;
- **k = 1** : la figure ne change pas.

## Ce qui est conservé
- la **forme** ;
- les **angles**, qui gardent exactement la même mesure ;
- le **parallélisme** et l’**alignement** ;
- les **rapports** entre longueurs à l’intérieur de la figure.

## Ce qui est multiplié
| Grandeur | Multipliée par |
|---|---|
| Longueurs (côtés, périmètre, rayon, hauteur) | **k** |
| Aires (surface, aire latérale, aire totale) | **k²** |
| Volumes | **k³** |

> C’est la règle centrale du chapitre, et la source d’erreur numéro un. Un agrandissement de rapport 3 triple les longueurs, multiplie l’aire par **9** et le volume par **27**.

## Un exemple complet
Une maquette au 1/50 d’un immeuble :
- une hauteur de 20 cm sur la maquette correspond à 20 × 50 = 1 000 cm = **10 m** en réalité ;
- une aire de 4 cm² correspond à 4 × 50² = 4 × 2 500 = **10 000 cm²** = 1 m² ;
- un volume de 2 cm³ correspond à 2 × 50³ = **250 000 cm³** = 0,25 m³.

## Où on le rencontre
Les **échelles** (cartes, plans, maquettes), les **sections** de solides par un plan parallèle à la base, la **configuration de Thalès**, les **triangles semblables**, l’**homothétie** (vue en 3e).

## Reconnaître un agrandissement
Deux figures sont un agrandissement l’une de l’autre si le rapport de deux longueurs correspondantes est **le même pour toutes les paires** de côtés.`,
          },
          questions: [
            ['Que multiplie un agrandissement de rapport k ?', ['Toutes les longueurs de la figure', 'Seulement la base', 'Seulement les aires', 'Les angles'], 0, 'Les angles, eux, sont conservés.'],
            ['Par combien sont multipliées les aires dans un agrandissement de rapport k ?', ['k²', 'k', 'k³', '2k'], 0, 'C’est la règle centrale du chapitre.'],
            ['Par combien sont multipliés les volumes dans un agrandissement de rapport k ?', ['k³', 'k²', 'k', '3k'], 0, 'Un rapport 3 multiplie le volume par 27.'],
            ['Que deviennent les angles dans un agrandissement ?', ['Ils sont conservés', 'Ils sont multipliés par k', 'Ils sont multipliés par k²', 'Ils doublent'], 0, 'C’est ce qui garantit la conservation de la forme.'],
            ['Sur une maquette au 1/50, à quoi correspond une hauteur de 20 cm ?', ['10 m', '1 m', '100 m', '50 cm'], 0, '20 × 50 = 1 000 cm.'],
            ['Sur une maquette au 1/50, à quoi correspond une aire de 4 cm² ?', ['10 000 cm²', '200 cm²', '4 000 cm²', '2 500 cm²'], 0, 'Les aires se multiplient par 50², soit 2 500.'],
            ['Comment reconnaît-on que deux figures sont un agrandissement l’une de l’autre ?', ['Le rapport des longueurs correspondantes est le même pour toutes les paires', 'Elles ont la même aire', 'Elles ont le même périmètre', 'Elles ont un côté commun'], 0, 'Ce rapport commun est le coefficient k.'],
            ['Un agrandissement de rapport 3 multiplie l’aire par 3.', ['Vrai', 'Faux'], 1, 'Il la multiplie par 9, et le volume par 27.'],
          ],
        },
        {
          titre: 'Triangles égaux et semblables',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Même taille, ou seulement même forme',
            cours: `## Les triangles égaux (ou isométriques)
Deux triangles sont **égaux** quand ils ont **exactement les mêmes mesures** : leurs côtés sont deux à deux de même longueur, et leurs angles deux à deux de même mesure. L’un se superpose exactement à l’autre, éventuellement après un retournement.

**Trois cas d’égalité** suffisent à le démontrer :
1. **Trois côtés** égaux deux à deux ;
2. **Deux côtés et l’angle compris** entre eux ;
3. **Un côté et les deux angles adjacents**.

## Les triangles semblables
Deux triangles sont **semblables** quand ils ont **la même forme**, sans forcément la même taille : leurs angles sont deux à deux égaux, et leurs côtés sont **proportionnels**.

**Le critère à retenir : deux angles égaux suffisent.** Comme la somme des angles vaut 180°, le troisième suit automatiquement.

## Le rapport de similitude
Si ABC et DEF sont semblables (A↔D, B↔E, C↔F) :

**AB/DE = AC/DF = BC/EF = k**

- longueurs × **k**, aires × **k²** ;
- deux triangles **égaux** sont des triangles semblables de rapport **k = 1**.

> L’**ordre des lettres** n’est pas décoratif : c’est lui qui dit quel côté correspond à quel autre. Écrire « ABC semblable à DEF » engage les trois correspondances.

## À quoi ça sert
- Calculer une **longueur inaccessible** : la hauteur d’un arbre par son ombre, la largeur d’une rivière.
- **Démontrer** une égalité de rapports.
- La **configuration de Thalès** produit toujours deux triangles semblables : les deux chapitres décrivent la même situation.

## La rédaction type
« Dans les triangles ABC et DEF : l’angle A = l’angle D et l’angle B = l’angle E. Donc ABC et DEF sont semblables. Par conséquent AB/DE = AC/DF = BC/EF. »`,
          },
          questions: [
            ['Quand deux triangles sont-ils égaux ?', ['Quand leurs côtés et leurs angles sont deux à deux de même mesure', 'Quand ils ont la même aire', 'Quand ils ont un angle commun', 'Quand ils sont tous deux rectangles'], 0, 'L’un se superpose exactement à l’autre.'],
            ['Combien d’angles égaux suffisent pour prouver que deux triangles sont semblables ?', ['Deux', 'Un seul', 'Trois obligatoirement', 'Aucun : il faut les côtés'], 0, 'Le troisième suit, la somme des angles valant 180°.'],
            ['Quel est l’un des cas d’égalité des triangles ?', ['Deux côtés et l’angle compris entre eux', 'Deux angles seulement', 'Trois angles égaux', 'Un côté seulement'], 0, 'Trois angles égaux ne donnent que la similitude.'],
            ['Que vaut le rapport de similitude k ?', ['Le quotient de deux côtés homologues', 'La différence de deux côtés', 'La somme des angles', 'Le rapport des aires'], 0, 'Il est le même pour les trois paires de côtés.'],
            ['Si k = 2, dans quel rapport sont les aires de deux triangles semblables ?', ['4', '2', '8', '6'], 0, 'Les aires sont dans le rapport k².'],
            ['Que sont deux triangles égaux, en termes de similitude ?', ['Des triangles semblables de rapport 1', 'Des triangles semblables de rapport 2', 'Des triangles jamais semblables', 'Des triangles de même périmètre seulement'], 0, 'Même forme et même taille.'],
            ['Quelle configuration produit toujours deux triangles semblables ?', ['La configuration de Thalès', 'Le losange', 'Le trapèze quelconque', 'Le triangle inscrit dans un cercle'], 0, 'Deux droites parallèles coupées par deux sécantes.'],
            ['Deux triangles semblables ont toujours la même aire.', ['Vrai', 'Faux'], 1, 'Leurs aires sont dans le rapport k², égal à 1 seulement si les triangles sont égaux.'],
          ],
        },
        {
          titre: 'Le théorème de Thalès',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Des parallèles, des quotients égaux',
            cours: `## La configuration
Deux droites sécantes en **A**, deux points **B** et **M** sur la première, **C** et **N** sur la seconde. Si **(BC) et (MN) sont parallèles**, alors :

**AM / AB = AN / AC = MN / BC**

Deux figures possibles, et le théorème est le même dans les deux :
- le **triangle emboîté** : M et N du même côté de A ;
- le **papillon** : M et N de l’autre côté de A.

## La méthode en trois temps
1. **Vérifier les hypothèses** : les points sont alignés, les droites sont parallèles.
2. **Écrire les trois quotients** dans le bon ordre — chacun commence par le sommet commun A.
3. **Résoudre par le produit en croix**, en n’utilisant que les deux quotients dont on connaît trois longueurs.

> L’erreur classique consiste à mélanger un « petit » et un « grand » segment dans le même quotient. Écrire systématiquement **petit sur grand** évite la moitié des fautes.

## La réciproque : démontrer un parallélisme
Si A, M, B et A, N, C sont alignés **dans le même ordre**, et si **AM/AB = AN/AC**, alors **(MN) et (BC) sont parallèles**.

## La contraposée : démontrer un NON-parallélisme
Si les deux quotients sont **différents**, alors les droites **ne sont pas parallèles**. C’est la question type de fin d’exercice : on calcule les deux quotients, on les compare, on conclut.

## Le lien avec les agrandissements
Le rapport commun des quotients est un **coefficient de réduction** : les longueurs y sont dans le rapport k, les aires dans le rapport k².

## La rédaction type
« Les points A, M, B d’une part, A, N, C d’autre part sont alignés, et (MN) // (BC). D’après le théorème de Thalès : AM/AB = AN/AC = MN/BC. »`,
          },
          questions: [
            ['Quelle hypothèse rend le théorème de Thalès applicable ?', ['Deux droites parallèles coupées par deux sécantes', 'Un triangle rectangle', 'Deux cercles de même rayon', 'Un quadrilatère quelconque'], 0, 'Le parallélisme est indispensable.'],
            ['Dans la configuration de Thalès, à quoi est égal AM / AB ?', ['AN / AC', 'AB / AM', 'BC / AN', 'AC / MN'], 0, 'Les trois quotients AM/AB, AN/AC et MN/BC sont égaux.'],
            ['Comment nomme-t-on la configuration où M et N sont de part et d’autre du sommet ?', ['La configuration papillon', 'La configuration emboîtée', 'La configuration pyramidale', 'La configuration croisée interdite'], 0, 'Le théorème s’y applique de la même façon.'],
            ['À quoi sert la réciproque du théorème de Thalès ?', ['À démontrer que deux droites sont parallèles', 'À calculer une longueur', 'À calculer un angle', 'À déterminer une aire'], 0, 'Elle exige que les points soient alignés dans le même ordre.'],
            ['Que conclut-on si les deux quotients sont différents ?', ['Les droites ne sont pas parallèles', 'La figure est fausse', 'Le théorème s’applique quand même', 'Les points ne sont pas alignés'], 0, 'C’est la contraposée.'],
            ['Comment résout-on une égalité de deux quotients ?', ['Par le produit en croix', 'En additionnant les numérateurs', 'En prenant la racine carrée', 'En multipliant par π'], 0, 'a/b = c/d équivaut à a × d = b × c.'],
            ['Que faut-il vérifier avant d’appliquer le théorème ?', ['L’alignement des points et le parallélisme des droites', 'La longueur des côtés', 'La mesure des angles', 'L’aire du triangle'], 0, 'Ce sont les deux hypothèses du théorème.'],
            ['Le théorème de Thalès permet de calculer un angle.', ['Vrai', 'Faux'], 1, 'Il ne parle que de longueurs.'],
          ],
        },
        {
          titre: 'Le triangle rectangle : théorème de Pythagore et cosinus d’un angle aigu',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Trois longueurs, ou deux longueurs et un angle',
            cours: `## Le théorème de Pythagore
Dans un triangle **rectangle**, le carré de l’**hypoténuse** est égal à la somme des carrés des deux autres côtés.

Si ABC est rectangle en A : **BC² = AB² + AC²**

L’**hypoténuse** est le côté opposé à l’angle droit, et c’est toujours le plus long.

**Calculer l’hypoténuse** : BC = √(AB² + AC²).
**Calculer un autre côté** : AB² = BC² − AC², puis AB = √(BC² − AC²) — on **soustrait**, et l’ordre compte.

## La réciproque
Si dans un triangle le carré du plus grand côté **est égal** à la somme des carrés des deux autres, alors le triangle **est rectangle**, et l’angle droit est opposé au plus grand côté.

## La contraposée
Si cette égalité **n’est pas vérifiée**, le triangle **n’est pas rectangle**. Méthode : on calcule séparément le carré du plus grand côté, puis la somme des carrés des deux autres, et on **compare**.

## Le cosinus d’un angle aigu
Il relie un **angle** à deux **longueurs**, ce que Pythagore ne sait pas faire :

**cos(angle) = côté adjacent ÷ hypoténuse**

- Pour trouver une **longueur** : on isole l’inconnue.
- Pour trouver un **angle** : on calcule le quotient, puis on emploie la touche **cos⁻¹** de la calculatrice, réglée en **degrés (DEG)**.

## Les valeurs à connaître
cos 0° = 1 ; cos 60° = 0,5 ; cos 90° = 0.
Le cosinus d’un angle aigu est **toujours compris entre 0 et 1** : un résultat supérieur à 1 signale une erreur.

> Pythagore relie **trois longueurs** ; le cosinus relie **deux longueurs et un angle**. Un exercice les enchaîne souvent : Pythagore pour trouver un côté, le cosinus pour trouver l’angle.`,
          },
          questions: [
            ['Que dit le théorème de Pythagore ?', ['Le carré de l’hypoténuse égale la somme des carrés des deux autres côtés', 'La somme des angles vaut 180°', 'Les côtés sont proportionnels', 'L’aire vaut base × hauteur ÷ 2'], 0, 'Il ne s’applique qu’au triangle rectangle.'],
            ['Comment appelle-t-on le côté opposé à l’angle droit ?', ['L’hypoténuse', 'Le côté adjacent', 'La médiane', 'La hauteur'], 0, 'C’est toujours le plus long des trois côtés.'],
            ['Comment calcule-t-on un côté de l’angle droit ?', ['En soustrayant les carrés : AB² = BC² − AC²', 'En additionnant les carrés', 'En divisant les longueurs', 'Avec le cosinus uniquement'], 0, 'L’ordre de la soustraction compte.'],
            ['À quoi sert la réciproque du théorème de Pythagore ?', ['À démontrer qu’un triangle est rectangle', 'À calculer l’hypoténuse', 'À calculer un angle', 'À démontrer un parallélisme'], 0, 'L’angle droit est alors opposé au plus grand côté.'],
            ['Que vaut le cosinus d’un angle aigu ?', ['Côté adjacent ÷ hypoténuse', 'Côté opposé ÷ hypoténuse', 'Côté opposé ÷ côté adjacent', 'Hypoténuse ÷ côté adjacent'], 0, 'C’est le CAH du moyen mnémotechnique.'],
            ['Comment retrouve-t-on un angle à partir de son cosinus ?', ['Avec la touche cos⁻¹ de la calculatrice', 'En multipliant par 90', 'En prenant la racine carrée', 'En divisant par π'], 0, 'La calculatrice doit être en mode degrés.'],
            ['Que vaut cos 60° ?', ['0,5', '1', '0', '60'], 0, 'cos 0° = 1 et cos 90° = 0.'],
            ['Le cosinus d’un angle aigu peut dépasser 1.', ['Vrai', 'Faux'], 1, 'C’est un quotient dont le dénominateur est le plus grand côté.'],
          ],
        },
        {
          titre: 'Les parallélogrammes particuliers',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Rectangle, losange, carré : qui a quoi',
            cours: `## Le parallélogramme
Un quadrilatère dont les côtés opposés sont **parallèles deux à deux**. Ses propriétés :
- les **côtés opposés** sont de même longueur ;
- les **angles opposés** sont de même mesure ;
- les **diagonales se coupent en leur milieu** ;
- il a un **centre de symétrie** : le point d’intersection des diagonales.

## Les trois cas particuliers
**Le rectangle** = un parallélogramme qui a **un angle droit**.
→ Il en a donc quatre, et ses **diagonales sont de même longueur**.

**Le losange** = un parallélogramme qui a **deux côtés consécutifs de même longueur**.
→ Ses quatre côtés sont égaux, et ses **diagonales sont perpendiculaires** — elles sont aussi ses axes de symétrie.

**Le carré** = à la fois **rectangle et losange**.
→ Il cumule **toutes** les propriétés : quatre côtés égaux, quatre angles droits, diagonales de même longueur, perpendiculaires, et se coupant en leur milieu.

## Le tableau des diagonales
| Figure | Se coupent au milieu | Même longueur | Perpendiculaires |
|---|---|---|---|
| Parallélogramme | oui | non | non |
| Rectangle | oui | **oui** | non |
| Losange | oui | non | **oui** |
| Carré | oui | **oui** | **oui** |

> Les **diagonales** sont l’outil de démonstration le plus efficace du chapitre : leurs trois propriétés suffisent à distinguer les quatre figures.

## Les axes de symétrie
Parallélogramme : **aucun** (mais un centre de symétrie). Rectangle : **2** (les médiatrices des côtés). Losange : **2** (ses diagonales). Carré : **4**.

## Rédiger une démonstration
On part d’une propriété connue et on cite le théorème : « Les diagonales de ABCD se coupent en leur milieu **et** ont la même longueur, donc ABCD est un rectangle. »`,
          },
          questions: [
            ['Que peut-on dire des diagonales d’un parallélogramme ?', ['Elles se coupent en leur milieu', 'Elles sont de même longueur', 'Elles sont perpendiculaires', 'Elles sont parallèles'], 0, 'Les autres propriétés distinguent ses cas particuliers.'],
            ['Qu’est-ce qu’un rectangle ?', ['Un parallélogramme qui a un angle droit', 'Un parallélogramme aux côtés égaux', 'Un quadrilatère aux diagonales perpendiculaires', 'Un losange aux diagonales égales seulement'], 0, 'Il en a alors quatre, et ses diagonales sont de même longueur.'],
            ['Qu’est-ce qu’un losange ?', ['Un parallélogramme qui a deux côtés consécutifs de même longueur', 'Un parallélogramme qui a un angle droit', 'Un quadrilatère aux diagonales de même longueur', 'Un rectangle penché'], 0, 'Ses quatre côtés sont alors égaux.'],
            ['Quelle propriété caractérise les diagonales d’un losange ?', ['Elles sont perpendiculaires', 'Elles sont de même longueur', 'Elles sont parallèles', 'Elles ne se coupent pas'], 0, 'Elles sont aussi ses axes de symétrie.'],
            ['Qu’est-ce qu’un carré ?', ['Un quadrilatère à la fois rectangle et losange', 'Un rectangle aux diagonales perpendiculaires seulement', 'Un losange sans angle droit', 'Un parallélogramme quelconque'], 0, 'Il cumule toutes les propriétés.'],
            ['Combien d’axes de symétrie a un rectangle non carré ?', ['2', '4', '1', '0'], 0, 'Les médiatrices de ses côtés ; le carré en a 4.'],
            ['Combien d’axes de symétrie a un parallélogramme quelconque ?', ['Aucun', 'Un', 'Deux', 'Quatre'], 0, 'Il possède en revanche un centre de symétrie.'],
            ['Un quadrilatère dont les diagonales se coupent en leur milieu et sont perpendiculaires est un rectangle.', ['Vrai', 'Faux'], 1, 'C’est un losange : le rectangle a des diagonales de même longueur.'],
          ],
        },
        {
          titre: 'Utiliser une translation',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Glisser une figure sans la tourner',
            cours: `Une **translation** fait **glisser** une figure entière dans une **direction** donnée, d’une certaine **longueur**, et dans un **sens** précis. Ces trois informations définissent la translation ; on les résume par une **flèche**.

## Construire l’image d’un point
L’image M′ d’un point M par la translation qui transforme A en B est le point tel que **ABM′M soit un parallélogramme** — autrement dit, on reporte le déplacement de A vers B à partir de M.

Concrètement : même direction, même sens, même longueur.

## Ce que la translation conserve
Elle conserve **tout**, sauf la position :
- les **longueurs** ;
- les **angles** ;
- les **aires** et les **périmètres** ;
- l’**alignement**, le **parallélisme**, les **milieux** ;
- l’**orientation** de la figure — c’est ce qui la distingue de la symétrie.

Une figure et son image par translation sont donc **superposables sans retournement**.

## Comparer avec les autres transformations
| Transformation | Définie par | Conserve les longueurs | Retourne la figure |
|---|---|---|---|
| **Translation** | une direction, un sens, une longueur | oui | non |
| **Symétrie axiale** | un axe | oui | **oui** |
| **Symétrie centrale** | un centre | oui | oui (demi-tour) |
| **Rotation** | un centre et un angle | oui | non |

## Enchaîner deux translations
Deux translations successives équivalent à **une seule** translation : les deux déplacements s’ajoutent.

## Où on la rencontre
Les **frises** et les **pavages**, qui se construisent par répétition d’un motif translaté ; les mosaïques ; les dessins d’Escher. C’est aussi la première approche des **vecteurs**, étudiés au lycée.`,
          },
          questions: [
            ['Quelles informations définissent une translation ?', ['Une direction, un sens et une longueur', 'Un centre et un angle', 'Un axe seulement', 'Un rapport de réduction'], 0, 'On les résume par une flèche.'],
            ['Quelle figure forment A, B, M et son image M′ ?', ['Un parallélogramme', 'Un rectangle', 'Un losange', 'Un triangle'], 0, 'Le déplacement de A vers B est reporté à partir de M.'],
            ['Que conserve une translation ?', ['Les longueurs, les angles, les aires et l’orientation', 'Seulement les angles', 'Seulement les longueurs', 'Rien, sauf la forme générale'], 0, 'Elle change uniquement la position.'],
            ['Qu’est-ce qui distingue une translation d’une symétrie axiale ?', ['La translation ne retourne pas la figure', 'La translation ne conserve pas les longueurs', 'La symétrie axiale ne conserve pas les angles', 'Il n’y a aucune différence'], 0, 'Une figure translatée se superpose sans retournement.'],
            ['Quelle transformation est définie par un centre et un angle ?', ['La rotation', 'La translation', 'La symétrie axiale', 'L’agrandissement'], 0, 'La symétrie centrale en est le cas particulier à 180°.'],
            ['À quoi équivalent deux translations successives ?', ['À une seule translation, dont les déplacements s’ajoutent', 'À une rotation', 'À une symétrie centrale', 'À un agrandissement'], 0, 'C’est la première approche de l’addition des vecteurs.'],
            ['Quelles constructions reposent sur la translation ?', ['Les frises et les pavages', 'Les cercles concentriques', 'Les triangles semblables', 'Les diagonales d’un losange'], 0, 'Un motif y est répété par translation.'],
            ['Une translation modifie l’aire de la figure.', ['Vrai', 'Faux'], 1, 'Elle conserve tout, sauf la position.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : Cours de l'ancien programme
        // ===================================================================
        {
          titre: 'Prendre une fraction d’un nombre',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: '« Les trois quarts de » veut dire « multiplier par 3/4 »',
            cours: `Prendre une **fraction d’une quantité**, c’est **multiplier** cette quantité par la fraction. Le mot « **de** » se traduit toujours par le signe **×**.

Les trois quarts de 60 : 60 × 3/4 = 180/4 = **45**.

## Deux méthodes équivalentes
**1. Diviser puis multiplier** — la plus sûre mentalement :
60 ÷ 4 = 15, puis 15 × 3 = **45**.

**2. Multiplier puis diviser** :
60 × 3 = 180, puis 180 ÷ 4 = **45**.

On choisit l’ordre qui donne les calculs les plus simples : si la division tombe juste, on commence par elle.

## Le lien avec les pourcentages
Un pourcentage **est** une fraction de dénominateur 100 :
- 25 % de 80 = 80 × 25/100 = 80 × 0,25 = **20**
- 50 % = 1/2, 25 % = 1/4, 75 % = 3/4, 10 % = 1/10, 20 % = 1/5.

## Fraction d’une fraction
On multiplie les deux fractions : la moitié des trois quarts = 1/2 × 3/4 = **3/8**.

## Retrouver le tout
Si 45 représente les trois quarts d’un nombre, on **divise** par la fraction :
45 ÷ 3/4 = 45 × 4/3 = **60**.

> Prendre une fraction, c’est multiplier ; retrouver le tout, c’est diviser. Une erreur de sens se repère à la vraisemblance : la partie doit être **plus petite** que le tout quand la fraction est inférieure à 1.

## Attention aux fractions supérieures à 1
Prendre les 5/4 d’une quantité l’**augmente** : 60 × 5/4 = 75. Une fraction supérieure à 1 agrandit, une fraction inférieure à 1 réduit.`,
          },
          questions: [
            ['Comment traduit-on « les trois quarts de 60 » ?', ['60 × 3/4', '60 ÷ 3/4', '60 + 3/4', '60 − 3/4'], 0, 'Le mot « de » se traduit par le signe ×.'],
            ['Combien font les trois quarts de 60 ?', ['45', '20', '80', '15'], 0, '60 ÷ 4 = 15, puis 15 × 3.'],
            ['À quelle fraction correspond 25 % ?', ['1/4', '1/25', '25/10', '1/2'], 0, 'Un pourcentage est une fraction de dénominateur 100.'],
            ['Combien font 25 % de 80 ?', ['20', '25', '32', '55'], 0, '80 × 0,25.'],
            ['Combien fait la moitié des trois quarts ?', ['3/8', '3/6', '1/4', '5/8'], 0, 'On multiplie les deux fractions.'],
            ['Si 45 représente les trois quarts d’un nombre, quel est ce nombre ?', ['60', '33,75', '135', '15'], 0, 'On divise par la fraction : 45 × 4/3.'],
            ['Que fait la prise des 5/4 d’une quantité ?', ['Elle l’augmente', 'Elle la diminue', 'Elle ne la change pas', 'Elle l’annule'], 0, 'Une fraction supérieure à 1 agrandit.'],
            ['Prendre une fraction d’un nombre revient à diviser par cette fraction.', ['Vrai', 'Faux'], 1, 'C’est une multiplication ; la division sert à retrouver le tout.'],
          ],
        },
        {
          titre: 'Égalité des produits en croix',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'La règle qui résout les tableaux de proportionnalité',
            cours: `## La propriété
Deux fractions sont **égales** si et seulement si leurs **produits en croix** sont égaux :

**a/b = c/d ⟺ a × d = b × c** (avec b et d non nuls)

On multiplie « en croix » : le numérateur de l’une par le dénominateur de l’autre.

## Deux usages
**1. Vérifier une égalité de fractions.**
6/9 et 8/12 : 6 × 12 = 72 et 9 × 8 = 72 → les fractions sont **égales**.
5/7 et 7/9 : 5 × 9 = 45 et 7 × 7 = 49 → elles ne le sont **pas**.

**2. Trouver une valeur manquante** — la **quatrième proportionnelle**.
Dans x/12 = 5/4 : 4x = 60, donc **x = 15**.

## La méthode pas à pas
1. Écrire l’égalité de deux quotients ;
2. multiplier en croix ;
3. isoler l’inconnue en divisant ;
4. vérifier en remplaçant.

## Dans un tableau de proportionnalité
| Quantité | 4 | 12 |
|---|---|---|
| Prix | 5 | x |

4x = 12 × 5 → 4x = 60 → **x = 15 €**.

> ⚠️ Le produit en croix ne s’applique qu’à une situation **réellement proportionnelle**. L’appliquer à un tarif avec abonnement fixe, ou à l’aire d’un carré en fonction de son côté, donne un résultat faux — et l’erreur ne se voit pas dans le calcul.

## Où on le retrouve
Échelles, recettes, vitesses, pourcentages, agrandissements, et le théorème de **Thalès**, dont toute la résolution repose sur cette seule règle.`,
          },
          questions: [
            ['Que dit l’égalité des produits en croix ?', ['a/b = c/d équivaut à a × d = b × c', 'a/b = c/d équivaut à a × c = b × d', 'a/b = c/d équivaut à a + d = b + c', 'a/b = c/d équivaut à a − b = c − d'], 0, 'On multiplie le numérateur de l’une par le dénominateur de l’autre.'],
            ['Les fractions 6/9 et 8/12 sont-elles égales ?', ['Oui, les deux produits valent 72', 'Non, les numérateurs diffèrent', 'Non, les dénominateurs diffèrent', 'On ne peut pas conclure'], 0, '6 × 12 = 9 × 8 = 72.'],
            ['Dans x/12 = 5/4, que vaut x ?', ['15', '9,6', '60', '3'], 0, '4x = 60.'],
            ['Qu’est-ce que la quatrième proportionnelle ?', ['La valeur manquante d’un tableau de proportionnalité', 'Le quatrième terme d’une suite', 'Le coefficient de proportionnalité', 'La moyenne des trois autres valeurs'], 0, 'On la calcule par produit en croix.'],
            ['Quelle condition les dénominateurs doivent-ils remplir ?', ['Ils doivent être non nuls', 'Ils doivent être égaux', 'Ils doivent être entiers', 'Ils doivent être premiers'], 0, 'Une division par zéro n’a pas de sens.'],
            ['À quelle condition le produit en croix est-il valable ?', ['La situation doit être réellement proportionnelle', 'Les nombres doivent être entiers', 'Le tableau doit avoir deux lignes', 'Les valeurs doivent être croissantes'], 0, 'Appliqué à un tarif avec abonnement, il donne un résultat faux.'],
            ['Quel théorème de géométrie repose entièrement sur cette règle ?', ['Le théorème de Thalès', 'Le théorème de Pythagore', 'La réciproque de Pythagore', 'Le théorème des milieux'], 0, 'Ses trois quotients égaux se résolvent par produit en croix.'],
            ['Le produit en croix s’applique à n’importe quel tableau de deux lignes.', ['Vrai', 'Faux'], 1, 'Il suppose la proportionnalité, et l’erreur ne se voit pas dans le calcul.'],
          ],
        },
        {
          titre: 'La division euclidienne',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Quotient et reste, dans les entiers',
            cours: `## La définition
Effectuer la **division euclidienne** d’un entier **a** (le **dividende**) par un entier **b** non nul (le **diviseur**), c’est trouver deux entiers **q** (le **quotient**) et **r** (le **reste**) tels que :

**a = b × q + r**, avec **0 ≤ r < b**

Le reste est toujours **positif** et **strictement inférieur au diviseur** — c’est la condition qui rend le couple (q ; r) unique.

## Un exemple
47 divisé par 5 : 47 = 5 × 9 + 2.
Quotient **9**, reste **2**. Et 2 < 5 : la condition est respectée.

> Si le reste obtenu est supérieur ou égal au diviseur, c’est que le quotient est trop petit : il faut le relever d’un cran.

## Le vocabulaire de la divisibilité
Quand le **reste est nul**, on dit que :
- a est **divisible** par b ;
- b est un **diviseur** de a ;
- a est un **multiple** de b.

47 = 5 × 9 + 2 : 47 n’est pas divisible par 5.
48 = 6 × 8 + 0 : 48 **est** divisible par 6, 6 est un diviseur de 48, et 48 est un multiple de 6.

## À quoi ça sert
- **Les problèmes de partage** : combien de paquets complets, et combien reste-t-il ?
- **Les conversions** : 200 minutes = 3 h et 20 min (200 = 60 × 3 + 20).
- **La parité** : le reste de la division par 2 vaut 0 (pair) ou 1 (impair).
- **Les problèmes cycliques** : le jour de la semaine dans 100 jours se trouve avec le reste de la division par 7.

## L’interprétation du quotient et du reste
Dans un énoncé, il faut décider **lequel des deux répond à la question** : « combien de boîtes pleines ? » demande le quotient ; « combien d’objets en trop ? » demande le reste. C’est là que se joue l’exercice, plus que dans le calcul.`,
          },
          questions: [
            ['Quelle égalité définit la division euclidienne ?', ['a = b × q + r, avec 0 ≤ r < b', 'a = b × q, sans reste', 'a = b + q + r', 'a = (b + q) × r'], 0, 'Le reste doit être strictement inférieur au diviseur.'],
            ['Quelle condition le reste doit-il vérifier ?', ['Être positif et strictement inférieur au diviseur', 'Être inférieur au quotient', 'Être toujours nul', 'Être supérieur au diviseur'], 0, 'C’est ce qui rend le couple (quotient ; reste) unique.'],
            ['Quel est le reste de la division de 47 par 5 ?', ['2', '9', '5', '7'], 0, '47 = 5 × 9 + 2.'],
            ['Que peut-on dire quand le reste est nul ?', ['a est divisible par b, et b est un diviseur de a', 'a est un diviseur de b', 'La division est impossible', 'Le quotient est nul'], 0, 'a est alors un multiple de b.'],
            ['Comment convertit-on 200 minutes en heures et minutes ?', ['3 h et 20 min, car 200 = 60 × 3 + 20', '2 h et 40 min', '3 h et 40 min', '20 h et 3 min'], 0, 'C’est une division euclidienne par 60.'],
            ['Comment reconnaît-on un nombre pair par la division euclidienne ?', ['Son reste dans la division par 2 est nul', 'Son quotient est pair', 'Son reste vaut 1', 'Son diviseur est 2'], 0, 'Un reste de 1 signale un nombre impair.'],
            ['Dans un problème de partage, que donne le quotient ?', ['Le nombre de parts complètes', 'Le nombre d’objets restants', 'Le nombre total d’objets', 'La taille d’une part'], 0, 'Le reste donne ce qui n’a pas pu être distribué.'],
            ['Un reste peut être supérieur au diviseur.', ['Vrai', 'Faux'], 1, 'Cela signifierait que le quotient est trop petit.'],
          ],
        },
        {
          titre: 'Reconnaître un multiple et un diviseur',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Deux mots pour une même relation',
            cours: `## Les définitions
Si un entier **a** peut s’écrire **a = b × k** avec k entier, alors :
- **a est un multiple de b** ;
- **b est un diviseur de a** ;
- a est **divisible** par b.

Les trois phrases disent **exactement la même chose**, vue de deux côtés.

42 = 6 × 7 : 42 est un multiple de 6 **et** de 7 ; 6 et 7 sont des diviseurs de 42.

## Les multiples
Les multiples d’un nombre sont **infinis** : ceux de 7 sont 0, 7, 14, 21, 28, 35, 42…
- **0 est un multiple de tous** les entiers ;
- tout nombre est multiple de lui-même et de 1.

## Les diviseurs
Les diviseurs d’un nombre sont **en nombre fini** : ceux de 12 sont 1, 2, 3, 4, 6 et 12.
- **1 divise tout** ;
- tout nombre non nul est son propre diviseur ;
- **on ne divise jamais par 0**.

## La méthode pour lister tous les diviseurs
On teste 1, 2, 3… en formant des **paires** : 12 = 1 × 12 = 2 × 6 = 3 × 4. On s’arrête quand les deux facteurs se croisent.
Cette méthode par paires garantit qu’aucun diviseur n’est oublié.

## Les diviseurs communs
Ceux de 18 : 1, 2, 3, 6, 9, 18. Ceux de 24 : 1, 2, 3, 4, 6, 8, 12, 24.
**Communs** : 1, 2, 3, 6 — le plus grand est **6**. Il sert à **simplifier** la fraction 18/24 d’un coup : 18/24 = **3/4**.

> Deux nombres qui n’ont que 1 comme diviseur commun sont dits **premiers entre eux** : la fraction qu’ils forment est déjà irréductible.

## Le lien avec les nombres premiers
Un nombre **premier** est un entier supérieur à 1 qui n’a **que deux** diviseurs : 1 et lui-même.`,
          },
          questions: [
            ['Si a = b × k avec k entier, que peut-on dire ?', ['a est un multiple de b et b est un diviseur de a', 'a est un diviseur de b', 'a et b sont premiers entre eux', 'a est nécessairement premier'], 0, 'Les deux phrases disent la même chose.'],
            ['Combien un nombre a-t-il de multiples ?', ['Une infinité', 'Un nombre fini', 'Autant que de diviseurs', 'Aucun'], 0, 'Ses diviseurs, eux, sont en nombre fini.'],
            ['Quels sont les diviseurs de 12 ?', ['1, 2, 3, 4, 6 et 12', '1, 2, 3, 6 et 12', '2, 3, 4 et 6', '1, 12 seulement'], 0, 'On les liste par paires : 1 × 12, 2 × 6, 3 × 4.'],
            ['Quel nombre est un multiple de tous les entiers ?', ['0', '1', '2', 'Il n’en existe pas'], 0, '0 = b × 0 pour tout b.'],
            ['Quel nombre divise tous les entiers ?', ['1', '0', '2', '10'], 0, 'On ne divise jamais par 0.'],
            ['Quel est le plus grand diviseur commun de 18 et 24 ?', ['6', '3', '12', '2'], 0, 'Il permet de simplifier 18/24 en 3/4 d’un coup.'],
            ['Que signifie « deux nombres premiers entre eux » ?', ['Leur seul diviseur commun est 1', 'Ce sont deux nombres premiers', 'Ils se suivent', 'Leur somme est première'], 0, 'La fraction qu’ils forment est déjà irréductible.'],
            ['Un nombre peut avoir une infinité de diviseurs.', ['Vrai', 'Faux'], 1, 'Ses diviseurs sont en nombre fini ; ce sont ses multiples qui sont infinis.'],
          ],
        },
        {
          titre: 'Critères de divisibilité',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Savoir sans poser l’opération',
            cours: `Un **critère de divisibilité** permet de savoir si un nombre est divisible par un autre **sans effectuer la division**.

## Les critères à connaître
- **par 2** : le nombre se termine par **0, 2, 4, 6 ou 8** (il est pair).
- **par 3** : la **somme de ses chiffres** est divisible par 3.
- **par 4** : le nombre formé par ses **deux derniers chiffres** est divisible par 4.
- **par 5** : il se termine par **0 ou 5**.
- **par 9** : la **somme de ses chiffres** est divisible par 9.
- **par 10** : il se termine par **0**.
- **par 25** : il se termine par 00, 25, 50 ou 75.

## Des exemples
- **2 358** : somme des chiffres = 2 + 3 + 5 + 8 = 18, divisible par 3 **et** par 9 → 2 358 est divisible par 3 et par 9. Il se termine par 8, donc aussi par 2.
- **1 236** : 36 est divisible par 4 → 1 236 est divisible par 4.
- **4 725** : se termine par 25 → divisible par 25 ; somme des chiffres = 18 → divisible par 9 ; se termine par 5 → divisible par 5.

## Combiner les critères
Un nombre divisible par 2 **et** par 3 est divisible par **6**.
Un nombre divisible par 3 **et** par 4 est divisible par **12**.
⚠️ Cela ne marche que si les deux diviseurs sont **premiers entre eux** : divisible par 2 et par 4 ne signifie pas divisible par 8.

## À quoi ça sert
- **Simplifier une fraction** sans tâtonner : on repère d’un coup d’œil un diviseur commun.
- **Décomposer** un nombre en facteurs premiers plus vite.
- Vérifier un résultat de calcul mental.

> Le critère de 9 sert aussi à la **preuve par neuf**, une vérification rapide de multiplication utilisée avant les calculatrices.`,
          },
          questions: [
            ['Quel est le critère de divisibilité par 3 ?', ['La somme des chiffres est divisible par 3', 'Le nombre se termine par 3', 'Le nombre est impair', 'Les deux derniers chiffres forment un multiple de 3'], 0, 'Exemple : 2 358 → 2 + 3 + 5 + 8 = 18.'],
            ['Quel est le critère de divisibilité par 4 ?', ['Les deux derniers chiffres forment un nombre divisible par 4', 'La somme des chiffres est divisible par 4', 'Le nombre se termine par 4', 'Le nombre est pair'], 0, '1 236 : 36 est divisible par 4.'],
            ['Quel est le critère de divisibilité par 9 ?', ['La somme des chiffres est divisible par 9', 'Le nombre se termine par 9', 'Le nombre est divisible par 3 deux fois', 'Les trois derniers chiffres sont divisibles par 9'], 0, 'C’est le même principe que pour 3.'],
            ['Par quoi 2 358 est-il divisible ?', ['Par 2, par 3 et par 9', 'Par 5 seulement', 'Par 4 et par 10', 'Par 25'], 0, 'Somme des chiffres = 18, et il se termine par 8.'],
            ['Quel critère caractérise la divisibilité par 5 ?', ['Le nombre se termine par 0 ou 5', 'Le nombre se termine par 5 uniquement', 'La somme des chiffres est divisible par 5', 'Le nombre est impair'], 0, 'Par 10, il faudrait se terminer par 0.'],
            ['Un nombre divisible par 2 et par 3 est divisible par quel nombre ?', ['6', '5', '8', '12'], 0, '2 et 3 sont premiers entre eux.'],
            ['À quoi servent surtout les critères de divisibilité ?', ['À simplifier une fraction et à décomposer un nombre plus vite', 'À poser une division', 'À calculer une moyenne', 'À convertir des unités'], 0, 'Ils évitent de tâtonner.'],
            ['Un nombre divisible par 2 et par 4 est forcément divisible par 8.', ['Vrai', 'Faux'], 1, '2 et 4 ne sont pas premiers entre eux : la règle de combinaison ne s’applique pas.'],
          ],
        },
        {
          titre: 'Pourcentages : calculs et quantité totale (suite)',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Remonter du pourcentage à la quantité de départ',
            cours: `Trois questions reviennent sans cesse, et chacune a son opération.

## 1. Calculer une partie
« Combien font t % de N ? » → **multiplier**.
18 % de 250 = 250 × 0,18 = **45**.

## 2. Calculer un pourcentage
« Quel pourcentage 45 représente-t-il de 250 ? » → **diviser, puis ×100**.
(45 ÷ 250) × 100 = **18 %**.

## 3. Retrouver la quantité totale
« 45 représente 18 % de quelle quantité ? » → **diviser par le coefficient**.
45 ÷ 0,18 = **250**.

> Le sens de l’opération se déduit de ce qu’on cherche : la **partie** se multiplie, le **tout** se divise. En cas de doute, un test rapide : le tout doit être **plus grand** que la partie.

## Retrouver un prix avant réduction
Un article soldé à 68 € après **−15 %** : le prix payé vaut 0,85 fois le prix initial.
Prix initial = 68 ÷ 0,85 = **80 €**.

⚠️ Erreur classique : ajouter 15 % à 68 € donnerait 78,20 € — un résultat faux, car les 15 % portaient sur le prix **initial**, pas sur le prix soldé.

## Retrouver un prix avant augmentation
Un article à 96 € après **+20 %** : prix initial = 96 ÷ 1,2 = **80 €**.

## Les évolutions successives
On **multiplie** les coefficients : +10 % puis −10 % donne 1,1 × 0,9 = 0,99, soit **−1 %**. On ne revient jamais au point de départ.

## Le taux d’évolution
**(finale − initiale) ÷ initiale × 100**. De 80 € à 96 € : (96 − 80) ÷ 80 × 100 = **+20 %**.`,
          },
          questions: [
            ['Comment calcule-t-on 18 % de 250 ?', ['250 × 0,18', '250 ÷ 0,18', '250 + 18', '18 ÷ 250'], 0, 'Chercher la partie, c’est multiplier.'],
            ['Quel pourcentage 45 représente-t-il de 250 ?', ['18 %', '45 %', '5,5 %', '20 %'], 0, '(45 ÷ 250) × 100.'],
            ['Si 45 représente 18 % d’une quantité, quelle est cette quantité ?', ['250', '81', '8,1', '450'], 0, 'Chercher le tout, c’est diviser par le coefficient.'],
            ['Un article soldé à 68 € après −15 % : quel était son prix initial ?', ['80 €', '78,20 €', '83 €', '57,80 €'], 0, '68 ÷ 0,85 ; ajouter 15 % à 68 donnerait un résultat faux.'],
            ['Un article coûte 96 € après une hausse de 20 %. Quel était son prix initial ?', ['80 €', '76,80 €', '115,20 €', '86 €'], 0, '96 ÷ 1,2.'],
            ['Une hausse de 10 % suivie d’une baisse de 10 % donne quel résultat ?', ['Une baisse de 1 %', 'Un retour au prix initial', 'Une hausse de 1 %', 'Une baisse de 20 %'], 0, '1,1 × 0,9 = 0,99.'],
            ['Comment calcule-t-on un taux d’évolution ?', ['(valeur finale − valeur initiale) ÷ valeur initiale × 100', '(finale − initiale) ÷ finale × 100', 'finale ÷ initiale', 'finale − initiale'], 0, 'On rapporte toujours l’écart à la valeur initiale.'],
            ['Pour retrouver un prix avant une remise de 15 %, il suffit d’ajouter 15 % au prix payé.', ['Vrai', 'Faux'], 1, 'Les 15 % portaient sur le prix initial : il faut diviser par 0,85.'],
          ],
        },
        {
          titre: 'Utiliser une échelle',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Du plan au terrain, et retour',
            cours: `## La définition
L’**échelle** d’un plan, d’une carte ou d’une maquette est le rapport :

**échelle = distance sur le plan ÷ distance réelle**, exprimées **dans la même unité**.

Elle s’écrit sous forme de fraction (1/25 000) ou de rapport (1 : 25 000), et n’a **pas d’unité**.

## Comment la lire
- **1/25 000** : 1 cm sur la carte représente 25 000 cm en réalité, soit **250 m**.
- **Échelle < 1** : c’est une **réduction** (cartes, plans).
- **Échelle > 1** : c’est un **agrandissement** (schéma d’un insecte, d’un circuit électronique).

## Les deux calculs
**Du plan vers le réel** : distance réelle = distance sur le plan **÷** échelle.
3 cm au 1/25 000 → 3 × 25 000 = 75 000 cm = **750 m**.

**Du réel vers le plan** : distance sur le plan = distance réelle **×** échelle.
2 km au 1/25 000 → 200 000 cm × 1/25 000 = **8 cm**.

## Les conversions, le vrai piège
1 m = 100 cm ; 1 km = 1 000 m = **100 000 cm**.
Il faut **tout convertir dans la même unité avant de calculer**, puis reconvertir dans l’unité demandée à la fin. La majorité des erreurs du chapitre viennent de là, pas du raisonnement.

## Aires et volumes
Une échelle porte sur les **longueurs**. Sur un plan au 1/100 :
- les longueurs sont divisées par 100 ;
- les **aires** par 100² = **10 000** ;
- les **volumes** par 100³.

> Un salon de 20 m² occupe donc 20 ÷ 10 000 = 0,002 m², soit **20 cm²**, sur un plan au 1/100.

## Les échelles courantes
Plan de maison : 1/50 ou 1/100. Plan de ville : 1/10 000. Carte de randonnée : 1/25 000. Carte routière : 1/200 000.`,
          },
          questions: [
            ['Comment se calcule une échelle ?', ['Distance sur le plan ÷ distance réelle, dans la même unité', 'Distance réelle ÷ distance sur le plan', 'Distance réelle × distance sur le plan', 'Distance sur le plan + distance réelle'], 0, 'Elle n’a pas d’unité.'],
            ['Que représente 1 cm sur une carte au 1/25 000 ?', ['250 m', '25 m', '2,5 km', '25 km'], 0, '25 000 cm = 250 m.'],
            ['Que signifie une échelle supérieure à 1 ?', ['C’est un agrandissement', 'C’est une réduction', 'L’échelle est fausse', 'Le plan est à taille réelle'], 0, 'Utile pour un insecte ou un circuit électronique.'],
            ['À quelle distance sur le plan correspondent 2 km au 1/25 000 ?', ['8 cm', '80 cm', '0,8 cm', '5 cm'], 0, '200 000 cm × 1/25 000.'],
            ['Combien de centimètres vaut 1 km ?', ['100 000 cm', '1 000 cm', '10 000 cm', '1 000 000 cm'], 0, 'C’est la conversion qui cause le plus d’erreurs.'],
            ['Par combien les aires sont-elles divisées sur un plan au 1/100 ?', ['10 000', '100', '1 000 000', '200'], 0, 'Les aires suivent le carré du rapport.'],
            ['Quelle surface occupe un salon de 20 m² sur un plan au 1/100 ?', ['20 cm²', '20 mm²', '2 cm²', '200 cm²'], 0, '20 ÷ 10 000 m², soit 0,002 m².'],
            ['Une échelle s’applique directement aux aires comme aux longueurs.', ['Vrai', 'Faux'], 1, 'Les aires sont divisées par le carré du rapport.'],
          ],
        },
        {
          titre: 'Grandeurs simples et grandeurs composées',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Ce qui se mesure directement, ce qui se calcule',
            cours: `## Les grandeurs simples
Elles se mesurent **directement**, avec un instrument :
- **longueur** (mètre, règle) ;
- **masse** (kilogramme, balance) ;
- **durée** (seconde, chronomètre) ;
- **température** (degré Celsius, thermomètre) ;
- **intensité** électrique (ampère, ampèremètre).

## Les grandeurs composées
Elles se **calculent** à partir de grandeurs simples, par multiplication ou par division.

**Par multiplication** (grandeurs produits) :
- aire = longueur × longueur → m²
- volume = longueur × longueur × longueur → m³
- énergie = puissance × durée → kWh

**Par division** (grandeurs quotients) :
- vitesse = distance ÷ durée → m/s
- masse volumique = masse ÷ volume → g/cm³
- débit = volume ÷ durée → L/min
- prix au kilo = prix ÷ masse → €/kg

## L’unité révèle la construction
C’est le point à retenir : **l’unité d’une grandeur composée dit comment elle se calcule**.
- « m² » : deux longueurs multipliées ;
- « km/h » : une distance divisée par une durée ;
- « kWh » : une puissance multipliée par une durée.

> Devant un exercice, lire l’unité **demandée** indique l’opération à faire, et vérifier l’unité **obtenue** valide le résultat. C’est la vérification la plus rapide qui soit.

## Grandeur, mesure et unité
Trois mots à distinguer :
- la **grandeur** est ce qu’on étudie (la longueur d’une table) ;
- la **mesure** est le nombre obtenu (1,20) ;
- l’**unité** précise à quoi ce nombre se rapporte (le mètre).

Un résultat sans unité n’a **aucun sens** : « la table mesure 1,20 » ne dit rien.`,
          },
          questions: [
            ['Qu’est-ce qu’une grandeur simple ?', ['Une grandeur qui se mesure directement avec un instrument', 'Une grandeur sans unité', 'Une grandeur toujours entière', 'Une grandeur calculée'], 0, 'Longueur, masse, durée, température.'],
            ['Qu’est-ce qu’une grandeur composée ?', ['Une grandeur calculée à partir d’autres grandeurs', 'Une grandeur mesurée deux fois', 'Une grandeur en plusieurs unités', 'Une grandeur approximative'], 0, 'Par multiplication ou par division.'],
            ['Quelle grandeur est un produit ?', ['L’aire', 'La vitesse', 'Le débit', 'La masse volumique'], 0, 'Longueur × longueur.'],
            ['Quelle grandeur est un quotient ?', ['Le débit', 'L’aire', 'Le volume', 'L’énergie en kWh'], 0, 'Volume divisé par durée.'],
            ['Que révèle l’unité d’une grandeur composée ?', ['La manière dont elle se calcule', 'Sa valeur approximative', 'L’instrument de mesure employé', 'Sa précision'], 0, '« km/h » dit qu’on divise une distance par une durée.'],
            ['Quelle est la différence entre grandeur, mesure et unité ?', ['La grandeur est ce qu’on étudie, la mesure le nombre, l’unité ce à quoi il se rapporte', 'Ce sont trois mots synonymes', 'La mesure est toujours entière', 'L’unité est facultative'], 0, '« La table mesure 1,20 » ne dit rien sans unité.'],
            ['Quelle est l’unité de l’énergie électrique domestique ?', ['Le kilowattheure', 'Le watt', 'Le volt', 'L’ampère'], 0, 'C’est une puissance multipliée par une durée.'],
            ['Un résultat peut être donné sans unité s’il est correct.', ['Vrai', 'Faux'], 1, 'Sans unité, le nombre ne signifie rien.'],
          ],
        },
        {
          titre: 'Convertir des unités de grandeurs simples',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Les tableaux de conversion',
            cours: `## Le système décimal
Les unités du système international se déduisent les unes des autres par des **puissances de 10**. Les préfixes :

**kilo (× 1 000) — hecto (× 100) — déca (× 10) — [unité] — déci (÷ 10) — centi (÷ 100) — milli (÷ 1 000)**

## Les longueurs
km — hm — dam — **m** — dm — cm — mm
Chaque colonne vaut **10 fois** la suivante.
- 1 km = 1 000 m ; 1 m = 100 cm ; 1 cm = 10 mm.
- 3,5 km = **3 500 m** ; 250 cm = **2,5 m**.

## Les masses
t — q — kg — hg — dag — **g** — dg — cg — mg
- 1 t = 1 000 kg ; 1 kg = 1 000 g ; 1 g = 1 000 mg.

## Les contenances
- 1 L = 100 cL = 1 000 mL ;
- **1 L = 1 dm³** et **1 mL = 1 cm³** : ce sont les deux égalités qui relient contenances et volumes.

## Les durées — l’exception
Elles ne sont **pas décimales** :
1 h = 60 min, 1 min = 60 s, 1 jour = 24 h.
- 1 h 30 = **1,5 h**, jamais 1,30 h ;
- 2 h 15 = 2,25 h ; 45 min = 0,75 h.
Pour convertir des minutes en heures décimales, on divise par 60.

## La méthode sûre
1. Écrire l’unité de départ dans un **tableau de conversion**, un chiffre par colonne ;
2. placer la virgule après la colonne de l’unité de départ ;
3. déplacer la virgule jusqu’à la colonne de l’unité d’arrivée, en complétant par des **zéros**.

> **Convertir vers une unité plus petite donne un nombre plus grand.** Ce test de vraisemblance repère instantanément une virgule déplacée dans le mauvais sens.`,
          },
          questions: [
            ['Combien de mètres vaut 1 km ?', ['1 000 m', '100 m', '10 000 m', '10 m'], 0, 'Chaque préfixe correspond à une puissance de 10.'],
            ['Combien de centimètres vaut 1 m ?', ['100 cm', '10 cm', '1 000 cm', '1 cm'], 0, 'Et 1 cm = 10 mm.'],
            ['Combien de grammes vaut 1 kg ?', ['1 000 g', '100 g', '10 000 g', '10 g'], 0, 'Et 1 t = 1 000 kg.'],
            ['À quel volume correspond 1 L ?', ['1 dm³', '1 cm³', '1 m³', '10 dm³'], 0, 'Et 1 mL = 1 cm³.'],
            ['Comment s’écrit 1 h 30 en heures décimales ?', ['1,5 h', '1,30 h', '1,3 h', '90 h'], 0, 'Les durées ne sont pas décimales : 30 min valent une demi-heure.'],
            ['Comment convertit-on des minutes en heures décimales ?', ['On divise par 60', 'On divise par 100', 'On multiplie par 60', 'On multiplie par 10'], 0, '45 min = 0,75 h.'],
            ['Que devient un nombre quand on convertit vers une unité plus petite ?', ['Il devient plus grand', 'Il devient plus petit', 'Il ne change pas', 'Il devient négatif'], 0, 'C’est le test de vraisemblance à faire systématiquement.'],
            ['Toutes les unités de mesure se convertissent par des puissances de 10.', ['Vrai', 'Faux'], 1, 'Les durées font exception : 60 s, 60 min, 24 h.'],
          ],
        },
        {
          titre: 'Convertir des unités de grandeurs composées',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Les aires, les volumes, les vitesses',
            cours: `Convertir une grandeur composée ne suit **pas** la règle des grandeurs simples : le rapport entre deux unités y est **élevé à une puissance**.

## Les aires : de 100 en 100
km² — hm² — dam² — **m²** — dm² — cm² — mm²
Chaque colonne vaut **100 fois** la suivante, parce qu’une aire est un produit de deux longueurs (10 × 10 = 100).

- 1 m² = **10 000 cm²** (et non 100) ;
- 1 km² = 1 000 000 m² ;
- 1 hectare (ha) = 1 hm² = **10 000 m²** ; 1 are (a) = 100 m².

**Dans un tableau de conversion, chaque unité d’aire occupe DEUX colonnes.**

## Les volumes : de 1 000 en 1 000
km³ — hm³ — dam³ — **m³** — dm³ — cm³ — mm³
Chaque colonne vaut **1 000 fois** la suivante (10 × 10 × 10).

- 1 m³ = **1 000 dm³** = 1 000 000 cm³ ;
- **1 dm³ = 1 L** et **1 cm³ = 1 mL** ;
- 1 m³ = **1 000 L**.

**Chaque unité de volume occupe TROIS colonnes.**

## Les vitesses
- **km/h → m/s** : diviser par **3,6** ;
- **m/s → km/h** : multiplier par **3,6**.

36 km/h = 10 m/s ; 20 m/s = 72 km/h.

L’origine du 3,6 : 1 km/h = 1 000 m ÷ 3 600 s.

## Les autres grandeurs quotients
On convertit **le numérateur et le dénominateur séparément** :
- 1 g/cm³ = 1 000 kg/m³ ;
- 1 L/min = 60 L/h ;
- 5 €/kg = 0,005 €/g.

> L’erreur la plus fréquente du chapitre : traiter une aire ou un volume comme une longueur. **1 m² ne fait pas 100 cm², mais 10 000.**`,
          },
          questions: [
            ['Combien de cm² vaut 1 m² ?', ['10 000 cm²', '100 cm²', '1 000 cm²', '1 000 000 cm²'], 0, 'Une aire est un produit de deux longueurs : le rapport est élevé au carré.'],
            ['Combien de colonnes une unité d’aire occupe-t-elle dans un tableau de conversion ?', ['Deux', 'Une', 'Trois', 'Quatre'], 0, 'Chaque colonne d’aire vaut 100 fois la suivante.'],
            ['Combien de dm³ vaut 1 m³ ?', ['1 000 dm³', '100 dm³', '10 dm³', '10 000 dm³'], 0, 'Un volume est un produit de trois longueurs.'],
            ['Combien de mètres carrés vaut 1 hectare ?', ['10 000 m²', '1 000 m²', '100 m²', '100 000 m²'], 0, '1 hectare = 1 hm².'],
            ['Combien de litres vaut 1 m³ ?', ['1 000 L', '100 L', '10 L', '1 000 000 L'], 0, 'Car 1 dm³ = 1 L.'],
            ['Comment convertit-on des km/h en m/s ?', ['On divise par 3,6', 'On multiplie par 3,6', 'On divise par 1 000', 'On multiplie par 60'], 0, '1 km/h = 1 000 m ÷ 3 600 s.'],
            ['À combien de kg/m³ correspond 1 g/cm³ ?', ['1 000 kg/m³', '1 kg/m³', '100 kg/m³', '10 000 kg/m³'], 0, 'On convertit numérateur et dénominateur séparément.'],
            ['Les unités d’aire se convertissent de 10 en 10, comme les longueurs.', ['Vrai', 'Faux'], 1, 'Elles se convertissent de 100 en 100 ; les volumes, de 1 000 en 1 000.'],
          ],
        },
        {
          titre: 'Caractéristiques des triangles',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Classer, construire, calculer',
            cours: `## La somme des angles
Dans **tout** triangle, la somme des trois angles vaut **180°**. C’est la propriété la plus utilisée du chapitre : connaissant deux angles, on trouve toujours le troisième.

## Les triangles particuliers
- **Isocèle** : deux côtés de même longueur. Les **angles à la base** sont alors égaux, et il a un **axe de symétrie**.
- **Équilatéral** : trois côtés égaux, donc trois angles de **60°** et trois axes de symétrie.
- **Rectangle** : un angle droit. Les deux autres angles sont **complémentaires** (leur somme vaut 90°). Le théorème de **Pythagore** s’y applique.
- **Rectangle isocèle** : un angle droit et deux angles de **45°**.

## L’inégalité triangulaire
Un triangle n’existe que si la **plus grande longueur est inférieure à la somme des deux autres**.
3, 4 et 9 : 3 + 4 = 7 < 9 → **ce triangle est impossible**.
Si la plus grande longueur **égale** la somme des deux autres, les trois points sont **alignés**.

## Les droites remarquables
- La **médiatrice** d’un côté : perpendiculaire à ce côté en son milieu. Les trois se coupent au **centre du cercle circonscrit**.
- La **hauteur** issue d’un sommet : perpendiculaire au côté opposé. Les trois se coupent à l’**orthocentre**.
- La **médiane** : joint un sommet au milieu du côté opposé. Les trois se coupent au **centre de gravité**, situé aux **deux tiers** de chaque médiane depuis le sommet.
- La **bissectrice** : partage un angle en deux angles égaux. Les trois se coupent au centre du **cercle inscrit**.

## L’aire
**aire = (base × hauteur) ÷ 2**, la hauteur étant celle **relative** à la base choisie. N’importe lequel des trois côtés peut servir de base, à condition de prendre la hauteur qui lui correspond.

> Dans un triangle **rectangle**, deux des côtés sont déjà perpendiculaires : ils servent directement de base et de hauteur.`,
          },
          questions: [
            ['Combien vaut la somme des angles d’un triangle ?', ['180°', '360°', '90°', 'Cela dépend du triangle'], 0, 'C’est vrai pour tout triangle.'],
            ['Que peut-on dire des angles d’un triangle équilatéral ?', ['Ils mesurent tous 60°', 'Ils mesurent tous 45°', 'Deux d’entre eux sont égaux', 'L’un d’eux est droit'], 0, '180° ÷ 3.'],
            ['Que dit l’inégalité triangulaire ?', ['La plus grande longueur doit être inférieure à la somme des deux autres', 'Les trois côtés doivent être différents', 'Le plus grand angle est opposé au plus petit côté', 'La somme des côtés vaut 180'], 0, '3, 4 et 9 ne forment pas un triangle.'],
            ['Que se passe-t-il si la plus grande longueur égale la somme des deux autres ?', ['Les trois points sont alignés', 'Le triangle est équilatéral', 'Le triangle est rectangle', 'Le triangle est isocèle'], 0, 'Le triangle est alors « aplati ».'],
            ['Où se coupent les trois médianes d’un triangle ?', ['Au centre de gravité', 'À l’orthocentre', 'Au centre du cercle circonscrit', 'Au centre du cercle inscrit'], 0, 'Aux deux tiers de chaque médiane depuis le sommet.'],
            ['Où se coupent les trois hauteurs ?', ['À l’orthocentre', 'Au centre de gravité', 'Au centre du cercle inscrit', 'Au milieu du plus grand côté'], 0, 'Les médiatrices, elles, donnent le centre du cercle circonscrit.'],
            ['Quelle est la formule de l’aire d’un triangle ?', ['(base × hauteur) ÷ 2', 'base × hauteur', '(base + hauteur) ÷ 2', 'côté²'], 0, 'La hauteur doit être relative à la base choisie.'],
            ['Dans un triangle isocèle, les trois angles sont égaux.', ['Vrai', 'Faux'], 1, 'Seuls les deux angles à la base le sont ; les trois angles égaux caractérisent l’équilatéral.'],
          ],
        },
      ],
    },
  ],
}
