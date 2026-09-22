// -----------------------------------------------------------------------------
// ANTIQUITÉ — Rome : de l'ennemi carthaginois au premier empereur chrétien.
//
// Neuf portraits qui tiennent en une seule ligne de temps : Hannibal manque
// d'abattre la République, Spartacus montre sur quoi elle repose, César la
// tue, Vercingétorix perd la Gaule qui deviendra la France, Cléopâtre emporte
// avec elle le dernier royaume d'Alexandre, Auguste invente l'Empire — et
// c'est dans cet Empire-là, sur ses routes et dans sa langue commune, que
// naît puis se répand le christianisme de Jésus, de Paul et de Constantin.
//
// Le patron est celui de `personnages-moyen-age-rois.ts` : la citation
// d'abord, des repères qu'on lit en trente secondes, un récit dense, une
// frise, une anecdote, ce qui tombe au contrôle. Guide complet :
// `docs/encyclopedie.md`.
//
// Deux fiches demandent une attention particulière, et elles l'ont : Jésus de
// Nazareth et Paul de Tarse sont écrits avec RESPECT et SOBRIÉTÉ — ce que les
// Évangiles rapportent est donné comme tel, ce que l'histoire établit (Tacite,
// Flavius Josèphe) est donné comme tel, et rien n'est dit sur le ton de la
// démystification. Le latin est partout traduit (`sens`), et les phrases
// seulement PRÊTÉES — « Tu quoque », « Vae victis », « In hoc signo vinces » —
// portent leur `incertaine: true`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_ANTIQUITE_ROME: Personnage[] = [
  {
    id: 'hannibal',
    volet: 'personnages',
    nom: 'Hannibal Barca',
    surnom: 'le fléau de Rome',
    dates: '247 – 183 av. J.-C.',
    tri: -183,
    periode: 'antiquite',
    emoji: '🐘',
    roles: ['Général carthaginois', 'Chef de guerre', 'Stratège'],
    origine: 'Carthage, Afrique du Nord',
    accroche:
      'Il franchit les Alpes avec des éléphants, anéantit l’armée romaine à Cannes et campe seize ans en Italie sans jamais prendre Rome.',
    citations: [
      {
        texte: 'Nous trouverons un chemin, ou nous en ferons un.',
        contexte:
          'À ses officiers qui jugeaient les Alpes infranchissables, automne 218 av. J.-C.',
        sens:
          'En latin *inveniemus viam aut faciemus* : la phrase lui est prêtée depuis l’Antiquité tardive et résume sa manière — l’obstacle n’est jamais une réponse.',
        incertaine: true,
      },
      {
        texte: 'Tu sais vaincre, Hannibal ; tu ne sais pas te servir de la victoire.',
        qui: 'Maharbal, chef de sa cavalerie',
        contexte:
          'Au lendemain de Cannes, quand Hannibal refuse de marcher sur Rome. Rapporté par Tite-Live : *Vincere scis, Hannibal, victoria uti nescis.*',
        sens:
          'Le reproche que l’histoire lui fait encore : il a gagné toutes les batailles et perdu la guerre faute d’avoir su finir.',
      },
      {
        texte: 'Je jure de ne jamais être l’ami du peuple romain.',
        contexte:
          'Serment prêté à neuf ans devant l’autel, à la demande de son père Hamilcar. Rapporté par Polybe, qui le tient d’Hannibal lui-même.',
      },
    ],
    reperes: [
      'Fils du général carthaginois Hamilcar Barca, il jure à neuf ans une haine éternelle à Rome.',
      'Automne 218 av. J.-C. : il passe les Alpes avec 30 000 hommes et 37 éléphants.',
      'Cannes, 2 août 216 av. J.-C. : plus de 50 000 Romains tués en une seule journée.',
      'Il reste seize ans en Italie sans jamais assiéger Rome, faute de machines et de renforts.',
      'Rappelé à Carthage, il est battu par Scipion à Zama en 202 av. J.-C.',
      'Traqué par Rome jusqu’en Asie, il s’empoisonne vers 183 av. J.-C. en Bithynie.',
    ],
    recit: [
      {
        titre: 'L’enfant qui jure devant l’autel',
        texte:
          '**Carthage**, grande cité marchande d’Afrique du Nord, vient de perdre la **première guerre punique** (264 – 241 av. J.-C.) : la Sicile, la flotte, une indemnité écrasante. Le général **Hamilcar Barca** emmène alors son fils de neuf ans devant l’autel et lui fait jurer de ne jamais être l’ami de Rome — la scène est racontée par **Polybe**, qui la tient d’Hannibal lui-même. La famille part refaire en **Espagne** l’empire perdu : mines d’argent, villes neuves, armées levées sur place. À vingt-six ans, Hannibal commande. En **219 av. J.-C.**, il attaque **Sagonte**, ville protégée par Rome : la deuxième guerre punique commence.',
      },
      {
        titre: 'Les Alpes, puis Cannes',
        texte:
          'Rome attend la guerre en Espagne ou en Afrique. Hannibal la porte en **Italie**. Il part avec près de **30 000 hommes**, des cavaliers numides et **37 éléphants**, traverse les Pyrénées, le Rhône, puis les **Alpes** en quinze jours d’octobre, sous la neige et les embuscades des montagnards. Il en ressort avec la moitié de son armée. Ce qui suit est une leçon de stratégie qu’on enseigne encore : le **Tessin**, la **Trébie**, le **lac Trasimène** où une armée consulaire entière est détruite dans le brouillard. Puis **Cannes**, le **2 août 216 av. J.-C.** : 80 000 Romains face à 50 000 Carthaginois. Hannibal laisse son centre reculer, referme ses ailes et **encercle** l’armée la plus nombreuse que Rome ait jamais levée. Plus de 50 000 morts en une journée. C’est la manœuvre en tenaille, copiée depuis par tous les états-majors du monde.',
      },
      {
        titre: 'Seize ans en Italie, et rien',
        texte:
          'Après Cannes, la route de Rome est ouverte — et Hannibal n’y va pas. Il n’a ni machines de siège, ni vivres, ni renforts pour prendre une ville de 300 000 habitants derrière ses murailles. Il mise sur autre chose : faire lâcher Rome par ses alliés italiens. Capoue, Tarente et une partie du Sud basculent — pas le reste. Rome, elle, change de méthode : **Fabius Maximus**, surnommé *Cunctator*, « le Temporisateur », refuse la bataille rangée, harcèle, affame, gagne du temps. Hannibal tient **seize ans** dans la péninsule, invaincu et sans victoire décisive, coupé de Carthage qui lui refuse les renforts. En **207 av. J.-C.**, l’armée de secours de son frère **Hasdrubal** est détruite au Métaure ; les Romains jettent la tête du frère dans le camp d’Hannibal.',
      },
      {
        titre: 'Zama, l’exil, le poison',
        texte:
          'Le jeune **Scipion** retourne contre Carthage la stratégie d’Hannibal : il prend l’Espagne, puis débarque en **Afrique**. Carthage rappelle son général. À **Zama**, en **202 av. J.-C.**, les deux hommes s’affrontent enfin : Scipion a gagné à lui la cavalerie numide, ouvre ses rangs pour laisser passer les éléphants, et l’emporte. Hannibal a quarante-cinq ans ; il perd sa première bataille et la guerre. Il devient alors **magistrat** à Carthage, réforme les finances et assainit la cité — si bien que les notables inquiets le dénoncent à Rome. Il fuit chez **Antiochos III** de Syrie, puis en **Bithynie**, d’exil en exil. Vers **183 av. J.-C.**, cerné par les envoyés romains, il boit le poison qu’il portait dans une bague. Rome aura mis quarante ans à se débarrasser d’un seul homme, et rasera Carthage en 146 av. J.-C.',
      },
    ],
    chrono: [
      { date: '247 av. J.-C.', fait: 'Naissance à Carthage, fils d’Hamilcar Barca.' },
      { date: '219 av. J.-C.', fait: 'Prise de Sagonte : la deuxième guerre punique éclate.' },
      { date: '218 av. J.-C.', fait: 'Passage des Alpes avec 37 éléphants.' },
      { date: '216 av. J.-C.', fait: 'Écrasante victoire de Cannes, le 2 août.' },
      { date: '211 av. J.-C.', fait: 'Il campe un jour devant Rome, sans attaquer.' },
      { date: '207 av. J.-C.', fait: 'Son frère Hasdrubal est tué au Métaure.' },
      { date: '202 av. J.-C.', fait: 'Défaite de Zama face à Scipion.' },
      { date: '183 av. J.-C.', fait: 'Il s’empoisonne en Bithynie pour échapper à Rome.' },
    ],
    leSaisTu:
      'Pendant des siècles, les mères romaines ont fait taire leurs enfants avec *Hannibal ad portas* — « Hannibal est aux portes ». Il n’avait campé devant Rome qu’une seule journée, en 211 av. J.-C., et n’avait même pas attaqué : l’expression a survécu bien plus longtemps que son armée.',
    aRetenir: [
      'Hannibal est le général carthaginois de la deuxième guerre punique (218 – 201 av. J.-C.).',
      'En 218 av. J.-C., il franchit les Alpes avec ses éléphants et porte la guerre en Italie.',
      'À Cannes, le 2 août 216 av. J.-C., il encercle et détruit la plus grande armée romaine.',
      'Scipion le bat à Zama en 202 av. J.-C. : Carthage perd la guerre et son empire.',
      'Il se donne la mort en exil vers 183 av. J.-C. ; Carthage est rasée en 146 av. J.-C.',
    ],
    mots: [
      {
        mot: 'Guerres puniques',
        sens: 'Les trois guerres entre Rome et Carthage (264 – 146 av. J.-C.) pour la maîtrise de la Méditerranée occidentale.',
      },
      {
        mot: 'Numides',
        sens: 'Peuple cavalier d’Afrique du Nord, allié de Carthage puis de Rome : sa cavalerie décide Cannes, puis Zama.',
      },
    ],
    lies: ['jules-cesar', 'spartacus', 'vercingetorix'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Carthage',
      'guerres puniques',
      'éléphants',
      'Alpes',
      'Cannes',
      'Zama',
      'Scipion',
      'Barca',
      'Rome',
      'Tite-Live',
    ],
  },
  {
    id: 'spartacus',
    volet: 'personnages',
    nom: 'Spartacus',
    surnom: 'le gladiateur qui fit trembler Rome',
    dates: 'vers 109 – 71 av. J.-C.',
    tri: -71,
    periode: 'antiquite',
    emoji: '⛓️',
    roles: ['Gladiateur', 'Chef de la révolte des esclaves', 'Thrace'],
    origine: 'Thrace (actuelle Bulgarie)',
    accroche:
      'Un gladiateur évadé d’une école de Capoue lève des dizaines de milliers d’esclaves, bat les armées consulaires et tient l’Italie deux ans.',
    citations: [
      {
        texte:
          'Si je gagne, j’aurai les chevaux des Romains ; si je perds, je n’en aurai plus besoin.',
        contexte:
          'Avant la bataille finale, en tuant son propre cheval devant son armée. Rapporté par Plutarque, cent cinquante ans plus tard.',
        sens:
          'Il annonce aux siens qu’il combattra à pied, avec eux, sans possibilité de fuir : on gagne ensemble ou on meurt ensemble.',
        incertaine: true,
      },
      {
        texte:
          'Non seulement il avait un grand courage et une grande force, mais par l’intelligence et la douceur, il valait mieux que sa condition.',
        qui: 'Plutarque',
        contexte: '*Vie de Crassus*, vers 100 apr. J.-C. : le portrait que Rome garde de lui.',
      },
      {
        texte: 'L’esclave est un outil qui parle.',
        qui: 'Varron, agronome romain',
        contexte:
          '*De l’agriculture*, 37 av. J.-C. : il range les outils de la ferme en muets, mugissants et parlants.',
        sens:
          'Le droit romain compte l’esclave parmi les choses et non parmi les personnes : c’est ce statut-là que la révolte met en cause.',
      },
    ],
    reperes: [
      'Thrace, ancien auxiliaire des armées romaines, vendu comme esclave puis dressé gladiateur.',
      '73 av. J.-C. : soixante-dix gladiateurs s’évadent de Capoue avec des broches de cuisine.',
      'Sa troupe grossit jusqu’à plusieurs dizaines de milliers de personnes.',
      'Il défait des préteurs, puis les deux consuls de l’année 72 av. J.-C.',
      'Crassus l’écrase au printemps 71 av. J.-C. ; son corps n’est jamais identifié.',
      '6 000 captifs sont crucifiés le long de la via Appia, de Capoue à Rome.',
    ],
    recit: [
      {
        titre: 'Une Italie d’esclaves',
        texte:
          'Au Iᵉʳ siècle av. J.-C., les conquêtes ont rempli l’Italie de captifs : peut-être **deux millions d’esclaves** pour six millions d’habitants. Ils cultivent les grands domaines, les *latifundia*, travaillent aux mines, servent dans les maisons — et meurent dans les arènes. Le droit romain ne les compte pas parmi les personnes mais parmi les **choses** : un maître peut les vendre, les marquer au fer, les tuer. **Spartacus** est un **Thrace**, sans doute ancien auxiliaire des armées romaines, capturé, vendu, puis envoyé à l’école de gladiateurs de **Lentulus Batiatus**, à **Capoue**, où l’on apprend à tuer et à mourir en public.',
      },
      {
        titre: 'Soixante-dix hommes, des broches de cuisine',
        texte:
          'En **73 av. J.-C.**, le complot est éventé ; soixante-dix gladiateurs forcent quand même la porte, s’emparent des **broches et des couteaux des cuisines** et se réfugient sur le **Vésuve**. Rome envoie 3 000 hommes bloquer le seul sentier. Les fugitifs tressent des échelles avec des sarments de vigne, descendent la falaise à pic et prennent le camp romain à revers. La nouvelle court les campagnes : les esclaves des domaines accourent par milliers. En un an, Spartacus commande une armée organisée en légions, qui fabrique ses propres armes et bat les préteurs envoyés contre elle. En **72 av. J.-C.**, il défait les **deux consuls** de l’année. Rome, qui gouverne la Méditerranée, ne tient plus sa propre péninsule.',
      },
      {
        titre: 'La Sicile promise, la mer refusée',
        texte:
          'Les historiens anciens disent que Spartacus voulait **sortir d’Italie** : remonter vers les Alpes et rendre chacun à son pays. Son armée, grisée par les victoires, préfère piller le riche Sud. Il négocie alors avec des **pirates ciliciens** le passage vers la **Sicile**, l’île des grandes révoltes serviles ; les pirates prennent l’argent et ne viennent pas. Rome confie enfin la guerre à **Crassus**, l’homme le plus riche de la Ville, qui lève huit légions et rétablit la discipline par la *decimatio* : une cohorte en fuite est décimée, un homme sur dix tué par ses propres camarades. Crassus coupe la péninsule d’un fossé et d’un mur au niveau de la Calabre. Spartacus force le passage une nuit de neige.',
      },
      {
        titre: 'La via Appia',
        texte:
          'Au printemps **71 av. J.-C.**, la révolte se fissure : des groupes se détachent et sont détruits séparément. **Pompée** rentre d’Espagne, **Lucullus** débarque à Brindes : Spartacus est pris entre trois armées. Il livre bataille sur le **Silarus**, en Lucanie, et tombe les armes à la main — **son corps n’est jamais identifié** parmi les morts. Crassus fait crucifier **6 000 prisonniers** le long de la **via Appia**, un supplice tous les trente mètres sur les deux cents kilomètres qui séparent Capoue de Rome, et laisse les corps des mois durant. Rome n’abolira jamais l’esclavage, et aucune autre révolte servile n’ira aussi loin. Mais le nom de Spartacus traverse les siècles : du XVIIIᵉ siècle à aujourd’hui, il est le symbole de la révolte des opprimés.',
      },
    ],
    chrono: [
      { date: 'vers 109 av. J.-C.', fait: 'Naissance en Thrace.' },
      { date: '73 av. J.-C.', fait: 'Évasion de l’école de gladiateurs de Capoue.' },
      { date: '73 av. J.-C.', fait: 'Coup de main du Vésuve : première armée romaine battue.' },
      { date: '72 av. J.-C.', fait: 'Les deux consuls de l’année sont défaits.' },
      { date: '71 av. J.-C.', fait: 'Crassus barre la Calabre d’un mur ; Spartacus le franchit.' },
      { date: '71 av. J.-C.', fait: 'Défaite et mort sur le Silarus, en Lucanie.' },
      { date: '71 av. J.-C.', fait: '6 000 captifs crucifiés le long de la via Appia.' },
    ],
    leSaisTu:
      'Rome n’a jamais célébré de triomphe pour cette victoire : une guerre contre des esclaves ne comptait pas comme une vraie guerre. Crassus dut se contenter d’une simple *ovatio*, à pied et couronné de myrte, et Pompée, arrivé à la toute fin pour ramasser les fuyards, s’attribua le mérite de l’avoir « achevée ».',
    aRetenir: [
      'Spartacus est un gladiateur thrace évadé de l’école de Capoue en 73 av. J.-C.',
      'Sa révolte rassemble des dizaines de milliers d’esclaves et tient l’Italie deux ans.',
      'Il bat plusieurs armées romaines, dont celles des deux consuls, en 72 av. J.-C.',
      'Crassus l’écrase en 71 av. J.-C. et fait crucifier 6 000 captifs sur la via Appia.',
      'La révolte montre la place immense de l’esclavage dans la société romaine.',
    ],
    mots: [
      {
        mot: 'Gladiateur',
        sens: 'Combattant, le plus souvent esclave ou condamné, dressé pour se battre dans l’arène devant le public.',
      },
      {
        mot: 'Latifundium',
        sens: 'Grand domaine agricole romain exploité par une main-d’œuvre d’esclaves.',
      },
      {
        mot: 'Décimation',
        sens: 'Punition militaire romaine : une unité en faute tire au sort un homme sur dix, mis à mort par ses camarades.',
      },
    ],
    lies: ['hannibal', 'jules-cesar', 'auguste'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'gladiateur',
      'esclaves',
      'Capoue',
      'Vésuve',
      'Crassus',
      'via Appia',
      'révolte servile',
      'Thrace',
      'Rome',
      'crucifixion',
    ],
  },
  {
    id: 'jules-cesar',
    volet: 'personnages',
    nom: 'Jules César',
    surnom: 'le dictateur à vie',
    dates: '100 – 44 av. J.-C.',
    tri: -44,
    periode: 'antiquite',
    emoji: '🗡️',
    roles: ['Général romain', 'Consul', 'Dictateur', 'Écrivain'],
    origine: 'Rome, famille des Julii',
    accroche:
      'Il conquiert la Gaule, franchit le Rubicon, prend le pouvoir à lui seul — et meurt de vingt-trois coups de poignard en plein Sénat.',
    citations: [
      {
        texte: 'Veni, vidi, vici.',
        contexte:
          'Message envoyé au Sénat après avoir écrasé Pharnace à Zéla, en Asie Mineure, en 47 av. J.-C. Rapporté par Suétone.',
        sens:
          '« Je suis venu, j’ai vu, j’ai vaincu. » Trois mots de trois syllabes pour dire qu’une guerre entière a tenu en cinq jours.',
      },
      {
        texte: 'Alea jacta est.',
        contexte:
          'Au bord du Rubicon, dans la nuit du 11 au 12 janvier 49 av. J.-C., avant d’entrer en armes en Italie.',
        sens:
          '« Le sort en est jeté. » La décision est prise, on ne revient pas en arrière : franchir ce ruisseau avec une armée, c’est déclarer la guerre civile.',
      },
      {
        texte: 'Tu quoque, mi fili !',
        contexte:
          'Prêtée à César reconnaissant Brutus parmi ses assassins, le 15 mars 44 av. J.-C. Suétone écrit que la plupart des témoins le disent mort sans un mot.',
        sens: '« Toi aussi, mon fils ! » — le cri de celui que trahit son proche.',
        incertaine: true,
      },
      {
        texte: 'J’aimerais mieux être le premier dans ce village que le second à Rome.',
        contexte:
          'En traversant un misérable bourg des Alpes, à ses compagnons qui plaisantaient sur ses habitants. Rapporté par Plutarque.',
      },
    ],
    reperes: [
      'Né en 100 av. J.-C. chez les Julii, vieille famille patricienne qui se disait issue de Vénus.',
      '60 av. J.-C. : il s’accorde avec Pompée et Crassus — le premier triumvirat.',
      'Huit ans de guerre des Gaules (58 – 51 av. J.-C.), et un livre où il la raconte.',
      '12 janvier 49 av. J.-C. : il franchit le Rubicon en armes ; la guerre civile éclate.',
      'Vainqueur de Pompée à Pharsale en 48, il est fait dictateur à vie en 44 av. J.-C.',
      'Assassiné aux ides de mars 44 av. J.-C. par une soixantaine de sénateurs.',
    ],
    recit: [
      {
        titre: 'Un patricien pressé',
        texte:
          '**Caius Julius Caesar** naît en 100 av. J.-C. dans une famille noble mais désargentée, les *Julii*, qui fait remonter sa lignée à **Vénus**. Il grandit dans une république déchirée entre les partisans de **Marius**, son oncle par alliance, et ceux de **Sylla** ; à dix-neuf ans, il refuse de répudier sa femme sur ordre du dictateur et doit fuir Rome. Il fait ses classes en Orient, se bâtit une réputation d’orateur, achète les faveurs du peuple par des jeux ruineux. **Grand pontife** à trente-sept ans, **consul** à quarante. En 60 av. J.-C., il scelle avec le grand général **Pompée** et le richissime **Crassus** un accord privé — le **premier triumvirat** — qui se partage la République : à Pompée l’Orient, à Crassus l’argent, à César la **Gaule**.',
      },
      {
        titre: 'La guerre des Gaules',
        texte:
          'De **58 à 51 av. J.-C.**, César soumet un territoire trois fois grand comme l’Italie. Il bat les **Helvètes**, repousse au-delà du Rhin les Germains d’Arioviste, franchit deux fois la Manche pour une reconnaissance en **Bretagne**, jette sur le **Rhin** un pont de bois construit en dix jours pour impressionner les tribus. Il raconte tout lui-même dans *la Guerre des Gaules*, sept livres écrits à la troisième personne, d’une clarté de rapport militaire — un chef-d’œuvre de propagande que les élèves traduisent encore. Le bilan humain est terrible : Plutarque parle d’un million de morts et d’autant d’esclaves. En **52 av. J.-C.**, la révolte générale de **Vercingétorix** manque de tout emporter ; **Alésia** la brise. César sort de Gaule avec dix légions dévouées, un immense butin et une gloire que Rome redoute.',
      },
      {
        titre: 'Le Rubicon',
        texte:
          'Crassus est mort chez les Parthes en 53 av. J.-C. ; Pompée s’est rapproché du **Sénat**, qui ordonne à César de licencier son armée. Entrer en Italie avec ses légions, c’est trahir. Dans la nuit du **11 au 12 janvier 49 av. J.-C.**, César arrête son cheval devant un ruisseau de rien du tout, le **Rubicon**, limite de sa province — et le franchit. La guerre civile dure quatre ans. Pompée est écrasé à **Pharsale**, en Thessalie (48 av. J.-C.), puis assassiné en Égypte où il cherchait refuge. César poursuit ses adversaires jusqu’au **Pont**, en **Afrique**, en **Espagne**. Chaque victoire le laisse un peu plus seul au sommet.',
      },
      {
        titre: 'Le pouvoir d’un seul',
        texte:
          'Maître de Rome, César gouverne vite. Il installe **Cléopâtre** sur le trône d’Égypte, fait recenser le peuple, fonde des **colonies** de vétérans et de pauvres à Carthage et à Corinthe, ouvre le Sénat aux notables des provinces, allège les dettes, réforme les tribunaux. Surtout, il remplace le calendrier romain déréglé par le **calendrier julien**, calculé par l’astronome Sosigène d’Alexandrie : 365 jours, et un jour de plus tous les quatre ans. Nous en vivons encore, à onze minutes par an près, et le mois de **juillet** porte son nom. Mais il cumule les charges, siège sur un fauteuil doré, fait frapper son visage sur les monnaies — un honneur jamais accordé à un vivant — et, en février **44 av. J.-C.**, se fait nommer **dictateur à vie**. Pour une partie du Sénat, la République est morte.',
      },
      {
        titre: 'Les ides de mars',
        texte:
          'Le **15 mars 44 av. J.-C.**, César se rend à une séance du Sénat tenue dans la **curie de Pompée**. Une soixantaine de conjurés l’y attendent, menés par **Cassius** et **Brutus**, ce dernier fils de sa maîtresse et comblé de faveurs. Ils l’entourent sous prétexte d’une pétition et le frappent : **vingt-trois coups**, dont un seul mortel selon le médecin qui examina le corps. César tombe au pied de la statue de son vieil adversaire Pompée. Les meurtriers crient la liberté rendue ; le peuple leur répond par l’émeute et brûle le Forum pour les funérailles. La République ne renaît pas : dix-sept ans de guerres civiles plus tard, son petit-neveu et fils adoptif **Octave** sera **Auguste**, premier empereur. Le mot *Caesar* deviendra un titre — *kaiser* en allemand, *tsar* en russe.',
      },
    ],
    chrono: [
      { date: '100 av. J.-C.', fait: 'Naissance à Rome.' },
      { date: '59 av. J.-C.', fait: 'Consul ; le premier triumvirat gouverne la République.' },
      { date: '58 av. J.-C.', fait: 'Début de la conquête de la Gaule.' },
      { date: '52 av. J.-C.', fait: 'Victoire d’Alésia sur Vercingétorix.' },
      { date: '49 av. J.-C.', fait: 'Passage du Rubicon : la guerre civile commence.' },
      { date: '48 av. J.-C.', fait: 'Pharsale : Pompée battu, puis assassiné en Égypte.' },
      { date: '46 av. J.-C.', fait: 'Réforme du calendrier : l’année julienne de 365 jours.' },
      { date: '44 av. J.-C.', fait: 'Dictateur à vie en février, assassiné le 15 mars.' },
    ],
    leSaisTu:
      'Un devin nommé Spurinna l’avait averti de « prendre garde aux ides de mars ». Le matin du 15, César le croisa sur son chemin et lui lança en riant : « Les ides de mars sont venues. » Le devin répondit : « Oui, mais elles ne sont pas passées. » Une heure plus tard, César était mort.',
    aRetenir: [
      'Jules César conquiert la Gaule entre 58 et 51 av. J.-C. et la raconte dans la Guerre des Gaules.',
      'En 52 av. J.-C., il bat Vercingétorix devant Alésia.',
      'Le 12 janvier 49 av. J.-C., il franchit le Rubicon et déclenche la guerre civile.',
      'Vainqueur de Pompée à Pharsale en 48 av. J.-C., il devient dictateur à vie en 44.',
      'Il est assassiné au Sénat le 15 mars 44 av. J.-C. par Brutus, Cassius et les conjurés.',
      'Son calendrier julien et son nom, devenu un titre impérial, lui survivent.',
    ],
    mots: [
      {
        mot: 'Triumvirat',
        sens: 'Accord entre trois hommes pour se partager le pouvoir ; celui de 60 av. J.-C. n’avait aucune existence légale.',
      },
      {
        mot: 'Dictateur',
        sens: 'À Rome, magistrat aux pouvoirs absolus nommé pour six mois en cas de danger. César le devient à vie.',
      },
      {
        mot: 'Ides de mars',
        sens: 'Le 15 du mois dans le calendrier romain ; les ides tombent le 13 ou le 15 selon les mois.',
      },
    ],
    lies: ['vercingetorix', 'cleopatre', 'auguste', 'spartacus', 'hannibal'],
    niveaux: ['6e', '2de'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'César',
      'Rubicon',
      'Alésia',
      'guerre des Gaules',
      'Pompée',
      'Pharsale',
      'ides de mars',
      'Brutus',
      'dictateur',
      'calendrier julien',
      'Rome',
    ],
  },
  {
    id: 'vercingetorix',
    volet: 'personnages',
    nom: 'Vercingétorix',
    surnom: 'le chef de toute la Gaule',
    dates: 'vers 82 – 46 av. J.-C.',
    tri: -46,
    periode: 'antiquite',
    emoji: '🛡️',
    roles: ['Chef arverne', 'Chef de la révolte gauloise'],
    origine: 'Pays arverne (Auvergne)',
    accroche:
      'À trente ans, il rassemble les peuples gaulois contre César, le bat devant Gergovie — et rend les armes au pied d’Alésia.',
    citations: [
      {
        texte:
          'Je n’ai pas entrepris cette guerre pour mon intérêt, mais pour la liberté commune.',
        contexte:
          'À l’assemblée des chefs gaulois, dans Alésia assiégée et affamée, avant la reddition. Rapporté par César dans *la Guerre des Gaules*.',
        sens:
          'Il propose aux siens de le livrer vivant ou mort aux Romains pour sauver les autres : la phrase est de son pire ennemi, ce qui la rend précieuse.',
      },
      {
        texte: 'Toute la Gaule est divisée en trois parties.',
        qui: 'Jules César',
        contexte: 'Première phrase de *la Guerre des Gaules* : *Gallia est omnis divisa in partes tres.*',
        sens:
          'Belges, Aquitains, Celtes : César ouvre son livre en décrivant une Gaule morcelée — et c’est ce morcellement qui la perdra.',
      },
      {
        texte: 'Vae victis !',
        qui: 'Brennus, chef gaulois',
        contexte:
          'Prêtée au Gaulois Brennus jetant son épée dans la balance de la rançon de Rome, vers 390 av. J.-C. Rapportée par Tite-Live.',
        sens: '« Malheur aux vaincus ! » C’est le vainqueur, et lui seul, qui fixe le prix.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils de Celtillos, noble arverne ; son nom signifie « le grand roi des guerriers ».',
      'Hiver 53 – 52 av. J.-C. : il soulève les Arvernes, puis la plupart des peuples gaulois.',
      'Il impose la terre brûlée : récoltes et villages détruits pour affamer les légions.',
      'Printemps 52 av. J.-C. : il bat César devant Gergovie, sa seule défaite en Gaule.',
      'Assiégé dans Alésia derrière une double ligne romaine, il capitule en septembre 52.',
      'Prisonnier six ans, exhibé au triomphe de César en 46 av. J.-C., puis exécuté.',
    ],
    recit: [
      {
        titre: 'Une Gaule de soixante peuples',
        texte:
          'La **Gaule** n’est pas un pays : c’est une mosaïque d’une soixantaine de peuples — **Arvernes**, Éduens, Séquanes, Carnutes, Bituriges — avec leurs monnaies, leurs villes fortifiées (les *oppida*) et leurs rivalités. Beaucoup sont riches : orfèvres, forgerons, tonneliers, marchands de blé et de sel. Quand **César** entre en Gaule en 58 av. J.-C., il est d’abord appelé par des Gaulois contre d’autres Gaulois. Six ans plus tard, la conquête est presque faite, et le tribut, les réquisitions et les otages pèsent partout. **Vercingétorix**, jeune noble arverne dont le père avait rêvé de régner sur toute la Gaule, comprend le premier ce que personne n’avait voulu voir : **seule l’union peut tenir devant Rome**.',
      },
      {
        titre: 'La révolte de 52 av. J.-C.',
        texte:
          'L’hiver 53 – 52, les **Carnutes** massacrent les marchands romains de **Cenabum** (Orléans) ; le signal court de tribu en tribu. Chassé de Gergovie par les anciens, Vercingétorix lève une armée de fidèles et de pauvres, revient, prend la ville et se fait proclamer chef. En quelques semaines, presque toute la Gaule le suit — même les **Éduens**, alliés de Rome depuis toujours. Il impose une stratégie que les guerriers gaulois détestent : **ne pas livrer bataille**, harceler les convois, et brûler devant l’ennemi villages, greniers et récoltes. Vingt villes bituriges partent en flammes le même jour. Seule **Avaricum** (Bourges) est épargnée à la demande de ses habitants — César la prend et y massacre, dit-il, trente-neuf mille personnes.',
      },
      {
        titre: 'Gergovie, puis Alésia',
        texte:
          'Au printemps **52 av. J.-C.**, César attaque **Gergovie**, l’oppidum arverne perché sur son plateau. L’assaut tourne à la déroute : sept cents légionnaires et quarante-six centurions tués. C’est **la seule défaite de César en Gaule**, et elle fait basculer les derniers hésitants. Mais Vercingétorix commet alors l’erreur qu’il s’était interdite : il lance sa cavalerie contre l’armée romaine en marche, et la perd. Il se replie dans **Alésia**, sur son plateau de Bourgogne, avec quatre-vingt mille hommes. César fait construire **deux lignes de fortifications** : quinze kilomètres tournés vers la ville, vingt et un vers l’extérieur, avec tours, fossés, pieux et pièges. Quand l’armée de secours gauloise arrive — deux cent quarante mille hommes selon César, sans doute bien moins —, elle se brise sur le second rempart. Affamée, Alésia se rend.',
      },
      {
        titre: 'Le triomphe, puis le cachot',
        texte:
          'César raconte lui-même la reddition : Vercingétorix, en armes et sur son meilleur cheval, fait le tour du tribunal romain, jette ses armes aux pieds du proconsul et s’assoit sans un mot. Il est conduit à Rome et enfermé au **Tullianum**, la prison du Forum, où il attend **six ans**. En **46 av. J.-C.**, César célèbre enfin son quadruple triomphe : le chef arverne défile enchaîné devant la foule, puis est **étranglé** dans son cachot, comme le voulait l’usage. La Gaule devient romaine pour cinq siècles : elle y gagne les villes, les routes, les aqueducs, le droit et la langue dont naîtra le français. Oublié des siècles durant, Vercingétorix ressurgit au XIXᵉ siècle comme premier héros national — **Napoléon III** lui fait dresser en 1865 une statue de sept mètres sur le mont Auxois.',
      },
    ],
    chrono: [
      { date: 'vers 82 av. J.-C.', fait: 'Naissance en pays arverne.' },
      { date: '58 av. J.-C.', fait: 'César entre en Gaule.' },
      { date: 'hiver 53 – 52 av. J.-C.', fait: 'Massacre de Cenabum : la révolte éclate.' },
      { date: '52 av. J.-C.', fait: 'Proclamé chef de la coalition gauloise.' },
      { date: 'printemps 52 av. J.-C.', fait: 'Victoire de Gergovie sur César.' },
      { date: 'septembre 52 av. J.-C.', fait: 'Reddition d’Alésia.' },
      { date: '46 av. J.-C.', fait: 'Exhibé au triomphe de César, puis exécuté à Rome.' },
      { date: '1865', fait: 'Napoléon III lui élève une statue sur le mont Auxois.' },
    ],
    leSaisTu:
      'On a longtemps discuté l’emplacement d’Alésia. Les fouilles ordonnées par Napoléon III, puis les campagnes franco-allemandes de 1991-1997 à Alise-Sainte-Reine, en Côte-d’Or, ont tranché : on y a retrouvé les fossés de César, ses pièges de bois et des milliers d’objets militaires — jusqu’à des balles de fronde portant des noms gravés.',
    aRetenir: [
      'Vercingétorix, chef arverne, unit les peuples gaulois contre César en 52 av. J.-C.',
      'Il pratique la terre brûlée pour affamer les légions romaines.',
      'Il bat César devant Gergovie au printemps 52 av. J.-C.',
      'Assiégé dans Alésia derrière une double ligne de fortifications, il se rend en septembre 52.',
      'Prisonnier à Rome, il est exécuté après le triomphe de César, en 46 av. J.-C.',
    ],
    mots: [
      {
        mot: 'Oppidum',
        sens: 'Ville gauloise fortifiée, le plus souvent bâtie sur une hauteur : Gergovie et Alésia en sont.',
      },
      {
        mot: 'Terre brûlée',
        sens: 'Stratégie qui consiste à détruire récoltes et villages devant l’ennemi pour le priver de ravitaillement.',
      },
      {
        mot: 'Triomphe',
        sens: 'Défilé offert à Rome au général vainqueur ; les chefs ennemis captifs y marchent enchaînés.',
      },
    ],
    lies: ['jules-cesar', 'hannibal', 'auguste'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Arvernes',
      'Gaule',
      'Alésia',
      'Gergovie',
      'Gaulois',
      'oppidum',
      'Auvergne',
      'Cenabum',
      'César',
      'terre brûlée',
    ],
  },
  {
    id: 'cleopatre',
    volet: 'personnages',
    nom: 'Cléopâtre VII',
    surnom: 'la dernière reine d’Égypte',
    dates: '69 – 30 av. J.-C.',
    tri: -30,
    periode: 'antiquite',
    emoji: '🐍',
    roles: ['Reine d’Égypte', 'Dernière des Lagides'],
    origine: 'Alexandrie, Égypte',
    accroche:
      'Dernière souveraine de l’Égypte des pharaons, elle joue son royaume entre César et Antoine — et le perd à Actium.',
    citations: [
      {
        texte: 'Aussi vrai que je rendrai un jour la justice au Capitole.',
        contexte:
          'Le serment qu’elle répétait, selon l’historien Dion Cassius : elle se voyait régner depuis Rome même.',
        sens:
          'Son ambition n’était pas de survivre à Rome mais d’y commander — ce qu’aucune reine d’Orient n’avait osé dire tout haut.',
      },
      {
        texte:
          'Sa beauté n’était pas incomparable ; mais son commerce avait un charme irrésistible, et sa voix, quand elle parlait, était comme un instrument à plusieurs cordes.',
        qui: 'Plutarque',
        contexte: '*Vie d’Antoine*, vers 100 apr. J.-C.',
        sens:
          'Ce n’est pas son visage qui frappe les contemporains, mais son intelligence, sa culture et sa parole : elle parlait neuf langues.',
      },
      {
        texte: 'Fais-moi enterrer auprès d’Antoine.',
        contexte:
          'Dernier billet envoyé à Octave, quelques instants avant sa mort, en août 30 av. J.-C. Rapporté par Plutarque.',
      },
      {
        texte:
          'Le nez de Cléopâtre : s’il eût été plus court, toute la face de la terre aurait changé.',
        qui: 'Blaise Pascal',
        contexte: '*Pensées*, publiées en 1670.',
        sens:
          'Pascal choisit Cléopâtre pour dire qu’un détail minuscule peut faire basculer l’histoire du monde entier.',
      },
    ],
    reperes: [
      'Descendante d’un général d’Alexandre, elle règne sur l’Égypte grecque des Lagides.',
      'Elle parle neuf langues et est la première de sa dynastie à parler l’égyptien.',
      '48 av. J.-C. : elle se fait porter jusqu’à César, qui la rétablit sur le trône.',
      'Compagne de Marc Antoine, elle lui donne trois enfants ; Rome y voit une trahison.',
      '2 septembre 31 av. J.-C. : la flotte d’Actium est détruite par Octave.',
      'Août 30 av. J.-C. : elle se donne la mort ; l’Égypte devient province romaine.',
    ],
    recit: [
      {
        titre: 'Une Grecque sur le trône des pharaons',
        texte:
          'Depuis la mort d’**Alexandre le Grand**, l’Égypte est gouvernée par la famille grecque des **Lagides**, descendants de son général Ptolémée. Trois siècles plus tard, **Cléopâtre VII** monte sur le trône à dix-huit ans, en 51 av. J.-C., aux côtés d’un frère de dix ans qu’elle doit épouser selon la coutume. **Alexandrie** est alors la plus grande ville du monde méditerranéen : son **phare**, sa **bibliothèque**, ses savants, son port d’où part le blé qui nourrit Rome. Cléopâtre est une souveraine lettrée — Plutarque lui prête l’égyptien, l’éthiopien, l’hébreu, l’araméen, le mède et le parthe — et la **première Lagide** à s’adresser à ses sujets dans leur propre langue. Chassée du palais par le clan de son frère, elle lève une armée et attend son heure.',
      },
      {
        titre: 'César, et le tapis',
        texte:
          'En **48 av. J.-C.**, **Pompée** vaincu se réfugie en Égypte ; les conseillers du jeune roi le font assassiner pour plaire au vainqueur. **César** débarque à Alexandrie et se voit offrir la tête de son adversaire — il pleure, dit-on. Cléopâtre, exilée, se fait alors introduire au palais **roulée dans un sac de literie** que l’on dépose devant lui : la scène, racontée par Plutarque, est devenue le tapis de la légende. Elle a vingt et un ans, César cinquante-deux. Il la rétablit sur le trône au terme d’une guerre de rues où brûle une partie des entrepôts du port, et elle lui donne un fils, **Césarion**. En 46 av. J.-C., elle s’installe à Rome, dans une villa du Janicule — jusqu’aux **ides de mars**, qui la renvoient en Égypte.',
      },
      {
        titre: 'Antoine, Actium',
        texte:
          'Le monde romain se partage entre **Octave**, héritier de César, et **Marc Antoine**, son lieutenant. Antoine convoque Cléopâtre à Tarse en 41 av. J.-C. ; elle arrive sur un navire à la poupe dorée et aux voiles de pourpre. Ils ne se quitteront plus : trois enfants, une cour fastueuse à Alexandrie, et en 34 av. J.-C. les **donations d’Alexandrie**, où Antoine distribue des territoires romains aux enfants de la reine. **Octave** y trouve sa propagande : Antoine, ensorcelé par une souveraine orientale, voudrait livrer Rome à une reine. Il déclare la guerre — à l’Égypte, jamais à un Romain. Le **2 septembre 31 av. J.-C.**, devant **Actium**, la flotte d’**Agrippa** enferme celle d’Antoine ; Cléopâtre force le passage avec ses soixante navires, Antoine la suit, et l’armée abandonnée se rend sans combattre.',
      },
      {
        titre: 'L’aspic, et la fin d’un monde',
        texte:
          'Octave débarque en Égypte l’été suivant. **Antoine se jette sur son épée** sur une fausse nouvelle de la mort de la reine et meurt dans ses bras. Cléopâtre est capturée vivante : Octave veut l’exhiber à son triomphe. Elle obtient de se rendre au tombeau d’Antoine, revient, se fait servir un panier de figues — et on la retrouve morte, parée en reine, avec ses deux suivantes. La tradition parle d’un **aspic** caché sous les fruits ; les historiens penchent pour un poison préparé d’avance. Elle avait trente-neuf ans. **Césarion** est mis à mort, l’Égypte devient une **province romaine** rattachée à l’empereur en personne, et le blé du Nil nourrit Rome trois siècles durant. Avec elle s’achèvent trois mille ans de royauté égyptienne et le dernier des royaumes nés du partage de l’empire d’Alexandre.',
      },
    ],
    chrono: [
      { date: '69 av. J.-C.', fait: 'Naissance à Alexandrie.' },
      { date: '51 av. J.-C.', fait: 'Elle règne avec son frère Ptolémée XIII.' },
      { date: '48 av. J.-C.', fait: 'Rencontre de César, qui la rétablit sur le trône.' },
      { date: '47 av. J.-C.', fait: 'Naissance de Césarion.' },
      { date: '41 av. J.-C.', fait: 'Rencontre de Marc Antoine à Tarse.' },
      { date: '34 av. J.-C.', fait: 'Donations d’Alexandrie : Rome crie à la trahison.' },
      { date: '31 av. J.-C.', fait: 'Défaite navale d’Actium, le 2 septembre.' },
      { date: '30 av. J.-C.', fait: 'Mort d’Antoine, puis de Cléopâtre ; l’Égypte devient romaine.' },
    ],
    leSaisTu:
      'Cléopâtre est plus proche de nous que des bâtisseurs de la grande pyramide de Khéops : deux mille cinq cents ans la séparent d’eux, deux mille à peine nous séparent d’elle. Et elle n’était pas égyptienne par le sang, mais macédonienne — comme Alexandre.',
    aRetenir: [
      'Cléopâtre VII est la dernière reine de l’Égypte des Lagides, dynastie grecque.',
      'Alliée puis compagne de César, elle lui donne un fils, Césarion, en 47 av. J.-C.',
      'Avec Marc Antoine, elle est battue par Octave à Actium le 2 septembre 31 av. J.-C.',
      'Elle se donne la mort en 30 av. J.-C. ; l’Égypte devient une province romaine.',
      'Sa fin est celle des royaumes hellénistiques nés du partage de l’empire d’Alexandre.',
    ],
    mots: [
      {
        mot: 'Lagides',
        sens: 'Dynastie grecque fondée par Ptolémée, général d’Alexandre, qui règne sur l’Égypte de 305 à 30 av. J.-C.',
      },
      {
        mot: 'Hellénistique',
        sens: 'Se dit des royaumes et de la culture grecque d’Orient nés du partage de l’empire d’Alexandre.',
      },
    ],
    lies: ['jules-cesar', 'auguste', 'hannibal'],
    niveaux: ['6e'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Cléopâtre',
      'Égypte',
      'Alexandrie',
      'Lagides',
      'Marc Antoine',
      'Actium',
      'César',
      'Octave',
      'Césarion',
      'pharaon',
    ],
  },
  {
    id: 'auguste',
    volet: 'personnages',
    nom: 'Auguste',
    surnom: 'le premier empereur',
    dates: '63 av. J.-C. – 14 apr. J.-C.',
    tri: 14,
    periode: 'antiquite',
    emoji: '🌿',
    roles: ['Empereur romain', 'Fils adoptif de César', 'Fondateur du principat'],
    origine: 'Rome, famille des Octavii',
    accroche:
      'Il venge César, élimine Antoine et donne à Rome deux siècles de paix — en gardant les mots de la République et tout le pouvoir.',
    citations: [
      {
        texte: 'J’ai trouvé une Rome de briques, je laisse une Rome de marbre.',
        contexte: 'Rapporté par Suétone, *Vie d’Auguste* : le bilan qu’il donnait lui-même de son règne.',
        sens:
          'Il a fait rebâtir la Ville en pierre — forums, temples, théâtres, aqueducs — et y a laissé sa marque pour des siècles.',
      },
      {
        texte: 'Festina lente.',
        contexte: 'Sa devise favorite, qu’il répétait à ses généraux. Rapportée par Suétone.',
        sens: '« Hâte-toi lentement » : agis vite, mais ne précipite rien — tout Auguste est dans ces deux mots.',
      },
      {
        texte: 'Varus, rends-moi mes légions !',
        contexte:
          'Après le désastre de Teutobourg, où trois légions sont anéanties en Germanie, en 9 apr. J.-C. Rapporté par Suétone.',
        sens:
          'En latin *Quintili Vare, legiones redde !* Il erra des mois dans le palais en se cognant la tête contre les portes ; Rome renonça à la Germanie.',
      },
      {
        texte: 'Ai-je bien joué mon rôle dans la comédie de la vie ? Alors applaudissez.',
        contexte: 'Ses derniers mots à ses amis, à Nola, le 19 août 14 apr. J.-C. Rapporté par Suétone.',
      },
    ],
    reperes: [
      'Caius Octavius, petit-neveu de César, devient son fils adoptif par testament en 44 av. J.-C.',
      'À dix-neuf ans, il lève une armée sur sa fortune et se fait élire consul à vingt.',
      'Second triumvirat avec Antoine et Lépide : les proscriptions de 43 av. J.-C.',
      'Vainqueur d’Actium en 31 av. J.-C., il reste seul maître du monde romain.',
      '27 av. J.-C. : le Sénat lui donne le nom d’Auguste ; le principat commence.',
      'Quarante et un ans de règne, puis deux siècles de paix romaine.',
    ],
    recit: [
      {
        titre: 'Un héritier de dix-neuf ans',
        texte:
          'Quand **César** est assassiné en 44 av. J.-C., son testament révèle qu’il a adopté et fait son héritier un petit-neveu de dix-neuf ans, **Caius Octavius**, alors étudiant en Illyrie. Personne ne le prend au sérieux — Antoine l’appelle « le gamin ». Il rentre à Rome, prend le nom de César, lève une armée avec sa fortune personnelle, se fait confier par le Sénat le commandement contre Antoine, puis retourne ses légions contre le Sénat et exige le **consulat** à vingt ans. La leçon est déjà là : il n’a ni le génie militaire de son père adoptif ni son éloquence, mais il a **la patience, l’argent et le sens du moment**.',
      },
      {
        titre: 'Le dernier des triumvirs',
        texte:
          'En 43 av. J.-C., Octave, **Antoine** et **Lépide** se partagent légalement l’État : c’est le **second triumvirat**. Ils ouvrent les **proscriptions** — des listes affichées au Forum, une prime pour chaque tête. Trois cents sénateurs et deux mille chevaliers y périssent, dont **Cicéron**, dont on cloue la tête et les mains à la tribune. Les meurtriers de César, **Brutus** et **Cassius**, sont écrasés à **Philippes** en 42 av. J.-C. Puis les vainqueurs se partagent le monde : l’Orient à Antoine, l’Occident à Octave. Dix ans de rivalité, de propagande et de mariages politiques plus tard, **Actium** (31 av. J.-C.) tranche. En 30 av. J.-C., Antoine et **Cléopâtre** morts, Octave a trente-trois ans et plus un seul rival vivant.',
      },
      {
        titre: '27 av. J.-C. : la République sauvée, l’Empire fondé',
        texte:
          'Rome a horreur du mot *rex*, roi : César est mort de l’avoir fait oublier. Octave invente autre chose. Le **13 janvier 27 av. J.-C.**, il se présente au Sénat et **rend solennellement tous ses pouvoirs**. Le Sénat, soulagé et dépendant, le supplie de rester, lui confie les provinces frontières — donc les légions — et lui décerne le nom religieux d’**Auguste**, « celui qui est consacré ». Il se contentera du titre de *princeps*, « le premier » des citoyens, d’où vient le mot **principat**. Consuls, tribuns, préteurs, assemblées : tout continue. Sauf qu’il cumule à vie la puissance tribunicienne, l’*imperium* sur les armées et le grand pontificat, et qu’en pratique il désigne les magistrats. **Les mots de la République, la réalité de la monarchie** : le montage tiendra trois siècles.',
      },
      {
        titre: 'La paix romaine',
        texte:
          'Le règne dure **quarante et un ans**, et ce qu’il bâtit dure bien plus. Auguste réorganise les provinces, crée un **impôt régulier** et un trésor militaire, une armée permanente de vingt-huit légions, une police et des pompiers pour Rome, une poste impériale, un **recensement** général. Il fait restaurer quatre-vingt-deux temples, ouvre le **forum d’Auguste**, dresse l’*Ara Pacis*, l’autel de la Paix. Il ferme trois fois les portes du temple de **Janus**, que l’on ne ferme qu’en temps de paix totale — on ne l’avait fait que deux fois en sept siècles. Cette **paix romaine** (*pax romana*), qui durera jusqu’au IIᵉ siècle, fait circuler d’un bout à l’autre de la Méditerranée les marchandises, les soldats, les idées — et bientôt les premiers chrétiens. **Virgile**, **Horace** et **Tite-Live** écrivent sous son patronage.',
      },
      {
        titre: 'Teutobourg et la succession',
        texte:
          'Tout ne réussit pas. Sa loi sur les mœurs, qui punit l’adultère et récompense les familles nombreuses, le force à exiler sa propre fille **Julie**. En **9 apr. J.-C.**, dans la forêt de **Teutobourg**, le chef chérusque **Arminius** anéantit trois légions commandées par **Varus** : Rome renonce définitivement à la Germanie et s’arrête au Rhin. Surtout, Auguste enterre ses héritiers l’un après l’autre — son neveu Marcellus, son ami et amiral **Agrippa**, ses deux petits-fils — et doit se rabattre sur son beau-fils **Tibère**. Il meurt à **Nola** le **19 août 14 apr. J.-C.**, à soixante-seize ans ; le Sénat le déclare dieu. Son nom devient un titre porté par tous ses successeurs, et le mois de *sextilis* devient le mois d’**août**.',
      },
    ],
    chrono: [
      { date: '63 av. J.-C.', fait: 'Naissance à Rome.' },
      { date: '44 av. J.-C.', fait: 'Le testament de César fait de lui son fils adoptif.' },
      { date: '43 av. J.-C.', fait: 'Second triumvirat et proscriptions ; mort de Cicéron.' },
      { date: '42 av. J.-C.', fait: 'Philippes : Brutus et Cassius sont vaincus.' },
      { date: '31 av. J.-C.', fait: 'Victoire d’Actium sur Antoine et Cléopâtre.' },
      { date: '27 av. J.-C.', fait: 'Le Sénat lui décerne le nom d’Auguste : le principat naît.' },
      { date: '9 av. J.-C.', fait: 'Consécration de l’Ara Pacis, l’autel de la Paix.' },
      { date: '9 apr. J.-C.', fait: 'Teutobourg : trois légions perdues en Germanie.' },
      { date: '14 apr. J.-C.', fait: 'Mort à Nola ; Tibère lui succède.' },
    ],
    leSaisTu:
      'Auguste a rédigé lui-même le bilan de son règne, les *Res gestae*, et ordonné qu’on le grave sur des plaques de bronze devant son tombeau. Les plaques ont fondu depuis longtemps, mais une copie gravée sur les murs d’un temple d’Ankara, en Turquie, a survécu : c’est le seul bilan d’empereur écrit de sa propre main.',
    aRetenir: [
      'Auguste, petit-neveu et fils adoptif de César, gouverne de 27 av. J.-C. à 14 apr. J.-C.',
      'Il élimine ses rivaux à Philippes en 42, puis à Actium en 31 av. J.-C.',
      'En 27 av. J.-C., il fonde le principat : les institutions républicaines, le pouvoir d’un seul.',
      'Son règne ouvre la paix romaine, deux siècles de stabilité dans tout l’Empire.',
      'Jésus de Nazareth naît sous son règne ; le mois d’août porte son nom.',
    ],
    mots: [
      {
        mot: 'Principat',
        sens: 'Régime fondé par Auguste : l’empereur est « le premier citoyen » et les institutions de la République sont maintenues.',
      },
      {
        mot: 'Pax romana',
        sens: 'La paix romaine : la longue période de stabilité de l’Empire, du Iᵉʳ au IIᵉ siècle apr. J.-C.',
      },
      {
        mot: 'Proscription',
        sens: 'Liste d’ennemis politiques affichée en public : les tuer devient légal et rapporte une prime.',
      },
    ],
    lies: ['jules-cesar', 'cleopatre', 'jesus-de-nazareth', 'constantin'],
    niveaux: ['6e', '2de'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Auguste',
      'Octave',
      'empereur',
      'principat',
      'paix romaine',
      'Actium',
      'Antoine',
      'Teutobourg',
      'Ara Pacis',
      'Rome',
    ],
  },
  {
    id: 'jesus-de-nazareth',
    volet: 'personnages',
    nom: 'Jésus de Nazareth',
    surnom: 'celui que les chrétiens appellent le Christ',
    dates: 'vers 6 av. J.-C. – vers 30 apr. J.-C.',
    tri: 30,
    periode: 'antiquite',
    emoji: '🕊️',
    roles: ['Prédicateur juif de Galilée', 'Figure fondatrice du christianisme'],
    origine: 'Nazareth, Galilée',
    accroche:
      'Un prédicateur juif de Galilée, crucifié à Jérusalem vers l’an 30, dont le message a donné naissance à la première religion du monde.',
    citations: [
      {
        texte: 'Aimez-vous les uns les autres comme je vous ai aimés.',
        contexte:
          'Au dernier repas pris avec ses disciples, la veille de sa mort. Évangile de Jean, chapitre 13.',
        sens:
          'Le « commandement nouveau » que les Évangiles placent au cœur de son enseignement, et que le christianisme a fait sien.',
      },
      {
        texte: 'Rendez à César ce qui est à César, et à Dieu ce qui est à Dieu.',
        contexte:
          'Réponse à ceux qui lui demandaient s’il fallait payer l’impôt à Rome, en lui montrant une pièce à l’effigie de l’empereur. Évangile de Matthieu, 22.',
        sens:
          'Il distingue ce qui relève du pouvoir politique et ce qui relève de Dieu : une phrase qui pèsera vingt siècles sur les rapports entre les États et les religions.',
      },
      {
        texte: 'Heureux les pauvres de cœur, car le royaume des Cieux est à eux.',
        contexte: 'Première des Béatitudes, au Sermon sur la montagne. Évangile de Matthieu, 5.',
      },
      {
        texte: 'Père, pardonne-leur : ils ne savent pas ce qu’ils font.',
        contexte: 'Sur la croix, selon l’Évangile de Luc, 23.',
      },
    ],
    reperes: [
      'Juif de Galilée, né sous le règne d’Auguste, dans une Judée occupée par Rome.',
      'Artisan à Nazareth, il commence à prêcher vers trente ans, après son baptême par Jean.',
      'Il enseigne en paraboles et rassemble douze compagnons, les apôtres.',
      'Arrêté à Jérusalem, il est crucifié sous le préfet romain Ponce Pilate, vers l’an 30.',
      'Ses disciples annoncent sa résurrection : c’est le fondement de la foi chrétienne.',
      'Son existence est attestée par Tacite et Flavius Josèphe, historiens non chrétiens.',
    ],
    recit: [
      {
        titre: 'La Judée sous Rome',
        texte:
          'Au début du Iᵉʳ siècle, la **Judée** est une petite province de l’Empire, gouvernée par un roi client puis par des **préfets** romains. Les Juifs y vivent une religion sans équivalent dans le monde antique : **un seul Dieu**, une Loi, un Temple unique à **Jérusalem**. L’occupation, l’impôt et la présence d’images impériales y nourrissent une attente intense : beaucoup espèrent la venue d’un **Messie**, un envoyé de Dieu qui rétablira Israël. Les courants se multiplient — pharisiens, sadducéens, esséniens, zélotes — et les soulèvements sont durement réprimés. C’est dans ce monde-là que paraît, vers l’an 28, un prédicateur venu de **Galilée**, la région rurale du Nord.',
      },
      {
        titre: 'Ce que rapportent les Évangiles',
        texte:
          'Quatre récits écrits entre 65 et 100 apr. J.-C. — les **Évangiles** de Marc, Matthieu, Luc et Jean — racontent sa vie. Jésus naît à **Bethléem** sous le règne d’**Auguste** et grandit à **Nazareth**, dans une famille d’artisans. Vers trente ans, il reçoit le baptême de **Jean-Baptiste** dans le Jourdain, puis parcourt la Galilée en enseignant. Il parle en **paraboles** — le bon Samaritain, le fils prodigue, la brebis perdue —, de courtes histoires tirées de la vie paysanne. Les Évangiles lui attribuent des **guérisons** et lui donnent douze compagnons, les **apôtres**. Son message tient en deux commandements : aimer Dieu, et aimer son prochain comme soi-même. Il s’adresse d’abord aux **pauvres, aux malades et aux exclus** — publicains, lépreux, étrangers, femmes —, ce qui heurte une part des autorités religieuses.',
      },
      {
        titre: 'Jérusalem, la Pâque, la croix',
        texte:
          'Vers l’an 30, Jésus monte à **Jérusalem** pour la fête de la **Pâque**, quand la ville est pleine de pèlerins et la garnison romaine sur les nerfs. Il y est accueilli par une foule, puis chasse les marchands du **Temple**. Le geste, dans une ville sous tension, est un danger public. Arrêté de nuit au **jardin de Gethsémani** après avoir été livré par l’un des Douze, **Judas**, il est interrogé par les autorités du Temple, puis remis au préfet romain **Ponce Pilate** — seul habilité à prononcer une condamnation à mort. Il est **crucifié** hors des murs, au Golgotha, supplice réservé aux esclaves et aux rebelles, avec l’écriteau « roi des Juifs ». Il avait une trentaine d’années.',
      },
      {
        titre: 'Ce que l’histoire établit',
        texte:
          'Jésus n’a rien écrit, et aucun texte contemporain de sa vie ne le mentionne. Mais deux historiens **non chrétiens** attestent son existence dès le Iᵉʳ siècle. Le Juif **Flavius Josèphe**, vers 93, cite « Jésus, appelé le Christ » à propos de l’exécution de son frère Jacques. Le Romain **Tacite**, vers 116, écrit que les chrétiens tirent leur nom du « Christ, supplicié sous le règne de Tibère par le procurateur Ponce Pilate ». **Suétone** et **Pline le Jeune** évoquent eux aussi les chrétiens au début du IIᵉ siècle. Les historiens tiennent donc pour établis un homme nommé Jésus, prédicateur en Galilée, crucifié à Jérusalem sous Pilate. Ce qui relève de la **foi** — la résurrection annoncée par ses disciples — n’est pas du domaine de l’histoire, qui constate seulement que ses disciples l’ont proclamée et sont morts pour elle.',
      },
      {
        titre: 'Une religion née dans l’Empire',
        texte:
          'Après sa mort, ses disciples annoncent qu’il est **ressuscité** et qu’il est le Messie attendu — *Christos* en grec, d’où **Christ** et **chrétiens**. Le message sort vite du judaïsme : **Paul de Tarse** le porte aux non-Juifs à travers l’Asie Mineure et la Grèce, en suivant les routes et la langue commune que la **paix romaine** a rendues sûres. Longtemps minoritaires, parfois persécutés, les chrétiens obtiennent la liberté de culte avec **Constantin** en **313**, et le christianisme devient la religion officielle de l’Empire en **380**. Notre calendrier compte encore les années depuis la date que le moine Denys le Petit calcula, au VIᵉ siècle, pour sa naissance — avec, on le sait aujourd’hui, quelques années d’écart.',
      },
    ],
    chrono: [
      { date: 'vers 6 av. J.-C.', fait: 'Naissance, sous le règne d’Auguste.' },
      { date: 'vers 28', fait: 'Baptême par Jean-Baptiste dans le Jourdain.' },
      { date: 'vers 28 – 30', fait: 'Prédication en Galilée, puis en Judée.' },
      { date: 'vers 30', fait: 'Crucifixion à Jérusalem sous le préfet Ponce Pilate.' },
      { date: 'vers 34', fait: 'Conversion de Paul de Tarse sur la route de Damas.' },
      { date: '65 – 100', fait: 'Rédaction des quatre Évangiles.' },
      { date: 'vers 93', fait: 'Flavius Josèphe mentionne « Jésus, appelé le Christ ».' },
      { date: '313', fait: 'Édit de Milan : liberté de culte pour les chrétiens.' },
    ],
    leSaisTu:
      'Notre façon de compter les années vient d’un moine, Denys le Petit, chargé en 525 de calculer la date de Pâques : il décida de dater le temps à partir de la naissance de Jésus. Il se trompa de quatre à six ans — d’après les Évangiles, Jésus naît sous Hérode le Grand, mort en 4 av. J.-C. Jésus est donc né « avant Jésus-Christ ».',
    aRetenir: [
      'Jésus de Nazareth est un Juif de Galilée qui prêche vers 28 – 30, sous l’empereur Tibère.',
      'Les Évangiles, écrits entre 65 et 100, rapportent son enseignement et sa mort.',
      'Il est crucifié à Jérusalem sous le préfet romain Ponce Pilate, vers l’an 30.',
      'Tacite et Flavius Josèphe, non chrétiens, attestent son existence dès le Iᵉʳ siècle.',
      'Ses disciples annoncent sa résurrection : c’est l’acte de naissance du christianisme.',
    ],
    mots: [
      {
        mot: 'Évangile',
        sens: 'Du grec « bonne nouvelle » : l’un des quatre récits de la vie et de l’enseignement de Jésus.',
      },
      {
        mot: 'Messie',
        sens: 'En hébreu « celui qui a reçu l’onction » : l’envoyé de Dieu attendu par le judaïsme. Christos en grec.',
      },
      {
        mot: 'Parabole',
        sens: 'Court récit imagé qui enseigne une vérité ; la forme préférée de la prédication de Jésus.',
      },
      {
        mot: 'Apôtre',
        sens: 'Du grec « envoyé » : l’un des douze compagnons chargés d’annoncer son message.',
      },
    ],
    lies: ['saint-paul', 'auguste', 'constantin'],
    niveaux: ['6e', '2de'],
    programme: 'Des chrétiens dans l’Empire',
    tags: [
      'Jésus',
      'Christ',
      'Nazareth',
      'Galilée',
      'Évangiles',
      'Ponce Pilate',
      'christianisme',
      'Jérusalem',
      'crucifixion',
      'Judée',
      'Tacite',
    ],
  },
  {
    id: 'saint-paul',
    volet: 'personnages',
    nom: 'Saint Paul',
    surnom: 'l’apôtre des nations',
    dates: 'vers 5 – vers 67',
    tri: 67,
    periode: 'antiquite',
    emoji: '✉️',
    roles: ['Apôtre', 'Missionnaire', 'Citoyen romain'],
    origine: 'Tarse, Cilicie (actuelle Turquie)',
    accroche:
      'Persécuteur des chrétiens devenu leur plus grand missionnaire, il fait du christianisme une religion ouverte à tous les peuples.',
    citations: [
      {
        texte:
          'Il n’y a plus ni Juif ni Grec, ni esclave ni homme libre, ni homme ni femme : car tous, vous n’êtes qu’un dans le Christ Jésus.',
        contexte: 'Lettre aux Galates, chapitre 3, verset 28, écrite vers 55.',
        sens:
          'C’est la phrase qui ouvre le christianisme au monde entier : il cesse d’être réservé à un peuple, à une condition ou à un sexe.',
      },
      {
        texte:
          'Quand je parlerais les langues des hommes et des anges, si je n’ai pas la charité, je ne suis qu’un airain qui sonne.',
        contexte:
          'Première lettre aux Corinthiens, 13, vers 54 — l’« hymne à la charité », lu dans presque tous les mariages chrétiens.',
        sens:
          'Sans l’amour des autres, ni l’éloquence, ni le savoir, ni même le sacrifice ne valent quoi que ce soit.',
      },
      {
        texte: 'Civis romanus sum.',
        contexte:
          'La formule du droit romain qu’il oppose au tribun qui allait le faire fouetter à Jérusalem : elle lui vaut d’être jugé à Rome. Actes des Apôtres, 22.',
        sens: '« Je suis citoyen romain. » Un citoyen ne pouvait être ni fouetté sans jugement, ni crucifié.',
      },
      {
        texte: 'J’ai combattu le bon combat, j’ai achevé la course, j’ai gardé la foi.',
        contexte:
          'Deuxième lettre à Timothée, 4 — écrite, selon la tradition, peu avant sa mort à Rome.',
      },
    ],
    reperes: [
      'Juif de Tarse, pharisien, artisan du tissu, et citoyen romain de naissance.',
      'Il persécute les premiers chrétiens et assiste à la lapidation d’Étienne.',
      'Vers 34, sur la route de Damas, il se convertit et prend le nom de Paul.',
      'Trois voyages missionnaires : Asie Mineure, Macédoine, Grèce, plus de 15 000 km.',
      'Vers 49, il obtient que les non-Juifs entrent dans l’Église sans adopter la Loi juive.',
      'Quatorze lettres lui sont attribuées ; il meurt décapité à Rome vers 67.',
    ],
    recit: [
      {
        titre: 'Saul de Tarse, persécuteur',
        texte:
          '**Saul** naît vers l’an 5 à **Tarse**, grande ville de Cilicie, dans une famille juive qui possède la **citoyenneté romaine** — un privilège rare, qui protège du fouet et donne le droit d’en appeler à l’empereur. Il est formé à Jérusalem chez **Gamaliel**, maître **pharisien** réputé, apprend la Loi, et gagne sa vie comme artisan du tissu. Quand apparaît le groupe des disciples de Jésus, il y voit une menace pour le judaïsme et le combat : les **Actes des Apôtres** le montrent gardant les vêtements de ceux qui lapident **Étienne**, le premier martyr chrétien, puis obtenant des lettres pour aller arrêter les disciples jusqu’à **Damas**.',
      },
      {
        titre: 'Le chemin de Damas',
        texte:
          'C’est sur cette route, vers l’an 34, que tout bascule. Les Actes racontent une lumière qui le jette à terre et une voix : « Saul, Saul, pourquoi me persécutes-tu ? » Il reste **trois jours aveugle**, puis reçoit le baptême et se met à prêcher ce qu’il voulait détruire. L’expression « **chemin de Damas** » désigne depuis un retournement complet. Il prend le nom romain de **Paul**, passe plusieurs années à l’écart, puis commence à parcourir l’Empire. Il ne se dit pas successeur des Douze, qui ont connu Jésus, mais **apôtre appelé à part** — et sa liberté de ton lui vaudra des affrontements jusqu’avec **Pierre**.',
      },
      {
        titre: 'Trois voyages, un monde ouvert',
        texte:
          'Entre 45 et 58, Paul accomplit **trois grands voyages** : Chypre, l’Asie Mineure, la Macédoine, la Grèce — **Philippes, Thessalonique, Athènes, Corinthe, Éphèse** —, plus de quinze mille kilomètres par les routes et les navires que la **paix romaine** a rendus sûrs. Partout il prêche d’abord à la synagogue, puis aux **païens**. La question décisive se joue à Jérusalem vers l’an 49 : faut-il devenir juif — circoncision, interdits alimentaires — pour devenir chrétien ? Paul dit non, et l’assemblée lui donne raison. **Ce jour-là, le christianisme cesse d’être un courant du judaïsme pour devenir une religion universelle.** À Athènes, devant l’Aréopage, il discute avec des philosophes stoïciens et épicuriens : la rencontre du message chrétien et de la pensée grecque commence là.',
      },
      {
        titre: 'Les lettres, et Rome',
        texte:
          'Paul écrit à ses communautés pour les encourager, les corriger, trancher leurs disputes. **Quatorze lettres** (les *épîtres*) lui sont attribuées dans le Nouveau Testament, dont sept sont tenues pour certaines par les historiens — Romains, Corinthiens, Galates, Philippiens, Thessaloniciens, Philémon. Ce sont les **plus anciens textes chrétiens conservés**, antérieurs de vingt ans aux Évangiles. Arrêté à Jérusalem vers 58 et sur le point d’être fouetté, il oppose sa citoyenneté romaine et fait **appel à l’empereur** : on l’envoie à Rome, après un naufrage à Malte. Il y vit deux ans en résidence surveillée. La tradition le fait mourir **décapité** — le supplice des citoyens romains — vers 67, sous **Néron**, hors des murs de la ville. Sans lui, le christianisme serait peut-être resté une branche du judaïsme ; avec lui, il devient la religion de l’Empire.',
      },
    ],
    chrono: [
      { date: 'vers 5', fait: 'Naissance à Tarse, en Cilicie.' },
      { date: 'vers 34', fait: 'Conversion sur la route de Damas.' },
      { date: '45 – 49', fait: 'Premier voyage : Chypre et l’Asie Mineure.' },
      { date: 'vers 49', fait: 'Assemblée de Jérusalem : les païens entrent sans la Loi juive.' },
      { date: '50 – 52', fait: 'Deuxième voyage : Philippes, Thessalonique, Athènes, Corinthe.' },
      { date: 'vers 54', fait: 'Première lettre aux Corinthiens, écrite d’Éphèse.' },
      { date: 'vers 58', fait: 'Arrêté à Jérusalem, il fait appel à l’empereur.' },
      { date: 'vers 67', fait: 'Décapité à Rome, sous Néron.' },
    ],
    leSaisTu:
      'Les lettres de Paul sont dictées : il parle, un secrétaire écrit. À la fin de celle aux Galates, il prend lui-même le calame et ajoute : « Voyez quelles grosses lettres je vous écris de ma propre main. » C’est, à deux mille ans de distance, la trace d’un geste — et peut-être d’une mauvaise vue.',
    aRetenir: [
      'Paul de Tarse, juif pharisien et citoyen romain, persécute d’abord les chrétiens.',
      'Converti vers 34 sur la route de Damas, il devient le missionnaire du christianisme.',
      'Ses trois voyages portent la foi nouvelle en Asie Mineure, en Macédoine et en Grèce.',
      'Vers 49, il obtient que les non-Juifs deviennent chrétiens sans adopter la Loi juive.',
      'Ses lettres sont les plus anciens textes chrétiens conservés ; il meurt à Rome vers 67.',
    ],
    mots: [
      {
        mot: 'Épître',
        sens: 'Lettre adressée par un apôtre à une communauté chrétienne ; celles de Paul forment un tiers du Nouveau Testament.',
      },
      {
        mot: 'Païen',
        sens: 'Pour les premiers chrétiens, celui qui n’est ni juif ni chrétien et honore les dieux traditionnels.',
      },
      {
        mot: 'Pharisien',
        sens: 'Membre d’un courant du judaïsme attaché à l’étude et à l’application stricte de la Loi.',
      },
    ],
    lies: ['jesus-de-nazareth', 'auguste', 'constantin'],
    niveaux: ['6e', '2de'],
    programme: 'Des chrétiens dans l’Empire',
    tags: [
      'Paul',
      'Saul de Tarse',
      'Damas',
      'apôtre',
      'épîtres',
      'Corinthiens',
      'Galates',
      'christianisme',
      'Néron',
      'Rome',
    ],
  },
  {
    id: 'constantin',
    volet: 'personnages',
    nom: 'Constantin',
    surnom: 'le premier empereur chrétien',
    dates: 'vers 272 – 337',
    tri: 337,
    periode: 'antiquite',
    emoji: '✝️',
    roles: ['Empereur romain', 'Fondateur de Constantinople'],
    origine: 'Naissus, Mésie (actuelle Serbie)',
    accroche:
      'Il donne aux chrétiens la liberté de culte, réunit le premier concile et fonde sur le Bosphore une ville qui portera son nom mille ans.',
    citations: [
      {
        texte: 'In hoc signo vinces.',
        contexte:
          'La phrase que ses biographes Lactance et Eusèbe disent vue dans le ciel avant la bataille du pont Milvius, le 28 octobre 312.',
        sens:
          '« Par ce signe, tu vaincras. » Le signe est le chrisme, monogramme du Christ, qu’il fait peindre sur les boucliers de ses soldats.',
        incertaine: true,
      },
      {
        texte:
          'Nous avons décidé d’accorder aux chrétiens comme à tous la liberté de suivre la religion de leur choix.',
        contexte: 'L’accord conclu à Milan en 313 entre Constantin et Licinius, rapporté par Lactance.',
        sens:
          'Ce n’est pas la victoire du christianisme, mais la liberté religieuse pour tous : les cultes anciens restent parfaitement permis.',
      },
      {
        texte: 'Nous croyons en un seul Dieu, le Père tout-puissant, créateur du ciel et de la terre.',
        qui: 'Le concile de Nicée',
        contexte: 'Première phrase du Credo adopté par les évêques réunis par Constantin en 325.',
        sens:
          'Cette profession de foi, complétée en 381, est encore récitée aujourd’hui par les Églises chrétiennes du monde entier.',
      },
    ],
    reperes: [
      'Fils d’un empereur et d’Hélène, une aubergiste ; proclamé par ses troupes à York en 306.',
      '28 octobre 312 : il bat Maxence au pont Milvius et devient maître de l’Occident.',
      '313 : l’édit de Milan accorde la liberté de culte dans tout l’Empire.',
      '325 : il réunit à Nicée le premier concile de l’Église entière.',
      '330 : il inaugure Constantinople, sur le site de la colonie grecque de Byzance.',
      'Baptisé sur son lit de mort en 337, après trente et un ans de règne.',
    ],
    recit: [
      {
        titre: 'Un empire à quatre têtes',
        texte:
          'Au IIIᵉ siècle, l’Empire a failli se disloquer : invasions, guerres civiles, empereurs assassinés par dizaines. **Dioclétien** le sauve en le partageant : la **tétrarchie**, deux empereurs principaux (les *augustes*) et deux adjoints (les *césars*), chacun sur une portion de territoire. Il organise aussi, en 303, la dernière et la plus dure des **persécutions** contre les chrétiens : églises rasées, livres brûlés, milliers de morts. Quand son père meurt à **York** en 306, **Constantin** est proclamé par l’armée de Bretagne. Le système s’effondre alors en guerre de succession : six prétendants, dix-huit ans de combats. Constantin en sortira seul empereur.',
      },
      {
        titre: 'Le pont Milvius, et l’édit de Milan',
        texte:
          'Le **28 octobre 312**, face à **Maxence** devant Rome, au **pont Milvius** sur le Tibre, Constantin fait peindre sur les boucliers de ses soldats le **chrisme**, monogramme grec du Christ. Ses biographes chrétiens, **Lactance** et **Eusèbe de Césarée**, racontent un songe et une croix vue dans le ciel. Maxence est vaincu et se noie dans le fleuve. L’année suivante, à **Milan**, Constantin et son collègue **Licinius** décident que chacun pourra suivre la religion de son choix : les chrétiens sortent de la clandestinité, récupèrent leurs biens confisqués, bâtissent des basiliques. Ce n’est pas encore une religion d’État — les temples restent ouverts —, mais c’est un renversement complet : dix ans plus tôt, on mourait pour cette foi.',
      },
      {
        titre: 'Nicée : une Église d’empire',
        texte:
          'Devenu seul maître en 324, Constantin gouverne l’Église comme le reste. Quand le prêtre **Arius**, à Alexandrie, enseigne que le Christ est inférieur à Dieu le Père, la querelle déchire l’Orient. L’empereur convoque à ses frais, en **325**, près de trois cents **évêques** à **Nicée** : c’est le **premier concile œcuménique**, la première fois que l’Église entière délibère. Il en sort le **Credo**, profession de foi que les chrétiens récitent encore, et la fixation de la date de **Pâques**. Constantin fait aussi du **dimanche** un jour chômé dans l’Empire (321), finance des basiliques — **Saint-Pierre** de Rome, le **Saint-Sépulcre** à Jérusalem, que sa mère **Hélène** fait bâtir — et exempte le clergé d’impôt. L’Église devient une institution de l’Empire.',
      },
      {
        titre: 'Constantinople, et après',
        texte:
          'En **330**, Constantin inaugure une capitale neuve sur le Bosphore, à l’emplacement de la colonie grecque de **Byzance** : **Constantinople**, « la ville de Constantin ». Le site est presque imprenable, à cheval sur l’Europe et l’Asie, sur la route du blé et de la soie. La ville sera mille ans durant la capitale de l’**Empire romain d’Orient**, jusqu’à sa chute en 1453. Constantin meurt en **337**, baptisé seulement sur son lit de mort, selon un usage alors répandu. Son œuvre tient : en **380**, l’édit de Thessalonique fait du christianisme la **religion officielle** de l’Empire. L’Empire d’Occident s’effondrera un siècle plus tard sous les migrations germaniques — mais l’Église, elle, restera debout au milieu des ruines, et transmettra au Moyen Âge ce qui reste de Rome.',
      },
    ],
    chrono: [
      { date: 'vers 272', fait: 'Naissance à Naissus, en Mésie.' },
      { date: '303', fait: 'Grande persécution des chrétiens par Dioclétien.' },
      { date: '306', fait: 'Proclamé empereur par ses troupes à York.' },
      { date: '312', fait: 'Victoire du pont Milvius, le 28 octobre.' },
      { date: '313', fait: 'Édit de Milan : liberté de culte pour tous.' },
      { date: '325', fait: 'Concile de Nicée : le Credo et la date de Pâques.' },
      { date: '330', fait: 'Inauguration de Constantinople.' },
      { date: '337', fait: 'Mort, après avoir reçu le baptême.' },
      { date: '380', fait: 'Le christianisme devient religion officielle de l’Empire.' },
    ],
    leSaisTu:
      'Le chrisme que Constantin fit peindre sur les boucliers superpose les deux premières lettres grecques du mot Christ : khi (Χ) et rhô (Ρ). On le retrouve gravé sur des sarcophages, des lampes à huile et des monnaies dans tout l’Empire — c’est le premier emblème chrétien, et il a mille sept cents ans.',
    aRetenir: [
      'Constantin règne de 306 à 337 et rétablit l’unité de l’Empire romain.',
      'Sa victoire du pont Milvius, en 312, précède sa faveur pour les chrétiens.',
      'L’édit de Milan, en 313, accorde la liberté de culte dans tout l’Empire.',
      'Il réunit en 325 le concile de Nicée, qui fixe le Credo et la date de Pâques.',
      'Il fonde Constantinople en 330 ; le christianisme devient religion officielle en 380.',
    ],
    mots: [
      {
        mot: 'Tétrarchie',
        sens: 'Gouvernement à quatre empereurs institué par Dioclétien en 293 pour défendre un empire trop vaste.',
      },
      {
        mot: 'Concile',
        sens: 'Assemblée d’évêques réunie pour trancher une question de foi ou de discipline.',
      },
      {
        mot: 'Chrisme',
        sens: 'Monogramme du Christ formé des lettres grecques khi et rhô ; emblème des armées de Constantin.',
      },
      {
        mot: 'Basilique',
        sens: 'À l’origine, un grand bâtiment public romain ; le modèle des premières églises chrétiennes.',
      },
    ],
    lies: ['jesus-de-nazareth', 'saint-paul', 'auguste'],
    niveaux: ['6e', '2de'],
    programme: 'L’Empire romain, le christianisme et les migrations barbares',
    tags: [
      'Constantin',
      'édit de Milan',
      'Nicée',
      'Constantinople',
      'chrisme',
      'pont Milvius',
      'christianisme',
      'Byzance',
      'Dioclétien',
      'concile',
    ],
  },
]
