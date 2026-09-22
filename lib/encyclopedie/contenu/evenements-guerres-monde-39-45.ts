// -----------------------------------------------------------------------------
// LA SECONDE GUERRE MONDIALE — LE MONDE. Sept fiches : comment la guerre
// commence (1939), comment elle devient une guerre d'anéantissement à l'Est
// (1941), comment elle devient mondiale (Pearl Harbor), ce qu'elle a produit de
// pire (la Shoah), où elle bascule (Stalingrad), comment l'Ouest se rouvre
// (6 juin 1944) et comment elle finit (Hiroshima).
//
// LA FICHE `la-shoah` EST LA PLUS GRAVE DE L'ENCYCLOPÉDIE. Elle est écrite
// selon la consigne du guide (docs/encyclopedie.md, § 3) : factuelle, précise,
// sobre — la précision fait plus d'effet que l'indignation. Les étapes sont
// datées, les chiffres sont ceux que les historiens établissent, et LES VOIX
// CITÉES SONT CELLES DES TÉMOINS ET DES SURVIVANTS — Primo Levi, Simone Veil,
// Anne Frank, Elie Wiesel — jamais celles des bourreaux. Aucun détail gratuit,
// aucune image de sensation : ce qui s'est passé suffit.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_GUERRES_MONDE_39_45: Evenement[] = [
  {
    id: 'debut-de-la-seconde-guerre-mondiale',
    volet: 'evenements',
    nom: 'Le début de la Seconde Guerre mondiale',
    date: '1ᵉʳ septembre 1939',
    tri: 1939,
    periode: 'guerres',
    emoji: '⚔️',
    lieu: 'La Pologne, puis toute l’Europe',
    accroche:
      'Le 1ᵉʳ septembre 1939, l’Allemagne entre en Pologne sans déclarer la guerre ; deux jours plus tard, Londres et Paris déclarent la leur.',
    citations: [
      {
        texte: 'Ce pays est en guerre avec l’Allemagne.',
        qui: 'Neville Chamberlain',
        contexte:
          'À la radio de la BBC, le 3 septembre 1939 à 11 h 15, après l’expiration de l’ultimatum britannique.',
        sens:
          'L’homme qui avait signé les accords de Munich un an plus tôt annonce lui-même l’échec de sa politique d’apaisement.',
      },
      {
        texte: 'Nous avons subi une défaite totale et sans atténuation.',
        qui: 'Winston Churchill',
        contexte:
          'Aux Communes, le 5 octobre 1938, dans le débat sur les accords de Munich — il est alors presque seul de cet avis.',
      },
      {
        texte:
          'Vous aviez le choix entre le déshonneur et la guerre. Vous avez choisi le déshonneur, et vous aurez la guerre.',
        qui: 'Winston Churchill',
        contexte: 'Phrase prêtée à Churchill s’adressant à Chamberlain après Munich, en 1938.',
        sens:
          'Elle résume exactement sa pensée, mais elle ne figure dans aucun compte rendu officiel des débats : c’est une reconstitution postérieure.',
        incertaine: true,
      },
    ],
    reperes: [
      '23 août 1939 : le pacte germano-soviétique partage secrètement la Pologne entre Berlin et Moscou.',
      '1ᵉʳ septembre 1939 : 1,5 million de soldats allemands entrent en Pologne, sans déclaration de guerre.',
      '3 septembre : le Royaume-Uni, puis la France, déclarent la guerre à l’Allemagne.',
      '17 septembre : l’Armée rouge envahit la Pologne par l’est ; Varsovie capitule le 27.',
      'De septembre 1939 à mai 1940, le front de l’Ouest ne bouge pas : c’est la « drôle de guerre ».',
    ],
    causes: [
      'Le traité de Versailles (1919), vécu en Allemagne comme un *Diktat* : territoires perdus, réparations, armée limitée à 100 000 hommes.',
      'La crise de 1929 et ses six millions de chômeurs allemands, qui portent Hitler à la chancellerie en janvier 1933.',
      'Le réarmement allemand et les coups de force successifs : Rhénanie remilitarisée (1936), Anschluss de l’Autriche (mars 1938), Sudètes puis Prague (1938-1939).',
      'La politique d’apaisement des démocraties, scellée aux accords de Munich le 30 septembre 1938.',
      'Le pacte germano-soviétique du 23 août 1939 : son protocole secret garantit à Hitler qu’il n’aura pas de second front à l’Est.',
      'L’ultimatum allemand sur Dantzig et le corridor polonais, refusé par Varsovie que Londres et Paris ont garantie depuis le 31 mars 1939.',
    ],
    recit: [
      {
        titre: 'Vingt ans de sursis',
        texte:
          'La guerre de 1939 se prépare depuis 1919. Le **traité de Versailles** a laissé l’Allemagne amputée, endettée et humiliée ; la **crise de 1929** y jette six millions de chômeurs. En janvier **1933**, Hitler devient chancelier et démonte l’ordre issu de Versailles pièce par pièce : service militaire rétabli en 1935, **Rhénanie** remilitarisée en 1936, **Autriche** annexée en mars 1938. À chaque fois, la France et le Royaume-Uni protestent et cèdent : c’est la politique d’**apaisement**, portée par des opinions publiques que la saignée de 1914-1918 a rendues pacifistes. Aux **accords de Munich**, le 30 septembre 1938, Chamberlain et Daladier livrent à l’Allemagne les Sudètes tchécoslovaques et rentrent acclamés. Six mois plus tard, le 15 mars 1939, la Wehrmacht entre à Prague : la Tchécoslovaquie disparaît, et l’apaisement avec elle. Le 31 mars, Londres et Paris garantissent la **Pologne**. La prochaine crise sera la guerre.',
      },
      {
        titre: 'Le pacte de deux ennemis',
        texte:
          'Le **23 août 1939**, le monde apprend une nouvelle que personne n’attendait : l’Allemagne nazie et l’URSS communiste, ennemies déclarées depuis quinze ans, signent à Moscou un **pacte de non-agression**. Ribbentrop et Molotov y joignent un **protocole secret** qui partage l’Europe orientale : la Pologne est coupée en deux, les pays baltes et la Bessarabie reviennent à Moscou. Pour Staline, c’est du temps gagné pour réarmer une Armée rouge décapitée par les purges. Pour Hitler, c’est l’assurance décisive : il pourra écraser la Pologne **sans second front**. Les partis communistes d’Europe, sommés de justifier l’accord, y perdent des milliers de militants. Neuf jours plus tard, la guerre commence.',
      },
      {
        titre: 'La Pologne en trente-six jours',
        texte:
          'Le **1ᵉʳ septembre 1939 à 4 h 45**, sans déclaration de guerre, 1,5 million de soldats allemands franchissent la frontière pendant que le cuirassé *Schleswig-Holstein* ouvre le feu sur la presqu’île de Westerplatte, à Dantzig. C’est la première démonstration de la **Blitzkrieg** : l’aviation détruit les terrains et les voies ferrées, les colonnes blindées percent et encerclent, l’infanterie nettoie. L’armée polonaise, courageuse mais dispersée et sans blindés modernes, est coupée en morceaux. Le **3 septembre**, le Royaume-Uni puis la France déclarent la guerre à l’Allemagne — sans attaquer. Le **17 septembre**, l’Armée rouge entre à son tour en Pologne par l’est, conformément au protocole secret. **Varsovie capitule le 27 septembre** après un bombardement qui fait 25 000 morts civils. En trente-six jours, un État de 35 millions d’habitants a cessé d’exister ; son gouvernement part en exil, son armée continue à se battre ailleurs.',
      },
      {
        titre: 'La drôle de guerre',
        texte:
          'À l’Ouest, il ne se passe rien. L’armée française mobilise cinq millions d’hommes, avance de quelques kilomètres en Sarre en septembre, puis se retire derrière la **ligne Maginot** et attend. Les Anglais parlent de *phoney war*, les Allemands de *Sitzkrieg* — la guerre assise ; les Français diront la **drôle de guerre**. Huit mois d’ennui, de froid et de tracts, où l’on distribue des ballons de football aux soldats et où les permissions reprennent. Le doute est déjà là : un éditorialiste avait titré, le 4 mai 1939, « Mourir pour Dantzig ? », et beaucoup se demandent pour quoi ils sont là. Pendant ce temps, l’Allemagne digère la Pologne, envahit le Danemark et la Norvège en avril 1940, et met au point le plan qui percera par les Ardennes. Le **10 mai 1940**, l’attente s’achève : l’offensive à l’Ouest commence, et Churchill entre le jour même à Downing Street.',
      },
    ],
    consequences: [
      'La Pologne est rayée de la carte et partagée entre l’Allemagne et l’URSS ; son occupation inaugure une guerre raciale (ghettos dès 1939, exécutions de l’élite polonaise).',
      'L’Europe entre dans un conflit qui durera six ans et fera environ 60 millions de morts.',
      'La drôle de guerre laisse l’initiative à l’Allemagne, qui prépare tranquillement l’offensive à l’Ouest.',
      'La faillite de l’apaisement emporte Chamberlain : Churchill devient Premier ministre le 10 mai 1940.',
      'Les empires coloniaux entrent en guerre avec leurs métropoles : le conflit est mondial dès 1939.',
      'Le pacte germano-soviétique tiendra vingt-deux mois, jusqu’à l’invasion de l’URSS le 22 juin 1941.',
    ],
    chiffres: [
      { valeur: '1,5 million', quoi: 'de soldats allemands engagés en Pologne' },
      { valeur: '36 jours', quoi: 'de résistance polonaise avant la capitulation' },
      { valeur: '8 mois', quoi: 'de « drôle de guerre » sur le front de l’Ouest' },
      { valeur: '60 millions', quoi: 'de morts au total, dans les six ans qui suivent' },
    ],
    chrono: [
      { date: '30 septembre 1938', fait: 'Accords de Munich : les Sudètes livrées à l’Allemagne.' },
      { date: '15 mars 1939', fait: 'La Wehrmacht entre à Prague ; l’apaisement s’effondre.' },
      { date: '23 août 1939', fait: 'Pacte germano-soviétique et protocole secret.' },
      { date: '1ᵉʳ septembre 1939', fait: 'L’Allemagne envahit la Pologne.' },
      { date: '3 septembre 1939', fait: 'Le Royaume-Uni et la France déclarent la guerre.' },
      { date: '17 septembre 1939', fait: 'L’Armée rouge entre en Pologne par l’est.' },
      { date: '27 septembre 1939', fait: 'Capitulation de Varsovie.' },
      { date: '10 mai 1940', fait: 'Offensive allemande à l’Ouest : fin de la drôle de guerre.' },
    ],
    leSaisTu:
      'Le 4 mai 1939, un éditorial français titrait « Mourir pour Dantzig ? » pour dire qu’une ville lointaine ne valait pas une guerre. La formule a fait le tour du pays. Quatre mois plus tard, la guerre a commencé par Dantzig — et la France y a perdu environ 600 000 vies.',
    aRetenir: [
      'Le 1ᵉʳ septembre 1939, l’Allemagne envahit la Pologne sans déclaration de guerre.',
      'Le pacte germano-soviétique du 23 août 1939 partage secrètement la Pologne et libère Hitler d’un second front.',
      'Le 3 septembre 1939, le Royaume-Uni puis la France déclarent la guerre à l’Allemagne.',
      'Les accords de Munich (30 septembre 1938) sont le symbole de l’apaisement, qui n’a pas empêché la guerre.',
      'De septembre 1939 à mai 1940, le front de l’Ouest reste immobile : c’est la drôle de guerre.',
    ],
    mots: [
      {
        mot: 'Blitzkrieg',
        sens: 'Guerre éclair : percée rapide des blindés appuyés par l’aviation, pour éviter la guerre de tranchées.',
      },
      {
        mot: 'Apaisement',
        sens: 'Politique consistant à céder aux exigences d’un État agressif pour éviter la guerre.',
      },
      {
        mot: 'Wehrmacht',
        sens: 'Nom de l’ensemble des forces armées allemandes de 1935 à 1945.',
      },
      {
        mot: 'Drôle de guerre',
        sens: 'Les huit mois d’attente sans combats sur le front franco-allemand, de septembre 1939 à mai 1940.',
      },
    ],
    lies: [
      'adolf-hitler',
      'winston-churchill',
      'traite-de-versailles',
      'defaite-de-mai-juin-1940',
      'operation-barbarossa',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Seconde Guerre mondiale',
      '1939',
      'Pologne',
      'Dantzig',
      'pacte germano-soviétique',
      'Munich',
      'apaisement',
      'Blitzkrieg',
      'drôle de guerre',
      'Chamberlain',
      'Hitler',
    ],
  },
  {
    id: 'operation-barbarossa',
    volet: 'evenements',
    nom: 'L’opération Barbarossa',
    date: '22 juin 1941',
    tri: 1941,
    periode: 'guerres',
    emoji: '❄️',
    lieu: 'De la Baltique à la mer Noire, en URSS',
    accroche:
      'Le 22 juin 1941, 3,5 millions d’hommes franchissent la frontière soviétique : la plus grande invasion de l’histoire ouvre une guerre d’anéantissement.',
    citations: [
      {
        texte: 'Notre cause est juste. L’ennemi sera battu. La victoire sera à nous.',
        qui: 'Viatcheslav Molotov',
        contexte:
          'À la radio soviétique, le 22 juin 1941 à midi, quelques heures après le début de l’invasion.',
        sens:
          'Les trois phrases deviennent le slogan de guerre de l’URSS : on les retrouve sur les affiches jusqu’en 1945.',
      },
      {
        texte: 'Camarades ! Citoyens ! Frères et sœurs !',
        qui: 'Staline',
        contexte: 'Premier discours radiodiffusé après l’invasion, le 3 juillet 1941.',
        sens:
          'Il s’adresse au pays comme à une famille et non comme à un parti : la guerre sera dite « patriotique », pas communiste.',
      },
      {
        texte: 'Tout homme ou tout État qui combat le nazisme aura notre aide.',
        qui: 'Winston Churchill',
        contexte:
          'À la BBC, le soir du 22 juin 1941 : l’anticommuniste le plus déterminé d’Angleterre tend la main à Staline.',
      },
      {
        texte: 'Nous avons sous-estimé le colosse russe.',
        qui: 'Franz Halder',
        contexte:
          'Dans le journal du chef d’état-major de l’armée de terre allemande, le 11 août 1941, sept semaines après l’attaque.',
      },
    ],
    reperes: [
      'Trois groupes d’armées, 3,5 millions d’hommes, environ 3 600 chars, sur un front de 3 000 km.',
      'En cinq mois, la Wehrmacht avance de 1 000 km et prend Minsk, Smolensk et Kiev.',
      'La « directive sur les commissaires » ordonne d’exécuter les prisonniers politiques : c’est une guerre d’anéantissement.',
      'Derrière le front, les Einsatzgruppen fusillent les juifs par villages entiers.',
      'Décembre 1941 : l’offensive s’arrête à 30 km de Moscou ; la contre-offensive soviétique part le 5 décembre.',
    ],
    causes: [
      'L’idéologie nazie du *Lebensraum*, l’« espace vital » à conquérir à l’Est pour y installer des colons allemands.',
      'La haine raciale du « judéo-bolchevisme », désigné dès les années 1920 comme l’ennemi à détruire.',
      'L’échec de la bataille d’Angleterre (1940) : faute de pouvoir débarquer outre-Manche, Hitler se retourne vers l’Est.',
      'Le besoin de ressources : le blé d’Ukraine, le charbon du Donbass, le pétrole du Caucase.',
      'La certitude allemande qu’une Armée rouge décapitée par les purges de 1937-1938 s’effondrera en quelques semaines.',
      'La directive n° 21, signée le 18 décembre 1940, qui fixe l’invasion bien avant que la guerre à l’Ouest ne soit réglée.',
    ],
    recit: [
      {
        titre: 'Un pacte fait pour être rompu',
        texte:
          'Le pacte de 1939 n’a jamais été autre chose qu’un délai. Pendant vingt-deux mois, l’URSS livre à l’Allemagne du blé, du pétrole et du manganèse — un train de marchandises passe encore la frontière le matin du 22 juin. Mais dès le **18 décembre 1940**, Hitler signe la **directive n° 21**, « Barbarossa », du nom de l’empereur médiéval Frédéric Barberousse. L’objectif n’est pas seulement militaire : il s’agit de conquérir un **espace vital**, d’asservir les populations slaves et de détruire ce que le nazisme appelle le « judéo-bolchevisme ». Le plan prévoit d’atteindre la ligne Arkhangelsk-Astrakhan **avant l’hiver**, en une campagne de dix semaines. Staline, averti par ses espions et par Churchill, refuse d’y croire et interdit à ses généraux toute mesure qui pourrait passer pour une provocation.',
      },
      {
        titre: 'Le 22 juin, à l’aube',
        texte:
          'L’attaque part le **22 juin 1941 vers 3 h 15**, sur un front de **3 000 km**, de la Baltique à la mer Noire. Trois groupes d’armées : au nord vers Leningrad, au centre vers Moscou, au sud vers Kiev et l’Ukraine. En une seule journée, la Luftwaffe détruit au sol plus de **1 200 avions soviétiques**. Les panzers percent, se referment en tenailles et enferment des armées entières : **300 000 prisonniers** à Minsk en juillet, autant à Smolensk, **665 000** à Kiev en septembre — les plus grands encerclements de l’histoire militaire. Leningrad est coupée du reste du pays le 8 septembre : son siège durera 900 jours et fera environ un million de morts civils. À l’automne, l’Allemagne a pris un territoire grand comme cinq fois la France et croit la guerre gagnée.',
      },
      {
        titre: 'Une guerre d’un autre genre',
        texte:
          'Barbarossa n’est pas une campagne comme celle de France. Avant même l’attaque, des ordres écrits en font une **guerre d’anéantissement** : la « directive sur les commissaires » prescrit de fusiller sur place les cadres politiques capturés, et le « plan de la faim » prévoit froidement d’affamer les villes soviétiques pour nourrir l’Allemagne. Sur **5,7 millions de prisonniers** soviétiques, environ **3,3 millions meurent** en captivité, de faim, de froid et d’exécutions. Derrière les lignes suivent quatre **Einsatzgruppen**, groupes mobiles de tuerie appuyés par des bataillons de police et des auxiliaires locaux : c’est le début de la **Shoah par balles**, qui fera environ un million et demi de victimes juives sur le territoire soviétique. Les **29 et 30 septembre 1941**, au ravin de **Babi Yar** près de Kiev, 33 771 juifs sont assassinés en deux jours.',
      },
      {
        titre: 'L’hiver devant Moscou',
        texte:
          'Le calendrier craque. En octobre, la **raspoutitsa** — la saison des boues — immobilise les camions et les chars dans un cloaque de trois semaines. Puis le gel arrive, jusqu’à **−30 °C** en décembre, sur une armée équipée pour une campagne d’été : les moteurs refusent de démarrer, les armes s’enrayent, les gelures font plus de pertes que les combats. L’offensive « Typhon » atteint les faubourgs de Moscou — des éclaireurs allemands aperçoivent les clochers du Kremlin à une trentaine de kilomètres — et s’y arrête. Staline, lui, a osé dégarnir sa frontière d’Extrême-Orient : prévenu par son espion Richard Sorge que le Japon attaquerait au sud, il ramène des divisions sibériennes entraînées au froid. Le **5 décembre 1941**, Joukov lance la contre-offensive et repousse la Wehrmacht de 100 à 250 km. La guerre éclair a échoué : il faudra en faire une guerre longue, et l’Allemagne n’en a pas les moyens.',
      },
    ],
    consequences: [
      'L’échec devant Moscou ruine la stratégie de guerre éclair : l’Allemagne doit tenir une guerre longue sur plusieurs fronts.',
      'Le front de l’Est devient le théâtre principal du conflit : l’essentiel des pertes allemandes y sera subi.',
      'L’URSS rejoint la coalition alliée ; l’aide américaine du prêt-bail commence à affluer par l’Iran et Mourmansk.',
      'Les Einsatzgruppen ouvrent la « Shoah par balles » : environ un million et demi de juifs fusillés sur place.',
      'Sur 5,7 millions de prisonniers soviétiques, environ 3,3 millions meurent en captivité allemande.',
      'Le siège de Leningrad (1941-1944) fait à lui seul environ un million de morts civils.',
      'L’URSS sort de la guerre en grande puissance victorieuse : c’est la racine de la guerre froide.',
    ],
    chiffres: [
      { valeur: '3,5 millions', quoi: 'de soldats engagés le 22 juin 1941' },
      { valeur: '3 000 km', quoi: 'de front, de la Baltique à la mer Noire' },
      { valeur: '3,3 millions', quoi: 'de prisonniers soviétiques morts en captivité allemande' },
      { valeur: '−30 °C', quoi: 'devant Moscou en décembre 1941' },
    ],
    chrono: [
      { date: '18 décembre 1940', fait: 'Hitler signe la directive n° 21, « Barbarossa ».' },
      { date: '22 juin 1941', fait: 'L’Allemagne attaque l’URSS sans déclaration de guerre.' },
      { date: 'juillet 1941', fait: 'Encerclements de Minsk et de Smolensk.' },
      { date: '8 septembre 1941', fait: 'Leningrad est assiégée ; le siège durera 900 jours.' },
      { date: '19 septembre 1941', fait: 'Chute de Kiev : 665 000 prisonniers soviétiques.' },
      { date: '29-30 septembre 1941', fait: 'Massacre de Babi Yar : 33 771 juifs assassinés.' },
      { date: '2 octobre 1941', fait: 'Offensive « Typhon » en direction de Moscou.' },
      { date: '5 décembre 1941', fait: 'Contre-offensive soviétique devant Moscou.' },
    ],
    leSaisTu:
      'Churchill détestait le communisme depuis 1917, et il a soutenu l’URSS dès le premier soir. La veille de l’invasion, il prévient son secrétaire particulier : si Hitler envahissait l’Enfer, il trouverait au moins une bonne parole pour le Diable à la Chambre des communes.',
    aRetenir: [
      'Le 22 juin 1941, l’Allemagne envahit l’URSS : c’est l’opération Barbarossa.',
      '3,5 millions d’hommes attaquent sur 3 000 km : la plus grande opération militaire de l’histoire.',
      'À l’Est, l’Allemagne mène une guerre d’anéantissement : exécutions, famine organisée, massacres des Einsatzgruppen.',
      'L’offensive s’arrête devant Moscou en décembre 1941 : la guerre éclair a échoué.',
      'L’entrée en guerre de l’URSS ouvre le front qui décidera de l’issue du conflit.',
    ],
    mots: [
      {
        mot: 'Lebensraum',
        sens: '« Espace vital » : théorie nazie selon laquelle l’Allemagne doit conquérir des terres à l’Est pour y installer des colons.',
      },
      {
        mot: 'Einsatzgruppen',
        sens: 'Unités mobiles de tuerie qui suivent l’armée allemande en URSS et fusillent les juifs sur place.',
      },
      {
        mot: 'Guerre d’anéantissement',
        sens: 'Guerre qui ne vise pas à vaincre une armée mais à détruire une population et un régime.',
      },
      {
        mot: 'Prêt-bail',
        sens: 'Loi américaine de 1941 permettant de fournir armes et matériel aux Alliés sans paiement immédiat.',
      },
    ],
    lies: [
      'adolf-hitler',
      'staline',
      'debut-de-la-seconde-guerre-mondiale',
      'bataille-de-stalingrad',
      'la-shoah',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Barbarossa',
      'front de l’Est',
      'URSS',
      'Moscou',
      'Leningrad',
      'Kiev',
      'Babi Yar',
      'Einsatzgruppen',
      'Lebensraum',
      'Staline',
      '22 juin 1941',
    ],
  },
  {
    id: 'pearl-harbor',
    volet: 'evenements',
    nom: 'Pearl Harbor',
    date: '7 décembre 1941',
    tri: 1941,
    periode: 'guerres',
    emoji: '✈️',
    lieu: 'Pearl Harbor, île d’Oahu, Hawaï',
    accroche:
      'En deux heures, 353 avions japonais brisent la flotte américaine du Pacifique — et font entrer les États-Unis dans la guerre.',
    citations: [
      {
        texte: 'Le 7 décembre 1941 : une date qui restera marquée d’infamie.',
        qui: 'Franklin Roosevelt',
        contexte:
          'Devant le Congrès des États-Unis, le 8 décembre 1941, en demandant la déclaration de guerre au Japon.',
        sens:
          'Roosevelt avait d’abord écrit « une date qui restera dans l’histoire » ; il a rayé les mots à la main pour mettre « infamie ». Le brouillon existe encore.',
      },
      {
        texte: 'Raid aérien sur Pearl Harbor. Ceci n’est pas un exercice.',
        qui: 'Le centre de commandement de Ford Island',
        contexte: 'Message radio diffusé à toute la flotte du Pacifique, le 7 décembre 1941 à 7 h 58.',
      },
      {
        texte: 'Tora ! Tora ! Tora !',
        qui: 'Mitsuo Fuchida',
        contexte:
          'Signal du chef de la première vague japonaise, à 7 h 53, transmis à la flotte restée au large.',
        sens:
          '« Tigre », répété trois fois : le mot code annonçant que la surprise est totale et que la base n’a rien vu venir.',
      },
      {
        texte: 'Je crains que nous n’ayons réveillé un géant endormi.',
        qui: 'Isoroku Yamamoto',
        contexte:
          'Phrase prêtée à l’amiral japonais au soir de l’attaque, qu’il avait pourtant conçue.',
        sens:
          'Elle vient du film *Tora ! Tora ! Tora !* (1970) et n’apparaît dans aucun document d’époque. Yamamoto a bien redouté la puissance américaine, mais il n’a jamais écrit cela.',
        incertaine: true,
      },
    ],
    reperes: [
      'Attaque surprise sans déclaration de guerre, le dimanche 7 décembre 1941 à 7 h 55.',
      'Deux vagues, 353 avions partis de six porte-avions mouillés à 400 km au nord d’Oahu.',
      '2 403 morts américains, dont 1 177 sur le seul cuirassé *Arizona*.',
      'Huit cuirassés touchés, mais les trois porte-avions américains étaient en mer : ils décideront de la suite.',
      'Le 8 décembre, le Congrès vote la guerre ; le 11, l’Allemagne et l’Italie la déclarent aux États-Unis.',
    ],
    causes: [
      'L’expansion japonaise en Asie : Mandchourie en 1931, guerre contre la Chine depuis 1937, Indochine française occupée en 1940-1941.',
      'L’embargo américain sur l’acier puis sur le pétrole (juillet 1941), qui prive le Japon de l’essentiel de ses importations.',
      'Le gel des avoirs japonais aux États-Unis et l’exigence américaine d’une évacuation totale de la Chine.',
      'Le projet japonais de « sphère de coprospérité de la Grande Asie orientale » : s’emparer des ressources du Sud-Est asiatique.',
      'Le pacte tripartite du 27 septembre 1940, qui lie le Japon à l’Allemagne et à l’Italie.',
      'Le calcul de l’état-major japonais : détruire d’un coup la flotte américaine pour s’acheter six mois de liberté d’action.',
    ],
    recit: [
      {
        titre: 'Un empire à court de pétrole',
        texte:
          'Le Japon fait la guerre en Asie depuis dix ans : **Mandchourie** en 1931, **Chine** à partir de 1937, **Indochine** française occupée en 1940-1941. Chaque conquête appelle la suivante, et chacune coûte du pétrole que l’archipel ne produit pas. Washington répond par les seules armes qu’il veut employer : l’embargo sur la ferraille et l’acier, puis, le **26 juillet 1941**, le **gel des avoirs japonais** et l’arrêt des livraisons de pétrole. Le Japon importait des États-Unis les quatre cinquièmes du sien ; il lui reste dix-huit mois de réserves. En novembre, le secrétaire d’État Hull exige l’évacuation de la Chine et de l’Indochine. Pour le gouvernement du général Tojo, le choix est entre reculer et frapper. Il choisit de frapper — et d’abord le seul adversaire capable de l’en empêcher : la flotte américaine du Pacifique, mouillée à Hawaï.',
      },
      {
        titre: 'Dimanche matin, 7 h 55',
        texte:
          'Six porte-avions japonais ont traversé le Pacifique nord en silence radio. Le **7 décembre 1941 à 7 h 55**, un dimanche, la première vague fond sur la rade : torpilles à faible tirant d’eau, bombes perforantes, mitraillages des terrains d’aviation. Le cuirassé *Arizona* explose et coule en neuf minutes avec **1 177 hommes** ; l’*Oklahoma* chavire. Une seconde vague arrive à 8 h 50. À 9 h 45, tout est fini : **2 403 morts** américains, 1 178 blessés, huit cuirassés touchés dont quatre coulés, 188 avions détruits au sol. Les Japonais perdent 29 appareils. Tactiquement, c’est un triomphe. Stratégiquement, c’est une faute : les **trois porte-avions** américains étaient en mer ce matin-là, les réservoirs de carburant et les ateliers de réparation n’ont pas été visés, et six des huit cuirassés seront renfloués et remis en service.',
      },
      {
        titre: 'Une date d’infamie',
        texte:
          'Le lendemain, **8 décembre**, Roosevelt se présente devant le Congrès et prononce un discours de sept minutes qui commence par « une date qui restera marquée d’infamie ». Le vote est de **388 voix contre 1** à la Chambre : seule la représentante Jeannette Rankin, pacifiste, dit non. En un dimanche, l’isolationnisme américain — qui tenait le pays hors de la guerre depuis 1939 malgré l’aide aux Alliés — s’est évaporé. Le **11 décembre**, sans y être tenue par le pacte tripartite, l’**Allemagne déclare la guerre aux États-Unis**, suivie par l’Italie : Hitler offre ainsi à Roosevelt ce que celui-ci n’aurait peut-être pas obtenu du Congrès. Dès la conférence Arcadia, fin décembre, Américains et Britanniques arrêtent leur stratégie : battre **l’Allemagne d’abord**, contenir le Japon en attendant.',
      },
      {
        titre: 'Le géant se met en marche',
        texte:
          'La véritable arme américaine n’est pas une flotte, c’est une industrie. En quatre ans, les États-Unis produisent près de **300 000 avions**, 88 000 chars et 147 porte-avions de tous types, tout en fournissant Alliés et URSS par le prêt-bail. Le Japon, lui, déroule ses six mois : Hong Kong, Singapour, les Philippines, l’Indonésie, la Birmanie. Puis vient **Midway**, du 4 au 7 juin 1942 : quatre porte-avions japonais coulés en une journée, et l’initiative change de camp pour ne plus revenir. La guerre du Pacifique deviendra une lente remontée d’île en île, d’une dureté extrême. Le revers de cette mobilisation existe aussi : à partir de février 1942, **120 000 Américains d’origine japonaise**, en majorité citoyens des États-Unis, sont internés dans des camps sans jugement. Le pays leur présentera des excuses officielles et une indemnisation en 1988, quarante-six ans plus tard.',
      },
    ],
    consequences: [
      'Les États-Unis entrent dans la guerre : le conflit devient véritablement mondial.',
      'L’Allemagne déclare la guerre aux États-Unis le 11 décembre 1941 et scelle ainsi son propre sort.',
      'La première puissance industrielle du monde passe en économie de guerre : près de 300 000 avions en quatre ans.',
      'Les Alliés décident à la conférence Arcadia (décembre 1941) de battre l’Allemagne en premier.',
      'Le Japon obtient six mois de conquêtes, puis perd l’initiative à Midway en juin 1942.',
      'À partir de février 1942, 120 000 Américains d’origine japonaise sont internés sans jugement.',
    ],
    chiffres: [
      { valeur: '353', quoi: 'avions japonais engagés en deux vagues' },
      { valeur: '2 403', quoi: 'morts américains, dont 68 civils' },
      { valeur: '1 177', quoi: 'morts sur le seul cuirassé Arizona' },
      { valeur: '388 contre 1', quoi: 'le vote de la Chambre pour la déclaration de guerre' },
    ],
    chrono: [
      { date: '18 septembre 1931', fait: 'Le Japon envahit la Mandchourie.' },
      { date: '7 juillet 1937', fait: 'Début de la guerre du Japon contre la Chine.' },
      { date: '27 septembre 1940', fait: 'Pacte tripartite Allemagne-Italie-Japon.' },
      { date: '26 juillet 1941', fait: 'Embargo américain sur le pétrole.' },
      { date: '7 décembre 1941, 7 h 55', fait: 'Première vague japonaise sur Pearl Harbor.' },
      { date: '8 décembre 1941', fait: 'Les États-Unis déclarent la guerre au Japon.' },
      { date: '11 décembre 1941', fait: 'L’Allemagne et l’Italie déclarent la guerre aux États-Unis.' },
      { date: '4-7 juin 1942', fait: 'Midway : le Japon perd quatre porte-avions.' },
    ],
    leSaisTu:
      'Le cuirassé *Arizona* n’a jamais été renfloué : ses 1 177 morts reposent dans la coque, sous un mémorial blanc bâti au-dessus de l’épave. Le navire laisse encore échapper chaque jour quelques litres de fuel, que les visiteurs appellent « les larmes noires de l’Arizona ».',
    aRetenir: [
      'Le 7 décembre 1941, le Japon attaque par surprise la base américaine de Pearl Harbor.',
      'L’attaque fait 2 403 morts et met huit cuirassés hors de combat, mais manque les porte-avions.',
      'Le 8 décembre 1941, les États-Unis déclarent la guerre au Japon ; le 11, l’Allemagne la leur déclare.',
      'L’embargo américain sur le pétrole, en juillet 1941, est la cause immédiate de l’attaque.',
      'L’entrée en guerre des États-Unis fait basculer le rapport de forces industriel du côté des Alliés.',
    ],
    mots: [
      {
        mot: 'Embargo',
        sens: 'Interdiction de vendre certains produits à un pays, pour le contraindre sans lui faire la guerre.',
      },
      {
        mot: 'Isolationnisme',
        sens: 'Doctrine américaine consistant à refuser toute intervention dans les conflits européens ou asiatiques.',
      },
      {
        mot: 'Pacte tripartite',
        sens: 'Alliance signée le 27 septembre 1940 entre l’Allemagne, l’Italie et le Japon : les puissances de l’Axe.',
      },
      {
        mot: 'Économie de guerre',
        sens: 'Réorganisation de toute la production d’un pays au service de l’effort militaire.',
      },
    ],
    lies: [
      'franklin-roosevelt',
      'winston-churchill',
      'debut-de-la-seconde-guerre-mondiale',
      'operation-barbarossa',
      'hiroshima',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Pearl Harbor',
      'Japon',
      'Hawaï',
      'Roosevelt',
      'Yamamoto',
      'Arizona',
      'porte-avions',
      'Midway',
      'isolationnisme',
      'Axe',
      '1941',
    ],
  },
  {
    id: 'la-shoah',
    volet: 'evenements',
    nom: 'La Shoah',
    date: '1941 – 1945',
    tri: 1942,
    fin: 1945,
    periode: 'guerres',
    emoji: '🕯️',
    lieu: 'L’Europe occupée, des ravins d’Ukraine à Auschwitz-Birkenau',
    accroche:
      'L’assassinat méthodique de six millions de juifs d’Europe : un génocide décidé par un État et exécuté par son administration.',
    citations: [
      {
        texte: 'Considérez si c’est un homme que celui qui peine dans la boue.',
        qui: 'Primo Levi',
        contexte:
          'Poème placé en tête de *Si c’est un homme* (1947), récit de ses onze mois à Auschwitz-Monowitz.',
        sens:
          'Le livre demande au lecteur de reconnaître un homme là où le camp avait entrepris de n’en laisser aucun.',
      },
      {
        texte: 'Nous voulions parler, et on ne voulait pas nous entendre.',
        qui: 'Simone Veil',
        contexte:
          'Sur le retour des déportés en 1945. Elle avait seize ans quand elle est entrée à Auschwitz-Birkenau, en avril 1944.',
        sens:
          'Le silence des années d’après-guerre est une seconde épreuve : il faudra trente ans pour que la parole des survivants soit écoutée.',
      },
      {
        texte: 'Je veux continuer à vivre, même après ma mort.',
        qui: 'Anne Frank',
        contexte:
          'Dans son *Journal*, le 5 avril 1944, cachée à Amsterdam. Arrêtée le 4 août, elle meurt à Bergen-Belsen début 1945, à quinze ans.',
      },
      {
        texte: 'Oublier les morts serait les tuer une seconde fois.',
        qui: 'Elie Wiesel',
        contexte:
          'Rescapé d’Auschwitz et de Buchenwald, auteur de *La Nuit* (1958) et prix Nobel de la paix en 1986.',
        sens: 'C’est la phrase qui fonde le devoir de mémoire : témoigner est un acte, pas un sentiment.',
      },
    ],
    reperes: [
      'Environ six millions de juifs d’Europe assassinés : les deux tiers de la population juive du continent.',
      'Trois temps : l’exclusion légale (1933-1939), les ghettos et les fusillades (1939-1941), les centres de mise à mort (1942-1944).',
      'La conférence de Wannsee, le 20 janvier 1942, organise entre administrations la « solution finale ».',
      'Six centres de mise à mort en Pologne occupée ; à Auschwitz-Birkenau, 1,1 million de victimes.',
      'De France, 76 000 juifs sont déportés ; environ 3 000 sont revenus.',
      'Le génocide frappe aussi les Tsiganes : entre 200 000 et 500 000 victimes.',
    ],
    causes: [
      'Un antisémitisme ancien en Europe, que le nazisme transforme en doctrine raciale prétendument scientifique.',
      'L’arrivée d’Hitler au pouvoir le 30 janvier 1933 et la mise au pas de l’État allemand par le parti nazi.',
      'Les lois de Nuremberg (15 septembre 1935), qui retirent aux juifs allemands la citoyenneté et interdisent les mariages « mixtes ».',
      'La radicalisation par la guerre : l’invasion de la Pologne (1939) puis de l’URSS (1941) place des millions de juifs sous domination allemande.',
      'La décision, prise au sommet de l’État nazi à l’automne 1941, de passer de l’expulsion à l’extermination totale.',
      'La mise au service du crime d’une administration entière : ministères, police, chemins de fer, entreprises, médecine.',
      'La collaboration d’États et d’administrations occupés ou alliés, dont le régime de Vichy en France.',
    ],
    recit: [
      {
        titre: 'Exclure : 1933-1939',
        texte:
          'Tout commence par des lois. Dès **avril 1933**, les juifs allemands sont chassés de la fonction publique, puis des professions libérales, des universités, de la presse. Le **15 septembre 1935**, les **lois de Nuremberg** leur retirent la citoyenneté et interdisent les mariages avec des « Aryens » : un État moderne définit juridiquement une catégorie d’habitants comme inférieure. Suivent la spoliation des biens, l’obligation d’ajouter « Israël » ou « Sara » à son prénom, le tampon « J » sur le passeport. Dans la nuit du **9 au 10 novembre 1938**, la **Nuit de Cristal** fait passer la persécution dans la rue : 267 synagogues incendiées, des milliers de magasins pillés, environ 91 morts et **30 000 hommes** envoyés en camp de concentration. Près de la moitié des juifs d’Allemagne cherchent alors à partir — mais en juillet 1938, à la conférence d’Évian, trente-deux pays ont refusé d’ouvrir leurs portes. L’Europe savait, et n’a pas voulu accueillir.',
      },
      {
        titre: 'Enfermer : les ghettos',
        texte:
          'L’invasion de la Pologne, en septembre 1939, fait passer **3,3 millions de juifs polonais** sous domination allemande. L’occupant les entasse dans des quartiers fermés, les **ghettos** : Lodz en avril 1940, **Varsovie** en octobre 1940. Derrière un mur de trois mètres, plus de **400 000 personnes** s’entassent sur 3 km², avec une ration officielle d’environ 180 calories par jour — un dixième de ce qu’il faut pour vivre. La faim et le typhus y tuent environ 92 000 personnes avant même les déportations. Les Allemands imposent aux juifs eux-mêmes des conseils, les *Judenräte*, chargés de transmettre les ordres : une manière de faire porter le poids de l’organisation aux victimes. Dans le ghetto de Varsovie, l’historien **Emanuel Ringelblum** organise une archive clandestine, *Oneg Shabbat*, et fait enterrer dans des bidons de lait les papiers qui prouveront ce qui s’est passé. On en a retrouvé une partie en 1946 et en 1950.',
      },
      {
        titre: 'Tuer sur place : la Shoah par balles',
        texte:
          'À partir du **22 juin 1941**, l’invasion de l’URSS change la nature du crime. Derrière la Wehrmacht avancent quatre **Einsatzgruppen**, groupes mobiles de tuerie de quelques centaines d’hommes chacun, appuyés par des bataillons de police allemands et des auxiliaires locaux. Le procédé est toujours le même : rassembler les juifs d’une localité, les conduire hors du village, les fusiller au bord d’une fosse. Les **29 et 30 septembre 1941**, au ravin de **Babi Yar** près de Kiev, **33 771** personnes sont tuées en deux jours — le chiffre est celui du rapport allemand lui-même. En deux ans, environ **un million et demi** de juifs sont assassinés ainsi, village par village, sur les territoires soviétiques et baltes. On appelle cela la **Shoah par balles** ; elle a longtemps été moins connue que les camps, parce qu’elle n’a laissé ni bâtiments ni survivants, seulement des fosses que des chercheurs recensent encore aujourd’hui.',
      },
      {
        titre: 'Décider et organiser : Wannsee',
        texte:
          'Le **20 janvier 1942**, dans une villa au bord du lac de **Wannsee**, à Berlin, quinze hauts fonctionnaires se réunissent pendant environ quatre-vingt-dix minutes autour de **Reinhard Heydrich**. Il ne s’agit pas d’y décider le génocide : il a déjà commencé, et la décision a été prise plus haut, à l’automne 1941. Il s’agit de le **coordonner** — de mettre d’accord les ministères, la police, les chemins de fer, l’administration des territoires occupés sur qui arrête, qui transporte, qui confisque. Le compte rendu, retrouvé en 1947 parmi les archives des Affaires étrangères allemandes, comporte un tableau froid recensant **onze millions de juifs** d’Europe, y compris ceux des pays non occupés comme l’Irlande ou le Portugal. C’est ce document qui montre le mieux la nature du crime : un génocide de bureau, écrit en langage administratif, exécuté par des gens qui rentraient dîner chez eux.',
      },
      {
        titre: 'Les centres de mise à mort',
        texte:
          'À partir de décembre 1941 s’ouvrent en Pologne occupée des camps d’un genre nouveau : non pas des camps de travail, mais des **centres de mise à mort**, conçus pour tuer les convois dès leur arrivée. Chelmno d’abord, puis **Belzec, Sobibor et Treblinka** dans le cadre de l’« Aktion Reinhard » de 1942, où environ 1,7 million de personnes sont assassinées en dix-huit mois ; Majdanek ; et surtout **Auschwitz-Birkenau**, à la fois camp de concentration, complexe industriel et centre de mise à mort. Les déportés y arrivent par train de toute l’Europe, après des jours de voyage sans eau ; sur la rampe, une « sélection » envoie immédiatement à la chambre à gaz la majorité d’entre eux — enfants, vieillards, mères. **1,1 million de personnes** y sont mortes, dont environ un million de juifs. Il y eut pourtant des révoltes, et il faut les nommer : le **ghetto de Varsovie** du 19 avril au 16 mai 1943, **Treblinka** le 2 août 1943, **Sobibor** le 14 octobre 1943, le Sonderkommando de Birkenau le 7 octobre 1944.',
      },
      {
        titre: 'La France : 76 000',
        texte:
          'La France n’a pas été un simple témoin. Dès le **3 octobre 1940**, sans que l’occupant l’ait demandé, le régime de Vichy promulgue un **statut des juifs** qui les exclut des emplois publics, de l’enseignement, de la presse ; un fichier les recense. Les **16 et 17 juillet 1942**, la **rafle du Vél d’Hiv** est menée à Paris par la police française : **13 152** personnes arrêtées, dont **4 115 enfants**, entassées dans un vélodrome puis déportées via le camp de **Drancy**. Au total, **76 000 juifs** sont déportés de France en soixante-quatorze convois ; environ **3 000** sont revenus, et **11 400** d’entre eux étaient des enfants. Il faut dire aussi l’autre part : les trois quarts des juifs de France ont survécu, cachés, hébergés, munis de faux papiers par des voisins, des instituteurs, des religieux, des fonctionnaires qui ont désobéi. Plus de 4 000 d’entre eux ont reçu le titre de **Juste parmi les nations**. Le **16 juillet 1995**, le président de la République a reconnu la responsabilité de l’État français.',
      },
      {
        titre: 'Savoir, juger, se souvenir',
        texte:
          'Les camps sont libérés par les armées qui avancent : Majdanek en juillet 1944, **Auschwitz le 27 janvier 1945** par l’Armée rouge, qui n’y trouve que 7 000 survivants — les autres ont été évacués à pied dans les « marches de la mort » —, Bergen-Belsen le 15 avril, Dachau le 29. Les images tournées à la libération des camps font entrer l’horreur dans le monde entier. Le **20 novembre 1945** s’ouvre le **procès de Nuremberg** : vingt-quatre dirigeants nazis y répondent d’une incrimination créée pour eux, le **crime contre l’humanité**. Le juriste **Raphael Lemkin**, qui a perdu quarante-neuf membres de sa famille, avait forgé en 1944 le mot **génocide** ; l’ONU en fait un crime international le 9 décembre 1948. Depuis, la mémoire est un travail : témoignages des survivants, Mémorial de la Shoah à Paris, Yad Vashem à Jérusalem, journée internationale du **27 janvier**, et en France la loi du 13 juillet 1990 qui fait de la négation du génocide un délit.',
      },
    ],
    consequences: [
      'Les deux tiers des juifs d’Europe ont disparu ; des communautés entières, en Pologne et dans les pays baltes, ont cessé d’exister.',
      'Le mot « génocide », forgé par le juriste Raphael Lemkin en 1944, entre dans le droit : convention de l’ONU du 9 décembre 1948.',
      'Le procès de Nuremberg (1945-1946) juge les dirigeants nazis et impose la notion de crime contre l’humanité.',
      'La Déclaration universelle des droits de l’homme (1948) est écrite avec ce crime en mémoire.',
      'En France, la responsabilité de l’État dans les déportations est reconnue officiellement le 16 juillet 1995.',
      'Le 27 janvier, date de la libération d’Auschwitz, est devenu la journée internationale de la mémoire.',
      'La négation du génocide est un délit en France depuis la loi du 13 juillet 1990.',
    ],
    chiffres: [
      { valeur: '6 millions', quoi: 'de juifs d’Europe assassinés entre 1941 et 1945' },
      { valeur: '1,1 million', quoi: 'de victimes à Auschwitz-Birkenau, dont un million de juifs' },
      { valeur: '76 000', quoi: 'juifs déportés de France ; environ 3 000 en sont revenus' },
      { valeur: '11 400', quoi: 'enfants juifs déportés de France' },
    ],
    chrono: [
      { date: '30 janvier 1933', fait: 'Hitler chancelier : l’exclusion des juifs d’Allemagne commence.' },
      { date: '15 septembre 1935', fait: 'Lois de Nuremberg : les juifs allemands perdent la citoyenneté.' },
      { date: '9-10 novembre 1938', fait: 'Nuit de Cristal : synagogues incendiées, 30 000 hommes arrêtés.' },
      { date: '3 octobre 1940', fait: 'Statut des juifs promulgué par le régime de Vichy.' },
      { date: '16 octobre 1940', fait: 'Création du ghetto de Varsovie.' },
      { date: 'été 1941', fait: 'Les Einsatzgruppen commencent les fusillades de masse en URSS.' },
      { date: '29-30 septembre 1941', fait: 'Babi Yar : 33 771 juifs assassinés en deux jours.' },
      { date: '20 janvier 1942', fait: 'Conférence de Wannsee : la « solution finale » est coordonnée.' },
      { date: '16-17 juillet 1942', fait: 'Rafle du Vél d’Hiv à Paris : 13 152 arrestations.' },
      { date: '19 avril 1943', fait: 'Soulèvement du ghetto de Varsovie.' },
      { date: '27 janvier 1945', fait: 'Libération d’Auschwitz par l’Armée rouge.' },
      { date: '20 novembre 1945', fait: 'Ouverture du procès de Nuremberg.' },
    ],
    leSaisTu:
      'Le *Journal* d’Anne Frank a failli disparaître. Après l’arrestation du 4 août 1944, Miep Gies, l’employée qui ravitaillait la cachette, ramasse les cahiers épars sur le plancher et les range dans un tiroir sans les lire. Elle les rend en 1945 à Otto Frank, seul survivant de la famille. Le livre est aujourd’hui traduit en plus de soixante-dix langues.',
    aRetenir: [
      'La Shoah est le génocide des juifs d’Europe : environ six millions de victimes entre 1941 et 1945.',
      'Les lois de Nuremberg du 15 septembre 1935 retirent la citoyenneté aux juifs allemands.',
      'À partir de juin 1941, les Einsatzgruppen fusillent environ 1,5 million de juifs en URSS : la « Shoah par balles ».',
      'La conférence de Wannsee, le 20 janvier 1942, coordonne l’extermination entre les administrations allemandes.',
      'Six centres de mise à mort fonctionnent en Pologne occupée ; Auschwitz-Birkenau fait 1,1 million de victimes.',
      '76 000 juifs sont déportés de France, dont 11 400 enfants ; environ 3 000 sont revenus.',
    ],
    mots: [
      {
        mot: 'Shoah',
        sens: 'Mot hébreu signifiant « catastrophe », employé pour désigner le génocide des juifs d’Europe.',
      },
      {
        mot: 'Génocide',
        sens: 'Destruction volontaire et organisée d’un groupe humain entier, en raison de ce qu’il est.',
      },
      {
        mot: 'Ghetto',
        sens: 'Quartier fermé où les nazis enferment les juifs d’une ville avant la déportation.',
      },
      {
        mot: 'Einsatzgruppen',
        sens: 'Unités mobiles de tuerie qui suivent l’armée allemande en URSS et fusillent les juifs sur place.',
      },
      {
        mot: 'Centre de mise à mort',
        sens: 'Camp conçu pour tuer les déportés dès leur arrivée, et non pour les faire travailler.',
      },
      {
        mot: 'Juste parmi les nations',
        sens: 'Titre décerné par l’État d’Israël à une personne non juive ayant sauvé des juifs au péril de sa vie.',
      },
    ],
    lies: [
      'anne-frank',
      'simone-veil',
      'rafle-du-vel-d-hiv',
      'regime-de-vichy',
      'operation-barbarossa',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Shoah',
      'génocide',
      'Auschwitz',
      'Birkenau',
      'Wannsee',
      'ghetto',
      'Einsatzgruppen',
      'déportation',
      'Primo Levi',
      'Anne Frank',
      'Simone Veil',
      'antisémitisme',
      'mémoire',
      'Nuremberg',
    ],
  },
  {
    id: 'bataille-de-stalingrad',
    volet: 'evenements',
    nom: 'La bataille de Stalingrad',
    date: 'août 1942 – 2 février 1943',
    tri: 1942,
    fin: 1943,
    periode: 'guerres',
    emoji: '🏭',
    lieu: 'Stalingrad, sur la Volga',
    accroche:
      'Deux cents jours de combats pour une ville de la Volga : l’Allemagne y perd une armée entière, et la guerre change de sens.',
    citations: [
      {
        texte: 'Pas un pas en arrière !',
        qui: 'Staline',
        contexte: 'Ordre n° 227 du 28 juillet 1942, lu à toutes les unités de l’Armée rouge.',
        sens:
          'Il interdit tout repli sans ordre écrit et institue des détachements de barrage derrière le front. La défense de Stalingrad se fait sous cette menace.',
      },
      {
        texte:
          'Il faut serrer l’ennemi de si près que son aviation ne puisse plus le distinguer de nous.',
        qui: 'Vassili Tchouïkov',
        contexte:
          'Consigne du commandant de la 62ᵉ armée soviétique, qui défend la rive ouest de la Volga à l’automne 1942.',
        sens:
          'Coller à l’adversaire annule la supériorité aérienne allemande : c’est ce qui transforme la bataille en combat de ruines.',
      },
      {
        texte: 'Aux citoyens au cœur d’acier de Stalingrad, en hommage du peuple britannique.',
        qui: 'Georges VI',
        contexte:
          'Inscription de l’épée de Stalingrad, remise à Staline par Churchill à la conférence de Téhéran, le 29 novembre 1943.',
      },
      {
        texte: 'Je n’ai pas l’intention de me tuer pour ce caporal.',
        qui: 'Friedrich Paulus',
        contexte:
          'Réponse prêtée au général allemand quand Hitler le fit maréchal, le 30 janvier 1943, pour l’inciter au suicide.',
        sens:
          'Rapportée par son entourage, jamais écrite de sa main. Aucun maréchal allemand ne s’était rendu jusque-là : Paulus se rendit le lendemain.',
        incertaine: true,
      },
    ],
    reperes: [
      'Été 1942 : l’offensive allemande vise le pétrole du Caucase ; Stalingrad en couvre le flanc nord.',
      '13 septembre 1942 : les Allemands entrent dans la ville ; on se bat maison par maison.',
      '19 novembre 1942 : l’opération Uranus encercle la VIᵉ armée en quatre jours.',
      'Environ 250 000 hommes pris dans la poche, ravitaillés par un pont aérien qui échoue.',
      '2 février 1943 : la reddition est totale ; 91 000 prisonniers, dont 6 000 reverront l’Allemagne.',
      'Toutes catégories confondues, la bataille fait près de deux millions de victimes.',
    ],
    causes: [
      'L’échec devant Moscou en décembre 1941 : l’Allemagne doit gagner en 1942 ou renoncer à gagner.',
      'Le besoin allemand de pétrole : l’offensive « Bleu » du 28 juin 1942 vise les champs du Caucase.',
      'Stalingrad commande la Volga, voie par laquelle remontent le pétrole et le ravitaillement soviétiques.',
      'La valeur symbolique du nom : la ville porte celui de Staline, et Hitler en fait une affaire personnelle.',
      'L’ordre n° 227 du 28 juillet 1942, « Pas un pas en arrière ! », qui interdit tout repli soviétique.',
      'Des flancs allemands confiés aux armées roumaine, hongroise et italienne, moins équipées : c’est là que frappera la contre-offensive.',
    ],
    recit: [
      {
        titre: 'L’été 1942 : cap sur le pétrole',
        texte:
          'Après l’échec devant Moscou, l’Allemagne n’a plus les moyens d’attaquer partout. Le **28 juin 1942**, elle lance l’opération « Bleu » sur le seul front sud, avec un objectif clair : les **champs pétrolifères du Caucase**, sans lesquels ni ses chars ni ses avions ne rouleront en 1943. Le groupe d’armées est coupé en deux : le groupe A descend vers le Caucase, le groupe B — dont la **VIᵉ armée** du général **Paulus** — pousse vers la Volga pour couvrir son flanc. Prendre **Stalingrad** n’est d’abord qu’une tâche annexe : il s’agit de neutraliser un nœud industriel et fluvial. Mais la ville s’étire sur 40 km le long du fleuve, elle porte le nom du maître du Kremlin, et les deux dictateurs vont bientôt refuser d’en démordre. Une opération de couverture devient l’affaire principale de la guerre.',
      },
      {
        titre: 'La guerre des ruines',
        texte:
          'Le **23 août 1942**, la Luftwaffe écrase la ville sous les bombes incendiaires en une seule journée : des dizaines de milliers de civils sont tués, et Stalingrad devient un champ de gravats. C’est une erreur : les ruines sont le terrain rêvé du défenseur. À partir du **13 septembre**, la **62ᵉ armée** de **Tchouïkov** défend chaque immeuble, chaque cave, chaque égout, dos à la Volga, ravitaillée de nuit par des barges sous le feu. Les Allemands appellent cela la *Rattenkrieg*, la guerre des rats : on se bat à la grenade d’un étage à l’autre, une cuisine peut changer de camp trois fois dans la nuit. Le kourgane de **Mamaïev**, colline qui domine la ville, est pris et repris une douzaine de fois. Une maison tenue par le sergent **Pavlov** et une poignée d’hommes résiste cinquante-huit jours. Dans les usines Octobre-Rouge et Barricades, les ouvriers continuent d’assembler des chars que l’on engage à la sortie de l’atelier.',
      },
      {
        titre: 'Uranus : la nasse se referme',
        texte:
          'Pendant que Paulus s’enfonce dans les ruines, **Joukov** et **Vassilievski** préparent autre chose. Le **19 novembre 1942**, l’opération **Uranus** frappe non pas la VIᵉ armée, mais ses **flancs**, tenus par les IIIᵉ et IVᵉ armées roumaines, mal armées contre les chars. Les deux pinces soviétiques font leur jonction à **Kalatch** le 23 novembre : en quatre jours, environ **250 000 hommes** sont enfermés dans une poche. Göring promet à Hitler 500 tonnes de ravitaillement par jour par avion ; la Luftwaffe en livrera moins de cent en moyenne, et y perdra près de 500 appareils. Manstein tente de percer de l’extérieur avec l’opération « Tempête d’hiver » : elle s’arrête à 50 km de la poche le **23 décembre**. Hitler interdit à Paulus de tenter une sortie. À partir de là, la VIᵉ armée est condamnée, et tout le monde à Berlin le sait.',
      },
      {
        titre: 'Le deux février',
        texte:
          'Dans la poche, l’hiver fait son travail : **−30 °C**, la ration tombe à 50 grammes de pain par jour, le typhus se répand, les chevaux sont mangés. Les soldats écrivent des lettres que la poste aérienne ne remettra jamais. Le **30 janvier 1943**, Hitler nomme Paulus **maréchal** : aucun maréchal allemand ne s’étant jamais rendu, le message est transparent. Paulus se rend le lendemain, **31 janvier** ; la poche nord capitule le **2 février**. **91 000 prisonniers** partent à pied vers les camps soviétiques, affamés et malades : environ **6 000** reverront l’Allemagne, les derniers en 1955. Pour la première fois depuis 1939, le Reich annonce une défaite : trois jours de deuil national, tambours voilés à la radio. Le 18 février, Goebbels réunit le Palais des Sports de Berlin et proclame la **« guerre totale »**.',
      },
      {
        titre: 'Le tournant',
        texte:
          'Stalingrad n’est pas la bataille la plus meurtrière de la guerre par hasard : avec près de **deux millions de victimes** toutes catégories confondues — soldats des deux camps, civils de la ville —, elle a coûté plus que bien des campagnes entières. Sa portée est d’abord morale : le mythe de l’invincibilité allemande est mort sur la Volga, et les peuples occupés d’Europe l’apprennent la même semaine. Elle est ensuite stratégique : l’Armée rouge garde désormais l’initiative et ne la rendra plus, de Koursk en juillet 1943 jusqu’à Berlin en 1945. Elle est enfin diplomatique : les Alliés cessent de se demander si l’URSS tiendra, et se réunissent à **Téhéran** en novembre 1943 pour préparer la suite. La ville détruite à 90 % a été rebâtie et rebaptisée **Volgograd** en 1961 ; au sommet du kourgane Mamaïev se dresse une statue de 85 mètres, *La Mère-Patrie appelle*.',
      },
    ],
    consequences: [
      'L’Allemagne perd une armée entière : la VIᵉ armée, environ 250 000 hommes, cesse d’exister.',
      'L’initiative stratégique passe définitivement à l’Armée rouge, qui ne reculera plus durablement.',
      'Le mythe de l’invincibilité allemande s’effondre ; Goebbels proclame la « guerre totale » le 18 février 1943.',
      'Les Alliés tiennent désormais pour acquis que l’URSS tiendra : la conférence de Téhéran suit en novembre 1943.',
      'La Roumanie, la Hongrie et l’Italie, dont les armées ont été détruites sur les flancs, cherchent une sortie de guerre.',
      'Stalingrad devient le symbole mondial de la résistance soviétique ; la ville, rebaptisée Volgograd en 1961, reste un haut lieu de mémoire.',
    ],
    chiffres: [
      { valeur: '200 jours', quoi: 'de bataille, de l’offensive de juillet 1942 à la reddition' },
      { valeur: '2 millions', quoi: 'de victimes, toutes catégories confondues' },
      { valeur: '91 000', quoi: 'prisonniers allemands en février 1943' },
      { valeur: '6 000', quoi: 'd’entre eux revenus d’URSS' },
    ],
    chrono: [
      { date: '28 juin 1942', fait: 'L’Allemagne lance l’offensive « Bleu » vers le Caucase.' },
      { date: '28 juillet 1942', fait: 'Ordre n° 227 : « Pas un pas en arrière ! »' },
      { date: '23 août 1942', fait: 'Stalingrad écrasée sous les bombes incendiaires.' },
      { date: '13 septembre 1942', fait: 'Début des combats de rue dans la ville.' },
      { date: '19 novembre 1942', fait: 'Lancement de l’opération Uranus.' },
      { date: '23 novembre 1942', fait: 'La VIᵉ armée est encerclée à Kalatch.' },
      { date: '23 décembre 1942', fait: 'Échec de la tentative de dégagement de Manstein.' },
      { date: '31 janvier 1943', fait: 'Paulus se rend ; la poche nord capitule le 2 février.' },
      { date: '18 février 1943', fait: 'Goebbels proclame la « guerre totale ».' },
    ],
    leSaisTu:
      'Une maison de quatre étages, sur la place du 9-Janvier, a été tenue cinquante-huit jours par le sergent Pavlov et une vingtaine d’hommes. Tchouïkov ironisait : les Allemands y ont perdu plus de monde qu’à la prise de Paris. Le bâtiment a été relevé après la guerre, et un pan de son mur criblé a été conservé tel quel.',
    aRetenir: [
      'La bataille de Stalingrad dure de l’été 1942 au 2 février 1943.',
      'L’opération Uranus, lancée le 19 novembre 1942, encercle la VIᵉ armée allemande.',
      'Paulus capitule le 31 janvier 1943 ; 91 000 Allemands sont faits prisonniers.',
      'Stalingrad est le tournant de la guerre à l’Est : l’Armée rouge prend l’initiative pour de bon.',
      'La bataille fait près de deux millions de victimes, militaires et civiles.',
    ],
    mots: [
      {
        mot: 'Guerre totale',
        sens: 'Mobilisation de toute la population et de toute l’économie d’un pays pour la guerre.',
      },
      {
        mot: 'Encerclement',
        sens: 'Manœuvre consistant à refermer deux pinces derrière une armée pour la couper de ses arrières.',
      },
      {
        mot: 'Pont aérien',
        sens: 'Ravitaillement d’une troupe ou d’une ville isolée par avions, faute de route ouverte.',
      },
      {
        mot: 'Tournant',
        sens: 'Moment d’une guerre où l’initiative passe d’un camp à l’autre et ne revient plus.',
      },
    ],
    lies: [
      'staline',
      'adolf-hitler',
      'operation-barbarossa',
      'debarquement-du-6-juin-1944',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Stalingrad',
      'Volga',
      'Paulus',
      'Tchouïkov',
      'Joukov',
      'Uranus',
      'tournant',
      'front de l’Est',
      'guerre totale',
      'Volgograd',
    ],
  },
  {
    id: 'debarquement-du-6-juin-1944',
    volet: 'evenements',
    nom: 'Le débarquement du 6 juin 1944',
    date: '6 juin 1944',
    tri: 1944,
    periode: 'guerres',
    emoji: '⚓',
    lieu: 'Les plages de Normandie, du Cotentin à l’Orne',
    accroche:
      'Au petit matin du 6 juin 1944, 156 000 hommes abordent cinq plages normandes : le second front de l’Ouest est ouvert.',
    citations: [
      {
        texte:
          'Les sanglots longs des violons de l’automne bercent mon cœur d’une langueur monotone.',
        qui: 'Radio Londres',
        contexte:
          'Messages personnels des 1ᵉʳ et 5 juin 1944 : le premier vers annonce l’imminence du débarquement, le second le déclenche.',
        sens:
          'C’est Verlaine, *Chanson d’automne* — la BBC a remplacé « blessent » par « bercent ». Le second vers signifiait aux réseaux : sabotez cette nuit.',
      },
      {
        texte: 'Vous allez vous embarquer pour la grande croisade vers laquelle nous tendons depuis des mois.',
        qui: 'Dwight Eisenhower',
        contexte: 'Ordre du jour distribué aux soldats alliés au matin du 6 juin 1944.',
      },
      {
        texte: 'La bataille suprême est engagée.',
        qui: 'Charles de Gaulle',
        contexte: 'À la radio de Londres, le 6 juin 1944 au soir, s’adressant aux Français.',
      },
      {
        texte: 'Si un blâme doit s’attacher à cette tentative, il ne revient qu’à moi seul.',
        qui: 'Dwight Eisenhower',
        contexte:
          'Billet écrit le 5 juin 1944 pour annoncer l’échec du débarquement. Il n’a jamais eu à le lire et l’a gardé dans son portefeuille.',
      },
    ],
    reperes: [
      'Opération Overlord : 156 000 hommes débarqués le premier jour, près de 7 000 navires, plus de 11 000 avions.',
      'Cinq plages : Utah et Omaha aux Américains, Gold et Sword aux Britanniques, Juno aux Canadiens.',
      'À Omaha, environ 2 400 pertes américaines en une journée : on l’a surnommée « Omaha la sanglante ».',
      'L’opération Fortitude fait croire aux Allemands que le vrai débarquement aura lieu au Pas-de-Calais.',
      '177 Français du commando Kieffer débarquent à Sword, aux côtés des Britanniques.',
      'La bataille de Normandie dure jusqu’au 21 août et coûte la vie à environ 20 000 civils français.',
    ],
    causes: [
      'La promesse d’un second front à l’Ouest, réclamée par Staline depuis 1942 et arrêtée à la conférence de Téhéran en novembre 1943.',
      'L’échec du raid de Dieppe (19 août 1942), qui a prouvé qu’on ne prend pas un port de vive force et a fait tout repenser.',
      'La maîtrise du ciel et de l’Atlantique, acquise par les Alliés en 1943.',
      'La puissance industrielle américaine : barges de débarquement, ports artificiels, oléoduc sous-marin.',
      'L’usure de la Wehrmacht sur le front de l’Est, qui y immobilise les deux tiers de ses divisions.',
      'L’intoxication de l’opération Fortitude, qui fixe les meilleures divisions allemandes loin de la Normandie.',
    ],
    recit: [
      {
        titre: 'Deux ans de préparation',
        texte:
          'Le **19 août 1942**, un raid anglo-canadien sur **Dieppe** tourne au désastre : plus de la moitié des 6 000 hommes engagés sont tués, blessés ou capturés en quelques heures. La leçon est retenue : on ne s’emparera pas d’un port en état de marche, il faudra donc **apporter le port avec soi**. À **Téhéran**, en novembre 1943, Roosevelt et Churchill s’engagent devant Staline à ouvrir le second front au printemps. **Eisenhower** prend le commandement suprême en décembre, **Montgomery** celui des forces terrestres. On choisit la **Normandie** : des plages praticables, à portée des chasseurs basés en Angleterre, et surtout là où les Allemands n’attendent rien. Pendant six mois, le sud de l’Angleterre devient un camp de deux millions d’hommes, où l’on entraîne, entasse et fabrique — y compris deux ports préfabriqués, les **Mulberry**, et un oléoduc sous-marin, **PLUTO**.',
      },
      {
        titre: 'L’art de tromper',
        texte:
          'La plus grande opération de la guerre a commencé par un mensonge. L’opération **Fortitude** fait croire à deux débarquements qui n’existent pas : l’un en Norvège, l’autre au **Pas-de-Calais** — le point le plus court, donc le plus logique. Les Alliés inventent de toutes pièces un groupe d’armées, le FUSAG, confié au général **Patton**, dont les Allemands redoutent le nom : chars gonflables, camps vides, trafic radio fabriqué, communiqués de presse sur des mariages de soldats imaginaires. Des agents doubles retournés par les Britanniques, comme l’Espagnol Juan Pujol, alimentent Berlin en renseignements soigneusement calibrés. Le résultat dépasse les espérances : même après le 6 juin, l’état-major allemand garde des semaines durant sa XVᵉ armée au Pas-de-Calais, persuadé que la Normandie n’est qu’une diversion. Les renforts qui auraient pu rejeter les Alliés à la mer n’ont jamais bougé.',
      },
      {
        titre: 'La nuit du 5 au 6 juin',
        texte:
          'Le débarquement devait avoir lieu le 5 juin. Une tempête oblige Eisenhower à le reporter ; le météorologue **James Stagg** annonce une accalmie de trente-six heures, et le commandant en chef décide seul, à 4 h 15 du matin le 5 juin : « OK, we go. » Dans la soirée, la BBC diffuse les **messages personnels** qui mettent la Résistance en mouvement : sabotages des voies ferrées, coupures des lignes téléphoniques, embuscades sur les routes. À partir de **minuit et demi**, plus de **23 000 parachutistes** américains et britanniques sautent derrière les plages. Les planeurs de la 6ᵉ division britannique se posent à **0 h 16** à dix mètres du pont de Bénouville, le futur **Pegasus Bridge**, et le prennent en dix minutes. À Sainte-Mère-Église, les Américains se battent dans les rues avant l’aube. Quand le jour se lève, plus de 5 000 navires sont devant la côte, et les Allemands croient encore à une diversion.',
      },
      {
        titre: 'Cinq plages, un jour',
        texte:
          'À **6 h 30**, les premières vagues touchent **Utah** et **Omaha** ; à 7 h 25 **Gold** et **Sword**, à 7 h 45 **Juno**. À Utah, le courant décale le débarquement de deux kilomètres, ce qui sauve des vies : les pertes y sont légères. À **Omaha**, tout va de travers — une falaise de trente mètres, une division allemande de qualité, les chars amphibies coulés au large, les bombardiers qui ont tiré trop loin. Les hommes des 1ʳᵉ et 29ᵉ divisions restent cloués des heures sur le sable sous le feu : environ **2 400 pertes** dans la journée. À la **Pointe du Hoc**, les rangers du colonel Rudder escaladent la falaise à la corde. À Sword, les **177 Français du commando Kieffer** enlèvent le casino de Ouistreham. Au soir, **156 000 hommes** sont à terre pour environ 4 400 morts alliés ; les têtes de pont tiennent, mais Caen, objectif du premier jour, ne sera prise que le 19 juillet.',
      },
      {
        titre: 'La Normandie, et le prix payé',
        texte:
          'Le 6 juin n’est qu’une porte ; la bataille dure onze semaines. Dans le **bocage** — des haies, des talus, des chemins creux —, chaque champ se conquiert. Cherbourg tombe le 26 juin, mais l’ennemi en a détruit le port. Le **25 juillet**, l’opération **Cobra** perce enfin le front à Saint-Lô et libère les blindés de Patton ; la poche de **Falaise** se referme le **21 août** sur la VIIᵉ armée allemande. Deux millions d’hommes auront débarqué. Il faut dire ce que cela a coûté aux Normands : leurs villes ont été bombardées pour empêcher les renforts d’arriver, **Caen, Le Havre, Saint-Lô, Lisieux** sont rasées, et la bataille de Normandie tue environ **20 000 civils français** — presque autant que de soldats alliés. On ne les oublie pas en racontant la libération. Paris est libéré le **25 août 1944**, quelques jours après le débarquement de Provence du 15 août.',
      },
    ],
    consequences: [
      'Un second front s’ouvre à l’Ouest : l’Allemagne se bat désormais en Russie, en Italie et en France.',
      'La bataille de Normandie s’achève le 21 août 1944 par la fermeture de la poche de Falaise.',
      'Paris est libéré le 25 août 1944 ; le Sud l’est à partir du débarquement de Provence du 15 août.',
      'Environ 20 000 civils français sont tués pendant la bataille de Normandie, surtout par les bombardements.',
      'Le gouvernement provisoire du général de Gaulle s’impose et évite à la France une administration militaire alliée.',
      'Les plages et les cimetières de Normandie deviennent un haut lieu de mémoire internationale.',
    ],
    chiffres: [
      { valeur: '156 000', quoi: 'hommes débarqués le 6 juin 1944' },
      { valeur: '6 939', quoi: 'navires engagés dans l’opération Neptune' },
      { valeur: '20 000', quoi: 'civils français tués pendant la bataille de Normandie' },
      { valeur: '177', quoi: 'Français du commando Kieffer à Sword Beach' },
    ],
    chrono: [
      { date: '19 août 1942', fait: 'Raid manqué de Dieppe : la leçon des ports fortifiés.' },
      { date: '28 novembre 1943', fait: 'À Téhéran, les Alliés fixent l’ouverture du second front.' },
      { date: 'décembre 1943', fait: 'Eisenhower prend le commandement d’Overlord.' },
      { date: '1ᵉʳ et 5 juin 1944', fait: 'Messages de Radio Londres à la Résistance.' },
      { date: '6 juin 1944, 0 h 16', fait: 'Les planeurs britanniques prennent Pegasus Bridge.' },
      { date: '6 juin 1944, 6 h 30', fait: 'Premiers assauts sur Utah et Omaha.' },
      { date: '26 juin 1944', fait: 'Prise de Cherbourg, port détruit par les Allemands.' },
      { date: '25 juillet 1944', fait: 'Opération Cobra : percée du front à Saint-Lô.' },
      { date: '21 août 1944', fait: 'Fermeture de la poche de Falaise.' },
      { date: '25 août 1944', fait: 'Libération de Paris.' },
    ],
    leSaisTu:
      'Faute de port utilisable, les Alliés ont emporté le leur. Deux ports artificiels « Mulberry », faits de caissons de béton remorqués depuis l’Angleterre, ont été assemblés devant Arromanches et Omaha. Celui d’Arromanches a déchargé jusqu’à 9 000 tonnes par jour, et ses caissons sont toujours visibles à marée basse.',
    aRetenir: [
      'Le 6 juin 1944, les Alliés débarquent en Normandie : c’est l’opération Overlord.',
      '156 000 hommes abordent cinq plages : Utah, Omaha, Gold, Juno et Sword.',
      'L’opération Fortitude a fait croire aux Allemands à un débarquement au Pas-de-Calais.',
      'Omaha est la plage la plus meurtrière : environ 2 400 pertes américaines en un jour.',
      'La bataille de Normandie dure jusqu’au 21 août 1944 et tue environ 20 000 civils français.',
      'Le débarquement ouvre le second front réclamé par Staline depuis 1942.',
    ],
    mots: [
      {
        mot: 'Overlord',
        sens: 'Nom de code de l’ensemble de l’opération alliée en Normandie ; sa phase navale s’appelait Neptune.',
      },
      {
        mot: 'Intoxication',
        sens: 'Art de faire croire à l’ennemi un faux plan, en lui fournissant de fausses preuves.',
      },
      {
        mot: 'Port artificiel',
        sens: 'Port préfabriqué en béton, remorqué et assemblé au large d’une plage : les « Mulberry » d’Arromanches.',
      },
      {
        mot: 'Bocage',
        sens: 'Paysage de petits champs bordés de haies et de talus : un terrain idéal pour le défenseur.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'winston-churchill',
      'la-resistance',
      'liberation-de-paris',
      'bataille-de-stalingrad',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'débarquement',
      '6 juin 1944',
      'Overlord',
      'Normandie',
      'Omaha',
      'Eisenhower',
      'Fortitude',
      'Kieffer',
      'Arromanches',
      'D-Day',
      'Falaise',
    ],
  },
  {
    id: 'hiroshima',
    volet: 'evenements',
    nom: 'Hiroshima',
    date: '6 août 1945',
    tri: 1945,
    periode: 'guerres',
    emoji: '☢️',
    lieu: 'Hiroshima et Nagasaki, Japon',
    accroche:
      'Le 6 août 1945 à 8 h 15, une seule bombe efface une ville : la guerre s’achève et le monde entre dans l’âge nucléaire.',
    citations: [
      {
        texte: 'Je suis devenu la Mort, le destructeur des mondes.',
        qui: 'Robert Oppenheimer',
        contexte:
          'Le directeur scientifique du projet Manhattan citant la *Bhagavad-Gita* à propos du premier essai, le 16 juillet 1945.',
        sens:
          'Il a raconté cette pensée dans un entretien filmé de 1965. Sur le moment, son frère se souvient d’une phrase plus brève : « Ça a marché. »',
      },
      {
        texte: 'C’est une bombe atomique. C’est la maîtrise de la force fondamentale de l’univers.',
        qui: 'Harry Truman',
        contexte: 'Déclaration diffusée à la radio le 6 août 1945, seize heures après le bombardement.',
      },
      {
        texte: 'Il nous faut endurer l’inendurable et supporter l’insupportable.',
        qui: 'L’empereur Hirohito',
        contexte:
          'Message radiodiffusé du 15 août 1945 annonçant la capitulation : les Japonais entendent la voix de leur empereur pour la première fois.',
      },
      {
        texte: 'Reposez en paix, car l’erreur ne se répétera pas.',
        qui: 'Le cénotaphe d’Hiroshima',
        contexte:
          'Inscription gravée en 1952 au centre du parc du Mémorial de la paix, sur la tombe symbolique des victimes.',
        sens:
          'La phrase ne nomme aucun coupable : elle engage l’humanité entière, ce qui lui a valu d’être discutée dès le premier jour.',
      },
    ],
    reperes: [
      'Le projet Manhattan mobilise environ 130 000 personnes et 2 milliards de dollars entre 1942 et 1945.',
      'Premier essai atomique le 16 juillet 1945 à Alamogordo, au Nouveau-Mexique.',
      '6 août 1945, 8 h 15 : « Little Boy » explose à 580 m au-dessus d’Hiroshima.',
      '9 août : « Fat Man » sur Nagasaki ; le même jour, l’URSS attaque le Japon en Mandchourie.',
      'Environ 140 000 morts à Hiroshima à la fin de 1945, et 70 000 à Nagasaki.',
      '15 août 1945 : l’empereur annonce la capitulation, signée le 2 septembre à bord du *Missouri*.',
    ],
    causes: [
      'La crainte, dès 1939, que l’Allemagne ne construise la première une arme atomique : c’est le sens de la lettre d’Einstein à Roosevelt.',
      'Le projet Manhattan, lancé en 1942, qui n’aboutit qu’après la capitulation allemande de mai 1945.',
      'Le rejet par le Japon de la déclaration de Potsdam du 26 juillet 1945, qui exigeait une capitulation sans conditions.',
      'Le coût prévu d’un débarquement sur l’archipel, estimé par l’état-major américain à plusieurs centaines de milliers de pertes.',
      'Les précédents d’Iwo Jima et d’Okinawa, où la résistance japonaise fut menée jusqu’au dernier homme.',
      'La volonté américaine d’obtenir la reddition avant que l’URSS, entrée en guerre le 8 août, ne s’installe en Asie.',
    ],
    recit: [
      {
        titre: 'De la lettre d’Einstein au désert du Nouveau-Mexique',
        texte:
          'Le **2 août 1939**, un mois avant la guerre, **Albert Einstein** signe une lettre rédigée par le physicien Leó Szilárd et adressée à Roosevelt : il y avertit qu’une bombe d’un type nouveau est concevable, et que l’Allemagne s’y intéresse. En **1942**, les États-Unis lancent le **projet Manhattan**, dirigé par le général Groves et, pour la science, par **Robert Oppenheimer** : trois villes secrètes bâties de rien — Los Alamos, Oak Ridge, Hanford —, **130 000 personnes** et **2 milliards de dollars**. La course contre l’Allemagne, motif initial, perd son objet le 8 mai 1945 : le Reich capitule sans avoir eu de bombe. Le programme continue pourtant. Le **16 juillet 1945**, dans le désert d’Alamogordo, l’essai **Trinity** réussit : une boule de feu visible à 300 km, une colonne de fumée de 12 km de haut, et du sable fondu en verre vert sur des centaines de mètres.',
      },
      {
        titre: 'Le 6 août, 8 h 15',
        texte:
          'Le **6 août 1945**, un bombardier B-29 nommé *Enola Gay* décolle de l’île de Tinian avec **Little Boy**, une bombe à l’uranium 235 d’une puissance d’environ 15 kilotonnes. À **8 h 15**, elle explose à **580 mètres** au-dessus du centre d’**Hiroshima**, ville de 350 000 habitants choisie parce qu’elle abritait un quartier général militaire et qu’elle était intacte. En quelques secondes, la chaleur, le souffle et l’incendie détruisent environ **70 % des bâtiments** ; **70 000 personnes** meurent sur le coup, et l’on comptera **140 000 morts** à la fin de l’année. Une « pluie noire », chargée de poussières radioactives, tombe sur les quartiers nord dans l’heure qui suit. Les montres retrouvées dans les décombres sont arrêtées à 8 h 15 : c’est cette image, plus qu’aucun chiffre, qui est restée.',
      },
      {
        titre: 'Nagasaki, puis la capitulation',
        texte:
          'Le Japon ne se rend pas. Le **8 août**, l’URSS lui déclare la guerre et lance le lendemain plus d’un million d’hommes sur la Mandchourie. Le **9 août** à 11 h 02, une seconde bombe, **Fat Man**, au plutonium, est larguée sur **Nagasaki** — la cible initiale, Kokura, était couverte de nuages. Les collines de la ville limitent l’effet du souffle : environ **70 000 morts** à la fin de l’année. Le **15 août**, à midi, l’**empereur Hirohito** parle à la radio : c’est la première fois que ses sujets entendent sa voix, dans une langue de cour que beaucoup comprennent mal, et il leur demande de « supporter l’insupportable ». La capitulation est signée le **2 septembre 1945** sur le pont du cuirassé *Missouri*, dans la baie de Tokyo. La Seconde Guerre mondiale est finie, six ans et un jour après l’entrée en Pologne.',
      },
      {
        titre: 'Les hibakusha',
        texte:
          'Ceux qui ont survécu portent un nom en japonais : les ***hibakusha***, « les personnes touchées par la bombe ». Ils sont aujourd’hui encore plus de cent mille à être reconnus comme tels. Beaucoup ont vu apparaître dans les mois suivants une maladie que la médecine ne connaissait pas — le **mal des rayons** —, puis, des années plus tard, des leucémies et des cancers en excès. Ils ont subi aussi un second malheur : longtemps, dans le Japon d’après-guerre, être *hibakusha* fermait des portes, des emplois et des mariages, par peur de la contagion ou de l’hérédité. Leur parole a mis des décennies à être entendue, et c’est elle qui fait aujourd’hui la force du musée d’Hiroshima : des objets ordinaires — une gamelle, un tricycle, un uniforme d’écolière — et le nom de leur propriétaire.',
      },
      {
        titre: 'L’âge nucléaire',
        texte:
          'La décision de 1945 se discute encore. Pour les uns, elle a épargné le bain de sang d’un débarquement sur l’archipel ; pour d’autres, le Japon était déjà à bout et l’entrée en guerre de l’URSS aurait suffi, la bombe servant surtout à impressionner Moscou. Les deux arguments s’appuient sur des archives réelles, et les historiens ne les ont pas départagés. Ce qui est certain, c’est ce qui a suivi. L’URSS obtient la bombe en **1949**, le Royaume-Uni en 1952, la France en **1960**, la Chine en 1964 : la **dissuasion nucléaire** devient le ressort de la guerre froide, où deux camps s’abstiennent de s’affronter parce qu’ils savent pouvoir se détruire. Les arsenaux culmineront à plus de 60 000 têtes dans les années 1980. Le traité de non-prolifération de **1968** tente d’arrêter la diffusion de l’arme ; neuf États en disposent aujourd’hui.',
      },
    ],
    consequences: [
      'Le Japon capitule le 15 août 1945 : la Seconde Guerre mondiale s’achève.',
      'Environ 210 000 morts à Hiroshima et Nagasaki à la fin de 1945, en écrasante majorité des civils.',
      'Les survivants, les hibakusha, subissent pendant des décennies les effets des radiations et la mise à l’écart.',
      'Le monde entre dans l’âge nucléaire : l’URSS obtient la bombe en 1949, la France en 1960.',
      'La dissuasion nucléaire devient le ressort principal de la guerre froide.',
      'Hiroshima devient la ville-symbole du désarmement ; le traité de non-prolifération est signé en 1968.',
    ],
    chiffres: [
      { valeur: '140 000', quoi: 'morts à Hiroshima à la fin de l’année 1945' },
      { valeur: '8 h 15', quoi: 'l’heure de l’explosion, figée sur les montres retrouvées' },
      { valeur: '580 m', quoi: 'l’altitude d’explosion, calculée pour étendre les destructions' },
      { valeur: '2 milliards', quoi: 'de dollars pour le projet Manhattan' },
    ],
    chrono: [
      { date: '2 août 1939', fait: 'Lettre d’Einstein à Roosevelt sur l’arme atomique.' },
      { date: '1942', fait: 'Lancement du projet Manhattan.' },
      { date: '8 mai 1945', fait: 'Capitulation allemande : le motif initial du projet disparaît.' },
      { date: '16 juillet 1945', fait: 'Essai Trinity à Alamogordo, Nouveau-Mexique.' },
      { date: '26 juillet 1945', fait: 'Déclaration de Potsdam, rejetée par le Japon.' },
      { date: '6 août 1945, 8 h 15', fait: 'Bombe atomique sur Hiroshima.' },
      { date: '8 août 1945', fait: 'L’URSS déclare la guerre au Japon.' },
      { date: '9 août 1945', fait: 'Bombe atomique sur Nagasaki.' },
      { date: '15 août 1945', fait: 'Hirohito annonce la capitulation à la radio.' },
      { date: '2 septembre 1945', fait: 'Capitulation signée à bord du Missouri.' },
      { date: '29 août 1949', fait: 'Premier essai nucléaire soviétique.' },
    ],
    leSaisTu:
      'Sadako Sasaki avait deux ans le 6 août 1945 et vivait à deux kilomètres de l’explosion. À onze ans, une leucémie se déclare. Une légende japonaise promet un vœu à qui plie mille grues en papier : elle en plie plus de mille avant de mourir, en 1955, à douze ans. Sa statue, à Hiroshima, est couverte toute l’année de guirlandes de grues envoyées du monde entier.',
    aRetenir: [
      'Le 6 août 1945, les États-Unis larguent une bombe atomique sur Hiroshima ; le 9 août, sur Nagasaki.',
      'Environ 140 000 personnes meurent à Hiroshima avant la fin de 1945, en majorité des civils.',
      'Le projet Manhattan (1942-1945) a mobilisé 130 000 personnes et 2 milliards de dollars.',
      'Le Japon capitule le 15 août 1945 ; l’acte est signé le 2 septembre à bord du Missouri.',
      'Hiroshima ouvre l’âge nucléaire et la dissuasion, qui domineront la guerre froide.',
    ],
    mots: [
      {
        mot: 'Hibakusha',
        sens: 'Mot japonais désignant les survivants des bombardements atomiques d’Hiroshima et de Nagasaki.',
      },
      {
        mot: 'Projet Manhattan',
        sens: 'Programme secret américain de fabrication de la bombe atomique, de 1942 à 1945.',
      },
      {
        mot: 'Capitulation sans conditions',
        sens: 'Reddition totale, sans négociation : le vaincu s’en remet entièrement au vainqueur.',
      },
      {
        mot: 'Dissuasion nucléaire',
        sens: 'Stratégie qui consiste à éviter la guerre en menaçant l’adversaire d’une destruction certaine.',
      },
    ],
    lies: [
      'pearl-harbor',
      'franklin-roosevelt',
      'creation-de-l-onu',
      'debut-de-la-guerre-froide',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La Seconde Guerre mondiale, une guerre d’anéantissement',
    tags: [
      'Hiroshima',
      'Nagasaki',
      'bombe atomique',
      'Manhattan',
      'Oppenheimer',
      'Truman',
      'Hirohito',
      'hibakusha',
      'capitulation',
      'nucléaire',
      '1945',
    ],
  },
]
