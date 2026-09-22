// -----------------------------------------------------------------------------
// ANTIQUITÉ — la sixième : l'Égypte, la Grèce des savants et des poètes, Rome
// qui parle.
//
// Ce lot est écrit POUR LA 6e, la classe d'entrée au collège et la moins
// fournie de l'encyclopédie. Huit fiches qui doivent pouvoir se raconter à un
// enfant de onze ans : un tombeau intact et ses 5 398 objets, une pyramide
// mesurée avec un bâton, une école où l'on croit que le monde est fait de
// nombres, un défilé de quinze mètres tenu trois jours, un homme qui invente
// le mot « enquête » — et donc le mot « histoire » —, un théâtre de quatorze
// mille places, une médecine qui cesse d'être magie, un avocat qui meurt de
// ses discours.
//
// DEUX NOMS QUE L'ÉLÈVE CROISE EN MATHS SANS SAVOIR QUE CE SONT DES GENS :
// Thalès et Pythagore ont ici leur portrait, avec ce qu'ils ont réellement
// fait et ce que les manuels leur prêtent.
//
// PRÉCAUTION DE PÉRIODE, la même que dans `personnages-antiquite-orient.ts` :
// aucun de ces huit-là n'a laissé de papiers signés. Les phrases nous viennent
// d'Hérodote, de Platon, de Plutarque, de Diogène Laërce, parfois cinq siècles
// plus tard — celles qui sont invérifiables portent `incertaine` et disent
// pourquoi dans `sens`. La « malédiction de Toutankhamon », elle, est datée :
// elle est née dans les journaux de 1923, et la fiche le dit noir sur blanc.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_ANTIQUITE_GRECE: Personnage[] = [
  {
    id: 'toutankhamon',
    volet: 'personnages',
    nom: 'Toutankhamon',
    surnom: 'le pharaon enfant',
    dates: 'vers 1345 – 1327 av. J.-C.',
    tri: -1327,
    periode: 'antiquite',
    emoji: '🏺',
    roles: ['Pharaon d’Égypte', 'XVIIIᵉ dynastie', 'Restaurateur du culte d’Amon'],
    origine: 'Akhetaton (Amarna), Égypte',
    accroche:
      'Un roi monté sur le trône à neuf ans, mort à dix-huit, oublié trois mille ans — et devenu le plus célèbre des pharaons parce que sa tombe était intacte.',
    citations: [
      {
        texte: 'Oui, je vois des choses merveilleuses.',
        qui: 'Howard Carter',
        contexte:
          'À lord Carnarvon qui lui demandait, derrière lui, s’il voyait quelque chose, le 26 novembre 1922, par le trou percé dans la porte scellée.',
        sens:
          'La lumière de la bougie venait d’éclairer des lits dorés, des chars démontés et des statues noires : rien n’avait bougé depuis trente-trois siècles.',
      },
      {
        texte:
          'Les temples des dieux étaient tombés en ruine, leurs sanctuaires abandonnés, les herbes y poussaient. J’ai chassé le désordre des Deux Terres.',
        contexte:
          'Stèle dite « de la Restauration », gravée au nom de Toutankhamon et dressée à Karnak, vers 1333 av. J.-C.',
        sens:
          'Le jeune roi annonce qu’il rouvre les temples fermés par son père Akhenaton : l’Égypte revient à ses dieux, et d’abord à Amon.',
      },
      {
        texte:
          'La mort frappera de ses ailes celui qui troublera le repos du pharaon.',
        contexte:
          'Phrase présentée dans la presse de 1923 comme une inscription du tombeau. Aucune tablette, aucun mur de KV62 ne la porte.',
        sens:
          'Elle a été inventée par des journaux anglais après la mort de lord Carnarvon : c’est une légende de journalistes, pas un texte égyptien.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi vers neuf ans, mort vers dix-huit : environ neuf années de règne, de 1336 à 1327 av. J.-C.',
      'Fils d’Akhenaton, il s’appelle d’abord Toutankhaton, puis change de nom en rétablissant le culte d’Amon.',
      'Sa tombe, KV62, est la plus petite de la Vallée des Rois — et la seule retrouvée presque intacte.',
      'Howard Carter dégage la première marche le 4 novembre 1922 et ouvre la chambre funéraire le 16 février 1923.',
      '5 398 objets y ont été inventoriés, dont un masque d’or de 11 kg et un poignard en fer de météorite.',
      'La « malédiction du pharaon » est une invention des journaux de 1923, pas une inscription du tombeau.',
    ],
    recit: [
      {
        titre: 'Un enfant dans une Égypte retournée',
        texte:
          'Son père, **Akhenaton**, a fait ce qu’aucun pharaon n’avait osé : fermer les temples, effacer le nom d’**Amon**, imposer un dieu unique, le disque solaire **Aton**, et bâtir une capitale neuve en plein désert, Akhetaton. À sa mort, l’Égypte est fâchée avec ses dieux, brouillée avec ses voisins, et le trône revient à un garçon d’environ **neuf ans**, Toutankhaton. Deux hommes gouvernent derrière lui : le vieux conseiller **Aÿ** et le général **Horemheb**. En trois ans, tout est défait : la cour quitte Amarna pour Memphis et Thèbes, les temples rouvrent, les prêtres reviennent, et l’enfant-roi change de nom — Toutankh**amon**, « image vivante d’Amon ». La stèle de la Restauration raconte cette volte-face en son nom, à un âge où il ne décidait sans doute pas grand-chose.',
      },
      {
        titre: 'Neuf ans de règne, trois mille ans d’oubli',
        texte:
          'Il meurt vers **dix-huit ans**, vers 1327 av. J.-C. On l’enterre vite : la tombe est petite, les peintures ont été posées à la hâte, un trésor de roi entassé dans quatre pièces à peine plus grandes qu’une salle de classe. Puis son nom disparaît. **Horemheb**, devenu pharaon, fait effacer des listes royales tous les rois de la période d’Amarna, lui compris. Deux siècles plus tard, les cabanes des ouvriers qui creusent le tombeau de **Ramsès VI**, juste au-dessus, enfouissent l’entrée sous les gravats. C’est ce double oubli qui sauve la tombe : les pilleurs, qui ont vidé toutes les autres sépultures de la **Vallée des Rois**, ne la retrouvent pas.',
      },
      {
        titre: '4 novembre 1922 : une marche dans le sable',
        texte:
          'L’archéologue anglais **Howard Carter** fouille la vallée depuis 1917, payé par **lord Carnarvon**. Six saisons, rien. Carnarvon annonce qu’il arrête : Carter obtient une dernière campagne. Le **4 novembre 1922**, sous les cabanes d’ouvriers antiques, un enfant porteur d’eau — dit la tradition du chantier — met au jour une marche taillée dans le roc. Seize marches plus bas, une porte scellée. Carter fait fermer le chantier et télégraphie à Carnarvon, qui arrive d’Angleterre. Le **26 novembre**, Carter perce un trou, approche une bougie, regarde : l’or brille partout. La chambre funéraire, elle, n’est ouverte que le **16 février 1923**.',
      },
      {
        titre: '5 398 objets, dix ans de travail',
        texte:
          'Le dégagement dure jusqu’en **1932** : dix ans pour vider quatre pièces. Chaque objet est photographié, numéroté, dessiné avant d’être déplacé — **5 398** au total. Au centre, quatre chapelles de bois doré emboîtées comme des poupées russes, un sarcophage de quartzite, puis **trois cercueils** l’un dans l’autre ; le dernier est en or massif et pèse **110 kg**. Sur le visage de la momie, le **masque d’or** de 11 kg, incrusté de lapis-lazuli, qui est devenu l’image même de l’Égypte. Autour : six chars démontés, cent trente-neuf cannes, des lits, des jeux, des vêtements, deux trompettes, des paniers de fruits — et un **poignard en fer de météorite**, à une époque où l’Égypte ne travaillait pas le fer.',
      },
      {
        titre: 'Ce qu’une tombe apprend',
        texte:
          'Toutankhamon n’a presque rien gouverné, et c’est pourtant par lui qu’on connaît le mieux la vie d’une cour égyptienne : ce qu’on mangeait, comment on s’habillait, ce qu’on emportait pour l’autre monde. Sa momie, examinée au scanner et par l’ADN en **2010**, raconte un garçon fragile — un pied déformé, plusieurs accès de **paludisme**, d’où les cent trente-neuf cannes —, mort sans doute d’une infection après une fracture. Aucun coup sur le crâne, contrairement à ce qu’on a longtemps écrit. Le trésor est aujourd’hui en Égypte, présenté au **Grand Musée égyptien** de Gizeh ; c’est la collection la plus visitée du pays.',
      },
    ],
    chrono: [
      { date: 'vers 1345 av. J.-C.', fait: 'Naissance, sous le règne d’Akhenaton.' },
      { date: 'vers 1336 av. J.-C.', fait: 'Couronné vers neuf ans sous le nom de Toutankhaton.' },
      { date: 'vers 1333 av. J.-C.', fait: 'Retour au culte d’Amon : stèle de la Restauration.' },
      { date: 'vers 1327 av. J.-C.', fait: 'Mort vers dix-huit ans, inhumation dans la tombe KV62.' },
      { date: '4 novembre 1922', fait: 'Carter dégage la première marche de l’escalier.' },
      { date: '26 novembre 1922', fait: '« Des choses merveilleuses » : l’antichambre est ouverte.' },
      { date: '16 février 1923', fait: 'Ouverture de la chambre funéraire.' },
      { date: '5 avril 1923', fait: 'Mort de lord Carnarvon : la presse invente la malédiction.' },
      { date: '28 octobre 1925', fait: 'Le masque d’or est dégagé du visage de la momie.' },
      { date: '1932', fait: 'Fin du chantier : 5 398 objets inventoriés.' },
    ],
    leSaisTu:
      'Lord Carnarvon meurt au Caire le 5 avril 1923 d’une piqûre de moustique infectée par un coup de rasoir. Les journaux inventent aussitôt la « malédiction » — on raconte même que les lumières du Caire se sont éteintes à sa mort. Vérification faite : sur les cinquante-huit personnes présentes aux ouvertures, huit seulement sont mortes dans les douze années suivantes.',
    aRetenir: [
      'Toutankhamon règne sur l’Égypte vers 1336-1327 av. J.-C. : roi à neuf ans, mort vers dix-huit ans.',
      'Fils d’Akhenaton, il rétablit le culte d’Amon, quitte Amarna et change son nom de Toutankhaton en Toutankhamon.',
      'Howard Carter découvre sa tombe KV62 dans la Vallée des Rois le 4 novembre 1922 : 5 398 objets presque intacts.',
      'Son masque funéraire est en or massif et pèse environ 11 kg ; son dernier cercueil, 110 kg.',
      'La « malédiction du pharaon » est une légende fabriquée par la presse en 1923.',
    ],
    mots: [
      {
        mot: 'Pharaon',
        sens: 'Le roi d’Égypte, considéré comme un dieu vivant, garant de l’ordre du monde.',
      },
      {
        mot: 'Vallée des Rois',
        sens: 'Vallée désertique près de Thèbes où les pharaons du Nouvel Empire se sont fait creuser des tombes cachées.',
      },
      {
        mot: 'Momie',
        sens: 'Corps préparé pour durer : organes retirés, chair séchée au natron, corps enveloppé de bandelettes.',
      },
      {
        mot: 'Maât',
        sens: 'L’ordre juste du monde, que le pharaon doit maintenir contre le désordre.',
      },
    ],
    lies: ['ramses-ii', 'naissance-de-l-ecriture', 'herodote', 'cleopatre'],
    niveaux: ['6e'],
    programme: 'Premiers États, premières écritures',
    tags: [
      'Égypte',
      'pharaon',
      'Vallée des Rois',
      'Howard Carter',
      'KV62',
      'masque d’or',
      'momie',
      'Toutankhaton',
      'Akhenaton',
      'malédiction',
      'Carnarvon',
      'Amon',
    ],
  },
  {
    id: 'thales',
    volet: 'personnages',
    nom: 'Thalès de Milet',
    surnom: 'le premier savant',
    dates: 'vers 625 – 547 av. J.-C.',
    tri: -547,
    periode: 'antiquite',
    emoji: '📐',
    roles: ['Savant grec', 'Astronome', 'Premier des Sept Sages'],
    origine: 'Milet, Ionie',
    accroche:
      'Le premier homme qui ait expliqué le monde sans les dieux — et qui a mesuré la hauteur d’une pyramide avec un bâton et son ombre.',
    citations: [
      {
        texte: 'Le principe de toutes choses, c’est l’eau.',
        contexte:
          'Doctrine de Thalès résumée par Aristote dans la *Métaphysique*, deux siècles et demi plus tard.',
        sens:
          'Thalès n’a laissé aucun livre : la formule est celle d’Aristote. Ce qui compte n’est pas la réponse — fausse — mais la question : de quoi le monde est-il fait ?',
        incertaine: true,
      },
      {
        texte:
          'Il cherche à savoir ce qui se passe dans le ciel, et il ne voit pas ce qui est à ses pieds.',
        qui: 'Une servante thrace, chez Platon',
        contexte:
          'Thalès, le nez en l’air pour observer les astres, vient de tomber dans un puits. Platon, *Théétète*.',
        sens:
          'La première moquerie de l’histoire contre les savants distraits : Platon la raconte pour dire que le philosophe regarde plus loin que ses pieds.',
      },
      {
        texte:
          'Quelle est la chose la plus difficile ? Se connaître soi-même. Et la plus facile ? Donner des conseils aux autres.',
        contexte:
          'Réponses prêtées à Thalès par Diogène Laërce, qui écrit huit siècles après lui.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né vers 625 av. J.-C. à Milet, grande cité grecque d’Ionie, sur la côte de l’actuelle Turquie.',
      'Premier des « Sept Sages » de la Grèce ; il n’a laissé aucun écrit, on ne le connaît que par les autres.',
      'Il annonce l’éclipse de Soleil du 28 mai 585 av. J.-C., qui interrompt une bataille.',
      'En Égypte, il mesure la hauteur de la grande pyramide grâce à la longueur de son ombre.',
      'Pour lui, tout vient de l’eau : une explication naturelle du monde, sans intervention des dieux.',
      'Le « théorème de Thalès » du collège ne porte son nom qu’en France, et seulement depuis le XIXᵉ siècle.',
    ],
    recit: [
      {
        titre: 'Milet, la ville qui se met à penser',
        texte:
          '**Milet** n’est pas une bourgade : c’est le plus grand port grec d’**Ionie**, quatre ports, des dizaines de colonies fondées jusqu’en mer Noire, des bateaux qui reviennent d’Égypte et des caravanes qui arrivent de Babylone. On y échange des marchandises, et avec elles des tables d’astronomie babyloniennes et des méthodes d’arpentage égyptiennes. Dans cette ville, vers 600 av. J.-C., un homme cesse d’expliquer l’orage par la colère de **Zeus** et cherche une cause dans les choses elles-mêmes. Thalès est aussi ingénieur — on lui prête d’avoir détourné un fleuve pour faire passer une armée — et conseiller politique : il propose aux cités d’Ionie de s’unir face aux Perses. Après lui, **Anaximandre** puis **Anaximène** continuent : c’est l’**école de Milet**, le premier laboratoire d’idées de l’Occident.',
      },
      {
        titre: 'L’ombre de la pyramide',
        texte:
          'En Égypte, raconte-t-on, Thalès étonne le pharaon en mesurant la **grande pyramide** sans y toucher. Il plante un bâton droit dans le sable et attend le moment de la journée où l’ombre du bâton est exactement aussi longue que le bâton. À cet instant précis, l’ombre de la pyramide est aussi longue que la pyramide est haute : il n’y a plus qu’à mesurer l’ombre au sol. Une autre version, rapportée par **Plutarque**, est plus forte encore : à n’importe quelle heure, le rapport entre la hauteur du bâton et son ombre est le même que celui entre la hauteur de la pyramide et la sienne. C’est exactement l’idée de **proportion** qu’on appelle aujourd’hui, en France, le théorème de Thalès.',
      },
      {
        titre: 'L’éclipse du 28 mai 585',
        texte:
          'Hérodote raconte la scène au premier livre de *L’Enquête*. Les **Lydiens** et les **Mèdes** se battent depuis cinq ans quand, en pleine bataille, « le jour devient soudain nuit ». Les deux armées s’arrêtent net, déposent les armes et font la paix. Or Thalès, dit Hérodote, avait **annoncé** cette éclipse aux Ioniens, pour l’année où elle se produisit. Les astronomes modernes datent l’éclipse du **28 mai 585 av. J.-C.** — c’est le plus ancien événement de l’histoire qu’on sache dater au jour près. Thalès n’avait probablement pas de théorie des éclipses : il disposait sans doute de relevés babyloniens repérant leur retour régulier. Mais c’est la première fois qu’un homme annonce le ciel au lieu de l’interpréter.',
      },
      {
        titre: 'Ce qu’il reste de lui au tableau',
        texte:
          'On lui attribue les premières **démonstrations** de géométrie : un triangle inscrit dans un demi-cercle est toujours rectangle, un triangle isocèle a deux angles égaux, un diamètre coupe le cercle en deux parties égales. Des résultats connus avant lui, peut-être — mais démontrés, c’est-à-dire vrais pour tous les cas, et pas seulement vérifiés sur un dessin. Aristote raconte enfin qu’on lui reprochait d’être pauvre : prévoyant par l’astronomie une belle récolte d’olives, Thalès loua d’avance tous les pressoirs de Milet et de Chios, puis les reloua au prix fort à la saison. Il voulait montrer, dit Aristote, qu’un philosophe peut devenir riche quand il le décide — et que ce n’est pas ce qui l’intéresse.',
      },
    ],
    chrono: [
      { date: 'vers 625 av. J.-C.', fait: 'Naissance à Milet, en Ionie.' },
      { date: 'vers 600 av. J.-C.', fait: 'Voyage en Égypte : il mesure la pyramide par son ombre.' },
      { date: '28 mai 585 av. J.-C.', fait: 'L’éclipse annoncée arrête la bataille du fleuve Halys.' },
      { date: 'vers 570 av. J.-C.', fait: 'Anaximandre, son élève, dessine la première carte du monde.' },
      { date: 'vers 560 av. J.-C.', fait: 'Il conseille aux cités d’Ionie de s’unir face aux Perses.' },
      { date: 'vers 547 av. J.-C.', fait: 'Mort à Milet, vers quatre-vingts ans.' },
    ],
    leSaisTu:
      'Les Grecs le comptaient parmi les « Sept Sages ». Selon la légende, des pêcheurs remontèrent un trépied d’or destiné « au plus sage des Grecs » : on l’offrit à Thalès, qui l’envoya à un autre sage, lequel le passa à un troisième. Le trépied fit le tour des sept avant de revenir à Thalès, qui le consacra au dieu de Delphes.',
    aRetenir: [
      'Thalès de Milet (vers 625-547 av. J.-C.) est le premier savant grec dont le nom nous soit parvenu.',
      'Il explique le monde par une cause naturelle, l’eau, et non par la volonté des dieux : c’est le début de la science.',
      'Il annonce l’éclipse de Soleil du 28 mai 585 av. J.-C. et mesure la pyramide de Khéops par son ombre.',
      'Le théorème de Thalès dit que des droites parallèles découpent des segments proportionnels.',
      'Il n’a rien écrit : tout ce qu’on sait de lui vient d’Aristote, de Platon ou d’Hérodote.',
    ],
    mots: [
      {
        mot: 'Ionie',
        sens: 'La côte grecque d’Asie Mineure, en face des îles : Milet, Éphèse, Halicarnasse. La science grecque y naît.',
      },
      {
        mot: 'Philosophe',
        sens: 'Littéralement « ami de la sagesse » : celui qui cherche à comprendre le monde en raisonnant.',
      },
      {
        mot: 'Démonstration',
        sens: 'Raisonnement qui prouve qu’une chose est vraie dans tous les cas, et pas seulement sur un exemple.',
      },
    ],
    lies: ['pythagore', 'archimede', 'aristote', 'herodote'],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Milet',
      'Ionie',
      'théorème de Thalès',
      'éclipse',
      'pyramide',
      'ombre',
      'Sept Sages',
      'géométrie',
      'astronomie',
      'science grecque',
    ],
  },
  {
    id: 'pythagore',
    volet: 'personnages',
    nom: 'Pythagore',
    surnom: 'le maître de Crotone',
    dates: 'vers 580 – 495 av. J.-C.',
    tri: -495,
    periode: 'antiquite',
    emoji: '🔢',
    roles: ['Savant grec', 'Fondateur d’école', 'Mathématicien'],
    origine: 'Samos, mer Égée',
    accroche:
      'Le nom le plus célèbre des mathématiques : un maître qui n’a rien écrit et dont l’école croyait que le monde entier était fait de nombres.',
    citations: [
      {
        texte: 'Tout est nombre.',
        contexte:
          'Formule qui résume la doctrine des pythagoriciens, telle qu’Aristote la rapporte dans la *Métaphysique*.',
        sens:
          'Le monde n’est pas un caprice des dieux : c’est un ensemble de rapports qu’on peut compter — les accords de musique, les figures, la course des astres.',
        incertaine: true,
      },
      {
        texte: 'Lui-même l’a dit.',
        qui: 'Les disciples de Pythagore',
        contexte:
          'Réponse des pythagoriciens quand on leur demandait la preuve de ce qu’ils avançaient. Rapportée en latin par Cicéron : *ipse dixit*.',
        sens:
          'C’est l’argument d’autorité à l’état pur : c’est vrai parce que le maître l’a dit. Exactement ce que la science grecque allait apprendre à refuser.',
      },
      {
        texte:
          'Aux Jeux viennent trois sortes d’hommes : ceux qui vendent, ceux qui concourent, et ceux qui regardent. Les meilleurs sont ceux qui regardent.',
        contexte:
          'Cicéron attribue à Pythagore cette comparaison, d’où viendrait le mot « philosophe » : celui qui contemple sans chercher ni gain ni gloire.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né vers 580 av. J.-C. à Samos ; il fuit le tyran Polycrate et s’installe à Crotone vers 530.',
      'Son école est une communauté : on y vit ensemble, on partage tout, et les novices se taisent cinq ans.',
      'Il n’a rien écrit : tout ce qu’on lui prête a été rapporté par d’autres, des siècles plus tard.',
      'Les pythagoriciens découvrent que les accords de musique correspondent à des rapports simples.',
      'Le célèbre calcul était connu des Babyloniens ; les Grecs en donnent la démonstration générale.',
      'Chassée de Crotone, l’école se disperse ; Pythagore meurt à Métaponte vers 495 av. J.-C.',
    ],
    recit: [
      {
        titre: 'De Samos à la Grande-Grèce',
        texte:
          'Pythagore naît dans l’île de **Samos**, face à Milet. La tradition le fait voyager en Égypte et jusqu’à Babylone, où il aurait appris la géométrie des arpenteurs et l’astronomie des prêtres. Vers **530 av. J.-C.**, il quitte son île, où règne le tyran Polycrate, et s’installe à **Crotone**, cité grecque du sud de l’Italie — ce qu’on appelle la **Grande-Grèce**. Il y fonde une communauté qui n’est ni tout à fait une école ni tout à fait une secte : on y met ses biens en commun, on suit des règles de vie strictes, on ne mange pas de viande, et les nouveaux venus écoutent en silence pendant **cinq ans** avant d’avoir le droit de poser une question. Les femmes y sont admises, ce qui est rarissime en Grèce ; Théano, la plus connue, y enseigne.',
      },
      {
        titre: 'La corde, le marteau et le nombre',
        texte:
          'La grande découverte des pythagoriciens est musicale. Sur une corde tendue, en pinçant exactement la **moitié**, on obtient la même note plus haute : l’**octave**, rapport 2/1. Aux **deux tiers**, la quinte, 3/2. Aux **trois quarts**, la quarte, 4/3. Les accords qui sonnent juste à l’oreille correspondent à des fractions simples : la beauté se compte. De là leur idée immense — et très en avance — que le monde obéit à des rapports mesurables, des cordes aux planètes, dont ils imaginent qu’elles produisent une « harmonie des sphères ». Ils rangent aussi les nombres en figures : nombres carrés, nombres triangulaires, et la **tétraktys**, 1 + 2 + 3 + 4 = 10, disposée en triangle de points, sur laquelle ils prêtaient serment.',
      },
      {
        titre: 'Le théorème, et le scandale de la diagonale',
        texte:
          'Le rapport 3-4-5 était connu bien avant eux : les arpenteurs égyptiens tendaient une corde à treize nœuds pour tracer un angle droit, et des tablettes babyloniennes alignent des dizaines de triplets du même genre, mille ans plus tôt. Ce que les Grecs apportent, c’est la **démonstration** : dans **tout** triangle rectangle, le carré de l’hypoténuse égale la somme des carrés des deux autres côtés. Puis vient la catastrophe. Appliqué à un carré de côté 1, le théorème donne une diagonale dont la longueur — **racine de 2** — ne s’écrit avec **aucune fraction**. Pour des gens qui affirmaient que tout est nombre, c’est un désastre. La légende raconte qu’Hippase de Métaponte, qui aurait divulgué le secret, périt en mer.',
      },
      {
        titre: 'La fin de l’école',
        texte:
          'Les pythagoriciens ne sont pas seulement des savants : à Crotone, ils gouvernent. Leur influence politique finit par exaspérer la cité. Vers **500 av. J.-C.**, la maison où ils se réunissent est incendiée, leurs partisans sont chassés des villes de Grande-Grèce, et le vieux maître se réfugie à **Métaponte**, où il meurt vers 495. Ses disciples se dispersent dans tout le monde grec, en emportant l’idée qui compte : que les mathématiques ne servent pas seulement à arpenter les champs ou à compter les sacs de blé, mais à comprendre ce qui est. **Platon** s’en souviendra : il fera graver, dit-on, au fronton de son école « Que nul n’entre ici s’il n’est géomètre ».',
      },
    ],
    chrono: [
      { date: 'vers 580 av. J.-C.', fait: 'Naissance à Samos, en mer Égée.' },
      { date: 'vers 535 av. J.-C.', fait: 'Voyages en Égypte et en Orient, selon la tradition.' },
      { date: 'vers 530 av. J.-C.', fait: 'Il fonde son école à Crotone, en Grande-Grèce.' },
      { date: 'vers 520 av. J.-C.', fait: 'Les rapports musicaux : octave 2/1, quinte 3/2, quarte 4/3.' },
      { date: 'vers 510 av. J.-C.', fait: 'La diagonale du carré ne s’écrit avec aucune fraction.' },
      { date: 'vers 500 av. J.-C.', fait: 'Révolte à Crotone : les pythagoriciens sont chassés.' },
      { date: 'vers 495 av. J.-C.', fait: 'Mort à Métaponte, dans le sud de l’Italie.' },
    ],
    leSaisTu:
      'La règle la plus étrange de l’école était l’interdiction de manger des fèves — personne n’a jamais su pourquoi. Diogène Laërce raconte même que Pythagore, poursuivi, aurait refusé de traverser un champ de fèves pour s’enfuir et se serait laissé rattraper. C’est une légende écrite huit siècles après sa mort, mais elle dit bien ce qu’on pensait de ses interdits.',
    aRetenir: [
      'Pythagore (vers 580-495 av. J.-C.) naît à Samos et fonde son école à Crotone, en Grande-Grèce.',
      'Pour les pythagoriciens, tout s’explique par les nombres : la musique, les figures, le ciel.',
      'Théorème de Pythagore : dans un triangle rectangle, le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés.',
      'Le calcul était déjà utilisé par les Égyptiens et les Babyloniens ; les Grecs le démontrent pour tous les cas.',
      'Pythagore n’a laissé aucun écrit : on ne le connaît que par ses disciples et par ses adversaires.',
    ],
    mots: [
      {
        mot: 'Hypoténuse',
        sens: 'Dans un triangle rectangle, le côté le plus long : celui qui est en face de l’angle droit.',
      },
      {
        mot: 'Grande-Grèce',
        sens: 'Le sud de l’Italie et la Sicile, couverts de cités fondées par des colons grecs à partir du VIIIᵉ siècle av. J.-C.',
      },
      {
        mot: 'Nombre irrationnel',
        sens: 'Un nombre qui ne s’écrit avec aucune fraction, comme la racine de 2 : les Grecs en ont fait la découverte, et l’ont mal vécue.',
      },
    ],
    lies: ['thales', 'platon', 'archimede', 'jeux-olympiques-antiques'],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Samos',
      'Crotone',
      'théorème de Pythagore',
      'hypoténuse',
      'triangle rectangle',
      'nombres',
      'musique',
      'Grande-Grèce',
      'tétraktys',
      'mathématiques',
    ],
  },
  {
    id: 'leonidas',
    volet: 'personnages',
    nom: 'Léonidas',
    surnom: 'le roi des Thermopyles',
    dates: 'vers 540 – 480 av. J.-C.',
    tri: -480,
    periode: 'antiquite',
    emoji: '🪖',
    roles: ['Roi de Sparte', 'Chef de guerre'],
    origine: 'Sparte, Laconie',
    accroche:
      'Trois jours dans un défilé de quinze mètres de large pour retarder l’armée perse — et une épitaphe qui parle d’obéissance, pas de gloire.',
    citations: [
      {
        texte:
          'Passant, va dire à Sparte que nous sommes morts ici pour obéir à ses lois.',
        qui: 'Simonide de Céos',
        contexte:
          'Deux vers gravés sur la pierre dressée à l’endroit où les derniers Grecs sont tombés, aux Thermopyles. Hérodote les recopie une génération plus tard.',
        sens:
          'Pas un mot de gloire ni d’héroïsme : ces hommes sont restés parce que la loi de Sparte interdisait de reculer. C’est ce que l’épitaphe demande d’aller dire.',
      },
      {
        texte: 'Viens les prendre !',
        contexte:
          'Réponse prêtée à Léonidas quand Xerxès lui fait porter l’ordre de déposer les armes. En grec : *Molon labé*. Rapportée par Plutarque, cinq siècles plus tard.',
        sens:
          'Plutarque écrit très longtemps après la bataille : la phrase est sans doute une belle reconstitution, pas un mot noté sur le moment.',
        incertaine: true,
      },
      {
        texte: 'Tant mieux : nous combattrons à l’ombre.',
        qui: 'Diénékès, soldat spartiate',
        contexte:
          'On venait de lui dire que les flèches perses étaient si nombreuses qu’elles cacheraient le soleil. Hérodote, *L’Enquête*, livre VII.',
      },
    ],
    reperes: [
      'Roi de Sparte vers 489 av. J.-C., de la famille des Agiades — Sparte a toujours deux rois à la fois.',
      'En août 480 av. J.-C., il barre aux Perses le défilé des Thermopyles, large d’une quinzaine de mètres.',
      'Il commande environ 7 000 Grecs : les 300 Spartiates n’étaient pas seuls, on les oublie toujours.',
      'Trois jours de combat ; un Grec, Éphialtès, montre aux Perses le sentier qui contourne la montagne.',
      'Il renvoie l’armée et reste avec 300 Spartiates, 700 Thespiens et 400 Thébains : tous meurent.',
      'Le temps gagné permet à la flotte grecque de se préparer : Salamine est remportée un mois plus tard.',
    ],
    recit: [
      {
        titre: 'Sparte, une cité qui est une caserne',
        texte:
          'À **Sparte**, un garçon quitte sa famille à sept ans pour l’**agôgè**, l’éducation collective de la cité : on y apprend à obéir, à supporter la faim et le froid, à combattre en rang. Devenu homme, le Spartiate n’exerce aucun métier — les terres sont travaillées par les **hilotes**, une population entière réduite en servitude — et mange chaque soir au repas commun. La cité n’a pas de remparts : ses murailles, dit-on, ce sont ses hommes. Deux rois la dirigent ensemble, encadrés par un conseil d’anciens et par cinq magistrats élus, les éphores. **Léonidas** n’était pas destiné à régner : il devient roi vers 489 av. J.-C. à la mort de ses frères, après avoir suivi l’agôgè comme les autres — ce qu’un héritier direct évitait.',
      },
      {
        titre: 'L’armée qui arrive de l’est',
        texte:
          'Dix ans plus tôt, à **Marathon**, les Athéniens ont repoussé seuls un premier débarquement perse. Le fils de Darius, **Xerxès**, revient pour en finir : il fait jeter sur l’**Hellespont** un pont de bateaux et creuser un canal à travers la presqu’île de l’Athos pour éviter à sa flotte un cap dangereux. Hérodote parle de **1 700 000 hommes** ; les historiens d’aujourd’hui estiment l’armée entre 100 000 et 300 000 — ce qui reste énorme pour l’époque. Les cités grecques, réunies à Corinthe, décident de tenir un passage étroit où le nombre ne servira à rien : les **Thermopyles**, les « Portes chaudes », un couloir entre la montagne et la mer. L’oracle de Delphes a prévenu Sparte : ou la cité tombe, ou un de ses rois meurt.',
      },
      {
        titre: 'Trois jours aux Portes chaudes',
        texte:
          'Les Grecs referment un vieux mur en travers du défilé et attendent. Pendant deux jours, la **phalange** grecque — boucliers joints, longues lances, armure de bronze — broie tout ce que Xerxès lance contre elle, y compris ses fameux **Immortels** : dans quinze mètres de large, la supériorité du nombre ne sert à rien. Puis un habitant de la région, **Éphialtès**, vient vendre au roi perse un sentier de montagne qui contourne la position. Prévenu dans la nuit, Léonidas renvoie le gros de l’armée grecque, qui pourra servir ailleurs, et reste pour couvrir la retraite avec ses **300 Spartiates**, **700 Thespiens** qui refusent de partir, et 400 Thébains. Le troisième jour, encerclés, ils meurent tous. Xerxès, furieux, fait décapiter le corps de Léonidas.',
      },
      {
        titre: 'Ce que la mort de ces hommes a servi',
        texte:
          'Militairement, les Thermopyles sont une **défaite** : la route d’Athènes est ouverte, la ville est évacuée puis incendiée. Mais les jours gagnés ont permis d’organiser la flotte, et en **septembre 480**, dans le détroit de **Salamine**, les navires grecs détruisent l’armada perse ; l’été suivant, à **Platées**, l’armée de Xerxès est brisée. Quarante ans plus tard, les os de Léonidas sont ramenés à Sparte. Sur le tumulus des Thermopyles, on grave les deux vers de **Simonide**. Les 700 Thespiens, morts le même jour au même endroit, n’ont eu ni film ni légende — c’est la première chose à savoir quand on entend parler des « 300 ».',
      },
    ],
    chrono: [
      { date: 'vers 540 av. J.-C.', fait: 'Naissance à Sparte, fils du roi Anaxandride.' },
      { date: '490 av. J.-C.', fait: 'Marathon : Athènes repousse seule le premier débarquement perse.' },
      { date: 'vers 489 av. J.-C.', fait: 'Léonidas devient roi de Sparte.' },
      { date: 'Printemps 480 av. J.-C.', fait: 'Xerxès franchit l’Hellespont sur un pont de bateaux.' },
      { date: 'Août 480 av. J.-C.', fait: 'Deux jours de combats victorieux dans le défilé.' },
      { date: 'Août 480 av. J.-C.', fait: 'Éphialtès livre le sentier : Léonidas et ses hommes meurent.' },
      { date: 'Septembre 480 av. J.-C.', fait: 'Salamine : la flotte perse est détruite.' },
      { date: '479 av. J.-C.', fait: 'Platées : l’invasion perse est brisée.' },
    ],
    leSaisTu:
      'Avant la bataille, un éclaireur perse envoyé en reconnaissance revient stupéfait : les Spartiates faisaient de la gymnastique et se peignaient longuement les cheveux. Xerxès n’y comprend rien. Un Grec exilé à sa cour, Démarate, lui explique : c’est leur habitude quand ils s’apprêtent à risquer leur vie. Hérodote raconte la scène au livre VII.',
    aRetenir: [
      'Léonidas, roi de Sparte, meurt au défilé des Thermopyles en août 480 av. J.-C. face à l’armée de Xerxès.',
      'Il commandait environ 7 000 Grecs : les 300 Spartiates n’étaient pas seuls, 700 Thespiens sont morts avec eux.',
      'La position est tournée par un sentier de montagne qu’un Grec, Éphialtès, montre aux Perses.',
      'La résistance retarde les Perses et prépare la victoire navale de Salamine, en septembre 480 av. J.-C.',
      'L’épitaphe de Simonide dit que les Spartiates sont morts pour obéir aux lois de leur cité.',
    ],
    mots: [
      {
        mot: 'Hoplite',
        sens: 'Fantassin grec équipé à ses frais : casque, cuirasse, jambières, grand bouclier rond et lance.',
      },
      {
        mot: 'Phalange',
        sens: 'Formation de combat en rangs serrés, boucliers joints : chacun protège en partie son voisin de gauche.',
      },
      {
        mot: 'Agôgè',
        sens: 'L’éducation militaire collective des garçons spartiates, de sept à vingt ans.',
      },
      {
        mot: 'Guerres médiques',
        sens: 'Les guerres entre les cités grecques et l’empire perse, de 490 à 479 av. J.-C.',
      },
    ],
    lies: ['bataille-de-marathon', 'herodote', 'pericles', 'democratie-athenienne'],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Sparte',
      'Thermopyles',
      '300',
      'Xerxès',
      'Perses',
      'guerres médiques',
      'hoplite',
      'phalange',
      'Éphialtès',
      'Salamine',
      'Simonide',
    ],
  },
  {
    id: 'herodote',
    volet: 'personnages',
    nom: 'Hérodote',
    surnom: 'le père de l’histoire',
    dates: 'vers 484 – 425 av. J.-C.',
    tri: -425,
    periode: 'antiquite',
    emoji: '🗺️',
    roles: ['Historien grec', 'Voyageur', 'Auteur de *L’Enquête*'],
    origine: 'Halicarnasse, Carie',
    accroche:
      'Le premier homme qui, au lieu de chanter le passé, est allé le vérifier sur place : son mot pour ça, *historia*, a donné « histoire ».',
    citations: [
      {
        texte:
          'Hérodote d’Halicarnasse présente ici le résultat de son enquête, pour que le temps n’abolisse pas les œuvres des hommes.',
        contexte:
          'Première phrase de *L’Enquête*, écrite vers 440 av. J.-C. C’est la première page d’histoire de la littérature occidentale.',
        sens:
          'En grec, « enquête » se dit *historia* : le mot « histoire » vient de cette phrase. Écrire l’histoire, c’est d’abord empêcher l’oubli.',
      },
      {
        texte: 'L’Égypte est un don du Nil.',
        contexte:
          '*L’Enquête*, livre II. Hérodote a remonté le fleuve jusqu’à Éléphantine et observé la terre noire déposée par la crue.',
        sens:
          'Sans la crue annuelle qui dépose son limon, pas de récolte, pas de villages, pas d’Égypte : un pays s’explique aussi par sa géographie.',
      },
      {
        texte:
          'Je dois rapporter ce qui se raconte, mais je ne suis pas tenu d’y croire — et cette règle vaut pour tout mon ouvrage.',
        contexte: '*L’Enquête*, livre VII, à propos d’une histoire qu’il juge invraisemblable.',
        sens:
          'La règle numéro un du métier d’historien : dire d’où vient l’information, et séparer ce qu’on rapporte de ce qu’on tient pour vrai.',
      },
      {
        texte: 'Hérodote, le père de l’histoire.',
        qui: 'Cicéron',
        contexte: '*Des lois*, livre I, écrit à Rome vers 52 av. J.-C., quatre siècles après Hérodote.',
      },
    ],
    reperes: [
      'Né vers 484 av. J.-C. à Halicarnasse, cité grecque d’Asie Mineure alors soumise au roi perse.',
      'Il voyage en Égypte, à Tyr, à Babylone et jusqu’en mer Noire, et note ce qu’il voit et ce qu’on lui dit.',
      'Son livre, *L’Enquête*, raconte les guerres entre les Grecs et les Perses, de 490 à 479 av. J.-C.',
      '*Historia* veut dire « enquête » en grec : c’est de ce titre que vient le mot « histoire ».',
      'Il interroge des témoins, compare les versions, et signale quand il ne croit pas ce qu’on lui raconte.',
      'Il décrit les Perses et les Égyptiens sans mépris, ce qui est nouveau chez un Grec.',
    ],
    recit: [
      {
        titre: 'Avant lui, le passé se chantait',
        texte:
          'Avant Hérodote, un Grec qui voulait savoir ce qui s’était passé autrefois avait deux sources : les poèmes d’**Homère**, où les dieux décident de tout, et les listes de rois et de prêtres conservées dans les sanctuaires. Le passé était un récit, pas une question. Hérodote change le geste : il se déplace, il regarde, et surtout **il demande**. Né à **Halicarnasse**, une cité grecque gouvernée par les Perses, chassé de chez lui après une révolte contre le tyran local, il passe sa vie sur les routes. Il descend en Égypte, mesure des monuments, interroge des prêtres par interprète ; il visite **Babylone** et ses murailles, la **Phénicie**, les rivages de la mer Noire où vivent les Scythes. Partout, il note les coutumes, les impôts, les distances, les histoires qu’on lui sert.',
      },
      {
        titre: 'Un mot qui devient un métier',
        texte:
          'Vers 440 av. J.-C., il rassemble tout cela dans un ouvrage énorme que des savants d’Alexandrie découperont plus tard en **neuf livres**, portant chacun le nom d’une Muse. Le premier mot du titre est *historia* : **enquête**. Ce n’est pas une formule de modestie, c’est un programme. Hérodote annonce d’emblée son sujet : pourquoi Grecs et Perses en sont venus à se faire la guerre. Chercher la **cause** d’un événement au lieu de le raconter, c’est exactement ce qui sépare l’histoire de la légende. Et quand deux versions s’opposent — il en donne souvent trois ou quatre —, il les aligne toutes et dit laquelle lui paraît la moins invraisemblable. Le lecteur peut donc le contredire : une première dans l’histoire des livres.',
      },
      {
        titre: 'Les guerres médiques, de l’intérieur',
        texte:
          'Le récit conduit à **Marathon** (490), aux **Thermopyles** et à **Salamine** (480), à **Platées** (479). C’est à Hérodote qu’on doit presque tout ce qu’on sait de ces batailles : le pont de bateaux de **Xerxès** sur l’Hellespont, les Spartiates qui se peignent avant de mourir, l’épitaphe de Simonide. Ses chiffres sont énormes et faux — 1 700 000 soldats perses —, parce qu’il recopie ce que lui donnent ses informateurs. Mais il fait une chose rare : il raconte l’ennemi. Les coutumes perses, leur éducation, leur religion, leurs rois, occupent des pages entières, sans caricature. Pour lui, les Grecs n’ont pas gagné parce qu’ils valaient mieux, mais parce que des **hommes libres** se battaient pour leurs propres lois.',
      },
      {
        titre: 'Père de l’histoire, père des mensonges ?',
        texte:
          'Dès l’Antiquité, on lui reproche ses histoires de fourmis chercheuses d’or en Inde, de serpents volants d’Arabie, de phénix qui renaît de ses cendres. **Plutarque** lui consacre un pamphlet entier. Le surnom de « père des mensonges » a couru pendant des siècles à côté de celui que lui donne **Cicéron**, « père de l’histoire ». Puis l’archéologie a tranché, souvent en sa faveur : les tombes des Scythes exhumées dans les steppes correspondent aux rites funéraires qu’il décrit, et ses pages sur la momification égyptienne sont exactes. Il se trompe, il exagère, il croit trop de monde — mais il dit **d’où il tient ce qu’il raconte**. C’est pour cela qu’on peut le vérifier, et c’est pour cela qu’il est le premier historien.',
      },
    ],
    chrono: [
      { date: 'vers 484 av. J.-C.', fait: 'Naissance à Halicarnasse, en Asie Mineure.' },
      { date: 'vers 464 av. J.-C.', fait: 'Exil à Samos après une révolte contre le tyran de sa cité.' },
      { date: 'vers 455 av. J.-C.', fait: 'Voyage en Égypte : il remonte le Nil jusqu’à Éléphantine.' },
      { date: 'vers 450 av. J.-C.', fait: 'Séjours à Tyr, à Babylone et sur les rivages de la mer Noire.' },
      { date: 'vers 445 av. J.-C.', fait: 'Il lit des extraits de son ouvrage à Athènes, au temps de Périclès.' },
      { date: '444 av. J.-C.', fait: 'Il part avec les colons fonder Thourioi, en Italie du Sud.' },
      { date: 'vers 440 av. J.-C.', fait: 'Rédaction de *L’Enquête*, plus tard découpée en neuf livres.' },
      { date: 'vers 425 av. J.-C.', fait: 'Mort à Thourioi.' },
    ],
    leSaisTu:
      'Hérodote rapporte la première expérience scientifique connue — et complètement ratée. Le pharaon Psammétique voulait savoir quel peuple était le plus ancien du monde : il fit élever deux nouveau-nés par un berger muet. Au bout de deux ans, les enfants dirent *bekos*, qui signifie « pain » en phrygien. Le pharaon en conclut que les Phrygiens étaient plus anciens que les Égyptiens.',
    aRetenir: [
      'Hérodote (vers 484-425 av. J.-C.) est l’auteur de *L’Enquête*, le premier grand livre d’histoire.',
      'En grec, *historia* signifie « enquête » : c’est de ce mot que vient le mot « histoire ».',
      'Il raconte les guerres médiques, qui opposent les cités grecques à l’empire perse de 490 à 479 av. J.-C.',
      'Il cite ses sources et distingue ce qu’il a vu de ce qu’on lui a raconté.',
      'Cicéron l’a surnommé « le père de l’histoire » quatre siècles plus tard.',
    ],
    mots: [
      {
        mot: 'Enquête',
        sens: '*Historia* en grec : chercher soi-même, en interrogeant des témoins et en comparant leurs réponses.',
      },
      {
        mot: 'Source',
        sens: 'Tout ce qui renseigne sur le passé : un témoin, un objet, un monument, un texte.',
      },
      {
        mot: 'Barbare',
        sens: 'Pour un Grec, celui qui ne parle pas grec : le mot imite un baragouin, et ne veut pas dire « sauvage ».',
      },
      {
        mot: 'Guerres médiques',
        sens: 'Les guerres entre les Grecs et les Perses, appelés Mèdes par les Grecs, de 490 à 479 av. J.-C.',
      },
    ],
    lies: ['leonidas', 'bataille-de-marathon', 'toutankhamon', 'homere', 'pericles'],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Halicarnasse',
      'Enquête',
      'historia',
      'guerres médiques',
      'Perses',
      'Égypte',
      'Nil',
      'Thermopyles',
      'sources',
      'premier historien',
      'Thourioi',
    ],
  },
  {
    id: 'sophocle',
    volet: 'personnages',
    nom: 'Sophocle',
    surnom: 'le poète d’Antigone',
    dates: 'vers 496 – 406 av. J.-C.',
    tri: -406,
    periode: 'antiquite',
    emoji: '🎭',
    roles: ['Auteur de tragédies', 'Citoyen d’Athènes', 'Stratège'],
    origine: 'Colone, près d’Athènes',
    accroche:
      'Cent vingt-trois pièces, sept conservées — dont *Antigone*, où une jeune fille oppose à l’ordre du roi une loi que personne n’a écrite.',
    citations: [
      {
        texte: 'Je ne suis pas née pour partager la haine, mais pour partager l’amour.',
        qui: 'Antigone',
        contexte:
          '*Antigone*, vers 523. Elle répond au roi Créon, qui lui reproche d’avoir enterré son frère, mort les armes à la main contre la cité.',
        sens:
          'Antigone ne conteste pas que son frère ait attaqué Thèbes : elle dit qu’un mort est un mort, et qu’on doit à un frère une sépulture.',
      },
      {
        texte:
          'Ces lois-là ne datent ni d’aujourd’hui ni d’hier : elles sont de toujours, et personne ne sait le jour où elles sont nées.',
        qui: 'Antigone',
        contexte: '*Antigone*, vers 456, devant Créon qui lui demande si elle connaissait son édit.',
        sens:
          'Elle oppose à la loi écrite du roi des règles non écrites, plus anciennes que lui. C’est la scène la plus discutée du théâtre grec.',
      },
      {
        texte:
          'Il y a bien des merveilles en ce monde ; il n’en est pas de plus grande que l’homme.',
        qui: 'Le chœur',
        contexte:
          '*Antigone*, vers 332 : le chœur énumère ce que l’homme a inventé — la navigation, le labour, la parole, les lois — et ce qu’il ne vaincra jamais : la mort.',
      },
    ],
    reperes: [
      'Né vers 496 av. J.-C. à Colone, aux portes d’Athènes, dans une famille riche.',
      'À seize ans, il conduit le chœur qui chante la victoire grecque de Salamine, en 480 av. J.-C.',
      'Première victoire au concours des Grandes Dionysies en 468 av. J.-C., devant Eschyle.',
      'Cent vingt-trois pièces écrites, sept conservées, dont *Antigone* et *Œdipe roi*.',
      'Il porte le nombre d’acteurs de deux à trois : les personnages peuvent enfin se répondre.',
      'Citoyen actif d’Athènes, il est trésorier en 443 puis stratège aux côtés de Périclès.',
    ],
    recit: [
      {
        titre: 'Le théâtre est une affaire de cité',
        texte:
          'À Athènes, on ne va pas au théâtre le soir quand on veut : on y va une fois par an, tous ensemble, pendant les **Grandes Dionysies**, la grande fête du dieu **Dionysos**, en mars. Les tribunaux ferment, les prisonniers sont libérés pour la durée de la fête. Sur le flanc de l’Acropole, le théâtre de Dionysos peut contenir **quatorze mille** spectateurs assis sur des gradins de pierre. Trois auteurs sont choisis par un magistrat ; chacun présente trois tragédies et une pièce comique, du lever du jour au soir. Un citoyen riche, le **chorège**, paie les costumes et l’entraînement du chœur — c’est un impôt et un honneur. À la fin, un jury de dix citoyens **tirés au sort** désigne le vainqueur. Tout y est politique : la cité se regarde elle-même.',
      },
      {
        titre: 'Cinquante ans de concours',
        texte:
          'Sophocle a seize ans à **Salamine**, quatre-vingt-dix à sa mort : il traverse tout le siècle de Périclès, la construction du **Parthénon**, la peste, la guerre du Péloponnèse. Il remporte son premier concours en **468 av. J.-C.**, contre **Eschyle**, le maître en titre. Il gagnera dix-huit fois et ne sera, dit-on, **jamais classé dernier**. Ses inventions techniques ont changé le théâtre : un **troisième acteur** sur la scène — donc de vraies confrontations à trois —, un chœur porté de douze à quinze chanteurs, des décors peints. Et il n’est pas un artiste à l’écart : trésorier de la ligue de Délos en 443, **stratège** élu avec Périclès vers 441, il siège encore dans une commission d’urgence à quatre-vingts ans passés.',
      },
      {
        titre: 'Antigone : la loi du roi contre la loi des dieux',
        texte:
          'Deux frères se sont entretués sous les murs de **Thèbes** : l’un défendait la ville, l’autre l’attaquait. Le nouveau roi, **Créon**, décrète que le traître restera sans sépulture, jeté aux chiens, et que quiconque l’enterrera sera mis à mort. Leur sœur **Antigone** le recouvre de terre, en plein jour, et revendique son geste. Créon la fait emmurer vivante. Elle se pend ; son fiancé Hémon, fils de Créon, se tue sur son corps ; la mère d’Hémon se tue à son tour. Le roi reste seul avec son édit. Sophocle ne donne raison à personne : Créon défend l’ordre de la cité, Antigone une obligation plus ancienne. C’est pour cela que la pièce n’a jamais cessé d’être jouée — on l’a redonnée dans Paris occupé, en 1944.',
      },
      {
        titre: 'Œdipe roi : l’enquête qui se retourne',
        texte:
          'La peste ravage Thèbes. L’oracle répond que le fléau cessera quand on aura chassé l’assassin du roi précédent, **Laïos**. **Œdipe**, le roi actuel, mène l’enquête avec méthode : témoins, contradictions, recoupements. Acte après acte, il découvre que l’assassin, c’est lui — et que l’homme qu’il a tué à un carrefour était son père, et que la reine qu’il a épousée est sa mère. Jocaste se pend ; Œdipe se crève les yeux et part sur les routes. **Aristote** en a fait, dans sa *Poétique*, le modèle de toutes les tragédies : le héros court à sa perte en faisant exactement ce qu’il faut faire. Vingt-trois siècles plus tard, **Freud** donnera le nom d’Œdipe à l’un de ses concepts, et le personnage entrera dans la langue courante.',
      },
    ],
    chrono: [
      { date: 'vers 496 av. J.-C.', fait: 'Naissance à Colone, près d’Athènes.' },
      { date: '480 av. J.-C.', fait: 'À seize ans, il conduit le chœur de la victoire de Salamine.' },
      { date: '468 av. J.-C.', fait: 'Première victoire aux Grandes Dionysies, devant Eschyle.' },
      { date: '443 av. J.-C.', fait: 'Trésorier de la ligue de Délos.' },
      { date: 'vers 441 av. J.-C.', fait: '*Antigone* ; il est élu stratège avec Périclès.' },
      { date: 'vers 429 av. J.-C.', fait: '*Œdipe roi*, au temps de la peste d’Athènes.' },
      { date: '406 av. J.-C.', fait: 'Mort à Athènes, vers quatre-vingt-dix ans.' },
      { date: '401 av. J.-C.', fait: '*Œdipe à Colone* est joué cinq ans après sa mort.' },
    ],
    leSaisTu:
      'Cicéron raconte que les fils de Sophocle, très vieux, l’accusèrent en justice d’avoir perdu la tête pour lui prendre la gestion de ses biens. Le poète se présenta devant les juges, lut la pièce qu’il venait d’écrire — *Œdipe à Colone* — et demanda si c’était là l’ouvrage d’un homme qui déraisonne. Il fut acquitté, et ses fils raccompagnés.',
    aRetenir: [
      'Sophocle (vers 496-406 av. J.-C.) est l’un des trois grands auteurs de tragédies grecques, avec Eschyle et Euripide.',
      'Sur cent vingt-trois pièces, sept nous sont parvenues, dont *Antigone* et *Œdipe roi*.',
      'Les pièces étaient jouées lors d’un concours, les Grandes Dionysies, devant toute la cité réunie.',
      'Il ajoute un troisième acteur sur la scène et porte le chœur à quinze chanteurs.',
      'Dans *Antigone*, l’héroïne oppose des lois non écrites à l’édit du roi Créon.',
    ],
    mots: [
      {
        mot: 'Tragédie',
        sens: 'Pièce où un personnage court à sa perte, jouée par des acteurs masqués devant un chœur qui chante et commente.',
      },
      {
        mot: 'Chœur',
        sens: 'Groupe de chanteurs-danseurs, quinze chez Sophocle, qui commentent l’action et parlent au nom de la cité.',
      },
      {
        mot: 'Chorège',
        sens: 'Citoyen riche chargé de payer le chœur d’une pièce : une dépense obligatoire et un honneur public.',
      },
      {
        mot: 'Dionysies',
        sens: 'Fêtes du dieu Dionysos, où les concours de tragédies rassemblaient la cité entière pendant plusieurs jours.',
      },
    ],
    lies: ['homere', 'pericles', 'socrate', 'democratie-athenienne'],
    niveaux: ['6e'],
    programme: 'La cité des Athéniens (Vᵉ siècle av. J.-C.) : citoyenneté et démocratie',
    tags: [
      'Athènes',
      'tragédie',
      'Antigone',
      'Œdipe roi',
      'Dionysies',
      'théâtre grec',
      'chœur',
      'Créon',
      'Eschyle',
      'Colone',
    ],
  },
  {
    id: 'hippocrate',
    volet: 'personnages',
    nom: 'Hippocrate',
    surnom: 'le père de la médecine',
    dates: 'vers 460 – 377 av. J.-C.',
    tri: -377,
    periode: 'antiquite',
    emoji: '⚕️',
    roles: ['Médecin grec', 'Maître de l’école de Cos'],
    origine: 'Île de Cos, mer Égée',
    accroche:
      'Le premier à dire qu’une maladie a une cause dans le corps, et non dans la colère d’un dieu : la médecine cesse d’être de la magie.',
    citations: [
      {
        texte:
          'La vie est courte, l’art est long, l’occasion fugitive, l’expérience trompeuse, le jugement difficile.',
        contexte: 'Premier des *Aphorismes*, le recueil le plus lu de la Collection hippocratique.',
        sens:
          '« L’art », ici, c’est la médecine : une vie entière ne suffit pas à l’apprendre, le bon moment passe vite, et l’expérience peut induire en erreur.',
      },
      {
        texte:
          'Cette maladie ne me paraît en rien plus divine ni plus sacrée que les autres : elle a, comme elles, une cause naturelle.',
        contexte:
          'Traité *De la maladie sacrée*, à propos de l’épilepsie, que l’on tenait pour une possession envoyée par les dieux.',
        sens:
          'La phrase qui fait basculer la médecine : si une maladie a une cause dans le corps, on peut la chercher, la comprendre et parfois la soigner.',
      },
      {
        texte:
          'Dans quelque maison que j’entre, j’y entrerai pour l’utilité des malades ; et ce que je verrai, je le tairai, tenant ces choses pour un secret.',
        contexte: 'Extrait du Serment, prêté par les élèves de l’école avant d’exercer.',
        sens:
          'Le secret médical et le devoir de ne pas nuire naissent ici, quatre siècles avant notre ère, et sont toujours dans la loi française.',
      },
      {
        texte: 'Que ton aliment soit ton médicament.',
        contexte:
          'Phrase prêtée à Hippocrate dans le monde entier. On ne la trouve nulle part dans la Collection hippocratique : elle est très postérieure.',
        sens:
          'L’école de Cos soignait pourtant beaucoup par le régime alimentaire — d’où le succès d’une formule qu’aucun texte ancien ne contient.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né vers 460 av. J.-C. dans l’île de Cos, dans une famille de médecins, les Asclépiades.',
      'La Collection hippocratique réunit une soixantaine de traités, écrits par plusieurs mains sur un siècle.',
      'Il cherche la cause des maladies dans le corps, la nourriture, l’eau et le climat, jamais chez les dieux.',
      'Il observe le malade jour après jour, note tout, et annonce la suite : c’est le pronostic.',
      'La théorie des quatre humeurs — sang, phlegme, bile jaune, bile noire — est fausse et a tenu deux mille ans.',
      'Le Serment d’Hippocrate, réécrit, est encore prêté par les médecins français aujourd’hui.',
    ],
    recit: [
      {
        titre: 'Une île, un sanctuaire, une école',
        texte:
          'Quand un Grec tombe malade, il va dormir dans un sanctuaire d’**Asclépios**, le dieu guérisseur : le dieu est censé venir en rêve indiquer le remède. À **Cos**, une petite île en face de l’Asie Mineure, il existe un tel sanctuaire — et, à côté, une famille de médecins qui fait tout autrement. Hippocrate y naît vers 460 av. J.-C., contemporain exact de **Socrate**. Il enseigne, voyage en Thessalie et jusqu’en Thrace, et se fait payer ses leçons : **Platon** le cite déjà comme *le* maître à qui l’on va apprendre la médecine. Ses élèves ne demandent rien aux dieux ; ils s’assoient au chevet du malade, regardent son teint, sa respiration, sa transpiration, ce qu’il mange, l’eau qu’il boit et l’air qu’il respire.',
      },
      {
        titre: 'La maladie sort du sacré',
        texte:
          'Le traité *De la maladie sacrée* est le texte décisif. L’**épilepsie**, avec ses crises spectaculaires, passait pour une possession divine. L’auteur hippocratique démonte l’idée point par point : pourquoi les dieux frapperaient-ils certains et pas d’autres ? pourquoi les crises reviennent-elles selon les saisons ? pourquoi les remèdes agissent-ils ? Sa conclusion est nette : le mal vient du **cerveau**. On l’appelle sacrée, écrit-il, parce qu’on ne la comprend pas — et ceux qui prétendent la guérir par des purifications sont des charlatans qui couvrent leur ignorance. Le raisonnement vaut bien au-delà de l’épilepsie : il pose que le monde a des causes qu’on peut chercher.',
      },
      {
        titre: 'Regarder, noter, prévoir',
        texte:
          'Les sept livres des *Épidémies* contiennent des dizaines de **fiches de malades**, nommés, suivis jour par jour : « Le quatrième jour, fièvre, urines troubles ; le septième, sueur ; le neuvième, il mourut. » Beaucoup finissent par une mort, et les médecins de Cos ne la cachent pas — noter les échecs est déjà une méthode. De cette masse d’observations ils tirent un savoir nouveau : le **pronostic**, l’art d’annoncer l’évolution d’une maladie. Leurs traitements, eux, sont prudents : repos, régime, eau, air, exercice, et le principe posé dans les *Épidémies* — **« être utile, ou du moins ne pas nuire »**. À une époque sans anesthésie ni microbes connus, s’abstenir sauvait souvent plus que d’agir.',
      },
      {
        titre: 'Les quatre humeurs, et le Serment',
        texte:
          'Leur explication du corps, elle, est fausse : la santé serait l’équilibre de **quatre humeurs** — sang, phlegme, bile jaune, bile noire —, la maladie leur déséquilibre. Reprise par **Galien** à Rome, cette théorie a régné sur la médecine européenne jusqu’au XVIIIᵉ siècle et justifié des siècles de saignées. Ce qui a survécu, c’est autre chose : la **méthode**, et le **Serment**. Ne pas donner de poison, ne pas abuser de la confiance des familles, taire ce qu’on apprend chez les malades, transmettre son savoir. C’est un texte de son temps — il interdit aussi des pratiques qu’on lit aujourd’hui autrement —, mais l’idée qu’un médecin s’engage publiquement avant d’exercer est née là, et elle tient toujours.',
      },
    ],
    chrono: [
      { date: 'vers 460 av. J.-C.', fait: 'Naissance dans l’île de Cos, chez les Asclépiades.' },
      { date: 'vers 430 av. J.-C.', fait: 'La peste ravage Athènes pendant la guerre du Péloponnèse.' },
      { date: 'vers 425 av. J.-C.', fait: 'Platon le cite comme le maître de la médecine.' },
      { date: 'vers 410 av. J.-C.', fait: '*De la maladie sacrée* : l’épilepsie vient du cerveau.' },
      { date: 'IVᵉ siècle av. J.-C.', fait: 'Rédaction du Serment et des *Aphorismes* par son école.' },
      { date: 'vers 377 av. J.-C.', fait: 'Mort à Larissa, en Thessalie, très âgé.' },
      { date: 'IIᵉ siècle apr. J.-C.', fait: 'Galien reprend les humeurs : elles régneront 1 500 ans.' },
    ],
    leSaisTu:
      'On montre encore à Cos le platane sous lequel Hippocrate aurait enseigné. L’arbre actuel n’a « que » cinq siècles environ — c’est sans doute un descendant du premier. Des boutures en ont été envoyées à des facultés de médecine du monde entier, si bien que des « platanes d’Hippocrate » poussent aujourd’hui sur plusieurs continents.',
    aRetenir: [
      'Hippocrate (vers 460-377 av. J.-C.), né dans l’île de Cos, est considéré comme le fondateur de la médecine.',
      'Il cherche des causes naturelles aux maladies au lieu d’y voir une punition ou une possession divine.',
      'La Collection hippocratique rassemble une soixantaine de traités écrits par son école.',
      'Le Serment fixe les devoirs du médecin : ne pas nuire, garder le secret, ne pas abuser de la confiance.',
      'La théorie des quatre humeurs, fausse, a dominé la médecine européenne jusqu’au XVIIIᵉ siècle.',
    ],
    mots: [
      {
        mot: 'Pronostic',
        sens: 'Annonce de l’évolution probable d’une maladie, faite à partir de l’observation du malade.',
      },
      {
        mot: 'Humeurs',
        sens: 'Les quatre liquides du corps selon les Grecs : sang, phlegme, bile jaune, bile noire. Leur équilibre ferait la santé.',
      },
      {
        mot: 'Épidémie',
        sens: 'Maladie qui frappe beaucoup de gens au même endroit et au même moment.',
      },
    ],
    lies: ['socrate', 'platon', 'aristote', 'pericles'],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Cos',
      'médecine',
      'serment',
      'épilepsie',
      'humeurs',
      'pronostic',
      'Asclépios',
      'aphorismes',
      'secret médical',
      'Galien',
    ],
  },
  {
    id: 'ciceron',
    volet: 'personnages',
    nom: 'Cicéron',
    surnom: 'la voix de la République',
    dates: '106 – 43 av. J.-C.',
    tri: -43,
    periode: 'antiquite',
    emoji: '🗣️',
    roles: ['Avocat', 'Consul de Rome', 'Écrivain latin'],
    origine: 'Arpinum, Latium',
    accroche:
      'Le plus grand orateur de Rome : sans ancêtres ni armée, il est monté au consulat par sa seule parole — et il en est mort.',
    citations: [
      {
        texte: 'Jusques à quand, Catilina, abuseras-tu de notre patience ?',
        contexte:
          'Ouverture de la première *Catilinaire*, devant le Sénat réuni au temple de Jupiter Stator, le 8 novembre 63 av. J.-C. En latin : *Quousque tandem abutere, Catilina, patientia nostra ?*',
        sens:
          'Cicéron, consul, dénonce un complot devant les sénateurs — et devant le conjuré lui-même, assis dans la salle, que personne ne vient saluer. Catilina quitte Rome la nuit suivante.',
      },
      {
        texte: 'Ô temps ! Ô mœurs !',
        contexte:
          'Même discours, quelques lignes plus loin. En latin : *O tempora, o mores !*',
        sens:
          'Le Sénat sait, le consul sait, et l’homme qui prépare le massacre est là, vivant, au milieu d’eux : voilà ce que Cicéron reproche à son époque.',
      },
      {
        texte: 'Que les armes le cèdent à la toge.',
        contexte:
          'Vers d’un poème que Cicéron avait écrit sur son propre consulat. En latin : *Cedant arma togae*.',
        sens:
          'La toge est l’habit du citoyen : le pouvoir civil doit passer avant le pouvoir militaire. C’est tout son programme — et c’est exactement ce que le siècle allait lui refuser.',
      },
      {
        texte: 'Que le salut du peuple soit la loi suprême.',
        contexte: '*Des lois*, livre III. En latin : *Salus populi suprema lex esto*.',
        sens:
          'La formule a servi depuis à tout justifier, mais elle dit d’abord que les lois existent pour le peuple, et non le peuple pour les lois.',
      },
    ],
    reperes: [
      'Né en 106 av. J.-C. à Arpinum, hors de la noblesse romaine : il est un « homme nouveau ».',
      'Avocat célèbre dès 70 av. J.-C., quand il fait condamner Verrès, gouverneur pillard de la Sicile.',
      'Consul en 63 av. J.-C. : il déjoue la conjuration de Catilina et fait exécuter cinq conjurés.',
      'Exilé en 58 pour ces exécutions sans jugement, il est rappelé triomphalement l’année suivante.',
      'Il écrit en latin la philosophie qu’on n’écrivait qu’en grec, et laisse près de 900 lettres.',
      'Proscrit par Antoine et Octave, il est tué le 7 décembre 43 av. J.-C.',
    ],
    recit: [
      {
        titre: 'Un homme nouveau',
        texte:
          'À Rome, les magistratures se transmettent dans quelques dizaines de familles. Cicéron n’en fait pas partie : il naît à **Arpinum**, à cent kilomètres de Rome, dans une famille de notables de province. On appelle **homme nouveau** celui qui entre au Sénat sans ancêtre l’y ayant précédé — ils sont rarissimes. Sa seule arme est la parole, et il l’a travaillée comme un athlète : études de droit à Rome, entraînement à Athènes et à Rhodes, où il corrige jusqu’à sa respiration. En **70 av. J.-C.**, il accepte de poursuivre **Verrès**, gouverneur de Sicile accusé d’avoir pillé la province pendant trois ans. Il part y recueillir des preuves, revient en cinquante jours avec un dossier écrasant : Verrès s’exile avant la fin du procès. Cicéron est le premier avocat de Rome.',
      },
      {
        titre: 'L’année du consulat',
        texte:
          'En **63 av. J.-C.**, il est élu **consul** — la plus haute charge, deux titulaires, un an — au premier âge légal. Un noble ruiné, **Catilina**, deux fois battu aux élections, prépare alors un coup de force : incendier Rome, tuer les magistrats, annuler les dettes. Prévenu par des indiscrétions, Cicéron convoque le Sénat le **8 novembre** et prononce contre lui le discours le plus célèbre de la langue latine. Catilina s’enfuit. Restent cinq complices arrêtés à Rome avec des lettres compromettantes. Le Sénat débat : **César** plaide la prison à vie, **Caton** la mort. Cicéron fait exécuter les cinq hommes dans la prison du Forum, puis annonce la chose à la foule en un seul mot : « *Vixerunt* » — « Ils ont vécu. » Le Sénat le proclame **père de la patrie**.',
      },
      {
        titre: 'La République qui s’en va',
        texte:
          'Ces exécutions sans procès, décidées contre des citoyens romains, vont le poursuivre. En **58 av. J.-C.**, un tribun lui fait voter l’**exil** ; sa maison est rasée. Rappelé dès l’année suivante, il retrouve une République déjà confisquée : **César**, **Pompée** et **Crassus** se sont partagé le pouvoir réel. Cicéron manœuvre, plaide, se tait quand il le faut. Quand la guerre civile éclate, il choisit Pompée, perd avec lui à **Pharsale** en 48, et obtient le pardon de César. Écarté de la vie publique, veuf de sa fille **Tullia**, morte en 45, il se jette dans l’écriture : *De la République*, *Des devoirs*, *De l’amitié*, *De la vieillesse*. Il invente au passage les mots latins qui diront la philosophie grecque — et qui donneront les nôtres.',
      },
      {
        titre: 'Les Philippiques, et la fin',
        texte:
          'Aux **ides de mars 44**, César est assassiné. Cicéron, qui n’était pas dans le complot, salue le geste et croit la République sauvée. Il se trompe deux fois : il sous-estime **Antoine**, qu’il attaque dans quatorze discours d’une violence inouïe — les ***Philippiques*** —, et il croit pouvoir manœuvrer le jeune héritier de César, **Octave**, âgé de dix-neuf ans. En novembre 43, Octave, Antoine et Lépide s’accordent : ils dressent une liste de proscrits, condamnés à mort avec prime au dénonciateur. Antoine exige la tête de Cicéron. Rattrapé près de **Formies** le **7 décembre 43 av. J.-C.**, il tend le cou hors de sa litière. Sa tête et ses mains sont clouées à la tribune du Forum, là où il avait tant parlé.',
      },
    ],
    chrono: [
      { date: '106 av. J.-C.', fait: 'Naissance à Arpinum, au sud-est de Rome.' },
      { date: '70 av. J.-C.', fait: 'Procès de Verrès : sa réputation d’avocat est faite.' },
      { date: '63 av. J.-C.', fait: 'Consul : les *Catilinaires* et l’exécution des conjurés.' },
      { date: '58 av. J.-C.', fait: 'Exil, pour avoir fait mettre à mort des citoyens sans jugement.' },
      { date: '57 av. J.-C.', fait: 'Retour triomphal à Rome.' },
      { date: '48 av. J.-C.', fait: 'Pharsale : il avait choisi Pompée, César lui pardonne.' },
      { date: '44 av. J.-C.', fait: 'Assassinat de César ; Cicéron attaque Antoine dans les *Philippiques*.' },
      { date: '7 décembre 43 av. J.-C.', fait: 'Proscrit, il est tué près de Formies.' },
    ],
    leSaisTu:
      'Bien des années plus tard, raconte Plutarque, Auguste surprit l’un de ses petits-fils en train de lire un livre de Cicéron. L’enfant, effrayé, cacha le rouleau sous sa toge. L’empereur le prit, en lut une longue partie debout, puis le lui rendit en disant : « Un homme savant, mon enfant, savant, et qui aimait sa patrie. » C’est Auguste qui l’avait laissé proscrire.',
    aRetenir: [
      'Cicéron (106-43 av. J.-C.) est le plus grand orateur romain et l’un des derniers défenseurs de la République.',
      'Consul en 63 av. J.-C., il déjoue la conjuration de Catilina par ses quatre discours, les *Catilinaires*.',
      'Il fait exécuter cinq conjurés sans jugement, ce qui lui vaudra l’exil en 58 av. J.-C.',
      'Après la mort de César, il attaque Antoine dans les *Philippiques* et est assassiné le 7 décembre 43 av. J.-C.',
      'Ses discours, ses traités et ses lettres ont fait du latin une langue de pensée et de droit.',
    ],
    mots: [
      {
        mot: 'Consul',
        sens: 'Le plus haut magistrat de la République romaine : ils sont deux, élus pour un an, et se surveillent l’un l’autre.',
      },
      {
        mot: 'Orateur',
        sens: 'Celui qui parle en public pour convaincre : au tribunal, au Sénat ou devant le peuple.',
      },
      {
        mot: 'Proscription',
        sens: 'Liste d’hommes déclarés hors la loi : les tuer est permis, et leurs biens reviennent au dénonciateur.',
      },
      {
        mot: 'République',
        sens: '*Res publica*, « la chose publique » : à Rome, un régime où des magistrats élus gouvernent, sans roi.',
      },
    ],
    lies: ['jules-cesar', 'auguste', 'cleopatre', 'herodote'],
    niveaux: ['6e'],
    programme: 'Rome du mythe à l’histoire',
    tags: [
      'Rome',
      'République romaine',
      'Catilina',
      'Catilinaires',
      'consul',
      'orateur',
      'Sénat',
      'Antoine',
      'proscription',
      'Philippiques',
      'latin',
    ],
  },
]
