// Mathématiques — Troisième : LE PROGRAMME COMPLET (14 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que CINQ chapitres de maths, hérités
// du tout premier jeu de données (migration 008, contenu rempli par la 113) :
// « Arithmétique », « Fonctions linéaires et affines », « Théorème de Thalès »,
// « Trigonométrie » et « Probabilités et statistiques ». Cinq fiches pour un
// programme qui en demande quatorze : rien sur les puissances et l'écriture
// scientifique, rien sur le calcul littéral et les équations, rien sur la sphère
// et la boule, rien sur les sections planes, rien sur l'homothétie, rien sur les
// triangles semblables — et une seule fiche pour les statistiques ET les
// probabilités, qui sont deux chapitres du brevet.
//
// LE DÉCOUPAGE. Les 3 chapitres de la maquette de référence, éclatés en leurs
// 14 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière —
// cf. docs/template-matiere.md.
//
// LES CINQ FICHES HÉRITÉES PARTENT (voir `menage`). Toutes les cinq sont
// recouvertes par le nouveau découpage : « Arithmétique » devient « Nombres
// premiers et fractions irréductibles », « Fonctions linéaires et affines » se
// scinde en trois fiches, « Théorème de Thalès » devient « Utiliser le théorème
// de Thalès », « Trigonométrie » devient « Trigonométrie dans un triangle
// rectangle » et « Probabilités et statistiques » se sépare en deux. Aucun titre
// hérité n'est repris À L'IDENTIQUE : le ménage ne peut donc pas mordre sur les
// fiches neuves à un rejeu.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (a × b, x², √n, ≈). C'est la convention du dossier, pas
// une facilité.
//
// ⚠️ Le slug `maths` porte désormais TROIS modules (`maths-tle.mjs` = 255,
// `maths-1re.mjs` = 271, celui-ci = 294) : ne JAMAIS générer avec
// `--slugs maths`, qui les fusionnerait et réécrirait deux migrations. Toujours
// `--modules maths-3e`.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 3e — LE PROGRAMME COMPLET (14 fiches)',

  motif: `CONSTAT : la Troisième n'avait que CINQ chapitres de maths, hérités du
premier jeu de données de l'app, pour un programme qui en demande quatorze. Un
élève de 3e qui révisait les puissances et l'écriture scientifique, le calcul
littéral, les équations, la sphère et la boule, les sections planes de solides,
l'homothétie ou les triangles semblables ne trouvait RIEN — et les statistiques
et les probabilités, deux chapitres distincts du brevet, tenaient dans une seule
fiche. Cette migration installe les 14 fiches, rangées sous leurs 3 chapitres,
et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 14 fiches sous 3 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 14 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Tous les cinq sont recouverts par le
nouveau découpage : "Arithmétique" devient "Nombres premiers et fractions
irréductibles", "Fonctions linéaires et affines" se scinde en trois fiches,
"Théorème de Thalès" devient "Utiliser le théorème de Thalès", "Trigonométrie"
devient "Trigonométrie dans un triangle rectangle", et "Probabilités et
statistiques" se sépare en deux chapitres distincts. Les garder ferait deux
objets voisins à deux places différentes, un en-tête de section et une ligne
dans la liste.
Aucun des cinq titres n'est repris à l'identique par une fiche neuve : le
ménage, qui tourne AVANT les insertions à chaque passage, ne peut donc pas
mordre sur le contenu neuf à un rejeu.
Le filtre level = '3e' est indispensable : "Trigonométrie" et "Probabilités et
statistiques" sont aussi des titres d'autres niveaux, et le ménage mordrait sur
le collège et le lycée.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.`,
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
   AND c.level = '3e'
   AND c.title IN ('Arithmétique',
                   'Fonctions linéaires et affines',
                   'Théorème de Thalès',
                   'Trigonométrie',
                   'Probabilités et statistiques');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '3e'
   AND c.title IN ('Arithmétique',
                   'Fonctions linéaires et affines',
                   'Théorème de Thalès',
                   'Trigonométrie',
                   'Probabilités et statistiques');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '3e'
   AND c.title IN ('Arithmétique',
                   'Fonctions linéaires et affines',
                   'Théorème de Thalès',
                   'Trigonométrie',
                   'Probabilités et statistiques');`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Nombres et calculs
        // ===================================================================
        {
          titre: 'Puissances d’un nombre et écriture scientifique',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Écrire très grand et très petit sans se tromper',
            cours: `Une puissance est une multiplication répétée : a puissance n vaut a × a × … × a, avec **n facteurs**.

## Les conventions à connaître
| L'écriture | Sa valeur |
| a¹ | a |
| a⁰ | **1**, pour tout a non nul |
| a⁻ⁿ | 1 / aⁿ : l'exposant négatif signifie « on divise » |

| L'exemple | Sa valeur |
| 10³ | 1 000 |
| 10⁻³ | 0,001 |

Pour les puissances de 10, l'exposant compte les zéros : 10⁶ s'écrit 1 suivi de six zéros, et 10⁻⁶ = 0,000 001, avec le 1 au sixième rang après la virgule.

## Les quatre règles de calcul
| L'opération | La règle | Ce qu'on fait aux exposants |
| aᵐ × aⁿ | aᵐ⁺ⁿ | On les **additionne** |
| aᵐ ÷ aⁿ | aᵐ⁻ⁿ | On les **soustrait** |
| (aᵐ)ⁿ | aᵐˣⁿ | On les **multiplie** |
| (a × b)ⁿ | aⁿ × bⁿ | On distribue |

> Ces règles ne fonctionnent qu'entre puissances **de même base**. 2³ × 5³ ne se simplifie pas en additionnant les exposants : il faut passer par (2 × 5)³ = 10³.

La règle du quotient explique la convention a⁰ = 1 : a³ ÷ a³ vaut 1, et la règle donne a³⁻³ = a⁰.

## L'écriture scientifique
Tout nombre s'écrit sous la forme **a × 10ⁿ**, où **1 ≤ a < 10** et n est un entier relatif.

| Le nombre | Son écriture scientifique |
| 45 300 | **4,53 × 10⁴** |
| 0,00072 | **7,2 × 10⁻⁴** |

| Le déplacement de la virgule | Le signe de l'exposant |
| Vers la **gauche** | **Positif** |
| Vers la **droite** | **Négatif** |

La méthode : placer la virgule après le premier chiffre non nul, puis compter les rangs franchis.

## Exemple résolu : un calcul à rendre en écriture scientifique
Calculer A = (6 × 10⁵) × (4 × 10⁻²).
1. On regroupe les nombres d'un côté, les puissances de 10 de l'autre : A = (6 × 4) × (10⁵ × 10⁻²).
2. On calcule : 6 × 4 = 24 et 10⁵ × 10⁻² = 10⁵⁻² = 10³, donc A = 24 × 10³.
3. 24 n'est pas entre 1 et 10 : on écrit 24 = 2,4 × 10¹, donc A = 2,4 × 10¹ × 10³ = **2,4 × 10⁴**.

## À quoi ça sert
| L'usage | Son exemple |
| **Comparer** | Le plus grand exposant l'emporte, si les deux sont bien en écriture scientifique |
| Écrire le très **grand** | Distance Terre-Soleil : 1,5 × 10⁸ km |
| Écrire le très **petit** | Taille d'un virus : 1 × 10⁻⁷ m |

## Les erreurs fréquentes
- Confondre 10⁻³ avec un nombre négatif : 10⁻³ = 0,001 est **positif**.
- Écrire 45,3 × 10³ : c'est juste, mais ce n'est **pas** l'écriture scientifique, car 45,3 dépasse 10.
- Multiplier les exposants au lieu de les additionner : 2⁵ × 2³ = 2⁸, pas 2¹⁵.

> Au brevet, ce chapitre revient dans les exercices de sciences (distances, tailles, masses) : on attend l'écriture scientifique du résultat et un calcul détaillé.`,
          },
          questions: [
            ['Que vaut a⁰ pour a non nul ?', ['1', '0', 'a', 'Cela n’existe pas'], 0, 'C’est une convention qui rend cohérente la règle a^m ÷ a^n = a^(m−n).'],
            ['Combien vaut 10⁻³ ?', ['0,001', '−1 000', '−0,001', '0,0001'], 0, 'L’exposant négatif signifie que l’on divise : 1 / 10³.'],
            ['Que vaut 2⁵ × 2³ ?', ['2⁸', '2¹⁵', '4⁸', '2²'], 0, 'Même base : on additionne les exposants.'],
            ['Que vaut (3²)⁴ ?', ['3⁸', '3⁶', '9⁴', '3¹⁶'], 0, 'Puissance d’une puissance : on multiplie les exposants.'],
            ['Quelle est l’écriture scientifique de 45 300 ?', ['4,53 × 10⁴', '45,3 × 10³', '4,53 × 10⁵', '0,453 × 10⁵'], 0, 'Le premier facteur doit être compris entre 1 et 10.'],
            ['Quelle est l’écriture scientifique de 0,00072 ?', ['7,2 × 10⁻⁴', '7,2 × 10⁻³', '72 × 10⁻⁵', '0,72 × 10⁻³'], 0, 'La virgule se déplace de 4 rangs vers la droite : exposant −4.'],
            ['Dans une écriture scientifique a × 10^n, quelle condition porte sur a ?', ['1 ≤ a < 10', '0 < a < 1', 'a doit être entier', 'a doit être négatif'], 0, 'C’est ce qui rend l’écriture unique pour chaque nombre.'],
            ['La règle a^m × a^n = a^(m+n) s’applique à des puissances de bases différentes.', ['Vrai', 'Faux'], 1, 'Elle exige la même base : 2³ × 5³ se traite avec (2 × 5)³.'],
          ],
        },
        {
          titre: 'Nombres premiers et fractions irréductibles',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Décomposer pour simplifier',
            cours: `Un nombre premier est un entier supérieur à 1 qui n'a que deux diviseurs : 1 et lui-même.

## Les premiers nombres premiers
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37…

| Le point d'attention | Sa raison |
| **2** est le seul premier **pair** | Tous les autres pairs sont divisibles par 2 |
| **1 n'est pas premier** | Il n'a qu'**un seul** diviseur |

Pour savoir si un nombre est premier, on teste sa divisibilité par 2, 3, 5, 7, 11… et on s'arrête dès que le carré du diviseur testé dépasse le nombre. Exemple : 97 n'est divisible ni par 2, ni par 3, ni par 5, ni par 7, et 11² = 121 dépasse 97 : **97 est premier**.

## Les critères de divisibilité
| Le diviseur | Le critère |
| **2** | Le nombre se termine par 0, 2, 4, 6 ou 8 |
| **3** | La somme de ses chiffres est divisible par 3 |
| **5** | Il se termine par 0 ou 5 |
| **9** | La somme de ses chiffres est divisible par 9 |
| **10** | Il se termine par 0 |

## La décomposition en facteurs premiers
Tout entier supérieur à 1 s'écrit d'**une seule façon** comme produit de nombres premiers. On divise successivement par 2, puis 3, puis 5…

| L'étape | Le résultat |
| 180 | 2 × 90 |
| 90 | 2 × 45 |
| 45 | 3 × 15 |
| 15 | 3 × 5 |
| **Total** | **2² × 3² × 5** |

De même, 45 = 3² × 5 : ses diviseurs premiers sont **3 et 5**, et eux seuls.

## Rendre une fraction irréductible
Une fraction est **irréductible** quand numérateur et dénominateur n'ont **aucun diviseur commun** autre que 1.

| L'étape | Le calcul |
| Décomposer le numérateur | 126 = 2 × 3² × 7 |
| Décomposer le dénominateur | 180 = 2² × 3² × 5 |
| Simplifier par les facteurs communs | 2 × 3² = 18 |
| Le résultat | **7/10** |

> Simplifier n'est pas « enlever des chiffres » : c'est **diviser le haut et le bas** par le même nombre.

## Exemple résolu : un problème de partage
Un fleuriste a 84 roses et 60 tulipes. Il veut faire le plus grand nombre de bouquets identiques en utilisant toutes ses fleurs.
1. On décompose : 84 = 2² × 3 × 7 et 60 = 2² × 3 × 5.
2. Les facteurs communs sont 2² × 3 = 12 : il fait **12 bouquets**.
3. Chaque bouquet contient 84 ÷ 12 = 7 roses et 60 ÷ 12 = 5 tulipes.

## Les erreurs fréquentes
- Dire que 1 est premier, ou qu'un nombre impair est forcément premier (9, 15, 21 ne le sont pas).
- Arrêter la décomposition trop tôt : 4 × 45 n'est pas une décomposition en facteurs **premiers**.
- Simplifier par un facteur qui n'est pas commun aux deux décompositions.

## Pourquoi c'est utile
Une fraction irréductible est la forme la plus simple d'un quotient : c'est celle qu'attend le brevet, et celle qui rend deux fractions comparables d'un coup d'œil.`,
          },
          questions: [
            ['Qu’est-ce qu’un nombre premier ?', ['Un entier supérieur à 1 qui n’a que deux diviseurs : 1 et lui-même', 'Un entier impair', 'Un entier divisible par 2 seulement', 'Le plus petit entier d’une liste'], 0, '1 n’est pas premier : il n’a qu’un seul diviseur.'],
            ['Quel est le seul nombre premier pair ?', ['2', '4', '0', 'Il n’y en a pas'], 0, 'Tout autre nombre pair est divisible par 2 en plus de 1 et de lui-même.'],
            ['Quelle est la décomposition en facteurs premiers de 180 ?', ['2² × 3² × 5', '2 × 3 × 5 × 6', '4 × 45', '2³ × 3 × 5'], 0, 'On divise successivement : 180 = 2 × 90 = 2 × 2 × 45 = 2² × 3² × 5.'],
            ['Comment reconnaît-on qu’un nombre est divisible par 3 ?', ['La somme de ses chiffres est divisible par 3', 'Il se termine par 3', 'Il est impair', 'Il se termine par 0 ou 5'], 0, 'Exemple : 261 → 2 + 6 + 1 = 9, donc 261 est divisible par 3.'],
            ['Qu’est-ce qu’une fraction irréductible ?', ['Une fraction dont numérateur et dénominateur n’ont aucun diviseur commun autre que 1', 'Une fraction dont le numérateur est premier', 'Une fraction inférieure à 1', 'Une fraction qui ne se calcule pas'], 0, 'C’est la forme la plus simple du quotient.'],
            ['Quelle est la forme irréductible de 126/180 ?', ['7/10', '63/90', '14/20', '21/30'], 0, 'On simplifie par 18 = 2 × 3², le facteur commun aux deux décompositions.'],
            ['Combien 45 a-t-il de diviseurs premiers distincts ?', ['Deux : 3 et 5', 'Un seul : 5', 'Trois : 1, 3 et 5', 'Aucun'], 0, '45 = 3² × 5 : les facteurs premiers sont 3 et 5.'],
            ['La décomposition en facteurs premiers d’un entier peut s’écrire de plusieurs façons différentes.', ['Vrai', 'Faux'], 1, 'Elle est unique, à l’ordre des facteurs près : c’est ce qui la rend si utile.'],
          ],
        },
        {
          titre: 'Calcul littéral et équation',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Développer, factoriser, résoudre',
            cours: `Le calcul littéral manipule des lettres qui représentent des nombres. Trois gestes suffisent au brevet.

## Développer
On transforme un **produit** en **somme**.

| La règle | Son écriture |
| Simple distributivité | k(a + b) = **ka + kb** |
| Double distributivité | (a + b)(c + d) = **ac + ad + bc + bd** |

| L'identité remarquable | Son développement |
| (a + b)² | a² + **2ab** + b² |
| (a − b)² | a² − **2ab** + b² |
| (a + b)(a − b) | a² − b² |

Exemple : (2x + 3)(x − 4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.

## Factoriser
L'opération inverse : on transforme une **somme** en **produit**.

| L'expression | Sa forme factorisée | Ce qu'on a repéré |
| 5x + 15 | **5(x + 3)** | Un **facteur commun** |
| x² − 9 | **(x + 3)(x − 3)** | Une **identité remarquable** |

Pour vérifier une factorisation, on redéveloppe : 5(x + 3) redonne bien 5x + 15.

## Réduire
On regroupe les termes de même nature.

| L'expression | Sa forme réduite |
| 3x + 5 + 2x − 1 | **5x + 4** |
| 3x et 3x² | Ils ne se regroupent **jamais** |

## Résoudre une équation
> La règle d'or : ce qu'on fait d'un côté, on le fait de l'autre.

| L'étape | Le calcul |
| L'équation | 4x + 3 = 19 |
| Retirer 3 des deux côtés | 4x = 16 |
| Diviser par 4 | **x = 4** |

La méthode quand l'inconnue est des deux côtés :
1. Développer et réduire chaque membre.
2. Regrouper les termes en x d'un côté, les nombres de l'autre, en faisant la même opération des deux côtés.
3. Diviser par le coefficient de x.
4. Vérifier.

Exemple résolu : 5x − 7 = 2x + 8. On retire 2x des deux côtés : 3x − 7 = 8. On ajoute 7 : 3x = 15. On divise par 3 : **x = 5**. Vérification : 5 × 5 − 7 = 18 et 2 × 5 + 8 = 18.

## L'équation produit nul
Si **A × B = 0**, alors **A = 0 ou B = 0**.

| L'équation | Ses solutions |
| (x − 2)(x + 5) = 0 | **2** et **−5** |

Pour x² − 9 = 0, on factorise d'abord : (x + 3)(x − 3) = 0, donc x = −3 ou x = 3.

> Toujours **vérifier** sa solution en la remplaçant dans l'équation de départ : c'est un point gratuit au brevet.

## Les erreurs fréquentes
- Oublier le double produit : (x + 3)² n'est pas x² + 9, c'est x² + 6x + 9.
- Mal distribuer un signe moins : −(x − 4) = −x + 4.
- Garder le signe en changeant de membre : en « passant » +3 de l'autre côté, il devient −3, parce qu'on a retiré 3 aux deux membres.`,
          },
          questions: [
            ['Que donne le développement de (a + b)² ?', ['a² + 2ab + b²', 'a² + b²', 'a² − 2ab + b²', '2a + 2b'], 0, 'Le double produit 2ab est l’erreur la plus fréquente à l’oubli.'],
            ['Que donne le développement de (a + b)(a − b) ?', ['a² − b²', 'a² + b²', 'a² − 2ab + b²', 'a² − ab − b²'], 0, 'Les termes en ab se compensent.'],
            ['Quelle est la forme factorisée de x² − 9 ?', ['(x + 3)(x − 3)', '(x − 9)(x + 1)', '(x − 3)²', 'x(x − 9)'], 0, 'C’est l’identité a² − b² avec b = 3.'],
            ['Quelle est la forme factorisée de 5x + 15 ?', ['5(x + 3)', '5x(1 + 3)', '(5 + x)(5 + 15)', '5 + (x × 15)'], 0, 'On met en facteur le nombre commun aux deux termes.'],
            ['Quelle est la solution de 4x + 3 = 19 ?', ['x = 4', 'x = 5,5', 'x = 16', 'x = 3'], 0, 'On retire 3 des deux côtés, puis on divise par 4.'],
            ['Quelles sont les solutions de (x − 2)(x + 5) = 0 ?', ['2 et −5', '−2 et 5', '2 et 5', '0 seulement'], 0, 'Un produit est nul si et seulement si l’un de ses facteurs est nul.'],
            ['Comment réduire 3x + 5 + 2x − 1 ?', ['5x + 4', '5x + 6', '6x + 4', '10x'], 0, 'On regroupe les termes en x d’un côté, les nombres de l’autre.'],
            ['Dans une équation, on peut ajouter un nombre d’un seul côté du signe égal.', ['Vrai', 'Faux'], 1, 'Toute opération doit être faite des deux côtés, sinon l’égalité est rompue.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Organisation et gestion de données – Fonctions
        // ===================================================================
        {
          titre: 'Caractéristiques d’une série statistique',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'Moyenne, médiane, étendue : résumer une série',
            cours: `Une série statistique est une liste de valeurs recueillies sur une population. Trois indicateurs suffisent à la résumer en 3e.

## Les trois indicateurs
| L'indicateur | Ce qu'il mesure | Sa sensibilité aux extrêmes |
| La **moyenne** | Le niveau moyen | **Forte** |
| La **médiane** | Le milieu de la série ordonnée | **Aucune** |
| L'**étendue** | La **dispersion** | Maximale : elle ne dépend que d'eux |

## La moyenne
On additionne toutes les valeurs et on divise par leur nombre.

| L'exemple | Le calcul |
| Notes 8, 12, 12, 16, 17 | (8 + 12 + 12 + 16 + 17) ÷ 5 = 65 ÷ 5 = **13** |

Avec des **effectifs**, on calcule une **moyenne pondérée** : chaque valeur multipliée par son effectif, divisée par l'effectif **total**.

La moyenne n'est pas forcément une valeur de la série : ici, personne n'a eu 13.

## La médiane
Elle partage la série ordonnée en **deux groupes de même effectif**.

| L'étape | Ce qu'on fait |
| 1 | **Ranger** les valeurs dans l'ordre croissant |
| Effectif **impair** | C'est la valeur du **milieu** |
| Effectif **pair** | La **moyenne des deux** valeurs centrales |

> La médiane résiste aux valeurs extrêmes, pas la moyenne. Un seul salaire très élevé tire la moyenne vers le haut sans bouger la médiane : c'est pour cela qu'on parle du salaire **médian**.

## L'étendue
La **différence** entre la plus grande et la plus petite valeur : 17 − 8 = **9**.

## Lire un tableau d'effectifs
| Le terme | Sa définition |
| L'**effectif** d'une valeur | Le nombre de fois où elle apparaît |
| La **fréquence** | Effectif ÷ effectif total, souvent en pourcentage |
| La somme des fréquences | Toujours **1**, ou 100 % |

## Exemple résolu avec un tableau d'effectifs
Nombre de frères et sœurs dans une classe : 0 (5 élèves), 1 (9 élèves), 2 (4 élèves), 3 (2 élèves).
1. Effectif total : 5 + 9 + 4 + 2 = 20.
2. Moyenne : (0 × 5 + 1 × 9 + 2 × 4 + 3 × 2) ÷ 20 = 23 ÷ 20 = **1,15**.
3. Médiane : l'effectif est pair, on prend la moyenne de la 10e et de la 11e valeur. Les 5 premières valent 0, les suivantes jusqu'à la 14e valent 1 : la médiane vaut **1**.
4. Étendue : 3 − 0 = **3**. Fréquence de la valeur 1 : 9 ÷ 20 = 0,45, soit **45 %**.

## Les erreurs fréquentes
- Chercher la médiane sans avoir rangé la série.
- Oublier les effectifs : la moyenne de ce tableau n'est pas (0 + 1 + 2 + 3) ÷ 4.
- Confondre la position de la médiane (la 10e valeur) et sa valeur (1).

> Au brevet, on demande souvent de calculer ces indicateurs à partir d'un tableur ou d'un diagramme, puis d'interpréter : « au moins la moitié des élèves ont… » se justifie par la médiane.`,
          },
          questions: [
            ['Comment calcule-t-on la moyenne d’une série ?', ['On additionne les valeurs et on divise par leur nombre', 'On prend la valeur du milieu', 'On soustrait la plus petite valeur à la plus grande', 'On prend la valeur la plus fréquente'], 0, 'Avec des effectifs, chaque valeur est multipliée par son effectif.'],
            ['Que faut-il faire avant de chercher la médiane ?', ['Ranger les valeurs dans l’ordre croissant', 'Calculer la moyenne', 'Supprimer les valeurs extrêmes', 'Convertir les valeurs en pourcentages'], 0, 'Sans classement, la valeur du milieu n’a aucun sens.'],
            ['Quelle est la médiane de la série 8, 12, 12, 16, 17 ?', ['12', '13', '16', '14'], 0, 'Cinq valeurs rangées : la troisième partage la série en deux.'],
            ['Quelle est l’étendue de la série 8, 12, 12, 16, 17 ?', ['9', '13', '17', '5'], 0, 'Étendue = plus grande valeur − plus petite valeur.'],
            ['Comment calcule-t-on la médiane quand l’effectif est pair ?', ['On prend la moyenne des deux valeurs centrales', 'On prend la plus grande des deux valeurs centrales', 'On arrondit l’effectif à l’impair supérieur', 'La médiane n’existe pas'], 0, 'Exemple : sur 8 valeurs, c’est la moyenne de la 4e et de la 5e.'],
            ['Quel indicateur résiste le mieux à une valeur extrême ?', ['La médiane', 'La moyenne', 'L’étendue', 'L’effectif total'], 0, 'C’est pourquoi on parle du salaire médian plutôt que du salaire moyen.'],
            ['Comment calcule-t-on la fréquence d’une valeur ?', ['Effectif de la valeur ÷ effectif total', 'Effectif total ÷ effectif de la valeur', 'Valeur × effectif', 'Effectif − effectif total'], 0, 'La somme de toutes les fréquences vaut 1, soit 100 %.'],
            ['La moyenne d’une série est toujours l’une des valeurs de la série.', ['Vrai', 'Faux'], 1, 'Elle peut très bien ne correspondre à aucune valeur observée.'],
          ],
        },
        {
          titre: 'Les probabilités',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'Mesurer la chance qu’un événement se produise',
            cours: `Une expérience aléatoire est une expérience dont on ne peut pas prévoir le résultat.

## Le vocabulaire
| Le terme | Sa définition |
| Une **issue** | Un résultat possible : obtenir 5 avec un dé |
| Un **événement** | Un ensemble d'issues : « obtenir un nombre pair » |
| La **probabilité** | Un nombre entre **0 et 1** |

| La valeur | Ce qu'elle signifie |
| **0** | Événement **impossible** |
| **1** | Événement **certain** |

Une probabilité peut s'écrire en fraction (1/4), en décimal (0,25) ou en pourcentage (25 %) : c'est le même nombre.

## Le calcul dans le cas équiprobable
Quand toutes les issues ont la même chance :

P(A) = nombre d'issues **favorables** ÷ nombre d'issues **possibles**

| L'exemple | Le calcul |
| « Nombre pair » avec un dé à six faces | 3/6 = **1/2** |

La méthode :
1. Lister toutes les issues possibles et vérifier qu'elles sont équiprobables.
2. Compter les issues qui réalisent l'événement.
3. Faire le quotient, puis simplifier.

## L'événement contraire
P(non A) = 1 − P(A)

> C'est souvent le chemin le plus court : « **au moins un** » se calcule presque toujours par le contraire, « aucun ».

## Les expériences à deux épreuves
| L'outil | Comment on l'utilise |
| L'**arbre** | On **multiplie** le long d'une branche |
| Le **tableau à double entrée** | On croise les deux épreuves |
| Pour un événement | On **additionne** les branches qui conviennent |

## Exemple résolu
Une urne contient 3 boules rouges et 2 vertes. On tire une boule, on la remet, on en tire une seconde.
1. Au premier tirage : P(rouge) = 3/5 et P(verte) = 2/5.
2. P(deux rouges) = 3/5 × 3/5 = **9/25**, en multipliant le long de la branche.
3. P(au moins une verte) = 1 − P(deux rouges) = 1 − 9/25 = **16/25**, par l'événement contraire.
4. P(deux boules de même couleur) = 9/25 + 2/5 × 2/5 = 9/25 + 4/25 = **13/25**, en additionnant deux branches.

> La probabilité ne prédit pas le prochain lancer. Elle dit ce qui se passe **sur un grand nombre** de répétitions : c'est la loi des grands nombres, qui rapproche la fréquence observée de la probabilité théorique.

## Les erreurs fréquentes
- Croire que le hasard « compense » : une pièce tombée cinq fois sur pile a toujours une chance sur deux de tomber sur face. Elle n'a pas de mémoire.
- Trouver une probabilité supérieure à 1 ou négative : c'est forcément une erreur de calcul.
- Additionner le long d'une branche au lieu de multiplier.

> Au brevet, les probabilités tombent presque chaque année : urnes, dés, roues de loterie, souvent avec une question « le jeu est-il équitable ? ».`,
          },
          questions: [
            ['Entre quelles valeurs une probabilité est-elle toujours comprise ?', ['Entre 0 et 1', 'Entre −1 et 1', 'Entre 0 et 100', 'Entre 1 et 10'], 0, '0 = impossible, 1 = certain.'],
            ['Comment calcule-t-on une probabilité dans le cas équiprobable ?', ['Nombre d’issues favorables ÷ nombre d’issues possibles', 'Nombre d’issues possibles ÷ nombre d’issues favorables', 'Nombre d’issues favorables × nombre d’essais', 'Nombre d’essais ÷ 100'], 0, 'Le cas équiprobable suppose que toutes les issues ont la même chance.'],
            ['Quelle est la probabilité d’obtenir un nombre pair avec un dé à six faces ?', ['1/2', '1/3', '1/6', '2/3'], 0, 'Trois issues favorables (2, 4, 6) sur six possibles.'],
            ['Comment se calcule la probabilité de l’événement contraire de A ?', ['1 − P(A)', 'P(A) − 1', '1 ÷ P(A)', '100 − P(A)'], 0, 'Un événement et son contraire couvrent toutes les issues.'],
            ['Que vaut la probabilité d’un événement impossible ?', ['0', '1', '0,5', 'Cela dépend de l’expérience'], 0, 'Aucune issue favorable : le quotient vaut 0.'],
            ['Comment représente-t-on une expérience à deux épreuves ?', ['Par un arbre de probabilités ou un tableau à double entrée', 'Par un diagramme en bâtons', 'Par une droite graduée', 'Par un histogramme'], 0, 'On multiplie le long d’une branche, on additionne les branches favorables.'],
            ['Que dit la loi des grands nombres ?', ['La fréquence observée se rapproche de la probabilité quand on répète beaucoup l’expérience', 'Le prochain résultat est prévisible', 'Toutes les issues finissent par sortir le même nombre de fois exactement', 'La probabilité change à chaque essai'], 0, 'Elle relie l’expérience et la théorie sans rien prédire d’un lancer isolé.'],
            ['Si une pièce est tombée cinq fois sur pile, la probabilité d’obtenir face au sixième lancer augmente.', ['Vrai', 'Faux'], 1, 'La pièce n’a pas de mémoire : elle reste à 1/2 à chaque lancer.'],
          ],
        },
        {
          titre: 'Comprendre et utiliser la notion de fonction',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'Une machine qui transforme un nombre en un autre',
            cours: `Une fonction est un procédé qui, à un nombre, associe un seul autre nombre. On note f : x ↦ f(x).

## Le vocabulaire
| Le terme | Ce qu'il désigne |
| x | L'**antécédent** |
| f(x) | L'**image** de x par f |
| « f(3) = 7 » | L'image de 3 est 7, et 3 est **un** antécédent de 7 |

> Un nombre a **une seule image**, mais un nombre peut avoir **plusieurs antécédents** — ou aucun. C'est la dissymétrie la plus souvent oubliée.

Exemple avec g(x) = x² : g(3) = 9 et g(−3) = 9, donc 9 a deux antécédents, 3 et −3 ; et −4 n'en a aucun, car un carré n'est jamais négatif.

## Les deux calculs
| Le calcul | Ce qu'on fait | Un exemple avec f(x) = 2x + 5 |
| Une **image** | On **remplace** x par sa valeur | f(3) = 2 × 3 + 5 = **11** |
| Un **antécédent** | On **résout une équation** | 2x + 5 = 17 donne x = **6** |

## Les trois représentations
| La représentation | Ce qu'elle donne |
| Une **formule** | f(x) = 2x + 5 |
| Un **tableau de valeurs** | La ligne du haut : les antécédents ; celle du bas : les images |
| Une **courbe** | Chaque point a pour coordonnées (x ; f(x)) |

## Lire un graphique
| Ce qu'on cherche | Le trajet du regard |
| L'**image** de 3 | Partir de 3 en **abscisse**, monter jusqu'à la courbe, lire en **ordonnée** |
| L'**antécédent** de 7 | Partir de 7 en **ordonnée**, aller horizontalement jusqu'à la courbe, lire en **abscisse** |

> Il peut y avoir **plusieurs** antécédents : la lecture horizontale peut couper la courbe en plusieurs points.

## Exemple résolu
Soit h(x) = 3x − 4.
1. Image de −2 : h(−2) = 3 × (−2) − 4 = −6 − 4 = **−10**.
2. Antécédent de 11 : on résout 3x − 4 = 11, soit 3x = 15, donc **x = 5**.
3. Le point A(2 ; 3) est-il sur la courbe ? h(2) = 3 × 2 − 4 = 2, et non 3 : **A n'est pas sur la courbe**.

Pour tester si un point est sur une courbe, on calcule l'image de son abscisse et on la compare à son ordonnée.

## Les erreurs fréquentes
- Inverser image et antécédent dans la phrase réponse.
- Lire un graphique dans le mauvais sens : pour une image, on part toujours de l'axe horizontal.
- Oublier les parenthèses autour d'un nombre négatif : avec g(x) = x², g(−3) = (−3)² = 9.

> Au brevet, on rencontre la fonction sous ses trois formes, souvent dans un même exercice avec un tableur : savoir passer de l'une à l'autre est l'objectif du chapitre.`,
          },
          questions: [
            ['Qu’est-ce qu’une fonction ?', ['Un procédé qui associe à un nombre un seul autre nombre', 'Une égalité entre deux expressions', 'Une suite de nombres ordonnés', 'Un tableau de proportionnalité'], 0, 'À chaque antécédent correspond une image unique.'],
            ['Dans f(3) = 7, comment appelle-t-on le nombre 7 ?', ['L’image de 3', 'L’antécédent de 3', 'Le coefficient', 'L’ordonnée à l’origine'], 0, 'Et 3 est un antécédent de 7.'],
            ['Pour f(x) = 2x + 5, que vaut f(3) ?', ['11', '10', '16', '8'], 0, 'On remplace x par 3 : 2 × 3 + 5.'],
            ['Comment cherche-t-on un antécédent ?', ['En résolvant une équation', 'En remplaçant x par sa valeur', 'En calculant la moyenne des images', 'En traçant la tangente'], 0, 'Chercher l’antécédent de 17 par f(x) = 2x + 5, c’est résoudre 2x + 5 = 17.'],
            ['Sur un graphique, comment lit-on l’image d’un nombre ?', ['On part de l’axe des abscisses, on monte jusqu’à la courbe, on lit en ordonnée', 'On part de l’axe des ordonnées et on lit en abscisse', 'On lit la pente de la courbe', 'On calcule l’aire sous la courbe'], 0, 'Le chemin inverse donne les antécédents.'],
            ['Combien d’images un nombre peut-il avoir par une fonction ?', ['Une seule', 'Autant qu’on veut', 'Deux au maximum', 'Aucune, toujours'], 0, 'C’est la définition même d’une fonction.'],
            ['Quelles sont les coordonnées d’un point de la courbe de f ?', ['(x ; f(x))', '(f(x) ; x)', '(x ; x)', '(0 ; f(x))'], 0, 'L’abscisse est l’antécédent, l’ordonnée est l’image.'],
            ['Un nombre peut avoir plusieurs antécédents par une même fonction.', ['Vrai', 'Faux'], 0, 'Rien ne l’interdit : c’est l’image qui doit être unique, pas l’antécédent.'],
          ],
        },
        {
          titre: 'Fonction linéaire et proportionnalité',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'La proportionnalité, écrite comme une fonction',
            cours: `Une fonction linéaire est de la forme f(x) = a x, où a est le coefficient de proportionnalité.

## Le lien avec la proportionnalité
| Le fait | Sa conséquence |
| Une fonction linéaire traduit une **situation de proportionnalité** | Si x double, f(x) double |
| Le coefficient | a = f(x) ÷ x, pour x non nul |
| Une seule valeur non nulle | Elle suffit à déterminer toute la fonction |

## La représentation graphique
| Le trait | Ce qu'il signifie |
| Une **droite** | La fonction est linéaire ou affine |
| Elle passe par l'**origine** | La signature de la **proportionnalité** |
| Elle ne passe **pas** par (0 ; 0) | La situation **n'est pas** proportionnelle |

Le coefficient a est la **pente** : en avançant de 1 vers la droite, on monte de a.

Pour tracer la droite, un seul point suffit en plus de l'origine : avec f(x) = 1,5x, on place (0 ; 0) et (2 ; 3), puis on trace.

## Les pourcentages, cas particulier
| L'opération | Le coefficient multiplicateur |
| Prendre **t %** | t/100 — la fonction x ↦ 0,2x donne 20 % de x |
| **Augmenter** de 15 % | ×**1,15** |
| **Diminuer** de 15 % | ×**0,85** |

| L'enchaînement | Le calcul | Le résultat |
| +10 % puis +10 % | 1,1 × 1,1 = 1,21 | **+21 %**, et non +20 % |
| −20 % puis +20 % | 0,8 × 1,2 = 0,96 | **−4 %**, et non le retour au départ |

> Les pourcentages ne s'additionnent jamais : les **coefficients se multiplient**.

## Reconnaître une fonction linéaire
| L'indice | Ce qu'on vérifie |
| La **formule** | De la forme a x, **sans terme constant** |
| Le **tableau** | Le quotient f(x) ÷ x est **constant** |
| Le **graphique** | Une droite passant par l'**origine** |

## Exemple résolu
Un article coûte 80 €. Il est soldé à −25 %, puis augmenté de 10 %.
1. Coefficient de la baisse : 1 − 0,25 = 0,75. Coefficient de la hausse : 1 + 0,10 = 1,10.
2. Coefficient global : 0,75 × 1,10 = 0,825. Le prix final est 80 × 0,825 = **66 €**.
3. 0,825 = 1 − 0,175 : l'évolution globale est une **baisse de 17,5 %**, et non de 15 %.

Autre exemple : f est linéaire et f(4) = 10. Alors a = 10 ÷ 4 = 2,5, donc f(x) = 2,5x et f(6) = **15**.

## Les erreurs fréquentes
- Multiplier par 0,15 pour augmenter de 15 % : on obtient seulement la hausse, pas le nouveau prix.
- Additionner des pourcentages successifs.
- Déclarer proportionnelle une situation représentée par une droite qui ne passe pas par l'origine.

> Au brevet, la proportionnalité se démontre par le graphique (droite par l'origine) ou par le tableau (quotients égaux) : il faut citer l'argument, pas seulement conclure.`,
          },
          questions: [
            ['Quelle est la forme d’une fonction linéaire ?', ['f(x) = a x', 'f(x) = a x + b avec b non nul', 'f(x) = x²', 'f(x) = a ÷ x'], 0, 'Aucun terme constant : c’est ce qui la distingue de la fonction affine.'],
            ['Que représente graphiquement une fonction linéaire ?', ['Une droite passant par l’origine du repère', 'Une droite quelconque', 'Une parabole', 'Une courbe passant par (0 ; 1)'], 0, 'Le passage par l’origine est la signature de la proportionnalité.'],
            ['Comment calcule-t-on le coefficient d’une fonction linéaire ?', ['a = f(x) ÷ x, pour x non nul', 'a = x ÷ f(x)', 'a = f(x) − x', 'a = f(0)'], 0, 'Une seule valeur non nulle suffit à déterminer la fonction.'],
            ['Par quel nombre multiplie-t-on pour augmenter une valeur de 15 % ?', ['1,15', '0,15', '15', '0,85'], 0, 'Diminuer de 15 % reviendrait à multiplier par 0,85.'],
            ['Une hausse de 10 % suivie d’une autre hausse de 10 % correspond à quelle hausse totale ?', ['+21 %', '+20 %', '+11 %', '+100 %'], 0, '1,1 × 1,1 = 1,21 : les pourcentages se multiplient, ils ne s’additionnent pas.'],
            ['Quelle fonction donne 20 % d’un nombre ?', ['x ↦ 0,2x', 'x ↦ 20x', 'x ↦ x + 0,2', 'x ↦ x ÷ 20'], 0, 'Prendre t % revient à multiplier par t/100.'],
            ['Que représente le coefficient a sur le graphique ?', ['La pente de la droite', 'Le point d’intersection avec l’axe des ordonnées', 'L’aire sous la droite', 'La longueur du segment tracé'], 0, 'En avançant de 1 en abscisse, on monte de a.'],
            ['Une baisse de 20 % suivie d’une hausse de 20 % ramène au prix de départ.', ['Vrai', 'Faux'], 1, '0,8 × 1,2 = 0,96 : il manque 4 %.'],
          ],
        },
        {
          titre: 'Les fonctions affines',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'a x + b : la droite qui ne passe plus par l’origine',
            cours: `Une fonction affine est de la forme f(x) = a x + b, où a et b sont deux nombres fixes.

| Le coefficient | Son nom | Ce qu'il est |
| **a** | Le **coefficient directeur** | La pente |
| **b** | L'**ordonnée à l'origine** | C'est f(0) |

## Deux cas particuliers
| La condition | La fonction | Sa droite |
| **b = 0** | Elle est **linéaire** | Elle passe par l'origine |
| **a = 0** | Elle est **constante** | Elle est horizontale |

> Toute fonction linéaire est affine ; l'inverse est faux.

## La représentation graphique
| Le signe de a | La droite |
| **Positif** | Elle **monte** |
| **Négatif** | Elle **descend** |
| Plus sa valeur absolue est grande | Plus la droite est **raide** |

Elle coupe l'axe des ordonnées au point (0 ; b).

Pour la tracer : 1. placer (0 ; b) ; 2. calculer une autre image, par exemple f(2) ; 3. placer ce second point et tracer la droite. Avec f(x) = −2x + 3 : on place (0 ; 3) et (2 ; −1).

## Déterminer a et b à partir de deux points
a = (f(x₂) − f(x₁)) ÷ (x₂ − x₁)

| L'étape | Le calcul, avec f(1) = 5 et f(3) = 11 |
| Calculer a | (11 − 5) ÷ (3 − 1) = **3** |
| Trouver b | 5 = 3 × 1 + b, donc b = **2** |
| La fonction | **f(x) = 3x + 2** |

> Une fonction affine n'est **pas** une situation de proportionnalité, sauf si b = 0 : un forfait de 15 € plus 2 € par heure ne double pas quand les heures doublent.

## Exemple résolu : comparer deux offres
Un club propose deux tarifs : offre A, 6 € la séance ; offre B, un abonnement de 30 € puis 3,50 € la séance.
1. On modélise : A(x) = 6x, fonction linéaire ; B(x) = 3,5x + 30, fonction affine.
2. On cherche quand les prix sont égaux : 6x = 3,5x + 30, donc 2,5x = 30 et **x = 12**.
3. Pour 12 séances, les deux offres coûtent 72 €. En dessous, l'offre A est moins chère ; au-delà, c'est l'offre B.

Sur le graphique, x = 12 est l'abscisse du point d'intersection des deux droites.

## Les usages du brevet
| La situation | Ce qu'on cherche |
| Tarifs à abonnement | Comparer deux offres |
| Distance avec une avance de départ | Le moment du rattrapage |
| Deux droites tracées | Leur **point d'intersection** |
| Deux formules | L'équation qui les égalise |

## Les erreurs fréquentes
- Inverser a et b : dans 3x + 2, la pente est 3, l'ordonnée à l'origine est 2.
- Calculer a avec les différences dans un ordre différent en haut et en bas.
- Lire l'ordonnée à l'origine ailleurs que sur l'axe des ordonnées.`,
          },
          questions: [
            ['Quelle est la forme d’une fonction affine ?', ['f(x) = a x + b', 'f(x) = a x seulement', 'f(x) = x² + b', 'f(x) = a ÷ (x + b)'], 0, 'a est le coefficient directeur, b l’ordonnée à l’origine.'],
            ['Que représente b dans f(x) = a x + b ?', ['L’ordonnée à l’origine, c’est-à-dire f(0)', 'La pente de la droite', 'L’abscisse du point d’intersection avec l’axe des x', 'Le coefficient de proportionnalité'], 0, 'La droite coupe l’axe des ordonnées au point (0 ; b).'],
            ['Que se passe-t-il quand a est négatif ?', ['La droite descend', 'La droite monte', 'La droite est horizontale', 'La droite passe par l’origine'], 0, 'Le signe de a donne le sens de variation.'],
            ['Pour f(1) = 5 et f(3) = 11, que vaut le coefficient directeur ?', ['3', '2', '6', '5'], 0, 'a = (11 − 5) ÷ (3 − 1) = 6 ÷ 2.'],
            ['Pour f(1) = 5 et f(3) = 11, quelle est l’expression de f ?', ['f(x) = 3x + 2', 'f(x) = 3x', 'f(x) = 2x + 3', 'f(x) = 5x − 2'], 0, 'Une fois a = 3 trouvé, on remplace : 5 = 3 × 1 + b donne b = 2.'],
            ['Que devient une fonction affine quand a = 0 ?', ['Une fonction constante, représentée par une droite horizontale', 'Une fonction linéaire', 'Une fonction du second degré', 'Elle n’existe plus'], 0, 'f(x) = b pour toute valeur de x.'],
            ['Comment compare-t-on graphiquement deux offres tarifaires modélisées par deux fonctions affines ?', ['En cherchant le point d’intersection des deux droites', 'En comparant leurs ordonnées à l’origine seulement', 'En calculant l’aire entre les deux droites', 'En traçant la médiatrice des deux droites'], 0, 'Avant l’intersection une offre est plus avantageuse, après c’est l’autre.'],
            ['Toute fonction affine traduit une situation de proportionnalité.', ['Vrai', 'Faux'], 1, 'Seulement si b = 0 : sinon un abonnement fixe casse la proportionnalité.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Espace et géométrie
        // ===================================================================
        {
          titre: 'Sphère et boule',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'La surface et le volume du rond parfait',
            cours: `Deux objets à ne pas confondre.

| L'objet | Ce qu'il est | Son image |
| La **sphère** | La **surface** : les points à distance R du centre | La coque d'un ballon |
| La **boule** | Le **solide plein** | Le ballon entier |

La sphère de centre O et de rayon R est l'ensemble des points M de l'espace tels que OM = R ; la boule est l'ensemble des points tels que OM ≤ R.

## Les deux formules
| La grandeur | Sa formule | Son unité |
| **Aire de la sphère** | A = 4 × π × R² | Une unité **carrée** |
| **Volume de la boule** | V = (4/3) × π × R³ | Une unité **cube** |

> Si l'énoncé donne le **diamètre**, il faut le **diviser par 2** avant tout calcul. C'est l'erreur la plus coûteuse du chapitre.

## Un exemple complet
| Le calcul, pour R = 3 cm | Le résultat |
| A = 4 × π × 3² | 36π ≈ **113,1 cm²** |
| V = (4/3) × π × 3³ | 36π ≈ **113,1 cm³** |

> La coïncidence des valeurs n'arrive que pour R = 3 : ce sont deux grandeurs différentes, l'une en cm², l'autre en cm³.

## Exemple résolu : une balle de tennis
Une balle a un diamètre de 6,6 cm. Quel est son volume, au cm³ près ?
1. Le rayon : R = 6,6 ÷ 2 = 3,3 cm.
2. La formule : V = (4/3) × π × 3,3³.
3. Le calcul : 3,3³ = 35,937, donc V ≈ (4/3) × 3,1416 × 35,937 ≈ **151 cm³**, soit environ 0,15 L.

La méthode à suivre à chaque fois : 1. repérer rayon ou diamètre ; 2. écrire la formule littérale ; 3. remplacer ; 4. donner la valeur exacte (en π) puis l'arrondi demandé, avec l'unité.

## Les sections d'une sphère
| La position du plan | La section obtenue |
| Quelconque | Un **cercle** |
| **Par le centre** | Un **grand cercle**, de même rayon que la sphère |
| Plus le plan s'éloigne du centre | Plus le cercle est **petit** |

Le rayon r de la section se calcule avec Pythagore : si le plan est à la distance d du centre, r² = R² − d².

## Effet d'un agrandissement
| Si le rayon est multiplié par k | La grandeur est multipliée par |
| Les **longueurs** | k |
| L'**aire** | **k²** |
| Le **volume** | **k³** |

> Doubler le rayon d'un ballon multiplie sa surface par **4** et son volume par **8**.

## Les unités
| L'équivalence | Sa valeur |
| 1 L | 1 dm³ |
| 1 cm³ | 1 mL |

## Les erreurs fréquentes
- Utiliser π × R², l'aire d'un disque, pour l'aire de la sphère.
- Oublier le 4/3, ou élever le rayon au carré au lieu du cube dans le volume.
- Donner un volume en cm² : une aire et un volume n'ont jamais la même unité.`,
          },
          questions: [
            ['Quelle est la différence entre une sphère et une boule ?', ['La sphère est la surface, la boule est le solide plein', 'La sphère est pleine, la boule est creuse', 'Ce sont deux mots pour le même objet', 'La sphère est plate, la boule est en volume'], 0, 'La coque du ballon contre le ballon entier.'],
            ['Quelle est la formule de l’aire d’une sphère de rayon R ?', ['A = 4 × π × R²', 'A = π × R²', 'A = (4/3) × π × R³', 'A = 2 × π × R'], 0, 'π × R² est l’aire d’un disque, 2πR le périmètre d’un cercle.'],
            ['Quelle est la formule du volume d’une boule de rayon R ?', ['V = (4/3) × π × R³', 'V = 4 × π × R²', 'V = π × R² × h', 'V = (1/3) × π × R²'], 0, 'Le volume est en R³, donc en unités cubes.'],
            ['Que faut-il faire si l’énoncé donne le diamètre ?', ['Le diviser par 2 pour obtenir le rayon', 'L’utiliser directement dans la formule', 'Le multiplier par 2', 'Le multiplier par π'], 0, 'C’est l’erreur la plus fréquente du chapitre.'],
            ['Quelle figure obtient-on en coupant une sphère par un plan ?', ['Un cercle', 'Une ellipse', 'Un rectangle', 'Un triangle'], 0, 'Un grand cercle quand le plan passe par le centre.'],
            ['Si on double le rayon d’une boule, par combien son volume est-il multiplié ?', ['8', '2', '4', '6'], 0, 'Le volume est multiplié par k³, donc par 2³.'],
            ['Si on double le rayon d’une sphère, par combien son aire est-elle multipliée ?', ['4', '2', '8', '16'], 0, 'L’aire est multipliée par k², donc par 2².'],
            ['Une aire et un volume peuvent s’exprimer dans la même unité.', ['Vrai', 'Faux'], 1, 'L’aire est en unités carrées, le volume en unités cubes.'],
          ],
        },
        {
          titre: 'Sections planes de solides',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Ce qu’on voit quand on tranche un solide',
            cours: `Couper un solide par un plan fait apparaître une figure plane appelée section.

## Les sections des solides
| Le solide | La position du plan | La section |
| **Pavé droit**, cube | Parallèle à une **face** | Un **rectangle** identique à cette face — un carré pour le cube |
| Pavé droit | Parallèle à une **arête** | Un rectangle |
| **Cylindre** | Parallèle à la **base** | Un **disque** de même rayon |
| Cylindre | Contenant l'**axe** | Un **rectangle** : hauteur et diamètre |
| **Pyramide** | Parallèle à la base | Un polygone **de même forme** que la base |
| **Cône** | Parallèle à la base | Un **disque** |
| **Sphère** | Quelconque | Un **cercle** — un grand cercle si le plan passe par le centre |

Pour se représenter une section, on imagine le solide en pâte à modeler tranché par un fil : la face coupée est la section. Dans une figure en perspective, les longueurs de la section se calculent souvent avec Pythagore ou Thalès.

## La réduction dans la pyramide et le cône
La section parallèle à la base est une **réduction** de la base, de coefficient k égal au rapport des hauteurs.

| La grandeur | Son coefficient |
| Les **longueurs** | k |
| Les **aires** | **k²** |
| Les **volumes** | **k³** |

## Le rappel des volumes
| Le solide | Son volume |
| **Pavé droit** | L × l × h |
| **Cylindre** | π × R² × h |
| **Pyramide** | (1/3) × aire de la base × hauteur |
| **Cône** | (1/3) × aire de la base × hauteur |

> Le **tiers** de la pyramide et du cône n'est pas un détail : c'est le facteur que les copies oublient le plus souvent.

## Exemple résolu : une pyramide coupée
Une pyramide de hauteur 12 cm a une base carrée de 9 cm de côté. On la coupe par un plan parallèle à la base, à 4 cm du sommet.
1. Le coefficient de réduction : k = 4 ÷ 12 = 1/3.
2. La section est un carré de côté 9 × 1/3 = **3 cm**, d'aire 9 cm².
3. Le volume de la grande pyramide : (1/3) × 9² × 12 = (1/3) × 81 × 12 = 324 cm³.
4. Le volume de la petite pyramide : 324 × (1/3)³ = 324 ÷ 27 = **12 cm³**.

La méthode : 1. identifier la nature de la section ; 2. calculer le coefficient k comme rapport des hauteurs, petite sur grande ; 3. appliquer k, k² ou k³ selon la grandeur cherchée.

## Les erreurs fréquentes
- Appliquer k à une aire ou à un volume au lieu de k² ou k³.
- Prendre la distance à la base au lieu de la distance au sommet pour calculer k.
- Croire qu'une sphère peut donner autre chose qu'un cercle : c'est toujours un cercle.

> Au brevet, les sections apparaissent dans des problèmes concrets (silos, verres coniques, pyramides) où l'on combine volume, réduction et conversion en litres.`,
          },
          questions: [
            ['Quelle figure obtient-on en coupant un cylindre par un plan parallèle à sa base ?', ['Un disque de même rayon que la base', 'Un rectangle', 'Une ellipse', 'Un triangle'], 0, 'Le plan « recopie » la base.'],
            ['Quelle figure obtient-on en coupant un cylindre par un plan contenant son axe ?', ['Un rectangle', 'Un disque', 'Un losange', 'Un cercle'], 0, 'Un côté vaut la hauteur, l’autre le diamètre.'],
            ['Quelle figure obtient-on en coupant un cône par un plan parallèle à sa base ?', ['Un disque plus petit que la base', 'Un triangle', 'Un rectangle', 'Un disque identique à la base'], 0, 'C’est une réduction de la base.'],
            ['Dans une section parallèle à la base d’une pyramide, comment sont multipliées les aires ?', ['Par k²', 'Par k', 'Par k³', 'Elles ne changent pas'], 0, 'Les longueurs par k, les aires par k², les volumes par k³.'],
            ['Quelle est la formule du volume d’un cône ?', ['(1/3) × aire de la base × hauteur', 'Aire de la base × hauteur', 'π × R² × h', '(4/3) × π × R³'], 0, 'Le tiers vaut aussi pour la pyramide.'],
            ['Quelle section obtient-on en coupant un cube par un plan parallèle à une face ?', ['Un carré identique à cette face', 'Un rectangle plus petit', 'Un triangle', 'Un hexagone'], 0, 'La section reproduit exactement la face.'],
            ['Quelle est la formule du volume d’un cylindre de rayon R et de hauteur h ?', ['π × R² × h', '2 × π × R × h', '(1/3) × π × R² × h', '4 × π × R²'], 0, 'Aire du disque de base multipliée par la hauteur.'],
            ['La section d’une sphère par un plan peut être un rectangle.', ['Vrai', 'Faux'], 1, 'C’est toujours un cercle, quel que soit le plan.'],
          ],
        },
        {
          titre: 'L’homothétie',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Agrandir ou réduire depuis un point',
            cours: `Une homothétie agrandit ou réduit une figure à partir d'un point fixe — le centre — selon un nombre appelé rapport, noté k.

## La construction
L'image M′ de M par l'homothétie de centre O et de rapport k est le point de la droite (OM) tel que OM′ = valeur absolue de k, multipliée par OM.

| Le signe de k | La position de M′ |
| **Positif** | Du **même côté** que M par rapport à O |
| **Négatif** | De l'**autre côté** : la figure est retournée |

La méthode de construction, point par point :
1. Tracer la demi-droite ou la droite (OM).
2. Mesurer OM et calculer OM′ = valeur absolue de k × OM.
3. Placer M′ sur (OM), du même côté que M si k est positif, de l'autre côté si k est négatif.
4. Recommencer pour chaque sommet, puis relier les images.

## Ce qu'elle conserve, ce qu'elle multiplie
| Elle **conserve** | Elle **multiplie** |
| L'**alignement** | Les **longueurs** par la valeur absolue de k |
| Le **parallélisme** | Les **aires** par **k²** |
| Les **angles** | Les **volumes** par **k³** |
| La **forme** de la figure | — |

> L'image est un agrandissement ou une réduction, **jamais** une déformation.

## Trois cas remarquables
| La valeur de k | La transformation |
| **k = 1** | La figure ne bouge pas |
| **k = −1** | Une **symétrie centrale** de centre O |
| Valeur absolue **supérieure à 1** | Un **agrandissement** |
| Valeur absolue **inférieure à 1** | Une **réduction** |

> Une homothétie de rapport 3 triple les longueurs mais multiplie l'aire par **9** : c'est la source d'erreur numéro un du chapitre.

## Exemple résolu
Un triangle ABC a des côtés de 3 cm, 4 cm et 5 cm, et une aire de 6 cm². On lui applique l'homothétie de centre O et de rapport −2.
1. Les longueurs sont multipliées par 2 : l'image a des côtés de **6 cm, 8 cm et 10 cm**.
2. L'aire est multipliée par (−2)² = 4 : elle vaut **24 cm²**.
3. Le signe moins place l'image de l'autre côté de O : le triangle est retourné, mais ses angles sont inchangés.

Pour retrouver le rapport à partir d'une figure : k = OM′ ÷ OM, avec un signe moins si M et M′ sont de part et d'autre de O.

## Le lien avec Thalès
Une homothétie de centre O transforme une droite en une **droite parallèle**.

> C'est exactement la configuration du théorème de Thalès : les deux chapitres décrivent la même situation, l'un par une transformation, l'autre par une égalité de quotients.

## Les erreurs fréquentes
- Croire qu'un rapport de 0,5 agrandit : toute valeur absolue inférieure à 1 réduit.
- Oublier que k négatif retourne la figure autour du centre.
- Multiplier une aire par k au lieu de k².`,
          },
          questions: [
            ['Qu’est-ce qu’une homothétie ?', ['Une transformation qui agrandit ou réduit une figure depuis un point fixe', 'Une rotation autour d’un point', 'Une translation le long d’un vecteur', 'Une symétrie par rapport à une droite'], 0, 'Elle est définie par un centre et un rapport.'],
            ['Que se passe-t-il si le rapport k est négatif ?', ['L’image se trouve de l’autre côté du centre', 'La figure disparaît', 'La figure est déformée', 'Le rapport n’a pas de sens'], 0, 'Pour k = −1, on retrouve la symétrie centrale.'],
            ['Que conserve une homothétie ?', ['Les angles, l’alignement et le parallélisme', 'Les longueurs', 'Les aires', 'Les volumes'], 0, 'Elle conserve la forme, pas les dimensions.'],
            ['Par combien une homothétie de rapport 3 multiplie-t-elle les aires ?', ['9', '3', '27', '6'], 0, 'Les aires sont multipliées par k².'],
            ['Par combien une homothétie de rapport 3 multiplie-t-elle les volumes ?', ['27', '9', '3', '81'], 0, 'Les volumes sont multipliés par k³.'],
            ['À quelle transformation correspond une homothétie de rapport −1 ?', ['Une symétrie centrale', 'Une symétrie axiale', 'Une translation', 'Une rotation d’un quart de tour'], 0, 'L’image est le symétrique du point par rapport au centre.'],
            ['Que devient une droite par une homothétie ?', ['Une droite parallèle à la droite de départ', 'Une droite perpendiculaire', 'Un cercle', 'Un segment de même longueur'], 0, 'C’est la configuration même du théorème de Thalès.'],
            ['Une homothétie de rapport 0,5 agrandit la figure.', ['Vrai', 'Faux'], 1, 'Un rapport de valeur absolue inférieure à 1 réduit la figure.'],
          ],
        },
        {
          titre: 'Utiliser le théorème de Thalès',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Des droites parallèles, des quotients égaux',
            cours: `Le théorème de Thalès relie des longueurs dans une configuration de droites parallèles coupées par deux sécantes.

## La configuration
Deux droites sécantes en A ; B et M sur la première, C et N sur la seconde. Si **(BC) et (MN) sont parallèles** :

AM / AB = AN / AC = MN / BC

| La figure | Sa disposition |
| Le **triangle emboîté** | M et N du **même côté** de A |
| Le **papillon** | M et N de l'**autre côté** |

> Le théorème est le même dans les deux cas.

## La méthode en trois temps
| L'étape | Ce qu'on fait |
| 1 | **Vérifier** l'alignement des points et le **parallélisme** des droites |
| 2 | **Écrire** les trois quotients dans le bon ordre : chacun commence par le sommet commun A |
| 3 | **Résoudre** par le produit en croix, avec les deux quotients dont on connaît trois longueurs |

> L'erreur classique est de mélanger un « petit » et un « grand » segment dans le même quotient. Écrire toujours **petit sur grand** évite la moitié des fautes.

## Exemple résolu : calculer une longueur
On sait : A, M, B alignés ; A, N, C alignés ; (MN) parallèle à (BC) ; AM = 3 cm, AB = 5 cm, BC = 7 cm. Calculer MN.
1. Les droites (MB) et (NC) sont sécantes en A et (MN) est parallèle à (BC) : d'après le théorème de Thalès, AM / AB = AN / AC = MN / BC.
2. On garde les quotients utiles : 3 / 5 = MN / 7.
3. Produit en croix : MN = 3 × 7 ÷ 5 = **4,2 cm**.

## Les deux usages inverses
| Ce qu'on veut prouver | Ce qu'on utilise | La condition |
| Les droites sont **parallèles** | La **réciproque** | Les points alignés **dans le même ordre**, et AM / AB = AN / AC |
| Les droites **ne sont pas** parallèles | La **contraposée** | Les deux quotients sont **différents** |

> C'est la question type du brevet : on calcule les deux quotients, on les compare, on conclut.

Exemple : AM = 4, AB = 10, AN = 6, AC = 15. AM / AB = 0,4 et AN / AC = 0,4 : les quotients sont égaux et les points sont dans le même ordre, donc (MN) et (BC) sont parallèles. Si l'on avait trouvé 0,4 et 0,42, on conclurait qu'elles ne le sont pas.

## Le lien avec les agrandissements
| Le rapport commun k | Ce qu'il multiplie |
| Les **longueurs** | k |
| Les **aires** | k² |
| Les **volumes** | k³ |

## Les erreurs fréquentes
- Oublier de citer le parallélisme avant d'appliquer le théorème : sans lui, il ne s'applique pas.
- Comparer des quotients arrondis : on compare des valeurs exactes, ou des produits en croix.
- Chercher un angle avec Thalès : le théorème ne parle que de longueurs, les angles relèvent de la trigonométrie.`,
          },
          questions: [
            ['Quelle condition rend le théorème de Thalès applicable ?', ['Deux droites parallèles coupées par deux sécantes', 'Un triangle rectangle', 'Deux cercles de même rayon', 'Un quadrilatère quelconque'], 0, 'Le parallélisme est l’hypothèse indispensable.'],
            ['Dans la configuration de Thalès, que vaut AM / AB ?', ['AN / AC', 'AB / AM', 'BC / AN', 'AC / MN'], 0, 'Les trois quotients AM/AB, AN/AC et MN/BC sont égaux.'],
            ['Comment nomme-t-on la configuration où M et N sont de l’autre côté du sommet ?', ['La configuration papillon', 'La configuration triangle emboîté', 'La configuration pyramidale', 'La configuration croisée interdite'], 0, 'Le théorème s’applique de la même façon dans les deux cas.'],
            ['À quoi sert la réciproque du théorème de Thalès ?', ['À démontrer que deux droites sont parallèles', 'À calculer une longueur manquante', 'À calculer un angle', 'À déterminer une aire'], 0, 'Elle exige que les points soient alignés dans le même ordre.'],
            ['Que conclut-on si les deux quotients sont différents ?', ['Les droites ne sont pas parallèles', 'La figure est fausse', 'Le théorème s’applique quand même', 'Les points ne sont pas alignés'], 0, 'C’est la contraposée, très demandée au brevet.'],
            ['Comment résout-on l’égalité de deux quotients ?', ['Par le produit en croix', 'En additionnant les numérateurs', 'En prenant la racine carrée', 'En multipliant par π'], 0, 'a/b = c/d équivaut à a × d = b × c.'],
            ['Si le rapport de réduction vaut k, dans quel rapport sont les aires ?', ['k²', 'k', 'k³', '2k'], 0, 'Comme pour toute réduction : longueurs en k, aires en k², volumes en k³.'],
            ['Le théorème de Thalès permet de calculer un angle.', ['Vrai', 'Faux'], 1, 'Il ne parle que de longueurs ; les angles relèvent de la trigonométrie.'],
          ],
        },
        {
          titre: 'Trigonométrie dans un triangle rectangle',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Cosinus, sinus, tangente : relier angles et longueurs',
            cours: `La trigonométrie relie les angles d'un triangle rectangle à ses longueurs — ce que ni Pythagore ni Thalès ne savent faire.

## Le vocabulaire, depuis un angle aigu
| Le côté | Sa définition |
| L'**hypoténuse** | Opposé à l'angle **droit** : le plus long |
| L'**adjacent** | Il **touche** l'angle choisi |
| L'**opposé** | Il lui **fait face** |

L'adjacent et l'opposé dépendent de l'angle choisi : l'adjacent de l'un des angles aigus est l'opposé de l'autre. L'hypoténuse, elle, ne change jamais.

## Les trois formules
| Le rapport | Sa formule |
| **cos** | adjacent ÷ hypoténuse |
| **sin** | opposé ÷ hypoténuse |
| **tan** | opposé ÷ adjacent |

Le moyen mnémotechnique : **CAH – SOH – TOA**.

## Les deux calculs
| Ce qu'on cherche | La méthode |
| Une **longueur** | Repérer l'angle connu, identifier les côtés, choisir la formule à **deux données et une inconnue**, résoudre |
| Un **angle** | Calculer le quotient, puis utiliser **cos⁻¹, sin⁻¹ ou tan⁻¹** |

> Vérifier que la calculatrice est bien en mode **degrés** (DEG) : en radians, tous les résultats sont faux **sans que rien ne le signale**.

## Exemples résolus
Triangle ABC rectangle en B, avec l'angle en A de 35° et AC = 8 cm. Calculer BC.
1. Depuis l'angle A : AC est l'hypoténuse, BC est l'opposé.
2. La formule qui relie opposé et hypoténuse est le sinus : sin 35° = BC / 8.
3. BC = 8 × sin 35° ≈ **4,6 cm**.

Triangle DEF rectangle en E, avec DE = 5 cm et EF = 12 cm. Calculer l'angle en D.
1. Depuis D : EF est l'opposé, DE l'adjacent.
2. tan D = 12 / 5 = 2,4.
3. D = tan⁻¹(2,4) ≈ **67°**.

## Les valeurs à connaître
| L'angle | cos | sin | tan |
| 0° | 1 | 0 | 0 |
| 30° | — | **0,5** | — |
| 45° | — | — | **1** |
| 60° | **0,5** | — | — |
| 90° | 0 | 1 | — |

> Le cosinus et le sinus d'un angle aigu sont **toujours entre 0 et 1** : un résultat supérieur à 1 signale une erreur de formule ou de côté.

## Avec Pythagore
| Le théorème | Ce qu'il relie |
| **Pythagore** | Trois **longueurs** : a² + b² = c² |
| La **trigonométrie** | Deux longueurs et un **angle** |

> Une figure se traite souvent avec les deux à la suite.

## Les erreurs fréquentes
- Prendre l'hypoténuse pour l'adjacent : l'hypoténuse est toujours en face de l'angle droit.
- Arrondir trop tôt : on garde la valeur de la calculatrice jusqu'au résultat final.
- Utiliser la trigonométrie dans un triangle qui n'est pas rectangle.

> Au brevet, la trigonométrie sert souvent à calculer une hauteur (rampe, échelle, toit) ou un angle de pente.`,
          },
          questions: [
            ['Que vaut le cosinus d’un angle aigu dans un triangle rectangle ?', ['Adjacent ÷ hypoténuse', 'Opposé ÷ hypoténuse', 'Opposé ÷ adjacent', 'Hypoténuse ÷ adjacent'], 0, 'Le moyen mnémotechnique CAH : Cosinus, Adjacent, Hypoténuse.'],
            ['Que vaut la tangente d’un angle aigu ?', ['Opposé ÷ adjacent', 'Adjacent ÷ opposé', 'Opposé ÷ hypoténuse', 'Hypoténuse ÷ opposé'], 0, 'TOA : Tangente, Opposé, Adjacent.'],
            ['Comment appelle-t-on le côté opposé à l’angle droit ?', ['L’hypoténuse', 'Le côté adjacent', 'La médiane', 'La hauteur'], 0, 'C’est toujours le plus long des trois côtés.'],
            ['Comment retrouve-t-on un angle à partir de son cosinus ?', ['Avec la touche cos⁻¹ de la calculatrice', 'En multipliant par 90', 'En prenant la racine carrée', 'En divisant par π'], 0, 'Et il faut vérifier que la calculatrice est en mode degrés.'],
            ['Que vaut sin 90° ?', ['1', '0', '0,5', '90'], 0, 'Le sinus croît de 0 à 1 quand l’angle passe de 0° à 90°.'],
            ['Que vaut tan 45° ?', ['1', '0', '0,5', '45'], 0, 'Dans un triangle rectangle isocèle, opposé et adjacent sont égaux.'],
            ['Quel réglage de la calculatrice faut-il vérifier avant tout calcul trigonométrique ?', ['Le mode degrés (DEG)', 'Le nombre de décimales', 'Le mode fraction', 'Le mode scientifique'], 0, 'En radians, les résultats sont faux sans aucun message d’erreur.'],
            ['Le cosinus d’un angle aigu peut être supérieur à 1.', ['Vrai', 'Faux'], 1, 'C’est un quotient dont le dénominateur, l’hypoténuse, est le plus grand côté.'],
          ],
        },
        {
          titre: 'Triangles semblables',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Même forme, taille différente',
            cours: `Deux triangles sont semblables lorsqu'ils ont la même forme : leurs angles sont deux à deux égaux, et leurs côtés proportionnels.

## Les deux définitions équivalentes
| La définition | Son contenu |
| Par les **angles** | Ils sont deux à deux de même mesure |
| Par les **côtés** | Les longueurs sont proportionnelles ; le quotient est le **rapport de similitude** k |

> En 3e, on retient le critère le plus rapide : **deux angles égaux suffisent**. La somme des angles valant 180°, le troisième suit automatiquement.

## Comment rédiger
On nomme les triangles en respectant l'ordre des **sommets homologues**. Si ABC et DEF sont semblables avec A ↔ D, B ↔ E, C ↔ F :

AB / DE = AC / DF = BC / EF = k

> L'ordre des lettres n'est pas décoratif : c'est lui qui dit quel côté correspond à quel autre.

La méthode :
1. Montrer que deux angles sont égaux (angle commun, angles opposés par le sommet, angles droits, angles alternes-internes).
2. Conclure que les triangles sont semblables, en écrivant les sommets dans l'ordre des correspondances.
3. Écrire l'égalité des quotients de côtés homologues.
4. Calculer la longueur cherchée par un produit en croix.

## Exemple résolu : la hauteur d'un arbre
Un bâton de 1,5 m, planté verticalement, a une ombre de 2 m. Au même moment, l'ombre d'un arbre mesure 14 m.
1. Les deux triangles (objet, ombre, rayon de soleil) ont chacun un angle droit au sol, et le même angle entre le sol et les rayons : ils sont semblables.
2. Le rapport de similitude : k = 14 ÷ 2 = 7.
3. La hauteur de l'arbre : 1,5 × 7 = **10,5 m**.

## Ce que le rapport multiplie
| La grandeur | Son coefficient |
| Les **longueurs** | k |
| Les **aires** | **k²** |
| Les **volumes**, pour des solides semblables | **k³** |

Si k = 2, un triangle d'aire 5 cm² a pour « grand frère » un triangle d'aire 20 cm².

## Semblables et égaux
| Les triangles | Leur rapport | Ce qu'ils partagent |
| **Semblables** | k quelconque | La **forme** |
| **Égaux** (isométriques) | **k = 1** | La forme **et** la taille |

> Les triangles égaux sont un cas particulier des triangles semblables.

## Les usages
| L'usage | Son exemple |
| Calculer une longueur **inaccessible** | La hauteur d'un arbre par son ombre |
| Démontrer une **égalité de rapports** | Une configuration géométrique |
| Relier une **réduction** à son modèle | Maquette, plan |

> La configuration de Thalès produit d'ailleurs toujours deux triangles semblables.

## Les erreurs fréquentes
- Associer deux côtés qui ne se correspondent pas : on suit l'ordre des sommets.
- Croire que des triangles semblables ont la même aire : c'est vrai seulement si k = 1.`,
          },
          questions: [
            ['Quand deux triangles sont-ils semblables ?', ['Quand leurs angles sont deux à deux égaux', 'Quand ils ont la même aire', 'Quand ils ont un côté commun', 'Quand ils sont tous deux rectangles'], 0, 'Leurs côtés sont alors proportionnels.'],
            ['Combien d’angles égaux suffisent à prouver que deux triangles sont semblables ?', ['Deux', 'Un seul', 'Trois obligatoirement', 'Aucun, il faut les côtés'], 0, 'Le troisième suit, puisque la somme des angles vaut 180°.'],
            ['Que vaut le rapport de similitude k ?', ['Le quotient de deux côtés homologues', 'La différence de deux côtés', 'La somme des angles', 'Le produit des aires'], 0, 'Il est le même pour les trois paires de côtés homologues.'],
            ['Si k = 2, dans quel rapport sont les aires des deux triangles ?', ['4', '2', '8', '6'], 0, 'Les aires sont dans le rapport k².'],
            ['Que signifie « triangles égaux » ?', ['Des triangles semblables de rapport 1', 'Des triangles de même aire', 'Des triangles ayant un angle droit', 'Des triangles inscrits dans le même cercle'], 0, 'Même forme et même taille : c’est un cas particulier de similitude.'],
            ['Pourquoi l’ordre des sommets compte-t-il dans la notation ?', ['Parce qu’il indique quels côtés se correspondent', 'Parce qu’il donne l’aire du triangle', 'Parce qu’il fixe le sens de rotation', 'Il n’a aucune importance'], 0, 'ABC semblable à DEF signifie A ↔ D, B ↔ E, C ↔ F.'],
            ['Quelle configuration classique produit toujours deux triangles semblables ?', ['La configuration de Thalès', 'Le triangle inscrit dans un cercle', 'Le losange', 'Le trapèze quelconque'], 0, 'Deux droites parallèles coupées par deux sécantes créent deux triangles de même forme.'],
            ['Deux triangles semblables ont toujours la même aire.', ['Vrai', 'Faux'], 1, 'Leurs aires sont dans le rapport k², égal à 1 seulement si les triangles sont égaux.'],
          ],
        },
      ],
    },
  ],
}
