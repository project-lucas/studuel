// Français — Quatrième : LE PROGRAMME COMPLET (18 fiches).
//
// LE DÉFAUT. La page « Français » d'un élève de 4e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « La lettre et
// l'épistolaire », « Le fantastique », « La ville en poésie », « Les
// propositions subordonnées » et « Cause, conséquence et but ». Cinq lignes pour
// une année entière, et rien sur les quatre questionnements du programme.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 5 chapitres de la maquette de référence et
// leurs 18 fiches. Le découpage suit celui du BO de cycle 4 : quatre
// questionnements obligatoires, plus un questionnement complémentaire.
//   1. Se chercher, se construire — Dire l'amour                        (6)
//   2. Vivre en société… — Individu et société : confrontations de valeurs ? (2)
//   3. Regarder le monde… — La fiction pour interroger le réel          (3)
//   4. Agir sur le monde — Informer, s'informer, déformer ?             (3)
//   5. Questionnements complémentaires — La ville, lieu de tous les possibles ? (4)
//
// LE TITRE DES CHAPITRES SUIT LA FORME DE LA 3e (migration 290) : le
// questionnement du BO, un tiret cadratin, puis l'entrée retenue. C'est ce qui
// permet à un élève de reconnaître le même programme d'une année sur l'autre.
//
// LES CINQ FICHES HÉRITÉES PARTENT (voir `menage`). « Le fantastique » et « La
// ville en poésie » sont recouvertes par le nouveau découpage (chapitres 3 et 5) ;
// « La lettre et l'épistolaire » ne figure plus au programme de 4e ; « Les
// propositions subordonnées » et « Cause, conséquence et but » sont des points
// de LANGUE, qui n'ont pas leur place dans le rayon des œuvres — la grammaire a
// son propre rayon en 1re (migration 259), et le collège n'en a pas encore.
//
// ⚠️ Le slug `francais` porte désormais NEUF modules (`francais-1re.mjs` = 259,
// `francais-1re-anciens.mjs` = 260, les cinq modules de fiches de lecture
// 261 → 265, `francais-2de.mjs` = 283, `francais-3e.mjs` = 290, celui-ci = 300) :
// ne JAMAIS générer avec `--slugs francais`. Toujours `--modules francais-4e`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 4e — LE PROGRAMME COMPLET (18 fiches)',

  motif: `CONSTAT : le français de 4e n'avait que les 5 fiches du premier jeu de données
de l'app — « La lettre et l'épistolaire », « Le fantastique », « La ville en
poésie », « Les propositions subordonnées », « Cause, conséquence et but ». Un
élève de 4e qui révisait la poésie lyrique, Bérénice, Marivaux, Lorenzaccio, Le
Cid, L'Assommoir, « La Parure », « La Chute de la maison Usher », la lecture de
la presse, la propagande ou la ville en littérature ne trouvait RIEN. Cette
migration installe les 18 fiches, rangées sous les 5 chapitres de la maquette —
les quatre questionnements du BO plus un questionnement complémentaire — et
retire les 5 fiches génériques.
DEUX DES CINQ FICHES RETIRÉES SONT DES POINTS DE LANGUE (« Les propositions
subordonnées », « Cause, conséquence et but ») : la grammaire a son propre rayon
en Première (migration 259) et le collège n'en a pas encore ; les laisser au
milieu des œuvres brouillerait le dossier.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 18 fiches sous 5 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 18 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « La lettre et l'épistolaire » porte
une apostrophe, et rien ne garantit que la base porte la même que ce fichier
(droite dans le contenu ancien, typographique dans le récent) ; un DELETE par
titre ne trouverait alors pas la ligne, EN SILENCE. Le critère « pas de chapitre
de programme » vise exactement les cinq lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 18 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '4e' est indispensable : le français existe sur six niveaux, et
« Le fantastique » comme « La ville en poésie » sont des titres qu'on retrouve
ailleurs.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['4e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Se chercher, se construire — Dire l'amour
        // ===================================================================
        {
          titre: 'La poésie lyrique et amoureuse de l’Antiquité à nos jours',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Vingt-cinq siècles pour dire « je t’aime »',
            cours: `La poésie **lyrique** est celle qui exprime les **sentiments personnels** du poète. Son nom vient de la **lyre**, l’instrument dont s’accompagnaient les poètes grecs : à l’origine, la poésie lyrique se **chantait**.

## Les grandes étapes
- **Antiquité** : **Sappho**, au VIe siècle avant J.-C., dit le trouble amoureux ; **Ovide** écrit *L’Art d’aimer*.
- **Moyen Âge** : les **troubadours** inventent l’**amour courtois** — le poète sert une dame inaccessible, et cette souffrance l’élève.
- **XVIe siècle** : la **Pléiade**. **Ronsard** (« Mignonne, allons voir si la rose… ») et **Louise Labé** reprennent le **sonnet** de Pétrarque et joignent l’amour au thème du **temps qui passe**.
- **XIXe siècle** : le **romantisme**. **Lamartine**, **Hugo**, **Musset** font de la nature le miroir du sentiment.
- **XXe siècle** : **Apollinaire** (« Le Pont Mirabeau »), **Éluard** (« Liberté »), **Aragon** (« Les Yeux d’Elsa ») renouvellent la forme sans abandonner le sentiment.

## Les marques du lyrisme
- la **première personne** : « je », « mon », « mes » ;
- l’**apostrophe** à l’être aimé ou à la nature : « Ô temps, suspends ton vol ! » ;
- la **ponctuation expressive** : exclamations, interrogations, points de suspension ;
- le **champ lexical** du sentiment ;
- les **images** — comparaison et métaphore.

## Les formes
Le **sonnet** (14 vers : deux quatrains, deux tercets), l’**ode**, l’**élégie** (poème de la plainte), la **ballade**, et depuis le XIXe siècle le **vers libre** et le **poème en prose**.

> Dire l’amour, c’est presque toujours dire aussi le **temps** : la beauté qui passe, l’absence, la mort. Les deux thèmes sont inséparables depuis Ronsard.`,
          },
          questions: [
            ['D’où vient le nom de la poésie lyrique ?', ['De la lyre, l’instrument des poètes grecs', 'Du grec « lyros », qui signifie amour', 'Du nom du poète Lyrios', 'Du mot « lire »'], 0, 'À l’origine, cette poésie se chantait.'],
            ['Qu’exprime la poésie lyrique ?', ['Les sentiments personnels du poète', 'Les exploits des héros', 'Les règles de la société', 'Des récits historiques'], 0, 'Le « je » y est omniprésent.'],
            ['Quelle poétesse grecque du VIe siècle avant J.-C. chante le trouble amoureux ?', ['Sappho', 'Antigone', 'Louise Labé', 'Marie de France'], 0, 'Elle vivait sur l’île de Lesbos.'],
            ['Qu’est-ce que l’amour courtois ?', ['Le service d’une dame inaccessible par le poète', 'Un mariage arrangé à la cour', 'Un amour partagé et heureux', 'Une déclaration faite devant le roi'], 0, 'Les troubadours l’inventent au Moyen Âge.'],
            ['Quel poète du XVIe siècle a écrit « Mignonne, allons voir si la rose… » ?', ['Ronsard', 'Hugo', 'Musset', 'Apollinaire'], 0, 'Il appartient à la Pléiade.'],
            ['Combien de vers compte un sonnet ?', ['14', '12', '10', '16'], 0, 'Deux quatrains suivis de deux tercets.'],
            ['Quelle figure de style consiste à s’adresser directement à un être ou à une chose ?', ['L’apostrophe', 'La métaphore', 'L’antithèse', 'L’allitération'], 0, '« Ô temps, suspends ton vol ! »'],
            ['La poésie lyrique est un genre né au XIXe siècle.', ['Vrai', 'Faux'], 1, 'Elle remonte à l’Antiquité grecque, avec Sappho.'],
          ],
        },
        {
          titre: '« Demain, dès l’aube… », Victor Hugo',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Un poème d’amour qui est un poème de deuil',
            cours: `Publié en **1856** dans *Les Contemplations*, « Demain, dès l’aube… » est l’un des poèmes les plus connus de **Victor Hugo**. Il est écrit à la mémoire de sa fille **Léopoldine**, noyée à 19 ans dans la Seine à Villequier, en septembre 1843.

## La forme
Trois **quatrains** d’**alexandrins** (vers de 12 syllabes), en **rimes croisées** (ABAB). Une forme simple, presque nue.

## Le mouvement du poème
- **Strophe 1** : l’annonce du départ, au **futur**. « Je partirai. Vois-tu, je sais que tu m’attends. » Le poète s’adresse à un « tu » dont on ignore encore l’identité.
- **Strophe 2** : le voyage, replié sur lui-même. « Je marcherai les yeux fixés sur mes pensées » — le monde extérieur a disparu.
- **Strophe 3** : l’arrivée, et la **chute**. « Je mettrai sur ta tombe / Un bouquet de houx vert et de bruyère en fleur. »

## L’effet de la chute
Pendant onze vers, le lecteur croit lire un poème d’**amour** : un homme part rejoindre celle qu’il aime. Le mot **« tombe »**, au dernier vers, renverse tout. Le poème doit sa force à ce **retournement final**, préparé par des indices que l’on ne comprend qu’à la relecture : les yeux baissés, le refus de voir l’or du soir, le dos tourné au monde.

## Les procédés à relever
- le **futur** de la certitude, qui rend le voyage inéluctable ;
- l’**anaphore** du « je » : le poème est entièrement tourné vers un seul geste ;
- les **négations** de la strophe 2 : « je ne regarderai ni l’or du soir qui tombe / Ni les voiles au loin descendant vers Harfleur » ;
- l’**antithèse** finale entre le **houx** (persistant, piquant) et la **bruyère en fleur** (fragile, éphémère) : la fidélité et le deuil dans un même bouquet.

> Le poème ne dit jamais le mot « fille », ni le mot « mort ». C’est cette **retenue** qui le rend bouleversant.`,
          },
          questions: [
            ['Dans quel recueil « Demain, dès l’aube… » a-t-il été publié ?', ['Les Contemplations', 'Les Misérables', 'Les Fleurs du mal', 'Les Rayons et les Ombres'], 0, 'Publié en 1856.'],
            ['À qui ce poème est-il adressé ?', ['À Léopoldine, la fille du poète, morte noyée', 'À une femme aimée', 'À la France', 'À un ami disparu'], 0, 'Elle s’est noyée à 19 ans à Villequier, en 1843.'],
            ['Quelle est la forme du poème ?', ['Trois quatrains d’alexandrins en rimes croisées', 'Un sonnet', 'Un poème en prose', 'Quatre tercets en vers libres'], 0, 'Une forme simple, presque nue.'],
            ['Quel mot du dernier vers renverse le sens du poème ?', ['« tombe »', '« bouquet »', '« bruyère »', '« aube »'], 0, 'Le lecteur croyait lire un poème d’amour.'],
            ['Quel temps domine dans le poème ?', ['Le futur', 'Le passé simple', 'L’imparfait', 'Le présent'], 0, 'Il rend le voyage inéluctable.'],
            ['Que refuse de regarder le poète pendant son voyage ?', ['L’or du soir et les voiles descendant vers Harfleur', 'La foule sur les routes', 'La mer et le ciel', 'Les maisons du village'], 0, 'Les négations montrent qu’il s’est fermé au monde.'],
            ['Que dépose le poète sur la tombe ?', ['Un bouquet de houx vert et de bruyère en fleur', 'Une rose blanche', 'Une couronne de lauriers', 'Une lettre'], 0, 'Le houx persistant et la bruyère fragile : fidélité et deuil.'],
            ['Le poème nomme explicitement la mort de Léopoldine.', ['Vrai', 'Faux'], 1, 'Il ne dit ni « fille » ni « mort » : c’est cette retenue qui fait sa force.'],
          ],
        },
        {
          titre: 'La tragédie au XVIIe siècle : Bérénice de Racine',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Aimer et renoncer',
            cours: `## La tragédie classique
Née au XVIIe siècle sur le modèle grec, elle obéit à des **règles strictes** :
- la règle des **trois unités** : une seule **action**, en un seul **lieu**, en une seule **journée** ;
- la **vraisemblance** : rien d’invraisemblable sur scène ;
- la **bienséance** : ni sang, ni violence, ni mort devant le public — on les **raconte** ;
- des personnages de **haut rang** (rois, princes), une **fin malheureuse**, et le vers : l’**alexandrin** en rimes plates.

Son but, selon Aristote, est la **catharsis** : purger les passions du spectateur par la **terreur** et la **pitié**.

## Bérénice (1670)
**Jean Racine** met en scène trois personnages et presque aucune action :
- **Titus**, devenu empereur de Rome, aime **Bérénice**, reine de Palestine ;
- Rome interdit à son empereur d’épouser une **reine étrangère** ;
- **Antiochus**, roi de Comagène et ami de Titus, aime lui aussi Bérénice en silence.

Titus renonce à Bérénice ; Bérénice, après avoir tout tenté, part ; Antiochus reste seul. Personne ne meurt : la pièce s’achève sur un triple renoncement.

> Racine l’écrit dans sa préface : « Ce n’est point une nécessité qu’il y ait du sang et des morts dans une tragédie ; il suffit que l’action en soit grande. »

## Le conflit tragique
Il oppose l’**amour** au **devoir** — la passion personnelle contre la loi de Rome. Le héros tragique n’a **aucune issue** : quel que soit son choix, il perd. C’est ce qui distingue le tragique du dramatique.

## Le style de Racine
Une langue **simple**, un vocabulaire volontairement **restreint**, et une musicalité fondée sur les sonorités. Le vers final de Bérénice — « Hélas ! » — est le plus court sommet d’une pièce entière.`,
          },
          questions: [
            ['En quoi consiste la règle des trois unités ?', ['Une seule action, un seul lieu, une seule journée', 'Trois actes, trois personnages, trois lieux', 'Trois unités de temps de trois heures', 'Une unité de ton, de style et de genre'], 0, 'C’est la règle centrale du théâtre classique.'],
            ['Que signifie la règle de bienséance ?', ['Ni sang ni violence ne doivent être montrés sur scène', 'Les personnages doivent être polis', 'La pièce doit bien finir', 'Le public doit rester silencieux'], 0, 'Les morts sont racontées, jamais représentées.'],
            ['Qu’est-ce que la catharsis ?', ['La purgation des passions du spectateur par la terreur et la pitié', 'Le dénouement heureux d’une pièce', 'Le monologue final du héros', 'La règle de l’unité de lieu'], 0, 'La notion vient d’Aristote.'],
            ['Pourquoi Titus renonce-t-il à Bérénice ?', ['Parce que Rome interdit à son empereur d’épouser une reine étrangère', 'Parce qu’il ne l’aime plus', 'Parce qu’elle en aime un autre', 'Parce qu’elle est morte'], 0, 'C’est le conflit entre l’amour et le devoir.'],
            ['Qui est Antiochus dans la pièce ?', ['Le roi de Comagène, ami de Titus, qui aime Bérénice en secret', 'Le père de Bérénice', 'Un sénateur romain', 'Le rival militaire de Titus'], 0, 'Il forme le troisième sommet du triangle.'],
            ['Comment s’achève Bérénice ?', ['Par un triple renoncement, sans aucune mort', 'Par le suicide de Bérénice', 'Par le mariage des deux amants', 'Par la mort de Titus'], 0, 'Racine prouve qu’une tragédie n’exige ni sang ni morts.'],
            ['Quel vers l’alexandrin compte-t-il ?', ['Douze syllabes', 'Dix syllabes', 'Huit syllabes', 'Quatorze syllabes'], 0, 'La tragédie classique s’écrit en alexandrins à rimes plates.'],
            ['Le héros tragique dispose toujours d’une issue favorable.', ['Vrai', 'Faux'], 1, 'C’est justement l’absence d’issue qui définit le tragique.'],
          ],
        },
        {
          titre: 'La comédie au XVIIIe siècle',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Rire, mais pour dire quelque chose',
            cours: `Au XVIIIe siècle, la comédie hérite de **Molière** et se transforme sous l’influence des **Lumières** : elle continue de faire rire, mais elle critique de plus en plus la **société**.

## Ce que la comédie garde du siècle précédent
- les **types** : le valet rusé, le barbon, l’amoureux, la coquette ;
- les **procédés comiques** :
  - de **mots** (jeux de mots, patois, répétitions),
  - de **gestes** (chutes, coups de bâton, déguisements),
  - de **situation** (quiproquo, malentendu, hasard),
  - de **caractère** (le défaut poussé à l’excès),
  - de **répétition** (une même réplique qui revient).
- le **quiproquo** et le **double jeu** comme moteurs de l’intrigue.

## Ce qui change au XVIIIe siècle
- Le **valet** cesse d’être un simple ressort comique : il devient l’égal intellectuel de son maître, et parfois plus lucide que lui — jusqu’au **Figaro** de Beaumarchais, qui reproche ouvertement à son maître de « s’être donné la peine de naître ».
- La **critique sociale** s’installe : l’inégalité des conditions, le mariage arrangé, le pouvoir des pères.
- Naît la **comédie sensible** ou « larmoyante », qui mêle rire et émotion, et prépare le **drame**.

## Marivaux et le marivaudage
**Marivaux** (1688-1763) fait de l’amour un **jeu de langage** : ses personnages parlent pour ne pas s’avouer ce qu’ils ressentent, et le spectateur comprend avant eux. On appelle **marivaudage** ce dialogue léger, spirituel, où chaque réplique avance masquée.

> Chez Marivaux, l’obstacle n’est ni le père ni la société : c’est l’**amour-propre** des personnages, qui refusent de reconnaître leur sentiment.

## Beaumarchais
*Le Barbier de Séville* (1775) et *Le Mariage de Figaro* (1784) portent la critique si loin que Louis XVI en interdit d’abord la représentation.`,
          },
          questions: [
            ['Quel dramaturge du XVIIe siècle la comédie du XVIIIe prend-elle pour modèle ?', ['Molière', 'Racine', 'Corneille', 'Voltaire'], 0, 'Types et procédés comiques lui sont hérités.'],
            ['Qu’est-ce qu’un quiproquo ?', ['Un malentendu où l’on prend une chose ou une personne pour une autre', 'Un jeu de mots', 'Une chute sur scène', 'Un monologue adressé au public'], 0, 'C’est un comique de situation.'],
            ['Comment évolue le rôle du valet au XVIIIe siècle ?', ['Il devient l’égal intellectuel de son maître, souvent plus lucide', 'Il disparaît de la scène', 'Il devient muet', 'Il ne fait plus rire du tout'], 0, 'Figaro en est l’aboutissement.'],
            ['Qu’appelle-t-on le marivaudage ?', ['Un dialogue léger et spirituel où les personnages avancent masqués', 'Une farce grossière', 'Un long monologue tragique', 'Une critique politique directe'], 0, 'Le spectateur comprend avant les personnages.'],
            ['Quel est l’obstacle principal à l’amour chez Marivaux ?', ['L’amour-propre des personnages', 'L’opposition du père', 'La différence de religion', 'La guerre'], 0, 'Ils refusent de reconnaître leur sentiment.'],
            ['Quelle pièce de Beaumarchais fut d’abord interdite par Louis XVI ?', ['Le Mariage de Figaro', 'Le Jeu de l’amour et du hasard', 'Bérénice', 'L’Assommoir'], 0, 'Sa critique sociale était jugée trop hardie.'],
            ['Qu’est-ce que la comédie sensible ?', ['Une comédie qui mêle le rire et l’émotion', 'Une comédie sans dialogue', 'Une comédie en un seul acte', 'Une comédie jouée sans décor'], 0, 'Elle prépare le drame du siècle suivant.'],
            ['La comédie du XVIIIe siècle se contente de faire rire, sans critiquer la société.', ['Vrai', 'Faux'], 1, 'Sous l’influence des Lumières, la critique sociale y devient centrale.'],
          ],
        },
        {
          titre: 'Un exemple de comédie du XVIIIe siècle : Le Jeu de l’amour et du hasard, Marivaux',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Deux déguisements, un même aveu',
            cours: `Créée en **1730**, la pièce de **Marivaux** est une comédie en **trois actes** et en **prose**.

## L’intrigue
**Silvia** doit épouser **Dorante**, qu’elle n’a jamais vu. Pour l’observer sans être vue, elle échange son **habit** et son **rôle** avec sa servante **Lisette**.

Mais Dorante a eu **exactement la même idée** : il se présente sous l’habit de son valet **Arlequin**, tandis qu’Arlequin joue le maître.

Les quatre personnages se retrouvent donc masqués deux à deux, sans le savoir. Silvia (en servante) tombe amoureuse de Dorante (en valet), et réciproquement ; Lisette (en maîtresse) et Arlequin (en maître) se plaisent aussi.

## Le double registre
Le spectateur, lui, **sait tout** : le père de Silvia, **Monsieur Orgon**, et son frère **Mario** sont dans la confidence et laissent faire. Ce **double registre** — les personnages ignorent ce que le public sait — est le ressort comique principal de la pièce.

## Le vrai sujet
Ce n’est pas le déguisement, c’est l’**épreuve du sentiment** face au **préjugé social**. Silvia et Dorante s’aiment en croyant aimer un domestique : chacun doit choisir entre son cœur et son rang.
- Dorante cède le premier et révèle son identité par amour ;
- Silvia, elle, prolonge l’épreuve : elle veut être aimée **pour elle-même**, et l’obtenir jusqu’au bout.

> « Il se fait justice ! » — la pièce s’achève sur la victoire du sentiment, mais l’ordre social n’est pas renversé pour autant : maîtres et valets se marient chacun dans leur condition.

## Les procédés à connaître
Le **quiproquo** généralisé, l’**ironie dramatique** (le public en sait plus), le **langage** qui trahit le rang malgré l’habit, et l’**aparté** — ces répliques dites au public que les autres personnages n’entendent pas.`,
          },
          questions: [
            ['En quelle année Le Jeu de l’amour et du hasard a-t-il été créé ?', ['1730', '1670', '1784', '1856'], 0, 'C’est une comédie en trois actes et en prose.'],
            ['Pourquoi Silvia échange-t-elle son rôle avec sa servante ?', ['Pour observer son futur époux sans être reconnue', 'Pour fuir le mariage', 'Pour punir Lisette', 'Pour obéir à son père'], 0, 'Dorante a eu exactement la même idée.'],
            ['Comment s’appelle le valet de Dorante ?', ['Arlequin', 'Mario', 'Orgon', 'Figaro'], 0, 'Il joue le rôle du maître pendant que Dorante joue le valet.'],
            ['Qu’est-ce que le double registre dans cette pièce ?', ['Le public sait ce que les personnages ignorent', 'Les personnages parlent deux langues', 'La pièce mêle vers et prose', 'Deux intrigues se déroulent en parallèle'], 0, 'C’est le ressort comique principal.'],
            ['Quel est le véritable sujet de la pièce ?', ['L’épreuve du sentiment face au préjugé social', 'La lutte pour le pouvoir', 'La critique de la religion', 'La guerre entre deux familles'], 0, 'Chacun doit choisir entre son cœur et son rang.'],
            ['Qui révèle son identité le premier ?', ['Dorante', 'Silvia', 'Arlequin', 'Lisette'], 0, 'Silvia prolonge l’épreuve pour être aimée pour elle-même.'],
            ['Qu’est-ce qu’un aparté ?', ['Une réplique adressée au public que les autres personnages n’entendent pas', 'Un monologue en fin d’acte', 'Un dialogue en coulisses', 'Une didascalie'], 0, 'Marivaux en use abondamment.'],
            ['À la fin de la pièce, l’ordre social est renversé.', ['Vrai', 'Faux'], 1, 'Maîtres et valets se marient chacun dans leur condition.'],
          ],
        },
        {
          titre: 'Le drame du XIXe siècle : Lorenzaccio, Alfred de Musset',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Le théâtre romantique brise les règles',
            cours: `## Le drame romantique
Théorisé par **Victor Hugo** dans la *Préface de Cromwell* (1827), il rejette en bloc les règles classiques :
- **fin des trois unités** : l’action se déplace, s’étale sur des années, multiplie les intrigues ;
- **mélange des genres** : le sublime et le grotesque, le comique et le tragique dans la même scène ;
- **mélange des registres de langue** : rois et gens du peuple, vers et prose ;
- des personnages **complexes**, ni tout à fait bons ni tout à fait mauvais ;
- la **couleur locale** : décors, costumes et détails historiques précis.

## Lorenzaccio (1834)
Musset a 24 ans. La pièce compte **cinq actes**, **39 scènes** et une trentaine de personnages — elle est si vaste qu’elle sera jugée injouable et ne sera créée qu’en **1896**, avec Sarah Bernhardt dans le rôle-titre.

## L’intrigue
Florence, 1537. **Alexandre de Médicis** est un tyran débauché. Son cousin **Lorenzo**, surnommé par mépris **Lorenzaccio** (« le mauvais Lorenzo »), s’est fait son complice et son entremetteur — mais c’est un **masque** : il prépare depuis des années son assassinat, au nom de la liberté.

Lorenzo tue effectivement Alexandre. Et **rien ne change** : les Florentins, indifférents, laissent aussitôt élire un autre Médicis, **Côme**. Lorenzo est assassiné à son tour.

## Le personnage de Lorenzo
C’est le sommet de la pièce. À force de jouer le débauché pour approcher le tyran, il l’est **devenu** :
> « Le vice a été pour moi un vêtement ; maintenant il est collé à ma peau. »

Il agit sans plus croire à l’utilité de son acte : il tue **pour rester fidèle** à celui qu’il a été.

## Ce que la pièce interroge
L’**engagement** et son inutilité, le rapport entre l’**être** et le **paraître**, et le désenchantement d’une génération née trop tard pour la Révolution — le « **mal du siècle** ».`,
          },
          questions: [
            ['Dans quel texte Victor Hugo théorise-t-il le drame romantique ?', ['La Préface de Cromwell', 'Les Contemplations', 'La Préface de Bérénice', 'L’Art poétique'], 0, 'Publiée en 1827.'],
            ['Quelle règle classique le drame romantique rejette-t-il ?', ['La règle des trois unités', 'L’usage de la prose', 'La présence d’un héros', 'La division en actes'], 0, 'Il multiplie lieux, époques et intrigues.'],
            ['Que mélange le drame romantique ?', ['Le sublime et le grotesque, le comique et le tragique', 'Le théâtre et le roman', 'La poésie et la musique', 'Le français et le latin'], 0, 'Hugo en fait le principe même du genre.'],
            ['En quelle année Lorenzaccio a-t-il été écrit ?', ['1834', '1827', '1896', '1730'], 0, 'Jugée injouable, la pièce ne sera créée qu’en 1896.'],
            ['Qui Lorenzo assassine-t-il ?', ['Alexandre de Médicis, le tyran de Florence', 'Côme de Médicis', 'Son propre père', 'Le duc de Milan'], 0, 'Il prépare ce meurtre depuis des années.'],
            ['Que se passe-t-il après le meurtre ?', ['Rien ne change : un autre Médicis est élu', 'Florence devient une république', 'Lorenzo prend le pouvoir', 'Le peuple se soulève'], 0, 'C’est l’échec total de l’engagement.'],
            ['Que signifie la réplique « Le vice a été pour moi un vêtement ; maintenant il est collé à ma peau » ?', ['À force de jouer le débauché, Lorenzo l’est devenu', 'Lorenzo regrette sa richesse', 'Lorenzo se déguise pour fuir', 'Lorenzo accuse le tyran'], 0, 'Le masque a dévoré le visage.'],
            ['Lorenzaccio a été jouée dès sa publication.', ['Vrai', 'Faux'], 1, 'Jugée injouable, elle attend 1896 et Sarah Bernhardt.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Vivre en société — Individu et société
        // ===================================================================
        {
          titre: 'La tragi-comédie au XVIIe siècle : Le Cid, Corneille',
          axe: 'Vivre en société, participer à la société — Individu et société : confrontations de valeurs ?',
          lecon: {
            titre: 'L’honneur contre l’amour',
            cours: `## Une tragi-comédie
Créée en **1637**, la pièce de **Pierre Corneille** est d’abord appelée **tragi-comédie** : elle a la gravité d’une tragédie mais une **fin heureuse**, et son intrigue est plus libre que les règles ne l’autorisent. Corneille la rebaptisera « tragédie » en 1648.

## L’intrigue
**Rodrigue** et **Chimène** s’aiment et vont se marier. Mais le père de Chimène, **Don Gomès**, insulte et gifle le père de Rodrigue, **Don Diègue**, trop vieux pour se venger lui-même.

Don Diègue demande à son fils de laver l’affront. Rodrigue doit choisir : **venger son père** — et perdre Chimène — ou **renoncer à l’honneur**. Il tue Don Gomès en duel.

Chimène, à son tour, doit réclamer au roi la mort de celui qu’elle aime. Rodrigue part combattre les **Maures**, revient vainqueur — il est surnommé **le Cid**, « le seigneur » — et le roi accorde un délai d’un an avant le mariage.

## Le dilemme cornélien
C’est le cœur de la pièce, et la notion à retenir : un personnage doit choisir entre **deux valeurs également hautes**, sans pouvoir les concilier. Quel que soit son choix, il perd quelque chose d’essentiel.

> « Percé jusques au fond du cœur… » — les **stances** de Rodrigue (acte I, scène 6) sont le monologue où ce déchirement se déploie.

## Le héros cornélien
Il se définit par sa **volonté** : il choisit, quoi qu’il en coûte, et **grandit** par son choix. C’est ce qui le distingue du héros racinien, écrasé par une passion qu’il subit.

## La querelle du Cid
Le succès fut immense, et la polémique aussi : l’Académie française reprocha à la pièce de violer les unités et la bienséance — Chimène épouserait le meurtrier de son père. Cette querelle contribua à **fixer les règles** du théâtre classique.`,
          },
          questions: [
            ['Pourquoi Le Cid est-il d’abord appelé tragi-comédie ?', ['Il a la gravité d’une tragédie mais une fin heureuse', 'Il alterne scènes comiques et tragiques', 'Il est joué par des comédiens amateurs', 'Il mêle vers et prose'], 0, 'Corneille le rebaptisera « tragédie » en 1648.'],
            ['Pourquoi Rodrigue doit-il tuer le père de Chimène ?', ['Parce que celui-ci a giflé son propre père, trop vieux pour se venger', 'Parce qu’il convoite sa fortune', 'Parce que le roi le lui ordonne', 'Parce qu’il l’a trahi à la guerre'], 0, 'L’honneur familial exige réparation.'],
            ['Qu’est-ce qu’un dilemme cornélien ?', ['Un choix entre deux valeurs également hautes, impossibles à concilier', 'Un choix entre le bien et le mal', 'Une hésitation entre deux amours', 'Un pari sur l’avenir'], 0, 'Quel que soit le choix, le héros perd quelque chose d’essentiel.'],
            ['Comment appelle-t-on le monologue de Rodrigue à l’acte I ?', ['Les stances', 'L’aparté', 'La tirade des Maures', 'Le prologue'], 0, '« Percé jusques au fond du cœur… »'],
            ['Pourquoi Rodrigue est-il surnommé « le Cid » ?', ['Parce qu’il a vaincu les Maures, qui le nomment « le seigneur »', 'Parce que c’est son nom de naissance', 'Parce que le roi le lui a donné à sa naissance', 'Parce qu’il est le fils de Don Diègue'], 0, 'Le mot vient de l’arabe et signifie « seigneur ».'],
            ['Qu’est-ce qui définit le héros cornélien ?', ['Sa volonté : il choisit et grandit par son choix', 'Sa passion, qu’il subit', 'Sa naissance illustre', 'Sa ruse'], 0, 'C’est ce qui le distingue du héros racinien.'],
            ['Qu’est-ce que la querelle du Cid ?', ['La polémique sur le respect des unités et de la bienséance dans la pièce', 'Un duel entre Corneille et Racine', 'Un procès intenté à Corneille', 'Une dispute entre deux troupes de théâtre'], 0, 'Elle contribua à fixer les règles du théâtre classique.'],
            ['Le Cid se termine par la mort des deux amants.', ['Vrai', 'Faux'], 1, 'Le roi accorde un délai d’un an : la fin reste ouverte et heureuse.'],
          ],
        },
        {
          titre: 'La nouvelle du XVIIIe siècle à nos jours',
          axe: 'Vivre en société, participer à la société — Individu et société : confrontations de valeurs ?',
          lecon: {
            titre: 'Un récit court qui frappe fort',
            cours: `## Qu’est-ce qu’une nouvelle ?
Un **récit bref** en prose, qui se distingue du roman par cinq traits :
- une intrigue **resserrée**, souvent une seule action ;
- **peu de personnages**, décrits en quelques traits ;
- un cadre spatio-temporel **limité** ;
- un rythme rapide, avec des **ellipses** ;
- une **chute** — une fin brève et frappante, qui souvent retourne le sens du récit.

> Le roman prend son temps, la nouvelle vise. C’est la différence entre un portrait à l’huile et un instantané.

## Les grandes étapes du genre
- **XVIIIe siècle** : le **conte philosophique** de Voltaire (*Candide*, *Micromégas*) utilise le récit bref pour porter une idée.
- **XIXe siècle**, l’âge d’or : la presse publie des nouvelles chaque semaine.
  - **Maupassant** — nouvelles réalistes (*La Parure*, *Boule de Suif*) et fantastiques (*Le Horla*) ;
  - **Mérimée** (*La Vénus d’Ille*), **Balzac**, **Poe** aux États-Unis, **Tchekhov** en Russie.
- **XXe et XXIe siècles** : Maupassant reste un modèle, mais la nouvelle explore la science-fiction (**Bradbury**), l’absurde (**Buzzati**), le quotidien (**Carver**). En France, **Anna Gavalda** ou **Bernard Werber** en publient encore des recueils à succès.

## Les registres possibles
**Réaliste** (peindre le réel tel qu’il est), **fantastique** (l’inexplicable fait irruption), **merveilleux** (le surnaturel est admis), **policier**, **science-fiction**, **absurde**.

## La chute
C’est la signature du genre. Elle peut :
- **révéler** une information cachée (*La Parure*) ;
- **retourner** la morale attendue ;
- **laisser en suspens**, sans réponse.

Une bonne chute est toujours **préparée** : à la relecture, les indices étaient là.`,
          },
          questions: [
            ['Qu’est-ce qui distingue une nouvelle d’un roman ?', ['Sa brièveté, son intrigue resserrée et sa chute', 'Sa forme versifiée', 'Son sujet toujours historique', 'Son absence de personnages'], 0, 'Le roman prend son temps, la nouvelle vise.'],
            ['Qu’est-ce que la chute d’une nouvelle ?', ['Une fin brève et frappante, qui retourne souvent le sens du récit', 'Le moment le plus dramatique du milieu', 'La description du décor', 'Le premier paragraphe'], 0, 'Elle est toujours préparée par des indices.'],
            ['Quel auteur du XVIIIe siècle a fait du récit bref un outil philosophique ?', ['Voltaire', 'Maupassant', 'Poe', 'Zola'], 0, 'Candide et Micromégas sont des contes philosophiques.'],
            ['Quel siècle est l’âge d’or de la nouvelle en France ?', ['Le XIXe siècle', 'Le XVIIe siècle', 'Le XVIIIe siècle', 'Le XXe siècle'], 0, 'La presse en publiait chaque semaine.'],
            ['Quelle nouvelle fantastique Maupassant a-t-il écrite ?', ['Le Horla', 'La Parure', 'Boule de Suif', 'La Vénus d’Ille'], 0, 'La Vénus d’Ille est de Mérimée.'],
            ['Que caractérise le registre fantastique ?', ['L’irruption de l’inexplicable dans un cadre réaliste', 'L’acceptation du surnaturel comme allant de soi', 'La peinture fidèle du réel', 'L’enquête policière'], 0, 'Dans le merveilleux, au contraire, le surnaturel ne surprend personne.'],
            ['Quel écrivain russe est un maître de la nouvelle ?', ['Tchekhov', 'Balzac', 'Bradbury', 'Buzzati'], 0, 'Ses nouvelles peignent le quotidien avec une précision aiguë.'],
            ['Une nouvelle peut comporter autant de personnages qu’un roman.', ['Vrai', 'Faux'], 1, 'Sa brièveté impose peu de personnages, décrits en quelques traits.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Regarder le monde, inventer des mondes
        // ===================================================================
        {
          titre: 'Un roman naturaliste : L’Assommoir de Zola',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Le roman comme enquête sociale',
            cours: `## Du réalisme au naturalisme
Le **réalisme** (Balzac, Flaubert, Maupassant) veut peindre le réel **tel qu’il est**, sans idéaliser.
Le **naturalisme**, fondé par **Émile Zola**, va plus loin : il applique au roman la **méthode scientifique**. Le romancier observe, se documente, expérimente — il traite ses personnages comme un médecin traite un cas, en étudiant l’effet de l’**hérédité** et du **milieu** sur eux.

Zola l’écrit dans *Le Roman expérimental* : le romancier est « un observateur et un expérimentateur ».

## Les Rougon-Macquart
Vingt romans, publiés de 1871 à 1893, qui suivent une même famille sur cinq générations, sous-titrés « **Histoire naturelle et sociale d’une famille sous le Second Empire** ». *L’Assommoir* en est le **septième**, publié en **1877**.

## L’Assommoir
C’est le premier grand roman français consacré au **monde ouvrier**.
**Gervaise Macquart**, blanchisseuse boiteuse, arrive à Paris. Abandonnée par Lantier, elle épouse **Coupeau**, zingueur. Le couple travaille dur, ouvre une blanchisserie, connaît quelques années heureuses.

Puis Coupeau tombe d’un toit. Il boit. Gervaise, peu à peu, sombre à son tour : dettes, faim, déchéance, mort dans un réduit sous l’escalier. Leur fille **Nana** deviendra l’héroïne d’un autre roman.

## Le titre
L’« **assommoir** » est le nom populaire du **débit d’alcool** — la boutique du père Colombe, où l’alambic travaille jour et nuit. Le mot dit tout : ce qui assomme.

## Ce qui a fait scandale
Zola fait entrer dans le roman la **langue du peuple** : argot, familiarités, tournures orales, y compris dans la narration. Le livre fut accusé de complaisance dans la misère ; il fut aussi son plus grand succès de librairie.

> Zola ne condamne pas Gervaise : il montre comment le milieu — le taudis, l’alcool, l’épuisement — défait une femme courageuse.`,
          },
          questions: [
            ['Qui a fondé le naturalisme ?', ['Émile Zola', 'Gustave Flaubert', 'Honoré de Balzac', 'Guy de Maupassant'], 0, 'Il l’expose dans Le Roman expérimental.'],
            ['Qu’est-ce qui distingue le naturalisme du réalisme ?', ['Il applique au roman la méthode scientifique, étudiant l’hérédité et le milieu', 'Il idéalise la réalité', 'Il refuse toute documentation', 'Il ne peint que la bourgeoisie'], 0, 'Le romancier y est « observateur et expérimentateur ».'],
            ['Comment s’appelle le cycle romanesque de Zola ?', ['Les Rougon-Macquart', 'La Comédie humaine', 'Les Misérables', 'Les Contemplations'], 0, 'Vingt romans sur cinq générations d’une même famille.'],
            ['Quel est le sujet de L’Assommoir ?', ['La vie et la déchéance d’une blanchisseuse dans le monde ouvrier', 'La montée d’un banquier', 'La guerre de 1870', 'La vie d’une comédienne'], 0, 'C’est le premier grand roman français sur le monde ouvrier.'],
            ['Que désigne le mot « assommoir » ?', ['Un débit d’alcool populaire', 'Un atelier de blanchisserie', 'Un immeuble ouvrier', 'Un outil de zingueur'], 0, 'La boutique du père Colombe, où travaille l’alambic.'],
            ['Comment s’appelle l’héroïne de L’Assommoir ?', ['Gervaise Macquart', 'Nana', 'Emma Bovary', 'Chimène'], 0, 'Sa fille Nana sera l’héroïne d’un autre roman du cycle.'],
            ['Qu’est-ce qui a fait scandale dans L’Assommoir ?', ['L’entrée de la langue populaire, argot compris, jusque dans la narration', 'La présence de personnages historiques', 'Sa longueur excessive', 'Son absence de dialogue'], 0, 'Le roman fut accusé de complaisance dans la misère.'],
            ['Zola condamne moralement son héroïne.', ['Vrai', 'Faux'], 1, 'Il montre comment le milieu défait une femme courageuse.'],
          ],
        },
        {
          titre: 'Une nouvelle réaliste : « La Parure » de Maupassant et l’adaptation éponyme de Claude Chabrol',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Dix ans de misère pour un bijou faux',
            cours: `## La nouvelle (1884)
**Mathilde Loisel**, jolie femme d’un petit employé du ministère, souffre d’être née dans une condition modeste. Invitée à un bal du ministère, elle emprunte une **rivière de diamants** à son amie **Madame Forestier**.

Elle triomphe au bal. Puis, au retour, **elle a perdu la parure**.

Les Loisel la remplacent par une parure identique, achetée **trente-six mille francs** — une somme empruntée de tous côtés. Pendant **dix ans**, le couple s’épuise à rembourser : Mathilde renvoie la bonne, lave, marchande, vieillit prématurément.

Un jour, elle croise Madame Forestier, qui ne la reconnaît pas. Mathilde lui avoue tout. Et la chute tombe :
> « Oh ! ma pauvre Mathilde ! Mais la mienne était fausse. Elle valait au plus cinq cents francs !… »

## Les procédés
- Le **narrateur externe**, à la troisième personne, qui rapporte sans commenter.
- Le **portrait initial** : quelques lignes suffisent à installer l’insatisfaction de Mathilde.
- L’**ellipse** des dix années, condensées en un paragraphe : la nouvelle accélère là où le roman s’attarderait.
- La **chute** finale, préparée par des indices — la boîte qui n’est pas d’origine, le bijoutier qui ne reconnaît pas la parure.

## Ce que la nouvelle interroge
Le poids des **apparences** dans une société où le rang se joue au regard des autres, et la disproportion cruelle entre une faute minuscule et sa punition. Le hasard y remplace la fatalité.

## L’adaptation de Claude Chabrol (2007)
Réalisée pour la télévision dans la collection *Chez Maupassant*, elle donne à voir ce que le texte suggère : les **décors**, la lumière du bal, la mesquinerie des logements, le visage abîmé de Mathilde. Comparer les deux permet d’observer les **choix d’adaptation** — ce que la caméra ajoute (le corps, le costume, la durée réelle), ce qu’elle perd (le discours du narrateur, l’ellipse instantanée).`,
          },
          questions: [
            ['Quel bijou Mathilde emprunte-t-elle ?', ['Une rivière de diamants', 'Un collier de perles', 'Une bague en or', 'Une broche de saphirs'], 0, 'Elle appartient à son amie Madame Forestier.'],
            ['Combien de temps le couple Loisel met-il à rembourser la parure ?', ['Dix ans', 'Un an', 'Trois ans', 'Vingt ans'], 0, 'Ces dix années sont condensées en une ellipse.'],
            ['Quelle est la chute de la nouvelle ?', ['La parure empruntée était fausse', 'Mathilde retrouve le bijou perdu', 'Madame Forestier était ruinée', 'Le mari de Mathilde avait volé le bijou'], 0, 'Elle valait au plus cinq cents francs.'],
            ['Qu’est-ce qu’une ellipse dans un récit ?', ['Le passage sous silence d’une période de temps', 'Une description très détaillée', 'Un dialogue rapporté', 'Un retour en arrière'], 0, 'Les dix années de remboursement tiennent en un paragraphe.'],
            ['Quel type de narrateur Maupassant emploie-t-il ?', ['Un narrateur externe, à la troisième personne', 'Un narrateur personnage', 'Un narrateur à la deuxième personne', 'Plusieurs narrateurs successifs'], 0, 'Il rapporte sans commenter.'],
            ['Que dénonce la nouvelle ?', ['Le poids des apparences dans la société', 'La corruption des ministères', 'La guerre franco-prussienne', 'L’exploitation des ouvriers'], 0, 'Une faute minuscule y entraîne une punition démesurée.'],
            ['Qui a réalisé l’adaptation télévisée de « La Parure » en 2007 ?', ['Claude Chabrol', 'François Truffaut', 'Jean Renoir', 'Louis Malle'], 0, 'Dans la collection Chez Maupassant.'],
            ['La chute de « La Parure » arrive sans aucun indice préalable.', ['Vrai', 'Faux'], 1, 'La boîte qui n’est pas d’origine et le bijoutier qui ne reconnaît pas la parure l’annonçaient.'],
          ],
        },
        {
          titre: 'Une nouvelle fantastique : « La Chute de la maison Usher » d’Edgar Allan Poe',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Quand la maison et la famille s’effondrent ensemble',
            cours: `## Le fantastique
Un récit fantastique installe un cadre **réaliste**, puis y fait surgir un événement **inexplicable**. Sa marque est l’**hésitation** : jusqu’au bout, on ne sait pas s’il faut croire au surnaturel ou à une explication rationnelle — folie, rêve, hallucination.

C’est ce qui le distingue du **merveilleux** (où le surnaturel va de soi, comme dans le conte) et de la **science-fiction** (où l’étrange est expliqué par la science).

## La nouvelle (1839)
Le narrateur, dont on ne saura pas le nom, est appelé au chevet de son ami d’enfance **Roderick Usher**, dernier héritier d’une famille éteinte. Il découvre une **maison** lézardée au bord d’un étang noir, et un ami méconnaissable : hypersensible, terrifié par les sons, les lumières, les odeurs.

La sœur jumelle de Roderick, **Madeline**, meurt. Les deux hommes l’enferment dans un caveau de la maison. Des jours durant, Roderick s’enfonce dans la terreur — jusqu’au soir où Madeline, **enterrée vivante**, reparaît en linceul ensanglanté, s’effondre sur son frère et l’entraîne dans la mort. Le narrateur s’enfuit ; derrière lui, la **maison se fend** et sombre dans l’étang.

## Les procédés du fantastique chez Poe
- le **narrateur interne**, témoin, dont on peut douter ;
- le **cadre** : maison isolée, décrépitude, nuit, tempête ;
- la **gradation** de l’angoisse, très progressive ;
- le **lexique** de l’étrange et de la peur ;
- le **modalisateur** — « il me sembla », « comme si », « peut-être » — qui laisse le doute ouvert ;
- une **correspondance** constante entre la maison et son habitant : les deux se fissurent ensemble, et s’effondrent au même instant.

> Le titre est double : la « chute de la maison Usher » désigne autant le bâtiment que la **lignée**. La langue anglaise dit *house* pour les deux.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise le récit fantastique ?', ['L’hésitation entre une explication rationnelle et le surnaturel', 'L’acceptation du surnaturel comme allant de soi', 'L’explication scientifique de l’étrange', 'L’absence de tout événement étrange'], 0, 'C’est ce qui le distingue du merveilleux et de la science-fiction.'],
            ['Qui est Roderick Usher ?', ['Le dernier héritier d’une famille éteinte, ami du narrateur', 'Le médecin du village', 'Le père du narrateur', 'Un aubergiste'], 0, 'Il est hypersensible et terrifié par les sensations.'],
            ['Que devient Madeline Usher ?', ['Elle est enterrée vivante et reparaît', 'Elle s’enfuit de la maison', 'Elle épouse le narrateur', 'Elle disparaît sans laisser de trace'], 0, 'Elle entraîne son frère dans la mort.'],
            ['Que se passe-t-il à la fin de la nouvelle ?', ['La maison se fend et sombre dans l’étang', 'Le narrateur hérite du domaine', 'La maison est vendue', 'Madeline survit seule'], 0, 'La lignée et le bâtiment s’effondrent ensemble.'],
            ['Qu’est-ce qu’un modalisateur ?', ['Un mot qui exprime le doute, comme « il me sembla » ou « peut-être »', 'Un adjectif qui décrit un décor', 'Un verbe de mouvement', 'Un signe de ponctuation'], 0, 'Il maintient l’hésitation propre au fantastique.'],
            ['Quel type de narrateur Poe emploie-t-il ?', ['Un narrateur interne, témoin, dont on peut douter', 'Un narrateur omniscient', 'Un narrateur absent', 'Plusieurs narrateurs successifs'], 0, 'Le doute sur sa fiabilité nourrit le fantastique.'],
            ['Pourquoi le titre est-il double ?', ['« Maison » désigne à la fois le bâtiment et la lignée', 'La nouvelle comporte deux maisons', 'Le titre a été traduit deux fois', 'Usher possédait deux domaines'], 0, 'L’anglais « house » porte les deux sens.'],
            ['Dans le fantastique, le surnaturel est toujours expliqué à la fin.', ['Vrai', 'Faux'], 1, 'L’hésitation reste ouverte : c’est la définition même du genre.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Agir sur le monde — Informer, s'informer, déformer ?
        // ===================================================================
        {
          titre: 'Lire et comprendre la presse et les médias',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'Qui parle, d’où, et pour dire quoi ?',
            cours: `## Les genres journalistiques
- La **brève** : quelques lignes, l’essentiel, sans titre développé.
- L’**article informatif** : il répond aux **cinq questions** — *qui, quoi, quand, où, pourquoi* (et comment).
- Le **reportage** : le journaliste s’est rendu sur place et raconte ce qu’il a vu.
- L’**interview** : questions et réponses rapportées.
- L’**enquête** : une recherche longue, avec recoupement de sources.
- L’**éditorial**, la **chronique**, la **critique** : des textes d’**opinion**, où l’auteur s’engage.

> La première question à se poser devant un texte de presse : **informe-t-il ou donne-t-il un avis ?** Les deux sont légitimes ; les confondre ne l’est pas.

## L’architecture d’un article
Le **titre** (informatif ou incitatif), le **chapô** (le paragraphe d’introduction en gras), l’**attaque** (première phrase), le corps de l’article, la **chute**. S’y ajoutent l’**intertitre**, la **légende** et le **crédit photo**.

## Vérifier une information
- **La source** : d’où vient l’information ? Est-elle nommée ?
- **La date** : une image ancienne remise en circulation change de sens.
- **Le recoupement** : plusieurs médias indépendants la donnent-ils ?
- **L’auteur** : signé ? par un journaliste identifiable ?
- **L’image** : une recherche d’image inversée dit souvent d’où elle vient réellement.

## Les pièges du numérique
- Le **titre-appât** (« putaclic ») : un titre spectaculaire qui promet plus que l’article ne donne.
- La **bulle de filtres** : les algorithmes montrent surtout ce qui confirme ce que l’on pense déjà.
- L’**infox** (fake news) : une fausse information fabriquée pour tromper — et qui circule d’autant plus vite qu’elle indigne.
- La **rumeur** : une information non vérifiée que chacun relaie de bonne foi.

## Le rôle de la presse en démocratie
La **liberté de la presse** est garantie par la loi de **1881**. Elle a des limites : diffamation, injure, incitation à la haine. Un journaliste doit protéger ses **sources** et vérifier ses informations : c’est la **déontologie** du métier.`,
          },
          questions: [
            ['À quelles questions un article informatif doit-il répondre ?', ['Qui, quoi, quand, où, pourquoi', 'Comment, combien, pour qui', 'Qui, contre qui, pour quel prix', 'Quand et seulement quand'], 0, 'La règle dite des cinq W.'],
            ['Qu’est-ce que le chapô d’un article ?', ['Le paragraphe d’introduction, souvent en gras', 'Le titre principal', 'La dernière phrase', 'La légende de la photo'], 0, 'Il résume l’essentiel avant le corps de l’article.'],
            ['Quel genre journalistique exprime une opinion ?', ['L’éditorial', 'La brève', 'Le reportage', 'L’interview'], 0, 'La chronique et la critique aussi.'],
            ['Que faut-il vérifier en premier devant une information ?', ['Sa source et sa date', 'Le nombre de partages', 'La qualité de l’image', 'La longueur du texte'], 0, 'Une image ancienne remise en circulation change de sens.'],
            ['Qu’est-ce qu’un titre-appât (« putaclic ») ?', ['Un titre spectaculaire qui promet plus que l’article ne donne', 'Un titre trop long', 'Un titre sans verbe', 'Un titre en langue étrangère'], 0, 'Il vise le clic, pas l’information.'],
            ['Qu’est-ce que la bulle de filtres ?', ['L’effet des algorithmes qui montrent surtout ce qui confirme nos idées', 'Un filtre appliqué aux photos de presse', 'Une technique de vérification', 'Un logiciel anti-spam'], 0, 'Elle réduit la diversité des points de vue rencontrés.'],
            ['Quelle loi garantit la liberté de la presse en France ?', ['La loi de 1881', 'La loi de 1789', 'La loi de 1905', 'La loi de 1958'], 0, 'Elle connaît des limites : diffamation, injure, incitation à la haine.'],
            ['Une rumeur et une infox sont exactement la même chose.', ['Vrai', 'Faux'], 1, 'L’infox est fabriquée pour tromper ; la rumeur circule souvent de bonne foi.'],
          ],
        },
        {
          titre: 'Étude de textes et documents produits à des fins de propagande',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'Reconnaître un discours qui veut faire penser',
            cours: `## Qu’est-ce que la propagande ?
Une communication organisée qui vise non pas à **informer** mais à **faire adhérer** : elle cherche à modifier les opinions et les comportements, en s’adressant à l’**émotion** plutôt qu’au raisonnement.

Elle se distingue de la **publicité** (qui vend un produit) par son objet — politique ou idéologique — et de l’**information** par son refus du contradictoire.

## Ses procédés
- La **simplification** : un problème complexe réduit à une formule.
- La **répétition** : le slogan martelé jusqu’à paraître évident.
- La **désignation d’un ennemi** : un « eux » responsable de tout, opposé à un « nous ».
- L’**appel aux émotions** : peur, fierté, colère, pitié.
- Le **culte du chef** : image héroïsée, plans en contre-plongée, foule en arrière-plan.
- La **falsification** : chiffres tronqués, photos retouchées ou sorties de leur contexte, témoins fabriqués.
- L’**argument d’autorité** et l’**effet de masse** : « tout le monde le sait », « des millions y croient ».

## Les outils d’analyse d’un document
- **Nature** : affiche, discours, film, tract, article, publication en ligne ?
- **Auteur et commanditaire** : qui parle, et pour le compte de qui ?
- **Date et contexte** : que se passe-t-il au moment où ce document paraît ?
- **Destinataire** : à qui s’adresse-t-il ?
- **Message explicite** / **message implicite** : ce qu’il dit, et ce qu’il fait croire sans le dire.
- **Procédés visuels** : cadrage, couleurs, taille relative des personnages, symboles.

> Une image ne ment jamais toute seule : c’est le **cadrage**, la **légende** et le **contexte** qui lui font dire ce qu’elle ne montre pas.

## Les contre-pouvoirs
La **pluralité** des médias, le **droit de réponse**, les journalistes de vérification des faits, l’éducation aux médias. Face à un document, la question à garder : *qui a intérêt à ce que je le croie ?*`,
          },
          questions: [
            ['Quel est le but de la propagande ?', ['Faire adhérer à une opinion, pas informer', 'Vendre un produit commercial', 'Divertir le public', 'Enseigner une méthode'], 0, 'Elle s’adresse à l’émotion plutôt qu’au raisonnement.'],
            ['Quel procédé consiste à réduire un problème complexe à une formule ?', ['La simplification', 'Le recoupement', 'La nuance', 'La citation'], 0, 'Souvent associée à la répétition d’un slogan.'],
            ['Qu’est-ce que la désignation d’un ennemi ?', ['La construction d’un « eux » responsable de tout, opposé à un « nous »', 'La déclaration de guerre officielle', 'La critique d’un adversaire politique argumentée', 'Le refus de nommer ses sources'], 0, 'C’est l’un des ressorts les plus constants de la propagande.'],
            ['Qu’est-ce qu’un plan en contre-plongée dans une image de propagande ?', ['Un cadrage vu d’en bas, qui grandit le personnage', 'Un cadrage vu d’en haut, qui écrase le personnage', 'Un gros plan sur les mains', 'Un plan tourné de nuit'], 0, 'Il sert le culte du chef.'],
            ['Que faut-il identifier en premier dans un document de propagande ?', ['Son auteur et son commanditaire', 'Sa longueur', 'Le nombre de couleurs employées', 'Sa police de caractères'], 0, 'Qui parle, et pour le compte de qui ?'],
            ['Qu’est-ce qu’un message implicite ?', ['Ce que le document fait croire sans le dire', 'Le titre du document', 'La légende officielle', 'La signature de l’auteur'], 0, 'Il se distingue du message explicite.'],
            ['Comment une image peut-elle tromper sans être truquée ?', ['Par son cadrage, sa légende et son contexte de publication', 'Par sa taille', 'Par sa date de prise de vue seule', 'Par son format de fichier'], 0, 'On lui fait dire ce qu’elle ne montre pas.'],
            ['La propagande et la publicité poursuivent le même objet.', ['Vrai', 'Faux'], 1, 'La publicité vend un produit ; la propagande vise l’adhésion politique ou idéologique.'],
          ],
        },
        {
          titre: 'Le journalisme à travers les romans et les films du XIXe siècle à nos jours',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'La fiction regarde ceux qui informent',
            cours: `Depuis que la presse existe, la fiction s’en empare — tantôt pour en dénoncer les compromissions, tantôt pour en faire un héroïsme.

## Au XIXe siècle : la presse comme machine
- **Balzac**, *Illusions perdues* (1837-1843) : le jeune **Lucien de Rubempré** monte à Paris, découvre le journalisme, y réussit — et s’y perd. Balzac y décrit un milieu où l’**article se vend**, où l’on démolit une pièce qu’on n’a pas vue, où la critique dépend de qui paie.
- **Maupassant**, *Bel-Ami* (1885) : **Georges Duroy**, sans talent particulier, gravit tous les échelons d’un journal parisien par les femmes et l’intrigue. Le journal *La Vie française* y est un instrument de **spéculation politique**.

> Chez les deux, le journaliste n’est pas un menteur isolé : c’est le **système** qui produit le mensonge.

## Au XXe siècle : le journalisme comme contre-pouvoir
- **Albert Londres** invente le grand **reportage** : « Notre métier n’est pas de faire plaisir, non plus de faire du tort, il est de porter la plume dans la plaie. »
- Au cinéma, *Les Hommes du président* (1976) suit deux journalistes du *Washington Post* dévoilant le scandale du **Watergate**, jusqu’à la démission d’un président.
- *Spotlight* (2015) montre une équipe d’**enquête au long cours** — des mois de vérification avant publication.

## Au XXIe siècle : l’information sous tension
La fiction s’intéresse aux réseaux sociaux, à la vitesse, à la concurrence de l’attention. Les séries et les films récents interrogent la **frontière** entre informer et faire du spectacle.

## Ce que la fiction apporte
Elle rend visibles les **conditions** du travail journalistique : les délais, la hiérarchie, les pressions économiques et politiques, le doute avant de publier. Là où un article expose un fait, le roman ou le film montre **comment ce fait a été obtenu** — et ce qu’il a coûté.`,
          },
          questions: [
            ['Quel roman de Balzac décrit le monde du journalisme parisien ?', ['Illusions perdues', 'Le Père Goriot', 'Bel-Ami', 'L’Assommoir'], 0, 'Lucien de Rubempré y réussit puis s’y perd.'],
            ['Qui est le héros de Bel-Ami ?', ['Georges Duroy', 'Lucien de Rubempré', 'Roderick Usher', 'Rodrigue'], 0, 'Il gravit les échelons d’un journal par les femmes et l’intrigue.'],
            ['Que dénoncent Balzac et Maupassant à propos de la presse ?', ['Un système qui produit le mensonge, au-delà des individus', 'L’incompétence technique des imprimeurs', 'Le prix trop élevé des journaux', 'Le manque de lecteurs'], 0, 'L’article s’y vend, la critique dépend de qui paie.'],
            ['Quel journaliste a défini le métier comme « porter la plume dans la plaie » ?', ['Albert Londres', 'Émile Zola', 'Guy de Maupassant', 'Honoré de Balzac'], 0, 'Il est l’inventeur du grand reportage.'],
            ['Quel film suit deux journalistes révélant le scandale du Watergate ?', ['Les Hommes du président', 'Spotlight', 'Citizen Kane', 'La Parure'], 0, 'Leur enquête mène à la démission d’un président.'],
            ['Que montre le film Spotlight ?', ['Une équipe menant une enquête au long cours avant publication', 'Un journaliste corrompu', 'La naissance d’un journal', 'Une rédaction de télévision en direct'], 0, 'Des mois de vérification y précèdent la publication.'],
            ['Qu’apporte la fiction par rapport à un article de presse ?', ['Elle montre comment le fait a été obtenu et ce qu’il a coûté', 'Elle donne des informations plus récentes', 'Elle garantit la véracité des faits', 'Elle remplace le travail des journalistes'], 0, 'Elle rend visibles les conditions du métier.'],
            ['Dans Bel-Ami, Georges Duroy réussit grâce à son talent d’écriture.', ['Vrai', 'Faux'], 1, 'Il réussit par les femmes et l’intrigue, sans talent particulier.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : Questionnements complémentaires — La ville
        // ===================================================================
        {
          titre: 'La ville comme sujet de roman',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Un décor qui devient un personnage',
            cours: `Depuis le XIXe siècle, la **ville** n’est plus seulement le lieu où se passe l’histoire : elle en devient l’un des **acteurs**.

## Pourquoi le XIXe siècle ?
Parce que la ville change de nature : l’**exode rural**, la **révolution industrielle** et les **grands travaux d’Haussmann** font de Paris une capitale méconnaissable en trente ans. Le roman prend acte de cette transformation.

## Trois façons de traiter la ville
**1. La ville comme théâtre de l’ascension sociale.**
Chez **Balzac**, Paris est un champ de bataille. Rastignac, du haut du Père-Lachaise, lance à la ville son fameux défi : « À nous deux maintenant ! » La ville promet, elle donne — et elle dévore.

**2. La ville comme milieu qui détermine.**
Chez **Zola**, le quartier, l’immeuble, l’atelier expliquent le destin des personnages : *L’Assommoir* se joue dans quelques rues de la Goutte-d’Or, et l’on n’en sort pas.

**3. La ville comme labyrinthe.**
Chez **Hugo** (*Les Misérables*), Paris est un dédale de ruelles, d’égouts et de barricades où l’on se cache, où l’on fuit, où l’on se perd.

## Les procédés à repérer
- la **description** en focalisation interne : la ville vue **par** un personnage, souvent à son arrivée ;
- la **personnification** : la ville qui « gronde », « dévore », « respire » ;
- les **champs lexicaux** — la foule, le bruit, la lumière, la boue ;
- le **contraste** entre quartiers riches et pauvres, souvent à quelques rues d’écart ;
- le **rythme** des phrases, qui mime l’agitation urbaine.

> Décrire une ville, c’est toujours porter un **jugement** sur elle : le choix de ce qu’on montre — vitrines ou taudis — dit l’intention du romancier.`,
          },
          questions: [
            ['Pourquoi la ville devient-elle un sujet de roman au XIXe siècle ?', ['Parce que l’exode rural et l’industrialisation la transforment radicalement', 'Parce que les romanciers y habitent tous', 'Parce que la campagne n’intéresse plus personne', 'Parce que l’imprimerie s’y installe'], 0, 'Les grands travaux d’Haussmann changent Paris en trente ans.'],
            ['Quel personnage de Balzac lance « À nous deux maintenant ! » à Paris ?', ['Rastignac', 'Lucien de Rubempré', 'Georges Duroy', 'Jean Valjean'], 0, 'Il le lance du haut du Père-Lachaise.'],
            ['Comment Zola traite-t-il la ville ?', ['Comme un milieu qui détermine le destin des personnages', 'Comme un décor neutre', 'Comme un lieu de villégiature', 'Comme un souvenir d’enfance'], 0, 'L’Assommoir se joue dans quelques rues de la Goutte-d’Or.'],
            ['Dans quel roman Paris est-il un labyrinthe d’égouts et de barricades ?', ['Les Misérables', 'L’Assommoir', 'Bel-Ami', 'Illusions perdues'], 0, 'Hugo y fait de la ville un dédale.'],
            ['Qu’est-ce que la personnification appliquée à la ville ?', ['Lui prêter des attributs humains : elle gronde, dévore, respire', 'La comparer à une autre ville', 'La décrire en détail', 'La nommer par son quartier'], 0, 'C’est ce qui en fait un personnage à part entière.'],
            ['Qu’est-ce que la focalisation interne dans une description de ville ?', ['La ville vue par les yeux d’un personnage', 'Une description faite par le narrateur omniscient', 'Une description objective et chiffrée', 'Un plan de la ville'], 0, 'Souvent au moment de son arrivée.'],
            ['Que révèle le choix de ce qu’on décrit dans une ville ?', ['L’intention du romancier, son jugement sur elle', 'La saison de l’année', 'Le budget du roman', 'La longueur du chapitre'], 0, 'Montrer les vitrines ou les taudis n’est jamais neutre.'],
            ['Dans le roman du XIXe siècle, la ville n’est qu’un décor sans influence.', ['Vrai', 'Faux'], 1, 'Elle devient un acteur, et chez Zola elle détermine les destins.'],
          ],
        },
        {
          titre: 'La ville comme objet poétique',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'De la laideur, faire un poème',
            cours: `Longtemps, la poésie a chanté la nature. Au XIXe siècle, elle entre dans la **ville** — et y trouve une beauté nouvelle, faite de foule, de gaz, de fumée et de solitude.

## Baudelaire, l’inventeur
Dans *Les Fleurs du mal* (1857), la section « **Tableaux parisiens** » fait de Paris un sujet poétique à part entière. Le poète y est un **flâneur** : il marche, observe, capte les visages d’un instant — la passante, la vieille femme, l’aveugle, le cygne échappé.

Sa formule dit tout son projet : « Tu m’as donné ta boue et j’en ai fait de l’or. » La ville laide, sale, moderne devient matière de poésie.

## Après lui
- **Verlaine** : la ville pluvieuse et mélancolique — « Il pleure dans mon cœur / Comme il pleut sur la ville ».
- **Rimbaud** : la ville rêvée et démesurée des *Illuminations*.
- **Apollinaire** : « Zone » (1913) ouvre *Alcools* sur un Paris moderne — la tour Eiffel, les affiches, les hangars —, sans ponctuation, dans un vers libre qui suit la marche.
- **Cendrars**, **Jacques Réda**, **Jacques Prévert** poursuivent, jusqu’à la chanson.

## Les procédés
- la **personnification** de la ville ;
- l’**oxymore** et l’**antithèse**, pour dire la beauté du laid : « soleil noir », « fangeuse grandeur » ;
- l’**énumération** des choses vues, qui mime le défilé du regard ;
- la **synesthésie** — mêler les sensations : bruits, odeurs, couleurs ;
- le passage au **vers libre** et au **poème en prose**, formes assez souples pour épouser le désordre urbain.

> La poésie de la ville n’embellit pas : elle **transfigure**. Elle regarde ce que personne ne regarde et le rend visible.`,
          },
          questions: [
            ['Quel recueil contient la section « Tableaux parisiens » ?', ['Les Fleurs du mal', 'Alcools', 'Les Contemplations', 'Illuminations'], 0, 'Baudelaire y fait de Paris un sujet poétique.'],
            ['Qu’est-ce qu’un flâneur chez Baudelaire ?', ['Un poète qui marche dans la ville et capte les instants', 'Un promeneur de campagne', 'Un journaliste enquêteur', 'Un habitant sans domicile'], 0, 'Il observe la passante, la vieille femme, l’aveugle.'],
            ['Que signifie « Tu m’as donné ta boue et j’en ai fait de l’or » ?', ['Le poète transfigure la laideur de la ville en poésie', 'Le poète s’est enrichi grâce à la ville', 'La ville a été reconstruite en or', 'Le poète regrette la campagne'], 0, 'C’est le programme de la poésie urbaine.'],
            ['Quel poème d’Apollinaire ouvre Alcools sur un Paris moderne ?', ['« Zone »', '« Le Pont Mirabeau »', '« Demain, dès l’aube… »', '« Le Cygne »'], 0, 'Publié en 1913, sans ponctuation.'],
            ['Qu’est-ce qu’un oxymore ?', ['L’association de deux mots de sens contraires, comme « soleil noir »', 'Une répétition de sons', 'Une comparaison développée', 'Une exagération'], 0, 'Il permet de dire la beauté du laid.'],
            ['Qu’est-ce qu’une synesthésie ?', ['Le mélange de sensations de natures différentes', 'La répétition d’un vers', 'Une rime intérieure', 'Un vers de douze syllabes'], 0, 'Bruits, odeurs et couleurs y sont associés.'],
            ['Quelle forme poétique s’impose pour dire le désordre urbain ?', ['Le vers libre et le poème en prose', 'Le sonnet', 'L’alexandrin à rimes plates', 'La ballade'], 0, 'Des formes assez souples pour épouser la ville moderne.'],
            ['La poésie de la ville cherche à embellir ce qu’elle décrit.', ['Vrai', 'Faux'], 1, 'Elle transfigure : elle rend visible ce que personne ne regarde.'],
          ],
        },
        {
          titre: 'L’importance de la ville dans le roman policier',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Le crime a besoin d’une foule',
            cours: `Le roman policier naît **avec** la grande ville, et pour cause : il faut une foule pour s’y cacher, des quartiers qui s’ignorent, et une **police** organisée pour enquêter.

## Les origines
- **1841** : Edgar Allan Poe publie « **Double assassinat dans la rue Morgue** », premier récit d’énigme, avec le chevalier **Dupin** — un détective qui résout par la seule **déduction**.
- **1887** : **Conan Doyle** crée **Sherlock Holmes** dans un Londres de brouillard, de fiacres et de bas-fonds.
- **1841 également** : Paris se dote d’une police criminelle moderne, dont **Vidocq**, ancien bagnard devenu chef de la Sûreté, inspire les romanciers.

## Les grandes figures françaises
- **Émile Gaboriau** invente le roman judiciaire.
- **Gaston Leroux** : *Le Mystère de la chambre jaune* (1907), modèle du **crime en chambre close**.
- **Maurice Leblanc** : **Arsène Lupin**, gentleman-cambrioleur, qui inverse les rôles — le héros est le voleur.
- **Georges Simenon** : le commissaire **Maigret**, dont les enquêtes tiennent moins à l’indice qu’à l’**atmosphère** d’un quartier, d’un café, d’une pluie sur la Seine.

## Trois sous-genres
- Le **roman à énigme** : un mystère, des indices, une solution logique (Christie, Leroux).
- Le **roman noir** : la société est corrompue, le détective désabusé, la ville hostile (Chandler, Manchette).
- Le **thriller** : le suspense l’emporte sur l’énigme ; on court après le criminel plutôt qu’après la vérité.

## Le rôle de la ville
Elle fournit l’**anonymat** (on disparaît dans la foule), la **variété sociale** (le crime traverse les milieux), les **lieux typiques** (bar, port, gare, terrain vague), et une **atmosphère**. Chez les meilleurs auteurs, changer la ville changerait le roman : Maigret n’existe pas hors de Paris.`,
          },
          questions: [
            ['Quel récit de 1841 est considéré comme le premier roman policier ?', ['« Double assassinat dans la rue Morgue » de Poe', 'Le Mystère de la chambre jaune', 'Une étude en rouge', 'Arsène Lupin gentleman-cambrioleur'], 0, 'Le chevalier Dupin y résout l’énigme par la déduction.'],
            ['Dans quelle ville Sherlock Holmes enquête-t-il ?', ['Londres', 'Paris', 'New York', 'Édimbourg'], 0, 'Un Londres de brouillard, de fiacres et de bas-fonds.'],
            ['Quel roman de Gaston Leroux est le modèle du crime en chambre close ?', ['Le Mystère de la chambre jaune', 'Bel-Ami', 'Les Misérables', 'La Parure'], 0, 'Publié en 1907.'],
            ['Quel personnage de Maurice Leblanc inverse les rôles du policier et du voleur ?', ['Arsène Lupin', 'Maigret', 'Sherlock Holmes', 'Rouletabille'], 0, 'Le gentleman-cambrioleur est le héros.'],
            ['Sur quoi reposent les enquêtes du commissaire Maigret ?', ['Sur l’atmosphère d’un lieu plus que sur l’indice', 'Sur des analyses scientifiques', 'Sur des courses-poursuites', 'Sur des interrogatoires musclés'], 0, 'Un café, un quartier, une pluie sur la Seine.'],
            ['Qu’est-ce qui caractérise le roman noir ?', ['Une société corrompue, un détective désabusé, une ville hostile', 'Une énigme résolue par la logique', 'Un suspense permanent sans enquête', 'Une intrigue historique'], 0, 'Chandler et Manchette en sont des maîtres.'],
            ['Qu’apporte la grande ville au roman policier ?', ['L’anonymat, la variété sociale et une atmosphère', 'Un climat plus doux', 'Des personnages plus riches', 'Une intrigue plus courte'], 0, 'Maigret n’existe pas hors de Paris.'],
            ['Le roman policier existait bien avant les grandes villes modernes.', ['Vrai', 'Faux'], 1, 'Il naît avec elles, au XIXe siècle : il lui faut une foule et une police organisée.'],
          ],
        },
        {
          titre: 'La ville dans la photographie, les films et la bande-dessinée',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Cadrer la ville, c’est déjà la raconter',
            cours: `## La photographie
- **Eugène Atget** photographie systématiquement le vieux Paris avant sa disparition : rues vides, boutiques, cours. Un travail d’**archive** devenu une œuvre.
- **Robert Doisneau** et **Willy Ronis** saisissent le Paris populaire de l’après-guerre : les enfants, les bistrots, les amoureux. Une ville **habitée**, chaleureuse — et parfois mise en scène, comme le fameux baiser de l’Hôtel de Ville.
- La photographie **documentaire** contemporaine montre les périphéries, les grands ensembles, les chantiers.

**Les notions à connaître** : le **cadrage** (ce qu’on garde, ce qu’on exclut), l’**angle de prise de vue** (plongée, contre-plongée), la **profondeur de champ**, le **noir et blanc** contre la couleur, et l’**instant décisif** cher à Cartier-Bresson.

## Le cinéma
La ville y est décor, mais aussi **sujet** :
- *Metropolis* (Fritz Lang, 1927) : la ville verticale, où les ouvriers vivent sous terre et les maîtres au sommet — une image devenue matrice de toute la science-fiction urbaine ;
- *Blade Runner* (1982) hérite directement de cette vision ;
- le cinéma français a filmé la banlieue (*La Haine*, 1995) comme il avait filmé les quais et les faubourgs.

**Les notions** : l’**échelle de plan** (plan général pour situer, gros plan pour l’émotion), le **travelling**, le **plan-séquence**, la **bande-son** — le bruit d’une ville est déjà un récit.

## La bande dessinée
Elle **construit** la ville case après case :
- **Hergé** documente Bruxelles, Shanghai, New York ;
- **Schuiten et Peeters**, dans *Les Cités obscures*, inventent des villes entières, personnages à part entière ;
- **Tardi** reconstitue le Paris de 1914 rue par rue.

**Les notions** : la **case** et sa taille, la **planche** comme composition d’ensemble, la **bulle**, le **cartouche** (le texte du narrateur), et le passage d’une case à l’autre — l’**ellipse** que le lecteur comble lui-même.

> Trois arts, une même leçon : ce qui est **hors champ** compte autant que ce qui est montré.`,
          },
          questions: [
            ['Quel photographe a documenté le vieux Paris avant sa disparition ?', ['Eugène Atget', 'Robert Doisneau', 'Willy Ronis', 'Henri Cartier-Bresson'], 0, 'Rues vides, boutiques et cours, dans un travail d’archive.'],
            ['Qu’est-ce que le cadrage en photographie ?', ['Le choix de ce que l’image garde et de ce qu’elle exclut', 'Le réglage de la lumière', 'Le format d’impression', 'Le choix de l’appareil'], 0, 'Ce qui est hors champ compte autant que ce qui est montré.'],
            ['Qu’est-ce qu’une contre-plongée ?', ['Une prise de vue d’en bas, qui grandit le sujet', 'Une prise de vue d’en haut', 'Une photo prise de nuit', 'Un cadrage très serré'], 0, 'La plongée, à l’inverse, écrase le sujet.'],
            ['Quel film de 1927 met en scène une ville verticale et divisée ?', ['Metropolis', 'Blade Runner', 'La Haine', 'Les Hommes du président'], 0, 'Fritz Lang y installe les ouvriers sous terre et les maîtres au sommet.'],
            ['Qu’est-ce qu’un plan général au cinéma ?', ['Un plan large qui situe l’action dans son décor', 'Un gros plan sur un visage', 'Un plan filmé en mouvement', 'Un plan sans son'], 0, 'Le gros plan sert, lui, l’émotion.'],
            ['Comment appelle-t-on le texte du narrateur en bande dessinée ?', ['Le cartouche', 'La bulle', 'La case', 'La planche'], 0, 'La bulle contient les paroles des personnages.'],
            ['Quelle série de bande dessinée invente des villes entières comme personnages ?', ['Les Cités obscures, de Schuiten et Peeters', 'Les Aventures de Tintin', 'Les Misérables en BD', 'Astérix'], 0, 'La ville y est le sujet même du récit.'],
            ['En bande dessinée, tout ce qui se passe est montré dans les cases.', ['Vrai', 'Faux'], 1, 'Entre deux cases, une ellipse laisse au lecteur le soin de combler.'],
          ],
        },
      ],
    },
  ],
}
