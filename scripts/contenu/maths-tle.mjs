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
            cours: `Dénombrer, c’est compter le nombre d’issues d’une situation sans les écrire toutes. Deux questions décident de la formule à employer : **l’ordre compte-t-il ?** et **peut-on répéter ?**

## La factorielle
n! = n × (n−1) × … × 2 × 1, avec la convention **0! = 1**. Elle compte le nombre de façons d’ordonner n objets distincts.

## Les k-uplets
Un **k-uplet** d’un ensemble à n éléments est une liste ordonnée de k éléments, **avec répétition possible**. Il y en a :

n^k

C’est le cas d’un tirage **avec remise** : un code à 4 chiffres offre 10⁴ = 10 000 possibilités.

## Les k-uplets d’éléments distincts (arrangements)
Liste ordonnée de k éléments **sans répétition**, prise dans un ensemble à n éléments :

n × (n−1) × … × (n−k+1) = n! / (n−k)!

C’est le tirage **sans remise** où l’ordre compte : un podium de 3 places parmi 8 coureurs, soit 8 × 7 × 6 = 336.

## Les permutations
Cas particulier k = n : ordonner **tous** les éléments. Il y en a **n!**.

## Les combinaisons
Une **combinaison** est une **partie** à k éléments d’un ensemble à n éléments : ni ordre, ni répétition.

C(n,k) = n! / (k! × (n−k)!)

On la note aussi « k parmi n ». Le k! au dénominateur efface justement l’ordre : on part des arrangements, et on divise par le nombre de façons d’ordonner les k éléments choisis.

Exemple : une main de 5 cartes dans un jeu de 32 vaut C(32,5) = 201 376.

## Les propriétés
- **symétrie** : C(n,k) = C(n, n−k) — choisir k éléments, c’est en écarter n−k ;
- **relation de Pascal** : C(n,k) = C(n−1, k−1) + C(n−1, k). Elle se lit sur un exemple : soit un élément donné est dans la partie, soit il n’y est pas. C’est elle qui construit le **triangle de Pascal** ;
- **cas particuliers** : C(n,0) = C(n,n) = 1, C(n,1) = n ;
- **somme** : la somme de tous les C(n,k) pour k de 0 à n vaut 2ⁿ — c’est le nombre total de parties d’un ensemble à n éléments.

## Le mode d’emploi
1. l’ordre compte-t-il ? Non → **combinaison**. Oui → suite ;
2. peut-on répéter ? Oui → **n^k**. Non → **arrangement**, ou **permutation** si k = n.

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
            cours: `La géométrie de l’espace reprend tous les outils du plan, avec une coordonnée de plus — et une question nouvelle : deux droites peuvent ne se couper **ni** être parallèles.

## Les vecteurs de l’espace
Un vecteur se décompose sur une **base** (i, j, k) de trois vecteurs non coplanaires :

u = x i + y j + z k, noté u(x ; y ; z)

Somme, produit par un réel et colinéarité s’écrivent coordonnée par coordonnée, exactement comme dans le plan. Deux vecteurs sont **colinéaires** s’il existe un réel k tel que v = k u.

## Vecteurs coplanaires
Trois vecteurs u, v, w sont **coplanaires** s’il existe deux réels a et b tels que w = a u + b v — autrement dit si w se décompose sur u et v. Cette notion n’a pas d’équivalent dans le plan : c’est la nouveauté du chapitre.

Trois vecteurs **non coplanaires** forment une base de l’espace.

## Repère et coordonnées
Un repère (O ; i, j, k) permet d’attribuer à tout point M ses trois coordonnées. Les formules du plan s’étendent :
- coordonnées de AB : (xB − xA ; yB − yA ; zB − zA) ;
- milieu de [AB] : moyenne des coordonnées ;
- distance AB = √((xB−xA)² + (yB−yA)² + (zB−zA)²), dans un repère **orthonormé** seulement.

## Caractériser une droite
Une droite est définie par un point A et un **vecteur directeur** u non nul. Un point M lui appartient si et seulement si AM est **colinéaire** à u.

## Caractériser un plan
Un plan est défini par :
- un point A et **deux vecteurs directeurs** u et v non colinéaires ; ou
- **trois points non alignés** ; ou
- une droite et un point hors de cette droite.

Un point M appartient au plan si et seulement si AM, u et v sont **coplanaires**.

## Les théorèmes à connaître
- si une droite est parallèle à une droite d’un plan, elle est parallèle à ce plan ;
- deux plans parallèles coupés par un troisième déterminent deux droites parallèles ;
- **théorème du toit** : si deux plans sécants contiennent chacun l’une de deux droites parallèles, leur intersection est parallèle à ces deux droites.

## Ce qui change vraiment
Dans le plan, deux droites sont sécantes ou parallèles. Dans l’espace, elles peuvent être **non coplanaires** : elles ne se coupent pas et ne sont pas parallèles. Vérifier la coplanarité est donc le premier réflexe avant de chercher une intersection.

> Toute la géométrie du chapitre se ramène à des calculs sur des coordonnées : dès qu’une configuration résiste, poser un repère et calculer.`,
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

## Deux droites
Trois cas, et non deux comme dans le plan :
- **coplanaires et sécantes** : un point commun ;
- **coplanaires et parallèles** : aucun point commun (strictement parallèles) ou confondues ;
- **non coplanaires** : aucun point commun, et pourtant pas parallèles.

Méthode : les vecteurs directeurs sont-ils colinéaires ? Si oui, les droites sont parallèles (confondues si un point de l’une appartient à l’autre). Si non, on résout le système : une solution → sécantes, aucune → non coplanaires.

## Droite et plan
- la droite est **incluse** dans le plan : une infinité de points communs ;
- la droite est **strictement parallèle** au plan : aucun point commun ;
- la droite est **sécante** au plan : un unique point.

Critère : si le vecteur directeur u de la droite est **orthogonal** au vecteur normal n du plan, la droite est parallèle au plan (incluse si un de ses points y appartient). Sinon, elle est sécante.

## Deux plans
- **confondus** ;
- **strictement parallèles** : aucun point commun ;
- **sécants** : leur intersection est une **droite**, jamais un point.

Critère : les vecteurs normaux sont-ils colinéaires ? Si oui, les plans sont parallèles ; sinon ils sont sécants.

## Trois plans
Les cas se combinent : un point unique (les trois vecteurs normaux non coplanaires), une droite, un plan, ou aucun point commun — configuration en « prisme », où les plans se coupent deux à deux selon trois droites parallèles distinctes.

## Le lien avec les systèmes
Chercher une intersection revient à **résoudre un système d’équations**. Le nombre de solutions traduit directement la position relative : une solution unique (sécants), une infinité (inclusion ou intersection selon une droite), aucune (parallélisme strict ou non-coplanarité).

## La méthode générale
1. écrire une **représentation paramétrique** de chaque droite et une **équation cartésienne** de chaque plan ;
2. substituer l’une dans l’autre ;
3. lire le nombre de solutions.

Substituer la paramétrique d’une droite dans l’équation d’un plan donne une équation en un seul paramètre : une solution → intersection en un point ; aucune → parallèle stricte ; identité vraie pour tout paramètre → droite incluse.

> Une erreur récurrente : conclure « parallèles » dès que le système n’a pas de solution. Dans l’espace, l’absence de solution peut aussi signaler des droites **non coplanaires**.`,
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
            cours: `Le produit scalaire est le seul outil qui relie **longueurs** et **angles** à des coordonnées. Il fournit le critère d’orthogonalité et toutes les distances du chapitre.

## Les trois expressions
Pour deux vecteurs u et v de l’espace :
- **coordonnées** (repère orthonormé) : u · v = xx′ + yy′ + zz′ ;
- **norme et angle** : u · v = ‖u‖ × ‖v‖ × cos(θ) ;
- **projection** : u · v = ‖u‖ × ‖v′‖ où v′ est le projeté orthogonal de v sur la direction de u, au signe près.

## Les propriétés
Symétrie (u · v = v · u), bilinéarité, et u · u = ‖u‖². Les identités remarquables s’appliquent aux vecteurs : ‖u + v‖² = ‖u‖² + 2 u · v + ‖v‖².

## Le critère d’orthogonalité
Deux vecteurs **non nuls** sont orthogonaux **si et seulement si** leur produit scalaire est nul. C’est le résultat le plus utilisé du chapitre : toute question d’orthogonalité devient un calcul de somme de produits.

## Le vecteur normal à un plan
Un vecteur **normal** n à un plan est orthogonal à **tous** les vecteurs du plan — il suffit qu’il soit orthogonal à **deux** vecteurs directeurs non colinéaires.

Conséquence majeure : le plan passant par A et de vecteur normal n(a ; b ; c) admet une **équation cartésienne** de la forme

ax + by + cz + d = 0

où les coefficients a, b, c **sont exactement** les coordonnées d’un vecteur normal. Lire un vecteur normal sur une équation de plan est immédiat.

## Le projeté orthogonal
Le **projeté orthogonal** d’un point M sur un plan (ou une droite) est le point du plan le plus proche de M. La distance de M au plan est donc la distance à son projeté.

Pour le calculer : écrire la droite passant par M de vecteur directeur n, et chercher son intersection avec le plan.

## Les distances
- **distance d’un point à un plan** : |a·xM + b·yM + c·zM + d| / √(a² + b² + c²) ;
- **distance d’un point à une droite** : passer par le projeté orthogonal.

## Les usages classiques
Sphère (ensemble des points à distance R d’un centre), position relative d’une sphère et d’un plan (comparer la distance du centre au plan et le rayon), calcul d’un angle, démonstration d’une orthogonalité, recherche d’un minimum de distance.

> Deux réflexes suffisent à traiter presque tout le chapitre : « orthogonal » se traduit par « produit scalaire nul », et « distance minimale » par « projeté orthogonal ».`,
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
            cours: `Une droite et un plan s’écrivent avec deux outils différents, et savoir passer de l’un à l’autre est ce que les exercices demandent le plus souvent.

## La représentation paramétrique d’une droite
La droite passant par A(xA ; yA ; zA) et de vecteur directeur u(a ; b ; c) est l’ensemble des points M tels que :

x = xA + a t
y = yA + b t
z = zA + c t, avec t décrivant ℝ

Le réel **t** est le **paramètre** : chaque valeur de t donne un point de la droite, et un seul. Lire une représentation paramétrique, c’est lire un point (les termes constants) et un vecteur directeur (les coefficients de t).

⚠️ Une représentation paramétrique **n’est pas unique** : changer de point de base ou multiplier le vecteur directeur par un réel non nul donne une autre écriture de la **même** droite. Pour vérifier que deux paramétriques décrivent la même droite, on teste la colinéarité des directeurs, puis l’appartenance d’un point de l’une à l’autre.

## La représentation paramétrique d’un plan
Elle existe aussi, avec **deux** paramètres t et s et deux vecteurs directeurs — mais le programme lui préfère l’équation cartésienne.

## L’équation cartésienne d’un plan
ax + by + cz + d = 0, où (a ; b ; c) est un **vecteur normal**. Pour l’obtenir :
1. trouver un vecteur normal (souvent par produit scalaire nul avec deux vecteurs directeurs, ce qui donne un système) ;
2. écrire ax + by + cz + d = 0 ;
3. déterminer d en injectant les coordonnées d’un point connu du plan.

Elle non plus n’est pas unique : multiplier toute l’équation par un réel non nul donne le même plan.

## Intersection d’une droite et d’un plan
C’est le calcul le plus fréquent de l’épreuve : on **substitue** x, y et z de la paramétrique dans l’équation cartésienne. On obtient une équation du premier degré en t :
- une solution → un point d’intersection, obtenu en reportant t ;
- aucune solution (du type 0 = 5) → droite strictement parallèle au plan ;
- une identité (du type 0 = 0) → droite incluse dans le plan.

## Intersection de deux plans
On résout le système des deux équations cartésiennes. En exprimant deux inconnues en fonction de la troisième, prise comme paramètre, on obtient directement une **représentation paramétrique** de la droite d’intersection.

## Quel outil pour quelle question
- une droite se décrit naturellement en **paramétrique** ;
- un plan se décrit naturellement en **cartésien** ;
- un test d’appartenance d’un point à un plan est immédiat en cartésien (on remplace et on regarde si l’égalité est vraie), alors qu’il demande de résoudre un système en paramétrique.

> Le passage paramétrique → cartésien pour une droite se fait en éliminant t entre les trois équations : on obtient deux équations, car une droite de l’espace est l’intersection de deux plans.`,
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
1. **initialisation** : P(n₀) est vraie ;
2. **hérédité** : pour tout n ≥ n₀, P(n) vraie entraîne P(n+1) vraie ;

alors P(n) est vraie **pour tout n ≥ n₀**.

L’image est celle de l’échelle : savoir monter sur le premier barreau, et savoir passer d’un barreau au suivant, c’est pouvoir monter aussi haut qu’on veut.

## La rédaction attendue
Elle est **codifiée**, et sa rigueur fait une part de la note :
1. **définir** clairement P(n) — la propriété, pas la conclusion ;
2. **initialisation** : vérifier P(n₀) par le calcul, en écrivant les deux membres ;
3. **hérédité** : « soit n ≥ n₀ un entier tel que P(n) est vraie » — on **suppose** P(n), on **démontre** P(n+1). Partir de l’expression de rang n+1 et y faire apparaître celle de rang n ;
4. **conclusion** : « par récurrence, P(n) est vraie pour tout n ≥ n₀ ».

## Les deux erreurs classiques
- **oublier l’initialisation** : l’hérédité seule ne prouve rien. La propriété « 2ⁿ > n² » est héréditaire à partir d’un certain rang, mais fausse pour n = 3 ;
- **utiliser P(n+1) dans sa propre démonstration**, ce qui revient à supposer ce qu’on veut prouver. L’hypothèse de récurrence est **P(n)**, jamais P(n+1).

## L’hypothèse de récurrence
Elle doit être **utilisée** : une démonstration d’hérédité qui n’y fait jamais appel signale presque toujours une erreur — ou une propriété qui se démontre directement, sans récurrence.

## Les usages au programme
- **formules explicites** de suites définies par récurrence ;
- **inégalités**, notamment l’**inégalité de Bernoulli** : pour a > −1 et tout n ≥ 0, (1 + a)ⁿ ≥ 1 + n a ;
- **monotonie** d’une suite définie par u(n+1) = f(u(n)) ;
- **encadrement** : montrer qu’une suite reste dans un intervalle stable ;
- **divisibilité** : montrer qu’une expression est divisible par un entier.

## Le lien avec la suite du chapitre
La récurrence sert immédiatement après : démontrer qu’une suite est croissante et majorée est l’étape qui, par le **théorème de la limite monotone**, garantit sa convergence.

> Une propriété héréditaire sans initialisation vraie est une échelle sans premier barreau : on sait passer d’un barreau au suivant, mais on n’y monte jamais.`,
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
            cours: `Étudier la limite d’une suite, c’est décrire son comportement quand n devient très grand. Trois issues sont possibles : converger, diverger vers l’infini, ou n’avoir aucune limite.

## Les définitions
- la suite **converge** vers ℓ si tout intervalle ouvert contenant ℓ contient tous les termes à partir d’un certain rang ;
- elle **diverge vers +∞** si tout intervalle de la forme [A ; +∞[ contient tous les termes à partir d’un certain rang ;
- elle peut **n’avoir aucune limite** : (−1)ⁿ oscille entre −1 et 1 sans jamais se fixer. Diverger ne signifie donc pas « tendre vers l’infini ».

## Les limites de référence
Pour tout entier k ≥ 1 : n^k → +∞, √n → +∞, et 1/n^k → 0.

## Les opérations
Somme, produit et quotient des limites se calculent terme à terme — sauf pour les **quatre formes indéterminées** : ∞ − ∞, 0 × ∞, ∞/∞ et 0/0. Une forme indéterminée n’est pas une absence de limite : c’est un signal qu’il faut **transformer l’écriture** (factoriser par le terme dominant, utiliser l’expression conjuguée, simplifier).

## Les suites géométriques
Pour une suite de terme général qⁿ :
- si q > 1 : qⁿ → +∞ ;
- si q = 1 : la suite est constante ;
- si −1 < q < 1 : qⁿ → 0 ;
- si q ≤ −1 : pas de limite.

C’est le résultat le plus utilisé du chapitre, et il se démontre pour q > 1 par l’inégalité de Bernoulli.

## Les théorèmes de comparaison
- **par minoration** : si u(n) ≥ v(n) à partir d’un rang et v(n) → +∞, alors u(n) → +∞ ;
- **par majoration** : si u(n) ≤ v(n) et v(n) → −∞, alors u(n) → −∞ ;
- **théorème des gendarmes** : si v(n) ≤ u(n) ≤ w(n) à partir d’un rang, et si v et w convergent vers la **même** limite ℓ, alors u converge vers ℓ.

Le théorème des gendarmes est l’outil de choix dès qu’apparaît un terme borné mais sans limite, comme cos(n) ou (−1)ⁿ.

## Le théorème de la limite monotone
- une suite **croissante et majorée** converge ;
- une suite **décroissante et minorée** converge ;
- une suite croissante **non majorée** diverge vers +∞.

⚠️ Ce théorème garantit l’**existence** de la limite, pas sa valeur. Une suite croissante majorée par 10 converge — mais pas nécessairement vers 10.

## Suites définies par récurrence
Pour u(n+1) = f(u(n)) avec f continue : si la suite converge vers ℓ, alors ℓ vérifie **f(ℓ) = ℓ**. On cherche donc les points fixes de f, après avoir démontré la convergence — jamais avant.

> L’ordre du raisonnement est imposé : d’abord prouver que la limite existe (monotonie et bornes, par récurrence), ensuite seulement la calculer.`,
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
            cours: `La limite d’une fonction décrit ce qui se passe **au bord** : quand x tend vers l’infini, ou quand x s’approche d’une valeur interdite.

## Les deux familles
- **limite en l’infini** : f(x) tend vers ℓ, vers ±∞, ou n’a pas de limite quand x → ±∞ ;
- **limite en un réel a** : f(x) tend vers ℓ ou vers ±∞ quand x s’approche de a. On distingue alors la limite **à gauche** (x < a) et **à droite** (x > a), qui peuvent différer : 1/x tend vers −∞ à gauche de 0 et vers +∞ à droite.

## Les limites de référence
En +∞ : x^n → +∞, √x → +∞, 1/x^n → 0.
En 0 (à droite) : 1/x → +∞, 1/√x → +∞.

## Les opérations et les indéterminations
Mêmes règles que pour les suites, mêmes quatre formes indéterminées : ∞ − ∞, 0 × ∞, ∞/∞, 0/0.

Les techniques de levée :
- **factoriser par le terme de plus haut degré** : c’est la méthode systématique pour les polynômes et les quotients de polynômes en l’infini. En +∞, un polynôme a la même limite que son **terme de plus haut degré**, et une fraction rationnelle la même limite que le **quotient des termes de plus haut degré** ;
- **multiplier par l’expression conjuguée** quand une racine carrée produit ∞ − ∞ ;
- **reconnaître un taux d’accroissement**, notamment pour les formes 0/0 en un point.

## Les théorèmes de comparaison
Ils s’écrivent comme pour les suites : minoration, majoration, et **théorème des gendarmes**. Ce dernier traite tous les cas où apparaît un facteur borné, comme sin(x)/x en +∞.

## Les asymptotes
- **asymptote horizontale** d’équation y = ℓ si f(x) → ℓ quand x → ±∞ ;
- **asymptote verticale** d’équation x = a si f(x) → ±∞ quand x → a ;
- **asymptote oblique** d’équation y = ax + b si f(x) − (ax + b) → 0 en l’infini.

Une courbe **peut couper** son asymptote horizontale : l’asymptote décrit un comportement à l’infini, pas une barrière.

## La composition
Si u(x) → b quand x → a, et f(y) → ℓ quand y → b, alors f(u(x)) → ℓ quand x → a. C’est ce qui permet de traiter les limites de fonctions composées en posant un changement de variable.

## Le lien avec la continuité
Une fonction est **continue en a** si sa limite en a existe et **vaut f(a)**. Une limite peut donc exister sans que la fonction soit continue — si elle n’est pas définie en a, ou si sa valeur diffère de la limite.

> Réflexe systématique en l’infini : factoriser par le terme dominant. Il lève à lui seul la majorité des indéterminations de l’épreuve.`,
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
            cours: `Dériver une fonction composée est le geste technique le plus fréquent de l’année : il intervient dans toutes les fonctions écrites avec une exponentielle, un logarithme, une racine ou une puissance d’expression.

## La composée
La composée de u par f, notée f ∘ u, associe à x le nombre f(u(x)). On applique **d’abord** u, **ensuite** f. L’ordre n’est pas symétrique : f ∘ u et u ∘ f sont en général différentes.

## Le théorème
Si u est dérivable en x et f dérivable en u(x), alors f ∘ u est dérivable en x et :

(f ∘ u)′(x) = u′(x) × f′(u(x))

Autrement dit : la dérivée de la fonction **extérieure**, prise en la fonction intérieure, multipliée par la dérivée de la fonction **intérieure**. Le facteur u′(x) est celui qu’on oublie.

## Les cas usuels
- (uⁿ)′ = n u′ uⁿ⁻¹ ;
- (√u)′ = u′ / (2√u), pour u > 0 ;
- (e^u)′ = u′ e^u ;
- (ln u)′ = u′ / u, pour u > 0 ;
- (1/u)′ = −u′ / u² ;
- (cos u)′ = −u′ sin u et (sin u)′ = u′ cos u.

Tous se déduisent du théorème : ce sont des cas particuliers, pas des formules indépendantes à mémoriser séparément.

## Un exemple détaillé
Pour f(x) = e^(3x² + 1) : la fonction intérieure est u(x) = 3x² + 1, de dérivée u′(x) = 6x. Donc f′(x) = 6x × e^(3x² + 1).

Pour g(x) = (2x − 5)⁴ : u(x) = 2x − 5, u′(x) = 2, et g′(x) = 2 × 4 × (2x − 5)³ = 8(2x − 5)³.

## Les erreurs à éviter
- **oublier u′** : écrire (e^(3x))′ = e^(3x) au lieu de 3 e^(3x) ;
- **dériver l’intérieur et l’extérieur séparément puis multiplier les dérivées** sans composer : la dérivée extérieure doit être évaluée **en u(x)**, pas en x ;
- **confondre** f ∘ u et le produit f × u.

## Le domaine de dérivabilité
Il faut que u soit dérivable **et** que f le soit en u(x). Pour √u, cela impose u > 0 strictement : la racine n’est pas dérivable en 0, même si elle y est définie. Pour ln u, il faut u > 0.

## À quoi cela sert immédiatement
Toute étude de fonction du programme passe par là : signe de la dérivée, variations, tangentes, extremums, et — lu à l’envers — recherche de **primitives**, où reconnaître la forme u′ f′(u) est la seule méthode.

> Lire la formule à l’envers est le vrai enjeu : voir u′ e^u dans une expression, c’est savoir qu’une primitive est e^u. Le chapitre des primitives n’est que ce chapitre-ci retourné.`,
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
Une fonction f dérivable sur un intervalle I est :
- **convexe** sur I si sa courbe est **au-dessus de chacune de ses tangentes** ;
- **concave** si sa courbe est **au-dessous de chacune de ses tangentes**.

Autre lecture, équivalente : une fonction est convexe si sa courbe est **au-dessous de chacune de ses cordes** (le segment joignant deux points de la courbe).

Moyen mnémotechnique : une fonction convexe « tient l’eau » — sa courbe a la forme d’un récipient.

## Les caractérisations
Pour f deux fois dérivable sur I, les trois propositions sont **équivalentes** :
- f est convexe sur I ;
- f′ est **croissante** sur I ;
- f″ est **positive** sur I.

Et symétriquement pour la concavité, avec f′ décroissante et f″ négative.

## Le point d’inflexion
Un **point d’inflexion** est un point où la courbe **change de convexité**. En ce point, f″ **s’annule en changeant de signe** — et la tangente **traverse** la courbe, ce qui est le signe visuel le plus net.

⚠️ L’annulation de f″ ne suffit pas : pour f(x) = x⁴, f″(0) = 0 mais la fonction reste convexe partout. C’est le **changement de signe** qui compte, exactement comme pour l’extremum et f′.

## Les fonctions de référence
- **convexes sur ℝ** : x², e^x, et x^n pour n pair ;
- **concave sur ]0 ; +∞[** : ln ;
- **convexe sur [0 ; +∞[ et concave sur ]−∞ ; 0]** : x³ — d’où un point d’inflexion en 0 ;
- **affine** : à la fois convexe et concave, sa courbe étant confondue avec ses tangentes.

## Les usages
- **encadrer** une fonction par ses tangentes : la convexité de e^x donne e^x ≥ x + 1 pour tout réel x, une inégalité qui resservira ;
- **interpréter** une courbe : en économie, la convexité du coût traduit des rendements décroissants ; en physique, un point d’inflexion marque le moment où une croissance cesse d’accélérer ;
- **lire un graphique** : distinguer « la fonction augmente » (f′ > 0) de « la fonction augmente de plus en plus vite » (f′ > 0 et f″ > 0).

> Variation et convexité sont deux informations **indépendantes** : une fonction peut être décroissante et convexe, croissante et concave, et toutes les combinaisons. Les confondre est l’erreur la plus fréquente à l’oral.`,
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
f est **continue en a** si f est définie en a et si sa limite en a existe et vaut **f(a)**. Elle est continue sur un intervalle si elle l’est en chacun de ses points.

Intuitivement : on trace la courbe sans lever le crayon. C’est une image fidèle sur les fonctions du programme.

## Ce qui est continu
Toutes les fonctions **usuelles** sont continues sur leur ensemble de définition : polynômes, fonctions rationnelles, racine carrée, exponentielle, logarithme, sinus, cosinus, valeur absolue. Sommes, produits, quotients (là où le dénominateur ne s’annule pas) et composées de fonctions continues sont continues.

La **fonction partie entière** est le contre-exemple de référence : elle est discontinue en chaque entier.

## Dérivabilité et continuité
Une fonction **dérivable** en a est **continue** en a. La réciproque est **fausse** : la valeur absolue est continue en 0 sans y être dérivable — sa courbe y présente un point anguleux. Retenir le sens de l’implication est indispensable.

## Le théorème des valeurs intermédiaires
Si f est **continue** sur [a ; b], alors pour tout réel k compris entre f(a) et f(b), l’équation f(x) = k admet **au moins une** solution dans [a ; b].

La continuité est essentielle : la partie entière saute par-dessus des valeurs sans les prendre.

## Le corollaire (théorème de la bijection)
Si f est continue **et strictement monotone** sur [a ; b], alors pour tout k entre f(a) et f(b), l’équation f(x) = k admet une **unique** solution dans [a ; b].

La rédaction attendue est codifiée : citer la continuité, citer la stricte monotonie, encadrer k entre les valeurs aux bornes, puis conclure à l’existence et à l’unicité. Chacun des trois éléments vaut des points.

Le théorème s’étend aux intervalles ouverts ou infinis en remplaçant f(a) et f(b) par les **limites** aux bornes.

## La recherche approchée
Le théorème prouve qu’une solution existe **sans la donner**. Pour l’approcher, on emploie la **dichotomie** : on coupe l’intervalle en deux, on garde la moitié où le changement de signe se produit, et l’on recommence. Chaque étape divise l’amplitude par deux — dix étapes suffisent à gagner trois décimales.

> Le théorème des valeurs intermédiaires donne l’**existence**, la stricte monotonie ajoute l’**unicité**, la dichotomie fournit la **valeur approchée**. Trois outils, trois rôles distincts.`,
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
            cours: `Le logarithme népérien est la fonction **réciproque** de l’exponentielle. Toutes ses propriétés en découlent, y compris la seule qui ait fait son succès historique : transformer un produit en somme.

## La définition
Pour tout réel x > 0, **ln(x)** est l’unique réel y tel que **e^y = x**. Autrement dit :

e^(ln x) = x pour x > 0, et ln(e^x) = x pour tout réel x

Le logarithme n’est défini que sur **]0 ; +∞[** : c’est la condition d’existence à vérifier avant tout calcul, et l’oubli le plus sanctionné du chapitre.

## Les valeurs de référence
ln(1) = 0, ln(e) = 1, et ln(x) est **négatif** pour 0 < x < 1, **positif** pour x > 1.

## Les propriétés algébriques
Pour a > 0 et b > 0 :
- **ln(ab) = ln a + ln b** — la relation fondamentale ;
- ln(a/b) = ln a − ln b ;
- ln(1/b) = − ln b ;
- ln(a^n) = n ln a pour tout entier relatif n ;
- ln(√a) = (1/2) ln a.

⚠️ **ln(a + b) n’est pas ln a + ln b.** C’est l’erreur la plus fréquente, et elle est immédiatement repérable.

## La courbe
Elle est **strictement croissante** sur ]0 ; +∞[, passe par (1 ; 0) et (e ; 1), et présente une **asymptote verticale** en 0. Elle est **symétrique** de celle de l’exponentielle par rapport à la droite d’équation y = x — puisque les deux fonctions sont réciproques l’une de l’autre.

## Résoudre avec le logarithme
La stricte croissance donne les équivalences, pour a > 0 et b > 0 :
- ln a = ln b ⟺ a = b ;
- ln a < ln b ⟺ a < b.

C’est ce qui permet de résoudre les équations et inéquations où l’inconnue est en **exposant** : 2^n > 1000 devient n ln 2 > ln 1000, donc n > ln(1000)/ln(2).

## Les usages
- **temps de doublement** d’un capital ou d’une population : ln(2)/ln(1 + t) ;
- **demi-vie** d’un noyau radioactif : ln(2)/λ ;
- **échelles logarithmiques** : décibels, magnitude d’un séisme, pH ;
- toute résolution où l’inconnue est un exposant.

## Le lien avec les suites
Une suite géométrique de raison q > 0 se ramène à une suite arithmétique par le logarithme : ln(u(n)) = ln(u₀) + n ln(q). C’est ce qui rend les seuils calculables sans tâtonnement.

> Le logarithme est la seule fonction du programme qui change la **nature** d’une opération : produits en sommes, puissances en produits. C’est ce qui la rend indispensable dès qu’une inconnue est en exposant.`,
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
            cours: `La fiche précédente donnait les propriétés algébriques du logarithme. Celle-ci l’étudie comme une fonction : dérivée, limites, croissances comparées.

## Continuité et dérivabilité
ln est **continue et dérivable** sur ]0 ; +∞[, et :

ln′(x) = 1/x

Cette dérivée est **strictement positive** sur tout l’intervalle : ln est donc **strictement croissante** sur ]0 ; +∞[. C’est la démonstration complète de sa monotonie, en une ligne.

La dérivée seconde vaut −1/x², strictement négative : ln est **concave** sur ]0 ; +∞[.

## Les limites aux bornes
- en 0 par valeurs positives : ln(x) → **−∞** (asymptote verticale d’équation x = 0) ;
- en +∞ : ln(x) → **+∞**, mais **lentement**.

Le mot « lentement » a un sens précis, donné par les croissances comparées.

## Les croissances comparées
Ce sont les limites à connaître par cœur :
- ln(x)/x → 0 quand x → +∞, et plus généralement ln(x)/x^n → 0 pour tout n ≥ 1 ;
- x ln(x) → 0 quand x → 0 par valeurs positives ;
- ln(1 + x)/x → 1 quand x → 0 — c’est le **nombre dérivé de ln en 1**.

Le principe à retenir : **la puissance l’emporte toujours sur le logarithme**. Toute indétermination du type ∞/∞ mêlant ln et une puissance se lève par cette règle.

Symétriquement, du côté de l’exponentielle : e^x/x^n → +∞, l’exponentielle l’emportant sur toute puissance.

## La dérivée de ln(u)
Pour une fonction u strictement positive et dérivable :

(ln u)′ = u′ / u

C’est le cas le plus fréquent en exercice. Il impose de déterminer d’abord l’ensemble où **u > 0** : le domaine d’étude de ln(u) n’est pas celui de u.

## La tangente en 1
ln(1) = 0 et ln′(1) = 1 : la tangente en 1 a pour équation **y = x − 1**. La concavité place la courbe **au-dessous** de cette tangente, d’où l’inégalité valable pour tout x > 0 :

ln(x) ≤ x − 1

C’est le pendant exact de e^x ≥ x + 1, et elle sert dans de nombreuses majorations.

## L’étude d’une fonction contenant ln
La démarche est toujours la même : domaine (où l’argument est strictement positif), limites aux bornes, dérivée et son signe, tableau de variations, éventuelles asymptotes, puis tracé.

> Deux automatismes suffisent : (ln u)′ = u′/u pour dériver, et « la puissance gagne » pour lever les indéterminations.`,
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
            cours: `Cosinus et sinus sont les seules fonctions du programme à être **périodiques**. Cette propriété change toute la méthode d’étude : on travaille sur une période, puis on complète.

## Définition et périodicité
Sur le cercle trigonométrique, le point associé au réel x a pour coordonnées (cos x ; sin x). Les deux fonctions sont définies sur **ℝ** tout entier, à valeurs dans **[−1 ; 1]**, et **périodiques de période 2π** :

cos(x + 2π) = cos x et sin(x + 2π) = sin x

## Parité
- **cos est paire** : cos(−x) = cos x, courbe symétrique par rapport à l’axe des ordonnées ;
- **sin est impaire** : sin(−x) = −sin x, courbe symétrique par rapport à l’origine.

Conséquence pratique : il suffit d’étudier sur [0 ; π], puis d’utiliser parité et périodicité pour obtenir toute la courbe. C’est ce qu’attend l’énoncé quand il demande de « réduire l’intervalle d’étude ».

## Les formules à connaître
- cos²x + sin²x = 1 ;
- cos(x + π) = −cos x, sin(x + π) = −sin x ;
- cos(π/2 − x) = sin x, sin(π/2 − x) = cos x ;
- valeurs remarquables en 0, π/6, π/4, π/3, π/2.

## Dérivées
Les deux fonctions sont dérivables sur ℝ et :

cos′(x) = −sin(x) et sin′(x) = cos(x)

Le **signe moins** sur la dérivée du cosinus est l’oubli classique. Pour les composées : (cos u)′ = −u′ sin u et (sin u)′ = u′ cos u. En particulier, la dérivée de sin(ωx) vaut ω cos(ωx).

## Les limites de référence en 0
- **sin(x)/x → 1** ;
- (cos(x) − 1)/x → 0.

Ce sont les **nombres dérivés** de sin en 0 et de cos en 0. Elles servent à lever les indéterminations du type 0/0 contenant une fonction trigonométrique.

⚠️ Ni cos ni sin n’ont de **limite en +∞** : elles oscillent indéfiniment. C’est pourquoi une expression comme sin(x)/x en +∞ se traite par le **théorème des gendarmes**, en encadrant sin(x) entre −1 et 1.

## Variations sur une période
Sur [0 ; π] : cos décroît de 1 à −1, tandis que sin croît de 0 à 1 (sur [0 ; π/2]) puis décroît de 1 à 0.

## Résoudre une équation trigonométrique
cos(x) = cos(a) équivaut à x = a + 2kπ **ou** x = −a + 2kπ, avec k entier.
sin(x) = sin(a) équivaut à x = a + 2kπ **ou** x = π − a + 2kπ.

Oublier la **seconde famille** de solutions est l’erreur la plus fréquente : une équation trigonométrique a presque toujours deux familles de solutions par période.

> Dans les modélisations, sin(ωt + φ) décrit toute oscillation : ω donne la pulsation, φ le déphasage, et l’amplitude multiplie l’ensemble. Le lien avec la physique est direct.`,
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
            cours: `Chercher une **primitive**, c’est faire le chemin inverse de la dérivation. Ce chapitre installe l’outil, puis l’applique à la modélisation d’un phénomène par une **équation différentielle**.

## La définition
F est une **primitive** de f sur un intervalle I si F est dérivable sur I et si **F′ = f** sur I.

Toute fonction **continue** sur un intervalle y admet des primitives. Elles diffèrent toutes d’une **constante** : si F est une primitive de f, l’ensemble des primitives est l’ensemble des fonctions F + C, avec C réel.

Conséquence : parmi toutes les primitives, il en existe **une seule** qui prend une valeur donnée en un point donné. C’est ainsi qu’une **condition initiale** détermine la constante.

## Les primitives usuelles
- f(x) = x^n → F(x) = x^(n+1)/(n+1), pour n ≠ −1 ;
- f(x) = 1/x → F(x) = ln|x| ;
- f(x) = e^x → F(x) = e^x ;
- f(x) = cos x → F(x) = sin x ; f(x) = sin x → F(x) = −cos x ;
- f(x) = 1/√x → F(x) = 2√x.

## Les formes composées
Elles se lisent en retournant la dérivation des composées :
- u′ uⁿ → uⁿ⁺¹/(n+1) ;
- u′/u → ln|u| ;
- u′ e^u → e^u ;
- u′/√u → 2√u ;
- u′ cos u → sin u.

**Reconnaître u′ dans l’expression** est toute la méthode. Quand le facteur constant ne tombe pas juste, on le corrige : pour intégrer 2x e^(x²+1), on voit u = x² + 1 et u′ = 2x — le compte est bon ; pour x e^(x²+1), il faut un facteur 1/2.

## Les équations différentielles
Une **équation différentielle** relie une fonction inconnue et ses dérivées.

- **y′ = a y** : les solutions sont les fonctions x ↦ C e^(a x), C réel. C’est l’équation de toute évolution dont la vitesse est **proportionnelle à la quantité présente** : croissance de population, décroissance radioactive (a < 0), charge d’un condensateur ;
- **y′ = a y + b** (a ≠ 0) : les solutions sont x ↦ C e^(a x) − b/a. La méthode attendue : trouver une **solution particulière constante** (celle qui vérifie 0 = a y + b, soit y = −b/a), puis y ajouter les solutions de l’équation **sans second membre**.

## La condition initiale
L’équation donne une **famille** de solutions ; la condition initiale (par exemple y(0) = 5) en sélectionne **une seule**. Un problème de modélisation comporte donc toujours deux données : l’équation et l’état de départ.

> Le vocabulaire compte : une primitive est une fonction, une constante d’intégration est un réel, et « la » primitive n’existe pas sans condition initiale.`,
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
            cours: `L’intégrale est le seul objet du programme qui soit à la fois **géométrique** (une aire), **analytique** (une primitive) et **statistique** (une moyenne).

## La définition géométrique
Pour f **continue et positive** sur [a ; b], l’intégrale de a à b de f est l’**aire**, en unités d’aire, du domaine compris entre la courbe, l’axe des abscisses et les droites d’équations x = a et x = b.

Quand f est **négative**, l’intégrale est l’**opposé** de l’aire : elle est négative. Une intégrale n’est donc pas une aire en général — c’est une **aire algébrique**.

## Le théorème fondamental
Si F est une primitive de f sur [a ; b], alors :

∫ de a à b de f(x) dx = F(b) − F(a)

C’est le résultat qui relie les deux visages de l’objet : calculer une aire revient à trouver une primitive. Le résultat ne dépend pas de la primitive choisie, puisque la constante s’élimine dans la différence.

## Les propriétés
- **linéarité** : l’intégrale d’une somme est la somme des intégrales, et une constante multiplicative sort de l’intégrale ;
- **relation de Chasles** : de a à b, plus de b à c, égale de a à c ;
- **inversion des bornes** : échanger a et b change le signe ;
- **positivité** : si f ≥ 0 sur [a ; b] avec a ≤ b, alors l’intégrale est positive ;
- **croissance** : si f ≤ g sur [a ; b], alors l’intégrale de f est inférieure à celle de g. C’est l’outil des **encadrements**.

## La valeur moyenne
La **valeur moyenne** de f sur [a ; b] vaut :

(1 / (b − a)) × ∫ de a à b de f(x) dx

Interprétation : la hauteur du rectangle de base [a ; b] qui aurait la même aire que le domaine sous la courbe. Elle sert en physique (valeur moyenne d’un signal) et en probabilités.

## L’aire entre deux courbes
Pour f ≥ g sur [a ; b], l’aire comprise entre les deux courbes vaut l’intégrale de (f − g) sur [a ; b]. Il faut donc **déterminer laquelle est au-dessus** avant de calculer — et découper l’intervalle si les courbes se croisent.

## L’intégration par parties
Elle transforme une intégrale en une autre, plus simple :

∫ u′v = [uv] − ∫ u v′

On l’emploie typiquement quand l’intégrande est un **produit** dont un facteur se simplifie en dérivant : x e^x, x cos x, ou ln x (en posant v = ln x et u′ = 1).

## Les valeurs approchées
Quand aucune primitive ne s’exprime simplement, on approche l’intégrale par la méthode des **rectangles** ou des **trapèzes** : on découpe [a ; b] en n intervalles et l’on somme des aires élémentaires. La précision croît avec n.

> Le fil du chapitre : dériver et intégrer sont deux opérations inverses. C’est le théorème fondamental qui l’énonce, et tout le calcul intégral en découle.`,
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
            cours: `Presque toute la probabilité de Terminale se ramène à un schéma unique : répéter n fois, de façon indépendante, une expérience à deux issues.

## L’épreuve de Bernoulli
Une **épreuve de Bernoulli** est une expérience aléatoire à **deux issues** : le **succès**, de probabilité p, et l’**échec**, de probabilité 1 − p.

La **loi de Bernoulli** de paramètre p est la loi de la variable aléatoire X qui vaut 1 en cas de succès et 0 sinon. On retient :

E(X) = p, V(X) = p(1 − p)

## La succession d’épreuves indépendantes
Répéter n fois la même épreuve, **de façon indépendante**, se représente par un **arbre pondéré**. Deux règles gouvernent sa lecture :
- la probabilité d’un **chemin** est le **produit** des probabilités portées par ses branches ;
- la probabilité d’un **événement** est la **somme** des probabilités des chemins qui le réalisent.

L’indépendance est l’hypothèse cruciale : elle autorise à multiplier. Un tirage **avec remise** la garantit ; un tirage **sans remise** ne la garantit pas — sauf si la population est très grande devant l’échantillon.

## Le schéma de Bernoulli et la loi binomiale
Un **schéma de Bernoulli** est la répétition de n épreuves de Bernoulli identiques et indépendantes. La variable X qui compte le **nombre de succès** suit la **loi binomiale** de paramètres n et p, notée B(n ; p) :

P(X = k) = C(n,k) × p^k × (1 − p)^(n−k), pour k entier de 0 à n

Chaque facteur se lit sur l’arbre : p^k pour les k succès, (1 − p)^(n−k) pour les échecs, et **C(n,k)** pour le nombre de chemins réalisant exactement k succès. C’est ici que sert le dénombrement du chapitre 1.

## Espérance, variance, écart-type
E(X) = n p, V(X) = n p (1 − p), σ(X) = √(n p (1 − p))

L’espérance se retient sans calcul : sur 100 lancers d’une pièce équilibrée, on attend 50 piles.

## Les conditions d’application
Avant d’écrire « X suit la loi binomiale », il faut vérifier **trois points** : les épreuves sont **identiques**, **indépendantes**, et il n’y a que **deux issues**. Un énoncé de bac teste presque toujours l’une des trois — le plus souvent l’indépendance, par un tirage sans remise.

## Le calcul pratique
- P(X = k) : formule directe ;
- P(X ≤ k) : à la calculatrice, fonction de répartition ;
- P(X ≥ k) = 1 − P(X ≤ k − 1) — le passage par l’événement contraire est l’automatisme à acquérir ;
- **seuil** : chercher le plus petit k tel que P(X ≤ k) dépasse une valeur donnée.

> La loi binomiale ne compte que des **succès**, jamais leur ordre. Si la question porte sur l’ordre d’apparition, on revient à l’arbre.`,
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
            cours: `Additionner des variables aléatoires est l’opération centrale de la fin du programme : c’est elle qui mène à la loi des grands nombres et à la notion d’échantillon.

## Espérance et variance : les rappels
Pour une variable aléatoire X prenant les valeurs x(i) avec les probabilités p(i) :
- **espérance** : E(X) = Σ p(i) x(i) — la valeur moyenne attendue sur un grand nombre de répétitions ;
- **variance** : V(X) = E(X²) − E(X)² — la dispersion autour de l’espérance ;
- **écart-type** : σ(X) = √V(X), exprimé dans la **même unité** que X.

## La linéarité de l’espérance
Pour tous réels a et b :

E(aX + b) = a E(X) + b, et E(X + Y) = E(X) + E(Y)

⚠️ La seconde égalité est vraie **même si X et Y ne sont pas indépendantes**. C’est une propriété remarquablement générale, et le programme y insiste : l’espérance est **toujours** additive.

## La variance, elle, ne l’est pas
V(aX + b) = a² V(X)

Le **carré** sur le coefficient et la **disparition** de b sont les deux points à retenir : ajouter une constante décale la distribution sans changer sa dispersion.

Et surtout :

V(X + Y) = V(X) + V(Y) **seulement si X et Y sont indépendantes**

Sans indépendance, l’égalité est fausse. C’est la différence majeure avec l’espérance, et l’erreur la plus sanctionnée du chapitre.

## L’échantillon
Un **échantillon de taille n** est une liste (X₁, …, Xₙ) de variables aléatoires **indépendantes** et de **même loi**, d’espérance μ et d’écart-type σ.

On pose S = X₁ + … + Xₙ (la **somme**) et M = S/n (la **moyenne empirique**). Alors :
- E(S) = n μ et V(S) = n σ², donc σ(S) = σ √n ;
- **E(M) = μ** et V(M) = σ²/n, donc **σ(M) = σ/√n**.

## Ce que dit la formule en √n
Deux conséquences, à savoir énoncer :
- la moyenne empirique a **la même espérance** que la variable de départ : elle ne se trompe pas systématiquement, elle est **sans biais** ;
- sa dispersion **décroît en 1/√n** : elle se concentre autour de μ quand n grandit, mais **lentement**. Diviser l’écart-type par 2 exige de **quadrupler** la taille de l’échantillon. C’est ce qui rend les sondages coûteux.

## Le cas de la loi binomiale
Une variable de loi B(n ; p) est exactement la **somme de n variables de Bernoulli** indépendantes de paramètre p. On retrouve immédiatement E = n p et V = n p (1 − p) : la formule binomiale n’est qu’un cas particulier de ce chapitre.

> Espérance : additive toujours. Variance : additive seulement sous indépendance. Ces deux lignes suffisent à traiter la moitié des questions du chapitre.`,
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
            cours: `Ce dernier chapitre démontre ce que l’intuition affirme depuis la Seconde : quand on répète beaucoup, la fréquence observée s’approche de la probabilité théorique.

## L’inégalité de Markov
Pour une variable aléatoire X **positive** d’espérance E(X) et pour tout réel a > 0 :

P(X ≥ a) ≤ E(X) / a

Lecture : une variable positive ne peut pas dépasser souvent une valeur bien supérieure à sa moyenne. L’inégalité n’utilise que l’espérance, ce qui la rend très générale — et très peu précise.

## L’inégalité de Bienaymé-Tchebychev
Pour toute variable aléatoire X d’espérance μ et de variance V, et pour tout réel δ > 0 :

P(|X − μ| ≥ δ) ≤ V / δ²

Lecture : la probabilité de s’écarter de la moyenne d’au moins δ est majorée par la variance divisée par δ². Plus la variance est petite, plus la variable est concentrée autour de son espérance.

Cette inégalité vaut pour **n’importe quelle** loi : c’est sa force. Sa faiblesse est d’être **grossière** — la majoration obtenue est souvent très supérieure à la probabilité réelle. Elle sert à **garantir**, pas à estimer finement.

## L’inégalité de concentration
Appliquée à la **moyenne empirique** M d’un échantillon de taille n, d’espérance μ et de variance σ², dont on sait que V(M) = σ²/n :

P(|M − μ| ≥ δ) ≤ σ² / (n δ²)

Le majorant contient **n au dénominateur** : il tend vers 0 quand n grandit, pour tout δ fixé.

## La loi des grands nombres
C’en est la conséquence directe : pour tout δ > 0,

P(|M − μ| ≥ δ) → 0 quand n → +∞

Autrement dit, la **moyenne empirique se concentre** autour de l’espérance quand la taille de l’échantillon augmente. Dans le cas d’une loi de Bernoulli, μ = p et M est la **fréquence observée** de succès : la fréquence tend vers la probabilité. C’est la justification théorique de tout ce qui a été admis depuis le collège.

## Ce que la loi ne dit pas
Elle ne dit **rien sur une répétition particulière**. Après dix « pile » consécutifs, la probabilité du prochain lancer reste 1/2 : la pièce n’a pas de mémoire. La convergence porte sur la **moyenne**, pas sur une compensation des écarts passés — croire l’inverse est l’**erreur du joueur**.

## L’usage pratique : la taille d’échantillon
L’inégalité de concentration permet de calculer un **n suffisant** pour garantir une précision donnée avec un risque donné. Pour une proportion, σ² = p(1 − p) ≤ 1/4, ce qui donne un majorant **utilisable même sans connaître p** — c’est ce qui rend le dimensionnement d’un sondage possible avant de l’avoir mené.

> La loi des grands nombres est le pont entre le calcul des probabilités et la statistique : elle autorise à estimer un paramètre inconnu à partir d’un échantillon, et à dire de combien on peut se tromper.`,
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
