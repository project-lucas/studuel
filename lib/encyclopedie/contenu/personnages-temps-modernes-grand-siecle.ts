// -----------------------------------------------------------------------------
// TEMPS MODERNES — LE GRAND SIÈCLE : Richelieu, Descartes, Molière, Colbert,
// Vauban, Louis XIV.
//
// Un seul siècle, et l'État français y prend la forme qu'il a gardé : des
// ministres qui travaillent sur pièces, des intendants dans les provinces, un
// droit écrit le même partout, des académies, des frontières dessinées, une
// langue et un théâtre que l'Europe copie. On raconte ce qui a été BÂTI et
// TENU — c'est la consigne du § 3 de `docs/encyclopedie.md`.
//
// Les duretés sont dites, datées, expliquées dans leur temps : la révocation de
// l'édit de Nantes et les 200 000 protestants qui partent, le prix des guerres,
// l'hiver de 1709, l'impôt que Vauban propose de faire payer à tous et qu'on
// lui saisit. Aucune moquerie, aucun procès rétrospectif : les faits, avec
// leurs chiffres, et ce que les contemporains en pensaient.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_TEMPS_MODERNES_GRAND_SIECLE: Personnage[] = [
  {
    id: 'richelieu',
    volet: 'personnages',
    nom: 'Richelieu',
    surnom: 'le cardinal qui bâtit l’État',
    dates: '1585 – 1642',
    tri: 1642,
    periode: 'temps-modernes',
    emoji: '♟️',
    roles: ['Cardinal', 'Principal ministre de Louis XIII', 'Fondateur de l’Académie française'],
    origine: 'Paris, d’une famille de petite noblesse du Poitou',
    accroche:
      'Ministre de Louis XIII pendant dix-huit ans, il désarme le parti protestant, soumet les grands et laisse une France qui tient sans lui.',
    citations: [
      {
        texte: 'Je n’ai jamais eu d’autres ennemis que ceux de l’État.',
        contexte:
          'À son confesseur qui lui demandait, sur son lit de mort, s’il pardonnait à ses ennemis. Paris, décembre 1642.',
        sens:
          'Il ne prétend pas n’avoir fait que des heureux : il dit n’avoir combattu personne pour lui-même. Toute sa politique tient là — la raison d’État passe avant les personnes.',
      },
      {
        texte:
          'Ruiner le parti huguenot, rabaisser l’orgueil des grands, réduire tous les sujets en leur devoir, et relever son nom dans les nations étrangères au point où il devait être.',
        contexte:
          'Le programme qu’il présente à Louis XIII en entrant au Conseil, en 1624, rapporté dans ses *Mémoires*.',
        sens:
          'Quatre chantiers annoncés d’avance, et tenus en dix-huit ans. « Son nom » est celui du roi : il s’agit de rendre à la France son rang en Europe.',
      },
      {
        texte:
          'Donnez-moi six lignes écrites de la main du plus honnête homme, j’y trouverai de quoi le faire pendre.',
        contexte:
          'Phrase que le XIXᵉ siècle a prêtée au cardinal et qu’aucun texte de son temps ne contient.',
        incertaine: true,
      },
    ],
    reperes: [
      'Évêque de Luçon à 21 ans, il se fait remarquer aux états généraux de 1614 — les derniers avant 1789.',
      'Cardinal en 1622, principal ministre de Louis XIII de 1624 jusqu’à sa mort, en 1642.',
      'Siège de La Rochelle (1627-1628) : la place protestante tombe après quatorze mois.',
      'Journée des Dupes, 10 novembre 1630 : la reine mère croit l’avoir fait renvoyer ; c’est elle qui part.',
      'Il fonde l’Académie française en 1635 et envoie dans les provinces des intendants révocables.',
      'En 1635, il engage la France dans la guerre de Trente Ans contre les Habsbourg d’Espagne et d’Autriche.',
    ],
    recit: [
      {
        titre: 'Un évêque pauvre qui monte',
        texte:
          'Armand Jean du Plessis naît à Paris en **1585**, troisième fils d’une famille de petite noblesse du Poitou, ruinée par les guerres de Religion. La famille tient l’évêché de **Luçon**, le plus pauvre de France : il le prend à vingt et un ans, avec une dispense du pape, et s’y révèle administrateur. Aux **états généraux de 1614** — la dernière assemblée de ce genre avant 1789 —, il parle au nom du clergé et se fait voir de la régente **Marie de Médicis**. Il entre au Conseil, en est chassé, revient, obtient le **chapeau de cardinal** en 1622 et, en août **1624**, la direction des affaires. Il a trente-neuf ans, une santé détestable, et dix-huit ans devant lui.',
      },
      {
        titre: 'La Rochelle, ou l’État sans rival armé',
        texte:
          'L’**édit de Nantes** de 1598 avait donné aux protestants la liberté de culte, mais aussi des assemblées, des troupes et une centaine de **places de sûreté** : un parti armé dans le royaume. Richelieu décide d’en finir avec l’armée, pas avec la foi. En 1627, il met le siège devant **La Rochelle** et fait barrer la rade par une **digue de pierre de plus d’un kilomètre**, pour que la flotte anglaise ne ravitaille plus la ville. Elle capitule le **28 octobre 1628**, après quatorze mois : des 28 000 habitants, il en reste environ 5 000. La **paix d’Alès** (1629) ôte aux protestants leurs places fortes et leurs armées, et leur **laisse le culte et les droits civils** de l’édit de Nantes. C’est une victoire politique, et elle est présentée comme telle.',
      },
      {
        titre: 'Rabaisser l’orgueil des grands',
        texte:
          'Les princes et les gouverneurs de province tiennent des châteaux, des clientèles et parfois des armées. Richelieu fait **raser les forteresses intérieures**, interdit le **duel** par l’édit de 1626 et fait décapiter en 1627 le comte de Bouteville, qui s’était battu place Royale par défi. En 1632, le duc **Henri II de Montmorency**, maréchal de France et révolté, est exécuté à Toulouse. Le **10 novembre 1630**, la **journée des Dupes** : Marie de Médicis arrache au roi la disgrâce du cardinal, la cour se précipite pour la féliciter — et Louis XIII, le soir même, confirme son ministre. C’est la reine mère qui prendra le chemin de l’exil. Surtout, Richelieu généralise les **intendants** : des agents du roi, sans terres ni titres dans la province, **révocables du jour au lendemain**, qui y portent la justice, la police et les finances. L’administration moderne commence là.',
      },
      {
        titre: 'Les lettres, la marine, la Gazette',
        texte:
          'En **1635**, il transforme un cercle d’écrivains qui se réunissait chez Conrart en **Académie française** : quarante membres chargés de fixer la langue et d’en faire le dictionnaire. Il installe l’**Imprimerie royale** au Louvre (1640), fait reconstruire la **Sorbonne**, protège Corneille. Dès 1631, il soutient la *Gazette* de **Théophraste Renaudot**, premier journal français — où le roi et le cardinal écrivent eux-mêmes des articles : l’information devient une affaire d’État. Il crée de rien **deux flottes**, l’une au Ponant, l’autre au Levant, et pousse la **Compagnie de la Nouvelle-France** (1627) qui peuple le Canada autour de Québec.',
      },
      {
        titre: 'La raison d’État',
        texte:
          'En **1635**, un cardinal de l’Église romaine fait entrer la France dans la **guerre de Trente Ans** aux côtés des princes luthériens d’Allemagne et de la Suède, contre l’Espagne et l’Empire, catholiques. Le parti dévot crie au scandale ; Richelieu répond que la France, encerclée par les terres des **Habsbourg**, défend son existence, et que le roi répond du royaume avant de répondre de la chrétienté. C’est la **raison d’État**. Le prix est lourd : la **taille** triple, les révoltes de **croquants** et de **va-nu-pieds** éclatent en 1636-1639, l’ennemi prend Corbie en 1636 et campe à cent kilomètres de Paris. Le cardinal meurt le **4 décembre 1642**, cinq mois avant son roi. Quelques mois plus tard, l’armée qu’il a formée écrase les Espagnols à **Rocroi**.',
      },
    ],
    chrono: [
      { date: '1585', fait: 'Naissance à Paris.' },
      { date: '1607', fait: 'Évêque de Luçon à 21 ans.' },
      { date: '1624', fait: 'Il prend la direction du Conseil du roi.' },
      { date: '1628', fait: 'Prise de La Rochelle après quatorze mois de siège.' },
      { date: '1629', fait: 'Paix d’Alès : le culte protestant reste, les places fortes tombent.' },
      { date: '1630', fait: 'Journée des Dupes : Louis XIII le maintient.' },
      { date: '1635', fait: 'Académie française ; entrée en guerre contre l’Espagne.' },
      { date: '1642', fait: 'Mort à Paris, le 4 décembre.' },
    ],
    leSaisTu:
      'Pour prendre La Rochelle, Richelieu a fermé la mer. Sur les plans de l’architecte Clément Métezeau, on a coulé des blocs de pierre et des navires chargés de pierres en travers de la rade, sur plus d’un kilomètre, avec un passage laissé aux marées pour que l’ouvrage ne soit pas emporté. La flotte anglaise est venue deux fois, et deux fois elle est repartie sans pouvoir entrer.',
    aRetenir: [
      'Richelieu est principal ministre de Louis XIII de 1624 à 1642.',
      'Le siège de La Rochelle (1627-1628) et la paix d’Alès (1629) retirent aux protestants leurs places fortes, mais leur laissent la liberté de culte.',
      'Il envoie dans les provinces des intendants, agents du roi révocables : c’est l’ossature de l’État moderne.',
      'Il fonde l’Académie française en 1635.',
      'Au nom de la raison d’État, il engage la France contre les Habsbourg dans la guerre de Trente Ans.',
    ],
    mots: [
      {
        mot: 'Raison d’État',
        sens: 'Principe selon lequel l’intérêt de l’État peut l’emporter sur les autres règles, morales ou religieuses.',
      },
      {
        mot: 'Intendant',
        sens: 'Agent du roi envoyé dans une province avec la justice, la police et les finances, et révocable à tout moment.',
      },
      {
        mot: 'Place de sûreté',
        sens: 'Ville fortifiée laissée en garde aux protestants par l’édit de Nantes pour garantir leur sécurité.',
      },
    ],
    lies: ['louis-xiv', 'colbert', 'edit-de-nantes', 'la-fronde'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'cardinal',
      'Louis XIII',
      'La Rochelle',
      'Académie française',
      'raison d’État',
      'intendants',
      'journée des Dupes',
      'guerre de Trente Ans',
      'Alès',
      'huguenots',
    ],
  },
  {
    id: 'descartes',
    volet: 'personnages',
    nom: 'René Descartes',
    surnom: 'le père de la méthode',
    dates: '1596 – 1650',
    tri: 1650,
    periode: 'temps-modernes',
    emoji: '🧠',
    roles: ['Philosophe', 'Mathématicien', 'Physicien'],
    origine: 'La Haye en Touraine, aujourd’hui Descartes',
    accroche:
      'Il décide de ne plus rien tenir pour vrai qu’il n’ait vérifié lui-même — et trouve, au bout du doute, une seule certitude : il pense, donc il est.',
    citations: [
      {
        texte: 'Je pense, donc je suis.',
        contexte: '*Discours de la méthode*, quatrième partie, 1637.',
        sens:
          'Il a douté de tout : de ses sens, de ses souvenirs, même des mathématiques. Mais douter, c’est penser, et penser suppose quelqu’un qui pense. La première certitude, c’est lui-même.',
      },
      {
        texte: 'Le bon sens est la chose du monde la mieux partagée.',
        contexte: 'Première phrase du *Discours de la méthode*, 1637.',
        sens:
          'La raison n’est pas réservée aux savants : chacun l’a reçue entière. Ce qui manque n’est pas l’intelligence, c’est la méthode pour s’en servir.',
      },
      {
        texte:
          'Diviser chacune des difficultés que j’examinerais en autant de parcelles qu’il se pourrait et qu’il serait requis pour les mieux résoudre.',
        contexte: 'Deuxième des quatre préceptes de la méthode, *Discours de la méthode*, 1637.',
        sens:
          'La recette qu’on applique encore devant un problème trop gros : le couper en morceaux qu’on sait traiter, un par un.',
      },
      {
        texte: 'Nous rendre comme maîtres et possesseurs de la nature.',
        contexte: 'Sixième partie du *Discours de la méthode*, 1637, sur l’usage des sciences.',
        sens:
          'La science ne doit pas seulement expliquer : elle doit guérir, construire, faire vivre mieux. Le programme des trois siècles suivants tient dans cette ligne.',
      },
    ],
    reperes: [
      'Élève des jésuites à La Flèche, il en sort persuadé qu’il n’a rien appris de vraiment certain.',
      'Le 10 novembre 1619, enfermé dans une chambre chauffée en Allemagne, il conçoit le projet d’une science unique.',
      'Il vit vingt ans aux Provinces-Unies, où l’on imprime ce qu’ailleurs on brûle.',
      'Le *Discours de la méthode* (1637) est écrit en français, et non en latin : la philosophie sort de l’université.',
      'En géométrie, il fait se rejoindre les courbes et les équations : c’est le repère cartésien.',
      'Il meurt à Stockholm en 1650, à 53 ans, d’une pneumonie prise à la cour de la reine Christine.',
    ],
    recit: [
      {
        titre: 'Un élève qui ne croit plus ses livres',
        texte:
          'René Descartes naît en **1596** en Touraine, dans une famille de magistrats. Il passe huit ans au collège jésuite de **La Flèche**, la meilleure école d’Europe, et en sort avec une conclusion qui décidera de sa vie : on lui a enseigné beaucoup d’opinions et presque aucune certitude. Il prend son diplôme de droit à Poitiers, puis décide d’aller lire « **le grand livre du monde** » : il s’engage comme volontaire dans l’armée de Maurice de Nassau, en Hollande, puis dans celle de Bavière. Le **10 novembre 1619**, immobilisé par l’hiver près d’Ulm, il s’enferme dans un « poêle » — une chambre chauffée — et fait trois songes dont il sortira avec une idée : toutes les sciences se tiennent comme les maillons d’une chaîne, et un seul homme qui raisonne bien fait mieux qu’une foule qui répète.',
      },
      {
        titre: 'Le doute comme outil',
        texte:
          'Sa méthode commence par une démolition volontaire : il écarte **tout ce dont on peut douter**, comme on vide une corbeille de pommes pour ne garder que les saines. Les sens trompent — un bâton dans l’eau paraît brisé. Les rêves imitent la veille à s’y méprendre. Un « malin génie » pourrait même fausser les mathématiques. Que reste-t-il ? Ceci : pendant que je doute, je pense ; et si je pense, c’est que je suis. **« Je pense, donc je suis »** n’est pas une jolie phrase, c’est le premier sol ferme sur lequel il rebâtit tout. Le reste suit quatre **préceptes** : n’accepter que l’évidence, diviser les difficultés, aller du plus simple au plus composé, et tout recompter pour ne rien omettre. Ce n’est pas du scepticisme : c’est un outil.',
      },
      {
        titre: 'Un livre en français, un livre sous clef',
        texte:
          'En **1633**, il apprend la condamnation de **Galilée** par l’Inquisition. Son propre traité, *Le Monde*, repose sur le mouvement de la Terre : il le retire de l’impression et le gardera toute sa vie dans un tiroir. Quatre ans plus tard, à Leyde, il publie sans nom d’auteur le *Discours de la méthode*, **en français** — pour être lu de ceux qui n’ont jamais appris le latin, et qui jugeront, écrit-il, avec leur seule raison. Le livre sert de préface à trois essais : *La Dioptrique*, *Les Météores* et *La Géométrie*. Dans ce dernier, il note les inconnues **x, y, z**, invente l’écriture des puissances, et montre qu’une **courbe peut s’écrire comme une équation**. Le repère qu’on trace au tableau en cours de maths porte son nom.',
      },
      {
        titre: 'Stockholm, cinq heures du matin',
        texte:
          'Suivent les *Méditations métaphysiques* (**1641**), où il cherche à prouver l’existence de Dieu et à distinguer l’âme du corps, et *Les Passions de l’âme* (1649). Sa physique — un univers rempli de tourbillons de matière — sera balayée par **Newton** ; sa méthode, elle, ne bougera plus. En 1649, la reine **Christine de Suède** le fait venir à Stockholm pour qu’il lui enseigne la philosophie. Il meurt d’une pneumonie le **11 février 1650**, à cinquante-trois ans. Ses os reviendront en France seize ans plus tard. Les **Lumières** se réclameront de lui : Voltaire, d’Alembert et l’*Encyclopédie* verront dans ce Tourangeau prudent l’homme qui a osé dire qu’aucune autorité ne vaut une preuve.',
      },
    ],
    chrono: [
      { date: '1596', fait: 'Naissance à La Haye, en Touraine.' },
      { date: '1607-1615', fait: 'Études au collège jésuite de La Flèche.' },
      { date: '10 novembre 1619', fait: 'Les trois songes : le projet d’une science unique.' },
      { date: '1628', fait: 'Il s’installe aux Provinces-Unies, pour vingt ans.' },
      { date: '1633', fait: 'Galilée condamné : il retire *Le Monde* de l’impression.' },
      { date: '1637', fait: '*Discours de la méthode*, publié en français.' },
      { date: '1641', fait: '*Méditations métaphysiques*.' },
      { date: '1649', fait: 'Départ pour la cour de Christine de Suède.' },
      { date: '11 février 1650', fait: 'Mort à Stockholm.' },
    ],
    leSaisTu:
      'Descartes avait passé sa vie à travailler couché : au collège de La Flèche, sa santé fragile lui avait valu l’autorisation de rester au lit le matin, et il y avait pris l’habitude de penser jusqu’à midi. La reine Christine, elle, voulait ses leçons de philosophie à cinq heures du matin, dans une bibliothèque glaciale. Il a tenu quatre mois.',
    aRetenir: [
      'René Descartes publie le *Discours de la méthode* en 1637, en français et non en latin.',
      'Sa méthode repose sur le doute : ne tenir pour vrai que ce qu’on a soi-même vérifié.',
      '« Je pense, donc je suis » est la première certitude qu’il retrouve au bout du doute.',
      'Il crée la géométrie analytique : une courbe peut s’écrire comme une équation (repère cartésien).',
      'Il meurt à Stockholm en 1650, à la cour de la reine Christine de Suède.',
    ],
    mots: [
      {
        mot: 'Doute méthodique',
        sens: 'Écarter provisoirement tout ce dont on peut douter, pour voir ce qui résiste : ce qui reste est certain.',
      },
      {
        mot: 'Rationalisme',
        sens: 'Idée que la raison, et non l’autorité d’un maître ou d’un livre, est le juge du vrai.',
      },
      {
        mot: 'Repère cartésien',
        sens: 'Deux axes gradués qui donnent à chaque point du plan un couple de nombres.',
      },
    ],
    lies: ['galilee', 'isaac-newton', 'l-encyclopedie'],
    niveaux: ['5e', '2de'],
    programme: 'Science et société aux XVIIᵉ et XVIIIᵉ siècles',
    tags: [
      'cogito',
      'Discours de la méthode',
      'doute',
      'méthode',
      'philosophie',
      'géométrie',
      'repère cartésien',
      'La Flèche',
      'Stockholm',
      'rationalisme',
    ],
  },
  {
    id: 'moliere',
    volet: 'personnages',
    nom: 'Molière',
    surnom: 'le comédien du roi',
    dates: '1622 – 1673',
    tri: 1673,
    periode: 'temps-modernes',
    emoji: '🎭',
    roles: ['Comédien', 'Auteur de comédies', 'Chef de troupe'],
    origine: 'Paris, fils d’un tapissier du roi',
    accroche:
      'Fils d’un tapissier du roi, il abandonne tout pour le théâtre, joue devant Louis XIV et fait rire la cour de ce qu’elle est.',
    citations: [
      {
        texte: 'Couvrez ce sein que je ne saurais voir.',
        contexte:
          'Tartuffe à la servante Dorine, dont le décolleté l’embarrasse. *Tartuffe*, acte III, scène 2, 1664.',
        sens:
          'Le faux dévot se scandalise tout haut de ce qu’il regarde tout bas : un vers suffit à démonter l’hypocrisie.',
      },
      {
        texte: 'Il faut manger pour vivre, et non pas vivre pour manger.',
        contexte:
          'Valère flatte l’avarice d’Harpagon en citant « un mot des anciens ». *L’Avare*, acte III, scène 1, 1668.',
      },
      {
        texte:
          'Si l’emploi de la comédie est de corriger les vices des hommes, je ne vois pas par quelle raison il y en aura de privilégiés.',
        contexte:
          'Préface de *Tartuffe*, 1669, contre ceux qui ont fait interdire la pièce pendant cinq ans.',
        sens:
          'Sa défense tient en une ligne : si le théâtre corrige les défauts, aucun défaut ne peut se déclarer à l’abri — pas même l’hypocrisie qui se réclame de la religion.',
      },
      {
        texte: 'Que diable allait-il faire dans cette galère ?',
        contexte:
          'Géronte apprend que son fils est retenu sur un bateau turc. *Les Fourberies de Scapin*, acte II, scène 7, 1671.',
        sens:
          'La phrase est passée dans la langue : on la dit de quiconque s’est mis tout seul dans un mauvais pas.',
      },
    ],
    reperes: [
      'Jean-Baptiste Poquelin renonce à 21 ans à la charge de tapissier du roi pour monter une troupe.',
      'L’Illustre-Théâtre fait faillite en 1645 : il passe quelques jours en prison pour dettes.',
      'Treize ans de tournées en province (1645-1658) lui apprennent le métier et le public.',
      'Le 24 octobre 1658, il joue devant Louis XIV au Louvre : le roi lui donne une salle.',
      '*Tartuffe* est interdit cinq ans (1664-1669) ; *Dom Juan* est retiré après quinze représentations.',
      'Pris de malaise sur scène en jouant *Le Malade imaginaire*, il meurt le 17 février 1673.',
    ],
    recit: [
      {
        titre: 'Le fils du tapissier',
        texte:
          'Jean-Baptiste **Poquelin** est baptisé à Paris le 15 janvier **1622**. Son père est **tapissier ordinaire du roi** : une charge qui se transmet, une vie assurée, un logement près des Halles. Le garçon fait de bonnes études chez les jésuites au collège de Clermont, prend une licence en droit — puis, à vingt et un ans, **renonce à la charge** de son père. En 1643, il fonde avec la famille **Béjart** l’**Illustre-Théâtre**. La troupe joue dans un jeu de paume, ne remplit pas la salle, s’endette ; en 1645, les créanciers le font enfermer quelques jours au Châtelet. C’est à ce moment qu’il prend un nom de théâtre, **Molière**, et qu’il quitte Paris.',
      },
      {
        titre: 'Treize ans de routes',
        texte:
          'De 1645 à 1658, la troupe parcourt le Languedoc et la vallée du Rhône, protégée un temps par le **prince de Conti**. Molière y apprend tout : monter un spectacle, négocier avec les villes, tenir une salle, et surtout la **farce** — celle des Italiens de la *commedia dell’arte*, faite de coups de bâton, de valets rusés et de vieillards trompés. Il commence à écrire pour sa troupe. De retour à Paris, le **24 octobre 1658**, il joue devant Louis XIV au Louvre : la tragédie *Nicomède* laisse la cour froide, la petite farce qui suit, *Le Docteur amoureux*, emporte tout. Le roi lui accorde la salle du **Petit-Bourbon**, puis celle du **Palais-Royal** en 1661.',
      },
      {
        titre: 'Faire rire la cour de la cour',
        texte:
          'En quatorze ans, il écrit une trentaine de pièces et invente la **grande comédie** : cinq actes, en vers, avec le sérieux réservé jusque-là à la tragédie. *Les Précieuses ridicules* (1659) le lancent ; *L’École des femmes* (1662) déclenche une querelle qui dure deux ans. Il peint son siècle sans le quitter des yeux : les médecins qui parlent latin et laissent mourir (*Le Médecin malgré lui*), le bourgeois qui achète des manières de noble (*Le Bourgeois gentilhomme*, 1670, écrit avec la musique de **Lully** pour les fêtes de Chambord), l’avare, le misanthrope, les savantes. Louis XIV le protège, tient son fils sur les fonts baptismaux en 1664 et paie sa troupe : le roi se sert du théâtre comme d’un ornement du règne, et le comédien se sert du roi comme d’un bouclier.',
      },
      {
        titre: 'Tartuffe, ou le prix d’une pièce',
        texte:
          'En mai **1664**, pendant les fêtes des Plaisirs de l’Île enchantée à Versailles, Molière donne trois actes de *Tartuffe* : l’histoire d’un dévot de façade qui s’installe dans une famille, la ruine et manque d’en séduire la maîtresse. Le **parti dévot** — la compagnie du Saint-Sacrement, l’archevêque de Paris — obtient l’interdiction ; l’archevêque menace d’excommunication qui lirait ou verrait la pièce. Molière la réécrit deux fois, adresse **trois placets au roi**, attend **cinq ans**. Le **5 février 1669**, la pièce est enfin jouée : triomphe, la plus grosse recette de sa carrière. *Dom Juan* (1665) avait été retiré après quinze représentations. La leçon est double : la protection du roi a permis qu’on porte la critique jusqu’à l’hypocrisie religieuse — et elle s’est arrêtée là où l’Église commençait.',
      },
      {
        titre: 'La quatrième représentation',
        texte:
          'Le **17 février 1673**, Molière joue **Argan**, le faux malade du *Malade imaginaire*, pour la quatrième fois. Il est réellement malade depuis des mois. Pris d’une convulsion sur scène, il termine la pièce — la recette du jour fait vivre la troupe —, puis est ramené chez lui, rue de Richelieu, où il meurt quelques heures plus tard, à cinquante et un ans, sans avoir pu renoncer publiquement à son métier comme l’Église l’exigeait des comédiens. La sépulture religieuse lui est d’abord refusée ; sa veuve **Armande Béjart** s’adresse au roi, et il est enterré de nuit, le 21 février. En **1680**, Louis XIV fusionne les troupes parisiennes en une seule : la **Comédie-Française**, qu’on appelle encore « la maison de Molière ». Et le français est resté « la langue de Molière ».',
      },
    ],
    chrono: [
      { date: '1622', fait: 'Baptême à Paris, sous le nom de Jean-Baptiste Poquelin.' },
      { date: '1643', fait: 'Il fonde l’Illustre-Théâtre avec les Béjart.' },
      { date: '1645', fait: 'Faillite et prison pour dettes ; départ pour la province.' },
      { date: '24 octobre 1658', fait: 'Première devant Louis XIV, au Louvre.' },
      { date: '1659', fait: '*Les Précieuses ridicules* : premier grand succès parisien.' },
      { date: '1664', fait: '*Tartuffe* joué à Versailles, puis aussitôt interdit.' },
      { date: '1666', fait: '*Le Misanthrope*.' },
      { date: '1668', fait: '*L’Avare*.' },
      { date: '1669', fait: '*Tartuffe* enfin autorisé : triomphe.' },
      { date: '1670', fait: '*Le Bourgeois gentilhomme*, sur une musique de Lully.' },
      { date: '17 février 1673', fait: 'Mort après la quatrième du *Malade imaginaire*.' },
      { date: '1680', fait: 'Fondation de la Comédie-Française.' },
    ],
    leSaisTu:
      'Molière jouait un homme qui se croit malade quand il est tombé vraiment malade sur scène. Il a refusé d’interrompre : arrêter la représentation, c’était rendre l’argent des spectateurs et laisser sa troupe sans recette. Il a fini la pièce, puis il est mort dans la nuit. C’est de là que vient, dit-on, la superstition des comédiens contre la couleur verte.',
    aRetenir: [
      'Molière, de son vrai nom Jean-Baptiste Poquelin, vit de 1622 à 1673.',
      'Après treize ans de tournées en province, il joue devant Louis XIV en 1658 et devient le comédien du roi.',
      '*Tartuffe* (1664) est interdit cinq ans sous la pression du parti dévot, puis autorisé en 1669.',
      'Ses comédies peignent la société de son temps : faux dévots, médecins, avares, bourgeois qui se veulent nobles.',
      'Il meurt le 17 février 1673 après avoir joué *Le Malade imaginaire* ; la Comédie-Française naît en 1680.',
    ],
    mots: [
      {
        mot: 'Comédie-ballet',
        sens: 'Pièce mêlant théâtre, musique et danse, écrite pour les fêtes de la cour.',
      },
      {
        mot: 'Parti dévot',
        sens: 'Groupe de catholiques rigoristes, influents à la cour, hostiles au théâtre et aux mœurs du siècle.',
      },
      {
        mot: 'Farce',
        sens: 'Courte pièce comique héritée du Moyen Âge et des Italiens, fondée sur les coups et les quiproquos.',
      },
    ],
    lies: ['louis-xiv', 'colbert', 'versailles-et-la-cour'],
    niveaux: ['5e', '4e', '2de'],
    programme: 'Le théâtre du XVIIᵉ siècle et la société de cour',
    tags: [
      'Poquelin',
      'Tartuffe',
      'L’Avare',
      'Le Misanthrope',
      'Le Malade imaginaire',
      'comédie',
      'théâtre',
      'Comédie-Française',
      'Lully',
      'Le Bourgeois gentilhomme',
    ],
  },
  {
    id: 'colbert',
    volet: 'personnages',
    nom: 'Jean-Baptiste Colbert',
    surnom: 'l’homme qui compte',
    dates: '1619 – 1683',
    tri: 1683,
    periode: 'temps-modernes',
    emoji: '⚓',
    roles: [
      'Contrôleur général des finances',
      'Secrétaire d’État de la Marine',
      'Fondateur de l’Académie des sciences',
    ],
    origine: 'Reims, d’une famille de marchands drapiers',
    accroche:
      'Fils de marchand, il remet les comptes du royaume à l’endroit, couvre la France de manufactures et donne à Louis XIV une marine de guerre.',
    citations: [
      {
        texte:
          'Il faut épargner cinq sols aux choses non nécessaires, et jeter les millions quand il est question de votre gloire.',
        contexte: 'À Louis XIV, dans un mémoire sur les dépenses du roi, 1665.',
        sens:
          'Toute sa méthode : compter chaque pièce sur l’ordinaire, et ne plus rien compter quand la dépense sert le rang du royaume — Versailles, la marine, les académies.',
      },
      {
        texte:
          'Le commerce est une guerre perpétuelle et d’argent et d’industrie entre toutes les nations.',
        contexte: 'Mémoire au roi sur les finances, vers 1670.',
        sens:
          'L’or du monde est en quantité fixe, pense-t-il : ce qu’un pays gagne, un autre le perd. D’où les tarifs, les manufactures et les compagnies — vendre plus qu’on n’achète.',
      },
      {
        texte:
          'L’art d’imposer consiste à plumer l’oie pour obtenir le plus possible de plumes avec le moins possible de cris.',
        contexte:
          'Phrase que la postérité lui prête et qu’aucun de ses écrits ne contient ; elle dit bien ce que les contribuables de 1680 pensaient de lui.',
        incertaine: true,
      },
    ],
    reperes: [
      'Formé chez Mazarin, dont il gère la fortune, il remet au roi en 1661 le dossier qui perd le surintendant Fouquet.',
      'Contrôleur général des finances en 1665 : les recettes nettes du roi doublent en dix ans.',
      'Manufactures royales : les Gobelins (1662) pour les meubles, Saint-Gobain (1665) pour les glaces qu’on achetait à Venise.',
      'Marine : une vingtaine de vaisseaux en état en 1661, près de trois cents vingt ans plus tard.',
      'Il fonde l’Académie des sciences (1666) et l’Observatoire de Paris, et paie des pensions aux savants d’Europe.',
      'Canal du Midi (1666-1681) : 240 km creusés pour joindre l’Atlantique à la Méditerranée.',
    ],
    recit: [
      {
        titre: 'Le commis qui devient ministre',
        texte:
          'Jean-Baptiste Colbert naît à **Reims** en 1619, dans une famille de marchands drapiers : rien d’un grand seigneur. Il entre au service de **Mazarin**, dont il administre l’immense fortune, et se rend indispensable. À la mort du cardinal, en mars **1661**, il remet au jeune roi le dossier des malversations du surintendant **Fouquet** — arrêté à Nantes le 5 septembre. La **chambre de justice** réunie de 1661 à 1665 fait rendre gorge aux financiers : plus de cent millions de livres rentrent dans les caisses. Colbert ne sera jamais « principal ministre » : Louis XIV a décidé de n’en plus avoir. Il sera l’homme qui travaille — quinze heures par jour, des mémoires chiffrés sur tout, pendant vingt-deux ans.',
      },
      {
        titre: 'Remettre les comptes à l’endroit',
        texte:
          'Avant lui, le roi emprunte à des taux ruineux, les **traitants** avancent l’impôt et gardent la différence, et personne ne sait vraiment ce que l’État possède. Colbert dresse des **états annuels**, renégocie les rentes, poursuit les fermiers infidèles. Il allège la **taille**, l’impôt direct qui écrase les paysans, et reporte la charge sur les impôts indirects — les aides, la **gabelle** sur le sel —, ce qui lui vaudra une impopularité durable. Les recettes nettes du roi passent d’une trentaine de millions de livres à plus du double. Il fait relier pour Louis XIV un **carnet** que le roi garde sur lui, où figure l’état exact des finances : pour la première fois, un roi de France sait ce qu’il dépense.',
      },
      {
        titre: 'Le colbertisme',
        texte:
          'Sa doctrine, le **mercantilisme**, tient en une phrase : pour être riche, un royaume doit vendre à l’étranger plus qu’il ne lui achète. Il crée donc en France ce qu’on allait payer ailleurs. **Manufactures royales** : les **Gobelins** (1662) pour les meubles de la Couronne, **Saint-Gobain** (1665) pour les glaces, Beauvais et Aubusson pour les tapisseries, Abbeville pour les draps fins. Chaque étoffe doit respecter un **règlement** — nombre de fils, largeur, teinture — contrôlé par des inspecteurs : c’est l’ancêtre du label de qualité. **Tarifs douaniers** de 1664 puis de 1667, qui doublent les droits sur les produits hollandais et mènent à la guerre. **Compagnies de commerce** des Indes orientales et occidentales (1664), pour lesquelles il fait sortir de terre le port de **Lorient**, et une politique de peuplement du **Canada**, devenu province royale en 1663.',
      },
      {
        titre: 'La mer, et ce qu’elle coûte',
        texte:
          'La marine est son œuvre la plus visible. Il crée les arsenaux de **Toulon**, **Brest** et **Rochefort** — cette dernière ville bâtie de rien à partir de 1666 —, institue en 1668 l’**inscription maritime** qui recense les marins, et fait rédiger l’**ordonnance de la Marine** de 1681, le code maritime le plus complet d’Europe. L’**ordonnance des Eaux et Forêts** (1669) replante des chênes pour les vaisseaux d’un siècle plus tard : certaines de ces forêts sont encore debout. Le revers doit être dit : les **galères** de Marseille sont mues par des condamnés et par des hommes achetés comme esclaves, et les compagnies qu’il crée organisent les plantations des Antilles. Le **Code noir**, préparé par ses services, fixant en articles le statut des esclaves des colonies, sera signé en 1685, deux ans après sa mort.',
      },
      {
        titre: 'Les académies, puis la guerre',
        texte:
          'Colbert achète des cerveaux comme il achète des chênes. Il fonde l’**Académie des sciences** en **1666** et fait venir, à prix d’or, le Hollandais **Huygens** et l’Italien **Cassini** ; il bâtit l’**Observatoire de Paris** (1667), ouvre l’Académie de France à **Rome** et l’Académie royale d’architecture (1671), et distribue des pensions aux savants et aux écrivains de toute l’Europe. Il soutient le chantier fou de **Pierre-Paul Riquet** : le **canal du Midi**, 240 kilomètres, 328 ouvrages d’art, ouvert en 1681. Mais à partir de **1672**, la guerre de Hollande dévore tout ce qu’il a économisé, et **Louvois**, le ministre de la Guerre, l’emporte au Conseil. Il meurt le **6 septembre 1683**, épuisé et détesté pour ses impôts : on l’enterre de nuit à Saint-Eustache, de peur de la foule.',
      },
    ],
    chrono: [
      { date: '1619', fait: 'Naissance à Reims, dans une famille de marchands.' },
      { date: '1661', fait: 'Mort de Mazarin ; arrestation de Fouquet.' },
      { date: '1662', fait: 'Manufacture royale des Gobelins.' },
      { date: '1664', fait: 'Compagnies des Indes ; premier tarif douanier.' },
      { date: '1665', fait: 'Contrôleur général des finances ; manufacture de Saint-Gobain.' },
      { date: '1666', fait: 'Académie des sciences ; arsenal de Rochefort ; canal du Midi.' },
      { date: '1669', fait: 'Secrétaire d’État de la Marine ; ordonnance des Eaux et Forêts.' },
      { date: '1681', fait: 'Le canal du Midi est ouvert à la navigation.' },
      { date: '1683', fait: 'Mort à Paris, le 6 septembre.' },
    ],
    leSaisTu:
      'La France achetait ses miroirs à Venise, où le secret des glaces était gardé sous peine de mort. Colbert fit venir clandestinement des verriers vénitiens en 1665 ; la République envoya des agents à leurs trousses. Dix-neuf ans plus tard, les 357 glaces de la galerie des Glaces de Versailles étaient fabriquées en France : la démonstration valait tous les discours.',
    aRetenir: [
      'Colbert est contrôleur général des finances à partir de 1665 et secrétaire d’État de la Marine à partir de 1669.',
      'Le colbertisme, ou mercantilisme, veut que le royaume vende plus qu’il n’achète pour garder l’or chez lui.',
      'Il crée des manufactures royales (Gobelins 1662, Saint-Gobain 1665) et des compagnies de commerce (1664).',
      'Il dote la France d’une marine de guerre et fonde l’arsenal de Rochefort en 1666.',
      'Il fonde l’Académie des sciences en 1666 et soutient le canal du Midi, ouvert en 1681.',
    ],
    mots: [
      {
        mot: 'Mercantilisme',
        sens: 'Doctrine selon laquelle la richesse d’un État se mesure à l’or qu’il détient : il faut donc exporter plus qu’on n’importe.',
      },
      {
        mot: 'Manufacture royale',
        sens: 'Grand atelier privilégié par le roi, qui fabrique en France ce qu’on achetait à l’étranger.',
      },
      {
        mot: 'Taille',
        sens: 'Principal impôt direct du royaume, payé par les roturiers ; la noblesse et le clergé en sont exemptés.',
      },
    ],
    lies: ['louis-xiv', 'vauban', 'richelieu', 'traite-atlantique-et-code-noir'],
    niveaux: ['5e', '4e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'colbertisme',
      'mercantilisme',
      'manufactures',
      'Gobelins',
      'Saint-Gobain',
      'marine',
      'Rochefort',
      'canal du Midi',
      'Académie des sciences',
      'Fouquet',
      'finances',
    ],
  },
  {
    id: 'vauban',
    volet: 'personnages',
    nom: 'Vauban',
    surnom: 'l’ingénieur des frontières',
    dates: '1633 – 1707',
    tri: 1707,
    periode: 'temps-modernes',
    emoji: '🏰',
    roles: [
      'Ingénieur militaire',
      'Commissaire général des fortifications',
      'Maréchal de France',
    ],
    origine: 'Saint-Léger, dans le Morvan',
    accroche:
      'Il a dessiné la frontière de la France, conduit cinquante sièges, et fini sa vie en proposant au roi un impôt payé par tous, privilégiés compris.',
    citations: [
      {
        texte: 'Ville assiégée par Vauban, ville prise ; ville défendue par Vauban, ville imprenable.',
        qui: 'Dicton des armées de Louis XIV',
        contexte:
          'Ce qu’on disait de lui de son vivant, dans les camps comme à la cour : en cinquante sièges conduits, il n’a jamais échoué.',
      },
      {
        texte: 'Brûlons plus de poudre et versons moins de sang.',
        contexte:
          'Formule que la tradition militaire lui attribue et qui résume sa méthode : creuser, canonner, attendre — plutôt que lancer les hommes à l’assaut.',
        incertaine: true,
      },
      {
        texte:
          'C’est le bas peuple qui, par son travail et son commerce, et par ce qu’il paye au roi, enrichit le royaume ; c’est lui qui fournit tous les soldats et tous les matelots.',
        contexte:
          '*Projet d’une dîme royale*, 1707. Il a compté, village par village, ce que gagne et ce que paye un paysan.',
        sens:
          'Le raisonnement qui fonde sa réforme : puisque la richesse et la force du royaume viennent du travail du peuple, l’écraser d’impôts revient à ruiner le roi lui-même.',
      },
      {
        texte:
          'Le roi y a perdu cent mille habitants, soixante millions d’argent, neuf mille matelots et douze mille soldats aguerris, passés chez ses ennemis.',
        contexte:
          '*Mémoire pour le rappel des huguenots*, remis au roi en 1689, quatre ans après la révocation de l’édit de Nantes.',
        sens:
          'Il ne discute pas la foi du roi : il lui présente la facture, chiffre par chiffre. Personne d’autre n’osait la lui montrer.',
      },
    ],
    reperes: [
      'Petit noble pauvre du Morvan, il commence dans l’armée des princes révoltés avant de rallier le roi.',
      'Cinquante-trois ans de service, une cinquantaine de sièges conduits, trois cents places fortifiées ou réparées.',
      'Il généralise les tranchées parallèles (Maastricht, 1673) : on avance à couvert au lieu de monter à l’assaut.',
      'Le « pré carré » : deux lignes de forteresses au nord pour redresser la frontière du royaume.',
      'Maréchal de France en 1703 ; douze de ses sites sont aujourd’hui au patrimoine mondial de l’Unesco.',
      'Son dernier livre, la *Dîme royale* (1707), propose un impôt payé par tous : il est saisi sur ordre du Conseil.',
    ],
    recit: [
      {
        titre: 'Un cadet du Morvan',
        texte:
          'Sébastien Le Prestre de **Vauban** naît en **1633** à Saint-Léger, dans le Morvan, d’une noblesse si pauvre qu’elle travaille la terre. Orphelin tôt, il s’engage à dix-sept ans, pendant la **Fronde**, dans l’armée du prince de Condé — donc **contre le roi**. Capturé en 1653, il est remarqué par **Mazarin**, qui préfère le retourner que l’emprisonner. Il servira Louis XIV **cinquante-trois ans** sans interruption. Son métier n’est ni celui du courtisan ni celui du cavalier : il mesure, il dessine, il calcule des angles de tir et des épaisseurs de terre. On estime qu’il a parcouru à cheval, en carrosse et à pied, l’équivalent de plusieurs fois le tour de la Terre, d’un chantier à l’autre.',
      },
      {
        titre: 'Prendre une ville sans la broyer',
        texte:
          'Avant lui, un siège est un pari : ou l’on monte à l’assaut en perdant des milliers d’hommes, ou l’on bloque la place pendant des mois. Vauban en fait une **opération réglée**. Sa méthode des **tranchées parallèles**, employée à **Maastricht en 1673** devant le roi, creuse trois tranchées successives face au rempart, reliées par des boyaux en zigzag, qui amènent l’artillerie de plus en plus près à couvert ; puis le **tir à ricochet** (1688) balaie les remparts en faisant rebondir les boulets. Il annonce à l’avance le jour où la place tombera, et elle tombe ce jour-là. Il interdit les assauts inutiles : la poudre coûte moins cher que les hommes, et une garnison qui se rend avec les honneurs n’a pas besoin d’être massacrée. Maastricht est prise en **treize jours**.',
      },
      {
        titre: 'Le pré carré',
        texte:
          'En **1673**, il adresse à **Louvois** un mémoire décisif : la frontière du nord est une dentelle, des villes françaises enclavées en terre espagnole et l’inverse, impossible à défendre. Sa proposition : abandonner les places isolées, en garder **deux lignes continues**, et redresser le tracé — « faire le **pré carré** ». Le roi le suit. Vauban construit ou refait trois cents places : la **citadelle de Lille** (1667-1670), Maubeuge, Longwy, Belfort, Besançon, Briançon, Mont-Dauphin, Mont-Louis, Villefranche-de-Conflent, Saint-Martin-de-Ré, Blaye, Camaret. Sa dernière et plus parfaite, **Neuf-Brisach** (1698), est un octogone tracé sur une plaine nue, comme une figure de géométrie. La forme de la France sur une carte d’aujourd’hui lui doit ses bords du nord et de l’est ; douze de ses sites sont classés au **patrimoine mondial** depuis 2008.',
      },
      {
        titre: 'L’homme qui écrit au roi ce que personne ne dit',
        texte:
          'À force de traverser le royaume, Vauban a vu les villages. Dans ses *Oisivetés* — douze volumes de mémoires sur les colonies, la navigation, l’élevage, le retour des protestants —, il chiffre tout ce qu’il observe. En **1689**, son *Mémoire pour le rappel des huguenots* dit au roi que la **révocation de l’édit de Nantes** lui a coûté des dizaines de milliers de sujets, des marins, des officiers et beaucoup d’argent, partis grossir les forces de ses ennemis. En **1707**, il publie le *Projet d’une **dîme royale*** : supprimer l’enchevêtrement de la taille, des aides et de la gabelle, et le remplacer par **un impôt unique, proportionnel au revenu, payé par tout le monde — noblesse et clergé compris**. Le livre paraît sans privilège du roi ; le Conseil en ordonne la **saisie** en février. Vauban meurt le **30 mars 1707**, à soixante-treize ans.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Il laisse des villes qui tiennent encore debout, une frontière, et une idée. Car l’impôt payé par tous, refusé en 1707, est exactement ce que réclameront les **cahiers de doléances de 1789** : le privilège fiscal de la noblesse et du clergé est le nœud que la monarchie n’a jamais su trancher, et que la Révolution tranchera d’un coup, dans la **nuit du 4 août 1789**. Un maréchal de France l’avait proposé quatre-vingt-deux ans plus tôt, calculs à l’appui, et on avait saisi son livre.',
      },
    ],
    chrono: [
      { date: '1633', fait: 'Naissance à Saint-Léger, dans le Morvan.' },
      { date: '1653', fait: 'Capturé chez les révoltés, il passe au service du roi.' },
      { date: '1667-1670', fait: 'Citadelle de Lille, « la reine des citadelles ».' },
      { date: '1673', fait: 'Siège de Maastricht ; mémoire sur le « pré carré ».' },
      { date: '1678', fait: 'Commissaire général des fortifications.' },
      { date: '1689', fait: '*Mémoire pour le rappel des huguenots*.' },
      { date: '1698', fait: 'Neuf-Brisach, sa place la plus achevée.' },
      { date: '1703', fait: 'Maréchal de France.' },
      { date: '1707', fait: 'La *Dîme royale* est saisie ; il meurt le 30 mars.' },
    ],
    leSaisTu:
      'Vauban avait demandé que son cœur reste au pays. Il repose au château de Bazoches, dans le Morvan — sauf son cœur, que Napoléon a fait transporter en 1808 aux Invalides, à Paris, où il est déposé dans une urne. L’empereur estimait que l’ingénieur qui avait tracé les frontières du pays y avait sa place.',
    aRetenir: [
      'Vauban (1633-1707) est l’ingénieur militaire de Louis XIV et devient maréchal de France en 1703.',
      'Il fortifie ou construit trois cents places et conduit une cinquantaine de sièges, sans jamais échouer.',
      'Sa méthode des tranchées parallèles permet de prendre une ville en perdant moins d’hommes.',
      'Le « pré carré » est la double ligne de forteresses qui redresse la frontière du nord du royaume.',
      'Dans le *Projet d’une dîme royale* (1707), il propose un impôt payé par tous, privilégiés compris : le livre est saisi.',
    ],
    mots: [
      {
        mot: 'Bastion',
        sens: 'Ouvrage en pointe avançant hors du rempart, d’où l’on tire sur ceux qui attaquent le mur voisin.',
      },
      {
        mot: 'Siège',
        sens: 'Opération qui consiste à encercler une place forte et à la réduire jusqu’à ce qu’elle se rende.',
      },
      {
        mot: 'Privilège',
        sens: 'Droit particulier attaché à un ordre ou à une ville — ici, l’exemption d’impôt de la noblesse et du clergé.',
      },
    ],
    lies: ['louis-xiv', 'colbert', 'revocation-de-l-edit-de-nantes', 'crise-financiere-de-la-monarchie'],
    niveaux: ['5e', '4e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'fortifications',
      'citadelle',
      'pré carré',
      'Neuf-Brisach',
      'Lille',
      'siège',
      'dîme royale',
      'impôt',
      'Louvois',
      'maréchal',
      'Morvan',
    ],
  },
  {
    id: 'louis-xiv',
    volet: 'personnages',
    nom: 'Louis XIV',
    surnom: 'le Roi-Soleil',
    dates: '1638 – 1715',
    tri: 1715,
    periode: 'temps-modernes',
    emoji: '☀️',
    roles: ['Roi de France et de Navarre', 'Souverain absolu', 'Bâtisseur de Versailles'],
    origine: 'Saint-Germain-en-Laye',
    accroche:
      'Roi à quatre ans, il gouverne seul pendant cinquante-quatre ans, fait de Versailles le centre du royaume et laisse un État qui lui survit.',
    citations: [
      {
        texte: 'Je m’en vais, mais l’État demeurera toujours.',
        contexte: 'À ses courtisans en larmes, dans les derniers jours d’août 1715, à Versailles.',
        sens:
          'C’est l’inverse de la phrase qu’on lui prête : le roi passe, l’État reste. Il a passé sa vie à bâtir le second pour qu’il ne dépende plus du premier.',
      },
      {
        texte: 'L’État, c’est moi.',
        contexte:
          'Phrase prêtée au roi devant le Parlement de Paris en 1655, qu’aucun témoin du temps n’a rapportée et qui n’apparaît qu’un siècle et demi plus tard.',
        sens:
          'Elle résume ce que ses adversaires voyaient dans son règne, pas ce qu’il disait. Ses propres *Mémoires* parlent d’un roi qui doit compte à Dieu de l’État qu’il a reçu.',
        incertaine: true,
      },
      {
        texte:
          'Ne m’imitez pas dans le goût que j’ai eu pour les bâtiments, ni dans celui que j’ai eu pour la guerre ; soulagez vos peuples le plus tôt que vous pourrez.',
        contexte:
          'À son arrière-petit-fils, le futur Louis XV, âgé de cinq ans, quelques jours avant sa mort, en août 1715.',
        sens:
          'Le bilan qu’il fait lui-même de son règne : deux regrets — les chantiers et les guerres — et une consigne, alléger la charge du peuple.',
      },
      {
        texte: 'J’ai failli attendre.',
        contexte:
          'Mot qu’on lui prête devant un carrosse arrivé juste à l’heure ; aucune source de son temps ne le contient.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi à quatre ans en 1643 ; sa mère Anne d’Autriche et Mazarin gouvernent dix-huit ans.',
      'La Fronde (1648-1653) chasse deux fois la cour de Paris : il n’oubliera ni les grands ni la capitale.',
      'À la mort de Mazarin, en 1661, il annonce qu’il gouvernera seul : plus jamais de principal ministre.',
      'La cour et le gouvernement s’installent à Versailles le 6 mai 1682.',
      'Révocation de l’édit de Nantes en 1685 : environ 200 000 protestants quittent le royaume.',
      'Soixante-douze ans de règne, dont cinquante-quatre de gouvernement personnel.',
    ],
    recit: [
      {
        titre: 'L’enfant que la Fronde a formé',
        texte:
          'Louis naît le **5 septembre 1638**, après vingt-trois ans de mariage sans enfant : on l’appelle **Louis-Dieudonné**, « donné par Dieu ». Il a quatre ans quand son père meurt, en 1643. **Anne d’Autriche** et le cardinal **Mazarin** gouvernent. Puis vient la **Fronde** (1648-1653) : les parlementaires d’abord, les princes ensuite, les barricades, la cour qui fuit Paris de nuit en janvier 1649 et couche sur la paille à Saint-Germain. Dans la nuit du **9 au 10 février 1651**, la foule parisienne entre au Palais-Royal pour vérifier que le petit roi n’a pas quitté la ville, et défile devant son lit pendant qu’il fait semblant de dormir. Il a douze ans. Il en tire deux leçons qu’il n’abandonnera jamais : les grands ne doivent plus jamais avoir d’armées, et le roi ne vivra pas dans Paris. Il est sacré à **Reims** le 7 juin 1654.',
      },
      {
        titre: '1661 : le roi gouverne',
        texte:
          'Mazarin meurt le **9 mars 1661**. Le lendemain matin, Louis, vingt-deux ans, réunit ses ministres et leur annonce qu’il n’y aura plus de principal ministre, qu’ils travailleront désormais avec lui et ne signeront rien sans son ordre. La cour n’y croit pas ; il tiendra parole **cinquante-quatre ans**, six à huit heures de travail par jour. Il gouverne par **conseils** restreints — le Conseil d’en haut ne compte que trois à cinq hommes, aucun prince du sang —, et choisit ses ministres hors de la haute noblesse : **Colbert**, fils de marchand, **Le Tellier** et son fils **Louvois** pour la guerre. Dans les provinces, une trentaine d’**intendants** révocables portent la volonté du roi. Les grandes **ordonnances** — civile (1667), criminelle (1670), du commerce (1673), de la marine (1681) — donnent au royaume un droit écrit, le même partout : les codes de Napoléon s’en souviendront.',
      },
      {
        titre: 'Versailles, un instrument de gouvernement',
        texte:
          'Le petit rendez-vous de chasse de Louis XIII devient le siège de la monarchie. **Le Vau** puis **Hardouin-Mansart** bâtissent, **Le Nôtre** dessine les jardins, **Le Brun** peint les plafonds ; jusqu’à trente-six mille hommes travaillent sur le chantier. La **galerie des Glaces** (1678-1684) aligne sur soixante-treize mètres trois cent cinquante-sept glaces, toutes fabriquées en France. Le **6 mai 1682**, la cour et le gouvernement s’y installent. Ce n’est pas un caprice : la noblesse qui avait pris les armes pendant la Fronde vit désormais **sous le regard du roi**, et se dispute l’honneur de lui tendre sa chemise. L’**étiquette** est une échelle où la seule monnaie est la faveur du souverain. Autour du palais, le règne organise les arts : académies de danse (1661), des sciences (1666), d’architecture (1671), l’Opéra (1669), des pensions à Racine, Boileau, Lully, Molière. Le français devient la langue des cours d’Europe.',
      },
      {
        titre: 'Les frontières, et le prix des guerres',
        texte:
          'Quatre grandes guerres : la **Dévolution** (1667-1668), la **Hollande** (1672-1678), la **Ligue d’Augsbourg** (1688-1697), la **Succession d’Espagne** (1701-1714). Trente-trois des cinquante-quatre années de gouvernement personnel sont des années de guerre. Le royaume y gagne **Lille**, la **Franche-Comté**, l’**Alsace** et **Strasbourg** (1681), que les places de **Vauban** viennent verrouiller : la France prend à peu près la forme qu’on lui connaît. Mais la dernière guerre manque tout emporter. Toute l’Europe est coalisée ; après **Malplaquet** (1709), la route de Paris est ouverte. L’**hiver de 1709** achève le pays : la Seine gèle, les semences pourrissent, la famine tue des centaines de milliers de personnes. Le roi envoie sa **vaisselle d’or à la fonte** et, en juin 1709, écrit aux gouverneurs de provinces une lettre où il **explique sa guerre à ses sujets** — jamais un roi de France ne s’était justifié ainsi. **Villars** sauve le royaume à **Denain**, le 24 juillet 1712. À **Utrecht** (1713), son petit-fils garde le trône d’Espagne mais renonce à celui de France.',
      },
      {
        titre: 'Une seule foi : la révocation de 1685',
        texte:
          '« Un roi, une loi, une foi » : pour le XVIIᵉ siècle, l’unité du royaume est d’abord religieuse, et l’**édit de Nantes** de 1598 n’avait été présenté que comme provisoire. À partir de 1679, on presse les conversions : amendes, temples fermés, puis les **dragonnades** — des soldats logés de force chez les familles protestantes jusqu’à l’abjuration. Le **18 octobre 1685**, l’édit de Fontainebleau **révoque l’édit de Nantes** : temples démolis, pasteurs bannis en quinze jours, enfants baptisés catholiques, émigration interdite. Environ **200 000 protestants partent quand même** — vers la Hollande, l’Angleterre, le Brandebourg, Genève, le Cap —, emportant leurs métiers, leurs capitaux et leur rancune ; l’électeur de Brandebourg les accueille par un édit resté célèbre. Sur le moment, la France applaudit presque unanimement : Bossuet, Madame de Sévigné, La Bruyère. Deux hommes disent au roi qu’il s’est trompé : **Vauban**, chiffres en main dès 1689, et Saint-Simon dans ses écrits. Dans les Cévennes, les **camisards** se soulèvent en 1702 et tiennent deux ans.',
      },
      {
        titre: 'La fin, et ce qui reste',
        texte:
          'Entre 1711 et 1714, la mort emporte son fils, son petit-fils, la femme de celui-ci et leur aîné : l’héritier n’est plus qu’un arrière-petit-fils de cinq ans. Atteint de la gangrène, Louis XIV meurt à Versailles le **1er septembre 1715**, quatre jours avant ses soixante-dix-sept ans, après **soixante-douze ans de règne** — le plus long de l’histoire d’Europe. Le convoi funèbre est hué sur la route de Saint-Denis : le pays est épuisé, l’État doit environ deux milliards de livres. Mais ce qu’il laisse est considérable : une administration d’intendants et de comptes, un droit écrit, une armée de trois cent mille hommes, une marine, des académies, des frontières fortifiées, une langue et un art que l’Europe copiera pendant un siècle. La machine bâtie en 1661 tournera encore soixante-quatorze ans.',
      },
    ],
    chrono: [
      { date: '1638', fait: 'Naissance à Saint-Germain-en-Laye.' },
      { date: '1643', fait: 'Roi à quatre ans ; régence d’Anne d’Autriche et de Mazarin.' },
      { date: '1648-1653', fait: 'La Fronde : la cour doit fuir Paris par deux fois.' },
      { date: '1654', fait: 'Sacre à Reims, le 7 juin.' },
      { date: '1661', fait: 'Mort de Mazarin : il gouverne seul ; chute de Fouquet.' },
      { date: '6 mai 1682', fait: 'La cour et le gouvernement s’installent à Versailles.' },
      { date: '18 octobre 1685', fait: 'Révocation de l’édit de Nantes.' },
      { date: '1701-1714', fait: 'Guerre de Succession d’Espagne.' },
      { date: '1709', fait: 'Le grand hiver : famine dans tout le royaume.' },
      { date: '1712', fait: 'Victoire de Villars à Denain : le royaume est sauvé.' },
      { date: '1er septembre 1715', fait: 'Mort à Versailles, après 72 ans de règne.' },
    ],
    leSaisTu:
      'L’hiver de 1709 fut si terrible que le vin gelait dans les verres sur la table du roi, à Versailles, et que les oliviers moururent en Provence. Louis XIV fit porter sa vaisselle d’or à la Monnaie pour qu’on la fonde, mangea dans de la faïence et fit servir du pain d’orge à sa table, pour que la cour cesse d’acheter le blé qui manquait au peuple.',
    aRetenir: [
      'Louis XIV règne de 1643 à 1715, soit 72 ans, et gouverne personnellement à partir de 1661.',
      'Il ne nomme aucun principal ministre et s’appuie sur des intendants révocables : c’est la monarchie absolue.',
      'La cour s’installe à Versailles en 1682 ; l’étiquette y tient la noblesse sous le regard du roi.',
      'Colbert développe le commerce et la marine, Vauban fortifie les frontières, Louvois réorganise l’armée.',
      'La révocation de l’édit de Nantes, en 1685, chasse environ 200 000 protestants du royaume.',
      'Les guerres, surtout celle de Succession d’Espagne (1701-1714), épuisent les finances du royaume.',
    ],
    mots: [
      {
        mot: 'Monarchie absolue',
        sens: 'Régime où le roi détient tous les pouvoirs et n’en répond que devant Dieu — ce qui ne veut pas dire sans lois ni coutumes.',
      },
      {
        mot: 'Étiquette',
        sens: 'Règles très précises qui fixent la place et les gestes de chacun à la cour, du lever du roi à son coucher.',
      },
      {
        mot: 'Dragonnade',
        sens: 'Logement forcé de soldats chez des familles protestantes pour les contraindre à se convertir.',
      },
      {
        mot: 'Mécénat',
        sens: 'Soutien financier donné par le roi aux artistes et aux savants, en échange de la gloire qu’ils lui rendent.',
      },
    ],
    lies: [
      'versailles-et-la-cour',
      'la-fronde',
      'revocation-de-l-edit-de-nantes',
      'colbert',
      'vauban',
      'moliere',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'Roi-Soleil',
      'Versailles',
      'monarchie absolue',
      'Fronde',
      'Mazarin',
      'galerie des Glaces',
      'édit de Fontainebleau',
      'dragonnades',
      'Louvois',
      'Denain',
      'étiquette',
      'Louis le Grand',
    ],
  },
]
