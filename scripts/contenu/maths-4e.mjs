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
            cours: `Multiplier et diviser des relatifs tient dans une seule règle, et elle vaut mot pour mot pour les deux opérations.

## La règle des signes
| Le calcul | Son signe |
| (+) × (+) | **+** |
| (−) × (−) | **+** |
| (+) × (−) | **−** |
| (−) × (+) | **−** |

> **Deux signes identiques donnent un résultat positif ; deux signes contraires, un résultat négatif.** La même règle sert pour la division.

## La méthode en deux temps
1. On détermine le **signe** du résultat ;
2. on calcule le produit ou le quotient des **distances à zéro**.

~ (−7) × (+3) → signes contraires : négatif → 7 × 3 = 21 → −21

~ (−36) ÷ (−4) → signes identiques : positif → 36 ÷ 4 = 9 → +9

## Un produit de plusieurs facteurs
On compte les facteurs **négatifs**.

| Nombre de facteurs négatifs | Le produit est… |
| **Pair** | **Positif** |
| **Impair** | **Négatif** |

= (−2) × (−3) × (−5) = −30

Trois facteurs négatifs : nombre impair, donc résultat négatif.

## Les pièges
!> **(−3)² = +9, mais −3² = −9.** Dans le second cas, le carré ne porte que sur le 3, pas sur le signe.

!> L’**opposé** de −5 est **+5** ; son **inverse** est **−1/5**. Opposé et inverse ne se confondent jamais.

> Un produit est **nul** si et seulement si **l’un de ses facteurs** est nul.`,
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
            cours: `Comparer, c’est savoir qui est le plus à droite sur la droite graduée. Encadrer, c’est dire entre quelles bornes on se trouve.

## Comparer deux relatifs
| Le cas | La règle | Exemple |
| Un positif, un négatif | Le **positif** gagne toujours | 2 > −100 |
| Deux **positifs** | La plus grande distance à zéro | 7 > 3 |
| Deux **négatifs** | La **plus petite** distance à zéro | **−3 > −7** |

## Comparer deux fractions
| Le cas | La règle | Exemple |
| Même **dénominateur** | On compare les numérateurs | 5/7 > 3/7 |
| Même **numérateur** | Plus le dénominateur est grand, plus la fraction est petite | 3/10 < 3/4 |
| **Différents** | On réduit au même dénominateur | 2/3 = 10/15 > 9/15 = 3/5 |

## Les symboles
| Le symbole | Il se lit |
| **<** | Strictement inférieur |
| **>** | Strictement supérieur |
| **≤** · **≥** | Inférieur ou égal · supérieur ou égal |

> La pointe se tourne toujours vers le plus **petit**.

## Encadrer un nombre
Encadrer, c’est le placer entre deux bornes : a < x < b. L’écart entre les bornes s’appelle l’**amplitude** : plus elle est petite, plus l’encadrement est **précis**.

| La précision | Pour √2 ≈ 1,4142 |
| À l’unité | 1 < √2 < 2 |
| Au dixième | 1,4 < √2 < 1,5 |
| Au centième | 1,41 < √2 < 1,42 |

## Valeur approchée
| Le type | Ce qu’on prend | Sur √2 au centième |
| Par **défaut** | La borne inférieure | 1,41 |
| Par **excès** | La borne supérieure | 1,42 |
| **Arrondi** | La borne la plus proche | 1,41 |

!> Un encadrement ne se lit jamais seul : il faut savoir **à quelle précision** il est donné. « 1 < x < 2 » et « 1,41 < x < 1,42 » ne disent pas la même chose.`,
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
            cours: `Un même nombre s’écrit avec une infinité de fractions. Reste à trouver celle qui sert.

## La propriété fondamentale
= a/b = (a × k)/(b × k) = (a ÷ k)/(b ÷ k)

Multiplier ou diviser **les deux** par un même nombre non nul ne change pas la valeur.

= 1/2 = 2/4 = 3/6 = 50/100

## Simplifier une fraction
~ 24/36 → on divise haut et bas par 12 → 2/3

Une fraction est **irréductible** quand numérateur et dénominateur n’ont plus de diviseur commun autre que 1.

!> Simplifier n’est pas « enlever des chiffres ». On ne simplifie que par **multiplication ou division**, jamais en retirant un terme d’une somme.

## Réduire au même dénominateur
On cherche un multiple commun : le produit des deux marche toujours, leur **plus petit multiple commun** donne des nombres plus simples.

= 2/3 et 3/4 → 8/12 et 9/12

## Reconnaître deux fractions égales
= a/b = c/d si et seulement si a × d = b × c

~ 6/9 et 8/12 → 6 × 12 = 72 → 9 × 8 = 72 → égales

C’est le **produit en croix**.

## Les écritures particulières
| L’écriture | Sa valeur |
| a/1 | **a** |
| a/a | **1** (a non nul) |
| 0/a | **0** |
| 20/5 | **4** — un entier |`,
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
            cours: `Additionner exige un dénominateur commun. Multiplier n’en exige aucun. C’est toute la différence à retenir.

## Ce qu’est un nombre rationnel
Un nombre qui peut s’écrire **a/b**, avec a et b entiers et b non nul.

## Les quatre opérations d’un coup d’œil
| L’opération | Faut-il un dénominateur commun ? | La règle |
| **Addition** | **Oui** | On ajoute les numérateurs, on garde le dénominateur |
| **Soustraction** | **Oui** | Même chose |
| **Multiplication** | **Non** | Numérateurs entre eux, dénominateurs entre eux |
| **Division** | **Non** | On multiplie par l’**inverse** |

## Addition et soustraction
1. Réduire au **même dénominateur** ;
2. additionner (ou soustraire) les **numérateurs** ;
3. garder le dénominateur commun ;
4. simplifier.

= 2/3 + 1/4 = 8/12 + 3/12 = 11/12

!> **On n’additionne jamais les dénominateurs.** 1/2 + 1/3 ne fait pas 2/5 — et le bon sens le dit : 2/5 est plus petit que 1/2.

## Multiplication
= 3/5 × 2/7 = 6/35

~ 4/9 × 3/8 → simplifier par 4 et par 3 AVANT → 1/6

## Division
= Diviser par une fraction, c’est multiplier par son inverse

= (2/3) ÷ (5/7) = 2/3 × 7/5 = 14/15

!> L’**inverse** de a/b est **b/a**. Ce n’est pas l’**opposé**, qui serait −a/b.

## Les signes
Un signe « moins » peut se placer devant la fraction, au numérateur ou au dénominateur : ces trois écritures désignent le même nombre.

= −(3/4) = (−3)/4 = 3/(−4)

## Les priorités
1. Les **parenthèses** ;
2. les **puissances** ;
3. les **multiplications et divisions**, de gauche à droite ;
4. les **additions et soustractions**, de gauche à droite.

> Une **barre de fraction** joue le rôle d’une parenthèse : on calcule entièrement le numérateur **et** le dénominateur avant de diviser.`,
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
            cours: `Les puissances servent à écrire court ce qui serait très long : la masse d’un atome comme la distance d’une étoile.

## La définition
= a^n = a × a × … × a (n facteurs)

= 5³ = 5 × 5 × 5 = 125

| La convention | Sa valeur |
| **a¹** | a |
| **a⁰** | **1** (a non nul) |
| **a^(−n)** | 1 / a^n |

## Les règles de calcul
| L’opération | Le résultat |
| a^m × a^n | **a^(m+n)** |
| a^m ÷ a^n | **a^(m−n)** |
| (a^m)^n | **a^(m×n)** |
| (a × b)^n | **a^n × b^n** |

!> Ces règles n’ont de sens qu’entre puissances de **même base**. 2³ × 5³ ne se simplifie pas en additionnant les exposants.

## Les puissances de 10
| L’écriture | Sa valeur |
| **10³** | 1 000 — trois zéros |
| **10⁻³** | 0,001 |
| **10^n** | n zéros après le 1 |
| **10^(−n)** | Le 1 au n-ième rang après la virgule |

~ × 10^n → la virgule recule de n rangs vers la droite

~ × 10^(−n) → la virgule recule de n rangs vers la gauche

## L’écriture scientifique
= a × 10^n, avec 1 ≤ a < 10

| Le nombre | Son écriture scientifique |
| 45 300 | **4,53 × 10⁴** |
| 0,00072 | **7,2 × 10⁻⁴** |

> Cette écriture est **unique**. Comparer deux nombres devient immédiat : on regarde d’abord l’**exposant**, puis le facteur a.

## Les préfixes
| Grand | Petit |
| kilo 10³ · méga 10⁶ | milli 10⁻³ · micro 10⁻⁶ |
| giga 10⁹ · téra 10¹² | nano 10⁻⁹ |

> Un **ordre de grandeur** est la puissance de 10 la plus proche : dire qu’une bactérie mesure « de l’ordre du micromètre » suffit souvent à raisonner.`,
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
            cours: `La racine carrée de a, c’est le nombre positif dont le carré vaut a. Ni plus, ni moins.

## La définition
= √9 = 3, parce que 3² = 9 et que 3 est positif

!> **La racine carrée d’un nombre négatif n’existe pas** en 4e : aucun carré n’est négatif.

## Les conséquences immédiates
| L’écriture | Sa valeur |
| (√a)² | **a** |
| √(a²) | **a**, si a est positif |
| √0 · √1 | 0 · 1 |

## Les carrés parfaits à connaître
= 1 · 4 · 9 · 16 · 25 · 36 · 49 · 64 · 81 · 100 · 121 · 144 · 169 · 196 · 225

Ce sont les carrés de 1 à 15.

## Les règles de calcul
| La règle | Exemple |
| **√a × √b = √(a × b)** | √2 × √8 = √16 = 4 |
| **√a ÷ √b = √(a ÷ b)** | √18 ÷ √2 = √9 = 3 |

!> **√(a + b) n’est PAS égal à √a + √b.** √(9 + 16) = √25 = **5**, tandis que √9 + √16 = 3 + 4 = **7**. C’est l’erreur la plus fréquente du chapitre.

## Simplifier une racine
~ √50 → chercher le plus grand carré parfait → √(25 × 2) → 5√2

## Les valeurs approchées
| La racine | Sa valeur |
| √2 | ≈ 1,414 |
| √3 | ≈ 1,732 |
| √5 | ≈ 2,236 |

> √2 est **irrationnel** : sa suite de décimales est infinie et sans période. La calculatrice n’en donne qu’une valeur approchée.

## Où elles servent
Dans le **théorème de Pythagore**, pour retrouver une longueur à partir d’un carré ; et pour trouver le **côté d’un carré** à partir de son aire.`,
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
            cours: `Les nombres premiers sont aux entiers ce que les atomes sont à la matière : les briques dont tout le reste est fait.

## La définition
Un **nombre premier** est un entier **supérieur à 1** qui n’a que **deux** diviseurs : 1 et lui-même.

= 2 · 3 · 5 · 7 · 11 · 13 · 17 · 19 · 23 · 29 · 31 · 37 · 41 · 43 · 47…

!> **2 est le seul nombre premier pair**, et **1 n’est pas premier** : il n’a qu’un seul diviseur. Il en existe une **infinité** — Euclide l’a démontré il y a plus de deux mille ans.

## Tester si un nombre est premier
~ Diviser par 2 → par 3 → par 5 → par 7 → par 11 → s’arrêter quand le carré du diviseur dépasse le nombre

~ 97 : ni par 2, ni 3, ni 5, ni 7 → 11² = 121 > 97 → 97 est premier

## La décomposition en facteurs premiers
Tout entier supérieur à 1 s’écrit d’**une seule façon** comme produit de nombres premiers, à l’ordre près.

~ 360 → 2 × 180 → 2² × 90 → 2³ × 45 → 2³ × 3² × 5

La méthode : diviser successivement par le **plus petit** nombre premier possible, jusqu’à obtenir 1.

## À quoi ça sert
| L’usage | Comment |
| **Simplifier une fraction** | On décompose haut et bas, on barre les facteurs communs |
| Trouver **tous les diviseurs** | On combine les facteurs premiers |
| Reconnaître deux nombres **premiers entre eux** | Aucun facteur commun : la fraction est déjà irréductible |`,
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
            cours: `Développer et factoriser sont deux gestes inverses. Ils ne changent jamais la valeur d’une expression, seulement son habit.

## Développer : du produit à la somme
| La distributivité | La formule | L’exemple |
| **Simple** | k(a + b) = **ka + kb** | 3(x + 5) = **3x + 15** |
| **Double** | (a + b)(c + d) = **ac + ad + bc + bd** | (x + 2)(x + 3) = **x² + 5x + 6** |

~ (x + 2)(x + 3) → x² + 3x + 2x + 6 → x² + 5x + 6

!> Le signe **moins** devant une parenthèse change **tous** les signes à l’intérieur : −(x − 4) = **−x + 4**, pas −x − 4.

## Factoriser : de la somme au produit
On repère un **facteur commun**.

| L’expression | Factorisée |
| 5x + 15 | **5(x + 3)** |
| 7a − 7b | **7(a − b)** |
| x² + 3x | **x(x + 3)** |
| (x + 1)(x + 2) + (x + 1)(x − 5) | **(x + 1)(2x − 3)** |

> Dans le dernier cas, le facteur commun est une **parenthèse entière**. C’est le cas que les exercices attendent le plus.

## Réduire
On regroupe les termes de même nature.

= 3x + 5 + 2x − 1 = 5x + 4

!> **3x et 3x² ne se regroupent jamais** : ce ne sont pas les mêmes objets.

## Tester une égalité
| Pour prouver | Il faut |
| Qu’elle est **vraie** | Développer et réduire les deux membres jusqu’à les rendre identiques |
| Qu’elle est **fausse** | **Un seul contre-exemple** |

## Les conventions d’écriture
| On écrit | Et non |
| **3x** | 3 × x, ni x3 |
| **x** | 1 × x |
| **x²** | x × x |`,
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
            cours: `Résoudre une équation, c’est trouver toutes les valeurs qui rendent l’égalité vraie. Une seule règle suffit.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| L’**inconnue** | La lettre cherchée, souvent x |
| **Résoudre** | Trouver **toutes** les valeurs qui rendent l’égalité vraie |
| Les **solutions** | Ces valeurs |
| Les **membres** | Ce qui est à gauche et à droite du signe = |

## Les deux règles fondamentales
On ne change pas les solutions d’une équation :

1. en **ajoutant** ou **soustrayant** un même nombre aux deux membres ;
2. en **multipliant** ou **divisant** les deux membres par un même nombre **non nul**.

> Ce qu’on fait d’un côté, on le fait **de l’autre**. C’est la seule règle du chapitre ; toutes les autres en découlent.

## La méthode
1. Développer et réduire chaque membre ;
2. regrouper les **termes en x** d’un côté, les **nombres** de l’autre ;
3. diviser par le coefficient de x ;
4. **vérifier** en remplaçant dans l’équation de départ.

~ 5x − 3 = 2x + 9 → 3x = 12 → x = 4

= Vérification : 5 × 4 − 3 = 17 et 2 × 4 + 9 = 17

## L’équation produit nul
= Si A × B = 0, alors A = 0 ou B = 0

= (x − 2)(x + 5) = 0 → solutions : 2 et −5

## Les cas particuliers
| L’équation | Ses solutions |
| **0x = 0** | **Tous** les nombres |
| **0x = 7** | **Aucune** |

## Mettre un problème en équation
1. Nommer l’inconnue et dire ce qu’elle représente ;
2. traduire l’énoncé par une égalité ;
3. résoudre ;
4. **conclure par une phrase**.

!> La solution de l’équation n’est pas encore la réponse au problème. « x = 4 » ne dit pas ce que 4 désigne.`,
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
            cours: `Modéliser, ce n’est pas trouver le résultat : c’est écrire correctement le problème. Le reste est de la technique.

## Les six étapes
1. **Lire et reformuler** : quelle question ? quelles données ? lesquelles manquent ?
2. **Choisir l’inconnue** et écrire ce qu’elle représente : « Soit x le nombre de… » ;
3. **traduire** l’énoncé en expressions littérales ;
4. **résoudre** ;
5. **vérifier la vraisemblance** ;
6. **conclure** par une phrase.

!> L’étape 2 est la plus souvent bâclée, et c’est elle qui décide de tout. Une inconnue mal définie donne une équation juste qui répond à une autre question.

## Les traductions courantes
| L’énoncé | Sa traduction |
| La somme de x et 5 | **x + 5** |
| Le double de x | **2x** |
| Le triple de x, augmenté de 4 | **3x + 4** |
| x diminué de 7 | **x − 7** |
| La moitié de x | **x/2** |
| Le carré de x | **x²** |
| Trois entiers consécutifs | **x, x + 1, x + 2** |
| Un prix après une hausse de 20 % | **1,2 × p** |

## Le programme de calcul
Un énoncé qui enchaîne des opérations se traduit par une **expression littérale**, qu’on développe et réduit pour voir ce que le programme fait vraiment.

~ Choisis un nombre → ajoute 3 → multiplie par 2 → retire 6 → 2(x + 3) − 6 = 2x

C’est ainsi qu’on démontre une conjecture du type « on retombe toujours sur le double du nombre de départ ».

## Choisir le bon modèle
| La situation | Le modèle |
| **Proportionnalité** | Un tableau et un coefficient |
| Une **égalité** à trouver | Une équation |
| Une **évolution** | Un tableau de valeurs ou un graphique |
| Un **partage**, une **comparaison de tarifs** | Une équation, puis une discussion |

## Vérifier la vraisemblance
Un âge négatif, un nombre de personnes décimal, une longueur nulle : ces résultats signalent une erreur, même quand le calcul est juste.`,
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
            cours: `Une série statistique se résume par trois nombres — et se déforme par un seul choix de graphique.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| La **population** | L’ensemble étudié |
| L’**individu** | Un élément de cette population |
| Le **caractère** | Ce qu’on observe |
| L’**effectif** | Combien d’individus portent une valeur |
| L’**effectif total** | La somme de tous les effectifs |
| La **fréquence** | Effectif ÷ effectif total |

| Le caractère est… | Quand… | Exemples |
| **Quantitatif** | Il se **mesure** | Taille, note |
| **Qualitatif** | Il ne se mesure pas | Sport, couleur des yeux |

= La somme des fréquences vaut toujours 1, soit 100 %

## Les trois indicateurs
| L’indicateur | Sa définition | Ce qu’il dit |
| L’**étendue** | Plus grande − plus petite valeur | La **dispersion** |
| La **moyenne** | Somme des valeurs ÷ effectif total | Le centre « de masse » |
| La **médiane** | La valeur qui partage la série **ordonnée** en deux groupes de même effectif | Le milieu du classement |

!> On ne calcule une médiane qu’après avoir **ordonné** la série. Sur des données brutes, elle ne veut rien dire.

## Choisir sa représentation
| Le graphique | Pour quoi |
| **Diagramme en bâtons** | Un caractère quantitatif discret |
| **Diagramme circulaire** | Des parts d’un tout — angle = fréquence × 360° |
| **Histogramme** | Des données regroupées en classes |
| **Courbe** | Une évolution dans le temps |

> Le choix n’est jamais neutre : une courbe raconte une évolution, un diagramme circulaire une répartition. Se tromper de graphique, c’est raconter autre chose.

## Les pièges de lecture
!> Un axe qui ne part pas de zéro, une échelle irrégulière ou des secteurs en trois dimensions **déforment la perception sans falsifier aucun chiffre**. On lit les axes et l’échelle **avant** les barres.`,
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
            cours: `La probabilité se calcule avant l’expérience ; la fréquence se constate après. Les deux se rejoignent quand on répète.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| Une **expérience aléatoire** | Plusieurs issues possibles, aucune prévisible |
| Une **issue** | Un résultat possible |
| Un **événement** | Un ensemble d’issues |

## L’échelle
| La valeur | Ce qu’elle dit |
| **0** | Impossible |
| **0,5** | Une chance sur deux |
| **1** | Certain |

## Le calcul en situation d’équiprobabilité
= P(A) = nombre d’issues favorables ÷ nombre d’issues possibles

| La situation | L’événement | Sa probabilité |
| Dé à six faces | Un nombre pair | 3/6 = **1/2** |
| 5 rouges, 3 bleues | Tirer une rouge | **5/8** |

## L’événement contraire
= P(non A) = 1 − P(A)

> C’est souvent le chemin le plus court : « **au moins un** » se calcule presque toujours par son contraire, « **aucun** ».

## Événements incompatibles
Deux événements qui ne peuvent pas se produire en même temps.

= P(A ou B) = P(A) + P(B)

## Les expériences à deux épreuves
On les représente par un **arbre** ou un **tableau à double entrée**.

~ Le long d’une branche : on MULTIPLIE → Entre les branches qui conviennent : on ADDITIONNE

## Ce que la probabilité ne dit pas
!> Elle ne prédit **pas** le prochain tirage. Une pièce tombée cinq fois sur pile reste à **1/2** au sixième lancer : elle n’a pas de mémoire.

> La **loi des grands nombres** dit seulement ceci : plus on répète l’expérience, plus la fréquence observée se rapproche de la probabilité théorique.`,
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
            cours: `Avant tout produit en croix, une question : est-ce vraiment proportionnel ?

## Reconnaître une situation de proportionnalité
| Le test | Ce qu’on vérifie |
| **Dans un tableau** | Le quotient de chaque colonne est **constant** |
| **Graphiquement** | Les points sont **alignés avec l’origine** |
| **Concrètement** | L’une double, l’autre double ; l’une est nulle, l’autre aussi |

!> Une droite qui ne passe **pas** par (0 ; 0) ne traduit **pas** une proportionnalité. C’est le test graphique qui tranche.

## Les contre-exemples classiques
| La situation | Pourquoi non |
| L’**aire** d’un carré en fonction du côté | Elle varie en côté², pas en côté |
| L’**âge** de deux personnes | L’écart reste constant, pas le rapport |
| Un tarif avec **abonnement fixe** | Le prix ne part pas de 0 |

> Le **périmètre** d’un carré, lui, **est** proportionnel à son côté : P = 4 × c. La même figure porte donc une grandeur proportionnelle et une qui ne l’est pas.

## Les quatre méthodes
1. **Le coefficient** : on le calcule une fois, on l’applique partout ;
2. **le passage à l’unité** : la valeur pour 1, puis on multiplie ;
3. **le produit en croix** : a/b = c/d donne **a × d = b × c** ;
4. **l’additivité et la linéarité** : 3 objets à 12 € et 5 objets à 20 € → 8 objets à **32 €**.

## Où on la retrouve
Échelles, vitesses, pourcentages, recettes, agrandissements-réductions, conversions d’unités, et le théorème de **Thalès**.`,
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
            cours: `Un pourcentage, c’est un coefficient multiplicateur déguisé. Une fois qu’on le voit ainsi, tout devient une multiplication.

## Appliquer un pourcentage
= 30 % de 80 € = 80 × 0,3 = 24 €

Prendre t % d’une quantité, c’est la multiplier par **t/100**.

## Augmenter ou diminuer
| L’évolution | Le coefficient multiplicateur |
| **+ t %** | × (1 + t/100) — +15 % → **× 1,15** |
| **− t %** | × (1 − t/100) — −15 % → **× 0,85** |

## Enchaîner deux évolutions
On **multiplie** les coefficients, jamais on ne les additionne.

| L’enchaînement | Le calcul | Le résultat |
| +10 % puis +10 % | 1,1 × 1,1 = 1,21 | **+21 %** |
| −20 % puis +20 % | 0,8 × 1,2 = 0,96 | **−4 %** |

!> **Une baisse suivie d’une hausse du même taux ne ramène jamais au prix de départ.** Les deux pourcentages ne portent pas sur la même quantité.

## Les trois questions
| On cherche… | On fait… | Exemple |
| La **partie** | On multiplie | 30 % de 80 = 24 € |
| Le **pourcentage** | (partie ÷ tout) × 100 | 15 sur 25 → **60 %** |
| Le **tout** | On divise | 24 ÷ 0,3 = **80 €** |

## Le taux d’évolution
= (valeur finale − valeur initiale) ÷ valeur initiale × 100

= De 50 € à 60 € : (60 − 50) ÷ 50 × 100 = +20 %

> Un pourcentage ne veut rien dire sans savoir **de quoi** il est le pourcentage : « +50 % » sur un petit nombre peut peser moins que « +5 % » sur un grand.`,
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
            cours: `Quand la valeur d’une grandeur en détermine une autre, on peut la décrire de trois façons — et la lire sur un graphique.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| La **variable** | La grandeur qu’on choisit |
| La grandeur **dépendante** | Celle qui en découle |

> À chaque valeur de la variable correspond **une seule** valeur de la grandeur dépendante. C’est la première approche de la notion de **fonction**, formalisée en 3e.

## Trois façons de décrire la dépendance
| La description | Sa forme |
| Une **formule** | P = 2,50 × n |
| Un **tableau de valeurs** | Variable en première ligne, grandeur dépendante en seconde |
| Un **graphique** | Variable en **abscisse**, grandeur dépendante en **ordonnée** |

## Lire un graphique
~ Partir de x en abscisse → monter jusqu’à la courbe → lire en ordonnée

Et le chemin inverse pour retrouver x à partir d’une ordonnée.

| L’allure | Ce qu’elle dit |
| **Croissante** | La grandeur augmente avec la variable |
| **Décroissante** | Elle diminue |
| Un **palier** | Elle ne change pas |

## Dépendance n’est pas proportionnalité
| L’exemple | Dépendance | Proportionnalité |
| Prix = 10 € par mois + 5 € de frais | oui | **non** |
| Aire d’un disque en fonction de R | oui | **non** (en R²) |
| Prix de n croissants à 2,50 € | oui | **oui** |

!> Toute proportionnalité est une dépendance ; **l’inverse est faux**. Le test reste le même : la représentation est-elle une **droite passant par l’origine** ?

## Utiliser un tableur
Une colonne pour la variable, une colonne de formule pour la grandeur dépendante, un graphique sur les deux : c’est la façon la plus rapide d’explorer une dépendance.`,
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
            cours: `Certaines grandeurs se mesurent. D’autres se fabriquent, en multipliant ou en divisant deux grandeurs simples.

## Les grandeurs produits
Elles s’obtiennent en **multipliant**.

| La grandeur | Son calcul | Son unité |
| **Aire** | longueur × longueur | m², cm² |
| **Volume** | longueur × longueur × longueur | m³, cm³ |
| **Énergie** | puissance × durée | le **kilowattheure** |

Le kilomètre-passager et la personne-heure de travail en sont aussi.

## Les grandeurs quotients
Elles s’obtiennent en **divisant**.

| La grandeur | Son calcul | Son unité |
| **Vitesse** | distance ÷ durée | m/s, km/h |
| **Masse volumique** | masse ÷ volume | g/cm³ |
| **Débit** | volume ÷ durée | L/min |
| **Prix au kilo** | prix ÷ masse | €/kg |
| **Densité de population** | habitants ÷ superficie | hab/km² |
| **Consommation** | volume ÷ distance | L/100 km |

## L’unité dit la formule
| L’unité | Ce qu’elle raconte |
| **km/h** | Kilomètres **par** heure : une division |
| **kWh** | Une puissance **multipliée** par une durée |
| **g/cm³** | Une masse divisée par un volume |

> Devant un énoncé, lire l’unité **demandée** indique l’opération à faire. C’est la meilleure vérification d’un résultat qui soit.

## La cohérence des unités
!> Une durée en **heures** avec une distance en **kilomètres** donne des km/h. En mélangeant minutes et kilomètres, le résultat n’a **aucun nom** — et aucune valeur.`,
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
            cours: `Vitesse, débit, consommation : trois grandeurs quotients, une même méthode, et une conversion à ne pas rater.

## La vitesse moyenne
= v = d ÷ t · d = v × t · t = d ÷ v

Un triangle mnémotechnique aide : **d** en haut, **v** et **t** en bas ; on masque la grandeur cherchée pour lire l’opération.

## Les conversions
| Le sens | L’opération | Exemple |
| **km/h → m/s** | ÷ 3,6 | 36 km/h = **10 m/s** |
| **m/s → km/h** | × 3,6 | 20 m/s = **72 km/h** |

= 1 h = 60 min = 3 600 s

!> **1 h 30 min = 1,5 h, jamais 1,30 h.** C’est l’erreur la plus fréquente du chapitre : les durées ne sont pas décimales.

## Moyenne et instantanée
| La vitesse | Ce qu’elle mesure |
| **Moyenne** | Sur l’ensemble du trajet |
| **Instantanée** | À un instant donné — celle du compteur |

!> **La vitesse moyenne d’un aller-retour n’est pas la moyenne des deux vitesses.** Il faut repasser par la **distance totale** et la **durée totale**.

## Le débit
= débit = volume ÷ durée

~ Baignoire de 150 L → robinet à 12 L/min → 150 ÷ 12 = 12,5 min

## La consommation
= consommation = (volume consommé ÷ distance) × 100

= 6,5 L/100 km sur 420 km : 6,5 × 4,2 = 27,3 L

## La méthode générale
1. Repérer l’**unité demandée** — elle donne l’opération ;
2. convertir les données dans des unités **compatibles** ;
3. calculer ;
4. **vérifier l’ordre de grandeur**.

> Un piéton à 300 km/h ou une baignoire remplie en deux secondes : le résultat se réfute tout seul.`,
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
            cours: `Dans le plan, deux coordonnées suffisent. Dans l’espace, il en faut trois.

## Le pavé droit
| Le solide | Faces | Arêtes | Sommets |
| **Pavé droit** | 6 rectangles | 12 | 8 |
| **Cube** | 6 carrés | 12 | 8 |

Le cube est le cas particulier où toutes les arêtes sont égales.

## Se repérer
On choisit un sommet comme **origine** et trois arêtes issues de ce sommet comme **axes**.

= Origine (0 ; 0 ; 0) → sommet opposé (L ; l ; h)

> C’est le principe du repère du plan, avec un axe de plus. **Deux** coordonnées situent un point sur une **face** ; **trois** le situent dans l’**espace**.

## Lire une perspective cavalière
| Ce qui est conservé | Ce qui ne l’est pas |
| Le **parallélisme** | Les **angles droits** (sauf face avant) |
| L’**alignement** | Les **longueurs** des fuyantes |

!> Une face **carrée** peut apparaître comme un **parallélogramme**. Les arêtes cachées se tracent en **pointillés** ; la face avant, en vraie grandeur.

## Positions relatives dans l’espace
| Les objets | Leurs positions possibles |
| Deux **droites** | Parallèles · sécantes · **non coplanaires** |
| Une **droite** et un **plan** | Parallèle · sécante en un point · contenue dans le plan |
| Deux **plans** | Parallèles · sécants selon une **droite** |

!> Le cas **non coplanaire** — deux droites qui ne se coupent jamais sans être parallèles — **n’existe pas dans le plan**. C’est la nouveauté de la géométrie dans l’espace.

## Les calculs
= Volume = L × l × h

= Aire totale = 2(L×l + L×h + l×h)

La **diagonale d’une face** se calcule par **Pythagore** dans le rectangle correspondant.`,
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
            cours: `Pyramide et cône partagent une même formule de volume — et un même tiers oublié.

## La pyramide
| Ce qu’elle a | Sa nature |
| Une **base** | Un polygone |
| Des **faces latérales** | Des triangles qui se rejoignent au **sommet** |
| Une **hauteur** | Du sommet, **perpendiculaire** à la base |

Une pyramide est **régulière** quand sa base est un polygone régulier et que son sommet se projette au centre de la base. Le **tétraèdre** est une pyramide à base triangulaire : quatre faces, toutes des triangles.

## Le cône de révolution
Il s’obtient en faisant tourner un **triangle rectangle** autour d’un côté de l’angle droit. Sa base est un **disque** ; l’hypoténuse, qui engendre la surface latérale, s’appelle la **génératrice**.

## La formule commune
= V = (1/3) × aire de la base × hauteur

| Le solide | Son volume |
| **Pyramide** | (1/3) × aire du polygone × h |
| **Cône** | (1/3) × π × R² × h |

!> **Le tiers est le facteur que les copies oublient le plus.** Une pyramide occupe exactement le tiers du prisme de même base et de même hauteur — cela se vérifie en versant du sable.

!> La **hauteur** est perpendiculaire à la base ; ce n’est **jamais** l’arête latérale, qui est plus longue.

## Les patrons
| Le solide | Son patron |
| **Pyramide** | La base, plus autant de triangles que de côtés |
| **Cône** | Un disque et un **secteur circulaire** — pas un triangle |

Pour le cône, le rayon du secteur est la **génératrice**, et sa longueur d’arc est le **périmètre de la base**.

## Les sections planes
Un plan **parallèle à la base** coupe une pyramide selon un polygone de même forme, et un cône selon un **disque**.

~ La section est une réduction : longueurs × k → aires × k² → volumes × k³

## Les unités
= 1 L = 1 dm³ · 1 cm³ = 1 mL · 1 m³ = 1 000 L`,
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
            cours: `Agrandir une figure multiplie ses longueurs par k. Mais ses aires par k², et ses volumes par k³.

## Le rapport k
| La valeur de k | Ce qui se passe |
| **k > 1** | Agrandissement |
| **k < 1** | Réduction |
| **k = 1** | La figure ne change pas |

## Ce qui est conservé
| Conservé | Multiplié |
| La **forme** | Les longueurs, par **k** |
| Les **angles** — même mesure exacte | Les aires, par **k²** |
| Le **parallélisme** et l’**alignement** | Les volumes, par **k³** |
| Les **rapports** internes | |

!> **C’est la source d’erreur numéro un du chapitre.** Un agrandissement de rapport 3 triple les longueurs, multiplie l’aire par **9** et le volume par **27**.

## Un exemple complet
Une maquette au 1/50 d’un immeuble :

| Sur la maquette | En réalité | Le calcul |
| Hauteur 20 cm | **10 m** | 20 × 50 = 1 000 cm |
| Aire 4 cm² | **1 m²** | 4 × 50² = 10 000 cm² |
| Volume 2 cm³ | **0,25 m³** | 2 × 50³ = 250 000 cm³ |

## Reconnaître un agrandissement
Deux figures sont un agrandissement l’une de l’autre si le rapport de deux longueurs correspondantes est **le même pour toutes les paires** de côtés.

## Où on le rencontre
Les **échelles** (cartes, plans, maquettes), les **sections** de solides, la configuration de **Thalès**, les **triangles semblables**, et l’**homothétie** vue en 3e.`,
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
            cours: `Deux triangles égaux ont la même taille. Deux triangles semblables n’ont que la même forme.

## Les triangles égaux (ou isométriques)
Leurs côtés sont deux à deux de même longueur, et leurs angles deux à deux de même mesure. L’un se superpose exactement à l’autre, éventuellement après retournement.

**Trois cas d’égalité** suffisent à le démontrer :
1. **Trois côtés** égaux deux à deux ;
2. **deux côtés et l’angle compris** entre eux ;
3. **un côté et les deux angles adjacents**.

## Les triangles semblables
Même **forme**, sans forcément la même taille : angles deux à deux égaux, côtés **proportionnels**.

> **Le critère à retenir : deux angles égaux suffisent.** Comme la somme des angles vaut 180°, le troisième suit tout seul.

## Le rapport de similitude
= AB/DE = AC/DF = BC/EF = k

| La grandeur | Multipliée par |
| Les longueurs | **k** |
| Les aires | **k²** |

Deux triangles **égaux** sont des triangles semblables de rapport **k = 1**.

!> **L’ordre des lettres n’est pas décoratif.** Écrire « ABC semblable à DEF » engage les trois correspondances A↔D, B↔E, C↔F. Les intervertir donne des quotients faux.

## À quoi ça sert
| L’usage | L’exemple |
| Calculer une **longueur inaccessible** | La hauteur d’un arbre par son ombre |
| **Démontrer** une égalité de rapports | Dans un exercice de Thalès |

> La configuration de **Thalès** produit toujours deux triangles semblables : les deux chapitres décrivent la même situation, avec deux vocabulaires.

## La rédaction type
« Dans les triangles ABC et DEF : angle A = angle D et angle B = angle E. Donc ABC et DEF sont semblables. Par conséquent AB/DE = AC/DF = BC/EF. »`,
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
            cours: `Deux droites parallèles coupant deux sécantes : les longueurs se retrouvent dans le même rapport.

## La configuration
Deux droites sécantes en **A** ; **B** et **M** sur la première, **C** et **N** sur la seconde. Si **(BC) // (MN)**, alors :

= AM / AB = AN / AC = MN / BC

| La figure | Où sont M et N |
| Le **triangle emboîté** | Du **même côté** de A |
| Le **papillon** | De part et d’autre de A |

Le théorème est le même dans les deux cas.

## La méthode en trois temps
1. **Vérifier les hypothèses** : points alignés, droites parallèles ;
2. **écrire les trois quotients** dans le bon ordre — chacun commence par le sommet commun **A** ;
3. **résoudre par le produit en croix**, avec les deux quotients dont on connaît trois longueurs.

!> L’erreur classique est de mélanger un « petit » et un « grand » segment dans le même quotient. Écrire systématiquement **petit sur grand** évite la moitié des fautes.

## La réciproque : démontrer un parallélisme
Si A, M, B et A, N, C sont alignés **dans le même ordre**, et si AM/AB = AN/AC, alors **(MN) // (BC)**.

## La contraposée : démontrer un NON-parallélisme
~ Calculer les deux quotients → Les comparer → S’ils diffèrent, les droites ne sont pas parallèles

C’est la question type de fin d’exercice.

## Le lien avec les agrandissements
Le rapport commun est un **coefficient de réduction** : les longueurs y sont dans le rapport k, les aires dans le rapport k².

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
            cours: `Pythagore relie trois longueurs. Le cosinus relie deux longueurs et un angle. Un exercice les enchaîne souvent.

## Le théorème de Pythagore
Dans un triangle **rectangle en A** :

= BC² = AB² + AC²

L’**hypoténuse** est le côté opposé à l’angle droit, et c’est **toujours le plus long**.

| On cherche | La formule |
| L’**hypoténuse** | BC = √(AB² + AC²) — on **additionne** |
| Un **autre côté** | AB = √(BC² − AC²) — on **soustrait** |

!> Dans le second cas, **l’ordre compte** : c’est toujours le carré de l’hypoténuse **moins** l’autre, jamais l’inverse.

## La réciproque
Si le carré du plus grand côté **est égal** à la somme des carrés des deux autres, alors le triangle **est rectangle**, et l’angle droit est opposé au plus grand côté.

## La contraposée
~ Calculer le carré du plus grand côté → Calculer la somme des carrés des deux autres → Comparer

Si l’égalité n’est pas vérifiée, le triangle **n’est pas rectangle**.

## Le cosinus d’un angle aigu
= cos(angle) = côté adjacent ÷ hypoténuse

| On cherche | La démarche |
| Une **longueur** | On isole l’inconnue |
| Un **angle** | On calcule le quotient, puis la touche **cos⁻¹**, calculatrice en **degrés (DEG)** |

## Les valeurs à connaître
| L’angle | Son cosinus |
| 0° | 1 |
| 60° | 0,5 |
| 90° | 0 |

!> Le cosinus d’un angle aigu est **toujours compris entre 0 et 1**. Un résultat supérieur à 1 signale une erreur de calcul, pas un angle exotique.`,
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
            cours: `Un parallélogramme, trois façons de le rendre particulier — et des diagonales qui suffisent à les distinguer.

## Le parallélogramme
Un quadrilatère dont les côtés opposés sont **parallèles deux à deux**.

| Sa propriété | Le détail |
| Les **côtés opposés** | Même longueur |
| Les **angles opposés** | Même mesure |
| Les **diagonales** | Elles se coupent **en leur milieu** |
| Le **centre de symétrie** | Le point d’intersection des diagonales |

## Les trois cas particuliers
| La figure | Ce qu’on ajoute | Ce qu’on obtient |
| **Rectangle** | Un **angle droit** | Quatre angles droits, diagonales de **même longueur** |
| **Losange** | Deux côtés consécutifs **égaux** | Quatre côtés égaux, diagonales **perpendiculaires** |
| **Carré** | Rectangle **et** losange | Toutes les propriétés des deux |

## Le tableau des diagonales
| La figure | Milieu commun | Même longueur | Perpendiculaires |
| Parallélogramme | oui | non | non |
| **Rectangle** | oui | **oui** | non |
| **Losange** | oui | non | **oui** |
| **Carré** | oui | **oui** | **oui** |

> Les diagonales sont l’outil de démonstration le plus efficace du chapitre : leurs trois propriétés suffisent à distinguer les quatre figures.

## Les axes de symétrie
= Parallélogramme 0 · Rectangle 2 · Losange 2 · Carré 4

!> Le parallélogramme quelconque a un **centre** de symétrie mais **aucun axe**.

## Rédiger une démonstration
« Les diagonales de ABCD se coupent en leur milieu **et** ont la même longueur, **donc** ABCD est un rectangle. »`,
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
            cours: `Une translation fait glisser une figure. Elle ne la tourne pas, et surtout elle ne la retourne pas.

## Ce qui définit une translation
~ Une direction → un sens → une longueur

Ces trois informations se résument par une **flèche**.

## Construire l’image d’un point
L’image M′ d’un point M par la translation qui transforme A en B est le point tel que **ABM′M soit un parallélogramme**.

> Concrètement : on reporte le déplacement de A vers B à partir de M — même direction, même sens, même longueur.

## Ce que la translation conserve
Elle conserve **tout**, sauf la position :

| Elle conserve |
| Les **longueurs** |
| Les **angles** |
| Les **aires** et les **périmètres** |
| L’**alignement**, le **parallélisme**, les **milieux** |
| L’**orientation** de la figure |

!> C’est l’**orientation** qui la distingue des symétries : une figure et son image par translation sont superposables **sans retournement**.

## Comparer les transformations
| La transformation | Définie par | Retourne la figure |
| **Translation** | Une direction, un sens, une longueur | **non** |
| **Symétrie axiale** | Un axe | **oui** |
| **Symétrie centrale** | Un centre | oui (demi-tour) |
| **Rotation** | Un centre et un angle | non |

Les quatre conservent les longueurs.

## Enchaîner deux translations
Deux translations successives équivalent à **une seule** : les deux déplacements s’ajoutent.

## Où on la rencontre
Les **frises** et les **pavages**, construits par répétition d’un motif translaté ; les mosaïques ; les dessins d’Escher. C’est aussi la première approche des **vecteurs**, étudiés au lycée.`,
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
            cours: `Le mot « de » se traduit toujours par le signe ×. Tout le chapitre en découle.

## Prendre une fraction d’une quantité
= Les trois quarts de 60 = 60 × 3/4 = 45

## Deux méthodes équivalentes
| La méthode | Sur 60 × 3/4 |
| **Diviser puis multiplier** | 60 ÷ 4 = 15, puis 15 × 3 = **45** |
| **Multiplier puis diviser** | 60 × 3 = 180, puis 180 ÷ 4 = **45** |

> On choisit l’ordre qui donne les calculs les plus simples : si la division tombe juste, on commence par elle.

## Le lien avec les pourcentages
Un pourcentage **est** une fraction de dénominateur 100.

| Le pourcentage | La fraction |
| 50 % | 1/2 |
| 25 % | 1/4 |
| 75 % | 3/4 |
| 10 % | 1/10 |
| 20 % | 1/5 |

= 25 % de 80 = 80 × 0,25 = 20

## Fraction d’une fraction
On multiplie les deux fractions.

= La moitié des trois quarts = 1/2 × 3/4 = 3/8

## Retrouver le tout
On **divise** par la fraction — c’est-à-dire qu’on multiplie par son inverse.

= 45 ÷ 3/4 = 45 × 4/3 = 60

> Prendre une fraction, c’est **multiplier** ; retrouver le tout, c’est **diviser**. Une erreur de sens se repère à la vraisemblance : la partie doit être plus petite que le tout quand la fraction est inférieure à 1.

## Les fractions supérieures à 1
!> Prendre les **5/4** d’une quantité l’**augmente** : 60 × 5/4 = 75. Une fraction supérieure à 1 agrandit, une fraction inférieure à 1 réduit.`,
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
            cours: `Le produit en croix résout tous les tableaux de proportionnalité. Encore faut-il que la situation en soit une.

## La propriété
= a/b = c/d si et seulement si a × d = b × c

On multiplie « en croix » : le numérateur de l’une par le dénominateur de l’autre.

## Deux usages
| L’usage | L’exemple | Le verdict |
| **Vérifier** une égalité | 6/9 et 8/12 : 72 et 72 | **Égales** |
| | 5/7 et 7/9 : 45 et 49 | **Différentes** |
| **Trouver** une valeur manquante | x/12 = 5/4 → 4x = 60 | **x = 15** |

## La méthode pas à pas
1. Écrire l’égalité de deux quotients ;
2. multiplier en croix ;
3. isoler l’inconnue en divisant ;
4. vérifier en remplaçant.

## Dans un tableau de proportionnalité
| Quantité | 4 | 12 |
| Prix | 5 | **x** |

~ 4x = 12 × 5 → 4x = 60 → x = 15 €

!> **Le produit en croix ne s’applique qu’à une situation réellement proportionnelle.** Appliqué à un tarif avec abonnement fixe, ou à l’aire d’un carré en fonction de son côté, il donne un résultat faux — et **rien dans le calcul ne le signale**.

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
            cours: `Dans un problème de partage, la question porte tantôt sur le quotient, tantôt sur le reste. Tout l’exercice est là.

## La définition
= a = b × q + r, avec 0 ≤ r < b

| Le nom | Sa place |
| **Dividende** | a, ce qu’on partage |
| **Diviseur** | b, non nul |
| **Quotient** | q |
| **Reste** | r |

= 47 = 5 × 9 + 2, et 2 < 5

!> Si le reste obtenu est **supérieur ou égal** au diviseur, c’est que le quotient est trop petit : il faut le relever d’un cran. C’est la condition qui rend le couple (q ; r) **unique**.

## Le vocabulaire de la divisibilité
Quand le reste est **nul** :

~ a est divisible par b → b est un diviseur de a → a est un multiple de b

| Le calcul | Le verdict |
| 47 = 5 × 9 + 2 | 47 **n’est pas** divisible par 5 |
| 48 = 6 × 8 + 0 | 48 **est** divisible par 6 |

## À quoi ça sert
| Le problème | Ce qu’on utilise |
| **Partage** : combien de paquets complets ? | Le **quotient** |
| **Conversions** : 200 min = 3 h 20 | 200 = 60 × 3 + 20 |
| **Parité** : pair ou impair ? | Le reste de la division par 2 |
| **Cycles** : quel jour dans 100 jours ? | Le reste de la division par 7 |

## L’interprétation
!> Dans un énoncé, il faut **décider lequel des deux répond à la question**. « Combien de boîtes pleines ? » demande le **quotient** ; « combien d’objets en trop ? » demande le **reste**. C’est là que se joue l’exercice, plus que dans le calcul.`,
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
            cours: `Multiple et diviseur disent la même relation, vue de deux côtés.

## Les définitions
= Si a = b × k avec k entier, alors a est un multiple de b et b est un diviseur de a

~ 42 = 6 × 7 → 42 est un multiple de 6 et de 7 → 6 et 7 sont des diviseurs de 42

## Les multiples
| Leur propriété | Le détail |
| Ils sont **infinis** | Ceux de 7 : 0, 7, 14, 21, 28, 35, 42… |
| **0** | Il est multiple de **tous** les entiers |
| Tout nombre | Il est multiple de lui-même et de 1 |

## Les diviseurs
| Leur propriété | Le détail |
| Ils sont en nombre **fini** | Ceux de 12 : 1, 2, 3, 4, 6, 12 |
| **1** | Il divise tout |
| **0** | On ne divise **jamais** par 0 |

## Lister tous les diviseurs
On teste 1, 2, 3… en formant des **paires**, et on s’arrête quand les deux facteurs se croisent.

= 12 = 1 × 12 = 2 × 6 = 3 × 4

> La méthode par paires est la seule qui **garantisse** qu’aucun diviseur n’est oublié.

## Les diviseurs communs
| Le nombre | Ses diviseurs |
| 18 | 1, 2, 3, 6, 9, 18 |
| 24 | 1, 2, 3, 4, 6, 8, 12, 24 |
| **Communs** | 1, 2, 3, **6** |

~ 18/24 → diviser par le plus grand commun, 6 → 3/4

> Deux nombres qui n’ont que 1 comme diviseur commun sont **premiers entre eux** : la fraction qu’ils forment est déjà irréductible.

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
            cours: `Un critère de divisibilité, c’est savoir sans poser l’opération.

## Les critères à connaître
| Divisible par | Si… |
| **2** | Le nombre se termine par 0, 2, 4, 6 ou 8 |
| **3** | La **somme des chiffres** est divisible par 3 |
| **4** | Les **deux derniers chiffres** forment un multiple de 4 |
| **5** | Le nombre se termine par 0 ou 5 |
| **9** | La somme des chiffres est divisible par 9 |
| **10** | Le nombre se termine par 0 |
| **25** | Le nombre se termine par 00, 25, 50 ou 75 |

## Des exemples
| Le nombre | Ce qu’on constate | Divisible par |
| **2 358** | Somme = 18 ; finit par 8 | 2, 3, 9 |
| **1 236** | 36 est multiple de 4 | 4 |
| **4 725** | Finit par 25 ; somme = 18 | 5, 9, 25 |

## Combiner les critères
| La combinaison | Ce qu’on en déduit |
| Divisible par **2 et 3** | Divisible par **6** |
| Divisible par **3 et 4** | Divisible par **12** |

!> **Cela ne marche que si les deux diviseurs sont premiers entre eux.** Divisible par 2 **et** par 4 ne signifie **pas** divisible par 8.

## À quoi ça sert
~ Repérer un diviseur commun → Simplifier la fraction sans tâtonner

Les critères servent aussi à **décomposer** un nombre en facteurs premiers plus vite, et à vérifier un calcul mental.

> Le critère de 9 fonde la **preuve par neuf**, la vérification rapide des multiplications qu’on utilisait avant les calculatrices.`,
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
            cours: `Trois questions reviennent sans cesse, et chacune a son opération. Se tromper d’opération, c’est se tromper de question.

## Les trois questions
| La question | L’opération | L’exemple |
| Combien font **18 % de 250** ? | On **multiplie** | 250 × 0,18 = **45** |
| **45 est quel pourcentage** de 250 ? | On divise, puis × 100 | (45 ÷ 250) × 100 = **18 %** |
| 45 est **18 % de quoi** ? | On **divise** par le coefficient | 45 ÷ 0,18 = **250** |

> La **partie** se multiplie, le **tout** se divise. En cas de doute : le tout doit être **plus grand** que la partie.

## Retrouver un prix avant réduction
Un article soldé à 68 € après −15 % : le prix payé vaut **0,85 fois** le prix initial.

= 68 ÷ 0,85 = 80 €

!> **Ajouter 15 % à 68 € donnerait 78,20 €, et ce serait faux.** Les 15 % portaient sur le prix **initial**, pas sur le prix soldé.

## Retrouver un prix avant augmentation
= 96 ÷ 1,2 = 80 €

## Les évolutions successives
On **multiplie** les coefficients.

= +10 % puis −10 % → 1,1 × 0,9 = 0,99 → −1 %

On ne revient jamais au point de départ.

## Le taux d’évolution
= (finale − initiale) ÷ initiale × 100

= De 80 € à 96 € : (96 − 80) ÷ 80 × 100 = +20 %`,
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
            cours: `Une échelle est un rapport sans unité. Le calcul est simple ; c’est la conversion qui piège.

## La définition
= Échelle = distance sur le plan ÷ distance réelle

Les deux distances doivent être **dans la même unité**. L’échelle n’a donc **pas d’unité** : 1/25 000, ou 1 : 25 000.

| L’échelle | Ce que c’est | Exemple |
| **< 1** | Une **réduction** | Cartes, plans |
| **> 1** | Un **agrandissement** | Schéma d’un insecte, d’un circuit |

## Les deux calculs
| Le sens | L’opération | Au 1/25 000 |
| Plan → **réel** | On **divise** par l’échelle | 3 cm → 75 000 cm = **750 m** |
| Réel → **plan** | On **multiplie** par l’échelle | 2 km = 200 000 cm → **8 cm** |

## Les conversions, le vrai piège
= 1 m = 100 cm · 1 km = 1 000 m = 100 000 cm

!> La majorité des erreurs du chapitre viennent de là, **pas du raisonnement**. On convertit tout dans la même unité **avant** de calculer, puis on reconvertit dans l’unité demandée à la fin.

## Aires et volumes
Une échelle porte sur les **longueurs** seules.

| Au 1/100 | Divisé par |
| Les longueurs | 100 |
| Les **aires** | **10 000** (100²) |
| Les **volumes** | **1 000 000** (100³) |

> Un salon de 20 m² occupe donc 20 ÷ 10 000 = 0,002 m², soit **20 cm²** sur un plan au 1/100.

## Les échelles courantes
| Le document | Son échelle |
| Plan de maison | 1/50 ou 1/100 |
| Plan de ville | 1/10 000 |
| Carte de randonnée | 1/25 000 |
| Carte routière | 1/200 000 |`,
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
            cours: `Certaines grandeurs se lisent sur un instrument. D’autres n’existent qu’au bout d’un calcul.

## Les grandeurs simples
| La grandeur | Son unité | Son instrument |
| **Longueur** | Le mètre | La règle |
| **Masse** | Le kilogramme | La balance |
| **Durée** | La seconde | Le chronomètre |
| **Température** | Le degré Celsius | Le thermomètre |
| **Intensité** | L’ampère | L’ampèremètre |

## Les grandeurs composées
| Par **multiplication** | Son unité |
| Aire = longueur × longueur | m² |
| Volume = longueur × longueur × longueur | m³ |
| Énergie = puissance × durée | kWh |

| Par **division** | Son unité |
| Vitesse = distance ÷ durée | m/s |
| Masse volumique = masse ÷ volume | g/cm³ |
| Débit = volume ÷ durée | L/min |
| Prix au kilo = prix ÷ masse | €/kg |

## L’unité révèle la construction
| L’unité | Ce qu’elle dit |
| **m²** | Deux longueurs multipliées |
| **km/h** | Une distance divisée par une durée |
| **kWh** | Une puissance multipliée par une durée |

> Lire l’unité **demandée** indique l’opération ; vérifier l’unité **obtenue** valide le résultat. C’est la vérification la plus rapide qui soit.

## Grandeur, mesure et unité
| Le mot | Sur une table |
| La **grandeur** | La longueur |
| La **mesure** | 1,20 |
| L’**unité** | Le mètre |

!> Un résultat **sans unité** n’a aucun sens : « la table mesure 1,20 » ne dit rien.`,
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
            cours: `Le système décimal marche de 10 en 10 — sauf pour les durées, qui n’en font qu’à leur tête.

## Les préfixes
~ kilo ×1000 → hecto ×100 → déca ×10 → unité → déci ÷10 → centi ÷100 → milli ÷1000

## Les longueurs
~ km → hm → dam → m → dm → cm → mm

Chaque colonne vaut **10 fois** la suivante.

= 1 km = 1 000 m · 1 m = 100 cm · 1 cm = 10 mm

= 3,5 km = 3 500 m · 250 cm = 2,5 m

## Les masses
~ t → q → kg → hg → dag → g → dg → cg → mg

= 1 t = 1 000 kg · 1 kg = 1 000 g · 1 g = 1 000 mg

## Les contenances
= 1 L = 100 cL = 1 000 mL

= 1 L = 1 dm³ et 1 mL = 1 cm³

> Ces deux dernières égalités sont celles qui relient les **contenances** aux **volumes**. Sans elles, un exercice sur une citerne ne se termine pas.

## Les durées, l’exception
= 1 h = 60 min · 1 min = 60 s · 1 jour = 24 h

| L’écriture | Sa valeur décimale |
| 1 h 30 | **1,5 h** |
| 2 h 15 | **2,25 h** |
| 45 min | **0,75 h** |

!> **1 h 30 n’est jamais 1,30 h.** Pour convertir des minutes en heures décimales, on divise par 60.

## La méthode sûre
1. Écrire l’unité de départ dans un **tableau de conversion**, un chiffre par colonne ;
2. placer la virgule après la colonne de l’unité de départ ;
3. déplacer la virgule jusqu’à la colonne d’arrivée, en complétant par des **zéros**.

> **Convertir vers une unité plus petite donne un nombre plus grand.** Ce test de vraisemblance repère instantanément une virgule partie du mauvais côté.`,
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
            cours: `Une aire n’est pas une longueur. C’est pourquoi elle ne se convertit pas comme une longueur.

## Les aires : de 100 en 100
~ km² → hm² → dam² → m² → dm² → cm² → mm²

Chaque colonne vaut **100 fois** la suivante, parce qu’une aire est un produit de **deux** longueurs (10 × 10 = 100).

= 1 m² = 10 000 cm² · 1 km² = 1 000 000 m²

= 1 hectare = 1 hm² = 10 000 m² · 1 are = 100 m²

> Dans un tableau de conversion, chaque unité d’aire occupe **DEUX** colonnes.

## Les volumes : de 1 000 en 1 000
~ km³ → hm³ → dam³ → m³ → dm³ → cm³ → mm³

Chaque colonne vaut **1 000 fois** la suivante (10 × 10 × 10).

= 1 m³ = 1 000 dm³ = 1 000 000 cm³

= 1 dm³ = 1 L · 1 cm³ = 1 mL · 1 m³ = 1 000 L

> Chaque unité de volume occupe **TROIS** colonnes.

## Les vitesses
| Le sens | L’opération | Exemple |
| **km/h → m/s** | ÷ 3,6 | 36 km/h = **10 m/s** |
| **m/s → km/h** | × 3,6 | 20 m/s = **72 km/h** |

= L’origine du 3,6 : 1 km/h = 1 000 m ÷ 3 600 s

## Les autres grandeurs quotients
On convertit **le numérateur et le dénominateur séparément**.

| L’égalité | |
| 1 g/cm³ | = 1 000 kg/m³ |
| 1 L/min | = 60 L/h |
| 5 €/kg | = 0,005 €/g |

!> **L’erreur la plus fréquente du chapitre : traiter une aire ou un volume comme une longueur.** 1 m² ne fait pas 100 cm², mais **10 000**.`,
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
            cours: `Un triangle se classe, se construit et se calcule. Trois propriétés suffisent à tout tenir.

## La somme des angles
= Angle A + Angle B + Angle C = 180°

C’est la propriété la plus utilisée du chapitre : deux angles connus donnent toujours le troisième.

## Les triangles particuliers
| Le triangle | Sa définition | Ce qu’on en déduit |
| **Isocèle** | Deux côtés égaux | Angles à la base **égaux**, un axe de symétrie |
| **Équilatéral** | Trois côtés égaux | Trois angles de **60°**, trois axes |
| **Rectangle** | Un angle droit | Les deux autres angles sont **complémentaires** ; **Pythagore** s’applique |
| **Rectangle isocèle** | Les deux à la fois | 90°, 45°, 45° |

## L’inégalité triangulaire
= Le plus grand côté < la somme des deux autres

| Les longueurs | Le verdict |
| 3, 4 et 9 | 3 + 4 = 7 < 9 → **impossible** |
| 3, 4 et 7 | 3 + 4 = 7 → les points sont **alignés** |

!> C’est la **première** vérification à faire avant toute construction.

## Les droites remarquables
| La droite | Sa définition | Son point de concours |
| **Médiatrice** | Perpendiculaire au milieu d’un côté | Centre du cercle **circonscrit** |
| **Hauteur** | Perpendiculaire au côté opposé | L’**orthocentre** |
| **Médiane** | Vers le milieu du côté opposé | Le **centre de gravité**, aux **deux tiers** depuis le sommet |
| **Bissectrice** | Partage un angle en deux | Centre du cercle **inscrit** |

## L’aire
= Aire = (base × hauteur) ÷ 2

La hauteur doit être celle **relative à la base choisie**. N’importe lequel des trois côtés peut servir de base.

> Dans un triangle **rectangle**, deux côtés sont déjà perpendiculaires : ils servent directement de base et de hauteur, sans rien tracer.`,
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
