// Français — Cinquième : LE PROGRAMME COMPLET (13 fiches).
//
// LE DÉFAUT. La page « Français » d'un élève de 5e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « Le roman de
// chevalerie », « Voyages et découvertes », « Théâtre : la comédie », « Les
// compléments de phrase » et « Conjugaison : passé simple ». Cinq lignes pour
// une année entière, dont deux qui sont des points de LANGUE et non des entrées
// du programme de littérature.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 5 chapitres de la maquette de référence et
// leurs 13 fiches, qui suivent les quatre questionnements du BO de cycle 4 plus
// un questionnement complémentaire :
//   1. Se chercher, se construire — Le voyage et l'aventure                (3)
//   2. Vivre en société… — Avec autrui : famille, amis, réseaux            (2)
//   3. Regarder le monde… — Imaginer des univers nouveaux                  (3)
//   4. Agir sur le monde — Héros / héroïnes et héroïsme                    (2)
//   5. Questionnements complémentaires — L'être humain est-il maître de la
//      nature ?                                                            (3)
//
// LE TITRE DES CHAPITRES SUIT LA FORME DE LA 3e (290) ET DE LA 4e (300) : le
// questionnement du BO, un tiret cadratin, puis l'entrée retenue. C'est ce qui
// permet à un élève de reconnaître le même programme d'une année sur l'autre.
//
// LES CINQ FICHES HÉRITÉES PARTENT (voir `menage`). « Le roman de chevalerie »
// et « Voyages et découvertes » sont recouvertes par le nouveau découpage
// (chapitres 4 et 1), « Théâtre : la comédie » par le chapitre 2 ; « Les
// compléments de phrase » et « Conjugaison : passé simple » sont des points de
// LANGUE, qui n'ont pas leur place dans le rayon des œuvres — la grammaire a son
// propre rayon en 1re (migration 259), et le collège n'en a pas encore.
//
// ⚠️ Le slug `francais` porte désormais DIX modules (`francais-1re` = 259,
// `francais-1re-anciens` = 260, les cinq modules de fiches de lecture 261 → 265,
// `francais-2de` = 283, `francais-3e` = 290, `francais-4e` = 300, celui-ci =
// 307) : ne JAMAIS générer avec `--slugs francais`. Toujours
// `--modules francais-5e`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 5e — LE PROGRAMME COMPLET (13 fiches)',

  motif: `CONSTAT : le français de 5e n'avait que les 5 fiches du premier jeu de données de
l'app — « Le roman de chevalerie », « Voyages et découvertes », « Théâtre : la
comédie », « Les compléments de phrase », « Conjugaison : passé simple ». Un
élève de 5e qui révisait les récits de voyage, la poésie de l'ailleurs, le roman
d'aventures, L'École des femmes, les récits d'enfance, le conte merveilleux,
l'utopie, la dystopie, les héros médiévaux et antiques ou le rapport de l'homme à
la nature ne trouvait RIEN. Cette migration installe les 13 fiches, rangées sous
les 5 chapitres de la maquette — les quatre questionnements du BO plus un
questionnement complémentaire — et retire les 5 fiches génériques.
DEUX DES CINQ FICHES RETIRÉES SONT DES POINTS DE LANGUE (« Les compléments de
phrase », « Conjugaison : passé simple ») : la grammaire a son propre rayon en
Première (migration 259) et le collège n'en a pas encore ; les laisser au milieu
des œuvres brouillerait le dossier.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 13 fiches sous 5 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 13 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 5e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « Théâtre : la comédie » et
« Voyages et découvertes » recouvrent des entrées que le programme neuf traite
sous d'autres titres, et un DELETE par titre demanderait de vérifier à chaque
relecture qu'aucune fiche neuve ne les reprend exactement. Le critère « pas de
chapitre de programme » vise exactement les cinq lignes voulues : elles datent de
la 008, bien avant la colonne theme, tandis que les 13 fiches neuves en portent
une dès l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais
mordre sur elles, ni au premier passage ni au rejeu.
Le filtre level = '5e' est indispensable : le français existe sur six niveaux, et
la 4e comme la 3e sont traitées par leurs propres migrations.
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
   AND s.slug = 'francais'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '5e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['5e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Le voyage et l'aventure
        // ===================================================================
        {
          titre: 'Les grandes découvertes',
          axe: 'Se chercher, se construire — Le voyage et l’aventure : pourquoi aller vers l’inconnu ?',
          lecon: {
            titre: 'Le récit de voyage, entre témoignage et invention',
            cours: `## Un genre ancien
Le **récit de voyage** raconte un déplacement réel vers des terres lointaines. Il se développe considérablement aux **XVe et XVIe siècles**, quand les navigateurs européens atteignent l’Afrique, l’Amérique et l’Asie.

## Les grands textes
- **Marco Polo**, *Le Devisement du monde* (vers 1298) : le récit de ses années en Chine, dicté en prison. On l’a surnommé *Le Livre des merveilles* — et longtemps soupçonné d’exagération.
- **Christophe Colomb**, son **journal de bord** (1492) : un texte administratif devenu document historique.
- **Jean de Léry**, *Histoire d’un voyage en terre de Brésil* (1578) : l’un des premiers regards ethnographiques sur un peuple amérindien.
- **Jacques Cartier**, **Bougainville**, plus tard **Chateaubriand**.

## Les caractéristiques du genre
- Un **narrateur** qui dit « je » et se porte garant de ce qu’il rapporte.
- Un ordre **chronologique**, souvent daté — journal, lettres, mémoires.
- Des **descriptions** de paysages, de plantes, d’animaux, de peuples.
- Un vocabulaire de la **découverte** et de l’**étonnement** : « jamais vu », « merveille », « étrange ».
- Le recours à la **comparaison** avec le connu, seul moyen de faire imaginer l’inconnu au lecteur.

## Le regard sur l’autre
C’est l’enjeu du chapitre. Le voyageur décrit toujours **depuis** sa propre culture :
- il peut verser dans l’**émerveillement** ou dans le **mépris** ;
- il invente parfois la figure du « **bon sauvage** », dont **Montaigne** se sert dans « Des cannibales » (*Essais*, 1580) pour critiquer sa propre société : les vrais barbares, écrit-il, ne sont peut-être pas ceux qu’on croit.

> Un récit de voyage renseigne autant sur celui qui regarde que sur ce qu’il regarde.

## Vérité et invention
Le voyageur veut être cru : il multiplie les détails précis, les dates, les mesures. Mais il embellit aussi, pour tenir son lecteur — et certains récits mêlent l’observé et l’imaginé sans le signaler.`,
          },
          questions: [
            ['Qu’est-ce qu’un récit de voyage ?', ['Le récit d’un déplacement réel vers des terres lointaines', 'Un roman d’aventures imaginaire', 'Un poème sur l’exil', 'Une pièce de théâtre sur la mer'], 0, 'Le narrateur s’y porte garant de ce qu’il rapporte.'],
            ['Quel voyageur a raconté ses années en Chine vers 1298 ?', ['Marco Polo', 'Christophe Colomb', 'Jean de Léry', 'Jacques Cartier'], 0, 'Son livre est surnommé Le Livre des merveilles.'],
            ['Quel texte de Jean de Léry porte un regard ethnographique sur le Brésil ?', ['Histoire d’un voyage en terre de Brésil', 'Le Devisement du monde', 'Les Essais', 'Le Journal de bord'], 0, 'Publié en 1578.'],
            ['Quelle personne domine dans un récit de voyage ?', ['La première personne, le « je » du voyageur', 'La troisième personne', 'La deuxième personne', 'Un narrateur omniscient'], 0, 'Elle garantit le témoignage.'],
            ['Quel procédé permet de faire imaginer l’inconnu au lecteur ?', ['La comparaison avec ce qu’il connaît déjà', 'L’ellipse', 'Le dialogue', 'Le monologue intérieur'], 0, 'On décrit le nouveau par le familier.'],
            ['Dans quel texte Montaigne interroge-t-il la notion de barbarie ?', ['« Des cannibales », dans les Essais', 'Le Devisement du monde', 'L’École des femmes', 'Le journal de Colomb'], 0, 'Les vrais barbares ne sont peut-être pas ceux qu’on croit.'],
            ['Qu’est-ce que la figure du « bon sauvage » ?', ['L’image d’un peuple lointain vertueux, qui sert à critiquer sa propre société', 'Un personnage de conte merveilleux', 'Un héros de roman d’aventures', 'Un navigateur célèbre'], 0, 'Elle en dit plus sur l’Europe que sur les peuples décrits.'],
            ['Un récit de voyage rapporte uniquement des faits vérifiés.', ['Vrai', 'Faux'], 1, 'Le voyageur embellit souvent pour tenir son lecteur.'],
          ],
        },
        {
          titre: 'Les voyages et la séduction de l’ailleurs dans la poésie',
          axe: 'Se chercher, se construire — Le voyage et l’aventure : pourquoi aller vers l’inconnu ?',
          lecon: {
            titre: 'Partir, rêver de partir, regretter d’être parti',
            cours: `La poésie n’a pas attendu les navires pour voyager : l’**ailleurs** y est un thème constant, et souvent plus rêvé que parcouru.

## Trois façons de traiter le voyage
**1. Le voyage rêvé.**
**Baudelaire**, « L’Invitation au voyage » : « Là, tout n’est qu’ordre et beauté, / Luxe, calme et volupté. » Le pays décrit n’existe pas : il est fait du désir du poète. C’est l’**exotisme** — l’ailleurs comme promesse.

**2. Le voyage comme fuite.**
Fuir l’ennui, la médiocrité, soi-même. Baudelaire encore : « N’importe où hors du monde ». **Rimbaud** part vraiment, à dix-sept ans, et n’écrira plus.

**3. Le retour et le regret.**
**Du Bellay**, dans *Les Regrets* (1558), écrit depuis Rome le plus célèbre poème du mal du pays : « **Heureux qui, comme Ulysse, a fait un beau voyage…** » Le voyageur y préfère « le séjour qu’ont bâti mes aïeux » aux palais romains.

## Les procédés à repérer
- l’**apostrophe** et l’**impératif** : « Mon enfant, ma sœur, / Songe à la douceur… » ;
- l’**énumération** des merveilles entrevues ;
- les **images** — comparaison, métaphore — qui transforment le paysage en état d’âme ;
- la **musicalité** : rythme, allitérations, refrains, qui imitent le bercement du départ ;
- les **noms propres** exotiques, qui font rêver par leur seule sonorité.

## Ulysse, la figure matrice
Depuis l’*Odyssée*, le voyageur poétique est un homme **qui rentre**. Le voyage y vaut moins par les terres traversées que par le retour, et par ce qu’il a fait de celui qui part.

> La poésie du voyage dit rarement un lieu : elle dit un **manque**. C’est pourquoi elle reste lisible quand les cartes ont changé.`,
          },
          questions: [
            ['Quel poème de Baudelaire décrit un pays rêvé « ordre et beauté » ?', ['« L’Invitation au voyage »', '« Le Pont Mirabeau »', '« Demain, dès l’aube… »', '« Le Dormeur du val »'], 0, 'Le pays décrit n’existe pas : il est fait du désir du poète.'],
            ['Qu’est-ce que l’exotisme en poésie ?', ['L’ailleurs présenté comme une promesse séduisante', 'Le récit exact d’un voyage réel', 'La description d’une ville natale', 'Un poème écrit en langue étrangère'], 0, 'Il tient plus du rêve que de l’observation.'],
            ['Quel poète écrit « Heureux qui, comme Ulysse, a fait un beau voyage » ?', ['Du Bellay', 'Baudelaire', 'Rimbaud', 'Hugo'], 0, 'Dans Les Regrets, publié en 1558.'],
            ['Que regrette Du Bellay dans ce sonnet ?', ['Son village natal, préféré aux palais romains', 'Son départ manqué', 'Sa jeunesse perdue', 'Un amour disparu'], 0, 'C’est le poème du mal du pays.'],
            ['Quelle figure antique sert de modèle au voyageur poétique ?', ['Ulysse', 'Achille', 'Hercule', 'Énée'], 0, 'Le voyage y vaut par le retour.'],
            ['Quel procédé imite le bercement du départ ?', ['La musicalité : rythme, allitérations, refrains', 'L’ellipse narrative', 'Le dialogue', 'La chute'], 0, 'La forme y produit une sensation autant que le sens.'],
            ['Pourquoi les noms propres exotiques sont-ils employés en poésie ?', ['Pour faire rêver par leur seule sonorité', 'Pour situer précisément l’action', 'Pour justifier le voyage', 'Pour dater le poème'], 0, 'Le son y compte autant que le lieu désigné.'],
            ['Les poètes qui chantent l’ailleurs y sont toujours allés.', ['Vrai', 'Faux'], 1, 'L’ailleurs poétique est le plus souvent rêvé, pas parcouru.'],
          ],
        },
        {
          titre: 'Le roman d’aventures',
          axe: 'Se chercher, se construire — Le voyage et l’aventure : pourquoi aller vers l’inconnu ?',
          lecon: {
            titre: 'Un héros, un départ, des épreuves',
            cours: `## Ce qui fait un roman d’aventures
- Un **héros** jeune, courageux, souvent seul, qui quitte son cadre habituel ;
- un **départ** vers l’inconnu — île, jungle, mer, pays lointain ;
- une succession d’**épreuves** et de **rebondissements** ;
- des **péripéties** dangereuses : tempêtes, poursuites, captivités, trahisons ;
- un **suspense** entretenu par les fins de chapitre ;
- un **dénouement** où le héros revient transformé.

## Les grands titres
- **Daniel Defoe**, *Robinson Crusoé* (1719) : le naufragé qui reconstruit une civilisation sur son île ;
- **Jules Verne**, *Le Tour du monde en 80 jours*, *Vingt mille lieues sous les mers*, *L’Île mystérieuse* ;
- **Robert Louis Stevenson**, *L’Île au trésor* (1883) ;
- **Jack London**, *L’Appel de la forêt* ;
- **Alexandre Dumas**, *Les Trois Mousquetaires*, à la frontière du roman historique.

## Le rythme du récit
C’est le point technique du chapitre :
- la **scène** : le récit prend le temps de l’action, dialogue compris ;
- le **sommaire** : plusieurs jours résumés en quelques lignes ;
- l’**ellipse** : un passage de temps passé sous silence ;
- la **pause** : une description qui suspend l’action.

Un roman d’aventures alterne ces vitesses : il accélère dans le danger, ralentit pour faire voir.

## Le narrateur
Souvent **interne** — le héros raconte lui-même, ce qui rend l’aventure plus vive et le lecteur plus proche. Parfois **externe**, pour ménager le suspense en montrant ce que le héros ignore.

## Ce que le genre raconte vraiment
Sous les tempêtes et les trésors, le roman d’aventures est presque toujours un **récit d’apprentissage** : le héros part enfant et revient adulte. L’île, la jungle ou la mer sont les épreuves qui le construisent.

> C’est pourquoi le genre parle si bien aux lecteurs de 5e : il raconte, sous forme d’exploits, ce que c’est que de grandir.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise un roman d’aventures ?', ['Un héros qui quitte son cadre habituel et affronte des épreuves', 'Une intrigue sentimentale', 'Un récit sans action', 'Une enquête policière'], 0, 'Rebondissements et suspense en sont les moteurs.'],
            ['Quel roman de 1719 raconte l’histoire d’un naufragé sur une île ?', ['Robinson Crusoé', 'L’Île au trésor', 'L’Appel de la forêt', 'Vingt mille lieues sous les mers'], 0, 'De Daniel Defoe.'],
            ['Qui a écrit L’Île au trésor ?', ['Robert Louis Stevenson', 'Jules Verne', 'Jack London', 'Alexandre Dumas'], 0, 'Publié en 1883.'],
            ['Qu’est-ce qu’une ellipse narrative ?', ['Un passage de temps passé sous silence', 'Une description détaillée', 'Un dialogue rapporté', 'Un retour en arrière'], 0, 'Elle accélère le récit.'],
            ['Qu’est-ce qu’une pause dans un récit ?', ['Une description qui suspend l’action', 'Un chapitre sans personnage', 'Une fin de chapitre', 'Un résumé de plusieurs jours'], 0, 'Le sommaire, lui, résume.'],
            ['Quel effet produit un narrateur interne ?', ['Il rend l’aventure plus vive et rapproche le lecteur du héros', 'Il permet de tout savoir', 'Il supprime le suspense', 'Il ralentit le récit'], 0, 'Un narrateur externe permet, lui, de montrer ce que le héros ignore.'],
            ['Que raconte au fond un roman d’aventures ?', ['Un apprentissage : le héros part enfant et revient adulte', 'Une enquête historique', 'Une critique politique', 'Un amour contrarié'], 0, 'Les épreuves construisent le personnage.'],
            ['Un roman d’aventures maintient le même rythme du début à la fin.', ['Vrai', 'Faux'], 1, 'Il alterne scènes, sommaires, ellipses et pauses.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Avec autrui
        // ===================================================================
        {
          titre: 'La comédie au XVIIe siècle : L’École des femmes, Molière',
          axe: 'Vivre en société, participer à la société — Avec autrui : famille, amis, réseaux',
          lecon: {
            titre: 'Faire rire, et faire réfléchir',
            cours: `## La comédie classique
Elle vise à « **corriger les mœurs par le rire** » (*castigat ridendo mores*). Elle met en scène des personnages ordinaires, dans un cadre quotidien, et se termine bien — le plus souvent par un mariage.

Comme la tragédie, elle respecte les **trois unités** (action, lieu, temps) et la **bienséance**.

## Les procédés comiques
- **de mots** : jeux de mots, patois, répétitions, quiproquos verbaux ;
- **de gestes** : chutes, coups, grimaces, déguisements ;
- **de situation** : quiproquo, malentendu, personnage caché qui entend tout ;
- **de caractère** : un défaut poussé jusqu’à l’absurde ;
- **de répétition** : une réplique qui revient et devient drôle par son retour même.

## L’École des femmes (1662)
**Arnolphe**, un homme mûr, terrifié à l’idée d’être trompé, a fait élever **Agnès** dans l’**ignorance** totale depuis l’âge de quatre ans, pour qu’elle devienne une épouse docile. Il compte l’épouser.

Mais Agnès rencontre **Horace**, jeune homme sans fortune — et, par une ironie parfaite, celui-ci raconte naïvement ses progrès amoureux à Arnolphe, sans savoir qu’il parle au rival. Agnès s’éveille à l’intelligence et au sentiment ; Arnolphe, qui l’aime réellement, échoue et reste seul.

## Ce que la pièce met en jeu
- L’**éducation** des filles : faut-il les instruire ou les tenir dans l’ignorance ?
- Le **mariage** forcé et l’autorité des tuteurs ;
- la **liberté** de choisir sa vie.

> Agnès ne devient pas amoureuse **malgré** son ignorance : elle devient intelligente **en** devenant amoureuse. C’est l’ignorance, et non la nature, qui la tenait enfermée.

## Un scandale
La pièce déclencha une violente querelle : on reprocha à Molière son immoralité et son irrespect. Il répondit par deux pièces, *La Critique de l’École des femmes* et *L’Impromptu de Versailles* — le théâtre se défendant par le théâtre.`,
          },
          questions: [
            ['Quel est le but affiché de la comédie classique ?', ['Corriger les mœurs par le rire', 'Provoquer la terreur et la pitié', 'Raconter l’histoire des rois', 'Enseigner la religion'], 0, 'La formule latine est castigat ridendo mores.'],
            ['Qu’est-ce qu’un comique de caractère ?', ['Un défaut poussé jusqu’à l’absurde', 'Un jeu de mots répété', 'Une chute sur scène', 'Un malentendu entre personnages'], 0, 'Le comique de situation repose, lui, sur le quiproquo.'],
            ['Comment Arnolphe a-t-il fait élever Agnès ?', ['Dans l’ignorance totale, pour en faire une épouse docile', 'Au couvent, pour la protéger', 'Chez ses parents, à la campagne', 'Avec les meilleurs précepteurs'], 0, 'Depuis l’âge de quatre ans.'],
            ['Quelle ironie structure la pièce ?', ['Horace raconte ses progrès amoureux à Arnolphe sans savoir qu’il est son rival', 'Agnès se déguise en homme', 'Arnolphe se fait passer pour Horace', 'Agnès ignore l’existence d’Horace'], 0, 'Le spectateur en sait plus que les personnages.'],
            ['Comment la pièce se termine-t-elle pour Arnolphe ?', ['Il échoue et reste seul', 'Il épouse Agnès', 'Il pardonne aux amoureux et les marie', 'Il quitte la ville avec Agnès'], 0, 'Il l’aimait pourtant réellement.'],
            ['Quelle question la pièce pose-t-elle sur l’éducation ?', ['Faut-il instruire les filles ou les tenir dans l’ignorance ?', 'Faut-il envoyer les enfants à l’école publique ?', 'Faut-il enseigner le latin ?', 'Faut-il séparer garçons et filles ?'], 0, 'Agnès s’éveille à l’intelligence en s’éveillant au sentiment.'],
            ['Comment Molière a-t-il répondu à la querelle suscitée par la pièce ?', ['Par deux nouvelles pièces de théâtre', 'Par une lettre au roi', 'Par un procès', 'Par le silence'], 0, 'La Critique de l’École des femmes et L’Impromptu de Versailles.'],
            ['La comédie classique se termine généralement mal.', ['Vrai', 'Faux'], 1, 'Elle finit bien, le plus souvent par un mariage.'],
          ],
        },
        {
          titre: 'Les récits d’enfance et d’adolescence',
          axe: 'Vivre en société, participer à la société — Avec autrui : famille, amis, réseaux',
          lecon: {
            titre: 'Se raconter enfant, des années plus tard',
            cours: `## Le genre
Un **récit d’enfance** est le récit que fait un adulte de ses jeunes années. Il relève le plus souvent de l’**autobiographie** : l’auteur, le narrateur et le personnage principal sont **la même personne** — c’est le « pacte autobiographique » défini par Philippe Lejeune.

## Les grands textes
- **Rousseau**, *Les Confessions* (1782), qui inaugure le genre moderne ;
- **Marcel Pagnol**, *La Gloire de mon père*, *Le Château de ma mère* ;
- **Romain Gary**, *La Promesse de l’aube* ;
- **Nathalie Sarraute**, *Enfance* ;
- **Hervé Bazin**, *Vipère au poing*, où la famille est un lieu de guerre ;
- **Azouz Begag**, *Le Gone du Chaâba* ;
- et, du côté du roman, **Hugo** avec Gavroche ou **Dickens** avec Oliver Twist.

## Les deux « je »
C’est la clé de lecture du chapitre. Deux voix se superposent :
- le **je narrant** : l’adulte qui écrit, qui commente, qui juge, qui sait ce qui va arriver ;
- le **je narré** : l’enfant qu’il était, qui ne savait pas.

L’écart entre les deux crée l’**ironie**, la **tendresse** ou le **regret**, selon la distance que l’auteur choisit.

## Les procédés
- Les **temps du passé** : imparfait pour le décor et les habitudes, passé simple ou passé composé pour les événements ;
- les **retours en arrière** et les **anticipations** (« je ne savais pas encore que… ») ;
- les **sensations** — odeurs, sons, lumières —, qui font revenir le souvenir plus sûrement que les faits ;
- le **portrait** des adultes, vus d’en bas, souvent agrandis par le regard de l’enfant.

## Autobiographie ou roman ?
- L’**autobiographie** promet la vérité.
- Le **roman autobiographique** s’en inspire mais assume la fiction.
- L’**autofiction** mêle les deux volontairement.

> La mémoire n’enregistre pas, elle **reconstruit**. Tout récit d’enfance est donc en partie une invention — non par mensonge, mais par nature.`,
          },
          questions: [
            ['Qu’est-ce que le pacte autobiographique ?', ['L’auteur, le narrateur et le personnage principal sont la même personne', 'Un contrat entre l’auteur et son éditeur', 'La promesse de ne rien inventer', 'L’engagement d’écrire à la première personne'], 0, 'La notion a été définie par Philippe Lejeune.'],
            ['Quelle œuvre de Rousseau inaugure l’autobiographie moderne ?', ['Les Confessions', 'Émile', 'Le Contrat social', 'La Nouvelle Héloïse'], 0, 'Publiée en 1782.'],
            ['Que désigne le « je narrant » ?', ['L’adulte qui écrit et commente', 'L’enfant dont on parle', 'Le lecteur', 'Un personnage secondaire'], 0, 'Le « je narré » est l’enfant qu’il était.'],
            ['Qu’est-ce que l’écart entre les deux « je » produit ?', ['De l’ironie, de la tendresse ou du regret', 'Une erreur de narration', 'Un changement de genre', 'Une rupture de la chronologie'], 0, 'C’est la distance choisie par l’auteur.'],
            ['Quel temps sert au décor et aux habitudes dans un récit d’enfance ?', ['L’imparfait', 'Le passé simple', 'Le présent', 'Le futur'], 0, 'Le passé simple ou composé porte, lui, les événements.'],
            ['Qu’est-ce qui fait le plus sûrement revenir un souvenir dans ces récits ?', ['Les sensations : odeurs, sons, lumières', 'Les dates précises', 'Les noms des lieux', 'Les documents d’archives'], 0, 'C’est le ressort du souvenir chez Proust comme chez Pagnol.'],
            ['Quelle différence y a-t-il entre autobiographie et autofiction ?', ['L’autobiographie promet la vérité, l’autofiction assume le mélange avec la fiction', 'L’autofiction est plus courte', 'L’autobiographie est écrite à la troisième personne', 'Il n’y a aucune différence'], 0, 'Le roman autobiographique s’inspire du vécu en assumant la fiction.'],
            ['Un récit d’enfance restitue fidèlement le passé.', ['Vrai', 'Faux'], 1, 'La mémoire reconstruit : tout récit d’enfance est en partie une invention.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Imaginer des univers nouveaux
        // ===================================================================
        {
          titre: 'Le conte merveilleux',
          axe: 'Regarder le monde, inventer des mondes — Imaginer des univers nouveaux',
          lecon: {
            titre: 'Un monde où le surnaturel ne surprend personne',
            cours: `## Ce qui définit le merveilleux
Dans un conte merveilleux, le **surnaturel** est **admis d’emblée** : personne ne s’étonne qu’un animal parle ou qu’une fée apparaisse. C’est ce qui le distingue du **fantastique**, où l’inexplicable fait irruption dans un monde réaliste et provoque le doute.

## Les marques du conte
- une **formule d’ouverture** : « Il était une fois… », qui installe un temps et un lieu indéterminés ;
- des **personnages types** plus que des individus : le héros, la princesse, l’ogre, la marâtre, la fée, l’adjuvant ;
- des **objets magiques** : baguette, bottes de sept lieues, miroir, anneau ;
- des **nombres symboliques** : trois épreuves, sept nains, cent ans de sommeil ;
- une **fin heureuse** et souvent une **morale**.

## Le schéma narratif
1. **Situation initiale** — l’équilibre de départ ;
2. **élément perturbateur** — ce qui rompt cet équilibre ;
3. **péripéties** — les épreuves du héros ;
4. **élément de résolution** — ce qui dénoue ;
5. **situation finale** — le nouvel équilibre.

## Le schéma actanciel
Le héros (**sujet**) poursuit un **objet** ; il est aidé par des **adjuvants**, gêné par des **opposants** ; un **destinateur** l’envoie, un **destinataire** profite du résultat.

## Les grands auteurs
- **Charles Perrault** (*Contes*, 1697) : Le Petit Chaperon rouge, Cendrillon, Le Chat botté — versions écrites, avec moralités en vers ;
- les **frères Grimm**, qui collectent les contes allemands au XIXe siècle ;
- **Andersen**, qui les invente plus qu’il ne les recueille.

## À quoi sert un conte
Il divertit, mais il **enseigne** aussi : prudence, courage, patience, méfiance envers les apparences. Sous une forme simple, il met en scène des peurs profondes — l’abandon, la faim, la mort, la cruauté des adultes.

> Le conte n’est pas naïf : c’est une histoire simple qui traite de choses très graves.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise le merveilleux ?', ['Le surnaturel y est admis sans étonner personne', 'Le surnaturel y provoque le doute', 'Il n’y a aucun élément surnaturel', 'Le surnaturel y est expliqué scientifiquement'], 0, 'C’est ce qui le distingue du fantastique.'],
            ['Quelle formule ouvre traditionnellement un conte ?', ['« Il était une fois… »', '« Ceci est une histoire vraie »', '« En l’an de grâce… »', '« Écoutez, bonnes gens »'], 0, 'Elle installe un temps et un lieu indéterminés.'],
            ['Quelles sont les cinq étapes du schéma narratif ?', ['Situation initiale, élément perturbateur, péripéties, résolution, situation finale', 'Introduction, développement, conclusion', 'Exposition, nœud, dénouement', 'Prologue, épreuves, épilogue'], 0, 'C’est la structure de la plupart des contes.'],
            ['Qu’est-ce qu’un adjuvant dans le schéma actanciel ?', ['Un personnage qui aide le héros', 'Un personnage qui s’oppose au héros', 'L’objet de la quête', 'Celui qui envoie le héros'], 0, 'L’opposant le gêne.'],
            ['Qui a publié les Contes en 1697 ?', ['Charles Perrault', 'Les frères Grimm', 'Andersen', 'La Fontaine'], 0, 'Avec des moralités en vers.'],
            ['Que font les frères Grimm au XIXe siècle ?', ['Ils collectent les contes populaires allemands', 'Ils inventent des contes entièrement nouveaux', 'Ils traduisent Perrault', 'Ils écrivent des romans d’aventures'], 0, 'Andersen, lui, invente plus qu’il ne recueille.'],
            ['Quels nombres reviennent souvent dans les contes ?', ['Trois, sept et cent', 'Deux, quatre et huit', 'Cinq, dix et vingt', 'Six, neuf et douze'], 0, 'Trois épreuves, sept nains, cent ans de sommeil.'],
            ['Le conte merveilleux est une histoire naïve, sans profondeur.', ['Vrai', 'Faux'], 1, 'Sous une forme simple, il traite de l’abandon, de la faim, de la mort et de la cruauté.'],
          ],
        },
        {
          titre: 'L’utopie',
          axe: 'Regarder le monde, inventer des mondes — Imaginer des univers nouveaux',
          lecon: {
            titre: 'Décrire un monde parfait pour juger le sien',
            cours: `## Le mot
**Utopie** est un mot fabriqué par **Thomas More** en **1516**, à partir du grec : *ou-topos*, « **en aucun lieu** ». Le titre complet de son livre annonce déjà l’ambiguïté : il décrit une île parfaite… qui n’existe nulle part.

## Ce qu’est une utopie
Le récit d’une société **idéale**, généralement située :
- dans un lieu **isolé** — une île, une vallée, une planète ;
- hors du temps ordinaire ;
- et découverte par un **voyageur**, qui sert de guide au lecteur.

## Ses traits récurrents
- **égalité** entre les habitants, absence de misère ;
- **propriété commune** ou fortement encadrée ;
- **travail** partagé et limité ;
- **éducation** pour tous ;
- **lois simples**, peu de crimes, peu de juges ;
- une organisation **rationnelle** : villes identiques, horaires réglés, urbanisme géométrique.

## Le vrai sujet : ici, pas là-bas
Une utopie ne décrit jamais vraiment un ailleurs : elle **critique** la société de son auteur par contraste. Chez More, l’île d’Utopie sans propriété privée ni oisiveté vise l’Angleterre de son temps, ses enclosures et sa misère.

C’est une **argumentation indirecte** : montrer ce qui pourrait être, pour faire voir ce qui ne va pas.

## Les grands textes
Platon (*La République*), Thomas More, **Rabelais** avec l’**abbaye de Thélème** et sa règle unique — « Fais ce que voudras » —, Campanella, Fourier, et jusqu’aux cités idéales des architectes.

## La limite, et le passage à la dystopie
Une société parfaite suppose que tout le monde veuille la même chose. Ce qui garantit l’ordre — l’uniformité, la surveillance, l’absence de choix — peut vite devenir **oppressant**. C’est exactement le point où l’utopie bascule en **dystopie**, dès le XXe siècle.

> Toute utopie contient sa propre inquiétude : qui décide de ce qui est parfait, et que fait-on de ceux qui ne sont pas d’accord ?`,
          },
          questions: [
            ['Que signifie le mot « utopie » ?', ['« En aucun lieu », du grec ou-topos', '« Monde parfait »', '« Cité idéale »', '« Rêve éveillé »'], 0, 'Thomas More l’a forgé en 1516.'],
            ['Qui a écrit L’Utopie en 1516 ?', ['Thomas More', 'Platon', 'Rabelais', 'Campanella'], 0, 'Le livre décrit une île parfaite qui n’existe nulle part.'],
            ['Où se situe généralement une utopie ?', ['Dans un lieu isolé, comme une île', 'Dans une capitale européenne', 'Dans un futur proche daté', 'Dans un passé historique précis'], 0, 'Un voyageur la découvre et sert de guide au lecteur.'],
            ['Quel est le véritable sujet d’une utopie ?', ['La critique de la société de son auteur', 'La description d’un pays réel', 'La prédiction de l’avenir', 'L’éloge d’un roi'], 0, 'C’est une argumentation indirecte.'],
            ['Quelle est la règle unique de l’abbaye de Thélème chez Rabelais ?', ['« Fais ce que voudras »', '« Prie et travaille »', '« Connais-toi toi-même »', '« Obéis en silence »'], 0, 'Une utopie fondée sur la liberté, non sur le règlement.'],
            ['Quels traits reviennent dans les sociétés utopiques ?', ['Égalité, travail partagé, éducation pour tous et lois simples', 'Hiérarchie stricte et privilèges héréditaires', 'Guerre permanente', 'Absence de toute organisation'], 0, 'L’organisation y est rationnelle, parfois jusqu’à l’excès.'],
            ['Pourquoi l’utopie peut-elle basculer en dystopie ?', ['Parce que l’uniformité et l’absence de choix deviennent oppressantes', 'Parce que les habitants s’ennuient', 'Parce que le voyageur repart', 'Parce que le lieu est trop isolé'], 0, 'Qui décide de ce qui est parfait ?'],
            ['Une utopie décrit un pays réel que l’auteur a visité.', ['Vrai', 'Faux'], 1, 'Le mot lui-même signifie « en aucun lieu ».'],
          ],
        },
        {
          titre: 'La dystopie',
          axe: 'Regarder le monde, inventer des mondes — Imaginer des univers nouveaux',
          lecon: {
            titre: 'Le cauchemar qui se présente comme un idéal',
            cours: `## La définition
Une **dystopie** (ou contre-utopie) décrit une société **en apparence parfaite**, mais en réalité **totalitaire** : l’ordre y est obtenu au prix de la liberté. C’est l’inverse exact de l’utopie — et son prolongement logique.

## Les traits du genre
- Un **régime** qui contrôle tout : information, travail, loisirs, famille, pensée ;
- une **surveillance** permanente ;
- la **propagande** et la **réécriture** du passé ;
- l’**uniformisation** des individus, souvent désignés par des numéros ;
- l’élimination des **opposants** ;
- un **héros** qui prend conscience et tente de résister — et qui, très souvent, échoue.

## Les grands textes
- **Evgueni Zamiatine**, *Nous autres* (1920), le premier du genre ;
- **Aldous Huxley**, *Le Meilleur des mondes* (1932) : une société où l’on est heureux par conditionnement et par drogue ;
- **George Orwell**, *1984* (1949) : Big Brother, la police de la pensée, la **novlangue** — une langue appauvrie pour rendre la révolte littéralement impensable ;
- **Ray Bradbury**, *Fahrenheit 451* (1953) : des pompiers qui brûlent les livres ;
- pour la jeunesse : *Hunger Games*, *Divergente*, *Le Passeur* de Lois Lowry.

## Deux formes d’oppression
- Chez **Orwell**, on obéit par **peur** : la surveillance et la torture.
- Chez **Huxley**, on obéit par **plaisir** : le divertissement et le confort suffisent à faire renoncer à la liberté.

> Huxley redoutait qu’on n’ait plus besoin d’interdire les livres, parce que plus personne n’aurait envie d’en lire.

## Une fiction qui parle du présent
Comme l’utopie, la dystopie **avertit** : elle prend une tendance de son époque — la propagande, la technique, la surveillance, le divertissement de masse — et la pousse à l’extrême pour la rendre visible.

## Le repérage en classe
Chercher **qui détient le pouvoir**, **ce qui est interdit**, **comment on surveille**, **ce que le héros découvre** et **ce que le récit reproche à notre monde**.`,
          },
          questions: [
            ['Qu’est-ce qu’une dystopie ?', ['Une société en apparence parfaite mais en réalité totalitaire', 'Une société idéale et libre', 'Un récit de voyage imaginaire', 'Un conte merveilleux moderne'], 0, 'C’est l’inverse et le prolongement de l’utopie.'],
            ['Quel roman de 1949 met en scène Big Brother et la novlangue ?', ['1984, de George Orwell', 'Le Meilleur des mondes', 'Fahrenheit 451', 'Nous autres'], 0, 'La police de la pensée y surveille jusqu’aux idées.'],
            ['Qu’est-ce que la novlangue dans 1984 ?', ['Une langue appauvrie pour rendre la révolte impensable', 'Une langue étrangère imposée', 'Le langage secret des résistants', 'Un code informatique'], 0, 'Réduire le vocabulaire, c’est réduire ce qu’on peut penser.'],
            ['Comment obtient-on l’obéissance dans Le Meilleur des mondes ?', ['Par le plaisir, le conditionnement et la drogue', 'Par la peur et la torture', 'Par la famine', 'Par l’isolement complet'], 0, 'Chez Orwell, à l’inverse, on obéit par peur.'],
            ['Que font les pompiers dans Fahrenheit 451 ?', ['Ils brûlent les livres', 'Ils éteignent les incendies', 'Ils surveillent les frontières', 'Ils réécrivent les journaux'], 0, 'Le titre désigne la température d’inflammation du papier.'],
            ['Quel roman de 1920 est considéré comme la première dystopie ?', ['Nous autres, de Zamiatine', '1984', 'Le Meilleur des mondes', 'L’Utopie'], 0, 'Il a directement inspiré Orwell et Huxley.'],
            ['Que fait une dystopie à une tendance de son époque ?', ['Elle la pousse à l’extrême pour la rendre visible', 'Elle la décrit fidèlement', 'Elle l’ignore volontairement', 'Elle la situe dans le passé'], 0, 'C’est un avertissement, pas une prédiction.'],
            ['Dans une dystopie, le héros triomphe généralement du régime.', ['Vrai', 'Faux'], 1, 'Il prend conscience et résiste, mais échoue le plus souvent : c’est ce qui rend l’avertissement efficace.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Héros, héroïnes et héroïsme
        // ===================================================================
        {
          titre: 'Le héros médiéval',
          axe: 'Agir sur le monde — Héros / héroïnes et héroïsme',
          lecon: {
            titre: 'Le chevalier, entre prouesse et courtoisie',
            cours: `## Deux grandes familles de récits
- La **chanson de geste** (XIe-XIIe siècles) : un récit en vers, chanté par les **jongleurs**, qui célèbre les exploits guerriers et la fidélité au seigneur. Modèle : **La Chanson de Roland** (vers 1100).
- Le **roman de chevalerie** (XIIe-XIIIe) : écrit pour être lu, il ajoute l’**amour** et la **quête** intérieure. Modèle : **Chrétien de Troyes** (*Yvain ou le Chevalier au lion*, *Perceval ou le Conte du Graal*, *Lancelot*).

## Les valeurs du chevalier
- la **prouesse** : le courage et la force au combat ;
- la **loyauté** envers son seigneur — c’est le lien vassalique ;
- la **foi** : le chevalier chrétien combat pour Dieu ;
- la **générosité** (largesse) envers les pauvres et les vaincus ;
- la **courtoisie** : le respect des dames, la maîtrise de soi, l’élégance des manières ;
- la **démesure** est le défaut à éviter — Roland refuse de sonner l’olifant par orgueil, et tous ses hommes en meurent.

## La Chanson de Roland
L’arrière-garde de Charlemagne est attaquée à **Roncevaux**. **Roland**, neveu de l’empereur, refuse d’appeler à l’aide tant qu’il est temps ; il sonne son cor trop tard, meurt le visage tourné vers l’ennemi, et Charlemagne vient venger les siens. Le poème est écrit en **laisses** — des strophes de longueur variable, sur une même assonance.

## L’amour courtois
Le chevalier sert une **dame** souvent inaccessible ; il accomplit des exploits **pour** elle, et cette souffrance amoureuse le rend meilleur. La femme y prend, pour la première fois dans la littérature occidentale, une position **haute**.

## Le merveilleux
Fées, enchanteurs (**Merlin**), objets magiques, animaux qui parlent, **Graal** : le surnaturel fait partie du monde, sans surprendre personne — comme dans le conte.

> Le héros médiéval n’est pas seulement fort : il est **exemplaire**. Sa vie sert de modèle à ceux qui l’écoutent.`,
          },
          questions: [
            ['Qu’est-ce qu’une chanson de geste ?', ['Un récit en vers célébrant les exploits guerriers, chanté par les jongleurs', 'Un roman écrit pour être lu', 'Un poème d’amour courtois', 'Une pièce de théâtre médiévale'], 0, 'La Chanson de Roland en est le modèle.'],
            ['Quel auteur écrit les grands romans de chevalerie au XIIe siècle ?', ['Chrétien de Troyes', 'Charles Perrault', 'François Rabelais', 'Joachim du Bellay'], 0, 'Yvain, Perceval, Lancelot.'],
            ['Quelle est la faute de Roland à Roncevaux ?', ['La démesure : il refuse par orgueil de sonner l’olifant à temps', 'La lâcheté devant l’ennemi', 'La trahison de Charlemagne', 'L’abandon de sa dame'], 0, 'Tous ses hommes en meurent.'],
            ['Qu’est-ce que la courtoisie ?', ['Le respect des dames, la maîtrise de soi et l’élégance des manières', 'La force au combat', 'La fidélité au seigneur', 'La générosité envers les pauvres'], 0, 'La prouesse désigne, elle, le courage guerrier.'],
            ['Comment appelle-t-on les strophes de La Chanson de Roland ?', ['Des laisses', 'Des quatrains', 'Des stances', 'Des couplets'], 0, 'De longueur variable, sur une même assonance.'],
            ['Qu’est-ce que l’amour courtois ?', ['Le service d’une dame souvent inaccessible, qui rend le chevalier meilleur', 'Un mariage arrangé', 'Un amour partagé et heureux', 'L’amour du seigneur pour son vassal'], 0, 'La femme y occupe pour la première fois une position haute.'],
            ['Quelle place tient le merveilleux dans les romans de chevalerie ?', ['Il fait partie du monde sans surprendre personne', 'Il provoque le doute et la peur', 'Il est absent du genre', 'Il est expliqué rationnellement'], 0, 'Fées, enchanteurs, Graal : comme dans le conte.'],
            ['Le héros médiéval se définit uniquement par sa force au combat.', ['Vrai', 'Faux'], 1, 'Loyauté, foi, générosité et courtoisie comptent autant que la prouesse.'],
          ],
        },
        {
          titre: 'Le héros de l’Antiquité',
          axe: 'Agir sur le monde — Héros / héroïnes et héroïsme',
          lecon: {
            titre: 'Demi-dieux, exploits et destin',
            cours: `## Qu’est-ce qu’un héros antique ?
Dans la mythologie grecque, le **héros** est un personnage exceptionnel, souvent né d’un dieu et d’une mortelle. Il n’est ni tout à fait dieu, ni tout à fait homme : il accomplit des exploits surhumains, mais il **meurt**.

## Les grandes figures
- **Achille**, le meilleur guerrier de l’*Iliade*, invulnérable sauf au talon. Il choisit une vie **courte et glorieuse** plutôt que longue et obscure.
- **Ulysse**, héros de l’*Odyssée* : sa force est la **ruse** (le cheval de Troie, le Cyclope) et la **ténacité** — dix ans pour rentrer à Ithaque.
- **Héraclès** (Hercule), et ses **douze travaux**, expiation d’une faute.
- **Thésée** et le **Minotaure**, sauvé par le fil d’**Ariane**.
- **Persée**, **Jason** et la Toison d’or, **Antigone** qui désobéit au roi au nom d’une loi supérieure.
- Chez les Romains : **Énée**, héros de l’*Énéide* de Virgile, fondateur mythique de Rome.

## Les traits communs
- une **naissance** extraordinaire, souvent accompagnée d’un oracle ;
- des **épreuves** imposées, presque toujours par les dieux ;
- des **monstres** à vaincre : Cyclope, Hydre, Minotaure, Méduse ;
- un **défaut** qui coûte cher — la colère d’Achille, la curiosité, l’orgueil (**hybris**), toujours puni par les dieux ;
- un **destin** fixé d’avance, que le héros ne peut pas fuir.

## Deux modèles d’héroïsme
Achille et Ulysse s’opposent terme à terme : la **force** contre la **ruse**, la gloire contre le retour, la mort jeune contre la survie. Toute la littérature occidentale se partagera entre ces deux figures.

## Les œuvres
L’*Iliade* et l’*Odyssée*, attribuées à **Homère** (VIIIe siècle av. J.-C.), les *Métamorphoses* d’**Ovide**, l’*Énéide* de **Virgile**.

> Le héros antique n’est pas un modèle moral : il est **admirable et faillible** à la fois. C’est cette ambiguïté qui le rend inépuisable.`,
          },
          questions: [
            ['Qu’est-ce qu’un héros dans la mythologie grecque ?', ['Un personnage exceptionnel, souvent né d’un dieu et d’une mortelle, mais qui meurt', 'Un dieu immortel', 'Un roi élu par le peuple', 'Un prêtre du temple'], 0, 'Ni tout à fait dieu, ni tout à fait homme.'],
            ['Quel choix Achille fait-il ?', ['Une vie courte et glorieuse plutôt que longue et obscure', 'Le retour à la maison', 'La fuite devant Troie', 'La paix avec les Troyens'], 0, 'C’est le sens même de sa figure.'],
            ['Quelle est la force principale d’Ulysse ?', ['La ruse et la ténacité', 'La force physique', 'La richesse', 'La beauté'], 0, 'Le cheval de Troie et le Cyclope en témoignent.'],
            ['Combien de travaux Héraclès doit-il accomplir ?', ['Douze', 'Sept', 'Dix', 'Vingt'], 0, 'En expiation d’une faute.'],
            ['Qu’est-ce que l’hybris ?', ['La démesure, l’orgueil excessif, toujours puni par les dieux', 'Le courage au combat', 'La fidélité à sa patrie', 'La ruse'], 0, 'C’est le défaut central des héros antiques.'],
            ['Qui aide Thésée à sortir du labyrinthe ?', ['Ariane, avec son fil', 'Athéna', 'Le Minotaure lui-même', 'Dédale seul'], 0, 'Le fil lui permet de retrouver son chemin.'],
            ['Quel héros romain fonde mythiquement Rome dans l’Énéide ?', ['Énée', 'Ulysse', 'Achille', 'Romulus'], 0, 'L’épopée est de Virgile.'],
            ['Le héros antique est un modèle moral irréprochable.', ['Vrai', 'Faux'], 1, 'Il est admirable et faillible à la fois : sa colère ou son orgueil le perdent souvent.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : L'être humain est-il maître de la nature ?
        // ===================================================================
        {
          titre: 'La révolution industrielle, facteur de rupture entre l’Homme et la nature',
          axe: 'Questionnements complémentaires — L’être humain est-il maître de la nature ?',
          lecon: {
            titre: 'La littérature face aux machines',
            cours: `## Le contexte
Au **XIXe siècle**, la machine à vapeur, le charbon, le chemin de fer et l’usine transforment l’Europe en quelques décennies. Les campagnes se vident, les villes industrielles enflent, un nouveau monde apparaît — et avec lui, une nouvelle **question littéraire** : que devient l’homme dans ce monde qu’il a fabriqué ?

## Deux regards opposés
**L’enthousiasme.** Le progrès promet de vaincre la maladie, la distance, la nuit. **Jules Verne** en fait la matière de ses romans ; **Hugo** salue le train comme un poème. La technique y est une conquête.

**L’inquiétude.** La même machine détruit les paysages, épuise les corps et rompt le lien avec la nature.
- **Zola**, *Germinal* (1885) : la mine est décrite comme un monstre vivant qui **dévore** les hommes — « une bête goulue » ;
- **Zola**, *La Bête humaine* : la locomotive devient un personnage ;
- **Hugo**, *Les Misérables*, sur la misère urbaine.

## Le procédé central : la personnification
La machine, l’usine, la mine sont dotées d’un **corps** et d’une **volonté**. Elles respirent, avalent, grondent. À l’inverse, l’ouvrier est décrit comme une **chose** : un rouage, un outil. Ce **renversement** — la machine vivante et l’homme mécanisé — est la trouvaille majeure du roman industriel.

## Le romantisme et la nature refuge
Face à cela, les romantiques font de la **nature** un refuge et un miroir de l’âme : **Rousseau** déjà, puis **Lamartine**, **Hugo**, et plus tard **Giono**, qui oppose la vie paysanne à la modernité.

## Ce que le chapitre met en jeu
L’homme est-il **maître** de la nature — ou en fait-il partie ? La révolution industrielle donne à cette question une portée nouvelle : pour la première fois, l’activité humaine transforme la planète à grande échelle.

> Les textes du XIXe siècle formulent, avec un siècle et demi d’avance, les questions écologiques d’aujourd’hui.`,
          },
          questions: [
            ['Quelles inventions transforment l’Europe au XIXe siècle ?', ['La machine à vapeur, le charbon, le chemin de fer et l’usine', 'L’électricité et l’informatique', 'L’imprimerie et la boussole', 'Le moteur à explosion seul'], 0, 'Les campagnes se vident, les villes industrielles enflent.'],
            ['Dans quel roman Zola décrit-il la mine comme un monstre dévorant ?', ['Germinal', 'L’Assommoir', 'La Bête humaine', 'Nana'], 0, 'Publié en 1885.'],
            ['Quel procédé donne à la machine un corps et une volonté ?', ['La personnification', 'L’ellipse', 'L’antithèse', 'La litote'], 0, 'Elle respire, avale et gronde.'],
            ['Quel renversement caractérise le roman industriel ?', ['La machine devient vivante et l’ouvrier devient une chose', 'L’ouvrier devient patron', 'La ville remplace la campagne', 'Le narrateur devient personnage'], 0, 'C’est la trouvaille majeure du genre.'],
            ['Quel roman de Zola fait de la locomotive un personnage ?', ['La Bête humaine', 'Germinal', 'Au Bonheur des Dames', 'L’Assommoir'], 0, 'La machine y a un nom et un caractère.'],
            ['Que représente la nature pour les romantiques ?', ['Un refuge et un miroir de l’âme', 'Un obstacle à vaincre', 'Une ressource à exploiter', 'Un décor sans importance'], 0, 'Rousseau, Lamartine et Hugo en font un lieu de consolation.'],
            ['Quel écrivain du XXe siècle oppose la vie paysanne à la modernité ?', ['Giono', 'Zola', 'Verne', 'Hugo'], 0, 'Il prolonge le regard romantique sur la nature.'],
            ['La littérature du XIXe siècle est unanimement enthousiaste face au progrès.', ['Vrai', 'Faux'], 1, 'Deux regards s’opposent : l’enthousiasme de Verne et l’inquiétude de Zola.'],
          ],
        },
        {
          titre: 'Le roman d’anticipation',
          axe: 'Questionnements complémentaires — L’être humain est-il maître de la nature ?',
          lecon: {
            titre: 'Raconter demain pour comprendre aujourd’hui',
            cours: `## La définition
Le **roman d’anticipation** situe son récit dans le **futur** et imagine les conséquences d’une évolution scientifique, technique ou sociale déjà commencée. Il se distingue de la **science-fiction** au sens large par sa proximité avec le présent : il extrapole, il n’invente pas un univers entier.

## Les fondateurs
- **Jules Verne** (*De la Terre à la Lune*, *Vingt mille lieues sous les mers*, *Paris au XXe siècle*) : l’anticipation y est **technique**, documentée, optimiste — le sous-marin, la fusée, le visiophone.
- **H. G. Wells** (*La Machine à explorer le temps*, *La Guerre des mondes*, *L’Île du docteur Moreau*) : l’anticipation y devient **sociale et morale**, et souvent inquiète.

## Le siècle suivant
**Barjavel** (*Ravage*, 1943), **Bradbury**, **Asimov** et ses lois de la robotique, **Orwell** et **Huxley** pour le versant dystopique, et aujourd’hui toute une production sur le climat, l’intelligence artificielle et la génétique.

## Les grands thèmes
- le **progrès technique** et ses effets non prévus ;
- la **catastrophe écologique** ;
- l’**intelligence artificielle** et la place de l’humain ;
- la **manipulation** du vivant ;
- la **surveillance** et la perte des libertés.

## Les procédés d’écriture
- Un **cadre** futur rendu crédible par des détails concrets ;
- un **vocabulaire** technique, parfois inventé — le **néologisme** ;
- une **date** qui ancre le récit et le rend mesurable ;
- des **explications** données au lecteur par un personnage — le savant, le guide, le nouveau venu ;
- le **contraste** entre le monde décrit et le nôtre, qui produit le sens.

> L’anticipation ne prédit pas l’avenir : elle prend une tendance du présent et demande « **et si cela continuait ?** ». Ses erreurs de prédiction ne l’invalident pas, parce que ce n’était pas le but.

## La lecture critique
Devant un tel texte : quelle tendance actuelle est poussée à l’extrême ? qu’est-ce que l’auteur redoute ? qu’est-ce qu’il espère ? Et surtout : que dit ce futur du monde dans lequel il a été écrit ?`,
          },
          questions: [
            ['Qu’est-ce qu’un roman d’anticipation ?', ['Un récit situé dans le futur qui extrapole une évolution déjà commencée', 'Un récit historique', 'Un conte merveilleux', 'Un récit de voyage réel'], 0, 'Il part du présent et demande « et si cela continuait ? ».'],
            ['Quel auteur du XIXe siècle pratique une anticipation technique et optimiste ?', ['Jules Verne', 'H. G. Wells', 'George Orwell', 'Ray Bradbury'], 0, 'Sous-marin, fusée, visiophone y sont documentés.'],
            ['Quel auteur donne à l’anticipation une dimension sociale et inquiète ?', ['H. G. Wells', 'Jules Verne', 'Alexandre Dumas', 'Charles Perrault'], 0, 'La Guerre des mondes, L’Île du docteur Moreau.'],
            ['Quel roman de Barjavel paraît en 1943 ?', ['Ravage', '1984', 'Fahrenheit 451', 'La Machine à explorer le temps'], 0, 'Il imagine l’effondrement d’une civilisation privée d’électricité.'],
            ['Qu’est-ce qu’un néologisme ?', ['Un mot nouveau, inventé pour désigner une réalité nouvelle', 'Une figure de style', 'Un retour en arrière', 'Un type de narrateur'], 0, 'Il rend le monde futur crédible.'],
            ['Comment l’auteur explique-t-il son monde futur au lecteur ?', ['Par un personnage guide : le savant ou le nouveau venu', 'Par des notes de bas de page', 'Par une préface obligatoire', 'Sans jamais l’expliquer'], 0, 'Le procédé évite l’exposé didactique.'],
            ['Que faut-il chercher en lisant un roman d’anticipation ?', ['La tendance actuelle poussée à l’extrême et ce que l’auteur redoute', 'La date exacte de l’action', 'Le nombre de personnages', 'La longueur des chapitres'], 0, 'Le futur décrit parle du présent où il a été écrit.'],
            ['Un roman d’anticipation qui se trompe dans ses prédictions a échoué.', ['Vrai', 'Faux'], 1, 'Prédire n’était pas le but : il s’agissait d’interroger le présent.'],
          ],
        },
        {
          titre: 'L’art de discipliner ou de rêver la nature du Moyen Âge au XVIIe siècle',
          axe: 'Questionnements complémentaires — L’être humain est-il maître de la nature ?',
          lecon: {
            titre: 'Le jardin comme réponse à une question',
            cours: `La façon dont une époque **représente** la nature dit ce qu’elle en pense. Trois moments, trois réponses.

## Le Moyen Âge : la nature encadrée
- Le **jardin clos** (*hortus conclusus*), entouré de murs : un espace protégé, utile (herbes médicinales, légumes) et symbolique — image du paradis retrouvé.
- La **forêt**, à l’inverse, est le lieu du danger, de l’épreuve et du merveilleux : c’est là que les chevaliers de Chrétien de Troyes rencontrent fées, ermites et monstres.
- Dans les **enluminures**, la nature est peinte sans profondeur, en aplats, sur fond d’or : elle est un **signe**, pas un paysage.

## La Renaissance : la nature observée
- L’**humanisme** réhabilite l’observation. **Léonard de Vinci** dessine des plantes, des eaux, des anatomies avec une précision inédite.
- La **perspective** fait entrer la profondeur dans la peinture : le paysage devient un **espace**, et non plus un décor plat.
- Les **jardins italiens** allient géométrie, statues, grottes et jeux d’eau — la nature y est mise en scène, pas contrainte.
- **Ronsard** chante la rose et le temps qui passe : la nature devient miroir du sentiment.

## Le XVIIe siècle : la nature soumise
- Le **jardin à la française** — **Le Nôtre** à **Versailles** — pousse la maîtrise à son terme : axes de symétrie, perspectives infinies, parterres géométriques, arbres taillés, eaux domptées. La nature y devient une **démonstration de pouvoir** : ce que le roi fait aux arbres, il le fait au royaume.
- **La Fontaine**, dans ses *Fables*, se sert au contraire des animaux pour dire la vérité des hommes — la nature y redevient une leçon.
- **Descartes** formule le programme du siècle : l’homme doit se rendre « comme maître et possesseur de la nature ».

> Jardin clos, jardin observé, jardin dompté : trois manières de répondre à la même question, et trois idées de la place de l’homme dans le monde.

## Et après
Le **jardin à l’anglaise** du XVIIIe siècle prendra le contre-pied de Versailles : allées sinueuses, faux désordre, ruines artificielles. La nature n’est plus à soumettre, elle est à **rêver**.`,
          },
          questions: [
            ['Qu’est-ce que l’hortus conclusus médiéval ?', ['Un jardin clos de murs, utile et symbolique', 'Une forêt sacrée', 'Un parc royal ouvert', 'Un potager collectif'], 0, 'Il évoque le paradis retrouvé.'],
            ['Que représente la forêt dans la littérature médiévale ?', ['Le lieu du danger, de l’épreuve et du merveilleux', 'Un espace agricole', 'Un lieu de repos', 'Une frontière politique'], 0, 'Les chevaliers y rencontrent fées, ermites et monstres.'],
            ['Comment la nature est-elle peinte dans les enluminures médiévales ?', ['Sans profondeur, en aplats sur fond d’or', 'Avec une perspective rigoureuse', 'En noir et blanc', 'De façon photographique'], 0, 'Elle est un signe, pas un paysage.'],
            ['Quelle invention de la Renaissance fait entrer la profondeur en peinture ?', ['La perspective', 'Le clair-obscur seul', 'La peinture à l’huile', 'Le fond d’or'], 0, 'Le paysage devient un espace.'],
            ['Qui dessine le jardin de Versailles ?', ['Le Nôtre', 'Léonard de Vinci', 'Descartes', 'Ronsard'], 0, 'Axes de symétrie, perspectives infinies, arbres taillés.'],
            ['Que démontre le jardin à la française ?', ['La maîtrise et le pouvoir du roi sur la nature', 'Le respect de la nature sauvage', 'La pauvreté des moyens techniques', 'La liberté des jardiniers'], 0, 'Ce que le roi fait aux arbres, il le fait au royaume.'],
            ['Quelle formule de Descartes résume le programme du XVIIe siècle ?', ['Se rendre « comme maître et possesseur de la nature »', '« Fais ce que voudras »', '« Connais-toi toi-même »', '« Cultivons notre jardin »'], 0, 'La nature y devient objet de maîtrise.'],
            ['Le jardin à l’anglaise du XVIIIe siècle prolonge le style de Versailles.', ['Vrai', 'Faux'], 1, 'Il en prend le contre-pied : allées sinueuses, faux désordre, nature rêvée.'],
          ],
        },
      ],
    },
  ],
}
