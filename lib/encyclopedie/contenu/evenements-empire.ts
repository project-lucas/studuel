// -----------------------------------------------------------------------------
// L'EMPIRE — de Brumaire à Vienne. Huit fiches pour la seconde moitié de la
// période `revolution` : comment un général de trente ans ramasse la République,
// ce qu'il fonde et qui tient encore, ce qu'il gagne, et ce qu'il perd.
//
// La fiche la plus importante du lot n'est pas une bataille : c'est le CODE
// CIVIL. Austerlitz se raconte, le Code se subit — c'est lui qui règle encore
// aujourd'hui le mariage, la propriété et l'héritage d'un élève français. Il est
// donc traité comme le guide l'exige : les deux côtés, factuellement. Ce qu'il
// affranchit (l'égalité devant la loi, la fin des privilèges de naissance, le
// mariage civil, le divorce) et ce qu'il enferme (l'incapacité juridique de la
// femme mariée, la puissance paternelle) — sans procès rétrospectif et sans
// silence non plus. Cf. `docs/encyclopedie.md`, § 3.
//
// Pie VII et l'Église sont traités avec le respect prévu au § 3 : le Concordat
// n'est pas raconté comme une ruse de Bonaparte subie par un pape naïf, mais
// comme une paix religieuse négociée par deux hommes qui n'y cherchaient pas la
// même chose — et qui a tenu cent quatre ans.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_EMPIRE: Evenement[] = [
  {
    id: 'coup-d-etat-du-18-brumaire',
    volet: 'evenements',
    nom: 'Le coup d’État du 18 Brumaire',
    date: '9 – 10 novembre 1799',
    tri: 1799,
    fin: 1799,
    periode: 'revolution',
    emoji: '🎖️',
    lieu: 'Paris et le château de Saint-Cloud',
    accroche:
      'Un général de trente ans renverse le Directoire en deux jours : la République qui avait jugé un roi se donne un maître, et l’applaudit.',
    citations: [
      {
        texte:
          'Citoyens, la Révolution est fixée aux principes qui l’ont commencée : elle est finie.',
        qui: 'Bonaparte, Premier consul',
        contexte:
          'Proclamation aux Français du 15 décembre 1799, en présentant la Constitution de l’an VIII.',
        sens:
          'Finie ne veut pas dire annulée : il garde l’égalité devant la loi et la vente des biens nationaux, mais il ferme le temps des assemblées.',
      },
      {
        texte: 'Hors la loi ! À bas le dictateur !',
        qui: 'Les députés du Conseil des Cinq-Cents',
        contexte:
          'À Saint-Cloud, le 19 Brumaire (10 novembre 1799), quand Bonaparte entre dans la salle de l’Orangerie.',
        sens:
          'Être mis « hors la loi » signifiait la mort sans jugement : c’est le mot qui a failli tout faire échouer.',
      },
      {
        texte:
          'Je jure que je percerai le sein de mon propre frère s’il attentait jamais à la liberté des Français.',
        qui: 'Lucien Bonaparte',
        contexte:
          'Devant les grenadiers hésitants, l’épée pointée sur la poitrine de son frère, Saint-Cloud, 10 novembre 1799.',
        sens:
          'Président des Cinq-Cents, Lucien sauve le coup d’État par un coup de théâtre : les soldats entrent et vident la salle.',
      },
      {
        texte: 'Qu’avez-vous fait de cette France que je vous avais laissée si brillante ?',
        qui: 'Attribué à Bonaparte, s’adressant aux directeurs',
        contexte:
          'Phrase prêtée à son retour d’Égypte, octobre 1799, et reprise plus tard par la légende impériale.',
        sens:
          'Elle dit bien l’état du pays, mais aucun témoin direct ne l’a notée ce jour-là.',
        incertaine: true,
      },
    ],
    reperes: [
      'Bonaparte abandonne son armée en Égypte et débarque à Fréjus le 9 octobre 1799, accueilli en héros.',
      'Le Directoire, cinq directeurs et deux Conseils, est usé : quatre coups d’État en quatre ans.',
      'Sieyès, directeur, prépare le complot et cherche « une épée » — il croit tenir un exécutant.',
      'Le 18 Brumaire, les Conseils sont transférés à Saint-Cloud au prétexte d’un complot jacobin.',
      'Le 19 Brumaire, les grenadiers de Murat vident l’Orangerie à la baïonnette.',
      'La Constitution de l’an VIII installe trois consuls ; seul le Premier consul décide.',
    ],
    causes: [
      'Un Directoire discrédité : élections annulées, coups de force à répétition, aucune majorité qui tienne plus d’un an.',
      'La faillite de l’État : les assignats ne valent plus rien, le Trésor emprunte à des taux ruineux, les fonctionnaires ne sont plus payés.',
      'La guerre revenue aux frontières : la deuxième coalition reprend l’Italie en 1799 et la peur d’une invasion s’installe.',
      'L’insécurité intérieure : chouannerie dans l’Ouest, brigandage sur les routes, diligences attaquées jusqu’aux portes de Paris.',
      'Une bourgeoisie enrichie par la Révolution — biens nationaux, fournitures aux armées — qui veut un pouvoir fort pour garder ce qu’elle a pris.',
      'Sieyès, convaincu qu’il faut réviser la Constitution par la force, et qui cherche un général assez populaire pour la couvrir.',
      'Le prestige intact de Bonaparte, vainqueur d’Italie, rentré d’Égypte avant que la nouvelle de ses échecs n’arrive en France.',
    ],
    recit: [
      {
        titre: 'Le général qui rentre d’Égypte',
        texte:
          'En octobre 1799, **Bonaparte** débarque à Fréjus. Il a trente ans, il laisse derrière lui une armée bloquée en Égypte par la flotte anglaise, et la France ne le sait pas encore : les journaux n’ont publié que ses victoires. De Fréjus à Paris, on dételle ses chevaux pour tirer sa voiture. Le pays qu’il retrouve est à bout — la **deuxième coalition** a repris l’Italie conquise en 1796, les caisses sont vides, la **chouannerie** reprend dans l’Ouest, et le **Directoire** n’obtient plus rien de ses assemblées sans les épurer. À Paris, un homme cherche exactement ce que Bonaparte représente : **Sieyès**, l’abbé de 1789, devenu directeur, qui veut réécrire la Constitution et sait qu’aucune assemblée ne la lui laissera réécrire. Il lui faut, dit-il, « une épée ». Il en a essayé deux, morte ou indisponible. La troisième vient de débarquer.',
      },
      {
        titre: '18 Brumaire : un complot inventé',
        texte:
          'Le **9 novembre 1799** (18 Brumaire an VIII), les conjurés font voter aux **Anciens** — la chambre haute, gagnée d’avance — un décret transférant les deux Conseils à **Saint-Cloud**, hors de Paris et hors de portée des faubourgs, au motif d’un complot jacobin qui n’existe pas. Le même décret confie à Bonaparte le commandement des troupes de la capitale. Deux directeurs démissionnent, Sieyès et Ducos ; **Barras** est convaincu de partir le soir même. Le pouvoir exécutif s’évapore en une journée, légalement, sans un coup de feu. Tout reste à faire : les **Cinq-Cents**, la chambre basse, n’ont rien voté et comptent une forte minorité de républicains décidés.',
      },
      {
        titre: '19 Brumaire : l’Orangerie',
        texte:
          'Le **10 novembre**, à Saint-Cloud, les Cinq-Cents siègent dans l’**Orangerie**. Bonaparte y entre sans y être invité et improvise mal : on le hue, on le bouscule, le cri « **hors la loi !** » monte — la formule qui, sous la Terreur, envoyait à la mort sans jugement. Il sort blême. Ce qui sauve la journée n’est pas lui, c’est son frère **Lucien**, président de séance : il quitte la salle, monte à cheval devant les grenadiers, jure de percer le sein de son propre frère si celui-ci trahit la liberté, et affirme que les députés sont tenus en respect par des « poignards anglais ». Les soldats de **Murat** entrent, baïonnette au canon, et vident la salle par les fenêtres. Le soir, on rassemble une poignée de députés dociles pour voter, dans les formes, la fin du Directoire et la nomination de trois consuls provisoires.',
      },
      {
        titre: 'Trois consuls, un seul pouvoir',
        texte:
          'Sieyès avait écrit une Constitution savante où le premier personnage de l’État ne gouvernerait pas. Bonaparte la retourne en quelques semaines : la **Constitution de l’an VIII**, promulguée le 15 décembre 1799, garde trois consuls, mais les deux autres n’ont qu’une voix consultative. Le **Premier consul** nomme les ministres, les préfets, les juges, et a seul l’initiative des lois. Le texte ne contient aucune déclaration des droits. Il est soumis à **plébiscite** : 3 011 007 oui contre 1 562 non — des chiffres que Lucien, ministre de l’Intérieur, a doublés d’autorité. Le pays, lui, laisse faire : il veut la paix, la sécurité des routes et la garantie de ses achats de biens nationaux. Il les obtient. Il vient de perdre la République.',
      },
    ],
    consequences: [
      'Fin du Directoire et de dix ans de régimes d’assemblée : le pouvoir exécutif devient le vrai pouvoir.',
      'La Constitution de l’an VIII fait du Premier consul le maître de l’État, sans déclaration des droits.',
      'Le Consulat pacifie et réorganise : préfets (1800), Banque de France (1800), Concordat (1801), Code civil (1804).',
      'Bonaparte devient consul à vie en 1802, puis empereur des Français en 1804 : Brumaire est la première marche.',
      'Le mot « bonapartisme » naît là : un homme seul, un plébiscite, et la promesse de finir la Révolution en la gardant.',
    ],
    chiffres: [
      { valeur: '30 ans', quoi: 'l’âge de Bonaparte le jour du coup d’État' },
      { valeur: '2 jours', quoi: 'pour renverser le régime, du 18 au 19 Brumaire' },
      { valeur: '3 011 007', quoi: 'oui au plébiscite de l’an VIII, chiffres officiels' },
      { valeur: '1 562', quoi: 'non au même plébiscite' },
    ],
    chrono: [
      { date: '9 octobre 1799', fait: 'Bonaparte débarque à Fréjus au retour d’Égypte.' },
      { date: '23 octobre 1799', fait: 'Sieyès et Bonaparte se rencontrent : le complot est noué.' },
      { date: '9 novembre 1799', fait: 'Les Conseils sont transférés à Saint-Cloud.' },
      { date: '10 novembre, après-midi', fait: 'Bonaparte est hué et menacé « hors la loi ».' },
      { date: '10 novembre, 17 h', fait: 'Les grenadiers de Murat vident l’Orangerie.' },
      { date: '10 novembre, nuit', fait: 'Trois consuls provisoires : Bonaparte, Sieyès, Ducos.' },
      { date: '15 décembre 1799', fait: 'Constitution de l’an VIII : Bonaparte Premier consul.' },
      { date: '2 août 1802', fait: 'Plébiscite : Bonaparte consul à vie.' },
    ],
    leSaisTu:
      'Le plébiscite de l’an VIII est le premier scrutin truqué de l’histoire de France dont on connaisse l’ampleur exacte : Lucien Bonaparte, ministre de l’Intérieur, a ajouté à la main environ 900 000 oui aux 1,5 million réellement comptés, et inscrit d’office les 500 000 soldats de l’armée. Les registres existent encore.',
    aRetenir: [
      'Les 9 et 10 novembre 1799 (18-19 Brumaire an VIII), Bonaparte renverse le Directoire avec Sieyès.',
      'Le coup d’État échoue presque à Saint-Cloud : ce sont les grenadiers de Murat qui vident les Cinq-Cents.',
      'La Constitution de l’an VIII crée le Consulat : trois consuls, mais seul le Premier consul gouverne.',
      'Le pays accepte parce qu’il veut la paix, la sécurité et la garantie de ses biens nationaux.',
      'Brumaire ouvre le chemin du Consulat à vie (1802) puis de l’Empire (1804).',
    ],
    mots: [
      {
        mot: 'Directoire',
        sens: 'Régime de la République de 1795 à 1799 : cinq directeurs à l’exécutif, deux Conseils au législatif.',
      },
      {
        mot: 'Coup d’État',
        sens: 'Prise du pouvoir par la force, hors des règles prévues, généralement avec l’appui de l’armée.',
      },
      {
        mot: 'Plébiscite',
        sens: 'Vote par oui ou non sur un texte ou sur un homme, sans débat ni candidat concurrent.',
      },
      {
        mot: 'Brumaire',
        sens: 'Deuxième mois du calendrier républicain, de fin octobre à fin novembre : le mois des brumes.',
      },
    ],
    lies: ['napoleon-bonaparte', 'sieyes', 'talleyrand', 'concordat-de-1801', 'code-civil'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Brumaire',
      'Consulat',
      'Directoire',
      'Bonaparte',
      'Sieyès',
      'Saint-Cloud',
      'Cinq-Cents',
      'coup d’État',
      'an VIII',
      'Lucien Bonaparte',
    ],
  },
  {
    id: 'concordat-de-1801',
    volet: 'evenements',
    nom: 'Le Concordat de 1801',
    date: '15 juillet 1801',
    tri: 1801,
    periode: 'revolution',
    emoji: '✍️',
    lieu: 'Paris et Rome',
    accroche:
      'Après dix ans de déchirure religieuse, la France et le pape refont la paix : un texte signé en une nuit, et qui tiendra cent quatre ans.',
    citations: [
      {
        texte:
          'La religion catholique, apostolique et romaine est la religion de la grande majorité des citoyens français.',
        qui: 'Le Concordat, article 1er',
        contexte: 'Texte signé à Paris dans la nuit du 15 au 16 juillet 1801.',
        sens:
          'La formule est pesée au mot près : « la religion de la majorité » et non « la religion de l’État ». La France ne redevient pas catholique, elle reconnaît que ses habitants le sont.',
      },
      {
        texte:
          'Cinquante évêques émigrés et soldés par l’Angleterre conduisent aujourd’hui le clergé français : il faut détruire leur influence, et pour cela l’autorité du pape est nécessaire.',
        qui: 'Bonaparte',
        contexte: 'Devant le Conseil d’État, en 1801, pour convaincre les hostiles au Concordat.',
        sens:
          'Le calcul est politique : seul le pape peut faire démissionner des évêques que la République ne peut ni nommer ni renvoyer.',
      },
      {
        texte:
          'En me faisant catholique, j’ai fini la guerre de Vendée ; en me faisant musulman, je me suis établi en Égypte.',
        qui: 'Bonaparte',
        contexte: 'Au Conseil d’État, vers 1800, sur l’usage politique des religions.',
        sens:
          'Il dit lui-même qu’il traite la religion en instrument de gouvernement. Pie VII, lui, négocie pour rouvrir les églises et rendre les sacrements aux fidèles : les deux hommes ne signent pas le même texte.',
      },
      {
        texte:
          'Sire, vous n’y parviendrez pas : nous n’y sommes pas parvenus nous-mêmes en dix-huit cents ans.',
        qui: 'Attribué au cardinal Consalvi',
        contexte:
          'Réponse prêtée au négociateur du pape, à qui Bonaparte aurait lancé qu’il détruirait l’Église.',
        sens:
          'L’échange est trop beau pour être sûr, mais il dit juste le rapport de forces : le Consulat a huit ans, l’Église en a dix-huit cents.',
        incertaine: true,
      },
    ],
    reperes: [
      'Depuis la Constitution civile du clergé (1790), l’Église de France est coupée en deux : jureurs et réfractaires.',
      'La Terreur a fermé les églises, déporté ou exécuté des prêtres, et imposé un calendrier sans dimanche.',
      'Pie VII, élu en 1800, accepte de négocier pour rendre les sacrements aux fidèles français.',
      'Signé dans la nuit du 15 au 16 juillet 1801 après huit mois de discussions et vingt et un projets.',
      'L’État salarie le clergé ; le Premier consul nomme les évêques, le pape leur donne l’institution canonique.',
      'Les acheteurs de biens nationaux gardent tout : l’Église renonce définitivement à ses terres vendues.',
    ],
    causes: [
      'La Constitution civile du clergé (1790) et le serment exigé des prêtres avaient divisé les catholiques et brouillé la France avec Rome dès 1791.',
      'La déchristianisation de l’an II : églises fermées, cloches fondues, prêtres déportés — une plaie ouverte dans les campagnes.',
      'La guerre de Vendée et la chouannerie, où la défense des prêtres réfractaires a été le premier moteur du soulèvement.',
      'La majorité du pays est restée catholique : les messes clandestines se tiennent par dizaines de milliers, le Directoire n’y peut rien.',
      'Le calcul de Bonaparte : sans paix religieuse, pas de pacification de l’Ouest ni d’obéissance des campagnes.',
      'L’élection en mars 1800 de Pie VII, un bénédictin jugé conciliant, qui accepte d’examiner ce qu’aucun pape n’avait examiné : traiter avec les héritiers de la Révolution.',
    ],
    recit: [
      {
        titre: 'Dix ans de déchirure',
        texte:
          'Tout commence en 1790 avec la **Constitution civile du clergé** : l’Assemblée réorganise l’Église comme une administration, fait élire les curés et les évêques, et exige des prêtres un **serment** de fidélité. Le pape condamne, et la France catholique se coupe en deux : les **jureurs** d’un côté, les **réfractaires** de l’autre, souvent deux prêtres pour une même paroisse. La rupture diplomatique avec Rome suit en 1791. Puis vient l’an II et la **déchristianisation** : églises fermées ou transformées en temples de la Raison, cloches fondues en canons, calendrier républicain sans dimanche, prêtres déportés, noyés à Nantes, guillotinés. Dans l’Ouest, la défense des prêtres est la première cause du soulèvement vendéen. En 1799, dix ans après, la messe se dit encore dans des granges. Un pays où la moitié des habitants pratique en cachette est un pays ingouvernable.',
      },
      {
        titre: 'Deux hommes qui ne cherchent pas la même chose',
        texte:
          '**Pie VII**, moine bénédictin élu pape en mars 1800 dans un conclave réfugié à Venise, hérite d’une situation sans exemple : la France, fille aînée de l’Église, n’a plus de hiérarchie reconnue, et ses fidèles meurent sans sacrements. Il envoie à Paris le cardinal **Consalvi**, son secrétaire d’État, avec une consigne simple : sauver ce qui peut l’être pour les âmes, céder sur le reste. En face, **Bonaparte** ne cherche pas le salut des âmes, et il le dit : il veut désarmer la Vendée, retirer aux émigrés l’arme de la religion, et tenir le clergé par son traitement. Huit mois de négociation, vingt et un projets, des colères calculées — Bonaparte déchire un texte devant Consalvi — et une signature dans la nuit du **15 au 16 juillet 1801**. Chacun a obtenu ce qu’il était venu chercher, et aucun des deux ne s’y trompe.',
      },
      {
        titre: 'Ce que le texte règle',
        texte:
          'Le Concordat tient en dix-sept articles. Le catholicisme est reconnu comme **religion de la grande majorité des Français** — pas comme religion d’État : la liberté des cultes de 1789 est maintenue, protestants et juifs seront organisés à leur tour. Tous les évêques, émigrés comme constitutionnels, sont priés de **démissionner** ; la carte est refaite, de cent trente-cinq diocèses à **soixante**. Le **Premier consul nomme** les évêques, le **pape leur donne l’institution canonique** : aucun des deux ne peut se passer de l’autre. Les curés sont nommés par l’évêque avec l’accord du gouvernement. L’**État salarie le clergé**, en compensation des terres perdues. Et surtout : les **biens nationaux** vendus depuis 1789 ne sont pas rendus, l’Église y renonce solennellement — c’est la clause qui rassure deux millions d’acheteurs et qui, seule, rendait la paix possible.',
      },
      {
        titre: 'Les Articles organiques, la pierre dans le soulier',
        texte:
          'Le Concordat n’est publié qu’à **Pâques 1802**, le 18 avril, par un *Te Deum* à Notre-Dame. Mais Bonaparte y a joint, sans le dire à Rome, **soixante-dix-sept Articles organiques** qui encadrent le culte : aucune bulle pontificale ne peut être publiée en France sans autorisation, les séminaires enseignent les libertés de l’Église gallicane, les processions sont réglementées, le curé doit lire les lois en chaire. Pie VII proteste et protestera toute sa vie : ces articles n’ont jamais été acceptés par Rome. La paix signée se tend donc vite, et dégénère : en 1809 Napoléon annexe les États pontificaux, le pape l’excommunie, et se retrouve **prisonnier cinq ans**, à Savone puis à Fontainebleau. Le Concordat, lui, survivra aux deux hommes.',
      },
      {
        titre: 'Cent quatre ans',
        texte:
          'Le régime né en 1801 a organisé la vie religieuse française pendant **plus d’un siècle**, sous tous les régimes : Empire, Restauration, monarchie de Juillet, Second Empire, République. Les évêques sont nommés par le chef de l’État, les prêtres payés par le budget, et l’État finit par salarier aussi les pasteurs et les rabbins. Il faut attendre la **loi de séparation des Églises et de l’État du 9 décembre 1905** pour que ce système tombe : plus de culte reconnu, plus de salaire public, la République ne reconnaît ni ne subventionne aucun culte. Cent quatre ans, c’est long pour un texte signé en une nuit par un consul de trente-deux ans pressé d’en finir.',
      },
    ],
    consequences: [
      'La paix religieuse revient : les églises rouvrent, les cloches sonnent, la chouannerie perd son principal moteur.',
      'L’Église de France se réorganise autour de 60 diocèses, avec un clergé salarié par l’État.',
      'Les acheteurs de biens nationaux sont définitivement rassurés : la Révolution est garantie par le pape lui-même.',
      'Les Articles organiques, ajoutés sans l’accord de Rome, empoisonnent la relation et conduisent à la rupture de 1809.',
      'Le régime concordataire encadre les cultes en France jusqu’à la loi de séparation du 9 décembre 1905.',
      'Protestants (1802) puis juifs (1808) reçoivent à leur tour un statut : la liberté des cultes devient une organisation des cultes.',
    ],
    chiffres: [
      { valeur: '10 ans', quoi: 'de rupture entre la France et Rome, de 1791 à 1801' },
      { valeur: '60', quoi: 'diocèses après 1801, contre 135 avant la Révolution' },
      { valeur: '77', quoi: 'Articles organiques ajoutés par Bonaparte, jamais acceptés par le pape' },
      { valeur: '104 ans', quoi: 'de régime concordataire, jusqu’à la loi de 1905' },
    ],
    chrono: [
      { date: '12 juillet 1790', fait: 'Constitution civile du clergé : l’Église est divisée.' },
      { date: '1793-1794', fait: 'Déchristianisation : églises fermées, prêtres déportés.' },
      { date: '14 mars 1800', fait: 'Élection de Pie VII, dans un conclave réfugié à Venise.' },
      { date: 'novembre 1800', fait: 'Ouverture des négociations à Paris avec le cardinal Consalvi.' },
      { date: '15-16 juillet 1801', fait: 'Signature du Concordat, après vingt et un projets.' },
      { date: '8 avril 1802', fait: 'Les Articles organiques sont joints au texte, sans Rome.' },
      { date: '18 avril 1802', fait: 'Te Deum à Notre-Dame : le Concordat entre en vigueur.' },
      { date: '1809-1814', fait: 'Pie VII excommunie Napoléon et reste prisonnier cinq ans.' },
      { date: '9 décembre 1905', fait: 'Loi de séparation des Églises et de l’État.' },
    ],
    leSaisTu:
      'Le Concordat n’est pas tout à fait mort : il s’applique encore aujourd’hui en Alsace et en Moselle. Ces trois départements étaient allemands en 1905, la loi de séparation n’y a donc jamais été votée, et l’État y rémunère toujours prêtres, pasteurs et rabbins. Un texte de 1801 paie encore des salaires en 2026.',
    aRetenir: [
      'Le Concordat est signé dans la nuit du 15 au 16 juillet 1801 entre Bonaparte et le pape Pie VII.',
      'Le catholicisme y est reconnu comme religion de la majorité des Français, non comme religion d’État.',
      'Le Premier consul nomme les évêques, le pape leur donne l’institution canonique, l’État salarie le clergé.',
      'L’Église renonce définitivement aux biens nationaux vendus depuis 1789.',
      'Le régime concordataire dure jusqu’à la loi de séparation des Églises et de l’État de 1905.',
    ],
    mots: [
      {
        mot: 'Concordat',
        sens: 'Accord signé entre un État et le pape pour régler la situation de l’Église dans ce pays.',
      },
      {
        mot: 'Institution canonique',
        sens: 'Acte par lequel le pape donne à un évêque nommé son autorité spirituelle sur un diocèse.',
      },
      {
        mot: 'Prêtre réfractaire',
        sens: 'Prêtre ayant refusé le serment à la Constitution civile du clergé de 1790.',
      },
      {
        mot: 'Biens nationaux',
        sens: 'Terres et bâtiments de l’Église et des émigrés confisqués puis vendus par la Révolution.',
      },
    ],
    lies: [
      'pie-vii',
      'napoleon-bonaparte',
      'sacre-de-napoleon',
      'guerre-de-vendee',
      'loi-de-separation-1905',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Concordat',
      'Pie VII',
      'Consalvi',
      'clergé',
      'Église',
      'religion',
      'Articles organiques',
      'diocèse',
      'paix religieuse',
      '1905',
    ],
  },
  {
    id: 'code-civil',
    volet: 'evenements',
    nom: 'Le Code civil',
    date: '21 mars 1804',
    tri: 1804,
    periode: 'revolution',
    emoji: '⚖️',
    lieu: 'Paris, Conseil d’État',
    accroche:
      '2 281 articles qui règlent la naissance, le mariage, la propriété et l’héritage : le seul monument de Napoléon qui gouverne encore la France.',
    citations: [
      {
        texte:
          'Ma vraie gloire, ce n’est pas d’avoir gagné quarante batailles ; ce qui vivra éternellement, c’est mon Code civil.',
        qui: 'Napoléon Ier',
        contexte: 'À Sainte-Hélène, dicté à Las Cases pour le *Mémorial*, vers 1816.',
        sens:
          'Il a vu juste : les frontières de l’Empire ont duré dix ans, le Code en est à sa deuxième centaine d’années.',
      },
      {
        texte: 'Les lois sont faites pour les hommes, et non les hommes pour les lois.',
        qui: 'Portalis',
        contexte:
          'Discours préliminaire du projet de Code civil, lu devant le Conseil d’État en janvier 1801.',
        sens:
          'Le principal rédacteur refuse un code théorique : il veut un texte que des gens ordinaires puissent appliquer à leur vie.',
      },
      {
        texte:
          'La propriété est le droit de jouir et disposer des choses de la manière la plus absolue.',
        qui: 'Le Code civil, article 544',
        contexte: 'L’article fondateur du droit des biens, inchangé depuis 1804.',
        sens:
          'C’est la fin définitive des droits seigneuriaux : le propriétaire ne doit plus rien à personne sur sa terre.',
      },
      {
        texte: 'Le mari doit protection à sa femme, la femme obéissance à son mari.',
        qui: 'Le Code civil, article 213',
        contexte:
          'Article 213 du texte de 1804. Le mot « obéissance » ne disparaîtra du Code qu’en 1938.',
        sens:
          'Le même code qui abolit les privilèges de naissance place la femme mariée sous l’autorité de son mari.',
      },
    ],
    reperes: [
      'Promulgué le 21 mars 1804 (30 ventôse an XII) sous le nom de Code civil des Français ; il devient Code Napoléon en 1807.',
      '2 281 articles rassemblent le droit de la famille, des biens, des contrats et des successions.',
      'Quatre juristes le rédigent en quatre mois ; Bonaparte préside 57 des 102 séances du Conseil d’État.',
      'Il grave l’égalité devant la loi, la propriété, la liberté du contrat et l’état civil laïque.',
      'Il place la femme mariée sous l’autorité du mari et donne au père la puissance paternelle.',
      'Il est toujours en vigueur : c’est le même code, réécrit article par article depuis deux siècles.',
    ],
    causes: [
      'Avant 1789, la France n’a pas un droit mais des centaines : droit romain écrit au sud, 65 coutumes générales et plus de 300 coutumes locales au nord.',
      'Voltaire l’avait résumé : on change de loi en France aussi souvent que de chevaux de poste.',
      'La Révolution proclame l’égalité et abolit les privilèges, mais légifère dans l’urgence : des milliers de lois en dix ans, souvent contradictoires.',
      'Les Constituants avaient promis dès 1791 « un code de lois civiles communes à tout le royaume » ; quatre projets de Cambacérès échouent entre 1793 et 1796.',
      'Deux millions d’acheteurs de biens nationaux réclament un texte qui garantisse définitivement leur propriété.',
      'Bonaparte, qui veut un État qui tienne, nomme le 12 août 1800 une commission de quatre juristes et exige un projet en quatre mois.',
    ],
    recit: [
      {
        titre: 'Un pays, trois cents coutumes',
        texte:
          'Sous l’Ancien Régime, la question « quelle est la loi ? » n’a pas de réponse unique. Au sud règne le **droit écrit**, hérité du droit romain ; au nord, les **coutumes**, rédigées au XVIᵉ siècle — soixante-cinq coutumes générales et plus de trois cents coutumes locales. On hérite différemment à Paris et à Orléans, à vingt lieues de distance. S’y ajoutent les ordonnances royales, le droit canonique pour le mariage, et la jurisprudence de treize parlements qui ne s’accordent pas. La Révolution abat cet édifice — plus de privilèges, plus de droit d’aînesse, plus de mainmorte — mais elle le remplace par une avalanche de lois votées dans l’urgence, corrigées, abrogées, rétablies. En 1800, un juge de paix ne sait littéralement pas quel texte appliquer à une succession. **Il n’y a plus d’Ancien Régime, et il n’y a pas encore de droit.**',
      },
      {
        titre: 'Quatre juristes, quatre mois',
        texte:
          'Le **12 août 1800**, le Premier consul nomme une commission de quatre : **Portalis**, **Tronchet**, **Bigot de Préameneu** et **Maleville** — deux hommes du droit écrit, deux hommes des coutumes, tous formés avant 1789 et tous restés en France pendant la Révolution. Le projet est prêt en **quatre mois**. Portalis le présente par un *Discours préliminaire* qui reste un des plus beaux textes juridiques de la langue française : il y refuse de tout prévoir, se méfie des lois trop nombreuses, et pose que le droit doit transiger entre les usages et les principes. Vient ensuite la discussion au **Conseil d’État** : 102 séances, dont **57 présidées par Bonaparte lui-même**. Il n’est pas juriste, mais il pose les questions d’un profane obstiné — pourquoi ? à quoi ça sert ? — et tranche sur la famille, le divorce et l’adoption. Les 36 lois votées une à une sont réunies le **21 mars 1804** en un seul texte : le **Code civil des Français**.',
      },
      {
        titre: 'Ce qu’il fonde, et qui tient encore',
        texte:
          'Le Code sauve l’essentiel de 1789 et le rend applicable. **Égalité devant la loi** : le même droit pour tous les Français, quels que soient la province, la naissance ou la religion ; les privilèges de naissance ne reviendront pas. **Propriété** : l’article 544 en fait un droit « absolu », garantissant les biens nationaux et liquidant pour toujours les droits seigneuriaux. **État civil laïque** : naissances, mariages et décès sont enregistrés par la mairie, non par le curé. **Mariage civil et divorce** : le mariage est un contrat devant l’officier d’état civil, et il peut se rompre — par consentement mutuel ou pour faute. **Liberté du travail et des contrats** : plus de corporations, chacun choisit son métier. **Succession égale** entre les enfants : le droit d’aînesse est mort. Rédigé en phrases courtes, sans latin, il a été écrit pour être lu par ceux qu’il oblige.',
      },
      {
        titre: 'Ce qu’il fige : la femme mariée et le père',
        texte:
          'Le même texte écrit l’inégalité des sexes avec la même précision. L’**article 213** dispose que « le mari doit protection à sa femme, la femme obéissance à son mari ». La femme mariée est rangée, à l’article 1124, parmi les **incapables** aux côtés des mineurs : elle ne peut ni plaider, ni vendre, ni acheter, ni accepter un héritage sans l’autorisation écrite de son mari, qui administre ses biens. L’adultère de la femme est puni de trois mois à deux ans de prison ; celui du mari seulement s’il installe sa maîtresse au domicile conjugal. Le père exerce seul la **puissance paternelle** sur les enfants, et peut faire enfermer un fils de moins de seize ans pour un mois. La recherche de paternité est interdite. Il faudra un siècle et demi pour défaire cela : **1938** pour supprimer l’incapacité de la femme mariée, **1965** pour qu’elle puisse travailler et ouvrir un compte sans l’accord de son mari, **1970** pour que l’autorité parentale devienne commune aux deux parents. Le Code ne s’applique pas non plus aux colonies, où l’esclavage a été rétabli par la loi du 20 mai 1802.',
      },
      {
        titre: 'Le code qui a voyagé',
        texte:
          'Napoléon l’a exporté sur la pointe de ses baïonnettes, et il est resté après elles. Belgique, Luxembourg, Pays-Bas, Rhénanie, Italie, Pologne, Espagne l’adoptent ou s’en inspirent ; la Louisiane et le Québec en gardent l’ossature ; au XIXᵉ siècle, la plupart des jeunes républiques d’Amérique latine écrivent leur code civil avec le français ouvert sur la table, et le Japon de l’ère Meiji, l’Égypte, la Roumanie s’en servent de modèle. Aujourd’hui encore, plusieurs dizaines de pays vivent sous un droit de famille et de propriété issu de 1804. En France, le Code a été réécrit par morceaux — divorce supprimé en 1816, rétabli par la **loi Naquet en 1884**, droit de la famille refait dans les années 1960-1970, droit des contrats en 2016 — mais c’est toujours le même code, avec les mêmes numéros d’articles. Quand un élève français achète un appartement ou se marie, il applique un texte de Napoléon.',
      },
    ],
    consequences: [
      'La France a pour la première fois un droit unique, écrit, applicable de Dunkerque à Perpignan.',
      'L’égalité devant la loi, la propriété et l’état civil laïque deviennent irréversibles, quel que soit le régime.',
      'La femme mariée reste juridiquement incapable jusqu’en 1938 et sous tutelle financière jusqu’en 1965.',
      'Le divorce, autorisé en 1804, est supprimé en 1816 et ne revient qu’avec la loi Naquet de 1884.',
      'Le modèle s’exporte en Europe, en Amérique latine et jusqu’au Japon : c’est la plus durable des conquêtes napoléoniennes.',
      'Le Code civil est toujours en vigueur : c’est le plus vieux texte encore appliqué du droit français.',
    ],
    chiffres: [
      { valeur: '2 281', quoi: 'articles dans le Code de 1804' },
      { valeur: '4 mois', quoi: 'de rédaction par la commission de Portalis' },
      { valeur: '57', quoi: 'séances du Conseil d’État présidées par Bonaparte, sur 102' },
      { valeur: '1938', quoi: 'fin de l’incapacité juridique de la femme mariée' },
    ],
    chrono: [
      { date: '1789-1799', fait: 'La Révolution abolit les privilèges mais légifère dans le désordre.' },
      { date: '1793-1796', fait: 'Quatre projets de code de Cambacérès échouent.' },
      { date: '12 août 1800', fait: 'Bonaparte nomme la commission Portalis.' },
      { date: 'janvier 1801', fait: 'Portalis lit son Discours préliminaire au Conseil d’État.' },
      { date: '21 mars 1804', fait: 'Promulgation du Code civil des Français.' },
      { date: '3 septembre 1807', fait: 'Le texte prend le nom de Code Napoléon.' },
      { date: '8 mai 1816', fait: 'La Restauration supprime le divorce.' },
      { date: '27 juillet 1884', fait: 'La loi Naquet rétablit le divorce.' },
      { date: '18 février 1938', fait: 'Fin de l’incapacité juridique de la femme mariée.' },
      { date: '13 juillet 1965', fait: 'Les femmes mariées peuvent travailler et ouvrir un compte seules.' },
      { date: '4 juin 1970', fait: 'L’autorité parentale remplace la puissance paternelle.' },
    ],
    leSaisTu:
      'Stendhal écrivait qu’il lisait chaque matin deux ou trois pages du Code civil avant de se mettre au travail, pour « prendre le ton » : pas une phrase de trop, pas un adjectif inutile. Le texte le plus sec de la langue française a servi de modèle de style à l’auteur du *Rouge et le Noir*.',
    aRetenir: [
      'Le Code civil est promulgué le 21 mars 1804 ; il compte 2 281 articles et devient Code Napoléon en 1807.',
      'Il fixe l’égalité devant la loi, la propriété, le mariage civil, le divorce et l’état civil laïque.',
      'Il place la femme mariée sous l’autorité de son mari (article 213) et lui retire sa capacité juridique.',
      'Napoléon le jugeait supérieur à ses quarante batailles : c’est son œuvre la plus durable.',
      'Exporté dans toute l’Europe et au-delà, il est toujours en vigueur en France aujourd’hui.',
    ],
    mots: [
      {
        mot: 'Coutume',
        sens: 'Droit local non écrit à l’origine, propre à une province ou à une ville, fixé par écrit au XVIᵉ siècle.',
      },
      {
        mot: 'Code',
        sens: 'Recueil unique et ordonné de toutes les règles d’une matière du droit.',
      },
      {
        mot: 'Puissance paternelle',
        sens: 'Autorité exclusive du père sur ses enfants mineurs, remplacée en 1970 par l’autorité parentale des deux parents.',
      },
      {
        mot: 'État civil',
        sens: 'Enregistrement public des naissances, mariages et décès, confié aux mairies depuis 1792.',
      },
      {
        mot: 'Droit d’aînesse',
        sens: 'Privilège donnant au fils aîné l’essentiel de l’héritage ; aboli par la Révolution et non rétabli.',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'coup-d-etat-du-18-brumaire',
      'declaration-des-droits-de-l-homme',
      'nuit-du-4-aout',
      'olympe-de-gouges',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Code civil',
      'Code Napoléon',
      'Portalis',
      'article 213',
      'propriété',
      'mariage',
      'divorce',
      'droit',
      'égalité devant la loi',
      'puissance paternelle',
      'état civil',
    ],
  },
  {
    id: 'sacre-de-napoleon',
    volet: 'evenements',
    nom: 'Le sacre de Napoléon',
    date: '2 décembre 1804',
    tri: 1804,
    periode: 'revolution',
    emoji: '👑',
    lieu: 'Paris, cathédrale Notre-Dame',
    accroche:
      'Dans une Notre-Dame glacée, devant un pape venu de Rome, un général corse prend la couronne et se la pose lui-même sur la tête.',
    citations: [
      {
        texte:
          'Je jure de maintenir l’intégrité du territoire de la République, de respecter et de faire respecter les lois du Concordat et la liberté des cultes.',
        qui: 'Napoléon Ier',
        contexte: 'Serment constitutionnel prêté à Notre-Dame, le 2 décembre 1804, après le couronnement.',
        sens:
          'L’empereur jure sur la Constitution, pas sur l’Évangile : le mot « République » figure encore sur les pièces de monnaie.',
      },
      {
        texte: 'Vivat Imperator in aeternum !',
        qui: 'L’assemblée de Notre-Dame',
        contexte: 'Acclamation latine du sacre, reprise après l’onction donnée par le pape.',
        sens: '« Vive l’empereur à jamais ! » — la formule qui servait aux empereurs du Saint-Empire.',
      },
      {
        texte: 'J’ai trouvé la couronne de France par terre, et je l’ai ramassée avec mon épée.',
        qui: 'Napoléon Ier',
        contexte: 'Propos rapporté par Las Cases à Sainte-Hélène, dans le *Mémorial*.',
        sens:
          'Il ne prétend pas tenir son pouvoir de Dieu ni d’une dynastie, mais de son mérite et de la victoire. Tout le geste du 2 décembre est là.',
      },
      {
        texte: 'Joseph, si notre père nous voyait !',
        qui: 'Attribué à Napoléon, s’adressant à son frère Joseph',
        contexte: 'Pendant la cérémonie, à Notre-Dame, selon plusieurs récits postérieurs.',
        sens:
          'Aucun témoin ne l’a notée sur le moment ; elle dit pourtant bien ce que le jour avait d’invraisemblable pour une famille corse de petite noblesse.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le sénatus-consulte du 18 mai 1804 confie « le gouvernement de la République à un empereur ».',
      'Le plébiscite qui suit donne 3 572 329 oui contre 2 569 non.',
      'Pie VII fait un mois de route depuis Rome pour être présent : aucun pape n’était venu en France depuis 1516.',
      'Le pape donne l’onction ; Napoléon prend lui-même la couronne et la pose sur sa tête, comme convenu d’avance.',
      'Il couronne ensuite Joséphine, agenouillée devant lui : c’est la scène que peindra David.',
      'La cérémonie dure environ cinq heures, dans une cathédrale non chauffée, le 2 décembre.',
    ],
    causes: [
      'Le Consulat à vie de 1802 avait déjà fait de Bonaparte un souverain sans le nom ni l’hérédité.',
      'Les complots royalistes, et surtout la conspiration de Cadoudal découverte en février 1804 : tuer Bonaparte suffirait à renverser le régime.',
      'L’exécution du duc d’Enghien, enlevé et fusillé le 21 mars 1804, qui rend toute réconciliation avec les Bourbons impossible.',
      'Le calcul de rendre le régime héréditaire pour que l’assassinat du chef ne change plus rien : « ils ont tué un homme, pas une dynastie ».',
      'Le besoin d’une légitimité reconnue par l’Europe des rois, qui ne voit en lui qu’un général parvenu.',
      'Le Concordat de 1801, qui rend possible l’impensable : faire venir le pape bénir un souverain sorti de la Révolution.',
    ],
    recit: [
      {
        titre: 'De consul à empereur',
        texte:
          'L’hiver 1804 décide de tout. En février, la police découvre la conspiration de **Cadoudal**, qui veut enlever le Premier consul ; en mars, sur ordre de Bonaparte, le **duc d’Enghien**, prince de la maison de Bourbon, est enlevé en territoire étranger, jugé de nuit et fusillé dans les fossés de Vincennes. L’Europe des rois est glacée, et la rupture avec la royauté est définitive. Le raisonnement des partisans de Bonaparte tient en une phrase : tant que le pouvoir tient à une seule vie, un coup de pistolet suffit à le renverser. Il faut donc une **dynastie**. Le **sénatus-consulte du 18 mai 1804** confie « le gouvernement de la République à un empereur », titre héréditaire ; le **plébiscite** l’approuve par 3 572 329 oui contre 2 569 non. La République subsiste dans les textes et sur les pièces jusqu’en 1808 : on est empereur *des Français*, comme Louis XVI avait été roi des Français.',
      },
      {
        titre: 'Faire venir le pape',
        texte:
          'Reste à se faire reconnaître. **Pie VII** est invité — et il vient, ce qu’aucun pape n’avait fait en France depuis 1516. Il quitte Rome le 2 novembre, un mois de mauvaises routes, et Napoléon organise leur première rencontre en forêt de Fontainebleau, comme par hasard, au retour d’une chasse : pas de protocole, donc pas de préséance à concéder. Le pape n’est pas dupe et n’est pas venu pour rien : il espère obtenir l’abrogation des **Articles organiques**, la restitution de territoires pontificaux, un meilleur statut pour l’Église de France. Il n’obtiendra presque rien de tout cela, et il le sait en signant son départ. Il obtient une chose, en revanche, à laquelle il tient plus qu’au reste : la veille du sacre, apprenant que le couple impérial n’est marié que civilement, il exige un **mariage religieux**, célébré dans la nuit du 1er décembre par le cardinal Fesch. Joséphine, qui l’avait discrètement demandé, y gagne un lien que l’on ne dissout pas d’un mot.',
      },
      {
        titre: 'Le 2 décembre, à Notre-Dame',
        texte:
          'La cathédrale a été rhabillée de fond en comble par les architectes **Percier et Fontaine** : une façade de carton-pâte à l’antique masque le portail gothique, des tentures couvrent les murs, vingt mille personnes y prennent place. Il gèle. Le cortège traverse Paris, le pape arrive d’abord, comme le veut l’usage ; l’empereur se fait attendre une heure et demie. Vient l’**onction** : Pie VII oint la tête et les mains de Napoléon et de Joséphine — c’est l’acte religieux du sacre, celui qui compte pour l’Église. Puis, sur l’autel, **Napoléon prend la couronne et se la pose lui-même sur la tête**, avant de couronner Joséphine agenouillée devant lui. Ce n’est pas un coup de théâtre improvisé, contrairement à la légende : tout était réglé d’avance dans le cérémonial, et le pape le savait. Le geste dit simplement que ce pouvoir-là ne vient de personne d’autre que de celui qui le porte. La cérémonie dure cinq heures ; le serment prêté à la fin est un serment à la Constitution.',
      },
      {
        titre: 'Le tableau de David',
        texte:
          '**Jacques-Louis David**, ancien conventionnel régicide devenu premier peintre de l’empereur, met trois ans à peindre *Le Sacre de Napoléon* : **6,21 m sur 9,79 m**, près de deux cents personnages reconnaissables, aujourd’hui au Louvre. Il avait d’abord dessiné Napoléon se couronnant lui-même, bras levés ; le sujet parut arrogant, et David choisit l’instant suivant — l’empereur couronnant **Joséphine**, ce qui le montre en donneur de couronne sans le montrer en preneur. Le tableau n’est pas un reportage : au centre de la tribune trône **Madame Mère**, Letizia Bonaparte, qui **n’est pas venue** — elle était à Rome, fâchée par la querelle entre ses fils —, et que David a peinte quand même, sur commande. Le pape, qui sur les esquisses regardait ses mains, a reçu la main levée pour bénir, à la demande de Napoléon. David s’est représenté lui-même dans une tribune, carnet en main, en train de dessiner la scène qu’il invente.',
      },
    ],
    consequences: [
      'La République devient un empire héréditaire : le pouvoir se transmet désormais dans la famille Bonaparte.',
      'Une cour, une noblesse d’Empire et une étiquette renaissent, calquées sur celles de l’Ancien Régime.',
      'Napoléon est couronné roi d’Italie à Milan le 26 mai 1805 : le sacre ouvre une politique de couronnes européennes.',
      'Les monarchies d’Europe y voient une provocation ; la troisième coalition se forme dans l’année.',
      'Le tableau de David impose pour deux siècles l’image officielle de la scène, jusque dans les manuels.',
      'L’absence d’héritier conduira au divorce d’avec Joséphine en 1809 et au mariage autrichien de 1810.',
    ],
    chiffres: [
      { valeur: '5 heures', quoi: 'de cérémonie à Notre-Dame, sans chauffage' },
      { valeur: '3 572 329', quoi: 'oui au plébiscite de mai 1804, contre 2 569 non' },
      { valeur: '9,79 m', quoi: 'de large pour le tableau de David' },
      { valeur: '≈ 200', quoi: 'personnages peints dans Le Sacre' },
    ],
    chrono: [
      { date: 'février 1804', fait: 'Découverte de la conspiration de Cadoudal.' },
      { date: '21 mars 1804', fait: 'Exécution du duc d’Enghien dans les fossés de Vincennes.' },
      { date: '18 mai 1804', fait: 'Sénatus-consulte : Napoléon empereur des Français.' },
      { date: '2 novembre 1804', fait: 'Pie VII quitte Rome pour Paris.' },
      { date: '1er décembre 1804', fait: 'Mariage religieux de Napoléon et Joséphine, de nuit.' },
      { date: '2 décembre 1804', fait: 'Sacre et couronnement à Notre-Dame.' },
      { date: '26 mai 1805', fait: 'Napoléon couronné roi d’Italie à Milan.' },
      { date: '1807', fait: 'David achève Le Sacre de Napoléon.' },
    ],
    leSaisTu:
      'Les « honneurs de Charlemagne » portés au sacre — couronne, sceptre, épée « Joyeuse » — étaient presque tous des faux : les vrais regalia avaient été fondus ou dispersés pendant la Révolution. On fit fabriquer en quelques semaines des objets d’allure médiévale, et la couronne de laurier en or posée ce jour-là sortait de chez un orfèvre parisien.',
    aRetenir: [
      'Le 2 décembre 1804, Napoléon est sacré empereur des Français à Notre-Dame de Paris.',
      'Le pape Pie VII donne l’onction, mais Napoléon prend la couronne et se la pose lui-même.',
      'L’Empire est héréditaire : le sénatus-consulte du 18 mai 1804 a été approuvé par plébiscite.',
      'Le tableau de David montre le couronnement de Joséphine, et fait figurer Madame Mère, absente ce jour-là.',
      'Le sacre cherche une légitimité face aux monarchies européennes, qui refusent d’y croire.',
    ],
    mots: [
      {
        mot: 'Sacre',
        sens: 'Cérémonie religieuse où un souverain reçoit l’onction d’huile sainte ; distincte du couronnement.',
      },
      {
        mot: 'Onction',
        sens: 'Geste par lequel l’évêque ou le pape marque d’huile consacrée la tête et les mains du souverain.',
      },
      {
        mot: 'Sénatus-consulte',
        sens: 'Acte du Sénat qui, sous le Consulat et l’Empire, modifie la Constitution sans vote populaire préalable.',
      },
      {
        mot: 'Regalia',
        sens: 'Les objets du pouvoir royal : couronne, sceptre, main de justice, épée, manteau.',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'pie-vii',
      'josephine-de-beauharnais',
      'concordat-de-1801',
      'sacre-de-charlemagne',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'sacre',
      'couronnement',
      'Notre-Dame',
      'Pie VII',
      'Joséphine',
      'David',
      'Empire',
      '2 décembre',
      'plébiscite',
      'Madame Mère',
    ],
  },
  {
    id: 'bataille-d-austerlitz',
    volet: 'evenements',
    nom: 'La bataille d’Austerlitz',
    date: '2 décembre 1805',
    tri: 1805,
    periode: 'revolution',
    emoji: '☀️',
    lieu: 'Austerlitz, en Moravie (aujourd’hui Slavkov u Brna, Tchéquie)',
    accroche:
      'Un an jour pour jour après son sacre, Napoléon feint la faiblesse, abandonne un plateau, le reprend — et brise deux empereurs en une matinée.',
    citations: [
      {
        texte:
          'Soldats, je suis content de vous ! Il vous suffira de dire : j’étais à la bataille d’Austerlitz, pour que l’on réponde : voilà un brave.',
        qui: 'Napoléon Ier',
        contexte: 'Proclamation à la Grande Armée au lendemain de la bataille, le 3 décembre 1805.',
        sens:
          'La phrase fait plus que féliciter : elle fabrique un titre de gloire que les survivants porteront toute leur vie.',
      },
      {
        texte:
          'Si la victoire était un moment incertaine, vous verriez votre empereur s’exposer aux premiers coups.',
        qui: 'Napoléon Ier',
        contexte: 'Proclamation lue aux troupes la veille de la bataille, le 1er décembre 1805.',
      },
      {
        texte: 'Combien de temps vous faut-il pour occuper les hauteurs de Pratzen ?',
        qui: 'Napoléon au maréchal Soult',
        contexte:
          'Au poste de commandement, au matin du 2 décembre. Soult répond : « Moins de vingt minutes, Sire. »',
        sens:
          'Napoléon attendra un quart d’heure de plus, le temps que l’ennemi ait vidé le plateau. L’échange vient des mémoires des témoins.',
        incertaine: true,
      },
      {
        texte: 'Roulez cette carte : on n’en aura plus besoin avant dix ans.',
        qui: 'William Pitt, Premier ministre britannique',
        contexte: 'En apprenant la nouvelle d’Austerlitz, devant une carte de l’Europe, décembre 1805.',
        sens:
          'Pitt avait bâti et payé la coalition ; il meurt six semaines plus tard, à quarante-six ans.',
      },
    ],
    reperes: [
      'Le 2 décembre 1805, un an jour pour jour après le sacre : on l’appellera « le soleil d’Austerlitz ».',
      'Environ 73 000 Français contre 85 000 Austro-Russes : Napoléon combat en infériorité, et il l’a voulu.',
      'Il abandonne volontairement le plateau de Pratzen, le point haut du champ de bataille, pour y attirer l’ennemi.',
      'Soult reprend le plateau vers 9 heures et coupe l’armée alliée en deux.',
      'On la nomme bataille des Trois Empereurs : Napoléon, François II d’Autriche et Alexandre Ier de Russie sont présents.',
      'Le traité de Presbourg, signé le 26 décembre, chasse l’Autriche d’Italie et d’Allemagne.',
    ],
    causes: [
      'La rupture de la paix d’Amiens en mai 1803 : la guerre reprend entre la France et l’Angleterre, et ne s’arrêtera plus.',
      'Le sacre de décembre 1804, puis le couronnement de Napoléon comme roi d’Italie en mai 1805, qui alarment toutes les cours d’Europe.',
      'L’argent anglais : Pitt finance la troisième coalition, et l’Autriche, la Russie, la Suède et Naples entrent en guerre à l’été 1805.',
      'Trafalgar, le 21 octobre 1805 : la flotte franco-espagnole détruite rend impossible tout débarquement en Angleterre.',
      'La marche éclair de la Grande Armée, du camp de Boulogne au Danube : Ulm capitule le 20 octobre, Vienne est prise le 13 novembre.',
      'L’urgence pour Napoléon d’une bataille décisive avant l’arrivée des renforts russes et l’entrée en guerre de la Prusse.',
    ],
    recit: [
      {
        titre: 'De Boulogne au Danube',
        texte:
          'Pendant deux ans, deux cent mille hommes ont attendu à **Boulogne** le moment de traverser la Manche. En août 1805, Napoléon apprend que l’Autriche et la Russie marchent contre lui : il retourne son armée et la lance vers l’est. Sept corps d’armée franchissent la France et l’Allemagne sur des itinéraires séparés, **600 km en cinq semaines**, vivant sur le pays pour ne pas traîner de convois. C’est là que naît le nom de **Grande Armée**. Le général autrichien **Mack**, qui attendait les Français par les cols alpins, se retrouve encerclé à **Ulm** et capitule le 20 octobre avec 27 000 hommes, presque sans combattre. Le 13 novembre, les Français entrent dans **Vienne**. Mais l’armée russe d’**Alexandre Ier** est intacte, la Prusse hésite à entrer en guerre, et les lignes de ravitaillement françaises s’étirent sur mille kilomètres. Napoléon a besoin d’une bataille, tout de suite.',
      },
      {
        titre: 'Le piège du plateau',
        texte:
          'Il choisit lui-même le terrain, près du village d’**Austerlitz**, et y installe une armée volontairement mal placée. Il occupe le **plateau de Pratzen**, la hauteur qui commande toute la plaine — puis il l’**abandonne**, retire ses troupes en contrebas, dégarnit ostensiblement son aile droite, envoie un émissaire demander une entrevue et multiplie les signes d’un chef qui veut négocier. Le jeune tsar et son état-major y croient : ils voient une armée inférieure en nombre, coupée de ses bases, prête à reculer. Leur plan est donc d’occuper le plateau, de descendre sur la droite française et de couper la route de Vienne. C’est exactement ce que Napoléon attend : pour descendre, il faut d’abord **quitter les hauteurs**. Le 1er décembre au soir, il voit depuis son bivouac les feux ennemis glisser vers le sud. Les soldats, qui fêtent l’anniversaire du sacre en brandissant des torches de paille, l’entendent dire que la bataille est gagnée.',
      },
      {
        titre: 'Le soleil, et six heures',
        texte:
          'Le **2 décembre** vers 7 heures, la plaine est noyée de brouillard, et les hauteurs émergent seules dans le soleil levant : c’est le **soleil d’Austerlitz**, que Napoléon invoquera encore sept ans plus tard en Russie. Les alliés s’écoulent vers le sud comme prévu et s’enlisent dans les villages et les étangs de **Telnitz** et **Sokolnitz**, où **Davout** résiste avec des forces dérisoires. Vers 9 heures, le brouillard se lève : **Soult** lance deux divisions à l’assaut du Pratzen désormais vide, l’enlève, et l’armée alliée se retrouve **coupée en deux** avec son centre crevé. La garde impériale russe contre-attaque, les cavaliers de **Bessières** et les Mamelouks la brisent. À une heure de l’après-midi, tout est joué ; les alliés fuient vers les étangs gelés de Satschan. Le bulletin français annoncera 20 000 Russes noyés sous la glace brisée par les boulets. Quand Napoléon fera vider les étangs quelques semaines plus tard, on y trouvera deux ou trois corps et cent cinquante chevaux : la légende avait servi.',
      },
      {
        titre: 'Ce que vaut une victoire',
        texte:
          'Les pertes disent l’ampleur : environ **1 300 morts** et 7 000 blessés côté français, **27 000 hommes** hors de combat côté allié, dont 12 000 prisonniers, et 180 canons perdus. Le tsar s’enfuit vers la Russie ; **François II d’Autriche** demande une entrevue et signe le **traité de Presbourg** le 26 décembre : l’Autriche perd la Vénétie, le Tyrol, ses dernières terres allemandes et 3 millions de sujets. La troisième coalition s’effondre ; **Pitt** meurt le 23 janvier 1806. Huit mois plus tard, le **Saint-Empire romain germanique**, vieux de mille ans, est dissous et remplacé par la **Confédération du Rhin** sous protection française. Napoléon fait couler la **colonne Vendôme** dans le bronze des canons pris. Austerlitz est le sommet de l’Empire : à partir de là, chaque victoire coûtera plus cher que la précédente.',
      },
    ],
    consequences: [
      'Le traité de Presbourg (26 décembre 1805) chasse l’Autriche d’Italie et d’Allemagne et lui coûte 3 millions de sujets.',
      'La troisième coalition s’effondre ; Pitt meurt six semaines plus tard.',
      'Le Saint-Empire romain germanique est dissous le 6 août 1806 et remplacé par la Confédération du Rhin.',
      'Bavière et Wurtemberg deviennent des royaumes alliés : l’Allemagne est réorganisée par la France.',
      'La colonne Vendôme est fondue dans le bronze des canons pris à Austerlitz.',
      'La Prusse, humiliée d’avoir hésité, entrera en guerre seule en 1806 et sera écrasée à Iéna.',
    ],
    chiffres: [
      { valeur: '73 000', quoi: 'Français face à 85 000 Austro-Russes' },
      { valeur: '27 000', quoi: 'alliés tués, blessés ou prisonniers' },
      { valeur: '1 300', quoi: 'morts français, pour environ 7 000 blessés' },
      { valeur: '600 km', quoi: 'parcourus en cinq semaines de Boulogne au Danube' },
    ],
    chrono: [
      { date: 'août 1805', fait: 'La Grande Armée quitte le camp de Boulogne pour le Danube.' },
      { date: '20 octobre 1805', fait: 'Capitulation de Mack à Ulm : 27 000 prisonniers.' },
      { date: '21 octobre 1805', fait: 'Trafalgar : la flotte franco-espagnole est détruite.' },
      { date: '13 novembre 1805', fait: 'Les Français entrent dans Vienne.' },
      { date: '1er décembre 1805', fait: 'Napoléon laisse les alliés occuper le plateau de Pratzen.' },
      { date: '2 décembre, 7 h', fait: 'La bataille s’engage dans le brouillard.' },
      { date: '2 décembre, 9 h', fait: 'Soult reprend le Pratzen et coupe l’armée alliée.' },
      { date: '26 décembre 1805', fait: 'Traité de Presbourg.' },
      { date: '6 août 1806', fait: 'Fin du Saint-Empire romain germanique.' },
    ],
    leSaisTu:
      'La colonne de la place Vendôme, à Paris, est faite du bronze des canons pris à Austerlitz : 1 200 pièces fondues et coulées en une spirale de bas-reliefs qui raconte la campagne, comme la colonne Trajane à Rome. Elle mesure 44 mètres. Chaque touriste qui la photographie photographie l’artillerie autrichienne.',
    aRetenir: [
      'Le 2 décembre 1805, Napoléon bat les armées russe et autrichienne à Austerlitz, en Moravie.',
      'On l’appelle la bataille des Trois Empereurs : Napoléon, François II et Alexandre Ier y sont présents.',
      'La ruse est d’abandonner le plateau de Pratzen pour y attirer l’ennemi, puis de le reprendre.',
      'Les alliés perdent 27 000 hommes, les Français environ 1 300 morts : c’est la victoire la plus nette de l’Empire.',
      'Elle entraîne le traité de Presbourg et la fin du Saint-Empire romain germanique en 1806.',
    ],
    mots: [
      {
        mot: 'Grande Armée',
        sens: 'Nom donné à l’armée française de Napoléon à partir de 1805, organisée en corps d’armée autonomes.',
      },
      {
        mot: 'Coalition',
        sens: 'Alliance temporaire de plusieurs États contre la France ; il y en eut sept entre 1792 et 1815.',
      },
      {
        mot: 'Bulletin de la Grande Armée',
        sens: 'Communiqué officiel des campagnes, lu partout en France — et si peu fiable qu’on disait « menteur comme un bulletin ».',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'sacre-de-napoleon',
      'campagne-de-russie',
      'bataille-de-waterloo',
      'talleyrand',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Austerlitz',
      'Trois Empereurs',
      'Pratzen',
      'Grande Armée',
      'Soult',
      'Alexandre Ier',
      'Presbourg',
      'Ulm',
      'colonne Vendôme',
      'Moravie',
    ],
  },
  {
    id: 'campagne-de-russie',
    volet: 'evenements',
    nom: 'La campagne de Russie',
    date: 'juin – décembre 1812',
    tri: 1812,
    fin: 1812,
    periode: 'revolution',
    emoji: '❄️',
    lieu: 'Du Niémen à Moscou',
    accroche:
      'Six cent mille hommes passent le Niémen en juin ; moins de cent mille le repassent en décembre. La plus grande armée jamais réunie a fondu en six mois.',
    citations: [
      {
        texte: 'Du sublime au ridicule il n’y a qu’un pas.',
        qui: 'Napoléon Ier',
        contexte:
          'À l’abbé de Pradt, ambassadeur à Varsovie, le 10 décembre 1812, en traversant la Pologne au retour.',
        sens:
          'Il vient d’abandonner son armée et rentre en traîneau : il mesure lui-même la chute, et continue.',
      },
      {
        texte: 'La santé de Sa Majesté n’a jamais été meilleure.',
        qui: 'Le 29ᵉ bulletin de la Grande Armée',
        contexte:
          'Dernière phrase du bulletin dicté à Molodetchno le 3 décembre 1812, publié à Paris le 16.',
        sens:
          'Le bulletin avoue enfin le désastre — et se termine sur la santé de l’empereur. Paris comprend ce jour-là que l’armée n’existe plus.',
      },
      {
        texte: 'Voilà le soleil d’Austerlitz !',
        qui: 'Napoléon Ier',
        contexte: 'Au matin de la bataille de la Moskowa, le 7 septembre 1812, devant Borodino.',
        sens:
          'Il invoque le présage de sa plus belle victoire. La journée sera la plus meurtrière de tout l’Empire.',
      },
      {
        texte: 'Quelle résolution extraordinaire ! Quels hommes ! Ce sont des Scythes !',
        qui: 'Napoléon, devant Moscou en flammes',
        contexte: 'Rapporté par le général de Ségur, le 16 septembre 1812.',
        sens:
          'Ségur a été contesté par d’autres témoins. Le fait, lui, est sûr : les Russes ont brûlé leur propre capitale plutôt que de la livrer.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le 24 juin 1812, la Grande Armée franchit le Niémen : environ 600 000 hommes, dont la moitié ne sont pas français.',
      'Les Russes refusent la bataille, reculent et brûlent tout derrière eux : ni combat, ni ravitaillement.',
      'Le 7 septembre, à la Moskowa (Borodino), 70 000 tués et blessés en une seule journée.',
      'Le 14 septembre, Napoléon entre dans Moscou ; la ville brûle quatre jours et les trois quarts disparaissent.',
      'Il attend cinq semaines une paix qui ne vient pas, puis ordonne la retraite le 19 octobre.',
      'Fin décembre, moins de 100 000 hommes ont repassé le Niémen, ailes comprises.',
    ],
    causes: [
      'Le Blocus continental : depuis 1806, Napoléon ferme l’Europe au commerce anglais, et la Russie, ruinée par l’interdiction, rouvre ses ports en décembre 1810.',
      'Le tsar Alexandre Ier, allié de Tilsit en 1807, se détache de la France et renoue discrètement avec Londres.',
      'La question polonaise : le grand-duché de Varsovie, créé par Napoléon, est vu de Saint-Pétersbourg comme une menace permanente.',
      'Le mariage de Napoléon avec Marie-Louise d’Autriche en 1810, après un refus russe, qui humilie la cour du tsar.',
      'La certitude de Napoléon qu’une seule grande bataille suffira à faire plier Alexandre, comme à Austerlitz et à Friedland.',
      'L’enlisement espagnol : 250 000 hommes immobilisés depuis 1808 privent la Grande Armée de ses meilleures troupes.',
    ],
    recit: [
      {
        titre: 'Une armée d’Europe',
        texte:
          'Ce qui franchit le **Niémen** le 24 juin 1812 n’est pas une armée française : c’est l’Europe entière mise en marche. Sur environ **600 000 hommes**, la moitié sont polonais, italiens, allemands, hollandais, suisses, croates, portugais, espagnols — des alliés de gré ou de force. Vingt nations, une douzaine de langues, 1 400 canons, 180 000 chevaux. Napoléon a prévu des magasins, des convois, des troupeaux ; rien ne suivra. Les routes de Lituanie se défont sous la pluie, puis la chaleur s’installe : il fait 36 degrés, l’eau manque, les chevaux crèvent par milliers dès les premières semaines. Le **typhus**, transporté par les poux, s’installe dans les colonnes. Avant la moindre bataille, avant même Smolensk, l’armée a déjà perdu **100 000 hommes** par la maladie, la désertion et l’épuisement.',
      },
      {
        titre: 'L’ennemi qui recule',
        texte:
          'Napoléon cherche la bataille décisive ; les Russes la lui refusent. **Barclay de Tolly**, puis **Koutouzov**, appliquent une stratégie que nul n’avait osée à cette échelle : reculer toujours, brûler les villages, les récoltes et les moulins, empoisonner les puits, laisser l’espace russe faire le travail. À **Smolensk**, mi-août, la ville est prise mais en cendres. Chaque semaine, la Grande Armée s’enfonce de cent kilomètres de plus dans un pays vide et s’éloigne de ses dépôts. Les soldats mangent les chevaux morts, les officiers tiennent des journaux où revient le même mot : personne. C’est une guerre sans ennemi visible, et c’est précisément pour cela qu’elle se perd : **Napoléon a besoin d’un adversaire qui accepte de se battre**, et il n’en a pas.',
      },
      {
        titre: 'La Moskowa, puis Moscou en flammes',
        texte:
          'Devant Moscou, Koutouzov finit par s’arrêter : le tsar ne peut pas livrer sa capitale sans combat. Le **7 septembre 1812**, près du village de **Borodino**, sur la rivière Moskowa, 130 000 Français affrontent 120 000 Russes retranchés. C’est une bataille frontale de dix heures, à l’artillerie, sans manœuvre : les redoutes sont prises, reprises, reprises encore. Au soir, **70 000 hommes** sont tués ou blessés, dont 48 généraux. Napoléon a le champ de bataille, pas la victoire : l’armée russe se retire en ordre, et il a refusé d’engager la Garde pour l’achever. Le **14 septembre**, il entre dans **Moscou** — une ville presque vide, dont le gouverneur **Rostoptchine** a fait évacuer les habitants et emporter les pompes à incendie. La nuit suivante, le feu prend partout à la fois. Quatre jours durant, les **trois quarts de Moscou** brûlent. Napoléon s’installe au Kremlin et attend une offre de paix. Elle ne viendra jamais : Alexandre a décidé de ne pas répondre.',
      },
      {
        titre: 'La retraite, la faim, la Bérézina',
        texte:
          'Le **19 octobre**, après cinq semaines perdues, l’ordre de retraite est donné. Battu à **Maloïaroslavets**, Napoléon doit reprendre la route dévastée de l’aller. Le froid arrive le 6 novembre ; il descendra à **−30 °C**. Les chevaux, non ferrés à glace, tombent et ne se relèvent pas ; l’artillerie est abandonnée, les colonnes se défont, les cosaques harcèlent les traînards. Fin novembre, l’armée est acculée à la **Bérézina**, rivière dégelée que le pont a été brûlé : pendant trois jours, les **400 pontonniers du général Éblé** travaillent dans l’eau glacée pour bâtir deux passerelles ; presque aucun n’y survivra. **50 000 hommes** passent, des dizaines de milliers de traînards restent sur l’autre rive. Le 5 décembre, à Smorgoni, Napoléon **quitte son armée** pour rentrer à Paris en traîneau, où un obscur général, Malet, a failli renverser l’Empire en annonçant sa mort. Le **29ᵉ bulletin** apprend la vérité aux Français le 16 décembre.',
      },
      {
        titre: 'Ce que le désastre a cassé',
        texte:
          'Les chiffres se discutent encore, jamais l’ordre de grandeur : sur 600 000 partis, **moins de 100 000** repassent le Niémen, et la colonne centrale n’en compte que quelques dizaines de milliers en état de servir. Cent mille prisonniers restent en Russie, où beaucoup mourront ; 200 000 chevaux sont perdus, et la cavalerie française ne s’en relèvera pas — c’est elle qui manquera en 1813 et en 1815. Surtout, quelque chose d’invisible est détruit : **la réputation d’invincibilité**. La Prusse change de camp en février 1813, l’Autriche en août, la **sixième coalition** se forme, et l’Empire perd l’Allemagne à **Leipzig** en octobre 1813. Quinze mois après Moscou, les alliés entrent dans Paris et Napoléon abdique. La campagne de Russie n’a pas seulement coûté une armée : elle a montré à l’Europe qu’il pouvait perdre.',
      },
    ],
    consequences: [
      'La Grande Armée est anéantie : moins de 100 000 hommes reviennent sur 600 000 partis.',
      'La cavalerie française perd 200 000 chevaux et ne sera jamais reconstituée : elle manquera en 1813 et en 1815.',
      'Le mythe de l’invincibilité tombe ; la conspiration Malet montre que l’Empire tient à une seule vie.',
      'La Prusse puis l’Autriche changent de camp : la sixième coalition se forme au printemps 1813.',
      'Défaite à Leipzig en octobre 1813, invasion de la France, abdication le 6 avril 1814.',
      'La Russie devient une grande puissance européenne : Alexandre Ier entrera dans Paris en 1814.',
    ],
    chiffres: [
      { valeur: '600 000', quoi: 'hommes franchissent le Niémen en juin 1812' },
      { valeur: '< 100 000', quoi: 'le repassent en décembre' },
      { valeur: '70 000', quoi: 'tués et blessés à la Moskowa, en une seule journée' },
      { valeur: '−30 °C', quoi: 'pendant la retraite de novembre-décembre' },
    ],
    chrono: [
      { date: '24 juin 1812', fait: 'La Grande Armée franchit le Niémen.' },
      { date: '17-18 août 1812', fait: 'Prise de Smolensk, ville en cendres.' },
      { date: '7 septembre 1812', fait: 'Bataille de la Moskowa : 70 000 tués et blessés.' },
      { date: '14 septembre 1812', fait: 'Entrée dans Moscou ; la ville brûle quatre jours.' },
      { date: '19 octobre 1812', fait: 'Ordre de retraite après cinq semaines d’attente.' },
      { date: '23 octobre 1812', fait: 'Conspiration Malet à Paris : l’Empire vacille.' },
      { date: '26-29 novembre 1812', fait: 'Passage de la Bérézina sur deux ponts de fortune.' },
      { date: '5 décembre 1812', fait: 'Napoléon quitte l’armée à Smorgoni.' },
      { date: '16 décembre 1812', fait: 'Le 29ᵉ bulletin révèle le désastre aux Français.' },
      { date: '16-19 octobre 1813', fait: 'Défaite de Leipzig : l’Allemagne est perdue.' },
    ],
    leSaisTu:
      'En 1869, l’ingénieur français Charles Minard a dessiné la campagne sur une seule feuille : une bande claire qui part large vers Moscou et une bande noire qui revient, de plus en plus fine, avec la température en dessous. Six données en une image. Beaucoup de statisticiens la tiennent pour le meilleur graphique jamais tracé.',
    aRetenir: [
      'En juin 1812, environ 600 000 hommes franchissent le Niémen ; moins de 100 000 reviennent.',
      'Les Russes pratiquent la terre brûlée et refusent la bataille jusqu’à la Moskowa, le 7 septembre.',
      'Moscou, prise le 14 septembre, brûle aux trois quarts ; le tsar refuse toute négociation.',
      'La retraite commence le 19 octobre : froid, faim, cosaques, et le passage de la Bérézina fin novembre.',
      'Le désastre détruit le mythe de l’invincibilité et déclenche la sixième coalition, puis la chute de l’Empire.',
    ],
    mots: [
      {
        mot: 'Blocus continental',
        sens: 'Fermeture de l’Europe au commerce anglais décidée par Napoléon en 1806 pour asphyxier l’Angleterre.',
      },
      {
        mot: 'Terre brûlée',
        sens: 'Stratégie consistant à détruire récoltes, villages et réserves pour priver l’envahisseur de tout ravitaillement.',
      },
      {
        mot: 'Bérézina',
        sens: 'Rivière de Biélorussie ; le mot désigne depuis un désastre complet.',
      },
      {
        mot: 'Bulletin',
        sens: 'Communiqué officiel de l’armée, lu dans toute la France ; le 29ᵉ est le seul à avoir avoué une défaite.',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'bataille-d-austerlitz',
      'bataille-de-waterloo',
      'congres-de-vienne',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Russie',
      'Bérézina',
      'Moskowa',
      'Borodino',
      'Moscou',
      'Koutouzov',
      'Grande Armée',
      'retraite',
      'Niémen',
      'blocus continental',
      '1812',
    ],
  },
  {
    id: 'bataille-de-waterloo',
    volet: 'evenements',
    nom: 'La bataille de Waterloo',
    date: '18 juin 1815',
    tri: 1815,
    periode: 'revolution',
    emoji: '💥',
    lieu: 'Waterloo, au sud de Bruxelles (Belgique)',
    accroche:
      'Revenu de l’île d’Elbe trois mois plus tôt, Napoléon joue tout sur une journée de boue — et perd son empire avant la nuit.',
    citations: [
      {
        texte: 'La garde meurt et ne se rend pas.',
        qui: 'Attribué au général Cambronne',
        contexte:
          'Au dernier carré de la Vieille Garde sommé de se rendre, le soir du 18 juin 1815.',
        sens:
          'La phrase a en réalité été écrite par un journaliste parisien le 19 juin. Cambronne, fait prisonnier et bien vivant, l’a toujours démentie.',
        incertaine: true,
      },
      {
        texte: 'Merde !',
        qui: 'Attribué au général Cambronne',
        contexte:
          'La réponse qu’on lui prête vraiment, au même moment ; Victor Hugo en fait dans *Les Misérables* « le plus beau mot peut-être qu’un Français ait jamais dit ».',
        sens: 'Cambronne a nié celle-là aussi. On l’appelle depuis « le mot de Cambronne ».',
        incertaine: true,
      },
      {
        texte: 'Venez voir comment meurt un maréchal de France !',
        qui: 'Le maréchal Ney',
        contexte:
          'À pied, l’épée brisée, après avoir eu cinq chevaux tués sous lui, à la fin de la journée du 18 juin 1815.',
        sens:
          'Il ne mourra pas là : la Restauration le fera fusiller le 7 décembre 1815 pour avoir rejoint Napoléon.',
      },
      {
        texte: 'La nuit, ou Blücher !',
        qui: 'Attribué au duc de Wellington',
        contexte: 'Dans l’après-midi du 18 juin, en attendant les Prussiens sous le feu français.',
        sens:
          'Les deux sont arrivés, et c’est Blücher le premier. Wellington dira de la journée : « Ce fut l’affaire la plus serrée que vous ayez jamais vue. »',
        incertaine: true,
      },
    ],
    reperes: [
      'Napoléon quitte l’île d’Elbe le 26 février 1815 et rentre à Paris le 20 mars : ce sont les Cent-Jours.',
      'Le 18 juin, 73 000 Français affrontent 68 000 Anglo-Néerlandais, puis 50 000 Prussiens dans l’après-midi.',
      'La pluie de la nuit retarde l’attaque jusqu’à 11 h 30 : le sol est trop détrempé pour l’artillerie.',
      'Grouchy, parti avec 33 000 hommes poursuivre les Prussiens, ne reviendra jamais sur le champ de bataille.',
      'Les charges de cavalerie de Ney se brisent sur les carrés anglais, sans soutien d’infanterie.',
      'Le 22 juin, Napoléon abdique une seconde fois ; il mourra à Sainte-Hélène le 5 mai 1821.',
    ],
    causes: [
      'Le traité de Fontainebleau (1814) laisse Napoléon souverain de l’île d’Elbe, à 250 km des côtes françaises, avec 600 hommes et le temps de réfléchir.',
      'La Restauration mécontente vite : drapeau blanc, émigrés de retour, demi-solde imposée à 12 000 officiers.',
      'Le retour de l’île d’Elbe : débarqué le 1er mars 1815, Napoléon reprend le pouvoir en vingt jours sans un coup de feu.',
      'Le congrès de Vienne, encore réuni, le déclare « hors la loi » dès le 13 mars et remobilise près de 700 000 hommes contre lui.',
      'L’urgence de frapper avant l’arrivée des Russes et des Autrichiens : seules deux armées alliées sont déjà en Belgique.',
      'L’erreur du 16 juin : battus à Ligny, les Prussiens reculent vers Wavre et non vers l’est — Napoléon croit les avoir écartés, ils sont à une demi-journée de marche.',
    ],
    recit: [
      {
        titre: 'Les Cent-Jours',
        texte:
          'Exilé à l’**île d’Elbe** avec un titre de souverain et six cents hommes, Napoléon regarde la France se lasser de **Louis XVIII** : les émigrés réclament leurs terres, l’armée impériale est mise en demi-solde, le drapeau blanc remplace le tricolore. Le **1er mars 1815**, il débarque à Golfe-Juan avec mille hommes et remonte par les Alpes — le **chemin qu’on appellera la route Napoléon**. À Laffrey, il marche seul vers un bataillon envoyé pour l’arrêter et ouvre sa redingote : les soldats passent de son côté. **Ney**, qui avait promis à Louis XVIII de le ramener « dans une cage de fer », le rejoint à Auxerre. Le 20 mars, le roi est parti et Napoléon couche aux Tuileries. Vingt jours, pas un mort. Mais le **congrès de Vienne** siège encore, et il répond en sept jours : Napoléon est mis **hors la loi** comme ennemi public de l’Europe, et sept cent mille hommes se mettent en marche.',
      },
      {
        titre: 'Trois armées en Belgique',
        texte:
          'Il ne peut pas attendre : dans six semaines, Russes et Autrichiens seront sur le Rhin. En Belgique, en revanche, deux armées sont déjà là et séparées — **Wellington** avec les Anglo-Néerlandais au nord-ouest, **Blücher** avec les Prussiens à l’est. Le plan est classique et bon : s’enfoncer entre les deux et les battre l’une après l’autre. Le **16 juin**, il bat Blücher à **Ligny** pendant que Ney tient les Anglais aux **Quatre-Bras**. Mais la victoire est incomplète, et surtout la poursuite est mal faite : le maréchal **Grouchy** part le 17 avec **33 000 hommes** — un tiers de l’armée — sur une piste qu’il perd. Les Prussiens, battus mais intacts, ne fuient pas vers l’est comme Napoléon le suppose : ils reculent au nord, vers **Wavre**, c’est-à-dire vers Wellington. Toute la bataille du lendemain tient dans ce malentendu.',
      },
      {
        titre: 'La journée du 18 juin',
        texte:
          'Il a plu toute la nuit sur le plateau de **Mont-Saint-Jean**. Le sol détrempé interdit de manœuvrer les canons : Napoléon repousse l’attaque à **11 h 30**, trois heures perdues qui vont décider de tout. La journée se joue autour de trois points. À droite des Anglais, la ferme d’**Hougoumont**, où une diversion devient un gouffre et aspire des heures et des milliers d’hommes. Au centre, la ferme de **La Haie-Sainte**, prise seulement vers 18 heures. Et entre les deux, vers 16 heures, **Ney** lance la cavalerie — environ 9 000 cuirassiers et lanciers — contre l’infanterie anglaise formée en **carrés**, sans infanterie ni canons pour les soutenir. Les carrés tiennent ; les charges se brisent, reviennent, se brisent encore. Wellington, qui a fait coucher ses lignes derrière la crête, attend en répétant qu’il lui faut la nuit ou Blücher.',
      },
      {
        titre: 'Blücher, et la Garde qui recule',
        texte:
          'Vers 16 h 30, des troupes apparaissent à droite du champ de bataille. Ce ne sont pas celles de Grouchy : c’est **Bülow**, avant-garde de Blücher, arrivé de Wavre malgré les chemins défoncés. Napoléon doit détacher un corps entier pour tenir le village de **Plancenoit**, qui changera cinq fois de mains. À 19 h 30, il joue sa dernière carte et lance la **Garde impériale** — qui n’avait jamais reculé — sur le centre anglais. Elle monte sous la mitraille, s’arrête, et redescend. Le cri court dans les rangs français : « *La Garde recule !* » Tout se défait en quelques minutes. Wellington fait avancer sa ligne entière, les Prussiens percent à Plancenoit, et l’armée française se désagrège dans la nuit. Seuls quelques **carrés de la Vieille Garde** reculent en ordre, protégeant la fuite — c’est autour de l’un d’eux qu’est née la phrase de **Cambronne**.',
      },
      {
        titre: 'Après la nuit',
        texte:
          'Le champ de bataille tient dans quelques kilomètres carrés, et il y reste environ **48 000 morts et blessés** : 25 000 Français, 17 000 alliés de Wellington, 7 000 Prussiens. Napoléon rentre à Paris et **abdique le 22 juin** en faveur de son fils, que personne ne reconnaîtra. Il se rend aux Anglais le 15 juillet à bord du *Bellérophon*, et part pour **Sainte-Hélène**, un rocher de l’Atlantique sud à 1 900 km de toute terre, où il meurt le 5 mai 1821. Louis XVIII revient, la France perd ses frontières de 1792, paie 700 millions d’indemnité et subit cinq ans d’occupation. Le nom du village belge est devenu un nom commun : dans plusieurs langues, « son Waterloo » désigne la défaite qui finit une carrière. Victor Hugo lui consacrera dix-neuf chapitres des *Misérables*, écrits sur place.',
      },
    ],
    consequences: [
      'Seconde abdication de Napoléon le 22 juin 1815, six jours après la bataille.',
      'Exil à Sainte-Hélène, où il dicte le Mémorial et construit sa propre légende jusqu’à sa mort en 1821.',
      'Seconde Restauration : Louis XVIII revient, suivie de la Terreur blanche contre les bonapartistes ; Ney est fusillé.',
      'Second traité de Paris (20 novembre 1815) : frontières de 1790, 700 millions d’indemnité, cinq ans d’occupation.',
      'L’ordre européen dessiné à Vienne est verrouillé : plus aucune guerre générale en Europe avant 1914.',
      'Le mot « Waterloo » devient un nom commun pour désigner une défaite définitive.',
    ],
    chiffres: [
      { valeur: '73 000', quoi: 'Français, contre 118 000 alliés en fin de journée' },
      { valeur: '≈ 48 000', quoi: 'morts et blessés sur quelques kilomètres carrés' },
      { valeur: '33 000', quoi: 'hommes immobilisés avec Grouchy, loin du champ de bataille' },
      { valeur: '110', quoi: 'jours de second règne, du 20 mars au 8 juillet 1815' },
    ],
    chrono: [
      { date: '1er mars 1815', fait: 'Napoléon débarque à Golfe-Juan avec mille hommes.' },
      { date: '13 mars 1815', fait: 'Le congrès de Vienne le déclare hors la loi.' },
      { date: '20 mars 1815', fait: 'Retour aux Tuileries : début des Cent-Jours.' },
      { date: '16 juin 1815', fait: 'Ligny et les Quatre-Bras : les Prussiens reculent vers Wavre.' },
      { date: '18 juin, 11 h 30', fait: 'L’attaque commence, retardée par la boue.' },
      { date: '18 juin, 16 h', fait: 'Les charges de Ney se brisent sur les carrés anglais.' },
      { date: '18 juin, 16 h 30', fait: 'Les Prussiens de Bülow débouchent sur le flanc droit.' },
      { date: '18 juin, 19 h 30', fait: 'La Garde impériale attaque et recule : l’armée se défait.' },
      { date: '22 juin 1815', fait: 'Seconde abdication de Napoléon.' },
      { date: '15 juillet 1815', fait: 'Il se rend aux Anglais ; départ pour Sainte-Hélène.' },
    ],
    leSaisTu:
      'Victor Hugo a écrit les dix-neuf chapitres de Waterloo des *Misérables* dans une auberge du village, en 1861, en arpentant le champ de bataille chaque jour. C’est lui qui a imposé le chemin creux d’Ohain, ce ravin où les cuirassiers se seraient engloutis : les historiens en discutent encore, les lecteurs le voient toujours.',
    aRetenir: [
      'Le 18 juin 1815, Napoléon est battu à Waterloo par Wellington et Blücher, au sud de Bruxelles.',
      'La bataille clôt les Cent-Jours, commencés le 1er mars avec le retour de l’île d’Elbe.',
      'Grouchy et ses 33 000 hommes manquent à l’appel, tandis que les Prussiens arrivent vers 16 h 30.',
      'La Garde impériale recule pour la première fois : l’armée française se désagrège en une heure.',
      'Napoléon abdique le 22 juin et meurt à Sainte-Hélène le 5 mai 1821.',
    ],
    mots: [
      {
        mot: 'Cent-Jours',
        sens: 'Second règne de Napoléon, du retour de l’île d’Elbe en mars 1815 au retour de Louis XVIII en juillet.',
      },
      {
        mot: 'Carré',
        sens: 'Formation défensive de l’infanterie : quatre rangs face à l’extérieur, infranchissable pour la cavalerie.',
      },
      {
        mot: 'Demi-solde',
        sens: 'Solde réduite de moitié imposée en 1814 aux officiers de l’Empire mis à la retraite forcée.',
      },
      {
        mot: 'Hors la loi',
        sens: 'Mise au ban : celui qui est déclaré tel peut être arrêté ou tué par quiconque, sans jugement.',
      },
    ],
    lies: [
      'napoleon-bonaparte',
      'campagne-de-russie',
      'congres-de-vienne',
      'bataille-d-austerlitz',
      'louis-xviii',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Waterloo',
      'Cent-Jours',
      'Wellington',
      'Blücher',
      'Ney',
      'Grouchy',
      'Cambronne',
      'île d’Elbe',
      'Sainte-Hélène',
      'Garde impériale',
      'Mont-Saint-Jean',
    ],
  },
  {
    id: 'congres-de-vienne',
    volet: 'evenements',
    nom: 'Le congrès de Vienne',
    date: 'septembre 1814 – juin 1815',
    tri: 1814,
    fin: 1815,
    periode: 'revolution',
    emoji: '🗺️',
    lieu: 'Vienne, capitale de l’Autriche',
    accroche:
      'Les vainqueurs de Napoléon redessinent l’Europe autour d’un tapis vert et fabriquent un ordre des rois qui tiendra jusqu’en 1848.',
    citations: [
      {
        texte: 'Le congrès danse beaucoup, mais il ne marche pas.',
        qui: 'Le prince de Ligne',
        contexte:
          'À Vienne, à l’automne 1814, devant les bals et les chasses qui occupent les délégations pendant que les négociations s’enlisent.',
        sens:
          'Le vieux maréchal, qui connaissait toutes les cours d’Europe, meurt en décembre 1814 sans voir la fin du congrès.',
      },
      {
        texte: 'La France ne demande rien, elle n’a besoin de rien : je viens vous apporter un principe.',
        qui: 'Talleyrand',
        contexte: 'En arrivant au congrès, en septembre 1814, comme représentant du pays vaincu.',
        sens:
          'Le principe est celui de **légitimité** : les trônes appartiennent à leurs anciennes dynasties. En l’imposant, il fait de la France un juge au lieu d’un accusé.',
      },
      {
        texte:
          'Les trois monarques se regarderont comme compatriotes et se prêteront en toute occasion assistance, comme des membres d’une même famille chrétienne.',
        qui: 'Le pacte de la Sainte-Alliance',
        contexte: 'Texte signé à Paris le 26 septembre 1815 par les souverains de Russie, d’Autriche et de Prusse.',
        sens:
          'Derrière le vocabulaire fraternel, un engagement très concret : s’aider militairement contre toute révolution.',
      },
      {
        texte: 'Un morceau de mysticisme sublime et de non-sens.',
        qui: 'Lord Castlereagh, ministre britannique des Affaires étrangères',
        contexte: 'Jugement sur le texte de la Sainte-Alliance, que l’Angleterre refuse de signer.',
        sens:
          'Londres veut l’équilibre des puissances, pas une croisade des rois : elle restera à l’écart du système des congrès.',
      },
    ],
    reperes: [
      'Ouvert en septembre 1814, il signe son acte final le 9 juin 1815, neuf jours avant Waterloo.',
      'Quatre vainqueurs décident : Autriche (Metternich), Russie (Alexandre Ier), Angleterre (Castlereagh), Prusse.',
      'Talleyrand, envoyé d’un pays vaincu, s’impose à la table au nom du principe de légitimité.',
      'Près de 200 États, villes et maisons princières envoient des délégations ; presque aucune ne vote.',
      'Autour de la France, on bâtit des barrières : royaume des Pays-Bas, Confédération germanique, Sardaigne agrandie.',
      'La Sainte-Alliance du 26 septembre 1815 engage les rois à s’entraider contre toute révolution.',
    ],
    causes: [
      'La chute de Napoléon en avril 1814 laisse une Europe sans frontières reconnues : vingt-deux ans de guerres et de conquêtes ont tout déplacé.',
      'Le traité de Chaumont (mars 1814) engageait les quatre alliés à ne pas traiter séparément et à se réunir ensuite pour régler le continent.',
      'La disparition du Saint-Empire romain germanique, supprimé en 1806 : trois cents États allemands sont à reclasser.',
      'La volonté de Metternich et des souverains d’effacer la Révolution en rendant les trônes à leurs dynasties « légitimes ».',
      'Les appétits contradictoires des vainqueurs : la Russie veut la Pologne, la Prusse veut la Saxe, et l’Angleterre ne veut ni l’une ni l’autre.',
      'La nécessité de contenir la France sans l’humilier au point de la pousser à la revanche — une leçon que 1919 oubliera.',
    ],
    recit: [
      {
        titre: 'Une Europe à recoudre',
        texte:
          'En avril 1814, Napoléon abdique et part pour l’île d’Elbe. Le continent qu’il laisse ne ressemble plus à celui de 1789 : le **Saint-Empire** a été dissous, la Pologne partagée puis ressuscitée en grand-duché, l’Italie découpée en royaumes de famille, la Rhénanie française, l’Espagne occupée. Aucune frontière n’est plus reconnue par tout le monde. Les vainqueurs se donnent donc rendez-vous à **Vienne**, capitale de l’Autriche, autour de **Metternich**. On y voit arriver deux empereurs, quatre rois, des dizaines de princes, des centaines de délégations : les grands hôtels sont pleins, l’empereur d’Autriche paie tout et manque s’y ruiner. Le travail réel se fait à quelques-uns, dans un salon ; le reste danse. Le **prince de Ligne** résume : « Le congrès danse beaucoup, mais il ne marche pas. »',
      },
      {
        titre: 'Talleyrand entre par la porte des vaincus',
        texte:
          'La France envoie **Talleyrand**, ancien évêque, ancien ministre de la Révolution, du Consulat et de l’Empire, désormais au service de Louis XVIII. Il arrive en représentant d’un pays battu, exclu des discussions importantes. Il va en ressortir en quatrième puissance, et il n’a qu’un outil : un **principe**. Les vainqueurs veulent se partager des territoires ; il leur oppose la **légitimité** — un trône appartient à sa dynastie, on ne se donne pas les royaumes des autres. C’est ce qui protège Louis XVIII, mais aussi le roi de Saxe que la Prusse veut dépouiller. Quand la crise polono-saxonne menace de faire éclater le congrès, Talleyrand signe le **3 janvier 1815** un traité secret avec l’Autriche et l’Angleterre contre la Russie et la Prusse. Le bluff marche : la Prusse n’obtient que deux cinquièmes de la Saxe, et la France est à la table pour de bon.',
      },
      {
        titre: 'La carte du 9 juin 1815',
        texte:
          'L’**acte final**, signé le 9 juin 1815, redessine le continent selon deux règles : rendre les trônes, et entourer la France de barrières. Les Pays-Bas du Sud (la future Belgique) sont réunis à la Hollande dans un **royaume des Pays-Bas** ; la Prusse reçoit la **Rhénanie**, ce qui la place face à la France ; le **Piémont-Sardaigne** récupère Gênes et Nice ; la **Suisse**, avec vingt-deux cantons, est déclarée neutre à perpétuité. L’Allemagne devient une **Confédération germanique** de **39 États** présidée par l’Autriche — trois cents avant 1806. L’Autriche prend la **Lombardie et la Vénétie**, la Russie garde un « royaume de Pologne » dont le tsar est roi, l’Angleterre conserve Malte, Le Cap et Ceylan. Partout, les dynasties reviennent : Bourbons en France, en Espagne et à Naples, pape dans ses États. Une déclaration du 8 février 1815 condamne la **traite des Noirs** : c’est la première condamnation internationale de l’histoire.',
      },
      {
        titre: 'Légitimité et Sainte-Alliance',
        texte:
          'Reste à faire tenir tout cela. Le **26 septembre 1815**, le tsar **Alexandre Ier**, mystique et convaincu, fait signer à l’Autriche et à la Prusse la **Sainte-Alliance** : les souverains y promettent de se conduire en frères chrétiens — c’est-à-dire de s’entraider contre toute révolution chez le voisin. L’Angleterre refuse de signer, le pape aussi. Le 20 novembre, une **Quadruple-Alliance** plus concrète lie Angleterre, Autriche, Prusse et Russie, et prévoit des **congrès réguliers** : Aix-la-Chapelle en 1818, Troppau en 1820, Laybach en 1821, Vérone en 1822. C’est la première fois que des puissances organisent la gestion permanente d’un continent. Et cela fonctionne au sens où elles l’entendent : l’Autriche écrase les révolutions italiennes de 1821, la France envoie en 1823 une armée rétablir le roi d’Espagne.',
      },
      {
        titre: 'Ce que le congrès n’a pas vu',
        texte:
          'Les diplomates de Vienne ont compté des sujets, des villes et des revenus ; ils n’ont pas compté les **peuples**. Belges rattachés aux Hollandais, Polonais partagés, Italiens sous autorité autrichienne, Allemands répartis en trente-neuf souverainetés : chacune de ces lignes deviendra une révolution. **1830** emporte la Belgique et embrase la Pologne, **1848** — le « printemps des peuples » — jette Metternich lui-même hors de Vienne le 13 mars, après trente-neuf ans de pouvoir. L’unité italienne se fera en 1861, l’unité allemande en 1871, contre la carte de 1815. Et pourtant l’autre part du bilan tient : entre 1815 et **1914**, l’Europe ne connaît aucune guerre générale. Quatre-vingt-dix-neuf ans, le plus long répit du continent moderne, obtenus par des hommes qui avaient vu ce qu’une génération de guerre coûte.',
      },
    ],
    consequences: [
      'L’Europe des rois est restaurée : Bourbons en France, en Espagne et à Naples, princes allemands et italiens rétablis.',
      'La France revient à ses frontières de 1792, puis de 1790 après Waterloo, avec 700 millions d’indemnité et cinq ans d’occupation.',
      'La Confédération germanique de 39 États remplace le Saint-Empire ; l’Autriche domine l’Allemagne et l’Italie du Nord.',
      'La Sainte-Alliance et le système des congrès font de l’intervention contre les révolutions un principe européen.',
      'Les peuples ne sont pas consultés : Belges, Polonais, Italiens et Allemands se soulèveront en 1830 puis en 1848.',
      'Aucune guerre générale en Europe entre 1815 et 1914 : l’équilibre voulu à Vienne a tenu près d’un siècle.',
    ],
    chiffres: [
      { valeur: '≈ 200', quoi: 'États, villes et maisons princières représentés à Vienne' },
      { valeur: '9 mois', quoi: 'de négociations, de septembre 1814 à juin 1815' },
      { valeur: '39', quoi: 'États dans la Confédération germanique, contre plus de 300 avant 1806' },
      { valeur: '33 ans', quoi: 'avant que le printemps des peuples de 1848 ne balaie cet ordre' },
    ],
    chrono: [
      { date: '9 mars 1814', fait: 'Traité de Chaumont : les alliés s’engagent à régler l’Europe ensemble.' },
      { date: '30 mai 1814', fait: 'Premier traité de Paris : la France revient à ses frontières de 1792.' },
      { date: 'septembre 1814', fait: 'Les délégations arrivent à Vienne ; Talleyrand s’impose à la table.' },
      { date: '3 janvier 1815', fait: 'Traité secret France-Autriche-Angleterre contre Russie et Prusse.' },
      { date: '8 février 1815', fait: 'Déclaration condamnant la traite des Noirs.' },
      { date: '13 mars 1815', fait: 'Napoléon, revenu d’Elbe, est mis hors la loi par le congrès.' },
      { date: '9 juin 1815', fait: 'Signature de l’acte final du congrès de Vienne.' },
      { date: '26 septembre 1815', fait: 'Pacte de la Sainte-Alliance à Paris.' },
      { date: '20 novembre 1815', fait: 'Second traité de Paris et Quadruple-Alliance.' },
      { date: '13 mars 1848', fait: 'Metternich chassé de Vienne : l’ordre de 1815 se fissure.' },
    ],
    leSaisTu:
      'La police autrichienne a espionné le congrès du premier au dernier jour : les domestiques des hôtels revendaient le contenu des corbeilles à papier, les lettres étaient ouvertes à la vapeur puis recachetées avant la distribution du matin. Des milliers de ces rapports sont conservés à Vienne — les historiens y lisent les négociations mieux que les participants ne les ont vécues.',
    aRetenir: [
      'Le congrès de Vienne siège de septembre 1814 à juin 1815 pour réorganiser l’Europe après Napoléon.',
      'Metternich, Alexandre Ier, Castlereagh et la Prusse décident ; Talleyrand y fait entrer la France vaincue.',
      'Le principe de légitimité rend les trônes aux anciennes dynasties et entoure la France d’États-barrières.',
      'La Sainte-Alliance (26 septembre 1815) engage les rois à intervenir contre toute révolution.',
      'La carte ignore les peuples : d’où les révolutions de 1830 et de 1848, qui emportent cet ordre.',
    ],
    mots: [
      {
        mot: 'Légitimité',
        sens: 'Principe selon lequel le pouvoir appartient de droit aux dynasties qui régnaient avant la Révolution.',
      },
      {
        mot: 'Sainte-Alliance',
        sens: 'Pacte de 1815 entre les souverains de Russie, d’Autriche et de Prusse pour défendre ensemble l’ordre monarchique.',
      },
      {
        mot: 'Équilibre européen',
        sens: 'Idée qu’aucune puissance ne doit dominer les autres : le partage de 1815 en est l’application.',
      },
      {
        mot: 'Confédération germanique',
        sens: 'Union lâche de 39 États allemands créée en 1815 sous la présidence de l’Autriche.',
      },
    ],
    lies: [
      'bataille-de-waterloo',
      'talleyrand',
      'louis-xviii',
      'campagne-de-russie',
      'revolution-de-1830',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'congrès de Vienne',
      'Metternich',
      'Talleyrand',
      'Sainte-Alliance',
      'légitimité',
      'Castlereagh',
      'Confédération germanique',
      'équilibre européen',
      '1815',
      'Restauration',
    ],
  },
]
