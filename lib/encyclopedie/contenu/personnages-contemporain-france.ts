// -----------------------------------------------------------------------------
// MONDE CONTEMPORAIN — la France d'après 1945 : ceux qui ont réconcilié
// l'Europe (Schuman, Monnet), écrit les droits de l'homme (Cassin), arrêté une
// guerre (Mendès France), gouverné (Pompidou, Mitterrand), logé les sans-abri
// (l'abbé Pierre) et fait voter la loi de 1975 (Simone Veil).
//
// Deux consignes du guide se croisent ici (docs/encyclopedie.md) : les figures
// chrétiennes — Schuman, l'abbé Pierre — sont racontées avec leur foi prise au
// sérieux comme moteur de leurs actes ; et sur les pages douloureuses ou
// disputées (Vichy, la francisque, l'Algérie, les révélations de 2024), on est
// factuel, daté, sobre — ni hagiographie, ni réquisitoire.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_CONTEMPORAIN_FRANCE: Personnage[] = [
  {
    id: 'robert-schuman',
    volet: 'personnages',
    nom: 'Robert Schuman',
    surnom: 'le père de l’Europe',
    dates: '1886 – 1963',
    tri: 1963,
    periode: 'contemporain',
    emoji: '🕊️',
    roles: ['Ministre des Affaires étrangères', 'Président du Conseil', 'Député de la Moselle'],
    origine: 'Clausen, Luxembourg',
    accroche:
      'Le 9 mai 1950, il propose de mettre le charbon et l’acier français et allemands en commun : cinq ans après la guerre, l’Europe commence là.',
    citations: [
      {
        texte:
          'L’Europe ne se fera pas d’un coup, ni dans une construction d’ensemble : elle se fera par des réalisations concrètes créant d’abord une solidarité de fait.',
        contexte: 'Déclaration du 9 mai 1950, salon de l’Horloge du Quai d’Orsay, devant la presse.',
        sens:
          'Inutile d’attendre que les peuples s’entendent sur tout : on commence par un chantier commun, et l’habitude de travailler ensemble fait le reste.',
      },
      {
        texte:
          'La mise en commun des productions de charbon et d’acier rendra toute guerre entre la France et l’Allemagne non seulement impensable, mais matériellement impossible.',
        contexte:
          'Déclaration du 9 mai 1950. Le charbon et l’acier sont alors la matière première des canons.',
      },
      {
        texte:
          'Tous les pays d’Europe sont imprégnés de la civilisation chrétienne. Elle est l’âme de l’Europe qu’il faut lui rendre.',
        contexte: '*Pour l’Europe*, recueil de ses textes publié en 1963, l’année de sa mort.',
      },
    ],
    reperes: [
      'Né au Luxembourg d’un père lorrain devenu allemand en 1871 : il ne sera français qu’en 1919, à 33 ans.',
      'Député de la Moselle de 1919 à 1940 ; arrêté par la Gestapo en 1940, évadé d’Allemagne en 1942.',
      'Président du Conseil en 1947-1948, puis ministre des Affaires étrangères de 1948 à 1953.',
      'Le 9 mai 1950, il lit la déclaration qui fonde la CECA : c’est aujourd’hui la journée de l’Europe.',
      'Premier président de l’Assemblée parlementaire européenne (1958-1960), qui le proclame « père de l’Europe ».',
      'Catholique fervent, resté célibataire et pauvre ; l’Église l’a déclaré vénérable en 2021.',
    ],
    recit: [
      {
        titre: 'L’homme des trois frontières',
        texte:
          'Robert Schuman naît en 1886 à **Clausen**, au Luxembourg, d’une mère luxembourgeoise et d’un père lorrain devenu allemand quand l’Empire a annexé la **Moselle** en 1871. Il fait ses études de droit à Bonn, Munich, Berlin et Strasbourg, et reste sujet allemand jusqu’à trente-trois ans. Quand la Moselle redevient française, en **1919**, il devient français et se fait élire député de Thionville : il le restera jusqu’en 1940. Il connaît donc de l’intérieur les deux pays qui se sont saignés trois fois en soixante-dix ans, et il parle les deux langues sans accent. En juillet 1940, comme la quasi-totalité des parlementaires réunis à Vichy, il vote les pleins pouvoirs au maréchal Pétain ; deux mois plus tard, la **Gestapo l’arrête** comme notable lorrain hostile à l’annexion. Emprisonné, puis assigné à résidence dans le Palatinat, il s’évade en **1942** et se cache jusqu’à la Libération dans des monastères français.',
      },
      {
        titre: 'Le 9 mai 1950',
        texte:
          'Ministre des Affaires étrangères depuis 1948, Schuman a un problème insoluble sur son bureau : les Alliés veulent relever les limites imposées à la sidérurgie allemande, et la France redoute qu’une Allemagne réarmée recommence. **Jean Monnet** lui apporte alors un texte de quelques pages : placer toute la production française et allemande de charbon et d’acier sous une **autorité commune**, ouverte aux autres pays d’Europe. Schuman dit oui le 28 avril, obtient en secret l’accord du chancelier **Konrad Adenauer**, et convoque la presse au Quai d’Orsay le **9 mai 1950** à 18 heures. La plupart des ministres français découvrent le projet le matin même. En vingt minutes de lecture, l’ennemi héréditaire devient un associé — et l’on ne parle ni de drapeau, ni de constitution, ni de grands principes : on parle de tonnes de charbon.',
      },
      {
        titre: 'De la CECA au traité de Rome',
        texte:
          'Le **traité de Paris du 18 avril 1951** crée la **CECA**, Communauté européenne du charbon et de l’acier, entre six pays : France, Allemagne de l’Ouest, Italie, Belgique, Pays-Bas, Luxembourg. Une **Haute Autorité** indépendante des gouvernements, installée à Luxembourg et présidée par Monnet, décide à leur place sur ces deux produits : c’est la première fois que des États acceptent une autorité au-dessus d’eux en temps de paix. L’élan suivant échoue — l’Assemblée nationale enterre en 1954 le projet d’armée européenne — mais la méthode tient : le **traité de Rome du 25 mars 1957** étend le marché commun à toute l’économie et donne la **CEE**, qui deviendra l’Union européenne. Schuman préside de 1958 à 1960 la première assemblée parlementaire européenne, qui lui décerne le titre de « père de l’Europe ».',
      },
      {
        titre: 'Un chrétien en politique',
        texte:
          'Sa foi n’est pas un décor : elle commande sa vie et son projet. Catholique pratiquant, resté célibataire, il vit sans domesticité dans une maison modeste de **Scy-Chazelles**, en Moselle, lit les Pères de l’Église et va à la messe chaque matin avant le conseil des ministres. La **réconciliation franco-allemande** est pour lui un devoir chrétien autant qu’un calcul politique : pardonner sans oublier, et enlever aux nations les moyens matériels de recommencer. Ce n’est pas un hasard si les trois hommes du 9 mai 1950 — Schuman, **Adenauer** en Allemagne, **De Gasperi** en Italie — sont trois démocrates-chrétiens qui parlent tous allemand et ont tous vécu sur une frontière disputée. Mort en 1963, Schuman a vu naître la Communauté ; l’Église a ouvert en 1990 un procès en béatification et l’a déclaré **vénérable** en 2021.',
      },
    ],
    chrono: [
      { date: '1886', fait: 'Naissance à Clausen, au Luxembourg.' },
      { date: '1919', fait: 'La Moselle redevient française : il est élu député.' },
      { date: '1940', fait: 'Arrêté par la Gestapo, puis assigné à résidence en Allemagne.' },
      { date: '1948', fait: 'Ministre des Affaires étrangères, jusqu’en 1953.' },
      { date: '9 mai 1950', fait: 'Déclaration Schuman, au Quai d’Orsay.' },
      { date: '18 avril 1951', fait: 'Traité de Paris : la CECA est créée à six.' },
      { date: '25 mars 1957', fait: 'Traité de Rome : naissance du Marché commun.' },
      { date: '1958', fait: 'Premier président de l’Assemblée parlementaire européenne.' },
      { date: '1963', fait: 'Mort à Scy-Chazelles, en Moselle.' },
    ],
    leSaisTu:
      'Le texte du 9 mai fut tenu si secret que les journalistes convoqués au Quai d’Orsay ignoraient le sujet de la conférence, et que la plupart des ministres français l’ont découvert le matin même en conseil. Seul Adenauer avait été prévenu, par un messager parti pour Bonn : son « oui » est arrivé quelques heures avant la lecture.',
    aRetenir: [
      'Robert Schuman est ministre des Affaires étrangères quand il lit, le 9 mai 1950, la déclaration qui lance la construction européenne.',
      'Elle propose de placer le charbon et l’acier français et allemands sous une autorité commune : c’est la CECA, créée par le traité de Paris du 18 avril 1951.',
      'Six pays la fondent : France, Allemagne de l’Ouest, Italie, Belgique, Pays-Bas et Luxembourg.',
      'Le traité de Rome du 25 mars 1957 prolonge la CECA par la Communauté économique européenne (CEE).',
      'Le 9 mai est depuis devenu la journée de l’Europe.',
    ],
    mots: [
      {
        mot: 'CECA',
        sens: 'Communauté européenne du charbon et de l’acier (1951) : un marché commun limité à deux produits, dirigé par une autorité indépendante des États.',
      },
      {
        mot: 'Supranational',
        sens: 'Se dit d’une institution placée au-dessus des États, et dont les décisions s’imposent à eux.',
      },
      {
        mot: 'Démocratie chrétienne',
        sens: 'Courant politique qui puise ses principes dans la doctrine sociale de l’Église : Schuman, Adenauer et De Gasperi en viennent.',
      },
    ],
    lies: ['jean-monnet', 'rene-cassin', 'traite-de-rome', 'charles-de-gaulle'],
    niveaux: ['3e', 'Tle'],
    programme: 'Affirmation et mise en œuvre du projet européen',
    tags: [
      'CECA',
      '9 mai 1950',
      'déclaration Schuman',
      'Quai d’Orsay',
      'Moselle',
      'Adenauer',
      'charbon et acier',
      'réconciliation franco-allemande',
      'père de l’Europe',
    ],
  },
  {
    id: 'georges-pompidou',
    volet: 'personnages',
    nom: 'Georges Pompidou',
    surnom: 'le professeur devenu président',
    dates: '1911 – 1974',
    tri: 1974,
    periode: 'contemporain',
    emoji: '🏗️',
    roles: ['Président de la République', 'Premier ministre', 'Agrégé de lettres'],
    origine: 'Montboudif, Cantal',
    accroche:
      'Fils d’instituteurs du Cantal, professeur de lettres puis banquier, il est six ans Premier ministre de de Gaulle avant de lui succéder.',
    citations: [
      {
        texte: 'Françaises, Français, le général de Gaulle est mort. La France est veuve.',
        contexte: 'Allocution télévisée du 10 novembre 1970, au lendemain de la mort du Général.',
        sens:
          'En deux phrases, le successeur dit à la fois la perte du pays et la fin d’une époque — puis il enchaîne sur le travail à poursuivre.',
      },
      {
        texte:
          'Arrêtez d’emmerder les Français ! Il y a trop de lois, trop de textes, trop de règlements dans ce pays. On en crève.',
        contexte: 'Rapporté par Jacques Chirac, alors jeune ministre de son gouvernement.',
        sens:
          'La formule varie selon les récits et n’a jamais été prononcée en public, mais elle a fait fortune : elle résume sa méfiance des règlements qui paralysent.',
        incertaine: true,
      },
      {
        texte:
          'Je voudrais passionnément que Paris possède un centre culturel qui soit à la fois un musée et un centre de création.',
        contexte: 'Déclaration de 1972 sur le projet du plateau Beaubourg, publiée dans *Le Monde*.',
      },
    ],
    reperes: [
      'Né dans le Cantal en 1911, fils d’instituteurs ; normalien et agrégé de lettres à 24 ans.',
      'Directeur général de la banque Rothschild, puis directeur de cabinet du général de Gaulle en 1958.',
      'Premier ministre d’avril 1962 à juillet 1968, le plus long de la Ve République — sans avoir jamais été élu auparavant.',
      'En mai 1968, il négocie les accords de Grenelle, gagne les élections de juin, puis il est remercié.',
      'Président de la République du 20 juin 1969 au 2 avril 1974 : il meurt en fonction, malade.',
      'Il lance le centre Beaubourg, le TGV, le programme nucléaire et l’entrée du Royaume-Uni dans le Marché commun.',
    ],
    recit: [
      {
        titre: 'Du Cantal à la rue d’Ulm',
        texte:
          'Georges Pompidou naît en 1911 à **Montboudif**, un village du Cantal, dans une famille d’**instituteurs** de la République. Il est reçu à l’**École normale supérieure** en 1931 et **agrégé de lettres** en 1935 ; il enseigne le français et le latin à Marseille, puis au lycée **Henri-IV** à Paris. Mobilisé en 1939, il reprend ses classes sous l’Occupation. En 1944, un ami le recommande au général de Gaulle, qui cherche un rédacteur : il entre au cabinet, sans avoir été résistant — ce qu’on lui reprochera toute sa vie. Suivent le **Conseil d’État**, puis la direction générale de la **banque Rothschild** de 1954 à 1958, et le retour auprès du Général comme directeur de cabinet. C’est un homme de dossiers et de confiance, connu de quelques centaines de personnes, que rien ne destine au pouvoir visible.',
      },
      {
        titre: 'Six ans à Matignon',
        texte:
          'En avril **1962**, la guerre d’Algérie achevée, de Gaulle nomme Premier ministre cet inconnu qui n’a jamais été candidat à rien. L’Assemblée le renverse en octobre par une **motion de censure** — la seule adoptée sous la Ve République — pour protester contre le référendum instituant l’élection du président **au suffrage universel**. De Gaulle dissout, gagne, et le renomme. Pompidou reste six ans et trois mois à Matignon : il gère la modernisation industrielle, la première élection présidentielle au suffrage universel (1965) et la montée du mécontentement social. Il se fait élire député du Cantal en 1967 : c’est son premier mandat, cinq ans après être devenu chef du gouvernement.',
      },
      {
        titre: 'Mai 68 : Grenelle',
        texte:
          'En **mai 1968**, la crise étudiante devient une grève générale : neuf millions de grévistes, le pays arrêté. Le Général est en voyage, puis disparaît une journée à Baden-Baden ; c’est Pompidou qui tient la barre. Il fait rouvrir la Sorbonne, puis convoque syndicats et patronat rue de Grenelle. Les **accords de Grenelle**, négociés du 25 au 27 mai, accordent **+35 % sur le SMIG**, +10 % sur les salaires et la reconnaissance de la **section syndicale** dans l’entreprise. Les ouvriers de Billancourt les rejettent d’abord ; le travail ne reprend qu’en juin, après le discours du 30 mai et la dissolution. Les législatives de juin donnent à la majorité la plus large victoire de son histoire — et, trois semaines plus tard, de Gaulle remplace son Premier ministre, en le mettant, selon le mot resté célèbre, « en réserve de la République ».',
      },
      {
        titre: 'Président, et pressé',
        texte:
          'De Gaulle démissionne le 28 avril 1969 après l’échec de son référendum. Pompidou est élu le **15 juin 1969** avec 58 % des voix. Il garde le cap gaullien mais change le rythme : dévaluation du franc dès août, priorité à l’**industrie** (« l’impératif industriel »), autoroutes, tours du Front-de-Seine, voie express sur les quais de la Seine, villes nouvelles, lancement du **TGV** et du programme **nucléaire**. Il lève aussi le veto du Général sur l’entrée du **Royaume-Uni** dans le Marché commun, qu’il fait approuver par référendum en 1972 : Londres entre le 1er janvier 1973. Puis le **choc pétrolier** d’octobre 1973 quadruple le prix du baril et referme, sans qu’on le sache encore, les **Trente Glorieuses**.',
      },
      {
        titre: 'Beaubourg, et la maladie',
        texte:
          'Cet amateur de poésie — il a publié en 1961 une *Anthologie de la poésie française* qu’on trouve encore en librairie — est le premier président à collectionner l’art contemporain et à l’installer à l’Élysée, au grand scandale d’une partie de son camp. En 1969, il décide de bâtir sur le **plateau Beaubourg**, à Paris, un lieu où le musée, la bibliothèque, la musique et le cinéma cohabiteraient. Le concours de 1971 est gagné, parmi 681 projets, par deux inconnus : **Renzo Piano** et **Richard Rogers**. Leur bâtiment aux tuyaux apparents déclenche une guerre de presse ; Pompidou ne le verra jamais, car il meurt avant l’ouverture de 1977 — le centre porte aujourd’hui son nom. Atteint depuis 1972 d’une maladie du sang, le visage déformé par la cortisone, il a caché son état derrière des bulletins de santé rassurants. Il meurt à Paris le **2 avril 1974**, premier président de la Ve République à mourir en fonction.',
      },
    ],
    chrono: [
      { date: '1911', fait: 'Naissance à Montboudif, dans le Cantal.' },
      { date: '1935', fait: 'Agrégé de lettres ; il enseigne au lycée Henri-IV.' },
      { date: '1962', fait: 'Premier ministre du général de Gaulle.' },
      { date: 'mai 1968', fait: 'Il négocie les accords de Grenelle.' },
      { date: 'juillet 1968', fait: 'Écarté de Matignon après sa victoire électorale.' },
      { date: '15 juin 1969', fait: 'Élu président de la République.' },
      { date: '1971', fait: 'Piano et Rogers gagnent le concours de Beaubourg.' },
      { date: '1er janvier 1973', fait: 'Le Royaume-Uni entre dans le Marché commun.' },
      { date: 'octobre 1973', fait: 'Premier choc pétrolier.' },
      { date: '2 avril 1974', fait: 'Mort à Paris, en fonction.' },
    ],
    leSaisTu:
      'Avant d’entrer à Matignon, Pompidou n’avait jamais été élu à quoi que ce soit, pas même conseiller municipal : c’est le seul Premier ministre de la Ve République dans ce cas. Il corrigeait lui-même les brouillons de ses discours, à l’encre rouge, comme des copies de lycéens.',
    aRetenir: [
      'Georges Pompidou est Premier ministre du général de Gaulle de 1962 à 1968, puis président de la République de 1969 à 1974.',
      'En mai 1968, il négocie les accords de Grenelle : hausse de 35 % du SMIG, de 10 % des salaires, reconnaissance du syndicat dans l’entreprise.',
      'Sa présidence est celle de l’industrialisation et des grands chantiers ; le centre Beaubourg, ouvert en 1977, porte son nom.',
      'Il fait entrer le Royaume-Uni dans le Marché commun le 1er janvier 1973.',
      'Le choc pétrolier d’octobre 1973 met fin aux Trente Glorieuses ; il meurt en fonction le 2 avril 1974.',
    ],
    mots: [
      {
        mot: 'SMIG',
        sens: 'Salaire minimum interprofessionnel garanti, l’ancêtre du SMIC créé en 1970.',
      },
      {
        mot: 'Trente Glorieuses',
        sens: 'Les trente années de forte croissance et de plein emploi, de 1945 au choc pétrolier de 1973.',
      },
      {
        mot: 'Motion de censure',
        sens: 'Vote par lequel l’Assemblée nationale renverse le gouvernement. Une seule a abouti sous la Ve République, en 1962.',
      },
    ],
    lies: ['charles-de-gaulle', 'francois-mitterrand', 'mai-68', 'naissance-de-la-ve-republique'],
    niveaux: ['3e'],
    programme: 'La Ve République, de la République gaullienne à l’alternance',
    tags: [
      'Pompidou',
      'Beaubourg',
      'Grenelle',
      'mai 68',
      'Cantal',
      'Rothschild',
      'Ve République',
      'de Gaulle',
      'choc pétrolier',
      'Trente Glorieuses',
    ],
  },
  {
    id: 'rene-cassin',
    volet: 'personnages',
    nom: 'René Cassin',
    surnom: 'la plume des droits de l’homme',
    dates: '1887 – 1976',
    tri: 1976,
    periode: 'contemporain',
    emoji: '📜',
    roles: ['Juriste', 'Compagnon de la Libération', 'Prix Nobel de la paix'],
    origine: 'Bayonne, Pays basque',
    accroche:
      'Mutilé de 14-18, il rejoint de Gaulle à Londres dès juin 1940 — et tient, huit ans plus tard, la plume de la Déclaration universelle des droits de l’homme.',
    citations: [
      {
        texte: 'Tous les êtres humains naissent libres et égaux en dignité et en droits.',
        contexte:
          'Article premier de la Déclaration universelle des droits de l’homme, adoptée le 10 décembre 1948, dont il est le principal rédacteur.',
      },
      {
        texte:
          'La Déclaration universelle est le portique d’un temple dont les quatre colonnes sont la dignité, la liberté, l’égalité et la fraternité.',
        contexte: 'Image dont il se servait pour expliquer l’architecture du texte, qu’il avait dessinée.',
        sens:
          'Le préambule et les premiers articles forment l’entrée ; les trente articles se rangent ensuite en quatre familles de droits, comme quatre colonnes.',
      },
      {
        texte: 'Nous sommes la France.',
        qui: 'Charles de Gaulle',
        contexte:
          'Londres, été 1940. Cassin lui demande au nom de qui il doit rédiger l’accord avec Churchill ; c’est la réponse.',
        sens:
          'Deux hommes dans un bureau de Londres décident d’être l’État français — et un juriste transforme cette prétention en textes qui tiendront debout.',
      },
    ],
    reperes: [
      'Engagé volontaire en 1914, grièvement blessé au ventre dès octobre : il en souffrira toute sa vie.',
      'Professeur de droit, porte-parole des anciens combattants, délégué français à la Société des Nations.',
      'Il rejoint Londres le 29 juin 1940, parmi les tout premiers ; Vichy le condamne à mort par contumace.',
      'Vice-président du Conseil d’État de 1944 à 1960, la plus haute fonction de la justice administrative.',
      'Principal rédacteur français de la Déclaration universelle, adoptée à Paris le 10 décembre 1948.',
      'Prix Nobel de la paix en 1968 ; ses cendres sont entrées au Panthéon en 1987.',
    ],
    recit: [
      {
        titre: 'Un blessé de 1914',
        texte:
          'Né à **Bayonne** en 1887 dans une famille juive du Sud-Ouest, René Cassin est avocat et docteur en droit quand la guerre éclate. Engagé volontaire, il est fauché le **12 octobre 1914** près de Saint-Mihiel par une rafale qui lui ouvre le ventre : les chirurgiens militaires l’écartent, sa mère le fait opérer à Antibes, il survit à une blessure qui tuait presque toujours. Il en gardera des douleurs jusqu’à sa mort. De cette expérience naît son premier combat : il fonde et préside l’**Union fédérale** des anciens combattants, qui réunit près d’un million de mutilés et de veuves, obtient des pensions et une justice pour eux, et le conduit à **Genève** comme délégué de la France à la **Société des Nations** de 1924 à 1938. Il y plaide le désarmement, voit la SDN échouer, et en tire une leçon : une belle déclaration sans institution pour la faire respecter ne sert à rien.',
      },
      {
        titre: 'Londres, 29 juin 1940',
        texte:
          'Le 24 juin 1940, il embarque à Saint-Jean-de-Luz sur un cargo pour l’Angleterre. Le **29 juin**, il est reçu par de Gaulle, qu’il n’a jamais vu : il sera son juriste. C’est lui qui rédige l’accord du 7 août 1940 avec **Churchill**, qui donne une existence juridique à la **France libre** ; lui qui écrit les ordonnances du Conseil de défense de l’Empire ; lui qui parle à la **BBC** ; lui qui est commissaire national à la Justice et à l’Instruction publique. Vichy le **condamne à mort** par contumace, le déchoit de la nationalité française et confisque ses biens ; plusieurs membres de sa famille, juifs comme lui, seront déportés et assassinés. Fait **Compagnon de la Libération**, il devient à la Libération vice-président du Conseil d’État : c’est de là qu’il repartira à l’assaut du droit international.',
      },
      {
        titre: 'Écrire les droits de l’homme',
        texte:
          'L’ONU, créée en 1945, met sur pied une commission des droits de l’homme présidée par **Eleanor Roosevelt** : Cassin y représente la France aux côtés du Canadien John Humphrey, du Libanais Charles Malik et du Chinois Peng-chun Chang. Humphrey réunit la documentation ; Cassin en tire, en quelques jours, un texte **structuré** : un préambule qui dit pourquoi, puis trente articles rangés du plus intime (la vie, la liberté, l’égalité devant la loi) au plus collectif (le travail, l’éducation, la protection sociale). Il se bat sur un mot : le texte s’appellera **universelle** et non « internationale ». La différence est tout : une déclaration internationale lierait des États entre eux ; une déclaration universelle donne des droits à **tout être humain**, partout, y compris contre son propre gouvernement. Elle est adoptée au palais de Chaillot, à Paris, le **10 décembre 1948**.',
      },
      {
        titre: 'Donner des juges aux droits',
        texte:
          'La Déclaration n’est pas un traité : aucun État n’est obligé de la respecter, et Cassin le sait mieux que personne. Le reste de sa vie consiste à lui donner des **dents**. Il participe à la rédaction de la **Convention européenne des droits de l’homme** (1950), qui, elle, oblige les États qui la signent ; il siège à la **Cour européenne des droits de l’homme** de Strasbourg et la préside de 1965 à 1968 ; il défend le droit, pour un simple citoyen, d’attaquer son propre pays devant une juridiction internationale — ce qui était impensable avant lui. Le **prix Nobel de la paix** lui est décerné en **1968**, l’année des vingt ans de la Déclaration : il en consacre l’argent à fonder l’Institut international des droits de l’homme, à Strasbourg. Il meurt en 1976 ; ses cendres entrent au **Panthéon** en 1987, pour le centenaire de sa naissance.',
      },
    ],
    chrono: [
      { date: '1887', fait: 'Naissance à Bayonne.' },
      { date: '12 octobre 1914', fait: 'Grièvement blessé au front, près de Saint-Mihiel.' },
      { date: '29 juin 1940', fait: 'Il rejoint le général de Gaulle à Londres.' },
      { date: '1941', fait: 'Commissaire national à la Justice de la France libre.' },
      { date: '10 décembre 1948', fait: 'Adoption de la Déclaration universelle, à Paris.' },
      { date: '1950', fait: 'Convention européenne des droits de l’homme.' },
      { date: '1965', fait: 'Président de la Cour européenne des droits de l’homme.' },
      { date: '1968', fait: 'Prix Nobel de la paix.' },
      { date: '1987', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'La Déclaration a été votée au palais de Chaillot, à Paris, dans la nuit du 10 décembre 1948 : 48 pays pour, aucun contre, 8 abstentions. C’est aujourd’hui le texte le plus traduit du monde — plus de cinq cents langues, devant n’importe quel roman.',
    aRetenir: [
      'René Cassin rejoint la France libre le 29 juin 1940 et rédige les textes juridiques qui lui donnent une existence légale.',
      'Il est le principal rédacteur français de la Déclaration universelle des droits de l’homme, adoptée par l’ONU le 10 décembre 1948 à Paris.',
      'La Déclaration compte 30 articles ; le premier affirme que tous les êtres humains naissent libres et égaux en dignité et en droits.',
      'Ce n’est pas un traité : elle n’oblige pas juridiquement les États, mais elle inspire depuis toutes les constitutions et la Convention européenne de 1950.',
      'Il reçoit le prix Nobel de la paix en 1968 et entre au Panthéon en 1987.',
    ],
    mots: [
      {
        mot: 'Déclaration',
        sens: 'Texte qui proclame des principes. À la différence d’un traité, elle n’engage pas juridiquement les États qui la votent.',
      },
      {
        mot: 'Compagnon de la Libération',
        sens: 'Distinction créée par de Gaulle en 1940 : 1 038 hommes, 6 femmes, 5 villes et 18 unités combattantes l’ont reçue.',
      },
      {
        mot: 'Contumace',
        sens: 'Jugement rendu contre un accusé absent. Vichy a ainsi condamné Cassin à mort sans qu’il soit là.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'declaration-universelle-des-droits-de-l-homme',
      'creation-de-l-onu',
      'appel-du-18-juin-1940',
      'simone-veil',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'droits de l’homme',
      'ONU',
      '10 décembre 1948',
      'prix Nobel',
      'France libre',
      'Panthéon',
      'Bayonne',
      'Chaillot',
      'Strasbourg',
      'Conseil d’État',
    ],
  },
  {
    id: 'jean-monnet',
    volet: 'personnages',
    nom: 'Jean Monnet',
    surnom: 'l’inspirateur',
    dates: '1888 – 1979',
    tri: 1979,
    periode: 'contemporain',
    emoji: '🧩',
    roles: ['Négociateur international', 'Premier commissaire au Plan', 'Inspirateur de la CECA'],
    origine: 'Cognac, Charente',
    accroche:
      'Sans baccalauréat ni mandat électif, ce marchand de cognac a écrit la déclaration du 9 mai 1950 : l’Europe est née d’un texte sorti de sa serviette.',
    citations: [
      {
        texte:
          'Les hommes n’acceptent le changement que dans la nécessité et ils ne voient la nécessité que dans la crise.',
        contexte: '*Mémoires*, 1976.',
        sens:
          'La règle qu’il a suivie toute sa vie : préparer le texte à l’avance, sans bruit, et le sortir le jour où le problème devient insoluble autrement.',
      },
      {
        texte: 'Rien n’est possible sans les hommes, rien n’est durable sans les institutions.',
        contexte: '*Mémoires*, 1976 : la phrase qu’on cite le plus souvent de lui.',
        sens:
          'Il faut des gens pour lancer une idée, mais seules des institutions la font survivre à ceux qui l’ont lancée.',
      },
      {
        texte:
          'Il n’y aura pas de paix en Europe si les États se reconstituent sur une base de souveraineté nationale, avec ce que cela entraîne de politique de prestige et de protection économique.',
        contexte: 'Note écrite à Alger le 5 août 1943, en pleine guerre, sept ans avant la CECA.',
      },
      {
        texte: 'Nous ne coalisons pas des États, nous unissons des hommes.',
        contexte:
          'Phrase qu’on lui prête partout, mais introuvable dans ses écrits : elle est devenue la devise de ceux qui se réclament de lui.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un marchand de cognac, il quitte l’école à 16 ans et ne passera jamais le baccalauréat.',
      'Dès 1914, il fait mettre en commun les achats de blé et de navires de la France et du Royaume-Uni.',
      'Secrétaire général adjoint de la Société des Nations à 31 ans, en 1919.',
      'À Washington de 1940 à 1943, il pousse Roosevelt à lancer un programme d’armement géant.',
      'Premier commissaire au Plan en 1946 : il organise la modernisation d’une France ruinée.',
      'Il écrit la déclaration Schuman et préside la Haute Autorité de la CECA de 1952 à 1955.',
    ],
    recit: [
      {
        titre: 'Le marchand de cognac',
        texte:
          'Jean Monnet naît en 1888 à **Cognac**, dans une famille de négociants en eau-de-vie. À seize ans, son père l’envoie à Londres apprendre le métier et la langue, puis au Canada vendre du cognac aux bûcherons : il n’ira jamais à l’université. En **1914**, réformé pour raison de santé, il obtient une audience du président du Conseil et lui explique une évidence que personne ne voit : la France et le Royaume-Uni se **font concurrence** pour acheter les mêmes navires et le même blé, et font monter les prix contre eux-mêmes. Il propose de mettre les achats en commun. On l’écoute, et le voilà, à vingt-six ans, dans les commissions interalliées du ravitaillement. Toute sa méthode est déjà là : un problème concret, une mise en commun, une institution pour la gérer.',
      },
      {
        titre: 'Genève, Wall Street, Shanghai',
        texte:
          'En **1919**, à trente et un ans, il devient **secrétaire général adjoint de la Société des Nations** et règle des dossiers explosifs : la Sarre, la Haute-Silésie, Dantzig. Il en repart déçu — la SDN décide à l’unanimité, donc ne décide rien. Rappelé au chevet de l’entreprise familiale, il passe ensuite à la banque d’affaires américaine : il participe au redressement du **zloty** polonais et du **leu** roumain, puis part en 1934 réorganiser les chemins de fer **chinois**. Il traverse ainsi la crise de 1929 et apprend, en travaillant sur trois continents, ce qu’aucun diplomate ne sait : comment l’argent, les États et les entreprises se parlent réellement.',
      },
      {
        titre: 'La guerre, vue de Washington',
        texte:
          'Président du comité franco-britannique de coordination en 1939, il est à l’origine du projet d’**union franco-britannique** du 16 juin 1940, accepté par Churchill et refusé par le gouvernement français en déroute. Il passe alors au service britannique et s’installe à **Washington**, où il travaille à convaincre Roosevelt que les États-Unis doivent devenir l’arsenal des démocraties : le programme d’armement qui en sort (avions, chars, navires par dizaines de milliers) fait dire à l’économiste **Keynes** que Monnet a raccourci la guerre d’un an. En 1943, il est à **Alger** auprès du Comité français de libération nationale, où il aide à réconcilier Giraud et de Gaulle — et où il écrit, en août, la note qui annonce toute la suite : des souverainetés nationales reconstituées telles quelles ramèneront la guerre.',
      },
      {
        titre: 'Le Plan',
        texte:
          'La France de 1945 est en ruine : ponts coupés, mines noyées, usines détruites, rationnement. Monnet propose à de Gaulle un **Commissariat général au Plan**, créé en janvier 1946, qu’il dirige avec une trentaine de personnes seulement et sans hiérarchie. Son mot d’ordre : « modernisation ou décadence ». Le **plan Monnet** concentre les moyens — dont ceux du plan Marshall — sur six secteurs de base : **charbon, électricité, acier, ciment, machines agricoles, transports**. Ce n’est pas une économie dirigée comme à l’Est : l’État fixe des objectifs chiffrés et réunit autour d’une table patrons, syndicats et ingénieurs. La production industrielle retrouve son niveau d’avant-guerre en 1948, et double en dix ans.',
      },
      {
        titre: 'Le 9 mai 1950, et après',
        texte:
          'Au printemps 1950, les Alliés veulent rendre à l’Allemagne de l’Ouest la maîtrise de sa sidérurgie ; la France panique. Monnet rédige avec Étienne Hirsch, Pierre Uri et Paul Reuter un texte de quelques pages : mettre **tout** le charbon et **tout** l’acier des deux pays sous une autorité commune, ouverte aux autres. Il le porte à **Robert Schuman**, qui accepte de le prendre à son compte et le lit le **9 mai 1950** — « La paix mondiale ne saurait être sauvegardée sans des efforts créateurs à la mesure des dangers qui la menacent » : ce sont les mots de Monnet dans la bouche du ministre. Il préside ensuite la **Haute Autorité** de la CECA de 1952 à 1955, démissionne après l’échec de l’armée européenne, et fonde un **Comité d’action pour les États-Unis d’Europe** qui pèsera sur le traité de Rome, puis sur les sommets européens jusqu’en 1975. Le Conseil européen le fait « citoyen d’honneur de l’Europe » en 1976 ; ses cendres entrent au Panthéon en **1988**.',
      },
    ],
    chrono: [
      { date: '1888', fait: 'Naissance à Cognac.' },
      { date: '1919', fait: 'Secrétaire général adjoint de la Société des Nations, à 31 ans.' },
      { date: '16 juin 1940', fait: 'Projet d’union franco-britannique, accepté par Churchill.' },
      { date: '5 août 1943', fait: 'Note d’Alger : les souverainetés nationales ramènent la guerre.' },
      { date: '1946', fait: 'Premier commissaire au Plan de modernisation.' },
      { date: '9 mai 1950', fait: 'Sa déclaration, lue par Robert Schuman.' },
      { date: '1952', fait: 'Président de la Haute Autorité de la CECA.' },
      { date: '1955', fait: 'Comité d’action pour les États-Unis d’Europe.' },
      { date: '1979', fait: 'Mort à Houjarray ; Panthéon en 1988.' },
    ],
    leSaisTu:
      'Monnet n’a jamais été ministre, jamais été élu, et n’a pas passé le baccalauréat. Il n’avait pas de bureau officiel : il recevait dans sa maison de campagne de Houjarray, près de Paris, et emmenait ses visiteurs marcher dans les bois pendant qu’il leur expliquait son idée. Plusieurs traités européens sont nés de ces promenades.',
    aRetenir: [
      'Jean Monnet rédige la déclaration lue par Robert Schuman le 9 mai 1950, acte de naissance de la construction européenne.',
      'Il est le premier président de la Haute Autorité de la CECA, de 1952 à 1955.',
      'Premier commissaire au Plan en 1946, il organise la reconstruction et la modernisation de la France.',
      'Sa méthode : avancer par réalisations concrètes, secteur par secteur, plutôt que par un grand traité d’ensemble.',
      'Il n’a jamais exercé le moindre mandat électif ; ses cendres sont entrées au Panthéon en 1988.',
    ],
    mots: [
      {
        mot: 'Haute Autorité',
        sens: 'Organe indépendant des États qui dirigeait la CECA : l’ancêtre de la Commission européenne.',
      },
      {
        mot: 'Souveraineté',
        sens: 'Droit d’un État de décider seul chez lui, sans autorité au-dessus de lui.',
      },
      {
        mot: 'Plan',
        sens: 'Programme par lequel l’État oriente l’économie : priorités, objectifs chiffrés, financements.',
      },
    ],
    lies: ['robert-schuman', 'charles-de-gaulle', 'traite-de-rome', 'traite-de-maastricht'],
    niveaux: ['3e', 'Tle'],
    programme: 'Affirmation et mise en œuvre du projet européen',
    tags: [
      'Monnet',
      'CECA',
      '9 mai 1950',
      'Plan Monnet',
      'Cognac',
      'Europe',
      'Panthéon',
      'Schuman',
      'États-Unis d’Europe',
      'Société des Nations',
    ],
  },
  {
    id: 'pierre-mendes-france',
    volet: 'personnages',
    nom: 'Pierre Mendès France',
    surnom: 'PMF',
    dates: '1907 – 1982',
    tri: 1982,
    periode: 'contemporain',
    emoji: '🥛',
    roles: ['Président du Conseil', 'Avocat et économiste', 'Aviateur de la France libre'],
    origine: 'Paris',
    accroche:
      'Sept mois au pouvoir, sept semaines pour arrêter la guerre d’Indochine : il reste le modèle du gouvernant qui annonce ce qu’il fera et le fait.',
    citations: [
      {
        texte: 'Gouverner, c’est choisir, si difficiles que soient les choix.',
        contexte: 'Discours devant l’Assemblée nationale, 3 juin 1953.',
        sens:
          'Un gouvernement qui promet tout à tout le monde ne gouverne pas : choisir, c’est accepter de décevoir une partie du pays et de le dire.',
      },
      {
        texte:
          'Si aucune solution satisfaisante n’a pu aboutir à cette date, mon gouvernement remettra sa démission au président de la République.',
        contexte:
          'Discours d’investiture, 17 juin 1954 : il se donne jusqu’au 20 juillet pour faire la paix en Indochine.',
      },
      {
        texte: 'La démocratie est d’abord un état d’esprit.',
        contexte: '*La République moderne*, 1962, écrit après son retrait du pouvoir.',
        sens:
          'Des institutions ne suffisent pas : il faut des citoyens informés, qui acceptent la discussion et le verdict des urnes.',
      },
    ],
    reperes: [
      'Avocat à 19 ans, docteur en droit à 21, député à 25 : le plus jeune de France en 1932.',
      'Condamné pour désertion par un tribunal de Vichy en 1941, il s’évade et devient navigateur dans l’aviation française libre.',
      'Président du Conseil du 18 juin 1954 au 6 février 1955 : sept mois et demi.',
      'Il signe les accords de Genève le 21 juillet 1954 et met fin à huit ans de guerre d’Indochine.',
      'Il lance la lutte contre l’alcoolisme et le verre de lait distribué dans les écoles.',
      'Chaque samedi soir, il parle aux Français à la radio, sans passer par les journalistes.',
    ],
    recit: [
      {
        titre: 'Le plus jeune de France',
        texte:
          'Né à Paris en 1907 dans une famille juive d’origine portugaise installée en France depuis des siècles, Pierre Mendès France est **avocat à dix-neuf ans**, docteur en droit à vingt et un, et **député de Louviers**, dans l’Eure, à vingt-cinq : le plus jeune du pays. Économiste de formation, il entre en 1938 dans le second gouvernement de **Léon Blum** comme sous-secrétaire d’État au Trésor. Il y découvre la violence de la presse antisémite des années trente, qui s’acharne sur son nom. Il en tirera une conviction tenace : en démocratie, on ne gagne pas en cachant les mauvaises nouvelles, on gagne en **expliquant les chiffres**.',
      },
      {
        titre: 'Le Massilia, la prison, l’escadrille',
        texte:
          'En juin 1940, il refuse l’armistice et embarque sur le paquebot **Massilia** avec vingt-six parlementaires, pour continuer la guerre depuis l’Afrique du Nord. Vichy les fait arrêter : accusé de **désertion**, jugé à Clermont-Ferrand en mai 1941 dans un procès monté de toutes pièces, il est condamné à six ans de prison. Il s’**évade** le 21 juin 1941 en franchissant le mur, gagne la Suisse, puis le Portugal, puis Londres. Il s’engage dans les **Forces aériennes françaises libres** et vole comme navigateur dans le groupe de bombardement *Lorraine*, au-dessus de la France occupée, jusqu’en 1944. De Gaulle le nomme ensuite commissaire aux Finances à Alger : l’homme qui reviendra au pouvoir en 1954 a fait la guerre, et tout le monde le sait.',
      },
      {
        titre: 'L’économiste qui perd, et qui a raison',
        texte:
          'Ministre de l’Économie nationale à la Libération, il propose un remède brutal contre l’**inflation** : bloquer les comptes, échanger les billets, prélever les profits du marché noir, comme la Belgique vient de le faire. En face, René Pleven défend une ligne plus douce. De Gaulle tranche pour Pleven ; Mendès France **démissionne** en avril 1945 plutôt que d’appliquer une politique à laquelle il ne croit pas. L’inflation ravagera les salaires pendant des années, et l’épisode fera de lui, pour toute une génération, l’homme qui avait dit la vérité et qui avait préféré partir. C’est cette autorité morale, et non un parti, qui le portera au pouvoir neuf ans plus tard.',
      },
      {
        titre: 'Sept mois, et le pari du 20 juillet',
        texte:
          'Le camp retranché de **Diên Biên Phu** tombe le 7 mai 1954 : la guerre d’Indochine, commencée en 1946, est perdue. Investi le 18 juin, Mendès France annonce l’inconcevable devant l’Assemblée : il aura arrêté la guerre **avant le 20 juillet**, sinon il démissionnera. Les **accords de Genève** sont signés dans la nuit du 20 au 21 juillet ; le Viêt Nam est coupé en deux au 17ᵉ parallèle, la France s’en va. Il enchaîne à la même vitesse : le **discours de Carthage** du 31 juillet promet l’autonomie interne à la **Tunisie** ; il laisse l’Assemblée enterrer le projet d’armée européenne ; il lance une campagne contre l’**alcoolisme** et fait distribuer un quart de litre de **lait** à chaque écolier. Puis vient le **1er novembre 1954** : une série d’attentats ouvre la **guerre d’Algérie**. Il répond que l’Algérie, département français, ne se négociera pas, envoie les renforts, nomme François Mitterrand à l’Intérieur — et l’Assemblée le renverse le **5 février 1955**, sur l’Algérie.',
      },
      {
        titre: 'L’homme qui dit non',
        texte:
          'Il n’exercera plus jamais le pouvoir. En **1958**, il refuse le retour du général de Gaulle et vote non à la Constitution de la Ve République, qu’il juge taillée pour un homme ; il perd son siège la même année. Redevenu député de Grenoble en 1967, il apparaît au stade **Charléty** en mai 1968, ce qu’on lui reprochera comme une tentation de prendre le pouvoir par la rue ; battu en juin, il quitte la vie politique. Il écrit, conseille, refuse les honneurs, et meurt à sa table de travail le **18 octobre 1982**. Ni parti, ni courant, ni héritier : il laisse une **méthode** — dire les faits, fixer une échéance, s’y tenir — que la gauche comme la droite continuent de citer.',
      },
    ],
    chrono: [
      { date: '1907', fait: 'Naissance à Paris.' },
      { date: '1932', fait: 'Élu député de Louviers, à 25 ans.' },
      { date: '1941', fait: 'Condamné par Vichy, il s’évade et gagne Londres.' },
      { date: '1945', fait: 'Il quitte le gouvernement du général de Gaulle.' },
      { date: '18 juin 1954', fait: 'Investi président du Conseil.' },
      { date: '21 juillet 1954', fait: 'Accords de Genève : fin de la guerre d’Indochine.' },
      { date: '31 juillet 1954', fait: 'Discours de Carthage : autonomie promise à la Tunisie.' },
      { date: '1er novembre 1954', fait: 'Début de l’insurrection algérienne.' },
      { date: '5 février 1955', fait: 'Renversé par l’Assemblée nationale.' },
      { date: '1958', fait: 'Il vote non à la Constitution de la Ve République.' },
      { date: '1982', fait: 'Mort à Paris, le 18 octobre.' },
    ],
    leSaisTu:
      'Le « verre de lait de Mendès France » est resté dans la mémoire des écoliers : un quart de litre distribué chaque matin à partir de 1954, contre la malnutrition — et contre l’alcool, qu’on servait encore aux enfants dans certaines cantines jusqu’en 1956. Les producteurs de calvados et de marc ne le lui ont jamais pardonné.',
    aRetenir: [
      'Pierre Mendès France est président du Conseil du 18 juin 1954 au 5 février 1955, sous la IVe République.',
      'Il met fin à la guerre d’Indochine par les accords de Genève du 21 juillet 1954, sept semaines après son arrivée au pouvoir.',
      'Le 31 juillet 1954, le discours de Carthage promet l’autonomie interne à la Tunisie.',
      'Il est renversé le 5 février 1955 sur sa politique algérienne, trois mois après le début de l’insurrection.',
      'Sa formule « gouverner, c’est choisir » résume une certaine idée de l’État : dire les faits et assumer les décisions.',
    ],
    mots: [
      {
        mot: 'Président du Conseil',
        sens: 'Chef du gouvernement sous les IIIe et IVe Républiques, l’équivalent du Premier ministre d’aujourd’hui.',
      },
      {
        mot: 'Investiture',
        sens: 'Vote par lequel l’Assemblée accepte un chef de gouvernement et son programme.',
      },
      {
        mot: 'Accords de Genève',
        sens: 'Accords du 21 juillet 1954 : la France quitte l’Indochine et le Viêt Nam est coupé en deux au 17ᵉ parallèle.',
      },
    ],
    lies: [
      'guerre-d-indochine',
      'guerre-d-algerie',
      'francois-mitterrand',
      'charles-de-gaulle',
      'jean-monnet',
    ],
    niveaux: ['3e'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'Mendès France',
      'PMF',
      'Indochine',
      'accords de Genève',
      'verre de lait',
      'IVe République',
      'Louviers',
      'Tunisie',
      'Diên Biên Phu',
      'gouverner c’est choisir',
    ],
  },
  {
    id: 'francois-mitterrand',
    volet: 'personnages',
    nom: 'François Mitterrand',
    surnom: 'le Florentin',
    dates: '1916 – 1996',
    tri: 1996,
    periode: 'contemporain',
    emoji: '🌹',
    roles: ['Président de la République', 'Chef du Parti socialiste', 'Ministre de la IVe République'],
    origine: 'Jarnac, Charente',
    accroche:
      'Vingt-trois ans d’opposition, puis quatorze ans à l’Élysée : il fait entrer la gauche au pouvoir et abolit la peine de mort.',
    citations: [
      {
        texte:
          'Le nationalisme, c’est la guerre ! La guerre, ce n’est pas seulement le passé, cela peut être notre avenir.',
        contexte:
          'Dernier discours devant le Parlement européen, Strasbourg, 17 janvier 1995, quelques mois avant la fin de son mandat.',
        sens:
          'Il vient de rappeler qu’il a été soldat et prisonnier à vingt-trois ans : il tient le nationalisme pour la cause des deux guerres mondiales.',
      },
      {
        texte: 'La force tranquille.',
        contexte: 'Slogan de l’affiche présidentielle de 1981 : Mitterrand devant un village et son clocher.',
        sens:
          'Tout le pari de 1981 tient dans ces trois mots : la gauche arrive enfin au pouvoir, mais rien ne sera renversé brutalement.',
      },
      {
        texte: 'Ces institutions étaient dangereuses avant moi. Elles le resteront après moi.',
        contexte:
          'À ceux qui lui rappelaient ses attaques contre les pouvoirs du président, au début de son premier septennat.',
        sens:
          'Il avait dénoncé la Ve République comme un « coup d’État permanent » ; il en use ensuite sans rien changer à la Constitution.',
      },
      {
        texte: 'Il faut laisser du temps au temps.',
        contexte: 'Une de ses formules favorites, empruntée au *Don Quichotte* de Cervantès.',
        sens:
          'Sa façon d’expliquer qu’une réforme ne se juge pas le lendemain — et, parfois, de justifier qu’on ne décide rien.',
      },
    ],
    reperes: [
      'Blessé et fait prisonnier en 1940, évadé à la troisième tentative en décembre 1941.',
      'Employé à Vichy en 1942 et décoré de la francisque en 1943, il dirige en même temps un réseau de résistance de prisonniers évadés.',
      'Onze fois ministre sous la IVe République, il refuse le retour du général de Gaulle en 1958.',
      'Candidat en 1965, il met de Gaulle en ballottage ; il prend le Parti socialiste au congrès d’Épinay, en 1971.',
      'Élu président le 10 mai 1981 avec 51,8 % des voix, après vingt-trois ans d’opposition.',
      'Deux septennats, deux cohabitations, quatorze ans : le plus long mandat présidentiel français.',
    ],
    recit: [
      {
        titre: 'Un jeune homme des années trente',
        texte:
          'François Mitterrand naît en 1916 à **Jarnac**, en Charente, dans une famille catholique et conservatrice de la bourgeoisie de province. Étudiant en droit à Paris, il fréquente les cercles nationalistes de son temps — il défile en février 1935 dans une manifestation contre les étudiants étrangers — sans militer durablement nulle part. Mobilisé en 1939, il est **blessé près de Verdun** le 14 juin 1940 et fait prisonnier. Dix-huit mois de **stalag** en Allemagne, deux évasions manquées, une troisième réussie en décembre 1941 : cette captivité, il l’a dit souvent, l’a plus formé que ses études. Elle lui donne aussi son premier milieu politique, celui des **prisonniers de guerre**, dont il connaîtra les réseaux mieux que personne.',
      },
      {
        titre: 'Vichy, la francisque, la Résistance',
        texte:
          'De retour en France, il travaille en 1942 au **Commissariat au reclassement des prisonniers de guerre**, à Vichy, et reçoit en 1943 la **francisque**, la décoration du maréchal Pétain, portant le matricule 2202. À la même période, sous le pseudonyme de **Morland**, il organise un mouvement clandestin de prisonniers évadés qui fusionnera avec deux autres pour donner le **MNPGD**, reconnu par la France libre. Il rencontre de Gaulle à Alger en décembre 1943 : l’entrevue est glaciale. Il participe à la libération de Paris. Ce double passage — l’État français puis la Résistance — est celui de beaucoup de Français entre 1940 et 1943 ; chez lui il restera une affaire publique, ravivée en 1992 par la révélation qu’il faisait déposer chaque 11 novembre une gerbe sur la tombe de Pétain, et en 1994 par un livre auquel il répondit à la télévision, sans rien renier.',
      },
      {
        titre: 'Vingt-trois ans d’opposition',
        texte:
          'Onze fois ministre sous la **IVe République**, il est ministre de l’Intérieur de Mendès France en 1954, puis garde des Sceaux en 1956 pendant la guerre d’**Algérie**, où le gouvernement obtient les pouvoirs spéciaux et où des condamnés du FLN sont exécutés. En 1958, il refuse le retour du Général et publie *Le Coup d’État permanent* (1964), réquisitoire contre les pouvoirs du président. Candidat unique de la gauche en **1965**, il met de Gaulle en **ballottage** et obtient 45 % au second tour : personne n’y croyait. Il prend le **Parti socialiste** au congrès d’**Épinay** en 1971, signe un **programme commun** avec les communistes en 1972 — pour gagner avec eux et, à terme, les affaiblir —, échoue de 425 000 voix contre Giscard d’Estaing en 1974, et l’emporte enfin le **10 mai 1981**.',
      },
      {
        titre: '1981 : ce qui change, et le tournant',
        texte:
          'Les deux premières années sont un torrent de réformes. La **peine de mort est abolie** par la loi du 9 octobre 1981, portée par le garde des Sceaux **Robert Badinter** ; viennent la **retraite à 60 ans**, la cinquième semaine de congés payés, les 39 heures, les lois Auroux sur les droits des salariés, la **décentralisation** de Gaston Defferre (mars 1982), les radios libres, la fin des poursuites contre l’homosexualité, la suppression de la Cour de sûreté de l’État. L’État **nationalise** trente-neuf banques et cinq grands groupes industriels. Mais la relance se heurte au monde : trois dévaluations du franc, déficit du commerce extérieur, inflation. En **mars 1983**, Mitterrand tranche pour rester dans le système monétaire européen : c’est le **tournant de la rigueur**, l’austérité contre la sortie de l’Europe. Le chômage, lui, continue de monter.',
      },
      {
        titre: 'Cohabiter, bâtir, Maastricht',
        texte:
          'La droite gagne les législatives de 1986 : plutôt que de démissionner, Mitterrand nomme **Jacques Chirac** Premier ministre et invente la **cohabitation**, en se réservant la défense et la diplomatie. Il est **réélu le 8 mai 1988** avec 54 % des voix, puis cohabite de nouveau avec Édouard Balladur à partir de 1993. Sa marque visible, ce sont les **grands travaux** : la pyramide du **Louvre** de Ieoh Ming Pei (1989), l’Opéra Bastille, la Grande Arche de la Défense, l’Institut du monde arabe, la Très Grande Bibliothèque. Sa marque durable, c’est l’Europe : avec le chancelier **Helmut Kohl** — la main dans la main à Verdun en 1984 —, il pousse l’acte unique, puis le **traité de Maastricht**, signé le 7 février 1992, qui crée l’**Union européenne** et prépare l’euro. Le référendum du 20 septembre 1992 l’approuve de justesse : **51,04 %**.',
      },
      {
        titre: 'La maladie et la fin',
        texte:
          'Un **cancer de la prostate** lui est diagnostiqué en novembre 1981, six mois après son élection. Il le cache pendant onze ans derrière des bulletins de santé mensuels et faux, et ne l’annonce qu’en 1992, après une première opération. Il termine son second septennat très diminué, s’effaçant devant l’élection de 1995, et meurt à Paris le **8 janvier 1996**, à soixante-dix-neuf ans. Il est enterré à Jarnac, dans le caveau familial. Le secret médical, la francisque, les amitiés conservées avec des hommes de Vichy, le goût du pouvoir : tout cela a nourri une légende d’homme double, que ses adversaires appelaient le Florentin. Il reste, dans les faits, l’homme qui a fait alterner la République sans la rompre.',
      },
    ],
    chrono: [
      { date: '1916', fait: 'Naissance à Jarnac, en Charente.' },
      { date: '1940', fait: 'Blessé puis prisonnier en Allemagne ; évadé en 1941.' },
      { date: '1943', fait: 'Francisque de Vichy et réseau de résistance de prisonniers.' },
      { date: '1965', fait: 'Il met le général de Gaulle en ballottage.' },
      { date: '1971', fait: 'Congrès d’Épinay : il prend le Parti socialiste.' },
      { date: '10 mai 1981', fait: 'Élu président de la République.' },
      { date: '9 octobre 1981', fait: 'Abolition de la peine de mort.' },
      { date: 'mars 1983', fait: 'Tournant de la rigueur.' },
      { date: '1986', fait: 'Première cohabitation, avec Jacques Chirac.' },
      { date: '20 septembre 1992', fait: 'Le traité de Maastricht approuvé par référendum.' },
      { date: '8 janvier 1996', fait: 'Mort à Paris.' },
    ],
    leSaisTu:
      'Le 21 mai 1981, jour de son investiture, il entre seul au Panthéon, une rose à la main, et la dépose sur trois tombes : celles de Jean Jaurès, Jean Moulin et Victor Schœlcher. La scène, filmée en direct, dure une dizaine de minutes sans un mot — la première fois qu’un président se met lui-même en scène comme un personnage d’histoire.',
    aRetenir: [
      'François Mitterrand est le premier président socialiste de la Ve République : élu le 10 mai 1981, réélu le 8 mai 1988.',
      'La peine de mort est abolie par la loi du 9 octobre 1981, défendue devant le Parlement par Robert Badinter.',
      'Après les nationalisations de 1981-1982, le tournant de la rigueur de mars 1983 maintient la France dans le système monétaire européen.',
      'Il invente la cohabitation en 1986 avec Jacques Chirac, puis la reconduit en 1993 avec Édouard Balladur.',
      'Le traité de Maastricht, ratifié par référendum le 20 septembre 1992, crée l’Union européenne et prépare la monnaie unique.',
      'Ses deux septennats font quatorze ans, le plus long mandat présidentiel de l’histoire de France.',
    ],
    mots: [
      {
        mot: 'Cohabitation',
        sens: 'Situation où le président et la majorité de l’Assemblée nationale ne sont pas du même camp.',
      },
      {
        mot: 'Septennat',
        sens: 'Mandat présidentiel de sept ans, en vigueur jusqu’en 2002, remplacé depuis par le quinquennat.',
      },
      {
        mot: 'Nationalisation',
        sens: 'Rachat d’une entreprise privée par l’État, qui en devient propriétaire.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'georges-pompidou',
      'abolition-de-la-peine-de-mort',
      'traite-de-maastricht',
      'mai-68',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La Ve République, de la République gaullienne à l’alternance',
    tags: [
      'Mitterrand',
      'Épinay',
      '10 mai 1981',
      'peine de mort',
      'Maastricht',
      'cohabitation',
      'rigueur',
      'Jarnac',
      'rose au poing',
      'francisque',
      'grands travaux',
    ],
  },
  {
    id: 'abbe-pierre',
    volet: 'personnages',
    nom: 'L’abbé Pierre',
    surnom: 'le chiffonnier de Dieu',
    dates: '1912 – 2007',
    tri: 2007,
    periode: 'contemporain',
    emoji: '🏠',
    roles: ['Prêtre catholique', 'Résistant', 'Fondateur d’Emmaüs', 'Député'],
    origine: 'Lyon',
    accroche:
      'Le 1er février 1954, il demande à la radio des couvertures pour ceux qui meurent de froid — et la France entière répond en quelques heures.',
    citations: [
      {
        texte:
          'Mes amis, au secours… Une femme vient de mourir gelée, cette nuit, à trois heures, sur le trottoir du boulevard Sébastopol, serrant sur elle le papier par lequel, avant-hier, on l’expulsait.',
        contexte: 'Appel lancé sur Radio Luxembourg le 1er février 1954, à l’heure du déjeuner.',
        sens:
          'Il ne parle pas de la pauvreté en général : il donne une nuit, une heure, une rue et un papier. C’est ce qui fait se lever le pays.',
      },
      {
        texte:
          'Il nous faut, pour ce soir et au plus tard demain, cinq mille couvertures, trois cents grandes tentes américaines, deux cents poêles catalytiques.',
        contexte: 'Suite du même appel : il ne demande pas d’argent, mais des objets, tout de suite.',
      },
      {
        texte: 'Je ne peux rien te donner, mais si tu veux, viens m’aider à aider les autres.',
        contexte: 'À Georges, ancien bagnard qui venait de tenter de se tuer, en 1949 : la première phrase d’Emmaüs.',
        sens:
          'Tout le mouvement tient là : on ne sauve pas un homme en lui faisant l’aumône, on le sauve en lui donnant quelqu’un à sauver.',
      },
    ],
    reperes: [
      'Né Henri Grouès dans une riche famille de soyeux lyonnais, il donne sa part d’héritage et entre chez les capucins à 19 ans.',
      'Résistant à Grenoble dès 1942 : faux papiers, passages vers la Suisse, maquis. « Abbé Pierre » est son nom de clandestinité.',
      'Député de Meurthe-et-Moselle de 1945 à 1951.',
      'En 1949, il fonde à Neuilly-Plaisance la première communauté Emmaüs, de chiffonniers bâtisseurs.',
      'Son appel du 1er février 1954 déclenche un élan de dons que la presse appelle « l’insurrection de la bonté ».',
      'Emmaüs existe aujourd’hui dans une quarantaine de pays.',
    ],
    recit: [
      {
        titre: 'Un fils de riches chez les capucins',
        texte:
          'Henri Grouès naît à **Lyon** en 1912, cinquième de huit enfants d’une famille de négociants en soie. Son père appartient à une confrérie de laïcs qui, le dimanche, rasent et soignent les mendiants des quais : à douze ans, l’enfant l’accompagne. À **dix-neuf ans**, il donne sa part d’héritage et entre chez les **capucins**, l’ordre le plus pauvre de l’Église, sous le nom de frère Philippe : sept ans de règle dure, de silence et de mendicité. Ordonné prêtre en 1938, il doit quitter l’ordre l’année suivante — sa santé ne tient pas. Il devient vicaire à Grenoble. De ces sept années, il gardera une manière de vivre : pas de compte en banque, pas de maison à soi, et l’idée que servir les pauvres n’est pas une œuvre de bienfaisance mais une obéissance.',
      },
      {
        titre: 'Grenoble, 1942',
        texte:
          'Après l’occupation de la zone sud, il cache des familles **juives** dans son presbytère, fabrique de **faux papiers** et organise des passages vers la **Suisse** ; il aide notamment à faire franchir la frontière au frère paralysé du général de Gaulle. Il participe à la naissance des **maquis** du Vercors et de la Chartreuse, transporte des hommes et des messages, échappe deux fois à la Gestapo. C’est dans cette clandestinité qu’il prend le nom de guerre qu’il gardera toute sa vie : **abbé Pierre**. Arrêté puis relâché en 1944, il gagne l’Algérie par l’Espagne et devient aumônier de la marine. À la Libération, il est décoré de la croix de guerre et de la médaille de la Résistance.',
      },
      {
        titre: 'Un député chiffonnier',
        texte:
          'Élu **député** de Meurthe-et-Moselle en 1945, il siège six ans, soutient la création de l’ONU et découvre qu’une loi, seule, ne loge personne. Il loue à **Neuilly-Plaisance** une grande maison délabrée qu’il baptise **Emmaüs**, du nom du village de l’Évangile où des hommes désespérés retrouvent une raison d’avancer. En **1949**, un ancien bagnard qui vient de tenter de se tuer sonne à sa porte : au lieu de le secourir, il lui demande de l’aide. Ce renversement fonde le mouvement. Les **compagnons** d’Emmaüs vivent de ce que les autres jettent — chiffons, ferraille, meubles —, ne touchent ni salaire ni aumône, et bâtissent de leurs mains des logements pour des familles à la rue. Quand son mandat de député s’achève, en 1951, l’abbé Pierre va mendier lui-même sur les marchés ; en 1952, il gagne à la radio, au jeu *Quitte ou double*, de quoi financer les chantiers.',
      },
      {
        titre: 'L’hiver 1954',
        texte:
          'L’hiver 1954 est l’un des plus froids du siècle. Le 3 janvier, un bébé meurt de froid dans un autobus désaffecté où sa famille s’abritait. Le **1er février**, une femme est trouvée morte gelée sur le trottoir du **boulevard Sébastopol**, tenant le papier de son expulsion. L’abbé Pierre se présente à **Radio Luxembourg** ; on le laisse parler quelques minutes à l’heure du déjeuner. Il ne réclame pas de l’argent, il demande des couvertures, des tentes, des poêles, et donne une adresse : l’hôtel Rochester, rue La Boétie. Les dons arrivent dans l’heure, par camions entiers ; en quelques semaines, l’équivalent de **plusieurs milliards de francs** est versé par des inconnus ; Charlie Chaplin, de passage à Paris, apporte l’argent d’un prix qu’il vient de recevoir. La presse appelle ces semaines l’**insurrection de la bonté**. L’Assemblée nationale vote en urgence dix milliards de francs pour des **cités d’urgence**, et une loi de **1956** interdit les expulsions pendant l’hiver : c’est la **trêve hivernale**, toujours en vigueur.',
      },
      {
        titre: 'Cinquante ans de chantier',
        texte:
          'Emmaüs devient un mouvement international en **1971** ; il y a aujourd’hui des groupes dans une quarantaine de pays, et les salles de vente des compagnons sont entrées dans le paysage français. L’abbé Pierre continue de gêner : il occupe des immeubles vides avec des familles sans logement, fait la grève de la faim à plus de quatre-vingts ans, crée en **1987** une fondation pour le logement des défavorisés dont le rapport annuel sur le mal-logement fait toujours autorité. Pendant dix-sept ans, les sondages le classent personnalité préférée des Français — jusqu’à ce qu’il demande lui-même à en sortir. Il meurt à Paris le **22 janvier 2007**, à quatre-vingt-quatorze ans, et est enterré près des compagnons d’Emmaüs à Esteville, en Normandie.',
      },
      {
        titre: 'Après sa mort : les révélations de 2024',
        texte:
          'En juillet et en septembre **2024**, dix-sept ans après sa mort, deux rapports commandés par Emmaüs rendent publics les témoignages de dizaines de femmes qui accusent l’abbé Pierre d’**agressions sexuelles**, commises sur plusieurs décennies. Le mouvement ferme le lieu de mémoire d’Esteville, retire ses portraits, et la fondation qui portait son nom l’abandonne. Rien de cela n’efface l’hiver 1954, les cités d’urgence ni les maisons bâties par les compagnons ; rien non plus ne l’excuse. Les deux appartiennent à son histoire, et une encyclopédie doit les écrire l’une et l’autre.',
      },
    ],
    chrono: [
      { date: '1912', fait: 'Naissance d’Henri Grouès, à Lyon.' },
      { date: '1931', fait: 'Il donne son héritage et entre chez les capucins.' },
      { date: '1942', fait: 'Résistant à Grenoble ; il prend le nom d’abbé Pierre.' },
      { date: '1945', fait: 'Élu député de Meurthe-et-Moselle.' },
      { date: '1949', fait: 'Première communauté Emmaüs, à Neuilly-Plaisance.' },
      { date: '1er février 1954', fait: 'L’appel sur Radio Luxembourg.' },
      { date: '1956', fait: 'La loi interdit les expulsions pendant l’hiver.' },
      { date: '1987', fait: 'Il crée une fondation pour le logement des défavorisés.' },
      { date: '22 janvier 2007', fait: 'Mort à Paris ; il est enterré à Esteville.' },
      { date: '2024', fait: 'Des rapports d’Emmaüs publient des accusations d’agressions sexuelles.' },
    ],
    leSaisTu:
      'Emmaüs porte le nom du village de l’Évangile où deux hommes qui rentraient chez eux, désespérés après la mort du Christ, le rencontrent sur la route sans le reconnaître. L’abbé Pierre l’a choisi pour cela : c’est le lieu où l’on retrouve une raison d’avancer. La première maison, à Neuilly-Plaisance, était une auberge de jeunesse en ruine.',
    aRetenir: [
      'De son vrai nom Henri Grouès, l’abbé Pierre est prêtre et résistant, puis député de 1945 à 1951.',
      'Il fonde en 1949 la première communauté Emmaüs : des compagnons qui vivent de la récupération et bâtissent des logements.',
      'Son appel du 1er février 1954, lancé sur Radio Luxembourg pendant une vague de froid, déclenche un immense élan de dons.',
      'Cet élan, appelé « insurrection de la bonté », aboutit aux cités d’urgence et, en 1956, à l’interdiction des expulsions en hiver.',
      'En 2024, dix-sept ans après sa mort, des rapports commandés par Emmaüs ont rendu publiques des accusations d’agressions sexuelles le visant.',
    ],
    mots: [
      {
        mot: 'Emmaüs',
        sens: 'Mouvement fondé en 1949 : des communautés qui vivent de la récupération et de la vente d’objets pour loger les plus pauvres.',
      },
      {
        mot: 'Trêve hivernale',
        sens: 'Période pendant laquelle un locataire ne peut pas être expulsé. Instaurée en 1956, elle court aujourd’hui du 1er novembre au 31 mars.',
      },
      {
        mot: 'Cité d’urgence',
        sens: 'Logements très simples construits en quelques mois, à partir de 1954, pour sortir les familles de la rue et des bidonvilles.',
      },
    ],
    lies: ['simone-veil', 'pierre-mendes-france', 'securite-sociale-1945'],
    niveaux: ['3e'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'abbé Pierre',
      'Emmaüs',
      'hiver 1954',
      'Radio Luxembourg',
      'sans-abri',
      'Henri Grouès',
      'insurrection de la bonté',
      'logement',
      'Neuilly-Plaisance',
      'trêve hivernale',
    ],
  },
  {
    id: 'simone-veil',
    volet: 'personnages',
    nom: 'Simone Veil',
    surnom: 'la déportée devenue ministre',
    dates: '1927 – 2017',
    tri: 2017,
    periode: 'contemporain',
    emoji: '🏛️',
    roles: [
      'Ministre de la Santé',
      'Rescapée d’Auschwitz',
      'Présidente du Parlement européen',
      'Académicienne',
    ],
    origine: 'Nice',
    accroche:
      'Déportée à seize ans, magistrate, ministre : elle fait voter en 1975, sous les insultes, la loi qui dépénalise l’avortement.',
    citations: [
      {
        texte:
          'Je le dis avec toute ma conviction : l’avortement doit rester l’exception, l’ultime recours pour des situations sans issue.',
        contexte: 'Ouverture du débat sur l’IVG, Assemblée nationale, 26 novembre 1974.',
        sens:
          'Elle ne vient pas défendre l’avortement : elle vient défendre une loi qui cesse d’envoyer les femmes chez les faiseuses d’anges et devant les tribunaux.',
      },
      {
        texte:
          'Aucune femme ne recourt de gaieté de cœur à l’avortement. Il suffit d’écouter les femmes. C’est toujours un drame et cela restera toujours un drame.',
        contexte:
          'Même discours, prononcé devant une Assemblée qui ne compte alors qu’une poignée de femmes sur 490 députés.',
      },
      {
        texte:
          'Il n’est pas possible de continuer à fermer les yeux sur les 300 000 avortements qui, chaque année, mutilent les femmes de ce pays, bafouent nos lois et humilient ou traumatisent celles qui y ont recours.',
        contexte: 'Discours du 26 novembre 1974, sur l’avortement clandestin, puni par la loi depuis 1920.',
      },
      {
        texte:
          'Nous étions convaincus que, si nous revenions, on nous écouterait. Et à notre retour, personne ne voulait nous entendre.',
        contexte: 'Sur le retour des camps, en 1945.',
        sens:
          'Les rescapés rentraient avec le besoin de raconter ; le pays, lui, voulait fêter la victoire et tourner la page. Il faudra trente ans pour qu’on les écoute.',
      },
    ],
    reperes: [
      'Née Simone Jacob à Nice en 1927, dans une famille juive française et non pratiquante.',
      'Arrêtée le 30 mars 1944, déportée à Auschwitz-Birkenau le 13 avril : elle y reçoit le matricule 78651.',
      'Sa mère meurt du typhus à Bergen-Belsen en mars 1945 ; son père et son frère ne reviennent pas.',
      'Magistrate, elle réforme la condition des détenus, puis devient en 1970 la première femme secrétaire générale du Conseil supérieur de la magistrature.',
      'Ministre de la Santé en 1974, elle fait voter la loi sur l’IVG, promulguée le 17 janvier 1975.',
      'Première présidente élue du Parlement européen en 1979 ; Académie française en 2008 ; Panthéon en 2018.',
    ],
    recit: [
      {
        titre: 'Nice, 30 mars 1944',
        texte:
          'Simone Jacob est la dernière des quatre enfants d’**André Jacob**, architecte, et d’Yvonne. La famille est juive, française depuis des générations, et ne pratique pas. Les lois de Vichy interdisent au père d’exercer ; la famille se cache à **Nice** sous de faux noms. Tant que les Italiens occupent la ville, les juifs y sont relativement protégés ; après septembre 1943, ce sont les équipes d’Aloïs Brunner qui les traquent dans les rues. Simone passe son **baccalauréat** en mars 1944, à seize ans. Le **30 mars**, en pleine rue, un homme en civil lui demande ses papiers : les faux ne tiennent pas. Sa mère, son frère et une de ses sœurs sont arrêtés dans les heures qui suivent ; seule Denise, entrée dans la Résistance à Lyon, échappe à la rafle. Après le camp de **Drancy**, le convoi n° 71 part le **13 avril 1944** avec 1 500 personnes, dont plus de trois cents enfants.',
      },
      {
        titre: 'Le matricule 78651',
        texte:
          'Le train arrive à **Auschwitz-Birkenau** le 15 avril. Sur le quai, une déportée lui glisse à l’oreille de se dire **âgée de dix-huit ans** : c’est ce mensonge qui la fait passer à droite, du côté du travail, et non à gauche, vers la chambre à gaz. On lui tatoue sur l’avant-bras le numéro **78651** — son nom n’existe plus. Elle travaille d’abord au terrassement, puis une kapo, qui la trouve trop jeune pour mourir là, la fait transférer avec sa mère et sa sœur Milou à **Bobrek**, un petit camp d’usine où l’on meurt moins vite. En **janvier 1945**, devant l’avance soviétique, les SS évacuent : c’est la **marche de la mort** dans la neige jusqu’à Gleiwitz, puis les wagons découverts vers Mauthausen, puis **Bergen-Belsen**, où règnent le typhus et la faim. Sa **mère y meurt en mars 1945**, quelques semaines avant l’arrivée des Anglais. Simone et Milou survivent. Leur père et leur frère, déportés vers la Lituanie, n’ont jamais reparu.',
      },
      {
        titre: 'Le retour, et le silence',
        texte:
          'Elle rentre en mai 1945, à dix-sept ans. Ce qu’elle raconte du retour est peut-être le plus dur de son histoire : on ne veut pas entendre. On confond les **déportés résistants**, qu’on décore, et les **déportés juifs**, envoyés là pour être exterminés ; on lui demande, parfois, comment elle a fait pour en revenir — sous-entendu, ce qu’elle a dû accepter. Elle se tait, et travaille : droit et Sciences Po, mariage avec **Antoine Veil** en octobre 1946, trois fils. Sa sœur Milou, revenue de Ravensbrück, meurt dans un accident de voiture en 1952. En **1956**, contre l’avis de son mari, qui la voulait à la maison, elle passe le concours de la **magistrature** et le réussit. Elle mettra trente ans à parler publiquement des camps, et le fera ensuite jusqu’à la fin de sa vie.',
      },
      {
        titre: 'Une magistrate dans les prisons',
        texte:
          'Elle choisit l’**administration pénitentiaire**, c’est-à-dire les prisons, ce qu’aucune femme de son rang ne faisait. Elle visite les établissements, améliore le sort des **détenues**, obtient pendant la guerre d’Algérie le transfert en France de prisonnières algériennes menacées de sévices, fait séparer les mineurs des adultes. Passée en 1964 à la direction des **affaires civiles**, elle travaille sur l’**adoption** et sur la réforme qui remplace en 1970 la « puissance paternelle » par l’**autorité parentale** partagée entre le père et la mère. En **1970**, elle devient la première femme **secrétaire générale du Conseil supérieur de la magistrature**. Quand Valéry Giscard d’Estaing la nomme en mai 1974 **ministre de la Santé**, elle n’a jamais fait de politique et n’appartient à aucun parti.',
      },
      {
        titre: 'Novembre 1974 : trois jours et trois nuits',
        texte:
          'La loi de **1920** punit l’avortement de prison, et personne n’ignore que des centaines de milliers de femmes y recourent chaque année dans des conditions atroces, ou partent à l’étranger quand elles en ont les moyens. Le manifeste des 343 femmes (1971) et le procès de **Bobigny** (1972) ont rendu le silence intenable. Giscard charge sa ministre de faire passer la loi. Le débat s’ouvre le **26 novembre 1974** et dure trois jours et trois nuits : vingt-cinq heures de séance, soixante-quatorze orateurs. Une partie de sa propre majorité la couvre d’insultes — un député évoque devant elle des embryons « jetés au four crématoire » ; des croix gammées sont peintes sur sa porte, ses fils reçoivent des menaces. Elle tient, sans hausser le ton. La loi est votée dans la nuit du **29 novembre** par **284 voix contre 189**, grâce aux voix de l’opposition de gauche, et promulguée le **17 janvier 1975** — à titre d’essai pour cinq ans. Elle sera rendue définitive en 1979.',
      },
      {
        titre: 'D’Auschwitz au Parlement de l’Europe',
        texte:
          'En **1979**, les citoyens élisent pour la première fois au suffrage universel les députés européens. Simone Veil conduit une liste qui arrive en tête, et le **17 juillet 1979** ses collègues l’élisent **présidente du Parlement européen** : trente-quatre ans après Bergen-Belsen, une rescapée des camps préside l’assemblée de l’Europe réconciliée, à Strasbourg. Elle y restera présidente jusqu’en 1982 et députée jusqu’en 1993, défendant l’idée que l’Europe est d’abord une **entreprise de paix**. Elle revient au gouvernement de 1993 à 1995 comme ministre d’État chargée des Affaires sociales et de la Santé, siège au **Conseil constitutionnel** de 1998 à 2007, et préside la **Fondation pour la mémoire de la Shoah**, où elle consacre ses dernières forces à ce qu’on n’oublie pas les convois.',
      },
      {
        titre: 'Le sabre et le Panthéon',
        texte:
          'Le 20 novembre **2008**, l’**Académie française** l’élit au fauteuil de Racine, laissé vacant par Pierre Messmer. Sur l’épée qu’on lui remet en 2010, elle a fait graver trois choses : son numéro de déportée, **78651** ; la devise de la République, « Liberté, Égalité, Fraternité » ; et celle de l’Union européenne, « Unie dans la diversité ». Elle meurt le **30 juin 2017**, treize jours avant ses quatre-vingt-dix ans. Le **1er juillet 2018**, elle entre au **Panthéon** avec son mari Antoine : cinquième femme à y reposer, quatrième pour ses propres mérites. Sur son cercueil, la République a fait porter ce qu’elle avait gravé sur son épée — c’est-à-dire l’histoire d’une adolescente qu’on avait réduite à un numéro et qui a écrit une loi, présidé un parlement et fait entrer sa mémoire au Panthéon.',
      },
    ],
    chrono: [
      { date: '13 juillet 1927', fait: 'Naissance de Simone Jacob, à Nice.' },
      { date: '30 mars 1944', fait: 'Arrêtée à Nice, le mois de son baccalauréat.' },
      { date: '15 avril 1944', fait: 'Arrivée à Auschwitz-Birkenau : matricule 78651.' },
      { date: 'janvier 1945', fait: 'Marche de la mort, puis Bergen-Belsen.' },
      { date: 'mai 1945', fait: 'Retour en France, sans ses parents ni son frère.' },
      { date: '1956', fait: 'Reçue à la magistrature ; elle entre dans l’administration des prisons.' },
      { date: 'mai 1974', fait: 'Ministre de la Santé du gouvernement Chirac.' },
      { date: '29 novembre 1974', fait: 'La loi sur l’IVG votée par 284 voix contre 189.' },
      { date: '17 janvier 1975', fait: 'Promulgation de la loi Veil.' },
      { date: '17 juillet 1979', fait: 'Première présidente élue du Parlement européen.' },
      { date: '2008', fait: 'Élue à l’Académie française.' },
      { date: '1er juillet 2018', fait: 'Entrée au Panthéon avec son mari Antoine.' },
    ],
    leSaisTu:
      'Elle a gardé toute sa vie le tatouage 78651 sur l’avant-bras, sans jamais le cacher, et l’a fait graver sur son épée d’académicienne en 2010, à côté de la devise de la République. « C’est mon nom d’Auschwitz », disait-elle : un numéro donné pour effacer quelqu’un, qu’elle a transformé en signature.',
    aRetenir: [
      'Simone Veil, née Jacob, est déportée à Auschwitz-Birkenau à seize ans en avril 1944 et libérée à Bergen-Belsen en avril 1945.',
      'Ministre de la Santé, elle défend devant l’Assemblée la loi dépénalisant l’avortement, votée le 29 novembre 1974 et promulguée le 17 janvier 1975.',
      'La loi autorise l’interruption volontaire de grossesse dans les dix premières semaines ; adoptée pour cinq ans, elle est rendue définitive en 1979.',
      'Élue au Parlement européen en 1979, elle en devient la première présidente : une rescapée des camps préside l’assemblée de l’Europe réconciliée.',
      'Élue à l’Académie française en 2008, elle entre au Panthéon avec son mari Antoine le 1er juillet 2018.',
    ],
    mots: [
      {
        mot: 'IVG',
        sens: 'Interruption volontaire de grossesse : l’avortement pratiqué à la demande de la femme, dans le délai fixé par la loi.',
      },
      {
        mot: 'Dépénaliser',
        sens: 'Retirer du code pénal un acte qui était puni. L’avortement l’était en France depuis la loi de 1920.',
      },
      {
        mot: 'Déportation',
        sens: 'Transfert forcé vers les camps nazis : les juifs y étaient envoyés pour être exterminés, les résistants pour être détenus et exploités.',
      },
    ],
    lies: ['loi-veil-1975', 'la-shoah', 'rene-cassin', 'simone-de-beauvoir', 'robert-schuman'],
    niveaux: ['3e', 'Tle'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'Simone Veil',
      'IVG',
      'loi Veil',
      '17 janvier 1975',
      'Auschwitz',
      '78651',
      'Parlement européen',
      'Panthéon',
      'Shoah',
      'Nice',
      'avortement',
      'Académie française',
    ],
  },
]
