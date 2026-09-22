// -----------------------------------------------------------------------------
// XIXᵉ SIÈCLE — LA FRANCE. Huit journées, huit lois, huit fractures : ce qui
// se passe entre la chute de Napoléon et la Grande Guerre, quand le pays
// cherche son régime à tâtons et met un siècle à répondre à une seule
// question — qui vote, qui décide, qui est citoyen.
//
// Trois révolutions (1830, 1848, la Commune), une défaite (Sedan), et trois
// textes qui tiennent encore (l'abolition de 1848, les lois scolaires de
// 1881-1882, la séparation de 1905). Même contrat que partout ailleurs :
// POURQUOI (`causes`) → CE QUI SE PASSE (`recit`) → CE QUE ÇA CHANGE
// (`consequences`), et une phrase citée par fiche au minimum.
//
// Deux fiches demandent une attention particulière, cf. `docs/encyclopedie.md`.
// La COMMUNE : grave, datée, chiffrée, sans prendre parti — ni épopée, ni
// procès. La SÉPARATION DE 1905 : la loi est présentée pour ce qu'elle DIT
// (liberté de conscience, libre exercice des cultes), l'Église et les
// catholiques sont traités avec respect, et la condamnation romaine est citée
// dans ses propres mots plutôt que résumée de l'extérieur.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_XIXE_FRANCE: Evenement[] = [
  {
    id: 'revolution-de-1830',
    volet: 'evenements',
    nom: 'Les Trois Glorieuses',
    date: '27 – 29 juillet 1830',
    tri: 1830,
    periode: 'xixe',
    emoji: '🚩',
    lieu: 'Paris',
    accroche:
      'Trois journées de barricades chassent Charles X : la France garde un roi, mais le drapeau tricolore remonte sur l’Hôtel de Ville.',
    citations: [
      {
        texte: 'Le régime légal est interrompu : celui de la force a commencé.',
        qui: 'Adolphe Thiers',
        contexte:
          'Protestation des journalistes parisiens, rédigée au *National* le 26 juillet 1830 contre les ordonnances, et signée par quarante-quatre d’entre eux.',
        sens:
          'Le roi vient de légiférer contre la Charte : les journalistes en déduisent qu’ils ne lui doivent plus obéissance.',
      },
      {
        texte: 'Voilà la meilleure des républiques.',
        qui: 'La Fayette',
        contexte:
          'Attribué au général présentant Louis-Philippe au balcon de l’Hôtel de Ville, le 31 juillet 1830, drapeau tricolore à la main.',
        sens:
          'La formule justifie le ralliement des républicains à un roi. Aucun témoin ne l’a notée sur le moment.',
        incertaine: true,
      },
      {
        texte: 'La Charte sera désormais une vérité.',
        qui: 'Louis-Philippe',
        contexte: 'Proclamation du lieutenant général du royaume aux Parisiens, 31 juillet 1830.',
        sens:
          'Promesse de respecter la constitution que Charles X venait de violer : c’est le contrat de la monarchie de Juillet.',
      },
      {
        texte: 'J’aimerais mieux scier du bois que de régner à la manière du roi d’Angleterre.',
        qui: 'Charles X',
        contexte: 'Propos rapporté par son entourage, avant les ordonnances de juillet 1830.',
        sens:
          'Le roi refusait de n’être qu’un arbitre : il se croyait comptable du royaume devant Dieu, pas devant une majorité de députés.',
        incertaine: true,
      },
    ],
    reperes: [
      'Charles X, frère de Louis XVI, règne depuis 1824 et veut rendre au trône son autorité d’avant 1789.',
      'Seuls 90 000 Français votent : il faut payer 300 francs d’impôt direct, ce qui exclut 99,7 % du pays.',
      'Les quatre ordonnances du 25 juillet 1830 suspendent la presse et dissolvent une Chambre à peine élue.',
      'Les 27, 28 et 29 juillet, quatre mille barricades coupent Paris ; l’armée de Marmont lâche la ville.',
      'Le 9 août, Louis-Philippe d’Orléans devient « roi des Français » : le trône change de branche, pas de nature.',
    ],
    causes: [
      'Un roi sacré à Reims en 1825 qui veut restaurer l’alliance ancienne du trône et de l’autel, dans un pays qui a fait 1789.',
      'Un suffrage censitaire d’une étroitesse extrême : 90 000 électeurs pour 32 millions d’habitants.',
      'Le ministère Polignac, nommé en août 1829 contre la majorité de la Chambre, et l’adresse des 221 députés qui le désavoue.',
      'La dissolution, puis des élections en juillet 1830 qui renforcent encore l’opposition : le roi est mis en minorité par le pays légal lui-même.',
      'Les quatre ordonnances de Saint-Cloud du 25 juillet : presse suspendue, Chambre dissoute, corps électoral réduit aux plus gros propriétaires.',
      'Une crise économique depuis 1827 : chômage dans le bâtiment et l’imprimerie, pain cher, ouvriers disponibles pour la rue.',
    ],
    recit: [
      {
        titre: 'Un roi qui veut remonter le temps',
        texte:
          'Charles X monte sur le trône en **1824**, à soixante-six ans, après la mort de son frère Louis XVIII. Il est le dernier frère de **Louis XVI** et il a vu la Révolution de près : émigré dès 1789, il rentre en 1814 convaincu que le malheur est venu d’avoir cédé. Il se fait **sacrer à Reims** le 29 mai 1825 selon le rite ancien, fait voter le « milliard des émigrés » pour indemniser les nobles dépossédés et une loi punissant le sacrilège. Rien de tout cela n’est illégal : la **Charte de 1814** lui laisse le choix de ses ministres et le droit de gouverner. Mais elle a aussi créé une Chambre élue, et cette Chambre ne suit pas. En mars 1830, **221 députés** signent une adresse au roi pour lui dire que son ministère n’a pas la confiance du pays. Le roi dissout, fait voter, et l’opposition revient plus nombreuse. C’est alors qu’il décide de passer outre.',
      },
      {
        titre: 'Les ordonnances de Saint-Cloud',
        texte:
          'Le **25 juillet 1830**, à Saint-Cloud, Charles X signe **quatre ordonnances** : la liberté de la presse est suspendue, la Chambre élue est dissoute avant même de siéger, le nombre d’électeurs est réduit d’environ un quart, et de nouvelles élections sont convoquées. Il invoque l’article 14 de la Charte, qui autorise le roi à prendre des règlements « pour la sûreté de l’État ». Publiées le 26 dans *Le Moniteur*, elles tombent sur une capitale déjà nerveuse. Les journalistes du *National* se réunissent chez **Thiers** et rédigent une protestation : le gouvernement a rompu le premier, les citoyens ne lui doivent plus rien. Les imprimeries sont fermées par la police : quelques milliers d’ouvriers typographes, parmi les plus instruits de Paris, se retrouvent dans la rue. Le 27 au soir, les premières barricades se dressent.',
      },
      {
        titre: 'Trois jours de barricades',
        texte:
          'Le **27 juillet**, les Parisiens pillent les armureries. Le 28, environ **quatre mille barricades** quadrillent les vieux quartiers du centre et de l’est ; le **drapeau tricolore**, interdit depuis 1815, flotte de nouveau sur **Notre-Dame** et sur l’Hôtel de Ville. Le maréchal **Marmont**, qui commande, n’a que treize mille hommes, pas de vivres et pas d’ordre clair : le roi chasse à Rambouillet. Le 29, les régiments suisses lâchent le Louvre, deux régiments de ligne passent du côté des insurgés, les Tuileries sont prises. En trois jours, l’insurrection fait environ **huit cents morts** parmi les Parisiens et près de deux cents chez les soldats. Charles X, le 30, retire enfin ses ordonnances : il est trop tard de deux jours.',
      },
      {
        titre: 'Le trône change de famille',
        texte:
          'Les vainqueurs des barricades sont largement **républicains** ; ceux qui négocient ne le sont pas. Les députés libéraux — **Thiers**, Laffitte, Casimir Perier — ne veulent ni de la République, qui leur rappelle 1793, ni de Charles X. Ils font placarder dans Paris une affiche qui présente le **duc d’Orléans** comme « un roi citoyen » qui « a porté au feu les couleurs tricolores ». Le 31 juillet, Louis-Philippe paraît à l’Hôtel de Ville au côté de **La Fayette**, immense caution républicaine, et reçoit le drapeau tricolore. Charles X abdique le 2 août en faveur de son petit-fils : l’abdication est ignorée, la famille part pour l’Angleterre. Le **9 août 1830**, Louis-Philippe prête serment à une Charte révisée et devient **roi des Français** — non plus roi de France par la grâce de Dieu, mais roi d’une nation qui l’a choisi. Le cens tombe à 200 francs : les électeurs passent de 90 000 à 170 000. Sur trente-deux millions de Français.',
      },
    ],
    consequences: [
      'La branche aînée des Bourbons quitte le trône et la France : Charles X meurt en exil, à Goritz, en 1836.',
      'Louis-Philippe est « roi des Français » et non plus « roi de France » : le pouvoir vient de la nation, pas du sacre.',
      'Le drapeau tricolore redevient celui de la France, et la Charte révisée du 14 août 1830 retire au roi le droit de légiférer seul.',
      'Le cens abaissé à 200 francs porte le nombre d’électeurs de 90 000 à 170 000 : un Français sur cent quatre-vingt-dix.',
      'Les républicains, qui ont fait les barricades sans rien obtenir, se soulèvent à nouveau en 1832 et 1834 : la question du suffrage reste ouverte.',
      'La secousse gagne l’Europe : la Belgique devient indépendante, la Pologne se soulève, l’Italie et l’Allemagne s’agitent.',
    ],
    chiffres: [
      { valeur: '4 000', quoi: 'barricades dressées dans Paris en trois jours' },
      { valeur: '800', quoi: 'insurgés tués pendant les Trois Glorieuses' },
      { valeur: '90 000', quoi: 'électeurs en France avant 1830, sur 32 millions d’habitants' },
      { valeur: '170 000', quoi: 'électeurs après l’abaissement du cens à 200 francs' },
    ],
    chrono: [
      { date: '16 septembre 1824', fait: 'Charles X succède à son frère Louis XVIII.' },
      { date: '29 mai 1825', fait: 'Sacre de Charles X à Reims.' },
      { date: '8 août 1829', fait: 'Le roi nomme le ministère Polignac.' },
      { date: '18 mars 1830', fait: 'Adresse des 221 députés contre le ministère.' },
      { date: '25 juillet 1830', fait: 'Les quatre ordonnances de Saint-Cloud.' },
      { date: '27-29 juillet 1830', fait: 'Les Trois Glorieuses : Paris se soulève.' },
      { date: '31 juillet 1830', fait: 'Louis-Philippe à l’Hôtel de Ville avec La Fayette.' },
      { date: '2 août 1830', fait: 'Abdication de Charles X, ignorée par les députés.' },
      { date: '9 août 1830', fait: 'Louis-Philippe devient roi des Français.' },
    ],
    leSaisTu:
      'Eugène Delacroix n’est pas monté sur les barricades, et il s’en est voulu : « Si je n’ai pas vaincu pour la patrie, au moins peindrai-je pour elle », écrit-il à son frère. *La Liberté guidant le peuple* est achetée par l’État en 1831 — puis rangée dans une réserve pendant des années, jugée trop révolutionnaire pour être accrochée.',
    aRetenir: [
      'Les Trois Glorieuses sont les 27, 28 et 29 juillet 1830, à Paris.',
      'Elles sont déclenchées par les quatre ordonnances du 25 juillet, qui suspendent la liberté de la presse.',
      'Charles X, dernier roi de la branche aînée des Bourbons, est chassé et part en exil.',
      'Louis-Philippe d’Orléans devient « roi des Français » le 9 août 1830 : c’est la monarchie de Juillet.',
      'Le vote reste censitaire : 170 000 électeurs seulement après 1830.',
    ],
    mots: [
      {
        mot: 'Charte',
        sens: 'Constitution octroyée par le roi en 1814, qui partage le pouvoir entre lui et deux Chambres.',
      },
      {
        mot: 'Ordonnance',
        sens: 'Texte signé par le roi seul, sans vote des Chambres.',
      },
      {
        mot: 'Suffrage censitaire',
        sens: 'Droit de vote réservé à ceux qui paient un impôt minimum, appelé le cens.',
      },
      {
        mot: 'Barricade',
        sens: 'Barrage de rue fait de pavés, de tonneaux et de meubles, arme des insurrections urbaines du XIXᵉ siècle.',
      },
    ],
    lies: ['charles-x', 'louis-philippe', 'adolphe-thiers', 'la-fayette', 'revolution-de-1848'],
    niveaux: ['4e'],
    programme: 'Une difficile conquête : voter de 1815 à 1870',
    tags: [
      'Trois Glorieuses',
      '1830',
      'Charles X',
      'Louis-Philippe',
      'ordonnances',
      'barricades',
      'monarchie de Juillet',
      'Polignac',
      'Thiers',
      'Delacroix',
      'cens',
    ],
  },
  {
    id: 'revolution-de-1848',
    volet: 'evenements',
    nom: 'La révolution de 1848',
    date: '22 – 24 février 1848',
    tri: 1848,
    periode: 'xixe',
    emoji: '🗳️',
    lieu: 'Paris',
    accroche:
      'En trois jours, Paris renverse un roi ; en trois semaines, la République fait passer le nombre d’électeurs de 240 000 à neuf millions.',
    citations: [
      {
        texte: 'La France est une nation qui s’ennuie.',
        qui: 'Alphonse de Lamartine',
        contexte: 'À la Chambre des députés, le 10 janvier 1839, sur l’immobilisme du régime.',
        sens:
          'Neuf ans avant février 1848, le diagnostic est posé : un pays sans mouvement finit par chercher lui-même la sortie.',
      },
      {
        texte: 'Enrichissez-vous par le travail et par l’épargne.',
        qui: 'François Guizot',
        contexte:
          'À la Chambre, le 1ᵉʳ mars 1843, à ceux qui réclamaient l’abaissement du cens électoral.',
        sens:
          'La phrase complète ajoutait « et vous deviendrez électeur ». Pour ne pas réformer le vote, Guizot renvoyait chacun à sa fortune.',
      },
      {
        texte:
          'Le drapeau rouge n’a jamais fait que le tour du Champ-de-Mars, traîné dans le sang du peuple, et le drapeau tricolore a fait le tour du monde avec le nom, la gloire et la liberté de la patrie.',
        qui: 'Alphonse de Lamartine',
        contexte:
          'À l’Hôtel de Ville de Paris, le 25 février 1848, devant les insurgés qui voulaient changer le drapeau.',
        sens:
          'La jeune République garde le tricolore : elle se veut celle de tous, pas celle d’un camp.',
      },
      {
        texte: 'Le peuple français a fait trois mois de misère au service de la République.',
        qui: 'Le gouvernement provisoire',
        contexte:
          'Placard affiché dans Paris au printemps 1848, pour demander la patience des ouvriers sans travail.',
        sens:
          'Trois mois plus tard, les ateliers nationaux étaient fermés et les faubourgs se soulevaient.',
      },
    ],
    reperes: [
      'Avant février 1848, 240 000 Français votent, sur 35 millions : un adulte sur cent cinquante environ.',
      'L’opposition contourne l’interdiction des réunions politiques par une campagne de banquets, de juillet 1847 à février 1848.',
      'Le 23 février au soir, la fusillade du boulevard des Capucines fait une cinquantaine de morts : Paris se couvre de barricades.',
      'Le 24 février, Louis-Philippe abdique et la IIᵉ République est proclamée à l’Hôtel de Ville.',
      'Le décret du 5 mars 1848 institue le suffrage universel masculin : neuf millions d’électeurs d’un coup.',
      'Les journées de juin, après la fermeture des ateliers nationaux, brisent la République et le monde ouvrier l’un contre l’autre.',
    ],
    causes: [
      'Un suffrage censitaire immobile : 240 000 électeurs seulement, et un ministre, Guizot, qui refuse toute réforme électorale pendant huit ans.',
      'La crise économique de 1846-1847 : mauvaises récoltes de blé et de pommes de terre, pain cher, faillites bancaires, chômage industriel.',
      'La campagne des banquets, qui réunit des milliers de convives autour d’un même mot d’ordre : élargir le droit de vote.',
      'Des scandales de corruption qui discréditent le régime et l’idée que l’argent achète les députés.',
      'L’interdiction du banquet prévu le 22 février 1848 à Paris : l’étincelle.',
      'La fusillade du boulevard des Capucines le 23 au soir : les corps promenés dans Paris sur une charrette font basculer la ville.',
    ],
    recit: [
      {
        titre: 'Un pays qui ne vote pas',
        texte:
          'La monarchie de Juillet a élargi le corps électoral de 1830 sans jamais y revenir : en 1847, **240 000 Français** votent, pour trente-cinq millions d’habitants. Pour être électeur, il faut payer 200 francs d’impôt direct ; pour être éligible, 500. Le régime est donc dirigé par quelques dizaines de milliers de familles, et les mêmes hommes reviennent d’élection en élection, souvent fonctionnaires, souvent élus grâce à la faveur du gouvernement. L’opposition demande une **réforme électorale** : abaisser le cens, interdire aux fonctionnaires d’être députés. **Guizot**, chef du gouvernement depuis 1840, répond non — invariablement. Les républicains, eux, réclament davantage : le **suffrage universel**, c’est-à-dire le vote de tous les hommes, riches ou non. À la Chambre, on ne les écoute pas ; dans le pays, on les lit.',
      },
      {
        titre: 'La campagne des banquets',
        texte:
          'Les réunions politiques sont interdites. L’opposition trouve la faille : un **banquet** n’est pas une réunion. À partir de juillet 1847, on dîne, on paie son couvert, et entre le rôti et le dessert on porte des toasts « à la réforme ». Le premier, à Château-Rouge, rassemble plus de mille personnes ; il y en aura environ **soixante-dix** dans toute la France, de Mâcon à Lille. Le procédé est légal, public, bourgeois — et redoutable, parce qu’il transforme une revendication de salon en mouvement national. Le gouvernement finit par **interdire** celui qui devait se tenir à Paris le 22 février 1848. C’est ce jour-là que tout part : la foule qui devait dîner se retrouve à manifester place de la Concorde, sous la pluie.',
      },
      {
        titre: 'Trois journées de février',
        texte:
          'Le **22 février**, les colonnes de manifestants tournent en cortège ; des barricades se montent dans l’est. Le **23**, Louis-Philippe lâche du lest et renvoie **Guizot** : Paris illumine ses fenêtres, on croit la partie gagnée. Le soir même, devant le ministère des Affaires étrangères, **boulevard des Capucines**, un coup de feu part et la troupe tire : une cinquantaine de morts. Les corps sont chargés sur une charrette et promenés à la lueur des torches dans les quartiers populaires. Dans la nuit, **quinze cents barricades** se dressent. Le **24 février**, l’armée ne tient plus, Louis-Philippe abdique en faveur de son petit-fils et part pour l’Angleterre sous le nom de « M. Smith ». La foule envahit les Tuileries, jette le trône par la fenêtre et le brûle place de la Bastille. À l’Hôtel de Ville, **Lamartine** fait proclamer la **République**.',
      },
      {
        titre: 'Le printemps des décrets',
        texte:
          'Le gouvernement provisoire légifère à un rythme qu’on n’avait pas vu depuis 1789. **25 février** : reconnaissance du « droit au travail » ; le 27, ouverture des **ateliers nationaux**, chantiers publics qui paient deux francs par jour aux chômeurs. **26 février** : abolition de la peine de mort en matière politique. **2 mars** : la journée de travail est limitée à dix heures à Paris, onze en province. **4 mars** : liberté de la presse et de réunion. **5 mars** : le décret capital — **le suffrage universel masculin**, pour tous les hommes de vingt et un ans, au scrutin secret. On passe de 240 000 à **neuf millions d’électeurs** en une signature ; aucun pays d’Europe n’a fait cela. **27 avril** : abolition de l’esclavage dans les colonies. Les élections du 23 avril, premières au suffrage universel, rassemblent **84 %** des inscrits — on vote au chef-lieu de canton, en cortège, derrière le maire et parfois derrière le curé.',
      },
      {
        titre: 'Juin : la fracture',
        texte:
          'Les ateliers nationaux devaient occuper dix mille hommes : ils en comptent **117 000** en juin, faute de travail ailleurs. Ils coûtent cher, et l’Assemblée élue en avril, majoritairement modérée et provinciale, y voit une armée de désœuvrés entretenue par l’impôt des campagnes. Le **21 juin**, un décret les ferme : les plus jeunes à l’armée, les autres renvoyés en province. Les faubourgs de l’est se soulèvent le **23 juin**. Le général **Cavaignac**, doté des pleins pouvoirs, reprend Paris quartier par quartier en quatre jours. Le bilan est lourd des deux côtés — plusieurs milliers de morts, onze mille arrestations, quelque quatre mille déportations en Algérie. **Mgr Affre**, archevêque de Paris, monté sur une barricade du faubourg Saint-Antoine pour obtenir le silence des armes, y est mortellement blessé le 25 juin. La République sort de juin victorieuse et coupée en deux.',
      },
      {
        titre: 'De la République au prince',
        texte:
          'La Constitution du **4 novembre 1848** confie le pouvoir à un président élu pour quatre ans au suffrage universel — un homme seul, élu par neuf millions de voix, face à une assemblée. Le **10 décembre 1848**, **Louis-Napoléon Bonaparte**, neveu de l’Empereur, l’emporte avec près de **75 %** des suffrages : les paysans votent pour un nom qui promet l’ordre et rappelle la gloire. Non rééligible, il s’empare du pouvoir par un **coup d’État le 2 décembre 1851**, puis rétablit l’Empire un an plus tard, jour pour jour. La IIᵉ République aura duré quatre ans. Mais elle laisse derrière elle un acquis que personne n’osera reprendre : le suffrage universel masculin, que l’Empire lui-même conservera, quitte à l’encadrer par ses candidats officiels.',
      },
    ],
    consequences: [
      'Le suffrage universel masculin est acquis pour de bon : même le Second Empire ne le supprimera pas.',
      'La IIᵉ République abolit l’esclavage dans les colonies (27 avril 1848) et la peine de mort en matière politique.',
      'Le « droit au travail » et les ateliers nationaux : l’État se reconnaît pour la première fois une responsabilité sociale — et y renonce en juin.',
      'Les journées de juin ouvrent une fracture durable entre la République des notables et le monde ouvrier.',
      'Février 1848 entraîne l’Europe : Vienne, Berlin, Milan, Budapest se soulèvent à leur tour — c’est le « printemps des peuples ».',
      'Élu au suffrage universel, Louis-Napoléon Bonaparte s’en sert pour fonder le Second Empire : le vote de tous ne garantit pas la République.',
    ],
    chiffres: [
      { valeur: '240 000', quoi: 'électeurs en France avant février 1848' },
      { valeur: '9 millions', quoi: 'électeurs après le décret du 5 mars 1848' },
      { valeur: '1 500', quoi: 'barricades dans Paris la nuit du 23 au 24 février' },
      { valeur: '117 000', quoi: 'inscrits aux ateliers nationaux en juin 1848' },
    ],
    chrono: [
      { date: '1ᵉʳ mars 1843', fait: 'Guizot refuse d’abaisser le cens électoral.' },
      { date: '9 juillet 1847', fait: 'Premier banquet réformiste, à Château-Rouge.' },
      { date: '22 février 1848', fait: 'Le banquet parisien est interdit : la foule descend dans la rue.' },
      { date: '23 février 1848', fait: 'Renvoi de Guizot ; fusillade du boulevard des Capucines.' },
      { date: '24 février 1848', fait: 'Abdication de Louis-Philippe, République proclamée.' },
      { date: '5 mars 1848', fait: 'Décret instituant le suffrage universel masculin.' },
      { date: '27 avril 1848', fait: 'Décret d’abolition de l’esclavage.' },
      { date: '23 avril 1848', fait: 'Premières élections au suffrage universel, 84 % de votants.' },
      { date: '23-26 juin 1848', fait: 'Insurrection ouvrière, réprimée par Cavaignac.' },
      { date: '10 décembre 1848', fait: 'Louis-Napoléon Bonaparte élu président.' },
      { date: '2 décembre 1851', fait: 'Coup d’État : la IIᵉ République prend fin.' },
    ],
    leSaisTu:
      'Le 24 février 1848, les insurgés trouvent le trône de Louis-Philippe aux Tuileries. Ils ne le cassent pas sur place : ils le portent à bout de bras à travers Paris, comme un mort, jusqu’à la place de la Bastille, et l’y brûlent au pied de la colonne de Juillet. Les meubles de cour ont eux aussi leur cortège funèbre.',
    aRetenir: [
      'La révolution de février 1848 a lieu les 22, 23 et 24 février, à Paris.',
      'Elle naît du refus de toute réforme électorale et de la crise économique de 1846-1847.',
      'Le 24 février 1848, Louis-Philippe abdique : c’est la fin de la monarchie en France et le début de la IIᵉ République.',
      'Le décret du 5 mars 1848 établit le suffrage universel masculin : 9 millions d’électeurs contre 240 000 la veille.',
      'Les journées de juin 1848, après la fermeture des ateliers nationaux, font plusieurs milliers de morts.',
      'Louis-Napoléon Bonaparte, élu président le 10 décembre 1848, met fin à la République le 2 décembre 1851.',
    ],
    mots: [
      {
        mot: 'Suffrage universel masculin',
        sens: 'Droit de vote accordé à tous les hommes majeurs, sans condition de fortune. Les femmes l’obtiendront en 1944.',
      },
      {
        mot: 'Ateliers nationaux',
        sens: 'Chantiers publics ouverts en 1848 pour donner du travail et un salaire aux chômeurs parisiens.',
      },
      {
        mot: 'Gouvernement provisoire',
        sens: 'Équipe qui gouverne en attendant l’élection d’une assemblée et l’adoption d’une constitution.',
      },
      {
        mot: 'Banquet',
        sens: 'Repas payant servant de réunion politique déguisée, pour contourner l’interdiction des réunions.',
      },
    ],
    lies: [
      'revolution-de-1830',
      'abolition-de-l-esclavage-1848',
      'louis-philippe',
      'napoleon-iii',
      'victor-hugo',
    ],
    niveaux: ['4e'],
    programme: 'Une difficile conquête : voter de 1815 à 1870',
    tags: [
      '1848',
      'IIe République',
      'suffrage universel',
      'banquets',
      'Guizot',
      'Lamartine',
      'ateliers nationaux',
      'journées de juin',
      'Cavaignac',
      'printemps des peuples',
    ],
  },
  {
    id: 'abolition-de-l-esclavage-1848',
    volet: 'evenements',
    nom: 'L’abolition de l’esclavage',
    date: '27 avril 1848',
    tri: 1848,
    periode: 'xixe',
    emoji: '⛓️',
    lieu: 'Paris, la Martinique, la Guadeloupe, la Guyane et La Réunion',
    accroche:
      'Un décret de quelques articles, signé le 27 avril 1848, rend la liberté et la citoyenneté à 250 000 esclaves des colonies françaises.',
    citations: [
      {
        texte: 'L’esclavage est un attentat contre la dignité humaine.',
        qui: 'Victor Schœlcher',
        contexte:
          'Préambule du décret du 27 avril 1848, qu’il rédige comme sous-secrétaire d’État aux colonies.',
        sens:
          'Le texte ne dit pas que l’esclavage est dépassé ou coûteux : il dit qu’il est un crime. C’est un raisonnement de droit, pas d’économie.',
      },
      {
        texte:
          'L’esclavage sera entièrement aboli dans toutes les colonies et possessions françaises, deux mois après la promulgation du présent décret dans chacune d’elles.',
        qui: 'Article 1ᵉʳ du décret du 27 avril 1848',
        contexte: 'Signé par les onze membres du gouvernement provisoire de la IIᵉ République.',
      },
      {
        texte:
          'Le principe que le sol de la France affranchit l’esclave qui le touche est appliqué aux colonies et possessions de la République.',
        qui: 'Article 7 du décret du 27 avril 1848',
        contexte: 'Une règle ancienne du royaume, enfin étendue aux territoires d’outre-mer.',
        sens:
          'Il n’y a plus un seul pouce de terre française où un être humain puisse être la propriété d’un autre.',
      },
      {
        texte: 'Aucune terre française ne peut plus porter d’esclaves.',
        qui: 'Victor Schœlcher',
        contexte:
          'Propos rapporté, adressé au ministre de la Marine François Arago en acceptant sa charge, début mars 1848.',
        sens:
          'La phrase résume sa méthode : pas d’abolition graduelle, pas de période d’essai — la liberté tout de suite.',
        incertaine: true,
      },
    ],
    reperes: [
      'La Convention avait déjà aboli l’esclavage le 4 février 1794 ; Bonaparte l’a rétabli en 1802.',
      'Le 4 mars 1848, le gouvernement provisoire crée une commission d’abolition présidée par Victor Schœlcher.',
      'Le décret est signé le 27 avril 1848 et s’applique deux mois après sa publication dans chaque colonie.',
      'Environ 250 000 hommes, femmes et enfants deviennent libres, et citoyens français avec droit de vote.',
      'L’indemnité de 126 millions de francs votée en 1849 va aux anciens propriétaires, pas aux affranchis.',
    ],
    causes: [
      'Une première abolition, en 1794, rétablie par Bonaparte en 1802 : la République a déjà tranché une fois, et sait qu’elle s’est reniée.',
      'Les révoltes et le marronnage, permanents depuis deux siècles : Saint-Domingue devenue Haïti en 1804, Delgrès en Guadeloupe en 1802, la Martinique en 1831.',
      'L’abolition britannique de 1833 : la France se retrouve parmi les dernières puissances européennes à tenir des esclaves.',
      'Un long travail abolitionniste : la Société française pour l’abolition de l’esclavage (1834), les livres de Schœlcher, et des pétitions ouvrières signées par des milliers de travailleurs français.',
      'La révolution de février 1848 : un gouvernement provisoire peut décréter seul, sans attendre le vote de chambres où siègent les intérêts coloniaux.',
      'La nomination de Schœlcher aux colonies en mars 1848, qui pose une condition avant d’accepter : l’abolition immédiate.',
    ],
    recit: [
      {
        titre: 'Aboli deux fois',
        texte:
          'Le 4 février **1794**, la Convention abolit l’esclavage dans toutes les colonies — sous la pression de l’insurrection de Saint-Domingue, qui a commencé en 1791 et qu’aucune armée n’arrive à réduire. Huit ans plus tard, le **20 mai 1802**, Bonaparte le **rétablit** : les planteurs ont su convaincre, l’économie sucrière pèse lourd, et la Guadeloupe est reprise les armes à la main — le colonel **Delgrès** et ses compagnons se font sauter au Matouba plutôt que de redevenir esclaves. Saint-Domingue, elle, ne revient pas : elle devient **Haïti** en 1804, première République noire du monde. En 1815, la France interdit la **traite** — le transport d’esclaves — mais pas l’esclavage lui-même : les navires négriers continuent en fraude pendant vingt ans. Toute la question du XIXᵉ siècle français tient là : la traite est interdite, la propriété d’un homme sur un autre reste légale.',
      },
      {
        titre: 'Sept semaines pour écrire un décret',
        texte:
          'Le 24 février 1848, la République est proclamée. Le **4 mars**, le gouvernement provisoire institue une **commission d’abolition** et en confie la présidence à **Victor Schœlcher**, journaliste et voyageur qui se bat sur ce terrain depuis 1830 et a publié en 1842 un livre réclamant l’abolition **immédiate**, contre ceux qui proposaient d’affranchir par étapes sur dix ou vingt ans. La commission travaille sept semaines : elle prépare l’affranchissement, l’état civil, l’école, le travail salarié, la police des nouvelles communes. Le **27 avril 1848**, le décret est signé. Son préambule ne parle ni de rendement ni de progrès : il dit que l’esclavage « est un attentat contre la dignité humaine », qu’il « supprime le principe naturel du droit et du devoir », et qu’il est « une violation flagrante » de la devise républicaine.',
      },
      {
        titre: 'Ce que dit le décret',
        texte:
          'L’article 1ᵉʳ abolit l’esclavage dans toutes les colonies, **deux mois** après la publication du texte sur place — le temps que les bateaux arrivent. L’article 7 étend aux colonies la vieille règle du royaume : le sol français affranchit celui qui le touche. Le décret interdit aussi à tout Français de posséder des esclaves, même à l’étranger, sous peine de perdre la nationalité. Surtout, il ne se contente pas de libérer : il fait des affranchis des **citoyens**. Dès août 1848, ils votent ; la Martinique et la Guadeloupe envoient des députés à Paris, et Schœlcher est élu par les deux. Un ancien esclave, **Louisy Mathieu**, ouvrier typographe, siège à l’Assemblée nationale la même année. En quelques mois, des hommes qui étaient juridiquement des meubles deviennent des électeurs.',
      },
      {
        titre: 'La Martinique n’a pas attendu',
        texte:
          'Le décret met des semaines à traverser l’Atlantique, et la nouvelle de la révolution de février le précède. En **Martinique**, l’arrestation d’un esclave nommé Romain déclenche l’insurrection de **Saint-Pierre** le 22 mai 1848 ; la répression fait des morts, et le gouverneur **Rostoland**, pour arrêter l’embrasement, proclame l’abolition **le 23 mai**, avant même d’avoir reçu le texte. La **Guadeloupe** suit le 27 mai, la **Guyane** le 10 juin, **La Réunion** le 20 décembre — l’océan Indien est loin. C’est pourquoi la France ne commémore pas l’abolition le même jour partout : chaque territoire retient la date où elle y est devenue réelle. Le décret a été signé à Paris ; il a été arraché, aussi, sur place.',
      },
      {
        titre: 'Libres, et après ?',
        texte:
          'La liberté arrive sans terre et sans argent. La loi du **30 avril 1849** vote une **indemnité de 126 millions de francs** — versée aux anciens **propriétaires**, pour la perte de leur « bien ». Les affranchis, eux, ne reçoivent rien, et se retrouvent salariés sur les plantations où ils étaient esclaves, ou installés sur des parcelles ingrates des hauteurs. Beaucoup quittent les habitations : les planteurs font alors venir sous contrat des travailleurs d’Inde, de Chine et d’Afrique, l’**engagisme**, un système de travail très dur qui durera jusqu’aux années 1880. Il faut aussi donner un **nom** à chacun : les officiers d’état civil en inscrivent des centaines de milliers en 1848 et 1849. L’égalité des droits est acquise en 1848 ; l’égalité réelle demandera beaucoup plus longtemps. Le 21 mai **2001**, la loi française reconnaît la traite et l’esclavage comme un **crime contre l’humanité**.',
      },
    ],
    consequences: [
      'Environ 250 000 esclaves sont libérés en quelques semaines dans les colonies françaises.',
      'Les affranchis deviennent citoyens et électeurs : ils votent dès août 1848 et envoient des députés à Paris.',
      'L’indemnité de 126 millions de francs (loi du 30 avril 1849) va aux anciens propriétaires ; les affranchis ne reçoivent ni terre ni compensation.',
      'Les planteurs remplacent la main-d’œuvre servile par des engagés venus d’Inde, de Chine et d’Afrique, sous contrat et sous surveillance.',
      'Des centaines de milliers de noms de famille sont attribués en 1848-1849 : beaucoup de familles antillaises et réunionnaises les portent encore.',
      'La loi du 21 mai 2001 reconnaît la traite et l’esclavage comme crime contre l’humanité.',
    ],
    chiffres: [
      { valeur: '250 000', quoi: 'esclaves affranchis dans les colonies françaises' },
      { valeur: '126 millions', quoi: 'de francs d’indemnité versés aux anciens propriétaires' },
      { valeur: '2 mois', quoi: 'de délai prévu par le décret dans chaque colonie' },
      { valeur: '54 ans', quoi: 'entre la première abolition (1794) et la seconde (1848)' },
    ],
    chrono: [
      { date: '4 février 1794', fait: 'La Convention abolit l’esclavage dans les colonies.' },
      { date: '20 mai 1802', fait: 'Bonaparte rétablit l’esclavage ; Delgrès meurt au Matouba.' },
      { date: '1834', fait: 'Fondation de la Société française pour l’abolition de l’esclavage.' },
      { date: '1842', fait: 'Schœlcher publie un livre réclamant l’abolition immédiate.' },
      { date: '4 mars 1848', fait: 'Commission d’abolition, présidée par Schœlcher.' },
      { date: '27 avril 1848', fait: 'Le décret d’abolition est signé à Paris.' },
      { date: '23 mai 1848', fait: 'La Martinique libre, avant l’arrivée du décret.' },
      { date: '27 mai 1848', fait: 'Proclamation de l’abolition en Guadeloupe.' },
      { date: 'août 1848', fait: 'Les nouveaux citoyens votent ; Schœlcher élu député.' },
      { date: '30 avril 1849', fait: 'La loi indemnise les anciens propriétaires.' },
      { date: '21 mai 2001', fait: 'La loi Taubira reconnaît un crime contre l’humanité.' },
    ],
    leSaisTu:
      'Un citoyen a besoin d’un nom de famille, et les esclaves n’en avaient pas. En 1848 et 1849, les officiers d’état civil en inventent par registres entiers : noms de l’Antiquité, noms de fleurs, de métiers, de lieux, anagrammes du nom de l’ancien maître. Des centaines de milliers de familles portent aujourd’hui un nom écrit ces jours-là.',
    aRetenir: [
      'Le décret d’abolition de l’esclavage est signé le 27 avril 1848 par le gouvernement provisoire.',
      'Victor Schœlcher, sous-secrétaire d’État aux colonies, en est le principal artisan.',
      'Environ 250 000 esclaves sont libérés et deviennent citoyens français, avec le droit de vote.',
      'C’est la seconde abolition : la première, de 1794, avait été annulée par Bonaparte en 1802.',
      'L’indemnité de 1849 a été versée aux anciens propriétaires, et non aux anciens esclaves.',
    ],
    mots: [
      {
        mot: 'Affranchi',
        sens: 'Personne rendue libre. En 1848, le mot désigne les anciens esclaves devenus citoyens.',
      },
      {
        mot: 'Marronnage',
        sens: 'Fuite d’un esclave hors de l’habitation, et vie en liberté dans les hauteurs ou les forêts.',
      },
      {
        mot: 'Engagisme',
        sens: 'Travail sous contrat de plusieurs années, imposé après 1848 à des travailleurs venus d’Inde, de Chine et d’Afrique.',
      },
      {
        mot: 'Indemnité',
        sens: 'Somme versée en compensation d’une perte. En 1849, elle a été payée aux propriétaires d’esclaves.',
      },
    ],
    lies: [
      'victor-schoelcher',
      'abolition-de-l-esclavage-1794',
      'revolution-de-1848',
      'traite-atlantique-et-code-noir',
      'toussaint-louverture',
    ],
    niveaux: ['4e'],
    programme: 'Une difficile conquête : voter de 1815 à 1870',
    tags: [
      'esclavage',
      'abolition',
      'Schoelcher',
      '1848',
      'colonies',
      'Martinique',
      'Guadeloupe',
      'La Réunion',
      'Guyane',
      'citoyenneté',
      'engagisme',
    ],
  },
  {
    id: 'defaite-de-sedan',
    volet: 'evenements',
    nom: 'La défaite de Sedan',
    date: '1ᵉʳ – 2 septembre 1870',
    tri: 1870,
    periode: 'xixe',
    emoji: '⚔️',
    lieu: 'Sedan, dans les Ardennes',
    accroche:
      'En deux jours, une armée française est encerclée et l’empereur se rend : la défaite emporte le Second Empire et donne la République.',
    citations: [
      {
        texte:
          'N’ayant pu mourir au milieu de mes troupes, il ne me reste qu’à remettre mon épée entre les mains de Votre Majesté.',
        qui: 'Napoléon III',
        contexte: 'Lettre au roi de Prusse Guillaume Iᵉʳ, écrite à Sedan le 1ᵉʳ septembre 1870 au soir.',
        sens:
          'Un chef d’État français se constitue prisonnier : c’est la première fois depuis Waterloo, et le régime n’y survivra pas trois jours.',
      },
      {
        texte: 'Ah ! les braves gens !',
        qui: 'Guillaume Iᵉʳ de Prusse',
        contexte:
          'Devant les charges de cavalerie française sur le plateau de Floing, le 1ᵉʳ septembre 1870, qu’il observe depuis les hauteurs.',
      },
      {
        texte: 'Nous acceptons la guerre d’un cœur léger.',
        qui: 'Émile Ollivier',
        contexte: 'Chef du gouvernement, devant le Corps législatif, le 15 juillet 1870.',
        sens:
          'Il voulait dire « la conscience tranquille », la France n’ayant selon lui rien à se reprocher. La phrase, comprise comme de l’insouciance, l’a poursuivi toute sa vie.',
      },
      {
        texte: 'Louis-Napoléon Bonaparte et sa dynastie ont à jamais cessé de régner sur la France.',
        qui: 'Léon Gambetta',
        contexte: 'Au Corps législatif puis à l’Hôtel de Ville de Paris, le 4 septembre 1870.',
        sens:
          'La République est proclamée sans vote et sans combat : le régime impérial est tombé avec son armée.',
      },
    ],
    reperes: [
      'La France déclare la guerre à la Prusse le 19 juillet 1870, après la dépêche d’Ems raccourcie par Bismarck.',
      'En un mois, l’armée française est battue partout et Bazaine se laisse enfermer dans Metz avec 180 000 hommes.',
      'Le 1ᵉʳ septembre, l’armée de MacMahon est encerclée dans la cuvette de Sedan, sous le feu de l’artillerie Krupp.',
      'Le 2 septembre, Napoléon III capitule : 83 000 soldats français sont faits prisonniers.',
      'Le 4 septembre 1870, la République est proclamée à Paris ; elle durera soixante-dix ans.',
    ],
    causes: [
      'La rivalité entre la France et la Prusse depuis 1866 : Bismarck a besoin d’une guerre contre la France pour achever l’unité allemande autour de son roi.',
      'La candidature d’un prince Hohenzollern au trône d’Espagne, en juillet 1870, et l’exigence française d’une renonciation définitive.',
      'La dépêche d’Ems, raccourcie par Bismarck le 13 juillet pour la rendre blessante des deux côtés : l’opinion s’enflamme à Paris comme à Berlin.',
      'Un Second Empire affaibli, qui espère retrouver dans une victoire le prestige que l’intérieur lui refuse.',
      'Une armée française mal préparée : mobilisation lente, intendance défaillante, aucun plan de campagne arrêté, face à des Allemands acheminés par chemin de fer.',
      'La supériorité de l’artillerie Krupp, en acier et chargée par la culasse, qui tire plus loin et plus vite que les canons de bronze français.',
    ],
    recit: [
      {
        titre: 'Une guerre voulue à Berlin, déclarée à Paris',
        texte:
          'Depuis sa victoire sur l’Autriche en 1866, la **Prusse** de **Bismarck** domine l’Allemagne du Nord, mais les États du Sud hésitent à la rejoindre. Bismarck sait qu’une guerre contre la France les ferait basculer. L’occasion vient en juillet **1870** : un prince allemand est candidat au trône d’Espagne. Paris exige son retrait, l’obtient, puis exige en plus l’engagement qu’il ne se représentera jamais. Le roi **Guillaume Iᵉʳ**, en cure à Ems, refuse poliment et télégraphie l’entretien à Berlin. Bismarck **raccourcit la dépêche** et la publie : le texte donne l’impression d’un refus insultant. La presse s’emballe. Le **19 juillet 1870**, la France déclare la guerre. Elle a contre elle toute l’Allemagne, près de cinq cent mille hommes mobilisés en quinze jours, et l’Europe qui regarde sans bouger.',
      },
      {
        titre: 'Six semaines de défaites',
        texte:
          'Les Français alignent environ deux cent cinquante mille hommes, sans dépôts, sans cartes de leur propre frontière dans certains corps. Les revers s’enchaînent : **Wissembourg** le 4 août, **Frœschwiller** et **Forbach** le 6, où le fusil **chassepot**, pourtant excellent, ne compense pas les canons allemands. L’Alsace et la Lorraine sont envahies. Le maréchal **Bazaine**, après les batailles très meurtrières de Rezonville et de **Saint-Privat** (16 et 18 août), se laisse enfermer dans **Metz** avec cent quatre-vingt mille hommes : la meilleure armée de France sort de la guerre sans avoir été détruite. Reste l’armée de Châlons, commandée par **MacMahon**, avec l’empereur malade à ses côtés. Au lieu de couvrir Paris, elle part au secours de Metz. Les Allemands la rabattent vers le nord, jusqu’à une petite ville des Ardennes.',
      },
      {
        titre: 'Le 1ᵉʳ septembre, dans la cuvette',
        texte:
          '**Sedan** est au fond d’une cuvette, entourée de hauteurs, adossée à la Meuse et à la frontière belge. Le 1ᵉʳ septembre au matin, cent vingt mille Français y sont cernés par deux cent mille Allemands et plus de sept cents canons qui tirent depuis les crêtes, sans être atteints. MacMahon est blessé dès sept heures ; le commandement change deux fois dans la journée. Vers deux heures, la cavalerie du général **Margueritte** charge par trois fois sur le plateau de **Floing** pour ouvrir une issue ; elle est fauchée, et Guillaume Iᵉʳ, qui observe la scène, laisse tomber son fameux « Ah ! les braves gens ! ». À la fin de l’après-midi, le drapeau blanc monte sur la citadelle. La capitulation est signée le **2 septembre** à Donchery : **83 000 prisonniers**, dont l’empereur des Français, qui remet son épée et part pour l’Allemagne en captivité.',
      },
      {
        titre: 'Deux jours plus tard, la République',
        texte:
          'La nouvelle atteint Paris le 3 septembre au soir. Le **4 septembre 1870**, la foule envahit le Palais-Bourbon ; **Gambetta** proclame la déchéance de la dynastie, puis la **République** à l’Hôtel de Ville. Un **gouvernement de la Défense nationale** se forme : il refuse la paix et continue la guerre. Le **19 septembre**, les Allemands bouclent Paris ; le siège durera quatre mois et demi, avec la faim, le froid et les bombardements de janvier. Le 7 octobre, Gambetta quitte la capitale **en ballon** pour aller lever des armées en province : celles de la Loire et de l’Est se battent tout l’hiver, sans renverser la situation. Le 27 octobre, Bazaine capitule à Metz et livre cent soixante-treize mille hommes. Le **28 janvier 1871**, Paris affamé cesse le feu.',
      },
      {
        titre: 'Ce que la défaite laisse',
        texte:
          'Le **18 janvier 1871**, dans la **galerie des Glaces de Versailles**, les princes allemands proclament Guillaume Iᵉʳ empereur : l’unité allemande se scelle chez le vaincu. Le **traité de Francfort**, signé le 10 mai 1871, annexe l’**Alsace** et une partie de la **Lorraine** — environ 1,6 million d’habitants — et impose **5 milliards de francs-or**, avec occupation du territoire jusqu’au paiement ; la France solde la somme dès 1873. Les élections de février 1871 donnent une Assemblée à majorité monarchiste, qui siège à Bordeaux puis à Versailles : Paris républicain, qui a tenu quatre mois, se sent trahi — et quelques semaines plus tard, c’est la **Commune**. De la défaite naissent aussi le service militaire pour tous, l’école de **Jules Ferry**, et quarante ans d’attente qu’on appellera l’esprit de revanche.',
      },
    ],
    consequences: [
      'Chute du Second Empire et proclamation de la IIIᵉ République le 4 septembre 1870, deux jours après la capitulation.',
      'Le siège de Paris (19 septembre 1870 – 28 janvier 1871), la faim, les bombardements — et, au sortir, la Commune.',
      'Le traité de Francfort du 10 mai 1871 : annexion de l’Alsace et de la Moselle, 5 milliards de francs-or, occupation jusqu’au paiement.',
      'L’Empire allemand est proclamé dans la galerie des Glaces de Versailles le 18 janvier 1871.',
      'L’Alsace-Lorraine perdue nourrit l’esprit de revanche, le service militaire obligatoire et une école patriote, jusqu’en 1914.',
      'Napoléon III, prisonnier puis exilé en Angleterre, y meurt en 1873 : la dynastie ne reviendra pas.',
    ],
    chiffres: [
      { valeur: '83 000', quoi: 'soldats français prisonniers à Sedan' },
      { valeur: '5 milliards', quoi: 'de francs-or exigés par le traité de Francfort' },
      { valeur: '1,6 million', quoi: 'd’habitants d’Alsace-Moselle passés sous souveraineté allemande' },
      { valeur: '47 ans', quoi: 'avant le retour de l’Alsace-Lorraine à la France, en 1918' },
    ],
    chrono: [
      { date: '13 juillet 1870', fait: 'Bismarck publie la dépêche d’Ems raccourcie.' },
      { date: '19 juillet 1870', fait: 'La France déclare la guerre à la Prusse.' },
      { date: '6 août 1870', fait: 'Défaites de Frœschwiller et de Forbach.' },
      { date: '18 août 1870', fait: 'Saint-Privat : Bazaine est enfermé dans Metz.' },
      { date: '1ᵉʳ septembre 1870', fait: 'Bataille de Sedan ; charges de Floing.' },
      { date: '2 septembre 1870', fait: 'Capitulation ; Napoléon III prisonnier.' },
      { date: '4 septembre 1870', fait: 'La République est proclamée à Paris.' },
      { date: '19 septembre 1870', fait: 'Début du siège de Paris.' },
      { date: '18 janvier 1871', fait: 'L’Empire allemand proclamé à Versailles.' },
      { date: '28 janvier 1871', fait: 'Armistice : Paris capitule.' },
      { date: '10 mai 1871', fait: 'Traité de Francfort : l’Alsace-Moselle annexée.' },
    ],
    leSaisTu:
      'Paris assiégé n’avait plus qu’une sortie : le ciel. Soixante-cinq ballons montés ont quitté la capitale entre septembre et janvier, emportant environ deux millions et demi de lettres et des pigeons voyageurs pour la réponse. Gambetta lui-même est parti de Montmartre en ballon, le 7 octobre 1870, au-dessus des lignes allemandes.',
    aRetenir: [
      'La guerre franco-prussienne est déclarée par la France le 19 juillet 1870.',
      'La bataille de Sedan a lieu les 1ᵉʳ et 2 septembre 1870 : Napoléon III y est fait prisonnier avec 83 000 hommes.',
      'Le 4 septembre 1870, la IIIᵉ République est proclamée à Paris.',
      'Le traité de Francfort (10 mai 1871) annexe l’Alsace et la Moselle et impose 5 milliards de francs-or.',
      'L’Empire allemand est proclamé le 18 janvier 1871 dans la galerie des Glaces, à Versailles.',
    ],
    mots: [
      {
        mot: 'Dépêche d’Ems',
        sens: 'Télégramme d’un entretien entre le roi de Prusse et l’ambassadeur français, raccourci par Bismarck pour paraître insultant.',
      },
      {
        mot: 'Capitulation',
        sens: 'Reddition d’une armée à l’ennemi, avec remise des armes et des hommes.',
      },
      {
        mot: 'Armistice',
        sens: 'Arrêt des combats convenu entre deux camps, avant un traité de paix.',
      },
      {
        mot: 'Annexion',
        sens: 'Rattachement d’un territoire à un autre État, sans que ses habitants aient été consultés.',
      },
    ],
    lies: [
      'napoleon-iii',
      'leon-gambetta',
      'otto-von-bismarck',
      'commune-de-paris',
      'unification-de-l-allemagne',
    ],
    niveaux: ['4e'],
    programme: 'La Troisième République',
    tags: [
      'Sedan',
      '1870',
      'guerre franco-prussienne',
      'Napoléon III',
      'Bismarck',
      'MacMahon',
      'Gambetta',
      'Alsace-Lorraine',
      'siège de Paris',
      'IIIe République',
    ],
  },
  {
    id: 'commune-de-paris',
    volet: 'evenements',
    nom: 'La Commune de Paris',
    date: '18 mars – 28 mai 1871',
    tri: 1871,
    fin: 1871,
    periode: 'xixe',
    emoji: '🔥',
    lieu: 'Paris',
    accroche:
      'Paris se gouverne seul pendant soixante-douze jours, puis une semaine de combats de rue met fin à la Commune dans le sang.',
    citations: [
      {
        texte:
          'Puisqu’il semble que tout cœur qui bat pour la liberté n’a droit qu’à un peu de plomb, j’en réclame ma part.',
        qui: 'Louise Michel',
        contexte: 'Devant le conseil de guerre qui la juge, à Versailles, le 16 décembre 1871.',
        sens:
          'Elle refuse de se défendre et réclame la mort plutôt que la pitié. Elle sera déportée en Nouvelle-Calédonie.',
      },
      {
        texte:
          'La colonne Vendôme sera démolie, comme monument de barbarie, symbole de force brute et de fausse gloire.',
        qui: 'Décret de la Commune, rapporté par le peintre Gustave Courbet',
        contexte: 'Décret du 12 avril 1871 ; la colonne est abattue le 16 mai devant la foule.',
        sens:
          'Courbet devra payer la reconstruction et mourra en exil en Suisse, sans l’avoir soldée.',
      },
      {
        texte: 'Le sol est jonché de leurs cadavres : ce spectacle affreux servira de leçon.',
        qui: 'Adolphe Thiers',
        contexte:
          'Dépêche du chef du pouvoir exécutif aux préfets, pendant la Semaine sanglante, fin mai 1871.',
        sens:
          'La répression est assumée et revendiquée comme un avertissement adressé au pays entier.',
      },
      {
        texte: 'Sur une barricade, au milieu des pavés souillés d’un sang coupable et d’un sang pur lavés…',
        qui: 'Victor Hugo',
        contexte:
          'Premiers vers d’un poème de *L’Année terrible*, écrit en juin 1871 sur un enfant de douze ans fusillé.',
        sens:
          'Hugo n’approuvait pas la Commune, et il a demandé la grâce des vaincus : on peut juger les actes sans applaudir la répression.',
      },
    ],
    reperes: [
      'Paris a tenu quatre mois et demi de siège avant la capitulation du 28 janvier 1871 : la ville est armée, affamée et humiliée.',
      'Le 18 mars 1871, Thiers veut enlever les canons de Montmartre payés par souscription : la troupe fraternise avec la foule.',
      'La Commune est proclamée le 28 mars ; elle gouverne Paris soixante-douze jours, drapeau rouge sur l’Hôtel de Ville.',
      'La Semaine sanglante, du 21 au 28 mai, oppose l’armée de Versailles aux fédérés, quartier par quartier.',
      'Au moins 10 000 à 15 000 morts selon les historiens, 43 500 prisonniers, environ 4 500 déportés.',
    ],
    causes: [
      'Quatre mois et demi de siège : la faim, le froid, les obus de janvier, et une ville qui refuse d’avoir capitulé pour rien.',
      'L’entrée des troupes allemandes dans Paris le 1ᵉʳ mars 1871, ressentie comme une humiliation par ceux qui ont tenu les remparts.',
      'Une Assemblée nationale élue le 8 février à majorité monarchiste et rurale, qui s’installe à Versailles et non dans la capitale.',
      'Les décrets de mars : fin du moratoire sur les loyers et les effets de commerce, suppression de la solde de la garde nationale — des milliers de familles sans ressources du jour au lendemain.',
      'Une garde nationale de près de deux cent mille hommes, armée, fédérée et non dissoute après l’armistice.',
      'La tentative d’enlever les canons de Montmartre le 18 mars 1871 : l’étincelle.',
    ],
    recit: [
      {
        titre: 'Paris affamé, Paris armé',
        texte:
          'Le siège a duré du 19 septembre 1870 au **28 janvier 1871**. On y a mangé les chevaux, les chiens, les rats, et jusqu’aux animaux du Jardin des Plantes ; la mortalité a doublé dans les quartiers pauvres. Quand la ville capitule, elle rend ses forts mais garde sa **garde nationale** : près de deux cent mille hommes en armes, dont les bataillons populaires ont élu leurs officiers et se sont **fédérés** — d’où le nom de **fédérés**. Le **1ᵉʳ mars**, les troupes allemandes défilent sur les Champs-Élysées : Paris ferme ses volets. Puis viennent les décisions de l’Assemblée installée à **Versailles** : fin du report des loyers et des dettes commerciales le 10 mars, suppression de la solde de trente sous de la garde nationale. Pour beaucoup, c’est la ruine immédiate. La ville a des armes, des canons payés par souscription publique, et plus rien à perdre.',
      },
      {
        titre: 'Le 18 mars, les canons de Montmartre',
        texte:
          'Au matin du **18 mars 1871**, **Thiers** envoie la troupe récupérer les **171 canons** rassemblés sur la butte **Montmartre** et ceux de Belleville. L’opération commence bien, puis s’enlise : les attelages pour tirer les pièces n’arrivent pas. Le temps passe, le quartier se réveille, les femmes montent les premières et parlent aux soldats, qui relèvent la crosse en l’air. Le général **Lecomte**, qui a ordonné le feu, est arrêté par ses propres hommes ; il est fusillé dans l’après-midi rue des Rosiers avec le général **Clément-Thomas**, sans jugement — la journée commence par deux exécutions que personne n’a décidées. Thiers, plutôt que de disputer la ville, ordonne l’**évacuation complète de Paris** sur Versailles : administrations, armée, ministères. Le pouvoir a quitté la capitale, et la capitale se retrouve à elle-même.',
      },
      {
        titre: 'Soixante-douze jours',
        texte:
          'Le **26 mars**, Paris élit un conseil ; la **Commune** est proclamée le 28 devant l’Hôtel de Ville, drapeau rouge en tête. Les élus sont ouvriers, employés, journalistes, quelques médecins ; leur traitement est plafonné au salaire d’un ouvrier qualifié, et ils sont révocables. En deux mois, la Commune décrète la **séparation de l’Église et de l’État** (2 avril), l’école **gratuite, obligatoire et laïque**, ouverte aux filles comme aux garçons, la remise des **loyers** impayés, la restitution gratuite des objets déposés au mont-de-piété, l’interdiction des amendes patronales, la fin du **travail de nuit des boulangers**, la remise des ateliers abandonnés à des coopératives ouvrières, une pension aux veuves et aux orphelins des gardes nationaux, mariées ou non. Des femmes s’organisent — **Louise Michel**, Élisabeth Dmitrieff et l’Union des femmes. Le 16 mai, la **colonne Vendôme** est abattue. Pendant ce temps, Versailles rassemble une armée, et les obus tombent déjà sur l’ouest parisien.',
      },
      {
        titre: 'La Semaine sanglante',
        texte:
          'Le **21 mai**, les troupes de Versailles entrent par une porte mal gardée, à Saint-Cloud. Commence une semaine de combats de rue, barricade après barricade, de l’ouest vers l’est. Des incendies ravagent le centre : les **Tuileries**, l’**Hôtel de Ville**, la Cour des comptes brûlent, allumés pour barrer la route aux colonnes ou par les obus. Des otages détenus par la Commune sont exécutés, parmi lesquels **Mgr Darboy**, archevêque de Paris, fusillé le 24 mai à la prison de la Roquette avec cinq autres, puis une cinquantaine de prisonniers rue Haxo le 26. Les exécutions sommaires de l’armée, elles, se comptent par milliers : on fusille sur dénonciation, à la caserne Lobau, au Luxembourg, au Père-Lachaise, où **147** fédérés tombent le 28 mai contre un mur qu’on appellera le **mur des Fédérés**. La dernière barricade tient rue Ramponeau. Les historiens estiment les morts de cette semaine à **10 000 à 15 000 au moins** ; les chiffres avancés autrefois montaient plus haut encore.',
      },
      {
        titre: 'Après : les pontons et l’oubli',
        texte:
          'La répression judiciaire suit la répression armée : **43 500 prisonniers**, entassés dans des camps et sur des pontons, vingt-six conseils de guerre, près de dix mille condamnations, quatre-vingt-treize peines de mort dont vingt-trois exécutées, et environ **4 500 déportations** en **Nouvelle-Calédonie** — Louise Michel est du nombre, et y ouvre une école pour les enfants kanaks. Le mouvement ouvrier français est décapité pour dix ans. L’**amnistie** totale n’est votée que le **11 juillet 1880**, en même temps que la République choisit le 14 juillet pour fête nationale : on tourne la page des deux côtés à la fois. Paris, lui, restera privé de maire élu jusqu’en **1977** : la République a eu peur de sa capitale. Sur la butte d’où tout était parti, le **Sacré-Cœur** est décidé en 1873 comme vœu national ; au Père-Lachaise, le mur des Fédérés devient un lieu de pèlerinage. Deux mémoires, dans la même ville.',
      },
    ],
    consequences: [
      'Soixante-douze jours d’un gouvernement municipal unique en Europe, dont plusieurs mesures — école laïque et gratuite, fin du travail de nuit des boulangers — seront reprises plus tard par la République.',
      'Une répression d’une violence extrême : au moins 10 000 à 15 000 morts, 43 500 prisonniers, environ 4 500 déportés en Nouvelle-Calédonie.',
      'Le mouvement ouvrier français est brisé pour une décennie ; l’amnistie totale n’arrive que le 11 juillet 1880.',
      'Paris reste privé de maire élu jusqu’en 1977 : la IIIᵉ République se méfie durablement de sa capitale.',
      'La IIIᵉ République naissante s’installe sur cette peur sociale et se veut « conservatrice » avant d’être réformatrice.',
      'La Commune devient un symbole discuté dans le monde entier, célébré par les uns, redouté par les autres.',
    ],
    chiffres: [
      { valeur: '72', quoi: 'jours de la Commune, du 18 mars au 28 mai 1871' },
      { valeur: '171', quoi: 'canons rassemblés sur la butte Montmartre' },
      { valeur: '10 000 à 15 000', quoi: 'morts de la Semaine sanglante, selon les historiens' },
      { valeur: '4 500', quoi: 'communards déportés en Nouvelle-Calédonie' },
    ],
    chrono: [
      { date: '28 janvier 1871', fait: 'Armistice : Paris capitule après quatre mois de siège.' },
      { date: '1ᵉʳ mars 1871', fait: 'Les troupes allemandes défilent sur les Champs-Élysées.' },
      { date: '18 mars 1871', fait: 'Les canons de Montmartre ; Thiers évacue Paris.' },
      { date: '26 mars 1871', fait: 'Élections communales dans la capitale.' },
      { date: '28 mars 1871', fait: 'La Commune est proclamée à l’Hôtel de Ville.' },
      { date: '2 avril 1871', fait: 'Décret de séparation de l’Église et de l’État.' },
      { date: '16 mai 1871', fait: 'La colonne Vendôme est abattue.' },
      { date: '21 mai 1871', fait: 'Les Versaillais entrent dans Paris : Semaine sanglante.' },
      { date: '24 mai 1871', fait: 'Mgr Darboy, archevêque de Paris, est fusillé.' },
      { date: '28 mai 1871', fait: 'Dernière barricade ; fusillades au Père-Lachaise.' },
      { date: '11 juillet 1880', fait: 'Amnistie totale des communards.' },
    ],
    leSaisTu:
      'Pendant soixante-douze jours, les réserves d’or de la Banque de France sont restées à portée de main de la Commune, gardées par une poignée d’employés. Elle n’y a pris que des avances — une quinzaine de millions —, en réclamant des reçus. Versailles, lui, y puisait pour payer l’armée qui reprendrait la ville.',
    aRetenir: [
      'La Commune de Paris dure du 18 mars au 28 mai 1871, soit soixante-douze jours.',
      'Elle naît du siège, de la capitulation et de la tentative d’enlever les canons de Montmartre le 18 mars.',
      'Elle décrète l’école gratuite, obligatoire et laïque, la remise des loyers et la fin du travail de nuit des boulangers.',
      'La Semaine sanglante (21-28 mai 1871) fait au moins 10 000 à 15 000 morts selon les historiens.',
      'La répression envoie 4 500 condamnés en Nouvelle-Calédonie ; l’amnistie est votée en 1880.',
    ],
    mots: [
      {
        mot: 'Fédéré',
        sens: 'Garde national parisien rallié à la Commune, du nom de la fédération des bataillons formée en mars 1871.',
      },
      {
        mot: 'Semaine sanglante',
        sens: 'Les combats du 21 au 28 mai 1871, pendant lesquels l’armée de Versailles reprend Paris.',
      },
      {
        mot: 'Mur des Fédérés',
        sens: 'Mur du cimetière du Père-Lachaise où 147 combattants furent fusillés le 28 mai 1871.',
      },
      {
        mot: 'Conseil de guerre',
        sens: 'Tribunal militaire ; vingt-six d’entre eux ont jugé les communards après la répression.',
      },
    ],
    lies: [
      'defaite-de-sedan',
      'adolphe-thiers',
      'louise-michel',
      'revolution-de-1848',
      'lois-jules-ferry',
    ],
    niveaux: ['4e'],
    programme: 'La Troisième République',
    tags: [
      'Commune',
      '1871',
      'Semaine sanglante',
      'fédérés',
      'Montmartre',
      'Thiers',
      'Louise Michel',
      'mur des Fédérés',
      'Nouvelle-Calédonie',
      'Versailles',
    ],
  },
  {
    id: 'lois-jules-ferry',
    volet: 'evenements',
    nom: 'Les lois scolaires de Jules Ferry',
    date: '1881 – 1882',
    tri: 1881,
    fin: 1882,
    periode: 'xixe',
    emoji: '🏫',
    lieu: 'La France entière',
    accroche:
      'Deux lois, en 1881 et 1882, rendent l’école primaire gratuite, obligatoire et laïque : la République se donne ses citoyens.',
    citations: [
      {
        texte:
          'Mon but est de faire disparaître la dernière, la plus redoutable des inégalités qui viennent de la naissance : l’inégalité d’éducation.',
        qui: 'Jules Ferry',
        contexte: 'Conférence sur l’égalité d’éducation, salle Molière, à Paris, le 10 avril 1870.',
        sens:
          'L’école n’est pas pensée comme un service de plus, mais comme la suite de 1789 : après les privilèges de naissance, le privilège du savoir.',
      },
      {
        texte: 'Vous êtes l’auxiliaire et, à certains égards, le suppléant du père de famille.',
        qui: 'Jules Ferry',
        contexte: 'Lettre aux instituteurs, 17 novembre 1883, sur l’enseignement de la morale.',
        sens:
          'Consigne de prudence : le maître n’enseigne que ce qu’aucun père honnête ne pourrait lui reprocher, et ne touche pas aux croyances de l’enfant.',
      },
      {
        texte: 'Nos jeunes maîtres étaient beaux comme des hussards noirs.',
        qui: 'Charles Péguy',
        contexte: 'Dans *L’Argent*, en 1913, souvenir de ses instituteurs en blouse sombre.',
        sens:
          'L’expression « hussards noirs de la République » vient de là : des maîtres jeunes, sévères, sanglés dans leur tablier, et fiers de leur mission.',
      },
      {
        texte: 'Le cléricalisme ? Voilà l’ennemi !',
        qui: 'Léon Gambetta',
        contexte: 'À la Chambre des députés, le 4 mai 1877, reprenant une formule d’Alphonse Peyrat.',
        sens:
          'Le mot ne vise pas la religion mais son emploi politique. C’est le climat dans lequel les lois scolaires sont votées.',
      },
    ],
    reperes: [
      'La loi du 16 juin 1881 rend l’enseignement primaire public entièrement gratuit.',
      'La loi du 28 mars 1882 rend l’instruction obligatoire de 6 à 13 ans et retire l’instruction religieuse des programmes publics.',
      'Un jour par semaine est laissé libre pour le catéchisme, mais hors de l’école.',
      'La loi Goblet de 1886 confie les classes des écoles publiques à des maîtres laïques.',
      'En 1876, 17 % des conscrits ne savent ni lire ni écrire ; ils sont moins de 4 % à la veille de 1914.',
    ],
    causes: [
      'La défaite de 1870, attribuée en partie à l’avance scolaire de l’Allemagne : on dit alors que la Prusse a gagné par son instituteur.',
      'Le suffrage universel masculin, qui a porté au pouvoir un empereur puis une Assemblée monarchiste : la République veut des électeurs instruits.',
      'Un pays très inégal devant l’instruction : la loi Guizot de 1833 avait imposé une école de garçons par commune, la loi Falloux de 1850 avait laissé une large place aux congrégations.',
      'La lutte entre l’Église et la République pour la formation des esprits, résumée par le mot de Gambetta sur le cléricalisme.',
      'Les besoins de l’industrie, du commerce et de l’administration, qui réclament des employés sachant lire, écrire et compter.',
      'Une France qui parle encore breton, occitan, basque, flamand ou corse, et qu’on veut unifier par une langue commune.',
    ],
    recit: [
      {
        titre: 'Pourquoi l’école devient une affaire d’État',
        texte:
          'Après **1870**, la République est fragile : proclamée dans la défaite, elle ne devient vraiment républicaine qu’en 1877-1879, quand les monarchistes perdent le Sénat et la présidence. Or elle repose sur le **suffrage universel masculin**, et ce même suffrage a élu Louis-Napoléon en 1848 puis une Assemblée monarchiste en 1871. Les républicains en tirent une conclusion simple : **on ne fait pas de République sans républicains**, et on ne fait pas de républicains sans école. S’y ajoute la leçon militaire de la défaite — un pays qui lit, écrit et compte mobilise mieux. **Jules Ferry**, ministre de l’Instruction publique à partir de 1879, s’appuie sur une génération de savants et de réformateurs, notamment **Paul Bert**, et mène le chantier en moins de cinq ans.',
      },
      {
        titre: 'Deux lois, trois mots',
        texte:
          'La loi du **16 juin 1881** supprime toute rétribution scolaire dans les écoles primaires publiques : l’école devient **gratuite**. La loi du **28 mars 1882** rend l’instruction **obligatoire** de six à treize ans — obligatoire, pas l’école publique : les familles peuvent choisir une école privée ou l’enseignement à la maison — et rend l’enseignement public **laïque**, en remplaçant l’instruction religieuse par une instruction morale et civique. Un jour par semaine reste libre pour permettre le catéchisme, **en dehors** des locaux scolaires. Deux textes encadrent ce cœur : la loi **Paul Bert** de 1879 crée une école normale d’instituteurs et une d’institutrices par département, et la loi **Camille Sée** de 1880 ouvre des lycées de jeunes filles. La loi **Goblet** du 30 octobre 1886 achève l’édifice en confiant les classes publiques à des maîtres laïques.',
      },
      {
        titre: 'Les hussards noirs',
        texte:
          'L’instituteur sort de l’**école normale** du département, il est nommé par l’État, logé à l’école, souvent **secrétaire de mairie**. Il porte la blouse noire — d’où l’expression de **Péguy** — et, dans des milliers de communes, il est avec le curé le seul homme à avoir fait des études. Sa classe a ses objets : la carte de France au mur, le tableau des poids et mesures, les plumes Sergent-Major, le poêle, et un livre que tout le monde lit, *Le Tour de la France par deux enfants* (1877), vendu à plus de six millions d’exemplaires. Au bout du chemin, le **certificat d’études primaires**, passé vers treize ans, dicté, calculé, récité : pour des générations d’enfants d’ouvriers et de paysans, c’est le premier et souvent le seul diplôme. Il vaut de l’or dans une embauche.',
      },
      {
        titre: 'Le français contre les patois',
        texte:
          'En 1863, une enquête du ministère estime qu’un quart des communes françaises ne parle pas le français. L’école va changer cela en trente ans, et elle le fait sans ménagement : la classe se tient en français, et beaucoup de maîtres pratiquent le **« symbole »** — un jeton, une bûchette, parfois un sabot, remis à l’élève surpris à parler breton, occitan ou flamand, qu’il doit refiler au suivant ; le dernier de la journée est puni. Le résultat est double, et il faut le dire entier. D’un côté, un enfant du Finistère et un enfant du Var peuvent désormais se comprendre, lire le même journal, écrire à leur famille, défendre leurs droits dans la langue de l’administration. De l’autre, les **langues régionales** reculent d’une génération à l’autre et ne s’en relèveront pas. L’unité nationale s’est payée là.',
      },
      {
        titre: 'Ce que ça change',
        texte:
          'En une génération, la France cesse d’être un pays d’illettrés : **17 %** des conscrits ne savaient ni lire ni écrire en 1876, moins de **4 %** en 1913. Les enfants des campagnes accèdent au calcul, à l’histoire, à la géographie, à l’hygiène ; les filles sont scolarisées comme les garçons, dans des classes séparées. L’école devient le pilier du régime et son symbole : la mairie et l’école se font face dans des milliers de villages. Mais la **querelle scolaire** est ouverte pour longtemps : les écoles catholiques, elles, continuent hors du service public, et l’affrontement sur la place de la religion se poursuivra jusqu’à la **loi de séparation de 1905** et bien au-delà. Enfin, l’effort s’arrête au primaire : le secondaire reste payant jusqu’en 1930, et les lycées de jeunes filles ne préparent pas au baccalauréat avant 1924.',
      },
    ],
    consequences: [
      'L’école primaire publique devient gratuite (1881), obligatoire et laïque (1882) : les trois mots tiennent encore aujourd’hui.',
      'L’alphabétisation devient quasi générale : moins de 4 % de conscrits illettrés en 1913, contre 17 % en 1876.',
      'L’instituteur devient un personnage central de la commune, « hussard noir » de la République et souvent secrétaire de mairie.',
      'Le français s’impose sur tout le territoire, au prix du recul des langues régionales.',
      'La querelle scolaire dresse l’Église et la République l’une contre l’autre jusqu’à la loi de 1905 et au-delà.',
      'Les jeunes filles entrent dans l’enseignement secondaire public (loi Camille Sée, 1880), mais sans préparer le baccalauréat avant 1924.',
    ],
    chiffres: [
      { valeur: '6 à 13 ans', quoi: 'l’âge de l’instruction obligatoire fixé en 1882' },
      { valeur: '17 %', quoi: 'de conscrits ne sachant ni lire ni écrire en 1876' },
      { valeur: '4 %', quoi: 'de conscrits illettrés en 1913' },
      { valeur: '6 millions', quoi: 'd’exemplaires du Tour de la France par deux enfants' },
    ],
    chrono: [
      { date: '28 juin 1833', fait: 'Loi Guizot : une école de garçons par commune.' },
      { date: '15 mars 1850', fait: 'Loi Falloux : large place donnée aux congrégations.' },
      { date: '9 août 1879', fait: 'Loi Paul Bert : une école normale par département.' },
      { date: '21 décembre 1880', fait: 'Loi Camille Sée : les lycées de jeunes filles.' },
      { date: '16 juin 1881', fait: 'L’école primaire publique devient gratuite.' },
      { date: '28 mars 1882', fait: 'L’instruction devient obligatoire, l’école publique laïque.' },
      { date: '17 novembre 1883', fait: 'Lettre de Jules Ferry aux instituteurs.' },
      { date: '30 octobre 1886', fait: 'Loi Goblet : des maîtres laïques dans les écoles publiques.' },
      { date: '9 décembre 1905', fait: 'Séparation des Églises et de l’État.' },
    ],
    leSaisTu:
      'Le certificat d’études se passait à onze, douze ou treize ans, au chef-lieu de canton, en habits du dimanche. Dictée, problème, récitation, chant et couture pour les filles : une journée entière. Celui qui l’avait le montrait toute sa vie, et beaucoup de familles l’ont encadré au mur, à côté du portrait de mariage.',
    aRetenir: [
      'La loi du 16 juin 1881 rend l’école primaire publique gratuite.',
      'La loi du 28 mars 1882 rend l’instruction obligatoire de 6 à 13 ans et l’école publique laïque.',
      'Jules Ferry est ministre de l’Instruction publique de 1879 à 1883.',
      'Les instituteurs, formés dans les écoles normales départementales, sont surnommés les « hussards noirs de la République ».',
      'L’école généralise le français et fait reculer l’illettrisme : moins de 4 % des conscrits en 1913.',
    ],
    mots: [
      {
        mot: 'Laïcité',
        sens: 'Principe selon lequel l’État et l’école publique ne prennent parti pour aucune religion et respectent toutes les croyances.',
      },
      {
        mot: 'Instruction obligatoire',
        sens: 'Obligation faite aux familles d’instruire les enfants de 6 à 13 ans, à l’école publique, privée ou à la maison.',
      },
      {
        mot: 'École normale',
        sens: 'Établissement qui formait les instituteurs et les institutrices, un par département depuis 1879.',
      },
      {
        mot: 'Certificat d’études',
        sens: 'Examen de fin d’école primaire, créé en 1882 : longtemps le seul diplôme du plus grand nombre.',
      },
      {
        mot: 'Congrégation',
        sens: 'Communauté religieuse ; beaucoup tenaient des écoles avant les lois scolaires.',
      },
    ],
    lies: [
      'jules-ferry',
      'defaite-de-sedan',
      'leon-gambetta',
      'loi-de-separation-1905',
      'affaire-dreyfus',
    ],
    niveaux: ['4e'],
    programme: 'La Troisième République',
    tags: [
      'Jules Ferry',
      'école',
      'lois scolaires',
      '1881',
      '1882',
      'laïcité',
      'gratuité',
      'instituteurs',
      'hussards noirs',
      'certificat d’études',
      'IIIe République',
    ],
  },
  {
    id: 'affaire-dreyfus',
    volet: 'evenements',
    nom: 'L’affaire Dreyfus',
    date: '1894 – 1906',
    tri: 1894,
    fin: 1906,
    periode: 'xixe',
    emoji: '📰',
    lieu: 'Paris, Rennes et l’île du Diable',
    accroche:
      'Un capitaine innocent condamné sur une pièce secrète, et douze ans de bataille pour le prouver : la France entière s’y déchire.',
    citations: [
      {
        texte:
          'J’accuse le premier conseil de guerre d’avoir violé le droit en condamnant un accusé sur une pièce restée secrète.',
        qui: 'Émile Zola',
        contexte:
          'Lettre ouverte au président de la République Félix Faure, publiée en une de *L’Aurore* le 13 janvier 1898.',
        sens:
          'Tout tient dans cette phrase : le procès de 1894 est illégal, non parce que l’accusé est sympathique, mais parce que la défense n’a pas vu les pièces.',
      },
      {
        texte: 'Soldats, on dégrade un innocent ! Vive la France ! Vive l’armée !',
        qui: 'Alfred Dreyfus',
        contexte:
          'Pendant sa dégradation dans la cour de l’École militaire, à Paris, le 5 janvier 1895.',
        sens:
          'Il crie son innocence sans renier l’armée qui le condamne : c’est l’officier français qu’on dégrade, et il le reste.',
      },
      {
        texte: 'Le gouvernement de la République me rend ma liberté. Elle n’est rien pour moi sans l’honneur.',
        qui: 'Alfred Dreyfus',
        contexte: 'Déclaration du 21 septembre 1899, deux jours après la grâce du président Loubet.',
        sens:
          'Accepter la grâce, ce n’est pas s’avouer coupable : il annonce qu’il continuera jusqu’à la révision. Il l’obtiendra sept ans plus tard.',
      },
      {
        texte: 'La vérité est en marche, et rien ne l’arrêtera.',
        qui: 'Émile Zola',
        contexte: 'Article du *Figaro*, 25 novembre 1897, deux mois avant « J’accuse… ! ».',
      },
    ],
    reperes: [
      'En 1894, un bordereau anonyme trouvé à l’ambassade d’Allemagne fait accuser le capitaine Alfred Dreyfus, officier alsacien et juif.',
      'Il est condamné à huis clos sur un dossier secret que sa défense n’a jamais vu : c’est l’illégalité fondatrice de l’Affaire.',
      'Dégradé le 5 janvier 1895, il passe plus de quatre ans seul à l’île du Diable, en Guyane.',
      'Le colonel Picquart identifie dès 1896 le vrai auteur du bordereau, le commandant Esterhazy : on l’écarte.',
      'Le 13 janvier 1898, Zola publie « J’accuse… ! » : le pays se partage en dreyfusards et antidreyfusards.',
      'Dreyfus est gracié en 1899 et réhabilité par la Cour de cassation le 12 juillet 1906.',
    ],
    causes: [
      'L’Alsace perdue en 1871 et l’obsession de l’espionnage allemand dans une armée qui prépare la revanche.',
      'Un antisémitisme puissant et publié : *La France juive* de Drumont (1886), le journal *La Libre Parole* (1892), et la suspicion qui entoure les rares officiers juifs de l’état-major.',
      'Un bordereau anonyme, une expertise d’écriture contestée dès l’origine, et l’urgence, pour l’état-major, de désigner un coupable.',
      'La communication aux juges d’un dossier secret que la défense n’a pas vu : la condamnation de 1894 est illégale dès le premier jour.',
      'La raison d’État : reconnaître l’erreur obligerait l’armée à se déjuger, d’où les faux, les silences et l’éloignement de ceux qui cherchent.',
      'Une presse de masse, libre depuis 1881 et vendue un sou, qui transforme une affaire d’espionnage en bataille nationale.',
    ],
    recit: [
      {
        titre: 'Un bordereau dans une corbeille',
        texte:
          'En septembre **1894**, le service de renseignement français récupère à l’ambassade d’Allemagne, à Paris, un papier déchiré : un **bordereau** anonyme annonçant la livraison de documents militaires. L’écriture est comparée à celle des officiers de l’état-major ; les soupçons tombent sur le capitaine **Alfred Dreyfus**, polytechnicien, artilleur, alsacien et juif — le seul officier juif du service. Les experts se contredisent, l’un d’eux invente une théorie de l’« autoforgerie ». Arrêté le **15 octobre**, jugé à **huis clos** du 19 au 22 décembre par un conseil de guerre, il est condamné à la **déportation à vie**. Les juges ont reçu, pendant leur délibération, un **dossier secret** que ni Dreyfus ni son avocat n’ont vu. Tout ce qui suivra pendant douze ans découle de ce geste-là.',
      },
      {
        titre: 'La dégradation',
        texte:
          'Le **5 janvier 1895**, dans la cour de l’**École militaire**, devant les troupes en carré et des milliers de curieux massés aux grilles, un adjudant arrache les galons, les boutons et les bandes du pantalon de Dreyfus, puis brise son sabre sur son genou. Le condamné crie son innocence et « Vive la France ! » ; dehors, la foule hurle « Mort aux Juifs ! ». Un journaliste autrichien présent ce jour-là, **Theodor Herzl**, en tirera la conclusion que les Juifs d’Europe ont besoin d’un État. En avril, Dreyfus est débarqué à l’**île du Diable**, au large de la Guyane : seul prisonnier de l’île, gardé par des surveillants qui ont interdiction de lui parler, la nuit entravé à son lit par une double boucle. Il y restera **plus de quatre ans**, sans savoir ce qui se passe en France.',
      },
      {
        titre: 'Picquart trouve le vrai coupable',
        texte:
          'En 1896, le nouveau chef du service de renseignement, le lieutenant-colonel **Georges Picquart**, tombe sur un autre document, le « petit bleu », et reconnaît dans le bordereau l’écriture du commandant **Esterhazy**, officier criblé de dettes. Il prévient sa hiérarchie, qui lui ordonne de se taire, puis l’envoie en Tunisie et finit par l’emprisonner. Pour consolider le dossier contre Dreyfus, le colonel **Henry** fabrique un **faux**. En novembre 1897, le frère du condamné, **Mathieu Dreyfus**, dénonce publiquement Esterhazy ; celui-ci demande à être jugé et un conseil de guerre l’**acquitte en trois minutes**, le 11 janvier 1898. C’est cet acquittement, et non la condamnation de 1894, qui fait exploser l’Affaire : il montre que l’armée préfère couvrir un coupable plutôt que reconnaître une erreur.',
      },
      {
        titre: 'J’accuse… !',
        texte:
          'Le **13 janvier 1898**, *L’Aurore* publie en première page une lettre d’**Émile Zola** au président de la République, sous un titre de trois mots : **« J’accuse… ! »**. Le romancier le plus lu de France y nomme les officiers responsables et se met volontairement en position d’être poursuivi, pour obtenir un procès public. Le journal tire **300 000 exemplaires**. Zola est condamné à un an de prison et s’exile à Londres. Le lendemain paraît une pétition d’écrivains, de savants et d’universitaires que l’on appellera le manifeste des **« intellectuels »** — le mot, employé d’abord par leurs adversaires comme une moquerie, leur reste et entre dans la langue. Le pays se coupe en deux, jusque dans les familles ; l’hiver 1898 voit des émeutes antisémites dans des dizaines de villes et à Alger. Le **30 août 1898**, le colonel **Henry** avoue son faux ; il se suicide le lendemain.',
      },
      {
        titre: 'Rennes, la grâce, la réhabilitation',
        texte:
          'La Cour de cassation casse le jugement de 1894 le **3 juin 1899**. Dreyfus revient de Guyane, méconnaissable, et comparaît à **Rennes** en août. Le procès est un choc : son avocat, Labori, est blessé d’un coup de revolver dans la rue, et le conseil de guerre, plutôt que de reconnaître l’erreur de l’armée, le condamne de nouveau à **dix ans** avec « circonstances atténuantes » — formule absurde, puisqu’on ne trahit pas à moitié. Pour sortir du piège, le président **Loubet** le **gracie** le 19 septembre 1899 ; Dreyfus accepte, en annonçant qu’il continuera. Une loi d’amnistie éteint les poursuites en 1900. Ce n’est que le **12 juillet 1906** que la Cour de cassation casse le jugement de Rennes **sans renvoi** : Dreyfus est innocent, définitivement. Le 21 juillet, il est fait chevalier de la Légion d’honneur dans la cour même où il avait été dégradé.',
      },
      {
        titre: 'Ce que l’Affaire a montré du pays',
        texte:
          'L’Affaire a révélé trois choses. D’abord la force de l’**antisémitisme** en France, dans la presse, la rue et une partie des élites — et le fait qu’il pouvait être combattu et battu, sans disparaître. Ensuite le pouvoir de la **presse** : un journal à un sou, une une bien titrée, et une décision d’état-major devient une affaire nationale. Enfin la naissance d’un rôle nouveau, celui des **intellectuels** qui interviennent au nom de la vérité et du droit, hors de tout mandat ; la **Ligue des droits de l’homme** naît en 1898 de ce mouvement. Politiquement, la victoire des dreyfusards porte au pouvoir une gauche qui votera la **séparation des Églises et de l’État** en 1905. Dreyfus, réintégré, se bat en 1914-1918 et meurt en 1935. Zola entre au Panthéon en 1908. L’armée française n’a reconnu officiellement l’innocence de Dreyfus qu’en **1995**.',
      },
    ],
    consequences: [
      'La justice civile l’emporte sur la justice militaire : la Cour de cassation casse deux jugements de conseils de guerre et réhabilite un innocent.',
      'Le mot « intellectuel » entre dans la langue politique ; la Ligue des droits de l’homme est fondée en 1898.',
      'L’antisémitisme français s’affiche au grand jour, puis recule officiellement — sans disparaître des journaux ni des ligues.',
      'La victoire des dreyfusards installe une majorité de gauche qui votera la séparation des Églises et de l’État en 1905.',
      'Alfred Dreyfus, réhabilité le 12 juillet 1906, est réintégré dans l’armée et sert pendant la Première Guerre mondiale.',
      'Émile Zola, mort en 1902, entre au Panthéon en 1908 ; l’armée reconnaît officiellement l’innocence de Dreyfus en 1995.',
    ],
    chiffres: [
      { valeur: '4 ans', quoi: 'passés seul à l’île du Diable, en Guyane' },
      { valeur: '300 000', quoi: 'exemplaires de L’Aurore vendus le 13 janvier 1898' },
      { valeur: '10 ans', quoi: 'de nouveau infligés au procès de Rennes, en 1899' },
      { valeur: '12 ans', quoi: 'entre l’arrestation de 1894 et la réhabilitation de 1906' },
    ],
    chrono: [
      { date: 'septembre 1894', fait: 'Le bordereau est découvert à l’ambassade d’Allemagne.' },
      { date: '15 octobre 1894', fait: 'Arrestation du capitaine Dreyfus.' },
      { date: '22 décembre 1894', fait: 'Condamnation à huis clos, sur un dossier secret.' },
      { date: '5 janvier 1895', fait: 'Dégradation dans la cour de l’École militaire.' },
      { date: 'avril 1895', fait: 'Déportation à l’île du Diable, en Guyane.' },
      { date: 'mars 1896', fait: 'Picquart identifie l’écriture d’Esterhazy.' },
      { date: '11 janvier 1898', fait: 'Esterhazy acquitté par un conseil de guerre.' },
      { date: '13 janvier 1898', fait: '« J’accuse… ! » d’Émile Zola dans L’Aurore.' },
      { date: '31 août 1898', fait: 'Le colonel Henry, auteur d’un faux, se suicide.' },
      { date: '9 septembre 1899', fait: 'Procès de Rennes : nouvelle condamnation.' },
      { date: '19 septembre 1899', fait: 'Grâce accordée par le président Loubet.' },
      { date: '12 juillet 1906', fait: 'Réhabilitation par la Cour de cassation.' },
    ],
    leSaisTu:
      'Le manuscrit de Zola ne s’appelait pas « J’accuse… ! » mais « Lettre à M. Félix Faure, président de la République ». C’est Clemenceau, qui dirigeait *L’Aurore*, qui a pris trois mots dans le corps du texte pour en faire le titre de la une. Le journal, tiré d’ordinaire à trente mille exemplaires, en a vendu trois cent mille.',
    aRetenir: [
      'Le capitaine Alfred Dreyfus est condamné en décembre 1894 pour espionnage, sur un dossier secret caché à sa défense.',
      'Il est dégradé le 5 janvier 1895 et déporté à l’île du Diable, en Guyane.',
      'Le colonel Picquart identifie dès 1896 le véritable auteur du bordereau, le commandant Esterhazy.',
      'Le 13 janvier 1898, Émile Zola publie « J’accuse… ! » dans L’Aurore et fait de l’affaire un débat national.',
      'Dreyfus est gracié en 1899, puis réhabilité par la Cour de cassation le 12 juillet 1906.',
      'L’Affaire révèle la force de l’antisémitisme, le poids de la presse et fait naître la figure de l’« intellectuel ».',
    ],
    mots: [
      {
        mot: 'Bordereau',
        sens: 'Liste de documents ; ici, le papier anonyme trouvé en 1894 qui servit de preuve unique.',
      },
      {
        mot: 'Dégradation militaire',
        sens: 'Cérémonie où l’on arrache ses galons à un officier condamné et où l’on brise son sabre.',
      },
      {
        mot: 'Dreyfusard',
        sens: 'Partisan de la révision du procès ; ses adversaires étaient les antidreyfusards.',
      },
      {
        mot: 'Raison d’État',
        sens: 'Idée que l’intérêt supérieur du pays justifierait de passer outre le droit d’un individu.',
      },
      {
        mot: 'Réhabilitation',
        sens: 'Décision de justice qui efface une condamnation et rend son honneur à un innocent.',
      },
    ],
    lies: [
      'alfred-dreyfus',
      'emile-zola',
      'georges-clemenceau',
      'jean-jaures',
      'loi-de-separation-1905',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Troisième République',
    tags: [
      'Dreyfus',
      'Zola',
      'J’accuse',
      'bordereau',
      'Esterhazy',
      'Picquart',
      'île du Diable',
      'Rennes',
      'antisémitisme',
      'intellectuels',
      'IIIe République',
    ],
  },
  {
    id: 'loi-de-separation-1905',
    volet: 'evenements',
    nom: 'La séparation des Églises et de l’État',
    date: '9 décembre 1905',
    tri: 1905,
    periode: 'xixe',
    emoji: '⛪',
    lieu: 'Paris et la France entière',
    accroche:
      'La République cesse de nommer et de payer les ministres des cultes, et garantit à chacun la liberté de croire : c’est la laïcité française.',
    citations: [
      {
        texte:
          'La République assure la liberté de conscience. Elle garantit le libre exercice des cultes sous les seules restrictions édictées ci-après dans l’intérêt de l’ordre public.',
        qui: 'Article 1ᵉʳ de la loi du 9 décembre 1905',
        contexte: 'Le premier article du texte rapporté par Aristide Briand.',
        sens:
          'La loi commence par une garantie, pas par une interdiction : chacun peut croire, pratiquer, changer d’avis ou ne rien croire du tout.',
      },
      {
        texte: 'La République ne reconnaît, ne salarie ni ne subventionne aucun culte.',
        qui: 'Article 2 de la loi du 9 décembre 1905',
        contexte: 'L’article qui met fin au Concordat conclu par Bonaparte et Pie VII en 1801.',
        sens:
          'L’État ne se mêle plus des religions et n’en finance aucune : elles vivent des dons de leurs fidèles.',
      },
      {
        texte: 'Séparer l’État de l’Église est une thèse absolument fausse, une très pernicieuse erreur.',
        qui: 'Le pape Pie X',
        contexte: 'Encyclique *Vehementer nos*, 11 février 1906, condamnant la loi française.',
        sens:
          'Rome refuse la loi et interdit aux catholiques français de former les associations prévues pour recevoir les biens d’Église.',
      },
      {
        texte: 'Savoir si l’on comptera les chandeliers dans une église ne vaut pas une vie humaine.',
        qui: 'Georges Clemenceau',
        contexte:
          'Ministre de l’Intérieur, en suspendant les inventaires après les morts de mars 1906.',
        sens:
          'Le gouvernement recule devant la résistance des paroisses : c’est le premier pas vers l’apaisement.',
      },
    ],
    reperes: [
      'Depuis le Concordat de 1801, l’État nommait et payait les ministres de quatre cultes reconnus.',
      'La loi est votée par la Chambre le 3 juillet 1905 par 341 voix contre 233, et adoptée définitivement le 9 décembre.',
      'Son article 1ᵉʳ garantit la liberté de conscience et le libre exercice des cultes ; l’article 2 met fin au financement public.',
      'Les églises bâties avant 1905 restent propriété de l’État et des communes, laissées gratuitement aux fidèles.',
      'Les inventaires de 1906 provoquent des résistances et deux morts ; le gouvernement les suspend.',
      'L’Alsace et la Moselle, allemandes en 1905, vivent aujourd’hui encore sous le régime concordataire.',
    ],
    causes: [
      'Un Concordat vieux de plus d’un siècle, où l’État nommait les évêques et payait les curés : chaque nomination devenait une affaire politique.',
      'La rupture des relations diplomatiques avec le Saint-Siège en juillet 1904 : le Concordat ne fonctionnait plus de fait.',
      'La querelle scolaire ouverte par les lois Ferry, qui oppose depuis vingt ans deux conceptions de l’éducation des enfants.',
      'Les lois de 1901 et 1904 sur les congrégations, qui ferment des milliers d’écoles religieuses et laissent une profonde amertume chez les catholiques.',
      'L’affaire des Fiches de 1904, où des officiers avaient été fichés selon leur pratique religieuse : un scandale qui discrédite l’anticléricalisme de combat.',
      'Une majorité parlementaire décidée à trancher, et un rapporteur, Aristide Briand, qui cherche un texte acceptable par les croyants plutôt qu’une loi de guerre.',
    ],
    recit: [
      {
        titre: 'Cent ans de Concordat',
        texte:
          'Le **Concordat**, signé en 1801 entre **Bonaparte** et le pape **Pie VII**, avait refermé la déchirure religieuse de la Révolution. Il organisait un système simple : l’État reconnaît quatre **cultes** — catholique, luthérien, réformé, et israélite à partir de 1808 —, il nomme les évêques avec l’accord de Rome, il **paie** les évêques, les curés et les pasteurs, et en échange il a son mot à dire dans les affaires de l’Église. Pendant un siècle, ce système a donné la paix, et aussi des frictions continuelles : un gouvernement peut retenir le traitement d’un curé qui lui déplaît, un évêque peut être nommé pour des raisons politiques. Au tournant du siècle, les deux parties y trouvent de moins en moins leur compte, et en **1904** la France rompt ses relations diplomatiques avec le Saint-Siège. Le Concordat est mort avant d’être abrogé.',
      },
      {
        titre: 'Ce que la loi dit',
        texte:
          'Le rapporteur est **Aristide Briand**, jeune député socialiste qui va passer un an à négocier article par article pour que le texte soit tenable. La loi, votée le 3 juillet par la Chambre et adoptée le **9 décembre 1905**, tient en deux principes. L’**article 1ᵉʳ** : la République **assure la liberté de conscience** et **garantit le libre exercice des cultes**. L’**article 2** : elle ne reconnaît, ne salarie ni ne subventionne aucun culte. Le reste organise le passage : les **édifices construits avant 1905** — cathédrales, églises, temples, synagogues — restent propriété de l’État ou des communes, qui les **entretiennent** et les laissent **gratuitement** à la disposition des fidèles ; des **aumôneries** sont prévues dans les lycées, les hôpitaux, les prisons et l’armée, là où l’on ne peut pas sortir pour pratiquer ; et les biens des établissements du culte doivent passer à des **associations cultuelles**.',
      },
      {
        titre: 'L’hiver des inventaires',
        texte:
          'Pour transférer ces biens, il faut d’abord les **inventorier**. Des agents de l’administration se présentent donc, en janvier et février **1906**, pour compter les calices, les chandeliers et les tableaux des églises. Beaucoup de fidèles y voient une main de l’État posée sur le lieu le plus intime de leur vie, et parfois une menace sur le **tabernacle** lui-même. Dans l’Ouest, le Massif central, le Nord, les Pyrénées, les paroisses barricadent les portes avec des poutres et des charrettes, sonnent le tocsin, chantent à l’intérieur ; il faut enfoncer des portes à la hache. Le **6 mars 1906**, deux hommes sont tués, l’un à **Boeschepe** dans le Nord, l’autre dans l’Aude. **Clemenceau**, ministre de l’Intérieur, arrête les inventaires : aucun objet ne vaut une vie. Le gouvernement Rouvier tombe dans la foulée.',
      },
      {
        titre: 'Rome dit non, puis la paix s’installe',
        texte:
          'Le **11 février 1906**, **Pie X** condamne la loi par l’encyclique *Vehementer nos*, puis interdit en août aux catholiques français de constituer des **associations cultuelles** : il craint que des laïcs élus se retrouvent à administrer les biens de l’Église, hors de la hiérarchie. Le blocage est complet — les églises risquent de rester sans occupant légal. L’État, plutôt que de les fermer, vote en **1907** une loi qui laisse les bâtiments ouverts au culte, sans autre formalité qu’une déclaration : dans les faits, le curé reste chez lui. La **Grande Guerre** fait le reste : vingt-cinq mille prêtres et religieux sont mobilisés, plusieurs milliers meurent au front, et l’union sacrée efface les rancunes. Les relations avec le Saint-Siège reprennent en **1921** ; en **1924**, **Pie XI** accepte des **associations diocésaines**, présidées par l’évêque. La querelle est close.',
      },
      {
        titre: 'Ce que la laïcité veut dire',
        texte:
          'La loi de 1905 n’est ni une loi contre les religions, ni une loi de neutralité polie : c’est un partage de compétences. L’État ne dit pas ce qu’il faut croire, ne finance aucun culte, ne nomme aucun ministre ; en retour, il garantit à chacun le droit de croire, de pratiquer, de changer de religion ou de n’en avoir aucune, et il protège les cérémonies contre ceux qui voudraient les troubler. Elle a ses exceptions, assumées : l’**Alsace et la Moselle**, allemandes en 1905, n’ont jamais été concernées et vivent toujours sous le régime concordataire ; la loi **Debré** de 1959 permet à l’État de financer des écoles privées sous contrat, qui suivent les programmes publics. Plus d’un siècle après, le texte de 1905 est toujours en vigueur, et la **liberté de conscience** qu’il garantit figure dans les Constitutions de 1946 et de 1958.',
      },
    ],
    consequences: [
      'Le Concordat de 1801 prend fin : l’État ne nomme plus et ne paie plus les ministres des cultes.',
      'Les édifices religieux antérieurs à 1905 deviennent propriété publique, entretenus par l’État ou la commune et laissés gratuitement aux fidèles.',
      'Une crise de trois ans — inventaires, condamnation romaine, refus des associations cultuelles — suivie d’un apaisement durable en 1907, 1921 et 1924.',
      'Les religions vivent désormais des dons de leurs fidèles, et s’organisent librement sans tutelle de l’État.',
      'La liberté de conscience devient un principe constitutionnel, repris dans les Constitutions de 1946 et de 1958.',
      'L’Alsace et la Moselle, alors allemandes, restent sous régime concordataire aujourd’hui encore.',
    ],
    chiffres: [
      { valeur: '104 ans', quoi: 'de Concordat, de 1801 à 1905' },
      { valeur: '4', quoi: 'cultes reconnus et salariés par l’État avant 1905' },
      { valeur: '341 contre 233', quoi: 'le vote de la loi à la Chambre, le 3 juillet 1905' },
      { valeur: '2', quoi: 'morts pendant les inventaires de mars 1906' },
    ],
    chrono: [
      { date: '15 juillet 1801', fait: 'Concordat entre Bonaparte et Pie VII.' },
      { date: '1ᵉʳ juillet 1901', fait: 'Loi sur les associations : les congrégations sous autorisation.' },
      { date: '30 juillet 1904', fait: 'Rupture des relations avec le Saint-Siège.' },
      { date: '3 juillet 1905', fait: 'La Chambre vote la séparation par 341 voix contre 233.' },
      { date: '9 décembre 1905', fait: 'Adoption définitive de la loi de séparation.' },
      { date: 'janvier-mars 1906', fait: 'Les inventaires et les résistances dans les paroisses.' },
      { date: '11 février 1906', fait: 'Pie X condamne la loi par l’encyclique Vehementer nos.' },
      { date: '6 mars 1906', fait: 'Deux morts ; Clemenceau suspend les inventaires.' },
      { date: '2 janvier 1907', fait: 'Une loi laisse les églises ouvertes au culte.' },
      { date: '1921', fait: 'Reprise des relations diplomatiques avec le Saint-Siège.' },
      { date: '1924', fait: 'Pie XI accepte les associations diocésaines.' },
    ],
    leSaisTu:
      'Pendant l’hiver des inventaires, certaines paroisses ont barricadé leur porte avec des charrettes, des poutres, parfois des ruches d’abeilles. Dans les Pyrénées, on raconte que des montreurs d’ours sont venus accueillir les agents. Les récits de ces journées ont longtemps été racontés dans les villages comme des épisodes de veillée.',
    aRetenir: [
      'La loi de séparation des Églises et de l’État est adoptée le 9 décembre 1905, sur le rapport d’Aristide Briand.',
      'Son article 1ᵉʳ garantit la liberté de conscience et le libre exercice des cultes.',
      'Son article 2 dispose que la République ne reconnaît, ne salarie ni ne subventionne aucun culte : c’est la fin du Concordat de 1801.',
      'Les inventaires de 1906 provoquent des résistances ; le pape Pie X condamne la loi la même année.',
      'L’apaisement s’installe entre 1907 et 1924 ; la loi est toujours en vigueur aujourd’hui.',
      'L’Alsace et la Moselle, allemandes en 1905, restent sous régime concordataire.',
    ],
    mots: [
      {
        mot: 'Concordat',
        sens: 'Accord entre un État et le Saint-Siège organisant la vie de l’Église catholique dans ce pays.',
      },
      {
        mot: 'Laïcité',
        sens: 'Séparation de l’État et des religions : l’État ne finance ni ne dirige aucun culte, et garantit la liberté de croire.',
      },
      {
        mot: 'Culte reconnu',
        sens: 'Religion dont l’État nommait et payait les ministres avant 1905 : catholique, luthérien, réformé, israélite.',
      },
      {
        mot: 'Association cultuelle',
        sens: 'Association chargée par la loi de 1905 d’administrer les biens d’une religion à la place de l’État.',
      },
      {
        mot: 'Encyclique',
        sens: 'Lettre solennelle adressée par le pape à l’ensemble de l’Église.',
      },
    ],
    lies: [
      'affaire-dreyfus',
      'lois-jules-ferry',
      'concordat-de-1801',
      'leon-gambetta',
      'jean-jaures',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Troisième République',
    tags: [
      'laïcité',
      'séparation',
      '1905',
      'Concordat',
      'Briand',
      'Pie X',
      'inventaires',
      'liberté de conscience',
      'cultes',
      'Clemenceau',
      'IIIe République',
    ],
  },
]
