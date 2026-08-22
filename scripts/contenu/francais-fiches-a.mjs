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
            cours: `## L’histoire
Serge achète pour **deux cent mille francs** un tableau **entièrement blanc**, signé d’un peintre à la mode. Marc, son ami de quinze ans, le trouve ridicule et le dit. Yvan, le troisième, tente de ménager tout le monde. En une heure trente et une quinzaine de scènes brèves, la discussion sur le tableau devient un règlement de comptes : Marc reproche à Serge de s’être inventé un goût pour se distinguer, Serge reproche à Marc de vouloir rester son maître à penser, Yvan craque au milieu.

## Les personnages
**Serge**, dermatologue, nouveau riche du goût. **Marc**, ingénieur, rationaliste et blessé. **Yvan**, papetier, sur le point de se marier, qui prononce une **tirade célèbre** sur les cartons d’invitation de son mariage. Chacun s’adresse aussi directement au public.

## À retenir
Une pièce contemporaine sur l’**art contemporain**, mais surtout sur l’**amitié masculine** et sur ce qui se joue dans le goût : la peur d’être exclu, le besoin d’être admiré. Comédie grinçante, dialogue rapide, scènes très courtes, décor unique. Créée en 1994, jouée dans le monde entier.

> « Si je suis qui je suis parce que tu es qui tu es… »`,
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
            cours: `## Le poème
**Vingt-cinq quatrains d’alexandrins**, écrits à **seize ans** par un adolescent qui n’a jamais vu la mer. Le poème est envoyé à Verlaine, qui l’invite à Paris. Le « je » est celui d’un **bateau** : les haleurs ont été tués par les Peaux-Rouges, le bateau descend le fleuve puis se perd dans l’océan.

## Le mouvement
Trois temps : la **libération** (plus d’équipage, plus de gouvernail), l’**ivresse** de la vision — visions fabuleuses, « poème de la mer », soleils, aurores, cataractes, monstres —, puis la **fatigue** et le désir de retour : le bateau rêve d’une « flache noire et froide » d’Europe où un enfant lâche un bateau « frêle comme un papillon de mai ».

## À retenir
C’est le manifeste du **poète voyant** : la libération de toute contrainte donne accès à des visions inouïes, mais l’ivresse épuise. Rythme, allitérations, néologismes, images inventées ; l’exotisme y est entièrement **livresque**, tiré des lectures d’enfance. Le poème annonce *Une saison en enfer* et *Illuminations*.

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
            cours: `## L’histoire
Le narrateur, à Paris, apprend par un entrefilet qu’une fête a lieu cette nuit-là au **Valois**, le pays de son enfance. Il part, et le récit se met à naviguer entre trois époques : la fête d’aujourd’hui, l’adolescence auprès de **Sylvie**, la paysanne, et le souvenir d’**Adrienne**, aperçue une fois, chantant dans une ronde, devenue religieuse et morte. À Paris, il aime **Aurélie**, actrice, en qui il croit retrouver Adrienne.

## Les personnages
**Sylvie** : le réel, la tendresse, la vie qui continue — elle épousera un autre. **Adrienne** : l’idéal, la figure inaccessible et morte. **Aurélie** : l’illusion, l’image de théâtre. Le narrateur ne choisit jamais : il court après une femme faite de trois.

## À retenir
Un récit du **temps** et de la **mémoire**, où les époques se superposent sans transition — la prose de Nerval passe du présent au souvenir en une phrase. Chef-d’œuvre de la nouvelle romantique, admiré par Proust, qui y voit l’ancêtre de sa propre entreprise.

> « Ainsi passent les illusions qui font le charme et la joie de la jeunesse. »`,
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
            cours: `## L’histoire
**Félicité** sert pendant un demi-siècle Madame Aubain, à Pont-l’Évêque. Sa vie est une suite de pertes : son fiancé Théodore l’abandonne, **Virginie**, la fille de sa maîtresse qu’elle aime comme la sienne, meurt jeune, son neveu **Victor** meurt au loin, Madame Aubain meurt à son tour. Il lui reste un perroquet, **Loulou**, qu’elle fait empailler et finit par confondre avec le Saint-Esprit. Elle meurt en le voyant s’ouvrir au-dessus d’elle dans le ciel.

## Les personnages
**Félicité**, servante illettrée, d’une bonté sans mesure et sans mots. **Madame Aubain**, maîtresse froide et digne. **Loulou**, le perroquet, seul objet d’un amour qui n’a plus où se poser.

## À retenir
Flaubert écrit ce conte pour George Sand, qui lui reprochait d’être sans cœur. Le style y est d’une **sobriété absolue** : aucune ironie envers Félicité, aucun pathos non plus. La dernière page est l’un des sommets de la prose française — une confusion sublime entre un oiseau empaillé et l’Esprit saint, prise absolument au sérieux.

> « Et Félicité expira… elle crut voir, dans les cieux entrouverts, un perroquet gigantesque. »`,
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
            cours: `## L’histoire
En **Océania**, État totalitaire dirigé par **Big Brother**, **Winston Smith** travaille au **ministère de la Vérité** : son métier consiste à réécrire les archives pour que le passé donne toujours raison au Parti. Il commence un journal interdit, aime **Julia**, croit trouver un allié en **O’Brien** — qui est en réalité un agent de la Police de la Pensée. Torturé dans la **chambre 101**, confronté à ce qu’il redoute le plus, il trahit Julia et finit par aimer Big Brother.

## Les notions du livre
Le **novlangue**, langue appauvrie qui rend la révolte impensable ; la **double-pensée**, capacité de croire deux choses contradictoires ; les **télécrans** qui surveillent en permanence ; les slogans « La guerre c’est la paix, la liberté c’est l’esclavage, l’ignorance c’est la force ».

## À retenir
Le roman ne décrit pas seulement une dictature : il montre qu’un pouvoir total s’attaque d’abord au **langage** et à la **mémoire**. Publié en 1949 par un écrivain socialiste marqué par le stalinisme et la guerre d’Espagne, il a donné au français les mots « Big Brother » et « orwellien ».

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
            cours: `## L’histoire
Deuxième volume d’*À la recherche du temps perdu*. Deux parties : « Autour de Madame Swann », où le narrateur fréquente les Swann à Paris et voit se défaire son amour d’enfance pour **Gilberte** ; puis « Noms de pays : le pays », le séjour à **Balbec**, station balnéaire normande, avec sa grand-mère. Il y rencontre **Robert de Saint-Loup**, le **baron de Charlus**, le peintre **Elstir**, et surtout la « petite bande » de jeunes filles au bord de la mer, parmi lesquelles **Albertine**.

## À retenir
Le livre obtient le **prix Goncourt en 1919**. Ce n’est pas un roman d’action : c’est l’apprentissage d’un regard. Les grands motifs proustiens y sont installés — la **déception** face à ce qu’on avait imaginé (l’église de Balbec, l’actrice la Berma), le **snobisme** des salons, la naissance du désir, et le rôle de l’**art** (Elstir apprend au narrateur à voir).

## La phrase
Longue, ramifiée, avec incises et comparaisons développées : elle épouse le mouvement d’une conscience qui revient sur elle-même. On ne lit pas Proust pour savoir ce qui arrive, mais pour suivre ce mouvement.

> « Les jeunes filles… semblaient m’adresser un salut du fond de leur bonheur inaccessible. »`,
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
            cours: `## L’histoire
**Adolphe**, jeune homme brillant et désœuvré, séduit **Ellénore**, maîtresse d’un comte, plus âgée que lui et mère de deux enfants — d’abord par vanité, pour prouver qu’il en est capable. Elle quitte tout pour lui. Aussitôt qu’il l’a obtenue, il cesse de l’aimer, mais n’ose pas le lui dire : il reste par pitié, par faiblesse, par peur de la faire souffrir. Cette indécision dure des années, ruine leurs deux vies et finit par tuer Ellénore, qui meurt après avoir lu une lettre où Adolphe promettait de la quitter.

## À retenir
Un **récit-confession** très bref, à la première personne, encadré par un « éditeur » qui prétend avoir trouvé le manuscrit. C’est un chef-d’œuvre d’**analyse psychologique** : Constant y démonte la mécanique de la lâcheté sentimentale — comment on peut faire un mal immense en voulant éviter d’en faire. Roman de la génération romantique, contemporain du « mal du siècle », mais d’une sécheresse toute classique.

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
            cours: `## Le recueil
Publié en **1913**, il rassemble quinze ans de poèmes. Sur les épreuves, Apollinaire **supprime toute la ponctuation** : « le rythme même et la coupe des vers, voilà la véritable ponctuation ». L’ordre n’est ni chronologique ni thématique : le recueil s’ouvre sur « **Zone** », écrit en dernier, et se ferme sur « Vendémiaire ».

## Les poèmes à connaître
« Zone » (l’aube parisienne, la tour Eiffel « bergère », les affiches, l’émigration, la religion d’enfance) ; « Le Pont Mirabeau » (l’amour qui passe comme l’eau) ; « La Chanson du mal-aimé » ; « Les Colchiques » ; « Nuit rhénane » ; « Automne malade ».

## À retenir
La modernité d’Apollinaire est un **alliage** : il fait entrer l’aviation, la publicité et la ville industrielle dans le poème, tout en écrivant des chansons régulières qu’on retient par cœur. Amours (Annie Playden, Marie Laurencin), voyages rhénans et Paris fournissent la matière ; le titre dit ce qui enivre et ce qui brûle.

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
            cours: `## L’histoire
Après la chute de Troie, **Andromaque**, veuve d’Hector, est captive à Épire avec son fils **Astyanax**. **Pyrrhus**, roi d’Épire, l’aime et menace de livrer l’enfant aux Grecs si elle le repousse. Or Pyrrhus est fiancé à **Hermione**, qui l’aime, tandis qu’**Oreste**, ambassadeur des Grecs, aime Hermione. La chaîne est parfaite : **Oreste aime Hermione qui aime Pyrrhus qui aime Andromaque qui aime Hector**, mort.
Andromaque accepte d’épouser Pyrrhus, décidée à se tuer après la cérémonie pour sauver son fils sans trahir Hector. Hermione, folle de jalousie, ordonne à Oreste de tuer Pyrrhus. Oreste obéit ; Hermione le maudit et se tue sur le corps de Pyrrhus ; Oreste devient fou.

## À retenir
La tragédie de la **passion** qui rend aveugle et de la **parole** qui engage : chacun exige d’être aimé par celui qui ne le peut pas. Andromaque, elle, tient debout par fidélité au mort. Alexandrins d’une pureté extrême, unité de lieu et de temps, dénouement en cascade.

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
            cours: `## L’histoire
Reprise moderne de Sophocle, créée en **février 1944** sous l’Occupation. **Antigone** enterre son frère **Polynice** malgré l’interdit de **Créon**, son oncle devenu roi. Mais ici, Créon n’est pas un tyran : c’est un homme fatigué qui explique, argumente, tente de sauver sa nièce — il lui révèle même que ses deux frères étaient également indignes et qu’on ne sait pas quel corps a été enterré. Antigone refuse quand même. Elle est murée vivante ; **Hémon**, son fiancé et fils de Créon, se tue ; **Eurydice**, la femme de Créon, se tue. Créon reste, et retourne au conseil.

## À retenir
Un **prologue** présente les personnages et annonce la fin : la tragédie est une mécanique qui « se déroule toute seule ». Le langage est familier, les anachronismes assumés (cigarettes, garde-du-corps qui parlent de leur solde). Le sujet : le **refus absolu** contre le **compromis nécessaire**. Sous l’Occupation, chaque camp y a lu son propre message — c’est l’ambiguïté même de la pièce.

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
            cours: `## L’histoire
Après la guerre fratricide entre **Étéocle** et **Polynice**, fils d’Œdipe, **Créon**, roi de Thèbes, ordonne d’honorer le premier et laisse le second sans sépulture, sous peine de mort. **Antigone**, leur sœur, brave l’interdit et recouvre le corps de terre. Elle est arrêtée, revendique son acte, et invoque les **lois non écrites** des dieux, supérieures aux décrets des hommes. Sa sœur **Ismène** veut partager sa faute ; Antigone refuse. Condamnée à être emmurée, elle se pend. **Hémon**, fils de Créon et fiancé d’Antigone, se tue ; **Eurydice**, mère d’Hémon, se tue. Créon, averti trop tard par le devin **Tirésias**, reste seul.

## À retenir
La tragédie du **conflit des devoirs** : la loi religieuse et familiale contre la raison d’État. Aucun des deux n’a entièrement tort — c’est ce qui la rend inépuisable. Le **chœur** commente et hésite ; la **démesure** (hybris) de Créon le perd. Texte fondateur, relu par Hegel, Anouilh, Brecht et bien d’autres.

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
            cours: `## L’histoire
Sous la Restauration, dans le monde des anciens émigrés qu’une loi vient d’indemniser, **Octave de Malivert**, jeune homme brillant et tourmenté, aime sa cousine **Armance de Zohiloff**, pauvre et fière. Chacun s’interdit d’avouer : Armance parce qu’elle ne veut pas paraître intéressée par la fortune nouvelle d’Octave, Octave parce qu’un **secret** l’empêche d’être l’époux de qui que ce soit — secret que le texte ne nomme jamais et que Stendhal appelait, dans ses lettres, la « babilanisme » (impuissance). Un faux document, fabriqué par une rivale, persuade Octave qu’Armance ne l’aime pas. Marié à elle, il s’embarque pour la Grèce et s’empoisonne à bord.

## À retenir
Premier roman de Stendhal. Un roman du **non-dit** : tout y est retenu, allusif, ce qui a dérouté les lecteurs de 1827. On y trouve déjà la peinture d’une société — le salon aristocratique de la Restauration, l’argent, les calculs de mariage — et l’analyse d’une conscience prise dans son propre secret.

> Sous-titre : « Quelques scènes d’un salon de Paris en 1827 ».`,
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
            cours: `## L’œuvre
Publié en **dix volumes** entre **1649 et 1653** sous le nom de Georges de Scudéry, mais écrit pour l’essentiel par sa sœur **Madeleine**, *Artamène ou le Grand Cyrus* compte environ **deux millions de mots** : c’est le plus long roman de la littérature française. Il raconte, sur fond d’Antiquité perse, les exploits du prince **Cyrus**, qui se fait appeler Artamène, et son amour pour la princesse **Mandane**, enlevée et reprise sans relâche.

## Le roman précieux
Batailles, enlèvements, naufrages, reconnaissances : la trame héroïque sert de cadre à ce qui intéresse vraiment le public — les **conversations**, les portraits, les analyses de sentiments, et surtout les **questions galantes** débattues à l’infini (peut-on aimer sans espoir ? l’absence renforce-t-elle l’amour ?). Les contemporains y reconnaissaient des personnages réels sous les noms antiques : le roman **à clé** était un jeu de salon.

## À retenir
Œuvre centrale de la **préciosité** et du salon de Madeleine de Scudéry, immense succès européen, puis oubliée et raillée dès la fin du siècle. Elle documente mieux qu’aucune autre l’art de la conversation au XVIIe siècle.

> Le roman se lisait par épisodes, en société, comme une série.`,
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
            cours: `## L’histoire
**Denise Baudu**, orpheline venue de Valognes avec ses deux frères, entre comme vendeuse au **Bonheur des Dames**, le grand magasin d’**Octave Mouret**. Elle y découvre la misère du personnel, les renvois, la concurrence entre vendeuses — et, en face, la ruine des petits commerçants du quartier, dont son oncle Baudu. Mouret, séducteur et génie du commerce, tombe amoureux d’elle. Denise résiste, refuse d’être une maîtresse, et finit par l’épouser.

## À retenir
Onzième volume des *Rougon-Macquart*. Zola y peint la naissance du **commerce moderne** : étalages, soldes, publicité, vente par correspondance, exploitation de la clientèle féminine par le désir. Le magasin est décrit comme une **machine** et un **temple**, qui écrase les boutiques anciennes. Roman de la modernité conquérante, plus optimiste que les autres Zola : la destruction y produit du neuf.

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
            cours: `## L’histoire
Deux familles paysannes très pauvres, les **Tuvache** et les **Vallin**, vivent côte à côte avec leurs nombreux enfants. Un couple de bourgeois, **M. et Mme d’Hubières**, sans enfant, propose d’adopter un petit garçon contre une rente. Les Tuvache refusent avec indignation ; les Vallin acceptent et vendent **Charlot** — pardon, leur fils **Jean**. Vingt ans plus tard, Jean revient, riche et élégant, embrasser ses parents. **Charlot** Tuvache, resté paysan, comprend ce que ses parents lui ont coûté en refusant, les insulte et quitte la ferme.

## À retenir
Une nouvelle réaliste très brève, construite sur une **symétrie parfaite** entre les deux familles. Maupassant ne juge pas : il montre que le geste « moral » des Tuvache produit du malheur, et que le geste « scandaleux » des Vallin produit une réussite. La chute retourne le récit d’une phrase. Souvent étudiée pour la construction, le discours rapporté et le patois.

> « Vous avez été des misérables, des parents de malheur ! »`,
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
            cours: `## L’histoire
À Constantinople, pendant que le sultan **Amurat** guerroie contre Babylone, son frère **Bajazet** est retenu prisonnier au sérail. **Roxane**, favorite du sultan à qui il a confié le palais, aime Bajazet et lui propose un marché : l’épouser et régner, ou mourir. Mais Bajazet aime **Atalide**, qui l’aime aussi et qui, pour le sauver, lui conseille de feindre l’amour envers Roxane. Le vizir **Acomat** manœuvre pour ses propres intérêts. Roxane découvre la vérité par une lettre : elle fait exécuter Bajazet, puis est tuée sur ordre d’Amurat ; Atalide se donne la mort.

## À retenir
Seule tragédie de Racine tirée d’une histoire **contemporaine** (les faits datent de 1635) : il justifie ce choix par l’**éloignement géographique**, qui remplace l’éloignement dans le temps. Le sérail y est un espace **clos et mortel**, où la parole est surveillée et où mentir devient une question de survie. Tragédie de la **dissimulation** : chacun joue un rôle et meurt de l’avoir mal joué.

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
            cours: `## L’histoire
**Georges Duroy**, ancien sous-officier d’Afrique sans argent ni talent, entre au journal *La Vie française* grâce à son camarade **Forestier**. Il apprend à écrire — c’est-à-dire à se faire écrire ses articles par **Madeleine Forestier** —, séduit successivement **Clotilde de Marelle**, **Madeleine** (qu’il épouse veuve, avant de la faire surprendre en adultère pour divorcer), puis **Virginie Walter**, la femme du patron, et enfin **Suzanne Walter**, la fille, qu’il enlève et épouse. Devenu « Du Roy de Cantel », il sort de la Madeleine en triomphe, promis à tout.

## À retenir
Un roman de l’**arrivisme** sans châtiment : contrairement à Julien Sorel, Bel-Ami réussit. Peinture féroce du **journalisme** de la IIIe République, de la spéculation coloniale (l’affaire du Maroc) et du pouvoir des femmes dans une société qui prétend les tenir à l’écart. Le style est net, la focalisation collée au personnage — on épouse son regard sans jamais l’approuver.

> « Il avait envie de leur crier : Sales bourgeois ! »`,
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
            cours: `## L’histoire
**Solal**, sous-secrétaire général de la Société des Nations à Genève, beau, riche et juif, séduit **Ariane d’Auble**, épouse d’**Adrien Deume**, petit fonctionnaire médiocre qu’il fait promouvoir pour l’éloigner. La séduction est d’abord une démonstration : Solal, déguisé en vieillard hideux, avait été repoussé ; il revient en séducteur et gagne. Les amants s’enfuient, s’installent sur la Côte d’Azur, et la passion, coupée du monde, se met lentement à mourir d’elle-même : rituels, mensonges, jalousies, ennui. Le roman s’achève sur leur double suicide.

## À retenir
Un roman-monument (plus de mille pages), écrit sur des décennies, qui est à la fois le plus lyrique et le plus **cruel** des romans d’amour français. Il alterne longs monologues intérieurs, satire féroce de la bureaucratie internationale, comédie des « Valeureux » (les cousins de Céphalonie) et pages d’une beauté fulgurante. Prix du roman de l’Académie française en 1968.

> « Amour, seule noblesse. »`,
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
            cours: `## L’histoire
**Titus** vient d’être proclamé empereur de Rome. Il aime **Bérénice**, reine de Palestine, et elle l’aime ; ils devaient se marier. Mais Rome n’accepte pas de reine étrangère. Titus, après avoir hésité et souffert, choisit son devoir et lui annonce qu’il la renvoie. **Antiochus**, roi de Comagène, aime Bérénice en silence depuis cinq ans et espère un instant. À la fin, Bérénice comprend, refuse de se tuer, et part : les trois personnages restent vivants et séparés.

## À retenir
Racine tire de **cinq lignes de Suétone** une tragédie entière — « invitus invitam dimisit », il la renvoya malgré lui, malgré elle. Aucun mort, aucune violence : la tragédie est intérieure. Racine en fait la théorie dans sa préface : il n’est pas besoin de sang, il suffit d’une « **tristesse majestueuse** ». Trois personnages, un seul lieu, une action minimale : c’est l’épure du théâtre classique.

> « Je l’aimais, je le fuis ; Titus m’aime, il me quitte. »`,
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
            cours: `## L’histoire
**Cécile**, dix-sept ans, passe l’été sur la Côte d’Azur avec son père **Raymond**, veuf léger et charmant, et la maîtresse de celui-ci, **Elsa**. Arrive **Anne Larsen**, amie de la mère morte, femme intelligente et rigoureuse, dont Raymond tombe amoureux et qu’il décide d’épouser. Anne veut ordonner cette vie : elle éloigne Cécile de son flirt **Cyril**, l’oblige à travailler. Cécile monte alors une **machination** — faire croire à son père qu’Elsa et Cyril sont amants pour réveiller sa jalousie. Le plan réussit trop bien : Anne surprend Raymond avec Elsa, part en voiture et se tue — accident ou suicide, le roman ne tranche pas.

## À retenir
Écrit à **dix-huit ans**, publié en 1954, prix des Critiques, scandale immédiat par sa liberté de mœurs et son absence de remords. Récit rétrospectif à la première personne, style limpide et rapide. Le titre vient d’un poème d’**Éluard**.

> « Ce sentiment inconnu dont l’ennui, la douceur m’obsèdent… je le nomme du beau nom grave de tristesse. »`,
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
            cours: `## L’histoire
Comédie en **deux actes**. **Boubouroche**, brave homme jovial et naïf, entretient depuis huit ans **Adèle**, qui le trompe. Un vieux voisin, exaspéré, vient le prévenir : un homme se cache chez elle. Boubouroche monte, fouille, découvre effectivement l’amant dans le placard. Mais Adèle, loin de s’excuser, prend les devants : elle se dit outragée par tant de soupçons, retourne complètement la situation, et invente une explication invraisemblable. Boubouroche, soulagé de pouvoir la croire, demande pardon.

## À retenir
La grande scène du **théâtre comique** de Courteline : le comique naît de l’**aveuglement volontaire** — Boubouroche ne se laisse pas tromper, il **choisit** de l’être, parce que la vérité coûterait trop cher. Dialogue vif, langue parlée, personnages de la petite bourgeoisie parisienne. Courteline, auteur de saynètes et de romans (*Messieurs les ronds-de-cuir*, *Le Train de 8 h 47*), est le peintre des bureaux, des casernes et des ménages.

> « Alors, c’est moi qui suis le coupable ? » — « Parfaitement. »`,
          },
          questions: [
            ['Qui est Boubouroche ?', ['Un brave homme naïf trompé par sa maîtresse Adèle', 'Un militaire de carrière', 'Un fonctionnaire de bureau', 'Un avocat'], 0, 'Il l’entretient depuis huit ans.'],
            ['Que découvre Boubouroche chez Adèle ?', ['Un homme caché dans le placard', 'Des lettres compromettantes', 'Une valise prête pour un départ', 'Un enfant caché'], 0, 'Le voisin l’avait prévenu.'],
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
            cours: `## L’histoire
Pendant la **guerre de 1870**, une diligence quitte Rouen occupée pour Le Havre. Dix voyageurs : des commerçants, un couple de nobles, un démocrate, deux religieuses — et **Élisabeth Rousset**, dite **Boule de suif**, prostituée. Affamés, les bourgeois acceptent d’abord son panier de provisions avec reconnaissance. À l’étape de Tôtes, un officier prussien retient la voiture : il exige de coucher avec Boule de suif, qui refuse par patriotisme. Les voyageurs, d’abord solidaires, la pressent, l’endorment de bons arguments, y compris religieux — elle cède. Le lendemain, dans la diligence, tous l’ignorent, mangent devant elle sans rien offrir, tandis qu’elle pleure ; un voyageur siffle *La Marseillaise*.

## À retenir
La nouvelle qui a lancé Maupassant, publiée dans *Les Soirées de Médan*. Un modèle de **construction** : le partage du repas au début, le refus de partage à la fin. La satire vise l’**hypocrisie bourgeoise**, qui sacrifie une femme méprisée puis la punit d’avoir cédé.

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
            cours: `## L’histoire
**Néron** règne depuis trois ans sans avoir encore commis de crime : c’est le « monstre naissant ». Sa mère **Agrippine**, qui l’a fait empereur, veut continuer de gouverner à travers lui. Néron enlève **Junie**, aimée de **Britannicus**, fils de Claude et héritier légitime écarté du trône. Il exige de Junie qu’elle repousse Britannicus devant lui, **caché**, sans rien laisser paraître — l’une des scènes les plus cruelles du théâtre français. Conseillé par **Burrhus**, l’honnête homme, et par **Narcisse**, le traître, Néron choisit le crime : il empoisonne Britannicus au cours d’un banquet de réconciliation. Junie se réfugie chez les Vestales ; Agrippine prophétise la fin de son fils.

## À retenir
Tragédie **politique** : elle montre comment un pouvoir se libère de ses tuteurs et bascule dans la tyrannie. Le personnage central n’est pas la victime mais le **bourreau en formation**. Racine y peint aussi la mère dévorante et le conseiller pervers.

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
            cours: `## L’histoire
À la mort de sa sœur et maîtresse **Drusilla**, l’empereur **Caligula** disparaît trois jours et revient transformé : il a compris que « les hommes meurent et ne sont pas heureux ». De cette évidence il tire une conséquence implacable : puisque le monde est absurde et que rien n’a de sens, il exercera une **liberté totale**. Il fait exécuter au hasard, ruine les patriciens, humilie, s’érige en dieu, réclame la lune. **Cherea** organise le complot au nom d’un monde vivable ; **Scipion**, le jeune poète, comprend Caligula sans le suivre ; **Cæsonia**, sa maîtresse, est étranglée par lui. Les conjurés le tuent ; il crie : « Je suis encore vivant ! »

## À retenir
Écrite dès 1938, créée en **1944**. Pièce du cycle de l’**absurde**, avec *L’Étranger* et *Le Mythe de Sisyphe*. Caligula n’est pas fou : il est **logique**, et c’est cela qui terrifie. Camus montre que la révolte contre l’absurde, si elle nie l’autre, mène au meurtre — thèse qu’il développera dans *L’Homme révolté*.

> « Ce monde, tel qu’il est fait, n’est pas supportable. »`,
          },
          questions: [
            ['Qu’est-ce qui déclenche la transformation de Caligula ?', ['La mort de sa sœur Drusilla et la découverte de l’absurde', 'Une trahison politique', 'Une maladie', 'Un complot du Sénat'], 0, '« Les hommes meurent et ne sont pas heureux. »'],
            ['Quelle conséquence Caligula tire-t-il de l’absurdité du monde ?', ['Il exerce une liberté totale, jusqu’au crime', 'Il abdique', 'Il se réfugie dans la religion', 'Il réforme l’Empire'], 0, 'Il n’est pas fou : il est logique, et c’est cela qui terrifie.'],
            ['Que réclame Caligula à ses proches ?', ['La lune', 'Une statue d’or', 'Un triomphe militaire', 'Le trésor du Sénat'], 0, 'L’impossible, pour dire l’écart entre le désir et le monde.'],
            ['Qui organise le complot contre lui ?', ['Cherea', 'Scipion', 'Cæsonia', 'Hélicon'], 0, 'Il agit au nom d’un monde simplement vivable.'],
            ['À quel cycle de l’œuvre de Camus la pièce appartient-elle ?', ['Le cycle de l’absurde', 'Le cycle de la révolte', 'Le cycle de l’amour', 'Aucun cycle'], 0, 'Avec L’Étranger et Le Mythe de Sisyphe.'],
            ['Caligula meurt en reconnaissant son erreur.', ['Vrai', 'Faux'], 1, 'Il crie « Je suis encore vivant ! » : la révolte se prolonge dans la mort.'],
          ],
        },
        {
          titre: 'Candide ou l’Optimisme, Voltaire',
          lecon: {
            titre: 'Voltaire, 1759 — le conte qui démolit l’optimisme',
            cours: `## L’histoire
**Candide**, jeune homme naïf élevé au château de Thunder-ten-tronckh, apprend de son précepteur **Pangloss** que « tout est au mieux dans le meilleur des mondes possibles ». Chassé pour avoir embrassé **Cunégonde**, il traverse le monde et l’horreur : enrôlement de force chez les Bulgares, tremblement de terre de **Lisbonne**, autodafé de l’Inquisition, esclavage au Surinam (l’épisode du **nègre de Surinam**, mutilé pour produire du sucre), guerres, viols, pendaisons. Il découvre l’**Eldorado**, pays idéal qu’il quitte pourtant. Il retrouve enfin Cunégonde devenue laide, épouse-la quand même, et s’installe avec ses compagnons dans une métairie près de Constantinople.

## À retenir
Un **conte philosophique** : récit rapide, personnages sans épaisseur, ironie constante, hyperboles et litotes. Voltaire y attaque l’**optimisme leibnizien**, la guerre, l’Inquisition, l’esclavage et le fanatisme. La conclusion, célèbre et discutée : renoncer aux systèmes et agir — « **il faut cultiver notre jardin** ».

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
            cours: `## Le recueil
Publié en **1926**, il réunit des poèmes de plusieurs années et installe Éluard comme la grande voix lyrique du **surréalisme**. Le titre, trouvé en dernier, dit la tonalité : la souffrance amoureuse — Gala, sa femme, s’éloigne alors vers Dalí.

## Les poèmes
« **La courbe de tes yeux fait le tour de mon cœur** », « Ta chevelure d’oranges », « L’amoureuse » (« Elle est debout sur mes paupières »), « Je te l’ai dit pour les nuages », « Max Ernst », « Celle de toujours, toute ». Le recueil comprend aussi des sections plus expérimentales, nées de l’écriture automatique et du dialogue avec les peintres (Ernst, Chirico, Picasso).

## À retenir
Éluard est le poète de l’**image simple et inouïe** : peu de mots, souvent monosyllabiques, et un rapprochement qui déplace tout. Vers libres, refus de la ponctuation, syntaxe limpide. Le surréalisme y sert l’amour et non l’inverse : la femme aimée est le lieu où le monde devient visible.

> « La terre est bleue comme une orange. »`,
          },
          questions: [
            ['À quel mouvement le recueil est-il lié ?', ['Le surréalisme', 'Le Parnasse', 'Le symbolisme', 'Le naturalisme'], 0, 'Éluard en est la grande voix lyrique.'],
            ['En quelle année paraît Capitale de la douleur ?', ['1926', '1913', '1945', '1935'], 0, 'Le titre a été trouvé en dernier.'],
            ['Quel vers célèbre ouvre l’un des poèmes du recueil ?', ['« La courbe de tes yeux fait le tour de mon cœur »', '« Sous le pont Mirabeau »', '« Je vous salue ma France »', '« Heureux qui comme Ulysse »'], 0, 'L’image simple y produit un déplacement immense.'],
            ['Quelle image est devenue le manifeste de l’image surréaliste ?', ['« La terre est bleue comme une orange »', '« Mon beau navire ô ma mémoire »', '« Je est un autre »', '« Le ciel est par-dessus le toit »'], 0, 'Rapprochement de deux réalités éloignées, sans justification logique.'],
            ['Quelle est la particularité formelle des poèmes ?', ['Vers libres, sans ponctuation, syntaxe limpide', 'Sonnets réguliers', 'Alexandrins rimés', 'Poèmes en prose exclusivement'], 0, 'Peu de mots, souvent brefs, pour une image inattendue.'],
            ['Le surréalisme d’Éluard exclut le lyrisme amoureux.', ['Vrai', 'Faux'], 1, 'Au contraire : il met les images surréalistes au service de l’amour.'],
          ],
        },
        {
          titre: 'Carmen, Prosper Mérimée',
          lecon: {
            titre: 'Mérimée, 1845 — la liberté jusqu’à la mort',
            cours: `## L’histoire
Un archéologue français voyageant en Andalousie rencontre le bandit **don José**, puis, à Cordoue, une bohémienne, **Carmen**. Plus tard, il retrouve José en prison, la veille de son exécution, et recueille son récit. Brigadier honnête, José a laissé s’échapper Carmen après une rixe à la manufacture de tabac ; il a déserté, tué un officier, rejoint les contrebandiers, tué le mari de Carmen. Elle se lasse et le lui dit : elle est libre, elle ne l’aime plus, elle ne mentira pas. José la poignarde et se livre.

## À retenir
Une **nouvelle** brève, à récits enchâssés, dont l’opéra de Bizet (1875) a éclipsé le texte. Carmen n’est pas une séductrice sans consistance : elle est le personnage qui refuse absolument d’appartenir, et qui **préfère mourir** plutôt que de mentir. Mérimée y mêle exotisme espagnol, dissertation savante sur les Roms et sécheresse du récit — l’une des grandes réussites du **fantastique du réel**.

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
            cours: `## L’histoire
À Rome, **Émilie** veut venger son père, tué par **Auguste** lors des proscriptions. Elle exige de **Cinna**, qui l’aime, qu’il assassine l’empereur pour mériter sa main. Cinna entraîne son ami **Maxime** dans le complot. Or Auguste, las du pouvoir, convoque ses deux conseillers — Cinna et Maxime — pour leur demander s’il doit abdiquer : Cinna, pour garder le tyran à tuer, plaide le maintien de l’Empire. Maxime, amoureux d’Émilie, trahit le complot. Auguste découvre tout. Après une longue délibération intérieure, il choisit de **pardonner** : « Je suis maître de moi comme de l’univers. »

## À retenir
Tragédie **politique** et morale : la clémence n’y est pas une faiblesse mais l’acte le plus fort, celui par lequel Auguste devient réellement empereur. Corneille y déploie ses grands **monologues délibératifs** et son héroïsme de la volonté — on choisit ce qu’on est. Pièce longtemps considérée comme son chef-d’œuvre.

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
            cours: `## L’histoire
Le docteur **Samuel Fergusson**, savant anglais, entreprend de traverser l’**Afrique** d’est en ouest en **ballon**, avec son ami chasseur **Dick Kennedy** et son domestique **Joe**. Le *Victoria* décolle de Zanzibar : cinq semaines de survol au-dessus des lacs, des déserts, des tribus, des fauves, avec pannes, tempêtes, soif, sauvetages et découverte des sources du Nil. L’équipage atteint le Sénégal, épuisé mais victorieux.

## À retenir
Premier roman du cycle des **Voyages extraordinaires**, il inaugure la formule d’**Hetzel** : instruire en amusant. Verne y mêle géographie, physique (le ballon est dirigé par variation de température du gaz, invention centrale du livre), suspense et humour. Le regard porté sur l’Afrique est celui de son époque, colonial et daté — c’est un point à savoir signaler.

> Le roman rendit Verne célèbre à trente-cinq ans.`,
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
            cours: `## L’œuvre
Roman-fleuve en **dix volumes**, publié entre 1654 et 1660. L’intrigue se situe dans la Rome des débuts de la République : **Clélie**, promise à **Aronce**, est enlevée, séparée, poursuivie ; guerres, tremblements de terre et reconnaissances remplissent des milliers de pages. Comme dans *Artamène*, la trame héroïque encadre l’essentiel : les **conversations** et les analyses du sentiment amoureux.

## La carte de Tendre
Le roman contient la fameuse **carte de Tendre**, gravure allégorique où l’on voyage de Nouvelle-Amitié vers trois villes de Tendre — Tendre-sur-Estime, Tendre-sur-Reconnaissance, Tendre-sur-Inclination — en passant par les villages de Petits-Soins, Billet-Doux, Sincérité, et en évitant le lac d’Indifférence ou la mer d’Inimitié. C’est une **cartographie du sentiment**, née d’un jeu de salon.

## À retenir
Document majeur sur la **préciosité** et sur le pouvoir des femmes dans les salons du XVIIe siècle : Madeleine de Scudéry y théorise une relation amoureuse fondée sur l’estime, la conversation et le mérite — et non sur le mariage arrangé.

> La carte de Tendre est le premier « plan » d’un sentiment dans la littérature française.`,
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
            cours: `## L’histoire
**Orso della Rebbia**, ancien officier de Napoléon, rentre en **Corse** après la mort de son père, tué — dit-on — par les **Barricini**, la famille rivale. Sa sœur **Colomba**, farouche gardienne de l’honneur familial, le pousse à la **vendetta** par tous les moyens : chants funèbres improvisés (*voceri*), rumeurs, preuves montées. Orso, formé sur le continent, veut la justice et non la vengeance ; il aime **Lydia Nevil**, jeune Anglaise en voyage. Attaqué en chemin, il tue les deux fils Barricini en légitime défense. Il épouse Lydia ; Colomba, satisfaite, croise le vieux Barricini brisé et lui adresse une parole terrible.

## À retenir
Une **nouvelle longue** qui mêle roman d’aventures, ethnographie et étude de caractères. Mérimée oppose deux mondes : la **loi** moderne et la **coutume** archaïque, et donne à la seconde une figure inoubliable — Colomba, plus déterminée que tous les hommes du récit. Style sec, dialogues nombreux, couleur locale documentée.

> « Il faut que ce soit toi, ou personne. »`,
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
            cours: `## Le recueil
*Histoires ou contes du temps passé, avec des moralités*, publié en **1697** sous le nom du fils de Perrault, porte en frontispice l’inscription « Contes de ma mère l’Oye ». Huit contes en prose : **La Belle au bois dormant**, **Le Petit Chaperon rouge**, **La Barbe bleue**, **Le Maître Chat ou le Chat botté**, **Les Fées**, **Cendrillon**, **Riquet à la houppe**, **Le Petit Poucet**.

## Ce que fait Perrault
Il **écrit** des récits jusque-là oraux et populaires, dans une langue élégante et brève, pour un public de cour. Chaque conte se termine par une ou deux **moralités en vers**, souvent ironiques, parfois en décalage avec le récit — celle du Petit Chaperon rouge met en garde les jeunes filles contre les « loups » de salon.

## À retenir
Perrault est aussi l’un des chefs des **Modernes** dans la querelle des Anciens et des Modernes : écrire des contes français plutôt que d’imiter l’Antiquité est un geste polémique. Les contes fixent des structures que la psychanalyse, l’ethnologie (Propp) et le cinéma exploiteront sans fin. Le Petit Chaperon rouge, chez Perrault, **meurt** — la fin heureuse vient des frères Grimm.

> « Les loups doucereux… sont de tous les loups les plus dangereux. »`,
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
            cours: `## L’œuvre
Les deux écrivains se rencontrent en **1890**, à Montpellier, alors qu’ils ont une vingtaine d’années. Ils s’écrivent jusqu’à la mort de Valéry, soit plus d’un demi-siècle. La correspondance, publiée après leur mort, forme un document unique sur la naissance de deux œuvres et sur une amitié faite d’admiration, d’exigence et de désaccords.

## Ce qu’on y lit
Les débuts symbolistes, l’influence de **Mallarmé** et de ses « mardis », le silence de vingt ans de Valéry qui abandonne la poésie pour les mathématiques et les *Cahiers*, la fondation de la **NRF** par Gide, les doutes sur la valeur de la littérature, les lectures partagées, les jugements sur les contemporains — et la vie quotidienne, les maladies, les voyages.

## À retenir
La correspondance d’écrivains est un **genre** à part entière : elle donne accès à l’atelier, à la formation d’une pensée, aux hésitations que l’œuvre publiée efface. Ici, deux tempéraments opposés — Gide le sincère, l’inquiet, l’autobiographe ; Valéry l’intellectuel, le sceptique, l’analyste — se lisent et se corrigent.

> Le meilleur portrait de deux écrivains est souvent celui qu’ils font l’un de l’autre.`,
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
            cours: `## L’histoire
**Cyrano**, cadet de Gascogne, bretteur, poète et redoutable en tout, aime sa cousine **Roxane** — mais son **nez** immense lui interdit d’espérer. Roxane aime **Christian**, beau et sans esprit, nouvellement enrôlé chez les cadets. Cyrano lui prête ses mots : billets, puis la fameuse **scène du balcon**, où il parle dans l’ombre pendant que Christian recueille le baiser. Au siège d’**Arras**, il écrit chaque jour à Roxane au nom de Christian, qui meurt au combat. Quinze ans plus tard, au couvent, Roxane comprend enfin, en entendant Cyrano lire la dernière lettre par cœur, à la nuit tombée. Il meurt, revendiquant son « **panache** ».

## À retenir
**Comédie héroïque en cinq actes et en vers**, créée en 1897, immense succès jamais démenti. Rostand y ressuscite le drame romantique à la fin du siècle du naturalisme. Verve, tirades virtuoses (la **tirade des nez**, la ballade du duel), mélange de rire et de larmes. Le personnage a existé : Savinien de Cyrano de Bergerac, écrivain libertin du XVIIe siècle.

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
            cours: `## L’œuvre
Publié anonymement à Genève en **1748** après une vingtaine d’années de travail, l’ouvrage compte trente et un livres. Son projet : comprendre les lois non comme des décrets arbitraires, mais comme des **rapports** — « les lois, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses ».

## Les thèses à retenir
- **Trois types de gouvernement**, chacun avec son ressort : la **république** (vertu), la **monarchie** (honneur), le **despotisme** (crainte).
- La **séparation des pouvoirs** — législatif, exécutif, judiciaire — inspirée de l’observation de l’Angleterre : « il faut que, par la disposition des choses, le pouvoir arrête le pouvoir ». Cette idée passera dans la Constitution américaine et dans la Déclaration de 1789.
- La **théorie des climats** : le climat, le terrain, les mœurs influencent les lois. Thèse aujourd’hui contestée, mais qui fonde une approche **comparatiste** et sociologique du droit.
- Une dénonciation de l’**esclavage**, dans un chapitre d’**ironie** célèbre (« De l’esclavage des nègres »), où Montesquieu feint d’argumenter en sa faveur pour en montrer l’absurdité.

> « Pour qu’on ne puisse abuser du pouvoir, il faut que le pouvoir arrête le pouvoir. »`,
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
            cours: `## Le texte
Écrit en **1486** par un jeune érudit italien de vingt-trois ans, ce discours devait ouvrir une dispute publique à Rome sur **neuf cents thèses** philosophiques et théologiques. Le pape en interdit la tenue ; le discours, resté sans public, est publié après la mort de son auteur et devient le texte emblématique de l’**humanisme de la Renaissance**.

## La thèse
Dieu, ayant créé le monde, n’avait plus de place ni de nature disponible pour l’homme. Il lui donne alors ce qu’aucune créature n’a : **aucune place fixe, aucune forme propre**. L’homme n’a pas de nature déterminée — il est **ce qu’il se fait**. Il peut dégénérer vers l’animal ou s’élever vers l’ange ; le choix lui appartient.

## À retenir
C’est la première formulation nette de la **liberté** comme définition de l’humain, et l’acte de naissance d’une pédagogie : si l’homme se fait, alors l’**éducation** est tout. Pic défend aussi la **concorde** des savoirs — il veut concilier Platon, Aristote, la Kabbale, les Arabes et les Pères de l’Église.

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
            cours: `## Le texte
Publié en **septembre 1791**, il calque la **Déclaration des droits de l’homme et du citoyen** de 1789 pour y inscrire les femmes. Structure : une **dédicace à la reine**, un **préambule** au nom des « mères, filles, sœurs, représentantes de la nation », **dix-sept articles** dans l’ordre exact du texte de 1789, un **postambule** enflammé, et un projet de **contrat social** entre l’homme et la femme.

## L’article X
« La femme a le droit de monter sur l’échafaud ; elle doit avoir également celui de monter à la tribune. » L’argument : puisque la loi punit les femmes comme des citoyennes, elle doit les représenter comme telles. Olympe de Gouges sera **guillotinée en 1793**.

## À retenir
Le **pastiche** est l’arme : reprendre le texte fondateur mot pour mot rend l’exclusion criante sans avoir à la démontrer. Le postambule change de registre (« Femme, réveille-toi ») parce qu’il s’adresse aux femmes elles-mêmes. Autrice de théâtre et abolitionniste (*L’Esclavage des Noirs*), elle réclame l’égalité politique, civile et d’expression. Les Françaises voteront en **1944**.

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
            cours: `## Le texte
Publié en **1549**, ce manifeste en deux livres accompagne le recueil *L’Olive* et parle au nom d’un groupe de jeunes poètes, la future **Pléiade** (Ronsard, Du Bellay, Baïf, Jodelle…). Son but : prouver que le **français** peut être une grande langue littéraire, à l’égal du latin et du grec.

## Les thèses
- **Défendre** : le français n’est pas pauvre par nature, il l’est par manque de culture. Il faut donc l’enrichir.
- **Illustrer** : par l’**imitation** créatrice des Anciens et des Italiens — non les traduire, mais faire en français ce qu’ils ont fait dans leur langue —, par des **emprunts** au grec, au latin, aux dialectes et aux métiers, par des **néologismes**.
- **Abandonner** les formes médiévales jugées basses (rondeaux, ballades, virelais) au profit du **sonnet**, de l’**ode**, de l’**élégie**, de la **tragédie** à l’antique.
- Le poète doit **travailler** : l’inspiration ne suffit pas, il faut « limer et relimer ».

## À retenir
Texte fondateur de la poésie française moderne, et acte politique : trois ans plus tôt, l’ordonnance de **Villers-Cotterêts** (1539) avait imposé le français dans les actes officiels. La langue devient une affaire nationale.

> « Je ne crois pas qu’on puisse apprendre autrement que par imitation. »`,
          },
          questions: [
            ['Quel groupe de poètes ce manifeste représente-t-il ?', ['La Pléiade', 'Les Grands Rhétoriqueurs', 'Le Parnasse', 'Les surréalistes'], 0, 'Ronsard, Du Bellay, Baïf, Jodelle et leurs compagnons.'],
            ['Quelle est la thèse centrale du texte ?', ['Le français peut égaler le latin et le grec, à condition d’être enrichi', 'Le latin doit rester la langue des lettres', 'Il faut créer une langue nouvelle', 'La poésie doit être orale'], 0, 'Le français n’est pas pauvre par nature, mais par manque de culture.'],
            ['Par quel moyen principal enrichir la langue ?', ['L’imitation créatrice des Anciens et des Italiens', 'La traduction littérale', 'Le retour au vieux français', 'L’invention pure'], 0, 'Faire en français ce qu’ils ont fait dans leur langue.'],
            ['Quelles formes le manifeste recommande-t-il d’abandonner ?', ['Rondeaux, ballades et virelais', 'Sonnets et odes', 'Élégies et tragédies', 'Épîtres et satires'], 0, 'Elles sont jugées médiévales et basses.'],
            ['Quelle ordonnance royale précède le texte de dix ans ?', ['Villers-Cotterêts, 1539', 'L’édit de Nantes, 1598', 'L’édit de Fontainebleau', 'La pragmatique sanction'], 0, 'Elle impose le français dans les actes officiels : la langue devient nationale.'],
            ['Selon Du Bellay, l’inspiration suffit au poète.', ['Vrai', 'Faux'], 1, 'Il faut travailler, « limer et relimer » : la poésie est un métier.'],
          ],
        },
        {
          titre: 'Des Souris et des Hommes, John Steinbeck',
          lecon: {
            titre: 'Steinbeck, 1937 — le rêve d’une ferme, en Californie',
            cours: `## L’histoire
Pendant la **Grande Dépression**, deux ouvriers agricoles itinérants arrivent dans un ranch de Californie : **George Milton**, petit et vif, et **Lennie Small**, colosse doux et déficient mental, qui aime caresser les choses douces et ne mesure pas sa force. Ils partagent un rêve : acheter une petite ferme et « vivre de la crème du pays », avec des lapins que Lennie soignerait. Au ranch, ils rencontrent Candy le vieux manchot, Crooks le palefrenier noir isolé, Slim le charretier respecté, et Curley, fils du patron, agressif, dont la **femme** s’ennuie. Lennie tue accidentellement un chiot, puis, dans la grange, la femme de Curley en voulant la faire taire. Traqué, il s’enfuit. George le retrouve, lui raconte une dernière fois le rêve de la ferme, et lui tire une balle dans la nuque pour lui épargner le lynchage.

## À retenir
Un **roman court**, écrit comme une pièce (six chapitres = six scènes, presque uniquement des dialogues et des indications de lieu). Thèmes : la **solitude**, l’**amitié**, le rêve américain inaccessible, la brutalité faite aux plus faibles. Le titre vient d’un vers de **Robert Burns** : les plans les mieux conçus des souris et des hommes tournent souvent mal.

> « On a quelqu’un, nous. »`,
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
            cours: `## L’histoire
Deux récits alternés. Le premier, en **1909-1912**, suit les **hommes bleus** du Sahara occidental, guidés par le cheikh **Ma el Aïnine**, chassés par la colonisation française : parmi eux, l’enfant **Nour**. Leur longue marche vers le nord s’achève par le massacre des combattants et la dispersion du peuple. Le second, contemporain, suit **Lalla**, jeune descendante de ces nomades, qui grandit dans un bidonville près de Tanger, refuse un mariage arrangé, émigre à **Marseille** où elle connaît la misère et un bref succès comme modèle photographique, puis revient au désert pour accoucher sous un arbre.

## À retenir
Le roman qui a installé Le Clézio comme grand écrivain (prix Nobel 2008). Écriture **sensorielle** — lumière, sable, vent, chaleur — et lente, qui préfère la contemplation à l’action. Deux thèmes forts : la **destruction des peuples nomades** par la colonisation, et l’**exil** urbain vécu comme une seconde dépossession. La ville y est décrite comme un désert plus hostile que le vrai.

> « Ils étaient venus du sud, avec le vent, comme s’ils n’avaient pas de commencement. »`,
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
            cours: `## L’œuvre
Publié anonymement en **1764** sous le titre *Dictionnaire philosophique portatif*, l’ouvrage rassemble des **articles courts** classés par ordre alphabétique : Abbé, Âme, Athée, Baptême, Fanatisme, Guerre, Liberté, Superstition, Tolérance… Voltaire l’augmente jusqu’en 1769. Le format est une arme : petit, bon marché, facile à cacher et à faire circuler, contrairement aux in-folio de l’*Encyclopédie*.

## La méthode
Chaque article part d’un exemple, d’une étymologie ou d’une anecdote, puis glisse vers la critique : l’**ironie**, la **fausse naïveté**, le **dialogue** et le **récit bref** y font tout le travail. L’article « Guerre » énumère avec un calme apparent les massacres commis au nom de causes dérisoires ; l’article « Fanatisme » compare le fanatique au malade contagieux.

## À retenir
Cible principale : l’**intolérance religieuse**, les dogmes, la superstition, la cruauté légale. L’ouvrage fut condamné et brûlé. Il illustre l’idée que la forme brève et **portative** est la meilleure alliée des Lumières : on ne combat pas un préjugé par un traité, mais par cent piqûres.

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
            cours: `## Le texte
Écrit vers **1548** par un très jeune homme, publié après sa mort et repris par des pamphlétaires protestants. Aussi appelé *Contr’un*. Il pose une question inversée : non pas comment le tyran soumet le peuple, mais **pourquoi le peuple accepte**.

## La thèse
Un homme seul ne peut rien contre des millions. S’il domine, c’est que les dominés lui **prêtent** leur force : la servitude est donc **volontaire**, et la solution immédiate : « **Soyez résolus de ne servir plus, et vous voilà libres.** » Pas d’armes, pas de bataille — un retrait du consentement.

## Les trois ressorts de l’obéissance
1. La **coutume** : on naît sous le joug et on le croit naturel.
2. Le **divertissement** : jeux, théâtres, distributions — le pouvoir amuse ceux qu’il dépouille.
3. La **chaîne des complices** : cinq ou six profitent du tyran, six cents d’eux, six mille ensuite — une pyramide d’intérêts.

## À retenir
Style oral et brûlant : apostrophes, questions rhétoriques, métaphores (le colosse, la chaîne, le feu). Texte repris par tous les camps — protestants, révolutionnaires, anarchistes, théoriciens de la désobéissance civile. La Boétie était l’ami intime de **Montaigne**, qui lui consacre « De l’amitié ».

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
            cours: `## L’histoire
Comédie en **cinq actes et en prose**, créée en **1665** puis retirée après quinze représentations. **Dom Juan** a enlevé **Elvire** d’un couvent et l’a épousée avant de l’abandonner. Il fuit avec son valet **Sganarelle**, tente d’enlever une fiancée en mer, fait naufrage, promet le mariage à deux paysannes le même jour (**Charlotte** et **Mathurine**), refuse l’aumône à un pauvre à condition qu’il jure, sauve un homme attaqué, croise la statue du **Commandeur** qu’il a tué et l’invite à souper. Poursuivi par ses créanciers (M. Dimanche), par son père (Dom Louis) et par les frères d’Elvire, il feint la **conversion** — « l’hypocrisie est un vice à la mode » — avant que la statue ne l’entraîne dans les flammes. Sganarelle réclame ses gages.

## À retenir
Un héros **libertin** au double sens : de mœurs et de pensée. Il ne croit « qu’au fait que deux et deux sont quatre ». La pièce mêle comédie, farce, tragédie et **machinerie** spectaculaire ; elle refuse les unités et fit scandale, notamment pour la scène du pauvre et pour l’éloge ironique de l’hypocrisie.

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
            cours: `## L’histoire
Un hidalgo pauvre de la Manche, **Alonso Quichano**, a tant lu de romans de chevalerie qu’il en perd la raison : il se fait appeler **don Quichotte**, revêt une vieille armure, baptise sa rosse **Rossinante**, choisit une paysanne comme dame idéale sous le nom de **Dulcinée du Toboso** et part redresser les torts. Avec son écuyer **Sancho Panza**, paysan pratique et proverbial, il attaque des moulins qu’il prend pour des géants, des troupeaux qu’il prend pour des armées, libère des galériens qui le rouent de coups. Dans la **seconde partie** (1615), les personnages ont lu la première : on les reconnaît, on se moque d’eux, un duc organise des mises en scène pour les humilier. Vaincu, don Quichotte rentre chez lui, recouvre la raison — et meurt.

## À retenir
Fondateur du **roman moderne** : parodie des romans de chevalerie qui devient réflexion sur la **fiction** elle-même, sur ce que lire fait à la vie. Le duo idéaliste/réaliste, la mise en abyme (le livre dans le livre), l’ironie et la tendresse ont irrigué toute la littérature européenne.

> Les moulins à vent sont devenus le symbole du combat magnifique et perdu.`,
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
            cours: `## Les trois parties
1. **Combray** : le narrateur enfant, le drame du baiser du soir refusé, la tante Léonie, l’église, les lectures — et l’épisode de la **madeleine** trempée dans le thé, où un goût fait resurgir tout un pan du passé : c’est la **mémoire involontaire**, matrice de toute la *Recherche*.
2. **Un amour de Swann** : récit à la troisième personne, antérieur à la naissance du narrateur. **Charles Swann**, homme du monde raffiné, s’éprend d’**Odette de Crécy**, cocotte, s’enferme dans une jalousie maladive, souffre au son de la « petite phrase » de **Vinteuil**, et conclut : « Dire que j’ai gâché des années de ma vie pour une femme qui n’était pas mon genre. » Il l’épousera pourtant.
3. **Noms de pays : le nom** : la rêverie sur les noms de villes et l’amour d’enfance pour **Gilberte**, fille de Swann, aux Champs-Élysées.

## À retenir
Premier volume d’*À la recherche du temps perdu*, refusé par plusieurs éditeurs (dont Gide à la NRF, qui le regrettera) et publié à compte d’auteur en **1913**. Les **deux côtés** de la promenade — celui de chez Swann et celui des Guermantes — structurent toute l’œuvre. Phrase longue, comparaisons développées, analyse infinie du désir et de la jalousie.

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
            cours: `## L’histoire
Reprise du mythe grec. À Argos, **Électre** attend son frère **Oreste** et soupçonne sa mère **Clytemnestre** et son beau-père **Égisthe** d’avoir assassiné son père Agamemnon. Égisthe, régent efficace, veut la marier au jardinier pour la neutraliser. Les **Euménides**, sous la forme de trois petites filles qui grandissent d’acte en acte, poussent à la révélation. Électre refuse tout compromis : elle veut la vérité, coûte que coûte. Oreste tue Clytemnestre et Égisthe au moment même où les Corinthiens attaquent la ville. Argos brûle. À la question « Comment cela s’appelle-t-il, quand le jour se lève et que tout est gâché ? », la femme Narsès répond : « **Cela a un très beau nom… Cela s’appelle l’aurore.** »

## À retenir
Pièce en **deux actes**, créée en **1937**, dans une Europe au bord de la guerre : la question de la justice absolue contre le compromis politique y est brûlante. Égisthe n’est pas un méchant simple — il est devenu, par le pouvoir, un vrai chef. Langue brillante, ironique, avec un **jardinier** qui vient parler seul au public dans un « lamento » célèbre.

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
            cours: `## La pièce
**Vladimir** (Didi) et **Estragon** (Gogo) attendent, près d’un arbre, sur une route de campagne, un certain **Godot** qui ne vient pas. Pour passer le temps : chapeaux, chaussures, disputes, réconciliations, projets de pendaison abandonnés. Passent **Pozzo**, maître brutal, et **Lucky**, son esclave tenu en laisse, qui « pense » sur commande dans un monologue délirant. Un **garçon** annonce que Godot ne viendra pas ce soir mais viendra demain. **Acte II** : le lendemain, l’arbre a quelques feuilles, Pozzo est aveugle et Lucky muet, le garçon revient dire la même chose. Les deux hommes décident de partir : « Ils ne bougent pas. »

## À retenir
Créée en **1953**, la pièce fonde le **théâtre de l’absurde**. Pas d’intrigue, pas de psychologie, un décor nu, un temps circulaire. On y a lu l’attente de Dieu, l’après-guerre, la condition humaine — Beckett a toujours refusé d’expliquer. Le comique de music-hall (duo, gags, chutes) y sert le désespoir. Beckett reçoit le Nobel en 1969.

> « Rien à faire. »`,
          },
          questions: [
            ['Qu’attendent Vladimir et Estragon ?', ['Un certain Godot, qui ne vient jamais', 'Un train', 'La fin de la guerre', 'Le retour de Pozzo'], 0, 'Un garçon annonce chaque soir qu’il viendra demain.'],
            ['Que se passe-t-il à l’acte II ?', ['Presque la même chose qu’à l’acte I, avec des dégradations', 'Godot arrive enfin', 'Les personnages quittent la scène', 'La pièce change de décor'], 0, 'Pozzo est aveugle, Lucky muet, l’arbre a quelques feuilles.'],
            ['Quelle est la dernière indication scénique de la pièce ?', ['« Ils ne bougent pas », après avoir décidé de partir', '« Ils sortent »', '« Le rideau tombe sur Godot »', '« Ils s’endorment »'], 0, 'Le décalage entre la parole et l’action résume toute la pièce.'],
            ['Qui sont Pozzo et Lucky ?', ['Un maître brutal et son esclave tenu en laisse', 'Deux amis de Vladimir', 'Deux messagers de Godot', 'Le père et le fils du garçon'], 0, 'Lucky « pense » sur commande dans un monologue délirant.'],
            ['Quel mouvement la pièce fonde-t-elle ?', ['Le théâtre de l’absurde', 'Le drame romantique', 'Le naturalisme', 'Le théâtre épique'], 0, 'Créée en 1953, elle a bouleversé la scène européenne.'],
            ['Beckett a expliqué qui était Godot.', ['Vrai', 'Faux'], 1, 'Il a toujours refusé de le faire, laissant les lectures ouvertes.'],
          ],
        },
        {
          titre: 'Encyclopédie, Denis Diderot, Jean le Rond d’Alembert',
          lecon: {
            titre: 'Diderot et d’Alembert, 1751-1772 — l’arbre des savoirs',
            cours: `## L’entreprise
Dix-sept volumes de texte et onze de **planches**, publiés de **1751 à 1772** : environ **72 000 articles**, écrits par près de deux cents collaborateurs — Voltaire, Rousseau, Montesquieu, Jaucourt (qui en rédige près d’un quart), des artisans, des médecins. Sous-titre : *Dictionnaire raisonné des sciences, des arts et des métiers*.

## Le projet
« **Changer la façon commune de penser** », écrit Diderot. Trois gestes : rassembler **tous** les savoirs, y compris ceux des **métiers** manuels — d’où les planches minutieuses sur la fabrication des épingles ou du papier, révolutionnaires par leur dignité accordée au travail ; les **classer** selon un arbre issu des facultés humaines (mémoire, raison, imagination) et non selon la théologie ; et les faire **communiquer** par un système de **renvois**, dont certains sont ironiques — l’article « Anthropophages » renvoie à « Eucharistie ».

## À retenir
L’ouvrage fut interdit à deux reprises, ses privilèges révoqués, et Diderot dut le poursuivre à demi clandestinement. C’est l’entreprise emblématique des **Lumières** : diffuser le savoir est en soi une action politique, parce qu’un lecteur informé se soumet moins.

> Le savoir y cesse d’être un dépôt à conserver pour devenir un outil à partager.`,
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
            cours: `## L’œuvre
Douze chants en hexamètres, composés par **Virgile** entre 29 et 19 av. J.-C., restés inachevés à sa mort — il demanda qu’on les brûlât, **Auguste** l’en empêcha. Le poème raconte la fuite d’**Énée**, prince troyen, après la chute de Troie, jusqu’en Italie où sa descendance fondera Rome.

## Le récit
Chants I-VI : la tempête, l’arrivée à **Carthage**, le récit de la chute de Troie fait à la reine **Didon** (le cheval, la mort de Priam, la fuite avec son père Anchise sur les épaules et son fils Ascagne), l’amour de Didon et son **suicide** quand Énée repart sur ordre des dieux, puis la descente aux Enfers où son père lui montre les âmes des Romains à venir. Chants VII-XII : la guerre en Latium contre **Turnus**, les alliances, le bouclier forgé par Vulcain, et le duel final où Énée tue Turnus.

## À retenir
Épopée **nationale et politique** : elle donne à Rome une origine troyenne et légitime le pouvoir d’Auguste. Le héros y est défini par la **pietas** — le devoir envers les dieux, la patrie et la famille — et non par la gloire personnelle. Modèle absolu pour la littérature européenne, de Dante (qui en fait son guide) à Du Bellay.

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
            cours: `## Le dispositif
Un philosophe séjourne chez une **marquise**. Chaque soir, dans le parc, ils regardent le ciel : **six soirs**, six leçons. Le **dialogue** permet les objections, les résistances et les images — le lecteur avance avec la marquise, qui pose ses propres questions.

## Le contenu
Le **système de Copernic** (la Terre tourne autour du Soleil), la taille de l’univers, la nature des planètes, puis l’hypothèse hardie de mondes **habités** : la Lune, les planètes, et les étoiles fixes considérées comme autant de soleils. Tout est présenté comme **conjecture raisonnable**, jamais comme dogme.

## Les images
La comparaison de l’univers à un **opéra** : le spectateur voit les effets, le philosophe cherche les machines cachées derrière le décor. Chaque notion difficile est traduite en analogie prise dans le monde mondain de l’interlocutrice.

## À retenir
Un des premiers grands textes de **vulgarisation scientifique**, écrit pour un public mondain et largement féminin, exclu du latin et des académies. La **galanterie** du ton est une stratégie de diffusion : elle suppose que la science n’appartient pas aux seuls savants. L’ouvrage annonce les Lumières.

> « Je vous demande seulement de croire ce que vous verrez. »`,
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
            cours: `## L’œuvre
Trois livres, publiés à partir de **1580** et augmentés jusqu’à la mort de l’auteur en 1592. Le mot **essai** signifie tentative, pesée : Montaigne ne démontre pas, il examine, se contredit, revient. « Je ne peins pas l’être, je peins le passage. »

## Les chapitres à connaître
« **De l’institution des enfants** » (une éducation qui forme le jugement plutôt que la mémoire : « une tête bien faite plutôt que bien pleine ») ; « **De l’amitié** » (La Boétie : « parce que c’était lui, parce que c’était moi ») ; « **Des Cannibales** » (« chacun appelle barbarie ce qui n’est pas de son usage ») ; « **Des Coches** » (la destruction du Nouveau Monde) ; « **De l’expérience** » (le corps, la vieillesse, la mesure).

## La méthode
Le **doute** comme discipline — « Que sais-je ? » —, l’attention au **corps** et au quotidien, la **citation** antique utilisée comme matériau, le refus des systèmes. L’écriture avance par digressions, ajouts d’édition en édition (les « allongeails »), et par une phrase souple, imagée, parlée.

## À retenir
Montaigne invente un genre et une posture : l’examen de soi comme **instrument de connaissance de l’homme**, dans une France déchirée par les **guerres de religion** — d’où le prix de sa leçon de tolérance et de mesure.

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
            cours: `## Le recueil
Publié en **1956** par le poète sénégalais **Léopold Sédar Senghor**, futur président du Sénégal (1960-1980) et premier Africain élu à l’Académie française. Le recueil s’achève sur une postface capitale, « **Comme les lamantins vont boire à la source** », où Senghor s’explique sur sa poétique.

## Les thèmes
L’**Afrique** — paysages, ancêtres, royaumes anciens, masques —, la **femme noire** célébrée comme terre et comme promesse, l’**exil** en France et le déchirement entre deux cultures, la **réconciliation** annoncée entre l’Afrique et l’Europe (« Chaka », long poème dramatique sur le roi zoulou, en est le sommet).

## La forme
**Vers libres amples**, versets longs souvent inspirés de Claudel et de Saint-John Perse, indications d’instruments africains en tête des poèmes (« pour kôra », « pour balafong ») : la poésie est faite pour être **dite et accompagnée**, comme la parole du griot.

## À retenir
La **négritude**, notion forgée avec **Aimé Césaire** et **Léon-Gontran Damas** dans les années 1930, désigne la revendication assumée d’une identité et d’une culture noires, contre l’assimilation coloniale. Chez Senghor, elle est plus lyrique et conciliatrice que chez Césaire, plus révolté.

> « Femme nue, femme noire, vêtue de ta couleur qui est vie… » (Chants d’ombre)`,
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
