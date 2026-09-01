// MATHS EXPERTES TERMINALE (option) — les 12 fiches du programme officiel, dans
// l'ordre de ses 3 chapitres : « Nombres complexes » (5), « Arithmétique » (3),
// « Graphes et matrices » (4).
//
// MATIÈRE À PART, ET NON UN CHAPITRE DE `maths`. La maquette de référence range
// ces trois chapitres dans le dossier « Maths Tle », sous des titres préfixés
// « Option mathématiques expertes : … ». L'app a une matière `maths-expertes`
// depuis l'origine, cochable séparément dans « Ma classe » : les fiches y
// restent, et le préfixe disparaît — le dossier dit déjà de quelle option il
// s'agit, le répéter sur chaque en-tête de chapitre coûterait deux lignes de
// titre sans rien apprendre.
//
// Ce module part dans la MÊME migration 255 que `maths-tle.mjs` et
// `maths-complementaires-tle.mjs` : les trois matières se tiennent, et l'élève
// qui les suit toutes les trois n'a qu'un seul collage à faire.
//
// PÉRIMÈTRE : `maths-expertes` n'existe qu'au niveau Tle (sondé le 20/08/2026).
// Le ménage y est tout de même borné à level = 'Tle', pour rester juste si la
// matière était un jour ouverte ailleurs.

export default {
  slug: 'maths-expertes',
  nom: 'Maths expertes',

  menage: [
    {
      raison: `Les 3 fiches composites de MATHS EXPERTES partent, au niveau Tle. Ce sont
des résumés d'un chapitre entier en une fiche, que les 12 fiches neuves
recouvrent : « Nombres complexes » se lit désormais en les cinq fiches du
chapitre 1, « Arithmétique : congruences » en les trois du chapitre 2,
« Matrices et graphes » en les quatre du chapitre 3.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux TROIS TITRES EXACTS et au seul niveau Tle. Sans
cette borne, un rejeu effacerait les quiz des 12 fiches neuves — le ménage tourne
avant les insertions à CHAQUE passage.
Aucun des trois titres ne porte d'apostrophe : pas de piège typographique ici.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths-expertes'
   AND c.level = 'Tle'
   AND c.title IN ('Nombres complexes',
                   'Arithmétique : congruences',
                   'Matrices et graphes');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths-expertes'
   AND c.level = 'Tle'
   AND c.title IN ('Nombres complexes',
                   'Arithmétique : congruences',
                   'Matrices et graphes');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths-expertes'
   AND c.level = 'Tle'
   AND c.title IN ('Nombres complexes',
                   'Arithmétique : congruences',
                   'Matrices et graphes');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Nombres complexes ----------------------------------
        {
          titre: 'Les nombres complexes d’un point de vue algébrique',
          axe: 'Nombres complexes',
          lecon: {
            titre: 'Un nombre dont le carré vaut −1',
            cours: `On construit un ensemble plus grand que ℝ en y ajoutant un nombre **i** vérifiant **i² = −1**. Toutes les règles de calcul de ℝ y restent valables.

## La forme algébrique
Tout nombre complexe z s’écrit de façon **unique** : z = a + i b, avec a et b **réels**.

| Notation | Ce qu’elle désigne |
| **a = Re(z)** | La partie **réelle** |
| **b = Im(z)** | La partie **imaginaire** — c’est un **réel**, pas un imaginaire |
| b = 0 | z est **réel** |
| a = 0 | z est **imaginaire pur** |

> Deux complexes sont égaux si et seulement si leurs parties réelles **et** imaginaires le sont : une équation complexe équivaut à **deux** équations réelles. C’est la technique de résolution la plus employée.

## Les opérations
Somme et produit se calculent comme avec des expressions littérales, en remplaçant i² par −1 :

(a + ib)(c + id) = (ac − bd) + i(ad + bc)

## Le conjugué
Le conjugué de z = a + ib est z̄ = a − ib.

| Propriété | Ce qu’elle donne |
| Conjugué d’une somme, d’un produit, d’un quotient | La somme, le produit, le quotient des conjugués |
| **z × z̄ = a² + b²** | Un **réel positif** — c’est ce qui rend toutes les divisions possibles |
| z + z̄ = 2 Re(z) | — |
| z − z̄ = 2i Im(z) | — |
| z = z̄ | z est **réel** |
| z = −z̄ | z est **imaginaire pur** |

## Le quotient
Pour diviser, on **multiplie numérateur et dénominateur par le conjugué du dénominateur** : le dénominateur devient réel, et l’on obtient la forme algébrique.

> C’est le geste technique de base du chapitre.

## Le module
Le module de z = a + ib vaut √(a² + b²), et son carré vaut z × z̄.

| Propriété | Ce qu’elle dit |
| Il est **positif ou nul** | Et nul seulement si z = 0 |
| Module d’un **produit** | Le produit des modules |
| Module d’un **quotient** | Le quotient des modules |
| Module d’une **puissance** | La puissance du module |
| Module d’une **somme** | **Inférieur ou égal** à la somme des modules — inégalité triangulaire |

> Le module n’est **pas** additif. C’est la seule des cinq propriétés qui soit une inégalité, et c’est celle qu’on oublie.

## Ce que ℂ perd
ℂ n’est **pas ordonné** : écrire z < z′ n’a **aucun sens** pour des complexes non réels. On ne peut comparer que des **modules**, qui sont des réels.

> C’est la faute la plus lourde d’une copie. Toute la suite du chapitre découle de deux formules : **i² = −1**, qui fait exister ℂ, et **z z̄ = module au carré**, qui y rend la division possible.`,
          },
          questions: [
            ['Que vaut i² ?', ['−1', '1', '0', 'i'], 0, 'C’est la définition même du nombre i, qui fonde tout le chapitre.'],
            ['Dans z = a + ib, la partie imaginaire de z est…', ['b, un nombre réel', 'ib', 'i', 'a'], 0, 'La partie imaginaire est un réel : c’est un piège de vocabulaire fréquent.'],
            ['Que vaut z × z̄ pour z = a + ib ?', ['a² + b², un réel positif', 'a² − b²', 'a² + b² + 2iab', '2a'], 0, 'C’est aussi |z|², et c’est ce qui rend la division possible.'],
            ['Comment met-on un quotient de complexes sous forme algébrique ?', ['En multipliant numérateur et dénominateur par le conjugué du dénominateur', 'En divisant les parties réelles entre elles', 'En passant au module', 'En élevant au carré'], 0, 'Le dénominateur devient alors réel.'],
            ['z est réel si et seulement si…', ['z = z̄', 'z = −z̄', '|z| = 1', 'Re(z) = 0'], 0, 'z est imaginaire pur si et seulement si z = −z̄.'],
            ['Le module vérifie-t-il |z + z′| = |z| + |z′| ?', ['Non, on a seulement l’inégalité triangulaire', 'Oui, toujours', 'Oui, si z et z′ sont réels positifs uniquement', 'Non, on a toujours l’égalité inverse'], 0, 'Le module est multiplicatif, pas additif.'],
            ['Peut-on comparer deux nombres complexes avec le signe < ?', ['Non, ℂ n’est pas ordonné ; on ne compare que les modules', 'Oui, comme dans ℝ', 'Oui, en comparant les parties réelles', 'Oui, en comparant les modules et les arguments'], 0, 'C’est la faute la plus lourde d’une copie sur ce chapitre.'],
            ['Une égalité entre deux complexes équivaut à combien d’égalités réelles ?', ['Deux', 'Une', 'Trois', 'Aucune'], 0, 'Parties réelles égales ET parties imaginaires égales.'],
          ],
        },
        {
          titre: 'Le point de vue géométrique des nombres complexes',
          axe: 'Nombres complexes',
          lecon: {
            titre: 'Chaque complexe est un point du plan',
            cours: `Le vrai pouvoir des complexes est de traduire une **figure du plan en calcul**. Cette fiche installe le dictionnaire entre les deux langues.

## L’affixe
Dans un repère orthonormé direct, au complexe z = a + ib on associe le point **M(a ; b)**, son **image** ; réciproquement z est l’**affixe** de M. On associe de même une affixe à un **vecteur**.

## Le dictionnaire
| L’objet géométrique | Son écriture complexe |
| L’affixe du vecteur AB | z(B) − z(A) |
| La **distance** AB | Le **module** de z(B) − z(A) |
| Le **milieu** de [AB] | (z(A) + z(B))/2 |
| Le symétrique par rapport à l’axe des abscisses | Le **conjugué** z̄ |
| Le symétrique par rapport à l’origine | **−z** |

## Module et argument
Pour z non nul, l’**argument** est une mesure de l’angle orienté entre l’axe des abscisses et le vecteur d’affixe z. Il est défini **modulo 2π** : un complexe a une **infinité** d’arguments.

> Le complexe **0 n’a pas d’argument** — son module est nul, aucune direction n’est définie. C’est l’oubli le plus fréquent des conditions d’existence.

## La forme trigonométrique
En posant r le module et θ l’argument : z = r (cos θ + i sin θ)

Le passage de l’algébrique au trigonométrique : calculer r, puis résoudre cos θ = a/r **et** sin θ = b/r.

> Il faut les **deux** équations : le cosinus seul laisse deux angles possibles.

## Les propriétés des arguments
| Opération | Son argument |
| Produit zz′ | arg z **+** arg z′ |
| Quotient z/z′ | arg z **−** arg z′ |
| Puissance zⁿ | **n** arg z |
| Conjugué z̄ | **−** arg z |

> **Multiplier, c’est additionner les arguments.** C’est ce qui fait du produit complexe une **rotation** doublée d’un agrandissement.

## Les caractérisations géométriques
| La condition | L’ensemble ou la propriété |
| Le module de z − z(A) vaut R | Le **cercle** de centre A et de rayon R |
| Le module de z − z(A) égale celui de z − z(B) | La **médiatrice** de [AB] |
| L’argument d’un quotient de différences d’affixes | L’**angle** entre deux vecteurs |

## Les deux configurations à connaître
En posant Z = (z(C) − z(A))/(z(B) − z(A)) :

| Z est… | Alors |
| **Réel** | A, B, C sont **alignés** |
| **Imaginaire pur** | Les droites (AB) et (AC) sont **perpendiculaires** |

> Ces deux critères transforment une question de géométrie en une question sur une **partie réelle ou imaginaire**.

> Le pont est toujours le même : une **distance** est un module, un **angle** est un argument. Toute figure se traduit avec ces deux mots.`,
          },
          questions: [
            ['Que représente |z(B) − z(A)| ?', ['La distance AB', 'L’angle entre deux vecteurs', 'L’affixe du milieu de [AB]', 'L’aire du triangle'], 0, 'Un module est toujours une distance dans le plan complexe.'],
            ['Le complexe 0 possède-t-il un argument ?', ['Non, aucun', 'Oui, il vaut 0', 'Oui, il vaut π', 'Oui, une infinité'], 0, 'Son module est nul : aucune direction n’est définie.'],
            ['Que vaut arg(z z′) ?', ['arg z + arg z′', 'arg z × arg z′', 'arg z − arg z′', 'arg(z) / arg(z′)'], 0, 'Multiplier, c’est additionner les arguments.'],
            ['Quelle est la forme trigonométrique d’un complexe non nul ?', ['r (cos θ + i sin θ) avec r = |z| et θ = arg z', 'a + ib', 'r + iθ', 'cos θ + i sin θ uniquement'], 0, 'Le passage exige de résoudre les deux équations cos θ = a/r et sin θ = b/r.'],
            ['Quel ensemble décrit l’équation |z − z(A)| = R ?', ['Le cercle de centre A et de rayon R', 'La médiatrice de [OA]', 'Une droite passant par A', 'Un disque plein'], 0, '|z − z(A)| = |z − z(B)| décrit, elle, la médiatrice de [AB].'],
            ['Trois points A, B, C sont alignés si et seulement si…', ['Le quotient (z(C) − z(A))/(z(B) − z(A)) est réel', 'Ce quotient est imaginaire pur', 'Ce quotient a un module égal à 1', 'Ce quotient est nul'], 0, 'S’il est imaginaire pur, les droites (AB) et (AC) sont perpendiculaires.'],
            ['L’argument d’un complexe est défini modulo 2π.', ['Vrai', 'Faux'], 0, 'Un complexe non nul possède donc une infinité d’arguments.'],
            ['Quelle est l’image du conjugué de z ?', ['Le symétrique de M par rapport à l’axe des abscisses', 'Le symétrique par rapport à l’origine', 'Le symétrique par rapport à l’axe des ordonnées', 'Le point M lui-même'], 0, 'L’image de −z est, elle, le symétrique par rapport à l’origine.'],
          ],
        },
        {
          titre: 'Nombres complexes et trigonométrie',
          axe: 'Nombres complexes',
          lecon: {
            titre: 'La notation exponentielle, et tout devient simple',
            cours: `La forme exponentielle transforme les identités trigonométriques les plus pénibles en simples règles de calcul sur les **puissances**.

## La notation exponentielle
Pour tout réel θ : e^(iθ) = cos θ + i sin θ

Tout complexe non nul de module r et d’argument θ s’écrit **z = r e^(iθ)**.

> Ce n’est pas une convention arbitraire : elle est choisie parce que e^(iθ) × e^(iθ′) = e^(i(θ+θ′)), **exactement comme les exponentielles réelles**.

## Les valeurs remarquables
| Angle | Valeur |
| e^(i0) | 1 |
| e^(iπ/2) | **i** |
| e^(iπ) | **−1** |
| e^(3iπ/2) | −i |
| e^(2iπ) | 1 |

> L’identité **e^(iπ) + 1 = 0** réunit en cinq symboles les cinq constantes fondamentales des mathématiques.

## Les règles de calcul
| Opération | Résultat |
| Produit | r r′ e^(i(θ+θ′)) |
| Quotient | (r/r′) e^(i(θ−θ′)) |
| **Formule de Moivre** | (r e^(iθ))ⁿ = rⁿ e^(inθ) |
| Conjugué | r e^(−iθ) |
| Inverse | (1/r) e^(−iθ) |

> Élever à une puissance devient **immédiat**, là où la forme algébrique exigerait de développer un binôme.

## Les formules d’Euler
En additionnant et en soustrayant e^(iθ) et e^(−iθ) :

cos θ = (e^(iθ) + e^(−iθ)) / 2 et sin θ = (e^(iθ) − e^(−iθ)) / (2i)

> Elles servent à **linéariser** : transformer cos²θ ou sin³θ en une somme de cosinus et de sinus d’angles multiples — indispensable pour **intégrer** ces expressions.

## Les quatre applications
| Application | La méthode |
| Formules d’**addition** | Développer e^(i(a+b)) = e^(ia) e^(ib), puis identifier parties réelles et imaginaires |
| Formules de **duplication** | Même méthode, avec e^(2iθ) |
| **Linéarisation** | Les formules d’Euler |
| **Factorisation** de e^(ia) + e^(ib) | Mettre en facteur l’exponentielle de l’**angle moyen** |

> On ne mémorise plus les formules de trigonométrie : on les **retrouve** en trois lignes.

## Les racines n-ièmes de l’unité
Les solutions de zⁿ = 1 sont les n complexes e^(2ikπ/n), pour k de 0 à n−1.

| Propriété | Ce qu’elle donne |
| Leurs images | Un **polygone régulier** à n côtés inscrit dans le cercle unité |
| Leur somme | **Nulle**, dès que n est supérieur ou égal à 2 |

> La forme **algébrique** sert à additionner, la forme **exponentielle** à multiplier et à élever à une puissance. Choisir la bonne écriture avant de calculer économise la moitié du travail.`,
          },
          questions: [
            ['Que vaut e^(iθ) ?', ['cos θ + i sin θ', 'cos θ − i sin θ', 'sin θ + i cos θ', 'e^θ (cos θ + i sin θ)'], 0, 'C’est la définition de la notation exponentielle.'],
            ['Que dit la formule de Moivre ?', ['(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)', 'cos(nθ) = n cos θ', 'e^(iθ) = 1 + iθ', 'cos²θ + sin²θ = 1'], 0, 'Élever à une puissance revient à multiplier l’argument par n.'],
            ['Quelle est l’expression de cos θ par les formules d’Euler ?', ['(e^(iθ) + e^(−iθ))/2', '(e^(iθ) − e^(−iθ))/2', '(e^(iθ) − e^(−iθ))/(2i)', 'e^(iθ)/2'], 0, 'Le sinus, lui, s’obtient avec la différence divisée par 2i.'],
            ['Que vaut e^(iπ) ?', ['−1', '1', 'i', '0'], 0, 'D’où l’identité e^(iπ) + 1 = 0.'],
            ['À quoi servent les formules d’Euler ?', ['À linéariser des puissances de cosinus et de sinus', 'À calculer des modules', 'À résoudre des équations du second degré', 'À déterminer un argument'], 0, 'La linéarisation est indispensable pour intégrer cos²θ ou sin³θ.'],
            ['Quel est le conjugué de r e^(iθ) ?', ['r e^(−iθ)', '−r e^(iθ)', '(1/r) e^(iθ)', 'r e^(iθ)'], 0, 'Conjuguer change le signe de l’argument, pas celui du module.'],
            ['Combien y a-t-il de racines n-ièmes de l’unité ?', ['n', 'Une seule', 'Deux', 'Une infinité'], 0, 'Leurs images forment un polygone régulier à n côtés inscrit dans le cercle unité.'],
            ['La somme des racines n-ièmes de l’unité est nulle pour n ≥ 2.', ['Vrai', 'Faux'], 0, 'C’est une conséquence de leur répartition régulière sur le cercle.'],
          ],
        },
        {
          titre: 'Équations polynomiales et nombres complexes',
          axe: 'Nombres complexes',
          lecon: {
            titre: 'Toute équation polynomiale a ses solutions',
            cours: `Le motif historique des complexes est ici : dans ℂ, **toute** équation polynomiale non constante admet des solutions. Aucune n’est plus « sans solution ».

## L’équation du second degré à coefficients réels
Pour a z² + b z + c = 0, on calcule Δ = b² − 4ac.

| Le signe de Δ | Les solutions |
| **Δ > 0** | Deux solutions **réelles** : (−b ± √Δ)/(2a) |
| **Δ = 0** | Une solution **double** : −b/(2a) |
| **Δ < 0** | Deux solutions **complexes conjuguées** : (−b ± i√(−Δ))/(2a) |

> Le passage de √Δ à **i√(−Δ)** est le seul changement par rapport à la Première. Les deux solutions sont **conjuguées l’une de l’autre** — propriété générale quand les coefficients sont réels.

## Le théorème fondamental de l’algèbre
Tout polynôme non constant à coefficients complexes admet **au moins une** racine dans ℂ. Par récurrence : un polynôme de degré n admet **exactement n racines** comptées avec leur multiplicité, et se **factorise** en un produit de n facteurs du premier degré.

> C’est ce résultat qui justifie qu’on ne cherche plus jamais si une équation « a des solutions » : on cherche **lesquelles**.

## Coefficients réels et racines conjuguées
Si un polynôme est à coefficients **réels** et admet la racine z, alors **z̄ est aussi racine** : les racines non réelles vont **par paires**.

> Conséquence utile : un polynôme de degré **impair** à coefficients réels admet **au moins une racine réelle**.

## La factorisation
Connaître une racine évidente z₀ permet de factoriser par (z − z₀). Le quotient s’obtient par **identification des coefficients** : poser la forme du quotient avec des coefficients inconnus, développer, identifier. C’est la méthode attendue pour un degré 3.

| Relation | Sa valeur |
| Somme des racines d’un trinôme | −b/a |
| Produit des racines | c/a |

Elles servent à retrouver la **seconde** racine quand la première est connue.

## Les équations zⁿ = a
Elles se résolvent en **forme exponentielle**. En écrivant a = r e^(iθ) et z = ρ e^(iφ), l’équation devient ρⁿ = r **et** nφ = θ + 2kπ. D’où n solutions :

z = r^(1/n) e^(i(θ + 2kπ)/n), pour k de 0 à n−1

Leurs images forment un **polygone régulier** à n côtés.

## Les trois erreurs à éviter
| Erreur | Ce qu’il faut écrire |
| √(−4) = 2i | Le symbole racine n’est **pas défini** sur les négatifs : passer par **i√4** |
| « Δ < 0, donc pas de solution » | **Deux** solutions conjuguées |
| Ne donner qu’une racine à zⁿ = a | Les **n** valeurs de k, de 0 à n−1 |

> Le passage de ℝ à ℂ ne change pas la **méthode** du second degré : il change seulement ce qu’on écrit quand Δ est négatif.`,
          },
          questions: [
            ['Que donne une équation du second degré à coefficients réels avec Δ < 0 ?', ['Deux solutions complexes conjuguées', 'Aucune solution', 'Une solution double', 'Deux solutions réelles'], 0, 'z = (−b ± i√(−Δ))/(2a).'],
            ['Que dit le théorème fondamental de l’algèbre ?', ['Tout polynôme non constant admet au moins une racine dans ℂ', 'Tout polynôme a des racines réelles', 'Un polynôme de degré n a n racines réelles', 'Toute équation a une solution unique'], 0, 'Un polynôme de degré n a donc exactement n racines comptées avec multiplicité.'],
            ['Si un polynôme à coefficients réels admet la racine z, que peut-on dire ?', ['z̄ est aussi racine', 'z est nécessairement réel', '−z est aussi racine', '1/z est aussi racine'], 0, 'Les racines non réelles vont par paires conjuguées.'],
            ['Un polynôme de degré impair à coefficients réels admet…', ['Au moins une racine réelle', 'Aucune racine réelle', 'Uniquement des racines complexes', 'Exactement une racine'], 0, 'Les racines non réelles allant par paires, il en reste au moins une réelle.'],
            ['Combien l’équation zⁿ = a (a non nul) admet-elle de solutions ?', ['n', 'Une seule', 'Deux', 'Une infinité'], 0, 'Leurs images forment un polygone régulier à n côtés.'],
            ['Comment résout-on l’équation zⁿ = a ?', ['En passant à la forme exponentielle', 'En développant le binôme', 'En calculant le discriminant', 'En prenant la racine n-ième réelle'], 0, 'On identifie module et argument, en n’oubliant pas le 2kπ.'],
            ['Peut-on écrire √(−4) = 2i ?', ['Non, le symbole racine n’est pas défini sur les négatifs', 'Oui, c’est la notation usuelle', 'Oui, si l’on précise le signe', 'Oui, mais seulement pour −1'], 0, 'Il faut écrire i√4, ou i × 2.'],
            ['Que valent la somme et le produit des racines de a z² + b z + c ?', ['S = −b/a et P = c/a', 'S = b/a et P = −c/a', 'S = −c/a et P = b/a', 'S = a/b et P = a/c'], 0, 'Elles permettent de retrouver la seconde racine quand la première est connue.'],
          ],
        },
        {
          titre: 'Utilisation des nombres complexes en géométrie',
          axe: 'Nombres complexes',
          lecon: {
            titre: 'Une transformation devient une opération',
            cours: `Le calcul complexe atteint sa pleine utilité ici : chaque transformation usuelle du plan s’écrit comme une **opération algébrique** sur les affixes.

## Le dictionnaire des transformations
| Transformation | Son écriture |
| **Translation** de vecteur d’affixe b | z′ = z + b |
| **Homothétie** de centre ω, de rapport k réel | z′ − ω = k (z − ω) |
| **Rotation** de centre ω, d’angle θ | z′ − ω = **e^(iθ)** (z − ω) |
| **Similitude directe** de centre ω, rapport k, angle θ | z′ − ω = k e^(iθ) (z − ω) |

> Une **rotation** est une multiplication par un complexe de **module 1** ; une **homothétie**, une multiplication par un **réel**. Toute application z ↦ a z + b, a non nul, est une similitude directe.

## Multiplier, c’est tourner
Multiplier par **i**, c’est une rotation d’angle **+π/2** autour de l’origine ; par **−1**, une rotation d’angle π.

> C’est l’intuition la plus utile du chapitre : le produit complexe **est** une rotation-agrandissement.

## Lire une figure sur un quotient
Pour trois points A, B, C d’affixes distinctes, on pose Z = (z(C) − z(A))/(z(B) − z(A)).

| Ce qu’on lit | Ce que ça donne |
| Le **module** de Z | Le rapport de longueurs **AC / AB** |
| L’**argument** de Z | L’angle orienté entre les vecteurs AB et AC |

| Z est… | La figure |
| **Réel** | A, B, C **alignés** |
| **Imaginaire pur** | (AB) et (AC) **perpendiculaires** |
| De **module 1** | AB = AC : triangle **isocèle** en A |
| Égal à e^(iπ/3) | Triangle **équilatéral direct** |

## La méthode d’un exercice
1. **Traduire** l’énoncé en affixes ;
2. **Calculer** le quotient ou l’expression demandée ;
3. **Interpréter** module et argument en longueurs et en angles ;
4. **Conclure** sur la nature de la figure.

> C’est une méthode entièrement **calculatoire** : elle évite la construction et les cas de figure — ce qui est précisément son intérêt à l’écrit.

## Les ensembles de points
| L’équation | L’ensemble |
| Module de (z − a) égal à R | Un **cercle** |
| Module de (z − a) égal au module de (z − b) | Une **médiatrice** |
| arg(z − a) = θ modulo 2π | Une **demi-droite** d’origine a |
| Re(z) = k, ou Im(z) = k | Des **droites** parallèles aux axes |

## Ce que les complexes n’apportent pas
Ils ne traitent que le **plan**. La géométrie de l’**espace** reste du ressort du produit scalaire et des coordonnées : les deux outils ne se recouvrent pas.

> **Longueur ↔ module, angle ↔ argument, transformation ↔ opération.** Ces trois correspondances suffisent à traduire n’importe quel énoncé de géométrie plane.`,
          },
          questions: [
            ['Quelle transformation l’écriture z′ − ω = e^(iθ)(z − ω) décrit-elle ?', ['La rotation de centre Ω et d’angle θ', 'L’homothétie de centre Ω', 'La translation de vecteur ω', 'La symétrie par rapport à Ω'], 0, 'Une rotation est une multiplication par un complexe de module 1.'],
            ['Que produit la multiplication par i ?', ['Une rotation d’angle +π/2 autour de l’origine', 'Une symétrie par rapport à l’origine', 'Une homothétie de rapport 2', 'Une translation'], 0, 'C’est l’intuition la plus utile du chapitre.'],
            ['Que représente |(z(C) − z(A))/(z(B) − z(A))| ?', ['Le rapport AC/AB', 'L’angle en A', 'L’aire du triangle ABC', 'La distance BC'], 0, 'L’argument du même quotient donne, lui, l’angle.'],
            ['Quelle condition caractérise un triangle isocèle en A ?', ['Le module du quotient vaut 1', 'Le quotient est réel', 'Le quotient est imaginaire pur', 'Le quotient est nul'], 0, 'AB = AC se lit directement sur le module.'],
            ['Quelle transformation z′ = z + b décrit-elle ?', ['La translation de vecteur d’affixe b', 'L’homothétie de rapport b', 'La rotation d’angle b', 'La similitude de rapport b'], 0, 'C’est la plus simple des écritures complexes de transformation.'],
            ['Toute application z ↦ a z + b avec a non nul est une similitude directe.', ['Vrai', 'Faux'], 0, 'Le module de a donne le rapport, son argument donne l’angle.'],
            ['Quel ensemble décrit arg(z − a) = θ modulo 2π ?', ['Une demi-droite d’origine le point d’affixe a', 'Un cercle de centre a', 'Une droite passant par a', 'Le point a lui-même'], 0, 'L’origine elle-même en est exclue, l’argument de 0 n’existant pas.'],
            ['Les nombres complexes permettent-ils de traiter la géométrie de l’espace ?', ['Non, ils ne décrivent que le plan', 'Oui, avec trois coordonnées', 'Oui, par le produit scalaire complexe', 'Oui, à partir de la forme exponentielle'], 0, 'L’espace relève du produit scalaire et des coordonnées.'],
          ],
        },
        // ---- Chapitre 2 : Arithmétique ---------------------------------------
        {
          titre: 'Divisibilité et congruences dans Z',
          axe: 'Arithmétique',
          lecon: {
            titre: 'Raisonner sur les restes',
            cours: `L’arithmétique étudie les entiers pour eux-mêmes. Son outil central, la **congruence**, permet de remplacer un nombre par son **reste** — et de traiter en une ligne des calculs impossibles autrement.

## La divisibilité
b **divise** a s’il existe un entier k tel que a = b k.

| Propriété | Ce qu’elle dit |
| Tout entier divise **0** | — |
| **1** divise tout entier | — |
| **Transitivité** | Si b divise a et a divise c, alors b divise c |
| **Combinaison linéaire** | Si b divise a et a′, alors b divise **u a + v a′** |

> La dernière est la propriété la plus utilisée en démonstration.

## La division euclidienne
Pour a relatif et b naturel non nul, il existe un **unique** couple (q ; r) tel que a = b q + r, avec **r compris entre 0 inclus et b exclu**.

> L’encadrement **strict** du reste est ce qui assure l’unicité. L’oublier est l’erreur classique, surtout pour a négatif : diviser −7 par 3 donne **q = −3 et r = 2**, et non q = −2 et r = −1.

## Les congruences
a et b sont **congrus modulo n** si n divise a − b. On note a ≡ b [n].

> C’est équivalent à : a et b ont le **même reste** dans la division euclidienne par n.

## Les règles de calcul
| Opération | Est-elle compatible ? |
| Addition | **Oui** |
| Multiplication | **Oui** |
| Puissances | **Oui** |
| **Division** | **NON** |

> De 6 ≡ 12 [6] on ne peut **pas** déduire 3 ≡ 6 [6], qui est faux. Simplifier une congruence exige des précautions liées au PGCD.

## La méthode des puissances
Pour trouver le reste de 3^2026 modulo 7, on calcule les premières puissances de 3 : 3, 2, 6, 4, 5, 1 — puis le cycle recommence, de **période 6**.

Comme 2026 = 6 × 337 + 4, on a 3^2026 ≡ 3⁴ ≡ **4** [7].

> **Chercher la périodicité** est la méthode systématique de tout exercice de ce type.

## Les critères de divisibilité
| Le point de départ | Le critère obtenu |
| 10 ≡ 1 [9] | Un nombre est congru à la **somme de ses chiffres** modulo 9 — d’où la « preuve par neuf » |
| 10 ≡ −1 [11] | Le critère par 11, en **somme alternée** |

> Travailler modulo n, c’est ne garder d’un entier que son **reste**. Toute la difficulté d’un exercice consiste à choisir **le bon** modulo.`,
          },
          questions: [
            ['Que signifie a ≡ b [n] ?', ['n divise a − b, autrement dit a et b ont le même reste modulo n', 'a est égal à b', 'a divise b et n', 'n divise a et b'], 0, 'C’est la définition de la congruence modulo n.'],
            ['Quelle condition assure l’unicité du couple (q ; r) dans la division euclidienne ?', ['0 ≤ r < b', 'r ≤ b', 'r > 0', 'q > 0'], 0, 'L’oublier conduit à des restes négatifs, notamment pour a négatif.'],
            ['Quel est le reste de la division euclidienne de −7 par 3 ?', ['2', '−1', '1', '−7'], 0, 'On a −7 = 3 × (−3) + 2, avec 0 ≤ 2 < 3.'],
            ['Les congruences sont-elles compatibles avec la division ?', ['Non, simplifier exige des précautions liées au PGCD', 'Oui, comme avec la multiplication', 'Oui, si le diviseur est premier avec n', 'Oui, toujours'], 0, 'De 6 ≡ 12 [6] on ne peut pas déduire 3 ≡ 6 [6].'],
            ['Si b divise a et a′, que divise-t-il aussi ?', ['Toute combinaison linéaire u a + v a′', 'Le produit a a′ uniquement', 'La somme a + a′ uniquement', 'Rien d’autre'], 0, 'C’est la propriété la plus utilisée en démonstration.'],
            ['Comment détermine-t-on le reste d’une grande puissance modulo n ?', ['En cherchant la périodicité des puissances successives', 'En calculant la puissance entière', 'En divisant l’exposant par n', 'En passant au logarithme'], 0, 'Le cycle des restes permet de ramener l’exposant à son reste modulo la période.'],
            ['Pourquoi un nombre est-il congru à la somme de ses chiffres modulo 9 ?', ['Parce que 10 ≡ 1 [9]', 'Parce que 9 est impair', 'Parce que 10 ≡ −1 [9]', 'C’est une coïncidence'], 0, 'Le critère de divisibilité par 11 vient, lui, de 10 ≡ −1 [11].'],
            ['Tout entier divise 0.', ['Vrai', 'Faux'], 0, '0 = b × 0 pour tout entier b.'],
          ],
        },
        {
          titre: 'PGCD, théorèmes de Bézout et de Gauss',
          axe: 'Arithmétique',
          lecon: {
            titre: 'Deux entiers, un plus grand diviseur commun',
            cours: `Le **PGCD** gouverne toute la question de la simplification et de la résolution des équations en nombres entiers.

## Le PGCD
Le plus grand entier qui divise a **et** b. Deux entiers sont **premiers entre eux** quand leur PGCD vaut **1**.

> « Premiers entre eux » ne signifie **pas** « nombres premiers » : 8 et 9 sont premiers entre eux, et ni l’un ni l’autre n’est premier.

## L’algorithme d’Euclide
Il repose sur une égalité simple : PGCD(a ; b) = PGCD(b ; r), où r est le reste de la division de a par b. On répète jusqu’à un reste nul ; le **dernier reste non nul** est le PGCD.

| Étape | Le calcul |
| 1 | 1071 = 2 × 462 + **147** |
| 2 | 462 = 3 × 147 + **21** |
| 3 | 147 = 7 × 21 + **0** |
| Conclusion | Le PGCD vaut **21** |

> Algorithme très rapide : le nombre d’étapes croît comme le **logarithme** des données.

## Bézout
| Énoncé | Ce qu’il affirme |
| **Identité** de Bézout | Il existe **toujours** u et v entiers tels que a u + b v = PGCD(a ; b) |
| **Théorème** de Bézout | a et b sont premiers entre eux **si et seulement si** il existe u et v tels que **a u + b v = 1** |

> Le sens « s’il existe u et v, alors le PGCD vaut 1 » est le plus utile : **exhiber un seul couple suffit** à prouver que deux entiers sont premiers entre eux. Les coefficients se calculent en **remontant** l’algorithme d’Euclide.

## Gauss
Si **a divise b c** et si **a est premier avec b**, alors **a divise c**.

> L’hypothèse de primalité est indispensable : 6 divise 4 × 3 sans diviser ni 4 ni 3.

**Corollaire** : si b et c divisent a et sont premiers entre eux, alors leur **produit** b c divise a.

## Les équations diophantiennes
Une équation **a x + b y = c** en nombres entiers admet des solutions **si et seulement si** le PGCD de a et b **divise c**.

| Étape | Ce qu’on fait |
| 1 | Calculer le PGCD et **vérifier la condition** |
| 2 | Trouver une **solution particulière** — Euclide remonté, ou à vue |
| 3 | **Soustraire** l’équation particulière de l’équation générale |
| 4 | Conclure par le **théorème de Gauss** pour la forme générale |

## Le PPCM
Le produit du PGCD et du PPCM de a et b égale la valeur absolue du produit a b. Connaître l’un donne donc l’autre.

> **Bézout** sert à prouver qu’on est premier entre eux ; **Gauss** sert à conclure qu’un facteur divise. Confondre leurs rôles est l’erreur la plus fréquente en démonstration.`,
          },
          questions: [
            ['Que dit le théorème de Bézout ?', ['a et b sont premiers entre eux si et seulement s’il existe u, v tels que a u + b v = 1', 'Le PGCD divise toujours la somme', 'a divise b c implique a divise c', 'Tout entier est produit de nombres premiers'], 0, 'Exhiber un seul couple (u ; v) suffit à prouver la primalité relative.'],
            ['Que dit le théorème de Gauss ?', ['Si a divise b c et a est premier avec b, alors a divise c', 'Si a divise b c, alors a divise c', 'Le PGCD de a et b divise a + b', 'Tout nombre premier divise un produit'], 0, 'L’hypothèse de primalité est indispensable : 6 divise 4 × 3 sans diviser 4 ni 3.'],
            ['Sur quelle égalité repose l’algorithme d’Euclide ?', ['PGCD(a ; b) = PGCD(b ; r), r étant le reste de a par b', 'PGCD(a ; b) = a − b', 'PGCD(a ; b) × PPCM(a ; b) = a + b', 'PGCD(a ; b) = b'], 0, 'Le dernier reste non nul est le PGCD.'],
            ['« Premiers entre eux » signifie-t-il que les deux nombres sont premiers ?', ['Non, cela signifie que leur PGCD vaut 1', 'Oui, toujours', 'Oui, si les deux sont impairs', 'Non, cela signifie qu’ils sont consécutifs'], 0, '8 et 9 sont premiers entre eux sans qu’aucun soit premier.'],
            ['Quand l’équation a x + b y = c admet-elle des solutions entières ?', ['Si et seulement si PGCD(a ; b) divise c', 'Toujours', 'Si a et b sont premiers', 'Si c est positif'], 0, 'C’est la première vérification de tout exercice d’équation diophantienne.'],
            ['Comment obtient-on les coefficients de Bézout ?', ['En remontant l’algorithme d’Euclide', 'Par tâtonnement uniquement', 'Par la décomposition en facteurs premiers', 'Ils valent toujours 1 et −1'], 0, 'On exprime chaque reste en fonction des précédents, de proche en proche.'],
            ['Quelle relation lie PGCD et PPCM de deux entiers ?', ['Leur produit vaut |a b|', 'Leur somme vaut a + b', 'Le PPCM divise le PGCD', 'Ils sont toujours égaux'], 0, 'Connaître l’un donne donc immédiatement l’autre.'],
            ['Si b et c divisent a et sont premiers entre eux, leur produit divise a.', ['Vrai', 'Faux'], 0, 'C’est un corollaire direct du théorème de Gauss.'],
          ],
        },
        {
          titre: 'Nombres premiers et petit théorème de Fermat',
          axe: 'Arithmétique',
          lecon: {
            titre: 'Les briques de tous les entiers',
            cours: `Les nombres premiers sont aux entiers ce que les atomes sont à la matière : tout se décompose sur eux, **d’une seule façon**.

## La définition
Un entier p supérieur ou égal à 2 est **premier** s’il n’admet que **deux** diviseurs positifs : 1 et lui-même.

| Cas particulier | Pourquoi |
| **1 n’est pas premier** | Il n’a qu’**un seul** diviseur — et l’exclure est **nécessaire** à l’unicité de la décomposition |
| **2** | Le **seul** nombre premier pair |

## Le théorème fondamental de l’arithmétique
Tout entier supérieur ou égal à 2 se décompose en produit de facteurs premiers, et cette décomposition est **unique** à l’ordre près.

| Ce qu’on lit sur la décomposition | Comment |
| Le **nombre de diviseurs** | Le produit des exposants **augmentés de 1** |
| Le **PGCD** | Les facteurs **communs**, aux **plus petits** exposants |
| Le **PPCM** | **Tous** les facteurs, aux **plus grands** exposants |

## Le crible d’Ératosthène
On écrit les entiers de 2 à n et l’on raye les multiples de chaque premier trouvé. On peut s’arrêter dès que le premier courant dépasse **√n**.

> Corollaire pratique : pour tester si n est premier, il suffit d’essayer les diviseurs jusqu’à **√n**. Si n n’est pas premier, il a nécessairement un diviseur inférieur ou égal à √n — sans quoi le produit des deux facteurs dépasserait n.

## L’infinité des nombres premiers
Euclide, par l’absurde : s’il n’y en avait qu’un nombre fini, l’entier obtenu en multipliant tous ces premiers **et en ajoutant 1** ne serait divisible par aucun d’eux — il laisserait toujours le reste 1. Il serait donc premier, ou aurait un facteur premier nouveau. **Contradiction.**

## Le petit théorème de Fermat
| Forme | Son énoncé |
| **Restreinte** | Si p est **premier** et a **non divisible** par p, alors a^(p−1) ≡ 1 [p] |
| **Générale** | Pour **tout** entier a : a^p ≡ a [p] |

Pour trouver 2^100 modulo 7 : le théorème donne 2⁶ ≡ 1 [7], et 100 = 6 × 16 + 4, donc 2^100 ≡ 2⁴ ≡ **2** [7].

> L’hypothèse « **p premier** » est indispensable : le théorème est **faux** pour un modulo composé.

## Les usages
| Usage | Le principe |
| Restes de **grandes puissances** | Réduire l’exposant modulo p−1 |
| **Tests de primalité** probabilistes | La **contraposée** : si a^(n−1) n’est pas congru à 1 modulo n, alors n n’est **pas** premier |
| **Cryptographie RSA** | Multiplier deux grands premiers est **immédiat** ; factoriser leur produit est **hors de portée** |

> Le théorème ne dit **rien** quand a^(n−1) ≡ 1 [n] : certains nombres composés passent le test. Il permet d’affirmer qu’un nombre **n’est pas** premier, jamais qu’il l’est.`,
          },
          questions: [
            ['Pourquoi 1 n’est-il pas un nombre premier ?', ['Il n’a qu’un seul diviseur positif, et son exclusion assure l’unicité de la décomposition', 'Parce qu’il est trop petit', 'Parce qu’il est impair', 'C’est une convention sans justification'], 0, 'Sans cette exclusion, toute décomposition admettrait une infinité d’écritures.'],
            ['Que dit le petit théorème de Fermat ?', ['Si p est premier et a non divisible par p, alors a^(p−1) ≡ 1 [p]', 'Tout entier est somme de deux nombres premiers', 'a^p ≡ p [a]', 'Il n’existe pas de solution à xⁿ + yⁿ = zⁿ'], 0, 'Sa forme générale, a^p ≡ a [p], vaut pour tout entier a.'],
            ['Jusqu’à quelle valeur faut-il tester les diviseurs pour savoir si n est premier ?', ['Jusqu’à √n', 'Jusqu’à n/2', 'Jusqu’à n − 1', 'Jusqu’à n'], 0, 'Un entier composé a nécessairement un diviseur inférieur ou égal à √n.'],
            ['Que dit le théorème fondamental de l’arithmétique ?', ['Tout entier supérieur ou égal à 2 se décompose de façon unique en produit de facteurs premiers', 'Il existe une infinité de nombres premiers', 'Tout entier premier est impair', 'Le PGCD divise le PPCM'], 0, 'L’unicité s’entend à l’ordre des facteurs près.'],
            ['Comment Euclide démontre-t-il l’infinité des nombres premiers ?', ['Par l’absurde, en considérant le produit de tous plus 1', 'Par récurrence', 'Par le crible d’Ératosthène', 'Par le petit théorème de Fermat'], 0, 'Ce nouvel entier n’est divisible par aucun des premiers supposés.'],
            ['Le petit théorème de Fermat reste-t-il vrai pour un modulo composé ?', ['Non, l’hypothèse « p premier » est indispensable', 'Oui, toujours', 'Oui, si a est premier', 'Oui, pour les modulos pairs'], 0, 'C’est ce qui rend les tests de primalité seulement probabilistes.'],
            ['Sur quoi repose la sécurité du chiffrement RSA ?', ['Sur la difficulté de factoriser le produit de deux grands nombres premiers', 'Sur la difficulté de multiplier deux grands nombres', 'Sur la longueur des clés uniquement', 'Sur le crible d’Ératosthène'], 0, 'Multiplier est immédiat, factoriser ne l’est pas : c’est l’asymétrie exploitée.'],
            ['2 est le seul nombre premier pair.', ['Vrai', 'Faux'], 0, 'Tout autre nombre pair admet 2 comme diviseur propre.'],
          ],
        },
        // ---- Chapitre 3 : Graphes et matrices ---------------------------------
        {
          titre: 'Calcul matriciel',
          axe: 'Graphes et matrices',
          lecon: {
            titre: 'Un tableau de nombres qu’on peut multiplier',
            cours: `Une **matrice** est un tableau rectangulaire de nombres. Son intérêt vient de ce qu’on peut la **multiplier** — et que ce produit code une **composition d’opérations**.

## Vocabulaire
Une matrice de taille **n × p** a n lignes et p colonnes ; le coefficient ligne i, colonne j se note a(i,j).

| Nom | Sa forme |
| **Carrée** | n = p |
| **Colonne** | p = 1 |
| **Ligne** | n = 1 |

## Les opérations simples
Somme et produit par un réel se font **coefficient par coefficient**, entre matrices de **même taille**.

## Le produit matriciel
Il n’est défini que si le **nombre de colonnes de A** égale le **nombre de lignes de B**. Si A est n × p et B est p × q, alors A × B est **n × q**.

Le coefficient (i ; j) s’obtient en parcourant la **ligne i de A** et la **colonne j de B**, en multipliant terme à terme et en additionnant.

| Ce qui change par rapport aux réels | Ce que ça implique |
| Le produit **n’est pas commutatif** | A B et B A diffèrent en général, et l’un peut exister **sans l’autre** |
| Un produit peut être **nul** | Sans qu’aucun facteur le soit |

> C’est l’erreur la plus coûteuse du chapitre : simplifier sans regarder **de quel côté** on multiplie.

## L’identité et l’inverse
La matrice **I(n)** — des 1 sur la diagonale, des 0 ailleurs — vérifie A I = I A = A : elle joue le rôle du nombre 1.

A est **inversible** s’il existe B telle que A B = B A = I. Toutes les matrices carrées ne le sont **pas**.

| Pour une matrice 2 × 2 de coefficients a, b, c, d | La règle |
| Le **déterminant** | ad − bc |
| Elle est inversible | **Si et seulement si** ce déterminant est **non nul** |
| Son inverse | Échanger a et d, changer le signe de b et c, diviser par le déterminant |

## Les puissances
| Méthode | Quand l’employer |
| Par **récurrence** | Quand une forme se conjecture sur les premières puissances |
| Par **diagonalisation** | Quand l’énoncé fournit P et D diagonale telles que A = P D P⁻¹ |

Alors **Aⁿ = P Dⁿ P⁻¹**, et Dⁿ se calcule en élevant chaque coefficient diagonal à la puissance n. C’est la méthode attendue au bac.

## Les systèmes linéaires
Un système de n équations à n inconnues s’écrit **A X = B**.

| Si A est… | Le système |
| **Inversible** | A une solution **unique** : X = A⁻¹ B |
| Non inversible | A une infinité de solutions, ou aucune |

> Avant chaque simplification, vérifier **de quel côté** on multiplie. Ce seul réflexe distingue une copie juste d’une copie fausse.`,
          },
          questions: [
            ['Quand le produit A × B est-il défini ?', ['Quand le nombre de colonnes de A égale le nombre de lignes de B', 'Quand A et B ont la même taille', 'Quand A et B sont carrées', 'Toujours'], 0, 'Si A est n × p et B est p × q, le produit est n × q.'],
            ['Le produit matriciel est-il commutatif ?', ['Non, A B et B A diffèrent en général', 'Oui, toujours', 'Oui, pour les matrices carrées', 'Oui, si les matrices sont inversibles'], 0, 'L’un peut même exister sans l’autre.'],
            ['Quand une matrice 2 × 2 est-elle inversible ?', ['Quand son déterminant ad − bc est non nul', 'Toujours', 'Quand tous ses coefficients sont non nuls', 'Quand elle est symétrique'], 0, 'L’inverse s’obtient alors en divisant par ce déterminant.'],
            ['Quel rôle joue la matrice identité ?', ['Celui du nombre 1 : A I = I A = A', 'Celui du nombre 0', 'Elle annule tout produit', 'Elle transpose la matrice'], 0, 'Elle porte des 1 sur la diagonale et des 0 ailleurs.'],
            ['Comment calcule-t-on Aⁿ quand A = P D P⁻¹ avec D diagonale ?', ['Aⁿ = P Dⁿ P⁻¹', 'Aⁿ = Pⁿ D Pⁿ', 'Aⁿ = P D P⁻¹ ⁿ fois développé terme à terme', 'Aⁿ = Dⁿ'], 0, 'Dⁿ s’obtient en élevant chaque coefficient diagonal à la puissance n.'],
            ['Un produit de deux matrices peut-il être nul sans qu’aucune ne le soit ?', ['Oui', 'Non, jamais', 'Oui, seulement pour les matrices 2 × 2', 'Oui, si l’une est l’identité'], 0, 'C’est une autre différence majeure avec le calcul sur les réels.'],
            ['Comment s’écrit un système linéaire sous forme matricielle ?', ['A X = B, X étant la colonne des inconnues', 'X A = B', 'A + X = B', 'A X B = 0'], 0, 'Si A est inversible, la solution unique est X = A⁻¹ B.'],
            ['Toutes les matrices carrées sont inversibles.', ['Vrai', 'Faux'], 1, 'Il faut que leur déterminant soit non nul.'],
          ],
        },
        {
          titre: 'Graphes et matrices',
          axe: 'Graphes et matrices',
          lecon: {
            titre: 'Compter les chemins par une puissance',
            cours: `Un graphe se range dans une matrice — et cette traduction met un outil de **calcul** au service d’une question de **parcours**.

## Le vocabulaire
| Terme | Sa définition |
| **Graphe** | Des **sommets** reliés par des **arêtes** (non orienté) ou des **arcs** (orienté) |
| **Pondéré** | Chaque lien porte un nombre |
| **Connexe** | Deux sommets quelconques sont reliés par une chaîne |
| **Degré** | Le nombre d’arêtes d’un sommet |

## La matrice d’adjacence
Pour un graphe à n sommets numérotés, le coefficient (i ; j) de **M** vaut **1** s’il existe une arête de i vers j, **0** sinon.

| Le graphe est… | La matrice est… |
| **Non orienté** | **Symétrique** |
| **Orienté** | En général **non** symétrique |

## Le résultat central
Le coefficient (i ; j) de **Mᵏ** donne le **nombre de chemins de longueur exactement k** allant de i à j.

> C’est le théorème du chapitre : il transforme un **dénombrement de parcours** en un **calcul de puissance**.

| La question | Le calcul |
| Chemins de longueur **exactement** k | Le coefficient de **Mᵏ** |
| Chemins de longueur **au plus** k | La somme M + M² + … + Mᵏ |
| Le graphe est-il **connexe** ? | La somme I + M + … + Mⁿ⁻¹ n’a **aucun coefficient nul** |

## Chaînes eulériennes et hamiltoniennes
| | **Eulérienne** | **Hamiltonienne** |
| Elle emprunte une fois | Chaque **arête** | Chaque **sommet** |
| Le critère | Graphe connexe et **0 ou 2 sommets de degré impair** (théorème d’Euler) | **Aucun critère simple** |
| Si 0 sommet impair | Il existe même un **cycle** eulérien | — |

> L’absence de critère hamiltonien est ce qui rend le **problème du voyageur de commerce** difficile.

## La coloration
Le **nombre chromatique** est le plus petit nombre de couleurs permettant de colorer les sommets sans que deux sommets adjacents partagent une couleur.

| Encadrement | Sa valeur |
| **Majorant** | Le degré maximal, plus 1 |
| **Minorant** | La taille du plus grand sous-graphe complet |

Applications : planning d’examens sans conflit, allocation de fréquences, coloriage de cartes.

## Les usages
Réseaux de transport, réseaux sociaux, ordonnancement de tâches, circuits, moteurs de recherche — l’algorithme originel de Google classe les pages par une **puissance itérée de matrice**.

> **Une puissance de matrice compte des chemins.** C’est le seul résultat à retenir, et presque toujours celui que l’énoncé demande d’appliquer.`,
          },
          questions: [
            ['Que représente le coefficient (i ; j) de Mᵏ, M étant la matrice d’adjacence ?', ['Le nombre de chemins de longueur exactement k de i vers j', 'La distance entre i et j', 'Le degré du sommet i', 'Le poids de l’arête entre i et j'], 0, 'C’est le résultat central du chapitre.'],
            ['Pour un graphe non orienté, la matrice d’adjacence est…', ['Symétrique', 'Diagonale', 'Inversible', 'Triangulaire'], 0, 'La présence d’une arête entre i et j se lit dans les deux cases.'],
            ['À quelle condition un graphe connexe possède-t-il une chaîne eulérienne ?', ['Il compte 0 ou 2 sommets de degré impair', 'Tous ses sommets ont le même degré', 'Il a un nombre pair de sommets', 'Il est complet'], 0, 'C’est le théorème d’Euler ; avec 0 sommet impair, il existe même un cycle eulérien.'],
            ['Qu’est-ce qu’une chaîne hamiltonienne ?', ['Une chaîne passant par chaque sommet une fois et une seule', 'Une chaîne empruntant chaque arête une fois', 'La chaîne la plus courte entre deux sommets', 'Un cycle de longueur paire'], 0, 'Aucun critère simple n’existe pour son existence.'],
            ['Comment compte-t-on les chemins de longueur au plus k ?', ['En additionnant M + M² + … + Mᵏ', 'En calculant Mᵏ seulement', 'En multipliant les puissances entre elles', 'En inversant M'], 0, 'Cette somme sert aussi à tester la connexité du graphe.'],
            ['Qu’est-ce que le nombre chromatique d’un graphe ?', ['Le plus petit nombre de couleurs colorant les sommets sans que deux voisins partagent une couleur', 'Le nombre d’arêtes', 'Le degré maximal', 'Le nombre de cycles'], 0, 'Il est majoré par le degré maximal augmenté de 1.'],
            ['Un graphe est connexe si la somme I + M + … + Mⁿ⁻¹ n’a aucun coefficient nul.', ['Vrai', 'Faux'], 0, 'Un coefficient nul signalerait deux sommets qu’aucun chemin ne relie.'],
            ['Quel est le degré d’un sommet dans un graphe non orienté ?', ['Son nombre d’arêtes', 'Son numéro dans la matrice', 'La longueur du plus long chemin qui en part', 'Le nombre de sommets qu’il ne touche pas'], 0, 'Il se lit sur la somme de la ligne correspondante de la matrice d’adjacence.'],
          ],
        },
        {
          titre: 'Suites de matrices colonnes',
          axe: 'Graphes et matrices',
          lecon: {
            titre: 'Plusieurs suites qui s’entraînent l’une l’autre',
            cours: `Quand deux suites sont définies **l’une par l’autre**, les traiter séparément est impossible. Les écrire en **colonne** les rend calculables d’un seul geste.

## Le principe
Deux suites u(n) et v(n) liées par un système de récurrence se rassemblent dans une matrice colonne U(n) de composantes u(n) et v(n). Le système s’écrit alors :

**U(n+1) = A U(n)**, où A contient les coefficients du système

## La forme explicite
Par récurrence immédiate : **U(n) = Aⁿ U(0)**

> Tout le problème se ramène donc au **calcul de Aⁿ**.

| Méthode | Ce qu’elle demande |
| **Conjecture et récurrence** | Deviner la forme sur les premières puissances, puis la démontrer |
| **Diagonalisation** | L’énoncé fournit P inversible et D diagonale : Aⁿ = P Dⁿ P⁻¹ |

## Le cas affine
Quand le système comporte un terme constant : **U(n+1) = A U(n) + B**.

1. Chercher l’**état stable** C, solution de C = A C + B — il vaut (I − A)⁻¹ B lorsque I − A est inversible ;
2. Poser V(n) = U(n) − C : la suite V vérifie **V(n+1) = A V(n)**, sans terme constant ;
3. Conclure : **U(n) = Aⁿ (U(0) − C) + C**.

> C’est exactement la méthode de la suite arithmético-géométrique réelle : seule la **nature des objets** change.

## Le comportement à l’infini
Il se lit sur les **puissances de A**.

| Si… | Alors |
| Aⁿ converge vers une matrice L | U(n) converge vers L U(0) |
| Aⁿ tend vers la matrice **nulle** (cas affine) | U(n) converge vers l’**état stable C** |

> Le point décisif pour l’interprétation : quand un modèle admet un état stable **attractif**, la répartition finale **ne dépend pas** de la répartition de départ.

## Les modèles décrits
| Situation | Ce que les états représentent |
| Répartition entre deux ou trois **états** | Abonnés et non-abonnés, migrations entre villes, parts de marché |
| **Suites imbriquées** | Dynamique de populations |
| **Cheminement dans un graphe** pondéré par des probabilités | Cela mène directement aux chaînes de Markov |

## La lecture d’un énoncé
Il fournit presque toujours : le système en français, la matrice A à écrire, une matrice P de changement de base, et une question finale d’**interprétation**.

> La rédaction attendue suit cet ordre — et l’interprétation vaut **autant de points** que le calcul.

> Le calcul matriciel ne fait rien de neuf : il **factorise** un raisonnement qu’on saurait mener suite par suite. Son intérêt est de rendre le cas à **trois** états aussi simple que le cas à deux.`,
          },
          questions: [
            ['Comment s’écrit un système de deux suites récurrentes couplées ?', ['U(n+1) = A U(n), avec U(n) matrice colonne', 'U(n+1) = U(n) + A', 'A U(n+1) = U(n)', 'U(n) = A + n'], 0, 'La matrice A contient les coefficients du système.'],
            ['Quelle est la forme explicite de U(n) ?', ['Aⁿ U(0)', 'A U(0)ⁿ', 'nA U(0)', 'A U(n−1) + U(0)'], 0, 'Tout le problème se ramène au calcul de Aⁿ.'],
            ['Comment traite-t-on le cas U(n+1) = A U(n) + B ?', ['On cherche l’état stable C, puis on pose V(n) = U(n) − C', 'On divise par B', 'On dérive la relation', 'On calcule directement Aⁿ B'], 0, 'La suite V vérifie alors une relation sans terme constant.'],
            ['Que vaut l’état stable C dans le cas affine ?', ['(I − A)⁻¹ B, lorsque I − A est inversible', 'A⁻¹ B', 'B − A', 'A B'], 0, 'Il est solution de C = A C + B.'],
            ['Si Aⁿ tend vers la matrice nulle dans un modèle affine, vers quoi converge U(n) ?', ['Vers l’état stable C, quelle que soit la situation initiale', 'Vers U(0)', 'Vers la matrice nulle', 'Elle diverge'], 0, 'La répartition finale ne dépend alors pas de la répartition de départ.'],
            ['Comment calcule-t-on Aⁿ quand une diagonalisation est fournie ?', ['Aⁿ = P Dⁿ P⁻¹', 'Aⁿ = Pⁿ Dⁿ', 'Aⁿ = D P⁻¹', 'Aⁿ = P⁻¹ Dⁿ P'], 0, 'Dⁿ s’obtient en élevant chaque coefficient diagonal à la puissance n.'],
            ['La méthode du cas affine matriciel est-elle la même que pour une suite arithmético-géométrique réelle ?', ['Oui, seule la nature des objets change', 'Non, elle est entièrement différente', 'Oui, mais uniquement en dimension 2', 'Non, elle exige la diagonalisation'], 0, 'Chercher l’état stable puis se ramener au cas homogène.'],
            ['L’intérêt du calcul matriciel est de traiter aussi simplement le cas à trois états que le cas à deux.', ['Vrai', 'Faux'], 0, 'Il factorise un raisonnement qu’on saurait mener suite par suite.'],
          ],
        },
        {
          titre: 'Chaînes de Markov',
          axe: 'Graphes et matrices',
          lecon: {
            titre: 'Un système qui ne se souvient que du présent',
            cours: `Une **chaîne de Markov** modélise un système qui passe d’un état à un autre au hasard, et dont l’avenir ne dépend que de l’**état actuel** — jamais du chemin parcouru pour y arriver.

## La propriété de Markov
La probabilité de l’état suivant ne dépend **que** de l’état présent : le processus est « **sans mémoire** ».

> Cette hypothèse doit être **discutée** dans une modélisation : raisonnable pour un déplacement aléatoire, plus discutable pour une fidélité de clientèle, où l’ancienneté joue.

## Le graphe probabiliste
Les **sommets** sont les états, les **arcs** portent les **probabilités de transition**.

> La somme des probabilités des arcs **sortant** d’un même sommet vaut nécessairement **1** : le système est forcément quelque part à l’étape suivante.

## La matrice de transition
Le coefficient (i ; j) de **T** est la probabilité de passer de l’état i à l’état j. Chacune de ses **lignes** est donc une distribution de probabilité : coefficients positifs, de somme 1. Une telle matrice est dite **stochastique**.

> La convention ligne/colonne doit être **fixée dès le début et tenue** : selon qu’on écrit les distributions en ligne ou en colonne, le produit se fait à droite ou à gauche. Les mélanger en cours d’exercice est l’erreur la plus fréquente.

## L’évolution
Avec les distributions écrites **en ligne** :

P(n+1) = P(n) × T, donc **P(n) = P(0) × Tⁿ**

Le coefficient (i ; j) de **Tⁿ** est la probabilité d’être en j au bout de n étapes en partant de i.

## L’état stable
Une distribution **π** est **stable** si π × T = π.

> C’est un **système linéaire**, auquel on ajoute la condition que la somme des composantes de π vaut **1**. Sans elle, le système admet une infinité de solutions proportionnelles.

## La convergence
| La condition sur T | La conclusion |
| Aucun coefficient nul — ou une puissance de T sans coefficient nul | P(n) **converge vers l’unique état stable π** |
| — | Et cette limite **ne dépend pas** de la distribution initiale |

> C’est le résultat que les exercices font conclure : à long terme, la répartition s’installe et **oublie d’où elle vient**.

## Les applications
Fidélité à une marque et parts de marché, météo à deux ou trois états, déplacements aléatoires, files d’attente, génétique des populations — et le classement des pages web par la marche aléatoire d’un internaute, principe originel de Google.

> Deux vérifications closent tout exercice : chaque **ligne de T** somme-t-elle à 1, et la somme des composantes de **π** vaut-elle 1 ? Si l’une échoue, le calcul est faux.`,
          },
          questions: [
            ['Que dit la propriété de Markov ?', ['L’avenir ne dépend que de l’état présent, pas de l’historique', 'Toutes les transitions sont équiprobables', 'Le système revient toujours à son état initial', 'Les probabilités changent à chaque étape'], 0, 'On dit que le processus est sans mémoire.'],
            ['Que vaut la somme des coefficients d’une ligne de la matrice de transition ?', ['1', '0', 'Le nombre d’états', 'Elle est variable'], 0, 'Chaque ligne est une distribution de probabilité : la matrice est stochastique.'],
            ['Que représente le coefficient (i ; j) de Tⁿ ?', ['La probabilité d’être en j après n étapes en partant de i', 'Le nombre de chemins de i vers j', 'La distance entre i et j', 'La probabilité de rester en i'], 0, 'C’est l’analogue probabiliste du comptage de chemins par les puissances de matrice.'],
            ['Comment caractérise-t-on un état stable π ?', ['Par π × T = π, avec somme des composantes égale à 1', 'Par π = 0', 'Par T × π = 0', 'Par π = T'], 0, 'La condition de somme est indispensable : sans elle, le système a une infinité de solutions.'],
            ['Quand la distribution converge-t-elle vers l’unique état stable ?', ['Quand une puissance de T n’a aucun coefficient nul', 'Toujours', 'Quand la matrice est symétrique', 'Quand il n’y a que deux états'], 0, 'La limite est alors indépendante de la distribution initiale.'],
            ['La limite d’une chaîne de Markov convergente dépend de la distribution initiale.', ['Vrai', 'Faux'], 1, 'C’est justement ce que dit le résultat de convergence : elle oublie d’où elle vient.'],
            ['Quelle vérification permet de repérer une erreur de calcul de l’état stable ?', ['La somme des composantes de π doit valoir 1', 'π doit être positive strictement', 'π doit être égale à une ligne de T', 'π doit être nulle'], 0, 'La seconde vérification est que chaque ligne de T somme bien à 1.'],
            ['Sur quel principe repose le classement originel des pages web par Google ?', ['Une marche aléatoire d’un internaute, modélisée par une chaîne de Markov', 'Le nombre de mots-clés', 'La date de publication', 'Le nombre de visiteurs'], 0, 'Le classement est la distribution stable de cette marche.'],
          ],
        },
      ],
    },
  ],
}
