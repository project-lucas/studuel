// Français — PREMIÈRE : le rayon « Fiches de lecture » (4/5).
//
// SUITE DE `francais-fiches-c.mjs`. Même format court, même rayon « fiches »,
// mêmes titres portant l'auteur (ce qui évite la collision avec les fiches du
// rayon Programme, `chapters` étant UNIQUE(subject_id, level, title)).
//
// LES POSITIONS REPRENNENT À 152 : les modules A, B et C occupent 100 à 255. L'ordre
// alphabétique de la maquette est ainsi celui de la page, qui trie par
// `position`.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, à exécuter AVANT.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — FICHES DE LECTURE (4/5) : Le Voyage d’Urien → Mémoires d’Hadrien',

  motif: `QUATRIÈME TRANCHE DES FICHES DE LECTURE (voir la 261 pour le détail du
rayon et de son format). Cinquante-deux œuvres, du Voyage d’Urien aux Mémoires d’Hadrien.

Les positions reprennent à 256, derrière les 156 fiches des 261, 262 et 263 : l'ordre
alphabétique de la maquette est celui de la page, qui trie par position.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD (colonnes theme et discipline, ménage
des composites). Cette migration n'écrit que des fiches neuves.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'fiches',
      axe: 'Fiches de lecture',
      positionDepart: 256,
      chapitres: [
        {
          titre: 'Le Voyage d’Urien, André Gide',
          lecon: {
            titre: 'Gide, 1893 — un voyage qui n’a pas eu lieu',
            cours: `## L’œuvre
**Premier livre publié sous son nom** par Gide, à **vingt-quatre ans**, en pleine période **symboliste**.

| Partie du voyage | Ce qu’elle est |
| L’**Océan pathétique** | Les escales offrent **tentations et plaisirs** |
| La **mer des Sargasses** | **Immobile et morne** : l’équipage **s’enlise** |
| La **mer glaciale** | **Blanche et pure** : on progresse vers un **pôle mystérieux** |

| Le dénouement | Ce qu’il révèle |
| Une **stèle** portant une inscription | Et un **feuillet** |
| Ce qu’il apprend | **Rien de tout cela n’a eu lieu** : le voyage a été **rêvé sur place** |

## À retenir
Un **récit symboliste** : paysages **allégoriques**, quête spirituelle, prose **musicale et volontairement irréelle**.

| Thème installé ici | Ce qu’il deviendra |
| La tentation du **renoncement** | *La Porte étroite* |
| L’**ambiguïté du désir** | *L’Immoraliste* |

> Gide **ironisera plus tard** sur ce livre de jeunesse. Il est pourtant **utile pour comprendre d’où il vient** : le symbolisme, la revue *La Conque*, les **mardis de Mallarmé** — **avant** *Les Nourritures terrestres* et le tournant de **1897**.

> « Nous n’avions pas quitté la chambre où nous rêvions. »`,
          },
          questions: [
            ['À quel mouvement ce livre se rattache-t-il ?', ['Le symbolisme', 'Le naturalisme', 'Le surréalisme', 'Le classicisme'], 0, 'Gide fréquentait alors les mardis de Mallarmé.'],
            ['Quelles sont les trois étapes du voyage ?', ['L’Océan pathétique, la mer des Sargasses, la mer glaciale', 'La Méditerranée, l’Atlantique, le Pacifique', 'L’Afrique, l’Asie, l’Amérique', 'Le fleuve, la mer, le désert'], 0, 'Chaque mer correspond à une épreuve spirituelle.'],
            ['Que découvre-t-on à la fin du récit ?', ['Que le voyage a été rêvé et n’a pas eu lieu', 'Que le pôle est habité', 'Qu’Urien est mort en mer', 'Que les compagnons se sont trahis'], 0, 'Le renversement final annule tout ce qui précède.'],
            ['Quel âge a Gide au moment de la publication ?', ['Vingt-quatre ans', 'Trente-cinq ans', 'Dix-huit ans', 'Quarante ans'], 0, 'C’est son premier livre publié sous son nom, en 1893.'],
            ['Quels thèmes gidiens ce livre annonce-t-il ?', ['La tentation du renoncement et l’ambiguïté du désir', 'La critique du colonialisme', 'Le roman policier', 'La satire sociale'], 0, 'Ils traverseront toute son œuvre.'],
            ['Gide considérait ce livre comme son chef-d’œuvre.', ['Vrai', 'Faux'], 1, 'Il en a plus tard ironisé, comme d’un livre de jeunesse.'],
          ],
        },
        {
          titre: 'Les Amours Jaunes, Tristan Corbière',
          lecon: {
            titre: 'Corbière, 1873 — le poète qui se moque de lui-même',
            cours: `## Le recueil
| Fait | Le détail |
| L’auteur | **Tristan Corbière** (1845-1875) |
| La publication | **À compte d’auteur**, en **1873** |
| Son accueil | **Totalement inaperçu** : quatre-vingts pages, quelques exemplaires vendus |
| Sa mort | À **trente ans** |
| Son sauvetage | **Verlaine** l’inscrit, dix ans plus tard, en tête des *Poètes maudits* |

## Le ton
« **Jaune** » comme le **rire jaune** : Corbière écrit des poèmes d’amour, de mer et de mort — **et les sabote lui-même**.

| Son arme | Son effet |
| L’**ironie**, l’**argot**, les jeux de mots | Le poème **se retourne contre lui-même** |
| Les **tirets** et les **ruptures de ton** | Rien ne s’installe |
| L’**autoportrait** | Laid, malade, raté : « Le Crapaud », « Épitaphe », « Le Poète contumace » |

Les poèmes **bretons et marins** — « La Rapsode foraine », « Le Bossu Bitor », « Matelots » — donnent une voix **rude et concrète**, très éloignée du lyrisme parnassien.

## À retenir
Une œuvre **longtemps illisible** pour ses contemporains, **devenue majeure au XXe siècle**.

> **Laforgue**, puis les **surréalistes**, puis **T. S. Eliot** y ont reconnu une modernité : **la voix qui refuse la pose du poète**.

> « Ne me tuez pas, je suis déjà mort. »`,
          },
          questions: [
            ['Combien de recueils Corbière a-t-il publiés ?', ['Un seul, Les Amours jaunes', 'Trois', 'Une dizaine', 'Aucun de son vivant'], 0, 'Publié à compte d’auteur en 1873, il passa inaperçu.'],
            ['Qui a sauvé Corbière de l’oubli ?', ['Verlaine, dans Les Poètes maudits', 'Baudelaire', 'Mallarmé', 'Hugo'], 0, 'Il l’y place en tête, dix ans après la publication.'],
            ['Que signifie le « jaune » du titre ?', ['Le rire jaune : l’ironie tournée contre soi', 'La couleur des blés', 'La maladie du poète', 'Le jaune des vieux papiers'], 0, 'Corbière sabote lui-même ses propres élans.'],
            ['Quels univers nourrissent le recueil ?', ['La Bretagne, la mer et les marins', 'Paris et les salons', 'L’Italie', 'Les colonies'], 0, '« La Rapsode foraine » et les poèmes marins en témoignent.'],
            ['Comment le poète se peint-il ?', ['Laid, malade et raté', 'Héroïque', 'Prophète', 'Dandy triomphant'], 0, '« Le Crapaud » et « Épitaphe » sont exemplaires.'],
            ['Corbière a connu la gloire de son vivant.', ['Vrai', 'Faux'], 1, 'Il est mort à trente ans, totalement ignoré.'],
          ],
        },
        {
          titre: 'Les Amours, Pierre de Ronsard',
          lecon: {
            titre: 'Ronsard, 1552-1578 — trois femmes, trois manières',
            cours: `## Les trois cycles
| Cycle | Sa date | Sa manière |
| **Les Amours de Cassandre** | **1552** | Sonnets **pétrarquistes** en **décasyllabes** : amour **idéal et inaccessible**, images précieuses, **mythologie abondante** |
| **La Continuation** et **Les Amours de Marie** | **1555-1556** | Le « **beau style bas** » : **plus simple et plus sensuel**, pour une jeune paysanne d’Anjou |
| **Les Sonnets pour Hélène** | **1578** | Le poète **vieillissant** s’adresse à **Hélène de Surgères**, dame d’honneur de Catherine de Médicis |

## Les poèmes à connaître
| Poème | Où il se trouve |
| « Mignonne, allons voir si la rose… » | En réalité tiré des *Odes* |
| « Comme on voit sur la branche… » | La **déploration après la mort de Marie** |
| « **Quand vous serez bien vieille…** » | Le cycle **d’Hélène** |

## À retenir
| Apport de Ronsard | Le détail |
| Il **installe le sonnet** en français | La forme reine du siècle |
| Il pratique l’**imitation** des Anciens et de **Pétrarque** | Comme le prônait **Du Bellay** |
| Il donne à la langue une **souplesse nouvelle** | Le programme de la **Pléiade** |

> Thème constant : le *carpe diem* — la **fuite du temps**, la **beauté qui se fane**, et la **poésie comme seule immortalité**.

> « Cueillez dès aujourd’hui les roses de la vie. »`,
          },
          questions: [
            ['Quel groupe Ronsard dirige-t-il ?', ['La Pléiade', 'Le Parnasse', 'Les Grands Rhétoriqueurs', 'Le Cénacle'], 0, 'Avec Du Bellay, Baïf, Jodelle et leurs compagnons.'],
            ['Quelle forme Ronsard installe-t-il en français ?', ['Le sonnet', 'Le rondeau', 'La ballade', 'Le vers libre'], 0, 'Sur le modèle italien de Pétrarque.'],
            ['À qui s’adressent les sonnets de 1578 ?', ['À Hélène de Surgères', 'À Cassandre Salviati', 'À Marie Dupin', 'À Catherine de Médicis'], 0, 'C’est le cycle du « Quand vous serez bien vieille… ».'],
            ['Quel thème traverse tous les cycles ?', ['Le carpe diem et la fuite du temps', 'La guerre', 'La foi religieuse', 'Le voyage'], 0, 'La beauté se fane, la poésie seule dure.'],
            ['Quelle est la particularité des Amours de Marie ?', ['Un « beau style bas », plus simple et plus sensuel', 'Un style plus savant', 'L’usage du latin', 'L’absence de sonnets'], 0, 'Ronsard s’y éloigne du pétrarquisme des débuts.'],
            ['Ronsard écrit ses trois cycles à la même période de sa vie.', ['Vrai', 'Faux'], 1, 'Ils s’étalent sur plus de vingt-cinq ans, de 1552 à 1578.'],
          ],
        },
        {
          titre: 'Les Aventures de Télémaque, Fénelon',
          lecon: {
            titre: 'Fénelon, 1699 — un roman pour éduquer un futur roi',
            cours: `## L’œuvre
Écrit pour le **duc de Bourgogne**, **petit-fils de Louis XIV**, dont Fénelon était le **précepteur**.

| Élément | Ce qu’il est |
| **Télémaque**, fils d’Ulysse | Il part **à la recherche de son père** |
| **Mentor**, son guide | En réalité la déesse **Minerve** |
| Le voyage | Une **éducation** |

| Étape | Ce qu’elle enseigne |
| **Chypre** | La **tentation des plaisirs** |
| L’île de **Calypso** | L’amour et le renoncement |
| La guerre en **Italie** | Le métier des armes |
| La **Bétique** | Une société **pastorale**, **sans luxe ni propriété** |
| **Salente** | Mentor la **réforme sous les yeux du lecteur** : moins de **commerce de luxe**, plus d’**agriculture**, une **cour simplifiée** |

## À retenir
Publié **sans l’accord de l’auteur** en **1699**.

> Le livre fut lu comme une **critique directe du règne de Louis XIV** — la guerre, le luxe, l’orgueil, les courtisans — et **coûta à Fénelon la disgrâce définitive**.

| Sa postérité | Le détail |
| **Immense succès européen** au XVIIIe siècle | L’un des **livres les plus lus** des Lumières |
| Une **matrice** | Du **roman d’éducation** et de la réflexion politique sur le **bon gouvernement** |

> « Un roi n’est roi que pour ceux qu’il gouverne. »`,
          },
          questions: [
            ['Pour qui Fénelon a-t-il écrit ce livre ?', ['Le duc de Bourgogne, petit-fils de Louis XIV', 'Louis XIV lui-même', 'Le Régent', 'Les élèves d’un collège'], 0, 'Fénelon était son précepteur.'],
            ['Qui accompagne Télémaque ?', ['Mentor, qui est en réalité Minerve', 'Ulysse', 'Calypso', 'Nestor'], 0, 'Le nom « mentor » est devenu un nom commun grâce à ce livre.'],
            ['Que sont la Bétique et Salente ?', ['Deux États modèles décrits comme exemples politiques', 'Deux batailles', 'Deux personnages féminins', 'Deux navires'], 0, 'Mentor y réforme le gouvernement sous les yeux du lecteur.'],
            ['Comment le livre a-t-il été reçu à la cour ?', ['Comme une critique du règne de Louis XIV, ce qui valut la disgrâce à Fénelon', 'Comme un hommage au roi', 'Avec indifférence', 'Comme un simple livre pour enfants'], 0, 'Guerre, luxe et orgueil y sont visés.'],
            ['Quel genre le livre contribue-t-il à fonder ?', ['Le roman d’éducation', 'Le roman policier', 'Le roman épistolaire', 'Le conte fantastique'], 0, 'Il fut l’un des livres les plus lus du XVIIIe siècle.'],
            ['Fénelon a lui-même autorisé la publication.', ['Vrai', 'Faux'], 1, 'Le livre a paru sans son accord, en 1699.'],
          ],
        },
        {
          titre: 'Les Bonnes, Jean Genet',
          lecon: {
            titre: 'Genet, 1947 — la cérémonie des servantes',
            cours: `## La pièce
Un acte. Deux sœurs, **Claire** et **Solange**, servantes, profitent de l’absence de **Madame** pour jouer un **jeu rituel**.

| La cérémonie | Comment elle fonctionne |
| L’une joue **Madame**, l’autre **la bonne** | Elle va **toujours jusqu’au bord du meurtre** |
| Elle n’aboutit jamais | **Le réveil sonne** |

| L’engrenage | Ce qui se passe |
| Elles ont **dénoncé Monsieur** par des **lettres anonymes** | **Il est libéré** — la peur d’être découvertes précipite tout |
| Elles préparent un **tilleul empoisonné** pour Madame | **Elle ne le boit pas** |
| La dernière cérémonie | **Claire, jouant Madame, boit le tilleul et meurt** |
| La fin | **Solange reste seule** — avec son **crime enfin réel** |

## À retenir
Inspirée de l’affaire des **sœurs Papin** (**1933**).

| Ce que la pièce n’est pas | Ce qu’elle est |
| Un **fait divers mis en scène** | Une **cérémonie** |
| — | Genet exige des **rôles**, des **masques**, du **théâtre dans le théâtre** |

Thèmes : la **domination**, la **haine et l’amour mêlés**, l’**identité comme rôle imposé**.

> Genet, **orphelin et voleur devenu écrivain**, écrit une **langue somptueuse pour dire les humiliés**.

> « Il faut que la cérémonie s’achève. »`,
          },
          questions: [
            ['Que font Claire et Solange en l’absence de Madame ?', ['Elles jouent une cérémonie où l’une prend le rôle de Madame', 'Elles fouillent la maison', 'Elles écrivent des lettres', 'Elles reçoivent des amis'], 0, 'Le jeu va toujours jusqu’au bord du meurtre.'],
            ['Qu’ont fait les deux sœurs avant le début de la pièce ?', ['Elles ont dénoncé Monsieur par des lettres anonymes', 'Elles ont volé des bijoux', 'Elles ont incendié la maison', 'Elles ont fui'], 0, 'Sa libération précipite la catastrophe.'],
            ['Comment la pièce se termine-t-elle ?', ['Claire, jouant Madame, boit le tilleul empoisonné et meurt', 'Madame boit le poison', 'Les sœurs sont arrêtées', 'Rien ne se passe'], 0, 'Le crime devient enfin réel, à l’intérieur du jeu.'],
            ['De quel fait divers la pièce s’inspire-t-elle ?', ['L’affaire des sœurs Papin, en 1933', 'L’affaire Dreyfus', 'L’affaire Landru', 'Aucun fait réel'], 0, 'Genet en fait une cérémonie, non une reconstitution.'],
            ['Quel procédé théâtral structure la pièce ?', ['Le théâtre dans le théâtre : des rôles joués par des personnages', 'Le monologue continu', 'Le chœur antique', 'La narration en voix off'], 0, 'Genet exige masques et rôles, contre le réalisme.'],
            ['Genet écrit une langue volontairement pauvre pour ses personnages humbles.', ['Vrai', 'Faux'], 1, 'Il écrit au contraire une langue somptueuse pour dire les humiliés.'],
          ],
        },
        {
          titre: 'Les Burgraves, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1843 — l’échec qui ferme une époque',
            cours: `## La pièce
Drame en **trois parties et en vers**, créé en **1843**. Dans un **burg des bords du Rhin**, au XIIIe siècle.

| Personnage | Qui il est |
| **Job**, centenaire | Il cache un crime : **il a jadis frappé son frère Donato** |
| Trois générations de **burgraves** | Des **seigneurs brigands**, sous le même toit |
| Un **mendiant mystérieux** | Il se révèle être l’**empereur Frédéric Barberousse**, revenu **pour juger les siens** |
| **Guanhumara**, l’esclave | **Empoisonneuse** : elle prépare une vengeance **vieille de cinquante ans** |

Le **pardon final** referme l’épopée familiale.

## À retenir
La pièce est un **échec retentissant** : le public boude, la critique se moque — et la **même saison** voit le triomphe de la *Lucrèce* de **Ponsard**, **néoclassique**.

| Ce que cet échec marque | Le détail |
| La **fin du drame romantique** au théâtre | C’est la lecture traditionnelle |
| La fin du théâtre de Hugo | Il n’écrira plus pour la scène — hormis le *Théâtre en liberté*, **non joué** |

> **Deux mois plus tard**, sa fille **Léopoldine se noyait à Villequier**.

> Un drame grandiose, écrasé par son propre gigantisme.`,
          },
          questions: [
            ['Quand la pièce a-t-elle été créée ?', ['En 1843', 'En 1830', 'En 1827', 'En 1862'], 0, 'La même année que la mort de Léopoldine, quelques mois plus tard.'],
            ['Qui sont les burgraves ?', ['Des seigneurs brigands des bords du Rhin', 'Des moines allemands', 'Des marchands hanséatiques', 'Des chevaliers croisés'], 0, 'Trois générations vivent sous le même toit.'],
            ['Qui se révèle être le mendiant mystérieux ?', ['L’empereur Frédéric Barberousse', 'Le frère de Job', 'Un envoyé du pape', 'Un burgrave rival'], 0, 'Il revient pour juger les siens.'],
            ['Quel événement théâtral cet échec marque-t-il ?', ['La fin du drame romantique à la scène', 'Le début du théâtre symboliste', 'La naissance du vaudeville', 'La fermeture des théâtres'], 0, 'Le triomphe simultané de Lucrèce, néoclassique, en est le symbole.'],
            ['Que fait Hugo après cet échec ?', ['Il cesse d’écrire pour la scène', 'Il écrit trois nouvelles pièces', 'Il fonde un théâtre', 'Il traduit Shakespeare'], 0, 'Le Théâtre en liberté ne sera pas destiné à la représentation.'],
            ['La pièce fut un triomphe public.', ['Vrai', 'Faux'], 1, 'Ce fut un échec retentissant, resté célèbre comme tel.'],
          ],
        },
        {
          titre: 'Les Cahiers d’André Walter, André Gide',
          lecon: {
            titre: 'Gide, 1891 — le premier livre, anonyme',
            cours: `## L’œuvre
Publié **anonymement** à **vingt et un ans**. Le livre se présente comme les **cahiers posthumes** d’un jeune homme, **André Walter**, **mort fou** : le *Cahier blanc* et le *Cahier noir*.

| Étape | Ce qui se passe |
| L’amour | Walter aime sa cousine **Emmanuèle** |
| L’interdit | Sa **mère mourante** lui a fait **promettre de ne pas l’épouser** |
| Le choix | Il opte pour l’amour **pur** : il **refuse le corps** |
| L’enfermement | L’écriture, la lecture de la **Bible**, la **mystique** |
| La fin | Il **sombre peu à peu dans le délire** |

## À retenir
Livre de jeunesse — mais **matrice de toute l’œuvre**.

| Ce qui s’y installe | Où on le retrouvera |
| La tension entre le **corps** et l’**esprit** | *L’Immoraliste*, *La Porte étroite* |
| L’**exigence protestante** | Partout |
| Le **journal** comme forme | *Les Faux-Monnayeurs*, le *Journal* |
| L’**écriture comme sublimation** | Le fil de sa vie |

> La cousine Emmanuèle est **Madeleine Rondeaux**, que Gide **épousera réellement en 1895** — et avec qui il vivra un **mariage blanc**.

Style **symboliste**, très marqué par la période, que Gide jugera plus tard **avec sévérité**.

> On y voit un écrivain de vingt ans se donner un programme dont il mettra cinquante ans à sortir.`,
          },
          questions: [
            ['Comment ce premier livre a-t-il été publié ?', ['Anonymement, en 1891', 'Sous le nom de Gide', 'Sous un pseudonyme féminin', 'À titre posthume'], 0, 'Gide avait vingt et un ans.'],
            ['Quelle forme prend le livre ?', ['Les cahiers posthumes d’un jeune homme mort fou', 'Un roman à la troisième personne', 'Un recueil de poèmes', 'Une pièce de théâtre'], 0, 'Deux parties : le Cahier blanc et le Cahier noir.'],
            ['Pourquoi Walter renonce-t-il à épouser Emmanuèle ?', ['Sa mère mourante le lui a fait promettre', 'Elle en aime un autre', 'Il est trop pauvre', 'Elle entre au couvent'], 0, 'Il choisit alors l’amour pur et refuse le corps.'],
            ['Qui se cache derrière le personnage d’Emmanuèle ?', ['Madeleine Rondeaux, cousine que Gide épousera', 'Une amie d’enfance imaginaire', 'Sa mère', 'Une actrice parisienne'], 0, 'Leur mariage, en 1895, restera blanc.'],
            ['Quelle tension fondatrice le livre installe-t-il ?', ['Le conflit entre le corps et l’esprit', 'L’opposition ville-campagne', 'Le conflit des générations', 'La lutte des classes'], 0, 'Elle traversera toute l’œuvre de Gide.'],
            ['Gide a toujours défendu ce livre comme une réussite.', ['Vrai', 'Faux'], 1, 'Il le jugera plus tard avec sévérité, comme un livre trop marqué par son époque.'],
          ],
        },
        {
          titre: 'Les Cahiers de Douai, Arthur Rimbaud',
          lecon: {
            titre: 'Rimbaud, 1870 — vingt-deux poèmes de fugue',
            cours: `## Le recueil
**Vingt-deux poèmes** recopiés **en deux liasses** par Rimbaud, âgé de **quinze et seize ans**, chez **Paul Demeny**, à **Douai**, à l’automne **1870**.

> Le titre est **posthume** : **ce n’est pas un recueil composé par son auteur**.

## Trois veines
| Veine | Ses textes | Ce qu’elle fait |
| La **fugue et la sensation** | « Sensation », « Ma Bohème », « Au Cabaret-Vert », « Roman » | Le corps **marche, mange, regarde** ; la nature **remplace la maison** |
| La **satire politique** | « Le Forgeron », « Rages de Césars », « Le Mal », « Le Dormeur du val » | Écrits pendant la **guerre franco-prussienne** et la **chute du Second Empire** |
| La **provocation** | « Vénus Anadyomène », « À la Musique », « Les Reparties de Nina » | Le **sonnet, forme noble**, sert à dire **le trivial et le laid** |

## À retenir
Parcours associé au bac : **émancipations créatrices**.

| L’émancipation est **triple** | Contre quoi |
| De l’**adolescent** | Sa famille |
| Du **citoyen** | L’ordre impérial |
| Du **poète** | Les formes héritées |

> Rimbaud **maîtrise le vers classique ET le maltraite** : enjambements violents, rejets, **mots familiers dans un moule noble**. « Le Dormeur du val » en est le modèle.

> « Il a deux trous rouges au côté droit. »`,
          },
          questions: [
            ['Combien de poèmes compte l’ensemble ?', ['Vingt-deux', 'Douze', 'Cinquante', 'Trente'], 0, 'Recopiés en deux liasses chez Paul Demeny.'],
            ['Quel âge a Rimbaud à l’automne 1870 ?', ['Quinze et seize ans', 'Dix-huit ans', 'Vingt ans', 'Quatorze ans'], 0, 'C’est un argument central du parcours « émancipations créatrices ».'],
            ['Quel événement historique nourrit les poèmes satiriques ?', ['La guerre franco-prussienne et la chute du Second Empire', 'La Commune de Paris', 'La Révolution de 1848', 'La guerre de Crimée'], 0, '« Rages de Césars » et « Le Mal » en sont issus.'],
            ['Quelle est la chute du « Dormeur du val » ?', ['Le soldat est mort : « deux trous rouges au côté droit »', 'Le soldat se réveille', 'La nature se fane', 'Le poète s’endort à son tour'], 0, 'Treize vers de nature riante préparent la révélation.'],
            ['Le titre du recueil a-t-il été choisi par Rimbaud ?', ['Non, il est posthume', 'Oui, dès 1870', 'Oui, dans une lettre à Demeny', 'Il a été choisi par Verlaine avec son accord'], 0, 'Ce n’est pas un recueil composé par son auteur.'],
            ['Rimbaud rejette la forme du sonnet dans ces poèmes.', ['Vrai', 'Faux'], 1, 'Il l’emploie et la maltraite de l’intérieur, par les enjambements et le vocabulaire.'],
          ],
        },
        {
          titre: 'Les Caractères, Jean de La Bruyère',
          lecon: {
            titre: 'La Bruyère, 1688 — la société en fragments',
            cours: `## L’œuvre
*Les Caractères ou les Mœurs de ce siècle*, publiés en **1688**, augmentés jusqu’en **1696**.

> L’ouvrage se présente d’abord comme une **traduction de Théophraste** — avant de devenir une œuvre **autonome** de plus de **mille remarques** : maximes, portraits, dialogues, réflexions.

## Les livres principaux
| Livre | Ce qu’il vise |
| « De la société et de la conversation » | Les fâcheux, les vaniteux du langage |
| « **Des biens de fortune** » | Les portraits de **Giton** le riche et de **Phédon** le pauvre |
| « De la ville » | La bourgeoisie qui **singe la cour** |
| « **De la cour** » | **Le sommet du livre** |
| « Des grands », « Du souverain » | Le pouvoir |
| « De l’homme », « Des femmes », « Des ouvrages de l’esprit » | Le reste du monde |

## La méthode
> La Bruyère **montre au lieu de démontrer** : un **geste**, un **habit**, une **façon de parler** suffisent à faire un caractère.

| Sa protection | Son efficacité |
| Des **noms grecs** — Ménalque le distrait, Giton, Phédon | **La cour s’y reconnaissait** : des « **clés** » circulaient |

Style de la **brièveté frappante**, art de la **chute**.

## À retenir
Un moraliste **classique dans la forme**, **presque sociologue dans le regard** : il décrit une société où **l’argent commence à concurrencer la naissance**.

> Sa page sur les **paysans**, « animaux farouches » **qui se révèlent des hommes**, est l’une des **plus fortes du siècle**.

> « Tout est dit, et l’on vient trop tard. »`,
          },
          questions: [
            ['Comment l’ouvrage se présente-t-il d’abord ?', ['Comme une traduction de Théophraste', 'Comme un roman', 'Comme un traité de morale', 'Comme un recueil de lettres'], 0, 'Les remarques personnelles finiront par occuper tout le livre.'],
            ['Que montrent les portraits de Giton et Phédon ?', ['Le corps et les manières trahissent la condition sociale', 'La richesse rend généreux', 'La pauvreté est méritée', 'Les nobles sont ridicules'], 0, 'Giton occupe l’espace, Phédon s’efface.'],
            ['Quel livre est considéré comme le sommet de l’œuvre ?', ['« De la cour »', '« Des femmes »', '« De l’homme »', '« Des ouvrages de l’esprit »'], 0, '« L’on s’élève à la cour, mais on n’y monte pas. »'],
            ['Pourquoi les personnages portent-ils des noms grecs ?', ['Pour protéger l’auteur tout en laissant reconnaître les modèles', 'Par goût de l’Antiquité', 'Parce que le livre est traduit du grec', 'Pour imiter Homère'], 0, 'Des « clés » circulaient à la cour.'],
            ['Quelle phrase ouvre le livre ?', ['« Tout est dit, et l’on vient trop tard »', '« Je ne peins pas l’être »', '« Le cœur a ses raisons »', '« L’homme est un roseau pensant »'], 0, 'Elle justifie le choix du fragment.'],
            ['La Bruyère procède par démonstrations suivies.', ['Vrai', 'Faux'], 1, 'Il montre plutôt qu’il ne démontre : un geste suffit à faire un caractère.'],
          ],
        },
        {
          titre: 'Les Caves du Vatican, André Gide',
          lecon: {
            titre: 'Gide, 1914 — la sotie et l’acte gratuit',
            cours: `## L’histoire
Gide appelle ce livre une **sotie** : une **farce satirique**.

| L’escroquerie | Le détail |
| Une bande menée par **Protos** | Elle répand une **rumeur** |
| La rumeur | Le **pape** serait **séquestré dans les caves du Vatican**, et un **faux pape** régnerait |
| Le but | Réunir des **fonds** pour le délivrer |

| Personnage | Ce qu’il est |
| **Anthime Armand-Dubois** | Savant **athée**, **converti après un miracle** |
| **Julius de Baraglioul** | Le romancier |
| **Amédée Fleurissoire** | Juge **naïf** : il part **héroïquement délivrer le pape** |
| **Lafcadio Wluiki** | Jeune **bâtard élégant et libre** |

> Dans un train, **sans mobile**, **par pure disponibilité**, Lafcadio **pousse Fleurissoire par la portière** : c’est l’**acte gratuit**.

## À retenir
| Notion | Sa fortune |
| L’**acte gratuit** — un acte **sans motif**, donc **preuve supposée de liberté** | Les **surréalistes** l’ont adorée |
| Sa relativisation | **Gide lui-même** : Lafcadio est **rattrapé par la logique et par le remords** |

Ton **ironique**, personnages de comédie, intrigue de **vaudeville** : la « sotie » se moque **autant de la religion que de la crédulité et du romanesque**.

> « Un crime immotivé, quel embarras pour la police. »`,
          },
          questions: [
            ['Comment Gide appelle-t-il ce livre ?', ['Une sotie, farce satirique', 'Un récit', 'Un roman', 'Un essai'], 0, 'Il réservait le mot « roman » aux Faux-Monnayeurs.'],
            ['Quelle escroquerie est au centre du livre ?', ['Faire croire que le pape est séquestré pour lever des fonds', 'Un faux héritage', 'La vente d’une fausse relique', 'Un trafic de titres'], 0, 'Protos mène la bande.'],
            ['Qu’est-ce que l’acte gratuit ?', ['Un acte sans motif, censé prouver la liberté', 'Un don charitable', 'Un crime prémédité', 'Un pari perdu'], 0, 'Lafcadio pousse Fleurissoire hors du train sans raison.'],
            ['Qui part à Rome délivrer le pape ?', ['Amédée Fleurissoire', 'Julius de Baraglioul', 'Anthime Armand-Dubois', 'Protos'], 0, 'Sa naïveté est le moteur comique du livre.'],
            ['Quel mouvement littéraire a admiré la notion d’acte gratuit ?', ['Le surréalisme', 'Le naturalisme', 'Le Parnasse', 'Le classicisme'], 0, 'Gide lui-même l’a ensuite relativisée.'],
            ['Lafcadio échappe à toute conséquence après son geste.', ['Vrai', 'Faux'], 1, 'Il est rattrapé par la logique des faits et par le remords.'],
          ],
        },
        {
          titre: 'Les Chaises, Eugène Ionesco',
          lecon: {
            titre: 'Ionesco, 1952 — une salle pleine de personne',
            cours: `## La pièce
Un **Vieux** de quatre-vingt-quinze ans et une **Vieille** de quatre-vingt-quatorze vivent **seuls** dans une maison **entourée d’eau**.

| Étape | Ce qui se passe |
| Le projet | Le Vieux a un **message capital** à délivrer à l’humanité : il a **convoqué une assemblée** |
| Les invités | **Ils sont invisibles** |
| L’accueil | Le couple leur parle et leur apporte des **chaises** — **de plus en plus vite**, jusqu’à ce que **la scène soit entièrement encombrée** |
| Le sommet | **L’Empereur** lui-même est annoncé |
| L’Orateur | Chargé de **transmettre le message** ; rassurés, **les deux vieux se jettent par la fenêtre** |
| La chute | L’Orateur, **seul devant la foule vide**, est **sourd-muet** : gutturales, **lettres sans signification** au tableau, salut — et sortie |

## À retenir
Ionesco sous-titre la pièce « **farce tragique** ».

| Thème | Comment il est porté |
| Le **langage impuissant** | L’Orateur **sourd-muet** |
| La **prolifération** des objets | **Les chaises envahissent l’espace comme les mots envahissent le vide** |

L’une des œuvres **majeures** du théâtre de l’absurde, **souvent montée**.

> « Le message ! Le message ! »`,
          },
          questions: [
            ['Qui sont les invités du couple de vieillards ?', ['Des invités invisibles', 'Des voisins du village', 'Des journalistes', 'Leur famille'], 0, 'Le couple leur parle et leur apporte des chaises.'],
            ['Qu’est-ce qui envahit progressivement la scène ?', ['Les chaises', 'L’eau', 'Les meubles du salon', 'Des livres'], 0, 'La prolifération des objets est un thème constant chez Ionesco.'],
            ['Que doit faire l’Orateur ?', ['Transmettre le message capital du Vieux', 'Diriger la cérémonie', 'Juger le couple', 'Annoncer l’Empereur'], 0, 'Les vieux se jettent par la fenêtre, rassurés.'],
            ['Quelle est la révélation finale ?', ['L’Orateur est sourd-muet et ne peut rien transmettre', 'Le message est écrit dans un livre', 'Les invités deviennent visibles', 'L’Empereur parle à sa place'], 0, 'Il trace au tableau des lettres sans signification.'],
            ['Comment Ionesco sous-titre-t-il la pièce ?', ['« Farce tragique »', '« Comédie noire »', '« Drame lyrique »', '« Anti-pièce »'], 0, '« Anti-pièce » est le sous-titre de La Cantatrice chauve.'],
            ['La pièce affirme la puissance du langage à transmettre un sens.', ['Vrai', 'Faux'], 1, 'Elle porte à son sommet le thème du langage impuissant.'],
          ],
        },
        {
          titre: 'Les Châtiments, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1853 — la poésie comme arme de combat',
            cours: `## Le recueil
Écrit **en exil**, publié à **Bruxelles en 1853** — et **interdit en France**.

| Cible | Le détail |
| **Louis-Napoléon Bonaparte** | Auteur du **coup d’État du 2 décembre 1851** |
| Le surnom que Hugo lui donne | « **Napoléon le Petit** » |

## Sept livres aux titres ironiques
| Titre | Ce qu’il moque |
| « La société est sauvée » | La propagande du régime |
| « L’ordre est rétabli » | La répression |
| « La famille est restaurée » | La morale officielle |
| « La religion est glorifiée » | Le cléricalisme |
| « L’autorité est sacrée » | Le pouvoir personnel |
| « La stabilité est assurée » | L’immobilisme |
| « Les sauveurs se sauveront » | La chute annoncée |

Un dernier poème, « **Lux** », annonce l’**avenir lumineux**.

## Les poèmes célèbres
| Poème | Ce qu’il montre |
| « **Souvenir de la nuit du 4** » | Un **enfant tué par les balles**, sa **grand-mère qui le déshabille** |
| « **L’expiation** » | Waterloo, la Bérézina, Sainte-Hélène — **l’ombre du grand Napoléon écrasant le petit** |
| « Ô soldats de l’an deux ! » | L’épopée révolutionnaire |
| « Chanson » | Des **refrains populaires** |

## À retenir
Un recueil **polémique total** : satire, invective, ironie, épopée, chanson.

> Hugo **change de registre à chaque poème** et invente une poésie **d’action**, faite pour **circuler clandestinement**.

Il **refusera l’amnistie de 1859** — « quand la liberté rentrera, je rentrerai » — et **restera dix-neuf ans en exil**.

> « Et s’il n’en reste qu’un, je serai celui-là. »`,
          },
          questions: [
            ['Contre qui le recueil est-il dirigé ?', ['Louis-Napoléon Bonaparte, après le coup d’État de 1851', 'Louis-Philippe', 'Charles X', 'Thiers'], 0, 'Hugo l’appelle « Napoléon le Petit ».'],
            ['Où le recueil a-t-il été publié ?', ['À Bruxelles, en 1853, et interdit en France', 'À Paris', 'À Londres, en 1860', 'À Genève, en 1870'], 0, 'Il circulait clandestinement en France.'],
            ['Quel poème raconte la mort d’un enfant lors du coup d’État ?', ['Souvenir de la nuit du 4', 'L’expiation', 'Lux', 'Chanson'], 0, 'La grand-mère y déshabille l’enfant tué par les balles.'],
            ['Que raconte « L’expiation » ?', ['Waterloo, la Bérézina et Sainte-Hélène, pour écraser le neveu par l’oncle', 'La mort de Léopoldine', 'L’exil de Hugo', 'Le sacre de Napoléon III'], 0, 'L’ombre du grand Napoléon accable le petit.'],
            ['Comment les titres des sept livres sont-ils construits ?', ['Ils reprennent ironiquement les slogans du régime', 'Ils suivent l’ordre chronologique', 'Ils portent des noms de villes', 'Ils sont numérotés seulement'], 0, '« L’ordre est rétabli », « La société est sauvée »…'],
            ['Hugo a accepté l’amnistie de 1859.', ['Vrai', 'Faux'], 1, '« Quand la liberté rentrera, je rentrerai » : il restera dix-neuf ans en exil.'],
          ],
        },
        {
          titre: 'Les Complaintes, Jules Laforgue',
          lecon: {
            titre: 'Laforgue, 1885 — l’ironie contre le lyrisme',
            cours: `## Le recueil
Publié **à compte d’auteur** en **1885** par un poète de **vingt-cinq ans**, **mort de tuberculose deux ans plus tard**.

| La forme | Ce qu’elle emprunte |
| **Cinquante « complaintes »** | La **chanson populaire** — la complainte de rue, avec **refrains et couplets** |
| Ce qu’elle dit | L’**ennui**, la solitude, la **lune**, la mort, l’amour impossible |

Titres : « Complainte de la Lune en province », « Complainte du pauvre jeune homme », « Complainte du roi de Thulé ».

## L’écriture
| Procédé | Exemple ou effet |
| Le **mélange des registres** | Vocabulaire savant **et** argot |
| Les **mots inventés** | « sangsuel », « **éternullité** », « violupté » |
| Les **clichés déformés** | Le vers **cassé de l’intérieur** |
| Le **vers libre** | Laforgue en est l’un des **inventeurs**, avec ses *Derniers vers* (posthumes) |

> L’**ironie** y est une **politesse** : elle **empêche l’épanchement de devenir ridicule**.

## À retenir
Une influence **immense**, **très supérieure à sa notoriété**.

> **T. S. Eliot** le revendiquait, les **surréalistes** s’en réclamaient — et **une grande part de la poésie moderne**, celle **qui rit d’elle-même en même temps qu’elle chante**, **vient de là**.

> « Ah ! que la Vie est quotidienne… »`,
          },
          questions: [
            ['Quelle forme populaire le recueil reprend-il ?', ['La complainte de rue, avec couplets et refrains', 'Le sonnet', 'La ballade médiévale', 'L’ode antique'], 0, 'Cinquante complaintes en composent le recueil.'],
            ['Quel type de mots Laforgue invente-t-il ?', ['Des mots-valises comme « éternullité » ou « violupté »', 'Des mots latins', 'Des noms propres imaginaires', 'Des onomatopées uniquement'], 0, 'Il casse le vers et la langue de l’intérieur.'],
            ['Quel rôle joue l’ironie chez Laforgue ?', ['Elle empêche l’épanchement de devenir ridicule', 'Elle sert la satire politique', 'Elle vise le lecteur', 'Elle imite Voltaire'], 0, 'C’est une politesse envers le lecteur et envers soi.'],
            ['De quelle innovation formelle Laforgue est-il un pionnier ?', ['Le vers libre', 'Le poème en prose', 'Le calligramme', 'Le sonnet renversé'], 0, 'Ses Derniers vers, posthumes, en sont le meilleur exemple.'],
            ['Quel poète anglo-américain revendiquait son influence ?', ['T. S. Eliot', 'Walt Whitman', 'Lord Byron', 'Emily Dickinson'], 0, 'Son influence dépasse largement sa notoriété.'],
            ['Laforgue a connu une longue carrière poétique.', ['Vrai', 'Faux'], 1, 'Il est mort de tuberculose à vingt-sept ans, deux ans après ce recueil.'],
          ],
        },
        {
          titre: 'Les Confessions, Jean-Jacques Rousseau',
          lecon: {
            titre: 'Rousseau, 1782-1789 — l’autobiographie moderne',
            cours: `## L’œuvre
**Douze livres**, écrits entre **1765 et 1770**, publiés **après la mort** de Rousseau : **1782** pour les six premiers, **1789** pour les suivants.

> Le projet est annoncé dès la première page : « Je forme une entreprise **qui n’eut jamais d’exemple**… Je veux montrer à mes semblables **un homme dans toute la vérité de la nature** ; et cet homme, **ce sera moi**. »

## Le contenu
| Période | Ce qu’elle contient |
| L’**enfance** à Genève | La **lecture des romans**, la fugue |
| La jeunesse | **Madame de Warens** — « **Maman** » —, les métiers, la **musique** |
| La montée à Paris | L’**Encyclopédie**, le succès du *Discours sur les sciences et les arts* |
| L’aveu le plus lourd | Les **enfants abandonnés** aux Enfants-Trouvés |
| Les ruptures | **Diderot**, **Voltaire**, **Hume** |
| La fin | La **persécution** — réelle **et fantasmée** |

| Deux épisodes célèbres | Ce qu’ils avouent |
| Le **ruban volé** | Il en accuse la servante **Marion** |
| Le **vol des pommes** | Chez son maître graveur |

## À retenir
Le livre **fonde l’autobiographie moderne**.

| Trait | Ce qu’il installe |
| La **sincérité revendiquée** | Et l’**aveu des fautes** |
| L’importance de l’**enfance** et des **sensations** | Le récit part de là |
| La primauté du **sentiment intérieur** | Sur les **faits** |

> Il s’**oppose** aux *Essais* de Montaigne — qui se peint « en passant » — et **annonce le romantisme**.

> « Je sens mon cœur et je connais les hommes. »`,
          },
          questions: [
            ['Quel projet Rousseau annonce-t-il dès la première page ?', ['Montrer un homme dans toute la vérité de la nature : lui-même', 'Écrire l’histoire de son siècle', 'Corriger ses ennemis', 'Composer un traité d’éducation'], 0, 'L’entreprise se veut sans exemple.'],
            ['Quand l’œuvre a-t-elle été publiée ?', ['Après sa mort, en 1782 et 1789', 'De son vivant, en 1770', 'En 1750', 'Au XIXe siècle seulement'], 0, 'Six livres d’abord, six ensuite.'],
            ['Quel épisode d’aveu est resté célèbre ?', ['Le ruban volé dont il accuse la servante Marion', 'Le vol d’un cheval', 'Un duel manqué', 'Une lettre falsifiée'], 0, 'Il en a porté le remords toute sa vie, dit-il.'],
            ['Qui est « Maman » dans les Confessions ?', ['Madame de Warens', 'Sa mère, morte à sa naissance', 'Thérèse Levasseur', 'Madame d’Épinay'], 0, 'Elle le recueille, l’instruit et devient sa maîtresse.'],
            ['Quel genre le livre fonde-t-il ?', ['L’autobiographie moderne', 'Le roman épistolaire', 'L’essai', 'Le journal intime'], 0, 'Enfance, sensations, aveu des fautes, primauté du sentiment.'],
            ['Rousseau tait ses fautes pour se présenter sous un jour flatteur.', ['Vrai', 'Faux'], 1, 'Il revendique l’aveu, y compris l’abandon de ses enfants.'],
          ],
        },
        {
          titre: 'Les Contemplations, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1856 — « les Mémoires d’une âme »',
            cours: `## L’architecture
| Ensemble | Ses livres |
| **Autrefois** | *Aurore*, *L’Âme en fleur*, *Les Luttes et les Rêves* |
| **Aujourd’hui** | *Pauca meae*, *En marche*, *Au bord de l’infini* |

> Entre les deux : la mort de **Léopoldine**, **noyée à Villequier en 1843**, à **dix-neuf ans**.

La préface donne la clé : « Ce livre doit être lu **comme on lirait le livre d’un mort** » — et « **Quand je vous parle de moi, je vous parle de vous** ».

## Les poèmes à connaître
| Poème | Ce qu’il porte |
| « Réponse à un acte d’accusation » | « Je mis un **bonnet rouge** au vieux dictionnaire » |
| « Vieille chanson du jeune temps » | L’amour manqué |
| « **Melancholia** » | Les **enfants à l’usine** |
| « **Demain, dès l’aube…** », « À Villequier » | Le **deuil** |
| « Paroles sur la dune », « Ce que dit la bouche d’ombre » | La **méditation métaphysique** |

## À retenir
| Ce que le recueil n’est pas | Ce qu’il est |
| Une autobiographie **de faits** | Le récit d’une **vie intérieure** |

Enfance, amour, **révolte sociale**, deuil, métaphysique. Hugo écrit **en exil**, à **Guernesey**.

> Le recueil réunit **tous ses registres** — lyrique, épique, satirique, visionnaire — et pratique une **extraordinaire variété de mètres et de strophes**.

> « Un jour je vis, debout au bord des flots mouvants, passer, gonflant ses voiles, un rire… »`,
          },
          questions: [
            ['Comment le recueil est-il divisé ?', ['En Autrefois et Aujourd’hui, séparés par la mort de Léopoldine', 'En quatre saisons', 'Par ordre chronologique de composition', 'En trois parties égales'], 0, 'Six livres au total.'],
            ['Quelle formule de la préface résume le projet ?', ['« Quand je vous parle de moi, je vous parle de vous »', '« Le poète est un phare »', '« Je est un autre »', '« Tout est dit »'], 0, 'Le « je » lyrique y est offert comme un miroir.'],
            ['Quel poème évoque le travail des enfants à l’usine ?', ['Melancholia', 'Demain, dès l’aube…', 'À Villequier', 'Paroles sur la dune'], 0, 'Hugo y est déjà le poète social des Misérables.'],
            ['Quel poème est une visite à la tombe de sa fille ?', ['Demain, dès l’aube…', 'Réponse à un acte d’accusation', 'Ce que dit la bouche d’ombre', 'Vieille chanson du jeune temps'], 0, 'Le poème ne le révèle qu’au dernier vers.'],
            ['Où Hugo se trouve-t-il lors de la publication ?', ['En exil à Guernesey', 'À Paris', 'En Belgique', 'À Jersey uniquement'], 0, 'L’exil donne au livre sa position de retrait.'],
            ['Le recueil est une autobiographie factuelle.', ['Vrai', 'Faux'], 1, 'C’est le récit d’une vie intérieure : « les Mémoires d’une âme ».'],
          ],
        },
        {
          titre: 'Les Destinées, Alfred de Vigny',
          lecon: {
            titre: 'Vigny, 1864 — onze poèmes philosophiques',
            cours: `## Le recueil
Publié **après la mort** de Vigny, en **1864** : **onze poèmes philosophiques** écrits **sur trente ans**.

> Chacun développe **une idée par un symbole**.

| Poème | Son idée |
| « Les Destinées » | Le **poids du destin** et la grâce |
| « **La Maison du berger** » | La **nature indifférente**, la femme aimée, la **poésie comme refuge** |
| « La Colère de Samson » | La **trahison amoureuse** |
| « **La Mort du loup** » | Le **stoïcisme** |
| « Le Mont des Oliviers » | Le **silence de Dieu** |
| « La Bouteille à la mer » | L’**œuvre confiée à l’avenir** |
| « L’Esprit pur » | La **noblesse de l’esprit** contre celle du sang |

## La pensée
Vigny est le **plus pessimiste** des grands romantiques.

| Constat | Le détail |
| **Dieu se tait** | « Le Mont des Oliviers » |
| La **nature est indifférente** | Elle « roule avec dédain, sans voir et sans entendre » |
| Les hommes sont **ingrats** | — |

> Reste la **dignité** : **ne pas se plaindre, faire son travail, transmettre**. C’est la leçon de « La Mort du loup » : « **Gémir, pleurer, prier est également lâche… souffre et meurs sans parler.** »

## À retenir
Une poésie de la **pensée** et du **symbole**, **plus austère** que celle de Hugo ou de Lamartine — où le **poème est la démonstration d’une idée par une image**.

> « Seul le silence est grand ; tout le reste est faiblesse. »`,
          },
          questions: [
            ['Quand le recueil a-t-il été publié ?', ['En 1864, après la mort de Vigny', 'En 1826', 'En 1840', 'En 1856'], 0, 'Les onze poèmes ont été écrits sur trente ans.'],
            ['Quelle leçon donne « La Mort du loup » ?', ['Souffrir et mourir sans se plaindre : le stoïcisme', 'La revanche contre les hommes', 'La foi retrouvée', 'La fuite dans la nature'], 0, '« Gémir, pleurer, prier est également lâche. »'],
            ['Quelle vision de la nature Vigny propose-t-il ?', ['Une nature indifférente aux hommes', 'Une nature consolatrice', 'Une nature divine et vivante', 'Une nature hostile et vengeresse'], 0, 'Elle « roule avec dédain » : c’est l’opposé du romantisme de Lamartine.'],
            ['Quel poème évoque le silence de Dieu ?', ['Le Mont des Oliviers', 'La Bouteille à la mer', 'L’Esprit pur', 'Les Destinées'], 0, 'Le Christ y attend une réponse qui ne vient pas.'],
            ['Que symbolise « La Bouteille à la mer » ?', ['L’œuvre confiée à l’avenir', 'Le naufrage de l’amour', 'L’exil politique', 'La mort du savant'], 0, 'Le savant y jette son travail à la mer pour qu’il survive.'],
            ['La poésie de Vigny est surtout lyrique et sentimentale.', ['Vrai', 'Faux'], 1, 'C’est une poésie de la pensée : chaque poème démontre une idée par un symbole.'],
          ],
        },
        {
          titre: 'Les Fausses Confidences, Marivaux',
          lecon: {
            titre: 'Marivaux, 1737 — l’amour organisé par un valet',
            cours: `## L’histoire
Comédie en **trois actes et en prose**.

| Personnage | Sa position |
| **Dorante** | **Ruiné**, il aime en secret **Araminte**, riche veuve |
| **Dubois**, son ancien valet | Désormais au service d’Araminte : il lui obtient la place d’**intendant** et **mène toute l’opération** |
| **Madame Argante** et le **comte Dorimont** | Ils veulent un **beau mariage** |
| **Marton** | Elle est **jalouse** |

| Le stratagème | Le coup |
| La **confidence** initiale | Dorante serait **fou d’amour** depuis l’Opéra |
| Le **portrait** d’Araminte | Trouvé chez Dorante |
| La **fausse lettre** | Elle relance |
| L’**épreuve** | Araminte lui **dicte une lettre annonçant son propre mariage** — scène cruelle |
| La fin | **Elle avoue.** Elle épousera **un homme sans fortune** |

## À retenir
Parcours possible : **théâtre et stratagème**.

| Ce que Dubois fait | Ce qu’il ne fait pas |
| Il **choisit quand la vérité est dite** | Il **ne ment presque jamais** |

> Le stratagème **ne fabrique pas le sentiment** : il **lève les obstacles**. Mais la pièce **laisse la lecture inverse ouverte** — et c’est ce qui en fait un excellent sujet de dissertation.

> L’**argent** y est partout : **la difficulté n’est pas d’aimer, c’est de pouvoir le dire**.

> « Nous sommes convenus de nos faits. »`,
          },
          questions: [
            ['Qui organise le stratagème ?', ['Dubois, l’ancien valet de Dorante', 'Marton', 'Madame Argante', 'Le comte Dorimont'], 0, 'Il est désormais au service d’Araminte.'],
            ['Quelle « fausse confidence » lance l’intrigue ?', ['Dubois révèle à Araminte que Dorante l’aime depuis longtemps', 'Dorante se dit ruiné', 'Marton dénonce Dubois', 'Le comte annonce un mariage'], 0, 'La confidence est vraie, mais son moment est calculé.'],
            ['Quel objet compromet Dorante ?', ['Un portrait d’Araminte', 'Une bague', 'Un contrat', 'Un billet de banque'], 0, 'Il matérialise l’amour annoncé par Dubois.'],
            ['Comment Araminte éprouve-t-elle Dorante ?', ['Elle lui dicte une lettre annonçant son propre mariage', 'Elle le congédie', 'Elle lui offre de l’argent', 'Elle le fait suivre'], 0, 'La scène est l’une des plus cruelles du théâtre de Marivaux.'],
            ['Qu’est-ce qui rend le dénouement audacieux ?', ['Araminte épouse un homme sans fortune', 'Dorante refuse le mariage', 'Dubois est renvoyé', 'Marton épouse le comte'], 0, 'Un scandale, du point de vue social de l’époque.'],
            ['Le stratagème crée le sentiment amoureux de toutes pièces.', ['Vrai', 'Faux'], 1, 'La pièce laisse les deux lectures ouvertes : il peut aussi n’avoir fait que lever les obstacles.'],
          ],
        },
        {
          titre: 'Les Faux-Monnayeurs, André Gide',
          lecon: {
            titre: 'Gide, 1925 — le seul livre qu’il appelait « roman »',
            cours: `## L’histoire
Plusieurs intrigues **entrelacées**.

| Personnage | Ce qui le porte |
| **Bernard Profitendieu** | Découvrant qu’il est un **enfant illégitime**, il quitte sa famille |
| **Édouard** | Écrivain, oncle par alliance : il tient un **journal** et prépare un roman intitulé *Les Faux-Monnayeurs* |
| **Olivier** | Ami de Bernard, **attiré par le cynique comte de Passavant** |
| Le pasteur **Vedel** et sa famille | La façade religieuse |
| Une bande de lycéens | Ils écoulent de la **fausse monnaie** |
| Le petit **Boris** | Poussé au **suicide** par un **pacte d’enfants**, **sous les yeux de son grand-père** |

## La construction
> **Mise en abyme** : un roman **qui contient un romancier écrivant le même roman** — **et le journal de ce romancier**.

| Ce que le narrateur fait | Son effet |
| Il **intervient**, doute, **commente ses propres personnages** | « J’aurais aimé que… » |
| **Aucun point de vue ne domine** | Le lecteur reconstruit |

## À retenir
Publié en **1925**, accompagné l’année suivante du *Journal des faux-monnayeurs*.

> Le titre est une **métaphore** : la fausse monnaie, ce sont aussi les **sentiments faux**, les **vertus affichées**, **les êtres qui se jouent la comédie**.

Roman de la **sincérité impossible** et de l’**adolescence**, il a **ouvert la voie à toutes les expérimentations romanesques du siècle**.

> « Je voudrais que ce roman fût un carrefour de problèmes. »`,
          },
          questions: [
            ['Quel procédé structure le roman ?', ['La mise en abyme : un romancier y écrit le même roman', 'Le récit à la première personne', 'Le monologue intérieur continu', 'La narration par lettres'], 0, 'Édouard tient aussi un journal, inclus dans le livre.'],
            ['Pourquoi Bernard quitte-t-il sa famille ?', ['Il découvre qu’il est un enfant illégitime', 'Il est renvoyé du lycée', 'Il fuit la police', 'Il part travailler'], 0, 'Il devient ensuite le secrétaire d’Édouard.'],
            ['Que désigne la « fausse monnaie » du titre ?', ['Autant les pièces fausses que les sentiments et les vertus feints', 'Un trafic bancaire', 'Une métaphore de la littérature seule', 'Une affaire judiciaire réelle'], 0, 'Le titre fonctionne sur les deux plans.'],
            ['Quel drame frappe le petit Boris ?', ['Il est poussé au suicide par un pacte d’enfants', 'Il est enlevé', 'Il meurt de maladie', 'Il fugue'], 0, 'La scène clôt le roman de façon brutale.'],
            ['Comment Gide qualifiait-il ce livre ?', ['Son seul « roman »', 'Une sotie', 'Un récit', 'Un essai'], 0, 'Il réservait « récit » et « sotie » à ses autres livres.'],
            ['Le narrateur du roman reste neutre et invisible.', ['Vrai', 'Faux'], 1, 'Il intervient, doute et commente ses propres personnages.'],
          ],
        },
        {
          titre: 'Les Fleurs du mal, Charles Baudelaire',
          lecon: {
            titre: 'Baudelaire, 1857 — spleen et idéal',
            cours: `## Le recueil
Publié en **1857**, **condamné la même année** pour outrage aux bonnes mœurs : **six pièces** retranchées. Édition **augmentée et réorganisée** en **1861**.

| Section | Ce qu’elle porte |
| **Spleen et Idéal** | La plus longue : la tension centrale |
| **Tableaux parisiens** | Ajoutée en **1861** : la ville moderne |
| **Le Vin** | L’ivresse |
| **Fleurs du mal** | La transgression |
| **Révolte** | Le blasphème |
| **La Mort** | Le dernier voyage |

## Les quatre notions
| Notion | Sa définition |
| Le **spleen** | Angoisse **sans objet**, ennui métaphysique — « Quand le ciel bas et lourd pèse comme un **couvercle** » |
| L’**idéal** | L’élévation par l’art, la beauté, le **voyage rêvé** — « L’Invitation au voyage » |
| Les **correspondances** | La nature est « une **forêt de symboles** » : parfums, couleurs et sons **se répondent** |
| L’**alchimie poétique** | « Tu m’as donné ta **boue** et j’en ai fait de l’**or** » — la beauté naît **du travail de la forme, non du sujet** |

« Une Charogne » en est la démonstration.

## À retenir
| Baudelaire est… | Et il est… |
| **Classique de facture** : sonnets, alexandrins | **Révolutionnaire de matière** : la ville, la laideur, le transitoire |

> Il invente le regard du **flâneur** — « À une passante » — et **ouvre la modernité poétique**. La condamnation ne sera **annulée qu’en 1949**.

> « Au fond de l’Inconnu pour trouver du nouveau ! »`,
          },
          questions: [
            ['Que se passe-t-il à la publication de 1857 ?', ['Le recueil est condamné et six pièces sont retranchées', 'Il obtient un prix', 'Il est ignoré', 'Il est interdit en totalité'], 0, 'La condamnation ne sera annulée qu’en 1949.'],
            ['Qu’est-ce que le spleen ?', ['Une angoisse sans objet, un ennui métaphysique', 'La nostalgie du pays natal', 'La colère politique', 'Le mal de mer'], 0, '« Quand le ciel bas et lourd pèse comme un couvercle. »'],
            ['Quelle section a été ajoutée en 1861 ?', ['Tableaux parisiens', 'La Mort', 'Révolte', 'Le Vin'], 0, 'Elle fait entrer la ville moderne dans le recueil.'],
            ['Quelle formule résume l’alchimie poétique ?', ['« Tu m’as donné ta boue et j’en ai fait de l’or »', '« Je est un autre »', '« La poésie doit être faite par tous »', '« Le vers libre est la liberté »'], 0, 'La beauté naît du travail de la forme.'],
            ['Que dit le poème « Correspondances » ?', ['Parfums, couleurs et sons se répondent dans une forêt de symboles', 'La ville détruit la nature', 'Le poète est un albatros', 'La mort est un voyage'], 0, 'C’est le fondement de la poétique symboliste.'],
            ['Baudelaire abandonne les formes fixes traditionnelles.', ['Vrai', 'Faux'], 1, 'Il garde sonnets et alexandrins : c’est la matière, non la forme, qui scandalise.'],
          ],
        },
        {
          titre: 'Les Fourberies de Scapin, Molière',
          lecon: {
            titre: 'Molière, 1671 — le valet et le sac',
            cours: `## L’histoire
Comédie en **trois actes et en prose**.

| Jeune homme | Ce qu’il a fait en l’absence de son père |
| **Octave** | Il a **épousé secrètement Hyacinte** |
| **Léandre** | Il aime la « bohémienne » **Zerbinette**, qu’il faut **racheter** |

Les pères, **Argante** et **Géronte**, reviennent **avec d’autres projets de mariage**.

| La fourberie de Scapin | Comment elle marche |
| Contre **Argante** | Un **faux procès** |
| Contre **Géronte** | Son fils serait **retenu sur une galère turque** — « **Que diable allait-il faire dans cette galère ?** » |
| La vengeance personnelle | Il enferme Géronte dans un **sac** et le **roue de coups** en **imitant plusieurs agresseurs** |

| Le dénouement | Ce qu’il révèle |
| Les deux jeunes filles | Ce sont les **filles perdues des deux pères** |
| Scapin | Il obtient son **pardon en feignant d’être mourant** |

## À retenir
Un **retour assumé à la farce** et à la *commedia dell’arte* — **Scapin** vient de **Scapino** — chez un Molière **au sommet**. **Boileau** le lui reprochera.

| Type de comique | La scène |
| De **gestes** | La scène du **sac** |
| De **mots** | La réplique de la **galère** |
| De **caractère** | Les deux pères |

> Le valet y est un **artiste de l’intrigue** : **le moteur de toute la pièce**.

> « Que diable allait-il faire dans cette galère ? »`,
          },
          questions: [
            ['Quel est le rôle de Scapin ?', ['Il mène toute l’intrigue pour aider les jeunes gens', 'Il trahit ses maîtres', 'Il est le père d’Octave', 'Il ne fait qu’observer'], 0, 'Le valet est ici l’artiste de l’intrigue.'],
            ['Quelle ruse Scapin emploie-t-il contre Géronte ?', ['Il lui fait croire que son fils est retenu sur une galère turque', 'Il falsifie un testament', 'Il l’accuse d’un crime', 'Il lui vole sa bourse'], 0, '« Que diable allait-il faire dans cette galère ? »'],
            ['Quelle est la scène la plus célèbre de la pièce ?', ['Géronte enfermé dans un sac et battu', 'Le mariage d’Octave', 'La reconnaissance finale', 'Le duel de Léandre'], 0, 'Un pur comique de gestes, hérité de la farce.'],
            ['Comment se dénoue l’intrigue ?', ['Les jeunes filles se révèlent être les filles perdues des deux pères', 'Les pères cèdent par lassitude', 'Scapin achète les mariages', 'Les jeunes gens s’enfuient'], 0, 'Reconnaissance : ressort classique de la comédie.'],
            ['De quelle tradition théâtrale Scapin est-il issu ?', ['La commedia dell’arte, où il s’appelle Scapino', 'La tragédie grecque', 'Le théâtre espagnol', 'Le drame liturgique'], 0, 'Boileau reprochera à Molière ce retour à la farce.'],
            ['Scapin est puni à la fin de la pièce.', ['Vrai', 'Faux'], 1, 'Il obtient son pardon en feignant d’être mourant.'],
          ],
        },
        {
          titre: 'Les Justes, Albert Camus',
          lecon: {
            titre: 'Camus, 1949 — peut-on tuer pour une cause juste ?',
            cours: `## L’histoire
**Cinq actes**, d’après un **fait réel** : à **Moscou**, en **1905**, un groupe de **socialistes révolutionnaires** prépare l’attentat contre le **grand-duc Serge**.

| Personnage | Sa position |
| **Kaliayev**, poète | Il doit **lancer la bombe** |
| **Stepan**, endurci par la prison | Au nom de l’**efficacité révolutionnaire** |
| **Dora**, qui aime Kaliayev | Elle **lui donne raison** |
| **Annenkov**, le chef | Aussi |

| Étape | Ce qui se passe |
| Le premier passage | Il **renonce** : les **neveux du grand-duc** sont dans la calèche |
| Le reproche | **Stepan** lui reproche cette « faiblesse » |
| Deux jours plus tard | **L’attentat réussit** |
| En prison | Il **refuse la grâce** que lui propose la grande-duchesse, et le **marchandage** du chef de la police |
| La fin | Il est **pendu**. **Dora demande à lancer la prochaine bombe** |

## À retenir
Pièce du cycle de la **révolte**, avec *L’Homme révolté* (1951).

| La question | La réponse de Camus |
| La **fin justifie-t-elle les moyens** ? | Le révolté doit accepter de **payer de sa vie** le meurtre qu’il commet |
| Et les innocents ? | **Refuser de les tuer** — **au risque d’être inefficace** |

Théâtre d’**idées**, **dialogué comme un procès**.

> « Nous tuons pour bâtir un monde où plus jamais personne ne tuera. »`,
          },
          questions: [
            ['Sur quel fait la pièce est-elle fondée ?', ['L’attentat contre le grand-duc Serge, à Moscou en 1905', 'La révolution de 1917', 'La Commune de Paris', 'Un attentat imaginaire'], 0, 'Camus s’est appuyé sur des sources historiques.'],
            ['Pourquoi Kaliayev renonce-t-il au premier passage ?', ['Des enfants sont dans la calèche', 'La bombe est défectueuse', 'La police l’a repéré', 'Dora l’en empêche'], 0, 'Le refus de tuer des innocents est le cœur de la pièce.'],
            ['Que reproche Stepan à Kaliayev ?', ['D’avoir fait passer la morale avant l’efficacité révolutionnaire', 'D’avoir trahi le groupe', 'D’aimer Dora', 'D’avoir peur de mourir'], 0, 'Deux conceptions de la révolution s’affrontent.'],
            ['Que refuse Kaliayev en prison ?', ['La grâce et le marchandage proposés', 'De reconnaître son geste', 'De voir la grande-duchesse', 'De parler à ses camarades'], 0, 'Il accepte d’être pendu : le prix du meurtre est sa propre vie.'],
            ['À quel cycle de l’œuvre de Camus la pièce appartient-elle ?', ['Le cycle de la révolte', 'Le cycle de l’absurde', 'Le cycle de l’amour', 'Aucun'], 0, 'Avec L’Homme révolté, publié deux ans plus tard.'],
            ['Camus soutient que la fin justifie les moyens.', ['Vrai', 'Faux'], 1, 'Il défend l’inverse : le révolté doit refuser de tuer des innocents et payer de sa vie.'],
          ],
        },
        {
          titre: 'Les Liaisons dangereuses, Pierre Choderlos de Laclos',
          lecon: {
            titre: 'Laclos, 1782 — la guerre des lettres',
            cours: `## L’histoire
Roman **épistolaire** en **175 lettres**. La **marquise de Merteuil** et le **vicomte de Valmont**, anciens amants devenus **complices**, mènent deux séductions **comme des campagnes militaires**.

| Qui | Son entreprise |
| **Merteuil** | Se venger de Gercourt en faisant **déniaiser sa future épouse**, la jeune **Cécile de Volanges**, sortie du couvent |
| **Valmont** | Séduire la **présidente de Tourvel**, femme **pieuse et mariée** — **l’enjeu du pari est une nuit avec Merteuil** |

| Le retournement | Ce qui se passe |
| Valmont réussit | **Et tombe amoureux** |
| **Merteuil**, jalouse | Elle exige qu’il **rompe par une lettre cruelle** — « **ce n’est pas ma faute** » |
| **Tourvel** | Elle **en meurt** |
| **Valmont** | **Tué en duel par Danceny**, à qui il **lègue les lettres de Merteuil** |
| **Merteuil** | **Démasquée**, **sifflée à l’Opéra**, **ruinée**, **défigurée par la petite vérole** : elle s’enfuit |

## À retenir
Chef-d’œuvre de la **polyphonie** : **chaque lettre a son style, son destinataire et sa stratégie** — **le lecteur reconstitue seul la vérité**.

> La **lettre 81** de la marquise décrit l’**éducation qu’elle s’est donnée pour survivre dans un monde d’hommes** : **l’un des plus grands textes féministes du siècle**.

**Laclos**, **officier d’artillerie**, écrit un roman **construit comme un plan de bataille**.

> « J’ai été punie par où j’avais péché. »`,
          },
          questions: [
            ['Quelle est la forme du roman ?', ['Un roman épistolaire de 175 lettres', 'Un roman-mémoires', 'Un journal intime', 'Un dialogue'], 0, 'Chaque lettre a son style et sa stratégie.'],
            ['Que veut la marquise de Merteuil au début ?', ['Se venger de Gercourt en faisant corrompre sa future épouse', 'Épouser Valmont', 'Ruiner Madame de Volanges', 'Quitter Paris'], 0, 'Cécile de Volanges, sortie du couvent, en est la victime.'],
            ['Quel est le pari de Valmont ?', ['Séduire la présidente de Tourvel, femme pieuse et mariée', 'Épouser Cécile', 'Ruiner Danceny', 'Provoquer Gercourt en duel'], 0, 'L’enjeu est une nuit avec Merteuil.'],
            ['Qu’arrive-t-il à Valmont après sa conquête ?', ['Il tombe amoureux, rompt cruellement sur ordre de Merteuil et meurt en duel', 'Il épouse Tourvel', 'Il quitte la France', 'Il se retire au couvent'], 0, 'Danceny le tue et reçoit les lettres de Merteuil.'],
            ['Quelle lettre est célèbre pour son propos sur l’éducation des femmes ?', ['La lettre 81 de la marquise de Merteuil', 'La première lettre de Cécile', 'La dernière lettre de Tourvel', 'La lettre de rupture de Valmont'], 0, 'Elle y raconte comment elle s’est formée pour survivre.'],
            ['La marquise de Merteuil échappe à toute sanction.', ['Vrai', 'Faux'], 1, 'Démasquée, sifflée, ruinée et défigurée par la petite vérole, elle s’enfuit.'],
          ],
        },
        {
          titre: 'Les Mains sales, Jean-Paul Sartre',
          lecon: {
            titre: 'Sartre, 1948 — l’intellectuel et le parti',
            cours: `## L’histoire
**Sept tableaux**, en grande partie en **flash-back**.

| Étape | Ce qui se passe |
| Le présent | **Hugo**, jeune bourgeois devenu communiste en **Illyrie**, sort de prison ; le parti doit décider **s’il faut le liquider** |
| Deux ans plus tôt | Chargé d’**assassiner Hoederer**, dirigeant accusé de trahison **parce qu’il veut s’allier aux conservateurs et au régent** |
| Le trouble | Devenu son **secrétaire**, Hugo **l’admire** et **hésite** |
| La leçon d’Hoederer | Un homme politique doit **accepter de se salir les mains** — « **Moi, j’ai les mains sales. Jusqu’aux coudes.** » |
| L’acte | Il le tue — **mais dans un accès de jalousie** : il a **surpris sa femme Jessica dans ses bras** |
| L’ironie | Entre-temps, **la ligne d’Hoederer est devenue celle du parti**, qui l’a **réhabilité** |
| La fin | Sommé de **renier son acte pour vivre**, Hugo **refuse** et se déclare « **non récupérable** » |

## À retenir
Pièce **politique** créée en **1948**, en pleine **guerre froide**.

> **Sartre lui-même en interdit longtemps la représentation**, parce qu’elle était **utilisée par l’anticommunisme**.

| Sujet | Ce qui s’oppose |
| La **pureté** contre l’**efficacité** | Hugo contre Hoederer |
| L’**intellectuel** face à l’**action** | — |
| L’**ambiguïté des motifs** | **Hugo ne sait pas lui-même pourquoi il a tiré** |

> « Un intellectuel, ce n’est pas quelqu’un de propre. »`,
          },
          questions: [
            ['Que doit faire Hugo au début de l’histoire ?', ['Assassiner Hoederer, dirigeant accusé de trahison', 'Écrire un manifeste', 'Négocier avec le régent', 'Fuir à l’étranger'], 0, 'Il devient son secrétaire et se met à l’admirer.'],
            ['Que signifie le titre de la pièce ?', ['L’action politique oblige à se salir les mains', 'Le crime laisse des traces', 'Le travail manuel est méprisé', 'La justice est corrompue'], 0, '« Moi, j’ai les mains sales. Jusqu’aux coudes. »'],
            ['Pourquoi Hugo tire-t-il finalement ?', ['Par jalousie, en surprenant Jessica dans les bras d’Hoederer', 'Par conviction politique', 'Sur ordre direct du parti', 'Par accident'], 0, 'L’ambiguïté du motif est le cœur de la pièce.'],
            ['Que devient la ligne politique d’Hoederer ?', ['Elle est adoptée par le parti, qui le réhabilite', 'Elle est condamnée définitivement', 'Elle est oubliée', 'Elle provoque une scission'], 0, 'Le meurtre devient rétrospectivement absurde.'],
            ['Comment Hugo se déclare-t-il à la fin ?', ['« Non récupérable »', '« Innocent »', '« Prêt à servir »', '« Vaincu »'], 0, 'Il refuse de renier son acte pour survivre.'],
            ['Sartre a favorisé les représentations de la pièce après 1948.', ['Vrai', 'Faux'], 1, 'Il l’a longtemps interdite, parce qu’elle servait l’anticommunisme.'],
          ],
        },
        {
          titre: 'Les Misérables, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1862 — le roman du peuple et de la rédemption',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le bagne | **Jean Valjean**, libéré après **dix-neuf ans** **pour un pain volé** |
| La rédemption | L’évêque **Myriel** lui **offre les chandeliers qu’il vient de lui voler** — et **le rend à la vie** |
| L’ascension | Devenu **Monsieur Madeleine**, maire et industriel |
| Le sauvetage | Il recueille **Cosette**, fille de **Fantine**, prostituée morte de misère, en l’arrachant aux **Thénardier** |
| La traque | L’inspecteur **Javert**, sans relâche |
| Paris | La fuite, le couvent, la rue Plumet ; **Marius**, jeune républicain, aime Cosette |
| **Juin 1832** | L’insurrection, la **barricade** de la rue de la Chanvrerie, la mort de **Gavroche** et d’**Éponine** |
| Les égouts | Valjean **sauve Marius** — et **épargne Javert** |
| Javert | **Incapable de penser un criminel bon**, il **se jette dans la Seine** |
| La fin | Valjean meurt, **réconcilié**, après avoir tout dit |

## À retenir
Roman-monde en **cinq parties**, publié en **1862** **depuis l’exil**, **immense succès populaire immédiat**.

| Ce que Hugo y mêle | Exemples |
| Le **récit** | Les destins croisés |
| Les **digressions historiques** | **Waterloo** |
| Les **digressions sociales** | Les **égouts**, l’**argot**, les couvents |

> Son but est **politique** : « tant qu’il existera… une **damnation sociale** créant artificiellement des enfers, **des livres de la nature de celui-ci pourront ne pas être inutiles** ».

> « Il n’y a ni mauvaises herbes ni mauvais hommes. Il n’y a que de mauvais cultivateurs. »`,
          },
          questions: [
            ['Pourquoi Jean Valjean a-t-il été envoyé au bagne ?', ['Pour un pain volé, puis des tentatives d’évasion', 'Pour meurtre', 'Pour vol de chandeliers', 'Pour désertion'], 0, 'Dix-neuf ans au total.'],
            ['Quel geste transforme Jean Valjean ?', ['L’évêque Myriel lui offre les chandeliers qu’il vient de voler', 'Sa rencontre avec Cosette', 'La mort de Fantine', 'Son évasion du bagne'], 0, 'C’est le point de départ de sa rédemption.'],
            ['Qui poursuit Valjean sans relâche ?', ['L’inspecteur Javert', 'Thénardier', 'Marius', 'Le préfet Gisquet'], 0, 'Épargné par Valjean, il se jette dans la Seine.'],
            ['Quel épisode historique le roman met-il en scène ?', ['L’insurrection républicaine de juin 1832', 'La Révolution de 1789', 'La Commune de 1871', 'Les Trois Glorieuses de 1830'], 0, 'La barricade de la rue de la Chanvrerie en est le cœur.'],
            ['Comment Valjean sauve-t-il Marius ?', ['En le portant à travers les égouts de Paris', 'En le cachant au couvent', 'En négociant avec Javert', 'En le confiant à Gavroche'], 0, 'La traversée des égouts est l’un des morceaux les plus célèbres.'],
            ['Le roman a été écrit en France.', ['Vrai', 'Faux'], 1, 'Hugo l’achève en exil, à Guernesey ; il paraît en 1862.'],
          ],
        },
        {
          titre: 'Les Mots, Jean-Paul Sartre',
          lecon: {
            titre: 'Sartre, 1964 — une enfance démontée',
            cours: `## L’œuvre
Autobiographie en **deux parties** : « **Lire** » et « **Écrire** ». Sartre y raconte ses **dix premières années**.

| Élément | Le détail |
| Le père | **Mort très tôt** |
| Le foyer | Chez son grand-père **Charles Schweitzer**, professeur d’allemand, **dans un appartement plein de livres** |
| L’enfant | **Unique et adulé** : il **joue le rôle qu’on attend de lui** — l’**enfant prodige** |
| Ce qu’il fait | Il **lit avant de comprendre**, écrit des **romans d’aventures recopiés** |
| Ce qu’il se persuade | Qu’il est **destiné** à écrire |

## Le regard rétrospectif
| Ce que le livre n’est pas | Ce qu’il est |
| **Nostalgique** | Une **démolition** |

> Sartre y traque la **comédie** qu’il jouait, la « **névrose littéraire** » qui lui a fait **prendre l’écriture pour un salut et un mandat sacré**.

Il conclut qu’il **s’est trompé pendant trente ans** — et que **la littérature ne sauve personne**. Mais il ajoute : « **Je continue d’écrire. Que faire d’autre ?** »

## À retenir
Écrit dans une prose **brillante et ironique** : **paradoxalement le plus beau livre d’un auteur qui règle son compte à la beauté littéraire**.

> Sartre **refuse le prix Nobel** en **1964** — **l’année même de sa parution**.

> « J’ai commencé ma vie comme je la finirai sans doute : au milieu des livres. »`,
          },
          questions: [
            ['Quelles sont les deux parties du livre ?', ['« Lire » et « Écrire »', '« L’enfance » et « La guerre »', '« Le père » et « Le grand-père »', '« Avant » et « Après »'], 0, 'Elles couvrent les dix premières années de Sartre.'],
            ['Chez qui Sartre grandit-il ?', ['Chez son grand-père Charles Schweitzer', 'Chez son père', 'Chez une tante en province', 'En pension'], 0, 'Un appartement plein de livres, et un enfant unique adulé.'],
            ['Quel regard Sartre porte-t-il sur son enfance ?', ['Un regard critique : il démonte la comédie qu’il jouait', 'Un regard nostalgique', 'Un regard indifférent', 'Un regard purement documentaire'], 0, 'Il parle de sa « névrose littéraire ».'],
            ['Quelle conclusion tire-t-il sur la littérature ?', ['Elle ne sauve personne — mais il continue d’écrire', 'Elle est le seul salut', 'Elle doit être abandonnée', 'Elle remplace la politique'], 0, '« Que faire d’autre ? »'],
            ['Quel événement marque l’année de publication ?', ['Sartre refuse le prix Nobel', 'Il reçoit le Goncourt', 'Il fonde Les Temps modernes', 'Il quitte la France'], 0, 'C’était en 1964.'],
            ['Le livre couvre toute la vie de Sartre.', ['Vrai', 'Faux'], 1, 'Il s’arrête à ses dix ans environ.'],
          ],
        },
        {
          titre: 'Les Mouches, Jean-Paul Sartre',
          lecon: {
            titre: 'Sartre, 1943 — Oreste sous l’Occupation',
            cours: `## La pièce
Reprise du mythe des **Atrides**, créée à **Paris en 1943** — **sous l’Occupation**.

| Élément | Ce qu’il est |
| **Argos**, quinze ans après le meurtre d’Agamemnon | La ville est **couverte de mouches** et vit dans le **remords organisé** |
| **Égisthe** et **Clytemnestre** | Ils **entretiennent le repentir collectif** — **pour tenir le peuple** |
| **Jupiter** | Leur **complice** |
| **Électre** | Elle **attend la vengeance** |
| **Oreste** | Il revient **étranger, libre et sans attaches** — d’abord **tenté de repartir** |

| Le dénouement | Ce qui distingue les deux |
| **Oreste** tue Égisthe et Clytemnestre | Il **assume entièrement son acte** |
| **Électre** | Elle **s’effondre dans le remords** |
| La fin | Il **refuse le pardon de Jupiter** et **quitte la ville en entraînant les mouches** — comme le **joueur de flûte de Hamelin** |

## À retenir
Pièce **existentialiste** : **l’homme est libre**, il n’y a **pas de nature humaine**, et **assumer ses actes est la seule dignité**.

> Sous l’Occupation, le message était **clair pour qui savait lire** : **refuser le remords et la résignation organisés par le pouvoir**.

Sartre y oppose la **liberté** à **toute autorité — y compris divine**.

> « Je suis ma liberté ! À peine m’as-tu créé que j’ai cessé de t’appartenir. »`,
          },
          questions: [
            ['Que symbolisent les mouches d’Argos ?', ['Le remords collectif entretenu par le pouvoir', 'La peste', 'La guerre', 'La misère du peuple'], 0, 'Égisthe et Jupiter s’en servent pour tenir la ville.'],
            ['En quoi Oreste diffère-t-il d’Électre après le meurtre ?', ['Il assume entièrement son acte, elle s’effondre dans le remords', 'Il fuit, elle reste', 'Il pardonne, elle se venge encore', 'Il se tue, elle règne'], 0, 'Assumer ses actes est la seule dignité selon Sartre.'],
            ['Quel rôle joue Jupiter dans la pièce ?', ['Il soutient l’ordre du remords et propose le pardon', 'Il aide Oreste', 'Il est absent', 'Il punit Égisthe'], 0, 'Oreste lui oppose sa liberté : « je suis ma liberté ».'],
            ['En quelle année la pièce a-t-elle été créée ?', ['1943, sous l’Occupation', '1938', '1946', '1951'], 0, 'Le message était lisible pour qui savait lire.'],
            ['Comment Oreste quitte-t-il la ville ?', ['En entraînant les mouches derrière lui', 'En fuyant de nuit', 'Escorté par l’armée', 'Il ne la quitte pas'], 0, 'Comme le joueur de flûte de Hamelin.'],
            ['La pièce défend l’idée d’une nature humaine fixe.', ['Vrai', 'Faux'], 1, 'Elle affirme l’inverse : l’homme est sa liberté et se définit par ses actes.'],
          ],
        },
        {
          titre: 'Les Nourritures terrestres, André Gide',
          lecon: {
            titre: 'Gide, 1897 — « Nathanaël, je t’enseignerai la ferveur »',
            cours: `## L’œuvre
**Ni roman, ni essai, ni recueil** : un livre **inclassable** — proses, fragments, rondes, journaux de voyage, apostrophes.

| L’adresse | Ce qui est enseigné |
| À un disciple imaginaire, **Nathanaël** | Le **désir**, la **disponibilité**, la **ferveur** |
| Le monde sensible | Les fruits, la **soif**, le vent, les villes d’Afrique du Nord — **Biskra**, Alger — les jardins |

## Le message
Refuser les **possessions**, les **habitudes**, les **familles**, les **doctrines** : « **Familles, je vous hais !** »

> Et surtout **ne pas se laisser enfermer par le livre lui-même** : la dernière page ordonne à Nathanaël de le **jeter** — « Que mon livre t’enseigne à t’intéresser **plus à toi qu’à lui-même**, puis à **tout le reste plus qu’à toi** ».

## À retenir
| Sa réception | Le détail |
| À sa parution, **1897** | **Inaperçu** — une cinquantaine d’exemplaires vendus en dix ans |
| Ensuite | Le **bréviaire de deux générations** : **après 1918**, puis **après 1945** |

> Il marque le **tournant de Gide** : sorti du **symbolisme** et de la **contrainte protestante** **par un voyage en Afrique du Nord**.

Prose **rythmée**, **presque poème**.

> « Nathanaël, je t’enseignerai la ferveur. »`,
          },
          questions: [
            ['À qui le livre s’adresse-t-il ?', ['À Nathanaël, disciple imaginaire', 'À sa femme Madeleine', 'Au lecteur anonyme', 'À Paul Valéry'], 0, 'L’apostrophe donne au livre sa forme d’enseignement.'],
            ['Quel enseignement Gide y délivre-t-il ?', ['La ferveur, le désir et la disponibilité au monde sensible', 'La discipline et l’étude', 'La foi protestante', 'Le renoncement au monde'], 0, 'Fruits, soif, vent et villes d’Afrique du Nord en sont la matière.'],
            ['Quelle formule célèbre exprime le refus des attaches ?', ['« Familles, je vous hais ! »', '« Il faut cultiver notre jardin »', '« Je hais les voyages »', '« Tout est vanité »'], 0, 'Le livre rejette possessions, habitudes et doctrines.'],
            ['Qu’ordonne la dernière page au lecteur ?', ['Jeter le livre', 'Le relire', 'Le transmettre', 'L’apprendre par cœur'], 0, '« Que mon livre t’enseigne à t’intéresser plus à toi qu’à lui-même. »'],
            ['Comment le livre a-t-il été reçu à sa parution ?', ['Il est passé presque inaperçu, avant de devenir culte', 'Il a été un succès immédiat', 'Il a été censuré', 'Il a été salué par l’Académie'], 0, 'Une cinquantaine d’exemplaires vendus en dix ans.'],
            ['Le livre appartient à un genre littéraire bien défini.', ['Vrai', 'Faux'], 1, 'Il est inclassable : proses, fragments, rondes, journal de voyage.'],
          ],
        },
        {
          titre: 'Les Plaideurs, Jean Racine',
          lecon: {
            titre: 'Racine, 1668 — l’unique comédie du tragédien',
            cours: `## La pièce
**Trois actes en vers**, inspirés des *Guêpes* d’**Aristophane** : **la seule comédie de Racine**.

| Personnage | Sa manie |
| Le juge **Dandin** | Une **manie du jugement** si forte que son fils **Léandre** doit **l’enfermer** — il tente de **s’évader par la fenêtre et par la cave** |
| La **comtesse de Pimbesche** | **Plaideuse professionnelle** |
| **Chicanneau** | Bourgeois **processif** — ils s’injurient à qui mieux mieux |

| Le faux procès | Ce qui s’y passe |
| L’accusé | Un **chien**, **Citron**, accusé d’avoir **mangé un chapon** |
| **Petit Jean** | Il plaide |
| **L’Intimé** | Il répond **en style noble** |
| La pièce à conviction | On produit les **chiots du prévenu** — **pour attendrir le tribunal** |
| La fin | **Dandin acquitte, épuisé** |

## À retenir
Une satire de la **justice** et de la **manie procédurière**.

| Type de comique | Où |
| De **mots** | Le **pastiche des plaidoiries** |
| De **gestes** et de **caractère** | La fuite de Dandin, les chiots |

On y trouve le fameux « **Que de discours !** » et la **parodie de l’éloquence judiciaire**.

> Racine **n’écrira plus de comédie** : c’est une **récréation** — mais **une récréation de virtuose**.

> « Ce que je sais le mieux, c’est mon commencement. »`,
          },
          questions: [
            ['Quelle particularité présente cette pièce dans l’œuvre de Racine ?', ['C’est sa seule comédie', 'C’est sa première tragédie', 'Elle est en prose', 'Elle est inachevée'], 0, 'Elle s’inspire des Guêpes d’Aristophane.'],
            ['De quelle manie le juge Dandin souffre-t-il ?', ['Il ne peut s’empêcher de juger', 'Il refuse de juger', 'Il est avare', 'Il est jaloux'], 0, 'Son fils doit l’enfermer pour l’en empêcher.'],
            ['Quel procès burlesque est organisé pour le calmer ?', ['Celui d’un chien accusé d’avoir mangé un chapon', 'Celui d’un domestique voleur', 'Celui de la comtesse de Pimbesche', 'Celui de son propre fils'], 0, 'On produit même les chiots du prévenu.'],
            ['Qui plaide dans ce faux procès ?', ['Petit Jean et L’Intimé', 'Chicanneau et Dandin', 'Léandre et Isabelle', 'La comtesse seule'], 0, 'La parodie de l’éloquence judiciaire est le sommet comique.'],
            ['Que vise la satire de la pièce ?', ['La justice et la manie procédurière', 'La médecine', 'La noblesse de cour', 'L’Église'], 0, 'Racine s’y amuse de l’univers judiciaire de son temps.'],
            ['Racine a écrit plusieurs comédies après celle-ci.', ['Vrai', 'Faux'], 1, 'C’est resté un unicum : une récréation de virtuose.'],
          ],
        },
        {
          titre: 'Les Poètes maudits, Paul Verlaine',
          lecon: {
            titre: 'Verlaine, 1884 — six portraits qui font entrer six poètes dans l’histoire',
            cours: `## L’œuvre
Une série d’**essais-portraits** publiés en revue, puis en volume en **1884**, **complétés en 1888**. Verlaine y présente des poètes **alors inconnus ou méprisés**, **en citant longuement leurs textes**.

| Poète | Son état à l’époque |
| **Tristan Corbière** | **Totalement invisible** |
| **Arthur Rimbaud** | **Parti en Afrique** : ses textes **ne circulaient plus** |
| **Stéphane Mallarmé** | Réputé illisible |
| **Marceline Desbordes-Valmore** | Ajoutée en 1888 |
| **Villiers de L’Isle-Adam** | Idem |
| « **Pauvre Lelian** » | **Anagramme de Paul Verlaine lui-même** |

## L’effet
| Ce que le livre **crée** | Ce qu’il **sauve** |
| Une **catégorie** : le poète **maudit**, incompris de son temps, reconnu **après coup** | Des **œuvres** : sans Verlaine, **Corbière serait resté invisible** |
| — | **Mallarmé y gagne un public** |

## À retenir
Un cas **rare** de **critique littéraire qui modifie le cours de la littérature**.

> Le mot « maudit » vient de **Baudelaire** — « Bénédiction », dans *Les Fleurs du mal* — et **deviendra un cliché**, appliqué à peu près à **tout poète pauvre ou mort jeune**.

> Verlaine y invente moins un mythe qu’il ne répare une injustice.`,
          },
          questions: [
            ['Quels poètes figurent dans la première édition ?', ['Corbière, Rimbaud et Mallarmé', 'Baudelaire, Hugo et Vigny', 'Laforgue, Cros et Nouveau', 'Musset, Nerval et Gautier'], 0, 'Trois inconnus ou méprisés de leur temps.'],
            ['Qui se cache derrière « Pauvre Lelian » ?', ['Paul Verlaine lui-même, par anagramme', 'Rimbaud', 'Mallarmé', 'Villiers de L’Isle-Adam'], 0, 'Il s’ajoute à sa propre liste dans la seconde édition.'],
            ['Quel effet le livre a-t-il eu ?', ['Il a fait connaître des œuvres qui seraient restées invisibles', 'Il a fait scandale sans conséquence', 'Il a été interdit', 'Il a nui à la réputation des poètes cités'], 0, 'Sans lui, Corbière n’aurait pas survécu.'],
            ['D’où vient le mot « maudit » appliqué aux poètes ?', ['De Baudelaire, dans Les Fleurs du mal', 'De Hugo', 'De Verlaine seul', 'De Rimbaud'], 0, 'Le poème « Bénédiction » en donne l’idée.'],
            ['Quelle est la forme des textes ?', ['Des essais-portraits citant longuement les poèmes', 'Des poèmes', 'Des lettres ouvertes', 'Des préfaces d’éditions'], 0, 'La citation abondante fait tout le travail de découverte.'],
            ['Une seule femme figure parmi les poètes présentés.', ['Vrai', 'Faux'], 0, 'Marceline Desbordes-Valmore, ajoutée dans la seconde édition.'],
          ],
        },
        {
          titre: 'Les Précieuses ridicules, Molière',
          lecon: {
            titre: 'Molière, 1659 — la première pièce du succès parisien',
            cours: `## L’histoire
Farce en **un acte et en prose**.

| Étape | Ce qui se passe |
| Le refus | **Magdelon** et **Cathos**, deux provinciales **gorgées de romans précieux** — Scudéry ! —, **éconduisent** les prétendants que leur destine **Gorgibus** |
| Leur motif | Ils **manquent d’élégance** et **vont trop vite en besogne** |
| La vengeance | Les deux hommes envoient leurs **valets déguisés** : le « **marquis de Mascarille** » et le « **vicomte de Jodelet** » |
| L’extase | Les précieuses **s’extasient** devant leurs **impromptus**, leurs **perruques**, leur **jargon** |
| La chute | Les maîtres surviennent, **font bâtonner et déshabiller les faux marquis** |

## À retenir
Créée en **1659** : **c’est la pièce qui lance Molière à Paris**.

| Ce qu’elle vise | Ce qu’elle ne vise pas |
| La **caricature de province** : le **snobisme du langage** | La **préciosité elle-même** — un mouvement littéraire **réel**, animé par des **femmes cultivées** |

| Périphrase célèbre | Ce qu’elle désigne |
| « Le **conseiller des grâces** » | Le **miroir** |
| « Les **commodités de la conversation** » | Les **fauteuils** |

> « Voiturez-nous ici les commodités de la conversation. »`,
          },
          questions: [
            ['Pourquoi Magdelon et Cathos éconduisent-elles leurs prétendants ?', ['Ils manquent d’élégance et de galanterie selon les codes des romans', 'Ils sont pauvres', 'Elles en aiment d’autres', 'Gorgibus s’y oppose'], 0, 'Elles ont la tête pleine de romans précieux.'],
            ['Quelle vengeance les prétendants organisent-ils ?', ['Ils envoient leurs valets déguisés en marquis et vicomte', 'Ils enlèvent les jeunes filles', 'Ils dénoncent Gorgibus', 'Ils quittent Paris'], 0, 'Mascarille et Jodelet séduisent aussitôt les précieuses.'],
            ['Quelle périphrase désigne les fauteuils dans la pièce ?', ['« Les commodités de la conversation »', '« Les conseillers des grâces »', '« Les trônes du repos »', '« Les amis du corps »'], 0, 'Le miroir, lui, est « le conseiller des grâces ».'],
            ['Que vise exactement la satire ?', ['La caricature provinciale de la préciosité, le snobisme du langage', 'Les femmes savantes en général', 'La noblesse de cour', 'Les romans de chevalerie'], 0, 'La préciosité réelle était un mouvement animé par des femmes cultivées.'],
            ['Quel rôle cette pièce a-t-elle joué dans la carrière de Molière ?', ['Elle l’a lancé à Paris en 1659', 'Elle l’a fait interdire', 'Elle a mis fin à sa troupe', 'Elle est restée inédite'], 0, 'Le succès fut immédiat et considérable.'],
            ['La pièce est écrite en cinq actes et en vers.', ['Vrai', 'Faux'], 1, 'C’est une farce en un acte et en prose.'],
          ],
        },
        {
          titre: 'Les Provinciales, Blaise Pascal',
          lecon: {
            titre: 'Pascal, 1656-1657 — dix-huit lettres qui inventent la polémique moderne',
            cours: `## L’œuvre
**Dix-huit lettres** publiées **clandestinement** sous le pseudonyme de **Louis de Montalte**.

| Le contexte | Le détail |
| La défense | **Antoine Arnauld** et les **jansénistes** de **Port-Royal** |
| Les attaquants | La **Sorbonne** et les **jésuites** |

| Les lettres | Leur méthode |
| Les **premières** | Elles **feignent la naïveté** : un provincial demande qu’on lui explique les querelles sur la **grâce** — et l’on découvre que **les mots employés ne veulent rien dire de précis** |
| Les **suivantes** | Elles attaquent **frontalement la casuistique jésuite** |

> Cette morale qui, **à force de distinguer les cas**, **permet de tout justifier** : le **duel**, l’**usure**, le mensonge par « **restriction mentale** ».

## À retenir
Un **modèle de polémique**.

| Arme | Son effet |
| L’**ironie** | Elle désarme |
| La **mise en scène dialoguée** | Elle rend le raisonnement vivant |
| Les **citations exactes** des adversaires | **Retournées contre eux** |
| Une langue **limpide** | Elle rend le débat accessible |

> **Voltaire** y voyait le **premier livre de prose française vraiment moderne**.

Les lettres furent **condamnées et brûlées** — **sans empêcher leur diffusion massive**. Pascal poursuivra sa réflexion dans les *Pensées*, **restées inachevées**.

> « Je n’ai fait celle-ci plus longue que parce que je n’ai pas eu le loisir de la faire plus courte. »`,
          },
          questions: [
            ['Qui Pascal défend-il dans ces lettres ?', ['Antoine Arnauld et les jansénistes de Port-Royal', 'Les jésuites', 'La Sorbonne', 'Le roi'], 0, 'Elles paraissent sous le pseudonyme de Louis de Montalte.'],
            ['Qu’attaque Pascal chez les jésuites ?', ['La casuistique, qui permet de tout justifier', 'Leur enseignement du latin', 'Leur richesse foncière', 'Leur position politique seule'], 0, 'Le duel, l’usure et la « restriction mentale » y passent.'],
            ['Quel procédé emploient les premières lettres ?', ['La feinte naïveté d’un provincial qui demande des explications', 'La démonstration théologique', 'Le récit autobiographique', 'La satire en vers'], 0, 'On découvre que les mots employés ne signifient rien de précis.'],
            ['Combien de lettres composent l’ensemble ?', ['Dix-huit', 'Sept', 'Trente', 'Douze'], 0, 'Publiées entre 1656 et 1657.'],
            ['Quel jugement Voltaire portait-il sur ce livre ?', ['Le premier livre de prose française vraiment moderne', 'Un ouvrage illisible', 'Un texte purement théologique', 'Un pamphlet sans style'], 0, 'La limpidité et l’ironie y ont fait école.'],
            ['Les Provinciales ont été publiées avec l’accord des autorités.', ['Vrai', 'Faux'], 1, 'Clandestines, elles ont été condamnées et brûlées.'],
          ],
        },
        {
          titre: 'Les Raisins de la colère, John Steinbeck',
          lecon: {
            titre: 'Steinbeck, 1939 — la route 66 vers la Californie',
            cours: `## L’histoire
Années **1930** : la **Grande Dépression** et le **Dust Bowl**.

| Étape | Ce qui se passe |
| Le départ | Chassés de leur ferme d’**Oklahoma** par les **tempêtes de poussière**, les **dettes** et les **tracteurs des banques** |
| La famille **Joad** | **Trois générations, douze personnes**, entassées dans un camion |
| La route | La **route 66** vers la **Californie**, attirés par des **prospectus promettant du travail** |
| Les pertes en chemin | Le **grand-père**, puis la **grand-mère** ; le départ de Noah et de Connie |
| L’ancien pasteur **Casy** | Il les accompagne |

| En Californie | La réalité |
| Les **camps sordides** | Les salaires **écrasés par l’afflux de main-d’œuvre** |
| Les **milices** | La répression |
| Les **récoltes détruites** | **Pour maintenir les prix** |

| La fin | Ce qui se passe |
| **Casy**, devenu syndicaliste | Il est **tué** |
| **Tom Joad** | Il le **venge** — et doit **fuir** |
| L’image finale | Dans une grange inondée, **Rose de Saron**, **qui vient de perdre son enfant**, **donne le sein à un homme mourant de faim** |

## À retenir
**Prix Pulitzer 1940**, **Nobel** en **1962**.

> Le roman **alterne** les chapitres du **récit familial** et des chapitres **collectifs**, qui **élargissent à toute une classe**.

Livre **brûlé et interdit dans certains comtés** à sa sortie — **devenu un classique** de la littérature sociale.

> « Partout où il y aura une bagarre pour que les affamés puissent manger, je serai là. »`,
          },
          questions: [
            ['Pourquoi les Joad quittent-ils l’Oklahoma ?', ['Le Dust Bowl, les dettes et les tracteurs des banques les chassent', 'Une inondation', 'Une épidémie', 'Une guerre'], 0, 'Des prospectus leur promettent du travail en Californie.'],
            ['Par quelle route partent-ils ?', ['La route 66', 'La route de l’Oregon', 'La route côtière', 'La piste Santa Fe'], 0, 'Elle est devenue mythique grâce à ce roman.'],
            ['Que trouvent-ils en Californie ?', ['Des camps sordides et des salaires écrasés', 'Le travail promis', 'Des terres à acheter', 'Un accueil syndical organisé'], 0, 'Les récoltes sont même détruites pour maintenir les prix.'],
            ['Qui est Casy ?', ['Un ancien pasteur devenu syndicaliste, tué pendant une grève', 'Le père de famille', 'Un propriétaire californien', 'Le mari de Rose de Saron'], 0, 'Tom Joad le venge et doit fuir.'],
            ['Sur quelle scène le roman se termine-t-il ?', ['Rose de Saron donne le sein à un homme mourant de faim', 'Le retour en Oklahoma', 'Une grève victorieuse', 'La mort de Tom'], 0, 'La fin, très commentée, a beaucoup choqué à l’époque.'],
            ['Le roman a été aussitôt salué partout aux États-Unis.', ['Vrai', 'Faux'], 1, 'Il a été brûlé et interdit dans certains comtés avant de devenir un classique.'],
          ],
        },
        {
          titre: 'Les Rayons et les Ombres, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1840 — le dernier recueil avant l’exil',
            cours: `## Le recueil
Publié en **1840**, il **clôt la première grande période lyrique** de Hugo — après *Les Feuilles d’automne*, *Les Chants du crépuscule*, *Les Voix intérieures*.

> Il faudra attendre **1853** et *Les Châtiments* pour qu’il **publie à nouveau des vers**.

## Les poèmes
| Poème | Ce qu’il porte |
| « **Fonction du poète** » | Il ouvre le recueil : le poète est celui qui « **voit** », **guide le peuple**, **éclaire l’avenir** |
| « **Tristesse d’Olympio** » | Le **retour dans un lieu aimé où la nature a tout oublié** |
| « **Oceano nox** » | Les **marins disparus en mer** et les **familles qui les attendent** |
| « Guitare » | Des vers de **chanson** |

> « Tristesse d’Olympio » se **compare** avec « Le Lac » de **Lamartine** et « Souvenir » de **Musset** : trois traitements du même motif.

## À retenir
Le recueil réunit les **deux versants annoncés par le titre**.

| Les **rayons** | Les **ombres** |
| Le poète **prophète**, l’élan vers l’avenir | Le **deuil**, le **temps**, l’**oubli** |

> C’est le moment où Hugo **cesse d’être un poète intime** pour devenir un **poète public** — ce que **l’exil confirmera**.

> « Le poète en des jours impies vient préparer des jours meilleurs. »`,
          },
          questions: [
            ['Quel poème ouvre le recueil ?', ['Fonction du poète', 'Tristesse d’Olympio', 'Oceano nox', 'Guitare'], 0, 'Il assigne au poète une mission de guide et de voyant.'],
            ['Que raconte « Tristesse d’Olympio » ?', ['Le retour dans un lieu aimé où la nature a tout oublié', 'Un naufrage', 'La mort d’un ami', 'Une bataille'], 0, 'À comparer avec « Le Lac » de Lamartine et « Souvenir » de Musset.'],
            ['Quel poème évoque les marins disparus en mer ?', ['Oceano nox', 'Fonction du poète', 'Guitare', 'Tristesse d’Olympio'], 0, 'Les familles y attendent des hommes qui ne reviendront pas.'],
            ['Que désignent les « rayons » et les « ombres » ?', ['L’élan prophétique et le deuil, les deux versants du recueil', 'Le jour et la nuit d’une journée', 'La ville et la campagne', 'Le passé et l’avenir politiques'], 0, 'Le titre annonce la double tonalité.'],
            ['Combien de temps Hugo attend-il avant de republier des vers ?', ['Treize ans, jusqu’aux Châtiments en 1853', 'Deux ans', 'Vingt-cinq ans', 'Cinq ans'], 0, 'Entre-temps : le théâtre, la politique, le deuil et l’exil.'],
            ['Ce recueil marque le passage du poète intime au poète public.', ['Vrai', 'Faux'], 0, 'C’est précisément ce que « Fonction du poète » annonce.'],
          ],
        },
        {
          titre: 'Les Trois Mousquetaires, Alexandre Dumas',
          lecon: {
            titre: 'Dumas, 1844 — « un pour tous, tous pour un »',
            cours: `## L’histoire
**1625.** Le jeune **d’Artagnan** monte de **Gascogne** à Paris pour entrer dans les mousquetaires du roi.

| Étape | Ce qui se passe |
| L’amitié | Il se lie avec **Athos**, **Porthos** et **Aramis** — **après avoir failli se battre en duel avec les trois le même jour** |
| L’adversaire | Les gardes du **cardinal de Richelieu** |
| L’amour | **Constance Bonacieux**, lingère de la reine |
| La mission | Récupérer à Londres les **ferrets de diamants** que la reine **Anne d’Autriche** a donnés au duc de **Buckingham** |
| Le triomphe | Ils **sauvent l’honneur de la reine sous les yeux du cardinal** |

| L’ennemie | Ce qu’elle est |
| **Milady de Winter** | Espionne **marquée d’une fleur de lys à l’épaule** — **ancienne épouse d’Athos** |
| Ce qu’elle fait | Elle **empoisonne Constance** et **fait assassiner Buckingham** |
| Sa fin | Les mousquetaires **la jugent eux-mêmes** et **la font exécuter** |

## À retenir
Roman-feuilleton de **1844**, écrit avec **Auguste Maquet** — sans doute le **roman d’aventures le plus lu au monde**.

| Sa force | Le détail |
| Le **rythme** et les **dialogues** | Le sens du **chapitre qui s’arrête au bon moment** |
| Sa **devise** | « **un pour tous, tous pour un** » — **passée dans la langue** |

Deux suites : *Vingt ans après* et *Le Vicomte de Bragelonne*.

> « Un pour tous, tous pour un. »`,
          },
          questions: [
            ['D’où vient d’Artagnan ?', ['De Gascogne', 'De Bretagne', 'De Provence', 'De Picardie'], 0, 'Il monte à Paris pour entrer chez les mousquetaires du roi.'],
            ['Comment se lie-t-il aux trois mousquetaires ?', ['Après avoir failli se battre en duel avec les trois le même jour', 'Ils étaient amis d’enfance', 'Ils l’ont recruté', 'Il les sauve d’une embuscade'], 0, 'L’arrivée des gardes du cardinal les rend alliés.'],
            ['Quelle mission les mène à Londres ?', ['Récupérer les ferrets de diamants de la reine', 'Assassiner Buckingham', 'Négocier un traité', 'Escorter le roi'], 0, 'L’honneur d’Anne d’Autriche est en jeu.'],
            ['Qui est Milady de Winter ?', ['Une espionne du cardinal, ancienne épouse d’Athos', 'La sœur de Buckingham', 'La suivante de la reine', 'La mère de Constance'], 0, 'Elle porte une fleur de lys marquée à l’épaule.'],
            ['Quelle devise le roman a-t-il rendue célèbre ?', ['« Un pour tous, tous pour un »', '« Tout pour l’honneur »', '« Servir le roi »', '« Rien sans peine »'], 0, 'Elle est passée dans la langue courante.'],
            ['Dumas a écrit ce roman seul.', ['Vrai', 'Faux'], 1, 'Auguste Maquet a largement collaboré à sa documentation et à sa trame.'],
          ],
        },
        {
          titre: 'Les Trophées, José-Maria de Heredia',
          lecon: {
            titre: 'Heredia, 1893 — cent dix-huit sonnets, trente ans de travail',
            cours: `## Le recueil
Unique recueil de **José-Maria de Heredia** (1842-1905), poète d’origine **cubaine** et figure majeure du **Parnasse**.

| Fait | Le détail |
| Le nombre | **Cent dix-huit sonnets** |
| Le temps de travail | **Trente ans** |
| L’organisation | Une **traversée de l’histoire** |

| Section | Son époque |
| « La Grèce et la Sicile » | L’Antiquité grecque |
| « Rome et les Barbares » | L’Antiquité romaine |
| « Le Moyen Âge et la Renaissance » | L’Europe |
| « L’Orient et les Tropiques » | L’ailleurs |
| « La Nature et le Rêve » | Le présent |

Poèmes célèbres : « **Les Conquérants** », « Antoine et Cléopâtre », « Soir de bataille », « Le Récif de corail ».

## L’esthétique parnassienne
| Contre le romantisme | Ce que le Parnasse vise |
| L’**épanchement** | L’**impersonnalité** |
| L’à-peu-près | Le **culte de la forme**, l’**érudition** |
| Le flou | Des images **précises et éclatantes**, des **rimes riches** |

> Le sonnet doit **se refermer sur un dernier vers frappant** — souvent une **vision colorée** : « Ils regardaient monter en un ciel ignoré / Du fond de l’Océan des **étoiles nouvelles** ».

## À retenir
Heredia entre à l’**Académie française** l’année suivante.

> Son art est celui de l’**orfèvre** : **chaque sonnet est un objet fini, indépendant**, où **l’histoire et le mythe deviennent des tableaux**.

C’est la formule parnassienne **à son point de perfection** — **et à son point de rigidité**, que le **symbolisme** viendra bousculer.

> « Comme un vol de gerfauts hors du charnier natal… »`,
          },
          questions: [
            ['Combien de sonnets le recueil compte-t-il ?', ['Cent dix-huit', 'Cinquante', 'Deux cents', 'Douze'], 0, 'Ciselés pendant trente ans.'],
            ['À quel mouvement Heredia appartient-il ?', ['Le Parnasse', 'Le symbolisme', 'Le romantisme', 'Le surréalisme'], 0, 'Impersonnalité, culte de la forme, érudition.'],
            ['Comment le recueil est-il organisé ?', ['Comme une traversée de l’histoire, de la Grèce aux Tropiques', 'Par ordre alphabétique', 'Par ordre de composition', 'En quatre saisons'], 0, 'Chaque section correspond à une époque ou à un espace.'],
            ['Quel poème évoque les conquistadors ?', ['Les Conquérants', 'Antoine et Cléopâtre', 'Le Récif de corail', 'Soir de bataille'], 0, '« Comme un vol de gerfauts hors du charnier natal… »'],
            ['Sur quoi repose l’effet d’un sonnet de Heredia ?', ['Un dernier vers frappant, souvent une vision colorée', 'Une morale explicite', 'Un récit complet', 'Un dialogue'], 0, 'Le sonnet se referme comme un objet fini.'],
            ['Heredia a publié de nombreux recueils.', ['Vrai', 'Faux'], 1, 'Les Trophées est son unique recueil, publié en 1893.'],
          ],
        },
        {
          titre: 'Les Vrilles de la vigne, Colette',
          lecon: {
            titre: 'Colette, 1908 — le premier livre signé de son seul nom',
            cours: `## Le recueil
**Vingt textes brefs**, écrits pour la presse et réunis en **1908**.

> Ce n’est **ni un roman ni un recueil de nouvelles** : chroniques, souvenirs, dialogues, **poèmes en prose**.

| Le texte liminaire | Ce qu’il raconte |
| Un **rossignol** | Réveillé une nuit par les **vrilles de la vigne qui l’avaient ligoté** |
| Sa décision | **Chanter sans cesse** — **pour ne plus jamais se laisser prendre** |

> C’est un **art poétique en miniature**.

## Le contenu
| Type de texte | Exemples |
| Les **dialogues d’animaux** | **Toby-Chien** et **Kiki-la-Doucette** |
| Les **souvenirs d’enfance** en Puisaye | « Nuit blanche », « Jour gris », « Le Dernier Feu » |
| Les **chroniques** | Le music-hall, le maquillage, les femmes, la province et Paris |

## À retenir
Le livre marque une **émancipation**.

| Avant | Ici |
| Publiée sous le nom de son mari **Willy** — les *Claudine* | Elle signe « **Colette Willy** » et **s’affranchit peu à peu** |

Écriture des **sensations**, phrase **souple**, attention au **vivant**.

> C’est le texte qui **accompagne** *Sido* dans le volume au programme du bac, sous le parcours « **la célébration du monde** ».

> « Plus de nuits, plus de sommeil : je chanterai. »`,
          },
          questions: [
            ['Quelle image donne son titre au recueil ?', ['Un rossignol ligoté par les vrilles, qui chante pour ne plus dormir', 'Une vigne gelée', 'Un vendangeur au travail', 'Un jardin abandonné'], 0, 'C’est un art poétique en miniature.'],
            ['De quoi le recueil est-il composé ?', ['De textes brefs : chroniques, souvenirs, dialogues, poèmes en prose', 'D’un roman continu', 'De poèmes en vers', 'D’une pièce de théâtre'], 0, 'Ils avaient d’abord paru dans la presse.'],
            ['Qui sont Toby-Chien et Kiki-la-Doucette ?', ['Les animaux de Colette, qui dialoguent dans plusieurs textes', 'Deux amis d’enfance', 'Des personnages de music-hall', 'Ses frères'], 0, 'L’animal a chez elle un statut de personnage.'],
            ['Sous quel nom Colette publiait-elle auparavant ?', ['Willy, le nom de son mari', 'Sido', 'Gabrielle Colette', 'Un pseudonyme masculin inventé'], 0, 'Les Claudine avaient paru sous ce nom.'],
            ['À quelle œuvre ce recueil est-il associé au programme du bac ?', ['Sido', 'La Maison de Claudine', 'Le Blé en herbe', 'La Naissance du jour'], 0, 'Sous le parcours « la célébration du monde ».'],
            ['Le recueil raconte une histoire suivie.', ['Vrai', 'Faux'], 1, 'C’est un ensemble de textes courts sans intrigue commune.'],
          ],
        },
        {
          titre: 'Les Yeux d’Elsa, Louis Aragon',
          lecon: {
            titre: 'Aragon, 1942 — poésie d’amour et poésie de résistance',
            cours: `## Le recueil
Publié en **1942** à **Neuchâtel**, en pleine **Occupation**. Le titre vient du poème liminaire, adressé à **Elsa Triolet**, sa femme.

| Poème | Ce qu’il évoque |
| « **Les Lilas et les Roses** » | La **défaite de mai 1940** |
| « Zone libre » | La France coupée en deux |
| « Plus belle que les larmes », « Richard Cœur-de-Lion » | L’amour et la légende |

## La double lecture
Aragon pratique la **contrebande**.

| Ce qui passe la censure | Ce que le lecteur français entend |
| Les poèmes d’**amour** | Le **pays occupé** |
| Les évocations **médiévales** — troubadours, chevaliers, Tristan | La **défaite** et l’**espoir de libération** |

> **La femme aimée y devient aussi la France.**

## Le retour de la forme
Dans la préface, « **Arma virumque cano** », Aragon défend le retour à la **rime** et au **vers régulier** — **contre le vers libre surréaliste dont il vient**.

| Son argument | Sa conséquence |
| Une poésie qui **se retient par cœur** | Peut **se transmettre clandestinement** et **se chanter** |

Il invente la « **rime enjambée** » : la fin d’un vers rime avec le **début du suivant**.

## À retenir
Avec **Éluard**, Aragon est le grand poète de la **Résistance**.

> Ses poèmes, mis en musique par **Ferré**, **Ferrat** et **Brassens**, sont **parmi les plus connus du XXe siècle**.

> « Tes yeux sont si profonds qu’en me penchant pour boire… »`,
          },
          questions: [
            ['À qui le poème liminaire est-il adressé ?', ['À Elsa Triolet, sa femme', 'À sa mère', 'À la France', 'À un compagnon de résistance'], 0, 'Elle donne son nom au recueil.'],
            ['Que permet la « contrebande » poétique d’Aragon ?', ['Faire passer un message de résistance sous l’amour et le Moyen Âge', 'Publier à l’étranger', 'Utiliser un pseudonyme', 'Imprimer sur papier clandestin'], 0, 'La censure allemande n’y voyait que des poèmes d’amour.'],
            ['Quel poème évoque la défaite de mai 1940 ?', ['Les Lilas et les Roses', 'Zone libre', 'Richard Cœur-de-Lion', 'Plus belle que les larmes'], 0, 'Les fleurs du printemps y accompagnent l’exode.'],
            ['Que défend Aragon dans sa préface ?', ['Le retour à la rime et au vers régulier', 'Le vers libre', 'Le poème en prose', 'L’écriture automatique'], 0, 'Une poésie qui se retient par cœur se transmet clandestinement.'],
            ['Quelle invention formelle lui doit-on ?', ['La rime enjambée', 'Le calligramme', 'Le verset', 'Le sonnet renversé'], 0, 'La fin d’un vers y rime avec le début du suivant.'],
            ['Aragon vient du surréalisme.', ['Vrai', 'Faux'], 0, 'Il en fut l’un des fondateurs avant de rompre avec Breton.'],
          ],
        },
        {
          titre: 'Lettre à d’Alembert sur les spectacles, Jean-Jacques Rousseau',
          lecon: {
            titre: 'Rousseau, 1758 — contre le théâtre, et contre les Lumières',
            cours: `## L’occasion
**D’Alembert**, dans l’article « **Genève** » de l’*Encyclopédie*, avait suggéré d’**ouvrir un théâtre** dans la ville.

> Rousseau, **citoyen de Genève**, répond par cette **longue lettre publique**.

## La thèse
| Ce que Rousseau reproche au théâtre | Le détail |
| Il **amollit** les mœurs au lieu de les corriger | Il fait **pleurer sur des malheurs fictifs** — et **ces larmes tiennent lieu d’action réelle** |
| Il **rend le vice aimable** | Il attaque longuement *Le Misanthrope* : **Molière y fait rire d’Alceste**, c’est-à-dire **de l’homme vertueux** |
| Il **isole** les citoyens | Dans une **salle obscure**, **spectateurs passifs** |

| Ce qu’il propose à la place | Le détail |
| Les **fêtes publiques**, en plein air | Le peuple y est **à la fois acteur et spectateur** |

> « Plantez au milieu d’une place un **piquet couronné de fleurs**, rassemblez-y le peuple, **et vous aurez une fête**. »

## À retenir
Le texte **rompt avec les Encyclopédistes** : c’est la **brouille définitive** avec **Diderot** et **d’Alembert**.

> On y trouve, **en germe, toute la pensée de Rousseau** : la **méfiance envers la représentation**, l’éloge de la **transparence**, la préférence pour la **communauté** sur le **spectacle**.

> « On croit s’assembler au spectacle, et c’est là que chacun s’isole. »`,
          },
          questions: [
            ['Qu’avait proposé d’Alembert dans l’Encyclopédie ?', ['Ouvrir un théâtre à Genève', 'Interdire les fêtes publiques', 'Réformer l’Église genevoise', 'Créer une académie'], 0, 'Rousseau, citoyen de Genève, répond par une lettre publique.'],
            ['Quel est le principal reproche de Rousseau au théâtre ?', ['Il amollit les mœurs et remplace l’action par les larmes', 'Il coûte trop cher', 'Il est réservé aux nobles', 'Il ne respecte pas la religion'], 0, 'Les larmes fictives tiennent lieu de vertu réelle.'],
            ['Quelle pièce Rousseau attaque-t-il longuement ?', ['Le Misanthrope de Molière', 'Phèdre de Racine', 'Le Cid de Corneille', 'Tartuffe'], 0, 'Il reproche à Molière de faire rire de l’homme vertueux.'],
            ['Que propose Rousseau à la place du théâtre ?', ['Des fêtes publiques en plein air où le peuple est acteur', 'Des lectures privées', 'Des concerts religieux', 'Rien du tout'], 0, '« Plantez au milieu d’une place un piquet couronné de fleurs… »'],
            ['Quelle conséquence ce texte a-t-il eue ?', ['La rupture définitive avec Diderot et les Encyclopédistes', 'Son expulsion de Genève', 'Son entrée à l’Académie', 'L’interdiction du théâtre en France'], 0, 'La brouille était latente ; elle devient publique.'],
            ['Rousseau reproche au spectacle d’isoler ceux qui s’y rassemblent.', ['Vrai', 'Faux'], 0, '« On croit s’assembler au spectacle, et c’est là que chacun s’isole. »'],
          ],
        },
        {
          titre: 'Lettres d’une Péruvienne, Françoise de Graffigny',
          lecon: {
            titre: 'Graffigny, 1747 — une étrangère juge la France',
            cours: `## L’histoire
Roman **épistolaire**.

| Étape | Ce qui arrive à Zilia |
| L’enlèvement | Jeune **Inca**, elle est enlevée par les **conquistadors** **le jour de ses noces** avec **Aza** |
| La capture | En mer, par des **Français** |
| L’arrivée | Recueillie par le chevalier **Déterville**, elle **ne connaît ni la langue ni les usages** |
| L’écriture | D’abord sur des **quipus** — cordelettes nouées des Incas — puis **en français**, qu’elle apprend |

| Ce que son regard neuf démonte | Le détail |
| Miroirs, carrosses, rites religieux, politesse | Ils deviennent des **énigmes**, donc des **absurdités** |
| L’**éducation des femmes** | **Réduite à des ornements** |

| Le dénouement | Ce qui se passe |
| **Aza**, retrouvé | **Converti**, il va **épouser une Espagnole** |
| **Déterville** | Il **espère** |
| **Zilia** | Elle les **refuse tous les deux** et choisit l’**étude**, l’**amitié** et l’**indépendance** |

## À retenir
**Immense succès du siècle** — plus de **quarante éditions** —, **longtemps oublié**, **redécouvert par la critique féministe**.

| Les deux visées mêlées | Le détail |
| La **satire** | Par le **regard éloigné** |
| La construction d’un **sujet féminin autonome** | **Écrire, c’est d’abord survivre, puis comprendre, enfin exister** |

> Le **refus final du mariage** était **inouï pour l’époque**.

> « Je ne serai ni l’épouse d’Aza, ni celle de Déterville. »`,
          },
          questions: [
            ['Sur quel support Zilia écrit-elle d’abord ?', ['Des quipus, cordelettes nouées incas', 'Du parchemin', 'Des tablettes de cire', 'Des feuilles de palmier'], 0, 'Elle passe ensuite au français, qu’elle apprend.'],
            ['Quel procédé argumentatif le roman emploie-t-il ?', ['Le regard éloigné : une étrangère décrit nos usages', 'La démonstration philosophique', 'La fable animalière', 'Le dialogue socratique'], 0, 'Ce que l’habitude rend invisible devient absurde.'],
            ['Quelle critique sociale domine le roman ?', ['L’éducation des femmes, réduite aux ornements', 'La fiscalité', 'La politique coloniale espagnole seule', 'L’organisation judiciaire'], 0, 'C’est la dénonciation la plus célèbre de l’œuvre.'],
            ['Comment le roman se termine-t-il ?', ['Zilia refuse Aza et Déterville et choisit l’étude et l’amitié', 'Elle épouse Déterville', 'Elle retrouve Aza et l’épouse', 'Elle meurt de chagrin'], 0, 'Un dénouement inouï pour le roman de l’époque.'],
            ['Quel fut le sort du livre après le XVIIIe siècle ?', ['Oublié, puis redécouvert par la critique féministe', 'Toujours au programme', 'Interdit', 'Traduit dans toutes les langues sans interruption'], 0, 'Il avait pourtant connu plus de quarante éditions.'],
            ['Zilia comprend le français dès son arrivée.', ['Vrai', 'Faux'], 1, 'Elle l’apprend peu à peu : le roman est aussi un récit d’apprentissage.'],
          ],
        },
        {
          titre: 'Lettres de mon moulin, Alphonse Daudet',
          lecon: {
            titre: 'Daudet, 1869 — la Provence racontée depuis Paris',
            cours: `## Le recueil
Une **trentaine de contes et chroniques**, parus d’abord **dans la presse** et réunis en **1869**.

| Le dispositif | La réalité |
| Le narrateur écrit depuis un vieux **moulin** de **Fontvieille**, à ses amis parisiens | **Daudet vivait à Paris** — et **n’a jamais possédé ce moulin** |

## Les textes à connaître
| Conte | Ce qu’il raconte |
| « **La Chèvre de M. Seguin** » | La chèvre qui **préfère une nuit de liberté et la mort au piquet** — lettre adressée à un poète **pour lui conseiller de ne pas quitter son emploi** |
| « **Le Secret de maître Cornille** » | Le **dernier meunier** qui **feint de moudre du blé** alors que la **minoterie à vapeur** a tout emporté |
| « **La Mule du pape** » | La mule qui **garde son coup de pied sept ans** |
| « L’Élixir du révérend père Gaucher » | La liqueur qui enrichit le couvent |
| « Les Étoiles », « L’Arlésienne » | La tendresse et le drame |

## À retenir
Des **contes** souvent lus comme des textes pour enfants — **alors qu’ils sont mélancoliques**.

> Ils racontent une **Provence qui disparaît** : **moulins ruinés par l’industrie**, traditions perdues, villages vidés.

L’**humour**, la **légèreté du ton** et l’**oralité** y **masquent une nostalgie constante**.

> « Elle se battit toute la nuit… puis, au matin, le loup la mangea. »`,
          },
          questions: [
            ['Quel est le dispositif fictif du recueil ?', ['Un narrateur écrit depuis un vieux moulin de Provence', 'Un voyageur écrit d’Italie', 'Un curé raconte ses paroissiens', 'Un meunier tient son journal'], 0, 'Daudet vivait en réalité à Paris et ne possédait pas ce moulin.'],
            ['Que raconte « La Chèvre de M. Seguin » ?', ['Une chèvre préfère une nuit de liberté et la mort au piquet', 'Une chèvre perdue retrouvée', 'Un troupeau décimé', 'Un berger et son loup apprivoisé'], 0, 'La lettre conseille à un poète de ne pas quitter son emploi.'],
            ['Quel est le secret de maître Cornille ?', ['Il feint de moudre alors que la minoterie à vapeur a tout emporté', 'Il cache un trésor', 'Il vend de la farine frelatée', 'Il a vendu son moulin'], 0, 'Le conte dit la fin d’un monde artisanal.'],
            ['Quelle tonalité domine sous l’humour ?', ['La mélancolie d’une Provence qui disparaît', 'La colère politique', 'L’exaltation religieuse', 'L’angoisse fantastique'], 0, 'Moulins ruinés, traditions perdues, villages vidés.'],
            ['En quelle année le recueil paraît-il ?', ['1869', '1885', '1850', '1900'], 0, 'Les textes avaient d’abord paru dans la presse.'],
            ['Ce sont des contes uniquement destinés aux enfants.', ['Vrai', 'Faux'], 1, 'Souvent lus comme tels, ils sont bien plus amers qu’il n’y paraît.'],
          ],
        },
        {
          titre: 'Lettres persanes, Montesquieu',
          lecon: {
            titre: 'Montesquieu, 1721 — le regard éloigné',
            cours: `## Le dispositif
**161 lettres**, écrites par une **quinzaine de correspondants**. Deux Persans, **Usbek** et **Rica**, voyagent en Europe et écrivent à leurs amis, à leurs **eunuques** et aux femmes de leur **sérail** resté à **Ispahan**.

## La satire
Faire décrire **nos** usages **par qui ne les comprend pas**.

| Ce qui est décrit | Comment il apparaît |
| Le **roi** | « Un grand **magicien** » qui fait croire que **le papier est de l’argent** |
| Le **pape** | « Un autre magicien » qui fait croire que **trois ne font qu’un** |

> Et la formule restée célèbre : « **Comment peut-on être Persan ?** »

Sont visés la **monarchie absolue**, la **cour**, l’**Église**, la **justice**, la **mode**, le **fanatisme**.

| L’apologue des **Troglodytes**, lettres XI à XIV | Sa question |
| Un peuple égoïste **s’autodétruit** ; une communauté vertueuse **prospère**, puis **demande un roi** | **Quelles institutions rendent la liberté possible ?** |

## Le sérail
Pendant qu’Usbek **philosophe sur la liberté**, **ses femmes se révoltent**.

> La dernière lettre est celle de **Roxane** : elle a **trahi**, elle s’est **empoisonnée**, elle **n’a jamais aimé son maître**.

> **Le penseur de la liberté était un despote chez lui.** Et le sérail apparaît comme un **modèle réduit du despotisme**, **qui s’écroule faute de lois**.

## À retenir
Publié **anonymement** en **1721**. Le roman **annonce** *De l’esprit des lois* (1748) et **fixe le procédé du regard éloigné**, repris tout au long du siècle.

> « Comment peut-on être Persan ? »`,
          },
          questions: [
            ['Combien de lettres composent le roman ?', ['161', '50', '99', '300'], 0, 'Écrites par une quinzaine de correspondants.'],
            ['Comment Rica décrit-il le roi de France ?', ['Comme un grand magicien', 'Comme un tyran', 'Comme un sage', 'Comme un guerrier'], 0, 'Il fait croire que le papier est de l’argent.'],
            ['Que raconte l’apologue des Troglodytes ?', ['Un peuple égoïste s’autodétruit, une communauté vertueuse prospère puis demande un roi', 'La fondation de la Perse', 'Un naufrage', 'Une guerre de religion'], 0, 'Il annonce De l’esprit des lois.'],
            ['Que révèle la dernière lettre de Roxane ?', ['Elle a trahi Usbek, s’est empoisonnée et ne l’a jamais aimé', 'Elle s’est enfuie', 'Elle a pris le pouvoir au sérail', 'Elle demande pardon'], 0, 'Le penseur de la liberté était un despote chez lui.'],
            ['Que représente le sérail ?', ['Un modèle réduit du despotisme, qui s’écroule faute de lois', 'Un décor exotique', 'Un souvenir d’enfance', 'Une utopie'], 0, 'Surveillance, peur et punitions y remplacent le droit.'],
            ['Le roman a été publié sous le nom de Montesquieu.', ['Vrai', 'Faux'], 1, 'Publication anonyme à Amsterdam, pour échapper à la censure.'],
          ],
        },
        {
          titre: 'Lettres, Madame de Sévigné',
          lecon: {
            titre: 'Sévigné, 1671-1696 — mille lettres à une fille',
            cours: `## L’œuvre
Environ **onze cents lettres** conservées.

| Fait | Le détail |
| La destinataire principale | Sa fille, **Madame de Grignan**, **partie vivre en Provence en 1671** |
| Ce que ce départ déclenche | L’**écriture** — et **son ton** : un **amour maternel exalté et douloureux** |
| La publication | **Après sa mort**, à partir de **1725** |

## Ce qu’on y trouve
| La cour de **Louis XIV**, vue de très près | L’épisode |
| Le mariage manqué de la **Grande Mademoiselle** | — |
| La mort de **Vatel** | Il **se transperce de son épée** parce que **la marée n’arrive pas** |
| Le **procès de Fouquet**, les campagnes militaires, l’**affaire des Poisons** | Le siècle en direct |

| La vie quotidienne | Le détail |
| La santé, le **temps qu’il fait**, la lecture | Les **Rochers** en Bretagne, les foins, les paysans |

## Le style
| Trait | Son effet |
| **Vivacité**, **oralité** | « je vous écris **comme je vous parle** » |
| Le passage du **grave au léger** | En une phrase |
| L’art de la **nouvelle frappante** | « je m’en vais vous mander la chose la plus étonnante, la plus surprenante… » |

> Elle écrit **sans se relire** et **sans imaginer être publiée** : **c’est ce qui rend ses lettres si vivantes**.

## À retenir
> La **lettre** devient un **genre littéraire de plein droit**.

On y lit le XVIIe siècle **par les détails** — et la naissance d’une **écriture de l’intime** que le XIXe siècle admirera : **Proust l’a beaucoup citée**.

> « Je vous écris tous les jours ; c’est une joie que je ne puis me refuser. »`,
          },
          questions: [
            ['À qui la plupart des lettres sont-elles adressées ?', ['À sa fille, Madame de Grignan', 'Au roi', 'À son mari', 'À La Fontaine'], 0, 'Son départ pour la Provence en 1671 déclenche l’écriture.'],
            ['Quelle mort célèbre Madame de Sévigné raconte-t-elle ?', ['Celle de Vatel, qui se transperce de son épée', 'Celle de Molière', 'Celle du roi', 'Celle de Fouquet'], 0, 'La marée n’était pas arrivée pour le repas royal.'],
            ['Quand ces lettres ont-elles été publiées ?', ['Après sa mort, à partir de 1725', 'De son vivant', 'Au XIXe siècle seulement', 'Jamais intégralement'], 0, 'Elle n’écrivait pas pour être publiée.'],
            ['Qu’est-ce qui caractérise son style ?', ['La vivacité et l’oralité : « je vous écris comme je vous parle »', 'La solennité', 'L’obscurité savante', 'La brièveté systématique'], 0, 'Elle écrit sans se relire, au fil de l’instant.'],
            ['Quels sujets aborde-t-elle ?', ['La cour, les nouvelles, mais aussi la santé, le temps et la campagne', 'La politique étrangère seule', 'La théologie', 'Le commerce'], 0, 'C’est le XVIIe siècle vu par ses détails.'],
            ['Ses lettres ont fait de la correspondance un genre littéraire.', ['Vrai', 'Faux'], 0, 'Elles ont été admirées et imitées, notamment par Proust.'],
          ],
        },
        {
          titre: 'Lorenzaccio, Alfred de Musset',
          lecon: {
            titre: 'Musset, 1834 — le drame romantique impossible à jouer',
            cours: `## L’histoire
**Florence, 1537.**

| Personnage | Sa position |
| **Alexandre de Médicis** | Duc **débauché**, soutenu par l’**empereur** et par le **pape** : il opprime la ville |
| **Lorenzo**, dit **Lorenzaccio** | Son cousin : il s’est fait son **compagnon de débauche** |
| Son plan | Jouer le **corrompu**, le **lâche**, le **souteneur** — **pour approcher le duc et le tuer** |

> Mais **à force de jouer ce rôle, il est devenu ce qu’il feignait d’être** : « **le vice a été pour moi un vêtement, maintenant il est collé à ma peau** ».

| L’acte et son résultat | Ce qui se passe |
| Il **tue Alexandre** | **Rien ne change** |
| Les **républicains** | **Ils ne se soulèvent pas** |
| Un nouveau duc, **Côme** | **Aussitôt installé** |
| **Lorenzo** | Réfugié à Venise, **assassiné pour la prime mise sur sa tête** |

## À retenir
Pièce écrite **pour la lecture** — les *Spectacles dans un fauteuil*.

| Ce qui la rendait injouable en 1834 | Le détail |
| **Trente-neuf scènes** | Une **quarantaine de personnages** |
| Des **changements de lieu constants** | Elle ne sera **créée qu’en 1896**, avec **Sarah Bernhardt** en Lorenzo |

| Ce qu’elle est | La question qu’elle pose |
| Un drame **politique** et un drame de l’**identité** | **À quoi sert un acte juste dans un monde qui ne veut pas de la liberté ?** |

Musset y transpose la **désillusion des républicains après 1830**.

> « Je suis plus creux et plus vide qu’une statue de fer-blanc. »`,
          },
          questions: [
            ['Pourquoi Lorenzo se fait-il le compagnon de débauche du duc ?', ['Pour l’approcher et le tuer', 'Par goût du plaisir', 'Pour obtenir une charge', 'Par peur des représailles'], 0, 'Le rôle finit par le transformer réellement.'],
            ['Quelle phrase résume sa transformation ?', ['« Le vice a été pour moi un vêtement, maintenant il est collé à ma peau »', '« Je suis ma liberté »', '« Tout est perdu »', '« Le monde est un théâtre »'], 0, 'Le masque est devenu le visage.'],
            ['Que se passe-t-il après le meurtre du duc ?', ['Rien ne change : un nouveau duc est installé aussitôt', 'La République est proclamée', 'Le peuple se soulève', 'Florence est libérée'], 0, 'Les républicains ne bougent pas.'],
            ['Pourquoi la pièce fut-elle longtemps injouable ?', ['Trente-neuf scènes, quarante personnages, changements de lieu constants', 'Elle était censurée', 'Elle était inachevée', 'Elle était écrite en italien'], 0, 'Elle est créée seulement en 1896, avec Sarah Bernhardt.'],
            ['Quelle désillusion politique la pièce transpose-t-elle ?', ['Celle des républicains après 1830', 'Celle de 1789', 'Celle de 1848', 'Celle de l’Empire'], 0, 'Musset écrit quatre ans après les Trois Glorieuses.'],
            ['Lorenzo devient un héros célébré après son geste.', ['Vrai', 'Faux'], 1, 'Il est assassiné à Venise pour la prime mise sur sa tête.'],
          ],
        },
        {
          titre: 'Lucien Leuwen, Stendhal',
          lecon: {
            titre: 'Stendhal, 1894 — le roman inachevé de la monarchie de Juillet',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| L’exclusion | **Lucien Leuwen**, fils d’un **riche banquier** parisien, est **chassé de Polytechnique** pour ses opinions **républicaines** |
| Nancy | Son père lui **achète** un poste de **sous-lieutenant** |
| L’amour | **Madame de Chasteller**, jeune veuve **légitimiste** |
| La machination | On lui fait croire **qu’elle vient d’accoucher** : il part, **désespéré** |
| Paris | **Maître des requêtes** au ministère de l’Intérieur |
| Ce qu’il découvre | La **corruption électorale** de la **monarchie de Juillet** : **achat de voix**, préfets aux ordres, **candidatures officielles** |

> Le roman **s’arrête là** : une **troisième partie, à Rome, n’a jamais été écrite**.

## À retenir
| Fait | Le détail |
| Écriture | Vers **1834-1835** |
| État | **Laissé inachevé** |
| Publication | **Seulement en 1894** |

> C’est le **plus politique** des romans de Stendhal — et un **document de première main** sur le régime de **Louis-Philippe**.

| Marque de l’auteur | Le détail |
| L’**ironie constante** | Le narrateur commente |
| Le **discours indirect libre** | La pensée dans le récit |
| Les **salons de province** | **Nancy y est aussi féroce que Verrières** dans *Le Rouge et le Noir* |

> Le père, **Monsieur Leuwen**, est l’un des personnages **les plus séduisants** de Stendhal : **cynique, drôle, généreux**.

> « Le roman est un miroir… mais ici, c’est le ministère qui se regarde. »`,
          },
          questions: [
            ['Pourquoi Lucien est-il chassé de Polytechnique ?', ['Pour ses opinions républicaines', 'Pour un duel', 'Pour des dettes', 'Pour insuffisance de résultats'], 0, 'Son père lui achète ensuite un poste d’officier à Nancy.'],
            ['Qui est Madame de Chasteller ?', ['Une jeune veuve légitimiste dont Lucien tombe amoureux', 'La femme de son colonel', 'Sa cousine', 'Une actrice parisienne'], 0, 'Une machination le fait renoncer à elle.'],
            ['Que découvre Lucien au ministère de l’Intérieur ?', ['La corruption électorale de la monarchie de Juillet', 'Un complot étranger', 'La faillite de l’État', 'Un trafic d’armes'], 0, 'Achat de voix, préfets aux ordres, candidatures officielles.'],
            ['Quel est l’état du roman ?', ['Inachevé, publié seulement en 1894', 'Achevé et publié en 1835', 'Publié en feuilleton', 'Perdu puis reconstitué'], 0, 'Une troisième partie, à Rome, n’a jamais été écrite.'],
            ['Quel personnage secondaire est particulièrement réussi ?', ['Monsieur Leuwen père, banquier cynique et généreux', 'Le colonel Filloteau', 'Le docteur Du Poirier', 'Madame Grandet'], 0, 'Il est l’un des plus séduisants personnages de Stendhal.'],
            ['C’est le roman le plus politique de Stendhal.', ['Vrai', 'Faux'], 0, 'Il documente de l’intérieur le régime de Louis-Philippe.'],
          ],
        },
        {
          titre: 'Madame Bovary, Gustave Flaubert',
          lecon: {
            titre: 'Flaubert, 1857 — « Mœurs de province »',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le mariage | **Charles Bovary**, officier de santé **médiocre**, épouse en secondes noces **Emma Rouault** — fille de fermier **élevée au couvent** et **nourrie de romans sentimentaux** |
| L’ennui | Tostes, puis **Yonville** |
| Les passions inventées | Le clerc **Léon**, puis le hobereau **Rodolphe** — qui la **séduit et l’abandonne par une lettre lâche** |
| La reprise | Elle **retrouve Léon à Rouen** |
| L’argent | Pour tenir son rêve, elle **emprunte au marchand Lheureux**, s’endette, ment |
| La fin | Menacée de **saisie**, **abandonnée de tous**, elle avale de l’**arsenic** et **meurt dans d’atroces souffrances** |
| Après | Charles **découvre les lettres**, s’effondre et meurt ; leur **fille est placée en filature** |
| L’ironie finale | Le pharmacien **Homais**, symbole de la **bêtise progressiste**, **reçoit la Légion d’honneur** |

## À retenir
**Procès pour outrage aux bonnes mœurs** en **1857** — **acquittement**.

| Trait du **réalisme** | Le détail |
| Un **sujet banal** | Une femme de province |
| Un **style travaillé jusqu’à l’obsession** | Le « gueuloir » |
| Le **discours indirect libre** généralisé | La voix d’Emma dans le récit |
| Une **ironie sans commentaire** | L’auteur ne juge pas |

> Le « **bovarysme** » désigne depuis l’**insatisfaction née de l’écart entre le rêve et la vie**.

> « Madame Bovary, c’est moi. » (attribué à Flaubert)`,
          },
          questions: [
            ['Qu’est-ce qui nourrit les rêves d’Emma ?', ['Les romans sentimentaux lus au couvent', 'Les voyages', 'Le théâtre parisien', 'Les récits de sa mère'], 0, 'L’écart entre ces rêves et la vie provinciale la détruit.'],
            ['Qui sont ses deux amants ?', ['Léon et Rodolphe', 'Homais et Lheureux', 'Charles et Léon', 'Rodolphe et Binet'], 0, 'Rodolphe l’abandonne par une lettre lâche.'],
            ['Qui pousse Emma à s’endetter ?', ['Le marchand Lheureux', 'Le notaire Guillaumin', 'Homais', 'Rodolphe'], 0, 'La saisie imminente précipite le dénouement.'],
            ['Comment Emma meurt-elle ?', ['Elle avale de l’arsenic', 'Elle se noie', 'Elle meurt en couches', 'Elle est tuée en duel'], 0, 'L’agonie est décrite avec une précision clinique.'],
            ['Que désigne le « bovarysme » ?', ['L’insatisfaction née de l’écart entre le rêve et la vie', 'Le goût de la province', 'La passion de la lecture', 'L’adultère bourgeois'], 0, 'Le mot est passé dans la langue courante.'],
            ['Le roman a été condamné lors de son procès.', ['Vrai', 'Faux'], 1, 'Flaubert a été acquitté en 1857 ; Baudelaire, la même année, fut condamné.'],
          ],
        },
        {
          titre: 'Mademoiselle de Maupin, Théophile Gautier',
          lecon: {
            titre: 'Gautier, 1835 — « l’art pour l’art », et un roman scandaleux',
            cours: `## L’œuvre
Roman en partie **épistolaire**.

| Personnage | Ce qu’il est |
| **D’Albert** | Jeune homme en quête d’une **beauté idéale** qu’**aucune femme réelle ne satisfait** |
| **Théodore de Sérannes** | Cavalier élégant dont il **devine ou redoute qu’il soit un homme** |
| La vérité | Théodore est **Madeleine de Maupin** |
| Son projet | **Se déguiser en homme pour observer les hommes tels qu’ils sont entre eux** — **avant de choisir un amant** |

| Le pivot | Ce qu’il produit |
| Une représentation de *Comme il vous plaira* de **Shakespeare** | Où **chacun joue un rôle travesti** : tout le monde est mis **face à ses désirs** |
| La fin | Madeleine **se donne à d’Albert**, **puis à sa maîtresse Rosette** — et **disparaît** |

## À retenir
> La **préface** est **plus célèbre que le roman**.

| Ce qu’elle attaque | Ce qu’elle proclame |
| La **critique moralisante** et l’**utilitarisme** | L’« **art pour l’art** » : « **il n’y a de vraiment beau que ce qui ne peut servir à rien** » |

Le roman lui-même — **travestissement**, **ambiguïté du désir** — fit **scandale** et fut **longtemps mis à l’index**.

> Le personnage s’inspire d’une **figure réelle** : **Julie d’Aubigny**, **cantatrice et duelliste** du XVIIe siècle.

> « Il n’y a de vraiment beau que ce qui ne peut servir à rien. »`,
          },
          questions: [
            ['Qui est Théodore de Sérannes ?', ['Madeleine de Maupin, déguisée en homme', 'Un ami de d’Albert', 'Le frère de Rosette', 'Un acteur de théâtre'], 0, 'Elle veut observer les hommes tels qu’ils sont entre eux.'],
            ['Quelle doctrine la préface proclame-t-elle ?', ['L’art pour l’art', 'Le réalisme', 'L’art social', 'Le naturalisme'], 0, '« Il n’y a de vraiment beau que ce qui ne peut servir à rien. »'],
            ['Quelle pièce est jouée dans le roman ?', ['Comme il vous plaira, de Shakespeare', 'Le Cid', 'Le Misanthrope', 'Roméo et Juliette'], 0, 'Les rôles travestis y révèlent les désirs de chacun.'],
            ['De quelle figure historique le personnage s’inspire-t-il ?', ['Julie d’Aubigny, cantatrice et duelliste', 'Ninon de Lenclos', 'Jeanne d’Arc', 'George Sand'], 0, 'Elle avait défrayé la chronique au XVIIe siècle.'],
            ['Pourquoi le roman fit-il scandale ?', ['Par son sujet : travestissement et ambiguïté du désir', 'Par ses attaques politiques', 'Par son athéisme', 'Par sa violence'], 0, 'Il fut longtemps mis à l’index.'],
            ['La préface est aujourd’hui plus célèbre que le roman.', ['Vrai', 'Faux'], 0, 'Elle est le manifeste de l’art pour l’art, cité dans tous les manuels.'],
          ],
        },
        {
          titre: 'Mangeclous, Albert Cohen',
          lecon: {
            titre: 'Cohen, 1938 — la truculence des Valeureux',
            cours: `## L’œuvre
Suite de *Solal* (1930), **deuxième volet** d’un cycle qui s’achèvera avec *Belle du Seigneur* (**1968**) et *Les Valeureux* (**1969**).

| Les « **Valeureux de France** » | Qui ils sont |
| **Mangeclous** | Avocat, **faux médecin**, **faux prophète**, père de famille nombreuse — et **menteur de génie** |
| **Saltiel** | Le doux |
| **Salomon** | Le naïf |
| **Michaël** | Le beau |
| **Mattathias** | L’avare |

Cousins juifs de **Céphalonie**.

| Le voyage | Ce qui le déclenche |
| Ils apprennent que leur cousin **Solal** est devenu **haut fonctionnaire à Genève** | Ils **entreprennent le voyage pour le rejoindre** |
| Sur leur passage | **Inventions, discours, escroqueries et festins** |

## À retenir
Un livre de **truculence verbale** : discours **interminables**, listes, exagérations, **mélange de sublime et de bouffon**.

> **Mangeclous** est l’un des **grands personnages comiques** de la littérature française du XXe siècle.

| Sous le rire | Le détail |
| Une **élégie** | Pour un **monde juif méditerranéen menacé** — **le livre paraît en 1938** |
| Une préparation | La **mécanique tragique** de *Belle du Seigneur* |

> Les Valeureux sont à Cohen ce que les compagnons de Falstaff sont à Shakespeare.`,
          },
          questions: [
            ['Qui sont les Valeureux ?', ['Des cousins juifs de Céphalonie, menés par Mangeclous', 'Des résistants français', 'Des diplomates genevois', 'Des marchands vénitiens'], 0, 'Ils entreprennent le voyage pour rejoindre Solal.'],
            ['Quel personnage donne son titre au roman ?', ['Mangeclous, avocat et menteur de génie', 'Saltiel', 'Solal', 'Mattathias'], 0, 'Faux médecin, faux prophète, inventeur permanent.'],
            ['À quel cycle le livre appartient-il ?', ['Celui de Solal et des Valeureux, qui mène à Belle du Seigneur', 'Les Rougon-Macquart', 'La Comédie humaine', 'Aucun'], 0, 'Solal (1930), Mangeclous (1938), Belle du Seigneur (1968), Les Valeureux (1969).'],
            ['Quel registre domine le livre ?', ['La truculence verbale et le comique', 'Le tragique', 'Le fantastique', 'Le didactique'], 0, 'Discours interminables, listes et exagérations.'],
            ['Que célèbre le livre sous le rire ?', ['Un monde juif méditerranéen menacé', 'La Genève internationale', 'La bourgeoisie française', 'L’aventure maritime'], 0, 'Il paraît en 1938 : le contexte donne au rire son amertume.'],
            ['Solal est le personnage principal de ce roman.', ['Vrai', 'Faux'], 1, 'Ce sont les Valeureux, et Mangeclous au premier chef, qui occupent le devant.'],
          ],
        },
        {
          titre: 'Manifeste du Surréalisme, André Breton',
          lecon: {
            titre: 'Breton, 1924 — l’acte de naissance d’un mouvement',
            cours: `## Le texte
Publié en **1924**, il donne au **surréalisme** sa **définition**, restée célèbre :

> « **Automatisme psychique pur** par lequel on se propose d’exprimer… **le fonctionnement réel de la pensée**… **en l’absence de tout contrôle exercé par la raison**, en dehors de toute préoccupation esthétique ou morale. »

## Le programme
| Élément | Ce qu’il apporte |
| L’**écriture automatique** | Écrire **vite**, **sans sujet préconçu**, pour **laisser parler l’inconscient** |
| Le **rêve**, le **hasard objectif**, la **folie**, l’**enfance** | Tout ce que **la raison écarte** |
| L’**image surréaliste** | Le **rapprochement de deux réalités éloignées**, d’après **Reverdy** |
| Le **refus du roman réaliste** | Moqué pour ses **descriptions** et sa **psychologie** |

> Sur l’image : **plus l’écart est grand et juste, plus l’image est forte**.

Breton et **Soupault** avaient fait l’expérience de l’automatisme dans *Les Champs magnétiques* (**1919**).

## Les appuis
| Référence | Son rôle |
| **Freud** | La théorie de l’inconscient |
| **Sade**, **Lautréamont**, **Rimbaud**, **Jarry** | Les **précurseurs** revendiqués |

## À retenir
Le manifeste **fonde un mouvement** qui **dominera l’entre-deux-guerres** et **débordera la littérature** : peinture, cinéma, politique.

> Un **second manifeste** suivra en **1930** — **avec exclusions et règlements de comptes**.

> « L’imagination est peut-être sur le point de reprendre ses droits. »`,
          },
          questions: [
            ['Comment Breton définit-il le surréalisme ?', ['Un automatisme psychique pur, hors du contrôle de la raison', 'Un art de la beauté formelle', 'Un réalisme approfondi', 'Une poésie engagée'], 0, 'La définition est restée célèbre mot pour mot.'],
            ['Quelle pratique le manifeste met-il en avant ?', ['L’écriture automatique', 'Le sonnet', 'La description minutieuse', 'La versification régulière'], 0, 'Expérimentée dans Les Champs magnétiques, avec Soupault.'],
            ['Sur quelle théorie de l’image Breton s’appuie-t-il ?', ['Celle de Reverdy : rapprocher deux réalités éloignées', 'Celle de Boileau', 'Celle de Baudelaire seul', 'Celle d’Aristote'], 0, 'Plus l’écart est grand et juste, plus l’image est forte.'],
            ['Quel savant inspire le mouvement ?', ['Freud', 'Darwin', 'Pasteur', 'Einstein'], 0, 'Le rêve et l’inconscient deviennent matière poétique.'],
            ['Quel genre le manifeste tourne-t-il en dérision ?', ['Le roman réaliste et ses descriptions', 'Le théâtre', 'La poésie lyrique', 'L’essai'], 0, 'Breton se moque des portraits et des décors de roman.'],
            ['Il n’y a eu qu’un seul manifeste du surréalisme.', ['Vrai', 'Faux'], 1, 'Un second paraît en 1930, avec son lot d’exclusions.'],
          ],
        },
        {
          titre: 'Manon des sources, Marcel Pagnol',
          lecon: {
            titre: 'Pagnol, 1963 — la vengeance de la fille',
            cours: `## L’histoire
Second volume de *L’Eau des collines*, **suite** de *Jean de Florette*.

| Étape | Ce qui se passe |
| Le point de départ | Une dizaine d’années après la mort de son père, **Manon** est **bergère dans les collines**, à l’écart du village |
| La découverte | Elle trouve **par hasard la source qui alimente Les Bastides** — et **comprend** que les **Soubeyran** avaient bouché celle de son père |
| La vengeance | Elle **obstrue la source du village** : les fontaines **se tarissent**, la panique s’installe, on organise des **processions** |
| **Ugolin** | **Follement amoureux d’elle**, **repoussé**, il **se pend** |
| La révélation | La vieille **Delphine** apprend au **Papet** que **Jean de Florette était son propre fils**, né de son amour de jeunesse avec **Florette** |
| La fin | **Il a tué son enfant sans le savoir.** Il meurt peu après, **léguant tout à Manon** |

## À retenir
> La tragédie se referme comme une **fatalité antique** : **le crime revient sur son auteur par un chemin qu’il n’avait pas prévu**.

| Qui est puni | Comment |
| Le **Papet** | Par la **révélation** |
| Le **village**, complice **par son silence** | **Collectivement, par la soif** |

> **Manon épouse l’instituteur** : **la vengeance ne l’enferme pas**. C’est la nuance qui sauve le livre du pur noir.

> « Il a tué son fils. »`,
          },
          questions: [
            ['Que découvre Manon dans les collines ?', ['La source qui alimente tout le village', 'Un trésor', 'Un document notarié', 'La tombe de son père'], 0, 'Elle comprend alors ce que les Soubeyran avaient fait.'],
            ['Comment se venge-t-elle ?', ['Elle obstrue la source du village', 'Elle dénonce les Soubeyran', 'Elle incendie leur ferme', 'Elle porte plainte'], 0, 'Les fontaines se tarissent et la panique s’installe.'],
            ['Que devient Ugolin ?', ['Amoureux de Manon et repoussé, il se pend', 'Il quitte le village', 'Il épouse Manon', 'Il est arrêté'], 0, 'Sa passion précipite la catastrophe.'],
            ['Que révèle la vieille Delphine au Papet ?', ['Jean de Florette était son propre fils', 'Manon est sa petite-fille par alliance', 'La source appartenait à la commune', 'Ugolin l’avait trahi'], 0, 'Il a tué son enfant sans le savoir.'],
            ['Comment le village est-il puni ?', ['Collectivement, par la soif', 'Par un procès', 'Par un incendie', 'Il ne l’est pas'], 0, 'Son silence l’avait rendu complice.'],
            ['Manon reste enfermée dans sa vengeance à la fin.', ['Vrai', 'Faux'], 1, 'Elle épouse l’instituteur : le cycle se referme sans la détruire.'],
          ],
        },
        {
          titre: 'Manon Lescaut, abbé Prévost',
          lecon: {
            titre: 'Prévost, 1731 — la passion racontée par le coupable',
            cours: `## L’histoire
*Histoire du chevalier Des Grieux et de Manon Lescaut*. Le narrateur premier, **Renoncour**, **recueille le récit de Des Grieux**.

| Étape | Ce qui se passe |
| **Amiens** | À **dix-sept ans**, promis à l’ordre de Malte, il rencontre Manon **qu’on envoie au couvent** — et **s’enfuit avec elle** |
| Paris | La **misère**, puis la **trahison** de Manon avec **M. de B…** |
| **Saint-Sulpice** | Le retour à la religion — et la **rechute le jour de sa thèse** |
| La dérive | La vie de jeu avec le frère **Lescaut**, les escroqueries contre **G… M…** |
| La prison | **Saint-Lazare** pour lui, l’**Hôpital** pour elle — puis l’**évasion** |
| La **Louisiane** | Manon **déportée** ; Des Grieux la suit ; **ils vivent enfin en paix** |
| La fin | **Elle meurt dans le désert**, après un duel |

## À retenir
Parcours possible au bac : **personnages en marge, plaisirs du romanesque**.

| Ce que le dispositif implique | Le détail |
| Tout le roman est la **parole de Des Grieux**, **après coup** | **Manon n’est jamais analysée de l’intérieur** |
| Le narrateur | **Se justifie autant qu’il raconte** |

> Rythme d’**accélération constante** — évasions, duels, larmes, exil — **qui ne laisse jamais le temps de juger**.

> « Nous nous embrassâmes avec une tendresse ardente. »`,
          },
          questions: [
            ['Qui raconte l’histoire ?', ['Des Grieux, dont le récit est rapporté par Renoncour', 'Manon', 'Un narrateur omniscient', 'Tiberge'], 0, 'Nous ne voyons Manon que par les yeux de celui qui l’aime.'],
            ['Où les deux personnages se rencontrent-ils ?', ['À Amiens', 'À Paris', 'Au Havre', 'À Calais'], 0, 'Elle allait au couvent, il était promis à l’ordre de Malte.'],
            ['Quel événement marque la rechute de Des Grieux ?', ['Manon reparaît le jour de sa thèse en Sorbonne', 'Il perd sa fortune au jeu', 'Son père le déshérite', 'Tiberge le trahit'], 0, 'Il croyait pourtant être guéri de sa passion.'],
            ['Où Manon meurt-elle ?', ['Dans le désert de Louisiane', 'À l’Hôpital de Paris', 'Sur le navire', 'À Saint-Lazare'], 0, 'Des Grieux l’enterre de ses mains.'],
            ['Quel personnage incarne la morale et l’amitié ?', ['Tiberge', 'Lescaut', 'M. de B…', 'Synnelet'], 0, 'Toujours écouté, jamais suivi.'],
            ['Le roman donne accès aux pensées de Manon.', ['Vrai', 'Faux'], 1, 'Son opacité est un choix de construction : elle reste insaisissable.'],
          ],
        },
        {
          titre: 'Méditations poétiques, Alphonse de Lamartine',
          lecon: {
            titre: 'Lamartine, 1820 — le premier recueil romantique',
            cours: `## Le recueil
**Vingt-quatre poèmes** publiés en **1820** : succès **immédiat et considérable**.

> On y voit habituellement l’**acte de naissance du romantisme français en poésie**. Lamartine a **vingt-neuf ans**.

## Les poèmes
| Poème | Ce qu’il porte |
| « **Le Lac** » | Le plus célèbre : revenu **seul** au bord du **lac du Bourget**, le poète s’adresse à la nature et au temps — après la mort de **Julie Charles**, l’« **Elvire** » du recueil |
| « **L’Isolement** » | « Un seul être vous manque, et **tout est dépeuplé** » |
| « Le Vallon », « L’Automne », « Le Golfe de Baya » | La méditation, la mort, la mémoire |

> « **Ô temps, suspends ton vol !** »

## Ce qui est neuf
| Élément | Le changement |
| Le **je** lyrique | Il **s’expose directement**, **sans masque mythologique** |
| La **nature** | Elle devient **confidente et miroir de l’âme** : elle **console**, elle **dure quand l’homme passe** |
| Le **vers** | **Classique de facture** — alexandrins, strophes régulières — mais la **musicalité l’emporte sur l’ornement** |
| Les **sujets** | Le sentiment **religieux**, la **mort**, le **temps**, la **mémoire** |

## À retenir
Lamartine sera aussi un **homme politique majeur** — **chef du gouvernement provisoire en 1848**.

> Mais c’est **ce mince recueil** qui a **changé la poésie française**.

> « Ô temps, suspends ton vol ! et vous, heures propices, suspendez votre cours ! »`,
          },
          questions: [
            ['En quelle année le recueil paraît-il ?', ['1820', '1830', '1857', '1800'], 0, 'On y voit l’acte de naissance du romantisme français en poésie.'],
            ['Quel est le poème le plus célèbre du recueil ?', ['Le Lac', 'L’Automne', 'Le Vallon', 'Le Golfe de Baya'], 0, '« Ô temps, suspends ton vol ! »'],
            ['Qui est Elvire ?', ['Julie Charles, la femme aimée et morte', 'Une figure mythologique', 'La mère du poète', 'Sa fille'], 0, 'Sa mort inspire les plus beaux poèmes du recueil.'],
            ['Quel rôle la nature joue-t-elle ?', ['Confidente et miroir de l’âme, elle dure quand l’homme passe', 'Un simple décor', 'Une force hostile', 'Un objet d’étude scientifique'], 0, 'C’est l’un des traits distinctifs du romantisme.'],
            ['Quelle formule de « L’Isolement » est restée célèbre ?', ['« Un seul être vous manque, et tout est dépeuplé »', '« Je est un autre »', '« Le ciel est par-dessus le toit »', '« Sois sage, ô ma Douleur »'], 0, 'Elle a été mille fois citée depuis.'],
            ['Lamartine rompt avec la versification classique.', ['Vrai', 'Faux'], 1, 'Il garde l’alexandrin et les strophes régulières : c’est le ton et le sujet qui changent.'],
          ],
        },
        {
          titre: 'Mémoires d’Hadrien, Marguerite Yourcenar',
          lecon: {
            titre: 'Yourcenar, 1951 — la conscience d’un empereur',
            cours: `## L’œuvre
Une longue **lettre** de l’empereur **Hadrien** (**76-138**), **malade et proche de la mort**, à son petit-fils adoptif **Marc Aurèle**.

> **Six sections** aux titres **latins** — la première, *Animula vagula blandula*, reprend les **premiers mots du poème que la tradition attribue à Hadrien mourant**.

## Le contenu
| Étape de la vie | Ce qu’elle apporte |
| Le **soldat**, le **voyageur**, le **prince** | Les trois âges du récit |
| Sa politique | Il **arrête l’expansion militaire** et **consolide les frontières** — le **mur en Bretagne** |
| Ses œuvres | Il **restaure Athènes**, bâtit la **Villa Adriana** et le **Panthéon** |
| **Antinoüs** | Jeune Bithynien **noyé dans le Nil en 130** — **mort peut-être volontaire**. Il le **divinise** |
| La fin | La **révolte juive**, la **maladie**, la **succession** — et l’**acceptation de la mort** |

## À retenir
Yourcenar a mis **près de trente ans** à écrire ce livre.

> Sa méthode, exposée dans les *Carnets de notes* joints au volume : « **Un pied dans l’érudition, l’autre dans la magie.** »

| Ce que le livre n’est pas seulement | Ce qu’il est |
| Un **roman historique** | Une **méditation** sur le **pouvoir**, le **corps**, l’**art** et la **mort** |

Prose **ample**, de **rythme latin**, **aphoristique**.

> Yourcenar sera, en **1980**, la **première femme élue à l’Académie française**.

> « Tâchons d’entrer dans la mort les yeux ouverts. »`,
          },
          questions: [
            ['Quelle est la forme du livre ?', ['Une longue lettre d’Hadrien à Marc Aurèle', 'Un journal quotidien', 'Un dialogue', 'Un récit à la troisième personne'], 0, 'Un mourant y reprend toute sa vie.'],
            ['Qui est Antinoüs ?', ['Le jeune homme aimé d’Hadrien, noyé dans le Nil', 'Son général', 'Son médecin', 'Son successeur'], 0, 'Hadrien le divinise et ne s’en console pas.'],
            ['Quelle politique impériale Hadrien mène-t-il ?', ['Il arrête l’expansion et consolide les frontières', 'Il conquiert la Perse', 'Il abandonne la Bretagne', 'Il transfère la capitale'], 0, 'Le mur de Bretagne en est le symbole.'],
            ['Combien de temps Yourcenar a-t-elle mis à écrire ce livre ?', ['Près de trente ans', 'Deux ans', 'Six mois', 'Dix ans'], 0, 'Les Carnets de notes racontent cette longue élaboration.'],
            ['Quelle formule résume sa méthode ?', ['« Un pied dans l’érudition, l’autre dans la magie »', '« Le roman est un miroir »', '« Je peins le passage »', '« Écrire, c’est se souvenir »'], 0, 'Documentation historique et reconstruction intérieure.'],
            ['Yourcenar fut la première femme élue à l’Académie française.', ['Vrai', 'Faux'], 0, 'En 1980, près de trente ans après ce livre.'],
          ],
        },
      ],
    },
  ],
}
