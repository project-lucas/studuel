// -----------------------------------------------------------------------------
// LA FRANCE, 1936-1944. Sept fiches qui tiennent ensemble : ce que la
// République avait donné (le Front populaire), comment elle s'est effondrée
// (mai-juin 1940), qui a dit non le lendemain (18 juin), ce qui a pris sa place
// (Vichy), ce que ce régime a fait (le Vél' d'Hiv), ce qui a refusé (la
// Résistance) et comment elle est revenue (Paris, août 1944).
//
// C'est la période la plus douloureuse du programme de 3e, et c'est celle où le
// ton du guide compte le plus (docs/encyclopedie.md, § 3) : FACTUEL, DATÉ,
// CHIFFRÉ, SOBRE. Pas d'indignation — la précision fait plus d'effet. Pas
// d'atténuation non plus : le statut des juifs d'octobre 1940 est une
// initiative française, la rafle du 16 juillet 1942 a été faite par la police
// française, et les fiches l'écrivent noir sur blanc, comme la République l'a
// écrit elle-même le 16 juillet 1995.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_GUERRES_FRANCE_39_45: Evenement[] = [
  {
    id: 'front-populaire',
    volet: 'evenements',
    nom: 'Le Front populaire',
    date: 'mai 1936 – avril 1938',
    tri: 1936,
    fin: 1938,
    periode: 'guerres',
    emoji: '✊',
    lieu: 'Paris, Matignon et les usines de France',
    accroche:
      'Deux millions de grévistes obtiennent en une nuit les conventions collectives, la semaine de 40 heures et quinze jours de congés payés.',
    citations: [
      {
        texte: 'Il faut savoir terminer une grève dès que satisfaction a été obtenue.',
        qui: 'Maurice Thorez',
        contexte:
          'Devant les militants communistes parisiens, le 11 juin 1936, pour faire cesser l’occupation des usines.',
        sens:
          'Le parti qui pousse le mouvement décide aussi de l’arrêter : les acquis sont signés, la grève devient un risque politique.',
      },
      {
        texte: 'Tout est possible.',
        qui: 'Marceau Pivert',
        contexte:
          'Titre de son article du *Populaire*, le 27 mai 1936, en pleine vague de grèves.',
        sens:
          'L’aile gauche de la SFIO croit la révolution à portée de main. Blum, lui, ne veut que l’exercice loyal du pouvoir.',
      },
      {
        texte:
          'Quand je voyais partir sur les routes ces autos pétaradantes, ces tandems, avec des couples ouvriers vêtus de pull-overs assortis, j’avais le sentiment d’avoir apporté une éclaircie dans des vies difficiles et obscures.',
        qui: 'Léon Blum',
        contexte:
          'À son procès, devant la cour de Riom, en mars 1942, jugé par Vichy pour avoir « trahi » la France.',
      },
    ],
    reperes: [
      'Le 3 mai 1936, la coalition des socialistes, des radicaux et des communistes enlève 386 sièges sur 608.',
      'Léon Blum, premier socialiste à diriger un gouvernement français, entre en fonction le 4 juin 1936.',
      'Deux millions de salariés occupent leur usine : une grève sans mort, avec accordéons et bals dans les ateliers.',
      'Les accords Matignon, signés dans la nuit du 7 au 8 juin 1936, augmentent les salaires de 7 à 15 %.',
      'Trois acquis en trois semaines : conventions collectives, semaine de 40 heures, deux semaines de congés payés.',
      'Blum démissionne le 21 juin 1937 ; les décrets-lois de novembre 1938 enterrent les 40 heures.',
    ],
    causes: [
      'La crise de 1929 atteint la France en 1931 et s’y installe : production en baisse, chômage, salaires rognés par la déflation.',
      'Le 6 février 1934, les ligues d’extrême droite marchent sur le Palais-Bourbon : quinze morts, et la gauche croit voir venir le fascisme.',
      'La leçon allemande et italienne : partout où la gauche est restée divisée, elle a perdu. Socialistes et communistes signent un pacte d’unité d’action le 27 juillet 1934.',
      'Le serment du 14 juillet 1935, qui scelle le Rassemblement populaire des socialistes, des radicaux, des communistes et de la CGT réunifiée.',
      'La victoire électorale des 26 avril et 3 mai 1936, qui donne une majorité nette et fait naître une attente immense dans les ateliers.',
      'Une classe ouvrière qui a tout encaissé depuis cinq ans sans rien obtenir et qui n’attend pas la formation du gouvernement pour agir.',
    ],
    recit: [
      {
        titre: 'Le 6 février 1934 et la peur',
        texte:
          'Le **6 février 1934**, au soir d’un scandale financier — l’affaire Stavisky —, les ligues d’extrême droite (Croix-de-Feu, Jeunesses patriotes, Action française) convergent vers le **Palais-Bourbon**. La police tire sur le pont de la Concorde : **quinze morts**, plus de deux mille blessés. Le gouvernement tombe le lendemain. À gauche, la lecture est immédiate : ce qui vient d’être tenté à Paris est ce qui a réussi à Rome en 1922 et à Berlin en 1933. Deux camps qui se haïssaient depuis la scission du congrès de Tours (1920), **socialistes** et **communistes**, signent le 27 juillet 1934 un **pacte d’unité d’action**. Les **radicaux** les rejoignent. Le **14 juillet 1935**, un demi-million de personnes défilent de la Bastille à Vincennes derrière un serment commun : défendre les libertés démocratiques et « donner du pain aux travailleurs, du travail à la jeunesse, la paix au monde ». Le **Rassemblement populaire** est né ; on l’appellera le **Front populaire**.',
      },
      {
        titre: 'Mai 1936 : on gagne, et on occupe',
        texte:
          'Aux élections des **26 avril et 3 mai 1936**, le Front populaire enlève **386 sièges sur 608**. La SFIO devient le premier parti de France : c’est donc à **Léon Blum** — avocat, critique littéraire, dreyfusard de la première heure — de former le gouvernement. Mais les institutions sont lentes et le cabinet sortant reste en place jusqu’au **4 juin**. Un mois d’attente que le pays ne supporte pas. Le **11 mai**, l’usine Bréguet du Havre s’arrête ; le mouvement gagne la métallurgie parisienne, les grands magasins, les mines, le textile. Début juin, **deux millions de salariés** occupent leur lieu de travail. L’occupation est une invention tactique : on ne quitte pas l’usine, donc on ne peut pas être remplacé. On y dort, on y joue de l’accordéon, on organise des bals et des concours de belote. Presque aucune violence, aucune machine cassée — et un patronat terrifié, qui accepte de négocier ce qu’il refusait depuis quarante ans.',
      },
      {
        titre: 'Matignon, dans la nuit du 7 au 8 juin',
        texte:
          'Blum convoque à l’hôtel **Matignon** la **CGT** et la Confédération générale de la production française, c’est-à-dire le patronat. La négociation dure la nuit du **7 au 8 juin 1936** et accouche d’un texte de sept articles : hausse générale des salaires de **7 à 15 %**, reconnaissance du **droit syndical** dans l’entreprise, élection de **délégués du personnel**, aucune sanction contre les grévistes, et surtout l’engagement de signer des **conventions collectives** — des contrats négociés branche par branche, qui remplacent le face-à-face entre un patron et un ouvrier isolé. Le Parlement suit en quelques jours : loi du **20 juin** sur les **congés payés** (deux semaines par an) et loi du **21 juin** sur la **semaine de 40 heures**. Trois semaines plus tôt, ces mesures étaient encore des mots d’ordre de meeting.',
      },
      {
        titre: 'Deux semaines par an',
        texte:
          'Le congé payé n’est pas une invention française : la Norvège, l’Espagne et l’Italie l’ont déjà. Ce qui l’est, c’est l’organisation du départ. **Léo Lagrange**, sous-secrétaire d’État aux Sports et aux Loisirs — un poste qui n’existait pas —, obtient des chemins de fer un **billet populaire de congé annuel** à **40 % de réduction** : plus de 500 000 sont vendus dès l’été 1936, près de deux millions l’année suivante. Des familles ouvrières voient la mer pour la première fois. Lagrange crée aussi les **auberges de jeunesse**, le brevet sportif populaire, soutient le théâtre et le cinéma populaires. L’expression « **la France des congés payés** », méprisante dans la bouche de ses adversaires, est devenue le nom d’un basculement : le **loisir** cesse d’être un privilège de classe.',
      },
      {
        titre: 'L’expérience s’arrête',
        texte:
          'Elle dure un an. Les 40 heures, appliquées rigidement dans une industrie qui manque de machines, freinent la production au moment précis où il faudrait **réarmer** face à Hitler. Les prix montent et mangent les hausses de salaires ; les capitaux fuient ; le franc est dévalué dès septembre 1936. La **guerre d’Espagne**, ouverte en juillet 1936, déchire la coalition : Blum, le cœur du côté des républicains espagnols, choisit la **non-intervention** pour ne pas rompre avec Londres ni ouvrir la guerre civile en France — il en parlera toute sa vie comme d’un déchirement. Le **13 février 1937**, il annonce une « **pause** » dans les réformes. Le Sénat lui refuse les pouvoirs financiers : Blum démissionne le **21 juin 1937**. En **avril 1938**, Édouard **Daladier** forme un gouvernement sans les socialistes, et ses **décrets-lois** de novembre détricotent les 40 heures ; la grève générale du 30 novembre 1938 échoue. Le Front populaire est fini. Ses lois, non.',
      },
    ],
    consequences: [
      'Les conventions collectives font entrer la négociation dans l’entreprise : c’est le socle du droit du travail français.',
      'Les congés payés deviennent une évidence : deux semaines en 1936, trois en 1956, quatre en 1969, cinq en 1982.',
      'La CGT passe d’un à quatre millions d’adhérents en quelques mois : le syndicalisme change d’échelle.',
      'Le sport, les vacances et la culture deviennent une affaire publique, avec un secrétariat d’État pour s’en occuper.',
      'L’échec économique et la non-intervention en Espagne laissent une gauche divisée et amère à la veille de la guerre.',
      'La haine accumulée contre Blum, attaques antisémites comprises, se retrouve intacte en 1940 : Vichy le juge à Riom en 1942, puis le déporte.',
    ],
    chiffres: [
      { valeur: '2 millions', quoi: 'de grévistes en juin 1936' },
      { valeur: '40', quoi: 'heures : la nouvelle durée légale de la semaine' },
      { valeur: '15 jours', quoi: 'de congés payés par an, pour la première fois' },
      { valeur: '386', quoi: 'sièges sur 608 pour le Front populaire' },
    ],
    chrono: [
      { date: '6 février 1934', fait: 'Les ligues marchent sur le Palais-Bourbon : quinze morts.' },
      { date: '27 juillet 1934', fait: 'Pacte d’unité d’action entre socialistes et communistes.' },
      { date: '14 juillet 1935', fait: 'Serment du Rassemblement populaire, de la Bastille à Vincennes.' },
      { date: '3 mai 1936', fait: 'Le Front populaire gagne les élections législatives.' },
      { date: 'mai-juin 1936', fait: 'Deux millions de grévistes occupent les usines.' },
      { date: '4 juin 1936', fait: 'Léon Blum devient président du Conseil.' },
      { date: '7-8 juin 1936', fait: 'Accords Matignon, signés dans la nuit.' },
      { date: '20-21 juin 1936', fait: 'Lois sur les congés payés et la semaine de 40 heures.' },
      { date: '13 février 1937', fait: 'Blum annonce la « pause » dans les réformes.' },
      { date: '21 juin 1937', fait: 'Démission de Léon Blum.' },
      { date: 'novembre 1938', fait: 'Les décrets-lois Daladier enterrent les 40 heures.' },
    ],
    leSaisTu:
      'Le billet de congé annuel de 1936 coûtait 40 % de moins et n’était valable qu’en troisième classe. Les gares du Nord et de Lyon furent prises d’assaut, vélos et tandems sur le toit des wagons. Beaucoup de ces voyageurs allaient à moins de cent kilomètres de chez eux : voir la mer une fois suffisait à faire une vie.',
    aRetenir: [
      'Le Front populaire est une coalition de socialistes, de radicaux et de communistes, victorieuse en mai 1936.',
      'Léon Blum devient président du Conseil le 4 juin 1936, porté par deux millions de grévistes.',
      'Les accords Matignon (7-8 juin 1936) augmentent les salaires et imposent les conventions collectives.',
      'Les lois de juin 1936 créent la semaine de 40 heures et quinze jours de congés payés.',
      'Blum démissionne le 21 juin 1937 et les 40 heures sont supprimées fin 1938 : les congés payés, eux, restent.',
    ],
    mots: [
      {
        mot: 'Convention collective',
        sens: 'Accord négocié entre syndicats et patrons pour toute une branche : salaires, horaires, congés y valent pour tous.',
      },
      {
        mot: 'Décret-loi',
        sens: 'Texte pris par le gouvernement seul, sans vote du Parlement, quand celui-ci lui en a donné l’autorisation.',
      },
      {
        mot: 'Ligue',
        sens: 'Organisation politique de rue, armée et antiparlementaire, très active en France dans les années 1930.',
      },
      {
        mot: 'Déflation',
        sens: 'Politique de baisse des prix, des salaires et des dépenses publiques pour défendre la monnaie — elle aggrave la crise.',
      },
    ],
    lies: ['crise-de-1929', 'jean-jaures', 'defaite-de-mai-juin-1940', 'regime-de-vichy'],
    niveaux: ['3e', 'Tle'],
    programme: 'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'Front populaire',
      'Léon Blum',
      'Matignon',
      'congés payés',
      '40 heures',
      'grèves de 1936',
      'conventions collectives',
      'CGT',
      'Léo Lagrange',
      'Thorez',
      '6 février 1934',
    ],
  },
  {
    id: 'defaite-de-mai-juin-1940',
    volet: 'evenements',
    nom: 'La défaite de mai-juin 1940',
    date: '10 mai – 22 juin 1940',
    tri: 1940,
    fin: 1940,
    periode: 'guerres',
    emoji: '🛣️',
    lieu: 'Sedan, Dunkerque, les routes de France',
    accroche:
      'En six semaines, l’armée réputée la meilleure du monde s’effondre : dix millions de civils sur les routes, et l’armistice signé dans le wagon de 1918.',
    citations: [
      {
        texte: 'Nous sommes vaincus, nous avons perdu la bataille.',
        qui: 'Paul Reynaud',
        contexte:
          'Au téléphone à Winston Churchill, au matin du 15 mai 1940, cinq jours après le début de l’offensive.',
      },
      {
        texte: '— Où est la masse de manœuvre ? — Aucune.',
        qui: 'Winston Churchill et le général Gamelin',
        contexte: 'Au Quai d’Orsay, le 16 mai 1940, devant la carte du front percé.',
        sens:
          'Il n’existe aucune réserve stratégique : tout est engagé en Belgique, et rien ne peut colmater la brèche de Sedan.',
      },
      {
        texte: 'C’est le cœur serré que je vous dis aujourd’hui qu’il faut cesser le combat.',
        qui: 'Le maréchal Pétain',
        contexte: 'Allocution radiodiffusée du 17 juin 1940, au lendemain de sa prise de fonctions.',
        sens:
          'Aucun armistice n’est encore signé : des unités qui se battaient encore posent les armes, et les prisonniers se comptent par centaines de milliers.',
      },
    ],
    reperes: [
      'Le 10 mai 1940, la Wehrmacht attaque les Pays-Bas, la Belgique et le Luxembourg : la « drôle de guerre » finit.',
      'La percée se fait à Sedan, dans les Ardennes jugées impraticables : la ligne Maginot est contournée par le nord.',
      'Le 20 mai, les blindés allemands atteignent la mer à Abbeville et enferment un million d’hommes.',
      'Du 26 mai au 4 juin, 338 000 soldats alliés sont évacués de Dunkerque, dont environ 123 000 Français.',
      'Huit à dix millions de civils fuient sur les routes : c’est l’exode.',
      'L’armistice est signé le 22 juin 1940 à Rethondes, dans le wagon même où l’Allemagne avait capitulé en 1918.',
    ],
    causes: [
      'Une armée pensée pour la guerre précédente : le front continu, l’artillerie, le temps — quand l’adversaire mise sur la vitesse.',
      'La ligne Maginot s’arrête à la frontière belge : au-delà, la Belgique, redevenue neutre en 1936, interdit toute fortification.',
      'Le massif des Ardennes, déclaré impraticable aux blindés par l’état-major français, n’est tenu que par des divisions de réservistes.',
      'Le plan allié Dyle-Breda envoie les meilleures divisions en Belgique : elles s’éloignent à l’instant même où l’attaque principale passe derrière elles.',
      'Des chars français aussi nombreux et souvent mieux blindés, mais dispersés en soutien de l’infanterie et privés de radio, face à dix divisions blindées concentrées.',
      'Un commandement lent : Gamelin dirige la bataille depuis Vincennes sans liaison radio, et les ordres mettent parfois quarante-huit heures à descendre.',
      'Aucune réserve stratégique : la ligne percée le 13 mai à Sedan, il n’y a rien derrière pour la refermer.',
    ],
    recit: [
      {
        titre: 'La drôle de guerre',
        texte:
          'La France et le Royaume-Uni déclarent la guerre à l’Allemagne le **3 septembre 1939**, après l’invasion de la Pologne — puis ne l’attaquent pas. Pendant huit mois, des millions d’hommes s’observent : c’est la « **drôle de guerre** ». On distribue des jeux de cartes aux soldats, on attend derrière la **ligne Maginot**, quatre cents kilomètres de forts, de tourelles et de galeries souterraines construits de 1930 à 1936 le long de la frontière allemande. L’ouvrage est solide et il tiendra : aucun de ses grands forts ne sera enlevé de front. Le problème n’est pas la ligne, c’est là où elle s’arrête. Elle ne couvre pas la frontière belge, parce que la Belgique, redevenue neutre en 1936, refuse qu’on fortifie chez elle — et qu’on ne bâtit pas un mur devant un allié. L’état-major le sait : si les Allemands viennent, ce sera par la Belgique, comme en 1914. Le plan allié consiste donc à foncer à leur rencontre dès l’alerte.',
      },
      {
        titre: '13 mai : Sedan',
        texte:
          'Le **10 mai 1940**, la Wehrmacht attaque les Pays-Bas, la Belgique et le Luxembourg. Les meilleures divisions françaises et le corps expéditionnaire britannique entrent aussitôt en Belgique, comme prévu. Mais le nord n’est qu’un leurre : l’effort principal — sept divisions blindées, le plan de **Manstein** — traverse les **Ardennes**, cent quarante kilomètres de forêts et de routes étroites. Les colonnes allemandes s’y étirent sur plus de cent kilomètres, offertes à l’aviation ; personne ne les frappe. Le **13 mai**, les hommes de **Guderian** franchissent la **Meuse à Sedan** après un pilonnage de *Stukas* qui dure des heures et brise des unités de réservistes. Le 15, la brèche atteint quatre-vingts kilomètres. Le **20 mai au soir**, les chars allemands touchent la **mer à Abbeville** : un million d’hommes, l’élite des armées alliées, sont enfermés au nord. En dix jours, la campagne est jouée.',
      },
      {
        titre: 'Dunkerque',
        texte:
          'Pris dans la poche, les Alliés se replient sur **Dunkerque**. Le 24 mai, les blindés allemands reçoivent l’ordre de s’arrêter devant les canaux — décision encore discutée aujourd’hui — et Göring promet d’achever la poche par l’aviation. Ce répit permet l’**opération Dynamo** : du **26 mai au 4 juin**, des centaines de navires, chalutiers et bateaux de plaisance compris, évacuent **338 000 soldats** vers l’Angleterre, dont environ 123 000 Français. Ils y parviennent parce que des divisions françaises tiennent le périmètre jusqu’au bout : 35 000 d’entre elles sont faites prisonnières le 4 juin. Tout le matériel reste sur les plages. Le 5 juin s’ouvre une seconde bataille, sur la **Somme** et l’**Aisne** ; l’armée française s’y bat mieux, en « hérissons » qui se laissent encercler pour retarder l’adversaire, mais elle n’a plus ni réserves ni ciel.',
      },
      {
        titre: 'Huit à dix millions sur les routes',
        texte:
          'Derrière le front se produit le plus grand déplacement de population de l’histoire de France. Dès le 10 mai, les Belges et les habitants du Nord fuient, bientôt rejoints par les Parisiens : **huit à dix millions de personnes**, près d’un Français sur quatre, prennent la route à pied, à vélo, en charrette, en voiture jusqu’à la panne d’essence. Paris passe de 2,8 millions d’habitants à moins de 700 000. Les colonnes, mêlées aux convois militaires, sont mitraillées par l’aviation. Des enfants se perdent : on en recherchera encore des dizaines de milliers en 1941, par la radio et les petites annonces. Les administrations s’évanouissent, des maires partent, l’État se disloque avant même d’avoir capitulé. **L’exode** explique une part du soulagement avec lequel une population épuisée accueillera l’annonce de l’armistice — et la popularité immédiate de celui qui la signe.',
      },
      {
        titre: 'Rethondes, le même wagon',
        texte:
          'Le gouvernement quitte Paris le 10 juin ; la ville, déclarée **ville ouverte**, est occupée le **14 juin** sans combat. À Bordeaux, le **16 juin**, **Paul Reynaud** démissionne plutôt que de demander l’armistice ; le président Lebrun appelle le maréchal **Pétain**, qui annonce dès le **17 juin** qu’il faut « cesser le combat ». La convention est signée le **22 juin 1940** à **Rethondes**, dans la clairière de Compiègne — et, sur l’ordre exprès d’Hitler, **dans le wagon même où l’Allemagne avait signé sa défaite le 11 novembre 1918**. On a abattu le mur du musée pour ressortir la voiture et la replacer à l’emplacement exact de 1918 ; Hitler s’assied dans le fauteuil qu’occupait Foch. Rien n’est laissé au hasard : l’humiliation est la mise en scène. Les conditions sont dures — les trois cinquièmes du pays occupés, l’armée réduite à 100 000 hommes, **1,8 million de prisonniers** retenus en Allemagne jusqu’à la fin de la guerre, des frais d’occupation de 400 millions de francs par jour. Et ce n’est pas une capitulation militaire mais un **armistice** signé par un gouvernement : la France garde un État — cet État va s’installer à Vichy.',
      },
    ],
    consequences: [
      'Un armistice et non une capitulation : la France conserve un gouvernement, qui s’installe à Vichy et s’engage dans la collaboration.',
      'Le pays est coupé par une ligne de démarcation, l’Alsace-Moselle annexée de fait, le Nord rattaché au commandement de Bruxelles.',
      '1,8 million de soldats français partent en captivité en Allemagne, pour cinq ans : autant de familles sans père.',
      'Le 18 juin, depuis Londres, le général de Gaulle refuse l’armistice : la France libre naît de cette défaite.',
      'La IIIe République, discréditée par la débâcle, se saborde le 10 juillet 1940 en votant les pleins pouvoirs à Pétain.',
      'La défaite nourrit un mythe durable — « l’armée n’a pas été battue, elle a été trahie » — que les historiens ont dû défaire pièce à pièce.',
    ],
    chiffres: [
      { valeur: '6 semaines', quoi: 'du 10 mai au 22 juin 1940' },
      { valeur: '8 à 10 millions', quoi: 'de civils sur les routes de l’exode' },
      { valeur: '1,8 million', quoi: 'de soldats français prisonniers' },
      { valeur: '338 000', quoi: 'soldats alliés évacués de Dunkerque' },
    ],
    chrono: [
      { date: '3 septembre 1939', fait: 'La France et le Royaume-Uni déclarent la guerre à l’Allemagne.' },
      { date: '10 mai 1940', fait: 'Offensive allemande sur les Pays-Bas, la Belgique et le Luxembourg.' },
      { date: '13 mai 1940', fait: 'Percée de la Meuse à Sedan.' },
      { date: '20 mai 1940', fait: 'Les blindés allemands atteignent la mer à Abbeville.' },
      { date: '26 mai – 4 juin 1940', fait: 'Opération Dynamo : 338 000 hommes évacués de Dunkerque.' },
      { date: '10 juin 1940', fait: 'Le gouvernement quitte Paris ; l’Italie entre en guerre.' },
      { date: '14 juin 1940', fait: 'Les Allemands entrent dans Paris, ville ouverte.' },
      { date: '16 juin 1940', fait: 'Reynaud démissionne ; Pétain forme le gouvernement.' },
      { date: '17 juin 1940', fait: 'Pétain annonce qu’il faut « cesser le combat ».' },
      { date: '18 juin 1940', fait: 'Appel du général de Gaulle sur les ondes de la BBC.' },
      { date: '22 juin 1940', fait: 'Armistice signé à Rethondes, dans le wagon de 1918.' },
    ],
    leSaisTu:
      'Le wagon de Rethondes a fini en cendres. Après la cérémonie du 22 juin 1940, Hitler le fit emporter à Berlin et exposer en trophée ; en 1945, à l’approche des Alliés, il fut brûlé en Thuringe. Celui que l’on visite aujourd’hui dans la clairière est un jumeau, sorti de la même série de voitures-restaurants, installé là en 1950.',
    aRetenir: [
      'L’offensive allemande commence le 10 mai 1940 ; la percée décisive a lieu à Sedan le 13 mai.',
      'La ligne Maginot n’est pas enfoncée : elle est contournée par les Ardennes et la Belgique.',
      'Huit à dix millions de civils fuient sur les routes : c’est l’exode.',
      'Le 17 juin 1940, Pétain appelle à cesser le combat ; l’armistice est signé le 22 juin à Rethondes.',
      'Hitler exige la signature dans le wagon de 1918 : la défaite française devait répondre exactement à la défaite allemande.',
    ],
    mots: [
      {
        mot: 'Armistice',
        sens: 'Arrêt des combats négocié entre gouvernements — différent d’une capitulation, qui n’engage que les armées.',
      },
      {
        mot: 'Exode',
        sens: 'La fuite de huit à dix millions de civils vers le sud, en mai et juin 1940.',
      },
      {
        mot: 'Ligne de démarcation',
        sens: 'Frontière intérieure instaurée par l’armistice entre zone occupée et zone dite libre ; on ne la franchit qu’avec un laissez-passer.',
      },
      {
        mot: 'Guerre éclair',
        sens: 'Concentration des chars et de l’aviation sur un point étroit pour percer, puis foncer sans attendre l’infanterie.',
      },
    ],
    lies: [
      'appel-du-18-juin-1940',
      'regime-de-vichy',
      'philippe-petain',
      'charles-de-gaulle',
      'la-resistance',
    ],
    niveaux: ['3e'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'défaite de 1940',
      'Sedan',
      'ligne Maginot',
      'exode',
      'Dunkerque',
      'armistice',
      'Rethondes',
      'Pétain',
      'Reynaud',
      'Guderian',
      'débâcle',
    ],
  },
  {
    id: 'appel-du-18-juin-1940',
    volet: 'evenements',
    nom: 'L’appel du 18 juin 1940',
    date: '18 juin 1940',
    tri: 1940,
    periode: 'guerres',
    emoji: '📻',
    lieu: 'Londres, studios de la BBC',
    accroche:
      'Un général de brigade que personne ne connaît parle quatre minutes à la radio de Londres, et fonde à lui seul la France qui continue.',
    citations: [
      {
        texte:
          'Quoi qu’il arrive, la flamme de la résistance française ne doit pas s’éteindre et ne s’éteindra pas.',
        qui: 'Charles de Gaulle',
        contexte: 'Dernière phrase de l’appel lu au micro de la BBC, le 18 juin 1940 à 22 heures.',
      },
      {
        texte:
          'Cette guerre n’est pas limitée au territoire malheureux de notre pays. Cette guerre n’est pas tranchée par la bataille de France. Cette guerre est une guerre mondiale.',
        qui: 'Charles de Gaulle',
        contexte: 'Appel du 18 juin 1940 : l’argument qui justifie de continuer malgré la défaite.',
        sens:
          'La bataille de France est perdue ; la guerre, elle, se jouera avec l’Empire, l’Angleterre et l’industrie américaine.',
      },
      {
        texte: 'La France a perdu une bataille ! Mais la France n’a pas perdu la guerre !',
        qui: 'Charles de Gaulle',
        contexte: 'Premières lignes de l’affiche « À TOUS LES FRANÇAIS », placardée à Londres en août 1940.',
        sens:
          'La phrase la plus citée du 18 juin n’en fait pas partie : elle vient de l’affiche, écrite six semaines plus tard.',
      },
      {
        texte:
          'Moi, général de Gaulle, actuellement à Londres, j’invite les officiers et les soldats français qui se trouvent en territoire britannique à se mettre en rapport avec moi.',
        qui: 'Charles de Gaulle',
        contexte: 'Appel du 18 juin 1940 : la seule consigne concrète du texte.',
      },
    ],
    reperes: [
      'De Gaulle a 49 ans, il est général de brigade à titre temporaire et ministre depuis treize jours seulement.',
      'Il s’envole de Bordeaux-Mérignac le 17 juin 1940, quelques heures après l’allocution de Pétain.',
      'Churchill lui ouvre le micro de la BBC malgré les réticences de son cabinet.',
      'L’appel dure environ quatre minutes et passe à 22 heures, sans annonce préalable.',
      'Aucun enregistrement du 18 juin n’a été conservé : la voix des documentaires est celle du 22 juin.',
      'Le 2 août 1940, un tribunal militaire de Vichy le condamne à mort par contumace.',
    ],
    causes: [
      'L’annonce par Pétain, le 17 juin, qu’il faut cesser le combat : pour de Gaulle, c’est une capitulation politique.',
      'Sa conviction, défendue depuis « Vers l’armée de métier » (1934), que la guerre moderne se gagne par les blindés et l’aviation — et qu’elle ne fait que commencer.',
      'L’existence d’un Empire de soixante millions d’habitants, d’une flotte intacte et d’une Angleterre qui se bat encore.',
      'L’entrée probable des États-Unis, dont l’industrie change l’échelle du conflit.',
      'Le soutien personnel de Churchill, qui l’a rencontré début juin et lui accorde la radio britannique.',
      'Un vide : aucun ministre, aucun parlementaire de premier plan ne prend publiquement la parole contre l’armistice ce jour-là.',
    ],
    recit: [
      {
        titre: 'Un avion pour Londres',
        texte:
          'Le **5 juin 1940**, Paul Reynaud nomme **Charles de Gaulle**, 49 ans, sous-secrétaire d’État à la Guerre. Il vient de commander une division cuirassée à Montcornet et à Abbeville, deux des rares contre-attaques réussies de la campagne. En dix jours, il fait trois voyages à Londres pour tenter de maintenir la France dans la guerre : il plaide pour un repli en **Afrique du Nord** avec la flotte et l’aviation, et soutient le projet d’**union franco-britannique** proposé le 16 juin. Le soir même, Reynaud démissionne et Pétain prend sa place. Le **17 juin au matin**, tandis que le maréchal annonce à la radio qu’il faut cesser le combat, de Gaulle décolle de **Bordeaux-Mérignac** dans l’avion du général britannique **Spears**. Il emporte cent mille francs de fonds secrets. Il n’a ni troupe, ni mandat, ni territoire.',
      },
      {
        titre: 'Quatre minutes au micro',
        texte:
          'Londres, **18 juin 1940**. De Gaulle écrit son texte dans la journée. Le cabinet britannique hésite : laisser un général sans troupes parler au nom de la France, c’est fermer la porte à tout accord avec le gouvernement de Bordeaux. **Churchill** tranche, et le texte passe à peine adouci. À 22 heures, dans un studio de **Broadcasting House**, de Gaulle lit ses quatre minutes. Il y dit trois choses. La défaite vient d’une **infériorité mécanique** — les chars, l’aviation, la tactique — et non du courage des soldats. La guerre est **mondiale**, donc elle n’est pas finie : l’Empire, l’Angleterre et l’industrie américaine restent dans la balance. Enfin, il invite les militaires, les ingénieurs et les ouvriers spécialisés français présents en Grande-Bretagne à le rejoindre. Le texte se termine sur la **flamme de la résistance** — un mot qui, ce soir-là, n’est encore le nom de rien ni de personne.',
      },
      {
        titre: 'Presque personne n’a écouté',
        texte:
          'On imagine volontiers une France penchée sur son poste. La réalité est plus rude : l’appel n’a été annoncé nulle part, il passe à 22 heures, sur une station étrangère, dans un pays où dix millions de personnes sont sur les routes et où l’on guette surtout les nouvelles de l’armistice. Personne ne sait qui est ce général. **Aucun enregistrement n’en a été conservé** : la BBC n’archivait pas tout, et la voix que l’on entend dans les documentaires est celle de l’appel du **22 juin**. Le texte n’en circule pas moins — des journaux français le reprennent dès le 19 juin, on le recopie, on le raconte —, et un second appel suit le lendemain. Quelques dizaines d’hommes gagnent Londres, puis quelques centaines : environ **7 000 volontaires** à la fin de juillet 1940. C’est très peu. C’est assez pour qu’une autre France existe.',
      },
      {
        titre: 'À TOUS LES FRANÇAIS',
        texte:
          'La phrase que tout le monde attribue au 18 juin — « **La France a perdu une bataille ! Mais la France n’a pas perdu la guerre !** » — n’en fait pas partie. Elle ouvre l’**affiche** blanche et rouge intitulée « À TOUS LES FRANÇAIS », placardée sur les murs de Londres au début d’**août 1940** pour appeler à l’engagement. Elle résume si bien le propos qu’elle a fini par le remplacer dans les mémoires, jusque dans les manuels. L’appel, lui, n’avait été qu’une voix ; l’affiche, elle, se voyait, se photographiait, se recopiait. Cette confusion vaut d’être connue : elle montre comment un événement fondateur se fabrique aussi après coup, par les textes qu’on en garde et les images qu’on en fait.',
      },
      {
        titre: 'Ce que l’appel fonde',
        texte:
          'Le **28 juin 1940**, le gouvernement britannique reconnaît de Gaulle comme « **chef des Français libres** ». Le **2 août**, un tribunal militaire de Vichy le condamne à **mort par contumace** pour désertion et trahison. Entre ces deux dates tient tout le problème : un homme seul se déclare dépositaire de la légitimité française contre un gouvernement légal, et il faudra quatre ans pour lui donner raison. La **France libre** rassemble des volontaires, rallie une partie de l’Empire dès l’été 1940 — le Tchad du gouverneur **Félix Éboué**, puis le Cameroun et le Congo —, se donne un service de renseignement, une armée, et la **croix de Lorraine** pour répondre à la croix gammée. À partir de 1942, devenue **France combattante**, elle s’unit à la Résistance intérieure. Le **18 juin** est l’acte de naissance de tout cela ; il est, depuis 2006, une journée nationale de commémoration.',
      },
    ],
    consequences: [
      'Naissance de la France libre, reconnue par le gouvernement britannique dès le 28 juin 1940.',
      'La légitimité française se dédouble : un gouvernement légal à Vichy, une légitimité proclamée à Londres.',
      'Des territoires de l’Empire se rallient dès l’été 1940, à commencer par le Tchad de Félix Éboué.',
      'Le mot « résistance », emprunté à la dernière phrase de l’appel, finit par nommer le refus tout entier.',
      'Condamné à mort par Vichy en août 1940, de Gaulle dirige le gouvernement provisoire de la République en août 1944.',
      'Le 18 juin est devenu une journée nationale de commémoration, fixée par décret en 2006.',
    ],
    chiffres: [
      { valeur: '4 minutes', quoi: 'la durée de l’appel' },
      { valeur: '0', quoi: 'enregistrement conservé du 18 juin 1940' },
      { valeur: '7 000', quoi: 'volontaires ralliés à la France libre fin juillet 1940' },
      { valeur: '49 ans', quoi: 'l’âge de Charles de Gaulle, général depuis un mois' },
    ],
    chrono: [
      { date: '5 juin 1940', fait: 'De Gaulle entre au gouvernement comme sous-secrétaire d’État.' },
      { date: '16 juin 1940', fait: 'Reynaud démissionne ; Pétain forme le gouvernement.' },
      { date: '17 juin 1940', fait: 'Pétain veut cesser le combat ; de Gaulle s’envole pour Londres.' },
      { date: '18 juin 1940, 22 h', fait: 'Lecture de l’appel sur les ondes de la BBC.' },
      { date: '19 juin 1940', fait: 'Second appel ; des journaux français publient le texte.' },
      { date: '28 juin 1940', fait: 'Londres reconnaît de Gaulle chef des Français libres.' },
      { date: '2 août 1940', fait: 'Vichy le condamne à mort par contumace.' },
      { date: 'août 1940', fait: 'Le Tchad, le Cameroun et le Congo rallient la France libre.' },
    ],
    leSaisTu:
      'Le texte du 18 juin ne désignait pas un mouvement : « la flamme de la résistance » était une image, rien de plus. Trois ans plus tard, le mot nommait des dizaines de milliers d’hommes et de femmes, des journaux, des maquis et un Conseil national. Rarement une métaphore aura été prise au mot avec de telles conséquences.',
    aRetenir: [
      'Le 18 juin 1940, depuis Londres, le général de Gaulle appelle les Français à poursuivre le combat.',
      'L’appel refuse l’armistice demandé par Pétain et affirme que la guerre est mondiale, donc pas finie.',
      'Très peu de Français l’ont entendu ce soir-là : sa portée est venue plus tard.',
      'La phrase « La France a perdu une bataille… » vient de l’affiche « À tous les Français », d’août 1940.',
      'L’appel fonde la France libre ; Vichy condamne de Gaulle à mort le 2 août 1940.',
    ],
    mots: [
      {
        mot: 'France libre',
        sens: 'L’organisation fondée à Londres par de Gaulle en juin 1940 pour continuer la guerre ; elle devient la France combattante en 1942.',
      },
      {
        mot: 'Contumace',
        sens: 'Jugement rendu contre un accusé absent, qui n’a pas pu se défendre.',
      },
      {
        mot: 'Croix de Lorraine',
        sens: 'Croix à deux branches choisie comme emblème de la France libre, en réponse à la croix gammée.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'defaite-de-mai-juin-1940',
      'la-resistance',
      'regime-de-vichy',
      'winston-churchill',
    ],
    niveaux: ['3e'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'appel du 18 juin',
      'de Gaulle',
      'BBC',
      'France libre',
      'Londres',
      '1940',
      'À tous les Français',
      'croix de Lorraine',
      'Churchill',
    ],
  },
  {
    id: 'regime-de-vichy',
    volet: 'evenements',
    nom: 'Le régime de Vichy',
    date: '10 juillet 1940 – août 1944',
    tri: 1940,
    fin: 1944,
    periode: 'guerres',
    emoji: '📋',
    lieu: 'Vichy, Allier',
    accroche:
      'Le 10 juillet 1940, 569 parlementaires donnent les pleins pouvoirs à Pétain : la République s’efface, l’État français collabore et persécute.',
    citations: [
      {
        texte: 'Je fais à la France le don de ma personne pour atténuer son malheur.',
        qui: 'Le maréchal Pétain',
        contexte: 'Allocution radiodiffusée du 17 juin 1940, en prenant la tête du gouvernement.',
        sens:
          'Le vainqueur de Verdun se présente en sauveur qui se sacrifie : c’est ce prestige, et lui seul, qui rend possible le vote du 10 juillet.',
      },
      {
        texte: 'Travail, Famille, Patrie.',
        qui: 'L’État français',
        contexte:
          'Devise substituée à « Liberté, Égalité, Fraternité » dès l’été 1940, sur les pièces, les timbres et les frontons.',
        sens:
          'Trois mots qui disent le programme : l’ordre du métier, l’autorité du père, l’obéissance au chef — et non les droits de l’individu.',
      },
      {
        texte:
          'C’est dans l’honneur et pour maintenir l’unité française, une unité de dix siècles, dans le cadre d’une activité constructive du nouvel ordre européen, que j’entre aujourd’hui dans la voie de la collaboration.',
        qui: 'Le maréchal Pétain',
        contexte: 'Allocution du 30 octobre 1940, six jours après la rencontre de Montoire avec Hitler.',
      },
      {
        texte:
          'Je souhaite la victoire de l’Allemagne, car sans elle le bolchevisme demain s’installerait partout.',
        qui: 'Pierre Laval',
        contexte: 'Allocution radiodiffusée du 22 juin 1942, en annonçant la Relève des prisonniers.',
      },
    ],
    reperes: [
      'Le 10 juillet 1940, au casino de Vichy, les parlementaires votent les pleins pouvoirs constituants : 569 pour, 80 contre, 17 abstentions.',
      'Le lendemain, Pétain prend le titre de « chef de l’État français » : le mot République disparaît des textes officiels.',
      'La devise devient « Travail, Famille, Patrie », et le programme du régime s’appelle la Révolution nationale.',
      'Le statut des juifs du 3 octobre 1940 est pris par Vichy seul, sans aucune demande allemande.',
      'Montoire, le 24 octobre 1940 : la poignée de main entre Pétain et Hitler officialise la collaboration.',
      'Le STO et la Milice, tous deux en 1943, achèvent de couper le régime du pays.',
    ],
    causes: [
      'La défaite de juin 1940 et l’armistice, qui laissent un État sans armée, sans capitale et sans liberté de mouvement.',
      'Le prestige intact du vainqueur de Verdun, seul nom capable de rassurer un pays en fuite.',
      'Le discrédit d’une IIIe République accusée d’avoir perdu la guerre, dans une assemblée traumatisée et incomplète.',
      'L’absence des vingt-sept parlementaires partis au Maroc sur le Massilia pour continuer la guerre, aussitôt accusés de désertion.',
      'La manœuvre de Pierre Laval, qui obtient en trois jours le vote d’une révision constitutionnelle par l’Assemblée elle-même.',
      'Un courant antiparlementaire, antisémite et anticommuniste installé depuis les années 1930, qui voit dans la défaite l’occasion d’une revanche intérieure.',
      'Une zone occupée qui interdit de siéger à Paris : le gouvernement s’installe dans une ville d’eaux, pour ses hôtels et son central téléphonique.',
    ],
    recit: [
      {
        titre: 'Le vote du 10 juillet 1940',
        texte:
          'Le gouvernement s’est replié à **Vichy**, ville de cure choisie pour ses trois cents hôtels et son standard téléphonique. Le **10 juillet 1940**, députés et sénateurs de la IIIᵉ République se réunissent dans la salle du **casino** et votent, par **569 voix contre 80 et 17 abstentions**, une loi donnant « tous pouvoirs au gouvernement de la République, sous l’autorité et la signature du maréchal Pétain, à l’effet de promulguer une nouvelle constitution ». Les **80** qui refusent — socialistes pour la plupart — entrent dans l’histoire sous ce nombre. Vingt-sept manquent à l’appel : embarqués sur le *Massilia* vers le Maroc pour continuer la guerre, ils seront poursuivis. Dès le lendemain, les **actes constitutionnels** font de Pétain le « **chef de l’État français** » : il cumule l’exécutif et l’essentiel du législatif, désigne lui-même son successeur. Le Parlement est ajourné, les élections suspendues, le mot « République » retiré des actes officiels. La constitution promise ne verra jamais le jour.',
      },
      {
        titre: 'La Révolution nationale',
        texte:
          'Le régime ne se contente pas de gérer la défaite : il veut refaire le pays. C’est la **Révolution nationale**, dont la devise **Travail, Famille, Patrie** remplace *Liberté, Égalité, Fraternité* sur les mairies et les pièces de monnaie. La défaite y est présentée comme le châtiment d’un peuple corrompu par l’individualisme, la démocratie et le « désordre » des années 1930. On dissout les partis et les grandes centrales syndicales ; on révoque des milliers de fonctionnaires ; la loi du **13 août 1940** vise les sociétés secrètes et exclut les francs-maçons de la fonction publique ; une loi du 4 octobre 1940 permet d’**interner** les étrangers « de race juive » sur simple décision de préfet. On glorifie la terre, l’artisanat, la famille nombreuse et le chef. Les **Chantiers de la jeunesse** encadrent les garçons de vingt ans, le portrait du Maréchal entre dans les classes avec son hymne, *Maréchal, nous voilà*. Une partie du pays y adhère d’abord, par soulagement et par respect pour le vainqueur de Verdun ; cette adhésion s’effrite à mesure qu’apparaît le prix de la collaboration.',
      },
      {
        titre: 'Le statut des juifs, sans demande allemande',
        texte:
          'Le **3 octobre 1940**, Vichy promulgue le premier **statut des juifs**. Le texte définit le juif par l’ascendance et non par la religion, puis l’exclut de la fonction publique, de l’enseignement, de la magistrature, de l’armée, de la presse, du cinéma et de la radio. Le lendemain, une seconde loi autorise l’internement des juifs étrangers dans des camps français : ils seront des milliers à Gurs, à Rivesaltes, aux Milles. Un point doit être dit sans détour : **aucune autorité allemande n’avait réclamé ce texte**. Il est né d’une initiative française, et le brouillon retrouvé en 2010 porte des corrections de la main de **Pétain**, qui en a durci la portée. Un second statut, le **2 juin 1941**, étend les interdictions aux professions libérales et impose un **recensement** ; un Commissariat général aux questions juives, créé le 29 mars 1941, organise la confiscation des entreprises. Ces lois fabriquent les listes qui, deux ans plus tard, rendront les rafles possibles.',
      },
      {
        titre: 'Montoire, la police, le STO',
        texte:
          'Le **24 octobre 1940**, Pétain serre la main d’Hitler dans la gare de **Montoire** ; le 30, il annonce à la radio qu’il entre « dans la voie de la **collaboration** ». Le pari est de payer par la coopération le retour des prisonniers et une place dans l’Europe allemande ; l’Allemagne prend sans rendre. **Pierre Laval**, ramené au pouvoir en avril 1942, va plus loin. La police et la gendarmerie françaises participent aux **rafles** de juifs — les **accords Bousquet-Oberg** organisent cette coopération policière, et la rafle du **Vélodrome d’Hiver** des 16 et 17 juillet 1942 en est l’application. Pour la main-d’œuvre, la **Relève** de juin 1942 échoue, puis le **Service du travail obligatoire** (loi du **16 février 1943**) envoie de force en Allemagne environ **600 000 jeunes gens** — et en pousse des milliers d’autres vers les maquis. En janvier 1943 naît la **Milice** de Joseph Darnand, trente mille membres, qui traque, torture et assassine des résistants : c’est la guerre civile française.',
      },
      {
        titre: 'La chute et le jugement',
        texte:
          'Le **11 novembre 1942**, en réponse au débarquement allié en Afrique du Nord, la Wehrmacht envahit la **zone sud** et la flotte se saborde à Toulon. Vichy n’a plus de territoire propre, plus d’armée, plus de marge : il reste une administration et une police au service de l’occupant. En août 1944, Pétain et Laval sont emmenés en Allemagne, à **Sigmaringen**, où survit un simulacre de gouvernement. Le **9 août 1944**, l’ordonnance du Gouvernement provisoire rétablit la légalité républicaine : « la forme du gouvernement de la France est et demeure la République », et tous les actes de l’« État français » sont déclarés **nuls et non avenus**. Jugé en 1945, Laval est fusillé le **15 octobre** ; Pétain, condamné à mort le **15 août 1945**, voit sa peine commuée en détention perpétuelle par de Gaulle et meurt à l’île d’Yeu en 1951. Il faudra cinquante ans de travaux d’historiens, puis le discours de **Jacques Chirac** du 16 juillet 1995, pour que la République reconnaisse publiquement la part de l’État français dans la déportation des juifs.',
      },
    ],
    consequences: [
      'La République est suspendue quatre ans : ni élections, ni parlement, ni liberté de presse, de réunion ou de syndicat.',
      'La législation antisémite française exclut, dépouille puis recense les juifs de France, et rend les rafles matériellement possibles.',
      'Environ 75 000 juifs sont déportés de France vers les camps d’extermination ; moins de 3 % en sont revenus.',
      'La collaboration d’État — administration, police, STO, Milice — a fourni à l’occupant des moyens qu’il n’avait pas.',
      'L’ordonnance du 9 août 1944 déclare l’État français nul et non avenu : juridiquement, la République n’a jamais cessé.',
      'La responsabilité de l’État français dans la déportation des juifs n’a été reconnue publiquement qu’en 1995.',
    ],
    chiffres: [
      { valeur: '569', quoi: 'voix pour les pleins pouvoirs, contre 80' },
      { valeur: '75 000', quoi: 'juifs déportés de France, dont 11 400 enfants' },
      { valeur: '600 000', quoi: 'jeunes envoyés au travail forcé en Allemagne (STO)' },
      { valeur: '30 000', quoi: 'miliciens en 1944' },
    ],
    chrono: [
      { date: '22 juin 1940', fait: 'Armistice de Rethondes.' },
      { date: '10 juillet 1940', fait: 'Pleins pouvoirs constituants à Pétain : 569 voix contre 80.' },
      { date: '3 octobre 1940', fait: 'Premier statut des juifs, pris à l’initiative de Vichy.' },
      { date: '24 octobre 1940', fait: 'Rencontre de Montoire entre Pétain et Hitler.' },
      { date: '2 juin 1941', fait: 'Second statut des juifs et recensement obligatoire.' },
      { date: '18 avril 1942', fait: 'Retour de Pierre Laval à la tête du gouvernement.' },
      { date: '16-17 juillet 1942', fait: 'Rafle du Vélodrome d’Hiver, menée par la police française.' },
      { date: '11 novembre 1942', fait: 'L’Allemagne envahit la zone sud ; la flotte se saborde.' },
      { date: '30 janvier 1943', fait: 'Création de la Milice française.' },
      { date: '16 février 1943', fait: 'Institution du Service du travail obligatoire.' },
      { date: '20 août 1944', fait: 'Pétain est emmené en Allemagne, à Sigmaringen.' },
      { date: '15 août 1945', fait: 'Pétain est condamné à mort ; sa peine sera commuée.' },
    ],
    leSaisTu:
      'Vichy n’a jamais écrit la constitution qu’on lui avait donné mandat de rédiger. Un texte fut achevé en 1944 : il ne fut ni publié ni appliqué. Pendant quatre ans, la France a donc été gouvernée par une douzaine d’« actes constitutionnels » signés d’un seul homme, qui les modifiait quand il le jugeait utile.',
    aRetenir: [
      'Le 10 juillet 1940, 569 parlementaires votent les pleins pouvoirs constituants au maréchal Pétain.',
      'L’État français remplace la République : devise « Travail, Famille, Patrie », programme de Révolution nationale.',
      'Le statut des juifs du 3 octobre 1940 est une initiative française, que l’Allemagne n’avait pas réclamée.',
      'Après Montoire (24 octobre 1940), Vichy s’engage dans la collaboration d’État : police, rafles, STO, Milice.',
      'L’ordonnance du 9 août 1944 déclare nuls tous les actes de l’État français : la République n’a jamais cessé d’être.',
    ],
    mots: [
      {
        mot: 'État français',
        sens: 'Nom officiel du régime de Vichy, qui remplace « République française » dans les actes à partir de juillet 1940.',
      },
      {
        mot: 'Révolution nationale',
        sens: 'Programme de Vichy : autorité, retour à la terre, famille, corporations — contre la démocratie parlementaire.',
      },
      {
        mot: 'Collaboration',
        sens: 'Coopération volontaire d’un État avec l’occupant ; elle est décidée par Vichy à Montoire, en octobre 1940.',
      },
      {
        mot: 'STO',
        sens: 'Service du travail obligatoire : réquisition de jeunes Français pour les usines allemandes, à partir de février 1943.',
      },
      {
        mot: 'Milice',
        sens: 'Police politique française créée en janvier 1943, chargée de traquer résistants et juifs aux côtés de la Gestapo.',
      },
    ],
    lies: [
      'philippe-petain',
      'rafle-du-vel-d-hiv',
      'la-resistance',
      'defaite-de-mai-juin-1940',
      'la-shoah',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'Vichy',
      'État français',
      'Pétain',
      'Laval',
      'Révolution nationale',
      'collaboration',
      'Montoire',
      'statut des juifs',
      'Milice',
      'STO',
      'pleins pouvoirs',
    ],
  },
  {
    id: 'rafle-du-vel-d-hiv',
    volet: 'evenements',
    nom: 'La rafle du Vélodrome d’Hiver',
    date: '16 et 17 juillet 1942',
    tri: 1942,
    periode: 'guerres',
    emoji: '🚌',
    lieu: 'Paris et sa banlieue',
    accroche:
      'Les 16 et 17 juillet 1942, la police française arrête à Paris 13 152 juifs, dont 4 115 enfants. Moins de cent en sont revenus.',
    citations: [
      {
        texte: 'La France, ce jour-là, accomplissait l’irréparable.',
        qui: 'Jacques Chirac',
        contexte: 'Discours du 16 juillet 1995, sur le lieu même du Vélodrome d’Hiver, à Paris.',
      },
      {
        texte:
          'Les opérations devront être effectuées avec le maximum de rapidité, sans paroles inutiles et sans aucun commentaire.',
        qui: 'Émile Hennequin, directeur de la police municipale de Paris',
        contexte: 'Consignes écrites remises aux gardiens de la paix chargés des arrestations, 12 juillet 1942.',
      },
      {
        texte:
          'Les juifs sont des hommes, les juives sont des femmes. Ils font partie du genre humain. Ils sont nos frères comme tant d’autres. Un chrétien ne peut l’oublier.',
        qui: 'Monseigneur Jules-Géraud Saliège, archevêque de Toulouse',
        contexte: 'Lettre pastorale lue en chaire dans tout son diocèse le 23 août 1942, contre les rafles.',
      },
      {
        texte:
          'Ces heures noires souillent à jamais notre histoire et sont une injure à notre passé et à nos traditions.',
        qui: 'Jacques Chirac',
        contexte: 'Discours du 16 juillet 1995, où la République reconnaît la responsabilité de l’État français.',
      },
    ],
    reperes: [
      '13 152 personnes sont arrêtées : 3 031 hommes, 5 802 femmes et 4 115 enfants.',
      'L’opération, nommée « Vent printanier », est exécutée par environ 4 500 policiers et gendarmes français.',
      '8 160 personnes — les familles — sont enfermées cinq jours au Vélodrome d’Hiver, rue Nélaton.',
      'Les autres sont conduites directement à Drancy, antichambre d’Auschwitz.',
      'Dans les camps du Loiret, les enfants sont séparés de leur mère, puis déportés seuls en août 1942.',
      'Le 16 juillet 1995, Jacques Chirac reconnaît la responsabilité de l’État français.',
    ],
    causes: [
      'La décision nazie d’exterminer les juifs d’Europe, dont les modalités sont arrêtées à la conférence de Wannsee, le 20 janvier 1942.',
      'L’exigence allemande d’un contingent de déportés fourni par la France : Theodor Dannecker, représentant d’Eichmann à Paris, réclame des arrestations massives.',
      'Le choix de Vichy de faire exécuter ces arrestations par sa propre police, pour sauver l’apparence de sa souveraineté : c’est l’accord Bousquet-Oberg du 2 juillet 1942.',
      'Le fichier des juifs de la préfecture de police, constitué à partir du recensement imposé en octobre 1940 : des fiches classées par nom, par rue et par nationalité.',
      'L’étoile jaune, obligatoire en zone occupée depuis le 7 juin 1942, qui rend les familles identifiables dans la rue.',
      'La décision de Pierre Laval d’y inclure les enfants de moins de seize ans, que les Allemands n’avaient pas demandés.',
    ],
    recit: [
      {
        titre: 'Ce qui se décide en juillet 1942',
        texte:
          'Le **20 janvier 1942**, à **Wannsee**, la hiérarchie nazie organise l’extermination des juifs d’Europe ; la France occupée doit y contribuer. Le représentant d’Eichmann à Paris, **Theodor Dannecker**, réclame des arrestations par dizaines de milliers. Le **2 juillet 1942**, **René Bousquet**, secrétaire général à la police de Vichy, obtient du général SS **Oberg** que les opérations soient conduites par la **police française** : pour Vichy, c’est une affaire de souveraineté ; pour l’occupant, une économie de moyens. Le principe retenu épargne provisoirement les juifs de nationalité française et vise les **étrangers et apatrides**. Le **4 juillet**, en conseil des ministres, **Pierre Laval** propose d’y joindre les **enfants de moins de seize ans** — les Allemands ne l’avaient pas demandé et, à cette date, Berlin n’avait pas encore prévu de les déporter. L’opération reçoit un nom de code, « **Vent printanier** », et un objectif : 22 000 arrestations à Paris.',
      },
      {
        titre: 'Quatre heures du matin',
        texte:
          'Les **16 et 17 juillet 1942**, à partir de quatre heures du matin, environ **4 500 policiers et gendarmes français** se répartissent en 888 équipes, listes en main, tirées du **fichier** de la préfecture de police. Ils frappent aux portes des immeubles des 3ᵉ, 4ᵉ, 11ᵉ, 18ᵉ et 20ᵉ arrondissements et de la banlieue. Les consignes écrites interdisent tout commentaire et prescrivent d’emmener les enfants avec les parents. Le bilan est de **13 152 personnes** : 3 031 hommes, 5 802 femmes, **4 115 enfants**. Le chiffre reste très inférieur aux 22 000 prévus, et la raison de cet écart est un fait historique aussi établi que la rafle elle-même : des rumeurs avaient couru, des policiers ont prévenu la veille, des concierges, des voisins, des enseignants ont ouvert leur porte. Ce jour-là, dans la même ville, des Français ont arrêté et d’autres ont sauvé.',
      },
      {
        titre: 'Rue Nélaton',
        texte:
          'Les célibataires et les couples sans enfants — 4 992 personnes — partent directement pour **Drancy**. Les familles, **8 160 personnes**, sont conduites au **Vélodrome d’Hiver**, une piste cycliste couverte du 15ᵉ arrondissement, rue Nélaton. Elles y restent **cinq jours**. La verrière a été peinte en bleu pour la défense passive : il y fait une chaleur suffocante. Dix cabinets, un seul point d’eau, presque rien à manger, aucune sortie possible. Quelques médecins et infirmières de la Croix-Rouge et des services sociaux entrent, soignent ce qu’ils peuvent et témoigneront après la guerre. Des personnes se jettent du haut des gradins. Puis les familles sont dirigées, par trains scellés, vers les camps de **Pithiviers** et de **Beaune-la-Rolande**, dans le Loiret, gardés par des gendarmes français.',
      },
      {
        titre: 'La séparation',
        texte:
          'Début août, les ordres arrivent : les adultes partent d’abord. Dans les camps du Loiret, les **mères sont séparées de leurs enfants**, de force. Les enfants — deux à douze ans pour la plupart — restent ensuite quelques jours sans encadrement, et sans identité pour beaucoup : les plus petits ne savaient pas dire leur nom, et des infirmières ont recopié à la hâte ce qu’elles pouvaient. Puis, sur instruction obtenue de Berlin, ils sont déportés à leur tour, mêlés à des adultes inconnus pour donner aux convois l’apparence de familles. Ils passent par **Drancy**, d’où les trains partent vers l’est.',
      },
      {
        titre: 'Auschwitz',
        texte:
          'Les convois d’août 1942 arrivent à **Auschwitz-Birkenau** après trois jours de wagons à bestiaux. Les enfants, les mères et les vieillards sont **assassinés dès l’arrivée**, dans les chambres à gaz. Sur les **13 152** personnes arrêtées les 16 et 17 juillet, on compte **moins d’une centaine de survivants**, tous adultes. **Aucun des 4 115 enfants n’est revenu.** Ces chiffres ne sont pas des estimations : ils viennent des listes de convois, conservées puis publiées, et des registres des camps. On connaît les noms, un par un. Ils sont gravés sur le **Mur des Noms** du Mémorial de la Shoah, à Paris, et lus à voix haute chaque année.',
      },
      {
        titre: '1995 : la France le dit',
        texte:
          'Pendant cinquante ans, la doctrine officielle a été que la République n’était pas responsable des actes d’un régime déclaré nul et non avenu. Une **journée nationale** à la mémoire des victimes des persécutions racistes et antisémites de l’État français est fixée au 16 juillet par un décret de 1993. Puis, le **16 juillet 1995**, sur le lieu même du Vélodrome d’Hiver, le président **Jacques Chirac** énonce ce que les historiens établissaient depuis vingt ans : « la folie criminelle de l’occupant a été secondée par des Français, par l’État français ». Et il ajoute : « La France, ce jour-là, accomplissait l’irréparable. » Ce discours a changé la manière dont le pays parle de son passé. Nommer ce que des Français ont fait n’enlève rien à ceux qui ont caché, prévenu et sauvé : c’est la même exigence de vérité qui oblige à dire les deux.',
      },
    ],
    consequences: [
      'La quasi-totalité des personnes arrêtées est assassinée à Auschwitz-Birkenau dans les semaines qui suivent.',
      'La rafle marque un tournant dans l’opinion : des évêques protestent publiquement, dont Mgr Saliège le 23 août 1942.',
      'Les filières de sauvetage se multiplient : les trois quarts des juifs de France survivront, cachés par des milliers d’anonymes.',
      'Entre 1942 et 1944, environ 75 000 juifs sont déportés de France, dont 11 400 enfants.',
      'Le 16 juillet devient une journée nationale de commémoration, et le discours de 1995 engage la responsabilité de l’État.',
    ],
    chiffres: [
      { valeur: '13 152', quoi: 'personnes arrêtées les 16 et 17 juillet 1942' },
      { valeur: '4 115', quoi: 'enfants parmi elles ; aucun n’est revenu' },
      { valeur: '8 160', quoi: 'personnes enfermées cinq jours au Vélodrome d’Hiver' },
      { valeur: '4 500', quoi: 'policiers et gendarmes français mobilisés' },
    ],
    chrono: [
      { date: '20 janvier 1942', fait: 'Conférence de Wannsee : l’extermination est organisée.' },
      { date: '7 juin 1942', fait: 'L’étoile jaune devient obligatoire en zone occupée.' },
      { date: '2 juillet 1942', fait: 'Accord Bousquet-Oberg : la police française mènera les arrestations.' },
      { date: '4 juillet 1942', fait: 'Laval propose d’arrêter aussi les enfants de moins de seize ans.' },
      { date: '16 juillet 1942, 4 h', fait: 'Début de l’opération « Vent printanier » à Paris.' },
      { date: '17 juillet 1942', fait: 'Fin de la rafle : 13 152 personnes arrêtées.' },
      { date: '19-22 juillet 1942', fait: 'Transfert des familles à Pithiviers et Beaune-la-Rolande.' },
      { date: 'août 1942', fait: 'Déportation vers Auschwitz ; les enfants partent seuls.' },
      { date: '23 août 1942', fait: 'La lettre de Mgr Saliège est lue dans les églises de Toulouse.' },
      { date: '1959', fait: 'Le Vélodrome d’Hiver est démoli ; le site reste longtemps sans trace.' },
      { date: '16 juillet 1995', fait: 'Jacques Chirac reconnaît la responsabilité de l’État français.' },
    ],
    leSaisTu:
      'Le Vélodrome d’Hiver a été démoli en 1959 et remplacé par un immeuble. Pendant des décennies, une petite plaque fut la seule trace du lieu. Le monument du quai de Grenelle, devant lequel se tient la cérémonie du 16 juillet, n’a été inauguré qu’en 1994 — cinquante-deux ans après la rafle.',
    aRetenir: [
      'Les 16 et 17 juillet 1942, la police française arrête 13 152 juifs à Paris, dont 4 115 enfants.',
      'La rafle est exigée par l’occupant mais exécutée par des fonctionnaires français, selon l’accord Bousquet-Oberg.',
      'Laval fait ajouter les enfants de moins de seize ans, que les Allemands n’avaient pas réclamés.',
      'Les familles sont enfermées au Vélodrome d’Hiver puis déportées à Auschwitz via Drancy : moins de cent survivants.',
      'Le 16 juillet 1995, Jacques Chirac reconnaît publiquement la responsabilité de l’État français.',
    ],
    mots: [
      {
        mot: 'Rafle',
        sens: 'Arrestation massive et simultanée de personnes désignées à l’avance sur des listes.',
      },
      {
        mot: 'Drancy',
        sens: 'Cité inachevée de la banlieue nord transformée en camp d’internement : le point de départ de la plupart des convois de France.',
      },
      {
        mot: 'Apatride',
        sens: 'Personne qu’aucun État ne reconnaît comme son ressortissant — donc sans protection d’aucun gouvernement.',
      },
      {
        mot: 'Shoah',
        sens: 'Mot hébreu signifiant « catastrophe » : l’extermination des juifs d’Europe par l’Allemagne nazie.',
      },
    ],
    lies: ['la-shoah', 'regime-de-vichy', 'la-resistance', 'anne-frank', 'philippe-petain'],
    niveaux: ['3e', 'Tle'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'Vél d’Hiv',
      'Vélodrome d’Hiver',
      'rafle',
      '16 juillet 1942',
      'Drancy',
      'Auschwitz',
      'Chirac',
      'Bousquet',
      'Laval',
      'Shoah',
      'étoile jaune',
    ],
  },
  {
    id: 'la-resistance',
    volet: 'evenements',
    nom: 'La Résistance',
    date: '1940 – 1944',
    tri: 1943,
    fin: 1944,
    periode: 'guerres',
    emoji: '🌿',
    lieu: 'France occupée, Londres et Alger',
    accroche:
      'Refuser seul, puis à plusieurs : renseigner, imprimer, cacher, saboter — jusqu’au Conseil national qui, en 1943, parle enfin d’une seule voix.',
    citations: [
      {
        texte:
          'Résister ! C’est le cri qui sort de votre cœur à tous, dans la détresse où vous a laissés le désastre de la patrie.',
        qui: 'Boris Vildé',
        contexte:
          'Premier numéro du journal clandestin *Résistance*, 15 décembre 1940, tiré au Musée de l’Homme.',
        sens:
          'Le mot est lancé par un ethnologue de 32 ans, fusillé au Mont-Valérien en février 1942 : ce journal a donné son nom à tout le reste.',
      },
      {
        texte: 'Ami, entends-tu le vol noir des corbeaux sur nos plaines ?',
        qui: 'Joseph Kessel et Maurice Druon',
        contexte:
          'Premier vers du *Chant des partisans*, écrit à Londres en mai 1943 sur une musique d’Anna Marly.',
      },
      {
        texte: 'Je meurs sans haine en moi pour le peuple allemand.',
        qui: 'Missak Manouchian',
        contexte:
          'Dernière lettre à sa femme Mélinée, écrite au Mont-Valérien le 21 février 1944, quelques heures avant son exécution.',
      },
      {
        texte:
          'Une sécurité sociale visant à assurer à tous les citoyens des moyens d’existence, dans tous les cas où ils sont incapables de se les procurer par le travail.',
        qui: 'Le Conseil national de la Résistance',
        contexte: 'Programme adopté le 15 mars 1944, dit « Les Jours heureux ».',
        sens:
          'La Résistance ne prépare pas seulement l’insurrection : elle écrit, dans la clandestinité, les lois de la France d’après.',
      },
    ],
    reperes: [
      'Un réseau travaille pour un service — renseignement, sabotage, évasion ; un mouvement cherche à soulever l’opinion.',
      'Les premiers résistants sont très peu nombreux : quelques milliers en 1941, dans un pays de quarante millions d’habitants.',
      'Le STO de février 1943 pousse des milliers de jeunes gens vers les maquis.',
      'Jean Moulin, parachuté en janvier 1942, unifie les mouvements et réunit le CNR le 27 mai 1943.',
      'Plus de mille journaux clandestins ont été imprimés sous l’Occupation.',
      'Le programme du CNR, adopté le 15 mars 1944, dessine la France d’après-guerre.',
    ],
    causes: [
      'Le refus de l’armistice et de l’occupation, d’abord par conscience individuelle, sans organisation ni ordre reçu.',
      'L’appel du 18 juin 1940 et l’existence, à Londres, d’une autorité française qui continue la guerre.',
      'Le poids quotidien de l’occupation : réquisitions, couvre-feu, censure, otages fusillés à partir d’octobre 1941.',
      'L’entrée en guerre de l’URSS le 22 juin 1941, qui jette l’appareil communiste clandestin dans la lutte armée.',
      'Les persécutions antisémites, qui décident au sauvetage des gens jusque-là spectateurs.',
      'L’invasion de la zone sud, le 11 novembre 1942, qui ôte à Vichy son dernier argument.',
      'Le STO du 16 février 1943 : pour échapper au départ en Allemagne, des milliers de jeunes gagnent les bois.',
    ],
    recit: [
      {
        titre: 'Les premiers, presque seuls',
        texte:
          'Il n’y a pas eu d’ordre de départ. Il y a, dès l’été 1940, des gestes isolés : couper un câble téléphonique allemand, recopier l’appel du 18 juin, cacher un soldat britannique. Le **11 novembre 1940**, plusieurs milliers de lycéens et d’étudiants montent aux Champs-Élysées déposer des fleurs à l’Arc de triomphe malgré l’interdiction : c’est la première manifestation publique de refus. Autour du **Musée de l’Homme**, à Paris, des scientifiques — **Boris Vildé**, Anatole Lewitsky, Yvonne Oddon — fabriquent un journal, *Résistance*, dont le premier numéro paraît le **15 décembre 1940** ; le groupe est démantelé dès 1941 et sept de ses membres sont fusillés au **Mont-Valérien** le 23 février 1942. Le premier fusillé du refus, **Honoré d’Estienne d’Orves**, officier de marine, est tombé le 29 août 1941. Résister, à cette date, c’est être quelques milliers dans un pays de quarante millions d’habitants, et risquer sa vie pour un geste sans effet militaire visible.',
      },
      {
        titre: 'Réseaux, mouvements, maquis',
        texte:
          'Deux formes coexistent. Le **réseau** est une organisation clandestine qui travaille pour un service précis — renseignement, sabotage, évasion : *Alliance*, dirigée par **Marie-Madeleine Fourcade**, la *Confrérie Notre-Dame* de Rémy, le réseau **Comète** pour les aviateurs abattus. Le **mouvement**, lui, cherche à soulever l’opinion : en zone sud, **Combat** d’Henri Frenay, **Libération-Sud** d’Emmanuel d’Astier, **Franc-Tireur** ; en zone nord, l’*Organisation civile et militaire*, *Libération-Nord*, *Ceux de la Résistance*. Les communistes, engagés dans la lutte armée à partir de juin 1941, arment les **FTP** ; les immigrés de la **MOI**, autour de **Missak Manouchian**, mènent à Paris des actions payées par vingt-trois exécutions en février 1944 — l’Affiche rouge. Après le **STO**, des groupes vivent dans les bois et les montagnes : ce sont les **maquis**, Glières en Haute-Savoie, Vercors, Mont Mouchet — écrasés chaque fois qu’ils tiennent un terrain, redoutables quand ils harcèlent.',
      },
      {
        titre: 'Imprimer, faire passer',
        texte:
          'L’arme principale n’est pas le fusil, c’est **l’imprimé**. Plus de **mille titres clandestins** paraissent sous l’Occupation : *Combat*, *Libération*, *Franc-Tireur*, *L’Humanité* clandestine, *Défense de la France* qui tire à 450 000 exemplaires en janvier 1944. Il faut voler le papier, cacher une presse, écrire sans signer, distribuer sans se faire prendre : chaque numéro coûte des arrestations. Les **Éditions de Minuit** publient en 1942 *Le Silence de la mer* de Vercors, imprimé par fragments chez des artisans complices. À côté des mots, les **filières d’évasion** font passer en Espagne ou vers l’Angleterre les aviateurs alliés tombés en France : le seul réseau Comète en a ramené plus de sept cents. Et partout, des **faux papiers** — cartes d’identité, cartes d’alimentation, certificats de baptême. Sans eux, on ne cache personne.',
      },
      {
        titre: 'Cacher : les Justes',
        texte:
          'Sauver des juifs n’a rien de spectaculaire : c’est une chaîne de gestes qui durent des mois. Une institutrice qui change un nom sur un registre. Une ferme qui prend un enfant et ne pose pas de question. Un curé ou un pasteur qui fournit un certificat. Un policier qui prévient la veille d’une rafle. Au **Chambon-sur-Lignon**, en Haute-Loire, tout un plateau protestant abrite des centaines d’enfants pendant des années. Les réseaux de l’**OSE** et le réseau **Garel** en placent des milliers dans des familles et des institutions. L’État d’Israël a reconnu à ce jour plus de **4 000 Justes parmi les nations** en France, et l’on sait le compte incomplet : beaucoup n’ont jamais rien raconté. C’est l’une des explications du fait majeur de la période — malgré Vichy, **les trois quarts des juifs de France ont survécu**, l’une des proportions les plus élevées d’Europe occupée.',
      },
      {
        titre: 'Jean Moulin : une seule voix',
        texte:
          'Éparpillée, la Résistance ne pèse rien face aux Alliés ; et **de Gaulle** a besoin qu’elle le reconnaisse pour être reconnu lui-même. **Jean Moulin**, ancien préfet révoqué par Vichy, est parachuté en Provence dans la nuit du **1ᵉʳ janvier 1942** avec une mission : unifier, et faire passer par Londres l’argent, les armes et les liaisons radio. Il obtient d’abord la fusion des trois grands mouvements de zone sud dans les **MUR** (janvier 1943), puis l’improbable : le **27 mai 1943**, rue du Four à Paris, seize hommes représentant huit mouvements, deux syndicats et six partis politiques — communistes compris — fondent le **Conseil national de la Résistance** et reconnaissent l’autorité du général de Gaulle. Trois semaines plus tard, le **21 juin 1943**, Moulin est arrêté à **Caluire**, près de Lyon. Torturé par Klaus Barbie, il ne parle pas et meurt le 8 juillet dans le train qui l’emmène en Allemagne. Ses cendres entrent au Panthéon en décembre 1964.',
      },
      {
        titre: 'Les Jours heureux, et le prix',
        texte:
          'Le **15 mars 1944**, le CNR adopte un programme que l’on appellera « **Les Jours heureux** ». Il ne se contente pas d’organiser l’insurrection : il décrit la France d’après — **Sécurité sociale**, retraite pour les vieux travailleurs, nationalisation de l’énergie, des banques et des assurances, liberté de la presse contre les puissances d’argent, droit de vote des femmes. L’essentiel sera appliqué dès 1944-1945. Le prix payé est lourd : **1 008 résistants et otages fusillés au seul Mont-Valérien**, des dizaines de milliers de déportés dont beaucoup ne sont jamais rentrés, des villages détruits, Oradour-sur-Glane rasé le 10 juin 1944 avec 643 habitants. Sur les **1 038 compagnons de la Libération** distingués par de Gaulle, **six** seulement sont des femmes — ce qui ne dit rien du rôle réel des femmes dans la clandestinité : agents de liaison, imprimeuses, logeuses, faussaires, chefs de réseau.',
      },
    ],
    consequences: [
      'La Résistance donne à la France une légitimité politique : de Gaulle s’impose aux Alliés comme le chef d’un pays toujours en guerre.',
      'Les sabotages coordonnés autour du 6 juin 1944 retardent de plusieurs jours l’arrivée des renforts allemands en Normandie.',
      'Le programme du CNR est appliqué dès 1944-1945 : Sécurité sociale, nationalisations, droit de vote des femmes.',
      'La République revient sans vide de pouvoir : des commissaires de la République prennent les préfectures à la Libération.',
      'La France siège parmi les vainqueurs, avec une zone d’occupation en Allemagne et un siège permanent au Conseil de sécurité.',
      'La mémoire des résistants structure la vie publique : Panthéon, Mont-Valérien, ordre de la Libération.',
    ],
    chiffres: [
      { valeur: '1 000', quoi: 'journaux clandestins imprimés, au moins, sous l’Occupation' },
      { valeur: '1 008', quoi: 'résistants et otages fusillés au Mont-Valérien' },
      { valeur: '4 000', quoi: 'Justes parmi les nations reconnus en France' },
      { valeur: '1 038', quoi: 'compagnons de la Libération, dont six femmes' },
    ],
    chrono: [
      { date: '18 juin 1940', fait: 'Appel du général de Gaulle depuis Londres.' },
      { date: '11 novembre 1940', fait: 'Manifestation des étudiants à l’Arc de triomphe.' },
      { date: '15 décembre 1940', fait: 'Premier numéro du journal Résistance, au Musée de l’Homme.' },
      { date: '22 juin 1941', fait: 'Invasion de l’URSS : les communistes entrent dans la lutte armée.' },
      { date: '1ᵉʳ janvier 1942', fait: 'Jean Moulin est parachuté en Provence.' },
      { date: '16 février 1943', fait: 'Le STO pousse des milliers de jeunes vers les maquis.' },
      { date: '27 mai 1943', fait: 'Première réunion du Conseil national de la Résistance.' },
      { date: '21 juin 1943', fait: 'Arrestation de Jean Moulin à Caluire.' },
      { date: '15 mars 1944', fait: 'Le CNR adopte le programme des Jours heureux.' },
      { date: 'mars-juillet 1944', fait: 'Écrasement des maquis des Glières et du Vercors.' },
      { date: '6 juin 1944', fait: 'Débarquement : sabotages coordonnés sur les voies et les lignes.' },
      { date: 'août 1944', fait: 'Insurrections et libération de Paris.' },
    ],
    leSaisTu:
      'Le *Chant des partisans* se sifflait plus qu’il ne se chantait. Ses premières notes servaient d’indicatif à l’émission « Honneur et Patrie » de la BBC : sifflées, elles traversaient le brouillage allemand — et on pouvait les siffler dans la rue sans que personne puisse rien prouver.',
    aRetenir: [
      'La Résistance rassemble des réseaux (renseignement, évasion, sabotage) et des mouvements (opinion, presse clandestine).',
      'Elle est très minoritaire en 1940-1941 et grossit surtout après l’instauration du STO, en février 1943.',
      'Jean Moulin unifie la Résistance : le CNR se réunit pour la première fois le 27 mai 1943, rue du Four à Paris.',
      'Le programme du CNR du 15 mars 1944 prépare la Sécurité sociale, les nationalisations et le vote des femmes.',
      'Des milliers de Justes ont caché des juifs : les trois quarts des juifs de France ont survécu.',
    ],
    mots: [
      {
        mot: 'Maquis',
        sens: 'Groupe de résistants vivant cachés dans les bois ou la montagne, surtout à partir de 1943.',
      },
      {
        mot: 'Réseau',
        sens: 'Organisation clandestine au service d’une tâche précise : renseigner, saboter, faire évader.',
      },
      {
        mot: 'CNR',
        sens: 'Conseil national de la Résistance, fondé le 27 mai 1943 par Jean Moulin : mouvements, syndicats et partis réunis.',
      },
      {
        mot: 'FFI',
        sens: 'Forces françaises de l’intérieur : l’armée unifiée de la Résistance, créée en février 1944.',
      },
      {
        mot: 'Juste parmi les nations',
        sens: 'Titre décerné par l’État d’Israël à ceux qui ont sauvé des juifs au péril de leur vie, sans contrepartie.',
      },
    ],
    lies: [
      'jean-moulin',
      'charles-de-gaulle',
      'lucie-aubrac',
      'missak-manouchian',
      'liberation-de-paris',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'Résistance',
      'Jean Moulin',
      'CNR',
      'maquis',
      'presse clandestine',
      'Justes',
      'FFI',
      'Chant des partisans',
      'Affiche rouge',
      'Jours heureux',
      'Mont-Valérien',
    ],
  },
  {
    id: 'liberation-de-paris',
    volet: 'evenements',
    nom: 'La libération de Paris',
    date: '19 – 25 août 1944',
    tri: 1944,
    periode: 'guerres',
    emoji: '🔔',
    lieu: 'Paris',
    accroche:
      'Paris se soulève sans attendre les chars : six jours de barricades, la 2e DB entre le 24 au soir, et von Choltitz capitule sans avoir brûlé la ville.',
    citations: [
      {
        texte:
          'Paris ! Paris outragé ! Paris brisé ! Paris martyrisé ! mais Paris libéré ! libéré par lui-même, libéré par son peuple avec le concours des armées de la France.',
        qui: 'Charles de Gaulle',
        contexte: 'Discours improvisé à l’Hôtel de Ville de Paris, le 25 août 1944 en fin d’après-midi.',
      },
      {
        texte:
          'La République n’a jamais cessé d’être. Vichy fut toujours et demeure nul et non avenu. Pourquoi irais-je la proclamer ?',
        qui: 'Charles de Gaulle',
        contexte:
          'À Georges Bidault, président du CNR, qui lui demandait de proclamer la République au balcon, le 25 août 1944.',
        sens:
          'Proclamer la République reviendrait à admettre qu’elle avait disparu — donc à reconnaître une légitimité à Vichy.',
      },
      {
        texte:
          'Paris ne doit pas tomber aux mains de l’ennemi, ou, s’il le fait, il ne doit trouver là que des ruines.',
        qui: 'Adolf Hitler',
        contexte: 'Ordre transmis au général von Choltitz, gouverneur militaire du Grand Paris, le 23 août 1944.',
      },
      {
        texte: 'Dronne, filez sur Paris, entrez dans Paris !',
        qui: 'Le général Leclerc',
        contexte: 'Au capitaine Raymond Dronne, sur la route d’Antony, le 24 août 1944 en fin d’après-midi.',
        sens:
          'Dronne part le soir même avec trois chars et onze half-tracks et atteint l’Hôtel de Ville à 21 h 22.',
      },
    ],
    reperes: [
      'Eisenhower voulait contourner Paris ; l’insurrection parisienne l’a obligé à changer de plan.',
      'Le 19 août, des policiers résistants s’emparent de la préfecture de police et y hissent le drapeau tricolore.',
      'Six cents barricades sont dressées dans les rues, surtout au Quartier latin et dans l’est parisien.',
      'Le 24 août à 21 h 22, les premiers blindés de la 2e DB atteignent l’Hôtel de Ville : les cloches sonnent.',
      'Le 25 août, le général von Choltitz signe la capitulation sans avoir exécuté l’ordre de détruire la ville.',
      'Le 26 août, de Gaulle descend les Champs-Élysées à pied devant une foule immense.',
    ],
    causes: [
      'La percée d’Avranches et la fin de la bataille de Normandie, qui mettent les Alliés à quelques jours de Paris en août 1944.',
      'Le choix initial d’Eisenhower de contourner la capitale, pour éviter une bataille de rues et la charge de ravitailler quatre millions d’habitants.',
      'La volonté politique de De Gaulle : Paris doit être libéré par des Français, sinon les Alliés administreront le pays eux-mêmes.',
      'La décision du Comité parisien de la Libération et du colonel Rol-Tanguy de lancer l’insurrection sans attendre les chars.',
      'La vague de grèves : cheminots le 10 août, police le 15, postiers et agents du métro ensuite.',
      'Une garnison allemande affaiblie, commandée par un général qui n’a ni les moyens ni la volonté de raser la ville.',
    ],
    recit: [
      {
        titre: 'Les grèves, puis l’insurrection',
        texte:
          'Août 1944 : les Alliés ont percé à Avranches, les colonnes allemandes refluent, et Paris manque de tout. Le **10 août**, les cheminots se mettent en grève ; le **15**, c’est la police parisienne, suivie des postiers et du métro. Le **18 août**, des affiches du Comité parisien de la Libération et du colonel **Rol-Tanguy**, chef des FFI d’Île-de-France, appellent à l’insurrection. Le **19 août au matin**, environ deux mille policiers résistants s’emparent de la **préfecture de police**, en face de Notre-Dame, et y hissent le drapeau tricolore : c’est le premier grand bâtiment public repris. Les mairies d’arrondissement tombent une à une. Les FFI parisiens sont une vingtaine de milliers pour quelques milliers d’armes seulement ; ils prennent le reste aux patrouilles allemandes.',
      },
      {
        titre: 'Six cents barricades',
        texte:
          'On dépave les rues comme en 1830, en 1848 et en 1871 : **six cents barricades** s’élèvent, faites de pavés, d’arbres abattus, de grilles arrachées et de voitures renversées, surtout au **Quartier latin** et dans l’est parisien. Le consul général de Suède **Raoul Nordling** négocie le **20 août** une trêve pour éviter le massacre ; elle est contestée par Rol-Tanguy, respectée par endroits, rompue partout le 22. Les combats sont des combats de rue : embuscades contre les convois, attaques de camions isolés, tireurs aux fenêtres. Les Allemands répliquent au canon et incendient le Grand Palais le 23 août. Paris est sans électricité, sans transports et presque sans pain — et l’insurrection est un pari : si les Alliés ne viennent pas, la ville sera écrasée comme Varsovie, où l’insurrection agonise au même moment.',
      },
      {
        titre: 'Faire venir les chars',
        texte:
          'Des émissaires franchissent les lignes pour convaincre les Américains : Nordling, et le commandant **Gallois**, envoyé par Rol-Tanguy. **Leclerc**, sans attendre l’autorisation, pousse en avant un détachement de reconnaissance. Le **22 août**, Eisenhower cède : la **2ᵉ division blindée** ira sur Paris. Partie de Normandie, elle couvre deux cents kilomètres en deux jours, ralentie autant par la foule des villages que par les combats de la Croix-de-Berny. Le **24 août en fin d’après-midi**, Leclerc ordonne au capitaine **Dronne** de filer droit devant. À **21 h 22**, trois chars et onze half-tracks de la 9ᵉ compagnie débouchent sur la place de l’Hôtel-de-Ville. La radio annonce leur arrivée ; le bourdon de **Notre-Dame** sonne, puis toutes les cloches de Paris, dans la nuit. Beaucoup de Parisiens ont dit n’avoir rien entendu d’aussi fort de toute la guerre.',
      },
      {
        titre: '25 août : la capitulation',
        texte:
          'Le **25 août au matin**, la 2ᵉ DB entre par plusieurs portes, appuyée par la 4ᵉ division d’infanterie américaine. On se bat sur les points d’appui allemands : **École militaire**, **Palais-Bourbon**, place de la République, hôtel **Majestic**. En début d’après-midi, un détachement atteint l’hôtel **Meurice**, quartier général du général **von Choltitz**, gouverneur militaire du Grand Paris. Il se rend. À la préfecture de police, puis à la gare **Montparnasse** devant Leclerc, il signe la **capitulation** et ordonne à ses points d’appui de cesser le feu ; sur l’exigence de la Résistance, **Rol-Tanguy** signe également le document. Les ponts et les grands monuments avaient été minés : **rien n’a sauté**. Von Choltitz n’a pas exécuté l’ordre de détruire Paris — calcul d’un officier qui savait la guerre perdue, ou refus : les historiens en discutent encore, mais le fait est là.',
      },
      {
        titre: 'L’Hôtel de Ville, et le lendemain',
        texte:
          'En fin d’après-midi, **de Gaulle** arrive. Il passe d’abord au ministère de la Guerre, rue Saint-Dominique — manière de dire que l’État n’a pas changé d’adresse — avant de gagner l’**Hôtel de Ville**, où l’attend le **CNR**. **Georges Bidault** lui demande de proclamer la République au balcon. Refus : « La **République n’a jamais cessé d’être**… Vichy fut toujours et demeure nul et non avenu. » Puis il improvise le discours que l’on connaît : « Paris ! Paris outragé ! Paris brisé ! Paris martyrisé ! mais Paris **libéré** ! » Le lendemain, **26 août**, il descend les **Champs-Élysées** à pied, de l’Étoile à Notre-Dame, devant une foule estimée à deux millions de personnes, malgré des coups de feu tirés sur les parvis. La photographie fait le tour du monde : elle dit que la France a un chef, et que ce chef est l’homme du 18 juin.',
      },
    ],
    consequences: [
      'Paris est intact : ni les ponts, ni les monuments, ni les usines n’ont été détruits.',
      'Le Gouvernement provisoire s’installe aussitôt : il n’y aura pas d’administration militaire alliée en France.',
      'La légitimité de De Gaulle est scellée par le défilé du 26 août ; les Alliés reconnaissent son gouvernement le 23 octobre 1944.',
      'Les combats ont coûté la vie à environ mille FFI et six cents civils en six jours.',
      'Le récit de « Paris libéré par lui-même » s’installe, au risque d’effacer la part des Alliés et le fait que la guerre durera encore huit mois.',
      'La République reprend ses droits : commissaires de la République dans les préfectures, ordonnances, préparation du vote des femmes.',
    ],
    chiffres: [
      { valeur: '600', quoi: 'barricades dressées dans Paris' },
      { valeur: '21 h 22', quoi: 'l’heure où le premier blindé atteint l’Hôtel de Ville' },
      { valeur: '1 600', quoi: 'résistants et civils tués pendant les combats' },
      { valeur: '16 000', quoi: 'hommes dans la 2ᵉ division blindée de Leclerc' },
    ],
    chrono: [
      { date: '6 juin 1944', fait: 'Débarquement de Normandie.' },
      { date: '10 août 1944', fait: 'Grève des cheminots parisiens.' },
      { date: '15 août 1944', fait: 'Grève de la police parisienne.' },
      { date: '19 août 1944', fait: 'Prise de la préfecture de police : l’insurrection commence.' },
      { date: '20 août 1944', fait: 'Trêve négociée par le consul Nordling, aussitôt contestée.' },
      { date: '22 août 1944', fait: 'Eisenhower autorise la 2e DB à marcher sur Paris.' },
      { date: '24 août 1944, 21 h 22', fait: 'Le détachement Dronne atteint l’Hôtel de Ville.' },
      { date: '25 août 1944', fait: 'Capitulation de von Choltitz ; discours de De Gaulle.' },
      { date: '26 août 1944', fait: 'Descente des Champs-Élysées.' },
      { date: '23 octobre 1944', fait: 'Les Alliés reconnaissent le gouvernement provisoire.' },
    ],
    leSaisTu:
      'Les premiers véhicules entrés dans Paris portaient des noms espagnols : *Guadalajara*, *Teruel*, *Madrid*, *Guernica*. La 9ᵉ compagnie du capitaine Dronne, « la Nueve », était composée en majorité de républicains espagnols exilés en 1939. Ils libéraient Paris faute d’avoir pu garder Madrid.',
    aRetenir: [
      'L’insurrection parisienne commence le 19 août 1944 avec la prise de la préfecture de police.',
      'Les Parisiens dressent environ 600 barricades ; les FFI sont commandés par le colonel Rol-Tanguy.',
      'La 2e DB du général Leclerc entre dans Paris le 24 août au soir ; la ville est libérée le 25.',
      'Le général von Choltitz capitule sans exécuter l’ordre d’Hitler de détruire la ville.',
      'Le 25 août, de Gaulle refuse de proclamer la République : pour lui, elle n’a jamais cessé d’exister.',
    ],
    mots: [
      {
        mot: 'FFI',
        sens: 'Forces françaises de l’intérieur : les combattants de la Résistance réunis sous un commandement unique.',
      },
      {
        mot: 'Capitulation',
        sens: 'Reddition signée par un chef militaire, qui n’engage que ses troupes — à la différence d’un armistice.',
      },
      {
        mot: '2e DB',
        sens: 'La 2ᵉ division blindée du général Leclerc, unité française de l’armée alliée, formée en Afrique du Nord.',
      },
      {
        mot: 'Gouvernement provisoire',
        sens: 'Le GPRF, formé par de Gaulle à Alger en 1944, qui gouverne la France jusqu’aux élections de 1945.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'marechal-leclerc',
      'la-resistance',
      'debarquement-du-6-juin-1944',
      'regime-de-vichy',
    ],
    niveaux: ['3e'],
    programme: 'La France défaite et occupée. Régime de Vichy, collaboration, Résistance',
    tags: [
      'libération de Paris',
      'Leclerc',
      '2e DB',
      'Rol-Tanguy',
      'von Choltitz',
      'barricades',
      'août 1944',
      'Hôtel de Ville',
      'Champs-Élysées',
      'la Nueve',
    ],
  },
]
