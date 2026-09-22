// -----------------------------------------------------------------------------
// MOYEN ÂGE — la couronne de France : Blanche de Castille, Saint Louis,
// Jeanne d'Arc.
//
// CE LOT EST LE MODÈLE. Les autres lots de l'encyclopédie s'écrivent sur son
// patron : la citation d'abord, des repères qu'on lit en trente secondes, un
// récit dense en trois à cinq blocs, une frise, une anecdote, ce qui tombe au
// contrôle. Le guide de rédaction complet est dans `docs/encyclopedie.md`.
//
// Le ton, ici, est celui que le projet a choisi : ces trois-là ont fondé,
// gouverné et tenu un royaume, et on les raconte DANS LEUR TEMPS — leur foi
// prise au sérieux comme moteur de leurs actes, leurs échecs dits sans ironie,
// aucun clin d'œil moqueur au lecteur d'aujourd'hui.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_MOYEN_AGE_ROIS: Personnage[] = [
  {
    id: 'blanche-de-castille',
    volet: 'personnages',
    nom: 'Blanche de Castille',
    surnom: 'la reine qui tint le royaume',
    dates: '1188 – 1252',
    tri: 1252,
    periode: 'moyen-age',
    emoji: '👑',
    roles: ['Reine de France', 'Régente du royaume', 'Mère de Saint Louis'],
    origine: 'Palencia, royaume de Castille',
    accroche:
      'Deux fois régente, elle gouverne la France quand son fils est un enfant, puis quand il est en croisade — et rend un royaume intact.',
    citations: [
      {
        texte:
          'Je vous aime plus que tout être vivant ; mais j’aimerais mieux vous voir mort à mes pieds que de vous savoir coupable d’un péché mortel.',
        contexte: 'À son fils Louis, enfant. Rapporté par Jean de Joinville.',
        sens:
          'Elle place l’honneur de l’âme au-dessus de tout, même de l’amour d’une mère : c’est cette exigence qui fera de son fils un roi juste.',
      },
      {
        texte: 'Ces enfants de France ne mourront pas de faim.',
        contexte:
          'Lors d’une famine, en faisant ouvrir les greniers royaux et distribuer le blé, vers 1240.',
        incertaine: true,
      },
    ],
    reperes: [
      'Petite-fille d’Aliénor d’Aquitaine, elle épouse à 12 ans le futur Louis VIII.',
      'Veuve en 1226, elle devient régente pour son fils Louis IX, âgé de 12 ans.',
      'Les grands barons se révoltent contre « l’étrangère » : elle les brise en deux ans.',
      'Seconde régence de 1248 à 1252, pendant que Saint Louis est en croisade.',
      'Elle fonde des abbayes, protège les pauvres et surveille l’éducation de ses onze enfants.',
    ],
    recit: [
      {
        titre: 'Une Espagnole sur le trône de France',
        texte:
          'Née à **Palencia** en 1188, Blanche est la fille du roi de Castille et la petite-fille d’**Aliénor d’Aquitaine**. C’est Aliénor elle-même, à plus de quatre-vingts ans, qui traverse les Pyrénées pour aller chercher sa petite-fille et la marier au futur **Louis VIII** : la France et la Castille scellent ainsi la paix avec l’Angleterre. Blanche a douze ans. Elle apprend le français, la cour, le gouvernement, et donne onze enfants au roi. Quand Louis VIII meurt brutalement en **1226**, elle a trente-huit ans, un fils de douze ans sur les bras, et un royaume que tout le monde croit à prendre.',
      },
      {
        titre: 'La régente que personne n’attendait',
        texte:
          'Les **grands barons** — Thibaud de Champagne, Pierre Mauclerc, le comte de Boulogne — refusent d’obéir à une femme, qui plus est étrangère. Ils s’allient au roi d’Angleterre et marchent sur le jeune roi. Blanche fait **sacrer Louis IX à Reims en trois semaines**, avant que la coalition n’ait le temps de se former : un roi sacré n’est plus un enfant qu’on dépose, c’est l’oint du Seigneur. Puis elle négocie, divise, achète, et frappe quand il le faut. En **1229**, le traité de Paris met fin à la croisade contre les Albigeois et rattache le **Languedoc** à la couronne. En quatre ans, la régente a sauvé la dynastie et agrandi le royaume.',
      },
      {
        titre: 'Le gouvernement d’une reine',
        texte:
          'Blanche gouverne avec une poigne rare : elle préside le Conseil, reçoit les ambassadeurs, lève les impôts, tranche les procès. Elle achète des reliques, fonde l’abbaye de **Maubuisson**, soutient les ordres mendiants. On lui reproche sa sévérité ; on ne lui reproche jamais une injustice. En **1248**, quand Louis IX part en croisade, il ne confie pas le royaume à un oncle ou à un connétable : il le confie à sa mère. Elle a soixante ans. Elle tiendra quatre ans de plus, matant une révolte de paysans (la « croisade des Pastoureaux ») et gardant la paix jusqu’à sa mort, en **1252**. Son fils, en Terre sainte, apprendra la nouvelle plusieurs mois plus tard et pleurera deux jours durant.',
      },
    ],
    chrono: [
      { date: '1188', fait: 'Naissance à Palencia, en Castille.' },
      { date: '1200', fait: 'Mariage avec le futur Louis VIII de France.' },
      { date: '1226', fait: 'Mort de Louis VIII : elle devient régente.' },
      { date: '1226', fait: 'Sacre éclair de Louis IX à Reims.' },
      { date: '1229', fait: 'Traité de Paris : le Languedoc entre dans le royaume.' },
      { date: '1248', fait: 'Seconde régence, Saint Louis part en croisade.' },
      { date: '1252', fait: 'Mort à Paris, le royaume intact.' },
    ],
    leSaisTu:
      'Les barons révoltés racontaient partout qu’elle était la maîtresse du légat du pape pour la salir. Blanche répondit en convoquant une assemblée de prélats et de barons, et en se déclarant prête à se soumettre au jugement de l’Église. L’accusation s’effondra : personne n’osa la soutenir en face.',
    aRetenir: [
      'Blanche de Castille est régente de France deux fois : de 1226 à 1234, puis de 1248 à 1252.',
      'Elle fait sacrer son fils Louis IX à Reims dès 1226 pour couper court à la révolte des barons.',
      'Le traité de Paris de 1229 rattache le Languedoc à la couronne.',
      'Elle gouverne pendant la première croisade de Saint Louis et meurt en 1252.',
    ],
    mots: [
      {
        mot: 'Régence',
        sens: 'Gouvernement exercé au nom d’un roi trop jeune, absent ou empêché.',
      },
      {
        mot: 'Sacre',
        sens: 'Cérémonie religieuse à Reims où le roi est oint d’huile sainte : elle le rend intouchable.',
      },
    ],
    lies: ['saint-louis', 'alienor-d-aquitaine', 'philippe-auguste'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'régente',
      'reine',
      'Castille',
      'Reims',
      'barons',
      'Maubuisson',
      'mère de Saint Louis',
      'Languedoc',
    ],
  },
  {
    id: 'saint-louis',
    volet: 'personnages',
    nom: 'Saint Louis',
    surnom: 'le roi qui rendait la justice sous un chêne',
    dates: '1214 – 1270',
    tri: 1270,
    periode: 'moyen-age',
    emoji: '⚖️',
    roles: ['Roi de France', 'Saint', 'Croisé'],
    origine: 'Poissy, royaume de France',
    accroche:
      'Roi de France pendant quarante-quatre ans, il fait de la justice le premier devoir du pouvoir — et devient l’arbitre de l’Europe.',
    citations: [
      {
        texte:
          'Cher fils, si tu viens à régner, aie ce qui convient à un roi : sois si juste que jamais tu ne t’écartes de la justice, quoi qu’il advienne.',
        contexte: 'Enseignements laissés à son fils Philippe, peu avant sa mort, 1270.',
        sens:
          'Pour Louis IX, un roi n’est pas propriétaire de son royaume : il en répond devant Dieu, et la justice est ce dont il répondra d’abord.',
      },
      {
        texte:
          'Il s’asseyait au pied d’un chêne, et tous ceux qui avaient affaire à lui venaient lui parler, sans qu’aucun huissier les écarte.',
        qui: 'Jean de Joinville, son compagnon de croisade',
        contexte: '*Vie de Saint Louis*, écrite vers 1309, au bois de Vincennes.',
        sens:
          'La scène la plus célèbre du Moyen Âge français : le roi accessible à tous, même au plus pauvre, sans intermédiaire et sans argent à verser.',
      },
      {
        texte: 'Faites-vous aimer du peuple de votre royaume.',
        contexte: 'Enseignements à Philippe, 1270.',
      },
    ],
    reperes: [
      'Roi à 12 ans, en 1226 ; sa mère Blanche de Castille gouverne jusqu’en 1234.',
      'Il crée des enquêteurs royaux chargés de réparer les abus de ses propres agents.',
      'Il interdit le duel judiciaire et la guerre privée entre seigneurs.',
      'Il achète la Couronne d’épines et bâtit la Sainte-Chapelle pour l’abriter (1248).',
      'Deux croisades, deux échecs : prisonnier en Égypte en 1250, mort devant Tunis en 1270.',
      'Canonisé en 1297, vingt-sept ans après sa mort.',
    ],
    recit: [
      {
        titre: 'Le roi que sa mère a formé',
        texte:
          'Louis IX a douze ans quand son père meurt. **Blanche de Castille** tient le royaume et l’élève dans une exigence rare : messe quotidienne, latin, lecture, et l’idée, martelée, qu’un roi est d’abord un homme qui rendra des comptes. Il prend seul le pouvoir vers 1234 et gouverne quarante-quatre ans. Grand, maigre, habillé simplement, il lave les pieds des pauvres le Jeudi saint et sert à table les mendiants qu’il fait entrer au palais. Rien de tout cela n’est une faiblesse politique : c’est **la source de son autorité**. Un roi qui se soumet lui-même à la loi de Dieu peut exiger que les barons se soumettent à la sienne.',
      },
      {
        titre: 'La justice comme métier de roi',
        texte:
          'Son œuvre la plus durable n’est ni une bataille ni une croisade : c’est la **justice royale**. Il envoie dans tout le royaume des **enquêteurs** chargés d’écouter les plaintes contre ses propres baillis et sénéchaux, et de rembourser les victimes — un roi qui enquête sur son administration, c’est inédit. Il interdit le **duel judiciaire** (où l’on prouvait son droit par les armes) et le remplace par la preuve et le témoignage. Il interdit les **guerres privées** entre seigneurs. Il permet de faire appel devant la cour du roi contre le jugement d’un seigneur : le **Parlement** de Paris naît là. Il frappe une monnaie royale qui a cours partout. Et il s’assoit sous le chêne de **Vincennes** pour écouter qui veut lui parler. L’Europe entière le prend pour arbitre : Henri III d’Angleterre et ses barons acceptent son verdict en 1264.',
      },
      {
        titre: 'Le roi très chrétien',
        texte:
          'Sa foi commande tout. Il achète à l’empereur de Constantinople la **Couronne d’épines** et fait bâtir, pour l’abriter, la **Sainte-Chapelle** : deux étages de vitraux montés en sept ans, la plus belle châsse jamais construite. Il fonde des hôpitaux, l’hospice des **Quinze-Vingts** pour trois cents aveugles, des abbayes, et soutient l’université de Paris et le collège fondé par son chapelain **Robert de Sorbon**. Cette même foi a son revers d’époque : il durcit la législation contre les juifs, fait brûler des exemplaires du Talmud en 1242 et impose des marques distinctives — mesures que son siècle réclamait et que l’histoire ne cache pas.',
      },
      {
        titre: 'Deux croisades, deux échecs',
        texte:
          'En **1248**, il part pour l’Égypte avec quinze mille hommes. Damiette tombe, puis l’armée s’enlise : battu à **Mansourah**, Louis est fait **prisonnier** en 1250 et racheté contre une rançon énorme. Il reste quatre ans en Terre sainte à fortifier les places chrétiennes plutôt que de rentrer. En **1270**, malgré son âge et sa santé ruinée, il repart — vers **Tunis** cette fois. L’épidémie (dysenterie ou typhus) emporte l’armée sur la plage. Il meurt le **25 août 1270**, couché sur un lit de cendres, à cinquante-six ans. Ses os, rapportés en France, sont portés à pied par les foules. **Canonisé en 1297**, il est le seul roi de France reconnu saint par l’Église — et son règne reste, pour les siècles suivants, le modèle du bon gouvernement.',
      },
    ],
    chrono: [
      { date: '1214', fait: 'Naissance à Poissy.' },
      { date: '1226', fait: 'Sacre à Reims, à 12 ans ; régence de Blanche de Castille.' },
      { date: '1242', fait: 'Victoire de Taillebourg sur le roi d’Angleterre.' },
      { date: '1248', fait: 'Consécration de la Sainte-Chapelle ; départ en croisade.' },
      { date: '1250', fait: 'Défaite de Mansourah : le roi est fait prisonnier en Égypte.' },
      { date: '1254', fait: 'Retour en France ; grande ordonnance de réforme du royaume.' },
      { date: '1264', fait: 'Il arbitre le conflit entre le roi d’Angleterre et ses barons.' },
      { date: '1270', fait: 'Mort devant Tunis, le 25 août.' },
      { date: '1297', fait: 'Canonisation par le pape Boniface VIII.' },
    ],
    leSaisTu:
      'La Couronne d’épines lui a coûté 135 000 livres — plus de deux fois le prix de la Sainte-Chapelle bâtie pour l’abriter (40 000 livres). Quand la relique arrive en France en 1239, Louis parcourt les derniers kilomètres pieds nus, en simple tunique, la portant lui-même sur ses épaules.',
    aRetenir: [
      'Louis IX règne de 1226 à 1270 ; sa mère Blanche de Castille assure la régence jusqu’en 1234.',
      'Il renforce la justice royale : enquêteurs, appel au roi, fin du duel judiciaire et des guerres privées.',
      'Il fait construire la Sainte-Chapelle (achevée en 1248) pour abriter la Couronne d’épines.',
      'Il mène deux croisades, est capturé en Égypte en 1250 et meurt devant Tunis en 1270.',
      'Canonisé en 1297, il est le seul roi de France déclaré saint.',
    ],
    mots: [
      {
        mot: 'Bailli',
        sens: 'Agent du roi qui rend la justice et perçoit l’impôt dans une région, au nom du souverain.',
      },
      {
        mot: 'Enquêteur royal',
        sens: 'Envoyé du roi chargé de recueillir les plaintes contre les agents royaux et de réparer leurs abus.',
      },
      {
        mot: 'Croisade',
        sens: 'Expédition militaire chrétienne vers la Terre sainte, prêchée par l’Église.',
      },
    ],
    lies: ['blanche-de-castille', 'philippe-auguste', 'premiere-croisade', 'construction-des-cathedrales'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'Louis IX',
      'chêne de Vincennes',
      'Sainte-Chapelle',
      'croisade',
      'justice royale',
      'Joinville',
      'Mansourah',
      'canonisé',
    ],
  },
  {
    id: 'jeanne-d-arc',
    volet: 'personnages',
    nom: 'Jeanne d’Arc',
    surnom: 'la Pucelle d’Orléans',
    dates: 'vers 1412 – 1431',
    tri: 1431,
    periode: 'moyen-age',
    emoji: '⚔️',
    roles: ['Chef de guerre', 'Sainte', 'Paysanne de Lorraine'],
    origine: 'Domrémy, Lorraine',
    accroche:
      'À dix-sept ans, une paysanne convainc un roi, délivre Orléans en neuf jours et le fait sacrer à Reims — puis meurt sur un bûcher à dix-neuf.',
    citations: [
      {
        texte:
          'De l’amour ou de la haine que Dieu a pour les Anglais, je ne sais rien ; mais je sais bien qu’ils seront boutés hors de France, excepté ceux qui y mourront.',
        contexte: 'Réponse à ses juges, procès de Rouen, 1431.',
        sens:
          'Ses juges veulent la piéger : si elle dit que Dieu hait les Anglais, elle blasphème. Elle esquive et répond sur le seul terrain qu’elle connaît : la France sera libérée.',
      },
      {
        texte: 'Je suis née pour cela.',
        contexte:
          'À ceux qui s’étonnent qu’une fille de dix-sept ans prétende commander une armée, 1429.',
      },
      {
        texte: 'Les gens d’armes batailleront, et Dieu donnera la victoire.',
        contexte: 'Avant l’assaut, à ses capitaines.',
        sens:
          'Elle ne promet pas un miracle qui remplacerait le combat : elle demande qu’on se batte, et attend de Dieu l’issue.',
      },
      {
        texte:
          'Rendez à la Pucelle envoyée de par Dieu les clefs de toutes les bonnes villes que vous avez prises et violées en France.',
        contexte: 'Lettre dictée aux chefs anglais, 22 mars 1429.',
      },
    ],
    reperes: [
      'Fille de laboureurs à Domrémy, elle ne sait ni lire ni écrire.',
      'Vers 13 ans, elle dit entendre des voix : sainte Catherine, sainte Marguerite, saint Michel.',
      'Février 1429 : elle traverse 600 km en territoire ennemi pour rejoindre Chinon.',
      '8 mai 1429 : le siège d’Orléans est levé en neuf jours.',
      '17 juillet 1429 : Charles VII est sacré à Reims, elle tient sa bannière.',
      '30 mai 1431 : brûlée à Rouen à dix-neuf ans ; réhabilitée en 1456, canonisée en 1920.',
    ],
    recit: [
      {
        titre: 'Un royaume coupé en deux',
        texte:
          'La **guerre de Cent Ans** dure depuis quatre-vingt-dix ans. Après le désastre d’**Azincourt** (1415), le **traité de Troyes** (1420) déshérite le dauphin Charles et promet la couronne de France au roi d’Angleterre. Paris, la Normandie, la Champagne sont occupées ; les **Bourguignons**, alliés des Anglais, tiennent le reste. Le dauphin, replié au sud de la Loire, n’a ni argent, ni armée, ni légitimité — on l’appelle en dérision « le roi de Bourges ». En 1428, les Anglais mettent le siège devant **Orléans** : si la ville tombe, la Loire est franchie et le royaume perdu.',
      },
      {
        titre: 'De Domrémy à Chinon',
        texte:
          'Jeanne a grandi à **Domrémy**, un village de Lorraine brûlé deux fois par les bandes armées. Vers treize ans, dans le jardin de son père, elle dit entendre des **voix** qui lui commandent de faire lever le siège d’Orléans et de conduire le dauphin au sacre. Elle finit par convaincre le capitaine de **Vaucouleurs**, Robert de Baudricourt, qui lui donne une escorte de six hommes. Onze jours de chevauchée de nuit, six cents kilomètres en pays ennemi, et elle arrive à **Chinon** en février 1429. La cour l’examine : des théologiens l’interrogent trois semaines à Poitiers, des matrones vérifient qu’elle est vierge — on ne confie pas une armée à une inconnue. Elle sort blanchie de l’épreuve. Charles lui donne une armure, une bannière et des hommes.',
      },
      {
        titre: 'Orléans, en neuf jours',
        texte:
          'Le **29 avril 1429**, elle entre dans Orléans assiégée. Elle fait ce que les capitaines n’osaient plus : attaquer les bastilles anglaises les unes après les autres. Le 7 mai, blessée d’une flèche à l’épaule devant le fort des **Tourelles**, elle revient au combat le soir même ; la position tombe. Le **8 mai**, les Anglais lèvent le siège. En six semaines, la campagne de la Loire balaie l’ennemi : **Jargeau, Meung, Beaugency**, puis la victoire en rase campagne de **Patay** (18 juin). Jeanne impose alors l’impensable : marcher sur **Reims**, à travers deux cents kilomètres de terres bourguignonnes, pour faire sacrer le dauphin. Les villes ouvrent leurs portes. Le **17 juillet 1429**, Charles est oint et couronné dans la cathédrale, la bannière de Jeanne à ses côtés. Il est désormais **Charles VII**, roi sacré — et le roi d’Angleterre n’est plus qu’un prétendant.',
      },
      {
        titre: 'Compiègne, Rouen, le bûcher',
        texte:
          'L’élan retombe : l’assaut sur Paris échoue en septembre 1429, la cour négocie plutôt que de se battre. Le **23 mai 1430**, Jeanne est capturée devant **Compiègne** par les Bourguignons, qui la vendent aux Anglais pour dix mille livres. La cour de Charles VII ne paie pas de rançon. On la juge à **Rouen**, devant un tribunal d’Église présidé par l’évêque **Pierre Cauchon**, gagné aux Anglais : il ne s’agit pas de justice, il s’agit de prouver que le roi de France a été sacré par une sorcière. Seule, sans avocat, illettrée, elle tient tête pendant des mois à une quinzaine de docteurs en théologie ; les minutes du procès conservent ses réponses, et elles sont d’une intelligence redoutable. Condamnée pour **hérésie**, elle est brûlée vive le **30 mai 1431**, place du Vieux-Marché. Les témoins rapportent qu’elle demanda une croix et mourut en criant le nom de Jésus. Elle avait dix-neuf ans.',
      },
      {
        titre: 'Réhabilitée, puis sainte',
        texte:
          'Vingt-cinq ans plus tard, **Charles VII** fait rouvrir le procès : en **1456**, la sentence de Rouen est annulée et Jeanne déclarée innocente. Les Anglais sont chassés de France en **1453** — comme elle l’avait annoncé à ses juges. Elle est béatifiée en 1909, **canonisée en 1920**, et devient fête nationale la même année. Son histoire n’a cessé d’être réclamée par des camps opposés, mais les faits, eux, tiennent en une phrase : une adolescente sans naissance, sans instruction et sans argent a retourné une guerre de Cent Ans en dix-huit mois.',
      },
    ],
    chrono: [
      { date: 'vers 1412', fait: 'Naissance à Domrémy, en Lorraine.' },
      { date: 'février 1429', fait: 'Chevauchée jusqu’à Chinon et rencontre du dauphin.' },
      { date: '8 mai 1429', fait: 'Le siège d’Orléans est levé.' },
      { date: '18 juin 1429', fait: 'Victoire de Patay.' },
      { date: '17 juillet 1429', fait: 'Sacre de Charles VII à Reims.' },
      { date: '23 mai 1430', fait: 'Capturée devant Compiègne.' },
      { date: '30 mai 1431', fait: 'Brûlée vive à Rouen.' },
      { date: '1456', fait: 'Procès en réhabilitation : la sentence est annulée.' },
      { date: '1920', fait: 'Canonisation par le pape Benoît XV.' },
    ],
    leSaisTu:
      'Jeanne ne savait pas écrire, mais elle signait. Trois de ses lettres portent son nom tracé d’une main appliquée — « Jehanne » — appris par cœur comme un dessin. L’une d’elles, adressée aux habitants de Riom, est conservée avec la signature encore parfaitement lisible.',
    aRetenir: [
      'Jeanne d’Arc est née vers 1412 à Domrémy et dit entendre des voix lui ordonnant de délivrer le royaume.',
      'En 1429, elle fait lever le siège d’Orléans (8 mai) puis conduire Charles VII au sacre de Reims (17 juillet).',
      'Capturée à Compiègne en 1430, vendue aux Anglais, elle est jugée à Rouen pour hérésie.',
      'Elle est brûlée vive le 30 mai 1431, réhabilitée en 1456 et canonisée en 1920.',
      'Son action marque le tournant de la guerre de Cent Ans, que la France gagne en 1453.',
    ],
    mots: [
      {
        mot: 'Dauphin',
        sens: 'Titre du fils aîné du roi de France, héritier du trône.',
      },
      {
        mot: 'Hérésie',
        sens: 'Croyance jugée contraire à la doctrine de l’Église ; au Moyen Âge, un crime passible du bûcher.',
      },
      {
        mot: 'Réhabilitation',
        sens: 'Procès qui annule une condamnation et rend son honneur au condamné.',
      },
    ],
    lies: ['charles-vii', 'guerre-de-cent-ans', 'siege-d-orleans', 'sacre-de-charles-vii', 'christine-de-pizan'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Pucelle',
      'Orléans',
      'Domrémy',
      'Reims',
      'Rouen',
      'bûcher',
      'Charles VII',
      'guerre de Cent Ans',
      'voix',
      'Cauchon',
    ],
  },
]
