// -----------------------------------------------------------------------------
// GUERRES MONDIALES — le monde : Lénine, Anne Frank, Hitler, Roosevelt,
// Mussolini, Staline, Churchill, Gandhi.
//
// Ces huit fiches racontent les régimes totalitaires et la Seconde Guerre
// mondiale. Elles sont FACTUELLES, PRÉCISES, CHIFFRÉES ET SOBRES : sur ces
// sujets-là, la précision fait plus d'effet que l'indignation, et un élève de
// 3e retient un chiffre daté mieux qu'une phrase indignée. Aucun
// sensationnalisme, aucune fascination, aucun détail gratuit.
//
// Les citations des dictateurs ne sont là que pour montrer un PROGRAMME
// ANNONCÉ — brèves, documentées, jamais mises en valeur, toujours replacées et
// commentées par `sens`. Sur la fiche Hitler, la citation phare est celle d'un
// opposant : Otto Wels, le seul à parler contre les pleins pouvoirs.
//
// Deux fiches sont triées hors de leur année de mort, parce que `tri` doit
// tomber dans les bornes de la période (1900-1950) : Staline (mort en 1953) et
// Churchill (mort en 1965) sont classés en 1945, l'année qui les fixe dans
// l'histoire. Leur vraie date de mort est dans `dates`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_GUERRES_MONDE: Personnage[] = [
  {
    id: 'lenine',
    volet: 'personnages',
    nom: 'Lénine',
    surnom: 'l’homme du train scellé',
    dates: '1870 – 1924',
    tri: 1924,
    periode: 'guerres',
    emoji: '🚂',
    roles: ['Révolutionnaire russe', 'Chef des bolcheviks', 'Fondateur de l’URSS'],
    origine: 'Simbirsk, Empire russe',
    accroche:
      'En huit mois, il transforme une Russie épuisée par la guerre en premier État communiste du monde — et invente le régime à parti unique.',
    citations: [
      {
        texte: 'La paix, le pain, la terre.',
        contexte: 'Mot d’ordre des bolcheviks à Petrograd, printemps et été 1917.',
        sens:
          'Trois mots qui répondent exactement à ce que veulent les soldats, les ouvriers et les paysans russes : sortir de la guerre, manger, posséder la terre qu’ils cultivent.',
      },
      {
        texte: 'Tout le pouvoir aux soviets !',
        contexte:
          'Thèses d’avril, Petrograd, le 4 avril 1917, au lendemain de son retour d’exil.',
        sens:
          'Les soviets sont les conseils élus d’ouvriers et de soldats. Lénine refuse de soutenir le gouvernement provisoire et réclame le pouvoir pour eux seuls.',
      },
      {
        texte:
          'Le communisme, c’est le pouvoir des soviets plus l’électrification de tout le pays.',
        contexte: 'Au VIIIᵉ congrès des soviets, Moscou, décembre 1920.',
        sens:
          'Le programme tient en une addition : la dictature politique d’un côté, la modernisation industrielle d’un pays encore rural de l’autre.',
      },
      {
        texte:
          'Staline est trop brutal, et ce défaut, supportable entre nous communistes, devient intolérable chez un secrétaire général : je propose aux camarades d’étudier le moyen de le déplacer de ce poste.',
        contexte:
          'Lettre au congrès, dictée en janvier 1923, connue comme son « testament ».',
        sens:
          'Malade, Lénine voit venir le danger et tente d’écarter Staline. Le texte est étouffé par le parti ; Staline restera secrétaire général trente ans.',
      },
    ],
    reperes: [
      'Vladimir Ilitch Oulianov, né en 1870 ; son frère aîné est pendu en 1887 pour complot contre le tsar.',
      'Exilé en Suisse, il rentre en Russie en avril 1917 dans un train affrété par l’Allemagne en guerre.',
      'Nuit du 24 au 25 octobre 1917 : les bolcheviks prennent le pouvoir à Petrograd presque sans combat.',
      'Paix de Brest-Litovsk, mars 1918 : la Russie quitte la guerre en abandonnant un quart de sa population.',
      'Guerre civile, Tcheka et communisme de guerre : environ 5 millions de morts, surtout de famine.',
      'NEP en 1921, création de l’URSS en 1922, mort en janvier 1924 après trois attaques cérébrales.',
    ],
    recit: [
      {
        titre: 'Le professionnel de la révolution',
        texte:
          'Fils d’un inspecteur des écoles, Vladimir Oulianov a dix-sept ans quand son frère **Alexandre est pendu** pour avoir comploté contre le tsar. Il devient avocat, lit **Marx**, est déporté trois ans en Sibérie, puis passe dix-sept ans en exil à Munich, Londres et Genève. Là, il écrit et il organise. Sa grande idée tient en un mot : le **parti**. Pas un large mouvement ouvrier, mais une organisation étroite de révolutionnaires professionnels, disciplinés, qui décident pour la classe ouvrière au lieu d’attendre qu’elle se soulève. En 1903, le parti social-démocrate russe se coupe en deux sur ce point : les **bolcheviks** (« majoritaires ») le suivent, les mencheviks refusent. Vingt ans plus tard, c’est cette machine-là qui prendra le pouvoir.',
      },
      {
        titre: 'Avril 1917 : le train et les thèses',
        texte:
          'En février 1917, la faim et la guerre emportent le **tsar Nicolas II**, renversé par les grèves et les mutineries. Un gouvernement provisoire prend la suite et décide de continuer la guerre contre l’Allemagne. Lénine est à Zurich. L’état-major allemand, qui a tout intérêt à ce que la Russie s’effondre, le fait traverser l’Allemagne dans un **wagon scellé** : il arrive à Petrograd le 3 avril. Dès le lendemain, il publie les **Thèses d’avril** et prend tout le monde à contre-pied — ni soutien au gouvernement, ni guerre, ni attente : la paix immédiate, la terre aux paysans, tout le pouvoir aux soviets. Ses propres camarades le croient devenu fou. En six mois, l’échec de l’offensive militaire et la faim lui donnent raison : les bolcheviks deviennent majoritaires dans les soviets de Petrograd et de Moscou.',
      },
      {
        titre: 'Octobre, et le parti au-dessus de tout',
        texte:
          'Dans la nuit du **24 au 25 octobre 1917** (le 7 novembre de notre calendrier), les gardes rouges occupent les ponts, la gare, le télégraphe et le palais d’Hiver. Le coup fait quelques morts : l’essentiel se joue après. L’Assemblée constituante, élue en novembre, donne une large majorité aux socialistes-révolutionnaires, pas aux bolcheviks : Lénine la fait **dissoudre par la force** après une seule journée de séance, le 6 janvier 1918. La police politique, la **Tcheka**, est créée en décembre 1917 ; les autres partis sont interdits, la presse muselée, les grèves brisées. Le parti unique naît là, et avec lui un modèle que Mussolini, Hitler et Staline reprendront chacun à leur manière.',
      },
      {
        titre: 'Guerre civile, famine, puis recul',
        texte:
          'De 1918 à 1921, les Rouges affrontent les armées **blanches** soutenues par quatorze pays étrangers, dont la France et le Royaume-Uni. Pour nourrir les villes et l’Armée rouge, l’État **réquisitionne les récoltes** : c’est le « communisme de guerre ». Les paysans sèment moins, la production s’effondre, la famine de 1921-1922 tue environ **5 millions de personnes** sur la Volga. En mars 1921, les marins de **Cronstadt**, héros de 1917, se révoltent contre le régime : ils sont écrasés. Lénine comprend qu’il faut reculer et lance la **NEP**, la Nouvelle Politique économique : l’impôt remplace la réquisition, le petit commerce et la petite industrie privée sont de nouveau autorisés. L’économie repart. Le monopole politique du parti, lui, ne bouge pas d’un pouce.',
      },
      {
        titre: 'Le testament et l’héritier',
        texte:
          'En 1922, l’**URSS** est officiellement fondée : une fédération de républiques que le parti tient toutes. La même année, Lénine est frappé d’une première attaque cérébrale. Diminué, il dicte à sa secrétaire une **lettre au congrès** où il juge ses successeurs possibles un par un et demande qu’on écarte **Staline** du secrétariat général. Le texte est lu à quelques dirigeants, puis enterré. Lénine meurt le **21 janvier 1924**, à cinquante-trois ans. Contre l’avis de sa veuve, son corps est embaumé et exposé sur la place Rouge ; Petrograd devient Leningrad. Staline organise les funérailles et se présente comme le disciple fidèle : cinq ans plus tard, il est seul au pouvoir.',
      },
    ],
    chrono: [
      { date: '1870', fait: 'Naissance à Simbirsk, sur la Volga.' },
      { date: '1903', fait: 'Scission du parti : les bolcheviks le suivent.' },
      { date: 'avril 1917', fait: 'Retour d’exil et Thèses d’avril.' },
      { date: '25 octobre 1917', fait: 'Les bolcheviks prennent le pouvoir à Petrograd.' },
      { date: 'janvier 1918', fait: 'Dissolution de l’Assemblée constituante.' },
      { date: 'mars 1918', fait: 'Paix de Brest-Litovsk avec l’Allemagne.' },
      { date: '1921', fait: 'Cronstadt écrasée ; lancement de la NEP.' },
      { date: '1922', fait: 'Création de l’URSS ; première attaque cérébrale.' },
      { date: '21 janvier 1924', fait: 'Mort à Gorki, près de Moscou.' },
    ],
    leSaisTu:
      'Lénine voulait être enterré à côté de sa mère, à Petrograd, et sa veuve Kroupskaïa supplia le parti de ne pas faire « de lui un objet de culte ». Le parti décida le contraire : le corps fut embaumé et exposé dans un mausolée où il se trouve toujours, plus de cent ans après.',
    aRetenir: [
      'Lénine dirige les bolcheviks et prend le pouvoir à Petrograd le 25 octobre 1917.',
      'Il sort la Russie de la Première Guerre mondiale par la paix de Brest-Litovsk (mars 1918).',
      'Il met en place le parti unique, la police politique (Tcheka) et la dissolution de l’Assemblée élue.',
      'La NEP, en 1921, rétablit une part d’économie privée après la famine de la guerre civile.',
      'L’URSS est créée en 1922 ; Lénine meurt en 1924 et Staline lui succède.',
    ],
    mots: [
      {
        mot: 'Soviet',
        sens: 'Conseil élu d’ouvriers, de paysans ou de soldats ; en 1917, ils gouvernent les villes russes en concurrence avec l’État.',
      },
      {
        mot: 'Bolchevik',
        sens: 'Membre de la fraction de Lénine du parti social-démocrate russe, devenue le parti communiste en 1918.',
      },
      {
        mot: 'NEP',
        sens: 'Nouvelle Politique économique (1921) : retour partiel au marché et à la propriété privée pour relancer la production.',
      },
    ],
    lies: ['revolution-russe-1917', 'staline', 'karl-marx', 'traite-de-versailles'],
    niveaux: ['3e', 'Tle'],
    programme:
      'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'Oulianov',
      'bolcheviks',
      'révolution d’Octobre',
      'soviets',
      'URSS',
      'Petrograd',
      'NEP',
      'Tcheka',
      'communisme',
    ],
  },
  {
    id: 'anne-frank',
    volet: 'personnages',
    nom: 'Anne Frank',
    surnom: 'la jeune fille de l’Annexe',
    dates: '1929 – 1945',
    tri: 1945,
    periode: 'guerres',
    emoji: '📔',
    roles: ['Adolescente juive allemande', 'Auteur d’un journal', 'Victime de la Shoah'],
    origine: 'Francfort-sur-le-Main, Allemagne',
    accroche:
      'Cachée deux ans dans une annexe d’Amsterdam, elle a écrit le journal qui donne un visage et une voix aux six millions de morts de la Shoah.',
    citations: [
      {
        texte: 'Malgré tout, je crois encore à la bonté innée de l’homme.',
        contexte: 'Journal, 15 juillet 1944, trois semaines avant son arrestation.',
        sens:
          'Elle écrit cette phrase après deux ans d’enfermement, en sachant ce qui arrive aux Juifs déportés : ce n’est pas de la naïveté, c’est un refus.',
      },
      {
        texte: 'Le papier est plus patient que les hommes.',
        contexte:
          'Journal, 20 juin 1942, huit jours après avoir reçu le cahier pour ses treize ans.',
        sens:
          'Elle explique pourquoi elle écrit : un cahier écoute sans interrompre et sans juger, ce que personne ne fait autour d’elle.',
      },
      {
        texte: 'Je veux continuer à vivre, même après ma mort.',
        contexte:
          'Journal, 5 avril 1944, le jour où elle décide qu’elle sera écrivain ou journaliste.',
      },
      {
        texte: 'C’était une tout autre Anne que l’enfant que j’avais perdue.',
        qui: 'Otto Frank, son père, seul survivant des huit clandestins',
        contexte: 'Après avoir lu le journal de sa fille, à son retour d’Auschwitz, en 1945.',
        sens:
          'Il découvre dans ces pages une adolescente qu’il n’avait pas soupçonnée : c’est ce qui le décide à publier le texte.',
      },
    ],
    reperes: [
      'Née à Francfort en 1929 ; la famille fuit l’Allemagne nazie pour Amsterdam en 1933-1934.',
      'Elle reçoit un cahier à carreaux rouges pour ses treize ans, le 12 juin 1942, et y écrit à une amie imaginaire, Kitty.',
      '6 juillet 1942 : huit personnes entrent dans l’Annexe, cachée derrière une bibliothèque pivotante.',
      '4 août 1944 : arrestation sur dénonciation jamais identifiée, après vingt-cinq mois de clandestinité.',
      'Morte du typhus à Bergen-Belsen en février ou mars 1945, à quinze ans, quelques semaines avant la libération du camp.',
      'Son père publie le journal en 1947 ; il est aujourd’hui traduit en plus de soixante-dix langues.',
    ],
    recit: [
      {
        titre: 'Une famille allemande qui fuit l’Allemagne',
        texte:
          'Les Frank sont une famille juive de **Francfort**, installée en Allemagne depuis des siècles : le père, **Otto**, a été officier dans l’armée allemande pendant la Première Guerre mondiale. Quand Hitler arrive au pouvoir en **1933**, ils comprennent vite. Otto part pour **Amsterdam** monter une petite entreprise d’épices et de pectine ; sa femme Edith et ses deux filles, Margot et Anne, le rejoignent en 1934. Anne a quatre ans et devient une enfant néerlandaise ordinaire, bavarde, moqueuse, bonne en rédaction. Le **10 mai 1940**, l’Allemagne envahit les Pays-Bas. En deux ans, les mesures tombent l’une après l’autre : recensement, étoile jaune, interdiction des tramways, des piscines, des cinémas, écoles séparées. L’abri qu’ils avaient cherché n’en est plus un.',
      },
      {
        titre: 'L’Annexe, vingt-cinq mois derrière une bibliothèque',
        texte:
          'Le **5 juillet 1942**, Margot, seize ans, reçoit une convocation pour un « camp de travail » en Allemagne. La famille disparaît le lendemain. Otto avait tout préparé : au 263 **Prinsengracht**, derrière les bureaux de son entreprise, un logement de quelques pièces dont l’accès est masqué par une **bibliothèque pivotante**. Ils seront huit à y vivre : les quatre Frank, la famille van Pels et le dentiste Fritz Pfeffer. Quatre employés d’Otto, dont **Miep Gies**, les ravitaillent en secret, au risque de leur vie. La règle est le silence : de huit heures à dix-huit heures, tant que les ouvriers travaillent en dessous, on ne tire pas une chasse d’eau, on ne marche qu’en chaussettes. Anne écrit. Elle raconte les disputes pour une pomme de terre, les bombardements, la BBC, sa mère qui l’exaspère, son premier amour pour Peter van Pels, et son projet de devenir écrivain. Au printemps 1944, elle entend à la radio un ministre néerlandais en exil demander qu’on conserve les témoignages de l’Occupation : elle se met alors à **réécrire son journal**, pour en faire un livre.',
      },
      {
        titre: '4 août 1944',
        texte:
          'Le matin du **4 août 1944** — deux mois après le débarquement de Normandie —, une voiture de police s’arrête devant le 263 Prinsengracht. Un policier allemand et trois auxiliaires néerlandais montent droit à la bibliothèque. Qui a dénoncé les huit clandestins n’a jamais été établi, malgré des dizaines d’enquêtes. Ils sont conduits à **Westerbork**, puis embarqués le 3 septembre dans le **dernier convoi** parti des Pays-Bas vers Auschwitz : 1 019 personnes, dont 549 gazées à l’arrivée. Anne et Margot, jugées assez solides pour travailler, sont ensuite transférées à **Bergen-Belsen**, un camp sans chambre à gaz mais où la faim, le froid et le typhus tuent des milliers de détenus par semaine. Les deux sœurs y meurent à quelques jours d’intervalle, en février ou mars **1945**. Les Britanniques libèrent le camp le 15 avril. Sur les huit de l’Annexe, seul Otto Frank revient.',
      },
      {
        titre: 'Le journal qu’un père a publié',
        texte:
          'Le jour de l’arrestation, la police avait vidé une sacoche pour y mettre l’argent et les bijoux, jetant les feuillets sur le sol. **Miep Gies** les a ramassés et rangés dans un tiroir sans les lire, décidée à les rendre à Anne à son retour. En juillet 1945, quand Otto apprend la mort de ses filles, elle lui donne les cahiers. Il met des mois à les lire, page par page. Le livre paraît à Amsterdam en **1947** sous le titre que sa fille avait choisi, *Het Achterhuis* — « l’Annexe » —, à 1 500 exemplaires. Il est aujourd’hui lu dans plus de soixante-dix langues et l’immeuble du Prinsengracht est un musée que visitent plus d’un million de personnes par an. Le journal ne dit presque rien des camps, qu’Anne n’a pas eu le temps de connaître quand elle écrivait : il dit ce qui a été détruit, c’est-à-dire une adolescente qui voulait être écrivain.',
      },
    ],
    chrono: [
      { date: '12 juin 1929', fait: 'Naissance à Francfort-sur-le-Main.' },
      { date: '1933-1934', fait: 'La famille quitte l’Allemagne pour Amsterdam.' },
      { date: '10 mai 1940', fait: 'L’Allemagne envahit les Pays-Bas.' },
      { date: '12 juin 1942', fait: 'Elle reçoit le cahier pour ses treize ans.' },
      { date: '6 juillet 1942', fait: 'Entrée dans l’Annexe du 263 Prinsengracht.' },
      { date: '4 août 1944', fait: 'Arrestation des huit clandestins.' },
      { date: '3 septembre 1944', fait: 'Dernier convoi des Pays-Bas vers Auschwitz.' },
      { date: 'février-mars 1945', fait: 'Mort du typhus à Bergen-Belsen.' },
      { date: '1947', fait: 'Otto Frank publie le journal à Amsterdam.' },
    ],
    leSaisTu:
      'Le journal s’arrête net le 1ᵉʳ août 1944, trois jours avant l’arrestation. Anne venait d’y écrire qu’elle se sentait « un paquet de contradictions ». La dernière phrase du cahier parle de ce qu’elle serait « si seulement il n’y avait pas d’autres gens au monde ».',
    aRetenir: [
      'Anne Frank, juive allemande réfugiée à Amsterdam, se cache avec sept autres personnes du 6 juillet 1942 au 4 août 1944.',
      'Elle tient un journal de ses treize à ses quinze ans et le réécrit en 1944 pour en faire un livre.',
      'Arrêtée sur dénonciation, elle est déportée à Auschwitz puis à Bergen-Belsen, où elle meurt du typhus début 1945.',
      'Son père Otto, seul survivant des huit, publie le journal en 1947.',
      'Le journal est devenu le témoignage le plus lu au monde sur la persécution des Juifs.',
    ],
    mots: [
      {
        mot: 'Shoah',
        sens: 'L’assassinat organisé des Juifs d’Europe par l’Allemagne nazie entre 1941 et 1945 : environ six millions de morts.',
      },
      {
        mot: 'Déportation',
        sens: 'Transfert forcé, par convois de wagons, vers des camps de concentration ou d’extermination.',
      },
      {
        mot: 'Étoile jaune',
        sens: 'Insigne cousu sur les vêtements, imposé aux Juifs des pays occupés pour les repérer et les isoler.',
      },
    ],
    lies: ['la-shoah', 'adolf-hitler', 'rafle-du-vel-d-hiv', 'la-resistance'],
    niveaux: ['3e'],
    programme: 'La Deuxième Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'journal',
      'Amsterdam',
      'Annexe',
      'Prinsengracht',
      'Otto Frank',
      'Miep Gies',
      'Bergen-Belsen',
      'Auschwitz',
      'Shoah',
      'étoile jaune',
    ],
  },
  {
    id: 'adolf-hitler',
    volet: 'personnages',
    nom: 'Adolf Hitler',
    dates: '1889 – 1945',
    tri: 1945,
    periode: 'guerres',
    emoji: '🏛️',
    roles: ['Chef du parti nazi', 'Chancelier du Reich', 'Dictateur de l’Allemagne'],
    origine: 'Braunau am Inn, Autriche-Hongrie',
    accroche:
      'Arrivé au pouvoir légalement en janvier 1933, il détruit la démocratie allemande en six mois et conduit l’Europe à la guerre et à la Shoah.',
    citations: [
      {
        texte: 'On peut nous prendre la liberté et la vie, mais pas l’honneur.',
        qui: 'Otto Wels, chef des députés sociaux-démocrates',
        contexte:
          'Au Reichstag, le 23 mars 1933 : le seul discours prononcé contre la loi des pleins pouvoirs.',
        sens:
          'Les 94 sociaux-démocrates sont les seuls à voter non, sous les huées et devant des SA en armes. Leur parti est interdit trois mois plus tard ; Wels meurt en exil en 1939.',
      },
      {
        texte:
          'Nous mettons fin à l’éternelle poussée des Germains vers le sud et l’ouest de l’Europe, et nous tournons le regard vers les terres de l’Est.',
        contexte: '*Mein Kampf*, écrit en prison après le putsch manqué de 1923.',
        sens:
          'C’est l’« espace vital » : conquérir l’Est pour y installer des Allemands. Le programme est imprimé quinze ans avant l’invasion de la Pologne.',
      },
      {
        texte:
          'Le résultat ne sera pas la bolchevisation de la terre et donc la victoire de la juiverie, mais l’anéantissement de la race juive en Europe.',
        contexte:
          'Discours au Reichstag, le 30 janvier 1939, six ans jour pour jour après son accession au pouvoir.',
        sens:
          'Le crime est annoncé en public trois ans avant d’être organisé à Wannsee : la Shoah n’a pas été un dérapage de la guerre, elle était un projet énoncé.',
      },
    ],
    reperes: [
      'Autrichien, refusé deux fois aux Beaux-Arts de Vienne, caporal dans l’armée allemande de 1914 à 1918.',
      'Putsch manqué à Munich en novembre 1923 : condamné à cinq ans, il en fait neuf mois et écrit Mein Kampf.',
      'Le parti nazi passe de 2,6 % des voix en 1928 à 37,3 % en juillet 1932, avec six millions de chômeurs.',
      '30 janvier 1933 : il est nommé chancelier par le président Hindenburg, en respectant la Constitution.',
      '23 mars 1933 : les pleins pouvoirs ; partis, syndicats et presse libre disparaissent avant l’été.',
      'Il se suicide dans son bunker de Berlin le 30 avril 1945, l’Armée rouge à quelques centaines de mètres.',
    ],
    recit: [
      {
        titre: 'Munich 1923 : le putsch, puis le livre',
        texte:
          'Rien, avant 1919, ne distingue Adolf Hitler : un Autrichien de trente ans, sans diplôme et sans métier, deux fois recalé aux Beaux-Arts, caporal et agent de liaison pendant la Première Guerre mondiale. La défaite de 1918 et le **traité de Versailles**, que l’Allemagne vit comme un « diktat », lui donnent son discours : la nation aurait été trahie de l’intérieur. À Munich, il prend en main un groupuscule qui devient le **parti national-socialiste**. Le 8 novembre **1923**, il tente un coup d’État depuis une brasserie ; la police tire, seize de ses partisans sont tués, il est arrêté. Son procès lui offre une tribune nationale et sa peine est dérisoire : neuf mois de forteresse, pendant lesquels il dicte *Mein Kampf*. Le livre expose sans détour l’antisémitisme, la haine de la démocratie et la conquête d’un **« espace vital »** à l’Est. Il en sera vendu plus de dix millions d’exemplaires avant 1945 : personne, en Allemagne, ne pourra dire qu’il ne savait pas ce qui était annoncé.',
      },
      {
        titre: 'Arriver au pouvoir dans les règles',
        texte:
          'Après la prison, Hitler change de méthode : il prendra le pouvoir **par les urnes**. Tant que l’Allemagne va à peu près bien, ça ne marche pas — 2,6 % des voix en 1928. Puis vient la **crise de 1929** : les capitaux américains se retirent, la production s’effondre, le chômage atteint **six millions** de personnes en 1932, soit un actif sur trois. Le parti nazi devient alors le premier d’Allemagne : 37,3 % en juillet 1932. Il n’a pourtant jamais la majorité, et recule même en novembre (33,1 %). Ce sont des **conservateurs**, persuadés de pouvoir se servir de lui et de le contrôler, qui convainquent le vieux président **Hindenburg** de le nommer **chancelier le 30 janvier 1933**. Il entre à la chancellerie avec trois ministres nazis sur onze. Six mois plus tard, il n’y a plus d’opposition en Allemagne.',
      },
      {
        titre: 'Six mois pour supprimer un État de droit',
        texte:
          'Le **27 février 1933**, le **Reichstag brûle**. Le régime accuse les communistes et obtient dès le lendemain un décret « pour la protection du peuple et de l’État » : il suspend la liberté de la presse, de réunion et l’inviolabilité du domicile. Des milliers d’opposants sont arrêtés ; le camp de **Dachau** ouvre en mars. Le **23 mars 1933**, le Reichstag vote par 441 voix contre 94 la loi des **pleins pouvoirs**, qui autorise le gouvernement à légiférer seul. En quelques semaines, les autres partis sont dissous, les syndicats remplacés par une organisation unique, les livres brûlés en place publique. La **Gestapo** est créée en avril, la SS prend en main les camps de concentration. En 1934, la mort de Hindenburg permet à Hitler de cumuler les fonctions de chancelier et de chef de l’État. Les **lois de Nuremberg** de septembre **1935** privent les Juifs allemands de la citoyenneté et leur interdisent d’épouser un non-Juif : la persécution devient du droit écrit.',
      },
      {
        titre: 'L’expansion, puis la guerre',
        texte:
          'Hitler applique son livre. Il réarme, quitte la Société des Nations, remilitarise la **Rhénanie** en mars 1936 sans que la France ne bouge. En mars 1938, l’Autriche est annexée (**Anschluss**). En septembre, aux accords de **Munich**, la France et le Royaume-Uni lui abandonnent les Sudètes tchécoslovaques pour éviter la guerre ; six mois plus tard, il prend le reste de la Tchécoslovaquie, prouvant que sa signature ne vaut rien. En novembre 1938, la **Nuit de Cristal** saccage synagogues et magasins juifs dans toute l’Allemagne. Le **23 août 1939**, le pacte germano-soviétique lui garantit qu’il n’aura pas de second front : il envahit la **Pologne le 1ᵉʳ septembre**. La Seconde Guerre mondiale commence. En deux ans, l’Allemagne occupe la moitié du continent, de la Norvège à la Grèce.',
      },
      {
        titre: 'Wannsee et l’assassinat des Juifs d’Europe',
        texte:
          'L’invasion de l’URSS, en juin 1941, ouvre une guerre d’un autre type : derrière l’armée avancent les **Einsatzgruppen**, unités mobiles qui fusillent les Juifs village par village — environ 1,5 million de morts par balles. Le **20 janvier 1942**, à la conférence de **Wannsee**, quinze hauts fonctionnaires organisent en quatre-vingt-dix minutes la « solution finale de la question juive » : le recensement, les convois, les camps d’extermination. À **Auschwitz-Birkenau**, Treblinka, Sobibor, Belzec, Chelmno et Maïdanek, l’assassinat devient industriel. Au total, environ **six millions de Juifs** sont tués, soit deux Juifs européens sur trois, ainsi que 200 000 Tsiganes et des dizaines de milliers de handicapés, d’opposants et de prisonniers soviétiques. Ce génocide est décidé, planifié et administré par un État moderne, avec des horaires de train et des bons de commande.',
      },
      {
        titre: 'Le bunker',
        texte:
          'La guerre se retourne à **Stalingrad** en février 1943, puis en Normandie le **6 juin 1944**. Hitler refuse toute retraite, remplace ses généraux, échappe à un attentat de ses propres officiers le 20 juillet 1944 et fait exécuter près de 5 000 personnes en représailles. En avril 1945, l’Armée rouge entre dans Berlin. Réfugié dans un bunker sous la chancellerie, il rédige un testament qui accuse encore les Juifs de la guerre, puis se **suicide le 30 avril 1945**. L’Allemagne capitule le 8 mai. Le bilan de la guerre qu’il a déclenchée est de **50 à 60 millions de morts**, dont une majorité de civils. En 1945-1946, le procès de **Nuremberg** juge ses lieutenants survivants et fait entrer dans le droit international la notion de **crime contre l’humanité**.',
      },
    ],
    chrono: [
      { date: '1889', fait: 'Naissance à Braunau am Inn, en Autriche.' },
      { date: 'novembre 1923', fait: 'Putsch manqué de Munich.' },
      { date: '1925', fait: 'Publication de Mein Kampf.' },
      { date: '30 janvier 1933', fait: 'Nommé chancelier par Hindenburg.' },
      { date: '23 mars 1933', fait: 'Loi des pleins pouvoirs votée par le Reichstag.' },
      { date: 'septembre 1935', fait: 'Lois de Nuremberg contre les Juifs allemands.' },
      { date: 'septembre 1938', fait: 'Accords de Munich : les Sudètes lui sont cédées.' },
      { date: '1ᵉʳ septembre 1939', fait: 'Invasion de la Pologne : la guerre commence.' },
      { date: '20 janvier 1942', fait: 'Conférence de Wannsee : la « solution finale ».' },
      { date: '30 avril 1945', fait: 'Suicide dans le bunker de Berlin.' },
    ],
    leSaisTu:
      'Hitler n’a jamais été élu chef de l’État : il a été nommé. Le parti nazi n’a jamais obtenu la majorité absolue dans une élection libre — 37,3 % en juillet 1932, puis 33,1 % en novembre. Ce sont des conservateurs certains de pouvoir s’en servir qui lui ont ouvert la porte de la chancellerie.',
    aRetenir: [
      'Hitler est nommé chancelier le 30 janvier 1933 par la voie légale, sans majorité absolue.',
      'L’incendie du Reichstag (27 février 1933) et la loi des pleins pouvoirs (23 mars) suppriment l’État de droit.',
      'Les lois de Nuremberg de 1935 privent les Juifs allemands de leur citoyenneté.',
      'L’invasion de la Pologne, le 1ᵉʳ septembre 1939, déclenche la Seconde Guerre mondiale.',
      'La conférence de Wannsee (20 janvier 1942) organise l’extermination des Juifs d’Europe : six millions de morts.',
      'Il se suicide le 30 avril 1945 ; l’Allemagne capitule le 8 mai.',
    ],
    mots: [
      {
        mot: 'Nazisme',
        sens: 'Idéologie du parti national-socialiste : race, chef unique, haine des Juifs, conquête d’un espace vital.',
      },
      {
        mot: 'Espace vital',
        sens: 'En allemand *Lebensraum* : territoires de l’Est à conquérir et à vider de leurs habitants pour y installer des Allemands.',
      },
      {
        mot: 'Gestapo',
        sens: 'Police politique du régime nazi, créée en 1933 : arrestations sans juge, interrogatoires, camps.',
      },
      {
        mot: 'Génocide',
        sens: 'Destruction organisée d’un peuple en tant que tel. Le mot est forgé en 1944 et jugé à Nuremberg.',
      },
    ],
    lies: [
      'la-shoah',
      'anne-frank',
      'mussolini',
      'debut-de-la-seconde-guerre-mondiale',
      'traite-de-versailles',
    ],
    niveaux: ['3e', 'Tle'],
    programme:
      'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'nazisme',
      'Führer',
      'Mein Kampf',
      'Reichstag',
      'pleins pouvoirs',
      'Nuremberg',
      'Wannsee',
      'Shoah',
      'IIIᵉ Reich',
      'Munich',
    ],
  },
  {
    id: 'franklin-roosevelt',
    volet: 'personnages',
    nom: 'Franklin Delano Roosevelt',
    surnom: 'le président du New Deal',
    dates: '1882 – 1945',
    tri: 1945,
    periode: 'guerres',
    emoji: '🗽',
    roles: ['Président des États-Unis', 'Artisan du New Deal', 'Chef de guerre allié'],
    origine: 'Hyde Park, État de New York',
    accroche:
      'Seul président américain élu quatre fois : il relève son pays de la crise de 1929, puis en fait l’arsenal qui arme les démocraties.',
    citations: [
      {
        texte:
          'La seule chose dont nous devons avoir peur, c’est la peur elle-même : une terreur sans nom, injustifiée, qui paralyse les efforts nécessaires.',
        contexte:
          'Discours d’investiture, le 4 mars 1933, avec treize millions de chômeurs et les banques fermées.',
        sens:
          'Il s’adresse d’abord au moral du pays : tant que chacun retire son argent et n’investit plus par peur, la crise se nourrit d’elle-même.',
      },
      {
        texte: 'Le 7 décembre 1941, une date qui restera marquée d’infamie.',
        contexte:
          'Devant le Congrès, le 8 décembre 1941, au lendemain de l’attaque japonaise sur Pearl Harbor.',
        sens:
          'En trente-trois minutes de débat, le Congrès vote la guerre. Les États-Unis, jusque-là neutres, entrent dans le conflit mondial.',
      },
      {
        texte: 'Nous devons être le grand arsenal des démocraties.',
        contexte: 'Causerie radiophonique au coin du feu, le 29 décembre 1940.',
        sens:
          'Un an avant d’entrer en guerre, les États-Unis fournissent armes, avions et navires au Royaume-Uni : ce sera la loi prêt-bail de mars 1941.',
      },
      {
        texte:
          'Quatre libertés : la liberté de parole, la liberté de culte, la liberté de vivre à l’abri du besoin, la liberté de vivre à l’abri de la peur.',
        contexte: 'Message sur l’état de l’Union au Congrès, le 6 janvier 1941.',
        sens:
          'Ces quatre libertés deviennent le but de guerre des Alliés et inspirent la Déclaration universelle des droits de l’homme de 1948.',
      },
    ],
    reperes: [
      'Cousin éloigné du président Theodore Roosevelt ; frappé par la poliomyélite en 1921, il ne remarche jamais.',
      'Élu en novembre 1932 au creux de la crise : un actif sur quatre est sans travail.',
      'Les Cent Jours de 1933 : banques, agriculture, grands travaux, aide aux chômeurs — c’est le New Deal.',
      '1935 : la loi sur la Sécurité sociale crée retraite et assurance chômage fédérales.',
      'Réélu en 1936, 1940 et 1944 : quatre mandats, cas unique dans l’histoire des États-Unis.',
      'Mort d’une hémorragie cérébrale le 12 avril 1945, un mois avant la capitulation allemande.',
    ],
    recit: [
      {
        titre: 'Un patricien dans un fauteuil roulant',
        texte:
          'Franklin Roosevelt naît en 1882 dans une famille riche de l’État de New York, entre Harvard et le droit. En **1921**, à trente-neuf ans, la **poliomyélite** le paralyse des jambes. Sa carrière semble finie ; sa femme **Eleanor** et son entourage l’aident à la reprendre. Il apprend à tenir debout quelques minutes, appuyé sur des attelles d’acier et sur le bras d’un fils, le temps d’un discours. Élu gouverneur de New York en 1928, il y expérimente les aides publiques aux chômeurs. En 1932, l’Amérique est au fond du trou : **13 millions de chômeurs**, 9 000 banques disparues, des fermiers expulsés, des files devant les soupes populaires. Roosevelt promet « une nouvelle donne pour le peuple américain » — a **new deal** — et l’emporte dans quarante-deux États sur quarante-huit.',
      },
      {
        titre: 'Les Cent Jours et le New Deal',
        texte:
          'Investi le **4 mars 1933**, il ferme d’abord toutes les banques quatre jours, le temps de trier celles qui tiennent debout : quand elles rouvrent, les dépôts reviennent. Puis le Congrès vote en **cent jours** quinze lois majeures. L’État garantit les dépôts bancaires, sépare banques de dépôt et banques d’affaires, soutient les prix agricoles, réduit le temps de travail, autorise enfin clairement les syndicats. Il embauche massivement : trois millions de jeunes dans les chantiers de reforestation, huit millions de personnes dans les grands travaux (routes, ponts, écoles, barrages de la **Tennessee Valley**). En **1935**, la loi sur la **Sécurité sociale** crée une retraite fédérale et une assurance chômage, inexistantes jusque-là. Tous les soirs, il explique ses décisions à la radio dans des **causeries au coin du feu** écoutées par des dizaines de millions d’Américains. Le chômage recule sans disparaître — c’est la guerre qui l’effacera —, mais l’État fédéral a changé de rôle pour de bon.',
      },
      {
        titre: 'L’arsenal des démocraties',
        texte:
          'L’Amérique de 1939 est **isolationniste** : des lois de neutralité interdisent de vendre des armes aux belligérants. Roosevelt, qui voit venir le danger, avance par étapes. Il obtient la vente « cash and carry », puis, en mars **1941**, la loi **prêt-bail** : les États-Unis prêtent ou louent matériel, avions, camions et vivres au Royaume-Uni, puis à l’URSS et à la France libre — plus de 50 milliards de dollars de l’époque. En août 1941, il signe avec **Churchill** la **Charte de l’Atlantique**, qui fixe les buts de guerre des démocraties avant même d’être en guerre. Les usines américaines se convertissent : en quatre ans, elles produiront près de 300 000 avions et 2 700 cargos Liberty.',
      },
      {
        titre: 'Pearl Harbor et la guerre mondiale',
        texte:
          'Le **7 décembre 1941**, l’aviation japonaise attaque par surprise la base navale de **Pearl Harbor**, à Hawaï : 2 403 morts, huit cuirassés touchés. Le lendemain, Roosevelt demande au Congrès la déclaration de guerre ; l’Allemagne et l’Italie déclarent à leur tour la guerre aux États-Unis le 11 décembre. La puissance industrielle américaine bascule dans le conflit et décide de son issue. Roosevelt choisit de battre d’abord l’Allemagne : débarquements en Afrique du Nord (1942), en Sicile (1943), en **Normandie** le 6 juin 1944. Il autorise aussi, en 1942, le **projet Manhattan** qui fabrique la bombe atomique. À l’intérieur, la guerre laisse une tache : 120 000 Américains d’origine japonaise sont internés dans des camps par décret de février 1942.',
      },
      {
        titre: 'Yalta, puis Warm Springs',
        texte:
          'En février **1945**, à **Yalta**, en Crimée, Roosevelt, Churchill et Staline organisent l’après-guerre : occupation de l’Allemagne en zones, élections libres promises dans l’Europe libérée, et création d’une organisation mondiale — l’**ONU**, fondée à San Francisco quelques mois plus tard. Roosevelt est alors épuisé, le visage creusé ; les photographies de la conférence le montrent. Il meurt d’une hémorragie cérébrale le **12 avril 1945** à Warm Springs, en Géorgie, à soixante-trois ans, un mois avant la capitulation allemande et quatre mois avant Hiroshima. Son vice-président **Harry Truman**, qui ignorait jusqu’à l’existence de la bombe atomique, lui succède. Depuis 1951, la Constitution américaine limite les présidents à deux mandats : personne ne refera ce qu’il a fait.',
      },
    ],
    chrono: [
      { date: '1882', fait: 'Naissance à Hyde Park, État de New York.' },
      { date: '1921', fait: 'La poliomyélite le paralyse des jambes.' },
      { date: '8 novembre 1932', fait: 'Élu président contre Herbert Hoover.' },
      { date: 'mars-juin 1933', fait: 'Les Cent Jours : le New Deal est lancé.' },
      { date: '1935', fait: 'Loi sur la Sécurité sociale.' },
      { date: 'mars 1941', fait: 'Loi prêt-bail : l’arsenal des démocraties.' },
      { date: '7 décembre 1941', fait: 'Pearl Harbor ; les États-Unis entrent en guerre.' },
      { date: 'février 1945', fait: 'Conférence de Yalta avec Churchill et Staline.' },
      { date: '12 avril 1945', fait: 'Mort à Warm Springs, en Géorgie.' },
    ],
    leSaisTu:
      'La presse américaine n’a presque jamais montré son fauteuil roulant : sur plus de 100 000 photographies officielles, deux seulement l’y font voir. Les journalistes le savaient et se taisaient ; beaucoup d’Américains ont appris sa paralysie après sa mort.',
    aRetenir: [
      'Roosevelt est élu président en 1932 au plus fort de la crise née du krach de 1929.',
      'Le New Deal (1933-1938) fait intervenir l’État : grands travaux, aide aux chômeurs, Sécurité sociale en 1935.',
      'La loi prêt-bail de mars 1941 arme le Royaume-Uni et l’URSS avant l’entrée en guerre américaine.',
      'Après Pearl Harbor (7 décembre 1941), les États-Unis entrent dans la Seconde Guerre mondiale.',
      'À Yalta, en février 1945, il prépare l’après-guerre et l’ONU ; il meurt le 12 avril 1945.',
    ],
    mots: [
      {
        mot: 'New Deal',
        sens: 'Politique de relance par l’État lancée en 1933 : grands travaux, régulation des banques, protection sociale.',
      },
      {
        mot: 'Prêt-bail',
        sens: 'Loi de mars 1941 permettant aux États-Unis de fournir du matériel de guerre aux Alliés sans paiement immédiat.',
      },
      {
        mot: 'Isolationnisme',
        sens: 'Refus américain de s’engager dans les conflits européens, dominant de 1919 à 1941.',
      },
    ],
    lies: [
      'crise-de-1929',
      'pearl-harbor',
      'winston-churchill',
      'staline',
      'creation-de-l-onu',
    ],
    niveaux: ['3e'],
    programme: 'La Deuxième Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'FDR',
      'New Deal',
      'crise de 1929',
      'Pearl Harbor',
      'prêt-bail',
      'Yalta',
      'États-Unis',
      'quatre libertés',
      'causeries au coin du feu',
    ],
  },
  {
    id: 'mussolini',
    volet: 'personnages',
    nom: 'Benito Mussolini',
    surnom: 'le Duce',
    dates: '1883 – 1945',
    tri: 1945,
    periode: 'guerres',
    emoji: '🗣️',
    roles: ['Fondateur du fascisme', 'Chef du gouvernement italien', 'Dictateur de l’Italie'],
    origine: 'Predappio, Romagne',
    accroche:
      'Inventeur du fascisme et du mot « totalitaire », il prend le pouvoir par la menace en 1922, tient l’Italie vingt ans et la jette dans la guerre de Hitler.',
    citations: [
      {
        texte: 'Tout dans l’État, rien hors de l’État, rien contre l’État.',
        contexte: 'Discours au théâtre de la Scala, à Milan, le 28 octobre 1925.',
        sens:
          'La définition du totalitarisme par celui qui a lancé le mot : plus de syndicat, de presse, d’association ni de parti en dehors de l’État fasciste.',
      },
      {
        texte: 'J’ai fait mon discours. À vous, maintenant, de préparer mon oraison funèbre.',
        qui: 'Giacomo Matteotti, député socialiste',
        contexte:
          'À ses collègues, le 30 mai 1924, après avoir dénoncé à la Chambre les fraudes et les violences fascistes.',
        sens:
          'Il est enlevé et assassiné onze jours plus tard. Son meurtre déclenche une crise que Mussolini surmonte en supprimant ce qui restait de libertés.',
      },
      {
        texte: 'Si le fascisme a été une association de malfaiteurs, j’en suis le chef.',
        contexte: 'Devant la Chambre des députés, le 3 janvier 1925, après l’affaire Matteotti.',
        sens:
          'Plutôt que de se défendre, il assume tout et met les députés au défi de le renverser. Aucun ne bouge : la dictature s’installe dans les mois qui suivent.',
      },
      {
        texte: 'Croire, obéir, combattre.',
        contexte:
          'Devise du régime, peinte sur les murs des villes italiennes et enseignée dans les écoles.',
        sens:
          'Trois verbes à l’impératif qui résument le programme éducatif du fascisme : la foi dans le chef remplace le jugement personnel.',
      },
    ],
    reperes: [
      'Fils de forgeron, instituteur puis journaliste socialiste ; exclu de son parti en 1914 pour avoir voulu la guerre.',
      'Fonde les Faisceaux italiens de combat à Milan le 23 mars 1919 ; ses squadristes brûlent bourses du travail et coopératives.',
      'Marche sur Rome, octobre 1922 : le roi Victor-Emmanuel III l’appelle au gouvernement sans un coup de feu.',
      'Assassinat du député Matteotti en 1924, puis lois « fascistissimes » de 1925-1926 : parti unique et police politique.',
      'Invasion de l’Éthiopie en 1935, lois raciales en 1938, entrée en guerre aux côtés de Hitler le 10 juin 1940.',
      'Renversé par son propre Grand Conseil le 25 juillet 1943, fusillé par des partisans le 28 avril 1945.',
    ],
    recit: [
      {
        titre: 'Du socialisme au faisceau',
        texte:
          'Mussolini n’est pas venu de la droite : fils de forgeron romagnol, il a été instituteur, insoumis réfugié en Suisse, puis directeur de l’*Avanti !*, le grand journal socialiste italien. En 1914, il rompt avec son parti parce qu’il veut que l’Italie entre en guerre — ce qu’elle fait en 1915. Après 1918, le pays est amer : 650 000 morts, une dette énorme, et le sentiment d’avoir été floué à la table des vainqueurs (la « victoire mutilée »). Grèves, occupations d’usines et de terres font craindre une révolution à la russe. Le **23 mars 1919**, Mussolini fonde à Milan les **Faisceaux italiens de combat**, avec d’anciens combattants. Ses **squadristes** en chemise noire ne font pas de politique au sens ordinaire : ils incendient les sièges syndicaux, bastonnent les élus socialistes, les forcent à boire de l’huile de ricin. Industriels et propriétaires terriens paient, la police regarde ailleurs.',
      },
      {
        titre: 'La marche sur Rome : un bluff qui réussit',
        texte:
          'En octobre **1922**, environ 25 000 fascistes mal armés convergent vers Rome sous la pluie. L’armée peut les arrêter sans difficulté et le gouvernement prépare l’état de siège — mais le roi **Victor-Emmanuel III** refuse de le signer. Le 29 octobre, il appelle Mussolini, trente-neuf ans, à former le gouvernement. Celui-ci arrive de Milan en wagon-lit : la « marche sur Rome » est d’abord une mise en scène, et la légende fasciste en fera une conquête héroïque. Mussolini gouverne au début avec des ministres libéraux et une loi électorale taillée sur mesure. Tout bascule avec l’assassinat du député **Matteotti** en juin 1924 : l’opposition quitte la Chambre pour protester, ce qui laisse le terrain libre. Les lois de 1925-1926 suppriment les partis, la liberté de la presse, les syndicats libres, et créent un tribunal spécial et une police politique.',
      },
      {
        titre: 'Un État qui veut tout encadrer',
        texte:
          'Le fascisme prétend fabriquer un « homme nouveau ». L’enfant italien passe des *Balilla* aux jeunesses du parti ; l’école apprend l’obéissance au **Duce**, dont le portrait est partout. L’économie est organisée en **corporations** censées réconcilier patrons et ouvriers sous l’autorité de l’État ; les grèves sont interdites. Le régime assèche les marais Pontins, construit des villes neuves, lance la « bataille du blé » pour l’autosuffisance. Avec les **accords du Latran** (1929), il règle le vieux conflit avec la papauté et se gagne l’Église. La propagande et le cinéma font le reste. La violence reste au fond : environ 5 000 condamnations politiques par le tribunal spécial, des milliers d’opposants assignés à résidence dans des îles, et l’exil pour les autres. En **1935-1936**, l’Italie envahit l’**Éthiopie** avec des gaz de combat ; la Société des Nations proteste sans agir.',
      },
      {
        titre: 'La guerre de Hitler, puis la chute',
        texte:
          'Mussolini a d’abord traité Hitler de haut : c’est le modèle italien que l’Allemagne a copié, et en 1934 l’Italie s’oppose encore à l’annexion de l’Autriche. L’Éthiopie change tout : isolée, l’Italie se rapproche de Berlin. Axe Rome-Berlin en 1936, intervention commune en Espagne, **lois raciales** italiennes en 1938 qui excluent les Juifs de l’école, de l’armée et de l’administration, pacte d’Acier en 1939. Le **10 juin 1940**, l’Italie déclare la guerre à la France déjà battue. La suite est une série de défaites — Grèce, Afrique du Nord, Russie — et le pays occupé par son propre allié. Le **25 juillet 1943**, après le débarquement allié en Sicile, le Grand Conseil fasciste le désavoue et le roi le fait arrêter. Libéré par un commando allemand, il dirige un État fantoche au nord, la république de Salò. Le **28 avril 1945**, des partisans l’arrêtent près du lac de Côme et le fusillent.',
      },
    ],
    chrono: [
      { date: '1883', fait: 'Naissance à Predappio, en Romagne.' },
      { date: '23 mars 1919', fait: 'Fondation des Faisceaux de combat à Milan.' },
      { date: '29 octobre 1922', fait: 'Le roi l’appelle à former le gouvernement.' },
      { date: '10 juin 1924', fait: 'Assassinat du député Matteotti.' },
      { date: '1925-1926', fait: 'Lois « fascistissimes » : parti unique.' },
      { date: '1929', fait: 'Accords du Latran avec le Vatican.' },
      { date: '1935-1936', fait: 'Conquête de l’Éthiopie.' },
      { date: '1938', fait: 'Lois raciales contre les Juifs italiens.' },
      { date: '10 juin 1940', fait: 'L’Italie entre en guerre aux côtés de l’Allemagne.' },
      { date: '25 juillet 1943', fait: 'Destitué et arrêté sur ordre du roi.' },
      { date: '28 avril 1945', fait: 'Fusillé par des partisans près du lac de Côme.' },
    ],
    leSaisTu:
      'Le mot « totalitaire » a été inventé contre lui : c’est le député libéral Giovanni Amendola qui l’emploie en 1923 pour dénoncer un système qui veut tout occuper. Mussolini s’en empare et le revendique comme un compliment — l’insulte de ses adversaires est devenue le nom du régime.',
    aRetenir: [
      'Mussolini fonde le mouvement fasciste à Milan en 1919 et arrive au pouvoir après la marche sur Rome d’octobre 1922.',
      'L’assassinat du député Matteotti en 1924 ouvre la voie aux lois de 1925-1926 qui installent la dictature.',
      'Le régime encadre la jeunesse, interdit les grèves et organise l’économie en corporations.',
      'L’Italie envahit l’Éthiopie en 1935 et adopte des lois raciales antijuives en 1938.',
      'Entrée en guerre le 10 juin 1940, l’Italie s’effondre ; Mussolini est destitué en 1943 et fusillé en 1945.',
    ],
    mots: [
      {
        mot: 'Fascisme',
        sens: 'Régime né en Italie en 1919-1922 : parti unique, chef vénéré, violence de rue, nation exaltée, opposition supprimée.',
      },
      {
        mot: 'Chemises noires',
        sens: 'Les squadristes, groupes armés du parti fasciste qui attaquent syndicats et élus de gauche avant 1922.',
      },
      {
        mot: 'Totalitarisme',
        sens: 'Système où l’État prétend contrôler la totalité de la vie : politique, travail, loisirs, école, pensée.',
      },
    ],
    lies: ['adolf-hitler', 'staline', 'debut-de-la-seconde-guerre-mondiale', 'traite-de-versailles'],
    niveaux: ['3e', 'Tle'],
    programme:
      'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'fascisme',
      'Duce',
      'marche sur Rome',
      'chemises noires',
      'Matteotti',
      'Italie',
      'Éthiopie',
      'Salò',
      'totalitarisme',
    ],
  },
  {
    id: 'staline',
    volet: 'personnages',
    nom: 'Joseph Staline',
    surnom: 'l’homme d’acier',
    dates: '1878 – 1953',
    tri: 1945,
    periode: 'guerres',
    emoji: '🏭',
    roles: ['Secrétaire général du parti communiste', 'Dictateur de l’URSS', 'Chef de guerre'],
    origine: 'Gori, Géorgie',
    accroche:
      'Maître de l’URSS pendant vingt-cinq ans : il industrialise le pays à marche forcée, affame l’Ukraine, remplit le Goulag et brise la Wehrmacht à Stalingrad.',
    citations: [
      {
        texte:
          'Nous avons cinquante à cent ans de retard sur les pays avancés. Nous devons combler cette distance en dix ans. Ou nous le faisons, ou ils nous écrasent.',
        contexte:
          'Aux dirigeants de l’industrie soviétique, le 4 février 1931, au lancement des plans quinquennaux.',
        sens:
          'C’est la justification de tout : la collectivisation forcée, les cadences, le travail des détenus. Dix ans plus tard, en 1941, l’Allemagne attaquait.',
      },
      {
        texte: 'Pas un pas en arrière !',
        contexte:
          'Ordre n° 227, le 28 juillet 1942, alors que la Wehrmacht avance vers Stalingrad.',
        sens:
          'Reculer devient un crime : des détachements placés à l’arrière tirent sur les soldats qui fuient. L’ordre arrête l’avance allemande au prix de pertes énormes.',
      },
      {
        texte: 'La mort d’un homme est une tragédie ; la mort d’un million d’hommes, une statistique.',
        contexte: 'Phrase qu’on lui prête depuis les années 1940, sans aucune source établie.',
        sens:
          'Aucun document ne la contient. On la cite parce qu’elle résume ce que ses décisions ont fait, mais elle n’est pas de lui : il ne faut pas l’écrire comme une citation.',
        incertaine: true,
      },
    ],
    reperes: [
      'Géorgien, fils de cordonnier, séminariste renvoyé, puis braqueur de banques pour financer les bolcheviks.',
      'Secrétaire général du parti en 1922 ; il écarte Trotski, exilé en 1929 et assassiné au Mexique en 1940.',
      'Collectivisation à partir de 1929 : la famine de 1932-1933 tue environ 4 millions de personnes en Ukraine.',
      'Grande Terreur de 1937-1938 : près de 750 000 fusillés et 1,5 million d’arrestations en deux ans.',
      'Pacte germano-soviétique du 23 août 1939 : l’URSS et l’Allemagne se partagent la Pologne.',
      'Stalingrad en 1943, Berlin en 1945 : l’URSS paie la victoire d’environ 26 millions de morts.',
    ],
    recit: [
      {
        titre: 'L’homme que personne ne voyait venir',
        texte:
          'Iossif Djougachvili naît en 1878 à **Gori**, en Géorgie, dans une famille pauvre. Séminariste, il est renvoyé pour idées révolutionnaires, devient militant clandestin, organise grèves et attaques de fourgons pour financer le parti, connaît la prison et la déportation en Sibérie. Il prend le nom de **Staline**, « l’homme d’acier ». Après 1917, il n’a ni l’éloquence de Trotski ni la stature de Lénine ; on lui confie les tâches administratives, et en **1922** le poste de **secrétaire général** du parti, que tout le monde croit subalterne. C’est l’erreur : ce poste nomme les cadres dans tout le pays. En cinq ans, l’appareil est rempli d’hommes qui lui doivent leur place. Lénine, mourant, demande son éloignement ; le parti étouffe le texte. En 1929, Trotski est expulsé d’URSS et Staline règne seul.',
      },
      {
        titre: 'Collectiviser : les campagnes affamées',
        texte:
          'À partir de **1929**, les paysans sont contraints d’abandonner terre, bétail et outils pour entrer dans des fermes collectives, les **kolkhozes**. Ceux qui résistent sont désignés comme **koulaks**, paysans « riches » : environ **1,8 million** sont déportés vers la Sibérie et le Grand Nord, des centaines de milliers y meurent. Les paysans abattent leur bétail plutôt que de le céder — le cheptel bovin chute de moitié. Malgré l’effondrement des récoltes, l’État continue de prélever le grain, ferme les villages et interdit aux affamés de partir. La famine de **1932-1933** tue environ **4 millions de personnes en Ukraine** et deux millions ailleurs (Kazakhstan, Volga, Caucase). L’Ukraine l’appelle l’**Holodomor**, « extermination par la faim ». Le mot famine est alors interdit dans la presse soviétique, et l’URSS exporte du blé pendant ces deux années.',
      },
      {
        titre: 'Les plans quinquennaux et le Goulag',
        texte:
          'Pendant que les campagnes meurent, l’industrie sort de terre. Les **plans quinquennaux** fixent des objectifs chiffrés pour chaque usine : charbon, acier, tracteurs, électricité. Des villes entières naissent en quelques années, comme **Magnitogorsk** dans l’Oural. En dix ans, la production d’acier est multipliée par quatre et l’URSS devient la deuxième puissance industrielle du monde — un résultat réel, payé par des cadences écrasantes, des logements insalubres et l’absence de biens de consommation. Une partie des chantiers est faite par des détenus : le **Goulag**, l’administration des camps, exploite le canal mer Blanche-Baltique, les mines d’or de la Kolyma, les forêts du Nord. Environ **18 millions de personnes** passent par ces camps entre 1930 et 1953 ; au moins 1,6 million y meurent. Le travail forcé n’est pas une punition annexe : il est inscrit dans le plan économique.',
      },
      {
        titre: 'La Grande Terreur',
        texte:
          'En **1937-1938**, la répression change d’échelle. L’ordre n° 00447 fixe à chaque région des **quotas** de personnes à fusiller et à déporter ; les chefs locaux demandent des rallonges pour se montrer zélés. En deux ans, environ **750 000 personnes sont fusillées** et 1,5 million arrêtées : paysans, ouvriers, prêtres, ingénieurs, minorités nationales, et les cadres du parti eux-mêmes. Les **procès de Moscou** montrent de vieux bolcheviks avouant en public des complots imaginaires, après des mois d’interrogatoires. L’armée est décapitée à la veille de la guerre : trois maréchaux sur cinq et des milliers d’officiers sont exécutés. Le **culte de la personnalité** atteint son sommet au même moment — portraits géants, poèmes, villes rebaptisées. La peur devient un mode de gouvernement : chacun sait qu’une dénonciation suffit.',
      },
      {
        titre: 'Le pacte, l’invasion, Stalingrad',
        texte:
          'Le **23 août 1939**, Staline signe avec Hitler un **pacte de non-agression** assorti d’un protocole secret qui partage la Pologne et donne les pays baltes à l’URSS. Deux semaines plus tard, l’Armée rouge entre en Pologne par l’est ; 22 000 officiers polonais sont fusillés à **Katyn** au printemps 1940. Staline refuse de croire aux avertissements sur une attaque allemande : le **22 juin 1941**, l’opération **Barbarossa** le prend de court et l’armée perd trois millions d’hommes en six mois. L’URSS tient pourtant : usines démontées et remontées derrière l’Oural, mobilisation totale, hiver. À **Stalingrad**, du 17 juillet 1942 au 2 février 1943, la VIᵉ armée allemande est encerclée et capitule : c’est le tournant de la guerre en Europe. L’Armée rouge repousse ensuite la Wehrmacht jusqu’à **Berlin**, en mai 1945.',
      },
      {
        titre: 'Le vainqueur de 1945 et la suite',
        texte:
          'En 1945, Staline est à la table des vainqueurs, à **Yalta** puis à **Potsdam**. L’URSS a perdu environ **26 millions** de personnes, mais son armée occupe la moitié de l’Europe. Les promesses d’élections libres ne sont pas tenues : entre 1945 et 1948, la Pologne, la Hongrie, la Roumanie, la Bulgarie et la Tchécoslovaquie passent une à une sous régime communiste. C’est le début de la **guerre froide**, que Churchill résume par l’image du « rideau de fer ». À l’intérieur, la répression reprend après la guerre, y compris contre les soldats soviétiques revenus de captivité. Staline meurt le **5 mars 1953**. Trois ans plus tard, son successeur **Khrouchtchev** dénonce devant le congrès du parti les crimes et le culte de la personnalité : le rapport, dit secret, fait le tour du monde.',
      },
    ],
    chrono: [
      { date: '1878', fait: 'Naissance à Gori, en Géorgie.' },
      { date: '1922', fait: 'Secrétaire général du parti communiste.' },
      { date: '1929', fait: 'Trotski expulsé ; début de la collectivisation.' },
      { date: '1932-1933', fait: 'Famine en Ukraine : l’Holodomor.' },
      { date: '1937-1938', fait: 'Grande Terreur : 750 000 fusillés.' },
      { date: '23 août 1939', fait: 'Pacte germano-soviétique avec Hitler.' },
      { date: '22 juin 1941', fait: 'L’Allemagne envahit l’URSS.' },
      { date: 'février 1943', fait: 'Victoire de Stalingrad.' },
      { date: 'mai 1945', fait: 'L’Armée rouge prend Berlin.' },
      { date: '5 mars 1953', fait: 'Mort à Moscou.' },
      { date: '1956', fait: 'Khrouchtchev dénonce ses crimes devant le parti.' },
    ],
    leSaisTu:
      'Les photographies officielles étaient retouchées : quand un dirigeant était fusillé, on l’effaçait des clichés où il posait aux côtés de Staline. Le chef de la police Iejov, exécuté en 1940, disparaît ainsi d’une photo prise au bord d’un canal — il ne reste que l’eau.',
    aRetenir: [
      'Staline devient secrétaire général en 1922 et dirige seul l’URSS à partir de 1929.',
      'La collectivisation des terres provoque la famine de 1932-1933 : environ 4 millions de morts en Ukraine.',
      'Les plans quinquennaux industrialisent le pays, en partie par le travail forcé du Goulag.',
      'La Grande Terreur de 1937-1938 fait environ 750 000 fusillés, dont une grande partie des cadres du parti et de l’armée.',
      'Après le pacte germano-soviétique de 1939, l’URSS est envahie en 1941 et l’emporte à Stalingrad en 1943.',
      'Vainqueur en 1945, il impose des régimes communistes à l’Europe de l’Est ; il meurt en 1953.',
    ],
    mots: [
      {
        mot: 'Collectivisation',
        sens: 'Regroupement forcé des terres et du bétail dans des fermes d’État ou coopératives, à partir de 1929.',
      },
      {
        mot: 'Koulak',
        sens: 'Paysan accusé d’être riche ; l’étiquette suffisait à faire déporter une famille entière.',
      },
      {
        mot: 'Goulag',
        sens: 'Administration soviétique des camps de travail forcé : environ 18 millions de détenus entre 1930 et 1953.',
      },
      {
        mot: 'Holodomor',
        sens: 'Nom ukrainien de la famine de 1932-1933, « extermination par la faim », provoquée par les réquisitions.',
      },
      {
        mot: 'Culte de la personnalité',
        sens: 'Propagande qui présente le chef comme infaillible : portraits, statues, poèmes, villes à son nom.',
      },
    ],
    lies: [
      'lenine',
      'adolf-hitler',
      'bataille-de-stalingrad',
      'operation-barbarossa',
      'debut-de-la-guerre-froide',
    ],
    niveaux: ['3e', 'Tle'],
    programme:
      'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'Djougachvili',
      'URSS',
      'Goulag',
      'Holodomor',
      'plans quinquennaux',
      'Grande Terreur',
      'Stalingrad',
      'Trotski',
      'communisme',
      'Yalta',
    ],
  },
  {
    id: 'winston-churchill',
    volet: 'personnages',
    nom: 'Winston Churchill',
    surnom: 'le vieux lion',
    dates: '1874 – 1965',
    tri: 1945,
    periode: 'guerres',
    emoji: '✌️',
    roles: [
      'Premier ministre britannique',
      'Chef de guerre allié',
      'Écrivain, prix Nobel de littérature',
    ],
    origine: 'Blenheim Palace, Oxfordshire',
    accroche:
      'Premier ministre le jour même où Hitler attaque à l’ouest, il refuse toute négociation et tient un an presque seul, jusqu’à ce que le monde le rejoigne.',
    citations: [
      {
        texte: 'Je n’ai rien d’autre à offrir que du sang, du labeur, des larmes et de la sueur.',
        contexte: 'Premier discours aux Communes comme Premier ministre, le 13 mai 1940.',
        sens:
          'Il promet l’inverse de ce qu’un dirigeant promet d’ordinaire : ni victoire rapide, ni paix, seulement l’effort. Les Communes le suivent à l’unanimité.',
      },
      {
        texte:
          'Nous nous battrons sur les plages, nous nous battrons sur les terrains de débarquement, nous nous battrons dans les champs et dans les rues, nous ne nous rendrons jamais.',
        contexte:
          'Aux Communes, le 4 juin 1940, à la fin de l’évacuation de Dunkerque et alors que la France s’effondre.',
        sens:
          'Le Royaume-Uni se prépare à être envahi. Churchill dit publiquement qu’il n’y aura pas d’armistice, quoi qu’il arrive.',
      },
      {
        texte:
          'Jamais, dans le champ des conflits humains, autant de gens n’ont dû autant à si peu de personnes.',
        contexte:
          'Aux Communes, le 20 août 1940, en pleine bataille d’Angleterre, à propos des pilotes de la RAF.',
        sens:
          'Quelques milliers de pilotes de chasse empêchent l’invasion de l’île : « si peu » d’hommes ont sauvé « autant » de monde.',
      },
      {
        texte:
          'De Stettin, sur la Baltique, à Trieste, sur l’Adriatique, un rideau de fer est descendu à travers le continent.',
        contexte: 'Discours de Fulton, dans le Missouri, le 5 mars 1946.',
        sens:
          'Il nomme la coupure de l’Europe en deux blocs. L’expression « rideau de fer » entre aussitôt dans la langue : la guerre froide a son image.',
      },
    ],
    reperes: [
      'Officier et correspondant de guerre avant trente ans, ministre dès 1908 ; sa carrière est brisée par l’échec des Dardanelles en 1915.',
      'Dans les années 1930, il alerte presque seul sur le réarmement allemand et passe pour un va-t-en-guerre.',
      'Premier ministre le 10 mai 1940, le jour de l’offensive allemande à l’ouest.',
      'Mai 1940 : il refuse d’ouvrir des négociations avec Hitler, contre une partie de son propre cabinet.',
      'Charte de l’Atlantique avec Roosevelt en 1941 ; conférences de Téhéran, Yalta et Potsdam.',
      'Battu aux élections de juillet 1945 ; de nouveau Premier ministre de 1951 à 1955 ; mort en 1965.',
    ],
    recit: [
      {
        titre: 'Quarante ans de politique avant l’heure',
        texte:
          'Petit-fils de duc, mauvais élève, Churchill devient officier de cavalerie et correspondant de guerre en Inde, au Soudan et en Afrique du Sud, où son évasion d’un camp boer le rend célèbre à vingt-cinq ans. Député à vingt-six ans, ministre à trente-trois, il participe à toutes les réformes sociales libérales d’avant 1914. Premier lord de l’Amirauté en 1914, il porte la responsabilité du désastre des **Dardanelles** en 1915 : il démissionne et repart se battre en France comme colonel. Il revient, change deux fois de parti, gère les finances. Dans les années **1930**, retiré des affaires, il dénonce sans relâche le réarmement de l’Allemagne et la politique d’**apaisement** des gouvernements britanniques. On le trouve alarmiste, belliqueux, fini. Quand les accords de Munich sont signés, en 1938, il déclare aux Communes que le pays a eu le choix entre le déshonneur et la guerre, qu’il a choisi le déshonneur, et qu’il aura la guerre.',
      },
      {
        titre: 'Mai 1940 : dire non',
        texte:
          'Le **10 mai 1940**, le jour où la Wehrmacht attaque la Belgique, les Pays-Bas et la France, Churchill devient Premier ministre d’un gouvernement d’union nationale. Tout va très vite : le front est percé, les armées alliées sont rejetées à la mer et **338 000 hommes** sont évacués de **Dunkerque** entre le 26 mai et le 4 juin. La France demande l’armistice le 17 juin. À Londres, fin mai, le cabinet de guerre discute pendant trois jours d’une médiation de l’Italie pour sonder les conditions de Hitler ; lord **Halifax** y est favorable. Churchill refuse : négocier depuis une position de faiblesse, dit-il, reviendrait à devenir un État vassal. Il emporte la décision. Le Royaume-Uni continue la guerre seul, avec son empire, et accueille à Londres les gouvernements en exil et le général **de Gaulle**.',
      },
      {
        titre: 'La bataille d’Angleterre et le Blitz',
        texte:
          'Hitler prépare un débarquement et doit d’abord détruire l’aviation britannique. De juillet à octobre **1940**, la **bataille d’Angleterre** oppose la Luftwaffe à la **RAF** au-dessus de la Manche et du sud de l’île. Les Britanniques disposent d’une chaîne de **radars** et d’un système de commandement qui envoie les chasseurs au bon endroit ; ils perdent environ 1 500 aviateurs, les Allemands deux fois plus d’appareils. L’invasion est reportée, puis abandonnée. La Luftwaffe se rabat sur les villes : pendant le **Blitz**, de septembre 1940 à mai 1941, Londres est bombardée cinquante-sept nuits de suite, Coventry détruite en une nuit, et environ **43 000 civils** britanniques sont tués. Churchill visite les quartiers en ruine, parle à la radio, se fait filmer dans les décombres. Son arme principale, durant cette année-là, est la parole.',
      },
      {
        titre: 'La Grande Alliance',
        texte:
          'Churchill sait que le Royaume-Uni seul ne peut pas gagner. Il passe la guerre à construire une coalition. Avec **Roosevelt**, qu’il rencontre en août 1941 au large de Terre-Neuve, il signe la **Charte de l’Atlantique** : droit des peuples à choisir leur gouvernement, liberté des mers, refus des annexions. Quand Hitler envahit l’URSS en juin 1941, il soutient aussitôt **Staline**, dont il combat pourtant le régime depuis vingt ans. Après Pearl Harbor, la « Grande Alliance » est constituée. Les trois se retrouvent à **Téhéran** (1943), puis à **Yalta** (février 1945) : Churchill y défend une Europe de l’Est libre, sans obtenir grand-chose face à une Armée rouge déjà sur place. Il pousse aussi la stratégie méditerranéenne — Afrique du Nord, Sicile, Italie — avant le débarquement de **Normandie** du 6 juin 1944.',
      },
      {
        titre: 'Battu en pleine victoire',
        texte:
          'Le **8 mai 1945**, il annonce la capitulation allemande à une foule immense. Onze semaines plus tard, le 26 juillet, les Britanniques le renvoient : le parti travailliste gagne les élections sur un programme de logement, de santé et d’emploi. Churchill l’apprend pendant la conférence de **Potsdam** et rentre à Londres. Il ne se retire pas pour autant. Le **5 mars 1946**, à Fulton, il décrit le « **rideau de fer** » tombé sur l’Europe. En 1946 à Zurich, il appelle à des « États-Unis d’Europe » fondés sur une réconciliation franco-allemande. Il redevient Premier ministre de 1951 à 1955, reçoit le **prix Nobel de littérature** en 1953, et meurt le 24 janvier **1965**. Son pays lui offre des funérailles nationales, honneur rarissime pour un homme qui n’était pas souverain.',
      },
    ],
    chrono: [
      { date: '1874', fait: 'Naissance à Blenheim Palace, dans l’Oxfordshire.' },
      { date: '1915', fait: 'Échec des Dardanelles : il quitte l’Amirauté.' },
      { date: '1938', fait: 'Il dénonce aux Communes les accords de Munich.' },
      { date: '10 mai 1940', fait: 'Premier ministre le jour de l’offensive allemande.' },
      { date: '4 juin 1940', fait: 'Discours « nous nous battrons sur les plages ».' },
      { date: 'été 1940', fait: 'Bataille d’Angleterre ; la RAF empêche l’invasion.' },
      { date: 'août 1941', fait: 'Charte de l’Atlantique avec Roosevelt.' },
      { date: 'février 1945', fait: 'Conférence de Yalta.' },
      { date: 'juillet 1945', fait: 'Battu aux élections législatives.' },
      { date: '5 mars 1946', fait: 'Discours de Fulton : le « rideau de fer ».' },
      { date: '1965', fait: 'Mort à Londres ; funérailles nationales.' },
    ],
    leSaisTu:
      'Son prix Nobel de 1953 est celui de littérature, pas de la paix : il avait écrit plus de quarante livres, dont six volumes sur la Seconde Guerre mondiale, et vivait de sa plume entre deux ministères. Le jury a récompensé ses ouvrages historiques et « l’éloquence qui a défendu les valeurs humaines ».',
    aRetenir: [
      'Churchill devient Premier ministre le 10 mai 1940, le jour de l’offensive allemande à l’ouest.',
      'En mai 1940, il refuse toute négociation avec Hitler et engage le Royaume-Uni à continuer seul.',
      'La RAF gagne la bataille d’Angleterre à l’été 1940 et empêche l’invasion de l’île.',
      'Avec Roosevelt puis Staline, il forme la Grande Alliance : Charte de l’Atlantique, Téhéran, Yalta.',
      'Battu aux élections de juillet 1945, il nomme en 1946 le « rideau de fer » qui coupe l’Europe.',
    ],
    mots: [
      {
        mot: 'Apaisement',
        sens: 'Politique des années 1930 consistant à céder aux exigences de Hitler pour éviter la guerre.',
      },
      {
        mot: 'Blitz',
        sens: 'Campagne de bombardements allemands sur les villes britanniques, de septembre 1940 à mai 1941.',
      },
      {
        mot: 'Rideau de fer',
        sens: 'Image de Churchill (1946) pour la frontière fermée entre l’Europe de l’Ouest et le bloc soviétique.',
      },
    ],
    lies: [
      'franklin-roosevelt',
      'adolf-hitler',
      'charles-de-gaulle',
      'staline',
      'debut-de-la-guerre-froide',
    ],
    niveaux: ['3e'],
    programme: 'La Deuxième Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Royaume-Uni',
      'Dunkerque',
      'bataille d’Angleterre',
      'RAF',
      'Blitz',
      'rideau de fer',
      'Yalta',
      'Fulton',
      'Alliés',
    ],
  },
  {
    id: 'gandhi',
    volet: 'personnages',
    nom: 'Mohandas Gandhi',
    surnom: 'le Mahatma',
    dates: '1869 – 1948',
    tri: 1948,
    periode: 'guerres',
    emoji: '🧂',
    roles: [
      'Avocat indien',
      'Chef du mouvement pour l’indépendance',
      'Théoricien de la non-violence',
    ],
    origine: 'Porbandar, Gujarat, Inde',
    accroche:
      'Il a fait reculer le plus grand empire du monde sans tirer un coup de feu — et il est mort assassiné cinq mois après l’indépendance de l’Inde.',
    citations: [
      {
        texte: 'Avec ce sel, j’ébranle les fondations de l’Empire britannique.',
        contexte:
          'À Dandi, le 6 avril 1930, en ramassant une poignée de boue salée au bout de 386 km de marche.',
        sens:
          'Le sel était taxé et son ramassage interdit. En se baissant, Gandhi commet un délit que des dizaines de milliers d’Indiens répètent aussitôt.',
      },
      {
        texte: 'Voici un bref mantra que je vous donne : agir ou mourir.',
        contexte: 'Discours « Quit India » — « Quittez l’Inde » —, à Bombay, le 8 août 1942.',
        sens:
          'Il réclame le départ immédiat des Britanniques en pleine guerre mondiale. Le parti du Congrès est aussitôt interdit et ses chefs emprisonnés jusqu’en 1945.',
      },
      {
        texte: 'Sois le changement que tu veux voir dans le monde.',
        contexte:
          'Phrase répandue depuis les années 1970, absente de ses écrits et de ses discours connus.',
        sens:
          'Elle résume une idée qu’il a vraiment défendue — commencer par soi —, mais il ne l’a pas dite sous cette forme : c’est une formule fabriquée après lui.',
        incertaine: true,
      },
      {
        texte: 'La lumière s’est éteinte de nos vies, et il n’y a plus que ténèbres partout.',
        qui: 'Jawaharlal Nehru, premier ministre de l’Inde',
        contexte: 'À la radio, le soir du 30 janvier 1948, quelques heures après l’assassinat.',
        sens:
          'Nehru annonce sa mort à un pays au bord de la guerre civile entre hindous et musulmans ; l’émotion arrête les violences pendant plusieurs semaines.',
      },
    ],
    reperes: [
      'Avocat formé à Londres ; c’est en Afrique du Sud, de 1893 à 1914, qu’il invente sa méthode d’action.',
      'Satyagraha : la « force de la vérité », résistance sans violence mais sans obéissance à une loi injuste.',
      'À partir de 1920, il organise le boycott des tissus, des tribunaux et des écoles britanniques.',
      'Marche du sel, mars-avril 1930 : 386 km à pied, puis environ 60 000 arrestations dans les mois qui suivent.',
      'Indépendance le 15 août 1947, mais partition entre l’Inde et le Pakistan : un million de morts, douze millions de réfugiés.',
      'Assassiné le 30 janvier 1948 par un nationaliste hindou qui lui reprochait sa défense des musulmans.',
    ],
    recit: [
      {
        titre: 'L’Afrique du Sud, laboratoire d’une méthode',
        texte:
          'Né en 1869 dans une famille de commerçants du Gujarat, Mohandas Gandhi étudie le droit à Londres, échoue comme avocat à Bombay, puis part en **1893** travailler pour une firme indienne en Afrique du Sud. Quelques jours après son arrivée, on le jette d’un compartiment de première classe à la gare de **Pietermaritzburg** parce qu’il n’est pas blanc. Il passe la nuit sur le quai et décide de se battre — mais autrement. Pendant vingt et un ans, il organise la communauté indienne d’Afrique du Sud contre les lois qui l’humilient : refus de s’enregistrer, autodafés de cartes d’identité, grèves de mineurs, marches, prisons acceptées sans résistance. C’est là qu’il forge le mot **satyagraha**, la « force de la vérité ». Il rentre en Inde en 1915, à quarante-cinq ans, déjà connu.',
      },
      {
        titre: 'Désobéir sans frapper',
        texte:
          'L’Inde britannique, ce sont 300 millions d’habitants tenus par quelques dizaines de milliers de fonctionnaires et de soldats européens. Gandhi comprend que cet empire repose sur la **coopération des Indiens** eux-mêmes : s’ils cessent d’acheter, de plaider, d’enseigner et d’obéir, il s’arrête. À partir de **1920**, il lance le mouvement de non-coopération : boycott des tribunaux, des écoles et surtout des tissus anglais, que l’on brûle en place publique. Il se met à filer lui-même son coton au **rouet** une heure par jour, s’habille du simple pagne des paysans et vit dans un ashram. Sa méthode a une règle absolue : aucune violence, même en réponse aux coups. Quand des manifestants tuent vingt-deux policiers en 1922, il suspend tout le mouvement et jeûne — au grand dam de ses partisans. La violence, dit-il, salirait la cause et justifierait la répression.',
      },
      {
        titre: 'La marche du sel',
        texte:
          'En **1930**, il choisit le symbole le plus simple possible. L’administration britannique détient le monopole du **sel** : il est taxé, et ramasser soi-même du sel est un délit, y compris sur une plage. Le **12 mars**, Gandhi part de son ashram avec soixante-dix-huit compagnons et marche **386 kilomètres** en vingt-quatre jours, suivi par la presse du monde entier ; la colonne grossit de village en village. Le **6 avril**, il se baisse sur la plage de **Dandi** et ramasse une poignée de boue salée. Des millions d’Indiens l’imitent sur toutes les côtes ; environ **60 000 personnes**, dont Gandhi, sont arrêtées dans les semaines suivantes. L’Empire ne perd presque rien en argent, mais il perd la scène : partout, on voit des policiers frapper des hommes qui ne lèvent pas la main. En 1931, Gandhi est reçu à Londres par le gouvernement britannique, en pagne.',
      },
      {
        titre: 'Quit India et l’indépendance',
        texte:
          'Pendant la Seconde Guerre mondiale, Londres engage l’Inde dans le conflit sans consulter ses élus ; deux millions et demi d’Indiens serviront pourtant dans l’armée britannique. Le **8 août 1942**, Gandhi lance le mot d’ordre **Quit India** : le départ immédiat des Britanniques. Le parti du **Congrès** est interdit, ses dirigeants emprisonnés jusqu’en 1945, et la répression fait plus d’un millier de morts. Mais après 1945, le Royaume-Uni est ruiné et ne peut plus tenir l’Inde. L’indépendance est proclamée le **15 août 1947**. Gandhi n’assiste pas aux cérémonies : il est à Calcutta, où hindous et musulmans s’entretuent. Il a toujours voulu une Inde unie et considère la **partition** comme une défaite personnelle.',
      },
      {
        titre: 'La partition, puis le 30 janvier 1948',
        texte:
          'La frontière tracée en cinq semaines entre l’Inde et le nouveau **Pakistan** coupe le Pendjab et le Bengale. Douze à quinze millions de personnes traversent dans les deux sens, hindous et sikhs d’un côté, musulmans de l’autre ; les massacres réciproques font entre **500 000 et un million de morts** en quelques mois. À soixante-dix-huit ans, Gandhi va de quartier en quartier et **jeûne** jusqu’à ce que les violences cessent : à Calcutta en septembre 1947, puis à Delhi en janvier 1948, où son jeûne obtient que l’Inde verse au Pakistan la part du trésor qu’elle retenait. Des nationalistes hindous l’accusent alors de trahir les hindous. Le **30 janvier 1948**, alors qu’il se rend à la prière du soir dans un jardin de Delhi, **Nathuram Godse** lui tire trois balles à bout portant. Il meurt en quelques minutes. Sa méthode, elle, voyage : **Martin Luther King** et **Nelson Mandela** s’en réclameront.',
      },
    ],
    chrono: [
      { date: '1869', fait: 'Naissance à Porbandar, au Gujarat.' },
      { date: '1893', fait: 'Expulsé d’un train en Afrique du Sud.' },
      { date: '1915', fait: 'Retour définitif en Inde.' },
      { date: '1920', fait: 'Lancement de la non-coopération et du boycott.' },
      { date: '12 mars 1930', fait: 'Départ de la marche du sel.' },
      { date: '6 avril 1930', fait: 'Il ramasse du sel à Dandi.' },
      { date: '8 août 1942', fait: 'Mot d’ordre Quit India ; il est emprisonné.' },
      { date: '15 août 1947', fait: 'Indépendance de l’Inde et partition.' },
      { date: '30 janvier 1948', fait: 'Assassiné à Delhi.' },
    ],
    leSaisTu:
      'Le rouet de Gandhi figurait au centre du drapeau du parti du Congrès : filer son coton, c’était refuser d’acheter les tissus du colonisateur. En 1947, l’Inde indépendante l’a remplacé par la roue bleue d’Ashoka — mais la place, au milieu du drapeau, est restée la sienne.',
    aRetenir: [
      'Gandhi met au point sa méthode en Afrique du Sud entre 1893 et 1914 : le satyagraha, ou résistance non violente.',
      'À partir de 1920, il organise le boycott des produits et des institutions britanniques en Inde.',
      'La marche du sel (12 mars – 6 avril 1930) est l’acte de désobéissance civile le plus célèbre du XXᵉ siècle.',
      'L’Inde devient indépendante le 15 août 1947, mais la partition avec le Pakistan fait près d’un million de morts.',
      'Gandhi est assassiné le 30 janvier 1948 par un nationaliste hindou.',
    ],
    mots: [
      {
        mot: 'Satyagraha',
        sens: 'Mot forgé par Gandhi : la « force de la vérité », lutte qui refuse la violence mais aussi l’obéissance.',
      },
      {
        mot: 'Désobéissance civile',
        sens: 'Violer publiquement et sans violence une loi jugée injuste, en acceptant d’aller en prison pour cela.',
      },
      {
        mot: 'Boycott',
        sens: 'Refus collectif et organisé d’acheter un produit ou d’utiliser une institution, pour faire pression.',
      },
      {
        mot: 'Partition',
        sens: 'Séparation, en août 1947, de l’Inde britannique en deux États : l’Inde et le Pakistan.',
      },
    ],
    lies: [
      'martin-luther-king',
      'nelson-mandela',
      'decolonisation-de-l-afrique',
      'winston-churchill',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'Mahatma',
      'non-violence',
      'satyagraha',
      'marche du sel',
      'Dandi',
      'Inde',
      'Pakistan',
      'partition',
      'Nehru',
      'désobéissance civile',
    ],
  },
]
