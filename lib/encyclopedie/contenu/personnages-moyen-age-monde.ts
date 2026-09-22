// -----------------------------------------------------------------------------
// MOYEN ÂGE — le monde, et pas seulement le royaume : Mahomet, Saladin,
// François d'Assise, Gengis Khan, Thomas d'Aquin, Marco Polo, Christine de
// Pizan.
//
// Le programme de 5e croise TROIS MONDES — la chrétienté latine, l'islam, les
// empires d'Asie — et c'est exactement ce que ce lot raconte : des gens qui ont
// fondé une religion, tenu une ville sainte, bâti un empire, réconcilié la foi
// et la raison, rapporté la Chine, ou pris la plume pour défendre les femmes.
//
// LE TON EST LE MÊME POUR TOUS. Les figures religieuses — le prophète de
// l'islam comme le saint d'Assise ou le docteur dominicain — sont racontées
// avec respect et dans leur temps : ce que la tradition rapporte est donné
// comme tel, ce que l'histoire établit est daté, et rien n'est tourné en
// dérision. Saladin est l'adversaire chevaleresque que ses ennemis chrétiens
// ont eux-mêmes admiré, et on l'écrit. Le guide de rédaction est dans
// `docs/encyclopedie.md` ; le modèle du lot est
// `personnages-moyen-age-rois.ts`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_MOYEN_AGE_MONDE: Personnage[] = [
  {
    id: 'mahomet',
    volet: 'personnages',
    nom: 'Mahomet',
    surnom: 'le Prophète de l’islam',
    dates: 'vers 570 – 632',
    tri: 632,
    periode: 'moyen-age',
    emoji: '🕌',
    roles: ['Prophète de l’islam', 'Chef d’une communauté', 'Marchand de La Mecque'],
    origine: 'La Mecque, Arabie',
    accroche:
      'Marchand de La Mecque, il prêche à partir de 610 un Dieu unique, fonde à Médine la première communauté musulmane et unifie l’Arabie.',
    citations: [
      {
        texte: 'Lis, au nom de ton Seigneur qui a créé, qui a créé l’homme d’une adhérence.',
        contexte:
          'Coran, sourate 96. Selon la tradition musulmane, les premiers mots révélés dans la grotte de Hirâ’, vers 610.',
        sens:
          'Le mot « Coran » signifie « récitation » : la religion commence par un ordre de lire et de dire à voix haute.',
      },
      {
        texte:
          'Dis : Il est Dieu, l’Unique. Dieu, le recours suprême. Il n’a pas engendré et n’a pas été engendré, et nul n’est égal à Lui.',
        contexte: 'Coran, sourate 112, *al-Ikhlâs*, « le monothéisme pur ».',
        sens:
          'Quatre lignes qui résument toute la prédication de La Mecque et que tout musulman connaît par cœur : Dieu est un, sans famille et sans image.',
      },
      {
        texte:
          'Un Arabe n’a aucune supériorité sur un non-Arabe, ni un non-Arabe sur un Arabe, sinon par la piété.',
        contexte:
          'Sermon de l’Adieu, au pèlerinage de La Mecque, en mars 632, trois mois avant sa mort. Rapporté par la tradition.',
        sens:
          'Dans une Arabie où la tribu décidait de tout, la communauté des croyants se dit ouverte à qui la rejoint, quelle que soit sa naissance.',
      },
      {
        texte: 'Point de contrainte en religion.',
        contexte: 'Coran, sourate 2, verset 256.',
      },
    ],
    reperes: [
      'Né vers 570 à La Mecque, orphelin très tôt, élevé par son grand-père puis par son oncle Abû Tâlib.',
      'Marchand caravanier, il épouse Khadidja, une riche négociante de quinze ans son aînée.',
      'Vers 610, dans la grotte de Hirâ’, il dit recevoir la révélation par l’ange Gabriel.',
      'En 622, l’Hégire : il quitte La Mecque pour Yathrib, qui devient Médine — an 1 du calendrier musulman.',
      'En 630, il entre sans combat à La Mecque et voue la Kaaba au Dieu unique.',
      'À sa mort en 632, presque toute l’Arabie est rassemblée sous l’islam.',
    ],
    recit: [
      {
        titre: 'La Mecque, une ville de caravanes',
        texte:
          'Au VIᵉ siècle, **La Mecque** n’est ni un port ni une capitale : c’est une étape de caravanes entre le Yémen et la Syrie, tenue par la tribu de **Quraych**. Sa fortune vient d’un sanctuaire, la **Kaaba**, un cube de pierre où l’on vient honorer trois cents idoles — et où les tribus s’interdisent de se battre pendant les mois sacrés. L’Arabie est **polythéiste**, mais elle connaît les juifs et les chrétiens, nombreux au Yémen et sur les routes du nord. Mahomet naît là vers 570, orphelin de père avant sa naissance, de mère à six ans. Il travaille aux caravanes pour une riche veuve, **Khadidja**, qui l’épouse : il a vingt-cinq ans, elle en a quarante. Tant qu’elle vivra, il n’aura pas d’autre femme.',
      },
      {
        titre: 'La révélation, puis douze ans de refus',
        texte:
          'Il a l’habitude de se retirer pour méditer dans une grotte du mont Hirâ’. C’est là, vers **610**, que la tradition musulmane place la **première révélation** : l’ange **Gabriel** lui ordonne de « lire ». Khadidja le croit la première. Le message est simple et intenable pour La Mecque : **il n’y a qu’un seul Dieu**, les idoles ne sont rien, les riches doivent aux pauvres, et chacun sera jugé. Les Quraych comprennent vite que le sanctuaire, donc leur commerce, est visé. Les premiers convertis — beaucoup d’esclaves et de pauvres — sont frappés, boycottés, affamés. En 619, Khadidja et l’oncle protecteur meurent la même année : on l’appelle **l’année de tristesse**. Mahomet est un prédicateur de cinquante ans sans protection, dans une ville qui veut sa mort.',
      },
      {
        titre: 'L’Hégire : Médine, an 1',
        texte:
          'Des habitants de **Yathrib**, une oasis divisée par des querelles de clans à 350 km au nord, lui proposent de venir arbitrer. En **622**, ses fidèles partent par petits groupes, puis lui-même : c’est l’**Hégire**, et le calendrier musulman commence ce jour-là. Yathrib devient **Médine**, « la ville du Prophète ». Là, Mahomet n’est plus seulement un prédicateur : il fait bâtir une mosquée, règle les litiges, conclut un pacte entre les clans arabes et les tribus juives de l’oasis, et fonde l’**oumma** — une communauté fondée sur la foi et non sur le sang. La guerre avec La Mecque suit : victoire à **Badr** en 624, défaite à **Uhud** en 625, siège repoussé au **Fossé** en 627.',
      },
      {
        titre: 'Le retour à La Mecque, et après',
        texte:
          'En 628, une trêve est signée à **Hudaybiyya** ; elle ouvre l’Arabie à la prédication. En **630**, Mahomet marche sur La Mecque avec dix mille hommes : la ville se rend **sans combat**. Il fait détruire les idoles de la Kaaba, qu’il consacre au Dieu unique, et amnistie ses anciens adversaires. Les tribus se rallient les unes après les autres. En mars **632**, il accomplit le pèlerinage dit **de l’Adieu** et prononce son dernier sermon ; il meurt à Médine trois mois plus tard, sans désigner clairement de successeur — d’où la question du **califat**, qui divisera l’islam entre **sunnites** et **chiites**. Ses paroles et ses actes, rassemblés par la tradition, forment la **sunna** ; la parole de Dieu, elle, est fixée par écrit vers 650 : c’est le **Coran**. En un siècle, l’empire né de Médine ira de l’Espagne à l’Indus.',
      },
    ],
    chrono: [
      { date: 'vers 570', fait: 'Naissance à La Mecque.' },
      { date: 'vers 610', fait: 'Première révélation, dans la grotte de Hirâ’.' },
      { date: '622', fait: 'L’Hégire : départ pour Médine, an 1 du calendrier musulman.' },
      { date: '624', fait: 'Victoire de Badr sur les Mecquois.' },
      { date: '628', fait: 'Trêve de Hudaybiyya avec La Mecque.' },
      { date: '630', fait: 'Entrée à La Mecque ; la Kaaba est vouée au Dieu unique.' },
      { date: '632', fait: 'Pèlerinage de l’Adieu, puis mort à Médine.' },
      { date: 'vers 650', fait: 'Le Coran est fixé par écrit sous le calife Othman.' },
    ],
    leSaisTu:
      'Le calendrier musulman ne part pas de la naissance du Prophète, mais de l’Hégire : ce qui compte n’est pas l’homme, c’est la naissance de la communauté. Et comme il suit la lune (354 jours), il gagne onze jours par an sur le nôtre — c’est pourquoi le ramadan se déplace lentement dans les saisons.',
    aRetenir: [
      'Mahomet naît vers 570 à La Mecque ; la tradition musulmane fait commencer la révélation vers 610.',
      'L’Hégire, en 622, est le départ pour Médine et l’an 1 du calendrier musulman.',
      'Il entre à La Mecque en 630 et meurt à Médine en 632, l’Arabie rassemblée.',
      'Le Coran est le livre saint de l’islam ; la sunna rassemble les paroles et les actes du Prophète.',
      'Les cinq piliers sont la profession de foi, la prière, l’aumône, le jeûne du ramadan et le pèlerinage.',
    ],
    mots: [
      {
        mot: 'Hégire',
        sens: 'Départ de Mahomet et de ses fidèles de La Mecque vers Médine, en 622 : l’an 1 du calendrier musulman.',
      },
      {
        mot: 'Coran',
        sens: 'Le livre saint de l’islam : la parole de Dieu révélée à Mahomet, fixée par écrit vers 650.',
      },
      {
        mot: 'Oumma',
        sens: 'La communauté des croyants, qui passe avant les liens de tribu et de famille.',
      },
      {
        mot: 'Kaaba',
        sens: 'Édifice cubique au centre de La Mecque, vers lequel les musulmans se tournent pour prier.',
      },
    ],
    lies: ['moise', 'jesus-de-nazareth', 'saladin', 'premiere-croisade'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ – XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Muhammad',
      'islam',
      'La Mecque',
      'Médine',
      'Hégire',
      'Coran',
      'Kaaba',
      'prophète',
      'oumma',
      'Arabie',
      'ramadan',
      'calife',
    ],
  },
  {
    id: 'saladin',
    volet: 'personnages',
    nom: 'Saladin',
    surnom: 'le sultan que ses ennemis admiraient',
    dates: '1138 – 1193',
    tri: 1193,
    periode: 'moyen-age',
    emoji: '🌙',
    roles: ['Sultan d’Égypte et de Syrie', 'Chef de guerre', 'Fondateur de la dynastie ayyoubide'],
    origine: 'Tikrit, Mésopotamie ; d’une famille kurde',
    accroche:
      'Il reprend Jérusalem aux croisés en 1187 sans laisser massacrer la ville — et devient, en Europe même, le modèle du chevalier généreux.',
    citations: [
      {
        texte:
          'Jérusalem est pour nous ce qu’elle est pour vous, et davantage : c’est le lieu d’où notre Prophète fit son voyage nocturne, et le lieu où notre communauté se rassemblera au Jour du Jugement.',
        contexte:
          'Lettre à Richard Cœur de Lion, en 1191, rapportée par son biographe Bahâ’ ad-Dîn ibn Shaddâd.',
        sens:
          'Il ne nie pas le droit des chrétiens sur la ville : il dit que le sien est au moins aussi ancien. C’est toute la question des croisades en deux lignes.',
      },
      {
        texte: 'Ce n’est pas moi qui lui ai donné à boire.',
        contexte:
          'Sous sa tente, après Hattîn, quand le roi Guy de Lusignan tend sa coupe à Renaud de Châtillon : offrir à boire vaut promesse de vie sauve.',
        sens:
          'Guy est épargné ; Renaud, qui avait rompu la trêve et pillé une caravane de pèlerins, est exécuté sur-le-champ. Saladin tient sa parole à la lettre.',
      },
      {
        texte:
          'Quand Dieu m’aura rendu le reste du littoral, je partagerai mes terres, je ferai mes adieux et je partirai sur la mer les combattre jusqu’à la mort.',
        contexte: 'À son biographe Bahâ’ ad-Dîn ibn Shaddâd, qui dit l’avoir entendu de sa bouche.',
      },
      {
        texte: 'Et seul, à l’écart, je vis Saladin.',
        qui: 'Dante, *La Divine Comédie*',
        contexte:
          'Chant IV de l’*Enfer*, vers 1310 : Dante place le sultan musulman parmi les grands esprits vertueux, près d’Homère et d’Aristote.',
        sens:
          'Un siècle après sa mort, un poète chrétien refuse de le damner : aucun autre adversaire de la chrétienté n’a reçu cet honneur.',
      },
    ],
    reperes: [
      'Kurde né à Tikrit en 1138, il sert d’abord Nour ad-Dîn, le maître de la Syrie.',
      'Maître de l’Égypte en 1171, il met fin au califat fatimide du Caire.',
      'Le 4 juillet 1187, il anéantit l’armée du royaume de Jérusalem à Hattîn, en Galilée.',
      'Le 2 octobre 1187, Jérusalem se rend : pas de massacre, les habitants sont rachetés.',
      'La troisième croisade le met face à Richard Cœur de Lion, sans vainqueur ni vaincu.',
      'Mort à Damas en 1193, il ne laissait pas de quoi payer son propre enterrement.',
    ],
    recit: [
      {
        titre: 'Un Kurde qui réunit l’Égypte et la Syrie',
        texte:
          'Salâh ad-Dîn Yûsuf naît en **1138** à Tikrit, dans une famille **kurde** au service des princes turcs de Syrie. Rien ne le destine au premier rôle : il aime l’étude, on le dit timide. Envoyé en **Égypte** en 1169 comme second d’une expédition, il y devient vizir, puis maître du pays en **1171**, quand il met fin au **califat fatimide** du Caire. À la mort de Nour ad-Dîn, il prend **Damas** en 1174, puis Alep et Mossoul. En quinze ans, il a fait ce qu’aucun prince musulman n’avait réussi depuis l’arrivée des croisés : **réunir l’Égypte et la Syrie sous une seule main**. Les **États latins d’Orient**, nés de la première croisade en 1099, se retrouvent pris en tenaille.',
      },
      {
        titre: 'Hattîn, le 4 juillet 1187',
        texte:
          'La trêve est rompue par **Renaud de Châtillon**, seigneur du Kerak, qui pille une caravane de pèlerins. Saladin lève l’armée. Le roi **Guy de Lusignan** commet l’erreur inverse de la prudence : il quitte ses points d’eau et traverse en plein juillet un plateau sec pour aller secourir Tibériade. Le 4 juillet, l’armée franque, épuisée et assoiffée, est encerclée aux **Cornes de Hattîn** ; la fumée de l’herbe sèche, à laquelle Saladin fait mettre le feu, achève de l’aveugler. En une journée, **le royaume de Jérusalem perd toute son armée** : les chevaliers sont capturés, la relique de la **Vraie Croix** prise. Saladin épargne le roi, fait décapiter Renaud de sa main, et exécute les moines-soldats du Temple et de l’Hôpital, qu’il tient pour irréductibles. Les villes se rendent ensuite les unes après les autres.',
      },
      {
        titre: 'Jérusalem, sans massacre',
        texte:
          'Le **2 octobre 1187**, après un court siège, **Balian d’Ibelin** négocie la reddition de Jérusalem. L’accord est chiffré : dix dinars par homme, cinq par femme, un par enfant ; qui ne paie pas devient esclave. Saladin libère lui-même des milliers de pauvres, son frère al-Adil en rachète mille, le patriarche part avec ses trésors. Il n’y a **ni massacre, ni pillage général** : les chrétiens d’Orient restent, les pèlerinages continuent, le Saint-Sépulcre rouvre. Le contraste est saisissant avec **1099**, quand les croisés avaient pris la même ville en tuant ses habitants pendant deux jours — et les chroniqueurs francs eux-mêmes le notent. C’est de là que vient, en Occident, la réputation de Saladin : non pas d’avoir gagné, mais d’avoir gagné **sans représailles**.',
      },
      {
        titre: 'Richard Cœur de Lion, puis Damas',
        texte:
          'La chute de Jérusalem déclenche la **troisième croisade** (1189-1192). L’empereur Frédéric Barberousse se noie en route, **Philippe Auguste** rentre en France, **Richard Cœur de Lion** reste. Il prend **Saint-Jean-d’Acre** en 1191 — et fait exécuter ses 2 700 prisonniers, faute de rançon versée —, bat Saladin à **Arsouf**, mais s’arrête deux fois à quelques kilomètres de Jérusalem, faute de pouvoir la tenir. Le **traité de Jaffa**, en septembre 1192, laisse la côte aux Francs et la ville sainte aux musulmans, avec **libre accès des pèlerins chrétiens**. Les deux hommes ne se rencontreront jamais, mais s’envoient des cadeaux, des médecins et des chevaux. Saladin meurt à **Damas** le 4 mars 1193, à cinquante-cinq ans : son trésor contenait quarante-sept dirhams d’argent et une pièce d’or. Tout le reste avait été donné.',
      },
    ],
    chrono: [
      { date: '1138', fait: 'Naissance à Tikrit, dans une famille kurde.' },
      { date: '1171', fait: 'Maître de l’Égypte : fin du califat fatimide.' },
      { date: '1174', fait: 'Prise de Damas : l’Égypte et la Syrie sont réunies.' },
      { date: '4 juillet 1187', fait: 'Les croisés sont anéantis à Hattîn.' },
      { date: '2 octobre 1187', fait: 'Reddition de Jérusalem, sans massacre.' },
      { date: '1189 – 1192', fait: 'Troisième croisade : Richard Cœur de Lion débarque.' },
      { date: 'septembre 1192', fait: 'Traité de Jaffa : les pèlerins chrétiens gardent l’accès.' },
      { date: '4 mars 1193', fait: 'Mort à Damas, sans fortune personnelle.' },
    ],
    leSaisTu:
      'En 1192, devant Jaffa, Richard Cœur de Lion se bat à pied, son cheval tué sous lui. Saladin, qui observe la bataille depuis l’autre camp, lui fait porter deux chevaux frais par un écuyer : un roi, dit-il, ne doit pas combattre à pied. Les deux adversaires ne se sont jamais vus de leur vie.',
    aRetenir: [
      'Saladin réunit l’Égypte et la Syrie entre 1171 et 1174, encerclant les États latins d’Orient.',
      'Il anéantit l’armée croisée à Hattîn le 4 juillet 1187 et reprend Jérusalem le 2 octobre 1187.',
      'La reddition de Jérusalem se fait sans massacre : les habitants sont rachetés ou libérés.',
      'La troisième croisade (1189-1192) l’oppose à Richard Cœur de Lion ; le traité de Jaffa laisse la ville aux musulmans et l’accès aux pèlerins chrétiens.',
      'Il meurt à Damas en 1193 ; ses adversaires chrétiens eux-mêmes en ont fait un modèle de chevalerie.',
    ],
    mots: [
      {
        mot: 'Sultan',
        sens: 'Titre d’un souverain musulman qui détient le pouvoir politique et militaire, aux côtés du calife.',
      },
      {
        mot: 'États latins d’Orient',
        sens: 'Les principautés fondées par les croisés en Terre sainte après 1099, dont le royaume de Jérusalem.',
      },
      {
        mot: 'Djihad',
        sens: 'Mot arabe signifiant « effort » ; il désigne aussi, dans les textes de l’époque, la guerre menée au nom de l’islam.',
      },
    ],
    lies: ['mahomet', 'premiere-croisade', 'saint-louis', 'philippe-auguste'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ – XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Salâh ad-Dîn',
      'Jérusalem',
      'Hattîn',
      'croisades',
      'Richard Cœur de Lion',
      'Damas',
      'Égypte',
      'sultan',
      'ayyoubide',
      'Kurde',
      'Terre sainte',
    ],
  },
  {
    id: 'saint-francois-d-assise',
    volet: 'personnages',
    nom: 'Saint François d’Assise',
    surnom: 'le pauvre d’Assise',
    dates: 'vers 1182 – 1226',
    tri: 1226,
    periode: 'moyen-age',
    emoji: '🐦',
    roles: ['Fondateur des Franciscains', 'Saint', 'Fils d’un marchand drapier'],
    origine: 'Assise, Ombrie',
    accroche:
      'Fils du plus riche drapier d’Assise, il rend ses vêtements à son père sur la place publique et fonde l’ordre des frères mineurs.',
    citations: [
      {
        texte:
          'Loué sois-tu, mon Seigneur, pour frère Soleil, qui donne le jour et par qui tu nous éclaires.',
        contexte:
          'Premiers vers du *Cantique des créatures*, composé en 1225 à Saint-Damien, alors qu’il est presque aveugle.',
        sens:
          'L’un des tout premiers textes écrits en italien et non en latin. Le monde entier y devient une famille : frère Soleil, sœur Lune, sœur Eau, frère Feu.',
      },
      {
        texte:
          'Désormais je pourrai dire librement : Notre Père qui es aux cieux — et non plus : mon père Pietro Bernardone.',
        contexte:
          'Sur la place d’Assise, vers 1206, en rendant ses vêtements à son père devant l’évêque et devant la ville.',
        sens:
          'Il ne se fâche pas contre son père : il change de famille. En renonçant à l’héritage, il choisit la pauvreté comme état définitif, pas comme punition.',
      },
      {
        texte:
          'Seigneur, fais de moi un instrument de ta paix. Là où est la haine, que je mette l’amour.',
        contexte:
          'Prière dite « de saint François ». Elle n’apparaît qu’en 1912, dans une petite revue française : François ne l’a jamais écrite.',
        sens:
          'On la garde parce qu’elle est célèbre et qu’elle résume bien son esprit, mais elle date du XXᵉ siècle : il ne faut pas la citer comme une phrase de lui.',
        incertaine: true,
      },
      {
        texte:
          'Loué sois-tu, mon Seigneur, pour notre sœur la Mort corporelle, à qui nul homme vivant ne peut échapper.',
        contexte:
          'Strophe ajoutée au *Cantique des créatures* en octobre 1226, quelques jours avant sa mort.',
      },
    ],
    reperes: [
      'Fils d’un riche drapier d’Assise, il mène d’abord une jeunesse de fête et rêve de chevalerie.',
      'Prisonnier de guerre à Pérouse puis gravement malade, il rompt avec sa vie d’avant vers 1205.',
      'Vers 1206, il rend ses habits à son père sur la place d’Assise et choisit la pauvreté.',
      'En 1209, le pape Innocent III approuve sa règle : l’ordre des frères mineurs est né.',
      'En 1219, en pleine croisade, il traverse les lignes pour parler au sultan d’Égypte.',
      'En 1224, il reçoit les stigmates à l’Alverne ; mort en 1226, canonisé deux ans plus tard.',
    ],
    recit: [
      {
        titre: 'Le fils du drapier',
        texte:
          'Assise, vers 1182 : **Pietro di Bernardone** vend du drap de Champagne et de Flandre, sa femme est française, et son fils s’appelle Giovanni — mais tout le monde dit **Francesco**, « le Français ». Il a de l’argent, des amis, une réputation de bon vivant, et une ambition de noble : devenir chevalier. La guerre entre Assise et **Pérouse** l’envoie un an en prison, vers 1202. Il en sort malade. Une seconde tentative de partir à la guerre s’arrête à Spolète, où un songe le renvoie chez lui. Dans la chapelle en ruine de **Saint-Damien**, il dit entendre le crucifix lui parler : « Va, répare ma maison, qui tombe en ruine. » Il le prend au mot et vend du drap de son père pour acheter des pierres. Pietro le fait enfermer, puis le traîne devant l’évêque pour récupérer son bien.',
      },
      {
        titre: 'La place d’Assise, vers 1206',
        texte:
          'La scène est restée. Devant l’évêque Guido, devant la ville rassemblée, François pose l’argent à terre, **retire ses vêtements** et les rend à son père. L’évêque le couvre de son manteau. Il a vingt-quatre ans et il ne possède plus rien. Il s’habille d’une tunique de bure serrée par une corde, soigne les **lépreux** dont il avait horreur, mendie sa nourriture, relève des chapelles de ses mains. Des compagnons le rejoignent : un riche marchand, un chanoine, un paysan. Ils sont douze quand ils partent à pied pour Rome demander au pape le droit de vivre ainsi. La demande est étrange — ils réclament **l’autorisation de ne rien posséder** —, mais **Innocent III** l’accorde oralement en **1209**.',
      },
      {
        titre: 'Des frères mineurs dans les villes',
        texte:
          'Ce sont les **frères mineurs**, c’est-à-dire « les plus petits » : ni moines enfermés dans une abbaye, ni propriétaires de terres, mais des prêcheurs qui vont deux par deux, travaillent de leurs mains et mendient le reste. Ils s’installent là où l’Église était la plus absente : dans les **villes** qui grossissent, sur les places, dans la langue du peuple. Avec les **dominicains**, fondés à la même époque, ils forment les **ordres mendiants**, la grande nouveauté religieuse du XIIIᵉ siècle. En **1212**, une jeune noble d’Assise, **Claire**, s’enfuit de chez elle pour le rejoindre et fonde la branche féminine. Le succès est foudroyant : au chapitre de 1221, on compte plus de trois mille frères, et François, qui ne sait pas administrer, laisse la règle à d’autres.',
      },
      {
        titre: 'Le sultan, l’Alverne, le Cantique',
        texte:
          'En **1219**, pendant la cinquième croisade, il débarque devant **Damiette**, traverse les lignes de bataille et obtient d’être reçu par le sultan d’Égypte **al-Malik al-Kâmil**, le neveu de Saladin. Il repart libre, avec un sauf-conduit : au milieu d’une guerre de religion, deux hommes se sont parlé. De retour en Italie, il monte à Greccio la première **crèche vivante** (1223). En septembre **1224**, retiré sur le mont **Alverne**, il reçoit, selon les témoins, les **stigmates** — les plaies du Christ sur son propre corps. Il devient presque aveugle. En 1225, à Saint-Damien, il compose le ***Cantique des créatures***, et y ajoute plus tard une strophe qui réconcilie l’évêque et le maire d’Assise, brouillés à mort. Il meurt le **3 octobre 1226**, couché à même la terre, et est **canonisé dès 1228**.',
      },
    ],
    chrono: [
      { date: 'vers 1182', fait: 'Naissance à Assise, en Ombrie.' },
      { date: '1202', fait: 'Guerre contre Pérouse : un an de prison.' },
      { date: 'vers 1206', fait: 'Il renonce à l’héritage de son père sur la place d’Assise.' },
      { date: '1209', fait: 'Innocent III approuve la règle des frères mineurs.' },
      { date: '1212', fait: 'Claire d’Assise le rejoint et fonde les Pauvres Dames.' },
      { date: '1219', fait: 'Rencontre du sultan al-Malik al-Kâmil devant Damiette.' },
      { date: '1223', fait: 'Première crèche vivante, à Greccio.' },
      { date: '1224', fait: 'Stigmates au mont Alverne.' },
      { date: '1225', fait: 'Composition du *Cantique des créatures*.' },
      { date: '3 octobre 1226', fait: 'Mort à la Portioncule, couché à terre.' },
      { date: '1228', fait: 'Canonisation par Grégoire IX.' },
    ],
    leSaisTu:
      'La crèche de Noël vient de lui. En 1223, dans une grotte de Greccio, il fait installer une mangeoire, de la paille, un bœuf et un âne vivants, et dire la messe devant : il voulait qu’on voie de ses yeux à quel point Dieu était né pauvre. Huit siècles plus tard, on la monte encore dans les maisons.',
    aRetenir: [
      'François d’Assise naît vers 1182 dans une riche famille de marchands et renonce à tout vers 1206.',
      'Il fonde en 1209 l’ordre des frères mineurs, ou franciscains, approuvé par Innocent III.',
      'Les ordres mendiants prêchent dans les villes, en langue du peuple, et refusent de posséder des biens.',
      'En 1219, il va parler au sultan d’Égypte al-Malik al-Kâmil en pleine croisade.',
      'Il compose le *Cantique des créatures* en 1225, l’un des premiers textes en italien, et meurt en 1226.',
    ],
    mots: [
      {
        mot: 'Ordre mendiant',
        sens: 'Ordre religieux dont les frères ne possèdent rien, vivent d’aumônes et prêchent dans les villes.',
      },
      {
        mot: 'Stigmates',
        sens: 'Marques des plaies du Christ apparues, selon les témoins, sur le corps de François en 1224.',
      },
      {
        mot: 'Règle',
        sens: 'Texte qui fixe la vie d’une communauté religieuse : prière, travail, pauvreté, obéissance.',
      },
    ],
    lies: ['saint-benoit', 'thomas-d-aquin', 'saint-louis', 'naissance-des-universites'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'François d’Assise',
      'Assise',
      'franciscains',
      'frères mineurs',
      'ordre mendiant',
      'pauvreté',
      'Cantique des créatures',
      'stigmates',
      'Claire d’Assise',
      'crèche',
    ],
  },
  {
    id: 'gengis-khan',
    volet: 'personnages',
    nom: 'Gengis Khan',
    surnom: 'le souverain universel',
    dates: 'vers 1162 – 1227',
    tri: 1227,
    periode: 'moyen-age',
    emoji: '🐎',
    roles: ['Fondateur de l’Empire mongol', 'Chef de guerre', 'Législateur'],
    origine: 'Les rives de l’Onon, dans la steppe mongole',
    accroche:
      'Orphelin d’une tribu de la steppe, il unifie les Mongols en 1206 et bâtit en vingt ans le plus grand empire d’un seul tenant de l’histoire.',
    citations: [
      {
        texte:
          'Je suis le châtiment de Dieu. Si vous n’aviez pas commis de grands péchés, Dieu ne m’aurait pas envoyé contre vous.',
        contexte:
          'Aux notables de Boukhara, dans la grande mosquée, en 1220. Rapporté par le chroniqueur persan Juvaynî, une génération plus tard.',
        sens:
          'La terreur est une arme de guerre à part entière : une ville qui se rendait était épargnée, une ville qui résistait était rasée — et il fallait que cela se sache.',
      },
      {
        texte:
          'Je porte les mêmes vêtements et je mange la même nourriture que les bouviers et les palefreniers.',
        contexte:
          'Lettre au sage taoïste Qiu Chuji, qu’il fait venir de Chine en 1219 ; le texte de la lettre a été conservé.',
        sens:
          'Un chef de la steppe ne se distingue pas par le luxe mais par le partage du butin : c’est ce qui lui a valu la fidélité absolue de ses cavaliers.',
      },
      {
        texte:
          'Le plus grand bonheur est de vaincre ses ennemis, de les chasser devant soi et de leur prendre leurs biens.',
        contexte:
          'Phrase rapportée par le chroniqueur persan Rachid ad-Dîn, près d’un siècle après sa mort.',
        sens:
          'Elle décrit bien la guerre mongole, mais aucune source du vivant de Gengis Khan ne la contient : on la lui prête, on ne la lui attribue pas.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né Temüjin vers 1162 ; son père est empoisonné, sa famille chassée, il grandit dans la misère.',
      'En 1206, une assemblée des tribus le proclame Gengis Khan, « le souverain universel ».',
      'Il brise les tribus et réorganise son armée par dizaines, centaines, milliers et dix milliers.',
      'La Yassa, sa loi, vaut pour tout l’empire, y compris pour sa propre famille.',
      'Entre 1219 et 1221, il détruit l’empire du Khwarezm : Boukhara, Samarcande, Merv.',
      'À sa mort en 1227, l’empire va de la mer de Chine à la Caspienne.',
    ],
    recit: [
      {
        titre: 'Temüjin, l’orphelin de la steppe',
        texte:
          'Il s’appelle **Temüjin**. Son père, un petit chef mongol, est empoisonné par des Tatars alors qu’il a neuf ans ; le clan abandonne aussitôt la veuve et ses enfants, qui survivent de racines, de marmottes et de poissons. Il est capturé par une tribu rivale, porte le carcan de bois, s’évade. Sa jeune femme **Börte** est enlevée : il la reprend en s’alliant à **Toghrul**, le chef des Kereyit, et à son frère juré **Jamuqa**. Puis il les combat tous les deux. Dans la steppe, la loyauté ne va pas au sang mais au chef qui nourrit ses hommes, et Temüjin a compris cela avant les autres : il **promeut au mérite**, partage le butin en parts égales et exécute ceux qui trahissent leur maître, même en sa faveur.',
      },
      {
        titre: '1206 : le khan de tous les Mongols',
        texte:
          'En **1206**, une grande assemblée des tribus, le *kouriltaï*, réunie au bord de l’**Onon**, le proclame **Gengis Khan** — « le souverain universel ». Il a quarante-quatre ans et il fait aussitôt l’inverse de ce qu’on attendait : au lieu de récompenser les tribus, il les **démonte**. Les guerriers sont redistribués en unités de dix, cent, mille et dix mille, mélangés exprès, commandés par des chefs qu’il nomme. Les liens de clan disparaissent, l’unité militaire devient la seule famille. Il crée une garde personnelle de dix mille hommes, la *keshig*, où chaque commandant doit envoyer un fils — c’est à la fois une école d’officiers et un lot d’otages. Il adopte l’**alphabet ouïgour** pour écrire le mongol, jusque-là sans écriture, et fait mettre par écrit sa loi, la **Yassa**.',
      },
      {
        titre: 'Une armée qui ne marche pas : elle galope',
        texte:
          'Toute l’armée est à cheval, chaque cavalier menant trois à cinq montures de rechange : elle avance deux fois plus vite qu’une armée d’Europe et n’a pas de train de ravitaillement, puisqu’elle vit sur le pays. L’**arc composite** en bois, corne et tendon tire à plus de cent cinquante mètres depuis la selle. La tactique favorite est la **fausse fuite** : on recule en désordre pendant des heures, l’ennemi rompt ses rangs pour poursuivre, on se retourne. Pour les villes, Gengis Khan fait ce qu’aucun nomade n’avait fait : il **enrôle les ingénieurs** chinois et persans capturés, et emmène avec lui catapultes, béliers et poudre. Un service de courriers à relais, le *yam*, porte ses ordres à plus de trois cents kilomètres par jour à travers l’empire.',
      },
      {
        titre: 'La Chine, le Khwarezm, une tombe introuvable',
        texte:
          'En **1211**, il attaque la Chine des **Jin** ; **Zhongdu**, l’actuelle Pékin, tombe en 1215. À l’ouest, il propose d’abord un **traité de commerce** au chah du **Khwarezm** — un empire immense, de la Perse à l’Aral. Le gouverneur d’Otrar fait massacrer la caravane de quatre cent cinquante marchands, puis les ambassadeurs envoyés réclamer justice. La réponse dure deux ans : **Boukhara**, **Samarcande**, **Merv**, **Nishapur** sont prises et leurs habitants massacrés ou déportés ; les chroniqueurs persans avancent des chiffres énormes que les historiens discutent encore. Gengis Khan meurt le **18 août 1227**, pendant la campagne contre les Xi Xia. Ses fils et petits-fils pousseront jusqu’à la **Hongrie** en 1241 et régneront sur la Chine. La **paix mongole** qui suit rouvre la route de la soie d’un bout à l’autre : c’est elle qui rendra possible le voyage de Marco Polo.',
      },
    ],
    chrono: [
      { date: 'vers 1162', fait: 'Naissance de Temüjin, au bord de l’Onon.' },
      { date: '1206', fait: 'Proclamé Gengis Khan par l’assemblée des tribus.' },
      { date: '1211', fait: 'Début de la guerre contre la Chine des Jin.' },
      { date: '1215', fait: 'Prise de Zhongdu, l’actuelle Pékin.' },
      { date: '1219 – 1221', fait: 'Destruction de l’empire du Khwarezm.' },
      { date: '1223', fait: 'Raid mongol en Russie : bataille de la Kalka.' },
      { date: '18 août 1227', fait: 'Mort pendant la campagne contre les Xi Xia.' },
      { date: '1241', fait: 'Ses successeurs atteignent la Hongrie et la Pologne.' },
    ],
    leSaisTu:
      'Personne ne sait où il est enterré. L’escorte qui a mené son corps dans la steppe aurait tué tous ceux qu’elle croisait en chemin, puis fait piétiner la tombe par un millier de chevaux pour en effacer la trace. Huit siècles de recherches, et les satellites par-dessus, n’ont toujours rien donné.',
    aRetenir: [
      'Temüjin est proclamé Gengis Khan en 1206 : les tribus mongoles sont unifiées.',
      'Son armée de cavaliers archers, organisée par dizaines, conquiert la Chine du Nord puis l’Asie centrale.',
      'La Yassa est la loi commune de l’empire ; elle s’impose aussi à la famille du khan.',
      'À sa mort en 1227, l’Empire mongol va de la mer de Chine à la Caspienne.',
      'La paix mongole rouvre la route de la soie, que Marco Polo empruntera cinquante ans plus tard.',
    ],
    mots: [
      {
        mot: 'Steppe',
        sens: 'Immense plaine d’herbe sans arbres, d’Europe orientale à la Mongolie, domaine des éleveurs nomades.',
      },
      {
        mot: 'Khan',
        sens: 'Titre du chef d’un peuple de la steppe ; le « grand khan » commande à tous les autres.',
      },
      {
        mot: 'Yassa',
        sens: 'Le code de lois de Gengis Khan, valable dans tout l’empire et pour tous, y compris les princes.',
      },
      {
        mot: 'Nomade',
        sens: 'Qui n’a pas d’habitation fixe et se déplace avec ses troupeaux selon les saisons.',
      },
    ],
    lies: ['marco-polo', 'saint-louis', 'grande-peste'],
    niveaux: ['5e'],
    programme: 'Des mondes en contact : l’Asie, la route de la soie et l’Occident',
    tags: [
      'Temüjin',
      'Mongols',
      'steppe',
      'empire mongol',
      'Yassa',
      'cavaliers archers',
      'Boukhara',
      'Samarcande',
      'route de la soie',
      'khan',
      'Kubilaï',
    ],
  },
  {
    id: 'thomas-d-aquin',
    volet: 'personnages',
    nom: 'Thomas d’Aquin',
    surnom: 'le docteur angélique',
    dates: '1225 – 1274',
    tri: 1274,
    periode: 'moyen-age',
    emoji: '✒️',
    roles: ['Frère dominicain', 'Théologien', 'Maître à l’université de Paris', 'Saint'],
    origine: 'Roccasecca, royaume de Sicile',
    accroche:
      'Fils de comte enfermé un an par sa famille pour l’empêcher d’être moine, il devient le maître qui réconcilie la foi chrétienne et la raison d’Aristote.',
    citations: [
      {
        texte: 'La grâce ne détruit pas la nature : elle l’achève.',
        contexte:
          '*Somme théologique*, première partie, question 1. La formule qui résume toute son œuvre.',
        sens:
          'La foi ne remplace pas l’intelligence et ne la contredit pas : elle la mène plus loin. C’est ce qui autorise un chrétien à lire Aristote, un philosophe païen.',
      },
      {
        texte:
          'La loi n’est rien d’autre qu’une ordonnance de la raison, en vue du bien commun, promulguée par celui qui a la charge de la communauté.',
        contexte:
          '*Somme théologique*, question 90, sur la loi. Définition reprise par les juristes pendant cinq siècles.',
        sens:
          'Une loi n’est pas juste parce qu’un puissant l’a dite : elle doit être raisonnable et viser le bien de tous. Sinon, dit-il, ce n’est plus une loi mais une violence.',
      },
      {
        texte: 'Tout ce que j’ai écrit me semble de la paille.',
        contexte:
          'À son secrétaire Réginald, qui le pressait de terminer la *Somme*, après le 6 décembre 1273. Il n’écrivit plus une ligne.',
        sens:
          'Après une expérience de prière qu’il refusa d’expliquer, l’homme de huit millions de mots s’est tu. Il est mort trois mois plus tard.',
      },
      {
        texte: 'Je crains l’homme d’un seul livre.',
        contexte:
          'Formule latine (*Timeo hominem unius libri*) qu’on lui prête depuis le XVIIᵉ siècle : elle ne se trouve dans aucun de ses écrits.',
        sens:
          'Selon les époques, on l’a comprise comme un éloge de celui qui maîtrise à fond un seul ouvrage, ou comme une méfiance envers celui qui n’en a lu qu’un.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un comte italien, offert à cinq ans à l’abbaye du Mont-Cassin, qu’il devait diriger.',
      'À dix-neuf ans, il choisit les dominicains, un ordre mendiant : ses frères l’enlèvent et l’enferment un an.',
      'Élève d’Albert le Grand à Paris puis à Cologne, il enseigne à l’université de Paris dès 1256.',
      'Il lit Aristote dans des traductions venues du monde arabe, commentées par Averroès.',
      'Sa *Somme théologique*, inachevée, compte 512 questions et plus de deux mille cinq cents articles.',
      'Mort en 1274 en allant au concile de Lyon ; canonisé en 1323.',
    ],
    recit: [
      {
        titre: 'Un fils de comte enlevé par ses frères',
        texte:
          'Thomas naît en **1225** au château de Roccasecca, entre Rome et Naples. Sa famille, apparentée à l’empereur, le place à cinq ans comme oblat à l’abbaye du **Mont-Cassin** : il en sera abbé, c’est prévu. À l’université de **Naples**, il découvre deux choses interdites au programme du temps — les livres d’**Aristote** et les **dominicains**, ces frères mendiants qui ne possèdent rien. À dix-neuf ans, il prend l’habit. Pour une famille noble, c’est un scandale : un fils qui mendie. Ses frères l’enlèvent sur la route de Paris et le retiennent plus d’un an au château. Il ne cède pas ; il passe l’année à lire la Bible et Aristote. Sa mère finit par organiser son évasion par une fenêtre, pour sauver l’honneur.',
      },
      {
        titre: 'Aristote revient par le monde arabe',
        texte:
          'L’Occident latin n’avait gardé d’**Aristote** que deux traités de logique. Le reste — la physique, la morale, la métaphysique — avait été traduit en arabe à Bagdad, puis longuement commenté par **Avicenne** et surtout par **Averroès**, à Cordoue. Au XIIᵉ siècle, ces textes reviennent en Europe par **Tolède** et la Sicile, traduits de l’arabe puis du grec. Le choc est violent : Aristote explique le monde **sans la Bible**, et certains maîtres de Paris en tirent que la raison et la foi peuvent se contredire. L’Église interdit d’enseigner sa physique en 1210 et 1215. Thomas prend le problème par l’autre bout : si Dieu a fait la raison humaine **et** donné la Révélation, les deux ne peuvent pas se contredire ; là où elles semblent le faire, c’est qu’on raisonne mal ou qu’on lit mal.',
      },
      {
        titre: 'Le maître de l’université de Paris',
        texte:
          'Maître en théologie à trente et un ans, il enseigne dans une **université de Paris** en pleine guerre interne : les maîtres séculiers veulent chasser les ordres mendiants des chaires. Sa méthode est celle de la **scolastique**, et elle est d’une honnêteté rare : on pose une question, on expose d’abord **les meilleurs arguments contre** sa propre thèse, on répond, puis on réfute une à une les objections. Rien n’est caché sous le tapis. Il dicte à trois ou quatre secrétaires à la fois, parfois en marchant, et laisse près de huit millions de mots. Il travaille sur la loi, la justice, le **juste prix**, le prêt à intérêt, la guerre, l’obéissance : des sujets où il répond aux marchands et aux princes de son siècle, pas seulement aux théologiens.',
      },
      {
        titre: 'La Somme, puis la paille',
        texte:
          'De **1265 à 1273**, il écrit la ***Somme théologique***, non pour les savants mais, dit sa préface, « pour l’instruction des débutants ». Elle avance par questions — Dieu existe-t-il ? peut-on désobéir à une loi injuste ? — et devient le manuel de la pensée chrétienne pour sept siècles. Elle s’arrête net. Le **6 décembre 1273**, après la messe, Thomas cesse d’écrire et ne s’explique pas, sinon par la phrase sur la paille. Il meurt le **7 mars 1274** à l’abbaye de Fossanova, à quarante-neuf ans, en route vers le concile de Lyon. Trois ans plus tard, l’évêque de Paris condamne encore certaines de ses thèses, jugées trop favorables à Aristote ; il est pourtant **canonisé en 1323**, puis proclamé docteur de l’Église. La formule qu’il a défendue — la foi et la raison ne se combattent pas — a tenu.',
      },
    ],
    chrono: [
      { date: '1225', fait: 'Naissance à Roccasecca, près de Naples.' },
      { date: '1244', fait: 'Il entre chez les dominicains ; sa famille l’enferme un an.' },
      { date: '1245', fait: 'Élève d’Albert le Grand, à Paris puis à Cologne.' },
      { date: '1256', fait: 'Maître en théologie à l’université de Paris, à 31 ans.' },
      { date: '1265', fait: 'Début de la *Somme théologique*.' },
      { date: '6 décembre 1273', fait: 'Il cesse d’écrire : « tout cela me semble de la paille ».' },
      { date: '7 mars 1274', fait: 'Mort à Fossanova, en route pour le concile de Lyon.' },
      { date: '1323', fait: 'Canonisation par le pape Jean XXII.' },
    ],
    leSaisTu:
      'Ses camarades de Cologne l’appelaient « le bœuf muet de Sicile » : lourd, lent, toujours silencieux. Albert le Grand, son maître, les entendit un jour et répondit : « Vous l’appelez le bœuf muet ; je vous dis que ses mugissements seront entendus dans le monde entier. »',
    aRetenir: [
      'Thomas d’Aquin (1225-1274) est un frère dominicain et un maître de l’université de Paris.',
      'L’Occident redécouvre Aristote grâce aux traductions et aux commentaires venus du monde musulman.',
      'Sa thèse : la foi et la raison ne peuvent pas se contredire, car elles viennent du même Dieu.',
      'Sa *Somme théologique*, écrite de 1265 à 1273, reste inachevée et devient le manuel de la pensée chrétienne.',
      'Les universités médiévales (Bologne, Paris, Oxford) enseignent en latin et forment toute l’Europe savante.',
    ],
    mots: [
      {
        mot: 'Théologie',
        sens: 'La science qui étudie Dieu et la foi, à l’aide de la raison et des textes sacrés.',
      },
      {
        mot: 'Dominicains',
        sens: 'Ordre mendiant fondé par Dominique en 1215, voué à la prédication et à l’étude.',
      },
      {
        mot: 'Scolastique',
        sens: 'Méthode des universités médiévales : poser une question, exposer les objections, puis trancher.',
      },
      {
        mot: 'Université',
        sens: 'Corporation de maîtres et d’étudiants reconnue par le pape, qui délivre des diplômes valables partout.',
      },
    ],
    lies: ['naissance-des-universites', 'aristote', 'saint-francois-d-assise', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Thomas d’Aquin',
      'dominicain',
      'Somme théologique',
      'Aristote',
      'université de Paris',
      'scolastique',
      'foi et raison',
      'Albert le Grand',
      'Averroès',
      'Moyen Âge',
    ],
  },
  {
    id: 'marco-polo',
    volet: 'personnages',
    nom: 'Marco Polo',
    surnom: 'le marchand qui rapporta la Chine',
    dates: '1254 – 1324',
    tri: 1324,
    periode: 'moyen-age',
    emoji: '🧭',
    roles: ['Marchand vénitien', 'Voyageur', 'Envoyé du grand khan'],
    origine: 'Venise',
    accroche:
      'Parti de Venise à dix-sept ans, il passe vingt-quatre ans en Asie et dicte en prison le livre qui fit rêver l’Europe de la Chine.',
    citations: [
      {
        texte:
          'Seigneurs empereurs, rois et ducs, et vous tous qui voulez connaître les diverses races des hommes et la diversité des régions du monde, prenez ce livre et le faites lire.',
        contexte:
          'Premières lignes du *Devisement du monde*, dicté en 1298 dans une prison de Gênes à l’écrivain Rustichello de Pise.',
        sens:
          'Le livre s’annonce comme une enquête sur le monde entier, pas comme un récit de voyage personnel : c’est pour cela qu’on l’a lu partout.',
      },
      {
        texte: 'C’est sans contredit la plus noble cité du monde et la meilleure.',
        contexte:
          'Sur Quinsai — l’actuelle Hangzhou —, qu’il décrit avec ses canaux, ses marchés et ses douze mille ponts.',
        sens:
          'Une ville chinoise de plus d’un million d’habitants, quand Paris en compte deux cent mille : c’est ce genre de phrase qu’on a refusé de le croire.',
      },
      {
        texte: 'Je n’ai pas dit la moitié de ce que j’ai vu.',
        contexte:
          'À ceux qui, sur son lit de mort en 1324, le pressaient de se rétracter. Rapporté un siècle plus tard par le dominicain Jacopo d’Acqui.',
        sens:
          'Elle résume le soupçon qui l’a poursuivi toute sa vie : on le surnommait *Messer Millione*, l’homme des millions, c’est-à-dire des exagérations.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils et neveu de marchands vénitiens déjà allés en Chine, il part avec eux en 1271, à dix-sept ans.',
      'Trois ans et demi de route : Arménie, Perse, toit du monde du Pamir, désert de Gobi.',
      'Il sert le grand khan Kubilaï pendant dix-sept ans, envoyé en mission dans tout l’empire.',
      'Retour par la mer en 1295, après vingt-quatre ans d’absence.',
      'Prisonnier des Génois en 1298, il dicte son récit à Rustichello de Pise.',
      'Cent cinquante manuscrits du *Devisement du monde* nous sont parvenus, en une dizaine de langues.',
    ],
    recit: [
      {
        titre: 'Venise, porte de l’Orient',
        texte:
          'Au XIIIᵉ siècle, **Venise** est une république de marins de cent mille habitants qui vit du commerce entre l’Orient et l’Europe : soie, poivre, encens, alun, esclaves. Les **Polo** en sont. Le père de Marco, **Niccolò**, et son oncle **Matteo** sont partis vers 1260 pour la Crimée, ont été bloqués par une guerre, ont poussé toujours plus à l’est — et se sont retrouvés à la cour du **grand khan**. Kubilaï, curieux de tout, les a renvoyés avec une lettre pour le pape demandant cent hommes savants et de l’huile de la lampe du Saint-Sépulcre, et une **paiza**, la tablette d’or qui ouvre toutes les routes de l’empire. Ils reviennent à Venise en 1269. Marco a quinze ans et n’a jamais vu son père.',
      },
      {
        titre: 'Trois ans et demi de route',
        texte:
          'Ils repartent en **1271** — avec de l’huile sainte, deux moines qui feront demi-tour dès le premier danger, et un garçon de dix-sept ans. La route passe par Acre, l’Arménie, **Bagdad**, puis la Perse. À **Ormuz**, ils renoncent à la mer : les navires y sont cousus avec de la fibre de coco et personne n’a envie d’y monter. Alors ils prennent le nord, par le **Pamir**, ce « toit du monde » où, écrit Marco, le feu ne chauffe plus et ne cuit pas la nourriture — la première description connue du mal des montagnes. Puis c’est le **désert de Gobi**, trente jours dans sa partie la plus étroite, où les voyageurs isolés entendent des voix qui les appellent par leur nom. En **1275**, ils arrivent à **Shangdu**, la résidence d’été du khan.',
      },
      {
        titre: 'Dix-sept ans chez le grand khan',
        texte:
          '**Kubilaï**, petit-fils de Gengis Khan, règne sur la Chine sous le nom de dynastie **Yuan** : il est à la fois khan mongol et empereur chinois, et gouverne depuis **Khanbalik**, l’actuelle Pékin. Il garde les Polo près de lui et emploie Marco comme envoyé, parce qu’il rapporte bien ce qu’il a vu. Ce qui stupéfie le Vénitien n’est pas l’exotisme, c’est l’**efficacité** : une **monnaie de papier** faite d’écorce de mûrier, que tout l’empire accepte comme de l’or ; des **pierres noires qui brûlent** mieux que le bois, le charbon ; un service de **poste impériale** avec dix mille relais ; un **Grand Canal** de mille sept cents kilomètres pour apporter le riz du sud. Il décrit des villes de plus d’un million d’habitants quand aucune ville d’Europe n’atteint le quart.',
      },
      {
        titre: 'La prison de Gênes, et le livre qui changea la carte',
        texte:
          'En **1292**, les Polo obtiennent de partir en escortant par la mer une princesse mongole promise au khan de Perse : quatorze navires, Sumatra, Ceylan, l’Inde, deux ans de traversée. Ils rentrent à **Venise en 1295**, méconnaissables. Trois ans plus tard, Venise et Gênes sont en guerre ; Marco est capturé et jeté en prison, où il partage sa cellule avec **Rustichello de Pise**, un écrivain de romans de chevalerie. Ensemble ils écrivent, en français d’Italie, ***Le Devisement du monde***, qu’on appelle aussi *Le Livre des merveilles*. Recopié à la main dans toute l’Europe, moqué, discuté, il reste pendant deux siècles la principale source occidentale sur l’Asie. Il inspire la carte catalane de 1375 — et **Christophe Colomb**, qui en possédait un exemplaire, partira vers l’ouest pour atteindre le Cipango que Marco y décrit.',
      },
    ],
    chrono: [
      { date: '1254', fait: 'Naissance à Venise.' },
      { date: '1271', fait: 'Départ pour l’Asie avec son père et son oncle.' },
      { date: '1275', fait: 'Arrivée à la cour de Kubilaï Khan, à Shangdu.' },
      { date: '1275 – 1292', fait: 'Dix-sept ans au service du grand khan.' },
      { date: '1292', fait: 'Départ de Chine par la mer, avec quatorze navires.' },
      { date: '1295', fait: 'Retour à Venise après vingt-quatre ans.' },
      { date: '1298', fait: 'Prisonnier à Gênes : il dicte le *Devisement du monde*.' },
      { date: '8 janvier 1324', fait: 'Mort à Venise.' },
      { date: '1492', fait: 'Colomb part vers l’ouest, son exemplaire annoté à bord.' },
    ],
    leSaisTu:
      'L’exemplaire de Christophe Colomb existe encore. Il est conservé à Séville, couvert de 366 notes écrites de sa main dans les marges, presque toutes en face des passages sur l’or et les épices. Colomb est parti vers l’ouest pour atteindre le Cipango de Marco Polo : il a trouvé l’Amérique.',
    aRetenir: [
      'Marco Polo part de Venise en 1271 et passe vingt-quatre ans en Asie, dont dix-sept au service de Kubilaï Khan.',
      'La paix mongole rend la route de la soie sûre : c’est elle qui rend son voyage possible.',
      'Il dicte en 1298, dans une prison de Gênes, *Le Devisement du monde*, ou *Livre des merveilles*.',
      'Son livre décrit la monnaie de papier, le charbon, la poste impériale et la ville de Quinsai.',
      'Christophe Colomb en possédait un exemplaire annoté : ce livre a nourri les grandes découvertes.',
    ],
    mots: [
      {
        mot: 'Route de la soie',
        sens: 'Réseau de pistes caravanières reliant la Chine à la Méditerranée : y circulent soie, épices, idées et maladies.',
      },
      {
        mot: 'Grand khan',
        sens: 'Le souverain suprême de l’Empire mongol ; Kubilaï, petit-fils de Gengis Khan, règne aussi sur la Chine.',
      },
      {
        mot: 'Comptoir',
        sens: 'Établissement commercial fondé par des marchands étrangers dans un port ou une ville lointaine.',
      },
    ],
    lies: ['gengis-khan', 'christophe-colomb', 'grande-peste', 'chute-de-constantinople'],
    niveaux: ['5e'],
    programme: 'La Méditerranée et l’Asie : marchands, voyageurs et routes du commerce',
    tags: [
      'Marco Polo',
      'Venise',
      'Kubilaï Khan',
      'Chine',
      'route de la soie',
      'Devisement du monde',
      'Livre des merveilles',
      'Rustichello',
      'Cathay',
      'Quinsai',
      'Gobi',
    ],
  },
  {
    id: 'christine-de-pizan',
    volet: 'personnages',
    nom: 'Christine de Pizan',
    surnom: 'la première femme de lettres de France',
    dates: 'vers 1364 – vers 1430',
    tri: 1430,
    periode: 'moyen-age',
    emoji: '🪶',
    roles: ['Écrivaine', 'Poétesse', 'Première femme à vivre de sa plume'],
    origine: 'Venise ; élevée à la cour de France',
    accroche:
      'Veuve à vingt-cinq ans avec trois enfants, elle décide de vivre de sa plume — et écrit le premier livre français qui défende les femmes.',
    citations: [
      {
        texte:
          'Si la coutume était de mettre les petites filles à l’école et de leur enseigner les sciences comme on fait aux garçons, elles apprendraient aussi parfaitement et entendraient les subtilités de tous les arts.',
        contexte:
          '*Le Livre de la Cité des dames*, 1405, en réponse à ceux qui prétendaient les femmes incapables d’apprendre.',
        sens:
          'Elle ne dit pas que les femmes valent mieux que les hommes : elle dit que l’inégalité vient de l’instruction qu’on leur refuse, et non de la nature.',
      },
      {
        texte:
          'Je m’émerveillais comment il se peut faire que tant d’hommes savants aient été et soient si enclins à dire tant de mal des femmes.',
        contexte:
          'Ouverture de *La Cité des dames* : elle est seule dans son cabinet, découragée par ce qu’elle vient de lire sur les femmes.',
        sens:
          'Son argument tient en une observation : ce sont les hommes qui tiennent la plume depuis toujours, et les livres ne disent que ce qu’ils ont écrit.',
      },
      {
        texte: 'Hé ! quel honneur pour le sexe féminin ! Il est clair que Dieu l’aime.',
        contexte:
          'Du *Ditié de Jehanne d’Arc*, 31 juillet 1429, écrit deux semaines après le sacre de Reims : le premier poème jamais composé à la gloire de Jeanne.',
        sens:
          'À soixante-cinq ans, après onze ans de silence, la victoire d’une fille de village lui fait reprendre la plume une dernière fois.',
      },
      {
        texte: 'Et toi, Jeanne, née à la bonne heure, béni soit Celui qui te créa !',
        contexte: '*Le Ditié de Jehanne d’Arc*, juillet 1429.',
      },
    ],
    reperes: [
      'Née à Venise vers 1364, elle arrive enfant à Paris : son père est l’astrologue de Charles V.',
      'Mariée à quinze ans, veuve à vingt-cinq, avec trois enfants, sa mère et une nièce à charge.',
      'Elle vit de sa plume : plus de trois cents ballades et une trentaine d’ouvrages en trente ans.',
      'En 1401, elle attaque publiquement le *Roman de la Rose* : c’est la « querelle des femmes ».',
      'En 1405, *Le Livre de la Cité des dames* bâtit une ville imaginaire peuplée de femmes illustres.',
      'En 1429, elle écrit le premier poème à la gloire de Jeanne d’Arc, deux semaines après le sacre.',
    ],
    recit: [
      {
        titre: 'De Venise à la bibliothèque de Charles V',
        texte:
          'Son père, **Tommaso da Pizzano**, est médecin et astrologue à Bologne quand **Charles V** le fait venir à Paris, en 1368. Christine a quatre ans. Elle grandit au Louvre, où le roi rassemble une **bibliothèque de neuf cents manuscrits** — un trésor, à une époque où un livre coûte le prix d’une maison. Son père, contre l’usage, lui apprend à lire le latin et à discuter. À quinze ans, elle épouse **Étienne du Castel**, notaire et secrétaire du roi : dix années heureuses, trois enfants. Puis tout s’écroule. Charles V meurt en 1380, la famille perd sa protection ; en **1390**, une épidémie emporte Étienne, à trente-quatre ans, en voyage à Beauvais. Christine a vingt-cinq ans et cinq personnes à nourrir.',
      },
      {
        titre: 'Veuve à vingt-cinq ans : vivre de sa plume',
        texte:
          'Les procès pour récupérer l’héritage de son mari dureront **quatorze ans**. Sans revenu, elle fait ce qu’aucune femme n’a fait avant elle en France : elle **écrit pour être payée**. D’abord des ballades de deuil, puis des commandes. Ses protecteurs sont les plus grands du royaume — **Louis d’Orléans**, le duc de Bourgogne, le duc de Berry, la reine **Isabeau de Bavière**, et jusqu’au comte de Salisbury qui emmène son fils en Angleterre. Elle ne se contente pas d’écrire : elle **dirige la fabrication de ses livres**, engage les copistes, surveille les enluminures, relit les manuscrits de sa main. En trente ans, une trentaine d’ouvrages, en vers et en prose : poésie, morale, politique, et même un traité sur l’art de la guerre commandé pour la formation des chevaliers.',
      },
      {
        titre: 'La querelle de la Rose, puis la Cité des dames',
        texte:
          'En **1401**, elle s’en prend par écrit au ***Roman de la Rose***, le best-seller du siècle, dont la seconde partie couvre les femmes de mépris. Des secrétaires du roi lui répondent avec condescendance ; elle réplique, rassemble les lettres, les fait relier et les offre à la reine. **Jean Gerson**, chancelier de l’université de Paris, prend son parti. C’est la première **querelle littéraire** en langue française, et une femme l’a ouverte. Quatre ans plus tard vient sa réponse complète : ***Le Livre de la Cité des dames*** (1405). Trois figures allégoriques — **Raison, Droiture et Justice** — l’aident à bâtir, pierre par pierre, une cité dont chaque pierre est une femme réelle de l’histoire : reines, savantes, saintes, inventrices. Elle y démonte une à une les accusations de son temps, et réclame **l’instruction des filles**.',
      },
      {
        titre: 'Le silence, puis Jeanne',
        texte:
          'La France se déchire entre **Armagnacs et Bourguignons** pendant que les Anglais avancent. Christine écrit contre la guerre civile — la *Lamentation sur les maux de la France* (1410) —, sans être écoutée. Après le massacre de Paris par les Bourguignons, en **1418**, elle se réfugie à l’abbaye de **Poissy**, où sa fille est religieuse, et se tait pendant onze ans. Puis Orléans est délivrée et Charles VII sacré à Reims. Le **31 juillet 1429**, elle écrit d’un trait soixante et une strophes : le ***Ditié de Jehanne d’Arc***. C’est le **premier texte composé à la gloire de Jeanne**, et le seul écrit de son vivant. Christine meurt vers 1430, sans doute avant le bûcher de Rouen : de Jeanne, elle n’aura connu que les victoires.',
      },
    ],
    chrono: [
      { date: 'vers 1364', fait: 'Naissance à Venise.' },
      { date: '1368', fait: 'Sa famille s’installe à Paris, à la cour de Charles V.' },
      { date: 'vers 1379', fait: 'Mariage avec Étienne du Castel, secrétaire du roi.' },
      { date: '1390', fait: 'Mort de son mari : elle a 25 ans et une famille à charge.' },
      { date: '1401', fait: 'Querelle du *Roman de la Rose*.' },
      { date: '1405', fait: 'Publication du *Livre de la Cité des dames*.' },
      { date: '1418', fait: 'Elle se retire à l’abbaye de Poissy.' },
      { date: '31 juillet 1429', fait: 'Le *Ditié de Jehanne d’Arc*.' },
      { date: 'vers 1430', fait: 'Mort, sans doute à Poissy.' },
    ],
    leSaisTu:
      'Son poème pour Jeanne d’Arc est le seul texte à la gloire de la Pucelle écrit de son vivant. Christine avait soixante-cinq ans et n’avait plus rien publié depuis onze ans. Elle est morte sans doute avant le procès de Rouen : elle n’a connu de Jeanne que les victoires.',
    aRetenir: [
      'Christine de Pizan (vers 1364 – vers 1430) est la première femme de lettres française à vivre de sa plume.',
      'Veuve à 25 ans, elle écrit pour faire vivre sa famille et laisse une trentaine d’ouvrages.',
      'En 1405, *Le Livre de la Cité des dames* est le premier livre français à défendre les femmes.',
      'Elle soutient que l’infériorité des femmes vient de l’instruction qu’on leur refuse, pas de leur nature.',
      'Son *Ditié de Jehanne d’Arc* (1429) est le premier poème écrit à la gloire de Jeanne, et le seul de son vivant.',
    ],
    mots: [
      {
        mot: 'Mécène',
        sens: 'Grand personnage qui protège un artiste ou un écrivain et lui commande des œuvres.',
      },
      {
        mot: 'Enluminure',
        sens: 'Peinture qui décore un manuscrit ; Christine surveillait elle-même celles de ses livres.',
      },
      {
        mot: 'Allégorie',
        sens: 'Personnage imaginaire qui représente une idée — ici Raison, Droiture et Justice, qui bâtissent la cité.',
      },
    ],
    lies: ['jeanne-d-arc', 'charles-vii', 'guerre-de-cent-ans', 'olympe-de-gouges'],
    niveaux: ['5e'],
    programme: 'L’affirmation de l’État royal et la guerre de Cent Ans',
    tags: [
      'Christine de Pizan',
      'Cité des dames',
      'Ditié de Jehanne d’Arc',
      'femme de lettres',
      'querelle des femmes',
      'Charles V',
      'Paris',
      'Poissy',
      'Jeanne d’Arc',
      'Roman de la Rose',
    ],
  },
]
