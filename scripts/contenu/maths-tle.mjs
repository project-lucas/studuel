// MATHS TERMINALE (spécialité) — les 19 fiches du programme officiel, dans
// l'ordre de ses 3 chapitres : « Algèbre et géométrie » (5), « Analyse » (11),
// « Probabilités » (3).
//
// ⚠️ POURQUOI SEULEMENT 3 CHAPITRES ET NON 8. La maquette de référence range
// sous un même dossier « Maths Tle » huit chapitres : les trois de la
// spécialité, trois de l'option « mathématiques expertes » (nombres complexes,
// arithmétique, graphes et matrices) et deux de l'option « mathématiques
// complémentaires » (analyse, probabilités et statistique). L'app, elle, a
// TROIS MATIÈRES distinctes depuis l'origine — `maths`, `maths-expertes` et
// `maths-complementaires` —, chacune cochable séparément dans « Ma classe ».
// Les fusionner afficherait à un élève de spécialité seule un programme qu'il ne
// suit pas, et contredirait la règle du projet : un dossier de matière ne montre
// QUE son programme. Les cinq chapitres d'option partent donc dans les modules
// `maths-expertes-tle.mjs` et `maths-complementaires-tle.mjs`, générés dans la
// MÊME migration 255 (option --modules à trois entrées).
//
// POURQUOI UN MODULE NEUF : les maths de Terminale viennent des migrations 008
// et 139, écrites à la main et DÉJÀ EXÉCUTÉES, qui ne doivent plus être
// régénérées. Le slug `maths` n'avait encore aucun module dans scripts/contenu.
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le ménage est borné à `level = 'Tle'` — les
// six autres niveaux de maths (6e → 1re) portent les mêmes leçons génériques et
// ne bougent pas.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS Tle — LE PROGRAMME OFFICIEL (spécialité, expertes, complémentaires)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle maths, puis
maths-expertes et maths-complementaires, 20/08/2026) : la spécialité maths de
Terminale n'avait que CINQ chapitres, taillés dans un découpage maison hérité des
migrations 008 et 139 (« Limites de fonctions », « Continuité et convexité »,
« Logarithme népérien », « Primitives et équations différentielles », « Lois de
probabilité »). Le BO en compte QUINZE sections. Manquaient EN ENTIER : toute la
géométrie dans l'espace (vecteurs, droites, plans, produit scalaire,
représentations paramétriques), toute la combinatoire, le raisonnement par
récurrence, les limites de suites, la dérivation des fonctions composées, les
fonctions trigonométriques, le calcul intégral, et toute la chaîne probabiliste
(succession d'épreuves, sommes de variables aléatoires, loi des grands nombres).
C'était l'écart le plus grave du dépôt : une spécialité à coefficient 16, dont
l'épreuve dure 4 heures, couverte à un tiers.

Les deux options n'étaient pas mieux loties : 3 chapitres pour les mathématiques
expertes (là où le programme en compte 3 mais bien plus détaillés), 4 pour les
mathématiques complémentaires (contre 12 thèmes au BO).

Cette migration installe 42 fiches sur les TROIS matières — 19 en spécialité,
12 en expertes, 11 en complémentaires — rangées sous leurs chapitres, et retire
les 12 fiches composites qu'elles recouvrent.

⚠️ CE QUI EST PERDU AU PASSAGE : les 12 leçons « Exercices types » des
migrations 139 et 149 (elles n'ont aucun quiz en base, sondé le 20/08/2026) et
les questions des leçons « L'essentiel du cours » qu'elles accompagnaient — 50
côté spécialité, 30 côté expertes, 32 côté complémentaires.

⚠️ LES MIGRATIONS 008, 139 ET 149 SONT REJOUABLES, et la 219 (mathématiques
complémentaires) est un fichier GÉNÉRÉ, donc rejouable lui aussi : les recoller
un jour ferait revenir les 12 fiches composites en doublon.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
les trois modules de cette migration rangent leurs 42 fiches sous 8 chapitres, et
l'INSERT écrit la colonne. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce
que la 234 n'a jamais été exécutée en production (sondé le 20/08/2026) — sans
cette reprise, la migration échouerait sur "column chapters.theme does not
exist", les 12 anciennes fiches déjà supprimées et les 42 neuves pas encore
posées : trois matières vides.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches composites de la SPÉCIALITÉ partent, au niveau Tle SEULEMENT.
⚠️ CE MÉNAGE EST INDISPENSABLE, pas seulement souhaitable : deux fiches neuves
portent EXACTEMENT le titre d'un chapitre existant — « Limites de fonctions » et
« Primitives et équations différentielles » — et chapters est
UNIQUE(subject_id, level, title). Sans suppression préalable, ces deux INSERT
tomberaient dans leur ON CONFLICT DO NOTHING, les chapitres ne seraient pas
créés, et leurs leçons échoueraient sur une clé étrangère absente : la migration
s'arrêterait à mi-parcours.
Le filtre level = 'Tle' est tout aussi indispensable : la matière maths existe
sur SEPT niveaux (6e → Tle), et « Limites de fonctions » ou « Lois de
probabilité » ont des homonymes ailleurs.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
les chapitres, dont les leçons partent en cascade.
Aucun des cinq titres ne porte d'apostrophe : pas de piège typographique ici.`,
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
   AND c.level = 'Tle'
   AND c.title IN ('Limites de fonctions',
                   'Continuité et convexité',
                   'Logarithme népérien',
                   'Primitives et équations différentielles',
                   'Lois de probabilité');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = 'Tle'
   AND c.title IN ('Limites de fonctions',
                   'Continuité et convexité',
                   'Logarithme népérien',
                   'Primitives et équations différentielles',
                   'Lois de probabilité');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = 'Tle'
   AND c.title IN ('Limites de fonctions',
                   'Continuité et convexité',
                   'Logarithme népérien',
                   'Primitives et équations différentielles',
                   'Lois de probabilité');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Algèbre et géométrie -------------------------------
        {
          titre: 'Factorielle, k-uplet, permutation et combinaison',
          axe: 'Algèbre et géométrie',
          lecon: {
            titre: 'Compter sans énumérer',
            cours: `Dénombrer, c’est compter le nombre d’issues **sans les écrire toutes**. Deux questions décident de la formule : **l’ordre compte-t-il ?** et **peut-on répéter ?**

## Le tableau de décision
| L’ordre compte | Répétition possible | La formule | Le nom |
| **Oui** | **Oui** | **n^k** | Le **k-uplet** |
| **Oui** | **Non** | n! / (n−k)! | L’**arrangement** |
| **Oui** | Non, et k = n | **n!** | La **permutation** |
| **Non** | **Non** | n! / (k! (n−k)!) | La **combinaison** |

## La factorielle
n! = n × (n−1) × … × 2 × 1, avec la convention **0! = 1**. Elle compte le nombre de façons d’**ordonner** n objets distincts.

## Les k-uplets
Liste ordonnée de k éléments, **avec répétition** : c’est le tirage **avec remise**.

> Un code à 4 chiffres offre 10⁴ = **10 000** possibilités.

## Les arrangements
Liste ordonnée **sans répétition** : le tirage **sans remise** où l’ordre compte.

> Un podium de 3 places parmi 8 coureurs : 8 × 7 × 6 = **336**.

## Les combinaisons
Une **partie** à k éléments d’un ensemble à n : ni ordre, ni répétition. On la note « k parmi n ».

> Le **k!** au dénominateur efface justement l’ordre : on part des arrangements, et on divise par le nombre de façons d’ordonner les k éléments choisis.

Une main de 5 cartes dans un jeu de 32 : C(32,5) = **201 376**.

## Les propriétés
| Propriété | Son énoncé | Sa lecture |
| **Symétrie** | C(n,k) = C(n, n−k) | Choisir k éléments, c’est en **écarter** n−k |
| **Relation de Pascal** | C(n,k) = C(n−1, k−1) + C(n−1, k) | Un élément donné **est** dans la partie, ou **n’y est pas** |
| Cas particuliers | C(n,0) = C(n,n) = 1 ; C(n,1) = n | — |
| **Somme** | La somme de tous les C(n,k) vaut **2ⁿ** | Le nombre total de **parties** d’un ensemble à n éléments |

La relation de Pascal est celle qui construit le **triangle de Pascal**.

> Les combinaisons resservent immédiatement : le coefficient C(n,k) est exactement celui de la **loi binomiale**, où il compte les façons d’obtenir k succès parmi n épreuves.`,
          },
          questions: [
            ['Que vaut 0! par convention ?', ['1', '0', 'Indéfini', 'n'], 0, 'Cette convention rend cohérentes toutes les formules de dénombrement.'],
            ['Combien y a-t-il de k-uplets d’un ensemble à n éléments ?', ['n^k', 'k^n', 'n!/(n−k)!', 'C(n,k)'], 0, 'Liste ordonnée avec répétition : c’est le tirage avec remise.'],
            ['Quelle formule compte les tirages ordonnés sans remise de k éléments parmi n ?', ['n!/(n−k)!', 'n^k', 'C(n,k)', 'k!'], 0, 'Ce sont les arrangements : 8 × 7 × 6 pour un podium parmi 8 coureurs.'],
            ['Que vaut C(n,k) ?', ['n! / (k! (n−k)!)', 'n! / (n−k)!', 'n^k / k!', 'k! (n−k)!'], 0, 'Le k! au dénominateur efface l’ordre des k éléments choisis.'],
            ['Que dit la relation de Pascal ?', ['C(n,k) = C(n−1,k−1) + C(n−1,k)', 'C(n,k) = C(n,n−k)', 'C(n,k) = n × C(n−1,k)', 'C(n,k) = C(n−1,k) × k'], 0, 'Soit un élément donné est dans la partie, soit il n’y est pas.'],
            ['C(n,k) = C(n, n−k).', ['Vrai', 'Faux'], 0, 'Choisir k éléments revient à en écarter n−k : c’est la relation de symétrie.'],
            ['Que vaut la somme de tous les C(n,k) pour k allant de 0 à n ?', ['2ⁿ', 'n!', 'n²', 'n'], 0, 'C’est le nombre total de parties d’un ensemble à n éléments.'],
            ['Combien de mains de 5 cartes peut-on former dans un jeu de 32 ?', ['C(32,5)', '32⁵', '32!/27!', '5!'], 0, 'L’ordre des cartes en main ne compte pas : c’est une combinaison.'],
          ],
        },
        {
          titre: 'Droites, plans et vecteurs de l’espace',
          axe: 'Algèbre et géométrie',
          lecon: {
            titre: 'Trois coordonnées, les mêmes règles',
            cours: `La géométrie de l’espace reprend tous les outils du plan, avec **une coordonnée de plus** — et une question nouvelle : deux droites peuvent ne se couper **ni** être parallèles.

## Les vecteurs de l’espace
Un vecteur se décompose sur une **base** de trois vecteurs non coplanaires : u = x i + y j + z k, noté u(x ; y ; z).

Somme, produit par un réel et colinéarité s’écrivent **coordonnée par coordonnée**, exactement comme dans le plan. Deux vecteurs sont **colinéaires** s’il existe un réel k tel que v = k u.

## La nouveauté : les vecteurs coplanaires
Trois vecteurs u, v, w sont **coplanaires** s’il existe deux réels a et b tels que w = a u + b v — autrement dit si w **se décompose** sur u et v.

> Cette notion n’a **aucun équivalent** dans le plan : c’est la nouveauté du chapitre. Trois vecteurs **non coplanaires** forment une base de l’espace.

## Repère et coordonnées
| Objet | Sa formule |
| Coordonnées de AB | (xB − xA ; yB − yA ; zB − zA) |
| Milieu de [AB] | La moyenne des coordonnées |
| Distance AB | √((xB−xA)² + (yB−yA)² + (zB−zA)²), en repère **orthonormé** seulement |

## Caractériser une droite, caractériser un plan
| | **Droite** | **Plan** |
| Ce qui la définit | Un point A et **un** vecteur directeur u non nul | Un point A et **deux** vecteurs directeurs non colinéaires |
| Autres définitions | — | **Trois points non alignés** ; ou une droite et un point hors d’elle |
| M lui appartient si… | AM est **colinéaire** à u | AM, u et v sont **coplanaires** |

## Les théorèmes à connaître
| Théorème | Son énoncé |
| Parallélisme droite-plan | Si une droite est parallèle à une droite d’un plan, elle est parallèle à ce plan |
| Plans parallèles | Deux plans parallèles coupés par un troisième déterminent deux droites **parallèles** |
| **Théorème du toit** | Si deux plans sécants contiennent chacun l’une de deux droites parallèles, leur **intersection** est parallèle à ces droites |

## Ce qui change vraiment
| Dans le plan | Dans l’espace |
| Deux droites sont **sécantes ou parallèles** | Elles peuvent être **non coplanaires** : ni sécantes, ni parallèles |

> Vérifier la **coplanarité** est donc le premier réflexe avant de chercher une intersection.

> Toute la géométrie du chapitre se ramène à des calculs sur des coordonnées : dès qu’une configuration résiste, **poser un repère et calculer**.`,
          },
          questions: [
            ['Quand trois vecteurs de l’espace sont-ils coplanaires ?', ['Quand l’un est combinaison linéaire des deux autres', 'Quand ils sont deux à deux colinéaires', 'Quand ils ont la même norme', 'Quand leur somme est nulle'], 0, 'Trois vecteurs non coplanaires forment une base de l’espace.'],
            ['Comment caractérise-t-on un plan de l’espace ?', ['Par un point et deux vecteurs directeurs non colinéaires', 'Par un point et un vecteur directeur', 'Par deux points distincts', 'Par un vecteur normal seulement'], 0, 'Trois points non alignés le déterminent aussi.'],
            ['Dans l’espace, deux droites qui ne se coupent pas sont nécessairement parallèles.', ['Vrai', 'Faux'], 1, 'Elles peuvent être non coplanaires : c’est la nouveauté par rapport au plan.'],
            ['Un point M appartient à la droite passant par A de vecteur directeur u si…', ['AM est colinéaire à u', 'AM est orthogonal à u', 'AM et u sont coplanaires', 'AM a la même norme que u'], 0, 'C’est la caractérisation vectorielle d’une droite.'],
            ['Dans quel type de repère la formule de la distance AB est-elle valable ?', ['Un repère orthonormé', 'Tout repère', 'Un repère orthogonal seulement', 'Un repère du plan'], 0, 'Sans orthonormalité, la formule de la norme ne s’applique pas.'],
            ['Que dit le théorème du toit ?', ['Si deux plans sécants contiennent chacun une de deux droites parallèles, leur intersection leur est parallèle', 'Deux plans parallèles n’ont aucune intersection', 'Trois plans se coupent toujours en un point', 'Une droite parallèle à un plan lui est orthogonale'], 0, 'C’est le théorème le plus utilisé pour construire une intersection.'],
            ['Trois vecteurs non coplanaires forment une base de l’espace.', ['Vrai', 'Faux'], 0, 'Tout vecteur de l’espace se décompose alors de façon unique sur eux.'],
            ['Si une droite est parallèle à une droite contenue dans un plan, elle est parallèle à ce plan.', ['Vrai', 'Faux'], 0, 'C’est le critère de parallélisme droite-plan.'],
          ],
        },
        {
          titre: 'Positions relatives de droites et de plans de l’espace',
          axe: 'Algèbre et géométrie',
          lecon: {
            titre: 'Sécants, parallèles, ou ni l’un ni l’autre',
            cours: `Étudier une position relative, c’est répondre à une seule question : **combien de points communs ?** Zéro, un, ou une infinité.

## Deux droites — trois cas, et non deux
| Cas | Points communs | Comment le reconnaître |
| Coplanaires et **sécantes** | **Un** | Directeurs non colinéaires, système avec une solution |
| Coplanaires et **parallèles** | Aucun, ou infinité si confondues | Directeurs **colinéaires** |
| **Non coplanaires** | **Aucun** — et pourtant pas parallèles | Directeurs non colinéaires, système **sans** solution |

La méthode : les vecteurs directeurs sont-ils colinéaires ? Si oui, les droites sont parallèles — confondues si un point de l’une appartient à l’autre. Sinon, on résout le système.

## Droite et plan
| Cas | Points communs |
| La droite est **incluse** dans le plan | Une **infinité** |
| Elle est **strictement parallèle** | **Aucun** |
| Elle est **sécante** | **Un** seul |

> Critère : si le vecteur directeur de la droite est **orthogonal** au vecteur normal du plan, la droite est **parallèle** au plan — incluse si un de ses points y appartient. Sinon elle est sécante.

## Deux plans
| Cas | Intersection |
| **Confondus** | Le plan lui-même |
| **Strictement parallèles** | Aucune |
| **Sécants** | Une **droite** — jamais un point |

> Critère : les vecteurs **normaux** sont-ils colinéaires ?

## Trois plans
Un point unique (les trois normaux non coplanaires), une droite, un plan, ou aucun point commun — la configuration en « **prisme** », où les plans se coupent deux à deux selon trois droites parallèles distinctes.

## Le lien avec les systèmes
| Le système a… | La position relative |
| Une solution **unique** | Sécants |
| Une **infinité** | Inclusion, ou intersection selon une droite |
| **Aucune** | Parallélisme strict **ou non-coplanarité** |

## La méthode générale
1. Écrire une **représentation paramétrique** de chaque droite et une **équation cartésienne** de chaque plan ;
2. **Substituer** l’une dans l’autre ;
3. **Lire** le nombre de solutions.

Substituer la paramétrique d’une droite dans l’équation d’un plan donne une équation en un seul paramètre : une solution → un point ; aucune → parallèle stricte ; identité vraie pour tout paramètre → droite **incluse**.

> Erreur récurrente : conclure « parallèles » dès que le système n’a pas de solution. Dans l’espace, l’absence de solution peut aussi signaler des droites **non coplanaires**.`,
          },
          questions: [
            ['Combien de positions relatives deux droites de l’espace peuvent-elles avoir ?', ['Trois : sécantes, parallèles, ou non coplanaires', 'Deux : sécantes ou parallèles', 'Quatre', 'Une seule'], 0, 'La non-coplanarité est le cas propre à l’espace.'],
            ['Que peut être l’intersection de deux plans sécants ?', ['Une droite', 'Un point', 'Un plan', 'L’ensemble vide'], 0, 'Deux plans distincts ne se coupent jamais en un seul point.'],
            ['Quand une droite est-elle parallèle à un plan ?', ['Quand son vecteur directeur est orthogonal au vecteur normal du plan', 'Quand son vecteur directeur est colinéaire au vecteur normal', 'Quand elle coupe le plan en un point', 'Quand elle est incluse dans un plan parallèle'], 0, 'Elle est incluse dans le plan si en plus un de ses points y appartient.'],
            ['Deux plans dont les vecteurs normaux sont colinéaires sont…', ['Parallèles ou confondus', 'Sécants', 'Orthogonaux', 'Non coplanaires'], 0, 'Le critère porte sur les normaux, pas sur les directeurs.'],
            ['Si le système d’intersection de deux droites n’a pas de solution, elles sont parallèles.', ['Vrai', 'Faux'], 1, 'Elles peuvent aussi être non coplanaires : c’est l’erreur récurrente du chapitre.'],
            ['Que signifie une identité vraie pour tout paramètre après substitution d’une droite dans un plan ?', ['La droite est incluse dans le plan', 'La droite est parallèle stricte au plan', 'La droite coupe le plan', 'Le système est mal posé'], 0, 'Tous les points de la droite vérifient alors l’équation du plan.'],
            ['Trois plans peuvent n’avoir aucun point commun tout en étant sécants deux à deux.', ['Vrai', 'Faux'], 0, 'C’est la configuration en prisme : trois droites d’intersection parallèles distinctes.'],
            ['Comment déterminer si deux droites sont parallèles ?', ['En testant la colinéarité de leurs vecteurs directeurs', 'En résolvant le système', 'En comparant leurs points', 'En calculant leur produit scalaire'], 0, 'Elles sont confondues si en plus un point de l’une appartient à l’autre.'],
          ],
        },
        {
          titre: 'Produit scalaire, orthogonalité et distances dans l’espace',
          axe: 'Algèbre et géométrie',
          lecon: {
            titre: 'L’outil qui transforme la géométrie en calcul',
            cours: `Le produit scalaire est le **seul** outil qui relie **longueurs** et **angles** à des coordonnées. Il fournit le critère d’orthogonalité et toutes les distances du chapitre.

## Les trois expressions
| Expression | Sa formule | Quand l’employer |
| Par **coordonnées** (repère orthonormé) | xx′ + yy′ + zz′ | Pour calculer |
| Par **norme et angle** | ‖u‖ × ‖v‖ × cos(θ) | Pour trouver un **angle** |
| Par **projection** | ‖u‖ × la longueur du projeté de v sur u, au signe près | Pour interpréter |

## Les propriétés
Symétrie, bilinéarité, et **u · u = ‖u‖²**. Les identités remarquables s’appliquent aux vecteurs :

‖u + v‖² = ‖u‖² + 2 u · v + ‖v‖²

## Le critère d’orthogonalité
Deux vecteurs **non nuls** sont orthogonaux **si et seulement si** leur produit scalaire est **nul**.

> C’est le résultat le plus utilisé du chapitre : toute question d’orthogonalité devient une **somme de produits**.

## Le vecteur normal à un plan
Un vecteur **normal** est orthogonal à **tous** les vecteurs du plan — il suffit qu’il le soit à **deux** vecteurs directeurs non colinéaires.

Le plan passant par A et de vecteur normal n(a ; b ; c) admet l’équation cartésienne :

ax + by + cz + d = 0

> Les coefficients a, b, c **sont exactement** les coordonnées d’un vecteur normal. Lire un vecteur normal sur une équation de plan est donc **immédiat**.

## Le projeté orthogonal
Le point du plan (ou de la droite) **le plus proche** de M. La distance de M au plan est la distance à son projeté.

> Pour le calculer : écrire la droite passant par M **de vecteur directeur n**, et chercher son intersection avec le plan.

## Les distances
| Distance | Comment l’obtenir |
| D’un **point à un plan** | La valeur absolue de (a·xM + b·yM + c·zM + d), divisée par √(a² + b² + c²) |
| D’un **point à une droite** | Par le **projeté orthogonal** |

## Les usages classiques
Sphère (points à distance R d’un centre), position relative d’une sphère et d’un plan (comparer la distance du centre au plan et le rayon), calcul d’un angle, démonstration d’une orthogonalité, recherche d’un minimum de distance.

> Deux réflexes traitent presque tout le chapitre : « **orthogonal** » se traduit par « **produit scalaire nul** », et « **distance minimale** » par « **projeté orthogonal** ».`,
          },
          questions: [
            ['Quelle est l’expression du produit scalaire en repère orthonormé ?', ['xx′ + yy′ + zz′', 'xx′ − yy′ + zz′', '(x + x′)(y + y′)', 'xyz + x′y′z′'], 0, 'C’est la somme des produits des coordonnées de même rang.'],
            ['Deux vecteurs non nuls sont orthogonaux si et seulement si…', ['Leur produit scalaire est nul', 'Leur produit scalaire vaut 1', 'Ils ont la même norme', 'Ils sont colinéaires'], 0, 'C’est le critère le plus utilisé du chapitre.'],
            ['Dans l’équation ax + by + cz + d = 0, que représente le triplet (a ; b ; c) ?', ['Un vecteur normal au plan', 'Un vecteur directeur du plan', 'Les coordonnées d’un point du plan', 'Rien de particulier'], 0, 'Lire un vecteur normal sur une équation de plan est donc immédiat.'],
            ['Que vaut u · u ?', ['‖u‖²', '‖u‖', '0', '2‖u‖'], 0, 'C’est ce qui permet d’appliquer les identités remarquables aux vecteurs.'],
            ['Qu’est-ce que le projeté orthogonal d’un point sur un plan ?', ['Le point du plan le plus proche du point donné', 'Le centre du plan', 'L’intersection du plan avec l’axe des abscisses', 'Un point quelconque du plan'], 0, 'La distance au plan est la distance à ce projeté.'],
            ['Il suffit qu’un vecteur soit orthogonal à deux vecteurs directeurs non colinéaires d’un plan pour lui être normal.', ['Vrai', 'Faux'], 0, 'Il est alors orthogonal à toute combinaison linéaire de ces deux vecteurs.'],
            ['Quelle expression relie produit scalaire, normes et angle ?', ['u · v = ‖u‖ ‖v‖ cos(θ)', 'u · v = ‖u‖ ‖v‖ sin(θ)', 'u · v = ‖u‖ + ‖v‖', 'u · v = ‖u‖ / ‖v‖'], 0, 'Elle permet de calculer un angle à partir des coordonnées.'],
            ['Comment détermine-t-on la position relative d’une sphère et d’un plan ?', ['En comparant la distance du centre au plan et le rayon', 'En calculant le produit scalaire des normaux', 'En résolvant un système de trois équations', 'En projetant le centre sur une droite'], 0, 'Distance inférieure au rayon : intersection selon un cercle.'],
          ],
        },
        {
          titre: 'Représentations paramétriques de droites et équations cartésiennes de plans de l’espace',
          axe: 'Algèbre et géométrie',
          lecon: {
            titre: 'Deux écritures, deux usages',
            cours: `Une droite et un plan s’écrivent avec **deux outils différents**, et savoir passer de l’un à l’autre est ce que les exercices demandent le plus souvent.

## Les deux écritures
| | **Représentation paramétrique** | **Équation cartésienne** |
| Elle décrit naturellement | Une **droite** | Un **plan** |
| Ce qu’on y lit | Un **point** (les constantes) et un **vecteur directeur** (les coefficients du paramètre) | Un **vecteur normal** (les coefficients a, b, c) |
| Test d’appartenance d’un point | Il faut **résoudre un système** | On **remplace** et on regarde si l’égalité est vraie |

## La paramétrique d’une droite
Pour A(xA ; yA ; zA) et u(a ; b ; c) :

x = xA + a t
y = yA + b t
z = zA + c t, avec t décrivant ℝ

Chaque valeur du **paramètre t** donne un point de la droite, et un seul.

> Elle **n’est pas unique** : changer de point de base ou multiplier le directeur par un réel non nul décrit la **même** droite. Pour vérifier que deux paramétriques coïncident : tester la **colinéarité** des directeurs, puis l’**appartenance** d’un point de l’une à l’autre.

## L’équation cartésienne d’un plan
| Étape | Ce qu’on fait |
| 1 | Trouver un **vecteur normal** — souvent par produit scalaire nul avec deux directeurs, ce qui donne un système |
| 2 | Écrire ax + by + cz + d = 0 |
| 3 | Déterminer **d** en injectant les coordonnées d’un point connu |

Elle non plus n’est pas unique : multiplier toute l’équation par un réel non nul donne le **même** plan.

## Intersection d’une droite et d’un plan
Le calcul le plus fréquent de l’épreuve : on **substitue** x, y et z de la paramétrique dans l’équation cartésienne, ce qui donne une équation du premier degré en t.

| Ce qu’on obtient | La conclusion |
| Une solution | Un **point** d’intersection, obtenu en reportant t |
| Aucune solution — du type 0 = 5 | Droite **strictement parallèle** au plan |
| Une identité — du type 0 = 0 | Droite **incluse** dans le plan |

## Intersection de deux plans
On résout le système des deux équations cartésiennes. En exprimant deux inconnues en fonction de la troisième, prise comme **paramètre**, on obtient directement une **représentation paramétrique** de la droite d’intersection.

> Le passage paramétrique → cartésien pour une **droite** se fait en éliminant t entre les trois équations : on obtient **deux** équations, car une droite de l’espace est l’**intersection de deux plans**.`,
          },
          questions: [
            ['Dans une représentation paramétrique de droite, que représentent les coefficients du paramètre t ?', ['Les coordonnées d’un vecteur directeur', 'Les coordonnées d’un point de la droite', 'Un vecteur normal', 'La distance à l’origine'], 0, 'Les termes constants donnent, eux, un point de la droite.'],
            ['Une représentation paramétrique d’une droite est unique.', ['Vrai', 'Faux'], 1, 'Changer de point de base ou de multiple du directeur donne une autre écriture de la même droite.'],
            ['Comment obtient-on l’intersection d’une droite et d’un plan ?', ['En substituant la paramétrique dans l’équation cartésienne', 'En résolvant deux équations cartésiennes', 'En calculant un produit scalaire', 'En comparant les vecteurs normaux'], 0, 'On obtient une équation du premier degré en t.'],
            ['Après substitution, on obtient une égalité du type 0 = 5. Que conclure ?', ['La droite est strictement parallèle au plan', 'La droite est incluse dans le plan', 'La droite coupe le plan en un point', 'Le calcul est faux'], 0, 'Une identité 0 = 0 signifierait au contraire que la droite est incluse.'],
            ['Comment détermine-t-on le coefficient d dans ax + by + cz + d = 0 ?', ['En injectant les coordonnées d’un point connu du plan', 'En calculant la norme du vecteur normal', 'En posant d = 0', 'En résolvant un système de trois équations'], 0, 'Les coefficients a, b, c viennent, eux, du vecteur normal.'],
            ['Comment obtenir une paramétrique de la droite d’intersection de deux plans ?', ['En résolvant le système, deux inconnues exprimées en fonction de la troisième prise comme paramètre', 'En additionnant les deux équations', 'En multipliant les vecteurs normaux', 'C’est impossible'], 0, 'La troisième inconnue joue le rôle du paramètre t.'],
            ['Tester si un point appartient à un plan est immédiat avec une équation cartésienne.', ['Vrai', 'Faux'], 0, 'Il suffit de remplacer et de vérifier l’égalité ; en paramétrique il faudrait résoudre un système.'],
            ['Combien d’équations cartésiennes faut-il pour décrire une droite de l’espace ?', ['Deux', 'Une', 'Trois', 'Aucune, seule la paramétrique convient'], 0, 'Une droite de l’espace est l’intersection de deux plans.'],
          ],
        },
        // ---- Chapitre 2 : Analyse ---------------------------------------------
        {
          titre: 'Raisonnement par récurrence',
          axe: 'Analyse',
          lecon: {
            titre: 'Une infinité de démonstrations en deux lignes',
            cours: `Le raisonnement par récurrence démontre qu’une propriété est vraie pour **tous** les entiers à partir d’un rang, sans avoir à la vérifier un par un.

## Le principe
Soit P(n) une propriété dépendant d’un entier n. Si :

| Étape | Ce qu’elle établit |
| **Initialisation** | P(n₀) est **vraie** |
| **Hérédité** | Pour tout n supérieur ou égal à n₀, P(n) vraie **entraîne** P(n+1) vraie |

alors P(n) est vraie **pour tout n supérieur ou égal à n₀**.

> L’image de l’**échelle** : savoir monter sur le premier barreau, et savoir passer d’un barreau au suivant, c’est pouvoir monter aussi haut qu’on veut.

## La rédaction attendue
| Étape | Ce qu’il faut écrire |
| 1 | **Définir** clairement P(n) — la propriété, pas la conclusion |
| 2 | **Initialisation** : vérifier P(n₀) par le calcul, en écrivant **les deux membres** |
| 3 | **Hérédité** : « soit n tel que P(n) est vraie » ; on **suppose** P(n), on **démontre** P(n+1) — en partant du rang n+1 et en y faisant apparaître le rang n |
| 4 | **Conclusion** : « par récurrence, P(n) est vraie pour tout n » |

Sa rigueur fait une part de la note.

## Les deux erreurs classiques
| Erreur | Pourquoi elle est fatale |
| **Oublier l’initialisation** | L’hérédité seule ne prouve rien : « 2ⁿ > n² » est héréditaire à partir d’un rang, et **fausse** pour n = 3 |
| Utiliser **P(n+1)** dans sa propre démonstration | C’est supposer ce qu’on veut prouver. L’hypothèse est **P(n)**, jamais P(n+1) |

## L’hypothèse de récurrence doit servir
Une démonstration d’hérédité qui n’y fait **jamais appel** signale presque toujours une erreur — ou une propriété qui se démontre directement, sans récurrence.

## Les usages au programme
| Usage | Exemple |
| **Formule explicite** d’une suite définie par récurrence | — |
| **Inégalité** | L’**inégalité de Bernoulli** : (1 + a)ⁿ supérieur ou égal à 1 + n a, pour a > −1 |
| **Monotonie** d’une suite u(n+1) = f(u(n)) | — |
| **Encadrement** | Montrer qu’une suite reste dans un intervalle stable |
| **Divisibilité** | Montrer qu’une expression est divisible par un entier |

## Le lien avec la suite du chapitre
La récurrence sert immédiatement après : démontrer qu’une suite est **croissante et majorée** est l’étape qui, par le **théorème de la limite monotone**, garantit sa **convergence**.

> Une propriété héréditaire **sans initialisation vraie** est une échelle sans premier barreau : on sait passer d’un barreau au suivant, mais on n’y monte jamais.`,
          },
          questions: [
            ['Quelles sont les deux étapes d’un raisonnement par récurrence ?', ['L’initialisation et l’hérédité', 'L’hypothèse et la conclusion', 'La majoration et la minoration', 'Le calcul et la vérification'], 0, 'La conclusion vient ensuite, mais elle ne se démontre pas.'],
            ['Que suppose-t-on dans l’étape d’hérédité ?', ['Que P(n) est vraie pour un entier n fixé', 'Que P(n+1) est vraie', 'Que P(n) est vraie pour tout n', 'Rien du tout'], 0, 'Supposer P(n+1) reviendrait à supposer ce qu’on veut démontrer.'],
            ['Une propriété héréditaire est-elle nécessairement vraie ?', ['Non, sans initialisation vraie elle ne prouve rien', 'Oui, l’hérédité suffit', 'Oui, si elle porte sur des entiers', 'Cela dépend de la propriété'], 0, 'C’est l’échelle sans premier barreau.'],
            ['Que dit l’inégalité de Bernoulli ?', ['(1 + a)ⁿ ≥ 1 + n a pour a > −1', '(1 + a)ⁿ ≤ 1 + n a', 'aⁿ ≥ n a', '(1 + a)ⁿ = 1 + n a'], 0, 'Elle se démontre par récurrence sur n.'],
            ['Que signale une démonstration d’hérédité qui n’utilise jamais l’hypothèse de récurrence ?', ['Une erreur, ou une propriété démontrable directement', 'Une démonstration particulièrement élégante', 'Une propriété fausse', 'Une initialisation manquante'], 0, 'L’hypothèse doit servir : c’est elle qui relie les deux rangs.'],
            ['La récurrence peut servir à démontrer une propriété de divisibilité.', ['Vrai', 'Faux'], 0, 'Comme les formules explicites, les inégalités ou la monotonie d’une suite.'],
            ['Dans l’hérédité, par quoi commence-t-on la démonstration ?', ['Par l’expression de rang n+1, où l’on fait apparaître celle de rang n', 'Par la conclusion', 'Par l’initialisation', 'Par le calcul de la limite'], 0, 'C’est ce qui permet d’appliquer l’hypothèse de récurrence.'],
            ['À quoi sert la récurrence dans l’étude des suites ?', ['À établir la monotonie et un encadrement, donc la convergence par le théorème de la limite monotone', 'À calculer directement la limite', 'À déterminer le premier terme', 'À vérifier la périodicité'], 0, 'Croissante et majorée : la suite converge.'],
          ],
        },
        {
          titre: 'Limites de suites',
          axe: 'Analyse',
          lecon: {
            titre: 'Vers quoi une suite se dirige-t-elle ?',
            cours: `Étudier la limite d’une suite, c’est décrire son comportement quand n devient très grand. **Trois** issues sont possibles.

## Les trois comportements
| Comportement | Sa définition | Exemple |
| **Converger** vers ℓ | Tout intervalle ouvert contenant ℓ contient tous les termes à partir d’un certain rang | 1/n vers 0 |
| **Diverger** vers +∞ | Tout intervalle [A ; +∞[ contient tous les termes à partir d’un certain rang | n² |
| **N’avoir aucune limite** | La suite oscille sans se fixer | (−1)ⁿ |

> **Diverger ne signifie pas « tendre vers l’infini »** : une suite sans limite diverge aussi.

## Les limites de référence
Pour tout entier k supérieur ou égal à 1 : n^k tend vers +∞, √n tend vers +∞, et 1/n^k tend vers 0.

## Les opérations et les indéterminations
Somme, produit et quotient se calculent terme à terme — sauf pour les **quatre formes indéterminées** : ∞ − ∞ · 0 × ∞ · ∞/∞ · 0/0.

> Une forme indéterminée n’est pas une absence de limite : c’est un signal qu’il faut **transformer l’écriture** — factoriser par le terme dominant, utiliser l’expression conjuguée, simplifier.

## Les suites géométriques
| La raison q | Le comportement de qⁿ |
| q > 1 | **+∞** |
| q = 1 | Suite **constante** |
| −1 < q < 1 | **0** |
| q inférieur ou égal à −1 | **Pas de limite** |

> C’est le résultat le plus utilisé du chapitre. Pour q > 1, il se démontre par l’**inégalité de Bernoulli**.

## Les théorèmes de comparaison
| Théorème | Ses hypothèses | Sa conclusion |
| Par **minoration** | u(n) supérieure à v(n), et v tend vers +∞ | u tend vers **+∞** |
| Par **majoration** | u(n) inférieure à v(n), et v tend vers −∞ | u tend vers **−∞** |
| Des **gendarmes** | v(n) inférieure à u(n) inférieure à w(n), et v et w convergent vers la **même** limite ℓ | u converge vers **ℓ** |

> Le théorème des gendarmes est l’outil de choix dès qu’apparaît un terme **borné mais sans limite**, comme cos(n) ou (−1)ⁿ.

## Le théorème de la limite monotone
| La suite est… | Elle… |
| **Croissante et majorée** | **Converge** |
| **Décroissante et minorée** | **Converge** |
| Croissante et **non** majorée | Diverge vers **+∞** |

> Il garantit l’**existence** de la limite, **pas sa valeur** : une suite croissante majorée par 10 converge, mais pas nécessairement vers 10.

## Suites définies par récurrence
Pour u(n+1) = f(u(n)) avec f **continue** : si la suite converge vers ℓ, alors ℓ vérifie **f(ℓ) = ℓ**.

> L’ordre du raisonnement est **imposé** : d’abord prouver que la limite **existe** — monotonie et bornes, par récurrence —, ensuite seulement la **calculer**.`,
          },
          questions: [
            ['Une suite qui diverge tend-elle nécessairement vers l’infini ?', ['Non, elle peut n’avoir aucune limite', 'Oui, toujours', 'Oui, vers +∞ uniquement', 'Non, elle converge alors vers 0'], 0, '(−1)ⁿ oscille entre −1 et 1 sans se fixer.'],
            ['Quelle est la limite de qⁿ pour −1 < q < 1 ?', ['0', '+∞', '1', 'Elle n’existe pas'], 0, 'Pour q > 1 la suite tend vers +∞, pour q ≤ −1 elle n’a pas de limite.'],
            ['Quelles sont les formes indéterminées ?', ['∞ − ∞, 0 × ∞, ∞/∞ et 0/0', '0 + ∞ et 1/0', '∞ × ∞ et 0 + 0', '1^∞ uniquement'], 0, 'Elles signalent qu’il faut transformer l’écriture, pas qu’il n’y a pas de limite.'],
            ['Que dit le théorème des gendarmes ?', ['Si v ≤ u ≤ w et que v et w convergent vers la même limite, u y converge aussi', 'Une suite majorée converge', 'Une suite croissante diverge', 'Deux suites adjacentes ont la même limite'], 0, 'C’est l’outil de choix face à un terme borné sans limite, comme cos(n).'],
            ['Une suite croissante et majorée par 10 converge vers 10.', ['Vrai', 'Faux'], 1, 'Le théorème garantit l’existence de la limite, pas sa valeur.'],
            ['Une suite croissante non majorée…', ['Diverge vers +∞', 'Converge', 'N’a pas de limite', 'Est constante à partir d’un rang'], 0, 'C’est le second volet du théorème de la limite monotone.'],
            ['Pour une suite définie par u(n+1) = f(u(n)) qui converge vers ℓ, avec f continue…', ['ℓ vérifie f(ℓ) = ℓ', 'ℓ vaut 0', 'ℓ est le premier terme', 'f(ℓ) = 0'], 0, 'On cherche les points fixes de f — après avoir démontré la convergence.'],
            ['Le théorème de comparaison par minoration s’applique à une suite qui tend vers +∞.', ['Vrai', 'Faux'], 0, 'Si u ≥ v à partir d’un rang et v → +∞, alors u → +∞.'],
          ],
        },
        {
          titre: 'Limites de fonctions',
          axe: 'Analyse',
          lecon: {
            titre: 'Le comportement aux bords du domaine',
            cours: `La limite d’une fonction décrit ce qui se passe **au bord** : quand x tend vers l’infini, ou quand x s’approche d’une **valeur interdite**.

## Les deux familles
| Famille | Ce qu’elle décrit |
| Limite **en l’infini** | f(x) tend vers ℓ, vers ±∞, ou n’a pas de limite |
| Limite **en un réel a** | On distingue la limite **à gauche** (x < a) et **à droite** (x > a) |

> Les deux peuvent différer : 1/x tend vers **−∞** à gauche de 0 et vers **+∞** à droite.

## Les limites de référence
| En **+∞** | La limite | En **0 à droite** | La limite |
| x^n | +∞ | 1/x | +∞ |
| √x | +∞ | 1/√x | +∞ |
| 1/x^n | 0 | — | — |

## Lever une indétermination
Mêmes quatre formes que pour les suites : ∞ − ∞ · 0 × ∞ · ∞/∞ · 0/0.

| Technique | Quand l’employer |
| **Factoriser par le terme de plus haut degré** | Polynômes et quotients de polynômes **en l’infini** |
| Multiplier par l’**expression conjuguée** | Quand une racine carrée produit ∞ − ∞ |
| Reconnaître un **taux d’accroissement** | Formes 0/0 en un point |

> En +∞, un **polynôme** a la même limite que son terme de plus haut degré, et une **fraction rationnelle** la même limite que le quotient des termes de plus haut degré.

## Les théorèmes de comparaison
Minoration, majoration, et **théorème des gendarmes** — celui-ci traite tous les cas où apparaît un facteur **borné**, comme sin(x)/x en +∞.

## Les asymptotes
| Asymptote | Sa condition |
| **Horizontale** y = ℓ | f(x) tend vers ℓ quand x tend vers ±∞ |
| **Verticale** x = a | f(x) tend vers ±∞ quand x tend vers a |
| **Oblique** y = ax + b | f(x) − (ax + b) tend vers 0 en l’infini |

> Une courbe **peut couper** son asymptote horizontale : l’asymptote décrit un comportement **à l’infini**, pas une barrière.

## La composition
Si u(x) tend vers b quand x tend vers a, et f(y) tend vers ℓ quand y tend vers b, alors f(u(x)) tend vers ℓ. C’est ce qui permet de traiter les composées par **changement de variable**.

## Le lien avec la continuité
f est **continue en a** si sa limite en a existe **et vaut f(a)**.

> Une limite peut donc exister **sans** que la fonction soit continue : si elle n’est pas définie en a, ou si sa valeur diffère de la limite.

> Réflexe systématique en l’infini : **factoriser par le terme dominant**. Il lève à lui seul la majorité des indéterminations de l’épreuve.`,
          },
          questions: [
            ['Quelle est la limite d’un polynôme en +∞ ?', ['Celle de son terme de plus haut degré', 'Celle de son terme constant', 'Toujours +∞', 'Elle n’existe pas'], 0, 'On le démontre en factorisant par ce terme dominant.'],
            ['Que vaut la limite de 1/x quand x tend vers 0 par valeurs négatives ?', ['−∞', '+∞', '0', 'Elle n’existe pas'], 0, 'À droite de 0, la limite vaut +∞ : les deux limites latérales diffèrent.'],
            ['Quelle technique lève une indétermination du type ∞ − ∞ avec une racine carrée ?', ['La multiplication par l’expression conjuguée', 'La factorisation par le degré le plus bas', 'Le théorème des gendarmes', 'La dérivation'], 0, 'Elle transforme la différence en quotient, où le terme dominant se factorise.'],
            ['Une courbe peut-elle couper son asymptote horizontale ?', ['Oui, l’asymptote décrit un comportement à l’infini', 'Non, jamais', 'Seulement en un point', 'Seulement si la fonction est paire'], 0, 'L’asymptote n’est pas une barrière.'],
            ['Quelle est la condition d’une asymptote oblique d’équation y = ax + b ?', ['f(x) − (ax + b) tend vers 0 en l’infini', 'f(x) tend vers ax + b', 'f(x)/x tend vers 0', 'f est affine'], 0, 'On détermine a comme limite de f(x)/x, puis b comme limite de f(x) − ax.'],
            ['Une fonction est continue en a si sa limite en a existe.', ['Vrai', 'Faux'], 1, 'Il faut de plus que cette limite soit égale à f(a).'],
            ['Quelle est la limite en +∞ d’une fraction rationnelle ?', ['Celle du quotient des termes de plus haut degré', 'Celle du quotient des termes constants', 'Toujours 0', 'Toujours +∞'], 0, 'C’est la conséquence directe de la factorisation par le terme dominant.'],
            ['Le théorème des gendarmes s’applique aux fonctions comme aux suites.', ['Vrai', 'Faux'], 0, 'Il traite tous les cas où apparaît un facteur borné, comme sin(x)/x en +∞.'],
          ],
        },
        {
          titre: 'Dérivée de 2 fonctions composées',
          axe: 'Analyse',
          lecon: {
            titre: 'Dériver de l’extérieur vers l’intérieur',
            cours: `Dériver une composée est le geste technique **le plus fréquent de l’année** : il intervient dans toute fonction écrite avec une exponentielle, un logarithme, une racine ou une puissance d’expression.

## La composée
La composée de u par f associe à x le nombre f(u(x)) : on applique **d’abord u**, **ensuite f**.

> L’ordre n’est pas symétrique : f ∘ u et u ∘ f sont en général **différentes**.

## Le théorème
Si u est dérivable en x et f dérivable en u(x) :

(f ∘ u)′(x) = u′(x) × f′(u(x))

> La dérivée de la fonction **extérieure**, prise **en la fonction intérieure**, multipliée par la dérivée de la fonction **intérieure**. Le facteur u′(x) est celui qu’on oublie.

## Les cas usuels
| Fonction | Sa dérivée | Condition |
| uⁿ | n u′ uⁿ⁻¹ | — |
| √u | u′ / (2√u) | u > 0 |
| **e^u** | **u′ e^u** | — |
| **ln u** | **u′ / u** | u > 0 |
| 1/u | −u′ / u² | u non nul |
| cos u, sin u | −u′ sin u, u′ cos u | — |

> Tous se **déduisent** du théorème : ce sont des cas particuliers, pas des formules indépendantes à mémoriser séparément.

## Deux exemples détaillés
| La fonction | u et u′ | La dérivée |
| e^(3x² + 1) | u = 3x² + 1, u′ = 6x | **6x e^(3x² + 1)** |
| (2x − 5)⁴ | u = 2x − 5, u′ = 2 | 2 × 4 × (2x − 5)³ = **8(2x − 5)³** |

## Les trois erreurs à éviter
| Erreur | Ce qui est juste |
| Écrire (e^(3x))′ = e^(3x) | **3 e^(3x)** : on oublie u′ |
| Multiplier les dérivées sans composer | La dérivée extérieure s’évalue **en u(x)**, pas en x |
| Confondre f ∘ u et f × u | Ce sont deux objets différents |

## Le domaine de dérivabilité
Il faut que u soit dérivable **et** que f le soit **en u(x)**.

> Pour √u, cela impose u **strictement** positif : la racine n’est pas dérivable en 0, même si elle y est définie. Pour ln u, il faut u > 0.

## À quoi cela sert immédiatement
Toute étude de fonction y passe : signe de la dérivée, variations, tangentes, extremums — et, **lu à l’envers**, la recherche de **primitives**.

> Voir **u′ e^u** dans une expression, c’est savoir qu’une primitive est **e^u**. Le chapitre des primitives n’est que celui-ci **retourné**.`,
          },
          questions: [
            ['Quelle est la dérivée de f ∘ u ?', ['u′(x) × f′(u(x))', 'f′(x) × u′(x)', 'f′(u′(x))', 'u(x) × f′(x)'], 0, 'La dérivée extérieure est évaluée en u(x), et multipliée par u′(x).'],
            ['Quelle est la dérivée de e^u ?', ['u′ e^u', 'e^u', 'u e^u', 'e^(u′)'], 0, 'Le facteur u′ est celui qu’on oublie le plus souvent.'],
            ['Quelle est la dérivée de ln(u) pour u > 0 ?', ['u′ / u', '1 / u', 'u′ ln(u)', 'u / u′'], 0, 'C’est un cas particulier de la dérivée d’une composée.'],
            ['Quelle est la dérivée de √u ?', ['u′ / (2√u)', '1 / (2√u)', 'u′ √u', '2u′ √u'], 0, 'Elle exige u > 0 strictement : la racine n’est pas dérivable en 0.'],
            ['Que vaut la dérivée de (2x − 5)⁴ ?', ['8(2x − 5)³', '4(2x − 5)³', '(2x − 5)³', '8(2x − 5)⁴'], 0, 'Formule (uⁿ)′ = n u′ uⁿ⁻¹ avec u′ = 2.'],
            ['f ∘ u et u ∘ f désignent la même fonction.', ['Vrai', 'Faux'], 1, 'L’ordre de composition n’est pas symétrique.'],
            ['Quelle est la dérivée de (uⁿ) ?', ['n u′ uⁿ⁻¹', 'n uⁿ⁻¹', 'u′ uⁿ', 'n u′ uⁿ'], 0, 'Cas particulier du théorème de dérivation des composées.'],
            ['La formule de la dérivée d’une composée sert aussi à trouver des primitives.', ['Vrai', 'Faux'], 0, 'Reconnaître la forme u′ f′(u) est la méthode principale de recherche de primitives.'],
          ],
        },
        {
          titre: 'Fonctions convexes',
          axe: 'Analyse',
          lecon: {
            titre: 'La courbure, lue sur la dérivée seconde',
            cours: `La dérivée renseigne sur le **sens** de variation ; la **dérivée seconde** renseigne sur la façon dont ce sens évolue — c’est la **convexité**.

## Les définitions
| | **Convexe** | **Concave** |
| Par rapport aux **tangentes** | La courbe est **au-dessus** | La courbe est **au-dessous** |
| Par rapport aux **cordes** | La courbe est **au-dessous** | La courbe est au-dessus |
| Image | Elle « **tient l’eau** » | — |

## Les caractérisations
Pour f deux fois dérivable, les trois propositions sont **équivalentes** : f est **convexe** ; **f′ est croissante** ; **f″ est positive**.

Symétriquement pour la concavité : f′ décroissante, f″ négative.

## Le point d’inflexion
Un point où la courbe **change de convexité**. En ce point, **f″ s’annule en changeant de signe** — et la **tangente traverse la courbe**, signe visuel le plus net.

> L’annulation de f″ ne suffit pas : pour x⁴, f″(0) = 0 mais la fonction reste convexe partout. C’est le **changement de signe** qui compte — exactement comme pour l’extremum et f′.

## Les fonctions de référence
| Fonction | Sa convexité |
| x², e^x, x^n pour n **pair** | **Convexes** sur ℝ |
| ln | **Concave** sur les réels strictement positifs |
| x³ | **Concave** sur les négatifs, **convexe** sur les positifs — point d’inflexion en 0 |
| Fonction **affine** | Convexe **et** concave : sa courbe est confondue avec ses tangentes |

## Les usages
| Usage | Ce qu’il donne |
| **Encadrer** par les tangentes | La convexité de e^x donne **e^x supérieur ou égal à x + 1** pour tout réel |
| **Interpréter** une courbe | En économie, la convexité du coût traduit des rendements décroissants |
| **Lire un graphique** | Distinguer « ça augmente » (f′ > 0) de « ça augmente **de plus en plus vite** » (f′ > 0 et f″ > 0) |

En physique, un **point d’inflexion** marque le moment où une croissance **cesse d’accélérer**.

> Variation et convexité sont **indépendantes** : une fonction peut être décroissante et convexe, croissante et concave, et toutes les combinaisons. Les confondre est l’erreur la plus fréquente à l’oral.`,
          },
          questions: [
            ['Une fonction convexe a sa courbe…', ['Au-dessus de chacune de ses tangentes', 'Au-dessous de chacune de ses tangentes', 'Confondue avec ses tangentes', 'Au-dessus de chacune de ses cordes'], 0, 'Et au-dessous de chacune de ses cordes.'],
            ['Quelle condition sur f″ caractérise la convexité ?', ['f″ positive sur l’intervalle', 'f″ négative sur l’intervalle', 'f″ nulle', 'f″ croissante'], 0, 'De façon équivalente, f′ est croissante.'],
            ['Qu’est-ce qu’un point d’inflexion ?', ['Un point où la courbe change de convexité', 'Un point où la fonction change de variation', 'Un maximum local', 'Un point où f s’annule'], 0, 'En ce point, la tangente traverse la courbe.'],
            ['L’annulation de f″ en un point suffit-elle à en faire un point d’inflexion ?', ['Non, il faut un changement de signe de f″', 'Oui, toujours', 'Oui, si f est croissante', 'Non, il faut aussi f′ = 0'], 0, 'Pour x⁴, f″(0) = 0 alors que la fonction reste convexe partout.'],
            ['La fonction ln est convexe sur ]0 ; +∞[.', ['Vrai', 'Faux'], 1, 'Elle est concave : sa dérivée 1/x est décroissante.'],
            ['Quelle inégalité la convexité de l’exponentielle permet-elle d’établir ?', ['e^x ≥ x + 1 pour tout réel x', 'e^x ≤ x + 1', 'e^x ≥ x²', 'ln(x) ≤ x'], 0, 'La courbe est au-dessus de sa tangente en 0, d’équation y = x + 1.'],
            ['Une fonction affine est à la fois convexe et concave.', ['Vrai', 'Faux'], 0, 'Sa courbe est confondue avec ses tangentes : f″ est nulle.'],
            ['Une fonction décroissante peut-elle être convexe ?', ['Oui, variation et convexité sont indépendantes', 'Non, jamais', 'Oui, seulement sur un intervalle borné', 'Seulement si elle est positive'], 0, 'Confondre les deux informations est l’erreur la plus fréquente.'],
          ],
        },
        {
          titre: 'Continuité des fonctions d’une variable réelle',
          axe: 'Analyse',
          lecon: {
            titre: 'Tracer sans lever le crayon, et ce que cela garantit',
            cours: `La continuité est l’hypothèse qui rend légitimes la plupart des raisonnements de l’analyse — et elle sert surtout à démontrer qu’une équation **admet** une solution.

## La définition
f est **continue en a** si f est définie en a et si sa limite en a existe **et vaut f(a)**.

> Intuitivement : on trace la courbe **sans lever le crayon**. Image fidèle sur les fonctions du programme.

## Ce qui est continu
| Continu sur son ensemble de définition | Le contre-exemple |
| Polynômes, fonctions rationnelles, racine carrée | La **fonction partie entière** : discontinue en **chaque entier** |
| Exponentielle, logarithme, sinus, cosinus, valeur absolue | — |
| Sommes, produits, quotients (dénominateur non nul), composées | — |

## Dérivabilité et continuité
Une fonction **dérivable** en a est **continue** en a. **La réciproque est fausse.**

> La **valeur absolue** est continue en 0 sans y être dérivable : sa courbe y présente un **point anguleux**. Retenir le sens de l’implication est indispensable.

## Le théorème des valeurs intermédiaires
Si f est **continue** sur un segment, alors pour tout réel k compris entre f(a) et f(b), l’équation f(x) = k admet **au moins une** solution.

> La continuité est essentielle : la partie entière **saute par-dessus** des valeurs sans les prendre.

## Le corollaire — théorème de la bijection
Si f est continue **et strictement monotone**, la solution est **unique**.

| L’élément de rédaction | Ce qu’il apporte |
| La **continuité** | L’existence |
| La **stricte monotonie** | L’unicité |
| L’**encadrement de k** entre les valeurs aux bornes | L’applicabilité |

Chacun des trois vaut des points. Le théorème s’étend aux intervalles **ouverts ou infinis** en remplaçant les valeurs aux bornes par les **limites**.

## La recherche approchée
Le théorème prouve qu’une solution existe **sans la donner**. La **dichotomie** l’approche : couper l’intervalle en deux, garder la moitié où le signe change, recommencer.

> Chaque étape **divise l’amplitude par deux** : dix étapes suffisent à gagner trois décimales.

> Le **théorème des valeurs intermédiaires** donne l’existence, la **stricte monotonie** ajoute l’unicité, la **dichotomie** fournit la valeur approchée. Trois outils, trois rôles distincts.`,
          },
          questions: [
            ['Quand une fonction est-elle continue en a ?', ['Quand sa limite en a existe et vaut f(a)', 'Quand elle est définie en a', 'Quand elle est dérivable en a', 'Quand elle est croissante en a'], 0, 'La simple existence de la limite ne suffit pas.'],
            ['Une fonction dérivable en a est-elle continue en a ?', ['Oui, toujours', 'Non, jamais', 'Seulement si elle est croissante', 'Seulement sur un intervalle fermé'], 0, 'La réciproque est fausse : la valeur absolue est continue en 0 sans y être dérivable.'],
            ['Que garantit le théorème des valeurs intermédiaires ?', ['L’existence d’au moins une solution à f(x) = k', 'L’unicité de la solution', 'La valeur exacte de la solution', 'La dérivabilité de f'], 0, 'L’unicité demande en plus la stricte monotonie.'],
            ['Quelle hypothèse ajoute l’unicité au théorème des valeurs intermédiaires ?', ['La stricte monotonie de f', 'La dérivabilité de f', 'La positivité de f', 'La convexité de f'], 0, 'C’est le corollaire dit théorème de la bijection.'],
            ['La fonction partie entière est continue sur ℝ.', ['Vrai', 'Faux'], 1, 'Elle est discontinue en chaque entier : c’est le contre-exemple de référence.'],
            ['Que fait la méthode de dichotomie ?', ['Elle approche la solution en divisant l’amplitude par deux à chaque étape', 'Elle démontre l’existence de la solution', 'Elle calcule la valeur exacte', 'Elle vérifie la continuité'], 0, 'Dix étapes suffisent à gagner environ trois décimales.'],
            ['Le théorème de la bijection s’applique-t-il sur un intervalle ouvert ou infini ?', ['Oui, en remplaçant les valeurs aux bornes par les limites', 'Non, uniquement sur un segment fermé', 'Oui, sans aucune adaptation', 'Seulement si f est bornée'], 0, 'C’est l’extension usuelle dans les exercices.'],
            ['Les quotients de fonctions continues sont continus partout.', ['Vrai', 'Faux'], 1, 'Là où le dénominateur ne s’annule pas.'],
          ],
        },
        {
          titre: 'Fonction logarithme népérien (ln)',
          axe: 'Analyse',
          lecon: {
            titre: 'La fonction qui transforme les produits en sommes',
            cours: `Le logarithme népérien est la fonction **réciproque** de l’exponentielle. Toutes ses propriétés en découlent — y compris la seule qui ait fait son succès historique : **transformer un produit en somme**.

## La définition
Pour x > 0, **ln(x)** est l’unique réel y tel que **e^y = x** :

e^(ln x) = x pour x > 0, et ln(e^x) = x pour tout réel x

> Il n’est défini que sur les réels **strictement positifs**. C’est la condition d’existence à vérifier avant tout calcul, et l’oubli le plus sanctionné du chapitre.

## Les valeurs de référence
| x | ln(x) |
| 1 | **0** |
| e | **1** |
| Entre 0 et 1 | **Négatif** |
| Supérieur à 1 | **Positif** |

## Les propriétés algébriques
| Propriété | Ce qu’elle transforme |
| **ln(ab) = ln a + ln b** | Un produit en **somme** — la relation fondamentale |
| ln(a/b) = ln a − ln b | Un quotient en différence |
| ln(1/b) = − ln b | — |
| ln(a^n) = n ln a | Un exposant en **facteur** |
| ln(√a) = (1/2) ln a | — |

> **ln(a + b) n’est pas ln a + ln b.** C’est l’erreur la plus fréquente — et la plus immédiatement repérable.

## La courbe
**Strictement croissante**, elle passe par (1 ; 0) et (e ; 1), et présente une **asymptote verticale** en 0.

> Elle est **symétrique** de celle de l’exponentielle par rapport à la droite y = x — les deux fonctions étant réciproques l’une de l’autre.

## Résoudre avec le logarithme
La stricte croissance donne, pour a > 0 et b > 0 : ln a = ln b équivaut à a = b, et ln a < ln b équivaut à a < b.

> C’est ce qui résout les équations où l’inconnue est **en exposant** : 2^n > 1000 devient n ln 2 > ln 1000, donc n > ln(1000)/ln(2).

## Les usages
| Usage | La formule |
| **Temps de doublement** d’un capital ou d’une population | ln(2)/ln(1 + t) |
| **Demi-vie** d’un noyau radioactif | ln(2)/λ |
| **Échelles logarithmiques** | Décibels, magnitude d’un séisme, pH |

## Le lien avec les suites
Une suite géométrique de raison positive devient **arithmétique** par le logarithme : ln(u(n)) = ln(u₀) + n ln(q).

> C’est ce qui rend les **seuils** calculables **sans tâtonnement**.

> Le logarithme est la seule fonction du programme qui change la **nature** d’une opération : produits en sommes, puissances en produits.`,
          },
          questions: [
            ['Quel est l’ensemble de définition de la fonction ln ?', [']0 ; +∞[', 'ℝ', '[0 ; +∞[', 'ℝ privé de 0'], 0, 'Vérifier la condition d’existence est l’oubli le plus sanctionné du chapitre.'],
            ['Que vaut ln(ab) pour a et b strictement positifs ?', ['ln a + ln b', 'ln a × ln b', 'ln(a) ln(b)', 'ln(a + b)'], 0, 'C’est la relation fondamentale : le produit devient somme.'],
            ['ln(a + b) est-il égal à ln a + ln b ?', ['Non, cette égalité est fausse', 'Oui, toujours', 'Oui, si a et b sont positifs', 'Oui, si a = b'], 0, 'C’est l’erreur la plus fréquente du chapitre.'],
            ['Que vaut ln(e) ?', ['1', '0', 'e', 'Indéfini'], 0, 'Et ln(1) = 0 : ce sont les deux valeurs de référence.'],
            ['Comment résoudre 2^n > 1000 ?', ['En passant au logarithme : n ln 2 > ln 1000', 'En divisant par 2', 'En élevant au carré', 'En dérivant'], 0, 'Le logarithme fait descendre l’exposant.'],
            ['La courbe de ln admet une asymptote verticale en 0.', ['Vrai', 'Faux'], 0, 'ln(x) tend vers −∞ quand x tend vers 0 par valeurs positives.'],
            ['Quelle relation lie ln et exponentielle ?', ['Ce sont des fonctions réciproques : e^(ln x) = x pour x > 0', 'Ce sont des fonctions égales', 'ln est la dérivée de l’exponentielle', 'ln est l’opposée de l’exponentielle'], 0, 'Leurs courbes sont symétriques par rapport à la droite d’équation y = x.'],
            ['Que vaut ln(a^n) ?', ['n ln a', 'ln(a)^n', 'a ln n', 'n + ln a'], 0, 'La puissance devient un produit : c’est ce qui rend les exposants calculables.'],
          ],
        },
        {
          titre: 'Fonction ln (logarithme népérien) : continuité, limites et dérivabilité',
          axe: 'Analyse',
          lecon: {
            titre: 'L’étude analytique complète',
            cours: `La fiche précédente donnait les propriétés **algébriques** du logarithme. Celle-ci l’étudie **comme une fonction** : dérivée, limites, croissances comparées.

## Continuité et dérivabilité
| Élément | Sa valeur | Ce qu’il entraîne |
| **ln′(x)** | **1/x** | Strictement positive : ln est **strictement croissante** |
| **ln″(x)** | −1/x² | Strictement négative : ln est **concave** |

> La monotonie du logarithme se démontre ainsi **en une ligne**.

## Les limites aux bornes
| En… | La limite | Ce qu’elle donne |
| **0** par valeurs positives | **−∞** | Une **asymptote verticale** d’équation x = 0 |
| **+∞** | **+∞** | Mais **lentement** — au sens précis donné ci-dessous |

## Les croissances comparées
| Limite | Sa valeur |
| ln(x)/x, et plus généralement ln(x)/x^n, en +∞ | **0** |
| x ln(x), en 0 par valeurs positives | **0** |
| ln(1 + x)/x, en 0 | **1** — c’est le **nombre dérivé de ln en 1** |

> Le principe : **la puissance l’emporte toujours sur le logarithme**. Toute indétermination ∞/∞ mêlant ln et une puissance se lève par cette règle.

Symétriquement, du côté de l’exponentielle : e^x/x^n tend vers +∞ — **l’exponentielle l’emporte sur toute puissance**.

## La dérivée de ln(u)
Pour u strictement positive et dérivable : **(ln u)′ = u′ / u**

> C’est le cas le plus fréquent en exercice. Il impose de déterminer d’abord l’ensemble où **u > 0** : le domaine d’étude de ln(u) **n’est pas** celui de u.

## La tangente en 1
ln(1) = 0 et ln′(1) = 1 : la tangente en 1 a pour équation **y = x − 1**. La **concavité** place la courbe **au-dessous** de cette tangente, d’où, pour tout x > 0 :

ln(x) inférieur ou égal à x − 1

> C’est le pendant exact de e^x supérieur ou égal à x + 1, et elle sert dans de nombreuses majorations.

## L’étude d’une fonction contenant ln
1. Le **domaine** : où l’argument est strictement positif ;
2. Les **limites** aux bornes ;
3. La **dérivée** et son **signe** ;
4. Le **tableau de variations** ;
5. Les éventuelles **asymptotes**, puis le tracé.

> Deux automatismes suffisent : **(ln u)′ = u′/u** pour dériver, et « **la puissance gagne** » pour lever les indéterminations.`,
          },
          questions: [
            ['Quelle est la dérivée de ln(x) ?', ['1/x', 'ln(x)/x', 'x', '−1/x²'], 0, 'Strictement positive sur ]0 ; +∞[, elle prouve la stricte croissance de ln.'],
            ['Quelle est la limite de ln(x) quand x tend vers 0 par valeurs positives ?', ['−∞', '+∞', '0', '1'], 0, 'D’où l’asymptote verticale d’équation x = 0.'],
            ['Que vaut la limite de ln(x)/x en +∞ ?', ['0', '+∞', '1', 'Elle n’existe pas'], 0, 'C’est la croissance comparée : la puissance l’emporte sur le logarithme.'],
            ['Quelle est la dérivée de ln(u) pour u strictement positive ?', ['u′ / u', '1 / u', 'u / u′', 'u′ ln(u)'], 0, 'Il faut d’abord déterminer l’ensemble où u > 0.'],
            ['Quelle est la limite de x ln(x) quand x tend vers 0 par valeurs positives ?', ['0', '−∞', '+∞', '1'], 0, 'Encore une croissance comparée, à connaître par cœur.'],
            ['Quelle est l’équation de la tangente à la courbe de ln au point d’abscisse 1 ?', ['y = x − 1', 'y = x', 'y = x + 1', 'y = 1'], 0, 'ln(1) = 0 et ln′(1) = 1.'],
            ['La fonction ln est concave sur ]0 ; +∞[.', ['Vrai', 'Faux'], 0, 'Sa dérivée seconde vaut −1/x², strictement négative.'],
            ['Quelle inégalité découle de la concavité de ln ?', ['ln(x) ≤ x − 1 pour tout x > 0', 'ln(x) ≥ x − 1', 'ln(x) ≤ x', 'ln(x) ≥ 0'], 0, 'La courbe est au-dessous de sa tangente en 1.'],
          ],
        },
        {
          titre: 'Fonctions cosinus et sinus',
          axe: 'Analyse',
          lecon: {
            titre: 'Les deux fonctions qui reviennent sur elles-mêmes',
            cours: `Cosinus et sinus sont les seules fonctions du programme à être **périodiques**. Cette propriété change toute la méthode d’étude : on travaille sur **une période**, puis on complète.

## Définition et périodicité
Sur le cercle trigonométrique, le point associé au réel x a pour coordonnées (cos x ; sin x). Les deux fonctions sont définies sur **ℝ** tout entier, à valeurs dans **[−1 ; 1]**, et **périodiques de période 2π**.

## Parité
| Fonction | Sa parité | Sa symétrie |
| **cos** | **Paire** : cos(−x) = cos x | Par rapport à l’**axe des ordonnées** |
| **sin** | **Impaire** : sin(−x) = −sin x | Par rapport à l’**origine** |

> Conséquence pratique : il suffit d’étudier sur [0 ; π], puis d’utiliser **parité et périodicité**. C’est ce qu’attend l’énoncé quand il demande de « réduire l’intervalle d’étude ».

## Les formules à connaître
| Formule | Ce qu’elle donne |
| cos²x + sin²x = 1 | La relation fondamentale |
| cos(x + π) = −cos x, sin(x + π) = −sin x | Le demi-tour |
| cos(π/2 − x) = sin x, sin(π/2 − x) = cos x | L’échange des deux fonctions |

Plus les valeurs remarquables en 0, π/6, π/4, π/3, π/2.

## Dérivées
cos′(x) = **−sin(x)** et sin′(x) = **cos(x)**

> Le **signe moins** sur la dérivée du cosinus est l’oubli classique.

Pour les composées : (cos u)′ = −u′ sin u et (sin u)′ = u′ cos u. En particulier, la dérivée de sin(ωx) vaut **ω cos(ωx)**.

## Les limites de référence en 0
| Limite | Sa valeur | Ce qu’elle est |
| sin(x)/x | **1** | Le nombre dérivé de **sin en 0** |
| (cos(x) − 1)/x | **0** | Le nombre dérivé de **cos en 0** |

> Ni cos ni sin n’ont de **limite en +∞** : elles oscillent indéfiniment. Une expression comme sin(x)/x en +∞ se traite donc par le **théorème des gendarmes**, en encadrant sin(x) entre −1 et 1.

## Variations sur une période
Sur [0 ; π] : **cos décroît** de 1 à −1 ; **sin croît** de 0 à 1 sur [0 ; π/2], puis décroît de 1 à 0.

## Résoudre une équation trigonométrique
| L’équation | Ses solutions |
| cos(x) = cos(a) | x = a + 2kπ **ou** x = **−a** + 2kπ |
| sin(x) = sin(a) | x = a + 2kπ **ou** x = **π − a** + 2kπ |

> Oublier la **seconde famille** est l’erreur la plus fréquente : une équation trigonométrique a presque toujours **deux** familles de solutions par période.

> Dans les modélisations, sin(ωt + φ) décrit **toute oscillation** : ω donne la pulsation, φ le déphasage, et l’amplitude multiplie l’ensemble. Le lien avec la physique est direct.`,
          },
          questions: [
            ['Quelle est la dérivée de cos(x) ?', ['−sin(x)', 'sin(x)', 'cos(x)', '−cos(x)'], 0, 'Le signe moins est l’oubli classique du chapitre.'],
            ['Quelle est la période des fonctions cosinus et sinus ?', ['2π', 'π', 'π/2', '1'], 0, 'C’est elle qui permet de réduire l’intervalle d’étude.'],
            ['La fonction sinus est…', ['Impaire', 'Paire', 'Ni paire ni impaire', 'Périodique de période π'], 0, 'sin(−x) = −sin(x) : sa courbe est symétrique par rapport à l’origine.'],
            ['Que vaut la limite de sin(x)/x quand x tend vers 0 ?', ['1', '0', '+∞', 'Elle n’existe pas'], 0, 'C’est le nombre dérivé de sinus en 0.'],
            ['Les fonctions cosinus et sinus ont-elles une limite en +∞ ?', ['Non, elles oscillent indéfiniment', 'Oui, elles tendent vers 0', 'Oui, elles tendent vers 1', 'Oui, vers +∞'], 0, 'D’où le recours au théorème des gendarmes pour sin(x)/x en +∞.'],
            ['Quelle est la dérivée de sin(ωx) ?', ['ω cos(ωx)', 'cos(ωx)', '−ω cos(ωx)', 'ω sin(ωx)'], 0, 'Application directe de la dérivée d’une composée.'],
            ['L’équation cos(x) = cos(a) admet combien de familles de solutions ?', ['Deux : x = a + 2kπ et x = −a + 2kπ', 'Une seule', 'Trois', 'Aucune'], 0, 'Oublier la seconde famille est l’erreur la plus fréquente.'],
            ['Que vaut cos²x + sin²x ?', ['1', '0', '2', 'cos(2x)'], 0, 'C’est la relation fondamentale de la trigonométrie.'],
          ],
        },
        {
          titre: 'Primitives et équations différentielles',
          axe: 'Analyse',
          lecon: {
            titre: 'Remonter de la dérivée à la fonction',
            cours: `Chercher une **primitive**, c’est faire le chemin **inverse** de la dérivation. Ce chapitre installe l’outil, puis l’applique à la modélisation par une **équation différentielle**.

## La définition
F est une **primitive** de f sur un intervalle I si F est dérivable sur I et si **F′ = f**.

| Fait | Ce qu’il implique |
| Toute fonction **continue** sur un intervalle y admet des primitives | L’existence est acquise |
| Elles diffèrent toutes d’une **constante** | L’ensemble des primitives est F + C |
| Une seule prend une **valeur donnée en un point donné** | C’est la **condition initiale** qui fixe C |

## Les primitives usuelles
| f(x) | Une primitive F(x) |
| x^n, n différent de −1 | x^(n+1)/(n+1) |
| 1/x | ln de la valeur absolue de x |
| e^x | e^x |
| cos x | sin x |
| sin x | **−**cos x |
| 1/√x | 2√x |

## Les formes composées
Elles se lisent en **retournant** la dérivation des composées.

| Expression | Sa primitive |
| u′ uⁿ | uⁿ⁺¹/(n+1) |
| u′/u | ln de la valeur absolue de u |
| **u′ e^u** | **e^u** |
| u′/√u | 2√u |
| u′ cos u | sin u |

> **Reconnaître u′** est toute la méthode. Pour 2x e^(x²+1), on voit u = x² + 1 et u′ = 2x : le compte est bon. Pour x e^(x²+1), il faut un facteur **1/2**.

## Les deux équations différentielles du programme
| Équation | Ses solutions | Ce qu’elle modélise |
| **y′ = a y** | x ↦ C e^(a x) | Toute évolution dont la vitesse est **proportionnelle à la quantité présente** |
| **y′ = a y + b** | x ↦ C e^(a x) − b/a | La même, avec un apport ou un prélèvement constant |

Croissance de population, **décroissance radioactive** (a < 0), charge d’un condensateur.

La méthode pour la seconde : trouver une **solution particulière constante** — celle qui vérifie 0 = a y + b, soit y = −b/a — puis y ajouter les solutions de l’équation **sans second membre**.

## La condition initiale
L’équation donne une **famille** de solutions ; la condition initiale en sélectionne **une seule**.

> Un problème de modélisation comporte donc **toujours deux données** : l’équation et l’état de départ.

> Le vocabulaire compte : une primitive est une **fonction**, une constante d’intégration est un **réel**, et « **la** » primitive n’existe pas sans condition initiale.`,
          },
          questions: [
            ['Qu’est-ce qu’une primitive F de f sur un intervalle ?', ['Une fonction dérivable telle que F′ = f', 'Une fonction telle que f′ = F', 'La dérivée seconde de f', 'L’intégrale de f entre 0 et x uniquement'], 0, 'Toute fonction continue sur un intervalle y admet des primitives.'],
            ['De combien les primitives d’une même fonction diffèrent-elles ?', ['D’une constante', 'D’un facteur multiplicatif', 'D’une fonction affine', 'Elles ne diffèrent pas'], 0, 'C’est ce qui rend nécessaire une condition initiale pour en désigner une.'],
            ['Quelle est une primitive de 1/x sur ]0 ; +∞[ ?', ['ln(x)', '1/x²', '−1/x²', 'x ln(x)'], 0, 'Sur un intervalle contenant des négatifs, on écrit ln|x|.'],
            ['Quelle est une primitive de la forme u′/u ?', ['ln|u|', 'u²/2', '1/u', 'u′ ln(u)'], 0, 'C’est la lecture inverse de la dérivée de ln(u).'],
            ['Quelles sont les solutions de l’équation différentielle y′ = a y ?', ['Les fonctions x ↦ C e^(a x)', 'Les fonctions x ↦ a x + C', 'Les fonctions x ↦ C ln(a x)', 'La seule fonction nulle'], 0, 'C’est l’équation de toute évolution proportionnelle à la quantité présente.'],
            ['Comment résout-on y′ = a y + b ?', ['On cherche une solution particulière constante, puis on ajoute les solutions sans second membre', 'On intègre directement les deux membres', 'On dérive l’équation', 'On pose y = 0'], 0, 'La solution particulière est y = −b/a.'],
            ['Une équation différentielle admet une unique solution.', ['Vrai', 'Faux'], 1, 'Elle admet une famille de solutions ; c’est la condition initiale qui en sélectionne une.'],
            ['Quelle est une primitive de u′ e^u ?', ['e^u', 'u e^u', 'e^u / u', 'u′ e^u'], 0, 'Lecture inverse de la dérivée d’une exponentielle composée.'],
          ],
        },
        {
          titre: 'Calcul intégral',
          axe: 'Analyse',
          lecon: {
            titre: 'Une aire, une primitive, une moyenne',
            cours: `L’intégrale est le seul objet du programme à être à la fois **géométrique** (une aire), **analytique** (une primitive) et **statistique** (une moyenne).

## La définition géométrique
Pour f **continue et positive**, l’intégrale de a à b est l’**aire**, en unités d’aire, du domaine compris entre la courbe, l’axe des abscisses et les droites x = a et x = b.

> Quand f est **négative**, l’intégrale est l’**opposé** de l’aire. Une intégrale n’est donc pas une aire en général : c’est une **aire algébrique**.

## Le théorème fondamental
Si F est une primitive de f :

∫ de a à b de f(x) dx = F(b) − F(a)

> C’est le résultat qui relie les deux visages de l’objet : **calculer une aire revient à trouver une primitive**. Le résultat ne dépend pas de la primitive choisie, la constante s’éliminant dans la différence.

## Les propriétés
| Propriété | Ce qu’elle dit |
| **Linéarité** | L’intégrale d’une somme est la somme des intégrales ; une constante sort |
| **Relation de Chasles** | De a à b, plus de b à c, égale de a à c |
| **Inversion des bornes** | Échanger a et b change le **signe** |
| **Positivité** | Si f est positive et a inférieur à b, l’intégrale est positive |
| **Croissance** | Si f est inférieure à g, son intégrale l’est aussi — l’outil des **encadrements** |

## La valeur moyenne
(1 / (b − a)) × ∫ de a à b de f(x) dx

> Interprétation : la **hauteur du rectangle** de base [a ; b] qui aurait la même aire que le domaine sous la courbe. Elle sert en physique (valeur moyenne d’un signal) et en probabilités.

## L’aire entre deux courbes
Pour f au-dessus de g, l’aire vaut l’intégrale de (f − g).

> Il faut donc **déterminer laquelle est au-dessus avant** de calculer — et **découper** l’intervalle si les courbes se croisent.

## L’intégration par parties
∫ u′v = [uv] − ∫ u v′

| Quand l’employer | Exemples |
| L’intégrande est un **produit** dont un facteur **se simplifie en dérivant** | x e^x, x cos x |
| Ou dont un facteur n’a pas de primitive simple | ln x, en posant v = ln x et u′ = 1 |

## Les valeurs approchées
Quand aucune primitive ne s’exprime simplement : méthode des **rectangles** ou des **trapèzes**, en découpant en n intervalles. La précision croît avec n.

> Le fil du chapitre : **dériver et intégrer sont deux opérations inverses**. C’est le théorème fondamental qui l’énonce, et tout le calcul intégral en découle.`,
          },
          questions: [
            ['Que vaut l’intégrale de a à b de f, si F est une primitive de f ?', ['F(b) − F(a)', 'F(a) − F(b)', 'F(b) × F(a)', 'F(b − a)'], 0, 'Le résultat ne dépend pas de la primitive choisie : la constante s’élimine.'],
            ['Une intégrale est-elle toujours positive ?', ['Non, elle est négative si la fonction est négative', 'Oui, c’est une aire', 'Oui, si les bornes sont dans l’ordre croissant', 'Non, elle est toujours négative'], 0, 'C’est une aire algébrique, pas une aire géométrique.'],
            ['Que dit la relation de Chasles pour les intégrales ?', ['De a à b, plus de b à c, égale de a à c', 'L’intégrale d’une somme est la somme des intégrales', 'Échanger les bornes change le signe', 'L’intégrale d’un produit est le produit des intégrales'], 0, 'Elle permet de découper un intervalle d’intégration.'],
            ['Comment calcule-t-on la valeur moyenne de f sur [a ; b] ?', ['En divisant l’intégrale par (b − a)', 'En multipliant l’intégrale par (b − a)', 'En prenant (f(a) + f(b))/2', 'En dérivant l’intégrale'], 0, 'C’est la hauteur du rectangle de même aire que le domaine sous la courbe.'],
            ['Quelle est la formule de l’intégration par parties ?', ['∫ u′v = [uv] − ∫ u v′', '∫ uv = [u′v] − ∫ u′ v', '∫ u′v = [uv] + ∫ u v′', '∫ uv′ = [u′v′]'], 0, 'On l’emploie quand l’intégrande est un produit dont un facteur se simplifie en dérivant.'],
            ['Comment calcule-t-on l’aire entre deux courbes sur [a ; b] ?', ['Par l’intégrale de la différence, en identifiant d’abord la courbe du dessus', 'Par la somme des deux intégrales', 'Par le produit des deux intégrales', 'Par la différence des valeurs moyennes'], 0, 'Si les courbes se croisent, il faut découper l’intervalle.'],
            ['Échanger les bornes d’une intégrale change son signe.', ['Vrai', 'Faux'], 0, 'C’est une conséquence directe de la formule F(b) − F(a).'],
            ['Que faire quand aucune primitive ne s’exprime simplement ?', ['Approcher l’intégrale par la méthode des rectangles ou des trapèzes', 'Conclure que l’intégrale n’existe pas', 'Dériver la fonction', 'Changer les bornes'], 0, 'La précision croît avec le nombre de subdivisions.'],
          ],
        },
        // ---- Chapitre 3 : Probabilités ----------------------------------------
        {
          titre: 'Succession d’épreuves indépendantes, lois de Bernoulli et binomiale',
          axe: 'Probabilités',
          lecon: {
            titre: 'Répéter la même expérience n fois',
            cours: `Presque toute la probabilité de Terminale se ramène à un schéma unique : **répéter n fois, de façon indépendante, une expérience à deux issues**.

## L’épreuve de Bernoulli
Deux issues : le **succès**, de probabilité p, et l’**échec**, de probabilité 1 − p. La variable X vaut **1** en cas de succès, **0** sinon.

E(X) = **p**, V(X) = **p(1 − p)**

## La succession d’épreuves indépendantes
Elle se représente par un **arbre pondéré**, dont la lecture obéit à deux règles :

| Objet | Sa probabilité |
| Un **chemin** | Le **produit** des probabilités portées par ses branches |
| Un **événement** | La **somme** des probabilités des chemins qui le réalisent |

> L’**indépendance** est l’hypothèse cruciale : c’est elle qui autorise à **multiplier**. Un tirage **avec remise** la garantit ; un tirage **sans remise** ne la garantit **pas** — sauf si la population est très grande devant l’échantillon.

## La loi binomiale
X compte le **nombre de succès** sur n épreuves identiques et indépendantes. X suit B(n ; p) :

P(X = k) = C(n,k) × p^k × (1 − p)^(n−k)

| Le facteur | Ce qu’il compte |
| p^k | Les **k succès** |
| (1 − p)^(n−k) | Les **échecs** |
| **C(n,k)** | Le **nombre de chemins** réalisant exactement k succès |

> C’est ici que sert le **dénombrement** du premier chapitre.

## Espérance, variance, écart-type
E(X) = **n p**, V(X) = **n p (1 − p)**, σ(X) = √(n p (1 − p))

> L’espérance se retient sans calcul : sur 100 lancers d’une pièce équilibrée, on attend **50** piles.

## Les trois conditions à vérifier
Épreuves **identiques**, **indépendantes**, à **deux issues** seulement.

> Un énoncé de bac teste presque toujours l’une des trois — le plus souvent l’**indépendance**, par un tirage sans remise.

## Le calcul pratique
| La question | Le calcul |
| P(X = k) | Formule directe |
| P(X inférieur ou égal à k) | À la calculatrice, fonction de répartition |
| P(X supérieur ou égal à k) | **1 − P(X inférieur ou égal à k − 1)** — l’automatisme à acquérir |
| Un **seuil** | Le plus petit k tel que P(X inférieur ou égal à k) dépasse une valeur donnée |

> La loi binomiale ne compte que des **succès**, jamais leur **ordre**. Si la question porte sur l’ordre d’apparition, on revient à l’**arbre**.`,
          },
          questions: [
            ['Qu’est-ce qu’une épreuve de Bernoulli ?', ['Une expérience aléatoire à deux issues', 'Une expérience répétée n fois', 'Une variable aléatoire continue', 'Un tirage sans remise'], 0, 'Le succès de probabilité p, l’échec de probabilité 1 − p.'],
            ['Que compte une variable aléatoire suivant la loi binomiale B(n ; p) ?', ['Le nombre de succès sur n épreuves indépendantes', 'Le rang du premier succès', 'La durée d’attente', 'La probabilité d’un succès'], 0, 'Elle ne tient pas compte de l’ordre d’apparition des succès.'],
            ['Quelle est l’expression de P(X = k) pour X suivant B(n ; p) ?', ['C(n,k) p^k (1−p)^(n−k)', 'p^k (1−p)^(n−k)', 'C(n,k) p^n', 'n p^k'], 0, 'Le coefficient C(n,k) compte les chemins réalisant exactement k succès.'],
            ['Que vaut l’espérance d’une variable suivant B(n ; p) ?', ['n p', 'p', 'n p (1−p)', '√(n p)'], 0, 'Sur 100 lancers d’une pièce équilibrée, on attend 50 piles.'],
            ['Que vaut la variance d’une loi binomiale B(n ; p) ?', ['n p (1−p)', 'n p', 'p(1−p)', '√(n p (1−p))'], 0, 'L’écart-type en est la racine carrée.'],
            ['Un tirage sans remise dans une petite population donne des épreuves indépendantes.', ['Vrai', 'Faux'], 1, 'C’est le piège le plus fréquent des sujets de bac.'],
            ['Comment calcule-t-on P(X ≥ k) ?', ['1 − P(X ≤ k−1)', '1 − P(X ≤ k)', 'P(X ≤ k) − 1', 'P(X = k) + P(X = k+1)'], 0, 'Le passage par l’événement contraire est l’automatisme à acquérir.'],
            ['Sur un arbre pondéré, la probabilité d’un chemin est…', ['Le produit des probabilités de ses branches', 'La somme des probabilités de ses branches', 'La plus petite de ses probabilités', 'La moyenne de ses probabilités'], 0, 'La probabilité d’un événement est, elle, la somme des chemins qui le réalisent.'],
          ],
        },
        {
          titre: 'Sommes de variables aléatoires',
          axe: 'Probabilités',
          lecon: {
            titre: 'Ce qui s’additionne, et ce qui ne s’additionne pas',
            cours: `Additionner des variables aléatoires est l’opération centrale de la fin du programme : c’est elle qui mène à la **loi des grands nombres** et à la notion d’**échantillon**.

## Les rappels
| Indicateur | Sa formule | Ce qu’il dit |
| **Espérance** | E(X) = somme des p(i) x(i) | La valeur moyenne sur un grand nombre de répétitions |
| **Variance** | V(X) = E(X²) − E(X)² | La dispersion autour de l’espérance |
| **Écart-type** | σ(X) = √V(X) | La même chose, dans la **même unité** que X |

## Ce qui s’additionne, ce qui ne s’additionne pas
| | **Espérance** | **Variance** |
| Transformation affine | E(aX + b) = a E(X) + b | V(aX + b) = **a²** V(X) — le b **disparaît** |
| Somme de deux variables | E(X + Y) = E(X) + E(Y), **toujours** | V(X + Y) = V(X) + V(Y), **seulement si indépendantes** |

> L’espérance est **toujours** additive, même sans indépendance : le programme y insiste. La variance, **non** — et c’est l’erreur la plus sanctionnée du chapitre.

Ajouter une constante **décale** la distribution sans changer sa dispersion : d’où la disparition de b dans la variance.

## L’échantillon
Une liste de n variables **indépendantes** et de **même loi**, d’espérance μ et d’écart-type σ. On pose S la **somme** et M = S/n la **moyenne empirique**.

| Grandeur | Son espérance | Son écart-type |
| La **somme** S | n μ | **σ √n** |
| La **moyenne** M | **μ** | **σ/√n** |

## Ce que dit la formule en √n
| Conséquence | Ce qu’elle signifie |
| E(M) = μ | La moyenne empirique ne se trompe **pas systématiquement** : elle est **sans biais** |
| σ(M) = σ/√n | Sa dispersion **décroît**, mais **lentement** |

> Diviser l’écart-type par 2 exige de **quadrupler** la taille de l’échantillon. C’est ce qui rend les sondages coûteux.

## Le cas de la loi binomiale
Une variable de loi B(n ; p) est **exactement** la somme de n variables de Bernoulli indépendantes de paramètre p.

> On retrouve immédiatement E = n p et V = n p (1 − p) : la formule binomiale n’est qu’un **cas particulier** de ce chapitre.

> **Espérance : additive toujours. Variance : additive seulement sous indépendance.** Ces deux lignes suffisent à traiter la moitié des questions.`,
          },
          questions: [
            ['L’égalité E(X + Y) = E(X) + E(Y) exige-t-elle l’indépendance ?', ['Non, elle est toujours vraie', 'Oui, toujours', 'Oui, sauf pour la loi binomiale', 'Elle est fausse en général'], 0, 'L’espérance est additive sans condition : c’est ce qui la distingue de la variance.'],
            ['Que vaut V(aX + b) ?', ['a² V(X)', 'a V(X) + b', 'a V(X)', 'a² V(X) + b²'], 0, 'Le coefficient est au carré et la constante disparaît.'],
            ['Sous quelle condition a-t-on V(X + Y) = V(X) + V(Y) ?', ['Si X et Y sont indépendantes', 'Toujours', 'Si X et Y ont la même loi', 'Si X et Y sont positives'], 0, 'C’est l’erreur la plus sanctionnée du chapitre.'],
            ['Que vaut l’écart-type de la moyenne empirique d’un échantillon de taille n ?', ['σ/√n', 'σ/n', 'σ√n', 'σ'], 0, 'La dispersion décroît en 1/√n, donc lentement.'],
            ['Que vaut l’espérance de la moyenne empirique d’un échantillon ?', ['μ, l’espérance de la variable de départ', 'μ/n', 'n μ', '0'], 0, 'La moyenne empirique est sans biais : elle ne se trompe pas systématiquement.'],
            ['Pour diviser par deux l’écart-type de la moyenne empirique, il faut…', ['Quadrupler la taille de l’échantillon', 'Doubler la taille de l’échantillon', 'Diviser la taille par deux', 'Changer de variable'], 0, 'C’est la conséquence directe du √n, et ce qui rend les sondages coûteux.'],
            ['Une variable de loi binomiale B(n ; p) est une somme de n variables de Bernoulli indépendantes.', ['Vrai', 'Faux'], 0, 'On en déduit immédiatement E = n p et V = n p (1 − p).'],
            ['Dans quelle unité s’exprime l’écart-type ?', ['La même que la variable', 'Le carré de celle de la variable', 'Sans unité', 'En pourcentage'], 0, 'C’est ce qui le rend plus lisible que la variance.'],
          ],
        },
        {
          titre: 'Loi des grands nombres et concentration',
          axe: 'Probabilités',
          lecon: {
            titre: 'Pourquoi la moyenne finit par dire la vérité',
            cours: `Ce dernier chapitre **démontre** ce que l’intuition affirme depuis la Seconde : quand on répète beaucoup, la **fréquence observée** s’approche de la **probabilité théorique**.

## Les deux inégalités
| Inégalité | Son énoncé | Ce qu’elle utilise |
| **Markov** | P(X supérieur ou égal à a) inférieur ou égal à E(X)/a, pour X **positive** | L’**espérance** seule |
| **Bienaymé-Tchebychev** | P(l’écart à μ dépasse δ) inférieur ou égal à V/δ² | L’espérance **et** la variance |

> Markov : une variable positive ne peut pas dépasser **souvent** une valeur bien supérieure à sa moyenne. Très générale — donc très peu précise.

> Bienaymé-Tchebychev vaut pour **n’importe quelle loi** : c’est sa force. Sa faiblesse est d’être **grossière** — la majoration dépasse souvent de loin la probabilité réelle. Elle sert à **garantir**, pas à estimer finement.

## L’inégalité de concentration
Appliquée à la **moyenne empirique** M d’un échantillon de taille n, dont on sait que V(M) = σ²/n :

P(l’écart entre M et μ dépasse δ) inférieur ou égal à σ² / (n δ²)

> Le majorant contient **n au dénominateur** : il tend vers **0** quand n grandit, pour tout δ fixé.

## La loi des grands nombres
C’en est la conséquence directe : pour tout δ > 0, la probabilité que M s’écarte de μ d’au moins δ **tend vers 0**.

> La **moyenne empirique se concentre** autour de l’espérance quand la taille de l’échantillon augmente. Dans le cas d’une loi de Bernoulli, μ = p et M est la **fréquence observée** : la fréquence **tend vers la probabilité**. C’est la justification théorique de tout ce qui était admis depuis le collège.

## Ce que la loi ne dit pas
Elle ne dit **rien sur une répétition particulière**.

> Après dix « pile » consécutifs, la probabilité du prochain lancer reste **1/2** : la pièce n’a pas de mémoire. La convergence porte sur la **moyenne**, pas sur une compensation des écarts passés — croire l’inverse est l’**erreur du joueur**.

## L’usage pratique : dimensionner un sondage
L’inégalité de concentration donne un **n suffisant** pour garantir une précision donnée avec un risque donné.

> Pour une proportion, σ² = p(1 − p) est **majorée par 1/4** : on obtient un majorant utilisable **même sans connaître p**. C’est ce qui rend le dimensionnement possible **avant** d’avoir mené l’enquête.

> La loi des grands nombres est le **pont** entre le calcul des probabilités et la statistique : elle autorise à estimer un paramètre inconnu à partir d’un échantillon, **et à dire de combien on peut se tromper**.`,
          },
          questions: [
            ['Que dit l’inégalité de Markov ?', ['P(X ≥ a) ≤ E(X)/a pour X positive et a > 0', 'P(X ≥ a) ≤ V(X)/a²', 'P(X = a) ≤ E(X)', 'E(X) ≤ a P(X ≥ a)'], 0, 'Elle n’utilise que l’espérance, ce qui la rend générale mais peu précise.'],
            ['Que majore l’inégalité de Bienaymé-Tchebychev ?', ['La probabilité de s’écarter de la moyenne d’au moins δ', 'L’espérance d’une variable positive', 'La variance d’une somme', 'La taille d’un échantillon'], 0, 'Le majorant est V/δ² : plus la variance est faible, plus la variable est concentrée.'],
            ['L’inégalité de Bienaymé-Tchebychev suppose-t-elle une loi particulière ?', ['Non, elle vaut pour toute loi', 'Oui, la loi binomiale', 'Oui, une loi symétrique', 'Oui, une loi continue'], 0, 'C’est sa force ; sa faiblesse est d’être grossière.'],
            ['Que devient le majorant de P(|M − μ| ≥ δ) quand n augmente ?', ['Il tend vers 0', 'Il tend vers 1', 'Il reste constant', 'Il augmente'], 0, 'Le majorant vaut σ²/(n δ²) : c’est la loi des grands nombres.'],
            ['Que dit la loi des grands nombres ?', ['La moyenne empirique se concentre autour de l’espérance quand n grandit', 'Les écarts passés finissent par se compenser', 'Toute suite de tirages est équilibrée', 'La variance tend vers l’espérance'], 0, 'Elle porte sur la moyenne, jamais sur une répétition particulière.'],
            ['Après dix « pile » consécutifs, la probabilité de « face » au lancer suivant augmente.', ['Vrai', 'Faux'], 1, 'C’est l’erreur du joueur : la pièce n’a pas de mémoire.'],
            ['Pourquoi peut-on dimensionner un sondage sans connaître la proportion p ?', ['Parce que p(1 − p) est majoré par 1/4', 'Parce que la variance est nulle', 'Parce que n est fixé par la loi', 'Parce que p vaut toujours 0,5'], 0, 'Ce majorant rend le calcul de la taille d’échantillon possible à l’avance.'],
            ['Dans le cas d’une loi de Bernoulli, que représente la moyenne empirique ?', ['La fréquence observée de succès', 'Le nombre total de succès', 'L’écart-type', 'La probabilité théorique'], 0, 'La loi des grands nombres dit alors que la fréquence tend vers la probabilité.'],
          ],
        },
      ],
    },
  ],
}
