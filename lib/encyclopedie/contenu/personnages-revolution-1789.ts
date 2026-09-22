// -----------------------------------------------------------------------------
// RÉVOLUTION — LES HOMMES ET LES FEMMES DE 1789. Le roi, la reine, les deux
// ministres qu'on a empêchés, l'abbé qui a écrit le programme, l'orateur qui a
// tenu l'Assemblée, le général des deux mondes, et celle qui a réécrit la
// Déclaration au féminin.
//
// C'EST LE GROS MORCEAU DE L'ENCYCLOPÉDIE, et il est traité comme tel :
// ni légende dorée, ni légende noire — les MÉCANISMES (docs/encyclopedie.md,
// § 3). Un roi instruit et pieux qui VEUT réformer, appelle les meilleurs
// ministres du siècle et doit les renvoyer l'un après l'autre parce que la
// cour, les parlements et les privilégiés le lui imposent ; une reine jugée
// sur des pamphlets, dont la phrase la plus célèbre n'est pas d'elle ; une
// bourgeoisie d'avocats et d'hommes de loi qui prend la place de la noblesse ;
// une guerre d'Amérique gagnée au dehors et perdue au budget.
//
// Le ton est celui du projet : ces gens sont racontés DANS LEUR TEMPS, avec
// gravité, sans ironie et sans procès rétrospectif — y compris, et surtout,
// quand on raconte leur mort.
//
// Les fiches s'accrochent au lot `evenements-revolution-causes.ts`, qui porte
// le décor (les finances, le prix du pain, la Bastille) : on ne le répète pas,
// on y renvoie par `lies`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_REVOLUTION_1789: Personnage[] = [
  {
    id: 'turgot',
    volet: 'personnages',
    nom: 'Turgot',
    surnom: 'le ministre des vingt mois',
    dates: '1727 – 1781',
    tri: 1781,
    periode: 'revolution',
    emoji: '🌾',
    roles: ['Contrôleur général des finances', 'Économiste', 'Intendant du Limousin'],
    origine: 'Paris, royaume de France',
    accroche:
      'Vingt mois aux finances pour changer le royaume : il libère le blé, supprime la corvée et les jurandes — et la cour obtient son renvoi.',
    citations: [
      {
        texte:
          'N’oubliez jamais, Sire, que c’est la faiblesse qui a mis la tête de Charles Iᵉʳ sur un billot.',
        contexte: 'Lettre à Louis XVI, 30 avril 1776, douze jours avant son renvoi.',
        sens:
          'Le roi d’Angleterre Charles Iᵉʳ fut décapité en 1649 pour avoir cédé, puis résisté trop tard. Turgot avertit : ce sont les reculades qui tuent les rois.',
      },
      {
        texte:
          'Dieu, en donnant à l’homme des besoins, en lui rendant nécessaire la ressource du travail, a fait du droit de travailler la propriété de tout homme, et cette propriété est la première, la plus sacrée et la plus imprescriptible de toutes.',
        contexte:
          'Préambule de l’édit de février 1776 supprimant les jurandes, c’est-à-dire les corporations de métiers.',
        sens:
          'Travailler librement, sans acheter une maîtrise à une corporation, devient un droit naturel : la formule annonce mot pour mot celles de 1789.',
      },
      {
        texte:
          'Je serai craint, haï même de la plus grande partie de la cour, de tout ce qui sollicite des grâces.',
        contexte: 'Lettre à Louis XVI en acceptant les finances, 24 août 1774.',
        sens:
          'La même lettre tenait son programme en trois refus : ni banqueroute, ni impôt nouveau, ni emprunt. Il savait déjà qui l’abattrait.',
      },
    ],
    reperes: [
      'Intendant du Limousin pendant treize ans : il y essaie ses réformes avant de les proposer au royaume.',
      'Contrôleur général des finances du 24 août 1774 au 12 mai 1776 — vingt mois en tout.',
      'Édit du 13 septembre 1774 : liberté du commerce des grains dans tout le royaume.',
      'Les Six Édits de 1776 suppriment la corvée royale et les jurandes des métiers.',
      'La guerre des farines, au printemps 1775, retourne l’opinion contre lui.',
      'Ami de Condorcet, de Voltaire et d’Adam Smith, il a écrit dans l’Encyclopédie.',
    ],
    recit: [
      {
        titre: 'Un intendant qui essaie avant de gouverner',
        texte:
          'Anne Robert Jacques **Turgot** n’est pas un théoricien de salon. Nommé **intendant du Limousin** en 1761 — la province la plus pauvre du royaume —, il y passe treize ans à mesurer, compter et corriger. Il fait dresser un cadastre pour que la **taille** cesse de tomber au hasard sur les mêmes. Il remplace la **corvée royale**, ce travail gratuit et forcé que les paysans devaient aux routes du roi, par une contribution en argent payée par **tous les propriétaires**, nobles compris : les routes du Limousin deviennent les meilleures de France. Pendant la disette de 1770, il ouvre des **ateliers de charité** — du travail payé plutôt que l’aumône — et fait acheter du grain à l’étranger. Il écrit en même temps des mémoires d’économie que liront **Adam Smith** et **Condorcet**. Quand Louis XVI l’appelle aux finances en août 1774, il n’appelle pas un philosophe : il appelle l’administrateur le plus expérimenté du royaume.',
      },
      {
        titre: 'Vingt mois pour tout changer',
        texte:
          'Le **13 septembre 1774**, un mois après son entrée en fonction, Turgot établit la **liberté du commerce des grains** : le blé circulera librement d’une province à l’autre, sans permission ni taxe. En janvier et février **1776** viennent les **Six Édits**, qui frappent au cœur de l’Ancien Régime : suppression de la **corvée royale**, remplacée par un impôt sur les propriétaires ; suppression des **jurandes et maîtrises**, ces corporations qui décidaient qui avait le droit d’exercer un métier ; suppression des offices et des privilèges des halles de Paris. Les **parlements** refusent d’enregistrer les édits. Le **12 mars 1776**, Louis XVI se rend en personne au Parlement de Paris et les impose par un **lit de justice** : le roi soutient son ministre. Deux mois plus tard, il le renvoie.',
      },
      {
        titre: 'La guerre des farines',
        texte:
          'La liberté des grains arrive au pire moment : la récolte de 1774 est médiocre, le prix du pain monte. En avril et mai **1775**, près de trois cents émeutes secouent le Bassin parisien — on arrête les convois, on pille les boulangeries, on impose de force le prix « juste » sur les marchés. C’est la **guerre des farines**. Turgot tient : il fait protéger les convois par 25 000 hommes, réprime, fait pendre deux émeutiers place de Grève, et refuse de revenir sur l’édit. Le prix retombe à la récolte suivante, ce qui lui donne raison sur le fond ; mais la peur, elle, ne retombe pas. La rumeur du **pacte de famine** — un complot pour affamer le peuple — le désigne désormais comme le ministre qui a livré le pain aux marchands. La cour s’en saisit : elle tient enfin une arme populaire contre l’homme qui veut lui faire payer l’impôt.',
      },
      {
        titre: 'Ce que sa chute a coûté',
        texte:
          'Le **12 mai 1776**, Louis XVI renvoie Turgot. La coalition qui l’emporte est complète : les **parlements**, humiliés par le lit de justice ; les **financiers**, privés de leurs profits ; les corporations, supprimées ; la reine et le clan des Polignac, dont il coupait les pensions ; et le vieux ministre **Maurepas**, qui ne voulait pas d’un rival. Dès août, les jurandes et la corvée sont rétablies. Turgot se retire, écrit, correspond avec l’Europe savante et meurt le **18 mars 1781**, à cinquante-trois ans. La suite lui a donné une raison amère : presque tout ce qu’il proposait en 1776 sera décrété entre **1789 et 1791** — égalité devant l’impôt, liberté du travail, fin des corporations. Ce que la monarchie a refusé à un ministre, elle devra le concéder à une révolution.',
      },
    ],
    chrono: [
      { date: '1727', fait: 'Naissance à Paris, dans une famille de robe normande.' },
      { date: '1761', fait: 'Intendant du Limousin : treize ans de réformes locales.' },
      { date: '24 août 1774', fait: 'Louis XVI le nomme contrôleur général des finances.' },
      { date: '13 septembre 1774', fait: 'Édit établissant la liberté du commerce des grains.' },
      { date: 'avril-mai 1775', fait: 'La guerre des farines : près de 300 émeutes.' },
      { date: '12 mars 1776', fait: 'Lit de justice : le roi impose les Six Édits.' },
      { date: '12 mai 1776', fait: 'Renvoi de Turgot.' },
      { date: 'août 1776', fait: 'Rétablissement de la corvée et des jurandes.' },
      { date: '18 mars 1781', fait: 'Mort à Paris.' },
    ],
    leSaisTu:
      'Dans le Limousin, Turgot fit construire les routes par des ouvriers PAYÉS, avec l’argent d’une contribution levée sur tous les propriétaires, nobles compris. Les voyageurs le remarquèrent : on reconnaissait la province à ses chaussées. L’expérience dura treize ans sous les yeux du royaume — et il fallut pourtant la Révolution pour l’étendre à la France entière.',
    aRetenir: [
      'Turgot est contrôleur général des finances de Louis XVI d’août 1774 à mai 1776.',
      'L’édit du 13 septembre 1774 établit la liberté du commerce des grains.',
      'Les Six Édits de 1776 suppriment la corvée royale et les jurandes, les corporations de métiers.',
      'La cour, les parlements et les privilégiés obtiennent son renvoi le 12 mai 1776 ; ses édits sont annulés.',
      'Presque toutes ses réformes seront reprises par la Révolution entre 1789 et 1791.',
    ],
    mots: [
      {
        mot: 'Corvée royale',
        sens: 'Travail gratuit et obligatoire dû par les paysans pour l’entretien des routes du roi.',
      },
      {
        mot: 'Jurande',
        sens: 'Corporation qui contrôle un métier : sans elle, on n’a pas le droit d’exercer ni d’embaucher.',
      },
      {
        mot: 'Lit de justice',
        sens: 'Séance où le roi vient en personne au Parlement imposer l’enregistrement d’une loi refusée.',
      },
    ],
    lies: [
      'crise-financiere-de-la-monarchie',
      'crise-du-pain-et-des-grains',
      'louis-xvi',
      'necker',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Turgot',
      'grains',
      'corvée',
      'jurandes',
      'physiocrate',
      'Limousin',
      'Six Édits',
      'guerre des farines',
      'liberté du commerce',
      'réforme',
      'Ancien Régime',
    ],
  },
  {
    id: 'sieyes',
    volet: 'personnages',
    nom: 'Sieyès',
    surnom: 'l’abbé qui a écrit 1789',
    dates: '1748 – 1836',
    tri: 1789,
    periode: 'revolution',
    emoji: '📜',
    roles: ['Député du Tiers état', 'Prêtre', 'Théoricien de la nation'],
    origine: 'Fréjus, Provence',
    accroche:
      'En janvier 1789, un abbé inconnu répond en trois lignes à la question que personne n’osait poser — et donne à la Révolution son programme.',
    citations: [
      {
        texte:
          '1. Qu’est-ce que le Tiers état ? Tout. 2. Qu’a-t-il été jusqu’à présent dans l’ordre politique ? Rien. 3. Que demande-t-il ? À y devenir quelque chose.',
        contexte: 'Première page de *Qu’est-ce que le Tiers état ?*, janvier 1789.',
        sens:
          'Toute la brochure tient dans son ouverture : trois questions, trois réponses, et des dizaines de milliers d’exemplaires qui les portent dans le royaume en quelques semaines.',
      },
      {
        texte:
          'Le Tiers état embrasse tout ce qui appartient à la nation ; et tout ce qui n’est pas le Tiers ne peut pas se regarder comme étant de la nation.',
        contexte: 'Même brochure, chapitre premier.',
        sens:
          'Renversement complet : ce ne sont pas les privilégiés qui font la France, ce sont ceux qui travaillent — vingt-cinq millions de personnes sur vingt-six.',
      },
      {
        texte: 'Ils veulent être libres et ils ne savent pas être justes.',
        contexte: 'À propos des ordres privilégiés, dans *Qu’est-ce que le Tiers état ?*',
        sens:
          'La noblesse réclame ses « libertés » contre le roi au moment même où elle refuse de payer l’impôt comme tout le monde.',
      },
      {
        texte: 'J’ai vécu.',
        contexte: 'Réponse qu’on lui prête, après 1794, à qui lui demandait ce qu’il avait fait pendant la Terreur.',
        sens:
          'Aucune source sûre ne l’atteste. Le mot lui est resté parce qu’il résume une génération entière : celle qui a survécu en se taisant.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un modeste employé des postes de Fréjus, il entre dans l’Église sans vocation et devient vicaire général de Chartres.',
      'Sa brochure Qu’est-ce que le Tiers état ? paraît en janvier 1789 et se répand à des dizaines de milliers d’exemplaires.',
      'Prêtre, il est pourtant élu député du Tiers état de Paris : un cas presque unique en 1789.',
      'Le 17 juin 1789, c’est sa motion qui fait prendre aux députés le nom d’Assemblée nationale.',
      'Il vote la mort du roi en 1793, se tait sous la Terreur, et fait entrer Bonaparte au pouvoir en 1799.',
      'Exilé comme régicide en 1816, il rentre en 1830 et meurt à Paris à quatre-vingt-huit ans.',
    ],
    recit: [
      {
        titre: 'Un homme que la naissance arrête',
        texte:
          'Emmanuel-Joseph **Sieyès** naît à Fréjus en 1748, cinquième enfant d’un employé des postes. Sans fortune ni nom, il n’a qu’une voie pour s’élever : l’Église. Il fait Saint-Sulpice, devient docteur en théologie, lit **Locke**, **Condillac** et les physiocrates plus que les Pères de l’Église, et gravit les degrés — chanoine, puis **vicaire général de Chartres**. Là, il s’arrête net. En 1789, les cent trente évêques de France sont **tous nobles** : un roturier peut administrer un diocèse, jamais le diriger. C’est exactement l’expérience de la **bourgeoisie instruite** du siècle — avocats, notaires, médecins, négociants : la compétence d’un côté, la naissance de l’autre, et la naissance qui gagne toujours. Sieyès n’écrira pas contre l’Église ni contre le roi : il écrira contre cela.',
      },
      {
        titre: 'Trois questions, janvier 1789',
        texte:
          'Les États généraux sont convoqués : la France discute. En janvier 1789 paraît une brochure anonyme de cent quatre-vingts pages, *Qu’est-ce que le Tiers état ?* Elle ouvre par trois questions et trois réponses d’une brutalité neuve — **Tout. Rien. Quelque chose.** L’argument tient en une démonstration : le Tiers état accomplit tous les travaux utiles, agriculture, commerce, industrie, services ; il forme vingt-cinq millions d’habitants sur vingt-six ; il est donc **la nation entière**, et les deux cent mille privilégiés qui prétendent la représenter n’en sont qu’une excroissance. Sieyès y ajoute une arme de juriste : une **nation** n’a pas besoin d’autorisation pour se donner une constitution, elle se suffit à elle-même. La brochure est réimprimée sans relâche, lue dans les assemblées électorales, recopiée dans les cahiers de doléances. Aucun texte n’a autant pesé sur le printemps 1789.',
      },
      {
        titre: 'Le mot qui change tout : « Assemblée nationale »',
        texte:
          'Élu député du **Tiers état de Paris** en mai 1789, Sieyès arrive à Versailles dans une assemblée bloquée : le Tiers refuse de vérifier les pouvoirs par ordre, la noblesse refuse de les vérifier en commun, et l’on piétine depuis six semaines. Le **17 juin 1789**, il monte à la tribune et propose de trancher par les mots : puisque les députés du Tiers représentent au moins quatre-vingt-seize pour cent de la nation, qu’ils cessent de s’appeler « Tiers état » et se déclarent **Assemblée nationale**. La motion passe par 490 voix contre 90. En une phrase, la souveraineté a changé de mains : elle n’appartient plus au roi qui convoque, mais à la nation qui se représente. Trois jours plus tard, au **Jeu de paume**, cette assemblée-là jure de ne pas se séparer avant d’avoir donné une constitution à la France.',
      },
      {
        titre: 'Le survivant',
        texte:
          'La suite est celle d’un homme qui traverse tout. Il rédige, discute, conseille ; il vote la **mort du roi** en janvier 1793 ; puis il se tait pendant la **Terreur**, ne siège dans aucun comité de gouvernement, et survit quand Danton et Robespierre tombent. Il revient pour écrire une part de la **Constitution de l’an III**, devient **Directeur** en 1799, juge le régime incapable et cherche « une épée » pour le renverser : il choisit **Bonaparte**, et le **18 Brumaire** le porte au pouvoir. Il en sort sénateur, comblé d’honneurs et écarté de toute décision. Régicide, il est exilé en 1816 à la Restauration, rentre après 1830 et meurt à Paris en **1836**, à quatre-vingt-huit ans. Il laisse deux mots au vocabulaire politique français : **nation** et **pouvoir constituant**.',
      },
    ],
    chrono: [
      { date: '1748', fait: 'Naissance à Fréjus, en Provence.' },
      { date: '1787', fait: 'Membre de l’assemblée provinciale de l’Orléanais.' },
      { date: 'janvier 1789', fait: 'Publication de Qu’est-ce que le Tiers état ?' },
      { date: 'mai 1789', fait: 'Élu député du Tiers état de Paris.' },
      { date: '17 juin 1789', fait: 'Sa motion crée l’Assemblée nationale.' },
      { date: '20 juin 1789', fait: 'Serment du Jeu de paume.' },
      { date: 'janvier 1793', fait: 'Il vote la mort de Louis XVI.' },
      { date: '1799', fait: 'Directeur, puis artisan du 18 Brumaire avec Bonaparte.' },
      { date: '1816', fait: 'Exilé à Bruxelles comme régicide.' },
      { date: '1836', fait: 'Mort à Paris.' },
    ],
    leSaisTu:
      'En 1799, Sieyès croit avoir trouvé une épée à son service et fait entrer Bonaparte dans son coup d’État. Au soir du 18 Brumaire, il dit à ses amis : « Messieurs, nous avons un maître ; ce jeune homme sait tout faire, peut tout faire et veut tout faire. » Il avait écrit le programme de la Révolution ; il venait de lui donner un empereur.',
    aRetenir: [
      'En janvier 1789, l’abbé Sieyès publie Qu’est-ce que le Tiers état ?, le texte le plus lu de la Révolution.',
      'Il y démontre que le Tiers état, 97 % du royaume, est la nation tout entière.',
      'Le 17 juin 1789, sa motion transforme les députés du Tiers en Assemblée nationale.',
      'Prêtre, il est élu par le Tiers état de Paris : il incarne la bourgeoisie instruite qui écrit la Révolution.',
      'Il vote la mort du roi en 1793 et fait entrer Bonaparte au pouvoir au 18 Brumaire (1799).',
    ],
    mots: [
      {
        mot: 'Tiers état',
        sens: 'Le troisième ordre du royaume : tous ceux qui ne sont ni nobles ni membres du clergé, soit 97 % des Français.',
      },
      {
        mot: 'Ordre',
        sens: 'Une des trois catégories de la société d’Ancien Régime : clergé, noblesse, Tiers état.',
      },
      {
        mot: 'Pouvoir constituant',
        sens: 'Le pouvoir d’écrire une constitution : pour Sieyès, il appartient à la nation et à personne d’autre.',
      },
    ],
    lies: ['louis-xvi', 'mirabeau', 'crise-financiere-de-la-monarchie', 'prise-de-la-bastille'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Sieyès',
      'abbé Sieyès',
      'Tiers état',
      'Qu’est-ce que le Tiers état',
      'brochure',
      'Assemblée nationale',
      'nation',
      'ordres',
      'bourgeoisie',
      '1789',
      '18 Brumaire',
    ],
  },
  {
    id: 'la-fayette',
    volet: 'personnages',
    nom: 'La Fayette',
    surnom: 'le héros des deux mondes',
    dates: '1757 – 1834',
    tri: 1790,
    periode: 'revolution',
    emoji: '🗽',
    roles: ['Général', 'Commandant de la garde nationale', 'Député de la noblesse'],
    origine: 'Chavaniac, Auvergne',
    accroche:
      'À dix-neuf ans il part se battre pour l’Amérique ; à trente-deux il commande Paris en armes — et une fusillade lui coûte tout le reste.',
    citations: [
      {
        texte:
          'Nous jurons d’être à jamais fidèles à la Nation, à la Loi et au Roi, et de maintenir de tout notre pouvoir la Constitution décrétée par l’Assemblée nationale.',
        contexte:
          'Serment prêté à l’autel de la patrie, au Champ-de-Mars, le 14 juillet 1790, devant trois cent mille personnes.',
        sens:
          'La France entière jure la même chose le même jour : c’est le sommet de la Révolution heureuse, un an jour pour jour après la Bastille.',
      },
      {
        texte:
          'C’est un hommage que je dois comme fils à mon père adoptif, comme aide de camp à mon général, comme missionnaire de la liberté à son patriarche.',
        contexte: 'Lettre à George Washington, en mars 1790, en lui envoyant la clé de la Bastille.',
        sens:
          'La clé de la prison royale a traversé l’Atlantique : elle est toujours accrochée au mur de la maison de Washington, à Mount Vernon.',
      },
      {
        texte: 'Le bonheur de l’Amérique est intimement lié au bonheur de toute l’humanité.',
        contexte: 'Lettre à sa femme Adrienne, écrite à bord de *La Victoire*, en route vers l’Amérique, 1777.',
      },
      {
        texte: 'L’insurrection est le plus saint des devoirs.',
        contexte: 'Formule qu’on lui prête sous la Révolution et qu’on retrouve dans les journaux de 1790.',
        sens:
          'On ne sait pas s’il l’a écrite ainsi. Elle dit pourtant ce qu’il pensait — jusqu’au jour où ce fut sa propre garde nationale qui tira sur une foule.',
        incertaine: true,
      },
    ],
    reperes: [
      'Orphelin à treize ans et l’un des plus riches héritiers de France, il part pour l’Amérique à dix-neuf ans, contre l’ordre du roi.',
      'Blessé à Brandywine en 1777, il commande en Virginie et enferme les Anglais à Yorktown en 1781.',
      'Le 15 juillet 1789, Paris lui confie le commandement de la garde nationale.',
      'On lui doit la cocarde tricolore : le blanc du roi ajouté au bleu et au rouge de Paris.',
      'Le 14 juillet 1790, il fait prêter le serment de la fête de la Fédération au Champ-de-Mars.',
      'Le 17 juillet 1791, sa garde nationale tire au Champ-de-Mars : sa popularité ne s’en relèvera pas.',
    ],
    recit: [
      {
        titre: 'Un garçon de dix-neuf ans en Amérique',
        texte:
          'Gilbert du Motier, marquis de **La Fayette**, naît en 1757 au château de Chavaniac, en Auvergne. Son père est tué par un boulet anglais quand il a deux ans, sa mère meurt quand il en a treize : il hérite à lui seul d’une des plus grosses fortunes du royaume et épouse à seize ans **Adrienne de Noailles**, d’une des premières familles de France. Il pourrait faire une carrière de cour ; il s’ennuie. En 1776, la **Déclaration d’indépendance** américaine lui donne une cause. Le roi interdit le départ des officiers : La Fayette achète un navire, **La Victoire**, et s’embarque en secret en avril 1777. Il a dix-neuf ans, aucune expérience du feu, et propose au Congrès de servir **sans solde**. Blessé à la jambe à **Brandywine** en septembre, il gagne l’estime de **Washington**, qui le traite en fils. En 1781, c’est lui qui tient l’armée anglaise de Cornwallis contre la mer, en Virginie, jusqu’à ce que Rochambeau et la flotte de Grasse la referment à **Yorktown**. Il rentre en France héros, à vingt-quatre ans.',
      },
      {
        titre: 'L’homme de l’été 1789',
        texte:
          'Rentré d’Amérique avec des idées, il demande dès l’**assemblée des notables de 1787** la réunion d’« une assemblée vraiment nationale ». Élu en 1789 député de la **noblesse** d’Auvergne, il siège du côté des réformateurs. Le **11 juillet 1789**, trois jours avant la Bastille, il dépose à l’Assemblée un projet de **déclaration des droits** calqué sur l’exemple américain. Le **15 juillet**, Paris insurgé lui remet le commandement de la nouvelle **garde nationale** : quarante-huit mille citoyens en armes, dont il fait une institution. C’est lui qui compose la **cocarde tricolore** en ajoutant le blanc du roi au bleu et au rouge de la ville, et qui l’épingle au chapeau de Louis XVI le 17 juillet. Aux **5 et 6 octobre**, quand la foule envahit Versailles, c’est encore lui qui s’interpose et fait paraître la reine au balcon. Pendant deux ans, il est l’homme le plus puissant de France.',
      },
      {
        titre: 'Le sommet : 14 juillet 1790',
        texte:
          'Pour le premier anniversaire de la Bastille, la France se donne une fête : la **fête de la Fédération**. Deux cent mille Parisiens de tous les états — portefaix, religieuses, enfants, bourgeois — creusent eux-mêmes le **Champ-de-Mars** à la pelle pour y bâtir un amphithéâtre. Le **14 juillet 1790**, sous la pluie, **Talleyrand** dit la messe sur l’autel de la patrie, et La Fayette, au nom des gardes nationales de tout le royaume, prête le serment de fidélité **à la Nation, à la Loi et au Roi**. Le roi jure à son tour, la reine présente le dauphin, et trois cent mille personnes crient ensemble. C’est le seul moment où la Révolution est unanime, et c’est le sommet de la vie de La Fayette : une monarchie constitutionnelle acceptée par tous, un général populaire qui garantit l’ordre sans étouffer la liberté. Cela dure un an.',
      },
      {
        titre: 'Le Champ-de-Mars, un an plus tard',
        texte:
          'Après la **fuite de Varennes**, en juin 1791, l’Assemblée choisit la fiction d’un roi « enlevé » pour sauver la Constitution. Le **17 juillet 1791**, au même Champ-de-Mars, des milliers de Parisiens viennent signer une pétition réclamant la déchéance du roi. La municipalité proclame la **loi martiale**, hisse le drapeau rouge, et la **garde nationale** de La Fayette tire sur la foule : une cinquantaine de morts. Pour le peuple de Paris, il devient ce jour-là « l’homme qui a fait tirer ». Un an plus tard, dénoncé par les Jacobins, il tente de retourner son armée contre l’Assemblée, échoue, et passe la frontière le **19 août 1792** : les Autrichiens l’enferment cinq ans à **Olmütz**, où sa femme Adrienne vient le rejoindre en prison avec leurs filles. Il n’était plus assez royaliste pour le roi, et plus du tout révolutionnaire pour Paris.',
      },
      {
        titre: 'Le vieux général de 1830',
        texte:
          'Libéré en 1797, il refuse tout emploi sous Napoléon et s’installe dans sa terre de **La Grange**. Il reparaît sous la Restauration comme député libéral, retourne aux États-Unis en 1824-1825 où on l’accueille comme le dernier vivant de la fondation : il visite les vingt-quatre États, et le Congrès lui vote une fortune et des terres. En **juillet 1830**, à soixante-treize ans, il reprend le commandement de la garde nationale et pourrait faire la république ; il choisit d’**embrasser Louis-Philippe** au balcon de l’Hôtel de Ville, drapeau tricolore à la main, et l’appelle « la meilleure des républiques ». Il meurt le **20 mai 1834** et repose au cimetière de **Picpus**, sous de la terre rapportée de Bunker Hill. Depuis, un drapeau américain flotte en permanence sur sa tombe.',
      },
    ],
    chrono: [
      { date: '6 septembre 1757', fait: 'Naissance au château de Chavaniac, en Auvergne.' },
      { date: 'avril 1777', fait: 'Il embarque en secret pour l’Amérique sur La Victoire.' },
      { date: 'septembre 1777', fait: 'Blessé à la bataille de Brandywine.' },
      { date: 'octobre 1781', fait: 'Victoire de Yorktown, où il tient Cornwallis.' },
      { date: '15 juillet 1789', fait: 'Commandant de la garde nationale de Paris.' },
      { date: '14 juillet 1790', fait: 'Serment de la fête de la Fédération, au Champ-de-Mars.' },
      { date: '17 juillet 1791', fait: 'Fusillade du Champ-de-Mars : une cinquantaine de morts.' },
      { date: '19 août 1792', fait: 'Il passe la frontière ; cinq ans de prison à Olmütz.' },
      { date: 'juillet 1830', fait: 'Il présente Louis-Philippe au peuple, à l’Hôtel de Ville.' },
      { date: '20 mai 1834', fait: 'Mort à Paris ; inhumé au cimetière de Picpus.' },
    ],
    leSaisTu:
      'La Fayette est enterré à Paris sous de la terre apportée de Bunker Hill, et un drapeau américain est remplacé sur sa tombe chaque 4 juillet. Le 4 juillet 1917, quand les premiers soldats américains débarquèrent en France, ils allèrent droit à ce cimetière. Devant la tombe, le colonel Stanton prononça quatre mots restés célèbres : « Lafayette, nous voilà ! »',
    aRetenir: [
      'La Fayette combat pour l’indépendance américaine de 1777 à 1782 et contribue à la victoire de Yorktown (1781).',
      'Il commande la garde nationale de Paris à partir du 15 juillet 1789.',
      'On lui attribue la cocarde tricolore, née du blanc royal ajouté au bleu et au rouge de Paris.',
      'Le 14 juillet 1790, il fait prêter le serment de la fête de la Fédération au Champ-de-Mars.',
      'La fusillade du Champ-de-Mars, le 17 juillet 1791, le sépare définitivement du peuple de Paris.',
    ],
    mots: [
      {
        mot: 'Garde nationale',
        sens: 'Milice de citoyens armés créée en juillet 1789 pour maintenir l’ordre, commandée à Paris par La Fayette.',
      },
      {
        mot: 'Fédération',
        sens: 'Serment par lequel les gardes nationales des provinces s’unissent à la nation, en 1790.',
      },
      {
        mot: 'Loi martiale',
        sens: 'Loi de 1789 permettant à la troupe de disperser un attroupement par la force, drapeau rouge hissé.',
      },
    ],
    lies: ['prise-de-la-bastille', 'louis-xvi', 'marie-antoinette', 'mirabeau'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'La Fayette',
      'Lafayette',
      'Yorktown',
      'Washington',
      'garde nationale',
      'cocarde tricolore',
      'Champ-de-Mars',
      'Fédération',
      'Amérique',
      'Auvergne',
      'Olmütz',
    ],
  },
  {
    id: 'mirabeau',
    volet: 'personnages',
    nom: 'Mirabeau',
    surnom: 'la voix de l’Assemblée',
    dates: '1749 – 1791',
    tri: 1791,
    periode: 'revolution',
    emoji: '🗣️',
    roles: ['Député du Tiers état', 'Orateur', 'Comte'],
    origine: 'Le Bignon, Gâtinais',
    accroche:
      'Un comte que son père a fait emprisonner, rejeté par la noblesse, élu par le Tiers état : sa voix tient l’Assemblée pendant deux ans.',
    citations: [
      {
        texte:
          'Allez dire à ceux qui vous envoient que nous sommes ici par la volonté du peuple et que nous n’en sortirons que par la puissance des baïonnettes.',
        contexte:
          'Au marquis de Dreux-Brézé, venu faire évacuer la salle au nom du roi, le 23 juin 1789.',
        sens:
          'La formule exacte est discutée : les journaux du temps en donnent plusieurs versions. Le sens, lui, ne l’est pas — une assemblée élue ne se dissout pas sur ordre.',
      },
      {
        texte: 'Quatre ennemis arrivent au pas de charge : l’impôt, la banqueroute, l’armée, l’hiver.',
        contexte: 'Note secrète adressée à la cour, en décembre 1790.',
        sens:
          'Depuis mai 1790, le roi paie ses dettes et lui verse 6 000 livres par mois pour ces conseils. L’Assemblée ne l’apprendra qu’après sa mort.',
      },
      {
        texte: 'J’emporte avec moi le deuil de la monarchie : ses débris vont être la proie des factieux.',
        contexte: 'Derniers mots rapportés par son médecin Cabanis, le 2 avril 1791.',
        sens:
          'Aucun autre témoin ne les rapporte. Ils disent pourtant juste : personne après lui ne tiendra ensemble le roi et la Révolution.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le visage ravagé par la petite vérole à trois ans, il fascine pourtant dès qu’il prend la parole.',
      'Son propre père le fait enfermer par lettres de cachet : trois ans au donjon de Vincennes.',
      'Rejeté par la noblesse de Provence, il est élu député du Tiers état à Aix en 1789.',
      'Le 23 juin 1789, il refuse au roi la dissolution de l’Assemblée nationale.',
      'À partir de mai 1790, la cour éponge ses dettes et le paie pour ses conseils secrets.',
      'Mort le 2 avril 1791, il est le premier inhumé au Panthéon — et le premier à en être retiré.',
    ],
    recit: [
      {
        titre: 'Le fils que son père fait enfermer',
        texte:
          'Honoré-Gabriel Riqueti, comte de **Mirabeau**, naît en 1749 dans une famille de vieille noblesse provençale. Son père, le marquis de Mirabeau, économiste célèbre surnommé « l’Ami des hommes », déteste ce fils turbulent et couvert de dettes : il obtient contre lui des **lettres de cachet**, ces ordres du roi qui permettent d’emprisonner sans jugement. Mirabeau connaît ainsi l’île de Ré, le fort de Joux, et trois ans au donjon de **Vincennes**, de 1777 à 1780. Il y écrit, beaucoup, dont un violent *Des lettres de cachet et des prisons d’État*. Personne dans l’Assemblée de 1789 ne saura mieux que lui ce que l’arbitraire veut dire, parce que personne ne l’aura subi de plus près. Il en sort criblé de dettes, laid, immense, et avec une voix dont il disait lui-même : « Quand je secoue ma terrible hure, personne n’ose m’interrompre. »',
      },
      {
        titre: 'Élu par ceux dont il n’était pas',
        texte:
          'En 1789, la noblesse de Provence refuse d’admettre ce comte scandaleux parmi ses électeurs. Mirabeau fait alors une chose inouïe : il se présente devant le **Tiers état** d’Aix-en-Provence et de Marseille, ouvre boutique de drapier pour en avoir le droit, et se fait élire par lui — triomphalement. À la noblesse qui l’exclut, il lance un avertissement resté fameux, tiré de l’histoire romaine : les patriciens ont tué les **Gracques**, mais le coup a fondé la liberté du peuple. C’est la situation exacte de 1789 : les hommes qui vont faire la Révolution ne sont pas des révoltés du dehors, ce sont des privilégiés dégoûtés et surtout une **bourgeoisie instruite** — les deux tiers des députés du Tiers état sont des hommes de loi — à qui l’Ancien Régime refuse la place que leur savoir et leur fortune devraient leur donner.',
      },
      {
        titre: '23 juin 1789 : la réponse',
        texte:
          'Le **23 juin 1789**, Louis XVI tient une **séance royale** : il annonce des réformes considérables — égalité devant l’impôt, libertés individuelles, contrôle des dépenses — mais maintient le vote par ordre et ordonne aux trois ordres de se séparer. Le roi sort ; la noblesse et une partie du clergé le suivent. Les députés du Tiers restent assis. Le grand maître des cérémonies, le marquis de **Dreux-Brézé**, revient leur rappeler l’ordre du roi. **Bailly**, qui préside, répond que « la nation assemblée ne peut recevoir d’ordres ». Et Mirabeau, debout, lance la phrase des **baïonnettes**. Averti, Louis XVI ne fait pas donner la troupe : « Eh bien, foutre, qu’ils restent », aurait-il dit. Trois semaines avant la Bastille, le roi vient de céder pour la première fois — et l’Assemblée de découvrir qu’elle pouvait tenir.',
      },
      {
        titre: 'Le double jeu',
        texte:
          'Mirabeau n’est pas un républicain : il veut une **monarchie constitutionnelle** où le roi garde l’exécutif et gouverne avec l’Assemblée. Pour y arriver, il accepte en **mai 1790** un marché secret avec la cour : ses 208 000 livres de dettes payées, **6 000 livres par mois**, contre des notes de conseil politique. Il ne trahit pas ses votes — il continue de défendre en public ce qu’il croit — mais il est acheté, et il le sait. Il meurt d’épuisement le **2 avril 1791**, à quarante-deux ans. Paris prend le deuil : trois cent mille personnes suivent le convoi, et il devient le **premier homme inhumé au Panthéon**. Le 20 novembre 1792, la découverte de l’**armoire de fer** des Tuileries met au jour sa correspondance avec le roi. Le 21 septembre 1794, ses cendres sont sorties du Panthéon et jetées au cimetière de Clamart. Il aura été, en trois ans, l’idole et le traître de la même Révolution.',
      },
    ],
    chrono: [
      { date: '9 mars 1749', fait: 'Naissance au Bignon, dans le Gâtinais.' },
      { date: '1777-1780', fait: 'Emprisonné au donjon de Vincennes par lettre de cachet.' },
      { date: 'avril 1789', fait: 'Élu député du Tiers état à Aix-en-Provence.' },
      { date: '23 juin 1789', fait: 'Réponse à Dreux-Brézé lors de la séance royale.' },
      { date: '26 septembre 1789', fait: 'Discours contre « la hideuse banqueroute ».' },
      { date: 'mai 1790', fait: 'Traité secret avec la cour : dettes payées, 6 000 livres par mois.' },
      { date: 'janvier 1791', fait: 'Élu président de l’Assemblée nationale.' },
      { date: '2 avril 1791', fait: 'Mort à Paris ; deuil national.' },
      { date: '4 avril 1791', fait: 'Premier homme inhumé au Panthéon.' },
      { date: '21 septembre 1794', fait: 'Ses cendres sont retirées du Panthéon.' },
    ],
    leSaisTu:
      'Ce qui a perdu Mirabeau après sa mort est une armoire. Le 20 novembre 1792, le serrurier François Gamain — celui-là même qui avait appris la serrurerie à Louis XVI — révéla l’existence d’un coffre scellé dans un mur des Tuileries. On y trouva la correspondance secrète du roi, et dedans les notes de Mirabeau. Vingt mois après ses funérailles nationales, on le sortait du Panthéon.',
    aRetenir: [
      'Noble de naissance, Mirabeau est élu député du Tiers état à Aix-en-Provence en 1789.',
      'Le 23 juin 1789, il refuse de faire évacuer la salle sur ordre du roi : « nous sommes ici par la volonté du peuple ».',
      'Premier orateur de l’Assemblée, il défend une monarchie constitutionnelle.',
      'Payé secrètement par la cour à partir de mai 1790, il conseille en même temps le roi et l’Assemblée.',
      'Mort en avril 1791, il entre au Panthéon, puis en est retiré en 1794 quand son double jeu est découvert.',
    ],
    mots: [
      {
        mot: 'Lettre de cachet',
        sens: 'Ordre signé du roi permettant d’emprisonner quelqu’un sans jugement ni durée fixée.',
      },
      {
        mot: 'Monarchie constitutionnelle',
        sens: 'Régime où le roi gouverne, mais dans les limites d’une constitution votée par une assemblée élue.',
      },
      {
        mot: 'Panthéon',
        sens: 'Ancienne église Sainte-Geneviève transformée en 1791 en tombeau des grands hommes de la nation.',
      },
    ],
    lies: ['louis-xvi', 'sieyes', 'necker', 'prise-de-la-bastille'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Mirabeau',
      'baïonnettes',
      'Dreux-Brézé',
      'séance royale',
      'orateur',
      'Aix-en-Provence',
      'Panthéon',
      'armoire de fer',
      'lettre de cachet',
      'Assemblée nationale',
    ],
  },
  {
    id: 'louis-xvi',
    volet: 'personnages',
    nom: 'Louis XVI',
    surnom: 'le roi qui voulut réformer',
    dates: '1754 – 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '⚜️',
    roles: ['Roi de France', 'Roi des Français', 'Dernier roi de l’Ancien Régime'],
    origine: 'Versailles, royaume de France',
    accroche:
      'Il appelle les meilleurs ministres du siècle et doit les renvoyer l’un après l’autre : sa chute est celle d’un système bloqué, pas d’un homme sot.',
    citations: [
      {
        texte:
          'Je meurs innocent de tous les crimes qu’on m’impute. Je pardonne aux auteurs de ma mort, et je prie Dieu que le sang que vous allez répandre ne retombe jamais sur la France.',
        contexte:
          'Sur l’échafaud de la place de la Révolution, le 21 janvier 1793, avant que les tambours ne couvrent sa voix.',
        sens:
          'Il parle d’une voix forte, du haut de la plate-forme, et n’a pas le temps de finir : le roulement des tambours est ordonné pour l’interrompre.',
      },
      {
        texte: 'Il n’y a que M. Turgot et moi qui aimions le peuple.',
        contexte: 'Au conseil, pour soutenir son contrôleur général contre la cour, en 1776.',
        sens:
          'Le roi savait ce que valaient les réformes de Turgot. Il n’a pas su tenir contre son entourage : il l’a renvoyé quelques semaines plus tard.',
      },
      {
        texte:
          'Je recommande à mon fils, s’il avait le malheur de devenir roi, de songer qu’il se doit tout entier au bonheur de ses concitoyens, qu’il doit oublier toute haine et tout ressentiment.',
        contexte: 'Testament écrit à la tour du Temple, le 25 décembre 1792, pendant son procès.',
      },
      {
        texte: 'Fils de saint Louis, montez au ciel !',
        qui: 'Attribué à l’abbé Edgeworth de Firmont, son confesseur',
        contexte: 'Au pied de l’échafaud, le 21 janvier 1793.',
        sens:
          'L’abbé écrivit plus tard qu’il ne se souvenait pas de l’avoir prononcée. La phrase est née dans les journaux du lendemain, et elle y est restée.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi à dix-neuf ans, en 1774 ; il avait épousé Marie-Antoinette d’Autriche à quinze ans.',
      'Il appelle successivement Turgot, Necker et Calonne aux finances : les trois sont renvoyés sous la pression.',
      'Il abolit la torture judiciaire (1780) et rend un état civil aux protestants (édit de tolérance, 1787).',
      'Géographe passionné, il rédige lui-même une partie des instructions de l’expédition de La Pérouse.',
      'La fuite de Varennes, en juin 1791, rompt la confiance : un roi qui part ne garantit plus rien.',
      'Jugé par la Convention, il est condamné par 387 voix contre 334 et exécuté le 21 janvier 1793.',
    ],
    recit: [
      {
        titre: 'Un roi instruit, pieux et lent à trancher',
        texte:
          'Louis-Auguste n’était pas né pour régner : c’est la mort de son père, en 1765, qui fait de lui le dauphin à onze ans. Il reçoit une éducation sérieuse et l’absorbe — latin, histoire, anglais, qu’il lit et traduit. Sa passion est la **géographie** : il collectionne les cartes, corrige celles de sa bibliothèque, et suit la marine de si près qu’il fait creuser la rade de **Cherbourg**, qu’il va visiter en 1786 — le seul grand voyage de sa vie. Il travaille aussi de ses mains, à la forge et à l’établi, avec le serrurier **François Gamain** : la mécanique est la science à la mode du siècle, et ce goût-là n’a rien de ridicule, c’est celui d’un homme qui veut comprendre comment les choses tiennent. Il est **pieux**, sincèrement : il refuse d’avoir une maîtresse, ce qu’aucun de ses deux prédécesseurs n’avait fait, et prend au sérieux l’idée qu’il répondra de son royaume devant Dieu. Reste un défaut qui va tout emporter : devant une décision, il pèse, écoute, consulte encore — et tranche trop tard. C’est une qualité dans un conseil, c’est une faiblesse dans une crise.',
      },
      {
        titre: 'Il appelle les réformateurs, on les lui reprend',
        texte:
          'À peine roi, en **1774**, il fait le choix le plus remarquable de son règne : **Turgot** aux finances. Il le soutient jusqu’à se déplacer au Parlement de Paris, le 12 mars 1776, pour imposer par un **lit de justice** la suppression de la corvée et des jurandes. Deux mois plus tard, il le renvoie. Vient **Necker**, qui publie les comptes de l’État : renvoyé en 1781. Vient **Calonne**, qui propose un impôt payé par tous : renvoyé en 1787 après le refus des notables. Vient **Loménie de Brienne** : renvoyé en 1788. Quatre fois le même mécanisme. Le roi veut ; la **cour** défend ses pensions ; les **parlements**, tenus par des nobles, refusent d’enregistrer les lois nouvelles au nom des « libertés » du royaume — c’est-à-dire de leurs privilèges ; l’entourage — la reine, le comte d’Artois, le clan Polignac — obtient la tête du ministre. Il faut le dire clairement : le blocage n’est pas dans la tête du roi, il est dans un **système** où personne ne pouvait réformer sans l’accord de ceux qui en vivaient.',
      },
      {
        titre: 'Ce qu’il a supprimé',
        texte:
          'On oublie souvent ce que ce règne a réellement aboli. En **1779**, Louis XVI supprime la **mainmorte** — le dernier reste de servage — dans tout le domaine royal, et le droit de poursuivre un serf qui s’enfuit. En **1780**, il abolit la **question préparatoire**, c’est-à-dire la torture pendant l’interrogatoire ; en 1788, la question préalable, la torture avant l’exécution. En novembre **1787**, l’**édit de tolérance** rend aux protestants un état civil : après cent deux ans de Révocation, ils peuvent de nouveau se marier, déclarer leurs enfants et être enterrés légalement. Il soutient les sciences : il finance et prépare l’expédition de **La Pérouse** (1785), assiste aux premiers vols en ballon, fait reconstruire la flotte qui gagnera la guerre d’Amérique. Rien de tout cela n’efface ce qui suivra, mais rien de tout cela n’est le fait d’un roi indifférent au sort de ses sujets.',
      },
      {
        titre: 'Céder, accepter, partir',
        texte:
          'De 1789 à 1791, Louis XVI ne cesse de céder après avoir résisté. Il cède le **23 juin** devant l’Assemblée, cède après le **14 juillet** en rappelant Necker et en prenant la **cocarde tricolore**, cède le **4 août**, cède les **5 et 6 octobre** en quittant Versailles pour les Tuileries. Le point de rupture est intime : la **Constitution civile du clergé**, votée en juillet 1790, qu’il sanctionne avec angoisse et que le pape condamne en mars 1791. Le roi très chrétien se croit désormais complice d’un schisme ; le 18 avril 1791, la foule l’empêche d’aller faire ses Pâques à Saint-Cloud auprès d’un prêtre resté fidèle à Rome. Dans la nuit du **20 au 21 juin 1791**, il part avec sa famille vers Montmédy et laisse une **déclaration** où il désavoue tout ce qu’il a signé depuis deux ans. Arrêté à **Varennes**, il est ramené entre deux haies de silence. C’est cette fuite, et non la Bastille, qui tue la monarchie : un roi constitutionnel qui désavoue sa signature n’est plus le garant de rien.',
      },
      {
        titre: 'Le procès',
        texte:
          'Le **10 août 1792**, les Tuileries sont prises ; la famille royale est enfermée à la tour du **Temple**. Le 20 novembre, la découverte de l’**armoire de fer**, un coffre scellé dans un mur des Tuileries, livre la correspondance secrète du roi. La Convention le juge elle-même, à partir du **11 décembre 1792**, sous le nom de « Louis Capet ». Trois avocats le défendent : **Malesherbes**, qui fut son ministre et se propose à soixante et onze ans, **Tronchet**, et **Romain de Sèze** qui plaide six heures durant. La question de droit est redoutable : la Constitution de 1791 déclarait le roi **inviolable**. **Saint-Just** tranche à la tribune — on ne peut pas régner innocemment. Les votes durent trois jours et se font à voix haute, chaque député s’expliquant à la tribune : coupable presque à l’unanimité ; appel au peuple rejeté ; la **mort par 387 voix contre 334** ; sursis refusé. Le décès d’un roi devient une décision d’assemblée, comptée voix par voix.',
      },
      {
        titre: 'Le 21 janvier 1793',
        texte:
          'Le 20 janvier au soir, il obtient de voir sa famille : une heure trois quarts, dans la salle à manger du Temple, portes vitrées surveillées. Il promet de les revoir au matin, puis y renonce pour leur épargner cela. À six heures, l’abbé **Edgeworth de Firmont** dit la messe et lui donne la communion. À neuf heures, la voiture du maire l’emmène ; le trajet dure près de deux heures à travers un Paris muet, boutiques fermées, quatre-vingt mille hommes en armes le long des rues. Il lit les prières des agonisants. Arrivé place de la Révolution, il refuse qu’on lui lie les mains, puis tend les poignets. Il monte seul et dit, d’une voix que ceux du premier rang entendent : « **Je meurs innocent de tous les crimes qu’on m’impute.** » Il commence sa phrase de pardon ; **Santerre** fait battre les tambours. Il est dix heures vingt-deux. Il avait trente-huit ans. Le corps est porté au cimetière de la Madeleine et recouvert de chaux ; ses restes seront transférés à **Saint-Denis** en 1815.',
      },
    ],
    chrono: [
      { date: '23 août 1754', fait: 'Naissance à Versailles.' },
      { date: '16 mai 1770', fait: 'Mariage avec Marie-Antoinette d’Autriche.' },
      { date: '10 mai 1774', fait: 'Avènement ; il appelle Turgot aux finances.' },
      { date: '1780', fait: 'Abolition de la question, la torture judiciaire.' },
      { date: 'novembre 1787', fait: 'Édit de tolérance : un état civil pour les protestants.' },
      { date: '5 mai 1789', fait: 'Ouverture des États généraux à Versailles.' },
      { date: '17 juillet 1789', fait: 'Il prend la cocarde tricolore à l’Hôtel de Ville de Paris.' },
      { date: '21 juin 1791', fait: 'Arrestation à Varennes après la fuite.' },
      { date: '14 septembre 1791', fait: 'Il prête serment à la Constitution.' },
      { date: '10 août 1792', fait: 'Chute de la monarchie ; la famille royale au Temple.' },
      { date: '17 janvier 1793', fait: 'Condamné à mort par 387 voix contre 334.' },
      { date: '21 janvier 1793', fait: 'Exécution place de la Révolution.' },
    ],
    leSaisTu:
      'On rapporte que, dans ses derniers jours au Temple, Louis XVI demanda encore : « A-t-on des nouvelles de M. de La Pérouse ? » Il avait tracé de sa main une partie de la route de l’expédition partie de Brest en 1785. Personne ne pouvait lui répondre : on n’apprit qu’en 1826 que les deux navires s’étaient brisés sur les récifs de Vanikoro.',
    aRetenir: [
      'Louis XVI règne de 1774 à 1792 ; il appelle Turgot, Necker puis Calonne, et doit les renvoyer tous les trois.',
      'Il abolit la torture judiciaire en 1780 et donne un état civil aux protestants par l’édit de tolérance de 1787.',
      'Il convoque les États généraux le 5 mai 1789 parce que l’État ne peut plus payer ses dettes.',
      'La fuite de Varennes, dans la nuit du 20 au 21 juin 1791, rompt la confiance entre le roi et la nation.',
      'Jugé par la Convention, il est condamné par 387 voix contre 334 et exécuté le 21 janvier 1793.',
    ],
    mots: [
      {
        mot: 'Lit de justice',
        sens: 'Séance où le roi vient en personne au Parlement imposer l’enregistrement d’une loi refusée.',
      },
      {
        mot: 'Veto',
        sens: 'Droit, donné au roi par la Constitution de 1791, de suspendre pendant quatre ans une loi votée.',
      },
      {
        mot: 'Édit de tolérance',
        sens: 'Édit de 1787 rendant aux protestants un état civil, sans leur rendre la liberté de culte publique.',
      },
      {
        mot: 'Régicide',
        sens: 'Meurtre d’un roi ; sous la Restauration, nom donné aux députés qui avaient voté la mort de Louis XVI.',
      },
    ],
    lies: [
      'marie-antoinette',
      'turgot',
      'necker',
      'crise-financiere-de-la-monarchie',
      'prise-de-la-bastille',
      'louis-xv',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Louis XVI',
      'Louis Capet',
      'Varennes',
      'Temple',
      'Versailles',
      'serrurerie',
      'La Pérouse',
      'édit de tolérance',
      'procès du roi',
      '21 janvier 1793',
      'monarchie',
      'Ancien Régime',
    ],
  },
  {
    id: 'marie-antoinette',
    volet: 'personnages',
    nom: 'Marie-Antoinette',
    surnom: 'l’Autrichienne',
    dates: '1755 – 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '🎀',
    roles: ['Reine de France', 'Archiduchesse d’Autriche'],
    origine: 'Vienne, monarchie des Habsbourg',
    accroche:
      'Mariée à quinze ans à un roi qu’elle ne connaît pas, jugée sur des pamphlets qu’elle n’a pas écrits, elle affronte son procès avec une maîtrise inattendue.',
    citations: [
      {
        texte:
          'Si je n’ai pas répondu, c’est que la nature se refuse à répondre à une pareille inculpation faite à une mère. J’en appelle à toutes celles qui peuvent se trouver ici.',
        contexte:
          'Au Tribunal révolutionnaire, le 15 octobre 1793, après l’accusation portée par Hébert au nom de son fils de huit ans.',
        sens:
          'La salle, hostile, se tait ; des femmes du public s’émeuvent et l’audience est interrompue. C’est la seule fois du procès où l’accusation recule.',
      },
      {
        texte: 'Qu’ils mangent de la brioche.',
        contexte: 'Phrase que les pamphlets lui prêtent depuis 1789 et que les manuels ont longtemps recopiée.',
        sens:
          'Elle ne l’a jamais dite. Rousseau l’écrit vers 1765 dans ses *Confessions*, à propos d’« une grande princesse » : Marie-Antoinette avait alors neuf ans et vivait à Vienne.',
        incertaine: true,
      },
      {
        texte: 'Monsieur, je vous demande pardon. Je ne l’ai pas fait exprès.',
        contexte: 'Au bourreau Sanson, sur l’échafaud, après lui avoir marché sur le pied, le 16 octobre 1793.',
        sens:
          'Ses derniers mots connus sont une formule de politesse adressée à l’homme qui va la tuer.',
      },
      {
        texte:
          'Que mon fils n’oublie jamais les derniers mots de son père, que je lui répète expressément : qu’il ne cherche jamais à venger notre mort.',
        contexte:
          'Dernière lettre à sa belle-sœur Madame Élisabeth, écrite à la Conciergerie le 16 octobre 1793, à quatre heures et demie du matin.',
        sens:
          'La lettre ne fut jamais remise : saisie par l’accusateur public, cachée pendant vingt ans, elle ne reparut qu’en 1816.',
      },
    ],
    reperes: [
      'Quinzième enfant de l’impératrice Marie-Thérèse, elle quitte Vienne à quatorze ans pour épouser le futur Louis XVI.',
      'Reine à dix-huit ans, on l’appelle « l’Autrichienne » dès son arrivée et jusqu’à sa mort.',
      'L’affaire du collier (1785-1786) ruine sa réputation alors qu’elle n’a jamais vu le bijou.',
      'Mère de quatre enfants, elle en perd deux avant la Révolution ; son fils aîné meurt le 4 juin 1789.',
      'Elle pousse à la fuite de Varennes et écrit en secret à son frère, l’empereur d’Autriche.',
      'Jugée les 15 et 16 octobre 1793, elle est guillotinée le 16 à midi et quart.',
    ],
    recit: [
      {
        titre: 'Une enfant qu’on envoie',
        texte:
          'Maria Antonia de **Habsbourg-Lorraine** naît à Vienne en 1755, quinzième enfant de l’impératrice **Marie-Thérèse**. Elle est élevée sans rigueur, danse, joue de la harpe, écrit un français approximatif. À quatorze ans, elle est l’instrument d’une alliance : depuis 1756, la France et l’Autriche, ennemies depuis deux siècles, se sont rapprochées, et ce mariage doit sceller le renversement. En mai **1770**, sur une île du Rhin près de Kehl, on la dépouille de tout ce qui est autrichien — vêtements, bijoux, jusqu’à son petit chien — avant de la remettre à la France. Elle épouse le dauphin le 16 mai ; il a quinze ans, elle en a quatorze, ils ne se connaissent pas. Le mariage n’est pas consommé avant sept ans, et la cour entière en fait des gorges chaudes. Elle arrive dans un Versailles où le **parti anti-autrichien** la guette, où l’étiquette lui pèse, et où sa mère continue de la gouverner par lettres mensuelles. Rien, dans ces débuts, ne la rend française aux yeux de ceux qui la regardent.',
      },
      {
        titre: 'Trianon, les libelles et le collier',
        texte:
          'Reine en 1774, elle se protège de la cour en s’en retirant : le roi lui donne le **Petit Trianon**, où elle choisit ses invités, fait bâtir un théâtre puis le **Hameau de la Reine**, une ferme en dur où l’on trait vraiment les vaches. Ses dépenses de toilette et de jeu sont réelles — la couturière **Rose Bertin**, le coiffeur Léonard, les nuits de pharaon — et la presse clandestine en fait une montagne : elle devient « **Madame Déficit** » en 1787, au moment précis où le déficit vient de la guerre d’Amérique, pas d’elle. Les **libelles**, souvent obscènes, sont imprimés à Londres ou aux Pays-Bas et financés en partie par des gens de cour, dont l’entourage du duc d’Orléans. Puis vient l’**affaire du collier** (1785-1786) : une aventurière, **Jeanne de La Motte**, escroque le cardinal de Rohan en lui faisant acheter un collier de 1 600 000 livres au nom de la reine. Marie-Antoinette n’a rien vu, rien signé, rien reçu ; le Parlement acquitte pourtant le cardinal, et le public lit cet acquittement comme un aveu. La rumeur a fait plus de dégâts que n’importe quel acte réel.',
      },
      {
        titre: 'La reine dans la Révolution',
        texte:
          'La Révolution la trouve brisée : son fils aîné, le dauphin **Louis-Joseph**, meurt le 4 juin 1789, un mois après l’ouverture des États généraux. Dans la nuit du **6 octobre 1789**, la foule entre au château de Versailles, tue deux gardes du corps devant ses appartements, et elle doit fuir en chemise par un couloir. Le matin, elle paraît au balcon avec La Fayette et s’incline en silence devant la foule, qui applaudit. Aux Tuileries, elle devient le véritable chef de la résistance royale : elle écrit à l’ambassadeur **Mercy-Argenteau**, au comte de **Fersen**, à son frère l’empereur **Léopold II**, prépare la fuite de **Varennes** et croit jusqu’au bout qu’une armée étrangère rétablira l’ordre. Il faut le dire sans détour : au printemps 1792, la guerre déclarée, elle transmet à Vienne des informations sur les plans français. Ce n’est pas une invention des pamphlets — c’est, aux yeux d’une nation en guerre, une trahison, et ce sera le fond du procès.',
      },
      {
        titre: 'Le Temple, puis la Conciergerie',
        texte:
          'Le **10 août 1792**, la monarchie tombe ; la famille est enfermée à la tour du **Temple**. Elle y perd son mari le 21 janvier 1793, et porte le deuil. Le 3 juillet, à dix heures du soir, on vient lui **enlever son fils** de huit ans pour le confier au cordonnier Simon : elle l’entend ensuite, de sa fenêtre, chanter la Carmagnole dans la cour. Le 2 août 1793, on la transfère à la **Conciergerie**, l’antichambre du Tribunal révolutionnaire : une cellule de quelques mètres carrés, un paravent, deux gendarmes en permanence, le numéro 280 sur le registre des écrous. Une tentative d’évasion manquée, l’« affaire de l’œillet », durcit encore sa garde en septembre. Elle a trente-sept ans, les cheveux devenus blancs, la vue affaiblie à force d’écrire dans l’ombre.',
      },
      {
        titre: 'Le procès et le dernier jour',
        texte:
          'Le procès s’ouvre le **14 octobre 1793** devant le Tribunal révolutionnaire, **Fouquier-Tinville** accusant. Quarante et un témoins défilent ; les chefs d’accusation sont la dilapidation des finances, l’intelligence avec l’ennemi — la seule qui tienne — et une accusation ignoble montée par **Hébert** : celle d’avoir corrompu son propre fils, dont on a obtenu la signature au bas d’un papier qu’il ne comprenait pas. Elle refuse d’abord de répondre, puis, pressée, se tourne vers le public et **en appelle à toutes les mères** ; la salle en est retournée. Condamnée à mort à quatre heures et demie du matin le 16 octobre, elle écrit aussitôt sa dernière lettre à **Madame Élisabeth**. On lui coupe les cheveux, on lui lie les mains derrière le dos — ce qu’on n’avait pas fait au roi — et on la conduit sur une charrette découverte, une heure durant, à travers Paris. **David** la croque au passage, dure et droite. À midi et quart, tout est fini. Elle avait trente-sept ans.',
      },
    ],
    chrono: [
      { date: '2 novembre 1755', fait: 'Naissance à Vienne, quinzième enfant de Marie-Thérèse.' },
      { date: '16 mai 1770', fait: 'Mariage avec le dauphin, futur Louis XVI.' },
      { date: '10 mai 1774', fait: 'Elle devient reine de France à dix-huit ans.' },
      { date: '1785-1786', fait: 'L’affaire du collier ruine sa réputation.' },
      { date: '4 juin 1789', fait: 'Mort de son fils aîné, le dauphin Louis-Joseph.' },
      { date: '6 octobre 1789', fait: 'La foule à Versailles ; retour forcé à Paris.' },
      { date: '21 juin 1791', fait: 'Arrestation à Varennes.' },
      { date: '10 août 1792', fait: 'Chute de la monarchie ; emprisonnement au Temple.' },
      { date: '3 juillet 1793', fait: 'Son fils lui est enlevé.' },
      { date: '2 août 1793', fait: 'Transfert à la Conciergerie.' },
      { date: '14-16 octobre 1793', fait: 'Procès devant le Tribunal révolutionnaire.' },
      { date: '16 octobre 1793', fait: 'Exécution place de la Révolution.' },
    ],
    leSaisTu:
      'Sa dernière lettre, écrite à quatre heures et demie du matin le jour de sa mort, n’est jamais arrivée : Madame Élisabeth fut guillotinée à son tour en mai 1794 sans l’avoir lue. Saisie par l’accusateur public, gardée ensuite par un conventionnel qui n’osa ni la détruire ni la montrer, elle ne fut remise à Louis XVIII qu’en 1816. On la conserve aux Archives nationales.',
    aRetenir: [
      'Marie-Antoinette, fille de l’impératrice d’Autriche, épouse le futur Louis XVI en 1770 et devient reine en 1774.',
      'La phrase « Qu’ils mangent de la brioche » n’est pas d’elle : Rousseau l’écrit vers 1765, quand elle a neuf ans.',
      'L’affaire du collier (1785-1786) détruit sa réputation alors qu’elle est innocente.',
      'Elle correspond avec l’Autriche et pousse à la fuite de Varennes, en juin 1791.',
      'Jugée par le Tribunal révolutionnaire, elle est guillotinée le 16 octobre 1793.',
    ],
    mots: [
      {
        mot: 'Libelle',
        sens: 'Petit écrit clandestin, souvent obscène, destiné à salir quelqu’un : l’arme politique du XVIIIᵉ siècle.',
      },
      {
        mot: 'Tribunal révolutionnaire',
        sens: 'Tribunal créé en mars 1793 pour juger les ennemis de la Révolution, sans appel possible.',
      },
      {
        mot: 'Conciergerie',
        sens: 'Prison du Palais de Justice de Paris où l’on attendait de passer devant le Tribunal révolutionnaire.',
      },
    ],
    lies: [
      'louis-xvi',
      'crise-du-pain-et-des-grains',
      'la-fayette',
      'crise-financiere-de-la-monarchie',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Marie-Antoinette',
      'Autrichienne',
      'Vienne',
      'Habsbourg',
      'Trianon',
      'collier',
      'brioche',
      'Conciergerie',
      'Fersen',
      'reine',
      'procès',
      'Versailles',
    ],
  },
  {
    id: 'olympe-de-gouges',
    volet: 'personnages',
    nom: 'Olympe de Gouges',
    surnom: 'la femme qui réclama la tribune',
    dates: '1748 – 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '✒️',
    roles: ['Femme de lettres', 'Auteure dramatique', 'Abolitionniste'],
    origine: 'Montauban, Quercy',
    accroche:
      'Fille d’un boucher de Montauban, elle réécrit en 1791 la Déclaration des droits de l’homme au féminin — et monte sur l’échafaud deux ans plus tard.',
    citations: [
      {
        texte:
          'La femme a le droit de monter sur l’échafaud ; elle doit avoir également celui de monter à la tribune.',
        contexte:
          'Article X de la *Déclaration des droits de la femme et de la citoyenne*, septembre 1791.',
        sens:
          'Si la loi punit les femmes comme les hommes, elle doit leur donner la parole comme aux hommes. Deux ans plus tard, elle montera sur l’échafaud sans avoir jamais parlé à la tribune.',
      },
      {
        texte: 'La femme naît libre et demeure égale à l’homme en droits.',
        contexte: 'Article premier de sa Déclaration, qui reprend mot pour mot celle de 1789 en la féminisant.',
      },
      {
        texte:
          'Femme, réveille-toi ; le tocsin de la raison se fait entendre dans tout l’univers ; reconnais tes droits.',
        contexte: 'Ouverture du postambule de la *Déclaration des droits de la femme et de la citoyenne*, 1791.',
        sens:
          'Le tocsin est la cloche qui sonne l’alarme : elle s’adresse aux femmes elles-mêmes, pas aux députés.',
      },
      {
        texte: 'Enfants de la patrie, vous vengerez ma mort !',
        contexte: 'Derniers mots rapportés au pied de l’échafaud, le 3 novembre 1793.',
        sens: 'Le mot est rapporté par la presse du lendemain, sans témoin nommé : il est possible, il n’est pas prouvé.',
        incertaine: true,
      },
    ],
    reperes: [
      'Née Marie Gouze à Montauban en 1748, fille d’un boucher ; veuve à dix-huit ans, elle refuse de se remarier.',
      'Montée à Paris vers 1770, elle écrit une trentaine de pièces de théâtre et des dizaines de brochures politiques.',
      'Sa pièce L’Esclavage des Noirs, jouée à la Comédie-Française fin 1789, est retirée après trois représentations.',
      'En septembre 1791, elle publie la Déclaration des droits de la femme et de la citoyenne, dédiée à la reine.',
      'Elle réclame le divorce, l’égalité devant l’héritage et la reconnaissance des enfants naturels.',
      'Arrêtée en juillet 1793 pour une affiche, elle est guillotinée le 3 novembre 1793.',
    ],
    recit: [
      {
        titre: 'De Montauban à la Comédie-Française',
        texte:
          'Elle s’appelle **Marie Gouze** et naît à Montauban en 1748, fille d’une famille de bouchers ; on a longtemps dit, dans la ville, qu’elle était en réalité la fille naturelle du poète **Lefranc de Pompignan**. Mariée à seize ans à un traiteur bien plus âgé, veuve deux ans plus tard avec un fils, elle refuse de se remarier — « le mariage est le tombeau de la confiance et de l’amour », écrira-t-elle — et refuse même de reprendre le nom de son mari : elle devient **Olympe de Gouges**, du prénom de sa mère. Montée à Paris vers 1770, elle y entre dans le monde des lettres, fréquente les salons, fait jouer ses pièces. Élevée en **occitan**, elle écrit le français avec difficulté et dicte la plupart de ses textes : ses adversaires s’en serviront toute sa vie pour prétendre qu’une femme comme elle n’avait pas pu écrire cela.',
      },
      {
        titre: 'Contre l’esclavage, avant presque tout le monde',
        texte:
          'Son premier combat n’est pas celui des femmes, c’est celui des esclaves. En **1784**, elle écrit *Zamore et Mirza, ou l’heureux naufrage*, une pièce où deux esclaves noirs sont des personnages nobles et tragiques — chose inédite sur une scène française. En 1788, elle publie des *Réflexions sur les hommes nègres* qui décrivent la traite et le sort des plantations. La Comédie-Française finit par jouer la pièce, rebaptisée *L’Esclavage des Noirs*, le **28 décembre 1789** : les planteurs et les négociants du **club Massiac** organisent le chahut, et l’affiche tombe après **trois représentations**. Olympe de Gouges reçoit des menaces et continue. La Convention abolira l’esclavage dans les colonies le **4 février 1794** — trois mois après sa mort.',
      },
      {
        titre: 'La Déclaration de 1791',
        texte:
          'La **Déclaration des droits de l’homme et du citoyen** de 1789 dit « les hommes » et, dans les faits, le mot est pris au sens étroit : la Constitution de 1791 ne donne le vote qu’aux **citoyens actifs**, c’est-à-dire à des hommes de plus de vingt-cinq ans payant l’impôt. Les femmes ne votent pas, n’exercent aucune fonction, restent sous l’autorité de leur mari. En **septembre 1791**, le mois même où la Constitution est votée, Olympe de Gouges fait imprimer à ses frais la ***Déclaration des droits de la femme et de la citoyenne***, dédiée à Marie-Antoinette. Elle y reprend les dix-sept articles un par un, au féminin : égalité de naissance (article I), accès à « toutes dignités, places et emplois publics » (article VI), et surtout l’article **X**, celui de l’échafaud et de la tribune. Elle y ajoute un contrat de mariage entre égaux, le **divorce** — que la Révolution votera un an plus tard —, la reconnaissance des enfants naturels et des ateliers pour les femmes sans ressources. C’est le premier texte qui pose l’égalité politique des femmes comme une conséquence logique de 1789.',
      },
      {
        titre: 'L’affiche qui la tue',
        texte:
          'Républicaine mais modérée, proche des **Girondins**, elle prend en décembre 1792 le risque d’écrire qu’il ne faut pas exécuter le roi, et propose même de le défendre devant la Convention : la Montagne ne l’oubliera pas. Après la chute des Girondins, en juin 1793, elle placarde en juillet une affiche, *Les trois urnes*, qui demande que les Français choisissent eux-mêmes, par vote, entre république, État fédératif et monarchie. Proposer un autre régime est alors un crime : elle est arrêtée le **20 juillet 1793**, emprisonnée trois mois, et jugée le 2 novembre. On lui refuse un avocat, au motif qu’elle est bien capable de se défendre seule. Elle est guillotinée le **3 novembre 1793**. Quelques jours plus tard, le procureur **Chaumette** cite son nom devant les femmes de Paris pour les avertir de ce qu’il en coûte de « vouloir être homme d’État » — les clubs de femmes venaient d’être interdits. Sa Déclaration, oubliée pendant près de deux siècles, est aujourd’hui étudiée dans les écoles de la République.',
      },
    ],
    chrono: [
      { date: '7 mai 1748', fait: 'Naissance à Montauban, sous le nom de Marie Gouze.' },
      { date: '1765', fait: 'Mariage à seize ans ; veuve deux ans plus tard.' },
      { date: '1784', fait: 'Zamore et Mirza, sa première pièce contre l’esclavage.' },
      { date: '28 décembre 1789', fait: 'L’Esclavage des Noirs à la Comédie-Française.' },
      { date: 'septembre 1791', fait: 'Déclaration des droits de la femme et de la citoyenne.' },
      { date: 'décembre 1792', fait: 'Elle propose de défendre Louis XVI devant la Convention.' },
      { date: 'juillet 1793', fait: 'Affiche Les trois urnes ; arrestation le 20 juillet.' },
      { date: '2 novembre 1793', fait: 'Procès devant le Tribunal révolutionnaire, sans avocat.' },
      { date: '3 novembre 1793', fait: 'Exécution place de la Révolution.' },
    ],
    leSaisTu:
      'Olympe de Gouges dictait ses textes : élevée en occitan, elle écrivait le français avec peine, et ses adversaires s’en servaient pour dire qu’une femme n’avait pas pu écrire cela. Elle faisait imprimer ses brochures à ses frais et les collait elle-même sur les murs de Paris. C’était sa tribune, puisqu’on lui refusait l’autre — et c’est une affiche qui l’a conduite à l’échafaud.',
    aRetenir: [
      'Olympe de Gouges publie en septembre 1791 la Déclaration des droits de la femme et de la citoyenne.',
      'Son article X réclame pour les femmes le droit de monter à la tribune comme elles ont celui de monter sur l’échafaud.',
      'Elle combat l’esclavage dès 1784 ; sa pièce L’Esclavage des Noirs est retirée de l’affiche en 1789.',
      'Proche des Girondins, elle s’oppose à l’exécution de Louis XVI et propose de le défendre.',
      'Arrêtée pour l’affiche Les trois urnes, elle est guillotinée le 3 novembre 1793.',
    ],
    mots: [
      {
        mot: 'Citoyen actif',
        sens: 'Sous la Constitution de 1791, homme de plus de 25 ans payant l’impôt : lui seul vote. Aucune femme n’en est.',
      },
      {
        mot: 'Girondins',
        sens: 'Députés républicains modérés de la Convention, éliminés par la Montagne en juin 1793.',
      },
      {
        mot: 'Postambule',
        sens: 'Texte placé après une déclaration pour en expliquer la portée ; celui d’Olympe de Gouges s’adresse aux femmes.',
      },
    ],
    lies: ['marie-antoinette', 'louis-xvi', 'sieyes', 'la-fayette'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Olympe de Gouges',
      'Marie Gouze',
      'droits de la femme',
      'Déclaration',
      'Montauban',
      'esclavage',
      'Comédie-Française',
      'Girondins',
      'citoyenne',
      'égalité',
      'guillotine',
    ],
  },
  {
    id: 'necker',
    volet: 'personnages',
    nom: 'Necker',
    surnom: 'le banquier en qui le peuple avait confiance',
    dates: '1732 – 1804',
    tri: 1804,
    periode: 'revolution',
    emoji: '📊',
    roles: ['Directeur général des finances', 'Banquier', 'Père de Madame de Staël'],
    origine: 'Genève, république de Genève',
    accroche:
      'Banquier genevois et protestant, il publie les comptes du roi devant tout le monde ; son renvoi, le 11 juillet 1789, met Paris dans la rue.',
    citations: [
      {
        texte:
          'L’opinion publique est une puissance invisible qui, sans trésors, sans garde et sans armée, donne des lois à la ville, à la cour et jusque dans les palais des rois.',
        contexte: '*De l’administration des finances de la France*, 1784.',
        sens:
          'Necker est le premier ministre à gouverner avec l’opinion au lieu de l’ignorer : il publie, il explique, il cherche la confiance du public autant que celle des prêteurs.',
      },
      {
        texte: 'Les députés du Tiers état seront égaux en nombre à ceux des deux autres ordres réunis.',
        contexte:
          'Résultat du Conseil du roi du 27 décembre 1788, rédigé par Necker, sur la composition des États généraux.',
        sens:
          'C’est le « doublement du Tiers ». Mais le texte ne dit pas si l’on votera par tête ou par ordre : tout le printemps 1789 sortira de ce silence.',
      },
      {
        texte: 'La banqueroute, la hideuse banqueroute est là, et vous délibérez !',
        qui: 'Mirabeau',
        contexte: 'À l’Assemblée nationale, le 26 septembre 1789, pour faire voter l’emprunt proposé par Necker.',
        sens:
          'L’Assemblée vote. Le crédit du royaume ne revient pas pour autant : il faudra vendre les biens du clergé, puis créer les assignats.',
      },
    ],
    reperes: [
      'Fils d’un professeur de droit genevois, il fait fortune dans la banque à Paris avant d’entrer au service du roi.',
      'Protestant et étranger, il ne peut pas porter le titre de contrôleur général : il est « directeur général des finances ».',
      'Il finance la guerre d’Amérique par l’emprunt, sans créer un seul impôt nouveau.',
      'Son Compte rendu au roi (1781) est le premier budget de la France rendu public.',
      'Rappelé en août 1788, il obtient en décembre le doublement des députés du Tiers état.',
      'Renvoyé le 11 juillet 1789, il déclenche l’insurrection qui prend la Bastille ; il rentre en triomphe le 16.',
    ],
    recit: [
      {
        titre: 'Un Genevois à Versailles',
        texte:
          'Jacques **Necker** naît à Genève en 1732, dans une république protestante où l’on compte et où l’on discute. À quinze ans, il est commis de banque à Paris ; à quarante, il est l’un des hommes les plus riches d’Europe, associé de la banque Thellusson-Necker et vainqueur de spéculations sur le grain et sur la Compagnie des Indes — il faut le dire, sa fortune vient aussi de là. Il épouse **Suzanne Curchod**, dont le salon de la rue de Cléry réunit tout ce que Paris compte de gens de lettres ; leur fille **Germaine**, née en 1766, sera **Madame de Staël**. En **1776**, après l’échec de Turgot, Louis XVI l’appelle au Trésor. Tout, en lui, déplaisait à la cour : étranger, roturier, protestant, banquier. Une seule chose comptait : il avait du **crédit**, c’est-à-dire que les prêteurs d’Europe lui faisaient confiance, et le royaume n’avait plus que cela.',
      },
      {
        titre: 'Emprunter plutôt qu’imposer',
        texte:
          'Sa méthode tient en un choix : financer la **guerre d’Amérique** sans créer d’impôt. En cinq ans, il emprunte plus de **500 millions de livres**, à des taux élevés, par des rentes viagères et des loteries d’État. Politiquement, c’est indolore — personne ne paie rien tout de suite ; financièrement, c’est mortel, car les intérêts s’accumulent et mangeront la moitié des recettes en 1788. À côté de cela, il réforme sérieusement : il supprime plus de cinq cents charges inutiles de la maison du roi, abolit la **mainmorte** dans le domaine royal en 1779, crée des **assemblées provinciales** élues en Berry et en Haute-Guyenne pour répartir l’impôt localement, et réorganise les hôpitaux et les prisons. Chacune de ces mesures lui vaut un ennemi de plus à Versailles.',
      },
      {
        titre: 'Le Compte rendu au roi',
        texte:
          'En février **1781**, Necker fait une chose sans précédent : il publie les comptes de l’État. Le ***Compte rendu au roi*** est un petit livre bleu, avec des tableaux et des cartes, mis en vente en librairie et vendu à des dizaines de milliers d’exemplaires. Il annonce un **excédent de 10,2 millions de livres** — chiffre exact à une condition près : les dépenses extraordinaires de la guerre sont classées à part, hors du compte. Le procédé est habile, et il sauve le crédit du royaume pour quelques années. Mais l’essentiel est ailleurs : pour la première fois, des sujets ordinaires lisent ce que coûtent les pensions de la cour, et découvrent qu’ils peuvent en discuter. Les **finances du roi** deviennent une affaire publique. La cour, furieuse de se voir imprimée, obtient son renvoi le **19 mai 1781**.',
      },
      {
        titre: 'L’homme qu’on rappelle, l’homme qu’on renvoie',
        texte:
          'Quand l’État suspend ses paiements, en août **1788**, le roi n’a plus le choix : Necker est rappelé le 25, et les fonds publics remontent le jour même à l’annonce. En décembre, il obtient le **doublement du Tiers** aux États généraux. Mais le 5 mai **1789**, à l’ouverture, son discours dure trois heures et ne parle que de chiffres : les députés attendaient un programme politique, ils repartent déçus, et l’initiative lui échappe pour toujours. Le **11 juillet 1789**, la cour obtient enfin son renvoi ; il part pour Bruxelles sans prévenir personne. La nouvelle atteint Paris le 12 : Camille Desmoulins appelle aux armes, et le 14 la Bastille tombe. Rappelé le 16, Necker rentre acclamé — et sans pouvoir. Ses emprunts ne trouvent plus preneur, il combat en vain les **assignats**, et démissionne en septembre 1790. Sur la route de la Suisse, on l’arrête à Arcis-sur-Aube comme un suspect : le même homme, quatorze mois plus tôt, était porté en triomphe.',
      },
      {
        titre: 'Coppet',
        texte:
          'Il se retire au château de **Coppet**, sur le lac Léman, et passe ses dernières années à écrire pour se justifier : *Du pouvoir exécutif dans les grands États* (1792), puis *De la Révolution française* (1796), où il défend l’idée d’une monarchie constitutionnelle à l’anglaise. Bonaparte, qu’il critique, lui interdit Paris. Il meurt à Coppet le **9 avril 1804**, quelques semaines avant la proclamation de l’Empire. Sa fille **Germaine de Staël** y fait alors le foyer le plus brillant de l’opposition intellectuelle à Napoléon. Le jugement sur Necker reste partagé : on lui reproche d’avoir endetté la France pour éviter l’impôt, et de n’avoir pas su, en 1789, être autre chose qu’un financier. On lui doit d’avoir le premier considéré que les comptes d’un État appartiennent à ceux qui les paient.',
      },
    ],
    chrono: [
      { date: '30 septembre 1732', fait: 'Naissance à Genève.' },
      { date: '1776', fait: 'Louis XVI l’appelle au Trésor royal, après l’échec de Turgot.' },
      { date: '1779', fait: 'Assemblées provinciales ; abolition de la mainmorte au domaine royal.' },
      { date: 'février 1781', fait: 'Publication du Compte rendu au roi.' },
      { date: '19 mai 1781', fait: 'Premier renvoi, sous la pression de la cour.' },
      { date: '25 août 1788', fait: 'Rappel, après la suspension des paiements de l’État.' },
      { date: '27 décembre 1788', fait: 'Doublement du nombre des députés du Tiers état.' },
      { date: '5 mai 1789', fait: 'Discours d’ouverture des États généraux : trois heures de chiffres.' },
      { date: '11 juillet 1789', fait: 'Second renvoi : Paris se soulève.' },
      { date: '16 juillet 1789', fait: 'Rappel et retour triomphal.' },
      { date: 'septembre 1790', fait: 'Démission et départ pour la Suisse.' },
      { date: '9 avril 1804', fait: 'Mort à Coppet, au bord du lac Léman.' },
    ],
    leSaisTu:
      'Pour prouver sa bonne foi, Necker avait déposé **deux millions de livres** de sa propre fortune au Trésor royal, en garantie de sa gestion. Il ne les revit jamais. Sa fille, Madame de Staël, passa ensuite vingt ans à les réclamer à tous les régimes successifs ; la somme ne fut remboursée à ses héritiers qu’en 1816, douze ans après sa mort.',
    aRetenir: [
      'Necker, banquier genevois et protestant, dirige les finances de 1776 à 1781, puis de 1788 à 1790.',
      'Il finance la guerre d’Amérique par l’emprunt plutôt que par l’impôt : plus de 500 millions de livres.',
      'Son Compte rendu au roi de 1781 publie pour la première fois les comptes de l’État.',
      'En décembre 1788, il obtient le doublement du nombre des députés du Tiers état.',
      'Son renvoi, le 11 juillet 1789, déclenche l’insurrection parisienne et la prise de la Bastille.',
    ],
    mots: [
      {
        mot: 'Emprunt',
        sens: 'Argent prêté à l’État, qu’il doit rendre avec des intérêts ; Necker y recourt au lieu de créer des impôts.',
      },
      {
        mot: 'Doublement du Tiers',
        sens: 'Décision de décembre 1788 donnant au Tiers état autant de députés que le clergé et la noblesse réunis.',
      },
      {
        mot: 'Assignat',
        sens: 'Papier-monnaie créé à partir de 1789, gagé sur les biens du clergé vendus par l’État.',
      },
    ],
    lies: [
      'crise-financiere-de-la-monarchie',
      'prise-de-la-bastille',
      'louis-xvi',
      'turgot',
      'mirabeau',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Necker',
      'Genève',
      'banquier',
      'Compte rendu au roi',
      'emprunt',
      'doublement du Tiers',
      'Madame de Staël',
      'Coppet',
      'finances',
      '11 juillet 1789',
      'protestant',
    ],
  },
]
