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
            cours: `Un récit de voyage renseigne autant sur celui qui regarde que sur ce qu’il regarde.

## Un genre ancien
Le **récit de voyage** raconte un déplacement **réel** vers des terres lointaines. Il se développe considérablement aux **XVe et XVIe siècles**, quand les navigateurs européens atteignent l’Afrique, l’Amérique et l’Asie.

## Les grands textes
| L’auteur | L’œuvre | Ce qu’elle est |
| **Marco Polo** | *Le Devisement du monde* (vers 1298) | Ses années en Chine, dictées en prison ; surnommé *Le Livre des merveilles* |
| **Christophe Colomb** | Son **journal de bord** (1492) | Un texte administratif devenu document historique |
| **Jean de Léry** | *Histoire d’un voyage en terre de Brésil* (1578) | L’un des premiers regards ethnographiques |
| **Jacques Cartier**, **Bougainville**, **Chateaubriand** | | La suite du genre |

## Les caractéristiques du genre
| Le trait | Ce qu’il produit |
| Un **narrateur** qui dit « je » | Il se porte garant de ce qu’il rapporte |
| Un ordre **chronologique**, souvent daté | Journal, lettres, mémoires |
| Des **descriptions** | Paysages, plantes, animaux, peuples |
| Un vocabulaire de l’**étonnement** | « jamais vu », « merveille », « étrange » |
| La **comparaison** avec le connu | Le seul moyen de faire imaginer l’inconnu |

## Le regard sur l’autre
Le voyageur décrit toujours **depuis** sa propre culture.

~ L’émerveillement ← le regard du voyageur → le mépris

**Montaigne**, dans « Des cannibales » (*Essais*, **1580**), invente la figure du « **bon sauvage** » pour critiquer **sa propre société**.

> Les vrais barbares, écrit-il, ne sont peut-être pas ceux qu’on croit.

## Vérité et invention
!> Le voyageur veut être **cru** : il multiplie les détails précis, les dates, les mesures. Mais il **embellit** aussi, pour tenir son lecteur — et certains récits mêlent l’observé et l’imaginé **sans le signaler**.`,
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
            cours: `La poésie du voyage dit rarement un lieu : elle dit un manque. C’est pourquoi elle reste lisible quand les cartes ont changé.

## Trois façons de traiter le voyage
| La façon | Le poète | Ce qu’il en fait |
| Le voyage **rêvé** | **Baudelaire**, « L’Invitation au voyage » | Le pays décrit n’existe pas : il est fait du **désir** du poète |
| Le voyage comme **fuite** | Baudelaire encore, puis **Rimbaud** | Fuir l’ennui, la médiocrité, soi-même |
| Le **retour** et le **regret** | **Du Bellay**, *Les Regrets* (1558) | Le mal du pays, écrit depuis Rome |

= « Là, tout n’est qu’ordre et beauté, / Luxe, calme et volupté »

= « Heureux qui, comme Ulysse, a fait un beau voyage… »

Du Bellay préfère « le séjour qu’ont bâti mes aïeux » aux palais romains. **Rimbaud**, lui, part vraiment — à dix-sept ans — et n’écrira plus.

## L’exotisme
= L’exotisme, c’est l’ailleurs comme promesse

## Les procédés à repérer
| Le procédé | Son effet |
| L’**apostrophe** et l’**impératif** | « Mon enfant, ma sœur, / Songe à la douceur… » |
| L’**énumération** | Les merveilles entrevues défilent |
| Les **images** | Comparaison et métaphore transforment le paysage en **état d’âme** |
| La **musicalité** | Rythme, allitérations, refrains imitent le bercement du départ |
| Les **noms propres** exotiques | Ils font rêver par leur seule sonorité |

## Ulysse, la figure matrice
!> Depuis l’*Odyssée*, le voyageur poétique est un homme **qui rentre**. Le voyage y vaut moins par les terres traversées que par le **retour**, et par ce qu’il a fait de celui qui part.`,
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
            cours: `Sous les tempêtes et les trésors, le roman d’aventures raconte presque toujours la même chose : ce que c’est que de grandir.

## Ce qui fait un roman d’aventures
~ Un héros jeune → un départ vers l’inconnu → des épreuves → un dénouement où il revient transformé

| L’ingrédient | Son rôle |
| Le **héros** | Jeune, courageux, souvent seul |
| Les **péripéties** | Tempêtes, poursuites, captivités, trahisons |
| Le **suspense** | Entretenu par les fins de chapitre |

## Les grands titres
| L’auteur | L’œuvre |
| **Daniel Defoe** | *Robinson Crusoé* (1719) : le naufragé qui reconstruit une civilisation |
| **Jules Verne** | *Le Tour du monde en 80 jours*, *Vingt mille lieues sous les mers* |
| **Robert Louis Stevenson** | *L’Île au trésor* (1883) |
| **Jack London** | *L’Appel de la forêt* |
| **Alexandre Dumas** | *Les Trois Mousquetaires* |

## Le rythme du récit
| La vitesse | Ce qu’elle fait |
| La **scène** | Le récit prend le temps de l’action, dialogue compris |
| Le **sommaire** | Plusieurs jours résumés en quelques lignes |
| L’**ellipse** | Un passage de temps **passé sous silence** |
| La **pause** | Une description qui suspend l’action |

> Un roman d’aventures **alterne** ces vitesses : il accélère dans le danger, ralentit pour faire voir.

## Le narrateur
| Le narrateur | Ce qu’il permet |
| **Interne** — le héros raconte | L’aventure est plus vive, le lecteur plus proche |
| **Externe** | Le suspense : on montre ce que le héros ignore |

## Ce que le genre raconte vraiment
!> Le roman d’aventures est presque toujours un **récit d’apprentissage** : le héros part enfant et revient adulte. L’île, la jungle ou la mer sont les épreuves qui le **construisent**.`,
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
            cours: `Agnès ne devient pas amoureuse malgré son ignorance : elle devient intelligente en devenant amoureuse.

## La comédie classique
= Castigat ridendo mores : corriger les mœurs par le rire

Elle met en scène des personnages **ordinaires**, dans un cadre quotidien, et se termine **bien** — le plus souvent par un mariage. Comme la tragédie, elle respecte les **trois unités** — action, lieu, temps — et la **bienséance**.

## Les procédés comiques
| Le comique | Ses moyens |
| De **mots** | Jeux de mots, patois, répétitions, quiproquos verbaux |
| De **gestes** | Chutes, coups, grimaces, déguisements |
| De **situation** | Quiproquo, malentendu, personnage caché qui entend tout |
| De **caractère** | Un défaut poussé jusqu’à l’absurde |
| De **répétition** | Une réplique qui devient drôle par son retour même |

## L’École des femmes (1662)
~ Arnolphe fait élever Agnès dans l’ignorance depuis ses quatre ans → il compte l’épouser → elle rencontre Horace → Horace raconte naïvement ses progrès à Arnolphe, sans savoir qu’il parle au rival

!> Arnolphe **aime réellement** Agnès. C’est ce qui empêche la pièce d’être une simple farce : il échoue, et il reste seul.

## Ce que la pièce met en jeu
| La question | |
| L’**éducation des filles** | Faut-il les instruire, ou les tenir dans l’ignorance ? |
| Le **mariage forcé** | Et l’autorité des tuteurs |
| La **liberté** | Choisir sa vie |

> C’est l’ignorance, et non la nature, qui tenait Agnès enfermée.

## Un scandale
La pièce déclencha une violente querelle : on reprocha à Molière son immoralité. Il répondit par deux pièces, *La Critique de l’École des femmes* et *L’Impromptu de Versailles*.

> Le théâtre se défendant par le théâtre.`,
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
            cours: `Deux voix se superposent dans un récit d’enfance : l’adulte qui sait, et l’enfant qui ne savait pas.

## Le genre
= Autobiographie : l’auteur, le narrateur et le personnage principal sont la MÊME personne

C’est le « **pacte autobiographique** » défini par Philippe Lejeune.

## Les grands textes
| L’auteur | L’œuvre |
| **Rousseau** | *Les Confessions* (1782), qui inaugure le genre moderne |
| **Marcel Pagnol** | *La Gloire de mon père*, *Le Château de ma mère* |
| **Romain Gary** | *La Promesse de l’aube* |
| **Nathalie Sarraute** | *Enfance* |
| **Hervé Bazin** | *Vipère au poing*, où la famille est un lieu de guerre |
| **Azouz Begag** | *Le Gone du Chaâba* |

Du côté du roman : **Hugo** avec Gavroche, **Dickens** avec Oliver Twist.

## Les deux « je »
| Le « je » | Qui c’est | Ce qu’il sait |
| Le **je narrant** | L’adulte qui écrit | Il commente, il juge, il sait ce qui va arriver |
| Le **je narré** | L’enfant qu’il était | Il ne sait pas |

!> C’est **l’écart entre les deux** qui crée l’**ironie**, la **tendresse** ou le **regret**, selon la distance que l’auteur choisit. Repérer les deux voix, c’est comprendre le texte.

## Les procédés
| Le procédé | Son emploi |
| Les **temps du passé** | Imparfait pour le décor et les habitudes, passé simple ou composé pour les événements |
| Les **retours en arrière** et **anticipations** | « je ne savais pas encore que… » |
| Les **sensations** | Odeurs, sons, lumières : elles font revenir le souvenir plus sûrement que les faits |
| Le **portrait** des adultes | Vus d’en bas, souvent agrandis par le regard de l’enfant |

## Autobiographie ou roman ?
| Le genre | Son pacte |
| L’**autobiographie** | Elle promet la vérité |
| Le **roman autobiographique** | Il s’en inspire mais assume la fiction |
| L’**autofiction** | Elle mêle les deux volontairement |

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
            cours: `Dans le conte merveilleux, personne ne s’étonne qu’un animal parle. C’est exactement ce qui le sépare du fantastique.

## Merveilleux ou fantastique
| Le genre | Le surnaturel y est… |
| **Merveilleux** | **Admis d’emblée** : personne ne s’étonne |
| **Fantastique** | Une **irruption** dans un monde réaliste, qui provoque le **doute** |

## Les marques du conte
| La marque | Exemple |
| Une **formule d’ouverture** | « Il était une fois… » : un temps et un lieu indéterminés |
| Des **personnages types** | Le héros, la princesse, l’ogre, la marâtre, la fée |
| Des **objets magiques** | Baguette, bottes de sept lieues, miroir, anneau |
| Des **nombres symboliques** | Trois épreuves, sept nains, cent ans de sommeil |
| Une **fin heureuse** | Et souvent une **morale** |

## Le schéma narratif
1. **Situation initiale** — l’équilibre de départ ;
2. **élément perturbateur** — ce qui rompt cet équilibre ;
3. **péripéties** — les épreuves du héros ;
4. **élément de résolution** — ce qui dénoue ;
5. **situation finale** — le nouvel équilibre.

## Le schéma actanciel
~ Un destinateur envoie → le SUJET poursuit un OBJET → des adjuvants l’aident, des opposants le gênent → un destinataire profite du résultat

## Les grands auteurs
| L’auteur | Ce qu’il fait |
| **Charles Perrault** (*Contes*, 1697) | Il **écrit** les versions françaises, avec moralités en vers |
| Les **frères Grimm** | Ils **collectent** les contes allemands au XIXe siècle |
| **Andersen** | Il les **invente** plus qu’il ne les recueille |

## À quoi sert un conte
Il divertit, mais il **enseigne** aussi : prudence, courage, patience, méfiance envers les apparences.

!> Sous une forme simple, le conte met en scène des peurs **profondes** — l’abandon, la faim, la mort, la cruauté des adultes.

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
            cours: `Une utopie ne décrit jamais vraiment un ailleurs : elle critique la société de son auteur par contraste.

## Le mot
= Utopie, de Thomas More (1516) : ou-topos, « en aucun lieu »

Le titre annonce déjà l’ambiguïté : une île parfaite… qui n’existe nulle part.

## Ce qu’est une utopie
| Son cadre | |
| Un lieu **isolé** | Une île, une vallée, une planète |
| Hors du **temps** ordinaire | |
| Découverte par un **voyageur** | Qui sert de guide au lecteur |

## Ses traits récurrents
| Le trait | |
| **Égalité** entre les habitants | Absence de misère |
| **Propriété commune** ou fortement encadrée | |
| **Travail** partagé et limité | |
| **Éducation** pour tous | |
| **Lois simples** | Peu de crimes, peu de juges |
| Organisation **rationnelle** | Villes identiques, horaires réglés, urbanisme géométrique |

## Le vrai sujet : ici, pas là-bas
Chez More, l’île sans propriété privée ni oisiveté vise l’**Angleterre de son temps**, ses enclosures et sa misère.

= C’est une argumentation INDIRECTE : montrer ce qui pourrait être, pour faire voir ce qui ne va pas

## Les grands textes
Platon (*La République*), **Thomas More**, **Rabelais** avec l’**abbaye de Thélème** et sa règle unique — « Fais ce que voudras » —, Campanella, Fourier, jusqu’aux cités idéales des architectes.

## La limite, et le passage à la dystopie
!> Une société parfaite suppose que **tout le monde veuille la même chose**. Ce qui garantit l’ordre — uniformité, surveillance, absence de choix — devient vite oppressant.

~ L’utopie → l’uniformité nécessaire → la surveillance → la dystopie

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
            cours: `Une dystopie décrit une société en apparence parfaite, et en réalité totalitaire. C’est l’inverse de l’utopie — et son prolongement logique.

## Les traits du genre
| Le trait | Ce qu’il produit |
| Un **régime** qui contrôle tout | Information, travail, loisirs, famille, pensée |
| Une **surveillance** permanente | |
| La **propagande** | Et la **réécriture** du passé |
| L’**uniformisation** | Les individus sont souvent désignés par des numéros |
| L’élimination des **opposants** | |
| Un **héros** qui prend conscience | Et qui, très souvent, **échoue** |

## Les grands textes
| L’auteur | L’œuvre | Son ressort |
| **Evgueni Zamiatine** | *Nous autres* (1920) | Le premier du genre |
| **Aldous Huxley** | *Le Meilleur des mondes* (1932) | Heureux par **conditionnement** et par drogue |
| **George Orwell** | *1984* (1949) | Big Brother, la police de la pensée, la **novlangue** |
| **Ray Bradbury** | *Fahrenheit 451* (1953) | Des pompiers qui **brûlent les livres** |

La **novlangue** est une langue appauvrie pour rendre la révolte littéralement **impensable**.

Pour la jeunesse : *Hunger Games*, *Divergente*, *Le Passeur* de Lois Lowry.

## Deux formes d’oppression
| Chez **Orwell** | Chez **Huxley** |
| On obéit par **peur** | On obéit par **plaisir** |
| La surveillance et la torture | Le divertissement et le confort |

> Huxley redoutait qu’on n’ait plus besoin d’interdire les livres, parce que plus personne n’aurait envie d’en lire.

## Une fiction qui parle du présent
!> La dystopie ne prédit pas : elle prend une **tendance de son époque** — propagande, technique, surveillance, divertissement de masse — et la pousse à l’extrême pour la rendre **visible**.

## Le repérage en classe
~ Qui détient le pouvoir ? → Qu’est-ce qui est interdit ? → Comment surveille-t-on ? → Que découvre le héros ? → Que reproche le récit à notre monde ?`,
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
            cours: `Le héros médiéval n’est pas seulement fort : il est exemplaire. Sa vie sert de modèle à ceux qui l’écoutent.

## Deux grandes familles de récits
| Le genre | Sa période | Ce qu’il célèbre | Son modèle |
| La **chanson de geste** | XIe-XIIe | Les exploits guerriers, la fidélité au seigneur ; **en vers**, chantée par les **jongleurs** | *La Chanson de Roland* (vers 1100) |
| Le **roman de chevalerie** | XIIe-XIIIe | L’**amour** et la **quête** intérieure ; écrit pour être **lu** | **Chrétien de Troyes** |

De Chrétien de Troyes : *Yvain ou le Chevalier au lion*, *Perceval ou le Conte du Graal*, *Lancelot*.

## Les valeurs du chevalier
| La valeur | Ce qu’elle exige |
| La **prouesse** | Le courage et la force au combat |
| La **loyauté** | Envers son seigneur : le lien vassalique |
| La **foi** | Le chevalier chrétien combat pour Dieu |
| La **largesse** | La générosité envers les pauvres et les vaincus |
| La **courtoisie** | Le respect des dames, la maîtrise de soi, l’élégance |

!> La **démesure** est le défaut à éviter. **Roland** refuse de sonner l’olifant par orgueil — et tous ses hommes en meurent.

## La Chanson de Roland
~ L’arrière-garde de Charlemagne est attaquée à Roncevaux → Roland refuse d’appeler à l’aide → il sonne son cor trop tard → il meurt le visage tourné vers l’ennemi → Charlemagne vient venger les siens

Le poème est écrit en **laisses** : des strophes de longueur variable, sur une même **assonance**.

## L’amour courtois
Le chevalier sert une **dame** souvent inaccessible ; il accomplit des exploits **pour** elle, et cette souffrance amoureuse le rend meilleur.

> La femme y prend, pour la première fois dans la littérature occidentale, une position **haute**.

## Le merveilleux
Fées, enchanteurs — **Merlin** —, objets magiques, animaux qui parlent, **Graal** : le surnaturel fait partie du monde, sans surprendre personne, comme dans le conte.`,
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
            cours: `Achille et Ulysse s’opposent terme à terme. Toute la littérature occidentale se partagera entre ces deux figures.

## Qu’est-ce qu’un héros antique
Un personnage exceptionnel, souvent né d’un **dieu** et d’une **mortelle**. Ni tout à fait dieu, ni tout à fait homme : il accomplit des exploits surhumains, mais il **meurt**.

## Les grandes figures
| Le héros | Ce qui le définit |
| **Achille** | Le meilleur guerrier de l’*Iliade*, invulnérable **sauf au talon** ; il choisit une vie **courte et glorieuse** |
| **Ulysse** | Héros de l’*Odyssée* : la **ruse** (le cheval de Troie, le Cyclope) et la **ténacité** — dix ans pour rentrer à Ithaque |
| **Héraclès** (Hercule) | Ses **douze travaux**, expiation d’une faute |
| **Thésée** | Le **Minotaure**, et le fil d’**Ariane** |
| **Persée**, **Jason** | La Méduse, la Toison d’or |
| **Antigone** | Elle désobéit au roi au nom d’une loi supérieure |
| **Énée** | Chez les Romains : l’*Énéide* de Virgile, fondateur mythique de Rome |

## Les traits communs
~ Une naissance extraordinaire → un oracle → des épreuves imposées par les dieux → des monstres à vaincre → un défaut qui coûte cher

| Le monstre | Le héros |
| Le **Cyclope** | Ulysse |
| L’**Hydre** | Héraclès |
| Le **Minotaure** | Thésée |
| **Méduse** | Persée |

!> L’***hybris*** — la démesure, l’orgueil — est **toujours punie** par les dieux. La colère d’Achille en est l’exemple le plus célèbre.

## Deux modèles d’héroïsme
| Achille | Ulysse |
| La **force** | La **ruse** |
| La **gloire** | Le **retour** |
| La mort jeune | La survie |

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
            cours: `La machine devient vivante, l’ouvrier devient une chose. Ce renversement est la trouvaille majeure du roman industriel.

## Le contexte
Au **XIXe siècle**, la machine à vapeur, le charbon, le chemin de fer et l’usine transforment l’Europe en quelques décennies. Une question littéraire nouvelle apparaît : **que devient l’homme dans ce monde qu’il a fabriqué ?**

## Deux regards opposés
| L’enthousiasme | L’inquiétude |
| Le progrès promet de vaincre la maladie, la distance, la nuit | La même machine détruit les paysages et épuise les corps |
| **Jules Verne** en fait la matière de ses romans | **Zola**, *Germinal* (1885) : la mine, « une bête goulue » qui dévore les hommes |
| **Hugo** salue le train comme un poème | **Zola**, *La Bête humaine* : la locomotive devient un personnage |
| | **Hugo**, *Les Misérables*, sur la misère urbaine |

## Le procédé central : la personnification
| Ce qui est décrit | Comment |
| La machine, l’usine, la mine | Dotées d’un **corps** et d’une **volonté** : elles respirent, avalent, grondent |
| L’ouvrier | Décrit comme une **chose** : un rouage, un outil |

!> C’est un **renversement** : la machine vivante et l’homme mécanisé. Le repérer, c’est comprendre tout le texte.

## Le romantisme et la nature refuge
Face à cela, les romantiques font de la **nature** un refuge et un miroir de l’âme : **Rousseau** déjà, puis **Lamartine**, **Hugo**, et plus tard **Giono**, qui oppose la vie paysanne à la modernité.

## Ce que le chapitre met en jeu
L’homme est-il **maître** de la nature — ou en fait-il **partie** ?

> Pour la première fois, l’activité humaine transforme la planète à grande échelle. Les textes du XIXe siècle formulent, avec un siècle et demi d’avance, les questions écologiques d’aujourd’hui.`,
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
            cours: `L’anticipation ne prédit pas l’avenir : elle prend une tendance du présent et demande « et si cela continuait ? »

## La définition
Le **roman d’anticipation** situe son récit dans le **futur** et imagine les conséquences d’une évolution **déjà commencée**.

!> Il se distingue de la **science-fiction** au sens large par sa **proximité avec le présent** : il extrapole, il n’invente pas un univers entier.

## Les fondateurs
| L’auteur | Ses œuvres | Son type d’anticipation |
| **Jules Verne** | *De la Terre à la Lune*, *Vingt mille lieues sous les mers*, *Paris au XXe siècle* | **Technique**, documentée, optimiste |
| **H. G. Wells** | *La Machine à explorer le temps*, *La Guerre des mondes*, *L’Île du docteur Moreau* | **Sociale et morale**, souvent inquiète |

## Le siècle suivant
**Barjavel** (*Ravage*, 1943), **Bradbury**, **Asimov** et ses lois de la robotique, **Orwell** et **Huxley** pour le versant dystopique — et aujourd’hui toute une production sur le climat, l’intelligence artificielle et la génétique.

## Les grands thèmes
| Le thème | |
| Le **progrès technique** | Et ses effets non prévus |
| La **catastrophe écologique** | |
| L’**intelligence artificielle** | Et la place de l’humain |
| La **manipulation** du vivant | |
| La **surveillance** | Et la perte des libertés |

## Les procédés d’écriture
| Le procédé | Son rôle |
| Un **cadre** futur rendu crédible | Par des détails concrets |
| Un **vocabulaire** technique, parfois inventé | Le **néologisme** |
| Une **date** | Elle ancre le récit et le rend mesurable |
| Des **explications** au lecteur | Par le savant, le guide, le nouveau venu |
| Le **contraste** avec notre monde | C’est lui qui produit le sens |

> Les erreurs de prédiction n’invalident pas une anticipation, parce que prédire n’était pas le but.

## La lecture critique
~ Quelle tendance actuelle est poussée à l’extrême ? → Que redoute l’auteur ? → Qu’espère-t-il ? → Que dit ce futur du monde où il a été écrit ?`,
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
            cours: `La façon dont une époque représente la nature dit ce qu’elle en pense. Trois moments, trois réponses.

## Le Moyen Âge : la nature encadrée
| Le lieu | Ce qu’il signifie |
| Le **jardin clos** (*hortus conclusus*) | Entouré de murs : protégé, utile — herbes, légumes — et **image du paradis** |
| La **forêt** | Le danger, l’épreuve, le merveilleux : fées, ermites et monstres |

Dans les **enluminures**, la nature est peinte **sans profondeur**, en aplats, sur fond d’or.

!> Elle y est un **signe**, pas un paysage. Ce n’est pas de la maladresse : c’est une intention.

## La Renaissance : la nature observée
| L’apport | Ce qu’il change |
| L’**humanisme** | Il réhabilite l’**observation** ; **Léonard de Vinci** dessine plantes, eaux et anatomies |
| La **perspective** | Le paysage devient un **espace**, non plus un décor plat |
| Les **jardins italiens** | Géométrie, statues, grottes, jeux d’eau : la nature **mise en scène** |
| **Ronsard** | Il chante la rose et le temps qui passe : la nature devient miroir du sentiment |

## Le XVIIe siècle : la nature soumise
Le **jardin à la française** — **Le Nôtre** à **Versailles** — pousse la maîtrise à son terme : axes de symétrie, perspectives infinies, parterres géométriques, arbres taillés, eaux domptées.

> Ce que le roi fait aux arbres, il le fait au royaume. Le jardin est une **démonstration de pouvoir**.

= Descartes : l’homme doit se rendre « comme maître et possesseur de la nature »

**La Fontaine**, dans ses *Fables*, se sert au contraire des animaux pour dire la vérité des hommes.

## Les trois jardins
~ Jardin clos (encadré) → jardin observé (Renaissance) → jardin dompté (Versailles)

## Et après
Le **jardin à l’anglaise** du XVIIIe siècle prendra le contre-pied de Versailles : allées sinueuses, faux désordre, ruines artificielles.

> La nature n’est plus à soumettre : elle est à **rêver**.`,
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
