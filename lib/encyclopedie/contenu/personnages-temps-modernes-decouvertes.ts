// -----------------------------------------------------------------------------
// TEMPS MODERNES — l'imprimerie, les grandes découvertes et la première
// révolution scientifique : Gutenberg, Colomb, Léonard, Magellan, Vasco de
// Gama, Copernic, Cortés, Cartier, Galilée.
//
// LE TON DE CE LOT, et c'est une consigne, pas un réflexe : les grandes
// découvertes se racontent avec LEURS DEUX FACES, factuellement. D'un côté
// l'exploit — la caravelle qui remonte au vent, le point astronomique, quatre-
// vingt-dix-huit jours de Pacifique sans escale, un équipage qui accepte de
// naviguer trente-trois jours sans voir la terre. De l'autre l'effondrement
// des mondes amérindiens : Cortés, la variole, l'encomienda, un Mexique qui
// passe de plus de vingt millions d'habitants à un million en quatre-vingts
// ans. Ni épopée nettoyée, ni procès du passé : des faits, des chiffres, des
// dates, et les mots des vaincus quand ils nous sont parvenus.
//
// Le guide de rédaction complet est dans `docs/encyclopedie.md`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_TEMPS_MODERNES_DECOUVERTES: Personnage[] = [
  {
    id: 'gutenberg',
    volet: 'personnages',
    nom: 'Johannes Gutenberg',
    surnom: 'l’orfèvre qui a fondu l’alphabet',
    dates: 'vers 1400 – 1468',
    tri: 1468,
    periode: 'temps-modernes',
    emoji: '🖨️',
    roles: ['Orfèvre', 'Imprimeur', 'Inventeur de la typographie'],
    origine: 'Mayence, Saint-Empire',
    accroche:
      'Un orfèvre de Mayence fond les lettres en métal et invente la presse : en cinquante ans, l’Europe passe de quelques milliers de livres à vingt millions.',
    citations: [
      {
        texte:
          'Je n’ai pas vu de bibles entières, mais des cahiers de plusieurs livres, d’une écriture très nette et très correcte, que Votre Excellence pourrait lire sans effort et sans lunettes.',
        qui: 'Enea Silvio Piccolomini, futur pape Pie II',
        contexte:
          'Lettre au cardinal Carvajal, 12 mars 1455 : il vient d’examiner à Francfort des cahiers de la Bible de Gutenberg.',
        sens:
          'Le premier témoignage écrit sur un livre imprimé : ce qui frappe le futur pape, c’est que la machine écrit mieux qu’un copiste.',
      },
      {
        texte:
          'Ce livre des psaumes a été façonné par l’invention ingénieuse de l’impression et de la frappe des caractères, sans aucun travail de plume, l’an du Seigneur 1457.',
        qui: 'Johann Fust et Peter Schöffer',
        contexte:
          'Colophon du *Psautier de Mayence*, 1457 : le premier livre imprimé qui porte sa date et le nom de ses fabricants.',
        sens:
          'Ceux qui signent sont les deux hommes qui viennent d’emporter l’atelier de Gutenberg au tribunal. Lui n’a jamais signé une seule de ses pages.',
      },
      {
        texte:
          'Une presse d’où vont jaillir en flots intarissables les sources les plus abondantes, d’où va découler sur les hommes une vérité jusqu’ici inconnue.',
        contexte: 'Phrase prêtée à Gutenberg et reprise dans quantité de manuels.',
        sens:
          'Aucun document du XVᵉ siècle ne la contient : elle vient d’un texte romantique du XIXᵉ siècle qui lui met en bouche ce que l’on sait depuis.',
        incertaine: true,
      },
    ],
    reperes: [
      'Orfèvre de formation : il sait fondre, couler et ajuster le métal au dixième de millimètre.',
      'Son invention n’est pas un objet mais un système : poinçon, matrice, alliage, encre grasse, presse à vis.',
      'La Bible à 42 lignes, vers 1455 : environ 180 exemplaires, dont 48 subsistent aujourd’hui.',
      'Ruiné par un procès en 1455, il perd son atelier au profit de son bailleur, Johann Fust.',
      'Avant 1500, l’Europe compte plus de mille ateliers d’imprimerie dans 250 villes.',
      'Il meurt à Mayence en 1468, pensionné par l’archevêque, sans avoir signé un seul de ses livres.',
    ],
    recit: [
      {
        titre: 'Le livre avant Gutenberg',
        texte:
          'Au milieu du XVᵉ siècle, un livre se copie **à la main**. Un copiste de métier met quatre à six mois pour une Bible, sur des peaux de veau qu’il faut d’abord tanner : un exemplaire complet coûte le prix d’une petite maison, et la bibliothèque de la Sorbonne ne compte que quelques centaines de volumes. La **xylographie** — graver une page entière dans une planche de bois — existe depuis peu, mais chaque planche ne sert qu’à une seule page et s’use vite. Le savoir est rare parce que sa **copie** est rare : ce n’est pas un problème d’idées, c’est un problème de fabrication.',
      },
      {
        titre: 'L’idée : la lettre démontable',
        texte:
          'L’invention de **Johannes Gensfleisch, dit Gutenberg**, n’est pas la presse — on pressait déjà le raisin et le papier. C’est le **caractère mobile en métal**, et surtout la machine à en produire des milliers d’identiques. Il grave la lettre en relief sur un **poinçon** d’acier, l’enfonce dans une **matrice** de cuivre, et coule dans ce moule un alliage de plomb, d’étain et d’antimoine qui refroidit vite et ne se déforme pas. Chaque lettre sort au même corps, à la même hauteur : on peut les aligner, les serrer dans un cadre, imprimer, puis **tout défaire et recommencer** avec un autre texte. Il met au point en même temps une encre grasse, à base de noir de fumée et d’huile de lin, la seule qui tienne sur le métal. Vingt ans d’essais, à Strasbourg puis à Mayence, pour un système que l’Europe utilisera sans changement majeur pendant **trois cent cinquante ans**.',
      },
      {
        titre: 'La Bible à 42 lignes',
        texte:
          'Vers **1455**, l’atelier de Mayence sort la **Bible à 42 lignes** : 1 282 pages, deux colonnes, environ 180 exemplaires — 135 sur papier, 45 sur vélin, qui demandent à eux seuls la peau de cinq mille veaux. Le résultat est si net que l’acheteur ne voit pas la différence avec un manuscrit ; c’était exactement le but. Mais l’opération a coûté une fortune empruntée à **Johann Fust**. Le bailleur réclame son dû, gagne le procès la même année et emporte l’atelier, les caractères et l’associé de Gutenberg, **Peter Schöffer**. L’inventeur perd sa machine au moment précis où elle réussit. Il travaillera encore, obtiendra en 1465 une pension de l’archevêque de Mayence — du blé, du vin, un habit de cour — et mourra trois ans plus tard.',
      },
      {
        titre: 'Vingt millions de livres en cinquante ans',
        texte:
          'Les ouvriers de Mayence se dispersent, et le secret avec eux : Cologne en 1465, Rome en 1467, Paris en 1470, puis Venise — qui deviendra la capitale du livre —, Lyon, Séville, Londres. En **1500**, plus de mille ateliers ont imprimé quelque **vingt millions de volumes** pour une Europe de 80 millions d’habitants ; on appelle **incunables** les livres nés avant 1501. Le prix d’un ouvrage est divisé par dix ou par vingt. Ce qui change n’est pas seulement le nombre : c’est qu’un texte imprimé est **le même partout**, donc comparable, vérifiable, discutable. Érasme, Copernic, Rabelais, Calvin écriront pour des presses. En 1517, les thèses de **Luther** feront le tour de l’Allemagne en quinze jours — impensable avec des copistes.',
      },
    ],
    chrono: [
      { date: 'vers 1400', fait: 'Naissance à Mayence, dans une famille de patriciens.' },
      { date: 'vers 1434', fait: 'À Strasbourg, il travaille en secret à son « aventure ».' },
      { date: '1448', fait: 'Retour à Mayence ; emprunt de 800 florins à Johann Fust.' },
      { date: 'vers 1455', fait: 'Impression de la Bible à 42 lignes.' },
      { date: '1455', fait: 'Procès perdu contre Fust : il perd son atelier.' },
      { date: '1457', fait: 'Psautier de Mayence, premier livre imprimé daté et signé.' },
      { date: '1465', fait: 'L’archevêque de Mayence lui accorde une pension.' },
      { date: '3 février 1468', fait: 'Mort à Mayence.' },
      { date: '1500', fait: 'Plus de 1 000 ateliers d’imprimerie en Europe.' },
    ],
    leSaisTu:
      'Aucun livre sorti de son atelier ne porte son nom. Gutenberg n’a jamais signé : le premier ouvrage imprimé daté et signé, le Psautier de Mayence de 1457, porte le nom de Fust et de Schöffer — c’est-à-dire des deux hommes qui venaient de lui prendre son atelier au tribunal.',
    aRetenir: [
      'Gutenberg met au point vers 1450, à Mayence, l’imprimerie à caractères mobiles en métal.',
      'Son invention combine le poinçon, la matrice, l’alliage typographique, l’encre grasse et la presse à vis.',
      'La Bible à 42 lignes, imprimée vers 1455, est son chef-d’œuvre : environ 180 exemplaires.',
      'On appelle incunables les livres imprimés avant 1501 : l’Europe en produit près de vingt millions.',
      'L’imprimerie diffuse l’humanisme, la Réforme et les découvertes scientifiques à une vitesse inédite.',
    ],
    mots: [
      {
        mot: 'Incunable',
        sens: 'Livre imprimé en Europe avant 1501, aux tout débuts de l’imprimerie.',
      },
      {
        mot: 'Caractère mobile',
        sens: 'Lettre fondue en métal, réutilisable, qu’on assemble puis démonte pour composer n’importe quel texte.',
      },
      {
        mot: 'Xylographie',
        sens: 'Impression à partir d’une planche de bois gravée : une page entière d’un seul bloc, impossible à recomposer.',
      },
    ],
    lies: ['invention-de-l-imprimerie', 'leonard-de-vinci', 'copernic', 'galilee'],
    niveaux: ['5e'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'Mayence',
      'imprimerie',
      'caractères mobiles',
      'Bible à 42 lignes',
      'incunable',
      'Fust',
      'Schöffer',
      'typographie',
      'presse',
      'humanisme',
    ],
  },
  {
    id: 'christophe-colomb',
    volet: 'personnages',
    nom: 'Christophe Colomb',
    surnom: 'l’amiral de la mer Océane',
    dates: '1451 – 1506',
    tri: 1506,
    periode: 'temps-modernes',
    emoji: '⛵',
    roles: ['Navigateur génois', 'Amiral de la mer Océane', 'Vice-roi des Indes'],
    origine: 'Gênes, république de Gênes',
    accroche:
      'Il part chercher les Indes par l’ouest avec un calcul faux, touche une terre inconnue le 12 octobre 1492 — et meurt sans admettre que ce n’était pas l’Asie.',
    citations: [
      {
        texte:
          'J’arrivai à la mer des Indes, où je découvris un grand nombre d’îles habitées par une multitude innombrable de gens, et j’en ai pris possession pour Leurs Altesses.',
        contexte:
          'Lettre à Luis de Santángel, février 1493. Imprimée aussitôt, elle annonce la nouvelle à toute l’Europe.',
        sens:
          'Colomb croit sincèrement décrire les abords de l’Asie : il vient en réalité d’écrire le premier texte imprimé sur l’Amérique.',
      },
      {
        texte: 'Terre ! Terre !',
        contexte:
          'Le cri de la vigie Rodrigo de Triana, à deux heures du matin, le 12 octobre 1492, à bord de la *Pinta*.',
        sens:
          'Le journal de bord confirme que Triana vit la terre le premier, mais ne rapporte pas ses mots ; et c’est Colomb qui encaissa la récompense promise, affirmant avoir aperçu une lueur quatre heures plus tôt.',
        incertaine: true,
      },
      {
        texte:
          'Vos Altesses pensèrent à m’envoyer, moi, Christophe Colomb, vers lesdites régions de l’Inde, pour voir ces princes, ces peuples et ces terres.',
        contexte:
          'Prologue du journal de bord, adressé aux Rois Catholiques Isabelle de Castille et Ferdinand d’Aragon, 1492.',
      },
      {
        texte:
          'Ils doivent être de bons serviteurs et de bon naturel. Avec cinquante hommes, on les soumettrait tous et on leur ferait faire tout ce qu’on voudrait.',
        contexte:
          'Journal de bord, 12 octobre 1492, au premier contact avec les Taïnos de l’île de Guanahani.',
        sens:
          'La première page de la rencontre contient déjà la suite : l’île est décrite dans la même phrase comme un paradis et comme une prise.',
      },
    ],
    reperes: [
      'Fils d’un tisserand de Gênes, marin dès l’adolescence, il a navigué de l’Islande à la Guinée.',
      'Son projet repose sur une erreur : il croit la Terre d’un tiers plus petite qu’elle n’est.',
      'Refusé par le Portugal, il obtient l’accord de la Castille aux capitulations de Santa Fe, en avril 1492.',
      'Trois navires, environ 90 hommes, 33 jours de traversée depuis les Canaries.',
      'Quatre voyages entre 1492 et 1504 : Bahamas, Cuba, Hispaniola, puis le continent.',
      'Destitué et ramené enchaîné en 1500, il meurt à Valladolid en 1506, certain d’avoir atteint l’Asie.',
    ],
    recit: [
      {
        titre: 'Une erreur de calcul',
        texte:
          'Depuis la chute de **Constantinople** (1453), les épices d’Asie passent par des intermédiaires ottomans et vénitiens qui en font monter le prix. Le Portugal cherche le passage en contournant l’Afrique ; Colomb propose l’inverse : **aller aux Indes par l’ouest**. Que la Terre soit ronde n’étonne personne — les savants le savent depuis l’Antiquité, et la question ne se pose même pas. Ce qui fait débat, c’est la **distance**. Les experts portugais, puis espagnols, calculent juste : l’Asie est bien trop loin pour être atteinte d’une traite. Colomb, lui, accumule les erreurs — il prend le mille arabe pour le mille italien, suit les cartes de **Toscanelli** et raccourcit l’océan — et obtient 3 700 km entre les Canaries et le Japon, au lieu de 19 000. Son projet était donc irréalisable. Il ne réussit que parce qu’un continent inconnu se trouvait sur le chemin.',
      },
      {
        titre: 'Trente-trois jours sans voir la terre',
        texte:
          'Le **3 août 1492**, trois navires quittent **Palos de la Frontera** : la *Santa María*, la *Pinta* et la *Niña*, environ quatre-vingt-dix hommes. Après une escale aux Canaries, ils prennent les **alizés** plein ouest le 6 septembre. Trente-trois jours sans apercevoir de côte, un record pour l’époque ; l’équipage murmure, et Colomb tient deux comptes de distance, un vrai pour lui et un raccourci pour ses marins. Le **12 octobre 1492**, à deux heures du matin, la vigie de la *Pinta* signale une terre. C’est un îlot des **Bahamas** que ses habitants appellent Guanahani et que Colomb baptise San Salvador. Il y rencontre les **Taïnos**, prend possession de l’île au nom de la Castille, puis reconnaît Cuba et Haïti — qu’il nomme **Hispaniola**. La *Santa María* s’échoue la nuit de Noël ; avec ses planches, trente-neuf hommes bâtissent le fort de **La Navidad**, premier établissement européen des Amériques.',
      },
      {
        titre: 'Trois autres voyages, et une chute',
        texte:
          'Le retour de 1493 fait de lui un héros : **amiral de la mer Océane**, vice-roi des terres découvertes. Il repart aussitôt avec **17 navires et 1 200 hommes** — non plus pour explorer, mais pour coloniser. La Navidad a été détruite ; l’or promis n’arrive pas. Pour payer, Colomb impose aux Taïnos un **tribut en or** que l’île ne peut pas fournir et envoie des captifs en Espagne, ce que la reine **Isabelle** interdit. Sa gestion d’Hispaniola tourne à la révolte des colons ; en **1500**, l’enquêteur royal **Francisco de Bobadilla** le destitue et le renvoie **enchaîné** à bord. Il obtient un quatrième voyage (1502-1504), longe l’Amérique centrale, reste un an échoué en Jamaïque, rentre malade. Il meurt à **Valladolid le 20 mai 1506**, riche mais dépouillé de ses titres, persuadé jusqu’au bout d’avoir touché l’Asie.',
      },
      {
        titre: 'Ce que sa traversée a ouvert',
        texte:
          'Colomb n’a pas découvert un monde vide : les Amériques comptent alors des dizaines de millions d’habitants, des États, des villes et des écritures. Ce qu’il ouvre, c’est un **contact permanent** entre deux moitiés du monde séparées depuis des millénaires. Dans un sens partent le blé, la canne à sucre, le cheval, le porc — et les **microbes**, variole et rougeole, contre lesquels les populations américaines n’ont aucune défense : c’est ce qu’on appelle l’**échange colombien**. Dans l’autre reviennent le maïs, la pomme de terre, la tomate, le cacao, le tabac, qui nourriront l’Europe. Avec les colons viennent aussi la conquête, l’**encomienda** — le travail forcé des Indiens au profit d’un colon — puis la **traite atlantique**. L’Amérique de 1492 disparaît en un siècle ; le monde, lui, devient pour la première fois un seul espace.',
      },
    ],
    chrono: [
      { date: '1451', fait: 'Naissance à Gênes.' },
      { date: '17 avril 1492', fait: 'Capitulations de Santa Fe : la Castille finance le voyage.' },
      { date: '3 août 1492', fait: 'Départ de Palos de la Frontera avec trois navires.' },
      { date: '12 octobre 1492', fait: 'Première terre américaine : l’île de Guanahani.' },
      { date: '1493', fait: 'Retour triomphal ; second voyage dès septembre.' },
      { date: '1494', fait: 'Traité de Tordesillas : le monde partagé en deux.' },
      { date: '1498', fait: 'Troisième voyage : il atteint le continent, à l’Orénoque.' },
      { date: '1500', fait: 'Destitué, il est ramené enchaîné en Espagne.' },
      { date: '1502-1504', fait: 'Quatrième voyage, le long de l’Amérique centrale.' },
      { date: '20 mai 1506', fait: 'Mort à Valladolid.' },
    ],
    leSaisTu:
      'Le continent ne porte pas son nom. En 1507, un géographe installé à Saint-Dié, Martin Waldseemüller, imprime une carte du monde et baptise la terre nouvelle America, d’après Amerigo Vespucci — le premier à avoir écrit qu’il s’agissait d’un « nouveau monde » et non de l’Asie. Colomb, lui, n’en a jamais convenu.',
    aRetenir: [
      'Christophe Colomb atteint l’Amérique le 12 octobre 1492, en cherchant la route des Indes par l’ouest.',
      'Il navigue pour les Rois Catholiques, selon les capitulations de Santa Fe signées en avril 1492.',
      'Il fait quatre voyages entre 1492 et 1504 et meurt en 1506 sans savoir qu’il a abordé un continent inconnu.',
      'Le traité de Tordesillas (1494) partage les terres à découvrir entre l’Espagne et le Portugal.',
      'Sa traversée ouvre l’échange colombien : plantes, animaux, hommes et microbes passent d’un monde à l’autre.',
    ],
    mots: [
      {
        mot: 'Caravelle',
        sens: 'Petit navire rapide à voiles latines, capable de remonter au vent : l’outil des grandes découvertes.',
      },
      {
        mot: 'Échange colombien',
        sens: 'Le passage, dans les deux sens, des plantes, des animaux, des hommes et des maladies entre l’Europe et l’Amérique après 1492.',
      },
      {
        mot: 'Encomienda',
        sens: 'Droit accordé à un colon espagnol sur le travail d’un groupe d’Indiens, en échange de leur évangélisation.',
      },
    ],
    lies: ['decouverte-de-l-amerique', 'magellan', 'vasco-de-gama', 'hernan-cortes'],
    niveaux: ['5e'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Colomb',
      '1492',
      'Santa María',
      'Niña',
      'Pinta',
      'Bahamas',
      'Hispaniola',
      'Rois Catholiques',
      'Tordesillas',
      'Taïnos',
      'Amérique',
    ],
  },
  {
    id: 'leonard-de-vinci',
    volet: 'personnages',
    nom: 'Léonard de Vinci',
    surnom: 'l’homme sans lettres',
    dates: '1452 – 1519',
    tri: 1519,
    periode: 'temps-modernes',
    emoji: '🎨',
    roles: ['Peintre', 'Ingénieur', 'Anatomiste', 'Architecte'],
    origine: 'Vinci, république de Florence',
    accroche:
      'Peintre de *La Joconde*, dissecteur de cadavres, ingénieur de machines volantes : il a noirci des milliers de feuillets pour comprendre comment le monde est fait.',
    citations: [
      {
        texte: 'Le soleil ne bouge pas.',
        contexte:
          'Note écrite en grandes lettres, seule sur une page de ses carnets, vers 1510 — trente ans avant la publication de Copernic.',
        sens:
          'Il ne démontre rien et ne publie rien : il inscrit pour lui-même une idée que son siècle tient encore pour absurde.',
      },
      {
        texte: 'Ostinato rigore.',
        contexte:
          'Devise qu’il inscrit au bas d’un de ses dessins, à côté d’un compas et d’une charrue en plein travail.',
        sens:
          '« Rigueur obstinée » : sa méthode tient en deux mots latins — observer, mesurer, et recommencer jusqu’à comprendre.',
      },
      {
        texte:
          'En temps de paix, je crois pouvoir soutenir la comparaison avec n’importe qui en architecture, en sculpture et en peinture.',
        contexte:
          'Dernier paragraphe de la lettre de candidature adressée vers 1482 à Ludovic Sforza, duc de Milan.',
        sens:
          'Les neuf paragraphes précédents énumèrent ses ponts démontables et ses machines de guerre : la peinture, dont nous nous souvenons, arrive en dernier.',
      },
      {
        texte:
          'Le peintre qui dessine par pratique et jugement d’œil, sans raison, est comme le miroir qui reproduit tout ce qui est devant lui sans rien en connaître.',
        contexte:
          'Carnets, réunis après sa mort sous le titre de *Traité de la peinture*.',
      },
    ],
    reperes: [
      'Fils naturel d’un notaire de Vinci, il n’apprend ni le latin ni le grec et se dit « homme sans lettres ».',
      'Formé à Florence dans l’atelier de Verrocchio, où l’on peint, sculpte et fond le bronze.',
      'Dix-sept ans au service de Ludovic Sforza à Milan, comme ingénieur autant que comme peintre.',
      'Environ 6 000 feuillets de carnets nous sont parvenus, écrits à l’envers, de la main gauche.',
      'Il dissèque une trentaine de corps et dessine le premier un fœtus dans l’utérus.',
      'Invité par François Ier, il meurt au Clos Lucé, près d’Amboise, le 2 mai 1519.',
    ],
    recit: [
      {
        titre: 'L’enfant de Vinci',
        texte:
          'Né le **15 avril 1452** près de **Vinci**, en Toscane, Léonard est le fils naturel d’un notaire et d’une paysanne, Caterina. Illégitime, il ne peut ni entrer à l’université ni reprendre la charge de son père : c’est ce qui le pousse vers l’atelier. Vers quatorze ans, il entre chez **Andrea del Verrocchio**, à Florence, où l’on apprend d’un même mouvement la peinture, la sculpture, la fonte du bronze et la mécanique des chantiers. Il n’a presque pas de latin et le regrettera toute sa vie, se qualifiant lui-même d’« homme sans lettres ». Faute de pouvoir lire les Anciens, il prend l’habitude de **tout vérifier par lui-même** : l’œil et l’expérience contre l’autorité des livres. C’est, sans qu’il l’ait formulé ainsi, la méthode qui fera la science moderne.',
      },
      {
        titre: 'Milan : l’ingénieur avant le peintre',
        texte:
          'Vers **1482**, il s’offre au duc de Milan **Ludovic Sforza** par une lettre restée célèbre : neuf paragraphes de ponts démontables, de canons, de chars couverts, et une dernière ligne sur la peinture. On l’engage comme **ingénieur militaire et organisateur de fêtes**. Il y reste dix-sept ans. Il projette un cheval de bronze colossal — jamais fondu, le métal partira en canons —, étudie l’écoulement des eaux, dessine des machines textiles, un scaphandre, une vis aérienne, un parachute pyramidal. Et il peint *La Vierge aux rochers*, *La Dame à l’hermine*, puis la ***Cène*** (1495-1498) sur le mur du réfectoire de Santa Maria delle Grazie : au lieu de la fresque, qui oblige à peindre vite et sans retouche, il essaie une détrempe à l’huile qui lui laisse le temps de reprendre — et qui commencera à se décoller de son vivant.',
      },
      {
        titre: 'Les carnets',
        texte:
          'Toute sa vie, Léonard écrit et dessine sur des feuillets qu’il ne publie jamais : environ **6 000 pages** nous sont parvenues, peut-être la moitié de ce qu’il a produit, dispersées dans le *Codex Atlanticus*, les manuscrits de Windsor, le *Codex Leicester*. Il écrit de droite à gauche, en **miroir** — il était gaucher. On y trouve des **dissections** (une trentaine de corps, autorisées dans un hôpital de Florence), les premières coupes exactes du crâne, du cœur et de la colonne, un fœtus dessiné en 1511 ; des études du vol des oiseaux et des machines volantes ; des tourbillons d’eau ; des listes de courses ; un projet de ville à deux étages conçu après une peste. Rien de tout cela n’est imprimé de son temps : ses découvertes d’anatomie seront refaites, un siècle plus tard, par d’autres.',
      },
      {
        titre: 'La Joconde et Amboise',
        texte:
          'À partir de **1503**, il travaille au portrait de **Lisa Gherardini**, épouse d’un marchand florentin — *La Joconde*. Il ne le livre jamais, le garde près de lui et le retouche pendant seize ans, superposant des glacis si fins qu’aucun trait n’est visible : c’est le **sfumato**, « à la manière d’une fumée ». Après Milan, Rome et Florence, il accepte en **1516** l’invitation de **François Ier**, qui l’installe au manoir du **Clos Lucé**, près d’Amboise, avec une forte pension et le titre de « premier peintre, premier ingénieur et premier architecte du Roi ». Il emporte trois tableaux dans ses bagages, dont *La Joconde* — c’est ainsi qu’elle est française. Il dessine des fêtes, un palais à Romorantin, un escalier à double révolution. Il meurt le **2 mai 1519**, à soixante-sept ans.',
      },
    ],
    chrono: [
      { date: '15 avril 1452', fait: 'Naissance près de Vinci, en Toscane.' },
      { date: 'vers 1466', fait: 'Entre dans l’atelier de Verrocchio, à Florence.' },
      { date: 'vers 1482', fait: 'Entre au service de Ludovic Sforza, à Milan.' },
      { date: 'vers 1490', fait: 'Dessine l’Homme de Vitruve.' },
      { date: '1495-1498', fait: 'Peint la Cène à Santa Maria delle Grazie.' },
      { date: 'vers 1503', fait: 'Commence le portrait de Lisa Gherardini, la Joconde.' },
      { date: '1513-1516', fait: 'Séjour à Rome, au service des Médicis.' },
      { date: '1516', fait: 'François Ier l’installe au Clos Lucé, près d’Amboise.' },
      { date: '2 mai 1519', fait: 'Mort au Clos Lucé.' },
    ],
    leSaisTu:
      'Ses machines volantes n’ont jamais volé, et il le savait : la force des bras d’un homme n’y suffit pas. Mais son parachute pyramidal, dessiné vers 1485 avec la note « on pourra se jeter de n’importe quelle hauteur sans se faire mal », a été construit à l’identique en 2000 par un Britannique, Adrian Nicholas. Il a fonctionné.',
    aRetenir: [
      'Léonard de Vinci (1452-1519) est la figure même de l’homme de la Renaissance : peintre, ingénieur, anatomiste.',
      'Il peint la Cène à Milan entre 1495 et 1498, et la Joconde, commencée vers 1503 et jamais livrée.',
      'Ses carnets, environ 6 000 feuillets écrits en miroir, ne sont pas publiés de son vivant.',
      'Il vérifie tout par l’observation et l’expérience plutôt que par l’autorité des livres : c’est l’esprit humaniste.',
      'François Ier l’accueille au Clos Lucé en 1516 ; il y meurt le 2 mai 1519.',
    ],
    mots: [
      {
        mot: 'Humanisme',
        sens: 'Mouvement de la Renaissance qui remet l’homme, son savoir et son jugement au centre, en s’appuyant sur les textes antiques.',
      },
      {
        mot: 'Sfumato',
        sens: 'Technique de Léonard : des couches de peinture très fines qui effacent les contours, « à la manière d’une fumée ».',
      },
      {
        mot: 'Mécène',
        sens: 'Personne riche et puissante qui entretient un artiste ou un savant pour qu’il crée.',
      },
    ],
    lies: ['francois-ier', 'gutenberg', 'copernic', 'galilee'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'Vinci',
      'Joconde',
      'Cène',
      'Clos Lucé',
      'Amboise',
      'carnets',
      'sfumato',
      'Renaissance',
      'ingénieur',
      'anatomie',
      'Sforza',
      'François Ier',
    ],
  },
  {
    id: 'magellan',
    volet: 'personnages',
    nom: 'Fernand de Magellan',
    surnom: 'celui qui n’a pas fini son tour du monde',
    dates: 'vers 1480 – 1521',
    tri: 1521,
    periode: 'temps-modernes',
    emoji: '🌍',
    roles: ['Navigateur portugais', 'Capitaine général de l’armada d’Espagne'],
    origine: 'Sabrosa, royaume de Portugal',
    accroche:
      'Il cherchait un passage vers les épices par l’ouest ; il est mort aux Philippines, et l’un de ses cinq navires est rentré seul, après le premier tour du monde.',
    citations: [
      {
        texte:
          'Nous mangions du biscuit qui n’était plus du biscuit, mais de la poudre mêlée de vers, et nous buvions une eau jaune et pourrie depuis plusieurs jours.',
        qui: 'Antonio Pigafetta, chroniqueur du voyage',
        contexte:
          'La traversée du Pacifique : quatre-vingt-dix-huit jours sans escale, entre novembre 1520 et mars 1521.',
      },
      {
        texte:
          'Il était plus constant qu’aucun autre dans la plus grande adversité, et il supportait la faim mieux que nous tous.',
        qui: 'Antonio Pigafetta',
        contexte:
          'Éloge écrit après la mort de Magellan à Mactan, dans sa *Relation du premier voyage autour du monde*.',
      },
      {
        texte: 'Nous avons découvert et fait le tour de toute la rondeur du monde.',
        qui: 'Juan Sebastián Elcano',
        contexte:
          'Lettre à Charles Quint, le 6 septembre 1522, au retour de la *Victoria* à Sanlúcar avec dix-huit survivants.',
      },
      {
        texte:
          'L’Église dit que la Terre est plate, mais je sais qu’elle est ronde, car j’ai vu son ombre sur la Lune.',
        contexte: 'Phrase prêtée à Magellan et longtemps recopiée dans les manuels.',
        sens:
          'Elle a été inventée en 1873 par un orateur américain, Robert Ingersoll. Aucun texte du XVIᵉ siècle ne la contient — et personne, alors, ne croyait la Terre plate.',
        incertaine: true,
      },
    ],
    reperes: [
      'Portugais passé au service du roi d’Espagne, après avoir été éconduit par le sien.',
      'Cinq navires et environ 240 hommes quittent Sanlúcar de Barrameda le 20 septembre 1519.',
      'Il mate en Patagonie, à Pâques 1520, une mutinerie de ses capitaines espagnols.',
      'Le détroit qui porte son nom, trouvé en octobre 1520, est un labyrinthe de 600 km.',
      'La traversée du Pacifique dure 98 jours sans une escale : le scorbut tue une vingtaine d’hommes.',
      'Tué le 27 avril 1521 à Mactan ; la Victoria rentre en 1522 avec 18 hommes sur 240.',
    ],
    recit: [
      {
        titre: 'Un Portugais au service de l’Espagne',
        texte:
          '**Fernand de Magellan** a servi dix ans le Portugal en Inde et à Malacca ; blessé au Maroc, accusé de trafic, il tombe en disgrâce et le roi **Manuel Ier** lui refuse jusqu’à une augmentation de solde. Il renonce alors à sa nationalité et passe, en 1518, au service du jeune roi d’Espagne **Charles Ier** — le futur Charles Quint. Son argument est juridique autant que géographique : le **traité de Tordesillas** (1494) a partagé le monde entre les deux couronnes, et les **Moluques**, les îles à épices, tomberaient peut-être du côté espagnol si l’on y arrivait par l’ouest. Reste à trouver le passage : au sud du Brésil, personne ne sait ce qu’il y a.',
      },
      {
        titre: 'La mutinerie et le détroit',
        texte:
          'Cinq navires — *Trinidad*, *San Antonio*, *Concepción*, *Victoria*, *Santiago* — appareillent le **20 septembre 1519** avec environ 240 hommes. L’hiver austral les immobilise cinq mois dans la baie de **Port-Saint-Julien**, en Patagonie. À Pâques 1520, trois capitaines espagnols se soulèvent contre ce chef étranger : Magellan reprend les navires par la ruse, fait exécuter un meneur et abandonne deux hommes sur la côte. Le *Santiago* se brise en reconnaissance. Le **21 octobre 1520**, une échancrure s’ouvre enfin dans la côte : trente-huit jours de labyrinthe entre falaises et glaciers, six cents kilomètres — et le *San Antonio*, qui portait le plus gros des vivres, fait demi-tour en cachette pour rentrer en Espagne. Le **28 novembre**, trois navires débouchent sur une mer si calme que Magellan la nomme **Pacifique**.',
      },
      {
        titre: 'Quatre-vingt-dix-huit jours',
        texte:
          'Il croit l’Asie à quelques semaines. Il y a **quatre-vingt-dix-huit jours** de mer sans un seul ravitaillement : les cartes de l’époque rapetissent l’océan, et personne n’imagine qu’il couvre un tiers de la planète. Les vivres pourrissent, l’eau devient jaune ; les hommes mangent la sciure et le cuir des vergues trempé dans l’eau de mer, et les rats se vendent un demi-ducat. Le **scorbut** — le manque de vitamine C, qu’on ne connaît pas encore — fait gonfler les gencives et tue une vingtaine d’hommes. Ils atteignent **Guam** le 6 mars 1521, puis les **Philippines**. Magellan s’y mêle des querelles locales : allié du roi de Cebu qu’il vient de faire baptiser, il attaque l’île voisine de **Mactan** avec quarante-neuf hommes contre plus d’un millier. Il y est tué le **27 avril 1521**, à coups de lance, dans l’eau, en couvrant la retraite des siens.',
      },
      {
        titre: 'Le tour du monde, et le jour perdu',
        texte:
          'Les survivants brûlent la *Concepción*, faute d’équipage pour la manœuvrer. La *Trinidad* tente le retour par le Pacifique et se fait prendre par les Portugais. Reste la ***Victoria***, chargée de girofle, que **Juan Sebastián Elcano** ramène par l’océan Indien et le cap de Bonne-Espérance en évitant tous les ports portugais : elle touche **Sanlúcar le 6 septembre 1522** avec **dix-huit hommes** sur environ deux cent quarante. La cargaison d’épices paie à elle seule l’expédition entière. En débarquant, l’équipage découvre qu’il est **un jour en retard** sur le calendrier de ceux restés à terre : en suivant le soleil vers l’ouest, ils ont perdu une journée. Personne ne l’avait prévu. C’est la première preuve rapportée par des hommes, et non calculée par des savants, que la Terre est un globe dont on peut faire le tour.',
      },
    ],
    chrono: [
      { date: '20 septembre 1519', fait: 'Départ de Sanlúcar de Barrameda, cinq navires.' },
      { date: 'avril 1520', fait: 'Mutinerie des capitaines espagnols à Port-Saint-Julien.' },
      { date: '21 octobre 1520', fait: 'Découverte du détroit qui portera son nom.' },
      { date: '28 novembre 1520', fait: 'Entrée dans le Pacifique.' },
      { date: '6 mars 1521', fait: 'Arrivée à Guam, après 98 jours de mer.' },
      { date: '27 avril 1521', fait: 'Magellan est tué à Mactan, aux Philippines.' },
      { date: 'novembre 1521', fait: 'Les survivants atteignent les Moluques et chargent le girofle.' },
      { date: '6 septembre 1522', fait: 'La Victoria rentre à Sanlúcar avec 18 hommes.' },
    ],
    leSaisTu:
      'Antonio Pigafetta, un jeune Vénitien embarqué comme simple passager pour « voir les très grandes et admirables choses de l’océan », a tenu le journal du voyage. Sans lui, on ne saurait presque rien : il fait partie des dix-huit revenus, et il a noté jusqu’aux mots des langues rencontrées, dressant les premiers lexiques du Pacifique.',
    aRetenir: [
      'L’expédition de Magellan part en 1519 pour atteindre les Moluques par l’ouest, au nom de Charles Quint.',
      'Le détroit de Magellan, franchi en 1520, ouvre le passage entre l’Atlantique et le Pacifique.',
      'Magellan est tué aux Philippines le 27 avril 1521 : il n’achève pas lui-même le tour du monde.',
      'Elcano ramène la Victoria le 6 septembre 1522 : premier tour du monde, 18 survivants sur environ 240.',
      'Le décalage d’un jour constaté au retour prouve que la Terre est un globe que l’on peut contourner.',
    ],
    mots: [
      {
        mot: 'Scorbut',
        sens: 'Maladie due au manque de vitamine C, qui déchausse les dents et tue : la hantise des longues traversées.',
      },
      {
        mot: 'Détroit',
        sens: 'Bras de mer étroit qui fait communiquer deux mers ou deux océans.',
      },
      {
        mot: 'Traité de Tordesillas',
        sens: 'Accord de 1494 qui partage les terres à découvrir entre l’Espagne et le Portugal, de part et d’autre d’une ligne tracée dans l’Atlantique.',
      },
    ],
    lies: ['premier-tour-du-monde', 'christophe-colomb', 'vasco-de-gama'],
    niveaux: ['5e'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Magellan',
      'détroit',
      'Pacifique',
      'Victoria',
      'Elcano',
      'Pigafetta',
      'Moluques',
      'Mactan',
      'tour du monde',
      'Charles Quint',
      'épices',
    ],
  },
  {
    id: 'vasco-de-gama',
    volet: 'personnages',
    nom: 'Vasco de Gama',
    surnom: 'l’homme de la route des Indes',
    dates: 'vers 1469 – 1524',
    tri: 1524,
    periode: 'temps-modernes',
    emoji: '🧭',
    roles: ['Navigateur portugais', 'Amiral des Indes', 'Vice-roi des Indes'],
    origine: 'Sines, royaume de Portugal',
    accroche:
      'Le premier à relier l’Europe à l’Inde par la mer : dix mois d’aller, la moitié de ses hommes perdus, et la route des épices arrachée à Venise.',
    citations: [
      {
        texte: 'Nous venons chercher des chrétiens et des épices.',
        contexte:
          'Réponse à deux marchands tunisiens parlant castillan, stupéfaits de voir des Portugais débarquer à Calicut, en mai 1498.',
        sens:
          'Les deux buts du Portugal en une phrase : trouver des alliés chrétiens à revers de l’islam, et prendre la route du poivre à sa source.',
      },
      {
        texte: 'Par des mers que nul n’avait naviguées auparavant.',
        qui: 'Luís de Camões',
        contexte:
          'Premier chant des *Lusiades* (1572), l’épopée nationale portugaise qui a pour héros Vasco de Gama.',
      },
      {
        texte:
          'Au nom de Dieu, amen. En l’an 1497, le roi dom Manuel, premier de ce nom en Portugal, envoya découvrir quatre navires.',
        contexte:
          'Première phrase du *Roteiro*, le journal anonyme du voyage, tenu à bord par un membre de l’équipage.',
      },
    ],
    reperes: [
      'Fils d’un petit noble de Sines, il est choisi par le roi Manuel Ier à moins de trente ans.',
      'Quatre navires et environ 170 hommes quittent Lisbonne le 8 juillet 1497.',
      'Il double le cap de Bonne-Espérance le 22 novembre 1497, neuf ans après Bartolomeu Dias.',
      'Un pilote recruté à Malindi lui fait traverser l’océan Indien en vingt-trois jours.',
      'Arrivée à Calicut le 20 mai 1498 ; retour en 1499 avec 55 hommes sur 170.',
      'Second voyage en 1502, bien plus brutal ; vice-roi des Indes en 1524, il meurt à Cochin.',
    ],
    recit: [
      {
        titre: 'Quatre-vingts ans à descendre l’Afrique',
        texte:
          'Depuis **Henri le Navigateur**, le Portugal descend la côte africaine cap par cap : Bojador en 1434, le Sénégal, la Guinée et son or, le Congo, et enfin le **cap de Bonne-Espérance** doublé par **Bartolomeu Dias** en 1488. L’objectif est double : contourner les intermédiaires musulmans et vénitiens qui tiennent le commerce des épices, et rejoindre le royaume chrétien du **prêtre Jean** que l’on situe quelque part derrière les terres d’islam. Le poivre, la cannelle, le girofle et le gingembre servent à conserver, à soigner et à assaisonner ; ils valent, débarqués à Lisbonne, jusqu’à cent fois leur prix d’achat en Inde. Le roi **Manuel Ier** confie en 1497 l’étape décisive à un capitaine encore peu connu, **Vasco de Gama**.',
      },
      {
        titre: 'Dix mois pour atteindre l’Inde',
        texte:
          'Le **8 juillet 1497**, quatre navires quittent Lisbonne. Au lieu de longer l’Afrique, Gama ose une **grande boucle en plein Atlantique** pour attraper les vents favorables : trois mois sans voir la terre, du jamais-vu. Il double le **cap de Bonne-Espérance le 22 novembre**, remonte une côte est-africaine qu’aucun Européen ne connaît, se fait chasser de Mozambique puis de Mombasa, et trouve à **Malindi** un souverain hostile à ses rivaux — et un **pilote** rompu au régime de la mousson. Vingt-trois jours de traversée, et le **20 mai 1498** les navires mouillent devant **Calicut**, sur la côte de Malabar. Le port est un carrefour où se croisent Arabes, Gujaratis, Chinois. Les cadeaux du roi de Portugal — étoffes rayées, bassines de cuivre, sucre, miel, huile — font rire à la cour du **Samorin** : on n’offre pas cela à un prince des Indes.',
      },
      {
        titre: 'Le prix du retour',
        texte:
          'Le retour est un désastre de navigation : reparti à contre-mousson, Gama met **trois mois** à retraverser l’océan Indien au lieu de vingt-trois jours. Le **scorbut** décime les équipages ; un navire est brûlé faute d’hommes pour le manœuvrer. Sur environ cent soixante-dix partis, **cinquante-cinq reviennent**, en 1499. Et pourtant c’est un triomphe : la cargaison rembourse plusieurs dizaines de fois le coût de l’expédition, et la **route des épices** échappe d’un coup à Venise et au Caire. En vingt ans, Lisbonne devient la place du poivre en Europe, et le roi prend le titre de « seigneur de la conquête, de la navigation et du commerce d’Éthiopie, d’Arabie, de Perse et de l’Inde ».',
      },
      {
        titre: 'L’autre face de la route des Indes',
        texte:
          'Le Portugal ne cherche bientôt plus à commercer, mais à **tenir la mer**. En **1502**, Gama repart avec une vingtaine de navires armés. Il bombarde **Calicut**, exige le renvoi des marchands musulmans, et fait brûler le ***Miri***, un navire de pèlerins revenant de La Mecque, avec plusieurs centaines de personnes à bord, femmes et enfants compris. Ces méthodes ne sont pas un dérapage : elles fondent l’**Estado da Índia**, un empire de forteresses et de comptoirs — Goa, Ormuz, Malacca — qui contrôlera les détroits par la force pendant un siècle, et imposera aux navires locaux un laissez-passer payant. Nommé **vice-roi des Indes** en 1524 pour reprendre en main une colonie minée par la corruption, Vasco de Gama meurt à **Cochin** le 24 décembre de la même année.',
      },
    ],
    chrono: [
      { date: '1488', fait: 'Bartolomeu Dias double le cap de Bonne-Espérance.' },
      { date: '8 juillet 1497', fait: 'Départ de Lisbonne avec quatre navires.' },
      { date: '22 novembre 1497', fait: 'Passage du cap de Bonne-Espérance.' },
      { date: 'avril 1498', fait: 'Escale à Malindi : un pilote accepte de le mener en Inde.' },
      { date: '20 mai 1498', fait: 'Arrivée à Calicut, sur la côte de Malabar.' },
      { date: 'septembre 1499', fait: 'Retour à Lisbonne avec 55 survivants.' },
      { date: '1502', fait: 'Second voyage, en armes : bombardement de Calicut.' },
      { date: '24 décembre 1524', fait: 'Mort à Cochin, peu après sa nomination comme vice-roi.' },
    ],
    leSaisTu:
      'Les cadeaux prévus pour le Samorin de Calicut — douze pièces de tissu rayé, quatre capuchons écarlates, six chapeaux, des bassines de cuivre, du sucre, du miel et de l’huile — ont été refusés par ses officiers, qui ont expliqué que le plus pauvre marchand de La Mecque offrait mieux. Le Portugal découvrait qu’à l’échelle de l’océan Indien, il était un royaume pauvre.',
    aRetenir: [
      'Vasco de Gama ouvre la route maritime des Indes : parti le 8 juillet 1497, il atteint Calicut le 20 mai 1498.',
      'Il double le cap de Bonne-Espérance, que Bartolomeu Dias avait franchi le premier en 1488.',
      'Le voyage coûte la vie à plus de la moitié de l’équipage, surtout à cause du scorbut.',
      'La route des épices échappe à Venise : Lisbonne devient la grande place du commerce du poivre.',
      'Le second voyage, en 1502, fonde par la force l’empire portugais des comptoirs de l’océan Indien.',
    ],
    mots: [
      {
        mot: 'Comptoir',
        sens: 'Établissement commercial fortifié installé par des marchands étrangers sur une côte lointaine.',
      },
      {
        mot: 'Mousson',
        sens: 'Vent saisonnier de l’océan Indien, qui souffle six mois dans un sens puis six mois dans l’autre.',
      },
      {
        mot: 'Samorin',
        sens: 'Titre du souverain hindou de Calicut, maître du plus grand port à épices de la côte de Malabar.',
      },
    ],
    lies: ['christophe-colomb', 'magellan', 'premier-tour-du-monde'],
    niveaux: ['5e'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Gama',
      'Calicut',
      'Bonne-Espérance',
      'épices',
      'poivre',
      'Portugal',
      'Malindi',
      'Samorin',
      'océan Indien',
      'Lisbonne',
      'Manuel Ier',
    ],
  },
  {
    id: 'copernic',
    volet: 'personnages',
    nom: 'Nicolas Copernic',
    surnom: 'le chanoine qui a déplacé la Terre',
    dates: '1473 – 1543',
    tri: 1543,
    periode: 'temps-modernes',
    emoji: '🪐',
    roles: ['Chanoine', 'Astronome', 'Médecin'],
    origine: 'Toruń, royaume de Pologne',
    accroche:
      'Un chanoine polonais ôte la Terre du centre du monde et en fait une planète parmi d’autres — puis attend trente ans, et sa mort, pour le publier.',
    citations: [
      {
        texte:
          'Au milieu de tout siège le Soleil. Dans ce temple magnifique, qui pourrait placer ce luminaire en un lieu meilleur, d’où il puisse tout éclairer à la fois ?',
        contexte:
          '*Des révolutions des sphères célestes*, livre I, chapitre 10, imprimé à Nuremberg en 1543.',
        sens:
          'Il ne prouve pas : il montre que son modèle est plus simple et plus beau. À l’époque, c’est un argument.',
      },
      {
        texte:
          'Certains, dès qu’ils apprendront que j’attribue des mouvements au globe terrestre, crieront aussitôt qu’il faut me condamner avec une telle opinion.',
        contexte: 'Dédicace du *De revolutionibus* au pape Paul III, écrite en 1542.',
        sens:
          'Il sait exactement ce qu’il risque et prend les devants en dédiant son livre au pape lui-même.',
      },
      {
        texte: 'Les mathématiques s’écrivent pour les mathématiciens.',
        contexte:
          'Toujours dans la dédicace à Paul III : sa réponse à ceux qui le jugeront sans savoir calculer.',
      },
      {
        texte:
          'Il n’est pas nécessaire que ces hypothèses soient vraies, ni même vraisemblables ; il suffit qu’elles donnent un calcul conforme aux observations.',
        qui: 'Andreas Osiander, qui a surveillé l’impression',
        contexte:
          'Préface anonyme ajoutée en tête du *De revolutionibus*, en 1543, à l’insu de l’auteur.',
        sens:
          'Un théologien luthérien désamorce le livre avant qu’on l’ouvre, en le présentant comme un simple outil de calcul. Copernic, mourant, ne l’a sans doute jamais su.',
      },
    ],
    reperes: [
      'Chanoine de la cathédrale de Frombork, en Prusse polonaise : l’astronomie n’est pas son métier.',
      'Formé à Cracovie, Bologne et Padoue ; docteur en droit canon, médecin et administrateur.',
      'Dès 1514, il fait circuler un résumé manuscrit, le Commentariolus, sans le publier.',
      'Son système place le Soleil au centre et donne à la Terre trois mouvements, dont la rotation du jour.',
      'Il garde les cercles parfaits et les épicycles : son modèle n’est pas plus exact que l’ancien.',
      'Le De revolutionibus paraît en 1543, l’année de sa mort ; il est mis à l’Index en 1616.',
    ],
    recit: [
      {
        titre: 'Un ciel qui ne tourne pas rond',
        texte:
          'Depuis **Ptolémée** (IIᵉ siècle), on explique le ciel ainsi : la **Terre est immobile au centre**, et tout le reste tourne autour d’elle sur des sphères emboîtées. Le système fonctionne, mais mal : pour rendre compte des planètes qui semblent parfois revenir en arrière, il faut empiler des **épicycles**, des cercles portés par d’autres cercles, jusqu’à une quarantaine. Au XVᵉ siècle, le calendrier lui-même dérive et l’Église réclame une réforme. **Nicolas Copernic**, né à Toruń en 1473, étudie le droit et la médecine en Italie, y lit les astronomes antiques — dont **Aristarque de Samos**, qui avait proposé un Soleil central dix-huit siècles plus tôt — et rentre en Prusse comme chanoine, avec une tour de la cathédrale pour observatoire.',
      },
      {
        titre: 'Déplacer la Terre',
        texte:
          'Son idée tient en une inversion : **c’est la Terre qui tourne**, sur elle-même en un jour et autour du Soleil en un an. Tout s’éclaire d’un coup. Le mouvement rétrograde de Mars cesse d’être un mécanisme mystérieux : c’est un effet de perspective, la Terre doublant Mars sur une orbite plus rapide. L’ordre des planètes et leurs distances relatives se déduisent enfin du calcul, au lieu d’être posés d’autorité. Mais Copernic reste un homme de son temps : il garde les **cercles parfaits** — il faudra Kepler et ses ellipses pour s’en passer — et doit donc conserver des épicycles. Son modèle n’est **pas plus précis** que celui de Ptolémée. Il est plus simple, plus cohérent, et fait de la Terre un astre comme les autres : c’est cela que le siècle n’encaissera pas.',
      },
      {
        titre: 'Trente ans de silence',
        texte:
          'Copernic achève son livre vers 1530 et ne le publie pas. Il sait que déplacer la Terre contredit des versets de la Bible — « Soleil, arrête-toi ! » ordonne Josué — et il craint moins le tribunal que le **ridicule** : un astronome qui se trompe est risible, et il ne peut pas prouver le mouvement de la Terre. Pendant vingt ans, il soigne des malades, administre son chapitre, rédige même un traité sur la monnaie. C’est un jeune mathématicien luthérien, **Georg Joachim Rheticus**, venu de Wittenberg en 1539, qui l’arrache à son silence : il publie un résumé enthousiaste, la *Narratio prima*, puis emporte le manuscrit à Nuremberg. Le livre s’imprime en **1543** sous le titre *De revolutionibus orbium coelestium*, dédié au pape **Paul III**.',
      },
      {
        titre: 'L’exemplaire du dernier jour',
        texte:
          'L’imprimeur confie la surveillance du texte à **Andreas Osiander**, théologien luthérien, qui ajoute sans prévenir une **préface anonyme** : ce que vous allez lire, écrit-il en substance, n’est qu’un artifice de calcul, pas une description du monde. Pendant des décennies, beaucoup de lecteurs attribueront cette préface à Copernic — ce qui protège le livre et l’affaiblit en même temps. La tradition veut qu’on ait posé le premier exemplaire imprimé entre les mains de l’auteur le jour de sa mort, le **24 mai 1543**. L’ouvrage se vend mal, à quelques centaines d’exemplaires. Mais **Kepler**, **Galilée** et **Newton** partiront de là. L’Église ne réagira qu’en **1616**, en suspendant le livre « jusqu’à correction » : il aura fallu que quelqu’un ose dire que ce n’était pas une hypothèse.',
      },
    ],
    chrono: [
      { date: '19 février 1473', fait: 'Naissance à Toruń, en Pologne.' },
      { date: '1491', fait: 'Études à l’université de Cracovie.' },
      { date: '1496-1503', fait: 'Bologne, Padoue, Ferrare : droit, médecine et astronomie.' },
      { date: 'vers 1514', fait: 'Le Commentariolus circule en manuscrit entre savants.' },
      { date: '1539', fait: 'Rheticus vient à Frombork et le convainc de publier.' },
      { date: '1540', fait: 'La Narratio prima expose son système pour la première fois.' },
      { date: '1543', fait: 'Publication du De revolutionibus à Nuremberg.' },
      { date: '24 mai 1543', fait: 'Mort à Frombork.' },
      { date: '1616', fait: 'Le livre est mis à l’Index « jusqu’à correction ».' },
    ],
    leSaisTu:
      'Copernic n’a pas été le premier à déplacer la Terre : dix-huit siècles avant lui, le Grec Aristarque de Samos avait déjà mis le Soleil au centre. L’idée avait été rejetée pour une raison qui semblait imparable : si la Terre bougeait, la position des étoiles devrait changer au fil de l’année. Elle change — mais si peu qu’il a fallu attendre 1838 pour le mesurer.',
    aRetenir: [
      'Copernic propose l’héliocentrisme : la Terre tourne sur elle-même et autour du Soleil.',
      'Son livre, De revolutionibus orbium coelestium, paraît à Nuremberg en 1543, l’année de sa mort.',
      'Il renverse le système de Ptolémée, qui plaçait la Terre immobile au centre depuis quatorze siècles.',
      'Son modèle garde les orbites circulaires : il n’est pas plus exact que l’ancien, mais il est plus simple.',
      'L’Église met le livre à l’Index en 1616 ; Kepler, Galilée et Newton partent pourtant de lui.',
    ],
    mots: [
      {
        mot: 'Héliocentrisme',
        sens: 'Modèle du monde où le Soleil est au centre et où la Terre est une planète qui tourne autour de lui.',
      },
      {
        mot: 'Géocentrisme',
        sens: 'Modèle hérité de Ptolémée où la Terre, immobile, occupe le centre de l’univers.',
      },
      {
        mot: 'Épicycle',
        sens: 'Petit cercle porté par un plus grand, ajouté pour faire coller les calculs aux positions observées des planètes.',
      },
    ],
    lies: ['galilee', 'leonard-de-vinci', 'gutenberg', 'invention-de-l-imprimerie'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'Copernic',
      'héliocentrisme',
      'Ptolémée',
      'De revolutionibus',
      'Frombork',
      'Toruń',
      'Rheticus',
      'Osiander',
      'Soleil',
      'révolution scientifique',
    ],
  },
  {
    id: 'hernan-cortes',
    volet: 'personnages',
    nom: 'Hernán Cortés',
    surnom: 'le conquérant du Mexique',
    dates: '1485 – 1547',
    tri: 1547,
    periode: 'temps-modernes',
    emoji: '🗡️',
    roles: ['Conquistador', 'Capitaine général', 'Marquis de la vallée d’Oaxaca'],
    origine: 'Medellín, Estrémadure',
    accroche:
      'Avec cinq cents hommes, des dizaines de milliers d’alliés indiens et la variole, il abat en deux ans un empire de plusieurs millions d’habitants.',
    citations: [
      {
        texte:
          'Nous restâmes émerveillés, et nous disions que cela ressemblait aux enchantements des livres de chevalerie ; certains des nôtres se demandaient si ce que nous voyions n’était pas un rêve.',
        qui: 'Bernal Díaz del Castillo, soldat de l’expédition',
        contexte:
          'Découverte de Tenochtitlan depuis la chaussée du lac, le 8 novembre 1519, dans son *Histoire véridique de la conquête de la Nouvelle-Espagne*.',
      },
      {
        texte:
          'Cette ville est si grande et si remarquable que je n’en dirai qu’une chose : il n’y a rien de semblable en Espagne.',
        contexte:
          'Seconde lettre de Cortés à Charles Quint, 30 octobre 1520, décrivant Tenochtitlan.',
      },
      {
        texte:
          'Sur les chemins gisent les traits brisés, les cheveux sont épars. Les maisons sont sans toit, et leurs murs sont rougis.',
        qui: 'Un poète nahua anonyme',
        contexte:
          'Chant de deuil composé après la chute de Tenochtitlan, conservé dans les *Cantares mexicanos*.',
        sens:
          'Les vaincus ont écrit, eux aussi : ces chants en langue nahuatl sont la seule voix mexica qui nous soit parvenue du siège.',
      },
      {
        texte: 'Vous êtes arrivés dans votre pays et dans vos maisons : reposez-vous.',
        qui: 'Moctezuma II, selon Cortés',
        contexte:
          'Accueil des Espagnols à Tenochtitlan, le 8 novembre 1519, rapporté par Cortés dans sa lettre à Charles Quint.',
        sens:
          'On ne connaît cette phrase que par celui qu’elle arrangeait : elle transforme la conquête en remise de pouvoir consentie. Aucune source mexica ne la confirme.',
        incertaine: true,
      },
    ],
    reperes: [
      'Petit hidalgo d’Estrémadure installé à Cuba, il appareille en 1519 contre l’ordre du gouverneur.',
      'Onze navires, environ 500 hommes, 16 chevaux et une dizaine de canons.',
      'Il fait échouer ses navires à Veracruz pour couper toute retraite à sa troupe.',
      'Son atout décisif : les milliers de guerriers tlaxcaltèques, ennemis jurés des Mexicas.',
      'La Malinche, jeune femme nahua donnée en esclave, sert d’interprète et de conseillère.',
      'Tenochtitlan tombe le 13 août 1521, après un siège de près de trois mois.',
    ],
    recit: [
      {
        titre: 'L’empire mexica',
        texte:
          'Au centre du Mexique, bâtie dans un lac, **Tenochtitlan** est en 1519 l’une des plus grandes villes du monde : peut-être **200 000 habitants**, davantage que Paris ou Venise. Elle tient sur des îles reliées par des chaussées, s’alimente en eau douce par un aqueduc, se nourrit de jardins flottants et s’organise autour d’un marché où Bernal Díaz dit avoir compté « soixante mille âmes ». Les **Mexicas**, arrivés tard dans la vallée, dominent par la guerre une mosaïque de cités qui leur versent un **tribut** et leur fournissent des captifs pour les sacrifices. C’est leur force et leur faille : beaucoup de peuples soumis, à commencer par les **Tlaxcaltèques**, les détestent et n’attendent qu’une occasion.',
      },
      {
        titre: 'Cinq cents hommes',
        texte:
          '**Hernán Cortés**, notaire de formation et colon à Cuba, appareille en février **1519** avec onze navires et environ cinq cents hommes, contre l’ordre du gouverneur qui vient de le révoquer. Il fonde **Veracruz**, se fait élire capitaine par ses propres troupes pour se donner une légalité, puis fait **échouer ses navires** sur la plage : personne ne rentrera. Sur la côte, on lui offre une jeune femme nahua baptisée **doña Marina**, la **Malinche** : elle parle le nahuatl et le maya, un naufragé espagnol parle le maya — la chaîne d’interprètes est faite, et elle vaut une armée. Après trois batailles, les **Tlaxcaltèques** deviennent ses alliés. Le **8 novembre 1519**, il entre dans Tenochtitlan, reçu par **Moctezuma II**, qu’il prend bientôt en otage dans son propre palais.',
      },
      {
        titre: 'La Noche Triste et le siège',
        texte:
          'En mai **1520**, Cortés doit redescendre à la côte pour affronter une expédition envoyée contre lui. En son absence, son lieutenant **Pedro de Alvarado** fait massacrer la noblesse mexica en pleine fête au **Templo Mayor**. La ville se soulève ; Moctezuma meurt dans des circonstances disputées. Dans la nuit du **30 juin 1520**, les Espagnols tentent de fuir par les chaussées, chargés d’or : plus de la moitié périssent noyés ou tués — c’est la *Noche Triste*, la nuit triste. Cortés se replie à Tlaxcala, refait une armée, fait construire treize brigantins pour tenir le lac, et revient. Le **siège de Tenochtitlan** dure du 26 mai au **13 août 1521** : aqueduc coupé, famine, combat maison par maison. Le dernier empereur, **Cuauhtémoc**, est capturé ; la ville est rasée, et Mexico se bâtit sur ses ruines.',
      },
      {
        titre: 'Ce qui a réellement abattu un empire',
        texte:
          'Cinq cents Espagnols n’auraient rien pu seuls. Trois facteurs décident. **Les alliances** d’abord : des dizaines de milliers de guerriers indiens combattent aux côtés de Cortés contre leurs maîtres mexicas, et la conquête est aussi une révolte de peuples soumis. **Les armes** ensuite — acier, arbalètes, canons, chevaux — utiles mais trop peu nombreuses pour expliquer la victoire. **Les microbes** surtout : une épidémie de **variole**, arrivée en 1520 avec un membre d’une expédition espagnole, ravage la vallée pendant le siège et emporte peut-être un tiers de la population, dont l’empereur Cuitláhuac. Le choc se répétera partout : le Mexique central passe, selon les estimations, de plus de **vingt millions d’habitants en 1519 à environ un million vers 1600**. Cortés, fait marquis et riche, mais tenu à l’écart du pouvoir par une Couronne qui se méfie des conquistadors, meurt près de Séville en **1547**.',
      },
    ],
    chrono: [
      { date: 'février 1519', fait: 'Départ de Cuba avec onze navires.' },
      { date: 'juillet 1519', fait: 'Fondation de Veracruz ; les navires sont échoués.' },
      { date: 'septembre 1519', fait: 'Alliance avec les Tlaxcaltèques après trois batailles.' },
      { date: '8 novembre 1519', fait: 'Entrée à Tenochtitlan, rencontre de Moctezuma II.' },
      { date: 'mai 1520', fait: 'Massacre du Templo Mayor : la ville se soulève.' },
      { date: '30 juin 1520', fait: 'La Noche Triste : la fuite tourne au désastre.' },
      { date: '1520', fait: 'Épidémie de variole dans la vallée de Mexico.' },
      { date: '13 août 1521', fait: 'Chute de Tenochtitlan et capture de Cuauhtémoc.' },
      { date: '2 décembre 1547', fait: 'Mort près de Séville.' },
    ],
    leSaisTu:
      'La Malinche a laissé son nom aux deux langues. En espagnol du Mexique, un malinchista est celui qui préfère l’étranger aux siens. Sur les peintures indiennes de la conquête, pourtant, c’est elle qu’on voit au centre, debout entre les deux camps : sans interprète, il n’y avait ni alliance, ni négociation, ni conquête.',
    aRetenir: [
      'Hernán Cortés débarque au Mexique en 1519 et s’empare de l’empire mexica en deux ans.',
      'Tenochtitlan, capitale de près de 200 000 habitants, tombe le 13 août 1521 après trois mois de siège.',
      'Sa victoire repose sur les alliances indiennes, tlaxcaltèques surtout, autant que sur les armes.',
      'La variole, apportée en 1520, tue une part énorme de la population et décide de l’issue du siège.',
      'La conquête ouvre la colonisation espagnole : encomienda, mines d’argent, effondrement démographique.',
    ],
    mots: [
      {
        mot: 'Conquistador',
        sens: 'Aventurier espagnol qui conquiert des terres d’Amérique pour son propre compte, avec l’aval du roi.',
      },
      {
        mot: 'Tribut',
        sens: 'Redevance en produits, en biens ou en hommes qu’une cité soumise verse à la puissance qui la domine.',
      },
      {
        mot: 'Encomienda',
        sens: 'Droit accordé à un colon sur le travail d’un groupe d’Indiens, en échange de leur évangélisation : le cadre légal du travail forcé.',
      },
    ],
    lies: [
      'conquete-de-l-empire-azteque',
      'christophe-colomb',
      'decouverte-de-l-amerique',
      'magellan',
    ],
    niveaux: ['5e'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Cortés',
      'Tenochtitlan',
      'Moctezuma',
      'Mexicas',
      'Aztèques',
      'Malinche',
      'Tlaxcala',
      'conquistador',
      'variole',
      'Cuauhtémoc',
      'Nouvelle-Espagne',
    ],
  },
  {
    id: 'jacques-cartier',
    volet: 'personnages',
    nom: 'Jacques Cartier',
    surnom: 'le Malouin du Saint-Laurent',
    dates: '1491 – 1557',
    tri: 1557,
    periode: 'temps-modernes',
    emoji: '🍁',
    roles: ['Navigateur malouin', 'Explorateur du Canada', 'Pilote du roi'],
    origine: 'Saint-Malo, Bretagne',
    accroche:
      'Envoyé chercher de l’or et un passage vers l’Asie, il rapporte un fleuve, un mot — Canada — et des diamants qui n’en étaient pas.',
    citations: [
      {
        texte: 'Je suis plutôt enclin à croire que c’est la terre que Dieu donna à Caïn.',
        contexte:
          'Devant la côte nue et rocheuse du Labrador, pendant le premier voyage, l’été 1534.',
        sens:
          'On lui a promis un nouveau Mexique ; il découvre un désert de pierres. La déception tient en une phrase de la Bible.',
      },
      {
        texte: 'Nous ne devions pas planter cette croix sans son congé.',
        qui: 'Donnacona, chef de Stadaconé, rapporté par Cartier',
        contexte:
          'Le chef vient en canot protester contre la croix de neuf mètres dressée à Gaspé le 24 juillet 1534.',
        sens:
          'La première page de la rencontre est aussi la première contestation : la terre avait déjà des maîtres, et ils l’ont dit tout de suite.',
      },
      {
        texte: 'Vive le roy de France !',
        contexte:
          'Inscription gravée sur l’écusson fixé à la croix de Gaspé, en juillet 1534, sous les armes du roi.',
      },
      {
        texte:
          'En moins de huit jours, l’arbre fut employé tout entier, et il fit une telle opération que tous les malades qui en burent recouvrèrent la santé.',
        contexte:
          'L’hiver 1535-1536 à Stadaconé : le remède contre le scorbut donné par Domagaya, fils de Donnacona.',
      },
    ],
    reperes: [
      'Pilote de Saint-Malo, choisi par François Ier pour chercher des terres « où l’on dit qu’il se trouve grande quantité d’or ».',
      'Premier voyage en 1534 : vingt jours de traversée, une croix plantée à Gaspé.',
      'Deuxième voyage en 1535 : il remonte le Saint-Laurent jusqu’à Stadaconé puis Hochelaga.',
      'Le mot Canada vient de l’iroquoien kanata, qui désigne un village.',
      'L’hiver 1535-1536 tue 25 de ses 110 hommes ; une tisane d’écorce sauve les autres.',
      'Il rentre en 1542 avec des « diamants » et de l’« or » qui se révèlent quartz et pyrite.',
    ],
    recit: [
      {
        titre: 'La France arrive en retard',
        texte:
          'Quand **François Ier** se tourne vers l’ouest, l’Espagne prend déjà l’argent du Mexique et le Portugal le poivre des Indes. Le roi conteste le partage du monde décidé à **Tordesillas** — on lui prête ce mot : « Je voudrais bien voir la clause du testament d’Adam qui m’exclut du partage du monde. » En 1524, il envoie l’Italien **Verrazzano** longer la côte américaine ; en **1534**, il confie deux navires à un pilote de **Saint-Malo**, **Jacques Cartier**, avec une mission claire : trouver un **passage vers l’Asie** par le nord-ouest, et de l’or. Vingt jours de traversée suffisent, et Cartier entre dans le golfe par le détroit de Belle-Isle.',
      },
      {
        titre: 'Gaspé, juillet 1534',
        texte:
          'Le **24 juillet 1534**, à **Gaspé**, Cartier fait dresser une croix de neuf mètres portant un écusson aux fleurs de lis et l’inscription « Vive le roy de France ». **Donnacona**, chef iroquoien de Stadaconé venu pêcher là avec deux cents des siens, arrive en canot et proteste : la terre est à lui, on n’y plante rien sans son accord. Cartier lui fait comprendre que la croix n’est qu’un **repère de navigation** — puis emmène en France ses deux fils, **Domagaya** et **Taignoagny**, moitié invités, moitié otages. Ils apprendront le français et serviront d’interprètes. Ce sont eux qui, l’année suivante, prononceront le mot ***kanata*** — « le village » — que les Français entendront comme le nom de tout un pays.',
      },
      {
        titre: 'Le fleuve, et l’hiver',
        texte:
          'En **1535**, Cartier remonte le grand fleuve qu’il baptise **Saint-Laurent**, du nom du saint du jour. Il atteint **Stadaconé** (l’actuelle Québec), puis, le 2 octobre, la bourgade fortifiée d’**Hochelaga** (Montréal), au pied d’une colline qu’il nomme **mont Royal**. Au-delà, les rapides barrent la route : le passage vers la Chine n’est pas là. L’hiver le surprend, bien plus dur que tout ce qu’un Breton connaît ; la glace prend les navires, et le **scorbut** tue **vingt-cinq hommes sur cent dix**. Ce sont les Iroquoiens qui sauvent les autres : Domagaya indique une tisane d’écorce et d’aiguilles d’**annedda**, un conifère riche en vitamine C. En huit jours, l’arbre entier y passe, et les malades guérissent. Cartier repart en 1536 en emmenant Donnacona et neuf autres, pour qu’ils racontent au roi le royaume du **Saguenay** et ses richesses. Aucun ne reverra le fleuve.',
      },
      {
        titre: 'Les diamants du Canada',
        texte:
          'Le troisième voyage (**1541-1542**) est une tentative de **colonisation** : Cartier n’en est plus le chef mais le pilote, sous les ordres du sieur de **Roberval**. On bâtit **Charlesbourg-Royal** au-dessus de Québec ; l’hiver, le scorbut et l’hostilité des Iroquoiens — dont les chefs ne sont jamais revenus — ont raison de l’établissement. Cartier rentre sans prévenir, avec des barils de pierres brillantes et de poudre d’or. À Saint-Malo, les experts tranchent : **quartz et pyrite de fer**. L’expression est restée en français : *faux comme les diamants du Canada*. La France renonce pour soixante ans ; il faudra **Champlain** et la fondation de Québec, en 1608, pour que la Nouvelle-France existe vraiment. Cartier meurt à Saint-Malo le **1ᵉʳ septembre 1557**, sans avoir trouvé ni passage ni or — mais il a mis un fleuve, une langue et un nom sur la carte.',
      },
    ],
    chrono: [
      { date: '1534', fait: 'Premier voyage : croix plantée à Gaspé le 24 juillet.' },
      { date: '1535', fait: 'Il remonte le Saint-Laurent jusqu’à Stadaconé.' },
      { date: '2 octobre 1535', fait: 'Arrivée à Hochelaga, au pied du mont Royal.' },
      { date: '1535-1536', fait: 'Hiver meurtrier : 25 morts du scorbut, les autres sauvés.' },
      { date: '1536', fait: 'Retour en France avec Donnacona et neuf Iroquoiens.' },
      { date: '1541-1542', fait: 'Troisième voyage : colonie de Charlesbourg-Royal.' },
      { date: '1542', fait: 'Retour avec de faux diamants ; la France abandonne.' },
      { date: '1er septembre 1557', fait: 'Mort à Saint-Malo.' },
      { date: '1608', fait: 'Champlain fonde Québec : la Nouvelle-France commence.' },
    ],
    leSaisTu:
      'Le remède qui a sauvé son équipage a été perdu. Cartier a noté le nom de l’arbre, annedda, mais pas assez précisément pour qu’on le reconnaisse : les botanistes hésitent encore entre le cèdre blanc, le sapin baumier et la pruche. Il a fallu attendre 1753 et le médecin britannique James Lind pour démontrer que les agrumes guérissent le scorbut.',
    aRetenir: [
      'Jacques Cartier explore le golfe et le fleuve Saint-Laurent pour François Ier, en 1534, 1535 et 1541.',
      'Il plante une croix à Gaspé le 24 juillet 1534 et prend possession du territoire au nom du roi.',
      'Le nom Canada vient du mot iroquoien kanata, « village », entendu par les Français comme le nom du pays.',
      'Son équipage est sauvé du scorbut pendant l’hiver 1535-1536 par un remède iroquoien, l’annedda.',
      'Il ne trouve ni passage vers l’Asie ni or : la Nouvelle-France ne naîtra qu’avec Champlain, en 1608.',
    ],
    mots: [
      {
        mot: 'Scorbut',
        sens: 'Maladie due au manque de vitamine C : gencives qui saignent, dents qui tombent, mort en quelques semaines.',
      },
      {
        mot: 'Nouvelle-France',
        sens: 'Nom donné aux possessions françaises d’Amérique du Nord, de 1534 à 1763.',
      },
      {
        mot: 'Iroquoiens du Saint-Laurent',
        sens: 'Peuple agriculteur des bourgades de Stadaconé et d’Hochelaga, disparu des rives du fleuve avant 1600.',
      },
    ],
    lies: ['francois-ier', 'christophe-colomb', 'vasco-de-gama'],
    niveaux: ['5e'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Cartier',
      'Saint-Malo',
      'Saint-Laurent',
      'Gaspé',
      'Canada',
      'Hochelaga',
      'Stadaconé',
      'Donnacona',
      'scorbut',
      'Nouvelle-France',
      'François Ier',
    ],
  },
  {
    id: 'galilee',
    volet: 'personnages',
    nom: 'Galilée',
    surnom: 'celui qui a tourné la lunette vers le ciel',
    dates: '1564 – 1642',
    tri: 1642,
    periode: 'temps-modernes',
    emoji: '🔭',
    roles: ['Astronome', 'Physicien', 'Mathématicien'],
    origine: 'Pise, grand-duché de Toscane',
    accroche:
      'Il pointe une lunette vers le ciel, voit des montagnes sur la Lune et des lunes autour de Jupiter — et doit abjurer à genoux, à soixante-dix ans.',
    citations: [
      {
        texte:
          'La philosophie est écrite dans cet immense livre toujours ouvert devant nos yeux, je veux dire l’univers. Il est écrit en langue mathématique, et ses caractères sont des triangles, des cercles et d’autres figures géométriques.',
        contexte: '*L’Essayeur*, 1623, dédié au pape Urbain VIII.',
        sens:
          'Le programme de toute la science moderne en une phrase : la nature se lit, et elle se lit en mathématiques.',
      },
      {
        texte:
          'L’intention de l’Esprit Saint est de nous enseigner comment on va au ciel, et non comment va le ciel.',
        contexte:
          'Lettre à Christine de Lorraine, 1615, où Galilée reprend le mot d’un cardinal pour se défendre.',
        sens:
          'Sa ligne de défense : la Bible enseigne le salut, pas l’astronomie ; les deux ne peuvent donc pas se contredire.',
      },
      {
        texte:
          'D’un cœur sincère et d’une foi non feinte, j’abjure, je maudis et je déteste les susdites erreurs et hérésies.',
        contexte:
          'Abjuration prononcée à genoux au couvent de la Minerve, à Rome, le 22 juin 1633, devant le tribunal de l’Inquisition.',
      },
      {
        texte: 'Et pourtant elle tourne.',
        contexte:
          'Phrase qu’il aurait murmurée en se relevant, aussitôt après avoir abjuré, le 22 juin 1633.',
        sens:
          'Aucune pièce du procès ne la contient. On la trouve imprimée pour la première fois en 1757, plus d’un siècle après les faits.',
        incertaine: true,
      },
    ],
    reperes: [
      'Professeur de mathématiques à Pise puis à Padoue, il complète longtemps son salaire par des leçons.',
      'En 1609, il fabrique une lunette de plus en plus puissante et la tourne vers le ciel.',
      'Le Messager des étoiles (1610) : montagnes de la Lune, Voie lactée résolue en étoiles, lunes de Jupiter.',
      'Il découvre les phases de Vénus, preuve qu’elle tourne autour du Soleil et non de la Terre.',
      'En 1616, l’Église déclare l’héliocentrisme contraire à l’Écriture et lui interdit de le soutenir.',
      'Condamné en 1633, il finit ses jours assigné à résidence à Arcetri, aveugle et publiant encore.',
    ],
    recit: [
      {
        titre: 'L’homme qui mesure',
        texte:
          '**Galileo Galilei**, né à **Pise en 1564**, commence par la médecine, la quitte pour les mathématiques et enseigne vingt ans, à Pise puis à **Padoue**, pour un salaire médiocre. Sa marque, dès le début, est la **mesure** : il compare la chute des corps sur des plans inclinés, chronomètre le balancement d’un pendule, fabrique et vend des compas de calcul. Il établit qu’un corps lourd et un corps léger tombent à la même vitesse — la légende de la tour de Pise vient de là, sans preuve — et que la chute suit une loi mathématique, les distances croissant comme le **carré du temps**. Là où Aristote raisonnait sur la nature des choses, Galilée fait des **expériences** et écrit des équations. C’est cette méthode, plus encore que ses découvertes, qui change tout.',
      },
      {
        titre: 'Le Messager des étoiles',
        texte:
          'À l’été **1609**, une rumeur venue des Pays-Bas parle d’un tube à lentilles qui rapproche les objets. Galilée en comprend le principe en quelques jours, le fabrique lui-même et le pousse de trois à **trente fois**. Puis il fait ce que personne n’a encore fait : il le pointe vers le ciel. En janvier **1610**, il voit que la **Lune** a des montagnes et des cratères — elle n’est donc pas la sphère parfaite d’Aristote —, que la **Voie lactée** est une poussière d’étoiles, et surtout que **quatre petits astres tournent autour de Jupiter**. Publié en mars sous le titre *Sidereus Nuncius*, *Le Messager des étoiles*, le livre en fait une célébrité européenne en quelques mois. Ces quatre lunes sont un argument : tout ne tourne donc pas autour de la Terre. Les **phases de Vénus**, observées la même année, en apportent un second, décisif.',
      },
      {
        titre: 'L’avertissement de 1616',
        texte:
          'Copernic était resté un livre de spécialistes ; Galilée en fait une question publique, écrite en italien, appuyée sur des preuves que chacun peut regarder. La réaction vient vite. En **1616**, le Saint-Office déclare la thèse du Soleil immobile « insensée et absurde en philosophie, et formellement hérétique » ; le livre de Copernic est suspendu, et le cardinal **Bellarmin** notifie à Galilée qu’il ne doit plus tenir ni défendre cette opinion. Galilée avait pourtant cherché l’accord : dans sa *Lettre à Christine de Lorraine* (1615), il soutenait que l’Écriture parle le langage des hommes simples, et que Dieu n’a pas moins mis sa vérité dans la nature que dans la Bible. L’argument sera repris par l’Église elle-même — trois siècles plus tard.',
      },
      {
        titre: 'Le procès de 1633',
        texte:
          'En 1623, un ami et admirateur, le cardinal Barberini, devient le pape **Urbain VIII**. Galilée croit la voie ouverte et publie en **1632** son *Dialogue sur les deux grands systèmes du monde*, en italien, où trois personnages discutent : le copernicien a les meilleurs arguments, et le défenseur de l’ancienne doctrine, nommé **Simplicio**, se voit confier à la fin l’argument du pape lui-même. L’affront est immédiat. Convoqué à Rome, malade, menacé de la torture, Galilée **abjure à genoux le 22 juin 1633**. Sa peine de prison est commuée en **résidence surveillée** à Arcetri, où il restera neuf ans. Devenu aveugle en 1638, il dicte encore son plus grand livre, les *Discours concernant deux sciences nouvelles*, sorti clandestinement et imprimé en Hollande : c’est l’acte de naissance de la mécanique. Il meurt le **8 janvier 1642**.',
      },
      {
        titre: 'Ce que l’affaire a laissé',
        texte:
          'L’**affaire Galilée** n’est pas un duel entre la science et la foi : Galilée est croyant, ses adversaires savent lire ses calculs, et les astronomes jésuites du Collège romain confirment ses observations dès 1611. Ce qui se joue, c’est **qui a le droit d’interpréter** — et un laïc qui explique aux théologiens comment lire la Bible, en pleine Contre-Réforme, touche le point le plus sensible du siècle. Le mouvement de la Terre sort de l’Index en **1757**, le *Dialogue* en 1822. En **1992**, **Jean-Paul II** reconnaît publiquement l’erreur des juges de 1633. Entre-temps, la manière de faire de Galilée — mesurer, calculer, publier, accepter d’être contredit — était devenue celle de toute la science.',
      },
    ],
    chrono: [
      { date: '15 février 1564', fait: 'Naissance à Pise.' },
      { date: '1592', fait: 'Chaire de mathématiques à l’université de Padoue.' },
      { date: '1609', fait: 'Il construit une lunette et l’oriente vers le ciel.' },
      { date: 'mars 1610', fait: 'Publication du Sidereus Nuncius, le Messager des étoiles.' },
      { date: '1616', fait: 'Le Saint-Office condamne l’héliocentrisme et l’avertit.' },
      { date: '1632', fait: 'Publication du Dialogue sur les deux grands systèmes du monde.' },
      { date: '22 juin 1633', fait: 'Abjuration à Rome ; assignation à résidence à Arcetri.' },
      { date: '1638', fait: 'Les Discours sur deux sciences nouvelles paraissent en Hollande.' },
      { date: '8 janvier 1642', fait: 'Mort à Arcetri.' },
      { date: '1992', fait: 'Jean-Paul II reconnaît l’erreur des juges du procès.' },
    ],
    leSaisTu:
      'Il a nommé les quatre lunes de Jupiter « astres médicéens », en l’honneur du grand-duc de Toscane Cosme II de Médicis — et il a obtenu le poste qu’il visait. L’hommage n’a pas tenu : on les appelle aujourd’hui les satellites galiléens, Io, Europe, Ganymède et Callisto.',
    aRetenir: [
      'Galilée tourne une lunette vers le ciel en 1609 et publie le Sidereus Nuncius en mars 1610.',
      'Il observe les montagnes de la Lune, quatre satellites de Jupiter et les phases de Vénus.',
      'Il fonde la méthode expérimentale : mesurer, écrire les lois en mathématiques, vérifier.',
      'Condamné par l’Inquisition, il abjure le 22 juin 1633 et vit assigné à résidence jusqu’à sa mort, en 1642.',
      'L’héliocentrisme sort de l’Index en 1757 ; Jean-Paul II reconnaît l’erreur du procès en 1992.',
    ],
    mots: [
      {
        mot: 'Méthode expérimentale',
        sens: 'Manière de chercher le vrai par des expériences mesurables et reproductibles, plutôt qu’en raisonnant sur des textes.',
      },
      {
        mot: 'Index',
        sens: 'Liste des livres dont l’Église catholique interdisait la lecture, créée en 1559 et supprimée en 1966.',
      },
      {
        mot: 'Abjurer',
        sens: 'Renier publiquement une opinion ou une croyance, de son plein gré ou sous la contrainte.',
      },
    ],
    lies: ['copernic', 'leonard-de-vinci', 'gutenberg', 'descartes'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'Galilée',
      'lunette',
      'Jupiter',
      'Sidereus Nuncius',
      'Inquisition',
      'abjuration',
      '1633',
      'Padoue',
      'Arcetri',
      'héliocentrisme',
      'méthode expérimentale',
    ],
  },
]
