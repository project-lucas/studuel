// Mathématiques — Cinquième : LE PROGRAMME COMPLET (26 fiches).
//
// LE DÉFAUT. La page « Maths » d'un élève de 5e s'ouvre sur CINQ fiches héritées
// du tout premier jeu de données (migration 008, contenu rempli par la 095) :
// « Nombres relatifs », « Fractions et calculs », « Calcul littéral :
// initiation », « Triangles et angles » et « Proportionnalité et pourcentages ».
// Cinq lignes pour l'année d'entrée dans le cycle 4.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 4 chapitres de la maquette de référence et
// leurs 26 fiches :
//   1. Nombres et calculs               (9)   3. Espace et géométrie          (9)
//   2. Organisation et gestion de données (7) 4. Cours de l'ancien programme  (1)
//
// LE CHAPITRE 4 EST DANS LA MAQUETTE, ET ON LE SUIT. « Cours de l'ancien
// programme » ne contient ici qu'une seule fiche — le calcul du volume d'un
// parallélépipède, d'un cube et d'une pyramide —, que le programme actuel ne
// place plus en 5e mais que les élèves rencontrent encore. Comme en 4e (301) et
// comme le chapitre « Anciens programmes » du français de 1re (260), elle est
// clairement étiquetée plutôt que mêlée au programme en vigueur.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (a × b, x², ≈).
//
// ⚠️ Le slug `maths` porte désormais CINQ modules (`maths-tle` = 255,
// `maths-1re` = 271, `maths-3e` = 294, `maths-4e` = 301, celui-ci = 308) : ne
// JAMAIS générer avec `--slugs maths`. Toujours `--modules maths-5e`.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 5e — LE PROGRAMME COMPLET (26 fiches)',

  motif: `CONSTAT : les maths de 5e n'avaient que les 5 fiches du premier jeu de données de
l'app — « Nombres relatifs », « Fractions et calculs », « Calcul littéral :
initiation », « Triangles et angles », « Proportionnalité et pourcentages ». Un
élève de 5e qui révisait les fractions décimales, les statistiques, le tableur,
les probabilités, la quatrième proportionnelle, les échelles, les prismes et
cylindres, les angles et le parallélisme, la symétrie centrale ou les
parallélogrammes ne trouvait RIEN. Cette migration installe les 26 fiches,
rangées sous les 4 chapitres de la maquette, et retire les 5 fiches génériques.
LE QUATRIÈME CHAPITRE EST ASSUMÉ : « Cours de l'ancien programme » ne contient
qu'une fiche, le calcul de volumes, que le programme actuel ne place plus en 5e —
clairement étiquetée plutôt que mêlée au programme en vigueur, comme en 4e.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 26 fiches sous 4 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 26 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 5e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « Nombres relatifs » et « Calcul
littéral : initiation » emploient les mots mêmes que le programme neuf, et un
ménage par titre demanderait de vérifier à chaque relecture qu'aucune fiche neuve
ne porte exactement l'un des cinq anciens libellés. Le critère « pas de chapitre
de programme » vise exactement les cinq lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 26 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '5e' est indispensable : les maths existent sur sept niveaux,
et la 4e comme la 3e sont traitées par leurs propres migrations.
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
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '5e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['5e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Nombres et calculs
        // ===================================================================
        {
          titre: 'Passer d’une écriture décimale à une écriture fractionnaire',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Le même nombre, deux vêtements',
            cours: `Un nombre **décimal** peut toujours s’écrire sous forme de **fraction décimale** — une fraction dont le dénominateur est 10, 100, 1 000…

## De la décimale à la fraction
On compte les chiffres après la virgule : ce nombre donne le nombre de zéros du dénominateur.
- 0,7 = **7/10** (un chiffre après la virgule)
- 3,45 = **345/100** (deux chiffres)
- 0,008 = **8/1000** (trois chiffres)

## De la fraction à la décimale
On divise le numérateur par le dénominateur, ou l’on déplace la virgule :
- 27/10 = **2,7**
- 9/100 = **0,09**
- 1250/1000 = **1,25**

## Simplifier ensuite
Une fraction décimale se simplifie souvent :
0,25 = 25/100 = **1/4** ; 0,5 = 5/10 = **1/2** ; 0,75 = 75/100 = **3/4**.

Ces trois équivalences valent d’être sues par cœur, avec 0,2 = 1/5 et 0,1 = 1/10.

## Toutes les fractions ne sont pas décimales
**1/3 = 0,3333…** ne s’arrête jamais : son écriture décimale est **illimitée périodique**. Une fraction donne un nombre décimal seulement si son dénominateur, une fois la fraction irréductible, ne contient que des **2** et des **5** comme facteurs premiers.

> 1/4, 1/8, 1/20, 1/25 sont décimales. 1/3, 1/6, 1/7, 1/9 ne le sont pas.

## Le vocabulaire à ne pas confondre
- **Fraction** : une écriture, a/b.
- **Quotient** : le résultat de la division.
- **Nombre décimal** : un nombre dont l’écriture décimale s’arrête.

## Pourquoi c’est utile
Passer d’une écriture à l’autre permet de **choisir la plus commode** : les fractions se simplifient et se calculent exactement, les décimaux se comparent et s’additionnent vite.`,
          },
          questions: [
            ['Comment s’écrit 0,7 sous forme de fraction décimale ?', ['7/10', '7/100', '70/10', '0,7/10'], 0, 'Un chiffre après la virgule, un zéro au dénominateur.'],
            ['Comment s’écrit 3,45 sous forme de fraction ?', ['345/100', '345/10', '34,5/10', '3,45/100'], 0, 'Deux chiffres après la virgule, deux zéros.'],
            ['Que vaut 27/10 en écriture décimale ?', ['2,7', '0,27', '27,10', '270'], 0, 'On déplace la virgule d’un rang.'],
            ['À quelle fraction irréductible correspond 0,25 ?', ['1/4', '1/2', '2/5', '25/10'], 0, '25/100 simplifié par 25.'],
            ['À quelle fraction irréductible correspond 0,75 ?', ['3/4', '7/5', '75/10', '3/5'], 0, '75/100 simplifié par 25.'],
            ['L’écriture décimale de 1/3 s’arrête-t-elle ?', ['Non, elle est illimitée périodique : 0,3333…', 'Oui, elle vaut 0,33', 'Oui, elle vaut 0,333', 'Elle n’existe pas'], 0, 'Toutes les fractions ne sont pas décimales.'],
            ['À quelle condition une fraction irréductible donne-t-elle un nombre décimal ?', ['Son dénominateur ne contient que des facteurs 2 et 5', 'Son numérateur est pair', 'Son dénominateur est premier', 'Son numérateur est plus grand que son dénominateur'], 0, '1/4 et 1/20 sont décimales, 1/3 et 1/7 ne le sont pas.'],
            ['Tout nombre décimal peut s’écrire sous forme de fraction.', ['Vrai', 'Faux'], 0, 'Il suffit de prendre pour dénominateur une puissance de 10.'],
          ],
        },
        {
          titre: 'Calculer avec des nombres décimaux',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Les quatre opérations, et l’ordre dans lequel les faire',
            cours: `## Addition et soustraction
On **aligne les virgules**, quitte à compléter par des **zéros** pour que tous les nombres aient autant de décimales.
12,5 + 3,75 → 12,50 + 3,75 = **16,25**

## Multiplication
On multiplie **sans tenir compte des virgules**, puis on place la virgule dans le résultat : le produit a **autant de décimales que les deux facteurs réunis**.
3,2 × 1,5 : 32 × 15 = 480 ; deux décimales au total → **4,80** soit 4,8.

## Division
On ne divise **jamais** par un nombre à virgule : on **multiplie le diviseur et le dividende par 10, 100 ou 1 000** pour rendre le diviseur entier.
7,5 ÷ 0,25 → 750 ÷ 25 = **30**.

## Les priorités opératoires
1. les **parenthèses**, de la plus intérieure à la plus extérieure ;
2. les **puissances** ;
3. les **multiplications et divisions**, de gauche à droite ;
4. les **additions et soustractions**, de gauche à droite.

2 + 3 × 4 = 2 + 12 = **14**, et non 20.

## Multiplier et diviser par 10, 100, 1 000
- **multiplier** : la virgule se déplace vers la **droite** ;
- **diviser** : vers la **gauche**.
On complète par des zéros si nécessaire.

## L’ordre de grandeur
Avant de calculer, on estime : 19,8 × 4,9 est proche de 20 × 5 = 100. Si la calculatrice affiche 9,7 ou 970, c’est qu’une virgule s’est déplacée.

> Un résultat qu’on n’a pas estimé d’abord est un résultat qu’on ne peut pas vérifier.

## Les arrondis
Arrondir **au dixième**, c’est garder un chiffre après la virgule : on regarde le chiffre suivant, on arrondit au supérieur s’il vaut 5 ou plus. 3,47 → **3,5** ; 3,44 → **3,4**.`,
          },
          questions: [
            ['Que faut-il faire avant d’additionner deux décimaux ?', ['Aligner les virgules', 'Supprimer les virgules', 'Multiplier par 10', 'Arrondir les nombres'], 0, 'On complète par des zéros si nécessaire.'],
            ['Combien de décimales a le produit 3,2 × 1,5 ?', ['Deux', 'Une', 'Trois', 'Aucune'], 0, 'Autant que les deux facteurs réunis.'],
            ['Comment divise-t-on par un nombre à virgule ?', ['On multiplie diviseur et dividende par 10, 100 ou 1 000', 'On supprime la virgule du diviseur seulement', 'On arrondit le diviseur', 'On inverse la division'], 0, '7,5 ÷ 0,25 devient 750 ÷ 25.'],
            ['Combien vaut 2 + 3 × 4 ?', ['14', '20', '24', '9'], 0, 'La multiplication est prioritaire sur l’addition.'],
            ['Quel est l’ordre des priorités opératoires ?', ['Parenthèses, puissances, multiplications et divisions, additions et soustractions', 'Additions, multiplications, parenthèses', 'De gauche à droite toujours', 'Puissances, parenthèses, additions'], 0, 'Les opérations de même rang se font de gauche à droite.'],
            ['Que fait la multiplication par 100 sur la virgule ?', ['Elle la déplace de deux rangs vers la droite', 'Elle la déplace de deux rangs vers la gauche', 'Elle la supprime', 'Elle ne change rien'], 0, 'La division la déplacerait vers la gauche.'],
            ['Combien vaut 3,47 arrondi au dixième ?', ['3,5', '3,4', '3,47', '4'], 0, 'Le chiffre suivant vaut 7, donc on arrondit au supérieur.'],
            ['Il est inutile d’estimer un ordre de grandeur avant de calculer.', ['Vrai', 'Faux'], 1, 'C’est ce qui permet de repérer une virgule mal placée.'],
          ],
        },
        {
          titre: 'Les fractions décimales',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Les fractions qui tombent juste',
            cours: `## La définition
Une **fraction décimale** est une fraction dont le **dénominateur est une puissance de 10** : 10, 100, 1 000, 10 000…

Exemples : 3/10, 47/100, 8/1000.

## Le lien avec les décimaux
Toute fraction décimale s’écrit avec une virgule, et réciproquement :
- 3/10 = **0,3**
- 47/100 = **0,47**
- 8/1000 = **0,008**
- 125/10 = **12,5**

La règle : le **nombre de zéros** du dénominateur donne le **nombre de rangs** dont la virgule se déplace vers la gauche.

## Le tableau de numération
| centaines | dizaines | unités | , | dixièmes | centièmes | millièmes |
|---|---|---|---|---|---|---|

Chaque chiffre après la virgule a un nom et une valeur : dans 3,472, le 4 vaut 4 **dixièmes**, le 7 vaut 7 **centièmes**, le 2 vaut 2 **millièmes**.

D’où la **décomposition** : 3,472 = 3 + 4/10 + 7/100 + 2/1000.

## Additionner des fractions décimales
Il suffit de les mettre au **même dénominateur**, c’est-à-dire à la même puissance de 10 :
3/10 + 47/100 = 30/100 + 47/100 = **77/100** = 0,77.

## Reconnaître une fraction décimale déguisée
Certaines fractions ne l’ont pas l’air, mais s’y ramènent :
- 1/4 = 25/100 = **0,25**
- 3/5 = 6/10 = **0,6**
- 7/8 = 875/1000 = **0,875**

Il suffit de multiplier numérateur et dénominateur par le nombre qui transforme le dénominateur en puissance de 10.

> Une fraction se ramène à une fraction décimale si et seulement si son dénominateur irréductible n’a que des **2** et des **5** comme facteurs.

## Les usages
Prix, mesures, pourcentages, résultats de mesures scientifiques : partout où l’on écrit avec une virgule, on manipule en réalité des fractions décimales.`,
          },
          questions: [
            ['Qu’est-ce qu’une fraction décimale ?', ['Une fraction dont le dénominateur est une puissance de 10', 'Une fraction dont le numérateur est décimal', 'Une fraction inférieure à 1', 'Une fraction irréductible'], 0, '10, 100, 1 000…'],
            ['Que vaut 47/100 en écriture décimale ?', ['0,47', '4,7', '47,100', '0,047'], 0, 'Deux zéros, deux rangs de décalage.'],
            ['Que vaut 8/1000 ?', ['0,008', '0,08', '0,8', '8,000'], 0, 'Trois zéros au dénominateur.'],
            ['Dans le nombre 3,472, que vaut le chiffre 7 ?', ['7 centièmes', '7 dixièmes', '7 millièmes', '7 unités'], 0, 'C’est le deuxième chiffre après la virgule.'],
            ['Quelle est la décomposition de 3,472 ?', ['3 + 4/10 + 7/100 + 2/1000', '3 + 472/10', '34 + 72/100', '3 + 4/100 + 7/10 + 2/1000'], 0, 'Chaque chiffre a sa valeur de position.'],
            ['Combien font 3/10 + 47/100 ?', ['77/100', '50/110', '77/110', '50/100'], 0, 'On met au même dénominateur avant d’additionner.'],
            ['À quelle fraction décimale correspond 7/8 ?', ['875/1000', '78/100', '7/80', '87/100'], 0, 'On multiplie les deux termes par 125.'],
            ['Toute fraction peut s’écrire comme une fraction décimale.', ['Vrai', 'Faux'], 1, 'Seulement si son dénominateur irréductible n’a que des facteurs 2 et 5.'],
          ],
        },
        {
          titre: 'Les nombres relatifs',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Au-dessus et en dessous de zéro',
            cours: `## La définition
Un **nombre relatif** est un nombre précédé d’un **signe** : **+** s’il est positif, **−** s’il est négatif. **Zéro** est le seul nombre à la fois positif et négatif — il n’a pas de signe.

Le signe **+** est facultatif à l’écriture : +5 s’écrit habituellement 5.

## À quoi ça sert
Les relatifs permettent de mesurer **de part et d’autre d’une origine** :
- températures : −7 °C, +23 °C ;
- altitudes : +8 849 m pour l’Everest, −400 m pour la mer Morte ;
- comptes bancaires, étages d’un immeuble, dates avant ou après J.-C., scores dans un jeu.

## La droite graduée
On place les nombres sur une droite, avec une **origine** (le zéro) et une **unité** :
- les **positifs** à droite du zéro ;
- les **négatifs** à gauche ;
- deux nombres **opposés** — comme −3 et +3 — sont **symétriques** par rapport à l’origine.

## La distance à zéro
C’est le nombre **sans son signe** : la distance à zéro de −7 est **7**, celle de +7 est **7** également. Deux nombres opposés ont la même distance à zéro.

## Comparer deux relatifs
Sur la droite graduée, le plus grand est celui qui est le plus **à droite**.
- Un **positif** est toujours supérieur à un **négatif** ;
- entre deux **positifs**, le plus grand a la plus grande distance à zéro : 7 > 3 ;
- entre deux **négatifs**, c’est **l’inverse** : **−3 > −7**, parce que −3 est plus près de zéro.

> C’est la seule vraie difficulté du chapitre : chez les négatifs, plus le nombre « paraît grand », plus il est **petit**. Un jour à −15 °C est plus froid qu’un jour à −5 °C.

## Le repérage dans le plan
Deux droites graduées perpendiculaires forment un **repère**. Chaque point y est repéré par un couple : l’**abscisse** (horizontale) puis l’**ordonnée** (verticale), dans cet ordre. Le point (0 ; 0) est l’**origine**.`,
          },
          questions: [
            ['Qu’est-ce qu’un nombre relatif ?', ['Un nombre précédé d’un signe + ou −', 'Un nombre à virgule', 'Un nombre entier uniquement', 'Une fraction'], 0, 'Zéro est le seul à n’être ni positif ni négatif au sens strict.'],
            ['Où se placent les nombres négatifs sur une droite graduée ?', ['À gauche du zéro', 'À droite du zéro', 'Au-dessus de la droite', 'Ils ne s’y placent pas'], 0, 'Les positifs sont à droite.'],
            ['Quelle est la distance à zéro de −7 ?', ['7', '−7', '0', '14'], 0, 'C’est le nombre sans son signe.'],
            ['Quel nombre est le plus grand : −3 ou −7 ?', ['−3', '−7', 'Ils sont égaux', 'On ne peut pas comparer'], 0, '−3 est plus proche de zéro, donc plus à droite.'],
            ['Quels sont les nombres opposés de −5 ?', ['+5', '−1/5', '0', '5 et −5'], 0, 'Deux opposés sont symétriques par rapport à l’origine.'],
            ['Un nombre positif peut-il être inférieur à un nombre négatif ?', ['Non, jamais', 'Oui, si le négatif est grand', 'Oui, si le positif est petit', 'Cela dépend de la droite graduée'], 0, 'Tout positif est à droite de tout négatif.'],
            ['Dans un repère, dans quel ordre lit-on les coordonnées d’un point ?', ['L’abscisse puis l’ordonnée', 'L’ordonnée puis l’abscisse', 'Peu importe l’ordre', 'La plus grande d’abord'], 0, 'Horizontale d’abord, verticale ensuite.'],
            ['Une température de −15 °C est plus douce qu’une température de −5 °C.', ['Vrai', 'Faux'], 1, 'C’est le piège du chapitre : −15 est plus petit que −5.'],
          ],
        },
        {
          titre: 'Additionner et soustraire des nombres relatifs',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Deux règles, et une simplification',
            cours: `## Additionner deux relatifs
**Mêmes signes** : on **additionne** les distances à zéro et on garde le **signe commun**.
(−5) + (−3) = **−8** ; (+4) + (+6) = **+10**

**Signes différents** : on **soustrait** la plus petite distance à zéro de la plus grande, et on garde le signe de celui qui a la **plus grande** distance à zéro.
(−9) + (+4) = **−5** ; (+9) + (−4) = **+5**

Une image : les négatifs sont des dettes, les positifs des gains. On fait le bilan.

## Soustraire, c’est ajouter l’opposé
C’est **la** règle du chapitre :

**a − b = a + (opposé de b)**

- 5 − (+3) = 5 + (−3) = **2**
- 5 − (−3) = 5 + (+3) = **8**
- (−4) − (−7) = (−4) + (+7) = **+3**

> Soustraire un nombre négatif revient donc à **ajouter** : c’est contre-intuitif, mais c’est la clé de tous les exercices.

## Simplifier l’écriture
On peut retirer les parenthèses et les signes + inutiles en appliquant :
- **+ (+a) = + a**
- **+ (−a) = − a**
- **− (+a) = − a**
- **− (−a) = + a**

3 + (−5) − (−2) s’écrit **3 − 5 + 2 = 0**.

## Calculer une somme longue
Deux méthodes également valables :
1. de gauche à droite, terme après terme ;
2. en regroupant tous les **positifs** d’un côté, tous les **négatifs** de l’autre, puis en faisant le bilan — souvent plus rapide et plus sûr.

−7 + 12 − 4 + 3 − 6 : positifs 12 + 3 = 15 ; négatifs 7 + 4 + 6 = 17 ; bilan **−2**.

## Vérifier
Un ordre de grandeur suffit : si les négatifs l’emportent nettement, le résultat doit être négatif.`,
          },
          questions: [
            ['Combien vaut (−5) + (−3) ?', ['−8', '−2', '+8', '+2'], 0, 'Mêmes signes : on additionne et on garde le signe.'],
            ['Combien vaut (−9) + (+4) ?', ['−5', '+5', '−13', '+13'], 0, 'Signes différents : on soustrait et on garde le signe du plus grand en distance à zéro.'],
            ['Que signifie « soustraire, c’est ajouter l’opposé » ?', ['a − b = a + (opposé de b)', 'a − b = b − a', 'a − b = −(a + b)', 'a − b = a × (−b)'], 0, 'C’est la règle centrale du chapitre.'],
            ['Combien vaut 5 − (−3) ?', ['8', '2', '−8', '−2'], 0, 'Soustraire un négatif revient à ajouter.'],
            ['Combien vaut (−4) − (−7) ?', ['+3', '−11', '−3', '+11'], 0, '(−4) + (+7).'],
            ['Que devient l’écriture − (−a) ?', ['+ a', '− a', '0', '−2a'], 0, 'Deux signes moins se transforment en plus.'],
            ['Combien vaut −7 + 12 − 4 + 3 − 6 ?', ['−2', '+2', '−32', '+32'], 0, 'Positifs 15, négatifs 17 : bilan −2.'],
            ['Ajouter un nombre négatif augmente toujours le résultat.', ['Vrai', 'Faux'], 1, 'Cela revient à soustraire : le résultat diminue.'],
          ],
        },
        {
          titre: 'Les fractions',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Écrire un quotient, et le simplifier',
            cours: `## Ce qu’est une fraction
La fraction **a/b** désigne le **quotient** de a par b, avec **b non nul**.
- **a** est le **numérateur** — ce qu’on prend ;
- **b** est le **dénominateur** — en combien de parts on partage.

3/4 se lit « trois quarts » : le tout est partagé en 4, on en prend 3.

## La propriété fondamentale
On ne change pas la valeur d’une fraction en **multipliant** ou en **divisant** le numérateur ET le dénominateur par un même nombre **non nul** :

a/b = (a × k)/(b × k) = (a ÷ k)/(b ÷ k)

C’est d’elle que découlent la simplification et la mise au même dénominateur.

## Simplifier
On divise haut et bas par un **diviseur commun** :
18/24 = **3/4** (on divise par 6).

Une fraction est **irréductible** quand on ne peut plus la simplifier.

## Prendre une fraction d’une quantité
Le mot « **de** » se traduit par **×** :
les 3/4 de 60 = 60 × 3/4 = **45**. En pratique : 60 ÷ 4 = 15, puis 15 × 3 = 45.

## Comparer une fraction à 1
- a/b **< 1** si a < b (3/4) ;
- a/b **= 1** si a = b (5/5) ;
- a/b **> 1** si a > b (7/4).

C’est le premier réflexe de vérification.

## Les écritures particulières
a/1 = a · a/a = 1 · 0/a = 0 · et **a/0 n’existe pas** : on ne divise jamais par zéro.

## Fraction et nombre décimal
Toute fraction est un **quotient** ; toutes ne sont pas des nombres **décimaux**. 3/4 = 0,75 s’arrête ; 1/3 = 0,333… ne s’arrête pas.

> La fraction dit la valeur **exacte** ; l’écriture décimale n’en donne parfois qu’une valeur approchée. En mathématiques, on garde la fraction le plus longtemps possible.`,
          },
          questions: [
            ['Que désigne le dénominateur d’une fraction ?', ['Le nombre de parts en lesquelles on partage le tout', 'Le nombre de parts qu’on prend', 'Le résultat de la division', 'La valeur approchée'], 0, 'Le numérateur dit combien de parts on prend.'],
            ['Que peut-on faire sans changer la valeur d’une fraction ?', ['Multiplier ou diviser les deux termes par un même nombre non nul', 'Ajouter le même nombre en haut et en bas', 'Échanger numérateur et dénominateur', 'Soustraire 1 aux deux termes'], 0, 'C’est la propriété fondamentale.'],
            ['Quelle est la forme irréductible de 18/24 ?', ['3/4', '9/12', '6/8', '2/3'], 0, 'On divise les deux termes par 6.'],
            ['Combien font les 3/4 de 60 ?', ['45', '80', '20', '15'], 0, '60 ÷ 4 = 15, puis 15 × 3.'],
            ['Quand une fraction est-elle supérieure à 1 ?', ['Quand son numérateur est plus grand que son dénominateur', 'Quand son dénominateur est plus grand', 'Quand elle est irréductible', 'Quand son numérateur est pair'], 0, '7/4 est supérieur à 1.'],
            ['Que vaut a/a, pour a non nul ?', ['1', '0', 'a', 'Cela n’existe pas'], 0, 'En revanche a/0 n’a pas de sens.'],
            ['Pourquoi garde-t-on souvent la fraction plutôt que sa valeur décimale ?', ['Parce que la fraction donne la valeur exacte', 'Parce qu’elle est plus courte', 'Parce qu’elle est plus facile à additionner', 'Parce qu’elle est toujours inférieure à 1'], 0, '1/3 n’a pas d’écriture décimale exacte.'],
            ['On peut écrire une fraction dont le dénominateur est zéro.', ['Vrai', 'Faux'], 1, 'On ne divise jamais par zéro.'],
          ],
        },
        {
          titre: 'Comparer, additionner, soustraire des fractions',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Tout passe par le même dénominateur',
            cours: `## Comparer
**Même dénominateur** : on compare les **numérateurs**. 5/7 > 3/7.

**Même numérateur** : plus le dénominateur est **grand**, plus la fraction est **petite**. 3/10 < 3/4 — partager en 10 donne des parts plus petites qu’en 4.

**Cas général** : on **réduit au même dénominateur**, puis on compare.
2/3 et 3/5 → 10/15 et 9/15 → **2/3 > 3/5**.

## Réduire au même dénominateur
On cherche un **multiple commun** aux deux dénominateurs. Le produit des deux marche toujours ; le **plus petit multiple commun** donne des nombres plus simples.
- pour 3 et 5 : 15 ;
- pour 4 et 6 : 12 (et non 24, plus lourd) ;
- quand l’un est multiple de l’autre, il suffit : pour 3 et 12, on prend 12.

## Additionner et soustraire
1. Réduire au même dénominateur ;
2. additionner (ou soustraire) les **numérateurs** ;
3. garder le **dénominateur commun** ;
4. **simplifier** le résultat.

2/3 + 1/4 = 8/12 + 3/12 = **11/12**
5/6 − 1/2 = 5/6 − 3/6 = 2/6 = **1/3**

> **On n’additionne JAMAIS les dénominateurs.** 1/2 + 1/3 ne fait pas 2/5 — et le bon sens le confirme : 2/5 est plus petit que 1/2, alors qu’on vient d’ajouter quelque chose.

## Avec un entier
Un entier s’écrit sur 1 : 2 + 3/4 = 8/4 + 3/4 = **11/4**.

## Vérifier son résultat
- Le résultat d’une addition de fractions positives doit être **plus grand** que chacune d’elles.
- Une valeur décimale approchée permet un contrôle rapide : 11/12 ≈ 0,92, et 2/3 + 1/4 ≈ 0,67 + 0,25 = 0,92. ✔`,
          },
          questions: [
            ['Comment compare-t-on deux fractions de même dénominateur ?', ['On compare les numérateurs', 'On compare les dénominateurs', 'On les convertit en décimaux obligatoirement', 'On additionne les deux'], 0, '5/7 est supérieur à 3/7.'],
            ['Entre 3/10 et 3/4, laquelle est la plus grande ?', ['3/4', '3/10', 'Elles sont égales', 'On ne peut pas savoir'], 0, 'À numérateur égal, un plus grand dénominateur donne une plus petite fraction.'],
            ['Quel dénominateur commun choisir pour 4 et 6 ?', ['12', '24', '10', '6'], 0, 'Le plus petit multiple commun donne des nombres plus simples.'],
            ['Combien font 2/3 + 1/4 ?', ['11/12', '3/7', '2/12', '3/12'], 0, '8/12 + 3/12.'],
            ['Combien font 5/6 − 1/2 ?', ['1/3', '4/4', '5/12', '2/3'], 0, '5/6 − 3/6 = 2/6, simplifié en 1/3.'],
            ['Comment additionne-t-on 2 et 3/4 ?', ['On écrit 2 sous la forme 8/4', 'On additionne 2 au numérateur', 'On additionne 2 au dénominateur', 'On multiplie 2 par 3/4'], 0, 'Un entier s’écrit sur 1, puis on réduit.'],
            ['Que devient le dénominateur lors d’une addition de fractions ?', ['Il reste le dénominateur commun', 'Il s’additionne', 'Il se multiplie', 'Il disparaît'], 0, 'Seuls les numérateurs s’additionnent.'],
            ['1/2 + 1/3 fait 2/5.', ['Vrai', 'Faux'], 1, 'Cela vaut 5/6 : on n’additionne jamais les dénominateurs.'],
          ],
        },
        {
          titre: 'Division euclidienne et nombres premiers',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Quotient, reste, multiples et diviseurs',
            cours: `## La division euclidienne
Diviser un entier **a** par un entier **b** non nul, c’est trouver **q** et **r** tels que :

**a = b × q + r**, avec **0 ≤ r < b**

47 = 5 × 9 + 2 : quotient **9**, reste **2**. Le reste est toujours **inférieur au diviseur** — sinon le quotient est trop petit.

## Multiples et diviseurs
Quand le **reste est nul**, trois formulations disent la même chose :
- a est **divisible** par b ;
- b est un **diviseur** de a ;
- a est un **multiple** de b.

Les multiples d’un nombre sont **infinis** ; ses diviseurs sont en **nombre fini**. Les diviseurs de 12 : 1, 2, 3, 4, 6, 12.

## Les critères de divisibilité
- **par 2** : se termine par 0, 2, 4, 6, 8 ;
- **par 3** : la somme des chiffres est divisible par 3 ;
- **par 4** : les deux derniers chiffres forment un multiple de 4 ;
- **par 5** : se termine par 0 ou 5 ;
- **par 9** : la somme des chiffres est divisible par 9 ;
- **par 10** : se termine par 0.

## Les nombres premiers
Un **nombre premier** est un entier **supérieur à 1** qui n’a que **deux diviseurs** : 1 et lui-même.
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37…
- **2 est le seul pair** ;
- **1 n’est pas premier** ;
- il en existe une **infinité**.

## La décomposition
Tout entier supérieur à 1 s’écrit d’une seule façon comme produit de facteurs premiers :
60 = 2 × 30 = 2 × 2 × 15 = **2² × 3 × 5**

## À quoi ça sert
- **Simplifier une fraction** : on décompose haut et bas, on barre les facteurs communs. 18/24 = (2 × 3²)/(2³ × 3) = **3/4**.
- Trouver un **dénominateur commun**.
- Reconnaître deux nombres **premiers entre eux** — sans facteur commun : leur fraction est déjà irréductible.

> Les nombres premiers sont les briques : tout entier se construit avec eux, d’une seule manière.`,
          },
          questions: [
            ['Quelle égalité définit la division euclidienne ?', ['a = b × q + r, avec 0 ≤ r < b', 'a = b × q, sans reste', 'a = b + q + r', 'a = (b + q) × r'], 0, 'Le reste est toujours inférieur au diviseur.'],
            ['Quel est le reste de la division de 47 par 5 ?', ['2', '9', '7', '5'], 0, '47 = 5 × 9 + 2.'],
            ['Que dit-on quand le reste est nul ?', ['a est divisible par b, b est un diviseur de a, a est un multiple de b', 'a est premier', 'b est premier', 'La division est impossible'], 0, 'Trois formulations pour une même relation.'],
            ['Qu’est-ce qu’un nombre premier ?', ['Un entier supérieur à 1 qui n’a que deux diviseurs', 'Un entier impair', 'Un entier divisible par 2', 'Le premier d’une liste'], 0, '1 et lui-même.'],
            ['Quel est le seul nombre premier pair ?', ['2', '4', '0', 'Il n’y en a pas'], 0, 'Tout autre nombre pair est divisible par 2.'],
            ['Quelle est la décomposition en facteurs premiers de 60 ?', ['2² × 3 × 5', '2 × 3 × 10', '4 × 15', '2³ × 3 × 5'], 0, 'On divise successivement par le plus petit facteur premier.'],
            ['Quel est le critère de divisibilité par 3 ?', ['La somme des chiffres est divisible par 3', 'Le nombre se termine par 3', 'Le nombre est impair', 'Le nombre est divisible par 9'], 0, 'Le même principe vaut pour 9.'],
            ['1 est un nombre premier.', ['Vrai', 'Faux'], 1, 'Il n’a qu’un seul diviseur, alors que la définition en exige deux.'],
          ],
        },
        {
          titre: 'Le calcul littéral',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Calculer avec des lettres',
            cours: `## Pourquoi des lettres ?
Une lettre représente un nombre **quelconque** ou **inconnu**. Elle permet d’écrire une règle **une fois pour toutes** : le périmètre d’un carré de côté c vaut **4 × c**, quel que soit c.

## Les conventions d’écriture
- On **n’écrit pas** le signe × devant une lettre ou une parenthèse : 3 × x s’écrit **3x**, 5 × (x + 2) s’écrit **5(x + 2)** ;
- **1 × x** s’écrit **x** ;
- **x × x** s’écrit **x²** ;
- le **coefficient** se place avant la lettre : on écrit 3x, pas x3.

## Substituer une valeur
Remplacer la lettre par un nombre, en **rétablissant les signes ×** :
pour A = 3x + 5 et x = 4 : A = 3 × 4 + 5 = **17**.

Attention aux priorités : la multiplication d’abord.

## Réduire une expression
On regroupe les termes de **même nature** :
- 3x + 5x = **8x** ;
- 3x + 5 + 2x − 1 = **5x + 4** ;
- 3x et 3x² ne se regroupent **jamais** — ce ne sont pas les mêmes objets.

## Développer
**Simple distributivité** : k(a + b) = **ka + kb**
- 3(x + 5) = **3x + 15**
- 4(2x − 3) = **8x − 12**

⚠️ Le signe **moins** devant une parenthèse change **tous** les signes : −(x − 4) = **−x + 4**.

## Factoriser
L’opération inverse : on repère un **facteur commun**.
- 5x + 15 = **5(x + 3)**
- 7a − 7b = **7(a − b)**
- x² + 3x = **x(x + 3)**

## Tester une égalité
Une égalité littérale est **vraie pour toutes les valeurs** si, développées et réduites, les deux expressions sont identiques. Pour prouver qu’elle est **fausse**, un seul **contre-exemple** suffit.

> Le calcul littéral n’est pas une abstraction gratuite : c’est ce qui permet de démontrer qu’un programme de calcul donne toujours le même résultat, quel que soit le nombre choisi.`,
          },
          questions: [
            ['Comment écrit-on 3 × x ?', ['3x', 'x3', '3.x', '3 fois x'], 0, 'Le coefficient se place avant la lettre.'],
            ['Comment écrit-on x × x ?', ['x²', '2x', 'xx', 'x + x'], 0, '2x signifierait x + x.'],
            ['Que vaut 3x + 5 pour x = 4 ?', ['17', '32', '12', '20'], 0, 'La multiplication est prioritaire.'],
            ['Comment réduire 3x + 5 + 2x − 1 ?', ['5x + 4', '5x + 6', '6x + 4', '10x'], 0, 'On regroupe les termes de même nature.'],
            ['Que donne le développement de 4(2x − 3) ?', ['8x − 12', '8x − 3', '6x − 12', '8x + 12'], 0, 'Chaque terme de la parenthèse est multiplié par 4.'],
            ['Que devient −(x − 4) ?', ['−x + 4', '−x − 4', 'x − 4', 'x + 4'], 0, 'Le signe moins change tous les signes de la parenthèse.'],
            ['Quelle est la forme factorisée de x² + 3x ?', ['x(x + 3)', '3x(x + 1)', '(x + 3)²', 'x²(1 + 3)'], 0, 'Le facteur commun est x.'],
            ['Trois exemples qui fonctionnent suffisent à prouver qu’une égalité littérale est vraie.', ['Vrai', 'Faux'], 1, 'Il faut développer et réduire les deux membres ; un contre-exemple suffit en revanche à la réfuter.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Organisation et gestion de données
        // ===================================================================
        {
          titre: 'Les statistiques',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Recueillir, ranger, représenter',
            cours: `## Le vocabulaire
- La **population** : l’ensemble étudié (les élèves d’un collège).
- L’**individu** : un élément de cette population.
- Le **caractère** : ce qu’on observe.
  - **quantitatif** s’il se mesure (taille, note, nombre de frères) ;
  - **qualitatif** sinon (sport pratiqué, couleur des yeux).
- L’**effectif** d’une valeur : combien d’individus la portent.
- L’**effectif total** : la somme de tous les effectifs.
- La **fréquence** : effectif ÷ effectif total, exprimée en décimal ou en pourcentage. La somme des fréquences vaut toujours **1**, soit **100 %**.

## Le tableau d’effectifs
C’est la première étape : ranger les données brutes en colonnes, valeur par valeur. On y ajoute souvent une ligne de **fréquences** et une ligne d’**effectifs cumulés**.

## Les représentations graphiques
- Le **diagramme en bâtons** : un bâton par valeur, dont la hauteur est proportionnelle à l’effectif. Pour un caractère quantitatif à valeurs isolées.
- Le **diagramme circulaire** : pour montrer des **parts d’un tout**. L’angle d’un secteur se calcule par **fréquence × 360°**.
- Le **diagramme en barres** : pour un caractère qualitatif.
- La **courbe** : pour une évolution dans le temps.

## L’étendue
**étendue = plus grande valeur − plus petite valeur**. Elle mesure la **dispersion** de la série : deux classes de même moyenne peuvent avoir des étendues très différentes.

## Lire un graphique avec méthode
1. Lire le **titre** : de quoi parle-t-on ?
2. Lire les **axes** et leurs **unités** ;
3. Vérifier si l’axe vertical part bien de **zéro** ;
4. Alors seulement, comparer les hauteurs.

> Un axe tronqué, une échelle irrégulière ou un diagramme en trois dimensions déforment la perception **sans falsifier un seul chiffre**. C’est la manipulation la plus courante et la plus efficace.`,
          },
          questions: [
            ['Qu’est-ce que l’effectif d’une valeur ?', ['Le nombre d’individus qui portent cette valeur', 'La somme de toutes les valeurs', 'La valeur la plus fréquente', 'L’écart entre deux valeurs'], 0, 'L’effectif total est la somme de tous les effectifs.'],
            ['Comment calcule-t-on une fréquence ?', ['Effectif de la valeur ÷ effectif total', 'Effectif total ÷ effectif de la valeur', 'Valeur × effectif', 'Effectif × 360'], 0, 'La somme des fréquences vaut 1, soit 100 %.'],
            ['Quel caractère est quantitatif ?', ['La taille', 'Le sport pratiqué', 'La couleur des yeux', 'Le prénom'], 0, 'Un caractère quantitatif se mesure.'],
            ['Comment calcule-t-on l’angle d’un secteur dans un diagramme circulaire ?', ['Fréquence × 360°', 'Effectif × 360°', 'Fréquence ÷ 360°', 'Effectif total ÷ 360'], 0, 'La somme des angles fait bien 360°.'],
            ['Qu’est-ce que l’étendue d’une série ?', ['La différence entre la plus grande et la plus petite valeur', 'La valeur du milieu', 'La moyenne des valeurs', 'Le nombre de valeurs'], 0, 'Elle mesure la dispersion.'],
            ['Quelle représentation convient à une évolution dans le temps ?', ['La courbe', 'Le diagramme circulaire', 'Le tableau d’effectifs seul', 'Le diagramme en barres'], 0, 'Le circulaire montre une répartition, pas une évolution.'],
            ['Que faut-il vérifier avant de comparer les hauteurs d’un graphique ?', ['Que l’axe vertical part bien de zéro', 'La couleur des barres', 'Le nombre de valeurs', 'La date de publication'], 0, 'Un axe tronqué déforme la perception sans falsifier les chiffres.'],
            ['La somme des fréquences d’une série peut dépasser 100 %.', ['Vrai', 'Faux'], 1, 'Elle vaut toujours exactement 100 %.'],
          ],
        },
        {
          titre: 'Calculer une moyenne et une moyenne pondérée',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Quand chaque valeur ne pèse pas le même poids',
            cours: `## La moyenne simple
On additionne toutes les valeurs et on divise par leur **nombre**.

Notes 8, 12, 12, 16, 17 → (8 + 12 + 12 + 16 + 17) ÷ 5 = 65 ÷ 5 = **13**.

## La moyenne pondérée
Quand certaines valeurs **comptent plus** que d’autres — parce qu’elles se répètent, ou parce qu’un **coefficient** leur est attribué —, on multiplie chaque valeur par son poids, on additionne, puis on divise par la **somme des poids**.

**moyenne = (somme des valeurs × leur effectif) ÷ effectif total**

Avec des effectifs :
| Note | 8 | 12 | 16 |
|---|---|---|---|
| Effectif | 3 | 5 | 2 |

(8 × 3 + 12 × 5 + 16 × 2) ÷ (3 + 5 + 2) = (24 + 60 + 32) ÷ 10 = **11,6**

Avec des coefficients : maths 14 (coef 4), français 10 (coef 4), histoire 16 (coef 2)
(14 × 4 + 10 × 4 + 16 × 2) ÷ (4 + 4 + 2) = **12,8**

> **On divise toujours par la somme des poids, jamais par le nombre de valeurs distinctes.** Diviser par 3 au lieu de 10 dans l’exemple ci-dessus donnerait un résultat absurde.

## Ce que la moyenne ne dit pas
Deux séries très différentes peuvent avoir la même moyenne : 10 et 10 ; ou 0 et 20. C’est pourquoi on l’accompagne toujours de l’**étendue**.

## La moyenne de plusieurs groupes
Ce **n’est pas** la moyenne des moyennes, sauf si les groupes ont le même effectif. Il faut repasser par les **totaux** : somme de toutes les valeurs ÷ effectif total.

Une classe de 30 élèves à 12 et une classe de 10 élèves à 16 donnent (30 × 12 + 10 × 16) ÷ 40 = **13**, et non 14.

## Vérifier
La moyenne est toujours **comprise entre** la plus petite et la plus grande valeur de la série. Si ce n’est pas le cas, il y a une erreur.`,
          },
          questions: [
            ['Comment calcule-t-on une moyenne simple ?', ['Somme des valeurs ÷ nombre de valeurs', 'Somme des valeurs × nombre de valeurs', 'Valeur du milieu', 'Plus grande valeur − plus petite'], 0, 'Chaque valeur y compte pour une.'],
            ['Par quoi divise-t-on dans une moyenne pondérée ?', ['Par la somme des poids ou des effectifs', 'Par le nombre de valeurs distinctes', 'Par 100', 'Par le plus grand coefficient'], 0, 'C’est l’erreur la plus fréquente du chapitre.'],
            ['Quelle est la moyenne des notes 8 (×3), 12 (×5) et 16 (×2) ?', ['11,6', '12', '36', '10'], 0, '(24 + 60 + 32) ÷ 10.'],
            ['Quelle est la moyenne de 14 (coef 4), 10 (coef 4) et 16 (coef 2) ?', ['12,8', '13,3', '40', '12'], 0, '(56 + 40 + 32) ÷ 10.'],
            ['Une classe de 30 élèves a 12 de moyenne, une autre de 10 élèves a 16. Quelle est la moyenne globale ?', ['13', '14', '12,5', '15'], 0, '(30 × 12 + 10 × 16) ÷ 40 : ce n’est pas la moyenne des moyennes.'],
            ['Entre quelles valeurs une moyenne est-elle toujours comprise ?', ['Entre la plus petite et la plus grande valeur de la série', 'Entre 0 et 10', 'Entre 0 et 20', 'Entre la médiane et l’étendue'], 0, 'C’est un moyen simple de vérifier son calcul.'],
            ['Que représente le coefficient d’une matière ?', ['Le poids de cette note dans la moyenne', 'Le nombre d’heures de cours', 'Le nombre d’évaluations', 'La note maximale'], 0, 'Il multiplie la note avant la division par la somme des coefficients.'],
            ['La moyenne suffit à décrire une série de notes.', ['Vrai', 'Faux'], 1, 'Deux séries très différentes peuvent avoir la même moyenne : il faut aussi l’étendue.'],
          ],
        },
        {
          titre: 'Statistiques à l’aide d’un tableur',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Faire calculer la machine, et vérifier ce qu’elle calcule',
            cours: `## Le vocabulaire du tableur
- Une **cellule** est repérée par sa **colonne** (une lettre) et sa **ligne** (un numéro) : **B3**.
- Une **plage** s’écrit avec deux-points : **A1:A20** désigne toutes les cellules de A1 à A20.
- Une **formule** commence **toujours** par le signe **=**.

## Les formules utiles
- **=A1+B1** : addition de deux cellules ;
- **=SOMME(A1:A20)** : somme d’une plage ;
- **=MOYENNE(A1:A20)** : moyenne ;
- **=MIN(A1:A20)** et **=MAX(A1:A20)** : leur différence donne l’**étendue** ;
- **=NB(A1:A20)** : nombre de valeurs.

## Recopier une formule
En tirant la poignée de recopie, les références se **décalent** : =A1+B1 recopiée une ligne plus bas devient =A2+B2. C’est une **référence relative**, et c’est ce qui fait la puissance du tableur.

Pour **figer** une référence — un effectif total placé en B12, par exemple —, on écrit **$B$12** : c’est une **référence absolue**.

> C’est le point le plus utile du chapitre : sans le \\$, une colonne de fréquences se décale d’une ligne à chaque cellule et produit des résultats faux… d’apparence tout à fait plausible.

## Construire un graphique
On sélectionne les données, on choisit le type de graphique, puis on **vérifie** le titre, la légende et les axes. Un graphique sans titre ni unité n’informe de rien.

## Pourquoi c’est utile en statistiques
Le tableur permet de traiter **beaucoup** de données : recalculer une moyenne en changeant une note, tester une hypothèse, produire un graphique en trois clics. Le temps gagné sur le calcul se reporte sur l’**interprétation**.

## La règle d’or
Un tableur calcule **exactement ce qu’on lui demande**, y compris une bêtise. Avant de faire confiance à une colonne entière de résultats, on **vérifie une valeur à la main**.`,
          },
          questions: [
            ['Par quel signe commence toute formule dans un tableur ?', ['=', '+', ':', '#'], 0, 'Sans lui, le tableur affiche le texte tel quel.'],
            ['Que désigne la plage A1:A20 ?', ['Toutes les cellules de A1 à A20', 'Les deux cellules A1 et A20 seulement', 'La division de A1 par A20', 'La colonne A entière'], 0, 'Les deux-points désignent une plage continue.'],
            ['Quelle formule calcule la moyenne d’une plage ?', ['=MOYENNE(A1:A20)', '=SOMME(A1:A20)', '=NB(A1:A20)', '=MAX(A1:A20)'], 0, 'La somme divisée par NB donnerait le même résultat.'],
            ['Comment obtient-on l’étendue avec un tableur ?', ['=MAX(plage) − MIN(plage)', '=MOYENNE(plage)', '=NB(plage)', '=SOMME(plage)'], 0, 'La différence entre les deux extrêmes.'],
            ['Que devient =A1+B1 recopiée une ligne plus bas ?', ['=A2+B2', '=A1+B1', '=B1+C1', 'Une erreur'], 0, 'C’est une référence relative.'],
            ['À quoi sert la notation $B$12 ?', ['À figer la référence pour qu’elle ne bouge pas à la recopie', 'À afficher un montant en euros', 'À arrondir la valeur', 'À protéger la cellule'], 0, 'C’est une référence absolue.'],
            ['Que faut-il vérifier sur un graphique produit par un tableur ?', ['Le titre, la légende et les axes', 'La couleur des barres', 'La police de caractères', 'Le nom du fichier'], 0, 'Un graphique sans titre ni unité n’informe de rien.'],
            ['Un tableur signale automatiquement une formule qui n’a pas de sens.', ['Vrai', 'Faux'], 1, 'Il calcule exactement ce qu’on lui demande : il faut vérifier une valeur à la main.'],
          ],
        },
        {
          titre: 'Les probabilités',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Mesurer une chance entre 0 et 1',
            cours: `## Le vocabulaire
Une **expérience aléatoire** a plusieurs résultats possibles, et on ne peut pas prévoir lequel se produira : lancer un dé, tirer une carte, faire tourner une roue.
- Une **issue** : un résultat possible.
- Un **événement** : un ensemble d’issues (« obtenir un nombre pair »).

## La probabilité
Un nombre compris entre **0** et **1** :
- **0** = événement **impossible** ;
- **1** = événement **certain** ;
- plus il est proche de 1, plus l’événement est probable.

On peut aussi l’écrire en **fraction**, en **décimal** ou en **pourcentage** : 1/2 = 0,5 = 50 %.

## Le calcul en situation d’équiprobabilité
Quand toutes les issues ont **la même chance** de se produire :

**P(A) = nombre d’issues favorables ÷ nombre d’issues possibles**

- Dé à six faces, « obtenir un nombre pair » : 3/6 = **1/2**.
- Urne de 5 boules rouges et 3 bleues, « tirer une rouge » : **5/8**.
- Jeu de 32 cartes, « tirer un cœur » : 8/32 = **1/4**.

## L’événement contraire
**P(non A) = 1 − P(A)**.
La probabilité de « ne pas obtenir un 6 » vaut 1 − 1/6 = **5/6**. C’est souvent le chemin le plus court.

## Fréquence et probabilité
La **fréquence** se constate après l’expérience ; la **probabilité** se calcule avant. Elles ne coïncident pas sur quelques essais — mais plus on répète, plus la fréquence observée **se rapproche** de la probabilité. C’est la **loi des grands nombres**.

> La probabilité ne prédit pas le prochain lancer. Une pièce tombée cinq fois sur pile reste à 1/2 au sixième : elle n’a **pas de mémoire**.

## Le vocabulaire des chances
« Une chance sur deux » = 1/2. « Deux chances sur cinq » = 2/5 = 40 %. Traduire l’énoncé en fraction est presque toujours la première étape.`,
          },
          questions: [
            ['Entre quelles valeurs une probabilité est-elle comprise ?', ['Entre 0 et 1', 'Entre −1 et 1', 'Entre 0 et 100', 'Entre 1 et 6'], 0, '0 = impossible, 1 = certain.'],
            ['Comment calcule-t-on une probabilité en situation d’équiprobabilité ?', ['Issues favorables ÷ issues possibles', 'Issues possibles ÷ issues favorables', 'Issues favorables × nombre d’essais', 'Nombre d’essais ÷ 100'], 0, 'Toutes les issues doivent avoir la même chance.'],
            ['Quelle est la probabilité d’obtenir un nombre pair avec un dé à six faces ?', ['1/2', '1/3', '1/6', '2/3'], 0, 'Trois issues favorables sur six.'],
            ['Dans un jeu de 32 cartes, quelle est la probabilité de tirer un cœur ?', ['1/4', '1/8', '1/32', '8/24'], 0, '8 cœurs sur 32 cartes.'],
            ['Comment calcule-t-on la probabilité de l’événement contraire ?', ['1 − P(A)', 'P(A) − 1', '1 ÷ P(A)', '100 − P(A)'], 0, '« Ne pas obtenir un 6 » vaut 5/6.'],
            ['Quelle est la différence entre fréquence et probabilité ?', ['La fréquence se constate après l’expérience, la probabilité se calcule avant', 'Ce sont deux mots pour la même chose', 'La fréquence est toujours plus grande', 'La probabilité se mesure en pourcentage seulement'], 0, 'La loi des grands nombres les rapproche.'],
            ['Que vaut une probabilité de 1/2 en pourcentage ?', ['50 %', '2 %', '12 %', '5 %'], 0, 'Fraction, décimal et pourcentage disent la même chose.'],
            ['Après cinq « pile » consécutifs, « face » devient plus probable.', ['Vrai', 'Faux'], 1, 'La pièce n’a pas de mémoire : la probabilité reste 1/2.'],
          ],
        },
        {
          titre: 'Calculer une quatrième proportionnelle',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Trouver la valeur manquante d’un tableau',
            cours: `## La situation
Dans un **tableau de proportionnalité**, trois valeurs sont connues et une manque. Cette valeur manquante s’appelle la **quatrième proportionnelle**.

| Quantité | 4 | 12 |
|---|---|---|
| Prix (€) | 5 | **x** |

## Trois méthodes, toutes valables
**1. Le coefficient de proportionnalité.**
On le calcule sur la colonne complète : 5 ÷ 4 = **1,25**. Puis on l’applique : x = 12 × 1,25 = **15 €**.

**2. Le passage à l’unité.**
Combien coûte **une** unité ? 5 ÷ 4 = 1,25 €. Donc 12 unités coûtent 12 × 1,25 = **15 €**.

**3. Le produit en croix.**
Puisque 4/5 = 12/x, on a **4 × x = 5 × 12**, donc 4x = 60 et **x = 15**.

## Les propriétés qui accélèrent
- **Linéarité multiplicative** : si la quantité est multipliée par 3, le prix aussi. Ici 4 × 3 = 12, donc 5 × 3 = 15 €. C’est la méthode la plus rapide **quand elle s’applique**.
- **Additivité** : si 3 objets coûtent 12 € et 5 objets 20 €, alors 8 objets coûtent **32 €**.

## Choisir sa méthode
- Les nombres sont **multiples** l’un de l’autre → linéarité, de tête ;
- le coefficient tombe **juste** → coefficient ;
- rien ne tombe juste → **produit en croix**, qui marche toujours.

## Vérifier
Le résultat doit être **cohérent** : plus d’objets doit donner plus cher. Un prix qui baisse quand la quantité augmente signale une erreur d’écriture du tableau.

> ⚠️ Toutes ces méthodes supposent que la situation soit **réellement proportionnelle**. Appliquer un produit en croix à un tarif avec abonnement fixe, ou à l’aire d’un carré en fonction de son côté, donne un résultat faux — et rien dans le calcul ne le signale.`,
          },
          questions: [
            ['Qu’est-ce qu’une quatrième proportionnelle ?', ['La valeur manquante d’un tableau de proportionnalité', 'Le coefficient de proportionnalité', 'La quatrième colonne du tableau', 'La moyenne des trois autres valeurs'], 0, 'Trois valeurs connues, une à trouver.'],
            ['Comment calcule-t-on le coefficient de proportionnalité ?', ['En divisant une valeur de la seconde ligne par celle de la première', 'En additionnant les deux lignes', 'En multipliant les deux valeurs connues', 'En soustrayant les deux lignes'], 0, 'Il est constant sur tout le tableau.'],
            ['Que donne le produit en croix pour 4/5 = 12/x ?', ['4x = 60, donc x = 15', '4x = 17, donc x = 4,25', '5x = 48, donc x = 9,6', 'x = 4 × 12 ÷ 5'], 0, 'On multiplie en croix puis on isole x.'],
            ['En quoi consiste le passage à l’unité ?', ['Calculer la valeur pour 1, puis multiplier', 'Diviser par le coefficient', 'Ajouter 1 à chaque valeur', 'Ramener le tableau à une seule ligne'], 0, 'C’est souvent la méthode la plus sûre.'],
            ['Si 3 objets coûtent 12 € et 5 objets 20 €, combien coûtent 8 objets ?', ['32 €', '30 €', '28 €', '35 €'], 0, 'Propriété d’additivité : 12 + 20.'],
            ['Quelle méthode fonctionne dans tous les cas ?', ['Le produit en croix', 'La linéarité multiplicative', 'Le calcul de tête', 'L’addition des colonnes'], 0, 'Les autres sont plus rapides mais pas toujours applicables.'],
            ['Comment vérifier la cohérence du résultat ?', ['Plus d’objets doit donner un prix plus élevé', 'Le résultat doit être entier', 'Le résultat doit être inférieur au coefficient', 'Le résultat doit être positif seulement'], 0, 'Une incohérence signale une erreur d’écriture du tableau.'],
            ['Le produit en croix s’applique à n’importe quel tableau de deux lignes.', ['Vrai', 'Faux'], 1, 'Il suppose la proportionnalité, et rien dans le calcul ne signale son absence.'],
          ],
        },
        {
          titre: 'Pourcentages : définition et application',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Une proportion rapportée à cent',
            cours: `## La définition
Un **pourcentage** est une proportion rapportée à **100**. « 25 % » signifie 25 pour 100, soit la fraction **25/100**, soit **0,25**.

C’est donc un cas particulier de **proportionnalité** : le coefficient est t/100.

## Appliquer un pourcentage
Prendre **t %** d’une quantité, c’est la **multiplier** par t/100.
- 30 % de 80 € = 80 × 0,30 = **24 €**
- 15 % de 200 = 200 × 0,15 = **30**

## Les pourcentages à connaître par cœur
- 50 % = 1/2 (la moitié)
- 25 % = 1/4 (le quart)
- 75 % = 3/4
- 10 % = 1/10 (on divise par 10)
- 20 % = 1/5
- 1 % = 1/100

Ils permettent de calculer **de tête** : 20 % de 45 € = 45 ÷ 5 = 9 €.

## Calculer un pourcentage
**pourcentage = (partie ÷ tout) × 100**
15 élèves sur 25 → (15 ÷ 25) × 100 = **60 %**.

## Retrouver le tout
Si 24 € représentent 30 % d’un prix, on **divise** : 24 ÷ 0,30 = **80 €**.

> La règle des trois questions : la **partie** se multiplie, le **pourcentage** se divise puis se multiplie par 100, le **tout** se divise.

## Augmenter et diminuer
- **Augmenter de t %** : multiplier par **(1 + t/100)**. +15 % → × 1,15.
- **Diminuer de t %** : multiplier par **(1 − t/100)**. −15 % → × 0,85.

## Les pièges
- Un pourcentage ne veut rien dire sans savoir **de quoi** il est le pourcentage : +50 % sur un petit nombre peut être moins que +5 % sur un grand.
- Deux pourcentages successifs ne s’additionnent pas : +10 % puis +10 % donne **+21 %**, car les coefficients se **multiplient**.`,
          },
          questions: [
            ['Que signifie 25 % ?', ['25 pour 100, soit 0,25', '25 unités', '25 fois plus', 'Un quart de 25'], 0, 'C’est une proportion rapportée à 100.'],
            ['Combien font 30 % de 80 € ?', ['24 €', '30 €', '26,67 €', '2,4 €'], 0, '80 × 0,30.'],
            ['À quelle fraction correspond 20 % ?', ['1/5', '1/4', '1/20', '2/10 seulement'], 0, 'Utile pour calculer de tête : 20 % de 45 = 45 ÷ 5.'],
            ['Quel pourcentage 15 élèves représentent-ils sur 25 ?', ['60 %', '40 %', '15 %', '25 %'], 0, '(15 ÷ 25) × 100.'],
            ['Si 24 € représentent 30 % d’un prix, quel est ce prix ?', ['80 €', '72 €', '7,2 €', '54 €'], 0, 'On divise par le coefficient : 24 ÷ 0,30.'],
            ['Par quel coefficient multiplie-t-on pour augmenter de 15 % ?', ['1,15', '0,15', '15', '0,85'], 0, 'Diminuer de 15 % reviendrait à multiplier par 0,85.'],
            ['Une hausse de 10 % suivie d’une autre hausse de 10 % correspond à quelle hausse totale ?', ['+21 %', '+20 %', '+11 %', '+100 %'], 0, '1,1 × 1,1 = 1,21 : les coefficients se multiplient.'],
            ['Un pourcentage a du sens indépendamment de la quantité à laquelle il s’applique.', ['Vrai', 'Faux'], 1, '+50 % sur un petit nombre peut être moins que +5 % sur un grand.'],
          ],
        },
        {
          titre: 'Proportionnalité : échelles et ratios',
          axe: 'Organisation et gestion de données',
          lecon: {
            titre: 'Réduire un plan, partager en parts inégales',
            cours: `## Les échelles
L’**échelle** d’un plan, d’une carte ou d’une maquette est le rapport :

**échelle = distance sur le plan ÷ distance réelle**, exprimées **dans la même unité**.

Elle s’écrit 1/25 000 ou 1 : 25 000, et n’a **pas d’unité**.
- **Échelle < 1** : réduction (cartes, plans) ;
- **échelle > 1** : agrandissement (schéma d’un insecte).

**Du plan au réel** : distance réelle = distance sur le plan **÷** échelle.
3 cm au 1/25 000 → 3 × 25 000 = 75 000 cm = **750 m**.

**Du réel au plan** : distance sur le plan = distance réelle **×** échelle.
2 km au 1/25 000 → 200 000 cm × 1/25 000 = **8 cm**.

⚠️ Le vrai piège est la **conversion** : 1 m = 100 cm, 1 km = **100 000 cm**. On convertit tout dans la même unité **avant** de calculer.

## Les ratios
Un **ratio** exprime un partage en parts, sans donner les quantités.
« Partager 60 € selon le ratio **2 : 3** » signifie : deux parts pour l’un, trois pour l’autre.

Méthode :
1. compter le **nombre total de parts** : 2 + 3 = **5** ;
2. calculer la **valeur d’une part** : 60 ÷ 5 = **12 €** ;
3. multiplier : 2 × 12 = **24 €** et 3 × 12 = **36 €** ;
4. **vérifier** : 24 + 36 = 60. ✔

## Ratio à trois termes
Le ratio 1 : 2 : 3 sur 120 € donne 6 parts de 20 € : **20 €, 40 €, 60 €**.

## Ratio et fraction
Un ratio 2 : 3 signifie que le premier reçoit **2/5** du total et le second **3/5** — et non 2/3. C’est la confusion la plus fréquente : le dénominateur est le **total des parts**, pas l’autre terme.

> Échelles et ratios sont deux visages de la même idée : comparer des grandeurs en gardant le même rapport.`,
          },
          questions: [
            ['Comment se calcule une échelle ?', ['Distance sur le plan ÷ distance réelle, dans la même unité', 'Distance réelle ÷ distance sur le plan', 'Distance réelle × distance sur le plan', 'Distance sur le plan + distance réelle'], 0, 'Elle n’a pas d’unité.'],
            ['Que représente 1 cm sur une carte au 1/25 000 ?', ['250 m', '25 m', '2,5 km', '25 km'], 0, '25 000 cm = 250 m.'],
            ['Que signifie une échelle supérieure à 1 ?', ['C’est un agrandissement', 'C’est une réduction', 'L’échelle est fausse', 'Le plan est à taille réelle'], 0, 'Utile pour représenter un insecte ou un circuit.'],
            ['Combien de centimètres vaut 1 km ?', ['100 000 cm', '1 000 cm', '10 000 cm', '1 000 000 cm'], 0, 'C’est la conversion qui cause le plus d’erreurs.'],
            ['Comment partage-t-on 60 € selon le ratio 2 : 3 ?', ['24 € et 36 €', '20 € et 40 €', '30 € et 30 €', '25 € et 35 €'], 0, '5 parts de 12 € : 2 parts et 3 parts.'],
            ['Quelle est la première étape d’un partage selon un ratio ?', ['Compter le nombre total de parts', 'Diviser par 2', 'Multiplier par le premier terme', 'Convertir en pourcentage'], 0, 'Puis on calcule la valeur d’une part.'],
            ['Dans un ratio 2 : 3, quelle fraction du total reçoit le premier ?', ['2/5', '2/3', '3/5', '1/2'], 0, 'Le dénominateur est le total des parts : 2 + 3.'],
            ['Un ratio 2 : 3 signifie que le premier reçoit les deux tiers du total.', ['Vrai', 'Faux'], 1, 'Il reçoit 2/5 : c’est la confusion la plus fréquente du chapitre.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Espace et géométrie
        // ===================================================================
        {
          titre: 'Aire et périmètre de figures géométriques',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Le tour et la surface, à ne jamais confondre',
            cours: `## Deux grandeurs différentes
- Le **périmètre** est la **longueur du contour**. Il se mesure en **cm, m, km** — des unités de longueur.
- L’**aire** est la **mesure de la surface**. Elle se mesure en **cm², m², km²** — des unités carrées.

> Deux figures peuvent avoir le **même périmètre** et des **aires très différentes** : un rectangle de 1 × 9 et un carré de 5 × 5 ont tous deux un périmètre de 20, mais des aires de 9 et de 25.

## Les formules à connaître
**Périmètres**
- Carré : **4 × c**
- Rectangle : **2 × (L + l)**
- Triangle : somme des trois côtés
- Cercle : **2 × π × R** (ou π × diamètre)

**Aires**
- Carré : **c²**
- Rectangle : **L × l**
- Triangle : **(base × hauteur) ÷ 2**
- Parallélogramme : **base × hauteur** (la hauteur, pas le côté oblique)
- Losange : **(D × d) ÷ 2** (les deux diagonales)
- Trapèze : **((B + b) × h) ÷ 2**
- Disque : **π × R²**

## Le nombre π
π ≈ **3,14**. C’est le rapport entre le périmètre d’un cercle et son diamètre — le même pour **tous** les cercles. Ses décimales sont infinies : les calculs se font avec la touche π de la calculatrice, ou avec 3,14 pour une valeur approchée.

## La hauteur d’un triangle
C’est le segment issu d’un sommet et **perpendiculaire** au côté opposé. Chaque triangle en a **trois** — et n’importe quel côté peut servir de base, à condition de prendre la hauteur qui lui correspond.

## Les conversions
Les unités d’aire se convertissent **de 100 en 100**, et non de 10 en 10 :
1 m² = **10 000 cm²** ; 1 km² = 1 000 000 m² ; 1 hectare = 10 000 m².

C’est l’erreur la plus fréquente du chapitre.

## Les figures composées
On les **décompose** en figures simples : on additionne les aires, ou l’on soustrait une partie découpée.`,
          },
          questions: [
            ['Quelle est la différence entre périmètre et aire ?', ['Le périmètre est la longueur du contour, l’aire la mesure de la surface', 'Le périmètre concerne les cercles, l’aire les polygones', 'Ce sont deux mots pour la même grandeur', 'L’aire est toujours plus grande'], 0, 'Ils se mesurent dans des unités différentes.'],
            ['Quelle est la formule de l’aire d’un triangle ?', ['(base × hauteur) ÷ 2', 'base × hauteur', 'somme des trois côtés', '(base + hauteur) ÷ 2'], 0, 'La hauteur doit être relative à la base choisie.'],
            ['Quelle est la formule de l’aire d’un disque ?', ['π × R²', '2 × π × R', 'π × D', 'π × R³'], 0, '2 × π × R est le périmètre du cercle.'],
            ['Quelle est la formule de l’aire d’un losange ?', ['(D × d) ÷ 2', 'côté²', 'base × hauteur', '(D + d) ÷ 2'], 0, 'D et d sont les deux diagonales.'],
            ['Que représente le nombre π ?', ['Le rapport entre le périmètre d’un cercle et son diamètre', 'L’aire d’un cercle de rayon 1', 'La longueur d’un rayon', 'Le double du rayon'], 0, 'Il vaut environ 3,14 pour tous les cercles.'],
            ['Combien de cm² vaut 1 m² ?', ['10 000 cm²', '100 cm²', '1 000 cm²', '1 000 000 cm²'], 0, 'Les unités d’aire se convertissent de 100 en 100.'],
            ['Comment calcule-t-on l’aire d’une figure composée ?', ['En la décomposant en figures simples', 'En mesurant son périmètre', 'En comptant ses côtés', 'En prenant la moyenne des aires connues'], 0, 'On additionne ou on soustrait les aires simples.'],
            ['Deux figures de même périmètre ont forcément la même aire.', ['Vrai', 'Faux'], 1, 'Un rectangle 1 × 9 et un carré 5 × 5 ont le même périmètre et des aires de 9 et 25.'],
          ],
        },
        {
          titre: 'Visualiser et représenter des solides',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Mettre l’espace sur une feuille',
            cours: `## Le vocabulaire des solides
- Une **face** : une surface plane qui limite le solide ;
- une **arête** : le segment où deux faces se rencontrent ;
- un **sommet** : le point où plusieurs arêtes se rejoignent.

Un **cube** a 6 faces, 12 arêtes, 8 sommets ; une **pyramide à base carrée** a 5 faces, 8 arêtes, 5 sommets.

## Les grandes familles
- Les **polyèdres**, dont toutes les faces sont **planes** : cube, pavé droit, prisme, pyramide, tétraèdre.
- Les **solides de révolution**, obtenus en faisant tourner une figure autour d’un axe : cylindre, cône, sphère. Ils ont des surfaces **courbes**.

## La perspective cavalière
C’est la représentation la plus utilisée. Ses règles :
- la **face avant** est dessinée **en vraie grandeur** ;
- les **fuyantes** sont **parallèles entre elles**, tracées selon un même angle, et souvent **réduites** ;
- les **arêtes cachées** se tracent en **pointillés**.

Ce qui est **conservé** : le parallélisme, les milieux, l’alignement.
Ce qui **ne l’est pas** : les angles droits (sauf sur la face avant) et les longueurs des fuyantes.

> Une face carrée peut apparaître comme un parallélogramme : la perspective cavalière n’est pas une photographie, c’est un **code de lecture**.

## Le patron
Un **patron** est la figure plane qui, découpée et pliée, reconstitue exactement le solide, **sans recouvrement ni manque**.
- Cube : 6 carrés — il en existe **onze** patrons différents ;
- pavé droit : 6 rectangles ;
- cylindre : 2 disques et 1 **rectangle** dont un côté vaut le **périmètre** de la base ;
- cône : 1 disque et 1 **secteur circulaire** ;
- pyramide : la base plus autant de triangles que de côtés.

## Vérifier un patron
Compter les faces, vérifier que les côtés qui se rejoindront ont la **même longueur**, et repérer les faces opposées. Le pliage mental est le meilleur exercice du chapitre.`,
          },
          questions: [
            ['Qu’est-ce qu’une arête ?', ['Le segment où deux faces se rencontrent', 'Le point où plusieurs faces se rejoignent', 'Une face plane du solide', 'La hauteur du solide'], 0, 'Le sommet est un point, l’arête un segment.'],
            ['Combien d’arêtes a un cube ?', ['12', '8', '6', '4'], 0, '6 faces, 12 arêtes, 8 sommets.'],
            ['Qu’est-ce qu’un solide de révolution ?', ['Un solide obtenu en faisant tourner une figure autour d’un axe', 'Un solide à faces planes', 'Un solide sans sommet', 'Un polyèdre régulier'], 0, 'Cylindre, cône et sphère en sont.'],
            ['Comment trace-t-on les arêtes cachées en perspective cavalière ?', ['En pointillés', 'En trait plein', 'On ne les trace pas', 'En double trait'], 0, 'La face avant est, elle, en vraie grandeur.'],
            ['Que conserve la perspective cavalière ?', ['Le parallélisme et les milieux', 'Tous les angles droits', 'Toutes les longueurs', 'Les aires'], 0, 'Une face carrée peut y sembler être un parallélogramme.'],
            ['Qu’est-ce qu’un patron ?', ['La figure plane qui, pliée, reconstitue le solide', 'Une vue de face du solide', 'Le dessin en perspective', 'La base du solide'], 0, 'Sans recouvrement ni manque.'],
            ['De quoi se compose le patron d’un cylindre ?', ['De deux disques et d’un rectangle', 'De deux disques et d’un secteur circulaire', 'De trois rectangles', 'D’un disque et d’un triangle'], 0, 'Un côté du rectangle vaut le périmètre de la base.'],
            ['Il n’existe qu’un seul patron possible pour le cube.', ['Vrai', 'Faux'], 1, 'Il en existe onze différents.'],
          ],
        },
        {
          titre: 'Prisme droit et cylindre de révolution',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Deux solides bâtis sur une base',
            cours: `## Le prisme droit
Un **prisme droit** a :
- **deux bases** parallèles, superposables, qui sont des **polygones** ;
- des **faces latérales** qui sont toutes des **rectangles** ;
- des **arêtes latérales** perpendiculaires aux bases, toutes de même longueur : c’est la **hauteur**.

Le **pavé droit** est un prisme droit à base rectangulaire ; le **cube**, un cas particulier du pavé.

Un prisme dont la base a **n** côtés possède **2n** sommets, **3n** arêtes et **n + 2** faces.

## Le cylindre de révolution
Il s’obtient en faisant tourner un **rectangle** autour de l’un de ses côtés.
- **deux bases** qui sont des **disques** parallèles et superposables ;
- une **surface latérale courbe** ;
- une **hauteur** : la distance entre les deux bases.

## Les patrons
- **Prisme droit** : les deux bases, plus un **grand rectangle** dont la longueur vaut le **périmètre de la base** et la largeur la **hauteur**.
- **Cylindre** : les deux disques, plus un **rectangle** dont la longueur vaut **2 × π × R** — le périmètre du disque — et la largeur la hauteur.

> C’est la même idée dans les deux cas : la surface latérale, « déroulée », est un rectangle dont un côté est le **tour de la base**.

## Les aires
- **Aire latérale** = périmètre de la base × hauteur.
- **Aire totale** = aire latérale + 2 × aire de la base.

Pour un cylindre : aire latérale = 2πR × h, aire totale = 2πR × h + 2πR².

## Les volumes
**V = aire de la base × hauteur**, pour les deux solides.
- Prisme droit : V = aire du polygone × h ;
- cylindre : **V = π × R² × h**.

⚠️ Pas de « ÷ 3 » ici : le tiers concerne la **pyramide** et le **cône**, pas le prisme ni le cylindre.

## Les unités
Un volume s’exprime en unités **cubes**. 1 L = 1 dm³ ; 1 cm³ = 1 mL ; 1 m³ = 1 000 L.`,
          },
          questions: [
            ['Quelles sont les faces latérales d’un prisme droit ?', ['Des rectangles', 'Des triangles', 'Des trapèzes', 'Des disques'], 0, 'Les bases, elles, sont des polygones.'],
            ['Comment obtient-on un cylindre de révolution ?', ['En faisant tourner un rectangle autour d’un de ses côtés', 'En faisant tourner un triangle', 'En empilant des disques de rayons différents', 'En pliant un secteur circulaire'], 0, 'Le cône s’obtient, lui, avec un triangle rectangle.'],
            ['Quelle est la formule du volume d’un prisme droit ?', ['Aire de la base × hauteur', '(Aire de la base × hauteur) ÷ 3', 'Périmètre de la base × hauteur', 'Aire de la base ÷ hauteur'], 0, 'Le tiers concerne la pyramide et le cône.'],
            ['Quelle est la formule du volume d’un cylindre ?', ['π × R² × h', '2 × π × R × h', '(π × R² × h) ÷ 3', '4 × π × R²'], 0, 'Aire du disque de base multipliée par la hauteur.'],
            ['Que vaut la longueur du rectangle dans le patron d’un cylindre ?', ['Le périmètre du disque de base, soit 2πR', 'Le rayon du disque', 'Le diamètre du disque', 'La hauteur du cylindre'], 0, 'La surface latérale déroulée est un rectangle.'],
            ['Comment calcule-t-on l’aire latérale d’un prisme droit ?', ['Périmètre de la base × hauteur', 'Aire de la base × hauteur', 'Périmètre de la base ÷ 2', 'Aire de la base × 2'], 0, 'L’aire totale y ajoute les deux bases.'],
            ['Combien de faces a un prisme droit dont la base a 5 côtés ?', ['7', '5', '10', '12'], 0, 'n + 2 : cinq faces latérales et deux bases.'],
            ['Le volume d’un cylindre se calcule en divisant par 3.', ['Vrai', 'Faux'], 1, 'Le tiers ne concerne que la pyramide et le cône.'],
          ],
        },
        {
          titre: 'Angles et parallélisme',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Ce que deux parallèles font aux angles',
            cours: `## Rappels sur les angles
- **Aigu** : moins de 90° · **droit** : 90° · **obtus** : entre 90° et 180° · **plat** : 180°.
- Deux angles **complémentaires** ont pour somme **90°** ; deux angles **supplémentaires**, **180°**.
- Deux angles **adjacents** ont un sommet et un côté communs.
- Deux angles **opposés par le sommet** sont **toujours égaux**.

## La configuration clé
Deux droites coupées par une **sécante** forment huit angles, dont trois couples portent un nom :
- les **angles correspondants** : même position de part et d’autre de la sécante, l’un « au-dessus », l’autre « en dessous » ;
- les **angles alternes-internes** : de part et d’autre de la sécante, **entre** les deux droites ;
- les **angles alternes-externes** : de part et d’autre de la sécante, **à l’extérieur**.

## Les deux propriétés
**1. Si les droites sont parallèles**, alors les angles correspondants sont **égaux**, et les alternes-internes aussi.
→ On s’en sert pour **calculer** un angle.

**2. Réciproque : si deux angles alternes-internes (ou correspondants) sont égaux**, alors les droites **sont parallèles**.
→ On s’en sert pour **démontrer** un parallélisme.

> C’est la structure de tout le chapitre : une propriété pour calculer, sa réciproque pour démontrer. Savoir laquelle on emploie est la moitié de l’exercice.

## La contraposée
Si les angles alternes-internes ne sont **pas** égaux, les droites ne sont **pas** parallèles.

## La somme des angles d’un triangle
Elle vaut **180°** — et cette propriété se **démontre** justement à l’aide des angles alternes-internes, en traçant une parallèle à un côté passant par le sommet opposé.

Conséquences : dans un triangle **rectangle**, les deux angles aigus sont **complémentaires** ; dans un triangle **équilatéral**, chaque angle vaut **60°** ; dans un triangle **isocèle**, les deux angles à la base sont égaux.

## Rédiger
Toujours nommer la propriété employée : « Les droites (d) et (d′) sont parallèles, donc les angles alternes-internes sont égaux. »`,
          },
          questions: [
            ['Que peut-on dire de deux angles opposés par le sommet ?', ['Ils sont toujours égaux', 'Ils sont supplémentaires', 'Ils sont complémentaires', 'Ils sont adjacents'], 0, 'Quelle que soit la position des droites.'],
            ['Où se situent deux angles alternes-internes ?', ['De part et d’autre de la sécante, entre les deux droites', 'Du même côté de la sécante', 'À l’extérieur des deux droites', 'Sur la même droite'], 0, 'Les alternes-externes sont, eux, à l’extérieur.'],
            ['Que peut-on conclure si deux droites parallèles sont coupées par une sécante ?', ['Les angles alternes-internes sont égaux', 'Les angles sont tous droits', 'Les angles sont supplémentaires', 'On ne peut rien conclure'], 0, 'Les correspondants le sont aussi.'],
            ['Comment démontre-t-on que deux droites sont parallèles ?', ['En montrant que deux angles alternes-internes sont égaux', 'En mesurant leur écartement', 'En vérifiant qu’elles ne se coupent pas sur le dessin', 'En comparant leurs longueurs'], 0, 'C’est la réciproque de la propriété.'],
            ['Que vaut la somme des angles d’un triangle ?', ['180°', '360°', '90°', 'Cela dépend du triangle'], 0, 'Elle se démontre à l’aide des angles alternes-internes.'],
            ['Que peut-on dire des deux angles aigus d’un triangle rectangle ?', ['Ils sont complémentaires', 'Ils sont supplémentaires', 'Ils sont égaux', 'Ils valent 60° chacun'], 0, 'Leur somme vaut 90°.'],
            ['Combien mesure chaque angle d’un triangle équilatéral ?', ['60°', '45°', '90°', '120°'], 0, '180° ÷ 3.'],
            ['Deux angles correspondants sont toujours égaux, parallèles ou non.', ['Vrai', 'Faux'], 1, 'L’égalité exige que les deux droites soient parallèles.'],
          ],
        },
        {
          titre: 'Connaître et utiliser les triangles',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Les triangles particuliers et leurs propriétés',
            cours: `## Classer les triangles
**Selon les côtés :**
- **quelconque** : trois côtés différents ;
- **isocèle** : deux côtés de même longueur ;
- **équilatéral** : trois côtés égaux.

**Selon les angles :**
- **rectangle** : un angle droit ;
- **acutangle** : trois angles aigus ;
- **obtusangle** : un angle obtus.

Les deux classements se **combinent** : un triangle peut être rectangle **et** isocèle.

## Les propriétés à connaître
**Triangle isocèle**
- deux côtés égaux, appelés les côtés de l’angle principal ;
- les deux **angles à la base** sont **égaux** ;
- il possède un **axe de symétrie** : la médiatrice de la base, qui est aussi la hauteur, la médiane et la bissectrice issues du sommet principal.

**Triangle équilatéral**
- trois côtés égaux, trois angles de **60°** ;
- **trois axes** de symétrie ;
- c’est un cas particulier de triangle isocèle.

**Triangle rectangle**
- un angle droit ; le côté opposé est l’**hypoténuse**, le plus long ;
- les deux angles aigus sont **complémentaires** ;
- il est inscriptible dans un **demi-cercle** dont l’hypoténuse est le diamètre.

## L’inégalité triangulaire
Un triangle n’existe que si la **plus grande longueur est inférieure à la somme des deux autres**.
- 3, 4 et 9 : 3 + 4 = 7 < 9 → **impossible** ;
- si la plus grande longueur **égale** la somme des deux autres, les trois points sont **alignés** ;
- 3, 4 et 5 : 3 + 4 = 7 > 5 → le triangle existe.

C’est la **première vérification** à faire avant toute construction.

## Construire un triangle
Trois données suffisent :
- **trois côtés** : compas ;
- **deux côtés et l’angle** entre eux : règle et rapporteur ;
- **un côté et les deux angles** adjacents.

Faire d’abord un **croquis à main levée** avec les données codées : c’est ce qui évite les constructions impossibles.`,
          },
          questions: [
            ['Qu’est-ce qu’un triangle isocèle ?', ['Un triangle qui a deux côtés de même longueur', 'Un triangle qui a trois côtés égaux', 'Un triangle qui a un angle droit', 'Un triangle qui a trois angles aigus'], 0, 'Ses deux angles à la base sont égaux.'],
            ['Combien d’axes de symétrie a un triangle équilatéral ?', ['Trois', 'Un', 'Deux', 'Aucun'], 0, 'Le triangle isocèle n’en a qu’un.'],
            ['Que peut-on dire des angles à la base d’un triangle isocèle ?', ['Ils sont égaux', 'Ils sont complémentaires', 'Ils valent 60°', 'Ils sont droits'], 0, 'C’est la propriété la plus utilisée du chapitre.'],
            ['Que dit l’inégalité triangulaire ?', ['La plus grande longueur doit être inférieure à la somme des deux autres', 'Les trois côtés doivent être différents', 'La somme des angles vaut 180°', 'Le plus grand angle est opposé au plus grand côté'], 0, '3, 4 et 9 ne forment pas un triangle.'],
            ['Les longueurs 3, 4 et 5 forment-elles un triangle ?', ['Oui, car 3 + 4 > 5', 'Non, car 3 + 4 = 7', 'Non, car les longueurs sont trop proches', 'On ne peut pas le savoir'], 0, 'La condition de l’inégalité triangulaire est respectée.'],
            ['Que se passe-t-il si la plus grande longueur égale la somme des deux autres ?', ['Les trois points sont alignés', 'Le triangle est équilatéral', 'Le triangle est rectangle', 'Le triangle est isocèle'], 0, 'Le triangle est alors « aplati ».'],
            ['Quelles données suffisent à construire un triangle ?', ['Trois côtés, ou deux côtés et l’angle entre eux, ou un côté et deux angles', 'Trois angles', 'Un côté et un angle', 'Deux côtés seulement'], 0, 'Trois angles ne donnent que la forme, pas la taille.'],
            ['Un triangle peut être à la fois rectangle et isocèle.', ['Vrai', 'Faux'], 0, 'Ses deux angles aigus valent alors 45° chacun.'],
          ],
        },
        {
          titre: 'Connaître et utiliser les triangles (suite)',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Les droites remarquables du triangle',
            cours: `Quatre familles de droites traversent tout triangle. Chacune a une **définition**, une **propriété de concours** et un **usage**.

## Les médiatrices
La **médiatrice** d’un segment est la droite **perpendiculaire** à ce segment en son **milieu**.
- Propriété : tout point de la médiatrice est **équidistant** des deux extrémités du segment.
- Les **trois médiatrices** d’un triangle se coupent en un même point : le **centre du cercle circonscrit**, qui passe par les trois sommets.

## Les hauteurs
La **hauteur** issue d’un sommet est la droite passant par ce sommet et **perpendiculaire** au côté opposé.
- Les trois hauteurs se coupent à l’**orthocentre**.
- Elles servent au calcul de l’**aire** : (base × hauteur) ÷ 2.
- Dans un triangle obtusangle, l’orthocentre est **à l’extérieur** du triangle.

## Les médianes
La **médiane** issue d’un sommet joint ce sommet au **milieu** du côté opposé.
- Les trois médianes se coupent au **centre de gravité**.
- Ce point est situé aux **deux tiers** de chaque médiane **en partant du sommet**.
- Chaque médiane partage le triangle en deux triangles de **même aire**.

## Les bissectrices
La **bissectrice** d’un angle est la demi-droite qui le partage en **deux angles égaux**.
- Propriété : tout point de la bissectrice est équidistant des **deux côtés** de l’angle.
- Les trois bissectrices se coupent au **centre du cercle inscrit**, tangent aux trois côtés.

## Le tableau à retenir
| Droite | Définition | Point de concours |
|---|---|---|
| Médiatrice | perpendiculaire au milieu d’un côté | centre du cercle **circonscrit** |
| Hauteur | perpendiculaire au côté opposé | **orthocentre** |
| Médiane | vers le milieu du côté opposé | **centre de gravité** |
| Bissectrice | partage un angle en deux | centre du cercle **inscrit** |

> Dans un triangle **isocèle**, la droite issue du sommet principal est **à la fois** médiatrice, hauteur, médiane et bissectrice — les quatre confondues. Dans un **équilatéral**, c’est vrai pour les trois sommets, et les quatre points de concours sont **confondus**.`,
          },
          questions: [
            ['Qu’est-ce que la médiatrice d’un segment ?', ['La droite perpendiculaire à ce segment en son milieu', 'La droite qui joint un sommet au milieu du côté opposé', 'La droite qui partage un angle en deux', 'La droite perpendiculaire au côté opposé'], 0, 'Tout point de la médiatrice est équidistant des extrémités.'],
            ['Où se coupent les trois médiatrices d’un triangle ?', ['Au centre du cercle circonscrit', 'À l’orthocentre', 'Au centre de gravité', 'Au centre du cercle inscrit'], 0, 'Ce cercle passe par les trois sommets.'],
            ['Qu’est-ce qu’une médiane ?', ['La droite qui joint un sommet au milieu du côté opposé', 'La perpendiculaire au côté opposé', 'La bissectrice d’un angle', 'La médiatrice d’un côté'], 0, 'Les trois se coupent au centre de gravité.'],
            ['Où se situe le centre de gravité sur une médiane ?', ['Aux deux tiers en partant du sommet', 'Au milieu', 'Au tiers en partant du sommet', 'Sur le côté opposé'], 0, 'C’est la propriété à retenir.'],
            ['Où se coupent les trois hauteurs d’un triangle ?', ['À l’orthocentre', 'Au centre de gravité', 'Au centre du cercle inscrit', 'Au centre du cercle circonscrit'], 0, 'Il peut être à l’extérieur du triangle si celui-ci est obtusangle.'],
            ['Que définit le point de concours des bissectrices ?', ['Le centre du cercle inscrit', 'Le centre du cercle circonscrit', 'L’orthocentre', 'Le centre de gravité'], 0, 'Ce cercle est tangent aux trois côtés.'],
            ['Que partage une médiane en deux parties égales ?', ['L’aire du triangle', 'L’angle du sommet', 'Le périmètre', 'La hauteur'], 0, 'Les deux triangles obtenus ont la même aire.'],
            ['Dans un triangle isocèle, médiatrice, hauteur, médiane et bissectrice issues du sommet principal sont confondues.', ['Vrai', 'Faux'], 0, 'Et dans un triangle équilatéral, c’est vrai pour les trois sommets.'],
          ],
        },
        {
          titre: 'Connaître les angles d’un triangle',
          axe: 'Espace et géométrie',
          lecon: {
            titre: '180°, et tout ce qu’on en déduit',
            cours: `## La propriété fondamentale
Dans **tout** triangle, la somme des trois angles vaut **180°**.

C’est la propriété la plus utilisée de toute la géométrie du collège : connaissant deux angles, on trouve **toujours** le troisième par soustraction.

Si A = 65° et B = 40°, alors C = 180 − 65 − 40 = **75°**.

## Comment elle se démontre
On trace, par un sommet, la **parallèle** au côté opposé. Les **angles alternes-internes** ainsi formés sont égaux aux deux autres angles du triangle, et les trois se retrouvent alignés le long de la parallèle : ils forment un **angle plat**, soit 180°.

## Les conséquences
- **Triangle rectangle** : un angle vaut 90°, donc les deux autres sont **complémentaires** (leur somme vaut 90°).
- **Triangle équilatéral** : trois angles égaux, donc **60°** chacun.
- **Triangle isocèle** : si l’angle au sommet vaut a, chaque angle à la base vaut **(180 − a) ÷ 2**.
- **Triangle rectangle isocèle** : 90°, 45°, 45°.
- Un triangle ne peut avoir **qu’un seul** angle droit ou obtus — deux dépasseraient déjà 180°.

## L’angle extérieur
L’angle **extérieur** en un sommet — celui qui complète l’angle intérieur à 180° — est égal à la **somme des deux autres angles intérieurs**. C’est une conséquence directe, et un raccourci utile.

## Les erreurs à éviter
- Confondre l’angle **au sommet** et les angles **à la base** d’un triangle isocèle ;
- oublier que la propriété vaut pour **tous** les triangles, y compris ceux qui « ne ressemblent à rien » sur le dessin ;
- se fier au **dessin** plutôt qu’au calcul : une figure n’est jamais une preuve.

> Une figure sert à comprendre, pas à démontrer. Ce qui prouve, c’est la propriété citée et le calcul écrit.`,
          },
          questions: [
            ['Combien vaut la somme des angles d’un triangle ?', ['180°', '360°', '90°', 'Cela dépend du triangle'], 0, 'C’est vrai pour tout triangle, sans exception.'],
            ['Si deux angles d’un triangle valent 65° et 40°, combien vaut le troisième ?', ['75°', '85°', '105°', '95°'], 0, '180 − 65 − 40.'],
            ['Que peut-on dire des angles aigus d’un triangle rectangle ?', ['Ils sont complémentaires', 'Ils sont supplémentaires', 'Ils sont égaux', 'Ils valent 60° chacun'], 0, 'Leur somme vaut 90°.'],
            ['Combien vaut chaque angle d’un triangle équilatéral ?', ['60°', '45°', '90°', '30°'], 0, '180° ÷ 3.'],
            ['Dans un triangle isocèle dont l’angle au sommet vaut 40°, combien vaut chaque angle à la base ?', ['70°', '40°', '50°', '80°'], 0, '(180 − 40) ÷ 2.'],
            ['Combien un triangle peut-il avoir d’angles obtus ?', ['Un seul', 'Deux', 'Trois', 'Aucun'], 0, 'Deux angles obtus dépasseraient déjà 180°.'],
            ['À quoi est égal un angle extérieur d’un triangle ?', ['À la somme des deux angles intérieurs non adjacents', 'À l’angle intérieur adjacent', 'À 90°', 'À la moitié de 180°'], 0, 'C’est une conséquence directe de la propriété des 180°.'],
            ['Un dessin bien fait suffit à démontrer une égalité d’angles.', ['Vrai', 'Faux'], 1, 'Une figure sert à comprendre ; ce qui prouve, c’est la propriété citée et le calcul.'],
          ],
        },
        {
          titre: 'Symétrie axiale et centrale',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Le miroir et le demi-tour',
            cours: `## La symétrie axiale
C’est la symétrie **par rapport à une droite**, appelée l’**axe** — l’effet d’un **miroir**.

**Construire** l’image M′ d’un point M : l’axe est la **médiatrice** du segment [MM′]. Autrement dit, on trace la perpendiculaire à l’axe passant par M, et on reporte la même distance de l’autre côté.

Un point **situé sur l’axe** est sa propre image.

## La symétrie centrale
C’est la symétrie **par rapport à un point**, appelé le **centre** — l’effet d’un **demi-tour** (rotation de 180°).

**Construire** l’image M′ de M : le centre O est le **milieu** du segment [MM′]. Les points M, O et M′ sont donc **alignés**.

Le centre est sa propre image.

## Ce que les deux conservent
- les **longueurs** ;
- les **angles** ;
- les **aires** et les **périmètres** ;
- l’**alignement**, le **parallélisme**, les **milieux**.

Une figure et son image sont donc toujours **superposables**.

## Ce qui les distingue
- La symétrie **axiale** **retourne** la figure : l’image est « à l’envers », comme dans un miroir. Une main droite y devient une main gauche.
- La symétrie **centrale** ne la retourne pas : elle la fait pivoter d’un demi-tour, et l’image reste orientée dans le même sens de lecture.

> Le test : un texte reste-t-il lisible ? Par symétrie centrale, il est à l’envers mais dans le bon ordre ; par symétrie axiale, il est inversé comme dans un miroir.

## Les figures symétriques
- **Axe de symétrie** : rectangle 2, losange 2, carré 4, triangle isocèle 1, triangle équilatéral 3, cercle une infinité.
- **Centre de symétrie** : parallélogramme, rectangle, losange, carré, cercle. Le triangle isocèle et le triangle équilatéral n’en ont **pas**.

## Les usages
Frises, pavages, logos, architecture, sciences naturelles. Reconnaître une symétrie, c’est souvent diviser par deux le travail de construction ou de démonstration.`,
          },
          questions: [
            ['Par rapport à quoi se fait une symétrie axiale ?', ['Une droite, appelée axe', 'Un point, appelé centre', 'Un cercle', 'Un segment'], 0, 'C’est l’effet d’un miroir.'],
            ['Que représente l’axe pour le segment [MM′] ?', ['Sa médiatrice', 'Sa médiane', 'Sa bissectrice', 'Sa hauteur'], 0, 'Perpendiculaire au segment en son milieu.'],
            ['Par rapport à quoi se fait une symétrie centrale ?', ['Un point, appelé centre', 'Une droite', 'Un plan', 'Un cercle'], 0, 'C’est un demi-tour.'],
            ['Quel rôle joue le centre O dans une symétrie centrale ?', ['Il est le milieu du segment [MM′]', 'Il est la médiatrice de [MM′]', 'Il est perpendiculaire à [MM′]', 'Il est le symétrique de M'], 0, 'M, O et M′ sont alignés.'],
            ['Qu’est-ce qui distingue la symétrie axiale de la symétrie centrale ?', ['L’axiale retourne la figure, la centrale non', 'La centrale ne conserve pas les longueurs', 'L’axiale ne conserve pas les angles', 'Elles sont identiques'], 0, 'Le test du texte lisible le montre bien.'],
            ['Combien d’axes de symétrie a un carré ?', ['4', '2', '1', 'Aucun'], 0, 'Le rectangle et le losange en ont 2.'],
            ['Quelle figure n’a PAS de centre de symétrie ?', ['Le triangle équilatéral', 'Le parallélogramme', 'Le rectangle', 'Le cercle'], 0, 'Il a pourtant trois axes de symétrie.'],
            ['La symétrie centrale modifie l’aire de la figure.', ['Vrai', 'Faux'], 1, 'Les deux symétries conservent longueurs, angles, aires et périmètres.'],
          ],
        },
        {
          titre: 'Connaître et reconnaître les parallélogrammes',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Une famille et ses trois cas particuliers',
            cours: `## Le parallélogramme
Un quadrilatère dont les **côtés opposés sont parallèles** deux à deux.

Ses propriétés :
- les **côtés opposés** ont la même longueur ;
- les **angles opposés** ont la même mesure ;
- deux angles **consécutifs** sont supplémentaires (leur somme vaut 180°) ;
- les **diagonales se coupent en leur milieu** ;
- il possède un **centre de symétrie** : le point d’intersection des diagonales.

## Les trois cas particuliers
**Le rectangle** = un parallélogramme avec **un angle droit**.
→ quatre angles droits, et des **diagonales de même longueur**.

**Le losange** = un parallélogramme avec **deux côtés consécutifs égaux**.
→ quatre côtés égaux, et des **diagonales perpendiculaires**, qui sont aussi ses axes de symétrie.

**Le carré** = à la fois **rectangle et losange**.
→ il cumule toutes les propriétés des deux.

## Le tableau des diagonales
| Figure | Milieu commun | Même longueur | Perpendiculaires |
|---|---|---|---|
| Parallélogramme | oui | non | non |
| Rectangle | oui | **oui** | non |
| Losange | oui | non | **oui** |
| Carré | oui | **oui** | **oui** |

> Les **diagonales** sont l’outil de démonstration le plus efficace du chapitre : leurs trois propriétés suffisent à distinguer les quatre figures.

## Comment démontrer qu’un quadrilatère est un parallélogramme
Quatre chemins possibles, au choix selon les données :
1. ses côtés opposés sont **parallèles** deux à deux ;
2. ses côtés opposés ont la **même longueur** deux à deux ;
3. ses **diagonales se coupent en leur milieu** ;
4. deux côtés opposés sont **à la fois parallèles et de même longueur**.

## Les axes de symétrie
Parallélogramme : **aucun** (mais un centre). Rectangle : **2**. Losange : **2**. Carré : **4**.

## Les aires
Parallélogramme : **base × hauteur** — la hauteur, jamais le côté oblique.
Losange : **(D × d) ÷ 2**. Rectangle : **L × l**. Carré : **c²**.`,
          },
          questions: [
            ['Qu’est-ce qu’un parallélogramme ?', ['Un quadrilatère dont les côtés opposés sont parallèles deux à deux', 'Un quadrilatère à quatre côtés égaux', 'Un quadrilatère à quatre angles droits', 'Un quadrilatère quelconque'], 0, 'Ses diagonales se coupent en leur milieu.'],
            ['Que peut-on dire des diagonales d’un rectangle ?', ['Elles se coupent en leur milieu et ont la même longueur', 'Elles sont perpendiculaires', 'Elles sont parallèles', 'Elles sont de longueurs différentes'], 0, 'Le losange a, lui, des diagonales perpendiculaires.'],
            ['Qu’est-ce qu’un losange ?', ['Un parallélogramme dont deux côtés consécutifs sont égaux', 'Un parallélogramme avec un angle droit', 'Un quadrilatère aux diagonales égales', 'Un rectangle incliné'], 0, 'Ses quatre côtés sont alors égaux.'],
            ['Comment démontrer qu’un quadrilatère est un parallélogramme ?', ['En montrant que ses diagonales se coupent en leur milieu', 'En mesurant son aire', 'En vérifiant qu’il a quatre côtés', 'En calculant son périmètre'], 0, 'Trois autres chemins sont possibles selon les données.'],
            ['Combien d’axes de symétrie a un parallélogramme quelconque ?', ['Aucun', 'Un', 'Deux', 'Quatre'], 0, 'Il possède en revanche un centre de symétrie.'],
            ['Quelle est la formule de l’aire d’un parallélogramme ?', ['Base × hauteur', 'Base × côté oblique', '(base × hauteur) ÷ 2', 'Côté²'], 0, 'La hauteur, jamais le côté oblique.'],
            ['Que peut-on dire de deux angles consécutifs d’un parallélogramme ?', ['Ils sont supplémentaires', 'Ils sont égaux', 'Ils sont complémentaires', 'Ils sont droits'], 0, 'Leur somme vaut 180°.'],
            ['Un quadrilatère dont les diagonales se coupent en leur milieu et sont perpendiculaires est un rectangle.', ['Vrai', 'Faux'], 1, 'C’est un losange : le rectangle a des diagonales de même longueur.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Cours de l'ancien programme
        // ===================================================================
        {
          titre: 'Calculer le volume d’un parallélépipède, d’un cube et d’une pyramide',
          axe: 'Cours de l’ancien programme',
          lecon: {
            titre: 'Trois formules, et le tiers qu’on oublie',
            cours: `## Ce qu’est un volume
Le **volume** mesure la place qu’occupe un solide dans l’espace. Il s’exprime en unités **cubes** : mm³, cm³, dm³, m³.

## Le parallélépipède rectangle (ou pavé droit)
**V = L × l × h** — longueur × largeur × hauteur.

Un pavé de 5 cm × 3 cm × 2 cm a pour volume 5 × 3 × 2 = **30 cm³**.

## Le cube
C’est un pavé dont les trois dimensions sont égales :

**V = c × c × c = c³**

Un cube d’arête 4 cm a pour volume 4³ = **64 cm³**.

## La pyramide
**V = (aire de la base × hauteur) ÷ 3**

- La **hauteur** est le segment issu du sommet, **perpendiculaire** à la base — jamais l’arête latérale, qui est plus longue.
- Une pyramide à base carrée de côté 6 cm et de hauteur 10 cm : base = 36 cm², donc V = (36 × 10) ÷ 3 = **120 cm³**.

> **Le tiers est le facteur le plus oublié des copies.** Une pyramide occupe exactement le **tiers** du prisme de même base et de même hauteur — on peut le vérifier en versant du sable de l’un dans l’autre.

## Les conversions de volume
Elles se font **de 1 000 en 1 000**, parce qu’un volume est un produit de trois longueurs :
- 1 m³ = **1 000 dm³** = 1 000 000 cm³ ;
- 1 dm³ = 1 000 cm³.

## Le lien avec les contenances
- **1 dm³ = 1 L**
- **1 cm³ = 1 mL**
- **1 m³ = 1 000 L**

Ces trois égalités permettent de passer d’un volume à une contenance sans calcul.

## La méthode d’un exercice
1. Identifier le solide ;
2. vérifier que toutes les dimensions sont dans la **même unité** — c’est là que se perdent la plupart des points ;
3. appliquer la formule ;
4. donner le résultat avec son **unité cube**, et le convertir si l’énoncé demande des litres.`,
          },
          questions: [
            ['Quelle est la formule du volume d’un pavé droit ?', ['L × l × h', '2 × (L + l + h)', 'L × l', '(L × l × h) ÷ 3'], 0, 'Longueur × largeur × hauteur.'],
            ['Quel est le volume d’un cube d’arête 4 cm ?', ['64 cm³', '16 cm³', '12 cm³', '48 cm³'], 0, '4³ = 4 × 4 × 4.'],
            ['Quelle est la formule du volume d’une pyramide ?', ['(aire de la base × hauteur) ÷ 3', 'aire de la base × hauteur', '(aire de la base × hauteur) ÷ 2', 'périmètre de la base × hauteur'], 0, 'Le tiers est le facteur le plus souvent oublié.'],
            ['Quel est le volume d’une pyramide à base carrée de côté 6 cm et de hauteur 10 cm ?', ['120 cm³', '360 cm³', '60 cm³', '180 cm³'], 0, '(36 × 10) ÷ 3.'],
            ['Qu’est-ce que la hauteur d’une pyramide ?', ['Le segment issu du sommet, perpendiculaire à la base', 'L’arête latérale', 'Le côté de la base', 'La diagonale de la base'], 0, 'L’arête latérale est plus longue que la hauteur.'],
            ['Combien de dm³ vaut 1 m³ ?', ['1 000 dm³', '100 dm³', '10 dm³', '10 000 dm³'], 0, 'Les volumes se convertissent de 1 000 en 1 000.'],
            ['À combien de litres correspond 1 dm³ ?', ['1 L', '10 L', '100 L', '0,1 L'], 0, 'Et 1 cm³ correspond à 1 mL.'],
            ['Une pyramide a le même volume que le prisme de même base et de même hauteur.', ['Vrai', 'Faux'], 1, 'Elle en occupe exactement le tiers.'],
          ],
        },
      ],
    },
  ],
}
