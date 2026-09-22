// -----------------------------------------------------------------------------
// MOYEN ÂGE — l'État royal : Aliénor d'Aquitaine, Philippe Auguste, Philippe le
// Bel, Du Guesclin, Jacques Cœur, Charles VII, Louis XI.
//
// Ce lot est le voisin direct de `personnages-moyen-age-rois.ts` (Blanche de
// Castille, Saint Louis, Jeanne d'Arc) et s'écrit sur son patron. Ce sont les
// BÂTISSEURS : les murailles et les Halles de Paris, le Louvre, le Parlement et
// les premiers États généraux, la reconquête ville par ville, l'impôt régulier
// et l'armée permanente, la poste du roi. On raconte ce qu'ils ONT FAIT.
//
// Les épisodes durs — la fin des Templiers, la chute de Jacques Cœur, les cages
// de Louis XI — sont dits avec précision et DANS LEUR TEMPS : ni procès
// rétrospectif, ni ironie, ni clin d'œil au lecteur d'aujourd'hui.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_MOYEN_AGE_COURONNE: Personnage[] = [
  {
    id: 'alienor-d-aquitaine',
    volet: 'personnages',
    nom: 'Aliénor d’Aquitaine',
    surnom: 'la reine des deux royaumes',
    dates: 'vers 1122 – 1204',
    tri: 1204,
    periode: 'moyen-age',
    emoji: '🌹',
    roles: [
      'Duchesse d’Aquitaine',
      'Reine de France',
      'Reine d’Angleterre',
      'Protectrice des troubadours',
    ],
    origine: 'Duché d’Aquitaine, sans doute Poitiers',
    accroche:
      'Reine de France, puis reine d’Angleterre, mère de Richard Cœur de Lion : pendant soixante-dix ans, rien d’important ne se décide en Occident sans elle.',
    citations: [
      {
        texte: 'Aliénor, par la colère de Dieu reine d’Angleterre.',
        contexte:
          'En-tête de ses lettres au pape Célestin III, en 1193, alors que son fils Richard est retenu prisonnier en Allemagne.',
        sens:
          'La formule officielle d’une souveraine est « par la grâce de Dieu ». Elle change un mot, et la chrétienté entière comprend ce qu’elle endure.',
      },
      {
        texte:
          'Rendez-moi mon fils, homme de Dieu — si toutefois vous êtes un homme de Dieu et non un homme de sang.',
        contexte:
          'Au pape Célestin III, qui tarde à obtenir la libération de Richard. Lettre dictée à son secrétaire Pierre de Blois, 1193.',
      },
      {
        texte: 'J’ai épousé un moine, et non un roi.',
        contexte:
          'Prêtée à Aliénor au sujet de Louis VII, dont la piété tenait du cloître. Rapportée bien après l’annulation de leur mariage.',
        incertaine: true,
      },
    ],
    reperes: [
      'Duchesse d’Aquitaine à quinze ans : elle apporte en dot tout le Sud-Ouest du royaume.',
      'Reine de France de 1137 à 1152, aux côtés de Louis VII, avec qui elle part en croisade.',
      'Remariée huit semaines après l’annulation, elle devient reine d’Angleterre en 1154.',
      'Mère de dix enfants, dont Richard Cœur de Lion et Jean sans Terre.',
      'Quinze ans de captivité, de 1174 à 1189, pour avoir soutenu la révolte de ses fils.',
      'À près de quatre-vingts ans, elle passe les Pyrénées chercher sa petite-fille Blanche de Castille.',
    ],
    recit: [
      {
        titre: 'L’héritière de la moitié du Sud',
        texte:
          'Son grand-père, **Guillaume IX d’Aquitaine**, est le premier **troubadour** dont on ait gardé les chansons ; son père, Guillaume X, règne sur un duché plus vaste que le domaine du roi de France. Quand il meurt en **1137**, Aliénor a quinze ans et devient, d’un coup, le plus beau parti d’Occident : Poitou, Saintonge, Limousin, Périgord, Gascogne, Bordelais. Le roi Louis VI la marie aussitôt à son fils, dans la cathédrale de Bordeaux. Quelques semaines plus tard, le vieux roi meurt : la jeune duchesse est **reine de France**. Elle arrive à Paris avec ses poètes, ses étoffes et ses manières du Midi, dans une cour qui trouve tout cela bien léger.',
      },
      {
        titre: 'Reine de France, et croisée',
        texte:
          'En **1147**, elle part avec Louis VII pour la **deuxième croisade** — une reine qui prend la croix, cela ne s’était pas vu. L’expédition tourne mal : l’armée est décimée en Asie Mineure, et à **Antioche**, Aliénor prend ouvertement le parti de son oncle Raymond contre la stratégie du roi. La rupture est publique. Au retour, le couple ne tient plus : ils n’ont que deux filles, et le royaume veut un héritier mâle. Le **21 mars 1152**, un concile réuni à **Beaugency** annule le mariage pour parenté trop proche. Aliénor reprend son duché et quitte la cour. Ses deux filles, Marie et Alix, restent au roi.',
      },
      {
        titre: 'Reine d’Angleterre',
        texte:
          'Huit semaines plus tard, elle épouse **Henri Plantagenêt**, comte d’Anjou et duc de Normandie, de onze ans son cadet. En **1154**, il devient **Henri II d’Angleterre** : le couple règne alors de l’Écosse aux Pyrénées, sur un ensemble bien plus vaste que le royaume de France — l’« **empire Plantagenêt** ». Aliénor lui donne huit enfants, dont **Richard Cœur de Lion** et **Jean sans Terre**. Mais Henri gouverne seul, et en **1173** elle soutient la révolte de ses fils contre leur père. Prise, elle est enfermée quinze ans dans les châteaux d’Angleterre. Elle n’en sort qu’à la mort d’Henri II, en **1189** : elle a soixante-sept ans, et tout est à reprendre.',
      },
      {
        titre: 'La cour où naît l’amour courtois',
        texte:
          'Aliénor a fait de **Poitiers** puis de ses cours successives l’endroit où l’on chante. Le troubadour **Bernart de Ventadour** compose pour elle ; le clerc Wace lui dédie son *Roman de Brut*, qui donne au monde la table ronde du roi Arthur. Sa fille **Marie de Champagne** protégera **Chrétien de Troyes**, l’inventeur de Lancelot. C’est dans ce milieu que se fixe l’**amour courtois** : le chevalier au service d’une dame, la politesse comme exercice, la femme jugée digne qu’on lui parle. Un modèle qui traversera l’Europe et que la littérature occidentale n’a jamais tout à fait abandonné.',
      },
      {
        titre: 'La vieille reine tient l’Europe',
        texte:
          'Libre, elle gouverne l’Angleterre pendant que **Richard** est en croisade, puis, quand il est capturé au retour et vendu à l’empereur, elle lève dans tout le royaume la rançon monstrueuse de **cent mille marcs d’argent** et va elle-même chercher son fils en Allemagne. Après lui, elle tient l’Aquitaine pour **Jean sans Terre**. En **1200**, à près de quatre-vingts ans, elle traverse les Pyrénées en hiver pour aller choisir en Castille une de ses petites-filles et la marier à l’héritier de France : ce sera **Blanche de Castille**, future régente du royaume. Elle meurt à l’abbaye de **Fontevraud** en **1204**, ayant été reine de deux royaumes et aïeule des deux dynasties qui vont se faire la guerre pendant trois siècles.',
      },
    ],
    chrono: [
      { date: 'vers 1122', fait: 'Naissance dans le duché d’Aquitaine.' },
      { date: '1137', fait: 'Duchesse d’Aquitaine ; mariage avec Louis VII.' },
      { date: '1147', fait: 'Départ pour la deuxième croisade.' },
      { date: '1152', fait: 'Annulation à Beaugency ; mariage avec Henri Plantagenêt.' },
      { date: '1154', fait: 'Henri II roi d’Angleterre : elle est reine une seconde fois.' },
      { date: '1174', fait: 'Emprisonnée après la révolte de ses fils.' },
      { date: '1189', fait: 'Libérée, elle gouverne pour Richard Cœur de Lion.' },
      { date: '1193', fait: 'Elle réunit la rançon qui rachète Richard.' },
      { date: '1200', fait: 'Elle va chercher Blanche de Castille au-delà des Pyrénées.' },
      { date: '1204', fait: 'Mort à l’abbaye de Fontevraud.' },
    ],
    leSaisTu:
      'Son tombeau se voit toujours à Fontevraud, près de ceux d’Henri II et de Richard Cœur de Lion. Les rois y sont sculptés les mains jointes, sceptre au poing. Elle, elle tient un livre ouvert et le lit : c’est le seul gisant de la famille représenté en train de lire.',
    aRetenir: [
      'Aliénor d’Aquitaine est reine de France de 1137 à 1152, puis reine d’Angleterre de 1154 à 1189.',
      'L’annulation de son mariage en 1152 fait passer l’Aquitaine aux Plantagenêts : c’est une des racines de la guerre de Cent Ans.',
      'Elle est la mère de Richard Cœur de Lion et de Jean sans Terre, et la grand-mère de Blanche de Castille.',
      'Emprisonnée quinze ans par Henri II, elle gouverne après 1189 et meurt à Fontevraud en 1204.',
      'Sa cour protège les troubadours et répand l’amour courtois dans toute l’Europe.',
    ],
    mots: [
      {
        mot: 'Duché',
        sens: 'Grande principauté tenue par un duc : il doit hommage au roi, mais gouverne chez lui.',
      },
      {
        mot: 'Troubadour',
        sens: 'Poète et musicien du Midi qui compose en langue d’oc, souvent sur l’amour courtois.',
      },
      {
        mot: 'Annulation',
        sens: 'Décision de l’Église déclarant qu’un mariage n’a jamais été valable — ici, pour parenté trop proche.',
      },
    ],
    lies: ['philippe-auguste', 'blanche-de-castille', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'Aliénor',
      'Aquitaine',
      'Plantagenêt',
      'Louis VII',
      'Henri II',
      'Richard Cœur de Lion',
      'troubadours',
      'amour courtois',
      'Fontevraud',
      'Poitiers',
      'croisade',
    ],
  },
  {
    id: 'philippe-auguste',
    volet: 'personnages',
    nom: 'Philippe Auguste',
    surnom: 'le roi qui a fait Paris',
    dates: '1165 – 1223',
    tri: 1223,
    periode: 'moyen-age',
    emoji: '🏰',
    roles: ['Roi de France', 'Vainqueur de Bouvines', 'Bâtisseur de Paris'],
    origine: 'Gonesse, près de Paris',
    accroche:
      'En quarante-trois ans de règne, il quadruple le domaine royal, bat l’Europe coalisée à Bouvines et fait de Paris une capitale de pierre.',
    citations: [
      {
        texte: 'Montjoie ! Saint Denis !',
        contexte:
          'Cri de guerre de l’armée royale, hurlé à Bouvines le 27 juillet 1214 et dans toutes les batailles du roi.',
        sens:
          'Saint Denis est le saint protecteur du royaume, et c’est dans son abbaye que le roi prend l’oriflamme avant de partir. Le cri dit à qui l’on appartient.',
      },
      {
        texte: 'Gardez-vous : le diable est déchaîné.',
        contexte:
          'Avertissement envoyé à Jean sans Terre en 1194, en apprenant que Richard Cœur de Lion venait d’être libéré de sa prison allemande.',
        sens:
          'Les deux hommes redoutaient Richard au point d’en plaisanter à froid : le prisonnier libre allait reprendre la guerre dès le mois suivant.',
      },
      {
        texte: 'Que celui d’entre vous qui s’en juge plus digne la prenne.',
        contexte:
          'Rapporté par les chroniqueurs : le roi aurait posé sa couronne devant ses barons avant le combat de 1214.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi à quinze ans, en 1180 ; il règne quarante-trois ans.',
      'Il enlève aux Plantagenêts la Normandie, l’Anjou, le Maine, la Touraine et le Poitou.',
      'Le domaine royal quadruple : le roi devient enfin le plus puissant seigneur du royaume.',
      'Bouvines, le 27 juillet 1214 : la victoire qui fonde l’autorité du roi sur tous.',
      'Il fait paver Paris, l’entoure d’une muraille et bâtit la forteresse du Louvre.',
      'Premier souverain à se dire « roi de France » et non plus « roi des Francs ».',
    ],
    recit: [
      {
        titre: 'Le fils qu’on n’attendait plus',
        texte:
          'Louis VII a soixante ans et trois filles quand lui naît enfin un fils, en **1165** : on l’appelle « **Dieudonné** ». Sacré à Reims en 1179, il règne seul dès **1180**, à quinze ans. L’héritage est mince : le roi de France ne commande réellement qu’autour de Paris et d’Orléans, tandis qu’en face **Henri II Plantagenêt** tient la Normandie, l’Anjou, l’Aquitaine — plus de terres françaises que le roi lui-même, et il lui doit pourtant l’hommage. Philippe passe son règne à renverser ce rapport. Il le fera moins par les grandes batailles que par le droit féodal, la patience et l’argent.',
      },
      {
        titre: 'Reprendre la Normandie',
        texte:
          'Il part en **1190** pour la **troisième croisade** avec Richard Cœur de Lion, prend Saint-Jean-d’Acre, et rentre dès 1191 : ce qu’il veut se joue en France. Tant que Richard vit, rien ne bouge. Mais en 1199 Richard meurt, et son frère **Jean sans Terre** lui succède. En **1202**, Philippe le convoque devant sa **cour des pairs** comme n’importe quel vassal ; Jean ne se présente pas. La cour le déclare déchu de ses fiefs, et le roi applique la sentence les armes à la main. **Château-Gaillard**, la forteresse que Richard croyait imprenable, tombe en mars **1204** après six mois de siège ; Rouen se rend en juin. Normandie, Anjou, Maine, Touraine, Poitou : en quatre ans, le domaine royal **quadruple** et les revenus du roi avec lui.',
      },
      {
        titre: 'Bouvines, dimanche 27 juillet 1214',
        texte:
          'Jean sans Terre monte alors la plus grande coalition du siècle : l’empereur **Otton IV**, le comte de Flandre **Ferrand**, Renaud de Dammartin, les princes des Pays-Bas. Le plan est de prendre la France en tenaille. Philippe les rencontre près du pont de **Bouvines**, en Flandre, un **dimanche** — jour où l’on ne se bat pas. Dans son armée, à côté des chevaliers, marchent les **milices des communes**, ces bourgeois des villes auxquelles il a donné des chartes. Désarçonné, le roi manque d’être tué à terre avant d’être dégagé par ses chevaliers. À la fin du jour, Ferrand et Renaud sont prisonniers, Otton a fui. On les ramène enchaînés à Paris, dans une ville en fête **sept jours durant**. Jean sans Terre, ruiné par la défaite, doit accorder l’année suivante la *Grande Charte* à ses barons.',
      },
      {
        titre: 'Un roi qui bâtit sa capitale',
        texte:
          'En **1186**, il fait **paver** les grandes rues de Paris, jusque-là de terre battue. Il installe les **Halles** (1183), donne à l’**université de Paris** sa première charte royale (1200) et entoure la ville d’une **muraille** de plus de cinq kilomètres, avec ses tours et ses portes, qui protège les deux rives. Au point faible de cette enceinte, face à la Normandie encore anglaise, il élève une forteresse carrée à gros donjon : le **Louvre**. Notre-Dame monte en même temps. Paris cesse d’être une résidence parmi d’autres : elle devient la **capitale** — celle où sont les archives, les comptes, la justice et les écoles.',
      },
      {
        titre: 'L’invention de l’administration',
        texte:
          'Avant de partir en croisade, en **1190**, Philippe laisse une ordonnance qui organise le royaume en son absence : c’est là qu’apparaissent les **baillis** au nord et les **sénéchaux** au sud, des agents **payés par le roi**, déplacés régulièrement, tenus de rendre leurs comptes trois fois l’an. Ce ne sont plus des seigneurs qui gouvernent pour eux-mêmes, ce sont des fonctionnaires. En 1194, surpris par Richard à Fréteval, il perd son trésor et ses chartes dans la déroute : il fait alors constituer des **archives permanentes** à Paris, le Trésor des chartes. Son seul échec durable est conjugal : il répudie **Ingeburge de Danemark** au lendemain de leurs noces, s’obstine vingt ans, voit le royaume frappé d’interdit par le pape, et finit par la reprendre. Il meurt en 1223 en laissant un État qui fonctionne sans lui.',
      },
    ],
    chrono: [
      { date: '1165', fait: 'Naissance ; on l’appelle « Dieudonné ».' },
      { date: '1180', fait: 'Roi de France à quinze ans.' },
      { date: '1186', fait: 'Les rues de Paris sont pavées ; la muraille et le Louvre suivent.' },
      { date: '1190', fait: 'Troisième croisade ; ordonnance qui organise le royaume.' },
      { date: '1200', fait: 'Charte royale de l’université de Paris.' },
      { date: '1204', fait: 'Chute de Château-Gaillard : la Normandie rejoint la couronne.' },
      { date: '1214', fait: 'Victoire de Bouvines, le 27 juillet.' },
      { date: '1223', fait: 'Mort à Mantes, après quarante-trois ans de règne.' },
    ],
    leSaisTu:
      'Le chroniqueur Rigord raconte que le roi, accoudé à sa fenêtre du palais de la Cité, fut pris à la gorge par la puanteur que les charrettes soulevaient de la boue des rues. Il fit venir les bourgeois et ordonna de paver Paris de dalles de pierre. C’était en 1186 : la première grande voirie de la ville commence par une odeur.',
    aRetenir: [
      'Philippe II Auguste règne de 1180 à 1223, soit quarante-trois ans.',
      'Il enlève aux Plantagenêts la Normandie, l’Anjou, le Maine et la Touraine entre 1202 et 1206 : le domaine royal quadruple.',
      'Le 27 juillet 1214, la victoire de Bouvines impose l’autorité du roi à tout le royaume.',
      'Il crée des baillis et des sénéchaux payés par le roi, et des archives permanentes.',
      'Il fait paver Paris, l’entoure d’une muraille et bâtit la forteresse du Louvre.',
    ],
    mots: [
      {
        mot: 'Domaine royal',
        sens: 'Les terres que le roi possède et administre lui-même, à la différence des fiefs tenus par ses vassaux.',
      },
      {
        mot: 'Commune',
        sens: 'Ville qui a obtenu une charte de liberté et se gouverne elle-même ; sa milice combat pour le roi.',
      },
      {
        mot: 'Oriflamme',
        sens: 'Bannière rouge de l’abbaye de Saint-Denis, que le roi vient prendre avant de partir en guerre.',
      },
    ],
    lies: ['alienor-d-aquitaine', 'blanche-de-castille', 'saint-louis', 'philippe-le-bel'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'Philippe II',
      'Bouvines',
      'Montjoie',
      'Normandie',
      'Plantagenêt',
      'Château-Gaillard',
      'Louvre',
      'muraille de Paris',
      'Halles',
      'baillis',
      'domaine royal',
    ],
  },
  {
    id: 'philippe-le-bel',
    volet: 'personnages',
    nom: 'Philippe le Bel',
    surnom: 'le roi de fer',
    dates: '1268 – 1314',
    tri: 1314,
    periode: 'moyen-age',
    emoji: '🏛️',
    roles: ['Roi de France', 'Petit-fils de Saint Louis', 'Bâtisseur de l’État royal'],
    origine: 'Fontainebleau, royaume de France',
    accroche:
      'Il fait du royaume un État : des juristes, un Parlement, des comptes — et un roi qui ne reconnaît au-dessus de lui aucun pouvoir sur terre.',
    citations: [
      {
        texte:
          'Chose amère, chose déplorable, chose horrible à penser, terrible à entendre.',
        qui: 'L’ordre d’arrestation des Templiers, rédigé par Guillaume de Nogaret',
        contexte:
          'Premiers mots du document scellé en septembre 1307 et ouvert le même jour par tous les baillis du royaume, le 13 octobre.',
        sens:
          'Le texte fait de l’arrestation un devoir religieux avant d’être un acte de police : c’est ainsi qu’on saisit en une matinée tous les Templiers de France.',
      },
      {
        texte:
          'Que ta très grande sottise sache qu’au temporel nous ne sommes soumis à personne.',
        contexte:
          'Réponse française à la bulle du pape Boniface VIII, 1302. Le texte a circulé dans tout le royaume.',
        sens:
          'Le roi se déclare seul maître dans son domaine, la guerre et l’impôt ; c’est la première formulation nette de la souveraineté.',
        incertaine: true,
      },
      {
        texte: 'Ce n’est ni un homme ni une bête : c’est une statue.',
        qui: 'Bernard Saisset, évêque de Pamiers',
        contexte:
          'Mot d’un adversaire que le roi fit poursuivre en 1301 ; il décrit son impassibilité et son silence, restés célèbres.',
      },
      {
        texte:
          'Pape Clément, chevalier Guillaume, roi Philippe : avant un an, je vous cite à paraître au tribunal de Dieu.',
        qui: 'Jacques de Molay, dernier maître du Temple',
        contexte:
          'Sur le bûcher de l’île aux Juifs, le 18 mars 1314. Les trois hommes meurent dans l’année ; aucun témoin du jour ne rapporte la phrase.',
        incertaine: true,
      },
    ],
    reperes: [
      'Petit-fils de Saint Louis, roi à dix-sept ans en 1285 ; il règne vingt-neuf ans.',
      'Il gouverne avec des juristes formés au droit romain : Nogaret, Flote, Marigny.',
      'Il convoque les premiers États généraux, à Notre-Dame de Paris, en 1302.',
      'Il tient tête au pape Boniface VIII et affirme que le roi est maître chez lui.',
      'Le 13 octobre 1307, tous les Templiers du royaume sont arrêtés le même jour.',
      'Il installe le Parlement et la Chambre des comptes au Palais de la Cité.',
    ],
    recit: [
      {
        titre: 'Le petit-fils de Saint Louis',
        texte:
          'Né à Fontainebleau en **1268**, il a deux ans quand son grand-père meurt devant Tunis, et il grandit dans le souvenir du roi saint. Son mariage avec **Jeanne de Navarre** lui apporte la Champagne et la Navarre ; il est roi en **1285**, à dix-sept ans. Ses contemporains le décrivent grand, blond, d’une beauté froide — d’où son surnom — et surtout **silencieux** : il écoute, tranche, et ne se justifie pas. Il gouverne entouré de **légistes**, des juristes venus du Midi et formés au **droit romain**, qui lui fournissent une idée neuve et redoutable : le roi n’est pas seulement le plus grand des seigneurs, il est **souverain**, et ce qui touche au royaume ne relève que de lui.',
      },
      {
        titre: 'Le roi maître chez lui',
        texte:
          'Les guerres coûtent cher : Philippe décide de taxer le clergé de son royaume. Le pape **Boniface VIII** l’interdit (bulle *Clericis laicos*, 1296), puis affirme en **1302**, par la bulle *Unam sanctam*, que tout pouvoir sur terre dépend du pape. Le roi répond en convoquant à **Notre-Dame de Paris**, le 10 avril 1302, le clergé, la noblesse et les bourgeois des villes : ce sont les premiers **États généraux**, l’assemblée que l’on convoquera encore en 1789. Les trois ordres le soutiennent. En septembre **1303**, Guillaume de **Nogaret** va chercher le pape jusque dans sa ville d’**Anagni**, en Italie, pour le ramener se faire juger en France ; l’entreprise échoue, mais Boniface, humilié, meurt un mois plus tard. En 1309, la papauté s’installe à **Avignon**, sous l’œil du roi de France.',
      },
      {
        titre: 'L’État en bureaux',
        texte:
          'Ce règne invente l’administration française. La cour du roi se scinde en organes spécialisés et permanents : le **Parlement de Paris** pour la justice, qui juge en dernier ressort tout le royaume ; la **Chambre des comptes** pour les finances ; le Conseil pour le gouvernement. Tous siègent au **Palais de la Cité**, que Philippe fait reconstruire — sa grande salle est alors la plus vaste d’Europe. Les officiers sont payés, contrôlés, remplaçables. Le roi légifère par **ordonnances** valables partout, et non plus seulement sur ses terres. Pour la première fois, l’État tient sans le roi : il a des bureaux, des registres et des archives.',
      },
      {
        titre: 'L’argent du royaume',
        texte:
          'Tout cela se paie, et la guerre de **Flandre** ruine le trésor. En **1302**, à **Courtrai**, la chevalerie française est écrasée par les milices de tisserands flamands qui rapportent sept cents éperons d’or accrochés dans leur église ; il faudra Mons-en-Pévèle, deux ans plus tard, pour rétablir la situation. Pour trouver de l’argent, le roi taxe le clergé, crée des impôts de guerre, saisit les biens des banquiers lombards en 1291 et en 1311, expulse les juifs du royaume en 1306 en confisquant leurs créances, et **modifie plusieurs fois la valeur de la monnaie** — ce qui lui vaut, dans la *Divine Comédie* de Dante, le nom de faux-monnayeur. Ces mesures sont brutales et elles sont de leur siècle : partout en Europe, les souverains font alors payer à leurs minorités le prix de leurs guerres.',
      },
      {
        titre: 'La fin du Temple',
        texte:
          'L’ordre du **Temple**, fondé deux siècles plus tôt pour protéger les pèlerins, n’a plus de Terre sainte à défendre depuis la chute d’Acre en 1291. Il est riche, il ne relève que du pape, et sa maison de Paris garde le trésor royal. Le **13 octobre 1307**, sur un ordre scellé d’avance, tous les Templiers de France sont arrêtés le même jour. Les accusations sont lourdes : reniement du Christ, idole, mœurs infâmes. Les aveux tombent — sous la torture, pratique alors admise par les tribunaux. Cinquante-quatre chevaliers qui se rétractent sont brûlés à Paris en mai **1310**. Le concile de **Vienne** dissout l’ordre en **1312** et transfère ses biens aux Hospitaliers. Le **18 mars 1314**, le grand maître **Jacques de Molay**, qui vient de proclamer l’ordre innocent, est brûlé sur l’île aux Juifs, au bout de la Cité. Le roi meurt le 29 novembre de la même année, à quarante-six ans, des suites d’un accident de chasse.',
      },
    ],
    chrono: [
      { date: '1268', fait: 'Naissance à Fontainebleau.' },
      { date: '1285', fait: 'Roi de France à dix-sept ans.' },
      { date: '1302', fait: 'Premiers États généraux, à Notre-Dame de Paris.' },
      { date: '1302', fait: 'Défaite de Courtrai devant les milices flamandes.' },
      { date: '1303', fait: 'Attentat d’Anagni contre le pape Boniface VIII.' },
      { date: '1307', fait: 'Arrestation de tous les Templiers, le 13 octobre.' },
      { date: '1309', fait: 'La papauté s’installe à Avignon.' },
      { date: '1312', fait: 'Le concile de Vienne dissout l’ordre du Temple.' },
      { date: '1314', fait: 'Jacques de Molay est brûlé, le 18 mars.' },
      { date: '1314', fait: 'Mort du roi, le 29 novembre.' },
    ],
    leSaisTu:
      'Les Templiers ont été arrêtés un vendredi 13. On lit souvent que la superstition du vendredi 13 vient de là : c’est faux. Aucun texte ne fait le rapprochement avant le XIXᵉ siècle, et la peur de ce jour est attestée bien ailleurs. La coïncidence est réelle, l’explication est une légende moderne.',
    aRetenir: [
      'Philippe IV le Bel règne de 1285 à 1314 et gouverne avec des légistes formés au droit romain.',
      'Il réunit les premiers États généraux en 1302, pendant son conflit avec le pape Boniface VIII.',
      'Il installe le Parlement de Paris et la Chambre des comptes au Palais de la Cité.',
      'Le 13 octobre 1307 il fait arrêter les Templiers ; l’ordre est dissous en 1312 et Jacques de Molay brûlé en 1314.',
      'Sous son règne, la papauté quitte Rome pour Avignon, en 1309.',
    ],
    mots: [
      {
        mot: 'Légiste',
        sens: 'Juriste formé au droit romain, conseiller du roi, qui fonde le pouvoir royal sur la loi écrite.',
      },
      {
        mot: 'États généraux',
        sens: 'Assemblée des trois ordres — clergé, noblesse, tiers état — convoquée par le roi pour le soutenir.',
      },
      {
        mot: 'Bulle',
        sens: 'Lettre solennelle du pape, scellée d’un sceau de plomb, la *bulla*, qui lui donne son nom.',
      },
    ],
    lies: ['saint-louis', 'philippe-auguste', 'louis-xi'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'Philippe IV',
      'Nogaret',
      'Templiers',
      'Jacques de Molay',
      'Boniface VIII',
      'Anagni',
      'États généraux',
      'Avignon',
      'Parlement de Paris',
      'Courtrai',
      'légistes',
      'vendredi 13',
    ],
  },
  {
    id: 'bertrand-du-guesclin',
    volet: 'personnages',
    nom: 'Bertrand du Guesclin',
    surnom: 'le connétable breton',
    dates: 'vers 1320 – 1380',
    tri: 1380,
    periode: 'moyen-age',
    emoji: '🛡️',
    roles: ['Connétable de France', 'Chef de guerre breton', 'Compagnon de Charles V'],
    origine: 'La Motte-Broons, près de Dinan, en Bretagne',
    accroche:
      'Petit noble breton sans fortune, il devient connétable de France et reprend aux Anglais, ville par ville, la moitié du royaume.',
    citations: [
      {
        texte:
          'Il n’est pas une fileuse en France qui ne filerait pour payer ma rançon.',
        contexte:
          'Au Prince Noir, qui le tenait prisonnier après Nájera en 1367 et lui laissait fixer lui-même le prix de sa liberté.',
        sens:
          'Il se taxe volontairement très haut, pour dire au vainqueur ce qu’il vaut — et parce qu’il sait que le royaume entier paiera.',
        incertaine: true,
      },
      {
        texte:
          'Il n’est frère, ni neveu, ni cousin en mon royaume qui ne vous obéisse ; et qui y manquerait m’en courroucerait tant qu’il s’en apercevrait.',
        qui: 'Charles V, en lui remettant l’épée de connétable',
        contexte:
          'Le 2 octobre 1370. Du Guesclin refusait la charge, se disant trop pauvre et de trop petite noblesse pour commander aux princes du sang.',
        sens:
          'Le roi impose un chef de guerre choisi pour sa compétence et non pour sa naissance : c’est une rupture.',
      },
      {
        texte:
          'En quelque pays que vous fassiez la guerre, les gens d’Église, les femmes, les enfants et le pauvre peuple ne sont pas vos ennemis.',
        contexte:
          'Dernières recommandations à ses capitaines, au siège de Châteauneuf-de-Randon, juillet 1380. Rapportées par son biographe Cuvelier.',
      },
    ],
    reperes: [
      'Petit noble breton, il apprend la guerre en embuscade dans les bois autour de Dinan.',
      'Vainqueur de Cocherel en mai 1364, fait prisonnier à Auray en septembre de la même année.',
      'Il emmène les Grandes Compagnies en Espagne pour délivrer la France de leurs pillages.',
      'Connétable de France — chef de toutes les armées du roi — le 2 octobre 1370.',
      'Avec Charles V, il reprend le royaume ville par ville, sans livrer de grande bataille rangée.',
      'Mort au siège de Châteauneuf-de-Randon en 1380, il est enterré à Saint-Denis, parmi les rois.',
    ],
    recit: [
      {
        titre: 'Un Breton que personne n’attendait',
        texte:
          'Il naît vers **1320** à La Motte-Broons, près de Dinan, aîné de dix enfants d’une famille noble mais pauvre. Les chroniqueurs le décrivent petit, brun, épais d’épaules, sans rien de l’allure qu’on attend d’un chevalier de roman. Il ne brillera jamais dans les tournois : il apprend la guerre dans la **guerre de Succession de Bretagne**, à la tête de quelques dizaines d’hommes, en coupant les convois, en surprenant les garnisons la nuit, en prenant les châteaux par ruse plutôt que par assaut. C’est un métier qu’on méprise alors, et c’est exactement celui dont le royaume va avoir besoin : après **Crécy** (1346) et **Poitiers** (1356), la chevalerie française s’est fait détruire deux fois en bataille rangée.',
      },
      {
        titre: 'Cocherel, Auray, Nájera',
        texte:
          'Le **16 mai 1364**, à **Cocherel**, il bat les troupes de Charles le Mauvais, roi de Navarre : le nouveau règne de **Charles V** s’ouvre sur une victoire, trois jours avant le sacre. Fait comte de Longueville, il est en revanche battu et capturé à **Auray** en septembre de la même année. Racheté, il prend alors en main les **Grandes Compagnies** — des bandes de soldats sans emploi qui vivaient en pillant les campagnes — et les emmène en Castille, débarrassant la France de ses propres routiers. À **Nájera**, le 3 avril **1367**, le **Prince Noir** l’écrase et le capture une seconde fois. Il rachète sa liberté à prix d’or, revient, et fait gagner à son candidat le trône de Castille en 1369 : la France gagne ainsi la **flotte castillane**, qui lui rendra la mer.',
      },
      {
        titre: 'Connétable, et la guerre autrement',
        texte:
          'Le **2 octobre 1370**, Charles V le fait **connétable de France**. Les deux hommes appliquent une stratégie que l’on juge alors peu glorieuse et qui va tout changer : **ne jamais accepter la bataille rangée**, laisser les grandes chevauchées anglaises traverser le pays sans les affronter, et reprendre les places fortes **une par une**, avec de l’argent, des sièges et de l’artillerie naissante. À **Pontvallain**, en décembre 1370, il surprend une armée anglaise au terme d’une marche de nuit. Puis vient la moisson : le **Poitou**, la **Saintonge**, **La Rochelle** en 1372. En 1373, le duc de Lancastre traverse la France de Calais à Bordeaux sans trouver un ennemi à combattre et arrive avec une armée en lambeaux. En **1375**, les Anglais ne tiennent plus que cinq places : **Bordeaux, Bayonne, Calais, Cherbourg et Brest**.',
      },
      {
        titre: 'Châteauneuf-de-Randon',
        texte:
          'En juillet **1380**, il assiège une petite place du Gévaudan, **Châteauneuf-de-Randon**, et tombe malade sous la chaleur. Il meurt le **13 juillet**, avant la reddition. Le gouverneur anglais s’était engagé à rendre la ville à une date fixée : les chroniqueurs racontent qu’il vint déposer les **clefs sur le cercueil** du connétable, puisque la parole donnée l’était à lui. **Charles V**, qui mourra deux mois plus tard, ordonne qu’on l’enterre à **Saint-Denis**, dans le tombeau qu’il s’était fait préparer à ses propres pieds — un honneur réservé à la famille royale. Un fils de petite noblesse bretonne repose ainsi parmi les rois de France.',
      },
      {
        titre: 'Une légende écrite en vers',
        texte:
          'Aussitôt après sa mort, un trouvère nommé **Cuvelier** compose une *Chanson de Bertrand du Guesclin* de plus de vingt mille vers, qui en fait le « dixième preux », aux côtés d’Alexandre, de César et de Charlemagne. C’est de là que viennent la plupart des scènes que l’on raconte encore : le tournoi de Rennes en armure d’emprunt, la rançon des fileuses, les réponses au Prince Noir. Il faut le savoir en le lisant : entre l’homme et le héros, il y a un poème. Les faits, eux, sont dans les comptes du royaume — et ils disent la même chose : en dix ans, la France a repris presque tout ce qu’elle avait perdu en trente.',
      },
    ],
    chrono: [
      { date: 'vers 1320', fait: 'Naissance à La Motte-Broons, près de Dinan.' },
      { date: '1357', fait: 'Défense de Rennes assiégée par les Anglais.' },
      { date: '1364', fait: 'Victoire de Cocherel, trois jours avant le sacre de Charles V.' },
      { date: '1364', fait: 'Prisonnier à Auray, en septembre.' },
      { date: '1367', fait: 'Capturé à Nájera par le Prince Noir.' },
      { date: '1370', fait: 'Connétable de France, le 2 octobre.' },
      { date: '1370', fait: 'Victoire de Pontvallain, en décembre.' },
      { date: '1372', fait: 'Reprise du Poitou, de la Saintonge et de La Rochelle.' },
      { date: '1380', fait: 'Mort au siège de Châteauneuf-de-Randon, le 13 juillet.' },
    ],
    leSaisTu:
      'Il est mort en juillet, loin de Paris, et le corps a mal supporté le voyage : on l’a divisé. Ses entrailles sont restées au Puy, ses chairs à Montferrand, son cœur à Dinan, en Bretagne, et ses ossements à Saint-Denis. Quatre tombeaux pour un seul homme, et chacun des quatre est encore visible.',
    aRetenir: [
      'Bertrand du Guesclin, petit noble breton, devient connétable de France en 1370.',
      'Avec Charles V, il reprend le royaume ville par ville et refuse les grandes batailles rangées.',
      'Vainqueur à Cocherel (1364) et à Pontvallain (1370), il est deux fois fait prisonnier, à Auray et à Nájera.',
      'En 1375, les Anglais ne tiennent plus en France que Bordeaux, Bayonne, Calais, Cherbourg et Brest.',
      'Mort en 1380, il est enterré à Saint-Denis, aux pieds du tombeau du roi.',
    ],
    mots: [
      {
        mot: 'Connétable',
        sens: 'Chef suprême des armées du roi : la plus haute charge militaire du royaume.',
      },
      {
        mot: 'Chevauchée',
        sens: 'Raid de dévastation mené en terre ennemie pour ruiner ses ressources et humilier son roi.',
      },
      {
        mot: 'Grandes Compagnies',
        sens: 'Bandes de soldats sans emploi entre deux trêves, qui vivaient en pillant les campagnes.',
      },
    ],
    lies: ['jeanne-d-arc', 'charles-vii', 'philippe-auguste'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Du Guesclin',
      'connétable',
      'Cocherel',
      'Auray',
      'Nájera',
      'Pontvallain',
      'Châteauneuf-de-Randon',
      'Charles V',
      'Bretagne',
      'Grandes Compagnies',
      'guerre de Cent Ans',
      'Saint-Denis',
    ],
  },
  {
    id: 'jacques-coeur',
    volet: 'personnages',
    nom: 'Jacques Cœur',
    surnom: 'l’argentier du roi',
    dates: 'vers 1395 – 1456',
    tri: 1456,
    periode: 'moyen-age',
    emoji: '⛵',
    roles: ['Argentier de Charles VII', 'Marchand', 'Armateur'],
    origine: 'Bourges, en Berry',
    accroche:
      'Fils d’un pelletier de Bourges, il devient l’homme le plus riche de France, paie la reconquête de la Normandie — et perd tout en un jour.',
    citations: [
      {
        texte: 'À vaillans cuers riens impossible.',
        contexte:
          'Sa devise, sculptée partout dans son palais de Bourges : sur les cheminées, au-dessus des portes, dans la pierre des escaliers.',
        sens:
          '« À vaillant cœur, rien d’impossible. » La devise joue sur son nom : le fils d’un marchand de Bourges est devenu le premier négociant d’Occident.',
      },
      {
        texte: 'En bouche close n’entre mouche.',
        contexte:
          'Proverbe gravé dans la pierre de son hôtel de Bourges, à côté de sa devise et de ses coquilles Saint-Jacques.',
        sens:
          'Qui se tait ne s’expose pas : la prudence d’un marchand qui traitait à la fois avec le roi, le pape et le sultan d’Égypte.',
      },
      {
        texte: 'Le roi fait ce qu’il peut, Jacques Cœur fait ce qu’il veut.',
        contexte:
          'Mot qui courait sur la fortune de l’argentier. Aucun témoin de l’époque ne le date ni ne le signe.',
        sens:
          'Il dit la jalousie qu’un marchand plus riche que les princes soulevait à la cour — et annonce sa chute.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un marchand pelletier de Bourges, il devient l’homme le plus riche du royaume.',
      'Argentier de Charles VII à partir de 1439 : il fournit la cour et avance l’argent du roi.',
      'Sept galées à lui, qui relient Montpellier à Damas, Beyrouth et Alexandrie.',
      'Il prête deux cent mille écus pour la reconquête de la Normandie, en 1449.',
      'Arrêté en 1451, condamné en 1453, il s’évade et meurt au service du pape en 1456.',
      'Son palais de Bourges est la plus belle maison privée que le Moyen Âge français ait laissée.',
    ],
    recit: [
      {
        titre: 'Le fils du pelletier',
        texte:
          'Il naît vers **1395** à **Bourges**, fils d’un marchand de fourrures, dans la ville où Charles VII va bientôt tenir sa cour de roi sans royaume. Il épouse la fille du prévôt, travaille à l’atelier monétaire — il y est condamné en 1429 pour avoir altéré la monnaie, puis gracié — et comprend avant tout le monde où est l’argent : au **Levant**. En **1432**, il embarque pour Damas et Alexandrie. Le voyage tourne au désastre : naufrage en Corse, dépouillé, il rentre ruiné. Il repart. C’est cette obstination que sa devise finira par résumer dans la pierre de son palais.',
      },
      {
        titre: 'L’argentier du roi',
        texte:
          'En **1439**, Charles VII le nomme **argentier**. La charge consiste à fournir la cour : draps d’or, fourrures, armures, bijoux, épices — et à en tenir les comptes. Jacques Cœur en fait tout autre chose. Il **avance** au roi l’argent qu’il n’a pas, se rembourse sur les impôts qu’on lui confie, siège au Conseil, devient commissaire aux **États du Languedoc**, maître des monnaies, ambassadeur à Gênes et auprès du pape. Anobli en **1441**, il place les siens : un frère évêque, un fils archevêque de Bourges à vingt-quatre ans. Aucun roturier, avant lui, n’était monté si haut dans le royaume de France.',
      },
      {
        titre: 'Les galées de la Méditerranée',
        texte:
          'Son idée est simple et neuve : au lieu d’acheter aux **Vénitiens** et aux **Génois** les soieries, les épices et l’alun qui viennent d’Orient, aller les chercher soi-même. Il arme jusqu’à **sept galées**, obtient en **1446** l’autorisation pontificale de commercer avec les pays musulmans, installe ses comptoirs à **Montpellier** et à Marseille, ses facteurs à Damas, à Beyrouth, à Alexandrie, à Rhodes, à Florence, à Bruges. Il exploite des mines d’argent et de cuivre en Lyonnais et en Beaujolais. Il fait bâtir à Bourges un **palais** dont les fenêtres sculptées montrent des serviteurs de pierre penchés, guettant le retour du maître. Trois cents personnes travaillent pour lui.',
      },
      {
        titre: 'L’argent qui gagne la guerre',
        texte:
          'En **1449**, Charles VII lance la reconquête de la **Normandie**. Il faut payer les compagnies, les vivres, et surtout l’**artillerie** des frères Bureau, qui coûte une fortune. Jacques Cœur prête **deux cent mille écus**. La campagne dure un an : soixante villes reprises, la victoire de **Formigny** en avril **1450**, Cherbourg en août. Quatre ans plus tard, **Castillon** met fin à la guerre de Cent Ans. Les manuels retiennent les canons ; ils ont été achetés avec l’argent d’un marchand de Bourges, qui écrivit au roi que tout ce qu’il possédait était à lui.',
      },
      {
        titre: 'La chute, en un jour',
        texte:
          'Le **31 juillet 1451**, il est arrêté sur ordre du roi. La première accusation — avoir empoisonné **Agnès Sorel**, la favorite morte l’année précédente — s’effondre faute de preuve. Restent les autres : altération de monnaie, vente d’armes au sultan, abus de sa charge, un rameur retenu de force sur une galée. Le tribunal est composé, pour une bonne part, de ses propres **débiteurs**. Condamné le **29 mai 1453** à l’amende honorable, à quatre cent mille écus d’amende, à la confiscation de tous ses biens et au bannissement, il s’évade en 1454 et gagne **Rome**. Le pape **Calixte III** lui confie le commandement d’une flotte contre les Turcs : il meurt sur l’île de **Chio**, le 25 novembre **1456**. Louis XI rendra plus tard une part de ses biens à ses fils.',
      },
    ],
    chrono: [
      { date: 'vers 1395', fait: 'Naissance à Bourges, fils d’un marchand pelletier.' },
      { date: '1432', fait: 'Voyage au Levant ; il rentre naufragé et ruiné.' },
      { date: '1439', fait: 'Argentier du roi Charles VII.' },
      { date: '1441', fait: 'Anobli par le roi.' },
      { date: '1446', fait: 'Le pape l’autorise à commercer avec les pays musulmans.' },
      { date: '1449', fait: 'Il prête deux cent mille écus pour la reconquête de la Normandie.' },
      { date: '1451', fait: 'Arrêté le 31 juillet, sur ordre du roi.' },
      { date: '1453', fait: 'Condamné, dépouillé de ses biens et banni.' },
      { date: '1456', fait: 'Mort sur l’île de Chio, au service du pape.' },
    ],
    leSaisTu:
      'Son palais de Bourges se lit comme une signature : partout, sculptés dans la pierre, des cœurs et des coquilles Saint-Jacques — « Jacques » et « Cœur ». Et au-dessus de l’entrée, deux fausses fenêtres où un serviteur et une servante de pierre se penchent pour guetter l’arrivée du maître. Ils guettent encore.',
    aRetenir: [
      'Jacques Cœur, fils d’un marchand de Bourges, devient argentier de Charles VII en 1439.',
      'Il ouvre à la France le commerce direct avec le Levant, avec une flotte de sept galées.',
      'Ses prêts financent la reconquête de la Normandie en 1449 et 1450.',
      'Arrêté en 1451 et condamné en 1453, il s’évade et meurt en 1456 au service du pape.',
      'Sa devise, « À vaillant cœur rien d’impossible », est sculptée dans son palais de Bourges.',
    ],
    mots: [
      {
        mot: 'Argentier',
        sens: 'Officier chargé de fournir la cour du roi en étoffes, bijoux, armes et épices, et d’en tenir les comptes.',
      },
      {
        mot: 'Galée',
        sens: 'Navire de commerce méditerranéen, à rames et à voiles, armé pour se défendre des pirates.',
      },
      {
        mot: 'Amende honorable',
        sens: 'Peine publique : le condamné demande pardon à genoux, en chemise, un cierge à la main.',
      },
    ],
    lies: ['charles-vii', 'louis-xi', 'jeanne-d-arc'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Jacques Cœur',
      'Bourges',
      'argentier',
      'Levant',
      'galées',
      'Charles VII',
      'Montpellier',
      'palais Jacques-Cœur',
      'commerce',
      'Agnès Sorel',
      'Chio',
    ],
  },
  {
    id: 'charles-vii',
    volet: 'personnages',
    nom: 'Charles VII',
    surnom: 'le Victorieux',
    dates: '1403 – 1461',
    tri: 1461,
    periode: 'moyen-age',
    emoji: '⚜️',
    roles: [
      'Roi de France',
      'Vainqueur de la guerre de Cent Ans',
      'Fondateur de l’armée permanente',
    ],
    origine: 'Paris, hôtel Saint-Pol',
    accroche:
      'Déshérité à dix-sept ans, sacré à Reims par Jeanne d’Arc, il gagne la guerre de Cent Ans et laisse à la France une armée et un impôt permanents.',
    citations: [
      {
        texte:
          'Que nul, de quelque état qu’il soit, ne soit si hardi d’assembler gens d’armes sans congé et licence du roi.',
        qui: 'L’ordonnance d’Orléans, 2 novembre 1439',
        contexte:
          'Article lu dans tout le royaume : nul seigneur ne peut plus lever de troupes pour son compte.',
        sens:
          'Le roi seul a le droit d’avoir une armée, et l’impôt qui la paie. C’est l’acte de naissance de l’État moderne en France.',
      },
      {
        texte:
          'Nous voulons savoir la vérité dudit procès et la manière selon laquelle il a été conduit.',
        contexte:
          'Lettres du 15 février 1450 ordonnant la première enquête sur le procès de Rouen, qui aboutira à la réhabilitation de Jeanne d’Arc.',
        sens:
          'Le roi sacré par la Pucelle ne peut pas laisser dire qu’une sorcière l’a couronné : son propre titre est en jeu.',
      },
      {
        texte:
          'Sire, voilà le trou par lequel les Anglais sont entrés en France.',
        qui: 'Un chartreux de Dijon, montrant le crâne de Jean sans Peur',
        contexte:
          'Mot adressé à François Ier un siècle plus tard : le duc de Bourgogne avait été tué en 1419 devant le dauphin, ce qui jeta la Bourgogne dans l’alliance anglaise.',
        incertaine: true,
      },
    ],
    reperes: [
      'Déshérité par le traité de Troyes en 1420, il se proclame roi en 1422 : on l’appelle « le roi de Bourges ».',
      'Jeanne d’Arc le fait sacrer à Reims le 17 juillet 1429 : il devient le roi légitime.',
      'Le traité d’Arras, en 1435, lui ramène le duc de Bourgogne et isole les Anglais.',
      'En 1439, la taille devient un impôt permanent, levé sans l’accord de personne.',
      'En 1445, les compagnies d’ordonnance forment la première armée permanente d’Europe.',
      'Normandie reprise en un an, Guyenne en 1453 : la guerre de Cent Ans est gagnée.',
    ],
    recit: [
      {
        titre: 'L’héritier d’un royaume en morceaux',
        texte:
          'Il naît à Paris en **1403**, onzième enfant de **Charles VI**, roi frappé de folie depuis 1392, et d’Isabeau de Bavière. Le royaume se déchire entre **Armagnacs** et **Bourguignons**. La mort de ses frères aînés fait de lui le **dauphin** à quatorze ans ; l’année suivante, il fuit Paris de nuit. Le **10 septembre 1419**, sur le pont de **Montereau**, le duc **Jean sans Peur** est tué au cours d’une entrevue tenue en sa présence : la Bourgogne bascule aussitôt dans le camp anglais. Le **traité de Troyes**, en **1420**, marie Henri V à sa sœur, le fait héritier du trône de France et désigne le dauphin comme « soi-disant » fils du roi. En 1422, Charles VI et Henri V meurent la même année. Le dauphin se proclame roi à Mehun-sur-Yèvre. Sa frontière est la Loire.',
      },
      {
        titre: 'Reims, 17 juillet 1429',
        texte:
          'Une jeune fille de Lorraine arrive à **Chinon** en février 1429 et lui dit qu’elle le conduira au sacre. **Orléans** est délivrée le 8 mai, la Loire nettoyée en six semaines, et le **17 juillet 1429**, dans la cathédrale de **Reims**, Charles est oint de l’huile de la Sainte Ampoule et couronné, la bannière de **Jeanne d’Arc** à ses côtés. Ce n’est pas une cérémonie : c’est l’argument décisif. Depuis Clovis, le roi de France est celui que Reims a sacré. Quand les Anglais font couronner le petit Henri VI à Paris, en décembre 1431, il est trop tard et ce n’est pas le bon lieu. Le royaume a désormais un seul roi reconnu.',
      },
      {
        titre: 'Arras, 1435 : la vraie victoire',
        texte:
          'La guerre ne se gagne pourtant pas sur un sacre. Elle se gagne le jour où **Philippe le Bon**, duc de Bourgogne, quitte l’alliance anglaise. C’est le **traité d’Arras**, en **1435** : Charles VII fait amende publique pour le meurtre de Montereau, abandonne au duc des villes et des droits, et achète ainsi la neutralité du plus puissant prince d’Occident. Les Anglais restent seuls. **Paris** rouvre ses portes au roi l’année suivante, après seize ans d’occupation. Il faudra encore mater la révolte des grands seigneurs — la **Praguerie**, en 1440, où figure son propre fils, le dauphin Louis — avant que le royaume obéisse d’un seul mouvement.',
      },
      {
        titre: 'L’impôt, l’armée, les canons',
        texte:
          'Vient alors l’œuvre pour laquelle on l’a surnommé « le Bien Servi ». L’**ordonnance d’Orléans**, en **1439**, rend la **taille** permanente : le roi lève l’impôt chaque année, sans réunir les États, et interdit à quiconque d’assembler des gens d’armes sans son congé. En **1445**, quinze **compagnies d’ordonnance** de cent lances chacune — près de neuf mille hommes payés toute l’année — deviennent la **première armée permanente d’Europe** ; les **francs-archers** suivent en 1448. Les frères **Jean et Gaspard Bureau** réorganisent l’artillerie : canons plus légers, montés sur affûts, poudre en grains, servis par des professionnels. Un impôt régulier et une armée à demeure : les deux piliers de l’État français sont posés.',
      },
      {
        titre: 'Normandie et Guyenne',
        texte:
          'En **1449**, l’armée neuve entre en Normandie. En un an, soixante villes tombent. Le **15 avril 1450**, à **Formigny**, les canons des Bureau ouvrent les rangs des archers anglais avant le choc : la tactique qui avait fait Crécy et Azincourt ne fonctionne plus. Cherbourg se rend en août ; la Normandie est française. Bordeaux et Bayonne suivent en 1451. La Guyenne, anglaise depuis trois siècles, se soulève et rappelle **Talbot** ; le **17 juillet 1453**, à **Castillon**, l’artillerie française retranchée brise sa charge et le vieux capitaine y meurt. Bordeaux capitule le 19 octobre. Aucun traité n’est signé : la **guerre de Cent Ans** s’arrête, simplement. De tout le royaume, les Anglais ne gardent que **Calais**.',
      },
      {
        titre: 'Le roi bien servi',
        texte:
          'Le reste du règne bâtit. La **Pragmatique Sanction de Bourges** (1438) donne au roi la haute main sur les nominations de l’Église de France. Les finances sont remises en ordre — **Jacques Cœur** y tient sa place jusqu’à sa chute. En **1450**, Charles VII ordonne l’enquête qui aboutira, en **1456**, à l’annulation du procès de Rouen et à la **réhabilitation de Jeanne d’Arc**. Ses dernières années sont assombries par son fils : le dauphin **Louis**, révolté, s’est réfugié depuis 1456 chez le duc de Bourgogne et attend. Le roi meurt le **22 juillet 1461** à Mehun-sur-Yèvre. Il avait reçu la moitié d’un royaume occupé ; il laisse un pays entier, avec une armée, un impôt et un État.',
      },
    ],
    chrono: [
      { date: '1403', fait: 'Naissance à Paris.' },
      { date: '1419', fait: 'Jean sans Peur tué à Montereau, en sa présence.' },
      { date: '1420', fait: 'Le traité de Troyes le déshérite.' },
      { date: '1422', fait: 'Il se proclame roi à Mehun-sur-Yèvre.' },
      { date: '1429', fait: 'Sacre à Reims, le 17 juillet, avec Jeanne d’Arc.' },
      { date: '1435', fait: 'Traité d’Arras : la Bourgogne quitte l’alliance anglaise.' },
      { date: '1439', fait: 'Ordonnance d’Orléans : la taille devient permanente.' },
      { date: '1445', fait: 'Compagnies d’ordonnance : la première armée permanente.' },
      { date: '1450', fait: 'Victoire de Formigny ; la Normandie est reprise.' },
      { date: '1453', fait: 'Castillon : la guerre de Cent Ans s’achève.' },
      { date: '1456', fait: 'Réhabilitation de Jeanne d’Arc.' },
      { date: '1461', fait: 'Mort à Mehun-sur-Yèvre, le 22 juillet.' },
    ],
    leSaisTu:
      'Castillon, le 17 juillet 1453, est la première grande bataille de l’histoire gagnée par l’artillerie : trois cents bouches à feu tiraient du camp français. John Talbot, soixante-six ans, avait juré en échange de sa libération de ne plus jamais porter les armes contre le roi de France. Il tint parole à la lettre et chargea sans armure ni épée. Il y fut tué.',
    aRetenir: [
      'Charles VII règne de 1422 à 1461 ; déshérité par le traité de Troyes, il est sacré à Reims en 1429 grâce à Jeanne d’Arc.',
      'Le traité d’Arras, en 1435, lui rend l’alliance du duc de Bourgogne et isole les Anglais.',
      'L’ordonnance de 1439 rend la taille permanente : le roi lève l’impôt et lui seul peut lever des troupes.',
      'Les compagnies d’ordonnance, créées en 1445, forment la première armée permanente d’Europe.',
      'Formigny (1450) et Castillon (1453) mettent fin à la guerre de Cent Ans ; il ne reste aux Anglais que Calais.',
      'Il fait réhabiliter Jeanne d’Arc en 1456.',
    ],
    mots: [
      {
        mot: 'Taille',
        sens: 'Impôt direct levé sur les non-nobles ; permanent à partir de 1439, il paie l’armée du roi.',
      },
      {
        mot: 'Compagnie d’ordonnance',
        sens: 'Unité de cavalerie entretenue toute l’année par le roi et payée sur l’impôt.',
      },
      {
        mot: 'Pragmatique Sanction',
        sens: 'Ordonnance de 1438 qui donne au roi la haute main sur les nominations dans l’Église de France.',
      },
    ],
    lies: ['jeanne-d-arc', 'jacques-coeur', 'louis-xi', 'bertrand-du-guesclin'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Charles VII',
      'roi de Bourges',
      'Reims',
      'Jeanne d’Arc',
      'traité de Troyes',
      'traité d’Arras',
      'Formigny',
      'Castillon',
      'taille',
      'compagnies d’ordonnance',
      'Agnès Sorel',
      'guerre de Cent Ans',
    ],
  },
  {
    id: 'louis-xi',
    volet: 'personnages',
    nom: 'Louis XI',
    surnom: 'le prudent',
    dates: '1423 – 1483',
    tri: 1483,
    periode: 'moyen-age',
    emoji: '📯',
    roles: ['Roi de France', 'Diplomate', 'Bâtisseur du royaume'],
    origine: 'Bourges, en Berry',
    accroche:
      'Il gagne par la négociation, l’argent et le secret ce que d’autres perdent par les armes — et agrandit le royaume d’un tiers en vingt-deux ans.',
    citations: [
      {
        texte: 'Qui ne sait dissimuler ne sait régner.',
        contexte:
          'Devise prêtée à Louis XI. L’adage latin — *Qui nescit dissimulare nescit regnare* — est bien plus ancien que lui, et lui est resté attaché.',
        sens:
          'Il gouverne par la négociation, l’argent et le secret plutôt que par la bataille, et il tient cela pour un métier.',
        incertaine: true,
      },
      {
        texte:
          'De tous ceux que j’ai jamais connus, le plus habile à se tirer d’un mauvais pas au temps de l’adversité, c’était le roi Louis.',
        qui: 'Philippe de Commynes, son conseiller',
        contexte:
          'Dans ses *Mémoires*, écrits après la mort du roi par l’homme qui l’avait servi dix ans et qui l’avait d’abord combattu.',
      },
      {
        texte: 'Mon cousin de Bourgogne nourrit le renard qui mangera ses poules.',
        qui: 'Charles VII, son père',
        contexte:
          'En apprenant que le duc Philippe le Bon accueillait à sa cour le dauphin Louis, réfugié chez lui en 1456.',
        incertaine: true,
      },
      {
        texte: 'J’en ai tâté moi-même, huit mois durant, sous un autre roi.',
        qui: 'Philippe de Commynes, à propos des cages de fer',
        contexte:
          '*Mémoires* : le conseiller de Louis XI connut à son tour la cage, sous le règne suivant.',
        sens:
          'Il en tire une leçon : ceux qui inventent ces prisons finissent souvent par y entrer.',
      },
    ],
    reperes: [
      'Fils de Charles VII, il se révolte contre son père à dix-sept ans et vit cinq ans chez le duc de Bourgogne.',
      'Roi en 1461, il préfère la négociation, l’argent et les alliances à la bataille rangée.',
      'Son grand adversaire est Charles le Téméraire, duc de Bourgogne, tué devant Nancy en 1477.',
      'Il organise des relais de chevaucheurs : la poste du roi porte ses ordres en quelques jours.',
      'Bourgogne, Picardie, Anjou, Maine, Provence : le royaume s’agrandit d’un tiers sous son règne.',
      'Il lance les foires de Lyon et fait venir en France les métiers de la soie.',
    ],
    recit: [
      {
        titre: 'Le dauphin rebelle',
        texte:
          'Il naît à **Bourges** en **1423**, dans le royaume réduit de son père. À dix-sept ans, il prend la tête de la **Praguerie**, la révolte des grands seigneurs contre Charles VII — et il est pardonné. Envoyé gouverner le **Dauphiné** en 1447, il le tient comme un État à lui : il y fonde l’université de Valence, y installe un parlement, y lève des impôts, y mène sa propre diplomatie. En **1456**, son père envoie une armée : Louis s’enfuit chez **Philippe le Bon**, duc de Bourgogne, et passe cinq ans à observer, depuis Genappe, la plus fastueuse cour d’Europe et ses faiblesses. Il en retiendra tout.',
      },
      {
        titre: 'Le roi contre les princes',
        texte:
          'Roi en **1461**, il écarte les serviteurs de son père et heurte aussitôt les grands. En **1465**, ceux-ci se coalisent dans la **Ligue du Bien public** — son propre frère, le duc de Bretagne, le comte de Charolais — et l’affrontent à **Montlhéry**, bataille indécise dont chacun se dit vainqueur. Louis cède tout : villes, pensions, apanages. Puis il reprend, une pièce à la fois, par le traité ou par l’argent. En octobre **1468**, il commet la faute de sa vie : il va négocier en personne à **Péronne** avec **Charles le Téméraire**, qui le retient prisonnier et l’oblige à l’accompagner au châtiment de Liège révoltée. Humiliation complète — et trois ans plus tard, plus rien de ce qu’il a signé ne tient.',
      },
      {
        titre: 'La chute du Téméraire',
        texte:
          'Charles le Téméraire veut relever entre la France et l’Empire le royaume de Lotharingie, de la Hollande à la Bourgogne. Louis ne lui livre pas bataille : il **paie** ses ennemis. Les cantons **suisses**, le duc de Lorraine, l’empereur reçoivent son or. Le Téméraire est battu à Grandson et à Morat en 1476, puis tué devant **Nancy** le **5 janvier 1477** ; on retrouve son corps dans un étang gelé. Louis saisit aussitôt le **duché de Bourgogne**, la **Picardie**, l’**Artois**. L’héritière, **Marie de Bourgogne**, épouse **Maximilien de Habsbourg** : les riches Pays-Bas échappent à la France et le traité d’**Arras** (1482) ouvre, pour deux siècles, la rivalité avec la maison d’Autriche. En **1481**, l’**Anjou**, le **Maine** et la **Provence** — donc Marseille — entrent dans le royaume par héritage.',
      },
      {
        titre: 'L’État qui travaille',
        texte:
          'Il gouverne comme un marchand tient boutique : lui-même, tout le temps, dans le détail. Il dicte des lettres jour et nuit — deux mille nous sont parvenues — et met en place des relais de **chevaucheurs** de quatre lieues en quatre lieues : la **poste du roi**, qui fait circuler les ordres et les nouvelles à une vitesse inconnue jusque-là. Il crée les **foires de Lyon** (1463) pour détourner vers la France l’argent qui allait à Genève, installe les métiers de la **soie** à Lyon puis à Tours, relance les mines, protège les premiers ateliers d’**imprimerie**, réunit les Parlements de province. Il voyage sans cesse, mal vêtu, et parle à tout le monde : marchands, sergents, valets. L’information est son arme principale.',
      },
      {
        titre: 'Les cages et la peur',
        texte:
          'Le règne a sa part sombre, qu’il faut dire dans son temps. La trahison d’un grand officier est alors, dans toute l’Europe, un crime capital — et Louis XI en a subi beaucoup. Le cardinal **Balue**, qui renseignait le Téméraire, passe onze ans en prison. Le connétable de **Saint-Pol**, qui négociait à la fois avec la France, la Bourgogne et l’Angleterre, est jugé par le Parlement et exécuté en 1475 ; le duc de **Nemours** suit en 1477. Les **cages** de bois cerclé de fer, que l’on appelait les « fillettes du roi », servaient à tenir ces prisonniers d’État. **Commynes**, qui l’a servi dix ans, le juge sans complaisance mais sans caricature : un roi redouté, épuisant pour ses serviteurs, et qui obtenait ce que les armes n’obtenaient pas.',
      },
      {
        titre: 'Le Plessis-lez-Tours',
        texte:
          'Frappé d’une attaque en 1481, il se retire au **Plessis-lez-Tours**, entouré de gardes. Il fait venir de Calabre un ermite réputé saint, **François de Paule**, réclame les reliques du royaume et la Sainte Ampoule, s’habille de gros drap gris. Il prépare son fils au métier en lui faisant écrire le *Rosier des guerres*. Il meurt le **30 août 1483**, à soixante ans. Il laisse un royaume agrandi d’un tiers, en paix, doté d’un trésor plein, de l’armée permanente de son père, de la poste et des foires — et une couronne que plus aucun grand seigneur ne conteste. La France sort du Moyen Âge sous ce règne-là.',
      },
    ],
    chrono: [
      { date: '1423', fait: 'Naissance à Bourges.' },
      { date: '1440', fait: 'La Praguerie : à dix-sept ans, il se révolte contre son père.' },
      { date: '1456', fait: 'Il se réfugie chez le duc de Bourgogne.' },
      { date: '1461', fait: 'Roi de France, le 22 juillet.' },
      { date: '1465', fait: 'Ligue du Bien public ; bataille de Montlhéry.' },
      { date: '1468', fait: 'Entrevue de Péronne, où il est retenu prisonnier.' },
      { date: '1477', fait: 'Mort de Charles le Téméraire devant Nancy.' },
      { date: '1481', fait: 'Anjou, Maine et Provence entrent dans le royaume.' },
      { date: '1482', fait: 'Traité d’Arras avec les Habsbourg.' },
      { date: '1483', fait: 'Mort au Plessis-lez-Tours, le 30 août.' },
    ],
    leSaisTu:
      'Il s’habillait de gros drap gris et portait un vieux chapeau couvert de petites médailles de plomb représentant des saints. Commynes, qui le servit dix ans, raconte qu’il jurait ses serments les plus graves sur une croix de plomb dite de Saint-Lô — et que celui-là, entre tous, il n’osait pas le rompre.',
    aRetenir: [
      'Louis XI règne de 1461 à 1483 ; il gouverne par la diplomatie, l’argent et l’information plus que par la guerre.',
      'Son adversaire Charles le Téméraire, duc de Bourgogne, meurt devant Nancy en 1477.',
      'Le roi récupère alors la Bourgogne, la Picardie et l’Artois ; les Pays-Bas passent aux Habsbourg.',
      'L’Anjou, le Maine et la Provence entrent dans le royaume en 1481.',
      'Il organise la poste du roi et lance les foires de Lyon.',
    ],
    mots: [
      {
        mot: 'Apanage',
        sens: 'Terre donnée par le roi à un fils cadet ; elle revient à la couronne si la lignée s’éteint.',
      },
      {
        mot: 'Foire',
        sens: 'Grand marché périodique autorisé par le roi, où l’on vient acheter et changer de l’argent de toute l’Europe.',
      },
      {
        mot: 'Duché de Bourgogne',
        sens: 'Principauté des ducs Valois, la plus riche d’Occident, qui s’étendait de Dijon aux Pays-Bas.',
      },
    ],
    lies: ['charles-vii', 'jacques-coeur', 'philippe-le-bel'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la fin du Moyen Âge',
    tags: [
      'Louis XI',
      'Charles le Téméraire',
      'Péronne',
      'Nancy',
      'Bourgogne',
      'poste du roi',
      'foires de Lyon',
      'Plessis-lez-Tours',
      'Commynes',
      'Ligue du Bien public',
      'le prudent',
    ],
  },
]
