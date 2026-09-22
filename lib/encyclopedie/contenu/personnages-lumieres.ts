// -----------------------------------------------------------------------------
// LES LUMIÈRES — le siècle qui pense, et les deux hommes d'Amérique qui en
// font une République.
//
// Huit fiches, de la mort de Newton (1727) à celle de Washington (1799). Au
// milieu, un roi de France qui règne cinquante-neuf ans et quatre écrivains
// qui changent l'idée qu'on se fait du pouvoir.
//
// LE TON, ici, demande deux précautions (cf. `docs/encyclopedie.md`, § 3).
// Louis XV n'est pas « le roi fainéant des manuels » : il perd le Canada, mais
// il gagne la Lorraine et la Corse, il commande en personne à Fontenoy, et
// c'est lui qui ose la réforme — le coup de Maupeou — que son petit-fils
// défera. On le raconte DANS SON TEMPS, sans moquerie. Et les philosophes sont
// présentés pour CE QU'ILS ONT ÉCRIT, contradictions comprises : Rousseau qui
// écrit le plus beau livre du siècle sur l'enfance et dépose ses cinq enfants
// aux Enfants-Trouvés, Voltaire qui plaide pour Calas et détient des parts
// dans des compagnies pratiquant la traite. Factuel, jamais militant.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_LUMIERES: Personnage[] = [
  {
    id: 'isaac-newton',
    volet: 'personnages',
    nom: 'Isaac Newton',
    surnom: 'le père de la gravitation',
    dates: '1643 – 1727',
    tri: 1727,
    periode: 'temps-modernes',
    emoji: '🍎',
    roles: ['Physicien', 'Mathématicien', 'Astronome', 'Maître de la Monnaie'],
    origine: 'Woolsthorpe, Lincolnshire, Angleterre',
    accroche:
      'Il démontre que la pomme qui tombe et la Lune qui tourne obéissent à la même loi — et donne au monde sa première physique universelle.',
    citations: [
      {
        texte: 'Si j’ai vu plus loin, c’est en me tenant sur les épaules de géants.',
        contexte: 'Lettre à Robert Hooke, 5 février 1676.',
        sens:
          'Il dit devoir ses découvertes à ceux qui l’ont précédé — Copernic, Galilée, Kepler. La phrase est devenue la devise de toute recherche scientifique.',
      },
      {
        texte: 'Je n’invente pas d’hypothèses.',
        contexte:
          'En latin *hypotheses non fingo*, ajouté aux *Principia* en 1713, à propos de la cause de la gravitation.',
        sens:
          'Il dit COMMENT la gravitation agit, par une formule vérifiable, et refuse d’inventer une explication de sa cause. C’est la méthode scientifique moderne.',
      },
      {
        texte:
          'Je me fais l’effet d’un enfant qui joue au bord de la mer et s’amuse à trouver un galet plus poli que les autres, tandis que le grand océan de la vérité s’étend devant lui, inexploré.',
        contexte: 'Propos rapporté peu avant sa mort, en 1727.',
      },
    ],
    reperes: [
      'Né en 1643, l’année qui suit la mort de Galilée ; élevé par sa grand-mère dans une ferme du Lincolnshire.',
      'Pendant la peste de 1665-1666, replié à la campagne, il pose le calcul, l’optique et la gravitation.',
      'Les *Principia* (1687) énoncent les trois lois du mouvement et l’attraction universelle.',
      'Il décompose la lumière blanche au prisme et construit le premier télescope à miroir.',
      'Maître de la Monnaie d’Angleterre à partir de 1699 : il refond la monnaie et traque les faux-monnayeurs.',
      'Enterré à l’abbaye de Westminster en 1727, honneur réservé jusque-là aux grands du royaume.',
    ],
    recit: [
      {
        titre: 'L’année des merveilles',
        texte:
          'Isaac Newton naît le 25 décembre 1642 du calendrier anglais — le **4 janvier 1643** du nôtre —, prématuré et si petit qu’on ne le croit pas viable. Son père est mort avant sa naissance ; sa mère le confie à sa grand-mère. Il entre à **Cambridge** en 1661 comme *subsizar*, un étudiant pauvre qui sert les autres pour payer ses études. En **1665**, la **grande peste** ferme l’université : Newton rentre à Woolsthorpe et y passe dix-huit mois seul. Ces mois sont restés sous le nom d’*annus mirabilis*, l’année des merveilles. Il y invente le calcul des fluxions — l’ancêtre du calcul différentiel —, démontre que la lumière blanche est composée de couleurs, et conçoit l’idée que la force qui fait tomber les corps est la même que celle qui retient la Lune sur son orbite. Il a vingt-trois ans. Il ne publiera presque rien de tout cela avant vingt ans.',
      },
      {
        titre: 'Les *Principia*, 1687',
        texte:
          'En 1684, l’astronome **Edmond Halley** vient lui demander quelle courbe décrirait une planète attirée par une force qui diminue comme le carré de la distance. Newton répond aussitôt : une **ellipse** — il l’a calculé depuis longtemps et a rangé le papier. Halley le pousse à écrire et paie l’impression de sa poche. Les *Philosophiae naturalis principia mathematica* paraissent en **1687**. Trois lois du mouvement — l’inertie, la force égale à la masse fois l’accélération, l’action et la réaction — et une seule loi d’attraction : **deux corps s’attirent proportionnellement à leurs masses et inversement au carré de leur distance**. Avec cela, Newton explique d’un même calcul la chute des pierres, l’orbite des planètes, les marées et le retour des comètes. Pour la première fois, le ciel et la Terre obéissent aux **mêmes lois**. Halley, appliquant la formule, annonce le retour d’une comète pour 1758 : elle revient à la date dite, seize ans après sa mort à lui.',
      },
      {
        titre: 'Le prisme et le télescope',
        texte:
          'Son autre chantier est la **lumière**. En faisant passer un rayon de soleil par un **prisme**, il obtient le spectre des couleurs ; en le faisant passer par un second prisme, il recompose du blanc. Conclusion : la lumière blanche n’est pas pure, elle est un **mélange**, et le prisme ne la colore pas — il la sépare. Comme les lentilles des lunettes astronomiques déforment les couleurs, il construit en 1668 un **télescope à miroir** de quinze centimètres qui grossit quarante fois : tous les grands télescopes d’aujourd’hui descendent de celui-là. L’*Opticks* paraît en 1704, écrit en anglais et non en latin — pour être lu.',
      },
      {
        titre: 'Le savant, le policier de la monnaie et l’alchimiste',
        texte:
          'Newton n’est pas un cerveau enfermé. Élu au Parlement, il devient en **1696** gardien puis **maître de la Monnaie d’Angleterre**. Il refond toute la monnaie du royaume, la fait frapper avec des tranches striées pour empêcher qu’on la rogne, et traque personnellement les faux-monnayeurs dans les tavernes de Londres : plusieurs finiront pendus. Il préside la **Royal Society** de 1703 à sa mort et se bat durement avec **Leibniz** sur la paternité du calcul infinitésimal, que les deux ont trouvé chacun de son côté. Il laisse enfin des milliers de pages d’**alchimie** et de commentaires bibliques : l’homme qui a fondé la physique moderne cherchait aussi la pierre philosophale et la date de la fin du monde. Le XVIIIᵉ siècle en fera son héros — **Voltaire**, exilé à Londres, assiste à ses funérailles nationales en 1727 et rapporte en France la physique newtonienne.',
      },
    ],
    chrono: [
      { date: '1643', fait: 'Naissance à Woolsthorpe, en Angleterre.' },
      { date: '1665-1666', fait: 'L’*annus mirabilis* : calcul, optique, gravitation.' },
      { date: '1668', fait: 'Il construit le premier télescope à miroir.' },
      { date: '1687', fait: 'Publication des *Principia mathematica*.' },
      { date: '1696', fait: 'Il entre à la Monnaie d’Angleterre.' },
      { date: '1703', fait: 'Président de la Royal Society.' },
      { date: '1704', fait: 'Publication de l’*Opticks*.' },
      { date: '1727', fait: 'Mort à Londres ; funérailles à l’abbaye de Westminster.' },
    ],
    leSaisTu:
      'La pomme n’est pas une invention tardive : Newton l’a racontée lui-même, à la fin de sa vie, à son biographe William Stukeley, un soir de 1726 sous un pommier. Elle n’est jamais tombée sur sa tête — elle est tombée devant lui, et il s’est demandé pourquoi elle allait toujours vers le centre de la Terre.',
    aRetenir: [
      'Isaac Newton (1643-1727) énonce la loi de la gravitation universelle et les trois lois du mouvement.',
      'Les *Principia mathematica*, publiés en 1687, fondent la physique moderne.',
      'Il démontre que la lumière blanche est un mélange de couleurs et construit le premier télescope à miroir.',
      'Sa physique devient le modèle des Lumières : Voltaire la fait connaître en France à partir de 1734.',
    ],
    mots: [
      {
        mot: 'Gravitation universelle',
        sens: 'Force d’attraction qui s’exerce entre tous les corps, d’autant plus grande qu’ils sont massifs et proches.',
      },
      {
        mot: 'Spectre',
        sens: 'La suite des couleurs obtenue quand un prisme décompose la lumière blanche.',
      },
      {
        mot: 'Royal Society',
        sens: 'Académie scientifique anglaise fondée en 1660, la plus ancienne encore en activité.',
      },
    ],
    lies: ['galilee', 'voltaire', 'diderot', 'l-encyclopedie'],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Newton',
      'gravitation',
      'pomme',
      'Principia',
      'prisme',
      'lumière',
      'télescope',
      'Cambridge',
      'Halley',
      'physique',
    ],
  },
  {
    id: 'montesquieu',
    volet: 'personnages',
    nom: 'Montesquieu',
    surnom: 'l’inventeur de la séparation des pouvoirs',
    dates: '1689 – 1755',
    tri: 1755,
    periode: 'temps-modernes',
    emoji: '🏛️',
    roles: ['Philosophe', 'Magistrat', 'Baron de La Brède'],
    origine: 'Château de La Brède, près de Bordeaux',
    accroche:
      'Un magistrat bordelais passe vingt ans à comparer les lois de la Terre entière, et en tire la règle qui fonde nos Constitutions : séparer les pouvoirs.',
    citations: [
      {
        texte:
          'Pour qu’on ne puisse abuser du pouvoir, il faut que, par la disposition des choses, le pouvoir arrête le pouvoir.',
        contexte: '*De l’esprit des lois*, livre XI, chapitre 4, 1748.',
        sens:
          'La liberté ne se garantit pas par la vertu des gouvernants, mais par l’organisation : trois pouvoirs séparés qui se surveillent l’un l’autre.',
      },
      {
        texte:
          'Il y a dans chaque État trois sortes de pouvoirs : la puissance législative, la puissance exécutrice et la puissance de juger.',
        contexte: '*De l’esprit des lois*, 1748, écrit après dix-huit mois passés en Angleterre.',
      },
      {
        texte: 'Comment peut-on être Persan ?',
        contexte:
          '*Lettres persanes*, 1721 : la question que les Parisiens posent à un voyageur venu d’Ispahan.',
        sens:
          'En faisant regarder la France par des étrangers, Montesquieu rend étranges nos propres coutumes. C’est l’arme la plus efficace des Lumières.',
      },
      {
        texte: 'Les lois sont les rapports nécessaires qui dérivent de la nature des choses.',
        contexte: 'Première phrase de *De l’esprit des lois*, 1748.',
        sens:
          'Une loi n’est pas le caprice d’un prince : elle dépend du climat, du commerce, des mœurs, de la religion d’un peuple. C’est la naissance des sciences sociales.',
      },
    ],
    reperes: [
      'Baron de La Brède, il hérite d’une charge de président au parlement de Bordeaux et la revend en 1726.',
      'Les *Lettres persanes* (1721), publiées sans nom d’auteur, font scandale et le rendent célèbre.',
      'Trois ans de voyages en Europe, dont dix-huit mois en Angleterre (1729-1731).',
      'Vingt ans de travail pour *De l’esprit des lois* (1748), mis à l’Index par Rome en 1751.',
      'Sa séparation des pouvoirs passe dans la Constitution américaine de 1787.',
      'Devenu presque aveugle, il dicte ses derniers textes et meurt à Paris en 1755.',
    ],
    recit: [
      {
        titre: 'Un magistrat qui préfère ses livres',
        texte:
          'Charles-Louis de Secondat naît en **1689** au château de **La Brède**, près de Bordeaux. Son parrain est un mendiant, choisi par son père pour qu’il n’oublie jamais que les pauvres sont ses frères. Il étudie le droit, hérite du titre de **baron de Montesquieu** et d’une charge de **président à mortier** au parlement de Bordeaux — une cour souveraine où l’on juge et où l’on enregistre les lois du roi. Il l’exerce dix ans, s’y ennuie, et la **revend en 1726** pour se consacrer à l’étude : il préfère ses vignes, son laboratoire et sa bibliothèque de trois mille volumes. Sa fortune vient d’ailleurs du vin — Montesquieu est l’un des premiers à exporter le bordeaux vers l’Angleterre, et il tient ses comptes lui-même.',
      },
      {
        titre: 'Les *Lettres persanes*, la France vue d’Ispahan',
        texte:
          'En **1721** paraît à Amsterdam, sans nom d’auteur, un roman par lettres : deux Persans, Usbek et Rica, visitent la France et écrivent à leurs amis ce qu’ils voient. Le procédé est une machine de guerre. Sous leur plume, le roi devient « un grand magicien » qui fait croire à ses sujets qu’un papier vaut de l’or ; les couvents deviennent des mystères incompréhensibles ; et les Parisiens, eux, dévisagent Rica dans la rue en demandant : « **Comment peut-on être Persan ?** » — c’est-à-dire : comment peut-on ne pas être nous ? Le livre est un triomphe de librairie et vaut à son auteur l’**Académie française** en 1728, non sans résistance. Montesquieu vient d’inventer l’arme centrale des Lumières : faire regarder une société par un œil étranger, pour qu’elle cesse d’aller de soi.',
      },
      {
        titre: 'Vingt ans pour *De l’esprit des lois*',
        texte:
          'Il voyage : Autriche, Hongrie, Italie, Allemagne, Hollande, puis **dix-huit mois en Angleterre** (1729-1731), où il observe un roi qui gouverne avec un Parlement, des juges indépendants et une presse libre. De retour à La Brède, il travaille vingt ans. *De l’esprit des lois* paraît à Genève en **1748**, en deux volumes et sans nom d’auteur : vingt-deux éditions en deux ans. Le projet est immense — comprendre pourquoi les lois ne sont pas les mêmes partout, et les relier au **climat**, au commerce, aux mœurs, à la religion, à l’étendue du territoire. Il décrit trois régimes : la **république**, qui vit de vertu ; la **monarchie**, qui vit d’honneur ; le **despotisme**, qui vit de crainte. Et, au livre XI, la pièce qui a fait le tour du monde : **séparer les trois pouvoirs** — faire la loi, l’exécuter, juger — pour qu’aucun homme ne les tienne tous à la fois.',
      },
      {
        titre: 'Ce qu’il a changé, et ce qu’il n’a pas dit',
        texte:
          'Le livre est attaqué des deux côtés : jansénistes et jésuites le dénoncent, Rome le met à l’**Index** en 1751, et Montesquieu répond par une *Défense* en 1750. Il ne verra pas sa victoire. Les constituants américains de **1787** bâtissent leur Constitution sur sa formule — un Congrès, un président, une Cour suprême, chacun capable d’arrêter les autres — et l’article 16 de la **Déclaration des droits de l’homme** de 1789 écrit qu’une société où la séparation des pouvoirs n’est pas déterminée « n’a point de Constitution ». Montesquieu n’était pourtant pas un révolutionnaire : il voulait une monarchie tempérée par des corps intermédiaires — noblesse, parlements — et défendait les privilèges de son ordre. Il a aussi écrit contre l’**esclavage** des pages restées célèbres, un chapitre entièrement ironique où il feint de le justifier pour en montrer l’absurdité. Il meurt à Paris le **10 février 1755**, presque aveugle ; **Diderot** est l’un des rares à suivre son convoi.',
      },
    ],
    chrono: [
      { date: '1689', fait: 'Naissance au château de La Brède, près de Bordeaux.' },
      { date: '1716', fait: 'Il hérite d’une charge au parlement de Bordeaux.' },
      { date: '1721', fait: '*Lettres persanes*, publiées anonymement à Amsterdam.' },
      { date: '1728', fait: 'Élu à l’Académie française ; il part pour trois ans de voyages.' },
      { date: '1729-1731', fait: 'Séjour en Angleterre : il y étudie le régime parlementaire.' },
      { date: '1748', fait: '*De l’esprit des lois* paraît à Genève.' },
      { date: '1751', fait: 'Le livre est mis à l’Index par Rome.' },
      { date: '1755', fait: 'Mort à Paris, le 10 février.' },
    ],
    leSaisTu:
      'Montesquieu est enterré en 1755 dans l’église Saint-Sulpice, à Paris. Sa tombe a disparu pendant la Révolution : l’homme dont la Déclaration des droits reprend la pensée à son article 16 n’a plus, aujourd’hui, de sépulture connue.',
    aRetenir: [
      'Montesquieu (1689-1755) publie *De l’esprit des lois* en 1748, après vingt ans de travail.',
      'Il distingue trois pouvoirs — législatif, exécutif, judiciaire — et demande qu’ils soient séparés.',
      'Les *Lettres persanes* (1721) critiquent la société française par le regard de deux voyageurs persans.',
      'Sa formule inspire la Constitution américaine de 1787 et l’article 16 de la Déclaration de 1789.',
    ],
    mots: [
      {
        mot: 'Séparation des pouvoirs',
        sens: 'Principe selon lequel faire la loi, l’appliquer et juger doivent être confiés à trois autorités distinctes.',
      },
      {
        mot: 'Despotisme',
        sens: 'Gouvernement d’un seul, sans loi ni règle, fondé sur la crainte de ses sujets.',
      },
      {
        mot: 'Index',
        sens: 'Liste des livres dont l’Église catholique interdisait la lecture aux fidèles.',
      },
    ],
    lies: ['voltaire', 'rousseau', 'l-encyclopedie', 'declaration-des-droits-de-l-homme'],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Montesquieu',
      'esprit des lois',
      'séparation des pouvoirs',
      'Lettres persanes',
      'La Brède',
      'Bordeaux',
      'parlement',
      'Lumières',
      'Constitution',
    ],
  },
  {
    id: 'louis-xv',
    volet: 'personnages',
    nom: 'Louis XV',
    surnom: 'le Bien-Aimé',
    dates: '1710 – 1774',
    tri: 1774,
    periode: 'temps-modernes',
    emoji: '⚜️',
    roles: ['Roi de France', 'Arrière-petit-fils de Louis XIV'],
    origine: 'Versailles',
    accroche:
      'Roi à cinq ans, il règne cinquante-neuf ans : la France y perd le Canada, y gagne la Lorraine et la Corse, et tente la réforme qui manquera à son petit-fils.',
    citations: [
      {
        texte:
          'C’est en ma personne seule que réside la puissance souveraine ; c’est de moi seul que mes cours tiennent leur existence et leur autorité.',
        contexte: 'Au parlement de Paris, lors de la « séance de la flagellation », 3 mars 1766.',
        sens:
          'Face aux parlements qui bloquent ses réformes fiscales au nom de la nation, le roi rappelle que la souveraineté n’appartient qu’à lui.',
      },
      {
        texte: 'Je veux faire la paix en roi, et non en marchand.',
        contexte:
          'En 1748, en rendant sans contrepartie les Pays-Bas conquis, au traité d’Aix-la-Chapelle.',
        sens:
          'Il refuse de monnayer ses victoires. Le peuple, qui attendait des gains, en tire un dicton amer : « bête comme la paix ».',
      },
      {
        texte: 'Après nous, le déluge.',
        contexte:
          'Prêtée à Mme de Pompadour après la défaite de Rossbach, en 1757, ou au roi lui-même.',
        sens:
          'Aucune source du temps ne l’attribue sûrement à l’un ni à l’autre. Elle a servi, bien plus tard, à résumer un règne de cinquante-neuf ans en trois mots.',
        incertaine: true,
      },
    ],
    reperes: [
      'Arrière-petit-fils de Louis XIV, il devient roi à cinq ans en 1715 ; Philippe d’Orléans est régent.',
      'Guéri d’une maladie mortelle à Metz en 1744, il est acclamé comme « le Bien-Aimé ».',
      'Il commande en personne à Fontenoy, le 11 mai 1745, la plus belle victoire française du siècle.',
      'La guerre de Sept Ans (1756-1763) coûte à la France le Canada et la plus grande partie de l’Inde.',
      'Il rattache la Lorraine en 1766 et achète la Corse à Gênes en 1768.',
      'En 1771, le coup de Maupeou supprime les parlements ; Louis XVI les rétablira en 1774.',
    ],
    recit: [
      {
        titre: 'L’enfant dernier survivant',
        texte:
          'En 1712, la rougeole emporte en quelques semaines le petit-fils de Louis XIV, sa femme et leur fils aîné. De toute la descendance directe, il ne reste qu’un enfant de deux ans, que sa gouvernante refuse de livrer aux médecins et à leurs saignées : c’est lui qui vivra. Louis XIV meurt le **1ᵉʳ septembre 1715** ; l’enfant a **cinq ans**, et devient **Louis XV**. Son grand-oncle **Philippe d’Orléans** gouverne comme régent jusqu’en 1723 : la cour revient à Paris, l’atmosphère se détend, et le banquier écossais **John Law** tente une expérience de papier-monnaie qui s’achève par la première grande banqueroute financière moderne. Sacré à Reims en 1722, marié en 1725 à **Marie Leszczynska**, fille d’un roi détrôné de Pologne, Louis XV prend le pouvoir personnel à sa majorité et le gardera cinquante ans.',
      },
      {
        titre: 'Le Bien-Aimé',
        texte:
          'Pendant vingt ans, le cardinal de **Fleury**, son précepteur devenu ministre, donne à la France la plus longue période de paix et de prospérité du siècle : la monnaie est stabilisée, le commerce des ports atlantiques explose, la population passe d’environ 22 à 28 millions d’habitants. En **1744**, le roi part lui-même à la guerre et tombe gravement malade à **Metz**. Le royaume entier prie ; on dit six mille messes dans la seule ville de Paris. Quand il guérit, la foule crie son nom dans les rues et il reçoit le surnom de **Bien-Aimé**. Un an plus tard, il commande en personne à **Fontenoy**, le 11 mai 1745, et emmène le dauphin sur le champ de bataille pour lui montrer ce que coûte une victoire. En **1748**, il rend pourtant toutes ses conquêtes au traité d’**Aix-la-Chapelle**, refusant de faire la paix « en marchand » : la France n’y gagne rien, et ne le lui pardonne pas.',
      },
      {
        titre: 'La guerre de Sept Ans et la perte du Canada',
        texte:
          'Le renversement des alliances de 1756 jette la France dans la **guerre de Sept Ans**, aux côtés de l’Autriche et contre la Prusse et l’Angleterre. C’est un conflit mondial, et la France le perd sur mer : **Rossbach** (1757) humilie son armée, **Québec** tombe en 1759, Montréal en 1760. Le **traité de Paris de 1763** abandonne le **Canada**, la vallée de l’Ohio et les comptoirs de l’Inde ; la France ne garde que cinq villes indiennes et ses Antilles sucrières. Le royaume en sort appauvri et blessé dans son orgueil. Le duc de **Choiseul** reconstruit aussitôt la marine — celle qui prendra sa revanche en Amérique quinze ans plus tard. Le règne n’est pourtant pas une simple liste de pertes : la **Lorraine** entre dans le royaume en 1766, à la mort de Stanislas, et la **Corse** est achetée à Gênes en 1768. Napoléon naîtra français un an plus tard.',
      },
      {
        titre: 'La réforme, les parlements et la fin',
        texte:
          'Le vrai combat de la fin du règne est intérieur. Les **parlements**, ces cours de justice tenues par des magistrats propriétaires de leur charge, refusent depuis des décennies d’enregistrer tout impôt qui toucherait aux privilégiés. En **1771**, le chancelier **Maupeou**, soutenu par le roi, les supprime purement et simplement, abolit la vénalité des offices et rend la justice gratuite, pendant que l’abbé **Terray** remet les finances d’aplomb. C’est la réforme la plus hardie de tout l’Ancien Régime — et elle soulève contre le roi la noblesse de robe et une partie des philosophes, qui voyaient dans les parlements un rempart contre le despotisme. Louis XV meurt de la **variole** le 10 mai 1774, tenu à l’écart de tous par crainte de la contagion. Son petit-fils **Louis XVI**, par désir d’apaisement, rappelle les parlements dès son avènement : le verrou que Maupeou avait fait sauter est remis en place, et il bloquera toutes les réformes jusqu’en 1788.',
      },
    ],
    chrono: [
      { date: '1710', fait: 'Naissance à Versailles.' },
      { date: '1715', fait: 'Mort de Louis XIV : il devient roi à cinq ans.' },
      { date: '1723', fait: 'Fin de la régence de Philippe d’Orléans.' },
      { date: '1744', fait: 'Malade à Metz, il est acclamé « le Bien-Aimé ».' },
      { date: '11 mai 1745', fait: 'Victoire de Fontenoy, où il commande en personne.' },
      { date: '1756-1763', fait: 'Guerre de Sept Ans ; le traité de Paris abandonne le Canada.' },
      { date: '1766', fait: 'La Lorraine est rattachée au royaume.' },
      { date: '1768', fait: 'La Corse est achetée à Gênes.' },
      { date: '1771', fait: 'Coup de Maupeou : suppression des parlements.' },
      { date: '10 mai 1774', fait: 'Mort de la variole à Versailles.' },
    ],
    leSaisTu:
      'Quand l’*Encyclopédie* de Diderot est interdite en 1759, c’est Mme de Pompadour, favorite du roi, qui obtient qu’on la laisse continuer ; Malesherbes, chargé de la censurer, cache lui-même les manuscrits saisis dans son hôtel. Le livre le plus hardi du siècle a survécu grâce à la cour qu’il critiquait.',
    aRetenir: [
      'Louis XV règne de 1715 à 1774, d’abord sous la régence de Philippe d’Orléans jusqu’en 1723.',
      'Surnommé le Bien-Aimé après sa maladie de 1744, il commande en personne à Fontenoy en 1745.',
      'La guerre de Sept Ans (1756-1763) fait perdre à la France le Canada et l’essentiel de l’Inde.',
      'Il rattache la Lorraine en 1766 et achète la Corse en 1768.',
      'Le coup de Maupeou de 1771 supprime les parlements ; Louis XVI les rétablit dès 1774.',
    ],
    mots: [
      {
        mot: 'Régence',
        sens: 'Gouvernement exercé au nom d’un roi trop jeune, absent ou empêché.',
      },
      {
        mot: 'Parlement',
        sens: 'Sous l’Ancien Régime, cour de justice tenue par des nobles, qui enregistre les lois et peut les bloquer.',
      },
      {
        mot: 'Vénalité des offices',
        sens: 'Système où les charges publiques s’achètent, se revendent et se transmettent par héritage.',
      },
    ],
    lies: ['louis-xiv', 'louis-xvi', 'voltaire', 'crise-financiere-de-la-monarchie'],
    niveaux: ['4e'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Louis XV',
      'Bien-Aimé',
      'Fontenoy',
      'guerre de Sept Ans',
      'Canada',
      'Maupeou',
      'Pompadour',
      'Lorraine',
      'Corse',
      'Versailles',
    ],
  },
  {
    id: 'voltaire',
    volet: 'personnages',
    nom: 'Voltaire',
    surnom: 'le patriarche de Ferney',
    dates: '1694 – 1778',
    tri: 1778,
    periode: 'temps-modernes',
    emoji: '✒️',
    roles: ['Écrivain', 'Philosophe', 'Historien', 'Défenseur de Calas'],
    origine: 'Paris',
    accroche:
      'Poète, dramaturge, historien et pamphlétaire, il fait de sa plume une arme contre l’intolérance — et d’une erreur judiciaire une affaire européenne.',
    citations: [
      {
        texte: 'Il faut cultiver notre jardin.',
        contexte: 'Dernière phrase de *Candide*, 1759.',
        sens:
          'Après avoir couru le monde et ses malheurs, le héros renonce aux grands systèmes : mieux vaut un travail utile et proche qu’une théorie qui explique tout.',
      },
      {
        texte:
          'Je ne suis pas d’accord avec ce que vous dites, mais je me battrai jusqu’à la mort pour que vous ayez le droit de le dire.',
        contexte:
          'Formulée en 1906 par Evelyn Beatrice Hall, dans une biographie anglaise, pour résumer la pensée de Voltaire.',
        sens:
          'Voltaire ne l’a jamais écrite. Elle résume pourtant ce qu’il a défendu toute sa vie, et elle est devenue la devise de la liberté d’expression.',
        incertaine: true,
      },
      {
        texte: 'Écrasons l’infâme.',
        contexte: 'Signature de ses lettres aux autres philosophes, à partir de 1760.',
        sens:
          'L’« infâme », ce n’est pas la religion mais le fanatisme et la persécution au nom de Dieu. Voltaire, déiste, croyait en un Dieu horloger.',
      },
      {
        texte: 'Criez, et qu’on crie.',
        contexte: 'À ses amis philosophes, pendant l’affaire Calas, 1762.',
        sens:
          'Sa méthode tient en trois mots : faire du bruit. Il inonde l’Europe de brochures jusqu’à ce que le roi rouvre le procès d’un innocent déjà exécuté.',
      },
    ],
    reperes: [
      'François-Marie Arouet, fils d’un notaire parisien, prend le nom de plume « Voltaire » en 1718.',
      'Embastillé onze mois en 1717, puis exilé en Angleterre de 1726 à 1728 après une bastonnade.',
      'Les *Lettres philosophiques* (1734), éloge de l’Angleterre, sont brûlées par la main du bourreau.',
      'Il vit trois ans chez Frédéric II de Prusse, puis s’installe à Ferney, près de Genève, en 1759.',
      'Il obtient la réhabilitation de Jean Calas en 1765 et publie le *Traité sur la tolérance*.',
      'Retour triomphal à Paris en février 1778 ; il y meurt le 30 mai, à quatre-vingt-trois ans.',
    ],
    recit: [
      {
        titre: 'Arouet devient Voltaire',
        texte:
          'François-Marie **Arouet** naît à Paris en 1694 dans une famille de robe aisée. Son père le veut notaire, il veut être poète. À vingt-trois ans, des vers insolents contre le Régent lui valent **onze mois à la Bastille** ; il en sort avec une tragédie sous le bras et un nom de plume, **Voltaire**, qu’il ne quittera plus. Le succès est immédiat : *Œdipe* triomphe, la cour le pensionne, et il s’enrichit en spéculant — il sera l’un des hommes les plus riches de France, ce qui lui donnera toute sa vie l’indépendance de parler. En **1726**, un noble, le chevalier de Rohan, le fait bastonner par ses laquais pour une repartie ; Voltaire demande réparation par les armes, et c’est lui qu’on embastille, puis qu’on exile. L’humiliation est fondatrice : elle lui apprend qu’un homme de talent sans naissance n’est rien devant un nom.',
      },
      {
        titre: 'L’Angleterre, Newton et madame du Châtelet',
        texte:
          'Les trois années passées en **Angleterre** (1726-1728) le retournent. Il y découvre un pays où l’on discute la religion sans aller en prison, où un commerçant vaut un lord, et où **Newton** reçoit des funérailles nationales. Les *Lettres philosophiques* (**1734**) racontent tout cela aux Français ; le livre est condamné, **brûlé par la main du bourreau**, et l’auteur doit fuir. Réfugié chez **Émilie du Châtelet**, au château de Cirey en Champagne, il travaille dix ans avec elle : mathématicienne, elle traduit les *Principia* de Newton en français — la seule traduction française encore utilisée aujourd’hui — et ils font ensemble des expériences de physique. Voltaire écrit alors des tragédies, *Le Siècle de Louis XIV*, et l’*Essai sur les mœurs*, où il raconte pour la première fois l’histoire de tous les peuples, Chine comprise, et non seulement celle des rois chrétiens.',
      },
      {
        titre: '*Candide*, ou le monde tel qu’il est',
        texte:
          'Le **tremblement de terre de Lisbonne**, le 1ᵉʳ novembre 1755, tue des dizaines de milliers de personnes un jour de Toussaint, dans des églises pleines. Voltaire y voit la ruine de l’idée que « tout est au mieux dans le meilleur des mondes possibles ». En 1759 paraît ***Candide***, cent cinquante pages écrites, dit-on, en trois jours : un jeune homme naïf traverse la guerre, l’Inquisition, l’esclavage des plantations et le naufrage, et conclut par la phrase la plus citée de la langue française — « **il faut cultiver notre jardin** ». Ce n’est pas un renoncement : c’est le refus des grands systèmes qui expliquent le malheur au lieu de le réduire. Le conte est interdit partout et lu partout.',
      },
      {
        titre: 'Ferney, ou la justice comme métier',
        texte:
          'Installé en **1759** à **Ferney**, à la frontière suisse — assez loin de Paris pour n’être pas arrêté, assez près de Genève pour fuir —, Voltaire devient l’homme le plus consulté d’Europe : vingt mille lettres conservées, des visiteurs venus de partout, et un village qu’il transforme en manufacture d’horlogerie de huit cents habitants. C’est là qu’il mène ses combats judiciaires. En 1762, **Jean Calas**, protestant de Toulouse, est roué vif pour un meurtre qu’il n’a pas commis ; Voltaire passe trois ans à inonder l’Europe de mémoires et obtient en **1765** sa **réhabilitation**. Il recommence pour la famille Sirven, pour le chevalier de **La Barre**, décapité à dix-neuf ans pour n’avoir pas salué une procession, pour le général Lally-Tollendal. Son *Traité sur la tolérance* (1763) sort tout entier de l’affaire Calas. Et la formule qui le résume, « **Écrasons l’infâme** », ne vise pas la foi : elle vise le fanatisme qui tue au nom de Dieu.',
      },
      {
        titre: 'Ses contradictions et son triomphe',
        texte:
          'Voltaire n’est ni un démocrate ni un saint. Il se méfie du peuple, qu’il juge incapable de raisonner ; il préfère un « despote éclairé » à une république, et courtise **Frédéric II** de Prusse comme **Catherine II** de Russie. Il a écrit des pages féroces contre les juifs. Et il fut, dans les années 1750, **actionnaire de compagnies pratiquant la traite négrière**, alors même que *Candide* contient la plus célèbre page française contre l’esclavage des plantations. En **février 1778**, à quatre-vingt-trois ans, il revient à Paris qu’il n’a pas revue depuis vingt-huit ans : la ville entière se porte à sa rencontre, et on le couronne de lauriers au Théâtre-Français devant trois mille spectateurs debout. Il meurt le **30 mai 1778**, épuisé. L’Église lui refuse une sépulture ; ses amis l’enterrent en hâte dans une abbaye de Champagne. En **1791**, la Révolution fait entrer ses cendres au **Panthéon**, suivies par six cent mille Parisiens.',
      },
    ],
    chrono: [
      { date: '1694', fait: 'Naissance à Paris.' },
      { date: '1717', fait: 'Onze mois à la Bastille pour des vers contre le Régent.' },
      { date: '1726-1728', fait: 'Exil en Angleterre.' },
      { date: '1734', fait: '*Lettres philosophiques* : le livre est brûlé.' },
      { date: '1755', fait: 'Tremblement de terre de Lisbonne.' },
      { date: '1759', fait: '*Candide* ; installation à Ferney.' },
      { date: '1762', fait: 'Il s’empare de l’affaire Calas.' },
      { date: '1763', fait: 'Publication du *Traité sur la tolérance*.' },
      { date: '1765', fait: 'Jean Calas est réhabilité.' },
      { date: 'février 1778', fait: 'Retour triomphal à Paris.' },
      { date: '30 mai 1778', fait: 'Mort à Paris.' },
      { date: '1791', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'Voltaire buvait, dit-on, une quarantaine de tasses de café par jour. Quand un médecin lui affirma que le café était un poison lent, il répondit qu’il devait l’être en effet : il en prenait depuis soixante-cinq ans. Il mourut à quatre-vingt-trois ans.',
    aRetenir: [
      'Voltaire (1694-1778) est le plus célèbre des philosophes des Lumières ; il combat le fanatisme.',
      'Les *Lettres philosophiques* (1734) font l’éloge de l’Angleterre et sont brûlées en France.',
      '*Candide* (1759) se termine par « il faut cultiver notre jardin ».',
      'Il obtient en 1765 la réhabilitation de Jean Calas et publie le *Traité sur la tolérance* en 1763.',
      'Ses cendres entrent au Panthéon en 1791, treize ans après sa mort.',
    ],
    mots: [
      {
        mot: 'Tolérance',
        sens: 'Droit reconnu à chacun de pratiquer sa religion, ou de n’en pas avoir, sans être poursuivi.',
      },
      {
        mot: 'Despote éclairé',
        sens: 'Souverain absolu qui gouverne selon la raison et protège les sciences, sans partager son pouvoir.',
      },
      {
        mot: 'Déisme',
        sens: 'Croyance en un Dieu créateur qu’on atteint par la raison seule, sans Église ni révélation.',
      },
      {
        mot: 'Réhabilitation',
        sens: 'Décision de justice qui annule une condamnation et rend son honneur au condamné.',
      },
    ],
    lies: ['rousseau', 'diderot', 'montesquieu', 'isaac-newton', 'l-encyclopedie'],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Voltaire',
      'Arouet',
      'Candide',
      'Ferney',
      'Calas',
      'tolérance',
      'Lettres philosophiques',
      'Panthéon',
      'fanatisme',
      'Lumières',
    ],
  },
  {
    id: 'rousseau',
    volet: 'personnages',
    nom: 'Jean-Jacques Rousseau',
    surnom: 'le citoyen de Genève',
    dates: '1712 – 1778',
    tri: 1778,
    periode: 'temps-modernes',
    emoji: '🌿',
    roles: ['Philosophe', 'Écrivain', 'Musicien'],
    origine: 'Genève, république protestante',
    accroche:
      'Fils d’un horloger genevois, il écrit que l’homme naît libre et bon, et qu’une loi ne vaut que si le peuple entier se l’est donnée lui-même.',
    citations: [
      {
        texte: 'L’homme est né libre, et partout il est dans les fers.',
        contexte: 'Première phrase de *Du contrat social*, 1762.',
        sens:
          'La liberté est notre état naturel ; toutes les chaînes — servitude, privilèges, obéissance à un maître — sont des inventions des hommes, donc réparables.',
      },
      {
        texte:
          'Le premier qui, ayant enclos un terrain, s’avisa de dire : ceci est à moi, et trouva des gens assez simples pour le croire, fut le vrai fondateur de la société civile.',
        contexte: 'Ouverture de la seconde partie du *Discours sur l’origine de l’inégalité*, 1755.',
        sens:
          'L’inégalité ne vient pas de la nature mais de la propriété et des institutions : elle a une histoire, donc elle peut changer.',
      },
      {
        texte:
          'Je veux montrer à mes semblables un homme dans toute la vérité de la nature ; et cet homme, ce sera moi.',
        contexte: 'Premières lignes des *Confessions*, écrites entre 1765 et 1770.',
        sens:
          'Le premier livre où quelqu’un raconte sa vie intérieure sans se flatter : c’est la naissance de l’autobiographie moderne.',
      },
      {
        texte: 'Renoncer à sa liberté, c’est renoncer à sa qualité d’homme.',
        contexte: '*Du contrat social*, livre I, chapitre 4, 1762.',
      },
    ],
    reperes: [
      'Né à Genève en 1712, fils d’un horloger ; orphelin de mère, il quitte la ville à seize ans.',
      'Le *Discours sur les sciences et les arts* (1750) le rend célèbre d’un coup, à trente-huit ans.',
      'Deux livres en 1762 : *Du contrat social* et *Émile*, tous deux condamnés et brûlés.',
      'Il rompt avec Diderot, avec Voltaire et avec l’*Encyclopédie*, dont il avait écrit les articles de musique.',
      'Ses cinq enfants sont déposés aux Enfants-Trouvés ; il l’avoue lui-même dans les *Confessions*.',
      'Mort en 1778 ; ses cendres entrent au Panthéon en 1794, sur décision de la Convention.',
    ],
    recit: [
      {
        titre: 'Un Genevois sans état',
        texte:
          'Jean-Jacques **Rousseau** naît le 28 juin **1712** à **Genève**, république protestante de vingt mille habitants où les citoyens votent — il signera toute sa vie « citoyen de Genève ». Sa mère meurt de ses couches ; son père, horloger, lui fait lire Plutarque à six ans, puis quitte la ville. Apprenti graveur battu par son maître, il s’enfuit à seize ans et trouve refuge chez **Mme de Warens**, en Savoie, qui l’instruit et le fait passer au catholicisme. Pendant quinze ans, il est tour à tour laquais, précepteur, secrétaire d’ambassade à Venise et copiste de musique — le seul métier dont il vivra vraiment. Il compose un opéra que Louis XV fait jouer, invente un système de notation musicale et rédige les articles de musique de l’*Encyclopédie*. À trente-huit ans, il n’est encore personne.',
      },
      {
        titre: 'La question de Dijon',
        texte:
          'En octobre **1749**, marchant sur la route de Vincennes pour aller voir **Diderot** emprisonné, il lit dans un journal la question mise au concours par l’académie de Dijon : le rétablissement des sciences et des arts a-t-il contribué à épurer les mœurs ? Il raconte avoir eu, assis sous un chêne, une illumination qui le laisse en larmes. Sa réponse est **non**, et elle prend le siècle à contre-pied : les arts et les sciences ont poli les hommes et corrompu leur cœur. Le *Discours sur les sciences et les arts* (**1750**) est couronné et le rend célèbre en quelques semaines. Cinq ans plus tard, le *Discours sur l’origine de l’inégalité* (1755) va plus loin : l’homme à l’état de nature n’est ni bon ni méchant, il est libre et sans besoins ; ce sont la **propriété**, puis les lois faites par les riches, qui ont créé les maîtres et les esclaves. Voltaire lui écrit : « On n’a jamais employé tant d’esprit à vouloir nous rendre bêtes. »',
      },
      {
        titre: '1762 : deux livres, deux condamnations',
        texte:
          'L’année **1762** est celle de sa vie. ***Du contrat social*** pose une question simple : d’où vient qu’un homme ait le droit de commander à un autre ? De nulle part, répond Rousseau, sinon d’un **contrat** que le peuple passe avec lui-même. La souveraineté appartient au peuple entier, elle est **inaliénable** — on ne peut pas la remettre à un roi — et la loi n’est rien d’autre que l’expression de la **volonté générale**. ***Émile, ou De l’éducation*** paraît la même année : on n’élève pas un enfant en le dressant, on le laisse apprendre par l’expérience, on ne lui met un livre entre les mains qu’à douze ans. Le livre contient la *Profession de foi du vicaire savoyard*, où la religion se réduit au sentiment du cœur. Les deux ouvrages sont **condamnés à Paris et brûlés à Genève**, sa propre ville ; un mandat d’arrêt le vise. Rousseau fuit en Suisse, puis en Angleterre chez le philosophe Hume — avec qui il se brouillera aussi.',
      },
      {
        titre: 'L’homme et ses contradictions',
        texte:
          'Rousseau se fâche avec tout le monde : avec **Diderot**, son ami de quinze ans ; avec **Voltaire**, qu’il accuse d’avoir attiré sur lui la haine de Genève ; avec les encyclopédistes, dont il refuse le monde de salons et de protecteurs. Il s’habille en Arménien, vit de copie de musique à dix sous la page, se croit persécuté — il l’était en partie. Surtout, l’auteur d’*Émile*, le plus beau livre du siècle sur l’enfance, a déposé ses **cinq enfants aux Enfants-Trouvés** à leur naissance, sans jamais chercher à les revoir. Il l’écrit lui-même dans les ***Confessions***, où il entreprend de se peindre « dans toute la vérité de la nature » : ni excuse ni fard, l’aveu compris. C’est ce livre-là, et les *Rêveries du promeneur solitaire*, qui feront de lui le père du **romantisme**.',
      },
      {
        titre: 'Le philosophe de la Révolution',
        texte:
          'Rousseau meurt le **2 juillet 1778**, cinq semaines après Voltaire, à Ermenonville où un marquis l’hébergeait. Il n’aura rien vu de sa postérité. Onze ans plus tard, la **Déclaration des droits de l’homme** écrit que « le principe de toute souveraineté réside essentiellement dans la Nation » et que « la loi est l’expression de la volonté générale » : ce sont ses mots. **Robespierre** le lit chaque jour et se réclame de lui ; la Convention fait transférer ses cendres au **Panthéon** le 11 octobre **1794**, face à celles de Voltaire, que tout opposait à lui. *Du contrat social*, presque invendu de son vivant, devient le livre le plus réédité de la Révolution.',
      },
    ],
    chrono: [
      { date: '1712', fait: 'Naissance à Genève.' },
      { date: '1728', fait: 'Il quitte Genève à seize ans.' },
      { date: '1750', fait: '*Discours sur les sciences et les arts* : la célébrité.' },
      { date: '1755', fait: '*Discours sur l’origine de l’inégalité*.' },
      { date: '1762', fait: '*Du contrat social* et *Émile* : les deux livres sont brûlés.' },
      { date: '1765-1770', fait: 'Rédaction des *Confessions*.' },
      { date: '2 juillet 1778', fait: 'Mort à Ermenonville.' },
      { date: '1789', fait: 'La Déclaration des droits reprend la volonté générale.' },
      { date: '1794', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'Rousseau gagnait sa vie en copiant de la musique à la main, dix sous la page, et refusa jusqu’au bout la pension que lui offrait le roi d’Angleterre. Il avait pourtant composé un opéra, *Le Devin du village*, joué devant Louis XV en 1752 et resté à l’affiche pendant soixante ans.',
    aRetenir: [
      'Rousseau (1712-1778) publie *Du contrat social* et *Émile* en 1762 ; les deux sont condamnés.',
      'Pour lui, la souveraineté appartient au peuple et la loi est l’expression de la volonté générale.',
      'Le *Discours sur l’inégalité* (1755) fait de la propriété l’origine des inégalités entre les hommes.',
      'Les *Confessions* inventent l’autobiographie ; il y avoue avoir abandonné ses cinq enfants.',
      'Ses idées inspirent la Déclaration des droits de l’homme de 1789 ; il entre au Panthéon en 1794.',
    ],
    mots: [
      {
        mot: 'Volonté générale',
        sens: 'Ce que veut le peuple entier considéré comme un corps, et qui seul peut faire la loi.',
      },
      {
        mot: 'Contrat social',
        sens: 'Accord par lequel des hommes libres décident de vivre ensemble sous des lois qu’ils se donnent.',
      },
      {
        mot: 'Souveraineté',
        sens: 'Le pouvoir suprême dans un État : pour Rousseau, il appartient au peuple et ne se délègue pas.',
      },
    ],
    lies: ['voltaire', 'diderot', 'montesquieu', 'declaration-des-droits-de-l-homme'],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Rousseau',
      'Jean-Jacques',
      'contrat social',
      'volonté générale',
      'Émile',
      'Confessions',
      'Genève',
      'inégalité',
      'Panthéon',
      'Lumières',
    ],
  },
  {
    id: 'diderot',
    volet: 'personnages',
    nom: 'Denis Diderot',
    surnom: 'le maître d’œuvre de l’Encyclopédie',
    dates: '1713 – 1784',
    tri: 1784,
    periode: 'temps-modernes',
    emoji: '📚',
    roles: ['Philosophe', 'Écrivain', 'Directeur de l’Encyclopédie', 'Critique d’art'],
    origine: 'Langres, Champagne',
    accroche:
      'Fils d’un coutelier de Langres, il passe vingt-cinq ans à diriger l’*Encyclopédie* : 28 volumes, 72 000 articles, tout le savoir d’un siècle.',
    citations: [
      {
        texte:
          'Le but d’une encyclopédie est de rassembler les connaissances éparses sur la surface de la terre, d’en exposer le système général aux hommes avec qui nous vivons, et de le transmettre aux hommes qui viendront après nous.',
        contexte: 'Article « Encyclopédie », tome V de l’ouvrage, 1755.',
        sens:
          'Un livre qui ne sert pas à briller, mais à armer les générations suivantes : c’est le programme de tout le siècle en une phrase.',
      },
      {
        texte: 'Aucun homme n’a reçu de la nature le droit de commander aux autres.',
        contexte: 'Article « Autorité politique », tome I de l’*Encyclopédie*, 1751.',
        sens:
          'La phrase qui a failli tuer l’ouvrage dès son premier tome : elle retire au roi son fondement divin.',
      },
      {
        texte: 'Hâtons-nous de rendre la philosophie populaire.',
        contexte: '*Pensées sur l’interprétation de la nature*, 1753.',
        sens:
          'Le savoir doit sortir des académies et descendre dans les ateliers : c’est le sens même de l’*Encyclopédie* et de ses onze volumes de planches.',
      },
      {
        texte:
          'La postérité est pour le philosophe ce que l’autre monde est pour l’homme religieux.',
        contexte: 'Lettre à Sophie Volland, 1765.',
        sens:
          'Diderot écrit pour des lecteurs qu’il ne connaîtra jamais : ses œuvres les plus neuves n’ont paru qu’après sa mort.',
      },
    ],
    reperes: [
      'Fils d’un maître coutelier de Langres, destiné à l’Église, il monte à Paris et vit dix ans de traductions.',
      'Emprisonné cent deux jours au donjon de Vincennes en 1749, pour sa *Lettre sur les aveugles*.',
      'Avec d’Alembert, il dirige l’*Encyclopédie* de 1747 à 1772 : 17 volumes de texte, 11 de planches.',
      'Interdit en 1759, l’ouvrage continue en secret, protégé par le censeur Malesherbes.',
      'Il fonde la critique d’art avec ses *Salons*, écrits pour une gazette lue dans toute l’Europe.',
      'Invité par Catherine II, il passe cinq mois à Saint-Pétersbourg en 1773-1774.',
    ],
    recit: [
      {
        titre: 'Le fils du coutelier',
        texte:
          'Denis **Diderot** naît en 1713 à **Langres**, en Champagne, dans une famille d’artisans du couteau. Il gardera toute sa vie le respect du travail de la main — et c’est lui qui fera dessiner dans l’*Encyclopédie* les ateliers, les outils et les gestes des métiers. Tonsuré à treize ans pour devenir chanoine, il préfère Paris, la philosophie et la misère : dix ans de traductions de l’anglais, de leçons particulières et de sermons écrits sur commande. En **1749**, sa *Lettre sur les aveugles à l’usage de ceux qui voient* — où un aveugle demande qu’on lui prouve Dieu par le toucher — le mène au **donjon de Vincennes** pour cent deux jours. Il en sort marqué : désormais il écrira ce qu’il pense, mais publiera peu. La moitié de son œuvre paraîtra après sa mort.',
      },
      {
        titre: 'Vingt-cinq ans pour l’*Encyclopédie*',
        texte:
          'Un libraire lui demande, en 1747, de traduire une encyclopédie anglaise en deux volumes. Diderot et le mathématicien **d’Alembert** en font tout autre chose : un *Dictionnaire raisonné des sciences, des arts et des métiers* qui rassemblerait tout le savoir humain et le mettrait en ordre. Le premier tome sort en **1751**, le dernier volume de planches en **1772** : **17 volumes de texte, 11 de gravures, environ 72 000 articles**, écrits par plus de cent quarante auteurs — Voltaire, Rousseau, Montesquieu, Turgot, Quesnay, mais aussi des médecins, des horlogers, des maîtres de forges. Une souscription complète coûte l’équivalent de deux années du salaire d’un ouvrier ; il s’en vend tout de même **4 300 exemplaires**, et bien davantage avec les contrefaçons étrangères. Diderot relit tout, réécrit, bouche les trous, recopie les articles qu’un imprimeur a censurés dans son dos. Il y perd sa vue et vingt-cinq ans de sa vie.',
      },
      {
        titre: 'Un livre de combat',
        texte:
          'L’*Encyclopédie* n’est pas neutre, et ses adversaires l’ont bien vu. L’article **« Autorité politique »**, dès le premier tome, affirme qu’« aucun homme n’a reçu de la nature le droit de commander aux autres ». Les **renvois** d’un article à l’autre font le reste du travail : l’article « Anthropophagie » renvoie à « Eucharistie », l’article « Capuchon » traite gravement de querelles de moines. La censure frappe deux fois : en **1752**, puis en **1759**, quand le Conseil du roi révoque le privilège et que Rome met l’ouvrage à l’Index. D’Alembert abandonne, Rousseau s’éloigne. Diderot continue seul, protégé en sous-main par **Malesherbes**, le directeur de la Librairie chargé de le censurer, qui met les manuscrits saisis à l’abri chez lui. Les pages de titre annoncent des villes étrangères ; l’ouvrage s’imprime en France.',
      },
      {
        titre: 'L’écrivain d’après-demain',
        texte:
          'Ce que Diderot écrit pour lui-même est plus hardi encore. ***Le Neveu de Rameau***, dialogue étincelant entre un philosophe et un parasite de génie, reste inédit jusqu’en 1805 — et c’est **Goethe** qui le traduira le premier. ***Jacques le Fataliste*** se moque du roman en train de s’écrire, cent cinquante ans avant qu’on invente un mot pour cela. *La Religieuse* dénonce les couvents où l’on enferme les filles sans vocation. Il invente aussi la **critique d’art** : ses *Salons*, écrits pour une gazette manuscrite envoyée aux têtes couronnées d’Europe, décrivent des tableaux à des gens qui ne les verront jamais. En **1765**, ruiné, il vend sa bibliothèque à **Catherine II** de Russie, qui la lui laisse en usage et le paie comme bibliothécaire ; il ira la remercier à Saint-Pétersbourg en 1773 et lui donnera cinq mois d’entretiens sur la manière de gouverner. Il meurt à Paris le **31 juillet 1784**, six ans après Voltaire et Rousseau, dans une maison que l’impératrice lui payait.',
      },
    ],
    chrono: [
      { date: '1713', fait: 'Naissance à Langres, en Champagne.' },
      { date: '1749', fait: 'Cent deux jours au donjon de Vincennes.' },
      { date: '1751', fait: 'Premier tome de l’*Encyclopédie*.' },
      { date: '1759', fait: 'L’ouvrage est interdit et mis à l’Index.' },
      { date: '1765', fait: 'Il vend sa bibliothèque à Catherine II de Russie.' },
      { date: '1772', fait: 'Dernier volume de planches : l’*Encyclopédie* est achevée.' },
      { date: '1773-1774', fait: 'Séjour de cinq mois à Saint-Pétersbourg.' },
      { date: '1784', fait: 'Mort à Paris, le 31 juillet.' },
    ],
    leSaisTu:
      'Pour les planches de l’*Encyclopédie*, Diderot est allé s’asseoir dans les ateliers : il a appris à fabriquer des bas, des épingles, du papier, de l’acier, et a fait dessiner chaque geste. Onze volumes d’images montrent des métiers que personne n’avait jamais jugés dignes d’un livre.',
    aRetenir: [
      'Diderot (1713-1784) dirige l’*Encyclopédie* avec d’Alembert, de 1747 à 1772.',
      'L’ouvrage compte 28 volumes et environ 72 000 articles, rédigés par plus de 140 auteurs.',
      'Interdit en 1752 puis en 1759, il paraît malgré la censure grâce à la protection de Malesherbes.',
      'L’*Encyclopédie* veut rassembler tout le savoir humain, y compris celui des métiers et des ateliers.',
      'Ses œuvres les plus neuves — *Le Neveu de Rameau*, *Jacques le Fataliste* — paraissent après sa mort.',
    ],
    mots: [
      {
        mot: 'Encyclopédie',
        sens: 'Ouvrage qui rassemble l’ensemble des connaissances, classées et reliées entre elles par des renvois.',
      },
      {
        mot: 'Censure',
        sens: 'Contrôle exercé par l’État ou l’Église sur les livres avant leur publication.',
      },
      {
        mot: 'Planche',
        sens: 'Grande gravure d’un ouvrage illustré ; dans l’*Encyclopédie*, elles montrent les outils et les ateliers.',
      },
    ],
    lies: ['l-encyclopedie', 'voltaire', 'rousseau', 'montesquieu'],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Diderot',
      'Encyclopédie',
      'd’Alembert',
      'Langres',
      'censure',
      'planches',
      'métiers',
      'Malesherbes',
      'Neveu de Rameau',
      'Lumières',
    ],
  },
  {
    id: 'benjamin-franklin',
    volet: 'personnages',
    nom: 'Benjamin Franklin',
    surnom: 'le sage de Philadelphie',
    dates: '1706 – 1790',
    tri: 1790,
    periode: 'temps-modernes',
    emoji: '⚡',
    roles: ['Imprimeur', 'Physicien', 'Diplomate', 'Père fondateur des États-Unis'],
    origine: 'Boston, colonie du Massachusetts',
    accroche:
      'Imprimeur devenu savant puis ambassadeur, il arrache la foudre au ciel — puis, à Versailles, l’alliance qui donne aux États-Unis leur indépendance.',
    citations: [
      {
        texte: 'Il a arraché la foudre au ciel et le sceptre aux tyrans.',
        qui: 'Turgot',
        contexte: 'Vers latin composé en 1778, gravé sous les portraits de Franklin vendus à Paris.',
        sens:
          '*Eripuit caelo fulmen sceptrumque tyrannis* : le paratonnerre et l’indépendance américaine tiennent dans une seule phrase.',
      },
      {
        texte:
          'Ceux qui renonceraient à une liberté essentielle pour acheter un peu de sécurité passagère ne méritent ni la liberté ni la sécurité.',
        contexte: 'Réponse de l’assemblée de Pennsylvanie au gouverneur, rédigée par Franklin en 1755.',
        sens:
          'Écrite à propos d’un impôt de guerre, elle est devenue l’argument le plus cité, partout dans le monde, contre les lois d’exception.',
      },
      {
        texte: 'Nous devons tous nous tenir ensemble, ou nous serons tous pendus séparément.',
        contexte: 'Prêtée à Franklin lors de la signature de la Déclaration d’indépendance, le 4 juillet 1776.',
        sens:
          'Aucun témoin ne la rapporte sur le moment. Elle dit juste : signer était un acte de haute trahison, puni de mort par l’Angleterre.',
        incertaine: true,
      },
      {
        texte: 'En ce monde, rien n’est certain, sauf la mort et les impôts.',
        contexte: 'Lettre au physicien français Jean-Baptiste Leroy, 1789.',
      },
    ],
    reperes: [
      'Quinzième enfant d’un fabricant de chandelles de Boston, il quitte l’école à dix ans.',
      'Imprimeur à Philadelphie, il y fonde un journal, une bibliothèque, des pompiers et une université.',
      'En 1752, l’expérience du cerf-volant prouve que la foudre est électrique : il invente le paratonnerre.',
      'Envoyé des insurgents en France de 1776 à 1785, il obtient le traité d’alliance du 6 février 1778.',
      'Il signe la Déclaration de 1776, l’alliance française, la paix de 1783 et la Constitution de 1787.',
      'Il affranchit ses esclaves et préside une société abolitionniste de Pennsylvanie à la fin de sa vie.',
    ],
    recit: [
      {
        titre: 'L’apprenti imprimeur',
        texte:
          'Benjamin **Franklin** naît à **Boston** en 1706, quinzième des dix-sept enfants d’un fabricant de chandelles. Il quitte l’école à dix ans, entre à douze comme apprenti chez son frère imprimeur, et s’instruit seul la nuit. À dix-sept ans il s’enfuit à **Philadelphie** avec trois pains sous le bras. Il y monte son atelier, publie la *Pennsylvania Gazette* et, chaque année, le ***Poor Richard’s Almanack*** — un almanach de proverbes vendu à dix mille exemplaires qui le rend célèbre dans toutes les colonies. Fortune faite à quarante-deux ans, il vend son imprimerie pour se consacrer à autre chose. Entre-temps, il a doté Philadelphie d’une **bibliothèque par souscription**, d’une compagnie de pompiers volontaires, d’un hôpital, d’une société savante et d’une académie devenue l’université de Pennsylvanie. Il n’a jamais déposé un seul brevet : une invention, disait-il, doit servir à tous.',
      },
      {
        titre: 'Le cerf-volant et le paratonnerre',
        texte:
          'La foudre passait pour un feu du ciel, imprévisible et divin. Franklin soutient qu’elle est de l’**électricité**, et propose une expérience pour le prouver. En **1752**, à Marly-la-Ville près de Paris, le naturaliste **Dalibard** dresse une barre de fer de treize mètres selon ses instructions et en tire des étincelles pendant un orage : la démonstration est française, l’idée est américaine. Le même été, Franklin lance lui-même un **cerf-volant** relié à une clef sous un ciel d’orage. Il en tire le **paratonnerre** — une pointe de métal reliée à la terre qui, montée sur un toit, écarte la foudre. C’est l’un des tout premiers objets où une découverte scientifique se change immédiatement en sécurité pour tout le monde. L’Europe savante l’adopte : Franklin est élu à la Royal Society de Londres, puis à l’Académie des sciences de Paris.',
      },
      {
        titre: 'L’ambassadeur en bonnet de fourrure',
        texte:
          'Quand les colonies se révoltent, Franklin a soixante-dix ans. Il signe la **Déclaration d’indépendance** le 4 juillet **1776** et part aussitôt pour la France chercher ce qui manque aux **insurgents** : de l’argent, des armes, une flotte. Il s’installe à Passy et devient le personnage le plus admiré de Paris — simple, spirituel, coiffé d’un bonnet de fourrure et sans perruque au milieu d’une cour poudrée. On met son visage sur les tabatières et les médaillons. Après la victoire américaine de **Saratoga**, il emporte la décision : le **6 février 1778**, la France signe avec les États-Unis un traité d’amitié et un traité d’**alliance**. Elle y engagera plus d’un milliard de livres — la dette qui, dix ans plus tard, ouvrira sa propre Révolution. Franklin négocie ensuite la paix : le traité de **Paris**, le 3 septembre 1783, reconnaît l’indépendance des treize États.',
      },
      {
        titre: 'Le dernier combat',
        texte:
          'Rentré en Amérique en **1785**, salué par les canons de Philadelphie, il siège en **1787** à la **Convention constitutionnelle**. À quatre-vingt-un ans, il est le plus âgé des délégués, et le compromis qu’il défend sur la représentation — une chambre élue à la population, une autre où chaque État pèse autant — sauve la **Constitution des États-Unis**, encore en vigueur aujourd’hui. Propriétaire d’esclaves dans sa jeunesse, il les a affranchis ; il préside à la fin de sa vie la **Société de Pennsylvanie pour l’abolition de l’esclavage** et adresse au Congrès, en février 1790, une pétition demandant la fin de la traite. Il meurt deux mois plus tard, le **17 avril 1790**. Vingt mille personnes suivent son cercueil, et l’Assemblée nationale française décrète **trois jours de deuil** — la première fois qu’une assemblée porte le deuil d’un étranger.',
      },
    ],
    chrono: [
      { date: '1706', fait: 'Naissance à Boston.' },
      { date: '1732', fait: 'Premier *Poor Richard’s Almanack*.' },
      { date: '1752', fait: 'Expérience de Marly et du cerf-volant : le paratonnerre.' },
      { date: '4 juillet 1776', fait: 'Il signe la Déclaration d’indépendance des États-Unis.' },
      { date: '1776', fait: 'Il arrive en France comme envoyé des insurgents.' },
      { date: '6 février 1778', fait: 'Traité d’alliance entre la France et les États-Unis.' },
      { date: '3 septembre 1783', fait: 'Traité de Paris : l’indépendance est reconnue.' },
      { date: '1787', fait: 'Il siège à la Convention constitutionnelle de Philadelphie.' },
      { date: '17 avril 1790', fait: 'Mort à Philadelphie ; la France décrète trois jours de deuil.' },
    ],
    leSaisTu:
      'Franklin a légué mille livres sterling à Boston et autant à Philadelphie, avec une condition : ne pas y toucher pendant deux siècles. Les deux villes ont ouvert les fonds en 1990 — près de sept millions de dollars — et les ont mis en bourses d’études. Il avait calculé jusqu’aux intérêts composés.',
    aRetenir: [
      'Benjamin Franklin (1706-1790) est imprimeur, savant et diplomate, et l’un des pères fondateurs des États-Unis.',
      'Il prouve en 1752 que la foudre est de l’électricité et invente le paratonnerre.',
      'Ambassadeur à Paris, il obtient le traité d’alliance franco-américain du 6 février 1778.',
      'Il signe la Déclaration d’indépendance (1776), la paix de 1783 et la Constitution de 1787.',
      'La guerre qu’il fait financer par la France y creuse la dette qui mène à la Révolution de 1789.',
    ],
    mots: [
      {
        mot: 'Insurgents',
        sens: 'Nom donné en France aux colons américains révoltés contre l’Angleterre.',
      },
      {
        mot: 'Paratonnerre',
        sens: 'Tige métallique reliée à la terre, qui capte la foudre et protège un bâtiment.',
      },
      {
        mot: 'Père fondateur',
        sens: 'Un des hommes qui ont fait l’indépendance des États-Unis et rédigé leur Constitution.',
      },
    ],
    lies: [
      'george-washington',
      'guerre-d-independance-americaine',
      'crise-financiere-de-la-monarchie',
      'la-fayette',
    ],
    niveaux: ['4e'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Franklin',
      'paratonnerre',
      'foudre',
      'Philadelphie',
      'insurgents',
      'États-Unis',
      'traité de 1778',
      'électricité',
      'imprimeur',
    ],
  },
  {
    id: 'george-washington',
    volet: 'personnages',
    nom: 'George Washington',
    surnom: 'le père de son pays',
    dates: '1732 – 1799',
    tri: 1799,
    periode: 'temps-modernes',
    emoji: '🎖️',
    roles: ['Général en chef', 'Premier président des États-Unis', 'Planteur de Virginie'],
    origine: 'Comté de Westmoreland, Virginie',
    accroche:
      'Il tient huit ans une armée sans solde ni souliers, gagne l’indépendance avec l’aide française, puis quitte le pouvoir au bout de deux mandats.',
    citations: [
      {
        texte:
          'Ayant achevé l’œuvre qui m’était confiée, je me retire de la grande scène de l’action et je rends mon commandement.',
        contexte: 'En remettant son épée au Congrès, à Annapolis, le 23 décembre 1783.',
        sens:
          'Un général victorieux qui rend les armes au pouvoir civil : le geste stupéfie l’Europe. George III en aurait dit qu’il serait « le plus grand homme du monde ».',
      },
      {
        texte:
          'Évitez les alliances permanentes avec quelque partie du monde étrangère que ce soit.',
        contexte: 'Discours d’adieu, le 19 septembre 1796, en refusant un troisième mandat.',
        sens:
          'La règle qui a guidé la diplomatie américaine pendant cent cinquante ans : pas d’engagement durable dans les querelles européennes.',
      },
      {
        texte: 'Je ne puis mentir, papa : c’est moi qui ai coupé le cerisier avec ma hachette.',
        contexte: 'Anecdote inventée en 1806 par son biographe Parson Weems, enseignée un siècle durant.',
        sens:
          'Elle n’a jamais eu lieu. Elle dit ce que l’Amérique voulait croire de son premier président : que l’honnêteté fonde l’autorité.',
        incertaine: true,
      },
    ],
    reperes: [
      'Planteur de Virginie, arpenteur à seize ans, officier contre la France de 1754 à 1758.',
      'Nommé général en chef des treize colonies par le Congrès le 15 juin 1775, il refuse toute solde.',
      'Hiver 1777-1778 à Valley Forge : deux mille cinq cents hommes meurent de froid et de faim.',
      'La victoire de Yorktown, le 19 octobre 1781, est remportée avec Rochambeau et la flotte de Grasse.',
      'Élu premier président des États-Unis en 1789, réélu en 1792, il refuse un troisième mandat.',
      'Propriétaire de plus de trois cents esclaves, il est le seul père fondateur à les affranchir par testament.',
    ],
    recit: [
      {
        titre: 'Un planteur de Virginie',
        texte:
          'George **Washington** naît en 1732 en **Virginie**, dans une famille de planteurs sans grande fortune. Son père meurt quand il a onze ans ; il n’ira jamais à l’université. À seize ans, il est **arpenteur** — un métier qui l’envoie seul dans les forêts de l’Ouest et lui apprend le pays. À vingt-deux ans, chargé de sommer les Français d’évacuer la vallée de l’Ohio, il déclenche par une escarmouche la **guerre de Sept Ans** sur le continent américain, puis sert sous les ordres du général Braddock, dont l’armée est détruite. Il en sort avec une réputation de courage et une conviction : les officiers anglais méprisent les coloniaux. Rentré à **Mount Vernon**, il cultive le tabac puis le blé, agrandit son domaine et siège à l’assemblée de Virginie ; c’est déjà l’un des hommes les plus respectés de la colonie.',
      },
      {
        titre: 'Huit ans pour tenir une armée',
        texte:
          'Quand la révolte éclate, le Congrès cherche un chef que le Nord et le Sud puissent accepter ensemble : le **15 juin 1775**, il nomme Washington général en chef, et celui-ci refuse toute solde. La tâche est presque impossible. Ses hommes s’engagent pour un an, désertent à la moisson, manquent de fusils, de poudre et de chaussures ; le Congrès n’a pas le droit de lever l’impôt. Washington perd plus de batailles qu’il n’en gagne — New York, Brandywine, Germantown — mais il refuse l’affrontement décisif que cherchent les Anglais et **garde son armée en vie** : tant qu’elle existe, la révolution existe. La nuit de **Noël 1776**, il traverse le Delaware en barque au milieu des glaces et surprend les mercenaires hessois à **Trenton** ; ce coup d’audace relance une cause qu’on croyait perdue. L’hiver **1777-1778** à **Valley Forge** tue deux mille cinq cents de ses hommes de froid et de faim — l’armée en ressort pourtant instruite, mise au pas par le Prussien von Steuben.',
      },
      {
        titre: 'Yorktown, ou l’alliance française',
        texte:
          'La victoire américaine de Saratoga (1777) décide la France à s’engager ouvertement : le **traité d’alliance du 6 février 1778**, négocié par **Franklin**, jette dans la guerre la marine et l’armée de Louis XVI. Le marquis de **La Fayette**, parti à dix-neuf ans sur un navire acheté de ses deniers, devient l’un des officiers préférés de Washington ; **Rochambeau** débarque en 1780 avec six mille hommes. Le plan de **1781** est mené à quatre : Washington et Rochambeau descendent de New York vers la Virginie, pendant que la flotte de l’amiral **de Grasse**, venue des Antilles, verrouille la baie de Chesapeake et interdit toute évacuation par la mer. L’armée anglaise de **Cornwallis**, encerclée à **Yorktown**, capitule le **19 octobre 1781** ; sur les vingt mille assiégeants, la moitié sont Français. C’est la fin de la guerre. Le **traité de Paris** de 1783 reconnaît les États-Unis — et Washington fait alors le geste qui le rend célèbre en Europe : il **rend son commandement au Congrès** et rentre labourer ses terres.',
      },
      {
        titre: 'Le président qui s’en va',
        texte:
          'La jeune fédération tient mal : treize États qui refusent de payer, treize monnaies, presque pas d’armée. Washington préside à **Philadelphie**, de mai à septembre **1787**, la **Convention** qui écrit la **Constitution des États-Unis** — séparation des pouvoirs prise chez **Montesquieu**, un président élu, un Congrès à deux chambres, une Cour suprême. Élu à l’unanimité des grands électeurs, il prête serment le **30 avril 1789**, six semaines avant que les États généraux français ne se transforment en Assemblée nationale. Il invente tout : le titre de « monsieur le Président » plutôt que d’Altesse, le cabinet de ministres, la neutralité dans la guerre entre la France et l’Angleterre. Réélu en 1792, il **refuse un troisième mandat** en 1796 et retourne à Mount Vernon. Aucun chef d’État ne quittait alors volontairement le pouvoir : la règle des deux mandats tiendra cent cinquante ans par simple respect de son exemple, avant d’entrer dans la Constitution en 1951. Il meurt le **14 décembre 1799**.',
      },
      {
        titre: 'Ce que dit son testament',
        texte:
          'Washington possédait à sa mort **317 esclaves** à Mount Vernon, dont cent vingt-trois lui appartenaient en propre. Il avait cessé d’en acheter et de séparer les familles, et écrivait dès 1786 souhaiter qu’un plan fût adopté pour abolir l’esclavage ; il n’a jamais porté la question devant le Congrès, où elle aurait brisé l’Union naissante. Son **testament** affranchit tous ceux dont il pouvait disposer, à la mort de sa femme, avec une pension pour les vieux et l’obligation d’apprendre un métier aux enfants : de tous les pères fondateurs propriétaires d’esclaves, il est le seul à l’avoir fait. La République qu’il laisse repose sur l’égalité proclamée en 1776 et sur l’esclavage maintenu — une contradiction qui ne se réglera que par la guerre de Sécession, soixante-deux ans plus tard.',
      },
    ],
    chrono: [
      { date: '1732', fait: 'Naissance en Virginie.' },
      { date: '1754', fait: 'Escarmouche de l’Ohio : la guerre contre la France en Amérique.' },
      { date: '15 juin 1775', fait: 'Le Congrès le nomme général en chef.' },
      { date: '25 décembre 1776', fait: 'Traversée du Delaware et victoire de Trenton.' },
      { date: '1777-1778', fait: 'Valley Forge : l’armée survit à grand-peine à l’hiver.' },
      { date: '19 octobre 1781', fait: 'Capitulation anglaise à Yorktown.' },
      { date: '23 décembre 1783', fait: 'Il rend son commandement au Congrès.' },
      { date: '1787', fait: 'Il préside la Convention constitutionnelle de Philadelphie.' },
      { date: '30 avril 1789', fait: 'Premier président des États-Unis.' },
      { date: '1796', fait: 'Discours d’adieu : il refuse un troisième mandat.' },
      { date: '14 décembre 1799', fait: 'Mort à Mount Vernon.' },
    ],
    leSaisTu:
      'Washington n’avait presque plus de dents à cinquante ans. Ses dentiers, conservés, sont faits d’ivoire d’hippopotame, de plomb et de dents humaines achetées — jamais de bois, contrairement à la légende. La douleur explique la bouche close et l’air sévère de tous ses portraits.',
    aRetenir: [
      'George Washington (1732-1799) commande l’armée américaine de 1775 à 1783.',
      'La victoire de Yorktown, le 19 octobre 1781, est remportée avec Rochambeau et la flotte de Grasse.',
      'Le traité de Paris de 1783 reconnaît l’indépendance des États-Unis.',
      'Il préside en 1787 la Convention de Philadelphie qui écrit la Constitution américaine.',
      'Premier président des États-Unis en 1789, il refuse un troisième mandat en 1796.',
    ],
    mots: [
      {
        mot: 'Père fondateur',
        sens: 'Un des hommes qui ont fait l’indépendance des États-Unis et rédigé leur Constitution.',
      },
      {
        mot: 'Fédération',
        sens: 'État formé de plusieurs États qui gardent leurs lois propres et partagent un gouvernement commun.',
      },
      {
        mot: 'Mandat',
        sens: 'Durée pendant laquelle un élu exerce sa fonction : quatre ans pour un président américain.',
      },
    ],
    lies: [
      'benjamin-franklin',
      'guerre-d-independance-americaine',
      'crise-financiere-de-la-monarchie',
      'montesquieu',
    ],
    niveaux: ['4e', '2de'],
    programme: 'Le XVIIIᵉ siècle : Lumières et révolutions',
    tags: [
      'Washington',
      'États-Unis',
      'Yorktown',
      'Valley Forge',
      'Mount Vernon',
      'Constitution',
      'président',
      'indépendance',
      'La Fayette',
      'Rochambeau',
    ],
  },
]
