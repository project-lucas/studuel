// -----------------------------------------------------------------------------
// RÉVOLUTION — POURQUOI. Les trois fiches qui expliquent ce que 1789 avait
// derrière lui : les finances ruinées, le prix du pain, et la journée qui a
// fait basculer le reste.
//
// CE LOT EST LE MODÈLE DU VOLET « ÉVÉNEMENTS ». Trois colonnes, toujours les
// mêmes, parce que c'est le raisonnement que l'école demande et que l'élève ne
// produit pas tout seul : POURQUOI (`causes`) → CE QUI SE PASSE (`recit`) →
// CE QUE ÇA CHANGE (`consequences`).
//
// La Révolution est le gros morceau de l'encyclopédie, et elle est traitée
// comme tel : ni légende dorée, ni légende noire — les MÉCANISMES. Un roi qui
// veut réformer et qu'on empêche, une guerre d'Amérique gagnée au dehors et
// perdue au budget, des marchands qui font le prix du pain, une bourgeoisie
// d'avocats qui prend la place de la noblesse, et l'argent qui remplace la
// naissance comme source du pouvoir. Cf. `docs/encyclopedie.md`, § 3.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_REVOLUTION_CAUSES: Evenement[] = [
  {
    id: 'crise-financiere-de-la-monarchie',
    volet: 'evenements',
    nom: 'La faillite du royaume',
    date: '1776 – 1788',
    tri: 1788,
    fin: 1788,
    periode: 'revolution',
    emoji: '💸',
    lieu: 'Versailles et le royaume de France',
    accroche:
      'La France gagne la guerre d’Amérique et y perd son budget : en 1788, la dette mange la moitié des recettes et le roi ne peut plus payer.',
    citations: [
      {
        texte: 'Point de banqueroute, point d’augmentation d’impôts, point d’emprunts.',
        qui: 'Turgot',
        contexte:
          'Lettre au roi Louis XVI en prenant ses fonctions de contrôleur général des finances, 24 août 1774.',
        sens:
          'Le programme était tenable mais exigeait de supprimer les privilèges fiscaux. Deux ans plus tard, la cour obtenait son renvoi.',
      },
      {
        texte: 'Sire, l’État est en péril, et il n’y a plus de temps à perdre.',
        qui: 'Calonne',
        contexte:
          'Devant l’assemblée des notables, février 1787, en dévoilant l’ampleur du déficit.',
      },
      {
        texte: 'C’est une guerre qui nous coûtera cher, mais qui vaut bien ce prix.',
        qui: 'Vergennes',
        contexte: 'Sur l’entrée de la France dans la guerre d’indépendance américaine, 1778.',
        incertaine: true,
      },
    ],
    reperes: [
      'La guerre d’Amérique (1778-1783) coûte plus d’un milliard de livres, entièrement emprunté.',
      'En 1788, le service de la dette absorbe environ la moitié des recettes de l’État.',
      'La noblesse et le clergé, propriétaires du tiers des terres, ne paient presque pas d’impôt.',
      'Trois ministres réformateurs — Turgot, Necker, Calonne — sont renvoyés sous la pression de la cour.',
      'Le 8 août 1788, le roi convoque les États généraux : il n’a plus d’autre solution.',
    ],
    causes: [
      'Un système fiscal où ceux qui possèdent le plus — noblesse et clergé — sont exemptés de l’essentiel de l’impôt.',
      'Des guerres continuelles : après la guerre de Sept Ans, perdue, la guerre d’Amérique, gagnée mais financée uniquement par l’emprunt.',
      'Une cour de Versailles qui coûte environ 6 % du budget et défend bec et ongles ses pensions.',
      'Des parlements (cours de justice tenues par des nobles) qui bloquent tout impôt nouveau au nom des « libertés » — c’est-à-dire de leurs privilèges.',
      'Un roi qui nomme de vrais réformateurs, puis cède et les renvoie dès que sa cour et son entourage s’y opposent.',
      'Les mauvaises récoltes de 1788, qui effondrent les rentrées fiscales au pire moment.',
    ],
    recit: [
      {
        titre: 'Trois ministres, trois renvois',
        texte:
          'Louis XVI monte sur le trône en 1774 avec la volonté de réformer, et il choisit bien. **Turgot** supprime les corvées, libère le commerce des grains, veut faire payer les privilégiés : la cour, les parlements et la reine obtiennent son renvoi en **1776**. **Necker**, banquier genevois, finance la guerre d’Amérique par l’emprunt et publie en 1781 le premier budget public de l’histoire de France — il y cache le coût réel de la guerre et se fait pourtant renvoyer la même année. **Calonne** ose dire la vérité en **1787** devant l’assemblée des notables : le déficit atteint 112 millions de livres, il faut un impôt payé par tous. Les notables refusent, Calonne est renvoyé. Trois fois le même scénario : le roi veut, l’entourage résiste, le roi cède. Ce n’est pas une histoire de sottise royale, c’est **un système bloqué par ceux qui en profitent**.',
      },
      {
        titre: 'La guerre d’Amérique, gagnée et ruineuse',
        texte:
          'En **1778**, la France s’engage aux côtés des **insurgents** américains pour prendre sa revanche sur l’Angleterre. Militairement, c’est un succès complet : la flotte de Grasse verrouille la baie de Chesapeake, **Rochambeau** et **La Fayette** enferment l’armée anglaise à **Yorktown** (1781), le traité de Versailles (1783) consacre l’indépendance des États-Unis. Financièrement, c’est un désastre : **plus d’un milliard de livres**, financé sans un sou d’impôt nouveau, uniquement par des emprunts à intérêt élevé. En 1788, rembourser cette dette coûte à l’État **environ la moitié de ce qu’il encaisse**. Et les officiers rentrent d’Amérique la tête pleine d’une idée neuve : un peuple peut se donner une constitution et élire ceux qui le gouvernent. La France a payé, très cher, pour importer sa propre Révolution.',
      },
      {
        titre: 'Payer l’impôt quand on n’a rien',
        texte:
          'Le poids retombe sur le **Tiers état**, c’est-à-dire 97 % de la population. Le paysan paie la **taille** au roi, la **dîme** à l’Église, les **droits seigneuriaux** au seigneur, la **gabelle** sur le sel, et les péages à chaque pont. La noblesse et le clergé, qui possèdent un tiers des terres, sont exemptés de la taille ; le clergé vote lui-même un « don gratuit » dont il fixe le montant. Pendant ce temps, une partie du Tiers état s’est enrichie : **négociants, armateurs, médecins, notaires et surtout avocats** — instruits, lecteurs de Montesquieu et de Rousseau, propriétaires — se heurtent à une société où la **naissance** décide de tout et où les grands emplois de l’armée, de l’Église et de l’État leur sont fermés. C’est là que se forme la force qui fera 1789 : des gens qui ont l’argent et le savoir, mais pas le pouvoir.',
      },
      {
        titre: 'Le roi rend les armes',
        texte:
          'L’été **1788** achève tout : la grêle du 13 juillet détruit les récoltes, l’hiver qui suit est le plus froid du siècle, les impôts ne rentrent plus. En août, le Trésor royal est vide au point que l’État **suspend ses paiements**. Le **8 août 1788**, Louis XVI convoque les **États généraux** pour le 5 mai 1789 — une assemblée des trois ordres que la monarchie n’avait plus réunie depuis **1614**, soit cent soixante-quinze ans. Il rappelle Necker, seul nom capable de rassurer les prêteurs. En convoquant les États généraux, le roi ne cherche pas une révolution : il cherche de l’argent. Il vient d’ouvrir la porte à la fin de l’Ancien Régime.',
      },
    ],
    consequences: [
      'Convocation des États généraux pour mai 1789, première depuis 1614.',
      'Rédaction dans tout le royaume des cahiers de doléances : la France écrit ses plaintes et découvre qu’elles se ressemblent.',
      'La question de l’impôt devient une question politique : qui a le droit de le consentir ?',
      'La bourgeoisie instruite du Tiers état apparaît comme la seule force capable de proposer un autre système.',
      'La dette ne disparaîtra pas : elle conduira à la vente des biens du clergé (1789) puis aux assignats.',
    ],
    chiffres: [
      { valeur: '1 milliard', quoi: 'de livres : le coût de la guerre d’Amérique' },
      { valeur: '50 %', quoi: 'des recettes de l’État consacrées à la dette en 1788' },
      { valeur: '175 ans', quoi: 'sans États généraux avant 1789' },
      { valeur: '97 %', quoi: 'de la population dans le Tiers état' },
    ],
    chrono: [
      { date: '1774', fait: 'Louis XVI appelle Turgot aux finances.' },
      { date: '1776', fait: 'Renvoi de Turgot sous la pression de la cour.' },
      { date: '1778', fait: 'La France entre dans la guerre d’indépendance américaine.' },
      { date: '1781', fait: 'Victoire de Yorktown ; Necker publie son Compte rendu au roi.' },
      { date: '1783', fait: 'Traité de Versailles : les États-Unis sont indépendants.' },
      { date: '1787', fait: 'Calonne révèle le déficit ; les notables refusent l’impôt général.' },
      { date: '13 juillet 1788', fait: 'La grêle ravage les récoltes du Bassin parisien.' },
      { date: '8 août 1788', fait: 'Convocation des États généraux pour le 5 mai 1789.' },
    ],
    leSaisTu:
      'Le budget publié par Necker en 1781 — le *Compte rendu au Roi* — est le premier document financier de l’État français vendu en librairie. Il s’en écoule 100 000 exemplaires en quelques semaines. Pour la première fois, des sujets ordinaires lisent les comptes de leur roi… et s’aperçoivent qu’ils peuvent en discuter.',
    aRetenir: [
      'La guerre d’Amérique (1778-1783) coûte plus d’un milliard de livres et ruine les finances royales.',
      'En 1788, la dette absorbe environ la moitié des recettes de l’État.',
      'Turgot, Necker et Calonne proposent de faire payer l’impôt aux privilégiés : tous trois sont renvoyés.',
      'Le 8 août 1788, Louis XVI convoque les États généraux, réunis pour la première fois depuis 1614.',
    ],
    mots: [
      {
        mot: 'Privilège',
        sens: 'Droit particulier attaché à un ordre, une ville ou un métier — souvent une exemption d’impôt.',
      },
      {
        mot: 'Taille',
        sens: 'Principal impôt direct de l’Ancien Régime, payé par le Tiers état ; la noblesse en est exemptée.',
      },
      {
        mot: 'Parlement',
        sens: 'Sous l’Ancien Régime, cour de justice tenue par des nobles, qui enregistre les lois et peut les bloquer.',
      },
      {
        mot: 'Banqueroute',
        sens: 'Refus d’un État de rembourser ses dettes.',
      },
    ],
    lies: [
      'louis-xvi',
      'necker',
      'turgot',
      'guerre-d-independance-americaine',
      'etats-generaux-de-1789',
      'crise-du-pain-et-des-grains',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'dette',
      'déficit',
      'Turgot',
      'Necker',
      'Calonne',
      'privilèges',
      'Ancien Régime',
      'guerre d’Amérique',
      'États généraux',
      'impôt',
    ],
  },
  {
    id: 'crise-du-pain-et-des-grains',
    volet: 'evenements',
    nom: 'Le prix du pain',
    date: '1788 – 1789',
    tri: 1789,
    fin: 1789,
    periode: 'revolution',
    emoji: '🍞',
    lieu: 'Paris, les halles et les campagnes',
    accroche:
      'Le pain, c’est la moitié du salaire d’un ouvrier. En juillet 1789, il en coûte les trois quarts : c’est la faim qui met le peuple dans la rue.',
    citations: [
      {
        texte: 'Du pain !',
        qui: 'Les femmes des halles',
        contexte: 'Cri de la marche sur Versailles, 5 octobre 1789.',
        sens:
          'Le mot d’ordre de toutes les journées révolutionnaires populaires : avant la liberté, la subsistance.',
      },
      {
        texte: 'Nous ramenons le boulanger, la boulangère et le petit mitron.',
        qui: 'Le cortège ramenant la famille royale à Paris',
        contexte: '6 octobre 1789, sur la route de Versailles à Paris.',
        sens:
          'Le roi, la reine et le dauphin sont ramenés à Paris comme les garants du pain quotidien : c’est ce qu’on attend d’un roi.',
      },
      {
        texte: 'Qu’ils mangent de la brioche.',
        qui: 'Attribué à Marie-Antoinette',
        contexte:
          'Phrase répandue par les pamphlets, que Rousseau écrivait déjà en 1765, quand la future reine avait neuf ans et vivait à Vienne.',
        sens:
          'Elle ne l’a jamais dite. Elle a pourtant fait plus de mal à la reine que bien des actes réels : la rumeur est une arme politique.',
        incertaine: true,
      },
    ],
    reperes: [
      'Un ouvrier gagne environ 20 à 30 sous par jour ; le pain de 4 livres en vaut 8 à 9 en temps normal.',
      'Le 14 juillet 1789, il atteint 14 sous et demi — le prix le plus haut du siècle.',
      'La grêle du 13 juillet 1788 détruit les récoltes ; l’hiver 1788-1789 est le plus froid du siècle.',
      'La liberté du commerce des grains laisse marchands et gros fermiers fixer les prix et stocker.',
      'De là naissent les émeutes de subsistance, la Grande Peur et la marche des femmes sur Versailles.',
    ],
    causes: [
      'Deux catastrophes climatiques d’affilée : la grêle de juillet 1788, puis un hiver où la Seine gèle et bloque les moulins.',
      'La libéralisation du commerce des grains : l’État renonce à fixer le prix du pain, le marché décide seul.',
      'Des marchands et de gros fermiers qui achètent la récolte sur pied, stockent et revendent quand le prix a doublé.',
      'Un système de transport lent : un blé abondant en Picardie n’arrive pas à Paris avant plusieurs semaines.',
      'Une population qui consacre déjà la moitié de ses revenus au seul pain : la moindre hausse est une catastrophe.',
      'La certitude, dans le peuple, qu’il existe un « pacte de famine » — un complot pour affamer Paris.',
    ],
    recit: [
      {
        titre: 'Ce que mange une famille',
        texte:
          'Au XVIIIᵉ siècle, le pain n’est pas un aliment parmi d’autres : c’est **l’aliment**. Un adulte en consomme entre 500 g et un kilo par jour, et il représente **la moitié du budget** d’une famille d’ouvriers en temps normal. Un compagnon parisien gagne 20 à 30 sous par jour, un manœuvre 15 ; le pain de quatre livres (environ 2 kg) coûte **8 à 9 sous**. Quand le prix monte à 14 sous et demi — le prix atteint le **14 juillet 1789** — il ne reste rien pour le loyer, le bois, les vêtements. La hausse du pain n’appauvrit pas : elle affame. Et c’est mathématique — c’est exactement au moment où le pain est le plus cher que Paris prend la Bastille.',
      },
      {
        titre: 'La liberté du commerce et ceux qui en profitent',
        texte:
          'Pendant des siècles, le roi avait **taxé le pain** : les officiers municipaux fixaient le prix, surveillaient les halles, interdisaient de stocker. Les économistes des Lumières, les **physiocrates**, obtiennent de Turgot en 1774 la **liberté du commerce des grains** : le marché, disent-ils, fera circuler le blé mieux que les règlements. La théorie n’est pas absurde ; l’application arrive au pire moment. Dans une année de mauvaise récolte, la liberté profite d’abord à ceux qui ont de quoi attendre : gros fermiers, meuniers, **négociants en grains**. On achète la récolte sur pied, on entrepose, on ne relâche le blé qu’au plus haut. Ce n’est pas un complot, c’est un calcul — mais pour celui qui fait la queue à quatre heures du matin devant la boulangerie, la différence est invisible. Le peuple appelle ces hommes les **accapareurs**, et croit à un « pacte de famine ».',
      },
      {
        titre: 'La colère devient politique',
        texte:
          'Dès le printemps **1789**, les émeutes de subsistance se multiplient : on arrête les convois de blé sur les routes, on impose de force le prix « juste » sur les marchés — ce qu’on appelle la **taxation populaire**. Le 28 avril, l’émeute Réveillon à Paris fait des dizaines de morts. En juillet, la peur des « brigands » payés par les aristocrates pour couper les blés encore verts se répand dans toutes les campagnes : c’est la **Grande Peur**, qui arme les paysans et fait brûler les registres seigneuriaux. Le **5 octobre 1789**, ce sont **les femmes des halles** — celles qui achètent le pain chaque matin — qui partent à pied sur Versailles, six heures de marche sous la pluie, pour ramener le roi à Paris. La revendication est alimentaire ; la conséquence est politique : le roi devient prisonnier de sa capitale.',
      },
      {
        titre: 'Ce que la faim a changé',
        texte:
          'La Révolution est souvent racontée par ses idées — et elles comptent. Mais sans la crise frumentaire, les idées seraient restées dans les livres : c’est **la faim qui a mis le nombre dans la rue**, et le nombre qui a fait céder le pouvoir. Les assemblées révolutionnaires l’ont compris et ont passé le reste de la décennie à courir derrière le prix du pain : **loi du maximum général** en 1793 pour bloquer les prix, réquisitions, guerre aux accapareurs, puis retour à la liberté en 1794 et nouvelle flambée. Les émeutes de germinal et de prairial an III (1795) éclatent encore au cri de « du pain et la Constitution de 93 ». Aucun régime, sous la Révolution, n’a tenu longtemps sans nourrir Paris.',
      },
    ],
    consequences: [
      'Les émeutes de subsistance du printemps 1789 mobilisent le peuple avant tout débat politique.',
      'La Grande Peur de juillet 1789 arme les campagnes et précipite l’abolition des privilèges le 4 août.',
      'La marche des femmes sur Versailles (5-6 octobre 1789) ramène le roi et l’Assemblée à Paris.',
      'La question des subsistances domine toute la Révolution : maximum des prix en 1793, émeutes de 1795.',
      'La figure de l’« accapareur » devient l’ennemi désigné du peuple, jusque sous la Terreur.',
    ],
    chiffres: [
      { valeur: '50 %', quoi: 'du budget d’une famille consacré au pain' },
      { valeur: '14,5 sous', quoi: 'le pain de 4 livres, le 14 juillet 1789' },
      { valeur: '20 à 30 sous', quoi: 'le salaire journalier d’un ouvrier parisien' },
      { valeur: '−29 °C', quoi: 'relevés pendant l’hiver 1788-1789' },
    ],
    chrono: [
      { date: '1774', fait: 'Turgot libère le commerce des grains.' },
      { date: '13 juillet 1788', fait: 'La grêle détruit les récoltes du Bassin parisien.' },
      { date: 'hiver 1788-1789', fait: 'La Seine gèle, les moulins s’arrêtent.' },
      { date: '28 avril 1789', fait: 'Émeute Réveillon à Paris.' },
      { date: '14 juillet 1789', fait: 'Le pain au plus haut du siècle, le jour de la Bastille.' },
      { date: 'juillet-août 1789', fait: 'La Grande Peur soulève les campagnes.' },
      { date: '5 octobre 1789', fait: 'Les femmes des halles marchent sur Versailles.' },
      { date: '29 septembre 1793', fait: 'Loi du maximum général sur les prix.' },
    ],
    leSaisTu:
      'Les boulangers parisiens étaient tenus de vendre jusqu’à épuisement de leur fournée : en cas de queue, la municipalité envoyait un commissaire pour éviter l’émeute. En 1789, certains ouvraient à 3 heures du matin et distribuaient des jetons numérotés — l’ancêtre du ticket de file d’attente, inventé par la faim.',
    aRetenir: [
      'Le pain représente environ la moitié du budget d’une famille populaire avant 1789.',
      'La grêle de juillet 1788 et l’hiver 1788-1789 provoquent une flambée du prix du pain.',
      'Le 14 juillet 1789, le pain atteint son prix le plus élevé du siècle.',
      'La liberté du commerce des grains permet aux marchands de stocker et de spéculer : on les appelle les accapareurs.',
      'La faim déclenche les émeutes, la Grande Peur et la marche des femmes sur Versailles.',
    ],
    mots: [
      {
        mot: 'Accapareur',
        sens: 'Marchand accusé de stocker le grain pour faire monter les prix.',
      },
      {
        mot: 'Physiocrates',
        sens: 'Économistes du XVIIIᵉ siècle pour qui la richesse vient de la terre et le commerce doit être libre.',
      },
      {
        mot: 'Taxation populaire',
        sens: 'Vente forcée par la foule, au prix qu’elle juge juste, des grains saisis sur un marché.',
      },
      {
        mot: 'Émeute frumentaire',
        sens: 'Soulèvement provoqué par le manque ou le prix du blé (du latin *frumentum*, le blé).',
      },
    ],
    lies: [
      'prise-de-la-bastille',
      'la-grande-peur',
      'marche-des-femmes-sur-versailles',
      'crise-financiere-de-la-monarchie',
      'marie-antoinette',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'pain',
      'famine',
      'accapareurs',
      'blé',
      'grains',
      'spéculation',
      'émeute',
      'halles',
      'subsistances',
      'maximum',
    ],
  },
  {
    id: 'prise-de-la-bastille',
    volet: 'evenements',
    nom: 'La prise de la Bastille',
    date: '14 juillet 1789',
    tri: 1789,
    periode: 'revolution',
    emoji: '🏰',
    lieu: 'Paris, faubourg Saint-Antoine',
    accroche:
      'Paris prend d’assaut une forteresse pour y chercher de la poudre — et fait tomber, en quatre heures, le symbole du pouvoir absolu.',
    citations: [
      {
        texte: '— C’est une révolte ? — Non, Sire, c’est une révolution.',
        qui: 'Le duc de La Rochefoucauld-Liancourt à Louis XVI',
        contexte: 'Au réveil du roi à Versailles, le 15 juillet 1789 au matin.',
        sens:
          'Une révolte se réprime, une révolution change le régime. En une réplique, le duc dit au roi que le pouvoir a changé de mains.',
      },
      {
        texte: 'Aux armes ! Aux armes ! Prenons tous une cocarde verte, la couleur de l’espérance !',
        qui: 'Camille Desmoulins',
        contexte: 'Debout sur une table du Palais-Royal, le 12 juillet 1789, après le renvoi de Necker.',
      },
      {
        texte: 'Rien.',
        qui: 'Louis XVI',
        contexte:
          'Son journal de chasse à la date du 14 juillet 1789 : il y notait ses prises, et n’avait rien tué ce jour-là.',
        sens:
          'Ce n’est pas de l’indifférence au pays — c’est un carnet de chasse. La phrase a pourtant fait le tour des manuels comme preuve d’aveuglement.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le 11 juillet, le roi renvoie Necker : Paris y voit le signal d’un coup de force.',
      'Le 14 au matin, la foule prend 30 000 fusils aux Invalides — mais sans poudre.',
      'La poudre est à la Bastille : c’est pour elle que la forteresse est attaquée.',
      'La garnison compte 82 invalides et 32 Suisses ; le gouverneur de Launay capitule vers 17 h.',
      'On y libère sept prisonniers : quatre faussaires, deux fous, un noble enfermé à la demande de sa famille.',
      'La Bastille est démolie dans les mois qui suivent ; ses pierres sont vendues en souvenirs.',
    ],
    causes: [
      'La flambée du prix du pain, au plus haut du siècle ce jour-là, qui tient Paris dans la faim depuis des mois.',
      'Le renvoi de Necker le 11 juillet, seul ministre en qui le peuple ait confiance.',
      'La concentration de 20 000 à 30 000 soldats, en grande partie étrangers, autour de Paris et de Versailles.',
      'La peur d’un coup de force contre l’Assemblée nationale, qui s’est proclamée constituante le 9 juillet.',
      'Le besoin immédiat de poudre pour les fusils pris aux Invalides le matin même.',
    ],
    recit: [
      {
        titre: 'Trois jours qui chauffent Paris',
        texte:
          'Le **11 juillet 1789**, Louis XVI renvoie **Necker**. La nouvelle atteint Paris le 12 : au **Palais-Royal**, **Camille Desmoulins** monte sur une table et appelle aux armes. La ville est déjà à cran — le pain est au plus cher du siècle, et des régiments étrangers campent au Champ-de-Mars. Les électeurs parisiens forment un comité permanent à l’Hôtel de Ville et lèvent une **milice bourgeoise** de quarante-huit mille hommes, la future **garde nationale**. Le 13, les barrières d’octroi brûlent, le couvent Saint-Lazare est pillé pour son grain. Il manque une chose : des armes.',
      },
      {
        titre: 'Le matin des Invalides',
        texte:
          'Le **14 juillet au matin**, une foule énorme se porte aux **Invalides** et y enlève environ **30 000 fusils** et une dizaine de canons, sans presque rencontrer de résistance : les soldats refusent de tirer. Mais les fusils sont inutiles sans **poudre**. Or la poudre a été transférée quelques jours plus tôt dans la forteresse qui domine le faubourg Saint-Antoine : la **Bastille**. C’est cela, et rien d’autre, qui met la foule devant ses murs à dix heures du matin. Personne, ce jour-là, ne vient libérer des prisonniers — il n’y en a que sept, et nul ne le sait.',
      },
      {
        titre: 'Quatre heures devant les murs',
        texte:
          'La Bastille est une masse de huit tours, trente mètres de haut, un fossé de vingt-cinq mètres de large. Elle est défendue par **82 invalides** et **32 Suisses**, commandés par le gouverneur **de Launay**. Deux délégations sont reçues le matin et réclament la poudre ; elles n’obtiennent rien. Vers 13 h 30, des assaillants passent dans la première cour et abattent à la hache les chaînes du pont-levis : les coups partent. Le tournant vient vers 15 h avec l’arrivée de **gardes-françaises** passés du côté du peuple, avec cinq canons pointés sur la porte. De Launay menace de faire sauter les trente mille livres de poudre du magasin — ce qui emporterait le quartier — puis **capitule vers 17 h**, contre la promesse d’une vie sauve. La promesse ne sera pas tenue : entraîné vers l’Hôtel de Ville, il est massacré en chemin, et sa tête promenée au bout d’une pique. Le combat a fait **98 morts** côté assaillants, un seul dans la garnison.',
      },
      {
        titre: 'Pourquoi cette journée compte plus que la forteresse',
        texte:
          'Militairement, l’affaire est mince : une prison à moitié vide, promise à la démolition depuis des années. **Politiquement, tout est changé.** Le roi, apprenant la nouvelle le 15, renonce à employer l’armée, rappelle **Necker**, et vient le 17 juillet à Paris coiffer la **cocarde tricolore** — le blanc du roi entre le bleu et le rouge de la ville. L’Assemblée nationale est sauvée ; Paris s’est donné un maire (**Bailly**) et une garde nationale (**La Fayette**). La Bastille, prison d’État où l’on entrait sur simple **lettre de cachet**, était le symbole parfait du pouvoir qui enferme sans juger : sa chute vaut déclaration. Un entrepreneur, **Palloy**, la démolit et taille dans ses pierres des maquettes envoyées à chaque district de France. La fête du 14 juillet est instituée en **1880** — et c’est, plus précisément, la fête de la **Fédération** du 14 juillet 1790 qu’elle commémore autant que l’assaut.',
      },
    ],
    consequences: [
      'Le roi renonce à la force, rappelle Necker et vient arborer la cocarde tricolore à Paris le 17 juillet.',
      'Paris se donne une municipalité (Bailly, maire) et une garde nationale (La Fayette).',
      'La nouvelle déclenche dans les campagnes la Grande Peur et, avec elle, la nuit du 4 août.',
      'L’Assemblée nationale constituante peut travailler : la Déclaration des droits de l’homme suit le 26 août.',
      'Le 14 juillet devient la fête nationale française par la loi du 6 juillet 1880.',
    ],
    chiffres: [
      { valeur: '98', quoi: 'assaillants tués' },
      { valeur: '7', quoi: 'prisonniers libérés' },
      { valeur: '30 000', quoi: 'fusils pris aux Invalides le matin même' },
      { valeur: '114', quoi: 'défenseurs dans la forteresse' },
    ],
    chrono: [
      { date: '11 juillet 1789', fait: 'Renvoi de Necker.' },
      { date: '12 juillet 1789', fait: 'Desmoulins appelle aux armes au Palais-Royal.' },
      { date: '13 juillet 1789', fait: 'Formation de la milice bourgeoise à l’Hôtel de Ville.' },
      { date: '14 juillet, matin', fait: 'Prise de 30 000 fusils aux Invalides.' },
      { date: '14 juillet, 13 h 30', fait: 'Les chaînes du premier pont-levis sont abattues.' },
      { date: '14 juillet, 17 h', fait: 'Capitulation du gouverneur de Launay.' },
      { date: '17 juillet 1789', fait: 'Louis XVI à Paris, cocarde tricolore.' },
      { date: '6 juillet 1880', fait: 'Le 14 juillet devient fête nationale.' },
    ],
    leSaisTu:
      'Le vainqueur le plus improbable du 14 juillet est un horloger. Parmi les « vainqueurs de la Bastille » officiellement recensés — 954 hommes — on compte surtout des artisans du faubourg Saint-Antoine : ébénistes, serruriers, tailleurs, brasseurs. Les listes existent encore : la Révolution a commencé par des gens dont on connaît le métier.',
    aRetenir: [
      'Le 14 juillet 1789, les Parisiens prennent la Bastille pour s’emparer de la poudre nécessaire à leurs fusils.',
      'Le renvoi de Necker le 11 juillet et la présence de troupes autour de Paris ont déclenché l’insurrection.',
      'La forteresse ne détenait que sept prisonniers ; sa valeur est symbolique : c’est la prison des lettres de cachet.',
      'Le roi cède : il rappelle Necker et arbore la cocarde tricolore le 17 juillet.',
      'Le 14 juillet devient la fête nationale française en 1880.',
    ],
    mots: [
      {
        mot: 'Lettre de cachet',
        sens: 'Ordre signé du roi permettant d’emprisonner quelqu’un sans jugement ni durée fixée.',
      },
      {
        mot: 'Garde nationale',
        sens: 'Milice de citoyens armés créée en juillet 1789 pour maintenir l’ordre, commandée par La Fayette.',
      },
      {
        mot: 'Cocarde tricolore',
        sens: 'Insigne réunissant le bleu et le rouge de Paris au blanc du roi : le futur drapeau français.',
      },
    ],
    lies: [
      'crise-du-pain-et-des-grains',
      'crise-financiere-de-la-monarchie',
      'louis-xvi',
      'necker',
      'camille-desmoulins',
      'la-fayette',
      'la-grande-peur',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Bastille',
      '14 juillet',
      'Launay',
      'Invalides',
      'poudre',
      'cocarde',
      'fête nationale',
      'faubourg Saint-Antoine',
      'Desmoulins',
    ],
  },
]
