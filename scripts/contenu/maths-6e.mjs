// Mathématiques — Sixième : LE PROGRAMME COMPLET (22 fiches).
//
// LE DÉFAUT. La page « Maths » d'un élève de 6e s'ouvrait sur cinq fiches
// héritées du premier jeu de données (migration 008) : « Nombres entiers et
// décimaux », « Fractions », « Proportionnalité », « Géométrie plane » et
// « Aires, périmètres et volumes ». Cinq titres pour une année entière, dans la
// matière la plus travaillée du collège.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 6 chapitres de la maquette de référence et
// leurs 22 fiches :
//   1. Nombres et calculs                                    (9)
//   2. Grandeurs et mesures                                   (3)
//   3. Espace et géométrie                                    (6)
//   4. La proportionnalité                                    (1)
//   5. Organisation et gestion des données et probabilités    (2)
//   6. Initiation à la pensée informatique                    (1)
//
// LE SIXIÈME CHAPITRE N'EST PAS UN SUPPLÉMENT. L'algorithmique entre au
// programme dès le cycle 3 : déplacements sur quadrillage, instructions,
// boucles, Scratch. La maquette lui donne un chapitre à part, et on la suit —
// c'est ce que l'élève retrouvera dans son cahier.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (a × b, 3/4, 12 cm², ≈).
//
// ⚠️ Le slug `maths` porte SIX modules (Tle = 255, 1re = 271, 3e = 294,
// 4e = 301, 5e = 308, celui-ci = 6e) : ne JAMAIS générer avec `--slugs maths`.
// Toujours `--modules maths-6e`.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 6e — LE PROGRAMME COMPLET (22 fiches)',

  motif: `CONSTAT : les maths de 6e n'avaient que les 5 fiches du premier jeu de données de
l'app — « Nombres entiers et décimaux », « Fractions », « Proportionnalité »,
« Géométrie plane », « Aires, périmètres et volumes ». Cinq titres très larges
pour l'année d'entrée au collège, dans la matière la plus travaillée. Un élève
qui révisait la division euclidienne, la symétrie axiale, la somme des angles
d'un triangle, les durées, les statistiques ou l'algorithmique ne trouvait RIEN.
Cette migration installe les 22 fiches, rangées sous les 6 chapitres de la
maquette, et retire les 5 fiches génériques.
LE CHAPITRE « INITIATION À LA PENSÉE INFORMATIQUE » EST AU PROGRAMME du cycle 3
(déplacements, instructions, boucles, Scratch) : il a droit à son chapitre,
comme dans la maquette de référence.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 22 fiches sous 6 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 22 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : l'ancien « Nombres entiers et
décimaux » est le début exact du titre neuf « Nombres entiers et décimaux :
définition, repérage et comparaisons », et chapters porte
UNIQUE(subject_id, level, title). Un ménage par titre demanderait de vérifier à
chaque relecture qu'aucune fiche neuve ne heurte l'un des cinq anciens libellés.
Le critère « pas de chapitre de programme » vise exactement les cinq lignes
voulues : elles datent de la 008, bien avant la colonne theme, tandis que les 22
fiches neuves en portent une dès l'INSERT — le ménage tourne AVANT les
insertions et ne peut donc jamais mordre sur elles, ni au premier passage ni au
rejeu.
Le filtre level = '6e' est indispensable : les maths existent sur sept niveaux,
et la 5e, la 4e, la 3e, la 1re et la Tle ont leurs propres migrations.
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
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Nombres et calculs (9 fiches)
        // ===================================================================
        {
          titre: 'Nombres entiers et décimaux : définition, repérage et comparaisons',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Lire, écrire et ranger les nombres',
            cours: `## Les entiers et les décimaux
Un **nombre entier** s’écrit sans virgule : 0, 7, 254.
Un **nombre décimal** a une partie décimale finie : 3,5 ; 0,08 ; 12,750.
Tout entier est un décimal (7 = 7,0), mais l’inverse est faux.

## Le tableau de numération
Chaque chiffre a une **valeur selon sa position** :

| centaines | dizaines | unités | , | dixièmes | centièmes | millièmes |
|---|---|---|---|---|---|---|
| 2 | 4 | 6 | , | 3 | 0 | 5 |

Dans 246,305 : le 3 vaut 3 **dixièmes**, le 5 vaut 5 **millièmes**.

> Ne pas confondre le **chiffre** (un symbole : 0 à 9) et le **nombre** (une quantité). Dans 246, le chiffre des dizaines est 4, mais le **nombre** de dizaines est 24.

## Les écritures d’un même nombre
- **décimale** : 3,25
- **fractionnaire** : 325/100
- **décomposée** : 3 + 2/10 + 5/100
Ajouter des zéros à droite de la partie décimale ne change rien : 3,25 = 3,250.

## Comparer deux décimaux
1. On compare d’abord les **parties entières** ;
2. si elles sont égales, on compare les **dixièmes**, puis les centièmes, etc.
On complète par des zéros pour avoir le même nombre de décimales.
Piège classique : **12,7 > 12,25**, car 7 dixièmes valent plus que 2 dixièmes — le nombre le plus « long » n’est pas le plus grand.

## Ranger et encadrer
- **Croissant** : du plus petit au plus grand ; **décroissant** : l’inverse.
- **Encadrer à l’unité** : 3,7 est entre **3 et 4**.
- **Arrondir au dixième** : on regarde le chiffre suivant, on arrondit au supérieur s’il vaut 5 ou plus. 3,47 → **3,5**.

## La demi-droite graduée
Chaque nombre a un **point** unique, appelé son **abscisse**. Plus on va à droite, plus le nombre est grand.`,
          },
          questions: [
            ['Dans 246,305, que vaut le chiffre 3 ?', ['3 dixièmes', '3 centièmes', '3 unités', '3 millièmes'], 0, 'Il occupe le premier rang après la virgule.'],
            ['Quelle est l’écriture fractionnaire de 3,25 ?', ['325/100', '325/10', '3,25/100', '25/100'], 0, 'Deux chiffres après la virgule, deux zéros au dénominateur.'],
            ['Quel nombre est le plus grand ?', ['12,7', '12,25', '12,199', '12,0999'], 0, '7 dixièmes valent plus que 2 dixièmes.'],
            ['Que vaut 3,47 arrondi au dixième ?', ['3,5', '3,4', '3,47', '4'], 0, 'Le chiffre suivant vaut 7, donc on arrondit au supérieur.'],
            ['Entre quels entiers consécutifs se situe 3,7 ?', ['Entre 3 et 4', 'Entre 2 et 3', 'Entre 3,5 et 4,5', 'Entre 0 et 3'], 0, 'C’est un encadrement à l’unité.'],
            ['Dans 246, quel est le nombre de dizaines ?', ['24', '4', '46', '240'], 0, 'Le chiffre des dizaines est 4, le nombre de dizaines est 24.'],
            ['Comment appelle-t-on le nombre associé à un point d’une demi-droite graduée ?', ['Son abscisse', 'Son ordonnée', 'Sa position', 'Sa graduation'], 0, 'Chaque nombre a un point unique.'],
            ['Écrire 3,250 au lieu de 3,25 change la valeur du nombre.', ['Vrai', 'Faux'], 1, 'Les zéros à droite de la partie décimale ne changent rien.'],
          ],
        },
        {
          titre: 'Nombres décimaux : addition, soustraction et multiplication',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Poser, calculer, vérifier',
            cours: `## Addition et soustraction
On **aligne les virgules**, quitte à compléter par des **zéros**.
12,5 + 3,75 → 12,50 + 3,75 = **16,25**
La virgule du résultat se place sous les autres.

## Multiplication
On multiplie **sans tenir compte des virgules**, puis on place la virgule : le produit a **autant de décimales que les deux facteurs réunis**.
3,2 × 1,5 : 32 × 15 = 480 ; 1 + 1 = 2 décimales → **4,80**, soit 4,8.

## Multiplier et diviser par 10, 100, 1 000
- **multiplier** : la virgule se déplace vers la **droite** ;
- **diviser** : vers la **gauche**.
On complète par des zéros si besoin. 4,7 × 100 = **470** ; 4,7 ÷ 100 = **0,047**.

## Les priorités opératoires
1. les **parenthèses**, de la plus intérieure à la plus extérieure ;
2. les **multiplications et divisions**, de gauche à droite ;
3. les **additions et soustractions**, de gauche à droite.
2 + 3 × 4 = 2 + 12 = **14**, et non 20.

## L’ordre de grandeur
Avant de calculer, on estime : 19,8 × 4,9 ≈ 20 × 5 = **100**. Si la machine affiche 9,7 ou 970, une virgule s’est déplacée.

> Un résultat qu’on n’a pas estimé d’abord est un résultat qu’on ne peut pas vérifier.

## Le vocabulaire
- addition → **somme** ; les nombres sont des **termes** ;
- soustraction → **différence** ;
- multiplication → **produit** ; les nombres sont des **facteurs** ;
- division → **quotient**.`,
          },
          questions: [
            ['Que faut-il faire avant de poser une addition de décimaux ?', ['Aligner les virgules', 'Supprimer les virgules', 'Multiplier par 10', 'Arrondir'], 0, 'On complète par des zéros si nécessaire.'],
            ['Combien de décimales a le produit 3,2 × 1,5 ?', ['Deux', 'Une', 'Trois', 'Aucune'], 0, 'Autant que les deux facteurs réunis.'],
            ['Combien vaut 4,7 × 100 ?', ['470', '47', '4 700', '0,047'], 0, 'La virgule se déplace de deux rangs vers la droite.'],
            ['Combien vaut 2 + 3 × 4 ?', ['14', '20', '24', '9'], 0, 'La multiplication est prioritaire.'],
            ['Comment appelle-t-on le résultat d’une multiplication ?', ['Le produit', 'La somme', 'La différence', 'Le quotient'], 0, 'Les nombres multipliés sont les facteurs.'],
            ['Quel est l’ordre de grandeur de 19,8 × 4,9 ?', ['Environ 100', 'Environ 10', 'Environ 1 000', 'Environ 25'], 0, 'On arrondit à 20 × 5.'],
            ['Combien vaut 4,7 ÷ 100 ?', ['0,047', '0,47', '470', '4,7'], 0, 'La virgule se déplace de deux rangs vers la gauche.'],
            ['Dans un calcul sans parenthèses, on calcule toujours de gauche à droite.', ['Vrai', 'Faux'], 1, 'Les multiplications et divisions passent avant.'],
          ],
        },
        {
          titre: 'Division euclidienne et divisibilité',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Partager en parts entières',
            cours: `## La division euclidienne
Diviser 47 par 5, c’est chercher combien de fois 5 tient dans 47, et ce qu’il reste :
**47 = 5 × 9 + 2**
- 47 est le **dividende**, 5 le **diviseur**, 9 le **quotient**, 2 le **reste**.
- Règle absolue : le **reste est toujours strictement inférieur au diviseur** (ici 2 < 5). Un reste plus grand signale une erreur.

## Diviseur et multiple
Quand le reste est **0**, la division est exacte : on dit que 5 **divise** 30, que 5 est un **diviseur** de 30, et que 30 est un **multiple** de 5. Ces trois phrases disent la même chose.

## Les critères de divisibilité
Un nombre est divisible par :
- **2** si son chiffre des unités est 0, 2, 4, 6 ou 8 (il est **pair**) ;
- **3** si la **somme de ses chiffres** est divisible par 3 ;
- **4** si le nombre formé par ses deux derniers chiffres l’est ;
- **5** si son chiffre des unités est 0 ou 5 ;
- **9** si la somme de ses chiffres est divisible par 9 ;
- **10** si son chiffre des unités est 0.

> Exemple : 5 274. Somme des chiffres = 18, divisible par 3 **et** par 9. Le nombre l’est donc aussi.

## Les nombres premiers
Un **nombre premier** a exactement **deux** diviseurs : 1 et lui-même. Les premiers sont 2, 3, 5, 7, 11, 13, 17, 19, 23…
**2 est le seul nombre premier pair.** **1 n’est pas premier** : il n’a qu’un seul diviseur.

## À quoi ça sert
Les critères permettent de **simplifier une fraction** sans calculatrice, et de vérifier un partage : 143 bonbons pour 5 enfants ne tombent pas juste (143 ne finit ni par 0 ni par 5).`,
          },
          questions: [
            ['Dans 47 = 5 × 9 + 2, que représente le 2 ?', ['Le reste', 'Le quotient', 'Le diviseur', 'Le dividende'], 0, 'Le quotient est 9, le diviseur 5.'],
            ['Quelle règle le reste doit-il toujours respecter ?', ['Être strictement inférieur au diviseur', 'Être supérieur au quotient', 'Être pair', 'Être nul'], 0, 'Un reste plus grand signale une erreur.'],
            ['À quelle condition un nombre est-il divisible par 3 ?', ['Si la somme de ses chiffres est divisible par 3', 'S’il se termine par 3', 'S’il est impair', 'S’il se termine par 0'], 0, 'Le critère porte sur la somme des chiffres.'],
            ['5 274 est-il divisible par 9 ?', ['Oui, car 5+2+7+4 = 18 est divisible par 9', 'Non, il est impair', 'Oui, car il finit par 4', 'Non, la somme vaut 17'], 0, 'Le critère de 9 porte sur la somme des chiffres.'],
            ['Qu’est-ce qu’un nombre premier ?', ['Un nombre ayant exactement deux diviseurs : 1 et lui-même', 'Un nombre impair', 'Un nombre inférieur à 10', 'Le premier d’une liste'], 0, '2, 3, 5, 7, 11…'],
            ['Quel est le seul nombre premier pair ?', ['2', '4', '0', 'Il n’y en a pas'], 0, 'Tous les autres pairs sont divisibles par 2.'],
            ['Si 30 ÷ 5 a un reste nul, que peut-on dire ?', ['5 est un diviseur de 30 et 30 un multiple de 5', '5 est un multiple de 30', '30 est premier', 'Le quotient est 0'], 0, 'Les deux phrases disent la même chose.'],
            ['Le nombre 1 est un nombre premier.', ['Vrai', 'Faux'], 1, 'Il n’a qu’un seul diviseur, alors qu’il en faut exactement deux.'],
          ],
        },
        {
          titre: 'Division décimale',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Continuer la division après la virgule',
            cours: `## Le principe
Dans la **division décimale**, on ne s’arrête pas au reste : on continue en abaissant des zéros après la virgule.
13 ÷ 4 : 4 tient 3 fois dans 13, reste 1. On pose la virgule au quotient, on abaisse un zéro : 10 ÷ 4 = 2, reste 2 ; on abaisse encore : 20 ÷ 4 = 5, reste 0.
**13 ÷ 4 = 3,25**

## Diviser par un nombre à virgule
On ne divise **jamais** par un décimal. On multiplie **le dividende et le diviseur** par 10, 100 ou 1 000 pour rendre le diviseur entier — le quotient ne change pas.
7,5 ÷ 0,25 → **750 ÷ 25 = 30**

## Quand ça ne tombe pas juste
Certaines divisions ne s’arrêtent jamais : **1 ÷ 3 = 0,3333…** On donne alors une **valeur approchée** :
- **par défaut** : on tronque (0,33) ;
- **par excès** : on prend la valeur juste au-dessus (0,34) ;
- **arrondie** : la plus proche (0,33).

## Le symbole ≈
On écrit **1 ÷ 3 ≈ 0,33** avec le signe « environ égal », jamais avec un signe =. Écrire 1 ÷ 3 = 0,33 est **faux**.

> Le signe = annonce une égalité exacte. Quand la valeur est approchée, le signe doit le dire.

## Vérifier une division
On multiplie le quotient par le diviseur : on doit retrouver le dividende. 3,25 × 4 = 13. C’est la vérification à faire systématiquement.

## Dans la vie
Partager une addition, calculer un prix au kilo, une consommation aux 100 km : la division décimale est l’outil du quotidien.`,
          },
          questions: [
            ['Combien vaut 13 ÷ 4 ?', ['3,25', '3,2', '3,4', '3'], 0, 'On abaisse des zéros après la virgule.'],
            ['Comment divise-t-on par un nombre à virgule ?', ['On multiplie dividende et diviseur par 10, 100 ou 1 000', 'On supprime la virgule du diviseur seulement', 'On arrondit le diviseur', 'On inverse la division'], 0, '7,5 ÷ 0,25 devient 750 ÷ 25.'],
            ['Combien vaut 7,5 ÷ 0,25 ?', ['30', '3', '300', '0,3'], 0, 'On se ramène à 750 ÷ 25.'],
            ['Quel signe emploie-t-on pour une valeur approchée ?', ['≈', '=', '<', '×'], 0, 'Écrire 1 ÷ 3 = 0,33 serait faux.'],
            ['Que vaut 1 ÷ 3 arrondi au centième ?', ['≈ 0,33', '= 0,33', '≈ 0,34', '= 0,3'], 0, 'La division ne s’arrête jamais.'],
            ['Comment vérifie-t-on une division ?', ['En multipliant le quotient par le diviseur', 'En additionnant les termes', 'En divisant à nouveau', 'En arrondissant'], 0, 'On doit retrouver le dividende.'],
            ['Qu’est-ce qu’une valeur approchée par défaut ?', ['Une valeur tronquée, juste en dessous', 'La valeur juste au-dessus', 'La valeur exacte', 'La moyenne des deux'], 0, 'Par excès, on prend celle juste au-dessus.'],
            ['Toutes les divisions décimales finissent par s’arrêter.', ['Vrai', 'Faux'], 1, '1 ÷ 3 = 0,3333… ne s’arrête jamais.'],
          ],
        },
        {
          titre: 'Fraction : sens - quotient',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Une fraction, c’est un partage et une division',
            cours: `## Deux façons de lire a/b
- **Un partage** : 3/4 d’une tarte, c’est la tarte coupée en **4** parts égales dont on prend **3**.
- **Une division** : 3/4 est le **quotient** de 3 par 4, c’est-à-dire 0,75.
Ces deux lectures sont la même chose, et savoir passer de l’une à l’autre est l’essentiel du chapitre.

## Le vocabulaire
Dans **a/b** : **a** est le **numérateur** (combien on prend), **b** le **dénominateur** (en combien de parts on coupe). Le dénominateur n’est **jamais** égal à 0.

## Fractions particulières
- Si le numérateur est **plus petit** que le dénominateur, la fraction est **inférieure à 1** (3/4).
- S’ils sont **égaux**, elle vaut **1** (4/4).
- Si le numérateur est **plus grand**, elle est **supérieure à 1** (7/4).
- Une **fraction décimale** a pour dénominateur 10, 100, 1 000.

## Fractions égales
Multiplier ou diviser **numérateur et dénominateur par un même nombre** ne change pas la valeur :
1/2 = 2/4 = 3/6 = 50/100.
**Simplifier**, c’est diviser les deux par un même nombre jusqu’à ne plus pouvoir : 12/18 = 6/9 = **2/3**. La fraction est alors **irréductible**.

## Prendre une fraction d’une quantité
« Prendre les 3/4 de 20 », c’est calculer 20 ÷ 4 × 3 = **15**. On peut diviser d’abord puis multiplier, ou l’inverse : le résultat est le même.

> Le mot « de » se traduit par une multiplication : les 3/4 **de** 20, c’est 3/4 × 20.

## Les équivalences à connaître par cœur
1/2 = 0,5 ; 1/4 = 0,25 ; 3/4 = 0,75 ; 1/5 = 0,2 ; 1/10 = 0,1.`,
          },
          questions: [
            ['Dans la fraction 3/4, comment appelle-t-on le 4 ?', ['Le dénominateur', 'Le numérateur', 'Le quotient', 'Le reste'], 0, 'Il indique en combien de parts on coupe.'],
            ['Que vaut 3/4 en écriture décimale ?', ['0,75', '0,34', '1,33', '0,25'], 0, 'C’est le quotient de 3 par 4.'],
            ['Comment simplifier 12/18 ?', ['2/3', '6/8', '4/6', '12/18 est irréductible'], 0, 'On divise les deux termes par 6.'],
            ['Combien font les 3/4 de 20 ?', ['15', '12', '5', '80'], 0, '20 ÷ 4 × 3 = 15.'],
            ['Quelle fraction est supérieure à 1 ?', ['7/4', '3/4', '4/4', '1/4'], 0, 'Son numérateur dépasse son dénominateur.'],
            ['Que peut valoir le dénominateur d’une fraction ?', ['Tout nombre sauf 0', 'N’importe quel nombre', 'Uniquement un entier pair', 'Uniquement 10, 100 ou 1 000'], 0, 'On ne divise jamais par zéro.'],
            ['Comment obtient-on une fraction égale à une autre ?', ['En multipliant ou divisant les deux termes par un même nombre', 'En ajoutant le même nombre aux deux termes', 'En changeant le numérateur seul', 'En inversant la fraction'], 0, '1/2 = 2/4 = 50/100.'],
            ['Une fraction irréductible peut encore être simplifiée.', ['Vrai', 'Faux'], 1, 'C’est précisément la définition : on ne peut plus la simplifier.'],
          ],
        },
        {
          titre: 'Fraction : encadrer - comparer - ordonner',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Situer et ranger des fractions',
            cours: `## Comparer à 1
C’est le premier réflexe, et souvent il suffit :
- numérateur **<** dénominateur → la fraction est **< 1** ;
- numérateur **=** dénominateur → elle vaut **1** ;
- numérateur **>** dénominateur → elle est **> 1**.
Ainsi 5/8 < 1 < 9/7, sans aucun calcul.

## Même dénominateur
On compare les **numérateurs** : 3/7 < 5/7. Plus on prend de parts de la même taille, plus on en a.

## Même numérateur
On compare les dénominateurs **à l’envers** : 3/5 **>** 3/8. Plus on coupe en parts nombreuses, plus chaque part est petite.

> C’est le piège le plus fréquent : avec le même numérateur, le plus grand dénominateur donne la plus **petite** fraction.

## Dénominateurs différents
Deux méthodes :
1. **Mettre au même dénominateur** : pour 2/3 et 3/4, on prend 12. 2/3 = 8/12 et 3/4 = 9/12, donc 2/3 **<** 3/4.
2. **Passer en décimal** : 2/3 ≈ 0,67 et 3/4 = 0,75.

## Encadrer entre deux entiers
On effectue la division : 17/5 = 3,4, donc **3 < 17/5 < 4**.

## Placer sur une demi-droite graduée
On partage chaque unité en autant de parts que l’indique le dénominateur, puis on compte les numérateurs. C’est le meilleur moyen de **voir** qu’une fraction est un nombre comme un autre.

## Fraction et pourcentage
1/2 = 50 % ; 1/4 = 25 % ; 3/4 = 75 % ; 1/10 = 10 %. Ces repères servent à comparer très vite.`,
          },
          questions: [
            ['Comment comparer 3/7 et 5/7 ?', ['3/7 < 5/7, on compare les numérateurs', '3/7 > 5/7', 'Elles sont égales', 'On ne peut pas comparer'], 0, 'Les parts sont de même taille.'],
            ['Quelle fraction est la plus grande : 3/5 ou 3/8 ?', ['3/5', '3/8', 'Elles sont égales', 'Cela dépend'], 0, 'À numérateur égal, le plus grand dénominateur donne la plus petite fraction.'],
            ['Comment comparer 2/3 et 3/4 ?', ['En les mettant au même dénominateur : 8/12 < 9/12', 'En comparant les numérateurs seuls', 'En comparant les dénominateurs seuls', 'Elles sont égales'], 0, 'On peut aussi passer en décimal.'],
            ['Entre quels entiers se situe 17/5 ?', ['Entre 3 et 4', 'Entre 2 et 3', 'Entre 4 et 5', 'Entre 16 et 18'], 0, '17/5 = 3,4.'],
            ['Comment sait-on tout de suite que 5/8 est inférieur à 1 ?', ['Son numérateur est plus petit que son dénominateur', 'Son dénominateur est pair', 'Elle est irréductible', 'Son numérateur est impair'], 0, 'C’est le premier réflexe de comparaison.'],
            ['À quel pourcentage correspond 3/4 ?', ['75 %', '34 %', '43 %', '25 %'], 0, 'Un repère à connaître par cœur.'],
            ['Comment place-t-on 3/4 sur une demi-droite graduée ?', ['On partage l’unité en 4 et on compte 3 parts', 'On place 3 puis on divise par 4', 'On place le point à 4 unités', 'On ne peut pas y placer une fraction'], 0, 'Une fraction est un nombre comme un autre.'],
            ['Avec le même numérateur, la fraction au plus grand dénominateur est la plus grande.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : les parts sont plus petites.'],
          ],
        },
        {
          titre: 'Fractions et calculs',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Additionner, soustraire et multiplier des fractions',
            cours: `## Additionner au même dénominateur
On **ajoute les numérateurs** et on **garde** le dénominateur :
2/7 + 3/7 = **5/7**
On ne additionne **jamais** les dénominateurs : 2/7 + 3/7 ne fait pas 5/14.

> On ajoute des parts de même taille : leur nombre change, pas leur taille.

## Dénominateurs différents
Il faut d’abord les **rendre égaux**, en cherchant un dénominateur commun :
1/2 + 1/3 → 3/6 + 2/6 = **5/6**
Le plus simple est souvent de multiplier les deux dénominateurs entre eux (ici 2 × 3 = 6).

## Soustraire
Même méthode : 5/8 − 2/8 = **3/8**.

## Multiplier par un entier
On multiplie **le numérateur seulement** :
3 × 2/5 = **6/5**

## Multiplier deux fractions
On multiplie les numérateurs entre eux et les dénominateurs entre eux :
2/3 × 3/4 = 6/12 = **1/2**
On simplifie avant de multiplier quand c’est possible : c’est plus rapide et les nombres restent petits.

## Fraction d’une quantité
« Les 2/5 de 30 » : 30 ÷ 5 × 2 = **12**. Le mot « de » se traduit par une multiplication.

## Toujours simplifier le résultat
Un résultat s’écrit sous sa forme **irréductible** : 6/12 s’écrit 1/2. C’est une exigence de présentation autant que de calcul.`,
          },
          questions: [
            ['Combien font 2/7 + 3/7 ?', ['5/7', '5/14', '6/7', '5/49'], 0, 'On ajoute les numérateurs et on garde le dénominateur.'],
            ['Combien font 1/2 + 1/3 ?', ['5/6', '2/5', '1/5', '2/6'], 0, 'On passe par le dénominateur commun 6.'],
            ['Combien font 3 × 2/5 ?', ['6/5', '6/15', '5/6', '2/15'], 0, 'On multiplie le numérateur seulement.'],
            ['Combien font 2/3 × 3/4 ?', ['1/2', '5/7', '6/7', '2/4'], 0, '6/12 simplifié donne 1/2.'],
            ['Combien font les 2/5 de 30 ?', ['12', '15', '6', '60'], 0, '30 ÷ 5 × 2 = 12.'],
            ['Combien font 5/8 − 2/8 ?', ['3/8', '3/16', '7/8', '3'], 0, 'On soustrait les numérateurs.'],
            ['Comment doit-on écrire un résultat fractionnaire ?', ['Sous sa forme irréductible', 'Toujours en centièmes', 'Toujours avec un dénominateur pair', 'Peu importe'], 0, '6/12 s’écrit 1/2.'],
            ['Pour additionner deux fractions, on additionne aussi les dénominateurs.', ['Vrai', 'Faux'], 1, 'On garde le dénominateur commun.'],
          ],
        },
        {
          titre: 'Pourcentages',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Compter pour cent',
            cours: `## Ce qu’est un pourcentage
**t %** signifie **t pour 100**, c’est-à-dire la fraction **t/100**.
25 % = 25/100 = 1/4 = **0,25**.
Un pourcentage est donc simplement une autre façon d’écrire une fraction ou un décimal.

## Appliquer un pourcentage
Prendre **t %** d’une quantité, c’est **multiplier par t/100** — ou par le décimal correspondant.
30 % de 80 = 80 × 30 ÷ 100 = **24**.

## Les pourcentages usuels, en calcul mental
- **50 %** → on divise par 2
- **25 %** → on divise par 4
- **10 %** → on divise par 10
- **1 %** → on divise par 100
- **75 %** → 50 % + 25 %
Avec ces repères, on calcule 35 % comme 25 % + 10 %.

## Augmentations et réductions
- Une réduction de 20 % : on **retire** 20 % du prix, ou plus vite, on garde **80 %** du prix.
  Un article à 50 € réduit de 20 % coûte 50 × 0,8 = **40 €**.
- Une augmentation de 20 % : on garde **120 %**, soit × 1,2.

> Le raccourci — multiplier par 0,8 au lieu de calculer puis soustraire — évite une étape et donc une erreur.

## Calculer un pourcentage
Quelle proportion 12 représente-t-il sur 40 ? On calcule 12 ÷ 40 = 0,3 = **30 %**.

## Ce qui trompe
Une baisse de 20 % suivie d’une hausse de 20 % **ne ramène pas** au prix de départ : 100 → 80 → 96. Les pourcentages ne s’additionnent pas comme des nombres.`,
          },
          questions: [
            ['Que signifie 25 % ?', ['25 pour 100, soit 1/4', '25 unités', '25 fois plus', '2,5 pour 100'], 0, 'C’est la fraction 25/100.'],
            ['Combien font 30 % de 80 ?', ['24', '30', '2,4', '240'], 0, '80 × 30 ÷ 100.'],
            ['Quel est le calcul rapide pour prendre 50 % ?', ['Diviser par 2', 'Diviser par 4', 'Multiplier par 2', 'Diviser par 10'], 0, '25 % correspond à diviser par 4.'],
            ['Un article à 50 € est réduit de 20 %. Quel est son nouveau prix ?', ['40 €', '30 €', '45 €', '10 €'], 0, 'On garde 80 % : 50 × 0,8.'],
            ['Par combien multiplie-t-on pour une augmentation de 20 % ?', ['1,2', '0,8', '20', '0,2'], 0, 'On garde 120 % du prix.'],
            ['Quel pourcentage 12 représente-t-il sur 40 ?', ['30 %', '12 %', '40 %', '3 %'], 0, '12 ÷ 40 = 0,3.'],
            ['Un prix baisse de 20 % puis augmente de 20 %. Que vaut-il ?', ['96 % du prix de départ', 'Le prix de départ', '104 %', '80 %'], 0, '100 → 80 → 96 : les pourcentages ne s’additionnent pas.'],
            ['Prendre 10 % d’un nombre revient à le diviser par 10.', ['Vrai', 'Faux'], 0, 'C’est un repère de calcul mental très utile.'],
          ],
        },
        {
          titre: 'Résoudre des problèmes mettant en jeu des nombres inconnus',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Trouver ce qu’on ne sait pas encore',
            cours: `## Le nombre inconnu
Dans « J’ajoute 7 à un nombre et j’obtiens 23 », le nombre cherché est l’**inconnu**. On peut le noter par un point d’interrogation, une case vide ou une **lettre** : *x* + 7 = 23.

## Le raisonnement par l’opération inverse
Chaque opération a son inverse :
- l’addition ↔ la **soustraction**
- la multiplication ↔ la **division**
Pour *x* + 7 = 23, on fait 23 − 7 = **16**.
Pour 4 × *x* = 52, on fait 52 ÷ 4 = **13**.

## La méthode en quatre temps
1. **Lire** l’énoncé en entier, sans calculer ;
2. **Repérer** ce qu’on cherche et ce qu’on connaît ;
3. **Choisir** l’opération, puis calculer ;
4. **Vérifier** en remplaçant l’inconnu par le résultat, et **répondre par une phrase**.

> Une réponse sans phrase n’est pas une réponse : « 16 » ne dit pas ce que 16 désigne.

## Les problèmes à plusieurs étapes
Beaucoup d’énoncés demandent **deux** calculs. On peut s’aider :
- d’un **schéma** en barres ;
- d’un **tableau** ;
- de la question intermédiaire : « pour trouver ceci, que me faut-il d’abord ? »

## Le sens des mots
« de plus que » → addition ; « de moins que » → soustraction ; « fois plus » → multiplication ; « partagé également » → division. Mais la prudence reste de mise : c’est la **situation** qui décide, pas le mot isolé.

## Vérifier par l’ordre de grandeur
Si un problème demande le prix d’un stylo et qu’on trouve 400 €, il y a une erreur — même si le calcul semble juste.`,
          },
          questions: [
            ['Comment trouve-t-on x dans x + 7 = 23 ?', ['En calculant 23 − 7', 'En calculant 23 + 7', 'En calculant 23 × 7', 'En calculant 7 − 23'], 0, 'On utilise l’opération inverse.'],
            ['Comment trouve-t-on x dans 4 × x = 52 ?', ['En calculant 52 ÷ 4', 'En calculant 52 × 4', 'En calculant 52 − 4', 'En calculant 4 ÷ 52'], 0, 'La division est l’inverse de la multiplication.'],
            ['Quelle est l’opération inverse de l’addition ?', ['La soustraction', 'La multiplication', 'La division', 'La puissance'], 0, 'La division est l’inverse de la multiplication.'],
            ['Que faut-il faire après avoir trouvé le résultat d’un problème ?', ['Vérifier et répondre par une phrase', 'Passer au suivant', 'Souligner le calcul', 'Arrondir'], 0, 'Un nombre seul ne dit pas ce qu’il désigne.'],
            ['À quelle opération correspond « partagé également » ?', ['La division', 'La multiplication', 'L’addition', 'La soustraction'], 0, 'Mais c’est la situation qui décide en dernier ressort.'],
            ['Qu’est-ce qui aide à résoudre un problème à plusieurs étapes ?', ['Un schéma en barres ou une question intermédiaire', 'Calculer tout de suite', 'Ne lire que la question', 'Choisir au hasard'], 0, '« Que me faut-il d’abord ? »'],
            ['Comment repérer un résultat aberrant ?', ['Par son ordre de grandeur', 'Par sa longueur', 'Par le nombre de chiffres', 'On ne peut pas'], 0, 'Un stylo à 400 € signale une erreur.'],
            ['Il suffit de repérer un mot-clé pour choisir la bonne opération.', ['Vrai', 'Faux'], 1, 'C’est la situation entière qui décide.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Grandeurs et mesures (3 fiches)
        // ===================================================================
        {
          titre: 'Calculer des périmètres',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Le tour d’une figure',
            cours: `## Ce qu’est un périmètre
Le **périmètre** est la **longueur du contour** d’une figure. Il se mesure en unités de longueur : **mm, cm, dm, m, km**.

## Les formules à connaître
- **Carré** de côté c : P = **4 × c**
- **Rectangle** de longueur L et largeur l : P = **2 × (L + l)**
- **Triangle** : P = somme des trois côtés
- **Cercle** de rayon r : P = **2 × π × r**, ou π × d avec d le diamètre
On prend **π ≈ 3,14**.

## Le vocabulaire du cercle
Le **rayon** relie le centre à un point du cercle ; le **diamètre** traverse le cercle en passant par le centre : **d = 2 × r**. Le périmètre du cercle s’appelle aussi la **circonférence**.

## Les conversions de longueur
km — hm — dam — **m** — dm — cm — mm : chaque rang vaut **10 fois** le suivant.
1 m = 100 cm ; 1 km = 1 000 m ; 1 cm = 10 mm.

> Une seule erreur de conversion suffit à fausser tout un exercice : on convertit **avant** de calculer, et dans l’unité demandée.

## Le piège du périmètre et de l’aire
Deux figures de **même périmètre** peuvent avoir des **aires différentes**. Un rectangle 1 × 5 et un carré de côté 3 ont tous deux un périmètre de 12, mais des aires de 5 et 9. Périmètre et aire mesurent deux choses différentes.

## Périmètre d’une figure composée
On additionne les longueurs de tous les segments du contour — **et seulement** ceux du contour. Les traits intérieurs ne comptent pas.`,
          },
          questions: [
            ['Quelle est la formule du périmètre d’un rectangle ?', ['2 × (L + l)', 'L × l', 'L + l', '4 × L'], 0, 'On fait le tour : deux longueurs et deux largeurs.'],
            ['Quelle est la formule du périmètre d’un carré de côté c ?', ['4 × c', 'c × c', '2 × c', 'c + 4'], 0, 'Les quatre côtés sont égaux.'],
            ['Quelle est la formule du périmètre d’un cercle de rayon r ?', ['2 × π × r', 'π × r × r', 'π × r', '2 × r'], 0, 'On peut aussi écrire π × d.'],
            ['Quelle est la relation entre le diamètre et le rayon ?', ['d = 2 × r', 'd = r ÷ 2', 'd = r', 'd = r + 2'], 0, 'Le diamètre passe par le centre.'],
            ['Combien de centimètres dans 1 mètre ?', ['100 cm', '10 cm', '1 000 cm', '1 cm'], 0, 'Et 1 km vaut 1 000 m.'],
            ['Quelle valeur approchée prend-on pour π ?', ['3,14', '3,41', '2,14', '31,4'], 0, 'C’est la valeur usuelle en 6e.'],
            ['Comment calcule-t-on le périmètre d’une figure composée ?', ['En additionnant seulement les segments du contour', 'En additionnant tous les traits du dessin', 'En multipliant les côtés', 'En mesurant la surface'], 0, 'Les traits intérieurs ne comptent pas.'],
            ['Deux figures de même périmètre ont forcément la même aire.', ['Vrai', 'Faux'], 1, 'Un rectangle 1 × 5 et un carré de côté 3 ont le même périmètre, pas la même aire.'],
          ],
        },
        {
          titre: 'Calculer et convertir des aires',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'La surface, et ses unités piégeuses',
            cours: `## Ce qu’est une aire
L’**aire** mesure la **surface** occupée par une figure. Elle s’exprime en unités **carrées** : mm², cm², dm², m², km².

## Les formules
- **Carré** de côté c : A = **c × c**
- **Rectangle** : A = **L × l**
- **Triangle** : A = **(base × hauteur) ÷ 2**
- **Disque** de rayon r : A = **π × r × r**
- **Parallélogramme** : A = base × hauteur

## La hauteur d’un triangle
C’est le segment **perpendiculaire** à la base, mené du sommet opposé. Elle n’est **pas** forcément un côté du triangle — c’est l’erreur la plus fréquente.

## Les conversions, et pourquoi elles piègent
Pour les aires, chaque rang vaut **100 fois** le suivant, et non 10 :
- 1 m² = **10 000** cm²
- 1 cm² = **100** mm²
- 1 km² = **1 000 000** m²

> Un carré de 1 m de côté mesure 100 cm × 100 cm = 10 000 cm². C’est la raison du facteur 100 : on multiplie deux longueurs, donc on multiplie deux fois par 10.

## Les unités agraires
1 **are** (a) = 100 m² ; 1 **hectare** (ha) = 10 000 m² = 100 ares. Un terrain de football fait environ 0,7 ha.

## Aire d’une figure composée
On **découpe** la figure en formes connues, on calcule chaque aire, puis on additionne — ou on soustrait s’il s’agit d’un trou.`,
          },
          questions: [
            ['Quelle est la formule de l’aire d’un rectangle ?', ['L × l', '2 × (L + l)', 'L + l', '4 × L'], 0, 'Le résultat s’exprime en unités carrées.'],
            ['Quelle est la formule de l’aire d’un triangle ?', ['(base × hauteur) ÷ 2', 'base × hauteur', 'base + hauteur', '(base + hauteur) ÷ 2'], 0, 'Le triangle est la moitié d’un rectangle.'],
            ['Combien de cm² dans 1 m² ?', ['10 000 cm²', '100 cm²', '1 000 cm²', '10 cm²'], 0, '100 cm × 100 cm.'],
            ['Quelle est la formule de l’aire d’un disque de rayon r ?', ['π × r × r', '2 × π × r', 'π × d', 'r × r'], 0, '2 × π × r donne le périmètre.'],
            ['Qu’est-ce que la hauteur d’un triangle ?', ['Le segment perpendiculaire à la base issu du sommet opposé', 'Le côté le plus long', 'Le côté le plus court', 'La moitié de la base'], 0, 'Elle n’est pas forcément un côté.'],
            ['Combien de m² dans 1 hectare ?', ['10 000 m²', '100 m²', '1 000 m²', '1 000 000 m²'], 0, 'Un hectare vaut aussi 100 ares.'],
            ['Combien de mm² dans 1 cm² ?', ['100 mm²', '10 mm²', '1 000 mm²', '10 000 mm²'], 0, '10 mm × 10 mm.'],
            ['Pour les aires, chaque unité vaut 10 fois la suivante.', ['Vrai', 'Faux'], 1, 'Elle vaut 100 fois : on multiplie deux longueurs.'],
          ],
        },
        {
          titre: 'Calculer des horaires et des durées, convertir des durées',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Compter en base 60',
            cours: `## Les unités de durée
1 jour = **24 h** ; 1 h = **60 min** ; 1 min = **60 s**.
Attention : le temps ne se compte **pas** en base 10. C’est la source de presque toutes les erreurs du chapitre.

## Convertir
- h → min : × 60. **2 h 30 = 150 min**
- min → s : × 60
- min → h : ÷ 60
Piège majeur : **2,5 h = 2 h 30**, et non 2 h 5. La partie décimale se convertit : 0,5 × 60 = 30 min.

> 1,25 h vaut 1 h 15, pas 1 h 25. Chaque fois qu’une durée est écrite avec une virgule, il faut convertir la partie décimale.

## Calculer une durée entre deux horaires
De 8 h 45 à 11 h 20 :
- de 8 h 45 à 9 h : **15 min**
- de 9 h à 11 h : **2 h**
- de 11 h à 11 h 20 : **20 min**
Total : **2 h 35**.
On peut aussi poser la soustraction, en pensant à emprunter **60** et non 10.

## Ajouter une durée à un horaire
14 h 50 + 35 min = 14 h 85 → comme 85 > 60, on retire 60 et on ajoute 1 h : **15 h 25**.

## Les horaires
On lit l’heure en format 24 h : 14 h correspond à 2 h de l’après-midi. Un tableau d’horaires (train, bus) se lit en colonnes : chaque colonne est un trajet.

## Vitesse, distance et durée
**v = d ÷ t**, **d = v × t**, **t = d ÷ v**. Les unités doivent concorder : des km/h avec des heures, des m/s avec des secondes.`,
          },
          questions: [
            ['Combien de minutes dans 2 h 30 ?', ['150 min', '230 min', '250 min', '120 min'], 0, '2 × 60 + 30.'],
            ['À quoi correspond 2,5 h ?', ['2 h 30', '2 h 5', '2 h 50', '2 h 25'], 0, '0,5 × 60 = 30 min.'],
            ['Quelle durée sépare 8 h 45 de 11 h 20 ?', ['2 h 35', '3 h 35', '2 h 25', '3 h 25'], 0, '15 min + 2 h + 20 min.'],
            ['Combien font 14 h 50 + 35 min ?', ['15 h 25', '14 h 85', '15 h 85', '14 h 25'], 0, 'On retire 60 min et on ajoute 1 h.'],
            ['Combien de secondes dans une minute ?', ['60', '100', '30', '10'], 0, 'Le temps ne se compte pas en base 10.'],
            ['À quoi correspond 1,25 h ?', ['1 h 15', '1 h 25', '1 h 250', '1 h 2'], 0, '0,25 × 60 = 15 min.'],
            ['Quand on pose une soustraction de durées, que faut-il emprunter ?', ['60', '10', '100', '24'], 0, 'Les minutes se comptent en base 60.'],
            ['Une durée écrite 3,75 h vaut 3 h 75.', ['Vrai', 'Faux'], 1, 'Elle vaut 3 h 45 : 0,75 × 60 = 45 min.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Espace et géométrie (6 fiches)
        // ===================================================================
        {
          titre: 'Géométrie : éléments de base, propriétés des droites parallèles et perpendiculaires, médiatrices et bissectrices',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Le vocabulaire et les tracés fondamentaux',
            cours: `## Les objets de base
- **Point** : noté par une lettre majuscule (A).
- **Droite (AB)** : illimitée des deux côtés.
- **Segment [AB]** : limité par ses deux extrémités. Sa longueur se note AB.
- **Demi-droite [AB)** : une origine, illimitée de l’autre côté.
Les **notations** comptent : crochets pour un segment, parenthèses pour une droite.

## Perpendiculaires et parallèles
- Deux droites sont **perpendiculaires** si elles se coupent en formant un **angle droit** (90°). On note ⊥ et on marque le petit carré.
- Deux droites sont **parallèles** si elles ne se coupent **jamais**. On note //.

## Les trois propriétés à connaître
1. Si deux droites sont **perpendiculaires à une même droite**, alors elles sont **parallèles** entre elles.
2. Si deux droites sont **parallèles** et qu’une troisième est perpendiculaire à l’une, elle est **perpendiculaire à l’autre**.
3. Par un point donné, il passe **une seule** parallèle à une droite donnée, et **une seule** perpendiculaire.

> Ces propriétés servent à **démontrer**, pas seulement à constater sur le dessin. Un dessin peut tromper ; une propriété, non.

## La médiatrice
La **médiatrice** d’un segment est la droite **perpendiculaire** à ce segment passant par son **milieu**.
Propriété : ses points sont **équidistants** des deux extrémités. On la trace au compas, en traçant deux arcs de même rayon de part et d’autre.

## La bissectrice
La **bissectrice** d’un angle est la demi-droite qui le **partage en deux angles égaux**. Elle se trace aussi au compas.

## Les instruments
Règle graduée (mesurer), équerre (angle droit), compas (reporter une longueur, tracer un cercle), rapporteur (mesurer un angle).`,
          },
          questions: [
            ['Comment note-t-on un segment d’extrémités A et B ?', ['[AB]', '(AB)', '[AB)', 'AB sans signe'], 0, 'Les parenthèses désignent une droite.'],
            ['Que signifie « deux droites perpendiculaires » ?', ['Elles se coupent en formant un angle droit', 'Elles ne se coupent jamais', 'Elles sont de même longueur', 'Elles sont parallèles'], 0, 'On note ⊥.'],
            ['Qu’est-ce que la médiatrice d’un segment ?', ['La droite perpendiculaire au segment passant par son milieu', 'La droite qui partage un angle en deux', 'La droite parallèle au segment', 'Le milieu du segment'], 0, 'Ses points sont équidistants des extrémités.'],
            ['Qu’est-ce que la bissectrice d’un angle ?', ['La demi-droite qui partage l’angle en deux angles égaux', 'La perpendiculaire à un côté', 'Le milieu de l’angle droit', 'La droite parallèle'], 0, 'Elle se trace au compas.'],
            ['Si deux droites sont perpendiculaires à une même droite, alors…', ['elles sont parallèles entre elles', 'elles sont perpendiculaires entre elles', 'elles se coupent', 'on ne peut rien dire'], 0, 'C’est une propriété à savoir démontrer.'],
            ['Combien passe-t-il de parallèles à une droite par un point donné ?', ['Une seule', 'Deux', 'Aucune', 'Une infinité'], 0, 'Il en va de même pour la perpendiculaire.'],
            ['Quel instrument sert à mesurer un angle ?', ['Le rapporteur', 'L’équerre', 'Le compas', 'La règle graduée'], 0, 'L’équerre ne sert qu’à l’angle droit.'],
            ['Un dessin bien fait suffit à démontrer une propriété géométrique.', ['Vrai', 'Faux'], 1, 'Un dessin peut tromper : seule une propriété démontre.'],
          ],
        },
        {
          titre: 'Travailler avec les angles',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Mesurer, nommer, construire',
            cours: `## Ce qu’est un angle
Un **angle** est l’ouverture formée par deux demi-droites de même origine, le **sommet**. Il se mesure en **degrés (°)** avec un **rapporteur**.

## Les noms des angles
- **nul** : 0°
- **aigu** : entre 0° et 90°
- **droit** : exactement 90°
- **obtus** : entre 90° et 180°
- **plat** : exactement 180°
Retenir le sens : **aigu** = pointu, **obtus** = ouvert.

## Noter un angle
On l’écrit avec **trois lettres**, celle du **sommet au milieu** : l’angle ABC a pour sommet **B**. C’est une convention à respecter absolument, sinon l’angle désigné n’est pas le bon.

## Utiliser le rapporteur
1. Placer le **centre** du rapporteur sur le sommet ;
2. aligner le **zéro** sur l’un des côtés ;
3. lire la graduation sur l’autre côté, en choisissant **la bonne échelle** (les rapporteurs en ont deux).
Le contrôle de bon sens : si l’angle est visiblement aigu, la réponse doit être inférieure à 90°.

> Un rapporteur mal lu donne souvent 130° au lieu de 50° — les deux graduations sont complémentaires à 180°.

## Angles particuliers
- **Adjacents** : ils ont le même sommet, un côté commun, et sont de part et d’autre de ce côté.
- **Complémentaires** : leur somme vaut **90°**.
- **Supplémentaires** : leur somme vaut **180°**.
- **Opposés par le sommet** : ils sont **égaux**.

## Construire un angle
On trace un côté, on place le rapporteur, on marque le point à la mesure voulue, puis on trace la demi-droite.`,
          },
          questions: [
            ['Comment appelle-t-on un angle de 90° ?', ['Un angle droit', 'Un angle aigu', 'Un angle obtus', 'Un angle plat'], 0, 'L’angle plat mesure 180°.'],
            ['Comment appelle-t-on un angle compris entre 90° et 180° ?', ['Obtus', 'Aigu', 'Droit', 'Nul'], 0, 'L’angle aigu est inférieur à 90°.'],
            ['Dans la notation d’un angle ABC, quel point est le sommet ?', ['B', 'A', 'C', 'Les trois'], 0, 'Le sommet s’écrit toujours au milieu.'],
            ['Que valent deux angles complémentaires ensemble ?', ['90°', '180°', '360°', '45°'], 0, 'Les supplémentaires valent 180°.'],
            ['Que valent deux angles supplémentaires ensemble ?', ['180°', '90°', '360°', '270°'], 0, 'Les complémentaires valent 90°.'],
            ['Que peut-on dire de deux angles opposés par le sommet ?', ['Ils sont égaux', 'Ils sont complémentaires', 'Leur somme vaut 180°', 'Ils sont perpendiculaires'], 0, 'C’est une propriété utile en démonstration.'],
            ['Où place-t-on le centre du rapporteur ?', ['Sur le sommet de l’angle', 'Sur l’extrémité d’un côté', 'Au milieu d’un côté', 'N’importe où sur un côté'], 0, 'Puis on aligne le zéro sur un côté.'],
            ['Un angle aigu mesure plus de 90°.', ['Vrai', 'Faux'], 1, 'Il mesure entre 0° et 90° : aigu veut dire pointu.'],
          ],
        },
        {
          titre: 'Construire des triangles et utiliser la somme des angles d’un triangle',
          axe: 'Espace et géométrie',
          lecon: {
            titre: '180°, toujours',
            cours: `## La propriété fondamentale
Dans **tout** triangle, la **somme des trois angles vaut 180°**. Sans exception, quelle que soit sa forme ou sa taille.

C’est l’outil le plus utile du chapitre : si l’on connaît deux angles, on trouve le troisième par soustraction.
Exemple : 65° et 40° → 180 − 65 − 40 = **75°**.

## Ce qu’elle permet de déduire
- Un triangle ne peut avoir **qu’un seul** angle droit — deux feraient déjà 180°, sans place pour le troisième.
- Il ne peut avoir **qu’un seul** angle obtus.
- Dans un triangle **rectangle**, les deux angles aigus sont **complémentaires** (leur somme vaut 90°).

## Construire un triangle
Trois données suffisent :
- **trois côtés** : on trace un côté, puis deux arcs de compas dont l’intersection donne le sommet ;
- **deux côtés et l’angle entre eux** : règle, rapporteur, règle ;
- **un côté et les deux angles adjacents** : règle, puis les deux demi-droites.

## L’inégalité triangulaire
Un triangle n’existe que si **le plus grand côté est inférieur à la somme des deux autres**.
Avec 3 cm, 4 cm et 9 cm : 9 > 3 + 4, donc **le triangle est impossible** — les deux petits côtés ne se rejoignent pas.

> Avant de construire, on vérifie : c’est plus rapide que de s’acharner sur un tracé impossible.

## Le programme de construction
Un énoncé de construction se lit comme une recette : chaque phrase est une étape, dans l’ordre. On termine par un **codage** de la figure (marques d’égalité, angle droit).`,
          },
          questions: [
            ['Combien vaut la somme des angles d’un triangle ?', ['180°', '360°', '90°', 'Cela dépend du triangle'], 0, 'C’est vrai pour tout triangle.'],
            ['Un triangle a des angles de 65° et 40°. Que vaut le troisième ?', ['75°', '85°', '105°', '75,5°'], 0, '180 − 65 − 40.'],
            ['Combien d’angles droits un triangle peut-il avoir au maximum ?', ['Un seul', 'Deux', 'Trois', 'Aucun'], 0, 'Deux angles droits feraient déjà 180°.'],
            ['Dans un triangle rectangle, que valent ensemble les deux angles aigus ?', ['90°', '180°', '45°', '120°'], 0, 'Ils sont complémentaires.'],
            ['Peut-on construire un triangle de côtés 3 cm, 4 cm et 9 cm ?', ['Non, car 9 > 3 + 4', 'Oui', 'Oui, mais il sera plat', 'On ne peut pas savoir'], 0, 'C’est l’inégalité triangulaire.'],
            ['Que dit l’inégalité triangulaire ?', ['Le plus grand côté est inférieur à la somme des deux autres', 'Les trois côtés sont égaux', 'La somme des côtés vaut 180', 'Le plus grand côté est le double du plus petit'], 0, 'On la vérifie avant de construire.'],
            ['Quels instruments servent à construire un triangle dont on connaît les trois côtés ?', ['La règle et le compas', 'La règle et le rapporteur', 'L’équerre seule', 'Le rapporteur seul'], 0, 'Deux arcs de compas donnent le sommet.'],
            ['Un triangle peut avoir deux angles obtus.', ['Vrai', 'Faux'], 1, 'Leur somme dépasserait déjà 180°.'],
          ],
        },
        {
          titre: 'Connaître les triangles isocèles, équilatéraux et rectangles',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Les triangles particuliers et leurs propriétés',
            cours: `## Le triangle isocèle
Il a **deux côtés de même longueur**. Le sommet où ils se rejoignent est le **sommet principal**, le troisième côté la **base**.
Propriétés :
- les **angles à la base** sont **égaux** ;
- il possède un **axe de symétrie** : la médiatrice de la base, qui passe par le sommet principal.
Si l’angle au sommet vaut 40°, les deux autres valent (180 − 40) ÷ 2 = **70°** chacun.

## Le triangle équilatéral
Il a **trois côtés égaux**. Ses trois angles valent donc **60°** chacun (180 ÷ 3). Il possède **trois axes de symétrie**.
Tout triangle équilatéral est **aussi isocèle** — mais l’inverse est faux.

## Le triangle rectangle
Il a un **angle droit**. Le côté opposé à l’angle droit est l’**hypoténuse**, et c’est **toujours le plus long**.
Ses deux angles aigus sont **complémentaires**.

## Le triangle isocèle rectangle
Il cumule les deux : un angle droit et deux côtés égaux. Ses angles valent **90°, 45° et 45°**.

> Ces triangles ne sont pas des curiosités : ce sont les figures dont on connaît les angles sans les mesurer, et c’est précisément ce qui sert dans les exercices.

## Le codage d’une figure
On marque les **égalités de longueur** par des traits identiques, les **angles droits** par un petit carré, les **angles égaux** par des arcs identiques. Un codage bien lu répond souvent à la question.

## Reconnaître sans mesurer
Face à une figure codée, on lit le codage — pas la règle. Le dessin peut être imprécis ; le codage, lui, est une donnée de l’énoncé.`,
          },
          questions: [
            ['Qu’est-ce qu’un triangle isocèle ?', ['Un triangle avec deux côtés de même longueur', 'Un triangle avec trois côtés égaux', 'Un triangle avec un angle droit', 'Un triangle sans axe de symétrie'], 0, 'Ses angles à la base sont égaux.'],
            ['Combien mesure chaque angle d’un triangle équilatéral ?', ['60°', '90°', '45°', '30°'], 0, '180 ÷ 3.'],
            ['Comment appelle-t-on le côté opposé à l’angle droit ?', ['L’hypoténuse', 'La base', 'La hauteur', 'La médiatrice'], 0, 'C’est toujours le plus long côté.'],
            ['Un triangle isocèle a un angle au sommet de 40°. Que valent les angles à la base ?', ['70° chacun', '40° chacun', '50° chacun', '140° chacun'], 0, '(180 − 40) ÷ 2.'],
            ['Combien d’axes de symétrie a un triangle équilatéral ?', ['Trois', 'Un', 'Deux', 'Aucun'], 0, 'Le triangle isocèle n’en a qu’un.'],
            ['Que valent les angles d’un triangle isocèle rectangle ?', ['90°, 45° et 45°', '90°, 60° et 30°', '60°, 60° et 60°', '90°, 50° et 40°'], 0, 'Il cumule l’angle droit et les deux côtés égaux.'],
            ['Comment code-t-on un angle droit sur une figure ?', ['Par un petit carré', 'Par un arc', 'Par un trait', 'Par une croix'], 0, 'Les égalités de longueur se codent par des traits identiques.'],
            ['Tout triangle isocèle est équilatéral.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : tout équilatéral est isocèle.'],
          ],
        },
        {
          titre: 'Connaître la symétrie axiale',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Le pliage et le miroir',
            cours: `## L’idée
Deux figures sont **symétriques par rapport à une droite** (l’**axe**) si elles se superposent **par pliage** le long de cet axe. C’est l’image dans un miroir.

## Construire le symétrique d’un point
Le symétrique A' de A par rapport à la droite (d) est tel que **(d) est la médiatrice du segment [AA']**. Concrètement :
1. tracer la **perpendiculaire** à (d) passant par A ;
2. **reporter** de l’autre côté la même distance.
Si A est **sur** l’axe, son symétrique est **lui-même**.

## Ce que la symétrie conserve
- les **longueurs** ;
- les **mesures d’angles** ;
- les **aires** ;
- l’**alignement**, le **parallélisme**, le **milieu**.
Une figure et son symétrique sont **superposables** : elles ont exactement la même forme et la même taille.

> La symétrie ne déforme rien. Elle change seulement la position et le sens.

## Ce qu’elle change
Le **sens** de lecture est inversé : un texte vu dans un miroir se lit à l’envers. C’est la seule chose que la symétrie modifie.

## Axe de symétrie d’une figure
Une figure a un axe de symétrie si elle est son propre symétrique par rapport à cet axe.
- **Carré** : 4 axes — **rectangle** : 2 — **losange** : 2
- **Triangle équilatéral** : 3 — **isocèle** : 1
- **Cercle** : une **infinité** (tous ses diamètres)
- **Parallélogramme quelconque** : **aucun** — c’est le piège classique.

## Où on la rencontre
Papillons, feuilles, façades, lettres de l’alphabet (A, H, M, T, O), frises et pavages : la symétrie axiale est partout, et sert autant à dessiner qu’à démontrer.`,
          },
          questions: [
            ['Quelle est la définition du symétrique A’ de A par rapport à une droite (d) ?', ['(d) est la médiatrice de [AA’]', '(d) passe par A', '(d) est parallèle à [AA’]', 'A’ est le milieu de (d)'], 0, 'C’est la définition à retenir.'],
            ['Quel est le symétrique d’un point situé sur l’axe ?', ['Lui-même', 'Un point de l’autre côté', 'Le milieu de l’axe', 'Il n’en a pas'], 0, 'Sa distance à l’axe est nulle.'],
            ['Que conserve la symétrie axiale ?', ['Les longueurs, les angles et les aires', 'Seulement les longueurs', 'Seulement les angles', 'Rien'], 0, 'Elle conserve aussi l’alignement et le parallélisme.'],
            ['Combien d’axes de symétrie a un carré ?', ['4', '2', '1', 'Une infinité'], 0, 'Le rectangle n’en a que 2.'],
            ['Combien d’axes de symétrie a un parallélogramme quelconque ?', ['Aucun', 'Un', 'Deux', 'Quatre'], 0, 'C’est le piège classique du chapitre.'],
            ['Combien d’axes de symétrie a un cercle ?', ['Une infinité', 'Un', 'Deux', 'Quatre'], 0, 'Tous ses diamètres sont des axes.'],
            ['Qu’est-ce que la symétrie axiale modifie ?', ['Le sens de lecture', 'Les longueurs', 'Les angles', 'Les aires'], 0, 'C’est la seule chose qu’elle change.'],
            ['Une figure et son symétrique sont superposables.', ['Vrai', 'Faux'], 0, 'Elles ont la même forme et la même taille.'],
          ],
        },
        {
          titre: 'Voir dans l’espace et calculer des volumes',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Des solides, des patrons et des litres',
            cours: `## Le vocabulaire des solides
Un **solide** a trois dimensions. On décrit ses **faces** (les surfaces), ses **arêtes** (les segments) et ses **sommets** (les points).
- **Cube** : 6 faces carrées, 12 arêtes, 8 sommets.
- **Pavé droit** (parallélépipède rectangle) : 6 faces rectangulaires, 12 arêtes, 8 sommets.
- **Cylindre** : deux disques et une surface courbe.
- **Pyramide**, **cône**, **boule** complètent la famille.

## Le patron
Un **patron** est le dessin à plat qui, une fois plié, redonne le solide. Le cube en a **onze** différents — de quoi vérifier qu’un patron proposé est bien valide : il faut 6 carrés, correctement disposés.

## Le volume
Le **volume** mesure la place occupée, en unités **cubes** : mm³, cm³, dm³, m³.
- **Cube** de côté c : V = **c × c × c**
- **Pavé droit** : V = **L × l × h**
- **Cylindre** de rayon r et hauteur h : V = **π × r × r × h**

## Les conversions, encore plus piégeuses
Pour les volumes, chaque rang vaut **1 000** fois le suivant :
1 m³ = **1 000 000** cm³ ; 1 dm³ = **1 000** cm³.

## Le lien avec les litres
C’est l’équivalence la plus utile du chapitre :
**1 L = 1 dm³** et **1 mL = 1 cm³**.
Un pack de 6 bouteilles d’un litre occupe donc 6 dm³.

> Volume et capacité mesurent la même chose : l’un en unités de géométrie, l’autre en unités de la vie courante.

## La perspective cavalière
On dessine les faces vues de face en **vraie grandeur**, et les arêtes fuyantes en **pointillés** quand elles sont cachées. Les fuyantes parallèles restent parallèles.`,
          },
          questions: [
            ['Combien d’arêtes a un cube ?', ['12', '6', '8', '4'], 0, 'Il a 6 faces et 8 sommets.'],
            ['Quelle est la formule du volume d’un pavé droit ?', ['L × l × h', 'L × l', '2 × (L + l + h)', 'L + l + h'], 0, 'Le résultat s’exprime en unités cubes.'],
            ['À quoi correspond 1 litre ?', ['1 dm³', '1 cm³', '1 m³', '1 mm³'], 0, 'Et 1 mL vaut 1 cm³.'],
            ['Combien de cm³ dans 1 dm³ ?', ['1 000 cm³', '100 cm³', '10 cm³', '1 000 000 cm³'], 0, 'Chaque rang vaut 1 000 fois le suivant.'],
            ['Qu’est-ce qu’un patron ?', ['Le dessin à plat qui, plié, redonne le solide', 'La vue de face du solide', 'Le volume du solide', 'Le contour d’une face'], 0, 'Le cube en a onze différents.'],
            ['Quelle est la formule du volume d’un cylindre ?', ['π × r × r × h', '2 × π × r × h', 'π × r × h', 'r × r × h'], 0, 'C’est l’aire du disque multipliée par la hauteur.'],
            ['Comment représente-t-on les arêtes cachées en perspective cavalière ?', ['En pointillés', 'En traits gras', 'En rouge', 'On ne les dessine pas'], 0, 'Les faces de face sont en vraie grandeur.'],
            ['Pour les volumes, chaque unité vaut 100 fois la suivante.', ['Vrai', 'Faux'], 1, 'Elle vaut 1 000 fois : on multiplie trois longueurs.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : La proportionnalité (1 fiche)
        // ===================================================================
        {
          titre: 'Proportionnalité',
          axe: 'La proportionnalité',
          lecon: {
            titre: 'Quand tout augmente dans le même rapport',
            cours: `## Reconnaître une situation proportionnelle
Deux grandeurs sont **proportionnelles** si l’on passe de l’une à l’autre en multipliant **toujours par le même nombre**, appelé **coefficient de proportionnalité**.
Le prix de pommes à 3 € le kilo : 2 kg → 6 €, 5 kg → 15 €. Le coefficient est **3**.

## Ce qui n’est PAS proportionnel
- L’**âge** et la **taille** d’une personne ;
- le **périmètre** et l’**aire** d’un carré ;
- un tarif avec un **abonnement** fixe plus un prix à l’unité.
Le test : **le double doit donner le double**, et 0 doit correspondre à 0.

## Les méthodes de calcul
1. **Le coefficient** : on le trouve en divisant une valeur de la seconde ligne par la valeur correspondante de la première, puis on l’applique.
2. **Le passage à l’unité** : on cherche la valeur pour 1, puis on multiplie.
3. **La quatrième proportionnelle** (produit en croix) : dans a/b = c/d, on a a × d = b × c.
4. **La linéarité** : si 2 kg coûtent 6 € et 3 kg 9 €, alors 5 kg coûtent 6 + 9 = **15 €**.

> Les quatre méthodes donnent le même résultat. La plus rapide dépend des nombres : on choisit celle qui évite les divisions compliquées.

## Le tableau de proportionnalité
On dispose les grandeurs sur deux lignes. Un tableau est de proportionnalité si **toutes** les colonnes donnent le même quotient.

## Les échelles
Une **échelle** est un rapport de proportionnalité entre le dessin et la réalité. Au 1/100, 1 cm sur le plan représente 100 cm, soit **1 m** en vrai.

## Pourcentages et vitesses
Ce sont des situations de proportionnalité : appliquer 20 %, c’est multiplier par 0,2 ; rouler à vitesse constante, c’est parcourir une distance proportionnelle à la durée.`,
          },
          questions: [
            ['Que signifie « deux grandeurs proportionnelles » ?', ['On passe de l’une à l’autre en multipliant toujours par le même nombre', 'Elles augmentent toutes les deux', 'Elles sont égales', 'Leur somme est constante'], 0, 'Ce nombre est le coefficient de proportionnalité.'],
            ['Des pommes coûtent 3 € le kilo. Combien coûtent 5 kg ?', ['15 €', '8 €', '12 €', '5 €'], 0, 'On multiplie par le coefficient 3.'],
            ['Laquelle de ces situations n’est PAS proportionnelle ?', ['L’âge et la taille d’une personne', 'Le prix et la quantité à prix unitaire fixe', 'La distance et la durée à vitesse constante', 'Le périmètre d’un carré et son côté'], 0, 'La taille n’augmente pas au même rythme que l’âge.'],
            ['Comment trouve-t-on le coefficient de proportionnalité ?', ['En divisant une valeur de la 2e ligne par celle de la 1re', 'En additionnant les deux lignes', 'En multipliant les deux lignes', 'En soustrayant'], 0, 'Il doit être le même pour toutes les colonnes.'],
            ['Que représente 1 cm sur un plan à l’échelle 1/100 ?', ['1 m en réalité', '100 m en réalité', '10 cm en réalité', '1 cm en réalité'], 0, '1 cm × 100 = 100 cm = 1 m.'],
            ['Qu’est-ce que la méthode du produit en croix ?', ['Dans a/b = c/d, on utilise a × d = b × c', 'On additionne les diagonales', 'On divise chaque terme par 2', 'On multiplie les lignes entre elles'], 0, 'Elle sert à trouver une quatrième proportionnelle.'],
            ['Comment reconnaît-on un tableau de proportionnalité ?', ['Toutes les colonnes donnent le même quotient', 'Les nombres augmentent', 'Il a deux lignes', 'La première ligne commence à 1'], 0, 'C’est le test décisif.'],
            ['Un tarif avec abonnement fixe plus un prix à l’unité est proportionnel.', ['Vrai', 'Faux'], 1, 'L’abonnement casse la proportionnalité : 0 unité ne coûte pas 0 €.'],
          ],
        },

        // ===================================================================
        // Chapitre 5 : Organisation et gestion des données et probabilités
        // ===================================================================
        {
          titre: 'Statistiques',
          axe: 'Organisation et gestion des données et probabilités',
          lecon: {
            titre: 'Recueillir, représenter, résumer',
            cours: `## Le vocabulaire
- La **population** : l’ensemble étudié (les élèves d’une classe).
- Le **caractère** : ce qu’on observe (la couleur des yeux, la taille).
- L’**effectif** : le nombre d’individus d’une catégorie.
- L’**effectif total** : la somme de tous les effectifs.
- La **fréquence** : effectif ÷ effectif total, souvent exprimée en **pourcentage**.

## Le tableau
On range les données dans un tableau à deux lignes : les catégories, puis leurs effectifs. On vérifie toujours que la somme des effectifs égale l’effectif total.

## Les représentations
- **Diagramme en barres** : des barres de même largeur, de hauteur proportionnelle à l’effectif. Idéal pour **comparer** des catégories.
- **Diagramme circulaire** : un disque de 360°, chaque part proportionnelle à l’effectif. Idéal pour montrer des **parts d’un tout**.
  Angle = **fréquence × 360°**. Une catégorie représentant 25 % occupe 90°.
- **Graphique cartésien** : pour suivre une **évolution** dans le temps.

## La moyenne
**Moyenne = somme des valeurs ÷ nombre de valeurs**.
Pour 12, 15, 9 et 16 : (12 + 15 + 9 + 16) ÷ 4 = 52 ÷ 4 = **13**.
La moyenne est un **résumé** : elle ne dit rien de la dispersion. Deux classes de même moyenne peuvent avoir des résultats très différents.

> Une moyenne de 13 peut venir de « tout le monde à 13 » comme de « moitié à 6, moitié à 20 ». C’est pourquoi on regarde aussi le détail.

## Lire un graphique
Toujours vérifier : le **titre**, ce que portent les **axes**, les **unités**, et l’origine de l’échelle. Un axe qui ne part pas de zéro exagère visuellement les écarts — c’est le procédé le plus courant des graphiques trompeurs.`,
          },
          questions: [
            ['Comment calcule-t-on une fréquence ?', ['Effectif ÷ effectif total', 'Effectif × effectif total', 'Effectif total ÷ effectif', 'Effectif + effectif total'], 0, 'Elle s’exprime souvent en pourcentage.'],
            ['Quelle est la moyenne de 12, 15, 9 et 16 ?', ['13', '12', '14', '52'], 0, '52 ÷ 4.'],
            ['Quel angle occupe une catégorie représentant 25 % dans un diagramme circulaire ?', ['90°', '25°', '180°', '45°'], 0, '0,25 × 360°.'],
            ['Quel diagramme convient le mieux pour montrer des parts d’un tout ?', ['Le diagramme circulaire', 'Le diagramme en barres', 'Le graphique cartésien', 'Le tableau'], 0, 'Les barres servent surtout à comparer.'],
            ['Comment appelle-t-on l’ensemble étudié en statistiques ?', ['La population', 'Le caractère', 'L’effectif', 'La fréquence'], 0, 'Le caractère est ce qu’on observe.'],
            ['Que faut-il vérifier en lisant un graphique ?', ['Le titre, les axes, les unités et l’origine de l’échelle', 'Seulement les couleurs', 'Seulement la hauteur des barres', 'Rien de particulier'], 0, 'Un axe qui ne part pas de zéro exagère les écarts.'],
            ['Que vaut la somme des angles d’un diagramme circulaire ?', ['360°', '180°', '100°', '90°'], 0, 'Le disque entier représente l’effectif total.'],
            ['Deux séries de même moyenne ont forcément des valeurs semblables.', ['Vrai', 'Faux'], 1, 'La moyenne ne dit rien de la dispersion.'],
          ],
        },
        {
          titre: 'Probabilités',
          axe: 'Organisation et gestion des données et probabilités',
          lecon: {
            titre: 'Mesurer la chance',
            cours: `## L’expérience aléatoire
Une expérience est **aléatoire** quand on ne peut pas prévoir son résultat : lancer un dé, tirer une carte, jouer à pile ou face. Chaque résultat possible est une **issue**.

## La probabilité
La **probabilité** d’un événement mesure sa chance de se produire. Elle est comprise **entre 0 et 1** :
- **0** : l’événement est **impossible** ;
- **1** : il est **certain** ;
- **0,5** : il a une chance sur deux.
Elle s’écrit en fraction, en décimal ou en pourcentage : 1/2 = 0,5 = 50 %.

## Le calcul dans le cas équiprobable
Quand toutes les issues ont la même chance, on applique :
**P = nombre de cas favorables ÷ nombre de cas possibles**

Avec un dé à 6 faces :
- obtenir 4 → **1/6**
- obtenir un nombre pair → 3/6 = **1/2**
- obtenir un nombre inférieur à 7 → 6/6 = **1** (certain)
- obtenir 7 → **0** (impossible)

## Le vocabulaire
- **Événement certain** : il se produit toujours.
- **Événement impossible** : il ne se produit jamais.
- **Événement contraire** : il se produit exactement quand l’autre ne se produit pas. Les deux probabilités ont pour somme **1**.

## Les pièges de l’intuition
Une pièce lancée cinq fois sur « pile » a toujours **exactement une chance sur deux** de donner pile au sixième lancer : la pièce n’a pas de mémoire. Croire le contraire est une erreur si répandue qu’elle porte un nom.

> Le hasard n’a pas de dette. Ce qui est arrivé avant ne change rien à ce qui vient.

## Fréquence et probabilité
Sur un petit nombre d’essais, la fréquence observée s’écarte souvent de la probabilité. Plus on répète l’expérience, plus elle s’en **rapproche**.`,
          },
          questions: [
            ['Entre quelles valeurs une probabilité est-elle comprise ?', ['Entre 0 et 1', 'Entre 0 et 100', 'Entre −1 et 1', 'Entre 1 et 10'], 0, '0 = impossible, 1 = certain.'],
            ['Quelle est la probabilité d’obtenir 4 avec un dé à 6 faces ?', ['1/6', '1/4', '4/6', '1/2'], 0, 'Un cas favorable sur six possibles.'],
            ['Quelle est la probabilité d’obtenir un nombre pair avec un dé à 6 faces ?', ['1/2', '1/3', '1/6', '2/3'], 0, '3 cas favorables sur 6.'],
            ['Que vaut la probabilité d’un événement impossible ?', ['0', '1', '0,5', '−1'], 0, 'Un événement certain vaut 1.'],
            ['Comment calcule-t-on une probabilité dans un cas équiprobable ?', ['Cas favorables ÷ cas possibles', 'Cas possibles ÷ cas favorables', 'Cas favorables × cas possibles', 'Cas favorables + cas possibles'], 0, 'Toutes les issues doivent avoir la même chance.'],
            ['Que vaut la somme des probabilités de deux événements contraires ?', ['1', '0', '0,5', '2'], 0, 'L’un se produit exactement quand l’autre ne se produit pas.'],
            ['Qu’est-ce qu’une expérience aléatoire ?', ['Une expérience dont on ne peut pas prévoir le résultat', 'Une expérience truquée', 'Une expérience répétée', 'Une expérience impossible'], 0, 'Lancer un dé en est une.'],
            ['Après cinq « pile » d’affilée, « face » devient plus probable.', ['Vrai', 'Faux'], 1, 'La pièce n’a pas de mémoire : la probabilité reste 1/2.'],
          ],
        },

        // ===================================================================
        // Chapitre 6 : Initiation à la pensée informatique (1 fiche)
        // ===================================================================
        {
          titre: 'Initiation à la pensée informatique',
          axe: 'Initiation à la pensée informatique',
          lecon: {
            titre: 'Donner des instructions à une machine',
            cours: `## L’algorithme
Un **algorithme** est une suite **finie** et **ordonnée** d’instructions permettant de résoudre un problème. Une recette de cuisine, un itinéraire, une notice de montage : ce sont des algorithmes.
Ce qui compte : chaque instruction doit être **précise** et **sans ambiguïté**. Une machine ne devine pas.

## Le programme
Un **programme** est un algorithme écrit dans un langage que la machine comprend. En 6e, on utilise **Scratch**, où les instructions sont des blocs qu’on assemble.

## Les instructions de déplacement
Sur un quadrillage ou avec un lutin : **avancer de n pas**, **tourner de 90° à droite**, **s’orienter vers**, **aller à (x ; y)**.
Le repérage se fait par des **coordonnées** : l’**abscisse** (horizontale) d’abord, l’**ordonnée** (verticale) ensuite. L’ordre ne s’invente pas.

## La boucle
Une **boucle** répète des instructions sans les réécrire.
Pour tracer un carré : **répéter 4 fois [avancer de 100 ; tourner de 90°]**.
Sans boucle, il faudrait écrire huit instructions ; avec, il en faut trois. Pour un polygone à n côtés, on tourne de **360 ÷ n** degrés à chaque étape.

> Une boucle n’est pas seulement plus courte : elle est plus facile à **corriger**, puisqu’il n’y a qu’un endroit à modifier.

## L’instruction conditionnelle
**Si … alors … sinon …** permet à un programme de choisir selon une condition : *si le lutin touche le bord, alors rebondir*.

## Les variables
Une **variable** est une case mémoire portant un nom, qui retient une valeur : un score, un compteur. On peut la lire et la modifier au fil du programme.

## Déboguer
Un **bug** est une erreur dans le programme. On le corrige en **testant pas à pas**, en isolant l’instruction fautive. Un programme se met au point ; il ne s’écrit presque jamais juste du premier coup.`,
          },
          questions: [
            ['Qu’est-ce qu’un algorithme ?', ['Une suite finie et ordonnée d’instructions pour résoudre un problème', 'Un langage de programmation', 'Un ordinateur', 'Une erreur de programme'], 0, 'Une recette de cuisine en est un.'],
            ['À quoi sert une boucle ?', ['À répéter des instructions sans les réécrire', 'À arrêter le programme', 'À poser une question', 'À stocker une valeur'], 0, 'Elle rend aussi le programme plus facile à corriger.'],
            ['Comment tracer un carré avec une boucle ?', ['Répéter 4 fois : avancer, tourner de 90°', 'Répéter 2 fois : avancer, tourner de 180°', 'Avancer 4 fois seulement', 'Répéter 4 fois : avancer de 90'], 0, 'Pour un polygone à n côtés, on tourne de 360 ÷ n.'],
            ['Qu’est-ce qu’une variable ?', ['Une case mémoire nommée qui retient une valeur', 'Une instruction de déplacement', 'Une boucle', 'Un bug'], 0, 'Un score ou un compteur en sont.'],
            ['Dans un repère, quelle coordonnée se lit en premier ?', ['L’abscisse, c’est-à-dire l’horizontale', 'L’ordonnée', 'La plus grande', 'Peu importe'], 0, 'L’ordre ne s’invente pas.'],
            ['À quoi sert l’instruction « si … alors … sinon … » ?', ['À faire choisir le programme selon une condition', 'À répéter des instructions', 'À arrêter le programme', 'À nommer une variable'], 0, '« Si le lutin touche le bord, alors rebondir ».'],
            ['Qu’est-ce que déboguer un programme ?', ['Chercher et corriger les erreurs en testant pas à pas', 'L’effacer', 'Le rendre plus long', 'Le traduire'], 0, 'Un programme se met au point.'],
            ['Une instruction d’algorithme peut rester un peu vague : la machine devinera.', ['Vrai', 'Faux'], 1, 'Une machine ne devine pas : chaque instruction doit être sans ambiguïté.'],
          ],
        },
      ],
    },
  ],
}
