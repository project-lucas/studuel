// -----------------------------------------------------------------------------
// LES SAINTS DE FRANCE — sept fiches qui traversent quinze siècles : l'évêque
// qui baptise Clovis, le prêtre qui invente l'action sociale, le savant qui
// écrit les *Pensées*, le curé de campagne, la bergère de Lourdes, la carmélite
// de vingt-quatre ans et l'ermite du Hoggar.
//
// Elles ne sont pas rangées par période mais par famille : chacune porte la
// sienne (`moyen-age`, `temps-modernes`, `xixe`) et se glissera au bon endroit
// de la frise. Le ton est celui du § 3 de `docs/encyclopedie.md` : leur foi est
// prise au sérieux comme MOTEUR de leurs actes, on écrit ce qu'ils ont fondé et
// tenu, et ce qui est rapporté est donné pour ce qu'il est — rapporté, examiné,
// daté. Ni ironie, ni prêche.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_SAINTS_DE_FRANCE: Personnage[] = [
  {
    id: 'saint-remi',
    volet: 'personnages',
    nom: 'Saint Remi',
    surnom: 'l’évêque qui baptisa Clovis',
    dates: 'vers 437 – 533',
    tri: 533,
    periode: 'moyen-age',
    emoji: '🕊️',
    roles: ['Évêque de Reims', 'Saint', 'Apôtre des Francs'],
    origine: 'Cerny-en-Laonnois, Gaule romaine',
    accroche:
      'Il baptise Clovis à Reims et fait du roi des Francs le seul souverain catholique d’Occident : le royaume de France naît dans ce baptistère.',
    citations: [
      {
        texte:
          'Courbe la tête, fier Sicambre : adore ce que tu as brûlé, brûle ce que tu as adoré.',
        contexte:
          'Au baptistère de Reims, à Clovis, avant de le plonger dans l’eau. Rapporté par Grégoire de Tours vers 575.',
        sens:
          'Renonce aux dieux de tes pères et honore le Dieu des chrétiens que tu combattais. « Sicambre » est le nom d’une tribu franque.',
      },
      {
        texte:
          'Tu dois avoir des égards pour tes évêques et recourir toujours à leurs conseils. Si tu t’entends bien avec eux, ta province ne s’en portera que mieux.',
        contexte: 'Lettre au jeune roi Clovis, vers 481, à son avènement. Le texte est conservé.',
        sens:
          'Remi propose au chef franc une alliance : les évêques tiennent les villes, l’administration et les écoles ; sans eux, on ne gouverne pas la Gaule.',
      },
      {
        texte: 'Si tu me donnes la victoire, je croirai en toi et je me ferai baptiser en ton nom.',
        qui: 'Clovis, pendant la bataille de Tolbiac',
        contexte: 'Rapporté par Grégoire de Tours, *Histoire des Francs*, vers 575.',
      },
    ],
    reperes: [
      'Élu évêque de Reims vers 22 ans, il tient le siège plus de soixante-dix ans.',
      'Il écrit au roi franc Clovis dès son avènement, vers 481, pour lui offrir l’appui de l’Église.',
      'Il baptise Clovis à Reims, traditionnellement le 25 décembre 496, avec environ 3 000 guerriers.',
      'Clovis devient le seul roi germanique catholique : les autres sont ariens.',
      'La légende de la Sainte Ampoule, écrite au IXᵉ siècle, fait de Reims la ville du sacre.',
      'Fêté le 1ᵉʳ octobre ; l’abbaye Saint-Remi de Reims abrite son tombeau.',
    ],
    recit: [
      {
        titre: 'Un évêque à vingt-deux ans',
        texte:
          'Remi naît vers **437** dans une famille de l’aristocratie **gallo-romaine**, du côté de Laon. L’Empire romain d’Occident agonise : il disparaît en 476, quand Remi a une quarantaine d’années. Dans ce vide, les **évêques** restent les seuls à savoir administrer une cité — ils tiennent les archives, les greniers, les écoles, les hôpitaux, rachètent les prisonniers et négocient avec les chefs barbares. Vers **459**, les habitants de **Reims** élisent Remi évêque ; il a vingt-deux ans, et il occupera le siège pendant plus de soixante-dix ans, jusqu’à sa mort en **533**. Aucun autre évêque de France n’a duré aussi longtemps.',
      },
      {
        titre: 'La lettre au jeune roi',
        texte:
          'Vers **481**, un adolescent de quinze ans, **Clovis**, hérite du petit royaume franc de Tournai. Remi lui écrit aussitôt — la lettre est conservée. Il ne le flatte pas : il lui dit de se montrer juste, de protéger les veuves et les orphelins, de ne rien prendre par la force, et surtout de prendre conseil de ses évêques. Le calcul est limpide des deux côtés. Clovis est **païen** et son royaume tient en un canton ; l’Église catholique, elle, couvre toute la Gaule, parle latin et sait gouverner. Quinze ans plus tard, cette alliance aura fait de Clovis le maître d’un pays qui va des Pyrénées au Rhin.',
      },
      {
        titre: 'Le baptême de Reims',
        texte:
          'La reine **Clotilde**, burgonde et catholique, pousse son mari depuis des années. La bascule, selon Grégoire de Tours, se joue à la bataille de **Tolbiac** contre les Alamans : l’armée franque plie, Clovis promet de croire au Dieu de Clotilde s’il l’emporte — et l’emporte. Le baptême a lieu à **Reims**, traditionnellement le **jour de Noël 496** (les historiens hésitent entre 496 et 508). Grégoire décrit les rues tendues d’étoffes, l’église parfumée de cierges, et **3 000 guerriers** baptisés derrière leur chef. La phrase de Remi — « Courbe la tête, fier Sicambre » — est restée. Ce qui compte pour la suite : les autres rois germaniques sont **ariens**, c’est-à-dire hérétiques aux yeux de Rome. Clovis, lui, devient d’un coup le champion de l’Église et le seul roi que les évêques, les villes et l’aristocratie gallo-romaine peuvent servir sans se renier. C’est ce baptême, plus que ses batailles, qui fonde le royaume des Francs.',
      },
      {
        titre: 'La Sainte Ampoule et les rois de France',
        texte:
          'Quatre siècles plus tard, l’archevêque **Hincmar** de Reims écrit une *Vie de saint Remi* où il ajoute un détail promis à une longue carrière : le saint chrême serait arrivé du ciel, porté par une **colombe**, dans une petite fiole — la **Sainte Ampoule**. Le récit est tardif et on le sait ; il n’empêche qu’il fait de Reims la ville du **sacre**. De Louis le Pieux à Charles X, vingt-cinq rois de France y sont couronnés et oints de ce baume. En **1793**, un conventionnel brise l’ampoule en public sur la place de Reims ; deux hommes en ramassent les éclats, et ce qu’ils sauvent suffira au dernier sacre, celui de **1825**.',
      },
    ],
    chrono: [
      { date: 'vers 437', fait: 'Naissance dans une famille gallo-romaine, près de Laon.' },
      { date: 'vers 459', fait: 'Élu évêque de Reims à vingt-deux ans.' },
      { date: 'vers 481', fait: 'Lettre au jeune roi Clovis, à son avènement.' },
      { date: 'vers 496', fait: 'Baptême de Clovis à Reims, le jour de Noël.' },
      { date: '533', fait: 'Mort à Reims, après plus de 70 ans d’épiscopat.' },
      { date: 'vers 878', fait: 'Hincmar raconte la colombe et la Sainte Ampoule.' },
      { date: '1793', fait: 'La Sainte Ampoule est brisée à Reims ; des éclats sont sauvés.' },
      { date: '1825', fait: 'Sacre de Charles X, le dernier roi sacré à Reims.' },
    ],
    leSaisTu:
      'Le testament de saint Remi existe encore. Il y lègue ses vignes, affranchit ses esclaves un par un en les nommant, et maudit d’avance quiconque volerait les biens des pauvres de son église. C’est l’un des très rares documents privés qui nous soient parvenus de la Gaule du VIᵉ siècle.',
    aRetenir: [
      'Remi est évêque de Reims pendant plus de soixante-dix ans, de 459 environ à 533.',
      'Il baptise Clovis à Reims, traditionnellement à Noël 496, avec environ 3 000 guerriers francs.',
      'Clovis devient le seul roi germanique catholique : les évêques et l’aristocratie gallo-romaine le soutiennent.',
      'La légende de la Sainte Ampoule, écrite par Hincmar au IXᵉ siècle, fait de Reims la ville du sacre.',
      'Vingt-cinq rois de France sont sacrés à Reims, de Louis le Pieux à Charles X en 1825.',
    ],
    mots: [
      {
        mot: 'Chrême',
        sens: 'Huile parfumée consacrée par l’évêque, dont on oint le baptisé et, plus tard, le roi au sacre.',
      },
      {
        mot: 'Arianisme',
        sens: 'Doctrine chrétienne qui refuse de reconnaître le Christ égal à Dieu ; Wisigoths et Burgondes la suivent, pas les Francs.',
      },
      {
        mot: 'Sainte Ampoule',
        sens: 'La fiole de chrême conservée à Reims, dont on oignait les rois de France le jour de leur sacre.',
      },
    ],
    lies: ['clovis', 'bapteme-de-clovis', 'sainte-genevieve', 'charles-x'],
    niveaux: ['5e'],
    programme: 'La christianisation de la Gaule et les débuts du royaume franc',
    tags: [
      'Remi',
      'Reims',
      'Clovis',
      'baptême',
      'Sainte Ampoule',
      'sacre',
      'Clotilde',
      'Tolbiac',
      'Sicambre',
      'Francs',
    ],
  },
  {
    id: 'saint-vincent-de-paul',
    volet: 'personnages',
    nom: 'Saint Vincent de Paul',
    surnom: 'monsieur Vincent',
    dates: '1581 – 1660',
    tri: 1660,
    periode: 'temps-modernes',
    emoji: '🤲',
    roles: ['Prêtre', 'Fondateur d’œuvres', 'Aumônier des galères'],
    origine: 'Pouy, près de Dax, dans les Landes',
    accroche:
      'Un fils de paysan landais qui organise la charité comme on organise une armée : des confréries, des sœurs sans clôture, et les enfants abandonnés de Paris sauvés.',
    citations: [
      {
        texte: 'Il ne suffit pas de faire le bien, il faut le bien faire.',
        contexte: 'Aux Filles de la Charité, dans ses conférences, vers 1650.',
        sens:
          'La bonne intention ne suffit pas : il faut des règles, des comptes, des horaires et des gens formés. C’est là que naît l’action sociale organisée.',
      },
      {
        texte: 'Les pauvres sont nos maîtres et nos seigneurs.',
        contexte: 'Formule qu’il répète aux prêtres de la Mission et aux Dames de la Charité.',
        sens:
          'Renversement complet de la société d’ordres : celui qu’on sert n’est pas un obligé qu’on secourt de haut, c’est un maître à qui l’on doit des égards.',
      },
      {
        texte:
          'Elles auront pour monastère la maison des malades, pour cellule une chambre de louage, pour chapelle l’église paroissiale, pour cloître les rues de la ville.',
        contexte: 'Règle donnée aux Filles de la Charité, fondées en 1633 avec Louise de Marillac.',
        sens:
          'Jusque-là, une religieuse vivait enfermée. Vincent invente des sœurs qui sortent, marchent, soignent à domicile — l’ancêtre de l’infirmière.',
      },
      {
        texte:
          'Vous avez été leurs mères selon la grâce depuis que leurs mères selon la nature les ont abandonnés. Leur vie et leur mort sont entre vos mains.',
        contexte:
          'Aux Dames de la Charité qui hésitaient à financer l’œuvre des enfants trouvés, Paris, 1647.',
        sens: 'Elles votèrent la poursuite de l’œuvre le jour même.',
      },
    ],
    reperes: [
      'Fils de paysans des Landes, il garde les bêtes avant d’être ordonné prêtre à dix-neuf ans.',
      'En 1617, à Folleville puis à Châtillon, il fonde les premières Confréries de la Charité.',
      'Aumônier général des galères du roi à partir de 1619.',
      'Il fonde la Congrégation de la Mission (les lazaristes) en 1625.',
      'Avec Louise de Marillac, il fonde les Filles de la Charité en 1633.',
      'À partir de 1638, il arrache les enfants trouvés de Paris à une mort quasi certaine.',
    ],
    recit: [
      {
        titre: 'Le fils du paysan landais',
        texte:
          'Vincent naît en **1581** à Pouy, près de Dax, quatrième de six enfants dans une famille de laboureurs. Il garde les bêtes, puis son père le met aux études : un fils prêtre, c’est une famille qui monte. Il est ordonné à **dix-neuf ans**, âge anormalement bas même pour l’époque, et court pendant quinze ans après un bon **bénéfice** — une cure grasse, une abbaye, de quoi assurer les siens. Il raconte aussi avoir été capturé par des pirates et vendu comme esclave à **Tunis** entre 1605 et 1607 ; deux lettres le disent, les historiens en discutent encore. Ce qui est sûr, c’est qu’aux alentours de 1610 l’ambitieux disparaît, et que le reste de sa vie prend une direction opposée.',
      },
      {
        titre: 'Deux jours de 1617',
        texte:
          'Le **25 janvier 1617**, à **Folleville**, un paysan mourant se confesse à lui ; Vincent comprend que des villages entiers vivent sans rien savoir de ce qu’on leur prêche en latin. Il commence à prêcher des **missions** dans les campagnes. Sept mois plus tard, à **Châtillon-les-Dombes**, il signale en chaire une famille malade et sans pain : tout le village y court le jour même, les bras chargés — et plus personne n’y retourne les jours suivants. « J’ai vu, dit-il en substance, une grande charité, mais mal réglée. » Il réunit alors les femmes du bourg et écrit un **règlement** : qui visite, quel jour, avec quoi, qui tient la caisse, qui contrôle. C’est la première **Confrérie de la Charité** — et, en France, l’acte de naissance de l’action sociale organisée.',
      },
      {
        titre: 'Des religieuses dans la rue',
        texte:
          'Les dames de la noblesse paient et s’émeuvent, mais ne lavent pas les plaies. Vincent fait alors venir des filles de la campagne, solides, et les confie à **Louise de Marillac**, veuve et remarquable organisatrice. En **1633** naissent les **Filles de la Charité**. Elles ne sont pas des religieuses au sens du droit de l’époque : pas de clôture, pas de vœux perpétuels, pas de grille — sinon elles seraient enfermées et ne pourraient plus soigner personne. Elles prennent en charge les malades à domicile, les hôpitaux, les écoles de pauvres, les prisonniers, les galériens. À la mort de Vincent, elles tiennent plus de quarante maisons ; aujourd’hui la congrégation est présente dans quelque quatre-vingt-dix pays.',
      },
      {
        titre: 'Les enfants de la Couche',
        texte:
          'Paris abandonne trois à quatre cents nourrissons par an. On les dépose à **la Couche**, une maison de la rue Saint-Landry où deux servantes les entassent : on les endort à l’eau-de-vie, on les vend vingt sous à qui en veut pour mendier avec, presque aucun n’atteint son premier anniversaire. En **1638**, Vincent en fait sortir douze, tirés au sort. Puis toute la maison. Il faut des nourrices, des maisons, de l’argent — beaucoup d’argent — et en **1647** les Dames de la Charité, épuisées, veulent renoncer. Il leur fait le discours resté célèbre : « Leur vie et leur mort sont entre vos mains. » Elles continuent. C’est le premier service d’**enfants trouvés** durable du royaume.',
      },
      {
        titre: 'Les galères, la Lorraine, le Conseil du roi',
        texte:
          'Aumônier général des **galères** en 1619, il descend dans les cales où les condamnés rament enchaînés, obtient qu’on les soigne, fait ouvrir un hôpital pour eux à Marseille. Quand la **guerre de Trente Ans** ravage la **Lorraine** — villages brûlés, peste, famine —, il y envoie ses missionnaires et lève en France environ **1,6 million de livres** de secours : une opération humanitaire au sens moderne, avec des convois, des comptes et des rapports. Entré au **Conseil de conscience** de la régente **Anne d’Autriche** en 1643, il pèse sur le choix des évêques, refuse de flatter Mazarin et lui demande en pleine **Fronde** de se retirer pour donner la paix au royaume. Il y perd sa place ; il ne s’en plaint pas.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Vincent meurt le **27 septembre 1660**, dans son fauteuil de Saint-Lazare, à soixante-dix-neuf ans. Il est **canonisé en 1737**, et **Léon XIII** le proclame en 1885 patron de toutes les œuvres charitables. Son nom devient un modèle : en **1833**, un étudiant de vingt ans, **Frédéric Ozanam**, fonde la Société de Saint-Vincent-de-Paul pour porter secours aux familles ouvrières de Paris ; elle existe toujours dans plus de cent cinquante pays. Ce qu’il a inventé tient en une idée simple et rare : la compassion ne vaut que si elle s’organise — un règlement, une caisse, des comptes, des gens formés et des visites qui reviennent la semaine suivante.',
      },
    ],
    chrono: [
      { date: '1581', fait: 'Naissance à Pouy, près de Dax, dans une famille de paysans.' },
      { date: '1600', fait: 'Ordonné prêtre à dix-neuf ans.' },
      { date: '1617', fait: 'Folleville et Châtillon : la mission et la première Charité.' },
      { date: '1619', fait: 'Aumônier général des galères du roi.' },
      { date: '1625', fait: 'Fondation de la Congrégation de la Mission, les lazaristes.' },
      { date: '1633', fait: 'Les Filles de la Charité, avec Louise de Marillac.' },
      { date: '1638', fait: 'Il recueille les premiers enfants trouvés de Paris.' },
      { date: '1643', fait: 'Entrée au Conseil de conscience d’Anne d’Autriche.' },
      { date: '1660', fait: 'Mort à Saint-Lazare, le 27 septembre.' },
      { date: '1737', fait: 'Canonisation par le pape Clément XII.' },
      { date: '1833', fait: 'Ozanam fonde la Société de Saint-Vincent-de-Paul.' },
    ],
    leSaisTu:
      'Le village où il est né s’appelait Pouy. Il s’appelle aujourd’hui Saint-Vincent-de-Paul, dans les Landes. Le chêne creux où l’enfant s’abritait en gardant les bêtes y est toujours debout, entouré d’une grille.',
    aRetenir: [
      'Vincent de Paul (1581-1660) est un prêtre landais qui organise la charité en France au XVIIᵉ siècle.',
      'En 1617, à Folleville puis à Châtillon, il fonde les premières Confréries de la Charité.',
      'Il crée la Congrégation de la Mission en 1625 et, avec Louise de Marillac, les Filles de la Charité en 1633.',
      'Les Filles de la Charité sont les premières religieuses sans clôture : elles soignent dans la rue et à domicile.',
      'À partir de 1638, il sauve les enfants trouvés de Paris ; il est canonisé en 1737.',
    ],
    mots: [
      {
        mot: 'Confrérie de la Charité',
        sens: 'Association de laïcs, surtout des femmes, organisée par un règlement écrit pour nourrir et soigner les pauvres d’une paroisse.',
      },
      {
        mot: 'Enfant trouvé',
        sens: 'Nourrisson abandonné, recueilli par une œuvre charitable puis, plus tard, par l’assistance publique.',
      },
      {
        mot: 'Galérien',
        sens: 'Condamné qui rame, enchaîné à son banc, sur les galères du roi.',
      },
    ],
    lies: ['louis-xiv', 'richelieu', 'blaise-pascal', 'la-fronde', 'abbe-pierre'],
    niveaux: ['5e', '2de'],
    programme: 'L’affirmation de l’État dans le royaume de France',
    tags: [
      'monsieur Vincent',
      'lazaristes',
      'Filles de la Charité',
      'Louise de Marillac',
      'enfants trouvés',
      'galères',
      'charité',
      'Landes',
      'Folleville',
      'Ozanam',
    ],
  },
  {
    id: 'blaise-pascal',
    volet: 'personnages',
    nom: 'Blaise Pascal',
    surnom: 'le roseau pensant',
    dates: '1623 – 1662',
    tri: 1662,
    periode: 'temps-modernes',
    emoji: '🧮',
    roles: ['Mathématicien', 'Physicien', 'Écrivain', 'Inventeur'],
    origine: 'Clermont, en Auvergne',
    accroche:
      'À seize ans un théorème, à dix-neuf une machine à calculer, à trente-neuf les Pensées — et, entre les deux, le premier transport en commun du monde.',
    citations: [
      {
        texte: 'Le cœur a ses raisons que la raison ne connaît point.',
        contexte: '*Pensées*, publiées en 1670, huit ans après sa mort.',
        sens:
          'Il y a une façon de connaître — par l’intuition, l’amour, la foi — que le raisonnement ne produit pas et ne peut pas réfuter. Dit par le plus rigoureux des géomètres.',
      },
      {
        texte:
          'L’homme n’est qu’un roseau, le plus faible de la nature, mais c’est un roseau pensant.',
        contexte: '*Pensées*, fragment sur la grandeur et la misère de l’homme.',
        sens:
          'Une goutte d’eau suffit à le tuer, et pourtant il sait qu’il meurt : cette conscience fait toute sa dignité.',
      },
      {
        texte:
          'Pesons le gain et la perte, en prenant croix que Dieu est. Si vous gagnez, vous gagnez tout ; si vous perdez, vous ne perdez rien.',
        contexte: 'Le « pari », *Pensées*, fragment « Infini rien ».',
        sens:
          'Le mathématicien des probabilités applique son calcul à la foi : face à une infinité à gagner, parier que Dieu existe est le choix raisonnable.',
      },
      {
        texte:
          'Je n’ai fait celle-ci plus longue que parce que je n’ai pas eu le loisir de la faire plus courte.',
        contexte: '*Les Provinciales*, seizième lettre, 4 décembre 1656.',
        sens: 'Écrire court coûte du temps : la concision est un travail, pas un don.',
      },
    ],
    reperes: [
      'Élevé par son père, sans école ; à seize ans il écrit son *Essai pour les coniques*.',
      'De 1642 à 1645, il construit la « pascaline », une machine à additionner.',
      'Le 19 septembre 1648, l’expérience du Puy de Dôme prouve que l’air a un poids.',
      'En 1654, avec Fermat, il fonde le calcul des probabilités.',
      'En 1662, il lance à Paris les carrosses à cinq sols, premier transport en commun.',
      'Mort à trente-neuf ans ; les *Pensées* paraissent en 1670.',
    ],
    recit: [
      {
        titre: 'L’enfant de Clermont',
        texte:
          'Blaise naît à **Clermont** en 1623 ; sa mère meurt quand il a trois ans. Son père **Étienne**, magistrat et bon mathématicien, décide de l’instruire lui-même et l’installe à Paris. Il lui interdit les mathématiques avant quinze ans, pour qu’il apprenne d’abord les langues — sa sœur **Gilberte** raconte que l’enfant, à douze ans, retrouve seul les premières propositions d’Euclide en traçant des figures au charbon. À **seize ans**, il écrit l’*Essai pour les coniques*, une page où tient un théorème qui porte son nom et qui ouvre la **géométrie projective** : celle qui étudie ce qui ne change pas dans une figure quand on la projette — l’ancêtre du dessin en perspective, des cartes et, aujourd’hui, de l’image de synthèse. Descartes, dit-on, ne voulut pas croire qu’un garçon de cet âge en fût l’auteur.',
      },
      {
        titre: 'La machine à calculer',
        texte:
          'En 1639, Étienne Pascal est nommé à **Rouen** pour lever l’impôt en Normandie. Des nuits entières d’additions en livres, sous et deniers. Son fils, dix-neuf ans, entreprend de lui épargner ce travail et met **trois ans** à y parvenir : roues dentées, report automatique des retenues par un cliquet tombant, boîtier de laiton. La **pascaline** additionne et soustrait. Une cinquantaine d’exemplaires sont construits, neuf existent encore. Elle est trop chère pour se vendre — le prix d’une petite maison — mais elle est la première machine à calculer réellement diffusée, et le principe du report mécanique servira jusqu’aux caisses enregistreuses du XXᵉ siècle. Pascal obtient en 1649 un privilège royal qui est, en pratique, l’un des premiers brevets français.',
      },
      {
        titre: 'Le vide, et le poids de l’air',
        texte:
          'Toute la science héritée d’Aristote répétait que « la nature a horreur du vide ». En 1646, à Rouen, Pascal refait l’expérience de **Torricelli** : un tube de verre rempli de mercure, retourné dans une cuve, et en haut du tube un espace qui ne contient rien. Il imagine alors l’expérience décisive : si c’est le **poids de l’air** qui soutient la colonne, elle doit baisser en altitude. Le **19 septembre 1648**, son beau-frère Florin Périer porte le tube au sommet du **Puy de Dôme**, à 1 465 mètres : le mercure descend de plus de huit centimètres, et remonte au retour. La démonstration est nette. Pascal en tire les lois de l’hydrostatique — une pression exercée sur un liquide se transmet également dans toutes les directions, c’est le principe du vérin et du frein hydraulique. L’unité internationale de pression s’appelle aujourd’hui le **pascal**.',
      },
      {
        titre: 'Le hasard devient une science',
        texte:
          'En **1654**, un joueur, le chevalier de Méré, lui soumet un vieux casse-tête : deux joueurs interrompent une partie avant la fin, comment partager équitablement les mises ? Pascal échange sur ce « **problème des partis** » une série de lettres avec **Pierre de Fermat**, et ils inventent ensemble ce qu’il appelle la « géométrie du hasard » : le **calcul des probabilités**. Ce qui semblait un jeu de salon devient l’outil des assurances, de la démographie, de la physique des gaz, des sondages et de tout ce qui se décide aujourd’hui sous incertitude. Pascal y ajoute son triangle arithmétique, dont chaque nombre est la somme des deux du dessus.',
      },
      {
        titre: 'La nuit de feu et les Pensées',
        texte:
          'Le **23 novembre 1654**, entre dix heures et demie du soir et minuit et demi, Pascal vit une expérience qu’il note aussitôt sur un papier commençant par un seul mot : « **FEU** ». Il le recopie sur parchemin et le coud dans la doublure de ses habits ; on ne le découvre qu’à sa mort. Proche de **Port-Royal** et des **jansénistes**, il prend leur défense dans les dix-huit lettres des *Provinciales* (1656-1657), qui attaquent la morale accommodante de certains jésuites : l’ironie y est si juste que le livre est condamné, brûlé — et devient un modèle de prose française. Il travaille ensuite à une grande *Apologie de la religion chrétienne* qu’il n’achèvera pas : ce sont les mille fragments des ***Pensées***, où l’on trouve le **pari**, le roseau pensant, et cette phrase d’un homme qui avait mesuré le vide : « Le silence éternel de ces espaces infinis m’effraie. »',
      },
      {
        titre: 'Les carrosses à cinq sols',
        texte:
          'Dernière idée, et la plus inattendue. Avec le duc de Roannez, Pascal obtient le **19 janvier 1662** des lettres patentes pour une entreprise de voitures publiques. Le **18 mars 1662**, la première ligne part de la porte Saint-Antoine vers le Luxembourg. Le principe est exactement celui d’un bus : un **itinéraire fixe**, des **horaires fixes**, un **prix fixe** de **cinq sols**, et le carrosse part à l’heure, plein ou vide. Cinq lignes fonctionnent dès l’été. Pascal destine sa part des bénéfices aux pauvres de Blois. Il meurt cinq mois plus tard, le **19 août 1662**, à trente-neuf ans, épuisé par des douleurs qui ne l’avaient plus quitté depuis ses dix-huit ans. Les carrosses, réservés peu à peu aux gens de qualité, disparaissent vers 1677 : il faudra attendre l’omnibus de 1828 pour que Paris retrouve son idée.',
      },
    ],
    chrono: [
      { date: '1623', fait: 'Naissance à Clermont, en Auvergne.' },
      { date: '1640', fait: '*Essai pour les coniques*, à seize ans.' },
      { date: '1642', fait: 'Premiers plans de la machine à calculer.' },
      { date: '19 septembre 1648', fait: 'Expérience du Puy de Dôme : l’air pèse.' },
      { date: '1654', fait: 'Avec Fermat, naissance du calcul des probabilités.' },
      { date: '23 novembre 1654', fait: 'La « nuit de feu » ; il coud le Mémorial dans ses habits.' },
      { date: '1656', fait: 'Première des dix-huit *Provinciales*.' },
      { date: '18 mars 1662', fait: 'Première ligne de carrosses à cinq sols, à Paris.' },
      { date: '19 août 1662', fait: 'Mort à Paris, à trente-neuf ans.' },
      { date: '1670', fait: 'Publication des *Pensées*.' },
    ],
    leSaisTu:
      'À sa mort, un domestique sent une épaisseur dans la doublure d’un pourpoint. Il y trouve un parchemin plié, recopié d’un papier plus ancien : le récit de la nuit du 23 novembre 1654, qui commence par le mot « FEU ». Pascal l’avait recousu dans chaque habit qu’il portait, pendant huit ans, sans en parler à personne.',
    aRetenir: [
      'Blaise Pascal (1623-1662) est à la fois mathématicien, physicien, inventeur et écrivain.',
      'À seize ans il fonde la géométrie projective ; à dix-neuf il construit la machine à calculer.',
      'L’expérience du Puy de Dôme, le 19 septembre 1648, prouve que l’air a un poids : l’unité de pression est le pascal.',
      'Avec Fermat, en 1654, il invente le calcul des probabilités.',
      'En 1662 il lance les carrosses à cinq sols, premier transport en commun de Paris et du monde.',
      'Les *Pensées*, publiées en 1670, contiennent le pari et « Le cœur a ses raisons… ».',
    ],
    mots: [
      {
        mot: 'Pression atmosphérique',
        sens: 'Le poids de la colonne d’air posée sur un point ; elle se mesure aujourd’hui en pascals.',
      },
      {
        mot: 'Probabilité',
        sens: 'Mesure chiffrée de la chance qu’un événement se produise, entre 0 et 1.',
      },
      {
        mot: 'Jansénisme',
        sens: 'Courant chrétien exigeant, né autour de l’abbaye de Port-Royal, en conflit avec les jésuites et avec le roi.',
      },
    ],
    lies: ['descartes', 'galilee', 'isaac-newton', 'saint-vincent-de-paul', 'louis-xiv'],
    niveaux: ['2de', '1re'],
    programme: 'Science et société aux XVIIᵉ et XVIIIᵉ siècles',
    tags: [
      'pascaline',
      'Puy de Dôme',
      'Pensées',
      'pari de Pascal',
      'Provinciales',
      'probabilités',
      'Port-Royal',
      'roseau pensant',
      'carrosses à cinq sols',
      'Clermont-Ferrand',
      'Fermat',
    ],
  },
  {
    id: 'jean-marie-vianney',
    volet: 'personnages',
    nom: 'Jean-Marie Vianney',
    surnom: 'le curé d’Ars',
    dates: '1786 – 1859',
    tri: 1859,
    periode: 'xixe',
    emoji: '⛪',
    roles: ['Curé de campagne', 'Saint', 'Patron des curés'],
    origine: 'Dardilly, près de Lyon',
    accroche:
      'Curé d’un village de deux cent trente âmes, il y attire quatre-vingt mille pèlerins par an et passe jusqu’à seize heures par jour au confessionnal.',
    citations: [
      {
        texte: 'Je le regarde et il me regarde.',
        qui: 'Un paysan d’Ars, rapporté par le curé',
        contexte:
          'Réponse du vieil homme à qui Vianney demandait ce qu’il disait à Dieu, seul dans l’église.',
        sens:
          'La plus courte définition de la prière qu’ait donnée le XIXᵉ siècle français : pas de formule, une présence. Vianney la répétait partout.',
      },
      {
        texte:
          'Il n’y a pas beaucoup d’amour de Dieu dans cette paroisse : vous l’y mettrez.',
        qui: 'Le vicaire général de Lyon',
        contexte: 'En envoyant Vianney à Ars, en février 1818.',
      },
      {
        texte: 'Laissez une paroisse vingt ans sans prêtre : on y adorera les bêtes.',
        contexte: 'À ses confrères, sur le métier de curé.',
        sens:
          'Formule qu’il employait pour dire que la foi ne se transmet pas toute seule : elle tient à quelqu’un qui reste sur place.',
      },
      {
        texte: 'Le sacerdoce, c’est l’amour du cœur de Jésus.',
        contexte: 'Dans un sermon sur le sacerdoce, à Ars.',
      },
    ],
    reperes: [
      'Né en 1786 : enfant, il connaît l’Église clandestine de la Révolution.',
      'Il n’entre à l’école qu’à vingt ans et échoue au séminaire, où tout se dit en latin.',
      'Ordonné prêtre en 1815, il est envoyé en 1818 à Ars, village de 230 habitants.',
      'Il fonde en 1824 La Providence, école et refuge gratuits pour les filles pauvres.',
      'Vers 1855, environ 80 000 pèlerins viennent à Ars dans l’année.',
      'Canonisé en 1925, proclamé patron des curés en 1929.',
    ],
    recit: [
      {
        titre: 'Un enfant de la Révolution',
        texte:
          'Jean-Marie naît à **Dardilly**, près de Lyon, en **1786** — trois ans avant la prise de la Bastille. Son enfance se passe dans une Église interdite : les prêtres qui refusent de prêter serment se cachent, les messes se disent la nuit dans des granges. Il fait sa **première communion** vers treize ans, dans une grange de Écully, pendant qu’une charrette de foin masque la fenêtre. Il garde les moutons, ne va pas à l’école, et n’apprend à lire sérieusement qu’à **vingt ans**, chez l’abbé Balley. Le **latin** est un supplice : renvoyé du grand séminaire de Lyon, il n’est ordonné prêtre qu’en **1815**, à Grenoble, parce que la Révolution a vidé les presbytères et qu’un évêque juge que sa droiture vaut mieux que ses notes.',
      },
      {
        titre: 'Ars, deux cent trente habitants',
        texte:
          'En février **1818**, on l’envoie à **Ars-sur-Formans**, un hameau de la Dombes perdu dans la boue, deux cent trente habitants, une église délabrée, quatre cabarets et personne à la messe. « Il n’y a pas beaucoup d’amour de Dieu dans cette paroisse : vous l’y mettrez », lui dit le vicaire général. Sa méthode tient en trois choses : il reste, il visite toutes les maisons une par une, et il s’applique à lui-même ce qu’il ne demande à personne — il dort deux ou trois heures sur le sol, mange des pommes de terre cuites pour la semaine, donne ses meubles. En **1824**, il fonde **La Providence** : une maison où l’on instruit et nourrit gratuitement les filles orphelines du pays ; elles y seront jusqu’à soixante.',
      },
      {
        titre: 'Seize heures par jour dans un confessionnal',
        texte:
          'À partir de **1827**, des inconnus commencent à venir. Dix ans plus tard, c’est un flot. Dans les années 1850, on compte jusqu’à **quatre-vingt mille pèlerins par an** dans un village de deux cent trente âmes : paysans, ouvrières, bourgeois, évêques, curieux et journalistes. Vianney entre dans son **confessionnal** vers une heure du matin et y reste, l’hiver sans chauffage, **onze à seize heures** par jour, pendant trente ans. Il tente **trois fois** de s’enfuir pour finir sa vie dans un monastère ; trois fois les paroissiens le rattrapent sur la route et le ramènent. Son prêche est court, sa voix faible ; ce qui frappe les témoins, c’est qu’il semble connaître les gens avant qu’ils aient parlé.',
      },
      {
        titre: '« Je le regarde et il me regarde »',
        texte:
          'Le mot le plus célèbre d’Ars n’est pas de lui. Intrigué par un vieux paysan qui restait chaque jour immobile au fond de l’église sans remuer les lèvres, Vianney lui demanda ce qu’il faisait là. « **Je le regarde et il me regarde** », répondit l’homme, dans le parler du pays. Le curé répéta cette phrase toute sa vie : c’était, disait-il, toute la prière. Le reste de son enseignement est de la même eau — des images courtes, tirées de la ferme, sans un mot de théologie savante. C’est précisément ce qui fait de lui, dans une France qui sort de la Révolution et discute de la place de l’Église, le modèle du **curé de campagne** pour tout le clergé du siècle.',
      },
      {
        titre: 'Ce qui reste d’un village de la Dombes',
        texte:
          'Il meurt à Ars le **4 août 1859**, à soixante-treize ans, après quarante et un ans de présence dans le même village. Deux évêques et trois cents prêtres suivent son enterrement. **Pie XI** le béatifie en 1905, le **canonise en 1925** — la même année que Thérèse de Lisieux — et le proclame en **1929 patron des curés**, c’est-à-dire modèle officiel de tous les prêtres de paroisse du monde. Ars, qui n’aurait jamais dû figurer sur une carte, reçoit encore aujourd’hui plusieurs centaines de milliers de visiteurs par an, et son minuscule presbytère est resté meublé comme il l’a laissé.',
      },
    ],
    chrono: [
      { date: '8 mai 1786', fait: 'Naissance à Dardilly, près de Lyon.' },
      { date: 'vers 1799', fait: 'Première communion clandestine, en pleine Révolution.' },
      { date: '13 août 1815', fait: 'Ordonné prêtre à Grenoble.' },
      { date: 'février 1818', fait: 'Nommé curé d’Ars, village de 230 habitants.' },
      { date: '1824', fait: 'Il fonde La Providence, école gratuite pour filles pauvres.' },
      { date: 'vers 1827', fait: 'Les premiers pèlerins arrivent à Ars.' },
      { date: 'vers 1855', fait: 'Environ 80 000 pèlerins dans l’année.' },
      { date: '4 août 1859', fait: 'Mort à Ars, à soixante-treize ans.' },
      { date: '1925', fait: 'Canonisation par le pape Pie XI.' },
      { date: '1929', fait: 'Proclamé patron des curés.' },
    ],
    leSaisTu:
      'La compagnie des chemins de fer finit par ouvrir à Lyon un guichet « Ars » et par vendre des billets aller-retour valables huit jours : c’était le temps qu’il fallait faire la queue pour atteindre le confessionnal d’un curé de campagne.',
    aRetenir: [
      'Jean-Marie Vianney (1786-1859) est le curé d’Ars, un village de 230 habitants de la Dombes.',
      'Élève tardif et mauvais latiniste, il est ordonné prêtre en 1815, quand la Révolution a vidé les presbytères.',
      'Il fonde en 1824 La Providence, école et refuge gratuits pour les filles pauvres.',
      'Vers 1855, environ 80 000 pèlerins par an viennent se confesser à lui.',
      'Canonisé en 1925, il est proclamé patron des curés en 1929.',
    ],
    mots: [
      {
        mot: 'Confession',
        sens: 'Sacrement où le chrétien avoue ses fautes à un prêtre, qui lui donne le pardon de Dieu.',
      },
      {
        mot: 'Presbytère',
        sens: 'La maison du curé, à côté de l’église du village.',
      },
      {
        mot: 'Pèlerinage',
        sens: 'Voyage entrepris pour prier dans un lieu tenu pour saint.',
      },
    ],
    lies: [
      'bernadette-soubirous',
      'sainte-therese-de-lisieux',
      'charles-de-foucauld',
      'concordat-de-1801',
      'loi-de-separation-1905',
    ],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'curé d’Ars',
      'Ars-sur-Formans',
      'Dardilly',
      'confessionnal',
      'pèlerinage',
      'La Providence',
      'Dombes',
      'patron des curés',
    ],
  },
  {
    id: 'bernadette-soubirous',
    volet: 'personnages',
    nom: 'Bernadette Soubirous',
    surnom: 'la voyante de Lourdes',
    dates: '1844 – 1879',
    tri: 1879,
    periode: 'xixe',
    emoji: '💧',
    roles: ['Sainte', 'Religieuse', 'Fille de meunier ruiné'],
    origine: 'Lourdes, Hautes-Pyrénées',
    accroche:
      'À quatorze ans, une fille pauvre de Lourdes dit avoir vu dix-huit fois une Dame dans une grotte — et fait naître le premier pèlerinage de France.',
    citations: [
      {
        texte:
          'Je ne vous promets pas de vous rendre heureuse en ce monde, mais en l’autre.',
        qui: 'La Dame, selon Bernadette',
        contexte: 'Troisième apparition, à la grotte de Massabielle, le 18 février 1858.',
        sens:
          'La phrase frappa les enquêteurs : on aurait attendu d’une enfant misérable qu’elle rapporte une promesse de bonheur immédiat.',
      },
      {
        texte: 'Que soy era Immaculada Councepciou.',
        qui: 'La Dame, selon Bernadette',
        contexte: 'Seizième apparition, le 25 mars 1858, en patois bigourdan.',
        sens:
          '« Je suis l’Immaculée Conception. » Bernadette répéta la phrase tout le long du chemin pour ne pas l’oublier : elle ne savait pas ce qu’elle voulait dire.',
      },
      {
        texte: 'Je suis chargée de vous le dire, non de vous le faire croire.',
        contexte: 'Réponse rapportée par les témoins, à ceux qui refusaient de la croire.',
      },
      {
        texte: 'Elle m’a regardée comme une personne qui parle à une autre personne.',
        contexte: 'Bernadette décrivant la Dame aux enquêteurs, en 1858.',
      },
    ],
    reperes: [
      'Sa famille ruinée vit à six dans « le cachot », une ancienne prison de seize mètres carrés.',
      'Asthmatique, illettrée, elle ne parle que le patois bigourdan à quatorze ans.',
      'Dix-huit apparitions à la grotte de Massabielle, du 11 février au 16 juillet 1858.',
      'Le 25 février 1858, elle creuse le sol de la grotte : une source apparaît.',
      'L’Église enquête quatre ans avant de reconnaître les apparitions, le 18 janvier 1862.',
      'Religieuse à Nevers à partir de 1866, elle meurt à trente-cinq ans en 1879.',
    ],
    recit: [
      {
        titre: 'Le cachot',
        texte:
          'Bernadette naît à **Lourdes** en 1844, au moulin de Boly. Son père perd le moulin, puis le travail ; en 1857 la famille s’installe dans **« le cachot »**, une ancienne cellule de prison de seize mètres carrés que la ville ne loue plus à personne parce qu’elle est jugée insalubre. Ils y vivent à six. Bernadette a le **choléra** à onze ans et en garde un asthme qui ne la quittera pas. Elle est placée à la ferme, ne va pas à l’école, ne sait ni lire ni écrire, ne parle que le **patois bigourdan** — pas le français — et, à quatorze ans, n’a pas encore fait sa première communion parce qu’elle ne retient pas le catéchisme.',
      },
      {
        titre: '11 février 1858 : du bois mort',
        texte:
          'Ce jeudi-là, elle va ramasser du bois avec sa sœur et une voisine du côté de **Massabielle**, une grotte à ordures au bord du Gave. En traversant le ruisseau, elle entend un coup de vent et voit, dans le creux du rocher, ce qu’elle appelle d’abord **« aquerò »** — « cela » : une jeune fille en robe blanche, ceinture bleue, une rose jaune sur chaque pied, un chapelet au bras. Suivent **dix-huit apparitions**, du 11 février au 16 juillet. La Dame ne dit rien pendant les trois premières. Elle demande ensuite qu’on vienne là en procession et qu’on y bâtisse une chapelle, et elle répète une consigne que Bernadette rapporte sans la comprendre : « Pénitence. »',
      },
      {
        titre: 'La source, la foule et la police',
        texte:
          'Le **25 février**, devant plusieurs centaines de personnes, Bernadette gratte le sol de la grotte, se barbouille de boue et mâche des herbes ; la foule rit et se retire, persuadée d’avoir affaire à une folle. Le lendemain, un filet d’eau coule à l’endroit gratté. La **source** donne aujourd’hui près de 120 000 litres par jour. La foule enfle : ils sont **huit mille** le 4 mars. Les autorités du Second Empire s’alarment. Le commissaire **Jacomet** interroge l’adolescente, le procureur la menace, le préfet fait clôturer la grotte de planches au mois de juin. Elle est rouverte le **4 octobre 1858**, sur ordre de **Napoléon III** lui-même.',
      },
      {
        titre: 'Une phrase en patois',
        texte:
          'Le **25 mars 1858**, Bernadette demande pour la quatrième fois son nom à la Dame. La réponse arrive en bigourdan : « **Que soy era Immaculada Councepciou** » — « Je suis l’Immaculée Conception ». L’enfant ne comprend pas la formule ; elle la répète tout le long du chemin pour ne pas la perdre et la livre telle quelle au curé **Peyramale**, qui en reste sans voix. Ce n’est pas un nom mais une définition théologique : le pape **Pie IX** avait fait de l’Immaculée Conception un **dogme** quatre ans plus tôt, le 8 décembre 1854. Que la phrase soit sortie de la bouche d’une illettrée de quatorze ans est l’argument qui pèse le plus lourd dans l’enquête qui va suivre.',
      },
      {
        titre: 'Quatre ans d’enquête',
        texte:
          'L’Église ne croit pas sur parole : elle se méfie des visions, qui foisonnent au XIXᵉ siècle. Dès le **28 juillet 1858**, l’évêque de Tarbes, **Mgr Laurence**, nomme une commission de théologiens et de **médecins** chargée d’interroger Bernadette, de vérifier sa santé mentale, de contrôler la composition de l’eau et d’examiner les guérisons annoncées. Elle travaille **quatre ans**. Le **18 janvier 1862**, l’évêque publie son jugement : les apparitions sont reconnues. En **1883**, un **bureau des constatations médicales** est installé à Lourdes ; tout médecin, croyant ou non, peut y examiner les dossiers. Sur plusieurs milliers de guérisons déclarées depuis, **soixante-dix** seulement ont été reconnues inexpliquées par ce bureau puis proclamées miracles par l’Église.',
      },
      {
        titre: 'Nevers, et la ville qui est née',
        texte:
          'Bernadette refuse l’argent qu’on lui propose et fuit la célébrité. En **1866**, à vingt-deux ans, elle entre chez les **sœurs de la Charité de Nevers** sous le nom de sœur Marie-Bernard ; elle ne reverra jamais Lourdes. Infirmière puis sacristine, minée par une tuberculose osseuse, elle meurt le **16 avril 1879**, à **trente-cinq ans**. Elle est **canonisée en 1933** — non pour avoir vu, mais pour la manière dont elle a vécu ensuite. Le village de quatre mille habitants qu’elle a quitté est devenu la deuxième ville hôtelière de France : environ **six millions de visiteurs par an**, des trains entiers de malades, des piscines, des hôpitaux d’accueil et des milliers de brancardiers bénévoles.',
      },
    ],
    chrono: [
      { date: '7 janvier 1844', fait: 'Naissance à Lourdes, au moulin de Boly.' },
      { date: '1857', fait: 'La famille ruinée s’installe au « cachot ».' },
      { date: '11 février 1858', fait: 'Première apparition à la grotte de Massabielle.' },
      { date: '25 février 1858', fait: 'Elle creuse le sol : la source apparaît.' },
      { date: '25 mars 1858', fait: '« Que soy era Immaculada Councepciou. »' },
      { date: '16 juillet 1858', fait: 'Dix-huitième et dernière apparition.' },
      { date: '4 octobre 1858', fait: 'Napoléon III fait rouvrir la grotte.' },
      { date: '18 janvier 1862', fait: 'L’évêque de Tarbes reconnaît les apparitions.' },
      { date: '1866', fait: 'Elle entre au couvent de Nevers et ne revient jamais.' },
      { date: '16 avril 1879', fait: 'Mort à Nevers, à trente-cinq ans.' },
      { date: '1883', fait: 'Création du bureau des constatations médicales.' },
      { date: '1933', fait: 'Canonisation par le pape Pie XI.' },
    ],
    leSaisTu:
      'À Nevers, la supérieure lui demanda un jour devant les autres sœurs ce qu’on fait d’un balai quand on a fini de s’en servir. « On le met derrière la porte. — C’est ce que vous êtes », dit la supérieure. Bernadette répondit que c’était exactement cela, et retourna à son travail.',
    aRetenir: [
      'Bernadette Soubirous (1844-1879) est une fille pauvre de Lourdes, illettrée et de langue bigourdane.',
      'Elle rapporte dix-huit apparitions à la grotte de Massabielle, du 11 février au 16 juillet 1858.',
      'Le 25 mars 1858, la Dame se nomme « l’Immaculée Conception », dogme proclamé par Pie IX en 1854.',
      'Après quatre ans d’enquête, l’évêque de Tarbes reconnaît les apparitions le 18 janvier 1862.',
      'Lourdes devient le premier pèlerinage de France ; un bureau médical y examine les guérisons depuis 1883.',
    ],
    mots: [
      {
        mot: 'Apparition',
        sens: 'Manifestation, rapportée par un témoin, d’un personnage saint ou céleste.',
      },
      {
        mot: 'Immaculée Conception',
        sens: 'Croyance catholique selon laquelle Marie a été préservée du péché dès sa conception ; l’Église en fait un dogme en 1854.',
      },
      {
        mot: 'Bigourdan',
        sens: 'Le parler occitan de Lourdes et du Bigorre ; c’était la seule langue de Bernadette.',
      },
    ],
    lies: [
      'jean-marie-vianney',
      'sainte-therese-de-lisieux',
      'charles-de-foucauld',
      'napoleon-iii',
    ],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'Lourdes',
      'Massabielle',
      'apparitions',
      'grotte',
      'source',
      'Immaculée Conception',
      'Nevers',
      'pèlerinage',
      'Pyrénées',
      'bigourdan',
    ],
  },
  {
    id: 'sainte-therese-de-lisieux',
    volet: 'personnages',
    nom: 'Sainte Thérèse de Lisieux',
    surnom: 'la petite Thérèse',
    dates: '1873 – 1897',
    tri: 1897,
    periode: 'xixe',
    emoji: '🌹',
    roles: ['Carmélite', 'Écrivain', 'Docteur de l’Église'],
    origine: 'Alençon, Normandie',
    accroche:
      'Entrée au Carmel à quinze ans, morte à vingt-quatre, elle invente la « petite voie » et devient patronne des missions sans avoir quitté son couvent.',
    citations: [
      {
        texte: 'Je veux passer mon ciel à faire du bien sur la terre.',
        contexte: 'À ses sœurs du carmel de Lisieux, dans les derniers mois de sa vie, en 1897.',
        sens:
          'Elle ne se représente pas le paradis comme un repos mais comme un travail qui continue. C’est la phrase qui a fait sa popularité mondiale.',
      },
      {
        texte: 'Ma vocation, c’est l’amour.',
        contexte: 'Manuscrit B, écrit pour sa sœur Marie en septembre 1896.',
        sens:
          'Elle cherchait sa place dans l’Église — missionnaire, martyre, savante ? — et conclut qu’aucun de ces rôles n’est le sien : le sien est d’aimer.',
      },
      {
        texte: 'Je ne meurs pas, j’entre dans la vie.',
        contexte: 'Lettre à l’abbé Bellière, 9 juin 1897, trois mois avant sa mort.',
      },
      {
        texte:
          'Très Saint-Père, en l’honneur de votre jubilé, permettez-moi d’entrer au Carmel à quinze ans !',
        contexte: 'Au pape Léon XIII, pendant l’audience du 20 novembre 1887.',
        sens:
          'Le protocole interdisait de parler au pape. Deux gardes durent la porter dehors ; elle entra au Carmel cinq mois plus tard.',
      },
    ],
    reperes: [
      'Fille d’un horloger et d’une dentellière d’Alençon, canonisés tous deux en 2015.',
      'Sa mère meurt quand elle a quatre ans ; ses quatre sœurs deviennent religieuses.',
      'À quatorze ans, elle demande au pape Léon XIII l’autorisation d’entrer au Carmel.',
      'Entrée au carmel de Lisieux le 9 avril 1888, à quinze ans ; morte de tuberculose à vingt-quatre.',
      'Son livre, *Histoire d’une âme*, paraît en 1898 et est traduit en une soixantaine de langues.',
      'Canonisée en 1925, patronne des missions en 1927, docteur de l’Église en 1997.',
    ],
    recit: [
      {
        titre: 'Alençon, Lisieux, une famille',
        texte:
          'Thérèse Martin naît à **Alençon** en 1873. Son père **Louis** est horloger, sa mère **Zélie** dirige un atelier de dentelle au point d’Alençon — une entreprise qui fait vivre une vingtaine d’ouvrières. Sur neuf enfants, quatre meurent en bas âge ; les cinq filles qui restent entreront toutes au couvent. Zélie meurt d’un cancer du sein en **1877** : Thérèse a quatre ans, et la famille part s’installer à **Lisieux**, chez un oncle. L’enfant est douée, gâtée, et d’une sensibilité qui la fait pleurer pour un rien ; elle situe elle-même à la nuit de **Noël 1886** le moment où elle cesse de pleurer sur elle-même. Ses parents ont été **canonisés ensemble en 2015**, les premiers époux de l’histoire à l’être le même jour.',
      },
      {
        titre: 'Quinze ans, et le pape',
        texte:
          'Deux de ses sœurs sont déjà carmélites à Lisieux. Thérèse veut les rejoindre : on lui répond qu’à quatorze ans il n’en est pas question. Elle s’adresse au supérieur, puis à l’évêque de Bayeux, qui refusent. En novembre 1887, elle profite d’un **pèlerinage à Rome** et d’une audience de **Léon XIII** : malgré la consigne de garder le silence, elle s’agenouille et demande au pape, de vive voix, la permission d’entrer au Carmel à quinze ans. Le pape répond qu’elle entrera si c’est la volonté de Dieu ; deux gardes suisses la soulèvent et l’emportent. L’autorisation arrive à la fin de l’hiver : elle franchit la porte du **carmel de Lisieux** le **9 avril 1888**. Elle en sortira morte, neuf ans plus tard.',
      },
      {
        titre: 'La petite voie',
        texte:
          'Le XIXᵉ siècle religieux français est sévère : on y parle beaucoup de mérites, d’efforts héroïques et de justice divine. Thérèse prend le contre-pied. Elle constate qu’elle ne sera ni missionnaire, ni martyre, ni fondatrice, et qu’elle est même incapable des grandes pénitences du couvent — alors elle décide de devenir sainte **par les petites choses** : supporter sans rien dire la sœur qui l’éclabousse au lavoir, sourire à celle qui l’agace, ramasser une épingle par amour. C’est ce qu’elle appelle la « **petite voie** » ou l’enfance spirituelle, et elle la compare à un **ascenseur** : inutile de gravir l’escalier, il suffit de se laisser porter. Cette idée — la sainteté à la portée de n’importe qui, sans exploit — est la raison pour laquelle elle est devenue, un siècle plus tard, l’une des figures les plus lues du christianisme.',
      },
      {
        titre: 'Un manuscrit écrit par obéissance',
        texte:
          'Ses supérieures — dont sa propre sœur **Pauline**, devenue mère Agnès — lui ordonnent d’écrire ses souvenirs d’enfance. Elle s’exécute entre 1895 et 1897 et remplit trois cahiers, sans plan, à la plume, souvent sur ses genoux. Le **3 avril 1896**, dans la nuit du Vendredi saint, elle crache le sang : c’est la **tuberculose**. Elle continue d’écrire au crayon dans le jardin, sur une chaise longue, pendant que la maladie la dévore — les derniers mois sont atroces, et elle y traverse ce qu’elle appelle une nuit où la foi elle-même semble éteinte, ce qu’elle note sans le cacher. Elle meurt le **30 septembre 1897**, à vingt-quatre ans. Ses dernières paroles : « Mon Dieu, je vous aime. »',
      },
      {
        titre: 'Le livre qui fait le tour du monde',
        texte:
          'Les carmels s’envoyaient à la mort d’une sœur une courte notice. Celle de Thérèse est imprimée en 1898 sous le titre ***Histoire d’une âme***, à deux mille exemplaires, pour être distribuée aux couvents. Le tirage part, les lettres affluent, on réimprime, on traduit. Les soldats de **1914-1918** emportent son portrait dans leurs poches et Lisieux reçoit des centaines de lettres par jour. **Pie XI** la canonise le **17 mai 1925**, vingt-huit ans seulement après sa mort, et la proclame en **1927 patronne des missions** à égalité avec François Xavier — elle qui n’avait jamais quitté la France qu’une fois. En 1944 elle devient la seconde patronne de la France, avec Jeanne d’Arc. Le **19 octobre 1997**, **Jean-Paul II** la déclare **docteur de l’Église** : la troisième femme à recevoir ce titre, et la plus jeune de tous.',
      },
    ],
    chrono: [
      { date: '2 janvier 1873', fait: 'Naissance à Alençon.' },
      { date: '1877', fait: 'Mort de sa mère ; la famille s’installe à Lisieux.' },
      { date: '20 novembre 1887', fait: 'Elle demande au pape Léon XIII d’entrer au Carmel.' },
      { date: '9 avril 1888', fait: 'Entrée au carmel de Lisieux, à quinze ans.' },
      { date: '3 avril 1896', fait: 'Première hémoptysie : la tuberculose se déclare.' },
      { date: 'septembre 1896', fait: 'Manuscrit B : « Ma vocation, c’est l’amour. »' },
      { date: '30 septembre 1897', fait: 'Mort à Lisieux, à vingt-quatre ans.' },
      { date: '1898', fait: 'Publication d’*Histoire d’une âme*.' },
      { date: '17 mai 1925', fait: 'Canonisation par le pape Pie XI.' },
      { date: '1927', fait: 'Proclamée patronne des missions.' },
      { date: '19 octobre 1997', fait: 'Déclarée docteur de l’Église par Jean-Paul II.' },
    ],
    leSaisTu:
      'Elle n’a jamais quitté son couvent après quinze ans et n’est sortie de France qu’une seule fois, pour ce voyage à Rome. En 1927, l’Église la déclare patronne des missions, à égalité avec François Xavier, qui avait traversé l’Asie et parcouru des dizaines de milliers de kilomètres.',
    aRetenir: [
      'Thérèse Martin (1873-1897) entre au carmel de Lisieux à quinze ans et meurt de tuberculose à vingt-quatre.',
      'Elle obtient son entrée au Carmel en le demandant au pape Léon XIII, le 20 novembre 1887.',
      'Sa « petite voie » place la sainteté dans les petites actions faites par amour, à la portée de tous.',
      'Son livre, *Histoire d’une âme*, paraît en 1898 et connaît un succès mondial.',
      'Canonisée en 1925, patronne des missions en 1927, elle est faite docteur de l’Église en 1997.',
    ],
    mots: [
      {
        mot: 'Carmel',
        sens: 'Couvent de religieuses cloîtrées, vouées au silence, au travail et à la prière.',
      },
      {
        mot: 'Docteur de l’Église',
        sens: 'Titre donné par le pape à un auteur dont la doctrine fait autorité ; une quarantaine de personnes l’ont reçu en vingt siècles.',
      },
      {
        mot: 'Petite voie',
        sens: 'L’enfance spirituelle : chercher la sainteté dans les gestes ordinaires plutôt que dans les exploits.',
      },
    ],
    lies: [
      'bernadette-soubirous',
      'jean-marie-vianney',
      'charles-de-foucauld',
      'jeanne-d-arc',
      'jean-paul-ii',
    ],
    niveaux: ['4e'],
    programme: 'Société, culture et politique dans la France du XIXᵉ siècle',
    tags: [
      'Thérèse Martin',
      'Lisieux',
      'Carmel',
      'petite voie',
      'Histoire d’une âme',
      'Alençon',
      'docteur de l’Église',
      'patronne des missions',
      'Léon XIII',
    ],
  },
  {
    id: 'charles-de-foucauld',
    volet: 'personnages',
    nom: 'Charles de Foucauld',
    surnom: 'l’ermite du Hoggar',
    dates: '1858 – 1916',
    tri: 1916,
    periode: 'xixe',
    emoji: '🏜️',
    roles: ['Officier', 'Explorateur', 'Prêtre ermite', 'Linguiste'],
    origine: 'Strasbourg, Alsace',
    accroche:
      'Officier dissipé, puis explorateur du Maroc déguisé en rabbin, puis ermite du Sahara : il laisse un dictionnaire touareg en quatre volumes.',
    citations: [
      {
        texte:
          'Dès que je crus qu’il y avait un Dieu, je compris que je ne pouvais faire autrement que de ne vivre que pour lui.',
        contexte:
          'Lettre à son ami Henry de Castries, 14 août 1901, revenant sur sa conversion de 1886.',
        sens:
          'Il ne raconte pas un attendrissement mais une déduction : si c’est vrai, alors tout le reste doit changer. Il change tout en quelques mois.',
      },
      {
        texte: 'Mettez-vous à genoux, confessez-vous à Dieu, vous croirez.',
        qui: 'L’abbé Huvelin',
        contexte:
          'À l’église Saint-Augustin, à Paris, en octobre 1886, à un Foucauld venu demander des leçons de religion.',
        sens: 'On lui répond par un geste, pas par un argument. Il obéit sur-le-champ.',
      },
      {
        texte: 'Je veux crier l’Évangile par toute ma vie.',
        contexte: 'Règle qu’il écrit au Sahara pour les frères qui ne viendront jamais, vers 1902.',
        sens: 'Ne rien démontrer, ne rien imposer : se faire comprendre par sa manière de vivre.',
      },
      {
        texte:
          'Je voudrais être assez bon pour qu’on dise : si tel est le serviteur, comment est le Maître ?',
        contexte: 'Lettre écrite du Sahara, à propos de sa vie parmi les Touaregs.',
      },
    ],
    reperes: [
      'Orphelin à six ans, riche héritier, il sort dernier de sa promotion de Saumur.',
      'En 1883-1884, il explore le Maroc interdit aux chrétiens, déguisé en rabbin.',
      'Médaille d’or de la Société de géographie de Paris en 1885 pour ses relevés.',
      'Il se convertit à Paris en octobre 1886 et devient prêtre en 1901.',
      'Installé à Tamanrasset en 1905, il vit onze ans chez les Touaregs.',
      'Tué le 1ᵉʳ décembre 1916 ; canonisé le 15 mai 2022.',
    ],
    recit: [
      {
        titre: 'Le vicomte dissipé',
        texte:
          'Charles naît à **Strasbourg** en 1858 dans une vieille famille noble ; ses deux parents meurent la même année, il a six ans. Élevé par son grand-père, héritier d’une grosse fortune, il perd la foi à l’adolescence et se jette dans une vie de plaisirs restée célèbre : entré à **Saint-Cyr**, il en sort 333ᵉ sur 386, puis dernier de sa promotion à l’école de cavalerie de **Saumur**, où ses camarades l’appellent « le gros Foucauld » à cause des dîners qu’il fait venir de Paris. Envoyé en **Algérie** en 1880, il est suspendu pour indiscipline et démissionne — puis, apprenant que son ancien régiment se bat dans le Sud-Oranais, il demande à reprendre du service. C’est là qu’il découvre le **désert**, et la foi des musulmans qu’il y croise.',
      },
      {
        titre: 'Onze mois au Maroc, déguisé en rabbin',
        texte:
          'Le **Maroc** de 1883 est fermé aux Européens, et un chrétien qui s’y aventure risque sa vie. Foucauld quitte l’armée, apprend l’arabe et l’hébreu, et entre dans le pays **déguisé en rabbin russe** sous le nom de Joseph Aleman, accompagné d’un vrai rabbin, **Mardochée**. Pendant onze mois, il relève sa route au sextant caché sous sa robe et note ses mesures la nuit, sur des carnets minuscules. Il rapporte les relevés de près de **3 000 kilomètres** d’itinéraires, dont la plus grande partie était inconnue des géographes. La **Société de géographie de Paris** lui décerne sa médaille d’or en **1885** ; son livre, *Reconnaissance au Maroc*, paraît en 1888 et reste une référence.',
      },
      {
        titre: 'Saint-Augustin, octobre 1886',
        texte:
          'Revenu à Paris, riche, célèbre et vide, il entre plusieurs fois dans les églises en répétant : « Mon Dieu, si vous existez, faites que je vous connaisse. » Un matin d’**octobre 1886**, il va trouver à **Saint-Augustin** l’abbé **Huvelin** pour lui demander des leçons de religion. Le prêtre lui répond de s’agenouiller et de se confesser. Il le fait, et communie dans la foulée. Le reste suit très vite : pèlerinage en Terre sainte, entrée à la **Trappe** en 1890, puis départ de la Trappe parce qu’il la juge encore trop confortable — il devient **domestique des clarisses de Nazareth**, dort dans une cabane au fond du jardin et travaille contre un peu de pain. Il est ordonné **prêtre** le 9 juin 1901, à quarante-deux ans.',
      },
      {
        titre: 'Le frère universel',
        texte:
          'Il choisit pour s’installer l’endroit le plus abandonné qu’il connaisse : **Béni Abbès**, dans le Sahara algérien, en octobre 1901. Il y bâtit de ses mains une petite maison de terre et laisse la porte ouverte à tous — soldats, nomades, esclaves, musulmans, juifs, chrétiens. Il veut, écrit-il, que « tous les habitants me regardent comme leur frère, le **frère universel** ». Il rachète et affranchit des esclaves, un par un, et écrit aux autorités françaises pour dénoncer l’esclavage que l’administration coloniale tolère dans le Sud. Il ne cherche pas à convertir : en quinze ans de Sahara, il ne baptisera personne, et il l’écrit sans amertume.',
      },
      {
        titre: 'Tamanrasset et le dictionnaire',
        texte:
          'En **1905**, il s’installe à **Tamanrasset**, dans le **Hoggar**, un hameau d’une vingtaine de feux au milieu des montagnes, chez les **Touaregs**. Il y passe onze ans à partager leur famine quand elle vient, à soigner, et surtout à écrire. Il apprend le **tamahaq** et entreprend un travail de linguiste solitaire : un **dictionnaire touareg-français** de quatre volumes et près de deux mille pages, une grammaire, un recueil de plusieurs milliers de vers de **poésie touarègue** recueillis de bouche à oreille, et la traduction des Évangiles. Rien n’est publié de son vivant ; le dictionnaire paraît en **1951-1952** et reste la base de tout ce qui s’écrit sur cette langue. C’est, paradoxalement, l’œuvre d’un homme venu là pour se taire.',
      },
      {
        titre: '1ᵉʳ décembre 1916',
        texte:
          'La **Première Guerre mondiale** gagne le Sahara : les Senoussistes, soutenus par les Turcs, poussent à la révolte contre la France. Foucauld refuse de partir et bâtit un petit fortin où les habitants pourront se réfugier. Le **1ᵉʳ décembre 1916**, une bande armée l’attire dehors, le ligote et le garde sous la surveillance d’un adolescent ; l’arrivée de deux méharistes déclenche la panique, et le garçon tire. Il a cinquante-huit ans. Personne ne l’avait rejoint : il avait écrit une règle pour une communauté qui n’a jamais existé de son vivant. En **1933**, René Voillaume fonde d’après ses écrits les **Petits Frères de Jésus**, suivis des Petites Sœurs ; ils sont aujourd’hui présents sur tous les continents. Foucauld a été béatifié en 2005 et **canonisé le 15 mai 2022**.',
      },
    ],
    chrono: [
      { date: '15 septembre 1858', fait: 'Naissance à Strasbourg.' },
      { date: '1878', fait: 'Sorti dernier de sa promotion de l’école de Saumur.' },
      { date: '1883-1884', fait: 'Exploration clandestine du Maroc, déguisé en rabbin.' },
      { date: '1885', fait: 'Médaille d’or de la Société de géographie de Paris.' },
      { date: 'octobre 1886', fait: 'Conversion à Saint-Augustin, auprès de l’abbé Huvelin.' },
      { date: '1897-1900', fait: 'Domestique des clarisses, à Nazareth.' },
      { date: '9 juin 1901', fait: 'Ordonné prêtre ; départ pour le Sahara.' },
      { date: '1905', fait: 'Installation à Tamanrasset, chez les Touaregs.' },
      { date: '1ᵉʳ décembre 1916', fait: 'Tué devant sa maison, à cinquante-huit ans.' },
      { date: '1951', fait: 'Publication de son dictionnaire touareg-français.' },
      { date: '15 mai 2022', fait: 'Canonisation par le pape François.' },
    ],
    leSaisTu:
      'Pour traverser un Maroc fermé aux chrétiens, il se fit passer onze mois durant pour un rabbin russe nommé Joseph Aleman. Il mesurait sa route au sextant dissimulé sous sa robe et notait ses relevés dans des carnets grands comme la paume : 3 000 kilomètres de cartes, dessinés en fraude.',
    aRetenir: [
      'Charles de Foucauld (1858-1916), officier puis explorateur, se convertit à Paris en octobre 1886.',
      'Son exploration clandestine du Maroc (1883-1884) lui vaut la médaille d’or de la Société de géographie.',
      'Prêtre en 1901, il s’installe au Sahara, à Béni Abbès puis à Tamanrasset, chez les Touaregs.',
      'Il compose un dictionnaire touareg-français de quatre volumes, publié en 1951, encore utilisé.',
      'Tué le 1ᵉʳ décembre 1916, il est béatifié en 2005 et canonisé le 15 mai 2022.',
    ],
    mots: [
      {
        mot: 'Ermite',
        sens: 'Religieux qui choisit de vivre seul, à l’écart de tous, pour prier.',
      },
      {
        mot: 'Touaregs',
        sens: 'Peuple nomade du Sahara, de langue tamahaq, chez qui Foucauld s’installe en 1905.',
      },
      {
        mot: 'Trappe',
        sens: 'Ordre monastique très austère, réformé au XVIIᵉ siècle à l’abbaye de la Trappe.',
      },
    ],
    lies: [
      'sainte-therese-de-lisieux',
      'jean-marie-vianney',
      'bernadette-soubirous',
      'partage-de-l-afrique',
    ],
    niveaux: ['4e'],
    programme: 'Conquêtes et sociétés coloniales',
    tags: [
      'Foucauld',
      'Hoggar',
      'Tamanrasset',
      'Sahara',
      'Touaregs',
      'Maroc',
      'Béni Abbès',
      'ermite',
      'dictionnaire touareg',
      'Strasbourg',
    ],
  },
]
