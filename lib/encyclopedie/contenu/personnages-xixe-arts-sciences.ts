// -----------------------------------------------------------------------------
// XIXᵉ SIÈCLE — les arts et les sciences : Marx, Hugo, Eiffel, Pasteur, les
// frères Lumière, Zola, Dreyfus, Marie Curie.
//
// Huit fiches qui racontent le siècle par ce qu'il a PRODUIT — un livre qui
// arme le mouvement ouvrier, un poème qui tient tête à un empereur, une tour
// de trois cents mètres, un vaccin, une machine à projeter des images, une
// lettre ouverte, un capitaine innocenté, deux prix Nobel.
//
// Deux fiches se répondent d'un bout à l'autre de l'affaire Dreyfus : Zola
// écrit « J'accuse… ! » le 13 janvier 1898, Dreyfus crie son innocence dans la
// cour de l'École militaire le 5 janvier 1895. On les lit l'une après l'autre.
//
// Le guide de rédaction est dans `docs/encyclopedie.md` ; le lot modèle est
// `personnages-moyen-age-rois.ts`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_XIXE_ARTS_SCIENCES: Personnage[] = [
  {
    id: 'karl-marx',
    volet: 'personnages',
    nom: 'Karl Marx',
    surnom: 'le théoricien de la lutte des classes',
    dates: '1818 – 1883',
    tri: 1883,
    periode: 'xixe',
    emoji: '📕',
    roles: ['Philosophe', 'Économiste', 'Journaliste'],
    origine: 'Trèves, Rhénanie prussienne',
    accroche:
      'Expulsé de trois pays, exilé à Londres, il passe trente ans à démonter la machine du capitalisme — et donne au monde ouvrier son livre.',
    citations: [
      {
        texte: 'Prolétaires de tous les pays, unissez-vous !',
        contexte:
          'Dernière phrase du *Manifeste du parti communiste*, écrit avec Friedrich Engels et publié à Londres en février 1848.',
        sens:
          'Il appelle les ouvriers à s’unir par-dessus les frontières : pour lui, un ouvrier français et un ouvrier anglais ont plus en commun entre eux qu’avec leurs patrons.',
      },
      {
        texte:
          'L’histoire de toute société jusqu’à nos jours n’est que l’histoire de luttes de classes.',
        contexte: 'Première phrase du *Manifeste du parti communiste*, 1848.',
        sens:
          'Pour Marx, le moteur de l’histoire n’est ni les rois ni les batailles, mais l’affrontement entre ceux qui possèdent les machines et ceux qui n’ont que leurs bras.',
      },
      {
        texte: 'La religion est l’opium du peuple.',
        contexte:
          '*Contribution à la critique de la philosophie du droit de Hegel*, 1844.',
        sens:
          'Il n’y voit pas une tromperie volontaire mais une consolation qui endort la révolte des misérables ; la phrase entière les appelle d’abord « le soupir de la créature opprimée ».',
      },
      {
        texte:
          'Les philosophes n’ont fait qu’interpréter le monde de différentes manières ; ce qui importe, c’est de le transformer.',
        contexte:
          'Onzième des *Thèses sur Feuerbach*, écrites en 1845 et publiées par Engels après sa mort.',
      },
    ],
    reperes: [
      'Né à Trèves en 1818, fils d’un avocat ; docteur en philosophie à vingt-trois ans.',
      'Journaliste, il est expulsé successivement de Prusse, de France puis de Belgique.',
      'Il publie en 1848, avec Friedrich Engels, le « Manifeste du parti communiste ».',
      'Exilé à Londres dès 1849, il écrit au British Museum dans une grande pauvreté.',
      'Fonde en 1864 l’Association internationale des travailleurs, la « Première Internationale ».',
      '« Le Capital » paraît en 1867 ; Engels en publie la suite après sa mort, en 1885 et 1894.',
    ],
    recit: [
      {
        titre: 'Un journaliste chassé de partout',
        texte:
          'Karl Marx naît à **Trèves** en 1818, dans une famille aisée de la Rhénanie prussienne. Docteur en philosophie à vingt-trois ans, il ne trouve aucune chaire : ses idées lui ferment l’université. Il devient journaliste, prend la tête de la *Gazette rhénane*, et la Prusse la fait interdire en 1843. Il part pour **Paris**, où il rencontre **Friedrich Engels**, fils d’un patron de filature de Manchester qui vient d’enquêter sur la condition des ouvriers anglais. La France l’expulse en 1845, la Belgique en 1848, la Prusse de nouveau en 1849. À trente et un ans, Marx s’installe à **Londres** : il n’en repartira plus.',
      },
      {
        titre: '1848, le Manifeste',
        texte:
          'Quelques semaines avant que l’Europe ne s’embrase — Paris en février, Vienne, Berlin, Milan au printemps —, Marx et Engels publient à Londres une brochure de vingt-trois pages : le ***Manifeste du parti communiste***. Elle tient en une idée : l’industrie a créé deux classes face à face, la **bourgeoisie** qui possède les usines et le **prolétariat** qui n’a que sa force de travail à vendre ; leur affrontement décidera de la suite. Le texte est écrit en allemand, tiré à quelques centaines d’exemplaires, et passe d’abord inaperçu. Un demi-siècle plus tard, il sera traduit dans toutes les langues d’Europe.',
      },
      {
        titre: 'Le British Museum et Le Capital',
        texte:
          'À Londres, la famille Marx vit misérablement dans deux pièces de Soho ; trois de ses enfants meurent en bas âge, et c’est **Engels**, devenu associé de la filature familiale, qui paie le loyer, les dettes et les médecins pendant près de quarante ans. Marx passe ses journées à la salle de lecture du **British Museum**, dépouillant rapports d’usine et statistiques anglaises. Il en tire ***Le Capital*** (1867), une analyse de la **plus-value** : la valeur créée par l’ouvrier au-delà de ce que son salaire lui rend, et que le patron garde. En **1864**, il fonde à Londres la **Première Internationale**, qui relie les organisations ouvrières européennes.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Marx meurt à Londres le **14 mars 1883** ; onze personnes suivent son cercueil au cimetière de Highgate. Son influence, elle, commence à peine. Dans toute l’Europe industrielle naissent des **partis socialistes** qui se réclament de lui — en Allemagne, en France, en Italie —, puis des syndicats de masse. En **1917**, les bolcheviks russes prennent le pouvoir en son nom, et le XXᵉ siècle se partagera autour de textes écrits dans une salle de lecture londonienne. Ceux qui le combattent comme ceux qui s’en réclament lui doivent une question qu’on ne posait pas avant lui : à qui profite le travail ?',
      },
    ],
    chrono: [
      { date: '1818', fait: 'Naissance à Trèves, en Rhénanie prussienne.' },
      { date: '1843', fait: 'Sa Gazette rhénane interdite, il s’installe à Paris.' },
      { date: '1844', fait: 'Rencontre décisive avec Friedrich Engels.' },
      { date: 'février 1848', fait: 'Publication du Manifeste du parti communiste.' },
      { date: '1849', fait: 'Exil définitif à Londres.' },
      { date: '1864', fait: 'Fondation de la Première Internationale.' },
      { date: '1867', fait: 'Parution du premier livre du Capital.' },
      { date: '1883', fait: 'Mort à Londres, le 14 mars.' },
      { date: '1917', fait: 'La révolution russe se réclame de sa pensée.' },
    ],
    leSaisTu:
      'Le théoricien de l’exploitation ouvrière a vécu près de quarante ans de l’argent d’une usine : Engels, son ami, dirigeait à Manchester la filature de coton de son père et lui envoyait chaque mois de quoi payer le loyer, le charbon et le médecin. Marx le savait, et l’écrivait.',
    aRetenir: [
      'Karl Marx (1818-1883) est un philosophe allemand exilé à Londres à partir de 1849.',
      'Avec Friedrich Engels, il publie en 1848 le « Manifeste du parti communiste ».',
      'Son œuvre majeure, « Le Capital », paraît en 1867 et analyse le travail salarié.',
      'Il oppose deux classes nées de la révolution industrielle : la bourgeoisie et le prolétariat.',
      'Sa pensée inspire les partis socialistes européens puis la révolution russe de 1917.',
    ],
    mots: [
      {
        mot: 'Prolétariat',
        sens: 'L’ensemble des ouvriers qui ne possèdent ni terre ni machine et vivent de leur salaire.',
      },
      {
        mot: 'Bourgeoisie',
        sens: 'Chez Marx, la classe qui possède les usines, les banques et les moyens de production.',
      },
      {
        mot: 'Plus-value',
        sens: 'La valeur produite par l’ouvrier au-delà de son salaire, et que le patron conserve.',
      },
      {
        mot: 'Socialisme',
        sens: 'Courant politique qui veut mettre la production au service de tous plutôt que d’un propriétaire.',
      },
    ],
    lies: ['revolution-industrielle', 'commune-de-paris', 'jean-jaures', 'louise-michel'],
    niveaux: ['4e', '1re'],
    programme: 'L’Europe de la « révolution industrielle »',
    tags: [
      'Marx',
      'marxisme',
      'communisme',
      'socialisme',
      'Manifeste',
      'Le Capital',
      'Engels',
      'prolétariat',
      'lutte des classes',
      'Londres',
    ],
  },
  {
    id: 'victor-hugo',
    volet: 'personnages',
    nom: 'Victor Hugo',
    surnom: 'l’homme-siècle',
    dates: '1802 – 1885',
    tri: 1885,
    periode: 'xixe',
    emoji: '🪶',
    roles: ['Poète', 'Romancier', 'Dramaturge', 'Député'],
    origine: 'Besançon, Doubs',
    accroche:
      'Poète, romancier, dramaturge et député, exilé vingt ans pour avoir dit non à un empereur : deux millions de personnes suivent son cercueil.',
    citations: [
      {
        texte: 'Ouvrir une école, c’est fermer une prison.',
        contexte:
          'Formule résumant ce qu’il répète à la tribune de l’Assemblée, entre 1848 et 1850, pour l’instruction gratuite.',
        sens:
          'Hugo n’a jamais écrit cette phrase telle quelle : elle condense une idée qui revient dans ses discours — chaque enfant instruit est un futur détenu de moins.',
        incertaine: true,
      },
      {
        texte: 'Je veux être Chateaubriand ou rien.',
        contexte: 'Écrit dans un cahier d’écolier, vers 1816 : il a quatorze ans.',
      },
      {
        texte:
          'Je ne suis pas de ceux qui croient qu’on peut supprimer la souffrance en ce monde ; mais je suis de ceux qui pensent et qui affirment qu’on peut détruire la misère.',
        contexte:
          'Discours à l’Assemblée législative, 9 juillet 1849, sur la misère à Paris.',
        sens:
          'Il distingue le malheur, que personne ne supprimera, de la misère : la faim, le taudis, l’enfant sans école — un désordre que la loi peut corriger.',
      },
      {
        texte: 'Que dit la loi ? Tu ne tueras pas. Comment le dit-elle ? En tuant !',
        contexte:
          'Plaidoirie pour son fils Charles, poursuivi en 1851 pour avoir dénoncé une exécution capitale.',
        sens:
          'Son argument contre la peine de mort en une phrase : l’État interdit le meurtre et se l’autorise, donc il se contredit.',
      },
      {
        texte: 'Et s’il n’en reste qu’un, je serai celui-là !',
        contexte:
          'Dernier vers d’*Ultima verba*, dans *Les Châtiments*, 1853 : il refuse toute amnistie de Napoléon III.',
      },
    ],
    reperes: [
      'Fils d’un général de l’Empire, il publie son premier recueil de poèmes à vingt ans.',
      '25 février 1830 : la « bataille d’Hernani » impose le romantisme au théâtre français.',
      '« Notre-Dame de Paris » (1831) sauve la cathédrale, alors menacée de démolition.',
      'Élu député en 1848, il défend l’instruction gratuite et l’abolition de la peine de mort.',
      'Opposé au coup d’État du 2 décembre 1851, il s’exile vingt ans à Jersey puis à Guernesey.',
      '« Les Misérables » paraît en 1862 ; il rentre à Paris le 5 septembre 1870.',
    ],
    recit: [
      {
        titre: 'L’enfant qui voulait être Chateaubriand',
        texte:
          'Victor Hugo naît à **Besançon** le 26 février 1802, troisième fils d’un général de Napoléon. L’enfance suit les garnisons : Naples, Madrid, Paris. À quatorze ans, il écrit dans un cahier : « Je veux être Chateaubriand ou rien. » À vingt ans, ses *Odes* lui valent une pension du roi Louis XVIII ; à vingt-cinq, la préface de son drame *Cromwell* devient le manifeste d’une génération : assez des règles héritées du XVIIᵉ siècle, le théâtre doit mêler le sublime et le grotesque, comme la vie. Il est déjà le chef de file du **romantisme**, et il n’a rien publié de son œuvre la plus connue.',
      },
      {
        titre: 'La bataille d’Hernani',
        texte:
          'Le **25 février 1830**, la Comédie-Française donne ***Hernani***. Les partisans du théâtre classique viennent siffler ; Hugo a rempli la salle de jeunes artistes, parmi lesquels **Théophile Gautier** en gilet rouge. On se querelle dès le premier vers, coupé en deux par un rejet que les règles interdisaient. Le vacarme dure cent représentations : c’est la **bataille d’Hernani**, moins une soirée de théâtre qu’une prise de pouvoir. Le romantisme a gagné. L’année suivante paraît ***Notre-Dame de Paris*** : le roman rend à la cathédrale, alors délabrée et menacée de démolition, une célébrité qui décidera de sa restauration.',
      },
      {
        titre: 'Le député de la misère',
        texte:
          'Pair de France en 1845, député en **1848**, Hugo commence conservateur et devient l’une des grandes voix de la gauche républicaine. Le **9 juillet 1849**, il monte à la tribune pour un discours sur la misère : il décrit des familles de Lille couchées dans des caves, des enfants sans pain, et affirme que la misère « peut être détruite ». Il réclame l’**instruction gratuite et obligatoire**, une génération avant Jules Ferry. Le 15 septembre 1848, il avait demandé à l’Assemblée constituante « l’abolition pure, simple et définitive de la **peine de mort** » : la France l’abolira en 1981, cent trente-trois ans plus tard.',
      },
      {
        titre: 'Vingt ans d’exil',
        texte:
          'Le **2 décembre 1851**, Louis-Napoléon Bonaparte s’empare du pouvoir par un coup d’État. Hugo tente d’organiser la résistance dans les rues, puis fuit à Bruxelles caché sous un faux nom. Il s’installe à **Jersey** en 1852, puis à **Guernesey** en 1855, dans la maison de Hauteville House. De là il écrit ***Les Châtiments*** (1853), recueil de poèmes qui frappe l’empereur en pleine figure, ***Les Contemplations*** (1856), où il pleure sa fille **Léopoldine**, noyée à Villequier en 1843, et ***Les Misérables*** (1862) : Jean Valjean, Cosette, Gavroche, le bagne, l’égout, la barricade. En 1859, Napoléon III offre l’amnistie aux proscrits. Hugo répond : « Quand la liberté rentrera, je rentrerai. » Il rentre le **5 septembre 1870**, deux jours après la chute de l’Empire.',
      },
      {
        titre: 'Les funérailles d’un peuple',
        texte:
          'Ses dernières années sont une consécration. Le 27 février 1881, pour ses soixante-dix-neuf ans, **six cent mille personnes** défilent une journée entière sous ses fenêtres ; la rue où il habite est débaptisée de son vivant et devient l’**avenue Victor-Hugo**. Il meurt le **22 mai 1885**. Son testament tient en quelques lignes : « Je donne cinquante mille francs aux pauvres. Je désire être porté au cimetière dans leur corbillard. » La République lui accorde des **funérailles nationales** : le cercueil, posé sur un corbillard de pauvre, veille une nuit entière sous l’Arc de Triomphe drapé de noir, puis traverse Paris le **1ᵉʳ juin** vers le **Panthéon**, rendu pour l’occasion à sa vocation d’origine. Environ **deux millions** de personnes suivent ou regardent passer le convoi.',
      },
    ],
    chrono: [
      { date: '1802', fait: 'Naissance à Besançon, le 26 février.' },
      { date: '25 février 1830', fait: 'La bataille d’Hernani à la Comédie-Française.' },
      { date: '1831', fait: 'Parution de Notre-Dame de Paris.' },
      { date: '1841', fait: 'Élu à l’Académie française.' },
      { date: '1843', fait: 'Sa fille Léopoldine se noie à Villequier.' },
      { date: '9 juillet 1849', fait: 'Discours sur la misère à l’Assemblée législative.' },
      { date: '2 décembre 1851', fait: 'Coup d’État : il fuit en Belgique.' },
      { date: '1853', fait: 'Les Châtiments, écrits en exil à Jersey.' },
      { date: '1862', fait: 'Parution des Misérables.' },
      { date: '5 septembre 1870', fait: 'Retour triomphal à Paris.' },
      { date: '22 mai 1885', fait: 'Mort à Paris, avenue Victor-Hugo.' },
      { date: '1ᵉʳ juin 1885', fait: 'Funérailles nationales et entrée au Panthéon.' },
    ],
    leSaisTu:
      'De son vivant, l’avenue d’Eylau où il habitait fut rebaptisée avenue Victor-Hugo, et le numéro finit par devenir inutile : des lettres venues d’Europe entière lui parvenaient adressées simplement « À Monsieur Victor Hugo, en son avenue, à Paris ».',
    aRetenir: [
      'Victor Hugo (1802-1885) est le chef de file du romantisme français depuis Hernani, en 1830.',
      'Il écrit Notre-Dame de Paris (1831) et Les Misérables (1862), romans du peuple et des pauvres.',
      'Député en 1848, il défend l’instruction gratuite et l’abolition de la peine de mort.',
      'Opposé à Napoléon III, il vit en exil à Jersey puis Guernesey de 1851 à 1870.',
      'Ses funérailles nationales, le 1ᵉʳ juin 1885, rassemblent près de deux millions de personnes.',
    ],
    mots: [
      {
        mot: 'Romantisme',
        sens: 'Courant artistique du début du XIXᵉ siècle qui préfère le sentiment et la liberté aux règles classiques.',
      },
      {
        mot: 'Proscrit',
        sens: 'Personne bannie de son pays pour ses opinions politiques.',
      },
      {
        mot: 'Amnistie',
        sens: 'Décision qui efface des condamnations et permet aux exilés de rentrer.',
      },
      {
        mot: 'Panthéon',
        sens: 'Monument parisien où la République dépose les cendres des grands hommes et femmes.',
      },
    ],
    lies: ['napoleon-iii', 'revolution-de-1848', 'emile-zola', 'commune-de-paris'],
    niveaux: ['4e', '1re'],
    programme: 'La Troisième République',
    tags: [
      'Hugo',
      'romantisme',
      'Les Misérables',
      'Notre-Dame de Paris',
      'Hernani',
      'exil',
      'Guernesey',
      'Panthéon',
      'peine de mort',
      'Napoléon III',
      'misère',
    ],
  },
  {
    id: 'gustave-eiffel',
    volet: 'personnages',
    nom: 'Gustave Eiffel',
    surnom: 'le magicien du fer',
    dates: '1832 – 1923',
    tri: 1889,
    periode: 'xixe',
    emoji: '🗼',
    roles: ['Ingénieur', 'Entrepreneur', 'Constructeur'],
    origine: 'Dijon, Bourgogne',
    accroche:
      'Constructeur de ponts et de charpentes métalliques, il dresse en deux ans une tour de 300 mètres que les artistes de Paris voulaient interdire.',
    citations: [
      {
        texte: 'Je crois, pour ma part, que la tour aura sa beauté propre.',
        contexte:
          'Réponse aux artistes qui viennent de protester contre son projet, dans *Le Temps*, 14 février 1887.',
        sens:
          'Il ne défend pas seulement l’utilité de sa tour : il affirme qu’une œuvre d’ingénieur peut être belle, ce que son siècle refusait encore d’admettre.',
      },
      {
        texte:
          'Nous venons protester de toutes nos forces contre l’érection, en plein cœur de notre capitale, de l’inutile et monstrueuse tour Eiffel.',
        qui: 'La « Protestation des artistes »',
        contexte:
          'Lettre publiée dans *Le Temps*, 14 février 1887, signée par Maupassant, Gounod, Garnier, Dumas fils et une quarantaine d’autres.',
      },
      {
        texte:
          'Elle sera pour tous un observatoire et un laboratoire tels que la science n’en a jamais eu à sa disposition.',
        contexte:
          'Plaidoyer pour l’utilité scientifique de la tour, 1889 — l’argument qui la sauvera de la démolition.',
      },
    ],
    reperes: [
      'Ingénieur formé à l’École centrale, il se spécialise dans les charpentes en fer.',
      'Le pont Maria-Pia de Porto (1877) et le viaduc de Garabit (1884) le rendent célèbre.',
      'Il conçoit la charpente intérieure de la statue de la Liberté, inaugurée en 1886.',
      'La tour est bâtie en deux ans, deux mois et cinq jours pour l’Exposition de 1889.',
      '18 038 pièces de fer, 2 500 000 rivets, 7 300 tonnes : un seul mort sur le chantier.',
      'La station de télégraphie sans fil installée au sommet la sauve de la démolition.',
    ],
    recit: [
      {
        titre: 'Un ingénieur qui jette des ponts',
        texte:
          'Né à **Dijon** en 1832, Gustave Eiffel sort de l’**École centrale** et se fait une spécialité de ce que le siècle a de neuf : le **fer**. Sa méthode est celle d’un industriel autant que d’un ingénieur — calculer chaque pièce, la percer d’avance à l’atelier au dixième de millimètre, et n’assembler sur le chantier que des éléments qui s’emboîtent. Le **pont Maria-Pia**, jeté en 1877 au-dessus du Douro à Porto en un arc de 160 mètres sans échafaudage dans le fleuve, fait sa réputation en Europe. Le **viaduc de Garabit** (1884) porte une voie ferrée à 122 mètres au-dessus de la Truyère. Ses ateliers de Levallois-Perret livrent aussi des gares, des écluses, des halles et la charpente du Bon Marché.',
      },
      {
        titre: 'La charpente de la Liberté',
        texte:
          'Quand le sculpteur **Bartholdi** entreprend la statue offerte par la France aux États-Unis, il faut résoudre un problème que la sculpture ne connaît pas : une figure de 46 mètres en feuilles de cuivre battu, plantée dans le vent et le sel de l’Atlantique, se déchirerait. L’architecte Viollet-le-Duc meurt avant d’avoir trouvé. Eiffel reprend l’étude et invente la solution : un **pylône de fer** central, autour duquel la peau de cuivre est simplement **suspendue** par des ferrures souples. La statue peut ainsi se dilater, ployer et revenir sans casser. La **statue de la Liberté** est inaugurée à New York le 28 octobre **1886** ; presque personne ne sait que son squelette est français.',
      },
      {
        titre: 'La protestation des artistes',
        texte:
          'Pour l’Exposition universelle prévue en 1889, la France veut un monument de trois cents mètres — jamais atteints par une construction humaine. Le projet d’Eiffel est retenu, et le chantier ouvre le 28 janvier 1887. Trois semaines plus tard, le **14 février 1887**, *Le Temps* publie une lettre furieuse signée par une quarantaine d’artistes : **Maupassant, Gounod, Charles Garnier, Alexandre Dumas fils, Leconte de Lisle, Sully Prudhomme**. Ils dénoncent « l’inutile et monstrueuse tour Eiffel », « ce noir et gigantesque tuyau d’usine » qui va écraser Notre-Dame et le Louvre. Eiffel répond le jour même, dans le même journal, sans hausser le ton : la tour aura sa beauté propre, et ce qu’on admire en Égypte ne devient pas ridicule à Paris.',
      },
      {
        titre: 'Deux ans, deux mois, cinq jours',
        texte:
          'Le chantier tient du record. Les quatre piles, orientées par des vérins hydrauliques au millimètre, se rejoignent exactement au premier étage. Les pièces arrivent percées de Levallois ; sur place, des équipes de quatre hommes posent **2 500 000 rivets** à la forge portative. Trois cents ouvriers travaillent à cent, puis deux cents, puis trois cents mètres au-dessus du sol : il n’y aura **qu’un seul mort**, et hors du temps de travail. Le **31 mars 1889**, Eiffel monte à pied les 1 710 marches et plante le drapeau tricolore au sommet. Deux ans, deux mois et cinq jours après le premier coup de pioche. Pendant l’Exposition, près de **deux millions** de visiteurs paient pour monter.',
      },
      {
        titre: 'Panama, puis le vent',
        texte:
          'La gloire tourne court. Eiffel avait accepté de construire les écluses du **canal de Panama** ; la faillite retentissante de la compagnie éclabousse tous ceux qui l’avaient approchée, et il est condamné en 1893 avant d’être déchargé par la Cour de cassation. Il quitte alors les affaires et donne trente ans à la **science**. La tour devient son laboratoire : météorologie, chute des corps, puis **télégraphie sans fil** — les premières liaisons radio de l’armée, à partir de 1903, rendent la tour indispensable et lui évitent la démolition prévue à l’expiration de sa concession, en 1909. Eiffel construit ensuite une **soufflerie** à Auteuil et devient l’un des fondateurs de l’aérodynamique. Il meurt à Paris en **1923**, à quatre-vingt-onze ans.',
      },
    ],
    chrono: [
      { date: '1832', fait: 'Naissance à Dijon.' },
      { date: '1877', fait: 'Pont Maria-Pia sur le Douro, à Porto.' },
      { date: '1884', fait: 'Viaduc de Garabit, au-dessus de la Truyère.' },
      { date: '1886', fait: 'Inauguration de la statue de la Liberté à New York.' },
      { date: '28 janvier 1887', fait: 'Premier coup de pioche de la tour.' },
      { date: '14 février 1887', fait: 'Protestation des artistes dans Le Temps.' },
      { date: '31 mars 1889', fait: 'La tour est achevée : 300 mètres.' },
      { date: '1889', fait: 'Exposition universelle : deux millions de visiteurs.' },
      { date: '1893', fait: 'Le scandale de Panama l’écarte des affaires.' },
      { date: '1909', fait: 'La télégraphie sans fil sauve la tour de la démolition.' },
      { date: '1923', fait: 'Mort à Paris.' },
    ],
    leSaisTu:
      'Eiffel s’était réservé un petit appartement au sommet de la tour, avec un piano, et n’a jamais accepté de le louer, malgré les offres. Il y a reçu Thomas Edison, venu en 1889 lui offrir un phonographe : l’appartement est toujours là, meublé.',
    aRetenir: [
      'Gustave Eiffel (1832-1923) est un ingénieur français spécialiste des constructions en fer.',
      'Il conçoit la charpente intérieure de la statue de la Liberté, inaugurée en 1886.',
      'Sa tour de 300 mètres est bâtie de 1887 à 1889 pour l’Exposition universelle de Paris.',
      'Une partie des artistes parisiens protestent contre le projet en février 1887.',
      'La tour, promise à la démolition, est sauvée par son antenne de télégraphie sans fil.',
    ],
    mots: [
      {
        mot: 'Charpente métallique',
        sens: 'Ossature de fer ou d’acier qui porte un bâtiment à la place des murs de pierre.',
      },
      {
        mot: 'Rivet',
        sens: 'Tige de métal chauffée puis écrasée pour assembler deux pièces de fer définitivement.',
      },
      {
        mot: 'Exposition universelle',
        sens: 'Grande vitrine internationale où les pays exposent leurs industries et leurs inventions.',
      },
      {
        mot: 'Télégraphie sans fil',
        sens: 'Transmission de messages par ondes radio, sans câble : l’ancêtre de la radio.',
      },
    ],
    lies: [
      'exposition-universelle-1889',
      'revolution-industrielle',
      'freres-lumiere',
      'louis-pasteur',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe de la « révolution industrielle »',
    tags: [
      'Eiffel',
      'tour Eiffel',
      'fer',
      'Garabit',
      'statue de la Liberté',
      'Exposition universelle',
      'ingénieur',
      '1889',
      'Porto',
      'rivets',
    ],
  },
  {
    id: 'louis-pasteur',
    volet: 'personnages',
    nom: 'Louis Pasteur',
    surnom: 'le savant qui a vaincu la rage',
    dates: '1822 – 1895',
    tri: 1895,
    periode: 'xixe',
    emoji: '🔬',
    roles: ['Chimiste', 'Biologiste', 'Professeur'],
    origine: 'Dole, Jura',
    accroche:
      'Chimiste devenu le père de la microbiologie : il prouve que les maladies viennent de microbes, et sauve un enfant mordu par un chien enragé.',
    citations: [
      {
        texte:
          'Dans les champs de l’observation, le hasard ne favorise que les esprits préparés.',
        contexte:
          'Leçon inaugurale à la faculté des sciences de Lille, le 7 décembre 1854, devant ses étudiants.',
        sens:
          'Une découverte n’arrive pas par chance : elle tombe sur celui qui a assez travaillé pour reconnaître ce qu’il a sous les yeux.',
      },
      {
        texte:
          'Il n’y a aujourd’hui aucune circonstance connue où l’on puisse affirmer que des êtres microscopiques sont venus au monde sans germes, sans parents semblables à eux.',
        contexte: 'Conférence à la Sorbonne, le 7 avril 1864, contre la génération spontanée.',
        sens:
          'Autrement dit : la vie ne naît jamais toute seule de la matière morte. Un microbe vient toujours d’un autre microbe — donc de quelque part, donc on peut l’arrêter.',
      },
      {
        texte:
          'Si j’avais l’honneur d’être chirurgien, je ne me servirais que d’instruments d’une propreté parfaite.',
        contexte:
          'Devant l’Académie de médecine, le 30 avril 1878, à des chirurgiens qui opéraient encore en habit de ville.',
        sens:
          'La phrase qui fonde l’asepsie : les germes invisibles posés sur un scalpel tuent plus sûrement que l’opération elle-même.',
      },
      {
        texte:
          'Heureux celui qui porte en soi un dieu, un idéal de beauté, et qui lui obéit.',
        contexte:
          'Discours lu à la Sorbonne pour son jubilé, le 27 décembre 1892, devant les savants d’Europe.',
      },
    ],
    reperes: [
      'Fils d’un tanneur de Dole, il entre à l’École normale supérieure et devient chimiste.',
      'Il montre que la fermentation est l’œuvre d’êtres vivants microscopiques : les microbes.',
      'La pasteurisation (1865) : chauffer un liquide pour tuer les germes sans le cuire.',
      'Ses ballons à col de cygne réfutent la génération spontanée devant la Sorbonne, en 1864.',
      '2 juin 1881, Pouilly-le-Fort : les 25 moutons vaccinés vivent, les 25 autres sont morts.',
      '6 juillet 1885 : première vaccination contre la rage sur Joseph Meister, neuf ans.',
    ],
    recit: [
      {
        titre: 'Du vin qui tourne aux microbes',
        texte:
          'Louis Pasteur naît à **Dole** en 1822, fils d’un tanneur ancien soldat de l’Empire. Élève moyen devenu chimiste, il est nommé à **Lille** en 1854, au cœur d’une région de brasseries et de distilleries. Les industriels le consultent : pourquoi certaines cuves tournent-elles au vinaigre ? La réponse de Pasteur renverse la chimie de son temps : la **fermentation** n’est pas une réaction chimique, c’est le travail d’**êtres vivants microscopiques**. Si un être vivant fait tourner le vin, un autre peut gâter la bière, le lait, la viande — et peut-être rendre malade. En **1865**, il met au point un procédé simple : chauffer le liquide autour de 60 °C, assez pour tuer les germes, pas assez pour le cuire. C’est la **pasteurisation**.',
      },
      {
        titre: 'La génération spontanée, réfutée en public',
        texte:
          'On croyait alors que la vie pouvait naître toute seule de la matière : des asticots du fumier, des microbes du bouillon. Pasteur conçoit une expérience qu’un enfant peut comprendre. Il fait fondre le col de ses ballons de verre en un long **col de cygne** recourbé : l’air entre librement, mais les poussières se déposent dans la courbe. Le bouillon stérilisé reste limpide des mois. Qu’on brise le col, et il se trouble en deux jours. Le **7 avril 1864**, dans l’amphithéâtre de la **Sorbonne**, il présente l’expérience devant tout Paris et conclut : la doctrine de la génération spontanée « ne se relèvera jamais du coup mortel de cette simple expérience ». Certains de ses ballons sont encore limpides aujourd’hui.',
      },
      {
        titre: 'Pouilly-le-Fort, devant témoins',
        texte:
          'Après les maladies du ver à soie, qui sauvent la soierie française, Pasteur s’attaque aux épidémies du bétail. En étudiant le **choléra des poules**, il découvre qu’un microbe affaibli ne tue plus mais **protège** : le principe du vaccin, entrevu par Jenner un siècle plus tôt, devient une méthode. Il défie alors les incrédules. En mai **1881**, à **Pouilly-le-Fort**, cinquante moutons sont réunis devant vétérinaires, journalistes et paysans : vingt-cinq reçoivent son vaccin contre le **charbon**, vingt-cinq rien du tout. Tous reçoivent ensuite une dose mortelle de la maladie. Le **2 juin**, la foule accourue trouve les vingt-cinq vaccinés debout et brouter, les vingt-cinq autres morts ou mourants. La démonstration fait le tour du monde en quelques jours.',
      },
      {
        titre: 'Joseph Meister, 6 juillet 1885',
        texte:
          'Reste la **rage**, maladie terrifiante et toujours mortelle. Pasteur a mis au point un vaccin sur le chien, mais il n’est ni médecin ni autorisé à traiter un être humain. Le **6 juillet 1885**, une Alsacienne arrive à son laboratoire avec son fils **Joseph Meister**, neuf ans, mordu quatorze fois deux jours plus tôt par un chien enragé. L’enfant est condamné à coup sûr ; ne rien faire, c’est le laisser mourir. Pasteur consulte deux médecins, puis se décide : treize injections en dix jours, de doses de plus en plus actives. Les nuits d’attente sont atroces. **Joseph Meister survit**. Quelques mois plus tard, le berger Jupille, mordu en défendant des enfants, est sauvé à son tour. Le monde entier envoie ses mordus à Paris.',
      },
      {
        titre: 'L’Institut Pasteur',
        texte:
          'Une souscription internationale, ouverte en 1886, recueille de quoi bâtir un établissement pour vacciner et pour chercher : l’**Institut Pasteur** est inauguré le **14 novembre 1888**, rue Dutot à Paris. Pasteur, diminué par une attaque, y habite et y sera enterré. Il meurt le **28 septembre 1895** à Villeneuve-l’Étang. Autour de lui s’est formée une école — Roux, Yersin, Calmette — qui fera reculer la diphtérie, la peste et la tuberculose, et essaimera en instituts sur tous les continents. Joseph Meister, l’enfant sauvé, deviendra gardien de la maison et veillera sur le tombeau de Pasteur pendant plus de quarante ans.',
      },
    ],
    chrono: [
      { date: '1822', fait: 'Naissance à Dole, dans le Jura.' },
      { date: '1854', fait: 'Leçon inaugurale à Lille : « le hasard et les esprits préparés ».' },
      { date: '1862', fait: 'Les ballons à col de cygne restent limpides.' },
      { date: '7 avril 1864', fait: 'Il réfute la génération spontanée à la Sorbonne.' },
      { date: '1865', fait: 'Procédé de pasteurisation du vin.' },
      { date: '1879', fait: 'Le choléra des poules révèle le principe du vaccin.' },
      { date: '2 juin 1881', fait: 'Vaccination du charbon démontrée à Pouilly-le-Fort.' },
      { date: '6 juillet 1885', fait: 'Première vaccination antirabique : Joseph Meister.' },
      { date: '14 novembre 1888', fait: 'Inauguration de l’Institut Pasteur.' },
      { date: '28 septembre 1895', fait: 'Mort à Villeneuve-l’Étang.' },
    ],
    leSaisTu:
      'Le vaccin est né d’un oubli de vacances. Un été, l’assistant de Pasteur laissa des cultures de choléra des poules traîner sur la paillasse. À la rentrée, les poules inoculées avec ce vieux bouillon ne moururent pas — et résistèrent ensuite à la maladie. Le hasard, mais sur un esprit préparé.',
    aRetenir: [
      'Louis Pasteur (1822-1895) démontre que la fermentation et les maladies sont dues à des microbes.',
      'Il réfute la génération spontanée grâce à ses ballons à col de cygne (Sorbonne, 1864).',
      'La pasteurisation, mise au point en 1865, conserve les liquides en tuant leurs germes.',
      'Le 2 juin 1881, à Pouilly-le-Fort, il prouve publiquement l’efficacité du vaccin du charbon.',
      'Le 6 juillet 1885, il sauve Joseph Meister de la rage ; l’Institut Pasteur ouvre en 1888.',
    ],
    mots: [
      {
        mot: 'Microbe',
        sens: 'Être vivant invisible à l’œil nu : bactérie, levure, champignon microscopique.',
      },
      {
        mot: 'Pasteurisation',
        sens: 'Chauffage modéré d’un liquide pour détruire ses germes sans en altérer le goût.',
      },
      {
        mot: 'Vaccin',
        sens: 'Préparation à base de microbes affaiblis qui apprend au corps à se défendre avant l’infection.',
      },
      {
        mot: 'Génération spontanée',
        sens: 'Vieille croyance selon laquelle la vie pouvait naître d’elle-même de la matière inerte.',
      },
    ],
    lies: ['marie-curie', 'gustave-eiffel', 'revolution-industrielle', 'jules-ferry'],
    niveaux: ['4e'],
    programme: 'L’Europe de la « révolution industrielle »',
    tags: [
      'Pasteur',
      'microbe',
      'vaccin',
      'rage',
      'pasteurisation',
      'Joseph Meister',
      'Pouilly-le-Fort',
      'Institut Pasteur',
      'génération spontanée',
      'Lille',
    ],
  },
  {
    id: 'freres-lumiere',
    volet: 'personnages',
    nom: 'Les frères Lumière',
    surnom: 'les inventeurs du cinématographe',
    dates: 'Auguste 1862 – 1954 · Louis 1864 – 1948',
    tri: 1895,
    periode: 'xixe',
    emoji: '🎬',
    roles: ['Inventeurs', 'Industriels'],
    origine: 'Besançon, puis Lyon',
    accroche:
      'Deux industriels lyonnais de la photographie qui, le 28 décembre 1895, projettent des images animées à un public payant : le cinéma est né.',
    citations: [
      {
        texte: 'Le cinéma est une invention sans avenir.',
        qui: 'Louis Lumière',
        contexte:
          'Phrase que la tradition lui prête, dite à Georges Méliès qui voulait lui acheter un appareil, fin 1895.',
        sens:
          'Elle circule en vingt versions et n’est attestée par aucun document : les Lumière voyaient surtout leur machine comme un instrument scientifique, pas comme un spectacle durable.',
        incertaine: true,
      },
      {
        texte:
          'Jeune homme, remerciez-moi : mon invention n’est pas à vendre, elle vous ruinerait.',
        qui: 'Antoine Lumière, leur père',
        contexte:
          'Le 28 décembre 1895, au Grand Café, refusant de vendre un appareil à Georges Méliès, qui l’a raconté lui-même.',
        sens:
          'Méliès n’insista pas et fabriqua sa propre machine : il devint le premier grand metteur en scène du cinéma.',
      },
      {
        texte:
          'Le mécanisme du pied-de-biche de la machine à coudre m’en a fourni l’idée, et l’appareil était trouvé.',
        qui: 'Louis Lumière',
        contexte:
          'Racontant la nuit d’insomnie de l’hiver 1894-1895 où il résolut l’entraînement saccadé de la pellicule.',
      },
    ],
    reperes: [
      'Fils d’Antoine Lumière, photographe ; l’usine familiale de Lyon fabrique des plaques photo.',
      'Le Cinématographe, breveté le 13 février 1895, est à la fois caméra, tireuse et projecteur.',
      'Il pèse cinq kilos et se tourne à la manivelle : on peut le porter partout dans le monde.',
      '28 décembre 1895, salon indien du Grand Café, à Paris : trente-trois spectateurs, un franc la place.',
      'Leurs opérateurs filment sur tous les continents et rapportent près de 1 400 « vues ».',
      'Ils quittent le cinéma vers 1905 pour l’autochrome, la première photographie en couleurs.',
    ],
    recit: [
      {
        titre: 'L’usine de Lyon-Monplaisir',
        texte:
          'Auguste naît en 1862 et Louis en 1864 à **Besançon** ; la famille s’installe à **Lyon** après 1870. Leur père **Antoine** est photographe, et à dix-sept ans Louis met au point une plaque photographique sèche, l’« étiquette bleue », qui fait la fortune de la maison : l’usine de **Lyon-Monplaisir** en produit bientôt des millions par an et emploie trois cents ouvriers. En 1894, Antoine rapporte de Paris une bande de **Kinétoscope**, l’appareil d’**Edison** : une boîte de cinq cents kilos dans laquelle on regarde défiler des images, un œil collé à un judas, seul. Il pose le problème à ses fils en une phrase : il faut sortir l’image de la boîte et la projeter sur un mur.',
      },
      {
        titre: 'Une nuit et un pied-de-biche',
        texte:
          'La difficulté est mécanique : pour donner l’illusion du mouvement, la pellicule doit s’arrêter seize fois par seconde devant l’objectif, puis avancer d’un cran — un défilement continu ne donnerait qu’une bouillie. Louis, retenu au lit par une migraine pendant l’hiver 1894-1895, trouve la solution dans un objet domestique : le **pied-de-biche de la machine à coudre**, qui pique, relâche et fait avancer le tissu. Deux griffes viennent saisir la pellicule par ses perforations, la tirer, la lâcher. Le **Cinématographe** est breveté le **13 février 1895**. Il pèse cinq kilos, se tourne à la manivelle, et fait à lui seul trois métiers : il filme, il tire les copies, il projette.',
      },
      {
        titre: 'La sortie de l’usine',
        texte:
          'Le premier film est tourné le **19 mars 1895** devant les portes de l’usine familiale : des ouvrières en chapeau, deux chevaux, un chien, cinquante secondes. C’est ***La Sortie de l’usine Lumière à Lyon***. Trois jours plus tard, les frères le projettent à Paris devant la Société d’encouragement pour l’industrie nationale, puis devant des savants et des photographes. Personne ne s’enthousiasme beaucoup : on y voit une curiosité technique, le prolongement naturel de la photographie. Pendant ce temps, ils tournent une cinquantaine de vues de cinquante secondes chacune — un repas de bébé, une partie de cartes, des forgerons, et un jardinier arrosé par un gamin qui pince son tuyau : ***L’Arroseur arrosé***, la première comédie de l’histoire du cinéma.',
      },
      {
        titre: '28 décembre 1895, salon indien',
        texte:
          'Ce jour-là, dans le sous-sol du **Grand Café**, boulevard des Capucines à Paris, un écran est tendu dans une petite salle appelée le **salon indien**. L’entrée coûte **un franc**. **Trente-trois spectateurs** se présentent, et la recette de la journée est de trente-cinq francs. Dix films défilent en vingt minutes. Pour la première fois, des inconnus ont payé pour voir ensemble, dans le noir, des images qui bougent sur un mur : c’est la naissance du **cinéma** comme spectacle. Le bouche-à-oreille fait le reste. Quinze jours plus tard, la queue s’allonge sur le boulevard et la salle reçoit plus de deux mille spectateurs par jour, en séances qui s’enchaînent de midi à minuit.',
      },
      {
        titre: 'Le monde dans une boîte de cinq kilos',
        texte:
          'Les frères Lumière ne vendent pas leur appareil : ils forment des **opérateurs** et les envoient dans le monde entier, à la fois pour projeter et pour filmer. Promio, Veyre, Doublier, Mesguich tournent à Londres, Moscou, New York, Le Caire, Tokyo. À Venise, en 1896, Promio pose sa caméra dans une gondole et invente sans le savoir le **travelling**. Le catalogue atteindra près de **1 400 vues** : la première archive filmée de la planète. Vers 1905, les Lumière se retirent du cinéma, qu’ils jugent épuisé, et reviennent à la photographie : leur plaque **autochrome**, brevetée en **1903**, donne au public les premières images en couleurs. Louis meurt en 1948, Auguste en 1954.',
      },
    ],
    chrono: [
      { date: '1862', fait: 'Naissance d’Auguste à Besançon ; Louis suit en 1864.' },
      { date: '1881', fait: 'Louis met au point la plaque photo « étiquette bleue ».' },
      { date: '1894', fait: 'Antoine Lumière rapporte de Paris une bande de Kinétoscope.' },
      { date: '13 février 1895', fait: 'Brevet du Cinématographe.' },
      { date: '19 mars 1895', fait: 'Tournage de La Sortie de l’usine Lumière à Lyon.' },
      { date: '28 décembre 1895', fait: 'Première séance payante, au Grand Café à Paris.' },
      { date: '1896', fait: 'Les opérateurs Lumière filment sur tous les continents.' },
      { date: '1903', fait: 'Brevet de l’autochrome, la photographie en couleurs.' },
      { date: '1948', fait: 'Mort de Louis Lumière, à Bandol.' },
      { date: '1954', fait: 'Mort d’Auguste Lumière, à Lyon.' },
    ],
    leSaisTu:
      'On raconte que le public de 1895 se serait jeté sous les sièges devant L’Arrivée d’un train en gare de La Ciotat. Aucun témoin de l’époque ne le rapporte, l’histoire n’apparaît que bien plus tard — et ce film n’était même pas au programme du 28 décembre.',
    aRetenir: [
      'Auguste et Louis Lumière sont des industriels lyonnais de la photographie.',
      'Ils brevètent le Cinématographe le 13 février 1895 : caméra, tireuse et projecteur à la fois.',
      'Le 28 décembre 1895, au Grand Café à Paris, a lieu la première séance publique payante.',
      'Leurs premiers films durent environ cinquante secondes : La Sortie de l’usine, L’Arroseur arrosé.',
      'Leurs opérateurs filment le monde entier et constituent près de 1 400 « vues » entre 1895 et 1905.',
    ],
    mots: [
      {
        mot: 'Cinématographe',
        sens: 'Appareil des frères Lumière qui filme, tire les copies et projette les images animées.',
      },
      {
        mot: 'Vue',
        sens: 'Nom donné par les Lumière à chacun de leurs petits films d’une cinquantaine de secondes.',
      },
      {
        mot: 'Autochrome',
        sens: 'Plaque des frères Lumière (1903) qui donne les premières photographies en couleurs.',
      },
    ],
    lies: [
      'gustave-eiffel',
      'exposition-universelle-1889',
      'revolution-industrielle',
      'louis-pasteur',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe de la « révolution industrielle »',
    tags: [
      'Lumière',
      'cinéma',
      'cinématographe',
      'Grand Café',
      'Lyon',
      '1895',
      'L’Arroseur arrosé',
      'Edison',
      'Méliès',
      'autochrome',
    ],
  },
  {
    id: 'emile-zola',
    volet: 'personnages',
    nom: 'Émile Zola',
    surnom: 'l’écrivain qui accusa',
    dates: '1840 – 1902',
    tri: 1902,
    periode: 'xixe',
    emoji: '📰',
    roles: ['Romancier', 'Journaliste', 'Chef de file du naturalisme'],
    origine: 'Paris, élevé à Aix-en-Provence',
    accroche:
      'Romancier des mineurs et des ouvriers, il risque sa liberté en 1898 pour une lettre ouverte destinée à sauver un capitaine innocent.',
    citations: [
      {
        texte: 'J’accuse… !',
        contexte:
          'Titre trouvé par Clemenceau pour sa lettre ouverte au président de la République, en une de *L’Aurore*, 13 janvier 1898.',
        sens:
          'Zola y nomme un par un les officiers et les ministres qui ont couvert la condamnation de Dreyfus, pour les forcer à le poursuivre : le procès rouvrira l’affaire au grand jour.',
      },
      {
        texte: 'La vérité est en marche, et rien ne l’arrêtera.',
        contexte:
          'Article du *Figaro*, 25 novembre 1897, six semaines avant « J’accuse… ! ».',
      },
      {
        texte:
          'Je n’ai qu’une passion, celle de la lumière, au nom de l’humanité qui a tant souffert et qui a droit au bonheur.',
        contexte: 'Dernières lignes de « J’accuse… ! », *L’Aurore*, 13 janvier 1898.',
      },
      {
        texte:
          'Une œuvre d’art est un coin de la création vu à travers un tempérament.',
        contexte: 'Sa définition de l’art, dans *Mes haines*, 1866.',
        sens:
          'Le romancier doit observer le réel comme un savant, mais ce qu’il en rapporte porte forcément sa marque : l’exactitude n’exclut pas le regard.',
      },
    ],
    reperes: [
      'Né à Paris en 1840, élevé à Aix-en-Provence, ami d’enfance du peintre Paul Cézanne.',
      'Il fonde le naturalisme : écrire un roman comme on mène une enquête, carnets en main.',
      'Les Rougon-Macquart : vingt romans en vingt-deux ans sur une famille du Second Empire.',
      '« Germinal » (1885) naît de plusieurs semaines passées dans les mines d’Anzin.',
      '13 janvier 1898 : « J’accuse… ! » en une de L’Aurore, tirée à 300 000 exemplaires.',
      'Condamné à un an de prison, il s’exile onze mois en Angleterre ; il meurt asphyxié en 1902.',
    ],
    recit: [
      {
        titre: 'L’enfant d’Aix',
        texte:
          'Émile Zola naît à Paris en 1840. Son père, ingénieur italien, meurt en 1847 en laissant la famille sans rien : l’enfance se passe à **Aix-en-Provence**, dans la gêne, avec pour ami de collège un garçon qui deviendra le peintre **Paul Cézanne**. Zola échoue deux fois au baccalauréat, monte à Paris, connaît des hivers sans feu, puis entre chez l’éditeur **Hachette**, où il dirige la publicité et apprend le métier des journaux. Il écrit des articles, défend Manet et les peintres qu’on siffle, et publie en 1867 ***Thérèse Raquin***, un roman si noir que la critique parle de « littérature putride ».',
      },
      {
        titre: 'Le romancier qui enquête',
        texte:
          'Zola veut appliquer au roman la méthode des sciences : observer, documenter, décrire ce qui est. C’est le **naturalisme**. De 1871 à 1893 il écrit les ***Rougon-Macquart***, « histoire naturelle et sociale d’une famille sous le Second Empire » : vingt romans, un milieu par livre. ***L’Assommoir*** (1877) raconte l’alcool dans les faubourgs et lui apporte la fortune ; ***Au Bonheur des Dames*** le grand magasin ; ***La Bête humaine*** le chemin de fer ; ***Germinal*** (1885) la mine. Pour celui-ci, il descend au fond de la fosse d’**Anzin** pendant une grève, note les salaires, les gestes, les odeurs, le nom des outils. Le livre devient, pour des générations d’ouvriers, le récit de leur propre vie.',
      },
      {
        titre: '13 janvier 1898 : J’accuse… !',
        texte:
          'Le 11 janvier 1898, le commandant **Esterhazy**, que tout accuse d’être le vrai traître, est acquitté en une audience par un conseil de guerre. Deux jours plus tard, le journal ***L’Aurore*** paraît avec, sur toute la une, une lettre ouverte au président de la République et un titre en lettres énormes trouvé par **Clemenceau** : « **J’accuse… !** ». Zola y met en cause nommément des généraux, des ministres, des experts en écritures, et les accuse d’avoir condamné un innocent puis couvert le coupable. Il sait exactement ce qu’il fait : en les diffamant publiquement, il les oblige à lui faire un procès, donc à rouvrir devant les juges un dossier que l’armée avait verrouillé. Le journal, qui tirait à trente mille, en vend **trois cent mille** dans la journée.',
      },
      {
        titre: 'Le procès et l’exil',
        texte:
          'Le procès s’ouvre en février 1898. Dehors, la foule hurle « Mort aux juifs ! » et « À bas Zola ! » ; il doit être protégé pour entrer au palais de justice. Il est condamné à **un an de prison** et 3 000 francs d’amende. La France est coupée en deux : **dreyfusards** et **antidreyfusards** traversent les familles, les cafés, les rédactions et jusqu’aux tableaux de Degas ou aux amitiés de Cézanne. Plutôt que d’aller en prison — ce qui l’aurait réduit au silence —, Zola part pour l’**Angleterre** le 18 juillet 1898 et y vit onze mois sous un faux nom, seul, dans des hôtels de banlieue. Il rentre en juin 1899, quand la Cour de cassation annule le jugement de 1894 et renvoie Dreyfus devant un nouveau conseil de guerre.',
      },
      {
        titre: 'Une mort suspecte, et le Panthéon',
        texte:
          'Dans la nuit du 28 au 29 septembre **1902**, Zola meurt asphyxié dans sa chambre parisienne par le monoxyde de carbone d’une cheminée bouchée ; sa femme Alexandrine, dans le même lit, survit de justesse. L’accident est officiellement conclu, mais un témoignage publié en **1953** rapporte les aveux d’un couvreur qui aurait obstrué le conduit par haine du dreyfusard — sans qu’aucune preuve ne l’établisse. À ses obsèques, **Anatole France** prononce sur sa tombe une phrase restée célèbre : « Il fut un moment de la conscience humaine. » Le **4 juin 1908**, ses cendres entrent au **Panthéon**. Pendant la cérémonie, un journaliste nationaliste tire deux coups de revolver sur Alfred Dreyfus, présent dans l’assistance, et le blesse au bras.',
      },
    ],
    chrono: [
      { date: '1840', fait: 'Naissance à Paris ; enfance à Aix-en-Provence.' },
      { date: '1867', fait: 'Thérèse Raquin, premier scandale littéraire.' },
      { date: '1871', fait: 'Début des Rougon-Macquart, vingt romans en vingt-deux ans.' },
      { date: '1877', fait: 'L’Assommoir : le succès et la fortune.' },
      { date: '1885', fait: 'Germinal, écrit après une enquête dans les mines d’Anzin.' },
      { date: '13 janvier 1898', fait: '« J’accuse… ! » paraît en une de L’Aurore.' },
      { date: '23 février 1898', fait: 'Condamné à un an de prison pour diffamation.' },
      { date: '18 juillet 1898', fait: 'Il s’exile en Angleterre pour onze mois.' },
      { date: '29 septembre 1902', fait: 'Mort par asphyxie, dans sa chambre parisienne.' },
      { date: '4 juin 1908', fait: 'Ses cendres sont transférées au Panthéon.' },
    ],
    leSaisTu:
      'Pour écrire Germinal, Zola s’est fait descendre au fond d’une fosse d’Anzin pendant la grève de 1884. Ses carnets d’enquête, conservés, notent le prix du pain, la hauteur des galeries, le nom des chevaux de la mine et le salaire exact d’un hercheur.',
    aRetenir: [
      'Émile Zola (1840-1902) est le chef de file du naturalisme, le roman conçu comme une enquête.',
      'Il écrit les vingt romans des Rougon-Macquart, dont L’Assommoir (1877) et Germinal (1885).',
      'Le 13 janvier 1898, « J’accuse… ! » paraît dans L’Aurore et relance l’affaire Dreyfus.',
      'Condamné pour diffamation, il s’exile en Angleterre de juillet 1898 à juin 1899.',
      'Ses cendres entrent au Panthéon le 4 juin 1908, six ans après sa mort.',
    ],
    mots: [
      {
        mot: 'Naturalisme',
        sens: 'Courant littéraire qui décrit la société avec la méthode et la documentation d’un savant.',
      },
      {
        mot: 'Lettre ouverte',
        sens: 'Texte adressé à une personne mais publié dans un journal, pour prendre l’opinion à témoin.',
      },
      {
        mot: 'Dreyfusard',
        sens: 'Partisan de la révision du procès de Dreyfus, face aux antidreyfusards qui la refusent.',
      },
      {
        mot: 'Diffamation',
        sens: 'Accusation publique portant atteinte à l’honneur d’une personne ; c’est le délit reproché à Zola.',
      },
    ],
    lies: ['alfred-dreyfus', 'affaire-dreyfus', 'victor-hugo', 'jean-jaures'],
    niveaux: ['4e', '1re'],
    programme: 'La Troisième République',
    tags: [
      'Zola',
      'J’accuse',
      'L’Aurore',
      'naturalisme',
      'Germinal',
      'Rougon-Macquart',
      'affaire Dreyfus',
      'Panthéon',
      'Clemenceau',
      'Anzin',
    ],
  },
  {
    id: 'alfred-dreyfus',
    volet: 'personnages',
    nom: 'Alfred Dreyfus',
    surnom: 'le capitaine innocent',
    dates: '1859 – 1935',
    tri: 1906,
    periode: 'xixe',
    emoji: '🎖️',
    roles: ['Officier français', 'Capitaine d’artillerie', 'Polytechnicien'],
    origine: 'Mulhouse, Alsace',
    accroche:
      'Officier français condamné au bagne pour une trahison qu’il n’a pas commise : douze ans pour que la République reconnaisse son erreur.',
    citations: [
      {
        texte: 'Soldats, on dégrade un innocent ! Vive la France ! Vive l’armée !',
        contexte:
          'Cri lancé pendant sa dégradation, dans la cour de l’École militaire, le 5 janvier 1895, devant quatre mille personnes.',
        sens:
          'Pendant qu’un adjudant lui arrache ses galons et brise son sabre, il crie son innocence — et son attachement à l’armée qui vient de le condamner.',
      },
      {
        texte: 'J’ai froid, monsieur.',
        contexte:
          'Au commandant du Paty de Clam qui, le 15 octobre 1894, lui dicte le texte du bordereau et lui lance : « La main vous tremble. »',
        sens:
          'Le piège de l’arrestation : on lui fait écrire sous la dictée pour comparer son écriture. Il est arrêté dans la minute qui suit.',
      },
      {
        texte: 'C’est par erreur et à tort que cette condamnation a été prononcée.',
        qui: 'La Cour de cassation',
        contexte:
          'Arrêt du 12 juillet 1906, qui casse sans renvoi le jugement de Rennes et rend son honneur à Dreyfus.',
      },
      {
        texte: 'Non, messieurs, non : vive la France !',
        contexte:
          'Le 21 juillet 1906, dans la cour même où il fut dégradé, répondant à la foule qui crie « Vive Dreyfus ! ».',
        sens:
          'Onze ans après l’humiliation, il refuse qu’on l’acclame lui : c’est la justice de la République qu’il veut voir saluée.',
      },
    ],
    reperes: [
      'Alsacien et juif, sa famille quitte Mulhouse en 1871 pour rester française après l’annexion.',
      'Polytechnicien, capitaine d’artillerie, il est le seul officier juif de l’état-major en 1894.',
      '22 décembre 1894 : condamné à la déportation à vie sur la foi d’un dossier secret.',
      'Quatre ans et deux mois seul au bagne de l’île du Diable, en Guyane, parfois entravé la nuit.',
      '1896 : le colonel Picquart établit que le vrai coupable est le commandant Esterhazy.',
      '12 juillet 1906 : la Cour de cassation l’innocente ; il est décoré le 21 juillet.',
    ],
    recit: [
      {
        titre: 'Un bordereau et une écriture',
        texte:
          'En septembre 1894, une femme de ménage au service du contre-espionnage français rapporte de l’ambassade d’Allemagne, à Paris, une lettre déchirée : un **bordereau** annonçant la livraison de documents militaires. L’enquête cherche un officier d’artillerie stagiaire à l’état-major. **Alfred Dreyfus**, capitaine alsacien de trente-cinq ans, correspond au profil — et son écriture « ressemble », disent certains experts, quand d’autres disent le contraire. On ne cherche pas plus loin. Le climat y aide : la presse de **Drumont** déverse chaque jour un antisémitisme violent, et Dreyfus est **le seul officier juif de l’état-major**. Le 15 octobre 1894, on le convoque, on lui dicte le texte du bordereau, on l’arrête.',
      },
      {
        titre: 'Le conseil de guerre et le dossier secret',
        texte:
          'Le procès se tient du 19 au 22 décembre 1894, **à huis clos**. Les preuves sont minces et les experts se contredisent. Pour emporter la décision, le ministère fait remettre aux juges, pendant leur délibération, un **dossier secret** que ni Dreyfus ni son avocat ne verront jamais — une illégalité qui suffira, douze ans plus tard, à faire tomber toute la condamnation. Dreyfus est reconnu coupable à l’unanimité et condamné à la **déportation à vie** dans une enceinte fortifiée, la peine de mort ayant été abolie pour les crimes politiques. Il proteste de son innocence jusqu’au bout et refuse de s’avouer coupable en échange d’une clémence.',
      },
      {
        titre: '5 janvier 1895 : la dégradation',
        texte:
          'La scène est organisée pour être vue. Le **5 janvier 1895**, dans la cour de l’**École militaire**, quatre mille personnes sont rassemblées, la troupe en carré, la foule pressée derrière les grilles. Un adjudant de la garde arrache un à un les galons, les boutons et les bandes du pantalon, puis brise le sabre sur son genou. Dreyfus doit alors défiler devant les troupes, en uniforme dépouillé, en criant son innocence : « Soldats, on dégrade un innocent ! » Derrière les grilles, la foule hurle « Mort aux juifs ! ». Le 13 avril 1895, il débarque à l’**île du Diable**, au large de la Guyane.',
      },
      {
        titre: 'Quatre ans à l’île du Diable',
        texte:
          'L’île, un rocher de quelques hectares, est vidée de ses habitants pour lui seul. Il vit dans une case de quatre mètres sur quatre, entourée d’une palissade qui lui cache la mer, gardé par des surveillants qui ont interdiction de lui adresser la parole. Pendant plusieurs semaines, à la suite d’une fausse rumeur d’évasion, on l’attache la nuit à son lit par une **double boucle** de fer. Il tient un **journal**, écrit chaque jour à sa femme **Lucie** — des lettres souvent retenues ou recopiées —, et répète la même chose : il veut vivre jusqu’à ce que son honneur lui soit rendu. Pendant ce temps, en France, Lucie et son frère **Mathieu** ne cessent jamais de frapper aux portes.',
      },
      {
        titre: 'Picquart, Zola, et douze ans',
        texte:
          'En 1896, le colonel **Picquart**, nouveau chef du renseignement, découvre un autre document allemand désignant le commandant **Esterhazy** : l’écriture du bordereau est la sienne. Pour prix de sa découverte, Picquart est muté en Tunisie. Esterhazy, jugé pour la forme, est **acquitté le 11 janvier 1898** ; deux jours après, **Zola** publie « J’accuse… ! ». En août 1898, le colonel **Henry** avoue avoir fabriqué une pièce du dossier et se donne la mort. Le procès est révisé à **Rennes** en 1899 : contre toute logique, Dreyfus est **recondamné** à dix ans avec « circonstances atténuantes », puis **gracié** dix jours plus tard — grâcié, donc toujours coupable. Il refuse d’en rester là et se bat sept ans de plus. Le **12 juillet 1906**, la **Cour de cassation** casse le jugement sans renvoi : il est innocent. Réintégré, décoré, il servira au front de 1914 à 1918 et mourra en 1935.',
      },
    ],
    chrono: [
      { date: 'septembre 1894', fait: 'Découverte du bordereau à l’ambassade d’Allemagne.' },
      { date: '15 octobre 1894', fait: 'Arrestation du capitaine Dreyfus.' },
      { date: '22 décembre 1894', fait: 'Condamné à la déportation à vie, à huis clos.' },
      { date: '5 janvier 1895', fait: 'Dégradation dans la cour de l’École militaire.' },
      { date: '13 avril 1895', fait: 'Arrivée au bagne de l’île du Diable.' },
      { date: '1896', fait: 'Picquart identifie Esterhazy comme le vrai coupable.' },
      { date: '13 janvier 1898', fait: '« J’accuse… ! » d’Émile Zola dans L’Aurore.' },
      { date: '31 août 1898', fait: 'Le colonel Henry avoue le faux et se suicide.' },
      { date: '9 septembre 1899', fait: 'Recondamné à Rennes, puis gracié le 19.' },
      { date: '12 juillet 1906', fait: 'La Cour de cassation le réhabilite.' },
      { date: '1914 – 1918', fait: 'Il reprend du service et combat au front.' },
      { date: '1935', fait: 'Mort à Paris, le 12 juillet.' },
    ],
    leSaisTu:
      'Le 4 juin 1908, pendant le transfert des cendres de Zola au Panthéon, un journaliste nationaliste tire deux balles de revolver sur Alfred Dreyfus, présent dans l’assistance, et le blesse au bras. Le tireur sera acquitté par la cour d’assises quelques mois plus tard.',
    aRetenir: [
      'Alfred Dreyfus, capitaine alsacien et juif, est accusé de trahison à tort en octobre 1894.',
      'Condamné le 22 décembre 1894 sur un dossier secret, il est dégradé le 5 janvier 1895.',
      'Il passe quatre ans et deux mois au bagne de l’île du Diable, en Guyane.',
      'L’affaire divise la France en dreyfusards et antidreyfusards de 1898 à 1906.',
      'La Cour de cassation le réhabilite le 12 juillet 1906 ; il sert ensuite pendant la Grande Guerre.',
    ],
    mots: [
      {
        mot: 'Bordereau',
        sens: 'La lettre déchirée trouvée à l’ambassade d’Allemagne, pièce de départ de toute l’affaire.',
      },
      {
        mot: 'Dégradation',
        sens: 'Cérémonie publique où l’on retire à un officier ses insignes et où l’on brise son sabre.',
      },
      {
        mot: 'Antisémitisme',
        sens: 'Hostilité envers les juifs ; elle imprègne une partie de la presse française des années 1890.',
      },
      {
        mot: 'Réhabilitation',
        sens: 'Décision de justice qui annule une condamnation et rend son honneur au condamné.',
      },
      {
        mot: 'Grâce',
        sens: 'Remise de peine accordée par le président : elle libère le condamné mais ne l’innocente pas.',
      },
    ],
    lies: [
      'emile-zola',
      'affaire-dreyfus',
      'jean-jaures',
      'georges-clemenceau',
      'loi-de-separation-1905',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Troisième République',
    tags: [
      'Dreyfus',
      'affaire Dreyfus',
      'bordereau',
      'île du Diable',
      'Esterhazy',
      'Picquart',
      'dégradation',
      'antisémitisme',
      'Rennes',
      'Zola',
      'Mulhouse',
    ],
  },
  {
    id: 'marie-curie',
    volet: 'personnages',
    nom: 'Marie Curie',
    surnom: 'la dame au radium',
    dates: '1867 – 1934',
    tri: 1911,
    periode: 'xixe',
    emoji: '☢️',
    roles: ['Physicienne', 'Chimiste', 'Professeure à la Sorbonne'],
    origine: 'Varsovie, Pologne occupée',
    accroche:
      'Seule personne à avoir reçu deux prix Nobel dans deux sciences différentes : elle découvre deux éléments et donne son nom à la radioactivité.',
    citations: [
      {
        texte: 'Dans la vie, rien n’est à craindre, tout est à comprendre.',
        contexte:
          'Rapporté par sa fille Ève Curie dans la biographie qu’elle lui consacre en 1937.',
        sens:
          'Sa règle de travail et de vie : ce qui fait peur cesse de faire peur dès qu’on accepte de l’étudier. La suite de la phrase dit « comprendre davantage, afin de craindre moins ».',
      },
      {
        texte:
          'On ne fait jamais attention à ce qui a été fait ; on ne voit que ce qui reste à faire.',
        contexte: 'Lettre à son frère Józef, le 18 mars 1894, depuis Paris.',
      },
      {
        texte: 'Le radium est un élément, il appartient à tout le monde.',
        contexte:
          'Refusant avec Pierre, en 1902, de breveter le procédé d’extraction du radium ; propos rapporté par Ève Curie.',
        sens:
          'Le brevet les aurait rendus immensément riches. Ils considèrent qu’on ne s’approprie pas un corps de la nature, et publient la méthode pour tous.',
      },
      {
        texte:
          'Je suis de ceux qui pensent que la science a une grande beauté. Un savant dans son laboratoire est aussi un enfant devant un conte de fées.',
        contexte: 'Propos rapportés dans *Madame Curie*, biographie écrite par sa fille, 1937.',
      },
    ],
    reperes: [
      'Née Maria Skłodowska à Varsovie en 1867, dans une Pologne où les femmes n’entrent pas à l’université.',
      'Arrivée à Paris en 1891, elle vit dans une mansarde et sort première de sa licence de physique.',
      '1898 : avec Pierre Curie, elle découvre le polonium, puis le radium, dans la pechblende.',
      'Prix Nobel de physique en 1903 avec Pierre et Becquerel ; prix Nobel de chimie en 1911, seule.',
      'Première femme professeure à la Sorbonne, en 1906, après la mort accidentelle de Pierre.',
      '1914-1918 : elle équipe vingt « petites Curie », des voitures radiologiques qui suivent le front.',
    ],
    recit: [
      {
        titre: 'De Varsovie à la mansarde',
        texte:
          'Maria Skłodowska naît à **Varsovie** en 1867, dans une Pologne effacée de la carte et occupée par la Russie. Son père enseigne les sciences, sa mère dirige une école ; les filles n’ont pas accès à l’université, alors Maria suit les cours clandestins de l’« université volante ». Pour payer les études de médecine de sa sœur Bronia à Paris, elle devient **gouvernante** dans la campagne polonaise pendant six ans, à charge de revanche. En **1891**, à vingt-quatre ans, elle arrive enfin à la **Sorbonne** : elle loue une mansarde du Quartier latin où l’eau gèle la nuit, ne mange presque rien, et sort **première** de sa licence de physique en 1893. Elle rencontre **Pierre Curie** en 1894 et l’épouse l’année suivante, en robe bleue de travail.',
      },
      {
        titre: 'Le hangar et le radium',
        texte:
          'En 1897, cherchant un sujet de thèse, elle choisit un phénomène tout neuf : les rayons mystérieux émis par l’uranium, découverts par **Becquerel**. Grâce à un appareil inventé par Pierre, elle les **mesure** — et constate que la pechblende, le minerai d’uranium, rayonne bien plus fort que l’uranium qu’elle contient : il s’y cache donc autre chose. Pierre abandonne ses propres travaux pour la rejoindre. En juillet **1898**, ils annoncent le **polonium**, baptisé du nom du pays disparu de Marie ; en décembre, le **radium**. Reste à le prouver en l’isolant. Pendant quatre ans, dans un hangar sans plancher ni hotte, Marie remue à la barre de fer des chaudrons de minerai bouillant. De **huit tonnes** de résidus, elle tire un **décigramme** de radium pur. Il brille dans le noir.',
      },
      {
        titre: 'Deux prix Nobel',
        texte:
          'Le prix **Nobel de physique 1903** récompense Becquerel et les Curie pour la **radioactivité** — un mot que Marie a forgé. Le comité avait d’abord songé à n’y mettre que les deux hommes ; Pierre exigea que sa femme y figure. Le 19 avril **1906**, Pierre est renversé et tué par une voiture à cheval, rue Dauphine. Marie, veuve à trente-huit ans avec deux filles, reprend sa chaire : elle est la **première femme professeure de la Sorbonne**. En **1911**, elle reçoit seule le **Nobel de chimie** pour avoir isolé le radium métallique — la même année où l’Académie des sciences lui refuse l’entrée et où la presse la traîne dans la boue. Elle reste, à ce jour, la seule personne titulaire de deux prix Nobel dans **deux sciences différentes**.',
      },
      {
        titre: 'Les petites Curie',
        texte:
          'Quand la guerre éclate en **1914**, les blessés arrivent par milliers et l’on opère sans savoir où sont les éclats. Marie Curie comprend que la **radiographie** peut le dire, et qu’il faut l’amener au front plutôt que d’y amener les blessés. Elle fait équiper une vingtaine de camionnettes d’un appareil à rayons X et d’une dynamo branchée sur le moteur : les « **petites Curie** ». Elle passe son permis de conduire, apprend à changer une roue et à réparer une panne, et part elle-même sur le front avec sa fille **Irène**, dix-sept ans. Avec les deux cents postes fixes qu’elle installe dans les hôpitaux, **plus d’un million** de blessés seront radiographiés en quatre ans. Elle forme aussi cent cinquante femmes au métier de manipulatrice.',
      },
      {
        titre: 'Ce que le radium lui a coûté',
        texte:
          'Personne, au début, ne soupçonne le danger. Marie garde un tube de radium dans sa poche pour le plaisir de le voir luire, travaille sans protection pendant trente-cinq ans, et manipule les appareils de radiographie des heures durant. Sa santé se ruine : anémie, cataracte, doigts brûlés. Elle meurt le **4 juillet 1934** à Sancellemoz, d’une maladie du sang provoquée par les radiations. Sa fille **Irène Joliot-Curie** recevra le Nobel de chimie l’année suivante — et mourra, elle aussi, d’une leucémie. En **1995**, Marie Curie entre au **Panthéon** avec Pierre : elle est la première femme à y être admise pour son œuvre.',
      },
    ],
    chrono: [
      { date: '1867', fait: 'Naissance de Maria Skłodowska à Varsovie.' },
      { date: '1891', fait: 'Arrivée à Paris et inscription à la Sorbonne.' },
      { date: '1895', fait: 'Mariage avec Pierre Curie.' },
      { date: 'juillet 1898', fait: 'Découverte du polonium.' },
      { date: 'décembre 1898', fait: 'Découverte du radium.' },
      { date: '1903', fait: 'Prix Nobel de physique, avec Pierre Curie et Henri Becquerel.' },
      { date: '1906', fait: 'Mort de Pierre ; elle devient professeure à la Sorbonne.' },
      { date: '1911', fait: 'Prix Nobel de chimie, seule.' },
      { date: '1914', fait: 'Les « petites Curie » partent vers le front.' },
      { date: '1934', fait: 'Mort à Sancellemoz, des suites des radiations.' },
      { date: '1995', fait: 'Entrée au Panthéon avec Pierre Curie.' },
    ],
    leSaisTu:
      'Ses carnets de laboratoire sont encore radioactifs. Conservés dans des coffrets de plomb à la Bibliothèque nationale, ils ne se consultent qu’en signant une décharge : le radium qu’elle y a laissé mettra environ mille six cents ans à perdre seulement la moitié de son activité.',
    aRetenir: [
      'Marie Curie (1867-1934), née polonaise, découvre en 1898 le polonium puis le radium.',
      'Elle forge le mot « radioactivité » et reçoit le prix Nobel de physique en 1903 avec Pierre.',
      'Elle obtient seule le prix Nobel de chimie en 1911 : deux Nobel dans deux sciences différentes.',
      'Première femme professeure à la Sorbonne en 1906, elle refuse de breveter le radium.',
      'Pendant la guerre de 1914-1918, ses « petites Curie » radiographient plus d’un million de blessés.',
    ],
    mots: [
      {
        mot: 'Radioactivité',
        sens: 'Propriété de certains éléments qui émettent spontanément des rayons ; le mot est de Marie Curie.',
      },
      {
        mot: 'Pechblende',
        sens: 'Minerai d’uranium dont les Curie ont extrait le polonium et le radium.',
      },
      {
        mot: 'Élément chimique',
        sens: 'Corps pur que l’on ne peut pas décomposer : l’oxygène, le fer, le radium.',
      },
      {
        mot: 'Radiographie',
        sens: 'Image de l’intérieur du corps obtenue avec des rayons X, utilisée dès 1914 sur le front.',
      },
    ],
    lies: ['louis-pasteur', 'charles-darwin', 'revolution-industrielle', 'jules-ferry'],
    niveaux: ['4e', '1re'],
    programme: 'L’Europe de la « révolution industrielle »',
    tags: [
      'Curie',
      'Skłodowska',
      'radium',
      'polonium',
      'radioactivité',
      'Nobel',
      'Sorbonne',
      'petites Curie',
      'Pierre Curie',
      'Panthéon',
      'Varsovie',
    ],
  },
]
