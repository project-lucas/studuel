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
            cours: `Un nombre décimal, c’est un nombre à virgule : la partie entière à gauche, ce qui reste à droite.

## Entier ou décimal
| Le nombre | Comment il s’écrit | Exemples |
| **Entier** | Sans virgule | 0 · 7 · 254 |
| **Décimal** | Avec une partie décimale qui s’arrête | 3,5 · 0,08 · 12,750 |

> Tout entier est un décimal — 7 s’écrit 7,0. L’inverse est faux.

## Le tableau de numération
Chaque chiffre vaut selon **sa place**, pas selon lui-même.

| centaines | dizaines | unités | , | dixièmes | centièmes | millièmes |
| 2 | 4 | 6 | , | 3 | 0 | 5 |

Dans 246,305 : le **3** vaut 3 **dixièmes**, le **5** vaut 5 **millièmes**.

!> Le **chiffre** est un symbole (0 à 9), le **nombre** est une quantité. Dans 246, le *chiffre* des dizaines est **4**, mais le *nombre* de dizaines est **24**.

## Trois écritures d’un même nombre
| L’écriture | 3,25 s’écrit |
| **Décimale** | 3,25 |
| **Fractionnaire** | 325/100 |
| **Décomposée** | 3 + 2/10 + 5/100 |

= 3,25 = 3,250 = 3,2500

Les zéros ajoutés **à droite** de la partie décimale ne changent rien.

## Comparer deux décimaux
1. On compare les **parties entières** ;
2. si elles sont égales, on compare les **dixièmes** ;
3. puis les centièmes, puis les millièmes.

~ Parties entières → Dixièmes → Centièmes → Millièmes

!> **12,7 est plus grand que 12,25.** Le nombre le plus « long » n’est pas le plus grand : 7 dixièmes valent plus que 2 dixièmes. Pour s’en convaincre, on complète : 12,70 contre 12,25.

## Ranger, encadrer, arrondir
| Le mot | Ce qu’il demande | Exemple |
| **Croissant** | Du plus petit au plus grand | 1,2 · 1,5 · 2,4 |
| **Décroissant** | L’inverse | 2,4 · 1,5 · 1,2 |
| **Encadrer à l’unité** | Trouver les deux entiers voisins | 3 < **3,7** < 4 |
| **Arrondir au dixième** | Regarder le chiffre suivant | 3,4**7** → **3,5** |

On arrondit **au supérieur** si le chiffre suivant vaut 5 ou plus.

## La demi-droite graduée
Chaque nombre a **un seul** point, et ce point a un nom : son **abscisse**. Plus on va à droite, plus le nombre est grand.`,
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
            cours: `Poser un calcul, c’est bien. L’estimer d’abord, c’est ce qui permet de repérer une erreur.

## Addition et soustraction
On **aligne les virgules**, quitte à compléter par des zéros.

= 12,5 + 3,75 → 12,50 + 3,75 = 16,25

La virgule du résultat se place **sous** les autres.

## Multiplication
On multiplie **sans regarder les virgules**, puis on les compte.

~ Calculer 32 × 15 = 480 → Compter 1 + 1 = 2 décimales → Placer : 4,80

= 3,2 × 1,5 = 4,8

> Le produit a **autant de décimales que les deux facteurs réunis**.

## Multiplier et diviser par 10, 100, 1 000
| L’opération | La virgule se déplace | Exemple |
| **× 10, × 100, × 1 000** | Vers la **droite** | 4,7 × 100 = **470** |
| **÷ 10, ÷ 100, ÷ 1 000** | Vers la **gauche** | 4,7 ÷ 100 = **0,047** |

On complète par des zéros quand il en manque.

## Les priorités opératoires
1. Les **parenthèses**, de la plus intérieure à la plus extérieure ;
2. les **multiplications et divisions**, de gauche à droite ;
3. les **additions et soustractions**, de gauche à droite.

= 2 + 3 × 4 = 2 + 12 = 14

!> **2 + 3 × 4 ne fait pas 20.** On ne calcule pas dans l’ordre où c’est écrit : la multiplication passe avant.

## L’ordre de grandeur
Avant de calculer, on estime avec des nombres ronds.

= 19,8 × 4,9 ≈ 20 × 5 = 100

Si la machine affiche 9,7 ou 970, une virgule s’est déplacée.

> Un résultat qu’on n’a pas estimé d’abord est un résultat qu’on ne peut pas vérifier.

## Le vocabulaire
| L’opération | Son résultat | Ses nombres |
| Addition | La **somme** | Des **termes** |
| Soustraction | La **différence** | — |
| Multiplication | Le **produit** | Des **facteurs** |
| Division | Le **quotient** | — |`,
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
            cours: `Diviser 47 par 5, ce n’est pas toujours tomber juste : il reste souvent quelque chose.

## La division euclidienne
= 47 = 5 × 9 + 2

| Le nom | Sa place | Ici |
| **Dividende** | Ce qu’on partage | 47 |
| **Diviseur** | En combien de parts | 5 |
| **Quotient** | Le résultat entier | 9 |
| **Reste** | Ce qui ne se partage pas | 2 |

!> Le **reste est toujours plus petit que le diviseur** (ici 2 < 5). Un reste plus grand que le diviseur signale à coup sûr une erreur de calcul.

## Diviseur, multiple : trois phrases pour une
Quand le reste vaut **0**, la division est exacte. On dit alors :

~ 5 divise 30 → 5 est un diviseur de 30 → 30 est un multiple de 5

Ces trois phrases disent **exactement la même chose**.

## Les critères de divisibilité
| Divisible par | Si… | Exemple |
| **2** | Le chiffre des unités est 0, 2, 4, 6 ou 8 | 5 274 est **pair** |
| **3** | La **somme des chiffres** est divisible par 3 | 5+2+7+4 = 18 |
| **4** | Les **deux derniers chiffres** le sont | 5 2**74** → 74 non |
| **5** | Le chiffre des unités est 0 ou 5 | 145 |
| **9** | La somme des chiffres est divisible par 9 | 18 → oui |
| **10** | Le chiffre des unités est 0 | 250 |

> 5 274 : la somme de ses chiffres vaut 18, divisible par 3 **et** par 9. Le nombre l’est donc aussi.

## Les nombres premiers
Un nombre **premier** a exactement **deux** diviseurs : 1 et lui-même.

= 2 · 3 · 5 · 7 · 11 · 13 · 17 · 19 · 23…

!> **2 est le seul nombre premier pair**, et **1 n’est pas premier** : il n’a qu’un seul diviseur, lui-même.

## À quoi ça sert
Les critères permettent de **simplifier une fraction** sans calculatrice, et de vérifier un partage d’un coup d’œil : 143 bonbons pour 5 enfants ne tombent pas juste — 143 ne finit ni par 0 ni par 5.`,
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
            cours: `Quand le partage ne tombe pas juste, on ne s’arrête pas au reste : on continue après la virgule.

## Le principe
On abaisse des zéros et on poursuit la division.

~ 13 ÷ 4 : 3, reste 1 → abaisser un zéro : 10 ÷ 4 = 2, reste 2 → abaisser : 20 ÷ 4 = 5, reste 0

= 13 ÷ 4 = 3,25

## Diviser par un nombre à virgule
On ne divise **jamais** par un décimal. On multiplie **le dividende ET le diviseur** par 10, 100 ou 1 000 : le quotient ne change pas.

= 7,5 ÷ 0,25 → 750 ÷ 25 = 30

!> Multiplier **un seul** des deux nombres change le résultat. Les deux, toujours, et par le même nombre.

## Quand ça ne s’arrête jamais
Certaines divisions ne finissent pas : 1 ÷ 3 = 0,3333…

| La valeur approchée | Comment | 1 ÷ 3 donne |
| **Par défaut** | On tronque | 0,33 |
| **Par excès** | La valeur juste au-dessus | 0,34 |
| **Arrondie** | La plus proche | 0,33 |

## Le signe ≈
= 1 ÷ 3 ≈ 0,33

!> Écrire **1 ÷ 3 = 0,33 est faux**. Le signe **=** annonce une égalité exacte ; quand la valeur est approchée, le signe **≈** doit le dire.

## Vérifier une division
On multiplie le quotient par le diviseur : on doit retrouver le dividende.

= 3,25 × 4 = 13

> C’est la vérification à faire systématiquement — elle prend cinq secondes et rattrape la moitié des erreurs.

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
            cours: `Une fraction n’est pas un objet bizarre à deux étages : c’est un partage, et c’est aussi une division.

## Deux façons de lire a/b
| La lecture | Ce qu’elle dit | 3/4, c’est… |
| **Un partage** | On coupe, on prend | La tarte en **4** parts, on en prend **3** |
| **Une division** | Le quotient de a par b | 3 ÷ 4 = **0,75** |

> Ces deux lectures sont la même chose. Savoir passer de l’une à l’autre, c’est tout le chapitre.

## Le vocabulaire
| Le terme | Sa place | Ce qu’il dit |
| **Numérateur** | En haut | Combien de parts on prend |
| **Dénominateur** | En bas | En combien de parts on coupe |

!> Le dénominateur n’est **jamais** égal à 0 : on ne coupe pas une tarte en zéro parts.

## Plus petit, égal, plus grand que 1
| Si… | Alors la fraction est… | Exemple |
| Numérateur **<** dénominateur | Plus petite que 1 | 3/4 |
| Numérateur **=** dénominateur | Égale à **1** | 4/4 |
| Numérateur **>** dénominateur | Plus grande que 1 | 7/4 |

Une **fraction décimale** a pour dénominateur 10, 100 ou 1 000.

## Fractions égales, et simplification
Multiplier ou diviser **les deux** nombres par un même nombre ne change pas la valeur.

= 1/2 = 2/4 = 3/6 = 50/100

~ 12/18 → 6/9 → 2/3 (irréductible)

**Simplifier**, c’est diviser en haut et en bas jusqu’à ne plus pouvoir. La fraction est alors **irréductible**.

## Prendre une fraction d’une quantité
« Les 3/4 **de** 20 » : on divise par 4, on multiplie par 3.

= 20 ÷ 4 × 3 = 15

> Le mot « de » se traduit par une **multiplication** : les 3/4 de 20, c’est 3/4 × 20.

## À connaître par cœur
| La fraction | Sa valeur décimale |
| 1/2 | 0,5 |
| 1/4 | 0,25 |
| 3/4 | 0,75 |
| 1/5 | 0,2 |
| 1/10 | 0,1 |`,
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
            cours: `Pour comparer deux fractions, le bon réflexe n’est presque jamais le calcul : c’est le coup d’œil.

## D’abord : comparer à 1
| Si… | La fraction est… |
| Numérateur **<** dénominateur | **< 1** |
| Numérateur **=** dénominateur | **= 1** |
| Numérateur **>** dénominateur | **> 1** |

Ainsi 5/8 < 1 < 9/7, **sans aucun calcul**.

## Même dénominateur
On compare les **numérateurs**.

= 3/7 < 5/7

Plus on prend de parts de la même taille, plus on en a.

## Même numérateur
On compare les dénominateurs **à l’envers**.

= 3/5 > 3/8

!> **C’est le piège le plus fréquent du chapitre.** Avec le même numérateur, le **plus grand dénominateur** donne la **plus petite** fraction : plus on coupe en parts nombreuses, plus chaque part est petite.

## Dénominateurs différents
| La méthode | Comment | Sur 2/3 et 3/4 |
| **Même dénominateur** | On choisit 12 | 8/12 < 9/12 |
| **Passer en décimal** | On divise | 0,67 < 0,75 |

Dans les deux cas : **2/3 < 3/4**.

## Encadrer entre deux entiers
On effectue la division.

= 17/5 = 3,4 → 3 < 17/5 < 4

## Placer sur une demi-droite graduée
1. On partage chaque unité en autant de parts que l’indique le **dénominateur** ;
2. on compte autant de parts que l’indique le **numérateur**.

> C’est le meilleur moyen de voir qu’une fraction est un nombre comme un autre, avec sa place sur la droite.

## Fraction et pourcentage
| La fraction | Le pourcentage |
| 1/2 | 50 % |
| 1/4 | 25 % |
| 3/4 | 75 % |
| 1/10 | 10 % |`,
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
            cours: `On additionne des parts **de même taille**. Tout le chapitre tient dans cette phrase.

## Additionner au même dénominateur
On ajoute les numérateurs, on **garde** le dénominateur.

= 2/7 + 3/7 = 5/7

!> **2/7 + 3/7 ne fait pas 5/14.** On n’additionne jamais les dénominateurs : leur nombre change, pas leur taille.

## Dénominateurs différents
Il faut d’abord les rendre égaux.

~ 1/2 + 1/3 → 3/6 + 2/6 → 5/6

Le plus simple est souvent de multiplier les deux dénominateurs entre eux (ici 2 × 3 = 6).

## Soustraire
Même méthode, même règle.

= 5/8 − 2/8 = 3/8

## Multiplier
| Le cas | La règle | Exemple |
| Par un **entier** | On multiplie **le numérateur seul** | 3 × 2/5 = **6/5** |
| Par une **fraction** | Numérateurs entre eux, dénominateurs entre eux | 2/3 × 3/4 = 6/12 = **1/2** |

> Quand c’est possible, on simplifie **avant** de multiplier : les nombres restent petits et le calcul va plus vite.

## Fraction d’une quantité
« Les 2/5 de 30 » :

= 30 ÷ 5 × 2 = 12

Le mot « de » se traduit par une multiplication.

## Toujours simplifier le résultat
Un résultat s’écrit sous sa forme **irréductible** : 6/12 s’écrit **1/2**. C’est une exigence de présentation autant que de calcul.`,
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
            cours: `Un pourcentage n’est rien d’autre qu’une fraction dont le dénominateur vaut 100.

## Ce qu’est un pourcentage
= 25 % = 25/100 = 1/4 = 0,25

**t %** signifie **t pour 100**.

## Appliquer un pourcentage
Prendre t % d’une quantité, c’est **multiplier par t/100**.

= 30 % de 80 = 80 × 30 ÷ 100 = 24

## Les repères de calcul mental
| Le pourcentage | Le geste |
| **50 %** | On divise par **2** |
| **25 %** | On divise par **4** |
| **10 %** | On divise par **10** |
| **1 %** | On divise par **100** |
| **75 %** | 50 % + 25 % |

Avec ces repères, 35 % se calcule comme 25 % + 10 %.

## Réductions et augmentations
| La situation | Le raccourci | Sur 50 € |
| Réduction de **20 %** | On garde **80 %** : × 0,8 | **40 €** |
| Augmentation de **20 %** | On garde **120 %** : × 1,2 | 60 € |

> Multiplier par 0,8 au lieu de calculer puis soustraire, c’est une étape de moins — donc une erreur de moins.

## Calculer un pourcentage
Quelle proportion 12 représente-t-il sur 40 ?

= 12 ÷ 40 = 0,3 = 30 %

## Ce qui trompe
~ 100 € → −20 % → 80 € → +20 % → 96 €

!> Une baisse de 20 % suivie d’une hausse de 20 % **ne ramène pas** au prix de départ. Les pourcentages ne s’additionnent pas comme des nombres : ils ne portent pas sur la même quantité.`,
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
            cours: `Un problème, ce n’est pas un calcul déguisé : c’est une question à laquelle on doit répondre par une phrase.

## Le nombre inconnu
Dans « J’ajoute 7 à un nombre et j’obtiens 23 », le nombre cherché est l’**inconnu**. On le note par une case vide, un point d’interrogation ou une **lettre**.

= x + 7 = 23

## L’opération inverse
| L’opération | Son inverse | On résout… | Par… |
| Addition | **Soustraction** | x + 7 = 23 | 23 − 7 = **16** |
| Multiplication | **Division** | 4 × x = 52 | 52 ÷ 4 = **13** |

## La méthode en quatre temps
1. **Lire** l’énoncé en entier, sans calculer ;
2. **repérer** ce qu’on cherche et ce qu’on connaît ;
3. **choisir** l’opération, puis calculer ;
4. **vérifier**, et **répondre par une phrase**.

> Une réponse sans phrase n’est pas une réponse : « 16 » ne dit pas ce que 16 désigne.

## Les problèmes à plusieurs étapes
Beaucoup d’énoncés demandent **deux** calculs. Trois aides :

| L’outil | Ce qu’il fait |
| Le **schéma en barres** | Il montre les quantités les unes par rapport aux autres |
| Le **tableau** | Il range les données |
| La **question intermédiaire** | « Pour trouver ceci, que me faut-il d’abord ? » |

## Le sens des mots
| L’expression | L’opération |
| « de plus que » | Addition |
| « de moins que » | Soustraction |
| « fois plus » | Multiplication |
| « partagé également » | Division |

!> Ces mots **aident**, ils ne décident pas. C’est la **situation** qui décide : « 3 fois moins » est une division, malgré le mot « fois ».

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
            cours: `Le périmètre, c’est la longueur du tour. On le mesure comme une ficelle qu’on déroulerait autour de la figure.

## Les formules
| La figure | Son périmètre |
| **Carré** de côté c | P = **4 × c** |
| **Rectangle** L et l | P = **2 × (L + l)** |
| **Triangle** | La somme des trois côtés |
| **Cercle** de rayon r | P = **2 × π × r** |

= π ≈ 3,14

## Le vocabulaire du cercle
| Le mot | Ce qu’il désigne |
| Le **rayon** | Du centre à un point du cercle |
| Le **diamètre** | Il traverse en passant par le centre : **d = 2 × r** |
| La **circonférence** | Un autre nom du périmètre du cercle |

## Les conversions de longueur
~ km → hm → dam → m → dm → cm → mm

Chaque rang vaut **10 fois** le suivant.

= 1 m = 100 cm · 1 km = 1 000 m · 1 cm = 10 mm

!> On convertit **avant** de calculer, et dans l’unité demandée. Une seule erreur de conversion suffit à fausser tout un exercice.

## Périmètre et aire ne mesurent pas la même chose
| La figure | Son périmètre | Son aire |
| Rectangle 1 × 5 | 12 | **5** |
| Carré de côté 3 | 12 | **9** |

> Même périmètre, aires différentes. Le tour d’une figure ne dit rien de la place qu’elle occupe.

## Une figure composée
On additionne les longueurs de tous les segments du **contour** — et seulement ceux-là. Les traits intérieurs ne comptent pas.`,
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
            cours: `L’aire mesure la place occupée. Elle se compte en carrés — et c’est de là que viennent tous les pièges d’unités.

## Les formules
| La figure | Son aire |
| **Carré** de côté c | A = **c × c** |
| **Rectangle** | A = **L × l** |
| **Triangle** | A = **(base × hauteur) ÷ 2** |
| **Disque** de rayon r | A = **π × r × r** |
| **Parallélogramme** | A = base × hauteur |

## La hauteur d’un triangle
C’est le segment **perpendiculaire** à la base, mené du sommet opposé.

!> La hauteur n’est **pas** forcément un côté du triangle. C’est l’erreur la plus fréquente : on prend un côté au hasard et on divise par deux.

## Les conversions, et pourquoi elles piègent
Pour les aires, chaque rang vaut **100 fois** le suivant, et non 10.

= 1 m² = 10 000 cm² · 1 cm² = 100 mm² · 1 km² = 1 000 000 m²

> Un carré de 1 m de côté mesure 100 cm × 100 cm = 10 000 cm². On multiplie **deux** longueurs, donc on multiplie **deux fois** par 10 : d’où le facteur 100.

## Les unités agraires
| L’unité | Sa valeur |
| 1 **are** (a) | 100 m² |
| 1 **hectare** (ha) | 10 000 m² = 100 ares |

Un terrain de football fait environ **0,7 ha**.

## Une figure composée
~ Découper en formes connues → Calculer chaque aire → Additionner (ou soustraire un trou)`,
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
            cours: `Le temps ne se compte pas en base 10, mais en base 60. Presque toutes les erreurs du chapitre viennent de là.

## Les unités de durée
= 1 jour = 24 h · 1 h = 60 min · 1 min = 60 s

## Convertir
| Le passage | L’opération | Exemple |
| h → min | **× 60** | 2 h 30 = **150 min** |
| min → s | × 60 | 3 min = 180 s |
| min → h | ÷ 60 | 90 min = 1,5 h |

!> **2,5 h vaut 2 h 30, pas 2 h 5.** La partie décimale se convertit : 0,5 × 60 = 30 min. De même **1,25 h = 1 h 15**. Chaque fois qu’une durée s’écrit avec une virgule, il faut convertir ce qui suit la virgule.

## Calculer une durée entre deux horaires
De 8 h 45 à 11 h 20, on avance par étapes rondes :

~ 8 h 45 → 9 h : 15 min → 11 h : 2 h → 11 h 20 : 20 min

= Total : 2 h 35

On peut aussi poser la soustraction, en pensant à emprunter **60** et non 10.

## Ajouter une durée à un horaire
= 14 h 50 + 35 min = 14 h 85 → 15 h 25

Dès que les minutes dépassent 60, on en retire 60 et on ajoute 1 h.

## Lire les horaires
On lit l’heure en format 24 h : **14 h**, c’est 2 h de l’après-midi. Dans un tableau de train ou de bus, **chaque colonne est un trajet**.

## Vitesse, distance et durée
| On cherche | La formule |
| La **vitesse** | v = d ÷ t |
| La **distance** | d = v × t |
| La **durée** | t = d ÷ v |

> Les unités doivent concorder : des km/h avec des heures, des m/s avec des secondes.`,
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
            cours: `En géométrie, les notations ne sont pas de la décoration : elles disent de quel objet on parle.

## Les objets de base
| L’objet | Sa notation | Ce qu’il est |
| **Point** | A | Une lettre **majuscule** |
| **Droite** | (AB) | Illimitée des **deux** côtés |
| **Segment** | [AB] | Limité par ses deux extrémités ; sa longueur se note AB |
| **Demi-droite** | [AB) | Une origine, illimitée de l’autre côté |

!> Crochets pour un segment, parenthèses pour une droite. Écrire (AB) pour une longueur est une faute, pas une approximation.

## Perpendiculaires et parallèles
| Les droites sont… | Quand… | On note |
| **Perpendiculaires** | Elles se coupent à **90°** | ⊥ et le petit carré |
| **Parallèles** | Elles ne se coupent **jamais** | // |

## Les trois propriétés à connaître
1. Deux droites **perpendiculaires à une même droite** sont **parallèles** entre elles ;
2. si deux droites sont **parallèles** et qu’une troisième est perpendiculaire à l’une, elle est **perpendiculaire à l’autre** ;
3. par un point donné passe **une seule** parallèle à une droite donnée, et **une seule** perpendiculaire.

> Ces propriétés servent à **démontrer**, pas à constater. Un dessin peut tromper ; une propriété, non.

## La médiatrice
La **médiatrice** d’un segment est la droite **perpendiculaire** à ce segment passant par son **milieu**.

= Ses points sont à égale distance des deux extrémités

On la trace au compas, par deux arcs de même rayon de part et d’autre.

## La bissectrice
La **bissectrice** d’un angle est la demi-droite qui le **partage en deux angles égaux**. Elle se trace aussi au compas.

## Les instruments
| L’instrument | Ce qu’il fait |
| La **règle graduée** | Mesurer, tracer |
| L’**équerre** | L’angle droit |
| Le **compas** | Reporter une longueur, tracer un cercle |
| Le **rapporteur** | Mesurer un angle |`,
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
            cours: `Un angle, c’est une ouverture. On la mesure en degrés, avec un rapporteur — et on la nomme avec trois lettres.

## Ce qu’est un angle
Deux demi-droites de **même origine** : cette origine est le **sommet**. L’ouverture se mesure en **degrés (°)**.

## Les noms des angles
| L’angle | Sa mesure |
| **Nul** | 0° |
| **Aigu** | Entre 0° et 90° |
| **Droit** | Exactement **90°** |
| **Obtus** | Entre 90° et 180° |
| **Plat** | Exactement **180°** |

> Le moyen de ne plus confondre : **aigu** comme une pointe, **obtus** comme une ouverture large.

## Noter un angle
On l’écrit avec **trois lettres, le sommet au milieu** : l’angle ABC a pour sommet **B**.

!> Changer l’ordre des lettres change l’angle désigné. La lettre du milieu n’est pas décorative : c’est elle qui dit où est le sommet.

## Utiliser le rapporteur
1. Placer le **centre** du rapporteur sur le **sommet** ;
2. aligner le **zéro** sur l’un des côtés ;
3. lire la graduation sur l’autre côté, sur **la bonne échelle**.

!> Un rapporteur a **deux** graduations, complémentaires à 180°. Mal lu, il donne 130° au lieu de 50°. Le contrôle de bon sens : un angle visiblement aigu doit mesurer **moins de 90°**.

## Angles particuliers
| Les angles sont… | Quand… |
| **Adjacents** | Même sommet, un côté commun, de part et d’autre de ce côté |
| **Complémentaires** | Leur somme vaut **90°** |
| **Supplémentaires** | Leur somme vaut **180°** |
| **Opposés par le sommet** | Ils sont **égaux** |

## Construire un angle
~ Tracer un côté → Poser le rapporteur → Marquer la mesure → Tracer la demi-droite`,
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
            cours: `Dans tout triangle, les trois angles font 180°. Aucune exception, quelle que soit sa forme ou sa taille.

## La propriété fondamentale
= Angle 1 + Angle 2 + Angle 3 = 180°

Si l’on connaît deux angles, le troisième s’obtient par soustraction.

= 180 − 65 − 40 = 75°

## Ce qu’elle permet de déduire
| La déduction | Pourquoi |
| Un seul angle **droit** au maximum | Deux angles droits font déjà 180° |
| Un seul angle **obtus** au maximum | Deux obtus dépasseraient 180° |
| Dans un triangle **rectangle**, les deux angles aigus sont **complémentaires** | Il reste 90° à se partager |

## Construire un triangle
| Ce qu’on connaît | Les instruments |
| Les **trois côtés** | Règle et compas : deux arcs se croisent au sommet |
| **Deux côtés et l’angle entre eux** | Règle, rapporteur, règle |
| **Un côté et les deux angles adjacents** | Règle, puis les deux demi-droites |

## L’inégalité triangulaire
Un triangle n’existe que si le **plus grand côté est plus petit que la somme des deux autres**.

!> Avec 3 cm, 4 cm et 9 cm, **le triangle est impossible** : 9 > 3 + 4, les deux petits côtés ne se rejoignent jamais. On vérifie **avant** de construire, plutôt que de s’acharner sur un tracé impossible.

## Le programme de construction
Un énoncé de construction se lit comme une recette : chaque phrase est une **étape**, dans l’ordre.

~ Lire tout le programme → Tracer étape par étape → Coder la figure

Le **codage** (marques d’égalité, petit carré de l’angle droit) fait partie du travail.`,
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
            cours: `Certains triangles ont des angles qu’on connaît sans les mesurer. C’est exactement ce qui sert dans les exercices.

## Le triangle isocèle
Deux côtés de même longueur. Le sommet où ils se rejoignent est le **sommet principal**, le troisième côté la **base**.

| Sa propriété | Ce qu’elle donne |
| Les **angles à la base** sont **égaux** | Un angle connu en donne deux |
| Il a **un axe de symétrie** | La médiatrice de la base |

= Angle au sommet 40° → (180 − 40) ÷ 2 = 70° à la base

## Le triangle équilatéral
Trois côtés égaux, donc trois angles égaux.

= 180 ÷ 3 = 60°

Il possède **trois** axes de symétrie.

!> Tout triangle équilatéral est **aussi** isocèle. L’inverse est faux : un isocèle n’a que deux côtés égaux.

## Le triangle rectangle
Un angle droit. Le côté opposé à l’angle droit s’appelle l’**hypoténuse**, et c’est **toujours le plus long**. Ses deux angles aigus sont **complémentaires**.

## Le triangle isocèle rectangle
Il cumule les deux.

= 90° · 45° · 45°

## Le codage d’une figure
| La marque | Ce qu’elle dit |
| Traits identiques sur deux côtés | Ces **longueurs sont égales** |
| Petit carré | **Angle droit** |
| Arcs identiques | **Angles égaux** |

> Face à une figure codée, on lit le **codage**, pas la règle graduée. Le dessin peut être imprécis ; le codage est une donnée de l’énoncé.`,
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
            cours: `La symétrie axiale, c’est le pliage : deux figures qui se superposent quand on plie la feuille le long d’un axe.

## L’idée
Deux figures sont **symétriques par rapport à une droite** — l’**axe** — si elles se superposent par pliage le long de cette droite. C’est l’image dans un miroir.

## Construire le symétrique d’un point
1. Tracer la **perpendiculaire** à l’axe passant par A ;
2. **reporter** de l’autre côté la **même distance**.

= L’axe (d) est la médiatrice de [AA’]

!> Si le point est **sur** l’axe, son symétrique est **lui-même**. Il ne bouge pas.

## Ce que la symétrie conserve
| Elle conserve | Elle ne conserve pas |
| Les **longueurs** | Le **sens** de lecture |
| Les **mesures d’angles** | |
| Les **aires** | |
| L’**alignement**, le **parallélisme**, le **milieu** | |

> Une figure et son symétrique sont **superposables** : même forme, même taille. La symétrie ne déforme rien, elle change seulement la position et le sens.

## Ce qu’elle change
Un texte vu dans un miroir se lit à l’envers : le **sens** est inversé. C’est la seule chose que la symétrie modifie.

## Combien d’axes ?
| La figure | Ses axes de symétrie |
| **Carré** | 4 |
| **Rectangle** | 2 |
| **Losange** | 2 |
| **Triangle équilatéral** | 3 |
| **Triangle isocèle** | 1 |
| **Cercle** | Une **infinité** (tous ses diamètres) |
| **Parallélogramme quelconque** | **Aucun** |

!> Le parallélogramme quelconque n’a **aucun** axe de symétrie. C’est le piège classique : il a un centre de symétrie, ce qui n’est pas la même chose.

## Où on la rencontre
Papillons, feuilles, façades, lettres A, H, M, T, O, frises et pavages : la symétrie axiale sert autant à dessiner qu’à démontrer.`,
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
            cours: `Un solide occupe de la place dans l’espace. Cette place se mesure en cubes — et se boit en litres.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| **Face** | Une surface du solide |
| **Arête** | Un segment, là où deux faces se rencontrent |
| **Sommet** | Un point |

| Le solide | Faces | Arêtes | Sommets |
| **Cube** | 6 carrés | 12 | 8 |
| **Pavé droit** | 6 rectangles | 12 | 8 |
| **Cylindre** | 2 disques et une surface courbe | — | — |

La **pyramide**, le **cône** et la **boule** complètent la famille.

## Le patron
Un **patron** est le dessin à plat qui, plié, redonne le solide.

!> Le cube a **onze** patrons différents. Six carrés ne suffisent pas : encore faut-il qu’ils soient bien disposés. On vérifie un patron proposé en le pliant mentalement.

## Le volume
| Le solide | Son volume |
| **Cube** de côté c | V = **c × c × c** |
| **Pavé droit** | V = **L × l × h** |
| **Cylindre** | V = **π × r × r × h** |

## Les conversions, encore plus piégeuses
Pour les volumes, chaque rang vaut **1 000** fois le suivant.

= 1 m³ = 1 000 000 cm³ · 1 dm³ = 1 000 cm³

## Le lien avec les litres
= 1 L = 1 dm³ · 1 mL = 1 cm³

> C’est l’équivalence la plus utile du chapitre. Un pack de six bouteilles d’un litre occupe **6 dm³**.

## La perspective cavalière
Les faces vues de face se dessinent en **vraie grandeur** ; les arêtes cachées se tracent en **pointillés**. Les fuyantes parallèles restent parallèles.`,
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
            cours: `Deux grandeurs sont proportionnelles quand on passe de l’une à l’autre en multipliant toujours par le même nombre.

## Reconnaître une situation proportionnelle
Des pommes à 3 € le kilo :

| La masse | Le prix |
| 2 kg | 6 € |
| 5 kg | 15 € |

= Coefficient de proportionnalité : 3

## Le test
~ Le double doit donner le double → et 0 doit donner 0

## Ce qui n’est PAS proportionnel
| La situation | Pourquoi |
| L’**âge** et la **taille** | On ne double pas de taille en doublant d’âge |
| Le **périmètre** et l’**aire** d’un carré | L’aire est multipliée par 4 quand le côté double |
| Un tarif avec **abonnement** | Le prix ne part pas de 0 |

## Les quatre méthodes de calcul
1. **Le coefficient** : on divise une valeur par celle qui lui correspond, puis on l’applique ;
2. **le passage à l’unité** : on cherche la valeur pour 1, puis on multiplie ;
3. **la quatrième proportionnelle** (produit en croix) : dans a/b = c/d, on a a × d = b × c ;
4. **la linéarité** : si 2 kg coûtent 6 € et 3 kg 9 €, alors 5 kg coûtent 6 + 9 = **15 €**.

> Les quatre donnent le **même** résultat. On choisit celle qui évite les divisions compliquées.

## Le tableau de proportionnalité
On dispose les grandeurs sur deux lignes. Le tableau est de proportionnalité si **toutes** les colonnes donnent le même quotient.

## Les échelles
Une **échelle** est un rapport de proportionnalité entre le dessin et la réalité.

= Au 1/100 : 1 cm sur le plan = 100 cm = 1 m en vrai

## Où on la retrouve
Appliquer 20 %, c’est multiplier par 0,2 ; rouler à vitesse constante, c’est parcourir une distance proportionnelle à la durée. Pourcentages et vitesses sont des situations de proportionnalité.`,
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
            cours: `Recueillir des données, c’est facile. Les représenter sans mentir, c’est le vrai travail.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| La **population** | L’ensemble étudié (les élèves de la classe) |
| Le **caractère** | Ce qu’on observe (la couleur des yeux) |
| L’**effectif** | Le nombre d’individus d’une catégorie |
| L’**effectif total** | La somme de tous les effectifs |
| La **fréquence** | Effectif ÷ effectif total, souvent en % |

> On vérifie toujours que la somme des effectifs égale l’effectif total. Sinon, une donnée a été perdue.

## Choisir sa représentation
| Le graphique | Ce qu’il montre le mieux |
| **Diagramme en barres** | **Comparer** des catégories |
| **Diagramme circulaire** | Des **parts d’un tout** |
| **Graphique cartésien** | Une **évolution** dans le temps |

Dans un diagramme circulaire, le disque entier vaut 360°.

= Angle = fréquence × 360°

Une catégorie qui représente 25 % occupe donc **90°**.

## La moyenne
= Moyenne = somme des valeurs ÷ nombre de valeurs

= (12 + 15 + 9 + 16) ÷ 4 = 52 ÷ 4 = 13

!> La moyenne ne dit **rien** de la dispersion. Une moyenne de 13 peut venir de « tout le monde à 13 » comme de « la moitié à 6, la moitié à 20 ». C’est pourquoi on regarde aussi le détail.

## Lire un graphique sans se faire avoir
1. Lire le **titre** ;
2. regarder ce que portent les **axes** ;
3. vérifier les **unités** ;
4. vérifier **où commence l’échelle**.

!> Un axe qui ne part pas de zéro **exagère visuellement** les écarts. C’est le procédé le plus courant des graphiques trompeurs.`,
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
            cours: `Une probabilité mesure la chance qu’un événement se produise. Elle se range toujours entre 0 et 1.

## L’expérience aléatoire
Une expérience est **aléatoire** quand on ne peut pas prévoir son résultat : lancer un dé, tirer une carte, jouer à pile ou face. Chaque résultat possible est une **issue**.

## L’échelle des probabilités
| La probabilité | Ce qu’elle dit |
| **0** | L’événement est **impossible** |
| **0,5** | Une chance sur deux |
| **1** | L’événement est **certain** |

Elle s’écrit en fraction, en décimal ou en pourcentage : 1/2 = 0,5 = 50 %.

## Le calcul quand toutes les issues se valent
= P = nombre de cas favorables ÷ nombre de cas possibles

Avec un dé à six faces :

| L’événement | Sa probabilité |
| Obtenir **4** | 1/6 |
| Obtenir un nombre **pair** | 3/6 = **1/2** |
| Obtenir un nombre **inférieur à 7** | 6/6 = **1** (certain) |
| Obtenir **7** | **0** (impossible) |

## Le vocabulaire
| L’événement | Ce qu’il est |
| **Certain** | Il se produit toujours |
| **Impossible** | Il ne se produit jamais |
| **Contraire** | Il se produit exactement quand l’autre ne se produit pas |

= P(événement) + P(son contraire) = 1

## Le piège de l’intuition
!> Une pièce tombée cinq fois sur pile a **exactement une chance sur deux** de donner pile au sixième lancer. La pièce n’a pas de mémoire.

> Le hasard n’a pas de dette : ce qui est arrivé avant ne change rien à ce qui vient.

## Fréquence et probabilité
Sur peu d’essais, la fréquence observée s’écarte souvent de la probabilité. Plus on répète l’expérience, plus elle s’en **rapproche**.`,
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
            cours: `Une machine ne devine pas. Elle exécute, dans l’ordre, exactement ce qu’on lui dit.

## L’algorithme
Un **algorithme** est une suite **finie** et **ordonnée** d’instructions qui résout un problème. Une recette, un itinéraire, une notice de montage en sont.

!> Chaque instruction doit être **précise et sans ambiguïté**. « Avance un peu » n’est pas une instruction ; « avance de 100 pas » en est une.

## Le programme
Un **programme** est un algorithme écrit dans un langage que la machine comprend. En 6e, c’est **Scratch** : les instructions sont des blocs qu’on assemble.

## Se déplacer et se repérer
| L’instruction | Ce qu’elle fait |
| **Avancer de n pas** | Déplacement en ligne droite |
| **Tourner de 90° à droite** | Rotation |
| **Aller à (x ; y)** | Déplacement vers un point |

!> Dans un couple de coordonnées, l’**abscisse** (horizontale) vient **toujours** en premier, l’**ordonnée** (verticale) ensuite. L’ordre ne s’invente pas.

## La boucle
Une **boucle** répète des instructions sans les réécrire.

= répéter 4 fois [avancer de 100 ; tourner de 90°]

Sans boucle, huit instructions ; avec, trois. Pour un polygone à **n** côtés, on tourne de **360 ÷ n** degrés à chaque tour.

> Une boucle n’est pas seulement plus courte : elle est plus facile à **corriger**, puisqu’il n’y a qu’un seul endroit à modifier.

## L’instruction conditionnelle
= si … alors … sinon …

Le programme choisit selon une condition : *si le lutin touche le bord, alors rebondir*.

## Les variables
Une **variable** est une case mémoire portant un nom, qui retient une valeur : un score, un compteur. On peut la lire et la modifier au fil du programme.

## Déboguer
~ Tester pas à pas → Isoler l’instruction fautive → Corriger → Retester

Un **bug** est une erreur dans le programme. Un programme se met au point ; il ne s’écrit presque jamais juste du premier coup.`,
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
