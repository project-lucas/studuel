// -----------------------------------------------------------------------------
// RÉVOLUTION — L'ANNÉE 1789, ET CE QU'ELLE FONDE.
//
// Le lot qui suit `evenements-revolution-causes.ts` : la dette, le pain et la
// Bastille y sont déjà racontés ; ici, on suit ce que la France en fait — une
// assemblée qui se déclare nation, un serment, des campagnes qui s'arment, une
// nuit qui abolit les privilèges, dix-sept articles, des femmes qui vont
// chercher le roi, et une berline arrêtée à Varennes.
//
// LE FIL, d'un bout à l'autre du lot (cf. `docs/encyclopedie.md`, § 3) : la
// NAISSANCE cesse d'être un titre, et l'ARGENT prend sa place. Les deux tiers
// des députés du Tiers état sont des hommes de loi ; la nuit du 4 août abolit
// les privilèges mais rend les droits sur la terre RACHETABLES ; la Déclaration
// fait de la propriété un droit « inviolable et sacré » et la Constitution de
// 1791 réserve le vote à ceux qui paient l'impôt. Ce n'est ni une légende dorée
// ni une légende noire : c'est le mécanisme, et il faut l'écrire.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_REVOLUTION_1789: Evenement[] = [
  {
    id: 'etats-generaux-de-1789',
    volet: 'evenements',
    nom: 'Les États généraux de 1789',
    date: '5 mai 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '🏛️',
    lieu: 'Versailles, salle des Menus Plaisirs',
    accroche:
      'Le roi réunit les trois ordres pour trouver de l’argent ; six semaines plus tard, le Tiers état s’est déclaré Assemblée nationale.',
    citations: [
      {
        texte:
          'Qu’est-ce que le Tiers état ? Tout. Qu’a-t-il été jusqu’à présent dans l’ordre politique ? Rien. Que demande-t-il ? À y devenir quelque chose.',
        qui: 'L’abbé Sieyès',
        contexte:
          'Premières lignes de sa brochure « Qu’est-ce que le Tiers état ? », janvier 1789, tirée à des dizaines de milliers d’exemplaires.',
        sens:
          'Le Tiers état est le pays tout entier — et il n’a aucun pouvoir. La brochure donne à la bourgeoisie sa phrase de ralliement quatre mois avant l’ouverture.',
      },
      {
        texte:
          'Messieurs, ce jour que mon cœur attendait depuis longtemps est enfin arrivé, et je me vois entouré des représentants de la nation à laquelle je me fais gloire de commander.',
        qui: 'Louis XVI',
        contexte: 'Discours d’ouverture des États généraux, Versailles, 5 mai 1789.',
        sens:
          'Le roi vient chercher un accord sur l’impôt, et il le dit sans détour. Personne, ce matin-là, n’imagine une révolution.',
      },
      {
        texte:
          'Que l’impôt soit supporté également par tous, sans distinction d’ordre ni de naissance.',
        qui: 'Un cahier de doléances du Tiers état',
        contexte:
          'La demande revient, à quelques mots près, dans des milliers de cahiers rédigés dans les paroisses pendant l’hiver 1789.',
        sens:
          'Ce n’est la phrase d’aucun cahier précis : c’est la formule commune à presque tous. La France a écrit la même plainte 60 000 fois.',
        incertaine: true,
      },
    ],
    reperes: [
      'Environ 60 000 cahiers de doléances rédigés dans les paroisses, les corporations et les bailliages.',
      '1 139 députés élus : 291 pour le clergé, 270 pour la noblesse, 578 pour le Tiers état.',
      'Le Tiers est doublé en nombre, mais on vote par ordre : deux voix contre une, le doublement ne sert à rien.',
      'Les deux tiers des députés du Tiers état sont des hommes de loi : avocats, notaires, magistrats.',
      'Le 17 juin 1789, le Tiers se proclame Assemblée nationale ; le 9 juillet, Assemblée constituante.',
    ],
    causes: [
      'La faillite du Trésor : le roi convoque les États généraux le 8 août 1788 parce qu’il ne peut plus emprunter.',
      'L’échec des assemblées de notables, qui ont refusé en 1787 un impôt payé par tous.',
      'Le doublement du Tiers accordé le 27 décembre 1788 — sans rien décider du mode de vote, la question qui fâche.',
      'La rédaction des cahiers de doléances, qui fait découvrir à tout un royaume que ses plaintes se ressemblent.',
      'Le prix du pain au plus haut depuis des décennies : les élections se font le ventre vide.',
      'Une bourgeoisie instruite et riche — gens de loi, négociants, médecins — que la société d’ordres tient à l’écart des places.',
    ],
    recit: [
      {
        titre: 'Soixante mille cahiers',
        texte:
          'Pour convoquer les États généraux, il faut élire des députés, et pour les élire, chaque paroisse, chaque corporation, chaque bailliage se réunit et rédige un **cahier de doléances** : la liste de ce qui ne va pas. On en écrit environ **60 000** dans tout le royaume, de la ville de Rouen au hameau de trente feux. Le geste est énorme et sans précédent : pour la première fois, l’État demande officiellement à ses sujets d’écrire ce qu’ils veulent. Les cahiers ne réclament presque jamais la fin de la monarchie — ils veulent un roi, mais un roi qui gouverne autrement : **l’impôt payé par tous**, la fin des droits seigneuriaux, la suppression des **lettres de cachet**, des états généraux réunis régulièrement, une justice moins chère. En les écrivant, la France apprend deux choses qu’elle ignorait : qu’elle se plaint partout de la même chose, et qu’on peut le dire par écrit sans être puni.',
      },
      {
        titre: 'Doubler le Tiers, sans changer la règle',
        texte:
          'Les États généraux de 1614 votaient **par ordre** : le clergé une voix, la noblesse une voix, le Tiers une voix. Dans ce système, les deux premiers ordres l’emportent toujours. À l’automne 1788, le Tiers réclame deux choses : le **doublement** de ses députés, et le vote **par tête** (chaque député compte pour un). Le 27 décembre 1788, le Conseil du roi accorde le doublement… et se tait soigneusement sur le mode de vote. C’est le nœud de toute l’affaire : **578 députés du Tiers ne pèsent rien si l’on vote par ordre**, et ils sont majoritaires si l’on vote par tête. Toute la crise de mai et juin 1789 tient dans cette question de procédure, qui n’a l’air de rien et qui décide de qui gouverne la France.',
      },
      {
        titre: 'Qui sont les 578 du Tiers état',
        texte:
          'On imagine des paysans et des ouvriers : il n’y en a aucun. Le Tiers état envoie à Versailles ses notables — et **les deux tiers d’entre eux sont des hommes de loi** : avocats au parlement, procureurs, notaires, juges de bailliage, auxquels s’ajoutent des négociants, des médecins, des propriétaires. Des hommes instruits, habitués à plaider, à rédiger, à convaincre une assemblée ; des lecteurs de Montesquieu et de Rousseau ; des gens qui ont l’argent, le savoir et la considération de leur ville — et qui butent, depuis toujours, sur une société où la **naissance** décide seule des grades de l’armée, des évêchés et des grandes charges. C’est **la bourgeoisie qui prend la place de la noblesse**, et elle commence par où elle est la plus forte : la procédure, le droit, le texte. En face, la noblesse aligne 270 députés dont une minorité libérale (La Fayette, les Noailles), et le clergé 291, dont environ **deux cents curés de paroisse** pauvres, souvent plus proches de leurs paysans que de leur évêque. Ce sont eux qui feront basculer le mois de juin.',
      },
      {
        titre: 'Le 5 mai, et cinq semaines de blocage',
        texte:
          'Le **4 mai 1789**, une immense procession traverse Versailles ; le **5 mai**, la séance s’ouvre dans la salle des Menus Plaisirs devant douze cents députés. **Necker** parle trois heures — de chiffres, de comptes, d’emprunts — et ne dit pas un mot du vote par tête. Le Tiers comprend qu’on ne lui donnera rien : il refuse alors de vérifier les pouvoirs de ses députés dans sa salle à lui, et invite les deux autres ordres à le faire en commun. Cinq semaines passent sans rien. Le **13 juin**, trois curés franchissent le pas et rejoignent le Tiers ; d’autres suivent. Le **17 juin 1789**, sur une proposition de **Sieyès**, l’assemblée du Tiers se déclare **Assemblée nationale** — c’est-à-dire seule représentante de la nation — et décrète dans la foulée que les impôts existants ne sont plus légaux que par son consentement. L’arme est financière : sans elle, plus une livre ne rentre.',
      },
      {
        titre: 'La séance royale, et le roi qui cède',
        texte:
          'Le **20 juin**, les députés trouvent leur salle fermée et prêtent le **serment du Jeu de paume**. Le **23 juin**, Louis XVI tient une **séance royale** : il y concède beaucoup — consentement de l’impôt, liberté de la presse, fin des lettres de cachet — mais maintient la séparation des trois ordres et ordonne aux députés de se séparer. Le Tiers ne bouge pas. Le **27 juin**, plutôt que d’employer la force, le roi ordonne lui-même au clergé et à la noblesse de rejoindre l’Assemblée. Le vote par tête est acquis ; les trois ordres n’en font plus qu’un. Le **9 juillet 1789**, l’Assemblée se déclare **constituante** : elle ne se contente plus de représenter la nation, elle va lui écrire une **Constitution**. Cinq jours plus tard, Paris prend la Bastille.',
      },
    ],
    consequences: [
      'Le Tiers état se proclame Assemblée nationale le 17 juin 1789 : la souveraineté passe du roi à la nation.',
      'Le vote par tête l’emporte le 27 juin ; la société des trois ordres cesse de fonctionner.',
      'L’Assemblée se déclare constituante le 9 juillet et entreprend d’écrire une Constitution.',
      'La bourgeoisie de robe — avocats, notaires, magistrats — devient la classe qui dirige la Révolution.',
      'Les cahiers de doléances fournissent le programme des réformes de 1789-1791 : impôt égal, fin des droits seigneuriaux, justice réformée.',
      'L’échec de la séance royale du 23 juin prive la monarchie de son dernier moyen d’imposer ses règles sans la force.',
    ],
    chiffres: [
      { valeur: '60 000', quoi: 'cahiers de doléances rédigés dans le royaume' },
      { valeur: '1 139', quoi: 'députés aux États généraux' },
      { valeur: '578', quoi: 'députés du Tiers état, autant que les deux autres ordres réunis' },
      { valeur: '2 sur 3', quoi: 'députés du Tiers état sont des hommes de loi' },
    ],
    chrono: [
      { date: '8 août 1788', fait: 'Convocation des États généraux pour le 5 mai 1789.' },
      { date: '27 décembre 1788', fait: 'Le Tiers est doublé, le mode de vote reste en suspens.' },
      { date: 'janvier 1789', fait: 'Sieyès publie « Qu’est-ce que le Tiers état ? ».' },
      { date: 'février-avril 1789', fait: 'Rédaction des cahiers de doléances et élections.' },
      { date: '5 mai 1789', fait: 'Ouverture à Versailles ; Necker parle trois heures.' },
      { date: '13 juin 1789', fait: 'Les premiers curés rejoignent le Tiers état.' },
      { date: '17 juin 1789', fait: 'Le Tiers se proclame Assemblée nationale.' },
      { date: '20 juin 1789', fait: 'Serment du Jeu de paume.' },
      { date: '23 juin 1789', fait: 'Séance royale : le roi ordonne la séparation des ordres.' },
      { date: '27 juin 1789', fait: 'Le roi cède : les trois ordres siègent ensemble.' },
      { date: '9 juillet 1789', fait: 'L’Assemblée nationale se déclare constituante.' },
    ],
    leSaisTu:
      'Le protocole de 1614 avait tout prévu, y compris les habits. Les députés du Tiers devaient porter un manteau de laine noire et un chapeau sans plume, entrer par une porte latérale et s’agenouiller devant le roi ; la noblesse paradait en soie, or et plumes blanches. Beaucoup de députés du Tiers ont gardé ce costume noir par fierté — et l’ont porté comme un drapeau.',
    aRetenir: [
      'Les États généraux s’ouvrent le 5 mai 1789 à Versailles : c’est la première réunion depuis 1614.',
      'Environ 60 000 cahiers de doléances ont été rédigés dans tout le royaume.',
      'Le doublement du Tiers état ne change rien tant qu’on vote par ordre : d’où le blocage de mai-juin.',
      'Les deux tiers des députés du Tiers état sont des hommes de loi : la bourgeoisie entre en politique.',
      'Le 17 juin 1789, le Tiers état se proclame Assemblée nationale ; le roi cède le 27 juin.',
    ],
    mots: [
      {
        mot: 'Ordre',
        sens: 'Une des trois parties de la société d’Ancien Régime : clergé, noblesse, Tiers état.',
      },
      {
        mot: 'Cahier de doléances',
        sens: 'Registre où une paroisse ou une corporation écrit ses plaintes et ses demandes au roi.',
      },
      {
        mot: 'Vote par tête',
        sens: 'Chaque député compte pour une voix — à l’inverse du vote par ordre, où chaque ordre n’en a qu’une.',
      },
      {
        mot: 'Bailliage',
        sens: 'Circonscription de justice de l’Ancien Régime, qui sert de cadre aux élections de 1789.',
      },
    ],
    lies: [
      'crise-financiere-de-la-monarchie',
      'serment-du-jeu-de-paume',
      'sieyes',
      'mirabeau',
      'louis-xvi',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'États généraux',
      'cahiers de doléances',
      'Tiers état',
      'Sieyès',
      'vote par tête',
      'Versailles',
      'Menus Plaisirs',
      'Assemblée nationale',
      'ordres',
      '1789',
    ],
  },
  {
    id: 'serment-du-jeu-de-paume',
    volet: 'evenements',
    nom: 'Le serment du Jeu de paume',
    date: '20 juin 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '🤝',
    lieu: 'Versailles, salle du Jeu de paume',
    accroche:
      'Trouvant leur salle fermée, les députés se réfugient dans un gymnase et jurent de ne pas se séparer avant d’avoir donné une Constitution à la France.',
    citations: [
      {
        texte:
          'Nous jurons de ne jamais nous séparer, et de nous rassembler partout où les circonstances l’exigeront, jusqu’à ce que la Constitution du royaume soit établie et affermie sur des fondements solides.',
        qui: 'Bailly, président de l’Assemblée nationale',
        contexte:
          'Formule du serment, lue debout sur une table de la salle du Jeu de paume, à Versailles, le 20 juin 1789.',
        sens:
          'Une assemblée décide seule de ne pas obéir à l’ordre de se séparer. C’est l’acte de naissance du pouvoir constituant : la nation se donne sa loi.',
      },
      {
        texte:
          'Allez dire à ceux qui vous envoient que nous sommes ici par la volonté du peuple, et que nous n’en sortirons que par la puissance des baïonnettes.',
        qui: 'Mirabeau',
        contexte:
          'Au marquis de Dreux-Brézé, grand maître des cérémonies venu faire évacuer la salle, à la séance royale du 23 juin 1789.',
        sens:
          'La formulation exacte varie selon les témoins, mais le sens ne bouge pas : le roi peut chasser l’Assemblée, il devra le faire par la force, et il ne le fera pas.',
      },
      {
        texte: 'La nation assemblée ne peut recevoir d’ordres.',
        qui: 'Bailly',
        contexte: 'Réponse au même Dreux-Brézé, avant l’intervention de Mirabeau, le 23 juin 1789.',
        sens:
          'En douze mots, Bailly renverse l’Ancien Régime : ce n’est plus le roi qui commande à la nation, c’est la nation qui délibère.',
      },
      {
        texte: 'Je vous ordonne, Messieurs, de vous séparer tout de suite.',
        qui: 'Louis XVI',
        contexte:
          'Clôture de la séance royale du 23 juin 1789, après avoir concédé le consentement de l’impôt et la liberté de la presse.',
        sens:
          'Le roi avait cédé sur presque tout, sauf sur la séparation des trois ordres. Quatre jours plus tard, il ordonnera lui-même leur réunion.',
      },
    ],
    reperes: [
      'Le 20 juin au matin, la salle des Menus Plaisirs est fermée « pour préparer la séance royale ».',
      'Près de 600 députés se replient sur une salle de jeu de paume, rue du Vieux-Versailles.',
      'Un seul député refuse de signer : Martin-Dauch, de Castelnaudary, qui écrit « opposant » à côté de son nom.',
      'Le 23 juin, à la séance royale, le Tiers refuse de se séparer ; le 27, le roi ordonne la réunion des ordres.',
      'David peint l’épisode à partir de 1790 : la toile, immense, ne sera jamais achevée.',
    ],
    causes: [
      'Le 17 juin, le Tiers état s’est proclamé Assemblée nationale : le roi doit répondre à un acte qu’il n’a pas autorisé.',
      'Le décret du 17 juin déclare les impôts illégaux s’ils ne sont pas consentis par l’Assemblée : le roi est touché au portefeuille.',
      'Le ralliement des curés du bas clergé, qui fait basculer un ordre entier du côté du Tiers.',
      'La cour prépare une séance royale pour annuler le 17 juin, et fait fermer la salle pour l’installer.',
      'La rumeur d’une dissolution et d’une arrestation des meneurs, qui circule dans Versailles depuis deux jours.',
    ],
    recit: [
      {
        titre: 'Une porte fermée sous la pluie',
        texte:
          'Le matin du **20 juin 1789**, les députés de l’Assemblée nationale trouvent la salle des Menus Plaisirs fermée, gardée par des soldats : on y prépare, dit-on, la **séance royale** du 22 — qui sera repoussée au 23. Aucune convocation ne les a prévenus. Sous la pluie, dans la rue, le doute s’installe : est-ce le prélude à une dissolution ? Le docteur **Guillotin**, député de Paris, propose un local tout proche, rue du Vieux-Versailles : une **salle de jeu de paume**, l’ancêtre du tennis, nue, sombre, sans meubles. Près de six cents hommes s’y entassent. On pousse une table au milieu, **Bailly** y monte, et l’Assemblée décide en quelques minutes de faire ce que personne n’a jamais osé : se donner à elle-même une mission que le roi ne lui a pas confiée.',
      },
      {
        titre: 'Le texte du serment',
        texte:
          'La formule est écrite sur place, par **Target** et **Le Chapelier**, et lue par Bailly : « Nous jurons de ne jamais nous séparer, et de nous rassembler partout où les circonstances l’exigeront, jusqu’à ce que la **Constitution du royaume** soit établie et affermie sur des fondements solides. » Les députés la répètent bras tendu, puis signent. Un seul refuse : **Martin-Dauch**, député de Castelnaudary, qui estime ne pouvoir rien voter que le roi n’ait approuvé ; il signe quand même la liste, en ajoutant le mot « **opposant** » à côté de son nom. On veut le malmener, Bailly le protège. Ce détail vaut mieux que bien des discours : dès son premier jour, l’Assemblée doit décider si elle supporte qu’on soit contre.',
      },
      {
        titre: 'Le 23 juin : les baïonnettes',
        texte:
          'La **séance royale** a lieu le 23 juin. Louis XVI y annonce des réformes considérables : plus d’impôt sans consentement des États généraux, fin des **lettres de cachet**, liberté de la presse, suppression de la corvée et de la mainmorte. Mais il annule les décisions du 17 juin et maintient le vote par ordre, puis ordonne aux députés de se séparer. Le clergé et la noblesse sortent ; le Tiers reste assis. Le marquis de **Dreux-Brézé**, grand maître des cérémonies, vient rappeler l’ordre du roi. Bailly lui répond que « la nation assemblée ne peut recevoir d’ordres » ; **Mirabeau** ajoute la phrase qui fera le tour de l’Europe, sur la volonté du peuple et les baïonnettes. Louis XVI, informé, refuse d’employer la troupe — « Eh bien, qu’ils restent », rapporte-t-on — et, le **27 juin**, ordonne lui-même aux deux premiers ordres de rejoindre l’Assemblée.',
      },
      {
        titre: 'Le tableau que la Révolution a dépassé',
        texte:
          'En 1790, le club des Jacobins commande à **Jacques-Louis David** un tableau du serment, financé par souscription : une toile de près de dix mètres sur sept, avec les députés reconnaissables un à un, le vent qui gonfle les rideaux, Bailly debout sur sa table, et au centre trois hommes de religions différentes qui s’embrassent. David en achève le grand dessin préparatoire, expose l’esquisse au Salon de 1791… et n’ira jamais au bout. La raison est politique : en trois ans, une partie des hommes représentés a émigré, une autre a été guillotinée — **Bailly** est exécuté en novembre 1793, **Mirabeau** est sorti du Panthéon en 1794. Peindre ensemble les héros d’un jour devenait impossible. Le chef-d’œuvre inachevé dit exactement ce qu’il voulait célébrer : **la Révolution allait plus vite que ses peintres**.',
      },
    ],
    consequences: [
      'L’Assemblée nationale se déclare en droit d’écrire une Constitution sans l’autorisation du roi.',
      'Le roi renonce à la force le 27 juin et ordonne aux trois ordres de siéger ensemble : le vote par tête est acquis.',
      'Le 9 juillet 1789, l’Assemblée prend le nom d’Assemblée nationale constituante.',
      'Bailly, président du serment, devient le premier maire de Paris le 15 juillet 1789.',
      'Le serment devient l’image fondatrice de la Révolution, reprise en peinture, en gravure et dans les manuels.',
    ],
    chiffres: [
      { valeur: '600', quoi: 'députés environ entassés dans une salle de jeu de paume' },
      { valeur: '1', quoi: 'seul opposant, Martin-Dauch, qui signe « opposant »' },
      { valeur: '3 jours', quoi: 'entre le serment et la séance royale du 23 juin' },
      { valeur: '10 m', quoi: 'de large pour la toile de David, jamais achevée' },
    ],
    chrono: [
      { date: '17 juin 1789', fait: 'Le Tiers état se proclame Assemblée nationale.' },
      { date: '19 juin 1789', fait: 'Le clergé décide de rejoindre l’Assemblée.' },
      { date: '20 juin 1789', fait: 'Salle fermée : serment du Jeu de paume.' },
      { date: '23 juin 1789', fait: 'Séance royale ; Bailly et Mirabeau refusent de se séparer.' },
      { date: '27 juin 1789', fait: 'Le roi ordonne la réunion des trois ordres.' },
      { date: '9 juillet 1789', fait: 'L’Assemblée se déclare constituante.' },
      { date: '1791', fait: 'David expose l’esquisse du « Serment du Jeu de paume ».' },
    ],
    leSaisTu:
      'La salle du Jeu de paume existe toujours, à quelques centaines de mètres du château de Versailles. Elle était alors un gymnase pour nobles : on y jouait à la paume, main nue puis raquette, l’ancêtre du tennis. La Révolution a donc juré sa Constitution au milieu d’un terrain de sport, sous les galeries d’où les spectateurs regardaient les parties.',
    aRetenir: [
      'Le 20 juin 1789, les députés trouvent leur salle fermée et se réunissent dans la salle du Jeu de paume.',
      'Ils jurent de ne pas se séparer avant d’avoir donné une Constitution au royaume : c’est le serment du Jeu de paume.',
      'Un seul député, Martin-Dauch, refuse de prêter serment.',
      'À la séance royale du 23 juin, Mirabeau et Bailly refusent l’ordre de dispersion ; le roi cède le 27 juin.',
      'David a peint la scène à partir de 1790, sans jamais achever sa toile.',
    ],
    mots: [
      {
        mot: 'Constitution',
        sens: 'Texte qui fixe l’organisation des pouvoirs et les droits des citoyens, au-dessus des autres lois.',
      },
      {
        mot: 'Jeu de paume',
        sens: 'Sport de balle joué en salle, ancêtre du tennis ; par extension, la salle où on le pratique.',
      },
      {
        mot: 'Séance royale',
        sens: 'Séance où le roi vient en personne imposer sa volonté à une assemblée.',
      },
    ],
    lies: [
      'etats-generaux-de-1789',
      'mirabeau',
      'sieyes',
      'louis-xvi',
      'declaration-des-droits-de-l-homme',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Jeu de paume',
      'serment',
      'Bailly',
      'Mirabeau',
      'Dreux-Brézé',
      'David',
      'Constitution',
      'Versailles',
      '20 juin 1789',
    ],
  },
  {
    id: 'la-grande-peur',
    volet: 'evenements',
    nom: 'La Grande Peur',
    date: 'juillet – août 1789',
    tri: 1789,
    fin: 1789,
    periode: 'revolution',
    emoji: '🌾',
    lieu: 'Les campagnes du royaume',
    accroche:
      'Une rumeur de brigands payés pour couper les blés encore verts traverse la France en quinze jours : les paysans s’arment et brûlent les registres des seigneurs.',
    citations: [
      {
        texte: 'Les brigands arrivent !',
        qui: 'Le cri des villages, de clocher en clocher',
        contexte:
          'Alarme qui lance chacune des six paniques de l’été, entre le 20 juillet et le 6 août 1789, relayée par le tocsin.',
        sens:
          'On n’a jamais retrouvé la moindre bande. La peur a suffi : elle a armé des centaines de milliers de paysans en deux semaines.',
      },
      {
        texte: 'Les tailles et les droits nous écrasent.',
        qui: 'Une paysanne de Lorraine, rapportée par Arthur Young',
        contexte:
          'L’agronome anglais croise cette femme sur la route près de Mars-la-Tour ; elle paraît soixante ans et en a vingt-huit. Voyage du 12 juillet 1787.',
        sens:
          'Deux ans avant la Grande Peur, tout est dit : ce n’est pas une idée qui soulève les campagnes, c’est le poids de l’impôt et des droits seigneuriaux.',
      },
      {
        texte:
          'Le peuple cherche enfin à secouer un joug qui depuis tant de siècles pesait sur sa tête.',
        qui: 'Le duc d’Aiguillon',
        contexte:
          'À la tribune de l’Assemblée, dans la nuit du 4 août 1789, pour expliquer aux députés pourquoi les campagnes se soulèvent.',
        sens:
          'Un des plus grands propriétaires du royaume reconnaît devant l’Assemblée que la révolte paysanne a une raison. Quelques heures plus tard, les privilèges tombent.',
      },
    ],
    reperes: [
      'Six foyers de panique distincts, du 20 juillet au 6 août 1789, gagnent presque tout le royaume.',
      'La rumeur : des « brigands » payés par les nobles viendraient couper les blés encore verts.',
      'Aucune bande de brigands n’a jamais été retrouvée : la peur était sans objet.',
      'Les paysans s’arment, marchent sur les châteaux et brûlent les terriers, ces registres où sont écrits les droits du seigneur.',
      'La Bretagne, la Lorraine et une partie du Midi sont épargnées ; le reste du pays est traversé en quinze jours.',
      'L’Assemblée répond dans la nuit du 4 août en abolissant les privilèges.',
    ],
    causes: [
      'La disette : en juillet, la récolte n’est pas rentrée et le blé encore vert dans les champs est toute la nourriture de l’année à venir.',
      'Le prix du pain, au plus haut du siècle, qui vide les greniers et remplit les routes.',
      'Des dizaines de milliers de mendiants et de journaliers sans travail errant sur les chemins après l’hiver 1788-1789 : les « brigands » de la rumeur ont un fond de réalité.',
      'L’effondrement de l’autorité après le 14 juillet : intendants en fuite, maréchaussée débordée, plus personne pour démentir une nouvelle.',
      'La croyance en un « complot aristocratique » : les nobles se vengeraient du Tiers état en affamant les campagnes.',
      'L’attente déçue des cahiers de doléances : on a écrit ses plaintes en mars, on n’a rien vu venir en juillet.',
      'La lenteur de l’information : une rumeur voyage à la vitesse d’un cheval, et personne, sur son passage, ne peut la vérifier.',
    ],
    recit: [
      {
        titre: 'Des blés encore verts',
        texte:
          'Juillet est le pire mois de l’année paysanne : c’est la **soudure**, le moment où le grain de la récolte précédente est épuisé et où la nouvelle n’est pas encore coupée. En 1789, après la grêle de 1788 et l’hiver le plus froid du siècle, les greniers sont vides depuis des mois et le pain est au plus cher. Dans les champs, le blé mûrit : c’est toute la vie de l’année qui tient debout sur pied, à la merci d’un incendie ou d’une faux. Il suffit alors d’une nouvelle — un inconnu vu à l’orée d’un bois, un nuage de poussière sur la route — pour que la peur prenne feu. Et la peur a déjà son explication toute prête : les **aristocrates**, vaincus à Versailles, paieraient des **brigands** pour couper les blés verts et affamer le Tiers état.',
      },
      {
        titre: 'Six paniques, quinze jours',
        texte:
          'L’historien **Georges Lefebvre** a reconstitué la carte de l’été : la Grande Peur n’est pas une vague unique mais **six foyers** distincts, partis entre le **20 juillet** et le **6 août 1789** — la Franche-Comté, la Champagne, le Beauvaisis, le Maine, le Ruffécois, le Dauphiné. Chacun se propage de paroisse en paroisse : un cavalier crie la nouvelle, le **tocsin** sonne, le village suivant l’entend, arme ses hommes, envoie un messager au village d’après. En quinze jours, la rumeur a traversé presque tout le royaume — à l’allure d’un homme à cheval, soit quelques kilomètres à l’heure, jour et nuit. Dans chaque paroisse, la même scène : les hommes veillent, armés de fourches, de faux et de quelques fusils, attendent toute la nuit des brigands qui ne viennent jamais… puis se demandent, au matin, ce qu’ils vont faire de leurs armes.',
      },
      {
        titre: 'Ce que les paysans brûlent',
        texte:
          'La réponse arrive vite : ils marchent sur le **château**. Contrairement à l’image d’Épinal, on n’incendie pas partout — quelques centaines de châteaux sont attaqués, surtout en Franche-Comté, en Mâconnais, en Dauphiné et en Alsace, et les morts sont rares. Ce que les paysans veulent, ce sont les **papiers** : le **terrier** et le **chartrier**, ces gros registres où un notaire a inscrit, parcelle par parcelle, ce que chaque tenancier doit au seigneur — le **cens** en argent, le **champart** en gerbes, les **lods** à chaque vente, la **banalité** du moulin et du four. On force l’armoire, on porte les registres sur la place, on y met le feu, parfois en faisant signer une renonciation au seigneur. Le raisonnement est d’une logique imparable : **le droit du seigneur n’existe que parce qu’il est écrit** ; brûle le registre, et la dette n’a plus de preuve.',
      },
      {
        titre: 'La peur monte à Versailles',
        texte:
          'À l’Assemblée, les lettres s’accumulent : des provinces entières échappent à tout contrôle, les impôts ne rentrent plus, les droits seigneuriaux ne sont plus payés nulle part. Les députés sont pour la plupart des propriétaires — nobles, bourgeois, ecclésiastiques — et beaucoup perçoivent eux-mêmes des droits. Réprimer ? L’armée n’est plus sûre depuis juillet et les milices bourgeoises viennent à peine de naître. Le comité qui se réunit le **3 août** cherche une déclaration de maintien de l’ordre ; le lendemain soir, la séance du **4 août** prend un tout autre tour et abolit les privilèges. La Grande Peur laisse deux héritages : les **gardes nationales rurales**, armées cet été-là et qui ne rendront pas leurs fusils, et la preuve que **les campagnes peuvent imposer une loi à Versailles** sans envoyer un seul député.',
      },
    ],
    consequences: [
      'Des centaines de châteaux sont visités ou attaqués, et des milliers de terriers brûlés : les droits seigneuriaux deviennent impossibles à percevoir.',
      'L’Assemblée abolit les privilèges dans la nuit du 4 août 1789 pour ramener le calme dans les campagnes.',
      'Des gardes nationales se créent dans les villages et y restent : les campagnes sont armées.',
      'La peur du « complot aristocratique » s’installe durablement et nourrira les journées révolutionnaires suivantes.',
      'L’émigration nobiliaire commence dès l’été 1789, alimentée par l’insécurité dans les provinces.',
    ],
    chiffres: [
      { valeur: '6', quoi: 'foyers de panique entre le 20 juillet et le 6 août 1789' },
      { valeur: '15 jours', quoi: 'pour traverser presque tout le royaume' },
      { valeur: '0', quoi: 'bande de brigands jamais retrouvée' },
      { valeur: '3 semaines', quoi: 'entre le début de la peur et la nuit du 4 août' },
    ],
    chrono: [
      { date: 'printemps 1789', fait: 'Émeutes de subsistance et routes pleines de mendiants.' },
      { date: '14 juillet 1789', fait: 'La Bastille tombe ; l’autorité royale recule partout.' },
      { date: '20 juillet 1789', fait: 'Premiers foyers de panique en Franche-Comté et en Champagne.' },
      { date: 'fin juillet 1789', fait: 'Les paysans marchent sur les châteaux et brûlent les terriers.' },
      { date: '6 août 1789', fait: 'La dernière panique s’éteint faute de brigands.' },
      { date: '4 août 1789', fait: 'L’Assemblée abolit les privilèges pour calmer les campagnes.' },
      { date: '11 août 1789', fait: 'Le décret distingue droits abolis et droits rachetables.' },
    ],
    leSaisTu:
      'Plusieurs paniques sont parties de presque rien : un troupeau soulevant la poussière, des moissonneurs saisonniers aperçus de loin, une fumée de charbonniers dans un bois. Dans certaines paroisses, on a sonné le tocsin toute la nuit et veillé en armes jusqu’au matin — contre un champ de vaches.',
    aRetenir: [
      'La Grande Peur se déroule de fin juillet à début août 1789 dans les campagnes françaises.',
      'Elle naît de la disette et de la rumeur de brigands payés par les nobles pour couper les blés verts.',
      'Aucune bande de brigands n’a jamais existé : c’est une panique collective.',
      'Les paysans s’arment et brûlent les terriers, les registres qui prouvent les droits seigneuriaux.',
      'Elle pousse l’Assemblée à abolir les privilèges dans la nuit du 4 août 1789.',
    ],
    mots: [
      {
        mot: 'Terrier',
        sens: 'Registre où sont inscrits, parcelle par parcelle, les droits qu’un seigneur perçoit sur ses tenanciers.',
      },
      {
        mot: 'Soudure',
        sens: 'Période de l’été où le grain de l’année précédente est épuisé et la nouvelle récolte pas encore coupée.',
      },
      {
        mot: 'Tocsin',
        sens: 'Sonnerie de cloche répétée qui alerte tout un village d’un danger.',
      },
      {
        mot: 'Jacquerie',
        sens: 'Révolte paysanne, du nom de « Jacques » donné autrefois aux paysans.',
      },
    ],
    lies: [
      'crise-du-pain-et-des-grains',
      'prise-de-la-bastille',
      'nuit-du-4-aout',
      'etats-generaux-de-1789',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Grande Peur',
      'brigands',
      'terriers',
      'châteaux',
      'paysans',
      'rumeur',
      'tocsin',
      'jacquerie',
      'droits seigneuriaux',
      'été 1789',
    ],
  },
  {
    id: 'nuit-du-4-aout',
    volet: 'evenements',
    nom: 'La nuit du 4 août',
    date: '4 août 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '🌙',
    lieu: 'Versailles, salle des Menus Plaisirs',
    accroche:
      'En une nuit, des nobles proposent eux-mêmes d’abolir les privilèges — mais les droits sur la terre ne sont pas supprimés : ils sont rendus rachetables.',
    citations: [
      {
        texte: 'L’Assemblée nationale détruit entièrement le régime féodal.',
        qui: 'L’Assemblée nationale constituante',
        contexte: 'Article premier du décret des 4-11 août 1789, rédigé dans la semaine qui suit la nuit.',
        sens:
          'La phrase est absolue ; les dix-huit articles suivants la corrigent. Les droits sur la terre restent dus tant que le paysan ne les a pas rachetés.',
      },
      {
        texte: 'Faites lever la séance : ils ne sont plus maîtres d’eux-mêmes.',
        qui: 'Lally-Tollendal',
        contexte:
          'Billet passé au président Le Chapelier pendant la séance, alors que les renonciations s’enchaînent sans débat, nuit du 4 au 5 août 1789.',
        sens:
          'Un député royaliste comprend que l’assemblée est emportée par son propre élan et vote en quelques heures ce qu’elle aurait discuté des mois.',
      },
      {
        texte: 'Le bon évêque nous ôte la chasse : je lui ôterai bien ses dîmes.',
        qui: 'Le duc du Châtelet',
        contexte:
          'Après que l’évêque de Chartres eut proposé, cette nuit-là, l’abolition du droit de chasse réservé aux nobles.',
        sens:
          'La nuit du 4 août avance aussi par piques et par surenchère : chacun sacrifie volontiers le privilège du voisin. L’anecdote vient des mémoires du temps.',
        incertaine: true,
      },
      {
        texte: 'Louis XVI, restaurateur de la liberté française.',
        qui: 'L’Assemblée nationale',
        contexte:
          'Titre décerné au roi à la fin de la nuit du 4 août 1789, avant de faire chanter un Te Deum à la chapelle de Versailles.',
        sens:
          'L’Assemblée ne se veut pas contre le roi : elle lui attribue l’abolition des privilèges et le remercie. Le roi, lui, ne sanctionnera les décrets qu’en octobre.',
      },
    ],
    reperes: [
      'La séance s’ouvre à 20 h le 4 août et s’achève vers 2 h du matin.',
      'Ce sont deux nobles — le vicomte de Noailles puis le duc d’Aiguillon — qui proposent les premiers d’abolir les droits féodaux.',
      'Tombent dans la nuit : la dîme, les privilèges fiscaux, les justices seigneuriales, la vénalité des offices, les privilèges des villes et des provinces.',
      'Le décret rédigé du 5 au 11 août distingue les droits « personnels », abolis sans indemnité, et les droits « réels », seulement rachetables.',
      'Les paysans paieront jusqu’au 17 juillet 1793, date de l’abolition sans rachat.',
    ],
    causes: [
      'La Grande Peur : les campagnes s’arment, brûlent les terriers et ne paient plus rien ; il faut les calmer.',
      'L’impossibilité de réprimer : l’armée n’est plus sûre depuis juillet, la maréchaussée est débordée.',
      'La paralysie financière : ni la dîme, ni les droits seigneuriaux, ni l’impôt ne rentrent plus dans plusieurs provinces.',
      'Le calcul d’une noblesse libérale, qui préfère offrir ce qu’elle va perdre et en tirer l’honneur.',
      'Les cahiers de doléances, qui demandaient déjà presque tous la fin des droits seigneuriaux.',
      'La contagion de la séance elle-même : une fois la première renonciation faite, refuser la sienne devient impossible.',
    ],
    recit: [
      {
        titre: 'Une séance convoquée pour rétablir l’ordre',
        texte:
          'Le **3 août 1789**, le comité des rapports présente à l’Assemblée un tableau alarmant : châteaux attaqués, registres brûlés, impôts et droits impayés dans des provinces entières. On prévoit pour le lendemain soir une déclaration sévère sur le respect des propriétés. Mais le club breton — l’ancêtre des Jacobins — a préparé autre chose. À **20 heures**, le **vicomte de Noailles**, noble et officier, monte à la tribune : on ne calmera pas les campagnes par des menaces, dit-il, mais en supprimant ce qui les révolte. Il propose l’égalité devant l’impôt et le rachat des droits féodaux. Le **duc d’Aiguillon**, l’un des plus riches propriétaires du royaume, approuve et surenchérit. En vingt minutes, la séance a changé de nature.',
      },
      {
        titre: 'L’avalanche',
        texte:
          'Alors tout part. Un député breton abandonne les privilèges de sa province, un autre ceux de sa ville ; l’évêque de Chartres offre le droit de **chasse**, un noble répond en offrant la **dîme** des évêques. En quelques heures tombent le **servage** résiduel, les **justices seigneuriales**, les **banalités** du four et du moulin, les **colombiers**, la **vénalité des offices** — c’est-à-dire les charges publiques qu’on achetait et qu’on transmettait à son fils —, les exemptions fiscales du clergé et de la noblesse, les privilèges des villes, des provinces et des corporations. Des députés pleurent, s’embrassent, réclament d’être les suivants à renoncer. **Lally-Tollendal** fait passer au président **Le Chapelier** un billet pour qu’on lève la séance : « ils ne sont plus maîtres d’eux-mêmes ». On siège jusqu’à deux heures du matin, on proclame Louis XVI « restaurateur de la liberté française », et on va chanter un *Te Deum*.',
      },
      {
        titre: 'Le lendemain, les juristes relisent',
        texte:
          'Du **5 au 11 août**, l’Assemblée transforme l’élan en texte, et ce sont des avocats qui tiennent la plume. Le décret compte **dix-neuf articles**. L’article premier claque : « L’Assemblée nationale détruit entièrement le régime féodal. » Les suivants nuancent. Sont abolis **sans indemnité** les droits dits **personnels** — servage, corvées, justices seigneuriales, chasse, banalités — parce qu’ils portent atteinte à la liberté des personnes. Mais les droits dits **réels**, ceux qui pèsent sur la terre — le **cens**, le **champart**, les **lods** —, sont déclarés **rachetables** : ils continuent d’être dus tant que le paysan n’a pas versé au seigneur **vingt fois** le montant annuel (vingt-cinq fois pour les droits casuels), en argent comptant. Un paysan qui doit trois setiers de blé par an doit donc en trouver soixante d’un coup pour être libre. Presque personne ne peut ; presque personne ne paie non plus. La **Convention** finira par supprimer ces droits sans rachat le **17 juillet 1793** — quatre ans plus tard.',
      },
      {
        titre: 'Qui gagne à la nuit du 4 août',
        texte:
          'Le 4 août fait tomber une chose immense : **la naissance cesse d’être un titre**. Il n’y a plus d’ordres, plus d’exemptions d’impôt, plus de charges réservées, plus de justice rendue par le propriétaire du village. L’égalité devant la loi et devant l’impôt sort de cette nuit-là, et elle n’est jamais revenue en arrière. Mais il faut voir aussi ce qui en sort **renforcé** : la **propriété**. En rendant les droits rachetables plutôt qu’abolis, l’Assemblée les traite comme des biens qu’on ne peut retirer sans indemnité — et trois semaines plus tard, la Déclaration des droits de l’homme fera de la propriété un droit « **inviolable et sacré** ». Les acheteurs de biens nationaux, les bourgeois qui possédaient eux aussi des droits seigneuriaux, les gros fermiers y trouvent leur compte. C’est le basculement du siècle, et il tient en une phrase : **le privilège de naissance recule, le pouvoir de la fortune avance**.',
      },
    ],
    consequences: [
      'Fin de la société d’ordres : plus de privilèges de naissance, plus d’exemption fiscale, égalité devant la loi et devant l’impôt.',
      'Suppression de la dîme, des justices seigneuriales, des banalités et de la vénalité des offices.',
      'Les droits « réels » restent dus jusqu’à rachat : les paysans continuent de payer jusqu’au 17 juillet 1793.',
      'La propriété sort renforcée de la nuit où la naissance perd : elle devient trois semaines plus tard un droit « inviolable et sacré ».',
      'La France cesse d’être une mosaïque de privilèges locaux : elle peut être découpée en 83 départements en 1790.',
      'La perte de la dîme fragilise l’Église et ouvre la voie à la nationalisation de ses biens en novembre 1789.',
    ],
    chiffres: [
      { valeur: '6 heures', quoi: 'de séance, de 20 h au 5 août à 2 h du matin' },
      { valeur: '19', quoi: 'articles dans le décret des 4-11 août 1789' },
      { valeur: '20 fois', quoi: 'le montant annuel à verser pour racheter un droit sur la terre' },
      { valeur: '4 ans', quoi: 'd’attente avant l’abolition sans rachat, le 17 juillet 1793' },
    ],
    chrono: [
      { date: 'juillet 1789', fait: 'La Grande Peur soulève les campagnes.' },
      { date: '3 août 1789', fait: 'L’Assemblée entend le rapport sur les désordres des provinces.' },
      { date: '4 août 1789, 20 h', fait: 'Noailles et d’Aiguillon proposent d’abolir les droits féodaux.' },
      { date: '5 août 1789, 2 h', fait: 'Fin de la séance ; Louis XVI « restaurateur de la liberté ».' },
      { date: '11 août 1789', fait: 'Décret en 19 articles : droits personnels abolis, droits réels rachetables.' },
      { date: '2 novembre 1789', fait: 'Les biens du clergé sont mis à la disposition de la nation.' },
      { date: '17 juillet 1793', fait: 'La Convention supprime les droits féodaux sans rachat.' },
    ],
    leSaisTu:
      'Le vicomte de Noailles, qui ouvre la nuit du 4 août en proposant d’abolir les droits féodaux, n’en perçoit aucun : cadet de famille, il est sans terre et sans fief. Ses collègues lui en feront la remarque et le surnommeront « Jean sans Terre ». Il est aussi le beau-frère de La Fayette.',
    aRetenir: [
      'Dans la nuit du 4 août 1789, l’Assemblée abolit les privilèges : c’est la fin de la société d’ordres.',
      'Ce sont des nobles, Noailles et d’Aiguillon, qui ouvrent la séance des renonciations.',
      'Dîme, justices seigneuriales, banalités et vénalité des offices sont supprimées sans indemnité.',
      'Les droits féodaux sur la terre ne sont pas abolis mais rachetables : les paysans paieront jusqu’en 1793.',
      'Le décret des 4-11 août fonde l’égalité devant la loi et devant l’impôt.',
    ],
    mots: [
      {
        mot: 'Droits féodaux',
        sens: 'Redevances en argent ou en nature qu’un paysan doit au seigneur du lieu, en plus de l’impôt royal.',
      },
      {
        mot: 'Dîme',
        sens: 'Part de la récolte — souvent un douzième ou un treizième — versée à l’Église.',
      },
      {
        mot: 'Banalité',
        sens: 'Obligation d’utiliser, en payant, le moulin, le four ou le pressoir du seigneur.',
      },
      {
        mot: 'Vénalité des offices',
        sens: 'Système où les charges publiques s’achètent, se revendent et se transmettent par héritage.',
      },
      {
        mot: 'Rachat',
        sens: 'Paiement d’une somme au seigneur pour être libéré définitivement d’un droit sur sa terre.',
      },
    ],
    lies: [
      'la-grande-peur',
      'declaration-des-droits-de-l-homme',
      'etats-generaux-de-1789',
      'crise-financiere-de-la-monarchie',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'nuit du 4 août',
      'privilèges',
      'droits féodaux',
      'dîme',
      'Noailles',
      'Aiguillon',
      'rachat',
      'régime féodal',
      'égalité',
    ],
  },
  {
    id: 'declaration-des-droits-de-l-homme',
    volet: 'evenements',
    nom: 'La Déclaration des droits de l’homme et du citoyen',
    date: '26 août 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '📜',
    lieu: 'Versailles, Assemblée nationale constituante',
    accroche:
      'Dix-sept articles votés en six jours : la France y écrit que les hommes naissent libres et égaux — et ce texte ouvre encore la Constitution d’aujourd’hui.',
    citations: [
      {
        texte:
          'Les hommes naissent et demeurent libres et égaux en droits. Les distinctions sociales ne peuvent être fondées que sur l’utilité commune.',
        qui: 'L’Assemblée nationale constituante',
        contexte: 'Article premier de la Déclaration des droits de l’homme et du citoyen, 26 août 1789.',
        sens:
          'Trois semaines après la nuit du 4 août, la phrase enterre la société d’ordres : on ne naît plus noble ou roturier, on naît égal en droits.',
      },
      {
        texte:
          'La libre communication des pensées et des opinions est un des droits les plus précieux de l’homme : tout citoyen peut donc parler, écrire, imprimer librement, sauf à répondre de l’abus de cette liberté dans les cas déterminés par la loi.',
        qui: 'L’Assemblée nationale constituante',
        contexte: 'Article 11, voté le 24 août 1789 après un débat serré sur la censure.',
        sens:
          'La liberté de la presse est écrite dans le droit français. En un an, plus de trois cents journaux naissent à Paris.',
      },
      {
        texte: 'La femme naît libre et demeure égale à l’homme en droits.',
        qui: 'Olympe de Gouges',
        contexte:
          'Article premier de sa « Déclaration des droits de la femme et de la citoyenne », septembre 1791 : la réponse d’une femme au texte de 1789.',
        sens:
          'La Déclaration de 1789 dit « les hommes » et l’entend au sens du genre humain — mais les femmes n’auront ni le vote, ni les droits politiques.',
      },
      {
        texte:
          'Tous les habitants d’un pays doivent y jouir des droits de citoyen passif ; tous ne sont pas citoyens actifs.',
        qui: 'L’abbé Sieyès',
        contexte:
          'Dans son « Préliminaire de la Constitution », juillet 1789, en préparant la distinction qui fondera le suffrage censitaire de 1791.',
        sens:
          'Égaux en droits, oui ; électeurs, non. Voter sera réservé à ceux qui paient un impôt égal à trois journées de travail.',
      },
    ],
    reperes: [
      'Votée article par article du 20 au 26 août 1789 : 17 articles et un préambule.',
      'Inspirée des Lumières, de la Déclaration d’indépendance américaine (1776) et de la déclaration de Virginie.',
      'La Fayette en avait déposé un premier projet dès le 11 juillet 1789.',
      'Le roi ne la sanctionne que le 5 octobre 1789, sous la pression de la marche des femmes sur Versailles.',
      'Elle ne dit rien des femmes ni des esclaves des colonies, et le suffrage devient censitaire en 1791.',
      'Depuis 1971, elle a valeur constitutionnelle : les lois françaises doivent la respecter.',
    ],
    causes: [
      'La philosophie des Lumières : Montesquieu et la séparation des pouvoirs, Rousseau et la volonté générale, Voltaire et la tolérance.',
      'L’exemple américain, rapporté par les officiers rentrés de la guerre d’Amérique, La Fayette en tête.',
      'La nuit du 4 août : ayant détruit l’ancien ordre, l’Assemblée doit écrire celui qui le remplace.',
      'Les cahiers de doléances, qui réclamaient des garanties contre l’arbitraire, les lettres de cachet et la censure.',
      'La méthode choisie par les constituants : poser d’abord les principes, écrire ensuite la Constitution — elle viendra en 1791.',
    ],
    recit: [
      {
        titre: 'Faut-il écrire les principes d’abord ?',
        texte:
          'La question occupe l’Assemblée tout l’été. **Malouet** et les modérés s’y opposent : annoncer des droits abstraits à un peuple qui a faim, c’est, dit-il, montrer de beaux habits à un homme nu. **La Fayette**, rentré d’Amérique où il a vu faire, dépose un projet dès le **11 juillet 1789**, corrigé avec l’aide de son ami **Jefferson**, alors ambassadeur des États-Unis à Paris. Le **4 août** tranche : puisqu’on vient de détruire l’ancien ordre, il faut dire au nom de quoi. Une trentaine de projets circulent ; on en fait un texte unique, discuté **article par article du 20 au 26 août**. Les constituants travaillent vite, dans l’urgence, sans savoir qu’ils écrivent pour deux siècles. Le roi, lui, attend : il ne sanctionnera le texte que le **5 octobre**, quand six mille femmes seront à sa porte.',
      },
      {
        titre: 'Ce que disent les dix-sept articles',
        texte:
          'L’article 2 fixe le but de la politique : « Le but de toute association politique est la conservation des droits naturels et imprescriptibles de l’homme. Ces droits sont la **liberté**, la **propriété**, la **sûreté** et la **résistance à l’oppression**. » L’article 4 définit la liberté : « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui » — et ajoute que seules les lois peuvent fixer ces bornes. L’article 6 est le cœur du texte : « La **loi** est l’expression de la volonté générale… Elle doit être la même pour tous, soit qu’elle protège, soit qu’elle punisse. Tous les citoyens étant égaux à ses yeux sont également admissibles à toutes dignités, places et emplois publics, selon leur capacité, et sans autre distinction que celle de leurs **vertus** et de leurs **talents**. » C’est la fin, écrite noir sur blanc, du monopole de la naissance sur les carrières. L’article 11 donne la liberté d’écrire et d’imprimer. Et l’article 17 ferme le texte sur la propriété, « droit **inviolable et sacré** », dont nul ne peut être privé sans « une juste et préalable indemnité ».',
      },
      {
        titre: 'Ce que la Déclaration laisse dehors',
        texte:
          'Elle proclame l’égalité en droits, et elle a des angles morts que l’histoire a mis longtemps à combler. **Les femmes** : le texte dit « les hommes » au sens d’êtres humains, mais aucune femme ne votera ni ne siégera ; **Olympe de Gouges** répond en 1791 par une *Déclaration des droits de la femme et de la citoyenne* et écrit que « la femme a le droit de monter sur l’échafaud ; elle doit avoir également celui de monter à la tribune » — elle sera guillotinée en 1793. **Les esclaves des colonies** : à Saint-Domingue, la Martinique et la Guadeloupe, le *Code noir* continue de s’appliquer sous une déclaration qui proclame les hommes libres ; les planteurs y veillent, et l’esclavage ne sera aboli qu’en **1794**, rétabli en 1802, puis définitivement supprimé en 1848. **Les pauvres** : la Constitution de **1791** distingue les **citoyens actifs**, qui paient un impôt égal à trois journées de travail et votent, des **citoyens passifs**, qui ont les mêmes droits civils mais pas le droit de vote. Ils sont environ 4,3 millions d’actifs pour 3 millions de passifs. L’égalité est proclamée ; le cens, lui, se compte en argent.',
      },
      {
        titre: 'Ce qu’elle est devenue',
        texte:
          'Le texte aurait pu rester une page d’archive. Il est devenu du **droit vivant**. Traduit dans toute l’Europe dès 1789, il inspire les révolutions du XIXᵉ siècle, puis la **Déclaration universelle des droits de l’homme** de 1948, à laquelle travaille le Français **René Cassin**. En France, il est placé en tête de plusieurs constitutions, puis cité par le **préambule de la Constitution de 1958**, celle de la Vᵉ République. Le **16 juillet 1971**, le Conseil constitutionnel décide que ce préambule — donc la Déclaration de 1789 — fait partie des textes qu’une loi ne peut pas violer : c’est le **bloc de constitutionnalité**. Cent quatre-vingt-deux ans après son vote, une loi française peut être annulée parce qu’elle contredit un article écrit en août 1789. Peu de textes politiques ont eu cette longévité.',
      },
    ],
    consequences: [
      'Fin de l’arbitraire : plus de lettres de cachet, plus d’arrestation ni de peine sans loi (articles 7 à 9).',
      'Liberté d’opinion, y compris religieuse, et liberté de la presse : plus de trois cents journaux naissent à Paris en un an.',
      'La souveraineté appartient à la nation, non au roi (article 3) : la monarchie devient constitutionnelle en 1791.',
      'La propriété devient un droit « inviolable et sacré », ce qui protège aussi les fortunes nouvelles et les acheteurs de biens nationaux.',
      'Les exclus du texte — femmes, esclaves, citoyens passifs — s’en serviront pour réclamer leur place : Olympe de Gouges, les libres de couleur, les républicains.',
      'Elle ouvre aujourd’hui la Constitution de 1958 et s’impose au législateur depuis la décision du 16 juillet 1971.',
    ],
    chiffres: [
      { valeur: '17', quoi: 'articles, plus un préambule' },
      { valeur: '6 jours', quoi: 'de débats, du 20 au 26 août 1789' },
      { valeur: '4,3 millions', quoi: 'de citoyens actifs — les seuls électeurs — en 1791' },
      { valeur: '182 ans', quoi: 'avant qu’une loi puisse être annulée à cause d’elle (1971)' },
    ],
    chrono: [
      { date: '11 juillet 1789', fait: 'La Fayette dépose un premier projet de déclaration.' },
      { date: '4 août 1789', fait: 'L’abolition des privilèges rend le texte nécessaire.' },
      { date: '20-26 août 1789', fait: 'Vote article par article des 17 articles.' },
      { date: '5 octobre 1789', fait: 'Le roi sanctionne enfin la Déclaration et les décrets d’août.' },
      { date: 'septembre 1791', fait: 'Olympe de Gouges publie la Déclaration des droits de la femme.' },
      { date: '3 septembre 1791', fait: 'La Constitution la place en préambule ; le suffrage est censitaire.' },
      { date: '10 décembre 1948', fait: 'Déclaration universelle des droits de l’homme, à l’ONU.' },
      { date: '16 juillet 1971', fait: 'Le Conseil constitutionnel lui donne valeur constitutionnelle.' },
    ],
    leSaisTu:
      'Le texte a été affiché, imprimé, brodé, peint sur des éventails et gravé sur des assiettes. Les deux Tables des droits de l’homme, encadrées comme les Tables de la Loi de Moïse, décorent les mairies dès 1790 : la Révolution reprend l’image la plus solennelle qu’elle connaisse pour dire que ses articles ne se discutent pas.',
    aRetenir: [
      'La Déclaration des droits de l’homme et du citoyen est votée le 26 août 1789 : 17 articles.',
      'Article 1 : « Les hommes naissent et demeurent libres et égaux en droits. »',
      'Article 6 : la loi est la même pour tous, et les emplois publics sont ouverts aux talents, non à la naissance.',
      'Elle exclut les femmes et les esclaves des colonies, et le suffrage devient censitaire en 1791.',
      'Elle figure au préambule de la Constitution de 1958 et s’impose aux lois depuis 1971.',
    ],
    mots: [
      {
        mot: 'Droit naturel',
        sens: 'Droit qu’un être humain possède du seul fait qu’il est né, avant toute loi écrite.',
      },
      {
        mot: 'Suffrage censitaire',
        sens: 'Droit de vote réservé à ceux qui paient un impôt — le cens — au-dessus d’un certain montant.',
      },
      {
        mot: 'Citoyen actif',
        sens: 'En 1791, citoyen payant l’équivalent de trois journées de travail en impôt, et seul électeur.',
      },
      {
        mot: 'Sanction royale',
        sens: 'Approbation du roi qui rend un décret de l’Assemblée exécutoire.',
      },
    ],
    lies: [
      'nuit-du-4-aout',
      'olympe-de-gouges',
      'la-fayette',
      'marche-des-femmes-sur-versailles',
      'declaration-universelle-des-droits-de-l-homme',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Déclaration des droits de l’homme',
      'DDHC',
      '26 août 1789',
      'liberté',
      'égalité',
      'propriété',
      'La Fayette',
      'Olympe de Gouges',
      'citoyen actif',
      'suffrage censitaire',
      'droits naturels',
    ],
  },
  {
    id: 'marche-des-femmes-sur-versailles',
    volet: 'evenements',
    nom: 'La marche des femmes sur Versailles',
    date: '5 – 6 octobre 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '🥖',
    lieu: 'De Paris à Versailles',
    accroche:
      'Six mille femmes partent des halles sous la pluie chercher du pain à Versailles ; elles en reviennent avec le roi, la reine et le dauphin.',
    citations: [
      {
        texte:
          'Mes amis, j’irai à Paris avec ma femme et mes enfants ; c’est à l’amour de mes bons et fidèles sujets que je confie ce que j’ai de plus précieux.',
        qui: 'Louis XVI',
        contexte: 'Au balcon de la cour de Marbre, à Versailles, devant la foule, le 6 octobre 1789 au matin.',
        sens:
          'Le roi cède, mais il choisit ses mots : il part de son plein gré et confie sa famille au peuple. La foule répond « Vive le roi ! ».',
      },
      {
        texte:
          'Je sais qu’on vient de Paris pour demander ma tête ; mais j’ai appris de ma mère à ne pas craindre la mort, et je l’attendrai avec fermeté.',
        qui: 'Marie-Antoinette',
        contexte:
          'Dans la nuit du 5 au 6 octobre, à ses dames, rapporté par sa première femme de chambre Madame Campan.',
        sens:
          'Quelques heures plus tard, elle paraîtra seule au balcon devant une foule armée, et saluera. Personne ne tirera.',
      },
      {
        texte: 'Qu’est-ce que ça nous fait, la Constitution ? Nous voulons du pain !',
        qui: 'Une femme des halles, au président Mounier',
        contexte:
          'À Versailles, le soir du 5 octobre 1789, pendant que l’Assemblée débattait de la sanction royale des décrets.',
        sens:
          'Les versions du propos varient selon les témoins. Il dit ce que toutes les journées populaires disent : d’abord manger, ensuite les principes.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le 5 octobre au matin, 6 000 à 7 000 femmes partent de l’Hôtel de Ville : 22 km à pied sous la pluie.',
      'Elles sont conduites par Stanislas Maillard, huissier et « vainqueur de la Bastille », et traînent deux canons.',
      'La Fayette les suit le soir avec 15 000 à 20 000 gardes nationaux, poussé par ses propres hommes.',
      'Le 5 au soir, le roi accepte enfin la Déclaration des droits de l’homme et les décrets du 4 août.',
      'Le 6 au matin, la foule entre dans le château ; deux gardes du corps sont tués.',
      'Le 6 au soir, la famille royale s’installe aux Tuileries ; l’Assemblée suit à Paris le 19 octobre.',
    ],
    causes: [
      'Le pain : malgré la récolte rentrée, les boulangeries parisiennes restent vides et les queues commencent avant l’aube.',
      'Le banquet des gardes du corps, le 1er octobre à l’Opéra de Versailles, où l’on aurait piétiné la cocarde tricolore.',
      'Le refus du roi, depuis six semaines, de sanctionner la Déclaration des droits de l’homme et les décrets du 4 août.',
      'La peur d’un coup de force : le régiment de Flandre vient d’être appelé à Versailles.',
      'Les journaux — Marat, Desmoulins, Loustalot — qui répètent qu’il faut aller chercher le roi et l’installer à Paris.',
      'La tradition : les dames des halles avaient de longue date le droit de se présenter au roi pour lui parler.',
    ],
    recit: [
      {
        titre: 'Le banquet de trop',
        texte:
          'Le **1er octobre 1789**, les gardes du corps du roi offrent un banquet au **régiment de Flandre**, appelé à Versailles depuis quelques jours. On dîne dans la salle de l’Opéra du château, on boit à la santé du roi, la famille royale paraît, et l’on arbore — disent les récits qui arrivent à Paris — des cocardes blanches et noires, tandis que la **cocarde tricolore** serait foulée aux pieds. Vrai ou amplifié, le récit fait l’effet d’une étincelle. Les journaux parisiens s’en emparent, dans une ville où le pain manque toujours et où l’on attend depuis six semaines que le roi signe la Déclaration des droits de l’homme. **Marat** écrit qu’il faut aller chercher le roi ; **Desmoulins** aussi. Le 4 octobre, Paris est à cran.',
      },
      {
        titre: 'Vingt-deux kilomètres sous la pluie',
        texte:
          'Le **5 octobre au matin**, une jeune femme bat le tambour dans le quartier Saint-Eustache ; les **femmes des halles** — marchandes de poissons, revendeuses, ouvrières — se rassemblent, envahissent l’Hôtel de Ville, s’emparent d’armes et de deux canons. Elles sont six à sept mille à partir vers Versailles, conduites par **Stanislas Maillard**, huissier et vainqueur de la Bastille, qu’on charge de les organiser. Vingt-deux kilomètres, six heures de marche sous une pluie battante. Elles arrivent trempées en fin d’après-midi, envahissent l’Assemblée, s’assoient sur les bancs des députés. Une délégation de six femmes est reçue par le roi ; **Louison Chabry**, dix-sept ans, s’évanouit devant lui. Louis XVI promet de faire acheminer du grain, fait ouvrir les réserves du château — et, le soir, **sanctionne enfin la Déclaration des droits de l’homme et les décrets du 4 août**. Il a cédé sur tout. Il est trop tard pour que la foule reparte.',
      },
      {
        titre: 'Le matin du 6 octobre',
        texte:
          'Vers six heures du matin, une grille est trouvée ouverte. La foule entre dans le château, cherche les appartements de la reine, se heurte aux gardes du corps : deux d’entre eux, **Deshuttes** et **Varicourt**, sont tués, leurs têtes plantées sur des piques. **Marie-Antoinette** s’enfuit par un couloir jusqu’à la chambre du roi. **La Fayette**, arrivé dans la nuit avec la garde nationale, fait dégager le château et reprend la situation en main. Puis vient la scène la plus étrange de la journée : il paraît au balcon avec la reine, qui salue la foule en silence, et lui baise la main. Les cris de haine tournent en « **Vive la reine !** ». Le roi paraît à son tour et annonce qu’il part pour Paris avec sa famille. On réclame le pain : il a été distribué dans la cour au petit matin.',
      },
      {
        titre: 'Le roi quitte Versailles',
        texte:
          'Le cortège part à une heure de l’après-midi : la voiture royale au milieu, la garde nationale, les femmes portant des pains au bout de leurs piques et chantant qu’elles ramènent « **le boulanger, la boulangère et le petit mitron** ». Sept heures pour faire les vingt-deux kilomètres. Le soir, la famille royale s’installe aux **Tuileries**, un palais inhabité depuis plus d’un siècle, qu’on ouvre en hâte. L’**Assemblée** suit le 19 octobre et s’installe dans la salle du Manège, à côté. Ce qui vient de se produire est considérable : **la cour quitte Versailles après cent sept ans** (Louis XIV s’y était installé en 1682) et n’y reviendra jamais. Le roi vit désormais sous le regard de Paris, la Révolution le tient à portée de main — et lui, à partir de ce jour, cherche comment partir. La route de **Varennes** commence là. Reste un fait que l’époque n’a pas voulu voir : ce sont **des femmes** qui ont fait plier le roi, et la Constitution de 1791 ne leur donnera pas le droit de vote.',
      },
    ],
    consequences: [
      'Louis XVI sanctionne la Déclaration des droits de l’homme et les décrets du 4 août, qu’il retenait depuis six semaines.',
      'La famille royale quitte Versailles pour les Tuileries : la cour y avait vécu cent sept ans.',
      'L’Assemblée s’installe à Paris le 19 octobre : le pouvoir législatif passe lui aussi sous le regard du peuple parisien.',
      'Le roi se considère prisonnier : l’idée d’une fuite germe et aboutira à Varennes en juin 1791.',
      'La Fayette et la garde nationale sortent renforcés, mais deviennent les gardiens d’un roi captif.',
      'Les femmes du peuple s’imposent comme une force politique — sans obtenir aucun droit politique en retour.',
    ],
    chiffres: [
      { valeur: '6 000', quoi: 'femmes environ au départ de Paris' },
      { valeur: '22 km', quoi: 'de Paris à Versailles, à pied et sous la pluie' },
      { valeur: '107 ans', quoi: 'de cour à Versailles, de 1682 à 1789' },
      { valeur: '2', quoi: 'gardes du corps tués le matin du 6 octobre' },
    ],
    chrono: [
      { date: '1er octobre 1789', fait: 'Banquet des gardes du corps à l’Opéra de Versailles.' },
      { date: '5 octobre, matin', fait: 'Les femmes des halles marchent sur Versailles.' },
      { date: '5 octobre, 17 h', fait: 'Elles envahissent l’Assemblée ; une délégation voit le roi.' },
      { date: '5 octobre, soir', fait: 'Le roi sanctionne la Déclaration et les décrets du 4 août.' },
      { date: '6 octobre, 6 h', fait: 'La foule entre dans le château ; deux gardes tués.' },
      { date: '6 octobre, 10 h', fait: 'La Fayette et la reine au balcon ; le roi annonce son départ.' },
      { date: '6 octobre, soir', fait: 'La famille royale s’installe aux Tuileries.' },
      { date: '19 octobre 1789', fait: 'L’Assemblée s’installe à son tour à Paris.' },
    ],
    leSaisTu:
      'Les dames des halles avaient un privilège très ancien : le droit de se présenter devant le roi pour lui parler au nom du peuple de Paris, lors des naissances royales notamment. Le 5 octobre 1789, elles ont donc marché sur Versailles en se réclamant d’une coutume d’Ancien Régime — pour obtenir du pain.',
    aRetenir: [
      'Les 5 et 6 octobre 1789, des milliers de femmes marchent de Paris à Versailles pour réclamer du pain.',
      'Le roi finit par sanctionner la Déclaration des droits de l’homme et les décrets du 4 août.',
      'Le 6 octobre, la famille royale est ramenée à Paris et installée aux Tuileries.',
      'L’Assemblée suit à Paris le 19 octobre : le pouvoir quitte définitivement Versailles.',
      'Le roi se considère dès lors prisonnier, ce qui le conduira à la fuite de Varennes en 1791.',
    ],
    mots: [
      {
        mot: 'Dames des halles',
        sens: 'Marchandes du grand marché de Paris, connues pour leur franc-parler et leur poids dans la rue.',
      },
      {
        mot: 'Cocarde',
        sens: 'Insigne rond porté au chapeau : blanche pour le roi, tricolore pour la Révolution.',
      },
      {
        mot: 'Tuileries',
        sens: 'Palais parisien, au bout du Louvre, où la famille royale vit de 1789 à 1792.',
      },
    ],
    lies: [
      'crise-du-pain-et-des-grains',
      'declaration-des-droits-de-l-homme',
      'fuite-de-varennes',
      'louis-xvi',
      'marie-antoinette',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'marche des femmes',
      'journées d’octobre',
      'Versailles',
      'Tuileries',
      'pain',
      'dames des halles',
      'Maillard',
      'La Fayette',
      '5 octobre 1789',
    ],
  },
  {
    id: 'fuite-de-varennes',
    volet: 'evenements',
    nom: 'La fuite de Varennes',
    date: '20 – 21 juin 1791',
    tri: 1791,
    periode: 'revolution',
    emoji: '🐎',
    lieu: 'De Paris à Varennes-en-Argonne',
    accroche:
      'Le roi quitte Paris déguisé, dans une berline trop lourde ; arrêté à Varennes, il revient prisonnier — et l’idée d’un roi révolutionnaire meurt sur la route.',
    citations: [
      {
        texte: 'Eh bien oui, je suis votre roi.',
        qui: 'Louis XVI',
        contexte:
          'Chez l’épicier Sauce, procureur de la commune de Varennes, dans la nuit du 21 au 22 juin 1791, après avoir d’abord nié son identité.',
        sens:
          'Le roi se découvre en espérant être obéi comme roi. C’est le contraire qui arrive : on l’arrête, précisément parce qu’il l’est.',
      },
      {
        texte:
          'Français, et vous surtout Parisiens, habitants d’une ville que les ancêtres du roi se plaisaient à appeler la bonne ville de Paris, méfiez-vous des suggestions et des mensonges de vos faux amis.',
        qui: 'Louis XVI',
        contexte:
          'Début de la déclaration en seize pages laissée sur son bureau des Tuileries au moment de partir, 20 juin 1791.',
        sens:
          'Le roi y explique qu’il n’est pas libre depuis octobre 1789 et désavoue ce qu’il a signé sous la contrainte. Lue à l’Assemblée, elle le condamne.',
      },
      {
        texte: 'Si vous êtes bons patriotes, aidez-moi : le roi est dans cette berline.',
        qui: 'Jean-Baptiste Drouet, maître de poste de Sainte-Menehould',
        contexte:
          'À Varennes, vers 23 h le 21 juin 1791, après avoir coupé à travers la forêt d’Argonne pour devancer la voiture.',
        sens:
          'Les récits varient sur les mots exacts. Le geste, lui, est sûr : un employé des postes de province décide, seul, d’arrêter le roi de France.',
        incertaine: true,
      },
      {
        texte: 'Le roi a été enlevé.',
        qui: 'L’Assemblée nationale constituante',
        contexte: 'Formule des décrets du 21 juin 1791, votée quelques heures après la découverte du départ.',
        sens:
          'Une fiction volontaire : reconnaître une fuite, c’était reconnaître un roi parjure, donc la fin de la monarchie. L’Assemblée gagne un an — pas plus.',
      },
    ],
    reperes: [
      'Départ des Tuileries dans la nuit du 20 au 21 juin 1791, la reine en gouvernante de la « baronne de Korff », le roi en valet de chambre.',
      'Objectif : Montmédy, près de la frontière, où le marquis de Bouillé tient des troupes fidèles.',
      'La berline, lourde et voyante, avance à 10 km/h et accumule deux heures de retard : les escortes, lassées, sont reparties.',
      'Le roi est reconnu à Sainte-Menehould par Drouet, et arrêté à Varennes vers 23 h.',
      'Retour en quatre jours sous escorte ; entrée dans Paris le 25 juin dans un silence ordonné par affiches.',
      'Le 17 juillet 1791, la garde nationale tire sur les pétitionnaires du Champ-de-Mars : une cinquantaine de morts.',
    ],
    causes: [
      'La Constitution civile du clergé (juillet 1790), condamnée par le pape en mars 1791 : le roi, très croyant, se juge contraint de trahir sa foi.',
      'L’épisode de Saint-Cloud, le 18 avril 1791 : la foule et la garde nationale empêchent le roi de partir faire ses Pâques — il en conclut qu’il n’est pas libre.',
      'La mort de Mirabeau, le 2 avril 1791 : disparaît le seul homme capable de négocier entre le roi et la Révolution.',
      'Le souvenir des 5 et 6 octobre 1789 : depuis, le roi vit aux Tuileries sous la garde de Paris.',
      'La pression des émigrés et de la cour de Vienne, qui poussent le roi à rejoindre une armée et à négocier en position de force.',
      'Un pouvoir réduit au veto : le roi signe des lois qu’il désapprouve et ne gouverne plus.',
    ],
    recit: [
      {
        titre: 'Un roi qui se dit empêché',
        texte:
          'Depuis octobre 1789, Louis XVI vit aux **Tuileries**. Il a juré la Constitution en préparation, accepté l’abolition des privilèges, signé la **Déclaration des droits de l’homme**. Ce qu’il n’accepte pas, c’est la **Constitution civile du clergé** de juillet 1790 : elle fait élire les curés et les évêques, et exige d’eux un serment que **Pie VI** condamne en mars 1791. Le roi, dévot, se voit forcé de sanctionner un texte qui, pour lui, sépare la France de Rome. Le **18 avril 1791**, il veut se rendre à Saint-Cloud pour faire ses Pâques avec un prêtre réfractaire : la foule dételle ses chevaux, la garde nationale refuse d’obéir à **La Fayette**, la voiture ne part pas. Deux semaines plus tôt, **Mirabeau** est mort — le seul qui travaillait à réconcilier le trône et l’Assemblée. Le roi décide alors ce qu’il refusait depuis deux ans : partir.',
      },
      {
        titre: 'La berline',
        texte:
          'Le plan est organisé par le comte suédois **Axel de Fersen** : gagner **Montmédy**, où le marquis de **Bouillé** dispose de régiments sûrs, et de là négocier, avec une armée derrière soi, une révision de la Constitution. Fersen fait construire une **berline** neuve, vaste, verte et jaune, prévue pour six personnes — magnifique et parfaitement repérable. Les passeports sont au nom de la **baronne de Korff**, une dame russe : la reine joue la gouvernante des enfants, madame de Tourzel la baronne, et le roi… le valet de chambre. On part des Tuileries vers minuit, le **21 juin**, avec près d’une heure de retard. Les retards s’ajoutent : une roue, un attelage, un pont. À **Pont-de-Somme-Vesle**, le détachement de hussards chargé d’escorter la voiture a attendu quatre heures, s’est fait remarquer des villageois, et est reparti. La berline continue seule. Et le roi, plusieurs fois, descend pour se dégourdir les jambes et parler aux gens.',
      },
      {
        titre: 'Sainte-Menehould, puis Varennes',
        texte:
          'À **Sainte-Menehould**, le maître de poste **Jean-Baptiste Drouet** observe le voyageur du fond de la voiture. Il a vu le roi, et surtout il connaît son profil : il est gravé sur les **assignats**, le papier-monnaie que tout le monde manipule. Prévenu par la municipalité, il part à cheval avec un compagnon, coupe par la forêt d’**Argonne** et arrive à **Varennes** avant la berline. Là, on barre le pont avec une charrette, on réveille l’épicier **Sauce**, procureur de la commune, et l’on conduit les voyageurs chez lui, au-dessus de la boutique. Le juge **Destez**, qui a vécu à Versailles, reconnaît le roi. Louis XVI, alors, cesse de nier : « Eh bien oui, je suis votre roi. » Il croit encore qu’on va l’acclamer. On sonne le tocsin, des milliers de gardes nationaux affluent des villages voisins, et au petit matin arrivent les commissaires envoyés par l’Assemblée — **Barnave**, **Pétion**, **Latour-Maubourg**. La berline repart vers Paris.',
      },
      {
        titre: 'Ce que Varennes a tué',
        texte:
          'Le retour dure quatre jours sous un soleil écrasant. À l’entrée de Paris, le **25 juin**, des affiches préviennent : « Quiconque applaudira le roi sera bâtonné, quiconque l’insultera sera pendu. » Des dizaines de milliers de personnes regardent passer la voiture **chapeau sur la tête**, en silence. L’Assemblée choisit la fiction de l’**enlèvement** pour sauver la monarchie constitutionnelle, et **suspend** provisoirement le roi de ses fonctions. Mais le pays a compris. Le club des **Cordeliers** réclame la déchéance ; le **17 juillet 1791**, au Champ-de-Mars, la garde nationale de **La Fayette**, sous la loi martiale proclamée par le maire **Bailly**, tire sur les pétitionnaires : une cinquantaine de morts. Bailly et La Fayette y perdent leur popularité ; le mot **république**, jusque-là marginal, devient dicible. Louis XVI prête serment à la Constitution le **14 septembre 1791**, et plus personne ne le croit. Varennes n’a pas fait tomber la monarchie : elle a tué l’idée qu’un roi pouvait être le chef de la Révolution. Quatorze mois plus tard, le 10 août 1792, les Tuileries sont prises.',
      },
    ],
    consequences: [
      'Le roi est suspendu de ses fonctions par l’Assemblée du 25 juin au 15 juillet 1791, puis rétabli par la fiction de l’« enlèvement ».',
      'La fusillade du Champ-de-Mars, le 17 juillet 1791, fait une cinquantaine de morts et brise l’unité du camp révolutionnaire.',
      'Bailly et La Fayette, héros de 1789, perdent leur popularité ; le club des Jacobins se scinde.',
      'L’idée républicaine, marginale jusque-là, devient une option politique publique.',
      'La confiance entre le roi et la nation est rompue : la voie est ouverte au 10 août 1792 et à la chute de la monarchie.',
      'Les puissances étrangères s’alarment : la déclaration de Pillnitz suit en août 1791, prélude à la guerre de 1792.',
    ],
    chiffres: [
      { valeur: '250 km', quoi: 'parcourus depuis Paris avant l’arrestation' },
      { valeur: '2 heures', quoi: 'de retard accumulé, qui font manquer l’escorte' },
      { valeur: '4 jours', quoi: 'de retour sous escorte, jusqu’au 25 juin 1791' },
      { valeur: '50', quoi: 'morts environ au Champ-de-Mars, le 17 juillet 1791' },
    ],
    chrono: [
      { date: '12 juillet 1790', fait: 'Constitution civile du clergé, condamnée par le pape en mars 1791.' },
      { date: '2 avril 1791', fait: 'Mort de Mirabeau, dernier intermédiaire entre le roi et l’Assemblée.' },
      { date: '18 avril 1791', fait: 'Le roi est empêché de se rendre à Saint-Cloud pour ses Pâques.' },
      { date: '20 juin 1791, minuit', fait: 'Départ des Tuileries en berline, sous de faux passeports.' },
      { date: '21 juin 1791, soir', fait: 'Drouet reconnaît le roi à Sainte-Menehould.' },
      { date: '21 juin 1791, 23 h', fait: 'Arrestation à Varennes, chez l’épicier Sauce.' },
      { date: '25 juin 1791', fait: 'Retour à Paris dans un silence glacé.' },
      { date: '17 juillet 1791', fait: 'Fusillade du Champ-de-Mars.' },
      { date: '14 septembre 1791', fait: 'Louis XVI prête serment à la Constitution.' },
    ],
    leSaisTu:
      'Au matin du 21 juin 1791, en découvrant les Tuileries vides, des Parisiens accrochent un écriteau à la grille du palais : « Maison à louer ». La Révolution avait déjà le goût de l’affiche et de la formule — et celle-là disait tout : le roi venait de quitter son propre rôle.',
    aRetenir: [
      'Dans la nuit du 20 au 21 juin 1791, Louis XVI et sa famille quittent Paris déguisés pour rejoindre Montmédy.',
      'Reconnu par le maître de poste Drouet, le roi est arrêté à Varennes-en-Argonne.',
      'L’Assemblée invente un « enlèvement » et suspend le roi, pour sauver la monarchie constitutionnelle.',
      'Le 17 juillet 1791, la fusillade du Champ-de-Mars fait une cinquantaine de morts.',
      'Varennes détruit la confiance entre le roi et la nation et rend l’idée républicaine possible.',
    ],
    mots: [
      {
        mot: 'Berline',
        sens: 'Grande voiture fermée, tirée par des chevaux, conçue pour les longs voyages.',
      },
      {
        mot: 'Assignat',
        sens: 'Papier-monnaie de la Révolution, gagé sur les biens du clergé, et qui portait le profil du roi.',
      },
      {
        mot: 'Constitution civile du clergé',
        sens: 'Loi de 1790 faisant des prêtres des fonctionnaires élus et leur imposant un serment.',
      },
      {
        mot: 'Loi martiale',
        sens: 'Mesure permettant à la troupe de disperser un rassemblement par la force après sommations.',
      },
    ],
    lies: [
      'marche-des-femmes-sur-versailles',
      'declaration-des-droits-de-l-homme',
      'louis-xvi',
      'la-fayette',
      'journee-du-10-aout-1792',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Varennes',
      'fuite du roi',
      'berline',
      'Drouet',
      'Sainte-Menehould',
      'Champ-de-Mars',
      'Bouillé',
      'Fersen',
      'juin 1791',
      'monarchie constitutionnelle',
    ],
  },
]
