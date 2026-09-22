// -----------------------------------------------------------------------------
// MOYEN ÂGE — LES FONDATIONS. Les huit dates qui font sortir la France et
// l'Europe de la fin de Rome : un baptême, deux batailles qui installent une
// famille, un sacre impérial, un partage d'héritage, une conquête outre-Manche,
// un pèlerinage armé, et le dimanche où le royaume se découvre un roi commun.
//
// Même armature que le lot modèle (`evenements-revolution-causes.ts`) :
// POURQUOI (`causes`) → CE QUI SE PASSE (`recit`) → CE QUE ÇA CHANGE
// (`consequences`), plus les `chiffres` qui frappent et le `leSaisTu`.
//
// TON : ce sont des actes fondateurs, et la portée religieuse y est prise au
// sérieux — c'est un moteur des actes, pas une naïveté d'époque (cf.
// `docs/encyclopedie.md`, § 3). Les violences ne sont pas cachées — la
// conversion forcée des Saxons, les massacres de 1096 en Rhénanie, la prise de
// Jérusalem — mais elles sont racontées DANS LEUR TEMPS, datées et chiffrées,
// sans ironie ni procès rétrospectif.
//
// Un piège traité explicitement : `bataille-de-poitiers` est celle de 732, et
// la fiche consacre un bloc entier à la distinguer de celle de 1356.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_MOYEN_AGE_FONDATIONS: Evenement[] = [
  {
    id: 'bapteme-de-clovis',
    volet: 'evenements',
    nom: 'Le baptême de Clovis',
    date: '25 décembre 496',
    tri: 496,
    periode: 'moyen-age',
    emoji: '💧',
    lieu: 'Reims',
    accroche:
      'Un roi franc païen se fait baptiser à Reims par l’évêque Remi : la royauté française entre dans l’Église, et n’en sortira plus pendant treize siècles.',
    citations: [
      {
        texte: 'Courbe la tête, fier Sicambre : adore ce que tu as brûlé, brûle ce que tu as adoré.',
        qui: 'Saint Remi, évêque de Reims',
        contexte:
          'À Clovis, au moment de le plonger dans la cuve baptismale, selon Grégoire de Tours.',
        sens:
          'Le roi guerrier doit s’incliner : celui qui pillait les églises devient le protecteur de la foi qu’il combattait.',
        incertaine: true,
      },
      {
        texte: 'Si j’avais été là avec mes Francs, j’aurais vengé ses injures.',
        qui: 'Clovis',
        contexte:
          'En écoutant Clotilde lui raconter la Passion du Christ, rapporté par Grégoire de Tours vers 575.',
        sens:
          'La réaction d’un chef de guerre devant un Dieu qui se laisse tuer : la foi lui arrive par le courage avant de lui arriver par le catéchisme.',
      },
      {
        texte: 'Souviens-toi du vase de Soissons.',
        qui: 'Clovis',
        contexte:
          'À un guerrier qui avait brisé à la hache un vase d’église réclamé par l’évêque, un an plus tôt, lors d’une revue des troupes.',
        sens:
          'Clovis lui fend le crâne. La scène dit deux choses : le roi n’oublie rien, et il ménage déjà l’Église.',
        incertaine: true,
      },
    ],
    reperes: [
      'Clovis est roi des Francs Saliens depuis 481 et bat en 486 le dernier général romain de Gaule, Syagrius.',
      'Sa femme Clotilde, princesse burgonde de foi romaine, le presse pendant des années de se convertir.',
      'Il est baptisé à Reims par l’évêque Remi, avec trois mille de ses guerriers selon la tradition.',
      'Il choisit le christianisme de Rome quand les autres rois barbares sont ariens : l’Église de Gaule est avec lui.',
      'Fort de cet appui, il bat les Wisigoths à Vouillé en 507 et installe sa capitale à Paris vers 508.',
      'La date de 496 est celle de la tradition : plusieurs historiens proposent 498 ou 499.',
    ],
    causes: [
      'La disparition de l’Empire romain d’Occident en 476 : la Gaule est partagée entre royaumes barbares et plus personne n’arbitre.',
      'Les Francs de Clovis sont païens et doivent gouverner une population gallo-romaine chrétienne depuis plus d’un siècle.',
      'Les évêques sont les seules autorités qui tiennent encore les villes, les écoles et les écrits : s’allier à eux, c’est tenir la Gaule.',
      'L’influence de la reine Clotilde, chrétienne, qui fait baptiser leurs fils avant lui.',
      'Les rois wisigoths et burgondes sont ariens, donc hérétiques pour Rome : Clovis peut devenir le seul roi catholique d’Occident.',
      'La bataille de Tolbiac contre les Alamans, où Clovis promet, selon la tradition, de se convertir s’il l’emporte.',
    ],
    recit: [
      {
        titre: 'Un royaume à prendre',
        texte:
          'En **481**, à quinze ans, Clovis hérite d’un petit royaume franc autour de Tournai. La Gaule, elle, est un damier : les **Wisigoths** tiennent le Sud-Ouest depuis Toulouse, les **Burgondes** la vallée du Rhône, les **Alamans** l’est du Rhin, et un dernier général romain, **Syagrius**, un morceau de pays autour de Soissons. Clovis l’attaque et l’écrase en **486** : à vingt ans, il commande de la Somme à la Loire. Mais un roi franc païen à la tête de populations **gallo-romaines** chrétiennes depuis plus d’un siècle, c’est un conquérant posé sur un pays qui ne le reconnaît pas. Les villes, les écoles, les hôpitaux, les registres, la langue écrite : tout ce qui tient encore debout est entre les mains des **évêques**. Gagner la Gaule, ce n’est donc pas seulement la prendre — c’est s’en faire accepter.',
      },
      {
        titre: 'Clotilde et le vœu de Tolbiac',
        texte:
          'Vers **493**, Clovis épouse **Clotilde**, princesse burgonde et catholique. Elle le presse pendant des années. Leur premier fils est baptisé et meurt peu après ; le second, baptisé aussi, manque d’y passer. Clovis reste sur ses dieux. Le basculement vient d’une bataille : à **Tolbiac**, contre les Alamans, la ligne franque plie. Grégoire de Tours raconte que le roi lève les yeux et promet que, s’il l’emporte, il croira au Dieu de sa femme. Les Alamans cèdent, leur roi tombe. Que le récit soit exact ou qu’il rejoue à dessein celui de **Constantin** au pont Milvius, deux siècles plus tôt, une chose est sûre : au retour, Clovis envoie chercher **Remi**, l’évêque de Reims, et se prépare au baptême avec lui.',
      },
      {
        titre: 'La nuit de Noël à Reims',
        texte:
          'La cathédrale est tendue de blanc, parfumée, éclairée de cierges — Grégoire de Tours écrit que Clovis crut entrer au paradis. Avant de le plonger dans la cuve, Remi lui dit la phrase qu’on répète depuis : **« Courbe la tête, fier Sicambre. »** Avec lui, selon la tradition, **trois mille guerriers francs** reçoivent le baptême. Le choix est double, et le second compte autant que le premier : Clovis ne devient pas seulement chrétien, il devient **catholique**, c’est-à-dire fidèle à Rome, alors que tous les autres rois barbares — Wisigoths et Burgondes compris — sont **ariens**, donc hérétiques aux yeux des évêques de Gaule. En une cérémonie, il devient le seul roi que l’Église d’Occident puisse soutenir sans réserve. La date elle-même reste discutée : la tradition retient le **25 décembre 496**, plusieurs historiens proposent 498 ou 499.',
      },
      {
        titre: 'Ce que le baptême lui donne',
        texte:
          'Les effets sont immédiats. Les évêques de Gaule, qui savent lire, écrire, compter et administrer, entrent au service du roi franc ; les populations gallo-romaines cessent de voir en lui un occupant. Dès **507**, Clovis marche contre les Wisigoths ariens d’**Alaric II** en se présentant comme le défenseur de la vraie foi : il les bat à **Vouillé**, près de Poitiers, et prend tout le Sud-Ouest jusqu’aux Pyrénées. L’empereur d’Orient **Anastase** lui fait porter les insignes du consulat, façon de reconnaître qu’il compte désormais. Vers **508**, il installe sa capitale à **Paris**. En **511**, un an avant sa mort, il réunit à Orléans un concile de trente-deux évêques : le roi des Francs convoque l’Église de son royaume et légifère avec elle.',
      },
      {
        titre: 'Treize siècles de conséquences',
        texte:
          'Ce baptême n’installe pas seulement une dynastie, il fixe une règle. Le roi de France sera chrétien, il sera **sacré**, et on viendra le sacrer **à Reims**, là où Clovis fut baptisé : trente-trois souverains y recevront l’onction, jusqu’à **Charles X en 1825**. De là viennent le titre de **« fils aîné de l’Église »** porté par les rois de France, la **sainte ampoule** conservée dans la cathédrale, et cette idée, tenue pour vraie pendant mille trois cents ans, que le royaume est confié au roi par Dieu et qu’il en répond devant lui. Et le nom, enfin : les Francs de Clovis donnent le leur à la *Francia*, qui deviendra la France.',
      },
    ],
    consequences: [
      'Les Gallo-Romains catholiques acceptent un roi franc qui partage leur foi : la fusion des deux peuples commence.',
      'L’Église de Gaule met ses évêques, ses écoles et son écrit au service du pouvoir franc.',
      'Clovis attaque les Wisigoths ariens en défenseur de la foi : victoire de Vouillé en 507, la Gaule du Sud est prise.',
      'Reims devient la ville du sacre : trente-trois rois de France y seront couronnés, jusqu’en 1825.',
      'Le roi de France portera le titre de fils aîné de l’Église : la monarchie française naît chrétienne.',
      'Le royaume des Francs, la Francia, finit par donner son nom à la France.',
    ],
    chiffres: [
      { valeur: '3 000', quoi: 'guerriers francs baptisés avec leur roi, selon la tradition' },
      { valeur: '15 ans', quoi: 'l’âge de Clovis quand il devient roi, en 481' },
      { valeur: '33', quoi: 'rois sacrés à Reims après lui, jusqu’en 1825' },
      { valeur: '30 ans', quoi: 'de règne, de 481 à 511' },
    ],
    chrono: [
      { date: '481', fait: 'Clovis devient roi des Francs Saliens, à quinze ans.' },
      { date: '486', fait: 'Victoire de Soissons sur le Romain Syagrius.' },
      { date: 'vers 493', fait: 'Mariage avec Clotilde, princesse burgonde et catholique.' },
      { date: 'vers 496', fait: 'Bataille de Tolbiac contre les Alamans.' },
      { date: '25 décembre 496', fait: 'Baptême à Reims par l’évêque Remi.' },
      { date: '507', fait: 'Victoire de Vouillé sur les Wisigoths d’Alaric II.' },
      { date: 'vers 508', fait: 'Paris devient la capitale du royaume franc.' },
      { date: '511', fait: 'Concile d’Orléans, puis mort de Clovis.' },
    ],
    leSaisTu:
      'La légende raconte qu’au moment du baptême, la foule était si dense que le clerc portant le saint chrême ne put approcher : une colombe apporta alors du ciel une fiole d’huile. C’est la sainte ampoule, conservée à Reims et employée pour sacrer les rois de France pendant treize siècles ; elle fut brisée en place publique en 1793.',
    aRetenir: [
      'En 496, Clovis, roi des Francs, est baptisé à Reims par l’évêque Remi.',
      'Il choisit le christianisme de Rome quand les autres rois barbares sont ariens.',
      'Ce baptême lui vaut le soutien des évêques et l’acceptation des populations gallo-romaines.',
      'Fort de cet appui, il bat les Wisigoths à Vouillé en 507 et fait de Paris sa capitale.',
      'Reims devient la ville où l’on sacre les rois de France.',
    ],
    mots: [
      {
        mot: 'Arianisme',
        sens: 'Doctrine chrétienne, condamnée par Rome, qui refuse de voir dans le Christ l’égal de Dieu le Père.',
      },
      {
        mot: 'Baptême',
        sens: 'Rite d’entrée dans la religion chrétienne : le croyant est plongé dans l’eau et reçoit un nom.',
      },
      {
        mot: 'Sicambre',
        sens: 'Nom d’un ancien peuple germanique, employé par saint Remi pour désigner Clovis le Franc.',
      },
      {
        mot: 'Sacre',
        sens: 'Cérémonie où le roi reçoit l’onction d’huile sainte : il devient roi par la volonté de Dieu.',
      },
    ],
    lies: [
      'clovis',
      'sainte-genevieve',
      'chute-de-l-empire-romain-d-occident',
      'sacre-de-charlemagne',
      'bataille-de-poitiers',
    ],
    niveaux: ['6e', '5e'],
    programme: 'Chrétientés et islam (VIᵉ-XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Clovis',
      'Reims',
      'Remi',
      'Francs',
      'baptême',
      'Clotilde',
      'Tolbiac',
      'Sicambre',
      'sainte ampoule',
      'Mérovingiens',
      'Vouillé',
    ],
  },
  {
    id: 'bataille-de-poitiers',
    volet: 'evenements',
    nom: 'La bataille de Poitiers',
    date: '25 octobre 732',
    tri: 732,
    periode: 'moyen-age',
    emoji: '⚔️',
    lieu: 'Entre Tours et Poitiers',
    accroche:
      'Charles Martel arrête sur la route de Tours une armée venue d’al-Andalus : la victoire ouvre à sa famille le chemin de la couronne.',
    citations: [
      {
        texte:
          'Les hommes du Nord restèrent immobiles comme un mur, serrés les uns contre les autres comme un bloc de glace.',
        qui: 'La Chronique mozarabe de 754',
        contexte:
          'La plus ancienne description conservée de la bataille, écrite en Espagne une vingtaine d’années après par un chroniqueur chrétien.',
        sens:
          'L’infanterie franque, à pied et casquée, tient la ligne toute la journée : c’est elle qui gagne, pas une charge de cavalerie.',
      },
      {
        texte:
          'Le prince Charles, avec l’aide du Christ, renversa leurs tentes et se hâta au combat pour les broyer.',
        qui: 'La continuation de la chronique de Frédégaire',
        contexte:
          'Chronique franque rédigée vers 751, la plus favorable à Charles Martel — sa famille règne alors.',
      },
      {
        texte: 'On l’appela Martel parce qu’il broyait ses ennemis comme le marteau broie le fer.',
        qui: 'La tradition carolingienne',
        contexte:
          'Le surnom n’apparaît dans les textes qu’au IXᵉ siècle, plus de cent ans après la bataille.',
        sens:
          'De son vivant, les chroniques l’appellent simplement Charles, prince des Francs. Le surnom est une invention de ses descendants.',
        incertaine: true,
      },
    ],
    reperes: [
      'Maîtresses de l’Espagne depuis 711, les armées omeyyades franchissent les Pyrénées et remontent l’Aquitaine.',
      'Le duc d’Aquitaine Eudes, battu sur la Garonne, appelle à l’aide le maître du royaume franc.',
      'Charles Martel n’est pas roi : il est maire du palais, le vrai chef derrière des Mérovingiens sans pouvoir.',
      'Le 25 octobre 732, son infanterie tient en bloc et le gouverneur Abd al-Rahman est tué.',
      'À ne pas confondre avec la bataille de Poitiers de 1356, perdue par Jean le Bon face aux Anglais.',
      'La victoire ouvre le trône à sa famille : son fils Pépin le Bref devient roi en 751.',
    ],
    causes: [
      'L’expansion rapide du califat omeyyade, qui atteint l’Espagne en 711 et y abat le royaume wisigoth.',
      'Des expéditions annuelles au nord des Pyrénées : Narbonne prise en 719, Toulouse assiégée en 721, le Rhône remonté jusqu’à Autun.',
      'La faiblesse du duché d’Aquitaine, écrasé sur la Garonne et incapable de tenir seul.',
      'Un royaume franc éclaté entre grands, où le maire du palais Charles cherche à imposer son autorité.',
      'La richesse des sanctuaires de la Loire, et d’abord de Saint-Martin de Tours, le plus riche de Gaule.',
      'L’appel d’Eudes d’Aquitaine à Charles Martel, qui exige sa soumission en échange de son aide.',
    ],
    recit: [
      {
        titre: 'Ce qui arrive par le sud',
        texte:
          'En **711**, les armées du **califat omeyyade**, parties de Damas et maîtresses de toute l’Afrique du Nord, franchissent le détroit de Gibraltar et abattent en quelques mois le royaume **wisigoth** d’Espagne. Dix ans plus tard, presque toute la péninsule — **al-Andalus** — est sous leur autorité. Les expéditions reprennent alors chaque été vers le nord : **Narbonne** est prise en 719, **Toulouse** assiégée en 721, la vallée du Rhône remontée jusqu’à Autun. Ce sont d’abord des **razzias** — on vient chercher du butin et des tributs plus qu’on ne vient s’installer —, mais une razzia menée par des milliers de cavaliers ressemble beaucoup à une conquête. Au printemps **732**, le gouverneur d’al-Andalus **Abd al-Rahman al-Ghafiqi** écrase le duc **Eudes d’Aquitaine** sur la Garonne, prend Bordeaux et remonte vers la Loire, en direction de **Saint-Martin de Tours**.',
      },
      {
        titre: 'Le mur de piétons',
        texte:
          'Eudes, battu, n’a plus qu’une solution : appeler le maître du royaume franc. **Charles**, fils de Pépin de Herstal, n’est pas roi — il est **maire du palais**, premier officier d’un souverain mérovingien qui ne gouverne plus rien —, mais c’est lui qui lève les armées. Il accourt et prend position, probablement sur la vieille voie romaine **entre Tours et Poitiers**. Les deux armées s’observent une semaine. Le **25 octobre 732**, la cavalerie omeyyade charge. Les Francs, à pied, casqués, épaule contre épaule, tiennent : un chroniqueur d’Espagne écrira vingt ans plus tard qu’ils restèrent « immobiles comme un mur ». Les charges se brisent sur eux jusqu’au soir, et **Abd al-Rahman est tué** au milieu de ses hommes. La nuit venue, l’armée omeyyade lève le camp et repart vers le sud en abandonnant son butin.',
      },
      {
        titre: 'Deux Poitiers, six siècles d’écart',
        texte:
          '**Attention au piège du contrôle.** Il y a deux batailles de Poitiers dans les manuels, et elles n’ont rien à voir. Celle-ci, **le 25 octobre 732**, oppose **Charles Martel** aux armées omeyyades venues d’Espagne : les Francs l’emportent, et la famille de Charles y trouve le chemin du trône. L’autre, **le 19 septembre 1356**, se livre pendant la **guerre de Cent Ans** entre le roi de France **Jean II le Bon** et le Prince Noir, fils du roi d’Angleterre : l’armée française y est écrasée par les archers anglais et le roi est fait **prisonnier**, puis emmené à Londres, où il faudra payer une rançon énorme. **Six cent vingt-quatre ans** séparent les deux journées, et l’adversaire n’est pas le même. Retenez le couple : 732, Charles Martel, victoire ; 1356, Jean le Bon, défaite.',
      },
      {
        titre: 'De la victoire au trône',
        texte:
          'Charles Martel ne s’arrête pas là. Il redescend en **737** dans la vallée du Rhône, reprend Avignon et pousse jusque devant Narbonne ; son fils **Pépin le Bref** enlèvera la ville en **759**, mettant fin à toute présence omeyyade au nord des Pyrénées. Pour financer la **cavalerie lourde** qui lui manquait, Charles distribue à ses fidèles des terres prises à l’Église, à charge pour eux de servir à cheval : c’est une des racines du lien entre la terre et le service armé, donc de la **féodalité**. Sa famille — qu’on appellera plus tard les **Carolingiens** — tient désormais le royaume en fait. En **751**, Pépin dépose le dernier Mérovingien et se fait sacrer roi avec l’accord du pape. Deux générations plus tard, son petit-fils Charlemagne sera empereur.',
      },
      {
        titre: 'Ce qu’on en a fait ensuite',
        texte:
          'Au XIXᵉ siècle, Poitiers devient dans les manuels la bataille qui sauve la chrétienté : on en fait des tableaux, des statues, des chapitres entiers. Les historiens d’aujourd’hui la regardent autrement, sans la rabaisser. L’expédition de 732 était une opération de grande ampleur, mais pas une entreprise de conquête définitive, et l’arrêt de l’avancée omeyyade tient aussi aux distances, aux révoltes berbères de 740 et aux déchirements internes du califat. Ce que la bataille change à coup sûr, c’est **l’équilibre du royaume franc** : elle donne à Charles Martel un prestige que plus personne ne conteste, et elle met sa famille sur la route de la couronne.',
      },
    ],
    consequences: [
      'L’avancée omeyyade au nord des Pyrénées est stoppée ; Narbonne, dernière place, tombe en 759.',
      'Charles Martel devient l’homme le plus puissant d’Occident, sans jamais prendre le titre de roi.',
      'Pour payer sa cavalerie, il distribue des terres d’Église à ses fidèles : une des racines de la féodalité.',
      'L’Aquitaine entre dans l’orbite franque et perdra son indépendance sous Pépin le Bref.',
      'Sa famille, les Carolingiens, remplace les Mérovingiens sur le trône en 751.',
      'La bataille devient au XIXᵉ siècle un symbole national ; les historiens la replacent aujourd’hui dans une longue série d’expéditions.',
    ],
    chiffres: [
      { valeur: '21 ans', quoi: 'entre le débarquement de 711 et la bataille' },
      { valeur: '7 jours', quoi: 'd’observation entre les deux armées avant le choc' },
      { valeur: '1 200 km', quoi: 'entre Cordoue et Tours, la longueur du raid' },
      { valeur: '624 ans', quoi: 'entre cette bataille et celle de 1356, qu’on lui confond' },
    ],
    chrono: [
      { date: '711', fait: 'Les Omeyyades franchissent Gibraltar et abattent les Wisigoths.' },
      { date: '719', fait: 'Prise de Narbonne, première place forte au nord des Pyrénées.' },
      { date: '721', fait: 'Eudes d’Aquitaine repousse les assaillants devant Toulouse.' },
      { date: 'printemps 732', fait: 'Bordeaux est prise, l’armée d’Eudes écrasée sur la Garonne.' },
      { date: '25 octobre 732', fait: 'Charles Martel arrête l’armée omeyyade près de Poitiers.' },
      { date: '737', fait: 'Charles Martel reprend Avignon et descend sur Narbonne.' },
      { date: '741', fait: 'Mort de Charles Martel, maire du palais.' },
      { date: '751', fait: 'Pépin le Bref dépose le dernier Mérovingien et devient roi.' },
      { date: '759', fait: 'Reprise de Narbonne : plus d’armée omeyyade au nord des Pyrénées.' },
    ],
    leSaisTu:
      'Le nom de Charles Martel n’apparaît nulle part de son vivant : les chroniques l’appellent simplement Charles, prince des Francs. Le surnom de *Martellus*, « le marteau », se répand au IXᵉ siècle — c’est-à-dire quand ses descendants règnent et ont tout intérêt à raconter la bataille de leur ancêtre.',
    aRetenir: [
      'Le 25 octobre 732, Charles Martel bat une armée omeyyade entre Tours et Poitiers.',
      'Le chef adverse, Abd al-Rahman, gouverneur d’al-Andalus, est tué pendant la bataille.',
      'Charles Martel n’est pas roi mais maire du palais : il gouverne à la place des derniers Mérovingiens.',
      'La victoire assoit sa famille, les Carolingiens, qui prend le trône en 751 avec Pépin le Bref.',
      'Ne pas la confondre avec la bataille de Poitiers de 1356, perdue par Jean le Bon pendant la guerre de Cent Ans.',
    ],
    mots: [
      {
        mot: 'Maire du palais',
        sens: 'Premier officier du roi mérovingien, devenu au VIIIᵉ siècle le véritable chef du royaume franc.',
      },
      {
        mot: 'Omeyyades',
        sens: 'Dynastie de califes qui gouverne l’empire musulman depuis Damas, de la Perse à l’Espagne.',
      },
      {
        mot: 'Al-Andalus',
        sens: 'Nom donné par les musulmans à la partie de la péninsule Ibérique qu’ils dominent à partir de 711.',
      },
      {
        mot: 'Razzia',
        sens: 'Expédition rapide menée pour rapporter du butin plus que pour occuper un territoire.',
      },
    ],
    lies: ['charles-martel', 'charlemagne', 'mahomet', 'bapteme-de-clovis', 'sacre-de-charlemagne'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ-XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Poitiers',
      '732',
      'Charles Martel',
      'Omeyyades',
      'Abd al-Rahman',
      'Francs',
      'maire du palais',
      'al-Andalus',
      'Tours',
      'Carolingiens',
      'Eudes d’Aquitaine',
    ],
  },
  {
    id: 'sacre-de-charlemagne',
    volet: 'evenements',
    nom: 'Le sacre de Charlemagne',
    date: '25 décembre 800',
    tri: 800,
    periode: 'moyen-age',
    emoji: '🌟',
    lieu: 'Rome, basilique Saint-Pierre',
    accroche:
      'À Rome, le jour de Noël 800, le pape pose une couronne sur la tête d’un roi franc : l’Empire d’Occident renaît après trois siècles.',
    citations: [
      {
        texte:
          'À Charles, couronné par Dieu, grand et pacifique empereur des Romains, vie et victoire !',
        qui: 'Le peuple romain, dans la basilique Saint-Pierre',
        contexte:
          'Acclamation lancée par trois fois après que Léon III eut posé la couronne, le 25 décembre 800.',
        sens:
          'L’acclamation fait partie du rite romain : un empereur n’est empereur que reconnu à voix haute par son peuple.',
      },
      {
        texte:
          'S’il avait connu le dessein du pape, il ne serait pas entré dans l’église ce jour-là, malgré la grande fête.',
        qui: 'Éginhard, à propos de Charlemagne',
        contexte:
          'Dans la *Vie de Charlemagne*, écrite vers 830 par son secrétaire et biographe.',
        sens:
          'Charlemagne aurait donc été surpris. Beaucoup d’historiens y voient surtout une manière de dire qu’il ne devait sa couronne à personne.',
      },
      {
        texte:
          'Charles, très serein auguste, couronné par Dieu, grand et pacifique empereur, gouvernant l’Empire romain.',
        qui: 'Le titre officiel de Charlemagne',
        contexte: 'Formule employée dans ses actes à partir de 801.',
        sens:
          'Il évite soigneusement « empereur des Romains », qui aurait été une déclaration de guerre à Constantinople : le titre est un compromis.',
      },
    ],
    reperes: [
      'Charles est roi des Francs depuis 768 et roi des Lombards depuis 774 : il tient la moitié de l’Occident.',
      'Il a mené plus de cinquante campagnes, dont trente ans de guerre de conquête contre les Saxons.',
      'Le pape Léon III, agressé dans Rome en 799, vient chercher sa protection jusqu’en Saxe.',
      'Le 25 décembre 800, Léon III le couronne empereur dans la basilique Saint-Pierre.',
      'Il n’y avait plus d’empereur en Occident depuis 476 ; à Constantinople règne alors l’impératrice Irène.',
      'Sa capitale est Aix-la-Chapelle, dont la chapelle octogonale est encore debout.',
    ],
    causes: [
      'L’effacement de l’Empire romain d’Occident depuis 476 : le titre d’empereur est vacant depuis plus de trois siècles.',
      'Les conquêtes de Charles — Lombardie, Saxe, Bavière, marche d’Espagne — qui reconstituent un territoire sans équivalent depuis Rome.',
      'L’alliance nouée par son père Pépin le Bref avec la papauté, qui a donné au pape un État en Italie.',
      'Le pape Léon III, accusé et frappé par des adversaires romains en 799, a besoin d’un protecteur armé.',
      'À Constantinople, l’impératrice Irène a fait aveugler son fils : Rome considère que le trône impérial est vide.',
      'La volonté des savants de sa cour, Alcuin en tête, de restaurer un empire chrétien d’Occident.',
    ],
    recit: [
      {
        titre: 'Un royaume trop grand pour un roi',
        texte:
          'Quand **Charles** devient roi des Francs en **768**, son royaume va du Rhin à la Loire. Quarante ans plus tard, il gouverne environ **un million de kilomètres carrés**, de l’**Èbre** à l’**Elbe** et de la mer du Nord jusqu’à Rome. Il a pris Pavie et la couronne des **Lombards** en 774, soumis la **Bavière**, poussé jusqu’en Espagne — où son arrière-garde est détruite à **Roncevaux** en 778 —, et mené contre les **Saxons** une guerre de trente ans, conquête et conversion forcée mêlées, la plus longue et la plus dure de son règne. Aucun souverain d’Occident n’a rien tenu de tel depuis l’Empire romain. Le mot « roi » ne dit plus ce qu’il est devenu.',
      },
      {
        titre: 'Noël 800, à Saint-Pierre',
        texte:
          'Le pape **Léon III** a été agressé dans les rues de Rome en 799 par des adversaires qui l’accusaient de crimes ; il s’est enfui jusqu’en Saxe demander la protection de Charles. Le roi le ramène à Rome, fait examiner l’affaire, et reste pour Noël. Le **25 décembre 800**, pendant la messe dans la basilique **Saint-Pierre**, alors que Charles est agenouillé en prière devant la tombe de l’apôtre, Léon III lui pose une couronne sur la tête, et le peuple romain l’acclame par trois fois. Son biographe **Éginhard** écrira trente ans plus tard que Charles, s’il avait deviné le dessein du pape, ne serait pas entré dans l’église ce jour-là. Faut-il le croire ? Il était trop bien informé pour être surpris. Mais recevoir la couronne **des mains du pape**, c’était admettre qu’un pape puisse faire un empereur — et cela, il ne le voulait pas.',
      },
      {
        titre: 'Il y avait déjà un empereur',
        texte:
          'Le titre impérial n’était pas libre. À **Constantinople**, l’Empire romain d’Orient dure sans interruption depuis Constantin, et il se tient pour le seul héritier légitime de Rome. Mais en 800, le trône y est occupé par une femme, l’impératrice **Irène**, qui a fait aveugler son propre fils pour régner : aux yeux de Rome, la place est donc vide. Charlemagne prend malgré tout un titre prudent, « empereur gouvernant l’Empire romain », et non « empereur des Romains », qui aurait valu déclaration de guerre. Il faudra douze ans de négociations pour qu’en **812**, à Aix, les ambassadeurs de Byzance le saluent enfin du nom de *basileus*. L’Occident a de nouveau un empereur — et l’Europe en compte désormais deux.',
      },
      {
        titre: 'Gouverner un empire sans routes',
        texte:
          'Charlemagne n’a ni fonctionnaires payés, ni impôt régulier, ni armée permanente. Il gouverne avec ce dont il dispose. Le territoire est découpé en **comtés** confiés à des **comtes** qui rendent la justice, lèvent les hommes et perçoivent les amendes ; les frontières sont tenues par des **marches** militaires. Pour surveiller les comtes, il invente les **missi dominici**, « les envoyés du maître » : deux hommes, un laïc et un évêque, qui parcourent chaque année une région, écoutent les plaintes et lui rendent compte. Ses lois, les **capitulaires**, sont écrites, découpées en petits chapitres et lues à haute voix dans tout l’Empire. Et parce qu’il faut des gens capables de lire ces textes, il ordonne que chaque évêché et chaque monastère tienne une **école**.',
      },
      {
        titre: 'Aix-la-Chapelle et la renaissance carolingienne',
        texte:
          'À partir de **794**, Charlemagne cesse de se déplacer sans fin et fixe sa cour à **Aix-la-Chapelle**, choisie pour ses sources chaudes. Il y fait bâtir un palais et une **chapelle octogonale** de marbre et de mosaïques, inspirée de Ravenne, qu’on visite encore aujourd’hui. Il y réunit les meilleurs esprits d’Occident : l’Anglais **Alcuin**, le Lombard Paul Diacre, le Wisigoth Théodulf, le Franc Éginhard. On y recopie les auteurs latins qui, sans cela, auraient disparu — la plupart des textes antiques que nous lisons nous sont parvenus par ces copies —, et l’on y met au point une écriture nette, à lettres séparées, la **minuscule caroline**. C’est ce qu’on appelle la **renaissance carolingienne** : un empire qui se remet à lire.',
      },
    ],
    consequences: [
      'L’Empire d’Occident renaît : sous des formes diverses, il durera jusqu’en 1806.',
      'Le sacre par le pape installe l’idée que le pouvoir impérial vient de Dieu et passe par l’Église.',
      'De là naîtra une longue querelle entre empereurs et papes : qui des deux tient son autorité de l’autre ?',
      'L’Empire est gouverné par des comtes surveillés par les missi dominici et par des lois écrites, les capitulaires.',
      'L’école et la copie des livres repartent : c’est la renaissance carolingienne, et la minuscule caroline.',
      'L’Empire ne survit pas aux héritiers : il est partagé en 843 au traité de Verdun.',
    ],
    chiffres: [
      { valeur: '1 million', quoi: 'de km² sous son autorité, de l’Èbre à l’Elbe' },
      { valeur: '324 ans', quoi: 'sans empereur en Occident, de 476 à 800' },
      { valeur: '46 ans', quoi: 'de règne, de 768 à 814' },
      { valeur: '3 fois', quoi: 'l’acclamation du peuple romain après le couronnement' },
    ],
    chrono: [
      { date: '768', fait: 'Charles devient roi des Francs avec son frère Carloman.' },
      { date: '774', fait: 'Il prend Pavie et devient roi des Lombards.' },
      { date: '778', fait: 'Son arrière-garde est détruite à Roncevaux.' },
      { date: '772 – 804', fait: 'Longue guerre de conquête et de conversion de la Saxe.' },
      { date: '794', fait: 'Aix-la-Chapelle devient sa résidence principale.' },
      { date: '25 décembre 800', fait: 'Léon III le couronne empereur à Saint-Pierre de Rome.' },
      { date: '812', fait: 'Byzance reconnaît enfin son titre impérial.' },
      { date: '28 janvier 814', fait: 'Mort à Aix ; Louis le Pieux lui succède.' },
    ],
    leSaisTu:
      'L’écriture que vous lisez vient de lui. Les copistes de son empire adoptent une écriture claire, aux lettres séparées, avec majuscules et minuscules : la *minuscule caroline*. Les imprimeurs de la Renaissance la reprendront en la croyant antique — et nos caractères d’imprimerie en descendent en ligne directe.',
    aRetenir: [
      'Le 25 décembre 800, le pape Léon III couronne Charlemagne empereur à Rome.',
      'Il n’y avait plus d’empereur en Occident depuis la chute de l’Empire romain, en 476.',
      'L’Empire carolingien s’étend de l’Èbre à l’Elbe, avec Aix-la-Chapelle pour capitale.',
      'Charlemagne gouverne par des comtes, des inspecteurs appelés missi dominici et des lois écrites, les capitulaires.',
      'Il relance les écoles et la copie des livres : c’est la renaissance carolingienne.',
    ],
    mots: [
      {
        mot: 'Sacre',
        sens: 'Cérémonie religieuse où un souverain reçoit l’onction et la couronne : son pouvoir est dit voulu par Dieu.',
      },
      {
        mot: 'Capitulaire',
        sens: 'Loi écrite de Charlemagne, divisée en petits chapitres (*capitula*), appliquée dans tout l’Empire.',
      },
      {
        mot: 'Missi dominici',
        sens: 'Les « envoyés du maître » : deux inspecteurs, un laïc et un évêque, qui contrôlent les comtes.',
      },
      {
        mot: 'Comte',
        sens: 'Représentant du souverain dans un territoire, chargé de la justice, de l’armée et des amendes.',
      },
    ],
    lies: [
      'charlemagne',
      'charles-martel',
      'traite-de-verdun',
      'bapteme-de-clovis',
      'bataille-de-poitiers',
    ],
    niveaux: ['6e', '5e'],
    programme: 'Chrétientés et islam (VIᵉ-XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Charlemagne',
      'sacre',
      '800',
      'Léon III',
      'empire carolingien',
      'Aix-la-Chapelle',
      'missi dominici',
      'capitulaires',
      'Éginhard',
      'renaissance carolingienne',
      'Rome',
    ],
  },
  {
    id: 'traite-de-verdun',
    volet: 'evenements',
    nom: 'Le traité de Verdun',
    date: 'août 843',
    tri: 843,
    periode: 'moyen-age',
    emoji: '📜',
    lieu: 'Verdun, sur la Meuse',
    accroche:
      'Trois petits-fils de Charlemagne se partagent son empire : la carte de l’Europe sort de ce partage, et la France avec elle.',
    citations: [
      {
        texte: 'Pro Deo amur et pro christian poblo et nostro commun salvament…',
        qui: 'Louis le Germanique, en langue romane',
        contexte:
          'Début du serment de Strasbourg, 14 février 842 : Louis jure en roman devant les soldats de son frère, qui jure en germanique.',
        sens:
          '« Pour l’amour de Dieu et pour le salut commun du peuple chrétien et le nôtre… » C’est le plus ancien texte conservé en langue romane, l’ancêtre du français.',
      },
      {
        texte:
          'Au lieu d’un roi, des roitelets ; au lieu d’un royaume, des fragments de royaume.',
        qui: 'Florus de Lyon',
        contexte:
          'Dans sa *Complainte sur le partage de l’Empire*, écrite peu après 843 par un clerc de Lyon.',
        sens:
          'Un contemporain pleure l’unité perdue : pour lui, l’Empire chrétien d’Occident vient de se briser en morceaux.',
      },
      {
        texte:
          'Jamais, de mémoire d’homme, tant de Francs ne s’étaient entretués dans une seule bataille.',
        qui: 'Nithard, petit-fils de Charlemagne',
        contexte:
          'Sur la bataille de Fontenoy-en-Puisaye, 25 juin 841, qu’il a vécue avant de la raconter dans son *Histoire des fils de Louis le Pieux*.',
      },
    ],
    reperes: [
      'Louis le Pieux, fils de Charlemagne, meurt en 840 en laissant trois fils adultes.',
      'L’aîné Lothaire veut gouverner seul l’Empire ; ses frères Louis et Charles s’allient contre lui.',
      'La bataille de Fontenoy-en-Puisaye, le 25 juin 841, met des Francs contre des Francs.',
      'Le 14 février 842, les serments de Strasbourg scellent publiquement l’alliance des deux cadets.',
      'En août 843, à Verdun, l’Empire est partagé en trois parts de revenus équivalents.',
      'Charles le Chauve reçoit la Francie occidentale : c’est l’ancêtre de la France.',
    ],
    causes: [
      'La coutume franque du partage : chez les Francs, un royaume est un patrimoine et se divise entre les fils.',
      'Un empire trop vaste pour être tenu sans les routes, l’impôt et l’administration permanente de Rome.',
      'L’échec de l’Ordinatio imperii de 817, qui voulait garder l’Empire sous un seul chef.',
      'La naissance en 823 d’un quatrième fils, Charles le Chauve, qui fait voler en éclats le partage prévu.',
      'Vingt ans de révoltes des fils de Louis le Pieux contre leur père, déposé puis rétabli.',
      'La défaite de Lothaire à Fontenoy en 841, qui l’oblige à négocier.',
      'Le serment de Strasbourg de 842, qui rend l’alliance de Louis et de Charles publique et irréversible.',
    ],
    recit: [
      {
        titre: 'Un empire qui se partage comme un héritage',
        texte:
          'Chez les Francs, un royaume n’est pas un État : c’est un **patrimoine**, et un patrimoine se divise entre les fils. Charlemagne lui-même l’avait prévu ainsi, et il n’a régné seul que parce que ses aînés sont morts avant lui. Son fils **Louis le Pieux** tente au contraire, par l’*Ordinatio imperii* de **817**, de garder l’Empire d’un seul tenant sous un seul empereur, son aîné **Lothaire**. Tout se dérègle en **823** : un quatrième fils naît, **Charles**, dit plus tard le Chauve, et sa mère Judith exige une part pour lui. Pendant vingt ans, les fils de Louis le Pieux se révoltent contre leur père, le déposent, le rétablissent, se retournent les uns contre les autres. À sa mort, en **840**, la question n’est plus de savoir si l’Empire se divisera, mais comment.',
      },
      {
        titre: 'Fontenoy, la bataille de trop',
        texte:
          'Lothaire, devenu empereur, veut gouverner seul. Ses deux frères, **Louis le Germanique** et **Charles le Chauve**, s’allient contre lui. Le **25 juin 841**, à **Fontenoy-en-Puisaye**, en Bourgogne, les deux armées franques s’affrontent toute une matinée. Le carnage frappe les contemporains : **Nithard**, petit-fils de Charlemagne et témoin direct, écrit que jamais tant de Francs ne s’étaient entretués. Des chroniqueurs y voient un péché collectif ; un poème raconte que la rosée cessa de tomber sur le champ de bataille. Lothaire est battu, mais pas abattu, et la guerre pourrait durer des années. Elle s’arrête parce que ses deux cadets vont faire, l’hiver suivant, une chose que personne n’avait faite avant eux.',
      },
      {
        titre: 'Strasbourg : jurer dans la langue de l’autre',
        texte:
          'Le **14 février 842**, à **Strasbourg**, Louis et Charles réunissent leurs armées et jurent de ne jamais traiter séparément avec Lothaire. Pour que chaque armée comprenne, chacun prête serment **dans la langue des soldats de son frère** : Louis le Germanique parle en **langue romane**, Charles le Chauve en **langue germanique**, puis les soldats jurent chacun dans la leur. Nithard a transcrit les deux textes mot à mot. Ce sont les **plus anciens documents conservés** en langue romane et en langue germanique — et ils disent quelque chose d’énorme : en 842, les habitants de l’empire de Charlemagne ne se comprennent déjà plus d’un bout à l’autre. Le partage politique qui vient ne fera que suivre un partage de langues.',
      },
      {
        titre: 'Verdun, août 843',
        texte:
          'Lothaire cède. Pendant des mois, **cent vingt commissaires** parcourent l’Empire pour estimer non pas les surfaces mais les **revenus** — abbayes, domaines, péages, évêchés —, afin que les trois parts se valent. En **août 843**, à **Verdun**, sur la Meuse, l’accord est signé. **Charles le Chauve** reçoit tout l’ouest, la **Francie occidentale**, de l’Escaut aux Pyrénées : ce sera la France. **Louis le Germanique** reçoit tout l’est, la **Francie orientale**, au-delà du Rhin : ce sera l’Allemagne. **Lothaire** garde le titre d’empereur et une longue bande centrale qui court de la mer du Nord à Rome, avec les deux capitales, **Aix-la-Chapelle** et Rome. Sur le papier, c’est la plus belle part. Dans les faits, c’est la plus fragile.',
      },
      {
        titre: 'La part du milieu',
        texte:
          'La **Lotharingie** n’a ni frontière naturelle, ni langue unique, ni peuple qui s’y reconnaisse : longue de plus de mille kilomètres, elle est parfois large de cent. Elle se disloque à la mort de Lothaire et ses morceaux sont repartagés entre les voisins dès le traité de **Meerssen**, en **870**. Ce qu’il en reste garde son nom : *Lotharii regnum*, le royaume de Lothaire, devenu la **Lorraine**. Des Flandres à la Bourgogne, de l’Alsace à la Savoie, cette bande de terre sera disputée entre la France et l’Allemagne jusqu’au XXᵉ siècle. C’est pour cette raison qu’un traité signé en 843 se lit encore sur une carte d’aujourd’hui.',
      },
    ],
    consequences: [
      'L’unité de l’Empire carolingien disparaît définitivement.',
      'La Francie occidentale de Charles le Chauve devient le royaume de France.',
      'La Francie orientale de Louis le Germanique devient le royaume de Germanie, puis l’Allemagne.',
      'La part du milieu, la Lotharingie, n’a ni langue ni peuple communs : elle se disloque dès 870.',
      'De la Lorraine à l’Alsace, la frontière issue de ce partage sera disputée pendant mille ans.',
      'Les serments de Strasbourg fixent par écrit, pour la première fois, la langue romane et la langue germanique.',
    ],
    chiffres: [
      { valeur: '3', quoi: 'parts du partage, pour trois frères' },
      { valeur: '120', quoi: 'commissaires envoyés compter les revenus des terres' },
      { valeur: '29 ans', quoi: 'entre la mort de Charlemagne et le partage de Verdun' },
      { valeur: '842', quoi: 'l’année du plus ancien texte conservé en français' },
    ],
    chrono: [
      { date: '814', fait: 'Louis le Pieux succède à Charlemagne.' },
      { date: '817', fait: 'L’*Ordinatio imperii* prévoit un empire à un seul chef.' },
      { date: '823', fait: 'Naissance de Charles le Chauve : le partage prévu est remis en cause.' },
      { date: '840', fait: 'Mort de Louis le Pieux ; la guerre éclate entre ses fils.' },
      { date: '25 juin 841', fait: 'Bataille de Fontenoy-en-Puisaye.' },
      { date: '14 février 842', fait: 'Serments de Strasbourg entre Louis et Charles.' },
      { date: 'août 843', fait: 'Traité de Verdun : l’Empire est partagé en trois.' },
      { date: '870', fait: 'Traité de Meerssen : la Lotharingie est dépecée.' },
    ],
    leSaisTu:
      'Les serments de Strasbourg ne sont pas seulement un traité : ce sont les deux plus anciens textes connus en français et en allemand. Chaque frère jure dans la langue des soldats de l’autre, pour être compris d’eux. Le français commence donc par une promesse faite à des soldats étrangers, un 14 février.',
    aRetenir: [
      'En août 843, le traité de Verdun partage l’Empire carolingien entre les trois fils de Louis le Pieux.',
      'Charles le Chauve reçoit la Francie occidentale, ancêtre de la France.',
      'Louis le Germanique reçoit la Francie orientale, ancêtre de l’Allemagne.',
      'Lothaire garde le titre d’empereur et une bande centrale allant de la mer du Nord à Rome.',
      'Les serments de Strasbourg de 842 sont les plus anciens textes conservés en langue romane et germanique.',
    ],
    mots: [
      {
        mot: 'Partage successoral',
        sens: 'Chez les Francs, coutume selon laquelle un royaume se divise entre tous les fils du roi.',
      },
      {
        mot: 'Lotharingie',
        sens: 'La part centrale de Lothaire, entre les deux autres : elle donnera son nom à la Lorraine.',
      },
      {
        mot: 'Langue romane',
        sens: 'Le latin parlé transformé par les siècles, d’où sortent le français, l’italien et l’espagnol.',
      },
      {
        mot: 'Serment',
        sens: 'Promesse prononcée à voix haute devant Dieu et des témoins : la rompre est un sacrilège.',
      },
    ],
    lies: [
      'charlemagne',
      'hugues-capet',
      'sacre-de-charlemagne',
      'avenement-d-hugues-capet',
    ],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ-XIIIᵉ siècles), des mondes en contact',
    tags: [
      'Verdun',
      '843',
      'Charles le Chauve',
      'Louis le Germanique',
      'Lothaire',
      'partage',
      'serments de Strasbourg',
      'Lotharingie',
      'Carolingiens',
      'Francie',
      'Fontenoy',
    ],
  },
  {
    id: 'avenement-d-hugues-capet',
    volet: 'evenements',
    nom: 'L’avènement d’Hugues Capet',
    date: '3 juillet 987',
    tri: 987,
    periode: 'moyen-age',
    emoji: '⚜️',
    lieu: 'Senlis, puis Noyon',
    accroche:
      'Un duc élu roi par les grands du royaume fonde sans le savoir la dynastie qui régnera sur la France pendant huit siècles.',
    citations: [
      {
        texte:
          'Le trône ne s’acquiert pas par droit héréditaire : il faut placer à la tête du royaume celui qui se distingue par la sagesse du corps et de l’âme.',
        qui: 'Adalbéron, archevêque de Reims',
        contexte:
          'Devant l’assemblée des grands réunie à Senlis, en mai 987, pour écarter Charles de Lorraine et faire élire Hugues.',
        sens:
          'L’argument qui fait roi Hugues Capet sera oublié dès l’année suivante : sa famille s’installera précisément par l’hérédité.',
      },
      {
        texte: 'Qui t’a fait comte ? — Qui t’a fait roi ?',
        qui: 'Hugues Capet et le comte Adalbert de Périgueux',
        contexte:
          'Échange rapporté par le chroniqueur Adémar de Chabannes au XIᵉ siècle, au sujet du siège de Tours.',
        sens:
          'Le roi a beau être sacré, il ne commande guère à des seigneurs aussi puissants que lui : tout le problème capétien tient dans cette réponse.',
        incertaine: true,
      },
      {
        texte: 'Hugues, roi des Francs par la grâce de Dieu.',
        qui: 'Hugues Capet, dans ses actes',
        contexte: 'Formule des diplômes royaux après le sacre, à partir de juillet 987.',
        sens:
          'Il n’est pas « roi de France » mais « roi des Francs » : le nom du pays mettra encore deux siècles à s’imposer dans les textes.',
      },
    ],
    reperes: [
      'Les derniers Carolingiens n’ont plus ni domaine, ni argent, ni armée : ils dépendent des grands féodaux.',
      'Le roi Louis V meurt d’une chute de cheval le 22 mai 987, sans enfant.',
      'L’archevêque de Reims Adalbéron fait écarter l’oncle du roi, Charles de Lorraine, et élire le duc des Francs.',
      'Hugues Capet est sacré à Noyon le 3 juillet 987, puis fait sacrer son fils Robert dès Noël.',
      'Son domaine royal se limite à peu près à Paris, Orléans, Senlis et quelques abbayes.',
      'Ses descendants régneront sur la France jusqu’en 1792.',
    ],
    causes: [
      'L’affaiblissement des derniers rois carolingiens, sans domaine propre, sans revenus et sans armée.',
      'Les invasions vikings, hongroises et sarrasines du IXᵉ siècle, qui ont donné le pouvoir réel à ceux qui défendaient sur place.',
      'La montée des Robertiens, maîtres du pays entre Seine et Loire, déjà rois à deux reprises depuis 888.',
      'La mort sans héritier direct de Louis V, dernier roi carolingien, en mai 987.',
      'La méfiance des grands envers Charles de Lorraine, oncle du roi défunt mais vassal de l’empereur germanique.',
      'L’appui décisif de l’archevêque de Reims Adalbéron et du savant Gerbert d’Aurillac, futur pape Sylvestre II.',
    ],
    recit: [
      {
        titre: 'Un royaume qui s’est émietté',
        texte:
          'Au Xᵉ siècle, le roi des Francs ne commande plus grand-chose. Les invasions **vikings**, hongroises et sarrasines du siècle précédent ont donné le pouvoir réel à ceux qui protégeaient sur place : les **comtes**, puis les seigneurs de château. Les derniers **Carolingiens** n’ont plus de domaine, plus d’argent, plus d’armée à eux ; ils vivent de quelques places autour de Laon. En face, la famille des **Robertiens** tient le pays entre **Seine et Loire**, la région la plus riche du royaume, et a déjà donné deux rois — **Eudes**, le défenseur de Paris contre les Vikings, élu en 888, et Robert Ier. Depuis 956, son chef s’appelle **Hugues**, duc des Francs, abbé laïc de Saint-Martin de Tours et de Saint-Denis.',
      },
      {
        titre: 'L’élection de 987',
        texte:
          'Le **22 mai 987**, le jeune roi **Louis V** meurt d’une chute de cheval, sans enfant. Il reste un Carolingien : son oncle **Charles de Lorraine**. Mais Charles est vassal de l’empereur germanique et s’est fait beaucoup d’ennemis. L’**archevêque de Reims Adalbéron**, épaulé par le savant **Gerbert d’Aurillac**, réunit les grands du royaume à **Senlis** et plaide contre lui : le trône, dit-il, ne s’hérite pas, il se donne au plus capable. Les grands élisent **Hugues, duc des Francs**, et il est sacré à **Noyon le 3 juillet 987**. Charles de Lorraine prend les armes, tient Laon deux ans, puis est livré par trahison en **991** ; il mourra en captivité. La branche carolingienne s’éteint sans bruit.',
      },
      {
        titre: 'Le coup de génie : sacrer son fils',
        texte:
          'Hugues Capet a été **élu**. Or ce qui s’élit une fois peut s’élire autrement la fois suivante — sa famille le sait pour avoir déjà perdu la couronne deux fois au Xᵉ siècle. Alors, cinq mois après son propre sacre, le **25 décembre 987**, il fait **sacrer son fils Robert** de son vivant et l’associe au trône. Le geste paraît modeste ; il est décisif. Tous les Capétiens le répéteront pendant deux cents ans, jusqu’à **Philippe Auguste** qui jugera, en 1179, que c’est devenu inutile tant l’hérédité va de soi. Sans bataille et sans loi nouvelle, l’élection s’est changée en **hérédité**. C’est ainsi qu’une dynastie s’installe : non par un coup d’éclat, mais par une habitude prise à temps.',
      },
      {
        titre: 'Un roi moins riche que ses vassaux',
        texte:
          'Il ne faut pas se tromper sur ce que possède Hugues Capet. Son **domaine royal** — les terres dont il tire vraiment ses revenus — tient dans un mouchoir : **Paris**, **Orléans**, **Senlis**, Étampes et quelques abbayes. À côté, le **duc de Normandie**, le **comte de Flandre**, le **duc d’Aquitaine** ou le comte de Blois sont plus riches et lèvent plus d’hommes que lui. Un comte peut lui répondre, comme le raconte une chronique du siècle suivant : *« Qui t’a fait roi ? »* Le roi n’a pourtant qu’une chose que nul autre ne possède : le **sacre**. L’onction reçue de l’Église fait de lui l’élu de Dieu, le seul seigneur qui ne soit l’homme de personne. Toute l’histoire des trois siècles suivants tiendra dans la lente transformation de ce prestige en pouvoir réel.',
      },
      {
        titre: 'Huit siècles',
        texte:
          'La suite dépasse tout ce qu’Hugues pouvait imaginer. Ses descendants directs se succèdent de père en fils sans interruption pendant **trois cent quarante et un ans**, de 987 à 1328 — un cas unique en Europe — et agrandissent le domaine morceau par morceau : **Philippe Auguste** prend la Normandie, **Saint Louis** donne au royaume sa justice, Philippe le Bel ses légistes. Quand la ligne directe s’éteint, la couronne passe aux **Valois**, cousins capétiens, puis aux **Bourbons** : c’est encore la même famille qui règne en 1789. Louis XVI, jugé par la Convention en décembre 1792, y sera appelé **« Louis Capet »**, du nom de l’ancêtre élu huit cents ans plus tôt.',
      },
    ],
    consequences: [
      'La dynastie capétienne s’installe : elle donnera des rois à la France jusqu’en 1792.',
      'En faisant sacrer son fils de son vivant, Hugues transforme peu à peu l’élection en hérédité.',
      'Le sacre devient le signe qui distingue le roi de tous les autres seigneurs du royaume.',
      'Le domaine royal, minuscule en 987, sera patiemment agrandi pendant trois siècles.',
      'Paris, au cœur de ce domaine, devient peu à peu la capitale du royaume.',
      'Les grands féodaux restent en fait aussi puissants que le roi : l’État royal est tout entier à construire.',
    ],
    chiffres: [
      { valeur: '805 ans', quoi: 'de règne capétien, de 987 à 1792' },
      { valeur: '5 mois', quoi: 'entre son sacre et celui de son fils Robert' },
      { valeur: '341 ans', quoi: 'de ligne directe, de 987 à 1328' },
      { valeur: '4', quoi: 'villes dans le domaine royal : Paris, Orléans, Senlis, Étampes' },
    ],
    chrono: [
      { date: '888', fait: 'Eudes, ancêtre d’Hugues, est élu roi pour défendre Paris des Vikings.' },
      { date: '956', fait: 'Hugues devient duc des Francs à la mort de son père Hugues le Grand.' },
      { date: '22 mai 987', fait: 'Mort accidentelle de Louis V, dernier roi carolingien.' },
      { date: 'mai 987', fait: 'Assemblée de Senlis : Adalbéron fait écarter Charles de Lorraine.' },
      { date: '3 juillet 987', fait: 'Sacre d’Hugues Capet à Noyon.' },
      { date: '25 décembre 987', fait: 'Son fils Robert est sacré de son vivant, à Orléans.' },
      { date: '991', fait: 'Charles de Lorraine est capturé ; il meurt en prison.' },
      { date: '996', fait: 'Mort d’Hugues Capet ; Robert le Pieux règne seul.' },
      { date: '1328', fait: 'Fin de la ligne directe des Capétiens.' },
    ],
    leSaisTu:
      'D’où vient « Capet » ? Probablement de la *cappa*, la chape de saint Martin dont sa famille était abbé laïc à Tours. Le surnom n’apparaît qu’au XIᵉ siècle, après sa mort. En 1792, la Convention l’emploiera comme nom de famille pour juger le roi : Louis XVI y est appelé « Louis Capet », huit cents ans plus tard.',
    aRetenir: [
      'Le 3 juillet 987, Hugues Capet, duc des Francs, est sacré roi à Noyon.',
      'Il est élu par les grands du royaume, sur la proposition de l’archevêque de Reims Adalbéron.',
      'Il fait sacrer son fils Robert dès la même année : l’élection se change en hérédité.',
      'Son domaine royal est minuscule, autour de Paris, d’Orléans et de Senlis.',
      'Sa dynastie, les Capétiens, règne sur la France jusqu’en 1792.',
    ],
    mots: [
      {
        mot: 'Domaine royal',
        sens: 'Les terres que le roi possède en propre et dont il tire ses revenus, par opposition au reste du royaume.',
      },
      {
        mot: 'Vassal',
        sens: 'Homme libre qui jure fidélité à un seigneur et reçoit de lui une terre, le fief.',
      },
      {
        mot: 'Dynastie',
        sens: 'Suite de souverains appartenant à une même famille.',
      },
      {
        mot: 'Abbé laïc',
        sens: 'Seigneur non prêtre qui reçoit les revenus d’une abbaye et la protège : une source de richesse considérable.',
      },
    ],
    lies: [
      'hugues-capet',
      'philippe-auguste',
      'suger',
      'traite-de-verdun',
      'bataille-de-bouvines',
    ],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Hugues Capet',
      '987',
      'Capétiens',
      'Noyon',
      'Adalbéron',
      'sacre',
      'domaine royal',
      'féodalité',
      'Robert le Pieux',
      'Carolingiens',
      'Senlis',
    ],
  },
  {
    id: 'bataille-d-hastings',
    volet: 'evenements',
    nom: 'La bataille d’Hastings',
    date: '14 octobre 1066',
    tri: 1066,
    periode: 'moyen-age',
    emoji: '🧵',
    lieu: 'Hastings, côte sud de l’Angleterre',
    accroche:
      'Un duc de Normandie traverse la Manche et conquiert l’Angleterre en une journée : la couronne anglaise passe à des seigneurs français.',
    citations: [
      {
        texte: 'Regardez-moi bien : je vis encore, et je vaincrai avec l’aide de Dieu !',
        qui: 'Guillaume, duc de Normandie',
        contexte:
          'Au milieu de la bataille, relevant son casque quand le bruit court qu’il est mort, selon son chapelain Guillaume de Poitiers.',
        sens:
          'La rumeur de la mort du chef suffisait à faire fuir une armée : en se montrant, Guillaume sauve sa journée.',
      },
      {
        texte: 'Ici le roi Harold fut tué.',
        qui: 'L’inscription de la tapisserie de Bayeux',
        contexte:
          'Brodée au-dessus de la dernière scène de la bataille, vers 1077, à la demande d’Odon de Bayeux, demi-frère de Guillaume.',
        sens:
          'La broderie de près de soixante-dix mètres qui raconte toute la conquête est le plus grand reportage illustré du Moyen Âge.',
      },
      {
        texte:
          'Il n’y eut pas une seule hide, pas un seul bœuf, pas une seule vache qui ne fût inscrit dans son registre.',
        qui: 'La Chronique anglo-saxonne',
        contexte:
          'À propos du *Domesday Book*, le grand recensement des terres d’Angleterre ordonné par Guillaume en 1086.',
        sens:
          'Vingt ans après la conquête, le roi sait exactement ce que possède chaque habitant : aucun État d’Europe n’en est alors capable.',
      },
    ],
    reperes: [
      'Édouard le Confesseur meurt sans enfant le 5 janvier 1066 ; trois hommes revendiquent sa couronne.',
      'Harold Godwinson est couronné dès le lendemain ; Guillaume de Normandie dit avoir reçu sa promesse.',
      'Harold bat les Norvégiens à Stamford Bridge le 25 septembre, puis redescend 400 km en deux semaines.',
      'Le 14 octobre 1066, archers et cavalerie normands viennent à bout du mur de boucliers saxon.',
      'Harold est tué ; Guillaume est couronné à Westminster le jour de Noël 1066.',
      'La tapisserie de Bayeux, longue de près de 70 mètres, raconte toute l’affaire en images.',
    ],
    causes: [
      'La mort sans héritier direct d’Édouard le Confesseur, roi d’Angleterre, le 5 janvier 1066.',
      'La promesse de succession que Guillaume affirme avoir reçue d’Édouard, son cousin, vers 1051.',
      'Le serment qu’Harold aurait prêté à Guillaume sur des reliques, en Normandie, vers 1064.',
      'Le couronnement immédiat d’Harold Godwinson, le plus puissant seigneur d’Angleterre.',
      'Le soutien du pape Alexandre II, qui envoie à Guillaume une bannière bénite.',
      'L’invasion norvégienne de Harald Hardrada, qui oblige Harold à combattre au nord avant de redescendre.',
      'Un vent contraire qui retient six semaines la flotte normande — et la fait débarquer juste après Stamford Bridge.',
    ],
    recit: [
      {
        titre: 'Trois hommes pour une couronne',
        texte:
          'Le **5 janvier 1066**, **Édouard le Confesseur**, roi d’Angleterre, meurt sans enfant. Trois hommes se disent ses héritiers. **Harold Godwinson**, comte de Wessex, le plus puissant seigneur du royaume et beau-frère du roi défunt, est couronné dès le lendemain par l’assemblée des grands. **Harald Hardrada**, roi de Norvège, invoque un vieil accord entre souverains scandinaves. Et **Guillaume**, duc de Normandie, cousin d’Édouard, affirme que le roi lui a promis sa succession vers 1051 — et qu’**Harold lui-même**, retenu en Normandie vers 1064, a juré sur des reliques de l’aider à l’obtenir. La tapisserie de Bayeux brode la scène du serment. Qu’il ait été prêté librement ou arraché, ce serment donne à Guillaume ce qui lui manquait : un **droit**, et bientôt une bannière bénite par le pape **Alexandre II**.',
      },
      {
        titre: 'Deux batailles en trois semaines',
        texte:
          'L’été 1066, Harold attend Guillaume sur la côte sud avec sa flotte et son armée. Le vent contraire retient les Normands six semaines ; les vivres manquent, et le 8 septembre Harold renvoie ses hommes chez eux. C’est le moment que choisit **Harald Hardrada** pour débarquer dans le Nord avec trois cents navires. Harold remonte à marche forcée et l’écrase à **Stamford Bridge** le **25 septembre** ; le roi de Norvège y meurt. Trois jours plus tard, le vent tourne enfin : **Guillaume débarque à Pevensey le 28 septembre**, sans rencontrer personne. Harold redescend alors **quatre cents kilomètres en deux semaines**, avec une armée épuisée et incomplète. Il aurait pu attendre ses renforts du Nord. Il choisit d’attaquer tout de suite.',
      },
      {
        titre: 'Neuf heures sur la colline',
        texte:
          'Le **14 octobre 1066**, vers neuf heures du matin, deux armées d’environ **sept mille hommes** se font face au nord de Hastings. Les Anglo-Saxons tiennent la crête, à pied, serrés en **mur de boucliers**, avec les redoutables haches danoises de la garde royale. Guillaume dispose de trois armes que son adversaire n’a pas : des **archers**, de l’**infanterie** de manœuvre et surtout une **cavalerie lourde**. Pendant des heures, les charges normandes se brisent sur le mur. À un moment, le bruit court que le duc est mort ; Guillaume relève son casque et crie à ses hommes de le regarder. Puis les Normands reculent — par accident d’abord, par ruse ensuite : les Saxons rompent les rangs pour les poursuivre, et la cavalerie se retourne sur eux. À la tombée du jour, **Harold est tué** et son armée se disperse.',
      },
      {
        titre: 'Une île qui change de maître',
        texte:
          'Guillaume est couronné à **Westminster le 25 décembre 1066**, mais il lui faudra cinq ans pour tenir vraiment le pays. Il écrase les révoltes du Nord avec une dureté restée célèbre, et couvre l’Angleterre de **châteaux à motte**, puis de donjons de pierre — la **Tour de Londres** en est un. Surtout, il change les propriétaires : vingt ans après la conquête, il ne reste presque aucun grand seigneur anglo-saxon, et les terres sont aux mains de quelques milliers de Normands. En **1086**, il fait recenser toutes les terres du royaume, leurs bêtes et leurs habitants dans le *Domesday Book*, le « livre du Jugement dernier » : aucun État d’Europe ne sait alors aussi précisément ce qu’il possède.',
      },
      {
        titre: 'Le français à Londres, et ce qui en découle',
        texte:
          'Pendant trois siècles, la cour, la justice et l’administration anglaises parlent **français**. L’anglais, resté langue du peuple, y perd une partie de ses formes anciennes et y gagne des milliers de mots : *justice*, *prison*, *beef*, *government*, *parliament*. Aujourd’hui encore, la devise de la monarchie britannique, *Dieu et mon droit*, est en français. L’autre conséquence est politique et durera bien plus longtemps : le roi d’Angleterre est aussi **duc de Normandie**, donc **vassal du roi de France** pour ses terres continentales. Un roi qui doit hommage à un autre roi, c’est une querelle sans fin : elle mène à **Bouvines** en 1214, puis à la **guerre de Cent Ans** à partir de 1337.',
      },
    ],
    consequences: [
      'L’aristocratie anglo-saxonne est remplacée : vers 1086, presque toutes les grandes terres sont aux mains de Normands.',
      'Le français devient pour trois siècles la langue de la cour et de la justice en Angleterre.',
      'L’anglais absorbe des milliers de mots français, qui forment encore une grande part de son vocabulaire.',
      'Le roi d’Angleterre, duc de Normandie, est vassal du roi de France : la source de six siècles de conflits.',
      'Le Domesday Book de 1086 donne à l’Angleterre l’administration la plus précise d’Europe.',
      'Châteaux à motte, donjons de pierre et Tour de Londres marquent durablement le paysage anglais.',
    ],
    chiffres: [
      { valeur: '70 m', quoi: 'la longueur de la tapisserie de Bayeux' },
      { valeur: '9 heures', quoi: 'la durée de la bataille, du matin à la tombée du jour' },
      { valeur: '400 km', quoi: 'parcourus par Harold entre Stamford Bridge et Hastings' },
      { valeur: '7 000', quoi: 'hommes environ dans chacune des deux armées' },
    ],
    chrono: [
      { date: '5 janvier 1066', fait: 'Mort d’Édouard le Confesseur, sans héritier.' },
      { date: '6 janvier 1066', fait: 'Harold Godwinson est couronné à Westminster.' },
      { date: '25 septembre 1066', fait: 'Harold écrase les Norvégiens à Stamford Bridge.' },
      { date: '28 septembre 1066', fait: 'Guillaume débarque à Pevensey avec son armée.' },
      { date: '14 octobre 1066', fait: 'Bataille d’Hastings ; Harold est tué.' },
      { date: '25 décembre 1066', fait: 'Guillaume est couronné roi à Westminster.' },
      { date: '1086', fait: 'Le *Domesday Book* recense toutes les terres d’Angleterre.' },
      { date: '1087', fait: 'Mort de Guillaume le Conquérant, à Rouen.' },
    ],
    leSaisTu:
      'La flèche dans l’œil d’Harold est peut-être une erreur de couture. Sur la tapisserie de Bayeux, la scène a été restaurée au XIXᵉ siècle, et les trous d’aiguille d’origine ne suivent pas exactement la flèche que l’on voit aujourd’hui. Les chroniques les plus anciennes, elles, disent seulement qu’Harold tomba sous les coups de plusieurs chevaliers.',
    aRetenir: [
      'Le 14 octobre 1066, Guillaume, duc de Normandie, bat le roi Harold à Hastings.',
      'Harold est tué ; Guillaume est couronné roi d’Angleterre le 25 décembre 1066.',
      'La conquête remplace l’aristocratie anglo-saxonne par une noblesse normande.',
      'Le français devient la langue de la cour d’Angleterre pour trois siècles.',
      'Le roi d’Angleterre, duc de Normandie, est vassal du roi de France : une cause lointaine de la guerre de Cent Ans.',
    ],
    mots: [
      {
        mot: 'Mur de boucliers',
        sens: 'Formation saxonne où les guerriers serrent leurs boucliers pour former une muraille continue.',
      },
      {
        mot: 'Château à motte',
        sens: 'Tour de bois posée sur une butte de terre entourée d’une palissade : le château normand de conquête.',
      },
      {
        mot: 'Domesday Book',
        sens: 'Le « livre du Jugement dernier » : recensement de toutes les terres d’Angleterre ordonné en 1086.',
      },
      {
        mot: 'Hommage',
        sens: 'Cérémonie où un vassal met ses mains dans celles de son seigneur et lui jure fidélité.',
      },
    ],
    lies: [
      'guillaume-le-conquerant',
      'alienor-d-aquitaine',
      'philippe-auguste',
      'bataille-de-bouvines',
      'avenement-d-hugues-capet',
    ],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Hastings',
      '1066',
      'Guillaume le Conquérant',
      'Harold',
      'Normandie',
      'tapisserie de Bayeux',
      'Angleterre',
      'Stamford Bridge',
      'Domesday Book',
      'conquête normande',
      'Westminster',
    ],
  },
  {
    id: 'premiere-croisade',
    volet: 'evenements',
    nom: 'La première croisade',
    date: '1095 – 1099',
    tri: 1095,
    fin: 1099,
    periode: 'moyen-age',
    emoji: '✝️',
    lieu: 'De Clermont à Jérusalem',
    accroche:
      'Au concile de Clermont, le pape appelle les chevaliers d’Occident à délivrer Jérusalem : quatre ans plus tard, la ville est prise.',
    citations: [
      {
        texte: 'Dieu le veut !',
        qui: 'La foule du concile de Clermont',
        contexte:
          'Cri repris par l’assistance à la fin du sermon du pape Urbain II, le 27 novembre 1095, en Auvergne.',
        sens:
          'En latin *Deus lo vult*. Il devient le cri de ralliement des croisés et se brode sur leurs bannières.',
      },
      {
        texte: 'Que ceux qui étaient naguère des brigands deviennent des soldats du Christ.',
        qui: 'Urbain II',
        contexte:
          'Sermon de Clermont, 27 novembre 1095, tel que le rapportent des chroniqueurs qui écrivent tous après la prise de Jérusalem.',
        sens:
          'Le pape propose aux chevaliers de porter leur violence hors de la chrétienté : c’est aussi une façon de pacifier l’Occident.',
        incertaine: true,
      },
      {
        texte:
          'On chevauchait dans le sang jusqu’aux genoux et jusqu’aux brides des chevaux.',
        qui: 'Raymond d’Aguilers, chroniqueur de la croisade',
        contexte:
          'Décrivant la prise de Jérusalem, le 15 juillet 1099, dans le quartier du Temple.',
        sens:
          'Le chroniqueur est un croisé : il rapporte le massacre comme un accomplissement. L’image est sans doute exagérée, le massacre ne l’est pas.',
      },
    ],
    reperes: [
      'L’empereur byzantin Alexis Comnène demande des renforts à l’Occident contre les Turcs seldjoukides.',
      'Le 27 novembre 1095, au concile de Clermont, Urbain II appelle à délivrer Jérusalem.',
      'Les croisés cousent une croix d’étoffe sur leur épaule : ce sont des pèlerins en armes.',
      'Une croisade populaire part la première, au printemps 1096, et est anéantie en Anatolie.',
      'Antioche tombe en juin 1098 après huit mois de siège ; Jérusalem le 15 juillet 1099.',
      'Quatre États latins d’Orient naissent, dont le royaume de Jérusalem.',
    ],
    causes: [
      'La conquête de l’Anatolie par les Turcs seldjoukides après leur victoire de Manzikert, en 1071.',
      'L’appel au secours de l’empereur byzantin Alexis Comnène, adressé au pape en 1095.',
      'Les difficultés nouvelles du pèlerinage à Jérusalem, que des milliers de chrétiens accomplissaient chaque année.',
      'La volonté du pape Urbain II d’affirmer l’autorité de Rome et de se rapprocher des Églises d’Orient.',
      'L’espoir de détourner hors de la chrétienté la violence des chevaliers, que la paix de Dieu peinait à contenir.',
      'La promesse d’une indulgence plénière : pour le croisé, le voyage vaut pour toute pénitence.',
      'Pour les cadets de famille sans terre, la perspective d’un fief à conquérir en Orient.',
    ],
    recit: [
      {
        titre: 'L’appel de Clermont',
        texte:
          'Le **27 novembre 1095**, au terme d’un concile réuni à **Clermont**, en Auvergne, le pape **Urbain II** sort de l’église pour parler en plein champ à une foule trop nombreuse. Il annonce que les chrétiens d’Orient sont opprimés, que les lieux saints sont menacés, et il appelle les chevaliers d’Occident à partir les délivrer. À ceux qui feront le vœu, il promet l’**indulgence plénière** : le voyage vaudra pour toute pénitence. La foule répond, disent les chroniqueurs, par un cri — **« Dieu le veut ! »** — et l’on distribue des croix d’étoffe à coudre sur l’épaule. Le départ est fixé au **15 août 1096**. Aucun des quatre récits du sermon n’a été écrit avant la prise de Jérusalem, et ils ne disent pas tout à fait la même chose ; l’effet, lui, est indiscutable : en quelques mois, des dizaines de milliers d’hommes prennent la route.',
      },
      {
        titre: 'Un pèlerinage en armes',
        texte:
          'Il faut comprendre ce qu’est une croisade pour ceux qui partent : un **pèlerinage**, comme on en faisait à Rome ou à Saint-Jacques, mais en armes. Le croisé prononce un **vœu**, coud une croix sur son manteau, vend ou hypothèque ses biens pour payer la route, et part pour trois ans avec l’idée de prier au **Saint-Sépulcre**. Beaucoup ne sont pas chevaliers. Dès le printemps **1096**, une **croisade populaire** s’ébranle sans attendre, entraînée par le prédicateur **Pierre l’Ermite**. Sur son passage en Rhénanie, des bandes attaquent les communautés juives de **Spire, Worms et Mayence** : des milliers de personnes sont tuées, malgré les évêques qui tentent d’en protéger une partie. Ces troupes atteignent l’Anatolie sans organisation ni vivres et y sont anéanties par les Turcs à **Civetot**, en octobre 1096.',
      },
      {
        titre: 'Trois mille kilomètres',
        texte:
          'L’armée des barons part à l’automne : **Godefroy de Bouillon** et son frère Baudouin, **Raymond de Saint-Gilles** comte de Toulouse, **Bohémond de Tarente**, Robert de Normandie. Ils convergent sur **Constantinople**, où l’empereur **Alexis Comnène**, qui espérait des mercenaires et voit arriver des armées entières, leur fait jurer de lui rendre les villes reprises. Puis c’est la marche : **Nicée** en juin 1097, la victoire de **Dorylée**, la traversée du plateau anatolien en plein été, où l’on perd les chevaux et une partie des hommes. Devant **Antioche**, le siège dure **huit mois** ; la ville tombe en juin 1098 et les croisés y sont aussitôt assiégés à leur tour, affamés, sauvés par une sortie désespérée. De l’armée partie d’Occident, moins de la moitié atteindra la Judée.',
      },
      {
        titre: 'Jérusalem, 15 juillet 1099',
        texte:
          'Les croisés arrivent devant **Jérusalem** le 7 juin 1099. La ville, tenue par une garnison **fatimide**, a des murs solides et les puits alentour ont été comblés. Il faut cinq semaines, du bois amené de Jaffa par des navires génois et deux **tours roulantes** pour donner l’assaut. Le **15 juillet 1099**, les hommes de Godefroy de Bouillon passent sur le rempart nord. Suit un **massacre** de plusieurs jours : la population musulmane et la communauté juive de la ville sont tuées en grand nombre, et les chroniqueurs croisés eux-mêmes décrivent des rues couvertes de sang — non pour s’en plaindre, mais pour dire l’accomplissement d’une prophétie. **Godefroy de Bouillon** refuse le titre de roi dans la ville où le Christ fut couronné d’épines : il se fait appeler **avoué du Saint-Sépulcre**. Son frère Baudouin, lui, sera roi dès 1100.',
      },
      {
        titre: 'Ce que la croisade laisse',
        texte:
          'Quatre **États latins** naissent en Orient : le royaume de **Jérusalem**, la principauté d’**Antioche**, les comtés d’**Édesse** et de **Tripoli**. Pour les défendre et protéger les pèlerins, des **ordres religieux militaires** se fondent — les **Templiers** en 1119, les **Hospitaliers** de Saint-Jean —, moines et soldats à la fois. Ces États tiennent tant bien que mal jusqu’à ce que **Saladin** reprenne Jérusalem en **1187** ; le dernier, Acre, tombe en 1291. Entre-temps, sept autres croisades sont prêchées, dont deux menées par **Saint Louis**. Le contact, lui, ne s’interrompt plus : marchandises, techniques, mots (*amiral*, *coton*, *sucre*), textes grecs et arabes passent d’un monde à l’autre. Et des deux côtés, la mémoire de ces deux siècles reste vive longtemps après la dernière bataille.',
      },
    ],
    consequences: [
      'Quatre États latins naissent en Orient : Jérusalem, Antioche, Édesse et Tripoli.',
      'Des ordres religieux militaires apparaissent : les Templiers en 1119, les Hospitaliers de Saint-Jean.',
      'Le massacre de la prise de Jérusalem marque durablement la mémoire des populations d’Orient.',
      'Les communautés juives de Rhénanie, attaquées en 1096, subissent les premiers grands massacres de l’Occident médiéval.',
      'Sept autres croisades suivront pendant deux siècles, jusqu’à la chute d’Acre en 1291.',
      'Les échanges s’intensifient entre Orient et Occident : marchandises, techniques, mots, savoirs grecs et arabes.',
      'Byzance, qui avait demandé des renforts, se méfiera désormais des Latins.',
    ],
    chiffres: [
      { valeur: '4 ans', quoi: 'entre l’appel de Clermont et la prise de Jérusalem' },
      { valeur: '3 000 km', quoi: 'de marche entre la France et Jérusalem' },
      { valeur: '8 mois', quoi: 'de siège devant Antioche' },
      { valeur: '4', quoi: 'États latins fondés en Orient' },
    ],
    chrono: [
      { date: '1071', fait: 'Manzikert : les Turcs seldjoukides battent l’armée byzantine.' },
      { date: 'mars 1095', fait: 'Alexis Comnène demande des renforts au concile de Plaisance.' },
      { date: '27 novembre 1095', fait: 'Appel d’Urbain II au concile de Clermont.' },
      { date: 'printemps 1096', fait: 'Croisade populaire ; massacres des juifs de Rhénanie.' },
      { date: 'octobre 1096', fait: 'La croisade populaire est anéantie à Civetot.' },
      { date: 'juin 1097', fait: 'Prise de Nicée, puis victoire de Dorylée.' },
      { date: 'juin 1098', fait: 'Prise d’Antioche après huit mois de siège.' },
      { date: '15 juillet 1099', fait: 'Prise de Jérusalem et massacre de ses habitants.' },
      { date: '1099', fait: 'Godefroy de Bouillon, avoué du Saint-Sépulcre.' },
      { date: '1187', fait: 'Saladin reprend Jérusalem aux Latins.' },
    ],
    leSaisTu:
      'Le mot « croisade » n’existe pas au XIᵉ siècle. On parle du *voyage*, du *pèlerinage*, du *chemin de Jérusalem*. Ceux qui partent cousent une croix d’étoffe sur l’épaule droite : on les appelle les *croisés*, « marqués de la croix ». Le mot « croisade », lui, n’apparaît en français qu’au XVᵉ siècle, quatre cents ans plus tard.',
    aRetenir: [
      'Le 27 novembre 1095, au concile de Clermont, le pape Urbain II appelle à délivrer Jérusalem.',
      'La croisade est un pèlerinage armé : le croisé prononce un vœu et reçoit l’indulgence.',
      'Les croisés prennent Nicée en 1097, Antioche en 1098 et Jérusalem le 15 juillet 1099.',
      'La prise de Jérusalem s’accompagne du massacre d’une grande partie de ses habitants.',
      'Quatre États latins d’Orient naissent, et sept autres croisades suivront jusqu’en 1291.',
    ],
    mots: [
      {
        mot: 'Croisade',
        sens: 'Expédition militaire de chrétiens d’Occident vers la Terre sainte, prêchée par le pape.',
      },
      {
        mot: 'Indulgence',
        sens: 'Remise des peines dues pour ses péchés, accordée ici à celui qui part en croisade.',
      },
      {
        mot: 'Seldjoukides',
        sens: 'Dynastie turque qui domine au XIᵉ siècle la Perse, la Syrie et une grande partie de l’Anatolie.',
      },
      {
        mot: 'Avoué du Saint-Sépulcre',
        sens: 'Titre choisi par Godefroy de Bouillon : il refuse d’être roi là où le Christ fut couronné d’épines.',
      },
    ],
    lies: [
      'saladin',
      'saint-louis',
      'saint-bernard-de-clairvaux',
      'mahomet',
      'bataille-d-hastings',
    ],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ-XIIIᵉ siècles), des mondes en contact',
    tags: [
      'croisade',
      'Clermont',
      'Urbain II',
      'Jérusalem',
      '1099',
      'Godefroy de Bouillon',
      'Antioche',
      'Terre sainte',
      'pèlerinage',
      'Seldjoukides',
      'Byzance',
      'Templiers',
    ],
  },
  {
    id: 'bataille-de-bouvines',
    volet: 'evenements',
    nom: 'La bataille de Bouvines',
    date: '27 juillet 1214',
    tri: 1214,
    periode: 'moyen-age',
    emoji: '🏇',
    lieu: 'Bouvines, près de Lille',
    accroche:
      'Philippe Auguste bat d’un coup l’empereur, l’Angleterre et la Flandre : un dimanche de juillet, le royaume se découvre une nation.',
    citations: [
      {
        texte: 'Montjoie Saint-Denis !',
        qui: 'L’armée royale française',
        contexte:
          'Cri de guerre poussé autour de l’oriflamme de l’abbaye de Saint-Denis, à Bouvines, le 27 juillet 1214.',
        sens:
          'Le cri de guerre des rois de France depuis les Capétiens : il lie la couronne au saint protecteur du royaume.',
      },
      {
        texte: 'Ferrand est ferré !',
        qui: 'La foule parisienne',
        contexte:
          'En voyant Ferrand, comte de Flandre, entrer enchaîné dans Paris après la bataille.',
        sens:
          'Jeu de mots populaire : le comte vaincu est « ferré » comme un cheval. Paris fêtera la victoire sept jours durant.',
      },
      {
        texte: 'Toute notre espérance et toute notre confiance sont en Dieu.',
        qui: 'Philippe Auguste',
        contexte:
          'Prière du roi avant l’engagement, rapportée par son chapelain Guillaume le Breton, témoin de la journée.',
        incertaine: true,
      },
    ],
    reperes: [
      'Philippe Auguste a conquis sur Jean sans Terre la Normandie, l’Anjou et le Poitou entre 1202 et 1204.',
      'Jean sans Terre monte et finance une coalition avec l’empereur Otton IV et deux vassaux révoltés du roi.',
      'L’armée royale rassemble chevaliers et milices des communes du Nord : environ sept mille hommes.',
      'Le dimanche 27 juillet 1214, la bataille se livre près du pont de la Marque, à Bouvines.',
      'Otton IV s’enfuit ; Ferrand de Flandre et Renaud de Dammartin sont faits prisonniers.',
      'Le royaume fête la victoire pendant sept jours : c’est la première liesse nationale française.',
    ],
    causes: [
      'La montée en puissance des Capétiens depuis un siècle, qui inquiète tous leurs voisins.',
      'La confiscation par Philippe Auguste, en 1202, des fiefs français de son vassal Jean sans Terre, roi d’Angleterre.',
      'La conquête de la Normandie en 1204, qui prive les Plantagenêts de leur berceau continental.',
      'La volonté de Jean sans Terre de reprendre ses terres, financée par l’argent anglais.',
      'L’alliance de l’empereur Otton IV, excommunié par le pape, avec le roi d’Angleterre.',
      'La révolte de deux grands vassaux du roi, Ferrand de Flandre et Renaud de Dammartin.',
      'Le choix d’un dimanche, jour où l’on ne livre pas bataille : la surprise joue pour le roi.',
    ],
    recit: [
      {
        titre: 'Pourquoi une coalition',
        texte:
          'Depuis 1154, les rois d’Angleterre, les **Plantagenêts**, possèdent en France plus de terres que le roi de France lui-même : Normandie, Anjou, Maine, Touraine, Aquitaine. **Philippe Auguste** passe son règne à démonter cet ensemble. En **1202**, il convoque son vassal **Jean sans Terre** devant sa cour et, faute de comparution, confisque ses fiefs français ; en **1204**, il enlève la Normandie et le formidable **Château-Gaillard** bâti par Richard Cœur de Lion. Dix ans plus tard, Jean sans Terre veut tout reprendre. Il ne le peut pas seul : il **achète** des alliés. L’empereur **Otton IV**, excommunié par le pape, le comte de Flandre **Ferrand** et le comte de Boulogne **Renaud de Dammartin** — deux vassaux révoltés du roi de France — se joignent à lui. Le plan est une tenaille : Jean attaque par le Poitou, la coalition par le nord.',
      },
      {
        titre: 'Un dimanche de bataille',
        texte:
          'Le **dimanche 27 juillet 1214**, il fait très chaud. L’armée royale — environ **sept mille hommes**, chevaliers, sergents et **milices des communes** venues du Nord avec leurs chariots — vient de repasser le pont de la Marque, près du village de **Bouvines**, quand son arrière-garde est accrochée. On ne se bat pas le dimanche : ni la coalition ni le roi n’attendaient un combat rangé ce jour-là. Philippe fait déployer l’**oriflamme** de **Saint-Denis**, les prêtres chantent, et l’armée se retourne face à l’ennemi, soleil dans le dos. Le choc dure environ **trois heures**. À droite, la cavalerie conduite par l’évêque **Guérin** enfonce les Flamands ; au centre, le roi lui-même est **désarçonné**, tiré à terre par les crochets de piétons, sauvé par son armure et par ses chevaliers ; à gauche, les Boulonnais résistent longtemps dans un cercle de piques.',
      },
      {
        titre: 'Ferrand est ferré',
        texte:
          'Vers le soir, tout est joué. **Otton IV** a fui après que son cheval s’est effondré et que l’étendard impérial à l’aigle est tombé aux mains des Français. **Ferrand de Flandre**, blessé, et **Renaud de Dammartin**, qui s’est battu jusqu’au bout, sont faits prisonniers avec cent trente chevaliers. Le retour vers Paris est un triomphe : les villages sortent sur les routes, les maisons sont pavoisées, et la foule parisienne accueille le comte de Flandre enchaîné par un jeu de mots qui court tout le royaume — **« Ferrand est ferré »**. Les étudiants de la jeune université dansent **sept jours et sept nuits**. C’est la première fois qu’une victoire est fêtée par le royaume entier, et pas seulement par ceux qui l’ont remportée.',
      },
      {
        titre: 'Ce que la journée décide',
        texte:
          'Bouvines règle en un après-midi trois affaires européennes. **Jean sans Terre** perd définitivement l’espoir de reprendre la Normandie et l’Anjou ; rentré en Angleterre sans argent ni prestige, il doit accorder l’année suivante à ses barons révoltés la **Grande Charte** de **1215**, texte fondateur des libertés anglaises. **Otton IV**, vaincu et discrédité, perd le trône impérial au profit de **Frédéric II**, candidat du pape et de Philippe. Et le **roi de France** devient, pour un siècle, le souverain le plus puissant d’Occident : de 1180 à 1223, son domaine a environ **quadruplé** et ses revenus plus que doublé.',
      },
      {
        titre: 'Le jour où le royaume se sent français',
        texte:
          'Il y a autre chose, plus difficile à mesurer et peut-être plus important. Aux côtés des chevaliers se battent ce jour-là les **milices des communes** — des bouchers, des drapiers, des charrons de Corbie, d’Amiens, d’Arras, de Beauvais —, et c’est un **roi sacré** qu’elles défendent, sous la bannière d’un saint, contre un empereur excommunié. Le chapelain du roi, **Guillaume le Breton**, témoin de la bataille, en tire une épopée latine, la *Philippide*, qu’on lira pendant des siècles. L’historien **Georges Duby** a consacré à cette seule journée un livre entier, pour cette raison : Bouvines est le moment où des gens qui n’avaient presque rien en commun découvrent qu’ils ont un **roi commun** et une victoire à fêter ensemble.',
      },
    ],
    consequences: [
      'L’empire continental des Plantagenêts est perdu : Normandie, Anjou et Poitou restent au roi de France.',
      'Jean sans Terre, ruiné et discrédité, doit accorder à ses barons la Grande Charte en 1215.',
      'Otton IV perd son trône impérial au profit de Frédéric II, soutenu par le pape et par Philippe.',
      'Le roi de France devient pour un siècle le souverain le plus puissant d’Occident.',
      'La victoire est fêtée dans tout le royaume : les sujets du roi se découvrent un destin commun.',
      'Le domaine royal, minuscule en 987, a environ quadruplé sous le seul règne de Philippe Auguste.',
    ],
    chiffres: [
      { valeur: '7 000', quoi: 'hommes environ dans l’armée royale' },
      { valeur: '3 heures', quoi: 'la durée du combat, un dimanche après-midi' },
      { valeur: '7 jours', quoi: 'de fêtes à Paris après la victoire' },
      { valeur: '4 fois', quoi: 'plus grand : le domaine royal à la fin du règne' },
    ],
    chrono: [
      { date: '1180', fait: 'Philippe Auguste devient roi à quinze ans.' },
      { date: '1202', fait: 'Le roi confisque les fiefs français de Jean sans Terre.' },
      { date: '1204', fait: 'Conquête de la Normandie ; Château-Gaillard tombe.' },
      { date: '2 juillet 1214', fait: 'Le prince Louis bat Jean sans Terre à La Roche-aux-Moines.' },
      { date: '27 juillet 1214', fait: 'Victoire de Bouvines sur la coalition.' },
      { date: 'août 1214', fait: 'Sept jours de fêtes sur la route de Paris et dans la capitale.' },
      { date: '1215', fait: 'Jean sans Terre, affaibli, doit accorder la Grande Charte.' },
      { date: '1223', fait: 'Mort de Philippe Auguste ; le domaine royal a quadruplé.' },
    ],
    leSaisTu:
      'Les étudiants de Paris ont dansé sept jours et sept nuits. Quand la nouvelle arrive, les rues sont tendues de tapis, les maisons pavoisées, et les écoliers de la toute jeune université quittent leurs bancs pour chanter dans la ville. Guillaume le Breton, chapelain du roi et témoin de la bataille, note qu’on n’avait jamais vu pareille fête.',
    aRetenir: [
      'Le 27 juillet 1214, Philippe Auguste bat à Bouvines la coalition d’Otton IV, de la Flandre et de l’Angleterre.',
      'La coalition avait été montée et financée par Jean sans Terre, roi d’Angleterre.',
      'La victoire confirme la conquête de la Normandie, de l’Anjou et du Poitou par le roi de France.',
      'Affaibli, Jean sans Terre doit accorder la Grande Charte à ses barons en 1215.',
      'Bouvines est la première victoire fêtée par le royaume entier : un sentiment national apparaît.',
    ],
    mots: [
      {
        mot: 'Oriflamme',
        sens: 'Bannière rouge de l’abbaye de Saint-Denis que le roi de France vient prendre avant de partir en guerre.',
      },
      {
        mot: 'Coalition',
        sens: 'Alliance de plusieurs princes ou États contre un ennemi commun.',
      },
      {
        mot: 'Plantagenêts',
        sens: 'Dynastie des rois d’Angleterre qui possédaient aussi la moitié ouest de la France.',
      },
      {
        mot: 'Commune',
        sens: 'Ville ayant obtenu une charte de libertés, qui fournit au roi une milice armée.',
      },
    ],
    lies: [
      'philippe-auguste',
      'blanche-de-castille',
      'saint-louis',
      'avenement-d-hugues-capet',
      'bataille-d-hastings',
    ],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Bouvines',
      '1214',
      'Philippe Auguste',
      'Otton IV',
      'Jean sans Terre',
      'Ferrand de Flandre',
      'Montjoie',
      'Plantagenêts',
      'Grande Charte',
      'oriflamme',
      'Saint-Denis',
    ],
  },
]
