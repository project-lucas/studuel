// Français — PREMIÈRE : le rayon « Fiches de lecture » (1/5).
//
// LE TROISIÈME RAYON DU DOSSIER, après le programme (259 + 260) et la grammaire
// (259). Il ne se parcourt pas : on y vient chercher UNE œuvre, pour un devoir,
// une dissertation, un exposé ou une lecture cursive. D'où le format, différent
// de celui du programme : une fiche courte et complète — l'histoire, les
// personnages, ce qu'il faut retenir, une phrase à citer — et six questions.
// Les fiches du programme, elles, restent longues : on les révise pour l'oral.
//
// LES TITRES PORTENT L'AUTEUR (« Manon Lescaut, abbé Prévost »), comme dans la
// maquette. Ce n'est pas décoratif : c'est ce qui évite la collision avec les
// fiches du rayon Programme, qui portent le titre nu (« Manon Lescaut »), alors
// que `chapters` est UNIQUE(subject_id, level, title). Une œuvre peut donc
// exister dans les deux rayons sans se marcher dessus — et c'est voulu : dans
// le programme, on l'étudie ; ici, on la retrouve.
//
// CINQ MODULES, CINQ MIGRATIONS (261 à 265), par tranches alphabétiques : les
// 260 fiches réunies produiraient près d'un mégaoctet de SQL, quand l'éditeur
// de Supabase devient poussif au-delà de ~300 Ko. Les positions démarrent à 100
// et se suivent d'un module à l'autre (`positionDepart`), pour que l'ordre
// alphabétique de la maquette soit celui de la page.
//
// UNE ŒUVRE DE LA MAQUETTE MANQUE, et c'est délibéré : « Le Gora, Georges
// Courteline ». Aucune pièce ni aucun récit de Courteline ne porte ce titre —
// il s'agit selon toute vraisemblance d'une erreur d'attribution de la source.
// Écrire une fiche dessus reviendrait à inventer une œuvre. À trancher avec
// Lucas : soit la ligne disparaît, soit elle désigne un autre texte.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, qui doit être exécutée AVANT.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — FICHES DE LECTURE (1/5) : « Art » → Cyrano',

  motif: `LE TROISIÈME RAYON DU DOSSIER DE FRANÇAIS, après le programme (259 + 260)
et la grammaire (259) : les fiches de lecture, 260 œuvres qu'on vient chercher
une par une pour un devoir, une dissertation ou une lecture cursive.

Le format est délibérément COURT et complet — l'histoire, les personnages, ce
qu'il faut retenir, une phrase à citer — et chaque fiche porte six questions.
Les fiches du rayon Programme, elles, restent longues : on les révise pour
l'oral, on ne les consulte pas.

LES TITRES PORTENT L'AUTEUR (« Manon Lescaut, abbé Prévost »), comme dans la
maquette. Ce n'est pas décoratif : c'est ce qui évite la collision avec les
fiches du rayon Programme, qui portent le titre nu, alors que chapters est
UNIQUE(subject_id, level, title). Une même œuvre peut ainsi vivre dans les deux
rayons — étudiée d'un côté, retrouvée de l'autre.

CINQ MIGRATIONS (261 à 265) par tranches alphabétiques : réunies, les 260
fiches feraient près d'un mégaoctet, quand l'éditeur SQL de Supabase devient
poussif au-delà de ~300 Ko.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD (colonnes theme et discipline, ménage
des composites). Cette migration n'écrit que des fiches neuves.

⚠️ UNE ŒUVRE DE LA MAQUETTE MANQUE : « Le Gora, Georges Courteline ». Aucune
œuvre de Courteline ne porte ce titre — erreur d'attribution probable de la
source. Écrire la fiche reviendrait à inventer une œuvre.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'fiches',
      axe: 'Fiches de lecture',
      positionDepart: 100,
      chapitres: [
        {
          titre: '« Art », Yasmina Reza',
          lecon: {
            titre: 'Reza, 1994 — un tableau blanc et trois amitiés',
            cours: `## L’auteur et le contexte
**Yasmina Reza**, née à Paris en **1959**, est comédienne avant d’écrire pour le théâtre. « Art » est créée à Paris, à la **Comédie des Champs-Élysées**, en **octobre 1994**.

> Succès mondial : **Molières en 1995**, **Tony Award** de la meilleure pièce à Broadway en **1998**.

## L’histoire
Serge achète pour **deux cent mille francs** un tableau **entièrement blanc**, signé d’un peintre à la mode. Marc, son ami de quinze ans, le trouve ridicule — et le dit.

> En **une heure trente** et une quinzaine de scènes brèves, la discussion sur le tableau devient un **règlement de comptes**.

| Qui reproche | Quoi |
| **Marc** à Serge | De s’être **inventé un goût** pour se distinguer |
| **Serge** à Marc | De vouloir rester son **maître à penser** |
| **Yvan** | Il tente de ménager tout le monde — et **craque au milieu** |

## Les personnages
| Personnage | Sa place |
| **Serge**, dermatologue | Le **nouveau riche du goût** |
| **Marc**, ingénieur | **Rationaliste et blessé** |
| **Yvan**, papetier | Sur le point de se marier : il prononce une **tirade célèbre** sur les cartons d’invitation |

Chacun s’adresse aussi **directement au public**.

## À retenir
| Le sujet apparent | Le vrai sujet |
| L’**art contemporain** | L’**amitié masculine** |
| — | Ce qui se joue dans le goût : la **peur d’être exclu**, le **besoin d’être admiré** |

Comédie **grinçante**, dialogue rapide, scènes très courtes, décor unique. Créée en **1994**, jouée dans le monde entier.

## Le dénouement
Pour prouver que l’amitié compte plus que l’objet, **Serge tend un feutre à Marc**, qui **dessine un skieur** sur la toile. Le feutre était **lavable** — Serge le savait et **ne l’a pas dit** : leur amitié repart sur un **petit mensonge**. Le tableau est l’œuvre d’un peintre nommé **Antrios**.

## Les thèmes
| Thème | Ce que la pièce en dit |
| Le **jugement de goût** | Aimer une œuvre, c’est aussi **se situer** face aux autres |
| L’**amitié** | Un lien fait d’**influence**, de rôles fixés, de **dépendance** |

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre du XVIIe au XXIe siècle**. Un bon exemple de **comédie qui touche au grave** : le rire y fait entendre la **solitude** de chacun. À l’oral, montre ce que la **toile blanche** révèle de chacun.

## La phrase à citer
> Yvan recopie la maxime de son psychanalyste, **Finkelzohn** : « Si je suis moi parce que je suis moi et si tu es toi parce que tu es toi, je suis moi et tu es toi… »`,
          },
          questions: [
            ['Qu’achète Serge au début de la pièce ?', ['Un tableau entièrement blanc, très cher', 'Une sculpture antique', 'Une maison de campagne', 'Un tableau de maître ancien'], 0, 'Le prix, exorbitant, est l’étincelle de la dispute.'],
            ['Combien de personnages la pièce compte-t-elle ?', ['Trois', 'Deux', 'Quatre', 'Cinq'], 0, 'Serge, Marc et Yvan, qui s’adressent aussi directement au public.'],
            ['Quel est le vrai sujet de la dispute ?', ['L’amitié et l’ascendant que chacun exerce sur l’autre', 'La valeur marchande de l’art', 'Un héritage familial', 'Une rivalité amoureuse'], 0, 'Le tableau n’est que le déclencheur.'],
            ['Quel personnage prononce une longue tirade sur son mariage ?', ['Yvan', 'Marc', 'Serge', 'Le peintre'], 0, 'Le morceau de bravoure comique de la pièce.'],
            ['À quel genre la pièce appartient-elle ?', ['La comédie grinçante contemporaine', 'La tragédie', 'Le drame romantique', 'La farce médiévale'], 0, 'Dialogue rapide, scènes brèves, décor unique.'],
            ['La pièce se termine par la destruction totale de l’amitié.', ['Vrai', 'Faux'], 1, 'Le lien survit, abîmé et réinventé : c’est ce qui rend le dénouement ambigu.'],
          ],
        },
        {
          titre: '« Le Bateau ivre », Arthur Rimbaud',
          lecon: {
            titre: 'Rimbaud, 1871 — cent vers de voyage immobile',
            cours: `## L’auteur et le contexte
**Arthur Rimbaud** (1854-1891), né à **Charleville**, écrit toute son œuvre avant **vingt ans**. En **mai 1871**, dans la « **lettre du Voyant** » adressée à **Paul Demeny**, il affirme que le poète doit se faire **voyant** « par un long, immense et raisonné **dérèglement de tous les sens** ».

> *Le Bateau ivre*, composé à l’été **1871**, met ce programme en images. Il ne paraît qu’en **1883**, grâce à Verlaine, dans *Les Poètes maudits*.

## Le poème
| Fait | Le détail |
| La forme | **Vingt-cinq quatrains d’alexandrins** |
| L’auteur | **Seize ans** — et il **n’a jamais vu la mer** |
| Sa destination | Envoyé à **Verlaine**, qui l’invite à Paris |
| Le « je » | Celui d’un **bateau** : les haleurs ont été tués, le bateau descend le fleuve puis se perd |

## Le mouvement, en trois temps
| Temps | Ce qui s’y passe |
| La **libération** | Plus d’équipage, plus de gouvernail |
| L’**ivresse de la vision** | « Poème de la mer », soleils, aurores, cataractes, monstres |
| La **fatigue** | Le désir de retour : une « flache noire et froide » d’Europe, un enfant qui lâche un bateau « frêle comme un papillon de mai » |

## À retenir
C’est le manifeste du **poète voyant** : la libération de toute contrainte donne accès à des **visions inouïes** — mais **l’ivresse épuise**.

| Procédé | Son effet |
| Rythme, **allitérations**, néologismes | Le vers **bouge** comme l’eau |
| Des images **inventées** | L’exotisme y est **entièrement livresque**, tiré des lectures d’enfance |

Le poème annonce *Une saison en enfer* et *Illuminations*.

## Les thèmes
| Thème | Où on le lit |
| La **liberté** et la **révolte** | Le bateau délivré de ses haleurs, sans gouvernail |
| Le **voyage** comme aventure poétique | « Et j’ai vu quelquefois ce que l’homme a cru voir ! » |
| La **désillusion** | « Mais, vrai, j’ai trop pleuré ! Les Aubes sont navrantes. » |

Le poème se clôt sur un **refus** : le bateau ne peut plus « nager sous les yeux horribles des **pontons** » — les navires-prisons.

## Pour la dissertation et l’oral
Objet d’étude : **la poésie du XIXe au XXIe siècle**. Le poème montre que la poésie peut être une **exploration de l’inconnu** plutôt qu’une description du réel. À l’oral, appuie-toi sur le contraste entre la **forme régulière** (quatrains d’alexandrins) et le **déferlement des images**.

## La phrase à citer
> « Je sais les cieux crevant en éclairs, et les trombes / Et les ressacs et les courants… »`,
          },
          questions: [
            ['Qui est le « je » du poème ?', ['Un bateau qui descend le fleuve puis se perd en mer', 'Un marin', 'Le poète lui-même', 'Un enfant sur la berge'], 0, 'La métaphore file sur tout le poème.'],
            ['Quel âge a Rimbaud lorsqu’il écrit Le Bateau ivre ?', ['Seize ans', 'Vingt ans', 'Vingt-cinq ans', 'Dix-huit ans'], 0, 'Et il n’a alors jamais vu la mer.'],
            ['Quelle est la forme du poème ?', ['Vingt-cinq quatrains d’alexandrins', 'Un sonnet', 'Un poème en prose', 'Des vers libres'], 0, 'La régularité formelle contraste avec le déferlement des images.'],
            ['Comment le poème se termine-t-il ?', ['Par le désir d’une flaque d’eau d’Europe et d’un bateau d’enfant', 'Par un naufrage total', 'Par le retour au port', 'Par la mort du marin'], 0, 'Après l’ivresse vient la fatigue : le retour rêvé est minuscule.'],
            ['À qui Rimbaud envoie-t-il le poème ?', ['À Verlaine', 'À Hugo', 'À Baudelaire', 'À Mallarmé'], 0, 'Verlaine l’invite alors à Paris.'],
            ['L’exotisme du poème vient des voyages réels de Rimbaud.', ['Vrai', 'Faux'], 1, 'Il est entièrement livresque, tiré de ses lectures d’enfance.'],
          ],
        },
        {
          titre: '« Sylvie », Les Filles du feu, Gérard de Nerval',
          lecon: {
            titre: 'Nerval, 1853 — trois femmes, un seul souvenir',
            cours: `## L’auteur et le contexte
**Gérard de Nerval** (1808-1855), de son vrai nom **Gérard Labrunie**, traducteur du *Faust* de Goethe, est l’un des grands romantiques. Frappé de **crises de folie** à partir de 1841, il se donne la mort en **1855**.

> *Sylvie* paraît d’abord dans la *Revue des Deux Mondes* en **1853**, puis entre dans *Les Filles du feu* (**1854**), recueil de nouvelles clos par les sonnets des *Chimères*.

## L’histoire
Le narrateur, à Paris, apprend par un **entrefilet** qu’une fête a lieu cette nuit-là au **Valois**, le pays de son enfance. Il part — et le récit se met à **naviguer entre trois époques**.

| Époque | Ce qu’elle contient |
| **Aujourd’hui** | La fête, le voyage de nuit |
| L’**adolescence** | **Sylvie**, la paysanne |
| Le **souvenir lointain** | **Adrienne**, aperçue une fois, chantant dans une ronde |

## Les trois femmes
| Femme | Ce qu’elle représente | Sa fin |
| **Sylvie** | Le **réel**, la tendresse, la vie qui continue | Elle **épousera un autre** |
| **Adrienne** | L’**idéal**, la figure inaccessible | Religieuse, puis **morte** |
| **Aurélie** | L’**illusion**, l’image de théâtre | Le narrateur croit y retrouver Adrienne |

> Le narrateur **ne choisit jamais** : il court après **une femme faite de trois**.

## À retenir
Un récit du **temps** et de la **mémoire**, où les époques **se superposent sans transition** — la prose de Nerval passe du présent au souvenir **en une phrase**.

> Chef-d’œuvre de la nouvelle romantique, **admiré par Proust**, qui y voit l’ancêtre de sa propre entreprise.

## Le début et la fin
Au début, le narrateur passe ses soirées **au théâtre**, pour une actrice qu’il n’ose pas approcher : **Aurélie**. À la fin, Sylvie a épousé « **le grand frisé** », son camarade d’enfance devenu pâtissier. Le dernier chapitre, « **Dernier feuillet** », tire la leçon du récit : les illusions tombent comme les écorces d’un fruit.

## Les thèmes
| Thème | Ce qu’il donne au récit |
| La **mémoire** | Le passé revient par fragments, par associations |
| Le **Valois** | Un pays d’enfance idéalisé, de fêtes et de chansons |
| Le **rêve et le réel** | Le narrateur préfère l’image à la femme vivante |

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit du Moyen Âge au XXIe siècle**. *Sylvie* est l’exemple d’un récit où **l’ordre du souvenir remplace l’ordre chronologique**.

## La phrase à citer
> « Telles sont les chimères qui charment et égarent au matin de la vie. »`,
          },
          questions: [
            ['Quelles sont les trois femmes du récit ?', ['Sylvie, Adrienne et Aurélie', 'Sylvie, Aurélie et Jenny', 'Adrienne, Émilie et Sylvie', 'Aurélie, Delphine et Sylvie'], 0, 'Le réel, l’idéal et l’illusion : le narrateur les confond.'],
            ['Dans quelle région se déroule le récit ?', ['Le Valois', 'La Bretagne', 'La Provence', 'Le Berry'], 0, 'Le pays d’enfance de Nerval, dont il fait un espace de mémoire.'],
            ['Qui est Adrienne ?', ['Une jeune fille aperçue une fois, devenue religieuse et morte', 'Une paysanne du village', 'Une actrice parisienne', 'La sœur de Sylvie'], 0, 'Elle est l’idéal inaccessible, revu partout ensuite.'],
            ['Qu’est-ce qui déclenche le départ du narrateur ?', ['Un entrefilet de journal annonçant une fête au pays', 'Une lettre de Sylvie', 'La mort d’un ami', 'Un rêve'], 0, 'Le hasard d’une lecture ouvre la porte du souvenir.'],
            ['Quelle particularité présente la narration ?', ['Les époques se superposent sans transition marquée', 'Le récit est strictement chronologique', 'Il n’y a pas de narrateur', 'Le récit est écrit en vers'], 0, 'C’est ce qui a fasciné Proust.'],
            ['Le narrateur finit par épouser Sylvie.', ['Vrai', 'Faux'], 1, 'Elle épouse un autre : le récit est celui d’une occasion manquée.'],
          ],
        },
        {
          titre: '« Un cœur simple », Trois Contes, Gustave Flaubert',
          lecon: {
            titre: 'Flaubert, 1877 — la vie entière d’une servante',
            cours: `## L’auteur et le contexte
**Gustave Flaubert** (1821-1880), l’auteur de *Madame Bovary*, publie *Trois Contes* en **1877** : « Un cœur simple », « La Légende de saint Julien l’Hospitalier » et « Hérodias ».

> Pour écrire le conte, il installe sur sa table un **perroquet empaillé** emprunté au **muséum de Rouen**. George Sand meurt en **1876**, avant d’avoir pu le lire.

## L’histoire
**Félicité** sert **un demi-siècle** Madame Aubain, à Pont-l’Évêque. Sa vie est une **suite de pertes**.

| Ce qu’elle perd | Quand |
| Son fiancé **Théodore** | Il l’abandonne |
| **Virginie**, la fille de sa maîtresse, aimée comme la sienne | Elle **meurt jeune** |
| Son neveu **Victor** | Il **meurt au loin** |
| **Madame Aubain** | Elle meurt à son tour |

Il lui reste un **perroquet**, **Loulou**, qu’elle fait **empailler** et finit par **confondre avec le Saint-Esprit**.

> Elle meurt en croyant le voir, **gigantesque, planer au-dessus d’elle dans les cieux entrouverts**.

## Les personnages
| Personnage | Ce qu’il est |
| **Félicité** | Servante **illettrée**, d’une bonté **sans mesure et sans mots** |
| **Madame Aubain** | Maîtresse **froide et digne** |
| **Loulou** | Le seul objet d’un amour **qui n’a plus où se poser** |

## À retenir
Flaubert écrit ce conte **pour George Sand**, qui lui reprochait d’**être sans cœur**.

| Ce que le style refuse | Ce qu’il obtient |
| Toute **ironie** envers Félicité | Une **sobriété absolue** |
| Tout **pathos** | Une émotion **d’autant plus forte** |

> La dernière page est l’un des sommets de la prose française : une **confusion sublime** entre un oiseau empaillé et l’Esprit saint, **prise absolument au sérieux**.

## Les épisodes à connaître
| Épisode | Ce qu’il montre |
| Félicité **arrête un taureau** en lui jetant des mottes de terre | Un courage qui ne se sait pas |
| **Victor** meurt de la fièvre à **La Havane**, que Félicité imagine pleine de cigares | Un monde trop grand pour elle |
| La **Fête-Dieu** : Loulou est posé sur le reposoir | La scène finale |

## Les thèmes
La **bonté** sans récompense, la **foi naïve**, le **temps** qui use tout, la **condition des domestiques** dans la Normandie du XIXe siècle.

## Pour la dissertation et l’oral
Un exemple parfait de **réalisme** qui refuse le mépris : Flaubert donne à une vie **minuscule** la grandeur d’une **vie de sainte**.

## La phrase à citer
> « … et, quand elle exhala son dernier souffle, elle crut voir, dans les cieux entr’ouverts, un perroquet gigantesque, planant au-dessus de sa tête. »`,
          },
          questions: [
            ['Qui est Félicité ?', ['Une servante qui sert la même famille pendant un demi-siècle', 'Une bourgeoise de Rouen', 'Une religieuse', 'Une paysanne propriétaire'], 0, 'Sa vie est une suite de pertes successives.'],
            ['Qui est Loulou ?', ['Le perroquet de Félicité, qu’elle fait empailler', 'Son neveu', 'Le fils de Madame Aubain', 'Son chien'], 0, 'Il devient l’ultime objet de son amour, puis une image du Saint-Esprit.'],
            ['Comment le conte se termine-t-il ?', ['Félicité meurt en croyant voir un perroquet gigantesque dans les cieux', 'Félicité hérite de la maison', 'Félicité retrouve son fiancé', 'Félicité quitte Pont-l’Évêque'], 0, 'La confusion est prise au sérieux, sans ironie.'],
            ['Pour qui Flaubert écrit-il ce conte ?', ['Pour George Sand, qui lui reprochait d’être sans cœur', 'Pour sa nièce Caroline', 'Pour Maupassant', 'Pour Louise Colet'], 0, 'Il voulait prouver qu’il pouvait écrire la bonté sans ironie.'],
            ['Quelle est la tonalité du style dans ce conte ?', ['Une sobriété absolue, sans pathos ni ironie', 'Un lyrisme exalté', 'Une satire mordante', 'Un comique de situation'], 0, 'C’est ce qui rend la dernière page bouleversante.'],
            ['Félicité sait lire et écrire.', ['Vrai', 'Faux'], 1, 'Elle est illettrée : son amour ne passe jamais par les mots.'],
          ],
        },
        {
          titre: '1984, George Orwell',
          lecon: {
            titre: 'Orwell, 1949 — la dictature de la vérité',
            cours: `## L’auteur et le contexte
**George Orwell** (1903-1950), de son vrai nom **Eric Arthur Blair**, a combattu en Espagne dans une milice antifasciste, où il est blessé, et il en a rapporté *Hommage à la Catalogne*. Après *La Ferme des animaux* (1945), il écrit *1984* sur l’île écossaise de **Jura**, déjà très malade. Il meurt de la tuberculose en **janvier 1950**.

## L’histoire
En **Océania**, État totalitaire dirigé par **Big Brother**, **Winston Smith** travaille au **ministère de la Vérité** : son métier consiste à **réécrire les archives** pour que le passé **donne toujours raison au Parti**.

| Étape | Ce qui arrive |
| La révolte | Il commence un **journal interdit** |
| L’amour | Il aime **Julia** |
| La trahison | Il croit trouver un allié en **O’Brien** — **agent de la Police de la Pensée** |
| La **chambre 101** | Torturé, confronté à **ce qu’il redoute le plus**, il **trahit Julia** |
| La fin | Il **finit par aimer Big Brother** |

## Les notions du livre
| Notion | Ce qu’elle fait |
| Le **novlangue** | Une langue **appauvrie** qui rend la révolte **impensable** |
| La **double-pensée** | Croire **deux choses contradictoires** en même temps |
| Les **télécrans** | La surveillance **permanente** |
| Les **slogans** | « La guerre c’est la paix, la liberté c’est l’esclavage, l’ignorance c’est la force » |

## À retenir
> Le roman ne décrit pas seulement une dictature : il montre qu’un pouvoir total s’attaque **d’abord au langage et à la mémoire**.

Publié en **1949** par un écrivain **socialiste**, marqué par le **stalinisme** et la **guerre d’Espagne**. Il a donné au français les mots « **Big Brother** » et « **orwellien** ».

## Les personnages
| Personnage | Son rôle |
| **Winston Smith** | Le fonctionnaire qui doute et tient un journal |
| **Julia** | Sa maîtresse, révoltée par goût de la vie plus que par idée |
| **O’Brien** | Le membre du Parti intérieur qui le piège puis le « rééduque » |
| **Big Brother** | Le visage du Parti, qu’on ne voit jamais en vrai |
| **Emmanuel Goldstein** | L’ennemi officiel, haï pendant les **Deux Minutes de la Haine** |

## Les thèmes
Le **totalitarisme**, la **surveillance**, la **manipulation de la vérité** et de l’histoire, l’**amour** comme dernier espace de liberté — que le Parti finit par détruire.

## Pour la dissertation et l’oral
Une **contre-utopie** : elle imagine le pire pour en avertir.

## La phrase à citer
> « Qui contrôle le passé contrôle l’avenir ; qui contrôle le présent contrôle le passé. »`,
          },
          questions: [
            ['Où travaille Winston Smith ?', ['Au ministère de la Vérité, où il réécrit les archives', 'Au ministère de l’Amour', 'À la Police de la Pensée', 'Dans une usine d’armement'], 0, 'Son métier consiste à faire dire au passé ce que le Parti veut.'],
            ['Qu’est-ce que le novlangue ?', ['Une langue appauvrie qui rend la révolte impensable', 'Un code secret des résistants', 'La langue des étrangers', 'Un dialecte régional interdit'], 0, 'Réduire le vocabulaire, c’est réduire ce qui peut être pensé.'],
            ['Qui est O’Brien ?', ['Un agent de la Police de la Pensée, faux allié de Winston', 'Le chef de la résistance', 'Le frère de Julia', 'Un télécran'], 0, 'C’est lui qui torturera Winston dans la chambre 101.'],
            ['Comment le roman se termine-t-il ?', ['Winston, brisé, finit par aimer Big Brother', 'Winston s’évade', 'Winston renverse le Parti', 'Winston meurt en résistant'], 0, 'La défaite est totale : elle est intérieure.'],
            ['Qu’est-ce que la double-pensée ?', ['La capacité de croire simultanément deux choses contradictoires', 'La censure des livres', 'Le langage codé des amants', 'La surveillance par deux écrans'], 0, 'Elle rend la contradiction indolore, donc le mensonge durable.'],
            ['Le roman a été écrit avant la Seconde Guerre mondiale.', ['Vrai', 'Faux'], 1, 'Il paraît en 1949, marqué par le stalinisme et par la guerre d’Espagne.'],
          ],
        },
        {
          titre: 'À l’ombre des jeunes filles en fleurs, Marcel Proust',
          lecon: {
            titre: 'Proust, 1919 — Balbec, la plage et le prix Goncourt',
            cours: `## L’auteur et le contexte
**Marcel Proust** (1871-1922) consacre la fin de sa vie à *À la recherche du temps perdu*, en sept volumes. Ce deuxième volume paraît en **1919**, au lendemain de la guerre.

> Son **prix Goncourt 1919** fait scandale : on lui avait préféré un roman de soldat attendu, *Les Croix de bois* de **Roland Dorgelès**.

## L’histoire
Deuxième volume d’*À la recherche du temps perdu*, en **deux parties**.

| Partie | Ce qui s’y passe |
| « Autour de Madame Swann » | À Paris : le narrateur fréquente les Swann et voit **se défaire** son amour d’enfance pour **Gilberte** |
| « Noms de pays : le pays » | Le séjour à **Balbec**, station balnéaire normande, avec sa **grand-mère** |

| Rencontre à Balbec | Ce qu’elle apporte |
| **Robert de Saint-Loup** | L’amitié aristocratique |
| Le **baron de Charlus** | Une énigme qui traversera l’œuvre |
| Le peintre **Elstir** | Il **apprend au narrateur à voir** |
| La « **petite bande** » de jeunes filles, dont **Albertine** | Le désir |

## À retenir
Le livre obtient le **prix Goncourt en 1919**.

> Ce n’est **pas un roman d’action** : c’est l’**apprentissage d’un regard**.

| Motif proustien | Où il apparaît |
| La **déception** face à ce qu’on avait imaginé | L’église de Balbec, l’actrice **la Berma** |
| Le **snobisme** des salons | Chez les Swann, puis à Balbec |
| La **naissance du désir** | La petite bande |
| Le rôle de l’**art** | Elstir |

## La phrase
Longue, **ramifiée**, avec incises et comparaisons développées : elle **épouse le mouvement d’une conscience** qui revient sur elle-même.

> On ne lit pas Proust pour **savoir ce qui arrive**, mais pour **suivre ce mouvement**.

## Les autres personnages
| Personnage | Son rôle |
| La **grand-mère** | La tendresse absolue, lectrice de Mme de Sévigné |
| **Odette Swann** | Devenue une femme élégante que le narrateur admire |
| **Bergotte** | L’écrivain qu’il rencontre chez les Swann |
| **Mme de Villeparisis** | La vieille marquise amie de la grand-mère, à Balbec |

Balbec est inspiré de **Cabourg** et de son **Grand Hôtel**, où Proust passait ses étés.

## Les thèmes
L’**adolescence**, le **désir** qui change d’objet, la distance entre le **nom** rêvé et la **chose** vue, l’**art** comme manière nouvelle de regarder.

## Pour la dissertation et l’oral
Un roman d’**apprentissage** sans aventure : on y apprend à voir, à aimer et à se déprendre.

## La phrase à citer
> « On ne reçoit pas la sagesse, il faut la découvrir soi-même après un trajet que personne ne peut faire pour nous. » — Elstir`,
          },
          questions: [
            ['Quel prix ce volume a-t-il obtenu ?', ['Le prix Goncourt 1919', 'Le prix Renaudot', 'Le prix Femina', 'Aucun prix'], 0, 'La récompense fit sortir Proust de la confidentialité.'],
            ['Où se déroule la seconde partie du livre ?', ['À Balbec, station balnéaire normande', 'À Combray', 'À Venise', 'À Paris uniquement'], 0, 'Le narrateur y séjourne avec sa grand-mère.'],
            ['Quel personnage le narrateur rencontre-t-il dans la « petite bande » ?', ['Albertine', 'Odette', 'Oriane de Guermantes', 'Gilberte'], 0, 'Elle deviendra centrale dans les volumes suivants.'],
            ['Quel peintre apprend au narrateur à regarder ?', ['Elstir', 'Vinteuil', 'Bergotte', 'Swann'], 0, 'Vinteuil est le musicien, Bergotte l’écrivain : chaque art a son maître dans la Recherche.'],
            ['Quel sentiment revient face aux choses longtemps imaginées ?', ['La déception', 'L’exaltation', 'L’indifférence', 'La peur'], 0, 'L’église de Balbec ou la Berma en scène ne ressemblent pas au rêve.'],
            ['Le volume raconte une intrigue riche en péripéties.', ['Vrai', 'Faux'], 1, 'C’est l’apprentissage d’un regard : le mouvement de la conscience y remplace l’action.'],
          ],
        },
        {
          titre: 'Adolphe, Benjamin Constant',
          lecon: {
            titre: 'Constant, 1816 — la cruauté d’un amour qui s’éteint',
            cours: `## L’auteur et le contexte
**Benjamin Constant** (1767-1830), né à **Lausanne**, est un penseur **libéral** et un homme politique autant qu’un romancier. Sa longue liaison orageuse avec **Germaine de Staël** nourrit le livre, sans en faire une autobiographie.

> *Adolphe* est écrit en **1806** et publié en **1816**, à Londres et à Paris.

## L’histoire
| Étape | Ce qui se passe |
| Le calcul | **Adolphe**, jeune homme brillant et désœuvré, séduit **Ellénore** — d’abord **par vanité**, pour prouver qu’il en est capable |
| Le sacrifice | Ellénore, maîtresse d’un comte, plus âgée, mère de deux enfants, **quitte tout pour lui** |
| Le retournement | **Aussitôt qu’il l’a obtenue, il cesse de l’aimer** |
| La lâcheté | Il **n’ose pas le dire** : il reste par **pitié**, par **faiblesse**, par **peur de la faire souffrir** |
| La fin | L’indécision dure des années et **tue Ellénore**, qui meurt après avoir lu une lettre où Adolphe promettait de la quitter |

## La forme
Un **récit-confession très bref**, à la **première personne**, encadré par un « **éditeur** » qui prétend avoir **trouvé le manuscrit**.

## À retenir
> Un chef-d’œuvre d’**analyse psychologique** : Constant y démonte la **mécanique de la lâcheté sentimentale** — **comment on peut faire un mal immense en voulant éviter d’en faire**.

| Il appartient à… | Mais son style est… |
| La génération **romantique**, contemporaine du « mal du siècle » | D’une **sécheresse toute classique** |

## Les personnages
| Personnage | Son rôle |
| **Adolphe** | Vingt-deux ans, lucide sur lui-même mais incapable d’agir |
| **Ellénore** | D’origine **polonaise**, maîtresse d’un **comte** dont elle a deux enfants |
| Le **père d’Adolphe** | Il désapprouve la liaison, à distance |
| Le **baron de T.** | L’ami du père qui pousse Adolphe à rompre — et fait parvenir sa lettre à Ellénore |

## Les thèmes
| Thème | Ce qu’en dit le roman |
| La **faiblesse** | Plus destructrice que la méchanceté |
| La **société** | Elle condamne la femme, pas l’homme |
| La **lucidité** | Adolphe voit tout, et n’en fait rien |

## Pour la dissertation et l’oral
Héritier de *La Princesse de Clèves*, *Adolphe* est un **roman d’analyse** : presque pas d’action, tout est dans les motifs.

## La phrase à citer
> « Malheur à l’homme qui, dans les premiers moments d’une liaison d’amour, ne croit pas que cette liaison doit être éternelle ! »`,
          },
          questions: [
            ['Pourquoi Adolphe séduit-il Ellénore ?', ['Par vanité, pour prouver qu’il en est capable', 'Par amour immédiat et sincère', 'Pour obtenir une fortune', 'Pour obéir à son père'], 0, 'L’amour naît de l’orgueil, et meurt dès qu’il est comblé.'],
            ['Pourquoi Adolphe reste-t-il auprès d’Ellénore alors qu’il ne l’aime plus ?', ['Par pitié, faiblesse et peur de la faire souffrir', 'Parce qu’il l’aime encore', 'Parce qu’il est retenu par sa famille', 'Par intérêt financier'], 0, 'Le roman démonte cette lâcheté sentimentale, qui fait plus de mal que la rupture.'],
            ['Comment le roman se termine-t-il ?', ['Ellénore meurt après avoir lu une lettre d’Adolphe', 'Ils se marient', 'Adolphe part à l’étranger sans nouvelle', 'Ellénore retourne auprès du comte'], 0, 'La lettre où il promettait de la quitter la tue.'],
            ['Quel dispositif encadre le récit ?', ['Un « éditeur » qui prétend avoir trouvé le manuscrit', 'Un dialogue avec un ami', 'Une préface de l’auteur signée', 'Aucun'], 0, 'Le procédé donne au récit un air de document authentique.'],
            ['À quel genre le livre appartient-il ?', ['Le récit-confession à la première personne', 'Le roman épistolaire', 'Le roman-fleuve', 'Le conte philosophique'], 0, 'Très bref, il tient de l’analyse plus que de l’aventure.'],
            ['Le style d’Adolphe est lyrique et abondant.', ['Vrai', 'Faux'], 1, 'Il est d’une sécheresse classique, malgré un sujet romantique.'],
          ],
        },
        {
          titre: 'Alcools, Guillaume Apollinaire',
          lecon: {
            titre: 'Apollinaire, 1913 — la ponctuation supprimée',
            cours: `## L’auteur et le contexte
**Guillaume Apollinaire** (1880-1918), né à Rome sous le nom de **Wilhelm de Kostrowitzky**, est l’ami de **Picasso** et le défenseur du **cubisme**. En **1911**, soupçonné à tort dans le **vol de la Joconde**, il passe quelques jours à la prison de la Santé.

> Blessé à la tête en **1916**, il meurt de la **grippe espagnole** le **9 novembre 1918**, l’année de *Calligrammes*.

## Le recueil
Publié en **1913**, il rassemble **quinze ans** de poèmes.

| Choix d’Apollinaire | Ce qu’il produit |
| Il **supprime toute la ponctuation** sur les épreuves | « Le **rythme même et la coupe des vers**, voilà la véritable ponctuation » |
| L’ordre n’est **ni chronologique ni thématique** | Le recueil s’ouvre sur « **Zone** », **écrit en dernier**, et se ferme sur « Vendémiaire » |

## Les poèmes à connaître
| Poème | Ce qu’il contient |
| « **Zone** » | L’aube parisienne, la tour Eiffel « **bergère** », les affiches, l’émigration, la religion d’enfance |
| « **Le Pont Mirabeau** » | L’amour **qui passe comme l’eau** |
| « La Chanson du mal-aimé » | La longue plainte amoureuse |
| « Nuit rhénane », « Les Colchiques », « Automne malade » | Les poèmes nés du séjour en Rhénanie (1901-1902) |

## À retenir
> La modernité d’Apollinaire est un **alliage** : il fait entrer l’**aviation**, la **publicité** et la **ville industrielle** dans le poème — tout en écrivant des **chansons régulières qu’on retient par cœur**.

| Source | Ce qu’elle fournit |
| Ses **amours** — Annie Playden, Marie Laurencin | La matière lyrique |
| Ses **voyages rhénans** | Les paysages et les légendes |
| **Paris** | La modernité |

Le titre dit **ce qui enivre** et **ce qui brûle**.

## Les thèmes
| Thème | Où on le lit |
| Le **temps qui passe** | « Vienne la nuit sonne l’heure / Les jours s’en vont je demeure » |
| L’**amour perdu** | « La Chanson du mal-aimé », « Le Pont Mirabeau » |
| La **modernité** | « À la fin tu es las de ce monde ancien » (« Zone ») |
| La **mélancolie** | L’automne, les colchiques, la nuit rhénane |

## Pour la dissertation et l’oral
Objet d’étude : **la poésie du XIXe au XXIe siècle**. *Alcools* montre qu’on peut être moderne **sans rompre** : Apollinaire mêle la **chanson populaire**, les **légendes** et le **vers libre**. À l’oral, compare « Zone » (long, en vers libres) et « Le Pont Mirabeau » (court, chanté).

## La phrase à citer
> « Sous le pont Mirabeau coule la Seine / Et nos amours »`,
          },
          questions: [
            ['Quelle décision Apollinaire prend-il sur les épreuves ?', ['Supprimer toute la ponctuation', 'Renoncer aux rimes', 'Classer les poèmes par date', 'Publier sous pseudonyme'], 0, 'Le rythme et la coupe des vers doivent suffire.'],
            ['Quel poème ouvre le recueil ?', ['Zone', 'Le Pont Mirabeau', 'Vendémiaire', 'Nuit rhénane'], 0, 'Il a pourtant été écrit en dernier.'],
            ['Que raconte « Le Pont Mirabeau » ?', ['L’amour qui s’en va comme l’eau du fleuve', 'Un accident de la Seine', 'La construction d’un pont', 'Une promenade joyeuse'], 0, 'Le refrain installe la permanence du poète face au passage du temps.'],
            ['En quelle année le recueil paraît-il ?', ['1913', '1900', '1920', '1898'], 0, 'À la veille de la guerre où Apollinaire sera blessé.'],
            ['Quels éléments modernes entrent dans « Zone » ?', ['Les affiches, la tour Eiffel, l’aviation', 'Les héros mythologiques seuls', 'La campagne normande', 'Les batailles napoléoniennes'], 0, 'Ils voisinent avec la religion d’enfance et les souvenirs de voyage.'],
            ['La modernité d’Apollinaire consiste à rejeter toute forme traditionnelle.', ['Vrai', 'Faux'], 1, 'C’est un alliage : les chansons régulières côtoient les audaces.'],
          ],
        },
        {
          titre: 'Andromaque, Jean Racine',
          lecon: {
            titre: 'Racine, 1667 — la chaîne des amours impossibles',
            cours: `## L’auteur et le contexte
**Jean Racine** (1639-1699), élevé par les **jansénistes de Port-Royal**, triomphe avec *Andromaque*, créée en **novembre 1667** par la troupe de l’**Hôtel de Bourgogne**. Il a vingt-sept ans.

> Le sujet vient d’**Euripide** et de **Virgile** (*Énéide*, chant III) : la guerre de Troie est finie, mais ses vaincus et ses vainqueurs restent enchaînés à elle.

## La chaîne
Après la chute de Troie, **Andromaque**, veuve d’Hector, est captive en Épire avec son fils **Astyanax**.

| Qui | Aime | Qui l’aime |
| **Oreste**, ambassadeur des Grecs | **Hermione** | Personne |
| **Hermione**, fiancée de Pyrrhus | **Pyrrhus** | Oreste |
| **Pyrrhus**, roi d’Épire | **Andromaque** | Hermione |
| **Andromaque** | **Hector**, mort | Pyrrhus |

> La chaîne est **parfaite** : chacun exige d’être aimé **par celui qui ne le peut pas**.

## Le dénouement en cascade
| Étape | Ce qui arrive |
| Le chantage | Pyrrhus menace de **livrer Astyanax aux Grecs** si Andromaque le repousse |
| La ruse | Andromaque accepte le mariage, **décidée à se tuer après la cérémonie** : sauver son fils **sans trahir Hector** |
| L’ordre | **Hermione**, folle de jalousie, ordonne à **Oreste** de tuer Pyrrhus |
| La fin | Oreste obéit ; Hermione le **maudit** et se tue sur le corps de Pyrrhus ; **Oreste devient fou** |

## À retenir
| Ce que la tragédie met en jeu | Comment |
| La **passion qui rend aveugle** | Chacun ne voit que son objet |
| La **parole qui engage** | Un ordre donné ne se reprend pas |
| La **fidélité au mort** | Seule Andromaque **tient debout** |

Alexandrins d’une **pureté extrême**, unité de lieu et de temps.

## Les confidents
| Confident | De qui |
| **Pylade** | L’ami fidèle d’Oreste |
| **Céphise** | La confidente d’Andromaque |
| **Cléone** | La confidente d’Hermione |
| **Phœnix** | L’ancien gouverneur d’Achille, auprès de Pyrrhus |

## Deux répliques à connaître
Quand Oreste lui annonce la mort de Pyrrhus, Hermione répond : « **Qui te l’a dit ?** » — elle renie l’ordre qu’elle a donné. Puis Oreste, fou, voit les Furies : « **Pour qui sont ces serpents qui sifflent sur vos têtes ?** », vers célèbre pour son allitération en s.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre du XVIIe au XXIe siècle**. La pièce illustre la **tragédie classique** : règle des trois unités, passion comme **fatalité intérieure**, violence racontée et non montrée.

## La phrase à citer
> « Je t’aimais inconstant, qu’aurais-je fait fidèle ? »`,
          },
          questions: [
            ['Quelle est la chaîne amoureuse de la pièce ?', ['Oreste aime Hermione, qui aime Pyrrhus, qui aime Andromaque, fidèle à Hector', 'Pyrrhus aime Hermione, qui aime Oreste', 'Andromaque aime Pyrrhus', 'Oreste aime Andromaque'], 0, 'Chacun exige d’être aimé de qui ne le peut pas.'],
            ['Avec quoi Pyrrhus fait-il chanter Andromaque ?', ['Avec la vie de son fils Astyanax', 'Avec la liberté des Troyennes', 'Avec le tombeau d’Hector', 'Avec la paix entre les Grecs'], 0, 'Le chantage est le moteur de toute l’intrigue.'],
            ['Que décide Andromaque avant la cérémonie ?', ['Épouser Pyrrhus puis se tuer', 'Fuir avec Oreste', 'Livrer son fils', 'Renoncer à sauver Astyanax'], 0, 'Sauver l’enfant sans trahir Hector : c’est sa seule issue.'],
            ['Qui ordonne le meurtre de Pyrrhus ?', ['Hermione', 'Andromaque', 'Oreste de lui-même', 'Les ambassadeurs grecs'], 0, 'Elle maudira ensuite Oreste d’avoir obéi.'],
            ['Comment finit Oreste ?', ['Il devient fou', 'Il épouse Hermione', 'Il retourne en Grèce en triomphe', 'Il est tué par Pyrrhus'], 0, 'La scène de folie clôt la pièce.'],
            ['Andromaque cède à la passion au cours de la pièce.', ['Vrai', 'Faux'], 1, 'Elle reste fidèle à Hector : c’est ce qui la rend inébranlable et tragique.'],
          ],
        },
        {
          titre: 'Antigone, Jean Anouilh',
          lecon: {
            titre: 'Anouilh, 1944 — dire non, sans savoir pourquoi',
            cours: `## L’auteur et le contexte
**Jean Anouilh** (1910-1987) range ses pièces en séries : pièces **roses**, **noires**, **brillantes**, **grinçantes**. *Antigone* est créée le **4 février 1944** au **théâtre de l’Atelier**, dans une mise en scène d’**André Barsacq**, et entre dans les *Nouvelles pièces noires*.

## L’histoire
Reprise moderne de Sophocle, créée en **février 1944**, sous l’**Occupation**.

**Antigone** enterre son frère **Polynice** malgré l’interdit de **Créon**, son oncle devenu roi.

| Ce que Créon n’est pas | Ce qu’il est |
| Un **tyran** | Un homme **fatigué** qui **explique**, argumente, **tente de sauver sa nièce** |

> Il lui révèle même que **ses deux frères étaient également indignes** et qu’on **ne sait pas quel corps a été enterré**. **Antigone refuse quand même.**

## Le dénouement
| Personnage | Sa fin |
| **Antigone** | **Murée vivante** |
| **Hémon**, son fiancé, fils de Créon | Il **se tue** |
| **Eurydice**, femme de Créon | Elle **se tue** |
| **Créon** | Il **reste** — et **retourne au conseil** |

## À retenir
| Élément | Son effet |
| Un **prologue** présente les personnages **et annonce la fin** | La tragédie est une **mécanique** qui « se déroule toute seule » |
| Un langage **familier**, des **anachronismes assumés** | Cigarettes, gardes qui parlent de leur solde |
| Le sujet | Le **refus absolu** contre le **compromis nécessaire** |

> Sous l’Occupation, **chaque camp y a lu son propre message** — c’est l’**ambiguïté même** de la pièce.

## Les autres personnages
| Personnage | Son rôle |
| **Ismène** | La sœur, belle et raisonnable, qui a peur |
| La **Nourrice** | La tendresse de l’enfance, qui ne comprend rien au drame |
| Le **Chœur** | Il commente et distingue la **tragédie** du **drame** |
| Les **Gardes** | Des hommes ordinaires, occupés de leur solde et de leur avancement |

Avant de mourir, Antigone **dicte au garde une lettre pour Hémon**.

## Les thèmes
La **pureté** contre la vie ordinaire, le refus du **bonheur** médiocre, la **liberté** de dire non, la solitude du pouvoir.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. Compare avec Sophocle : chez Anouilh, **les dieux ont disparu**, Antigone ne se bat plus pour une loi divine mais **pour elle-même**. Le Chœur l’explique : dans la tragédie, **l’espoir n’existe plus**, et c’est ce qui la rend reposante.

## La phrase à citer
> « Moi, je ne veux pas comprendre. »`,
          },
          questions: [
            ['En quelle année la pièce est-elle créée ?', ['1944, sous l’Occupation', '1936', '1950', '1922'], 0, 'Les deux camps y ont lu leur propre message.'],
            ['Comment Créon est-il représenté chez Anouilh ?', ['Comme un homme fatigué qui argumente et tente de sauver Antigone', 'Comme un tyran sanguinaire', 'Comme un vieillard sénile', 'Comme un guerrier héroïque'], 0, 'C’est ce qui rend le refus d’Antigone plus radical encore.'],
            ['Que révèle Créon à Antigone sur ses frères ?', ['Qu’ils étaient tous deux indignes et qu’on ignore quel corps a été enterré', 'Qu’ils sont vivants', 'Qu’ils ont été trahis par Ismène', 'Qu’ils ont demandé pardon'], 0, 'Le geste d’Antigone perd sa justification, et elle refuse quand même.'],
            ['Quel est le rôle du prologue ?', ['Présenter les personnages et annoncer la fin', 'Résumer la pièce de Sophocle', 'Introduire un narrateur comique', 'Justifier les anachronismes'], 0, 'La tragédie est une mécanique qui « se déroule toute seule ».'],
            ['Qui meurt à la fin de la pièce ?', ['Antigone, Hémon et Eurydice', 'Antigone seule', 'Créon et Antigone', 'Personne'], 0, 'Créon, lui, reste et retourne au conseil : c’est sa punition.'],
            ['Le langage de la pièce est celui de la tragédie classique.', ['Vrai', 'Faux'], 1, 'Il est familier, avec des anachronismes assumés — cigarettes, gardes qui parlent de leur solde.'],
          ],
        },
        {
          titre: 'Antigone, Sophocle',
          lecon: {
            titre: 'Sophocle, 441 av. J.-C. — la loi des dieux contre celle de la cité',
            cours: `## L’auteur et le contexte
**Sophocle** (vers 496-406 av. J.-C.) est l’un des trois grands tragiques athéniens, avec Eschyle et Euripide. Des quelque **cent vingt pièces** qu’il a écrites, **sept** nous sont parvenues. *Antigone* est jouée vers **441 av. J.-C.**, au concours des **Grandes Dionysies**, la fête de Dionysos.

> La pièce appartient au **cycle thébain**, avec *Œdipe roi* et *Œdipe à Colone*.

## L’histoire
Après la guerre fratricide entre **Étéocle** et **Polynice**, fils d’Œdipe, **Créon**, roi de Thèbes, ordonne d’**honorer le premier** et laisse le **second sans sépulture**, sous peine de mort.

| Étape | Ce qui se passe |
| La transgression | **Antigone**, leur sœur, **recouvre le corps de terre** |
| L’arrestation | Elle **revendique son acte** et invoque les **lois non écrites** des dieux, **supérieures aux décrets des hommes** |
| Le refus | Sa sœur **Ismène** veut partager sa faute ; **Antigone refuse** |
| La fin | Emmurée, elle **se pend** ; **Hémon** se tue ; **Eurydice** se tue |
| Créon | Averti **trop tard** par le devin **Tirésias**, il **reste seul** |

## À retenir
| Le conflit | Ce qui s’oppose |
| Les **devoirs** | La loi **religieuse et familiale** contre la **raison d’État** |

> **Aucun des deux n’a entièrement tort** — c’est ce qui rend la pièce **inépuisable**.

| Élément | Son rôle |
| Le **chœur** | Il **commente et hésite** |
| L’*hybris* — la démesure | Elle **perd Créon** |

Texte fondateur, relu par **Hegel**, **Anouilh**, **Brecht** et bien d’autres.

## Les personnages
| Personnage | Son rôle |
| **Antigone** | La fille d’Œdipe, fidèle aux dieux et aux morts |
| **Ismène** | La sœur prudente, qui n’ose pas désobéir |
| **Créon** | Le roi qui fait passer la cité avant tout |
| **Hémon** | Le fils de Créon, fiancé d’Antigone, qui plaide pour elle |
| Le **Garde** | Il rapporte la transgression, en tremblant |
| **Tirésias** | Le devin aveugle |
| **Eurydice** | La reine, épouse de Créon |

## Le chant du chœur
Le chœur des vieillards thébains chante un hymne célèbre : **il est bien des merveilles en ce monde, mais aucune n’est plus grande que l’homme** — capable de tout, sauf de vaincre la mort.

## Pour la dissertation et l’oral
Utile pour penser la **désobéissance** : jusqu’où doit-on obéir à la loi ?

## La phrase à citer
> « Je ne suis pas née pour partager la haine, mais l’amour. »`,
          },
          questions: [
            ['Pourquoi Antigone brave-t-elle l’interdit de Créon ?', ['Pour donner une sépulture à son frère Polynice, au nom des lois divines', 'Pour prendre le pouvoir', 'Pour venger son père Œdipe', 'Pour sauver Ismène'], 0, 'Elle invoque les lois non écrites, supérieures aux décrets humains.'],
            ['Qui est Créon dans la pièce de Sophocle ?', ['Le roi de Thèbes, oncle d’Antigone', 'Le frère d’Antigone', 'Le devin de la cité', 'Le fiancé d’Antigone'], 0, 'Hémon, son fils, est le fiancé d’Antigone.'],
            ['Comment Antigone meurt-elle ?', ['Elle se pend dans le tombeau où elle est emmurée', 'Elle est décapitée', 'Elle est lapidée', 'Elle meurt de faim en exil'], 0, 'Hémon puis Eurydice se donnent la mort ensuite.'],
            ['Quel personnage avertit Créon trop tard ?', ['Le devin Tirésias', 'Ismène', 'Le chœur', 'Hémon'], 0, 'La démesure de Créon l’a empêché d’écouter à temps.'],
            ['Quel conflit la pièce met-elle en scène ?', ['La loi divine et familiale contre la raison d’État', 'L’amour contre le devoir militaire', 'La jeunesse contre la vieillesse seulement', 'La richesse contre la pauvreté'], 0, 'Aucun des deux camps n’a entièrement tort : c’est la force du texte.'],
            ['Ismène accepte dès le début d’aider Antigone.', ['Vrai', 'Faux'], 1, 'Elle refuse d’abord, puis veut partager la faute — et Antigone l’écarte.'],
          ],
        },
        {
          titre: 'Armance, Stendhal',
          lecon: {
            titre: 'Stendhal, 1827 — le premier roman, et un secret',
            cours: `## L’auteur et le contexte
**Stendhal** (1783-1842), de son vrai nom **Henri Beyle**, né à **Grenoble**, publie *Armance* en **1827**, trois ans avant *Le Rouge et le Noir*. Le roman naît d’une actualité : la loi de **1825** dite du « **milliard des émigrés** », qui indemnise les nobles dépossédés par la Révolution.

## L’histoire
Sous la Restauration, dans le monde des **anciens émigrés** qu’une loi vient d’**indemniser**.

| Personnage | Ce qui le retient |
| **Octave de Malivert**, brillant et tourmenté | Un **secret** l’empêche d’être l’époux de qui que ce soit |
| **Armance de Zohiloff**, sa cousine, pauvre et fière | Elle ne veut pas **paraître intéressée** par la fortune nouvelle d’Octave |

> Le secret n’est **jamais nommé** dans le texte. Stendhal l’appelait, **dans ses lettres**, le « babilanisme » — l’impuissance.

| Étape | Ce qui arrive |
| Le piège | Une **fausse lettre**, fabriquée par le **commandeur de Soubirane**, l’oncle d’Octave, persuade Octave qu’Armance ne l’aime pas |
| La fin | Marié à elle, il **s’embarque pour la Grèce** et **s’empoisonne à bord** |

## À retenir
**Premier roman de Stendhal.** Un roman du **non-dit** : tout y est **retenu, allusif** — ce qui a **dérouté les lecteurs de 1827**.

| Ce qu’on y trouve déjà | Où |
| La peinture d’une **société** | Le salon aristocratique de la Restauration, l’argent, les calculs de mariage |
| L’analyse d’une **conscience** | Prise dans son **propre secret** |

> Sous-titre : « Quelques scènes d’un salon de Paris en 1827 ».

## Les personnages
| Personnage | Son rôle |
| **Octave de Malivert** | Vingt ans, sorti de l’**École polytechnique**, mélancolique et secret |
| **Armance de Zohiloff** | Sa cousine d’origine russe, orpheline sans fortune |
| **Mme de Malivert** | La mère d’Octave, qui souhaite le mariage |
| La **marquise de Bonnivet** | Celle qui accueille Armance et tient le salon |
| Le **commandeur de Soubirane** | L’oncle ultra, hostile au mariage, auteur de la machination |

À la fin, Armance et la mère d’Octave **entrent au couvent**.

## Les thèmes
Le **secret** et la honte, l’**orgueil** de deux êtres qui s’aiment sans se le dire, l’**argent** qui fausse les sentiments, l’ennui d’une aristocratie repliée sur elle-même.

## Pour la dissertation et l’oral
Un exemple de roman où **le non-dit crée le sens** : le lecteur doit deviner ce que le texte refuse de nommer.`,
          },
          questions: [
            ['Quel est le premier roman publié de Stendhal ?', ['Armance', 'Le Rouge et le Noir', 'La Chartreuse de Parme', 'Lucien Leuwen'], 0, 'Il paraît en 1827, avant Le Rouge et le Noir.'],
            ['Qu’est-ce qui empêche Octave d’épouser Armance ?', ['Un secret intime que le roman ne nomme jamais', 'Une différence de religion', 'Un serment fait à son père', 'Une dette de jeu'], 0, 'Stendhal évoque dans ses lettres l’impuissance du héros.'],
            ['Pourquoi Armance cache-t-elle son amour ?', ['Pour ne pas paraître intéressée par la fortune d’Octave', 'Parce qu’elle en aime un autre', 'Parce qu’elle veut entrer au couvent', 'Parce que sa famille l’interdit'], 0, 'La loi d’indemnisation des émigrés vient d’enrichir Octave.'],
            ['Comment le roman se termine-t-il ?', ['Octave s’empoisonne en mer, en route vers la Grèce', 'Le couple s’installe à Paris', 'Armance meurt de chagrin', 'Octave épouse une autre femme'], 0, 'Le mariage n’a rien résolu du secret.'],
            ['Quel milieu le roman peint-il ?', ['Le salon aristocratique de la Restauration', 'La bourgeoisie industrielle', 'Le monde paysan', 'Les milieux militaires'], 0, 'Le sous-titre l’annonce : « Quelques scènes d’un salon de Paris en 1827 ».'],
            ['Le roman nomme explicitement le secret d’Octave.', ['Vrai', 'Faux'], 1, 'Tout y est allusif : c’est un roman du non-dit, ce qui a dérouté ses premiers lecteurs.'],
          ],
        },
        {
          titre: 'Artamène ou le Grand Cyrus, Madeleine et Georges de Scudéry',
          lecon: {
            titre: 'Scudéry, 1649-1653 — le plus long roman français',
            cours: `## L’auteur et le contexte
**Madeleine de Scudéry** (1607-1701) tient à Paris, dans le Marais, un salon célèbre : ses « **samedis** ». On l’y surnomme **Sapho**. Le roman paraît pendant et juste après la **Fronde** (1648-1653), la révolte des grands et du Parlement contre le pouvoir royal.

## L’œuvre
| Fait | Le détail |
| Publication | **Dix volumes**, entre **1649 et 1653** |
| Signature | Sous le nom de **Georges de Scudéry** — écrit pour l’essentiel par sa sœur **Madeleine** |
| Longueur | environ **deux millions de mots** : le **plus long roman** de la littérature française |
| La trame | Sur fond d’**Antiquité perse** : le prince **Cyrus**, qui se fait appeler **Artamène**, et son amour pour **Mandane**, enlevée et reprise sans relâche |

## Le roman précieux
| Ce qui sert de **cadre** | Ce qui intéresse **vraiment** le public |
| Batailles, enlèvements, naufrages, reconnaissances | Les **conversations**, les portraits, les analyses de sentiments |
| — | Les **questions galantes** débattues à l’infini : peut-on aimer sans espoir ? l’absence renforce-t-elle l’amour ? |

> Les contemporains y **reconnaissaient des personnages réels** sous les noms antiques : le **roman à clé** était un **jeu de salon**.

## À retenir
Œuvre centrale de la **préciosité** et du salon de **Madeleine de Scudéry**, immense succès européen — puis **oubliée et raillée** dès la fin du siècle.

> Elle documente **mieux qu’aucune autre** l’art de la **conversation** au XVIIe siècle.

> Le roman se lisait **par épisodes, en société** — comme une série.

## Les clés du roman
| Personnage du roman | Ce que les lecteurs y reconnaissaient |
| **Cyrus** | Le **Grand Condé**, héros militaire de la Fronde |
| **Mandane** | La **duchesse de Longueville**, sa sœur |
| **Sapho** | **Madeleine de Scudéry** elle-même, peinte dans le dernier volume |

## Les thèmes
L’**amour** respectueux et patient, l’**honneur**, la **conversation** comme art de vivre, et la place des **femmes** dans la vie de l’esprit : l’« Histoire de Sapho » défend l’idée qu’une femme peut être savante.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Le Grand Cyrus montre ce qu’était le roman **avant** *La Princesse de Clèves* (1678) : immense, galant, héroïque. La réaction viendra vite : **Molière** raille les précieuses en **1659**, **Boileau** les héros de roman dans un dialogue satirique.`,
          },
          questions: [
            ['Qui a écrit l’essentiel d’Artamène ?', ['Madeleine de Scudéry, sous le nom de son frère Georges', 'Georges de Scudéry seul', 'Madame de Lafayette', 'Honoré d’Urfé'], 0, 'La signature masculine était une convention de l’époque.'],
            ['Quelle est la particularité matérielle du roman ?', ['C’est le plus long roman de la littérature française, en dix volumes', 'Il est écrit en vers', 'Il tient en un seul volume', 'Il est resté inachevé'], 0, 'Environ deux millions de mots.'],
            ['Quel cadre historique le roman utilise-t-il ?', ['L’Antiquité perse, autour du prince Cyrus', 'La Rome impériale', 'La Grèce classique', 'L’Égypte des pharaons'], 0, 'Le héros se fait appeler Artamène.'],
            ['Qu’est-ce qui intéressait surtout les lecteurs du temps ?', ['Les conversations, les portraits et les questions galantes', 'Les batailles', 'Les descriptions de paysages', 'La morale religieuse'], 0, 'La trame héroïque n’est qu’un cadre.'],
            ['Qu’appelle-t-on un roman « à clé » ?', ['Un roman où les contemporains reconnaissent des personnes réelles sous des noms d’emprunt', 'Un roman policier', 'Un roman inachevé', 'Un roman publié anonymement'], 0, 'C’était un jeu de salon très prisé.'],
            ['Le roman a connu un succès durable jusqu’au XIXe siècle.', ['Vrai', 'Faux'], 1, 'Immense succès d’abord, il est raillé et oublié dès la fin du XVIIe siècle.'],
          ],
        },
        {
          titre: 'Au Bonheur des Dames, Émile Zola',
          lecon: {
            titre: 'Zola, 1883 — le grand magasin dévore le quartier',
            cours: `## L’auteur et le contexte
**Émile Zola** (1840-1902), chef de file du **naturalisme**, écrit les *Rougon-Macquart*, « histoire naturelle et sociale d’une famille sous le **Second Empire** », en vingt romans. Pour *Au Bonheur des Dames* (**1883**), il enquête dans les grands magasins parisiens, surtout **Le Bon Marché** et **le Louvre**.

> Octave Mouret vient du roman précédent, *Pot-Bouille* (1882).

## L’histoire
**Denise Baudu**, orpheline venue de Valognes avec ses deux frères, entre comme **vendeuse** au **Bonheur des Dames**, le grand magasin d’**Octave Mouret**.

| Ce qu’elle découvre | Où |
| La misère du personnel, les renvois, la **concurrence entre vendeuses** | À l’intérieur |
| La **ruine des petits commerçants** du quartier, dont son **oncle Baudu** | En face |

| Étape | Ce qui arrive |
| Mouret, séducteur et **génie du commerce**, tombe amoureux d’elle | — |
| Denise **résiste** | Elle refuse d’être une maîtresse |
| La fin | Elle **l’épouse** |

## À retenir
**Onzième volume** des *Rougon-Macquart*. Zola y peint la naissance du **commerce moderne**.

| Innovation décrite | Son ressort |
| **Étalages**, **soldes**, **publicité** | Créer le désir |
| Vente par **correspondance** | Étendre le marché |
| L’**exploitation de la clientèle féminine** | Le désir comme moteur de vente |

> Le magasin est décrit comme une **machine** **et** un **temple**, qui **écrase les boutiques anciennes**.

Roman de la **modernité conquérante**, **plus optimiste** que les autres Zola : **la destruction y produit du neuf**.

## Les personnages
| Personnage | Son rôle |
| **Denise Baudu** | Douce et droite, elle s’impose par sa patience |
| **Octave Mouret** | Veuf de **Mme Hédouin**, la propriétaire du premier magasin |
| **Baudu** | L’oncle drapier du « Vieil Elbeuf », qui perd tout |
| **Geneviève** | Sa fille, qui meurt de chagrin quand son fiancé **Colomban** la quitte |
| **Bourras** | Le vieux marchand de parapluies qui résiste jusqu’à l’expulsion |
| **Henriette Desforges** | La maîtresse de Mouret, jalouse de Denise |
| Le **baron Hartmann** | Le banquier qui finance l’expansion |

## Les thèmes
Le **capitalisme** triomphant, la **ville** qui se transforme, la **femme** à la fois cliente séduite et employée exploitée, le **progrès** comme loi impitoyable.

## Pour la dissertation et l’oral
Un bon exemple de **roman naturaliste** : documentation, milieu, déterminisme social.

## La phrase à citer
> « C’était la cathédrale du commerce moderne. »`,
          },
          questions: [
            ['Qui est Denise Baudu ?', ['Une orpheline devenue vendeuse au Bonheur des Dames', 'La femme d’Octave Mouret dès le début', 'La propriétaire du magasin', 'Une cliente fortunée'], 0, 'Elle vient de Valognes avec ses deux frères à charge.'],
            ['Qui dirige le grand magasin ?', ['Octave Mouret', 'Baudu', 'Bourras', 'Robineau'], 0, 'Séducteur et génie du commerce, il finit par aimer Denise.'],
            ['Que provoque le développement du grand magasin ?', ['La ruine des petits commerçants du quartier', 'La hausse des salaires', 'La fermeture des usines', 'Le départ des clientes'], 0, 'L’oncle Baudu en est la victime la plus visible.'],
            ['Quelles techniques commerciales le roman décrit-il ?', ['Étalages, soldes, publicité, vente par correspondance', 'Le troc et le crédit à la ferme', 'Les foires annuelles', 'La vente aux enchères'], 0, 'Zola documente la naissance du commerce moderne.'],
            ['À quelle série le roman appartient-il ?', ['Les Rougon-Macquart', 'Les Trois Villes', 'Les Quatre Évangiles', 'La Comédie humaine'], 0, 'C’est le onzième volume du cycle.'],
            ['Denise devient la maîtresse de Mouret.', ['Vrai', 'Faux'], 1, 'Elle refuse et finit par l’épouser : c’est ce qui rend le roman singulier chez Zola.'],
          ],
        },
        {
          titre: 'Aux Champs, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1882 — vendre son enfant, ou non',
            cours: `## L’auteur et le contexte
**Guy de Maupassant** (1850-1893), disciple de **Flaubert**, écrit en dix ans plus de **trois cents nouvelles**, souvent situées dans sa **Normandie** natale. *Aux Champs* paraît en **1882** dans le journal *Le Gaulois*, puis dans le recueil *Contes de la bécasse*. La nouvelle est dédiée à **Octave Mirbeau**.

## L’histoire
Deux familles paysannes **très pauvres**, les **Tuvache** et les **Vallin**, vivent côte à côte avec leurs nombreux enfants.

| Famille | Sa décision | Ce qu’il advient |
| Les **Tuvache** | Elles **refusent avec indignation** l’offre des d’Hubières | **Charlot** reste paysan |
| Les **Vallin** | Elles **acceptent** et vendent leur fils **Jean** contre une rente | Vingt ans plus tard, **Jean revient riche et élégant** embrasser ses parents |

> **M. et Mme d’Hubières**, bourgeois sans enfant, proposaient d’**adopter un petit garçon contre une rente**.

| La chute | Ce qu’elle retourne |
| **Charlot** comprend **ce que le refus de ses parents lui a coûté** | Il les **insulte** et **quitte la ferme** |

## À retenir
Une nouvelle réaliste **très brève**, construite sur une **symétrie parfaite** entre les deux familles.

> **Maupassant ne juge pas** : il montre que le geste « **moral** » des Tuvache **produit du malheur**, et que le geste « **scandaleux** » des Vallin **produit une réussite**.

> La **chute retourne le récit d’une phrase**.

Souvent étudiée pour la **construction**, le **discours rapporté** et le **patois**.

## Les personnages
| Personnage | Son rôle |
| **Charlot Tuvache** | L’enfant d’abord choisi par Mme d’Hubières, que ses parents gardent |
| **Jean Vallin** | L’enfant cédé, qui revient en « jeune monsieur » |
| **Mme d’Hubières** | La bourgeoise qui veut un enfant et paie pour l’avoir |
| La **mère Tuvache** | Fière de son refus, elle méprise les Vallin pendant vingt ans |

La rente promise aux Vallin est de **cent francs par mois**, portée à cent vingt.

## Les thèmes
L’**argent** et la **misère**, la **morale** qui ne nourrit pas, l’**amour parental**, la vanité sociale.

## Pour la dissertation et l’oral
Un modèle de **nouvelle à chute** : court, symétrique, l’ironie tient tout entière dans le dernier retournement. Relève le **patois** des dialogues, marque du réalisme.

## La phrase à citer
> « Manants, va ! » — le dernier mot de Charlot à ses parents`,
          },
          questions: [
            ['Que proposent les d’Hubières aux deux familles paysannes ?', ['Adopter un de leurs enfants contre une rente', 'Employer les parents chez eux', 'Racheter leur ferme', 'Payer l’école des enfants'], 0, 'Une famille refuse, l’autre accepte : toute la nouvelle est là.'],
            ['Quelle famille accepte de céder son enfant ?', ['Les Vallin', 'Les Tuvache', 'Les deux', 'Aucune'], 0, 'Les Tuvache refusent avec indignation et se croient supérieurs.'],
            ['Que se passe-t-il vingt ans plus tard ?', ['Jean revient riche, et Charlot reproche à ses parents leur refus', 'Jean meurt en ville', 'Les deux familles se réconcilient', 'Les d’Hubières reviennent chercher un second enfant'], 0, 'La chute retourne toute la morale du récit.'],
            ['Sur quelle construction repose la nouvelle ?', ['Une symétrie parfaite entre les deux familles', 'Un récit enchâssé', 'Un journal intime', 'Une succession de lettres'], 0, 'La symétrie rend la comparaison finale implacable.'],
            ['Quelle position Maupassant adopte-t-il ?', ['Il montre sans juger, et laisse la chute parler', 'Il condamne les Vallin', 'Il condamne les Tuvache', 'Il défend les d’Hubières'], 0, 'Le geste moral produit du malheur, le geste scandaleux une réussite.'],
            ['La nouvelle appartient au mouvement réaliste.', ['Vrai', 'Faux'], 0, 'Milieu paysan, langage rendu, absence d’idéalisation : Maupassant est un réaliste doublé d’un naturaliste.'],
          ],
        },
        {
          titre: 'Bajazet, Jean Racine',
          lecon: {
            titre: 'Racine, 1672 — le sérail comme lieu clos de la tragédie',
            cours: `## L’auteur et le contexte
**Jean Racine** (1639-1699) fait jouer *Bajazet* en **janvier 1672** à l’**Hôtel de Bourgogne**, entre *Bérénice* et *Mithridate*. Dans sa préface, il dit tenir l’histoire du récit du **comte de Cézy**, ambassadeur de France à Constantinople à l’époque des faits.

## L’histoire
À Constantinople, pendant que le sultan **Amurat** guerroie contre Babylone, son frère **Bajazet** est **retenu prisonnier au sérail**.

| Personnage | Ce qu’il veut |
| **Roxane**, favorite à qui le sultan a confié le palais | Elle aime Bajazet et lui propose un marché : **l’épouser et régner, ou mourir** |
| **Bajazet** | Il aime **Atalide** |
| **Atalide** | Pour le sauver, elle lui conseille de **feindre l’amour** envers Roxane |
| Le vizir **Acomat** | Il manœuvre **pour ses propres intérêts** |

| La fin | Ce qui la déclenche |
| Roxane **découvre la vérité par une lettre** | Elle fait **exécuter Bajazet** |
| Puis | Elle est **tuée sur ordre d’Amurat** ; **Atalide se donne la mort** |

## À retenir
> **Seule tragédie de Racine tirée d’une histoire contemporaine** — les faits datent de **1635**. Il justifie ce choix par l’**éloignement géographique**, qui **remplace** l’éloignement dans le temps.

| Le sérail | Ce qu’il impose |
| Un espace **clos et mortel** | La parole y est **surveillée** |
| — | **Mentir devient une question de survie** |

Tragédie de la **dissimulation** : **chacun joue un rôle et meurt de l’avoir mal joué**.

## Les autres personnages
| Personnage | Son rôle |
| **Osmin** | Le confident d’Acomat |
| **Zatime** | L’esclave de Roxane, qui trouve la lettre |
| **Zaïre** | L’esclave d’Atalide |
| **Orcan** | L’esclave envoyé par Amurat, qui tue Roxane |

Acomat, lui, **s’enfuit** : dans ce palais, le calcul survit mieux que l’amour.

## Les thèmes
| Thème | Ce qu’il donne à la pièce |
| La **jalousie** | Roxane passe de l’amour au meurtre en un instant |
| Le **pouvoir** | Tout vient d’Amurat, l’absent qui décide de tout |
| La **parole** | Une lettre, un mot, un regard suffisent à condamner |

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre du XVIIe au XXIe siècle**. Au cinquième acte, Roxane ne dit à Bajazet qu’un mot, « Sortez. » : il sort, et c’est la mort qui l’attend. Le mot le plus court de la pièce en est le plus tragique.

## La phrase à citer
> « Sortez. » — le mot le plus célèbre de la pièce, prononcé par Roxane.`,
          },
          questions: [
            ['Où se déroule la tragédie ?', ['Dans le sérail de Constantinople', 'À Rome', 'À Athènes', 'En Épire'], 0, 'Un espace clos où la parole est surveillée.'],
            ['Quel marché Roxane propose-t-elle à Bajazet ?', ['L’épouser et régner, ou mourir', 'Fuir avec elle', 'Trahir Amurat en échange de sa liberté', 'Épouser Atalide'], 0, 'Bajazet aime Atalide : il feindra, et cela le perdra.'],
            ['Qui conseille à Bajazet de feindre l’amour pour Roxane ?', ['Atalide', 'Acomat', 'Amurat', 'Osmin'], 0, 'Elle croit ainsi le sauver ; elle cause sa mort.'],
            ['Qu’est-ce qui révèle la vérité à Roxane ?', ['Une lettre', 'Un aveu d’Acomat', 'Un espion du sultan', 'Un rêve'], 0, 'La preuve écrite déclenche le dénouement.'],
            ['Quelle particularité cette tragédie présente-t-elle chez Racine ?', ['Elle est tirée d’une histoire contemporaine', 'Elle est écrite en prose', 'Elle finit bien', 'Elle n’a pas d’unité de lieu'], 0, 'Racine invoque l’éloignement géographique comme substitut à l’éloignement dans le temps.'],
            ['Bajazet survit à la pièce.', ['Vrai', 'Faux'], 1, 'Roxane le fait exécuter ; elle est ensuite tuée, et Atalide se donne la mort.'],
          ],
        },
        {
          titre: 'Bel-Ami, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1885 — l’ascension d’un homme sans qualités',
            cours: `## L’auteur et le contexte
**Guy de Maupassant** (1850-1893) publie *Bel-Ami* en **1885**, d’abord en feuilleton dans le journal *Gil Blas*. Il connaît bien la presse : il y écrit chaque semaine. Le roman se passe à Paris, au début des années **1880**.

## L’histoire
**Georges Duroy**, ancien sous-officier d’Afrique **sans argent ni talent**, entre au journal *La Vie française* grâce à son camarade **Forestier**.

> Il apprend à écrire — c’est-à-dire à **se faire écrire ses articles** par **Madeleine Forestier**.

| Femme | Ce qu’elle lui apporte |
| **Clotilde de Marelle** | L’argent de poche et la liaison |
| **Madeleine** | Il l’épouse veuve — puis la **fait surprendre en adultère** pour divorcer |
| **Virginie Walter**, femme du patron | L’accès au journal |
| **Suzanne Walter**, la fille | Il l’**enlève** et l’**épouse** |

> Devenu « **Du Roy de Cantel** », il sort de la Madeleine **en triomphe**, **promis à tout**.

## À retenir
> Un roman de l’**arrivisme sans châtiment** : contrairement à **Julien Sorel**, **Bel-Ami réussit**.

| Ce qui est peint | Comment |
| Le **journalisme** de la IIIe République | Article de commande, chantage, campagnes payées |
| La **spéculation coloniale** | L’affaire du **Maroc** |
| Le **pouvoir des femmes** | Dans une société qui prétend les tenir à l’écart |

Le style est **net**, la focalisation **collée au personnage** : on **épouse son regard sans jamais l’approuver**.

## Les autres personnages
| Personnage | Son rôle |
| **Charles Forestier** | L’ancien camarade, malade, qui meurt à Cannes |
| **M. Walter** | Le député-banquier, patron de *La Vie française* |
| **Laurine** | La fillette de Clotilde : c’est elle qui l’appelle « **Bel-Ami** » |
| **Norbert de Varenne** | Le vieux poète qui lui parle de la **mort** une nuit à Paris |
| **Laroche-Mathieu** | Le ministre, amant de Madeleine, surpris avec elle |
| Le **comte de Vaudrec** | Il lègue sa fortune à Madeleine ; Duroy en exige la moitié |

## Les thèmes
L’**arrivisme**, la **corruption** de la presse et de la politique, la **séduction** comme moyen, et la **peur de la mort** que Duroy fuit dans l’action.

## Pour la dissertation et l’oral
Un **roman d’apprentissage à l’envers** : le héros n’apprend pas la vertu mais la ruse. Dans les dernières lignes, Duroy regarde déjà vers la **Chambre des députés** — avant que le roman se referme sur l’image de Clotilde de Marelle.

## La phrase à citer
> « Et il lui sembla qu’il allait faire un bond du portique de la Madeleine au portique du Palais-Bourbon. » — à la sortie de l’église, à la dernière page`,
          },
          questions: [
            ['Quel est le vrai nom de Bel-Ami ?', ['Georges Duroy', 'Charles Forestier', 'Norbert de Varenne', 'Jacques Rival'], 0, 'Il deviendra « Du Roy de Cantel » à force d’ambition.'],
            ['Comment Duroy entre-t-il dans le journalisme ?', ['Grâce à son ancien camarade Forestier', 'Par un concours', 'Par héritage', 'Par une école de journalisme'], 0, 'Ses premiers articles sont écrits par Madeleine Forestier.'],
            ['Que fait Duroy pour se débarrasser de Madeleine ?', ['Il la fait surprendre en adultère pour divorcer', 'Il l’abandonne sans explication', 'Il l’envoie en province', 'Il la ruine'], 0, 'Le divorce lui permet d’épouser plus haut.'],
            ['Comment le roman se termine-t-il ?', ['Par son mariage triomphal avec Suzanne Walter', 'Par sa ruine', 'Par un duel mortel', 'Par son départ pour l’Algérie'], 0, 'L’arriviste n’est pas puni : c’est la force du roman.'],
            ['Quel milieu le roman peint-il principalement ?', ['La presse et la spéculation sous la IIIe République', 'Le monde paysan', 'L’armée coloniale seulement', 'L’Église'], 0, 'L’affaire du Maroc y montre les liens entre journal, politique et argent.'],
            ['Bel-Ami doit sa réussite à son talent d’écrivain.', ['Vrai', 'Faux'], 1, 'Il ne sait pas écrire : ce sont les femmes et les circonstances qui le portent.'],
          ],
        },
        {
          titre: 'Belle du Seigneur, Albert Cohen',
          lecon: {
            titre: 'Cohen, 1968 — la passion jusqu’à l’asphyxie',
            cours: `## L’auteur et le contexte
**Albert Cohen** (1895-1981), né à **Corfou** dans une famille juive, grandit à Marseille puis vit à **Genève**, où il travaille pour des organisations internationales. *Belle du Seigneur* (**1968**) est le troisième volet d’un cycle commencé avec *Solal* (1930) et *Mangeclous* (1938), et suivi des *Valeureux* (1969). Il a aussi écrit *Le Livre de ma mère* (1954).

## L’histoire
**Solal**, sous-secrétaire général de la **Société des Nations** à Genève — beau, riche et juif — séduit **Ariane d’Auble**, épouse d’**Adrien Deume**, petit fonctionnaire médiocre **qu’il fait promouvoir pour l’éloigner**.

| Étape | Ce qui se passe |
| La démonstration | **Déguisé en vieillard hideux**, Solal avait été **repoussé** ; il revient **en séducteur** — et gagne |
| La fuite | Les amants s’installent sur la **Côte d’Azur** |
| L’asphyxie | Coupée du monde, la passion **se met lentement à mourir d’elle-même** : rituels, mensonges, jalousies, **ennui** |
| La fin | Leur **double suicide** |

## À retenir
Un **roman-monument** — plus de **mille pages** —, écrit sur des décennies : à la fois le plus **lyrique** et le plus **cruel** des romans d’amour français.

| Registre | Où il se déploie |
| Les longs **monologues intérieurs** | La conscience d’Ariane, celle de Solal |
| La **satire féroce** | La bureaucratie internationale, les Deume |
| La **comédie** | Les « **Valeureux** », cousins de Céphalonie |
| Les pages d’une **beauté fulgurante** | La séduction, la fin |

**Prix du roman de l’Académie française**, **1968**.

## Les autres personnages
| Personnage | Son rôle |
| **Antoinette Deume** | La belle-mère d’Ariane, bourgeoise dévote et snob |
| **Mariette** | La vieille servante, dont les monologues font rire |
| **Saltiel** | L’oncle de Solal, l’un des Valeureux |
| **Mangeclous** | Le plus bavard et le plus drôle des cousins |

Au **Ritz** de Genève, Solal parie avec Ariane qu’il la séduira, et il **démonte d’avance** les ruses de la séduction : la force, la beauté, le mépris des faibles.

## Les thèmes
La **passion** absolue et sa mort lente, la **séduction** démasquée, la **bureaucratie** ridicule, l’**antisémitisme** des années 1930.

## Pour la dissertation et l’oral
Utile pour réfléchir à la **peinture de l’amour** dans le roman : Cohen montre ce qui vient **après** la conquête, là où la plupart des romans s’arrêtent.

## La phrase à citer
> La formule de Solal : la séduction n’est que « **babouinerie** », l’adoration animale de la force.`,
          },
          questions: [
            ['Qui est Solal ?', ['Un haut fonctionnaire de la Société des Nations à Genève', 'Un banquier parisien', 'Un écrivain suisse', 'Un médecin'], 0, 'Sa position sociale et sa judéité sont au cœur du roman.'],
            ['Comment Solal séduit-il Ariane la seconde fois ?', ['En revenant en séducteur, après avoir été repoussé déguisé en vieillard', 'En la sauvant d’un accident', 'Par une correspondance secrète', 'En achetant sa maison'], 0, 'La séduction est une démonstration sur la vanité de l’amour.'],
            ['Qui est Adrien Deume ?', ['Le mari d’Ariane, petit fonctionnaire médiocre', 'Le frère de Solal', 'Un diplomate anglais', 'Le père d’Ariane'], 0, 'Solal le fait promouvoir pour l’éloigner.'],
            ['Qu’arrive-t-il à la passion des amants sur la Côte d’Azur ?', ['Elle s’étiole dans les rituels, la jalousie et l’ennui', 'Elle se renforce', 'Elle se transforme en amitié', 'Elle est interrompue par la guerre'], 0, 'Coupée du monde, elle meurt de sa propre intensité.'],
            ['Comment le roman se termine-t-il ?', ['Par le double suicide des amants', 'Par le retour d’Ariane auprès d’Adrien', 'Par le mariage de Solal et Ariane', 'Par la fuite de Solal seul'], 0, 'La fin est annoncée par tout le mouvement du livre.'],
            ['Le roman est uniquement lyrique et sérieux.', ['Vrai', 'Faux'], 1, 'Il alterne lyrisme, satire féroce de la bureaucratie et comédie des « Valeureux ».'],
          ],
        },
        {
          titre: 'Bérénice, Jean Racine',
          lecon: {
            titre: 'Racine, 1670 — « une tristesse majestueuse »',
            cours: `## L’auteur et le contexte
**Jean Racine** (1639-1699) fait jouer *Bérénice* le **21 novembre 1670** à l’**Hôtel de Bourgogne**. Une semaine plus tard, la troupe de Molière crée *Tite et Bérénice* de **Pierre Corneille** sur le même sujet : les deux pièces rivalisent, et c’est celle de Racine qui l’emporte.

> Dans sa préface, Racine donne sa règle : « **toute l’invention consiste à faire quelque chose de rien** ».

## L’histoire
**Titus** vient d’être proclamé **empereur de Rome**. Il aime **Bérénice**, reine de Palestine, et elle l’aime : ils devaient se marier.

| L’obstacle | Ce qu’il produit |
| **Rome n’accepte pas de reine étrangère** | Titus, après avoir hésité et souffert, **choisit son devoir** |

| Personnage | Sa situation à la fin |
| **Titus** | Il **la renvoie** |
| **Bérénice** | Elle comprend, **refuse de se tuer**, et **part** |
| **Antiochus**, roi de Comagène | Il l’aime **en silence depuis cinq ans** — et espère un instant |

> Les trois personnages restent **vivants et séparés**.

## À retenir
Racine tire de **cinq lignes de Suétone** une tragédie entière : *invitus invitam dimisit* — **il la renvoya malgré lui, malgré elle**.

| Ce que la pièce n’a pas | Ce qu’elle a |
| **Aucun mort**, aucune violence | Une tragédie **intérieure** |
| — | Une « **tristesse majestueuse** », théorisée par Racine dans sa préface |

**Trois personnages**, un seul lieu, une **action minimale** : c’est l’**épure du théâtre classique**.

## Les confidents
| Confident | De qui |
| **Paulin** | Celui de Titus : il lui rappelle ce que Rome exige |
| **Arsace** | Celui d’Antiochus |
| **Phénice** | Celle de Bérénice |

## Les thèmes
| Thème | Ce que la pièce en fait |
| Le **devoir** contre l’amour | Titus choisit l’Empire, sans cesser d’aimer |
| Le **temps** | « Dans un mois, dans un an, comment souffrirons-nous… » : la séparation est pensée comme durée infinie |
| La **parole** | Tout se joue dans l’aveu, que Titus repousse sans cesse |

Antiochus clôt la pièce sur un seul mot : « **Hélas !** »

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. Un excellent exemple pour montrer qu’une tragédie **n’a pas besoin de mort** : le tragique tient à l’impossibilité de concilier deux devoirs.

## La phrase à citer
> « Je l’aime, je le fuis ; Titus m’aime, il me quitte. » — Bérénice, à Antiochus`,
          },
          questions: [
            ['Pourquoi Titus renvoie-t-il Bérénice ?', ['Rome n’accepte pas qu’un empereur épouse une reine étrangère', 'Il ne l’aime plus', 'Elle a trahi Rome', 'Il aime une autre femme'], 0, 'Le devoir l’emporte sur l’amour, sans que l’amour cesse.'],
            ['Qui est Antiochus ?', ['Le roi de Comagène, qui aime Bérénice en silence', 'Le frère de Titus', 'Un sénateur romain', 'Le père de Bérénice'], 0, 'Il espère un instant, et repart lui aussi seul.'],
            ['Combien de personnages meurent dans la pièce ?', ['Aucun', 'Un', 'Deux', 'Trois'], 0, 'La tragédie est entièrement intérieure.'],
            ['De quelle source Racine tire-t-il son sujet ?', ['Cinq lignes de Suétone', 'Un poème d’Ovide', 'Une pièce grecque', 'Une chronique médiévale'], 0, '« Invitus invitam dimisit » : il la renvoya malgré lui, malgré elle.'],
            ['Quelle formule Racine emploie-t-il dans sa préface ?', ['« Une tristesse majestueuse »', '« Le sang appelle le sang »', '« La passion est un poison »', '« Rien de trop »'], 0, 'Elle justifie une tragédie sans mort ni violence.'],
            ['Bérénice se donne la mort à la fin de la pièce.', ['Vrai', 'Faux'], 1, 'Elle refuse de se tuer et part : les trois personnages restent vivants et séparés.'],
          ],
        },
        {
          titre: 'Bonjour tristesse, Françoise Sagan',
          lecon: {
            titre: 'Sagan, 1954 — dix-huit ans, et un premier roman scandaleux',
            cours: `## L’auteur et le contexte
**Françoise Sagan** (1935-2004), de son vrai nom **Françoise Quoirez**, emprunte son pseudonyme à un personnage de **Proust**, la princesse de Sagan. *Bonjour tristesse* paraît chez **Julliard** en **1954** et devient aussitôt un succès mondial.

> **François Mauriac** la surnomme dans *Le Figaro* « **un charmant petit monstre** ».

## L’histoire
**Cécile**, dix-sept ans, passe l’été sur la Côte d’Azur avec son père **Raymond**, veuf **léger et charmant**, et sa maîtresse **Elsa**.

| Étape | Ce qui se passe |
| L’arrivée | **Anne Larsen**, amie de la mère morte : **intelligente et rigoureuse** ; Raymond décide de l’épouser |
| La menace | Anne veut **ordonner cette vie** : elle éloigne Cécile de son flirt **Cyril**, l’oblige à travailler |
| La **machination** | Cécile fait croire à son père qu’**Elsa et Cyril sont amants**, pour réveiller sa jalousie |
| Le plan réussit **trop bien** | Anne **surprend Raymond avec Elsa**, part en voiture et **se tue** |

> **Accident ou suicide** : le roman **ne tranche pas**.

## À retenir
| Fait | Le détail |
| L’âge de l’autrice | **Dix-huit ans** |
| Publication | **1954**, **prix des Critiques** |
| L’accueil | **Scandale immédiat** : liberté de mœurs et **absence de remords** |
| La forme | Récit **rétrospectif** à la première personne, style **limpide et rapide** |

Le titre vient d’un poème d’**Éluard**.

## Les personnages
| Personnage | Son rôle |
| **Cécile** | La narratrice, oisive, lucide, qui manipule tout le monde |
| **Raymond** | Son père, quarante ans, séducteur insouciant |
| **Elsa** | La jeune maîtresse du père, jolie et un peu sotte |
| **Anne Larsen** | L’ordre, l’intelligence, l’exigence |
| **Cyril** | L’étudiant avec qui Cécile vit son premier amour |

Le titre vient d’un vers d’Éluard : « Adieu tristesse / Bonjour tristesse ». Le roman est adapté au cinéma par **Otto Preminger** en **1958**.

## Les thèmes
L’**adolescence** et la découverte de sa propre cruauté, la **liberté** et le plaisir, la **culpabilité** qui naît trop tard, le **temps** d’un été.

## Pour la dissertation et l’oral
Utile pour le **récit à la première personne** : la narratrice raconte après coup, et son regard rétrospectif fait naître la tristesse.

## La phrase à citer
> La première phrase du roman hésite à donner à ce sentiment nouveau « le beau nom grave de tristesse ».`,
          },
          questions: [
            ['Quel âge a Françoise Sagan quand elle écrit ce roman ?', ['Dix-huit ans', 'Vingt-cinq ans', 'Trente ans', 'Vingt et un ans'], 0, 'Publié en 1954, il fit scandale et lui valut le prix des Critiques.'],
            ['Qui est Anne Larsen ?', ['Une amie de la mère morte, que le père veut épouser', 'La sœur de Cécile', 'La maîtresse de Cyril', 'La gouvernante'], 0, 'Sa rigueur menace la vie légère de Cécile et de son père.'],
            ['Quelle machination Cécile organise-t-elle ?', ['Faire croire à son père qu’Elsa et Cyril sont amants', 'Cacher une lettre d’Anne', 'Fuir avec Cyril', 'Ruiner son père'], 0, 'Elle veut réveiller la jalousie de Raymond, et elle y parvient trop bien.'],
            ['Comment le roman se termine-t-il ?', ['Anne part en voiture et se tue', 'Anne épouse Raymond', 'Cécile part étudier à Paris', 'Cyril épouse Elsa'], 0, 'Accident ou suicide : le roman ne tranche pas.'],
            ['D’où vient le titre du roman ?', ['D’un poème de Paul Éluard', 'D’une chanson populaire', 'D’un vers de Baudelaire', 'D’une lettre de Sagan'], 0, 'Le poème donne aussi le ton du récit.'],
            ['Le roman fut immédiatement salué comme un livre moral.', ['Vrai', 'Faux'], 1, 'Sa liberté de mœurs et son absence de remords firent scandale.'],
          ],
        },
        {
          titre: 'Boubouroche, Georges Courteline',
          lecon: {
            titre: 'Courteline, 1893 — le cocu qui refuse de voir',
            cours: `## L’auteur et le contexte
**Georges Courteline** (1858-1929), de son vrai nom **Georges Moinaux**, fils d’un chroniqueur judiciaire humoriste, fait d’abord de Boubouroche le héros d’une **nouvelle** parue en **1892**. La pièce est créée le **27 avril 1893** au **Théâtre-Libre** d’**André Antoine**, le théâtre du naturalisme.

## L’histoire
Comédie en **deux actes**. **Boubouroche**, brave homme **jovial et naïf**, entretient depuis **huit ans** **Adèle**, qui le trompe.

| Étape | Ce qui se passe |
| L’avertissement | Un vieux voisin, exaspéré, vient le prévenir : **un homme se cache chez elle** |
| La preuve | Boubouroche monte, fouille, et **découvre effectivement l’amant**, **André**, caché dans le **bahut** — un grand meuble-placard |
| Le retournement | **Adèle ne s’excuse pas** : elle se dit **outragée** par tant de soupçons |
| La fin | Elle invente une explication **invraisemblable** — **Boubouroche demande pardon** |

## À retenir
> Le comique naît de l’**aveuglement volontaire** : Boubouroche **ne se laisse pas tromper**, il **choisit** de l’être — **parce que la vérité coûterait trop cher**.

| Trait | Son effet |
| Dialogue **vif**, langue **parlée** | Le rythme de la scène |
| Personnages de la **petite bourgeoisie parisienne** | Le monde de Courteline |

Courteline, auteur de saynètes et de romans — *Messieurs les ronds-de-cuir*, *Le Train de 8 h 47* —, est le **peintre des bureaux, des casernes et des ménages**.

## Les personnages
| Personnage | Son rôle |
| **Boubouroche** | Gros, bon, naïf, exploité par ses amis de café |
| **Adèle** | Sa maîtresse, qu’il entretient depuis huit ans |
| **André** | L’amant, qui se cache dans le bahut |
| Le **vieux monsieur** | Le voisin de palier, qui a tout entendu à travers la cloison |
| **Potasse**, **Roth**, **Fouettard** | Les partenaires de manille de l’acte I |

## La fin
Adèle lui offre de révéler « **un secret qui n’est pas le mien** » ; Boubouroche refuse. Réconcilié, il descend… **empoigner le vieux monsieur** par la cravate. Toute sa colère se retourne contre celui qui disait vrai.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. La pièce montre comment la **comédie de mœurs** fait rire d’une vérité amère : on préfère souvent le mensonge qui rassure.

## La phrase à citer
> « Un galant homme est toujours un galant homme, même le jour où certaines circonstances de la vie l’ont mis dans la nécessité de se cacher dans un bahut. » — André`,
          },
          questions: [
            ['Qui est Boubouroche ?', ['Un brave homme naïf trompé par sa maîtresse Adèle', 'Un militaire de carrière', 'Un fonctionnaire de bureau', 'Un avocat'], 0, 'Il l’entretient depuis huit ans.'],
            ['Que découvre Boubouroche chez Adèle ?', ['Un homme caché dans le bahut, un grand meuble-placard', 'Des lettres compromettantes', 'Une valise prête pour un départ', 'Un enfant caché'], 0, 'Le voisin l’avait prévenu : l’amant, André, se cache dans le bahut, éclairé, avec une chaise et une table.'],
            ['Comment Adèle réagit-elle ?', ['Elle se dit outragée et retourne la situation', 'Elle avoue tout', 'Elle s’enfuit', 'Elle demande pardon'], 0, 'Elle invente une explication invraisemblable, et il la croit.'],
            ['D’où vient le comique de la pièce ?', ['De l’aveuglement volontaire de Boubouroche', 'D’un quiproquo sur les noms', 'De déguisements successifs', 'D’un jeu de mots répété'], 0, 'Il choisit d’être trompé parce que la vérité coûterait trop cher.'],
            ['Quel milieu Courteline peint-il habituellement ?', ['La petite bourgeoisie, les bureaux et les casernes', 'La haute aristocratie', 'Le monde paysan', 'Les milieux artistiques'], 0, 'Messieurs les ronds-de-cuir en est le meilleur exemple.'],
            ['La pièce se termine par la rupture des amants.', ['Vrai', 'Faux'], 1, 'C’est Boubouroche qui demande pardon : le retournement est complet.'],
          ],
        },
        {
          titre: 'Boule de suif, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1880 — la prostituée et les honnêtes gens',
            cours: `## L’auteur et le contexte
**Guy de Maupassant** (1850-1893) a trente ans. *Boule de suif* paraît en **avril 1880** dans *Les Soirées de Médan*, un recueil collectif de six nouvelles sur la guerre de 1870, autour de **Zola** (avec Huysmans, Céard, Hennique et Alexis).

> **Flaubert**, son maître, qui meurt quelques semaines plus tard, la salue comme un **chef-d’œuvre**.

## L’histoire
Pendant la **guerre de 1870**, une diligence quitte **Rouen occupée** pour Le Havre. **Dix voyageurs** : des commerçants, un couple de nobles, un démocrate, **deux religieuses** — et **Élisabeth Rousset**, dite **Boule de suif**, prostituée.

| Étape | Ce qui se passe |
| Le premier repas | Affamés, les bourgeois acceptent **avec reconnaissance** son panier de provisions |
| À **Tôtes** | Un officier prussien **retient la voiture** : il exige de coucher avec Boule de suif |
| Le refus | Elle refuse **par patriotisme** |
| La pression | Les voyageurs, d’abord solidaires, la **pressent** et l’**endorment de bons arguments** — **y compris religieux**. Elle cède |
| Le lendemain | **Tous l’ignorent**, mangent **devant elle sans rien offrir** ; elle pleure, un voyageur siffle *La Marseillaise* |

## À retenir
La nouvelle qui a **lancé Maupassant**, publiée dans *Les Soirées de Médan*.

| La construction | Ce qu’elle oppose |
| Le **partage du repas** au début | Le **refus de partage** à la fin |

> La satire vise l’**hypocrisie bourgeoise**, qui **sacrifie une femme méprisée** puis **la punit d’avoir cédé**.

## Les personnages
| Personnage | Ce qu’il représente |
| **M. et Mme Loiseau** | Des marchands de vin, rusés et vulgaires |
| **M. et Mme Carré-Lamadon** | La grande bourgeoisie industrielle |
| Le **comte et la comtesse de Bréville** | La vieille noblesse |
| **Cornudet** | Le démocrate, qui siffle *La Marseillaise* à la fin |
| Les **deux religieuses** | L’Église, qui justifie le sacrifice |
| **Boule de suif** | La seule vraiment patriote et généreuse |

## Les thèmes
L’**hypocrisie** sociale, l’**égoïsme** de classe, la **guerre** et l’occupation, la **dignité** du personnage méprisé.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. La diligence est une **société en miniature** : chaque classe y a son représentant. À l’oral, montre comment la **symétrie des deux repas** porte toute la critique.

## La phrase à citer
> « Personne ne la regardait, ne songeait à elle. »`,
          },
          questions: [
            ['Pendant quelle guerre se déroule la nouvelle ?', ['La guerre franco-prussienne de 1870', 'La Première Guerre mondiale', 'Les guerres napoléoniennes', 'La guerre de Crimée'], 0, 'La diligence quitte Rouen occupée pour Le Havre.'],
            ['Qui est Boule de suif ?', ['Une prostituée nommée Élisabeth Rousset', 'Une aristocrate déchue', 'Une religieuse', 'Une commerçante rouennaise'], 0, 'Elle est la seule à agir par patriotisme.'],
            ['Qu’exige l’officier prussien ?', ['Passer la nuit avec Boule de suif pour laisser partir la voiture', 'Une rançon', 'Les papiers des voyageurs', 'La confiscation des chevaux'], 0, 'Elle refuse d’abord, puis cède sous la pression des autres voyageurs.'],
            ['Comment les voyageurs traitent-ils Boule de suif au retour ?', ['Ils l’ignorent et mangent devant elle sans rien lui offrir', 'Ils la remercient chaleureusement', 'Ils lui offrent de l’argent', 'Ils la dénoncent aux Prussiens'], 0, 'La symétrie avec le partage du début est le cœur de la nouvelle.'],
            ['Dans quel recueil la nouvelle a-t-elle paru ?', ['Les Soirées de Médan', 'Contes de la bécasse', 'Le Horla', 'La Maison Tellier'], 0, 'Recueil collectif du groupe naturaliste, autour de Zola.'],
            ['La nouvelle fait l’éloge du patriotisme des bourgeois.', ['Vrai', 'Faux'], 1, 'Elle dénonce leur hypocrisie : seule la prostituée agit par patriotisme.'],
          ],
        },
        {
          titre: 'Britannicus, Jean Racine',
          lecon: {
            titre: 'Racine, 1669 — la naissance d’un monstre',
            cours: `## L’auteur et le contexte
**Jean Racine** (1639-1699) fait jouer *Britannicus* le **13 décembre 1669** à l’**Hôtel de Bourgogne**. Pour ce sujet romain, il s’appuie sur l’historien latin **Tacite** et ses *Annales*, et rivalise avec **Corneille** sur son propre terrain : la tragédie politique.

## L’histoire
**Néron** règne depuis **trois ans** sans avoir encore commis de crime : c’est le « **monstre naissant** ».

| Personnage | Ce qu’il veut |
| **Agrippine**, sa mère | Elle l’a fait empereur : elle veut **gouverner à travers lui** |
| **Néron** | Il enlève **Junie**, aimée de **Britannicus** |
| **Britannicus** | Fils de Claude, **héritier légitime écarté** du trône |
| **Burrhus** | L’honnête homme |
| **Narcisse** | Le **traître** |

> La scène la plus cruelle du théâtre français : Néron exige de **Junie** qu’elle **repousse Britannicus devant lui, caché**, **sans rien laisser paraître**.

| Le dénouement | Ce qui arrive |
| Néron **choisit le crime** | Il **empoisonne Britannicus** pendant un banquet de réconciliation |
| **Junie** | Elle se **réfugie chez les Vestales** |
| **Agrippine** | Elle **prophétise la fin de son fils** |

## À retenir
> Tragédie **politique** : elle montre **comment un pouvoir se libère de ses tuteurs** et **bascule dans la tyrannie**.

Le personnage central n’est **pas la victime** mais le **bourreau en formation**. Racine y peint aussi la **mère dévorante** et le **conseiller pervers**.

## Scènes et répliques à connaître
| Moment | Ce qui s’y joue |
| L’ouverture | **Agrippine** attend à l’aube devant la porte de Néron, qui ne la reçoit plus |
| L’aveu de Néron | Il a vu Junie enlevée, en larmes : « **J’aimais jusqu’à ses pleurs que je faisais couler** » |
| La fin de Narcisse | Il est **massacré par le peuple** |
| La dernière scène | Burrhus redoute ce que Néron va devenir |

## Les thèmes
Le **pouvoir** et sa conquête, le **regard** qui surveille, la **manipulation** par la parole, l’amour réduit à la possession.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. La scène où Néron, caché, observe Junie montre le **théâtre dans le théâtre** : le spectateur sait ce que Britannicus ignore.

## La phrase à citer
> « J’embrasse mon rival, mais c’est pour l’étouffer. »`,
          },
          questions: [
            ['Comment Racine désigne-t-il Néron dans sa préface ?', ['Un « monstre naissant »', 'Un tyran accompli', 'Un prince éclairé', 'Un empereur malheureux'], 0, 'La pièce montre le basculement, pas le crime installé.'],
            ['Qui est Agrippine ?', ['La mère de Néron, qui veut gouverner à travers lui', 'La femme de Britannicus', 'La sœur de Junie', 'Une conseillère de Claude'], 0, 'Elle a fait son fils empereur et prétend le tenir.'],
            ['Quelle scène cruelle Néron impose-t-il à Junie ?', ['Repousser Britannicus devant lui, caché, sans rien laisser paraître', 'Assister à l’exécution de son frère', 'Renoncer publiquement à sa naissance', 'Épouser Narcisse'], 0, 'C’est l’une des scènes les plus célèbres du théâtre français.'],
            ['Quels sont les deux conseillers opposés de Néron ?', ['Burrhus et Narcisse', 'Sénèque et Tacite', 'Acomat et Osmin', 'Créon et Tirésias'], 0, 'L’honnête homme contre le traître : Néron choisit le second.'],
            ['Comment Britannicus meurt-il ?', ['Empoisonné lors d’un banquet de réconciliation', 'Poignardé dans le palais', 'Exilé puis assassiné', 'Il ne meurt pas'], 0, 'Le crime scelle le basculement de Néron.'],
            ['Le personnage central de la tragédie est la victime.', ['Vrai', 'Faux'], 1, 'C’est Néron, le bourreau en formation, que la pièce observe.'],
          ],
        },
        {
          titre: 'Caligula, Albert Camus',
          lecon: {
            titre: 'Camus, 1944 — la logique poussée jusqu’au crime',
            cours: `## L’auteur et le contexte
**Albert Camus** (1913-1960), né en Algérie, journaliste et résistant, prix Nobel de littérature en **1957**, tire son sujet de l’historien latin **Suétone** (*Vies des douze Césars*). La pièce est créée en **septembre 1945** au théâtre **Hébertot**, avec le jeune **Gérard Philipe** dans le rôle-titre.

## L’histoire
À la mort de sa sœur et maîtresse **Drusilla**, l’empereur **Caligula** disparaît **trois jours** et revient transformé.

> Il a compris que « **les hommes meurent et ne sont pas heureux** ».

| La prémisse | La conséquence qu’il en tire |
| Le monde est **absurde**, rien n’a de sens | Il exercera une **liberté totale** |

| Ce qu’il fait | Personnage |
| Exécuter **au hasard**, ruiner les patriciens, humilier, s’ériger en dieu, **réclamer la lune** | **Caligula** |
| Organiser le complot **au nom d’un monde vivable** | **Cherea** |
| Le comprendre **sans le suivre** | **Scipion**, le jeune poète |
| Être **étranglée** par lui | **Cæsonia**, sa maîtresse |

> Les conjurés le tuent ; il crie : « **Je suis encore vivant !** »

## À retenir
| Fait | Le détail |
| Écriture, création | Écrite dès **1938**, publiée en **1944**, créée en **1945** |
| Le cycle | Celui de l’**absurde**, avec *L’Étranger* et *Le Mythe de Sisyphe* |

> **Caligula n’est pas fou : il est logique.** Et c’est **cela** qui terrifie.

Camus montre que la **révolte contre l’absurde**, **si elle nie l’autre**, **mène au meurtre** — thèse qu’il développera dans *L’Homme révolté*.

## Un autre personnage
**Hélicon**, ancien esclave affranchi, est le seul fidèle de Caligula jusqu’au bout : c’est lui qu’il charge de lui rapporter la lune. À la dernière scène, Caligula brise le **miroir** où il se regarde.

## Les thèmes
| Thème | Ce que la pièce en fait |
| L’**absurde** | Le monde ne répond pas au besoin de sens de l’homme |
| La **liberté** | Totale, elle devient tyrannie |
| Le **pouvoir** | Il donne à un homme les moyens d’appliquer sa logique aux autres |
| La **révolte** | Celle de Cherea, qui défend une vie simple et vivable |

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. La pièce pose une question de **littérature d’idées** : peut-on tout se permettre si rien n’a de sens ? Camus répond non, en montrant que Caligula finit **seul** et en reconnaissant, avant de mourir, que sa liberté « n’est pas la bonne ».

## La phrase à citer
> « Ce monde, tel qu’il est fait, n’est pas supportable. »`,
          },
          questions: [
            ['Qu’est-ce qui déclenche la transformation de Caligula ?', ['La mort de sa sœur Drusilla et la découverte de l’absurde', 'Une trahison politique', 'Une maladie', 'Un complot du Sénat'], 0, '« Les hommes meurent et ne sont pas heureux. »'],
            ['Quelle conséquence Caligula tire-t-il de l’absurdité du monde ?', ['Il exerce une liberté totale, jusqu’au crime', 'Il abdique', 'Il se réfugie dans la religion', 'Il réforme l’Empire'], 0, 'Il n’est pas fou : il est logique, et c’est cela qui terrifie.'],
            ['Que réclame Caligula à ses proches ?', ['La lune', 'Une statue d’or', 'Un triomphe militaire', 'Le trésor du Sénat'], 0, 'L’impossible, pour dire l’écart entre le désir et le monde.'],
            ['Qui organise le complot contre lui ?', ['Cherea', 'Scipion', 'Cæsonia', 'Hélicon'], 0, 'Il agit au nom d’un monde simplement vivable.'],
            ['À quel cycle de l’œuvre de Camus la pièce appartient-elle ?', ['Le cycle de l’absurde', 'Le cycle de la révolte', 'Le cycle de l’amour', 'Aucun cycle'], 0, 'Avec L’Étranger et Le Mythe de Sisyphe.'],
            ['Caligula meurt sans jamais douter de la voie qu’il a choisie.', ['Vrai', 'Faux'], 1, 'Devant son miroir, il reconnaît que « sa liberté n’est pas la bonne » — puis, frappé par les conjurés, il crie « Je suis encore vivant ! ».', 'Caligula meurt en reconnaissant son erreur.'],
          ],
        },
        {
          titre: 'Candide ou l’Optimisme, Voltaire',
          lecon: {
            titre: 'Voltaire, 1759 — le conte qui démolit l’optimisme',
            cours: `## L’auteur et le contexte
**Voltaire** (1694-1778), de son vrai nom **François-Marie Arouet**, publie *Candide* en **1759**, à Genève, sans nom d’auteur : le conte se dit « **traduit de l’allemand de M. le docteur Ralph** ». Le **tremblement de terre de Lisbonne** (1755) lui avait déjà inspiré un poème qui refusait de voir dans la catastrophe un mal nécessaire.

## L’histoire
**Candide**, jeune homme naïf élevé au château de Thunder-ten-tronckh, apprend de **Pangloss** que « **tout est au mieux dans le meilleur des mondes possibles** ».

Chassé pour avoir embrassé **Cunégonde**, il traverse le monde **et l’horreur**.

| Épreuve | Ce qu’elle dénonce |
| Enrôlement de force chez les **Bulgares** | La **guerre** |
| Le **tremblement de terre de Lisbonne** | Le mal **naturel** |
| L’**autodafé** de l’Inquisition | Le **fanatisme** |
| Le **nègre de Surinam**, mutilé pour produire du sucre | L’**esclavage** |
| Viols, pendaisons, trahisons | La cruauté ordinaire |

| Étape | Ce qui arrive |
| L’**Eldorado** | Un pays idéal — **qu’il quitte pourtant** |
| Les retrouvailles | Cunégonde est devenue **laide** : il l’**épouse quand même** |
| La fin | Une **métairie** près de Constantinople |

## À retenir
Un **conte philosophique** : récit **rapide**, personnages **sans épaisseur**, **ironie constante**, hyperboles et litotes.

| Cible | Ce que Voltaire attaque |
| L’**optimisme leibnizien** | Pangloss |
| La **guerre**, l’**Inquisition**, l’**esclavage**, le **fanatisme** | Le monde tel qu’il est |

> La conclusion, célèbre et discutée : **renoncer aux systèmes et agir** — « **il faut cultiver notre jardin** ».

## Les personnages
| Personnage | Son rôle |
| **Candide** | Le naïf qui apprend par l’expérience |
| **Pangloss** | Le philosophe optimiste, que rien ne fait changer d’avis |
| **Cunégonde** | La fille du baron, aimée de Candide |
| **Cacambo** | Le valet débrouillard, fidèle et pratique |
| **Martin** | Le savant pessimiste, pour qui l’homme est né pour souffrir |
| La **Vieille** | Fille d’un pape, elle a tout subi et vit pourtant |

## Les thèmes
Le **mal** dans le monde, la **critique** des religions et des pouvoirs, l’**utopie** (l’Eldorado), le **travail** comme sagesse modeste.

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Le conte montre comment l’**ironie** et le récit rapide servent un **combat philosophique**.

## La phrase à citer
> « Si c’est ici le meilleur des mondes possibles, que sont donc les autres ? »`,
          },
          questions: [
            ['Quelle philosophie Pangloss enseigne-t-il ?', ['Tout est au mieux dans le meilleur des mondes possibles', 'Rien n’a de sens', 'L’homme est bon par nature', 'Le plaisir est le seul bien'], 0, 'C’est l’optimisme leibnizien que le conte va démolir.'],
            ['Quelle catastrophe réelle Voltaire intègre-t-il au conte ?', ['Le tremblement de terre de Lisbonne', 'La peste de Marseille', 'L’incendie de Londres', 'La famine de 1709'], 0, 'Elle avait profondément ébranlé Voltaire en 1755.'],
            ['Que dénonce l’épisode du nègre de Surinam ?', ['L’esclavage sur lequel repose le commerce du sucre', 'La guerre entre les Bulgares et les Abares', 'L’Inquisition portugaise', 'La corruption des jésuites'], 0, '« C’est à ce prix que vous mangez du sucre en Europe. »'],
            ['Qu’est-ce que l’Eldorado dans le conte ?', ['Un pays idéal que Candide finit par quitter', 'Une ville détruite par la guerre', 'Un couvent espagnol', 'Un navire marchand'], 0, 'L’utopie ne retient pas Candide : le bonheur parfait l’ennuie.'],
            ['Par quelle formule le conte se termine-t-il ?', ['« Il faut cultiver notre jardin »', '« Tout est bien qui finit bien »', '« Écrasons l’infâme »', '« Le meilleur des mondes »'], 0, 'Renoncer aux systèmes et agir : la conclusion est encore discutée.'],
            ['Candide est un roman réaliste aux personnages fouillés.', ['Vrai', 'Faux'], 1, 'C’est un conte philosophique : récit rapide, personnages schématiques, ironie constante.'],
          ],
        },
        {
          titre: 'Capitale de la douleur, Paul Éluard',
          lecon: {
            titre: 'Éluard, 1926 — l’amour, l’image, le surréalisme',
            cours: `## L’auteur et le contexte
**Paul Éluard** (1895-1952), de son vrai nom **Eugène Grindel**, rencontre **Gala** en **1912** dans un sanatorium suisse. Après la guerre, il participe à **Dada** puis au **surréalisme** avec **André Breton**. En **1924**, il disparaît plusieurs mois pour un voyage autour du monde, avant de revenir à Paris.

## Le recueil
Publié en **1926**, il réunit des poèmes de plusieurs années et installe Éluard comme **la grande voix lyrique du surréalisme**.

> Le titre, **trouvé en dernier**, dit la tonalité : la **souffrance amoureuse** — **Gala**, sa femme, partage alors sa vie entre lui et le peintre **Max Ernst** ; elle le quittera pour **Dalí** en 1929.

## Les poèmes
| Poème | Son premier vers ou son motif |
| « La courbe de tes yeux… » | « **fait le tour de mon cœur** » |
| « L’amoureuse » | « **Elle est debout sur mes paupières** » |
| « Ta chevelure d’oranges » | L’image comme éblouissement |
| « Max Ernst » | Le dialogue avec les peintres |

Le recueil comprend aussi des sections **plus expérimentales**, nées de l’**écriture automatique** et du dialogue avec **Ernst**, **Chirico**, **Picasso**.

## À retenir
> Éluard est le poète de l’**image simple et inouïe** : **peu de mots**, souvent **monosyllabiques** — et un **rapprochement qui déplace tout**.

| Trait de forme | Son effet |
| **Vers libres**, refus de la ponctuation | La phrase glisse |
| Syntaxe **limpide** | Rien ne fait obstacle à l’image |

> Chez lui, **le surréalisme sert l’amour** et non l’inverse : **la femme aimée est le lieu où le monde devient visible**.

## La composition
Le recueil réunit **quatre sections** : « **Répétitions** » (1922), « **Mourir de ne pas mourir** » (1924), « **Les Petits Justes** » et « **Nouveaux poèmes** ».

## Les thèmes
| Thème | Ce qu’en fait Éluard |
| L’**amour** | Le regard de la femme aimée donne forme au monde |
| La **douleur** | L’absence, la séparation, l’attente |
| Le **regard** | Les yeux reviennent sans cesse, comme source de lumière |
| La **peinture** | Les poètes et les peintres surréalistes inventent ensemble |

## Pour la dissertation et l’oral
Objet d’étude : **la poésie du XIXe au XXIe siècle**. Le recueil montre que le **surréalisme** n’est pas seulement un jeu d’images étranges : c’est une **poésie de l’amour**.

## La phrase à citer
> « La terre est bleue comme une orange » — un vers du recueil suivant, *L’Amour la poésie* (1929), souvent cité avec *Capitale de la douleur*.`,
          },
          questions: [
            ['À quel mouvement le recueil est-il lié ?', ['Le surréalisme', 'Le Parnasse', 'Le symbolisme', 'Le naturalisme'], 0, 'Éluard en est la grande voix lyrique.'],
            ['En quelle année paraît Capitale de la douleur ?', ['1926', '1913', '1945', '1935'], 0, 'Le titre a été trouvé en dernier.'],
            ['Quel vers célèbre ouvre l’un des poèmes du recueil ?', ['« La courbe de tes yeux fait le tour de mon cœur »', '« Sous le pont Mirabeau »', '« Je vous salue ma France »', '« Heureux qui comme Ulysse »'], 0, 'L’image simple y produit un déplacement immense.'],
            ['Quel vers d’Éluard, paru en 1929 dans L’Amour la poésie — le recueil qui suit Capitale de la douleur —, est devenu l’emblème de l’image surréaliste ?', ['« La terre est bleue comme une orange »', '« Mon beau navire ô ma mémoire »', '« Je est un autre »', '« Le ciel est par-dessus le toit »'], 0, 'Rapprochement de deux réalités éloignées, sans justification logique. Attention : ce vers n’est pas dans Capitale de la douleur, mais dans L’Amour la poésie (1929).', 'Quelle image est devenue le manifeste de l’image surréaliste ?'],
            ['Quelle est la particularité formelle des poèmes ?', ['Vers libres, sans ponctuation, syntaxe limpide', 'Sonnets réguliers', 'Alexandrins rimés', 'Poèmes en prose exclusivement'], 0, 'Peu de mots, souvent brefs, pour une image inattendue.'],
            ['Le surréalisme d’Éluard exclut le lyrisme amoureux.', ['Vrai', 'Faux'], 1, 'Au contraire : il met les images surréalistes au service de l’amour.'],
          ],
        },
        {
          titre: 'Carmen, Prosper Mérimée',
          lecon: {
            titre: 'Mérimée, 1845 — la liberté jusqu’à la mort',
            cours: `## L’auteur et le contexte
**Prosper Mérimée** (1803-1870), **inspecteur général des Monuments historiques**, voyage beaucoup en Espagne. *Carmen* paraît dans la *Revue des Deux Mondes* en **1845** ; le dernier chapitre, une petite étude sur les **Roms**, est ajouté en **1847**.

## L’histoire
Un **archéologue français** voyageant en Andalousie rencontre le bandit **don José**, puis, à Cordoue, une bohémienne : **Carmen**.

> Plus tard, il retrouve José **en prison, la veille de son exécution**, et recueille son récit. Le roman est donc **à récits enchâssés**.

| Étape de la chute de José | Ce qu’il perd |
| Brigadier **honnête**, il laisse **s’échapper Carmen** après une rixe à la manufacture de tabac | Son grade |
| Il **déserte** et **tue un officier** | Sa place dans la société |
| Il rejoint les **contrebandiers** et **tue le mari** de Carmen | Toute issue |
| Elle **se lasse** et le lui dit | Il la **poignarde** et **se livre** |

> Elle est **libre**, elle ne l’aime plus, **elle ne mentira pas**. C’est la phrase qui la tue.

## À retenir
Une **nouvelle brève**, dont l’**opéra de Bizet** (1875) a **éclipsé le texte**.

| Ce que Carmen n’est pas | Ce qu’elle est |
| Une séductrice sans consistance | Le personnage qui **refuse absolument d’appartenir** |
| — | Et qui **préfère mourir plutôt que de mentir** |

Mérimée y mêle **exotisme espagnol**, **dissertation savante** sur les Roms et **sécheresse du récit**.

## Les personnages
| Personnage | Son rôle |
| **Don José Lizarrabengoa** | Un **Basque** de Navarre, soldat honnête qui se perd par amour |
| **Carmen** | La bohémienne qui lit l’avenir et ne veut appartenir à personne |
| Le **narrateur** | Un savant qui cherche le champ de bataille de **Munda** |
| **García le Borgne** | Le mari de Carmen, chef de contrebandiers |
| Le **Dancaïre**, le **Remendado** | Les contrebandiers de la bande |
| **Lucas** | Le **picador**, dernier caprice de Carmen |

## Les thèmes
La **liberté** absolue, la **passion** qui détruit, la **fatalité** (Carmen a lu sa mort et celle de José), l’**Espagne** vue par un voyageur français.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Le dispositif des récits enchâssés crée une **distance** : le lecteur n’entend Carmen qu’à travers deux voix d’hommes.

## La phrase à citer
> « Carmen sera toujours libre. »`,
          },
          questions: [
            ['Qui raconte l’essentiel de l’histoire de Carmen ?', ['Don José, la veille de son exécution', 'Carmen elle-même', 'Un narrateur omniscient', 'Le mari de Carmen'], 0, 'Le récit est enchâssé dans celui d’un voyageur archéologue.'],
            ['Que devient don José après avoir laissé s’échapper Carmen ?', ['Il déserte et devient contrebandier', 'Il est promu officier', 'Il rentre en Navarre', 'Il entre dans les ordres'], 0, 'La chute est progressive : désertion, meurtres, banditisme.'],
            ['Pourquoi Carmen refuse-t-elle de revenir à don José ?', ['Parce qu’elle ne l’aime plus et refuse de mentir', 'Parce qu’elle a peur de lui', 'Parce qu’elle aime son mari', 'Parce qu’elle veut quitter l’Espagne'], 0, '« Carmen sera toujours libre » : elle préfère mourir que feindre.'],
            ['Comment la nouvelle se termine-t-elle ?', ['Don José poignarde Carmen puis se livre', 'Carmen s’enfuit en Afrique', 'Don José est gracié', 'Ils s’enfuient ensemble'], 0, 'Il raconte ensuite son histoire au narrateur, en prison.'],
            ['Quelle œuvre a rendu le récit universellement célèbre ?', ['L’opéra de Bizet, en 1875', 'Un roman de Zola', 'Une pièce de Hugo', 'Un film muet'], 0, 'L’opéra a largement éclipsé le texte de Mérimée.'],
            ['Carmen est présentée comme une simple séductrice sans volonté propre.', ['Vrai', 'Faux'], 1, 'Elle est le personnage qui refuse absolument d’appartenir à quiconque.'],
          ],
        },
        {
          titre: 'Cinna, Corneille',
          lecon: {
            titre: 'Corneille, 1641 — la clémence comme victoire sur soi',
            cours: `## L’auteur et le contexte
**Pierre Corneille** (1606-1684) donne *Cinna* en **1641**, après *Le Cid* et *Horace*. Il tire l’anecdote du philosophe latin **Sénèque** (*De la clémence*). Sous Richelieu, au sortir des complots contre le pouvoir, la question est d’actualité : comment un souverain doit-il répondre à la trahison ?

## L’histoire
| Personnage | Ce qu’il veut |
| **Émilie** | **Venger son père**, tué par **Auguste** lors des proscriptions |
| **Cinna**, qui l’aime | Elle exige qu’il **assassine l’empereur** pour mériter sa main |
| **Maxime** | Entraîné dans le complot — **amoureux d’Émilie** |
| **Auguste** | **Las du pouvoir**, il envisage d’**abdiquer** |

| Le nœud | Ce qui se passe |
| Auguste convoque ses **deux conseillers** — Cinna et Maxime — pour leur demander s’il doit abdiquer | **Cinna, pour garder le tyran à tuer, plaide le maintien de l’Empire** |
| **Maxime trahit** le complot | Auguste **découvre tout** |
| Après une **longue délibération intérieure** | Il choisit de **pardonner** |

> « **Je suis maître de moi comme de l’univers.** »

## À retenir
> La **clémence** n’y est **pas une faiblesse** mais **l’acte le plus fort** : celui par lequel Auguste **devient réellement empereur**.

| Marque de Corneille | Où elle apparaît |
| Les grands **monologues délibératifs** | Auguste, Cinna, Émilie |
| L’**héroïsme de la volonté** | **On choisit ce qu’on est** |

Pièce longtemps considérée comme son **chef-d’œuvre**.

## Les autres personnages
| Personnage | Son rôle |
| **Livie** | L’impératrice, qui conseille à Auguste la **clémence** |
| **Euphorbe** | L’affranchi de Maxime, qui dénonce le complot |
| **Fulvie** | La confidente d’Émilie |

Émilie est aussi la **fille adoptive** d’Auguste : elle conspire contre celui qui l’a élevée.

## La grande scène
À l’acte V, Auguste fait asseoir Cinna — « **Prends un siège, Cinna** » — et lui rappelle tout ce qu’il lui doit, avant de lui révéler qu’il sait tout.

## Les thèmes
La **clémence**, la **maîtrise de soi**, le **pouvoir** et sa légitimité, l’**amour** mis au service de la vengeance.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. La pièce illustre le **héros cornélien** : il ne subit pas sa passion, il la surmonte par un choix. Compare avec les héros de Racine, qui en sont victimes.

## La phrase à citer
> « Soyons amis, Cinna, c’est moi qui t’en convie. »`,
          },
          questions: [
            ['Pourquoi Émilie veut-elle la mort d’Auguste ?', ['Il a fait tuer son père lors des proscriptions', 'Il l’a répudiée', 'Il a exilé Cinna', 'Il a trahi Rome'], 0, 'Elle exige la vengeance comme prix de sa main.'],
            ['Qui trahit le complot ?', ['Maxime', 'Émilie', 'Livie', 'Euphorbe seul'], 0, 'Amoureux d’Émilie, il révèle tout à Auguste.'],
            ['Que demande Auguste à Cinna et Maxime avant de découvrir le complot ?', ['S’il doit abdiquer', 'De partir en campagne', 'De juger Émilie', 'De rédiger ses mémoires'], 0, 'Cinna plaide le maintien de l’Empire… pour garder un tyran à tuer.'],
            ['Que décide Auguste à la fin ?', ['Il pardonne à tous les conjurés', 'Il les fait exécuter', 'Il abdique', 'Il exile Cinna'], 0, '« Soyons amis, Cinna, c’est moi qui t’en convie. »'],
            ['Quelle formule résume la victoire d’Auguste ?', ['« Je suis maître de moi comme de l’univers »', '« Rome n’est plus dans Rome »', '« Va, cours, vole et nous venge »', '« À vaincre sans péril… »'], 0, 'La clémence est la maîtrise de soi, donc la vraie souveraineté.'],
            ['La clémence d’Auguste est présentée comme une faiblesse politique.', ['Vrai', 'Faux'], 1, 'C’est l’acte le plus fort de la pièce : il fonde son autorité.'],
          ],
        },
        {
          titre: 'Cinq Semaines en ballon, Jules Verne',
          lecon: {
            titre: 'Verne, 1863 — le premier des Voyages extraordinaires',
            cours: `## L’auteur et le contexte
**Jules Verne** (1828-1905), né à **Nantes**, publie *Cinq Semaines en ballon* en **1863** chez l’éditeur **Pierre-Jules Hetzel**, qui restera son éditeur toute sa vie. L’Afrique intérieure est alors l’objet d’une course entre explorateurs européens : **Burton**, **Speke** et d’autres cherchent les sources du Nil.

## L’histoire
Le docteur **Samuel Fergusson**, savant anglais, entreprend de traverser l’**Afrique d’est en ouest en ballon**.

| Personnage | Son rôle |
| **Samuel Fergusson** | Le savant, l’inventeur du procédé |
| **Dick Kennedy** | L’ami **chasseur**, sceptique |
| **Joe** | Le domestique, débrouillard et comique |

Le *Victoria* décolle de **Zanzibar** : **cinq semaines** au-dessus des lacs, des déserts, des tribus, des fauves — pannes, tempêtes, soif, sauvetages, et **découverte des sources du Nil**. L’équipage atteint le **Sénégal**, épuisé mais victorieux.

## À retenir
**Premier roman** du cycle des **Voyages extraordinaires**. Il inaugure la formule d’**Hetzel** : **instruire en amusant**.

| Ingrédient | Sa place |
| La **géographie** | Le sujet même du voyage |
| La **physique** | Le ballon est **dirigé par variation de température du gaz** : l’invention centrale du livre |
| Le **suspense** et l’**humour** | Le moteur du récit |

> Le regard porté sur l’Afrique est celui de son époque, **colonial et daté** — c’est un point à **savoir signaler**.

> Le roman rendit Verne célèbre à trente-cinq ans.

## Le voyage
Le roman s’ouvre à Londres, le **14 janvier 1862**, devant la **Société royale de géographie**, où Fergusson annonce son projet. Le ballon s’appelle le **Victoria**. Pour monter ou descendre sans perdre de gaz, il chauffe l’hydrogène grâce à un **chalumeau** : c’est l’invention du livre.

| Épisode | Ce qu’il apporte |
| Le sauvetage d’un **missionnaire français**, qui meurt peu après | L’émotion |
| Le désert et la **soif** | Le danger |
| Les **chutes de Gouina**, sur le Sénégal | Le Victoria, percé, traverse le fleuve comme une **montgolfière**, gonflé d’air chaud |

## Les thèmes
La **science** au service de l’aventure, l’**exploration**, l’**amitié** entre trois hommes différents, le goût du **défi**.

## Pour la dissertation et l’oral
Utile pour le **roman d’aventures** et pour réfléchir au regard porté sur l’**autre**, à l’époque de l’expansion coloniale.

## La phrase à citer
> « Il y avait une grande affluence d’auditeurs, le 14 janvier 1862, à la séance de la Société royale géographique de Londres… » — la première phrase`,
          },
          questions: [
            ['Quel continent le ballon traverse-t-il ?', ['L’Afrique, d’est en ouest', 'L’Amérique du Sud', 'L’Asie centrale', 'L’Australie'], 0, 'Le Victoria décolle de Zanzibar et atteint le Sénégal.'],
            ['Quelle invention permet de diriger le ballon ?', ['La variation de température du gaz, qui fait monter ou descendre', 'Une hélice à vapeur', 'Un gouvernail latéral', 'Des ballasts d’eau seulement'], 0, 'C’est le ressort scientifique du livre.'],
            ['Qui accompagne le docteur Fergusson ?', ['Le chasseur Dick Kennedy et le domestique Joe', 'Deux savants allemands', 'Un capitaine et un mousse', 'Sa fille et son gendre'], 0, 'Le trio suit la formule des romans d’aventures de Verne.'],
            ['À quel cycle appartient le roman ?', ['Les Voyages extraordinaires', 'Les Rougon-Macquart', 'La Comédie humaine', 'Les Contes du lundi'], 0, 'C’est le premier volume du cycle publié par Hetzel.'],
            ['Quelle est la formule éditoriale d’Hetzel ?', ['Instruire en amusant', 'Épouvanter le lecteur', 'Publier des romans-feuilletons policiers', 'Défendre la science pure'], 0, 'Elle explique les passages didactiques du roman.'],
            ['Le regard porté sur l’Afrique est celui d’un observateur neutre et moderne.', ['Vrai', 'Faux'], 1, 'Il est marqué par les préjugés coloniaux de son temps : c’est à signaler dans un devoir.'],
          ],
        },
        {
          titre: 'Clélie, histoire romaine, Madeleine de Scudéry',
          lecon: {
            titre: 'Scudéry, 1654-1660 — la carte de Tendre',
            cours: `## L’auteur et le contexte
**Madeleine de Scudéry** (1607-1701) publie *Clélie* après *Artamène ou le Grand Cyrus*, au temps de sa plus grande gloire : ses « **samedis** » réunissent la société précieuse de Paris. Le sujet vient de la légende romaine rapportée par **Tite-Live** : **Clélie**, otage du roi étrusque **Porsenna**, s’enfuit en traversant le Tibre.

## L’œuvre
Roman-fleuve en **dix volumes**, publié entre **1654 et 1660**, dans la Rome des débuts de la République.

| L’intrigue | Ce qu’elle sert |
| **Clélie**, promise à **Aronce**, est enlevée, séparée, poursuivie | Guerres, tremblements de terre et **reconnaissances** remplissent des milliers de pages |
| La trame héroïque | Elle **encadre l’essentiel** : les **conversations** et les analyses du **sentiment amoureux** |

## La carte de Tendre
Une **gravure allégorique** où l’on voyage depuis **Nouvelle-Amitié**.

| Destination | Le chemin qui y mène |
| **Tendre-sur-Estime** | Par les villages de Grand-Esprit, Jolis-Vers, Billet-Doux, Sincérité |
| **Tendre-sur-Reconnaissance** | Par Complaisance, Petits-Soins, Assiduité : les égards et les services |
| **Tendre-sur-Inclination** | Le fleuve, le plus direct |
| À **éviter** | Le **lac d’Indifférence**, la **mer d’Inimitié** |

> Une **cartographie du sentiment**, née d’un **jeu de salon**.

## À retenir
Document majeur sur la **préciosité** et sur le **pouvoir des femmes** dans les salons du XVIIe siècle.

> Madeleine de Scudéry y théorise une relation amoureuse fondée sur l’**estime**, la **conversation** et le **mérite** — et **non sur le mariage arrangé**.

> La carte de Tendre est le premier « plan » d’un sentiment dans la littérature française.

## Les thèmes
| Thème | Ce qu’en fait le roman |
| L’**amour** | Il se mérite lentement, par l’estime et les égards |
| L’**amitié** tendre | Elle vaut autant que l’amour, et peut le précéder |
| La **conversation** | Elle est l’art suprême de la vie sociale |

## La postérité
La carte de Tendre devient vite un objet de mode… et de moquerie. En **1659**, dans *Les Précieuses ridicules*, **Molière** fait parler Magdelon de « **Billets-Doux** », « **Petits-Soins** » et « **Jolis-Vers** » : les villages de la carte deviennent une caricature.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Clélie montre comment le roman du XVIIe siècle sert à **penser les sentiments**.

## À citer
> Pour parler de l’œuvre, on cite la carte : de Nouvelle-Amitié à **Tendre-sur-Estime**, en passant par **Jolis-Vers** et **Billet-Doux**.`,
          },
          questions: [
            ['Que contient le roman Clélie, devenu célèbre à lui seul ?', ['La carte de Tendre', 'Le portrait de Louis XIV', 'Une préface de Corneille', 'Un dictionnaire des passions'], 0, 'Une allégorie gravée du parcours amoureux, née d’un jeu de salon.'],
            ['Quelles sont les trois villes de Tendre ?', ['Tendre-sur-Estime, Tendre-sur-Reconnaissance, Tendre-sur-Inclination', 'Tendre-sur-Amour, Tendre-sur-Passion, Tendre-sur-Désir', 'Tendre-la-Belle, Tendre-la-Fière, Tendre-la-Douce', 'Tendre-Nord, Tendre-Sud, Tendre-Centre'], 0, 'Trois chemins pour trois façons de naître à l’amour.'],
            ['Que faut-il éviter sur la carte de Tendre ?', ['Le lac d’Indifférence et la mer d’Inimitié', 'La rivière de Tendresse', 'Le village de Sincérité', 'Le bourg de Petits-Soins'], 0, 'Les écueils du parcours amoureux y sont figurés en géographie.'],
            ['Dans quel cadre historique le roman se situe-t-il ?', ['La Rome des débuts de la République', 'La Perse antique', 'La Grèce d’Alexandre', 'L’Égypte ptolémaïque'], 0, 'Comme Artamène, l’Antiquité sert de décor à un propos contemporain.'],
            ['Quelle conception de l’amour Madeleine de Scudéry défend-elle ?', ['Une relation fondée sur l’estime, la conversation et le mérite', 'Le mariage arrangé par les familles', 'La passion violente et exclusive', 'Le renoncement religieux'], 0, 'C’est le cœur de la préciosité, souvent caricaturée par Molière.'],
            ['Le roman tient en un seul volume.', ['Vrai', 'Faux'], 1, 'Il en compte dix, publiés entre 1654 et 1660.'],
          ],
        },
        {
          titre: 'Colomba, Prosper Mérimée',
          lecon: {
            titre: 'Mérimée, 1840 — la vendetta corse',
            cours: `## L’auteur et le contexte
**Prosper Mérimée** (1803-1870), **inspecteur général des Monuments historiques**, parcourt la **Corse** en **1839** pour son travail. Il en rapporte *Colomba*, publiée dans la *Revue des Deux Mondes* en **1840**. Il y avait déjà situé une nouvelle très brève, *Mateo Falcone* (1829).

## L’histoire
**Orso della Rebbia**, ancien officier de Napoléon, rentre en **Corse** après la mort de son père, tué — **dit-on** — par les **Barricini**, la famille rivale.

| Personnage | Ce qu’il veut |
| **Colomba**, sa sœur | La **vendetta** : chants funèbres improvisés (*voceri*), rumeurs, **preuves montées** |
| **Orso**, formé sur le continent | La **justice**, non la vengeance |
| **Lydia Nevil**, jeune Anglaise en voyage | Elle l’aime |

| Le dénouement | Ce qui se passe |
| Attaqué en chemin | Il tue les **deux fils Barricini** en **légitime défense** |
| La fin | Il épouse Lydia ; **Colomba, satisfaite**, croise le vieux Barricini brisé et lui adresse **une parole terrible** |

## À retenir
Une **nouvelle longue** qui mêle **roman d’aventures**, **ethnographie** et **étude de caractères**.

| Ce que Mérimée oppose | Ce qu’il en fait |
| La **loi** moderne | Orso, l’officier |
| La **coutume** archaïque | **Colomba** — une figure inoubliable, **plus déterminée que tous les hommes du récit** |

Style **sec**, dialogues nombreux, **couleur locale documentée**.

## Les autres personnages
| Personnage | Son rôle |
| L’**avocat Barricini** | Le maire, ennemi des della Rebbia, soupçonné du meurtre |
| **Orlanduccio** et **Vincentello** | Ses deux fils, tués par Orso |
| Le **colonel sir Thomas Nevil** | Le père de Lydia, officier anglais |
| **Brandolaccio** et **Castriconi**, dit le Curé | Deux bandits d’honneur qui aident Orso |

## Le dénouement
Le **coup double** d’Orso — deux coups de fusil, deux morts, le bras gauche blessé — l’oblige à se cacher dans le maquis. Innocenté, il épouse Lydia. Des mois plus tard, **près de Pise**, en Italie, Colomba retrouve le vieux Barricini, brisé, et lui parle **en corse**.

## Les thèmes
L’**honneur** familial, la **vengeance** et la **justice**, la **civilisation** contre la **coutume**, la **femme** plus forte que les hommes.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Mérimée joue sur la **couleur locale** : notes, mots corses, *voceri*.

## La phrase à citer
> « Il me les fallait tous les deux… Les rameaux sont coupés ; et si la souche n’était pas pourrie, je l’eusse arrachée. » — Colomba au vieux Barricini`,
          },
          questions: [
            ['Où se déroule le récit ?', ['En Corse', 'En Sicile', 'En Sardaigne', 'Dans les Pyrénées'], 0, 'Mérimée avait visité l’île comme inspecteur des Monuments historiques.'],
            ['Qu’est-ce que la vendetta ?', ['La vengeance familiale imposée par la coutume', 'Un chant de mariage', 'Un tribunal local', 'Une fête religieuse'], 0, 'Elle s’oppose à la justice de l’État, que représente Orso.'],
            ['Qui pousse Orso à venger son père ?', ['Sa sœur Colomba', 'Lydia Nevil', 'Le préfet', 'Le vieux Barricini'], 0, 'Elle improvise des voceri, monte des preuves et manœuvre sans relâche.'],
            ['Que veut Orso au retour en Corse ?', ['La justice plutôt que la vengeance', 'La vendetta immédiate', 'Vendre ses terres', 'Rejoindre l’armée anglaise'], 0, 'Sa formation continentale l’oppose à la coutume de l’île.'],
            ['Comment Orso tue-t-il les deux fils Barricini ?', ['En légitime défense, lors d’une embuscade', 'Par traîtrise, la nuit', 'En duel réglé', 'Il ne les tue pas'], 0, 'La coutume obtient ainsi ce qu’elle voulait, sans qu’Orso se renie tout à fait.'],
            ['Colomba est un personnage secondaire du récit.', ['Vrai', 'Faux'], 1, 'Elle donne son titre à l’œuvre et se révèle plus déterminée que tous les hommes.'],
          ],
        },
        {
          titre: 'Contes de ma mère l’Oye, Charles Perrault',
          lecon: {
            titre: 'Perrault, 1697 — les contes deviennent de la littérature',
            cours: `## L’auteur et le contexte
**Charles Perrault** (1628-1703), haut fonctionnaire au service de **Colbert**, membre de l’**Académie française** dès **1671**, n’est pas d’abord un conteur. En **1687**, son poème *Le Siècle de Louis le Grand*, lu à l’Académie, place les modernes au-dessus des Anciens : c’est le début de la **querelle**. Il a déjà publié des contes **en vers** : *Grisélidis*, *Les Souhaits ridicules* et *Peau d’Âne*.

## Le recueil
*Histoires ou contes du temps passé, avec des moralités*, publié en **1697** **sous le nom du fils de Perrault**. Le frontispice porte l’inscription « **Contes de ma mère l’Oye** ».

| Les huit contes en prose |
| **La Belle au bois dormant** |
| **Le Petit Chaperon rouge** |
| **La Barbe bleue** |
| **Le Maître Chat ou le Chat botté** |
| **Les Fées** |
| **Cendrillon** |
| **Riquet à la houppe** |
| **Le Petit Poucet** |

## Ce que fait Perrault
| Geste | Son effet |
| Il **écrit** des récits jusque-là **oraux et populaires** | Dans une langue **élégante et brève**, pour un public **de cour** |
| Il ajoute des **moralités en vers** | Souvent **ironiques**, parfois **en décalage** avec le récit |

> Celle du Petit Chaperon rouge met en garde les jeunes filles contre les « **loups** » **de salon** : la morale vise la cour, pas la forêt.

## À retenir
Perrault est aussi l’un des chefs des **Modernes** dans la querelle des Anciens et des Modernes.

> Écrire des **contes français** plutôt qu’imiter l’Antiquité est un **geste polémique**.

| Postérité | Ce qu’elle en a fait |
| La **psychanalyse**, l’**ethnologie** (Propp), le **cinéma** | Des structures exploitées sans fin |
| Une différence à connaître | Chez Perrault, **le Petit Chaperon rouge meurt** — la fin heureuse vient des **frères Grimm** |

## Les thèmes
| Thème | Où on le lit |
| La **ruse** du faible | Le Petit Poucet, le Chat botté |
| La **curiosité** punie | La Barbe bleue |
| La **beauté** et l’**esprit** | Riquet à la houppe |
| La **bonté** récompensée | Les Fées, Cendrillon |

## Pour la dissertation et l’oral
Utile pour la **littérature d’idées** : le conte **instruit en plaisant**, et la moralité parfois ironique invite le lecteur à juger par lui-même. À l’oral, compare la version de Perrault avec celles des **frères Grimm** (1812).

## La phrase à citer
> « Mais hélas ! qui ne sait que ces loups doucereux, / De tous les loups sont les plus dangereux ? »`,
          },
          questions: [
            ['En quelle année les Contes paraissent-ils ?', ['1697', '1667', '1720', '1812'], 0, 'Sous le nom du fils de Perrault, Pierre Darmancour.'],
            ['Combien de contes le recueil compte-t-il ?', ['Huit', 'Trois', 'Douze', 'Vingt'], 0, 'De La Belle au bois dormant au Petit Poucet.'],
            ['Par quoi chaque conte se termine-t-il ?', ['Une ou deux moralités en vers', 'Un dialogue', 'Une gravure', 'Une prière'], 0, 'Souvent ironiques, parfois en décalage avec le récit.'],
            ['Comment se termine Le Petit Chaperon rouge chez Perrault ?', ['La fillette est mangée : il n’y a pas de sauvetage', 'Le chasseur la sauve', 'Elle s’échappe seule', 'Le loup est puni par les villageois'], 0, 'La fin heureuse est une invention des frères Grimm.'],
            ['À quelle querelle littéraire Perrault participe-t-il ?', ['La querelle des Anciens et des Modernes, du côté des Modernes', 'La querelle du Cid', 'La querelle des bouffons', 'La querelle du théâtre'], 0, 'Écrire des contes français est un geste polémique contre l’imitation de l’Antiquité.'],
            ['Perrault a inventé de toutes pièces ces récits.', ['Vrai', 'Faux'], 1, 'Il met par écrit des récits oraux et populaires, dans une langue de cour.'],
          ],
        },
        {
          titre: 'Correspondance, André Gide et Paul Valéry',
          lecon: {
            titre: 'Gide et Valéry, 1890-1942 — cinquante ans de lettres',
            cours: `## Les auteurs et le contexte
**André Gide** (1869-1951), prix Nobel en **1947**, et **Paul Valéry** (1871-1945), élu à l’Académie française en **1925**, se rencontrent grâce à un ami commun, le poète **Pierre Louÿs**. Leur correspondance paraît en **1955**, dix ans après la mort de Valéry.

## L’œuvre
| Fait | Le détail |
| La rencontre | **1890**, à **Montpellier** : ils ont une **vingtaine d’années** |
| La durée | Jusqu’à la mort de Valéry — **plus d’un demi-siècle** |
| La publication | **Après leur mort** |

> Un document **unique** sur la **naissance de deux œuvres** et sur une **amitié faite d’admiration, d’exigence et de désaccords**.

## Ce qu’on y lit
| Épisode | Ce qu’il éclaire |
| Les débuts **symbolistes** | L’influence de **Mallarmé** et de ses « **mardis** » |
| Le **silence de vingt ans** de Valéry | Il abandonne la poésie pour les **mathématiques** et les *Cahiers* |
| La fondation de la **NRF** par Gide | Le pouvoir éditorial |
| Les **doutes** sur la valeur de la littérature | Le cœur de leur dialogue |
| La **vie quotidienne** | Maladies, voyages, lectures partagées, jugements sur les contemporains |

## À retenir
> La correspondance d’écrivains est un **genre à part entière** : elle donne accès à l’**atelier**, à la **formation d’une pensée**, aux **hésitations que l’œuvre publiée efface**.

| **Gide** | **Valéry** |
| Le **sincère**, l’inquiet, l’**autobiographe** | L’**intellectuel**, le sceptique, l’**analyste** |

Deux tempéraments **opposés** qui **se lisent et se corrigent**.

> Le meilleur portrait de deux écrivains est souvent celui qu’ils font l’un de l’autre.

## Les œuvres qu’on y voit naître
| Gide | Valéry |
| *Les Nourritures terrestres* (1897) | *Monsieur Teste* (1896) |
| *L’Immoraliste* (1902) | *La Jeune Parque* (1917), **dédiée à Gide** |
| *Les Faux-Monnayeurs* (1925) | *Charmes* (1922) |

Le retour de Valéry à la poésie, avec *La Jeune Parque*, se fait en partie à l’appel de Gide, qui le presse de rassembler ses anciens vers.

## Les thèmes
L’**amitié** d’écrivains, la **création** et ses doutes, la **sincérité** contre la **lucidité**, le métier d’écrire.

## Pour la dissertation et l’oral
Utile pour la **littérature d’idées** et pour les écritures de soi : la lettre est un **genre** où l’on se construit face à un autre.

## À citer
> Pour parler de l’œuvre, retiens la dédicace : *La Jeune Parque* est dédiée « à André Gide », l’ami qui a poussé Valéry à revenir à la poésie.`,
          },
          questions: [
            ['En quelle année Gide et Valéry se rencontrent-ils ?', ['En 1890, à Montpellier', 'En 1910, à Paris', 'En 1900, à Alger', 'En 1925, à Genève'], 0, 'Ils ont alors une vingtaine d’années.'],
            ['Combien de temps dure leur correspondance ?', ['Plus d’un demi-siècle', 'Cinq ans', 'Vingt ans', 'Toute leur enfance'], 0, 'Jusqu’à la mort de Valéry en 1945.'],
            ['Quel poète domine leurs débuts communs ?', ['Mallarmé', 'Hugo', 'Baudelaire', 'Verlaine'], 0, 'Ils fréquentent ses « mardis » de la rue de Rome.'],
            ['Que fait Valéry pendant sa longue période de silence poétique ?', ['Il se consacre aux mathématiques et à ses Cahiers', 'Il voyage en Afrique', 'Il écrit des romans', 'Il enseigne à la Sorbonne'], 0, 'Vingt ans de retrait avant La Jeune Parque.'],
            ['Quelle revue Gide contribue-t-il à fonder ?', ['La NRF', 'Le Mercure de France', 'Les Temps modernes', 'La Revue des Deux Mondes'], 0, 'Elle deviendra centrale dans la vie littéraire française.'],
            ['Une correspondance d’écrivains n’a aucun intérêt littéraire propre.', ['Vrai', 'Faux'], 1, 'C’est un genre à part entière : elle donne accès à l’atelier et aux hésitations.'],
          ],
        },
        {
          titre: 'Cyrano de Bergerac, Edmond Rostand',
          lecon: {
            titre: 'Rostand, 1897 — le panache contre le nez',
            cours: `## L’auteur et le contexte
**Edmond Rostand** (1868-1918) a vingt-neuf ans quand *Cyrano de Bergerac* est créée le **28 décembre 1897** au **théâtre de la Porte-Saint-Martin**, avec le grand acteur **Constant Coquelin** dans le rôle-titre. Le soir de la première, le public applaudit de longues minutes : c’est un triomphe.

## L’histoire
**Cyrano**, cadet de Gascogne — bretteur, poète, redoutable en tout — aime sa cousine **Roxane**. Mais son **nez** immense lui interdit d’espérer.

| Étape | Ce qui se passe |
| Le pacte | Roxane aime **Christian**, **beau et sans esprit** ; Cyrano lui **prête ses mots** |
| Les billets | Puis la fameuse **scène du balcon** : Cyrano parle **dans l’ombre**, Christian **recueille le baiser** |
| Au siège d’**Arras** | Il écrit **chaque jour** à Roxane **au nom de Christian**, qui **meurt au combat** |
| **Quinze ans plus tard**, au couvent | Roxane comprend en l’entendant lire la **dernière lettre par cœur**, **à la nuit tombée** |

Il meurt, revendiquant son « **panache** ».

## À retenir
**Comédie héroïque en cinq actes et en vers**, créée en **1897** : immense succès **jamais démenti**.

| Ce que Rostand fait | Où |
| Il **ressuscite le drame romantique** | À la fin du siècle du **naturalisme** |
| Il donne des **tirades virtuoses** | La **tirade des nez**, la **ballade du duel** |
| Il mêle **rire et larmes** | Chaque acte |

> Le personnage a **existé** : **Savinien de Cyrano de Bergerac**, écrivain **libertin** du XVIIe siècle.

## Les autres personnages
| Personnage | Son rôle |
| **Le Bret** | L’ami fidèle et raisonnable |
| **Ragueneau** | Le pâtissier-poète, qui nourrit les poètes |
| Le **comte de Guiche** | Le puissant rival, qui envoie les cadets au siège |
| **Carbon de Castel-Jaloux** | Le capitaine des cadets de Gascogne |
| **Montfleury** | L’acteur que Cyrano chasse de scène à l’acte I |

La **tirade des nez** répond à un vicomte qui a dit : « Vous avez un nez… très grand. » Cyrano en invente vingt versions : « C’est un roc !… c’est un pic !… c’est un cap ! »

À l’acte V, Cyrano arrive blessé : un laquais lui a jeté **une bûche** d’une fenêtre, une mort sans gloire pour un héros.

## Les thèmes
L’**amour** caché, le **panache**, la **liberté** du poète face aux puissants, le **masque**.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. La pièce montre le **mélange des registres** : comique, lyrique, héroïque, pathétique.

## La phrase à citer
> « Mon panache. »`,
          },
          questions: [
            ['Qu’est-ce qui empêche Cyrano de déclarer son amour ?', ['Son nez, qu’il croit rédhibitoire', 'Sa pauvreté', 'Un serment militaire', 'La différence de rang'], 0, 'Il se croit condamné à n’être jamais aimé.'],
            ['Que fait Cyrano pour Christian ?', ['Il lui prête ses mots, ses lettres et sa voix', 'Il le fait nommer capitaine', 'Il l’aide à s’enfuir avec Roxane', 'Il le provoque en duel'], 0, 'La scène du balcon en est le sommet.'],
            ['Où Christian meurt-il ?', ['Au siège d’Arras', 'À Paris, en duel', 'À l’hôtel de Bourgogne', 'En Gascogne'], 0, 'Cyrano lui écrivait chaque jour au nom de leur amour.'],
            ['Quand Roxane comprend-elle la vérité ?', ['Quinze ans plus tard, en entendant Cyrano lire la lettre de nuit', 'Dès la scène du balcon', 'À la mort de Christian', 'Jamais'], 0, 'Il la lit par cœur alors qu’il fait trop sombre pour lire.'],
            ['Quel est le dernier mot de la pièce ?', ['« Mon panache »', '« Roxane »', '« Adieu »', '« Le nez »'], 0, 'Le panache : la manière, quand tout le reste est perdu.'],
            ['Cyrano de Bergerac est un personnage entièrement inventé par Rostand.', ['Vrai', 'Faux'], 1, 'Savinien de Cyrano de Bergerac fut un écrivain libertin bien réel du XVIIe siècle.'],
          ],
        },
        {
          titre: 'De l’esprit des lois, Montesquieu',
          lecon: {
            titre: 'Montesquieu, 1748 — vingt ans pour penser les institutions',
            cours: `## L’auteur et le contexte
**Charles-Louis de Secondat, baron de La Brède et de Montesquieu** (1689-1755), **président à mortier au parlement de Bordeaux**, s’est fait connaître en **1721** avec un roman épistolaire satirique, les *Lettres persanes*. Il voyage en Europe, et vit plus d’un an en **Angleterre**.

## L’œuvre
Publié **anonymement** à Genève en **1748**, après une **vingtaine d’années** de travail : **trente et un livres**.

> Son projet : comprendre les lois **non comme des décrets arbitraires**, mais comme des **rapports** — « les lois… sont les **rapports nécessaires** qui dérivent de la **nature des choses** ».

## Les trois gouvernements et leur ressort
| Gouvernement | Son ressort |
| La **république** | La **vertu** |
| La **monarchie** | L’**honneur** |
| Le **despotisme** | La **crainte** |

## La séparation des pouvoirs
Inspirée de l’observation de l’**Angleterre**.

| Pouvoir | Sa fonction |
| **Législatif** | Faire la loi |
| **Exécutif** | L’appliquer |
| **Judiciaire** | Punir les crimes et juger les différends |

> « Il faut que, par la disposition des choses, **le pouvoir arrête le pouvoir**. »

Cette idée passera dans la **Constitution américaine** et dans la **Déclaration de 1789**.

## Deux points à connaître
| Thèse | Son statut aujourd’hui |
| La **théorie des climats** | Climat, terrain et mœurs influencent les lois — **contestée**, mais elle fonde une approche **comparatiste** et sociologique du droit |
| La dénonciation de l’**esclavage** | Un chapitre d’**ironie** célèbre — « De l’esclavage des nègres » — où il **feint d’argumenter en sa faveur** pour en montrer l’**absurdité** |

## La réception
L’ouvrage connaît un grand succès et de violentes attaques : Montesquieu répond en **1750** par une *Défense de l’Esprit des lois*, et le livre est mis à l’**Index** par l’Église en **1751**. L’article **16** de la Déclaration de 1789 lui doit beaucoup : une société sans garantie des droits ni **séparation des pouvoirs** « n’a point de Constitution ».

## Les thèmes
| Thème | Ce qu’en dit Montesquieu |
| La **liberté** politique | Elle naît de l’**équilibre** des pouvoirs, pas de la vertu d’un seul |
| Le **relativisme** | Il n’y a pas de loi bonne partout : il faut la rapporter à un peuple |

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Montesquieu illustre l’esprit des **Lumières** : observer, comparer, expliquer plutôt que condamner.

## La phrase à citer
> « Pour qu’on ne puisse abuser du pouvoir, il faut que, par la disposition des choses, le pouvoir arrête le pouvoir. »`,
          },
          questions: [
            ['Quels sont les trois types de gouvernement selon Montesquieu ?', ['République, monarchie, despotisme', 'Démocratie, oligarchie, tyrannie', 'Empire, royaume, cité', 'Théocratie, république, empire'], 0, 'Chacun a son ressort : la vertu, l’honneur, la crainte.'],
            ['Quel principe fait la célébrité de l’ouvrage ?', ['La séparation des pouvoirs', 'La souveraineté du peuple', 'Le contrat social', 'Le droit naturel'], 0, 'Il passera dans la Constitution américaine et dans la Déclaration de 1789.'],
            ['Quel pays inspire la réflexion sur la séparation des pouvoirs ?', ['L’Angleterre', 'La Hollande', 'Venise', 'La Suisse'], 0, 'Montesquieu y avait séjourné et observé les institutions.'],
            ['Qu’est-ce que la théorie des climats ?', ['L’idée que climat et milieu influencent les lois et les mœurs', 'Une théorie sur les saisons agricoles', 'Un traité de météorologie', 'Une classification des peuples par la religion'], 0, 'Contestée aujourd’hui, elle fonde une approche comparatiste du droit.'],
            ['Comment Montesquieu dénonce-t-il l’esclavage ?', ['Par un chapitre ironique feignant de le défendre', 'Par un plaidoyer direct devant le Parlement', 'Par une pétition', 'Il ne l’aborde pas'], 0, '« De l’esclavage des nègres » est un modèle d’antiphrase.'],
            ['L’ouvrage a été publié sous le nom de son auteur.', ['Vrai', 'Faux'], 1, 'Publication anonyme à Genève, en 1748, pour éviter la censure.'],
          ],
        },
        {
          titre: 'De la dignité de l’homme, Jean Pic de la Mirandole',
          lecon: {
            titre: 'Pic de la Mirandole, 1486 — le manifeste de l’humanisme',
            cours: `## L’auteur et le contexte
**Jean Pic de la Mirandole** (1463-1494), prince italien d’une érudition prodigieuse, vit à **Florence** dans le cercle de **Marsile Ficin** et de **Laurent de Médicis**. Il lit le latin, le grec, l’hébreu, l’arabe. Il meurt à **trente et un ans**.

## Le texte
| Fait | Le détail |
| Écrit en | **1486**, par un érudit italien de **vingt-trois ans** |
| Sa destination | Ouvrir une **dispute publique** à Rome sur **neuf cents thèses** |
| Ce qui arrive | **Le pape en interdit la tenue** |
| Sa postérité | Publié **après la mort** de son auteur — le texte emblématique de l’**humanisme de la Renaissance** |

## La thèse
Dieu, ayant créé le monde, **n’avait plus de place ni de nature disponible** pour l’homme. Il lui donne alors ce qu’**aucune créature n’a**.

| Ce que l’homme n’a pas | Ce qu’il est |
| **Aucune place fixe** | **Ce qu’il se fait** |
| **Aucune forme propre** | Il peut **dégénérer vers l’animal** ou **s’élever vers l’ange** |

> **Le choix lui appartient.**

## À retenir
> C’est la **première formulation nette de la liberté comme définition de l’humain** — et l’acte de naissance d’une pédagogie : **si l’homme se fait, alors l’éducation est tout**.

Pic défend aussi la **concorde des savoirs** : il veut concilier **Platon**, **Aristote**, la **Kabbale**, les **Arabes** et les **Pères de l’Église**.

## La scène fondatrice
Le texte fait parler Dieu à **Adam** : il ne lui a donné ni place fixe, ni visage propre, ni fonction particulière, pour qu’il choisisse lui-même ce qu’il veut être. L’homme devient le **sculpteur de lui-même**.

## Le destin du texte
Le pape **Innocent VIII** condamne plusieurs des neuf cents thèses en **1487** ; Pic s’enfuit en France, où il est arrêté, puis libéré. Le discours paraît en **1496**, publié par son **neveu**. Le titre sous lequel on le connaît lui a été donné **après coup**.

## Les thèmes
La **liberté**, la **dignité** humaine, le **savoir** universel, la **paix** entre les philosophies.

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées du XVIe au XVIIIe siècle**. Un texte clé pour définir l’**humanisme** : confiance dans l’homme, retour aux textes anciens, **éducation**. Rapproche-le de Rabelais et de Montaigne.

## La phrase à citer
> « Tu pourras dégénérer en formes inférieures… tu pourras, par décision de ton esprit, te régénérer en formes supérieures, qui sont divines. »`,
          },
          questions: [
            ['Quel âge a Pic de la Mirandole quand il écrit ce discours ?', ['Vingt-trois ans', 'Quarante ans', 'Cinquante ans', 'Trente-cinq ans'], 0, 'Il devait ouvrir une dispute publique à Rome sur neuf cents thèses.'],
            ['Que dit le texte de la nature de l’homme ?', ['Il n’a pas de nature fixe : il est ce qu’il se fait', 'Il est par nature bon', 'Il est déterminé par son rang de naissance', 'Il est identique à l’animal'], 0, 'C’est la première formulation nette de la liberté comme définition de l’humain.'],
            ['Pourquoi la dispute prévue n’a-t-elle pas eu lieu ?', ['Le pape l’a interdite', 'L’auteur est mort avant', 'Les universités l’ont refusée', 'Elle a été reportée sans fin'], 0, 'Le discours est publié après la mort de Pic.'],
            ['Quelle conséquence pédagogique découle de la thèse ?', ['Si l’homme se fait, l’éducation est décisive', 'L’éducation est inutile', 'Seule la grâce compte', 'Le savoir est réservé aux clercs'], 0, 'C’est le programme même de l’humanisme.'],
            ['Quel projet intellectuel Pic défend-il ?', ['Concilier Platon, Aristote, la Kabbale et les Pères de l’Église', 'Rejeter toute philosophie païenne', 'Fonder une science expérimentale', 'Traduire la Bible en italien'], 0, 'Il croit à la concorde des savoirs.'],
            ['Le texte est considéré comme un manifeste de l’humanisme.', ['Vrai', 'Faux'], 0, 'Il en est même le texte emblématique.'],
          ],
        },
        {
          titre: 'Déclaration des droits de la femme et de la citoyenne, Olympe de Gouges',
          lecon: {
            titre: 'Olympe de Gouges, 1791 — dix-sept articles pour l’égalité',
            cours: `## L’autrice et le contexte
**Olympe de Gouges** (1748-1793), de son vrai nom **Marie Gouze**, née à **Montauban**, monte à Paris et écrit pour le théâtre. Sa pièce contre l’esclavage, *Zamore et Mirza*, est jouée à la **Comédie-Française** en **1789** sous le titre *L’Esclavage des Noirs*. Elle publie des dizaines de brochures politiques pendant la Révolution.

## Le texte
Publié en **septembre 1791**, il **calque** la Déclaration des droits de l’homme et du citoyen de **1789** pour y **inscrire les femmes**.

| Partie | Son contenu |
| La **dédicace** | À la **reine** |
| Le **préambule** | Au nom des « mères, filles, sœurs, représentantes de la nation » |
| Les **dix-sept articles** | Dans l’**ordre exact** du texte de 1789 |
| Le **postambule** | **Enflammé** : « Femme, réveille-toi » |
| Le **contrat social** | Entre l’homme et la femme |

## L’article X
« La femme a le droit de monter sur l’**échafaud** ; elle doit avoir également celui de monter à la **tribune**. »

> L’argument : puisque la loi **punit** les femmes comme des citoyennes, elle doit les **représenter** comme telles.

> Olympe de Gouges sera **guillotinée en 1793**.

## À retenir
| L’arme | Ce qu’elle produit |
| Le **pastiche** | Reprendre le texte fondateur **mot pour mot** rend l’exclusion **criante**, sans avoir à la démontrer |
| Le changement de registre au postambule | Il s’adresse **aux femmes elles-mêmes** |

Autrice de théâtre et **abolitionniste** (*L’Esclavage des Noirs*), elle réclame l’égalité **politique**, **civile** et **d’expression**.

> Les Françaises voteront en **1944**.

## La dédicace et la mort
La Déclaration est dédiée à **Marie-Antoinette**, qu’elle presse de défendre les femmes. En **1793**, elle fait placarder une affiche, *Les Trois Urnes*, qui propose de laisser le peuple choisir son gouvernement par un vote : c’est ce texte qui la fait **arrêter**. Elle est guillotinée le **3 novembre 1793**.

## Les thèmes
| Thème | Ce qu’elle réclame |
| L’**égalité** | Les mêmes droits naturels pour les deux sexes |
| La **citoyenneté** | Le droit de voter et d’être élue |
| La **parole** | Le droit de s’exprimer, de publier |
| La **justice** sociale | Le sort des enfants nés hors mariage, des esclaves |

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Olympe de Gouges retourne l’universalisme de 1789 contre ses propres oublis.

## La phrase à citer
> « Femme, réveille-toi ; le tocsin de la raison se fait entendre dans tout l’univers. »`,
          },
          questions: [
            ['Quel texte la Déclaration reprend-elle mot pour mot ?', ['La Déclaration des droits de l’homme et du citoyen de 1789', 'Le Contrat social', 'La Constitution de 1791', 'Le Code civil'], 0, 'Le pastiche rend l’oubli des femmes immédiatement visible.'],
            ['Que dit l’article X ?', ['La femme qui peut monter à l’échafaud doit pouvoir monter à la tribune', 'Toutes les femmes sont électrices', 'Le divorce est un droit', 'L’instruction est obligatoire'], 0, 'Punie comme citoyenne, la femme doit être représentée comme telle.'],
            ['À qui le postambule s’adresse-t-il ?', ['Aux femmes elles-mêmes', 'Au roi', 'À l’Assemblée', 'Aux juges'], 0, '« Femme, réveille-toi » : il change complètement de registre.'],
            ['Quel autre combat Olympe de Gouges a-t-elle mené ?', ['L’abolition de l’esclavage', 'La liberté du commerce', 'La réforme fiscale', 'La laïcité scolaire'], 0, 'Sa pièce L’Esclavage des Noirs le montre.'],
            ['Quel sort connut l’autrice ?', ['Elle fut guillotinée en 1793', 'Elle mourut en exil', 'Elle fut oubliée mais épargnée', 'Elle vécut jusqu’à l’Empire'], 0, 'L’article X en devient prophétique.'],
            ['Les Françaises ont obtenu le droit de vote peu après 1791.', ['Vrai', 'Faux'], 1, 'Il faudra attendre 1944 : le texte n’a eu aucun effet légal immédiat.'],
          ],
        },
        {
          titre: 'Défense et illustration de la langue française, Joachim du Bellay',
          lecon: {
            titre: 'Du Bellay, 1549 — le manifeste de la Pléiade',
            cours: `## L’auteur et le contexte
**Joachim du Bellay** (1522-1560), gentilhomme angevin, étudie à Paris au **collège de Coqueret** avec **Ronsard**, sous l’helléniste **Jean Dorat**. En **1553**, il suit à Rome son cousin le **cardinal Jean du Bellay** ; il en rapporte ses deux grands recueils de sonnets, *Les Antiquités de Rome* et *Les Regrets* (**1558**).

## Le texte
Publié en **1549**, ce manifeste en **deux livres** accompagne le recueil *L’Olive* et parle au nom d’un groupe de jeunes poètes : la future **Pléiade** — Ronsard, Du Bellay, Baïf, Jodelle.

> Son but : prouver que le **français** peut être une **grande langue littéraire**, à l’égal du **latin** et du **grec**.

## Les quatre thèses
| Thèse | Ce qu’elle affirme |
| **Défendre** | Le français n’est **pas pauvre par nature** : il l’est **par manque de culture** |
| **Illustrer** | Par l’**imitation créatrice** — **non traduire** les Anciens et les Italiens, mais **faire en français** ce qu’ils ont fait dans leur langue |
| **Enrichir** | Par des **emprunts** au grec, au latin, aux dialectes, aux métiers ; et par des **néologismes** |
| **Abandonner** | Les formes médiévales jugées basses — rondeaux, ballades, virelais |

| Formes à adopter |
| Le **sonnet** |
| L’**ode** |
| L’**élégie** |
| La **tragédie** à l’antique |

> Et une exigence de **travail** : l’inspiration ne suffit pas, il faut **polir longuement** son œuvre et la soumettre à « **la lime** » d’un lecteur savant.

## À retenir
Texte **fondateur** de la poésie française moderne — et **acte politique**.

> Dix ans plus tôt, l’ordonnance de **Villers-Cotterêts** (1539) avait imposé le français dans les **actes officiels** : la langue devient une **affaire nationale**.

> Les Romains ont enrichi leur langue en imitant les Grecs, « se transformant en eux, les dévorant, et après les avoir bien digérés, les convertissant en sang et nourriture ».

## La réception
Le manifeste est attaqué dès **1550** par **Barthélemy Aneau**, qui reproche à Du Bellay de mépriser les poètes français d’avant lui, comme **Clément Marot**, et d’écrire lui-même en imitateur.

## Les thèmes
L’**identité** nationale par la langue, l’**imitation** créatrice, le **travail** du poète, la **gloire** littéraire.

## Pour la dissertation et l’oral
Utile pour la **poésie** (la naissance du **sonnet** français) et pour la **littérature d’idées** : c’est un texte **argumentatif** qui défend une thèse, réfute des objections et exhorte. Dans *Les Regrets*, Du Bellay appliquera son programme : « **Heureux qui, comme Ulysse**, a fait un beau voyage ».`,
          },
          questions: [
            ['Quel groupe de poètes ce manifeste représente-t-il ?', ['La Pléiade', 'Les Grands Rhétoriqueurs', 'Le Parnasse', 'Les surréalistes'], 0, 'Ronsard, Du Bellay, Baïf, Jodelle et leurs compagnons.'],
            ['Quelle est la thèse centrale du texte ?', ['Le français peut égaler le latin et le grec, à condition d’être enrichi', 'Le latin doit rester la langue des lettres', 'Il faut créer une langue nouvelle', 'La poésie doit être orale'], 0, 'Le français n’est pas pauvre par nature, mais par manque de culture.'],
            ['Par quel moyen principal enrichir la langue ?', ['L’imitation créatrice des Anciens et des Italiens', 'La traduction littérale', 'Le retour au vieux français', 'L’invention pure'], 0, 'Faire en français ce qu’ils ont fait dans leur langue.'],
            ['Quelles formes le manifeste recommande-t-il d’abandonner ?', ['Rondeaux, ballades et virelais', 'Sonnets et odes', 'Élégies et tragédies', 'Épîtres et satires'], 0, 'Elles sont jugées médiévales et basses.'],
            ['Quelle ordonnance royale précède le texte de dix ans ?', ['Villers-Cotterêts, 1539', 'L’édit de Nantes, 1598', 'L’édit de Fontainebleau', 'La pragmatique sanction'], 0, 'Elle impose le français dans les actes officiels : la langue devient nationale.'],
            ['Selon Du Bellay, l’inspiration suffit au poète.', ['Vrai', 'Faux'], 1, 'Il faut travailler : polir longuement ses vers et les soumettre à « la lime » d’un lecteur savant. La poésie est un métier.'],
          ],
        },
        {
          titre: 'Des Souris et des Hommes, John Steinbeck',
          lecon: {
            titre: 'Steinbeck, 1937 — le rêve d’une ferme, en Californie',
            cours: `## L’auteur et le contexte
**John Steinbeck** (1902-1968), Californien, a lui-même travaillé dans les ranchs. *Des souris et des hommes* paraît en **1937** et devient la même année une pièce à Broadway. Deux ans plus tard viendront *Les Raisins de la colère*. Steinbeck reçoit le **prix Nobel** en **1962**.

## L’histoire
Pendant la **Grande Dépression**, deux ouvriers agricoles itinérants arrivent dans un ranch de Californie.

| Personnage | Ce qu’il est |
| **George Milton** | Petit et vif : il **pense pour deux** |
| **Lennie Small** | Colosse **doux et déficient mental** : il aime **caresser les choses douces** et **ne mesure pas sa force** |

> Leur rêve : acheter une **petite ferme**, « vivre de la crème du pays », avec des **lapins** que Lennie soignerait.

| Au ranch | Qui il est |
| **Candy** | Le vieux **manchot** |
| **Crooks** | Le palefrenier **noir**, isolé |
| **Slim** | Le charretier **respecté** |
| **Curley** | Le fils du patron, **agressif** — sa **femme s’ennuie** |

| La chute | Ce qui arrive |
| Lennie tue **accidentellement** un chiot | Puis, dans la grange, **la femme de Curley** en voulant la faire taire |
| Traqué, il s’enfuit | **George le retrouve**, lui raconte **une dernière fois** le rêve de la ferme — et **lui tire une balle dans la nuque** pour lui **épargner le lynchage** |

## À retenir
Un **roman court**, **écrit comme une pièce** : six chapitres = **six scènes**, presque uniquement des dialogues et des indications de lieu.

| Thème | Ce qu’il porte |
| La **solitude** | Chaque personnage la dit |
| L’**amitié** | Ce qui distingue George et Lennie de tous les autres |
| Le **rêve américain** | **Inaccessible** |
| La **brutalité faite aux plus faibles** | Candy, Crooks, Lennie |

Le titre vient d’un vers de **Robert Burns** : les plans les mieux conçus **des souris et des hommes** tournent souvent mal.

## Deux morts qui se répondent
Le vieux chien de **Candy** est abattu par **Carlson** d’une balle dans la nuque, « pour son bien ». Candy regrette de ne pas l’avoir fait lui-même. À la fin, George abat Lennie **de la même manière**, avec le **Luger** de Carlson : il fait lui-même ce que Candy n’a pas fait.

## Pour la dissertation et l’oral
Utile pour le **roman et le récit** : un récit bref, une **tension dramatique** qui monte scène après scène, des signes annonciateurs (les souris mortes, le chiot). À l’oral, montre comment le rêve de la ferme, répété comme une **prière**, structure le roman.

## La phrase à citer
> Le refrain de George : les autres ouvriers **n’ont personne** ; eux deux ont chacun **l’autre** pour veiller sur lui.`,
          },
          questions: [
            ['Qui sont George et Lennie ?', ['Deux ouvriers agricoles itinérants pendant la Grande Dépression', 'Deux frères propriétaires', 'Deux soldats démobilisés', 'Deux étudiants en fuite'], 0, 'George protège Lennie, colosse doux et déficient mental.'],
            ['Quel rêve partagent-ils ?', ['Acheter une petite ferme avec des lapins', 'Partir en Europe', 'Ouvrir un commerce en ville', 'Devenir contremaîtres'], 0, 'Le rêve est répété comme une litanie tout au long du livre.'],
            ['Que fait Lennie dans la grange ?', ['Il tue accidentellement la femme de Curley', 'Il vole de l’argent', 'Il libère les chevaux', 'Il se blesse gravement'], 0, 'Il voulait seulement la faire taire, sans mesurer sa force.'],
            ['Comment le roman se termine-t-il ?', ['George tue Lennie pour lui épargner le lynchage', 'Lennie s’échappe', 'Les deux amis achètent la ferme', 'Curley pardonne'], 0, 'Il lui raconte une dernière fois le rêve avant de tirer.'],
            ['D’où vient le titre du roman ?', ['D’un vers de Robert Burns sur les plans qui tournent mal', 'D’un proverbe américain', 'D’une chanson de cow-boys', 'De la Bible'], 0, 'Les meilleurs plans des souris et des hommes échouent souvent.'],
            ['Le roman est construit comme une pièce de théâtre.', ['Vrai', 'Faux'], 0, 'Six chapitres comme six scènes, presque uniquement des dialogues : il fut aussitôt adapté.'],
          ],
        },
        {
          titre: 'Désert, Jean-Marie Gustave Le Clézio',
          lecon: {
            titre: 'Le Clézio, 1980 — deux exils, un même sable',
            cours: `## L’auteur et le contexte
**Jean-Marie Gustave Le Clézio**, né à **Nice** en **1940**, se fait connaître dès **1963** avec *Le Procès-verbal* (prix Renaudot). *Désert* paraît en **1980** et reçoit le **grand prix Paul-Morand** de l’Académie française. Le récit de 1909-1912 s’appuie sur des faits réels : la **résistance** des nomades menés par **Ma el Aïnine** à la conquête française du Maroc.

## Deux récits alternés
| | **Récit 1 — 1909-1912** | **Récit 2 — contemporain** |
| Qui | Les **hommes bleus** du Sahara occidental, guidés par le cheikh **Ma el Aïnine** ; parmi eux, l’enfant **Nour** | **Lalla**, jeune descendante de ces nomades |
| Ce qui arrive | Chassés par la **colonisation française**, ils marchent vers le nord | Elle grandit dans un **bidonville de la côte marocaine**, **refuse un mariage arrangé** |
| La fin | Le **massacre des combattants** et la **dispersion du peuple** | L’exil à **Marseille** : la misère, un bref succès comme **modèle photographique** — puis le retour au désert, où elle **accouche sous un arbre** |

## À retenir
Le roman qui a installé Le Clézio comme grand écrivain — **prix Nobel 2008**.

| Trait d’écriture | Son effet |
| **Sensorielle** : lumière, sable, vent, chaleur | On **éprouve** le désert |
| **Lente** | Elle préfère la **contemplation** à l’action |

| Thème | Ce qu’il dénonce |
| La **destruction des peuples nomades** | Par la colonisation |
| L’**exil urbain** | Vécu comme une **seconde dépossession** |

> La **ville** y est décrite comme un **désert plus hostile que le vrai**.

## Les personnages de Lalla
| Personnage | Son rôle |
| **Aamma** | La tante qui l’a recueillie |
| Le **Hartani** | Le jeune berger **muet** qu’elle aime, le père de son enfant |
| **Naman** | Le vieux pêcheur conteur |
| **Radicz** | Le jeune mendiant de Marseille, son ami |

## Les thèmes
La **liberté** et la **pureté** du désert, la **mémoire** des ancêtres, la **résistance** silencieuse, la **pauvreté** des immigrés dans la ville.

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Désert montre un roman **polyphonique**, qui fait dialoguer deux époques pour relier une **histoire collective** à un **destin individuel**.

## La phrase à citer
> La première phrase du roman montre les nomades qui « sont apparus, comme dans un rêve, au sommet de la dune ».`,
          },
          questions: [
            ['Quels sont les deux récits alternés du roman ?', ['Celui de Nour en 1909-1912 et celui de Lalla au XXe siècle', 'Deux récits contemporains parallèles', 'Un récit de guerre et un récit de voyage', 'Un récit d’enfance et un récit de vieillesse'], 0, 'Le premier raconte la fin des hommes bleus, le second l’exil de leur descendante.'],
            ['Qui est Ma el Aïnine ?', ['Le cheikh qui guide les hommes bleus vers le nord', 'Le père de Lalla', 'Un officier français', 'Un marchand de Tanger'], 0, 'Sa marche s’achève par le massacre des combattants.'],
            ['Où Lalla émigre-t-elle ?', ['À Marseille', 'À Paris', 'À Casablanca', 'En Espagne'], 0, 'Elle y connaît la misère, puis un bref succès comme modèle.'],
            ['Comment se termine le parcours de Lalla ?', ['Elle revient au désert et accouche sous un arbre', 'Elle reste en France', 'Elle épouse le photographe', 'Elle meurt à Marseille'], 0, 'Le retour au désert referme le cercle des deux récits.'],
            ['Quel prix Le Clézio a-t-il reçu en 2008 ?', ['Le prix Nobel de littérature', 'Le Goncourt', 'Le Renaudot', 'Le prix Femina'], 0, 'Désert avait déjà installé sa notoriété en 1980.'],
            ['La ville est décrite comme un refuge accueillant.', ['Vrai', 'Faux'], 1, 'Elle apparaît comme un désert plus hostile que le vrai.'],
          ],
        },
        {
          titre: 'Dictionnaire philosophique, Voltaire',
          lecon: {
            titre: 'Voltaire, 1764 — la philosophie en articles portatifs',
            cours: `## L’auteur et le contexte
**Voltaire** (1694-1778) vit alors à **Ferney**, près de la frontière suisse, d’où il mène son combat contre « l’**Infâme** » : le fanatisme et l’intolérance. Il vient de défendre la mémoire de **Jean Calas**, protestant de Toulouse exécuté à tort en 1762, dans le *Traité sur la tolérance* (**1763**).

## L’œuvre
Publié **anonymement** en **1764** sous le titre *Dictionnaire philosophique portatif*, augmenté jusqu’en **1769**.

Des **articles courts** par ordre alphabétique : Abbé, Âme, Athée, Baptême, **Fanatisme**, **Guerre**, Liberté, Superstition, **Tolérance**…

| Le format | Pourquoi c’est une arme |
| **Petit** et **bon marché** | Facile à **cacher** et à **faire circuler** |
| Contre les **in-folio** de l’*Encyclopédie* | Il atteint un tout autre public |

## La méthode
Chaque article part d’un **exemple**, d’une **étymologie** ou d’une **anecdote**, puis **glisse vers la critique**.

| Outil | Ce qu’il fait |
| L’**ironie** et la **fausse naïveté** | Elles font tout le travail |
| Le **dialogue** et le **récit bref** | Ils rendent l’argument vivant |

| Article | Son procédé |
| « **Guerre** » | Il énumère **avec un calme apparent** les massacres commis au nom de causes **dérisoires** |
| « **Fanatisme** » | Il compare le fanatique au **malade contagieux** |

## À retenir
Cible principale : l’**intolérance religieuse**, les **dogmes**, la superstition, la **cruauté légale**. L’ouvrage fut **condamné et brûlé**.

> Il illustre une idée : la forme **brève et portative** est la **meilleure alliée des Lumières**. **On ne combat pas un préjugé par un traité, mais par cent piqûres.**

## La condamnation
Le livre est **brûlé à Genève** dès **1764**, puis condamné à Paris. En **1766**, un exemplaire est jeté sur le bûcher du **chevalier de La Barre**, un jeune homme exécuté à Abbeville pour ne pas avoir salué une procession et pour blasphème. Voltaire prend aussitôt sa défense.

## Les thèmes
| Thème | Ce que Voltaire défend |
| La **tolérance** | Nous sommes tous pétris de faiblesses et d’erreurs : pardonnons-nous |
| La **raison** | Elle doit juger les dogmes |
| La **justice** | Contre la torture et les supplices |
| La **paix** | La guerre est la folie des princes |

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Un bon exemple de **forme brève** au service de l’argumentation : définir, c’est déjà juger.

## La phrase à citer
> « Le fanatisme est à la superstition ce que le transport est à la fièvre. »`,
          },
          questions: [
            ['Comment l’ouvrage est-il organisé ?', ['En articles courts classés par ordre alphabétique', 'En chapitres thématiques', 'En dialogues numérotés', 'En lettres fictives'], 0, 'D’où le titre de « dictionnaire ».'],
            ['Pourquoi le format « portatif » est-il une arme ?', ['Petit et bon marché, il circule facilement et se cache', 'Il coûte cher, donc il fait sérieux', 'Il permet des articles très longs', 'Il évite la censure par son titre'], 0, 'Contrairement aux gros volumes de l’Encyclopédie.'],
            ['Quelle est la cible principale de Voltaire ?', ['L’intolérance religieuse et la superstition', 'La monarchie constitutionnelle', 'Les sciences expérimentales', 'La poésie classique'], 0, 'Le fanatisme y est comparé à une maladie contagieuse.'],
            ['Quels procédés Voltaire emploie-t-il dans ses articles ?', ['Ironie, fausse naïveté, dialogue et récit bref', 'Démonstrations mathématiques', 'Citations latines exclusivement', 'Sermons'], 0, 'On ne combat pas un préjugé par un traité, mais par cent piqûres.'],
            ['En quelle année l’ouvrage paraît-il ?', ['1764', '1721', '1748', '1789'], 0, 'Voltaire l’augmentera jusqu’en 1769.'],
            ['L’ouvrage fut publié avec l’autorisation des autorités.', ['Vrai', 'Faux'], 1, 'Publié anonymement, il fut condamné et brûlé.'],
          ],
        },
        {
          titre: 'Discours de la servitude volontaire, Étienne de La Boétie',
          lecon: {
            titre: 'La Boétie, vers 1548 — cessez d’obéir, et tout tombe',
            cours: `## L’auteur et le contexte
**Étienne de La Boétie** (1530-1563), né à **Sarlat**, devient **conseiller au parlement de Bordeaux**. Il meurt à **trente-deux ans**, Montaigne à son chevet. Le *Discours* circule d’abord en manuscrit ; les protestants l’impriment dans les années **1570**, après la Saint-Barthélemy, pour en faire une arme contre la monarchie.

## Le texte
Écrit vers **1548** par un **très jeune homme**, publié **après sa mort** et repris par des **pamphlétaires protestants**. Aussi appelé *Contr’un*.

| La question habituelle | Celle de La Boétie |
| Comment le **tyran soumet** le peuple | **Pourquoi le peuple accepte** |

## La thèse
Un homme seul ne peut rien contre des millions. **S’il domine, c’est que les dominés lui prêtent leur force.**

> La servitude est donc **volontaire** — et la solution **immédiate** : « **Soyez résolus de ne servir plus, et vous voilà libres.** »

**Pas d’armes, pas de bataille** : un **retrait du consentement**.

## Les trois ressorts de l’obéissance
| Ressort | Comment il agit |
| La **coutume** | On **naît sous le joug** et on le croit **naturel** |
| Le **divertissement** | Jeux, théâtres, distributions : le pouvoir **amuse ceux qu’il dépouille** |
| La **chaîne des complices** | Cinq ou six profitent du tyran, six cents d’eux, six mille ensuite : une **pyramide d’intérêts** |

## À retenir
Style **oral et brûlant** : apostrophes, questions rhétoriques, métaphores — le **colosse**, la **chaîne**, le **feu**.

> Texte repris par **tous les camps** : protestants, révolutionnaires, anarchistes, théoriciens de la **désobéissance civile**.

La Boétie était l’ami intime de **Montaigne**, qui lui consacre « De l’amitié ».

## Les exemples
| Exemple | Ce qu’il montre |
| **Cyrus** et les **Lydiens** | Pour les soumettre, il leur ouvre des tavernes et des jeux : le plaisir endort |
| Les **Romains** et leurs empereurs | Le pain et les spectacles achètent l’obéissance |
| Les **Vénitiens** | Un peuple libre ne voudrait pas d’un maître |
| Les deux chiens de **Lycurgue** | L’éducation fait tout : l’un chasse, l’autre court à la soupe |

## Montaigne et le Discours
Montaigne voulait placer le *Discours* **au centre du livre I** des *Essais*. Voyant l’usage qu’en font les protestants, il y renonce et met à la place des sonnets de La Boétie.

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Un texte **argumentatif** pour penser le **pouvoir** et la **liberté**.

## La phrase à citer
> « Soyez résolus de ne servir plus, et vous voilà libres. »`,
          },
          questions: [
            ['Quelle question le texte retourne-t-il ?', ['Non pas comment le tyran domine, mais pourquoi le peuple consent', 'Comment gouverner justement', 'Faut-il tuer le tyran', 'Quelle est la meilleure constitution'], 0, 'C’est ce renversement qui fait la force du Discours.'],
            ['Quelle solution La Boétie propose-t-il ?', ['Retirer son consentement, sans violence', 'Armer le peuple', 'Attendre un prince juste', 'Fuir le royaume'], 0, 'Le colosse tombe si l’on retire le socle.'],
            ['Quelle est la première cause de la servitude ?', ['La coutume', 'La peur des armes', 'La misère', 'La religion'], 0, 'On naît sous le joug et l’on croit qu’il est naturel.'],
            ['Comment le pouvoir se maintient-il selon La Boétie ?', ['Par une pyramide de complices intéressés', 'Par une armée permanente', 'Par la richesse du prince', 'Par l’ignorance seule'], 0, 'Cinq ou six profitent, puis six cents, puis six mille.'],
            ['Quel écrivain était l’ami intime de La Boétie ?', ['Montaigne', 'Rabelais', 'Ronsard', 'Calvin'], 0, 'Il lui consacre le chapitre « De l’amitié » des Essais.'],
            ['Le Discours a été publié du vivant de son auteur.', ['Vrai', 'Faux'], 1, 'Il circule manuscrit et paraît après sa mort, notamment chez les protestants.'],
          ],
        },
        {
          titre: 'Dom Juan, Molière',
          lecon: {
            titre: 'Molière, 1665 — le grand seigneur méchant homme',
            cours: `## L’auteur et le contexte
**Molière** (1622-1673) écrit *Dom Juan* juste après l’interdiction du *Tartuffe* (**1664**). La pièce est créée le **15 février 1665** au **théâtre du Palais-Royal** ; Molière y joue **Sganarelle**. Le sujet vient d’Espagne : *El burlador de Sevilla* de **Tirso de Molina**, déjà adapté en Italie et en France.

## L’histoire
Comédie en **cinq actes et en prose**, créée en **1665** puis **retirée après quinze représentations**.

| Étape | Ce que fait Dom Juan |
| Le départ | Il a **enlevé Elvire d’un couvent**, l’a épousée — et **abandonnée** |
| La fuite | Avec son valet **Sganarelle** ; il tente d’enlever une fiancée en mer, **fait naufrage** |
| Les paysannes | Il promet le mariage à **Charlotte** et **Mathurine** — **le même jour** |
| Le pauvre | Il lui offre un louis d’or **s’il jure** ; le pauvre refuse, Dom Juan le lui donne « pour l’amour de l’humanité » — puis sauve un homme attaqué |
| Le Commandeur | Il croise la **statue** de l’homme qu’il a tué et **l’invite à souper** |
| La fin | Poursuivi par ses créanciers, son père et les frères d’Elvire, il **feint la conversion** — puis la statue **l’entraîne dans les flammes** |

> « L’**hypocrisie** est un vice à la mode. » Sganarelle, resté seul, réclame ses gages.

## À retenir
Un héros **libertin** au **double sens** : de **mœurs** et de **pensée**.

> Il ne croit « qu’au fait que **deux et deux sont quatre** ».

| Ce que la pièce mêle | Ce qu’elle refuse |
| Comédie, farce, tragédie, **machinerie** spectaculaire | Les **unités** |

Elle fit **scandale** — notamment pour la **scène du pauvre** et pour l’**éloge ironique de l’hypocrisie**.

## Les autres personnages
| Personnage | Son rôle |
| **Dom Louis** | Le père, qui lui rappelle ce que doit être un noble |
| **Don Carlos** et **Don Alonse** | Les frères d’Elvire, qui veulent se venger |
| **M. Dimanche** | Le marchand créancier qu’il éconduit à force de politesses |
| **Pierrot** | Le paysan qui l’a sauvé de la noyade, et dont il séduit la fiancée Charlotte |
| Le **Spectre** | Une femme voilée, puis le Temps avec sa faux : le dernier avertissement |

## Les thèmes
La **liberté** et la **transgression**, la **religion** et l’**hypocrisie**, le **langage** qui séduit et trompe, la **justice** divine.

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre du XVIIe au XXIe siècle**. Pièce **baroque** plus que classique : lieux multiples, registres mêlés, merveilleux final.

## La phrase à citer
> « Mes gages ! mes gages ! »`,
          },
          questions: [
            ['Quel est le double sens du libertinage de Dom Juan ?', ['Il est libertin de mœurs et de pensée', 'Il est joueur et dépensier', 'Il est athée mais fidèle', 'Il est noble et pauvre'], 0, 'Il ne croit « qu’au fait que deux et deux sont quatre ».'],
            ['Qui est Sganarelle ?', ['Le valet de Dom Juan, à la fois complice et censeur', 'Le père de Dom Juan', 'Le frère d’Elvire', 'Un paysan'], 0, 'Il réclame ses gages dans la dernière réplique de la pièce.'],
            ['Que fait Dom Juan à l’acte V ?', ['Il feint la conversion religieuse', 'Il se marie avec Elvire', 'Il fuit à l’étranger', 'Il se rend à la justice'], 0, '« L’hypocrisie est un vice à la mode » : c’est la scène la plus scandaleuse.'],
            ['Qui entraîne Dom Juan dans les flammes ?', ['La statue du Commandeur', 'Les frères d’Elvire', 'Le pauvre', 'M. Dimanche'], 0, 'Il l’avait invitée à souper par bravade.'],
            ['Quelle particularité formelle la pièce présente-t-elle ?', ['Elle est en prose et ne respecte pas les unités', 'Elle est en alexandrins', 'Elle tient en un acte', 'Elle n’a pas de valet'], 0, 'Multiplicité des lieux et machinerie spectaculaire.'],
            ['La pièce fut jouée sans interruption après sa création.', ['Vrai', 'Faux'], 1, 'Elle fut retirée après une quinzaine de représentations, sous la pression des dévots.'],
          ],
        },
        {
          titre: 'Don Quichotte, Miguel de Cervantes',
          lecon: {
            titre: 'Cervantes, 1605 et 1615 — le premier roman moderne',
            cours: `## L’auteur et le contexte
**Miguel de Cervantes** (1547-1616) a eu une vie de roman : blessé à la **bataille de Lépante** (1571), où il perd l’usage de la main gauche, il est ensuite **captif à Alger** pendant cinq ans. La **première partie** paraît en **1605**. En **1614**, un inconnu publie sous le nom d’**Avellaneda** une fausse suite ; Cervantes répond par sa vraie seconde partie en **1615**.

## L’histoire
**Alonso Quichano**, hidalgo pauvre de la Manche, a **tant lu de romans de chevalerie** qu’il en **perd la raison**.

| Ce qu’il se donne | Le détail |
| Un nom | **Don Quichotte** |
| Une armure | Vieille et dépareillée |
| Un cheval | La rosse **Rossinante** |
| Une dame | Une paysanne, sous le nom de **Dulcinée du Toboso** |
| Un écuyer | **Sancho Panza**, paysan **pratique et proverbial** |

| Aventure | Ce qu’il croit voir |
| Des **moulins** | Des **géants** |
| Des **troupeaux** | Des **armées** |
| Des **galériens** | Des innocents à libérer — ils le **rouent de coups** |

## La seconde partie, en 1615
> Les personnages **ont lu la première partie** : on les **reconnaît**, on se **moque** d’eux, un **duc** organise des mises en scène **pour les humilier**.

Vaincu, don Quichotte rentre chez lui, **recouvre la raison** — et **meurt**.

## À retenir
> Fondateur du **roman moderne** : une **parodie** des romans de chevalerie qui devient une **réflexion sur la fiction elle-même** — sur **ce que lire fait à la vie**.

| Apport | Ce qu’il a irrigué |
| Le duo **idéaliste / réaliste** | Toute la littérature européenne |
| La **mise en abyme** | Le livre dans le livre |
| L’**ironie** et la **tendresse** | Le ton du roman moderne |

> Les moulins à vent sont devenus le symbole du **combat magnifique et perdu**.

## Les autres personnages
| Personnage | Son rôle |
| Le **curé** et le **barbier** | Ils brûlent ses livres de chevalerie pour le guérir |
| **Sansón Carrasco** | Le bachelier qui le vainc sous le nom de **chevalier de la Blanche-Lune** |
| Le **duc** et la **duchesse** | Ils font de Sancho le gouverneur de l’« île » de **Barataria** |

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Don Quichotte permet de réfléchir à ce que la **fiction** fait au lecteur.

## La phrase à citer
> « Dans une bourgade de la Manche, dont je ne veux pas me rappeler le nom, vivait, il n’y a pas longtemps, un hidalgo… » — la première phrase (traduction Viardot)`,
          },
          questions: [
            ['Qu’est-ce qui fait perdre la raison à don Quichotte ?', ['La lecture excessive de romans de chevalerie', 'Un chagrin d’amour', 'Une maladie', 'La misère'], 0, 'Le roman interroge ce que lire fait à la vie.'],
            ['Qui est Sancho Panza ?', ['Son écuyer, paysan pratique et proverbial', 'Son frère', 'Un chevalier rival', 'Le curé du village'], 0, 'Le duo idéaliste/réaliste est devenu un modèle romanesque.'],
            ['Que sont, pour don Quichotte, les moulins à vent ?', ['Des géants à combattre', 'Des châteaux', 'Des armées ennemies', 'Des monstres marins'], 0, 'La scène est devenue le symbole du combat magnifique et perdu.'],
            ['Quelle est la particularité de la seconde partie, publiée en 1615 ?', ['Les personnages ont lu la première partie et sont reconnus', 'Elle se déroule en France', 'Sancho y disparaît', 'Elle est écrite en vers'], 0, 'Cette mise en abyme est d’une modernité stupéfiante.'],
            ['Comment le roman se termine-t-il ?', ['Don Quichotte recouvre la raison, puis meurt', 'Il devient roi', 'Il épouse Dulcinée', 'Il repart pour de nouvelles aventures'], 0, 'La guérison coïncide avec la fin de la vie : c’est le sens du dénouement.'],
            ['Le roman est une simple parodie sans portée réflexive.', ['Vrai', 'Faux'], 1, 'La parodie devient une réflexion sur la fiction elle-même : c’est ce qui en fait le premier roman moderne.'],
          ],
        },
        {
          titre: 'Du côté de chez Swann, Marcel Proust',
          lecon: {
            titre: 'Proust, 1913 — la madeleine et les deux côtés',
            cours: `## L’auteur et le contexte
**Marcel Proust** (1871-1922), longtemps tenu pour un mondain et un amateur, publie ce premier volume chez **Bernard Grasset** en **novembre 1913**. Il consacre le reste de sa vie, malade et reclus, à achever *À la recherche du temps perdu*.

## Les trois parties
| Partie | Ce qu’elle contient |
| **Combray** | Le narrateur enfant, le **drame du baiser du soir refusé**, la tante Léonie, l’église, les lectures — et l’épisode de la **madeleine** |
| **Un amour de Swann** | Récit **à la troisième personne**, **antérieur** à la naissance du narrateur |
| **Noms de pays : le nom** | La rêverie sur les noms de villes, et l’amour d’enfance pour **Gilberte** aux Champs-Élysées |

## La madeleine
Un **goût** fait resurgir **tout un pan du passé**.

> C’est la **mémoire involontaire** — la matrice de toute la *Recherche*.

## Un amour de Swann
| Étape | Ce qui se passe |
| **Charles Swann**, homme du monde raffiné | S’éprend d’**Odette de Crécy**, cocotte |
| L’enfermement | Une **jalousie maladive** |
| Le motif musical | La « **petite phrase** » de **Vinteuil**, qui le fait souffrir |
| Le verdict | « Dire que j’ai gâché des années de ma vie, […] pour une femme qui ne me plaisait pas, **qui n’était pas mon genre** ! » |
| La suite | **Il l’épousera pourtant** |

## À retenir
| Fait | Le détail |
| Le volume | Le **premier** d’*À la recherche du temps perdu* |
| Sa publication | **Refusé** par plusieurs éditeurs — dont **Gide à la NRF**, qui le **regrettera** — et publié **à compte d’auteur** en **1913** |
| Sa structure | Les **deux côtés** de la promenade — **chez Swann** et **les Guermantes** — structurent toute l’œuvre |

Phrase **longue**, comparaisons développées, **analyse infinie** du désir et de la jalousie.

## Les personnages de Combray
| Personnage | Son rôle |
| La **mère** et la **grand-mère** | La tendresse, le baiser du soir |
| La **tante Léonie** | Elle ne quitte plus sa chambre ; c’est elle qui offrait la madeleine trempée dans le tilleul |
| **Françoise** | La cuisinière, fidèle et impitoyable |
| **Vinteuil** | Le vieux professeur de piano, dont on découvrira qu’il est un grand compositeur |
| Les **Verdurin** | Le salon bourgeois où Swann rencontre Odette |

## Pour la dissertation et l’oral
Objet d’étude : **le roman et le récit**. Le livre montre un roman où **le temps et la mémoire** remplacent l’intrigue. À l’oral, commente la phrase proustienne sur un exemple : sa longueur suit le mouvement de la pensée.

## La phrase à citer
> « Longtemps, je me suis couché de bonne heure. »`,
          },
          questions: [
            ['Quel épisode fonde la mémoire involontaire ?', ['La madeleine trempée dans le thé', 'La visite de l’église de Combray', 'La promenade du côté des Guermantes', 'Le baiser du soir'], 0, 'Un goût fait resurgir tout un pan du passé oublié.'],
            ['Que raconte « Un amour de Swann » ?', ['La passion jalouse de Swann pour Odette, avant la naissance du narrateur', 'L’enfance du narrateur', 'Le mariage de Gilberte', 'La guerre de 1914'], 0, 'Ce récit à la troisième personne fonctionne comme un roman dans le roman.'],
            ['Quelle œuvre musicale hante Swann ?', ['La « petite phrase » de la sonate de Vinteuil', 'Une symphonie de Beethoven', 'Un opéra de Wagner', 'Une valse de Chopin'], 0, 'Elle devient l’air national de son amour.'],
            ['Comment le premier volume a-t-il été publié ?', ['À compte d’auteur, en 1913, après plusieurs refus', 'Chez Gallimard, immédiatement accepté', 'En feuilleton dans un journal', 'À titre posthume'], 0, 'Gide, qui l’avait refusé pour la NRF, le regretta amèrement.'],
            ['Quels sont les « deux côtés » de Combray ?', ['Le côté de chez Swann et le côté des Guermantes', 'Le côté du parc et celui de l’église', 'Le côté nord et le côté sud', 'Le côté de la mer et celui de la ville'], 0, 'Ils structurent toute la Recherche.'],
            ['Swann finit par épouser Odette.', ['Vrai', 'Faux'], 0, 'Alors même qu’il a conclu qu’elle n’était pas son genre : c’est le paradoxe du désir proustien.'],
          ],
        },
        {
          titre: 'Électre, Jean Giraudoux',
          lecon: {
            titre: 'Giraudoux, 1937 — la vérité, même si la ville brûle',
            cours: `## L’auteur et le contexte
**Jean Giraudoux** (1882-1944) est **diplomate** autant qu’écrivain. Deux ans après *La guerre de Troie n’aura pas lieu* (1935), il fait jouer *Électre*, créée le **13 mai 1937** au **théâtre de l’Athénée** par **Louis Jouvet**, son metteur en scène et interprète de toujours.

## L’histoire
Reprise du mythe grec. À Argos, **Électre** attend son frère **Oreste** et soupçonne **Clytemnestre**, sa mère, et **Égisthe**, l’amant de celle-ci, d’avoir assassiné **Agamemnon**.

| Personnage ou force | Son rôle |
| **Égisthe** | Régent **efficace** : il veut **marier Électre au jardinier** pour la neutraliser |
| Les **Euménides** | **Trois petites filles qui grandissent d’acte en acte** : elles poussent à la révélation |
| **Électre** | Elle refuse **tout compromis** : **la vérité, coûte que coûte** |

| La fin | Ce qui se passe |
| **Oreste** tue Clytemnestre et Égisthe | **Au moment même où les Corinthiens attaquent** |
| **Argos brûle** | — |

> « Comment cela s’appelle-t-il, quand le jour se lève, comme aujourd’hui, et que tout est gâché, que tout est saccagé… » — « **Cela a un très beau nom, femme Narsès. Cela s’appelle l’aurore.** »

## À retenir
Pièce en **deux actes**, créée en **1937**, dans une Europe **au bord de la guerre**.

> La question de la **justice absolue contre le compromis politique** y est **brûlante**.

| Nuance à connaître | Ce qu’elle change |
| **Égisthe n’est pas un méchant simple** | Le pouvoir l’a fait **devenir un vrai chef** |

Langue **brillante et ironique**, avec un **jardinier** qui vient parler seul au public dans un « **lamento** » célèbre.

## Les autres personnages
| Personnage | Son rôle |
| Le **Mendiant** | Un vagabond qui sait tout, peut-être un dieu : c’est lui qui dit le dernier mot |
| Le **Président** et **Agathe**, sa femme | Une intrigue d’adultère bourgeois qui parodie le drame des Atrides |
| La **femme Narsès** | Une femme du peuple, qui pose la question finale |

## Les thèmes
| Thème | Ce qu’en fait Giraudoux |
| La **vérité** | Absolue, elle détruit tout |
| La **justice** | Elle s’oppose à la paix de la cité |
| Le **destin** | Il avance malgré les hommes |

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre**. Comme Anouilh, Giraudoux réécrit un **mythe grec** avec humour et anachronismes, pour parler de son temps.

## La phrase à citer
> « Cela s’appelle l’aurore. »`,
          },
          questions: [
            ['Que veut Électre dans la pièce ?', ['La vérité entière, quelles qu’en soient les conséquences', 'Le pouvoir à Argos', 'Sauver sa mère', 'Épouser le jardinier'], 0, 'Elle refuse tout compromis, même quand la ville est menacée.'],
            ['Comment Égisthe tente-t-il de neutraliser Électre ?', ['En la mariant au jardinier', 'En l’exilant', 'En l’emprisonnant', 'En la faisant taire par la force'], 0, 'Un mariage médiocre l’écarterait du destin royal.'],
            ['Sous quelle forme les Euménides apparaissent-elles ?', ['Trois petites filles qui grandissent d’acte en acte', 'Trois vieilles femmes', 'Des ombres invisibles', 'Des soldats'], 0, 'Leur croissance accompagne la montée de la vengeance.'],
            ['Que se passe-t-il pendant qu’Oreste accomplit la vengeance ?', ['Les Corinthiens attaquent et Argos brûle', 'Une fête est célébrée', 'Le peuple se révolte contre Électre', 'Un traité de paix est signé'], 0, 'La justice absolue coûte la ville.'],
            ['Par quelle réplique la pièce se termine-t-elle ?', ['« Cela s’appelle l’aurore »', '« Tout est perdu »', '« La guerre n’aura pas lieu »', '« Adieu, Argos »'], 0, 'Une des fins les plus célèbres du théâtre français.'],
            ['Égisthe est présenté comme un méchant sans nuance.', ['Vrai', 'Faux'], 1, 'Le pouvoir a fait de lui un vrai chef : c’est ce qui rend le dilemme réel.'],
          ],
        },
        {
          titre: 'En attendant Godot, Samuel Beckett',
          lecon: {
            titre: 'Beckett, 1953 — deux actes où rien n’arrive, deux fois',
            cours: `## L’auteur et le contexte
**Samuel Beckett** (1906-1989), écrivain **irlandais** installé en France, écrit la pièce **en français** en 1948-1949. Elle est publiée aux **Éditions de Minuit** en **1952** et créée le **5 janvier 1953** au petit **théâtre de Babylone**, à Paris, dans une mise en scène de **Roger Blin**.

## La pièce
**Vladimir** (Didi) et **Estragon** (Gogo) **attendent**, près d’un arbre, sur une route de campagne, un certain **Godot** — **qui ne vient pas**.

| Pour passer le temps | Ce qu’ils font |
| Les objets | Chapeaux, chaussures |
| Les relations | Disputes, réconciliations |
| Les projets | Une **pendaison**, **abandonnée** |

| Personnage de passage | Ce qu’il est |
| **Pozzo** | Un maître **brutal** |
| **Lucky** | Son esclave **tenu en laisse**, qui « **pense** » **sur commande**, dans un monologue **délirant** |
| Le **garçon** | Il annonce que Godot **ne viendra pas ce soir**, mais **viendra demain** |

## L’acte II
| Ce qui a changé | Ce qui n’a pas changé |
| L’arbre a **quelques feuilles** | Le garçon revient dire **la même chose** |
| **Pozzo est aveugle**, **Lucky muet** | L’attente |

> Les deux hommes décident de partir : « **Ils ne bougent pas.** »

## À retenir
Créée en **1953**, la pièce devient l’**emblème du théâtre de l’absurde**, avec *La Cantatrice chauve* d’Ionesco (1950).

| Ce qu’elle n’a pas | Ce qu’elle a |
| Ni **intrigue**, ni **psychologie** | Un **décor nu**, un **temps circulaire** |

> On y a lu l’attente de **Dieu**, l’**après-guerre**, la **condition humaine** — **Beckett a toujours refusé d’expliquer**.

Le **comique de music-hall** — duo, gags, chutes — y **sert le désespoir**. Beckett reçoit le **Nobel en 1969**.

## Les thèmes
| Thème | Ce que la pièce en fait |
| L’**attente** | Elle remplit toute la vie |
| Le **temps** | Il tourne en rond, sans progrès |
| Le **langage** | Il tourne à vide, mais il aide à tenir |
| La **dépendance** | Chaque couple — Vladimir et Estragon, Pozzo et Lucky — ne peut ni se quitter ni s’aimer |

## Pour la dissertation et l’oral
Objet d’étude : **le théâtre du XVIIe au XXIe siècle**. Un exemple pour montrer comment le théâtre du XXe siècle **déconstruit** l’intrigue, le personnage et le dialogue classiques. À l’oral, compare la fin de chaque acte : une décision de partir, suivie de l’indication « Ils ne bougent pas ».

## La phrase à citer
> « Rien à faire. »`,
          },
          questions: [
            ['Qu’attendent Vladimir et Estragon ?', ['Un certain Godot, qui ne vient jamais', 'Un train', 'La fin de la guerre', 'Le retour de Pozzo'], 0, 'Un garçon annonce chaque soir qu’il viendra demain.'],
            ['Que se passe-t-il à l’acte II ?', ['Presque la même chose qu’à l’acte I, avec des dégradations', 'Godot arrive enfin', 'Les personnages quittent la scène', 'La pièce change de décor'], 0, 'Pozzo est aveugle, Lucky muet, l’arbre a quelques feuilles.'],
            ['Quelle est la dernière indication scénique de la pièce ?', ['« Ils ne bougent pas », après avoir décidé de partir', '« Ils sortent »', '« Le rideau tombe sur Godot »', '« Ils s’endorment »'], 0, 'Le décalage entre la parole et l’action résume toute la pièce.'],
            ['Qui sont Pozzo et Lucky ?', ['Un maître brutal et son esclave tenu en laisse', 'Deux amis de Vladimir', 'Deux messagers de Godot', 'Le père et le fils du garçon'], 0, 'Lucky « pense » sur commande dans un monologue délirant.'],
            ['De quel courant théâtral la pièce est-elle devenue l’emblème ?', ['Le théâtre de l’absurde', 'Le drame romantique', 'Le naturalisme', 'Le théâtre épique'], 0, 'Créée en 1953, trois ans après La Cantatrice chauve d’Ionesco, elle a bouleversé la scène européenne.', 'Quel mouvement la pièce fonde-t-elle ?'],
            ['Beckett a expliqué qui était Godot.', ['Vrai', 'Faux'], 1, 'Il a toujours refusé de le faire, laissant les lectures ouvertes.'],
          ],
        },
        {
          titre: 'Encyclopédie, Denis Diderot, Jean le Rond d’Alembert',
          lecon: {
            titre: 'Diderot et d’Alembert, 1751-1772 — l’arbre des savoirs',
            cours: `## Les auteurs et le contexte
Au départ, le libraire **Le Breton** veut seulement **traduire** la *Cyclopaedia* anglaise d’**Ephraïm Chambers** (1728). **Denis Diderot** (1713-1784) et le mathématicien **Jean le Rond d’Alembert** (1717-1783) en font un projet tout autre. D’Alembert écrit le **Discours préliminaire** (1751) ; il se retire de la direction à la fin des années 1750, et Diderot mène seul l’entreprise.

## L’entreprise
| Fait | Le chiffre |
| Volumes | **17** de texte, **11** de **planches** |
| Publication | De **1751 à 1772** |
| Articles | environ **72 000** |
| Collaborateurs | Près de **deux cents** : Voltaire, Rousseau, Montesquieu, **Jaucourt** (près d’un quart à lui seul), des artisans, des médecins |

Sous-titre : *Dictionnaire raisonné des sciences, des arts et des métiers*.

## Le projet, en trois gestes
| Geste | Ce qu’il change |
| **Rassembler** tous les savoirs | **Y compris ceux des métiers manuels** : d’où les planches minutieuses sur la fabrication des épingles ou du papier — **révolutionnaires par la dignité accordée au travail** |
| **Classer** | Selon un arbre issu des **facultés humaines** — mémoire, raison, imagination — et **non selon la théologie** |
| Faire **communiquer** | Par un système de **renvois**, dont certains sont **ironiques** : l’article « Anthropophages » renvoie à « **Eucharistie** » |

> « **Changer la façon commune de penser** », écrit Diderot.

## À retenir
L’ouvrage fut **interdit à deux reprises**, ses privilèges **révoqués** — Diderot dut le poursuivre **à demi clandestinement**.

> C’est l’entreprise **emblématique des Lumières** : **diffuser le savoir est en soi une action politique**, parce qu’un **lecteur informé se soumet moins**.

> Le savoir y cesse d’être un **dépôt à conserver** pour devenir un **outil à partager**.

## Les obstacles
| Épreuve | Ce qui arrive |
| **1752** | Les deux premiers volumes sont interdits |
| **1759** | Le privilège est révoqué ; le pape condamne l’ouvrage |
| **1764** | Diderot découvre que Le Breton a **censuré en secret** des articles déjà imprimés |

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. L’Encyclopédie montre que les Lumières sont une **œuvre collective** et que la **forme** — le dictionnaire, les renvois — est déjà un **argument**.

## La phrase à citer
> « Le but d’une encyclopédie est de rassembler les connaissances éparses sur la surface de la terre. » — Diderot, article « Encyclopédie »`,
          },
          questions: [
            ['Combien d’années la publication de l’Encyclopédie a-t-elle duré ?', ['De 1751 à 1772, soit une vingtaine d’années', 'Cinq ans', 'Cinquante ans', 'Deux ans'], 0, 'Dix-sept volumes de texte et onze de planches.'],
            ['Quelle formule résume l’ambition de Diderot ?', ['« Changer la façon commune de penser »', '« Éclairer le roi »', '« Instruire les enfants »', '« Sauver les Anciens »'], 0, 'Diffuser le savoir est en soi une action politique.'],
            ['Quelle nouveauté les planches introduisent-elles ?', ['Elles donnent une dignité savante aux métiers manuels', 'Elles illustrent la Bible', 'Elles cartographient le monde', 'Elles reproduisent des tableaux'], 0, 'La fabrication des épingles ou du papier y est décrite avec minutie.'],
            ['Selon quel principe les savoirs sont-ils classés ?', ['Un arbre fondé sur les facultés humaines : mémoire, raison, imagination', 'L’ordre chronologique', 'La hiérarchie théologique', 'Le rang social des auteurs'], 0, 'La théologie perd sa place de reine des savoirs.'],
            ['À quoi servent les renvois entre articles ?', ['À faire communiquer les savoirs, parfois ironiquement', 'À gagner de la place', 'À citer les sources', 'À classer alphabétiquement'], 0, '« Anthropophages » renvoie à « Eucharistie ».'],
            ['L’entreprise s’est déroulée sans obstacle.', ['Vrai', 'Faux'], 1, 'Interdictions, révocations de privilège, travail à demi clandestin.'],
          ],
        },
        {
          titre: 'Énéide, Virgile',
          lecon: {
            titre: 'Virgile, Ier siècle av. J.-C. — l’épopée fondatrice de Rome',
            cours: `## L’auteur et le contexte
**Virgile** (70-19 av. J.-C.), déjà auteur des *Bucoliques* et des *Géorgiques*, écrit l’*Énéide* à la demande d’**Auguste**, par l’intermédiaire de son protecteur **Mécène**. Rome sort d’un siècle de guerres civiles : le poème doit lui donner une **origine glorieuse**, en rivalisant avec **Homère**.

## L’œuvre
| Fait | Le détail |
| La forme | **Douze chants** en **hexamètres** |
| La composition | Entre **29 et 19 av. J.-C.** |
| Son état | **Inachevée** à la mort de Virgile — il demanda qu’on la **brûlât**, **Auguste l’en empêcha** |
| Le sujet | La fuite d’**Énée**, prince troyen, jusqu’en **Italie**, où sa descendance **fondera Rome** |

## Le récit
| Chants | Ce qui s’y passe |
| **I-III** | La tempête, l’arrivée à **Carthage**, le récit de la chute de Troie fait à la reine **Didon** — le cheval, la mort de Priam, la fuite avec **Anchise sur les épaules** et **Ascagne** |
| **IV** | L’amour de **Didon** — et son **suicide** quand Énée repart **sur ordre des dieux** |
| **VI** | La **descente aux Enfers** : son père lui montre les **âmes des Romains à venir** |
| **VII-XII** | La guerre en **Latium** contre **Turnus**, les alliances, le **bouclier forgé par Vulcain**, et le **duel final** |

## À retenir
> Épopée **nationale et politique** : elle donne à Rome une **origine troyenne** et **légitime le pouvoir d’Auguste**.

| Le héros est défini par… | Et non par… |
| La *pietas* — le devoir envers les **dieux**, la **patrie** et la **famille** | La **gloire personnelle** |

Modèle **absolu** pour la littérature européenne, de **Dante** — qui en fait son **guide** — à **Du Bellay**.

## Les autres personnages
| Personnage | Son rôle |
| **Junon** | La déesse hostile aux Troyens, qui multiplie les obstacles |
| **Vénus** | La mère d’Énée, qui le protège |
| **Achate** | Le compagnon fidèle |
| **Lavinia** | La fille du roi Latinus, promise à Énée |
| **Pallas** | Le jeune allié tué par Turnus |

À la fin, Turnus vaincu demande grâce ; Énée hésite, puis voit sur lui le **baudrier de Pallas** et le tue.

## Pour la dissertation et l’oral
Utile pour les **réécritures** : Didon et Énée inspirent la tragédie, l’opéra, la peinture. Et pour l’**humanisme** : les poètes de la Renaissance font de Virgile un modèle d’imitation.

## La phrase à citer
> « Arma virumque cano » — « Je chante les armes et l’homme. »`,
          },
          questions: [
            ['Qui est Énée ?', ['Un prince troyen dont la descendance fondera Rome', 'Un roi grec', 'Un empereur romain', 'Un dieu latin'], 0, 'Il fuit Troie avec son père sur les épaules et son fils par la main.'],
            ['Que fait Didon quand Énée la quitte ?', ['Elle se suicide', 'Elle le poursuit en mer', 'Elle déclare la guerre à Troie', 'Elle épouse Turnus'], 0, 'Son malheur explique, dans le poème, la haine future entre Rome et Carthage.'],
            ['Quelle vertu définit le héros virgilien ?', ['La pietas : le devoir envers les dieux, la patrie et la famille', 'La gloire personnelle', 'La ruse', 'La force physique'], 0, 'C’est ce qui l’oppose aux héros homériques.'],
            ['Que voit Énée aux Enfers ?', ['Les âmes des futurs Romains, montrées par son père', 'Le châtiment de Didon', 'La destruction de Rome', 'Son propre tombeau'], 0, 'Le passage justifie tout le destin romain.'],
            ['Comment le poème se termine-t-il ?', ['Par le duel où Énée tue Turnus', 'Par le mariage d’Énée', 'Par la fondation de Rome', 'Par le retour à Troie'], 0, 'La fin est abrupte : le poème est resté inachevé.'],
            ['Virgile souhaitait la publication de son poème.', ['Vrai', 'Faux'], 1, 'Il demanda qu’on le brûlât ; Auguste s’y opposa.'],
          ],
        },
        {
          titre: 'Entretiens sur la pluralité des mondes, Bernard Le Bouyer de Fontenelle',
          lecon: {
            titre: 'Fontenelle, 1686 — la science expliquée à une marquise',
            cours: `## L’auteur et le contexte
**Bernard Le Bouyer de Fontenelle** (1657-1757), **neveu de Corneille**, vit presque cent ans. Il publie les *Entretiens* en **1686**, puis l’*Histoire des oracles* (1687). Il devient **secrétaire perpétuel de l’Académie des sciences** en **1697**, et fait de l’éloge des savants un genre littéraire.

## Le dispositif
Un philosophe séjourne chez une **marquise**. Chaque soir, dans le parc, ils regardent le ciel : **six soirs**, **six leçons** (cinq dans l’édition de 1686, le sixième ajouté en 1687).

| Ce que le dialogue permet | Son effet |
| Les **objections** et les **résistances** | Le lecteur **avance avec la marquise** |
| Les **images** | Elle pose **ses propres questions** — celles du lecteur |

## Le contenu
| Notion | Ce qu’elle bouscule |
| Le **système de Copernic** | La Terre tourne autour du Soleil |
| La **taille** de l’univers | Elle dépasse l’imagination |
| La **nature des planètes** | Des mondes, non des points |
| Les mondes **habités** | La Lune, les planètes, et les **étoiles fixes vues comme autant de soleils** |

> Tout est présenté comme **conjecture raisonnable**, **jamais comme dogme**.

## Les images
| Image | Ce qu’elle explique |
| L’univers comme un **opéra** | Le spectateur voit les **effets** ; le philosophe cherche les **machines cachées** derrière le décor |

> Chaque notion difficile est traduite en **analogie prise dans le monde mondain** de l’interlocutrice.

## À retenir
L’un des premiers grands textes de **vulgarisation scientifique**, écrit pour un public **mondain et largement féminin**, **exclu du latin et des académies**.

> La **galanterie** du ton est une **stratégie de diffusion** : elle suppose que **la science n’appartient pas aux seuls savants**. L’ouvrage **annonce les Lumières**.

## La physique du livre
Fontenelle expose le système de **Copernic** avec la physique de **Descartes** : les planètes sont emportées par des **tourbillons** de matière. Newton a depuis remplacé cette explication, mais la méthode demeure : **douter**, **observer**, **supposer avec prudence**.

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées**. Le dialogue est une **forme argumentative** : il fait avancer la pensée par questions, objections et images. À l’oral, montre comment la **marquise** n’est pas une simple élève : elle pose les bonnes questions et tire parfois les conclusions avant le philosophe.

## La phrase à citer
> « Toute la philosophie n’est fondée que sur deux choses, sur ce qu’on a l’esprit curieux et les yeux mauvais. »`,
          },
          questions: [
            ['Quelle forme l’ouvrage adopte-t-il ?', ['Un dialogue en six soirées', 'Un traité en chapitres', 'Une lettre ouverte', 'Un poème didactique'], 0, 'Le dialogue rend visible le chemin de la compréhension.'],
            ['Qui est l’interlocutrice du philosophe ?', ['Une marquise', 'Une astronome', 'Une religieuse', 'Sa nièce'], 0, 'Elle représente le public mondain tenu à l’écart des savoirs.'],
            ['Quel système astronomique est exposé ?', ['Celui de Copernic', 'Celui de Ptolémée', 'Celui d’Aristote', 'Celui de Newton'], 0, 'La Terre tourne autour du Soleil, et sur elle-même.'],
            ['Quelle hypothèse hardie l’ouvrage défend-il ?', ['La pluralité des mondes habités', 'La platitude de la Terre', 'L’immobilité du Soleil au centre exact de l’univers', 'La fin prochaine du monde'], 0, 'Elle est présentée comme conjecture, jamais comme dogme.'],
            ['À quoi l’univers est-il comparé ?', ['À un opéra dont on cherche les machines', 'À une horloge cassée', 'À une bibliothèque', 'À un océan'], 0, 'Le philosophe est celui qui regarde derrière le décor.'],
            ['Le ton galant nuit à la rigueur du propos.', ['Vrai', 'Faux'], 1, 'C’est une stratégie de diffusion assumée, qui suppose la science partageable.'],
          ],
        },
        {
          titre: 'Essais, Michel de Montaigne',
          lecon: {
            titre: 'Montaigne, 1580-1592 — « je suis moi-même la matière de mon livre »',
            cours: `## L’auteur et le contexte
**Michel de Montaigne** (1533-1592), magistrat à Bordeaux, se retire en **1571**, à trente-huit ans, dans la **tour** de son château, au milieu de sa bibliothèque. Il en sort pour voyager en Italie et pour être **maire de Bordeaux** (1581-1585). Après sa mort, **Marie de Gournay**, sa « fille d’alliance », publie l’édition de **1595**.

## L’œuvre
**Trois livres**, publiés à partir de **1580** et augmentés jusqu’à la mort de l’auteur en **1592**.

| Le mot « essai » | Ce qu’il implique |
| **Tentative**, **pesée** | Montaigne **ne démontre pas** : il **examine, se contredit, revient** |

> « Je ne peins pas l’être, je peins le **passage**. »

## Les chapitres à connaître
| Chapitre | Ce qu’il énonce |
| « **De l’institution des enfants** » | Une éducation qui forme le **jugement** plutôt que la mémoire : un précepteur qui ait « plutôt la **tête bien faite** que bien pleine » |
| « **De l’amitié** » | La Boétie : « **parce que c’était lui, parce que c’était moi** » |
| « **Des Cannibales** » | « Chacun appelle **barbarie** ce qui n’est pas de son **usage** » |
| « **Des Coches** » | La **destruction du Nouveau Monde** |
| « **De l’expérience** » | Le corps, la vieillesse, la **mesure** |

## La méthode
| Outil | Son usage |
| Le **doute** comme discipline | « **Que sais-je ?** » |
| L’attention au **corps** et au quotidien | La pensée part du concret |
| La **citation antique** | Un **matériau**, non une autorité |
| Le **refus des systèmes** | Aucune conclusion imposée |

L’écriture avance par **digressions** et par ajouts d’édition en édition — les « **allongeails** » —, dans une phrase **souple, imagée, parlée**.

## À retenir
> Montaigne invente un **genre** et une **posture** : l’**examen de soi comme instrument de connaissance de l’homme**.

Et il écrit dans une France **déchirée par les guerres de religion** — d’où le **prix** de sa leçon de **tolérance** et de **mesure**.

## Pour la dissertation et l’oral
Objet d’étude : **la littérature d’idées du XVIe au XVIIIe siècle**. Les *Essais* permettent de définir l’**humanisme** tardif : confiance mesurée dans l’homme, lecture critique des Anciens, **relativisme** face aux autres cultures. À l’oral, appuie-toi sur « Des Cannibales » pour montrer comment Montaigne retourne l’accusation de barbarie contre les Européens.

> Dans l’avis « Au lecteur », il prévient : « c’est ici un livre de bonne foi ».

## La phrase à citer
> « Chaque homme porte la forme entière de l’humaine condition. »`,
          },
          questions: [
            ['Que signifie le mot « essai » chez Montaigne ?', ['Une tentative, une pesée de la pensée', 'Une démonstration achevée', 'Un discours public', 'Un récit de voyage'], 0, '« Je ne peins pas l’être, je peins le passage. »'],
            ['Quelle formule résume sa conception de l’éducation ?', ['« Une tête bien faite plutôt que bien pleine »', '« Apprendre par cœur »', '« Le savoir vaut la vertu »', '« L’école forme le citoyen »'], 0, 'Elle vient du chapitre « De l’institution des enfants ».'],
            ['Comment Montaigne explique-t-il son amitié avec La Boétie ?', ['« Parce que c’était lui, parce que c’était moi »', 'Par la communauté d’intérêts', 'Par la proximité géographique', 'Par une dette morale'], 0, 'La formule est devenue la définition même de l’amitié.'],
            ['Quelle est sa devise ?', ['« Que sais-je ? »', '« Connais-toi toi-même »', '« Rien de trop »', '« Je pense donc je suis »'], 0, 'Le doute y est une discipline, non une paresse.'],
            ['Quel contexte historique éclaire les Essais ?', ['Les guerres de religion', 'La Fronde', 'La Révolution', 'La guerre de Cent Ans'], 0, 'Il donne tout son prix à la leçon de tolérance et de mesure.'],
            ['Montaigne écrit un traité systématique et ordonné.', ['Vrai', 'Faux'], 1, 'Digressions, contradictions, ajouts successifs : la forme dit la méthode.'],
          ],
        },
        {
          titre: 'Éthiopiques, Léopold Sédar Senghor',
          lecon: {
            titre: 'Senghor, 1956 — la négritude en poèmes',
            cours: `## L’auteur et le contexte
**Léopold Sédar Senghor** (1906-2001), né à Joal au Sénégal, est le premier Africain **agrégé de grammaire** (1935). Prisonnier de guerre en 1940, il publie *Chants d’ombre* (1945) et *Hosties noires* (1948), puis l’*Anthologie de la nouvelle poésie nègre et malgache* (1948), préfacée par **Sartre** (« Orphée noir »).

## Le recueil
Publié en **1956** par le poète sénégalais **Léopold Sédar Senghor**.

| Fait | Le détail |
| Sa carrière politique | **Président du Sénégal**, 1960-1980 |
| Une première | **Premier Africain élu à l’Académie française** |
| La clé du recueil | Une postface capitale : « **Comme les lamantins vont boire à la source** », où il **s’explique sur sa poétique** |

## Les thèmes
| Thème | Ce qu’il porte |
| L’**Afrique** | Paysages, **ancêtres**, royaumes anciens, **masques** |
| La **femme noire** | Célébrée comme **terre** et comme **promesse** |
| L’**exil** en France | Le **déchirement entre deux cultures** |
| La **réconciliation** | Annoncée entre l’Afrique et l’Europe |

> « **Chaka** », long poème dramatique sur le **roi zoulou**, en est le **sommet**.

## La forme
| Trait | Son modèle ou son effet |
| **Vers libres amples**, versets longs | Inspirés de **Claudel** et de **Saint-John Perse** |
| Des indications d’**instruments africains** en tête des poèmes | « pour **kôra** », « pour **balafong** » |

> La poésie est faite pour être **dite et accompagnée** — comme la **parole du griot**.

## À retenir
La **négritude**, notion forgée avec **Aimé Césaire** et **Léon-Gontran Damas** dans les années **1930**, désigne la **revendication assumée d’une identité et d’une culture noires**, contre l’**assimilation coloniale**.

| **Senghor** | **Césaire** |
| Plus **lyrique** et **conciliateur** | Plus **révolté** |

## D’autres poèmes du recueil
« **À New York** », pour orchestre de jazz, oppose la ville d’acier et de béton à la vitalité de Harlem ; « **Congo** » célèbre le fleuve comme une femme et une mère.

## Pour la dissertation et l’oral
Objet d’étude : **la poésie du XIXe au XXIe siècle**. Un exemple de poésie **engagée** et **lyrique** à la fois, où le rythme est pensé pour la voix.

## La phrase à citer
> « Femme nue, femme noire, vêtue de ta couleur qui est vie… » (*Chants d’ombre*)`,
          },
          questions: [
            ['Qui est Léopold Sédar Senghor ?', ['Un poète sénégalais, premier président du Sénégal et académicien français', 'Un romancier ivoirien', 'Un dramaturge camerounais', 'Un essayiste haïtien'], 0, 'Il est le premier Africain élu à l’Académie française.'],
            ['Qu’est-ce que la négritude ?', ['La revendication assumée d’une identité et d’une culture noires', 'Un mouvement pictural', 'Une théorie économique', 'Un parti politique sénégalais'], 0, 'Forgée avec Aimé Césaire et Léon-Gontran Damas dans les années 1930.'],
            ['Quelle indication figure souvent en tête des poèmes ?', ['Un instrument africain d’accompagnement, comme la kôra', 'Une date de composition', 'Un lieu de rédaction', 'Une dédicace à un ami'], 0, 'La poésie y est faite pour être dite et accompagnée, comme chez le griot.'],
            ['Quel long poème dramatique est au cœur du recueil ?', ['Chaka, sur le roi zoulou', 'Cahier d’un retour au pays natal', 'Le Bateau ivre', 'Zone'], 0, 'Cahier d’un retour au pays natal est de Césaire.'],
            ['Quelle forme Senghor privilégie-t-il ?', ['Le verset ample, en vers libres', 'Le sonnet', 'L’alexandrin rimé', 'Le haïku'], 0, 'Il s’inspire de Claudel et de Saint-John Perse.'],
            ['La négritude de Senghor est plus révoltée que celle de Césaire.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : Senghor est plus lyrique et conciliateur, Césaire plus révolté.'],
          ],
        },
      ],
    },
  ],
}
