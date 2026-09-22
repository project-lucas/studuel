// -----------------------------------------------------------------------------
// TEMPS MODERNES — la Renaissance française et les Réformes : Anne de Bretagne,
// Martin Luther, François Ier, Jean Calvin, Catherine de Médicis, Henri IV.
//
// Le siècle où la France se fait : le français devient la langue du droit
// (Villers-Cotterêts, 1539), la Bretagne entre dans le royaume (1532), les
// châteaux de la Loire sortent de terre — et, au même moment, la chrétienté
// d'Occident se brise. Le lot raconte donc les deux mouvements ensemble.
//
// Le ton suit `docs/encyclopedie.md` : les rois et reines sont racontés pour ce
// qu'ils ont bâti et tenu, dans leur temps, sans procès rétrospectif. Luther et
// Calvin sont exposés avec leur théologie expliquée simplement, sans prendre
// parti pour ou contre Rome. Les guerres de Religion sont dites avec gravité et
// précision — la Saint-Barthélemy n'est ni minimisée ni instrumentalisée — et
// Catherine de Médicis avec équité : une régente qui tente de tenir un royaume
// qui se déchire, et non la « reine noire » des pamphlets de son temps.
//
// LA PREMIÈRE CITATION D'UN PORTRAIT EST CELLE QUI S'AFFICHE SUR LA CARTE, et
// l'aperçu y laisse tomber le `qui` (cf. `apercu.ts`) : elle est donc toujours,
// ici, une phrase du personnage lui-même. Les phrases d'un tiers — Michel de
// L'Hospital, Pierre de L'Estoile — viennent ensuite, avec leur auteur.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_TEMPS_MODERNES_RENAISSANCE: Personnage[] = [
  {
    id: 'anne-de-bretagne',
    volet: 'personnages',
    nom: 'Anne de Bretagne',
    surnom: 'la duchesse en sabots',
    dates: '1477 – 1514',
    tri: 1514,
    periode: 'temps-modernes',
    emoji: '💍',
    roles: ['Duchesse de Bretagne', 'Reine de France', 'Mécène'],
    origine: 'Nantes, duché de Bretagne',
    accroche:
      'Deux fois reine de France, elle ne cède jamais sa Bretagne : le duché n’entrera dans le royaume qu’après elle, et par sa fille.',
    citations: [
      {
        texte: 'Plutôt la mort que la souillure.',
        contexte:
          'Devise de l’ordre de l’Hermine, que la duchesse fait sienne ; en latin *Potius mori quam foedari*.',
        sens:
          'L’hermine de son blason préfère mourir que salir sa fourrure blanche. Ce sera sa façon de gouverner : ne rien céder qui la déshonore.',
      },
      {
        texte: 'À ma vie.',
        contexte:
          'Sa devise personnelle, brodée sur ses tentures, peinte sur ses livres et gravée sur ses coffres.',
        sens:
          'Trois mots qui disent un engagement pour la vie entière — envers la Bretagne d’abord, et envers ses deux époux rois de France.',
      },
      {
        texte:
          'En ce petit vaisseau de fin or pur et munde repose ung plus grand cueur que oncque dame eut au monde. Anne fut le nom d’elle, en France deux fois royne, duchesse des Bretons, royalle et souveraine.',
        qui: 'Inscription gravée sur le reliquaire de son cœur, Nantes, 1514',
        contexte:
          'Sur le coffret d’or où son cœur est rapporté en Bretagne, selon sa dernière volonté.',
        sens:
          'Dans ce petit coffret d’or repose un cœur plus grand qu’aucune dame n’en eut jamais : Anne, deux fois reine de France et duchesse des Bretons.',
      },
    ],
    reperes: [
      'Duchesse de Bretagne à 11 ans, en 1488, à la mort de son père François II.',
      'Mariée à Charles VIII en 1491, puis à Louis XII en 1499 : deux fois reine de France.',
      'Le contrat de 1499 lui rend l’administration de son duché — cas unique pour une reine.',
      'Sa cour fait entrer en France les arts de la première Renaissance : livres peints, musiciens, poètes.',
      'Morte à 36 ans à Blois ; son corps à Saint-Denis, son cœur à Nantes dans un reliquaire d’or.',
      'La Bretagne n’entre dans le royaume qu’en 1532, par l’édit d’union, sous François Ier.',
    ],
    recit: [
      {
        titre: 'Onze ans, et un duché convoité',
        texte:
          'La **Bretagne** de 1488 n’est pas française : c’est un **duché** souverain, avec ses États, sa monnaie, son Parlement et une armée. Son duc, **François II**, a passé sa vie à résister à l’emprise du roi de France ; il la perd à la bataille de **Saint-Aubin-du-Cormier**, en juillet 1488, et meurt trois semaines plus tard sans fils. Sa fille Anne a **onze ans**. Elle est couronnée duchesse à Rennes l’année suivante, et se retrouve seule contre une cour de France décidée à récupérer le dernier grand fief du royaume, et contre des barons bretons qui se vendent au plus offrant. Toute l’Europe la demande en mariage : l’Angleterre, l’Autriche, l’Espagne. Épouser Anne, c’est prendre la Bretagne.',
      },
      {
        titre: 'Deux rois, un même duché',
        texte:
          'En 1491, l’armée française met le siège devant **Rennes**. Anne capitule, mais pas sans condition : le **6 décembre 1491**, à Langeais, elle épouse **Charles VIII**, roi de France. Le contrat est dur — si le roi meurt sans héritier, elle devra épouser son successeur, pour que la Bretagne ne s’échappe pas. Charles VIII meurt sept ans plus tard en se cognant la tête contre le linteau d’une porte, au château d’Amboise. Anne a vingt et un ans, elle rentre en Bretagne, rétablit sa chancellerie et sa monnaie — et négocie cette fois d’égale à égal. Le **8 janvier 1499**, elle épouse **Louis XII** en obtenant ce qu’aucune reine n’avait obtenu : elle garde l’**administration de son duché**, qu’elle gouverne par ses propres officiers, et il est convenu que le second enfant du couple héritera de la Bretagne.',
      },
      {
        titre: 'Une cour, des livres, une Renaissance',
        texte:
          'Anne tient une cour qui ne ressemble à aucune autre. Elle réunit autour d’elle une **maison de la reine** de plus de cent demoiselles, qu’elle marie et dote elle-même, et des artistes qu’elle paie : le peintre **Jean Bourdichon**, qui enlumine pendant quinze ans ses *Grandes Heures* — trois cent trente-sept plantes peintes d’après nature, une des premières flores d’Europe —, les poètes **Jean Marot** et Jean Lemaire de Belges, des musiciens, des brodeurs, des orfèvres. Elle commande au sculpteur **Michel Colombe** le tombeau de ses parents, à Nantes : le marbre italien et les formes nouvelles y arrivent avant les guerres d’Italie. Elle bâtit, elle collectionne, elle lit. La **Renaissance française** commence dans son entourage, vingt ans avant Chambord.',
      },
      {
        titre: 'Le cœur à Nantes',
        texte:
          'Anne meurt à **Blois le 9 janvier 1514**, à trente-six ans, épuisée par une dizaine de grossesses dont deux filles seulement ont survécu : **Claude** et Renée. Ses funérailles durent quarante jours — jamais une reine de France n’en avait reçu de pareilles. Son corps repose à **Saint-Denis** avec les rois ; son **cœur**, selon sa volonté, part pour **Nantes** dans un reliquaire d’or, auprès de ses parents. Quelques mois plus tard, sa fille Claude épouse **François d’Angoulême**, qui devient roi l’année suivante sous le nom de François Ier. Le duché passe ainsi à la couronne par les femmes, et l’**édit d’union de 1532** rattache la Bretagne au royaume — en lui garantissant ses privilèges, ses États et ses impôts propres. Anne avait tout fait pour ce délai : sa province entre dans la France sans avoir été conquise.',
      },
    ],
    chrono: [
      { date: '1477', fait: 'Naissance à Nantes, fille du duc François II.' },
      { date: '1488', fait: 'Mort de son père : duchesse de Bretagne à 11 ans.' },
      { date: '1489', fait: 'Couronnement ducal à Rennes.' },
      { date: '6 décembre 1491', fait: 'Mariage avec Charles VIII, à Langeais.' },
      { date: '1498', fait: 'Mort de Charles VIII ; elle regagne la Bretagne.' },
      { date: '8 janvier 1499', fait: 'Mariage avec Louis XII, à Nantes.' },
      { date: '1505', fait: 'Grand voyage à travers ses villes bretonnes.' },
      { date: '9 janvier 1514', fait: 'Mort à Blois, à 36 ans.' },
      { date: '1514', fait: 'Sa fille Claude épouse François d’Angoulême.' },
      { date: '1532', fait: 'Édit d’union : la Bretagne entre dans le royaume.' },
    ],
    leSaisTu:
      'Son cœur a beaucoup voyagé. Enfermé dans un reliquaire d’or à Nantes en 1514, il en est retiré et dispersé sous la Révolution ; le coffret, lui, a fini au musée Dobrée. On l’y a volé en avril 2018 — et retrouvé une semaine plus tard, cabossé mais entier, avant de regagner sa vitrine.',
    aRetenir: [
      'Anne de Bretagne devient duchesse en 1488, à 11 ans, à la mort de son père François II.',
      'Elle épouse Charles VIII en 1491, puis Louis XII en 1499 : elle est deux fois reine de France.',
      'Le contrat de 1499 lui laisse l’administration de son duché, qui reste distinct du royaume.',
      'Elle meurt en 1514 ; sa fille Claude épouse François Ier, et l’édit d’union rattache la Bretagne à la France en 1532.',
      'Sa cour introduit en France les arts de la première Renaissance.',
    ],
    mots: [
      {
        mot: 'Duché',
        sens: 'Territoire gouverné par un duc ou une duchesse, avec ses lois, ses États et parfois sa monnaie.',
      },
      {
        mot: 'Fief',
        sens: 'Terre tenue d’un seigneur plus puissant, à qui l’on doit fidélité et service.',
      },
      {
        mot: 'Édit d’union',
        sens: 'Acte de 1532 rattachant la Bretagne à la couronne de France, en lui gardant ses privilèges.',
      },
    ],
    lies: ['francois-ier', 'catherine-de-medicis', 'louis-xi', 'leonard-de-vinci'],
    niveaux: ['5e'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Bretagne',
      'Nantes',
      'duchesse',
      'hermine',
      'Charles VIII',
      'Louis XII',
      'Langeais',
      'Claude de France',
      'édit d’union',
      'reliquaire',
      'Rennes',
    ],
  },
  {
    id: 'martin-luther',
    volet: 'personnages',
    nom: 'Martin Luther',
    surnom: 'le moine qui rompit avec Rome',
    dates: '1483 – 1546',
    tri: 1546,
    periode: 'temps-modernes',
    emoji: '📜',
    roles: ['Moine augustin', 'Théologien', 'Réformateur'],
    origine: 'Eisleben, Saxe',
    accroche:
      'Un moine allemand attaque le commerce des indulgences en 1517 — et brise en quelques années l’unité chrétienne de l’Occident.',
    citations: [
      {
        texte: 'Me voici. Je ne puis autrement. Que Dieu me soit en aide. Amen.',
        contexte:
          'Devant Charles Quint, à la diète de Worms, le 18 avril 1521, sommé de renier ses livres.',
        sens:
          'C’est la formule que la tradition a retenue, ajoutée par les premières éditions imprimées de la scène. Les actes du procès, eux, conservent la réponse citée juste après.',
        incertaine: true,
      },
      {
        texte:
          'Si l’on ne me convainc pas par le témoignage de l’Écriture ou par des raisons évidentes, je ne puis ni ne veux me rétracter : il n’est ni sûr ni honnête d’agir contre sa conscience.',
        contexte: 'Réponse à la diète de Worms, 18 avril 1521 ; ces mots-là figurent dans les actes.',
        sens:
          'Il ne réclame pas la liberté de penser ce qu’il veut : il dit qu’une conscience liée par la Bible ne peut céder, même devant l’empereur et le pape réunis.',
      },
      {
        texte:
          'Ils prêchent des inventions humaines, ceux qui disent qu’aussitôt que l’argent tinte dans la caisse, l’âme s’envole du purgatoire.',
        contexte:
          'Thèse 27 des 95 thèses, contre le slogan du prédicateur d’indulgences Johann Tetzel, 1517.',
        sens:
          'On promettait aux fidèles de délivrer un mort du purgatoire contre une pièce. Luther dit que personne ne peut vendre cela.',
      },
      {
        texte:
          'En disant “Faites pénitence”, notre Seigneur Jésus-Christ a voulu que la vie entière des fidèles soit une pénitence.',
        contexte: 'Première des 95 thèses, Wittenberg, 31 octobre 1517.',
        sens:
          'La pénitence n’est pas un acte qu’on achète ou qu’on coche : c’est une manière de vivre. Tout le reste découle de cette première phrase.',
      },
    ],
    reperes: [
      'Fils de mineur, devenu moine augustin puis docteur en théologie à Wittenberg en 1512.',
      '31 octobre 1517 : ses 95 thèses attaquent le commerce des indulgences.',
      'Excommunié par Rome en janvier 1521, mis au ban de l’Empire par Charles Quint en mai.',
      'Caché à la Wartburg, il traduit le Nouveau Testament en allemand en onze semaines.',
      'Il enseigne le salut par la foi seule et la seule autorité de l’Écriture.',
      'Marié en 1525 à Katharina von Bora, ancienne religieuse : ils auront six enfants.',
    ],
    recit: [
      {
        titre: 'L’orage, le vœu, le cloître',
        texte:
          'Martin Luther naît en 1483 à **Eisleben**, fils d’un mineur devenu patron de fonderie qui veut faire de lui un juriste. En juillet 1505, surpris par un orage sur la route de Stotternheim, foudroyé de peur, il jure à sainte Anne de se faire moine s’il en réchappe. Quinze jours plus tard il entre chez les **Augustins d’Erfurt**, au désespoir de son père. Ordonné prêtre, docteur en théologie à vingt-neuf ans, professeur à l’université de **Wittenberg**, il est rongé par une question : comment un homme pécheur peut-il tenir devant un Dieu juste ? Il jeûne, il se confesse des heures, rien ne l’apaise. La réponse, il la trouve en préparant son cours sur l’épître aux Romains : « le juste vivra par la foi ». Le salut n’est pas un salaire qu’on gagne ; c’est un don qu’on reçoit. Tout part de là.',
      },
      {
        titre: 'Les 95 thèses',
        texte:
          'Une **indulgence**, c’est la remise par l’Église d’une partie de la peine due pour les péchés. En 1517, on la prêche en Allemagne contre de l’argent, pour financer la reconstruction de la basilique **Saint-Pierre de Rome** et rembourser la dette d’un archevêque. Le dominicain **Johann Tetzel** parcourt la Saxe avec un coffre et une formule qui fait recette. Le **31 octobre 1517**, Luther envoie à son archevêque **95 thèses** en latin, propositions à débattre entre docteurs — et, selon la tradition, les affiche à la porte de l’église du château de Wittenberg. Il n’attaque pas le pape : il attaque un commerce. Mais l’**imprimerie** est passée par là. Traduites en allemand, imprimées, recopiées, les thèses sont lues dans tout l’Empire en quinze jours. Ce qui devait être une querelle d’université devient une affaire publique.',
      },
      {
        titre: 'Worms, 1521 : un moine devant l’Empire',
        texte:
          'Rome réagit lentement, puis brutalement. Après la dispute de Leipzig (1519), où Luther finit par contester l’autorité des conciles, le pape Léon X le menace d’excommunication : Luther brûle publiquement la bulle à Wittenberg en décembre 1520. Il est **excommunié** en janvier 1521. Reste l’Empire. Le jeune empereur **Charles Quint** le convoque à la **diète de Worms** et lui garantit un sauf-conduit. Le 18 avril 1521, devant les princes de l’Empire, sommé de renier ses livres empilés sur une table, il refuse. L’**édit de Worms** le met au ban : il devient un hors-la-loi que chacun peut tuer. Sur le chemin du retour, il est enlevé — par ses amis. Le prince électeur de Saxe, **Frédéric le Sage**, le cache près d’un an au château de la **Wartburg**.',
      },
      {
        titre: 'Ce qu’il enseigne',
        texte:
          'Sa théologie tient en trois affirmations simples. Le **salut par la foi seule** : on n’achète pas le pardon de Dieu, on le reçoit par confiance en lui. L’**Écriture seule** : la Bible est la seule autorité en matière de foi, avant les conciles et les papes — d’où la nécessité que chacun puisse la lire. Le **sacerdoce universel** : tout baptisé est prêtre devant Dieu, ce qui efface la séparation entre clergé et laïcs. Il ne garde que deux sacrements, le baptême et la Cène, au lieu de sept ; il supprime les vœux monastiques, le célibat des prêtres, le culte des saints. Et il traduit : le **Nouveau Testament en allemand** en 1522, écrit à la Wartburg en onze semaines, la **Bible complète en 1534**. Ce texte-là, lu et chanté dans tout le pays, fixera la langue allemande moderne.',
      },
      {
        titre: 'Ce que la rupture entraîne',
        texte:
          'La Réforme lui échappe aussitôt. En 1524-1525, les **paysans** d’Allemagne se soulèvent au nom de l’Évangile ; Luther, qui avait d’abord plaidé leur cause, appelle les princes à écraser la révolte — près de cent mille morts. En 1529, les princes acquis à sa cause **protestent** contre l’interdiction de leur foi : le mot **protestant** est né. La **confession d’Augsbourg** (1530) fixe leur doctrine, et la **paix d’Augsbourg** (1555), neuf ans après sa mort, décidera que chaque prince choisit la religion de ses sujets. Luther meurt à **Eisleben**, sa ville natale, le 18 février 1546. Son œuvre est immense et son ombre aussi : dans ses derniers écrits, en 1543, il tient contre les juifs des propos d’une violence extrême, que les Églises luthériennes ont depuis solennellement désavoués.',
      },
    ],
    chrono: [
      { date: '1483', fait: 'Naissance à Eisleben, en Saxe.' },
      { date: '1505', fait: 'Il entre chez les Augustins d’Erfurt.' },
      { date: '31 octobre 1517', fait: 'Les 95 thèses contre les indulgences.' },
      { date: 'décembre 1520', fait: 'Il brûle publiquement la bulle du pape.' },
      { date: '18 avril 1521', fait: 'Refus de se rétracter à la diète de Worms.' },
      { date: '1522', fait: 'Nouveau Testament en allemand, traduit à la Wartburg.' },
      { date: '1525', fait: 'Guerre des paysans ; mariage avec Katharina von Bora.' },
      { date: '1530', fait: 'Confession d’Augsbourg : la doctrine luthérienne est fixée.' },
      { date: '1534', fait: 'Bible complète en allemand.' },
      { date: '18 février 1546', fait: 'Mort à Eisleben.' },
    ],
    leSaisTu:
      'À la Wartburg, où il vit caché sous le nom de « chevalier Georges », la légende veut qu’il ait jeté son encrier à la tête du diable venu le tourmenter. La tache d’encre sur le mur fut si souvent grattée par les visiteurs, chacun voulant en emporter un morceau, qu’il fallut la repeindre plusieurs fois.',
    aRetenir: [
      'Martin Luther publie ses 95 thèses contre les indulgences le 31 octobre 1517, à Wittenberg.',
      'Il enseigne le salut par la foi seule et la seule autorité de la Bible.',
      'Excommunié en 1521, il refuse de se rétracter devant Charles Quint à la diète de Worms.',
      'Sa traduction de la Bible en allemand (1522-1534) diffuse la Réforme et fixe la langue allemande.',
      'La rupture avec Rome donne naissance au protestantisme ; Luther meurt en 1546.',
    ],
    mots: [
      {
        mot: 'Indulgence',
        sens: 'Remise par l’Église d’une partie de la peine due pour les péchés ; au XVIᵉ siècle, elle s’obtient souvent contre un don d’argent.',
      },
      {
        mot: 'Réforme',
        sens: 'Mouvement du XVIᵉ siècle qui veut ramener l’Église à l’Évangile et qui aboutit à la naissance des Églises protestantes.',
      },
      {
        mot: 'Excommunication',
        sens: 'Sentence qui exclut un chrétien de l’Église et lui interdit les sacrements.',
      },
      {
        mot: 'Diète',
        sens: 'Assemblée des princes et des villes du Saint Empire, réunie autour de l’empereur.',
      },
    ],
    lies: ['jean-calvin', 'reforme-protestante', 'gutenberg', 'invention-de-l-imprimerie'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Réforme',
      'protestant',
      '95 thèses',
      'Wittenberg',
      'Worms',
      'indulgences',
      'Wartburg',
      'Bible en allemand',
      'luthérien',
      'Charles Quint',
      'Tetzel',
    ],
  },
  {
    id: 'francois-ier',
    volet: 'personnages',
    nom: 'François Ier',
    surnom: 'le père des lettres',
    dates: '1494 – 1547',
    tri: 1547,
    periode: 'temps-modernes',
    emoji: '🦎',
    roles: ['Roi de France', 'Mécène de la Renaissance', 'Chevalier de Marignan'],
    origine: 'Cognac, Angoumois',
    accroche:
      'Vainqueur à Marignan à vingt et un ans, il fait du français la langue du droit, appelle Léonard de Vinci en France et bâtit Chambord.',
    citations: [
      {
        texte: 'Tout est perdu, fors l’honneur.',
        contexte:
          'Formule passée en proverbe, tirée de la lettre écrite à sa mère après la défaite de Pavie, en février 1525.',
        sens:
          'La lettre réelle dit : « de toutes choses ne m’est demeuré que l’honneur et la vie qui est sauve ». La formule courte, plus frappante, a été fabriquée longtemps après.',
        incertaine: true,
      },
      {
        texte: 'De toutes choses ne m’est demeuré que l’honneur et la vie qui est sauve.',
        contexte:
          'Lettre à sa mère Louise de Savoie, régente du royaume, écrite après sa capture à Pavie, 1525.',
        sens:
          'Prisonnier de Charles Quint, il annonce le désastre à celle qui gouverne à sa place : l’armée est détruite, le roi est pris, il lui reste l’honneur — et la vie.',
      },
      {
        texte:
          'Nous voulons que tous arrêts et autres actes soient prononcés, enregistrés et délivrés aux parties en langage maternel français, et non autrement.',
        contexte: 'Ordonnance de Villers-Cotterêts, article 111, août 1539.',
        sens:
          'Le latin disparaît des tribunaux et des actes : c’est le premier texte qui fait du français la langue officielle du royaume. Il est encore cité en justice aujourd’hui.',
      },
      {
        texte: 'Nutrisco et extinguo.',
        contexte:
          'Devise du roi, sous la salamandre qui lui sert d’emblème, gravée à Chambord, à Blois et à Fontainebleau.',
        sens:
          '« Je nourris le bon feu et j’éteins le mauvais. » La salamandre traverse les flammes sans brûler : le roi prétend faire de même au milieu des troubles.',
      },
    ],
    reperes: [
      'Roi à 20 ans, en 1515 ; il succède à Louis XII, dont il a épousé la fille Claude.',
      'Vainqueur de Marignan sur les Suisses les 13 et 14 septembre 1515.',
      'Battu et fait prisonnier à Pavie en 1525 : un an de captivité à Madrid.',
      'Ordonnance de Villers-Cotterêts, 1539 : le français devient la langue de la justice.',
      'Il fait venir Léonard de Vinci au Clos-Lucé en 1516 et fonde les lecteurs royaux en 1530.',
      'Chambord, Fontainebleau, la galerie du Louvre : un règne de trente-deux ans de chantiers.',
    ],
    recit: [
      {
        titre: 'Le cousin qui devient roi',
        texte:
          'Rien ne le destinait au trône. Né à **Cognac** en 1494, François d’Angoulême n’est qu’un cousin éloigné du roi ; mais Louis XII n’a pas de fils, et le petit garçon devient l’héritier présomptif. Sa mère **Louise de Savoie**, veuve à dix-neuf ans, l’élève comme « son César » et lui donne les meilleurs maîtres ; sa sœur **Marguerite**, future reine de Navarre et écrivain, sera sa conseillère toute sa vie. En 1514, il épouse **Claude de France**, fille de Louis XII et d’**Anne de Bretagne** — le mariage qui fera entrer la Bretagne dans le royaume. Le **1ᵉʳ janvier 1515**, Louis XII meurt ; François a vingt ans. Il est sacré à Reims trois semaines plus tard et part aussitôt faire la guerre en Italie.',
      },
      {
        titre: 'Marignan, puis Pavie',
        texte:
          'Les **13 et 14 septembre 1515**, à **Marignan**, près de Milan, il affronte les mercenaires suisses réputés invincibles. Deux jours de bataille, une nuit passée l’arme au poing, l’artillerie qui décide de tout : le vieux maréchal Trivulce parlera d’un « combat de géants ». Le soir, le roi se fait armer chevalier par **Bayard**. Mais l’Italie est une plaie ouverte. En 1519, François échoue à se faire élire empereur : c’est **Charles Quint** qui l’emporte, et son empire encercle la France de l’Espagne aux Pays-Bas. Quatre guerres suivront. La pire est **Pavie**, le **24 février 1525** : l’armée française est écrasée, le roi, son cheval tué sous lui, est fait **prisonnier** et emmené à Madrid. Il ne retrouvera la liberté qu’en laissant ses deux fils en otages.',
      },
      {
        titre: 'Le français, langue du royaume',
        texte:
          'En **août 1539**, au château de **Villers-Cotterêts**, le roi signe une ordonnance de 192 articles qui réforme la justice. Deux d’entre eux ont traversé les siècles. L’un impose aux curés de tenir un **registre des baptêmes** : c’est l’ancêtre de l’**état civil**, et le moyen de prouver son âge et son identité. L’autre, l’**article 111**, ordonne que tous les actes de justice soient rédigés « en langage maternel français, et non autrement » : le **latin** quitte les tribunaux, et avec lui le monopole des clercs. Désormais, le sujet du roi peut comprendre le jugement qui le condamne. L’ordonnance de Villers-Cotterêts est le plus ancien texte encore partiellement en vigueur dans le droit français.',
      },
      {
        titre: 'Le roi des arts et des lettres',
        texte:
          'Il rapporte d’Italie plus que des défaites. En 1516, il installe **Léonard de Vinci**, âgé de soixante-quatre ans, au **Clos-Lucé** près d’Amboise, avec une pension et le titre de « premier peintre, ingénieur et architecte du roi » ; Léonard a emporté dans ses bagages trois tableaux, dont *La Joconde*. Le roi fait venir **Rosso** et **Primatice** à **Fontainebleau**, où naît une école de peinture française ; il lance **Chambord** en 1519, quatre cent quarante pièces autour d’un escalier à double révolution ; il fonde en 1530, à la demande de l’humaniste **Guillaume Budé**, les **lecteurs royaux** qui enseignent le grec et l’hébreu hors de l’Université — le futur **Collège de France**. En 1537, il crée le **dépôt légal** : tout livre imprimé doit être remis à la bibliothèque du roi.',
      },
      {
        titre: 'Le royaume et la foi',
        texte:
          'Le règne est aussi celui de la rupture religieuse. François Ier protège d’abord les humanistes et les « évangéliques » que sa sœur Marguerite abrite ; il tolère qu’on discute, il fait traduire. Tout bascule dans la nuit du 17 au 18 octobre 1534 : des affiches violentes contre la messe sont placardées dans Paris, à Amboise, et jusque sur la porte de la chambre du roi. C’est l’**affaire des Placards**. Le roi y voit une atteinte à sa personne et à l’ordre du royaume ; la répression commence, et la France protestante entre dans la clandestinité. En **1545**, il autorise l’expédition contre les **Vaudois du Luberon** : plusieurs villages sont détruits, des centaines de personnes tuées. Il meurt le **31 mars 1547** à Rambouillet, laissant un royaume agrandi, une langue et des châteaux — et un pays qui se divise.',
      },
    ],
    chrono: [
      { date: '1494', fait: 'Naissance à Cognac.' },
      { date: '1ᵉʳ janvier 1515', fait: 'Il succède à Louis XII, son beau-père.' },
      { date: '14 septembre 1515', fait: 'Victoire de Marignan sur les Suisses.' },
      { date: '1516', fait: 'Léonard de Vinci s’installe au Clos-Lucé, à Amboise.' },
      { date: '1519', fait: 'Charles Quint élu empereur ; début du chantier de Chambord.' },
      { date: '24 février 1525', fait: 'Défaite de Pavie : le roi est fait prisonnier.' },
      { date: '1530', fait: 'Fondation des lecteurs royaux, futur Collège de France.' },
      { date: 'octobre 1534', fait: 'Affaire des Placards : la répression commence.' },
      { date: 'août 1539', fait: 'Ordonnance de Villers-Cotterêts.' },
      { date: '31 mars 1547', fait: 'Mort au château de Rambouillet.' },
    ],
    leSaisTu:
      'Si *La Joconde* est à Paris et non à Florence, c’est à lui qu’on le doit. Léonard a passé les Alpes à dos de mulet en 1516 avec le tableau dans ses bagages, et le roi l’a acheté 4 000 écus d’or. Depuis, elle n’a jamais quitté les collections françaises.',
    aRetenir: [
      'François Ier règne de 1515 à 1547 et remporte la bataille de Marignan en septembre 1515.',
      'Battu à Pavie en 1525 par Charles Quint, il est fait prisonnier et emmené à Madrid.',
      'L’ordonnance de Villers-Cotterêts (1539) impose le français dans tous les actes de justice.',
      'Mécène de la Renaissance, il fait venir Léonard de Vinci et bâtir Chambord et Fontainebleau.',
      'Il fonde en 1530 les lecteurs royaux, à l’origine du Collège de France.',
    ],
    mots: [
      {
        mot: 'Mécène',
        sens: 'Personne riche et puissante qui protège et finance des artistes et des savants.',
      },
      {
        mot: 'Ordonnance',
        sens: 'Loi décidée par le roi seul, valable dans tout le royaume.',
      },
      {
        mot: 'Renaissance',
        sens: 'Mouvement né en Italie au XVᵉ siècle qui renouvelle les arts et les savoirs en s’inspirant de l’Antiquité.',
      },
      {
        mot: 'État civil',
        sens: 'Registres officiels des naissances, mariages et décès ; ils commencent avec les registres de baptême de 1539.',
      },
    ],
    lies: [
      'anne-de-bretagne',
      'leonard-de-vinci',
      'bataille-de-marignan',
      'martin-luther',
      'henri-iv',
      'jacques-cartier',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Marignan',
      'Pavie',
      'Villers-Cotterêts',
      'Chambord',
      'Léonard de Vinci',
      'salamandre',
      'Charles Quint',
      'Renaissance',
      'Collège de France',
      'Fontainebleau',
      'Clos-Lucé',
    ],
  },
  {
    id: 'jean-calvin',
    volet: 'personnages',
    nom: 'Jean Calvin',
    surnom: 'le réformateur de Genève',
    dates: '1509 – 1564',
    tri: 1564,
    periode: 'temps-modernes',
    emoji: '📖',
    roles: ['Théologien', 'Réformateur', 'Organisateur de Genève'],
    origine: 'Noyon, Picardie',
    accroche:
      'Un juriste picard écrit à vingt-six ans le grand livre de la Réforme française, puis fait de Genève la capitale d’un protestantisme organisé.',
    citations: [
      {
        texte: 'Mon cœur, je te l’offre, Seigneur, promptement et sincèrement.',
        contexte:
          'Sa devise, qu’il accompagne d’un emblème : une main qui tend un cœur. En latin, *Cor meum tibi offero, Domine, prompte et sincere*.',
        sens:
          'Tout Calvin tient là : la vie chrétienne n’est pas un contrat d’échange avec Dieu, c’est un don de soi, immédiat et sans réserve.',
      },
      {
        texte:
          'Toute la somme de notre sagesse tient en deux parties : connaître Dieu, et nous connaître nous-mêmes.',
        contexte:
          'Première phrase de l’*Institution de la religion chrétienne*, dans sa version française de 1541.',
        sens:
          'C’est le plan du livre entier : on ne comprend pas Dieu sans se comprendre soi-même, ni l’inverse.',
      },
      {
        texte:
          'Nous appelons prédestination le conseil éternel de Dieu, par lequel il a déterminé ce qu’il voulait faire de chaque homme.',
        contexte: '*Institution de la religion chrétienne*, livre III, chapitre 21.',
        sens:
          'Le salut ne se gagne pas : il vient d’une décision de Dieu antérieure à tout mérite. C’est le point le plus discuté de sa doctrine, hier comme aujourd’hui.',
      },
    ],
    reperes: [
      'Fils d’un notaire d’Église de Noyon, formé au droit à Orléans et à Bourges.',
      'Il fuit la France après l’affaire des Placards de 1534 et se réfugie à Bâle.',
      'Publie en 1536 l’Institution de la religion chrétienne, à 26 ans.',
      'La version française de 1541 est l’un des premiers grands livres d’idées écrits en français.',
      'De 1541 à 1564, il organise Genève : ordonnances, consistoire, Académie fondée en 1559.',
      'Sa doctrine gagne la France, l’Écosse, les Pays-Bas et plus tard la Nouvelle-Angleterre.',
    ],
    recit: [
      {
        titre: 'Un juriste qui change de camp',
        texte:
          'Jean Cauvin naît à **Noyon**, en Picardie, en 1509. Son père, notaire du chapitre de la cathédrale, le destine à l’Église, puis change d’avis et l’envoie au **droit**, à Orléans puis à Bourges — formation décisive : Calvin raisonnera toute sa vie en juriste, par articles et par définitions. Humaniste, il publie à vingt-deux ans un commentaire savant de Sénèque. Puis, vers 1533, ce qu’il appellera plus tard une « conversion soudaine » : il passe à la Réforme. Quand son ami Nicolas Cop prononce à Paris un discours jugé hérétique, Calvin doit fuir. L’**affaire des Placards**, en octobre 1534, rend tout retour impossible : il quitte la France pour **Bâle** et ne reviendra jamais.',
      },
      {
        titre: 'L’Institution, 1536',
        texte:
          'À Bâle, à vingt-six ans, il écrit en latin l’*Institution de la religion chrétienne* : six chapitres qui exposent méthodiquement ce que croit un protestant. Le livre s’ouvre sur une lettre adressée à **François Ier**, où Calvin demande au roi d’écouter les accusés avant de les brûler : les évangéliques, dit-il, ne sont ni des séditieux ni des fanatiques. L’ouvrage grossira toute sa vie — quatre-vingts chapitres en 1559. Surtout, Calvin le traduit lui-même : la **version française de 1541** est un événement pour la langue. Une pensée difficile y est dite en phrases claires, ordonnées, sans latin ; avec Rabelais et Montaigne, ce livre est l’un des actes de naissance de la **prose française**.',
      },
      {
        titre: 'Genève, une ville selon l’Évangile',
        texte:
          'De passage à **Genève** en 1536, il est retenu presque de force par le prédicateur **Guillaume Farel**. Chassé deux ans plus tard, rappelé en **1541**, il ne repartira plus. Il rédige aussitôt les **ordonnances ecclésiastiques** : l’Église est dirigée par quatre ministères — pasteurs, docteurs, anciens et diacres —, et un **consistoire** de pasteurs et de laïcs veille sur la doctrine et les mœurs de la ville, pouvant exclure de la Cène. Genève devient un modèle et un refuge : des milliers de protestants français, italiens, anglais y arrivent ; ses imprimeries expédient clandestinement des livres vers la France ; son **Académie**, fondée en 1559 avec **Théodore de Bèze**, forme les pasteurs qui repartent prêcher dans le royaume. On l’appelle la « Rome protestante ».',
      },
      {
        titre: 'Ce qu’il enseigne',
        texte:
          'Comme Luther, Calvin tient le **salut par la foi** et la **seule autorité de l’Écriture**. Il s’en sépare sur trois points. La **prédestination** : Dieu a décidé de toute éternité qui il sauve, et cette décision ne dépend d’aucun mérite — idée dure, mais qui, dans son esprit, libère le croyant de l’angoisse de ne jamais en faire assez. La **Cène** : le pain et le vin ne contiennent pas le corps du Christ, ils le donnent spirituellement à qui croit. L’**organisation** : pas d’évêques, une Église gouvernée par des assemblées d’anciens élus. Le culte est dépouillé — ni images, ni statues, ni reliques —, centré sur la prédication et sur les **psaumes chantés** en français, que les huguenots emporteront jusque sur les champs de bataille.',
      },
      {
        titre: 'Les ombres et l’héritage',
        texte:
          'Genève n’est pas une république tolérante, et son siècle ne l’est nulle part. En 1553, le médecin espagnol **Michel Servet**, qui niait la Trinité et que l’Inquisition catholique poursuivait déjà, est arrêté de passage dans la ville, jugé par le Conseil et **brûlé vif** — Calvin, qui l’avait dénoncé, demanda seulement qu’on lui épargne le bûcher. La condamnation à mort pour hérésie était alors pratiquée par tous les camps ; elle choqua pourtant dès ce moment-là quelques esprits, dont **Sébastien Castellion**, qui écrivit qu’« on ne prouve pas sa foi en brûlant un homme ». Calvin meurt à Genève le **27 mai 1564**. Ses disciples français, les **huguenots**, sont alors près de deux millions, et les guerres de Religion ont commencé depuis deux ans.',
      },
    ],
    chrono: [
      { date: '1509', fait: 'Naissance à Noyon, en Picardie.' },
      { date: '1533', fait: 'Conversion à la Réforme ; il doit quitter Paris.' },
      { date: '1536', fait: 'Institution de la religion chrétienne, publiée à Bâle.' },
      { date: '1538', fait: 'Chassé de Genève, il se réfugie à Strasbourg.' },
      { date: '1541', fait: 'Retour à Genève ; ordonnances ecclésiastiques.' },
      { date: '1541', fait: 'Version française de l’Institution.' },
      { date: '1553', fait: 'Procès et supplice de Michel Servet à Genève.' },
      { date: '1559', fait: 'Fondation de l’Académie de Genève.' },
      { date: '1562', fait: 'Début des guerres de Religion en France.' },
      { date: '27 mai 1564', fait: 'Mort à Genève ; il est enterré sans pierre.' },
    ],
    leSaisTu:
      'Il a voulu disparaître : pas de pierre, pas de nom, pas de cortège. Enterré le 28 mai 1564 au cimetière de Plainpalais, à Genève, Calvin repose à un endroit que personne ne connaît. La dalle qu’on y montre aujourd’hui porte ses initiales et fut posée au XIXᵉ siècle, faute de mieux.',
    aRetenir: [
      'Jean Calvin publie l’Institution de la religion chrétienne en 1536, en français dès 1541.',
      'Il enseigne le salut par la foi, la seule autorité de la Bible et la prédestination.',
      'De 1541 à 1564, il organise Genève : ordonnances, consistoire, Académie fondée en 1559.',
      'Ses disciples français sont appelés huguenots ; sa doctrine gagne l’Écosse et les Pays-Bas.',
      'Il meurt à Genève le 27 mai 1564, deux ans après le début des guerres de Religion.',
    ],
    mots: [
      {
        mot: 'Prédestination',
        sens: 'Idée selon laquelle Dieu a décidé de toute éternité qui sera sauvé, indépendamment des mérites de chacun.',
      },
      {
        mot: 'Consistoire',
        sens: 'Assemblée de pasteurs et d’anciens qui veille, à Genève, sur la doctrine et les mœurs de la ville.',
      },
      {
        mot: 'Huguenot',
        sens: 'Nom donné aux protestants français à partir des années 1560.',
      },
      {
        mot: 'Cène',
        sens: 'Repas du pain et du vin institué par le Christ ; c’est l’un des deux sacrements gardés par les protestants.',
      },
    ],
    lies: [
      'martin-luther',
      'reforme-protestante',
      'catherine-de-medicis',
      'massacre-de-la-saint-barthelemy',
      'henri-iv',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Calvin',
      'Genève',
      'Institution de la religion chrétienne',
      'prédestination',
      'huguenots',
      'Noyon',
      'consistoire',
      'Réforme',
      'protestant',
      'Servet',
      'Théodore de Bèze',
    ],
  },
  {
    id: 'catherine-de-medicis',
    volet: 'personnages',
    nom: 'Catherine de Médicis',
    surnom: 'la reine mère',
    dates: '1519 – 1589',
    tri: 1589,
    periode: 'temps-modernes',
    emoji: '👑',
    roles: ['Reine de France', 'Régente du royaume', 'Mère de trois rois'],
    origine: 'Florence, Toscane',
    accroche:
      'Florentine mariée à quatorze ans, mère de trois rois, elle gouverne trente ans un royaume que la guerre de religion déchire.',
    citations: [
      {
        texte: 'De là viennent mes larmes, de là vient ma douleur.',
        contexte:
          'Devise qu’elle adopte, en latin *Lacrymae hinc, hinc dolor*, après la mort d’Henri II, tué dans un tournoi en 1559.',
        sens:
          'Elle l’accompagne d’un emblème : la lance brisée qui a tué son mari. Veuve à quarante ans, elle portera le noir jusqu’à sa mort.',
      },
      {
        texte:
          'Ôtons ces mots diaboliques, noms de partis, factions et séditions : luthériens, huguenots, papistes. Ne changeons pas le nom de chrétiens.',
        qui: 'Michel de L’Hospital, son chancelier',
        contexte:
          'Discours d’ouverture des états généraux d’Orléans, décembre 1560. C’est le programme de conciliation voulu par la régente.',
        sens:
          'Avant d’être une doctrine, la division est un vocabulaire : effacer les étiquettes pour désarmer les camps. La tentative échouera en dix-huit mois.',
      },
      {
        texte: 'On ne s’en souciait non plus que d’une chèvre morte.',
        qui: 'Pierre de L’Estoile, dans son journal',
        contexte:
          'À la mort de la reine mère, à Blois, en janvier 1589, en pleine crise du royaume.',
        sens:
          'Le mot dit l’indifférence d’un pays à bout de forces, pas le bilan d’un règne : il faudra la publication de ses six mille lettres, au XIXᵉ siècle, pour qu’on la relise en femme d’État.',
      },
    ],
    reperes: [
      'Florentine, nièce d’un pape, mariée à 14 ans au futur Henri II en 1533.',
      'Dix ans sans enfant, puis dix enfants : trois de ses fils seront rois de France.',
      'Veuve en 1559, elle gouverne à partir de 1560 pour Charles IX, âgé de 10 ans.',
      'Édit de Saint-Germain, janvier 1562 : le premier texte accordant un culte aux protestants.',
      'Elle siège au conseil qui décide le coup de force d’août 1572, d’où sort la Saint-Barthélemy.',
      'Morte le 5 janvier 1589, huit mois avant Henri III, dernier roi des Valois.',
    ],
    recit: [
      {
        titre: 'Une orpheline de Florence',
        texte:
          'Née à **Florence** en 1519, Catherine perd ses deux parents avant d’avoir un mois. Élevée par des religieuses, elle est otage de la ville révoltée à onze ans, pendant le siège de 1530 : on parle alors de l’exposer sur les remparts. Son oncle, le pape **Clément VII**, la marie en octobre 1533 au duc d’Orléans, second fils de **François Ier** : elle a quatorze ans, lui aussi. Ce n’est pas un beau parti pour la France — les Médicis sont des banquiers, pas des rois —, et la cour le lui fera sentir longtemps. Elle reste **dix ans sans enfant** sous la menace d’une répudiation, tandis que **Diane de Poitiers** règne sur le cœur de son mari. Puis, à partir de 1544, elle met au monde dix enfants. La mort inattendue du dauphin a fait d’elle, entre-temps, la future reine de France.',
      },
      {
        titre: 'Le tournoi de 1559',
        texte:
          'Le **10 juillet 1559**, **Henri II** meurt après dix jours d’agonie : un éclat de lance lui a crevé l’œil lors d’un tournoi donné pour les noces de sa fille. Tout s’écroule d’un coup. Le royaume est **ruiné** par quarante ans de guerres d’Italie, et la dette dépasse quarante millions de livres. Le nouveau roi, **François II**, a quinze ans : ce sont les **Guise**, oncles de sa femme Marie Stuart, qui gouvernent. Il meurt dix-sept mois plus tard. Le suivant, **Charles IX**, a dix ans. Catherine se fait alors proclamer « gouvernante de France » : une étrangère, veuve, sans armée et sans argent, prend la direction d’un pays où deux partis armés — les catholiques des Guise et les protestants de Condé et Coligny — n’attendent qu’une occasion.',
      },
      {
        titre: 'Tenir un royaume qui se déchire',
        texte:
          'Sa politique est constante : **empêcher la guerre civile** en faisant coexister les deux religions. En 1561, elle organise à **Poissy** un colloque où les théologiens catholiques et le calviniste **Théodore de Bèze** discutent en face à face — du jamais-vu. En **janvier 1562**, l’**édit de Saint-Germain** autorise le culte protestant hors des villes : c’est la première fois qu’un roi de France reconnaît deux religions dans son royaume. Deux mois plus tard, le duc de Guise fait massacrer des fidèles réunis dans une grange à **Wassy**, et la guerre commence. Elle durera trente-six ans. Catherine négocie édit de paix après édit de paix, marie ses enfants pour sceller des alliances, et promène deux ans durant (1564-1566) le jeune roi à travers la France — quatre mille kilomètres pour montrer le souverain à son peuple.',
      },
      {
        titre: 'Août 1572',
        texte:
          'Le **18 août 1572**, elle marie sa fille **Marguerite** au jeune **Henri de Navarre**, chef protestant : ce mariage doit sceller la paix, et Paris, catholique et affamé, le supporte mal. Quatre jours plus tard, l’**amiral de Coligny**, qui pousse Charles IX à la guerre contre l’Espagne, est blessé d’un coup d’arquebuse. L’attentat rate, la ville s’embrase de rumeurs, et dans la nuit du 23 au 24 août le **conseil du roi**, où siège Catherine, décide d’éliminer les chefs huguenots réunis pour les noces. L’ordre part ; il échappe aussitôt à ceux qui l’ont donné. Le massacre gagne la rue, puis la province : environ **trois mille morts à Paris**, plusieurs milliers d’autres dans une dizaine de villes jusqu’en octobre. La part exacte de Catherine dans la décision se discute encore ; sa responsabilité dans le coup de force, non. La **Saint-Barthélemy** a ruiné vingt ans de sa politique de conciliation.',
      },
      {
        titre: 'La reine noire des pamphlets, la femme d’État des archives',
        texte:
          'Après 1572, elle recommence. Elle négocie la paix de Monsieur (1576), repart sur les routes du Midi à près de soixante ans et rencontre son gendre Henri de Navarre à Nérac, puis à Saint-Brice en 1586, pour tenter encore un accord. Pendant ce temps, les pamphlets protestants — le *Discours merveilleux de la vie de Catherine de Médicis* (1575) — inventent la **reine noire** : l’Italienne empoisonneuse, machiavélique, qui aurait tout prémédité. La légende tiendra trois siècles. Elle meurt au château de **Blois** le **5 janvier 1589**, douze jours après l’assassinat du duc de Guise ordonné par son fils. Restent ses chantiers — les **Tuileries**, l’hôtel de Soissons, les fêtes de cour d’où sort le ballet français — et six mille lettres qui montrent une femme travaillant chaque jour à empêcher la guerre qu’elle n’a pas su arrêter.',
      },
    ],
    chrono: [
      { date: '1519', fait: 'Naissance à Florence.' },
      { date: '1533', fait: 'Mariage avec le futur Henri II, à Marseille.' },
      { date: '10 juillet 1559', fait: 'Mort d’Henri II, blessé dans un tournoi.' },
      { date: '1560', fait: 'Mort de François II : elle gouverne pour Charles IX.' },
      { date: '1561', fait: 'Colloque de Poissy : catholiques et protestants face à face.' },
      { date: 'janvier 1562', fait: 'Édit de Saint-Germain : un culte accordé aux protestants.' },
      { date: '1ᵉʳ mars 1562', fait: 'Massacre de Wassy : les guerres de Religion commencent.' },
      { date: '1564-1566', fait: 'Grand tour de France du roi et de la reine mère.' },
      { date: '24 août 1572', fait: 'Massacre de la Saint-Barthélemy.' },
      { date: '1576', fait: 'Paix de Monsieur, négociée par elle.' },
      { date: '5 janvier 1589', fait: 'Mort au château de Blois.' },
    ],
    leSaisTu:
      'Nostradamus, l’auteur des *Centuries*, fut reçu à sa cour en 1555 puis nommé médecin ordinaire du roi ; elle le consulta sur l’avenir de ses fils. Ses ennemis y virent aussitôt la preuve qu’elle pratiquait la magie noire — et le récit de la reine astrologue fit le tour de l’Europe.',
    aRetenir: [
      'Catherine de Médicis, née à Florence en 1519, épouse le futur Henri II en 1533.',
      'Veuve en 1559, elle gouverne à partir de 1560 et exerce le pouvoir sous trois de ses fils.',
      'Elle fait publier l’édit de Saint-Germain en 1562, qui accorde un culte aux protestants.',
      'Le massacre de la Saint-Barthélemy, le 24 août 1572, est décidé par le conseil du roi où elle siège.',
      'Elle meurt le 5 janvier 1589 ; la dynastie des Valois s’éteint la même année avec Henri III.',
    ],
    mots: [
      {
        mot: 'Régente',
        sens: 'Reine qui gouverne au nom d’un roi trop jeune ou empêché de régner seul.',
      },
      {
        mot: 'Édit de pacification',
        sens: 'Texte royal qui met fin à une guerre de Religion en fixant les droits des protestants.',
      },
      {
        mot: 'Valois',
        sens: 'Famille royale qui règne sur la France de 1328 à 1589.',
      },
      {
        mot: 'Pamphlet',
        sens: 'Écrit court et violent qui attaque une personne ou un pouvoir, souvent publié sans nom d’auteur.',
      },
    ],
    lies: [
      'henri-iv',
      'francois-ier',
      'massacre-de-la-saint-barthelemy',
      'edit-de-nantes',
      'jean-calvin',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Médicis',
      'régente',
      'reine mère',
      'Saint-Barthélemy',
      'guerres de Religion',
      'Valois',
      'Charles IX',
      'Henri III',
      'Poissy',
      'Florence',
      'Tuileries',
      'Wassy',
    ],
  },
  {
    id: 'henri-iv',
    volet: 'personnages',
    nom: 'Henri IV',
    surnom: 'le bon roi Henri',
    dates: '1553 – 1610',
    tri: 1610,
    periode: 'temps-modernes',
    emoji: '🕊️',
    roles: ['Roi de France et de Navarre', 'Chef du parti protestant', 'Premier roi Bourbon'],
    origine: 'Pau, Béarn',
    accroche:
      'Chef protestant devenu roi catholique, il met fin à trente-six ans de guerre civile par l’édit de Nantes et relève un royaume ruiné.',
    citations: [
      {
        texte: 'Paris vaut bien une messe.',
        contexte:
          'Phrase prêtée au roi au moment de son abjuration à Saint-Denis, le 25 juillet 1593.',
        sens:
          'Aucune source du temps ne la lui attribue : elle apparaît dans un écrit de 1622, douze ans après sa mort. Elle résume pourtant son calcul — se convertir pour que la capitale lui ouvre ses portes.',
        incertaine: true,
      },
      {
        texte:
          'Je veux qu’il n’y ait si pauvre paysan en mon royaume qu’il n’ait tous les dimanches sa poule dans le pot.',
        contexte:
          'Rapporté par Hardouin de Péréfixe, précepteur de Louis XIV, dans son *Histoire du roy Henry le Grand*, 1661.',
        sens:
          'Le programme d’un règne en une image : que le plus pauvre puisse manger de la viande une fois par semaine. Le mot est rapporté un demi-siècle après sa mort, mais il correspond à sa politique.',
      },
      {
        texte:
          'J’ai fait l’édit, je veux qu’il soit observé. Ce que j’en ai fait est pour le bien de la paix : je l’ai faite au-dehors, je la veux au-dedans.',
        contexte:
          'Aux magistrats du parlement de Paris qui refusaient d’enregistrer l’édit de Nantes, le 7 janvier 1599.',
        sens:
          'La paix avec l’Espagne est signée depuis 1598 ; il exige maintenant la paix civile et l’impose à un parlement hostile. L’édit est enregistré le mois suivant.',
      },
      {
        texte:
          'Ralliez-vous à mon panache blanc : vous le trouverez toujours au chemin de l’honneur et de la victoire.',
        contexte: 'Avant la charge, à la bataille d’Ivry contre la Ligue, le 14 mars 1590.',
        sens:
          'Les plumes blanches de son casque servaient de point de ralliement dans la mêlée. La formulation varie selon les récits, mais la scène est rapportée par les témoins.',
      },
    ],
    reperes: [
      'Élevé en Béarn, dans la religion protestante, par sa mère Jeanne d’Albret.',
      'Marié à Marguerite de Valois le 18 août 1572, six jours avant la Saint-Barthélemy.',
      'Roi de France en 1589, mais il lui faut cinq ans de guerre pour entrer dans Paris.',
      'Abjure le protestantisme le 25 juillet 1593 ; sacré à Chartres en février 1594.',
      'Édit de Nantes, 13 avril 1598 : liberté de conscience et culte protestant encadré.',
      'Assassiné par Ravaillac rue de la Ferronnerie, à Paris, le 14 mai 1610.',
    ],
    recit: [
      {
        titre: 'Un prince béarnais',
        texte:
          'Henri naît à **Pau**, le 13 décembre 1553. Son grand-père le fait élever au château de **Coarraze**, pieds nus et tête nue, parmi les enfants de paysans béarnais : il en gardera l’accent, l’endurance et une familiarité qui déconcertera la cour. Sa mère, **Jeanne d’Albret**, reine de Navarre, fait passer son petit royaume à la **Réforme** et l’élève en protestant. Côté français, il est un **Bourbon**, descendant de Saint Louis à la dixième génération : très loin du trône tant que les fils de Catherine de Médicis vivent — et ils sont quatre. Le destin les emportera tous sans héritier, l’un après l’autre, en vingt-cinq ans.',
      },
      {
        titre: 'Le mariage et le massacre',
        texte:
          'Le **18 août 1572**, il épouse **Marguerite de Valois**, sœur du roi : ce mariage doit réconcilier les deux France. Six jours plus tard, la **Saint-Barthélemy** massacre les chefs protestants venus aux noces. Henri, jeune marié de dix-huit ans, survit parce qu’on lui laisse le choix entre la messe et la mort : il abjure. Il reste ensuite **quatre ans prisonnier de fait** à la cour, surveillé jour et nuit, jouant le prince inoffensif. En février 1576, il s’échappe à la faveur d’une chasse, gagne le Sud-Ouest et revient aussitôt au protestantisme. Il a vingt-deux ans et devient le chef militaire des **huguenots**.',
      },
      {
        titre: 'Le roi sans royaume',
        texte:
          'Le **1ᵉʳ août 1589**, **Henri III**, dernier des Valois, est poignardé par un moine ; en mourant il désigne Henri de Navarre comme son successeur. La loi le fait roi ; la réalité le laisse dehors. Neuf Français sur dix sont catholiques, et la **Ligue**, soutenue par l’Espagne, refuse absolument un roi hérétique. Il lui faut conquérir son royaume : victoires d’**Arques** (1589) et d’**Ivry** (1590), puis le long **siège de Paris**, où la famine tue des dizaines de milliers d’habitants sans faire céder la ville. Henri comprend qu’il ne gagnera pas par les armes. Le **25 juillet 1593**, il abjure solennellement à **Saint-Denis** ; il est sacré à **Chartres** le 27 février 1594, Reims étant aux mains de la Ligue, et entre dans **Paris** le 22 mars, sans combat. Il achète ensuite un à un les chefs ligueurs : trente-deux millions de livres, moins cher que la guerre.',
      },
      {
        titre: 'L’édit de Nantes',
        texte:
          'Le **13 avril 1598**, à Nantes, il signe le texte qui met fin à trente-six ans de guerre civile et à huit guerres de Religion. Ce n’est pas la tolérance au sens d’aujourd’hui : c’est un **traité de paix**, minutieux, déclaré « perpétuel et irrévocable ». Il accorde la **liberté de conscience** dans tout le royaume, le droit de culte là où il existait déjà et dans une ville par bailliage, l’accès à toutes les charges et aux universités, des **chambres mi-parties** dans les parlements où catholiques et protestants jugent ensemble, et environ cent cinquante **places de sûreté** gardées par les huguenots. Le parlement de Paris refuse de l’enregistrer ; Henri convoque les magistrats et le leur impose. L’édit tiendra **quatre-vingt-sept ans**, jusqu’à sa révocation par Louis XIV en 1685.',
      },
      {
        titre: 'Relever le royaume',
        texte:
          'Le pays sort de la guerre exsangue : villages brûlés, terres en friche, dette de trois cents millions de livres. Avec **Sully**, son compagnon huguenot devenu surintendant des finances, Henri rétablit les comptes, allège la **taille** qui pèse sur les paysans, refait les routes et les ponts, creuse le **canal de Briare**, assèche les marais et encourage l’élevage du ver à soie. « Labourage et pâturage sont les deux mamelles de la France », écrit Sully. Le roi bâtit aussi : le **Pont-Neuf**, achevé en 1607, la **place Royale** — aujourd’hui place des Vosges —, la place Dauphine, la Grande Galerie du Louvre. En 1608, **Champlain** fonde **Québec** en son nom. En 1610, le Trésor a une réserve à la Bastille, chose inouïe depuis un siècle.',
      },
      {
        titre: 'Le 14 mai 1610',
        texte:
          'Il avait échappé à une quinzaine d’attentats. Le **14 mai 1610**, son carrosse est bloqué par un encombrement rue de la Ferronnerie, à Paris. **François Ravaillac**, un catholique exalté convaincu que le roi allait faire la guerre au pape, monte sur la roue et le frappe de deux coups de couteau. Henri IV meurt en quelques minutes. La veille, **Marie de Médicis**, sa seconde femme, avait été couronnée ; leur fils **Louis XIII** a huit ans, et la régence recommence. Le roi laisse un royaume pacifié, une monarchie relevée et un souvenir qui grandira : au XVIIIᵉ siècle, quand on voudra dire ce qu’un roi doit être à son peuple, c’est son nom qu’on prononcera — et sa statue sera la première rétablie sur le Pont-Neuf après la Révolution.',
      },
    ],
    chrono: [
      { date: '13 décembre 1553', fait: 'Naissance à Pau, en Béarn.' },
      { date: '18 août 1572', fait: 'Mariage avec Marguerite de Valois, à Paris.' },
      { date: '1ᵉʳ août 1589', fait: 'Mort d’Henri III : il devient roi de France.' },
      { date: '14 mars 1590', fait: 'Victoire d’Ivry sur les armées de la Ligue.' },
      { date: '25 juillet 1593', fait: 'Abjuration du protestantisme à Saint-Denis.' },
      { date: '27 février 1594', fait: 'Sacre à Chartres ; entrée dans Paris le 22 mars.' },
      { date: '13 avril 1598', fait: 'Édit de Nantes ; paix de Vervins avec l’Espagne.' },
      { date: '1604', fait: 'La paulette ; Sully redresse les finances du royaume.' },
      { date: '1608', fait: 'Champlain fonde Québec au nom du roi.' },
      { date: '14 mai 1610', fait: 'Assassiné par Ravaillac, rue de la Ferronnerie.' },
    ],
    leSaisTu:
      'À sa naissance, son grand-père Henri d’Albret lui aurait frotté les lèvres d’une gousse d’ail et fait goûter une goutte de vin de Jurançon, pour lui donner un tempérament de Béarnais. L’enfant fut ensuite élevé à la dure au château de Coarraze, avec les petits paysans du village.',
    aRetenir: [
      'Henri IV, protestant, devient roi de France en 1589 à la mort d’Henri III.',
      'Il abjure le protestantisme le 25 juillet 1593 et est sacré à Chartres en février 1594.',
      'L’édit de Nantes, signé le 13 avril 1598, met fin aux guerres de Religion.',
      'Avec Sully, il rétablit les finances, relance l’agriculture et embellit Paris.',
      'Il est assassiné par Ravaillac le 14 mai 1610 ; son fils Louis XIII a alors 8 ans.',
    ],
    mots: [
      {
        mot: 'Abjuration',
        sens: 'Acte par lequel on renonce publiquement à sa religion.',
      },
      {
        mot: 'Édit',
        sens: 'Loi du roi portant sur une matière précise, qui doit être enregistrée par les parlements pour s’appliquer.',
      },
      {
        mot: 'Ligue',
        sens: 'Parti catholique armé, soutenu par l’Espagne, qui refuse qu’un protestant devienne roi de France.',
      },
      {
        mot: 'Place de sûreté',
        sens: 'Ville que les protestants ont le droit de garder avec une garnison, pour leur propre sécurité.',
      },
    ],
    lies: [
      'catherine-de-medicis',
      'edit-de-nantes',
      'massacre-de-la-saint-barthelemy',
      'revocation-de-l-edit-de-nantes',
      'louis-xiv',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Henri de Navarre',
      'Béarn',
      'édit de Nantes',
      'poule au pot',
      'Ravaillac',
      'Sully',
      'Ivry',
      'Ligue',
      'huguenot',
      'Bourbon',
      'Pont-Neuf',
      'Vert-Galant',
    ],
  },
]
