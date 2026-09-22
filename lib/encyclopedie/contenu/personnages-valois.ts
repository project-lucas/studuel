// -----------------------------------------------------------------------------
// LES VALOIS — le siècle que l'encyclopédie sautait : Philippe VI, Jean le Bon,
// Charles V le Sage, Charles VI, puis Louis XII et Bayard.
//
// Entre `philippe-le-bel` (1314) et `charles-vii` (1461), il manquait cent
// cinquante ans — c'est-à-dire la guerre de Cent Ans vue du côté français :
// Crécy, Poitiers, la reconstruction de Charles V, la maladie de Charles VI, le
// traité de Troyes. Ce lot les remet en place, et ajoute les deux figures par
// lesquelles le règne des Valois entre dans les Temps modernes : le roi que ses
// sujets ont appelé Père du peuple, et le dernier chevalier.
//
// Même patron que `personnages-moyen-age-rois.ts` et même ton : ces rois sont
// racontés DANS LEUR TEMPS. Les défaites sont dites, chiffrées, expliquées ;
// la maladie de Charles VI est décrite sans dérision et sans diagnostic
// rétrospectif ; la parole donnée de Jean le Bon est prise au sérieux. Les
// fiches voisines (`personnages-moyen-age-couronne.ts`) tiennent Philippe
// Auguste, Du Guesclin, Charles VII et Louis XI : on s'y accroche par `lies`
// plutôt que de les répéter.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_VALOIS: Personnage[] = [
  {
    id: 'philippe-vi',
    volet: 'personnages',
    nom: 'Philippe VI',
    surnom: 'le roi trouvé',
    dates: '1293 – 1350',
    tri: 1350,
    periode: 'moyen-age',
    emoji: '🗼',
    roles: ['Roi de France', 'Premier roi de la branche des Valois'],
    origine: 'Maison de Valois, branche cadette des Capétiens',
    accroche:
      'Élu roi par les barons en 1328, il voit un cousin anglais réclamer sa couronne, sa chevalerie tomber à Crécy et la peste emporter un tiers du royaume.',
    citations: [
      {
        texte: 'Ouvrez, ouvrez, châtelain : c’est l’infortuné roi de France.',
        contexte:
          'À la porte du château de la Broye, dans la nuit qui suit Crécy, le 26 août 1346. Rapporté par le chroniqueur Jean le Bel, puis par Froissart.',
        sens:
          'Il a quitté le champ de bataille avec une poignée d’hommes et se nomme lui-même « l’infortuné » : la mort de sa chevalerie est un désastre dont il se sait comptable.',
        incertaine: true,
      },
      {
        texte: 'Nous déclarons le duché de Guyenne commis et confisqué à notre couronne.',
        qui: 'L’arrêt rendu en cour des pairs, le 24 mai 1337',
        contexte:
          'Édouard III, duc de Guyenne, est jugé vassal désobéissant pour avoir accueilli le banni Robert d’Artois. C’est l’acte qui ouvre la guerre de Cent Ans.',
        sens:
          'Le roi ne déclare pas la guerre : il applique le droit féodal à un vassal. La plus longue guerre de notre histoire commence par une procédure.',
      },
      {
        texte: 'Tuez toute cette ribaudaille, car ils nous empêchent la voie sans raison.',
        contexte:
          'À Crécy, le 26 août 1346, en voyant reculer ses arbalétriers génois sous les flèches anglaises. Rapporté par Froissart.',
        sens:
          'Les chevaliers français chargent alors à travers leurs propres arbalétriers. C’est le premier acte du désastre : l’armée se désorganise elle-même avant d’avoir touché l’ennemi.',
        incertaine: true,
      },
      {
        texte: 'Le royaume de France est de trop grande noblesse pour tomber en quenouille.',
        qui: 'Les légistes, résumant l’arrêt des barons de 1328',
        contexte:
          'La formule est fixée au XVᵉ siècle pour justifier l’exclusion des femmes de la couronne — ce qu’on appellera bien plus tard la loi salique.',
        sens:
          '« Tomber en quenouille », c’est passer à une femme. Édouard III d’Angleterre tenait ses droits de sa mère Isabelle : les barons les écartent.',
        incertaine: true,
      },
    ],
    reperes: [
      'Cousin germain des trois derniers Capétiens directs, il est choisi roi par les barons en 1328.',
      'Édouard III d’Angleterre, petit-fils de Philippe le Bel par sa mère, conteste sa couronne.',
      'Victoire de Cassel sur les Flamands dès 1328, puis désastre naval de L’Écluse en 1340.',
      'Crécy, le 26 août 1346 : l’arc long anglais détruit la chevalerie française en un après-midi.',
      'Calais tombe en 1347 après onze mois de siège et restera anglaise deux cent onze ans.',
      'Il achète le Dauphiné en 1349 : depuis, l’héritier du trône s’appelle le dauphin.',
    ],
    recit: [
      {
        titre: 'Le roi trouvé',
        texte:
          'En **1328**, Charles IV meurt sans fils. Sa veuve est enceinte, on attend : elle accouche d’une fille. Pour la première fois depuis trois cent quarante ans, la couronne ne passe pas de père en fils. Deux candidats se présentent : **Édouard III d’Angleterre**, petit-fils de Philippe le Bel par sa mère Isabelle, et **Philippe de Valois**, neveu de Philippe le Bel et cousin germain du roi défunt. Une assemblée de barons et de prélats tranche : la couronne ne se transmet pas par les femmes. Philippe est sacré à **Reims** le 29 mai 1328. On l’appelle « **le roi trouvé** », parce que personne, en le voyant naître, ne l’avait imaginé roi. Trois mois plus tard, à **Cassel**, il écrase les milices flamandes révoltées : le roi trouvé sait se battre, et le royaume le reconnaît.',
      },
      {
        titre: 'La Guyenne confisquée',
        texte:
          'Édouard III rend d’abord l’hommage pour sa **Guyenne**, à Amiens en 1329, puis l’hommage lige en 1331 : il reconnaît Philippe pour son seigneur. Mais tout les oppose. La France soutient l’**Écosse**, que l’Angleterre veut soumettre ; l’Angleterre a besoin de la laine des **Flandres**, dont le comte est l’homme du roi de France ; et la Guyenne, fief anglais en terre française, est une contradiction vivante. Quand Édouard accueille chez lui **Robert d’Artois**, banni du royaume, Philippe VI applique la règle : le **24 mai 1337**, sa cour des pairs déclare le duché « commis et confisqué ». Édouard III répond en prenant le titre de **roi de France** et en écartelant ses armes de fleurs de lys. La **guerre de Cent Ans** commence là, sur un procès de vassalité.',
      },
      {
        titre: 'L’Écluse, Crécy : une guerre qu’on ne connaît pas',
        texte:
          'Le **24 juin 1340**, devant **L’Écluse**, la flotte française est anéantie : la Manche est anglaise pour une génération. Sur terre, Édouard III pratique la **chevauchée**, un raid qui brûle récoltes et villages pour ruiner l’adversaire sans l’affronter. Le **26 août 1346**, à **Crécy**, Philippe VI le rattrape et accepte la bataille. Les **archers gallois** tirent dix à douze flèches à la minute, d’un arc d’if aussi haut qu’un homme ; les arbalétriers génois du roi, cordes mouillées par l’averse, reculent ; la chevalerie française leur passe dessus et charge quinze fois dans la boue montante. Au soir, quinze cents chevaliers sont morts, dont le vieux roi aveugle de Bohême, **Jean l’Aveugle**, qui s’était fait attacher à ses compagnons pour charger avec eux. Le temps où la charge gagnait les batailles est fini. Il faudra un siècle pour en tirer toutes les conséquences.',
      },
      {
        titre: 'Calais, puis la peste',
        texte:
          'Édouard III met aussitôt le siège devant **Calais**, verrou du détroit. La ville tient **onze mois**, puis capitule le 3 août **1347** : six bourgeois en sortent en chemise, la corde au cou et les clefs à la main, et la reine d’Angleterre obtient leur grâce. Calais restera anglaise **deux cent onze ans**. L’année suivante arrive pire que la guerre. La **Grande Peste** entre par Marseille à l’automne 1347, remonte le Rhône, prend Avignon puis Paris à l’été 1348. En deux ans, elle emporte peut-être **un tiers** des habitants du royaume. Les récoltes pourrissent sur pied faute de bras, l’impôt ne rentre plus, des villages entiers disparaissent de la carte. Le roi et le pays sont à terre en même temps.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Il faut pourtant payer. Philippe VI généralise la **gabelle**, l’impôt sur le sel, et modifie sans cesse la valeur de la monnaie — ce qui lui vaut la haine des marchands et le surnom de « roi faux-monnayeur ». Il agrandit malgré tout le royaume : **Montpellier**, achetée au roi de Majorque, et surtout le **Dauphiné**, cédé en **1349** par Humbert II à la condition que ce fief revienne toujours à l’héritier du trône. De là vient le titre de **dauphin**, que le fils aîné du roi de France portera jusqu’en 1830. Philippe VI meurt le **22 août 1350**, à cinquante-sept ans. Il laisse à son fils une guerre mal engagée, un royaume dépeuplé — et une couronne que plus personne, en France, ne songe à lui disputer.',
      },
    ],
    chrono: [
      { date: '1293', fait: 'Naissance, dans la branche cadette des Capétiens.' },
      { date: '1328', fait: 'Sacré à Reims le 29 mai ; victoire de Cassel en août.' },
      { date: '1337', fait: 'Confiscation de la Guyenne, le 24 mai : la guerre commence.' },
      { date: '1340', fait: 'Désastre naval de L’Écluse, le 24 juin.' },
      { date: '1346', fait: 'Défaite de Crécy, le 26 août.' },
      { date: '1347', fait: 'Calais tombe après onze mois de siège.' },
      { date: '1348', fait: 'La Grande Peste ravage le royaume.' },
      { date: '1349', fait: 'Achat du Dauphiné et de Montpellier.' },
      { date: '1350', fait: 'Mort le 22 août, à cinquante-sept ans.' },
    ],
    leSaisTu:
      'Personne n’osait annoncer au roi le désastre de L’Écluse. Son fou s’en chargea : « Ah, les couards d’Anglais ! — Comment cela ? demanda Philippe VI. — Ils n’ont pas eu le courage de sauter à l’eau comme nos braves Français. » Le roi comprit qu’il venait de perdre sa flotte.',
    aRetenir: [
      'Philippe VI de Valois règne de 1328 à 1350 : il est le premier roi de la branche des Valois.',
      'En 1328, les barons écartent Édouard III d’Angleterre parce qu’il tient ses droits par sa mère.',
      'La confiscation du duché de Guyenne, le 24 mai 1337, ouvre la guerre de Cent Ans.',
      'À Crécy, le 26 août 1346, l’arc long anglais écrase la chevalerie française ; Calais tombe en 1347.',
      'La Grande Peste de 1348 emporte environ un tiers de la population du royaume.',
      'L’achat du Dauphiné en 1349 donne son titre au dauphin, héritier du trône de France.',
    ],
    mots: [
      {
        mot: 'Loi salique',
        sens: 'Nom donné au XVᵉ siècle à la règle qui écarte les femmes, et les héritiers par les femmes, de la couronne de France.',
      },
      {
        mot: 'Arc long',
        sens: 'Arc d’if haut comme un homme, tiré par les archers gallois et anglais : dix flèches à la minute, à deux cents pas.',
      },
      {
        mot: 'Gabelle',
        sens: 'Impôt sur le sel : chacun doit acheter sa part au grenier du roi, au prix que le roi fixe.',
      },
    ],
    lies: ['guerre-de-cent-ans', 'grande-peste', 'philippe-le-bel', 'jean-le-bon'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Philippe VI',
      'Valois',
      'Crécy',
      'Calais',
      'L’Écluse',
      'loi salique',
      'Édouard III',
      'Dauphiné',
      'Cassel',
      'gabelle',
      'roi trouvé',
      'guerre de Cent Ans',
    ],
  },
  {
    id: 'jean-le-bon',
    volet: 'personnages',
    nom: 'Jean le Bon',
    surnom: 'le roi qui retourna en prison',
    dates: '1319 – 1364',
    tri: 1364,
    periode: 'moyen-age',
    emoji: '⭐',
    roles: ['Roi de France', 'Fondateur de l’ordre de l’Étoile', 'Prisonnier des Anglais'],
    origine: 'Le Gué de Maulny, près du Mans',
    accroche:
      'Battu et capturé à Poitiers, il passe quatre ans prisonnier à Londres — et quand son fils otage s’évade, il repart se constituer prisonnier à sa place.',
    citations: [
      {
        texte:
          'Si la bonne foi était bannie du reste du monde, il faudrait qu’on la retrouvât dans la bouche des rois.',
        contexte:
          'À son conseil, qui le suppliait de ne pas repartir en Angleterre après l’évasion de son fils otage, fin 1363. La phrase lui est prêtée ; le voyage, lui, est certain.',
        sens:
          'La parole d’un roi est ce qui tient les traités : s’il la reprend, plus aucun accord ne vaut rien. Il s’embarque en janvier 1364 et meurt à Londres trois mois plus tard.',
        incertaine: true,
      },
      {
        texte: 'Père, gardez-vous à droite ! Père, gardez-vous à gauche !',
        qui: 'Philippe, son fils de quatorze ans',
        contexte:
          'À Poitiers, le 19 septembre 1356, tandis que le roi combat à pied, à la hache, dans le dernier carré. Rapporté par les chroniqueurs.',
        sens:
          'L’enfant qui crie les coups à son père y gagne son surnom : il sera Philippe le Hardi, premier duc de Bourgogne de la maison de Valois.',
        incertaine: true,
      },
      {
        texte: 'Monstrant regibus astra viam.',
        qui: 'Devise de l’ordre de l’Étoile, fondé en 1351',
        contexte:
          'Ordre de chevalerie créé par Jean II pour cinq cents chevaliers, sur le modèle de la Table ronde, cinq ans avant Poitiers.',
        sens:
          '« Les astres montrent aux rois leur chemin. » Ses membres juraient de ne jamais fuir de plus de quatre arpents : beaucoup tinrent parole et en moururent.',
      },
      {
        texte: 'Sire, ne faites pas mauvaise chère, si Dieu n’a pas consenti aujourd’hui à votre volonté.',
        qui: 'Le Prince Noir, le soir de Poitiers',
        contexte:
          'Le vainqueur servit lui-même à table le roi prisonnier, debout, refusant de s’asseoir devant lui. Rapporté par Froissart.',
        sens:
          'On se tue le matin et on se salue le soir : dans cette guerre, un prisonnier de sang royal reste un roi, et son vainqueur le traite comme tel.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils de Philippe VI, roi en 1350, il fonde dès 1351 l’ordre de l’Étoile, premier ordre de chevalerie du royaume.',
      'Le 19 septembre 1356, à Poitiers, il est battu et fait prisonnier par le Prince Noir.',
      'Sa rançon est fixée à trois millions d’écus d’or : le royaume mettra des années à la réunir.',
      'Pendant sa captivité, son fils Charles, dauphin à dix-huit ans, affronte Étienne Marcel et la Jacquerie.',
      'Le traité de Brétigny, en 1360, cède un tiers du royaume contre la renonciation d’Édouard III à la couronne.',
      'Il crée le franc en 1360 pour payer sa rançon, et meurt à Londres en 1364, prisonnier volontaire.',
    ],
    recit: [
      {
        titre: 'Un roi élevé dans les romans de chevalerie',
        texte:
          'Il a trente et un ans quand son père meurt, en **1350**. Il a grandi dans le monde des romans de chevalerie et il y croit : dès **1351**, il fonde l’**ordre de l’Étoile**, cinq cents chevaliers réunis à la table du roi sur le modèle de la Table ronde, et qui jurent de ne jamais reculer de plus de quatre arpents devant l’ennemi. Le serment coûtera très cher. Le royaume, lui, va mal : la peste a vidé les campagnes, la monnaie est faible, les assemblées réclament des comptes avant de voter l’impôt. Et son propre gendre, **Charles de Navarre** — que l’on appellera **Charles le Mauvais** —, arrière-petit-fils de Philippe le Bel, réclame la couronne et intrigue avec l’Angleterre. Jean II répond par la force : il fait décapiter son connétable dès 1350, puis arrête Charles de Navarre à sa propre table, à Rouen, en 1356. Ces coups d’autorité lui font des ennemis dans tout le royaume.',
      },
      {
        titre: 'Poitiers, 19 septembre 1356',
        texte:
          'Le **Prince Noir**, fils d’Édouard III, remonte de Bordeaux en chevauchée. Jean II le rattrape près de **Poitiers**, à Maupertuis, avec deux fois plus d’hommes. Mais la leçon de Crécy n’a pas été comprise : le roi fait descendre ses chevaliers de cheval et les envoie à pied, en trois vagues successives, à travers des haies et des vignes, sous le tir des archers. Ses fils aînés sont emmenés hors du champ ; lui reste. Il se bat à la **hache**, dans un dernier carré, avec à ses côtés **Philippe**, son fils de quatorze ans, qui lui crie les coups. Il finit par se rendre à un chevalier d’Artois passé au service anglais. Le soir même, le Prince Noir le sert à table et le traite en souverain. Deux mille chevaliers français sont morts, des centaines d’autres sont prisonniers : le royaume a perdu sa noblesse et son roi le même jour.',
      },
      {
        titre: 'Le royaume sans roi',
        texte:
          'Le **dauphin Charles** a dix-huit ans. Il n’a ni armée, ni argent, ni autorité. Les **États généraux**, menés par le prévôt des marchands de Paris **Étienne Marcel**, exigent de contrôler l’impôt et le gouvernement : c’est la grande ordonnance de **1357**. Le **22 février 1358**, Marcel entre au palais avec la foule et fait tuer sous les yeux du dauphin ses deux maréchaux, puis coiffe le prince d’un chaperon bleu et rouge, aux couleurs de Paris. Le dauphin s’enfuit. Au même moment, les campagnes du Beauvaisis se soulèvent : c’est la **Jacquerie** de mai 1358, deux semaines de fureur paysanne écrasées dans le sang. Marcel, qui a fini par appeler Charles le Mauvais à son secours, est tué par les Parisiens le **31 juillet 1358**. Le dauphin rentre dans sa capitale sans combattre. En deux ans, il a appris le métier qu’il exercera vingt ans.',
      },
      {
        titre: 'Brétigny, la rançon et le franc',
        texte:
          'Édouard III revient en 1359 pour se faire sacrer à **Reims** : la ville lui ferme ses portes et l’hiver ruine son armée. Il négocie. Le **traité de Brétigny**, en mai **1360**, est le plus dur que la France ait signé : elle cède en **pleine souveraineté** l’Aquitaine agrandie, le Poitou, la Saintonge, le Limousin, le Périgord, ainsi que **Calais** et le Ponthieu — près d’un tiers du royaume — et paie **trois millions d’écus d’or**. En échange, Édouard III renonce au titre de roi de France. Pour réunir la première tranche, on frappe le **5 décembre 1360** une monnaie d’or neuve où le roi paraît à cheval, en armes : on l’appelle le **franc**, parce qu’elle rend le roi *franc*, c’est-à-dire libre. La monnaie française en gardera le nom pendant six cent quarante ans.',
      },
      {
        titre: 'Le retour à Londres',
        texte:
          'Des princes et des bourgeois partent en **otages** pour garantir le reste de la rançon, dont deux de ses fils. En **1363**, l’un d’eux, **Louis d’Anjou**, profite d’un congé pour s’évader et rejoindre sa femme. Jean II tient cette évasion pour un déshonneur qui l’atteint personnellement : c’est sa parole, pas celle de son fils, qui a été donnée. Contre l’avis de son conseil, il reprend la mer et se constitue prisonnier à Londres en **janvier 1364**. On l’y reçoit en souverain, au palais de **Savoie**, au bord de la Tamise ; il y tombe malade et meurt le **8 avril 1364**, à quarante-quatre ans. Son corps est rendu à la France et enterré à **Saint-Denis**. L’année précédente, il avait donné le duché de **Bourgogne** en apanage à Philippe le Hardi, l’enfant de Poitiers : un geste de reconnaissance dont ses descendants paieront le prix pendant un siècle.',
      },
    ],
    chrono: [
      { date: '1319', fait: 'Naissance au Gué de Maulny, près du Mans.' },
      { date: '1350', fait: 'Roi de France, le 22 août.' },
      { date: '1351', fait: 'Fondation de l’ordre de l’Étoile.' },
      { date: '19 septembre 1356', fait: 'Défaite de Poitiers : le roi est fait prisonnier.' },
      { date: '1358', fait: 'Étienne Marcel et la Jacquerie, pendant sa captivité.' },
      { date: '1360', fait: 'Traité de Brétigny : rançon de trois millions d’écus.' },
      { date: '5 décembre 1360', fait: 'Création du franc à cheval.' },
      { date: '1363', fait: 'Le duché de Bourgogne donné à Philippe le Hardi.' },
      { date: 'janvier 1364', fait: 'Il retourne volontairement en captivité à Londres.' },
      { date: '8 avril 1364', fait: 'Mort au palais de Savoie, à Londres.' },
    ],
    leSaisTu:
      'Le portrait de Jean le Bon conservé au Louvre est le plus ancien portrait peint indépendant que l’on connaisse au nord des Alpes : un homme de profil sur fond d’or, sans saint, sans scène, sans rien autour de lui. Avant ce panneau, on ne peignait pas quelqu’un pour lui-même.',
    aRetenir: [
      'Jean II le Bon règne de 1350 à 1364 et fonde l’ordre de l’Étoile en 1351.',
      'Le 19 septembre 1356, il est battu et capturé à Poitiers par le Prince Noir.',
      'Le traité de Brétigny, en 1360, cède un tiers du royaume et fixe sa rançon à trois millions d’écus d’or.',
      'Le franc est créé le 5 décembre 1360 pour payer cette rançon.',
      'Pendant sa captivité, le dauphin Charles affronte Étienne Marcel et la Jacquerie.',
      'Après l’évasion de son fils otage, il retourne volontairement en prison et meurt à Londres en 1364.',
    ],
    mots: [
      {
        mot: 'Rançon',
        sens: 'Somme payée pour libérer un prisonnier de guerre ; celle d’un roi se lève sur tout son royaume.',
      },
      {
        mot: 'Otage',
        sens: 'Personne livrée en garantie d’un traité : elle vit librement chez l’ennemi, mais répond de la parole donnée.',
      },
      {
        mot: 'Jacquerie',
        sens: 'Révolte de paysans. Le mot vient de « Jacques Bonhomme », surnom que les nobles donnaient au paysan.',
      },
    ],
    lies: ['philippe-vi', 'charles-v-le-sage', 'guerre-de-cent-ans', 'bertrand-du-guesclin'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Jean II',
      'Poitiers',
      'Prince Noir',
      'Brétigny',
      'rançon',
      'franc',
      'ordre de l’Étoile',
      'Étienne Marcel',
      'Jacquerie',
      'Charles le Mauvais',
      'Londres',
      'guerre de Cent Ans',
    ],
  },
  {
    id: 'charles-v-le-sage',
    volet: 'personnages',
    nom: 'Charles V',
    surnom: 'le Sage',
    dates: '1338 – 1380',
    tri: 1380,
    periode: 'moyen-age',
    emoji: '📚',
    roles: ['Roi de France', 'Bâtisseur de la Bastille', 'Fondateur de la Librairie royale'],
    origine: 'Château de Vincennes, près de Paris',
    accroche:
      'Roi malade et sans épée, il reprend aux Anglais presque tout le terrain perdu, bâtit la Bastille et fonde la bibliothèque des rois de France.',
    citations: [
      {
        texte:
          'Volontiers nous irons à Paris, puisque le roi de France nous y mande — mais ce sera le bassinet en tête et soixante mille hommes en notre compagnie.',
        qui: 'Le Prince Noir, sommé de comparaître devant la cour du roi de France',
        contexte:
          'En janvier 1369 : Charles V rouvre la guerre non par un défi, mais en convoquant le prince anglais comme un vassal ordinaire. Rapporté par Froissart.',
        sens:
          'Toute la méthode du règne tient dans cette convocation : le roi attaque par le droit, se fait juge de son ennemi, et le laisse se mettre dans son tort.',
        incertaine: true,
      },
      {
        texte: 'Le Livre des fais et bonnes meurs du sage roy Charles V.',
        qui: 'Christine de Pizan, titre de la biographie qu’elle lui consacre en 1404',
        contexte:
          'Elle avait grandi à sa cour, où son père était l’astrologue du roi. C’est elle qui fixe pour toujours le surnom de « Sage ».',
        sens:
          '« Sage » ne veut pas dire calme : c’est le latin sapiens, savant et avisé. Le surnom lui vient de ses livres autant que de son gouvernement.',
      },
      {
        texte: 'Le roi de France est majeur à quatorze ans.',
        qui: 'L’ordonnance d’août 1374 sur la majorité des rois',
        contexte:
          'Charles V se sait mourant et son aîné a six ans : il fixe par avance l’âge auquel un roi gouverne seul, et règle la garde de ses enfants.',
        sens:
          'Il légifère sur sa propre mort. C’est la première fois qu’un roi de France organise à l’avance ce qui se passera quand il ne sera plus là.',
      },
      {
        texte: 'Nous abolissons les fouages par tout notre royaume.',
        qui: 'L’ordonnance dictée sur son lit de mort, le 16 septembre 1380',
        contexte:
          'Le roi meurt en supprimant l’impôt par feu qu’il avait lui-même rendu régulier, disant vouloir décharger sa conscience envers ses sujets.',
        sens:
          'Il a bâti l’État sur l’impôt permanent et il meurt en se reprochant son poids. Ses successeurs le rétabliront huit ans plus tard.',
      },
    ],
    reperes: [
      'Premier héritier du trône à porter le titre de dauphin ; régent à dix-huit ans pendant la captivité de son père.',
      'Roi en 1364, sacré à Reims le 19 mai, trois jours après la victoire de Cocherel.',
      'Il fait de Du Guesclin son connétable et refuse la bataille rangée : en six ans, presque tout est repris.',
      'Il bâtit la Bastille, achève l’enceinte de Paris et transforme la forteresse du Louvre en palais.',
      'Sa Librairie du Louvre compte 917 manuscrits à sa mort : c’est l’ancêtre de la Bibliothèque nationale.',
      'Il rend l’impôt régulier et paie ses troupes au mois : la guerre cesse d’être une affaire de vassaux.',
    ],
    recit: [
      {
        titre: 'L’apprentissage d’un régent',
        texte:
          'Né à **Vincennes** en **1338**, il est le premier fils de roi à porter le titre de **dauphin**, puisque son grand-père venait d’acheter le Dauphiné. À dix-huit ans, la défaite de **Poitiers** lui laisse un royaume sans roi, sans armée et sans argent. Il affronte les **États généraux** d’**Étienne Marcel**, voit assassiner ses deux maréchaux sous ses yeux, fuit Paris, traverse la **Jacquerie**, puis revient prendre sa capitale sans verser une goutte de sang. Il négocie **Brétigny**, lève la rançon de son père, gouverne huit ans comme lieutenant puis comme régent. Quand il devient roi, en **1364**, il a vingt-six ans et il a déjà tout appris : ce qu’un royaume supporte, ce qu’un impôt rapporte, et ce que coûte une bataille rangée.',
      },
      {
        titre: 'Un roi qui ne monte pas à cheval',
        texte:
          'Il est maigre, pâle, la main droite enflée depuis une tentative d’empoisonnement en 1359 ; il porte au bras une fistule dont les médecins lui ont dit qu’il mourrait quinze jours après qu’elle se serait tarie. Il ne commandera jamais une armée. Il gouverne assis, entouré d’hommes choisis pour leur compétence : le chancelier **Pierre d’Orgemont**, les frères **Dormans**, et surtout **Nicole Oresme**, savant et traducteur, qui lui met **Aristote** en français. Sa méthode est celle d’un juriste. En **1369**, quand les seigneurs de Gascogne se plaignent des impôts du **Prince Noir**, il ne déclare pas la guerre : il accepte leur appel, se déclare juge de son adversaire et le convoque devant sa cour. Le prince anglais répond qu’il viendra en armes. La guerre reprend — et cette fois, c’est l’Angleterre qui est dans son tort.',
      },
      {
        titre: 'Reprendre le royaume sans livrer bataille',
        texte:
          'La stratégie est arrêtée avec **Bertrand du Guesclin**, fait **connétable** en 1370 : ne jamais accepter la bataille rangée, laisser passer les **chevauchées** anglaises en vidant devant elles les campagnes et en fermant les villes, reprendre les places une à une. La formule qu’on lui prête résume la méthode : mieux vaut pays pillé que pays perdu. Il achète aussi ce qu’il n’a pas besoin de conquérir — des capitaines, des garnisons, des châteaux. Et il crée une **marine** : le **Clos des Galées**, chantier royal de Rouen, construit les navires, et l’amiral **Jean de Vienne** brûle les ports anglais de la Manche en 1377. En **1375**, la trêve de Bruges constate le résultat : du tiers de royaume perdu à Brétigny, l’Angleterre ne garde plus que **Calais, Bordeaux, Bayonne, Cherbourg et Brest**.',
      },
      {
        titre: 'L’argent, et une armée qu’on paie',
        texte:
          'Rien de tout cela n’est possible sans un revenu régulier. Charles V pérennise les **aides** — taxes sur les ventes, le sel, le vin — et le **fouage**, un impôt levé par feu, c’est-à-dire par foyer, chaque année, sans qu’il faille réunir les États pour le voter. Avec cet argent, il **solde** ses troupes : les compagnies sont payées au mois, passées en **montre** — on compte les hommes, on vérifie les armes — et commandées par des capitaines nommés par le roi. Ce n’est plus l’armée féodale, où chaque vassal venait quarante jours avec ses gens ; ce n’est pas encore l’armée permanente que **Charles VII** fixera en 1445 ; c’est l’étape entre les deux, et elle est décisive. Les ordonnances militaires de **1373** vont jusqu’à dire comment marcher, camper et loger sans piller le pays qu’on défend.',
      },
      {
        titre: 'Paris de pierre',
        texte:
          'Il n’aime pas le Palais de la Cité, où l’on a tué ses maréchaux devant lui. Il s’installe à l’**hôtel Saint-Pol**, au bord de la Seine, fait de la vieille forteresse du **Louvre** un palais habitable — fenêtres percées, jardins, un grand escalier à vis sculpté par **Raymond du Temple** —, achève le donjon de **Vincennes** et sa sainte chapelle. Surtout, il ferme Paris : l’**enceinte** de la rive droite est poussée plus loin, avec fossé et bastilles, et le **22 avril 1370**, le prévôt **Hugues Aubriot** pose la première pierre d’un ouvrage à huit tours qui garde la porte Saint-Antoine. On l’appelle la **bastille** Saint-Antoine, du mot qui désignait alors un petit fort. Quatre cent dix-neuf ans plus tard, une foule parisienne viendra la démolir.',
      },
      {
        titre: 'La librairie du roi',
        texte:
          'Dans la **tour de la Fauconnerie** du Louvre, il fait aménager trois étages lambrissés, vitrés et chauffés, et y réunit ses livres. En **1373**, son garde **Gilles Malet** en dresse l’inventaire ; à la mort du roi, on y compte **917 manuscrits** — une collection sans équivalent en Europe. Un lustre d’argent et trente chandeliers y brûlent la nuit, pour qu’on puisse y lire à toute heure. Il ne les collectionne pas : il les fait **traduire en français** — Aristote, saint Augustin, Tite-Live, Végèce — afin que ceux qui gouvernent lisent dans leur langue. Cette librairie est l’ancêtre de la **Bibliothèque nationale de France**. Charles V meurt le **16 septembre 1380** au château de Beauté, à quarante-deux ans, après avoir aboli d’un dernier acte l’impôt qu’il avait établi. Son fils a douze ans.',
      },
    ],
    chrono: [
      { date: '1338', fait: 'Naissance au château de Vincennes, le 21 janvier.' },
      { date: '1356', fait: 'Poitiers : à dix-huit ans, il gouverne un royaume sans roi.' },
      { date: '1358', fait: 'Étienne Marcel et la Jacquerie ; il reprend Paris.' },
      { date: '1364', fait: 'Roi le 8 avril ; sacré à Reims le 19 mai.' },
      { date: '1369', fait: 'Il convoque le Prince Noir devant sa cour : la guerre reprend.' },
      { date: '1370', fait: 'Du Guesclin connétable ; première pierre de la Bastille, le 22 avril.' },
      { date: '1373', fait: 'Inventaire de la Librairie du Louvre ; ordonnances militaires.' },
      { date: '1374', fait: 'Ordonnance fixant la majorité des rois à quatorze ans.' },
      { date: '1375', fait: 'Trêve de Bruges : presque tout le royaume est repris.' },
      { date: '1377', fait: 'Jean de Vienne brûle les ports anglais de la Manche.' },
      { date: '1380', fait: 'Mort au château de Beauté, le 16 septembre.' },
    ],
    leSaisTu:
      'Sa bibliothèque se lisait la nuit. Dans la tour de la Fauconnerie, un lustre d’argent et trente petits chandeliers restaient allumés pour qu’on puisse consulter les livres à n’importe quelle heure. Les murs étaient lambrissés de bois pour tenir l’humidité loin des parchemins : c’est la première salle de lecture chauffée du royaume.',
    aRetenir: [
      'Charles V le Sage règne de 1364 à 1380 ; il gouverne déjà dès 1356, pendant la captivité de son père.',
      'Avec Du Guesclin, connétable en 1370, il refuse la bataille rangée et reprend presque tout le terrain perdu à Brétigny.',
      'Il rend l’impôt régulier — aides et fouage — et paie ses troupes au mois : c’est la première armée soldée du royaume.',
      'Il fait poser la première pierre de la Bastille le 22 avril 1370 et achève l’enceinte de Paris.',
      'Sa Librairie du Louvre compte 917 manuscrits en 1380 : c’est l’ancêtre de la Bibliothèque nationale de France.',
      'Il fait traduire Aristote en français par Nicole Oresme et meurt en 1380 en abolissant le fouage.',
    ],
    mots: [
      {
        mot: 'Fouage',
        sens: 'Impôt levé par « feu », c’est-à-dire par foyer : chaque ménage paie sa part, qu’il soit riche ou pauvre.',
      },
      {
        mot: 'Aides',
        sens: 'Taxes indirectes sur les ventes — sel, vin, marchandises — que le roi lève sans réunir les États.',
      },
      {
        mot: 'Montre',
        sens: 'Revue où l’on compte les soldats d’une compagnie et vérifie leurs armes avant de les payer.',
      },
      {
        mot: 'Librairie',
        sens: 'Nom médiéval de la bibliothèque : le lieu où l’on garde les livres, et non la boutique où on les vend.',
      },
    ],
    lies: [
      'bertrand-du-guesclin',
      'jean-le-bon',
      'charles-vi',
      'christine-de-pizan',
      'guerre-de-cent-ans',
    ],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Charles V',
      'le Sage',
      'Bastille',
      'Librairie du Louvre',
      'Du Guesclin',
      'fouage',
      'Nicole Oresme',
      'Vincennes',
      'dauphin',
      'Christine de Pizan',
      'armée soldée',
      'Jean de Vienne',
      'guerre de Cent Ans',
    ],
  },
  {
    id: 'charles-vi',
    volet: 'personnages',
    nom: 'Charles VI',
    surnom: 'le Bien-Aimé',
    dates: '1368 – 1422',
    tri: 1422,
    periode: 'moyen-age',
    emoji: '🃏',
    roles: ['Roi de France', 'Fils de Charles V'],
    origine: 'Hôtel Saint-Pol, à Paris',
    accroche:
      'Roi à onze ans et adoré de son peuple, il est frappé à vingt-quatre ans d’un mal qui reviendra toute sa vie — et le royaume se déchire autour de lui.',
    citations: [
      {
        texte: 'Arrête, noble roi ! Tu es trahi.',
        qui: 'Un inconnu surgi devant son cheval',
        contexte:
          'À la lisière de la forêt du Mans, le 5 août 1392, par une chaleur écrasante. Rapporté par Froissart et par le chroniqueur de Saint-Denis.',
        sens:
          'Peu après, le choc d’une lance contre un casque réveille le roi assoupi : il tire l’épée et frappe ses propres compagnons. C’est la première crise.',
      },
      {
        texte:
          'Après notre décès, la couronne et le royaume de France demeureront à notre fils le roi Henri et à ses héritiers.',
        qui: 'Le traité de Troyes, 21 mai 1420',
        contexte:
          'Signé au nom d’un roi hors d’état de gouverner. Henri V d’Angleterre épouse sa fille Catherine, devient régent, et le dauphin Charles est écarté.',
        sens:
          'Aucun traité n’a autant coûté à la France : pour neuf ans, le roi d’Angleterre est l’héritier légitime du trône. Il faudra Jeanne d’Arc pour le défaire.',
      },
      {
        texte: 'J’ai fait faire ce qui a été fait, par le diable qui m’y a tenté.',
        qui: 'Jean sans Peur, duc de Bourgogne',
        contexte:
          'Aveu du meurtre de Louis d’Orléans, frère du roi, tué rue Vieille-du-Temple le 23 novembre 1407. Rapporté par les chroniqueurs ; le duc quitte Paris le lendemain.',
        sens:
          'Le cousin du roi fait assassiner le frère du roi et l’avoue. Le royaume n’a plus d’arbitre : la guerre civile des Armagnacs et des Bourguignons commence là.',
      },
      {
        texte:
          'Ah, très cher prince, jamais n’aurons si bon ; jamais ne te verrons. Maudite soit la mort ! Jamais n’aurons que guerre, puisque tu nous as laissés.',
        qui: 'Le peuple de Paris, au passage du convoi funèbre',
        contexte:
          'Rapporté par le Journal d’un bourgeois de Paris, le 11 novembre 1422, dans une ville occupée par les Anglais depuis quatre ans.',
        sens:
          'Trente ans de maladie et de guerre civile n’avaient pas défait l’affection du royaume pour lui. Ses sujets pleurent moins un gouvernement qu’un père.',
      },
    ],
    reperes: [
      'Roi à onze ans, en 1380 ; ses oncles gouvernent et lèvent des impôts qui soulèvent les villes.',
      'Il prend le pouvoir à vingt ans, en 1388, rappelle les conseillers de son père et devient le Bien-Aimé.',
      'Le 5 août 1392, dans la forêt du Mans, une première crise le saisit ; il en connaîtra une quarantaine.',
      'Son frère Louis d’Orléans et son cousin Jean sans Peur se disputent le pouvoir : Armagnacs contre Bourguignons.',
      'Azincourt, le 25 octobre 1415, détruit une seconde fois la noblesse française.',
      'Le traité de Troyes, en 1420, fait du roi d’Angleterre l’héritier du trône de France.',
    ],
    recit: [
      {
        titre: 'Le roi de onze ans',
        texte:
          'Charles V meurt en **1380** en laissant un fils de douze ans et un royaume debout. Les oncles du jeune roi — les ducs d’**Anjou**, de **Berry**, de **Bourgogne** et de Bourbon — gouvernent pour lui, et gouvernent pour eux : ils vident le trésor, rétablissent les impôts que le roi mourant avait abolis, et les villes se soulèvent. Ce sont les **Maillotins** à Paris, la Harelle à Rouen, les tisserands de Flandre écrasés à **Roosebeke** en 1382. En **1388**, à vingt ans, Charles VI remercie ses oncles et rappelle les conseillers de son père, que les princes surnomment par mépris les **Marmousets**. Quatre années suivent, ordonnées et populaires : les comptes sont tenus, la justice réformée, la paix cherchée avec l’Angleterre. C’est alors qu’on l’appelle **le Bien-Aimé**.',
      },
      {
        titre: 'La forêt du Mans, 5 août 1392',
        texte:
          'Il chevauche vers la Bretagne pour châtier Pierre de Craon, qui vient de tenter d’assassiner son connétable **Olivier de Clisson**. Il fait une chaleur de plomb et le roi est fiévreux depuis des jours. À la sortie de la forêt du **Mans**, un homme en haillons surgit, saisit la bride de son cheval et lui crie qu’on le trahit. Plus loin, une lance heurte un casque ; le roi tire son épée, ne reconnaît plus personne et frappe autour de lui. On le désarme, on le ramène évanoui. Il a vingt-quatre ans. Les crises reviendront une quarantaine de fois en trente ans, séparées de longs mois de pleine lucidité pendant lesquels il gouverne, signe et reçoit. De quoi souffrait-il ? On ne le sait pas : médecins et historiens d’aujourd’hui refusent de diagnostiquer à six siècles de distance, sur des descriptions de chroniqueurs. On sait seulement ce qui a été vu.',
      },
      {
        titre: 'Les années de nuit',
        texte:
          'Le **28 janvier 1393**, pour distraire le roi, on organise à l’hôtel Saint-Pol une mascarade : six danseurs cousus dans des costumes de sauvages enduits de poix et d’étoupe. Une torche approche ; quatre d’entre eux brûlent vifs. Le roi, tiré à l’écart par la duchesse de Berry qui l’enveloppe dans sa robe, en réchappe. On appellera cette nuit le **bal des Ardents**. Pendant ses crises, il lui arrive de ne plus reconnaître la reine **Isabeau de Bavière** ni ses enfants, de refuser qu’on le touche, de rester des semaines sans se laisser soigner. On essaie les pèlerinages, les médecins, les saignées, les charlatans. Puis il redevient un roi lucide et courtois, qui sait ce qui lui arrive et qui redoute la crise suivante — et c’est peut-être le plus dur. La France n’a pas eu un roi fou : elle a eu un roi malade, par intervalles, pendant trente ans.',
      },
      {
        titre: 'Armagnacs et Bourguignons',
        texte:
          'Quand le roi n’est pas là, le pouvoir est vacant, et deux hommes s’en saisissent : son frère **Louis d’Orléans**, brillant et dépensier, et son cousin **Jean sans Peur**, duc de **Bourgogne**, maître des Flandres et de leurs richesses. Le **23 novembre 1407**, rue Vieille-du-Temple, des hommes masqués abattent Louis d’Orléans à coups de hache. Jean sans Peur avoue, s’enfuit, puis revient avec un théologien, **Jean Petit**, qui soutient publiquement que tuer un tyran est un acte vertueux. Le fils de la victime, **Charles d’Orléans**, épouse la fille du comte d’**Armagnac** : les deux partis ont désormais leurs noms. Chacun s’allie aux Anglais tour à tour, lève des troupes, massacre dans Paris. En 1413, les bouchers **cabochiens** tiennent la capitale. Le royaume se fait la guerre à lui-même pendant que l’Angleterre regarde et compte.',
      },
      {
        titre: 'Azincourt, puis Troyes',
        texte:
          '**Henri V** débarque en 1415. Le **25 octobre**, à **Azincourt**, une armée française bien plus nombreuse s’entasse dans un champ labouré détrempé, entre deux bois qui empêchent tout déploiement : les archers anglais et la boue font le reste. Des milliers de chevaliers y restent ; Charles d’Orléans, le prince poète, part pour vingt-cinq ans de captivité. La Normandie tombe. En 1418, les Bourguignons prennent Paris et y massacrent les Armagnacs. Le **10 septembre 1419**, sur le pont de **Montereau**, Jean sans Peur est tué au cours d’une entrevue avec le dauphin : son fils **Philippe le Bon** jette aussitôt la Bourgogne dans l’alliance anglaise. Le **21 mai 1420**, le **traité de Troyes** marie Henri V à Catherine de France, le fait régent et héritier du royaume, et écarte le dauphin. Le roi malade y appose son sceau.',
      },
      {
        titre: 'Novembre 1422',
        texte:
          'Henri V meurt le 31 août **1422**, à trente-cinq ans, emporté par la dysenterie. Charles VI lui survit sept semaines et s’éteint à l’**hôtel Saint-Pol** le **21 octobre**, à cinquante-trois ans. Le 11 novembre, son convoi traverse Paris jusqu’à **Saint-Denis**. Un bourgeois de la ville note ce que criait la foule sur son passage, et c’est le témoignage le plus émouvant que l’on ait sur ce règne : un peuple qui n’avait connu de ce roi que des malheurs le pleurait quand même. Derrière le cercueil marchait le duc de **Bedford**, régent anglais, seul prince à suivre le deuil. Le fils écarté, lui, se proclamera roi à Mehun-sur-Yèvre. Il faudra sept ans et une fille de Domrémy pour défaire le traité de Troyes.',
      },
    ],
    chrono: [
      { date: '1368', fait: 'Naissance à l’hôtel Saint-Pol, à Paris.' },
      { date: '1380', fait: 'Roi à onze ans ; ses oncles gouvernent pour lui.' },
      { date: '1388', fait: 'Il prend le pouvoir et rappelle les conseillers de son père.' },
      { date: '5 août 1392', fait: 'Première crise, à la sortie de la forêt du Mans.' },
      { date: '1393', fait: 'Le bal des Ardents, à l’hôtel Saint-Pol.' },
      { date: '1407', fait: 'Louis d’Orléans assassiné sur ordre de Jean sans Peur.' },
      { date: '1415', fait: 'Défaite d’Azincourt, le 25 octobre.' },
      { date: '1418', fait: 'Les Bourguignons prennent Paris.' },
      { date: '1419', fait: 'Jean sans Peur tué sur le pont de Montereau.' },
      { date: '1420', fait: 'Traité de Troyes : Henri V devient héritier de France.' },
      { date: '1422', fait: 'Mort à Paris, le 21 octobre.' },
    ],
    leSaisTu:
      'Un peintre de la cour, Jacquemin Gringonneur, reçut en 1392 cinquante-six sols parisis « pour trois jeux de cartes à or et à diverses couleurs, pour l’ébattement du roi ». C’est la première mention comptable des cartes à jouer en France : on les avait fait peindre pour occuper Charles VI entre deux crises.',
    aRetenir: [
      'Charles VI règne de 1380 à 1422 ; il gouverne lui-même à partir de 1388 et reçoit le surnom de Bien-Aimé.',
      'Le 5 août 1392, dans la forêt du Mans, commence la maladie qui le frappera une quarantaine de fois.',
      'L’assassinat de Louis d’Orléans, en 1407, ouvre la guerre civile entre Armagnacs et Bourguignons.',
      'La défaite d’Azincourt, le 25 octobre 1415, anéantit une génération de la noblesse française.',
      'Le traité de Troyes, le 21 mai 1420, fait d’Henri V d’Angleterre l’héritier du trône et écarte le dauphin.',
      'À sa mort, en 1422, la France a deux rois : le petit Henri VI à Paris et Charles VII à Bourges.',
    ],
    mots: [
      {
        mot: 'Armagnacs',
        sens: 'Parti du duc d’Orléans, nommé d’après le comte d’Armagnac, beau-père de Charles d’Orléans.',
      },
      {
        mot: 'Bourguignons',
        sens: 'Parti du duc de Bourgogne, appuyé sur les Flandres, sur Paris et, à partir de 1419, sur l’Angleterre.',
      },
      {
        mot: 'Hôtel',
        sens: 'Au Moyen Âge, grande demeure urbaine d’un prince : l’hôtel Saint-Pol était la résidence du roi à Paris.',
      },
    ],
    lies: ['charles-v-le-sage', 'charles-vii', 'jeanne-d-arc', 'guerre-de-cent-ans'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Charles VI',
      'le Bien-Aimé',
      'forêt du Mans',
      'bal des Ardents',
      'Armagnacs',
      'Bourguignons',
      'Azincourt',
      'traité de Troyes',
      'Jean sans Peur',
      'Isabeau de Bavière',
      'hôtel Saint-Pol',
      'Montereau',
      'guerre de Cent Ans',
    ],
  },
  {
    id: 'louis-xii',
    volet: 'personnages',
    nom: 'Louis XII',
    surnom: 'le Père du peuple',
    dates: '1462 – 1515',
    tri: 1515,
    periode: 'temps-modernes',
    emoji: '🦔',
    roles: ['Roi de France', 'Duc d’Orléans', 'Duc de Milan'],
    origine: 'Blois, en Orléanais',
    accroche:
      'Emprisonné trois ans par le pouvoir royal puis devenu roi, il ne se venge de personne, fait baisser la taille et reçoit de ses sujets un titre unique.',
    citations: [
      {
        texte: 'Le roi de France ne venge point les injures du duc d’Orléans.',
        contexte:
          'Prêtée à Louis XII à son avènement, en 1498, devant ceux qui l’avaient combattu et emprisonné quand il n’était encore que duc d’Orléans.',
        sens:
          'Le roi est une fonction, pas une personne : ce qu’on a fait à l’homme ne regarde pas la couronne. La phrase n’est pas assurée ; la conduite, elle, l’est — il garda ses adversaires en place.',
        incertaine: true,
      },
      {
        texte: 'Père du peuple.',
        qui: 'Les députés réunis aux États généraux de Tours',
        contexte:
          'Mai 1506 : l’assemblée décerne ce titre au roi pour avoir allégé la taille, réformé la justice et gardé la paix dans le royaume.',
        sens:
          'Aucun autre roi de France n’a reçu ce nom de ses sujets eux-mêmes, et de leur propre mouvement.',
      },
      {
        texte:
          'J’aime mieux faire rire les courtisans de mon avarice que faire pleurer mon peuple de mes dépenses.',
        contexte:
          'Réponse prêtée au roi par une cour qui le trouvait trop économe. Il vivait de ses revenus et refusa toujours d’augmenter la taille.',
        sens:
          'Il a fait baisser l’impôt direct et gouverné presque sans emprunter : une exception dans l’histoire de la monarchie française.',
        incertaine: true,
      },
    ],
    reperes: [
      'Petit-fils du poète Charles d’Orléans, il est duc d’Orléans avant d’être roi.',
      'Vaincu à Saint-Aubin-du-Cormier en 1488, il passe trois ans en prison, dont deux dans une tour de Bourges.',
      'Roi en 1498 à la mort de son cousin Charles VIII, il épouse sa veuve Anne de Bretagne.',
      'Il conquiert le Milanais en 1499 et le perd en 1513 : les guerres d’Italie occupent tout son règne.',
      'L’ordonnance de Blois de 1499 réforme la justice ; il fait mettre par écrit les coutumes des provinces.',
      'Les États généraux de Tours le proclament Père du peuple en 1506.',
    ],
    recit: [
      {
        titre: 'Le duc d’Orléans, prisonnier du royaume',
        texte:
          'Il naît à **Blois** en **1462**, fils de **Charles d’Orléans** — le prince poète qui avait passé vingt-cinq ans captif en Angleterre après Azincourt — et arrière-petit-fils du frère de Charles VI. **Louis XI**, qui se méfie de cette branche, lui impose à quatorze ans d’épouser sa propre fille **Jeanne**, infirme et que l’on croit stérile : le calcul est d’éteindre la maison d’Orléans. À la mort du roi, le jeune duc conteste la régence d’**Anne de Beaujeu** et prend les armes avec les grands seigneurs : c’est la **Guerre folle**. Battu et pris à **Saint-Aubin-du-Cormier** le 28 juillet **1488**, il est enfermé trois ans, dont une grande partie dans la grosse tour de **Bourges**. **Charles VIII** le libère en 1491 et le reprend à son service. Il aura connu la prison d’État avant de disposer des prisons du royaume.',
      },
      {
        titre: 'Le roi qui ne se venge pas',
        texte:
          'Charles VIII meurt sans héritier le 7 avril **1498** ; le duc d’Orléans devient **Louis XII**. Toute la cour attend les représailles : c’est l’usage, et ses ennemis d’hier occupent les charges. Il ne touche à personne. **La Trémoille**, le général qui l’avait battu et capturé à Saint-Aubin, garde ses honneurs et ses commandements. Anne de Beaujeu n’est pas inquiétée. La phrase qu’on lui prête — « le roi de France ne venge point les injures du duc d’Orléans » — n’est peut-être pas de lui, mais elle dit exactement ce qu’il a fait. Il obtient du pape l’annulation de son mariage avec **Jeanne de France**, qui se retire à Bourges et y fonde un ordre religieux, et il épouse en janvier **1499** **Anne de Bretagne**, veuve de son prédécesseur : la Bretagne reste attachée à la France.',
      },
      {
        titre: 'L’Italie, l’autre moitié du règne',
        texte:
          'Par sa grand-mère **Valentine Visconti**, il se dit héritier du duché de **Milan**. En **1499**, il le prend en quelques semaines ; **Ludovic Sforza**, capturé l’année suivante, finira ses jours au château de **Loches**. Il partage ensuite le royaume de **Naples** avec l’Espagne, puis le perd contre elle à Cerignola et au **Garigliano** en 1503. Il entre dans la ligue de Cambrai contre Venise et gagne **Agnadel** en 1509 — et l’Europe se retourne : le pape **Jules II**, Venise, l’Espagne et l’Angleterre forment contre lui la Sainte Ligue. **Ravenne**, en 1512, est une victoire qui lui coûte son meilleur capitaine, **Gaston de Foix**, tué à vingt-deux ans ; Milan est perdu dans l’été. En 1513, il est battu à **Novare**, puis à **Guinegatte**, où la cavalerie française s’enfuit si vite qu’on appellera l’affaire **la journée des Éperons**.',
      },
      {
        titre: 'Père du peuple',
        texte:
          'En France, c’est un autre règne. Il refuse d’augmenter la **taille** et la fait même baisser ; il paie ses guerres d’Italie sur les revenus du Milanais plutôt que sur ses sujets. L’**ordonnance de Blois**, en mars **1499**, réforme la justice en cent soixante-deux articles : procès raccourcis, juges tenus de résider là où ils jugent, interdiction de vendre les offices de justice. Il fait rédiger et fixer par écrit les **coutumes** des provinces — la coutume de Paris est mise en forme en 1510 —, ce qui rend le droit consultable au lieu d’être de mémoire. En mai **1506**, les députés réunis à **Tours** le supplient de marier sa fille **Claude** à son cousin **François d’Angoulême** plutôt qu’au petit-fils de l’empereur, et le proclament **Père du peuple**. Il accepte les deux.',
      },
      {
        titre: 'La dernière année',
        texte:
          '**Anne de Bretagne** meurt en janvier 1514. Le roi, perclus de goutte, épouse en octobre **Marie d’Angleterre**, sœur d’Henri VIII : elle a dix-huit ans, il en a cinquante-deux. Il meurt le **1ᵉʳ janvier 1515**, à l’hôtel des Tournelles, à Paris, et l’on dit à la cour qu’il s’est tué à vouloir être jeune. Il laisse le trône à son gendre **François Ier**, qui reprendra la guerre d’Italie neuf mois plus tard et gagnera **Marignan**. Louis XII n’a pas de grande bataille dans les manuels, pas de château de la Loire à son nom, pas de formule célèbre dont on soit sûr. Il a un titre, donné par ses sujets et par personne d’autre, que la monarchie française n’a décerné qu’une seule fois en huit siècles.',
      },
    ],
    chrono: [
      { date: '1462', fait: 'Naissance à Blois, le 27 juin.' },
      { date: '1476', fait: 'Louis XI lui impose d’épouser sa fille Jeanne de France.' },
      { date: '1488', fait: 'Battu et fait prisonnier à Saint-Aubin-du-Cormier.' },
      { date: '1498', fait: 'Roi de France, le 7 avril.' },
      { date: '1499', fait: 'Mariage avec Anne de Bretagne ; ordonnance de Blois ; conquête de Milan.' },
      { date: '1503', fait: 'Perte du royaume de Naples au profit de l’Espagne.' },
      { date: '1506', fait: 'Les États généraux de Tours le proclament Père du peuple.' },
      { date: '1512', fait: 'Victoire de Ravenne ; Gaston de Foix y est tué.' },
      { date: '1513', fait: 'Défaites de Novare et de Guinegatte.' },
      { date: '1515', fait: 'Mort à Paris, le 1ᵉʳ janvier.' },
    ],
    leSaisTu:
      'Sa première femme, Jeanne de France, dont il fit annuler le mariage en 1498, ne protesta pas : elle se retira à Bourges et y fonda l’ordre de l’Annonciade. L’Église l’a canonisée en 1950. La reine écartée d’un roi appelé Père du peuple est devenue sainte Jeanne de France.',
    aRetenir: [
      'Louis XII, duc d’Orléans, est roi de France de 1498 à 1515.',
      'Vaincu et emprisonné trois ans sous le règne précédent, il ne se venge d’aucun de ses adversaires.',
      'Il épouse Anne de Bretagne en 1499, ce qui maintient la Bretagne unie à la France.',
      'L’ordonnance de Blois de 1499 réforme la justice ; il fait baisser la taille et écrire les coutumes.',
      'Les États généraux de Tours le proclament Père du peuple en 1506.',
      'Ses guerres d’Italie lui donnent Milan en 1499 et le lui reprennent en 1513 ; François Ier lui succède.',
    ],
    mots: [
      {
        mot: 'Coutume',
        sens: 'Droit non écrit d’une province, transmis par l’usage ; Louis XII fait mettre ces coutumes par écrit.',
      },
      {
        mot: 'Office',
        sens: 'Charge publique — juge, greffier, notaire — que l’on pouvait acheter ; l’ordonnance de 1499 l’interdit pour la justice.',
      },
      {
        mot: 'Guerres d’Italie',
        sens: 'Expéditions françaises en Italie de 1494 à 1559, pour y faire valoir des droits d’héritage sur Naples et sur Milan.',
      },
    ],
    lies: ['anne-de-bretagne', 'francois-ier', 'louis-xi', 'bayard'],
    niveaux: ['5e'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Louis XII',
      'Père du peuple',
      'Orléans',
      'Anne de Bretagne',
      'ordonnance de Blois',
      'Milan',
      'guerres d’Italie',
      'États généraux de Tours',
      'Blois',
      'taille',
      'Jeanne de France',
      'journée des Éperons',
    ],
  },
  {
    id: 'bayard',
    volet: 'personnages',
    nom: 'Pierre Terrail de Bayard',
    surnom: 'le chevalier sans peur et sans reproche',
    dates: 'vers 1476 – 1524',
    tri: 1524,
    periode: 'temps-modernes',
    emoji: '🐎',
    roles: ['Chevalier', 'Capitaine de François Ier', 'Défenseur de Mézières'],
    origine: 'Château Bayard, à Pontcharra, en Dauphiné',
    accroche:
      'Il n’a ni terres ni fortune, seulement une réputation : au soir de Marignan, c’est lui que le roi de France choisit pour le faire chevalier.',
    citations: [
      {
        texte:
          'Monsieur, il n’y a point de pitié à avoir de moi, car je meurs en homme de bien ; mais j’ai pitié de vous, qui servez contre votre prince, votre patrie et votre serment.',
        contexte:
          'À Charles de Bourbon, connétable de France passé au service de l’empereur, venu plaindre le chevalier mourant, le 30 avril 1524.',
        sens:
          'Les versions rapportées diffèrent d’un récit à l’autre, mais toutes disent la même chose : le mourant plaint le vivant, parce que le vivant a trahi.',
        incertaine: true,
      },
      {
        texte: 'Le bon chevalier sans peur et sans reproche.',
        qui: 'Jacques de Mailles, son compagnon d’armes, dit « le Loyal Serviteur »',
        contexte:
          'Titre de la biographie qu’il publie à Paris en 1527, trois ans après la mort de Bayard. Personne ne l’appelait ainsi de son vivant.',
        sens:
          'La formule la plus célèbre de la chevalerie française est posthume : c’est un livre qui l’a faite, et le livre a gagné.',
        incertaine: true,
      },
      {
        texte: 'Certes, ma bonne épée, vous serez gardée comme relique et honorée sur toutes autres.',
        contexte:
          'Au soir de Marignan, le 14 septembre 1515, après avoir armé chevalier François Ier. Rapporté par le Loyal Serviteur ; les historiens discutent la scène.',
        sens:
          'Un roi de France se fait adouber par un simple capitaine : c’est l’honneur qui commande, pas le rang. Cette scène a fait plus pour Bayard que toutes ses batailles.',
        incertaine: true,
      },
    ],
    reperes: [
      'Cadet d’une famille noble et pauvre du Dauphiné, il sert Charles VIII, Louis XII puis François Ier.',
      'Il combat en Italie de 1494 à sa mort : Fornoue, le Garigliano, Agnadel, Ravenne, Marignan.',
      'Le 14 septembre 1515, il arme chevalier le roi François Ier au soir de Marignan.',
      'En 1521, il tient Mézières un mois avec moins de mille hommes contre l’armée de Charles Quint.',
      'Tué d’une balle d’arquebuse le 30 avril 1524, en couvrant la retraite de l’armée française.',
      'La formule « sans peur et sans reproche » naît dans un livre publié trois ans après sa mort.',
    ],
    recit: [
      {
        titre: 'Un cadet du Dauphiné',
        texte:
          'Il naît vers **1476** au château Bayard, près de Pontcharra, dans une famille noble, ancienne et sans argent — on disait que ses aïeux mouraient tous à la guerre. Placé page chez le duc de Savoie puis chez **Charles VIII**, il part pour l’Italie à dix-huit ans et se bat à **Fornoue** en 1495. Il n’héritera de rien, ne bâtira pas de château, ne fera pas fortune : toute sa vie tiendra dans une **compagnie d’hommes d’armes**, des chevaux, une armure et une réputation. Cette pauvreté est une donnée, pas une vertu inventée après coup : les capitaines de son temps s’enrichissaient de rançons et de pillages, et lui redistribuait. C’est ce que ses compagnons ont retenu de lui bien avant les historiens.',
      },
      {
        titre: 'Le pont, ou la fabrique d’un héros',
        texte:
          'Décembre **1503** : l’armée française se retire devant les Espagnols de Gonzalve de Cordoue. Bayard, dit la tradition, prend seul position sur un pont étroit, l’épée à la main, et y arrête **deux cents cavaliers** le temps que les siens repassent la rivière. Les récits les plus proches de l’événement sont plus sobres : un pont — celui de la Mola, et non le **Garigliano** que l’on cite toujours —, un détachement d’une quinzaine d’Espagnols, un homme qui tient la position assez longtemps. Il faut le savoir en lisant sa vie : entre le fait et l’image, il y a des chroniqueurs qui aimaient leur héros. Mais l’image, elle, a été reprise dans tous les manuels de France, et c’est elle que l’on peint au XIXᵉ siècle sur les murs des écoles.',
      },
      {
        titre: 'Marignan, 14 septembre 1515',
        texte:
          'À **Marignan**, au sud de Milan, deux jours de bataille contre les **mercenaires suisses**, réputés invincibles, s’achèvent par la victoire du jeune **François Ier**. Le soir, raconte le Loyal Serviteur, le roi demande à Bayard de l’**armer chevalier** sur le champ de bataille — geste énorme, car un roi de France est chevalier de naissance et n’a besoin de personne. Les historiens discutent encore la scène : elle n’apparaît que dans les récits publiés après 1525, et elle arrange tout le monde. Vraie ou reconstruite, elle dit une chose exacte sur l’époque : à ce moment précis, le prestige du courage personnel vaut encore autant que le sang. Ce sera la dernière fois.',
      },
      {
        titre: 'Mézières, 1521 : le fait d’armes réel',
        texte:
          'Celui-là n’est pas contesté. En août **1521**, les armées de **Charles Quint** entrent en Champagne et marchent sur Paris. Entre elles et la capitale, il y a **Mézières**, une place mal fortifiée sur la Meuse. Bayard s’y enferme avec **Anne de Montmorency** et moins de mille hommes, contre des dizaines de milliers d’assiégeants. Il fait réparer les murs, harcèle les lignes ennemies, tient du **30 août au 27 septembre** — et l’armée impériale lève le siège. Le temps gagné permet à François Ier de rassembler ses forces. Le roi le fait chevalier de l’**ordre de Saint-Michel** et lui confie une compagnie de cent hommes d’armes, honneur jusque-là réservé aux princes du sang. C’est l’action qui a sauvé une campagne, et c’est la moins racontée.',
      },
      {
        titre: 'Romagnano, 30 avril 1524',
        texte:
          'Trois ans plus tard, l’armée française bat en retraite d’Italie sous un commandement médiocre. Bayard couvre l’arrière-garde au passage de la Sesia, près de **Romagnano**. Une balle d’**arquebuse** lui brise les reins. Il se fait poser contre un arbre, le visage tourné vers l’ennemi pour ne pas paraître fuir, et baise la croix formée par la garde de son épée. Le **connétable de Bourbon**, cousin du roi passé au service de l’empereur quelques mois plus tôt, vient le plaindre : Bayard lui répond que la pitié n’est pas pour lui. Il meurt le **30 avril 1524**. Son corps est ramené en Dauphiné ; les adversaires impériaux lui rendent les honneurs militaires sur le chemin.',
      },
      {
        titre: 'Le livre qui a fait le chevalier',
        texte:
          'Dès **1525**, son cousin **Symphorien Champier** publie sa vie ; en **1527**, son compagnon d’armes **Jacques de Mailles**, sous le nom du « **Loyal Serviteur** », donne *La très joyeuse et très plaisante histoire du bon chevalier sans peur et sans reproche*. La formule naît là, trois ans après sa mort, et ne le quittera plus. Elle prend parce qu’elle arrive au bon moment : l’arquebuse et l’artillerie rendent la chevalerie inutile, la guerre devient affaire de canons, de mercenaires et d’argent — et l’on se met à célébrer l’homme qui incarnait l’ancien monde à l’instant même où il disparaît. Bayard est le dernier chevalier parce que ceux qui l’ont écrit avaient besoin qu’il le soit.',
      },
    ],
    chrono: [
      { date: 'vers 1476', fait: 'Naissance au château Bayard, en Dauphiné.' },
      { date: '1494', fait: 'Il part pour l’Italie avec Charles VIII.' },
      { date: '1495', fait: 'Première bataille, à Fornoue.' },
      { date: '1503', fait: 'Il couvre seul une retraite sur un pont, près du Garigliano.' },
      { date: '1512', fait: 'Blessé à la bataille de Ravenne.' },
      { date: '1513', fait: 'Fait prisonnier à Guinegatte, la journée des Éperons.' },
      { date: '14 septembre 1515', fait: 'Il arme chevalier François Ier au soir de Marignan.' },
      { date: '1521', fait: 'Il tient Mézières un mois contre l’armée impériale.' },
      { date: '30 avril 1524', fait: 'Mort à Romagnano, en Piémont.' },
      { date: '1527', fait: 'Le Loyal Serviteur publie sa vie : « sans peur et sans reproche ».' },
    ],
    leSaisTu:
      'L’homme qui a tué Bayard tirait à l’arquebuse, une arme que les chevaliers tenaient pour déloyale : on rapporte que Bayard lui-même faisait exécuter les arquebusiers qu’il capturait. La balle qui lui brisa les reins, le 30 avril 1524, venait de l’arme qui allait rendre sa chevalerie inutile.',
    aRetenir: [
      'Pierre Terrail de Bayard, né vers 1476 en Dauphiné, sert Charles VIII, Louis XII et François Ier.',
      'Il combat pendant trente ans dans les guerres d’Italie, de Fornoue en 1495 à Romagnano en 1524.',
      'Au soir de Marignan, le 14 septembre 1515, il arme chevalier le roi François Ier.',
      'En 1521, il tient Mézières un mois avec moins de mille hommes contre l’armée de Charles Quint.',
      'Tué d’une balle d’arquebuse le 30 avril 1524, il est appelé « sans peur et sans reproche » par un livre de 1527.',
    ],
    mots: [
      {
        mot: 'Adouber',
        sens: 'Armer quelqu’un chevalier : on lui remet ses armes et on lui donne du plat de l’épée sur l’épaule.',
      },
      {
        mot: 'Arquebuse',
        sens: 'Arme à feu portative du XVIᵉ siècle ; sa balle traverse une armure, ce qu’aucune lance ne faisait.',
      },
      {
        mot: 'Homme d’armes',
        sens: 'Cavalier lourdement équipé, noyau des compagnies du roi ; il vient avec ses aides, ses valets et ses chevaux.',
      },
    ],
    lies: ['francois-ier', 'bataille-de-marignan', 'louis-xii'],
    niveaux: ['5e'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Bayard',
      'Pierre Terrail',
      'sans peur et sans reproche',
      'Marignan',
      'Mézières',
      'Dauphiné',
      'guerres d’Italie',
      'François Ier',
      'chevalerie',
      'Garigliano',
      'arquebuse',
      'Loyal Serviteur',
    ],
  },
]
