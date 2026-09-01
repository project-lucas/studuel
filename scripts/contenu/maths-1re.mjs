// MATHS PREMIÈRE (spécialité) — les 11 fiches du programme officiel, rangées
// sous ses 4 chapitres : algèbre · analyse · géométrie · probabilités et
// statistiques.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re maths) :
// la spécialité de Première n’a que CINQ fiches à plat — « Suites numériques »,
// « Second degré », « Dérivation », « Produit scalaire », « Probabilités
// conditionnelles » —, héritées des migrations écrites à la main. La fonction
// exponentielle, les fonctions trigonométriques, les variations et courbes,
// la géométrie repérée et les variables aléatoires n’ont AUCUNE entrée : cinq
// des onze fiches du programme, et parmi elles l’exponentielle, qui commande
// toute la Terminale.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `maths-tle.mjs` : celui-ci
// part dans la migration 255, qui ne doit plus être régénérée. Deux fichiers,
// même slug `maths` — d’où la génération par `--modules` et non par `--slugs`.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'`.
//
// ⚠️ UNE COLLISION DE TITRE VOULUE : la fiche « Dérivation » existe déjà en base
// au niveau 1re, sans thème. Le ménage tournant AVANT les insertions, l’ancienne
// ligne part d’abord et la neuve prend sa place — la contrainte
// UNIQUE(subject_id, level, title) n’est jamais mise en défaut. Au rejeu,
// l’ancienne n’existe plus et la neuve, qui porte un thème, n’est pas visée.
//
// ⚠️ PAS DE LATEX : le composant de rendu ne le connaît pas. Les formules
// s’écrivent en texte — « x² », « √n », « f’(x) = 2x + 3 », « u(n+1) = u(n) × q ».

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 1re (spécialité) — LE PROGRAMME OFFICIEL (11 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re maths, 21/08/2026) :
la spécialité de Première n'avait que CINQ fiches, alignées à plat et sans
chapitre — « Suites numériques », « Second degré », « Dérivation », « Produit
scalaire », « Probabilités conditionnelles ». La fonction exponentielle, les
fonctions trigonométriques, l'étude des variations et des courbes, la géométrie
repérée et les variables aléatoires n'avaient AUCUNE entrée : cinq des onze
fiches du programme, dont l'exponentielle, qui commande toute la Terminale.

Cette migration installe les 11 fiches du programme, rangées sous ses 4
chapitres (algèbre, analyse, géométrie, probabilités et statistiques), et retire
les 5 fiches héritées qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. Les autres niveaux gardent leurs fiches : le
ménage est borné au niveau 1re. La Terminale a reçu les siennes avec la 255.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 5 fiches héritées.
Les 11 fiches neuves les recouvrent, avec un cours et huit questions chacune.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 11 fiches sous 4 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 5 anciennes fiches déjà supprimées
et les 11 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches héritées partent, au niveau 1re SEULEMENT.

CE MÉNAGE N'EST PAS SEULEMENT UN NETTOYAGE, IL EST NÉCESSAIRE : la fiche
« Dérivation » existe en base ET dans ce module. La table chapters étant
UNIQUE(subject_id, level, title), l'INSERT tomberait sinon sur son ON CONFLICT
DO NOTHING, la fiche neuve ne serait jamais posée, et sa leçon échouerait sur
une clé étrangère absente. Le ménage tournant AVANT les insertions, l'ancienne
ligne part d'abord et la neuve prend sa place.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les cinq lignes voulues, antérieures à la colonne
theme, tandis que les 11 fiches neuves en portent un dès l'INSERT — le ménage ne
peut donc jamais mordre sur elles, ni au premier passage ni au rejeu. C'est ce
qui rend la collision de titre inoffensive au rejeu : la « Dérivation » neuve
porte le thème « Analyse » et n'est pas visée.

L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons
partent en cascade.`,
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
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : algèbre -------------------------------------------
        {
          titre: 'Les suites numériques',
          axe: 'Algèbre',
          lecon: {
            titre: 'Définir, calculer, décrire le comportement',
            cours: `Une suite numérique est une fonction définie sur les entiers naturels : à chaque rang n elle associe un terme u(n).

> On note la suite (u) et son terme de rang n, u(n) — jamais u × n.

## Deux façons de définir une suite
| La définition | Ce qu'on donne | Un exemple | Ce qu'elle permet |
| **Explicite** | u(n) en fonction de n | u(n) = 3n − 2 | Calculer u(100) **sans** les précédents |
| **Par récurrence** | Le **premier terme** et une relation entre u(n+1) et u(n) | u(0) = 5 et u(n+1) = 2 u(n) + 1 | Décrire un processus **pas à pas** |

> Les deux ne se valent pas à l'usage : la forme récurrente colle aux situations réelles — un capital qui évolue chaque année, une population qui se renouvelle.

## Sens de variation
| La méthode | Ce qu'on étudie | Quand l'employer |
| La **différence** | Le signe de u(n+1) − u(n) | Toujours possible |
| Le **quotient** | Comparer u(n+1) / u(n) à 1 | Seulement si tous les termes sont **strictement positifs** |
| La **fonction associée** | Le sens de variation de f, si u(n) = f(n) | Seulement pour une suite explicite |

(u) est **croissante** si u(n+1) ≥ u(n) pour tout n, **décroissante** si u(n+1) ≤ u(n).

## Majorée, minorée, bornée
| Le mot | Sa condition |
| **Majorée** | Il existe M tel que u(n) ≤ M pour tout n |
| **Minorée** | Il existe m tel que u(n) ≥ m pour tout n |
| **Bornée** | Les deux à la fois |

## Représenter une suite
Une suite se représente par des **points isolés** de coordonnées (n ; u(n)).

> Jamais par une courbe continue : n ne prend que des valeurs entières.

Pour une suite définie par récurrence, on trace la courbe de f et la droite d'équation y = x : le va-et-vient entre les deux, en escalier ou en escargot, donne à voir le comportement des termes.`,
          },
          questions: [
            ['Une suite numérique est une fonction définie sur…', ['les entiers naturels', 'les réels', 'les rationnels', 'un intervalle de réels'], 0, 'C’est pourquoi on la représente par des points isolés.'],
            ['Que faut-il pour définir une suite par récurrence ?', ['Un premier terme et une relation entre u(n+1) et u(n)', 'Une expression de u(n) en fonction de n', 'Le sens de variation', 'La limite de la suite'], 0, 'Sans premier terme, la relation ne suffit pas à déterminer la suite.'],
            ['Comment détermine-t-on le sens de variation d’une suite ?', ['En étudiant le signe de u(n+1) − u(n)', 'En calculant u(0)', 'En traçant la courbe de f', 'En comparant u(n) à n'], 0, 'Pour une suite à termes strictement positifs, le quotient comparé à 1 marche aussi.'],
            ['Une suite se représente graphiquement par une courbe continue.', ['Vrai', 'Faux'], 1, 'Par des POINTS ISOLÉS : n ne prend que des valeurs entières.'],
            ['Qu’est-ce qu’une suite bornée ?', ['Une suite à la fois majorée et minorée', 'Une suite croissante', 'Une suite qui a une limite', 'Une suite définie par récurrence'], 0, 'Ses termes restent tous dans un intervalle fixé.'],
            ['Avec une définition explicite, peut-on calculer u(100) sans calculer les termes précédents ?', ['Oui, directement', 'Non, jamais', 'Seulement si la suite est croissante', 'Seulement si la suite est arithmétique'], 0, 'C’est le principal avantage de la forme explicite.'],
            ['Si u(n) = f(n) avec f croissante sur les réels positifs, alors la suite est croissante.', ['Vrai', 'Faux'], 0, 'Le sens de variation de la fonction se transmet à la suite.'],
            ['Que note u(n) ?', ['Le terme de rang n de la suite', 'Le produit de u par n', 'La somme des n premiers termes', 'La limite de la suite'], 0, 'La confusion avec un produit est l’erreur de notation la plus fréquente.'],
          ],
        },
        {
          titre: 'Les suites arithmétiques et géométriques',
          axe: 'Algèbre',
          lecon: {
            titre: 'Deux modèles, deux croissances',
            cours: `Deux familles de suites décrivent l'essentiel des évolutions modélisées en Première.

## Les deux modèles face à face
| Le point | Suite **arithmétique** | Suite **géométrique** |
| On passe au terme suivant en… | **Ajoutant** la raison r | **Multipliant** par la raison q |
| Relation de récurrence | u(n+1) = u(n) + r | u(n+1) = u(n) × q |
| Forme explicite | u(n) = u(0) + n × r | u(n) = u(0) × q puissance n |
| Croissante si… | r > 0 | q > 1 (avec u(0) > 0) |
| Décroissante si… | r < 0 | 0 < q < 1 (avec u(0) > 0) |
| Représentation | Des points **alignés** | Une courbe qui s'emballe |
| Type de croissance | **Linéaire** | **Exponentielle** |

Plus généralement, pour l'arithmétique : u(n) = u(p) + (n − p) × r.

> La croissance exponentielle finit toujours par dépasser n'importe quelle croissance linéaire.

## Les deux sommes
Somme des entiers, pour une suite arithmétique de raison 1 :

1 + 2 + … + n = n × (n + 1) / 2

Somme des puissances, pour q différent de 1 :

1 + q + q² + … + q puissance n = (1 − q puissance (n+1)) / (1 − q)

## Reconnaître laquelle
| Ce qui est constant entre deux termes consécutifs | La suite est… |
| La **différence** | **Arithmétique** |
| Le **quotient** | **Géométrique** |

## Le cas concret le plus utile
Une évolution de **t %** par période revient à multiplier par le **coefficient multiplicateur** 1 + t / 100.

| L'évolution annuelle | La raison de la suite géométrique |
| Hausse de 5 % | 1,05 |
| Baisse de 5 % | 0,95 |
| Baisse de 10 % | 0,90 |

> Piège classique : deux baisses de 10 % ne font pas une baisse de 20 %. On calcule 0,90 × 0,90 = 0,81, soit une baisse de **19 %**.`,
          },
          questions: [
            ['Comment reconnaît-on une suite géométrique ?', ['Le quotient de deux termes consécutifs est constant', 'La différence de deux termes consécutifs est constante', 'Les termes sont alignés graphiquement', 'La suite est croissante'], 0, 'La différence constante, elle, caractérise une suite arithmétique.'],
            ['Quelle est la forme explicite d’une suite arithmétique de premier terme u(0) ?', ['u(n) = u(0) + n × r', 'u(n) = u(0) × r puissance n', 'u(n) = u(0) × n + r', 'u(n) = u(0) + r puissance n'], 0, 'La croissance est linéaire : les points sont alignés.'],
            ['Une suite géométrique de raison 0,95 et de premier terme positif est décroissante.', ['Vrai', 'Faux'], 0, 'Une raison strictement comprise entre 0 et 1 fait décroître la suite.'],
            ['Par quel coefficient multiplie-t-on pour une hausse de 5 % ?', ['1,05', '0,05', '5', '0,95'], 0, 'Le coefficient multiplicateur vaut 1 + t / 100.'],
            ['Deux baisses successives de 10 % équivalent à une baisse de 20 %.', ['Vrai', 'Faux'], 1, '0,90 × 0,90 = 0,81, soit une baisse de 19 %.'],
            ['Quelle est la forme explicite d’une suite géométrique de premier terme u(0) ?', ['u(n) = u(0) × q puissance n', 'u(n) = u(0) + n × q', 'u(n) = q × n', 'u(n) = u(0) puissance n'], 0, 'La croissance y est exponentielle.'],
            ['Combien vaut la somme 1 + 2 + … + n ?', ['n × (n + 1) / 2', 'n² / 2', 'n × (n − 1)', '2n + 1'], 0, 'C’est la somme des n premiers entiers naturels non nuls.'],
            ['Une croissance exponentielle finit toujours par dépasser une croissance linéaire.', ['Vrai', 'Faux'], 0, 'Quels que soient les coefficients de départ, si la raison est supérieure à 1.'],
          ],
        },
        {
          titre: 'Le second degré',
          axe: 'Algèbre',
          lecon: {
            titre: 'Discriminant, racines et signe',
            cours: `Un trinôme du second degré s'écrit f(x) = a x² + b x + c, avec a différent de 0. Sa courbe est une parabole.

| Le signe de a | La parabole |
| a > 0 | Tournée vers le **haut** |
| a < 0 | Tournée vers le **bas** |

## Le discriminant
Δ = b² − 4 a c

| La valeur de Δ | Les racines | La parabole et l'axe des abscisses |
| **Δ > 0** | **Deux** racines : x1 = (−b − √Δ) / (2a) et x2 = (−b + √Δ) / (2a) | Elle le coupe en deux points |
| **Δ = 0** | Une racine **double** : x0 = −b / (2a) | Elle lui est **tangente** |
| **Δ < 0** | **Aucune** racine réelle | Elle ne le coupe pas |

## Les trois formes du trinôme
| La forme | Son écriture | Ce qu'elle donne à lire |
| **Développée** | a x² + b x + c | c, l'ordonnée à l'origine ; le calcul de Δ |
| **Factorisée** (si Δ ≥ 0) | a (x − x1)(x − x2) | Les **racines** |
| **Canonique** | a (x − α)² + β, avec α = −b / (2a) et β = f(α) | Le **sommet** (α ; β) |

> Choisir la bonne forme selon la question posée fait gagner plus de temps que n'importe quel calcul astucieux.

## Le signe du trinôme
La règle tient en une phrase : **le trinôme est du signe de a partout, sauf entre les racines**.

| Le cas | Le signe |
| Δ < 0 | Du signe de a sur tout l'ensemble des réels — il ne s'annule jamais |
| Δ = 0 | Du signe de a partout, nul en x0 |
| Δ > 0 | Du signe **opposé** à a strictement entre x1 et x2 |

## Sommet et symétrie
| Le signe de a | L'extremum en α |
| a > 0 | Un **minimum** |
| a < 0 | Un **maximum** |

La parabole est symétrique par rapport à la droite verticale d'équation x = α.

Deux relations utiles : la **somme** des racines vaut −b / a, leur **produit** c / a.`,
          },
          questions: [
            ['Quelle est l’expression du discriminant ?', ['Δ = b² − 4ac', 'Δ = b² + 4ac', 'Δ = 4ac − b²', 'Δ = b − 4ac'], 0, 'Son signe décide du nombre de racines réelles.'],
            ['Que peut-on dire d’un trinôme dont le discriminant est négatif ?', ['Il ne s’annule jamais et garde le signe de a', 'Il a deux racines', 'Il est toujours positif', 'Sa courbe est une droite'], 0, 'La parabole ne coupe pas l’axe des abscisses.'],
            ['Un trinôme est du signe de a sauf entre ses racines.', ['Vrai', 'Faux'], 0, 'C’est la règle de signe à retenir, valable quand Δ > 0.'],
            ['Quelle est l’abscisse du sommet d’une parabole d’équation a x² + b x + c ?', ['−b / (2a)', 'b / (2a)', '−c / a', '−b / a'], 0, 'C’est aussi l’axe de symétrie de la parabole.'],
            ['Quelle forme du trinôme permet de lire directement les racines ?', ['La forme factorisée', 'La forme développée', 'La forme canonique', 'Aucune'], 0, 'a (x − x1)(x − x2) : les racines s’y lisent immédiatement.'],
            ['Si a est positif, la fonction du second degré admet un maximum.', ['Vrai', 'Faux'], 1, 'Elle admet un MINIMUM : la parabole est tournée vers le haut.'],
            ['Combien vaut la somme des racines d’un trinôme ?', ['−b / a', 'b / a', 'c / a', '−c / a'], 0, 'Leur produit vaut c / a.'],
            ['Que se passe-t-il quand le discriminant est nul ?', ['Il y a une racine double et la parabole est tangente à l’axe des abscisses', 'Il n’y a aucune racine', 'Il y a deux racines opposées', 'La courbe est une droite'], 0, 'La racine vaut alors −b / (2a).'],
          ],
        },

        // ---- Chapitre 2 : analyse -------------------------------------------
        {
          titre: 'Dérivation',
          axe: 'Analyse',
          lecon: {
            titre: 'Nombre dérivé, tangente et formules',
            cours: `Le nombre dérivé de f en a est la limite du taux de variation quand h tend vers 0. Géométriquement, c'est le coefficient directeur de la tangente.

f'(a) = limite de [f(a + h) − f(a)] / h

## L'équation de la tangente
y = f'(a) × (x − a) + f(a)

> Elle tombe à chaque devoir et se retient en la lisant : une droite de coefficient directeur f'(a) qui passe par le point (a ; f(a)).

## Les dérivées à connaître
| La fonction f(x) | Sa dérivée f'(x) | Sur quel domaine |
| k (constante) | 0 | Les réels |
| x | 1 | Les réels |
| x² | 2x | Les réels |
| x puissance n | n × x puissance (n − 1) | Les réels |
| 1 / x | −1 / x² | x différent de 0 |
| √x | 1 / (2√x) | x > 0 |

## Les opérations
| L'expression | Sa dérivée | Le piège |
| u + v | u' + v' | — |
| k × u | k × u' | — |
| **u × v** | **u'v + uv'** | Le produit des dérivées serait faux |
| 1 / v | −v' / v² | — |
| **u / v** | **(u'v − uv') / v²** | L'ordre au numérateur : la soustraction n'est pas commutative |

## Dérivée et variations
C'est le lien qui donne tout son intérêt à la dérivation.

| Le signe de f' sur un intervalle | Le sens de variation de f |
| **Positive** | f est **croissante** |
| **Négative** | f est **décroissante** |
| Elle **s'annule en changeant de signe** | f admet un **extremum local** |

> Attention à la réciproque : f' peut s'annuler **sans** extremum. C'est le cas de f(x) = x³ en 0, où la tangente est horizontale mais la fonction reste croissante.`,
          },
          questions: [
            ['Que représente géométriquement le nombre dérivé f’(a) ?', ['Le coefficient directeur de la tangente au point d’abscisse a', 'L’ordonnée du point d’abscisse a', 'L’aire sous la courbe', 'La limite de la fonction en a'], 0, 'C’est la lecture géométrique de la limite du taux de variation.'],
            ['Quelle est l’équation de la tangente à la courbe de f au point d’abscisse a ?', ['y = f’(a)(x − a) + f(a)', 'y = f(a)(x − a) + f’(a)', 'y = f’(a) × x + a', 'y = f(a) × x + f’(a)'], 0, 'Une droite de coefficient directeur f’(a) passant par (a ; f(a)).'],
            ['Quelle est la dérivée de x puissance n ?', ['n × x puissance (n − 1)', 'x puissance (n − 1)', 'n × x puissance n', '(n − 1) × x puissance n'], 0, 'Cas particulier : la dérivée de x² vaut 2x.'],
            ['La dérivée d’un produit est le produit des dérivées.', ['Vrai', 'Faux'], 1, '(u × v)’ = u’v + uv’ : c’est l’erreur la plus fréquente du chapitre.'],
            ['Que peut-on dire de f si f’ est négative sur un intervalle ?', ['f est décroissante sur cet intervalle', 'f est croissante', 'f est négative', 'f admet un maximum'], 0, 'Le signe de la dérivée donne le sens de variation.'],
            ['Quelle est la dérivée de 1 / x ?', ['−1 / x²', '1 / x²', '−1 / x', 'ln x'], 0, 'Le signe négatif traduit la décroissance de la fonction inverse.'],
            ['Si f’ s’annule en un point, f y admet nécessairement un extremum.', ['Vrai', 'Faux'], 1, 'Il faut qu’elle CHANGE DE SIGNE : la fonction cube en 0 est un contre-exemple.'],
            ['Quelle est la formule de dérivation d’un quotient u / v ?', ['(u’v − uv’) / v²', '(u’v + uv’) / v²', '(uv’ − u’v) / v²', 'u’ / v’'], 0, 'L’ordre au numérateur est décisif : la soustraction n’est pas commutative.'],
          ],
        },
        {
          titre: 'Variations et courbes représentatives de fonctions',
          axe: 'Analyse',
          lecon: {
            titre: 'Du tableau de signes au tracé',
            cours: `Étudier une fonction, c'est suivre un enchaînement fixe. Le respecter fait gagner des points même quand un calcul échoue.

## La méthode en cinq temps
| L'étape | Ce qu'on fait | Le point d'attention |
| 1 | **Ensemble de définition** | Ce qui interdit une valeur : division par zéro, racine d'un négatif |
| 2 | Calculer **f'(x)** | La factoriser autant que possible |
| 3 | Étudier le **signe de f'(x)** | Second degré, règle des signes d'un produit ou d'un quotient |
| 4 | Dresser le **tableau de variations** | Y porter les valeurs de f aux bornes et aux extremums |
| 5 | **Conclure** | Extremums, solutions d'une équation, tracé |

## Local ou global
| L'extremum | Sur quel domaine |
| **Local** | Un intervalle autour du point |
| **Global** | Tout l'ensemble de définition |

> Un extremum local n'est pas nécessairement global : un devoir attend souvent cette distinction.

## Lecture graphique
| La question | Ce qu'on lit sur le graphique |
| f(a) | L'**ordonnée** du point d'abscisse a |
| f(x) = k | Les **abscisses des intersections** avec la droite y = k |
| f(x) > 0 | Les intervalles où la **courbe est au-dessus** de l'axe des abscisses |
| f'(x) = 0 | Les points où la tangente est **horizontale** |

## Le théorème des valeurs intermédiaires
Si f est **continue** et **strictement monotone** sur [a ; b], et si k est compris entre f(a) et f(b), alors f(x) = k admet une **unique** solution dans cet intervalle.

> On l'encadre ensuite par **balayage** à la calculatrice, chiffre après chiffre. Sans stricte monotonie, le théorème garantit l'existence d'une solution, mais non son unicité.

## Parité et symétries
| La fonction | Sa relation | La symétrie de sa courbe |
| **Paire** | f(−x) = f(x) | Par rapport à l'**axe des ordonnées** |
| **Impaire** | f(−x) = −f(x) | Par rapport à l'**origine** |

Le repérer permet de n'étudier que la moitié du domaine.`,
          },
          questions: [
            ['Quelle est la première étape de l’étude d’une fonction ?', ['Déterminer son ensemble de définition', 'Calculer sa dérivée', 'Tracer sa courbe', 'Chercher ses extremums'], 0, 'Division par zéro et racine d’un négatif sont les deux interdits usuels.'],
            ['Que signale une tangente horizontale sur une courbe ?', ['Que la dérivée s’y annule', 'Que la fonction s’y annule', 'Que la fonction y est discontinue', 'Que la courbe coupe l’axe des abscisses'], 0, 'Un extremum s’y trouve si la dérivée change de signe.'],
            ['Un extremum local est nécessairement un extremum global.', ['Vrai', 'Faux'], 1, 'Il ne l’est que sur un intervalle autour du point.'],
            ['Que faut-il pour que le théorème des valeurs intermédiaires garantisse une solution UNIQUE ?', ['La continuité et la stricte monotonie sur l’intervalle', 'La continuité seule', 'La dérivabilité seule', 'La parité de la fonction'], 0, 'Sans stricte monotonie, l’existence est acquise mais pas l’unicité.'],
            ['Comment résout-on graphiquement f(x) = k ?', ['En cherchant les abscisses des points d’intersection avec la droite y = k', 'En cherchant les ordonnées des points d’abscisse k', 'En regardant où la courbe coupe l’axe des ordonnées', 'En calculant la dérivée'], 0, 'C’est la lecture graphique la plus demandée.'],
            ['Une fonction paire a une courbe symétrique par rapport à l’axe des ordonnées.', ['Vrai', 'Faux'], 0, 'Une fonction impaire, elle, est symétrique par rapport à l’origine.'],
            ['Où résout-on f(x) > 0 sur un graphique ?', ['Là où la courbe est au-dessus de l’axe des abscisses', 'Là où la courbe est croissante', 'Là où la dérivée est positive', 'Là où la courbe coupe l’axe des ordonnées'], 0, 'Ne pas confondre signe de f et signe de f’.'],
            ['Comment encadre-t-on une solution après avoir appliqué le théorème des valeurs intermédiaires ?', ['Par balayage à la calculatrice', 'Par dérivation successive', 'Par factorisation', 'Par le discriminant'], 0, 'On affine l’encadrement chiffre après chiffre.'],
          ],
        },
        {
          titre: 'Fonction exponentielle',
          axe: 'Analyse',
          lecon: {
            titre: 'La fonction qui est sa propre dérivée',
            cours: `La fonction exponentielle est l'unique fonction dérivable sur l'ensemble des réels telle que f' = f et f(0) = 1.

> C'est cette propriété qui la fait apparaître partout où une grandeur varie proportionnellement à elle-même : intérêts composés, désintégration radioactive, croissance d'une population, refroidissement d'un corps.

## Propriétés algébriques
| L'expression | Sa transformation |
| e puissance (a + b) | e puissance a × e puissance b |
| e puissance (−a) | 1 / (e puissance a) |
| e puissance (a − b) | e puissance a / e puissance b |
| (e puissance a) puissance n | e puissance (n × a) |

> En un mot : **l'exponentielle transforme les sommes en produits**. C'est la propriété qui organise tous les calculs du chapitre.

## Signe, variations, limites
| Le point | Ce qu'il faut savoir |
| **Signe** | e puissance x est **strictement positive** pour tout réel x |
| **Équation** e puissance x = 0 | **Aucune** solution |
| **Variations** | Sa dérivée étant elle-même, donc positive, elle est **strictement croissante** sur les réels |
| **Valeurs** | e puissance 0 = 1 et e ≈ 2,718 |
| Limite en **moins l'infini** | Elle tend vers 0 |
| Limite en **plus l'infini** | Elle tend vers plus l'infini, **plus vite que n'importe quelle puissance de x** |

> Puisqu'elle ne s'annule jamais, le signe d'un produit contenant une exponentielle ne dépend jamais d'elle.

## Équations et inéquations
La stricte croissance donne les équivalences :

e puissance a = e puissance b équivaut à a = b

e puissance a < e puissance b équivaut à a < b

> Le passage à l'exposant **conserve l'ordre**, contrairement à la multiplication par un nombre négatif.

## La dérivée composée
(e puissance u)' = u' × e puissance u

| L'expression | Sa dérivée |
| e puissance (3x) | **3** e puissance (3x) |
| e puissance (−x) | **−**e puissance (−x) |
| e puissance (x²) | **2x** e puissance (x²) |

> Oublier le facteur u' coûte le résultat de tout un exercice. C'est le piège le plus fréquent du chapitre.`,
          },
          questions: [
            ['Quelle propriété caractérise la fonction exponentielle ?', ['Elle est égale à sa propre dérivée et vaut 1 en 0', 'Elle est égale à son inverse', 'Sa dérivée est nulle', 'Elle s’annule en 0'], 0, 'f’ = f et f(0) = 1 la définissent entièrement.'],
            ['Que vaut e puissance (a + b) ?', ['e puissance a × e puissance b', 'e puissance a + e puissance b', 'e puissance (a × b)', 'e puissance a / e puissance b'], 0, 'L’exponentielle transforme les sommes en produits.'],
            ['L’équation e puissance x = 0 admet-elle une solution ?', ['Non, l’exponentielle est strictement positive', 'Oui, x = 0', 'Oui, x = 1', 'Oui, quand x tend vers moins l’infini'], 0, 'Elle tend vers 0 sans jamais l’atteindre.'],
            ['La fonction exponentielle est strictement croissante sur l’ensemble des réels.', ['Vrai', 'Faux'], 0, 'Sa dérivée, égale à elle-même, est strictement positive.'],
            ['Quelle est la dérivée de e puissance u ?', ['u’ × e puissance u', 'e puissance u', 'u × e puissance u', 'e puissance u’'], 0, 'Oublier le facteur u’ est le piège le plus fréquent du chapitre.'],
            ['Que vaut la dérivée de e puissance (3x) ?', ['3 e puissance (3x)', 'e puissance (3x)', '3x e puissance (3x)', 'e puissance 3'], 0, 'Application directe de (e puissance u)’ = u’ × e puissance u.'],
            ['L’inéquation e puissance a < e puissance b équivaut à a < b.', ['Vrai', 'Faux'], 0, 'La stricte croissance de l’exponentielle conserve l’ordre.'],
            ['Vers quoi tend e puissance x quand x tend vers moins l’infini ?', ['Vers 0', 'Vers moins l’infini', 'Vers 1', 'Vers plus l’infini'], 0, 'Sans jamais atteindre 0 : l’axe des abscisses est asymptote.'],
          ],
        },
        {
          titre: 'Fonctions trigonométriques',
          axe: 'Analyse',
          lecon: {
            titre: 'Cercle trigonométrique, cosinus et sinus',
            cours: `Le cercle trigonométrique est le cercle de rayon 1 centré à l'origine, orienté dans le sens direct. À tout réel x on associe le point M obtenu en parcourant une longueur x depuis le point (1 ; 0).

## Cosinus et sinus
Les coordonnées de M sont (cos x ; sin x). Il en découle immédiatement :

| La propriété | Ce qu'elle dit | D'où elle vient |
| Encadrement | −1 ≤ cos x ≤ 1 et −1 ≤ sin x ≤ 1 | M est sur un cercle de rayon 1 |
| **Relation fondamentale** | cos² x + sin² x = 1 | Le théorème de Pythagore dans ce cercle |

## Le radian
Le radian mesure un angle par la longueur d'arc qu'il intercepte sur le cercle de rayon 1.

| En radians | En degrés |
| 2π | 360° |
| π | 180° |
| π/2 | 90° |
| π/3 | 60° |
| π/4 | 45° |
| π/6 | 30° |

## Les valeurs remarquables
| x | cos x | sin x |
| 0 | 1 | 0 |
| π/6 | √3 / 2 | 1/2 |
| π/4 | √2 / 2 | √2 / 2 |
| π/3 | 1/2 | √3 / 2 |
| π/2 | 0 | 1 |

## Périodicité et parité
| La fonction | Sa période | Sa parité | La symétrie de sa courbe |
| **Cosinus** | 2π | **Paire** : cos(−x) = cos x | Par rapport à l'axe des ordonnées |
| **Sinus** | 2π | **Impaire** : sin(−x) = −sin x | Par rapport à l'origine |

> Périodiques de période 2π : il suffit de les étudier sur un intervalle de longueur 2π.

## Angles associés
| L'angle | Son cosinus | Son sinus |
| π − x | −cos x | sin x |
| π + x | −cos x | −sin x |
| −x | cos x | −sin x |

> Plutôt que de les apprendre, on les **relit** sur le cercle : cela évite les erreurs de signe.

## Dérivées
(sin x)' = cos x et (cos x)' = −sin x

> Le signe moins se retrouve sur la courbe : le cosinus décroît là où le sinus est positif.`,
          },
          questions: [
            ['Quelles sont les coordonnées du point associé au réel x sur le cercle trigonométrique ?', ['(cos x ; sin x)', '(sin x ; cos x)', '(x ; cos x)', '(1 ; x)'], 0, 'Le cercle a pour rayon 1 et pour centre l’origine.'],
            ['Quelle relation lie cosinus et sinus d’un même réel ?', ['cos² x + sin² x = 1', 'cos x + sin x = 1', 'cos x × sin x = 1', 'cos² x − sin² x = 1'], 0, 'C’est le théorème de Pythagore dans un cercle de rayon 1.'],
            ['Combien de radians vaut un tour complet ?', ['2π', 'π', '360', 'π/2'], 0, 'π radians valent 180 degrés.'],
            ['La fonction sinus est paire.', ['Vrai', 'Faux'], 1, 'Elle est IMPAIRE : sin(−x) = −sin x. C’est le cosinus qui est pair.'],
            ['Que vaut cos(π/3) ?', ['1/2', '√3 / 2', '√2 / 2', '0'], 0, 'Et sin(π/3) vaut √3 / 2 : ne pas les intervertir.'],
            ['Quelle est la dérivée de la fonction cosinus ?', ['−sin x', 'sin x', 'cos x', '−cos x'], 0, 'Le signe moins est ce qu’on oublie le plus souvent.'],
            ['Les fonctions cosinus et sinus sont périodiques de période 2π.', ['Vrai', 'Faux'], 0, 'Il suffit donc de les étudier sur un intervalle de longueur 2π.'],
            ['Que vaut sin(π/2) ?', ['1', '0', '1/2', '√2 / 2'], 0, 'Au quart de tour, le point est en haut du cercle : ordonnée 1.'],
          ],
        },

        // ---- Chapitre 3 : géométrie ------------------------------------------
        {
          titre: 'Calcul vectoriel et produit scalaire',
          axe: 'Géométrie',
          lecon: {
            titre: 'Quatre expressions, une seule notion',
            cours: `Le produit scalaire de deux vecteurs est un nombre réel, non un vecteur. C'est la première chose à ne pas confondre.

## Les quatre expressions
| L'expression | Sa formule | Quand l'employer |
| Par **coordonnées** (repère orthonormé) | u · v = x x' + y y' | On a les coordonnées |
| Par **normes et angle** | u · v = norme de u × norme de v × cos θ | On a des longueurs et un angle |
| Par **projection orthogonale** | On projette un vecteur sur la direction de l'autre, puis on multiplie les mesures algébriques | Une figure géométrique |
| Par **normes seules** | u · v = ½ (norme de (u + v) au carré − norme de u au carré − norme de v au carré) | On n'a que des longueurs |

> Savoir passer de l'une à l'autre est l'essentiel du chapitre : c'est le choix de l'expression, plus que le calcul, qui décide de la difficulté.

## Propriétés
| La propriété | Son énoncé |
| **Symétrie** | u · v = v · u |
| **Bilinéarité** | u · (v + w) = u · v + u · w, et (k u) · v = k (u · v) |
| **Carré scalaire** | u · u = norme de u au carré |

## Le critère d'orthogonalité
Deux vecteurs **non nuls** sont orthogonaux **si et seulement si** leur produit scalaire est nul.

En coordonnées : x x' + y y' = 0.

> C'est le critère le plus utilisé du chapitre : il transforme une question de géométrie en un calcul.

## Les applications
| L'application | Ce qu'elle donne |
| **Angles** | La deuxième expression donne cos θ, donc l'angle |
| **Théorème d'Al-Kashi** | a² = b² + c² − 2 b c cos A, dans un triangle quelconque |
| **Lieux de points** | Cercles, droites, médiatrices définis par une relation vectorielle |

> Al-Kashi généralise Pythagore : pour A = 90°, cos A = 0 et l'on retrouve a² = b² + c².`,
          },
          questions: [
            ['Le produit scalaire de deux vecteurs est…', ['un nombre réel', 'un vecteur', 'un angle', 'une longueur toujours positive'], 0, 'La confusion avec un vecteur est l’erreur d’entrée du chapitre.'],
            ['Comment calcule-t-on le produit scalaire en repère orthonormé ?', ['x x’ + y y’', 'x x’ − y y’', 'x y’ + y x’', 'x y’ − y x’'], 0, 'La dernière expression est celle du déterminant, pas du produit scalaire.'],
            ['Deux vecteurs non nuls sont orthogonaux si et seulement si leur produit scalaire est nul.', ['Vrai', 'Faux'], 0, 'C’est le critère le plus employé du chapitre.'],
            ['Quelle expression fait intervenir l’angle entre les deux vecteurs ?', ['||u|| × ||v|| × cos θ', 'x x’ + y y’', '½ (||u + v||² − ||u||² − ||v||²)', 'u · u'], 0, 'Elle permet de calculer un angle à partir des coordonnées.'],
            ['Que vaut u · u ?', ['Le carré de la norme de u', 'La norme de u', 'Zéro', 'Le double de la norme de u'], 0, 'C’est ce qui relie produit scalaire et longueur.'],
            ['Que devient le théorème d’Al-Kashi quand l’angle A vaut 90° ?', ['Le théorème de Pythagore', 'La loi des sinus', 'L’inégalité triangulaire', 'Rien de connu'], 0, 'cos 90° = 0 fait disparaître le troisième terme.'],
            ['Le produit scalaire est symétrique : u · v = v · u.', ['Vrai', 'Faux'], 0, 'Il est aussi bilinéaire, ce qui autorise à développer comme avec des nombres.'],
            ['Quelle méthode consiste à ramener un vecteur sur la direction de l’autre ?', ['La projection orthogonale', 'Le calcul par coordonnées', 'Le théorème d’Al-Kashi', 'La bilinéarité'], 0, 'On multiplie ensuite les mesures algébriques obtenues.'],
          ],
        },
        {
          titre: 'Géométrie repérée',
          axe: 'Géométrie',
          lecon: {
            titre: 'Droites, cercles et équations',
            cours: `La géométrie repérée traduit les figures en équations : ce qui se démontrait par construction se calcule.

## Les droites
| L'équation | Son écriture | Ce qu'elle donne |
| **Cartésienne** | a x + b y + c = 0, a et b non tous deux nuls | Vecteur **directeur** u(−b ; a) ; vecteur **normal** n(a ; b) |
| **Réduite** | y = m x + p | m, coefficient directeur ; p, ordonnée à l'origine |

> L'équation réduite ne convient pas aux droites **verticales**, d'équation x = k.

Coefficient directeur de la droite (AB) :

m = (y(B) − y(A)) / (x(B) − x(A))

## Parallélisme et orthogonalité
| La relation | Par les coefficients directeurs | Par les vecteurs directeurs |
| **Parallèles** | m = m' | Colinéaires : x y' − y x' = 0 |
| **Perpendiculaires** | m × m' = **−1** | Produit scalaire nul |

## Les cercles
Cercle de centre Ω(a ; b) et de rayon r :

(x − a)² + (y − b)² = r²

Une équation développée x² + y² + α x + β y + γ = 0 se ramène à cette forme en **complétant les carrés** — la technique de la forme canonique du second degré.

| Le membre de droite obtenu | L'ensemble |
| Strictement **positif** | Un cercle |
| **Nul** | Un seul **point** |
| **Négatif** | L'ensemble **vide** |

> Autre caractérisation utile : le cercle de **diamètre** [AB] est l'ensemble des points M tels que les vecteurs MA et MB aient un produit scalaire nul — l'angle en M est droit.

## Les formules de base
| La grandeur | Sa formule |
| Milieu de [AB] | ((x(A) + x(B)) / 2 ; (y(A) + y(B)) / 2) |
| Distance AB | √((x(B) − x(A))² + (y(B) − y(A))²) |

> Beaucoup de problèmes se résolvent en traduisant l'énoncé en équations, puis en résolvant un système. La figure ne sert alors qu'à contrôler la vraisemblance.`,
          },
          questions: [
            ['Quel est un vecteur directeur de la droite d’équation a x + b y + c = 0 ?', ['u(−b ; a)', 'u(a ; b)', 'u(b ; a)', 'u(a ; −b)'], 0, 'Le vecteur n(a ; b), lui, est normal à la droite.'],
            ['Quelle est l’équation d’un cercle de centre Ω(a ; b) et de rayon r ?', ['(x − a)² + (y − b)² = r²', '(x + a)² + (y + b)² = r²', 'x² + y² = a² + b²', '(x − a) + (y − b) = r'], 0, 'La forme développée s’y ramène en complétant les carrés.'],
            ['Deux droites sont perpendiculaires si le produit de leurs coefficients directeurs vaut −1.', ['Vrai', 'Faux'], 0, 'On peut aussi le voir par un produit scalaire nul entre vecteurs directeurs.'],
            ['Comment reconnaît-on que deux vecteurs sont colinéaires ?', ['Leur déterminant x y’ − y x’ est nul', 'Leur produit scalaire est nul', 'Leurs normes sont égales', 'Leur somme est nulle'], 0, 'Le produit scalaire nul, lui, caractérise l’orthogonalité.'],
            ['Quelle droite ne peut pas s’écrire sous la forme y = m x + p ?', ['Une droite verticale', 'Une droite horizontale', 'Une droite passant par l’origine', 'Une droite de coefficient directeur négatif'], 0, 'Elle s’écrit x = k.'],
            ['Comment ramène-t-on une équation développée de cercle à sa forme canonique ?', ['En complétant les carrés', 'En calculant le discriminant', 'En dérivant', 'En factorisant par x'], 0, 'Même technique que pour la forme canonique du trinôme.'],
            ['Le cercle de diamètre [AB] est l’ensemble des points M tels que le produit scalaire des vecteurs MA et MB soit nul.', ['Vrai', 'Faux'], 0, 'L’angle en M est alors droit : c’est une caractérisation très commode.'],
            ['Quelle est la formule de la distance entre A et B en repère orthonormé ?', ['√((x(B) − x(A))² + (y(B) − y(A))²)', '(x(B) − x(A)) + (y(B) − y(A))', '√(x(B) × x(A) + y(B) × y(A))', '|x(B) − x(A)| + |y(B) − y(A)|'], 0, 'C’est le théorème de Pythagore appliqué aux coordonnées.'],
          ],
        },

        // ---- Chapitre 4 : probabilités et statistiques ----------------------
        {
          titre: 'Probabilités conditionnelles et indépendance',
          axe: 'Probabilité et statistiques',
          lecon: {
            titre: 'Arbre pondéré et probabilités totales',
            cours: `La probabilité conditionnelle de B sachant A est la probabilité que B se réalise une fois qu'on sait que A est réalisé.

Pour P(A) différent de 0 :

P(A)(B) = P(A inter B) / P(A)

d'où la relation la plus utilisée du chapitre :

P(A inter B) = P(A) × P(A)(B)

## L'arbre pondéré
| La règle | Son énoncé |
| **Somme** | Les branches issues d'un même nœud ont des probabilités de somme 1 |
| **Produit** | La probabilité d'un **chemin** est le produit des probabilités de ses branches |
| **Somme des chemins** | La probabilité d'un **événement** est la somme des chemins qui y mènent |

> Les branches du deuxième niveau portent des probabilités **conditionnelles**. C'est là que se joue la lecture correcte d'un énoncé.

## La formule des probabilités totales
Si A et son contraire partitionnent l'univers :

P(B) = P(A) × P(A)(B) + P(A barre) × P(A barre)(B)

> C'est exactement la troisième règle de l'arbre, écrite en formule.

## L'indépendance
A et B sont indépendants si la réalisation de l'un ne change pas la probabilité de l'autre :

P(A inter B) = P(A) × P(B), ou de façon équivalente P(A)(B) = P(B)

| À ne pas confondre | Pourquoi |
| **Indépendants** et **incompatibles** | Deux événements incompatibles de probabilités non nulles ne sont **jamais** indépendants : si l'un se réalise, l'autre devient impossible |
| Deviner et démontrer | L'indépendance se **démontre** par le calcul ; elle ne se devine pas |

## Ce qu'il faut savoir inverser
Beaucoup d'exercices donnent P(A)(B) et demandent P(B)(A) : un test médical dont on connaît la fiabilité, et dont on cherche la probabilité d'être malade **sachant** le test positif.

| L'étape | Le calcul |
| 1 | P(A inter B), par le produit des branches |
| 2 | P(B), par les probabilités totales |
| 3 | Le quotient P(A inter B) / P(B) |`,
          },
          questions: [
            ['Quelle est la formule de la probabilité conditionnelle de B sachant A ?', ['P(A inter B) / P(A)', 'P(A inter B) / P(B)', 'P(A) × P(B)', 'P(A) + P(B)'], 0, 'Elle suppose P(A) non nulle.'],
            ['Comment calcule-t-on la probabilité d’un chemin dans un arbre pondéré ?', ['En multipliant les probabilités des branches du chemin', 'En les additionnant', 'En prenant la plus petite', 'En prenant la dernière'], 0, 'La probabilité d’un événement est ensuite la somme des chemins qui y mènent.'],
            ['La somme des probabilités des branches issues d’un même nœud vaut 1.', ['Vrai', 'Faux'], 0, 'C’est le premier contrôle à faire sur un arbre.'],
            ['Que dit la formule des probabilités totales ?', ['P(B) se décompose selon les événements d’une partition de l’univers', 'P(B) est toujours égale à P(A)', 'P(B) est le produit des probabilités conditionnelles', 'P(B) vaut 1 moins P(A)'], 0, 'C’est la troisième règle de l’arbre, écrite en formule.'],
            ['Quelle égalité caractérise deux événements indépendants ?', ['P(A inter B) = P(A) × P(B)', 'P(A inter B) = 0', 'P(A) = P(B)', 'P(A union B) = P(A) + P(B)'], 0, 'Équivalente à P(A)(B) = P(B) lorsque P(A) est non nulle.'],
            ['Deux événements incompatibles de probabilités non nulles sont indépendants.', ['Vrai', 'Faux'], 1, 'Si l’un se réalise, l’autre devient impossible : sa probabilité change.'],
            ['Que portent les branches du deuxième niveau d’un arbre pondéré ?', ['Des probabilités conditionnelles', 'Des probabilités simples', 'Des effectifs', 'Des fréquences cumulées'], 0, 'C’est ce que la lecture d’un énoncé doit permettre d’identifier.'],
            ['Comment obtient-on P(B)(A) quand l’énoncé donne P(A)(B) ?', ['En calculant P(A inter B) et P(B), puis leur quotient', 'En inversant simplement les lettres', 'En multipliant par P(A)', 'C’est impossible'], 0, 'C’est la structure de tous les exercices de test médical.'],
          ],
        },
        {
          titre: 'Variable aléatoire et loi de probabilité',
          axe: 'Probabilité et statistiques',
          lecon: {
            titre: 'Espérance, variance, écart type',
            cours: `Une variable aléatoire X associe un nombre réel à chaque issue d'une expérience aléatoire : elle transforme des issues quelconques en valeurs sur lesquelles on peut calculer.

## La loi de probabilité
Donner la loi de X, c'est donner toutes ses valeurs possibles et la probabilité de chacune, en tableau.

> Contrôle obligatoire : la **somme des probabilités vaut 1**.

## L'espérance
E(X) = somme des x(i) × P(X = x(i))

C'est la valeur moyenne que prendrait X sur un très grand nombre de répétitions.

| L'espérance de gain | Le jeu est… |
| **Positive** | Favorable au **joueur** |
| **Négative** | Favorable à l'**organisateur** |
| **Nulle** | **Équitable** |

> L'espérance n'est pas forcément une valeur atteignable : celle du lancer d'un dé équilibré vaut 3,5.

## Variance et écart type
V(X) = somme des x(i)² × P(X = x(i)) − [E(X)]²

σ(X) = √(V(X))

| La grandeur | Ce qu'elle mesure | Son unité |
| **Variance** | La dispersion autour de l'espérance | Le carré de celle de X |
| **Écart type** | La même dispersion, ramenée à l'échelle | Celle de X, donc **interprétable** |

> Deux variables de même espérance peuvent avoir des écarts types très différents : la même moyenne ne dit rien du risque.

## Les propriétés
| La transformation | L'espérance | La variance |
| aX + b | a E(X) + b | **a² V(X)** |

> Le b **disparaît** de la variance — une translation ne change pas la dispersion — et le a y est **au carré**.

## L'échantillonnage
Si l'on répète n fois la même expérience de façon indépendante, la moyenne des résultats se rapproche de l'espérance quand n grandit : c'est la **loi des grands nombres**.

> C'est elle qui justifie les simulations, et qui explique pourquoi un casino ne perd pas sur le long terme même s'il perd sur un coup.`,
          },
          questions: [
            ['Qu’est-ce qu’une variable aléatoire ?', ['Une fonction qui associe un nombre réel à chaque issue d’une expérience aléatoire', 'Un événement de probabilité inconnue', 'Une probabilité qui varie', 'Un tirage au hasard'], 0, 'Elle rend l’univers numérique, donc calculable.'],
            ['Que vaut la somme des probabilités d’une loi de probabilité ?', ['1', '0', 'L’espérance', 'Le nombre de valeurs possibles'], 0, 'C’est le contrôle à faire systématiquement sur un tableau de loi.'],
            ['Comment calcule-t-on l’espérance d’une variable aléatoire ?', ['En sommant les produits de chaque valeur par sa probabilité', 'En faisant la moyenne des valeurs possibles', 'En prenant la valeur la plus probable', 'En divisant la somme des valeurs par leur nombre'], 0, 'Ce n’est pas une moyenne simple : chaque valeur est pondérée.'],
            ['L’espérance d’une variable aléatoire est toujours une valeur qu’elle peut prendre.', ['Vrai', 'Faux'], 1, 'L’espérance du lancer d’un dé équilibré vaut 3,5, valeur impossible.'],
            ['Que signifie une espérance de gain nulle dans un jeu d’argent ?', ['Le jeu est équitable', 'Le jeu est favorable au joueur', 'Le jeu est favorable à l’organisateur', 'Le jeu est impossible'], 0, 'Ni le joueur ni l’organisateur ne gagnent en moyenne.'],
            ['Que vaut V(aX + b) ?', ['a² V(X)', 'a V(X) + b', 'a² V(X) + b²', 'a V(X)'], 0, 'Le b disparaît : une translation ne change pas la dispersion.'],
            ['À quoi sert l’écart type par rapport à la variance ?', ['Il ramène la dispersion à l’unité de la variable, donc l’interprète', 'Il est plus facile à calculer', 'Il est toujours plus grand', 'Il donne l’espérance'], 0, 'C’est la racine carrée de la variance.'],
            ['Que dit la loi des grands nombres ?', ['La moyenne d’un grand nombre de répétitions se rapproche de l’espérance', 'Chaque tirage compense le précédent', 'La probabilité augmente avec le nombre d’essais', 'L’écart type tend vers l’espérance'], 0, 'C’est ce qui explique qu’un casino ne perde pas sur le long terme.'],
          ],
        },
      ],
    },
  ],
}
