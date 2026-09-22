// -----------------------------------------------------------------------------
// GUERRES MONDIALES — 1914-1929. De l'étincelle de Sarajevo au krach de Wall
// Street : la Première Guerre mondiale, la sortie de guerre de la Russie, la
// paix de 1919 et la crise qui fera sauter cette paix.
//
// Sujet grave, donc ton sobre (cf. `docs/encyclopedie.md`, § 3) : on date, on
// chiffre, on nomme. Pas de lyrisme guerrier, pas d'« héroïsme » de manuel —
// la précision fait plus d'effet que l'indignation. La vie concrète du poilu
// (la boue, les rats, la relève, le courrier) vaut tous les adjectifs, et les
// phrases citées sont celles des sources : Clemenceau, Foch, Pétain, Lénine,
// Roosevelt, Keynes — et un sous-lieutenant tué le lendemain de sa dernière
// page de carnet.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_GUERRES_14_18: Evenement[] = [
  {
    id: 'attentat-de-sarajevo',
    volet: 'evenements',
    nom: 'L’attentat de Sarajevo',
    date: '28 juin 1914',
    tri: 1914,
    periode: 'guerres',
    emoji: '⚡',
    lieu: 'Sarajevo, Bosnie-Herzégovine',
    accroche:
      'Deux coups de revolver tirés par un étudiant de dix-neuf ans mettent l’Europe en guerre en cinq semaines — sans que rien n’ait été écrit d’avance.',
    citations: [
      {
        texte: 'Sophie, Sophie, ne meurs pas, vis pour nos enfants.',
        qui: 'L’archiduc François-Ferdinand',
        contexte:
          'Dans la voiture, quelques instants après les coups de feu, le 28 juin 1914 ; il meurt peu après son épouse.',
      },
      {
        texte: 'Maintenant ou jamais.',
        qui: 'Guillaume II',
        contexte:
          'Note écrite en marge d’un rapport autrichien, début juillet 1914 : Berlin pousse Vienne à régler la question serbe.',
        sens:
          'C’est le « chèque en blanc » allemand : assurée d’un soutien sans condition, l’Autriche-Hongrie peut se permettre l’ultimatum.',
      },
      {
        texte: 'Je ne suis pas un criminel, car j’ai supprimé un malfaiteur.',
        qui: 'Gavrilo Princip',
        contexte: 'À son procès, à Sarajevo, en octobre 1914.',
      },
      {
        texte:
          'Les lumières s’éteignent dans toute l’Europe ; nous ne les verrons pas se rallumer de notre vivant.',
        qui: 'Sir Edward Grey, ministre britannique des Affaires étrangères',
        contexte: 'À sa fenêtre du Foreign Office, le soir du 3 août 1914.',
      },
    ],
    reperes: [
      'François-Ferdinand, héritier du trône d’Autriche-Hongrie, est tué à Sarajevo avec son épouse Sophie.',
      'Le tireur, Gavrilo Princip, a 19 ans et appartient à la Jeune Bosnie, qui veut rattacher la Bosnie à la Serbie.',
      'Le 23 juillet, Vienne adresse à Belgrade un ultimatum de dix points, rédigé pour être refusé.',
      'Les alliances font le reste : Allemagne et Autriche-Hongrie d’un côté, Serbie, Russie, France et Royaume-Uni de l’autre.',
      'Du 28 juillet au 4 août 1914, six déclarations de guerre s’enchaînent en huit jours.',
      'Rien n’était fatal : chaque gouvernement a choisi, jour après jour, l’escalade plutôt que la négociation.',
    ],
    causes: [
      'Les nationalismes des Balkans : l’Autriche-Hongrie a annexé la Bosnie en 1908, la Serbie veut réunir les Slaves du Sud.',
      'Deux systèmes d’alliances figés depuis vingt ans : Triple-Alliance (Allemagne, Autriche-Hongrie, Italie) contre Triple-Entente (France, Russie, Royaume-Uni).',
      'La rivalité coloniale et navale entre l’Allemagne et le Royaume-Uni, nourrie par les crises marocaines de 1905 et 1911.',
      'La course aux armements : en 1914, les grandes puissances entretiennent des armées de conscrits de plusieurs millions d’hommes.',
      'Des plans militaires fondés sur la vitesse — le plan Schlieffen allemand, le plan XVII français : mobiliser, c’est déjà presque faire la guerre.',
      'En France, le souvenir de 1870 et la perte de l’Alsace-Moselle ; en Allemagne, la peur d’un encerclement.',
      'L’attentat du 28 juin 1914, saisi par Vienne comme l’occasion d’en finir une bonne fois avec la Serbie.',
    ],
    recit: [
      {
        titre: 'Une visite mal protégée',
        texte:
          'Le **28 juin 1914**, l’archiduc **François-Ferdinand**, héritier de l’Autriche-Hongrie, inspecte les manœuvres en **Bosnie**, annexée par Vienne six ans plus tôt. La date est mal choisie : le 28 juin est la fête nationale serbe. Six conjurés de la **Jeune Bosnie**, armés par une société secrète d’officiers serbes, attendent le long du quai. Le matin, une bombe rebondit sur la capote de la voiture et blesse des officiers de l’escorte ; l’archiduc maintient son programme et décide d’aller voir les blessés à l’hôpital. Le chauffeur, mal informé de l’itinéraire modifié, s’engage dans une rue transversale, freine et fait marche arrière — devant **Gavrilo Princip**, dix-neuf ans, qui tire deux fois à trois mètres. Sophie est atteinte à l’abdomen, l’archiduc au cou. Les deux meurent en moins d’une heure. Un attentat politique de plus, dans une Europe qui en compte des dizaines depuis 1890 : rien n’oblige encore à une guerre générale.',
      },
      {
        titre: 'Le chèque en blanc et l’ultimatum',
        texte:
          'Ce qui change tout se joue à **Berlin** et à **Vienne**, pas à Sarajevo. Le **5 juillet**, l’Allemagne promet à l’Autriche-Hongrie un soutien **sans condition** : c’est ce qu’on appelle le « chèque en blanc ». Fort de cette assurance, Vienne laisse passer trois semaines, puis remet le **23 juillet** un **ultimatum** de dix points à la Serbie, avec **48 heures** pour répondre. Un point, le sixième, exige que des policiers autrichiens enquêtent sur le sol serbe : aucun État souverain ne peut l’accepter, et c’est fait pour. Belgrade accepte pourtant presque tout et propose l’arbitrage international sur le reste. Vienne juge la réponse insuffisante, rompt les relations et **déclare la guerre le 28 juillet**. Le lendemain, Belgrade est bombardée.',
      },
      {
        titre: 'L’engrenage des mobilisations',
        texte:
          'À partir de là, ce sont les **calendriers militaires** qui commandent. La Russie, protectrice des Slaves, décrète la **mobilisation générale** le **30 juillet**. L’Allemagne, dont tout le plan repose sur la rapidité — battre la France en six semaines avant que la Russie n’ait fini de rassembler ses armées —, somme Saint-Pétersbourg d’arrêter, n’obtient rien, et déclare la guerre à la Russie le **1er août**, puis à la France le **3 août**. Le 4, ses troupes entrent en **Belgique** neutre pour contourner les forteresses françaises : le **Royaume-Uni**, garant de cette neutralité, déclare la guerre le soir même. En France, le **31 juillet**, **Jean Jaurès**, qui plaidait jusqu’au bout pour la paix, est assassiné dans un café parisien ; ses obsèques scellent l’**union sacrée**. En huit jours, six déclarations de guerre ont engagé plus de vingt millions d’hommes.',
      },
      {
        titre: 'Rien n’était fatal',
        texte:
          'On raconte souvent l’été 1914 comme une mécanique : une étincelle, un engrenage, une explosion inévitable. C’est commode et c’est faux. À chaque étape, des hommes ont **décidé** : Berlin pouvait retenir Vienne, Vienne pouvait accepter la réponse serbe, Saint-Pétersbourg pouvait mobiliser partiellement, Londres pouvait annoncer plus tôt qu’elle entrerait en guerre. Aucun de ces choix n’a été fait, parce que chaque gouvernement croyait bluffer, et parce que tous s’attendaient à une **guerre courte** — « terminée avant les feuilles mortes ». Elle durera **quatre ans et trois mois**, fera environ **dix millions de morts** militaires, effacera quatre empires et laissera une paix que personne, en 1914, n’aurait imaginée.',
      },
    ],
    consequences: [
      'L’Autriche-Hongrie déclare la guerre à la Serbie le 28 juillet 1914 ; en huit jours, toute l’Europe est en guerre.',
      'Les mobilisations générales mettent sous les drapeaux plus de vingt millions d’hommes en quelques semaines.',
      'La France entre en guerre dans l’union sacrée, après l’assassinat de Jean Jaurès le 31 juillet.',
      'La violation de la neutralité belge fait entrer le Royaume-Uni et son empire dans le conflit le 4 août.',
      'La « guerre courte » annoncée partout dure quatre ans et fait environ dix millions de morts militaires.',
      'La Serbie perd près d’un quart de sa population ; l’Autriche-Hongrie, elle, disparaît en 1918.',
    ],
    chiffres: [
      { valeur: '19 ans', quoi: 'l’âge de Gavrilo Princip, le tireur' },
      { valeur: '48 h', quoi: 'le délai laissé à la Serbie pour répondre à l’ultimatum' },
      { valeur: '6', quoi: 'déclarations de guerre entre le 28 juillet et le 4 août 1914' },
      { valeur: '20 millions', quoi: 'd’hommes mobilisés en quelques semaines' },
    ],
    chrono: [
      { date: '1908', fait: 'L’Autriche-Hongrie annexe la Bosnie-Herzégovine.' },
      { date: '28 juin 1914', fait: 'Assassinat de François-Ferdinand et de Sophie à Sarajevo.' },
      { date: '5 juillet 1914', fait: 'Berlin promet à Vienne un soutien sans condition.' },
      { date: '23 juillet 1914', fait: 'Ultimatum autrichien à la Serbie, 48 heures pour répondre.' },
      { date: '28 juillet 1914', fait: 'L’Autriche-Hongrie déclare la guerre à la Serbie.' },
      { date: '30 juillet 1914', fait: 'Mobilisation générale russe.' },
      { date: '31 juillet 1914', fait: 'Jean Jaurès est assassiné à Paris.' },
      { date: '1er août 1914', fait: 'Mobilisations française et allemande.' },
      { date: '3 août 1914', fait: 'L’Allemagne déclare la guerre à la France.' },
      { date: '4 août 1914', fait: 'Invasion de la Belgique ; le Royaume-Uni entre en guerre.' },
    ],
    leSaisTu:
      'Gavrilo Princip avait vingt-sept jours de trop… en moins : la loi autrichienne réservait la peine de mort aux plus de vingt ans, et il n’en avait pas encore dix-neuf et onze mois le jour de l’attentat. Condamné à vingt ans de forteresse, il est mort de tuberculose en avril 1918, sept mois avant la fin de la guerre qu’il avait déclenchée.',
    aRetenir: [
      'Le 28 juin 1914 à Sarajevo, Gavrilo Princip assassine l’archiduc François-Ferdinand, héritier d’Autriche-Hongrie, et son épouse Sophie.',
      'Assurée du soutien allemand, l’Autriche-Hongrie adresse un ultimatum à la Serbie le 23 juillet et lui déclare la guerre le 28 juillet.',
      'Le jeu des alliances entraîne en huit jours la Russie, l’Allemagne, la France et le Royaume-Uni.',
      'L’attentat est l’étincelle, pas la cause : nationalismes, alliances et course aux armements préparaient la guerre depuis vingt ans.',
    ],
    mots: [
      {
        mot: 'Ultimatum',
        sens: 'Dernière demande adressée à un État, assortie d’un délai : au-delà, c’est la guerre.',
      },
      {
        mot: 'Mobilisation',
        sens: 'Rappel de tous les hommes en âge de servir et mise sur pied de guerre de l’armée.',
      },
      {
        mot: 'Triple-Entente',
        sens: 'Alliance de la France, de la Russie et du Royaume-Uni, face à la Triple-Alliance allemande, autrichienne et italienne.',
      },
      {
        mot: 'Union sacrée',
        sens: 'Trêve politique d’août 1914 : partis et syndicats français suspendent leurs querelles pour la durée de la guerre.',
      },
    ],
    lies: [
      'bataille-de-la-marne',
      'bataille-de-verdun',
      'traite-de-versailles',
      'jean-jaures',
      'unification-de-l-allemagne',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Sarajevo',
      'Princip',
      'François-Ferdinand',
      'ultimatum',
      'alliances',
      'Triple-Entente',
      'Balkans',
      '1914',
      'mobilisation',
      'Jaurès',
    ],
  },
  {
    id: 'bataille-de-la-marne',
    volet: 'evenements',
    nom: 'La bataille de la Marne',
    date: '6 – 12 septembre 1914',
    tri: 1914,
    fin: 1914,
    periode: 'guerres',
    emoji: '🚕',
    lieu: 'De Meaux à Verdun, la vallée de la Marne',
    accroche:
      'À cinquante kilomètres de Paris, l’armée française arrête l’invasion allemande — et condamne les deux camps à quatre ans de tranchées.',
    citations: [
      {
        texte:
          'J’ai reçu le mandat de défendre Paris contre l’envahisseur : ce mandat, je le remplirai jusqu’au bout.',
        qui: 'Le général Gallieni',
        contexte:
          'Proclamation affichée sur les murs de Paris le 3 septembre 1914, alors que le gouvernement part pour Bordeaux.',
      },
      {
        texte:
          'Une troupe qui ne peut plus avancer devra se faire tuer sur place plutôt que de reculer.',
        qui: 'Le général Joffre',
        contexte: 'Ordre général n° 6 adressé aux armées la veille de la bataille, le 6 septembre 1914.',
      },
      {
        texte: 'Mon centre cède, ma droite recule ; situation excellente, j’attaque.',
        qui: 'Le général Foch',
        contexte:
          'Message attribué au commandant de la 9ᵉ armée, dans les marais de Saint-Gond, vers le 8 septembre 1914.',
        sens:
          'Aucun télégramme original ne porte cette phrase : elle résume après coup l’esprit de la bataille plus qu’elle ne la raconte.',
        incertaine: true,
      },
      {
        texte: 'Majesté, nous avons perdu la guerre.',
        qui: 'Le général von Moltke',
        contexte: 'Rapporté comme ses mots à Guillaume II après l’ordre de repli, le 9 septembre 1914.',
        incertaine: true,
      },
    ],
    reperes: [
      'Début septembre 1914, les armées allemandes sont à 50 km de Paris ; le gouvernement part pour Bordeaux.',
      'La 1re armée de von Kluck oblique au sud-est de Paris et découvre son flanc droit : Gallieni le repère.',
      'Joffre lance la contre-offensive le 6 septembre sur 300 km de front, de Meaux à Verdun.',
      'Environ 600 taxis parisiens transportent 5 000 hommes vers l’Ourcq : une part minime des effectifs, un symbole immense.',
      'Le 12 septembre, les Allemands se replient derrière l’Aisne et s’enterrent : la guerre de mouvement est finie.',
    ],
    causes: [
      'Le plan Schlieffen : contourner les forteresses françaises par la Belgique, envelopper Paris et battre la France en six semaines.',
      'L’échec de la bataille des Frontières en août 1914 : l’offensive française en Lorraine et dans les Ardennes coûte 27 000 tués pour la seule journée du 22 août.',
      'La retraite ordonnée par Joffre, qui recule deux semaines sans se laisser encercler et réorganise ses armées en marchant.',
      'Le virage de von Kluck, qui passe au sud-est de Paris au lieu de l’envelopper et offre son aile droite à la garnison de la capitale.',
      'L’épuisement des troupes allemandes : 600 km à pied en un mois, un ravitaillement distancé, deux corps d’armée partis en Prusse-Orientale.',
      'La décision de Gallieni et de Joffre d’attaquer tout de suite, le 6 septembre, avec l’armée Maunoury sortie de Paris.',
    ],
    recit: [
      {
        titre: 'Un mois de recul',
        texte:
          'Août 1914 est le mois le plus meurtrier de toute la guerre pour l’armée française. Fidèle au **plan XVII**, elle attaque en Lorraine et dans les Ardennes, pantalon rouge et baïonnette, contre des mitrailleuses et une artillerie en position : le **22 août**, elle perd **27 000 tués en une journée** — davantage qu’aucun autre jour de son histoire. À gauche, les Allemands déferlent par la Belgique et bousculent les Britanniques à Mons. **Joffre** fait alors ce qu’aucun de ses prédécesseurs n’aurait osé : il **recule**. Pendant quinze jours, les armées françaises se replient de 200 kilomètres en bon ordre, limogent soixante généraux, se regroupent, reçoivent des renforts du sud-est. Le 2 septembre, le gouvernement quitte Paris pour **Bordeaux**. Le pays croit la capitale perdue.',
      },
      {
        titre: 'Le flanc découvert',
        texte:
          'Le 3 septembre, les aviateurs et les cavaliers signalent un mouvement inattendu : la **1re armée allemande de von Kluck**, à l’extrême droite du dispositif, n’oblique plus vers l’ouest pour contourner Paris — elle file **au sud-est**, à la poursuite des Français, et présente son flanc droit à la capitale. **Gallieni**, gouverneur militaire de Paris, comprend immédiatement : « Ils nous tendent le flanc. » Il obtient de Joffre l’autorisation d’attaquer avec l’**armée Maunoury**, formée en hâte à Paris. Le **6 septembre**, Joffre fait plus : il arrête la retraite sur tout le front et ordonne à **six armées** — de Meaux à Verdun, 300 kilomètres — de faire demi-tour et d’attaquer. Plus de deux millions d’hommes s’affrontent pendant une semaine dans les blés coupés.',
      },
      {
        titre: 'Les taxis de la Marne',
        texte:
          'Il manque des hommes sur l’**Ourcq**, à l’aile gauche. Dans les nuits du **6 au 8 septembre**, Gallieni fait réquisitionner les taxis parisiens : environ **600 voitures**, des Renault AG à capote noire, embarquent cinq soldats chacune et font deux allers-retours de 50 kilomètres vers Nanteuil-le-Haudouin. Au total, **5 000 hommes** — sur plus d’un million d’engagés côté français. Militairement, c’est une goutte d’eau ; **la Marne n’a pas été gagnée par les taxis**, mais par des fantassins qui marchaient depuis des semaines et par 75 000 obus de 75. Symboliquement, c’est autre chose : pour la première fois, la ville envoie ses voitures de course au combat, l’arrière et le front se touchent, et la guerre devient l’affaire de tous. L’image restera plus forte que le chiffre — et les deux méritent d’être dits.',
      },
      {
        titre: 'Sept jours et un repli',
        texte:
          'La bataille se joue en trois endroits. Sur l’**Ourcq**, Maunoury attaque von Kluck, qui se retourne contre lui et ouvre une brèche de 50 kilomètres entre ses troupes et la 2ᵉ armée allemande. Dans cette brèche s’avancent, lentement, les Britanniques de French et la 5ᵉ armée française de **Franchet d’Espèrey**. Au centre, dans les **marais de Saint-Gond**, la 9ᵉ armée de **Foch** tient sous des assauts répétés de la garde prussienne. Le **9 septembre**, le lieutenant-colonel Hentsch, envoyé du grand état-major allemand, constate la brèche et autorise le repli. Les armées allemandes reculent de 60 kilomètres et s’arrêtent sur les hauteurs de l’**Aisne**, où elles creusent des tranchées. Le **12 septembre**, le front se fige. Bilan de l’épisode : environ **250 000 hommes** hors de combat de chaque côté.',
      },
      {
        titre: 'Ce que la Marne a fermé',
        texte:
          'La victoire est défensive : aucune armée allemande n’est détruite, aucun territoire repris de façon décisive. Mais le **plan Schlieffen** est mort, et avec lui l’espoir allemand d’une guerre courte sur un seul front. Les deux adversaires tentent ensuite de se déborder par le nord — c’est la **course à la mer**, qui s’achève dans les boues de l’Yser en novembre. À la fin de 1914, une double ligne continue de tranchées, de barbelés et d’abris court sur **700 kilomètres**, de la mer du Nord à la frontière suisse, et ne bougera pratiquement plus pendant quatre ans. La **guerre de mouvement** a duré six semaines ; la **guerre de position** en durera deux cents. C’est à la Marne que le xxᵉ siècle bascule dans la guerre industrielle.',
      },
    ],
    consequences: [
      'Le plan Schlieffen échoue : l’Allemagne devra faire la guerre sur deux fronts, exactement ce qu’elle voulait éviter.',
      'Paris est sauvé ; le gouvernement pourra revenir de Bordeaux en décembre 1914.',
      'La course à la mer stabilise un front continu de 700 km, de la mer du Nord à la frontière suisse.',
      'La guerre de mouvement laisse place à la guerre de position : tranchées, barbelés, abris, artillerie lourde.',
      'L’idée d’une guerre « terminée avant les feuilles mortes » s’effondre : il faut organiser une économie de guerre.',
      'Les taxis de la Marne entrent dans la mémoire nationale comme l’image de l’arrière au secours du front.',
    ],
    chiffres: [
      { valeur: '600', quoi: 'taxis réquisitionnés, pour 5 000 hommes transportés' },
      { valeur: '2 millions', quoi: 'de soldats engagés des deux côtés' },
      { valeur: '50 km', quoi: 'la distance des Allemands à Paris, le 3 septembre 1914' },
      { valeur: '700 km', quoi: 'de tranchées de la mer du Nord à la Suisse, fin 1914' },
    ],
    chrono: [
      { date: '2 août 1914', fait: 'Mobilisation générale en France.' },
      { date: '22 août 1914', fait: '27 000 soldats français tués en une seule journée.' },
      { date: '24 août – 5 sept.', fait: 'Grande retraite des armées françaises et britanniques.' },
      { date: '2 septembre 1914', fait: 'Le gouvernement quitte Paris pour Bordeaux.' },
      { date: '3 septembre 1914', fait: 'Gallieni repère le virage de von Kluck.' },
      { date: '6 septembre 1914', fait: 'Ordre général n° 6 : la contre-offensive commence.' },
      { date: '6-8 septembre 1914', fait: 'Les taxis parisiens montent 5 000 hommes vers l’Ourcq.' },
      { date: '9 septembre 1914', fait: 'Le repli allemand est autorisé.' },
      { date: '12 septembre 1914', fait: 'Le front se stabilise derrière l’Aisne.' },
      { date: 'octobre-novembre 1914', fait: 'Course à la mer ; front continu jusqu’à la Suisse.' },
    ],
    leSaisTu:
      'Les compteurs des taxis tournaient pendant toute l’opération. L’armée a réglé la note — environ 70 000 francs, payés aux compagnies au tarif convenu. Les chauffeurs de la Marne sont sans doute les seuls combattants de 1914 à avoir facturé leur course au ministère de la Guerre.',
    aRetenir: [
      'Du 6 au 12 septembre 1914, la contre-offensive française sur la Marne arrête l’invasion allemande à 50 km de Paris.',
      'Joffre dirige la bataille ; Gallieni, gouverneur militaire de Paris, lance l’armée Maunoury sur le flanc découvert de von Kluck.',
      'Les 600 taxis n’ont transporté que 5 000 hommes : leur poids est symbolique, pas militaire.',
      'La Marne fait échouer le plan Schlieffen et la guerre courte : fin 1914, 700 km de tranchées vont de la mer du Nord à la Suisse.',
    ],
    mots: [
      {
        mot: 'Plan Schlieffen',
        sens: 'Plan allemand de 1905 : écraser la France en six semaines en passant par la Belgique, avant de se retourner contre la Russie.',
      },
      {
        mot: 'Guerre de mouvement',
        sens: 'Phase où les armées manœuvrent et avancent ; elle dure six semaines en 1914.',
      },
      {
        mot: 'Guerre de position',
        sens: 'Front figé où l’on se bat depuis des tranchées, sans presque rien gagner de terrain.',
      },
      {
        mot: 'Course à la mer',
        sens: 'Tentatives des deux armées, d’octobre à novembre 1914, de se déborder par le nord jusqu’à la mer du Nord.',
      },
    ],
    lies: [
      'attentat-de-sarajevo',
      'bataille-de-verdun',
      'armistice-du-11-novembre-1918',
      'ferdinand-foch',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Marne',
      'taxis',
      'Joffre',
      'Gallieni',
      'von Kluck',
      'tranchées',
      'plan Schlieffen',
      '1914',
      'Ourcq',
      'course à la mer',
    ],
  },
  {
    id: 'bataille-de-verdun',
    volet: 'evenements',
    nom: 'La bataille de Verdun',
    date: '21 février – 19 décembre 1916',
    tri: 1916,
    fin: 1916,
    periode: 'guerres',
    emoji: '🪖',
    lieu: 'Verdun, Meuse',
    accroche:
      'Trois cents jours de bombardement sur vingt kilomètres carrés, 700 000 tués et blessés, et un front qui n’a pas bougé : Verdun est devenu le nom de la guerre.',
    citations: [
      {
        texte: 'Courage ! On les aura.',
        qui: 'Le général Pétain',
        contexte: 'Fin de son ordre du jour aux défenseurs de Verdun, le 10 avril 1916.',
      },
      {
        texte:
          'L’humanité est folle ! Il faut être fou pour faire ce que l’on fait maintenant. L’enfer ne peut être aussi terrible.',
        qui: 'Alfred Joubaire, sous-lieutenant, 22 ans',
        contexte: 'Dernières lignes de son carnet, le 22 mai 1916 ; il est tué le lendemain à Verdun.',
      },
      {
        texte: 'Saigner à blanc l’armée française.',
        qui: 'Le général von Falkenhayn',
        contexte: 'Le but qu’il assigne à l’offensive de Verdun, selon ses Mémoires publiés en 1920.',
        sens:
          'Le mémorandum d’origine n’a jamais été retrouvé : la formule résume une intention réelle — user l’adversaire plutôt que percer — mais elle vient d’un texte écrit après la défaite.',
        incertaine: true,
      },
      {
        texte: 'Vous ne les laisserez pas passer, mes camarades.',
        qui: 'Le général Nivelle',
        contexte:
          'Ordre du jour du 23 juin 1916, à l’heure la plus critique ; la formule deviendra « Ils ne passeront pas ».',
      },
    ],
    reperes: [
      'L’attaque allemande commence le 21 février 1916 par neuf heures de bombardement : un million d’obus sur 15 km de front.',
      'Le fort de Douaumont, le plus puissant de la place, tombe le 25 février presque sans combat.',
      'Pétain prend le commandement le 26 février et organise la relève : 70 % de l’armée française passera par Verdun.',
      'Sur la Voie sacrée, route unique venue de Bar-le-Duc, il passe un camion toutes les quatorze secondes.',
      'Douaumont est repris le 24 octobre, le fort de Vaux le 2 novembre ; la bataille s’achève le 19 décembre 1916.',
      'Bilan : environ 700 000 tués, blessés et disparus des deux camps, pour un front qui n’a pas bougé de dix kilomètres.',
    ],
    causes: [
      'La guerre de position : depuis la fin de 1914, le front ne bouge plus et chaque état-major cherche le moyen de le rompre.',
      'Le calcul de Falkenhayn : attaquer un point que les Français défendront à tout prix, pour y user leur armée plutôt que pour conquérir du terrain.',
      'La valeur symbolique de Verdun, place forte de la frontière depuis Vauban et verrou de la vallée de la Meuse.',
      'Un secteur dégarni : en 1915, l’état-major français a retiré une partie des canons des forts, jugés dépassés depuis la chute de Liège.',
      'Un saillant que l’artillerie allemande peut battre de trois côtés, tout près de ses voies ferrées et loin des dépôts français.',
    ],
    recit: [
      {
        titre: 'Neuf heures de bombardement',
        texte:
          'Le **21 février 1916 à 7 h 15**, 1 200 canons allemands ouvrent le feu sur un front de quinze kilomètres. En neuf heures, **un million d’obus** tombent sur les bois de la rive droite de la Meuse. Puis l’infanterie avance, appuyée pour la première fois en masse par des **lance-flammes**. Au **bois des Caures**, les chasseurs du colonel **Driant** — un député qui avait alerté en vain sur la faiblesse du secteur — tiennent deux jours avec 1 200 hommes contre 10 000 ; Driant est tué le 22 février en couvrant la retraite de ses survivants, qui sont 118. Le **25 février**, le **fort de Douaumont**, pièce maîtresse de la place, est enlevé par une poignée de soldats du régiment de Brandebourg entrés par une embrasure : il était gardé par une cinquantaine de territoriaux. À Paris, on parle d’évacuer la rive droite.',
      },
      {
        titre: 'Pétain, la relève et la Voie sacrée',
        texte:
          'Le **26 février**, le général **Pétain** prend le commandement avec une consigne simple : tenir, et **économiser les hommes**. Il organise deux choses. La **relève**, d’abord : au lieu d’user quelques divisions jusqu’au bout, il les fait tourner, huit à quinze jours en ligne puis repos — le « tourniquet ». **Soixante-dix pour cent** de l’armée française passera ainsi par Verdun, ce qui fera de cette bataille l’expérience commune de toute une génération. Le **ravitaillement**, ensuite : la seule route utilisable est la départementale de **Bar-le-Duc**, large de sept mètres. Pétain y lance un flux ininterrompu — jusqu’à **6 000 camions par jour**, un toutes les quatorze secondes —, interdit de s’arrêter, et fait jeter du gravier sous les roues par des territoriaux postés en permanence. Chaque semaine, 90 000 hommes et 50 000 tonnes de matériel montent par cette route que l’écrivain Maurice Barrès baptise la **Voie sacrée**.',
      },
      {
        titre: 'La vie du poilu',
        texte:
          'Ce dont les survivants parleront le plus, ce n’est pas l’assaut, c’est le **quotidien**. La **boue** de craie et d’argile, où l’on s’enfonce jusqu’aux cuisses et où des hommes chargés se noient. Les **rats**, gros comme des chats, qui courent sur les dormeurs, et les **poux** dont on ne se débarrasse pas — on appelle l’épouillage « la chasse ». L’eau qu’on boit dans les trous d’obus. Les corps qu’on ne peut pas enterrer et qui ressortent à chaque tir. La **relève**, de nuit, en file indienne sous les fusées éclairantes, avec trente kilos sur le dos, quatre heures de marche pour trois kilomètres. Et surtout l’**artillerie** : les trois quarts des morts de cette guerre sont tués par des obus, c’est-à-dire par un ennemi qu’on ne voit jamais. Contre tout cela, deux choses : le **courrier** — quatre millions de lettres par jour circulent entre le front et l’arrière — et les **colis**. Un poilu écrit en moyenne une lettre par jour ; pour beaucoup, c’est la première fois de leur vie qu’ils écrivent autant.',
      },
      {
        titre: 'Le fort de Vaux, l’été, la reprise',
        texte:
          'Le **7 juin**, après six jours de combats souterrains au corps à corps dans les couloirs, le **fort de Vaux** tombe : le commandant **Raynal** capitule parce que ses hommes n’ont plus d’eau depuis trois jours. Fin juin, les Allemands prennent Fleury, à quatre kilomètres de Verdun ; **Nivelle** lance son ordre du jour du 23 juin. Puis la pression retombe : le **1er juillet**, l’offensive franco-britannique sur la **Somme** oblige l’Allemagne à retirer des divisions et des canons, et l’échec de Verdun coûte son poste à **Falkenhayn** en août. À l’automne, l’armée française contre-attaque avec une artillerie enfin supérieure : **Douaumont** est repris le **24 octobre**, **Vaux** le **2 novembre**, et le front revient en décembre presque à sa ligne de février. Trois cents jours pour rien — sinon pour l’usure.',
      },
      {
        titre: 'Ce que Verdun a laissé',
        texte:
          'Le calcul de Falkenhayn s’est retourné : les pertes allemandes (environ **330 000**) approchent les pertes françaises (environ **370 000**). L’épuisement du printemps 1916 prépare les **mutineries** de 1917, après le nouvel échec de Nivelle au Chemin des Dames. Sur le terrain, **neuf villages** — Fleury, Douaumont, Louvemont… — ne sont jamais reconstruits : ils ont toujours un maire, mais plus d’habitants. La **zone rouge**, empoisonnée par les obus non explosés et l’arsenic, reste interdite à la culture ; on y ramasse encore des tonnes de ferraille chaque année. L’**ossuaire de Douaumont**, achevé en 1932, contient les restes de **130 000 soldats non identifiés**, français et allemands mêlés. C’est à Verdun, le **22 septembre 1984**, que **François Mitterrand** et **Helmut Kohl** se sont tenus par la main devant l’ossuaire : le lieu de la pire bataille est devenu celui de la réconciliation.',
      },
    ],
    consequences: [
      'L’armée française tient, mais 70 % de ses divisions sont passées par Verdun : la bataille marque toute une génération.',
      'Le calcul de Falkenhayn échoue et lui coûte son commandement en août 1916 : les pertes allemandes égalent presque les françaises.',
      'Pétain devient le « vainqueur de Verdun », une gloire dont il vivra jusqu’en 1940.',
      'L’usure de 1916 prépare les mutineries de 1917, après l’échec de l’offensive Nivelle au Chemin des Dames.',
      'Neuf villages détruits ne sont jamais reconstruits, et la zone rouge demeure interdite à la culture.',
      'L’ossuaire de Douaumont rassemble les restes de 130 000 inconnus ; Verdun devient le lieu de la réconciliation franco-allemande en 1984.',
    ],
    chiffres: [
      { valeur: '300 jours', quoi: 'de bataille, du 21 février au 19 décembre 1916' },
      { valeur: '700 000', quoi: 'tués, blessés et disparus des deux côtés' },
      { valeur: '60 millions', quoi: 'd’obus tirés sur le champ de bataille' },
      { valeur: '14 secondes', quoi: 'entre deux camions sur la Voie sacrée' },
    ],
    chrono: [
      { date: '21 février 1916', fait: 'Neuf heures de bombardement, puis l’assaut allemand.' },
      { date: '22 février 1916', fait: 'Mort du colonel Driant au bois des Caures.' },
      { date: '25 février 1916', fait: 'Chute du fort de Douaumont.' },
      { date: '26 février 1916', fait: 'Pétain prend le commandement ; organisation de la relève.' },
      { date: 'mars-mai 1916', fait: 'Combats du Mort-Homme et de la cote 304, rive gauche.' },
      { date: '7 juin 1916', fait: 'Le fort de Vaux capitule, faute d’eau.' },
      { date: '23 juin 1916', fait: 'Fleury est pris ; ordre du jour de Nivelle.' },
      { date: '1er juillet 1916', fait: 'L’offensive de la Somme soulage Verdun.' },
      { date: '24 octobre 1916', fait: 'Reprise du fort de Douaumont.' },
      { date: '19 décembre 1916', fait: 'Fin de la bataille, sur la ligne de février.' },
    ],
    leSaisTu:
      'Le dernier message du fort de Vaux est parti par pigeon voyageur. Le 4 juin 1916, le commandant Raynal lâche le pigeon nº 787 dans la fumée ; l’oiseau arrive à Verdun, délivre le message et meurt de ses brûlures. Il fut cité à l’ordre de la nation — le seul pigeon décoré de l’armée française.',
    aRetenir: [
      'La bataille de Verdun dure du 21 février au 19 décembre 1916, soit trois cents jours.',
      'Falkenhayn choisit Verdun pour user l’armée française, non pour percer le front.',
      'Pétain organise la relève des divisions et le ravitaillement par la Voie sacrée : 70 % de l’armée française passe par Verdun.',
      'Environ 700 000 hommes sont tués, blessés ou disparus des deux côtés, et le front revient à sa ligne de départ.',
      'Les trois quarts des morts de 1914-1918 sont tués par l’artillerie, un ennemi que le soldat ne voit jamais.',
    ],
    mots: [
      {
        mot: 'Poilu',
        sens: 'Surnom du soldat français de 1914-1918 : un homme qui vit dehors, barbu, dans la terre.',
      },
      {
        mot: 'Voie sacrée',
        sens: 'Route de Bar-le-Duc à Verdun, seul ravitaillement possible de la bataille, ainsi nommée par Maurice Barrès en 1916.',
      },
      {
        mot: 'Relève',
        sens: 'Remplacement, de nuit, d’une unité en première ligne par une autre.',
      },
      {
        mot: 'Zone rouge',
        sens: 'Terres si détruites et polluées par les obus qu’elles ont été déclarées incultivables après la guerre.',
      },
    ],
    lies: [
      'bataille-de-la-marne',
      'armistice-du-11-novembre-1918',
      'philippe-petain',
      'attentat-de-sarajevo',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Verdun',
      'Douaumont',
      'Voie sacrée',
      'poilus',
      'tranchées',
      'Pétain',
      'Falkenhayn',
      '1916',
      'ossuaire',
      'artillerie',
    ],
  },
  {
    id: 'revolution-russe-1917',
    volet: 'evenements',
    nom: 'La révolution russe',
    date: 'février – octobre 1917',
    tri: 1917,
    fin: 1918,
    periode: 'guerres',
    emoji: '🚩',
    lieu: 'Petrograd et la Russie',
    accroche:
      'En huit mois, la Russie renverse son tsar, essaie la république, se donne le premier État communiste du monde — et sort de la guerre.',
    citations: [
      {
        texte: 'Tout le pouvoir aux soviets !',
        qui: 'Lénine',
        contexte: 'Mot d’ordre des thèses d’avril, lancé dès son retour à Petrograd, le 3 avril 1917.',
        sens:
          'Refus de tout soutien au gouvernement provisoire : le pouvoir doit passer aux conseils d’ouvriers, de paysans et de soldats — que les bolcheviks entendent contrôler.',
      },
      {
        texte: 'La paix, le pain, la terre.',
        qui: 'Lénine',
        contexte: 'Programme bolchevique de 1917, répété d’usine en caserne jusqu’en octobre.',
        sens: 'Trois promesses qui répondent exactement aux trois plaies du pays : la guerre, la famine, la question paysanne.',
      },
      {
        texte: 'Nous avons jugé bon d’abdiquer la couronne de l’État russe.',
        qui: 'Nicolas II',
        contexte: 'Manifeste d’abdication signé dans son train, à Pskov, le 2 mars 1917 (15 mars).',
      },
      {
        texte: 'Allez où vous devez aller : dans les poubelles de l’histoire.',
        qui: 'Léon Trotski',
        contexte:
          'Aux mencheviks qui quittent le congrès des soviets, dans la nuit du 25 octobre 1917.',
      },
    ],
    reperes: [
      'Février 1917 : les émeutes du pain à Petrograd et la mutinerie de la garnison font abdiquer Nicolas II.',
      'Deux pouvoirs cohabitent : le gouvernement provisoire et le soviet des ouvriers et des soldats de Petrograd.',
      'Le gouvernement de Kerenski continue la guerre et remet à plus tard le partage des terres : c’est ce qui le perd.',
      'Lénine rentre d’exil le 3 avril 1917 et réclame la paix immédiate et « tout le pouvoir aux soviets ».',
      'Dans la nuit du 25 octobre (7 novembre), les bolcheviks prennent Petrograd presque sans combat.',
      'Le 3 mars 1918, la paix de Brest-Litovsk retire la Russie de la guerre au prix d’un quart de sa population.',
    ],
    causes: [
      'Un empire autocratique : le tsar gouverne seul, la Douma n’a presque aucun pouvoir, la police politique surveille tout.',
      'Une guerre catastrophique : près de deux millions de soldats russes tués, des unités envoyées au front sans fusil.',
      'La faim dans les villes : en février 1917, le pain est rationné à Petrograd et les ouvrières sortent des filatures.',
      'Une question paysanne jamais réglée : 80 % des Russes cultivent une terre qui ne leur appartient pas.',
      'L’erreur du gouvernement provisoire : poursuivre la guerre et reporter le partage des terres jusqu’à la victoire.',
      'Un parti bolchevik minoritaire mais organisé, discipliné et décidé à prendre le pouvoir quand les autres hésitent.',
    ],
    recit: [
      {
        titre: 'Février : la chute du tsar',
        texte:
          'Le **23 février 1917** du calendrier russe — le 8 mars du nôtre, jour de la journée internationale des femmes —, les ouvrières des filatures du quartier de Vyborg, à **Petrograd**, quittent leurs ateliers pour réclamer du pain. En trois jours, la grève gagne 200 000 personnes. Le tsar, au front, ordonne de tirer. Le **27 février**, le régiment Volhynien refuse, tue son officier et rejoint la foule : la garnison entière bascule en quelques heures. Deux pouvoirs sortent du même bâtiment, le palais de Tauride : la **Douma** forme un **gouvernement provisoire** de libéraux, pendant que les ouvriers et les soldats élisent un **soviet** — un « conseil » — qui contrôle réellement la rue et les casernes. Le **2 mars (15 mars)**, dans son train immobilisé à Pskov, **Nicolas II** abdique. Trois siècles de dynastie **Romanov** s’achèvent en cinq jours, sans qu’aucun parti ne l’ait organisé.',
      },
      {
        titre: 'Le double pouvoir et la guerre qui continue',
        texte:
          'Le gouvernement provisoire proclame les libertés, l’amnistie, l’égalité des cultes : la Russie devient en quelques semaines le pays le plus libre d’Europe. Mais il prend deux décisions qui le tuent. Il **continue la guerre**, par fidélité aux Alliés — l’offensive de juin 1917 s’effondre et les désertions se comptent par centaines de milliers. Et il **renvoie après la victoire** le partage des grands domaines, alors que les paysans, eux, commencent à se servir. Le soviet, de son côté, publie dès le 1er mars le **prikaz nº 1**, qui met les armes sous le contrôle des comités de soldats : l’armée cesse d’obéir à ses officiers. En juillet, une émeute ouvrière échoue et **Kerenski** prend la tête du gouvernement ; en août, il n’échappe au putsch du général **Kornilov** qu’en faisant armer les ouvriers bolcheviks. Il leur a donné les fusils avec lesquels ils le renverseront.',
      },
      {
        titre: 'Lénine et les thèses d’avril',
        texte:
          '**Lénine** est en exil en Suisse depuis dix ans et n’a rien vu venir de Février. L’Allemagne, qui a tout intérêt à désorganiser son adversaire, lui fait traverser son territoire dans un **wagon plombé** avec une trentaine de compagnons. Il arrive à la gare de Finlande le **3 avril 1917** et surprend ses propres partisans : dans ses **thèses d’avril**, il refuse tout soutien au gouvernement provisoire, exige la **paix immédiate**, la terre aux paysans, le contrôle des usines et « tout le pouvoir aux soviets ». C’est un programme et c’est surtout une méthode : ne rien partager, attendre que les autres échouent. Le parti bolchevik passe de **24 000 adhérents** en février à **350 000** en octobre, et devient majoritaire dans les soviets de Petrograd et de Moscou en septembre.',
      },
      {
        titre: 'Octobre : une nuit, presque sans combat',
        texte:
          'Dans la nuit du **24 au 25 octobre 1917** (6-7 novembre du calendrier occidental), le **comité militaire révolutionnaire** dirigé par **Trotski** fait occuper par les **gardes rouges** les ponts, les gares, la poste, le téléphone et la banque d’État. Il n’y a presque personne pour défendre le gouvernement : le **palais d’Hiver** est gardé par des élèves officiers et un bataillon de femmes, et il tombe dans la nuit après un coup à blanc du croiseur **Aurora**. On compte moins de dix morts. L’assaut héroïque, les vagues d’assaillants sous les projecteurs, c’est le film d’**Eisenstein** de 1927 qui l’a inventé. Dès le lendemain, le congrès des soviets vote les **décrets sur la paix et sur la terre**. Les promesses sont tenues ; les libertés de Février, non : l’**Assemblée constituante**, élue et majoritairement non bolchevique, est dissoute par la force en janvier 1918, la police politique (**Tcheka**) est créée en décembre 1917, et une **guerre civile** de quatre ans commence, qui fera plusieurs millions de morts.',
      },
      {
        titre: 'Brest-Litovsk : ce que ça change en France',
        texte:
          'Le **3 mars 1918**, à **Brest-Litovsk**, les bolcheviks signent avec l’Allemagne une paix séparée écrasante : la Russie abandonne la Pologne, les pays baltes, la Finlande et l’Ukraine, soit **un quart de sa population**, un tiers de ses terres cultivées et les trois quarts de son charbon et de son fer. Lénine l’assume : il lui faut la paix pour garder le pouvoir. La conséquence tombe aussitôt sur le front français. L’Allemagne rapatrie une **cinquantaine de divisions** de l’est et lance, le **21 mars 1918**, la plus grande offensive de toute la guerre : en trois mois, elle enfonce le front britannique, revient sur la Marne et bombarde Paris à 120 kilomètres avec la « Grosse Bertha ». La France répond en donnant à **Foch** le commandement unique des armées alliées. Ce qui sauve l’Ouest, c’est l’arrivée des Américains — un million d’hommes en juillet 1918. Sans eux, la sortie de guerre russe aurait pu suffire.',
      },
    ],
    consequences: [
      'La Russie devient le premier État communiste du monde ; l’URSS est créée en 1922.',
      'La paix de Brest-Litovsk, le 3 mars 1918, retire la Russie de la guerre et lui coûte un quart de sa population.',
      'Cinquante divisions allemandes passent à l’ouest : l’offensive du printemps 1918 ramène l’ennemi à 60 km de Paris.',
      'Une guerre civile de quatre ans ravage la Russie ; la France et ses alliés soutiennent les armées « blanches ».',
      'Le mouvement ouvrier européen se coupe en deux : en France, le congrès de Tours sépare socialistes et communistes en 1920.',
      'La peur — et l’espoir — de la révolution pèsent sur toute la politique européenne de l’entre-deux-guerres.',
    ],
    chiffres: [
      { valeur: '1,8 million', quoi: 'de soldats russes tués pendant la guerre' },
      { valeur: '300 ans', quoi: 'de dynastie Romanov, achevés en cinq jours' },
      { valeur: '1/4', quoi: 'de la population russe cédée à Brest-Litovsk' },
      { valeur: '50', quoi: 'divisions allemandes transférées vers le front français' },
    ],
    chrono: [
      { date: '23 février 1917 (8 mars)', fait: 'Grève des ouvrières de Petrograd, émeutes du pain.' },
      { date: '2 mars 1917 (15 mars)', fait: 'Abdication de Nicolas II ; fin des Romanov.' },
      { date: '3 avril 1917', fait: 'Retour de Lénine ; thèses d’avril.' },
      { date: 'juillet 1917', fait: 'Émeutes réprimées ; Kerenski chef du gouvernement.' },
      { date: 'août 1917', fait: 'Échec du putsch de Kornilov ; les bolcheviks s’arment.' },
      { date: '25 octobre 1917 (7 nov.)', fait: 'Prise du palais d’Hiver ; décrets sur la paix et la terre.' },
      { date: 'janvier 1918', fait: 'Dissolution de l’Assemblée constituante.' },
      { date: '3 mars 1918', fait: 'Paix de Brest-Litovsk : la Russie quitte la guerre.' },
      { date: '21 mars 1918', fait: 'Offensive allemande à l’ouest avec les divisions de l’est.' },
      { date: 'juillet 1918', fait: 'Nicolas II et sa famille sont fusillés à Iekaterinbourg.' },
      { date: '1922', fait: 'Fin de la guerre civile ; création de l’URSS.' },
    ],
    leSaisTu:
      'Le voyage de Lénine à travers l’Allemagne en guerre a été négocié par l’état-major allemand lui-même, qui voyait là une arme. Churchill l’écrira plus tard : les Allemands ont transporté Lénine vers la Russie « comme un bacille de la peste ». L’arme a fonctionné — et, vingt-quatre ans plus tard, elle s’est retournée.',
    aRetenir: [
      'En février 1917, la faim et la guerre provoquent la chute de Nicolas II : c’est la fin de l’Empire russe.',
      'Le gouvernement provisoire continue la guerre et perd le soutien des soldats, des ouvriers et des paysans.',
      'Les 24 et 25 octobre 1917, les bolcheviks de Lénine prennent le pouvoir à Petrograd presque sans combat.',
      'Le traité de Brest-Litovsk (3 mars 1918) sort la Russie de la guerre et libère cinquante divisions allemandes pour le front français.',
      'La Russie devient le premier État communiste du monde ; l’URSS naît en 1922.',
    ],
    mots: [
      {
        mot: 'Soviet',
        sens: 'Conseil élu d’ouvriers, de paysans ou de soldats, né en 1905 et réapparu en 1917.',
      },
      {
        mot: 'Bolchevik',
        sens: 'Membre de l’aile de Lénine du parti social-démocrate russe ; le mot veut dire « majoritaire ».',
      },
      {
        mot: 'Autocratie',
        sens: 'Régime où un seul homme, ici le tsar, détient tout le pouvoir sans contrôle.',
      },
      {
        mot: 'Calendrier julien',
        sens: 'Calendrier alors en usage en Russie, en retard de treize jours : d’où la « révolution d’Octobre » célébrée en novembre.',
      },
    ],
    lies: [
      'lenine',
      'staline',
      'armistice-du-11-novembre-1918',
      'attentat-de-sarajevo',
      'traite-de-versailles',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
    tags: [
      'Russie',
      'Lénine',
      'bolcheviks',
      'soviets',
      'Petrograd',
      'Octobre 1917',
      'Brest-Litovsk',
      'communisme',
      'Nicolas II',
      'Trotski',
    ],
  },
  {
    id: 'armistice-du-11-novembre-1918',
    volet: 'evenements',
    nom: 'L’armistice du 11 novembre 1918',
    date: '11 novembre 1918',
    tri: 1918,
    periode: 'guerres',
    emoji: '🕊️',
    lieu: 'Clairière de Rethondes, forêt de Compiègne',
    accroche:
      'Signé à 5 h 15 dans un wagon de la forêt de Compiègne, l’armistice fait taire les armes à 11 heures — après 1 566 jours de guerre.',
    citations: [
      {
        texte:
          'Les hostilités cesseront sur tout le front à partir du 11 novembre, à onze heures, heure française.',
        qui: 'Le maréchal Foch',
        contexte: 'Article premier de la convention d’armistice, signée à Rethondes à 5 h 15 le 11 novembre 1918.',
      },
      {
        texte: 'Ils ont des droits sur nous.',
        qui: 'Georges Clemenceau',
        contexte: 'À la Chambre des députés, le 11 novembre 1918, en parlant des soldats morts et de leurs familles.',
        sens:
          'La dette de la nation envers les combattants : c’est de cette phrase que sortiront les pensions, les monuments aux morts et le statut d’ancien combattant.',
      },
      {
        texte: 'Le 8 août est le jour de deuil de l’armée allemande.',
        qui: 'Le général Ludendorff',
        contexte: 'Sur la percée alliée d’Amiens du 8 août 1918, dans ses Souvenirs de guerre.',
      },
      {
        texte: 'Un peuple de soixante-dix millions d’hommes souffre, mais il ne meurt pas.',
        qui: 'Matthias Erzberger, chef de la délégation allemande',
        contexte: 'Dernière phrase prononcée dans le wagon de Rethondes, juste après la signature.',
      },
    ],
    reperes: [
      'L’armistice est signé à 5 h 15 le 11 novembre 1918, dans le wagon-bureau de Foch, à Rethondes.',
      'Les combats cessent à 11 heures : les cloches sonnent dans toute la France.',
      'L’Allemagne évacue en quinze jours la France, la Belgique, le Luxembourg et l’Alsace-Moselle.',
      'Elle livre 5 000 canons, 25 000 mitrailleuses, 1 700 avions, ses sous-marins et sa flotte de haute mer.',
      'Le bilan mondial : environ 10 millions de morts militaires, dont 1,4 million de Français et 4 millions de blessés français.',
      'Le 11 novembre 1920, un soldat inconnu est choisi à Verdun ; il repose sous l’Arc de triomphe depuis 1921.',
    ],
    causes: [
      'L’échec des offensives allemandes du printemps 1918 : la dernière carte de Ludendorff s’épuise à 60 km de Paris.',
      'L’arrivée des Américains : un million de soldats en juillet 1918, deux millions en novembre, et une industrie intacte.',
      'La contre-offensive alliée à partir du 18 juillet, sous le commandement unique de Foch, avec des centaines de chars.',
      'L’effondrement des alliés de l’Allemagne : la Bulgarie le 29 septembre, l’Empire ottoman le 30 octobre, l’Autriche-Hongrie le 3 novembre.',
      'Le blocus maritime et la faim à l’arrière allemand : rationnement, « hiver des rutabagas », grippe espagnole.',
      'La révolution allemande : mutinerie des marins de Kiel le 3 novembre, abdication de Guillaume II et république proclamée le 9 novembre.',
    ],
    recit: [
      {
        titre: 'L’Allemagne à bout',
        texte:
          'Le **21 mars 1918**, forte des divisions rapatriées de Russie, l’Allemagne joue son va-tout : cinq offensives successives enfoncent le front britannique, reviennent sur la Marne et permettent de bombarder Paris à 120 kilomètres. Mais les pertes sont énormes et les renforts ne viennent plus, tandis que débarquent **250 000 Américains par mois**. Le **18 juillet**, Foch — nommé commandant unique des armées alliées en mars — contre-attaque à Villers-Cotterêts avec des chars Renault FT ; le **8 août**, la percée d’**Amiens** enfonce le front allemand sur vingt kilomètres. À l’arrière, quatre ans de **blocus** ont affamé les villes, la **grippe espagnole** tue par centaines de milliers, et les alliés de Berlin capitulent l’un après l’autre. Le **3 novembre**, les marins de **Kiel** refusent d’appareiller ; le **9**, **Guillaume II** abdique et la république est proclamée à Berlin. C’est un gouvernement de six jours qui devra signer.',
      },
      {
        titre: 'Le wagon de Rethondes',
        texte:
          'Dans la nuit du **7 novembre**, une délégation allemande conduite par le député catholique **Matthias Erzberger** traverse les lignes à Haudroy, précédée d’un clairon et d’un drapeau blanc. Elle est menée par train jusqu’à une voie de garage d’artillerie, dans la **clairière de Rethondes**, en forêt de Compiègne : Foch a choisi un lieu isolé pour éviter la presse et les curieux. Le **8 novembre à 9 heures**, il entre dans son wagon-bureau, le **2419 D**, et ouvre par une question restée célèbre : « Que désirez-vous, messieurs ? » Ce n’est pas une négociation : les conditions sont lues, et l’Allemagne a **72 heures** pour les accepter. Elle signe le **11 novembre à 5 h 15** du matin. Les armes doivent se taire **six heures plus tard**, à 11 heures — le délai nécessaire pour prévenir tout le front.',
      },
      {
        titre: 'Onze heures',
        texte:
          'Entre la signature et le cessez-le-feu, on continue de se battre et de mourir : environ **2 700 hommes** sont tués sur le front ce dernier matin, parfois pour un village qui sera de toute façon évacué à midi. À 11 heures, les clairons sonnent, les cloches partent dans tous les villages de France, des soldats sortent des tranchées et restent debout, incrédules, dans un silence dont tous les témoins disent qu’il était assourdissant. Le même jour, à la Chambre, **Clemenceau** lit le texte de l’armistice et les députés se lèvent. Le soir, Paris danse. Mais le pays compte : **1,4 million de Français tués**, soit un mobilisé sur six et presque tous entre 18 et 30 ans ; **4 millions de blessés**, dont 300 000 mutilés ; **600 000 veuves** et **760 000 orphelins**. Près de **36 000 communes** élèveront un monument aux morts.',
      },
      {
        titre: 'Les gueules cassées',
        texte:
          'La guerre a inventé une blessure : l’éclat d’obus qui emporte le bas du visage d’un homme couché au bord d’une tranchée. On les appelle les **gueules cassées**, formule due au colonel **Picot**, lui-même défiguré et fondateur de l’Union des blessés de la face. Ils sont **15 000** en France. Pour eux naît une médecine neuve, la **chirurgie réparatrice** : greffes de peau, reconstructions en plusieurs dizaines d’opérations, prothèses en galvanoplastie peintes à la main pour rendre un nez ou une mâchoire. Beaucoup n’osent plus rentrer chez eux ; l’Union leur achète des maisons communes. **Cinq d’entre eux** seront placés en évidence dans la galerie des Glaces, le 28 juin 1919, face aux plénipotentiaires allemands venus signer la paix : le traité serait signé sous leurs yeux.',
      },
      {
        titre: 'Le Soldat inconnu',
        texte:
          'Comment honorer des centaines de milliers de **disparus** dont on n’a jamais retrouvé le corps ? En en choisissant un, au hasard, et en l’enterrant pour tous. Le **10 novembre 1920**, dans la citadelle de **Verdun**, huit cercueils de soldats non identifiés sont alignés ; le soldat **Auguste Thin**, fils d’un disparu, dépose un bouquet sur le sixième. Le corps est conduit à Paris et inhumé sous l’**Arc de triomphe** le **28 janvier 1921**. La **flamme** est allumée le 11 novembre 1923 et ravivée chaque soir depuis, sans interruption — même sous l’Occupation. Le **11 novembre** devient jour férié en **1922**. C’est la première fois qu’une nation élève un monument non à un général, mais à un soldat dont on ignore jusqu’au nom.',
      },
    ],
    consequences: [
      'L’Allemagne évacue les territoires occupés et livre son matériel : elle ne peut plus reprendre le combat.',
      'L’Alsace et la Moselle redeviennent françaises après quarante-sept ans allemands.',
      'Quatre empires disparaissent : allemand, austro-hongrois, ottoman et russe.',
      'La France compte 1,4 million de morts, 4 millions de blessés, 600 000 veuves et 760 000 orphelins.',
      'Presque chaque commune élève un monument aux morts : il y en a environ 36 000 en France.',
      'Le 11 novembre devient jour férié en 1922 ; la flamme du Soldat inconnu est ravivée chaque soir depuis 1923.',
      'L’armistice n’est pas la paix : celle-ci se négociera à Paris et sera signée à Versailles le 28 juin 1919.',
    ],
    chiffres: [
      { valeur: '10 millions', quoi: 'de morts militaires dans le monde' },
      { valeur: '1,4 million', quoi: 'de soldats français tués' },
      { valeur: '4 millions', quoi: 'de blessés français, dont 300 000 mutilés' },
      { valeur: '11 h', quoi: 'du 11ᵉ jour du 11ᵉ mois : l’heure du cessez-le-feu' },
    ],
    chrono: [
      { date: '21 mars 1918', fait: 'Dernière grande offensive allemande à l’ouest.' },
      { date: '26 mars 1918', fait: 'Foch reçoit le commandement unique des armées alliées.' },
      { date: '18 juillet 1918', fait: 'Contre-offensive de Villers-Cotterêts : le front s’inverse.' },
      { date: '8 août 1918', fait: 'Percée d’Amiens, « jour de deuil de l’armée allemande ».' },
      { date: '29 septembre 1918', fait: 'La Bulgarie capitule ; le bloc allemand se disloque.' },
      { date: '3 novembre 1918', fait: 'Mutinerie des marins de Kiel ; l’Autriche-Hongrie signe.' },
      { date: '9 novembre 1918', fait: 'Abdication de Guillaume II, république proclamée à Berlin.' },
      { date: '11 novembre 1918, 5 h 15', fait: 'Signature de l’armistice à Rethondes.' },
      { date: '11 novembre 1918, 11 h', fait: 'Cessez-le-feu sur tout le front.' },
      { date: '28 janvier 1921', fait: 'Le Soldat inconnu est inhumé sous l’Arc de triomphe.' },
    ],
    leSaisTu:
      'Le dernier soldat français tué est Augustin Trébuchon, agent de liaison, abattu à 10 h 50 le 11 novembre en portant un message annonçant… la soupe pour 11 h 30. Sur sa tombe, comme sur celles de tous les morts de ce dernier matin, l’administration a fait graver la date du 10 novembre 1918.',
    aRetenir: [
      'L’armistice est signé le 11 novembre 1918 à 5 h 15 à Rethondes ; les combats cessent à 11 heures.',
      'Vaincue militairement depuis l’été et en pleine révolution, l’Allemagne évacue les territoires occupés et livre son armement.',
      'La guerre a fait environ 10 millions de morts militaires, dont 1,4 million de Français et 4 millions de blessés français.',
      'Les 15 000 « gueules cassées » françaises font naître la chirurgie réparatrice ; cinq d’entre elles assisteront à la signature de la paix en 1919.',
      'Le 11 novembre devient jour férié en 1922 ; le Soldat inconnu repose sous l’Arc de triomphe depuis 1921.',
    ],
    mots: [
      {
        mot: 'Armistice',
        sens: 'Arrêt des combats convenu entre deux armées ; ce n’est pas la paix, qui exige un traité.',
      },
      {
        mot: 'Gueule cassée',
        sens: 'Soldat défiguré par un éclat d’obus ; l’expression vient du colonel Picot, lui-même blessé au visage.',
      },
      {
        mot: 'Soldat inconnu',
        sens: 'Corps non identifié choisi en 1920 pour représenter tous les disparus de la guerre.',
      },
      {
        mot: 'Monument aux morts',
        sens: 'Stèle élevée après 1918 dans presque chaque commune, portant les noms des habitants tués.',
      },
    ],
    lies: [
      'traite-de-versailles',
      'bataille-de-verdun',
      'georges-clemenceau',
      'ferdinand-foch',
      'revolution-russe-1917',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'armistice',
      '11 novembre',
      'Rethondes',
      'Compiègne',
      'Clemenceau',
      'Foch',
      'gueules cassées',
      'Soldat inconnu',
      'monument aux morts',
      '1918',
    ],
  },
  {
    id: 'traite-de-versailles',
    volet: 'evenements',
    nom: 'Le traité de Versailles',
    date: '28 juin 1919',
    tri: 1919,
    periode: 'guerres',
    emoji: '📜',
    lieu: 'Galerie des Glaces, château de Versailles',
    accroche:
      'Cinq ans jour pour jour après Sarajevo, l’Allemagne signe une paix qu’elle appellera aussitôt un « diktat » — et que Foch juge trop faible.',
    citations: [
      {
        texte: 'Ce n’est pas une paix, c’est un armistice de vingt ans.',
        qui: 'Le maréchal Foch',
        contexte: 'À la lecture du traité, en juin 1919 : il le juge insuffisant, faute d’une frontière sur le Rhin.',
        sens:
          'Il s’est trompé de deux mois : la guerre reprend le 1er septembre 1939, vingt ans et deux mois après la signature.',
      },
      {
        texte:
          'L’Allemagne est responsable, pour les avoir causés, de tous les dommages subis par les gouvernements alliés et leurs peuples.',
        qui: 'Le traité, article 231',
        contexte: 'Article ouvrant la partie « Réparations ». Le même texte figure dans les traités signés avec l’Autriche et la Hongrie.',
        sens:
          'Juridiquement, il fonde le droit de faire payer les destructions. En Allemagne, il est lu comme la reconnaissance forcée d’une culpabilité morale.',
      },
      {
        texte: 'C’est une paix carthaginoise.',
        qui: 'John Maynard Keynes',
        contexte:
          'Dans *Les Conséquences économiques de la paix*, 1919 ; il avait démissionné de la délégation britannique.',
        sens:
          'Comme Rome détruisant Carthage : une paix qui ruine le vaincu au lieu de le remettre debout — donc, pour Keynes, une paix qui ne tiendra pas.',
      },
      {
        texte: 'Le président Wilson a quatorze points ; le bon Dieu n’en avait que dix.',
        qui: 'Georges Clemenceau',
        contexte: 'Mot prêté au président du Conseil français pendant la conférence de la paix, en 1919.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le traité est signé le 28 juin 1919 dans la galerie des Glaces, là même où l’Empire allemand avait été proclamé en 1871.',
      'L’Allemagne n’a pas négocié : elle reçoit un texte achevé et le choix entre signer ou être envahie.',
      'L’article 231 lui fait reconnaître sa responsabilité dans les dommages : c’est le fondement des réparations.',
      'L’Alsace et la Moselle reviennent à la France ; l’Allemagne perd 15 % de son territoire et toutes ses colonies.',
      'Son armée est ramenée à 100 000 hommes, sans chars, sans aviation, sans sous-marins ; la Rhénanie est démilitarisée.',
      'Le traité crée la Société des Nations — que le Sénat des États-Unis refuse ensuite de rejoindre.',
    ],
    causes: [
      'La victoire alliée de novembre 1918 et un armistice qui laisse l’Allemagne désarmée face aux vainqueurs.',
      'La demande française de sécurité : deux invasions en cinquante ans, dix départements dévastés, 1,4 million de morts.',
      'Le poids des dettes de guerre : la France et le Royaume-Uni doivent des milliards aux États-Unis et comptent sur l’Allemagne pour les rembourser.',
      'Les Quatorze Points du président Wilson : droit des peuples à disposer d’eux-mêmes, diplomatie ouverte, société des nations.',
      'Des vainqueurs qui ne veulent pas la même chose : Clemenceau la sécurité, Lloyd George l’équilibre commercial, Wilson les principes.',
      'Le souvenir de 1871 : la France entend rendre à l’Allemagne exactement la scène où l’Empire allemand avait été proclamé.',
    ],
    recit: [
      {
        titre: 'Une conférence à vingt-sept, une décision à quatre',
        texte:
          'La conférence de la paix s’ouvre à Paris le **18 janvier 1919** — l’anniversaire exact de la proclamation de l’Empire allemand à Versailles, en 1871. Vingt-sept nations y siègent, mais tout se décide au **Conseil des Quatre** : **Clemenceau** pour la France, **Wilson** pour les États-Unis, **Lloyd George** pour le Royaume-Uni, **Orlando** pour l’Italie. Les vaincus ne sont pas invités, la Russie bolchevique non plus. Les objectifs divergent : Clemenceau veut des garanties matérielles contre une troisième invasion ; Wilson veut fonder un ordre international sur le droit des peuples ; Lloyd George ne veut pas ruiner un client commercial ni pousser l’Allemagne vers le communisme. Le texte final — **440 articles** — est un compromis, c’est-à-dire un traité assez dur pour humilier et trop doux pour désarmer durablement.',
      },
      {
        titre: 'La galerie des Glaces, 28 juin 1919',
        texte:
          'Le lieu n’est pas choisi au hasard, et personne ne s’y trompe. C’est dans la **galerie des Glaces** de Versailles que, le 18 janvier 1871, la Prusse victorieuse avait proclamé l’**Empire allemand** en pleine France occupée. Quarante-huit ans plus tard, la France y convoque l’Allemagne vaincue, le **28 juin 1919** — cinq ans jour pour jour après l’attentat de **Sarajevo**. Deux signataires allemands, le ministre **Hermann Müller** et **Johannes Bell**, traversent la galerie entre deux haies de délégués ; **cinq gueules cassées** ont été placées au premier rang. La signature a lieu à 15 h 12 ; les canons des Invalides tirent, les jets d’eau du parc sont lâchés. Clemenceau prononce une phrase de quatre mots : « La séance est levée. »',
      },
      {
        titre: 'Ce que le traité impose',
        texte:
          'Sur le **territoire** : l’**Alsace et la Moselle** reviennent à la France, Eupen et Malmédy à la Belgique, la Posnanie et un « couloir » vers la mer à la nouvelle **Pologne**, qui coupe l’Allemagne en deux ; Dantzig devient ville libre ; la **Sarre** passe quinze ans sous administration de la SDN, ses mines exploitées par la France. Toutes les **colonies** allemandes sont retirées et confiées en « mandats » aux vainqueurs. Au total, **15 % du territoire** et 10 % de la population. Sur l’**armée** : 100 000 hommes, pas de service militaire, pas de chars, pas d’aviation militaire, pas de sous-marins, marine réduite ; la **Rhénanie** est démilitarisée et occupée quinze ans. Sur l’**argent** : l’Allemagne doit réparer les destructions ; le montant, laissé en blanc en 1919, sera fixé en 1921 à **132 milliards de marks-or**. Enfin l’union avec l’Autriche, l’**Anschluss**, est interdite.',
      },
      {
        titre: 'Le « diktat » et l’article 231',
        texte:
          'En Allemagne, le traité est reçu comme une humiliation nationale. On l’appelle le **Diktat** — la paix dictée. L’**article 231**, qui ouvre la partie sur les réparations, en devient le symbole : juridiquement il établit une responsabilité pour les **dommages**, afin de fonder le droit d’exiger un paiement ; il est lu et enseigné comme l’aveu forcé d’une **culpabilité** dans le déclenchement de la guerre. Comme l’armée allemande n’avait jamais reculé jusque sur son propre sol, la droite nationaliste propage la légende du « coup de poignard dans le dos » (*Dolchstoss*) : l’armée aurait été trahie par les civils, les socialistes, la jeune république. Les partis qui ont signé — ceux de **Weimar** — porteront ce reproche jusqu’à leur chute. Aucun texte n’a autant servi à **Hitler**, qui en fera le premier argument de tous ses discours.',
      },
      {
        titre: 'La SDN, et ce qui n’a pas tenu',
        texte:
          'Le traité crée la **Société des Nations**, idée majeure de Wilson : une assemblée permanente des États, installée à Genève, chargée de régler les conflits par la discussion et la « sécurité collective ». Elle naît infirme. Le **Sénat américain** refuse de ratifier le traité en 1920 : les États-Unis, qui l’ont inspirée, n’y entreront jamais — et la garantie militaire qu’ils avaient promise à la France tombe avec. La SDN n’a ni armée ni moyen de contrainte. L’Allemagne n’y est admise qu’en **1926** et en sort en 1933, le Japon aussi ; l’Italie en 1937. Pendant ce temps, l’Allemagne défait le traité article par article : **conscription rétablie en 1935**, **remilitarisation de la Rhénanie en 1936**, **Anschluss en 1938**. Le 1er septembre 1939, la guerre reprend là où elle s’était arrêtée. Foch avait dit vingt ans ; il en avait fallu vingt et deux mois.',
      },
    ],
    consequences: [
      'L’Alsace et la Moselle reviennent à la France ; la Sarre passe quinze ans sous administration internationale.',
      'L’Europe centrale est redessinée : Pologne, Tchécoslovaquie et Yougoslavie naissent du démembrement des empires.',
      'L’Allemagne, désarmée et endettée, vit le traité comme un « diktat » : c’est le fonds de commerce des nationalistes, puis des nazis.',
      'Les réparations empoisonnent les années 1920 : occupation de la Ruhr en 1923, hyperinflation allemande, plans Dawes et Young.',
      'La Société des Nations naît sans les États-Unis, sans armée et sans moyen de contrainte.',
      'Hitler démonte le traité pièce par pièce : conscription en 1935, Rhénanie en 1936, Anschluss en 1938.',
    ],
    chiffres: [
      { valeur: '440', quoi: 'articles dans le traité' },
      { valeur: '132 milliards', quoi: 'de marks-or de réparations, fixés en 1921' },
      { valeur: '100 000', quoi: 'hommes : le maximum laissé à l’armée allemande' },
      { valeur: '15 %', quoi: 'du territoire allemand perdu, et toutes ses colonies' },
    ],
    chrono: [
      { date: '18 janvier 1871', fait: 'L’Empire allemand est proclamé dans la galerie des Glaces.' },
      { date: '8 janvier 1918', fait: 'Les Quatorze Points du président Wilson.' },
      { date: '18 janvier 1919', fait: 'Ouverture de la conférence de la paix à Paris.' },
      { date: '7 mai 1919', fait: 'Le texte est remis aux Allemands, sans discussion possible.' },
      { date: '28 juin 1919', fait: 'Signature dans la galerie des Glaces, à 15 h 12.' },
      { date: '10 janvier 1920', fait: 'Entrée en vigueur ; naissance de la Société des Nations.' },
      { date: '19 mars 1920', fait: 'Le Sénat américain refuse de ratifier le traité.' },
      { date: 'avril 1921', fait: 'Les réparations sont fixées à 132 milliards de marks-or.' },
      { date: 'janvier 1923', fait: 'Occupation de la Ruhr après un défaut de paiement.' },
      { date: '1935-1936', fait: 'Hitler rétablit la conscription et remilitarise la Rhénanie.' },
    ],
    leSaisTu:
      'Le wagon de Rethondes, où l’Allemagne avait signé l’armistice de 1918, était devenu un monument national. Le 22 juin 1940, Hitler l’a fait sortir de son abri et replacer à l’endroit exact de la clairière pour y recevoir la capitulation française. Le décor avait été choisi avec le même soin qu’en 1919.',
    aRetenir: [
      'Le traité de Versailles est signé le 28 juin 1919 dans la galerie des Glaces, où l’Empire allemand avait été proclamé en 1871.',
      'L’article 231 rend l’Allemagne responsable des dommages et fonde les réparations, fixées en 1921 à 132 milliards de marks-or.',
      'L’Allemagne perd l’Alsace-Moselle, 15 % de son territoire et ses colonies ; son armée est limitée à 100 000 hommes.',
      'Le traité crée la Société des Nations, que les États-Unis refusent finalement de rejoindre.',
      'Foch le juge insuffisant : « un armistice de vingt ans » — la guerre reprend vingt ans et deux mois plus tard.',
    ],
    mots: [
      {
        mot: 'Diktat',
        sens: 'Mot allemand pour « paix dictée » : un traité imposé sans négociation possible.',
      },
      {
        mot: 'Réparations',
        sens: 'Sommes que le vaincu doit verser pour réparer les destructions de la guerre.',
      },
      {
        mot: 'Société des Nations',
        sens: 'Organisation créée en 1920 pour régler les conflits par la discussion ; sans armée, et sans les États-Unis.',
      },
      {
        mot: 'Mandat',
        sens: 'Territoire retiré au vaincu et administré par un vainqueur au nom de la SDN.',
      },
      {
        mot: 'Démilitarisation',
        sens: 'Interdiction faite à un État d’entretenir des troupes ou des fortifications dans une région donnée.',
      },
    ],
    lies: [
      'armistice-du-11-novembre-1918',
      'crise-de-1929',
      'georges-clemenceau',
      'ferdinand-foch',
      'adolf-hitler',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Versailles',
      'traité',
      '1919',
      'article 231',
      'diktat',
      'réparations',
      'galerie des Glaces',
      'SDN',
      'Wilson',
      'Clemenceau',
      'Alsace-Moselle',
    ],
  },
  {
    id: 'crise-de-1929',
    volet: 'evenements',
    nom: 'La crise de 1929',
    date: '24 octobre 1929 – 1939',
    tri: 1929,
    fin: 1939,
    periode: 'guerres',
    emoji: '📉',
    lieu: 'New York, Wall Street, puis le monde entier',
    accroche:
      'Le 24 octobre 1929, la Bourse de New York s’effondre. Trois ans plus tard, un actif américain sur quatre est sans travail et Hitler est aux portes du pouvoir.',
    citations: [
      {
        texte: 'La seule chose dont nous devions avoir peur, c’est la peur elle-même.',
        qui: 'Franklin Roosevelt',
        contexte: 'Discours d’investiture, le 4 mars 1933, devant un pays qui compte treize millions de chômeurs.',
      },
      {
        texte: 'À long terme, nous serons tous morts.',
        qui: 'John Maynard Keynes',
        contexte: 'Formule de 1923, reprise dans les années 1930 contre ceux qui attendaient que le marché se rééquilibre seul.',
        sens:
          'Dire qu’une crise se corrige « à long terme » ne nourrit personne aujourd’hui : pour Keynes, l’État doit dépenser tout de suite pour relancer l’activité.',
      },
      {
        texte: 'La prospérité est au coin de la rue.',
        qui: 'Herbert Hoover',
        contexte: 'Formule attribuée au président américain vers 1930-1932, quand le chômage explose.',
        sens:
          'Rien ne prouve qu’il l’ait prononcée ainsi, mais elle a collé à son nom : elle résume l’attente d’un retour spontané de la croissance.',
        incertaine: true,
      },
      {
        texte: 'Je vois un tiers de la nation mal logé, mal vêtu, mal nourri.',
        qui: 'Franklin Roosevelt',
        contexte: 'Second discours d’investiture, le 20 janvier 1937, après quatre ans de New Deal.',
      },
    ],
    reperes: [
      'Le jeudi 24 octobre 1929, treize millions d’actions sont jetées sur le marché de Wall Street en une séance.',
      'Beaucoup avaient acheté à crédit : on avançait 10 % du prix d’une action et le courtier prêtait le reste.',
      'La chute ruine les porteurs, puis les banques qui leur avaient prêté : 9 000 banques américaines font faillite entre 1930 et 1933.',
      'Le chômage atteint 25 % aux États-Unis en 1932 et près de 30 % en Allemagne la même année.',
      'La crise gagne le monde par les capitaux et le commerce : les échanges mondiaux reculent des deux tiers.',
      'Roosevelt répond par le New Deal à partir de 1933 ; en Allemagne, la misère porte les nazis au pouvoir.',
    ],
    causes: [
      'Une décennie de spéculation : à New York, le cours des actions triple entre 1925 et 1929 sans que la production suive.',
      'L’achat à crédit : on avance 10 % du prix d’un titre et l’on emprunte le reste, ce qui transforme toute baisse en ruine.',
      'Une surproduction industrielle et agricole : les stocks s’accumulent, le prix du blé et du coton s’effondre dès 1926.',
      'Des salaires qui montent moins vite que la production : les ouvriers ne peuvent pas acheter ce qu’ils fabriquent.',
      'Un système bancaire sans contrôle : 25 000 banques indépendantes, aucune garantie des dépôts, aucune surveillance sérieuse.',
      'Une économie mondiale suspendue aux capitaux américains — l’Allemagne paie ses réparations avec des prêts venus de New York.',
    ],
    recit: [
      {
        titre: 'Les années folles, à crédit',
        texte:
          'Les États-Unis des années 1920 sont le pays le plus riche que le monde ait connu : l’automobile, la radio, l’électroménager, le cinéma. Tout se vend à **tempérament**, c’est-à-dire à crédit — six voitures sur dix. La Bourse devient un sport national : on peut acheter une action en versant **10 % de son prix**, le courtier avançant le reste sur la seule garantie du titre. Tant que les cours montent, le système enrichit tout le monde ; l’indice de Wall Street **triple entre 1925 et 1929**. Un million et demi d’Américains jouent en Bourse, dont des employés et des ouvriers qui empruntent pour spéculer. Or, dans le même temps, la **production dépasse la consommation** : les stocks d’invendus grossissent, les prix agricoles baissent depuis 1926, et la valeur des actions n’a plus grand rapport avec ce que les entreprises gagnent réellement.',
      },
      {
        titre: 'Le jeudi noir',
        texte:
          'Le **jeudi 24 octobre 1929**, la confiance se retourne : **12,9 millions de titres** sont mis en vente en une séance à Wall Street, quatre fois le volume ordinaire, et les cours s’écroulent faute d’acheteurs. Des banquiers se cotisent à midi pour racheter des valeurs et arrêter la panique ; cela tient cinq jours. Le **mardi 29 octobre**, le « mardi noir », **16,4 millions d’actions** sont bradées et il n’y a plus personne en face. Ceux qui avaient acheté à crédit doivent rembourser un emprunt supérieur à ce que valent désormais leurs titres : ils vendent tout, ce qui fait baisser encore les cours. La chute ne s’arrêtera qu’en **juillet 1932**, quand l’indice aura perdu **89 %** de sa valeur. La légende des banquiers se jetant par les fenêtres est très exagérée ; la ruine, elle, ne l’est pas.',
      },
      {
        titre: 'De la Bourse à l’usine',
        texte:
          'Un krach boursier ne suffit pas à ruiner un pays : ce qui transforme celui de 1929 en **dépression**, c’est l’enchaînement. Les épargnants ruinés cessent d’acheter ; les entreprises, invendues, réduisent la production et **licencient** ; les licenciés n’achètent plus rien à leur tour. Les banques, qui avaient prêté aux spéculateurs, ne sont plus remboursées ; les déposants se précipitent aux guichets, et comme rien ne garantit leurs dépôts, les faillites en chaîne emportent **9 000 banques** entre 1930 et 1933. Les prix baissent (**déflation**), ce qui alourdit toutes les dettes. Les fermiers endettés sont expulsés par dizaines de milliers, au moment même où la sécheresse et l’érosion du **Dust Bowl** chassent les familles de l’Oklahoma vers la Californie. En 1932, les États-Unis comptent **13 millions de chômeurs** et des bidonvilles au pied des villes.',
      },
      {
        titre: 'La crise devient mondiale, la crise devient politique',
        texte:
          'Pour se sauver, les banques américaines rapatrient leurs capitaux placés en Europe. L’édifice s’écroule : en **mai 1931**, la faillite de la **Kreditanstalt** de Vienne entraîne toute l’Europe centrale. Chaque pays se protège alors à coups de droits de douane — les États-Unis ont ouvert le bal avec le tarif **Smoot-Hawley** en 1930 — et le **commerce mondial recule des deux tiers** en trois ans. L’**Allemagne**, qui vivait des prêts américains, est la plus touchée : **six millions de chômeurs** en 1932, un actif sur trois. Le désespoir se transforme en votes : le parti **nazi** passe de 12 députés en 1928 à 230 en juillet 1932, devient le premier parti du Reichstag, et **Hitler** est nommé chancelier le **30 janvier 1933**. Au Japon, la crise pousse les militaires à la conquête de la Mandchourie dès 1931. En France, touchée plus tard (1931-1932), elle nourrit les ligues, l’émeute du 6 février 1934, puis la victoire du **Front populaire** en 1936.',
      },
      {
        titre: 'Le New Deal',
        texte:
          'Élu en novembre 1932, **Franklin Roosevelt** prend ses fonctions le 4 mars 1933 et change de doctrine : l’État n’attendra pas que le marché se corrige, il **interviendra**. En cent jours, il ferme les banques le temps de les assainir et **garantit les dépôts**, sépare banques de dépôt et banques d’affaires, soutient les prix agricoles, fixe des règles de salaires et de prix dans l’industrie, et lance de **grands travaux** : barrages de la vallée du Tennessee, routes, écoles, ponts, où des millions de chômeurs sont embauchés. En 1935 viennent la première **sécurité sociale** américaine et le droit syndical. Roosevelt explique tout cela à la radio, dans ses « causeries au coin du feu ». Le chômage recule de 25 % à environ 15 % en 1937, sans disparaître : c’est la guerre, à partir de 1939, qui remettra les usines en marche. Mais le principe restera — **l’État est comptable de l’économie** —, et c’est sur lui que l’après-1945 sera bâti.',
      },
    ],
    consequences: [
      'Aux États-Unis, la production industrielle est divisée par deux et treize millions de personnes perdent leur emploi.',
      'Le commerce mondial recule des deux tiers : chaque État se protège par des droits de douane et des dévaluations.',
      'En Allemagne, six millions de chômeurs portent le parti nazi au premier rang : Hitler devient chancelier le 30 janvier 1933.',
      'Le New Deal fait entrer l’État dans l’économie américaine : grands travaux, garantie des dépôts, sécurité sociale en 1935.',
      'En France, la crise nourrit les ligues, la journée du 6 février 1934, puis la victoire du Front populaire en 1936.',
      'Les leçons sont tirées après 1945 : contrôle des banques, protection sociale et coopération monétaire.',
    ],
    chiffres: [
      { valeur: '16,4 millions', quoi: 'd’actions vendues le mardi noir, 29 octobre 1929' },
      { valeur: '25 %', quoi: 'de chômeurs aux États-Unis en 1932' },
      { valeur: '9 000', quoi: 'banques américaines en faillite entre 1930 et 1933' },
      { valeur: '6 millions', quoi: 'de chômeurs allemands en 1932' },
    ],
    chrono: [
      { date: '24 octobre 1929', fait: 'Jeudi noir : 12,9 millions d’actions vendues à Wall Street.' },
      { date: '29 octobre 1929', fait: 'Mardi noir : effondrement définitif des cours.' },
      { date: 'juin 1930', fait: 'Tarif Smoot-Hawley : les États-Unis ferment leurs frontières.' },
      { date: 'mai 1931', fait: 'Faillite de la Kreditanstalt à Vienne ; la crise gagne l’Europe.' },
      { date: '1932', fait: '13 millions de chômeurs aux États-Unis, 6 millions en Allemagne.' },
      { date: 'juillet 1932', fait: 'Le parti nazi devient le premier parti du Reichstag.' },
      { date: '30 janvier 1933', fait: 'Hitler est nommé chancelier.' },
      { date: '4 mars 1933', fait: 'Investiture de Roosevelt ; les Cent Jours du New Deal.' },
      { date: '1935', fait: 'Loi sur la sécurité sociale aux États-Unis.' },
      { date: '1936', fait: 'Victoire du Front populaire en France.' },
      { date: '1939', fait: 'La guerre, plus que le New Deal, met fin au chômage de masse.' },
    ],
    leSaisTu:
      'Les bidonvilles de planches et de tôles apparus au pied des villes américaines ont été baptisés « Hoovervilles », du nom du président. Le journal dont on se couvrait pour dormir était une « couverture Hoover », et une poche de pantalon retournée, vide, un « drapeau Hoover ». Il a perdu l’élection de 1932 dans quarante-deux États sur quarante-huit.',
    aRetenir: [
      'Le krach de Wall Street commence le jeudi 24 octobre 1929 et culmine le mardi 29 octobre.',
      'La spéculation à crédit transforme la baisse des cours en faillites en chaîne : 9 000 banques américaines disparaissent en trois ans.',
      'En 1932, un actif sur quatre est au chômage aux États-Unis et six millions d’Allemands sont sans emploi.',
      'La misère nourrit les extrémismes : le parti nazi devient le premier parti allemand en 1932, Hitler est chancelier en janvier 1933.',
      'Roosevelt répond par le New Deal dès 1933 : l’État intervient pour créer des emplois et garantir les dépôts bancaires.',
    ],
    mots: [
      {
        mot: 'Krach',
        sens: 'Effondrement brutal des cours de la Bourse.',
      },
      {
        mot: 'Spéculation',
        sens: 'Achat d’un bien dans le seul but de le revendre plus cher, sans intention de s’en servir.',
      },
      {
        mot: 'Déflation',
        sens: 'Baisse générale des prix : elle paraît une bonne nouvelle, mais elle alourdit les dettes et bloque l’activité.',
      },
      {
        mot: 'New Deal',
        sens: '« Nouvelle donne » : la politique de Roosevelt à partir de 1933, où l’État intervient dans l’économie.',
      },
    ],
    lies: [
      'traite-de-versailles',
      'franklin-roosevelt',
      'adolf-hitler',
      'front-populaire',
      'debut-de-la-seconde-guerre-mondiale',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Démocraties fragilisées et expériences totalitaires dans l’Europe de l’entre-deux-guerres',
    tags: [
      'krach',
      '1929',
      'Wall Street',
      'jeudi noir',
      'chômage',
      'New Deal',
      'Roosevelt',
      'spéculation',
      'dépression',
      'Hooverville',
    ],
  },
]
