// Mathématiques — Seconde : LE PROGRAMME COMPLET (20 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres de maths,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 122) : « Ensembles de nombres et calculs », « Équations et inéquations »,
// « Fonctions de référence », « Vecteurs », « Statistiques et probabilités ».
// Cinq titres pour l'année entière, avec une seule leçon chacun — les six
// fonctions de référence tenaient dans une fiche, la géométrie repérée dans
// une autre.
//
// LE DÉCOUPAGE. Les 4 grands chapitres du programme — Nombres et calculs,
// Géométrie, Fonctions, Statistiques et probabilités — éclatés en leurs 20
// fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière
// — cf. docs/template-matiere.md. Un seul rayon : pas de `rayon` ici.
//
// ÉCRITURE DES FORMULES. Aucun rendu LaTeX n'existe dans l'app : les formules
// sont écrites en clair, avec les caractères Unicode usuels (², √, ≤, ≥, ≠, ×,
// −, π). Écrire du LaTeX ici produirait des antislashs échappés et des
// dollars affichés tels quels dans le cours.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Quatre d'entre eux sont recouverts
// mot pour mot par le nouveau découpage, et « Statistiques et probabilités »
// devient un CHAPITRE du programme : le garder comme fiche ferait deux objets
// du même nom, un en-tête de section et une ligne dans la liste. Le ménage est
// borné à leurs cinq titres exacts et au seul niveau 2de — rejoué, il ne trouve
// plus rien et ne touche jamais les 20 fiches neuves.
//
// ⚠️ Le slug reste `maths` (la matière existe depuis 008). Ce module se génère
// par `--modules maths-2de` : `--slugs maths` le fusionnerait avec maths-1re,
// maths-tle, maths-expertes-tle et maths-complementaires, et réécrirait des
// migrations déjà exécutées.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 2de — LE PROGRAMME COMPLET (20 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres de maths, hérités du
premier jeu de données de l'app, avec une leçon générique chacun. Le programme
officiel s'organise en QUATRE grands chapitres — nombres et calculs, géométrie,
fonctions, statistiques et probabilités — qui se déplient en 20 fiches. Un élève
de 2de qui révisait les nombres premiers, les identités remarquables, le projeté
orthogonal, les coordonnées de vecteurs, les équations de droites, la fonction
cube, la fonction racine carrée, la fonction inverse ou l'échantillonnage ne
trouvait RIEN. Cette migration installe les 20 fiches, rangées sous leurs 4
chapitres, et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 20 fiches sous 4 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 20 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Quatre sont recouverts mot pour mot par le
nouveau découpage ; le cinquième, "Statistiques et probabilités", devient un
CHAPITRE du programme — le garder comme fiche ferait deux objets du même nom à
deux places différentes, un en-tête de section et une ligne dans la liste.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau 2de. Sans
cette borne, un rejeu après coup effacerait les quiz des 20 fiches neuves — le
ménage tourne avant les insertions à CHAQUE passage. Le niveau est décisif ici :
"Vecteurs" et "Statistiques et probabilités" existent aussi à d'autres niveaux.`,
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
   AND c.level = '2de'
   AND c.title IN ('Ensembles de nombres et calculs',
                   'Équations et inéquations',
                   'Fonctions de référence',
                   'Vecteurs',
                   'Statistiques et probabilités');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '2de'
   AND c.title IN ('Ensembles de nombres et calculs',
                   'Équations et inéquations',
                   'Fonctions de référence',
                   'Vecteurs',
                   'Statistiques et probabilités');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths'
   AND c.level = '2de'
   AND c.title IN ('Ensembles de nombres et calculs',
                   'Équations et inéquations',
                   'Fonctions de référence',
                   'Vecteurs',
                   'Statistiques et probabilités');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Nombres et calculs
        // ===================================================================
        {
          titre: 'Ensemble des nombres réels et intervalles',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Ranger les nombres, écrire les ensembles de solutions',
            cours: `Tous les nombres ne se ressemblent pas. Les classer permet de savoir ce qu’on a le droit de faire avec, et d’écrire proprement les solutions d’une inéquation.

## Les ensembles emboîtés
ℕ contient les entiers naturels (0, 1, 2, …). ℤ y ajoute les entiers négatifs. ⅅ, les décimaux, sont ceux dont l’écriture décimale est finie. ℚ, les rationnels, sont les quotients de deux entiers. ℝ, les réels, contiennent en plus les irrationnels comme √2 ou π. Chacun contient le précédent : ℕ ⊂ ℤ ⊂ ⅅ ⊂ ℚ ⊂ ℝ.

## La droite numérique
Chaque réel correspond à un point d’une droite graduée, et réciproquement. C’est ce qui permet de représenter un ensemble de solutions par une portion de droite.

> Résoudre une inéquation, ce n’est pas trouver un nombre : c’est décrire une partie de la droite réelle.

## Les intervalles
[a ; b] contient a et b (crochets fermés) ; ]a ; b[ les exclut ; les formes mixtes existent. On écrit aussi ]−∞ ; b] pour tous les réels inférieurs ou égaux à b, et [a ; +∞[ pour ceux supérieurs ou égaux à a. Le crochet est **toujours ouvert** du côté de l’infini, qui n’est pas un nombre.

## Réunion, intersection, valeur absolue
L’intersection ∩ garde ce qui appartient aux deux ensembles, la réunion ∪ garde ce qui appartient à l’un ou à l’autre. La **valeur absolue** |x| est la distance de x à 0 ; |x − a| ≤ r se traduit par x ∈ [a − r ; a + r], soit un intervalle centré en a de rayon r.`,
          },
          questions: [
            ['Quel ensemble contient tous les autres ?', ['ℝ, l’ensemble des réels', 'ℚ, l’ensemble des rationnels', 'ℤ, l’ensemble des entiers relatifs', 'ⅅ, l’ensemble des décimaux'], 0, 'ℕ ⊂ ℤ ⊂ ⅅ ⊂ ℚ ⊂ ℝ.'],
            ['À quel ensemble le nombre √2 appartient-il ?', ['À ℝ mais pas à ℚ', 'À ℚ mais pas à ℝ', 'À ℤ', 'À ⅅ'], 0, 'C’est un irrationnel : son écriture décimale est infinie et non périodique.'],
            ['Comment note-t-on l’ensemble des réels strictement compris entre 2 et 5 ?', [']2 ; 5[', '[2 ; 5]', '[2 ; 5[', ']2 ; 5]'], 0, 'Les crochets ouverts excluent les bornes.'],
            ['Comment écrit-on l’ensemble des réels inférieurs ou égaux à 3 ?', [']−∞ ; 3]', '[−∞ ; 3]', ']−∞ ; 3[', '[3 ; +∞['], 0, 'Le crochet est toujours ouvert du côté de l’infini.'],
            ['Que vaut |−7| ?', ['7', '−7', '0', '14'], 0, 'La valeur absolue est la distance à zéro.'],
            ['L’inéquation |x − 4| ≤ 2 se traduit par un intervalle centré en 4.', ['Vrai', 'Faux'], 0, 'C’est [2 ; 6], de centre 4 et de rayon 2.'],
            ['Que donne l’intersection de [0 ; 5] et [3 ; 8] ?', ['[3 ; 5]', '[0 ; 8]', '[0 ; 3]', 'L’ensemble vide'], 0, 'On garde ce qui appartient aux deux intervalles.'],
            ['Le nombre 1/3 est-il un décimal ?', ['Non, mais il est rationnel', 'Oui', 'Non, il est irrationnel', 'Non, il est entier'], 0, 'Son écriture décimale est infinie, mais c’est un quotient d’entiers.'],
          ],
        },
        {
          titre: 'Les nombres décimaux, rationnels et irrationnels',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Reconnaître un nombre à son écriture',
            cours: `Un même nombre s’écrit de plusieurs façons. Savoir passer d’une écriture à l’autre, et reconnaître à quelle famille il appartient, évite bien des erreurs de raisonnement.

## Les décimaux
Un nombre est **décimal** s’il peut s’écrire sous la forme a/10ⁿ avec a entier : son écriture décimale est **finie**. 0,25 est décimal (25/100), 3 aussi (3/1). Un quotient d’entiers est décimal si, une fois la fraction irréductible, le dénominateur ne contient comme facteurs premiers que 2 et 5.

## Les rationnels
Un **rationnel** est un quotient de deux entiers. Son écriture décimale est finie ou **périodique** à partir d’un certain rang : 1/3 = 0,333…, 1/7 = 0,142857142857… Réciproquement, tout développement périodique correspond à un rationnel.

> Le développement décimal ne ment pas : fini ou périodique, c’est un rationnel ; infini sans période, c’est un irrationnel.

## Les irrationnels
√2, √3, π, le nombre d’or : leur écriture décimale est infinie et non périodique. On démontre par l’absurde que √2 n’est pas rationnel : en le supposant égal à p/q irréductible, on aboutit à ce que p et q soient tous deux pairs, ce qui contredit l’irréductibilité.

## Calculer avec les fractions
Additionner suppose un dénominateur commun ; multiplier se fait terme à terme ; diviser revient à multiplier par l’inverse. Il est presque toujours plus sûr de garder une valeur exacte, comme 1/3 ou √2, que d’écrire une valeur approchée — les arrondis successifs s’accumulent.`,
          },
          questions: [
            ['Qu’est-ce qu’un nombre décimal ?', ['Un nombre dont l’écriture décimale est finie', 'Un nombre à virgule', 'Un quotient de deux entiers', 'Un nombre inférieur à 1'], 0, 'Il peut s’écrire a/10ⁿ avec a entier.'],
            ['Comment reconnaît-on un rationnel à son écriture décimale ?', ['Elle est finie ou périodique', 'Elle est toujours infinie', 'Elle comporte moins de dix chiffres', 'Elle commence par zéro'], 0, 'Réciproquement, tout développement périodique est rationnel.'],
            ['Le nombre 0,142857142857… est-il rationnel ?', ['Oui, c’est 1/7', 'Non, il est irrationnel', 'Oui, c’est un décimal', 'Non, il n’est pas défini'], 0, 'Son développement est périodique.'],
            ['Quelle est la nature de π ?', ['Irrationnel', 'Décimal', 'Rationnel', 'Entier'], 0, 'Son écriture décimale est infinie et non périodique.'],
            ['Comment démontre-t-on que √2 est irrationnel ?', ['Par l’absurde, en supposant qu’il s’écrit p/q irréductible', 'Par récurrence', 'Par le calcul de ses décimales', 'Par une construction géométrique'], 0, 'On aboutit à ce que p et q soient tous deux pairs.'],
            ['La fraction 3/8 correspond à un nombre décimal.', ['Vrai', 'Faux'], 0, '3/8 = 0,375 ; le dénominateur ne contient que le facteur 2.'],
            ['Que vaut 2/3 + 1/6 ?', ['5/6', '3/9', '1/2', '3/6'], 0, 'On réduit au même dénominateur : 4/6 + 1/6.'],
            ['Pourquoi préférer une valeur exacte à une valeur approchée ?', ['Parce que les arrondis successifs s’accumulent en erreurs', 'Parce que c’est plus rapide à écrire', 'Parce que la calculatrice l’exige', 'Parce que les valeurs approchées sont interdites'], 0, 'On n’arrondit qu’à la toute fin d’un calcul.'],
          ],
        },
        {
          titre: 'Nombres entiers : multiples, diviseurs et nombres premiers',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'La structure cachée des entiers',
            cours: `Les entiers ne sont pas interchangeables : chacun se décompose d’une seule manière en produit de nombres premiers. C’est le théorème fondamental de l’arithmétique.

## Multiples et diviseurs
Dire que b **divise** a, c’est dire qu’il existe un entier k tel que a = b × k ; on dit aussi que a est un **multiple** de b. Les deux formulations décrivent la même relation, vue de chaque côté.

## Les critères de divisibilité
Par 2 : le chiffre des unités est pair. Par 3 : la somme des chiffres est divisible par 3. Par 5 : le nombre se termine par 0 ou 5. Par 9 : la somme des chiffres est divisible par 9. Par 10 : il se termine par 0. Par 4 : les deux derniers chiffres forment un nombre divisible par 4.

> Un nombre premier n’est pas un nombre rare : il y en a une infinité, et Euclide l’a démontré il y a plus de deux mille ans.

## Les nombres premiers
Un entier supérieur ou égal à 2 est **premier** s’il n’admet que deux diviseurs positifs : 1 et lui-même. 2, 3, 5, 7, 11, 13, 17, 19, 23, 29… Le nombre 1 n’est pas premier, par convention utile : sinon la décomposition ne serait plus unique. Pour tester si n est premier, il suffit d’essayer les diviseurs premiers jusqu’à √n.

## La décomposition
Tout entier supérieur ou égal à 2 s’écrit de manière **unique** comme produit de facteurs premiers : 360 = 2³ × 3² × 5. Cette décomposition sert à simplifier une fraction, à trouver le PGCD, et fonde la cryptographie moderne — multiplier deux grands nombres premiers est facile, retrouver les facteurs d’un très grand produit ne l’est pas.`,
          },
          questions: [
            ['Qu’est-ce qu’un nombre premier ?', ['Un entier supérieur ou égal à 2 n’ayant que deux diviseurs positifs', 'Un nombre impair', 'Un nombre qui n’est pas décomposable', 'Le premier terme d’une suite'], 0, '1 et lui-même.'],
            ['Le nombre 1 est-il premier ?', ['Non, par convention, pour garantir l’unicité de la décomposition', 'Oui', 'Oui, c’est le plus petit', 'Cela dépend du contexte'], 0, 'Sinon, tout produit pourrait être multiplié par 1 indéfiniment.'],
            ['Quel critère permet de savoir si un nombre est divisible par 3 ?', ['La somme de ses chiffres est divisible par 3', 'Il se termine par 3', 'Il est impair', 'Ses deux derniers chiffres sont divisibles par 3'], 0, 'Même principe pour 9.'],
            ['Quelle est la décomposition en facteurs premiers de 360 ?', ['2³ × 3² × 5', '2² × 3³ × 5', '2 × 3 × 60', '2⁴ × 3 × 5'], 0, '8 × 9 × 5 = 360.'],
            ['Jusqu’où faut-il tester les diviseurs pour savoir si n est premier ?', ['Jusqu’à √n', 'Jusqu’à n/2', 'Jusqu’à n', 'Jusqu’à 100'], 0, 'Au-delà, on retrouverait des diviseurs déjà rencontrés.'],
            ['Il existe une infinité de nombres premiers.', ['Vrai', 'Faux'], 0, 'Démontré par Euclide il y a plus de deux mille ans.'],
            ['Que signifie que 7 divise 91 ?', ['Il existe un entier k tel que 91 = 7 × k', '91 est premier', '7 est un multiple de 91', '91/7 n’est pas entier'], 0, 'Ici k = 13.'],
            ['Sur quoi repose la sécurité de nombreux systèmes de chiffrement ?', ['La difficulté de factoriser un très grand nombre', 'La rareté des nombres pairs', 'Le calcul du PGCD', 'Les critères de divisibilité'], 0, 'Multiplier est facile, factoriser ne l’est pas.'],
          ],
        },
        {
          titre: 'Calcul littéral : quotients, puissances, racines carrées',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Les règles qui évitent les fautes',
            cours: `Le calcul littéral n’est pas une gymnastique gratuite : il permet de transformer une expression pour la rendre lisible, comparable, ou résoluble.

## Les puissances
aⁿ est le produit de n facteurs égaux à a. Les règles : aᵐ × aⁿ = aᵐ⁺ⁿ ; aᵐ / aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐˣⁿ ; (ab)ⁿ = aⁿbⁿ. Par convention a⁰ = 1 pour a non nul, et a⁻ⁿ = 1/aⁿ. La **notation scientifique** écrit tout nombre sous la forme a × 10ⁿ avec 1 ≤ |a| < 10.

## Les racines carrées
Pour a ≥ 0, √a est l’unique nombre positif dont le carré vaut a. Règles : √(ab) = √a × √b et √(a/b) = √a / √b pour b > 0. Attention : **√(a + b) n’est pas √a + √b**, c’est la faute la plus fréquente. On sait aussi que √(a²) = |a|, et non a.

> Une racine au dénominateur se rend rationnelle en multipliant haut et bas par la même racine : 1/√2 = √2/2.

## Les quotients
Un quotient n’est défini que si le dénominateur est non nul : il faut toujours donner les **valeurs interdites**. Pour additionner, on réduit au même dénominateur ; pour simplifier, on factorise numérateur et dénominateur avant de barrer un facteur commun — jamais un terme d’une somme.

## Les pièges classiques
(a + b)² ne vaut pas a² + b². 1/(a + b) ne vaut pas 1/a + 1/b. Simplifier (x + 3)/(x + 5) en 3/5 est faux. Dans tous ces cas, la règle est la même : on ne simplifie que des **facteurs**, jamais des **termes**.`,
          },
          questions: [
            ['Que vaut a⁵ × a³ ?', ['a⁸', 'a¹⁵', 'a²', '2a⁸'], 0, 'On additionne les exposants.'],
            ['Que vaut (a³)⁴ ?', ['a¹²', 'a⁷', 'a⁸¹', '4a³'], 0, 'On multiplie les exposants.'],
            ['Que vaut a⁻³ ?', ['1/a³', '−a³', '0', '3/a'], 0, 'Un exposant négatif donne l’inverse.'],
            ['√9 + √16 est-il égal à √25 ?', ['Non : 3 + 4 = 7, alors que √25 = 5', 'Oui', 'Oui, si a et b sont positifs', 'Cela dépend'], 0, 'La racine d’une somme n’est pas la somme des racines.'],
            ['Que vaut √(a²) ?', ['|a|', 'a', 'a²', '−a'], 0, 'La racine carrée est toujours positive.'],
            ['La notation scientifique écrit un nombre sous la forme a × 10ⁿ avec 1 ≤ |a| < 10.', ['Vrai', 'Faux'], 0, 'Elle facilite la comparaison des ordres de grandeur.'],
            ['Peut-on simplifier (x + 3)/(x + 5) en 3/5 ?', ['Non, on ne simplifie que des facteurs, jamais des termes', 'Oui', 'Oui, si x est positif', 'Oui, si x est différent de −5'], 0, 'C’est l’erreur la plus fréquente du calcul littéral.'],
            ['Comment rendre rationnel le dénominateur de 1/√3 ?', ['En multipliant numérateur et dénominateur par √3', 'En élevant au carré', 'En prenant la racine du numérateur', 'C’est impossible'], 0, 'On obtient √3/3.'],
          ],
        },
        {
          titre: 'Les identités remarquables',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Trois formules à savoir dans les deux sens',
            cours: `Les identités remarquables servent à **développer** quand on veut calculer, et à **factoriser** quand on veut résoudre. Savoir les lire dans les deux sens est ce qui compte.

## Les trois formules
(a + b)² = a² + 2ab + b²
(a − b)² = a² − 2ab + b²
(a + b)(a − b) = a² − b²

Le terme du milieu, le fameux **double produit**, est celui que l’on oublie : (a + b)² n’est jamais a² + b².

## Développer
(x + 5)² = x² + 10x + 25. (3x − 2)² = 9x² − 12x + 4. (2x + 7)(2x − 7) = 4x² − 49. Le repérage se fait en identifiant a et b avant tout calcul.

> Développer sert à calculer ; factoriser sert à résoudre. Une équation se résout presque toujours sous forme factorisée.

## Factoriser
Reconnaître x² − 9 comme (x − 3)(x + 3) ; x² + 6x + 9 comme (x + 3)² ; 16x² − 25 comme (4x − 5)(4x + 5). On cherche d’abord un **facteur commun**, puis une identité remarquable.

## À quoi cela sert
Résoudre une équation grâce au principe du produit nul : un produit est nul si et seulement si l’un de ses facteurs est nul. Simplifier une fraction rationnelle. Calculer de tête : 101 × 99 = (100 + 1)(100 − 1) = 10 000 − 1 = 9 999. Et, l’an prochain, mettre un trinôme sous forme canonique.`,
          },
          questions: [
            ['Que vaut (a + b)² ?', ['a² + 2ab + b²', 'a² + b²', 'a² − 2ab + b²', '2a + 2b'], 0, 'Le double produit est le terme qu’on oublie.'],
            ['Que vaut (a + b)(a − b) ?', ['a² − b²', 'a² + b²', 'a² − 2ab + b²', '(a − b)²'], 0, 'La différence de deux carrés.'],
            ['Comment factoriser x² − 49 ?', ['(x − 7)(x + 7)', '(x − 7)²', '(x + 7)²', 'x(x − 49)'], 0, 'Différence de deux carrés, avec b = 7.'],
            ['Comment factoriser x² + 10x + 25 ?', ['(x + 5)²', '(x − 5)²', '(x + 5)(x − 5)', 'x(x + 10) + 25'], 0, 'On reconnaît a = x, b = 5 et le double produit 10x.'],
            ['Développez (3x − 2)².', ['9x² − 12x + 4', '9x² + 12x + 4', '9x² − 4', '3x² − 12x + 4'], 0, 'Le double produit vaut 2 × 3x × 2 = 12x.'],
            ['Un produit de facteurs est nul si et seulement si l’un des facteurs est nul.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend la forme factorisée si utile pour résoudre.'],
            ['Que vaut 101 × 99 en utilisant une identité remarquable ?', ['9 999', '9 990', '10 001', '9 899'], 0, '(100 + 1)(100 − 1) = 10 000 − 1.'],
            ['Quelle forme faut-il obtenir pour résoudre facilement une équation ?', ['La forme factorisée', 'La forme développée', 'La forme canonique', 'La forme décimale'], 0, 'On applique ensuite le principe du produit nul.'],
          ],
        },
        {
          titre: 'Les équations et inéquations',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Résoudre sans perdre ni inventer de solutions',
            cours: `Résoudre, c’est trouver **toutes** les valeurs qui rendent l’égalité ou l’inégalité vraie — ni plus, ni moins. Chaque transformation doit conserver exactement l’ensemble des solutions.

## Les équations du premier degré
ax + b = 0 admet, pour a non nul, l’unique solution x = −b/a. La méthode : développer si nécessaire, regrouper les termes en x d’un côté, les constantes de l’autre, puis diviser par le coefficient de x.

## Les équations produit et quotient
Un **produit** est nul si et seulement si l’un de ses facteurs est nul : (x − 2)(x + 5) = 0 donne x = 2 ou x = −5. Un **quotient** est nul si son numérateur est nul et son dénominateur non nul — d’où l’obligation de déterminer les **valeurs interdites** avant de résoudre.

> Multiplier les deux membres par un nombre négatif change le sens de l’inégalité. C’est la seule règle vraiment nouvelle des inéquations.

## Les inéquations
Mêmes gestes qu’une équation, avec une exception décisive : lorsqu’on multiplie ou divise par un nombre **strictement négatif**, on inverse le sens de l’inégalité. La solution s’écrit sous forme d’**intervalle** : par exemple S = ]−∞ ; 3].

## Le tableau de signes
Pour une inéquation produit ou quotient, on étudie le signe de chaque facteur puis on applique la règle des signes dans un **tableau**. Pour une double barre au dénominateur, on note la valeur interdite. Cette méthode se réutilisera toute l’année, et l’an prochain avec le second degré.`,
          },
          questions: [
            ['Quelle est la solution de 3x − 12 = 0 ?', ['x = 4', 'x = −4', 'x = 12', 'x = 36'], 0, 'On isole x puis on divise par 3.'],
            ['Quelles sont les solutions de (x − 2)(x + 5) = 0 ?', ['2 et −5', '−2 et 5', '2 et 5', '−2 et −5'], 0, 'Un produit est nul si l’un des facteurs est nul.'],
            ['Que faut-il déterminer avant de résoudre une équation quotient ?', ['Les valeurs interdites, qui annulent le dénominateur', 'Le signe du numérateur', 'Le degré de l’équation', 'La forme canonique'], 0, 'Sans elles, on risque de proposer une solution non définie.'],
            ['Que devient l’inégalité quand on divise les deux membres par −2 ?', ['Elle change de sens', 'Elle reste identique', 'Elle devient une égalité', 'Elle n’a plus de solution'], 0, 'C’est la règle propre aux inéquations.'],
            ['Résolvez −2x + 6 > 0.', ['x < 3', 'x > 3', 'x < −3', 'x > −3'], 0, 'On divise par −2 en inversant le sens.'],
            ['Un quotient est nul lorsque son numérateur est nul et son dénominateur non nul.', ['Vrai', 'Faux'], 0, 'Les deux conditions sont nécessaires.'],
            ['Quel outil sert à résoudre une inéquation produit ?', ['Le tableau de signes', 'La forme canonique', 'Le discriminant', 'Le théorème de Thalès'], 0, 'On étudie le signe de chaque facteur puis on applique la règle des signes.'],
            ['Comment s’écrit l’ensemble des solutions d’une inéquation ?', ['Sous forme d’intervalle', 'Sous forme de fraction', 'Sous forme d’équation', 'Sous forme de tableau uniquement'], 0, 'Par exemple S = ]−∞ ; 3].'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Géométrie
        // ===================================================================
        {
          titre: 'Géométrie plane : triangles et projeté orthogonal d’un point sur une droite',
          axe: 'Géométrie',
          lecon: {
            titre: 'Le pied de la perpendiculaire, et la plus courte distance',
            cours: `La géométrie de seconde reprend les outils du collège et ajoute une notion neuve, le **projeté orthogonal**, qui donnera plus tard le produit scalaire.

## Les outils du triangle
**Pythagore** et sa réciproque, dans un triangle rectangle. **Thalès** et sa réciproque, dans une configuration de droites parallèles. La **trigonométrie** dans le triangle rectangle : cosinus égale adjacent sur hypoténuse, sinus égale opposé sur hypoténuse, tangente égale opposé sur adjacent.

## Les droites remarquables
**Médiatrices** d’un triangle, concourantes au centre du cercle circonscrit. **Hauteurs**, concourantes à l’orthocentre. **Médianes**, concourantes au centre de gravité, situé aux deux tiers de chaque médiane depuis le sommet. **Bissectrices**, concourantes au centre du cercle inscrit.

> Le projeté orthogonal, c’est l’ombre d’un point sur une droite quand la lumière vient perpendiculairement.

## Le projeté orthogonal
Le **projeté orthogonal** de M sur une droite d est le point H de d tel que la droite (MH) soit perpendiculaire à d. Il est unique, et la distance MH est **la plus courte** de toutes les distances de M à un point de d : c’est ce qu’on appelle la distance du point M à la droite d.

## Applications
Calculer une hauteur, une aire, une distance à une droite. Justifier qu’un point est le plus proche. Optimiser : dans de nombreux problèmes concrets, le minimum d’une distance s’obtient exactement au pied de la perpendiculaire.`,
          },
          questions: [
            ['Qu’est-ce que le projeté orthogonal d’un point M sur une droite d ?', ['Le point H de d tel que (MH) soit perpendiculaire à d', 'Le milieu du segment reliant M à d', 'Le point de d le plus éloigné de M', 'L’intersection de d avec la médiatrice'], 0, 'Il est unique.'],
            ['Que représente la distance MH lorsque H est le projeté orthogonal de M sur d ?', ['La plus courte distance de M à la droite d', 'La distance moyenne', 'Le rayon du cercle circonscrit', 'La longueur de la médiane'], 0, 'Toute autre distance de M à un point de d est plus grande.'],
            ['Où se coupent les médiatrices d’un triangle ?', ['Au centre du cercle circonscrit', 'À l’orthocentre', 'Au centre de gravité', 'Au centre du cercle inscrit'], 0, 'Elles sont équidistantes des trois sommets.'],
            ['Où se coupent les hauteurs d’un triangle ?', ['À l’orthocentre', 'Au centre de gravité', 'Au centre du cercle inscrit', 'Au centre du cercle circonscrit'], 0, 'Chaque hauteur passe par un sommet perpendiculairement au côté opposé.'],
            ['Où se situe le centre de gravité sur une médiane ?', ['Aux deux tiers depuis le sommet', 'Au milieu', 'Au tiers depuis le sommet', 'Au pied de la médiane'], 0, 'Propriété classique du point de concours des médianes.'],
            ['Le cosinus d’un angle aigu dans un triangle rectangle est le rapport du côté adjacent à l’hypoténuse.', ['Vrai', 'Faux'], 0, 'Le sinus utilise le côté opposé.'],
            ['Que permet la réciproque du théorème de Pythagore ?', ['Démontrer qu’un triangle est rectangle', 'Calculer une hauteur', 'Calculer une aire', 'Démontrer que deux droites sont parallèles'], 0, 'On compare le carré du plus grand côté à la somme des deux autres.'],
            ['Que permet le théorème de Thalès ?', ['Calculer des longueurs dans une configuration de droites parallèles', 'Démontrer qu’un triangle est rectangle', 'Trouver un projeté orthogonal', 'Calculer un angle'], 0, 'Sa réciproque sert à prouver un parallélisme.'],
          ],
        },
        {
          titre: 'Vecteurs du plan et opérations',
          axe: 'Géométrie',
          lecon: {
            titre: 'Un objet qui décrit un déplacement',
            cours: `Un **vecteur** ne décrit pas un point mais un **déplacement** : une direction, un sens, une longueur. Deux flèches situées à des endroits différents peuvent représenter le même vecteur.

## Définition
Le vecteur AB est caractérisé par trois données : sa **direction** (celle de la droite (AB)), son **sens** (de A vers B), sa **norme**, c’est-à-dire la longueur AB. Le vecteur nul a une norme nulle et pas de direction propre.

## Égalité et parallélogramme
Deux vecteurs AB et CD sont **égaux** lorsqu’ils ont même direction, même sens et même norme. C’est exactement dire que ABDC est un parallélogramme, éventuellement aplati. Un vecteur peut donc être représenté à partir de n’importe quel point.

> Dire que deux vecteurs sont égaux, c’est dire qu’un même déplacement a été effectué à deux endroits.

## Somme et relation de Chasles
La **relation de Chasles** énonce que AB + BC = AC : enchaîner deux déplacements revient à en faire un seul. On peut aussi construire la somme par la règle du **parallélogramme**. La somme est commutative et associative, et AB + BA est le vecteur nul.

## Multiplication par un réel
k fois le vecteur u a la même direction que u ; même sens si k > 0, sens opposé si k < 0 ; sa norme est |k| fois celle de u. Deux vecteurs non nuls sont **colinéaires** s’il existe un réel k tel que l’un soit k fois l’autre — ce qui traduit exactement le parallélisme de leurs directions, et l’alignement lorsqu’ils partagent un point.`,
          },
          questions: [
            ['Quelles sont les trois caractéristiques d’un vecteur ?', ['Direction, sens et norme', 'Origine, extrémité et longueur', 'Abscisse, ordonnée et angle', 'Position, vitesse et sens'], 0, 'Un vecteur n’a pas de position fixe.'],
            ['Que signifie l’égalité des vecteurs AB et CD ?', ['ABDC est un parallélogramme', 'ABCD est un parallélogramme', 'Les points sont alignés', 'AB et CD ont même longueur seulement'], 0, 'Attention à l’ordre des sommets.'],
            ['Qu’énonce la relation de Chasles ?', ['AB + BC = AC', 'AB + BC = CA', 'AB − BC = AC', 'AB × BC = AC'], 0, 'Enchaîner deux déplacements revient à en faire un seul.'],
            ['Que vaut la somme des vecteurs AB et BA ?', ['Le vecteur nul', 'Le vecteur AA de norme 1', '2 fois le vecteur AB', 'Le vecteur AB'], 0, 'On revient au point de départ.'],
            ['Quel est le sens du vecteur −3u par rapport à u ?', ['Sens opposé, avec une norme trois fois plus grande', 'Même sens, norme trois fois plus grande', 'Sens opposé, norme trois fois plus petite', 'Même sens, norme identique'], 0, 'Le signe donne le sens, la valeur absolue la norme.'],
            ['Deux vecteurs non nuls sont colinéaires s’il existe un réel k tel que l’un soit égal à k fois l’autre.', ['Vrai', 'Faux'], 0, 'La colinéarité traduit le parallélisme des directions.'],
            ['Un même vecteur peut-il être représenté à partir de plusieurs points ?', ['Oui, il décrit un déplacement, pas une position', 'Non, il est lié à son origine', 'Oui, seulement dans un repère', 'Non, sauf s’il est nul'], 0, 'D’où l’intérêt de la notion de vecteur égal.'],
            ['Comment démontre-t-on que trois points A, B et C sont alignés à l’aide de vecteurs ?', ['En montrant que AB et AC sont colinéaires', 'En montrant que AB = AC', 'En calculant la norme de BC', 'En vérifiant que AB + AC = 0'], 0, 'Ils partagent le point A, donc la colinéarité donne l’alignement.'],
          ],
        },
        {
          titre: 'Repère et coordonnées de vecteurs',
          axe: 'Géométrie',
          lecon: {
            titre: 'Traduire la géométrie en calculs',
            cours: `Un **repère** transforme des figures en nombres : dès que les points ont des coordonnées, démontrer devient calculer.

## Coordonnées d’un vecteur
Dans un repère du plan, si A a pour coordonnées (xA ; yA) et B (xB ; yB), le vecteur AB a pour coordonnées (xB − xA ; yB − yA). L’ordre compte : on soustrait toujours l’origine à l’extrémité.

## Les formules à connaître
Milieu de [AB] : ((xA + xB)/2 ; (yA + yB)/2). Distance, dans un repère **orthonormé** : AB = √((xB − xA)² + (yB − yA)²), qui n’est rien d’autre que Pythagore. Somme de deux vecteurs : on additionne les coordonnées. Produit par un réel k : on multiplie chaque coordonnée par k.

> Le calcul de distance n’est valable que dans un repère orthonormé. Dans un repère quelconque, la formule est fausse.

## Le critère de colinéarité
Deux vecteurs u (x ; y) et v (x' ; y') sont **colinéaires** si et seulement si leur **déterminant** xy' − yx' est nul. Ce critère unique remplace la recherche d’un coefficient k.

## Ce qu’on démontre avec
Que deux droites sont parallèles, que trois points sont alignés, qu’un quadrilatère est un parallélogramme — en montrant l’égalité de deux vecteurs, ou en vérifiant que les diagonales ont le même milieu. La géométrie repérée offre presque toujours une démonstration purement calculatoire.`,
          },
          questions: [
            ['Quelles sont les coordonnées du vecteur AB si A(1 ; 2) et B(4 ; 7) ?', ['(3 ; 5)', '(5 ; 9)', '(−3 ; −5)', '(4 ; 14)'], 0, 'On soustrait l’origine à l’extrémité.'],
            ['Quelles sont les coordonnées du milieu de [AB] avec A(1 ; 2) et B(5 ; 8) ?', ['(3 ; 5)', '(4 ; 6)', '(2 ; 3)', '(6 ; 10)'], 0, 'On fait la moyenne des abscisses et des ordonnées.'],
            ['Dans quel type de repère la formule de distance est-elle valable ?', ['Un repère orthonormé', 'N’importe quel repère', 'Un repère orthogonal seulement', 'Un repère gradué'], 0, 'Elle repose sur le théorème de Pythagore.'],
            ['Quelle est la distance AB pour A(0 ; 0) et B(3 ; 4) en repère orthonormé ?', ['5', '7', '25', '√7'], 0, '√(9 + 16) = √25.'],
            ['Quel critère caractérise la colinéarité de u(x ; y) et v(x’ ; y’) ?', ['xy’ − yx’ = 0', 'xx’ + yy’ = 0', 'x + y = x’ + y’', 'xy = x’y’'], 0, 'C’est le déterminant des deux vecteurs.'],
            ['Pour additionner deux vecteurs, on additionne leurs coordonnées.', ['Vrai', 'Faux'], 0, 'De même, multiplier par k multiplie chaque coordonnée.'],
            ['Comment démontrer qu’un quadrilatère ABDC est un parallélogramme avec des coordonnées ?', ['En montrant que les vecteurs AB et CD sont égaux', 'En calculant les quatre longueurs', 'En vérifiant que les angles sont droits', 'En calculant l’aire'], 0, 'Ou en vérifiant que les diagonales ont le même milieu.'],
            ['Les vecteurs u(2 ; 6) et v(1 ; 3) sont-ils colinéaires ?', ['Oui, car 2 × 3 − 6 × 1 = 0', 'Non', 'Oui, car leurs normes sont égales', 'On ne peut pas le savoir'], 0, 'u est le double de v.'],
          ],
        },
        {
          titre: 'Équations de droites',
          axe: 'Géométrie',
          lecon: {
            titre: 'Reconnaître une droite à son équation',
            cours: `Toute droite du plan admet une équation, et toute équation de cette forme représente une droite. C’est le pont entre la géométrie et l’algèbre.

## Les deux formes
Une droite **non parallèle à l’axe des ordonnées** admet une équation **réduite** y = mx + p, où m est le **coefficient directeur** et p l’**ordonnée à l’origine**. Une droite parallèle à cet axe a une équation de la forme x = c. La forme **cartésienne** ax + by + c = 0, avec a et b non tous deux nuls, couvre tous les cas.

## Calculer le coefficient directeur
Pour deux points distincts A et B d’abscisses différentes : m = (yB − yA)/(xB − xA). Il mesure la variation de y pour une augmentation de 1 de x. Positif, la droite monte ; négatif, elle descend ; nul, elle est horizontale.

> Deux droites sont parallèles si elles ont le même coefficient directeur. C’est le critère le plus rapide, et le plus souvent oublié.

## Vecteur directeur
Un **vecteur directeur** de la droite d’équation ax + by + c = 0 est le vecteur de coordonnées (−b ; a). Pour la forme réduite y = mx + p, le vecteur (1 ; m) convient : avancer de 1 en abscisse fait monter de m.

## Positions relatives
Deux droites sont **parallèles** si leurs coefficients directeurs sont égaux — ou si leurs vecteurs directeurs sont colinéaires. Sinon, elles sont **sécantes**, et le point d’intersection s’obtient en résolvant le système formé par les deux équations.`,
          },
          questions: [
            ['Que représente m dans l’équation y = mx + p ?', ['Le coefficient directeur', 'L’ordonnée à l’origine', 'L’abscisse à l’origine', 'La pente du vecteur normal'], 0, 'Il mesure la variation de y quand x augmente de 1.'],
            ['Quelle est l’équation d’une droite parallèle à l’axe des ordonnées ?', ['x = c', 'y = c', 'y = mx', 'y = x + c'], 0, 'Elle n’admet pas d’équation réduite.'],
            ['Comment calcule-t-on le coefficient directeur passant par A(1 ; 2) et B(3 ; 8) ?', ['(8 − 2)/(3 − 1) = 3', '(3 − 1)/(8 − 2)', '8/3', '(8 + 2)/(3 + 1)'], 0, 'Variation des ordonnées sur variation des abscisses.'],
            ['Quel est un vecteur directeur de la droite d’équation 2x + 3y − 6 = 0 ?', ['(−3 ; 2)', '(2 ; 3)', '(3 ; 2)', '(6 ; 0)'], 0, 'Pour ax + by + c = 0, le vecteur (−b ; a) convient.'],
            ['Deux droites de coefficients directeurs égaux sont parallèles.', ['Vrai', 'Faux'], 0, 'Confondues si elles ont aussi la même ordonnée à l’origine.'],
            ['Comment trouver le point d’intersection de deux droites sécantes ?', ['En résolvant le système formé par leurs deux équations', 'En comparant leurs coefficients directeurs', 'En calculant la moyenne de leurs ordonnées à l’origine', 'En traçant leur médiatrice'], 0, 'Le couple solution donne les coordonnées du point.'],
            ['Que signifie p dans l’équation y = mx + p ?', ['L’ordonnée du point d’intersection avec l’axe des ordonnées', 'La pente', 'L’abscisse à l’origine', 'La distance à l’origine'], 0, 'C’est la valeur de y quand x vaut 0.'],
            ['Une droite de coefficient directeur négatif est décroissante.', ['Vrai', 'Faux'], 0, 'Quand x augmente, y diminue.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Fonctions
        // ===================================================================
        {
          titre: 'Généralités sur les fonctions',
          axe: 'Fonctions',
          lecon: {
            titre: 'Le vocabulaire qui sert toute l’année',
            cours: `Une **fonction** est un procédé qui, à chaque nombre d’un ensemble de départ, associe **un seul** nombre. Tout le reste du chapitre repose sur cette définition.

## Le vocabulaire
L’**ensemble de définition** est l’ensemble des valeurs de x pour lesquelles f(x) existe : on exclut ce qui annule un dénominateur ou rend négatif l’intérieur d’une racine. f(x) est l’**image** de x ; si f(a) = b, alors a est un **antécédent** de b. Un nombre a au plus une image, mais peut avoir plusieurs antécédents — ou aucun.

## Trois représentations
Une fonction peut être donnée par une **formule**, un **tableau de valeurs**, ou une **courbe**. Un point M(x ; y) appartient à la courbe si et seulement si y = f(x). Lire une image, c’est partir de x sur l’axe des abscisses ; lire un antécédent, c’est partir de y sur l’axe des ordonnées.

> Une courbe qu’une verticale coupe deux fois n’est pas la courbe d’une fonction : un nombre n’a qu’une image.

## Variations
f est **croissante** sur un intervalle si elle conserve l’ordre : lorsque a ≤ b, on a f(a) ≤ f(b). Elle est **décroissante** si elle l’inverse. Le **tableau de variations** résume ce comportement avec des flèches, et fait apparaître les **extremums** — maximum ou minimum, avec la valeur de x où il est atteint.

## Résoudre graphiquement
Résoudre f(x) = k revient à chercher les abscisses des points de la courbe d’ordonnée k. Résoudre f(x) ≥ k revient à repérer les portions de courbe situées au-dessus de la droite horizontale d’équation y = k. Le **tableau de signes** de f indique où la courbe est au-dessus ou au-dessous de l’axe des abscisses.`,
          },
          questions: [
            ['Qu’est-ce qu’une fonction ?', ['Un procédé qui associe à chaque nombre au plus une image', 'Une courbe du plan', 'Une équation à deux inconnues', 'Une suite de nombres'], 0, 'Un antécédent a une image unique.'],
            ['Qu’est-ce que l’ensemble de définition ?', ['L’ensemble des valeurs de x pour lesquelles f(x) existe', 'L’ensemble des images', 'L’ensemble des solutions', 'L’intervalle d’étude choisi'], 0, 'On exclut les valeurs interdites.'],
            ['Si f(3) = 7, que peut-on dire ?', ['7 est l’image de 3, et 3 un antécédent de 7', '3 est l’image de 7', '7 est la solution de f', '3 et 7 sont des antécédents'], 0, 'L’ordre du vocabulaire compte.'],
            ['Un nombre peut-il avoir plusieurs antécédents ?', ['Oui', 'Non, jamais', 'Oui, seulement si la fonction est affine', 'Non, sauf pour la fonction carré'], 0, 'En revanche il n’a qu’une seule image.'],
            ['Que signifie que f est croissante sur un intervalle ?', ['Si a ≤ b alors f(a) ≤ f(b)', 'Si a ≤ b alors f(a) ≥ f(b)', 'f(x) est toujours positive', 'La courbe est au-dessus de l’axe'], 0, 'Elle conserve l’ordre.'],
            ['Une courbe coupée deux fois par une même verticale peut représenter une fonction.', ['Vrai', 'Faux'], 1, 'Ce serait donner deux images au même nombre.'],
            ['Comment résout-on graphiquement f(x) = 3 ?', ['On cherche les abscisses des points de la courbe d’ordonnée 3', 'On cherche l’image de 3', 'On regarde où la courbe coupe l’axe des abscisses', 'On calcule le maximum'], 0, 'On coupe la courbe par la droite y = 3.'],
            ['Que lit-on dans un tableau de signes de f ?', ['Où la courbe est au-dessus ou au-dessous de l’axe des abscisses', 'Les variations de f', 'Les extremums', 'L’ensemble de définition'], 0, 'Le tableau de variations, lui, donne le sens de variation.'],
          ],
        },
        {
          titre: 'La fonction affine',
          axe: 'Fonctions',
          lecon: {
            titre: 'La droite, et le taux d’accroissement constant',
            cours: `Une fonction **affine** est définie sur ℝ par f(x) = ax + b. Sa courbe est une **droite**, et c’est la seule fonction dont l’accroissement est constant.

## Coefficients et courbe
a est le **coefficient directeur**, b l’**ordonnée à l’origine**. Si a > 0, la fonction est croissante ; si a < 0, décroissante ; si a = 0, elle est **constante**. Lorsque b = 0, la fonction est dite **linéaire** et traduit une situation de proportionnalité, sa droite passant par l’origine.

## Le taux d’accroissement
Pour deux valeurs distinctes u et v, (f(v) − f(u))/(v − u) = a, quelle que soit la paire choisie. C’est la propriété caractéristique : une augmentation de 1 de x fait toujours varier f(x) de a.

> Le prix d’un abonnement avec un forfait fixe et un tarif par unité consommée est une fonction affine. C’est le modèle le plus fréquent de la vie courante.

## Déterminer une fonction affine
Connaissant deux points, on calcule a par le taux d’accroissement, puis b en réinjectant les coordonnées d’un point. Deux points suffisent toujours à tracer la droite.

## Signe et résolution
f(x) = 0 pour x = −b/a lorsque a est non nul. Le tableau de signes se déduit du sens de variation : si a > 0, f est négative avant −b/a et positive après ; si a < 0, c’est l’inverse. Cette règle sert dans toutes les inéquations produit ou quotient.`,
          },
          questions: [
            ['Quelle est la forme d’une fonction affine ?', ['f(x) = ax + b', 'f(x) = ax²', 'f(x) = a/x', 'f(x) = √x'], 0, 'Sa courbe est une droite.'],
            ['Quand une fonction affine est-elle croissante ?', ['Lorsque a > 0', 'Lorsque b > 0', 'Lorsque a < 0', 'Lorsque a = 0'], 0, 'Le signe de a donne le sens de variation.'],
            ['Qu’est-ce qu’une fonction linéaire ?', ['Une fonction affine avec b = 0', 'Une fonction affine avec a = 0', 'Une fonction constante', 'Une fonction du second degré'], 0, 'Sa droite passe par l’origine : c’est une proportionnalité.'],
            ['Que vaut le taux d’accroissement d’une fonction affine ?', ['Il est constant et égal à a', 'Il varie selon les points choisis', 'Il vaut b', 'Il vaut a + b'], 0, 'C’est la propriété caractéristique des fonctions affines.'],
            ['Pour quelle valeur f(x) = 2x − 6 s’annule-t-elle ?', ['x = 3', 'x = −3', 'x = 6', 'x = −6'], 0, 'On résout 2x − 6 = 0.'],
            ['Une fonction affine avec a = 0 est constante.', ['Vrai', 'Faux'], 0, 'Sa courbe est une droite horizontale.'],
            ['Combien de points suffisent à tracer la droite d’une fonction affine ?', ['Deux', 'Un', 'Trois', 'Quatre'], 0, 'Deux points distincts déterminent une droite.'],
            ['Quel est le signe de f(x) = −2x + 4 pour x > 2 ?', ['Négatif', 'Positif', 'Nul', 'Variable'], 0, 'a est négatif : f est positive avant 2 et négative après.'],
          ],
        },
        {
          titre: 'La fonction carré',
          axe: 'Fonctions',
          lecon: {
            titre: 'La parabole et son sommet',
            cours: `La fonction **carré** associe à tout réel x le nombre x². Elle est définie sur ℝ tout entier, et sa courbe s’appelle une **parabole**.

## Variations
Elle est **décroissante** sur ]−∞ ; 0] et **croissante** sur [0 ; +∞[. Elle atteint donc un **minimum** égal à 0, en x = 0. Ce point est le **sommet** de la parabole.

## Symétrie et signe
Comme (−x)² = x², la fonction est **paire** : sa courbe est symétrique par rapport à l’axe des ordonnées. Elle est **positive ou nulle** pour tout x : un carré n’est jamais négatif.

> Passer au carré ne conserve pas l’ordre : −3 est plus petit que 2, mais 9 est plus grand que 4. C’est l’erreur la plus fréquente de l’année.

## Résoudre des équations
x² = k n’a **aucune solution** si k < 0, une seule (x = 0) si k = 0, et **deux solutions** √k et −√k si k > 0. Oublier la solution négative est une faute classique. x² = 25 donne donc x = 5 ou x = −5.

## Résoudre des inéquations
x² ≤ 9 équivaut à −3 ≤ x ≤ 3, soit l’intervalle [−3 ; 3]. x² > 9 équivaut à x < −3 ou x > 3, soit la réunion ]−∞ ; −3[ ∪ ]3 ; +∞[. Le tracé de la parabole et de la droite horizontale rend ces résultats immédiats.`,
          },
          questions: [
            ['Sur quel intervalle la fonction carré est-elle décroissante ?', [']−∞ ; 0]', '[0 ; +∞[', 'ℝ tout entier', 'Elle est toujours croissante'], 0, 'Elle atteint son minimum en 0.'],
            ['Quel est le minimum de la fonction carré ?', ['0, atteint en x = 0', '1, atteint en x = 1', 'Elle n’a pas de minimum', '−1, atteint en x = 0'], 0, 'Un carré n’est jamais négatif.'],
            ['Comment s’appelle la courbe de la fonction carré ?', ['Une parabole', 'Une hyperbole', 'Une droite', 'Un cercle'], 0, 'De sommet l’origine du repère.'],
            ['La fonction carré est paire. Que signifie cette propriété ?', ['Sa courbe est symétrique par rapport à l’axe des ordonnées', 'Elle ne prend que des valeurs paires', 'Elle est croissante', 'Elle passe par l’origine'], 0, 'Parce que (−x)² = x².'],
            ['Combien de solutions a l’équation x² = 16 ?', ['Deux : 4 et −4', 'Une : 4', 'Aucune', 'Une infinité'], 0, 'Oublier la solution négative est une faute classique.'],
            ['L’équation x² = −4 admet des solutions réelles.', ['Vrai', 'Faux'], 1, 'Un carré est toujours positif ou nul.'],
            ['Quelle est la solution de x² ≤ 9 ?', ['[−3 ; 3]', ']−∞ ; 3]', '[3 ; +∞[', '[0 ; 3]'], 0, 'La parabole est sous la droite y = 9 entre −3 et 3.'],
            ['Peut-on déduire de a < b que a² < b² ?', ['Non, cela dépend des signes de a et b', 'Oui, toujours', 'Oui, si a et b sont non nuls', 'Non, jamais'], 0, 'La fonction carré ne conserve pas l’ordre sur ℝ.'],
          ],
        },
        {
          titre: 'La fonction cube',
          axe: 'Fonctions',
          lecon: {
            titre: 'Croissante partout, et impaire',
            cours: `La fonction **cube** associe à tout réel x le nombre x³. Elle est définie sur ℝ, et son comportement diffère nettement de celui de la fonction carré.

## Variations
Elle est **croissante sur ℝ tout entier**. Elle n’admet donc ni maximum ni minimum. Contrairement à la fonction carré, elle conserve l’ordre : si a < b, alors a³ < b³, quels que soient les signes.

## Symétrie et signe
Comme (−x)³ = −x³, la fonction est **impaire** : sa courbe est symétrique par rapport à l’**origine** du repère. Son signe est celui de x : négative sur ]−∞ ; 0[, nulle en 0, positive sur ]0 ; +∞[.

> Le cube garde le signe, le carré l’efface. Toute la différence entre les deux fonctions tient dans cette phrase.

## L’équation x³ = k
Elle admet **toujours exactement une solution**, quel que soit le réel k — y compris négatif : x³ = −8 donne x = −2. C’est une différence majeure avec x² = k.

## Comparer les puissances
Sur [0 ; 1], on a x³ ≤ x² ≤ x : élever à une puissance plus grande rapproche de 0. Sur [1 ; +∞[, l’ordre s’inverse : x ≤ x² ≤ x³. Le point de bascule est 1, où les trois valent 1. Ce résultat sert dès qu’on compare des grandeurs modélisées par des puissances, en géométrie comme en physique.`,
          },
          questions: [
            ['Sur quel intervalle la fonction cube est-elle croissante ?', ['Sur ℝ tout entier', 'Sur [0 ; +∞[ seulement', 'Sur ]−∞ ; 0] seulement', 'Elle n’est jamais croissante'], 0, 'Elle conserve l’ordre partout.'],
            ['La fonction cube est impaire. Quelle en est la conséquence graphique ?', ['Sa courbe est symétrique par rapport à l’origine', 'Sa courbe est symétrique par rapport à l’axe des ordonnées', 'Sa courbe est une droite', 'Sa courbe est croissante puis décroissante'], 0, 'Parce que (−x)³ = −x³.'],
            ['Combien de solutions a l’équation x³ = −27 ?', ['Une : −3', 'Aucune', 'Deux : 3 et −3', 'Une infinité'], 0, 'Le cube conserve le signe.'],
            ['Quel est le signe de x³ ?', ['Celui de x', 'Toujours positif', 'Toujours négatif', 'Positif si x est pair'], 0, 'Négatif avant 0, positif après.'],
            ['Comparez x² et x³ pour x compris entre 0 et 1.', ['x³ ≤ x²', 'x³ ≥ x²', 'Ils sont égaux', 'On ne peut pas comparer'], 0, 'Élever à une puissance plus grande rapproche de 0.'],
            ['Pour x supérieur à 1, x³ est plus grand que x².', ['Vrai', 'Faux'], 0, 'L’ordre s’inverse en 1.'],
            ['La fonction cube admet-elle un minimum ?', ['Non, elle est croissante sur ℝ sans borne', 'Oui, en 0', 'Oui, en −1', 'Oui, elle vaut 0'], 0, 'Elle prend toutes les valeurs réelles.'],
            ['Si a < b, que peut-on dire de a³ et b³ ?', ['a³ < b³', 'a³ > b³', 'a³ = b³', 'Cela dépend des signes'], 0, 'Contrairement au carré, le cube conserve l’ordre.'],
          ],
        },
        {
          titre: 'La fonction racine carrée',
          axe: 'Fonctions',
          lecon: {
            titre: 'Définie seulement sur les positifs',
            cours: `La fonction **racine carrée** associe à tout réel positif x le nombre √x, l’unique réel positif dont le carré vaut x. Sa première particularité est son ensemble de définition.

## Ensemble de définition et variations
Elle est définie sur **[0 ; +∞[** seulement : la racine carrée d’un nombre négatif n’existe pas dans ℝ. Elle est **croissante** sur tout cet intervalle, et son minimum vaut 0, atteint en 0. Sa courbe part de l’origine et monte en s’aplatissant, sans jamais s’arrêter.

## Le lien avec la fonction carré
Pour x ≥ 0, (√x)² = x et √(x²) = x. Sur les positifs, les deux fonctions se défont l’une l’autre, et leurs courbes sont symétriques par rapport à la droite d’équation y = x. Attention toutefois : pour tout réel, √(x²) = |x|.

> Une croissance qui ralentit sans jamais s’arrêter : c’est la forme même de la racine carrée, et la raison de son usage en modélisation.

## Comparer avec x
Sur [0 ; 1], on a x ≤ √x : la racine d’un nombre entre 0 et 1 est plus grande que lui. Sur [1 ; +∞[, c’est l’inverse : √x ≤ x. Le point d’égalité est 1 — et aussi 0.

## Résoudre
√x = k n’a de solution que si k ≥ 0, et alors x = k². Une équation contenant une racine se résout en élevant au carré, mais cette opération peut créer des solutions **parasites** : il faut donc toujours vérifier les valeurs trouvées dans l’équation de départ.`,
          },
          questions: [
            ['Quel est l’ensemble de définition de la fonction racine carrée ?', ['[0 ; +∞[', 'ℝ', ']0 ; +∞[', ']−∞ ; 0]'], 0, 'La racine d’un négatif n’existe pas dans ℝ.'],
            ['Comment varie la fonction racine carrée ?', ['Elle est croissante sur tout son ensemble de définition', 'Elle est décroissante', 'Elle décroît puis croît', 'Elle est constante'], 0, 'Son minimum vaut 0, atteint en 0.'],
            ['Que vaut √(x²) pour un réel x quelconque ?', ['|x|', 'x', 'x²', '−x'], 0, 'La racine carrée est toujours positive.'],
            ['Comparez √x et x pour x compris entre 0 et 1.', ['x ≤ √x', 'x ≥ √x', 'Ils sont égaux', 'On ne peut pas comparer'], 0, 'Par exemple √0,25 = 0,5.'],
            ['Quelle est la solution de √x = 5 ?', ['x = 25', 'x = 5', 'x = √5', 'Aucune solution'], 0, 'On élève au carré.'],
            ['Les courbes des fonctions carré et racine carrée sont symétriques par rapport à la droite y = x sur les positifs.', ['Vrai', 'Faux'], 0, 'Les deux fonctions se défont l’une l’autre sur [0 ; +∞[.'],
            ['Pourquoi faut-il vérifier les solutions après avoir élevé au carré ?', ['Parce que cette opération peut créer des solutions parasites', 'Parce que le calcul est trop long', 'Parce que la racine change de signe', 'Parce que l’équation change de degré'], 0, 'Élever au carré n’est pas une opération réversible sur ℝ.'],
            ['L’équation √x = −3 admet-elle une solution ?', ['Non, une racine carrée est toujours positive', 'Oui, x = 9', 'Oui, x = −9', 'Oui, x = 3'], 0, 'Aucun réel positif n’a une racine négative.'],
          ],
        },
        {
          titre: 'La fonction inverse',
          axe: 'Fonctions',
          lecon: {
            titre: 'L’hyperbole, et le trou en zéro',
            cours: `La fonction **inverse** associe à tout réel non nul x le nombre 1/x. Elle est la première fonction de l’année dont l’ensemble de définition est troué.

## Ensemble de définition
Elle est définie sur ℝ privé de 0, que l’on note ]−∞ ; 0[ ∪ ]0 ; +∞[. Diviser par zéro n’a pas de sens : 0 est une **valeur interdite**.

## Variations
Elle est **décroissante sur ]−∞ ; 0[** et **décroissante sur ]0 ; +∞[** — deux intervalles séparés, et surtout **pas** décroissante sur la réunion des deux. C’est un point de vigilance permanent : −1 est plus petit que 1, mais 1/(−1) = −1 est plus petit que 1/1 = 1.

> On ne dit jamais qu’une fonction est décroissante sur une réunion d’intervalles. On énonce ses variations intervalle par intervalle.

## Courbe et symétrie
Sa courbe est une **hyperbole**, formée de deux branches. La fonction est **impaire**, donc la courbe est symétrique par rapport à l’origine. Les axes du repère sont des **asymptotes** : quand x devient très grand, 1/x se rapproche de 0 sans jamais l’atteindre ; quand x se rapproche de 0, |1/x| devient arbitrairement grand.

## Signe et résolution
1/x a le signe de x. L’équation 1/x = k admet, pour k non nul, l’unique solution x = 1/k, et aucune solution si k = 0. Pour une inéquation comme 1/x ≤ 2, on ne multiplie surtout pas par x sans connaître son signe : on passe tout d’un côté et on étudie un **tableau de signes**.`,
          },
          questions: [
            ['Quel est l’ensemble de définition de la fonction inverse ?', ['ℝ privé de 0', 'ℝ', '[0 ; +∞[', ']0 ; +∞['], 0, 'Diviser par zéro n’a pas de sens.'],
            ['Comment varie la fonction inverse ?', ['Elle est décroissante sur chacun des deux intervalles séparément', 'Elle est décroissante sur ℝ privé de 0', 'Elle est croissante sur ℝ', 'Elle croît puis décroît'], 0, 'On n’énonce jamais de variation sur une réunion d’intervalles.'],
            ['Comment s’appelle la courbe de la fonction inverse ?', ['Une hyperbole', 'Une parabole', 'Une droite', 'Une sinusoïde'], 0, 'Elle est formée de deux branches.'],
            ['La fonction inverse est impaire. Quelle en est la conséquence ?', ['Sa courbe est symétrique par rapport à l’origine', 'Sa courbe est symétrique par rapport à l’axe des ordonnées', 'Elle est croissante', 'Elle est positive'], 0, 'Car 1/(−x) = −1/x.'],
            ['Que devient 1/x quand x devient très grand ?', ['Il se rapproche de 0 sans l’atteindre', 'Il devient très grand', 'Il devient négatif', 'Il vaut 1'], 0, 'L’axe des abscisses est une asymptote.'],
            ['Le signe de 1/x est celui de x.', ['Vrai', 'Faux'], 0, 'Négatif avant 0, positif après.'],
            ['Quelle est la solution de 1/x = 4 ?', ['x = 0,25', 'x = 4', 'x = −4', 'Aucune solution'], 0, 'x = 1/k.'],
            ['Peut-on multiplier les deux membres de 1/x ≤ 2 par x ?', ['Non, pas sans connaître le signe de x', 'Oui, toujours', 'Oui, si x est non nul', 'Oui, en inversant le sens'], 0, 'Il faut passer par un tableau de signes.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : Statistiques et probabilités
        // ===================================================================
        {
          titre: 'Information chiffrée',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Proportions, pourcentages et évolutions',
            cours: `Une part importante des erreurs de raisonnement vient d’un mauvais maniement des pourcentages. Ce chapitre fixe les règles.

## Proportion et pourcentage
Une **proportion** est un quotient d’un effectif partiel par un effectif total, compris entre 0 et 1 ; multiplié par 100, il devient un **pourcentage**. Prendre t % d’une quantité, c’est la multiplier par t/100.

## Proportion de proportion
La proportion d’une sous-population dans le tout est le **produit** des proportions successives : si 40 % des élèves sont en seconde et que 25 % d’entre eux font de l’allemand, alors 0,40 × 0,25 = 0,10, soit 10 % de l’ensemble.

## Le coefficient multiplicateur
Augmenter de t % revient à multiplier par (1 + t/100) ; diminuer de t % revient à multiplier par (1 − t/100). Ce **coefficient multiplicateur** est l’outil central : il permet d’enchaîner les évolutions en multipliant les coefficients, et de revenir en arrière en divisant.

> Une hausse de 20 % suivie d’une baisse de 20 % ne ramène pas au point de départ : 1,20 × 0,80 = 0,96, soit une baisse de 4 %.

## Évolutions successives et réciproques
Le coefficient global est le **produit** des coefficients, jamais la somme des pourcentages. L’évolution **réciproque** s’obtient avec l’inverse du coefficient : après une hausse de 25 %, il faut baisser de 20 % pour revenir au départ, car 1/1,25 = 0,80.

## Points et pourcentages
Passer de 10 % à 12 %, c’est une hausse de **2 points**, mais de **20 %**. Confondre les deux est l’erreur la plus répandue dans les commentaires de chiffres publics.`,
          },
          questions: [
            ['Comment calcule-t-on t % d’une quantité ?', ['En la multipliant par t/100', 'En la divisant par t', 'En lui ajoutant t', 'En la multipliant par t'], 0, 'Un pourcentage est une proportion multipliée par 100.'],
            ['Par quel coefficient multiplie-t-on pour une hausse de 15 % ?', ['1,15', '0,85', '15', '1,015'], 0, '1 + 15/100.'],
            ['Par quel coefficient multiplie-t-on pour une baisse de 30 % ?', ['0,70', '1,30', '0,30', '−0,30'], 0, '1 − 30/100.'],
            ['Une hausse de 20 % suivie d’une baisse de 20 % ramène-t-elle au point de départ ?', ['Non, il reste une baisse de 4 %', 'Oui', 'Non, il reste une hausse de 4 %', 'Cela dépend de la valeur initiale'], 0, '1,20 × 0,80 = 0,96.'],
            ['Comment obtient-on le coefficient d’une évolution réciproque ?', ['En prenant l’inverse du coefficient', 'En changeant le signe du pourcentage', 'En soustrayant le coefficient de 2', 'En le divisant par 100'], 0, 'Après +25 %, il faut −20 % pour revenir au départ.'],
            ['Passer de 10 % à 12 % est une hausse de 2 points et de 20 %.', ['Vrai', 'Faux'], 0, 'Confondre points et pourcentages est l’erreur la plus répandue.'],
            ['40 % des élèves sont en seconde, et 25 % d’entre eux font de l’allemand. Quelle proportion de l’ensemble cela représente-t-il ?', ['10 %', '65 %', '15 %', '25 %'], 0, 'On multiplie les proportions : 0,40 × 0,25.'],
            ['Comment calcule-t-on le coefficient de deux évolutions successives ?', ['En multipliant les deux coefficients', 'En additionnant les pourcentages', 'En prenant la moyenne', 'En soustrayant les pourcentages'], 0, 'Les pourcentages ne s’additionnent pas.'],
          ],
        },
        {
          titre: 'Statistique descriptive',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Résumer une série sans la trahir',
            cours: `Décrire une série statistique, c’est répondre à deux questions : autour de quelle valeur se situent les données, et à quel point sont-elles dispersées ?

## Les indicateurs de position
La **moyenne** est la somme des valeurs divisée par leur nombre ; en présence d’effectifs, on calcule une moyenne **pondérée**. La **médiane** partage la série ordonnée en deux moitiés de même effectif. La moyenne est sensible aux **valeurs extrêmes**, la médiane ne l’est pas — c’est pourquoi on publie le salaire médian plutôt que le salaire moyen.

## Les indicateurs de dispersion
L’**étendue** est l’écart entre la plus grande et la plus petite valeur. Les **quartiles** Q1 et Q3 partagent la série ordonnée en quatre groupes d’effectifs égaux ; l’**écart interquartile** Q3 − Q1 mesure la dispersion du cœur de la série. L’**écart type** mesure la dispersion autour de la moyenne : plus il est grand, plus les valeurs sont éloignées d’elle.

> Deux séries peuvent avoir la même moyenne et n’avoir rien à voir. C’est la dispersion qui les distingue.

## Les représentations
Diagramme en bâtons pour des données discrètes, histogramme pour des classes, **diagramme en boîte** pour visualiser minimum, Q1, médiane, Q3 et maximum d’un seul coup d’œil. Le choix de la représentation, comme celui des échelles, oriente la lecture.

## Lire de façon critique
Un axe tronqué exagère une variation, une moyenne cache une bimodalité, un effectif faible rend tout écart peu significatif, et une moyenne de moyennes est presque toujours fausse. Interpréter suppose de connaître l’effectif, la source et la définition exacte de ce qui est mesuré.`,
          },
          questions: [
            ['Que partage la médiane ?', ['La série ordonnée en deux moitiés de même effectif', 'La série en quatre groupes égaux', 'La somme des valeurs', 'L’étendue en deux'], 0, 'Elle est peu sensible aux valeurs extrêmes.'],
            ['Pourquoi publie-t-on souvent le salaire médian plutôt que le salaire moyen ?', ['Parce que la moyenne est tirée vers le haut par les très hauts salaires', 'Parce qu’il est plus facile à calculer', 'Parce que la médiane est toujours plus grande', 'Parce que la moyenne est interdite'], 0, 'La médiane résiste aux valeurs extrêmes.'],
            ['Qu’est-ce que l’écart interquartile ?', ['La différence Q3 − Q1', 'La différence entre le maximum et le minimum', 'L’écart à la moyenne', 'La moitié de l’étendue'], 0, 'Il mesure la dispersion du cœur de la série.'],
            ['Que mesure l’écart type ?', ['La dispersion des valeurs autour de la moyenne', 'La valeur centrale', 'L’étendue de la série', 'Le nombre de valeurs'], 0, 'Plus il est grand, plus les valeurs sont dispersées.'],
            ['Que représente Q1 ?', ['La valeur telle qu’au moins un quart des données lui sont inférieures ou égales', 'La plus petite valeur', 'La moyenne du premier quart', 'La médiane de la série'], 0, 'Q1, médiane et Q3 découpent la série en quatre.'],
            ['Deux séries de même moyenne peuvent être très différentes.', ['Vrai', 'Faux'], 0, 'La dispersion peut être radicalement différente.'],
            ['Quel graphique résume minimum, quartiles, médiane et maximum ?', ['Le diagramme en boîte', 'L’histogramme', 'Le diagramme circulaire', 'La courbe des fréquences cumulées'], 0, 'Il permet de comparer plusieurs séries d’un coup d’œil.'],
            ['Quel procédé graphique exagère visuellement une variation ?', ['Un axe des ordonnées tronqué', 'Un axe gradué de 0 à 100', 'Un diagramme en boîte', 'Un effectif élevé'], 0, 'La lecture critique commence par l’examen des échelles.'],
          ],
        },
        {
          titre: 'Probabilités : vocabulaire et outils',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Modéliser le hasard',
            cours: `Une **expérience aléatoire** est une expérience dont on connaît tous les résultats possibles sans pouvoir prévoir lequel se produira. Les probabilités en donnent un modèle chiffré.

## Le vocabulaire
L’**univers** Ω est l’ensemble des issues possibles. Un **événement** est une partie de l’univers. L’événement **certain** est Ω, l’événement **impossible** est l’ensemble vide. Deux événements sont **incompatibles** s’ils ne peuvent pas se produire en même temps.

## La loi de probabilité
Attribuer une probabilité à chaque issue, positive et de somme égale à 1. La probabilité d’un événement est la somme des probabilités des issues qui le composent. En situation d’**équiprobabilité**, P(A) est le nombre d’issues favorables divisé par le nombre d’issues possibles.

> Une probabilité est un nombre entre 0 et 1. Toute réponse en dehors de cet intervalle signale une erreur, sans même avoir à relire le calcul.

## Les formules
P(A barre) = 1 − P(A), où A barre est l’événement **contraire** : c’est souvent le chemin le plus court, notamment pour un événement du type au moins un. Et P(A ∪ B) = P(A) + P(B) − P(A ∩ B), la soustraction évitant de compter deux fois l’intersection ; si A et B sont incompatibles, elle disparaît.

## Compter les issues
Un **arbre de probabilités** ou un **tableau à double entrée** organise le dénombrement pour une expérience à deux épreuves. Sur un arbre, on multiplie le long d’un chemin et on additionne les chemins qui réalisent l’événement cherché.`,
          },
          questions: [
            ['Qu’est-ce que l’univers d’une expérience aléatoire ?', ['L’ensemble de toutes les issues possibles', 'L’ensemble des événements favorables', 'La probabilité totale', 'Le nombre d’expériences réalisées'], 0, 'On le note souvent Ω.'],
            ['Entre quelles valeurs une probabilité est-elle comprise ?', ['Entre 0 et 1', 'Entre −1 et 1', 'Entre 0 et 100', 'Entre 1 et 10'], 0, 'Toute autre valeur signale une erreur de calcul.'],
            ['Comment calcule-t-on P(A) en situation d’équiprobabilité ?', ['Nombre d’issues favorables divisé par nombre d’issues possibles', 'Somme des issues favorables', 'Nombre d’issues possibles divisé par les favorables', '1 divisé par le nombre d’événements'], 0, 'À condition que toutes les issues soient également probables.'],
            ['Que vaut la probabilité de l’événement contraire de A ?', ['1 − P(A)', 'P(A) − 1', '1/P(A)', '−P(A)'], 0, 'Très utile pour les événements du type au moins un.'],
            ['Que vaut P(A ∪ B) ?', ['P(A) + P(B) − P(A ∩ B)', 'P(A) + P(B)', 'P(A) × P(B)', 'P(A) − P(B)'], 0, 'On retranche l’intersection comptée deux fois.'],
            ['Deux événements incompatibles ne peuvent pas se produire en même temps.', ['Vrai', 'Faux'], 0, 'Leur intersection est vide, donc P(A ∪ B) = P(A) + P(B).'],
            ['Sur un arbre de probabilités, que fait-on le long d’un chemin ?', ['On multiplie les probabilités', 'On les additionne', 'On les soustrait', 'On prend la plus grande'], 0, 'On additionne ensuite les chemins qui réalisent l’événement.'],
            ['Quelle est la probabilité d’obtenir un nombre pair avec un dé équilibré à six faces ?', ['1/2', '1/3', '1/6', '2/3'], 0, 'Trois issues favorables sur six.'],
          ],
        },
        {
          titre: 'Échantillonnage',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Ce qu’un échantillon peut dire, et ce qu’il ne peut pas',
            cours: `On ne peut presque jamais interroger toute une population. On observe un **échantillon**, et l’on accepte que le résultat **fluctue** d’un échantillon à l’autre.

## Le vocabulaire
Un **échantillon** de taille n est le résultat de n répétitions indépendantes de la même expérience. La **fréquence observée** f est la proportion du caractère étudié dans l’échantillon ; la **proportion** p est la valeur, inconnue, dans la population entière.

## La fluctuation d’échantillonnage
Deux échantillons de même taille tirés de la même population ne donnent pas la même fréquence. Cette variation n’est pas une erreur de mesure : elle est inhérente au tirage. Elle **diminue** quand la taille de l’échantillon augmente.

> Un sondage sur mille personnes n’est pas mille fois moins fiable qu’un recensement : il l’est environ trente fois moins, parce que la précision dépend de la racine de n.

## L’intervalle de fluctuation
Pour n assez grand et p pas trop proche de 0 ou de 1, environ 95 % des échantillons donnent une fréquence comprise dans l’intervalle [p − 1/√n ; p + 1/√n]. Sa **largeur** est donc en 1/√n : pour diviser l’incertitude par deux, il faut multiplier la taille de l’échantillon par quatre.

## À quoi cela sert
Décider si une observation est compatible avec une hypothèse : si la fréquence observée tombe hors de l’intervalle de fluctuation, on rejette l’hypothèse au seuil de 95 % ; sinon, on ne la rejette pas — ce qui n’est pas la même chose que la démontrer. C’est aussi ce qui justifie la **marge d’erreur** annoncée avec tout sondage, et l’importance du mode de recrutement : un échantillon mal constitué reste biaisé, quelle que soit sa taille.`,
          },
          questions: [
            ['Qu’est-ce qu’un échantillon de taille n ?', ['Le résultat de n répétitions indépendantes de la même expérience', 'Les n premiers individus d’une liste', 'Une population de taille n', 'Un tirage sans remise de n éléments'], 0, 'L’indépendance des tirages est essentielle.'],
            ['Qu’est-ce que la fluctuation d’échantillonnage ?', ['La variation de la fréquence observée d’un échantillon à l’autre', 'Une erreur de mesure', 'Un biais de recrutement', 'Une variation de la population'], 0, 'Elle est inhérente au tirage aléatoire.'],
            ['Que devient la fluctuation quand la taille de l’échantillon augmente ?', ['Elle diminue', 'Elle augmente', 'Elle reste constante', 'Elle devient nulle'], 0, 'La précision croît comme la racine de n.'],
            ['Quel est l’intervalle de fluctuation au seuil de 95 % pour une proportion p ?', ['[p − 1/√n ; p + 1/√n]', '[p − 1/n ; p + 1/n]', '[p − √n ; p + √n]', '[p − 0,05 ; p + 0,05]'], 0, 'Valable pour n assez grand et p pas trop extrême.'],
            ['Par combien faut-il multiplier n pour diviser l’incertitude par deux ?', ['Par quatre', 'Par deux', 'Par huit', 'Par seize'], 0, 'Parce que la largeur est en 1/√n.'],
            ['Une fréquence observée hors de l’intervalle de fluctuation conduit à rejeter l’hypothèse au seuil de 95 %.', ['Vrai', 'Faux'], 0, 'Rester dedans ne démontre pas l’hypothèse pour autant.'],
            ['Un échantillon très grand mais mal recruté est-il fiable ?', ['Non, un biais de recrutement ne se corrige pas par la taille', 'Oui, la taille compense tout', 'Oui, au-delà de 10 000 individus', 'Cela dépend de la population'], 0, 'La représentativité prime sur la taille.'],
            ['Quel est l’intervalle de fluctuation pour p = 0,5 et n = 100 ?', ['[0,4 ; 0,6]', '[0,45 ; 0,55]', '[0,3 ; 0,7]', '[0,49 ; 0,51]'], 0, '1/√100 = 0,1.'],
          ],
        },
      ],
    },
  ],
}
