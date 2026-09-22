// -----------------------------------------------------------------------------
// MOYEN ÂGE — LA FIN : ce que les trois derniers siècles médiévaux bâtissent,
// et ce qui manque de tout emporter.
//
// Deux visages, volontairement dans le même lot. D'un côté ce que l'Occident
// ÉLÈVE : quatre-vingts cathédrales en cent cinquante ans, et les universités,
// deux institutions inventées de rien qui tiennent encore. De l'autre ce qui
// FAUCHE : cent seize ans de guerre, un Européen sur trois emporté par la
// peste, et une capitale d'onze siècles qui tombe en cinquante-trois jours.
//
// Les trois fiches de 1429-1431 — Orléans, Reims, Rouen — sont les ÉVÉNEMENTS
// de la fiche `jeanne-d-arc`, pas sa biographie répétée trois fois : on y
// raconte le terrain, les forces en présence, les heures, et ce que la journée
// change. Le bûcher est raconté avec précision et gravité : c'est un procès
// politique instruit sous l'habit d'un procès d'Église, et c'est l'Église
// elle-même qui l'a dit en l'annulant en 1456.
//
// Guide de rédaction : `docs/encyclopedie.md`.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_MOYEN_AGE_FIN: Evenement[] = [
  {
    id: 'construction-des-cathedrales',
    volet: 'evenements',
    nom: 'La construction des cathédrales',
    date: 'XIIᵉ – XIVᵉ siècle',
    tri: 1163,
    fin: 1345,
    periode: 'moyen-age',
    emoji: '⛪',
    lieu: 'Saint-Denis, Paris, Chartres, Reims, Amiens, Beauvais',
    accroche:
      'En cent cinquante ans, la France se couvre de quatre-vingts cathédrales : des chantiers d’un siècle, payés par toute une ville, pour faire entrer la lumière dans la pierre.',
    citations: [
      {
        texte: 'L’esprit obtus s’élève vers le vrai par ce qui est matériel.',
        qui: 'Suger, abbé de Saint-Denis',
        contexte:
          'Inscription voulue par Suger sur les portes de bronze de son abbatiale, vers 1140.',
        sens:
          'La beauté de l’édifice n’est pas un luxe : elle est le chemin par lequel un homme ordinaire monte vers Dieu. Toute la justification du gothique tient dans cette phrase.',
      },
      {
        texte:
          'Il semblait que le monde, secouant sa vétusté, revêtît partout la blanche robe des églises.',
        qui: 'Raoul Glaber, moine chroniqueur',
        contexte:
          'Dans ses *Histoires*, vers 1040, sur la vague de reconstructions qui suit l’an mil.',
        sens:
          'Un siècle avant le gothique, l’Occident a déjà recommencé à bâtir — c’est de cet élan-là que sortiront les cathédrales.',
      },
      {
        texte:
          'Vous trouverez en ce livre grand conseil de la grande force de maçonnerie et des engins de charpenterie.',
        qui: 'Villard de Honnecourt, maître d’œuvre',
        contexte:
          'Première page de son carnet de croquis, vers 1230 : le seul cahier de chantier gothique conservé.',
      },
    ],
    reperes: [
      'Saint-Denis, 1144 : la première voûte gothique, voulue par l’abbé Suger, ouvre le mur à la lumière.',
      'Notre-Dame de Paris : chantier ouvert en 1163, achevé vers 1345 — près de deux cents ans.',
      'Trois trouvailles font le gothique : la croisée d’ogives, l’arc-boutant et le vitrail.',
      'Beauvais vise 48 mètres sous voûte en 1272 ; le chœur s’effondre en 1284.',
      'Une ville de dix mille habitants bâtit une cathédrale de dix mille places : Chartres, Amiens, Reims.',
      'Le chantier se paie par l’évêque, le chapitre, les quêtes, les dons et les corporations de métiers.',
    ],
    causes: [
      'Une croissance sans précédent : la population de l’Occident double entre l’an mil et 1300, les villes enflent.',
      'Des campagnes qui dégagent enfin des surplus — charrue à versoir, moulins, défrichements : il y a de quoi payer.',
      'Une foi qui veut se voir : la cathédrale est la maison de Dieu et de toute la cité, pas la chapelle d’un seigneur.',
      'La fierté des villes : chaque évêché veut plus haut, plus long et plus clair que son voisin.',
      'Une trouvaille technique, la croisée d’ogives, qui concentre le poids sur des piliers et libère les murs.',
      'Des corps de métier organisés — maîtres d’œuvre, tailleurs de pierre, charpentiers, verriers — qui passent d’un chantier à l’autre.',
    ],
    recit: [
      {
        titre: 'Le pari de Saint-Denis',
        texte:
          'Tout part d’une abbaye au nord de Paris et d’un homme pressé. **Suger**, abbé de Saint-Denis et conseiller du roi, veut reconstruire l’église qui abrite les tombeaux des rois et attire des foules de pèlerins. Entre **1135 et 1144**, il fait bâtir une façade puis un chœur d’un genre neuf : les piliers portent tout, les murs ne portent plus rien, et là où il y avait de la pierre on met du **verre coloré**. Le chœur est consacré le **11 juin 1144** devant le roi Louis VII et une vingtaine d’évêques, qui repartent chacun avec l’idée dans la tête. Suger n’invente aucune des techniques employées ; il est le premier à toutes les réunir au service d’une conviction : Dieu est lumière, donc l’église doit être claire. Le style que l’on appellera **gothique** — le mot est une moquerie inventée trois siècles plus tard par des Italiens — vient de naître dans un rayon de soleil.',
      },
      {
        titre: 'Trois trouvailles qui tiennent tout',
        texte:
          'Une voûte pèse, et une voûte pousse : elle écrase le mur vers le bas et l’écarte vers l’extérieur. Tant qu’on ne savait pas répondre à cette poussée, il fallait des murs énormes et des fenêtres minuscules — c’est l’église **romane**. Le gothique répond en trois coups. La **croisée d’ogives** : deux arcs diagonaux se croisent sous la voûte et ramènent tout le poids sur quatre points, les piliers. Le **contrefort** et surtout l’**arc-boutant**, cet arc extérieur qui saute par-dessus le bas-côté et va reporter la poussée sur une pile massive, loin du mur. Le mur, déchargé, n’a plus rien à porter : on peut le percer de haut en bas. Reste la troisième trouvaille, le **vitrail**, qui remplit ce vide de verre teinté dans la masse au cobalt et au cuivre. On ne bâtit pas plus solide qu’avant — on bâtit plus intelligemment, avec moins de matière et beaucoup plus de lumière.',
      },
      {
        titre: 'Le chantier est un métier',
        texte:
          'À la tête du chantier, un **maître d’œuvre** : il trace les plans à la règle et au compas sur des dalles de plâtre, taille les gabarits, commande les équipes et signe parfois son travail dans le labyrinthe du dallage. Sous lui, la **loge** — la baraque de chantier — abrite les tailleurs de pierre, qui marquent chaque bloc de leur signe pour être payés à la pièce. Autour : carriers, charretiers, mortelliers, charpentiers, couvreurs, verriers, forgerons. Les blocs montent par des **grues à roue d’écureuil**, où deux hommes marchent dans un tambour de bois pour hisser une tonne. On travaille de Pâques à la Toussaint ; l’hiver, on couvre les murs de paille et de fumier pour que le mortier ne gèle pas. Le carnet de **Villard de Honnecourt**, vers 1230, montre ce que ces gens savaient : épures, engins de levage, scie hydraulique, proportions géométriques. Aucun d’eux n’est un amateur inspiré ; ce sont des professionnels, et ils circulent de Reims à Cambridge.',
      },
      {
        titre: 'Qui paie, et pendant combien de temps',
        texte:
          'Une cathédrale coûte, sur sa durée, l’équivalent de plusieurs années de revenus de toute une région. Personne ne la paie seul. L’**évêque** et le **chapitre** des chanoines y consacrent une part fixe de leurs revenus ; le roi et les grands donnent ; les fidèles laissent leur offrande dans les troncs ; on organise des **quêtes** avec des reliques promenées de village en village, et l’Église accorde des **indulgences** à qui contribue. Les **corporations de métiers** achètent des verrières : à **Chartres**, une quarantaine de vitraux portent en bas de panneau la signature des donateurs — boulangers pétrissant, pelletiers, charrons, porteurs d’eau, changeurs à leur table. Quand l’argent manque, le chantier s’arrête, parfois trente ans, et reprend au goût du jour : c’est pourquoi une même cathédrale mélange souvent trois styles. Beaucoup ne furent jamais finies, et leurs tours attendent encore.',
      },
      {
        titre: 'La course à la hauteur et son mur',
        texte:
          'Chaque ville veut dépasser la précédente, et pendant un siècle elle y arrive. **Notre-Dame de Paris** monte à 33 mètres sous voûte, **Chartres** à 37, **Reims** à 38, **Amiens** à 42. En **1272**, le chapitre de **Beauvais** ose 48 mètres — la plus haute voûte jamais tentée en Europe. Douze ans plus tard, en **1284**, une partie du chœur s’effondre. On rebâtit en doublant les piliers, on renonce à la nef ; en 1573, la flèche tombe à son tour. Beauvais restera un chœur magnifique et seul, la preuve dressée qu’il existait une limite et qu’on l’avait trouvée. Le reste s’arrête pour d’autres raisons : la **Grande Peste** de 1347 emporte les bailleurs de fonds comme les tailleurs de pierre, et la **guerre de Cent Ans** transforme les budgets en remparts. L’âge des grands chantiers dure cent cinquante ans, pas un de plus.',
      },
      {
        titre: 'Le livre de ceux qui ne lisent pas',
        texte:
          'Dans une population où presque personne ne lit, la cathédrale est un texte. Le **tympan** du portail raconte le Jugement dernier, avec la pesée des âmes et les damnés menés à la chaîne ; les **vitraux** déroulent la vie du Christ, l’arbre de Jessé, les histoires des saints locaux ; le **calendrier** sculpté aux piédroits montre les travaux de chaque mois, la taille de la vigne en mars, le cochon tué en décembre. Chartres à elle seule conserve **176 verrières** et des milliers de figures de pierre. Et l’édifice n’est pas qu’une église : on s’y abrite, on y tient des assemblées de ville, on y juge, on y joue des **mystères** sur le parvis, les marchands s’installent contre ses murs. Sept siècles plus tard, elle est encore le plus haut bâtiment de la plupart de ces villes.',
      },
    ],
    consequences: [
      'Un paysage durable : la cathédrale reste pour sept siècles le plus haut bâtiment de sa ville.',
      'Des savoirs techniques qui circulent d’un chantier à l’autre et fixent les métiers du bâtiment en corporations.',
      'La ville prend le pas sur le château : le cœur religieux et civique se déplace dans l’enceinte urbaine.',
      'Un art de la lumière et de l’image qui instruit une population qui ne sait pas lire.',
      'Des dettes et des impôts locaux qui pèsent des générations ; beaucoup de chantiers restent inachevés.',
      'La peste de 1347 et la guerre de Cent Ans arrêtent net l’âge des grands chantiers.',
    ],
    chiffres: [
      { valeur: '80', quoi: 'cathédrales gothiques bâties en France entre 1150 et 1300' },
      { valeur: '182 ans', quoi: 'de chantier pour Notre-Dame de Paris (1163-1345)' },
      { valeur: '48 m', quoi: 'sous voûte à Beauvais : le record d’Europe, effondré en 1284' },
      { valeur: '176', quoi: 'verrières médiévales encore en place à Chartres' },
    ],
    chrono: [
      { date: '11 juin 1144', fait: 'Consécration du chœur de Saint-Denis, voulu par Suger.' },
      { date: '1163', fait: 'Première pierre de Notre-Dame de Paris.' },
      { date: '1194', fait: 'Chartres brûle ; on la rebâtit en vingt-six ans.' },
      { date: '1211', fait: 'Ouverture du chantier de Reims, cathédrale du sacre.' },
      { date: '1220', fait: 'Début d’Amiens, la plus vaste cathédrale de France.' },
      { date: '1272', fait: 'Beauvais lance la plus haute voûte d’Europe.' },
      { date: '1284', fait: 'Le chœur de Beauvais s’effondre.' },
      { date: 'vers 1345', fait: 'Notre-Dame de Paris est achevée.' },
      { date: '1347', fait: 'La peste et la guerre arrêtent les grands chantiers.' },
    ],
    leSaisTu:
      'À Chartres, ce sont les métiers qui ont payé les vitraux — et ils l’ont fait savoir. En bas d’une quarantaine de verrières, un petit panneau montre le donateur au travail : le boulanger devant son four, le pelletier étalant ses fourrures, le porteur d’eau avec ses seaux. C’est la plus ancienne publicité de France, et elle a huit cents ans.',
    aRetenir: [
      'Le gothique naît à Saint-Denis vers 1140, sous l’impulsion de l’abbé Suger.',
      'Trois techniques le rendent possible : la croisée d’ogives, l’arc-boutant et le vitrail.',
      'Environ 80 cathédrales sont bâties en France entre 1150 et 1300 ; un chantier dure souvent plus d’un siècle.',
      'Elles sont financées par l’évêque, le chapitre, les dons des fidèles et les corporations de métiers.',
      'En 1284, le chœur de Beauvais s’effondre : la course à la hauteur a trouvé sa limite.',
      'Portails et vitraux servent de livre d’images à une population qui ne sait pas lire.',
    ],
    mots: [
      {
        mot: 'Croisée d’ogives',
        sens: 'Deux arcs qui se croisent en diagonale sous une voûte et en portent le poids jusqu’aux piliers.',
      },
      {
        mot: 'Arc-boutant',
        sens: 'Arc extérieur qui reporte la poussée de la voûte sur un contrefort, loin du mur.',
      },
      {
        mot: 'Maître d’œuvre',
        sens: 'L’architecte du chantier : il trace les plans et commande tous les corps de métier.',
      },
      {
        mot: 'Chapitre',
        sens: 'L’assemblée des chanoines qui entoure l’évêque et administre la cathédrale.',
      },
    ],
    lies: ['suger', 'saint-louis', 'naissance-des-universites', 'grande-peste'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'cathédrale',
      'gothique',
      'ogive',
      'arc-boutant',
      'vitrail',
      'Chartres',
      'Notre-Dame',
      'Suger',
      'Saint-Denis',
      'Beauvais',
      'bâtisseurs',
      'Amiens',
    ],
  },
  {
    id: 'naissance-des-universites',
    volet: 'evenements',
    nom: 'La naissance des universités',
    date: 'vers 1200',
    tri: 1200,
    periode: 'moyen-age',
    emoji: '📚',
    lieu: 'Bologne, Paris, Oxford',
    accroche:
      'Vers 1200, les maîtres et les étudiants de Paris se réunissent en corporation et arrachent au roi puis au pape le droit de s’organiser seuls.',
    citations: [
      {
        texte: 'Nous sommes des nains juchés sur des épaules de géants.',
        qui: 'Bernard de Chartres',
        contexte:
          'Rapporté par Jean de Salisbury dans son *Metalogicon*, vers 1159, sur ce que les modernes doivent aux Anciens.',
        sens:
          'On ne voit pas plus loin parce qu’on est plus grand, mais parce qu’on est monté sur le savoir de ceux d’avant. C’est le programme de toute université.',
      },
      {
        texte:
          'En doutant, nous en venons à l’enquête ; et par l’enquête, nous percevons la vérité.',
        qui: 'Pierre Abélard',
        contexte: 'Prologue du *Sic et Non*, vers 1122, où il aligne les contradictions des Pères.',
        sens:
          'Le doute n’est pas l’ennemi de la foi : c’est la méthode. Toute la scolastique sortira de cette phrase.',
      },
      {
        texte: 'Paris, mère des sciences.',
        qui: 'Le pape Grégoire IX',
        contexte:
          'Premiers mots de la bulle *Parens scientiarum*, 13 avril 1231, qui met fin à deux ans de grève des maîtres.',
        sens:
          'Le pape reconnaît à l’université le droit de faire ses propres statuts et de cesser ses cours : son autonomie est écrite noir sur blanc.',
      },
    ],
    reperes: [
      '*Universitas* veut dire « corporation » : celle des maîtres et des étudiants, comme il en existe pour les drapiers.',
      'Bologne vers 1088 pour le droit, Paris vers 1200 pour la théologie, Oxford dans la foulée.',
      '1200 : Philippe Auguste soustrait les écoliers de Paris à la justice du prévôt.',
      '1231 : la bulle *Parens scientiarum* donne à Paris ses statuts et le droit de grève.',
      'Quatre facultés : arts, droit, médecine, théologie. On entre aux arts vers quatorze ans.',
      'Tout se dit en latin : un étudiant de Cologne suit le cours de Paris sans traducteur.',
    ],
    causes: [
      'Des villes qui grossissent et réclament des juristes, des médecins, des notaires et des clercs formés.',
      'Les écoles cathédrales débordées : à Paris, les maîtres enseignent jusque sur les ponts et la montagne Sainte-Geneviève.',
      'La redécouverte d’Aristote et du droit romain, traduits de l’arabe et du grec à Tolède et en Sicile.',
      'Le besoin de se protéger : un étudiant étranger n’a dans la ville ni famille ni droits — la corporation lui en donne.',
      'La rixe de 1200, où des sergents du roi tuent des écoliers allemands : le roi cède et accorde le premier privilège.',
      'Une Église qui veut des théologiens formés pour répondre aux hérésies et encadrer la prédication.',
    ],
    recit: [
      {
        titre: 'Une corporation, comme les drapiers',
        texte:
          'Le mot ne désigne d’abord rien d’intellectuel : *universitas*, en latin, c’est la **corporation**, le groupe qui se constitue pour défendre ses membres. Les maîtres de Paris s’unissent exactement comme les bouchers ou les drapiers, et pour la même raison : peser. L’occasion vient en **1200**. Une rixe de taverne tourne mal, le prévôt de Paris envoie ses sergents, des écoliers allemands sont tués. Les maîtres menacent de partir ; **Philippe Auguste** cède et signe un privilège qui soustrait les écoliers à la justice royale. Vingt-neuf ans plus tard, en **1229**, l’histoire recommence en pire : une bagarre de carnaval, la troupe de la reine **Blanche de Castille**, des morts. Cette fois les maîtres appliquent l’arme qu’ils viennent d’inventer : ils **cessent les cours** et quittent la ville pour Orléans, Angers, Toulouse, Reims. Paris reste deux ans sans université. Le pape **Grégoire IX** tranche en leur faveur le 13 avril **1231** : c’est la bulle *Parens scientiarum*, la charte de l’autonomie universitaire.',
      },
      {
        titre: 'Ce qu’on y apprend, et dans quel ordre',
        texte:
          'On entre à la **faculté des arts** vers quatorze ans, et l’on y reste six ans. Au programme, les **sept arts libéraux** : d’abord le *trivium* — grammaire, rhétorique, **dialectique** (l’art de raisonner) —, puis le *quadrivium* — arithmétique, géométrie, astronomie, musique. On y lit surtout **Aristote**, retrouvé depuis peu par les traductions venues de Tolède. Les arts terminés, on est **maître ès arts** et l’on peut enseigner à son tour, ou monter vers les trois facultés supérieures : le **droit**, la **médecine**, la **théologie**. La théologie est la plus longue et la plus prestigieuse : huit à douze ans de plus, on ne devient docteur qu’autour de trente-cinq ans. Tout se fait en **latin**, la langue commune de l’Europe savante : c’est ce qui permet à un maître de passer de Bologne à Oxford, et à ses élèves de le suivre.',
      },
      {
        titre: 'La leçon, la dispute, et le livre qu’on loue',
        texte:
          'Deux exercices structurent l’enseignement. La **leçon** (*lectio*) : le maître lit à voix haute un passage d’Aristote ou de la Bible, puis le commente phrase à phrase ; les étudiants, assis par terre, notent. Et la **dispute** (*disputatio*), qui est le cœur de la méthode : on pose une question, un bachelier soutient une thèse, d’autres l’attaquent par objections, le maître tranche en fin de séance. Deux fois l’an, la dispute est **de quodlibet** — sur n’importe quoi : l’assistance pose la question qu’elle veut, et le maître doit répondre. C’est ainsi que travaille **Thomas d’Aquin**, qui enseigne à Paris vers 1270. Les livres, eux, coûtent une fortune : la solution est la **pecia**, un exemplaire officiel découpé en cahiers que les libraires louent aux copistes, un cahier à la fois. Un étudiant pauvre n’achète pas un livre : il l’écrit.',
      },
      {
        titre: 'Vivre étudiant en 1250',
        texte:
          'La plupart sont pauvres, loin de chez eux, et ont entre quatorze et vingt-cinq ans. On loge à plusieurs, on mange mal, on écrit à sa famille des lettres dont les recueils de modèles nous ont gardé le ton : elles demandent toutes de l’argent. Le cours se donne **rue du Fouarre**, ainsi nommée parce qu’on y étend du *feurre*, de la paille, pour que les écoliers s’assoient. Les statuts interdisent les armes, les jeux de dés et les sorties de nuit, ce qui indique assez ce qui se passait. Contre cette misère s’inventent les **collèges** : des maisons qui logent et nourrissent gratuitement des boursiers. En **1257**, le chapelain de **Saint Louis**, **Robert de Sorbon**, en fonde un pour seize étudiants pauvres en théologie. On l’appellera la **Sorbonne**.',
      },
      {
        titre: 'Ce qu’il en reste, huit siècles après',
        texte:
          'Presque tout le vocabulaire scolaire d’aujourd’hui sort de là : **faculté**, **recteur**, **doyen**, **bachelier**, **licence**, **maîtrise**, **doctorat**, **thèse**, **cours magistral**, et jusqu’aux **vacances** — la *vacatio*, la période où les cours cessent. Mais surtout l’institution elle-même : un corps qui recrute ses membres, fixe ses programmes, délivre ses diplômes et ne dépend ni de la ville ni du seigneur. Le modèle essaime vite — Montpellier, Toulouse, Cambridge, Salamanque, Naples, Prague, Cracovie — et l’Europe compte une **soixantaine d’universités** à la fin du Moyen Âge. Les grades délivrés à Paris valent partout : c’est la première fois qu’un diplôme traverse les frontières. Quand l’imprimerie arrivera, elle trouvera un public déjà formé à lire, à douter et à disputer.',
      },
    ],
    consequences: [
      'Un modèle d’institution autonome — statuts, grades, diplômes — copié dans toute l’Europe.',
      'Une langue commune, le latin, qui fait circuler maîtres et étudiants de Bologne à Oxford.',
      'Des grades qui existent encore : baccalauréat, licence, maîtrise, doctorat.',
      'La scolastique, méthode de raisonnement par objections et réponses, dont Thomas d’Aquin est le sommet.',
      'La formation des juristes et des médecins que l’État royal et les villes vont employer.',
      'Une soixantaine d’universités en Europe à la fin du Moyen Âge, de Cracovie à Salamanque.',
    ],
    chiffres: [
      { valeur: '3 000', quoi: 'étudiants à Paris vers 1300, dans une ville de 200 000 habitants' },
      { valeur: '6 ans', quoi: 'd’études aux arts avant de pouvoir enseigner' },
      { valeur: '2 ans', quoi: 'de grève des maîtres de Paris, de 1229 à 1231' },
      { valeur: '16', quoi: 'boursiers dans le premier collège de Robert de Sorbon' },
    ],
    chrono: [
      { date: 'vers 1088', fait: 'À Bologne, les étudiants engagent eux-mêmes leurs maîtres.' },
      { date: 'vers 1150', fait: 'Les écoles de Paris gagnent la montagne Sainte-Geneviève.' },
      { date: '1200', fait: 'Charte de Philippe Auguste aux écoliers de Paris.' },
      { date: '1215', fait: 'Premiers statuts de l’université, donnés par le légat du pape.' },
      { date: '1229', fait: 'Après une rixe de carnaval, les maîtres cessent les cours.' },
      { date: '13 avril 1231', fait: 'Bulle *Parens scientiarum* : l’autonomie est reconnue.' },
      { date: '1257', fait: 'Robert de Sorbon fonde son collège pour seize boursiers.' },
      { date: 'vers 1270', fait: 'Thomas d’Aquin enseigne la théologie à Paris.' },
      { date: 'vers 1500', fait: 'L’Europe compte une soixantaine d’universités.' },
    ],
    leSaisTu:
      'La plus célèbre salle de cours du Moyen Âge n’avait pas de bancs. Rue du Fouarre, à Paris, on étendait par terre de la paille — le *feurre* — et les étudiants s’asseyaient dessus, interdiction formelle leur étant faite de se hausser sur un siège. Dante, qui y passa, en parle encore dans le *Paradis* : le « Vico degli Strami », la rue de la Paille.',
    aRetenir: [
      'Le mot université vient du latin *universitas* : la corporation des maîtres et des étudiants.',
      'Bologne naît vers 1088 pour le droit, Paris vers 1200 pour la théologie.',
      'En 1200, Philippe Auguste accorde aux écoliers de Paris leur premier privilège.',
      'La bulle *Parens scientiarum* de 1231 reconnaît à Paris son autonomie et son droit de grève.',
      'On y enseigne en latin, dans quatre facultés : arts, droit, médecine et théologie.',
      'Le collège fondé par Robert de Sorbon en 1257 deviendra la Sorbonne.',
    ],
    mots: [
      {
        mot: 'Universitas',
        sens: 'En latin, la communauté ou la corporation — ici celle des maîtres et des étudiants.',
      },
      {
        mot: 'Faculté',
        sens: 'Branche d’enseignement de l’université : arts, droit, médecine ou théologie.',
      },
      {
        mot: 'Scolastique',
        sens: 'Méthode d’enseignement où l’on pose une question, expose les objections, puis tranche.',
      },
      {
        mot: 'Collège',
        sens: 'Maison qui loge et nourrit des étudiants pauvres ; celui de Robert de Sorbon deviendra la Sorbonne.',
      },
    ],
    lies: ['thomas-d-aquin', 'saint-louis', 'construction-des-cathedrales', 'grande-peste'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'université',
      'Sorbonne',
      'Bologne',
      'étudiants',
      'latin',
      'scolastique',
      'faculté',
      'doctorat',
      'collège',
      'Abélard',
      'rue du Fouarre',
      'arts libéraux',
    ],
  },
  {
    id: 'guerre-de-cent-ans',
    volet: 'evenements',
    nom: 'La guerre de Cent Ans',
    date: '1337 – 1453',
    tri: 1337,
    fin: 1453,
    periode: 'moyen-age',
    emoji: '🏹',
    lieu: 'De la Flandre à la Guyenne',
    accroche:
      'Cent seize ans de guerre entre deux rois qui se disent tous deux rois de France — et au bout, un royaume ravagé, mais uni et doté d’une armée permanente.',
    citations: [
      {
        texte: 'Dieu et mon droit.',
        qui: 'Édouard III d’Angleterre',
        contexte:
          'Devise prise par le roi d’Angleterre en 1340, quand il écartèle ses armes de celles de France.',
        sens:
          'Il ne réclame pas la France par conquête : il dit en hériter de droit, par sa mère Isabelle, fille de Philippe le Bel. C’est toute la guerre en quatre mots.',
      },
      {
        texte: 'Père, gardez-vous à droite ! Père, gardez-vous à gauche !',
        qui: 'Philippe, fils du roi Jean le Bon',
        contexte:
          'À quatorze ans, combattant aux côtés de son père à Poitiers, le 19 septembre 1356.',
        sens:
          'Le roi est pris, l’enfant aussi ; il en gardera le surnom de « le Hardi » et deviendra duc de Bourgogne — d’où sortira l’alliance qui manquera de perdre la France.',
      },
      {
        texte:
          'Afin que les grandes merveilles et les beaux faits d’armes soient notablement enregistrés et mis en mémoire perpétuelle.',
        qui: 'Jean Froissart, chroniqueur',
        contexte: 'Prologue de ses *Chroniques*, vers 1370.',
        sens:
          'Froissart raconte la guerre comme un tournoi entre chevaliers : c’est notre principale source, et elle regarde tout d’en haut, du côté des seigneurs.',
      },
    ],
    reperes: [
      '1328 : Charles IV meurt sans fils ; les barons écartent Édouard III et choisissent Philippe VI de Valois.',
      'Trois désastres français : Crécy (1346), Poitiers (1356) où le roi est pris, Azincourt (1415).',
      'L’arc long gallois tire douze flèches à la minute : la chevalerie lourde y perd sa supériorité.',
      'Le traité de Troyes (1420) donne la couronne de France au roi d’Angleterre et déshérite le dauphin.',
      '1429 : Jeanne d’Arc délivre Orléans et conduit Charles VII au sacre de Reims.',
      '17 juillet 1453 : Castillon. Les Anglais ne gardent plus que Calais, perdu en 1558.',
    ],
    causes: [
      'Une querelle de succession : en 1328, Édouard III est petit-fils de roi de France par sa mère, mais les barons refusent l’héritage par les femmes.',
      'La Guyenne : le roi d’Angleterre y est duc, donc vassal du roi de France — une situation intenable depuis Aliénor d’Aquitaine.',
      'La Flandre, riche de ses draperies, achète la laine anglaise et dépend du roi de France : les deux couronnes s’y affrontent par marchands interposés.',
      'La confiscation de la Guyenne par Philippe VI en 1337 : Édouard III répond en prenant le titre de roi de France.',
      'Une noblesse qui vit de la guerre et que la paix laisse sans revenu ni emploi.',
      'Un royaume divisé : la Bretagne, la Navarre et surtout la Bourgogne jouent leur propre jeu entre les deux rois.',
    ],
    recit: [
      {
        titre: 'Deux rois pour une couronne',
        texte:
          'En **1328**, **Charles IV** meurt sans fils. Les trois fils de Philippe le Bel sont morts l’un après l’autre sans héritier mâle : une dynastie de trois siècles s’éteint en quatorze ans. Le plus proche parent par le sang est **Édouard III d’Angleterre**, petit-fils de Philippe le Bel par sa mère Isabelle. Les barons français refusent : on ne transmet pas la couronne par les femmes, disent-ils, et ils appellent le cousin **Philippe VI de Valois**. Édouard, seize ans, s’incline et vient même rendre l’**hommage** pour la Guyenne à Amiens en 1329. Tout tient huit ans. En **1337**, Philippe VI prononce la **confiscation de la Guyenne** ; Édouard répond en se proclamant roi de France et en ajoutant les lys à ses armes. La guerre commence en mer, à **L’Écluse** en 1340, où la flotte française est anéantie : les Anglais débarqueront désormais où ils veulent.',
      },
      {
        titre: 'Crécy, Poitiers : la chevalerie tombe',
        texte:
          'Le **26 août 1346**, à **Crécy**, l’armée de Philippe VI charge en désordre une petite armée anglaise retranchée sur une pente. Les **archers gallois**, douze flèches à la minute, hachent les chevaux ; quinze charges se brisent, quinze cents nobles français restent sur le terrain. **Calais** tombe l’année suivante après onze mois de siège. Dix ans plus tard, le **19 septembre 1356** à **Poitiers**, le scénario recommence, mais cette fois le roi **Jean le Bon** est pris et emmené à Londres. Sa rançon est fixée à **trois millions d’écus d’or**, soit plusieurs années de revenus du royaume. Le pays se disloque : à Paris, le prévôt des marchands **Étienne Marcel** tente de gouverner avec les États généraux ; en Beauvaisis, les paysans se soulèvent dans la **Jacquerie** de 1358. Le traité de **Brétigny** (1360) abandonne à l’Angleterre un tiers de la France, en pleine souveraineté.',
      },
      {
        titre: 'Charles V et Du Guesclin reprennent tout',
        texte:
          'Le fils de Jean le Bon, **Charles V**, tire la leçon : on ne gagne plus en bataille rangée. De 1364 à 1380, il fait exactement l’inverse de ses prédécesseurs — il refuse le combat en rase campagne, harcèle, reprend les places une à une, paie ses soldats et les envoie guerroyer en Espagne quand ils pillent. Son connétable, un petit noble breton laid et sans manières nommé **Bertrand du Guesclin**, mène cette guerre d’embuscades que la chevalerie méprise et qui marche. Charles V réorganise l’impôt, bâtit la **Bastille** et une flotte, s’entoure de conseillers formés à l’université. En **1375**, il ne reste aux Anglais que **Calais, Bordeaux et Bayonne**. Tout est repris en dix ans, sans une seule grande bataille livrée.',
      },
      {
        titre: 'La folie du roi, Azincourt, Troyes',
        texte:
          'Tout se défait avec le règne suivant. **Charles VI** devient fou en **1392** ; autour d’un roi absent, deux clans se déchirent pour le pouvoir : les **Armagnacs**, autour du duc d’Orléans, et les **Bourguignons**, autour du duc de Bourgogne. C’est une guerre civile, avec ses assassinats — le duc d’Orléans en 1407, **Jean sans Peur** sur le pont de **Montereau** en 1419. Entre les deux, le **25 octobre 1415**, **Azincourt** : six mille Anglais épuisés, dans un défilé boueux, détruisent une armée française trois fois supérieure qui s’y entasse sans pouvoir manœuvrer ; six mille morts en trois heures, presque toute la noblesse du Nord. Le meurtre de Montereau jette la **Bourgogne** dans l’alliance anglaise, et le **traité de Troyes** du 21 mai **1420** livre la couronne : le dauphin Charles est déclaré illégitime, **Henri V** épouse la fille du roi et lui succédera. Les deux rois meurent en 1422 ; un nourrisson, **Henri VI**, est proclamé roi de France et d’Angleterre.',
      },
      {
        titre: 'Le retournement de 1429 et la fin',
        texte:
          'Le dauphin, replié au sud de la Loire, n’a ni argent ni crédit ; on l’appelle « le roi de Bourges ». En octobre 1428 les Anglais assiègent **Orléans**, dernier verrou du fleuve. Ce qui suit tient en dix-huit mois : **Jeanne d’Arc** fait lever le siège le **8 mai 1429**, la campagne de la Loire s’achève par la victoire de **Patay** (18 juin), et **Charles VII** est sacré à **Reims** le 17 juillet. Le reste est patient. En **1435**, le traité d’**Arras** ramène la Bourgogne dans le camp français : l’Angleterre perd sa jambe continentale. Paris est repris en **1436**. En **1445**, Charles VII crée les **compagnies d’ordonnance**, première armée permanente d’Europe, et confie l’artillerie aux frères **Bureau**. La Normandie tombe en un an (**Formigny**, 1450), la Guyenne à **Castillon** le **17 juillet 1453**, où les canons français écrasent la dernière armée anglaise. Il n’y a pas de traité de paix : la guerre s’arrête, simplement.',
      },
      {
        titre: 'Ce que cent seize ans laissent derrière eux',
        texte:
          'Le bilan matériel est effrayant : villages abandonnés et rendus à la friche, campagnes rançonnées entre deux trêves par les **écorcheurs**, population du royaume tombée de moitié entre la guerre, la peste et les famines. Mais la France qui sort de 1453 n’est pas celle de 1337. Elle a une **armée permanente** payée par le roi, une **artillerie** qui décide des sièges, et un **impôt permanent** — la **taille**, levée chaque année depuis 1439 sans avoir à demander l’accord des états. Les États généraux, qui avaient cru gouverner en 1357, en sortent affaiblis pour trois siècles. Et il s’est formé quelque chose qui n’existait pas : le sentiment d’appartenir à un même pays, parce qu’on s’est battu contre le même ennemi. De l’autre côté de la Manche, l’Angleterre, privée de son empire continental, se déchire aussitôt dans la **guerre des Deux-Roses**.',
      },
    ],
    consequences: [
      'Un royaume ravagé : villages désertés, campagnes pillées par les compagnies, population effondrée avec la peste.',
      'La première armée permanente d’Europe (compagnies d’ordonnance, 1445) et une artillerie décisive.',
      'L’impôt royal devient permanent : la taille est levée chaque année depuis 1439, sans consentement des états.',
      'Le sentiment d’appartenir à un même royaume s’enracine : on se dit français contre les Anglais.',
      'L’Angleterre perd tout son empire continental sauf Calais et bascule dans la guerre des Deux-Roses.',
      'Les États généraux, qui avaient tenté de gouverner en 1357, sortent durablement affaiblis.',
    ],
    chiffres: [
      { valeur: '116 ans', quoi: 'de guerre, de 1337 à 1453' },
      { valeur: '3 millions', quoi: 'd’écus d’or : la rançon du roi Jean le Bon' },
      { valeur: '12', quoi: 'flèches par minute tirées par un archer gallois' },
      { valeur: '6 000', quoi: 'morts français à Azincourt, en trois heures' },
    ],
    chrono: [
      { date: '1328', fait: 'Mort de Charles IV : Philippe VI de Valois est choisi roi.' },
      { date: '1337', fait: 'Confiscation de la Guyenne ; Édouard III se dit roi de France.' },
      { date: '26 août 1346', fait: 'Désastre de Crécy devant les archers anglais.' },
      { date: '19 septembre 1356', fait: 'Poitiers : le roi Jean le Bon est fait prisonnier.' },
      { date: '1360', fait: 'Traité de Brétigny : un tiers du royaume passe aux Anglais.' },
      { date: '1364-1380', fait: 'Charles V et Du Guesclin reprennent presque tout.' },
      { date: '25 octobre 1415', fait: 'Azincourt : la noblesse française est écrasée.' },
      { date: '21 mai 1420', fait: 'Traité de Troyes : le dauphin est déshérité.' },
      { date: '8 mai 1429', fait: 'Jeanne d’Arc fait lever le siège d’Orléans.' },
      { date: '1435', fait: 'Traité d’Arras : la Bourgogne quitte l’alliance anglaise.' },
      { date: '1439', fait: 'La taille devient un impôt permanent.' },
      { date: '17 juillet 1453', fait: 'Castillon : les Anglais quittent la France.' },
    ],
    leSaisTu:
      'À Poitiers, en 1356, le seul des quatre fils du roi resté auprès de lui a quatorze ans. Pendant que la mêlée se referme, il crie à son père d’où viennent les coups : « Père, gardez-vous à droite ! » Ils sont pris tous les deux. On l’appellera Philippe le Hardi, et son père lui donnera la Bourgogne — le duché qui, soixante ans plus tard, s’alliera aux Anglais.',
    aRetenir: [
      'La guerre de Cent Ans oppose les rois de France et d’Angleterre de 1337 à 1453.',
      'Elle naît d’une querelle de succession en 1328 et du statut de la Guyenne, fief anglais en France.',
      'Crécy (1346), Poitiers (1356) et Azincourt (1415) sont trois défaites françaises face aux archers anglais.',
      'Le traité de Troyes (1420) déshérite le dauphin ; Jeanne d’Arc renverse la situation en 1429.',
      'La guerre s’achève à Castillon le 17 juillet 1453 : il ne reste aux Anglais que Calais.',
      'Elle laisse à la France une armée permanente, un impôt permanent et un sentiment national.',
    ],
    mots: [
      {
        mot: 'Fief',
        sens: 'Terre qu’un seigneur reçoit d’un autre contre un serment de fidélité et un service.',
      },
      {
        mot: 'Compagnie d’ordonnance',
        sens: 'Unité de cavalerie payée en permanence par le roi, créée en 1445 : la première armée de métier d’Europe.',
      },
      {
        mot: 'Taille',
        sens: 'Impôt direct levé par le roi, rendu permanent en 1439 pour payer cette armée.',
      },
      {
        mot: 'Écorcheurs',
        sens: 'Bandes de soldats sans solde qui rançonnent les campagnes entre deux trêves.',
      },
    ],
    lies: ['jeanne-d-arc', 'siege-d-orleans', 'sacre-de-charles-vii', 'grande-peste', 'charles-vii'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Cent Ans',
      'Crécy',
      'Poitiers',
      'Azincourt',
      'Castillon',
      'Valois',
      'Plantagenêt',
      'Guyenne',
      'Du Guesclin',
      'archers',
      'Troyes',
      'Calais',
    ],
  },
  {
    id: 'grande-peste',
    volet: 'evenements',
    nom: 'La Grande Peste',
    date: '1347 – 1352',
    tri: 1347,
    fin: 1352,
    periode: 'moyen-age',
    emoji: '🐀',
    lieu: 'De la mer Noire à l’Europe entière',
    accroche:
      'En cinq ans, la peste noire emporte un Européen sur trois : vingt-cinq millions de morts, et un continent qui mettra un siècle et demi à s’en relever.',
    citations: [
      {
        texte:
          'Combien de vaillants hommes, combien de belles dames dînèrent le matin avec leurs parents et leurs amis, et le soir venu soupèrent avec leurs ancêtres en l’autre monde.',
        qui: 'Boccace',
        contexte:
          'Introduction du *Décaméron*, écrit à Florence peu après l’épidémie de 1348, qu’il a vue.',
        sens:
          'La brutalité est ce qui frappe les témoins : on mourait dans la journée, et il n’y avait pas de temps pour les adieux.',
      },
      {
        texte:
          'Et moi, Agnolo di Tura, dit le Gras, j’ai enterré mes cinq enfants de mes propres mains. Et nul ne pleurait les morts, car tous attendaient la mort.',
        qui: 'Agnolo di Tura, chroniqueur de Sienne',
        contexte: 'Chronique de Sienne, 1348, où la ville perd la moitié de ses habitants.',
      },
      {
        texte:
          'Elle fut honteuse pour les médecins, qui n’osaient visiter les malades de peur d’être infectés ; et quand ils les visitaient, ils ne faisaient presque rien.',
        qui: 'Guy de Chauliac, médecin du pape Clément VI',
        contexte: 'Dans sa *Grande Chirurgie*, sur l’épidémie d’Avignon, qu’il a soignée et survécue.',
        sens:
          'Le meilleur médecin d’Occident constate que sa science ne sert à rien. Il reste pourtant à Avignon, et attrape la peste sans en mourir.',
      },
    ],
    reperes: [
      'Octobre 1347 : douze galères venues de Caffa accostent à Messine ; la peste entre en Europe.',
      'Deux formes : bubonique, mortelle en cinq jours ; pulmonaire, qui se respire et tue en deux.',
      'Elle se transmet par la puce du rat noir, passager des navires et des greniers — on l’ignore alors.',
      'Un Européen sur trois meurt entre 1347 et 1352 : environ vingt-cinq millions de personnes.',
      'On accuse l’air corrompu, les astres, les péchés — et, en 1348-1349, les communautés juives, massacrées.',
      'Elle revient tous les dix ou quinze ans ; Marseille, en 1720, connaîtra la dernière en France.',
    ],
    causes: [
      'Un bacille venu des steppes d’Asie centrale, transporté par la puce du rat noir, que personne ne peut alors identifier.',
      'Les routes de la soie et les galères génoises, qui relient la mer Noire à la Méditerranée en quelques semaines.',
      'Le siège de Caffa, en Crimée, où les assiégeants catapultent leurs morts par-dessus les murailles en 1346.',
      'Une Europe surpeuplée : la population a doublé depuis l’an mil, les villes sont denses, sales et sans égouts.',
      'Une génération déjà affaiblie par la grande famine de 1315-1317 et une suite de mauvaises récoltes.',
      'Une médecine impuissante, qui explique les épidémies par l’air vicié et la conjonction des planètes.',
    ],
    recit: [
      {
        titre: 'De Caffa à Messine',
        texte:
          'En **1346**, une armée mongole assiège le comptoir génois de **Caffa**, en Crimée. La maladie est déjà dans son camp ; le chroniqueur **Gabriele de’ Mussis** raconte que les assiégeants catapultent leurs cadavres par-dessus les murs. Les Génois rembarquent et fuient. Ce qu’ils emportent dans leurs cales, avec le grain et les rats, met un an à faire le tour du monde connu. **Octobre 1347** : douze galères accostent à **Messine**, en Sicile ; on les chasse, trop tard. **Novembre** : **Marseille**. **Janvier 1348** : **Avignon**, où siège le pape. Puis Florence et Paris au printemps, l’Angleterre à l’automne 1348, la Scandinavie en 1349, la Russie en 1352. Par voie de terre, la peste avance de deux à quatre kilomètres par jour, à l’allure des convois ; par mer, elle saute d’un port à l’autre en une semaine. En cinq ans, elle n’a pratiquement rien épargné entre l’Islande et le Caire.',
      },
      {
        titre: 'Ce que voit un contemporain',
        texte:
          'La forme la plus répandue commence par une fièvre brutale et des douleurs, puis par l’apparition de **bubons** — des ganglions enflés à l’aine, à l’aisselle ou au cou, parfois gros comme un œuf, et d’une douleur insupportable. Viennent des taches sombres sous la peau, d’où le nom de **peste noire** que lui donneront les siècles suivants. La mort survient en trois à cinq jours, dans la moitié à quatre cinquièmes des cas. L’autre forme, **pulmonaire**, se transmet par la respiration, ne laisse pas de bubon et tue en moins de deux jours : elle est mortelle presque à coup sûr. Les villes se vident de tous ceux qui peuvent partir ; les corps s’entassent, on creuse des **fosses communes** où les couches de morts alternent avec la terre « comme le fromage sur les lasagnes », écrit un témoin florentin. Des villages entiers cessent simplement d’exister.',
      },
      {
        titre: 'Ce qu’on croit, ce qu’on tente',
        texte:
          'En octobre **1348**, **Philippe VI** demande à la **faculté de médecine de Paris** un rapport officiel. Réponse des docteurs : la conjonction de Saturne, Jupiter et Mars du 20 mars 1345 a corrompu l’air, et ce **mauvais air** — les *miasmes* — transporte la maladie. Le raisonnement est faux mais pas absurde : il conduit à des mesures qui, par hasard, fonctionnent un peu. On brûle des herbes odorantes, on lave au vinaigre, on isole, et surtout on applique la règle des médecins : *cito, longe, tarde* — partir vite, aller loin, revenir tard. Le pape **Clément VI** s’enferme à Avignon entre deux grands feux, sur le conseil de Guy de Chauliac, et survit. D’autres réponses aggravent tout : les processions rassemblent, et les **flagellants**, qui parcourent l’Allemagne en se fouettant par bandes de plusieurs centaines, transportent la contagion de ville en ville. Le masque à bec, lui, n’existe pas encore : il date du XVIIᵉ siècle.',
      },
      {
        titre: 'Chercher des coupables',
        texte:
          'Faute d’explication, on cherche une main. La rumeur d’un empoisonnement des puits se répand dès 1348 le long du Rhône, arrachée par la torture à quelques accusés, et remonte le Rhin de ville en ville. À **Strasbourg**, le **14 février 1349**, plusieurs centaines de Juifs sont brûlés — et l’épidémie n’avait pas encore atteint la ville. Bâle, Mayence, Cologne, Erfurt suivent ; des dizaines de communautés disparaissent, et les survivants s’exilent vers la Pologne. L’Église prend position contre : par deux bulles, en juillet puis en **septembre 1348**, **Clément VI** interdit ces violences sous peine d’excommunication, rappelle que les Juifs meurent de la peste comme tout le monde et les fait protéger dans Avignon. Les bulles ne sont presque pas suivies. C’est l’un des épisodes les plus noirs du siècle, et il n’a pas été provoqué par la maladie : il a été provoqué par la peur.',
      },
      {
        titre: 'Le monde d’après',
        texte:
          'Quand l’épidémie s’éteint en 1352, il manque un tiers des Européens. La France passe d’environ dix-sept à dix millions d’habitants, en comptant la guerre ; l’Europe ne retrouvera son niveau de 1340 que vers **1500**. Des milliers de villages sont abandonnés et rendus à la forêt. Or il reste autant de terres et beaucoup moins de bras : les **salaires montent**, les paysans négocient, le **servage** achève de reculer en Europe de l’Ouest. Les seigneurs tentent de bloquer les gains par la loi — le *Statute of Labourers* anglais de 1351 —, et récoltent les grandes révoltes du siècle : la **Jacquerie** de 1358, les Ciompi de Florence en 1378, **Wat Tyler** en Angleterre en 1381. La peur, elle, reste dans les images : **danses macabres** peintes sur les murs des cimetières, gisants décharnés, manuels de « l’art de bien mourir ». Et une invention qui nous sert encore : en **1377**, Raguse impose aux navires suspects trente jours d’attente au large, portés bientôt à quarante — la **quarantaine**.',
      },
    ],
    consequences: [
      'L’Europe perd près d’un tiers de sa population ; elle ne retrouvera son niveau de 1340 que vers 1500.',
      'Des milliers de villages sont désertés et rendus à la friche ou à la forêt.',
      'La main-d’œuvre manque : les salaires montent et le servage recule en Europe de l’Ouest.',
      'Les seigneurs tentent de bloquer les salaires, d’où les grandes révoltes (Jacquerie 1358, Wat Tyler 1381).',
      'Naissance des mesures sanitaires : quarantaine à Raguse en 1377, lazarets, cordons sanitaires.',
      'Une culture hantée par la mort : danses macabres, gisants décharnés, art de bien mourir.',
      'Des communautés juives massacrées en 1348-1349, malgré les bulles de Clément VI qui les défendent.',
    ],
    chiffres: [
      { valeur: '25 millions', quoi: 'de morts en Europe en cinq ans' },
      { valeur: '1 sur 3', quoi: 'Européen emporté par l’épidémie' },
      { valeur: '5 jours', quoi: 'entre les premiers bubons et la mort' },
      { valeur: '40 jours', quoi: 'la quarantaine, inventée à Raguse en 1377' },
    ],
    chrono: [
      { date: '1315-1317', fait: 'Grande famine : l’Europe entre affaiblie dans le siècle.' },
      { date: '1346', fait: 'Siège de Caffa, en Crimée : la peste passe aux Génois.' },
      { date: 'octobre 1347', fait: 'Douze galères la débarquent à Messine, en Sicile.' },
      { date: 'novembre 1347', fait: 'Marseille, première ville de France touchée.' },
      { date: 'janvier 1348', fait: 'Avignon : le pape s’enferme entre deux grands feux.' },
      { date: 'octobre 1348', fait: 'La faculté de Paris accuse la conjonction des planètes.' },
      { date: '14 février 1349', fait: 'Massacre de la communauté juive de Strasbourg.' },
      { date: '1349', fait: 'L’épidémie atteint l’Angleterre et la Scandinavie.' },
      { date: '1352', fait: 'Elle s’éteint, après un Européen sur trois.' },
      { date: '1377', fait: 'Raguse invente la quarantaine pour les navires.' },
    ],
    leSaisTu:
      'Le médecin au long bec rempli d’herbes, l’image même de la peste, n’a jamais croisé la Grande Peste : ce costume est inventé vers 1619 par Charles de Lorme, médecin de Louis XIII, presque trois siècles plus tard. En 1348, le médecin arrivait habillé comme tout le monde — et repartait souvent avec la maladie.',
    aRetenir: [
      'La Grande Peste entre en Europe par Messine en octobre 1347, venue de la mer Noire.',
      'Elle est due à un bacille transmis par la puce du rat noir, ce qu’on ignore totalement à l’époque.',
      'Elle tue environ un Européen sur trois entre 1347 et 1352, soit près de vingt-cinq millions de personnes.',
      'On l’explique par l’air corrompu et les astres ; on accuse aussi les Juifs, massacrés en 1348-1349.',
      'Le manque de bras fait monter les salaires et affaiblit le servage en Europe de l’Ouest.',
      'La quarantaine est inventée à Raguse en 1377 pour s’en protéger.',
    ],
    mots: [
      {
        mot: 'Bubon',
        sens: 'Ganglion enflé, parfois gros comme un œuf, à l’aine ou sous le bras : le signe de la peste.',
      },
      {
        mot: 'Miasme',
        sens: 'Air corrompu, tenu au Moyen Âge pour la cause des épidémies.',
      },
      {
        mot: 'Quarantaine',
        sens: 'Isolement de quarante jours imposé aux navires venus d’un port contaminé.',
      },
      {
        mot: 'Servage',
        sens: 'Condition du paysan attaché à la terre de son seigneur, qu’il ne peut pas quitter.',
      },
    ],
    lies: ['guerre-de-cent-ans', 'construction-des-cathedrales', 'naissance-des-universites'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'peste noire',
      'épidémie',
      'bubons',
      'Messine',
      'Boccace',
      'Décaméron',
      'quarantaine',
      'rat',
      'Caffa',
      'flagellants',
      'servage',
      'danse macabre',
    ],
  },
  {
    id: 'siege-d-orleans',
    volet: 'evenements',
    nom: 'Le siège d’Orléans',
    date: '12 octobre 1428 – 8 mai 1429',
    tri: 1429,
    fin: 1429,
    periode: 'moyen-age',
    emoji: '🛡️',
    lieu: 'Orléans, sur la Loire',
    accroche:
      'Si Orléans tombe, la Loire est franchie et le royaume perdu. En neuf jours, une fille de dix-sept ans fait lever un siège qui durait depuis sept mois.',
    citations: [
      {
        texte:
          'Vous avez été en votre conseil, et je suis venue de la part de Dieu au mien, qui est plus sûr et meilleur que le vôtre.',
        qui: 'Jeanne d’Arc, au Bâtard d’Orléans',
        contexte:
          'À Chécy, le 29 avril 1429, quand les capitaines lui apprennent qu’ils l’ont fait venir par la mauvaise rive.',
        sens:
          'Elle vient d’arriver et conteste déjà le plan des professionnels. C’est cette assurance-là, plus que ses armes, qui remet une armée en mouvement.',
      },
      {
        texte: 'Glasidas, Glasidas, rends-toi au Roi du Ciel !',
        qui: 'Jeanne d’Arc, au capitaine anglais des Tourelles',
        contexte:
          'Depuis le fossé du fort, le 7 mai 1429. Glasdale se noie dans la Loire quelques heures plus tard, sa passerelle rompue.',
      },
      {
        texte:
          'Il tomba sur vos gens, par la main de Dieu semble-t-il, un grand coup — causé en grande partie par la crainte qu’ils avaient d’un disciple et membre du Malin, appelé la Pucelle.',
        qui: 'Jean de Bedford, régent anglais de France',
        contexte: 'Lettre au roi Henri VI, en 1434, pour expliquer le retournement de 1429.',
        sens:
          'Le chef de l’armée anglaise reconnaît lui-même que ses hommes ont d’abord été battus dans leur tête.',
      },
    ],
    reperes: [
      '12 octobre 1428 : les Anglais mettent le siège devant la dernière grande ville fidèle au dauphin.',
      'Orléans tient le seul pont sur la Loire entre Blois et Gien : c’est la porte du sud du royaume.',
      'Les assiégeants n’encerclent pas la ville : ils tiennent une douzaine de bastilles autour d’elle.',
      '12 février 1429 : la journée des Harengs, où un convoi anglais écrase l’armée de secours française.',
      '29 avril 1429 : Jeanne d’Arc entre au soir par la porte de Bourgogne, à la lueur des torches.',
      '8 mai 1429 : les Anglais lèvent le siège ; Orléans fête la date chaque année depuis 1430.',
    ],
    causes: [
      'Le traité de Troyes (1420) a déshérité le dauphin Charles : les Anglais veulent achever la conquête du royaume.',
      'Orléans commande le dernier pont sur la Loire tenu par les Français ; la ville est la clé de tout le sud.',
      'Le duc d’Orléans est prisonnier des Anglais depuis Azincourt : attaquer sa ville rompt les usages de la chevalerie.',
      'Le dauphin n’a ni argent, ni armée sûre, ni sacre ; ses capitaines refusent la bataille depuis dix ans.',
      'L’échec de la journée des Harengs, le 12 février 1429, ôte à la ville tout espoir de secours ordinaire.',
      'L’arrivée de Jeanne d’Arc avec un convoi de vivres rend l’offensive à une armée qui n’y croyait plus.',
    ],
    recit: [
      {
        titre: 'La clé du royaume',
        texte:
          'Regardez une carte de 1428 : les Anglais et leurs alliés bourguignons tiennent tout le nord, Paris compris ; le dauphin tient le sud. Entre les deux, la **Loire**, et sur la Loire un seul grand pont encore français, celui d’**Orléans** — dix-neuf arches, gardé à son extrémité sud par un fort à deux tours, les **Tourelles**. Prendre Orléans, c’est franchir le fleuve et n’avoir plus rien devant soi jusqu’à Bourges. Le comte de **Salisbury** ouvre le siège le **12 octobre 1428** et enlève les Tourelles en douze jours. Mais le **27 octobre**, penché à une fenêtre du fort qu’il vient de conquérir, il est emporté par un boulet tiré de la ville. C’est **Suffolk**, puis **Talbot** et **Glasdale**, qui continuent. La ville, elle, est prête : soixante-dix canons, un maître canonnier réputé, des murailles refaites, et une milice bourgeoise qui sait s’en servir.',
      },
      {
        titre: 'Sept mois de siège percé',
        texte:
          'Faute d’hommes — quatre à cinq mille, pour une ville de vingt mille habitants et cinq kilomètres de remparts —, les Anglais renoncent à l’encerclement. Ils construisent une douzaine de **bastilles**, forts de bois et de terre, et se contentent de tenir les routes. Le blocus fuit de partout : des bateaux remontent la Loire, des convois entrent par la porte de Bourgogne, les assiégés font des sorties. La guerre de siège se joue au canon, de part et d’autre. Le seul vrai coup dur tombe le **12 février 1429** : une armée française et écossaise attaque près de Rouvray un convoi anglais chargé de tonneaux de **harengs** salés pour le carême ; Fastolf met ses chariots en cercle, ses archers derrière, et le secours est écrasé. C’est la **journée des Harengs**. Orléans propose alors de se rendre au duc de Bourgogne plutôt qu’aux Anglais ; Bedford refuse, et le duc, vexé, retire ses troupes. La ville tient, mais elle ne croit plus à rien.',
      },
      {
        titre: 'Le 29 avril, à la lueur des torches',
        texte:
          'Jeanne est partie de **Blois** le 25 avril avec un convoi de vivres et quelques milliers d’hommes. Elle croyait arriver sur la rive nord, face aux bastilles ; les capitaines l’ont menée par le sud, là où il faudra traverser. Elle le leur reproche durement. Sur place, à **Chécy**, un autre obstacle : le vent contraire empêche les bateaux de remonter le fleuve pour charger le ravitaillement. **Jean de Dunois**, le Bâtard d’Orléans, racontera vingt-sept ans plus tard, au procès en réhabilitation, que le vent tourna au moment même où elle arrivait, et que c’est de là qu’il commença à croire en elle. Le soir du **29 avril 1429**, Jeanne entre dans Orléans par la **porte de Bourgogne**, en armure blanche, sur un cheval, sa bannière portée devant elle, la foule si pressée qu’une torche met le feu à son étendard. Elle n’a encore livré aucun combat.',
      },
      {
        titre: 'Neuf jours, bastille après bastille',
        texte:
          'Le **4 mai**, pendant qu’elle dort, les capitaines attaquent sans la prévenir la bastille **Saint-Loup**. Elle se réveille en sursaut, réclame son cheval — « le sang de France est répandu » —, arrive dans la bataille ; la bastille tombe. Le **5 mai**, jour de l’Ascension, elle fait trêve et dicte une dernière sommation aux Anglais. Le **6 mai**, on passe sur l’autre rive et on enlève le couvent fortifié des **Augustins**. Le **7 mai** au matin commence l’assaut des **Tourelles**, le vrai verrou. Vers midi, Jeanne est atteinte d’une flèche à l’épaule, au-dessus du sein ; on l’emporte, elle arrache le trait elle-même, se fait panser et revient au soir, au moment où les capitaines voulaient sonner la retraite : « Tout est vôtre, entrez ! » Les assiégés d’Orléans attaquent en même temps par le pont, avec un brûlot poussé sous la passerelle. Les Tourelles tombent ; **Glasdale** se noie sous le poids de son armure. Le **8 mai** au matin, les Anglais sortent de leurs bastilles et se rangent en bataille ; Jeanne refuse de combattre un dimanche. Ils s’en vont.',
      },
      {
        titre: 'Ce que le 8 mai déclenche',
        texte:
          'Depuis **Azincourt**, quatorze ans plus tôt, aucune armée française n’avait osé affronter les Anglais en rase campagne. En six semaines, tout bascule : **Jargeau** le 12 juin, **Meung**, **Beaugency**, et le **18 juin** la victoire de **Patay**, où la cavalerie française surprend les archers anglais avant qu’ils aient planté leurs pieux et détruit leur armée en une heure ; Talbot est fait prisonnier. La route du nord-est est ouverte : Jeanne obtient du dauphin la chevauchée jusqu’à **Reims**, et le **17 juillet 1429**, Charles est sacré. Le régent **Bedford** écrira lui-même à Londres que ses hommes ont été battus par la peur. Orléans, elle, n’a pas oublié : la ville célèbre la levée du siège chaque **8 mai** depuis 1430, et c’est la plus ancienne fête civique de France.',
      },
    ],
    consequences: [
      'La Loire n’est pas franchie : le royaume du dauphin est sauvé au moment où il allait tomber.',
      'La campagne de la Loire suit aussitôt : Jargeau, Meung, Beaugency, puis Patay le 18 juin 1429.',
      'La route de Reims s’ouvre : Charles VII est sacré le 17 juillet 1429.',
      'L’armée anglaise perd la réputation d’invincibilité acquise à Azincourt quatorze ans plus tôt.',
      'Jeanne d’Arc devient « la Pucelle d’Orléans », un nom qui la suivra jusqu’au bûcher et au-delà.',
      'Orléans célèbre la levée du siège chaque 8 mai depuis 1430 : la plus ancienne fête civique de France.',
    ],
    chiffres: [
      { valeur: '7 mois', quoi: 'de siège, du 12 octobre 1428 au 8 mai 1429' },
      { valeur: '9 jours', quoi: 'entre l’arrivée de Jeanne et la levée du siège' },
      { valeur: '5 000', quoi: 'assiégeants anglais, répartis en une douzaine de bastilles' },
      { valeur: '19', quoi: 'arches au pont d’Orléans, l’enjeu de toute la bataille' },
    ],
    chrono: [
      { date: '12 octobre 1428', fait: 'Les Anglais mettent le siège devant Orléans.' },
      { date: '27 octobre 1428', fait: 'Salisbury, chef du siège, est tué par un boulet.' },
      { date: '12 février 1429', fait: 'Journée des Harengs : l’armée de secours est battue.' },
      { date: '29 avril 1429', fait: 'Jeanne d’Arc entre dans la ville au soir.' },
      { date: '4 mai 1429', fait: 'Prise de la bastille Saint-Loup.' },
      { date: '6 mai 1429', fait: 'Prise du couvent fortifié des Augustins.' },
      { date: '7 mai 1429', fait: 'Assaut des Tourelles ; Jeanne, blessée, revient au combat.' },
      { date: '8 mai 1429', fait: 'Les Anglais lèvent le siège et s’en vont.' },
      { date: '18 juin 1429', fait: 'Victoire de Patay : la campagne de la Loire est gagnée.' },
    ],
    leSaisTu:
      'Le 29 avril, les bateaux ne pouvaient pas remonter la Loire : le vent soufflait contre eux et le ravitaillement restait à quai. Au procès de 1456, Dunois, le chef militaire d’Orléans, témoigna sous serment que le vent avait tourné à l’instant où Jeanne arriva sur la rive — et que c’est à partir de ce moment qu’il l’avait crue envoyée de Dieu.',
    aRetenir: [
      'Le siège d’Orléans dure du 12 octobre 1428 au 8 mai 1429.',
      'Orléans tient le dernier pont sur la Loire aux mains des Français : sa chute livrerait le sud du royaume.',
      'Jeanne d’Arc entre dans la ville le 29 avril 1429 et fait lever le siège neuf jours plus tard.',
      'La prise des Tourelles, le 7 mai, décide de l’affaire ; Jeanne y est blessée d’une flèche.',
      'La victoire ouvre la campagne de la Loire, la victoire de Patay et la route du sacre de Reims.',
    ],
    mots: [
      {
        mot: 'Bastille',
        sens: 'Ici, petit fort de bois et de terre bâti par les assiégeants autour d’une ville.',
      },
      {
        mot: 'Boulevard',
        sens: 'Ouvrage de terre avancé qui protège l’entrée d’un pont ou d’une porte.',
      },
      {
        mot: 'Pucelle',
        sens: 'Jeune fille vierge ; c’est ainsi que Jeanne se nommait elle-même dans ses lettres.',
      },
    ],
    lies: ['jeanne-d-arc', 'guerre-de-cent-ans', 'sacre-de-charles-vii', 'bucher-de-rouen'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Orléans',
      'Loire',
      'Tourelles',
      'Jeanne d’Arc',
      'Pucelle',
      'Dunois',
      'Talbot',
      'Glasdale',
      'siège',
      'Patay',
      '8 mai',
      'bastilles',
    ],
  },
  {
    id: 'sacre-de-charles-vii',
    volet: 'evenements',
    nom: 'Le sacre de Charles VII',
    date: '17 juillet 1429',
    tri: 1429,
    periode: 'moyen-age',
    emoji: '👑',
    lieu: 'Cathédrale de Reims',
    accroche:
      'Trois cents kilomètres de terres ennemies traversés pour un rite d’une matinée — mais sans Reims et sans l’huile sainte, il n’y a pas de roi de France.',
    citations: [
      {
        texte:
          'Gentil roi, ores est fait le plaisir de Dieu, qui voulait que vous vinssiez à Reims recevoir votre digne sacre, en montrant que vous êtes vrai roi.',
        qui: 'Jeanne d’Arc',
        contexte: 'Au roi, dans la cathédrale de Reims, après l’onction, le 17 juillet 1429.',
        sens:
          'Elle avait annoncé deux choses à Chinon : délivrer Orléans et faire sacrer le dauphin. Les deux sont faites en soixante-dix jours.',
      },
      {
        texte: 'Il avait été à la peine, c’était bien raison qu’il fût à l’honneur.',
        qui: 'Jeanne d’Arc',
        contexte:
          'À ses juges de Rouen, en 1431, à qui l’on demandait pourquoi sa bannière était dans la cathédrale au sacre.',
        sens:
          'L’étendard avait traversé tous les assauts : il avait sa place à la cérémonie. La réponse est aussi une manière de dire qu’elle-même y avait la sienne.',
      },
      {
        texte: 'Je t’oins roi de cette huile sanctifiée, au nom du Père, du Fils et du Saint-Esprit.',
        qui: 'Regnault de Chartres, archevêque de Reims',
        contexte: 'Formule de l’onction, cathédrale de Reims, matinée du 17 juillet 1429.',
        sens:
          'C’est l’onction, et non la couronne, qui fait le roi de France : elle le sépare de tous les autres princes chrétiens.',
      },
      {
        texte:
          'Faites bonne paix ferme qui dure longuement. Pardonnez l’un à l’autre de bon cœur, entièrement, ainsi que doivent faire loyaux chrétiens.',
        qui: 'Jeanne d’Arc',
        contexte:
          'Lettre dictée au duc de Bourgogne Philippe le Bon, à Reims, le jour même du sacre.',
        sens:
          'Le jour de son triomphe, elle écrit à l’allié des Anglais pour lui proposer la paix. La réconciliation des Français passera avant la reconquête.',
      },
    ],
    reperes: [
      'Depuis le baptême de Clovis, vers 496, c’est à Reims que les rois de France reçoivent l’onction.',
      'La Sainte Ampoule, gardée à Saint-Rémi, passe pour avoir été apportée par une colombe à ce baptême.',
      'Déshérité par le traité de Troyes en 1420, Charles a besoin du sacre pour être reconnu roi.',
      'La chevauchée de Gien à Reims traverse plus de 300 km de terres bourguignonnes, du 29 juin au 16 juillet.',
      'Auxerre, Troyes et Châlons ouvrent leurs portes ; aucune grande bataille n’est livrée.',
      'Jeanne d’Arc se tient près de l’autel, sa bannière à la main, pendant toute la cérémonie.',
    ],
    causes: [
      'Le traité de Troyes (1420) a déclaré le dauphin illégitime et promis la couronne au roi d’Angleterre.',
      'On l’appelle « le roi de Bourges » : sans sacre, ses propres sujets hésitent à le reconnaître pour roi.',
      'Depuis Clovis, la tradition veut que le roi de France soit oint à Reims de l’huile de la Sainte Ampoule.',
      'La levée du siège d’Orléans (8 mai) puis la victoire de Patay (18 juin) ouvrent militairement la route du nord-est.',
      'Jeanne d’Arc impose le sacre contre l’avis du conseil, qui préférait reprendre la Normandie ou marcher sur Paris.',
      'Le duc de Bourgogne, maître du pays à traverser, hésite à s’engager et laisse les villes ouvrir leurs portes.',
    ],
    recit: [
      {
        titre: 'Pourquoi Reims, et pas Paris',
        texte:
          'Un roi de France n’est pas seulement couronné : il est **oint**. Le geste vient de la Bible, où les prophètes versent l’huile sur la tête des rois d’Israël, et il s’attache à **Reims** parce que **Clovis** y fut baptisé vers 496 par saint Remi. Au IXᵉ siècle, l’archevêque Hincmar donne à ce baptême sa légende : une **colombe** aurait apporté du ciel une fiole d’huile, la **Sainte Ampoule**, conservée depuis à l’abbaye Saint-Rémi et jamais épuisée. L’onction fait du roi un personnage à part, presque un évêque : c’est d’elle que vient le pouvoir de **toucher les écrouelles**, ces ganglions du cou que le roi guérissait, disait-on, d’un signe de croix — « le roi te touche, Dieu te guérit ». Trente-trois rois seront sacrés dans cette cathédrale, de 816 à 1825. Sans Reims, on est un prétendant ; avec Reims, on est le roi.',
      },
      {
        titre: 'Le « roi de Bourges »',
        texte:
          'Charles est né en 1403, cinquième fils de **Charles VI** : rien ne le destinait au trône, et quatre frères morts l’y ont porté à quatorze ans. Puis tout s’écroule. En 1419, l’assassinat de **Jean sans Peur** sur le pont de Montereau, en sa présence, jette la **Bourgogne** dans l’alliance anglaise. Le **21 mai 1420**, le **traité de Troyes** le déclare indigne de la couronne — sa propre mère, Isabeau de Bavière, contresigne — et donne la France à **Henri V** et à ses descendants. En 1422, son père meurt ; Charles prend le titre de roi à Mehun-sur-Yèvre, sans sacre, sans Reims, sans argent. Sa cour erre entre Bourges et Chinon, ses soldats ne sont pas payés, ses conseillers se déchirent, et l’on raconte qu’il doute lui-même d’être fils de roi. Ses ennemis l’appellent « le roi de Bourges », et beaucoup de Français le pensent aussi.',
      },
      {
        titre: 'La chevauchée du sacre',
        texte:
          'Après **Patay**, Jeanne réclame Reims. Le conseil s’y oppose : la ville est à trois cents kilomètres, en plein pays bourguignon, derrière une douzaine de places fortes, et l’on n’a ni argent ni matériel de siège. Elle obtient gain de cause. L’armée part de **Gien** le **29 juin 1429**, douze mille hommes. La chevauchée réussit par la négociation plus que par les armes : **Auxerre** achète sa tranquillité en ravitaillant l’armée, les petites villes ouvrent. Seule **Troyes** — la ville même du traité — ferme ses portes. Le siège s’éternise cinq jours, le conseil parle de rebrousser chemin ; Jeanne fait combler le fossé de fagots, de portes, de tables, de tout ce qui traîne, et donne l’ordre de l’assaut. La ville capitule le **10 juillet**. **Châlons** suit le 14, **Reims** ouvre ses portes le **16 juillet** au soir. En dix-huit jours, on a traversé l’ennemi sans bataille.',
      },
      {
        titre: 'La matinée du 17 juillet',
        texte:
          'Tout est improvisé en une nuit. Les **regalia** — la couronne, les éperons, le sceptre, l’épée dite **Joyeuse** — sont à **Saint-Denis**, en zone anglaise : on prend ce que Reims possède. Au matin du **dimanche 17 juillet**, quatre barons vont chercher la **Sainte Ampoule** à Saint-Rémi et la portent à cheval jusque dans la cathédrale. Le roi prête le **serment** : protéger l’Église, faire régner la paix et la justice, interdire les injustices à tous. L’archevêque **Regnault de Chartres** l’oint en neuf endroits du corps, avec une aiguille d’or qui prélève une goutte d’huile mêlée au saint chrême. Viennent les éperons, l’épée, l’anneau, le sceptre et la main de justice, puis la couronne, soutenue par les **pairs** présents. Les trompettes sonnent si fort, dit un témoin, que les voûtes semblent se fendre, et la foule crie « Noël ! ». Près de l’autel, Jeanne tient sa bannière. Charles VI est mort depuis sept ans ; la France a enfin un roi.',
      },
      {
        titre: 'Ce que le sacre change, et ce qu’il ne change pas',
        texte:
          'Dans les semaines qui suivent, les ralliements tombent sans combat : **Laon, Soissons, Château-Thierry, Compiègne, Beauvais** reconnaissent le roi sacré. Les Anglais mesurent le coup et tentent d’y répondre : le **16 décembre 1431**, ils font couronner l’enfant **Henri VI** à **Notre-Dame de Paris** — mais sans Reims, sans la Sainte Ampoule, avec un cardinal anglais, et les Parisiens trouvent la fête chiche. Le sacre ne gagne cependant pas la guerre : l’assaut sur Paris échoue en septembre 1429, la cour préfère négocier, et **Jeanne** est écartée du conseil avant d’être prise à Compiègne en mai 1430. Le reste viendra lentement et sûrement : la Bourgogne revient au traité d’**Arras** en 1435, Paris est repris en **1436**, la guerre gagnée en **1453**. « Le roi de Bourges » finira son règne sous le nom de **Charles VII le Victorieux**.',
      },
    ],
    consequences: [
      'Charles VII est désormais le roi sacré : le roi d’Angleterre n’est plus, en France, qu’un prétendant.',
      'Des villes entières se rallient sans combat : Laon, Soissons, Compiègne, Beauvais, Château-Thierry.',
      'Les Anglais répliquent en couronnant Henri VI à Paris le 16 décembre 1431, sans Reims ni Sainte Ampoule.',
      'Le duc de Bourgogne commence à douter de l’alliance anglaise ; il la quittera au traité d’Arras en 1435.',
      'Jeanne d’Arc a rempli la mission qu’elle avait annoncée ; l’échec devant Paris l’éloigne du conseil du roi.',
      'Charles VII reprendra Paris en 1436 et achèvera la guerre en 1453 : on l’appellera « le Victorieux ».',
    ],
    chiffres: [
      { valeur: '33', quoi: 'rois de France sacrés à Reims, de 816 à 1825' },
      { valeur: '300 km', quoi: 'de chevauchée en terre ennemie, de Gien à Reims' },
      { valeur: '9', quoi: 'onctions de l’huile sainte sur le corps du roi' },
      { valeur: '5 jours', quoi: 'de résistance de Troyes, seule ville à fermer ses portes' },
    ],
    chrono: [
      { date: 'vers 496', fait: 'Baptême de Clovis à Reims : l’origine de la tradition.' },
      { date: '21 mai 1420', fait: 'Traité de Troyes : le dauphin Charles est déshérité.' },
      { date: '8 mai 1429', fait: 'Levée du siège d’Orléans.' },
      { date: '18 juin 1429', fait: 'Victoire de Patay : la route du nord-est s’ouvre.' },
      { date: '29 juin 1429', fait: 'Départ de Gien pour Reims, avec douze mille hommes.' },
      { date: '10 juillet 1429', fait: 'Troyes ouvre ses portes après cinq jours.' },
      { date: '16 juillet 1429', fait: 'Charles entre dans Reims au soir.' },
      { date: '17 juillet 1429', fait: 'Sacre et couronnement dans la cathédrale.' },
      { date: '16 décembre 1431', fait: 'Henri VI est couronné à Paris, sans la Sainte Ampoule.' },
      { date: '1453', fait: 'Fin de la guerre : Charles VII est dit « le Victorieux ».' },
    ],
    leSaisTu:
      'Le lendemain du sacre, Charles VII fit ce que faisaient tous les rois de France au sortir de Reims : il se rendit à Corbeny et toucha les malades des écrouelles, en disant « le roi te touche, Dieu te guérit ». Il y en eut plusieurs centaines. Pour ceux qui étaient là, c’était la preuve que l’onction avait pris.',
    aRetenir: [
      'Charles VII est sacré à Reims le 17 juillet 1429, deux mois après la levée du siège d’Orléans.',
      'Le sacre à Reims remonte au baptême de Clovis ; l’onction de la Sainte Ampoule fait le roi de France.',
      'Déshérité par le traité de Troyes en 1420, Charles avait besoin du sacre pour être reconnu.',
      'La chevauchée de Gien à Reims traverse 300 km de terres bourguignonnes sans grande bataille.',
      'Jeanne d’Arc assiste à la cérémonie, sa bannière à la main, près de l’autel.',
      'Les Anglais répondent en faisant couronner Henri VI à Paris en décembre 1431.',
    ],
    mots: [
      {
        mot: 'Sacre',
        sens: 'Cérémonie religieuse où le roi reçoit l’onction ; elle précède le couronnement proprement dit.',
      },
      {
        mot: 'Sainte Ampoule',
        sens: 'Fiole d’huile conservée à Reims, réputée apportée par une colombe au baptême de Clovis.',
      },
      {
        mot: 'Onction',
        sens: 'Geste d’oindre le corps du roi d’huile sainte, qui le sépare des autres hommes.',
      },
      {
        mot: 'Regalia',
        sens: 'Les objets du sacre : couronne, sceptre, main de justice, épée Joyeuse, éperons.',
      },
    ],
    lies: ['jeanne-d-arc', 'siege-d-orleans', 'guerre-de-cent-ans', 'bucher-de-rouen', 'charles-vii'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'sacre',
      'Reims',
      'Sainte Ampoule',
      'Charles VII',
      'onction',
      'Jeanne d’Arc',
      'couronnement',
      'Clovis',
      'roi de Bourges',
      'écrouelles',
      'Troyes',
    ],
  },
  {
    id: 'bucher-de-rouen',
    volet: 'evenements',
    nom: 'Le bûcher de Rouen',
    date: '30 mai 1431',
    tri: 1431,
    periode: 'moyen-age',
    emoji: '🔥',
    lieu: 'Rouen, place du Vieux-Marché',
    accroche:
      'Un procès d’Église instruit par des juges payés par l’Angleterre, pour établir qu’un roi de France avait été sacré par une sorcière. Il dure cinq mois.',
    citations: [
      {
        texte:
          'De l’amour ou de la haine que Dieu a pour les Anglais, je ne sais rien ; mais je sais bien qu’ils seront boutés hors de France, excepté ceux qui y mourront.',
        qui: 'Jeanne d’Arc',
        contexte: 'Réponse à ses juges, audience du 1ᵉʳ mars 1431, à Rouen.',
        sens:
          'Le piège était double : dire que Dieu hait les Anglais, c’était blasphémer ; dire le contraire, c’était se renier. Elle passe entre les deux et annonce la fin de la guerre.',
      },
      {
        texte: 'Si je n’y suis, Dieu m’y veuille mettre ; si j’y suis, Dieu m’y veuille tenir.',
        qui: 'Jeanne d’Arc',
        contexte:
          'À la question « Êtes-vous en état de grâce ? », posée le 24 février 1431 ; nul ne peut le savoir de lui-même.',
        sens:
          'Répondre oui était présomptueux, répondre non était s’accuser. Un assesseur nota que la question était piégée — et fut chassé de la salle.',
      },
      {
        texte: 'Nous sommes perdus, nous avons brûlé une sainte.',
        qui: 'Attribué à un secrétaire du roi d’Angleterre présent au supplice',
        contexte:
          'Rapporté par plusieurs témoins au procès en réhabilitation, vingt-cinq ans après l’exécution.',
        sens:
          'La phrase circule sous plusieurs formes selon les témoignages : elle dit moins ce qu’un homme a prononcé que ce que la foule de Rouen a ressenti ce matin-là.',
        incertaine: true,
      },
    ],
    reperes: [
      'Capturée à Compiègne le 23 mai 1430, elle est vendue aux Anglais dix mille livres tournois.',
      'Jugée par un tribunal d’Église, mais détenue dans une prison anglaise, gardée jour et nuit par des soldats.',
      'Pierre Cauchon, évêque de Beauvais chassé de son diocèse par les Français, préside le procès.',
      'Cinq mois d’interrogatoires, seule, sans avocat, face à une centaine de docteurs en théologie.',
      'Condamnée comme hérétique et relapse, livrée au bras séculier et brûlée le 30 mai 1431, à dix-neuf ans.',
      'Le procès est annulé en 1456 pour fraude et iniquité ; l’Église la canonise en 1920.',
    ],
    causes: [
      'La capture de Jeanne devant Compiègne, le 23 mai 1430, par les Bourguignons de Jean de Luxembourg.',
      'Le refus de la cour de Charles VII de payer une rançon ou de tenter le moindre échange.',
      'Le besoin politique anglais : si Jeanne est une sorcière, le sacre de Reims est entaché et Henri VI reste le vrai roi.',
      'L’impossibilité de la juger pour faits de guerre : seule une accusation d’hérésie permet un procès.',
      'Un juge, Pierre Cauchon, qui doit sa carrière aux Anglais et espère de leur main l’archevêché de Rouen.',
      'L’université de Paris, acquise aux Bourguignons, qui réclame elle-même le procès et fournit ses théologiens.',
    ],
    recit: [
      {
        titre: 'Vendue, puis livrée',
        texte:
          'Le **23 mai 1430**, devant **Compiègne**, Jeanne couvre la retraite d’une sortie quand le pont-levis se relève trop tôt ; un archer la tire à bas de son cheval. Elle appartient à **Jean de Luxembourg**, vassal du duc de Bourgogne, qui la garde six mois au château de **Beaurevoir** — elle saute de la tour, vingt mètres, et survit. L’usage veut qu’on libère un prisonnier contre rançon : aucune offre ne vient de la cour de France. L’Angleterre, elle, paie. En novembre **1430**, Jeanne est vendue **dix mille livres tournois**, le tarif d’un prince du sang. On la transfère à **Rouen**, capitale anglaise du royaume, le 23 décembre. L’**université de Paris**, acquise au parti bourguignon, réclame depuis six mois qu’elle soit jugée pour hérésie : le roi d’Angleterre la remet officiellement à l’Église, tout en précisant qu’il la reprendra si elle est acquittée.',
      },
      {
        titre: 'Un tribunal d’Église dans une prison anglaise',
        texte:
          'Le procès s’ouvre le **9 janvier 1431**. Sur le papier, tout est régulier : un tribunal d’**Inquisition**, présidé par un évêque, **Pierre Cauchon**, assisté du vice-inquisiteur **Jean Lemaître** — que l’on doit menacer pour qu’il siège —, entouré de plus de cent **assesseurs**, docteurs et clercs. Dans les faits, presque toutes les règles sont enfreintes, et ce sont elles qui feront annuler la sentence en 1456. Jeanne aurait dû être détenue dans une prison d’Église, gardée par des femmes : elle est enfermée au **château de Rouen**, dans une cellule, entravée, sous la garde de soldats anglais. Elle demande un **avocat** : refusé. Elle demande à voir le compte rendu de ses réponses : refusé. Elle en appelle au **pape** : refusé. Quinze audiences publiques, puis des interrogatoires dans sa cellule ; les soixante-dix articles d’accusation sont ramenés à douze, que l’on soumet à l’université de Paris — laquelle conclut, sans l’avoir vue, à l’hérésie.',
      },
      {
        titre: 'Elle répond',
        texte:
          'Ce que les minutes du procès conservent est stupéfiant : une fille de dix-neuf ans qui ne sait ni lire ni écrire tient tête pendant des mois à des théologiens formés vingt ans. On l’interroge sur ses **voix**, sur l’arbre aux fées de Domrémy, sur son **habit d’homme**, sur son étendard. On lui tend des pièges ; elle les voit. « Êtes-vous en état de grâce ? » — la réponse fait taire la salle. Quand on la somme de se soumettre à l’**Église militante**, c’est-à-dire à ce tribunal, elle distingue : elle se soumet à Dieu et au pape, pas à des juges. « Je m’en rapporte à Notre-Seigneur, qui m’a envoyée. » Les notaires **Guillaume Manchon** et **Boisguillaume** raconteront plus tard qu’on voulut leur faire modifier leurs notes et qu’ils refusèrent ; que des assesseurs furent chassés pour avoir protesté ; et qu’un jour, à bout, l’un des juges lâcha qu’on n’arriverait à rien par les questions.',
      },
      {
        titre: 'L’abjuration, puis le relaps',
        texte:
          'Le **24 mai 1431**, on la conduit au cimetière de **Saint-Ouen**, devant une estrade, un sermon, une foule — et la charrette du bourreau, bien en vue. On lui lit la sentence. Épuisée, malade, elle cède et **abjure** : elle signe d’une croix un texte court qu’on lui lit, et dont on saura plus tard qu’il fut remplacé au dossier par un autre, long de plusieurs pages. Sa peine devient la prison à perpétuité. On la ramène dans la même cellule, chez les mêmes gardes. Trois jours plus tard, elle a repris l’**habit d’homme** — parce qu’on lui a retiré sa robe, dira l’un des témoins ; parce qu’elle s’est défendue contre ses gardiens, dira un autre ; parce que ses voix le lui ont commandé, dit-elle. Peu importe le détail : la conséquence est écrite dans le droit. Retomber après avoir abjuré, c’est être **relaps**, et le relaps est remis à la justice du prince. Cauchon vient la voir dans sa cellule, ressort et dit, devant témoins : « Nous l’avons prise. »',
      },
      {
        titre: 'Le 30 mai, place du Vieux-Marché',
        texte:
          'Au matin du **mercredi 30 mai 1431**, frère **Martin Ladvenu** lui annonce qu’elle va mourir. Elle demande la communion ; on la lui donne, ce qui est contraire au sort d’une hérétique et dit assez le malaise du clergé présent. La charrette traverse Rouen entre huit cents soldats anglais. Sur la **place du Vieux-Marché**, l’échafaud a été monté très haut, sur un socle de plâtre, pour que la foule voie — et pour que le bourreau ne puisse pas l’atteindre et abréger son agonie, comme il le faisait d’ordinaire. L’écriteau dit : « hérétique, relapse, apostate, idolâtre ». Elle demande une croix ; un soldat anglais en noue deux bouts de bois, et le frère **Isambart de la Pierre** court chercher la croix de la paroisse Saint-Sauveur pour qu’elle la voie jusqu’au bout. Les témoins rapportent qu’elle appela plusieurs fois le nom de **Jésus**. Les cendres furent jetées dans la **Seine**, pour qu’il ne reste pas de relique. Le bourreau, **Geoffroy Thérage**, dit le soir même qu’il craignait d’être damné.',
      },
      {
        titre: 'Vingt-cinq ans plus tard, l’Église annule',
        texte:
          'Rouen est reprise par les Français en 1449. Dès **1450**, Charles VII fait ouvrir une enquête : il ne peut pas rester le roi sacré par une hérétique. C’est pourtant la **mère de Jeanne**, **Isabelle Romée**, qui obtient le vrai procès : vieille et à demi aveugle, elle vient à Paris en 1455 réclamer justice devant les délégués du pape **Calixte III**. Le procès en **réhabilitation** entend plus de cent quinze témoins — les gens de Domrémy, les capitaines, les notaires, les frères qui l’ont assistée au bûcher. Le **7 juillet 1456**, la sentence de Rouen est déclarée nulle, « entachée de dol, calomnie, iniquité », et lacérée publiquement. **Cauchon** était mort en 1442. Jeanne est béatifiée en 1909, **canonisée le 16 mai 1920**, et déclarée patronne secondaire de la France. Ce que l’Histoire retient du 30 mai 1431 n’est pas un verdict d’Église : c’est une exécution politique qui a emprunté ses formes.',
      },
    ],
    consequences: [
      'Les Anglais obtiennent leur sentence, mais elle ne change rien : Charles VII reste le roi sacré et reprend Paris en 1436.',
      'Le procès, noté mot à mot, laisse le document le plus détaillé qui existe sur une personne ordinaire du Moyen Âge.',
      'Le 7 juillet 1456, la sentence de Rouen est annulée pour fraude et iniquité, à la demande de la mère de Jeanne.',
      'Jeanne est béatifiée en 1909, canonisée le 16 mai 1920 et déclarée patronne secondaire de la France.',
      'Rouen garde la mémoire du lieu : une église et un mémorial s’élèvent place du Vieux-Marché depuis 1979.',
      'Le bûcher fait de Jeanne une figure réclamée par tous les camps français, jusqu’à aujourd’hui.',
    ],
    chiffres: [
      { valeur: '10 000', quoi: 'livres tournois payées aux Bourguignons pour l’acheter' },
      { valeur: '120', quoi: 'clercs et docteurs appelés comme assesseurs au procès' },
      { valeur: '19 ans', quoi: 'l’âge de Jeanne le jour du bûcher' },
      { valeur: '115', quoi: 'témoins entendus au procès en réhabilitation de 1456' },
    ],
    chrono: [
      { date: '23 mai 1430', fait: 'Jeanne est capturée devant Compiègne.' },
      { date: 'novembre 1430', fait: 'Vendue aux Anglais pour dix mille livres tournois.' },
      { date: '23 décembre 1430', fait: 'Transférée au château de Rouen.' },
      { date: '9 janvier 1431', fait: 'Ouverture du procès devant Pierre Cauchon.' },
      { date: '24 février 1431', fait: '« Si je n’y suis, Dieu m’y veuille mettre. »' },
      { date: '24 mai 1431', fait: 'Abjuration au cimetière de Saint-Ouen.' },
      { date: '28 mai 1431', fait: 'Déclarée relapse : elle a repris l’habit d’homme.' },
      { date: '30 mai 1431', fait: 'Brûlée vive place du Vieux-Marché.' },
      { date: '7 juillet 1456', fait: 'Le procès est annulé : Jeanne est déclarée innocente.' },
      { date: '16 mai 1920', fait: 'Canonisation par le pape Benoît XV.' },
    ],
    leSaisTu:
      'De cette paysanne de dix-neuf ans qui ne savait pas écrire, nous connaissons les paroles mieux que celles de la plupart des rois de son siècle : les notaires du procès ont noté ses réponses au jour le jour, en français puis en latin, et plusieurs manuscrits en sont conservés. Ses juges voulaient la perdre ; ils ont laissé son portrait le plus fidèle.',
    aRetenir: [
      'Capturée à Compiègne le 23 mai 1430, Jeanne d’Arc est vendue aux Anglais dix mille livres tournois.',
      'Le procès s’ouvre à Rouen le 9 janvier 1431 devant un tribunal d’Église présidé par Pierre Cauchon.',
      'C’est un procès politique : il s’agit de montrer que Charles VII a été sacré grâce à une hérétique.',
      'Jeanne abjure le 24 mai, reprend l’habit d’homme et est déclarée relapse le 28 mai.',
      'Elle est brûlée vive le 30 mai 1431, à dix-neuf ans, place du Vieux-Marché.',
      'La sentence est annulée le 7 juillet 1456 ; Jeanne est canonisée en 1920.',
    ],
    mots: [
      {
        mot: 'Relaps',
        sens: 'Condamné qui retombe dans l’erreur après l’avoir abjurée ; la peine en est la mort.',
      },
      {
        mot: 'Bras séculier',
        sens: 'La justice du prince, à qui l’Église remet le condamné parce qu’elle ne verse pas le sang.',
      },
      {
        mot: 'Abjuration',
        sens: 'Déclaration par laquelle on renonce publiquement à ce dont on est accusé.',
      },
      {
        mot: 'Assesseur',
        sens: 'Clerc appelé à siéger auprès des juges et à donner son avis sur le procès.',
      },
    ],
    lies: ['jeanne-d-arc', 'siege-d-orleans', 'sacre-de-charles-vii', 'guerre-de-cent-ans'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Rouen',
      'Jeanne d’Arc',
      'Cauchon',
      'procès',
      'hérésie',
      'bûcher',
      'Vieux-Marché',
      'relaps',
      'réhabilitation',
      'inquisition',
      'Compiègne',
    ],
  },
  {
    id: 'chute-de-constantinople',
    volet: 'evenements',
    nom: 'La chute de Constantinople',
    date: '29 mai 1453',
    tri: 1453,
    periode: 'moyen-age',
    emoji: '🕌',
    lieu: 'Constantinople, sur le Bosphore',
    accroche:
      'Onze siècles après sa fondation, la capitale de l’Empire romain d’Orient tombe en cinquante-trois jours devant les canons de Mehmet II.',
    citations: [
      {
        texte:
          'Te donner la ville, ce n’est ni à moi ni à aucun de ses habitants qu’il appartient ; car d’un commun accord nous mourrons tous de notre plein gré.',
        qui: 'Constantin XI Paléologue',
        contexte:
          'Réponse à l’ultimatum de Mehmet II, qui lui offrait de partir libre avec ses biens et la Morée, en mai 1453.',
        sens:
          'Le dernier empereur romain refuse la seule issue qui lui restait. Il mourra sur la muraille, et son corps ne sera jamais identifié.',
      },
      {
        texte:
          'L’araignée tisse sa toile dans le palais des Césars ; la chouette veille sur la tour d’Afrasiab.',
        qui: 'Mehmet II',
        contexte:
          'Vers persan récité par le sultan de vingt et un ans en entrant dans le Grand Palais ruiné des empereurs, le 29 mai 1453.',
        sens:
          'Le vainqueur ne triomphe pas : il constate que les empires meurent, et se sait mortel à son tour.',
      },
      {
        texte: 'Plutôt le turban du sultan que la mitre du cardinal.',
        qui: 'Attribué à Loukas Notaras, grand-duc de Byzance',
        contexte:
          'Sur le refus byzantin de l’union avec Rome, proclamée à Florence en 1439 et détestée du peuple.',
        sens:
          'La ville a préféré perdre son indépendance plutôt que son rite : le schisme de 1054 lui a coûté ses derniers alliés.',
        incertaine: true,
      },
    ],
    reperes: [
      'Constantinople est fondée par Constantin en 330 ; l’Empire d’Orient survit mille ans à la chute de Rome.',
      'En 1453, il n’en reste que la ville : 50 000 habitants pour vingt kilomètres de murailles.',
      'Mehmet II, vingt et un ans, amène 80 000 hommes et une artillerie que personne n’a jamais vue.',
      'La bombarde d’Orban, longue de huit mètres, tire un boulet de pierre de 500 kg sept fois par jour.',
      'Constantin XI aligne 7 000 défenseurs, dont 700 Génois menés par Giustiniani.',
      '29 mai 1453, avant l’aube : les murailles cèdent ; l’empereur meurt les armes à la main.',
    ],
    causes: [
      'Un empire réduit à sa capitale : la quatrième croisade l’avait pillé en 1204, les Ottomans lui avaient pris l’Asie Mineure et les Balkans.',
      'La coupure entre Rome et Constantinople depuis le schisme de 1054 : l’Occident n’envoie presque aucun secours.',
      'Le verrou du Bosphore, que les Ottomans ne peuvent pas laisser aux mains d’un adversaire au milieu de leur empire.',
      'La forteresse de Roumeli Hisar, bâtie par Mehmet II en quatre mois en 1452 : le détroit est fermé.',
      'L’artillerie nouvelle : le fondeur hongrois Orban, que l’empereur n’avait pas les moyens de payer, va vendre ses canons au sultan.',
      'Une garnison dérisoire : sept mille hommes pour vingt kilomètres de remparts à tenir.',
    ],
    recit: [
      {
        titre: 'Ce qu’il reste d’un empire',
        texte:
          'Quand Rome tombe en 476, l’**Empire romain d’Orient** ne tombe pas : il dure mille ans de plus. Sa capitale, **Constantinople**, fondée par **Constantin** en 330 sur le détroit du **Bosphore**, a été la plus grande ville de la chrétienté, forte d’un demi-million d’habitants, de son droit romain, de sa langue grecque et de **Sainte-Sophie**, la plus vaste église du monde depuis 537. Le coup fatal ne vient pas des Turcs mais des chrétiens : en **1204**, la **quatrième croisade**, détournée par Venise, prend et pille la ville pendant trois jours. Reprise en 1261, elle ne s’en relève jamais. En 1453, l’« empire » se réduit à la ville, quelques îles et un lambeau de Grèce ; la population est tombée à **cinquante mille** âmes, et l’on cultive des champs à l’intérieur des murailles.',
      },
      {
        titre: 'Mehmet II prépare tout',
        texte:
          'Le sultan **Mehmet II** a vingt et un ans en 1453 et règne depuis deux. Il a décidé de prendre la ville, et il s’y prend en ingénieur. Dès **1452**, il fait bâtir sur la rive européenne du Bosphore, en quatre mois, la forteresse de **Roumeli Hisar**, que les Grecs appellent « le coupe-gorge » : plus un navire ne passe sans payer ou sans couler. Puis il achète ce que l’empereur n’a pas pu payer : le fondeur hongrois **Orban** lui coule à Andrinople une **bombarde** de huit mètres, tirée par soixante bœufs, qui lance des boulets de pierre de cinq cents kilos — sept coups par jour, car il faut laisser le bronze refroidir. Il rassemble **quatre-vingt mille hommes**, dont les **janissaires**, infanterie d’élite enlevée enfant aux familles chrétiennes des Balkans et élevée pour le sultan, et une flotte de cent vingt navires. Face à cela, Constantin XI trouve sept mille défenseurs.',
      },
      {
        titre: 'Cinquante-trois jours de siège',
        texte:
          'Le siège commence le **6 avril 1453**. En face, les **murailles de Théodose** : trois lignes successives bâties au Vᵉ siècle, un fossé, une avant-muraille, un rempart de douze mètres et quatre-vingt-seize tours. En mille ans, aucune armée ne les avait prises d’assaut. La bombarde d’Orban y ouvre des brèches, que les assiégés rebouchent chaque nuit avec de la terre, des tonneaux et des poutres. Sur l’eau, la **Corne d’Or** est fermée par une énorme **chaîne** tendue d’une rive à l’autre ; le 20 avril, quatre navires chrétiens la forcent sous les yeux du sultan, qui entre en fureur. Sa réponse est restée célèbre : dans la nuit du **22 avril**, il fait **haler ses navires par voie de terre**, sur des rondins graissés, par-dessus la colline de Péra — soixante-dix bateaux passent derrière la chaîne en une nuit. Les défenseurs doivent désormais garder aussi ce côté-là, avec les mêmes sept mille hommes.',
      },
      {
        titre: 'La nuit du 28 au 29 mai',
        texte:
          'Le soir du **28 mai**, on célèbre à **Sainte-Sophie** une dernière liturgie où Grecs orthodoxes et Latins prient ensemble, ce qu’ils refusaient depuis des années. L’empereur parle à ses capitaines, puis rejoint son poste. L’assaut commence vers une heure et demie du matin, en trois vagues : d’abord les troupes irrégulières, puis les Anatoliens, enfin les **janissaires**. Au petit jour, deux accidents décident de tout : **Giustiniani**, le chef génois qui tient la brèche, est grièvement blessé et se fait évacuer — ses hommes le suivent —, et une poterne, la **Kerkoporta**, est trouvée ouverte ; une cinquantaine de Turcs s’y engouffrent et hissent leur étendard sur une tour. Le cri « la ville est prise » fait le reste. **Constantin XI** jette ses insignes impériaux et charge dans la mêlée ; on ne retrouvera jamais son corps. Mehmet entre en ville vers midi, arrête le pillage au bout d’une journée au lieu des trois que l’usage accordait, et fait de **Sainte-Sophie** une mosquée. Il prend le surnom de **Fatih**, le Conquérant.',
      },
      {
        titre: 'Ce que 1453 ouvre',
        texte:
          'Constantinople devient **Istanbul**, capitale d’un empire qui tiendra jusqu’en 1922 et s’étendra jusqu’aux portes de **Vienne**, assiégée en 1529 puis en 1683. Les savants grecs qui fuient emportent en Italie leurs manuscrits d’Homère, de Platon et d’Archimède : la **Renaissance** italienne, déjà commencée, y trouve un carburant et des professeurs de grec. Les routes de terre vers l’Asie passent désormais par des péages ottomans, et l’Europe se met à chercher une route par la mer : **Bartolomeu Dias** double le cap de Bonne-Espérance en 1488, **Christophe Colomb** part vers l’ouest en **1492**. Moscou, dernière capitale orthodoxe, se proclame la « troisième Rome ». C’est pourquoi les manuels français font de 1453 — avec 1492 — la date où le **Moyen Âge** se termine : non parce que le monde change ce jour-là, mais parce que tout ce qui change ensuite part de là.',
      },
    ],
    consequences: [
      'L’Empire romain d’Orient disparaît après onze siècles : Constantinople devient Istanbul, capitale ottomane.',
      'Sainte-Sophie, plus grande église de la chrétienté depuis 537, devient une mosquée.',
      'Les Ottomans tiennent le Bosphore et les Balkans ; ils assiégeront Vienne en 1529 puis en 1683.',
      'Des savants grecs fuient en Italie avec leurs manuscrits et alimentent la Renaissance.',
      'Les routes de terre vers l’Asie deviennent coûteuses : Portugais et Espagnols cherchent une voie maritime.',
      'Les manuels français font de 1453 — avec 1492 — la fin du Moyen Âge.',
    ],
    chiffres: [
      { valeur: '53 jours', quoi: 'de siège, du 6 avril au 29 mai 1453' },
      { valeur: '80 000', quoi: 'assiégeants ottomans contre 7 000 défenseurs' },
      { valeur: '500 kg', quoi: 'le boulet de pierre de la bombarde d’Orban' },
      { valeur: '1 123 ans', quoi: 'd’existence de Constantinople, de 330 à 1453' },
    ],
    chrono: [
      { date: '330', fait: 'Constantin fonde Constantinople sur le Bosphore.' },
      { date: '1054', fait: 'Schisme entre les Églises de Rome et de Constantinople.' },
      { date: '1204', fait: 'La quatrième croisade prend et pille la ville.' },
      { date: '1452', fait: 'Mehmet II bâtit Roumeli Hisar et ferme le Bosphore.' },
      { date: '6 avril 1453', fait: 'Début du siège devant les murailles de Théodose.' },
      { date: '22 avril 1453', fait: 'La flotte turque est halée par voie de terre dans la Corne d’Or.' },
      { date: '28 mai 1453', fait: 'Dernière liturgie commune à Sainte-Sophie.' },
      { date: '29 mai 1453', fait: 'La ville tombe ; Constantin XI meurt au combat.' },
      { date: '1492', fait: 'Colomb cherche une route de l’Asie par l’ouest.' },
    ],
    leSaisTu:
      'Le chroniqueur Doukas raconte qu’une petite poterne des murailles, la Kerkoporta, servait aux sorties et qu’on avait oublié de la refermer. Une cinquantaine de Turcs s’y glissèrent et plantèrent leur drapeau sur une tour ; la panique fit le reste. Un empire de onze siècles a peut-être tenu, jusqu’au bout, à une porte mal fermée.',
    aRetenir: [
      'Constantinople tombe le 29 mai 1453 après cinquante-trois jours de siège.',
      'Mehmet II aligne 80 000 hommes et une artillerie inédite contre 7 000 défenseurs.',
      'L’empereur Constantin XI meurt les armes à la main : l’Empire romain d’Orient s’éteint avec lui.',
      'Sainte-Sophie devient une mosquée et la ville la capitale de l’Empire ottoman.',
      'La fermeture des routes de terre vers l’Asie pousse à chercher une route maritime.',
      'La date marque, avec 1492, la fin du Moyen Âge dans les manuels français.',
    ],
    mots: [
      {
        mot: 'Bombarde',
        sens: 'Gros canon de siège du XVᵉ siècle, qui tire des boulets de pierre.',
      },
      {
        mot: 'Janissaire',
        sens: 'Soldat d’élite de l’infanterie ottomane, enlevé enfant aux familles chrétiennes et élevé pour le sultan.',
      },
      {
        mot: 'Schisme',
        sens: 'Rupture entre deux Églises ; celui de 1054 sépare Rome de Constantinople.',
      },
      {
        mot: 'Corne d’Or',
        sens: 'Le bras de mer qui longe Constantinople au nord et lui sert de port.',
      },
    ],
    lies: ['guerre-de-cent-ans', 'grande-peste', 'premiere-croisade', 'constantin'],
    niveaux: ['5e'],
    programme: 'Le monde méditerranéen et la fin du Moyen Âge',
    tags: [
      'Constantinople',
      'Byzance',
      'Mehmet II',
      'Constantin XI',
      'Sainte-Sophie',
      'Ottomans',
      'Bosphore',
      'janissaires',
      'bombarde',
      'Istanbul',
      '1453',
      'Corne d’Or',
    ],
  },
]
