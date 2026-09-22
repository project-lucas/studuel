// -----------------------------------------------------------------------------
// MOYEN ÂGE — LES FONDATIONS : sainte Geneviève, Clovis, saint Benoît, Charles
// Martel, Charlemagne, Hugues Capet, Guillaume le Conquérant, Suger, saint
// Bernard de Clairvaux.
//
// Neuf fiches, une seule question : qui a POSÉ les pierres ? Une ville défendue,
// une règle de vie écrite pour des moines, un baptême à Reims, une école par
// évêché, une dynastie qui tiendra huit siècles, un chevet percé de lumière.
// On raconte ce qu'ils ont bâti, tenu et protégé, DANS LEUR TEMPS — leur foi
// prise au sérieux comme moteur de leurs actes, leurs violences dites sans
// procès rétrospectif, aucun clin d'œil moqueur au lecteur d'aujourd'hui.
//
// Le patron d'écriture est celui de `personnages-moyen-age-rois.ts` ; le guide
// complet est dans `docs/encyclopedie.md`. Les fiches sont rangées par `tri`
// croissant, c'est-à-dire par année de mort.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_MOYEN_AGE_FONDATIONS: Personnage[] = [
  {
    id: 'sainte-genevieve',
    volet: 'personnages',
    nom: 'Sainte Geneviève',
    surnom: 'la patronne de Paris',
    dates: 'vers 420 – vers 502',
    tri: 502,
    periode: 'moyen-age',
    emoji: '🕯️',
    roles: ['Vierge consacrée', 'Sainte', 'Protectrice de Paris'],
    origine: 'Nanterre, en Gaule romaine',
    accroche:
      'Quand Attila marche sur la Gaule, elle empêche Paris de fuir et fait prier la ville : les Huns passent au large.',
    citations: [
      {
        texte:
          'Que les hommes fuient s’ils le veulent, s’ils ne sont plus capables de combattre ; nous, les femmes, nous prierons Dieu tant et tant qu’il exaucera nos prières.',
        contexte:
          'Aux Parisiens qui chargeaient déjà leurs bateaux pour quitter la ville devant Attila, en 451. Rapporté par la *Vie de sainte Geneviève*, écrite vers 520.',
        sens:
          'Elle ne demande pas un miracle à la place du combat : elle refuse que la ville soit abandonnée, et met les femmes en première ligne d’une autre bataille, celle de la prière.',
      },
      {
        texte:
          'Réjouissez-vous : l’enfant que vous avez mise au monde sera grande devant le Seigneur.',
        qui: 'Saint Germain d’Auxerre',
        contexte:
          'À Nanterre, aux parents de Geneviève, vers 429 : l’évêque de passage remarque une fillette de sept ans dans la foule et la consacre à Dieu.',
      },
    ],
    reperes: [
      'Née vers 420 à Nanterre, consacrée à Dieu vers sept ans par saint Germain d’Auxerre.',
      'En 451, elle empêche les Parisiens de fuir devant Attila : les Huns contournent la ville.',
      'Vers 465, pendant le blocus franc, elle ramène du blé par la Seine et nourrit Paris.',
      'Elle obtient de Childéric, puis de Clovis, la grâce de prisonniers condamnés.',
      'Elle fait élever une première basilique sur le tombeau de saint Denis.',
      'Morte vers 502, elle devient la patronne de Paris ; sa châsse traverse la ville aux jours de malheur.',
    ],
    recit: [
      {
        titre: 'Une enfant de Nanterre consacrée à Dieu',
        texte:
          'Geneviève naît vers 420 à **Nanterre**, dans une Gaule encore romaine mais qui se défait : l’administration recule, les garnisons se vident, les bandes armées circulent. Vers 429, l’évêque **Germain d’Auxerre** traverse le village en route pour la Bretagne ; il remarque dans la foule une fillette de sept ans, l’interroge, et lui passe au cou une médaille de cuivre marquée d’une croix — signe qu’elle s’est promise à Dieu et n’appartiendra à aucun mari. À la mort de ses parents, elle s’installe à **Paris**, alors une petite ville tassée dans l’île de la Cité. Elle y vit en **vierge consacrée** : elle ne fonde pas de monastère, elle ne prend pas de voile officiel, elle reste dans la ville, jeûne, prie la nuit, visite les malades et distribue ce qu’elle a. C’est cette femme sans titre ni fonction que Paris va suivre.',
      },
      {
        titre: 'Attila devant la Gaule, 451',
        texte:
          'Au printemps **451**, **Attila** et les Huns franchissent le Rhin et brûlent Metz. La nouvelle arrive à Paris : les habitants chargent leurs biens sur des bateaux pour fuir vers le sud. Geneviève les retient. Elle rassemble les femmes dans le baptistère, leur impose le jeûne et la prière, et assure que la ville sera épargnée si elle tient. On ne la croit pas : des Parisiens l’accusent d’être une fausse prophétesse et parlent de la lapider ou de la jeter à la Seine. L’arrivée d’un archidiacre d’Auxerre, porteur d’un pain bénit envoyé par **Germain**, retourne la foule. Attila, lui, oblique vers le sud : il assiège **Orléans**, échoue, et est battu aux **champs Catalauniques**, près de Châlons, en juin 451. Paris n’a pas été touché. Pour les Parisiens, il n’y a pas eu de hasard — il y a eu Geneviève.',
      },
      {
        titre: 'Le blé et les prisonniers',
        texte:
          'Vers 465, la ville subit une épreuve plus longue qu’un raid : les Francs de **Childéric**, père de Clovis, bloquent Paris pendant des années. La famine s’installe. Geneviève affrète des bateaux, remonte la Seine et la Marne jusqu’à **Arcis-sur-Aube** et **Troyes**, achète du blé et le ramène à Paris — un convoi de onze bateaux, dit son plus ancien biographe. Elle fait cuire le pain et le distribue elle-même, en commençant par les plus pauvres. Le même récit rapporte qu’elle obtint de Childéric la grâce de prisonniers qu’il allait exécuter : le roi païen, qui ne l’aimait guère, faisait fermer les portes de la ville pour ne pas l’entendre demander. Ravitailler une ville assiégée et arracher des condamnés au bourreau : son autorité ne vient d’aucune charge, elle vient de ce qu’elle fait.',
      },
      {
        titre: 'La ville qui l’a gardée',
        texte:
          'Geneviève connaît **Clovis** et **Clotilde**, et les pousse à bâtir. C’est elle qui fait élever une première basilique sur le tombeau de **saint Denis**, premier évêque de Paris martyrisé deux siècles plus tôt : l’abbaye royale de **Saint-Denis** est née là. Elle meurt vers 502 et est enterrée sur la colline de la rive gauche ; Clovis y fait construire la basilique des Saints-Apôtres, où lui-même et Clotilde seront inhumés. La colline porte depuis son nom : la **montagne Sainte-Geneviève**. Pendant treize siècles, Paris sort sa **châsse** en procession aux heures de peste, de crue ou de guerre — en 1129, l’épidémie du « mal des ardents » cesse pendant l’une d’elles, et la ville en fait une fête annuelle. Les reliques sont brûlées en 1793 ; la châsse actuelle, à **Saint-Étienne-du-Mont**, garde une pierre de son tombeau.',
      },
    ],
    chrono: [
      { date: 'vers 420', fait: 'Naissance à Nanterre.' },
      { date: 'vers 429', fait: 'Saint Germain d’Auxerre la consacre à Dieu.' },
      { date: '451', fait: 'Attila menace la Gaule : elle fait rester Paris.' },
      { date: 'vers 465', fait: 'Convoi de blé sur la Seine pendant le blocus franc.' },
      { date: 'vers 475', fait: 'Basilique élevée sur le tombeau de saint Denis.' },
      { date: 'vers 502', fait: 'Mort à Paris ; Clovis bâtit sa basilique sur sa tombe.' },
      { date: '1129', fait: 'Le « mal des ardents » cesse après la procession de sa châsse.' },
      { date: '1793', fait: 'Ses reliques sont brûlées en place de Grève.' },
    ],
    leSaisTu:
      'Le Panthéon n’a pas été bâti pour Voltaire. Louis XV, guéri d’une maladie mortelle en 1744, avait fait vœu d’élever une église neuve à sainte Geneviève ; le chantier s’achève en 1790. Deux ans plus tard, la Révolution en fait un temple pour ses grands hommes — mais la rue, elle, s’appelle toujours rue Clovis.',
    aRetenir: [
      'Sainte Geneviève, née vers 420 à Nanterre, est la patronne de Paris.',
      'En 451, elle convainc les Parisiens de ne pas fuir devant Attila : la ville est épargnée.',
      'Vers 465, pendant le blocus franc, elle ravitaille Paris en blé par la Seine.',
      'Elle fait bâtir une première basilique sur le tombeau de saint Denis.',
      'Morte vers 502, elle est enterrée à Paris ; Clovis et Clotilde sont inhumés près d’elle.',
    ],
    mots: [
      {
        mot: 'Vierge consacrée',
        sens: 'Femme qui se promet à Dieu et renonce au mariage, sans forcément entrer dans un monastère.',
      },
      {
        mot: 'Châsse',
        sens: 'Coffre précieux où l’on garde les restes d’un saint et qu’on porte en procession dans la ville.',
      },
      {
        mot: 'Reliques',
        sens: 'Restes du corps d’un saint, ou objets l’ayant touché, vénérés par les fidèles.',
      },
    ],
    lies: ['clovis', 'saint-benoit', 'jeanne-d-arc'],
    niveaux: ['5e'],
    programme: 'La christianisation de la Gaule et les débuts du royaume franc',
    tags: [
      'Geneviève',
      'Paris',
      'Nanterre',
      'Attila',
      'Huns',
      'Childéric',
      'Saint-Denis',
      'patronne de Paris',
      'Panthéon',
      'châsse',
    ],
  },
  {
    id: 'clovis',
    volet: 'personnages',
    nom: 'Clovis',
    surnom: 'le premier roi chrétien des Francs',
    dates: 'vers 466 – 511',
    tri: 511,
    periode: 'moyen-age',
    emoji: '🏺',
    roles: ['Roi des Francs', 'Chef de guerre', 'Fondateur des Mérovingiens'],
    origine: 'Tournai, royaume des Francs saliens',
    accroche:
      'Roi d’un petit peuple franc à quinze ans, il réunit la Gaule sous sa main et se fait baptiser à Reims : le premier roi catholique d’Occident.',
    citations: [
      {
        texte: 'Souviens-toi du vase de Soissons.',
        contexte:
          'Un an après l’incident, à la revue des troupes, en fendant le crâne du guerrier qui avait brisé le vase. Rapporté par Grégoire de Tours près d’un siècle plus tard.',
        sens:
          'Le roi franc n’était qu’un chef de bande qui partageait le butin à égalité. En frappant, Clovis dit qu’il ne l’est plus : désormais, ce qu’il décide ne se discute pas.',
        incertaine: true,
      },
      {
        texte:
          'Courbe la tête, fier Sicambre : adore ce que tu as brûlé, brûle ce que tu as adoré.',
        qui: 'Saint Remi, évêque de Reims',
        contexte:
          'Au baptême de Clovis, à Reims, un jour de Noël. Rapporté par Grégoire de Tours dans l’*Histoire des Francs*.',
        sens:
          'Sicambre est le nom antique d’un peuple franc. L’évêque lui demande de renverser sa vie : détruire ce qu’il vénérait hier, vénérer ce qu’il détruisait.',
      },
      {
        texte:
          'Jésus-Christ, toi que Clotilde dit être le fils du Dieu vivant, si tu me donnes la victoire sur ces ennemis, je croirai en toi et je me ferai baptiser en ton nom.',
        contexte:
          'Au plus fort de la bataille de Tolbiac contre les Alamans, quand son armée plie. Rapporté par Grégoire de Tours.',
      },
      {
        texte: 'Ah ! si j’avais été là avec mes Francs !',
        contexte:
          'En entendant un évêque raconter la Passion du Christ, selon une tradition reprise par les chroniqueurs du VIIᵉ siècle.',
        sens:
          'La phrase dit tout d’un converti de fraîche date : il entend l’Évangile avec des oreilles de chef de guerre, et voudrait délivrer le Christ l’épée à la main.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi des Francs saliens à quinze ans, en 481 : son royaume tient dans la région de Tournai.',
      '486 : sa victoire de Soissons sur Syagrius lui livre le nord de la Gaule.',
      'Il épouse Clotilde, princesse burgonde et chrétienne, qui le pousse au baptême.',
      'Baptisé à Reims par saint Remi avec trois mille guerriers, un jour de Noël.',
      '507 : à Vouillé, il écrase les Wisigoths et prend l’Aquitaine jusqu’aux Pyrénées.',
      'Il fait de Paris sa capitale ; à sa mort en 511, le royaume est partagé entre ses quatre fils.',
    ],
    recit: [
      {
        titre: 'Un roitelet de quinze ans',
        texte:
          'L’Empire romain d’Occident a disparu depuis cinq ans quand **Clovis** succède à son père Childéric, en **481**. Il a quinze ans et règne sur les **Francs saliens** de la région de Tournai : quelques milliers de guerriers, pas un royaume. La Gaule est un damier — les Wisigoths au sud de la Loire, les Burgondes à l’est, les Alamans sur le Rhin, les Bretons à l’ouest, et entre la Somme et la Loire un dernier lambeau d’administration romaine tenu par **Syagrius**, que les chroniqueurs appellent « roi des Romains ». En **486**, Clovis le bat à **Soissons** et met la main sur le nord de la Gaule, ses cités, ses routes, ses évêques et ses impôts. Il a vingt ans.',
      },
      {
        titre: 'Le vase de Soissons',
        texte:
          'L’histoire est racontée par **Grégoire de Tours** vers 590, près d’un siècle après les faits — c’est-à-dire qu’elle enseigne autant qu’elle rapporte. Au partage du butin de Soissons, un évêque réclame un **vase** liturgique de grande valeur. Clovis demande à ses hommes de le lui laisser en plus de sa part. Un guerrier refuse et fracasse le vase d’un coup de hache : *« Tu n’auras rien ici que ce que le sort te donnera vraiment. »* Chez les Francs, le chef n’est qu’un premier entre égaux, et le butin se tire au sort. Clovis se tait. Un an plus tard, à la **revue des troupes**, il s’arrête devant l’homme, juge ses armes mal tenues, les jette à terre ; l’autre se baisse, et le roi lui fend le crâne de sa francisque : « Souviens-toi du vase de Soissons. » La leçon est politique : un roi n’est plus un chef de bande.',
      },
      {
        titre: 'Reims, un jour de Noël',
        texte:
          'Vers 493, Clovis épouse **Clotilde**, nièce du roi des Burgondes et **catholique**. Elle le presse des années durant ; il refuse, puis accepte que leur fils soit baptisé. À **Tolbiac**, face aux Alamans, son armée plie : il promet de croire au Dieu de Clotilde s’il l’emporte, et l’emporte. **Saint Remi**, évêque de Reims, le prépare et le baptise avec, dit-on, trois mille de ses guerriers. La date exacte est perdue : Grégoire de Tours ne donne que le jour, **Noël**, et les historiens hésitent entre 496, 498 et 506. La conséquence, elle, est immense. Les autres rois barbares sont **ariens**, c’est-à-dire hérétiques aux yeux de Rome ; Clovis est le seul souverain **catholique** de l’Occident. Les évêques et la population gallo-romaine, majoritaires et mieux organisés que ses Francs, deviennent ses alliés. Il ne s’est pas seulement converti : il s’est donné un royaume.',
      },
      {
        titre: 'Vouillé, Paris, et un royaume partagé',
        texte:
          'En **507**, Clovis attaque les **Wisigoths** d’Alaric II et les écrase à **Vouillé**, près de Poitiers ; l’Aquitaine entre dans le royaume franc jusqu’aux Pyrénées. L’empereur d’Orient, **Anastase**, lui envoie à Tours les insignes du consulat : le chef barbare devient, aux yeux du monde romain, un souverain légitime. Il choisit **Paris** pour capitale, réunit en **511** le **concile d’Orléans** qui organise l’Église de son royaume, et fait mettre par écrit la **loi salique**, le droit des Francs. Il meurt le 27 novembre 511 et est enterré auprès de sainte Geneviève. Selon l’usage franc, le royaume est un héritage comme un autre : il est partagé entre ses **quatre fils**. Le partage recommencera à chaque génération — c’est la faiblesse des **Mérovingiens**, et l’une des raisons pour lesquelles une autre famille prendra leur place.',
      },
    ],
    chrono: [
      { date: '481', fait: 'Roi des Francs saliens à Tournai, à quinze ans.' },
      { date: '486', fait: 'Victoire de Soissons sur Syagrius.' },
      { date: 'vers 493', fait: 'Mariage avec Clotilde, princesse burgonde et chrétienne.' },
      { date: 'vers 496', fait: 'Bataille de Tolbiac contre les Alamans.' },
      { date: 'un jour de Noël', fait: 'Baptême à Reims par saint Remi.' },
      { date: '507', fait: 'Victoire de Vouillé : l’Aquitaine devient franque.' },
      { date: '508', fait: 'L’empereur d’Orient lui envoie les insignes consulaires à Tours.' },
      { date: '511', fait: 'Concile d’Orléans ; mort à Paris le 27 novembre.' },
    ],
    leSaisTu:
      'Clovis et Louis sont le même prénom. Le latin *Chlodovechus* a donné Clovis chez les chroniqueurs du Nord et *Ludovicus*, devenu Louis, à la cour. Dix-huit rois de France ont donc porté, sans y penser, le nom du premier d’entre eux — et Clotilde, Chlodéchilde, est sa sœur de nom.',
    aRetenir: [
      'Clovis est roi des Francs de 481 à 511 et fonde la dynastie mérovingienne.',
      'Sa victoire de Soissons en 486 met fin au dernier pouvoir romain en Gaule.',
      'Baptisé à Reims par saint Remi, il devient le seul roi catholique de l’Occident.',
      'La victoire de Vouillé, en 507, lui donne l’Aquitaine ; il fait de Paris sa capitale.',
      'À sa mort en 511, le royaume est partagé entre ses quatre fils, selon l’usage franc.',
    ],
    mots: [
      {
        mot: 'Mérovingiens',
        sens: 'La dynastie de Clovis, qui règne sur les Francs du Vᵉ au VIIIᵉ siècle ; elle tire son nom de Mérovée, son ancêtre légendaire.',
      },
      {
        mot: 'Arianisme',
        sens: 'Doctrine chrétienne qui refuse au Christ la pleine égalité avec Dieu le Père ; condamnée comme hérésie, elle était celle de la plupart des rois barbares.',
      },
      {
        mot: 'Loi salique',
        sens: 'Le droit écrit des Francs saliens, mis par écrit sous Clovis ; on en tirera bien plus tard l’exclusion des femmes du trône de France.',
      },
    ],
    lies: ['sainte-genevieve', 'charles-martel', 'charlemagne', 'hugues-capet'],
    niveaux: ['5e'],
    programme: 'La christianisation de la Gaule et les débuts du royaume franc',
    tags: [
      'Francs',
      'Mérovingiens',
      'vase de Soissons',
      'Reims',
      'saint Remi',
      'Clotilde',
      'Tolbiac',
      'Vouillé',
      'baptême',
      'Syagrius',
    ],
  },
  {
    id: 'saint-benoit',
    volet: 'personnages',
    nom: 'Saint Benoît de Nursie',
    surnom: 'le père des moines d’Occident',
    dates: 'vers 480 – 547',
    tri: 547,
    periode: 'moyen-age',
    emoji: '📖',
    roles: ['Moine', 'Abbé du Mont-Cassin', 'Patron de l’Europe'],
    origine: 'Nursie, en Ombrie',
    accroche:
      'Il écrit soixante-treize chapitres pour organiser la vie de quelques moines — et l’Occident entier y règle sa journée pendant mille ans.',
    citations: [
      {
        texte:
          'Écoute, mon fils, les préceptes du maître, et incline l’oreille de ton cœur.',
        contexte:
          'Les tout premiers mots de la Règle, dans son prologue, vers 540.',
        sens:
          'Toute la Règle tient dans ce verbe : avant de faire, écouter. Le moine n’entre pas au monastère pour se perfectionner tout seul, mais pour obéir à une parole qui vient d’ailleurs.',
      },
      {
        texte:
          'L’oisiveté est l’ennemie de l’âme ; c’est pourquoi les frères doivent s’occuper à certaines heures du travail des mains, à d’autres de la lecture divine.',
        contexte: 'Règle de saint Benoît, chapitre 48, « Le travail manuel quotidien ».',
        sens:
          'Le travail cesse d’être une punition réservée aux esclaves : il devient une part de la vie du moine, à égalité avec la prière et la lecture. L’Europe en vivra.',
      },
      {
        texte: 'Ora et labora.',
        contexte:
          'Devise des bénédictins. Elle ne figure pas dans la Règle : elle a été forgée bien après Benoît pour la résumer en deux mots.',
        sens: '« Prie et travaille » : la journée du moine se partage entre l’office et l’ouvrage.',
        incertaine: true,
      },
      {
        texte:
          'Que tous les hôtes qui surviennent soient reçus comme le Christ lui-même, car il dira un jour : j’étais un étranger et vous m’avez accueilli.',
        contexte: 'Règle de saint Benoît, chapitre 53, « La réception des hôtes ».',
        sens:
          'De cette phrase sortent les hôtelleries monastiques, les hospices et les premiers hôpitaux d’Europe : tout voyageur qui frappe est reçu, sans qu’on lui demande qui il est.',
      },
    ],
    reperes: [
      'Né vers 480 à Nursie, en Ombrie ; il quitte ses études à Rome pour vivre en ermite.',
      'Trois ans seul dans une grotte de Subiaco, nourri par un moine qui lui descend du pain.',
      'Vers 529, il fonde le Mont-Cassin, sur une hauteur entre Rome et Naples.',
      'Sa Règle, soixante-treize courts chapitres, partage la journée entre prière, travail et lecture.',
      'Elle s’impose à tout l’Occident : le concile d’Aix l’étend à l’Empire carolingien en 817.',
      'Sa sœur jumelle Scholastique est la première moniale de la famille bénédictine.',
    ],
    recit: [
      {
        titre: 'Fuir Rome pour une grotte',
        texte:
          'Benoît naît vers 480 à **Nursie**, dans les montagnes d’Ombrie, au moment où l’Italie passe aux mains des Ostrogoths. Envoyé étudier à **Rome**, il abandonne tout vers vingt ans, écœuré par la ville : il part vers l’est et s’enferme dans une grotte de **Subiaco**, au-dessus d’un lac. Il y reste trois ans, connu d’un seul homme, le moine Romain, qui lui descend du pain au bout d’une corde. Des bergers le découvrent. Sa réputation se répand ; les moines d’un monastère voisin, **Vicovaro**, viennent le chercher pour abbé — puis supportent si mal sa rigueur qu’ils tentent, dit son biographe le pape Grégoire le Grand, de l’empoisonner. Il repart à Subiaco et y fonde **douze petits monastères de douze moines**. Il a compris ce qui manque : non pas des héros solitaires, mais une maison, une règle, des frères.',
      },
      {
        titre: 'Soixante-treize chapitres',
        texte:
          'Vers 529, Benoît monte avec quelques frères sur le **Mont-Cassin**, une hauteur entre Rome et Naples où survit un temple d’Apollon, et y fonde le monastère qui deviendra le cœur du monachisme occidental. C’est là qu’il écrit sa **Règle** : soixante-treize chapitres courts, pour des « débutants », dit-il lui-même. Elle organise tout. La journée suit les **huit offices** qui rythment les heures, de la nuit au soir, et se partage ensuite entre **travail manuel** et **lecture**. Elle impose trois engagements : la **stabilité** — un moine reste toute sa vie dans le même monastère —, l’**obéissance** à un **abbé élu** par ses frères, et la conversion des mœurs. Elle règle le pain, le vin, les vêtements, le sommeil, l’accueil des pauvres, le soin des malades, la place des vieillards et des enfants. Surtout, elle est **mesurée** : l’abbé ne doit rien ordonner de trop dur, et doit consulter tous les frères, « parce que le Seigneur révèle souvent au plus jeune ce qui est meilleur ».',
      },
      {
        titre: 'Le travail des moines a fait l’Europe',
        texte:
          'Parce que la Règle impose des heures de travail, les monastères bénédictins deviennent des entreprises. Les moines **défrichent** les forêts, assèchent les marais, creusent des canaux, plantent la vigne et les vergers, élèvent des moulins et des forges. Parce qu’elle impose des heures de lecture, il faut des livres : dans le silence du **scriptorium**, les moines recopient la Bible, les Pères de l’Église — et, avec eux, Cicéron, Virgile, Tacite. Ils tiennent des **écoles**, des **hôtelleries**, des infirmeries qui sont les ancêtres de nos hôpitaux. En **817**, le concile d’Aix fait de la Règle bénédictine la règle **unique** de l’Empire carolingien. **Cluny** en 910, **Cîteaux** en 1098 en seront des réformes, non des rivales. En 1964, le pape Paul VI proclamera Benoît **patron de l’Europe** — pour une fois, un titre qui n’exagère rien.',
      },
      {
        titre: 'Une mort debout',
        texte:
          'Sa sœur jumelle **Scholastique** vit à quelques kilomètres ; ils se voient une fois l’an, dans une maison entre les deux monastères. Grégoire le Grand raconte leur dernière rencontre : elle le supplie de rester la nuit pour parler de Dieu, il refuse au nom de la Règle, elle prie, et un orage se lève qui l’empêche de repartir. Elle meurt six jours plus tard. Benoît la suit le **21 mars 547** : la tradition le montre mourant **debout** dans l’oratoire, soutenu par ses frères, les bras levés. Le Mont-Cassin sera détruit quatre fois — par les Lombards en 577, par les Sarrasins en 883, par un tremblement de terre en 1349, par les bombardements alliés le 15 février 1944 — et rebâti quatre fois à l’identique. Ce qu’il a écrit, lui, n’a jamais été détruit : on le lit encore chaque jour dans les monastères du monde entier.',
      },
    ],
    chrono: [
      { date: 'vers 480', fait: 'Naissance à Nursie, en Ombrie.' },
      { date: 'vers 500', fait: 'Il quitte Rome et vit trois ans en ermite à Subiaco.' },
      { date: 'vers 529', fait: 'Fondation du monastère du Mont-Cassin.' },
      { date: 'vers 540', fait: 'Rédaction de la Règle, en soixante-treize chapitres.' },
      { date: '547', fait: 'Mort au Mont-Cassin, le 21 mars.' },
      { date: '817', fait: 'Le concile d’Aix impose la Règle à tout l’Empire carolingien.' },
      { date: '910', fait: 'Fondation de Cluny, qui suit la Règle bénédictine.' },
      { date: '1964', fait: 'Paul VI le proclame patron de l’Europe.' },
    ],
    leSaisTu:
      'Presque tout ce qui nous reste de la littérature latine — Cicéron, Virgile, Tacite — a survécu parce que des moines l’ont recopié à la main. La Règle imposait plusieurs heures de lecture par jour : il fallait donc des livres, et pour avoir des livres, il fallait les écrire. Un seul manuscrit perdu, et l’auteur disparaissait pour toujours.',
    aRetenir: [
      'Benoît de Nursie (vers 480 – 547) fonde le Mont-Cassin vers 529 et écrit la Règle bénédictine.',
      'La Règle partage la journée du moine entre prière, travail manuel et lecture.',
      'Elle impose la stabilité, l’obéissance à un abbé élu et la mesure en toute chose.',
      'Le concile d’Aix l’étend à tout l’Empire carolingien en 817.',
      'Les monastères bénédictins défrichent, copient les manuscrits et tiennent écoles et hôtelleries.',
    ],
    mots: [
      {
        mot: 'Règle',
        sens: 'Le texte qui fixe la vie d’une communauté de moines : prière, travail, repas, silence, autorité.',
      },
      {
        mot: 'Abbé',
        sens: 'Le père d’un monastère, élu par les moines ; il commande, mais doit consulter tous ses frères.',
      },
      {
        mot: 'Scriptorium',
        sens: 'La salle d’un monastère où les moines recopient les manuscrits, à la plume et à la main.',
      },
    ],
    lies: ['sainte-genevieve', 'charlemagne', 'saint-bernard-de-clairvaux', 'suger'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ – XIIIᵉ siècles) : le monachisme en Occident',
    tags: [
      'bénédictins',
      'Mont-Cassin',
      'Règle',
      'moines',
      'Subiaco',
      'monastère',
      'ora et labora',
      'scriptorium',
      'Scholastique',
      'Cluny',
    ],
  },
  {
    id: 'charles-martel',
    volet: 'personnages',
    nom: 'Charles Martel',
    surnom: 'le marteau',
    dates: 'vers 688 – 741',
    tri: 741,
    periode: 'moyen-age',
    emoji: '🔨',
    roles: ['Maire du palais', 'Chef de guerre franc', 'Grand-père de Charlemagne'],
    origine: 'Herstal, en Austrasie',
    accroche:
      'Il n’a jamais porté de couronne, mais il arrête près de Poitiers une armée venue de Cordoue et fonde la dynastie de Charlemagne.',
    citations: [
      {
        texte:
          'Les hommes du Nord restèrent immobiles comme un mur, serrés les uns contre les autres comme un bloc de glace, et taillèrent les Arabes en pièces.',
        qui: 'La *Chronique mozarabe de 754*',
        contexte:
          'Écrite en Espagne une vingtaine d’années après la bataille : c’est le récit le plus proche des faits qui nous soit parvenu.',
        sens:
          'L’infanterie franque, serrée en muraille, tient sous la charge de la cavalerie arabe : c’est cette immobilité, et non une ruse, qui gagne la bataille.',
      },
      {
        texte:
          'Le Christ aidant, il renversa leurs tentes et courut au combat pour les broyer.',
        qui: 'Le Continuateur de Frédégaire',
        contexte:
          'Chronique franque rédigée vers 751, à la cour de ses fils : elle écrit l’histoire du vainqueur.',
      },
      {
        texte:
          'Peut-être enseignerait-on aujourd’hui à Oxford l’interprétation du Coran.',
        qui: 'Edward Gibbon',
        contexte:
          '*Histoire du déclin et de la chute de l’Empire romain*, 1788 : l’historien anglais imagine ce qu’aurait été l’Europe sans Poitiers.',
        sens:
          'C’est cette phrase, plus que la bataille elle-même, qui a fait de 732 « la date qui sauva l’Occident ». Les historiens d’aujourd’hui y voient une expédition arrêtée, non une invasion repoussée.',
      },
    ],
    reperes: [
      'Fils de Pépin de Herstal, il conquiert le pouvoir les armes à la main entre 716 et 719.',
      'Maire du palais : il gouverne au nom de rois mérovingiens réduits à paraître.',
      'En octobre 732, près de Poitiers, il arrête l’armée d’Abd al-Rahman, venue d’al-Andalus.',
      'Il soumet la Bourgogne, l’Aquitaine, la Frise, et reprend la Provence et la Septimanie.',
      'Pour payer ses cavaliers, il distribue des terres d’Église : les évêques ne l’oublieront pas.',
      'Mort en 741, il laisse à ses fils un royaume franc réunifié, sans avoir porté la couronne.',
    ],
    recit: [
      {
        titre: 'Maire du palais, c’est-à-dire maître',
        texte:
          'Deux siècles après Clovis, les **Mérovingiens** ne gouvernent plus : les partages successifs ont vidé la couronne, et le pouvoir réel est passé aux **maires du palais**, les intendants des rois. Le père de Charles, Pépin de Herstal, tenait cette charge en **Austrasie**. Quand il meurt en 714, sa veuve Plectrude fait enfermer Charles, né d’une autre union, pour écarter un rival. Il s’évade. En trois campagnes — **Amblève** en 716, **Vincy** en 717, **Soissons** en 719 —, il bat ses adversaires les uns après les autres et devient le maître unique du monde franc. Il ne prend pas le titre de roi : il laisse régner des Mérovingiens sans pouvoir, puis, à partir de **737**, laisse simplement le trône vide. Il gouverne, cela lui suffit.',
      },
      {
        titre: 'Poitiers, octobre 732',
        texte:
          'Depuis 711, les armées musulmanes ont conquis l’Espagne wisigothique ; de **Cordoue**, le gouverneur **Abd al-Rahman** lance en 732 une grande expédition vers le nord. **Eudes**, duc d’Aquitaine, est battu sur la Garonne ; Bordeaux est pris, l’armée remonte vers **Tours** et son riche sanctuaire de Saint-Martin. Eudes appelle Charles, son rival de la veille. Les deux armées se font face une semaine entre **Tours et Poitiers**, puis s’affrontent un samedi d’octobre. Les Francs combattent à pied, en formation serrée ; la cavalerie arabe s’y brise. **Abd al-Rahman est tué**, et l’armée se retire pendant la nuit. Il faut dire la mesure exacte de l’événement : ce n’est pas une invasion repoussée, c’est une **grande razzia arrêtée**, et les raids continueront jusqu’en 759. Mais l’écho est immense — le chef franc devient le bouclier de la chrétienté d’Occident, et c’est ce prestige qui fera de son fils un roi.',
      },
      {
        titre: 'Le prix de la cavalerie',
        texte:
          'Charles tire de ces guerres une leçon technique : contre des cavaliers, il faut des cavaliers. Or un homme d’armes monté coûte l’équivalent d’une vingtaine de bœufs, sans compter l’entretien. Faute de trésor, Charles prend là où il y a de la terre : il **sécularise** des biens d’Église, c’est-à-dire qu’il les retire aux abbayes et aux évêchés pour les donner en **précaire** à ses guerriers, qui les tiennent en échange du service armé. Le procédé fâche durablement le clergé — des textes du siècle suivant le montrent en enfer pour cela — mais il installe un mécanisme appelé à durer mille ans : **une terre contre un service**, l’embryon du **fief** et de la société féodale. Le même homme, dans le même temps, protège et finance la mission de **saint Boniface** en Germanie : il prend à l’Église d’une main, il l’étend de l’autre.',
      },
      {
        titre: 'Sans couronne, il fonde une dynastie',
        texte:
          'À la fin de sa vie, Charles est **duc et prince des Francs**, sans roi au-dessus de lui. Le pape **Grégoire III**, menacé par les Lombards, lui envoie en 739 des clés du tombeau de saint Pierre et lui propose de rompre avec l’empereur de Constantinople : c’est la première fois que Rome se tourne vers les Francs, et l’alliance qui en naîtra portera Charlemagne à l’Empire. Charles meurt le 22 octobre **741** à Quierzy et se fait enterrer à **Saint-Denis** — le premier laïc qui ne soit pas roi à reposer dans la nécropole royale. Il partage ses terres entre ses fils **Carloman** et **Pépin le Bref**. Dix ans plus tard, Pépin dépose le dernier Mérovingien et se fait sacrer roi : la dynastie **carolingienne** commence, et elle porte le nom de Charles.',
      },
    ],
    chrono: [
      { date: '714', fait: 'Mort de son père ; il est emprisonné par Plectrude.' },
      { date: '716', fait: 'Victoire d’Amblève : il reprend le pouvoir en Austrasie.' },
      { date: '719', fait: 'Soissons : il est maître de tout le monde franc.' },
      { date: 'octobre 732', fait: 'Bataille de Poitiers ; Abd al-Rahman est tué.' },
      { date: '737', fait: 'Il gouverne sans roi : le trône mérovingien reste vide.' },
      { date: '739', fait: 'Le pape Grégoire III lui demande secours contre les Lombards.' },
      { date: '741', fait: 'Mort à Quierzy ; il est enterré à Saint-Denis.' },
      { date: '751', fait: 'Son fils Pépin le Bref devient roi des Francs.' },
    ],
    leSaisTu:
      'Le surnom « Martel » — le marteau — n’apparaît qu’un siècle et demi après sa mort, sous la plume de chroniqueurs qui servaient ses descendants. Lui n’a jamais porté de couronne ni de titre royal : de 737 à sa mort, il a gouverné les Francs en laissant tout simplement le trône vide.',
    aRetenir: [
      'Charles Martel est maire du palais, pas roi : il gouverne les Francs de 719 à 741.',
      'En octobre 732, près de Poitiers, il arrête l’armée d’Abd al-Rahman venue d’al-Andalus.',
      'Il réunifie le royaume franc et repousse les incursions jusqu’en Provence.',
      'Il donne des terres d’Église à ses cavaliers en échange du service armé : c’est une origine du fief.',
      'Son fils Pépin le Bref devient roi en 751 : la dynastie carolingienne naît de lui.',
    ],
    mots: [
      {
        mot: 'Maire du palais',
        sens: 'Le premier serviteur du roi franc, chargé du palais et de l’armée ; à la fin des Mérovingiens, c’est lui qui gouverne réellement.',
      },
      {
        mot: 'Rois fainéants',
        sens: 'Surnom donné bien plus tard aux derniers Mérovingiens, qui régnaient sans gouverner.',
      },
      {
        mot: 'Fief',
        sens: 'Terre donnée par un seigneur à un homme en échange de sa fidélité et de son service armé.',
      },
    ],
    lies: ['clovis', 'charlemagne', 'hugues-capet'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ – XIIIᵉ siècles) : des mondes en contact',
    tags: [
      'Poitiers',
      '732',
      'maire du palais',
      'Francs',
      'Abd al-Rahman',
      'carolingiens',
      'Pépin le Bref',
      'Saint-Denis',
      'Austrasie',
      'al-Andalus',
    ],
  },
  {
    id: 'charlemagne',
    volet: 'personnages',
    nom: 'Charlemagne',
    surnom: 'le père de l’Europe',
    dates: '747 – 814',
    tri: 814,
    periode: 'moyen-age',
    emoji: '🦅',
    roles: ['Roi des Francs', 'Roi des Lombards', 'Empereur d’Occident'],
    origine: 'Austrasie, royaume des Francs',
    accroche:
      'Empereur d’Occident à Noël 800, il gouverne la moitié de l’Europe — et ordonne une école dans chaque évêché et chaque monastère.',
    citations: [
      {
        texte:
          'Et que l’on établisse des écoles où les enfants apprendront à lire. Que dans chaque monastère et chaque évêché on enseigne les psaumes, l’écriture, le chant, le calcul et la grammaire.',
        contexte:
          'Capitulaire de l’*Admonitio generalis*, 789 : l’acte qui fonde l’école en Occident.',
        sens:
          'Il ne s’agit pas encore de l’école pour tous : il s’agit d’imposer partout un lieu où l’on apprend à lire, et d’en faire une obligation pour l’Église de tout l’Empire.',
      },
      {
        texte:
          'Il essayait aussi d’écrire, et gardait sous les coussins de son lit des tablettes pour s’exercer à tracer des lettres ; mais, commencé trop tard, ce travail eut peu de succès.',
        qui: 'Éginhard, son biographe',
        contexte: '*Vie de Charlemagne*, écrite vers 830 par un familier du palais d’Aix.',
        sens:
          'L’homme qui impose l’école à son Empire s’est battu toute sa vie pour écrire lui-même. Il parlait latin, comprenait le grec, dictait sans peine — mais la main ne suivait pas.',
      },
      {
        texte:
          'S’il avait connu le dessein du pontife, il ne serait pas entré ce jour-là dans l’église, si grande que fût la fête.',
        qui: 'Éginhard',
        contexte:
          'À propos du couronnement impérial du 25 décembre 800, que le pape Léon III lui aurait imposé par surprise.',
        sens:
          'Personne ne croit vraiment à la surprise : l’affaire était préparée. Mais Charlemagne tient à dire qu’il ne doit pas sa couronne au pape — la question empoisonnera l’Europe pendant cinq siècles.',
      },
      {
        texte:
          'Charles le roi, notre empereur le Grand, sept ans tous pleins est resté en Espagne.',
        qui: '*La Chanson de Roland*',
        contexte:
          'Les premiers vers du plus ancien poème français, vers 1100 : trois siècles après, la légende a remplacé l’histoire.',
        sens:
          'La chevauchée d’Espagne de 778 n’a duré que quelques mois et s’est mal finie ; le poème en fait une guerre sainte de sept ans, et d’un chef d’arrière-garde le héros Roland.',
      },
    ],
    reperes: [
      'Fils de Pépin le Bref, roi des Francs en 768, seul maître du royaume en 771.',
      'Cinquante-trois campagnes : Lombards, Saxons, Avars, Bavarois, marche d’Espagne.',
      'Couronné empereur à Rome par le pape Léon III, le jour de Noël 800.',
      'Il gouverne depuis Aix-la-Chapelle, par des comtes que surveillent les missi dominici.',
      'Il impose une école par évêché et par monastère, et fait recopier les textes anciens.',
      'Mort en 814 ; son empire est partagé entre ses petits-fils au traité de Verdun, en 843.',
    ],
    recit: [
      {
        titre: 'Cinquante-trois campagnes',
        texte:
          'Charles devient roi des Francs en **768**, à vingt et un ans, aux côtés de son frère Carloman ; la mort de celui-ci, en 771, le laisse seul. Il fera la guerre presque chaque année de son règne. En **774**, appelé par le pape, il écrase les **Lombards** d’Italie du Nord et ceint leur couronne de fer. En **778**, la chevauchée d’Espagne tourne court : au retour, l’arrière-garde est massacrée dans un défilé des Pyrénées, à **Roncevaux**, par des montagnards basques — trois siècles plus tard, la *Chanson de Roland* en fera une bataille contre les Sarrasins. La guerre la plus longue est celle des **Saxons**, trente-deux ans de campagnes, de révoltes et de conversions forcées ; elle comprend l’épisode le plus sombre de son règne, le massacre de **Verden en 782**, où quatre mille cinq cents prisonniers saxons sont exécutés en un jour. En **796**, le trésor des **Avars** rapporté de Pannonie remplit quinze chariots. À la fin, l’Empire va de l’Èbre à l’Elbe.',
      },
      {
        titre: 'Noël 800 : un empereur en Occident',
        texte:
          'Le **25 décembre 800**, dans la basilique Saint-Pierre de Rome, le pape **Léon III** pose une couronne sur la tête de Charles pendant la messe, et l’assistance l’acclame « empereur des Romains ». Il n’y avait plus d’empereur en Occident depuis **476** : trois cent vingt-quatre ans. L’événement rétablit l’idée d’un empire chrétien d’Occident, distinct de **Constantinople**, qui proteste et ne reconnaîtra le titre qu’en 812, contre des concessions. Éginhard affirme que Charles fut pris de court et qu’il n’aurait pas franchi le seuil s’il avait su : personne n’y croit tout à fait, mais la phrase dit l’essentiel. Si le pape donne la couronne, il peut la reprendre. De ce jour de Noël naît la plus longue querelle politique du Moyen Âge, celle du **pape et de l’empereur**.',
      },
      {
        titre: 'Gouverner un empire sans routes sûres',
        texte:
          'Comment tenir un territoire qu’il faut deux mois pour traverser ? Charles découpe l’Empire en **comtés**, confiés à des **comtes** qui rendent la justice, lèvent l’armée et perçoivent les taxes ; aux frontières, des **marches** commandées par des marquis. Pour surveiller les comtes, il invente les **missi dominici**, « envoyés du maître » : ils circulent par deux, un évêque et un laïc, écoutent les plaintes, révoquent les abusifs et rapportent tout. Ses décisions sont écrites et diffusées sous forme de **capitulaires**, chapitre par chapitre. En **802**, il fait prêter à tout homme libre de plus de douze ans un **serment de fidélité** personnel. Il unifie la monnaie autour du **denier d’argent** et fixe sa capitale à **Aix-la-Chapelle**, où il bâtit une chapelle octogonale dont les colonnes viennent de Ravenne, et qu’on visite encore.',
      },
      {
        titre: 'L’école et les livres',
        texte:
          'Son œuvre la plus durable ne se défend pas les armes à la main. En **789**, l’*Admonitio generalis* ordonne que chaque évêché et chaque monastère tienne une **école**. Il fait venir les meilleurs savants d’Europe, au premier rang **Alcuin** d’York, qui dirige l’école du palais où étudient ses propres enfants et les fils de l’aristocratie. On y enseigne les **arts libéraux** : grammaire, rhétorique, dialectique, arithmétique, géométrie, astronomie, musique. Les ateliers copient tout ce qu’ils trouvent d’ancien — l’immense majorité des textes latins que nous lisons aujourd’hui nous vient de ces copies-là. Les scribes mettent au point une écriture claire, la **minuscule caroline**, avec des mots séparés et des majuscules en tête de phrase. On appelle cet effort la **renaissance carolingienne** : un empire qui décide que lire et compter sont des affaires d’État.',
      },
      {
        titre: 'Après lui, le partage',
        texte:
          'Charles meurt à Aix le **28 janvier 814**, à soixante-six ans, et est enterré dans sa chapelle. Son fils **Louis le Pieux** hérite d’un empire entier — mais l’usage franc du partage revient. Après trois années de guerre entre ses petits-fils, le **traité de Verdun**, en **843**, coupe l’Empire en trois : la **Francie occidentale** de Charles le Chauve, qui deviendra la France ; la **Francie orientale** de Louis le Germanique, qui deviendra l’Allemagne ; et entre les deux une longue bande, de la mer du Nord à Rome, pour Lothaire — une frontière que l’Europe se disputera jusqu’au XXᵉ siècle. Un poète de son temps l’avait appelé *Pater Europae*, père de l’Europe. Le prix qui récompense chaque année ceux qui travaillent à l’unité européenne se remet toujours à Aix-la-Chapelle, et porte son nom.',
      },
    ],
    chrono: [
      { date: '768', fait: 'Roi des Francs avec son frère Carloman.' },
      { date: '771', fait: 'Mort de Carloman : il règne seul.' },
      { date: '774', fait: 'Il conquiert le royaume lombard et en ceint la couronne.' },
      { date: '778', fait: 'Désastre de Roncevaux au retour d’Espagne.' },
      { date: '782', fait: 'Massacre de Verden pendant les guerres saxonnes.' },
      { date: '789', fait: 'Admonitio generalis : une école par évêché et par monastère.' },
      { date: '25 décembre 800', fait: 'Couronné empereur à Rome par Léon III.' },
      { date: '802', fait: 'Serment de fidélité imposé à tous les hommes libres.' },
      { date: '814', fait: 'Mort à Aix-la-Chapelle, le 28 janvier.' },
      { date: '843', fait: 'Traité de Verdun : l’Empire est partagé en trois.' },
    ],
    leSaisTu:
      'Les minuscules que vous écrivez viennent de son règne. Avant lui, on écrivait en capitales, sans espace entre les mots ni ponctuation. Ses copistes mettent au point la minuscule caroline : lettres rondes, mots séparés, majuscule en tête de phrase. La Renaissance la prendra pour de l’écriture romaine antique, et nos imprimeurs en ont tiré nos caractères.',
    aRetenir: [
      'Charlemagne est roi des Francs de 768 à 814 et empereur d’Occident à partir de 800.',
      'Il est couronné à Rome par le pape Léon III le 25 décembre 800.',
      'Il gouverne par des comtes surveillés par les missi dominici et par des capitulaires écrits.',
      'L’Admonitio generalis de 789 impose une école dans chaque évêché et chaque monastère.',
      'Son empire est partagé au traité de Verdun, en 843, entre ses trois petits-fils.',
    ],
    mots: [
      {
        mot: 'Missi dominici',
        sens: '« Envoyés du maître » : inspecteurs voyageant par deux, un laïc et un clerc, pour contrôler les comtes au nom de l’empereur.',
      },
      {
        mot: 'Capitulaire',
        sens: 'Décision de l’empereur mise par écrit et divisée en chapitres, envoyée dans tout l’Empire.',
      },
      {
        mot: 'Renaissance carolingienne',
        sens: 'L’effort d’écoles, de copies de manuscrits et d’art lancé par Charlemagne pour relever le savoir en Occident.',
      },
      {
        mot: 'Comté',
        sens: 'Circonscription de l’Empire confiée à un comte, qui y rend la justice et lève l’armée.',
      },
    ],
    lies: ['charles-martel', 'clovis', 'hugues-capet', 'saint-benoit'],
    niveaux: ['5e'],
    programme: 'Chrétientés et islam (VIᵉ – XIIIᵉ siècles) : l’Empire carolingien',
    tags: [
      'Charles le Grand',
      'empereur',
      'Aix-la-Chapelle',
      '800',
      'missi dominici',
      'capitulaires',
      'Alcuin',
      'Roncevaux',
      'Saxons',
      'Verdun',
      'école',
    ],
  },
  {
    id: 'hugues-capet',
    volet: 'personnages',
    nom: 'Hugues Capet',
    surnom: 'le premier des Capétiens',
    dates: 'vers 941 – 996',
    tri: 996,
    periode: 'moyen-age',
    emoji: '🌳',
    roles: ['Duc des Francs', 'Roi des Francs', 'Fondateur des Capétiens'],
    origine: 'Île-de-France, royaume des Francs',
    accroche:
      'Élu roi en 987 sur un domaine minuscule, il fonde la dynastie qui régnera sur la France pendant plus de huit cents ans.',
    citations: [
      {
        texte:
          'Le trône ne s’acquiert pas par droit héréditaire. On ne doit mettre à la tête du royaume que celui qui se distingue non seulement par la noblesse du corps, mais aussi par la sagesse de l’esprit.',
        qui: 'Adalbéron, archevêque de Reims',
        contexte:
          'À l’assemblée des grands, à Senlis, en 987, pour écarter l’héritier carolingien et faire élire Hugues. Rapporté par le moine Richer de Reims.',
        sens:
          'L’archevêque défend une idée que la dynastie née ce jour-là s’empressera d’oublier : le roi est choisi pour ce qu’il vaut, pas pour le sang qu’il porte.',
      },
      {
        texte:
          'Couronnez le duc : illustre par ses actions, par sa noblesse et par ses troupes, vous trouverez en lui un défenseur non seulement de l’État, mais aussi de vos affaires privées.',
        qui: 'Adalbéron de Reims',
        contexte: 'Suite du même discours, à Senlis, en 987.',
      },
      {
        texte: '— Qui t’a fait comte ? — Qui t’a fait roi ?',
        contexte:
          'Échange prêté au roi et à Adalbert de Périgord, qui assiégeait Tours. Rapporté un demi-siècle plus tard par le chroniqueur Adémar de Chabannes.',
        sens:
          'Vraie ou non, la réplique dit la situation du premier Capétien : élu par ses pairs, il n’est pas plus légitime qu’eux, et ses grands vassaux le lui font sentir.',
        incertaine: true,
      },
    ],
    reperes: [
      'Duc des Francs, il tient Paris et Orléans, mais n’est pas de sang carolingien.',
      'Élu roi à Senlis en 987, à la mort du dernier Carolingien Louis V.',
      'Sacré à Noyon le 3 juillet 987 : la dynastie capétienne commence là.',
      'Dès Noël 987, il fait sacrer son fils Robert de son vivant : la couronne devient héréditaire.',
      'Son domaine royal est plus petit que les terres de ses plus grands vassaux.',
      'Ses descendants régneront sur la France jusqu’en 1792, puis de 1814 à 1848.',
    ],
    recit: [
      {
        titre: 'Le royaume que plus personne ne gouverne',
        texte:
          'Un siècle et demi après le partage de Verdun, les derniers **Carolingiens** de Francie occidentale ne commandent presque plus rien : les comtes, les ducs et les évêques se sont approprié leurs charges et les transmettent à leurs fils. La famille la plus puissante est celle des **Robertiens**, qui tient Paris et Orléans et a déjà donné deux rois. Quand **Louis V** meurt sans enfant en **987**, à vingt ans, d’une chute de cheval, il reste un héritier carolingien : son oncle **Charles de Lorraine**. Mais **Adalbéron**, archevêque de Reims, et son secrétaire **Gerbert d’Aurillac** — le savant le plus réputé d’Occident, futur pape — préfèrent le duc des Francs. À l’assemblée de **Senlis**, ils emportent la décision. Hugues est **élu**, puis **sacré à Noyon le 3 juillet 987**.',
      },
      {
        titre: 'Un roi sans terres',
        texte:
          'Il est roi, et il est pauvre. Le **domaine royal** — les terres dont il tire réellement ses revenus — se réduit à une bande étroite entre **Paris, Orléans, Senlis, Étampes et Dreux**, hérissée de châteaux tenus par des seigneurs qui pillent ses routes. Autour, ses **vassaux** sont plus riches et plus forts que lui : le duc de Normandie, le comte de Flandre, le duc d’Aquitaine, le comte d’Anjou. Quand Hugues demande au comte de Périgord de quel droit il assiège Tours, la réponse — vraie ou inventée — claque : « Qui t’a fait roi ? » Il possède pourtant ce qu’aucun d’eux n’aura jamais : le **sacre**. L’onction de Reims fait de lui l’oint du Seigneur, un homme à part, que l’Église soutient et que l’on ne dépose pas comme un comte.',
      },
      {
        titre: 'Le coup de génie : sacrer son fils',
        texte:
          'Hugues comprend immédiatement le danger d’avoir été **élu** : ce qu’une assemblée a donné, une assemblée peut le reprendre à sa mort. Dès **Noël 987**, six mois après son propre sacre, il fait couronner son fils **Robert** de son vivant, comme roi associé. Le geste sera répété par chaque Capétien pendant deux siècles, jusqu’à ce que la dynastie soit si solidement installée que **Philippe Auguste** puisse s’en passer. S’y ajoute une chance inouïe, que les historiens appellent le **miracle capétien** : de 987 à 1328, soit **trois cent quarante et un ans** et quatorze règnes, chaque roi laisse un fils en âge de régner. L’élection s’efface, l’hérédité s’installe, et la couronne cesse d’être un enjeu à chaque génération.',
      },
      {
        titre: 'Huit cents ans',
        texte:
          'Hugues combat encore son rival carolingien, **Charles de Lorraine**, jusqu’à ce que l’évêque de Laon le lui livre par traîtrise en **991**. Il meurt le 24 octobre **996** et repose à **Saint-Denis**. Ce roi faible a fondé la plus longue dynastie d’Europe : les **Capétiens directs** régnent jusqu’en 1328, puis les **Valois**, puis les **Bourbons** — tous descendants d’Hugues en ligne masculine — jusqu’en 1792, et encore de 1814 à 1848. Paris est la capitale de la France parce que c’était sa ville. Et ses successeurs, patiemment, château par château, mariage par mariage, feront du petit domaine de l’Île-de-France le royaume de Philippe Auguste, de Saint Louis et de Louis XIV.',
      },
    ],
    chrono: [
      { date: '956', fait: 'Il succède à son père comme duc des Francs.' },
      { date: 'mai 987', fait: 'Mort de Louis V, dernier roi carolingien.' },
      { date: '987', fait: 'Élu roi par les grands à l’assemblée de Senlis.' },
      { date: '3 juillet 987', fait: 'Sacré roi des Francs à Noyon.' },
      { date: 'Noël 987', fait: 'Il fait sacrer son fils Robert, roi associé.' },
      { date: '991', fait: 'Charles de Lorraine, rival carolingien, est capturé.' },
      { date: '996', fait: 'Mort le 24 octobre ; il est enterré à Saint-Denis.' },
      { date: '1328', fait: 'Fin des Capétiens directs ; les Valois leur succèdent.' },
    ],
    leSaisTu:
      'D’où vient le nom « Capet » ? Sans doute de la cape d’abbé laïc qu’il portait comme protecteur de Saint-Martin de Tours. Lui ne l’a jamais porté comme nom : c’est un surnom que les chroniqueurs lui donnent après coup. Et c’est sous ce nom, « Louis Capet », que la Convention jugera son descendant Louis XVI, en 1792.',
    aRetenir: [
      'Hugues Capet est élu roi des Francs en 987 et sacré à Noyon le 3 juillet.',
      'Il fonde la dynastie capétienne, qui régnera sur la France pendant plus de huit siècles.',
      'Son domaine royal se limite à une bande de terres autour de Paris et d’Orléans.',
      'Il fait sacrer son fils Robert dès Noël 987 : la couronne devient héréditaire.',
      'Les Capétiens directs règnent jusqu’en 1328 ; Valois et Bourbons en descendent.',
    ],
    mots: [
      {
        mot: 'Domaine royal',
        sens: 'Les terres que le roi possède en propre et dont il tire ses revenus, par opposition au reste du royaume.',
      },
      {
        mot: 'Vassal',
        sens: 'Seigneur qui a juré fidélité à un autre, plus puissant, et reçoit de lui une terre en échange de son service.',
      },
      {
        mot: 'Dynastie',
        sens: 'Suite de souverains appartenant à une même famille et se transmettant la couronne.',
      },
    ],
    lies: ['charlemagne', 'charles-martel', 'suger', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial et l’affirmation de l’État royal',
    tags: [
      'Capétiens',
      '987',
      'Senlis',
      'Noyon',
      'sacre',
      'domaine royal',
      'Robert le Pieux',
      'Adalbéron',
      'Carolingiens',
      'Saint-Denis',
    ],
  },
  {
    id: 'guillaume-le-conquerant',
    volet: 'personnages',
    nom: 'Guillaume le Conquérant',
    surnom: 'le bâtard de Falaise',
    dates: 'vers 1027 – 1087',
    tri: 1087,
    periode: 'moyen-age',
    emoji: '🏹',
    roles: ['Duc de Normandie', 'Roi d’Angleterre', 'Chef de guerre'],
    origine: 'Falaise, duché de Normandie',
    accroche:
      'Duc à sept ans et fils illégitime, il traverse la Manche avec sept cents navires et gagne l’Angleterre en une journée de bataille.',
    citations: [
      {
        texte:
          'Regardez-moi bien : je suis vivant, et avec l’aide de Dieu je vaincrai !',
        contexte:
          'À Hastings, le 14 octobre 1066, en relevant son casque devant ses cavaliers qui fuyaient en le croyant mort. Rapporté par son chapelain Guillaume de Poitiers.',
        sens:
          'La bataille bascule là : montrer son visage suffit à retourner une armée qui s’enfuyait. Sans ce geste, il n’y a pas de conquête.',
      },
      {
        texte:
          'Il envoya ses hommes par tout le pays, si minutieusement qu’il n’y eut pas une hide de terre, pas un bœuf, pas une vache, pas un porc qui ne fût inscrit dans son registre.',
        qui: 'La *Chronique anglo-saxonne*',
        contexte:
          'À propos du grand recensement du royaume ordonné en 1085 et rendu en 1086, le Domesday Book.',
        sens:
          'Aucun souverain d’Europe ne sait alors ce qu’il possède. Guillaume, lui, fait compter son royaume champ par champ : c’est le premier inventaire d’État du Moyen Âge.',
      },
      {
        texte:
          'C’était un homme très sage et très puissant, si dur et si violent que nul n’osait rien faire contre sa volonté. Il aimait les grands cerfs comme s’il eût été leur père.',
        qui: 'La *Chronique anglo-saxonne*',
        contexte:
          'Notice écrite à sa mort, en 1087, par un moine anglais qui avait vécu sous son règne.',
        sens:
          'Le jugement d’un vaincu : il reconnaît la force du conquérant et lui reproche ses lois de chasse, qui vidaient des villages entiers pour en faire des forêts royales.',
      },
      {
        texte: 'J’ai pris l’Angleterre à deux mains.',
        contexte:
          'À Pevensey, le 28 septembre 1066 : trébuchant en débarquant, il se serait relevé les mains pleines de sable pour transformer le mauvais présage.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils illégitime du duc Robert, il hérite de la Normandie à sept ans, en 1035.',
      'Trois de ses tuteurs sont assassinés ; il tient son duché par les armes à partir de 1047.',
      '14 octobre 1066 : il bat Harold à Hastings et gagne la couronne d’Angleterre.',
      'Couronné à Westminster le jour de Noël 1066, il couvre le pays de châteaux.',
      '1086 : le Domesday Book recense le royaume, terre par terre et bête par bête.',
      'Roi en Angleterre, il reste vassal du roi de France pour son duché de Normandie.',
    ],
    recit: [
      {
        titre: 'Le bâtard de Falaise',
        texte:
          'Guillaume naît vers 1027 à **Falaise**, fils du duc **Robert le Magnifique** et d’**Arlette**, fille d’un artisan de la ville : il est illégitime, et ses ennemis l’appelleront toute sa vie « le Bâtard ». Son père meurt en revenant de Jérusalem en **1035** ; l’enfant de sept ans hérite du duché. Suivent dix années de chaos où l’on tue autour de lui : trois de ses tuteurs sont assassinés, l’un jusque dans sa chambre. À vingt ans, aidé du roi de France **Henri Iᵉʳ**, il écrase la révolte des barons normands à **Val-ès-Dunes**, en 1047, et commence à tenir son duché d’une main de fer. Il épouse **Mathilde de Flandre** vers 1050, malgré l’opposition du pape ; pour obtenir le pardon, le couple fonde à **Caen** les deux abbayes, aux Hommes et aux Dames, qui abritent encore leurs tombeaux.',
      },
      {
        titre: '1066 : une succession et trois prétendants',
        texte:
          'Le roi d’Angleterre **Édouard le Confesseur** meurt sans enfant le 5 janvier **1066**. Guillaume affirme qu’Édouard, son cousin, lui avait promis la couronne, et que le noble anglais **Harold Godwinson**, naufragé en Normandie quelques années plus tôt, lui avait juré fidélité sur des reliques — la **tapisserie de Bayeux** met la scène en images. Harold se fait pourtant couronner dès le lendemain de la mort du roi. Guillaume obtient du pape une **bannière bénite**, fait construire une flotte de **sept cents navires** et attend le vent tout l’été. Pendant ce temps, un troisième prétendant, le roi de Norvège **Harald**, débarque au nord : Harold court l’écraser à **Stamford Bridge** le 25 septembre. Trois jours plus tard, Guillaume débarque à **Pevensey**, au sud, sans rencontrer personne. Harold redescend en toute hâte : quatre cents kilomètres en treize jours.',
      },
      {
        titre: 'Hastings, 14 octobre',
        texte:
          'Les Anglais tiennent la crête de **Senlac**, serrés derrière leur mur de boucliers, avec la garde du roi armée de haches danoises. Les Normands attaquent en bas de pente, archers d’abord, puis fantassins, puis cavalerie. Le mur tient toute la matinée. Une fausse nouvelle court — le duc est mort — et l’aile bretonne s’enfuit ; **Guillaume relève son casque** et retourne la panique. Ses cavaliers recommencent alors la manœuvre volontairement : des **fuites simulées** qui attirent les Anglais hors de la crête et les font tailler en pièces en terrain plat. À la tombée du jour, **Harold est tué** — la tapisserie de Bayeux montre un homme frappé d’une flèche à l’œil, et c’est cette image qui a fait la légende. Neuf heures de bataille, et un royaume change de dynastie. Le **25 décembre 1066**, Guillaume est couronné à **Westminster**, l’acclamation dite en anglais et en français.',
      },
      {
        titre: 'Tenir l’Angleterre',
        texte:
          'Gagner une bataille n’est pas conquérir un pays : les révoltes durent cinq ans. La répression du nord, en **1069-1070**, est impitoyable — villages brûlés, récoltes et bétail détruits, famine massive dans le Yorkshire ; les chroniqueurs de l’époque, y compris normands, la jugent sans excuse. Guillaume quadrille le pays de **châteaux**, d’abord en bois sur une motte, puis en pierre : c’est lui qui commence la **tour Blanche** de Londres. Il remplace presque entièrement l’aristocratie anglo-saxonne par ses compagnons : en 1086, sur des milliers de grands propriétaires, à peine une poignée sont encore anglais. La même année, il fait dresser le **Domesday Book**, inventaire exhaustif des terres, des hommes et des bêtes de son royaume — un document sans équivalent en Europe, consultable encore aujourd’hui.',
      },
      {
        titre: 'Deux couronnes, une langue nouvelle',
        texte:
          'La conquête bouleverse l’Angleterre jusque dans sa langue : pendant trois siècles, la cour, la justice et l’administration parlent **français**, et près de dix mille mots français passent dans l’anglais. Elle crée surtout une situation politique intenable : roi en Angleterre, Guillaume reste **vassal du roi de France** pour la Normandie — un vassal plus puissant que son suzerain. De ce nœud sortiront l’empire des **Plantagenêts**, la bataille de **Bouvines** et, à terme, la **guerre de Cent Ans**. Guillaume meurt à Rouen le **9 septembre 1087**, blessé lors d’une chevauchée contre Mantes. Ses funérailles à Caen tournent mal : le cercueil de pierre est trop étroit, et un homme interrompt la cérémonie pour réclamer le prix du terrain où l’on creuse la tombe. Il faut le payer devant tous avant de pouvoir enterrer le Conquérant.',
      },
    ],
    chrono: [
      { date: '1035', fait: 'Duc de Normandie à sept ans, à la mort de son père.' },
      { date: '1047', fait: 'Victoire de Val-ès-Dunes sur les barons révoltés.' },
      { date: 'vers 1050', fait: 'Mariage avec Mathilde de Flandre.' },
      { date: '5 janvier 1066', fait: 'Mort d’Édouard le Confesseur ; Harold est couronné.' },
      { date: '25 septembre 1066', fait: 'Harold écrase les Norvégiens à Stamford Bridge.' },
      { date: '14 octobre 1066', fait: 'Bataille d’Hastings : Harold est tué.' },
      { date: '25 décembre 1066', fait: 'Couronnement à Westminster.' },
      { date: '1069 – 1070', fait: 'Répression du nord de l’Angleterre.' },
      { date: '1086', fait: 'Achèvement du Domesday Book.' },
      { date: '1087', fait: 'Mort à Rouen le 9 septembre ; tombeau à Caen.' },
    ],
    leSaisTu:
      'L’anglais garde la trace de 1066 dans son assiette : l’animal vivant porte un nom saxon (cow, pig, sheep), la viande servie à table un nom venu du français (beef, pork, mutton). D’un côté les paysans anglais qui élevaient les bêtes, de l’autre les seigneurs normands qui les mangeaient.',
    aRetenir: [
      'Guillaume, duc de Normandie depuis 1035, conquiert l’Angleterre en 1066.',
      'Il bat Harold à Hastings le 14 octobre 1066 et est couronné à Westminster le 25 décembre.',
      'Il impose la féodalité normande, bâtit des châteaux et remplace l’aristocratie anglaise.',
      'Le Domesday Book, achevé en 1086, recense tout le royaume d’Angleterre.',
      'Roi d’Angleterre mais vassal du roi de France, il installe un conflit qui durera des siècles.',
    ],
    mots: [
      {
        mot: 'Suzerain',
        sens: 'Seigneur dont dépend un vassal ; le roi de France est le suzerain du duc de Normandie.',
      },
      {
        mot: 'Hommage',
        sens: 'Cérémonie par laquelle un vassal met ses mains dans celles de son seigneur et lui jure fidélité.',
      },
      {
        mot: 'Domesday Book',
        sens: 'Le recensement de toutes les terres et richesses d’Angleterre, ordonné par Guillaume en 1085.',
      },
    ],
    lies: ['hugues-capet', 'suger', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'L’ordre seigneurial : féodaux, souverains, premiers États',
    tags: [
      'Normandie',
      'Hastings',
      '1066',
      'Harold',
      'tapisserie de Bayeux',
      'Angleterre',
      'Domesday Book',
      'Caen',
      'Falaise',
      'Westminster',
    ],
  },
  {
    id: 'suger',
    volet: 'personnages',
    nom: 'Suger',
    surnom: 'l’abbé bâtisseur de Saint-Denis',
    dates: 'vers 1081 – 1151',
    tri: 1151,
    periode: 'moyen-age',
    emoji: '⛪',
    roles: ['Abbé de Saint-Denis', 'Conseiller des rois', 'Régent du royaume'],
    origine: 'Île-de-France, d’une famille modeste',
    accroche:
      'Abbé, régent du royaume et bâtisseur : en reconstruisant Saint-Denis autour de la lumière, il fait naître l’art gothique.',
    citations: [
      {
        texte:
          'L’esprit épais s’élève vers le vrai par ce qui est matériel, et, voyant cette lumière, il ressuscite de sa première noyade.',
        contexte:
          'Inscription que Suger fit graver sur les portes de bronze doré de Saint-Denis, vers 1140.',
        sens:
          'Voilà pourquoi il refuse une église nue : l’or, les pierres et surtout la lumière ne sont pas des luxes, ce sont des marches. On part du visible pour atteindre l’invisible.',
      },
      {
        texte:
          'L’église resplendit, illuminée en son milieu ; car resplendit ce qui est uni à la lumière, et resplendit l’œuvre noble qu’inonde une lumière nouvelle.',
        contexte:
          'Inscription de la consécration du chevet de Saint-Denis, le 11 juin 1144. En latin, *lux nova* : la lumière nouvelle.',
        sens:
          'Deux mots latins baptisent l’art gothique avant qu’il ait un nom : *lux nova*. Le mur a été remplacé par du verre, et l’église est devenue une lanterne.',
      },
      {
        texte:
          'Si les coupes d’or servaient autrefois à recueillir le sang des boucs, combien plus faut-il disposer, pour recevoir le sang du Christ, des vases d’or et de pierres précieuses.',
        contexte:
          'Dans son livre *De administratione*, en réponse à ceux qui lui reprochaient le luxe de son abbaye — au premier rang, les cisterciens de Bernard de Clairvaux.',
        sens:
          'Le débat du XIIᵉ siècle en une phrase : faut-il donner le plus beau à Dieu, ou le donner aux pauvres ? Deux saints, deux réponses, et deux architectures.',
      },
    ],
    reperes: [
      'Enfant d’une famille pauvre, confié vers dix ans à l’abbaye de Saint-Denis.',
      'Il y grandit avec le futur Louis VI, dont il devient l’ami et le conseiller.',
      'Abbé de Saint-Denis de 1122 à sa mort, il réforme d’abord la discipline de son abbaye.',
      'Régent du royaume de 1147 à 1149, pendant que Louis VII est en croisade.',
      'Le chevet de Saint-Denis, consacré en 1144, est le premier édifice gothique d’Europe.',
      'Il a raconté son chantier et le règne de Louis VI dans des livres qui nous sont parvenus.',
    ],
    recit: [
      {
        titre: 'Un enfant de rien à l’école du roi',
        texte:
          'Suger naît vers 1081 dans une famille si modeste qu’il n’en dira jamais rien. Vers dix ans, on le confie comme **oblat** à l’abbaye de **Saint-Denis**, au nord de Paris : il y est nourri, instruit, et il y grandit aux côtés d’un camarade de classe qui deviendra **Louis VI le Gros**. Petit, vif, infatigable, il devient l’homme de confiance de l’abbaye, puis son ambassadeur à Rome. C’est là qu’il apprend, en 1122, que les moines l’ont élu **abbé** en son absence. Il a quarante ans. Quelques années plus tard, **Bernard de Clairvaux** lui reproche publiquement le train de vie de sa maison ; au lieu de se fâcher, Suger réforme : il renvoie son escorte, rétablit la Règle, remet l’abbaye au travail. Les deux hommes resteront en désaccord sur le beau, et alliés sur tout le reste.',
      },
      {
        titre: 'Le premier chantier gothique',
        texte:
          'L’abbatiale carolingienne est trop petite : les jours de pèlerinage, la foule s’écrase et des femmes s’évanouissent, raconte Suger. Il fait d’abord rebâtir la **façade** occidentale, vers 1135, avec deux tours et une **rose** ; puis, de 1140 à 1144, le **chevet**. C’est là que tout se joue. En croisant les **ogives** et en employant l’**arc brisé**, les maçons font descendre le poids de la voûte sur des piliers et non plus sur des murs pleins ; les murs, devenus inutiles, sont remplacés par des **verrières**. Le déambulatoire et ses chapelles rayonnantes s’ouvrent les uns sur les autres en une couronne de lumière ininterrompue. Le **11 juin 1144**, le roi **Louis VII**, la reine et dix-neuf évêques assistent à la consécration. Personne ne sait encore qu’on vient d’inaugurer l’architecture qui couvrira l’Europe.',
      },
      {
        titre: 'La lumière comme théologie',
        texte:
          'Suger ne cherche pas une prouesse technique : il cherche **Dieu par la lumière**. Il croit — à tort, mais toute son œuvre en découle — que le saint Denis de son abbaye est l’auteur de textes grecs où Dieu est décrit comme **lumière première**, dont toute clarté d’ici-bas est un reflet. Donc plus une église est lumineuse, plus elle rapproche de Dieu. Donc l’or, l’émail, le cristal et le verre coloré ne sont pas des vanités mais des instruments. Il fait graver sa profession de foi sur les portes de bronze et multiplie les **verrières** historiées. En face, **Bernard de Clairvaux** soutient l’exact contraire : pas de sculpture, pas de couleur, rien qui détourne l’œil. Du XIIᵉ siècle sortiront donc deux architectures sacrées, l’une éblouissante, l’autre dépouillée — et les deux sont chrétiennes.',
      },
      {
        titre: 'L’abbé qui gouverna la France',
        texte:
          'En **1147**, **Louis VII** part pour la deuxième croisade et confie le royaume à son abbé. Pendant deux ans, Suger gouverne : il maintient l’ordre, brise une tentative de coup d’État menée par le propre frère du roi, lève l’argent et l’envoie jusqu’en Terre sainte. Au retour, l’assemblée des grands le salue, dit-on, du titre de **Père de la patrie**. Son autre œuvre politique est d’avoir soudé la **monarchie** à **Saint-Denis** : c’est là que les rois prennent l’**oriflamme** avant de partir en guerre, là qu’ils sont enterrés, là que l’on conserve les archives et que s’écriront les *Grandes Chroniques de France*. Il meurt le **13 janvier 1151**, et le roi tient à assister à ses funérailles.',
      },
      {
        titre: 'Ce qui est né à Saint-Denis',
        texte:
          'Le chevet de 1144 fait école immédiatement. **Sens**, **Noyon**, **Laon**, puis **Notre-Dame de Paris** en 1163, puis **Chartres**, **Reims**, **Amiens**, **Bourges** : en un siècle et demi, quatre-vingts cathédrales et des centaines d’églises s’élèvent selon le même principe — voûter haut, évider les murs, faire entrer le jour. Les chantiers durent des générations et mobilisent des villes entières. On appelait cet art *opus francigenum*, « l’ouvrage français » ; le mot **gothique** viendra plus tard, et ce sera d’abord une insulte. Quant à l’abbaye de Suger, elle gardera les tombeaux des rois de France jusqu’à ce que la Révolution les ouvre, en 1793. Le chevet, lui, est toujours debout — c’est le plus ancien morceau d’architecture gothique du monde.',
      },
    ],
    chrono: [
      { date: 'vers 1081', fait: 'Naissance en Île-de-France, d’une famille modeste.' },
      { date: 'vers 1091', fait: 'Oblat à Saint-Denis, condisciple du futur Louis VI.' },
      { date: '1122', fait: 'Élu abbé de Saint-Denis en son absence.' },
      { date: 'vers 1127', fait: 'Il réforme la discipline de l’abbaye après les reproches de Bernard.' },
      { date: '1135', fait: 'Début du chantier de la façade occidentale.' },
      { date: '11 juin 1144', fait: 'Consécration du chevet : naissance de l’art gothique.' },
      { date: '1147 – 1149', fait: 'Régent du royaume pendant la deuxième croisade.' },
      { date: '1151', fait: 'Mort le 13 janvier, à Saint-Denis.' },
    ],
    leSaisTu:
      'Le mot « gothique » est une insulte. Les artistes de la Renaissance, épris d’Antiquité, ont appelé « gothique » — c’est-à-dire barbare, digne des Goths — l’art né à Saint-Denis. Au XIIᵉ siècle, on disait simplement opus francigenum : « l’ouvrage français ».',
    aRetenir: [
      'Suger est abbé de Saint-Denis de 1122 à 1151 et conseiller de Louis VI puis de Louis VII.',
      'Il gouverne le royaume comme régent de 1147 à 1149, pendant la deuxième croisade.',
      'Le chevet de Saint-Denis, consacré le 11 juin 1144, est le premier édifice gothique.',
      'La croisée d’ogives et l’arc brisé permettent d’évider les murs et d’ouvrir de grandes verrières.',
      'L’art gothique né à Saint-Denis gagne Sens, Paris, Chartres, Reims et toute l’Europe.',
    ],
    mots: [
      {
        mot: 'Croisée d’ogives',
        sens: 'Deux arcs qui se croisent en diagonale sous une voûte et en portent le poids jusqu’aux piliers.',
      },
      {
        mot: 'Chevet',
        sens: 'L’extrémité arrondie d’une église, derrière le chœur, souvent entourée de chapelles.',
      },
      {
        mot: 'Oriflamme',
        sens: 'La bannière rouge de Saint-Denis, que les rois de France venaient prendre avant de partir en guerre.',
      },
      {
        mot: 'Oblat',
        sens: 'Enfant confié par sa famille à un monastère pour y être élevé et y devenir moine.',
      },
    ],
    lies: ['saint-bernard-de-clairvaux', 'saint-benoit', 'hugues-capet', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Saint-Denis',
      'gothique',
      'croisée d’ogives',
      'vitrail',
      'lumière',
      'Louis VI',
      'Louis VII',
      'régent',
      'abbé',
      'oriflamme',
    ],
  },
  {
    id: 'saint-bernard-de-clairvaux',
    volet: 'personnages',
    nom: 'Saint Bernard de Clairvaux',
    surnom: 'la voix de son siècle',
    dates: '1090 – 1153',
    tri: 1153,
    periode: 'moyen-age',
    emoji: '✝️',
    roles: ['Moine cistercien', 'Abbé de Clairvaux', 'Docteur de l’Église'],
    origine: 'Fontaine-lès-Dijon, Bourgogne',
    accroche:
      'Moine à vingt-trois ans, abbé à vingt-cinq, il couvre l’Europe d’abbayes blanches et fait plier rois et papes par la seule parole.',
    citations: [
      {
        texte:
          'Tu trouveras plus dans les forêts que dans les livres. Les arbres et les rochers t’enseigneront ce qu’aucun maître ne saurait te dire.',
        contexte:
          'Lettre à un jeune homme qui hésitait à quitter l’école pour entrer au monastère, vers 1130.',
        sens:
          'Ce n’est pas un éloge de l’ignorance : Bernard a beaucoup lu. Il dit que la vérité se reçoit d’abord dans le silence et le travail, pas seulement dans la discussion des écoles.',
      },
      {
        texte:
          'À quoi bon, dans les cloîtres, sous les yeux des frères qui lisent, ces monstres ridicules, cette beauté difforme, cette difformité si belle ?',
        contexte:
          'Dans son *Apologie à Guillaume de Saint-Thierry*, vers 1125, contre les sculptures des églises clunisiennes.',
        sens:
          'C’est le manifeste de l’art cistercien : pas de sculpture, pas de couleur, pas de clocher. Un mur nu et de la lumière blanche — exactement le contraire de ce que fait Suger à Saint-Denis.',
      },
      {
        texte:
          'Voici le temps favorable, voici le jour du salut : la terre tremble parce que le Seigneur du ciel commence à perdre sa terre.',
        contexte:
          'Lettre de convocation à la croisade, 1146, répandue dans toute l’Europe avant le sermon de Vézelay.',
        sens:
          'Édesse vient de tomber. Bernard appelle l’Occident à secourir les États latins d’Orient : les rois de France et d’Allemagne prennent la croix sur sa parole.',
      },
      {
        texte: 'L’enfer est plein de bonnes volontés et de bons désirs.',
        contexte:
          'Phrase prêtée à Bernard depuis le Moyen Âge ; on en a tiré le proverbe « l’enfer est pavé de bonnes intentions ».',
        sens: 'Vouloir le bien ne suffit pas : ce qui compte, c’est ce qu’on fait.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils de la noblesse bourguignonne, il entre à Cîteaux en 1113 avec une trentaine de compagnons.',
      'Abbé de Clairvaux à vingt-cinq ans, en 1115, et jusqu’à sa mort.',
      'À sa mort, l’ordre cistercien compte plus de trois cent cinquante abbayes en Europe.',
      'Il rédige la règle des Templiers en 1129 et fait reconnaître le pape Innocent II en 1130.',
      'Il prêche la deuxième croisade à Vézelay, en 1146, devant le roi Louis VII.',
      'Canonisé en 1174, proclamé docteur de l’Église en 1830.',
    ],
    recit: [
      {
        titre: 'Trente jeunes nobles à la porte de Cîteaux',
        texte:
          'Bernard naît en 1090 à **Fontaine-lès-Dijon**, dans une famille de chevaliers. En **1113**, à vingt-trois ans, il se présente à l’abbaye de **Cîteaux**, fondée quinze ans plus tôt pour revenir à la Règle de saint Benoît **à la lettre** — et qui se meurt, faute de vocations. Il n’arrive pas seul : il amène une trentaine de compagnons, dont quatre de ses frères et un oncle. Deux ans plus tard, l’abbé l’envoie fonder une maison dans une vallée déserte de Champagne, la vallée d’Absinthe, qu’il rebaptise **Clairvaux**. Il a vingt-cinq ans, il n’a pour lui que des bras et une volonté ; les premiers hivers sont une famine. Il restera abbé de ce lieu trente-huit ans, refusant tous les évêchés qu’on lui offrira, et ruinant sa santé à force de jeûnes.',
      },
      {
        titre: 'Les moines blancs et les murs nus',
        texte:
          'Les **cisterciens** — les « moines blancs », à cause de leur robe de laine non teinte — reprennent le travail manuel que beaucoup de monastères avaient délaissé. Ils s’installent loin des villes, défrichent, assèchent, creusent des canaux, élèvent des moulins et des **forges** comme celle de **Fontenay**, et font vivre le tout grâce aux **frères convers**, des laïcs qui travaillent aux granges. Leur architecture est un programme : ni sculpture, ni verrière colorée, ni clocher de pierre, ni or. Rien que la proportion, la pierre nue et la lumière blanche — **Fontenay**, **Sénanque**, **Le Thoronet**. C’est le contraire exact du parti de **Suger** à Saint-Denis, et les deux hommes se l’écrivent. Le mouvement explose : une abbaye en 1098, plus de **trois cent cinquante** à la mort de Bernard, de l’Irlande à la Pologne.',
      },
      {
        titre: 'L’homme qui parlait aux rois et aux papes',
        texte:
          'Ce moine qui voulait le silence passe sa vie sur les routes. Au **concile de Troyes**, en 1129, il rédige la règle des **Templiers**, ces moines-soldats nés pour protéger les pèlerins, et écrit l’*Éloge de la nouvelle milice*. En **1130**, deux papes sont élus en même temps : Bernard parcourt la France, l’Angleterre et l’Empire et fait reconnaître **Innocent II** partout — un moine décide de la tête de la chrétienté. En **1145**, l’un de ses propres moines devient pape sous le nom d’**Eugène III** ; Bernard lui écrit un livre entier pour lui rappeler ce qu’il doit être. En **1140**, au concile de **Sens**, il affronte le philosophe **Abélard** : deux manières de chercher Dieu, par la raison qui discute ou par l’amour qui contemple. Bernard l’emporte, et l’histoire lui a souvent donné tort sur ce point.',
      },
      {
        titre: 'Vézelay, 1146',
        texte:
          'Édesse, première principauté latine d’Orient, est tombée en 1144. Le pape charge Bernard de prêcher une nouvelle croisade. Le **31 mars 1146**, sur la colline de **Vézelay**, devant une foule trop nombreuse pour tenir dans la basilique, il parle en plein air ; le roi **Louis VII** et la reine Aliénor prennent la croix. On raconte qu’il manqua de croix d’étoffe à distribuer et qu’il déchira son propre habit pour en tailler d’autres. Il prêche ensuite en Allemagne et y entraîne l’empereur **Conrad III** ; il y défend aussi, publiquement, les communautés juives menacées par des prédicateurs qui appelaient au massacre. La croisade, elle, échoue lamentablement devant **Damas** en 1148. Au retour, l’Europe cherche un coupable ; Bernard prend le reproche sur lui plutôt que de le laisser retomber sur Dieu.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Il meurt à Clairvaux le **20 août 1153**, épuisé, un an avant d’avoir pu voir la fin de la querelle qu’il avait ouverte. Il laisse plus de cinq cents lettres, des centaines de **sermons** — dont une série célèbre sur le *Cantique des cantiques* —, et un traité sur l’amour de Dieu. Son latin est si tenu qu’on l’a surnommé le **docteur mellifluus**, « le docteur au miel ». **Canonisé en 1174**, vingt et un ans après sa mort, il est proclamé **docteur de l’Église** en 1830. À Paris, le collège que son ordre fonda pour ses étudiants s’appelle toujours le collège des Bernardins ; à Clairvaux, il ne reste presque rien — l’abbaye est devenue une prison en 1808.',
      },
    ],
    chrono: [
      { date: '1090', fait: 'Naissance à Fontaine-lès-Dijon, en Bourgogne.' },
      { date: '1113', fait: 'Il entre à Cîteaux avec une trentaine de compagnons.' },
      { date: '1115', fait: 'Fondation de Clairvaux ; il en est abbé à vingt-cinq ans.' },
      { date: '1129', fait: 'Concile de Troyes : il rédige la règle des Templiers.' },
      { date: '1130', fait: 'Schisme pontifical : il impose Innocent II à l’Occident.' },
      { date: '1140', fait: 'Concile de Sens : il fait condamner Abélard.' },
      { date: '31 mars 1146', fait: 'Il prêche la deuxième croisade à Vézelay.' },
      { date: '1148', fait: 'Échec de la croisade devant Damas.' },
      { date: '1153', fait: 'Mort à Clairvaux, le 20 août.' },
      { date: '1174', fait: 'Canonisation par le pape Alexandre III.' },
    ],
    leSaisTu:
      'On lui prête souvent la formule « nous sommes des nains juchés sur des épaules de géants ». Elle n’est pas de lui : elle est de Bernard de Chartres, maître de l’école cathédrale de Chartres, mort vers 1124. Deux Bernard, deux hommes, deux vies voisines — et une confusion qui traîne encore dans les manuels.',
    aRetenir: [
      'Bernard entre à Cîteaux en 1113 et fonde l’abbaye de Clairvaux en 1115.',
      'Les cisterciens reviennent à la Règle de saint Benoît : travail manuel, pauvreté, murs nus.',
      'L’ordre compte plus de trois cent cinquante abbayes en Europe à sa mort, en 1153.',
      'Il rédige la règle des Templiers en 1129 et prêche la deuxième croisade à Vézelay en 1146.',
      'Canonisé en 1174, il est proclamé docteur de l’Église en 1830.',
    ],
    mots: [
      {
        mot: 'Cistercien',
        sens: 'Moine de l’ordre né à Cîteaux en 1098, qui applique la Règle de saint Benoît à la lettre, dans le travail et le dépouillement.',
      },
      {
        mot: 'Frère convers',
        sens: 'Religieux non prêtre d’une abbaye cistercienne, chargé du travail des champs et des ateliers.',
      },
      {
        mot: 'Croisade',
        sens: 'Expédition militaire chrétienne vers la Terre sainte, prêchée par l’Église.',
      },
    ],
    lies: ['saint-benoit', 'suger', 'saint-louis'],
    niveaux: ['5e'],
    programme: 'Société, Église et pouvoir politique dans l’Occident féodal',
    tags: [
      'Clairvaux',
      'Cîteaux',
      'cisterciens',
      'Templiers',
      'Vézelay',
      'deuxième croisade',
      'Fontenay',
      'Abélard',
      'moines blancs',
      'Bourgogne',
    ],
  },
]
