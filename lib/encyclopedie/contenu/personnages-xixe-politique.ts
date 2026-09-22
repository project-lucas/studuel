// -----------------------------------------------------------------------------
// XIXᵉ SIÈCLE — la politique française : rois, empereur et fondateurs de la
// République.
//
// LE FIL DU LOT : entre 1814 et 1870, la France change SEPT FOIS de régime —
// première Restauration, Cent-Jours, seconde Restauration, monarchie de
// Juillet, IIᵉ République, Second Empire, IIIᵉ République. Aucun autre pays
// d'Europe n'a connu pareil manège en deux générations. Chaque fiche dit donc
// clairement à quel régime elle appartient, et ce que ce régime a tenté.
//
// LE TON : les rois de la Restauration sont traités comme les autres rois de
// France (cf. docs/encyclopedie.md, § 3) — on écrit ce qu'ils ont voulu bâtir,
// leurs échecs sont dits dans leur temps, sans ironie ni procès rétrospectif.
// Sur la colonisation et l'esclavage, la règle est l'inverse et tout aussi
// ferme : factuel, daté, chiffré, sobre — la précision fait plus d'effet que
// l'indignation.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_XIXE_POLITIQUE: Personnage[] = [
  {
    id: 'louis-xviii',
    volet: 'personnages',
    nom: 'Louis XVIII',
    surnom: 'le roi de la Charte',
    dates: '1755 – 1824',
    tri: 1824,
    periode: 'xixe',
    emoji: '📜',
    roles: ['Roi de France', 'Frère de Louis XVI', 'Roi constitutionnel'],
    origine: 'Versailles, royaume de France',
    accroche:
      'Rentré d’exil après vingt-trois ans, il donne à la France une Charte et tente de réconcilier deux pays qui se haïssent.',
    citations: [
      {
        texte:
          'Les Français sont égaux devant la loi, quels que soient d’ailleurs leurs titres et leurs rangs.',
        qui: 'La Charte constitutionnelle, article 1ᵉʳ',
        contexte: 'Premier article de la Charte octroyée par Louis XVIII, le 4 juin 1814.',
        sens:
          'Le roi rentré d’exil ne rétablit pas la société d’ordres : l’égalité devant la loi conquise en 1789 est maintenue, et avec elle le Code civil.',
      },
      {
        texte: 'Je ne sacrifierai jamais mon honneur.',
        contexte:
          'Réponse écrite à Bonaparte, qui lui faisait offrir en 1803 une rente considérable contre une renonciation au trône.',
      },
      {
        texte: 'L’exactitude est la politesse des rois.',
        contexte: 'Mot prêté à Louis XVIII, réputé d’une ponctualité absolue.',
        incertaine: true,
      },
      {
        texte: 'Charles, ménagez la couronne de saint Louis.',
        contexte:
          'Dernières paroles rapportées, au comte d’Artois, son frère et successeur, en septembre 1824.',
        sens:
          'Il craint que la politique des ultras n’emporte la monarchie qu’il a réussi à replanter. Six ans plus tard, elle tombe.',
        incertaine: true,
      },
    ],
    reperes: [
      'Frère cadet de Louis XVI, il passe vingt-trois ans en exil avant de régner.',
      'Roi en 1814, après la chute de Napoléon et le congrès de Vienne : c’est la Restauration.',
      'Il octroie la Charte du 4 juin 1814 : une monarchie qui accepte une constitution.',
      'Les Cent-Jours le chassent en mars 1815 ; Waterloo le ramène en juillet.',
      'Il gouverne au centre, entre les ultras qui veulent l’Ancien Régime et les libéraux.',
      'Mort en 1824 : le dernier roi de France à mourir sur le trône.',
    ],
    recit: [
      {
        titre: 'Vingt-trois ans hors de France',
        texte:
          'Louis Stanislas Xavier, **comte de Provence**, naît à Versailles en 1755 : il est le frère cadet de Louis XVI. Il quitte la France dans la nuit du 20 juin 1791 — la nuit même où le roi est arrêté à Varennes — et réussit, lui, à passer. Commence un exil de **vingt-trois ans** : Coblence, Vérone, la Courlande, Varsovie, enfin l’Angleterre, où il s’installe au manoir de Hartwell. À la mort du petit **Louis XVII** dans la prison du Temple, en 1795, il se proclame roi sous le nom de Louis XVIII et ne cédera plus rien sur ce point. En 1803, Bonaparte lui fait proposer une rente considérable contre une renonciation écrite au trône : il refuse par lettre. Onze ans plus tard, l’Empire s’effondre, et le vieil homme goutteux que plus personne n’attendait rentre à Paris.',
      },
      {
        titre: 'La Charte du 4 juin 1814',
        texte:
          'Il aurait pu revenir en roi absolu : les vainqueurs de Napoléon comme les **ultras** de son entourage l’y poussaient. Il choisit l’inverse. Le **4 juin 1814**, il « octroie » une **Charte constitutionnelle** — donnée de sa main et non votée, pour sauver le principe que le roi tient son pouvoir de Dieu, mais qui verrouille l’essentiel : **égalité devant la loi**, liberté des cultes, liberté de la presse, maintien du **Code civil**, et surtout garantie donnée aux acheteurs de **biens nationaux** qu’on ne leur reprendra pas les terres achetées pendant la Révolution. Deux chambres votent la loi et l’impôt : la **Chambre des pairs**, nommée par le roi, et la **Chambre des députés**, élue par un suffrage censitaire étroit — environ 90 000 électeurs, les hommes de plus de trente ans payant 300 francs d’impôt. La France devient une **monarchie constitutionnelle**. Le compromis est calculé : la Révolution ne sera pas effacée, la monarchie ne sera pas non plus rendue au bon plaisir.',
      },
      {
        titre: 'Les Cent-Jours, et le retour de Gand',
        texte:
          'Le 1ᵉʳ mars 1815, Napoléon débarque à Golfe-Juan. En trois semaines il remonte jusqu’à Paris sans tirer un coup de feu : l’armée, qu’on avait humiliée, passe à lui. Louis XVIII quitte les Tuileries dans la nuit du 19 mars et gagne **Gand**. Ce sont les **Cent-Jours**. **Waterloo**, le 18 juin, rend la partie aux Bourbons : le roi rentre le 8 juillet, dans les fourgons des armées étrangères — le reproche lui sera fait toute sa vie. La France verse 700 millions d’indemnité et reste occupée trois ans. Pire, la **Terreur blanche** ensanglante le Midi, où des royalistes exaltés massacrent bonapartistes et protestants, et la « **Chambre introuvable** » élue en août 1815, plus royaliste que le roi, réclame des têtes. Louis XVIII la dissout en septembre 1816. Un roi qui dissout une chambre trop royaliste : il n’y a pas de meilleur résumé de son règne.',
      },
      {
        titre: 'Tenir la corde entre ultras et libéraux',
        texte:
          'Huit ans durant, il gouverne au centre avec des ministres modérés — **Richelieu**, puis **Decazes** — contre les deux bords à la fois. Les ultras, conduits par son propre frère le comte d’Artois, veulent rendre aux nobles leurs terres et à l’Église son autorité sur les esprits ; les libéraux veulent élargir le vote et la presse. Tout bascule le **13 février 1820** : le **duc de Berry**, neveu du roi et seul espoir de descendance pour la branche aînée, est poignardé à la sortie de l’Opéra. Les ultras accusent la politique libérale d’avoir armé le bras de l’assassin. Decazes tombe, la censure revient, la loi électorale dite du « double vote » donne deux voix aux plus riches. Vieilli, perclus de goutte, porté en fauteuil, Louis XVIII laisse faire. Il meurt aux Tuileries le **16 septembre 1824**, dernier roi de France à mourir sur le trône, en recommandant à son frère de ménager la couronne. Charles X ne le suivra pas.',
      },
    ],
    chrono: [
      { date: '1755', fait: 'Naissance à Versailles, comte de Provence.' },
      { date: 'juin 1791', fait: 'Il fuit la France la nuit même de Varennes.' },
      { date: '1795', fait: 'Mort de Louis XVII : il se proclame roi sous le nom de Louis XVIII.' },
      { date: '6 avril 1814', fait: 'Napoléon abdique ; le Sénat rappelle les Bourbons.' },
      { date: '4 juin 1814', fait: 'Il octroie la Charte constitutionnelle.' },
      { date: 'mars 1815', fait: 'Les Cent-Jours : il quitte Paris pour Gand.' },
      { date: '8 juillet 1815', fait: 'Retour à Paris après Waterloo.' },
      { date: '1815-1816', fait: 'La « Chambre introuvable » et la Terreur blanche.' },
      { date: '13 février 1820', fait: 'Assassinat du duc de Berry : les ultras l’emportent.' },
      { date: '16 septembre 1824', fait: 'Mort aux Tuileries, sur le trône.' },
    ],
    leSaisTu:
      'La Charte est datée « de notre règne le dix-neuvième ». Louis XVIII comptait son règne depuis 1795, année de la mort du petit Louis XVII au Temple : d’un trait de plume, la République et l’Empire n’avaient jamais eu lieu. Les articles du texte, eux, gardaient soigneusement leurs acquis.',
    aRetenir: [
      'Louis XVIII, frère de Louis XVI, règne de 1814 à 1824 : c’est la Restauration.',
      'Il octroie la Charte constitutionnelle le 4 juin 1814 : la France devient une monarchie constitutionnelle, avec deux chambres.',
      'La Charte maintient l’égalité devant la loi, le Code civil et la vente des biens nationaux.',
      'Les Cent-Jours, de mars à juin 1815, l’écartent du trône ; il revient après Waterloo.',
      'L’assassinat du duc de Berry en 1820 fait basculer le régime du côté des ultras.',
    ],
    mots: [
      {
        mot: 'Charte',
        sens: 'Constitution « octroyée » par le roi : donnée de sa main, et non votée par une assemblée.',
      },
      {
        mot: 'Restauration',
        sens: 'Le retour des Bourbons sur le trône de France, de 1814 à 1830.',
      },
      {
        mot: 'Ultras',
        sens: 'Royalistes les plus extrêmes, qui veulent effacer la Révolution ; on les disait « plus royalistes que le roi ».',
      },
    ],
    lies: ['napoleon-bonaparte', 'charles-x', 'congres-de-vienne', 'louis-xvi'],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'Restauration',
      'Charte de 1814',
      'Bourbons',
      'Cent-Jours',
      'ultras',
      'Gand',
      'comte de Provence',
      'monarchie constitutionnelle',
      'duc de Berry',
    ],
  },
  {
    id: 'charles-x',
    volet: 'personnages',
    nom: 'Charles X',
    surnom: 'le dernier roi sacré à Reims',
    dates: '1757 – 1836',
    tri: 1836,
    periode: 'xixe',
    emoji: '⚜️',
    roles: ['Roi de France', 'Comte d’Artois', 'Chef des ultras'],
    origine: 'Versailles, royaume de France',
    accroche:
      'Dernier roi sacré à Reims, il veut rendre à la monarchie la force qu’elle avait avant 1789 — et perd son trône en trois journées de juillet.',
    citations: [
      {
        texte: 'Il n’y a que moi et La Fayette qui n’ayons pas changé depuis 1789.',
        contexte: 'Mot de Charles X sur lui-même, sous la Restauration.',
        sens:
          'Il le dit comme un titre de fidélité. C’est aussi le diagnostic de son règne : le pays, lui, avait changé du tout au tout.',
      },
      {
        texte: 'Rien n’est changé en France ; il n’y a qu’un Français de plus.',
        contexte:
          'Proclamation lue à son entrée dans Paris, le 12 avril 1814. La phrase est de son conseiller Beugnot, qui l’a écrite pour lui.',
        incertaine: true,
      },
      {
        texte: 'J’aimerais mieux scier du bois que de régner à la façon du roi d’Angleterre.',
        contexte:
          'Mot rapporté vers 1829, sur le modèle anglais d’un roi qui règne mais ne gouverne pas.',
        sens: 'Pour lui, un roi qui obéit à une majorité de députés n’est plus un roi.',
      },
      {
        texte: 'La liberté de la presse périodique est suspendue.',
        qui: 'Première des ordonnances de Saint-Cloud',
        contexte: 'Ordonnance signée par Charles X le 25 juillet 1830 ; Paris se soulève deux jours après.',
      },
    ],
    reperes: [
      'Petit-fils de Louis XV, frère de Louis XVI et de Louis XVIII, émigré dès juillet 1789.',
      'Chef reconnu des ultras sous la Restauration, avant de monter sur le trône en 1824.',
      'Sacré à Reims le 29 mai 1825 : le dernier sacre d’un roi de France.',
      'Loi du « milliard des émigrés » en 1825, pour indemniser les nobles dépossédés.',
      'Prise d’Alger le 5 juillet 1830 : le début de la conquête de l’Algérie.',
      'Les ordonnances du 25 juillet 1830 déclenchent les Trois Glorieuses et sa chute.',
    ],
    recit: [
      {
        titre: 'Le frère cadet, trente-cinq ans d’exil',
        texte:
          'Charles-Philippe, **comte d’Artois**, naît à Versailles en 1757. Petit-fils de Louis XV, frère de Louis XVI et de Louis XVIII, il est le premier prince du sang à quitter le royaume : il part le **16 juillet 1789**, deux jours après la prise de la Bastille, sur l’ordre de son frère le roi. Il devient l’âme de l’**émigration** — Turin, Coblence, l’Écosse, Londres —, tente en 1795 un débarquement manqué sur l’île d’Yeu pour soutenir les Vendéens, et attend. Trente-cinq ans. Quand il rentre à Paris en avril 1814, il a cinquante-six ans et n’a rien vu de ce que la France est devenue : ni la Révolution, ni l’Empire, ni le pays des préfets, des routes et du Code civil. Sous le règne de son frère, il est le chef reconnu des **ultras**, ces royalistes qui tiennent la Charte pour une capitulation.',
      },
      {
        titre: 'Le sacre de Reims, 1825',
        texte:
          'Roi à soixante-six ans, en septembre 1824, il veut aussitôt replacer la monarchie sur son socle : le **sacre**. Le **29 mai 1825**, dans la cathédrale de **Reims** restaurée pour l’occasion, il est oint de la **sainte ampoule** selon un rite vieux de treize siècles, devant les pairs, les évêques et le jeune Victor Hugo, qui compose une ode pour la circonstance. Personne ne s’y trompe : en se faisant sacrer quand son frère y avait renoncé, Charles X affirme que le roi tient son pouvoir de Dieu et non de la Charte. La même année, deux lois disent la même chose : le « **milliard des émigrés** », qui indemnise les nobles dépossédés en 1789, et la loi sur le **sacrilège**. Le pays ne se révolte pas — mais une partie de la France se détourne, et la caricature, désormais libre, s’empare du roi.',
      },
      {
        titre: 'Un roi qui veut gouverner lui-même',
        texte:
          'La Charte lui donne le choix de ses ministres ; elle ne dit pas qu’il doit les prendre dans la majorité. Charles X s’appuie sur cette faille. Après trois ans d’un ministère modéré, il appelle en août 1829 le prince de **Polignac**, ultra entre les ultras, qui avait refusé en 1815 de prêter serment à la Charte. La Chambre proteste : le **18 mars 1830**, deux cent vingt et un députés votent une **adresse au roi** pour lui dire que son gouvernement n’a pas la confiance du pays. Il dissout. Les électeurs renvoient une opposition plus forte encore, deux cent soixante-quatorze sièges. Au même moment, le corps expéditionnaire envoyé contre le dey d’Alger prend la ville, le **5 juillet 1830** : la France entame la conquête de l’**Algérie**, et le roi croit tenir la victoire qui le sauvera. Elle n’a aucun effet à Paris.',
      },
      {
        titre: 'Les ordonnances et les Trois Glorieuses',
        texte:
          'Le **25 juillet 1830**, au château de Saint-Cloud, il signe quatre **ordonnances** : la presse est suspendue, la Chambre à peine élue est dissoute, le corps électoral est réduit des trois quarts, de nouvelles élections sont convoquées. Il invoque l’article 14 de la Charte, qui autorise le roi à prendre les mesures nécessaires à la sûreté de l’État. Le lendemain, les journalistes conduits par **Thiers** publient une protestation ; les imprimeries fermées jettent leurs ouvriers dans la rue. Le 27, Paris se couvre de **barricades** ; le 28, les insurgés prennent l’Hôtel de Ville ; le 29, le Louvre et les Tuileries. Ce sont les **Trois Glorieuses** : environ huit cents morts. Le roi, réfugié à Rambouillet, retire ses ordonnances trop tard et **abdique le 2 août** en faveur de son petit-fils. Les députés ne le suivent pas : ils appellent au trône son cousin **Louis-Philippe d’Orléans**. Charles X reprend le chemin de l’exil, qu’il connaît, et meurt du choléra à Goritz en 1836.',
      },
    ],
    chrono: [
      { date: '1757', fait: 'Naissance à Versailles, comte d’Artois.' },
      { date: '16 juillet 1789', fait: 'Premier émigré du royaume, deux jours après la Bastille.' },
      { date: '1814', fait: 'Il entre dans Paris au nom de son frère Louis XVIII.' },
      { date: '16 septembre 1824', fait: 'Il devient roi à soixante-six ans.' },
      { date: '27 avril 1825', fait: 'Loi d’indemnisation des émigrés, dite « le milliard ».' },
      { date: '29 mai 1825', fait: 'Sacre à Reims, le dernier de l’histoire de France.' },
      { date: 'août 1829', fait: 'Il appelle l’ultra Polignac au gouvernement.' },
      { date: '5 juillet 1830', fait: 'Prise d’Alger : début de la conquête de l’Algérie.' },
      { date: '25 juillet 1830', fait: 'Ordonnances de Saint-Cloud : presse suspendue, Chambre dissoute.' },
      { date: '27-29 juillet 1830', fait: 'Les Trois Glorieuses ; Paris se couvre de barricades.' },
      { date: '2 août 1830', fait: 'Abdication à Rambouillet, puis départ pour l’Angleterre.' },
      { date: '1836', fait: 'Mort du choléra à Goritz, en Autriche.' },
    ],
    leSaisTu:
      'Au lendemain de son sacre, Charles X s’est rendu à l’hôpital Saint-Marcoul de Reims pour « toucher les écrouelles » : selon un rite vieux de huit siècles, le roi de France posait la main sur les malades en disant « Le roi te touche, Dieu te guérisse ». Il en toucha cent vingt et un. Ce fut la dernière fois.',
    aRetenir: [
      'Charles X, frère de Louis XVI et de Louis XVIII, règne de 1824 à 1830.',
      'Il est sacré à Reims le 29 mai 1825 : c’est le dernier sacre d’un roi de France.',
      'La loi de 1825 dite du « milliard des émigrés » indemnise les nobles dépossédés par la Révolution.',
      'Les ordonnances du 25 juillet 1830 suspendent la presse et dissolvent la Chambre.',
      'Les Trois Glorieuses, les 27, 28 et 29 juillet 1830, le renversent : c’est la fin de la Restauration.',
    ],
    mots: [
      {
        mot: 'Ordonnance',
        sens: 'Décision prise par le roi seul, sans vote des chambres.',
      },
      {
        mot: 'Trois Glorieuses',
        sens: 'Les trois journées d’insurrection parisienne des 27, 28 et 29 juillet 1830.',
      },
      {
        mot: 'Sacre',
        sens: 'Cérémonie de Reims où le roi est oint d’huile sainte, signe qu’il tient son pouvoir de Dieu.',
      },
    ],
    lies: ['louis-xviii', 'louis-philippe', 'revolution-de-1830', 'la-fayette'],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'Restauration',
      'comte d’Artois',
      'sacre de Reims',
      'ordonnances',
      'Trois Glorieuses',
      '1830',
      'ultras',
      'Alger',
      'Saint-Cloud',
      'Polignac',
    ],
  },
  {
    id: 'louis-philippe',
    volet: 'personnages',
    nom: 'Louis-Philippe Iᵉʳ',
    surnom: 'le roi-citoyen',
    dates: '1773 – 1850',
    tri: 1850,
    periode: 'xixe',
    emoji: '☂️',
    roles: ['Roi des Français', 'Duc d’Orléans', 'Soldat de Valmy'],
    origine: 'Paris, royaume de France',
    accroche:
      'Soldat de Valmy devenu « roi des Français », il règne dix-huit ans sur un pays où 240 000 hommes seulement ont le droit de voter.',
    citations: [
      {
        texte: 'Enrichissez-vous par le travail et par l’épargne.',
        qui: 'François Guizot, chef du gouvernement de Louis-Philippe',
        contexte:
          'À la Chambre des députés, le 1ᵉʳ mars 1843, à ceux qui réclamaient le droit de vote. Ce n’est pas le roi qui l’a dite, mais son ministre.',
        sens:
          'La réponse du régime à qui demande le suffrage universel : payez 200 francs d’impôt, et vous voterez. Personne ne songe à baisser le seuil.',
      },
      {
        texte:
          'Nous chercherons à nous tenir dans un juste milieu, également éloigné des excès du pouvoir populaire et des abus du pouvoir royal.',
        contexte: 'Discours de Louis-Philippe à Gaillon, le 31 janvier 1831.',
        sens:
          'Le programme du règne tient dans ces deux mots, « juste milieu » : ni la République, ni Charles X.',
      },
      {
        texte: 'La France s’ennuie.',
        qui: 'Alphonse de Lamartine, poète et député',
        contexte: 'À la Chambre, en janvier 1839, sur un régime qui ne propose plus rien au pays.',
      },
    ],
    reperes: [
      'Fils de Philippe Égalité, qui vota la mort de Louis XVI en 1793.',
      'Il se bat à Valmy et à Jemmapes en 1792, puis émigre pendant vingt et un ans.',
      'Porté au trône par les Trois Glorieuses, il devient « roi des Français » le 9 août 1830.',
      'Suffrage censitaire : environ 240 000 électeurs pour 35 millions de Français.',
      'Son chef de gouvernement Guizot refuse toute réforme électorale jusqu’au bout.',
      'Renversé par la révolution de février 1848, il meurt en exil en Angleterre.',
    ],
    recit: [
      {
        titre: 'Valmy, l’exil, le professeur de mathématiques',
        texte:
          'Louis-Philippe d’Orléans naît à Paris en 1773, fils du duc d’Orléans qui se fera appeler **Philippe Égalité** et votera la mort de Louis XVI. À dix-neuf ans, il commande une division à **Valmy** puis à **Jemmapes** : il s’est battu pour la République. Quand son général **Dumouriez** passe à l’ennemi en avril 1793, il doit fuir avec lui ; son père est guillotiné en novembre. Suivent vingt et un ans d’exil et de gêne — la Suisse, la Scandinavie, les États-Unis, la Sicile, l’Angleterre. En 1809, il épouse **Marie-Amélie de Bourbon**, fille du roi de Naples, dont il aura dix enfants. Rentré en 1814, il tient sous la Restauration un rôle étrange : prince du sang, très riche, entouré de libéraux, et suspect à la cour de son cousin Charles X.',
      },
      {
        titre: 'Le roi des barricades',
        texte:
          'Fin juillet 1830, Charles X est tombé et personne ne sait qui gouverne. Les républicains veulent la République ; les députés libéraux veulent un roi qui ne recommence pas. Ils font appeler Louis-Philippe. Le **31 juillet**, il se rend à l’Hôtel de Ville, se montre au balcon enveloppé dans le **drapeau tricolore** et se laisse embrasser par **La Fayette** devant la foule : la scène vaut couronnement. Le **9 août 1830**, il prête serment à une Charte **révisée**, et non plus octroyée — la nuance est tout le régime. Il prend le titre de « **roi des Français** » et non de « roi de France » : il règne sur un peuple, pas sur un territoire hérité. Le drapeau tricolore remplace le drapeau blanc, la censure est interdite, le catholicisme cesse d’être « religion de l’État » pour devenir « religion de la majorité des Français ». C’est la **monarchie de Juillet**.',
      },
      {
        titre: 'Le règne des 240 000',
        texte:
          'Le régime abaisse le **cens** — l’impôt qu’il faut payer pour voter — de 300 à 200 francs, et l’âge de trente à vingt-cinq ans. Le corps électoral double… et atteint environ **240 000 électeurs** en 1846, pour **35 millions de Français** : un homme sur cent quarante. Ces électeurs sont des propriétaires, des notaires, des négociants, des maîtres de forges, et le régime leur ressemble. C’est le temps des banquiers, des premières grandes usines, du chemin de fer organisé par la **loi de 1842**, des grands magasins et des fortunes rapides. Aux ouvriers, qui n’ont ni vote ni syndicat, il ne répond pas : les **canuts** de Lyon se soulèvent en 1831 puis en 1834 sous le mot d’ordre « Vivre en travaillant ou mourir en combattant », et sont écrasés. À qui réclame le droit de vote, **Guizot**, chef du gouvernement depuis 1840, oppose une phrase restée célèbre : « Enrichissez-vous par le travail et par l’épargne. »',
      },
      {
        titre: 'Trois journées de février 1848',
        texte:
          'Puisque les réunions politiques sont interdites, l’opposition organise à partir de 1847 une **campagne de banquets** : on paie son couvert, on porte des toasts à la réforme électorale. Soixante-dix banquets, partout en France. Le gouvernement interdit celui du **22 février 1848** à Paris. La foule sort quand même. Le 23 au soir, boulevard des Capucines, la troupe tire : une cinquantaine de morts, dont les corps sont promenés dans la ville sur une charrette à la lueur des torches. En une nuit, Paris se hérisse de barricades. Le **24 février**, Louis-Philippe renvoie Guizot, puis **abdique** en faveur de son petit-fils et quitte les Tuileries en fiacre ; il gagne l’Angleterre sous le nom de « Mr Smith ». Le jour même, la **IIᵉ République** est proclamée à l’Hôtel de Ville, et le **suffrage universel masculin**, établi le 5 mars, fait passer le corps électoral de 240 000 à plus de neuf millions d’hommes. Louis-Philippe meurt à Claremont en 1850. Aucun roi n’a régné sur la France depuis.',
      },
    ],
    chrono: [
      { date: '1773', fait: 'Naissance à Paris, duc de Chartres.' },
      { date: '1792', fait: 'Il combat à Valmy puis à Jemmapes.' },
      { date: '1793', fait: 'Il émigre ; son père Philippe Égalité est guillotiné.' },
      { date: '9 août 1830', fait: 'Il devient « roi des Français ».' },
      { date: '1831 et 1834', fait: 'Révoltes des canuts de Lyon, écrasées.' },
      { date: '1835', fait: 'Attentat de Fieschi, suivi des lois de censure de septembre.' },
      { date: '1840', fait: 'Retour des cendres de Napoléon aux Invalides.' },
      { date: '11 juin 1842', fait: 'Loi sur les chemins de fer : l’État trace le réseau.' },
      { date: '22-24 février 1848', fait: 'Révolution de février : il abdique et s’enfuit.' },
      { date: '1850', fait: 'Mort à Claremont, en Angleterre.' },
    ],
    leSaisTu:
      'En 1793, ruiné et traqué, le futur roi enseigna huit mois les mathématiques et la géographie dans un pensionnat de Reichenau, en Suisse, sous le nom de « Monsieur Chabos ». Ses élèves ignoraient qu’ils avaient devant eux un prince du sang — et le professeur, qu’il régnerait un jour sur la France.',
    aRetenir: [
      'Louis-Philippe règne de 1830 à 1848 : c’est la monarchie de Juillet.',
      'Il porte le titre de « roi des Français » et non de « roi de France », et rétablit le drapeau tricolore.',
      'Le suffrage est censitaire : environ 240 000 électeurs seulement, sur 35 millions de Français.',
      '« Enrichissez-vous par le travail et par l’épargne » est de Guizot, son chef de gouvernement, en 1843.',
      'La révolution de février 1848 le renverse et proclame la IIᵉ République, au suffrage universel masculin.',
    ],
    mots: [
      {
        mot: 'Suffrage censitaire',
        sens: 'Droit de vote réservé à ceux qui paient un impôt — le cens — assez élevé : 200 francs sous Louis-Philippe.',
      },
      {
        mot: 'Monarchie de Juillet',
        sens: 'Le régime né des Trois Glorieuses de juillet 1830 et mort en février 1848.',
      },
      {
        mot: 'Banquet',
        sens: 'Repas politique payant : les réunions publiques étant interdites, l’opposition se réunissait à table.',
      },
    ],
    lies: ['charles-x', 'revolution-de-1830', 'revolution-de-1848', 'napoleon-iii', 'victor-hugo'],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'monarchie de Juillet',
      'roi des Français',
      'Guizot',
      'suffrage censitaire',
      'Trois Glorieuses',
      '1848',
      'Orléans',
      'banquets',
      'drapeau tricolore',
      'canuts',
    ],
  },
  {
    id: 'napoleon-iii',
    volet: 'personnages',
    nom: 'Napoléon III',
    surnom: 'l’empereur des chemins de fer',
    dates: '1808 – 1873',
    tri: 1873,
    periode: 'xixe',
    emoji: '🚂',
    roles: ['Président de la République', 'Empereur des Français', 'Neveu de Napoléon Iᵉʳ'],
    origine: 'Paris, Empire français',
    accroche:
      'Premier président élu de France, puis empereur pendant dix-huit ans : il couvre le pays de rails et d’usines, et le perd à Sedan.',
    citations: [
      {
        texte: 'L’Empire, c’est la paix.',
        contexte:
          'Discours de Bordeaux, le 9 octobre 1852, un mois avant le rétablissement de l’Empire.',
        sens:
          'Il rassure une Europe qui se souvient de son oncle. En dix-huit ans, il fera pourtant la guerre en Crimée, en Italie, au Mexique, puis contre la Prusse.',
      },
      {
        texte:
          'Aujourd’hui le règne des castes est fini, on ne peut gouverner qu’avec les masses ; il faut donc les organiser afin qu’elles puissent formuler leur volonté.',
        contexte: '*L’Extinction du paupérisme*, écrit en 1844 dans sa prison du fort de Ham.',
        sens:
          'Son idée fixe : le chef doit tenir sa force du peuple entier, consulté par plébiscite, et non d’une chambre de notables.',
      },
      {
        texte:
          'N’ayant pas pu mourir au milieu de mes troupes, il ne me reste qu’à remettre mon épée entre les mains de Votre Majesté.',
        contexte:
          'Billet au roi de Prusse Guillaume Iᵉʳ, au soir de la défaite de Sedan, le 1ᵉʳ septembre 1870.',
      },
    ],
    reperes: [
      'Neveu de Napoléon Iᵉʳ, il tente deux coups de force ratés en 1836 et 1840, et passe six ans en prison.',
      'Élu président de la République le 10 décembre 1848 avec 74 % des voix.',
      'Coup d’État du 2 décembre 1851, puis Empire proclamé le 2 décembre 1852.',
      'Le réseau ferré passe d’environ 3 000 à près de 20 000 kilomètres sous son règne.',
      'Haussmann perce Paris de boulevards, d’égouts et de parcs de 1853 à 1870.',
      'La défaite de Sedan, le 2 septembre 1870, emporte l’Empire en deux jours.',
    ],
    recit: [
      {
        titre: 'Le neveu, la prison, l’élection',
        texte:
          '**Charles Louis Napoléon Bonaparte** naît à Paris en 1808 : son père est un frère de Napoléon Iᵉʳ, sa mère **Hortense de Beauharnais** est la fille de Joséphine. Exilé enfant après Waterloo, il se persuade que le nom qu’il porte est un programme. Il tente deux coups de force manqués — **Strasbourg** en 1836, **Boulogne** en 1840 —, est condamné à la prison perpétuelle et enfermé six ans au **fort de Ham**, où il lit, écrit et publie *L’Extinction du paupérisme*, un texte sur la misère ouvrière qui lui vaudra plus tard des voix à gauche. Évadé en 1846, réfugié à Londres, il rentre à la révolution de 1848. Le **10 décembre 1848**, au premier scrutin présidentiel de l’histoire de France et au **suffrage universel masculin**, il est élu avec **5,5 millions de voix sur 7,4** — 74 % — contre le général Cavaignac. Les campagnes ont voté pour un nom.',
      },
      {
        titre: 'Le 2 décembre',
        texte:
          'La Constitution de 1848 interdit au président de se représenter, et son mandat s’achève en 1852. L’Assemblée, majoritairement monarchiste, refuse de la réviser ; elle a d’ailleurs, par la **loi du 31 mai 1850**, retiré le droit de vote à trois millions d’hommes. Le **2 décembre 1851** — anniversaire du sacre de Napoléon Iᵉʳ et d’Austerlitz —, Louis-Napoléon fait occuper l’Assemblée et arrêter les députés d’opposition. La résistance est réprimée : environ quatre cents morts à Paris, vingt-six mille arrestations en province, plus de dix mille déportations en Algérie. **Victor Hugo** part pour dix-neuf ans d’exil. Le **plébiscite** du 21 décembre approuve le coup d’État par 7,4 millions de oui ; celui du 21 novembre 1852 rétablit l’Empire. Le **2 décembre 1852**, un an jour pour jour après le coup d’État, il devient **Napoléon III, empereur des Français**.',
      },
      {
        titre: 'Le pays qu’il transforme',
        texte:
          'Dix-huit ans durant, la France change de visage. Le **réseau ferré** passe d’environ 3 000 à près de 20 000 kilomètres : pour la première fois, on peut aller de Lille à Marseille en une journée. Les grandes **banques de dépôt** naissent — Crédit foncier, Crédit lyonnais, Société générale —, et avec elles le crédit, le placement, la spéculation. Les **grands magasins** ouvrent, Le Bon Marché en tête. À Paris, le préfet **Haussmann** perce de 1853 à 1870 quelque 165 kilomètres de boulevards, pose des centaines de kilomètres d’égouts, dessine les parcs et amène l’eau : la ville y gagne l’air et la lumière, y perd des quartiers entiers et les pauvres qu’on repousse vers la périphérie. En **1860**, le traité de **libre-échange** avec l’Angleterre supprime presque tous les droits de douane et oblige l’industrie française à se moderniser dans la douleur. En **1864**, la **loi Ollivier** reconnaît le **droit de grève**, interdit depuis 1791. Deux **Expositions universelles**, en 1855 et 1867, montrent tout cela au monde.',
      },
      {
        titre: 'Sedan',
        texte:
          'L’Empire a beaucoup fait la guerre : **Crimée** (1854-1856), **Italie** (1859, d’où viennent Nice et la Savoie), **Mexique** (1862-1867, une expédition désastreuse qui s’achève par l’exécution de l’empereur Maximilien). Pendant ce temps, la **Prusse** de **Bismarck** écrase l’Autriche à Sadowa en 1866 et rassemble l’Allemagne autour d’elle. En juillet 1870, la dépêche d’Ems, habilement retouchée par Bismarck, précipite une France mal préparée dans la guerre. Six semaines suffisent. Le **1ᵉʳ septembre 1870**, l’armée de Châlons est encerclée à **Sedan** ; le lendemain, l’empereur, malade, capitule avec 83 000 hommes pour éviter un massacre. La nouvelle atteint Paris le 3 ; le **4 septembre**, la **République** y est proclamée. Prisonnier en Allemagne, puis exilé en Angleterre, Napoléon III meurt à Chislehurst le 9 janvier 1873, des suites d’une opération. Il avait soixante-quatre ans.',
      },
    ],
    chrono: [
      { date: '1808', fait: 'Naissance à Paris, neveu de Napoléon Iᵉʳ.' },
      { date: '1840', fait: 'Coup de Boulogne : prison à vie au fort de Ham.' },
      { date: '1846', fait: 'Évasion déguisé en ouvrier, puis exil à Londres.' },
      { date: '10 décembre 1848', fait: 'Élu président de la République avec 74 % des voix.' },
      { date: '2 décembre 1851', fait: 'Coup d’État contre l’Assemblée.' },
      { date: '2 décembre 1852', fait: 'Proclamation du Second Empire.' },
      { date: '1853', fait: 'Haussmann préfet de la Seine : Paris est percé.' },
      { date: '23 janvier 1860', fait: 'Traité de libre-échange avec l’Angleterre.' },
      { date: '25 mai 1864', fait: 'La loi Ollivier reconnaît le droit de grève.' },
      { date: '1ᵉʳ-2 septembre 1870', fait: 'Défaite et capture à Sedan.' },
      { date: '4 septembre 1870', fait: 'La République est proclamée à Paris.' },
      { date: '9 janvier 1873', fait: 'Mort en exil à Chislehurst, en Angleterre.' },
    ],
    leSaisTu:
      'Pour s’évader du fort de Ham en 1846, le futur empereur enfila la blouse, la perruque et les sabots d’un ouvrier nommé Badinguet, chargea une planche sur son épaule et sortit par la grande porte sous les yeux des gardes. Le surnom lui resta : ses adversaires l’appelèrent « Badinguet » pendant tout son règne.',
    aRetenir: [
      'Louis-Napoléon Bonaparte est élu président de la République le 10 décembre 1848, au suffrage universel masculin.',
      'Son coup d’État du 2 décembre 1851 est approuvé par plébiscite ; l’Empire est proclamé le 2 décembre 1852.',
      'Le Second Empire industrialise la France : le réseau ferré passe de 3 000 à près de 20 000 kilomètres.',
      'La loi Ollivier du 25 mai 1864 autorise la grève, interdite depuis 1791.',
      'La défaite de Sedan, le 2 septembre 1870, met fin à l’Empire ; la République est proclamée le 4 septembre.',
    ],
    mots: [
      {
        mot: 'Plébiscite',
        sens: 'Vote par oui ou par non sur une question posée par le pouvoir : on approuve un homme plus qu’un texte.',
      },
      {
        mot: 'Libre-échange',
        sens: 'Suppression des droits de douane entre deux pays, pour que les marchandises circulent librement.',
      },
      {
        mot: 'Haussmannisation',
        sens: 'La transformation de Paris par le préfet Haussmann : larges boulevards, immeubles alignés, égouts et parcs.',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'defaite-de-sedan',
      'adolphe-thiers',
      'revolution-industrielle',
      'otto-von-bismarck',
    ],
    niveaux: ['4e', '1re'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'Second Empire',
      'coup d’État',
      '2 décembre',
      'Haussmann',
      'chemins de fer',
      'Sedan',
      'plébiscite',
      'Badinguet',
      'libre-échange',
      'droit de grève',
    ],
  },
  {
    id: 'adolphe-thiers',
    volet: 'personnages',
    nom: 'Adolphe Thiers',
    surnom: 'le libérateur du territoire',
    dates: '1797 – 1877',
    tri: 1877,
    periode: 'xixe',
    emoji: '🏛️',
    roles: ['Président de la République', 'Historien', 'Journaliste', 'Président du Conseil'],
    origine: 'Marseille, France',
    accroche:
      'Il sert quatre régimes, écrase la Commune, puis rallie les monarchistes à la République : « le gouvernement qui nous divise le moins ».',
    citations: [
      {
        texte: 'La République sera conservatrice ou elle ne sera pas.',
        contexte:
          'Message à l’Assemblée nationale, le 13 novembre 1872, pour convaincre une chambre monarchiste.',
        sens:
          'Il propose un marché : acceptez la République, et elle ne touchera ni à la propriété, ni à l’ordre, ni à l’Église.',
      },
      {
        texte: 'Le roi règne et ne gouverne pas.',
        contexte:
          'Formule du journaliste Thiers dans *Le National*, en janvier 1830, six mois avant la chute de Charles X.',
        sens:
          'Le roi doit laisser gouverner des ministres responsables devant les chambres : c’est le programme des libéraux contre les ordonnances.',
      },
      {
        texte: 'Cette multitude vile qui a perdu toutes les républiques.',
        contexte:
          'À l’Assemblée, le 24 mai 1850, pour défendre la loi qui va rayer trois millions d’hommes des listes électorales.',
        sens:
          'Thiers est libéral, pas démocrate : il veut le gouvernement des propriétaires, pas celui du nombre.',
      },
    ],
    reperes: [
      'Journaliste et historien, il écrit une *Histoire de la Révolution française* en dix volumes.',
      'Ministre puis chef du gouvernement de Louis-Philippe, il fait fortifier Paris.',
      'Chef du pouvoir exécutif le 17 février 1871, après la défaite contre la Prusse.',
      'Il fait écraser la Commune de Paris pendant la Semaine sanglante, en mai 1871.',
      'Il paie l’indemnité de 5 milliards de francs deux ans avant l’échéance.',
      'Premier président de la IIIᵉ République, de 1871 à sa chute en mai 1873.',
    ],
    recit: [
      {
        titre: 'Quatre régimes, un seul homme',
        texte:
          'Né à **Marseille** en 1797 dans une famille sans fortune, Adolphe Thiers monte à Paris avec un métier d’avocat et une plume. Il publie une monumentale *Histoire de la Révolution française* en dix volumes (1823-1827) qui fait de lui une autorité, et fonde en janvier 1830 **Le National**, journal d’opposition à Charles X, où il forge la formule des libéraux : « Le roi règne et ne gouverne pas. » En juillet 1830, c’est lui qui rédige la protestation des journalistes contre les ordonnances, puis qui court à Neuilly convaincre Louis-Philippe d’accepter la couronne. Sous la **monarchie de Juillet**, il est ministre de l’Intérieur, deux fois président du Conseil, et fait entourer Paris d’une enceinte fortifiée qui portera son nom. En 1850, il défend la loi qui raie trois millions d’électeurs des listes, contre ce qu’il appelle « la vile multitude ». Arrêté et expulsé après le coup d’État de 1851, il revient siéger en 1863 comme chef de l’opposition libérale à l’Empire.',
      },
      {
        titre: '1871 : ramasser les morceaux',
        texte:
          'Après Sedan et quatre mois de siège, Paris capitule le 28 janvier 1871. Les élections du **8 février** envoient une Assemblée majoritairement monarchiste : les campagnes ont voté pour la paix. Le **17 février**, cette Assemblée nomme Thiers « **chef du pouvoir exécutif de la République française** » — à soixante-treize ans, il est le seul homme que tous les camps acceptent. Il négocie aux **préliminaires de paix** ce qu’il peut : la France perd l’**Alsace** et le nord de la **Lorraine**, verse **5 milliards de francs-or** d’indemnité et reste occupée jusqu’au paiement. L’Assemblée ratifie le 1ᵉʳ mars ; les députés d’Alsace-Lorraine quittent la salle après avoir protesté. Puis elle s’installe à **Versailles**, et non à Paris, qui a tenu le siège quatre mois et qui ne le pardonnera pas.',
      },
      {
        titre: 'La Commune et la Semaine sanglante',
        texte:
          'Le **18 mars 1871**, Thiers envoie l’armée récupérer les canons de la garde nationale parqués à **Montmartre**. L’opération échoue, les soldats fraternisent avec la foule, deux généraux sont fusillés. Thiers replie tout le gouvernement sur Versailles. Paris élit le 26 mars une municipalité insurrectionnelle, la **Commune de Paris**, qui gouverne la capitale deux mois et vote la séparation de l’Église et de l’État, l’école gratuite, la fin du travail de nuit des boulangers. Thiers, lui, reconstitue une armée avec les prisonniers de guerre que Bismarck lui rend. Elle entre dans Paris le 21 mai. Sept jours de combats de rue suivent — la **Semaine sanglante** — avec l’incendie des Tuileries et de l’Hôtel de Ville, l’exécution d’otages par les communards, et une répression sans mesure : **entre 10 000 et 20 000 morts** selon les historiens, 38 000 arrestations, près de 4 500 déportations en Nouvelle-Calédonie. Thiers assume entièrement : l’ordre, pour lui, est la condition de la République.',
      },
      {
        titre: 'Le régime qui divise le moins',
        texte:
          'L’Assemblée élue en février 1871 compte une majorité de monarchistes, mais divisés entre **légitimistes**, fidèles au comte de Chambord, et **orléanistes**, partisans du petit-fils de Louis-Philippe. Thiers, orléaniste de toute sa vie, fait le calcul : la restauration est impossible, d’autant que le comte de Chambord refuse en 1873 le drapeau tricolore. La **loi Rivet** d’août 1871 donne à Thiers le titre de **président de la République**. Le **13 novembre 1872**, il déclare devant les députés que la République « est le gouvernement qui nous divise le moins » et qu’elle « sera conservatrice ou ne sera pas ». C’en est trop pour la droite : le **24 mai 1873**, elle le renverse et le remplace par le maréchal de **Mac-Mahon**. Il aura tenu sa promesse : l’indemnité payée d’avance, le dernier soldat allemand quitte le sol français en septembre 1873. Quand il meurt, le 3 septembre 1877, un million de Parisiens suivent son cercueil, et l’enterrement devient une manifestation républicaine.',
      },
    ],
    chrono: [
      { date: '1797', fait: 'Naissance à Marseille.' },
      { date: '1823-1827', fait: 'Publication de son *Histoire de la Révolution française*.' },
      { date: 'janvier 1830', fait: 'Il fonde *Le National*, journal d’opposition à Charles X.' },
      { date: '1840', fait: 'Président du Conseil de Louis-Philippe.' },
      { date: '24 mai 1850', fait: 'Discours de « la vile multitude » : trois millions d’électeurs rayés.' },
      { date: '1851', fait: 'Arrêté et expulsé après le coup d’État de Louis-Napoléon.' },
      { date: '17 février 1871', fait: 'Chef du pouvoir exécutif de la République française.' },
      { date: '21-28 mai 1871', fait: 'Semaine sanglante : l’armée reprend Paris à la Commune.' },
      { date: 'août 1871', fait: 'La loi Rivet lui donne le titre de président de la République.' },
      { date: '13 novembre 1872', fait: '« La République sera conservatrice ou elle ne sera pas. »' },
      { date: '24 mai 1873', fait: 'Renversé par les monarchistes, il démissionne.' },
      { date: '3 septembre 1877', fait: 'Mort à Saint-Germain-en-Laye.' },
    ],
    leSaisTu:
      'Pour payer les 5 milliards de francs exigés par l’Allemagne, Thiers lança un emprunt national. Les Français y répondirent au-delà de tout : la souscription de juillet 1872 fut couverte près de quatorze fois. L’indemnité fut réglée avec deux ans d’avance et le dernier soldat allemand quitta le territoire en septembre 1873.',
    aRetenir: [
      'Adolphe Thiers dirige la France après la défaite de 1871 : chef du pouvoir exécutif, puis président de la République.',
      'Il signe la paix avec l’Allemagne : perte de l’Alsace et d’une partie de la Lorraine, 5 milliards de francs d’indemnité.',
      'Il fait écraser la Commune de Paris pendant la Semaine sanglante, du 21 au 28 mai 1871.',
      'Il se rallie à la République en 1872 : c’est « le gouvernement qui nous divise le moins ».',
      'Renversé par les monarchistes le 24 mai 1873, il est remplacé par le maréchal de Mac-Mahon.',
    ],
    mots: [
      {
        mot: 'Semaine sanglante',
        sens: 'La reprise de Paris par l’armée de Versailles, du 21 au 28 mai 1871 : plus de dix mille morts.',
      },
      {
        mot: 'Indemnité de guerre',
        sens: 'Somme que le vaincu doit verser au vainqueur ; ici 5 milliards de francs-or, payés en deux ans.',
      },
      {
        mot: 'Orléaniste',
        sens: 'Partisan de la branche d’Orléans, celle de Louis-Philippe : une monarchie parlementaire et libérale.',
      },
    ],
    lies: [
      'commune-de-paris',
      'defaite-de-sedan',
      'leon-gambetta',
      'louis-philippe',
      'napoleon-iii',
    ],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'IIIᵉ République',
      'Commune',
      'Semaine sanglante',
      'Versailles',
      '1871',
      'Mac-Mahon',
      'Le National',
      'libérateur du territoire',
      'orléaniste',
    ],
  },
  {
    id: 'leon-gambetta',
    volet: 'personnages',
    nom: 'Léon Gambetta',
    surnom: 'le commis voyageur de la République',
    dates: '1838 – 1882',
    tri: 1882,
    periode: 'xixe',
    emoji: '🎈',
    roles: ['Avocat', 'Ministre de la Défense nationale', 'Président du Conseil'],
    origine: 'Cahors, France',
    accroche:
      'Il proclame la République le 4 septembre 1870, quitte Paris assiégé en ballon et lève des armées entières pour continuer la guerre.',
    citations: [
      {
        texte:
          'Louis-Napoléon Bonaparte et sa dynastie ont à jamais cessé de régner sur la France.',
        contexte:
          'À la tribune du Palais-Bourbon envahi par la foule, le 4 septembre 1870, deux jours après Sedan.',
        sens:
          'La déchéance prononcée, il entraîne la foule à l’Hôtel de Ville : la IIIᵉ République y est proclamée dans la journée.',
      },
      {
        texte: 'Il faut se soumettre ou se démettre.',
        contexte:
          'Discours de Lille, le 15 août 1877, au président Mac-Mahon pendant la crise du 16 mai.',
        sens:
          'Ou le président accepte la majorité sortie des urnes, ou il s’en va. Mac-Mahon fera les deux, à quinze mois d’intervalle.',
      },
      {
        texte: 'Le cléricalisme, voilà l’ennemi !',
        contexte:
          'À la Chambre des députés, le 4 mai 1877 ; Gambetta reprend une formule du journaliste Alphonse Peyrat.',
        sens:
          'Il ne vise pas la foi des Français, mais l’emprise de l’Église sur l’État et sur l’école — le combat qui mènera à la loi de 1905.',
      },
      {
        texte: 'Y penser toujours, n’en parler jamais.',
        contexte:
          'Mot prêté à Gambetta sur l’Alsace-Lorraine annexée par l’Allemagne en 1871 ; l’attribution est discutée.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un épicier d’origine génoise, il est avocat à Paris à vingt et un ans.',
      'Il proclame la déchéance de l’Empire et la République, le 4 septembre 1870.',
      'Le 7 octobre 1870, il quitte Paris assiégé en ballon pour lever des armées en province.',
      'Avec la Délégation de Tours puis de Bordeaux, il arme 600 000 hommes en quatre mois.',
      'Chef des républicains « opportunistes », il fait accepter la République au pays.',
      'Président du Conseil soixante-quatorze jours, il meurt à quarante-quatre ans.',
    ],
    recit: [
      {
        titre: 'L’avocat de Cahors',
        texte:
          'Léon Gambetta naît à **Cahors** en 1838, fils d’un épicier d’origine génoise. Un accident lui coûte un œil à quinze ans ; il portera toute sa vie un œil de verre. Monté à Paris, avocat à vingt et un ans, il traîne dans les cafés du Quartier latin jusqu’au jour où une affaire le révèle : le **procès Baudin**, en novembre 1868. Des républicains sont poursuivis pour avoir ouvert une souscription en faveur d’un député tué sur une barricade le 3 décembre 1851. Gambetta les défend et retourne le procès contre le régime : deux heures durant, il fait devant la cour le récit du **coup d’État du 2 décembre**, et le lendemain toute la France le lit dans les journaux. En 1869, il est élu député à Paris et à Marseille sur le **programme de Belleville** : suffrage universel réel, liberté de la presse, séparation de l’Église et de l’État, instruction gratuite et obligatoire.',
      },
      {
        titre: 'Le 4 septembre 1870',
        texte:
          'La nouvelle de **Sedan** atteint Paris le 3 septembre au soir. Le 4, la foule envahit le Palais-Bourbon. Gambetta monte à la tribune et fait prononcer la déchéance : « Louis-Napoléon Bonaparte et sa dynastie ont à jamais cessé de régner sur la France. » Puis il entraîne la foule à l’**Hôtel de Ville**, où la **République** est proclamée — la troisième, et celle qui durera. Un **gouvernement de la Défense nationale** se forme aussitôt, présidé par le général Trochu ; Gambetta y prend l’Intérieur. Il n’est pas question de négocier : le gouvernement décide de continuer la guerre. Le 19 septembre, les Prussiens ferment le cercle autour de Paris. La capitale est coupée du reste du pays, et le pays n’a plus d’armée : celle de Napoléon III est prisonnière, celle de Bazaine est enfermée dans Metz.',
      },
      {
        titre: 'Le ballon et les armées de la Loire',
        texte:
          'Il faut quelqu’un pour lever des troupes en province, et il faut d’abord sortir de Paris. Le **7 octobre 1870**, Gambetta s’installe dans la nacelle du ballon *Armand-Barbès*, place Saint-Pierre à Montmartre, et s’élève au-dessus des lignes prussiennes sous les balles. Il atterrit le soir même près de Montdidier et gagne **Tours**, où il prend en main la Délégation du gouvernement et se donne aussi le ministère de la **Guerre**. En quatre mois, avec l’ingénieur Charles de Freycinet, il lève, arme et habille **600 000 hommes** : les armées de la Loire, du Nord, de l’Est. Le 9 novembre, l’armée de la Loire reprend **Orléans** à Coulmiers — la première victoire française de la guerre. Mais l’hiver, la faim et les défaites de janvier 1871 ont raison de l’effort. Paris capitule le 28 janvier. Gambetta veut continuer ; l’Assemblée élue le 8 février veut la paix. Il démissionne et s’en va se reposer en Espagne.',
      },
      {
        titre: 'Faire accepter la République',
        texte:
          'De 1871 à 1879, il fait ce que personne d’autre ne fait : il parcourt la France pour convaincre les paysans et les petites villes que la République n’est ni la Terreur ni la Commune. Cent discours, des salles pleines ; on le surnomme le **commis voyageur de la République**. À Grenoble, en 1872, il annonce l’arrivée aux affaires des « **nouvelles couches sociales** » — instituteurs, commerçants, paysans propriétaires. Les **lois constitutionnelles de 1875** installent le régime, l’amendement Wallon passant à une voix de majorité. La crise du **16 mai 1877** est l’épreuve : le président Mac-Mahon, monarchiste, renvoie un gouvernement républicain et dissout la Chambre. Gambetta parcourt le pays et lance à Lille : « Il faut se soumettre ou se démettre. » Les républicains gagnent les élections d’octobre 1877 ; Mac-Mahon se soumet, puis se démet en janvier 1879. Gambetta devient président de la Chambre, puis président du Conseil en novembre 1881 — soixante-quatorze jours seulement. Il meurt le **31 décembre 1882**, à quarante-quatre ans.',
      },
    ],
    chrono: [
      { date: '1838', fait: 'Naissance à Cahors, fils d’un épicier.' },
      { date: 'novembre 1868', fait: 'Procès Baudin : son réquisitoire contre l’Empire le rend célèbre.' },
      { date: '4 septembre 1870', fait: 'Il proclame la déchéance de l’Empire et la République.' },
      { date: '7 octobre 1870', fait: 'Départ de Paris assiégé en ballon.' },
      { date: '9 novembre 1870', fait: 'Victoire de Coulmiers : Orléans est repris.' },
      { date: 'février 1871', fait: 'Il démissionne, opposé à la paix avec l’Allemagne.' },
      { date: '4 mai 1877', fait: '« Le cléricalisme, voilà l’ennemi ! »' },
      { date: '15 août 1877', fait: 'Discours de Lille : « se soumettre ou se démettre ».' },
      { date: '14 novembre 1881', fait: 'Président du Conseil.' },
      { date: '31 décembre 1882', fait: 'Mort à Ville-d’Avray, à quarante-quatre ans.' },
    ],
    leSaisTu:
      'Le 7 octobre 1870, Gambetta prit place dans la nacelle de l’*Armand-Barbès*, place Saint-Pierre à Montmartre. Les Prussiens tirèrent sur le ballon, qui passa au-dessus de leurs lignes. Il se posa le soir même dans un arbre, près de Montdidier, et repartit à cheval organiser la guerre. Une soixantaine de ballons quittèrent Paris assiégé ; ils emportèrent aussi deux millions et demi de lettres.',
    aRetenir: [
      'Gambetta proclame la déchéance de Napoléon III et la République le 4 septembre 1870, deux jours après Sedan.',
      'Il quitte Paris assiégé en ballon le 7 octobre 1870 et lève des armées en province pour continuer la guerre.',
      'Chef des républicains modérés, dits opportunistes, il fait accepter la République aux Français entre 1871 et 1879.',
      'Lors de la crise du 16 mai 1877, il somme Mac-Mahon de « se soumettre ou se démettre ».',
      'Président du Conseil en 1881, il meurt le 31 décembre 1882, à quarante-quatre ans.',
    ],
    mots: [
      {
        mot: 'Opportuniste',
        sens: 'Républicain modéré qui veut les réformes « au moment opportun », par la loi et non par la rue.',
      },
      {
        mot: 'Cléricalisme',
        sens: 'L’influence de l’Église catholique sur la politique et sur l’école, que les républicains veulent écarter.',
      },
      {
        mot: 'Ballon monté',
        sens: 'Ballon à gaz emportant un passager et du courrier hors de Paris assiégé, en 1870-1871.',
      },
    ],
    lies: [
      'adolphe-thiers',
      'jules-ferry',
      'defaite-de-sedan',
      'commune-de-paris',
      'napoleon-iii',
    ],
    niveaux: ['4e', '1re'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'IIIᵉ République',
      '4 septembre 1870',
      'ballon',
      'Défense nationale',
      'opportunistes',
      'Cahors',
      'Mac-Mahon',
      '16 mai 1877',
      'cléricalisme',
      'Coulmiers',
    ],
  },
  {
    id: 'jules-ferry',
    volet: 'personnages',
    nom: 'Jules Ferry',
    surnom: 'le père de l’école gratuite et laïque',
    dates: '1832 – 1893',
    tri: 1893,
    periode: 'xixe',
    emoji: '🏫',
    roles: ['Ministre de l’Instruction publique', 'Président du Conseil', 'Avocat'],
    origine: 'Saint-Dié, Vosges',
    accroche:
      'Il rend l’école primaire gratuite, laïque et obligatoire — et lance en même temps la France dans la conquête coloniale.',
    citations: [
      {
        texte:
          'L’instruction primaire est obligatoire pour les enfants des deux sexes âgés de six ans révolus à treize ans révolus.',
        qui: 'Loi du 28 mars 1882, article 4',
        contexte:
          'Le texte qui rend l’école obligatoire en France. « Des deux sexes » : les filles y sont nommées à égalité.',
      },
      {
        texte:
          'Avant de proposer à vos élèves un précepte, demandez-vous s’il se trouve, à votre connaissance, un seul honnête homme qui puisse être froissé de ce que vous allez dire.',
        contexte: 'Lettre aux instituteurs, le 17 novembre 1883.',
        sens:
          'Sa définition pratique de la laïcité : l’école enseigne la morale commune à tous, jamais la croyance des uns contre celle des autres.',
      },
      {
        texte:
          'Les races supérieures ont un droit vis-à-vis des races inférieures… parce qu’il y a un devoir pour elles. Elles ont le devoir de civiliser les races inférieures.',
        contexte:
          'À la Chambre des députés, le 28 juillet 1885, pour justifier la conquête coloniale.',
        sens:
          'Ce langage, courant chez les Européens de son temps, sert à justifier la conquête et la domination de peuples entiers. Il est contesté dès ce jour-là.',
      },
      {
        texte:
          'Races supérieures, races inférieures, c’est bientôt dit ! Non, il n’y a pas de droit des nations dites supérieures contre les nations inférieures.',
        qui: 'Georges Clemenceau, en réponse à Jules Ferry',
        contexte: 'À la Chambre des députés, le 31 juillet 1885, trois jours après le discours de Ferry.',
      },
    ],
    reperes: [
      'Avocat lorrain et républicain, il combat l’Empire puis siège à l’Assemblée après 1871.',
      'Maire de Paris pendant le siège de 1870 : il doit rationner deux millions d’habitants.',
      'Ministre de l’Instruction publique à partir du 4 février 1879.',
      'Lois de 1881 et 1882 : l’école primaire devient gratuite, obligatoire et laïque.',
      'Deux fois président du Conseil, de 1880 à 1881 puis de 1883 à 1885.',
      'Il lance la conquête de la Tunisie en 1881, puis du Tonkin et de Madagascar.',
    ],
    recit: [
      {
        titre: 'Un avocat lorrain dans la République',
        texte:
          'Jules Ferry naît en 1832 à **Saint-Dié**, dans les Vosges. Avocat, journaliste au *Temps*, il se fait connaître en 1868 par *Les Comptes fantastiques d’Haussmann*, une enquête au vitriol sur les emprunts cachés du préfet de Paris. Élu député en 1869, il est l’un des hommes du 4 septembre 1870 et devient **maire de Paris** pendant le siège : c’est lui qui doit rationner une ville de deux millions d’habitants où l’on finit par manger les animaux du Jardin des plantes. Les Parisiens le surnomment « Ferry-Famine » et ne le lui pardonneront jamais. Écarté après la Commune, envoyé en ambassade à Athènes, il revient à la Chambre et attend son heure. Elle vient le **4 février 1879**, quand les républicains, enfin maîtres de tous les pouvoirs, le nomment **ministre de l’Instruction publique**.',
      },
      {
        titre: 'Gratuite, laïque, obligatoire',
        texte:
          'En quatre ans, il fait voter l’école de la République. La **loi du 16 juin 1881** supprime les frais de scolarité dans les écoles primaires publiques : l’école devient **gratuite**. La **loi du 28 mars 1882** la rend **obligatoire** pour les garçons et les filles de six à treize ans, et **laïque** : l’instruction religieuse quitte les programmes, remplacée par l’**instruction morale et civique**, et une journée par semaine reste libre pour que les familles qui le souhaitent fassent donner le catéchisme hors de l’école. La loi Goblet de 1886 achèvera le travail en confiant les classes publiques à des maîtres laïques. Autour, tout un dispositif : une **école normale** d’instituteurs et une d’institutrices par département, des **lycées de jeunes filles** créés par la loi Camille Sée en 1880, des manuels, des cartes, un certificat d’études. Vers 1900, presque tous les jeunes Français savent lire. Les instituteurs, que **Charles Péguy** appellera les « hussards noirs de la République », deviennent des personnages respectés dans les villages — et imposent aussi le français contre les langues régionales.',
      },
      {
        titre: '1881, l’année des libertés',
        texte:
          'L’école n’est pas seule. Le même été, les républicains font voter deux lois qui tiennent encore : la **liberté de réunion** (30 juin 1881), qui supprime l’autorisation préalable, et la **liberté de la presse** (29 juillet 1881), qui abolit la censure et la plupart des délits d’opinion — c’est aujourd’hui encore le texte de référence du droit de la presse en France. Pendant son second gouvernement viennent la **loi Waldeck-Rousseau** du 21 mars 1884, qui autorise les **syndicats**, la loi municipale d’avril 1884, qui fait élire les maires par les conseils municipaux, et la **loi Naquet** de juillet 1884, qui rétablit le **divorce**, supprimé en 1816. En cinq ans, la IIIᵉ République a donné à la France l’essentiel de ses libertés publiques.',
      },
      {
        titre: 'L’empire colonial, et le discours de 1885',
        texte:
          'Ferry est aussi l’homme qui lance la France dans la **conquête coloniale** : protectorat sur la **Tunisie** par le traité du Bardo (12 mai 1881), conquête du **Tonkin** et de l’Annam, expéditions à **Madagascar** et au Congo. L’opposition vient des deux bords : la droite nationaliste lui reproche de disperser des forces qu’il faudrait garder contre l’Allemagne, l’extrême gauche dénonce la conquête elle-même. Le **28 juillet 1885**, à la Chambre, il défend sa politique par trois arguments : des **débouchés** pour l’industrie, le **rayonnement** de la France, et un prétendu devoir — « les races supérieures ont un droit vis-à-vis des races inférieures », parce qu’elles ont « le devoir de civiliser les races inférieures ». Ce langage est celui d’une partie des Européens de son temps, et il sert à justifier la conquête, l’occupation et la domination de peuples entiers. Il est contesté dans la salle même : trois jours plus tard, **Clemenceau** lui répond qu’il n’existe aucun droit des nations dites supérieures sur les autres. Ferry n’est déjà plus au pouvoir : le **30 mars 1885**, une dépêche annonçant l’évacuation de **Lang Son**, au Tonkin, l’a fait renverser aux cris de « Ferry-Tonkin », et il a dû quitter le Palais-Bourbon par une porte dérobée.',
      },
    ],
    chrono: [
      { date: '1832', fait: 'Naissance à Saint-Dié, dans les Vosges.' },
      { date: '1870-1871', fait: 'Maire de Paris pendant le siège : il rationne la ville.' },
      { date: '4 février 1879', fait: 'Ministre de l’Instruction publique.' },
      { date: '12 mai 1881', fait: 'Traité du Bardo : la Tunisie devient un protectorat français.' },
      { date: '16 juin 1881', fait: 'L’école primaire publique devient gratuite.' },
      { date: '29 juillet 1881', fait: 'Loi sur la liberté de la presse.' },
      { date: '28 mars 1882', fait: 'L’école devient obligatoire de six à treize ans, et laïque.' },
      { date: '21 mars 1884', fait: 'La loi Waldeck-Rousseau autorise les syndicats.' },
      { date: '30 mars 1885', fait: 'Renversé après la dépêche de Lang Son.' },
      { date: '28 juillet 1885', fait: 'Discours sur « les races supérieures » à la Chambre.' },
      { date: '17 mars 1893', fait: 'Mort à Paris, alors président du Sénat.' },
    ],
    leSaisTu:
      'Jules Ferry avait écrit dans son testament : « Je souhaite reposer face à cette ligne bleue des Vosges, d’où monte jusqu’à mon cœur fidèle la plainte touchante des vaincus. » Il est enterré à Saint-Dié, son tombeau tourné vers l’Alsace annexée en 1871. L’expression « la ligne bleue des Vosges » est restée.',
    aRetenir: [
      'Jules Ferry est ministre de l’Instruction publique à partir de 1879 et deux fois président du Conseil.',
      'La loi du 16 juin 1881 rend l’école primaire publique gratuite ; celle du 28 mars 1882 la rend obligatoire de six à treize ans, et laïque.',
      'Son camp fait voter la liberté de réunion et de la presse en 1881, les syndicats et le divorce en 1884.',
      'Il lance la conquête coloniale : Tunisie en 1881, puis Tonkin et Madagascar.',
      'Le 28 juillet 1885, il justifie la colonisation par un « devoir » des « races supérieures » ; Clemenceau lui répond trois jours plus tard.',
    ],
    mots: [
      {
        mot: 'Laïcité',
        sens: 'Neutralité de l’État et de l’école en matière de religion : on n’y enseigne ni ne combat aucune foi.',
      },
      {
        mot: 'Protectorat',
        sens: 'Pays qui garde son souverain, mais dont la France dirige l’armée et la diplomatie.',
      },
      {
        mot: 'Instruction civique',
        sens: 'La leçon de morale et de citoyenneté qui remplace, en 1882, l’instruction religieuse à l’école publique.',
      },
    ],
    lies: [
      'lois-jules-ferry',
      'leon-gambetta',
      'partage-de-l-afrique',
      'loi-de-separation-1905',
      'georges-clemenceau',
    ],
    niveaux: ['4e', '1re'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'école gratuite',
      'laïque',
      'obligatoire',
      '1882',
      'IIIᵉ République',
      'hussards noirs',
      'colonisation',
      'Tonkin',
      'Tunisie',
      'Saint-Dié',
      'Clemenceau',
    ],
  },
  {
    id: 'victor-schoelcher',
    volet: 'personnages',
    nom: 'Victor Schœlcher',
    surnom: 'l’homme du décret d’abolition',
    dates: '1804 – 1893',
    tri: 1893,
    periode: 'xixe',
    emoji: '⛓️',
    roles: ['Député', 'Sous-secrétaire d’État aux Colonies', 'Abolitionniste'],
    origine: 'Paris, France',
    accroche:
      'Fils d’un fabricant de porcelaine, il consacre sa vie entière à une seule cause et signe, en 1848, le décret qui abolit l’esclavage.',
    citations: [
      {
        texte: 'Nulle terre française ne peut plus porter d’esclaves.',
        qui: 'Le décret d’abolition de l’esclavage',
        contexte:
          'Principe posé par le gouvernement provisoire le 4 mars 1848, repris par le décret du 27 avril 1848 que rédige la commission présidée par Schœlcher.',
        sens:
          'Une seule phrase abolit en même temps la propriété d’un homme sur un autre et les règles qui la protégeaient depuis 1685.',
      },
      {
        texte:
          'L’esclavage est un attentat contre la dignité humaine ; en détruisant le libre arbitre de l’homme, il supprime le principe naturel du droit et du devoir.',
        qui: 'Préambule du décret du 27 avril 1848',
        contexte: 'Les considérants placés en tête du texte, écrits par la commission d’abolition.',
      },
      {
        texte:
          'L’esclavage sera entièrement aboli dans toutes les colonies et possessions françaises, deux mois après la promulgation du présent décret.',
        qui: 'Article 1ᵉʳ du décret du 27 avril 1848',
        contexte:
          'Deux mois : le délai d’acheminement d’un courrier vers les Antilles et La Réunion. Pas un jour de plus.',
      },
    ],
    reperes: [
      'Fils d’un fabricant de porcelaine parisien, il découvre l’esclavage en voyage à Cuba, en 1830.',
      'Il publie en 1842 *Des colonies françaises*, qui réclame l’abolition immédiate.',
      'Sous-secrétaire d’État aux Colonies le 5 mars 1848, il préside la commission d’abolition.',
      'Le décret du 27 avril 1848 libère environ 250 000 personnes en deux mois.',
      'Élu député de la Martinique et de la Guadeloupe, il siège pour elles dès 1848.',
      'Exilé dix-neuf ans sous le Second Empire ; ses cendres sont au Panthéon depuis 1949.',
    ],
    recit: [
      {
        titre: 'Cuba, 1830 : la vie bascule',
        texte:
          'Victor Schœlcher naît à Paris en 1804, fils d’un fabricant de **porcelaine** venu d’Alsace, et destiné à reprendre l’affaire. En 1829, son père l’envoie vendre de la porcelaine au **Mexique**, à **Cuba** et aux **États-Unis**. Il y voit des marchés aux esclaves, des plantations, des châtiments. Il en revient autre homme. À partir de 1830, il écrit, enquête, voyage — les **Antilles** en 1840-1841, l’Égypte, le **Sénégal**, la Grèce — et publie livre sur livre : *Abolition de l’esclavage* (1840), *Des colonies françaises. Abolition immédiate de l’esclavage* (1842), *Histoire de l’esclavage pendant les deux dernières années* (1847). Sa thèse ne varie jamais : l’abolition doit être **immédiate**, **totale** et **partout**, parce que toute abolition « graduelle » revient à laisser naître encore une génération d’esclaves. Il y consacre sa fortune et ne se mariera pas.',
      },
      {
        titre: 'Deux mois pour écrire la liberté',
        texte:
          'Le **24 février 1848**, la monarchie de Juillet tombe et la **IIᵉ République** est proclamée. Schœlcher est alors au Sénégal. Il rentre en hâte, court chez **François Arago**, ministre de la Marine et des Colonies, et obtient de lui ce qu’il réclame depuis dix-huit ans. Dès le **4 mars**, le gouvernement provisoire pose le principe : nulle terre française ne peut plus porter d’esclaves. Le lendemain, Schœlcher est nommé **sous-secrétaire d’État aux Colonies** et préside la commission chargée d’écrire le texte. Elle travaille sept semaines. Le **27 avril 1848**, le **décret d’abolition** est signé : l’esclavage est aboli dans toutes les colonies françaises deux mois après sa promulgation, quiconque le pratiquera perdra la nationalité française, et les affranchis deviennent **citoyens français**, donc **électeurs**. C’est la deuxième abolition française : celle de 1794 avait été annulée par Bonaparte en 1802.',
      },
      {
        titre: 'Environ 250 000 personnes',
        texte:
          'Le décret libère environ **250 000 personnes** : 87 000 en Guadeloupe, 74 000 en Martinique, 62 000 à La Réunion, 13 000 en Guyane, quelques milliers au Sénégal. Il n’est pas partout attendu : en **Martinique**, l’arrestation d’un esclave le 22 mai 1848 soulève Saint-Pierre, et le gouverneur proclame l’abolition le jour même, avant l’arrivée du texte de Paris. La liberté est immédiate et sans rachat pour les affranchis — mais l’article 5 du décret prévoit une **indemnité aux anciens propriétaires**, 126 millions de francs, et rien pour ceux qui ont été réduits en esclavage. Très vite, des lois contre le **vagabondage** obligent les affranchis à se louer dans les plantations, et des dizaines de milliers de travailleurs **engagés**, recrutés en Inde et en Afrique, viennent remplacer la main-d’œuvre servile. Schœlcher, élu **député de la Martinique et de la Guadeloupe** en août 1848, passera le reste de sa vie à réclamer l’égalité réelle qu’il n’a pas obtenue en avril.',
      },
      {
        titre: 'Dix-neuf ans d’exil, puis le Panthéon',
        texte:
          'Le **2 décembre 1851**, Schœlcher est sur les barricades de Paris contre le coup d’État de Louis-Napoléon. Il doit fuir, gagne Londres et refuse l’amnistie de 1859, comme **Victor Hugo** : il ne rentrera qu’à la chute de l’Empire, en 1870. Dix-neuf ans d’exil. Député puis **sénateur inamovible** à partir de 1875, il se bat jusqu’au bout pour ce qu’il tient pour la même cause : l’abolition de la **peine de mort**, l’égalité des colonies, la protection des enfants au travail, la condition des femmes. Il lègue sa bibliothèque, ses partitions et ses instruments de musique à la Martinique et à la Guadeloupe. Il meurt à Houilles le **25 décembre 1893**. Le **20 mai 1949**, ses cendres entrent au **Panthéon**, le même jour que celles de **Félix Éboué**, gouverneur guyanais rallié à la France libre. Des dizaines d’écoles, de rues et une ville de Guadeloupe portent aujourd’hui son nom.',
      },
    ],
    chrono: [
      { date: '1804', fait: 'Naissance à Paris.' },
      { date: '1830', fait: 'Voyage au Mexique, à Cuba et aux États-Unis : il y voit l’esclavage.' },
      { date: '1842', fait: '*Des colonies françaises. Abolition immédiate de l’esclavage*.' },
      { date: '4 mars 1848', fait: 'Le gouvernement provisoire pose le principe de l’abolition.' },
      { date: '5 mars 1848', fait: 'Il devient sous-secrétaire d’État aux Colonies.' },
      { date: '27 avril 1848', fait: 'Signature du décret d’abolition de l’esclavage.' },
      { date: 'mai-décembre 1848', fait: 'L’abolition s’applique colonie par colonie.' },
      { date: 'août 1848', fait: 'Élu député de la Martinique et de la Guadeloupe.' },
      { date: '1851-1870', fait: 'Dix-neuf ans d’exil après le coup d’État du 2 décembre.' },
      { date: '1875', fait: 'Sénateur inamovible ; il réclame l’abolition de la peine de mort.' },
      { date: '25 décembre 1893', fait: 'Mort à Houilles.' },
      { date: '20 mai 1949', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'En Martinique, les esclaves n’ont pas attendu le décret. Le 22 mai 1848, l’arrestation d’un esclave nommé Romain souleva Saint-Pierre ; dès le lendemain, le gouverneur proclama l’abolition sans attendre le texte venu de Paris. Le 22 mai est resté le jour de commémoration de l’abolition en Martinique.',
    aRetenir: [
      'Victor Schœlcher fait signer le décret du 27 avril 1848, qui abolit l’esclavage dans toutes les colonies françaises.',
      'Environ 250 000 personnes sont libérées en 1848 en Guadeloupe, en Martinique, à La Réunion, en Guyane et au Sénégal.',
      'Les esclaves libérés deviennent aussitôt citoyens français et électeurs.',
      'Le décret indemnise les anciens propriétaires — 126 millions de francs — mais pas les anciens esclaves.',
      'C’est la deuxième abolition : celle de 1794 avait été annulée par Bonaparte en 1802.',
    ],
    mots: [
      {
        mot: 'Abolition',
        sens: 'Suppression d’une loi ou d’une institution — ici, de l’esclavage, par décret.',
      },
      {
        mot: 'Décret',
        sens: 'Décision du gouvernement qui a force de loi, prise sans vote d’une assemblée.',
      },
      {
        mot: 'Engagé',
        sens: 'Travailleur recruté par contrat en Inde, en Afrique ou en Chine pour remplacer les esclaves dans les plantations.',
      },
    ],
    lies: [
      'abolition-de-l-esclavage-1848',
      'abolition-de-l-esclavage-1794',
      'toussaint-louverture',
      'traite-atlantique-et-code-noir',
      'abbe-gregoire',
    ],
    niveaux: ['4e', '1re'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'abolition',
      'esclavage',
      '27 avril 1848',
      'Martinique',
      'Guadeloupe',
      'IIᵉ République',
      'Panthéon',
      'colonies',
      'Schoelcher',
      'engagés',
    ],
  },
]
