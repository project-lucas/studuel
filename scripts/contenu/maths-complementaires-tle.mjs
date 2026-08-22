// MATHS COMPLÉMENTAIRES TERMINALE (option) — les 11 fiches du programme
// officiel, dans l'ordre de ses 2 chapitres : « Analyse » (8) et
// « Probabilités et statistique » (3).
//
// ⚠️ SECOND MODULE DU SLUG `maths-complementaires`. Le premier,
// `maths-complementaires.mjs`, part dans la migration 219, DÉJÀ EXÉCUTÉE, qui
// ne doit plus jamais être régénérée — d'où la génération par `--modules` et
// non par `--slugs` (cf. le README). C'est la même configuration que
// `allemand.mjs` / `allemand-tle.mjs`.
//
// MATIÈRE À PART, ET NON UN CHAPITRE DE `maths`. La maquette de référence range
// ces deux chapitres dans le dossier « Maths Tle », sous des titres préfixés
// « Option mathématiques complémentaires : … ». L'app a une matière
// `maths-complementaires` depuis l'origine, cochable séparément dans « Ma
// classe » : les fiches y restent, et le préfixe disparaît.
//
// ⚠️ CINQ TITRES DE FICHES SONT HOMONYMES de fiches de la SPÉCIALITÉ (« Limites
// de fonctions », « Fonctions convexes », « Primitives et équations
// différentielles », « Fonction logarithme népérien (ln) », « Continuité de
// fonctions »). Ce n'est PAS une collision : la contrainte d'unicité de
// `chapters` porte sur (subject_id, level, title), et les deux matières ont des
// subject_id différents. Les contenus diffèrent d'ailleurs : les mathématiques
// complémentaires traitent ces notions sans la technicité de la spécialité, et
// en insistant sur la modélisation.

export default {
  slug: 'maths-complementaires',
  nom: 'Maths complémentaires',

  menage: [
    {
      raison: `Les 4 fiches composites de MATHS COMPLÉMENTAIRES partent, au niveau Tle.
Elles viennent de la migration 219 et résument chacune un pan du programme en une
fiche, que les 11 fiches neuves recouvrent : « Suites et modèles d'évolution » se
lit désormais en « Suites numériques, modèles discrets et limites », « Fonctions,
dérivées et optimisation » en « Compléments sur la dérivation » et « Fonctions
convexes », « Probabilités conditionnelles » et « Statistiques et
échantillonnage » en les trois fiches du chapitre 2.
⚠️ LE TITRE « Suites et modèles d'évolution » EST ÉCRIT AVEC L'APOSTROPHE
TYPOGRAPHIQUE (U+2019), celle que porte la 219, donc la base. Écrit avec
l'apostrophe droite (et son doublement SQL), le DELETE ne trouverait rien et la
fiche survivrait, sans que la migration signale quoi que ce soit — c'est
exactement le piège rencontré sur la 249.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
les chapitres, dont les leçons partent en cascade.
⚠️ LA MIGRATION 219 EST UN FICHIER GÉNÉRÉ, donc parfaitement rejouable : la
recoller un jour ferait revenir les 4 fiches composites en doublon des 11 fiches
du programme.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths-complementaires'
   AND c.level = 'Tle'
   AND c.title IN ('Suites et modèles d’évolution',
                   'Fonctions, dérivées et optimisation',
                   'Probabilités conditionnelles',
                   'Statistiques et échantillonnage');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'maths-complementaires'
   AND c.level = 'Tle'
   AND c.title IN ('Suites et modèles d’évolution',
                   'Fonctions, dérivées et optimisation',
                   'Probabilités conditionnelles',
                   'Statistiques et échantillonnage');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'maths-complementaires'
   AND c.level = 'Tle'
   AND c.title IN ('Suites et modèles d’évolution',
                   'Fonctions, dérivées et optimisation',
                   'Probabilités conditionnelles',
                   'Statistiques et échantillonnage');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Analyse --------------------------------------------
        {
          titre: 'Suites numériques, modèles discrets et limites',
          axe: 'Analyse',
          lecon: {
            titre: 'Modéliser une évolution pas à pas',
            cours: `En mathématiques complémentaires, une suite n’est jamais un objet abstrait : c’est le modèle d’une **grandeur qui évolue par étapes** — une population, un capital, une concentration.

## Les deux modes de définition
- **explicite** : u(n) est donné directement en fonction de n. On calcule n’importe quel terme sans les précédents ;
- **par récurrence** : u(n+1) est donné en fonction de u(n), avec un premier terme. Il faut calculer de proche en proche, mais c’est ce mode qui traduit naturellement une évolution.

## Les deux modèles de référence
- **suite arithmétique** : u(n+1) = u(n) + r. Évolution par **ajout constant**. Terme général : u(n) = u(0) + n r. Croissance **linéaire** ;
- **suite géométrique** : u(n+1) = q × u(n). Évolution par **multiplication constante**. Terme général : u(n) = u(0) × qⁿ. Croissance **exponentielle**.

Le repère à avoir : une augmentation de **t %** correspond à une suite géométrique de raison **q = 1 + t/100**. Deux hausses successives de 10 % ne font pas 20 %, mais 21 % — car 1,1 × 1,1 = 1,21.

## Le modèle arithmético-géométrique
C’est le plus utile en modélisation : **u(n+1) = a u(n) + b**. Il décrit toute évolution combinant un taux (a) et un apport ou un prélèvement fixe (b) : un capital qui rapporte des intérêts et reçoit un versement annuel, une population qui croît et subit une émigration constante.

Méthode de résolution, systématiquement attendue :
1. chercher le **point fixe** c, solution de c = a c + b, soit c = b/(1−a) pour a ≠ 1 ;
2. poser v(n) = u(n) − c : la suite v est **géométrique** de raison a ;
3. conclure : u(n) = (u(0) − c) × aⁿ + c.

## Les limites
- **suite géométrique** : qⁿ tend vers 0 si −1 < q < 1, vers +∞ si q > 1 ; il n’y a pas de limite si q ≤ −1 ;
- **suite arithmétique** : elle diverge vers +∞ ou −∞ selon le signe de r (sauf si r = 0) ;
- **arithmético-géométrique** : si |a| < 1, la suite converge vers le **point fixe c**, quelle que soit sa valeur initiale. C’est l’interprétation la plus demandée : le système s’installe dans un état d’équilibre.

## Le théorème de la limite monotone
Une suite **croissante et majorée** converge ; une suite **décroissante et minorée** converge. Il garantit l’existence de la limite, pas sa valeur.

## Le seuil
« À partir de quel rang la population dépasse-t-elle 10 000 ? » se résout par le **logarithme** quand la suite est géométrique, ou par un **algorithme de seuil** — une boucle qui incrémente tant que la condition n’est pas atteinte. Les deux méthodes sont au programme, et l’algorithme est souvent la seule possible.

> Devant un énoncé, la première question est toujours : l’évolution ajoute-t-elle une quantité fixe, la multiplie-t-elle par un taux, ou les deux ? La réponse désigne le modèle.`,
          },
          questions: [
            ['Quelle suite modélise une augmentation de t % à chaque étape ?', ['Une suite géométrique de raison 1 + t/100', 'Une suite arithmétique de raison t', 'Une suite arithmético-géométrique', 'Une suite constante'], 0, 'Deux hausses de 10 % donnent 21 %, et non 20 %.'],
            ['Comment résout-on u(n+1) = a u(n) + b ?', ['On cherche le point fixe c, puis on pose v(n) = u(n) − c', 'On divise par b', 'On dérive la relation', 'On applique directement la formule géométrique'], 0, 'La suite v obtenue est géométrique de raison a.'],
            ['Que vaut le point fixe de u(n+1) = a u(n) + b, pour a ≠ 1 ?', ['b/(1 − a)', 'b/a', 'a/b', 'a + b'], 0, 'C’est la solution de c = a c + b.'],
            ['Vers quoi converge une suite arithmético-géométrique quand |a| < 1 ?', ['Vers le point fixe, quelle que soit la valeur initiale', 'Vers 0', 'Vers b', 'Elle diverge'], 0, 'Le système s’installe dans un état d’équilibre.'],
            ['Quelle est la limite de qⁿ pour q > 1 ?', ['+∞', '0', '1', 'Elle n’existe pas'], 0, 'Pour −1 < q < 1, la limite vaut 0.'],
            ['Une suite croissante et majorée converge.', ['Vrai', 'Faux'], 0, 'Le théorème garantit l’existence de la limite, mais pas sa valeur.'],
            ['Quel outil permet de résoudre une question de seuil sur une suite géométrique ?', ['Le logarithme, ou un algorithme de seuil', 'La dérivée', 'Le théorème des gendarmes', 'Une intégrale'], 0, 'L’algorithme est souvent la seule méthode possible sur un modèle complexe.'],
            ['Une suite définie par récurrence permet de calculer directement n’importe quel terme.', ['Vrai', 'Faux'], 1, 'Il faut passer par tous les précédents ; seule la forme explicite le permet.'],
          ],
        },
        {
          titre: 'Limites de fonctions',
          axe: 'Analyse',
          lecon: {
            titre: 'Le comportement d’un modèle sur le long terme',
            cours: `En mathématiques complémentaires, la limite répond à une question de modélisation : **que devient la grandeur quand le temps s’allonge**, ou quand une variable s’approche d’une valeur critique ?

## Les deux situations
- **limite en +∞** : le comportement à long terme. C’est de loin la plus fréquente en modélisation ;
- **limite en un réel a** : le comportement au voisinage d’une valeur où la fonction n’est pas définie — un dénominateur qui s’annule, par exemple.

## Les limites de référence
En +∞ : x, x², x³ et √x tendent vers +∞ ; 1/x, 1/x² tendent vers 0 ; e^x tend vers +∞ et e^(−x) vers 0 ; ln(x) tend vers +∞.
En 0 (par valeurs positives) : 1/x tend vers +∞, ln(x) tend vers −∞.

## Les opérations et les indéterminations
Les limites d’une somme, d’un produit ou d’un quotient se déduisent de celles des termes — **sauf** dans les quatre cas indéterminés : ∞ − ∞, 0 × ∞, ∞/∞ et 0/0.

Une forme indéterminée n’est pas une absence de limite : c’est un signal qu’il faut **transformer l’écriture**. La technique principale au programme : **factoriser par le terme dominant**. En +∞, un polynôme se comporte comme son terme de plus haut degré, une fraction rationnelle comme le quotient de ses termes de plus haut degré.

## Les croissances comparées
Les deux résultats à connaître, et qui lèvent presque toutes les indéterminations du programme :
- **e^x l’emporte sur toute puissance de x** : e^x/x^n tend vers +∞ ;
- **toute puissance de x l’emporte sur ln(x)** : ln(x)/x tend vers 0.

Traduction concrète : une croissance exponentielle finit toujours par dépasser une croissance polynomiale, aussi élevé que soit le degré. C’est ce qui rend les modèles exponentiels si redoutables — le décrochage arrive tard, puis très vite.

## Les asymptotes
- **asymptote horizontale** y = ℓ si f(x) tend vers ℓ en ±∞. Elle s’interprète comme un **niveau de saturation** : la population plafonne, la température se stabilise, la concentration atteint sa valeur d’équilibre ;
- **asymptote verticale** x = a si f(x) tend vers ±∞ quand x tend vers a. Elle marque une **valeur interdite** du modèle.

## Le lien avec le modèle
Une limite n’est pas qu’un calcul : c’est une **conclusion sur le phénomène**. Un énoncé de mathématiques complémentaires demande presque toujours d’interpréter le résultat en français — « la population se stabilise autour de 12 000 individus » vaut autant de points que le calcul lui-même.

> Réflexes : en +∞, factoriser par le terme dominant ; devant une exponentielle ou un logarithme, penser croissances comparées ; et toujours conclure par une phrase sur le modèle.`,
          },
          questions: [
            ['Quelles sont les quatre formes indéterminées ?', ['∞ − ∞, 0 × ∞, ∞/∞ et 0/0', '1/0 et 0/1', '∞ + ∞ et 0 − 0', '1^∞ uniquement'], 0, 'Elles signalent qu’il faut transformer l’écriture.'],
            ['Que vaut la limite de e^x/x^n en +∞ ?', ['+∞', '0', '1', 'Elle dépend de n'], 0, 'L’exponentielle l’emporte sur toute puissance, quel que soit le degré.'],
            ['Que vaut la limite de ln(x)/x en +∞ ?', ['0', '+∞', '1', 'Elle n’existe pas'], 0, 'La puissance l’emporte sur le logarithme.'],
            ['Comment interprète-t-on une asymptote horizontale dans un modèle ?', ['Comme un niveau de saturation ou de stabilisation', 'Comme une valeur interdite', 'Comme un maximum atteint', 'Comme une erreur de modèle'], 0, 'La population plafonne, la température se stabilise.'],
            ['Quelle technique lève une indétermination du type ∞/∞ pour une fraction rationnelle ?', ['Factoriser par le terme de plus haut degré', 'Dériver numérateur et dénominateur', 'Appliquer le théorème des gendarmes', 'Passer au logarithme'], 0, 'La limite est celle du quotient des termes dominants.'],
            ['Que marque une asymptote verticale d’équation x = a ?', ['Une valeur interdite du modèle', 'Un niveau de saturation', 'Un maximum du modèle', 'Un point d’inflexion'], 0, 'La fonction y tend vers l’infini.'],
            ['Une croissance exponentielle finit-elle toujours par dépasser une croissance polynomiale ?', ['Oui, quel que soit le degré du polynôme', 'Non, si le degré est supérieur à 10', 'Non, jamais', 'Seulement si la base est supérieure à 2'], 0, 'Le décrochage arrive tard, puis très vite.'],
            ['Dans un exercice de modélisation, le calcul de la limite suffit à répondre.', ['Vrai', 'Faux'], 1, 'L’interprétation en français est attendue, et vaut autant de points.'],
          ],
        },
        {
          titre: 'Continuité de fonctions',
          axe: 'Analyse',
          lecon: {
            titre: 'Ce qui permet d’affirmer qu’une valeur est atteinte',
            cours: `La continuité sert ici à un usage précis : garantir qu’un modèle **atteint** une valeur donnée, et permettre d’en chercher le moment.

## La définition
f est **continue en a** si sa limite en a existe et vaut **f(a)**. Elle est continue sur un intervalle si elle l’est en chacun de ses points. Intuitivement : la courbe se trace sans lever le crayon.

## Ce qui est continu
Toutes les fonctions du programme sont continues sur leur ensemble de définition : polynômes, fonctions rationnelles, racine carrée, exponentielle, logarithme. Sommes, produits, quotients (là où le dénominateur ne s’annule pas) et composées de fonctions continues le sont aussi.

Une fonction **dérivable** est **continue** — la réciproque est fausse.

## Ce qui est discontinu dans un modèle
Une grandeur qui varie **par paliers** n’est pas continue : un tarif postal par tranche de poids, un nombre d’individus, un impôt par tranche au moment du seuil. Reconnaître qu’un modèle est **discret** et non continu fait partie de la lecture d’un énoncé — et interdit d’appliquer les théorèmes ci-dessous.

## Le théorème des valeurs intermédiaires
Si f est **continue** sur [a ; b], alors pour tout réel k compris entre f(a) et f(b), l’équation f(x) = k admet **au moins une solution** dans [a ; b].

Interprétation : une grandeur qui varie continûment de 12 à 40 **prend nécessairement** toutes les valeurs intermédiaires. Elle passe forcément par 25.

## Le cas strictement monotone
Si f est de plus **strictement monotone** sur [a ; b], la solution est **unique**. C’est ce qui permet de parler du « moment où » la grandeur atteint un seuil — au singulier.

La rédaction attendue comporte trois éléments, chacun noté : la continuité, la stricte monotonie, et l’encadrement de k entre les valeurs aux bornes.

## La recherche de la solution
Le théorème prouve l’existence **sans donner la valeur**. Pour l’approcher, deux outils au programme :
- le **balayage** : évaluer la fonction de proche en proche avec un pas décroissant ;
- la **dichotomie** : couper l’intervalle en deux et garder la moitié où le changement de signe se produit. Chaque étape divise la précision par deux.

Ces deux méthodes s’écrivent en algorithme, ce que l’épreuve demande régulièrement.

## L’usage typique
« À partir de quelle année la production dépasse-t-elle 500 tonnes ? » : on montre la continuité et la stricte croissance sur l’intervalle, on encadre 500 entre les valeurs aux bornes, on conclut à l’existence et à l’unicité, puis on cherche une valeur approchée à la calculatrice.

> Le théorème donne l’existence, la monotonie l’unicité, l’algorithme la valeur. Trois étapes distinctes, qu’une bonne copie ne mélange jamais.`,
          },
          questions: [
            ['Quand une fonction est-elle continue en a ?', ['Quand sa limite en a existe et vaut f(a)', 'Quand elle est définie en a', 'Quand elle est croissante', 'Quand elle est dérivable ailleurs'], 0, 'Intuitivement, la courbe se trace sans lever le crayon.'],
            ['Que garantit le théorème des valeurs intermédiaires ?', ['L’existence d’au moins une solution à f(x) = k', 'L’unicité de la solution', 'La valeur exacte de la solution', 'La dérivabilité de la fonction'], 0, 'Une grandeur variant continûment prend toutes les valeurs intermédiaires.'],
            ['Quelle hypothèse ajoute l’unicité de la solution ?', ['La stricte monotonie', 'La dérivabilité', 'La positivité', 'La convexité'], 0, 'C’est elle qui permet de parler du « moment où » un seuil est atteint.'],
            ['Une fonction dérivable est-elle continue ?', ['Oui, toujours', 'Non, jamais', 'Seulement si elle est croissante', 'Seulement sur un intervalle fermé'], 0, 'La réciproque, elle, est fausse.'],
            ['Un tarif postal par tranche de poids est modélisé par une fonction continue.', ['Vrai', 'Faux'], 1, 'Il varie par paliers : les théorèmes de continuité ne s’y appliquent pas.'],
            ['Quelle méthode approche une solution en divisant l’intervalle en deux à chaque étape ?', ['La dichotomie', 'Le balayage', 'La récurrence', 'La dérivation'], 0, 'Le balayage, lui, évalue de proche en proche avec un pas décroissant.'],
            ['Combien d’éléments la rédaction attendue du théorème comporte-t-elle ?', ['Trois : continuité, stricte monotonie, encadrement de k', 'Un seul : la conclusion', 'Deux : continuité et calcul', 'Quatre'], 0, 'Chacun des trois est noté séparément.'],
            ['Le théorème des valeurs intermédiaires fournit la valeur de la solution.', ['Vrai', 'Faux'], 1, 'Il en prouve l’existence ; la valeur s’obtient par balayage ou dichotomie.'],
          ],
        },
        {
          titre: 'Fonction logarithme népérien (ln)',
          axe: 'Analyse',
          lecon: {
            titre: 'La fonction des seuils et des échelles',
            cours: `Le logarithme sert ici à deux choses très concrètes : **résoudre quand l’inconnue est en exposant**, et **lire des grandeurs qui s’étalent sur plusieurs puissances de dix**.

## La définition
Pour x > 0, **ln(x)** est l’unique réel y tel que e^y = x. Le logarithme est la fonction **réciproque** de l’exponentielle :

e^(ln x) = x pour x > 0, et ln(e^x) = x pour tout réel x

Il n’est défini que sur **]0 ; +∞[** — condition d’existence à vérifier avant tout calcul.

## Les propriétés algébriques
- **ln(ab) = ln a + ln b** ;
- ln(a/b) = ln a − ln b ;
- ln(a^n) = n ln a.

⚠️ ln(a + b) n’est **pas** ln a + ln b.

Valeurs de référence : ln(1) = 0 et ln(e) = 1.

## L’étude de la fonction
ln est continue, dérivable et **strictement croissante** sur ]0 ; +∞[, de dérivée **1/x**. Elle est **concave** (dérivée seconde négative). Ses limites : −∞ en 0 par valeurs positives, +∞ en +∞ — mais **lentement**, puisque ln(x)/x tend vers 0.

Pour une fonction u strictement positive : **(ln u)′ = u′/u**.

## L’usage numéro un : les seuils
Toute question du type « à partir de quelle année », « au bout de combien de temps » sur un modèle **géométrique** se résout par le logarithme.

Exemple : un capital placé à 4 % double quand 1,04^n ≥ 2, soit n ≥ ln(2)/ln(1,04), c’est-à-dire n ≥ 17,7 — donc au bout de **18 ans**. L’arrondi se fait **toujours** dans le sens qui respecte l’inégalité, jamais au plus proche : c’est l’erreur la plus fréquente.

## L’usage numéro deux : les échelles logarithmiques
Décibels, magnitude d’un séisme, pH : ces échelles compressent des grandeurs qui s’étalent sur plusieurs puissances de dix. Une augmentation d’une unité y correspond à une **multiplication** de la grandeur physique — pas à une addition. Lire un graphique en échelle logarithmique demande de le savoir : une droite y signale une croissance **exponentielle**, pas linéaire.

## L’usage numéro trois : la linéarisation
Une suite géométrique devient arithmétique par le logarithme : ln(u(n)) = ln(u(0)) + n ln(q). C’est le moyen de repérer un modèle exponentiel sur des données réelles — si le nuage des ln s’aligne, le modèle est exponentiel.

> Dès qu’une inconnue apparaît en exposant, le logarithme est le seul outil du programme qui la fasse descendre. C’est sa raison d’être en mathématiques complémentaires.`,
          },
          questions: [
            ['Sur quel ensemble la fonction ln est-elle définie ?', [']0 ; +∞[', 'ℝ', '[0 ; +∞[', 'ℝ privé de 0'], 0, 'La condition d’existence est à vérifier avant tout calcul.'],
            ['Que vaut ln(ab) pour a et b strictement positifs ?', ['ln a + ln b', 'ln a × ln b', 'ln(a + b)', 'ln(a) / ln(b)'], 0, 'Le logarithme transforme les produits en sommes.'],
            ['Comment résout-on 1,04^n ≥ 2 ?', ['En passant au logarithme : n ≥ ln(2)/ln(1,04)', 'En divisant par 1,04', 'En élevant au carré', 'Par dichotomie uniquement'], 0, 'Le logarithme fait descendre l’exposant.'],
            ['On trouve n ≥ 17,7 pour une question de seuil. Quelle réponse donner ?', ['18 ans', '17 ans', '17,7 ans', '18,7 ans'], 0, 'L’arrondi se fait dans le sens qui respecte l’inégalité, jamais au plus proche.'],
            ['Quelle est la dérivée de ln(x) ?', ['1/x', 'ln(x)/x', 'x', 'e^x'], 0, 'Strictement positive, elle prouve la croissance de ln sur ]0 ; +∞[.'],
            ['Sur une échelle logarithmique, une augmentation d’une unité correspond à…', ['Une multiplication de la grandeur physique', 'Une addition d’une unité', 'Un doublement systématique', 'Aucune variation'], 0, 'C’est le cas des décibels, du pH et de la magnitude d’un séisme.'],
            ['Que signale un nuage de points aligné après passage au logarithme ?', ['Un modèle exponentiel', 'Un modèle linéaire', 'Un modèle sans tendance', 'Une erreur de mesure'], 0, 'Le logarithme linéarise une suite géométrique.'],
            ['ln(a + b) est-il égal à ln a + ln b ?', ['Non, cette égalité est fausse', 'Oui, toujours', 'Oui, si a et b sont positifs', 'Oui, si a = b'], 0, 'C’est l’erreur la plus fréquente sur le logarithme.'],
          ],
        },
        {
          titre: 'Compléments sur la dérivation',
          axe: 'Analyse',
          lecon: {
            titre: 'Dériver ce que la modélisation impose',
            cours: `La dérivée est l’outil de l’**optimisation** : trouver le coût minimal, le bénéfice maximal, la dose optimale. Ce complément fournit les formules qui manquaient en Première.

## Le rappel
f′(a) est le **coefficient directeur de la tangente** à la courbe au point d’abscisse a, et la **vitesse instantanée** de variation. L’équation de la tangente en a est :

y = f′(a)(x − a) + f(a)

## Les dérivées usuelles
x^n → n x^(n−1) ; √x → 1/(2√x) ; 1/x → −1/x² ; e^x → e^x ; ln(x) → 1/x.

## Les opérations
- (u + v)′ = u′ + v′ ;
- (u v)′ = u′v + u v′ — le produit n’est **pas** le produit des dérivées ;
- (u/v)′ = (u′v − u v′)/v² — l’ordre au numérateur compte, contrairement au produit ;
- (k u)′ = k u′.

## Les composées, cœur du complément
- **(e^u)′ = u′ e^u** ;
- **(ln u)′ = u′/u**, pour u > 0 ;
- (uⁿ)′ = n u′ uⁿ⁻¹ ;
- (√u)′ = u′/(2√u), pour u > 0.

Le facteur **u′** est celui qu’on oublie : la dérivée de e^(−0,2x) vaut −0,2 e^(−0,2x), et non e^(−0,2x). Dans un modèle de décroissance, cet oubli inverse le sens de variation.

## Signe de la dérivée et variations
- f′ > 0 sur un intervalle ⟹ f **croissante** ;
- f′ < 0 ⟹ f **décroissante** ;
- f′ s’annule **en changeant de signe** ⟹ **extremum local**.

⚠️ L’annulation seule ne suffit pas : pour f(x) = x³, f′(0) = 0 sans extremum. C’est le **changement de signe** qui compte.

## La méthode d’optimisation
1. **traduire** l’énoncé en une fonction d’une seule variable, en précisant son intervalle de validité ;
2. **dériver** ;
3. **étudier le signe** de la dérivée — c’est souvent l’étape difficile, qui demande de factoriser ;
4. dresser le **tableau de variations** ;
5. **conclure** en revenant à la question posée, avec les unités.

L’intervalle de validité est essentiel : un nombre d’articles produits ne peut être ni négatif ni supérieur à la capacité de l’atelier. Un optimum mathématique hors de cet intervalle n’a aucun sens, et l’extremum est alors atteint **au bord**.

## Le vocabulaire de la modélisation
- **coût marginal** : la dérivée du coût total, soit approximativement le coût de l’unité supplémentaire ;
- **bénéfice** : recette moins coût ; il est maximal lorsque sa dérivée s’annule en changeant de signe, c’est-à-dire là où le coût marginal égale la recette marginale.

> La dérivée ne donne pas la valeur maximale : elle indique **où** elle se trouve. Il faut ensuite calculer f en ce point — et penser à vérifier les bornes de l’intervalle.`,
          },
          questions: [
            ['Quelle est la dérivée de e^u ?', ['u′ e^u', 'e^u', 'u e^u', 'e^(u′)'], 0, 'Oublier u′ inverse le sens de variation dans un modèle de décroissance.'],
            ['Quelle est la dérivée de ln(u) pour u strictement positive ?', ['u′ / u', '1 / u', 'u / u′', 'u′ ln(u)'], 0, 'C’est l’une des deux formules composées du complément.'],
            ['Quelle est la dérivée d’un produit u v ?', ['u′v + u v′', 'u′ v′', 'u′v − u v′', '(u v)′ = u v'], 0, 'La dérivée d’un produit n’est jamais le produit des dérivées.'],
            ['Une dérivée qui s’annule en un point y crée-t-elle toujours un extremum ?', ['Non, il faut un changement de signe', 'Oui, toujours', 'Oui, si la fonction est croissante avant', 'Oui, si le point est intérieur à l’intervalle'], 0, 'Pour x³, la dérivée s’annule en 0 sans extremum.'],
            ['Quelle est la dérivée de e^(−0,2x) ?', ['−0,2 e^(−0,2x)', 'e^(−0,2x)', '0,2 e^(−0,2x)', '−e^(−0,2x)'], 0, 'Le facteur u′ vaut ici −0,2.'],
            ['Pourquoi préciser l’intervalle de validité dans un problème d’optimisation ?', ['Un optimum hors de cet intervalle n’a aucun sens concret', 'Pour simplifier le calcul de la dérivée', 'Pour éviter les valeurs négatives de la dérivée', 'Ce n’est pas nécessaire'], 0, 'L’extremum est alors atteint au bord de l’intervalle.'],
            ['Qu’appelle-t-on coût marginal ?', ['La dérivée du coût total, soit le coût approché de l’unité supplémentaire', 'Le coût moyen par unité', 'Le coût fixe', 'La différence entre recette et coût'], 0, 'Le bénéfice est maximal là où le coût marginal égale la recette marginale.'],
            ['Quelle est l’équation de la tangente en a ?', ['y = f′(a)(x − a) + f(a)', 'y = f(a)(x − a) + f′(a)', 'y = f′(a) x + a', 'y = f(a) x + f′(a)'], 0, 'Le coefficient directeur est le nombre dérivé en a.'],
          ],
        },
        {
          titre: 'Fonctions convexes',
          axe: 'Analyse',
          lecon: {
            titre: 'Augmenter, et augmenter de plus en plus vite',
            cours: `Savoir qu’une grandeur augmente ne suffit pas : le décideur veut savoir si elle augmente **de plus en plus vite** ou si la hausse ralentit. C’est ce que dit la convexité.

## Les définitions
Pour f dérivable sur un intervalle :
- f est **convexe** si sa courbe est **au-dessus de chacune de ses tangentes** ;
- f est **concave** si sa courbe est **au-dessous de chacune de ses tangentes**.

Autre lecture : une fonction convexe a sa courbe **au-dessous de ses cordes**. Image mnémotechnique : une fonction convexe « tient l’eau ».

## Les caractérisations
Pour f deux fois dérivable, les trois propositions sont équivalentes :
- f est **convexe** ;
- **f′ est croissante** ;
- **f″ ≥ 0**.

Symétriquement pour la concavité, avec f′ décroissante et f″ ≤ 0.

## Le point d’inflexion
C’est un point où la courbe **change de convexité**. En ce point, **f″ s’annule en changeant de signe**, et la tangente **traverse** la courbe.

⚠️ L’annulation de f″ ne suffit pas : pour x⁴, f″(0) = 0 sans changement de convexité.

## Ce que la convexité veut dire concrètement
La distinction essentielle, et celle que l’épreuve teste :
- **f′ > 0** : la grandeur **augmente** ;
- **f′ > 0 et f″ > 0** : elle augmente **de plus en plus vite** — croissance qui s’emballe ;
- **f′ > 0 et f″ < 0** : elle augmente **de moins en moins vite** — croissance qui ralentit, souvent vers un plafond.

Un **point d’inflexion** sur une courbe de croissance marque donc le moment où l’emballement s’arrête : c’est le **pic de la vitesse de croissance**. Sur une courbe épidémique, c’est le jour où le nombre de nouveaux cas quotidiens est maximal — bien avant que le total cesse d’augmenter. Confondre ce point avec le maximum de la courbe est l’erreur d’interprétation la plus fréquente.

## Les fonctions de référence
- **convexes** : x², e^x, x^n pour n pair ;
- **concave** sur ]0 ; +∞[ : ln ;
- **affine** : convexe et concave à la fois.

## Le modèle logistique
Une croissance limitée (population dans un milieu fini, diffusion d’un produit dans une population) suit une courbe en S : **convexe** d’abord (démarrage lent puis accélération), **concave** ensuite (ralentissement vers le plafond), avec un **point d’inflexion** entre les deux, à mi-chemin du plafond. Reconnaître cette forme et savoir la commenter est l’attendu du chapitre.

> Variation et convexité sont deux informations **indépendantes**. Une grandeur peut baisser en accélérant (décroissante et concave) ou baisser en ralentissant (décroissante et convexe).`,
          },
          questions: [
            ['Quelle condition sur f″ caractérise une fonction convexe ?', ['f″ positive', 'f″ négative', 'f″ nulle', 'f″ croissante'], 0, 'De façon équivalente, f′ est croissante.'],
            ['Que signifie f′ > 0 et f″ < 0 pour une grandeur ?', ['Elle augmente de moins en moins vite', 'Elle augmente de plus en plus vite', 'Elle diminue', 'Elle est constante'], 0, 'C’est une croissance qui ralentit, souvent vers un plafond.'],
            ['Que marque un point d’inflexion sur une courbe de croissance ?', ['Le moment où la vitesse de croissance est maximale', 'Le maximum de la grandeur', 'Le début de la décroissance', 'La fin du phénomène'], 0, 'Sur une courbe épidémique, c’est le pic des nouveaux cas quotidiens.'],
            ['Une fonction convexe a sa courbe…', ['Au-dessus de ses tangentes et au-dessous de ses cordes', 'Au-dessous de ses tangentes', 'Confondue avec ses tangentes', 'Au-dessus de ses cordes'], 0, 'Elle « tient l’eau ».'],
            ['La fonction ln est concave sur ]0 ; +∞[.', ['Vrai', 'Faux'], 0, 'Sa dérivée 1/x est décroissante.'],
            ['Une courbe logistique en S est…', ['Convexe puis concave, avec un point d’inflexion entre les deux', 'Convexe partout', 'Concave partout', 'Sans point d’inflexion'], 0, 'Démarrage lent, accélération, puis ralentissement vers le plafond.'],
            ['L’annulation de f″ en un point suffit-elle à en faire un point d’inflexion ?', ['Non, il faut un changement de signe de f″', 'Oui, toujours', 'Oui, si f est croissante', 'Oui, si f″ est continue'], 0, 'Pour x⁴, f″(0) = 0 sans changement de convexité.'],
            ['Une fonction décroissante peut-elle être convexe ?', ['Oui, variation et convexité sont indépendantes', 'Non, jamais', 'Oui, seulement si elle est positive', 'Oui, seulement sur un intervalle borné'], 0, 'Elle baisse alors de moins en moins vite.'],
          ],
        },
        {
          titre: 'Primitives et équations différentielles',
          axe: 'Analyse',
          lecon: {
            titre: 'Remonter d’une vitesse à une quantité',
            cours: `En modélisation, on connaît souvent la **vitesse** d’évolution d’une grandeur avant de connaître la grandeur elle-même. Passer de l’une à l’autre, c’est chercher une **primitive**.

## La définition
F est une **primitive** de f sur un intervalle I si **F′ = f** sur I. Toute fonction continue sur un intervalle y admet des primitives, et elles diffèrent toutes d’une **constante**.

Conséquence : une **condition initiale** — la valeur de la grandeur à l’instant zéro — détermine une primitive et une seule. Sans elle, le modèle reste indéterminé.

## Les primitives usuelles
- x^n → x^(n+1)/(n+1), pour n ≠ −1 ;
- 1/x → ln|x| ;
- e^x → e^x ;
- 1/√x → 2√x.

## Les formes composées
- u′ e^u → e^u ;
- u′/u → ln|u| ;
- u′ uⁿ → uⁿ⁺¹/(n+1).

**Reconnaître u′** dans l’expression est toute la méthode ; quand le facteur constant ne tombe pas juste, on le corrige en multipliant par l’inverse.

## L’équation y′ = a y
Ses solutions sont les fonctions **x ↦ C e^(a x)**, C réel.

C’est l’équation de toute évolution dont la **vitesse est proportionnelle à la quantité présente**. Elle décrit :
- **a > 0** : croissance exponentielle — population sans contrainte, capital à intérêts composés ;
- **a < 0** : décroissance exponentielle — désintégration radioactive, refroidissement, élimination d’un médicament par l’organisme.

## L’équation y′ = a y + b
Ses solutions sont **x ↦ C e^(a x) − b/a**, pour a ≠ 0. La méthode attendue :
1. chercher la **solution particulière constante**, celle qui vérifie 0 = a y + b, soit y = −b/a ;
2. ajouter les solutions de l’équation **sans second membre**, c’est-à-dire C e^(a x) ;
3. déterminer C par la **condition initiale**.

Interprétation : quand a < 0, le terme exponentiel s’efface et la grandeur converge vers **−b/a**, son **niveau d’équilibre** — indépendamment de l’état de départ. C’est le modèle du refroidissement vers la température ambiante, ou d’un réservoir qui se remplit à débit constant en fuyant proportionnellement à son contenu.

## Le lien avec le discret
L’équation différentielle est la version **continue** de la suite arithmético-géométrique u(n+1) = a u(n) + b. Les deux décrivent la même situation — un taux plus un apport fixe — et convergent toutes deux vers un état d’équilibre. Savoir passer de l’un à l’autre est un attendu du programme.

> Une équation différentielle donne une **famille** de courbes ; la condition initiale en désigne **une**. Un modèle complet comporte donc toujours ces deux données.`,
          },
          questions: [
            ['Qu’est-ce qu’une primitive F de f ?', ['Une fonction dérivable telle que F′ = f', 'La dérivée de f', 'La fonction réciproque de f', 'La limite de f'], 0, 'Deux primitives d’une même fonction diffèrent d’une constante.'],
            ['Quelles sont les solutions de y′ = a y ?', ['Les fonctions x ↦ C e^(a x)', 'Les fonctions x ↦ a x + C', 'Les fonctions x ↦ C ln(a x)', 'La seule fonction nulle'], 0, 'C’est l’équation d’une évolution proportionnelle à la quantité présente.'],
            ['Que modélise l’équation y′ = a y avec a < 0 ?', ['Une décroissance exponentielle, comme une élimination de médicament', 'Une croissance exponentielle', 'Une évolution linéaire', 'Une oscillation'], 0, 'Désintégration radioactive et refroidissement suivent le même modèle.'],
            ['Vers quoi converge la solution de y′ = a y + b quand a < 0 ?', ['Vers −b/a, le niveau d’équilibre', 'Vers 0', 'Vers b', 'Elle diverge'], 0, 'Indépendamment de l’état de départ : c’est le modèle du refroidissement.'],
            ['Comment détermine-t-on la constante C ?', ['Par la condition initiale', 'Par la dérivée seconde', 'Elle vaut toujours 1', 'Par la limite en +∞'], 0, 'Sans condition initiale, le modèle reste indéterminé.'],
            ['Quelle est une primitive de u′/u ?', ['ln|u|', '1/u', 'u²/2', 'u′ ln(u)'], 0, 'C’est la lecture inverse de la dérivée de ln(u).'],
            ['De quelle suite l’équation y′ = a y + b est-elle la version continue ?', ['La suite arithmético-géométrique u(n+1) = a u(n) + b', 'La suite arithmétique', 'La suite géométrique pure', 'La suite constante'], 0, 'Les deux décrivent un taux plus un apport fixe, et convergent vers un équilibre.'],
            ['Quelle est la solution particulière constante de y′ = a y + b ?', ['y = −b/a', 'y = b/a', 'y = b', 'y = 0'], 0, 'Elle vérifie 0 = a y + b.'],
          ],
        },
        {
          titre: 'Intégration',
          axe: 'Analyse',
          lecon: {
            titre: 'Une aire qui a un sens',
            cours: `L’intégrale mesure un **cumul** : la distance parcourue à partir d’une vitesse, l’énergie consommée à partir d’une puissance, la quantité totale à partir d’un débit.

## La définition géométrique
Pour f **continue et positive** sur [a ; b], l’intégrale de a à b de f est l’**aire** du domaine compris entre la courbe, l’axe des abscisses et les droites x = a et x = b, exprimée en **unités d’aire**.

Si f est négative, l’intégrale est **négative** : c’est une aire **algébrique**.

## Le calcul
Si F est une primitive de f sur [a ; b] :

∫ de a à b de f(x) dx = F(b) − F(a)

Le résultat ne dépend pas de la primitive choisie, la constante s’éliminant dans la différence. Tout le chapitre précédent sert donc ici.

## Les propriétés
- **linéarité** : l’intégrale d’une somme est la somme des intégrales, et une constante multiplicative sort ;
- **relation de Chasles** : de a à b, plus de b à c, égale de a à c — c’est elle qui permet de découper une période d’étude ;
- **positivité** : si f ≥ 0 sur [a ; b] avec a ≤ b, l’intégrale est positive ;
- **croissance** : si f ≤ g, l’intégrale de f est inférieure à celle de g.

## La valeur moyenne
La **valeur moyenne** de f sur [a ; b] vaut :

(1/(b − a)) × ∫ de a à b de f(x) dx

C’est la notion la plus utile en modélisation : température moyenne sur une journée, débit moyen, consommation moyenne. Elle diffère de la moyenne des valeurs aux bornes dès que la fonction n’est pas affine — piège fréquent.

## L’interprétation du cumul
La règle à retenir : si f décrit une **vitesse** ou un **débit**, alors l’intégrale de f décrit la **quantité totale accumulée** sur la période.

- vitesse en km/h intégrée sur des heures → **distance en km** ;
- puissance en kW intégrée sur des heures → **énergie en kWh** ;
- débit en L/min intégré sur des minutes → **volume en L**.

L’**unité du résultat** est le produit des unités des deux axes : la vérifier est le meilleur contrôle d’un calcul, et l’énoncé la demande presque toujours.

## L’aire entre deux courbes
Pour f ≥ g sur [a ; b], l’aire entre les deux courbes vaut l’intégrale de (f − g). Elle s’interprète comme un **écart cumulé** : différence de production entre deux scénarios, économie réalisée par un dispositif.

## Les valeurs approchées
Quand aucune primitive ne s’exprime simplement, on approche l’intégrale par la méthode des **rectangles** ou des **trapèzes**, en découpant l’intervalle. La calculatrice fait de même.

> L’intégrale n’est pas qu’une aire : c’est un cumul. C’est l’interprétation, et l’unité qui l’accompagne, que l’épreuve évalue.`,
          },
          questions: [
            ['Que vaut l’intégrale de a à b de f si F est une primitive de f ?', ['F(b) − F(a)', 'F(a) − F(b)', 'F(b − a)', 'F(b) × F(a)'], 0, 'Le résultat ne dépend pas de la primitive choisie.'],
            ['Que représente l’intégrale d’une vitesse sur une durée ?', ['La distance parcourue', 'L’accélération', 'La vitesse moyenne', 'Le temps écoulé'], 0, 'L’unité du résultat est le produit des unités des deux axes.'],
            ['Comment calcule-t-on la valeur moyenne de f sur [a ; b] ?', ['En divisant l’intégrale par (b − a)', 'En prenant (f(a) + f(b))/2', 'En multipliant l’intégrale par (b − a)', 'En dérivant l’intégrale'], 0, 'La moyenne des valeurs aux bornes ne convient que pour une fonction affine.'],
            ['Une intégrale peut-elle être négative ?', ['Oui, si la fonction est négative sur l’intervalle', 'Non, c’est une aire', 'Non, jamais', 'Oui, si les bornes sont positives'], 0, 'C’est une aire algébrique.'],
            ['Que dit la relation de Chasles ?', ['De a à b, plus de b à c, égale de a à c', 'L’intégrale d’un produit est le produit des intégrales', 'L’intégrale est toujours positive', 'La valeur moyenne est la demi-somme des bornes'], 0, 'Elle permet de découper une période d’étude.'],
            ['Que représente l’aire entre deux courbes dans un modèle ?', ['Un écart cumulé entre deux scénarios', 'La valeur moyenne des deux', 'Le point d’intersection', 'La différence des maximums'], 0, 'Économie réalisée, surplus de production, écart de consommation.'],
            ['Quelle est l’unité d’une puissance en kW intégrée sur des heures ?', ['Le kWh, une énergie', 'Le kW', 'L’heure', 'Sans unité'], 0, 'Vérifier l’unité est le meilleur contrôle d’un calcul d’intégrale.'],
            ['Que faire quand aucune primitive ne s’exprime simplement ?', ['Approcher l’intégrale par la méthode des rectangles ou des trapèzes', 'Conclure que l’intégrale n’existe pas', 'Dériver la fonction', 'Changer les bornes'], 0, 'C’est ce que fait la calculatrice.'],
          ],
        },
        // ---- Chapitre 2 : Probabilités et statistique --------------------------
        {
          titre: 'Lois discrètes',
          axe: 'Probabilités et statistique',
          lecon: {
            titre: 'Compter les issues, pondérer les gains',
            cours: `Une loi est **discrète** quand la variable aléatoire ne prend qu’un **nombre fini ou dénombrable** de valeurs : un nombre de succès, un nombre de pannes, un gain en euros.

## La variable aléatoire
Une **variable aléatoire** X associe un nombre à chaque issue d’une expérience. Sa **loi de probabilité** est la liste de ses valeurs possibles avec leurs probabilités. La somme de ces probabilités vaut nécessairement **1** — première vérification de tout tableau de loi.

## Espérance, variance, écart-type
- **E(X) = Σ p(i) x(i)** : la valeur moyenne attendue sur un très grand nombre de répétitions. Ce n’est pas nécessairement une valeur possible de X — l’espérance d’un dé vaut 3,5 ;
- **V(X) = E(X²) − E(X)²** : la dispersion autour de l’espérance ;
- **σ(X) = √V(X)** : l’écart-type, exprimé dans la **même unité** que X, donc plus lisible.

Un **jeu équitable** est un jeu d’espérance de gain **nulle**. Un jeu dont l’espérance est négative est perdant à long terme, quelle que soit la chance à court terme — c’est le cas de tous les jeux d’argent commerciaux.

## Les propriétés
E(aX + b) = a E(X) + b, et V(aX + b) = **a²** V(X). Le carré sur le coefficient et la disparition de b sont les deux points à retenir.

Pour deux variables : E(X + Y) = E(X) + E(Y) **toujours**, mais V(X + Y) = V(X) + V(Y) **seulement si X et Y sont indépendantes**.

## La loi de Bernoulli
Une épreuve à **deux issues** : succès de probabilité p, échec de probabilité 1 − p. La variable vaut 1 ou 0. On a E(X) = p et V(X) = p(1 − p).

## La loi binomiale
Répétition de **n** épreuves de Bernoulli **identiques et indépendantes** ; X compte le **nombre de succès**. X suit la loi B(n ; p) :

P(X = k) = C(n,k) p^k (1 − p)^(n−k)

E(X) = **n p**, V(X) = **n p (1 − p)**.

Trois conditions à vérifier avant d’écrire « X suit une loi binomiale » : épreuves **identiques**, **indépendantes**, à **deux issues**. Un tirage sans remise dans une petite population viole la deuxième — c’est le piège classique.

## Le calcul pratique
P(X = k) à la calculatrice ; P(X ≤ k) par la fonction de répartition ; **P(X ≥ k) = 1 − P(X ≤ k−1)**, en passant par l’événement contraire.

## L’usage en modélisation
Contrôle qualité (nombre de pièces défectueuses dans un lot), sondage (nombre de réponses favorables), fiabilité (nombre de pannes), génétique. La question typique : « quelle est la probabilité qu’au moins 3 pièces sur 50 soient défectueuses ? »

> Une espérance se calcule toujours ; une loi binomiale ne s’applique que si les trois conditions sont réunies. Les vérifier explicitement fait partie de la réponse attendue.`,
          },
          questions: [
            ['Que vaut la somme des probabilités d’une loi de probabilité ?', ['1', '0', 'Le nombre de valeurs', 'Elle est variable'], 0, 'C’est la première vérification de tout tableau de loi.'],
            ['L’espérance d’une variable aléatoire est-elle toujours une valeur possible ?', ['Non, l’espérance d’un dé vaut 3,5', 'Oui, toujours', 'Oui, si la loi est discrète', 'Oui, si la loi est binomiale'], 0, 'C’est une moyenne pondérée, pas une issue.'],
            ['Qu’est-ce qu’un jeu équitable ?', ['Un jeu dont l’espérance de gain est nulle', 'Un jeu où toutes les issues sont équiprobables', 'Un jeu sans mise', 'Un jeu à deux issues'], 0, 'Une espérance négative rend le jeu perdant à long terme.'],
            ['Que vaut V(aX + b) ?', ['a² V(X)', 'a V(X) + b', 'a V(X)', 'a² V(X) + b²'], 0, 'Le coefficient est au carré et la constante disparaît.'],
            ['Quelles conditions doivent être réunies pour appliquer la loi binomiale ?', ['Épreuves identiques, indépendantes, à deux issues', 'Épreuves équiprobables et nombreuses', 'Un tirage sans remise', 'Une population infinie'], 0, 'Un tirage sans remise dans une petite population viole l’indépendance.'],
            ['Que vaut l’espérance d’une loi binomiale B(n ; p) ?', ['n p', 'p', 'n p (1 − p)', 'n / p'], 0, 'La variance vaut, elle, n p (1 − p).'],
            ['Comment calcule-t-on P(X ≥ k) ?', ['1 − P(X ≤ k−1)', '1 − P(X ≤ k)', 'P(X ≤ k) − 1', 'P(X = k) × k'], 0, 'Le passage par l’événement contraire est l’automatisme à acquérir.'],
            ['L’égalité V(X + Y) = V(X) + V(Y) est-elle toujours vraie ?', ['Non, seulement si X et Y sont indépendantes', 'Oui, toujours', 'Oui, comme pour l’espérance', 'Non, jamais'], 0, 'L’espérance, elle, est additive sans condition.'],
          ],
        },
        {
          titre: 'Lois à densité',
          axe: 'Probabilités et statistique',
          lecon: {
            titre: 'Quand la variable prend toutes les valeurs d’un intervalle',
            cours: `Une variable **continue** peut prendre n’importe quelle valeur d’un intervalle : une durée, une taille, une masse. Les probabilités s’y calculent par des **aires**, non par des sommes.

## La densité
Une **densité de probabilité** sur un intervalle I est une fonction f **continue et positive** sur I dont l’**intégrale sur I vaut 1**. La probabilité que X appartienne à [a ; b] est alors :

P(a ≤ X ≤ b) = ∫ de a à b de f(x) dx

Une probabilité est donc une **aire sous la courbe de densité**.

## La conséquence contre-intuitive
Pour toute valeur c : **P(X = c) = 0**. L’intégrale d’un point est nulle. Une valeur isolée a une probabilité nulle sans être impossible — la probabilité qu’une ampoule dure exactement 1000,000… heures est nulle, et pourtant elle dure bien une durée précise.

Corollaire pratique : les inégalités **strictes ou larges donnent le même résultat**. P(X < b) = P(X ≤ b). C’est une simplification, pas un piège.

## L’espérance
E(X) = ∫ x f(x) dx sur l’intervalle. Elle s’interprète comme la valeur moyenne, exactement comme dans le cas discret.

## La loi uniforme
Sur [a ; b], la densité est **constante**, égale à 1/(b − a). Toutes les portions de même longueur ont la même probabilité :

P(c ≤ X ≤ d) = (d − c)/(b − a)

Son espérance vaut (a + b)/2, le milieu de l’intervalle. Modèle : un instant d’arrivée au hasard dans une plage horaire, une erreur d’arrondi.

## La loi exponentielle
De paramètre λ > 0, de densité λ e^(−λx) sur [0 ; +∞[. On retient :

P(X > t) = e^(−λt), et E(X) = 1/λ

Elle modélise des **durées de vie** ou des **temps d’attente** : panne d’un composant, désintégration d’un noyau, temps entre deux appels.

Sa propriété caractéristique est l’**absence de mémoire** : P(X > s + t sachant X > s) = P(X > t). Un composant qui a déjà duré 1000 heures a la même probabilité de tenir 100 heures de plus qu’un composant neuf. Cette propriété est ce qui rend le modèle pertinent pour l’électronique — et **inadapté** à ce qui s’use, comme un pneu ou un organisme vivant.

## La loi normale
De paramètres μ (espérance) et σ (écart-type), sa courbe est la fameuse **courbe en cloche**, symétrique autour de μ. Les repères à connaître :
- environ **68 %** des valeurs dans [μ − σ ; μ + σ] ;
- environ **95 %** dans [μ − 2σ ; μ + 2σ] ;
- environ **99,7 %** dans [μ − 3σ ; μ + 3σ].

Elle apparaît partout où une grandeur résulte de **nombreux facteurs indépendants** : mesures physiques, tailles dans une population, erreurs. Une loi binomiale à grand n s’en approche également.

> Discret : on additionne des probabilités. Continu : on calcule des aires. C’est le seul changement de méthode, mais il commande tout le chapitre.`,
          },
          questions: [
            ['Comment calcule-t-on P(a ≤ X ≤ b) pour une loi à densité ?', ['Par l’intégrale de la densité entre a et b', 'Par la somme des probabilités', 'Par f(b) − f(a)', 'Par la moyenne de f'], 0, 'Une probabilité est une aire sous la courbe de densité.'],
            ['Que vaut P(X = c) pour une variable continue ?', ['0', '1', 'f(c)', 'Cela dépend de la loi'], 0, 'Une valeur isolée a une probabilité nulle sans être impossible.'],
            ['Quelle propriété caractérise la loi exponentielle ?', ['L’absence de mémoire', 'La symétrie autour de la moyenne', 'La densité constante', 'La périodicité'], 0, 'Un composant déjà ancien a la même probabilité de tenir qu’un neuf.'],
            ['Que vaut l’espérance d’une loi exponentielle de paramètre λ ?', ['1/λ', 'λ', 'λ²', '2/λ'], 0, 'Et P(X > t) = e^(−λt).'],
            ['Quelle est la densité d’une loi uniforme sur [a ; b] ?', ['La constante 1/(b − a)', 'x/(b − a)', 'e^(−x)', '1'], 0, 'Toutes les portions de même longueur ont la même probabilité.'],
            ['Quelle proportion des valeurs d’une loi normale se trouve dans [μ − 2σ ; μ + 2σ] ?', ['Environ 95 %', 'Environ 68 %', 'Environ 99,7 %', 'Environ 50 %'], 0, 'Environ 68 % dans [μ − σ ; μ + σ], 99,7 % dans [μ − 3σ ; μ + 3σ].'],
            ['La loi exponentielle est-elle adaptée à la modélisation de l’usure d’un pneu ?', ['Non, son absence de mémoire l’interdit', 'Oui, c’est le modèle standard', 'Oui, si λ est grand', 'Oui, à condition de tronquer la loi'], 0, 'Elle convient à ce qui tombe en panne au hasard, pas à ce qui s’use.'],
            ['Pour une loi à densité, P(X < b) et P(X ≤ b) diffèrent-elles ?', ['Non, elles sont égales', 'Oui, de f(b)', 'Oui, la seconde est plus grande', 'Cela dépend de la loi'], 0, 'La probabilité d’une valeur isolée étant nulle.'],
          ],
        },
        {
          titre: 'Statistique à deux variables',
          axe: 'Probabilités et statistique',
          lecon: {
            titre: 'Ajuster un nuage, sans confondre lien et cause',
            cours: `Une série statistique **à deux variables** associe à chaque individu deux mesures : taille et poids, ancienneté et salaire, année et production. La question est de savoir si l’une renseigne sur l’autre.

## Le nuage de points
On représente chaque individu par un point de coordonnées (x ; y). Le **point moyen G** a pour coordonnées la moyenne des x et la moyenne des y. La lecture du nuage précède **toujours** le calcul : elle indique si un ajustement affine a un sens, et signale les points **aberrants**.

## L’ajustement affine
Quand le nuage s’étire selon une direction, on cherche la droite qui le résume : la **droite de régression de y en x**, d’équation y = a x + b.

Elle est obtenue par la **méthode des moindres carrés** : parmi toutes les droites, c’est celle qui rend **minimale la somme des carrés des écarts verticaux** entre les points et la droite. La calculatrice la donne directement.

Deux propriétés : elle passe **toujours par le point moyen G**, et la régression de **x en y** n’est pas la même droite — le choix dépend de la variable qu’on cherche à prévoir.

## Le coefficient de corrélation linéaire
Noté **r**, il est compris entre **−1 et 1** :
- proche de **1** : les points sont presque alignés sur une droite **croissante** ;
- proche de **−1** : presque alignés sur une droite **décroissante** ;
- proche de **0** : **pas de liaison affine** — ce qui ne veut pas dire aucune liaison. Une relation parabolique parfaite peut donner r nul.

Le coefficient mesure donc la qualité d’un ajustement **affine**, et rien d’autre.

## L’interpolation et l’extrapolation
- **interpoler** : estimer une valeur **à l’intérieur** de la plage observée. Raisonnablement fiable ;
- **extrapoler** : estimer **au-delà**. Beaucoup plus risqué, car rien ne garantit que le modèle reste valable. Une prévision par extrapolation doit toujours être assortie d’une réserve — c’est un attendu de l’épreuve.

## Corrélation n’est pas causalité
C’est la mise en garde centrale du chapitre. Une forte corrélation peut s’expliquer par :
- une **causalité directe** de x vers y ;
- une causalité **inverse**, de y vers x ;
- un **facteur commun** qui agit sur les deux (les ventes de glaces et les noyades augmentent ensemble — la chaleur explique les deux) ;
- une **coïncidence**, d’autant plus probable qu’on teste beaucoup de couples de variables.

Seule une **expérimentation contrôlée** établit une causalité ; un coefficient de corrélation, jamais.

## Les ajustements non affines
Quand le nuage est courbe, un **changement de variable** peut le redresser : poser z = ln(y) linéarise un modèle exponentiel, poser z = ln(x) un modèle logarithmique. On ajuste alors sur les données transformées, puis on revient au modèle initial.

> Trois réflexes : regarder le nuage avant de calculer, ne jamais lire une causalité dans un r, et assortir toute extrapolation d’une réserve.`,
          },
          questions: [
            ['Par quel point la droite de régression passe-t-elle toujours ?', ['Le point moyen G', 'L’origine', 'Le premier point du nuage', 'Le point le plus élevé'], 0, 'C’est une propriété caractéristique de la méthode des moindres carrés.'],
            ['Que minimise la méthode des moindres carrés ?', ['La somme des carrés des écarts verticaux entre les points et la droite', 'La somme des écarts', 'La distance au point le plus éloigné', 'La pente de la droite'], 0, 'D’où le nom de la méthode.'],
            ['Entre quelles valeurs le coefficient de corrélation linéaire est-il compris ?', ['−1 et 1', '0 et 1', '0 et 100', '−∞ et +∞'], 0, 'Proche de ±1, les points sont presque alignés.'],
            ['Un coefficient de corrélation nul signifie-t-il qu’il n’y a aucune liaison ?', ['Non, il n’y a pas de liaison AFFINE', 'Oui, aucune liaison', 'Oui, les variables sont indépendantes', 'Non, il y a toujours une liaison'], 0, 'Une relation parabolique parfaite peut donner r nul.'],
            ['Quelle est la différence entre interpoler et extrapoler ?', ['Interpoler estime dans la plage observée, extrapoler au-delà', 'Interpoler est plus risqué', 'Extrapoler concerne les valeurs manquantes', 'Il n’y a aucune différence'], 0, 'Toute extrapolation doit être assortie d’une réserve.'],
            ['Une forte corrélation entre deux variables prouve-t-elle une causalité ?', ['Non, un facteur commun ou une coïncidence peuvent l’expliquer', 'Oui, si r dépasse 0,9', 'Oui, toujours', 'Oui, si l’échantillon est grand'], 0, 'Seule une expérimentation contrôlée établit une causalité.'],
            ['Quel changement de variable linéarise un modèle exponentiel ?', ['Poser z = ln(y)', 'Poser z = y²', 'Poser z = 1/y', 'Poser z = ln(x)'], 0, 'Poser z = ln(x) convient, lui, à un modèle logarithmique.'],
            ['La droite de régression de y en x est la même que celle de x en y.', ['Vrai', 'Faux'], 1, 'Le choix dépend de la variable qu’on cherche à prévoir.'],
          ],
        },
      ],
    },
  ],
}
