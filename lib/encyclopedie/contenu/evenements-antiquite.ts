// -----------------------------------------------------------------------------
// ANTIQUITÉ — LES NEUF ÉVÉNEMENTS. De la première tablette d'argile au dernier
// empereur d'Occident : quatre mille ans en neuf fiches, celles que la 6e
// croise toutes.
//
// Même contrat que le lot modèle (`evenements-revolution-causes.ts`), trois
// colonnes toujours dans le même ordre : POURQUOI (`causes`) → CE QUI SE PASSE
// (`recit`) → CE QUE ÇA CHANGE (`consequences`).
//
// Deux précautions propres à cette période. D'abord LES CHIFFRES ANTIQUES : un
// million de morts en Gaule chez Plutarque, 6 400 Perses à Marathon chez
// Hérodote, ce sont des chiffres d'auteurs anciens, pas des recensements — la
// fiche les donne en le disant. Ensuite LES PHRASES DE LÉGENDE : « Vae
// victis ! », « Nous avons vaincu ! », « Par ce signe tu vaincras » sont
// rapportées des siècles après, parfois par un seul auteur. Elles restent —
// elles font partie de la culture commune — mais elles portent `incertaine` et
// la fiche explique pourquoi. Faire répéter une phrase inventée en la donnant
// pour vraie, c'est apprendre une faute.
//
// Les fiches du christianisme et de l'édit de Milan suivent le § 3 du guide :
// factuelles, respectueuses, sans ironie ni ton de démystification.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_ANTIQUITE: Evenement[] = [
  {
    id: 'naissance-de-l-ecriture',
    volet: 'evenements',
    nom: 'La naissance de l’écriture',
    date: 'vers 3300 av. J.-C.',
    tri: -3300,
    periode: 'antiquite',
    emoji: '📜',
    lieu: 'Sumer, en basse Mésopotamie (Irak actuel)',
    accroche:
      'Pour compter des sacs d’orge, des comptables sumériens inventent le signe qui remplace la chose — et l’humanité entre dans l’histoire.',
    citations: [
      {
        texte: 'Sois scribe ! Cela te délivre du labeur et te protège de tout travail.',
        qui: 'Khéty, scribe égyptien',
        contexte:
          'Dans *La Satire des métiers*, vers 2000 av. J.-C. : un père conduit son fils Pépy à l’école des scribes et lui énumère la dureté des autres métiers.',
        sens:
          'Savoir écrire, c’est échapper aux champs et aux chantiers. Le scribe n’est pas un savant rêveur : c’est le métier qui monte.',
      },
      {
        texte: 'Un scribe dont la main suit la bouche, celui-là est un vrai scribe.',
        qui: 'Un maître d’école sumérien',
        contexte:
          'Proverbe recopié par les élèves de l’é-doubba, la maison des tablettes, à Nippour vers 1800 av. J.-C.',
        sens:
          'Écrire aussi vite qu’on parle : l’exercice d’école d’il y a trente-huit siècles est déjà celui de la dictée.',
      },
      {
        texte: 'Je tiens l’affaire !',
        qui: 'Jean-François Champollion',
        contexte:
          'Le 14 septembre 1822, en entrant chez son frère rue Mazarine, après avoir compris le système des hiéroglyphes — puis il s’évanouit.',
        sens:
          'La scène est racontée par son frère Jacques-Joseph, seul témoin : la formule exacte n’est donc pas garantie.',
        incertaine: true,
      },
    ],
    reperes: [
      'Vers 3300 av. J.-C., à Ourouk : les plus anciennes tablettes connues sont des comptes de grain et de bétail.',
      'L’écriture naît deux fois de suite : le cunéiforme en Mésopotamie, les hiéroglyphes en Égypte vers 3200 av. J.-C.',
      'Un roseau taillé imprime des coins dans l’argile fraîche — *cuneus* en latin, d’où le mot cunéiforme.',
      'On écrit d’abord des quantités, puis des contrats, des lois, des prières, et enfin des récits.',
      'Les Phéniciens réduisent le système à 22 signes : c’est l’ancêtre de notre alphabet.',
      'Pour les historiens, l’apparition de l’écriture sépare la Préhistoire de l’Histoire.',
    ],
    causes: [
      'Des villes de plusieurs milliers d’habitants, comme Ourouk, où il faut nourrir des gens qui ne cultivent pas.',
      'Des temples qui ramassent les récoltes et les redistribuent : sans registre, impossible de savoir qui a donné quoi.',
      'Un commerce à longue distance — le bois, le cuivre et la pierre manquent en Mésopotamie et s’achètent au loin.',
      'La mémoire d’un homme, qui ne suffit plus quand les échanges portent sur des centaines de sacs et des dizaines d’années.',
      'Un système plus ancien de jetons d’argile enfermés dans des boules creuses : l’écriture n’en est que la simplification.',
      'Des pouvoirs qui se construisent — roi, prêtre, percepteur — et qui ont besoin de traces que personne ne puisse contester.',
    ],
    recit: [
      {
        titre: 'Des cailloux dans une boule d’argile',
        texte:
          'Bien avant les tablettes, le Proche-Orient compte avec des **jetons d’argile** : un cône pour une petite mesure de grain, une bille pour une grande, un disque pour une brebis. Pour garantir une livraison, on enferme les jetons dans une **boule creuse** scellée, et on imprime sur la surface la forme de ce qu’elle contient. Puis quelqu’un s’aperçoit que, l’empreinte disant déjà tout, les jetons à l’intérieur ne servent plus à rien. On aplatit la boule : c’est une **tablette**. L’écriture ne descend pas du ciel et ne sort pas de la tête d’un génie — elle sort d’un problème de comptabilité résolu pas à pas, pendant des siècles.',
      },
      {
        titre: 'Ourouk, vers 3300 av. J.-C.',
        texte:
          'Les plus anciens textes connus viennent d’**Ourouk**, une ville sumérienne de peut-être 40 000 habitants, la plus grande du monde à cette date. Ce ne sont ni des poèmes ni des prières : ce sont des **comptes**. Tant de mesures d’orge, tant de têtes de bétail, tant de jours de travail, avec le nom du responsable. On grave au **calame**, un roseau taillé, dans une tablette d’argile encore molle, qu’on laisse ensuite sécher au soleil. L’argile est partout en Mésopotamie, elle ne coûte rien, et elle a un défaut merveilleux pour nous : quand un incendie ravage un palais, il **cuit les archives** au lieu de les détruire. C’est à des catastrophes que nous devons des centaines de milliers de tablettes.',
      },
      {
        titre: 'Du dessin au son',
        texte:
          'Au début, un signe égale une chose : une tête de bœuf pour le bœuf, un épi pour l’orge. Ce système sait noter un inventaire, pas une phrase — et surtout pas un nom propre. La trouvaille décisive est le **rébus** : on se met à utiliser le dessin pour le **son** du mot, et non plus pour la chose. En français, ce serait dessiner un *pot* et un *rat* pour écrire « Pothra ». Dès lors, on peut tout écrire : les verbes, les noms, les sentiments, la négation. Vers 2600 av. J.-C., le cunéiforme note des phrases complètes et servira pendant trois mille ans à quinze langues différentes, dont l’akkadien, la langue diplomatique de tout le Proche-Orient.',
      },
      {
        titre: 'L’Égypte, presque en même temps',
        texte:
          'Vers **3200 av. J.-C.**, à quinze cents kilomètres de là, l’Égypte se dote de ses **hiéroglyphes** — « les signes sacrés », en grec. Le système est cousin dans son principe (dessins, sons, déterminatifs) mais autre dans son usage : on le grave sur la pierre des temples et des tombeaux, pour l’éternité, et on l’écrit à l’encre sur le **papyrus**, une feuille faite de tiges de roseau collées, pour les affaires courantes. Les Égyptiens y ajouteront deux écritures rapides, le hiératique puis le démotique. Le dernier hiéroglyphe daté est gravé en **394 apr. J.-C.** ; ensuite, plus personne ne sait les lire — pendant **1 428 ans**, jusqu’à Champollion.',
      },
      {
        titre: 'Ce que l’écriture change',
        texte:
          'Elle change d’abord le **pouvoir** : une loi écrite s’applique aux absents et survit à celui qui l’a dictée. Vers 1750 av. J.-C., **Hammourabi** fait graver son code sur une stèle de basalte de plus de deux mètres, dressée en public : chacun peut aller y vérifier son droit. Elle change ensuite la **mémoire** : l’*Épopée de Gilgamesh*, la plus vieille grande œuvre littéraire du monde, nous arrive parce qu’un roi assyrien l’avait fait copier dans sa bibliothèque. Elle change enfin l’**école** : il faut des années pour apprendre mille signes, donc des maîtres, des devoirs et des élèves qui se plaignent — on a retrouvé leurs tablettes d’exercices, avec les corrections du maître dans la marge.',
      },
    ],
    consequences: [
      'Les États peuvent tenir des comptes, lever des impôts et écrire des lois qui survivent à leur auteur.',
      'La Préhistoire s’achève : les historiens disposent enfin de textes et non plus seulement d’objets.',
      'Un nouveau métier, puissant et respecté, apparaît : le scribe, qui sait ce que les autres ignorent.',
      'La littérature devient possible : l’*Épopée de Gilgamesh* est copiée pendant près de deux mille ans.',
      'Les Phéniciens simplifient le système en 22 signes ; les Grecs y ajoutent les voyelles vers 800 av. J.-C.',
      'Notre alphabet latin descend en ligne directe de cette chaîne : Sumer, Phénicie, Grèce, Rome.',
    ],
    chiffres: [
      { valeur: '1 000', quoi: 'signes différents dans le premier cunéiforme' },
      { valeur: '22', quoi: 'signes suffisent à l’alphabet phénicien' },
      { valeur: '500 000', quoi: 'tablettes d’argile déjà retrouvées au Proche-Orient' },
      { valeur: '1 428 ans', quoi: 'sans savoir lire les hiéroglyphes, de 394 à 1822' },
    ],
    chrono: [
      { date: 'vers 8000 av. J.-C.', fait: 'Des jetons d’argile pour compter les biens.' },
      { date: 'vers 3300 av. J.-C.', fait: 'Premières tablettes comptables à Ourouk.' },
      { date: 'vers 3200 av. J.-C.', fait: 'Premiers hiéroglyphes en Égypte.' },
      { date: 'vers 2600 av. J.-C.', fait: 'Le cunéiforme note des phrases entières.' },
      { date: 'vers 2300 av. J.-C.', fait: 'Enheduanna signe ses hymnes : premier auteur connu.' },
      { date: 'vers 1750 av. J.-C.', fait: 'Le code d’Hammourabi gravé sur une stèle.' },
      { date: 'vers 1300 av. J.-C.', fait: 'L’alphabet phénicien : 22 signes seulement.' },
      { date: 'vers 800 av. J.-C.', fait: 'Les Grecs ajoutent les voyelles.' },
      { date: '1822', fait: 'Champollion déchiffre les hiéroglyphes.' },
    ],
    leSaisTu:
      'Le premier auteur de l’histoire dont on connaisse le nom est une femme. **Enheduanna**, fille du roi Sargon d’Akkad et grande prêtresse de la lune à Our vers 2300 av. J.-C., signe ses hymnes et y parle d’elle à la première personne — mille ans avant Homère.',
    aRetenir: [
      'L’écriture apparaît vers 3300 av. J.-C. à Sumer, en Mésopotamie, pour tenir des comptes.',
      'Les signes sont imprimés au roseau dans l’argile : on les appelle cunéiformes.',
      'L’Égypte invente ses hiéroglyphes vers 3200 av. J.-C., gravés sur pierre et écrits sur papyrus.',
      'Les Phéniciens réduisent l’écriture à 22 signes : c’est l’ancêtre de notre alphabet.',
      'Pour les historiens, l’apparition de l’écriture marque la fin de la Préhistoire.',
    ],
    mots: [
      {
        mot: 'Cunéiforme',
        sens: 'Écriture faite de petits coins imprimés dans l’argile avec un roseau taillé.',
      },
      {
        mot: 'Hiéroglyphe',
        sens: 'Signe de l’écriture égyptienne ; le mot grec veut dire « gravure sacrée ».',
      },
      {
        mot: 'Scribe',
        sens: 'Homme de métier qui sait lire, écrire et compter pour le temple, le palais ou le marchand.',
      },
      {
        mot: 'Stèle',
        sens: 'Grande pierre dressée portant un texte ou des images, exposée en public.',
      },
      {
        mot: 'Papyrus',
        sens: 'Feuille à écrire fabriquée en Égypte avec les tiges d’un roseau du Nil.',
      },
    ],
    lies: ['hammourabi', 'moise', 'homere', 'fondation-de-rome'],
    niveaux: ['6e'],
    programme: 'Premiers États, premières écritures',
    tags: [
      'écriture',
      'cunéiforme',
      'hiéroglyphes',
      'Sumer',
      'Mésopotamie',
      'Ourouk',
      'tablette',
      'argile',
      'scribe',
      'alphabet',
      'papyrus',
      'Champollion',
    ],
  },
  {
    id: 'jeux-olympiques-antiques',
    volet: 'evenements',
    nom: 'Les Jeux olympiques antiques',
    date: '776 av. J.-C. – 393 apr. J.-C.',
    tri: -776,
    fin: 393,
    periode: 'antiquite',
    emoji: '🏅',
    lieu: 'Olympie, en Élide, dans le Péloponnèse',
    accroche:
      'Tous les quatre ans, des cités qui passent leur temps à se battre déposent les armes pour courir — et le vainqueur ne gagne qu’une couronne d’olivier.',
    citations: [
      {
        texte:
          'L’eau est le meilleur des biens, et l’or, comme un feu qui flamboie dans la nuit, éclipse toutes les richesses d’un homme orgueilleux.',
        qui: 'Pindare',
        contexte:
          'Ouverture de la *Première Olympique*, commandée par Hiéron de Syracuse, vainqueur à la course de chevaux en 476 av. J.-C.',
        sens:
          'Le poète est payé pour chanter le vainqueur : l’ode est le vrai trophée, celui qui traverse les siècles.',
      },
      {
        texte:
          'Grands dieux, Mardonios, contre quels hommes nous as-tu conduits ? Ils ne luttent pas pour de l’argent, mais pour la gloire.',
        qui: 'Tigrane, général perse',
        contexte:
          'En apprenant que les Grecs célébraient les Jeux olympiques pendant l’invasion de 480 av. J.-C. ; rapporté par Hérodote.',
        sens:
          'Un prix qui ne vaut rien et qu’on se dispute à mort : les Perses y voient le signe qu’ils ont mal choisi leur ennemi.',
      },
      {
        texte: 'Meurs maintenant, Diagoras, car tu ne saurais monter à l’Olympe !',
        qui: 'Un Spartiate à Diagoras de Rhodes',
        contexte:
          'Dans le stade d’Olympie, vers 448 av. J.-C., tandis que les deux fils de Diagoras, couronnés le même jour, portent leur père sur leurs épaules.',
        sens:
          'Un homme ne peut pas connaître plus grand bonheur : autant partir tout de suite. Diagoras serait mort dans l’heure.',
      },
    ],
    reperes: [
      'Les premiers Jeux datés sont ceux de 776 av. J.-C. : les Grecs comptent ensuite le temps en olympiades de quatre ans.',
      'Ils se tiennent à Olympie, dans le sanctuaire de Zeus, et durent cinq jours en plein été.',
      'La trêve sacrée suspend les guerres pendant un mois pour laisser passer athlètes et pèlerins.',
      'On concourt nu, entre Grecs et entre hommes seulement ; les femmes mariées n’ont pas le droit d’assister au stade.',
      'Le seul prix remis sur place est une couronne d’olivier sauvage coupée dans le bois sacré.',
      'L’empereur Théodose les interdit en 393 apr. J.-C. : ils auront duré près de douze siècles.',
    ],
    causes: [
      'Un sanctuaire très ancien à Olympie, où l’on vient sacrifier à Zeus bien avant qu’on y organise des concours.',
      'Des cités grecques sans roi commun ni capitale, mais qui partagent une langue, des dieux et les poèmes d’Homère.',
      'La religion d’abord : les concours sont une offrande faite au dieu, pas un spectacle sportif.',
      'Le goût grec de l’*agôn*, la compétition, présent partout — au théâtre, en musique, en poésie autant qu’au stade.',
      'L’entraînement des citoyens-soldats : le gymnase fabrique des hoplites avant de fabriquer des champions.',
      'Le besoin de ces cités rivales de se retrouver quelque part sans s’entretuer, au moins un mois tous les quatre ans.',
    ],
    recit: [
      {
        titre: 'Le sanctuaire de Zeus',
        texte:
          'Olympie n’est pas une ville : c’est un **sanctuaire**, un bois d’oliviers et de platanes au confluent de deux rivières, avec des temples, des trésors offerts par les cités et un autel de cendres. Au centre, le temple de **Zeus** abrite, à partir de 436 av. J.-C., la statue chryséléphantine sculptée par **Phidias** — douze mètres d’or et d’ivoire, l’une des **sept merveilles du monde**. Les Jeux sont une fête religieuse : le troisième jour, on sacrifie **cent bœufs** sur l’autel, et c’est de ce repas partagé que toute la Grèce se nourrit. Les épreuves encadrent le sacrifice ; elles ne le remplacent pas.',
      },
      {
        titre: 'La trêve sacrée',
        texte:
          'Des hérauts partent d’Élide plusieurs semaines à l’avance annoncer la date des Jeux et proclamer l’**ekécheiria**, la trêve sacrée. Pendant un mois, on ne fait pas la guerre en Élide, on n’y porte pas les armes, et nul ne peut arrêter un voyageur qui se rend à Olympie. Ce n’est pas la paix universelle — les guerres continuent ailleurs — mais c’est un **droit international avant la lettre**, respecté pendant des siècles et sanctionné par des amendes : Sparte, condamnée en 420 av. J.-C. pour l’avoir violée, fut exclue des Jeux. Des cités qui se battaient l’année précédente envoyaient leurs jeunes gens concourir côte à côte.',
      },
      {
        titre: 'Cinq jours, dix épreuves',
        texte:
          'Tout commence par la course du **stade** : un aller simple de **192 mètres**, l’épreuve la plus ancienne et la plus prestigieuse — c’est le nom de son vainqueur qui donne son nom à l’olympiade. Viennent ensuite le *diaulos* (deux stades), le *dolichos* (vingt-quatre stades), le **pentathlon** (course, saut, disque, javelot, lutte), la **lutte**, le **pugilat**, et le redoutable **pancrace**, où tout est permis sauf mordre et crever les yeux. Les concours hippiques — course de chevaux et de chars — se tiennent à l’hippodrome, et là, fait unique, c’est le **propriétaire** de l’attelage qui est déclaré vainqueur, pas le conducteur. La dernière journée est celle de la course en armes, puis du banquet.',
      },
      {
        titre: 'Ce qu’on gagne vraiment',
        texte:
          'Sur place, une **couronne d’olivier sauvage** coupée avec une serpe d’or par un enfant dont le père et la mère sont encore en vie : rien d’autre. Mais au retour, la cité fait une brèche dans son rempart pour laisser entrer son champion — une ville qui a un tel homme n’a plus besoin de murs. Elle lui offre parfois la **nourriture gratuite à vie** au prytanée, une statue dans le sanctuaire, l’exemption d’impôts, et une somme d’argent : Solon, à Athènes, la fixe à **500 drachmes**, soit cinq cents moutons. Les plus riches commandent une ode à **Pindare** ou à Simonide. Le prix n’a aucune valeur, la récompense est immense — c’est exactement ce que les Grecs voulaient signifier.',
      },
      {
        titre: 'La fin, et le retour quinze siècles plus tard',
        texte:
          'Rome s’installe dans les Jeux sans les tuer : on y admet les non-Grecs, **Néron** vient y concourir en 67 apr. J.-C. et se fait couronner à la course de chars malgré une chute. La fin vient de la religion : en **393**, l’empereur **Théodose** interdit les cultes païens, et les Jeux d’Olympie, qui sont un culte, s’arrêtent avec eux. Deux tremblements de terre et les crues du fleuve enfouissent le sanctuaire sous plusieurs mètres de limon, ce qui le sauvera des pilleurs. Les fouilles allemandes le rendent au jour à partir de 1875, et un baron français, **Pierre de Coubertin**, obtient en 1894 la renaissance des Jeux : les premiers modernes ont lieu à **Athènes en 1896**.',
      },
    ],
    consequences: [
      'Les Grecs se donnent un calendrier commun : on date les événements par olympiades, de quatre en quatre ans.',
      'Olympie devient le lieu où les cités rivales se reconnaissent un monde commun, la Grèce.',
      'Le sport entre dans l’éducation : le gymnase et la palestre formeront les jeunes Grecs pendant mille ans.',
      'Trois autres grands concours s’ajoutent : Delphes, Corinthe et Némée — les Jeux panhelléniques.',
      'Le vainqueur devient un modèle chanté par les poètes : Pindare écrit quatorze odes olympiques.',
      'En 1896, Pierre de Coubertin ressuscite les Jeux à Athènes, en revendiquant ce modèle antique.',
    ],
    chiffres: [
      { valeur: '1 169 ans', quoi: 'entre les premiers Jeux et leur interdiction' },
      { valeur: '192 m', quoi: 'la longueur du stade d’Olympie, l’épreuve reine' },
      { valeur: '45 000', quoi: 'spectateurs debout autour du stade' },
      { valeur: '100', quoi: 'bœufs sacrifiés à Zeus le troisième jour' },
    ],
    chrono: [
      { date: '776 av. J.-C.', fait: 'Premiers Jeux datés ; Coroïbos d’Élis gagne le stade.' },
      { date: '708 av. J.-C.', fait: 'La lutte et le pentathlon entrent au programme.' },
      { date: '680 av. J.-C.', fait: 'Première course de chars à l’hippodrome.' },
      { date: '520 av. J.-C.', fait: 'Ajout de la course en armes, bouclier au bras.' },
      { date: 'vers 436 av. J.-C.', fait: 'Phidias achève le Zeus d’Olympie.' },
      { date: '420 av. J.-C.', fait: 'Sparte exclue pour avoir rompu la trêve sacrée.' },
      { date: '396 av. J.-C.', fait: 'Cyniska de Sparte, première femme couronnée.' },
      { date: '67 apr. J.-C.', fait: 'Néron concourt et se fait déclarer vainqueur.' },
      { date: '393 apr. J.-C.', fait: 'Théodose interdit les concours païens.' },
      { date: '1896', fait: 'Premiers Jeux olympiques modernes, à Athènes.' },
    ],
    leSaisTu:
      'Le plus grand champion d’Olympie est un lutteur, **Milon de Crotone**, six fois couronné entre 540 et 516 av. J.-C. On racontait qu’il portait un veau sur ses épaules chaque jour depuis sa naissance, et qu’il arriva ainsi à porter un taureau — l’ancêtre, à quelques siècles près, de la musculation progressive.',
    aRetenir: [
      'Les premiers Jeux olympiques datent de 776 av. J.-C. et se tiennent à Olympie tous les quatre ans.',
      'Ce sont des concours religieux en l’honneur de Zeus, et non de simples compétitions sportives.',
      'La trêve sacrée suspend les guerres : les cités rivales se reconnaissent un monde commun.',
      'Seuls les hommes grecs libres concourent ; le vainqueur reçoit une couronne d’olivier sauvage.',
      'L’empereur Théodose interdit les Jeux en 393 ; Pierre de Coubertin les fait renaître en 1896.',
    ],
    mots: [
      {
        mot: 'Olympiade',
        sens: 'Intervalle de quatre ans entre deux Jeux ; les Grecs s’en servaient pour dater les événements.',
      },
      {
        mot: 'Trêve sacrée',
        sens: 'Suspension des guerres (ekécheiria) autour des Jeux, pour que chacun puisse s’y rendre sans risque.',
      },
      {
        mot: 'Panhellénique',
        sens: 'Qui concerne tous les Grecs : Olympie, Delphes, Corinthe et Némée sont les quatre concours panhelléniques.',
      },
      {
        mot: 'Pancrace',
        sens: 'Combat mêlant lutte et boxe, où tout est permis sauf mordre et crever les yeux.',
      },
    ],
    lies: [
      'democratie-athenienne',
      'bataille-de-marathon',
      'homere',
      'pericles',
    ],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Olympie',
      'Zeus',
      'olympiade',
      'trêve sacrée',
      'couronne',
      'olivier',
      'Pindare',
      'stade',
      'pancrace',
      'Milon de Crotone',
      'Coubertin',
      'Grèce',
    ],
  },
  {
    id: 'fondation-de-rome',
    volet: 'evenements',
    nom: 'La fondation de Rome',
    date: '21 avril 753 av. J.-C. (date traditionnelle)',
    tri: -753,
    periode: 'antiquite',
    emoji: '🐺',
    lieu: 'Le Palatin, au bord du Tibre',
    accroche:
      'Deux jumeaux sauvés des eaux, une louve, un sillon tracé et un frère tué : Rome se donne un récit de naissance — l’archéologie en raconte un autre.',
    citations: [
      {
        texte: 'Ainsi périsse désormais quiconque franchira mes murailles !',
        qui: 'Romulus, rapporté par Tite-Live',
        contexte:
          'En tuant son frère Rémus, qui venait de sauter par-dessus le sillon marquant l’enceinte de la ville, selon l’*Histoire romaine*, livre I.',
        sens:
          'Tite-Live écrit sept siècles après les faits, sur un personnage légendaire : la scène dit ce que Rome pense de ses murs, pas ce qui s’est passé.',
        incertaine: true,
      },
      {
        texte:
          'À ceux-là, je n’assigne de bornes ni dans l’espace ni dans le temps : je leur ai donné un empire sans fin.',
        qui: 'Jupiter, dans l’*Énéide* de Virgile',
        contexte:
          'Le dieu rassure Vénus sur l’avenir des descendants d’Énée, au chant I ; Virgile écrit sous Auguste, vers 29-19 av. J.-C.',
        sens:
          'Une prophétie écrite après coup : elle donne à l’empire d’Auguste l’air d’avoir été promis dès l’origine.',
      },
      {
        texte:
          'Il n’exista jamais d’État plus grand, plus saint, ni plus riche en bons exemples.',
        qui: 'Tite-Live',
        contexte: 'Préface de son *Histoire romaine*, écrite vers 27 av. J.-C.',
        sens:
          'L’historien annonce son programme : raconter Rome pour donner des modèles aux Romains de son temps.',
      },
    ],
    reperes: [
      'Date traditionnelle : le 21 avril 753 av. J.-C., calculée par les Romains eux-mêmes des siècles plus tard.',
      'La légende : Romulus et Rémus, descendants du Troyen Énée, jetés dans le Tibre puis allaités par une louve.',
      'Romulus trace le sillon des murailles sur le Palatin et tue Rémus, qui l’a franchi par défi.',
      'L’archéologie trouve des villages de cabanes sur les collines dès le Xᵉ siècle av. J.-C.',
      'Le site est un gué sur le Tibre, au croisement de la route du sel et du pays étrusque.',
      'Sept rois se succèdent jusqu’en 509 av. J.-C., début de la République romaine.',
    ],
    causes: [
      'Un site défendable et stratégique : sept collines au-dessus du dernier gué du Tibre avant la mer.',
      'La route du sel, la future *Via Salaria*, qui traverse le fleuve précisément à cet endroit.',
      'Le voisinage des Étrusques, plus riches et plus avancés, qui donneront à Rome ses temples, ses égouts et trois de ses rois.',
      'Le regroupement, au VIIIᵉ siècle av. J.-C., de villages latins et sabins épars en une seule communauté.',
      'Le besoin, bien plus tard, d’un récit fondateur : Rome devenue maîtresse du monde se cherche des ancêtres aussi anciens que ceux des Grecs.',
    ],
    recit: [
      {
        titre: 'La légende, telle que Rome la raconte',
        texte:
          'Après la chute de Troie, le prince **Énée** fuit la ville en flammes avec son père sur le dos et gagne le Latium. Sa descendance règne sur Albe la Longue jusqu’au jour où **Amulius** chasse son frère **Numitor** et fait de la fille de celui-ci, **Rhéa Silvia**, une prêtresse vouée à la virginité. Elle met pourtant au monde des jumeaux, dont le dieu **Mars** serait le père. Exposés dans une corbeille sur le **Tibre** en crue, les enfants s’échouent au pied du Palatin, où une **louve** les allaite et un pivert les nourrit ; le berger **Faustulus** les recueille. Devenus grands, ils rétablissent leur grand-père sur son trône, puis décident de fonder une ville là où ils ont été sauvés.',
      },
      {
        titre: 'Le sillon et le meurtre',
        texte:
          'Les jumeaux consultent les dieux pour savoir qui donnera son nom à la ville : c’est la prise des **augures**. Rémus, sur l’Aventin, voit six vautours ; Romulus, sur le **Palatin**, en voit douze. Romulus l’emporte, attelle une génisse et un taureau blancs à une charrue de bronze et trace le **sillon sacré** qui marque le *pomerium*, la limite religieuse de la ville — on soulève le soc à l’emplacement des portes, seuls endroits où l’on pourra entrer. Rémus saute le sillon pour s’en moquer. Romulus le tue. Rome se raconte donc née d’un **fratricide**, et elle ne cherche pas à l’excuser : la limite de la ville est sacrée, et elle a coûté un frère.',
      },
      {
        titre: 'Ce que disent les fouilles',
        texte:
          'Les archéologues ne trouvent ni louve ni jumeaux, mais ils confirment l’essentiel du calendrier. Sur le **Palatin**, des trous de poteaux dessinent des **cabanes de bergers** dès le Xᵉ siècle av. J.-C. Vers 730-720, un **mur** est bâti au pied de la colline. Au VIIᵉ siècle, le marécage entre les collines est drainé par la **Cloaca Maxima**, un égout couvert toujours en service, et l’espace assaini devient le **Forum** : c’est le moment où un ensemble de hameaux devient une ville. Les techniques, l’écriture et les dieux viennent largement des **Étrusques**, voisins du nord. La légende date la naissance de Rome de 753 ; l’archéologie la situe entre 750 et 600. Pour une fois, le mythe ne se trompe pas de siècle.',
      },
      {
        titre: 'Sept rois, puis la République',
        texte:
          'La tradition compte **sept rois** : Romulus, Numa Pompilius (la religion et le calendrier), Tullus Hostilius, Ancus Marcius, puis trois souverains étrusques — Tarquin l’Ancien, **Servius Tullius** (qui organise les citoyens en classes selon leur fortune et bâtit la première grande enceinte) et **Tarquin le Superbe**. En **509 av. J.-C.**, l’outrage commis par le fils de ce dernier contre **Lucrèce**, une patricienne qui se donne la mort, soulève la ville. Les Romains chassent le roi, jurent de n’en jamais accepter d’autre et confient le pouvoir à deux **consuls** élus pour un an : c’est la *res publica*, la chose publique, la République.',
      },
      {
        titre: 'Pourquoi la légende a tenu',
        texte:
          'Parce qu’elle sert. Sous **Auguste**, qui se dit descendant d’Énée par sa famille, **Virgile** écrit l’*Énéide* et **Tite-Live** son *Histoire romaine* : Rome reçoit un passé troyen aussi noble que celui des Grecs, et un empire annoncé par les dieux. Les Romains comptent d’ailleurs les années *ab Urbe condita*, « depuis la fondation de la Ville ». La **louve** devient l’emblème de la cité, puis celui de la commune de Rome, et on la retrouve aujourd’hui sur les maillots d’un club de football. Quatre lettres résument encore le tout sur les plaques d’égout de la ville : **SPQR**, *Senatus PopulusQue Romanus*, le Sénat et le peuple romain.',
      },
    ],
    consequences: [
      'Rome se donne une date de naissance officielle et compte ses années depuis la fondation de la Ville.',
      'Le récit d’Énée relie Rome à la Grèce d’Homère et lui offre un passé aussi ancien que celui de ses rivales.',
      'La royauté s’achève en 509 av. J.-C. : les Romains se donnent la République et détesteront le mot de roi.',
      'Le pomerium, limite sacrée tracée par Romulus, restera intouchable : aucune armée en armes n’entre dans Rome.',
      'Le 21 avril, fête des Parilia dans l’Antiquité, est encore aujourd’hui l’anniversaire officiel de Rome.',
      'La louve allaitant les jumeaux devient l’un des symboles les plus durables de l’Occident.',
    ],
    chiffres: [
      { valeur: '7', quoi: 'collines, et sept rois avant la République' },
      { valeur: '12', quoi: 'vautours vus par Romulus, contre six par Rémus' },
      { valeur: '244 ans', quoi: 'de royauté, de 753 à 509 av. J.-C.' },
      { valeur: '21 avril', quoi: 'l’anniversaire de Rome, encore fêté aujourd’hui' },
    ],
    chrono: [
      { date: 'vers 1000 av. J.-C.', fait: 'Cabanes de bergers sur le Palatin.' },
      { date: '753 av. J.-C.', fait: 'Date traditionnelle de la fondation par Romulus.' },
      { date: 'vers 730 av. J.-C.', fait: 'Premier mur au pied du Palatin.' },
      { date: 'vers 616 av. J.-C.', fait: 'Tarquin l’Ancien, premier roi étrusque.' },
      { date: 'vers 600 av. J.-C.', fait: 'La Cloaca Maxima assèche le Forum.' },
      { date: '509 av. J.-C.', fait: 'Chute de Tarquin le Superbe : la République.' },
      { date: '390 av. J.-C.', fait: 'Les Gaulois de Brennus pillent Rome.' },
      { date: 'vers 19 av. J.-C.', fait: 'Virgile achève l’*Énéide*.' },
    ],
    leSaisTu:
      'La célèbre **louve du Capitole**, longtemps donnée pour une statue étrusque du Vᵉ siècle av. J.-C., a livré au carbone 14 une date bien plus récente : elle serait médiévale. Quant aux jumeaux qui tètent sous son ventre, ils ont été ajoutés à la Renaissance, vers 1471.',
    aRetenir: [
      'La date traditionnelle de la fondation de Rome est le 21 avril 753 av. J.-C.',
      'La légende fait de Romulus et Rémus les descendants du Troyen Énée, allaités par une louve.',
      'Romulus tue Rémus, qui a franchi le sillon sacré, et donne son nom à la ville.',
      'L’archéologie atteste des villages de cabanes sur les collines dès le Xᵉ siècle av. J.-C.',
      'Sept rois gouvernent Rome jusqu’en 509 av. J.-C., date de naissance de la République.',
    ],
    mots: [
      {
        mot: 'Pomerium',
        sens: 'Limite religieuse de Rome, tracée par un sillon : on n’y entre pas en armes.',
      },
      {
        mot: 'Augure',
        sens: 'Prêtre qui interprète la volonté des dieux, souvent d’après le vol des oiseaux.',
      },
      {
        mot: 'Étrusques',
        sens: 'Peuple d’Italie centrale, au nord de Rome, dont vinrent trois rois romains et bien des techniques.',
      },
      {
        mot: 'République',
        sens: 'De *res publica*, la chose publique : régime sans roi, où des magistrats sont élus pour un temps limité.',
      },
    ],
    lies: [
      'conquete-de-la-gaule',
      'chute-de-l-empire-romain-d-occident',
      'jules-cesar',
      'auguste',
    ],
    niveaux: ['6e'],
    programme: 'Rome du mythe à l’histoire',
    tags: [
      'Rome',
      'Romulus',
      'Rémus',
      'louve',
      'Palatin',
      'Tibre',
      'Énée',
      'Virgile',
      'Tite-Live',
      'Étrusques',
      '753',
      'SPQR',
    ],
  },
  {
    id: 'bataille-de-marathon',
    volet: 'evenements',
    nom: 'La bataille de Marathon',
    date: 'septembre 490 av. J.-C.',
    tri: -490,
    periode: 'antiquite',
    emoji: '🏃',
    lieu: 'La plaine de Marathon, en Attique',
    accroche:
      'Dix mille citoyens-soldats courent sur les archers du Grand Roi et gagnent en une matinée : la petite Athènes vient de battre le plus grand empire du monde.',
    citations: [
      {
        texte:
          'Il dépend de toi aujourd’hui, Callimaque, d’asservir Athènes ou de la rendre libre et de laisser de toi un souvenir tel que n’en laissèrent jamais Harmodios et Aristogiton.',
        qui: 'Miltiade',
        contexte:
          'Au polémarque Callimaque, dont la voix devait départager les dix stratèges, la veille de la bataille ; rapporté par Hérodote, livre VI.',
        sens:
          'Les stratèges étaient partagés cinq contre cinq sur l’opportunité d’attaquer. Callimaque vota pour la bataille, et y mourut.',
      },
      {
        texte:
          'Ce tombeau couvre Eschyle, fils d’Euphorion, Athénien, mort dans la plaine de Géla riche en blé. Sa valeur éprouvée, le bois sacré de Marathon en parlerait, et le Mède à la longue chevelure, qui l’a connue.',
        qui: 'Eschyle',
        contexte:
          'Épitaphe que le poète aurait composée lui-même, gravée sur son tombeau en Sicile vers 456 av. J.-C.',
        sens:
          'Le plus grand auteur tragique d’Athènes ne fait pas écrire une ligne sur son théâtre : il veut qu’on retienne qu’il a combattu à Marathon.',
      },
      {
        texte: 'Réjouissez-vous, nous avons vaincu !',
        qui: 'Phidippidès',
        contexte:
          'Le coureur serait arrivé à Athènes pour annoncer la victoire, puis serait mort d’épuisement — récit de Lucien, six siècles après les faits.',
        sens:
          'Hérodote, qui écrit quarante ans après la bataille, ne raconte rien de tel : la course du messager est une légende tardive.',
        incertaine: true,
      },
    ],
    reperes: [
      'Septembre 490 av. J.-C., dans une plaine côtière située à 42 km d’Athènes.',
      'Darius Iᵉʳ veut punir Athènes et Érétrie, qui ont soutenu la révolte des cités grecques d’Asie Mineure.',
      'Miltiade dégarnit le centre de sa ligne et renforce les ailes : les Perses sont pris en tenaille.',
      'Hérodote compte 192 morts athéniens contre 6 400 Perses — des chiffres d’auteur ancien, pas un décompte.',
      'Les morts athéniens sont enterrés sur place sous un tertre, le Soros, qu’on voit encore.',
      'Sparte, retenue par une fête religieuse, arrive après la bataille et se contente de visiter le champ.',
    ],
    causes: [
      'L’expansion de l’Empire perse, qui atteint la mer Égée et soumet les cités grecques d’Asie Mineure.',
      'La révolte de l’Ionie (499-494 av. J.-C.) : Athènes y envoie vingt navires et participe à l’incendie de Sardes.',
      'La volonté de Darius Iᵉʳ de punir Athènes, à qui un serviteur devait, dit-on, rappeler chaque jour de se souvenir.',
      'Le refus d’Athènes et de Sparte de livrer la terre et l’eau, les gages de soumission réclamés par les envoyés perses.',
      'La présence d’Hippias, tyran chassé d’Athènes vingt ans plus tôt, qui guide la flotte perse et espère reprendre le pouvoir.',
    ],
    recit: [
      {
        titre: 'L’empire qui arrive par la mer',
        texte:
          'L’Empire perse de **Darius Iᵉʳ** s’étend de l’Indus à l’Égée : une vingtaine de satrapies, une route royale de deux mille cinq cents kilomètres, un système de relais qui porte un message de Suse à Sardes en une semaine. Face à lui, Athènes est une cité de quelques dizaines de milliers de citoyens, démocratique depuis dix-sept ans à peine. En **490 av. J.-C.**, une flotte de six cents navires commandée par **Datis** et **Artapherne** traverse l’Égée d’île en île, prend Naxos, **brûle Érétrie** et débarque sa cavalerie dans la baie de Marathon, sur le conseil d’Hippias qui connaît le terrain. De là, il ne reste que quarante kilomètres jusqu’à Athènes.',
      },
      {
        titre: 'Le choix de se battre',
        texte:
          'Athènes envoie **Phidippidès**, un coureur professionnel, demander l’aide de Sparte : il couvre les **240 kilomètres en deux jours**. Les Spartiates acceptent, mais une fête religieuse leur interdit de partir avant la pleine lune. Athènes ira donc presque seule : **dix mille hoplites**, rejoints par **mille Platéens** — la petite cité voisine envoie tous ses hommes, et les Athéniens ne l’oublieront jamais. Sur place, les dix stratèges sont partagés : cinq veulent attendre derrière les murs, cinq veulent attaquer. **Miltiade**, qui a vécu en pays perse et connaît cette armée, convainc le polémarque **Callimaque** de trancher pour la bataille.',
      },
      {
        titre: 'La course des hoplites',
        texte:
          'Au matin, Miltiade fait une chose qu’aucun général grec n’avait osée : il **étire sa ligne** sur toute la largeur de la plaine pour ne pas être débordé, en dégarnissant le centre, et il lance l’attaque **au pas de course** sur près d’un kilomètre et demi. Courir avec trente kilos de bronze et de bois paraît absurde ; c’est ce qui sauve les Athéniens, car cela réduit le temps passé sous les flèches. Le choc a lieu. Le centre grec, trop mince, recule — mais les deux **ailes** enfoncent les leurs, se retournent et referment la tenaille sur le centre perse. La déroute est totale : les Perses courent vers leurs navires, les Grecs les suivent dans le marais et s’emparent de **sept vaisseaux**.',
      },
      {
        titre: 'Le vrai marathon',
        texte:
          'La bataille gagnée, un bouclier brille au loin sur le mont Pentélique — un signal, peut-être une trahison. La flotte perse, au lieu de rentrer, met le cap sur le **cap Sounion** pour surprendre Athènes vide de ses défenseurs. Alors les hoplites, qui viennent de courir, de combattre et de poursuivre, reprennent la route et **refont à pied les quarante kilomètres jusqu’à Athènes dans la journée**. Quand la flotte perse se présente devant le port de Phalère, elle trouve l’armée athénienne rangée sur le rivage, et repart. La course de Marathon, la vraie, n’a pas été courue par un messager : elle l’a été par toute une armée en armes, et pour une raison bien plus sérieuse qu’un message.',
      },
      {
        titre: 'Ce que Marathon a fondé',
        texte:
          'Les cent quatre-vingt-douze morts athéniens sont, par exception, enterrés sur le champ de bataille sous un tumulus de douze mètres de haut, le **Soros**, toujours debout. La victoire donne à la démocratie toute jeune une **fierté fondatrice** : être « un combattant de Marathon » reste, cinquante ans plus tard, le plus grand titre dont un Athénien puisse se réclamer, et **Eschyle** le fait graver sur sa tombe à la place de son théâtre. Dix ans après, l’invasion revient, plus grosse encore, et se brise aux **Thermopyles** puis à **Salamine**. Marathon a montré ce que personne ne croyait : que des citoyens libres, en rangs serrés, pouvaient tenir devant le Grand Roi.',
      },
    ],
    consequences: [
      'L’invasion perse de 490 est repoussée : Athènes reste libre et sa démocratie, née en 507, survit.',
      'La cité y gagne une fierté durable ; les vétérans, les « Marathonomaques », sont honorés toute leur vie.',
      'Miltiade devient le héros d’Athènes, avant d’être condamné l’année suivante pour une expédition ratée.',
      'Darius prépare une revanche : son fils Xerxès reviendra en 480 avec une armée bien plus nombreuse.',
      'Athènes tire la leçon et construit une flotte : ce sont ses trières qui vaincront à Salamine.',
      'En 1896, la course du marathon est créée pour les premiers Jeux modernes, d’après la légende du messager.',
    ],
    chiffres: [
      { valeur: '192', quoi: 'Athéniens tués, selon Hérodote' },
      { valeur: '6 400', quoi: 'Perses tués, selon le même Hérodote' },
      { valeur: '42 km', quoi: 'de Marathon à Athènes — d’où la course' },
      { valeur: '240 km', quoi: 'courus en deux jours par Phidippidès jusqu’à Sparte' },
    ],
    chrono: [
      { date: '499-494 av. J.-C.', fait: 'Révolte d’Ionie, soutenue par Athènes.' },
      { date: '492 av. J.-C.', fait: 'La première flotte perse se brise au mont Athos.' },
      { date: 'été 490 av. J.-C.', fait: 'Naxos prise, Érétrie brûlée par les Perses.' },
      { date: 'septembre 490 av. J.-C.', fait: 'Victoire athénienne dans la plaine de Marathon.' },
      { date: 'le soir même', fait: 'L’armée revient à marche forcée défendre Athènes.' },
      { date: '480 av. J.-C.', fait: 'Xerxès revient : Thermopyles, puis Salamine.' },
      { date: '1896', fait: 'Le marathon devient une épreuve olympique.' },
    ],
    leSaisTu:
      'Le marathon moderne ne vient pas de l’Antiquité mais d’une idée de 1896, soufflée par le philologue français **Michel Bréal**. Sa distance officielle, **42,195 km**, n’a rien de grec non plus : elle a été fixée à Londres en 1908 pour que la course parte du château de Windsor et finisse devant la loge royale.',
    aRetenir: [
      'En septembre 490 av. J.-C., les Athéniens battent l’armée de Darius Iᵉʳ à Marathon.',
      'Miltiade commande 10 000 hoplites athéniens, renforcés par 1 000 Platéens.',
      'Hérodote compte 192 morts athéniens contre 6 400 Perses.',
      'La victoire est celle de citoyens-soldats d’une cité démocratique depuis dix-sept ans.',
      'La course du marathon, créée en 1896, repose sur une légende tardive absente d’Hérodote.',
    ],
    mots: [
      {
        mot: 'Hoplite',
        sens: 'Citoyen-soldat grec combattant à pied, avec casque, cuirasse, bouclier rond et lance.',
      },
      {
        mot: 'Phalange',
        sens: 'Formation de combat en rangs serrés, boucliers se recouvrant les uns les autres.',
      },
      {
        mot: 'Stratège',
        sens: 'À Athènes, l’un des dix chefs militaires élus chaque année par l’assemblée des citoyens.',
      },
      {
        mot: 'Guerres médiques',
        sens: 'Les deux guerres entre les cités grecques et l’Empire perse, de 490 à 479 av. J.-C.',
      },
    ],
    lies: [
      'democratie-athenienne',
      'jeux-olympiques-antiques',
      'pericles',
      'alexandre-le-grand',
    ],
    niveaux: ['6e'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Marathon',
      'Miltiade',
      'Darius',
      'Perses',
      'hoplite',
      'guerres médiques',
      'Athènes',
      'Platées',
      'Phidippidès',
      'Hérodote',
      'Eschyle',
      'course',
    ],
  },
  {
    id: 'democratie-athenienne',
    volet: 'evenements',
    nom: 'La démocratie athénienne',
    date: '507 – 322 av. J.-C.',
    tri: -450,
    fin: -322,
    periode: 'antiquite',
    emoji: '🗳️',
    lieu: 'Athènes : la Pnyx, l’Agora et l’Héliée',
    accroche:
      'Le peuple vote les lois, juge les procès et tire au sort ses magistrats — mais neuf habitants de l’Attique sur dix n’ont pas le droit de monter sur la Pnyx.',
    citations: [
      {
        texte:
          'Notre constitution politique n’a rien à envier aux lois qui régissent nos voisins ; loin d’imiter les autres, nous donnons l’exemple. Notre régime a pour nom démocratie, parce qu’il tend non pas vers le petit nombre, mais vers le plus grand nombre.',
        qui: 'Périclès',
        contexte:
          'Oraison funèbre des premiers morts de la guerre du Péloponnèse, hiver 431-430 av. J.-C., rapportée par Thucydide.',
        sens:
          'La plus ancienne définition connue du mot démocratie : le pouvoir appartient au plus grand nombre, et non à une poignée de riches ou de nobles.',
      },
      {
        texte:
          'Nous sommes les seuls à considérer l’homme qui ne prend aucune part aux affaires publiques non comme un homme paisible, mais comme un citoyen inutile.',
        qui: 'Périclès',
        contexte: 'Suite de la même oraison funèbre, rapportée par Thucydide, livre II.',
        sens:
          'À Athènes, se désintéresser de la politique n’est pas un droit tranquille : c’est un manquement au devoir de citoyen.',
      },
      {
        texte: 'Je ne le connais pas, mais il me fatigue de l’entendre partout appeler « le Juste ».',
        qui: 'Un citoyen illettré à Aristide, rapporté par Plutarque',
        contexte:
          'Le jour d’un vote d’ostracisme, vers 482 av. J.-C. : l’homme demande à un inconnu d’écrire pour lui un nom sur son tesson — c’était Aristide lui-même, qui l’écrivit.',
        sens:
          'L’ostracisme ne punit pas une faute : il écarte celui qui pèse trop. Aristide l’inscrivit sans rien dire et partit en exil.',
      },
    ],
    reperes: [
      'Clisthène fonde le régime en 508-507 av. J.-C. en redécoupant la cité en dix tribus mélangées.',
      'L’Ecclésia, assemblée de tous les citoyens, se réunit environ quarante fois par an sur la colline de la Pnyx.',
      'La Boulè, conseil de 500 membres tirés au sort, prépare les textes soumis à l’assemblée.',
      'L’Héliée, tribunal de 6 000 jurés tirés au sort, juge les procès sans juge professionnel.',
      'Est citoyen l’homme majeur né de père et de mère athéniens : ni femmes, ni métèques, ni esclaves.',
      'Périclès fait payer les charges publiques, le misthos, pour que les pauvres puissent les exercer.',
    ],
    causes: [
      'Les réformes de Solon en 594 av. J.-C. : l’esclavage pour dettes est aboli, les citoyens sont classés selon leur fortune et non leur naissance.',
      'La tyrannie des Pisistratides, chassée en 510 av. J.-C., qui avait affaibli les grandes familles nobles.',
      'La réforme de Clisthène en 508-507 : dix tribus mêlant ville, côte et intérieur pour briser les clientèles locales.',
      'La phalange hoplitique : celui qui paie son armure et défend la cité en rang réclame d’avoir voix au chapitre.',
      'Les guerres médiques, gagnées à Marathon par les hoplites et à Salamine par les rameurs les plus pauvres.',
      'L’empire maritime et le tribut des alliés, qui financent les indemnités de fonction et les grands travaux.',
    ],
    recit: [
      {
        titre: 'Qui est citoyen, qui ne l’est pas',
        texte:
          'L’Attique compte peut-être **300 000 habitants** au Vᵉ siècle. Parmi eux, environ **40 000 citoyens** : les hommes de plus de dix-huit ans, nés de père athénien et, depuis la loi de **Périclès en 451**, de mère athénienne aussi. Sont exclus les **femmes**, qui ne votent ni ne possèdent en propre ; les **métèques**, étrangers installés, souvent commerçants ou artisans, qui paient un impôt spécial et servent à l’armée sans jamais voter ; et les **esclaves**, peut-être cent mille, qui ne sont juridiquement pas des personnes. Dire cela n’est pas juger Athènes de haut : c’est mesurer exactement ce que le mot démocratie voulait dire là-bas, et ce qu’il a fallu de siècles pour qu’il veuille dire autre chose.',
      },
      {
        titre: 'L’assemblée sur la Pnyx',
        texte:
          'L’**Ecclésia** est le vrai pouvoir. Elle se réunit une quarantaine de fois par an, à l’aube, sur la colline de la **Pnyx**, face à l’Acropole, et il faut **6 000 présents** pour certaines décisions. Le héraut ouvre chaque débat par une formule qui résume tout le régime : *Qui veut prendre la parole ?* C’est l’**isègoria**, le droit égal à la parole, jumelle de l’**isonomie**, l’égalité devant la loi. L’assemblée vote la guerre et la paix, les traités, les dépenses, les lois ; elle vote à main levée, et ses décisions sont gravées sur des stèles de marbre pour que nul ne puisse les récrire. Un citoyen pauvre pouvait donc, le même matin, croiser un stratège et voter contre lui.',
      },
      {
        titre: 'Le tirage au sort, cœur du système',
        texte:
          'Athènes tire au sort presque toutes ses charges, parce que l’élection avantage les riches et les connus. La **Boulè** — 500 membres, 50 par tribu, tirés au sort pour un an, deux fois maximum dans une vie — prépare l’ordre du jour de l’assemblée ; chaque tribu à son tour gouverne au jour le jour pendant un dixième de l’année. Les **archontes** et la plupart des magistrats sont tirés au sort à l’aide d’une machine de pierre à fentes, le **klérotérion**. Seuls les postes techniques restent électifs : les **stratèges**, chefs militaires, rééligibles — c’est ainsi que **Périclès** exerce quinze années de suite. Toute charge se termine par une **reddition de comptes** devant le peuple : un magistrat sortant peut être poursuivi.',
      },
      {
        titre: 'Le tesson d’argile',
        texte:
          'Chaque année, l’assemblée se demande s’il faut procéder à un **ostracisme**. Si elle dit oui, les citoyens se rassemblent sur l’Agora et chacun grave sur un **tesson de poterie** — *ostrakon* — le nom de celui qu’il juge dangereux pour la cité. À partir de **6 000 tessons**, le désigné doit quitter Athènes pour **dix ans**, sans perdre ni ses biens ni ses droits. Ce n’est pas une condamnation : c’est une mise à l’écart préventive contre le retour d’un tyran. Les archéologues ont retrouvé plus de dix mille de ces tessons dans le puits de l’Agora — dont un lot de cent quatre-vingt-dix portant le nom de **Thémistocle**, gravés par quelques mains seulement : les campagnes électorales truquées ne datent pas d’hier.',
      },
      {
        titre: 'Les limites, et ce qui nous en reste',
        texte:
          'Le régime a ses fragilités, et les Athéniens les connaissent. La même assemblée qui vote la Constitution vote la **mort de Socrate** en 399 av. J.-C., condamné par **501 jurés** ; elle décide l’expédition de Sicile qui perdra la cité. **Platon** et **Aristote** la critiquent durement, et elle s’éteint en **322 av. J.-C.**, écrasée par la Macédoine. Mais elle laisse plus que des ruines : le mot lui-même, l’idée que la loi doit être la même pour tous, l’assemblée souveraine, la reddition de comptes des gouvernants, le jury populaire. Deux mille trois cents ans plus tard, le tribunal correctionnel, le référendum et le tirage au sort des jurés d’assises en descendent tous.',
      },
    ],
    consequences: [
      'Athènes invente le mot et les institutions de la démocratie : assemblée souveraine, tirage au sort, jury populaire.',
      'La participation devient un devoir, payé à partir de Périclès pour que les pauvres puissent l’exercer.',
      'Le débat public se professionnalise : rhéteurs, sophistes et orateurs comme Démosthène font métier de convaincre.',
      'Le théâtre, financé par les riches citoyens, devient une institution civique suivie par des milliers de spectateurs.',
      'Le régime s’effondre en 322 av. J.-C. devant la Macédoine, mais l’idée survit dans les textes grecs.',
      'Les révolutionnaires français et américains relisent Athènes au XVIIIᵉ siècle pour bâtir leurs républiques.',
    ],
    chiffres: [
      { valeur: '40 000', quoi: 'citoyens sur environ 300 000 habitants en Attique' },
      { valeur: '6 000', quoi: 'citoyens présents pour que l’assemblée puisse trancher' },
      { valeur: '500', quoi: 'membres de la Boulè, tirés au sort chaque année' },
      { valeur: '3 oboles', quoi: 'versées au juré : une demi-journée de salaire' },
    ],
    chrono: [
      { date: '594 av. J.-C.', fait: 'Solon abolit l’esclavage pour dettes.' },
      { date: '508-507 av. J.-C.', fait: 'Clisthène crée les dix tribus : la démocratie naît.' },
      { date: '490 et 480 av. J.-C.', fait: 'Victoires de Marathon et de Salamine.' },
      { date: '462 av. J.-C.', fait: 'Éphialtès dépouille l’Aréopage de ses pouvoirs.' },
      { date: '451 av. J.-C.', fait: 'Périclès réserve la citoyenneté aux fils de deux Athéniens.' },
      { date: '431-404 av. J.-C.', fait: 'Guerre du Péloponnèse, perdue contre Sparte.' },
      { date: '399 av. J.-C.', fait: 'Socrate condamné à mort par 501 jurés.' },
      { date: '322 av. J.-C.', fait: 'La Macédoine met fin à la démocratie athénienne.' },
    ],
    leSaisTu:
      'Pour remplir la Pnyx, des archers scythes traversaient l’Agora en tendant une **corde fraîchement teinte au vermillon**. Les traînards qui rentraient chez eux avec une marque rouge sur le manteau étaient reconnaissables et payaient une amende : à Athènes, sécher l’assemblée coûtait cher.',
    aRetenir: [
      'La démocratie athénienne naît des réformes de Clisthène, en 508-507 av. J.-C.',
      'L’Ecclésia, assemblée des citoyens, vote les lois sur la colline de la Pnyx.',
      'La Boulè (500 membres) et l’Héliée (6 000 jurés) sont tirées au sort ; les stratèges sont élus.',
      'Seuls les hommes fils de citoyens sont citoyens : femmes, métèques et esclaves en sont exclus.',
      'Périclès fait payer les charges publiques pour que les citoyens pauvres puissent les exercer.',
      'Le régime disparaît en 322 av. J.-C., après la défaite d’Athènes face à la Macédoine.',
    ],
    mots: [
      {
        mot: 'Ecclésia',
        sens: 'L’assemblée de tous les citoyens athéniens, qui vote les lois sur la Pnyx.',
      },
      {
        mot: 'Boulè',
        sens: 'Conseil de 500 citoyens tirés au sort, qui prépare les décisions de l’assemblée.',
      },
      {
        mot: 'Ostracisme',
        sens: 'Vote sur tessons envoyant en exil pour dix ans un citoyen jugé trop puissant.',
      },
      {
        mot: 'Métèque',
        sens: 'Étranger installé à Athènes : il paie l’impôt et sert à l’armée, mais ne vote pas.',
      },
      {
        mot: 'Misthos',
        sens: 'Indemnité versée au citoyen qui siège, pour qu’une charge publique ne soit pas réservée aux riches.',
      },
      {
        mot: 'Isonomie',
        sens: 'Égalité de tous les citoyens devant la loi — le principe jumeau de l’égalité de parole.',
      },
    ],
    lies: [
      'bataille-de-marathon',
      'jeux-olympiques-antiques',
      'pericles',
      'socrate',
      'platon',
    ],
    niveaux: ['6e', '2de'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Athènes',
      'démocratie',
      'Clisthène',
      'Périclès',
      'Pnyx',
      'Ecclésia',
      'Boulè',
      'ostracisme',
      'citoyen',
      'tirage au sort',
      'métèque',
      'Héliée',
    ],
  },
  {
    id: 'conquete-de-la-gaule',
    volet: 'evenements',
    nom: 'La conquête de la Gaule',
    date: '58 – 51 av. J.-C.',
    tri: -52,
    fin: -51,
    periode: 'antiquite',
    emoji: '⚔️',
    lieu: 'La Gaule, de Bibracte à Alésia',
    accroche:
      'En huit campagnes, un proconsul couvert de dettes soumet un pays trois fois grand comme l’Italie — et se forge l’armée qui lui livrera Rome.',
    citations: [
      {
        texte: 'Toute la Gaule est divisée en trois parties.',
        qui: 'Jules César',
        contexte:
          'Première phrase de *La Guerre des Gaules*, le récit que César rédige lui-même et envoie à Rome, campagne après campagne.',
        sens:
          '*Gallia est omnis divisa in partes tres.* En sept mots, il annonce son sujet et sa méthode : un pays divisé se conquiert morceau par morceau.',
      },
      {
        texte: 'Le sort en est jeté.',
        qui: 'Jules César',
        contexte:
          'En franchissant le Rubicon avec sa légion, dans la nuit du 11 au 12 janvier 49 av. J.-C., ce qu’aucun général n’avait le droit de faire.',
        sens:
          '*Alea jacta est.* La phrase est rapportée par Suétone et Plutarque, un siècle et demi après : on ne sait pas s’il l’a prononcée, encore moins en quelle langue.',
        incertaine: true,
      },
      {
        texte: 'Je suis venu, j’ai vu, j’ai vaincu.',
        qui: 'Jules César',
        contexte:
          'Message annonçant à Rome sa victoire éclair sur Pharnace à Zéla, en 47 av. J.-C. — donc après la Gaule, et loin d’elle.',
        sens:
          '*Veni, vidi, vici.* Trois mots de trois syllabes, portés sur une pancarte lors de son triomphe : la formule est une arme politique autant qu’un compte rendu.',
      },
      {
        texte: 'Malheur aux vaincus !',
        qui: 'Brennus, chef gaulois',
        contexte:
          'En jetant son épée dans la balance où l’on pesait la rançon de Rome, après la prise de la ville en 390 av. J.-C. ; rapporté par Tite-Live.',
        sens:
          '*Vae victis !* Tite-Live écrit près de quatre siècles plus tard. La scène dit surtout la terreur que les Gaulois inspiraient encore à Rome du temps de César.',
        incertaine: true,
      },
    ],
    reperes: [
      'Huit campagnes, de 58 à 51 av. J.-C., racontées par César lui-même dans *La Guerre des Gaules*.',
      'La Gaule compte une soixantaine de peuples, riches et rivaux, sans État ni armée communs.',
      'Prétexte de la guerre : la migration des Helvètes et l’appel à l’aide des Éduens, alliés de Rome.',
      'En 52 av. J.-C., Vercingétorix unit une grande partie des peuples gaulois et l’emporte à Gergovie.',
      'À Alésia, César enferme les assiégés entre deux lignes de fortifications et repousse l’armée de secours.',
      'La Gaule reste romaine cinq siècles : villes, routes, latin, droit et citoyenneté.',
    ],
    causes: [
      'Une Gaule riche — blé, fer, or, troupeaux, vin importé par millions d’amphores — et divisée en peuples rivaux.',
      'La Narbonnaise, province romaine depuis 121 av. J.-C., qui offre une base de départ et un prétexte à intervenir.',
      'Les dettes colossales de César, qui a besoin d’une guerre rentable pour exister à côté de Pompée et de Crassus.',
      'Le commandement de cinq ans sur trois provinces et quatre légions, obtenu en 59 av. J.-C. puis prolongé.',
      'La migration des Helvètes en 58 av. J.-C., et l’appel au secours des Éduens, alliés déclarés du peuple romain.',
      'La pression des Germains d’Arioviste sur la Gaule de l’Est, présentée à Rome comme une menace à écarter.',
    ],
    recit: [
      {
        titre: 'Un proconsul couvert de dettes',
        texte:
          'En 59 av. J.-C., **Jules César** a quarante et un ans, un talent d’orateur, une popularité réelle et des dettes vertigineuses — des dizaines de millions de sesterces, avancés par **Crassus**, l’homme le plus riche de Rome. L’accord passé avec Crassus et **Pompée**, qu’on appellera le premier triumvirat, lui vaut le consulat, puis un commandement de cinq ans sur la Gaule cisalpine, l’Illyrie et la **Narbonnaise**. À Rome, un gouverneur gagne de l’argent en administrant ; il en gagne beaucoup plus en conquérant, car le butin et les esclaves lui reviennent pour une large part. César n’arrive donc pas en Gaule par hasard : il y arrive avec un besoin.',
      },
      {
        titre: 'Huit campagnes',
        texte:
          'En **58**, il arrête les **Helvètes** qui migrent vers l’ouest et les bat près de **Bibracte**, puis chasse le Germain **Arioviste** au-delà du Rhin. En **57**, il soumet les peuples **belges**, les plus redoutés. En **56**, ses navires viennent à bout des **Vénètes** d’Armorique. En **55** et **54**, il fait construire deux fois un pont sur le **Rhin** — dix jours de travail pour montrer que Rome peut passer quand elle veut — et débarque deux fois en **Bretagne**, sans y rester. L’hiver **54-53** manque tout emporter : le prince éburon **Ambiorix** anéantit une légion et demie, quinze cohortes, le plus lourd désastre de la guerre. César lève de nouvelles troupes et passe l’année à punir.',
      },
      {
        titre: 'L’année de Vercingétorix',
        texte:
          'L’hiver **52** commence par le massacre des marchands romains de **Cenabum** (Orléans). Un jeune noble arverne, **Vercingétorix**, est proclamé chef d’une coalition qui rassemble enfin la plupart des peuples gaulois — ce que Rome croyait impossible. Sa stratégie est nouvelle : refuser la bataille rangée, harceler les convois et pratiquer la **terre brûlée** pour affamer les légions. Elle échoue à **Avaricum** (Bourges), que les habitants refusent de brûler et que César prend et massacre. Elle réussit à **Gergovie**, où César, attaquant trop vite, perd sept cents hommes et quarante-six centurions : c’est sa seule vraie défaite de la guerre, et toute la Gaule bascule.',
      },
      {
        titre: 'Alésia',
        texte:
          'Vercingétorix se replie dans l’oppidum d’**Alésia**, sur un plateau. César fait alors ce qui restera son chef-d’œuvre d’ingénieur : **deux lignes de fortifications** — quinze kilomètres tournés vers l’intérieur pour bloquer les assiégés, vingt et un kilomètres tournés vers l’extérieur pour affronter les secours —, avec fossés, palissades, tours, pieux et trous de loup. Quand l’armée de secours gauloise arrive, les Romains se battent des deux côtés à la fois. Les assauts échouent. Affamé, Vercingétorix se rend : il sort à cheval, dépose ses armes devant César. Il restera **six ans** en prison à Rome, figurera au triomphe de 46 av. J.-C., puis sera **étranglé** le jour même, selon l’usage romain.',
      },
      {
        titre: 'Ce que César en tire, ce que la Gaule devient',
        texte:
          'César sort de Gaule riche, célèbre, et surtout à la tête de **dix légions** qui lui sont personnellement fidèles. Quand le Sénat lui ordonne de les licencier, il franchit le **Rubicon** en 49 av. J.-C., déclenche la guerre civile, bat Pompée à Pharsale, devient **dictateur à vie** — et tombe sous les poignards aux **ides de mars 44 av. J.-C.** La Gaule, elle, entre dans l’Empire pour cinq siècles : **Lugdunum** (Lyon) est fondée en 43 av. J.-C. et devient la capitale des Gaules, les routes et les aqueducs se construisent, le latin remplace peu à peu le gaulois, et en **48 apr. J.-C.** l’empereur Claude — né à Lyon — fait entrer des notables gaulois au Sénat de Rome.',
      },
    ],
    consequences: [
      'La Gaule devient romaine : elle le restera cinq siècles, jusqu’aux royaumes barbares.',
      'César y gagne fortune, gloire et dix légions fidèles : c’est l’instrument de sa prise de pouvoir à Rome.',
      'Le franchissement du Rubicon en 49 av. J.-C. ouvre la guerre civile et, au bout, la fin de la République.',
      'Des villes naissent ou se romanisent : Lugdunum, Nemausus, Arelate, avec forums, thermes et amphithéâtres.',
      'Le latin s’impose lentement sur le gaulois : le français en descend directement.',
      'Vercingétorix, oublié pendant des siècles, devient au XIXᵉ siècle le premier héros de l’histoire de France.',
    ],
    chiffres: [
      { valeur: '8', quoi: 'campagnes, de 58 à 51 av. J.-C.' },
      { valeur: '36 km', quoi: 'de fortifications construites autour d’Alésia' },
      { valeur: '80 000', quoi: 'hommes assiégés dans Alésia, selon César' },
      { valeur: '1 million', quoi: 'de morts selon Plutarque — chiffre antique, invérifiable' },
    ],
    chrono: [
      { date: '58 av. J.-C.', fait: 'Les Helvètes battus à Bibracte, Arioviste rejeté.' },
      { date: '57 av. J.-C.', fait: 'Soumission des peuples belges.' },
      { date: '56 av. J.-C.', fait: 'Victoire navale sur les Vénètes d’Armorique.' },
      { date: '55 et 54 av. J.-C.', fait: 'Deux ponts sur le Rhin, deux passages en Bretagne.' },
      { date: 'hiver 54-53 av. J.-C.', fait: 'Ambiorix détruit quinze cohortes romaines.' },
      { date: 'printemps 52 av. J.-C.', fait: 'Vercingétorix soulève la Gaule ; échec de César à Gergovie.' },
      { date: 'automne 52 av. J.-C.', fait: 'Reddition de Vercingétorix à Alésia.' },
      { date: '51 av. J.-C.', fait: 'Chute d’Uxellodunum : la Gaule est soumise.' },
      { date: '49 av. J.-C.', fait: 'César franchit le Rubicon : guerre civile.' },
      { date: '46 av. J.-C.', fait: 'Vercingétorix étranglé après le triomphe de César.' },
    ],
    leSaisTu:
      'César parle de lui à la **troisième personne** d’un bout à l’autre de *La Guerre des Gaules* : « César ordonna », « César comprit ». Le procédé donne à son rapport de guerre l’allure d’un récit neutre écrit par un autre — et c’est ce texte de propagande, étudié en classe de latin depuis deux mille ans, qui reste notre principale source sur les Gaulois.',
    aRetenir: [
      'César conquiert la Gaule en huit campagnes, de 58 à 51 av. J.-C.',
      'Il raconte lui-même sa guerre dans *La Guerre des Gaules*, destiné à l’opinion romaine.',
      'En 52 av. J.-C., Vercingétorix unit les Gaulois, gagne à Gergovie, puis capitule à Alésia.',
      'La conquête donne à César la fortune et l’armée qui lui permettront de prendre le pouvoir à Rome.',
      'La Gaule devient romaine pour cinq siècles : villes, routes, latin et droit romain.',
    ],
    mots: [
      {
        mot: 'Proconsul',
        sens: 'Ancien consul chargé de gouverner une province et d’y commander les légions.',
      },
      {
        mot: 'Oppidum',
        sens: 'Ville gauloise fortifiée, installée sur une hauteur — Bibracte, Gergovie, Alésia.',
      },
      {
        mot: 'Légion',
        sens: 'Unité de base de l’armée romaine, environ 5 000 hommes, divisée en dix cohortes.',
      },
      {
        mot: 'Romanisation',
        sens: 'Adoption par les peuples conquis du mode de vie romain : langue, villes, droit, dieux.',
      },
    ],
    lies: [
      'fondation-de-rome',
      'chute-de-l-empire-romain-d-occident',
      'jules-cesar',
      'vercingetorix',
      'auguste',
    ],
    niveaux: ['6e', '2de'],
    programme: 'Conquêtes, paix romaine et romanisation',
    tags: [
      'Gaule',
      'César',
      'Vercingétorix',
      'Alésia',
      'Gergovie',
      'légion',
      'Éduens',
      'Arvernes',
      'Rubicon',
      'Bibracte',
      'oppidum',
      'romanisation',
    ],
  },
  {
    id: 'naissance-du-christianisme',
    volet: 'evenements',
    nom: 'La naissance du christianisme',
    date: 'vers 30 – 100 apr. J.-C.',
    tri: 30,
    fin: 100,
    periode: 'antiquite',
    emoji: '✝️',
    lieu: 'La Judée et la Galilée, puis tout l’Empire romain',
    accroche:
      'Un prédicateur de Galilée, une poignée de disciples, quelques lettres portées de port en port — et trois siècles plus tard, une religion dans tout l’Empire.',
    citations: [
      {
        texte: 'Rendez donc à César ce qui est à César, et à Dieu ce qui est à Dieu.',
        qui: 'Jésus de Nazareth',
        contexte:
          'À des adversaires qui lui demandent, à Jérusalem, s’il est permis de payer l’impôt à l’empereur ; Évangile selon Matthieu, 22, 21.',
        sens:
          'La réponse distingue ce qui revient au pouvoir politique et ce qui revient à Dieu : elle sera citée pendant vingt siècles dans le débat sur les rapports entre l’État et la religion.',
      },
      {
        texte:
          'Je vous donne un commandement nouveau : aimez-vous les uns les autres. Comme je vous ai aimés, vous aussi aimez-vous les uns les autres.',
        qui: 'Jésus de Nazareth',
        contexte: 'Au dernier repas avec ses disciples, la veille de sa mort ; Évangile selon Jean, 13, 34.',
        sens: 'La parole que les premières communautés placent au centre de leur vie commune.',
      },
      {
        texte:
          'Il n’y a plus ni Juif ni Grec, il n’y a plus ni esclave ni homme libre, il n’y a plus l’homme et la femme : car tous, vous n’êtes qu’un dans le Christ Jésus.',
        qui: 'Paul de Tarse',
        contexte: 'Lettre aux Galates, 3, 28, écrite vers 55 apr. J.-C. à des communautés d’Asie Mineure.',
        sens:
          'Dans une société où le rang décide de tout, la phrase annonce une égalité de tous devant Dieu : elle explique une grande part du succès du message.',
      },
      {
        texte:
          'Ils avaient coutume de se réunir à jour fixe avant le lever du soleil, de chanter tour à tour un hymne au Christ comme à un dieu, et de s’engager par serment non à quelque crime, mais à ne commettre ni vol, ni brigandage, ni adultère.',
        qui: 'Pline le Jeune',
        contexte:
          'Gouverneur de Bithynie, il écrit vers 112 à l’empereur Trajan pour savoir comment juger les chrétiens de sa province.',
        sens:
          'Le plus ancien témoignage romain sur la vie des chrétiens : il vient d’un magistrat chargé de les poursuivre, et n’a donc rien de complaisant.',
      },
    ],
    reperes: [
      'Jésus de Nazareth prêche en Galilée et en Judée vers 28-30, sous le règne de l’empereur Tibère.',
      'Il est condamné et crucifié à Jérusalem sous le préfet romain Ponce Pilate.',
      'Ses disciples annoncent sa résurrection : c’est le cœur de la foi chrétienne.',
      'Paul de Tarse porte le message aux non-Juifs, d’Antioche à Rome, et écrit les plus anciens textes chrétiens.',
      'Les quatre Évangiles sont rédigés en grec entre 65 et 100 environ.',
      'Minoritaires et parfois persécutés, les chrétiens obtiennent la liberté de culte en 313.',
    ],
    causes: [
      'La prédication de Jésus en Galilée et en Judée, et la conviction de ses disciples qu’il est ressuscité.',
      'Un judaïsme vivant et divers, où plusieurs courants attendent la venue d’un Messie envoyé par Dieu.',
      'Les communautés juives dispersées dans tout l’Empire, dont les synagogues sont les premières étapes de la prédication.',
      'La décision prise à Jérusalem vers 49-50 de ne pas imposer la Loi juive aux nouveaux croyants : le message devient universel.',
      'L’unité de l’Empire romain : des routes sûres, une monnaie, et le grec parlé d’Antioche à Rome.',
      'Un message adressé à tous — pauvres, femmes, esclaves, étrangers — dans une société où le rang décidait de tout.',
      'Des communautés organisées qui s’entraident, soignent les malades et enterrent leurs morts.',
    ],
    recit: [
      {
        titre: 'Un prédicateur en Galilée',
        texte:
          '**Jésus de Nazareth** naît sous le règne d’Hérode, en Judée, province soumise à Rome. Vers l’an 28, il reçoit le baptême de **Jean le Baptiste** dans le Jourdain et commence à parcourir la **Galilée**, région rurale du nord, avec un petit groupe de disciples dont il choisit **douze apôtres**. Il enseigne en **paraboles** — des histoires courtes tirées de la vie des champs et des maisons —, annonce le **Royaume de Dieu**, s’adresse aux pauvres, aux malades et aux exclus, et les Évangiles lui attribuent des guérisons. Monté à Jérusalem pour la fête de la Pâque, il est arrêté, jugé, et **crucifié** sous le préfet **Ponce Pilate**, vers l’an 30. La croix était le supplice réservé par Rome aux esclaves et aux rebelles.',
      },
      {
        titre: 'L’annonce de la Résurrection',
        texte:
          'Ce qui fait le christianisme n’est pas la mort de Jésus mais ce que ses disciples annoncent ensuite : qu’il est **ressuscité**. Le groupe, qui s’était dispersé, se reforme à Jérusalem autour de **Pierre** et se met à prêcher publiquement. Ces premiers croyants sont juifs, fréquentent le Temple, et forment d’abord un courant à l’intérieur du judaïsme. Les tensions viennent vite : **Étienne**, lapidé vers 36, est le premier **martyr** — mot grec qui signifie simplement *témoin*. C’est à **Antioche**, grande ville de Syrie, que les disciples reçoivent pour la première fois le nom de **chrétiens**, c’est-à-dire les partisans du Christ, du grec *khristos*, « oint », traduction de l’hébreu *messie*.',
      },
      {
        titre: 'Paul, les routes et les lettres',
        texte:
          '**Paul de Tarse**, juif de culture grecque et citoyen romain, commence par poursuivre les chrétiens ; sur la route de **Damas**, vers l’an 34, il change complètement de vie. Il devient l’infatigable voyageur de la nouvelle foi : trois grands voyages, près de **20 000 kilomètres** à pied et par mer, de Chypre à la Grèce, d’Éphèse à Corinthe, et enfin Rome. Surtout, il écrit. Ses **lettres** aux communautés qu’il a fondées, rédigées dès les années 50, sont les **plus anciens textes chrétiens conservés** — plus anciens que les Évangiles. C’est lui qui, avec Pierre et les apôtres réunis à Jérusalem vers 49-50, obtient que les non-Juifs puissent devenir chrétiens sans passer par la Loi de Moïse. Ce jour-là, une foi régionale devient une religion universelle.',
      },
      {
        titre: 'Écrire les Évangiles',
        texte:
          'Pendant une génération, l’enseignement se transmet de bouche à oreille. Puis, à mesure que les témoins directs disparaissent, on écrit. **Marc** rédige le plus court des récits vers 70, **Matthieu** et **Luc** vers 80-90, **Jean** vers la fin du siècle. Tous les quatre écrivent en **grec**, la langue commune de l’Orient romain, et s’appellent *euangelion*, « bonne nouvelle ». Avec les Actes des Apôtres, les lettres de Paul et l’Apocalypse, ils formeront les **27 livres du Nouveau Testament**, dont la liste sera fixée au IVᵉ siècle. Les chrétiens conservent aussi la Bible juive, qu’ils appellent **Ancien Testament** : le christianisme naît du judaïsme et ne cesse jamais de s’y rattacher.',
      },
      {
        titre: 'Une minorité dans l’Empire',
        texte:
          'Les chrétiens vivent dans un Empire qui tolère tous les dieux mais exige un geste : sacrifier à l’empereur, signe de loyauté politique. Ils refusent, ce qui les fait passer pour des ennemis publics. Les persécutions sont **épisodiques et locales** plus que continues : sous **Néron** en 64, après l’incendie de Rome ; sous **Dèce** en 250 ; sous **Dioclétien** à partir de **303**, la plus dure. Entre ces crises, les communautés s’organisent : elles se réunissent dans des maisons, élisent des **évêques**, partagent leurs biens, rachètent des prisonniers. Vers l’an 300, les chrétiens forment peut-être **un habitant de l’Empire sur dix**, davantage en Orient et dans les villes. La reconnaissance viendra en **313**.',
      },
    ],
    consequences: [
      'Une religion nouvelle apparaît, née du judaïsme, mais ouverte à tous les peuples de l’Empire.',
      'Les textes chrétiens — lettres de Paul, Évangiles, Actes — forment le Nouveau Testament, écrit en grec.',
      'Des communautés organisées et hiérarchisées se répandent dans les villes, avec évêques, prêtres et diacres.',
      'Le refus du culte impérial vaut aux chrétiens des persécutions épisodiques du Iᵉʳ au IVᵉ siècle.',
      'L’édit de Milan leur accorde la liberté de culte en 313 ; en 380, le christianisme devient religion officielle.',
      'Notre calendrier compte encore les années à partir de la naissance supposée de Jésus.',
    ],
    chiffres: [
      { valeur: '27', quoi: 'livres composent le Nouveau Testament' },
      { valeur: '4', quoi: 'Évangiles retenus : Matthieu, Marc, Luc et Jean' },
      { valeur: '20 000 km', quoi: 'parcourus par Paul, à pied et par mer' },
      { valeur: '1 sur 10', quoi: 'habitants de l’Empire, chrétien vers l’an 300' },
    ],
    chrono: [
      { date: 'vers 6-4 av. J.-C.', fait: 'Naissance de Jésus, sous le règne d’Hérode.' },
      { date: 'vers 28', fait: 'Baptême dans le Jourdain et début de la prédication.' },
      { date: 'vers 30', fait: 'Jésus est crucifié à Jérusalem sous Ponce Pilate.' },
      { date: 'vers 34', fait: 'Paul change de vie sur la route de Damas.' },
      { date: 'vers 49-50', fait: 'À Jérusalem, la Loi juive n’est pas imposée aux nouveaux croyants.' },
      { date: '64', fait: 'Première persécution à Rome, sous Néron.' },
      { date: 'vers 70-100', fait: 'Rédaction des quatre Évangiles, en grec.' },
      { date: 'vers 112', fait: 'Pline le Jeune décrit les chrétiens à l’empereur Trajan.' },
      { date: '303-311', fait: 'Grande persécution de Dioclétien.' },
      { date: '313', fait: 'L’édit de Milan accorde la liberté de culte.' },
    ],
    leSaisTu:
      'Le **poisson** fut le premier signe de reconnaissance des chrétiens, gravé sur les murs et les tombes. En grec, *ichthus* — poisson — forme les initiales de la phrase *Iêsous Khristos Theou Huios Sôtêr* : « Jésus-Christ, Fils de Dieu, Sauveur ». Un dessin d’enfant qui tenait une profession de foi entière.',
    aRetenir: [
      'Le christianisme naît au Iᵉʳ siècle en Judée, province de l’Empire romain.',
      'Jésus de Nazareth prêche vers 28-30 et meurt crucifié à Jérusalem sous Ponce Pilate.',
      'Ses disciples annoncent sa résurrection et fondent les premières communautés chrétiennes.',
      'Paul de Tarse porte le message aux non-Juifs et écrit les plus anciens textes chrétiens.',
      'Les quatre Évangiles sont rédigés en grec entre 65 et 100 environ.',
      'Minoritaires et parfois persécutés, les chrétiens obtiennent la liberté de culte en 313.',
    ],
    mots: [
      {
        mot: 'Évangile',
        sens: 'Du grec *euangelion*, « bonne nouvelle » : récit de la vie et de l’enseignement de Jésus.',
      },
      {
        mot: 'Apôtre',
        sens: 'Du grec « envoyé » : l’un des douze disciples chargés d’annoncer le message.',
      },
      {
        mot: 'Messie',
        sens: 'En hébreu, « celui qui a reçu l’onction » ; en grec, *khristos*, d’où le mot Christ.',
      },
      {
        mot: 'Martyr',
        sens: 'Du grec « témoin » : chrétien mis à mort pour avoir refusé de renier sa foi.',
      },
      {
        mot: 'Église',
        sens: 'Du grec *ekklêsia*, « assemblée » : la communauté des chrétiens, avant d’être un bâtiment.',
      },
    ],
    lies: ['edit-de-milan', 'jesus-de-nazareth', 'saint-paul', 'constantin'],
    niveaux: ['6e'],
    programme: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique',
    tags: [
      'christianisme',
      'Jésus',
      'Paul',
      'Évangile',
      'Judée',
      'Jérusalem',
      'apôtres',
      'Ponce Pilate',
      'persécutions',
      'Antioche',
      'Nouveau Testament',
      'monothéisme',
    ],
  },
  {
    id: 'edit-de-milan',
    volet: 'evenements',
    nom: 'L’édit de Milan',
    date: 'février 313',
    tri: 313,
    periode: 'antiquite',
    emoji: '🕊️',
    lieu: 'Milan, résidence impériale d’Occident',
    accroche:
      'Deux ans après la pire persécution de son histoire, l’Empire accorde à chacun le droit de choisir son dieu : le christianisme sort de la clandestinité.',
    citations: [
      {
        texte:
          'Nous avons décidé d’accorder aux chrétiens comme à tous les autres la liberté de suivre la religion qu’ils veulent, afin que ce qu’il y a de divinité au séjour céleste puisse être bienveillant envers nous et envers tous ceux qui sont sous notre autorité.',
        qui: 'Constantin et Licinius',
        contexte:
          'Texte du rescrit envoyé aux gouverneurs après leur rencontre de Milan, conservé par Lactance et par Eusèbe de Césarée.',
        sens:
          'Ce n’est pas une conversion de l’Empire : c’est une liberté accordée à tous les cultes, dont le culte chrétien.',
      },
      {
        texte: 'Par ce signe, tu vaincras.',
        qui: 'Constantin',
        contexte:
          'Ce que l’empereur aurait vu ou rêvé la veille de la bataille du pont Milvius, le 28 octobre 312 ; récit de Lactance, puis d’Eusèbe.',
        sens:
          '*In hoc signo vinces.* Les deux auteurs, chrétiens et postérieurs, ne racontent pas la même chose — un rêve chez l’un, une vision chez l’autre : la scène est invérifiable.',
        incertaine: true,
      },
      {
        texte:
          'Nous voulons que tous les peuples que gouverne la mesure de notre clémence professent la religion que le divin apôtre Pierre a donnée aux Romains.',
        qui: 'Théodose Iᵉʳ',
        contexte:
          'Édit de Thessalonique, 27 février 380, qui fait du christianisme la religion officielle de l’Empire.',
        sens:
          'Soixante-sept ans après la liberté accordée à tous, l’Empire ne se contente plus de tolérer : il choisit.',
      },
    ],
    reperes: [
      'Février 313 : Constantin et Licinius se rencontrent à Milan et décident la liberté de culte pour tous.',
      'Le texte n’est pas un édit au sens strict mais un rescrit, envoyé aux gouverneurs des provinces.',
      'Il ne fait pas du christianisme la religion de l’Empire : il rend tous les cultes libres.',
      'Les biens confisqués pendant la persécution sont rendus aux communautés chrétiennes, aux frais du Trésor.',
      'Il met fin à la grande persécution ouverte par Dioclétien en 303.',
      'En 380, l’édit de Thessalonique fait du christianisme la religion officielle de l’Empire.',
    ],
    causes: [
      'La grande persécution de Dioclétien, de 303 à 311 : églises rasées, livres brûlés, clercs emprisonnés — et un échec, car les chrétiens restent.',
      'L’édit de tolérance de Galère, en 311, qui reconnaissait déjà que la répression n’avait rien donné.',
      'Le nombre : vers 300, les chrétiens forment peut-être un habitant de l’Empire sur dix, et bien davantage en Orient.',
      'La victoire de Constantin au pont Milvius, le 28 octobre 312, qu’il attribue au Dieu des chrétiens.',
      'Le besoin d’unité d’un empire partagé entre plusieurs souverains : une paix religieuse est aussi une paix politique.',
    ],
    recit: [
      {
        titre: 'Dix ans de persécution',
        texte:
          'Le 23 février **303**, à Nicomédie, l’empereur **Dioclétien** fait raser l’église située en face de son palais et publie le premier de quatre édits : les lieux de culte sont détruits, les **livres saints brûlés**, les clercs emprisonnés, et tout habitant doit sacrifier aux dieux de l’Empire sous peine de mort. C’est la persécution la plus organisée qu’aient connue les chrétiens, particulièrement dure en Orient. Elle produit des **martyrs** — et aussi des *lapsi*, ceux qui cèdent, dont le sort divisera longtemps les communautés. Elle ne produit pas ce qu’on attendait d’elle : huit ans plus tard, les chrétiens sont toujours là. En **311**, **Galère**, mourant, publie un édit qui les autorise de nouveau à se réunir.',
      },
      {
        titre: 'Le pont Milvius',
        texte:
          'L’Empire est alors partagé entre plusieurs empereurs rivaux. Le **28 octobre 312**, **Constantin** affronte **Maxence** aux portes de Rome, au **pont Milvius** sur le Tibre. Les récits chrétiens — celui de **Lactance**, écrit peu après, celui d’**Eusèbe de Césarée**, bien plus tard — rapportent qu’il fit peindre sur les boucliers de ses soldats un signe reçu en rêve ou en vision : le **chrisme**, monogramme formé des deux premières lettres grecques du mot Christ. Maxence est battu et se noie dans le fleuve. Constantin attribue sa victoire au Dieu des chrétiens. Ce qu’il a vu exactement, personne ne peut le dire ; ce qu’il en a fait, en revanche, est parfaitement documenté.',
      },
      {
        titre: 'Ce que dit le texte de 313',
        texte:
          'En **février 313**, Constantin, maître de l’Occident, rencontre à **Milan** son collègue d’Orient **Licinius**. Les deux hommes s’accordent sur une décision transmise aux gouverneurs. Elle tient en trois points. D’abord, **chacun est libre de suivre la religion de son choix** — le texte vise les chrétiens, mais accorde la même liberté « à tous les autres ». Ensuite, les **lieux de culte et les biens confisqués** pendant la persécution sont restitués aux communautés, l’État indemnisant les acheteurs de bonne foi. Enfin, la mesure s’applique **immédiatement et partout**. On parle d’« édit » par habitude ; techniquement, c’est une lettre officielle. Sa portée, elle, est immense : pour la première fois, un État romain reconnaît la liberté religieuse comme un principe.',
      },
      {
        titre: 'Constantin et l’Église',
        texte:
          'Constantin va bien au-delà de la tolérance. Il rend aux évêques un pouvoir de justice, exempte le clergé de certaines charges, fait du **dimanche** un jour de repos dans tout l’Empire en **321**, et finance de grandes **basiliques** à Rome — Saint-Jean-de-Latran, Saint-Pierre — puis à Jérusalem et à Bethléem. Quand une querelle sur la nature du Christ divise les évêques, il les convoque lui-même : c’est le **concile de Nicée**, en **325**, qui réunit selon la tradition **318 évêques** et rédige le **Credo** récité aujourd’hui encore. En **330**, il fonde sur le Bosphore une capitale nouvelle, **Constantinople**. Il ne reçoit pourtant le baptême que sur son lit de mort, en **337** — un usage fréquent à l’époque, où l’on retardait le baptême jusqu’au dernier moment.',
      },
      {
        titre: 'De la liberté à la religion d’État',
        texte:
          'La suite n’est pas la liberté mais le renversement. L’empereur **Julien**, entre 361 et 363, tente de restaurer les cultes traditionnels ; il meurt trop vite. En **380**, **Théodose Iᵉʳ** publie l’**édit de Thessalonique** : le christianisme de Nicée devient la **religion officielle** de l’Empire. En **391-392**, les sacrifices païens sont interdits, les temples fermés ; en **393**, les Jeux d’Olympie s’arrêtent avec eux. Il n’a fallu que **soixante-sept ans** pour passer d’une minorité persécutée à une religion d’État — et pour que ceux qui réclamaient la tolérance cessent de l’accorder. L’édit de 313, lui, reste ce qu’il est : le premier texte par lequel un pouvoir déclare que la foi ne se commande pas.',
      },
    ],
    consequences: [
      'La persécution cesse : les chrétiens peuvent se réunir, bâtir et récupérer leurs biens confisqués.',
      'L’Église s’organise au grand jour et reçoit des privilèges : justice épiscopale, exemptions, financements impériaux.',
      'Le concile de Nicée, en 325, fixe le Credo et donne à l’Empire un rôle dans les affaires de la foi.',
      'Le dimanche devient jour de repos dans tout l’Empire dès 321.',
      'En 380, l’édit de Thessalonique fait du christianisme la religion officielle ; les cultes païens sont interdits en 392.',
      'L’Église hérite du cadre administratif romain — diocèses, provinces, latin — et lui survivra.',
    ],
    chiffres: [
      { valeur: '10 ans', quoi: 'de persécution, de 303 à la liberté de 313' },
      { valeur: '2', quoi: 'empereurs signataires : Constantin et Licinius' },
      { valeur: '318', quoi: 'évêques réunis à Nicée, selon la tradition' },
      { valeur: '67 ans', quoi: 'entre la liberté de culte et la religion d’État' },
    ],
    chrono: [
      { date: '303', fait: 'Dioclétien ouvre la grande persécution.' },
      { date: '311', fait: 'Galère, mourant, autorise de nouveau le culte chrétien.' },
      { date: '28 octobre 312', fait: 'Constantin bat Maxence au pont Milvius.' },
      { date: 'février 313', fait: 'Constantin et Licinius proclament la liberté de culte à Milan.' },
      { date: '321', fait: 'Le dimanche devient jour de repos dans l’Empire.' },
      { date: '325', fait: 'Concile de Nicée : les évêques fixent le Credo.' },
      { date: '330', fait: 'Fondation de Constantinople.' },
      { date: '337', fait: 'Constantin reçoit le baptême sur son lit de mort.' },
      { date: '380', fait: 'Théodose fait du christianisme la religion officielle.' },
      { date: '392', fait: 'Interdiction des cultes païens dans tout l’Empire.' },
    ],
    leSaisTu:
      'Constantin a gouverné vingt-cinq ans en protecteur des chrétiens sans être baptisé : il ne reçut le baptême qu’en **337**, mourant. Ce n’était pas de l’hésitation mais un usage répandu — on pensait que le baptême effaçait toutes les fautes, et beaucoup attendaient donc le dernier moment pour ne plus avoir le temps d’en commettre.',
    aRetenir: [
      'En février 313, Constantin et Licinius accordent la liberté de culte dans tout l’Empire romain.',
      'L’édit de Milan met fin à la persécution de Dioclétien et rend leurs biens aux chrétiens.',
      'Il ne fait pas du christianisme la religion officielle : il rend tous les cultes libres.',
      'Constantin réunit le concile de Nicée en 325 et fonde Constantinople en 330.',
      'En 380, l’édit de Thessalonique de Théodose fait du christianisme la religion officielle.',
    ],
    mots: [
      {
        mot: 'Édit',
        sens: 'Décision publiée par une autorité et applicable à tous ceux qui dépendent d’elle.',
      },
      {
        mot: 'Concile',
        sens: 'Assemblée d’évêques réunie pour trancher une question de foi ou d’organisation.',
      },
      {
        mot: 'Chrisme',
        sens: 'Monogramme du Christ, formé des lettres grecques khi et rhô entrelacées.',
      },
      {
        mot: 'Basilique',
        sens: 'Grand bâtiment romain rectangulaire, d’abord civil, adopté par les chrétiens pour leurs églises.',
      },
    ],
    lies: [
      'naissance-du-christianisme',
      'chute-de-l-empire-romain-d-occident',
      'constantin',
      'jesus-de-nazareth',
    ],
    niveaux: ['6e', '2de'],
    programme: 'L’Empire romain dans le monde antique',
    tags: [
      'édit de Milan',
      'Constantin',
      'Licinius',
      '313',
      'liberté de culte',
      'persécution',
      'Dioclétien',
      'pont Milvius',
      'chrisme',
      'Nicée',
      'Théodose',
      'christianisme',
    ],
  },
  {
    id: 'chute-de-l-empire-romain-d-occident',
    volet: 'evenements',
    nom: 'La chute de l’Empire romain d’Occident',
    date: '4 septembre 476',
    tri: 476,
    periode: 'antiquite',
    emoji: '🦅',
    lieu: 'Ravenne, capitale de l’Empire d’Occident',
    accroche:
      'Un officier barbare dépose un empereur de quinze ans et renvoie la couronne à Constantinople : l’Occident n’aura plus d’empereur pendant trois siècles.',
    citations: [
      {
        texte: 'Un seul empereur suffit pour les deux parties de l’Empire.',
        qui: 'Le Sénat de Rome, à l’empereur Zénon',
        contexte:
          'Message envoyé à Constantinople en 476 avec les insignes impériaux d’Occident, après la déposition de Romulus Augustule ; rapporté par l’historien Malchus.',
        sens:
          'Rome ne dit pas que l’Empire tombe : elle dit qu’il n’a plus besoin de deux têtes. Personne, en 476, n’a conscience de vivre une fin de monde.',
      },
      {
        texte: 'La Ville qui avait pris le monde entier est prise à son tour.',
        qui: 'Saint Jérôme',
        contexte:
          'Dans une lettre écrite depuis Bethléem, en apprenant le sac de Rome par les Wisigoths d’Alaric, en 410.',
        sens:
          '*Capitur Urbs quae totum cepit orbem.* Rome n’avait pas été prise depuis huit cents ans : le choc, dans tout l’Empire, fut immense.',
      },
      {
        texte:
          'Ils préfèrent vivre libres sous une apparence de captivité que captifs sous une apparence de liberté.',
        qui: 'Salvien de Marseille',
        contexte:
          'Dans *Du gouvernement de Dieu*, vers 440, à propos des Romains pauvres qui fuyaient l’impôt en se réfugiant chez les barbares.',
        sens:
          'Un prêtre romain constate que des sujets de l’Empire préfèrent les envahisseurs au percepteur : l’État s’effondre aussi de l’intérieur.',
      },
    ],
    reperes: [
      'Le 4 septembre 476, Odoacre dépose Romulus Augustule et ne prend pas le titre d’empereur.',
      'L’Empire avait été partagé entre Orient et Occident à la mort de Théodose, en 395.',
      'Rome avait déjà été pillée par les Wisigoths d’Alaric en 410, puis par les Vandales en 455.',
      'Des royaumes barbares — Wisigoths, Vandales, Burgondes, Francs — occupent déjà l’Occident en 476.',
      'L’Empire d’Orient, lui, survit près de mille ans : Constantinople ne tombe qu’en 1453.',
      'Les manuels font de 476 la fin de l’Antiquité et le début du Moyen Âge.',
    ],
    causes: [
      'La crise du IIIᵉ siècle : invasions, guerres civiles, monnaie dévaluée, villes qui se replient derrière des murailles.',
      'Le partage de 395 entre Orient et Occident : deux empires qui cessent de s’entraider, dont le plus pauvre est à l’ouest.',
      'La poussée des peuples germaniques, eux-mêmes chassés vers l’ouest par les Huns à partir de 375.',
      'Une armée où soldats et généraux sont de plus en plus germaniques, et servent d’abord leur chef.',
      'Un impôt écrasant sur les paysans, que beaucoup fuient pour se placer sous la protection d’un grand propriétaire.',
      'La perte de l’Afrique du Nord, prise par les Vandales en 439 : c’est le blé et l’argent de Rome qui s’en vont.',
      'Des empereurs d’Occident sans pouvoir réel, faits et défaits par leurs généraux : neuf en vingt et un ans.',
    ],
    recit: [
      {
        titre: 'Un empire coupé en deux',
        texte:
          'À la mort de **Théodose**, en **395**, l’Empire est partagé entre ses deux fils : **Arcadius** en Orient, **Honorius** en Occident. Le partage n’était pas censé être définitif ; il le devient. Les deux moitiés ne pèsent pas le même poids : l’Orient est riche, urbain, protégé par une capitale imprenable, **Constantinople** ; l’Occident est plus rural, plus pauvre, et sa frontière du Rhin et du Danube est immense. Honorius quitte Rome pour **Ravenne**, protégée par ses marais, en 402 — la capitale politique s’éloigne de la capitale symbolique. Désormais, chaque fois qu’un danger survient, l’Occident demande des secours à l’Orient et n’en reçoit guère.',
      },
      {
        titre: 'Les peuples en mouvement',
        texte:
          'À partir de **375**, la poussée des **Huns** venus des steppes met en marche vers l’ouest les peuples germaniques. En 378, l’armée romaine est écrasée à **Andrinople**, et l’empereur Valens tué. Dans la nuit du **31 décembre 406**, le Rhin gelé est franchi par des peuples entiers — Vandales, Suèves, Alains — qui traversent la Gaule puis l’Espagne. Le **24 août 410**, les Wisigoths d’**Alaric** entrent dans **Rome** et la pillent trois jours : la ville n’avait pas été prise depuis huit cents ans. **Attila** est arrêté de justesse aux **champs Catalauniques** en 451 par une armée mêlant Romains, Wisigoths et Francs. En **455**, les **Vandales** de Genséric, venus d’Afrique par la mer, pillent Rome à leur tour, quatorze jours durant.',
      },
      {
        titre: 'Le jour où il n’y a plus d’empereur',
        texte:
          'Dans les vingt dernières années, les empereurs d’Occident ne sont plus que des figures installées par le général qui commande l’armée — laquelle est devenue germanique. En octobre **475**, le maître de milice **Oreste** place sur le trône son propre fils, un adolescent d’une quinzaine d’années : **Romulus**, qu’on surnomme **Augustule**, « le petit Auguste ». Un an plus tard, les soldats germaniques réclament des terres, ne les obtiennent pas, et se donnent pour chef **Odoacre**. Oreste est tué ; le **4 septembre 476**, Romulus Augustule est déposé. Odoacre ne prend pas la pourpre : il renvoie les **insignes impériaux** à Constantinople et se fait reconnaître roi d’Italie. L’adolescent, lui, n’est pas exécuté — il reçoit une pension et une villa en Campanie, et l’histoire perd sa trace.',
      },
      {
        titre: 'Ce qui ne tombe pas',
        texte:
          'Parler de « chute » est commode, mais trompeur. Aucun contemporain ne note qu’un monde s’achève en 476 : on continue de dater les actes selon les consuls, de parler **latin**, de cultiver les mêmes domaines. Les rois barbares se veulent romains : **Théodoric** l’Ostrogoth gouverne l’Italie pendant trente-trois ans avec le Sénat, les lois et les fonctionnaires de Rome. L’**Église** reprend à son compte le cadre de l’Empire — les diocèses, les provinces, la langue —, et l’évêque de Rome devient peu à peu la première autorité d’Occident. En Orient, **Justinien** reconquiert même l’Italie et l’Afrique entre 533 et 553. Ce qui disparaît en 476, ce n’est pas la civilisation romaine : c’est un **poste**, celui d’empereur d’Occident.',
      },
      {
        titre: 'Pourquoi 476 ?',
        texte:
          'La date a été choisie longtemps après, par des humanistes de la Renaissance puis par les historiens du XIXᵉ siècle, parce qu’il fallait bien une borne entre l’Antiquité et le **Moyen Âge**. D’autres auraient fait l’affaire : **410** et le sac de Rome, **406** et le passage du Rhin, **751** et la naissance des Carolingiens, **800** et le couronnement de **Charlemagne** qui relève le titre d’empereur d’Occident, ou **1453** et la prise de **Constantinople**, où l’on se disait romain jusqu’au dernier jour. Les dates rondes des manuels sont des repères utiles, pas des événements vécus. En 476, un officier a déposé un enfant, et personne en Italie n’a pensé que l’Antiquité venait de finir.',
      },
    ],
    consequences: [
      'L’Occident n’a plus d’empereur : le pouvoir passe aux rois barbares, dont Clovis chez les Francs dès 481.',
      'L’Empire d’Orient, seul héritier, se maintient jusqu’à la prise de Constantinople en 1453.',
      'L’Église reprend l’organisation romaine — diocèses, provinces, latin — et devient la première autorité d’Occident.',
      'Les villes se vident et se rétrécissent : Rome passe d’un million d’habitants au IIᵉ siècle à 50 000 au VIᵉ.',
      'Le latin cesse d’être une langue commune et se fragmente peu à peu en langues romanes.',
      'Les manuels placent ici la frontière entre l’Antiquité et le Moyen Âge.',
    ],
    chiffres: [
      { valeur: '1 229 ans', quoi: 'entre la fondation légendaire de Rome et 476' },
      { valeur: '9', quoi: 'empereurs d’Occident en vingt et un ans, de 455 à 476' },
      { valeur: '1 million', quoi: 'd’habitants à Rome au IIᵉ siècle, 50 000 au VIᵉ' },
      { valeur: '977 ans', quoi: 'de survie pour l’Empire d’Orient après 476' },
    ],
    chrono: [
      { date: '375', fait: 'Les Huns poussent les peuples germaniques vers l’ouest.' },
      { date: '378', fait: 'Désastre romain d’Andrinople contre les Goths.' },
      { date: '395', fait: 'Mort de Théodose : l’Empire est partagé en deux.' },
      { date: '31 décembre 406', fait: 'Le Rhin gelé est franchi par des peuples entiers.' },
      { date: '24 août 410', fait: 'Alaric et ses Wisigoths pillent Rome.' },
      { date: '439', fait: 'Les Vandales prennent Carthage : l’Afrique est perdue.' },
      { date: '451', fait: 'Attila arrêté aux champs Catalauniques.' },
      { date: '455', fait: 'Sac de Rome par les Vandales de Genséric.' },
      { date: '4 septembre 476', fait: 'Odoacre dépose Romulus Augustule.' },
      { date: '481', fait: 'Clovis devient roi des Francs.' },
      { date: '1453', fait: 'Constantinople tombe : l’Empire d’Orient s’éteint.' },
    ],
    leSaisTu:
      'Le dernier empereur d’Occident portait les deux noms les plus lourds de l’histoire romaine : **Romulus**, comme le fondateur de la Ville, et **Auguste**, comme le premier empereur — le tout au diminutif, **Augustule**, « le petit Auguste », un surnom moqueur donné par ses contemporains. Rome s’est achevée sur le nom par lequel elle avait commencé.',
    aRetenir: [
      'Le 4 septembre 476, Odoacre dépose Romulus Augustule, dernier empereur d’Occident.',
      'L’Empire avait été partagé entre Orient et Occident à la mort de Théodose, en 395.',
      'Les causes sont longues : crise économique, poussée des peuples germaniques, armée barbarisée.',
      'Rome est pillée en 410 par les Wisigoths d’Alaric, puis en 455 par les Vandales.',
      'L’Empire d’Orient survit jusqu’à la prise de Constantinople, en 1453.',
      'La date de 476 est un repère de manuel : fin de l’Antiquité, début du Moyen Âge.',
    ],
    mots: [
      {
        mot: 'Barbare',
        sens: 'Pour les Grecs puis les Romains, l’étranger qui ne parle ni grec ni latin — pas forcément un sauvage.',
      },
      {
        mot: 'Limes',
        sens: 'La frontière fortifiée de l’Empire romain, jalonnée de camps, de routes et de tours de guet.',
      },
      {
        mot: 'Fédérés',
        sens: 'Peuples installés dans l’Empire par traité, qui reçoivent des terres et fournissent des soldats.',
      },
      {
        mot: 'Insignes impériaux',
        sens: 'Le diadème et la pourpre, marques du pouvoir : Odoacre les renvoie à Constantinople en 476.',
      },
    ],
    lies: [
      'conquete-de-la-gaule',
      'edit-de-milan',
      'fondation-de-rome',
      'constantin',
    ],
    niveaux: ['6e'],
    programme: 'L’Empire romain dans le monde antique',
    tags: [
      '476',
      'Odoacre',
      'Romulus Augustule',
      'Rome',
      'barbares',
      'Wisigoths',
      'Alaric',
      'Vandales',
      'Attila',
      'Ravenne',
      'Constantinople',
      'Moyen Âge',
    ],
  },
]
