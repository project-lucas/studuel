// -----------------------------------------------------------------------------
// TEMPS MODERNES — LE MONDE. Les six événements qui font basculer l'Europe hors
// d'elle-même entre 1450 et 1800 : une machine à copier les livres, un océan
// traversé, une Église coupée en deux, un empire abattu, un globe bouclé, et le
// commerce qui déporte douze millions d'hommes.
//
// Deux de ces fiches touchent à des sujets lourds — la conquête du Mexique et
// la traite atlantique. La consigne de `docs/encyclopedie.md` § 3 y vaut sans
// aménagement : FACTUEL, PRÉCIS ET SOBRE. Les chiffres portent plus loin que
// l'indignation, et un élève retient un tonnage de girofle ou un taux de
// mortalité bien mieux qu'un adjectif. Le rétablissement de l'esclavage en 1802
// appartient à la fiche `abolition-de-l-esclavage-1794` et n'est pas développé
// ici.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_TEMPS_MODERNES_MONDE: Evenement[] = [
  {
    id: 'invention-de-l-imprimerie',
    volet: 'evenements',
    nom: 'L’invention de l’imprimerie',
    date: 'vers 1450',
    tri: 1450,
    periode: 'temps-modernes',
    emoji: '🖨️',
    lieu: 'Mayence, Saint-Empire romain germanique',
    accroche:
      'Un orfèvre de Mayence fond des lettres en métal : le livre passe d’un an de copie à quelques jours, et l’Europe change de vitesse.',
    citations: [
      {
        texte: 'L’imprimerie est le plus grand et le dernier don de Dieu.',
        qui: 'Martin Luther',
        contexte:
          'Dans ses *Propos de table*, vers 1530, par l’homme dont les écrits se sont vendus par centaines de milliers d’exemplaires en quatre ans.',
      },
      {
        texte:
          'Un certain Jean, surnommé Gutenberg, a le premier de tous inventé l’art d’imprimer, par lequel les livres se font non avec un roseau, comme faisaient les anciens, ni avec une plume, mais avec des lettres de métal.',
        qui: 'Guillaume Fichet',
        contexte:
          'Lettre du recteur de la Sorbonne à Robert Gaguin, Paris, 1470, l’année où la première presse parisienne s’installe.',
        sens:
          'C’est l’un des tout premiers textes à nommer Gutenberg comme inventeur : lui-même n’a signé aucun de ses livres.',
      },
      {
        texte:
          'Maintenant toutes disciplines sont restituées, les langues instaurées, et l’impression tant élégante et correcte en usance, qui a été inventée de mon âge par inspiration divine.',
        qui: 'Rabelais',
        contexte: 'Lettre de Gargantua à son fils Pantagruel, dans *Pantagruel*, 1532.',
        sens:
          'Pour un homme de la Renaissance, l’imprimerie n’est pas une machine de plus : c’est le signe que le savoir antique revient et qu’une époque recommence.',
      },
    ],
    reperes: [
      'Avant 1450, un livre se copie à la main : environ un an de travail pour une Bible.',
      'Gutenberg est orfèvre : il sait fondre un alliage de plomb, d’étain et d’antimoine.',
      'Son invention n’est pas la presse mais le **caractère mobile** fondu en série, tous identiques.',
      'La Bible à 42 lignes, vers 1455, est tirée à environ 180 exemplaires.',
      'En 1500, près de 250 villes d’Europe ont une imprimerie et 20 millions de livres circulent.',
      'Gutenberg perd son atelier au profit de son bailleur de fonds, Johann Fust, en 1455.',
    ],
    causes: [
      'Une demande de livres qui explose : universités, écoles de ville, marchands, juristes, clercs — les copistes ne suivent plus.',
      'L’arrivée du **papier** en Europe, bien moins cher que le parchemin : des moulins à papier tournent en Italie et en Rhénanie depuis le XIVᵉ siècle.',
      'Des techniques déjà là, mais partielles : la gravure sur bois (xylographie) imprime des images, la presse à vis presse le raisin et le papier.',
      'Le savoir-faire des orfèvres et des monnayeurs rhénans : graver un poinçon, frapper une matrice, couler un alliage au point de fusion bas.',
      'Le capital : Gutenberg emprunte 1 600 florins au marchand Johann Fust, l’équivalent de plusieurs maisons.',
      'Le besoin de textes strictement identiques — Bibles, missels, indulgences, lois — que la copie à la main ne garantit jamais.',
    ],
    recit: [
      {
        titre: 'Ce que coûte un livre avant 1450',
        texte:
          'Un livre du Moyen Âge est un objet de luxe. Il se copie à la main, sur du **parchemin** — de la peau de veau ou de mouton : il en faut le troupeau d’une petite ferme pour une Bible. Un copiste expérimenté écrit deux à quatre pages par jour ; une Bible complète lui prend **environ un an**. Dans un monastère ou dans un atelier d’université, chaque exemplaire coûte donc le prix d’une maison, et chacun diffère du voisin : à chaque copie s’ajoutent des fautes, qui se recopient à leur tour. Résultat : les bibliothèques les plus riches d’Europe comptent quelques centaines de volumes, et un étudiant ne possède presque jamais les textes qu’il étudie — il les écoute, et il les apprend par cœur.',
      },
      {
        titre: 'L’idée de Mayence : des lettres qui se démontent',
        texte:
          'Vers 1450, **Johannes Gutenberg**, orfèvre de Mayence, réunit dans un seul atelier des techniques qui existaient séparément. Sa vraie invention n’est pas la presse : c’est le **caractère mobile fondu**. Il grave une lettre en relief sur un poinçon d’acier, la frappe dans une plaque de cuivre tendre pour obtenir une **matrice**, puis coule dans cette matrice un alliage de **plomb, d’étain et d’antimoine** — un métal qui fond bas, se solidifie vite et ne se déforme pas sous la presse. Le moule à hauteur réglable permet de sortir mille « a » rigoureusement identiques. Restent deux problèmes qu’il résout aussi : une **encre grasse**, à base d’huile de lin et de noir de fumée, qui accroche au métal là où l’encre à l’eau glisse ; et une **presse à vis**, empruntée aux pressoirs, qui applique une force régulière sur toute la page. On compose, on imprime, on démonte, on recompose : la même casse de lettres sert à tous les livres du monde.',
      },
      {
        titre: 'La Bible à 42 lignes, et le procès',
        texte:
          'Le chef-d’œuvre sort de l’atelier vers **1455** : la **Bible à 42 lignes**, deux colonnes, 1 282 pages, tirée à environ **180 exemplaires** — une trentaine sur parchemin, le reste sur papier. Elle imite si bien le manuscrit que les acheteurs font peindre à la main les lettrines et les décors. La même année, Fust réclame son argent et gagne son procès : l’atelier, les presses et les caractères lui reviennent. Gutenberg meurt en 1468, pensionné par l’archevêque de Mayence, sans qu’aucun livre porte son nom. C’est Fust et son gendre **Peter Schöffer** qui publient en 1457 le premier livre daté et signé, le *Psautier de Mayence*. Et c’est le **sac de Mayence** en 1462 qui disperse les ouvriers de l’atelier dans toute l’Europe — la meilleure publicité que l’invention pouvait recevoir.',
      },
      {
        titre: 'Cinquante ans pour couvrir l’Europe',
        texte:
          'Les presses suivent les routes du commerce. **Cologne en 1465**, Rome en 1467, **Venise en 1469**, **Paris en 1470** — à la Sorbonne, appelée par Guillaume Fichet et Johann Heynlin —, Lyon en 1473, Westminster en 1476 avec **William Caxton**. Venise devient la capitale du livre : **Alde Manuce** y invente vers 1500 le caractère *italique* et le format de poche, des in-octavo qu’on emporte à cheval. En **1500**, près de **250 villes** ont au moins un atelier, plus d’un millier de presses tournent, et l’on estime à **20 millions** le nombre de livres imprimés avant cette date — les **incunables**. Le prix d’un volume a été divisé par dix ou vingt. Pour la première fois, un artisan aisé peut posséder un livre.',
      },
      {
        titre: 'Ce qu’un livre bon marché rend possible',
        texte:
          'Tout ce qui suit passe par la presse. Les **95 thèses** de Luther, écrites en latin en octobre 1517, sont traduites, imprimées et lues dans tout l’Empire en quelques semaines : sans imprimerie, la Réforme serait restée une querelle d’université. Le **De revolutionibus** de Copernic (1543) et le traité d’anatomie de Vésale, la même année, circulent avec leurs figures exactes — et une figure exacte, reproduite à l’identique, est un instrument scientifique. Les **langues nationales** se fixent parce qu’on imprime : la Bible de Luther fait l’allemand écrit, l’ordonnance de Villers-Cotterêts (1539) impose le français dans les actes. Les pouvoirs comprennent très vite, eux aussi : censure royale, autorisation préalable, et en **1559** l’*Index* des livres interdits par Rome. On ne contrôle plus la copie, on tente de contrôler la presse.',
      },
    ],
    consequences: [
      'Le prix du livre s’effondre : un savoir jusque-là réservé aux clercs et aux riches devient achetable.',
      'Les textes deviennent identiques d’un exemplaire à l’autre : la science peut enfin discuter des mêmes pages et des mêmes figures.',
      'La Réforme se propage en semaines et non en décennies : l’imprimerie est l’outil décisif de 1517.',
      'Les langues nationales se fixent par l’orthographe imprimée, au détriment du latin et des parlers locaux.',
      'L’alphabétisation progresse, d’abord dans les villes et dans les pays protestants où l’on doit lire la Bible soi-même.',
      'Les pouvoirs inventent la censure moderne : privilège d’impression, autorisation préalable, Index des livres interdits en 1559.',
    ],
    chiffres: [
      { valeur: '1 an', quoi: 'de travail pour copier une Bible à la main' },
      { valeur: '180', quoi: 'exemplaires de la Bible à 42 lignes, vers 1455' },
      { valeur: '250', quoi: 'villes d’Europe pourvues d’une imprimerie en 1500' },
      { valeur: '20 millions', quoi: 'de livres imprimés en Europe avant 1501' },
    ],
    chrono: [
      { date: 'vers 1400', fait: 'Naissance de Johannes Gutenberg à Mayence.' },
      { date: '1438', fait: 'Premiers essais à Strasbourg, tenus secrets.' },
      { date: '1450', fait: 'Fust prête 1 600 florins : l’atelier de Mayence s’équipe.' },
      { date: 'vers 1455', fait: 'La Bible à 42 lignes ; Fust gagne son procès.' },
      { date: '1457', fait: 'Psautier de Mayence, premier livre daté et signé.' },
      { date: '1462', fait: 'Le sac de Mayence disperse les imprimeurs en Europe.' },
      { date: '1470', fait: 'Première presse parisienne, installée à la Sorbonne.' },
      { date: '1476', fait: 'Caxton imprime en anglais à Westminster.' },
      { date: 'vers 1500', fait: 'Alde Manuce invente l’italique et le livre de poche.' },
      { date: '1559', fait: 'Rome publie l’Index des livres interdits.' },
    ],
    leSaisTu:
      'Gutenberg n’a signé aucun livre. On ne connaît son rôle que par les pièces d’un procès : l’acte notarié de 1455, dit « instrument Helmasperger », où Fust réclame son argent. L’homme qui a permis d’imprimer des millions de noms n’a laissé le sien que dans un dossier de tribunal.',
    aRetenir: [
      'Vers 1450, Gutenberg met au point à Mayence l’imprimerie à caractères mobiles en métal.',
      'Son invention tient à trois choses : la lettre fondue en série, l’encre grasse et la presse à vis.',
      'La Bible à 42 lignes, vers 1455, est le premier grand livre imprimé d’Europe.',
      'En 1500, environ 20 millions de livres — les incunables — circulent dans près de 250 villes.',
      'L’imprimerie rend possibles la diffusion de la Réforme, la science moderne et la fixation des langues nationales.',
    ],
    mots: [
      {
        mot: 'Caractère mobile',
        sens: 'Lettre en métal fondue à l’unité, qu’on assemble pour composer une page puis qu’on redistribue.',
      },
      {
        mot: 'Incunable',
        sens: 'Livre imprimé avant 1501, du latin *incunabula*, « le berceau » : les premiers pas de l’imprimerie.',
      },
      {
        mot: 'Xylographie',
        sens: 'Impression à partir d’une planche de bois gravée d’un seul bloc, image et texte compris.',
      },
      {
        mot: 'Colophon',
        sens: 'Note de fin de livre donnant le nom de l’imprimeur, le lieu et la date.',
      },
    ],
    lies: ['gutenberg', 'reforme-protestante', 'martin-luther', 'leonard-de-vinci'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, réformes et conflits religieux (XVᵉ – XVIᵉ siècle)',
    tags: [
      'imprimerie',
      'Gutenberg',
      'Mayence',
      'caractères mobiles',
      'incunable',
      'Bible à 42 lignes',
      'livre',
      'Renaissance',
      'Alde Manuce',
      'presse',
    ],
  },
  {
    id: 'decouverte-de-l-amerique',
    volet: 'evenements',
    nom: 'La découverte de l’Amérique',
    date: '12 octobre 1492',
    tri: 1492,
    periode: 'temps-modernes',
    emoji: '⛵',
    lieu: 'Guanahani, îles Lucayes (Bahamas)',
    accroche:
      'Trois navires cherchent l’Asie par l’ouest et butent sur un continent que l’Europe ignorait : deux mondes se rencontrent, et aucun ne s’en remettra.',
    citations: [
      {
        texte: 'Terre ! Terre !',
        qui: 'Rodrigo de Triana, vigie de la Pinta',
        contexte:
          'Vers deux heures du matin, le 12 octobre 1492, après trente-six jours sans rien voir d’autre que l’océan.',
        sens:
          'Le marin ne touchera jamais la rente promise au premier qui verrait la terre : Colomb la réclame pour lui, affirmant avoir aperçu une lueur la veille au soir.',
      },
      {
        texte:
          'Ils ne portent ni ne connaissent les armes de fer : je leur ai montré des épées, et ils les ont prises par le tranchant, se coupant par ignorance. Avec cinquante hommes, on les soumettrait tous et on leur ferait faire tout ce qu’on voudrait.',
        qui: 'Christophe Colomb',
        contexte: 'Journal de bord, 12 et 14 octobre 1492, à propos des Taïnos de Guanahani.',
        sens:
          'En deux jours, la description a tourné au calcul militaire : la conquête est pensée dès la première semaine de la rencontre.',
      },
      {
        texte:
          'J’ai trouvé un très grand nombre d’îles peuplées d’innombrables habitants, et j’en ai pris possession toutes pour Leurs Altesses, sans que personne s’y oppose.',
        qui: 'Christophe Colomb',
        contexte:
          'Lettre à Luis de Santángel, février 1493, imprimée et traduite dans toute l’Europe en quelques mois.',
      },
      {
        texte:
          'Ces contrées, il est permis de les appeler un Nouveau Monde, car nos ancêtres n’en ont eu aucune connaissance.',
        qui: 'Amerigo Vespucci',
        contexte: 'Dans *Mundus Novus*, 1503.',
        sens:
          'Comprendre que ce n’est pas l’Asie, c’est ce que Colomb n’a jamais admis. En 1507, le cartographe Waldseemüller baptise le continent « Amérique », du prénom de Vespucci.',
      },
    ],
    reperes: [
      'Colomb ne cherche pas un continent : il cherche le Japon et la Chine par l’ouest.',
      'Il se trompe de moitié sur la taille de la Terre et croit l’Asie à 4 500 km des Canaries.',
      'Départ de Palos le 3 août 1492 : la Santa María, la Pinta et la Niña, environ 90 hommes.',
      'Terre en vue le 12 octobre 1492 : une île des Lucayes, qu’il nomme San Salvador.',
      'Il fait quatre voyages et meurt en 1506 persuadé d’avoir atteint les Indes.',
      'Le traité de Tordesillas (1494) partage le monde à découvrir entre Espagne et Portugal.',
    ],
    causes: [
      'La chute de Constantinople (1453) et le contrôle ottoman des routes de terre renchérissent les épices venues d’Asie.',
      'L’avance portugaise : Bartolomeu Dias double le cap de Bonne-Espérance en 1488 — la route de l’est est prise, l’Espagne doit chercher ailleurs.',
      'Une idée ancienne et juste, la sphéricité de la Terre, combinée à une erreur énorme : Colomb sous-estime sa circonférence d’un tiers et raccourcit d’autant la distance de l’Asie.',
      'Les progrès techniques : la **caravelle** et sa voile latine qui remonte au vent, l’astrolabe de mer, la boussole, les cartes portulans.',
      'La fin de la **Reconquista** : Grenade tombe le 2 janvier 1492 et libère l’argent, les hommes et l’ambition des Rois Catholiques.',
      'Les Capitulations de Santa Fe du 17 avril 1492 : Colomb obtient le titre d’amiral, le gouvernement des terres trouvées et le dixième des richesses.',
      'Le mirage de Cipango : l’or du Japon décrit par Marco Polo, et le projet de prendre l’islam à revers en convertissant le Grand Khan.',
    ],
    recit: [
      {
        titre: 'Sept ans à chercher un bailleur de fonds',
        texte:
          'Génois, marin depuis l’adolescence, **Christophe Colomb** s’appuie sur les cartes du Florentin **Toscanelli** et sur un raisonnement simple : si la Terre est ronde, on atteint l’Asie en naviguant vers l’ouest. Le calcul, lui, est faux. Il prend le mille arabe pour le mille italien, retient la circonférence la plus courte jamais proposée, et conclut que le Japon est à **4 500 kilomètres** des Canaries — il y en a près de 19 000. Les experts consultés par le roi du Portugal en 1485, puis par la junte de Salamanque, ne se trompent pas : ils refusent le projet parce que la distance est trop grande. Colomb a tort, ses contradicteurs ont raison, et c’est lui qui part — parce qu’un continent inconnu se trouve à la distance où il croyait trouver l’Asie.',
      },
      {
        titre: 'Trente-six jours sans terre',
        texte:
          'Le **3 août 1492**, trois navires quittent Palos de la Frontera : la **Santa María**, une nef lourde, et deux caravelles, la **Pinta** et la **Niña**, avec environ **90 hommes**. Escale aux Canaries pour réparer un gouvernail, puis départ de La Gomera le 6 septembre. Colomb a la chance ou le flair de prendre la route des **alizés**, ces vents d’est réguliers qui poussent droit vers l’ouest. Il tient deux estimes : la vraie pour lui, une minorée pour l’équipage, afin que les hommes ne s’affolent pas de l’éloignement — et c’est la fausse qui se révélera la plus proche de la réalité. Début octobre, la mer reste vide, la mutinerie gronde ; Colomb promet de faire demi-tour sous trois jours. Le 11 au soir, on repêche une branche verte et un bâton taillé. À **deux heures du matin le 12 octobre**, la vigie de la Pinta crie la terre.',
      },
      {
        titre: 'Guanahani, et ce qui s’y joue',
        texte:
          'L’île s’appelle **Guanahani** ; Colomb la nomme **San Salvador**, plante la bannière royale et en prend possession au nom des Rois Catholiques devant ses habitants, les **Taïnos**, qui ne comprennent ni la langue ni le geste. Les échanges commencent par des bonnets rouges, des grelots et des perles de verre contre des perroquets, du coton et des pelotes de fil. Colomb cherche l’or et ne trouve que quelques anneaux de nez ; on lui montre le sud. Il longe Cuba — qu’il prend pour la Chine — puis **Hispaniola** (Haïti et Saint-Domingue). La nuit de Noël, la Santa María s’échoue sur un récif ; de son bois, on bâtit le fort de **La Navidad**, où **trente-neuf hommes** restent. Ils seront tous morts au retour de Colomb : c’est le premier établissement européen d’Amérique et le premier conflit.',
      },
      {
        titre: 'La lettre qui fait le tour de l’Europe',
        texte:
          'Colomb rentre à Palos le **15 mars 1493**. Sa lettre à Luis de Santángel, trésorier d’Aragon, est imprimée à Barcelone, puis traduite en latin, en toscan, en allemand : **une douzaine d’éditions en un an**. L’imprimerie, née quarante ans plus tôt, transforme un rapport de voyage en événement européen. Les conséquences diplomatiques suivent immédiatement : le pape Alexandre VI trace en **1493** une ligne de partage par la bulle *Inter caetera*, que le Portugal juge trop favorable à l’Espagne. Le **7 juin 1494**, le **traité de Tordesillas** reporte la ligne à 370 lieues à l’ouest des îles du Cap-Vert. Deux royaumes s’attribuent la moitié d’un globe qu’ils n’ont pas parcouru — et c’est pour cette raison que le Brésil parle portugais.',
      },
      {
        titre: 'Ce que Colomb n’a pas su, et ce qui a suivi',
        texte:
          'Colomb fait quatre voyages (1492, 1493, 1498, 1502), touche l’Orénoque et l’Amérique centrale, gouverne mal Hispaniola au point d’être ramené aux fers en 1500, et meurt à Valladolid en **1506** convaincu jusqu’au bout d’avoir atteint les Indes. Ce sont d’autres qui comprennent : **Amerigo Vespucci** écrit en 1503 qu’il s’agit d’un *Mundus Novus*, et en **1507** le cartographe lorrain **Waldseemüller** inscrit sur sa mappemonde le mot « America ». Pour les habitants, la rencontre est une catastrophe : ils n’ont aucune immunité contre la variole, la rougeole, la grippe et le typhus. Les Taïnos d’Hispaniola, plusieurs centaines de milliers en 1492, ne sont plus que quelques milliers trente ans plus tard. Le dominicain **Bartolomé de Las Casas**, d’abord colon puis leur défenseur, en fait le récit dès 1542.',
      },
    ],
    consequences: [
      'Deux mondes séparés depuis des millénaires entrent en contact : c’est le début de l’**échange colombien** (maïs, pomme de terre, tomate, cacao, tabac vers l’Europe ; blé, canne à sucre, chevaux, bœufs vers l’Amérique).',
      'Effondrement démographique des populations amérindiennes, tué d’abord par les microbes : la variole, la rougeole et la grippe font des ravages sans équivalent connu.',
      'Le traité de Tordesillas (1494) partage le monde entre l’Espagne et le Portugal : le Brésil deviendra portugais.',
      'L’argent des mines américaines, à partir de Potosí (1545), inonde l’Europe et provoque un siècle de hausse des prix.',
      'Le besoin de main-d’œuvre dans les plantations ouvre la traite atlantique des Africains.',
      'Le continent prend en 1507 le nom d’Amérique, et l’existence d’un « Nouveau Monde » bouscule la géographie, la théologie et la philosophie européennes.',
    ],
    chiffres: [
      { valeur: '3', quoi: 'navires : la Santa María, la Pinta et la Niña' },
      { valeur: '36 jours', quoi: 'sans voir la terre entre La Gomera et Guanahani' },
      { valeur: '10 %', quoi: 'des richesses promises à Colomb par les Capitulations de Santa Fe' },
      { valeur: '4', quoi: 'voyages de Colomb, sans qu’il admette jamais que ce n’est pas l’Asie' },
    ],
    chrono: [
      { date: '1488', fait: 'Dias double le cap de Bonne-Espérance pour le Portugal.' },
      { date: '2 janvier 1492', fait: 'Grenade tombe : la Reconquista est achevée.' },
      { date: '17 avril 1492', fait: 'Capitulations de Santa Fe signées avec Colomb.' },
      { date: '3 août 1492', fait: 'Départ de Palos de la Frontera.' },
      { date: '12 octobre 1492', fait: 'Terre en vue : Guanahani, nommée San Salvador.' },
      { date: '25 décembre 1492', fait: 'La Santa María s’échoue ; on bâtit le fort de La Navidad.' },
      { date: '15 mars 1493', fait: 'Retour à Palos ; la lettre est imprimée dans toute l’Europe.' },
      { date: '7 juin 1494', fait: 'Traité de Tordesillas : le monde partagé en deux.' },
      { date: '1503', fait: 'Vespucci publie *Mundus Novus*.' },
      { date: '1507', fait: 'Waldseemüller nomme le continent « Amérique ».' },
    ],
    leSaisTu:
      'Les Rois Catholiques avaient promis 10 000 maravédis de rente à vie au premier homme qui verrait la terre. Rodrigo de Triana a crié le premier — mais Colomb s’attribua la récompense, affirmant avoir aperçu la veille au soir « comme une petite chandelle » à l’horizon. Le marin ne toucha rien.',
    aRetenir: [
      'Le 12 octobre 1492, l’expédition de Christophe Colomb atteint l’île de Guanahani, aux Bahamas.',
      'Colomb cherchait l’Asie par l’ouest : il se trompait d’un tiers sur la circonférence de la Terre.',
      'Partie de Palos le 3 août 1492, l’expédition compte trois navires et environ 90 hommes.',
      'Le traité de Tordesillas (1494) partage les terres à découvrir entre l’Espagne et le Portugal.',
      'La rencontre provoque l’échange colombien et l’effondrement démographique des Amérindiens, tués surtout par les maladies.',
      'Le continent est nommé Amérique en 1507, d’après le prénom d’Amerigo Vespucci.',
    ],
    mots: [
      {
        mot: 'Caravelle',
        sens: 'Petit navire rapide à voiles latines, capable de remonter au vent et de longer les côtes.',
      },
      {
        mot: 'Capitulations',
        sens: 'Contrat signé entre un souverain et un navigateur, fixant d’avance ses titres et sa part des richesses.',
      },
      {
        mot: 'Échange colombien',
        sens: 'Circulation, après 1492, des plantes, des animaux, des hommes et des microbes entre l’Amérique et le reste du monde.',
      },
      {
        mot: 'Taïnos',
        sens: 'Peuple des Grandes Antilles rencontré par Colomb, cultivateurs de manioc, disparus au XVIᵉ siècle.',
      },
    ],
    lies: [
      'christophe-colomb',
      'premier-tour-du-monde',
      'conquete-de-l-empire-azteque',
      'traite-atlantique-et-code-noir',
      'chute-de-constantinople',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Transformations de l’Europe et ouverture sur le monde (XVIᵉ – XVIIᵉ siècle)',
    tags: [
      'Colomb',
      'Amérique',
      '1492',
      'Grandes découvertes',
      'caravelle',
      'Santa María',
      'Tordesillas',
      'Taïnos',
      'San Salvador',
      'Vespucci',
      'Nouveau Monde',
    ],
  },
  {
    id: 'reforme-protestante',
    volet: 'evenements',
    nom: 'La Réforme protestante',
    date: '31 octobre 1517 – 1555',
    tri: 1517,
    fin: 1555,
    periode: 'temps-modernes',
    emoji: '✝️',
    lieu: 'Wittemberg, le Saint-Empire et l’Europe',
    accroche:
      'Un moine allemand conteste la vente des indulgences : trente-huit ans plus tard, la chrétienté d’Occident est coupée en deux, et pour longtemps.',
    citations: [
      {
        texte:
          'Ils prêchent des inventions humaines, ceux qui disent qu’aussitôt que l’argent tinte dans la caisse, l’âme s’envole du purgatoire.',
        qui: 'Martin Luther',
        contexte: 'Thèse 27 des *Quatre-vingt-quinze thèses*, Wittemberg, 31 octobre 1517.',
        sens:
          'Luther vise le slogan des prédicateurs d’indulgences et, derrière lui, l’idée qu’un paiement puisse abréger une peine dans l’au-delà.',
      },
      {
        texte:
          'Je ne peux ni ne veux me rétracter en rien, car il n’est ni sûr ni honnête d’agir contre sa conscience. Me voici. Je ne puis autrement. Que Dieu me soit en aide.',
        qui: 'Martin Luther',
        contexte: 'Devant Charles Quint, à la diète de Worms, le 18 avril 1521.',
        sens:
          'Le début, sur la conscience, est attesté par les procès-verbaux. Les trois dernières phrases n’apparaissent que dans une édition imprimée peu après.',
        incertaine: true,
      },
      {
        texte:
          'Un seul frère qui se dresse contre l’opinion de toute la chrétienté se trompe forcément ; sinon, c’est la chrétienté entière qui se serait trompée pendant mille ans.',
        qui: 'Charles Quint',
        contexte: 'Déclaration écrite de sa main le lendemain de la comparution de Luther, 19 avril 1521.',
      },
      {
        texte: 'En connaissant Dieu, chacun de nous aussi se connaisse.',
        qui: 'Jean Calvin',
        contexte:
          'Ouverture de l’*Institution de la religion chrétienne*, première édition française, 1541.',
        sens:
          'Calvin écrit en français une théologie complète : la langue du peuple sert désormais à discuter de Dieu, et sa prose fonde le français savant.',
      },
    ],
    reperes: [
      'Le 31 octobre 1517, Luther publie 95 thèses contre la vente des indulgences.',
      'Excommunié en janvier 1521, mis au ban de l’Empire à Worms en avril, il est caché à la Wartbourg.',
      'Il y traduit le Nouveau Testament en allemand en onze semaines : la Bible devient lisible par tous.',
      'Le mot « protestant » vient de la protestation de six princes à la diète de Spire, en 1529.',
      'Calvin organise à Genève, à partir de 1541, la seconde grande Église réformée.',
      'La paix d’Augsbourg (1555) laisse chaque prince allemand choisir la religion de son État.',
    ],
    causes: [
      'Des abus dénoncés depuis un siècle dans l’Église : cumul des bénéfices, évêques absents de leur diocèse, curés mal formés, charges achetées.',
      'La campagne d’**indulgences** de 1515-1517, destinée à financer la basilique Saint-Pierre de Rome et à rembourser la dette d’un archevêque allemand : elle est prêchée en Allemagne par le dominicain Tetzel avec des méthodes de foire.',
      'L’angoisse du salut, très forte à la fin du Moyen Âge : peur de l’enfer, comptabilité des peines du purgatoire — c’est là-dessus que Luther bute personnellement avant d’y répondre par la **justification par la foi**.',
      'L’humanisme et le retour aux sources : Érasme publie en 1516 le Nouveau Testament en grec, et la philologie montre des contresens dans la traduction latine en usage.',
      'L’imprimerie, qui transforme une dispute d’université en affaire européenne : les écrits de Luther se diffusent à des centaines de milliers d’exemplaires avant 1521.',
      'L’intérêt des princes allemands : se libérer de la tutelle de Rome et de l’empereur, et mettre la main sur les biens de l’Église.',
      'Le ressentiment allemand contre l’argent qui part vers Rome, thème constant des doléances de l’Empire depuis le XVᵉ siècle.',
    ],
    recit: [
      {
        titre: 'Ce qu’on vend à Wittemberg',
        texte:
          'Une **indulgence** est, dans la doctrine catholique, la remise d’une peine temporelle due pour un péché déjà pardonné ; elle s’obtient par une prière, un pèlerinage, une aumône. En 1515, le pape **Léon X** en autorise une grande campagne pour financer la reconstruction de **Saint-Pierre de Rome**. En Allemagne, elle sert aussi à rembourser la dette contractée par **Albert de Brandebourg** auprès des banquiers Fugger pour acheter l’archevêché de Mayence. Le dominicain **Johann Tetzel** la prêche de ville en ville, avec des tarifs affichés selon la fortune du donateur et une formule restée célèbre : sitôt l’argent tombé dans la caisse, l’âme quitte le purgatoire. Les fidèles de Wittemberg traversent la frontière pour acheter ces billets, et rentrent en expliquant à leur curé qu’ils n’ont plus besoin de se confesser. Ce curé s’appelle **Martin Luther**.',
      },
      {
        titre: 'Quatre-vingt-quinze thèses',
        texte:
          'Le **31 octobre 1517**, Luther, moine augustin et professeur de théologie, envoie à son archevêque une lettre accompagnée de **95 thèses** en latin, destinées à une dispute universitaire. Il n’y attaque ni le pape ni l’Église : il conteste que l’on puisse acheter la remise d’une peine, et rappelle que le vrai trésor de l’Église est l’Évangile. La tradition veut qu’il les ait clouées à la porte de l’église du château — c’était le panneau d’affichage de l’université ; le fait est discuté. Ce qui n’est pas discuté, c’est la suite : traduites en allemand et imprimées, les thèses sont lues dans tout l’Empire **en quelques semaines**. Luther devient en trois ans l’auteur le plus imprimé d’Europe. En 1520, il publie coup sur coup trois manifestes qui, eux, rompent : il y nie l’autorité du pape sur l’Écriture et réduit les sacrements à deux.',
      },
      {
        titre: 'Rome, Worms, la Wartbourg',
        texte:
          'Rome répond par la bulle *Exsurge Domine* (juin 1520), qui somme Luther de se rétracter ; il la brûle publiquement le 10 décembre. Il est **excommunié le 3 janvier 1521**. L’empereur **Charles Quint**, âgé de vingt et un ans, le convoque à la **diète de Worms** : le 18 avril, devant les princes de l’Empire, Luther refuse de se rétracter s’il n’est pas convaincu par l’Écriture. Mis au ban de l’Empire — n’importe qui peut le tuer sans être poursuivi —, il est enlevé et caché par son prince, **Frédéric le Sage**, au château de la **Wartbourg**. Il y passe dix mois et y traduit le **Nouveau Testament en allemand en onze semaines**, à partir du grec d’Érasme. La Bible complète suit en 1534. En donnant à tous un texte lisible, il fait plus qu’une traduction : il fixe la langue allemande écrite.',
      },
      {
        titre: 'Ce que croient les réformés',
        texte:
          'La Réforme tient en quelques principes. L’**Écriture seule** : la Bible, et non la tradition ni le pape, fait autorité. La **foi seule** : l’homme est sauvé par la grâce de Dieu reçue dans la foi, non par ses œuvres ni par l’achat d’indulgences. Le **sacerdoce universel** : tout baptisé est prêtre devant Dieu. En pratique, deux sacrements au lieu de sept (le baptême et la cène), pas de purgatoire, pas de culte des saints ni des reliques, des pasteurs qui peuvent se marier, un culte en langue du pays, des églises sans images. Le mouvement se divise vite : **Zwingli** à Zurich dès 1523, **Jean Calvin** qui organise **Genève** à partir de 1541 avec son consistoire, sa discipline stricte et sa doctrine de la **prédestination**, et l’**Église d’Angleterre**, née en 1534 d’une rupture politique d’Henri VIII avec Rome.',
      },
      {
        titre: 'L’Europe coupée en deux',
        texte:
          'Les conséquences politiques arrivent aussitôt. En **1525**, la **guerre des Paysans** embrase l’Allemagne du Sud : les insurgés se réclament de l’Évangile, Luther condamne la révolte, elle est écrasée — environ 100 000 morts. En **1529**, à la diète de Spire, six princes et quatorze villes **protestent** contre l’interdiction de leur culte : le mot « protestant » est né. La **Confession d’Augsbourg** (1530) fixe la doctrine luthérienne, la ligue de Smalkalde arme les princes réformés, et la guerre contre l’empereur dure jusqu’à la **paix d’Augsbourg du 25 septembre 1555** : chaque prince choisit la religion de son État, et ses sujets suivent ou s’en vont. Face à cela, l’Église catholique se réforme elle aussi : la **Compagnie de Jésus** est approuvée en 1540, le **concile de Trente** siège de 1545 à 1563, précise la doctrine, crée les séminaires et impose la résidence des évêques.',
      },
    ],
    consequences: [
      'La chrétienté d’Occident est durablement divisée : Nord luthérien et réformé, Sud resté catholique.',
      'La paix d’Augsbourg (1555) fait de la religion une affaire d’État : le prince choisit, ses sujets suivent.',
      'L’Église catholique se réforme en profondeur au concile de Trente (1545-1563) : séminaires, catéchisme, jésuites, élan missionnaire.',
      'Lire devient un devoir religieux chez les protestants : l’alphabétisation et les écoles y progressent plus vite.',
      'Les traductions de la Bible fixent l’allemand écrit (Luther, 1534) et nourrissent le français savant (Calvin, 1541).',
      'Les guerres de Religion suivent : la France de 1562 à 1598, puis la guerre de Trente Ans (1618-1648) en Europe centrale.',
      'Le mot « protestant » entre dans la langue, issu de la protestation de Spire en 1529.',
    ],
    chiffres: [
      { valeur: '95', quoi: 'thèses rendues publiques le 31 octobre 1517' },
      { valeur: '11 semaines', quoi: 'pour traduire le Nouveau Testament en allemand à la Wartbourg' },
      { valeur: '300 000', quoi: 'exemplaires environ des écrits de Luther diffusés avant 1521' },
      { valeur: '38 ans', quoi: 'entre les thèses de 1517 et la paix d’Augsbourg de 1555' },
    ],
    chrono: [
      { date: '1515', fait: 'Léon X autorise la grande campagne d’indulgences.' },
      { date: '31 octobre 1517', fait: 'Luther rend publiques ses 95 thèses à Wittemberg.' },
      { date: 'juin 1520', fait: 'La bulle *Exsurge Domine* le somme de se rétracter.' },
      { date: '3 janvier 1521', fait: 'Excommunication de Luther.' },
      { date: '18 avril 1521', fait: 'Diète de Worms : il refuse de se rétracter.' },
      { date: '1522', fait: 'Nouveau Testament en allemand, traduit à la Wartbourg.' },
      { date: '1525', fait: 'Guerre des Paysans en Allemagne du Sud.' },
      { date: '1529', fait: 'Protestation de Spire : naissance du mot « protestant ».' },
      { date: '1534', fait: 'Acte de suprématie : Henri VIII chef de l’Église d’Angleterre.' },
      { date: '1541', fait: 'Calvin organise l’Église de Genève.' },
      { date: '1545', fait: 'Ouverture du concile de Trente.' },
      { date: '25 septembre 1555', fait: 'Paix d’Augsbourg : à chaque prince sa religion.' },
    ],
    leSaisTu:
      'L’affichage des thèses à la porte de l’église du château est le tableau le plus reproduit de la Réforme — et le moins assuré. Luther n’en parle jamais ; le récit vient de son compagnon Melanchthon, écrit en 1546, après la mort de Luther. Ce qui est certain, c’est la lettre envoyée le même jour à l’archevêque de Mayence.',
    aRetenir: [
      'Le 31 octobre 1517, Martin Luther publie 95 thèses contre la vente des indulgences.',
      'Les réformés retiennent l’Écriture seule, la foi seule, deux sacrements et un culte en langue du pays.',
      'Luther est excommunié en 1521 et mis au ban de l’Empire à la diète de Worms.',
      'Calvin organise à Genève, à partir de 1541, la seconde grande Église réformée.',
      'L’Église catholique répond par le concile de Trente (1545-1563) et la Compagnie de Jésus.',
      'La paix d’Augsbourg de 1555 donne à chaque prince allemand le droit de fixer la religion de son État.',
    ],
    mots: [
      {
        mot: 'Indulgence',
        sens: 'Remise d’une peine due pour un péché déjà pardonné, obtenue par une prière, un pèlerinage ou une aumône.',
      },
      {
        mot: 'Justification par la foi',
        sens: 'Idée centrale de Luther : l’homme est sauvé par la grâce de Dieu reçue dans la foi, non par ses actes.',
      },
      {
        mot: 'Cène',
        sens: 'Repas du Seigneur chez les protestants, l’un des deux sacrements qu’ils conservent avec le baptême.',
      },
      {
        mot: 'Diète',
        sens: 'Assemblée des princes et des villes du Saint-Empire, convoquée par l’empereur.',
      },
      {
        mot: 'Concile',
        sens: 'Assemblée des évêques réunie pour trancher des questions de foi et de discipline de l’Église.',
      },
    ],
    lies: [
      'martin-luther',
      'jean-calvin',
      'invention-de-l-imprimerie',
      'massacre-de-la-saint-barthelemy',
      'edit-de-nantes',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, réformes et conflits religieux (XVᵉ – XVIᵉ siècle)',
    tags: [
      'Réforme',
      'Luther',
      'protestants',
      'indulgences',
      '95 thèses',
      'Wittemberg',
      'Calvin',
      'Genève',
      'Worms',
      'Trente',
      'Augsbourg',
      'huguenots',
    ],
  },
  {
    id: 'conquete-de-l-empire-azteque',
    volet: 'evenements',
    nom: 'La conquête de l’empire aztèque',
    date: '1519 – 1521',
    tri: 1519,
    fin: 1521,
    periode: 'temps-modernes',
    emoji: '🗿',
    lieu: 'Mexico-Tenochtitlan, empire mexica',
    accroche:
      'Cinq cents Espagnols abattent en deux ans un empire de plusieurs millions d’hommes — avec des alliés indiens par dizaines de milliers et la variole.',
    citations: [
      {
        texte: 'Nous sommes venus ici pour servir Dieu et le Roi, et aussi pour devenir riches.',
        qui: 'Bernal Díaz del Castillo',
        contexte:
          'Dans son *Histoire véridique de la conquête de la Nouvelle-Espagne*, écrite cinquante ans après les faits par un soldat de Cortés.',
        sens:
          'Le « et aussi » dit tout : les trois motifs sont donnés dans le même souffle, sans que l’auteur y voie la moindre contradiction.',
      },
      {
        texte:
          'Nous restâmes émerveillés, et nous disions que cela ressemblait aux enchantements du livre d’Amadis. Certains de nos soldats se demandaient si ce qu’ils voyaient n’était pas un songe.',
        qui: 'Bernal Díaz del Castillo',
        contexte:
          'Devant la chaussée d’Iztapalapa et la ville de Mexico-Tenochtitlan, le 8 novembre 1519.',
        sens:
          '*Amadis de Gaule* est le roman de chevalerie que lisaient les soldats : ils n’ont pas d’autre mot pour décrire une ville plus grande que les leurs.',
      },
      {
        texte: 'Soyez le bienvenu : vous êtes arrivé dans votre pays et dans votre maison.',
        qui: 'Moctezuma II, selon Cortés',
        contexte:
          'Rencontre du 8 novembre 1519, rapportée par Cortés dans sa deuxième lettre à Charles Quint, 1520.',
        sens:
          'Aucune source mexica ne confirme cette soumission volontaire. Elle arrange trop bien Cortés, qui doit justifier une conquête entreprise sans ordre du roi.',
        incertaine: true,
      },
      {
        texte:
          'Sur les chemins gisent des traits brisés, les chevelures sont éparses. Les maisons sont sans toit, leurs murs sont rougis.',
        qui: 'Les anciens de Tlatelolco, recueillis par Bernardino de Sahagún',
        contexte: 'Chant nahua sur la chute de Mexico, noté vers 1555 dans le *Codex de Florence*.',
        sens:
          'La conquête a aussi des sources indiennes, écrites en nahuatl par les vaincus une génération après : elles racontent une ville, pas une victoire.',
      },
    ],
    reperes: [
      'Cortés débarque en février 1519 avec 11 navires, environ 500 hommes, 16 chevaux et quelques canons.',
      'Il n’agit pas seul : les Tlaxcaltèques, ennemis des Mexicas, lui fournissent des dizaines de milliers de guerriers.',
      'Mexico-Tenochtitlan compte alors autour de 200 000 habitants, bâtie sur un lac.',
      'La Noche Triste, le 30 juin 1520, manque d’anéantir les Espagnols en fuite.',
      'La variole, arrivée en 1520, tue une grande partie des défenseurs avant même le siège.',
      'La ville tombe le 13 août 1521, après soixante-quinze jours d’encerclement.',
    ],
    causes: [
      'L’installation espagnole aux Antilles depuis 1492 : Cuba conquise en 1511, l’or des îles épuisé, les expéditions cherchent le continent.',
      'La faim de terres et de titres d’une petite noblesse sans fortune, formée au modèle de la Reconquista et payée en **encomiendas**.',
      'Un empire mexica fondé sur le **tribut** et sur la guerre : les cités soumises paient en maïs, en coton et en captifs, et détestent Tenochtitlan.',
      'L’écart technique : acier, arbalètes, arquebuses, canons, chevaux et chiens de guerre face à des armes de bois et d’obsidienne.',
      'Des interprètes : **Malintzin**, offerte à Cortés en 1519, parle nahuatl et maya ; Jerónimo de Aguilar, naufragé, parle maya et espagnol. Cortés comprend tout ce qui se dit.',
      'L’hésitation de **Moctezuma II**, qui reçoit les Espagnols dans sa capitale au lieu de les arrêter aux portes.',
      'La **variole**, introduite en 1520 : elle emporte l’empereur Cuitláhuac et une grande part des combattants avant l’assaut final.',
    ],
    recit: [
      {
        titre: 'Onze navires et deux interprètes',
        texte:
          'En **février 1519**, **Hernán Cortés** quitte Cuba avec onze navires, environ **500 hommes**, **16 chevaux** et une dizaine de canons — une expédition d’exploration et de traite, pas de conquête. Il double les consignes du gouverneur Velázquez, fonde **Veracruz** et se fait élire capitaine par ses hommes : il ne dépend plus que du roi. À Cozumel puis sur la côte, il récupère deux interprètes qui vont décider de tout : **Jerónimo de Aguilar**, naufragé espagnol qui parle maya, et **Malintzin** — la Malinche, doña Marina —, jeune femme nahua offerte en cadeau, qui parle maya et nahuatl. Par cette chaîne à deux maillons, Cortés entend les querelles de l’empire. Enfin, il fait **échouer et démonter ses navires** : nul ne rentrera à Cuba, et le fer, les cordages et les voiles sont mis de côté.',
      },
      {
        titre: 'Des alliés par dizaines de milliers',
        texte:
          'L’empire mexica n’est pas un État unifié : c’est une domination, exercée par la triple alliance de Tenochtitlan, Texcoco et Tlacopan sur des centaines de cités qui paient tribut. À **Cempoala**, les Totonaques racontent à Cortés ce que leur coûte Moctezuma ; ils se rallient. À **Tlaxcala**, république indépendante et ennemie jurée des Mexicas, on combat d’abord les Espagnols pendant deux semaines, puis on s’allie à eux en **septembre 1519** : c’est l’alliance décisive, et les Tlaxcaltèques fourniront l’essentiel des combattants jusqu’au bout. À **Cholula**, en octobre, Cortés fait massacrer des milliers de notables réunis sur la grande place — l’avertissement porte. Quand il arrive devant Mexico, il n’est plus à la tête de cinq cents Espagnols, mais d’une armée indienne avec cinq cents Espagnols dedans.',
      },
      {
        titre: 'Mexico-Tenochtitlan, 8 novembre 1519',
        texte:
          'La ville est bâtie sur une île du lac Texcoco, reliée à la terre par trois **chaussées** coupées de ponts-levis, nourrie par des jardins flottants, les **chinampas**, et alimentée en eau douce par un aqueduc venu de Chapultepec. Elle compte autour de **200 000 habitants** : plus que Séville, plus que Paris. Le marché de **Tlatelolco** rassemble chaque jour des dizaines de milliers de personnes ; au centre s’élève le **Templo Mayor**, double pyramide dédiée à Huitzilopochtli et à Tlaloc. **Moctezuma II**, le *tlatoani*, reçoit Cortés sur la chaussée d’Iztapalapa, l’installe dans le palais de son père et le couvre de cadeaux d’or — ce qui fixe les Espagnols au lieu de les éloigner. Une semaine plus tard, Cortés le fait **prisonnier dans son propre palais** et gouverne en son nom pendant six mois.',
      },
      {
        titre: 'La Noche Triste',
        texte:
          'Au printemps **1520**, Cortés doit redescendre à la côte affronter une troupe envoyée par Velázquez pour l’arrêter ; il la bat et enrôle ses hommes. En son absence, son lieutenant **Pedro de Alvarado** fait massacrer la noblesse mexica réunie pour la fête de **Toxcatl**, dans l’enceinte du Templo Mayor. La ville se soulève. Moctezuma, présenté aux siens pour les calmer, est lapidé ou exécuté — les sources divergent — et meurt le **29 juin 1520**. Dans la nuit du **30 juin**, les Espagnols tentent de fuir par la chaussée de Tacuba, chargés d’or : les ponts sont coupés, les canots mexicas les attendent. Plus de **600 Espagnols** et plusieurs milliers d’alliés tlaxcaltèques y périssent ; les survivants l’appelleront la **Noche Triste**. Une semaine plus tard, à **Otumba**, ils gagnent pourtant la bataille qui leur ouvre la route de Tlaxcala.',
      },
      {
        titre: 'La variole, puis soixante-quinze jours de siège',
        texte:
          'L’arme décisive arrive sans que personne l’ait voulue. La **variole**, débarquée avec la troupe de Narváez, se répand à partir de septembre **1520** dans une population sans aucune immunité. Elle tue **Cuitláhuac**, le successeur de Moctezuma, après quatre-vingts jours de règne, et fauche une grande part des guerriers. Pendant ce temps, Cortés fait construire à Tlaxcala **treize brigantins**, démontés, portés à dos d’homme sur soixante kilomètres et remontés au bord du lac : avec eux, il tient l’eau. Le siège commence le **30 mai 1521** : aqueduc coupé, chaussées prises, la ville affamée se défend maison par maison sous les ordres du jeune *tlatoani* **Cuauhtémoc**. Elle tombe le **13 août 1521**. Cortés fait raser ce qui reste et bâtit **Mexico** sur les décombres, la cathédrale sur le Templo Mayor.',
      },
      {
        titre: 'Ce que devient l’Amérique espagnole',
        texte:
          'Le Mexique devient en **1535** la vice-royauté de **Nouvelle-Espagne**. Le système de l’**encomienda** confie aux conquistadors des villages entiers, dont ils perçoivent le travail et le tribut contre la charge de les évangéliser. Les mines d’argent — **Zacatecas** en 1546, **Potosí** au Pérou en 1545 — expédient vers Séville des flottes annuelles qui financent la monarchie espagnole et inondent l’Europe de métal blanc. Le bilan humain est sans équivalent : la population du Mexique central, estimée entre **15 et 25 millions** en 1519, tombe autour d’**un million** vers 1600, presque entièrement du fait des épidémies successives. Des religieux protestent dès les premières années ; le dominicain **Bartolomé de Las Casas** obtient les *Lois nouvelles* de 1542 et affronte en 1550-1551, lors de la **controverse de Valladolid**, ceux qui justifient la conquête.',
      },
    ],
    consequences: [
      'L’empire mexica disparaît ; Mexico est rebâtie sur ses ruines et devient en 1535 la capitale de la Nouvelle-Espagne.',
      'La population du Mexique central s’effondre, d’environ 15 à 25 millions en 1519 à près d’un million en 1600, surtout à cause des épidémies.',
      'L’encomienda organise le travail forcé des Indiens au profit des conquistadors.',
      'L’argent américain, de Zacatecas et de Potosí, finance la monarchie espagnole et bouleverse les prix en Europe.',
      'L’évangélisation massive donne naissance à un catholicisme métissé, dont la Vierge de Guadalupe devient le symbole dès 1531.',
      'La légitimité de la conquête est contestée en Espagne même : Lois nouvelles de 1542, controverse de Valladolid en 1550-1551.',
      'Le modèle de Cortés — quelques centaines d’hommes, des alliés locaux, un souverain capturé — est repris par Pizarro au Pérou en 1532.',
    ],
    chiffres: [
      { valeur: '500', quoi: 'Espagnols et 16 chevaux au débarquement de 1519' },
      { valeur: '200 000', quoi: 'habitants à Mexico-Tenochtitlan, plus que toute ville d’Espagne' },
      { valeur: '75 jours', quoi: 'de siège, du 30 mai au 13 août 1521' },
      { valeur: '15 à 25 millions', quoi: 'd’habitants au Mexique central en 1519 ; un million vers 1600' },
    ],
    chrono: [
      { date: '1511', fait: 'Les Espagnols achèvent la conquête de Cuba.' },
      { date: 'février 1519', fait: 'Cortés quitte Cuba avec onze navires.' },
      { date: 'avril 1519', fait: 'Fondation de Veracruz ; les navires sont échoués.' },
      { date: 'septembre 1519', fait: 'Alliance décisive avec Tlaxcala.' },
      { date: 'octobre 1519', fait: 'Massacre de Cholula.' },
      { date: '8 novembre 1519', fait: 'Entrée dans Mexico-Tenochtitlan.' },
      { date: '29-30 juin 1520', fait: 'Mort de Moctezuma ; la Noche Triste.' },
      { date: 'septembre 1520', fait: 'La variole se répand dans la vallée de Mexico.' },
      { date: '30 mai 1521', fait: 'Début du siège, avec treize brigantins sur le lac.' },
      { date: '13 août 1521', fait: 'Chute de la ville ; Cuauhtémoc est capturé.' },
      { date: '1535', fait: 'Création de la vice-royauté de Nouvelle-Espagne.' },
      { date: '1550-1551', fait: 'Controverse de Valladolid sur la légitimité de la conquête.' },
    ],
    leSaisTu:
      'Cortés n’a pas brûlé ses navires : la formule vient d’un chroniqueur du XVIᵉ siècle. Il les a fait échouer volontairement sur le sable, puis démonter — en récupérant le fer, les cordages, les voiles et les clous. Ce sont ces pièces qui, deux ans plus tard, ont servi à armer les treize brigantins du siège de Mexico.',
    aRetenir: [
      'Hernán Cortés débarque au Mexique en février 1519 avec environ 500 hommes et 16 chevaux.',
      'Sa force vient de ses alliés indiens, surtout les Tlaxcaltèques, ennemis de l’empire mexica.',
      'Mexico-Tenochtitlan, bâtie sur un lac, compte alors environ 200 000 habitants.',
      'Après la Noche Triste du 30 juin 1520, la variole décime les défenseurs de la ville.',
      'Mexico-Tenochtitlan tombe le 13 août 1521 après soixante-quinze jours de siège.',
      'La population du Mexique central passe de 15-25 millions en 1519 à environ un million en 1600.',
    ],
    mots: [
      {
        mot: 'Tlatoani',
        sens: 'Souverain d’une cité nahua, littéralement « celui qui parle ». Moctezuma II et Cuauhtémoc le furent à Tenochtitlan.',
      },
      {
        mot: 'Conquistador',
        sens: 'Soldat espagnol des conquêtes américaines, payé non en solde mais en part de butin et en terres.',
      },
      {
        mot: 'Encomienda',
        sens: 'Concession d’un village indien à un Espagnol, qui perçoit travail et tribut en échange de son évangélisation.',
      },
      {
        mot: 'Chinampa',
        sens: 'Jardin flottant cultivé sur le lac, qui nourrissait Mexico-Tenochtitlan toute l’année.',
      },
      {
        mot: 'Brigantin',
        sens: 'Petit navire à rames et à voile ; Cortés en fit construire treize pour tenir le lac Texcoco.',
      },
    ],
    lies: [
      'hernan-cortes',
      'decouverte-de-l-amerique',
      'premier-tour-du-monde',
      'traite-atlantique-et-code-noir',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Transformations de l’Europe et ouverture sur le monde (XVIᵉ – XVIIᵉ siècle)',
    tags: [
      'Cortés',
      'Aztèques',
      'Mexicas',
      'Tenochtitlan',
      'Moctezuma',
      'Cuauhtémoc',
      'Tlaxcala',
      'Malinche',
      'variole',
      'conquistadors',
      'Nouvelle-Espagne',
    ],
  },
  {
    id: 'premier-tour-du-monde',
    volet: 'evenements',
    nom: 'Le premier tour du monde',
    date: '1519 – 1522',
    tri: 1519,
    fin: 1522,
    periode: 'temps-modernes',
    emoji: '🧭',
    lieu: 'Séville, le détroit de Magellan, les Moluques',
    accroche:
      'Cinq navires partent chercher les épices par l’ouest ; trois ans plus tard, un seul rentre avec dix-huit hommes — et la preuve que la Terre est ronde.',
    citations: [
      {
        texte: 'Primus circumdedisti me.',
        qui: 'Charles Quint',
        contexte:
          'Devise des armoiries accordées à Juan Sebastián Elcano en 1523, sous un globe terrestre.',
        sens:
          '« Tu fus le premier à faire le tour de moi » : c’est la Terre elle-même qui parle à l’homme ramenant la *Victoria*.',
      },
      {
        texte: 'Je crois qu’il n’y a pas au monde un plus beau détroit ni meilleur que celui-ci.',
        qui: 'Antonio Pigafetta',
        contexte:
          'Journal de bord, novembre 1520, à la sortie des 600 kilomètres de passes qui portent aujourd’hui le nom de Magellan.',
      },
      {
        texte:
          'Nous mangions des biscuits qui n’étaient plus du biscuit, mais de la poussière mêlée de vers ; nous buvions de l’eau jaune, pourrie depuis des jours. Nous mangeâmes aussi les cuirs de bœuf qui garnissaient les vergues.',
        qui: 'Antonio Pigafetta',
        contexte: 'Pendant les quatre-vingt-dix-huit jours de traversée du Pacifique, 1520-1521.',
        sens:
          'Le scorbut et la faim tuent une trentaine d’hommes. Les rats se vendaient un demi-ducat pièce à bord.',
      },
      {
        texte: 'Nous vîmes que nous avions perdu un jour.',
        qui: 'Antonio Pigafetta',
        contexte:
          'Au Cap-Vert, en juillet 1522, en comparant le journal de bord tenu à bord au calendrier des Portugais.',
        sens:
          'En faisant le tour de la Terre vers l’ouest, l’équipage a vu un lever de soleil de moins. C’est la première preuve vécue de ce qui deviendra la ligne de changement de date.',
      },
    ],
    reperes: [
      'Magellan est portugais, refusé par son roi, et navigue pour l’Espagne de Charles Quint.',
      'Départ de Sanlúcar de Barrameda le 20 septembre 1519 : cinq navires, environ 240 hommes.',
      'Le détroit au sud de l’Amérique est franchi du 21 octobre au 28 novembre 1520.',
      'La traversée du Pacifique dure quatre-vingt-dix-huit jours sans ravitaillement.',
      'Magellan est tué le 27 avril 1521 à Mactan, aux Philippines : il n’a pas bouclé le tour.',
      'Elcano ramène la Victoria à Sanlúcar le 6 septembre 1522 avec dix-huit survivants.',
    ],
    causes: [
      'Le traité de Tordesillas (1494) réserve au Portugal la route de l’est vers les **Moluques** : l’Espagne doit trouver un passage par l’ouest ou renoncer aux épices.',
      'La valeur folle du **clou de girofle** et de la noix de muscade, qui ne poussent que sur quelques îles minuscules : une cargaison vaut une flotte.',
      'La découverte que l’Amérique est un obstacle et non l’Asie : en 1513, **Balboa** traverse l’isthme de Panama et voit une autre mer, la « mer du Sud ».',
      'Un homme disponible : **Fernand de Magellan**, vétéran portugais des Indes et de Malacca, éconduit par le roi Manuel Iᵉʳ, propose son projet à Charles Quint (capitulation de Valladolid, 22 mars 1518).',
      'Une erreur de géographie utile : on croit les Moluques situées dans la moitié espagnole du monde, ce qui justifie l’expédition en droit.',
      'Les moyens techniques et financiers : navires de charge robustes, biscuit de mer, pilotes expérimentés, et des bailleurs comme le marchand Cristóbal de Haro.',
    ],
    recit: [
      {
        titre: 'Cinq navires pour une épice',
        texte:
          'Le **20 septembre 1519**, cinq navires appareillent de **Sanlúcar de Barrameda** : la *Trinidad*, le *San Antonio*, la *Concepción*, la *Victoria* et le *Santiago*, avec environ **240 hommes** de huit ou neuf nations. L’équipage est méfiant : le capitaine général est portugais, les capitaines castillans le savent et supportent mal ses ordres. À bord se trouve un jeune Vicentin, **Antonio Pigafetta**, venu « voir les très grandes et admirables choses de l’océan » ; il tiendra le journal qui nous reste, le seul récit complet du voyage. La flotte descend l’Atlantique, longe le Brésil, hiverne à partir de mars 1520 dans la baie glacée de **Puerto San Julián**, en Patagonie. Là, trois capitaines se mutinent. Magellan fait exécuter Quesada, abandonner Cartagena sur la côte, et reprend la route au printemps austral. Le *Santiago* s’est déjà perdu sur des brisants.',
      },
      {
        titre: 'Le détroit, en trente-huit jours',
        texte:
          'Le **21 octobre 1520**, au cap des Onze-Mille-Vierges, une entrée d’eau salée s’enfonce vers l’ouest. Ce n’est pas un fleuve : c’est un labyrinthe de **600 kilomètres** de chenaux, de baies sans issue et de vents contraires, entre des montagnes noires et des feux allumés la nuit par les habitants — d’où le nom de **Terre de Feu**. Il faut sonder chaque bras. Le *San Antonio*, le plus gros navire et celui qui porte le plus de vivres, fait demi-tour en secret et rentre en Espagne. Les trois restants débouchent le **28 novembre 1520** sur une mer si calme après les tempêtes patagones que Magellan la nomme **Pacifique**. Le passage porte aujourd’hui son nom : il sera, jusqu’au canal de Panama en 1914, la seule route de mer entre les deux océans.',
      },
      {
        titre: 'Quatre-vingt-dix-huit jours d’océan',
        texte:
          'Personne n’imagine la taille du Pacifique. Magellan compte quelques semaines ; la traversée en prend **quatre-vingt-dix-huit**, sans toucher une seule île habitée — les deux atolls rencontrés sont déserts, on les baptise les « îles Infortunées ». Le biscuit se réduit en poudre pleine de vers, l’eau croupit, le **scorbut** fait tomber les dents et les hommes : dix-neuf meurent, une trentaine sont incapables de tenir debout. On fait bouillir les cuirs de bœuf des vergues, quatre jours à la mer pour les attendrir ; on mange la sciure ; les rats se vendent un demi-ducat. Le **6 mars 1521**, les vigies aperçoivent **Guam**. Dix jours plus tard, la flotte atteint l’archipel que Magellan nomme îles Saint-Lazare — les futures **Philippines**.',
      },
      {
        titre: 'Mactan, 27 avril 1521',
        texte:
          'Aux Philippines, Magellan obtient l’alliance et le baptême du chef de **Cebu**, Humabon, puis décide de soumettre pour lui le chef voisin de l’îlot de **Mactan**, **Lapu-Lapu**. Le 27 avril 1521, il débarque avec une cinquantaine d’hommes sur un récif que les canots ne peuvent pas approcher : les arquebuses ne portent pas, les Espagnols reculent dans l’eau, et Magellan est tué sur la plage. Pigafetta, blessé, raconte la scène. Quelques jours plus tard, un banquet tourne au guet-apens à Cebu et coûte la vie à une trentaine d’hommes de plus. Il ne reste pas assez de marins pour trois navires : la *Concepción* est brûlée. Les deux autres errent des mois dans les mers du Sud avant d’atteindre enfin **Tidore**, aux Moluques, en novembre 1521, et d’y charger le girofle.',
      },
      {
        titre: 'Dix-huit hommes et vingt-six tonnes de girofle',
        texte:
          'La *Trinidad* prend eau ; elle tente de regagner l’Amérique par le Pacifique, échoue et est capturée par les Portugais. Reste la **Victoria**, commandée par le Basque **Juan Sebastián Elcano**. Il choisit la route interdite : traverser l’océan Indien et doubler le **cap de Bonne-Espérance**, en territoire portugais, sans relâcher nulle part. Quatre mois sans escale, du riz et de l’eau ; une vingtaine d’hommes meurent. Au Cap-Vert, une escale forcée coûte treize marins, arrêtés par les Portugais — et révèle l’étrange décalage d’un jour dans le calendrier du bord. Le **6 septembre 1522**, la *Victoria* remonte le Guadalquivir avec **dix-huit survivants**, si faibles qu’ils vont pieds nus en procession à Séville. Dans ses cales : **26 tonnes de clous de girofle**, dont la vente rembourse à elle seule les cinq navires et les trois années de voyage.',
      },
    ],
    consequences: [
      'La rotondité de la Terre et l’unité des océans cessent d’être une théorie : elles sont vérifiées par l’expérience.',
      'La taille réelle du monde apparaît : le Pacifique est bien plus vaste que tout ce qu’on imaginait, et les cartes sont refaites.',
      'Le jour perdu dans le calendrier du bord pose le problème qui aboutira à la ligne de changement de date.',
      'L’Espagne revendique les Moluques : le traité de Saragosse (1529) lui fait vendre ses droits au Portugal pour 350 000 ducats.',
      'L’Espagne garde en revanche l’archipel nommé Philippines en l’honneur de Philippe II : Manille est fondée en 1571 et le galion relie Acapulco à l’Asie pendant deux siècles et demi.',
      'Le détroit porte le nom de Magellan, mort à mi-chemin ; le premier tour du monde reste au nom d’Elcano.',
    ],
    chiffres: [
      { valeur: '5', quoi: 'navires au départ, un seul au retour' },
      { valeur: '18', quoi: 'hommes rentrés à Sanlúcar le 6 septembre 1522, sur environ 240' },
      { valeur: '98 jours', quoi: 'de traversée du Pacifique sans ravitaillement' },
      { valeur: '26 tonnes', quoi: 'de clous de girofle : la cargaison rembourse tout le voyage' },
    ],
    chrono: [
      { date: '22 mars 1518', fait: 'Charles Quint signe la capitulation de Valladolid avec Magellan.' },
      { date: '20 septembre 1519', fait: 'Départ de Sanlúcar de Barrameda, cinq navires.' },
      { date: 'avril 1520', fait: 'Mutinerie réprimée à Puerto San Julián, en Patagonie.' },
      { date: '21 octobre 1520', fait: 'Entrée dans le détroit, au cap des Onze-Mille-Vierges.' },
      { date: '28 novembre 1520', fait: 'Sortie dans un océan baptisé Pacifique.' },
      { date: '6 mars 1521', fait: 'Guam, après quatre-vingt-dix-huit jours de mer.' },
      { date: '27 avril 1521', fait: 'Magellan est tué à Mactan, aux Philippines.' },
      { date: 'novembre 1521', fait: 'Chargement du girofle à Tidore, aux Moluques.' },
      { date: '6 septembre 1522', fait: 'Retour de la Victoria avec dix-huit hommes.' },
      { date: '1529', fait: 'Traité de Saragosse : l’Espagne cède ses droits sur les Moluques.' },
    ],
    leSaisTu:
      'Magellan avait un serviteur, Enrique de Malacca, acheté en Asie en 1511 et ramené en Europe. Aux Philippines, en 1521, Enrique s’est aperçu qu’il comprenait la langue des habitants : il était revenu chez lui par l’autre côté du globe. Beaucoup d’historiens voient en lui le premier homme à avoir réellement fait le tour du monde.',
    aRetenir: [
      'L’expédition part de Sanlúcar le 20 septembre 1519, sous les ordres du Portugais Fernand de Magellan.',
      'Elle franchit du 21 octobre au 28 novembre 1520 le détroit qui porte aujourd’hui son nom.',
      'La traversée du Pacifique dure quatre-vingt-dix-huit jours et tue une trentaine d’hommes.',
      'Magellan est tué le 27 avril 1521 à Mactan : c’est Juan Sebastián Elcano qui achève le voyage.',
      'La Victoria rentre le 6 septembre 1522 avec dix-huit survivants et 26 tonnes de girofle.',
      'Le voyage prouve par l’expérience que la Terre est ronde et que les océans communiquent.',
    ],
    mots: [
      {
        mot: 'Nao',
        sens: 'Gros navire de charge à trois mâts, plus lent mais plus robuste que la caravelle.',
      },
      {
        mot: 'Détroit',
        sens: 'Bras de mer resserré reliant deux étendues d’eau, ici l’Atlantique et le Pacifique.',
      },
      {
        mot: 'Scorbut',
        sens: 'Maladie due au manque de vitamine C, qui déchausse les dents et tue en mer après deux à trois mois sans fruits frais.',
      },
      {
        mot: 'Moluques',
        sens: 'Archipel d’Indonésie, seul producteur de clou de girofle et de muscade au XVIᵉ siècle : les « îles aux Épices ».',
      },
      {
        mot: 'Ligne de changement de date',
        sens: 'Méridien à partir duquel on change de jour, imaginé après le décalage constaté par l’équipage de la Victoria.',
      },
    ],
    lies: [
      'magellan',
      'decouverte-de-l-amerique',
      'christophe-colomb',
      'conquete-de-l-empire-azteque',
      'vasco-de-gama',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Transformations de l’Europe et ouverture sur le monde (XVIᵉ – XVIIᵉ siècle)',
    tags: [
      'Magellan',
      'Elcano',
      'tour du monde',
      'circumnavigation',
      'Pacifique',
      'détroit',
      'Moluques',
      'épices',
      'Pigafetta',
      'Victoria',
      'girofle',
    ],
  },
  {
    id: 'traite-atlantique-et-code-noir',
    volet: 'evenements',
    nom: 'La traite atlantique et le Code noir',
    date: 'XVIᵉ – XIXᵉ siècle',
    tri: 1685,
    fin: 1794,
    periode: 'temps-modernes',
    emoji: '⛓️',
    lieu: 'L’Afrique, l’Atlantique et les Antilles',
    accroche:
      'Entre le XVIᵉ et le XIXᵉ siècle, douze à treize millions d’Africains sont déportés vers l’Amérique par un commerce que le droit organise.',
    citations: [
      {
        texte: 'Déclarons les esclaves être meubles.',
        qui: 'Louis XIV, édit de mars 1685',
        contexte: 'Article 44 de l’édit sur les îles d’Amérique françaises, dit « Code noir ».',
        sens:
          'Un meuble s’achète, se vend, se saisit pour dettes et se partage à l’héritage : l’article range des personnes parmi les objets d’un inventaire.',
      },
      {
        texte:
          'L’étroitesse du lieu, la chaleur du climat et le nombre d’hommes entassés dans le navire, où chacun avait à peine la place de se retourner, nous étouffaient presque.',
        qui: 'Olaudah Equiano',
        contexte:
          'Récit de sa propre traversée, publié à Londres en 1789 par un ancien esclave devenu abolitionniste.',
        sens:
          'C’est l’un des très rares témoignages de première main écrits par un déporté : presque toutes les autres sources sont celles des armateurs.',
      },
      {
        texte:
          'Il est impossible que nous supposions que ces gens-là soient des hommes ; parce que, si nous les supposions des hommes, on commencerait à croire que nous ne sommes pas nous-mêmes chrétiens.',
        qui: 'Montesquieu',
        contexte: 'Chapitre « De l’esclavage des nègres », *De l’esprit des lois*, 1748.',
        sens:
          'Montesquieu écrit exactement le contraire de ce qu’il pense : il aligne les arguments des esclavagistes pour les rendre ridicules. C’est l’un des textes ironiques les plus cités des Lumières.',
      },
      {
        texte:
          'L’esclavage des Nègres dans toutes les colonies est aboli ; en conséquence, tous les hommes, sans distinction de couleur, domiciliés dans les colonies, sont citoyens français.',
        qui: 'La Convention nationale',
        contexte: 'Décret du 16 pluviôse an II, 4 février 1794.',
      },
    ],
    reperes: [
      'Douze à treize millions d’Africains sont embarqués pour l’Amérique entre 1500 et 1866.',
      'Le commerce triangulaire relie un port européen, une côte africaine et une colonie américaine.',
      'Nantes est le premier port négrier français : environ 1 700 expéditions armées.',
      'La mortalité moyenne pendant la traversée avoisine 13 % des captifs embarqués.',
      'L’édit de mars 1685, dit Code noir, donne un cadre juridique à l’esclavage dans les colonies françaises.',
      'La Convention abolit l’esclavage le 4 février 1794 : c’est la première abolition décidée par un État européen.',
    ],
    causes: [
      'L’économie de **plantation** installée en Amérique après 1492 : canne à sucre, puis tabac, café, indigo et coton, des cultures qui réclament une main-d’œuvre nombreuse et permanente.',
      'L’effondrement démographique des Amérindiens et l’insuffisance des **engagés** européens, ces « trente-six mois » recrutés par contrat court.',
      'L’existence en Afrique de marchés et d’États pratiquant déjà la captivité : les Européens achètent sur la côte à des intermédiaires africains et ne pénètrent presque jamais à l’intérieur des terres.',
      'La demande européenne de sucre, qui est multipliée par dix au XVIIIᵉ siècle et rend chaque cargaison extrêmement rentable.',
      'Un cadre juridique et commercial : compagnies à monopole, **exclusif colonial**, puis l’édit de 1685 qui codifie le statut des esclaves.',
      'La transformation de la servitude en condition **héréditaire et raciale** : le Code noir pose que l’enfant suit la condition de sa mère, ce qui reproduit l’esclavage de génération en génération.',
      'Les moyens des grands ports atlantiques : armateurs, assurances maritimes, crédit, chantiers navals — à Nantes, Bordeaux, La Rochelle, Liverpool, Bristol ou Lisbonne.',
    ],
    recit: [
      {
        titre: 'Le commerce triangulaire',
        texte:
          'Une campagne négrière dure douze à dix-huit mois et se fait en trois côtés. **Premier côté** : un navire quitte Nantes, Bordeaux ou Liverpool chargé de **pacotille** — toiles indiennes, fusils, barres de fer, eau-de-vie, verroterie, cauris —, marchandises choisies selon les goûts de la côte visée. **Deuxième côté** : sur les côtes du golfe de Guinée, du Congo ou de l’Angola, il échange cette cargaison contre des captifs vendus par des courtiers et des États africains, puis traverse l’Atlantique : c’est le **passage du milieu**. **Troisième côté** : aux Antilles ou au Brésil, les captifs sont vendus à l’encan ou à la pièce, et le navire repart chargé de sucre, de café, de coton et d’indigo, revendus en Europe. Trois ventes, trois profits. Tous les navires ne font pas les trois côtés — beaucoup de voyages sont directs —, mais c’est le schéma qui structure l’économie atlantique du XVIIIᵉ siècle.',
      },
      {
        titre: 'Ce que dit le Code noir',
        texte:
          'L’**édit de mars 1685**, préparé par l’administration de Colbert et promulgué au nom de **Louis XIV** pour les îles d’Amérique, compte soixante articles. Il ne crée pas l’esclavage, qui existe déjà aux Antilles depuis un demi-siècle : il le met en droit. L’article 2 impose le baptême et l’instruction dans la religion catholique ; les articles 22 à 27 obligent le maître à nourrir, vêtir et entretenir ses esclaves, y compris les vieillards et les infirmes ; l’article 6 interdit de les faire travailler le dimanche. Mais l’article 44 les déclare **meubles**, les articles 12 et 13 font suivre à l’enfant la condition de sa mère, et l’article 38 punit la fuite par l’oreille coupée et la marque au fer, la récidive par le jarret tranché, la troisième fois par la mort. Les obligations du maître furent très inégalement appliquées ; les peines, elles, le furent. Une version remaniée est promulguée pour la Louisiane en 1724.',
      },
      {
        titre: 'La traversée',
        texte:
          'Le passage de l’Afrique aux Amériques dure **six à dix semaines** selon la côte de départ et les vents. Les captifs sont enfermés dans un **entrepont** d’environ un mètre cinquante de hauteur, couchés par rangées, souvent enchaînés deux par deux, hommes et femmes séparés, remontés par groupes pour quelques heures sur le pont. Les plans de navires conservés donnent la mesure : la *Marie-Séraphique* de Nantes, peinte en 1770 pour son armateur, montre **307 captifs** disposés comme un chargement. La mortalité en mer tourne autour de **13 %** en moyenne au XVIIIᵉ siècle — dysenterie, scorbut, variole, déshydratation —, à quoi s’ajoutent les morts survenues avant l’embarquement et pendant la première année sur la plantation. Les révoltes à bord sont fréquentes : on en recense sur environ un voyage sur dix, presque toujours près des côtes africaines.',
      },
      {
        titre: 'Nantes, premier port négrier français',
        texte:
          'La France arme environ **4 200 expéditions négrières** entre le XVIIᵉ et le XIXᵉ siècle et déporte autour de **1,4 million** de personnes — loin derrière le Portugal et le Brésil (près de 5,8 millions) et la Grande-Bretagne (environ 3,3 millions). **Nantes** en assure à elle seule près de la moitié, avec environ **1 700 expéditions** : c’est le premier port négrier français, devant La Rochelle, Bordeaux, Le Havre et Saint-Malo. Les fortunes se lisent encore dans la pierre des hôtels de l’île Feydeau, et la ville vit aussi des raffineries de sucre, des indienneries et des chantiers. La colonie qui alimente tout cela est **Saint-Domingue** : en 1789, environ **500 000 esclaves** pour 30 000 Blancs et 28 000 libres de couleur, et à elle seule 40 % du sucre et 60 % du café consommés dans le monde. C’est la colonie la plus rentable de la planète.',
      },
      {
        titre: 'Travailler, fuir, se révolter',
        texte:
          'Sur l’**habitation** sucrière, le travail est organisé en ateliers sous la surveillance d’un commandeur : plantation, coupe, transport, puis le moulin et les chaudières, qui tournent jour et nuit pendant les cinq mois de récolte. L’espérance de vie y est courte, et les colons préfèrent longtemps racheter des captifs plutôt que d’assurer le renouvellement des familles. La résistance prend toutes les formes : ralentissement du travail, bris d’outils, avortements, empoisonnements du bétail, et surtout le **marronnage** — la fuite, de quelques jours ou définitive. Des communautés de marrons tiennent les montagnes de la Jamaïque, du Surinam et de Saint-Domingue, parfois pendant des générations, jusqu’à obtenir des traités. En 1758, le marron **Makandal** est exécuté à Saint-Domingue ; en **août 1791**, l’insurrection générale de la plaine du Nord ouvre la révolution qui fera d’**Haïti** un État indépendant en 1804.',
      },
      {
        titre: 'Contester, interdire, abolir',
        texte:
          'La critique vient d’abord de quelques voix isolées — des religieux depuis le XVIᵉ siècle, puis les **Lumières** : Montesquieu par l’ironie en 1748, Rousseau, l’*Encyclopédie*, l’abbé Raynal. Elle devient un mouvement organisé à la fin du siècle : les **quakers** et la société de Wilberforce en Grande-Bretagne, la **Société des amis des Noirs** en France en 1788, avec Brissot, Condorcet et l’abbé Grégoire. La pression des insurgés de Saint-Domingue fait le reste : le **16 pluviôse an II (4 février 1794)**, la Convention abolit l’esclavage dans toutes les colonies et fait des affranchis des citoyens français. L’histoire ne s’arrête pas là — l’esclavage est rétabli en 1802 et ne sera aboli définitivement qu’en **1848** —, mais 1794 est la première abolition décrétée par un État européen. La traite elle-même est interdite par la Grande-Bretagne en 1807 et par la France en 1815, sans cesser pour autant : elle continue clandestinement jusque dans les années 1860.',
      },
    ],
    consequences: [
      'Douze à treize millions d’Africains déportés vers l’Amérique, dont environ 1,8 million meurent pendant la traversée.',
      'Des régions entières d’Afrique sont vidées de leurs jeunes adultes ; des États s’y réorganisent autour de la capture et de la vente des captifs, armés par les fusils européens.',
      'Les Amériques sont peuplées de force : le Brésil, la Caraïbe et le Sud des États-Unis doivent à la traite une grande part de leur population, de leurs langues créoles, de leurs religions et de leurs musiques.',
      'Les ports atlantiques s’enrichissent — Nantes, Bordeaux, Liverpool — et alimentent en capitaux le négoce, le raffinage, l’assurance et la construction navale.',
      'Une hiérarchie fondée sur la couleur est inscrite dans le droit colonial et survit longtemps aux abolitions.',
      'La France abolit l’esclavage en 1794, puis définitivement le 27 avril 1848 sur le rapport de Victor Schœlcher.',
      'La loi Taubira du 21 mai 2001 reconnaît la traite et l’esclavage comme crimes contre l’humanité ; le 10 mai est la journée nationale de leur mémoire.',
    ],
    chiffres: [
      { valeur: '12 à 13 millions', quoi: 'd’Africains déportés par la traite atlantique' },
      { valeur: '13 %', quoi: 'de morts en moyenne pendant la traversée de l’Atlantique' },
      { valeur: '1 700', quoi: 'expéditions négrières armées à Nantes, premier port français' },
      { valeur: '500 000', quoi: 'esclaves à Saint-Domingue en 1789, pour 30 000 Blancs' },
    ],
    chrono: [
      { date: '1444', fait: 'Premiers captifs africains débarqués à Lagos, au Portugal.' },
      { date: '1518', fait: 'Charles Quint autorise la traite directe de l’Afrique vers l’Amérique.' },
      { date: '1635', fait: 'La France s’installe à la Guadeloupe et à la Martinique.' },
      { date: 'mars 1685', fait: 'Édit dit « Code noir » pour les îles d’Amérique.' },
      { date: '1697', fait: 'Traité de Ryswick : la France obtient Saint-Domingue.' },
      { date: '1748', fait: 'Montesquieu publie « De l’esclavage des nègres ».' },
      { date: '1788', fait: 'Fondation de la Société des amis des Noirs.' },
      { date: 'août 1791', fait: 'Insurrection générale des esclaves de Saint-Domingue.' },
      { date: '4 février 1794', fait: 'La Convention abolit l’esclavage dans les colonies.' },
      { date: '1807-1815', fait: 'La Grande-Bretagne puis la France interdisent la traite.' },
      { date: '27 avril 1848', fait: 'Abolition définitive de l’esclavage en France.' },
      { date: '21 mai 2001', fait: 'La loi Taubira reconnaît un crime contre l’humanité.' },
    ],
    leSaisTu:
      'Les registres des armateurs nantais existent encore, voyage par voyage : le nom du navire, le nombre de captifs embarqués sur la côte africaine, le nombre débarqués aux Antilles, et l’écart entre les deux. Le plan peint de la *Marie-Séraphique*, en 1770, montre ses 307 captifs dans l’entrepont ; il est conservé au musée d’histoire de Nantes.',
    aRetenir: [
      'La traite atlantique déporte douze à treize millions d’Africains vers l’Amérique du XVIᵉ au XIXᵉ siècle.',
      'Le commerce triangulaire relie l’Europe (pacotille), l’Afrique (captifs) et l’Amérique (sucre, café, coton).',
      'L’édit de mars 1685, dit Code noir, déclare les esclaves « meubles » et fixe leur statut dans les colonies françaises.',
      'Nantes est le premier port négrier français, avec environ 1 700 expéditions armées.',
      'La mortalité pendant la traversée avoisine 13 % des captifs embarqués.',
      'La Convention abolit l’esclavage le 4 février 1794 ; l’abolition définitive date du 27 avril 1848.',
    ],
    mots: [
      {
        mot: 'Traite négrière',
        sens: 'Commerce consistant à acheter des êtres humains en Afrique pour les revendre comme esclaves ailleurs.',
      },
      {
        mot: 'Commerce triangulaire',
        sens: 'Circuit en trois côtés : Europe-Afrique (pacotille), Afrique-Amérique (captifs), Amérique-Europe (denrées coloniales).',
      },
      {
        mot: 'Pacotille',
        sens: 'Marchandises embarquées en Europe — étoffes, fusils, eau-de-vie, barres de fer — pour être échangées contre des captifs.',
      },
      {
        mot: 'Habitation',
        sens: 'Nom donné aux Antilles à une grande exploitation agricole esclavagiste, avec ses champs, son moulin et ses ateliers.',
      },
      {
        mot: 'Marronnage',
        sens: 'Fuite d’un esclave hors de l’habitation, temporaire ou définitive ; les fugitifs sont appelés marrons.',
      },
    ],
    lies: [
      'victor-schoelcher',
      'abolition-de-l-esclavage-1794',
      'toussaint-louverture',
      'montesquieu',
      'decouverte-de-l-amerique',
    ],
    niveaux: ['4e', '2de'],
    programme:
      'Bourgeoisies marchandes, négoces internationaux et traites négrières au XVIIIᵉ siècle',
    tags: [
      'traite',
      'esclavage',
      'Code noir',
      'commerce triangulaire',
      'Nantes',
      'Saint-Domingue',
      'négriers',
      'plantation',
      'marronnage',
      'abolition',
      'Montesquieu',
      'Equiano',
    ],
  },
]
