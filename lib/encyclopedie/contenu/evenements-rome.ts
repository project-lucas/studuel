// -----------------------------------------------------------------------------
// ROME — DE CARTHAGE À THÉODOSE. Les sept événements qui font la partie
// « Empire romain et christianisme » du programme de 6e : la conquête de la
// Méditerranée, la révolte des esclaves, la mort de la République, les deux
// siècles de paix, la journée de Pompéi, l'arène du Colisée, et le jour où
// l'Empire se choisit une foi.
//
// La 6e est la classe d'entrée au collège et la moins fournie de
// l'encyclopédie : ces fiches sont donc écrites au plus CONCRET — des objets,
// des lieux, des chiffres, des heures. Un élève de onze ans doit pouvoir les
// raconter à quelqu'un d'autre le soir même.
//
// Deux phrases célèbres sont marquées `incertaine` parce qu'elles sont fausses
// ou douteuses : « Ave Caesar, morituri te salutant » n'est attestée qu'UNE
// fois, pour un combat naval de Claude, et « Tu quoque, mi fili » est une
// rumeur dont Suétone doute lui-même. Les faire répéter comme vraies, ce serait
// apprendre une faute (cf. `docs/encyclopedie.md`, § 2).
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_ROME: Evenement[] = [
  {
    id: 'guerres-puniques',
    volet: 'evenements',
    nom: 'Les guerres puniques',
    date: '264 – 146 av. J.-C.',
    tri: -202,
    fin: -146,
    periode: 'antiquite',
    emoji: '🐘',
    lieu: 'La Méditerranée occidentale, de la Sicile à Carthage',
    accroche:
      'Rome et Carthage se disputent la Méditerranée pendant cent dix-huit ans : à la fin, l’une a un empire, l’autre n’existe plus.',
    citations: [
      {
        texte: 'Au reste, j’estime que Carthage doit être détruite.',
        qui: 'Caton l’Ancien',
        contexte:
          'Formule par laquelle il terminait chacun de ses discours au Sénat de Rome, quel qu’en fût le sujet, vers 150 av. J.-C.',
        sens:
          '*Ceterum censeo Carthaginem esse delendam.* Plutarque atteste l’obstination ; la formule latine exacte, elle, est une reconstitution moderne.',
      },
      {
        texte: 'Je jure de n’être jamais l’ami du peuple romain.',
        qui: 'Hannibal, à neuf ans',
        contexte:
          'Serment prêté sur l’autel devant son père Hamilcar avant de partir pour l’Espagne ; Hannibal l’a lui-même raconté, rapporte Polybe.',
      },
      {
        texte: 'Hannibal est aux portes !',
        qui: 'Cicéron',
        contexte:
          '*Hannibal ad portas.* Cicéron reprend le cri de panique des Romains de 211 av. J.-C., devenu un proverbe latin.',
        sens: 'Se dit encore d’un danger qui n’est plus au loin mais devant la maison.',
      },
      {
        texte: 'Il viendra un jour où périront Troie la sainte, et Priam, et son peuple.',
        qui: 'Scipion Émilien',
        contexte:
          'Vers d’Homère qu’il récite en pleurant devant Carthage en flammes, en 146 av. J.-C., selon Polybe qui se tenait à ses côtés.',
        sens: 'Le vainqueur pense que Rome, elle aussi, connaîtra un jour le même sort.',
      },
    ],
    reperes: [
      'Trois guerres entre Rome et Carthage : 264-241, 218-201 et 149-146 av. J.-C.',
      'Hannibal franchit les Alpes en 218 av. J.-C. avec 37 éléphants de guerre.',
      'Cannes, le 2 août 216 av. J.-C. : la pire défaite de l’histoire de Rome.',
      'Zama, en 202 av. J.-C. : Scipion bat Hannibal en Afrique et finit la guerre.',
      'En 146 av. J.-C., Carthage est rasée ; son territoire devient la province d’Afrique.',
    ],
    causes: [
      'Deux puissances pour une seule mer : Carthage tient le commerce de la Méditerranée occidentale, Rome vient d’achever la conquête de l’Italie.',
      'La Sicile, à un jour de mer des deux capitales : un appel au secours de mercenaires installés à Messine y fait entrer Rome en 264 av. J.-C.',
      'La défaite de 241 laisse Carthage humiliée et privée de la Sicile ; la famille des Barcides se reconstruit un empire en Espagne.',
      'Le siège de Sagonte, ville alliée de Rome, par Hannibal en 219 av. J.-C. : l’étincelle de la deuxième guerre.',
      'Après 201, Carthage paie, désarme… et redevient riche en cinquante ans, ce que Rome ne supporte pas.',
      'À Rome, le parti de Caton l’Ancien réclame sans relâche la destruction pure et simple de la rivale.',
    ],
    recit: [
      {
        titre: 'Deux cités pour une mer',
        texte:
          'En **264 av. J.-C.**, Rome vient d’achever la conquête de l’Italie ; **Carthage**, fondée par des Phéniciens de Tyr, tient depuis des siècles le commerce de la Méditerranée occidentale avec la meilleure flotte du monde. La Sicile les met face à face. Rome n’a pas un seul navire de guerre : elle copie une quinquérème carthaginoise échouée, en construit **cent vingt en soixante jours**, et invente le **corbeau**, une passerelle à crochet qui s’abat sur le pont ennemi pour transformer un combat naval en combat d’infanterie. Vingt-trois ans de guerre, des flottes entières englouties par les tempêtes, et la victoire romaine des **îles Égates** en **241 av. J.-C.** Carthage abandonne la Sicile — qui devient la première **province** de Rome — et paie 3 200 talents d’argent. Les Romains appelaient les Carthaginois *Poeni*, c’est-à-dire les Phéniciens : de là vient le mot **punique**.',
      },
      {
        titre: 'Hannibal passe les Alpes',
        texte:
          'Le fils d’Hamilcar Barca a juré, enfant, de ne jamais être l’ami de Rome. En **218 av. J.-C.**, **Hannibal** part de Carthagène, en Espagne, avec environ **50 000 fantassins, 9 000 cavaliers et 37 éléphants**. Personne ne l’attend par la terre. Il traverse les Pyrénées, franchit le Rhône sur des radeaux — les éléphants affolés —, puis attaque les **Alpes** en octobre, sous la neige, harcelé par les montagnards. Il met **quinze jours** à passer et débouche en Italie avec moins de la moitié de son armée. Ensuite, il gagne tout : la **Trébie** (218), le **lac Trasimène** (217) où il détruit une armée entière dans le brouillard, et surtout **Cannes**, le **2 août 216 av. J.-C.** Là, avec 50 000 hommes, il enveloppe une armée romaine deux fois plus nombreuse : entre 50 000 et 70 000 morts en une seule journée selon les sources. Il restera seize ans en Italie, jamais battu en bataille rangée, sans jamais pouvoir prendre Rome.',
      },
      {
        titre: 'Rome tient, puis frappe ailleurs',
        texte:
          'Rome ne négocie pas. Elle enrôle des adolescents et des esclaves affranchis, refuse de racheter ses prisonniers, et confie le commandement à **Fabius Maximus**, surnommé le **Temporisateur** : il suit Hannibal sans jamais accepter la bataille et lui fait perdre ce qui lui manque le plus, le temps. Pendant ce temps, la guerre se gagne ailleurs. Rome reprend **Capoue** (211) et **Syracuse** (212), où un soldat tue **Archimède**, puis écrase au **Métaure** (207) l’armée de renfort du frère d’Hannibal. En Espagne, un jeune général, **Scipion**, enlève Carthagène, puis ose débarquer en **Afrique**. Carthage rappelle Hannibal d’Italie. Les deux hommes se rencontrent à **Zama**, le **19 octobre 202 av. J.-C.** : Scipion fait ouvrir des couloirs dans ses lignes pour laisser passer les éléphants, et sa cavalerie numide revient prendre les Carthaginois à revers. Hannibal est battu pour la première fois. Carthage livre sa flotte, paie 10 000 talents en cinquante ans et s’interdit toute guerre sans l’accord de Rome.',
      },
      {
        titre: '146 : la ville rasée',
        texte:
          'Un demi-siècle plus tard, Carthage a payé sa dette et redevient prospère. À Rome, le vieux **Caton** montre au Sénat une figue fraîche cueillie trois jours plus tôt en Afrique : la rivale est à trois jours de mer. Il termine désormais tous ses discours par la même phrase — **Carthage doit être détruite**. En **149 av. J.-C.**, Rome exige que les Carthaginois abandonnent leur ville et s’installent à quinze kilomètres de la mer. Ils refusent et soutiennent **trois ans de siège**. Au printemps **146**, **Scipion Émilien** force les murailles : il faut **six jours** de combats de maison en maison pour prendre la ville haute. Les 50 000 survivants sont vendus comme esclaves, la ville brûle, et le territoire devient la **province d’Afrique**. La même année, Rome rase **Corinthe**, en Grèce. En un seul été, elle a supprimé ses deux dernières rivales.',
      },
      {
        titre: 'Ce que Rome gagne, et ce que ça lui coûte',
        texte:
          'Rome sort des guerres puniques maîtresse de la Méditerranée : la Sicile, la Sardaigne, l’Espagne, l’Afrique. Le butin est tel qu’en **167 av. J.-C.** les citoyens romains cessent de payer l’impôt direct ; le blé, l’argent et surtout les **esclaves** affluent par dizaines de milliers. Mais la victoire abîme la société qui l’a remportée. Les paysans-soldats partis dix ans reviennent ruinés, et leurs terres sont rachetées par de grands propriétaires qui les font cultiver par des esclaves : ce sont les **latifundia**. Une plèbe sans terre s’entasse à Rome, tandis que l’Italie se remplit d’hommes enchaînés. Les révoltes serviles — celle de **Spartacus** en 73 av. J.-C. — et les guerres civiles du siècle suivant sortent de là. Rome a gagné un empire et y a perdu sa République.',
      },
    ],
    consequences: [
      'Rome devient la première puissance de la Méditerranée et apprend à gouverner des provinces hors d’Italie.',
      'La Sicile, la Sardaigne, l’Espagne puis l’Afrique entrent dans l’Empire naissant.',
      'Le butin est tel qu’en 167 av. J.-C. les citoyens de Rome cessent de payer l’impôt direct.',
      'Des centaines de milliers d’esclaves arrivent en Italie : les grands domaines remplacent les petites fermes.',
      'Carthage disparaît pour un siècle ; César y refonde une colonie romaine en 44 av. J.-C.',
      'L’armée et les généraux vainqueurs prennent un poids politique qui minera la République.',
    ],
    chiffres: [
      { valeur: '118 ans', quoi: 'de guerres entre Rome et Carthage' },
      { valeur: '37', quoi: 'éléphants partis d’Espagne avec Hannibal' },
      { valeur: '15 jours', quoi: 'pour franchir les Alpes, en octobre 218 av. J.-C.' },
      { valeur: '50 000', quoi: 'Carthaginois vendus comme esclaves en 146 av. J.-C.' },
    ],
    chrono: [
      { date: '264 av. J.-C.', fait: 'Première guerre punique : Rome débarque en Sicile.' },
      { date: '241 av. J.-C.', fait: 'Victoire navale des îles Égates ; la Sicile devient romaine.' },
      { date: '218 av. J.-C.', fait: 'Hannibal franchit les Alpes avec ses éléphants.' },
      { date: '2 août 216 av. J.-C.', fait: 'Désastre romain de Cannes.' },
      { date: '212 av. J.-C.', fait: 'Prise de Syracuse ; Archimède est tué.' },
      { date: '19 octobre 202 av. J.-C.', fait: 'Scipion bat Hannibal à Zama.' },
      { date: '201 av. J.-C.', fait: 'Paix : Carthage livre sa flotte et paie 10 000 talents.' },
      { date: '149 av. J.-C.', fait: 'Troisième guerre punique : le siège commence.' },
      { date: '146 av. J.-C.', fait: 'Carthage est prise, brûlée et rasée.' },
    ],
    leSaisTu:
      'On raconte que les Romains répandirent du sel sur les ruines de Carthage pour que rien n’y repousse jamais. C’est faux : aucun auteur antique n’en parle, et le sel coûtait bien trop cher. L’histoire a été inventée par des ouvrages modernes, au XIXᵉ et au XXᵉ siècle. Vingt-quatre ans après la destruction, Rome fondait d’ailleurs une colonie sur le site.',
    aRetenir: [
      'Les guerres puniques opposent Rome à Carthage de 264 à 146 av. J.-C.',
      'En 218 av. J.-C., Hannibal franchit les Alpes et écrase les Romains à Cannes en 216.',
      'Scipion bat Hannibal à Zama, en Afrique, en 202 av. J.-C.',
      'En 146 av. J.-C., Carthage est détruite et devient la province romaine d’Afrique.',
      'Ces guerres donnent à Rome un empire, des esclaves par milliers et une crise sociale.',
    ],
    mots: [
      {
        mot: 'Punique',
        sens: 'Qui concerne Carthage : les Romains appelaient les Carthaginois *Poeni*, c’est-à-dire les Phéniciens.',
      },
      {
        mot: 'Province',
        sens: 'Territoire conquis hors d’Italie, administré par un gouverneur envoyé de Rome.',
      },
      {
        mot: 'Talent',
        sens: 'Unité de poids d’argent d’environ 26 kilos. Carthage en doit 10 000 à Rome après Zama.',
      },
      {
        mot: 'Latifundium',
        sens: 'Très grand domaine agricole cultivé par des esclaves, qui remplace les fermes des paysans-soldats.',
      },
    ],
    lies: ['hannibal', 'fondation-de-rome', 'revolte-de-spartacus', 'archimede', 'paix-romaine'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'guerres puniques',
      'Carthage',
      'Hannibal',
      'éléphants',
      'Alpes',
      'Cannes',
      'Zama',
      'Scipion',
      'Caton',
      'Sicile',
      'punique',
      'Rome',
    ],
  },
  {
    id: 'revolte-de-spartacus',
    volet: 'evenements',
    nom: 'La révolte de Spartacus',
    date: '73 – 71 av. J.-C.',
    tri: -71,
    fin: -71,
    periode: 'antiquite',
    emoji: '⛓️',
    lieu: 'De Capoue au Vésuve, puis toute l’Italie du Sud',
    accroche:
      'Soixante-dix gladiateurs s’évadent d’une école de Capoue avec des couteaux de cuisine ; deux ans plus tard, ils sont 70 000 et Rome tremble.',
    citations: [
      {
        texte:
          'Si je gagne, j’aurai beaucoup de chevaux, ceux des ennemis ; si je perds, je n’en aurai plus besoin.',
        qui: 'Spartacus',
        contexte:
          'Devant ses hommes, avant la bataille finale, en tuant son propre cheval ; rapporté par Plutarque.',
      },
      {
        texte:
          'Un homme d’un grand courage et d’une grande force, mais par l’intelligence et la douceur supérieur à sa condition.',
        qui: 'Plutarque',
        contexte:
          'Portrait de Spartacus dans la *Vie de Crassus*, écrite environ cent cinquante ans après la révolte.',
      },
      {
        texte:
          'De soldat il était devenu déserteur, de déserteur brigand, puis, à cause de sa force, gladiateur.',
        qui: 'Florus',
        contexte:
          'Abrégé de l’histoire romaine, IIᵉ siècle : la façon dont Rome tenait à se souvenir de lui.',
        sens: 'Les historiens romains écrivent la révolte comme une affaire de brigands, jamais comme une guerre.',
      },
    ],
    reperes: [
      'Été 73 av. J.-C. : évasion de l’école de gladiateurs de Capoue, en Campanie.',
      'Le premier camp des révoltés est le cratère du Vésuve, alors couvert de vignes.',
      'Spartacus bat deux préteurs, puis les deux consuls de l’année 72 av. J.-C.',
      'Son armée compte jusqu’à 70 000 hommes : esclaves, bergers, ouvriers agricoles.',
      'En 71 av. J.-C., Crassus l’écrase ; 6 000 prisonniers sont crucifiés le long de la via Appia.',
    ],
    causes: [
      'Les conquêtes ont rempli l’Italie d’esclaves — peut-être un habitant sur quatre —, achetés par centaines sur les marchés de Délos.',
      'Les grands domaines enferment la nuit leurs ouvriers dans des *ergastules*, des prisons de ferme.',
      'Les écoles de gladiateurs achètent les plus solides pour les faire s’entre-tuer devant le public.',
      'Les légions sont ailleurs : en Espagne contre Sertorius, en Orient contre Mithridate.',
      'Rome méprise l’affaire et n’envoie d’abord que des préteurs avec des troupes levées à la hâte.',
    ],
    recit: [
      {
        titre: 'Une évasion par les cuisines',
        texte:
          'À l’été **73 av. J.-C.**, dans l’école de gladiateurs de **Lentulus Batiatus**, à **Capoue**, environ deux cents hommes décident de fuir. Le complot est dénoncé ; **soixante-dix à soixante-dix-huit** passent quand même, armés de **broches et de couteaux de cuisine**. Dans la rue, ils tombent sur un convoi d’armes de gladiateurs et s’équipent. À leur tête, un **Thrace** nommé **Spartacus**, ancien auxiliaire de l’armée romaine, et deux Gaulois, **Crixus** et **Œnomaüs**. Ils se réfugient sur le **Vésuve**, dont personne ne sait alors que c’est un volcan : la montagne est plantée de vignes. Le préteur **Claudius Glaber** monte les assiéger avec 3 000 hommes et bloque l’unique sentier. Les gladiateurs tressent des **échelles avec les sarments de vigne**, descendent la falaise par l’autre versant, contournent le camp romain et le prennent à revers. C’est la première victoire, et elle fait le tour de l’Italie.',
      },
      {
        titre: 'Une armée d’esclaves',
        texte:
          'La nouvelle court dans les campagnes. Bergers, ouvriers agricoles, esclaves des grands domaines rejoignent le camp par milliers : **70 000 hommes** selon Appien, davantage selon d’autres. Spartacus les organise en armée, leur fait forger des armes, les entraîne, partage également le butin et refuse, dit Plutarque, l’or et l’argent. En **72 av. J.-C.**, il bat successivement deux préteurs, puis les **deux consuls** de l’année — ce qui n’était plus arrivé à Rome depuis Hannibal. Mais le camp se divise sur le but à atteindre : Spartacus veut remonter vers le nord, franchir les **Alpes** et rendre chacun à son pays ; **Crixus** et ses Gaulois veulent rester piller l’Italie. Ils se séparent, et Crixus est écrasé au mont Gargan avec la plus grande partie de ses hommes. Spartacus, lui, atteint la plaine du Pô : la route est ouverte… et son armée refuse de quitter l’Italie. Elle redescend vers le sud.',
      },
      {
        titre: 'Crassus, le fossé et les croix',
        texte:
          'Rome confie alors les pleins pouvoirs à l’homme le plus riche de la ville, **Crassus**, avec huit légions. Il rétablit la **décimation** : dans une unité qui a fui, un soldat sur dix, tiré au sort, est exécuté par ses camarades. Puis il enferme les révoltés dans la pointe de l’Italie en faisant creuser d’une mer à l’autre un **fossé de cinquante kilomètres** doublé d’un rempart. Spartacus négocie son passage en **Sicile** avec des pirates ciliciens, qui empochent l’argent et ne reviennent pas. Une nuit de neige, les révoltés comblent le fossé et forcent le passage, mais la fin est proche. Au printemps **71 av. J.-C.**, sur les bords du **Silarus**, Spartacus tue son cheval devant ses hommes et charge vers Crassus. Il meurt dans la mêlée ; son corps ne sera jamais retrouvé. **Six mille** prisonniers sont crucifiés le long de la **via Appia**, de Capoue à Rome : près de deux cents kilomètres de croix.',
      },
      {
        titre: 'Ce que Rome en fait, ce que nous en faisons',
        texte:
          'Rome ne change rien : l’esclavage n’est pas même discuté. **Pompée**, qui rentre d’Espagne, extermine 5 000 fuyards et s’attribue le mérite de la victoire ; lui et Crassus deviennent consuls en **70 av. J.-C.** Onze ans plus tard, les deux hommes formeront avec **César** l’alliance qui achèvera la République. La mémoire de Spartacus, elle, ressort dix-huit siècles après : Voltaire y voit « la plus juste guerre » de toute l’histoire, **Karl Marx** en fait son héros de l’Antiquité, les révolutionnaires allemands de 1919 prennent le nom de **spartakistes**, et le film de Stanley Kubrick (1960) grave la scène où des prisonniers se lèvent l’un après l’autre en disant : « Je suis Spartacus. » Aucune source antique ne rapporte cette scène — elle est née au cinéma.',
      },
    ],
    consequences: [
      'La révolte est écrasée sans rien changer : Rome ne remet jamais l’esclavage en question.',
      'Six mille crucifiés le long de la via Appia servent d’avertissement pendant des mois.',
      'Crassus et Pompée en sortent consuls dès 70 av. J.-C. et dominent la vie politique romaine.',
      'C’est la dernière grande révolte d’esclaves de l’histoire romaine.',
      'La surveillance des esclaves se durcit, même si les affranchissements se multiplient au siècle suivant.',
      'Spartacus devient, dix-huit siècles plus tard, un symbole de la révolte contre l’oppression.',
    ],
    chiffres: [
      { valeur: '70', quoi: 'gladiateurs évadés de Capoue en 73 av. J.-C.' },
      { valeur: '70 000', quoi: 'hommes dans l’armée de Spartacus, au plus fort' },
      { valeur: '6 000', quoi: 'crucifiés le long de la via Appia en 71 av. J.-C.' },
      { valeur: '2 ans', quoi: 'de révolte, de l’évasion à la dernière bataille' },
    ],
    chrono: [
      { date: '73 av. J.-C.', fait: 'Évasion de l’école de gladiateurs de Capoue.' },
      { date: '73 av. J.-C.', fait: 'Les révoltés descendent du Vésuve et battent Glaber.' },
      { date: '72 av. J.-C.', fait: 'Défaite des deux consuls romains devant Spartacus.' },
      { date: '72 av. J.-C.', fait: 'Crixus est tué au mont Gargan avec ses Gaulois.' },
      { date: 'Hiver 72-71 av. J.-C.', fait: 'Crassus enferme les révoltés derrière un fossé.' },
      { date: 'Printemps 71 av. J.-C.', fait: 'Bataille du Silarus : Spartacus est tué.' },
      { date: '71 av. J.-C.', fait: '6 000 prisonniers crucifiés de Capoue à Rome.' },
    ],
    leSaisTu:
      'Le Vésuve a servi de forteresse aux révoltés parce que personne, en 73 av. J.-C., ne savait que c’était un volcan : ses pentes étaient plantées de vignes et son cratère faisait un camp parfait. Cent cinquante-deux ans plus tard, la même montagne ensevelissait Pompéi.',
    aRetenir: [
      'En 73 av. J.-C., Spartacus s’évade avec une soixantaine de gladiateurs de Capoue.',
      'Sa révolte rassemble jusqu’à 70 000 esclaves et bat les armées consulaires en 72 av. J.-C.',
      'Crassus l’écrase en 71 av. J.-C. ; 6 000 révoltés sont crucifiés le long de la via Appia.',
      'La révolte montre la place de l’esclavage dans l’Italie romaine — sans le remettre en cause.',
    ],
    mots: [
      {
        mot: 'Gladiateur',
        sens: 'Combattant de l’arène, le plus souvent esclave, prisonnier de guerre ou condamné, entraîné dans une école appelée *ludus*.',
      },
      {
        mot: 'Ergastule',
        sens: 'Bâtiment fermé où l’on enfermait la nuit les esclaves d’un grand domaine agricole.',
      },
      {
        mot: 'Décimation',
        sens: 'Punition d’une unité qui a fui : un soldat sur dix, tiré au sort, est exécuté par ses camarades.',
      },
      {
        mot: 'Affranchi',
        sens: 'Esclave libéré par son maître ; il devient citoyen, mais lui reste lié par des obligations.',
      },
    ],
    lies: [
      'spartacus',
      'guerres-puniques',
      'assassinat-de-cesar',
      'construction-du-colisee',
    ],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Spartacus',
      'gladiateurs',
      'esclaves',
      'Capoue',
      'Vésuve',
      'Crassus',
      'via Appia',
      'révolte',
      'crucifixion',
      'Rome',
      'guerre servile',
    ],
  },
  {
    id: 'assassinat-de-cesar',
    volet: 'evenements',
    nom: 'L’assassinat de César',
    date: '15 mars 44 av. J.-C.',
    tri: -44,
    periode: 'antiquite',
    emoji: '🗡️',
    lieu: 'La curie de Pompée, au Champ de Mars, à Rome',
    accroche:
      'Le 15 mars 44 av. J.-C., soixante sénateurs poignardent César pour sauver la République : ils lui donnent un empereur.',
    citations: [
      {
        texte: 'Les Ides de mars sont arrivées. — Oui, César, mais elles ne sont pas passées.',
        qui: 'César et l’haruspice Spurinna',
        contexte:
          'Sur le chemin de la curie, au matin du 15 mars 44 av. J.-C. ; le devin l’avait averti un mois plus tôt.',
        sens: 'César se moque de la prédiction en croisant celui qui l’a faite. La journée n’est pas finie.',
      },
      {
        texte: 'Toi aussi, mon fils !',
        qui: 'César (selon la tradition)',
        contexte:
          'Dernières paroles adressées à Brutus, d’après une rumeur que Suétone rapporte tout en doutant d’elle.',
        sens:
          '*Tu quoque, mi fili.* Suétone écrit que certains lui prêtent ces mots, en grec — *Kai su, teknon* —, mais que César, selon la plupart, mourut sans rien dire.',
        incertaine: true,
      },
      {
        texte: 'Le sort en est jeté.',
        qui: 'César',
        contexte:
          'En franchissant le Rubicon avec son armée, en janvier 49 av. J.-C. : passer ce ruisseau en armes, c’était déclarer la guerre à Rome.',
        sens:
          '*Alea jacta est.* Plutarque assure qu’il l’a dite en grec, en citant une comédie de Ménandre : « Que le dé soit jeté. »',
      },
      {
        texte: 'Je suis venu, j’ai vu, j’ai vaincu.',
        qui: 'César',
        contexte:
          'Message annonçant sa victoire de Zéla, en 47 av. J.-C. ; la phrase fut portée sur une pancarte lors de son triomphe.',
        sens: '*Veni, vidi, vici.* Trois mots pour dire que la guerre a duré cinq jours.',
      },
    ],
    reperes: [
      'César est nommé dictateur à vie en février 44 av. J.-C.',
      'La conjuration réunit une soixantaine de sénateurs, dont Brutus et Cassius.',
      'Le meurtre a lieu dans la curie de Pompée, au Champ de Mars, et non au Forum.',
      'Vingt-trois coups de poignard, dont un seul mortel selon le médecin Antistius.',
      'Dix-sept ans plus tard, son héritier Octave devient Auguste, premier empereur.',
    ],
    causes: [
      'Une République faite pour une cité gouverne désormais la Méditerranée : ses institutions ne suivent plus.',
      'Un siècle de guerres civiles a appris aux généraux que les légions obéissent à eux, pas au Sénat.',
      'César a tout cumulé : dictature à vie, consulat, contrôle des armées et du Trésor.',
      'Sa statue, son portrait sur les monnaies, un mois à son nom : Rome, qui a chassé ses rois en 509 av. J.-C., croit voir revenir la royauté.',
      'Aux Lupercales, le 15 février 44 av. J.-C., Antoine lui présente un diadème devant la foule ; il le refuse, mais le doute reste.',
      'Sa clémence : il a pardonné à ses adversaires vaincus, dont Brutus et Cassius, qui siègent au Sénat et conspirent.',
    ],
    recit: [
      {
        titre: 'Un homme au-dessus de la République',
        texte:
          'En janvier **49 av. J.-C.**, **César** franchit le **Rubicon**, la petite rivière qu’un général n’a pas le droit de passer en armes, et déclenche la guerre civile. Il écrase **Pompée** à **Pharsale** (48), le poursuit jusqu’en Égypte où il le trouve assassiné, règle l’Orient, l’Afrique, puis l’Espagne à **Munda** (45). Vainqueur partout, il gouverne seul. Il fait entrer des Gaulois au Sénat, fonde des colonies pour ses vétérans, relève Carthage et Corinthe, et surtout réforme le **calendrier** : avec les astronomes d’Alexandrie, il crée l’année de 365 jours et un jour de plus tous les quatre ans — le nôtre, à quelques minutes près. Pour remettre les saisons en place, l’année 46 av. J.-C. dure **445 jours**. Le mois de sa naissance, *Quintilis*, devient *Julius* : juillet. En février **44**, il est nommé **dictateur à vie**.',
      },
      {
        titre: 'Les Ides de mars',
        texte:
          'Les conjurés sont une **soixantaine** de sénateurs. Deux noms dominent : **Cassius**, l’organisateur, et **Brutus**, descendant de celui qui avait chassé le dernier roi de Rome. Le matin du **15 mars 44 av. J.-C.**, sa femme **Calpurnia** le supplie de rester ; un inconnu lui glisse dans la main un billet qu’il n’ouvre pas. Le Sénat siège ce jour-là dans la **curie de Pompée**. **Tillius Cimber** s’approche pour une requête et tire sa toge : c’est le signal. **Casca** frappe le premier, à l’épaule. Les coups tombent de partout, les conjurés se blessent entre eux. César tombe au pied de la **statue de Pompée**, l’homme qu’il avait vaincu, et se couvre la tête de sa toge. Son médecin, **Antistius**, compte ensuite **vingt-trois blessures** et déclare qu’une seule, en pleine poitrine, était mortelle : c’est la première autopsie dont l’histoire garde la trace.',
      },
      {
        titre: 'Le contraire de ce qu’ils voulaient',
        texte:
          'Les meurtriers sortent en criant « Liberté ! » et en brandissant leurs poignards. Personne ne les suit. Le peuple de Rome ne pleure pas une République qui ne l’a jamais nourri ; il pleure l’homme qui lui laisse par testament **300 sesterces par citoyen** et ses jardins du Tibre en promenade publique. Le **20 mars**, aux funérailles, **Marc Antoine** montre à la foule la toge trouée et lit le testament : les Romains brûlent le corps sur le Forum avec les bancs et les tables des boutiques, puis courent incendier les maisons des conjurés. En juillet, une **comète** brille sept nuits de suite pendant les jeux ; on y voit l’âme de César montant au ciel, et le Sénat en fait un dieu. Brutus et Cassius s’enfuient et se donnent la mort après leur défaite à **Philippes**, en 42 av. J.-C.',
      },
      {
        titre: 'De la République à l’Empire',
        texte:
          'Dans son testament, César adopte et fait son héritier un garçon de dix-huit ans, son petit-neveu **Octave**. Personne ne le prend au sérieux. Il élimine pourtant l’un après l’autre tous ses rivaux : alliance puis rupture avec **Marc Antoine**, victoire navale d’**Actium** en 31 av. J.-C. contre Antoine et **Cléopâtre**, annexion de l’Égypte. En **27 av. J.-C.**, il rend solennellement ses pouvoirs au Sénat, qui les lui rend aussitôt avec un nom nouveau : **Auguste**. Les magistratures de la République continuent d’exister, les consuls sont élus, le Sénat siège — mais un seul homme commande les armées. Les conjurés voulaient empêcher un roi ; ils ont ouvert quinze siècles d’empereurs, et donné son nom à la fonction : *Caesar* deviendra *Kaiser* en Allemagne et *tsar* en Russie.',
      },
    ],
    consequences: [
      'Rome replonge dans treize ans de guerre civile, de 44 à 31 av. J.-C.',
      'Brutus et Cassius, vaincus à Philippes en 42 av. J.-C., se donnent la mort.',
      'Le Sénat divinise César : c’est le premier Romain déclaré dieu par son peuple.',
      'Octave, son héritier, devient Auguste en 27 av. J.-C. : l’Empire remplace la République.',
      'Le mot « césar » devient un titre, puis *Kaiser* en Allemagne et *tsar* en Russie.',
      'Son calendrier, dit julien, reste en usage en Europe jusqu’en 1582.',
    ],
    chiffres: [
      { valeur: '23', quoi: 'coups de poignard, dont un seul mortel' },
      { valeur: '60', quoi: 'sénateurs environ dans la conjuration' },
      { valeur: '300', quoi: 'sesterces légués à chaque citoyen de Rome' },
      { valeur: '445 jours', quoi: 'la durée de l’année 46 av. J.-C., pour caler le calendrier' },
    ],
    chrono: [
      { date: 'Janvier 49 av. J.-C.', fait: 'César franchit le Rubicon : c’est la guerre civile.' },
      { date: '9 août 48 av. J.-C.', fait: 'Victoire de Pharsale sur Pompée.' },
      { date: '46 av. J.-C.', fait: 'Réforme du calendrier ; quadruple triomphe à Rome.' },
      { date: 'Février 44 av. J.-C.', fait: 'César est nommé dictateur à vie.' },
      { date: '15 février 44 av. J.-C.', fait: 'Aux Lupercales, il refuse le diadème d’Antoine.' },
      { date: '15 mars 44 av. J.-C.', fait: 'Assassinat dans la curie de Pompée.' },
      { date: '20 mars 44 av. J.-C.', fait: 'Funérailles sur le Forum ; la foule se soulève.' },
      { date: '42 av. J.-C.', fait: 'Brutus et Cassius vaincus à Philippes.' },
      { date: '27 av. J.-C.', fait: 'Octave devient Auguste : début de l’Empire.' },
    ],
    leSaisTu:
      'La curie où César est tombé existe toujours. Auguste la fit murer comme un lieu maudit, et on l’a redégagée en 1929 au Largo Argentina, en plein Rome. Le site est aujourd’hui occupé par une colonie de chats errants, nourris et soignés par des bénévoles : le lieu le plus célèbre de l’histoire romaine est devenu un refuge à chats.',
    aRetenir: [
      'César est assassiné le 15 mars 44 av. J.-C. dans la curie de Pompée, à Rome.',
      'Les conjurés, menés par Brutus et Cassius, veulent empêcher le retour d’un roi.',
      'Il avait été nommé dictateur à vie un mois plus tôt, en février 44 av. J.-C.',
      'Sa mort ouvre treize ans de guerre civile, et non le retour de la République.',
      'Son héritier Octave devient Auguste en 27 av. J.-C. : c’est le début de l’Empire romain.',
    ],
    mots: [
      {
        mot: 'Ides',
        sens: 'Le 15 des mois de mars, mai, juillet et octobre ; le 13 des autres. Les Romains comptaient les jours à partir de repères, sans les numéroter.',
      },
      {
        mot: 'Dictateur',
        sens: 'À Rome, magistrat doté de tous les pouvoirs pour six mois en cas de danger. César s’en fait donner la charge à vie.',
      },
      {
        mot: 'Curie',
        sens: 'Salle où se réunit le Sénat. Celle de Pompée était une annexe de son théâtre, au Champ de Mars.',
      },
      {
        mot: 'République',
        sens: 'Du latin *res publica*, « la chose publique » : le régime où les magistrats sont élus chaque année et où le Sénat conseille.',
      },
    ],
    lies: ['jules-cesar', 'conquete-de-la-gaule', 'auguste', 'cleopatre', 'paix-romaine'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Ides de mars',
      'César',
      'Brutus',
      'Cassius',
      'conjuration',
      'Rome',
      'République',
      'dictateur',
      'curie de Pompée',
      'Octave',
      '44 av. J.-C.',
    ],
  },
  {
    id: 'eruption-du-vesuve',
    volet: 'evenements',
    nom: 'L’éruption du Vésuve',
    date: '24 août 79',
    tri: 79,
    periode: 'antiquite',
    emoji: '🌋',
    lieu: 'Pompéi, Herculanum et la baie de Naples',
    accroche:
      'En un jour et une nuit, une montagne que personne ne croyait dangereuse efface deux villes — et les conserve intactes pendant dix-sept siècles.',
    citations: [
      {
        texte:
          'Un nuage d’une grandeur et d’une forme extraordinaires s’élevait : il ressemblait à un pin parasol.',
        qui: 'Pline le Jeune',
        contexte:
          'Lettre à l’historien Tacite, écrite vingt-cinq ans après ; il avait dix-sept ans et regardait depuis Misène.',
        sens: 'Les volcanologues appellent aujourd’hui « éruption plinienne » ce type de colonne en forme de pin.',
      },
      {
        texte: 'La fortune sourit aux braves : mets le cap sur Pomponianus.',
        qui: 'Pline l’Ancien',
        contexte:
          'À son pilote, en faisant route vers la côte en feu pour secourir des amis, le jour de l’éruption. Il y mourra.',
        sens: '*Fortes fortuna iuvat.* Il commandait la flotte de Misène et partit vers le volcan au lieu de s’en éloigner.',
      },
      {
        texte:
          'On entendait les gémissements des femmes, les cris des enfants, les appels des hommes ; beaucoup croyaient que cette nuit serait la dernière du monde.',
        qui: 'Pline le Jeune',
        contexte:
          'Seconde lettre à Tacite, sur la nuit passée sur la route de Misène, dans le noir et sous la cendre.',
      },
      {
        texte:
          'Je m’étonne, ô mur, que tu ne sois pas tombé en ruine, toi qui portes tant d’ennuyeuses écritures.',
        qui: 'Un inconnu, sur un mur de Pompéi',
        contexte:
          'Graffiti gravé dans l’enduit et retrouvé intact sous la cendre : les Pompéiens écrivaient partout.',
      },
    ],
    reperes: [
      'Le 24 août 79, le Vésuve entre en éruption après des siècles de sommeil.',
      'Pompéi disparaît sous 6 mètres de pierres ponces ; Herculanum sous 20 mètres de boue durcie.',
      'Environ 2 000 morts à Pompéi ; l’amiral Pline l’Ancien meurt en portant secours.',
      'Tout ce qu’on sait de la journée vient de deux lettres de Pline le Jeune à Tacite.',
      'Les villes sont retrouvées en 1709 et 1748 ; on y fouille encore aujourd’hui.',
    ],
    causes: [
      'Le Vésuve n’avait plus explosé depuis environ dix-huit siècles : plus personne ne savait que c’était un volcan.',
      'Ses pentes, couvertes de vignes et de villas, comptaient parmi les terres les plus riches d’Italie.',
      'Le tremblement de terre du 5 février 62 avait ravagé Pompéi ; on avait reconstruit sur place sans y voir un avertissement.',
      'Les secousses des jours précédents passèrent inaperçues : elles étaient devenues habituelles.',
      'Le vent poussa la colonne de cendres droit sur Pompéi et Stabies, épargnant d’abord Herculanum.',
    ],
    recit: [
      {
        titre: 'Une ville ordinaire, un matin ordinaire',
        texte:
          '**Pompéi**, ce matin-là, est une ville de province d’environ **11 000 habitants**, au pied d’une montagne fertile, à quelques kilomètres de la mer. On y fabrique du vin, de la laine et du *garum*, une sauce de poisson qui s’exporte dans tout l’Empire. Il y a une trentaine de boulangeries, des dizaines de comptoirs où l’on mange debout, des thermes, un théâtre, un **amphithéâtre de 20 000 places** — le plus ancien connu en pierre — et des murs couverts d’écritures : affiches électorales, annonces de spectacles, insultes, déclarations d’amour, additions de blanchisseurs. Le forum est encore en travaux, dix-sept ans après le tremblement de terre de **62**. Rien, dans tout cela, ne ressemble à une ville qui attend une catastrophe.',
      },
      {
        titre: 'L’après-midi où le ciel tombe',
        texte:
          'Vers **une heure de l’après-midi**, une colonne de gaz et de pierres jaillit du Vésuve et monte à plus de **trente kilomètres** de haut, en forme de pin parasol. Le volcan crache un million et demi de tonnes de matière **par seconde**. À vingt-cinq kilomètres de là, à **Misène**, l’amiral **Pline l’Ancien**, qui commande la flotte, fait armer ses navires : d’abord par curiosité de savant, puis pour aller chercher des habitants pris au piège. Sur Pompéi, il pleut des **pierres ponces**, légères d’abord, puis en tapis de plus en plus épais — une quinzaine de centimètres par heure. Beaucoup fuient tout de suite, un oreiller noué sur la tête. Ceux qui se barricadent chez eux voient, vers minuit, les **toits s’effondrer** sous le poids.',
      },
      {
        titre: 'La nuit, les nuées ardentes',
        texte:
          'Vers une heure du matin, la colonne s’effondre sur elle-même et dévale la pente : c’est une **nuée ardente**, un nuage de gaz et de cendres à plusieurs centaines de degrés qui descend à la vitesse d’un train. La première ensevelit **Herculanum** en quelques minutes ; ses habitants, réfugiés dans les hangars à bateaux du port, meurent sur place — on y retrouvera plus de trois cents squelettes en 1980. D’autres nuées suivent, et celle du matin atteint Pompéi, tuant ceux qui étaient restés. Sur la plage de **Stabies**, Pline l’Ancien, asthmatique, étouffe dans les vapeurs. Son neveu, resté à Misène avec sa mère, fuit à pied dans une obscurité qu’il décrira comme celle d’une chambre fermée, toutes lampes éteintes. Il écrira tout cela bien plus tard, à la demande de **Tacite** : ce sont les deux premières lettres de l’histoire à décrire une éruption en témoin.',
      },
      {
        titre: 'Ce que la cendre a gardé',
        texte:
          'La cendre a fait ce qu’aucune fouille n’espère : elle a **arrêté le temps**. Sous six mètres de ponces, Pompéi a gardé ses rues, ses trottoirs, ses passages piétons, ses fontaines, ses boutiques avec leurs jarres en place, ses fresques aux couleurs intactes, ses jardins dont on a retrouvé les racines, et jusqu’aux graffitis d’enfants à hauteur de main. À **Herculanum**, la boue a carbonisé sans brûler : il reste des **portes en bois**, des lits, des paniers, des cordages, et les **1 800 rouleaux** de la villa des Papyrus, la seule bibliothèque antique qui nous soit parvenue. Les villes ressortent par hasard : **Herculanum en 1709**, au fond d’un puits, **Pompéi en 1748**. On n’en a encore dégagé qu’environ les deux tiers — le reste est laissé sous terre pour les archéologues de demain, qui auront de meilleurs outils.',
      },
      {
        titre: 'Les moulages de Fiorelli, et la date',
        texte:
          'En **1863**, l’archéologue **Giuseppe Fiorelli** comprend que les cavités trouvées dans la cendre durcie sont les corps disparus : il y coule du **plâtre**, casse la croûte, et fait réapparaître des gens. On voit la position exacte de la mort, les vêtements, les sandales, une main sur un visage, un **chien** tordu au bout de sa chaîne, treize personnes ensemble dans le « jardin des fugitifs ». Une centaine de moulages existent aujourd’hui. Reste une question ouverte : la date. Les manuscrits de Pline portent le **24 août**, mais on a retrouvé à Pompéi des fruits d’automne, des braseros allumés, des vêtements chauds — et, en **2018**, une ligne écrite au charbon datée du **17 octobre**. Beaucoup d’archéologues placent donc désormais l’éruption au **24 octobre 79**.',
      },
    ],
    consequences: [
      'Pompéi, Herculanum, Stabies et Oplontis disparaissent des cartes pour dix-sept siècles.',
      'Environ 2 000 personnes meurent à Pompéi ; le nombre exact restera inconnu.',
      'Les deux lettres de Pline le Jeune deviennent le premier récit de témoin d’une éruption.',
      'Depuis 1748, Pompéi est le plus grand chantier de fouilles du monde et a fait naître l’archéologie moderne.',
      'On appelle « plinienne » toute éruption à haute colonne, du Vésuve à l’Islande.',
      'Trois millions de personnes vivent aujourd’hui autour du Vésuve, toujours actif.',
    ],
    chiffres: [
      { valeur: '2 000', quoi: 'morts estimés à Pompéi' },
      { valeur: '30 km', quoi: 'la hauteur de la colonne de cendres' },
      { valeur: '20 m', quoi: 'de boue durcie sur Herculanum' },
      { valeur: '1748', quoi: 'l’année où l’on retrouve Pompéi sous la cendre' },
    ],
    chrono: [
      { date: '5 février 62', fait: 'Un tremblement de terre ravage Pompéi.' },
      { date: '24 août 79, 13 h', fait: 'La colonne de cendres monte au-dessus du Vésuve.' },
      { date: '24 août 79, minuit', fait: 'Les toits de Pompéi cèdent sous les pierres ponces.' },
      { date: '25 août 79, 1 h', fait: 'La première nuée ardente ensevelit Herculanum.' },
      { date: '25 août 79, matin', fait: 'Pompéi est atteinte ; Pline l’Ancien meurt à Stabies.' },
      { date: '1709', fait: 'Un puits tombe sur le théâtre d’Herculanum.' },
      { date: '1748', fait: 'Premières fouilles de Pompéi pour le roi de Naples.' },
      { date: '1863', fait: 'Fiorelli invente les moulages de plâtre.' },
      { date: '2018', fait: 'Une inscription au charbon relance le débat sur la date.' },
    ],
    leSaisTu:
      'Dans le four d’une boulangerie de Pompéi, on a retrouvé 81 pains ronds, marqués de huit parts comme des parts de tarte, enfournés le matin de l’éruption et jamais sortis. Un boulanger de Londres en a refait la recette en 2013 d’après un moulage : c’est un pain complet au levain, et il est très bon.',
    aRetenir: [
      'Le Vésuve entre en éruption le 24 août 79 et ensevelit Pompéi et Herculanum.',
      'Pline le Jeune, témoin depuis Misène, en fait le récit dans deux lettres à Tacite.',
      'Son oncle Pline l’Ancien meurt en allant porter secours aux habitants.',
      'Environ 2 000 personnes périssent à Pompéi, surtout sous les nuées ardentes.',
      'Les fouilles, commencées en 1748, ont rendu une ville romaine entière à l’archéologie.',
    ],
    mots: [
      {
        mot: 'Éruption plinienne',
        sens: 'Éruption explosive à très haute colonne de cendres, nommée d’après le récit de Pline le Jeune.',
      },
      {
        mot: 'Nuée ardente',
        sens: 'Avalanche de gaz, de cendres et de roches brûlantes qui descend la pente à la vitesse d’un train.',
      },
      {
        mot: 'Pierre ponce',
        sens: 'Roche volcanique pleine de bulles, si légère qu’elle flotte sur l’eau.',
      },
      {
        mot: 'Moulage',
        sens: 'Empreinte obtenue en coulant du plâtre dans la cavité laissée dans la cendre par un corps disparu.',
      },
    ],
    lies: ['paix-romaine', 'construction-du-colisee', 'fondation-de-rome'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Vésuve',
      'Pompéi',
      'Herculanum',
      'Pline le Jeune',
      'Pline l’Ancien',
      'éruption',
      'volcan',
      'nuée ardente',
      'archéologie',
      'moulages',
      'Fiorelli',
      '79',
    ],
  },
  {
    id: 'construction-du-colisee',
    volet: 'evenements',
    nom: 'La construction du Colisée',
    date: '72 – 80 apr. J.-C.',
    tri: 80,
    periode: 'antiquite',
    emoji: '🏟️',
    lieu: 'Rome, la vallée entre le Palatin, l’Esquilin et le Cælius',
    accroche:
      'Cinquante mille places, quatre-vingts arcades et un toit de toile manœuvré par des marins : Rome bâtit en huit ans la plus grande arène du monde.',
    citations: [
      {
        texte: 'Du pain et des jeux.',
        qui: 'Juvénal',
        contexte:
          'Satire X, vers 100 apr. J.-C. : le poète reproche au peuple de Rome de n’avoir plus que ces deux désirs.',
        sens: '*Panem et circenses.* Nourrir et distraire : deux devoirs de l’empereur, et deux façons de gouverner.',
      },
      {
        texte: 'Salut, César, ceux qui vont mourir te saluent !',
        qui: 'Des condamnés, à l’empereur Claude',
        contexte:
          'Suétone la rapporte une seule fois, en 52, lors d’un combat naval organisé sur le lac Fucin — et non au Colisée.',
        sens:
          'Ce n’était pas le salut des gladiateurs : rien ne prouve qu’on l’ait dit ailleurs, et Claude aurait répondu « ou pas ».',
        incertaine: true,
      },
      {
        texte:
          'Que Memphis ne parle plus des merveilles de ses pyramides : une seule œuvre tiendra lieu de toutes.',
        qui: 'Martial',
        contexte: 'Poème écrit pour l’inauguration de l’amphithéâtre, en 80 apr. J.-C.',
      },
      {
        texte:
          'Tant que le Colisée sera debout, Rome sera debout ; quand le Colisée tombera, Rome tombera.',
        qui: 'Des pèlerins anglo-saxons',
        contexte:
          'Proverbe du VIIIᵉ siècle, transmis dans un recueil attribué à Bède le Vénérable.',
        sens: 'Le mot latin employé désigne peut-être le Colosse, la statue géante voisine, et non l’amphithéâtre.',
        incertaine: true,
      },
    ],
    reperes: [
      'Chantier ouvert vers 72 par Vespasien, inauguré en 80 par son fils Titus.',
      'Une ellipse de 188 mètres sur 156, haute de 48 mètres, sur quatre étages.',
      'Environ 50 000 spectateurs, entrés et sortis par 80 arcades numérotées.',
      'Son vrai nom est l’amphithéâtre Flavien ; « Colisée » vient d’une statue voisine.',
      'Cent jours de jeux à l’inauguration, et 9 000 bêtes tuées selon Dion Cassius.',
      'Il est bâti sur le lac artificiel du palais de Néron, rendu au peuple.',
    ],
    causes: [
      'Après l’année des quatre empereurs (69), Vespasien doit faire accepter une dynastie nouvelle et sans ancêtres.',
      'Rome, un million d’habitants, n’a plus qu’un amphithéâtre trop petit et abîmé par l’incendie de 64.',
      'Le butin de la guerre de Judée et la prise de Jérusalem (70) fournissent l’argent et les bras.',
      'Donner des jeux est un devoir du prince : le peuple juge l’empereur à ce qu’il offre.',
      'Le terrain choisi est celui que Néron s’était approprié pour sa Maison dorée : le rendre au peuple est un message politique.',
    ],
    recit: [
      {
        titre: 'Rendre au peuple le lac de Néron',
        texte:
          'Après l’incendie de **64**, Néron s’était fait bâtir en plein centre de Rome un palais de plusieurs dizaines d’hectares, la **Maison dorée**, avec un lac artificiel et, à l’entrée, une statue de bronze de lui-même haute de **trente mètres** : le **Colosse**. À sa mort, en 68, l’Empire traverse une année de guerre civile et quatre empereurs. Le vainqueur, **Vespasien**, est un homme neuf, fils d’un collecteur d’impôts. Pour montrer qui gouverne, et au nom de qui, il fait **vider le lac** et y creuse les fondations d’un amphithéâtre destiné à tout le peuple. L’argent vient de la guerre de **Judée** : Jérusalem a été prise en **70**, le Temple détruit, et une partie des prisonniers travaille sur le chantier. En huit ans, une masse de **100 000 mètres cubes de travertin** sort de terre.',
      },
      {
        titre: 'Une machine de pierre',
        texte:
          'Le Colisée est une ellipse de **188 mètres sur 156**, haute de **48 mètres** : un immeuble de quinze étages. Quatre niveaux d’arcades superposent trois ordres de colonnes — dorique, ionique, corinthien. Les blocs de travertin sont assemblés sans mortier, tenus par **300 tonnes de crampons de fer**, arrachés au Moyen Âge : les trous se voient encore. Les **80 arcades** du rez-de-chaussée sont numérotées ; chaque spectateur reçoit un jeton de terre cuite, la *tessera*, qui indique sa porte, son escalier, sa travée et sa place. Cinquante mille personnes entrent ou sortent en quelques minutes. Les gradins disent la société : les sénateurs sur le marbre, au bord de l’arène ; puis les chevaliers ; puis le peuple ; et tout en haut, debout, les femmes et les esclaves. Sous le plancher de bois couvert de sable, un **sous-sol** de couloirs, de cages et de monte-charges fait surgir les bêtes au milieu de l’arène.',
      },
      {
        titre: 'Cent jours de jeux',
        texte:
          'À l’inauguration, en **80**, **Titus** offre **cent jours** de spectacles. Une journée se déroule toujours dans le même ordre : le matin, les **chasses** — lions, panthères, ours, autruches, éléphants venus de tout l’Empire ; à midi, les **exécutions** de condamnés ; l’après-midi, les **gladiateurs**. Ils combattent par paires assorties, armes lourdes contre armes légères : le **rétiaire**, avec son filet et son trident, contre le *secutor* casqué. Contrairement à l’image qu’on en garde, la plupart des combats ne finissent pas par une mort : un gladiateur coûte cher à former, et le vaincu qui s’est bien battu est renvoyé vivant. Un arbitre dirige le combat ; c’est la foule, puis l’empereur, qui décide du sort du perdant. Les vedettes de l’arène ont leurs admirateurs, leurs noms gravés sur les murs, et parfois la liberté au bout de quelques années.',
      },
      {
        titre: 'Ce que les jeux disent du pouvoir',
        texte:
          'L’amphithéâtre est le seul endroit où le peuple de Rome voit son empereur de près — et le seul où il peut lui parler. On y réclame, par des cris rythmés, la baisse du prix du blé, la grâce d’un combattant, le renvoi d’un ministre. L’empereur répond, cède ou refuse, sous les yeux de cinquante mille témoins : c’est une scène politique autant qu’un spectacle. Le sable de l’arène met aussi en images la puissance de Rome, puisque les bêtes viennent d’Afrique et d’Asie, que les condamnés sont souvent des vaincus, et que tout finit par l’ordre rétabli. Le poète **Juvénal**, vers 100, résume cela d’une formule cruelle : le peuple qui distribuait autrefois les commandements et les magistratures ne réclame plus que **du pain et des jeux**.',
      },
      {
        titre: 'Après les jeux',
        texte:
          'Les combats de gladiateurs sont interdits au début du **Vᵉ siècle** — un dernier est attesté en **404** — et les chasses s’arrêtent vers **523**. Le monument, lui, devient tour à tour forteresse, logements, ateliers, église, et surtout **carrière de pierre** : on y prend le travertin du palais de Venise, du palais Farnèse et d’une partie de Saint-Pierre. Les séismes de **1231** et **1349** abattent tout le flanc sud, celui qui manque aujourd’hui. En **1749**, le pape **Benoît XIV** interdit d’y toucher et le consacre à la mémoire des martyrs chrétiens. Il ne reste qu’une partie de la pierre d’origine, et c’est pourtant le monument le plus visité d’Italie : près de **sept millions** de visiteurs par an.',
      },
    ],
    consequences: [
      'Rome se dote du plus grand amphithéâtre du monde romain, copié partout : Nîmes, Arles, El Jem.',
      'La dynastie flavienne s’installe : le peuple a son bâtiment, l’empereur a sa scène.',
      'Les jeux deviennent le rendez-vous régulier entre le prince et la plèbe de Rome.',
      'Le plan — gradins elliptiques, entrées numérotées, sorties rapides — est celui de nos stades.',
      'Les combats cessent au Vᵉ siècle ; le monument sert de carrière de pierre pendant mille ans.',
      'Protégé depuis 1749, il reçoit aujourd’hui près de sept millions de visiteurs par an.',
    ],
    chiffres: [
      { valeur: '50 000', quoi: 'spectateurs, entrés par 80 arcades numérotées' },
      { valeur: '48 m', quoi: 'de hauteur, soit un immeuble de quinze étages' },
      { valeur: '100 jours', quoi: 'de jeux pour l’inauguration, en 80' },
      { valeur: '9 000', quoi: 'animaux tués pendant ces cent jours, selon Dion Cassius' },
    ],
    chrono: [
      { date: '64', fait: 'L’incendie de Rome ; Néron bâtit sa Maison dorée.' },
      { date: '70', fait: 'Prise de Jérusalem : le butin financera le chantier.' },
      { date: 'vers 72', fait: 'Vespasien fait vider le lac de Néron et ouvre le chantier.' },
      { date: '79', fait: 'Mort de Vespasien ; trois étages sont debout.' },
      { date: '80', fait: 'Titus inaugure l’amphithéâtre : cent jours de jeux.' },
      { date: '81 – 96', fait: 'Domitien ajoute le dernier étage et les sous-sols.' },
      { date: '404', fait: 'Dernier combat de gladiateurs attesté à Rome.' },
      { date: 'vers 523', fait: 'Dernières chasses données dans l’arène.' },
      { date: '1349', fait: 'Un séisme abat tout le flanc sud.' },
      { date: '1749', fait: 'Benoît XIV interdit d’en prendre la pierre.' },
    ],
    leSaisTu:
      'Le toit du Colisée était une immense toile tendue sur des mâts, le *velum*, déployée contre le soleil par un détachement de marins de la flotte de Misène : les seuls hommes capables de manœuvrer autant de cordages. C’est la flotte que commandait Pline l’Ancien le jour de l’éruption du Vésuve.',
    aRetenir: [
      'Le Colisée, ou amphithéâtre Flavien, est construit à Rome de 72 à 80 apr. J.-C.',
      'Vespasien ouvre le chantier, son fils Titus l’inaugure en 80 par cent jours de jeux.',
      'Il contient environ 50 000 spectateurs, placés selon leur rang dans la société.',
      'Chasses, exécutions et gladiateurs : les jeux sont un moyen de gouverner le peuple.',
      'La formule « Ave César, ceux qui vont mourir te saluent » n’est attestée qu’une fois, et pas ici.',
    ],
    mots: [
      {
        mot: 'Amphithéâtre',
        sens: 'Bâtiment à gradins tout autour d’une arène ovale, pour les combats ; le théâtre, lui, est en demi-cercle.',
      },
      {
        mot: 'Arène',
        sens: 'Du latin *harena*, le sable : la piste ovale, sablée pour boire le sang et amortir les chutes.',
      },
      {
        mot: 'Velum',
        sens: 'Grande toile tendue au-dessus des gradins pour faire de l’ombre, manœuvrée par des marins.',
      },
      {
        mot: 'Gladiateur',
        sens: 'Combattant de l’arène — esclave, condamné ou volontaire —, armé et entraîné dans une école spécialisée.',
      },
    ],
    lies: [
      'paix-romaine',
      'eruption-du-vesuve',
      'revolte-de-spartacus',
      'jeux-olympiques-antiques',
    ],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Colisée',
      'amphithéâtre Flavien',
      'gladiateurs',
      'Vespasien',
      'Titus',
      'jeux',
      'arène',
      'velum',
      'Rome',
      'panem et circenses',
      'Néron',
    ],
  },
  {
    id: 'paix-romaine',
    volet: 'evenements',
    nom: 'La paix romaine',
    date: '27 av. J.-C. – 180 apr. J.-C.',
    tri: 100,
    fin: 180,
    periode: 'antiquite',
    emoji: '🛣️',
    lieu: 'De l’Écosse au Sahara, de l’Atlantique à l’Euphrate',
    accroche:
      'Pendant deux siècles, un enfant né à York, à Nîmes ou à Antioche grandit sous la même loi, la même monnaie et les mêmes routes.',
    citations: [
      {
        texte: 'L’immense majesté de la paix romaine.',
        qui: 'Pline l’Ancien',
        contexte:
          '*Histoire naturelle*, vers 77 apr. J.-C., à propos des plantes et des savoirs que la paix fait circuler d’un bout du monde à l’autre.',
        sens: '*Immensa Romanae pacis maiestas.* C’est un Romain qui parle, et il parle de son propre empire.',
      },
      {
        texte: 'Ils font un désert, et ils appellent cela la paix.',
        qui: 'Calgacus, chef calédonien',
        contexte:
          'Discours que Tacite lui prête devant ses guerriers, avant la bataille du mont Graupius, en Écosse, vers 83 apr. J.-C.',
        sens:
          '*Ubi solitudinem faciunt, pacem appellant.* Calgacus n’a sans doute jamais dit ces mots : c’est Tacite, historien romain, qui fait dire aux vaincus ce que la conquête leur coûte.',
        incertaine: true,
      },
      {
        texte: 'Je donne la citoyenneté romaine à tous les étrangers qui vivent dans le monde.',
        qui: 'Caracalla',
        contexte:
          'Édit de 212, conservé sur un papyrus retrouvé en Égypte. D’un jour à l’autre, des millions d’habitants deviennent citoyens.',
      },
      {
        texte:
          'Le monde entier, comme au premier jour d’une fête, a déposé son vieux vêtement de fer et s’est paré.',
        qui: 'Aelius Aristide',
        contexte: 'Éloge de Rome prononcé devant l’empereur Antonin le Pieux, vers 144 apr. J.-C.',
      },
    ],
    reperes: [
      'De 27 av. J.-C. à 180 apr. J.-C. : deux siècles sans guerre civile à l’intérieur de l’Empire.',
      'Environ 50 millions d’habitants sur 5 millions de kilomètres carrés.',
      '80 000 km de routes pavées, bornées tous les milles romains de 1 481 mètres.',
      'Une seule monnaie d’argent, le denier, circule de l’Écosse à l’Euphrate.',
      'En 212, l’édit de Caracalla fait citoyens presque tous les hommes libres de l’Empire.',
      'La paix est tenue par 300 000 à 400 000 soldats postés sur les frontières.',
    ],
    causes: [
      'La victoire d’Actium, en 31 av. J.-C., met fin à un siècle de guerres civiles : un seul homme commande.',
      'Auguste éloigne l’armée : les légions vivent aux frontières et non plus en Italie.',
      'Rome gouverne peu et laisse les cités s’administrer elles-mêmes, pourvu qu’elles paient et restent calmes.',
      'Les élites locales reçoivent la citoyenneté romaine : il devient plus avantageux d’entrer dans l’Empire que de le combattre.',
      'Une province en paix rapporte de l’impôt, du blé et des soldats ; une province révoltée coûte une armée.',
    ],
    recit: [
      {
        titre: 'Les portes du temple de Janus',
        texte:
          'À Rome, le temple de **Janus** avait ses portes ouvertes en temps de guerre et fermées en temps de paix. En sept siècles, on ne les avait fermées que **deux fois**. **Auguste** les ferme **trois fois** à lui seul. En **27 av. J.-C.**, il rend ses pouvoirs au Sénat, qui les lui rend aussitôt : les consuls continuent d’être élus, le Sénat siège, mais un seul homme commande les vingt-huit légions. Il fait graver le bilan de son règne, les *Res Gestae*, et élever au Champ de Mars l’**Ara Pacis**, l’autel de la Paix. Ce n’est pas la fin de toute guerre : l’Empire se bat sans arrêt à ses frontières, perd trois légions en Germanie en 9 apr. J.-C., conquiert la Bretagne puis la Dacie. Mais à l’intérieur, pendant deux cents ans, on ne voit plus une armée romaine marcher sur Rome.',
      },
      {
        titre: 'La route, l’eau, la ville',
        texte:
          'Ce que l’Empire apporte se voit et se touche. **80 000 kilomètres de routes pavées**, droites, bombées pour l’écoulement de l’eau, bornées tous les milles : un courrier officiel y fait **75 kilomètres par jour** en changeant de chevaux aux relais. Les mers sont vidées des pirates et un navire va d’Alexandrie à Rome en deux semaines. Partout, la même ville se répète : deux rues principales à angle droit, un **forum**, des **thermes**, un théâtre, un amphithéâtre — et l’eau. Le **pont du Gard** porte un canal qui descend de douze mètres seulement sur cinquante kilomètres, soit **vingt-cinq centimètres par kilomètre**, pour amener chaque jour l’eau d’une source jusqu’à Nîmes. Rome, elle, a onze aqueducs, des centaines de fontaines, des égouts, et des thermes où l’entrée coûte une petite pièce de cuivre. On écrit la même langue, on pèse avec les mêmes poids, on paie avec le même **denier**.',
      },
      {
        titre: 'Devenir romain',
        texte:
          'La romanisation n’est pas seulement imposée : elle est demandée. Les notables des provinces veulent des bains, des jeux, des statues et le droit de porter la **toge**. Rome, de son côté, distribue la **citoyenneté** comme une récompense : à un soldat auxiliaire après vingt-cinq ans de service, à une famille, à une cité entière. En **48 apr. J.-C.**, l’empereur **Claude** fait entrer des notables gaulois au Sénat, et son discours est gravé sur une table de bronze retrouvée à Lyon. Bientôt, les empereurs eux-mêmes ne sont plus italiens : **Trajan** et **Hadrien** sont nés en Espagne, **Septime Sévère** en Afrique. En **212**, l’édit de **Caracalla** fait de presque tous les hommes libres de l’Empire des citoyens romains. Le latin, lui, restera après tout le reste : il est devenu le français, l’espagnol, l’italien, le portugais et le roumain.',
      },
      {
        titre: 'Ce que la paix coûte',
        texte:
          'Cette paix commence toujours par une conquête. La Gaule a perdu, d’après les chiffres donnés par César lui-même, des centaines de milliers d’hommes ; la **Judée** voit **Jérusalem** prise et son Temple détruit en **70** ; la **Bretagne** voit écraser la révolte de la reine **Boudicca** en 61. Ensuite vient l’**impôt** : chaque province paie le tribut, et l’**annone** fait venir d’Égypte et d’Afrique les centaines de milliers de tonnes de blé qui nourrissent Rome. Enfin, il y a l’**esclavage**, partout : dans les mines, les champs, les maisons, les arènes ; en Italie, peut-être un habitant sur quatre. Un chef calédonien, dans le récit de Tacite, résume ce que les vaincus voient de la *Pax Romana* : « Ils font un désert, et ils appellent cela la paix. » Les deux faces sont vraies en même temps, et c’est ainsi qu’il faut la lire.',
      },
      {
        titre: 'La fin des deux siècles',
        texte:
          'La paix romaine s’achève avec **Marc Aurèle**, mort en **180** sur le front du Danube. Elle avait déjà été entamée par la **peste antonine**, rapportée d’Orient par les légions en 165, et par les peuples du Nord qui franchissent le fleuve. Après lui viennent son fils **Commode**, puis, au **IIIᵉ siècle**, la crise : une vingtaine d’empereurs en cinquante ans, la monnaie qui perd sa valeur, les invasions, les villes qui se referment derrière des remparts bâtis à la hâte. Mais ce que les deux siècles ont construit ne disparaît pas : les routes servent encore au Moyen Âge, le droit romain s’enseigne dans les universités, l’Église reprend les circonscriptions et le latin de l’Empire — et le pont du Gard est toujours debout.',
      },
    ],
    consequences: [
      'Un espace de 5 millions de km² vit sous une seule loi, une seule monnaie, une seule armée.',
      'La romanisation s’étend : villes à plan romain, latin, thermes, droit, cité après cité.',
      'En 212, l’édit de Caracalla fait de presque tous les hommes libres des citoyens romains.',
      'Le commerce circule à une échelle qu’on ne reverra pas avant le XVIIIᵉ siècle.',
      'Le christianisme se répand par les routes, les ports et les garnisons de l’Empire.',
      'Routes, aqueducs, langues latines, droit : l’Europe vit encore dessus après 476.',
    ],
    chiffres: [
      { valeur: '80 000 km', quoi: 'de routes pavées, de l’Écosse à l’Euphrate' },
      { valeur: '50 millions', quoi: 'd’habitants, soit un humain sur cinq' },
      { valeur: '2 siècles', quoi: 'sans guerre civile à l’intérieur de l’Empire' },
      { valeur: '212', quoi: 'l’année où presque tous les hommes libres deviennent citoyens' },
    ],
    chrono: [
      { date: '27 av. J.-C.', fait: 'Auguste reçoit ses pouvoirs : début de la paix romaine.' },
      { date: '9 apr. J.-C.', fait: 'Trois légions anéanties en Germanie, à Teutobourg.' },
      { date: '43', fait: 'Claude commence la conquête de la Bretagne.' },
      { date: '48', fait: 'Claude fait entrer des notables gaulois au Sénat.' },
      { date: '70', fait: 'Prise de Jérusalem ; le Temple est détruit.' },
      { date: '117', fait: 'L’Empire atteint sa plus grande étendue sous Trajan.' },
      { date: '122', fait: 'Hadrien fait bâtir son mur, au nord de la Bretagne.' },
      { date: '165', fait: 'La peste antonine ravage l’Empire.' },
      { date: '180', fait: 'Mort de Marc Aurèle : la paix romaine s’achève.' },
      { date: '212', fait: 'L’édit de Caracalla étend la citoyenneté à presque tous.' },
    ],
    leSaisTu:
      'Auguste fit planter au Forum une borne dorée, le *milliarium aureum*, d’où l’on comptait les distances de toutes les routes de l’Empire. C’est de ce poteau que vient l’expression « tous les chemins mènent à Rome » : les chiffres gravés sur les bornes, de l’Écosse au Sahara, étaient comptés à partir de lui.',
    aRetenir: [
      'La paix romaine dure de 27 av. J.-C. à 180 apr. J.-C., d’Auguste à Marc Aurèle.',
      'L’Empire compte alors 50 millions d’habitants et 80 000 km de routes pavées.',
      'La romanisation apporte les villes, les thermes, les aqueducs, le latin et le droit romain.',
      'En 212, l’édit de Caracalla accorde la citoyenneté à presque tous les hommes libres.',
      'Cette paix repose sur la conquête, l’impôt et l’esclavage : les deux faces vont ensemble.',
    ],
    mots: [
      {
        mot: 'Romanisation',
        sens: 'Adoption, par les peuples conquis, du mode de vie romain : langue, ville, vêtement, dieux, droit.',
      },
      {
        mot: 'Citoyenneté',
        sens: 'Statut qui donne le droit de voter à Rome, d’être jugé selon le droit romain et d’échapper aux peines infamantes.',
      },
      {
        mot: 'Limes',
        sens: 'La frontière fortifiée de l’Empire : forts, tours de guet, routes militaires, parfois un mur continu.',
      },
      {
        mot: 'Annone',
        sens: 'Le service qui achemine et distribue le blé des provinces pour nourrir la ville de Rome.',
      },
      {
        mot: 'Aqueduc',
        sens: 'Canal, souvent souterrain, qui amène l’eau d’une source jusqu’à une ville par la seule pente.',
      },
    ],
    lies: [
      'auguste',
      'conquete-de-la-gaule',
      'construction-du-colisee',
      'eruption-du-vesuve',
      'chute-de-l-empire-romain-d-occident',
    ],
    niveaux: ['6e', '2de'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'paix romaine',
      'Pax Romana',
      'romanisation',
      'Auguste',
      'aqueduc',
      'thermes',
      'citoyenneté',
      'Caracalla',
      'routes',
      'limes',
      'Empire romain',
      'latin',
    ],
  },
  {
    id: 'edit-de-thessalonique',
    volet: 'evenements',
    nom: 'L’édit de Thessalonique',
    date: '27 février 380',
    tri: 380,
    periode: 'antiquite',
    emoji: '⛪',
    lieu: 'Thessalonique, en Macédoine',
    accroche:
      'Le 27 février 380, l’Empire romain cesse de tolérer toutes les religions et en choisit une : le christianisme devient la foi officielle.',
    citations: [
      {
        texte:
          'Nous voulons que tous les peuples que gouverne notre clémence professent la religion que le divin apôtre Pierre a donnée aux Romains, et que ceux qui suivent cette loi prennent le nom de chrétiens catholiques.',
        qui: 'Théodose Iᵉʳ',
        contexte:
          'Édit *Cunctos populos*, publié à Thessalonique le 27 février 380 et conservé dans le Code théodosien.',
        sens: 'Le mot grec *katholikos* veut dire « universel » : il entre ici dans la loi romaine.',
      },
      {
        texte:
          'Nous regardons les mêmes étoiles, le ciel nous est commun : on ne peut arriver par une seule voie à un si grand secret.',
        qui: 'Symmaque',
        contexte:
          'Plaidoyer du préfet de Rome pour conserver l’autel de la Victoire dans la salle du Sénat, en 384. Il perdra.',
      },
      {
        texte: 'Tu as imité David dans la faute : imite-le dans le repentir.',
        qui: 'Ambroise de Milan',
        contexte:
          'À l’empereur Théodose après le massacre de Thessalonique, en 390. La lettre de l’évêque est conservée ; la formule ramassée vient de la tradition.',
        sens: 'L’évêque lui refuse la communion tant qu’il n’aura pas reconnu sa faute publiquement.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le 27 février 380, Théodose Iᵉʳ publie l’édit *Cunctos populos* à Thessalonique.',
      'Il impose la foi définie à Nicée en 325 : un seul Dieu en trois personnes égales.',
      'Ceux qui la suivent s’appellent « chrétiens catholiques » ; les autres sont dits hérétiques.',
      'Le concile de Constantinople, en 381, complète le Credo encore récité aujourd’hui.',
      'En 392, les cultes anciens sont interdits ; en 393, les Jeux d’Olympie s’arrêtent.',
    ],
    causes: [
      'Depuis l’édit de Milan (313), le christianisme est libre, soutenu par les empereurs, et devenu majoritaire dans les villes.',
      'Les chrétiens sont profondément divisés sur la nature du Christ : la querelle arienne dure depuis soixante ans.',
      'Rome a toujours lié le salut de l’État au culte rendu correctement : un empereur se croit responsable de la foi de ses sujets.',
      'Après le désastre d’Andrinople (378), où l’empereur Valens a été tué, l’Empire a un besoin vital d’unité.',
      'Théodose, Espagnol de Galice, reçoit le baptême à Thessalonique au cours d’une grave maladie, l’hiver précédent.',
      'Les grands évêques, en particulier Ambroise de Milan, pèsent désormais sur les décisions impériales.',
    ],
    recit: [
      {
        titre: 'Un empereur malade à Thessalonique',
        texte:
          'Le **9 août 378**, à **Andrinople**, les Goths écrasent l’armée romaine et tuent l’empereur **Valens** : les deux tiers des soldats restent sur le terrain. C’est la pire défaite depuis Cannes. En janvier **379**, un général espagnol de trente-deux ans, **Théodose**, est fait empereur d’Orient pour redresser la situation, et installe son quartier général à **Thessalonique**, en Macédoine. L’hiver suivant, il tombe si gravement malade qu’il demande le **baptême**, qu’il avait, comme beaucoup à l’époque, remis à plus tard. Il le reçoit des mains de l’évêque **Acholius**. Guéri, il publie le **27 février 380** le texte qui commence par les mots *Cunctos populos* — « tous les peuples ». Ce n’est ni une prière ni une déclaration d’intention : c’est une **loi**, adressée d’abord aux habitants de Constantinople.',
      },
      {
        titre: 'Ce que dit le texte',
        texte:
          'L’édit tient en quelques lignes. Tous les peuples de l’Empire doivent professer **la foi que l’apôtre Pierre a transmise aux Romains**, celle que confessent l’évêque de Rome, **Damase**, et celui d’Alexandrie, **Pierre** : un seul Dieu en trois personnes de même dignité, le **Père, le Fils et le Saint-Esprit**. Ceux qui la suivent porteront le nom de **chrétiens catholiques**, du grec *katholikos*, universel. Les autres seront tenus pour **hérétiques**, et leurs lieux de réunion ne porteront plus le nom d’églises. Le texte ne vise donc pas d’abord les païens, mais les chrétiens **ariens**, très nombreux en Orient et chez les Goths, qui ne reconnaissent pas au Fils la même divinité qu’au Père. Après soixante ans de querelles qui déchiraient l’Empire, le pouvoir tranche.',
      },
      {
        titre: 'Une foi, un Empire',
        texte:
          'La suite vient vite. En **381**, Théodose réunit à **Constantinople** un concile de **cent cinquante évêques** qui confirme Nicée et complète le **Credo** — le texte récité aujourd’hui encore dans les églises. Les lieux de culte tenus par les ariens changent de mains. En **382**, l’**autel de la Victoire**, devant lequel les sénateurs prêtaient serment depuis Auguste, est retiré de la curie ; deux ans plus tard, le préfet **Symmaque** plaide en vain pour son retour. En **391 et 392**, les sacrifices, la divination et la fréquentation des temples sont interdits dans tout l’Empire ; en **393** se tient la dernière olympiade à Olympie, après près de **douze siècles**. Ce qui avait commencé en 313 comme une liberté accordée à tous les cultes s’achève, soixante-sept ans plus tard, en religion d’État.',
      },
      {
        titre: 'L’empereur à genoux',
        texte:
          'En **390**, à Thessalonique, une émeute du cirque tourne au lynchage : le gouverneur goth **Botheric** est tué. La répression est terrible — la foule est massacrée dans l’hippodrome, sept mille morts selon les sources. **Ambroise**, évêque de Milan, refuse alors la communion à l’empereur et lui écrit qu’un chrétien, fût-il maître du monde, doit répondre de ses actes. Théodose accepte : il dépose les insignes impériaux et fait **pénitence publique** dans la cathédrale de Milan avant d’être admis de nouveau à la communion, à Noël. Jamais un empereur romain ne s’était ainsi soumis. La scène marquera durablement l’Occident : elle pose l’idée que le pouvoir politique, si haut soit-il, n’est pas au-dessus de la loi morale — idée dont vivra tout le Moyen Âge.',
      },
      {
        titre: 'Ce qui reste, et ce qui se perd',
        texte:
          'Théodose meurt à Milan le **17 janvier 395**. Il est le **dernier empereur** à régner seul sur l’Empire entier : à sa mort, l’Orient va à son fils **Arcadius**, l’Occident à **Honorius**, et les deux moitiés ne seront plus jamais réunies. Quatre-vingt-un ans plus tard, celle d’Occident tombera. L’Église, elle, hérite du cadre romain et lui survit : les **diocèses** empruntent leur nom et leurs limites aux circonscriptions impériales, le **latin** reste sa langue, le droit romain nourrit son droit. L’autre face est là aussi : à partir de 380, croire autrement devient un délit, les temples ferment, et les cultes anciens s’éteignent en quelques générations. Le texte de Théodose fonde l’Europe chrétienne du Moyen Âge — avec ce qu’elle apporte et ce qu’elle referme.',
      },
    ],
    consequences: [
      'Le christianisme de Nicée devient la religion officielle de l’Empire romain.',
      'Le mot « catholique » entre dans la loi pour désigner ceux qui suivent cette foi.',
      'Le concile de Constantinople, en 381, fixe le Credo récité encore aujourd’hui.',
      'Les cultes anciens sont interdits en 392 ; les Jeux d’Olympie s’arrêtent en 393.',
      'L’Église reprend le cadre romain — diocèses, latin, droit — et lui survivra après 476.',
      'La pénitence de Théodose devant Ambroise ouvre, pour mille ans, la question des rapports entre l’empereur et l’Église.',
    ],
    chiffres: [
      { valeur: '27 février 380', quoi: 'la date de l’édit *Cunctos populos*' },
      { valeur: '150', quoi: 'évêques réunis au concile de Constantinople, en 381' },
      { valeur: '67 ans', quoi: 'entre la liberté de culte de 313 et la religion d’État' },
      { valeur: '12 siècles', quoi: 'de Jeux à Olympie, arrêtés en 393' },
    ],
    chrono: [
      { date: '9 août 378', fait: 'Désastre d’Andrinople : l’empereur Valens est tué.' },
      { date: 'Janvier 379', fait: 'Théodose est proclamé empereur d’Orient.' },
      { date: 'Hiver 379-380', fait: 'Malade, il reçoit le baptême à Thessalonique.' },
      { date: '27 février 380', fait: 'Édit *Cunctos populos* : le christianisme devient officiel.' },
      { date: '381', fait: 'Concile de Constantinople : le Credo est complété.' },
      { date: '382', fait: 'L’autel de la Victoire est retiré du Sénat de Rome.' },
      { date: '390', fait: 'Massacre de Thessalonique, puis pénitence de Théodose.' },
      { date: '392', fait: 'Interdiction des sacrifices et des cultes anciens.' },
      { date: '393', fait: 'Dernière olympiade à Olympie.' },
      { date: '17 janvier 395', fait: 'Mort de Théodose ; l’Empire est partagé.' },
    ],
    leSaisTu:
      'En 394, Théodose fait éteindre le feu de Vesta, entretenu jour et nuit au Forum depuis les origines de la ville, et dissout le collège des vestales qui le gardait. Les Romains croyaient depuis mille ans que Rome tomberait si ce feu s’éteignait. Il s’éteignit — et Rome fut prise seize ans plus tard, en 410.',
    aRetenir: [
      'Le 27 février 380, l’édit de Thessalonique fait du christianisme la religion officielle.',
      'Il est publié par l’empereur Théodose Iᵉʳ et impose la foi définie à Nicée en 325.',
      'Il complète l’édit de Milan de 313, qui n’accordait que la liberté de culte à tous.',
      'En 392, les cultes anciens sont interdits ; en 393 s’arrêtent les Jeux d’Olympie.',
      'À la mort de Théodose, en 395, l’Empire est partagé entre Orient et Occident.',
    ],
    mots: [
      {
        mot: 'Catholique',
        sens: 'Du grec *katholikos*, « universel » : le mot désigne, depuis 380, la foi définie à Nicée.',
      },
      {
        mot: 'Arianisme',
        sens: 'Doctrine du prêtre Arius, pour qui le Fils est inférieur au Père ; condamnée au concile de Nicée en 325.',
      },
      {
        mot: 'Hérésie',
        sens: 'Croyance jugée contraire à la doctrine reçue par l’Église ; à partir de 380, elle devient un délit.',
      },
      {
        mot: 'Concile',
        sens: 'Assemblée d’évêques réunie pour trancher une question de foi ou d’organisation.',
      },
      {
        mot: 'Paganisme',
        sens: 'Nom donné par les chrétiens aux cultes anciens, de *paganus*, l’habitant des campagnes.',
      },
    ],
    lies: [
      'edit-de-milan',
      'naissance-du-christianisme',
      'constantin',
      'chute-de-l-empire-romain-d-occident',
      'jeux-olympiques-antiques',
    ],
    niveaux: ['6e'],
    programme: 'Des chrétiens dans l’Empire',
    tags: [
      'édit de Thessalonique',
      'Théodose',
      '380',
      'christianisme',
      'religion officielle',
      'Nicée',
      'catholique',
      'Ambroise de Milan',
      'arianisme',
      'Symmaque',
      'Empire romain',
    ],
  },
]
