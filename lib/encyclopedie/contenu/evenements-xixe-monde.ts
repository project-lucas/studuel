// -----------------------------------------------------------------------------
// LE XIXᵉ SIÈCLE HORS DE FRANCE — les cinq événements qui font le monde où
// l'élève de 4ᵉ arrive : la machine et l'usine, l'esclavage aboli dans le sang
// aux États-Unis, une Allemagne fabriquée en sept ans de guerres, un continent
// entier partagé entre chancelleries, et Paris qui fête tout cela sous une tour
// de fer.
//
// Les quatre premières fiches expliquent la cinquième : l'Exposition de 1889
// est une vitrine, et une vitrine montre ce qu'un siècle croit avoir réussi —
// le fer, l'électricité, l'empire. Y compris ce qu'on ne montrerait plus.
//
// Sur les sujets douloureux — le travail des enfants, l'esclavage, la
// colonisation —, la règle du guide s'applique : factuel, daté, chiffré,
// sobre. La précision fait plus d'effet que l'indignation
// (cf. `docs/encyclopedie.md`, § 3).
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_XIXE_MONDE: Evenement[] = [
  {
    id: 'revolution-industrielle',
    volet: 'evenements',
    nom: 'La révolution industrielle',
    date: 'fin XVIIIᵉ – XIXᵉ siècle',
    tri: 1830,
    fin: 1914,
    periode: 'xixe',
    emoji: '🏭',
    lieu: 'Le Royaume-Uni, puis l’Europe et les États-Unis',
    accroche:
      'En un siècle, la vapeur, le charbon et le rail font passer l’Europe des champs à l’usine — et mettent face à face deux mondes neufs : le patronat et le prolétariat.',
    citations: [
      {
        texte:
          'Le puits avalait des hommes par bouchées de vingt et de trente, et d’un coup de gosier si facile qu’il semblait ne pas les sentir passer.',
        qui: 'Émile Zola',
        contexte:
          '*Germinal*, 1885 : la descente des mineurs dans la fosse du Voreux, écrite après l’enquête de Zola sur la grève d’Anzin de 1884.',
      },
      {
        texte:
          'Il faut les voir arriver chaque matin en ville et partir chaque soir : une multitude de femmes pâles, maigres, marchant pieds nus au milieu de la boue, et de jeunes enfants couverts de haillons.',
        qui: 'Louis-René Villermé',
        contexte:
          'Enquête sur les ouvriers du coton à Mulhouse, *Tableau de l’état physique et moral des ouvriers*, 1840.',
        sens:
          'Ce rapport, commandé par l’Académie des sciences morales et politiques, a conduit directement à la loi de 1841 sur le travail des enfants.',
      },
      {
        texte: 'Prolétaires de tous les pays, unissez-vous !',
        qui: 'Karl Marx et Friedrich Engels',
        contexte:
          'Dernière phrase du *Manifeste du parti communiste*, publié à Londres en février 1848.',
        sens:
          'L’usine a créé une classe qui se ressemble d’un pays à l’autre : c’est ce constat, autant que l’appel, qui a fait la force de la formule.',
      },
      {
        texte: 'Le progrès est le mode de l’homme.',
        qui: 'Victor Hugo',
        contexte: '*Les Misérables*, 1862.',
        sens:
          'Hugo salue le siècle des machines sans fermer les yeux sur sa misère : le roman qui contient cette phrase est celui de Fantine et de Gavroche.',
      },
    ],
    reperes: [
      'La machine à vapeur de James Watt (1769) libère l’industrie de la force de l’eau et du vent.',
      'Le Royaume-Uni extrait 10 millions de tonnes de charbon en 1800, et 225 millions en 1900.',
      'Première ligne de voyageurs en 1830 : Liverpool-Manchester. La France passe de 3 000 km de voies en 1850 à 40 000 en 1900.',
      'À l’usine, on travaille 12 à 15 heures par jour, six jours sur sept, au rythme de la machine.',
      'La loi française du 22 mars 1841 interdit l’embauche avant 8 ans — sans un seul inspecteur pour la faire respecter.',
      'La loi Waldeck-Rousseau du 21 mars 1884 légalise enfin les syndicats en France.',
    ],
    causes: [
      'Une révolution agricole qui nourrit plus de monde avec moins de bras : l’Europe passe de 190 à 420 millions d’habitants au XIXᵉ siècle.',
      'La machine à vapeur, perfectionnée par Watt en 1769, qui donne une force motrice partout et à toute heure.',
      'Le charbon et le fer, abondants au Royaume-Uni, puis dans la Ruhr, le Nord et la Lorraine.',
      'Des capitaux disponibles : banques, sociétés par actions, Bourse, et les profits du grand commerce maritime.',
      'Le chemin de fer, qui effondre le prix du transport et ouvre des marchés nationaux puis mondiaux.',
      'Des inventions qui s’enchaînent : métier mécanique, convertisseur Bessemer (1856), dynamo, moteur à explosion.',
    ],
    recit: [
      {
        titre: 'La vapeur change la règle',
        texte:
          'Jusqu’au XVIIIᵉ siècle, une machine tourne parce qu’un fleuve la pousse, qu’un vent la fait tourner ou qu’un homme la pédale. La **machine à vapeur**, perfectionnée par **James Watt** en 1769 puis rendue rotative en 1781, brise cette dépendance : avec du **charbon**, on obtient de la force partout, à toute heure, l’hiver comme l’été. L’usine n’a plus besoin de la rivière ; elle s’installe sur le carreau des mines, au Royaume-Uni d’abord, puis dans la **Ruhr**, le **Nord** et la **Lorraine**. Le charbon devient le pain de l’industrie : le Royaume-Uni en extrait 10 millions de tonnes en 1800, 225 millions en 1900. Le fer suit, puis l’**acier**, que le convertisseur **Bessemer** (1856) rend enfin bon marché. Une civilisation entière change de matière première : on passe du bois, de l’eau et du muscle au charbon, au fer et à la vapeur.',
      },
      {
        titre: 'Le rail rétrécit le pays',
        texte:
          'En **1830**, la ligne **Liverpool-Manchester** transporte pour la première fois des voyageurs derrière une locomotive de **George Stephenson**. Ce qui suit ressemble à une épidémie : la France compte 3 000 km de voies en 1850, 17 400 en 1870, **40 000 en 1900** ; le monde en aligne un million en 1913. Les effets dépassent le transport. Le blé de la Beauce arrive à Paris en une journée, les disettes locales disparaissent, les prix s’égalisent. Les villes de province se réveillent ou s’endorment selon que la ligne passe ou non. Les compagnies de chemin de fer deviennent les premières **grandes entreprises** de l’histoire : des milliers de salariés, des actionnaires, une comptabilité. Et l’**heure** elle-même change : pour que deux trains ne se rencontrent pas, il faut que toutes les gares lisent la même montre — la France impose l’heure de Paris à tout le pays en 1891.',
      },
      {
        titre: 'Entrer à l’usine',
        texte:
          'L’usine n’invente pas le travail dur : le paysan aussi travaillait du lever au coucher. Elle invente le **travail au rythme de la machine**. On entre à cinq heures au son de la cloche, on sort douze à quinze heures plus tard, six jours sur sept ; le contremaître compte les minutes et l’amende punit le retard. La campagne se vide : c’est l’**exode rural**. **Londres** passe d’un million d’habitants en 1800 à six millions et demi en 1900, **Paris** de 550 000 à 2,7 millions. On s’entasse dans des garnis sans eau ni égout, où le choléra tue par vagues. Deux groupes neufs se font face : d’un côté le **patronat**, qui possède l’usine, la machine et le capital — les Schneider au Creusot, les Wendel en Lorraine, les Krupp à Essen — ; de l’autre le **prolétariat**, qui ne possède que ses bras et se loue à la journée. Le mot vient du latin *proletarius* : celui qui n’a rien d’autre que ses enfants.',
      },
      {
        titre: 'Des enfants à la machine',
        texte:
          'Un enfant coûte moins cher, se faufile sous les métiers et ne conteste pas. Dans les filatures des années 1830, des enfants de **sept ou huit ans** font des journées de douze à seize heures ; le docteur **Villermé**, envoyé enquêter par l’Académie des sciences morales et politiques, les décrit en 1840 pâles et pieds nus dans la boue de Mulhouse. Son rapport émeut la France : la **loi du 22 mars 1841** interdit l’embauche avant **8 ans**, limite les 8-12 ans à huit heures et les 12-16 ans à douze heures, et interdit le travail de nuit avant 13 ans. C’est la première loi sociale française — et elle ne vaut que pour les établissements de plus de vingt ouvriers, sans un seul inspecteur payé pour la faire appliquer. Il faudra la **loi du 19 mai 1874** pour porter l’âge à douze ans et créer l’**inspection du travail**, et celle de **1892** pour atteindre treize ans.',
      },
      {
        titre: 'S’organiser, et arracher des lois',
        texte:
          'La condition ouvrière ne s’améliore pas toute seule : elle se négocie, souvent après des grèves et des morts. En France, la **loi Le Chapelier** de 1791 interdisait toute coalition ; le **droit de grève** est reconquis en **1864**, et la **loi Waldeck-Rousseau du 21 mars 1884** légalise les **syndicats**. La **CGT** naît en 1895. Les lois suivent : réparation des **accidents du travail** en 1898, **repos hebdomadaire** en 1906, retraites ouvrières en 1910. Les idées s’organisent en même temps : **Marx** et **Engels** publient le *Manifeste du parti communiste* en 1848 et annoncent la lutte des classes ; l’Église répond par l’encyclique *Rerum novarum* (1891), qui reconnaît aux ouvriers le droit de s’associer et un salaire juste. Le **1er mai** devient en 1889 la journée internationale de revendication des **huit heures** — obtenues en France en 1919, quatre-vingts ans après les premiers enfants à la machine.',
      },
    ],
    consequences: [
      'L’exode rural vide les campagnes et gonfle les villes : Londres passe de 1 à 6,5 millions d’habitants en un siècle.',
      'Deux classes nouvelles se font face : un patronat propriétaire des usines, un prolétariat qui ne possède que ses bras.',
      'Des lois sociales arrachées une à une : 1841 sur les enfants, 1874 et son inspection du travail, 1884 sur les syndicats, 1898 sur les accidents, 1906 sur le repos.',
      'Naissance du socialisme et du syndicalisme : *Manifeste du parti communiste* en 1848, CGT en 1895.',
      'Un monde relié par le télégraphe, la vapeur et le canal de Suez (1869) : l’Europe industrielle domine l’économie mondiale.',
      'L’industrie donne aux États européens les moyens matériels de conquérir l’Afrique et l’Asie.',
    ],
    chiffres: [
      { valeur: '40 000 km', quoi: 'de voies ferrées en France en 1900, contre 3 000 en 1850' },
      { valeur: '12 à 15 h', quoi: 'la journée de travail à l’usine vers 1840' },
      { valeur: '8 ans', quoi: 'l’âge minimum d’embauche fixé par la loi française de 1841' },
      { valeur: '6,5 millions', quoi: 'd’habitants à Londres en 1900, contre 1 million en 1800' },
    ],
    chrono: [
      { date: '1769', fait: 'James Watt dépose le brevet de sa machine à vapeur.' },
      { date: '1830', fait: 'Liverpool-Manchester : première ligne de voyageurs.' },
      { date: '22 mars 1841', fait: 'Première loi française sur le travail des enfants.' },
      { date: '1848', fait: 'Marx et Engels publient le *Manifeste du parti communiste*.' },
      { date: '1856', fait: 'Le convertisseur Bessemer rend l’acier bon marché.' },
      { date: '1869', fait: 'Ouverture du canal de Suez.' },
      { date: '19 mai 1874', fait: 'Création de l’inspection du travail en France.' },
      { date: '21 mars 1884', fait: 'La loi Waldeck-Rousseau légalise les syndicats.' },
      { date: '1889', fait: 'Le 1er mai devient la journée des huit heures.' },
      { date: '13 juillet 1906', fait: 'Le repos hebdomadaire devient obligatoire.' },
    ],
    leSaisTu:
      'En 1830, le train de Liverpool à Manchester roulait à 40 km/h, et cela paraissait dangereux : des médecins annonçaient que le corps humain ne supporterait pas une telle vitesse. Le jour de l’inauguration, le député William Huskisson est descendu sur la voie et s’est fait renverser par la *Rocket* — première victime célèbre du chemin de fer.',
    aRetenir: [
      'La machine à vapeur de James Watt (1769) et le charbon libèrent l’industrie de la force de l’eau.',
      'Le chemin de fer de voyageurs commence en 1830 ; la France compte 40 000 km de voies en 1900.',
      'L’usine fait naître deux classes : le patronat, qui possède, et le prolétariat, qui n’a que ses bras.',
      'La loi du 22 mars 1841 interdit l’embauche des enfants avant 8 ans : c’est la première loi sociale française.',
      'La loi Waldeck-Rousseau du 21 mars 1884 légalise les syndicats.',
    ],
    mots: [
      {
        mot: 'Prolétariat',
        sens: 'Ensemble des ouvriers qui ne possèdent ni terre ni outil et vivent de la vente de leur travail.',
      },
      {
        mot: 'Exode rural',
        sens: 'Départ massif des habitants des campagnes vers les villes.',
      },
      {
        mot: 'Syndicat',
        sens: 'Association de travailleurs qui défend leurs intérêts ; légalisée en France en 1884.',
      },
      {
        mot: 'Capitalisme',
        sens: 'Système où les moyens de production appartiennent à des particuliers qui cherchent le profit.',
      },
    ],
    lies: [
      'karl-marx',
      'emile-zola',
      'revolution-de-1848',
      'partage-de-l-afrique',
      'exposition-universelle-1889',
    ],
    niveaux: ['4e', '1re'],
    programme: 'L’Europe et le monde au XIXᵉ siècle',
    tags: [
      'vapeur',
      'charbon',
      'usine',
      'chemin de fer',
      'prolétariat',
      'patronat',
      'exode rural',
      'travail des enfants',
      'syndicats',
      'Watt',
      'Germinal',
      'mine',
    ],
  },
  {
    id: 'guerre-de-secession',
    volet: 'evenements',
    nom: 'La guerre de Sécession',
    date: '1861 – 1865',
    tri: 1861,
    fin: 1865,
    periode: 'xixe',
    emoji: '🪖',
    lieu: 'Les États-Unis, de Gettysburg à Appomattox',
    accroche:
      'Quatre années de guerre entre le Nord et le Sud pour savoir si un homme peut en posséder un autre : 620 000 morts, et l’esclavage aboli aux États-Unis.',
    citations: [
      {
        texte:
          'Que ce gouvernement du peuple, par le peuple, pour le peuple, ne disparaisse pas de la terre.',
        qui: 'Abraham Lincoln',
        contexte:
          'Discours prononcé le 19 novembre 1863 pour l’inauguration du cimetière militaire de Gettysburg : 272 mots, deux minutes.',
        sens:
          'La formule a été reprise mot pour mot dans l’article premier de la Constitution française de 1958.',
      },
      {
        texte: 'Une maison divisée contre elle-même ne peut pas tenir debout.',
        qui: 'Abraham Lincoln',
        contexte:
          'Discours de Springfield, 16 juin 1858, en acceptant l’investiture républicaine pour le Sénat de l’Illinois.',
        sens:
          'Il annonce que l’Union deviendra tout entière esclavagiste ou tout entière libre, mais ne restera pas coupée en deux.',
      },
      {
        texte:
          'Toutes les personnes tenues comme esclaves dans un État en rébellion sont, et seront désormais, libres.',
        qui: 'Abraham Lincoln',
        contexte: 'Proclamation d’émancipation, entrée en vigueur le 1er janvier 1863.',
        sens:
          'Elle ne libère que les esclaves des États rebelles, là où l’Union n’a pas encore le pouvoir : c’est une arme de guerre autant qu’un acte moral. Le XIIIᵉ amendement abolira l’esclavage partout en 1865.',
      },
      {
        texte:
          'Sans malveillance envers personne, avec charité pour tous : achevons l’œuvre commencée et pansons les blessures de la nation.',
        qui: 'Abraham Lincoln',
        contexte: 'Second discours d’investiture, 4 mars 1865, six semaines avant son assassinat.',
      },
    ],
    reperes: [
      'En 1860, les États-Unis comptent 31 millions d’habitants, dont 4 millions d’esclaves, tous dans le Sud.',
      'Le coton du Sud représente environ 60 % des exportations américaines.',
      'Lincoln est élu le 6 novembre 1860 sans une seule voix du Sud profond ; onze États font sécession.',
      'La guerre commence le 12 avril 1861 au bombardement de Fort Sumter.',
      'Gettysburg (1er-3 juillet 1863) arrête l’invasion du Nord par Lee ; Lee capitule le 9 avril 1865 à Appomattox.',
      'Le XIIIᵉ amendement, ratifié le 18 décembre 1865, abolit l’esclavage dans toute l’Union.',
    ],
    causes: [
      'Quatre millions d’esclaves dans le Sud en 1860 : toute l’économie du coton repose sur eux.',
      'Deux économies opposées : un Nord industriel, urbain et protectionniste ; un Sud agricole, exportateur et libre-échangiste.',
      'Un conflit permanent sur les nouveaux États de l’Ouest : compromis du Missouri (1820), loi Kansas-Nebraska (1854), arrêt Dred Scott (1857).',
      'La montée de l’abolitionnisme au Nord : *La Case de l’oncle Tom* (1852) se vend à 300 000 exemplaires en un an.',
      'L’élection d’Abraham Lincoln, le 6 novembre 1860, qui refuse l’extension de l’esclavage aux territoires neufs.',
      'La sécession de onze États, qui forment les États confédérés d’Amérique, puis le bombardement de Fort Sumter.',
    ],
    recit: [
      {
        titre: 'Un pays coupé en deux',
        texte:
          'En 1860, les États-Unis comptent 31 millions d’habitants, dont **quatre millions d’esclaves**, tous dans le Sud. Deux pays cohabitent sous un même drapeau. Le **Nord** est industriel, urbain, peuplé d’immigrants et protectionniste ; il aligne 110 000 usines. Le **Sud** vit du **coton** — près de 60 % des exportations américaines — cultivé dans des plantations par une main-d’œuvre asservie. Depuis quarante ans, chaque nouvel État admis dans l’Union relance la même question : sera-t-il esclavagiste ou libre ? Le **compromis du Missouri** (1820) traçait une ligne ; la loi **Kansas-Nebraska** (1854) la supprime et déclenche une petite guerre civile au Kansas ; l’arrêt **Dred Scott** (1857) va plus loin et juge qu’un Noir, libre ou non, ne peut pas être citoyen américain. Au Nord, l’abolitionnisme gagne du terrain : *La Case de l’oncle Tom*, publié par Harriet Beecher Stowe en 1852, se vend à 300 000 exemplaires en un an.',
      },
      {
        titre: 'La sécession et Fort Sumter',
        texte:
          'Le **6 novembre 1860**, **Abraham Lincoln** est élu président avec 40 % des voix et sans une seule voix du Sud profond. Il n’est pas abolitionniste immédiat — il promet de ne pas toucher à l’esclavage là où il existe — mais il refuse qu’il s’étende, et cela suffit. Le **20 décembre 1860**, la **Caroline du Sud** fait sécession ; dix États suivent et forment en février 1861 les **États confédérés d’Amérique**, avec **Jefferson Davis** pour président et Richmond pour capitale. Le **12 avril 1861**, les batteries confédérées bombardent **Fort Sumter**, dans la rade de Charleston : la garnison fédérale capitule en trente-quatre heures, sans un mort au combat. Lincoln appelle 75 000 volontaires. Chacun croit que l’affaire sera réglée en trois mois ; elle durera quatre ans.',
      },
      {
        titre: 'La première guerre industrielle',
        texte:
          'Cette guerre-là ne ressemble à aucune autre avant elle, et annonce celles du siècle suivant. On transporte les armées par **chemin de fer**, on commande par **télégraphe**, on coud les uniformes à la chaîne. Le Nord compte 22 millions d’habitants et presque toute l’industrie du pays ; le Sud, 9 millions dont un tiers d’esclaves, et des ports bloqués par la marine de l’Union. En mars 1862, deux **cuirassés** — le *Monitor* et le *Virginia* — s’affrontent à Hampton Roads et rendent d’un coup toutes les marines en bois obsolètes. Devant **Petersburg**, en 1864-1865, les armées s’enterrent dans des **tranchées** longues de cinquante kilomètres : c’est déjà Verdun. Et **Sherman**, traversant la Géorgie jusqu’à la mer à l’automne 1864, brûle récoltes, usines et voies ferrées : la guerre ne vise plus seulement l’armée adverse, mais tout ce qui la nourrit.',
      },
      {
        titre: 'Gettysburg, puis Appomattox',
        texte:
          'Le Sud a les meilleurs généraux — **Robert E. Lee**, **Stonewall Jackson** — et gagne d’abord. Lee tente deux fois d’envahir le Nord ; la seconde tentative s’arrête à **Gettysburg**, en Pennsylvanie, du **1er au 3 juillet 1863** : trois jours, environ **51 000** tués, blessés et disparus, et la charge de Pickett brisée sous la mitraille. Le lendemain, **Vicksburg** tombe sur le Mississippi et la Confédération est coupée en deux. Le **1er janvier 1863**, la **proclamation d’émancipation** était entrée en vigueur : elle libère les esclaves des États rebelles et autorise leur enrôlement — près de 180 000 Noirs serviront sous l’uniforme de l’Union. Le **19 novembre 1863**, Lincoln vient inaugurer le cimetière de Gettysburg et prononce en deux minutes le discours le plus célèbre de l’histoire américaine. Le **9 avril 1865**, Lee capitule devant **Grant** dans le salon d’une maison d’**Appomattox** ; cinq jours plus tard, Lincoln est assassiné au théâtre Ford.',
      },
      {
        titre: 'Libres, et pas égaux',
        texte:
          'Le bilan est effrayant : environ **620 000 morts** — plus que dans toutes les autres guerres américaines réunies jusqu’au Viêt Nam — pour 31 millions d’habitants, et les travaux récents avancent même 750 000. Le **XIIIᵉ amendement**, ratifié le **18 décembre 1865**, abolit l’esclavage dans toute l’Union ; le **XIVᵉ** (1868) donne la citoyenneté, le **XVᵉ** (1870) le droit de vote. Pendant douze ans, la **Reconstruction** impose ces droits au Sud par l’armée, et des élus noirs entrent au Congrès. Puis le compromis de **1877** retire les troupes fédérales. Le Sud reprend la main : impôt électoral, tests de lecture, terreur du **Ku Klux Klan**, lois de **ségrégation** — les *Jim Crow laws*. En **1896**, la Cour suprême les valide par l’arrêt *Plessy contre Ferguson* et sa formule « séparés mais égaux », qui tiendra jusqu’en 1954. L’esclavage est mort en 1865 ; l’égalité a mis un siècle de plus.',
      },
    ],
    consequences: [
      'Le XIIIᵉ amendement (18 décembre 1865) abolit l’esclavage dans toute l’Union : quatre millions de personnes sont libres.',
      'Les XIVᵉ (1868) et XVᵉ (1870) amendements accordent la citoyenneté et le droit de vote aux Noirs américains.',
      'La Reconstruction s’achève en 1877 : le Sud impose la ségrégation et, par la terreur du Ku Klux Klan, prive les Noirs du vote.',
      'L’arrêt *Plessy contre Ferguson* (1896) rend la ségrégation légale : « séparés mais égaux » jusqu’en 1954.',
      'Les États-Unis sortent unis et industriels : ils deviennent la première puissance économique mondiale vers 1900.',
      'La guerre inaugure les méthodes du XXᵉ siècle : rail, télégraphe, cuirassés, tranchées, mobilisation de toute l’économie.',
    ],
    chiffres: [
      { valeur: '620 000', quoi: 'morts, militaires des deux camps réunis' },
      { valeur: '4 millions', quoi: 'd’esclaves dans le Sud en 1860, libres en 1865' },
      { valeur: '11', quoi: 'États confédérés sécessionnistes' },
      { valeur: '51 000', quoi: 'tués, blessés et disparus en trois jours à Gettysburg' },
    ],
    chrono: [
      { date: '1852', fait: 'Parution de *La Case de l’oncle Tom*.' },
      { date: '6 novembre 1860', fait: 'Abraham Lincoln est élu président.' },
      { date: '20 décembre 1860', fait: 'La Caroline du Sud fait sécession.' },
      { date: '12 avril 1861', fait: 'Bombardement de Fort Sumter : la guerre commence.' },
      { date: '1er janvier 1863', fait: 'La proclamation d’émancipation entre en vigueur.' },
      { date: '1-3 juillet 1863', fait: 'Bataille de Gettysburg : Lee est arrêté.' },
      { date: '19 novembre 1863', fait: 'Discours de Gettysburg.' },
      { date: '9 avril 1865', fait: 'Lee capitule devant Grant à Appomattox.' },
      { date: '14 avril 1865', fait: 'Lincoln est assassiné au théâtre Ford.' },
      { date: '18 décembre 1865', fait: 'Le XIIIᵉ amendement abolit l’esclavage.' },
      { date: '1896', fait: '*Plessy contre Ferguson* légalise la ségrégation.' },
    ],
    leSaisTu:
      'Le discours de Gettysburg dure deux minutes. Avant Lincoln, l’orateur Edward Everett avait parlé deux heures. Le lendemain, Everett écrivit au président : « Je serais heureux d’avoir approché en deux heures l’idée centrale de cette cérémonie comme vous l’avez fait en deux minutes. » Le texte tient sur une feuille ; on l’apprend encore par cœur dans les écoles américaines.',
    aRetenir: [
      'La guerre de Sécession oppose de 1861 à 1865 les États du Nord aux onze États esclavagistes du Sud.',
      'Elle éclate après l’élection de Lincoln (novembre 1860) et la sécession des États du Sud.',
      'La proclamation d’émancipation entre en vigueur le 1er janvier 1863 ; Gettysburg est le tournant militaire.',
      'Lee capitule à Appomattox le 9 avril 1865 ; la guerre a fait environ 620 000 morts.',
      'Le XIIIᵉ amendement abolit l’esclavage en 1865, mais la ségrégation s’installe et durera jusqu’aux années 1960.',
    ],
    mots: [
      {
        mot: 'Sécession',
        sens: 'Séparation d’une partie d’un État, qui se déclare indépendante du reste du pays.',
      },
      {
        mot: 'Abolitionnisme',
        sens: 'Mouvement qui réclame la suppression de l’esclavage.',
      },
      {
        mot: 'Amendement',
        sens: 'Modification ajoutée à la Constitution des États-Unis ; le XIIIᵉ abolit l’esclavage en 1865.',
      },
      {
        mot: 'Ségrégation',
        sens: 'Séparation imposée par la loi entre Blancs et Noirs dans les écoles, les transports et les lieux publics.',
      },
    ],
    lies: [
      'abraham-lincoln',
      'revolution-industrielle',
      'traite-atlantique-et-code-noir',
      'abolition-de-l-esclavage-1848',
      'victor-schoelcher',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe et le monde au XIXᵉ siècle',
    tags: [
      'Sécession',
      'Lincoln',
      'esclavage',
      'Gettysburg',
      'Appomattox',
      'Confédérés',
      'Union',
      'abolition',
      'ségrégation',
      'coton',
      'États-Unis',
      'Grant',
    ],
  },
  {
    id: 'unification-de-l-allemagne',
    volet: 'evenements',
    nom: 'L’unification de l’Allemagne',
    date: '1864 – 1871',
    tri: 1871,
    periode: 'xixe',
    emoji: '🦅',
    lieu: 'La Prusse, l’Allemagne, et la galerie des Glaces de Versailles',
    accroche:
      'Trente-neuf États, trois guerres en sept ans, et un empire proclamé chez le vaincu : l’Allemagne naît le 18 janvier 1871 à Versailles.',
    citations: [
      {
        texte:
          'Les grandes questions du temps ne se règlent pas par des discours et des votes de majorité, mais par le fer et le sang.',
        qui: 'Otto von Bismarck',
        contexte:
          'Devant la commission du budget de la chambre des députés prussienne, le 30 septembre 1862.',
        sens:
          'Il vise l’échec du parlement de Francfort en 1848 : l’unité ne se votera pas, elle se conquerra. C’est le programme des neuf années suivantes.',
      },
      {
        texte: 'Cela fera l’effet d’un chiffon rouge sur le taureau gaulois.',
        qui: 'Otto von Bismarck',
        contexte:
          'Le 13 juillet 1870, après avoir raccourci la dépêche d’Ems avant de la livrer à la presse (*Pensées et souvenirs*).',
        sens:
          'Il n’invente rien dans la dépêche : il coupe. Le texte abrégé donne l’impression d’un affront, et Paris déclare la guerre six jours plus tard.',
      },
      {
        texte: 'Nous, Allemands, nous craignons Dieu, mais rien d’autre au monde.',
        qui: 'Otto von Bismarck',
        contexte: 'Discours au Reichstag, le 6 février 1888.',
      },
      {
        texte: 'N’en parlons jamais, pensons-y toujours.',
        qui: 'Léon Gambetta',
        contexte:
          'Formule traditionnellement rapportée à propos de l’Alsace-Moselle annexée, à Saint-Quentin en 1871.',
        sens:
          'L’attribution est constante mais la formulation varie selon les sources. Elle résume la « revanche » : un deuil qu’on ne déclare pas et qu’on n’oublie pas.',
        incertaine: true,
      },
    ],
    reperes: [
      'En 1815, les Allemands sont répartis entre 39 États souverains, sans armée ni gouvernement communs.',
      'Le Zollverein, union douanière lancée par la Prusse en 1834, unit le marché avant l’État.',
      'Bismarck devient ministre-président de Prusse en 1862 et fait trois guerres : 1864, 1866, 1870.',
      'Sadowa, le 3 juillet 1866, exclut l’Autriche du monde allemand.',
      'Le 18 janvier 1871, Guillaume Ier est proclamé empereur dans la galerie des Glaces de Versailles.',
      'Le traité de Francfort (10 mai 1871) annexe l’Alsace et la Moselle et impose 5 milliards de francs-or.',
    ],
    causes: [
      'Le congrès de Vienne (1815) laisse les pays de langue allemande découpés en trente-neuf États souverains.',
      'Le Zollverein, union douanière créée en 1834 autour de la Prusse, fait circuler les marchandises avant les idées.',
      'L’échec du parlement de Francfort en 1848-1849 : le roi de Prusse refuse une couronne offerte par une assemblée élue.',
      'La puissance prussienne : charbon de la Ruhr, réseau ferré, fusil Dreyse, armée réorganisée par Roon et Moltke.',
      'La volonté de Bismarck, ministre-président dès 1862, de faire l’unité sans l’Autriche et par les armes.',
      'La candidature d’un prince Hohenzollern au trône d’Espagne, en 1870, puis la dépêche d’Ems raccourcie par Bismarck.',
    ],
    recit: [
      {
        titre: 'Un peuple, trente-neuf États',
        texte:
          'En 1815, le congrès de Vienne laisse les pays de langue allemande découpés en **trente-neuf États** souverains, de l’immense Autriche au duché minuscule, réunis dans une simple **Confédération germanique** sans armée ni gouvernement communs. Les marchandises paient une douane à chaque frontière. L’unité commence donc par l’économie : le **Zollverein**, union douanière lancée par la Prusse en **1834**, supprime ces barrières et habitue les Allemands à un marché unique — sans l’Autriche. En **1848**, les libéraux tentent l’unité par le vote : un parlement élu se réunit à **Francfort** et offre en 1849 la couronne impériale au roi de Prusse **Frédéric-Guillaume IV**. Il la refuse : il ne veut pas d’une couronne « ramassée dans le ruisseau », donnée par une assemblée et non par des princes. L’unité par le bas a échoué ; elle se fera par le haut, et par les armes.',
      },
      {
        titre: 'Trois guerres en sept ans',
        texte:
          'En **1862**, le roi **Guillaume Ier** appelle **Otto von Bismarck** à la tête du gouvernement prussien pour imposer, contre le parlement qui refuse les crédits, la réforme militaire de **Roon** et **Moltke**. Bismarck applique un plan simple : écarter l’un après l’autre tous ceux qui gênent. **1864**, guerre contre le **Danemark**, avec l’Autriche pour alliée : les duchés du **Schleswig** et du **Holstein** sont pris, puis partagés — donc disputés. **1866**, guerre contre l’**Autriche** : en sept semaines, le fusil Dreyse à chargement par la culasse et le chemin de fer donnent la victoire de **Sadowa**, le 3 juillet. Bismarck impose à Vienne une paix étonnamment douce, mais exclut définitivement l’Autriche du monde allemand et fonde la **Confédération de l’Allemagne du Nord**. Restent la France, qui ne veut pas d’un grand voisin uni, et les États du Sud — Bavière, Wurtemberg, Bade — qui hésitent. Une guerre contre l’étranger les décidera.',
      },
      {
        titre: 'La dépêche d’Ems',
        texte:
          'En 1870, un prince **Hohenzollern**, cousin du roi de Prusse, est candidat au trône d’**Espagne** : Paris y voit un encerclement et obtient son retrait. La France en demande alors trop — un engagement écrit pour l’avenir. Le **13 juillet 1870**, à la station thermale d’**Ems**, Guillaume Ier écoute poliment l’ambassadeur français, refuse, et fait télégraphier le compte rendu à Berlin. Bismarck **raccourcit la dépêche** avant de la donner à la presse : rien n’est inventé, mais le texte abrégé donne l’impression d’un refus sec, presque d’un affront réciproque. Il note lui-même qu’ainsi rédigée, elle fera l’effet d’un chiffon rouge sur le taureau gaulois. Paris tombe dans le piège et déclare la guerre le **19 juillet**. L’armée française, mal préparée et mal commandée, est battue en six semaines : à **Sedan**, le 2 septembre, Napoléon III capitule avec 83 000 hommes. Bismarck a ce qu’il voulait : les États du Sud sont entrés dans la guerre aux côtés de la Prusse.',
      },
      {
        titre: '18 janvier 1871, galerie des Glaces',
        texte:
          'Paris est assiégé depuis septembre. Le **18 janvier 1871**, pendant que la ville affamée tient encore, les princes allemands se réunissent dans la **galerie des Glaces** du château de **Versailles** — la salle bâtie par Louis XIV pour la gloire de la France — et proclament **Guillaume Ier** *Deutscher Kaiser*, empereur allemand. Le choix du lieu est délibéré : l’Empire allemand naît chez le vaincu, dans le décor de son plus grand roi. Le **traité de Francfort**, signé le **10 mai 1871**, en fixe le prix : l’**Alsace** et une grande partie de la **Moselle** passent à l’Allemagne — environ 1,6 million d’habitants, dont quelque 128 000 « **optants** » quitteront leur région pour rester français — et la France doit payer **5 milliards de francs-or**, qu’elle acquitte dès 1873, à la surprise générale. Le nouvel empire, le **IIᵉ Reich**, est une fédération de vingt-cinq États où la Prusse pèse les deux tiers.',
      },
      {
        titre: 'Ce que 1871 prépare',
        texte:
          'Bismarck, devenu chancelier, sait très bien ce qu’il a créé : une France qui ne pardonnera pas. Il passe vingt ans à l’isoler par des alliances — la **Triplice** avec l’Autriche-Hongrie et l’Italie, en **1882** — et à éviter toute nouvelle guerre. Mais l’Allemagne est désormais la première puissance industrielle du continent, et **Guillaume II**, qui renvoie Bismarck en **1890**, veut une « place au soleil » : une flotte de guerre, des colonies, une politique mondiale. La France sort alors de son isolement par l’alliance avec la **Russie** (1894), puis par l’**Entente cordiale** avec le Royaume-Uni (1904). Deux blocs se font face, et l’Alsace-Moselle reste entre eux comme une plaie ouverte. En **1914**, il suffira d’un attentat à Sarajevo pour que ce mécanisme d’alliances, né en janvier 1871 dans la galerie des Glaces, mette l’Europe entière en marche.',
      },
    ],
    consequences: [
      'Naissance du IIᵉ Reich, fédération de vingt-cinq États dominée par la Prusse, première puissance industrielle du continent.',
      'Le traité de Francfort annexe l’Alsace et la Moselle : 1,6 million d’habitants deviennent allemands, environ 128 000 partent.',
      'La France paie 5 milliards de francs-or et subit l’occupation jusqu’au paiement, achevé dès 1873.',
      'La « revanche » devient un thème permanent de la vie politique française jusqu’en 1914.',
      'Bismarck bâtit un système d’alliances (Triplice, 1882) pour isoler la France, qui s’allie à la Russie en 1894 et au Royaume-Uni en 1904.',
      'Ce jeu d’alliances rigides transforme, en 1914, un attentat balkanique en guerre européenne.',
    ],
    chiffres: [
      { valeur: '39', quoi: 'États allemands laissés par le congrès de Vienne en 1815' },
      { valeur: '3 guerres', quoi: 'en sept ans : 1864, 1866, 1870' },
      { valeur: '5 milliards', quoi: 'de francs-or exigés de la France en 1871' },
      { valeur: '1,6 million', quoi: 'd’habitants annexés avec l’Alsace-Moselle' },
    ],
    chrono: [
      { date: '1834', fait: 'Création du Zollverein, union douanière allemande.' },
      { date: '1849', fait: 'Le roi de Prusse refuse la couronne du parlement de Francfort.' },
      { date: '1862', fait: 'Bismarck devient ministre-président de Prusse.' },
      { date: '1864', fait: 'Guerre des Duchés contre le Danemark.' },
      { date: '3 juillet 1866', fait: 'Sadowa : l’Autriche est écartée du monde allemand.' },
      { date: '13 juillet 1870', fait: 'Bismarck raccourcit la dépêche d’Ems.' },
      { date: '19 juillet 1870', fait: 'La France déclare la guerre à la Prusse.' },
      { date: '2 septembre 1870', fait: 'Sedan : Napoléon III capitule.' },
      { date: '18 janvier 1871', fait: 'Guillaume Ier proclamé empereur à Versailles.' },
      { date: '10 mai 1871', fait: 'Traité de Francfort : l’Alsace-Moselle est annexée.' },
      { date: '1882', fait: 'Triplice : Allemagne, Autriche-Hongrie, Italie.' },
    ],
    leSaisTu:
      'Bismarck avait fixé l’indemnité de 5 milliards de francs-or pour prolonger l’occupation allemande le plus longtemps possible. Mais l’emprunt lancé par Thiers auprès des épargnants français fut couvert treize fois, et la France paya tout en moins de trois ans. Le dernier soldat allemand quitta le territoire en septembre 1873.',
    aRetenir: [
      'Bismarck, ministre-président de Prusse en 1862, fait l’unité allemande par trois guerres : 1864, 1866, 1870.',
      'La victoire de Sadowa, le 3 juillet 1866, exclut l’Autriche du monde allemand.',
      'La dépêche d’Ems, raccourcie par Bismarck le 13 juillet 1870, pousse la France à déclarer la guerre.',
      'L’Empire allemand est proclamé le 18 janvier 1871 dans la galerie des Glaces de Versailles.',
      'Le traité de Francfort (10 mai 1871) annexe l’Alsace-Moselle et impose 5 milliards de francs-or à la France.',
    ],
    mots: [
      {
        mot: 'Zollverein',
        sens: 'Union douanière allemande créée en 1834 autour de la Prusse : un seul marché avant un seul État.',
      },
      {
        mot: 'Reich',
        sens: 'Mot allemand pour « empire » : le IIᵉ Reich est celui de 1871 à 1918.',
      },
      {
        mot: 'Optant',
        sens: 'Habitant d’Alsace-Moselle qui choisit, après 1871, de rester français en quittant sa région.',
      },
      {
        mot: 'Revanche',
        sens: 'Idée, très répandue en France après 1871, de reprendre un jour l’Alsace et la Moselle.',
      },
    ],
    lies: [
      'otto-von-bismarck',
      'defaite-de-sedan',
      'commune-de-paris',
      'leon-gambetta',
      'attentat-de-sarajevo',
    ],
    niveaux: ['4e', '1re'],
    programme: 'L’Europe et le monde au XIXᵉ siècle',
    tags: [
      'Bismarck',
      'Prusse',
      'Sadowa',
      'dépêche d’Ems',
      'Sedan',
      'galerie des Glaces',
      'Alsace-Moselle',
      'Reich',
      'Guillaume Ier',
      'unité allemande',
      'Francfort',
      'revanche',
    ],
  },
  {
    id: 'partage-de-l-afrique',
    volet: 'evenements',
    nom: 'Le partage de l’Afrique',
    date: '1884 – 1914',
    tri: 1885,
    fin: 1914,
    periode: 'xixe',
    emoji: '🗺️',
    lieu: 'Berlin, puis l’ensemble du continent africain',
    accroche:
      'En trente ans, l’Europe passe de quelques comptoirs côtiers à la domination d’un continent entier : en 1914, seuls l’Éthiopie et le Liberia restent indépendants.',
    citations: [
      {
        texte:
          'Les races supérieures ont un droit vis-à-vis des races inférieures, parce qu’il y a pour elles un devoir : civiliser les races inférieures.',
        qui: 'Jules Ferry',
        contexte:
          'À la Chambre des députés, le 28 juillet 1885, pour défendre l’expansion coloniale de la France.',
        sens:
          'C’est la doctrine officielle de la « mission civilisatrice ». Elle est contestée dans le même hémicycle deux jours plus tard, et la science a depuis réfuté l’idée même de races supérieures.',
      },
      {
        texte:
          'Races supérieures ! Races inférieures, c’est bientôt dit. Non, il n’y a pas de droit des nations dites supérieures sur les nations inférieures.',
        qui: 'Georges Clemenceau',
        contexte: 'Réponse à Jules Ferry à la Chambre des députés, le 30 juillet 1885.',
        sens:
          'La colonisation avait ses adversaires sur le moment : ce n’est pas un jugement de notre époque plaqué après coup.',
      },
      {
        texte:
          'Ouvrir à la civilisation la seule partie de notre globe où elle n’ait point encore pénétré.',
        qui: 'Léopold II, roi des Belges',
        contexte:
          'Discours d’ouverture de la Conférence géographique de Bruxelles, le 12 septembre 1876.',
        sens:
          'Neuf ans plus tard, la conférence de Berlin lui reconnaît l’État indépendant du Congo comme propriété personnelle : 2,3 millions de km², quatre-vingts fois la Belgique.',
      },
    ],
    reperes: [
      'Vers 1880, les Européens ne contrôlent qu’environ un dixième de l’Afrique, presque uniquement des côtes.',
      'La conférence de Berlin (15 novembre 1884 – 26 février 1885) réunit quatorze délégations, aucune africaine.',
      'Son acte général impose la règle de l’« occupation effective » : occuper vraiment pour être reconnu.',
      'Près de 44 % des frontières africaines actuelles sont des lignes droites tracées à cette époque.',
      'À Fachoda, en septembre 1898, Français et Britanniques s’évitent de justesse sur le Nil.',
      'En 1914, seuls l’Éthiopie et le Liberia échappent encore à la domination européenne.',
    ],
    causes: [
      'Une industrie européenne qui réclame des matières premières : caoutchouc, coton, huile de palme, cuivre, or, diamants.',
      'La recherche de débouchés et de placements pour des capitaux qui rapportent peu en Europe.',
      'Des raisons stratégiques : escales à charbon et contrôle de la route des Indes après l’ouverture du canal de Suez en 1869.',
      'La rivalité des nations : une colonie est d’abord une question de prestige et de rang en Europe.',
      'Des moyens techniques nouveaux : quinine contre le paludisme, canonnière à vapeur, télégraphe, fusil à répétition.',
      'L’idéologie de la « mission civilisatrice », relayée par les sociétés de géographie et les missions chrétiennes.',
      'Les explorations de Livingstone, Stanley et Savorgnan de Brazza, qui dressent les cartes que les États vont se partager.',
    ],
    recit: [
      {
        titre: 'Avant 1880, des comptoirs',
        texte:
          'Vers **1880**, les Européens ne contrôlent qu’environ **un dixième** de l’Afrique, et presque uniquement des côtes : comptoirs de traite, escales, l’Algérie conquise depuis 1830, la colonie du Cap. L’intérieur leur reste fermé — moins par la volonté des États africains, qui sont pourtant de vraies puissances (le Dahomey, l’empire toucouleur, le Zoulouland, l’Éthiopie), que par le **paludisme**, qui pouvait tuer la moitié d’une expédition. Trois nouveautés font tomber ce mur en une génération : la **quinine**, prise en prévention à partir des années 1850 ; la **canonnière à vapeur**, qui remonte les fleuves à contre-courant ; le **fusil à répétition**, puis la mitrailleuse Maxim (1884), qui rendent les rapports de force sans appel. Les explorateurs — **Livingstone**, **Stanley**, **Savorgnan de Brazza** — dressent les cartes ; les États s’en serviront pour se partager ce qu’elles montrent.',
      },
      {
        titre: 'Berlin, hiver 1884-1885',
        texte:
          'Le **15 novembre 1884**, **Bismarck** ouvre à Berlin une conférence qui réunit **quatorze délégations** : treize États européens, les États-Unis et l’Empire ottoman. **Aucun Africain n’y est invité.** Contrairement à une idée répandue, on n’y découpe pas le continent sur une carte : on y fixe les **règles de la course**. L’acte général du **26 février 1885** proclame la liberté de navigation et de commerce sur le **Congo** et le **Niger**, condamne en paroles la traite d’esclaves, et surtout pose le principe de l’**occupation effective** : pour qu’un territoire soit reconnu à une puissance, il ne suffit plus d’y planter un drapeau, il faut l’occuper réellement et le notifier aux autres. La conséquence est immédiate — chacun se précipite vers l’intérieur des terres pour y être avant le voisin. Berlin reconnaît enfin à **Léopold II** l’**État indépendant du Congo**, non pas à la Belgique, mais à lui personnellement.',
      },
      {
        titre: 'Des frontières tracées à la règle',
        texte:
          'Les partages se règlent ensuite entre chancelleries, à coups de traités bilatéraux et de commissions de délimitation. Faute de connaître le terrain, on trace au **méridien**, au **parallèle** et à la **ligne droite** : près de **44 %** des frontières africaines actuelles sont des lignes géométriques, une proportion unique au monde. Ces traits coupent des peuples en deux — les Somalis répartis entre cinq territoires, les Haoussas entre le Nigeria et le Niger, les Éwés entre le Ghana et le Togo — et enferment dans un même cadre des sociétés qui n’avaient rien choisi ensemble. Sur place, la domination prend trois formes : la **colonie**, administrée directement ; le **protectorat**, qui laisse un souverain local sous tutelle ; la **compagnie à charte**, qui exploite un territoire pour le compte d’actionnaires. Partout, elle repose sur l’**impôt de capitation**, le **travail forcé** et des cultures imposées pour l’exportation.',
      },
      {
        titre: 'Fachoda, septembre 1898',
        texte:
          'La course crée des collisions. La France rêve d’un empire d’ouest en est, de Dakar à Djibouti ; le Royaume-Uni d’un axe nord-sud, du **Caire au Cap**. Les deux lignes se croisent au Soudan. Parti de Brazzaville, le commandant **Marchand** met deux ans et **14 000 kilomètres** pour atteindre, avec 150 hommes, le poste abandonné de **Fachoda** sur le Nil Blanc, le 10 juillet 1898. Le **18 septembre**, **Kitchener** remonte le fleuve avec une flottille et une armée de 20 000 hommes, après avoir écrasé les Mahdistes à Omdurman. Les deux officiers se saluent, boivent ensemble, hissent chacun son drapeau et télégraphient à leur gouvernement. Paris, isolé en pleine **affaire Dreyfus** et hors d’état de soutenir une guerre navale, ordonne le retrait début novembre. L’humiliation est vive — et c’est pourtant elle qui pousse Delcassé à s’entendre avec Londres : ce sera l’**Entente cordiale** de 1904.',
      },
      {
        titre: 'Ce que le partage a laissé',
        texte:
          'En **1914**, la carte est pleine : le Royaume-Uni et la France se taillent la part du lion, l’Allemagne, le Portugal, la Belgique, l’Italie et l’Espagne se partagent le reste, et il ne subsiste que **deux États africains indépendants** — l’**Éthiopie**, qui a écrasé l’armée italienne à **Adoua** en 1896, et le **Liberia**. Le bilan humain est lourd : guerres de conquête, famines, déplacements forcés ; au Congo de Léopold II, une récolte du caoutchouc arrachée par la violence et les mutilations, dénoncée dès 1900 par Edmund Morel puis par le rapport Casement, ce qui contraint la Belgique à reprendre la colonie en **1908**. Les **décolonisations** de 1956-1975 rendront leur indépendance à ces territoires — mais dans les frontières de 1885-1914, que l’Organisation de l’unité africaine déclare **intangibles** en 1964, pour éviter des guerres pires encore. Cent trente ans plus tard, les lignes droites de Berlin sont toujours sur les cartes.',
      },
    ],
    consequences: [
      'En 1914, tout le continent est colonisé sauf l’Éthiopie, victorieuse à Adoua en 1896, et le Liberia.',
      'Des frontières tracées à la règle : près de la moitié des limites africaines actuelles sont des lignes droites héritées de cette période.',
      'Des économies de traite tournées vers l’exportation, avec travail forcé, impôt de capitation et cultures imposées.',
      'Au Congo de Léopold II, la violence de la récolte du caoutchouc provoque un scandale international ; la Belgique reprend la colonie en 1908.',
      'Les décolonisations de 1956-1975 conservent ces frontières, déclarées intangibles par l’Organisation de l’unité africaine en 1964.',
      'Les rivalités coloniales (Fachoda en 1898, le Maroc en 1905 et 1911) nourrissent les tensions qui mènent à 1914.',
    ],
    chiffres: [
      { valeur: '10 %', quoi: 'du continent sous domination européenne vers 1880' },
      { valeur: '14', quoi: 'délégations à la conférence de Berlin, aucune africaine' },
      { valeur: '44 %', quoi: 'des frontières africaines tracées en lignes droites' },
      { valeur: '2', quoi: 'États africains encore indépendants en 1914' },
    ],
    chrono: [
      { date: '1869', fait: 'Ouverture du canal de Suez.' },
      { date: '1876', fait: 'Léopold II réunit la conférence géographique de Bruxelles.' },
      { date: '1880', fait: 'Brazza signe un traité avec le Makoko, sur le Congo.' },
      { date: '15 novembre 1884', fait: 'Ouverture de la conférence de Berlin.' },
      { date: '26 février 1885', fait: 'Acte général : règle de l’« occupation effective ».' },
      { date: '28 juillet 1885', fait: 'Jules Ferry défend la colonisation à la Chambre.' },
      { date: '1896', fait: 'L’Éthiopie écrase l’armée italienne à Adoua.' },
      { date: '18 septembre 1898', fait: 'Face-à-face de Fachoda : Marchand et Kitchener.' },
      { date: '1904', fait: 'Entente cordiale : Londres et Paris règlent leurs litiges coloniaux.' },
      { date: '1908', fait: 'Le Congo de Léopold II passe à l’État belge.' },
      { date: '1964', fait: 'L’OUA déclare les frontières héritées intangibles.' },
    ],
    leSaisTu:
      'La mission Marchand a traversé l’Afrique d’ouest en est en deux ans : 150 hommes, 14 000 kilomètres, et un petit vapeur, le *Faidherbe*, démonté en pièces portées à dos d’homme à travers la brousse, puis remonté sur le Nil. À Fachoda, les deux camps se saluent, échangent champagne et whisky… et attendent poliment les ordres de Paris et de Londres.',
    aRetenir: [
      'La conférence de Berlin (novembre 1884 – février 1885) réunit quatorze délégations, aucune africaine.',
      'Elle fixe la règle de l’« occupation effective » : il faut occuper réellement un territoire pour qu’il soit reconnu.',
      'Les motifs sont économiques, stratégiques et idéologiques : Jules Ferry invoque en 1885 un devoir de « civiliser ».',
      'En 1914, seuls l’Éthiopie et le Liberia restent indépendants en Afrique.',
      'Les frontières tracées entre 1885 et 1914 sont encore celles des États africains d’aujourd’hui.',
    ],
    mots: [
      {
        mot: 'Colonie',
        sens: 'Territoire conquis, administré et exploité directement par un État étranger.',
      },
      {
        mot: 'Protectorat',
        sens: 'Territoire où un souverain local est maintenu, mais placé sous la tutelle d’une puissance étrangère.',
      },
      {
        mot: 'Occupation effective',
        sens: 'Règle fixée à Berlin en 1885 : une puissance n’obtient un territoire que si elle l’occupe réellement.',
      },
      {
        mot: 'Impérialisme',
        sens: 'Politique d’un État qui cherche à dominer d’autres peuples, par la conquête ou par l’économie.',
      },
    ],
    lies: [
      'jules-ferry',
      'revolution-industrielle',
      'exposition-universelle-1889',
      'decolonisation-de-l-afrique',
      'traite-atlantique-et-code-noir',
    ],
    niveaux: ['4e', '1re'],
    programme: 'Conquêtes et sociétés coloniales',
    tags: [
      'colonisation',
      'Afrique',
      'conférence de Berlin',
      'Jules Ferry',
      'Fachoda',
      'empire colonial',
      'Léopold II',
      'Congo',
      'Stanley',
      'Brazza',
      'mission civilisatrice',
      'frontières',
    ],
  },
  {
    id: 'exposition-universelle-1889',
    volet: 'evenements',
    nom: 'L’Exposition universelle de 1889',
    date: '6 mai – 31 octobre 1889',
    tri: 1889,
    periode: 'xixe',
    emoji: '🗼',
    lieu: 'Paris, Champ-de-Mars et esplanade des Invalides',
    accroche:
      'Pour les cent ans de la Révolution, Paris dresse une tour de fer de 300 mètres que les artistes détestent — et 32 millions de visiteurs viennent la voir.',
    citations: [
      {
        texte:
          'Nous venons, écrivains, peintres, sculpteurs, architectes, protester de toutes nos forces contre l’érection, en plein cœur de notre capitale, de l’inutile et monstrueuse tour Eiffel.',
        qui: 'Les artistes signataires de la protestation',
        contexte:
          'Publiée dans *Le Temps* le 14 février 1887, signée notamment par Maupassant, Gounod, Dumas fils, Sully Prudhomme et Charles Garnier.',
        sens:
          'Ils redoutaient une cheminée d’usine au milieu de Paris. Garnier, l’architecte de l’Opéra, siégera pourtant au comité de l’exposition l’année suivante.',
      },
      {
        texte: 'La France sera le seul pays qui aura un drapeau de 300 mètres de hauteur.',
        qui: 'Gustave Eiffel',
        contexte: 'En défendant son projet contre ses détracteurs, avant l’ouverture de 1889.',
        sens:
          'Le 31 mars 1889, il monte lui-même les 1 710 marches pour hisser le drapeau tricolore au sommet.',
      },
      {
        texte: 'Je crois, pour ma part, que la tour aura sa beauté propre.',
        qui: 'Gustave Eiffel',
        contexte: 'Réponse à la protestation des artistes, dans *Le Temps* du 14 février 1887.',
      },
      {
        texte:
          'Au brave constructeur d’un si gigantesque et original spécimen d’architecture moderne, de la part de quelqu’un qui a le plus grand respect pour tous les ingénieurs, y compris le Grand Ingénieur, le bon Dieu.',
        qui: 'Thomas Edison',
        contexte: 'Dédicace laissée dans le livre d’or de la tour Eiffel, le 10 septembre 1889.',
      },
    ],
    reperes: [
      'L’exposition ouvre le 6 mai 1889 pour le centenaire de la Révolution française.',
      'Les monarchies européennes refusent d’y participer officiellement ; leurs industriels viennent quand même.',
      'La tour Eiffel est bâtie en deux ans, deux mois et cinq jours : 18 038 pièces, 2 500 000 rivets, 300 mètres.',
      'La galerie des machines franchit 115 mètres d’une seule portée, sans un pilier.',
      'L’électricité est la vedette : fontaines lumineuses, phare au sommet de la tour, phonographe d’Edison.',
      'Trente-deux millions de visiteurs en six mois, pour une France de 38 millions d’habitants.',
    ],
    causes: [
      'Le centenaire de 1789 : la jeune Troisième République veut fêter la Révolution et s’affirmer face aux monarchistes.',
      'La volonté de montrer une France relevée de la défaite de 1870 et de la perte de l’Alsace-Moselle.',
      'Une tradition déjà installée : Londres 1851, Paris 1855, 1867 et 1878 ont fait de l’exposition la vitrine des nations.',
      'Les progrès du fer et de l’acier, qui rendent possibles des constructions inimaginables vingt ans plus tôt.',
      'L’arrivée de l’électricité dans la vie quotidienne : lampes à arc, ampoules, dynamos, phonographe.',
      'Un empire colonial en pleine expansion, que le gouvernement veut faire accepter à l’opinion.',
    ],
    recit: [
      {
        titre: 'Fêter cent ans de Révolution',
        texte:
          'L’Exposition universelle de **1889** n’est pas une foire comme les autres : elle célèbre le **centenaire de 1789**. Pour la jeune **Troisième République**, encore contestée par les monarchistes et secouée par la crise boulangiste, c’est une déclaration politique. Les monarchies européennes le comprennent parfaitement et refusent d’y participer officiellement : l’Allemagne, l’Autriche-Hongrie, la Russie, l’Italie et l’Espagne s’abstiennent. Leurs industriels viennent quand même, à titre privé, parce qu’aucun fabricant ne veut manquer la plus grande vitrine du monde. Trente-cinq pays sont malgré tout représentés, et **61 722 exposants** s’installent sur le **Champ-de-Mars**, l’esplanade des **Invalides** et le **Trocadéro**, sur quatre-vingt-seize hectares. La France a une seconde chose à prouver : qu’elle s’est relevée de 1870. Elle le prouvera en fer.',
      },
      {
        titre: 'Trois cents mètres de fer',
        texte:
          'Le concours lancé en **mai 1886** reçoit 107 projets ; celui des ingénieurs **Koechlin** et **Nouguier**, repris par **Gustave Eiffel** et l’architecte **Sauvestre**, l’emporte. Le chantier ouvre le **28 janvier 1887** et s’achève le **31 mars 1889** : deux ans, deux mois et cinq jours, **18 038 pièces** de fer puddlé, **2 500 000 rivets**, 7 300 tonnes de métal, **300 mètres** — la plus haute construction du monde, et elle le restera jusqu’en 1930. Environ trois cents ouvriers y travaillent, sans un seul mort en service sur le chantier. Le **14 février 1887**, *Le Temps* publie la **protestation des artistes** contre « l’inutile et monstrueuse tour Eiffel », signée entre autres par **Maupassant**, **Gounod**, **Dumas fils** et **Charles Garnier**, l’architecte de l’Opéra. Eiffel répond calmement qu’une tour peut avoir « sa beauté propre », et que la France sera le seul pays à porter un drapeau à trois cents mètres de haut.',
      },
      {
        titre: 'La galerie des machines',
        texte:
          'La tour est l’entrée ; la vraie prouesse technique est au fond du Champ-de-Mars. La **galerie des machines**, bâtie par l’architecte **Dutert** et l’ingénieur **Contamin**, mesure **420 mètres de long** et franchit **115 mètres d’une seule portée**, sans un pilier : c’est le plus grand espace couvert jamais construit, un record qui tiendra quarante ans. Ses immenses arcs d’acier reposent sur des articulations, comme des genoux, pour absorber les dilatations du métal. À l’intérieur, des milliers de machines tournent — métiers, presses, moteurs, dynamos — et deux **ponts roulants** promènent les visiteurs à sept mètres au-dessus des allées, sur toute la longueur, pour qu’ils voient l’industrie d’en haut. La galerie sera pourtant démolie en **1910**, sans que personne ne s’y oppose : on avait sauvé la tour, on a laissé partir le chef-d’œuvre.',
      },
      {
        titre: 'La fée électricité',
        texte:
          'Ce que les visiteurs racontent en rentrant chez eux, c’est la lumière. 1889 est la première grande fête de l’**électricité** : plus d’un millier de **lampes à arc** éclairent les allées, des ampoules **Edison** dessinent les contours des bâtiments, et les **fontaines lumineuses** du Champ-de-Mars projettent chaque soir des jets colorés par des verres mobiles glissés devant des projecteurs. Au sommet de la tour, un phare envoie un faisceau visible à des dizaines de kilomètres, et trois grandes lanternes bleu, blanc, rouge tournent au-dessus de Paris. **Thomas Edison** vient en personne le **10 septembre**, monte au sommet, signe le livre d’or et présente son **phonographe** : la file d’attente dure des heures, car pour la première fois des milliers de gens entendent une voix enregistrée. Paris, jusque-là éclairé au gaz, devient ce soir-là la Ville Lumière au sens propre.',
      },
      {
        titre: 'Les villages indigènes',
        texte:
          'Sur l’esplanade des **Invalides**, l’exposition présente l’empire colonial. À côté des pavillons d’Algérie, de Tunisie et d’Indochine, on installe une **rue du Caire** de vingt-cinq maisons, avec ses ânes, ses boutiques et ses danseuses, et une « **histoire de l’habitation humaine** » conçue par Charles Garnier. On y ajoute des **villages dits indigènes** : environ **quatre cents personnes** venues du Sénégal, du Gabon, de Java, de Nouvelle-Calédonie ou du Tonkin y vivent devant le public pendant six mois, dans des habitations reconstituées, et sont regardées comme une attraction. Cette pratique, courante dans toutes les expositions de l’époque et poursuivie jusqu’à l’Exposition coloniale de 1931, servait à justifier la colonisation en mettant en scène une prétendue hiérarchie des peuples. Elle appartient à l’histoire de 1889 autant que la tour, et elle est aujourd’hui unanimement condamnée.',
      },
      {
        titre: 'Ce qu’il en reste',
        texte:
          'L’exposition ferme le **31 octobre 1889** après avoir reçu **32 millions de visiteurs** en six mois — pour une France de 38 millions d’habitants — et dégagé un bénéfice, chose rare. La tour avait coûté 7,8 millions de francs, dont 1,5 payé par l’État ; elle les a remboursés dès la première saison, avec près de deux millions de visiteurs payants. Sa concession devait s’achever en **1909**, date à laquelle elle serait démontée et vendue à la ferraille. Ce qui l’a sauvée n’est pas le goût, c’est l’**antenne** : à partir de 1903, le capitaine **Gustave Ferrié** y installe des expériences de **télégraphie sans fil**, et l’armée s’aperçoit qu’un mât de trois cents mètres au milieu de Paris est irremplaçable. En 1914, la tour interceptera des messages allemands. Les protestataires de 1887 n’avaient tort que sur un point : la tour se voit bien de partout dans Paris — c’est devenu sa raison d’être.',
      },
    ],
    consequences: [
      'La tour Eiffel, prévue pour vingt ans, reste : la télégraphie sans fil la sauve en 1909 et elle devient le symbole de Paris.',
      'L’exposition dégage un bénéfice : 32 millions d’entrées pour 61 722 exposants.',
      'Le fer et l’acier s’imposent dans l’architecture : gares, halles, grands magasins, ponts.',
      'La « fée électricité » entre dans l’imaginaire : Paris devient la Ville Lumière.',
      'Les « villages indigènes » font école et se retrouvent jusqu’à l’Exposition coloniale de 1931.',
      'Le congrès socialiste international réuni à Paris en juillet 1889 fixe au 1er mai la journée de revendication des huit heures.',
    ],
    chiffres: [
      { valeur: '32 millions', quoi: 'de visiteurs en six mois' },
      { valeur: '300 m', quoi: 'la tour Eiffel, plus haute construction du monde jusqu’en 1930' },
      { valeur: '2 500 000', quoi: 'rivets assemblés pour la tour' },
      { valeur: '115 m', quoi: 'de portée sans un pilier dans la galerie des machines' },
    ],
    chrono: [
      { date: '2 mai 1886', fait: 'Concours lancé pour la tour du Champ-de-Mars.' },
      { date: '28 janvier 1887', fait: 'Premiers coups de pioche des fondations.' },
      { date: '14 février 1887', fait: '*Le Temps* publie la protestation des artistes.' },
      { date: '31 mars 1889', fait: 'Eiffel hisse le drapeau au sommet, à 300 mètres.' },
      { date: '6 mai 1889', fait: 'Ouverture de l’Exposition universelle.' },
      { date: '10 septembre 1889', fait: 'Edison monte à la tour et signe le livre d’or.' },
      { date: '31 octobre 1889', fait: 'Clôture : 32 millions d’entrées.' },
      { date: '1903', fait: 'Ferrié installe la télégraphie sans fil au sommet.' },
      { date: '1909', fait: 'La tour échappe à la démolition grâce à son antenne.' },
      { date: '1910', fait: 'La galerie des machines est démolie.' },
    ],
    leSaisTu:
      'On raconte que Maupassant, l’un des signataires de la protestation, déjeunait souvent au restaurant de la tour : c’était, disait-il, le seul endroit de Paris d’où il ne la voyait pas. L’anecdote est invérifiable — mais la tour, elle, devait bien être démontée en 1909, et c’est une antenne de radio qui l’a sauvée.',
    aRetenir: [
      'L’Exposition universelle de Paris s’ouvre le 6 mai 1889, pour le centenaire de la Révolution française.',
      'La tour Eiffel, haute de 300 mètres, est construite en deux ans et reste la plus haute du monde jusqu’en 1930.',
      'Une protestation d’artistes publiée dans *Le Temps* le 14 février 1887 la traite d’« inutile et monstrueuse ».',
      'L’exposition reçoit 32 millions de visiteurs et met en scène le fer, l’électricité et l’empire colonial.',
      'Elle présente des « villages indigènes » où des personnes venues des colonies sont exhibées devant le public.',
    ],
    mots: [
      {
        mot: 'Exposition universelle',
        sens: 'Grande manifestation internationale où les nations exposent leurs industries, leurs arts et leurs colonies.',
      },
      {
        mot: 'Fée électricité',
        sens: 'Surnom donné à l’électricité vers 1889, quand elle apparaît au public comme une magie moderne.',
      },
      {
        mot: 'Village indigène',
        sens: 'Reconstitution habitée par des personnes venues des colonies et montrée au public comme une attraction.',
      },
      {
        mot: 'Fer puddlé',
        sens: 'Fer affiné au four, matériau de la tour Eiffel, plus souple et plus résistant que la fonte.',
      },
    ],
    lies: [
      'gustave-eiffel',
      'revolution-industrielle',
      'partage-de-l-afrique',
      'jules-ferry',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe et le monde au XIXᵉ siècle',
    tags: [
      'tour Eiffel',
      'Exposition universelle',
      '1889',
      'Champ-de-Mars',
      'galerie des machines',
      'électricité',
      'centenaire',
      'Eiffel',
      'Paris',
      'villages indigènes',
      'Edison',
      'phonographe',
    ],
  },
]
