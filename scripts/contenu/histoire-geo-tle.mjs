// Histoire-géographie — Terminale : les chapitres 7 à 11 du programme fourni.
//
// ⚠️ PARTIEL, ET C'EST VOLONTAIRE. Les captures transmises couvrent les
// chapitres 7 → 11 ; les chapitres 1 à 6 manquaient encore — ils ont été écrits
// depuis, dans `histoire-tle-1-6.mjs` (migration 246), qui occupe exactement la
// place réservée ci-dessous et pose au passage l'axe de ces 13 fiches-ci. D'où le trou de
// numérotation : les 5 chapitres déjà en base occupent les positions 1 à 5, et
// ce bloc démarre à 26 — les positions 6 à 25 sont RÉSERVÉES aux chapitres 1
// à 6 à venir. Conséquence pratique : cette migration peut être exécutée telle
// quelle, et la suite viendra s'insérer AU BON ENDROIT sans avoir à renuméroter
// des lignes déjà en base (un INSERT gardé par ON CONFLICT DO NOTHING ne met
// jamais à jour une position existante).
//
// Les 5 chapitres déjà présents (« Démocraties fragiles et totalitarismes »,
// « La Seconde Guerre mondiale », « La Guerre froide », « Mers et océans dans
// la mondialisation », « L'Union européenne dans la mondialisation ») RESTENT :
// aucun titre n'entre en collision avec les 13 fiches ci-dessous.
//
// Découpage : chaque fiche du programme devient un chapitre, la page matière
// affichant une liste plate. L'ordre porte donc le regroupement d'origine
// (ch. 7 équilibres · ch. 8 France 1974-1988 · ch. 9 rapports de puissance ·
// ch. 10 construction européenne · ch. 11 République française).

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE Tle — LE MONDE DEPUIS 1989 (chapitres 7 à 11)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-contenu.mjs, 05/08/2026) :
l'histoire-géo de Terminale s'arrêtait à 5 chapitres, dont le dernier
événement était la Guerre froide. Tout le programme d'après 1989 — la fin de
l'URSS, la Chine de Deng Xiaoping, la France de 1974 à 1988, les crises
européennes, la Ve République d'aujourd'hui — n'existait nulle part.
Cette migration AJOUTE 13 fiches (chapitres 7 à 11 du programme) derrière
les 5 existantes, qui restent en place. Les chapitres 1 à 6 restent À ÉCRIRE :
les positions 6 à 25 leur sont réservées.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→5 : les chapitres déjà en base. 6→25 : réservés aux chapitres 1 à 6
      // du programme, encore à écrire. 26→38 : ce bloc.
      positionDepart: 26,
      chapitres: [
        // ======= Chapitre 7 — La modification des grands équilibres ========
        {
          titre: 'L’influence de la chute de l’URSS sur l’Europe',
          lecon: {
            titre: 'De deux Europes à une seule',
            cours: `En moins de trois ans, l'Europe issue de Yalta disparaît. Le continent qui en sort n'est pas seulement réunifié : il est à reconstruire.

## L'effondrement, 1989-1991
Gorbatchev, au pouvoir depuis 1985, lance la *perestroïka* (restructuration économique) et la *glasnost* (transparence), et renonce à la doctrine Brejnev : Moscou n'interviendra plus pour sauver les régimes frères. Privés de ce filet, ils tombent en quelques mois — Pologne, Hongrie, RDA, Tchécoslovaquie, Roumanie. Le **mur de Berlin** s'ouvre le **9 novembre 1989**, l'Allemagne est réunifiée le **3 octobre 1990**, et l'**URSS est dissoute le 25 décembre 1991**.

## Une transition brutale
Les anciennes démocraties populaires passent à l'économie de marché par la « thérapie de choc » : privatisations, fin des prix administrés, effondrement de la production, chômage de masse inconnu jusque-là. La Russie de Eltsine connaît une décennie de crise, jusqu'au redressement autoritaire engagé par Poutine à partir de 2000.

## L'Europe recomposée
L'Union européenne et l'OTAN s'élargissent vers l'est : entrée dans l'OTAN de la Pologne, la Hongrie et la République tchèque en **1999**, puis des pays baltes en 2004 ; élargissement de l'UE à dix pays en **2004**. L'Allemagne réunifiée devient la première puissance économique du continent.

## Le retour de la guerre
La disparition du carcan communiste libère aussi les nationalismes. La **Yougoslavie** éclate à partir de 1991 : guerres de Croatie et de Bosnie, massacre de **Srebrenica (juillet 1995)**, intervention de l'OTAN au **Kosovo en 1999**. L'Europe découvre qu'elle ne sait pas régler seule un conflit sur son propre sol.`,
          },
          questions: [
            ['Quand le mur de Berlin s’est-il ouvert ?', ['Le 9 novembre 1989', 'Le 3 octobre 1990', 'Le 25 décembre 1991', 'Le 1er mai 1989'], 0, 'La réunification allemande suivra le 3 octobre 1990.'],
            ['L’URSS est officiellement dissoute en…', ['décembre 1991', 'novembre 1989', 'janvier 1990', 'août 1993'], 0, 'Gorbatchev démissionne le 25 décembre 1991.'],
            ['La *glasnost* désigne la restructuration de l’économie soviétique.', ['Vrai', 'Faux'], 1, 'La *glasnost* est la transparence ; la restructuration est la *perestroïka*.'],
            ['Quel massacre a lieu en Bosnie en juillet 1995 ?', ['Srebrenica', 'Sarajevo', 'Vukovar', 'Pristina'], 0, 'Plus de 8 000 hommes et adolescents bosniaques y sont tués.'],
            ['L’Allemagne est réunifiée moins d’un an après l’ouverture du Mur.', ['Vrai', 'Faux'], 0, 'Novembre 1989 → 3 octobre 1990.'],
            ['En 1999, l’OTAN intervient…', ['Au Kosovo', 'En Tchétchénie', 'En Géorgie', 'En Ukraine'], 0, 'Campagne aérienne contre la Serbie de Milošević.'],
            ['L’UE s’élargit à dix nouveaux États en…', ['2004', '1995', '1999', '2007'], 0, 'Le plus grand élargissement de son histoire, surtout vers l’Est.'],
            ['La transition vers l’économie de marché s’est faite sans coût social.', ['Vrai', 'Faux'], 1, 'La « thérapie de choc » a provoqué chute de la production et chômage de masse.'],
          ],
        },
        {
          titre: 'Le Proche-Orient au cœur de la nouvelle géopolitique mondiale',
          lecon: {
            titre: 'Pétrole, conflits et ingérences',
            cours: `Le Proche et le Moyen-Orient concentrent depuis 1945 trois enjeux qui s'entretiennent : les hydrocarbures, le conflit israélo-palestinien, et la rivalité des puissances.

## Le poids du pétrole
La région détient près de la moitié des réserves mondiales de pétrole. Les chocs de **1973** et **1979** ont montré qu'un événement régional pouvait dérégler l'économie mondiale. Le détroit d'Ormuz et le canal de Suez restent des passages stratégiques majeurs.

## Le conflit israélo-palestinien
Après les guerres de 1948, 1967 (guerre des Six Jours, occupation de la Cisjordanie, de Gaza et du Golan) et 1973, la première **Intifada** (1987) change le rapport de force. Les **accords d'Oslo (1993)** créent l'Autorité palestinienne et esquissent la solution à deux États, mais le processus s'enlise : assassinat de Rabin (1995), seconde Intifada (2000), poursuite de la colonisation. Aucun règlement n'est intervenu depuis.

## Les guerres du Golfe
L'invasion du Koweït par l'Irak de Saddam Hussein déclenche la **guerre du Golfe (1991)**, menée par une coalition sous mandat de l'ONU. En **2003**, l'invasion de l'Irak par les États-Unis se fait au contraire **sans mandat du Conseil de sécurité**, sur la base d'armes de destruction massive jamais retrouvées — la France s'y oppose (discours de Villepin à l'ONU).

## Fractures et recompositions
Rivalité entre l'Arabie saoudite sunnite et l'Iran chiite, révolution iranienne de 1979, montée des mouvements islamistes, **printemps arabes de 2011** aux issues divergentes, guerre civile syrienne et émergence de Daech (2014). La région reste le premier foyer de conflits armés du monde.`,
          },
          questions: [
            ['Les accords d’Oslo sont signés en…', ['1993', '1979', '1987', '2000'], 0, 'Ils créent l’Autorité palestinienne et esquissent deux États.'],
            ['La guerre du Golfe de 1991 est menée…', ['Par une coalition sous mandat de l’ONU', 'Par les États-Unis seuls', 'Par l’OTAN sans mandat', 'Par la Ligue arabe'], 0, 'Après l’invasion du Koweït par l’Irak.'],
            ['L’invasion de l’Irak en 2003 a reçu l’aval du Conseil de sécurité de l’ONU.', ['Vrai', 'Faux'], 1, 'Elle s’est faite sans mandat ; la France s’y est opposée.'],
            ['Que désigne l’Intifada ?', ['Le soulèvement palestinien', 'Un parti politique israélien', 'Un accord de paix', 'Une organisation pétrolière'], 0, 'La première éclate en 1987, la seconde en 2000.'],
            ['La révolution iranienne a lieu en 1979.', ['Vrai', 'Faux'], 0, 'Elle contribue au second choc pétrolier la même année.'],
            ['Quel détroit constitue un passage pétrolier stratégique de la région ?', ['Le détroit d’Ormuz', 'Le détroit de Malacca', 'Le Bosphore', 'Le détroit de Gibraltar'], 0, 'Une part majeure du pétrole mondial y transite.'],
            ['Les printemps arabes de 2011 ont partout abouti à des démocraties stables.', ['Vrai', 'Faux'], 1, 'Les issues divergent : transition en Tunisie, guerre civile en Syrie et en Libye.'],
            ['La guerre des Six Jours (1967) aboutit à…', ['L’occupation de la Cisjordanie, de Gaza et du Golan', 'La création de l’État d’Israël', 'Les accords de Camp David', 'La création de l’Autorité palestinienne'], 0, 'Elle redessine durablement la carte du conflit.'],
          ],
        },
        {
          titre: 'La montée de la puissance économique chinoise de 1978 à 2001',
          lecon: {
            titre: 'Deng Xiaoping et le « socialisme de marché »',
            cours: `En une génération, la Chine passe d'une économie collectivisée et fermée au rang d'atelier du monde — sans changer de régime politique.

## Le tournant de 1978
Deux ans après la mort de Mao, **Deng Xiaoping** engage les **Quatre Modernisations** (agriculture, industrie, défense, science et technique). Le mot d'ordre est pragmatique : « peu importe qu'un chat soit noir ou blanc, pourvu qu'il attrape les souris ». Les communes populaires sont démantelées, la terre revient aux familles par contrat, la production agricole bondit.

## L'ouverture maîtrisée
Quatre **zones économiques spéciales** sont créées en 1980, dont **Shenzhen**, alors village de pêcheurs face à Hong Kong. Elles accueillent les capitaux étrangers avec des avantages fiscaux et une main-d'œuvre bon marché. Le littoral devient le moteur de la croissance, creusant un écart durable avec l'intérieur rural.

## Réforme économique, pas politique
Le printemps de Pékin s'achève par la répression de la place **Tian'anmen (juin 1989)** : le Parti communiste montre que l'ouverture économique ne s'étendra pas au politique. La croissance reprend après la « tournée dans le Sud » de Deng en 1992, sous le nom d'« économie socialiste de marché ».

## L'entrée dans la mondialisation
Hong Kong est rétrocédée en **1997**, Macao en 1999. Surtout, la Chine adhère à l'**OMC en décembre 2001** : ses exportations explosent, elle devient l'usine du monde puis, dans la décennie suivante, la deuxième économie mondiale. La croissance a longtemps dépassé 9 % par an.`,
          },
          questions: [
            ['Qui engage les réformes économiques chinoises à partir de 1978 ?', ['Deng Xiaoping', 'Mao Zedong', 'Jiang Zemin', 'Zhou Enlai'], 0, 'Deux ans après la mort de Mao.'],
            ['Les Quatre Modernisations concernent l’agriculture, l’industrie, la défense et…', ['La science et la technique', 'La culture', 'L’éducation religieuse', 'Le tourisme'], 0, 'Le programme est technique, jamais politique.'],
            ['Shenzhen était un grand port industriel avant 1980.', ['Vrai', 'Faux'], 1, 'C’était un village de pêcheurs, devenu zone économique spéciale.'],
            ['La répression de la place Tian’anmen a lieu en…', ['juin 1989', 'juin 1978', 'octobre 1992', 'décembre 2001'], 0, 'Elle montre que l’ouverture reste strictement économique.'],
            ['La Chine adhère à l’OMC en…', ['2001', '1992', '1997', '2008'], 0, 'L’adhésion accélère spectaculairement ses exportations.'],
            ['Hong Kong est rétrocédée à la Chine en 1997.', ['Vrai', 'Faux'], 0, 'Macao suit en 1999.'],
            ['Les zones économiques spéciales sont situées…', ['Sur le littoral', 'Dans l’intérieur rural', 'Au Tibet', 'En Mandchourie uniquement'], 0, 'D’où le creusement des inégalités littoral / intérieur.'],
            ['Les réformes de Deng se sont accompagnées d’une démocratisation du régime.', ['Vrai', 'Faux'], 1, 'Le Parti communiste conserve le monopole du pouvoir politique.'],
          ],
        },
        {
          titre: '1989, une année de bouleversement géopolitique et économique',
          lecon: {
            titre: 'L’année charnière',
            cours: `Rarement une année aura autant concentré de ruptures. 1989 ferme le XXe siècle politique et ouvre la mondialisation contemporaine.

## Le printemps de Pékin
En avril, des étudiants occupent la place Tian'anmen et réclament des réformes politiques. Le mouvement est écrasé dans la nuit du **3 au 4 juin 1989**. La Chine choisit une voie inverse de celle qui s'ouvre en Europe : réformer l'économie, verrouiller le politique.

## L'automne des peuples
En quelques semaines, les régimes communistes d'Europe centrale s'effondrent presque tous sans violence : élections semi-libres en Pologne (juin), ouverture du rideau de fer par la Hongrie (été), **chute du mur de Berlin le 9 novembre**, « révolution de velours » en Tchécoslovaquie. Seule la Roumanie connaît un dénouement sanglant, avec l'exécution de Ceaușescu en décembre.

## Un basculement économique
Le **consensus de Washington** (1989) formule le programme des institutions financières internationales : libéralisation, privatisations, discipline budgétaire, ouverture aux capitaux. Il servira de cadre aux transitions post-communistes comme aux plans d'ajustement du Sud.

## « La fin de l'histoire » ?
Francis Fukuyama annonce en 1989 le triomphe définitif de la démocratie libérale et de l'économie de marché. Les décennies suivantes démentiront cette prophétie — guerres yougoslaves, terrorisme international, régimes autoritaires assumés, retour de la guerre en Europe — mais la formule dit bien l'euphorie du moment.`,
          },
          questions: [
            ['Que se passe-t-il place Tian’anmen dans la nuit du 3 au 4 juin 1989 ?', ['Le mouvement étudiant est écrasé', 'Un accord de réforme est signé', 'Le Parti communiste est dissous', 'Deng Xiaoping démissionne'], 0, 'La Chine verrouille le politique tout en ouvrant l’économie.'],
            ['Quel pays connaît en 1989 une sortie du communisme violente ?', ['La Roumanie', 'La Pologne', 'La Hongrie', 'La Tchécoslovaquie'], 0, 'Ceaușescu est exécuté en décembre.'],
            ['La « révolution de velours » désigne la transition tchécoslovaque.', ['Vrai', 'Faux'], 0, 'Pacifique, elle porte Václav Havel à la présidence.'],
            ['Le consensus de Washington préconise…', ['Libéralisation, privatisations et discipline budgétaire', 'La planification centralisée', 'Le protectionnisme généralisé', 'La nationalisation des banques'], 0, 'Il inspire les plans d’ajustement structurel.'],
            ['Qui annonce en 1989 « la fin de l’histoire » ?', ['Francis Fukuyama', 'Samuel Huntington', 'Mikhaïl Gorbatchev', 'Hubert Védrine'], 0, 'Il y voit le triomphe définitif de la démocratie libérale.'],
            ['L’URSS disparaît elle aussi en 1989.', ['Vrai', 'Faux'], 1, 'Elle est dissoute deux ans plus tard, en décembre 1991.'],
            ['La Hongrie joue un rôle décisif en 1989 en…', ['Ouvrant sa frontière avec l’Autriche', 'Envahissant l’Autriche', 'Quittant l’ONU', 'Rejoignant l’OTAN'], 0, 'Des milliers d’Allemands de l’Est passent alors à l’Ouest.'],
            ['La prophétie de Fukuyama s’est vérifiée dans les décennies suivantes.', ['Vrai', 'Faux'], 1, 'Guerres, terrorisme et régimes autoritaires l’ont démentie.'],
          ],
        },
        // ======= Chapitre 8 — La France de 1974 à 1988 =====================
        {
          titre: 'La crise économique et politique en France (1974-1988)',
          lecon: {
            titre: 'La fin des Trente Glorieuses',
            cours: `En 1974, la France entre dans une crise dont elle ne sortira pas : le chômage de masse s'installe, et avec lui une recomposition complète de la vie politique.

## Le choc et la fin d'un cycle
Le **premier choc pétrolier (1973)** quadruple le prix du baril, le **second (1979)** achève le mouvement. L'inflation atteint plus de 13 % par an, la croissance s'effondre, l'industrie lourde — sidérurgie lorraine, charbon, textile, chantiers navals — entre en déclin. Le chômage passe de 400 000 personnes en 1974 à plus de **2,5 millions en 1988**.

## Giscard, la modernisation dans la crise
Élu en 1974, **Valéry Giscard d'Estaing** engage des réformes de société (voir la fiche suivante) et confie l'économie à Raymond Barre à partir de 1976 : lutte contre l'inflation, rigueur, « libéralisme ». Sans résultat sur l'emploi.

## 1981 : l'alternance
**François Mitterrand** est élu le 10 mai 1981 — première alternance de la Ve République. Le programme de relance est appliqué : nationalisations (banques, grands groupes industriels), retraite à 60 ans, cinquième semaine de congés payés, semaine de 39 heures, hausse du SMIC. Mais la relance dans un contexte de récession mondiale creuse le déficit extérieur et provoque trois dévaluations du franc.

## Le tournant de la rigueur
En **mars 1983**, le gouvernement choisit de rester dans le Système monétaire européen et adopte un plan de rigueur : blocage des salaires, réduction des déficits. C'est une rupture idéologique durable pour la gauche française. Les élections de 1986 sont perdues, ouvrant la **première cohabitation** (Mitterrand président, Chirac Premier ministre), qui procède aux premières privatisations.`,
          },
          questions: [
            ['Quel événement de 1973 marque le début de la crise ?', ['Le premier choc pétrolier', 'La dévaluation du franc', 'La création de l’euro', 'La fin du service militaire'], 0, 'Le prix du baril est multiplié par quatre.'],
            ['Qui est élu président de la République en 1974 ?', ['Valéry Giscard d’Estaing', 'François Mitterrand', 'Georges Pompidou', 'Jacques Chirac'], 0, 'Il succède à Pompidou, mort en fonction.'],
            ['L’élection de François Mitterrand en 1981 est la première alternance de la Ve République.', ['Vrai', 'Faux'], 0, 'La gauche accède au pouvoir pour la première fois depuis 1958.'],
            ['Parmi ces mesures de 1981-1982, laquelle est exacte ?', ['La retraite à 60 ans', 'La retraite à 65 ans', 'La semaine de 35 heures', 'La suppression du SMIC'], 0, 'Avec la cinquième semaine de congés payés et les 39 heures.'],
            ['Le « tournant de la rigueur » a lieu en…', ['1983', '1981', '1986', '1988'], 0, 'La France choisit de rester dans le Système monétaire européen.'],
            ['La relance de 1981 a fait reculer le chômage durablement.', ['Vrai', 'Faux'], 1, 'Menée à contre-courant de la conjoncture mondiale, elle creuse les déficits.'],
            ['La première cohabitation débute en 1986 avec…', ['Jacques Chirac comme Premier ministre', 'Raymond Barre comme Premier ministre', 'Michel Rocard comme Premier ministre', 'Laurent Fabius comme Premier ministre'], 0, 'Mitterrand reste président : la Constitution résiste à l’épreuve.'],
            ['Le chômage dépasse 2 millions de personnes dans les années 1980.', ['Vrai', 'Faux'], 0, 'Il atteint plus de 2,5 millions en 1988, contre 400 000 en 1974.'],
          ],
        },
        {
          titre: 'Les mutations sociales et culturelles de la société française',
          lecon: {
            titre: 'Une société qui change de mœurs',
            cours: `Pendant que l'économie se dégrade, la société française connaît une transformation profonde de ses droits, de ses mœurs et de sa culture.

## Les grandes lois de société
La majorité passe à **18 ans en 1974**. Le divorce par consentement mutuel est instauré en **1975**, année où la **loi Veil** dépénalise l'**interruption volontaire de grossesse** (remboursée à partir de 1982). En **1981**, sous l'impulsion de Robert Badinter, la **peine de mort est abolie**.

## Les femmes
Leur activité professionnelle progresse fortement, la contraception se diffuse (loi Neuwirth de 1967, remboursement en 1974), la natalité baisse. Un ministère des Droits de la femme est créé en 1981 (Yvette Roudy), et la loi de 1983 pose l'égalité professionnelle. Les inégalités de salaire et le partage des tâches domestiques, eux, résistent.

## Immigration et société
L'immigration de travail est suspendue en **1974**, mais le regroupement familial (1976) transforme une immigration d'hommes seuls en immigration de familles installées. Les difficultés des grands ensembles, la montée du chômage et l'apparition du Front national dans les urnes (1983-1984) font de l'immigration un enjeu politique central. La **Marche pour l'égalité et contre le racisme (1983)** marque l'entrée d'une génération née en France dans le débat public.

## Une culture de masse
Libéralisation des **radios libres (1981)**, création de **Canal+ (1984)** puis des chaînes privées, essor du disque, du cinéma et des pratiques juvéniles. L'État culturel s'affirme sous Jack Lang : Fête de la musique (1982), grands travaux, doublement du budget de la Culture.`,
          },
          questions: [
            ['La loi Veil de 1975 concerne…', ['L’interruption volontaire de grossesse', 'Le divorce par consentement mutuel', 'La peine de mort', 'La majorité à 18 ans'], 0, 'L’IVG est dépénalisée, puis remboursée en 1982.'],
            ['La peine de mort est abolie en France en…', ['1981', '1975', '1974', '1986'], 0, 'Loi portée par le garde des Sceaux Robert Badinter.'],
            ['La majorité passe de 21 à 18 ans en 1974.', ['Vrai', 'Faux'], 0, 'C’est l’une des premières mesures du septennat de Giscard d’Estaing.'],
            ['L’immigration de travail est suspendue en…', ['1974', '1981', '1968', '1986'], 0, 'Le regroupement familial (1976) modifie ensuite la nature de l’immigration.'],
            ['La Marche pour l’égalité et contre le racisme a lieu en…', ['1983', '1974', '1990', '1981'], 0, 'Partie de Marseille, elle s’achève à Paris.'],
            ['Les radios libres sont légalisées en 1981.', ['Vrai', 'Faux'], 0, 'Fin du monopole d’État sur la radiodiffusion.'],
            ['Quelle création culturelle date de 1982 ?', ['La Fête de la musique', 'Canal+', 'La Fête du cinéma', 'Le Centre Pompidou'], 0, 'Sous le ministère de Jack Lang.'],
            ['L’égalité salariale entre femmes et hommes était réalisée à la fin des années 1980.', ['Vrai', 'Faux'], 1, 'La loi de 1983 la pose en principe, les écarts demeurent.'],
          ],
        },
        // ======= Chapitre 9 — Nouveaux rapports de puissance ===============
        {
          titre: 'Les États-Unis, gendarmes du monde',
          lecon: {
            titre: 'L’hyperpuissance et ses limites',
            cours: `Après 1991, les États-Unis sont la seule superpuissance — militaire, économique, technologique et culturelle. Hubert Védrine forge en 1998 le mot d'**hyperpuissance** pour dire cette situation inédite.

## Les fondements de la domination
Premier budget militaire du monde, réseau de bases sur tous les continents, dollar comme monnaie des échanges, universités et firmes dominantes, et un **soft power** — cinéma, musique, numérique — sans équivalent.

## Le gendarme des années 1990
Guerre du Golfe (1991) sous mandat de l'ONU, interventions en Somalie (1992), en Bosnie (accords de Dayton, 1995), au Kosovo (1999, sans mandat du Conseil de sécurité). Les États-Unis se posent en garants de l'ordre international, tout en choisissant leurs engagements — l'inaction lors du **génocide des Tutsi au Rwanda (1994)** en est la contre-épreuve.

## Le 11 septembre 2001 et ses suites
Les attentats d'al-Qaïda font près de 3 000 morts. Washington lance la « guerre contre le terrorisme » : Afghanistan (2001), puis **Irak (2003)** sans mandat de l'ONU et sur un motif — les armes de destruction massive — jamais vérifié. L'enlisement, Guantánamo et Abou Ghraib abîment durablement l'image du pays.

## Les limites
Coût humain et financier des guerres, retrait d'Irak (2011) puis d'Afghanistan (2021), montée de la Chine, tentation du repli (« America First »). La puissance reste immense, mais elle ne suffit plus à imposer un ordre : c'est le sens du passage d'un monde unipolaire à un monde multipolaire.`,
          },
          questions: [
            ['Qui forge le terme d’« hyperpuissance » ?', ['Hubert Védrine', 'Francis Fukuyama', 'Samuel Huntington', 'Bill Clinton'], 0, 'En 1998, pour désigner la domination américaine dans tous les domaines.'],
            ['Le « soft power » désigne…', ['L’influence culturelle et idéologique', 'La puissance militaire', 'La force économique brute', 'Le nombre d’alliés militaires'], 0, 'Cinéma, musique, universités, numérique.'],
            ['L’intervention américaine en Irak en 2003 a été autorisée par l’ONU.', ['Vrai', 'Faux'], 1, 'Elle s’est faite sans mandat du Conseil de sécurité.'],
            ['Les attentats du 11 septembre 2001 sont revendiqués par…', ['Al-Qaïda', 'Daech', 'Le Hezbollah', 'Les Talibans'], 0, 'Ils déclenchent la « guerre contre le terrorisme ».'],
            ['En 1994, les États-Unis et la communauté internationale n’interviennent pas lors du génocide des Tutsi au Rwanda.', ['Vrai', 'Faux'], 0, 'Cette inaction est la contre-épreuve du rôle de « gendarme ».'],
            ['Les États-Unis se retirent d’Afghanistan en…', ['2021', '2011', '2014', '2003'], 0, 'Vingt ans après l’intervention de 2001.'],
            ['Les accords de Dayton (1995) mettent fin à la guerre…', ['De Bosnie', 'Du Kosovo', 'Du Golfe', 'De Somalie'], 0, 'Négociés sous égide américaine.'],
            ['La puissance américaine suffit aujourd’hui à imposer seule l’ordre mondial.', ['Vrai', 'Faux'], 1, 'La montée de la Chine et les échecs militaires ont ouvert un monde multipolaire.'],
          ],
        },
        {
          titre: 'Les efforts de coopération internationale depuis 1990',
          lecon: {
            titre: 'Gouverner un monde sans gouvernement',
            cours: `Les problèmes sont devenus mondiaux — climat, pandémies, finance, migrations — alors que le pouvoir reste national. D'où la multiplication des institutions et des accords, et la fragilité de chacun.

## Les organisations
L'**ONU** reste le cadre principal : maintien de la paix (les casques bleus), agences spécialisées (OMS, UNESCO, PNUD). L'**OMC**, créée en 1995, arbitre le commerce mondial. Le **G7**, puis le **G20** à partir de 2008, réunissent les grandes économies — l'élargissement au G20 acte le poids nouveau des émergents.

## Le climat
**Sommet de Rio (1992)**, **protocole de Kyoto (1997)** — que les États-Unis ne ratifient pas —, puis l'**accord de Paris (COP21, 2015)** : 195 États s'engagent à contenir le réchauffement bien en dessous de 2 °C. L'accord est universel mais **non contraignant**, et les engagements nationaux restent en deçà de l'objectif. Le **GIEC**, créé en 1988, fournit la base scientifique commune.

## La justice et les droits
La **Cour pénale internationale** entre en fonction en 2002 pour juger génocides, crimes contre l'humanité et crimes de guerre. Plusieurs grandes puissances — États-Unis, Chine, Russie — n'en reconnaissent pas la compétence. Les **Objectifs de développement durable** (2015) fixent 17 cibles à l'horizon 2030.

## Les limites structurelles
Le **droit de veto** des cinq membres permanents du Conseil de sécurité bloque toute décision contraire à leurs intérêts ; aucune institution ne peut contraindre un État souverain ; le financement dépend de contributions volontaires. La coopération produit des normes, rarement des sanctions.`,
          },
          questions: [
            ['L’accord de Paris sur le climat est signé lors de…', ['La COP21, en 2015', 'Le sommet de Rio, en 1992', 'Le protocole de Kyoto, en 1997', 'La COP26, en 2021'], 0, '195 États s’engagent à limiter le réchauffement bien en dessous de 2 °C.'],
            ['L’accord de Paris est juridiquement contraignant et assorti de sanctions.', ['Vrai', 'Faux'], 1, 'Les engagements nationaux sont volontaires : c’est sa principale faiblesse.'],
            ['Que juge la Cour pénale internationale ?', ['Génocides, crimes contre l’humanité et crimes de guerre', 'Les litiges commerciaux', 'Les conflits frontaliers entre États', 'Les infractions environnementales'], 0, 'Elle fonctionne depuis 2002.'],
            ['Le G20 remplace le G7 comme forum principal à partir de…', ['2008', '1995', '1992', '2015'], 0, 'La crise financière impose d’associer les grandes économies émergentes.'],
            ['Le GIEC produit la base scientifique commune sur le climat.', ['Vrai', 'Faux'], 0, 'Créé en 1988, il synthétise l’état des connaissances.'],
            ['Qu’est-ce qui bloque le plus souvent une décision du Conseil de sécurité ?', ['Le droit de veto des cinq membres permanents', 'Le vote de l’Assemblée générale', 'Le refus du secrétaire général', 'L’absence de budget'], 0, 'États-Unis, Russie, Chine, France, Royaume-Uni.'],
            ['Les États-Unis ont ratifié le protocole de Kyoto.', ['Vrai', 'Faux'], 1, 'Leur refus a considérablement affaibli le texte.'],
            ['L’OMC, créée en 1995, a pour rôle…', ['D’arbitrer le commerce mondial', 'De financer les pays pauvres', 'De maintenir la paix', 'De fixer les taux de change'], 0, 'Elle succède au GATT.'],
          ],
        },
        {
          titre: 'Un monde multipolaire (2001 - ) : de nouveaux types de conflits',
          lecon: {
            titre: 'Puissances rivales et guerres sans front',
            cours: `Le monde issu de 1991 n'a pas duré. Depuis 2001, la puissance se redistribue, et la guerre change de forme.

## De l'unipolaire au multipolaire
La Chine devient la deuxième économie mondiale, la Russie se réaffirme militairement, l'Inde, le Brésil, la Turquie ou l'Afrique du Sud pèsent régionalement. Les **BRICS** (formalisés en 2009) contestent l'ordre issu de 1945. L'Union européenne, elle, est une puissance économique et normative sans commandement militaire unifié.

## Le terrorisme transnational
Al-Qaïda puis **Daech** (proclamation du « califat » en 2014) mènent une guerre sans territoire fixe et sans armée régulière. La France est frappée en **2015** (*Charlie Hebdo* en janvier, Paris et le Bataclan le 13 novembre) et en 2016 (Nice). La riposte mêle interventions extérieures (Sahel, Levant) et sécurité intérieure — au prix d'un débat récurrent entre sécurité et libertés.

## Les guerres asymétriques et hybrides
Face à des armées régulières, des groupes armés emploient guérilla, attentats et propagande en ligne. Les États eux-mêmes combinent moyens militaires et non militaires : **cyberattaques**, désinformation, pressions énergétiques, mercenaires. Le champ de bataille inclut désormais l'information et les réseaux.

## Le retour de la guerre interétatique
L'annexion de la Crimée (2014) puis l'**invasion russe de l'Ukraine en février 2022** ramènent en Europe un conflit classique de haute intensité, avec front, artillerie et occupation. La guerre n'avait pas disparu : elle avait changé de lieu.`,
          },
          questions: [
            ['Que désigne le sigle BRICS ?', ['Un groupe de grandes économies émergentes', 'Une alliance militaire', 'Une agence de l’ONU', 'Un accord climatique'], 0, 'Brésil, Russie, Inde, Chine, Afrique du Sud, puis élargi.'],
            ['Daech proclame son « califat » en…', ['2014', '2001', '2011', '2019'], 0, 'Sur des territoires d’Irak et de Syrie.'],
            ['La France est frappée par des attentats majeurs en 2015.', ['Vrai', 'Faux'], 0, '*Charlie Hebdo* en janvier, Paris et le Bataclan le 13 novembre.'],
            ['Une guerre asymétrique oppose…', ['Une armée régulière à des groupes armés irréguliers', 'Deux armées régulières de force égale', 'Deux alliances militaires', 'Deux puissances nucléaires'], 0, 'Guérilla, attentats, propagande en ligne.'],
            ['Qu’ajoute la notion de guerre « hybride » ?', ['La combinaison de moyens militaires et non militaires', 'L’emploi exclusif de drones', 'La guerre menée par l’ONU', 'Le recours à l’arme nucléaire'], 0, 'Cyberattaques, désinformation, pressions économiques.'],
            ['La Russie annexe la Crimée en 2014.', ['Vrai', 'Faux'], 0, 'Huit ans avant l’invasion à grande échelle de l’Ukraine.'],
            ['L’invasion russe de l’Ukraine commence en…', ['février 2022', 'février 2014', 'septembre 2021', 'mars 2020'], 0, 'Elle ramène en Europe une guerre de haute intensité.'],
            ['L’Union européenne dispose d’un commandement militaire unifié.', ['Vrai', 'Faux'], 1, 'Elle est une puissance économique et normative, pas militaire.'],
          ],
        },
        // ======= Chapitre 10 — La construction européenne ==================
        {
          titre: 'La création d’une Europe ouverte et d’un marché commun (1957-1993)',
          lecon: {
            titre: 'Du traité de Rome au marché unique',
            cours: `L'Europe communautaire naît d'un projet de paix et se construit par l'économie : lier assez les intérêts pour rendre la guerre impossible.

## Les fondations
Après la CECA (1951), le **traité de Rome (25 mars 1957)** crée la **CEE** entre six États — France, RFA, Italie, Belgique, Pays-Bas, Luxembourg. Objectifs : union douanière, libre circulation des marchandises, des personnes, des services et des capitaux, et politiques communes. La **PAC**, mise en place à partir de 1962, assure l'autosuffisance alimentaire et modernise l'agriculture — elle absorbera longtemps la majeure partie du budget.

## Les élargissements
Royaume-Uni, Irlande et Danemark en **1973** ; Grèce en 1981 ; Espagne et Portugal en 1986, au sortir de leurs dictatures. L'adhésion devient un instrument d'ancrage démocratique.

## L'approfondissement
L'**Acte unique européen (1986)** fixe l'achèvement du **marché unique au 1er janvier 1993** : suppression des barrières non tarifaires et des contrôles. Les accords de **Schengen (1985)**, entrés en application en 1995, suppriment les contrôles aux frontières intérieures.

## Maastricht
Le **traité de Maastricht (signé en 1992, en vigueur en 1993)** crée l'**Union européenne**, la **citoyenneté européenne** et prépare la monnaie unique, avec des critères de convergence stricts. En France, il est ratifié par référendum à une courte majorité (51,04 %) — premier signe visible que l'opinion ne suit plus automatiquement.`,
          },
          questions: [
            ['Le traité de Rome (1957) crée…', ['La Communauté économique européenne', 'L’Union européenne', 'La zone euro', 'L’espace Schengen'], 0, 'Entre six États fondateurs.'],
            ['Combien d’États fondent la CEE ?', ['Six', 'Neuf', 'Douze', 'Quatre'], 0, 'France, RFA, Italie, Belgique, Pays-Bas, Luxembourg.'],
            ['La PAC vise d’abord l’autosuffisance alimentaire de l’Europe.', ['Vrai', 'Faux'], 0, 'Mise en place à partir de 1962, elle modernise aussi l’agriculture.'],
            ['Le Royaume-Uni rejoint la CEE en…', ['1973', '1957', '1986', '1995'], 0, 'Avec l’Irlande et le Danemark.'],
            ['L’Acte unique européen fixe l’achèvement du marché unique au…', ['1er janvier 1993', '1er janvier 1986', '1er janvier 1999', '1er janvier 2002'], 0, 'Libre circulation effective des marchandises, services, capitaux et personnes.'],
            ['Le traité de Maastricht crée l’Union européenne et la citoyenneté européenne.', ['Vrai', 'Faux'], 0, 'Signé en 1992, en vigueur en 1993.'],
            ['Les accords de Schengen portent sur…', ['La suppression des contrôles aux frontières intérieures', 'La monnaie unique', 'La politique agricole', 'La défense commune'], 0, 'Signés en 1985, appliqués à partir de 1995.'],
            ['Le référendum français sur Maastricht a été largement approuvé.', ['Vrai', 'Faux'], 1, 'Le « oui » ne l’emporte qu’avec 51,04 % des voix.'],
          ],
        },
        {
          titre: 'Le projet européen remis en question : les crises de la coopération européenne',
          lecon: {
            titre: 'Vingt ans de contestation',
            cours: `Depuis les années 2000, l'Union avance de crise en crise. Chacune pose la même question : jusqu'où les États acceptent-ils de décider ensemble ?

## Le choc de 2005
Le **traité constitutionnel européen** est rejeté par référendum en **France (29 mai 2005, 54,7 % de non)** puis aux Pays-Bas. Le traité de **Lisbonne (2007, en vigueur en 2009)** en reprend l'essentiel par la voie parlementaire — ce qui nourrit durablement le reproche d'un projet mené sans les peuples.

## La crise de la zone euro
À partir de 2010, la Grèce, puis l'Irlande, le Portugal, l'Espagne et Chypre sont frappés par la crise des dettes souveraines. Plans d'aide, austérité, création du Mécanisme européen de stabilité et intervention de la **BCE** — « whatever it takes » de Mario Draghi en 2012 — sauvent la monnaie unique, au prix d'un coût social très lourd dans les pays aidés.

## La crise migratoire
En **2015**, plus d'un million de personnes demandent l'asile dans l'Union, fuyant surtout la guerre en Syrie. Le système de Dublin, qui fait peser la demande sur le pays d'entrée, se révèle inapplicable ; la répartition par quotas est refusée par plusieurs États. Les frontières intérieures sont temporairement rétablies.

## Le Brexit et après
Le **référendum du 23 juin 2016** (51,9 % pour la sortie) conduit au retrait effectif du Royaume-Uni le **31 janvier 2020** : c'est le premier départ de l'histoire de la construction européenne. S'y ajoutent les conflits sur l'État de droit avec la Hongrie et la Pologne. À l'inverse, la pandémie de Covid-19 débouche en 2020 sur un **plan de relance financé par un emprunt commun** — une première.`,
          },
          questions: [
            ['En 2005, les Français rejettent par référendum…', ['Le traité constitutionnel européen', 'Le traité de Maastricht', 'Le traité de Lisbonne', 'L’adhésion de la Turquie'], 0, '54,7 % de « non » le 29 mai 2005.'],
            ['Le traité de Lisbonne a été adopté par référendum en France.', ['Vrai', 'Faux'], 1, 'Il est ratifié par voie parlementaire, ce qui alimente la critique démocratique.'],
            ['La crise des dettes souveraines frappe d’abord…', ['La Grèce', 'L’Allemagne', 'La Pologne', 'La Suède'], 0, 'Puis l’Irlande, le Portugal, l’Espagne et Chypre.'],
            ['Qui déclare en 2012 que la BCE fera « tout ce qu’il faudra » pour sauver l’euro ?', ['Mario Draghi', 'Jean-Claude Trichet', 'Christine Lagarde', 'Angela Merkel'], 0, 'La formule stoppe la spéculation contre la monnaie unique.'],
            ['Le système de Dublin fait peser la demande d’asile sur le pays d’entrée.', ['Vrai', 'Faux'], 0, 'D’où sa saturation en 2015 pour la Grèce et l’Italie.'],
            ['Le référendum sur le Brexit a lieu en…', ['juin 2016', 'janvier 2020', 'mai 2005', 'juin 2014'], 0, 'La sortie effective intervient le 31 janvier 2020.'],
            ['Le Royaume-Uni est le premier État à quitter l’Union européenne.', ['Vrai', 'Faux'], 0, 'Aucun départ n’avait eu lieu depuis 1957.'],
            ['Face à la pandémie de Covid-19, l’Union a adopté en 2020…', ['Un plan de relance financé par un emprunt commun', 'Une baisse générale des impôts', 'La suspension de l’euro', 'La fermeture définitive de Schengen'], 0, 'Une première dans l’histoire de la construction européenne.'],
          ],
        },
        // ======= Chapitre 11 — La République française ======================
        {
          titre: 'Le renforcement de la Ve République : décentralisation territoriale et fonctionnelle',
          lecon: {
            titre: 'L’État se réorganise',
            cours: `La Ve République, née en 1958 d'un État très centralisé, a passé quarante ans à redistribuer son pouvoir — vers les territoires, et vers des autorités indépendantes.

## L'acte I de la décentralisation
Les **lois Defferre (1982-1983)** suppriment la tutelle du préfet sur les collectivités, font du président du conseil général l'exécutif du département, créent la **région comme collectivité territoriale** de plein exercice (première élection au suffrage universel en 1986) et transfèrent des compétences : collèges aux départements, lycées aux régions, urbanisme aux communes.

## L'acte II
La révision constitutionnelle du **28 mars 2003** inscrit à l'article 1er que l'organisation de la République « est décentralisée », et introduit l'autonomie financière des collectivités, le **référendum local** et le droit à l'expérimentation. De nouveaux transferts suivent (RMI puis RSA aux départements, routes nationales).

## La carte redessinée
La loi de 2015 réduit le nombre de régions métropolitaines de 22 à **13** (effectif au 1er janvier 2016). Les intercommunalités et métropoles montent en puissance, tandis que la commune, échelon le plus ancien, reste très nombreuse — plus de 34 000.

## La décentralisation fonctionnelle
L'État délègue aussi à des **autorités administratives indépendantes** : Défenseur des droits (2011), Autorité de la concurrence, CNIL, ARCOM. Enfin, le passage au **quinquennat (référendum de 2000)** et l'inversion du calendrier électoral renforcent le président, contrepoint centralisateur de tout ce mouvement.`,
          },
          questions: [
            ['Les lois Defferre de 1982-1983 créent…', ['La région comme collectivité territoriale', 'Les intercommunalités obligatoires', 'Le quinquennat', 'Le Défenseur des droits'], 0, 'Première élection régionale au suffrage universel en 1986.'],
            ['Avant 1982, le préfet exerçait une tutelle sur les collectivités locales.', ['Vrai', 'Faux'], 0, 'La décentralisation supprime cette tutelle a priori.'],
            ['La révision constitutionnelle de 2003 inscrit que la République est…', ['Décentralisée', 'Fédérale', 'Confédérale', 'Régionalisée'], 0, 'À l’article 1er de la Constitution.'],
            ['Combien de régions métropolitaines depuis la réforme de 2015 ?', ['13', '22', '18', '26'], 0, 'Contre 22 auparavant ; effectif au 1er janvier 2016.'],
            ['Les lycées relèvent des régions et les collèges des départements.', ['Vrai', 'Faux'], 0, 'Répartition issue des transferts de compétences des années 1980.'],
            ['Le quinquennat est adopté par référendum en…', ['2000', '1982', '2003', '2008'], 0, 'Il renforce la place du président dans les institutions.'],
            ['Le Défenseur des droits est une autorité administrative indépendante.', ['Vrai', 'Faux'], 0, 'Créé en 2011, il illustre la décentralisation fonctionnelle.'],
            ['La France compte aujourd’hui moins de 5 000 communes.', ['Vrai', 'Faux'], 1, 'Elle en compte plus de 34 000 — un record européen.'],
          ],
        },
        {
          titre: 'L’évolution de la Ve République : défense des principes fondateurs et émergence de nouveaux droits',
          lecon: {
            titre: 'Des principes anciens, des droits neufs',
            cours: `« La France est une République indivisible, laïque, démocratique et sociale » : l'article 1er n'a pas changé, mais ce qu'il garantit s'est considérablement élargi.

## La laïcité
Héritée de la **loi de 1905** de séparation des Églises et de l'État, elle garantit la liberté de conscience et la neutralité de l'État. Elle est reprécisée par la **loi du 15 mars 2004** interdisant les signes religieux ostensibles à l'école publique, puis par la loi de 2010 sur la dissimulation du visage dans l'espace public et celle de 2021 confortant le respect des principes de la République.

## L'égalité en actes
Révision constitutionnelle de **1999** et loi de **2000** sur la **parité** en politique ; **PACS en 1999** ; **mariage pour tous en 2013** ; lois sur l'égalité professionnelle et contre les discriminations. En **mars 2024**, la liberté de recourir à l'IVG est inscrite dans la Constitution — une première mondiale.

## Le citoyen face à la loi
La révision de **2008** crée la **question prioritaire de constitutionnalité** : depuis 2010, tout justiciable peut faire contrôler la constitutionnalité d'une loi déjà en vigueur. Le Conseil constitutionnel, simple régulateur des pouvoirs en 1958, est devenu un véritable protecteur des droits — mouvement engagé par sa décision de **1971** intégrant le préambule de 1946 et la Déclaration de 1789 au « bloc de constitutionnalité ».

## Les tensions
Sécurité et libertés (états d'urgence de 2015 et de 2020), participation et défiance (abstention élevée, mouvement des Gilets jaunes en 2018), place des outre-mer et de la diversité : la République se redéfinit sans cesse dans ces tensions, ce qui est aussi le signe qu'elle reste vivante.`,
          },
          questions: [
            ['La loi de séparation des Églises et de l’État date de…', ['1905', '2004', '1958', '1946'], 0, 'Elle fonde la laïcité française.'],
            ['La loi du 15 mars 2004 interdit les signes religieux ostensibles…', ['Dans les écoles publiques', 'Dans la rue', 'Dans les entreprises privées', 'Dans les lieux de culte'], 0, 'Elle précise l’application de la laïcité scolaire.'],
            ['Le PACS est instauré en 1999.', ['Vrai', 'Faux'], 0, 'Le mariage pour tous suivra en 2013.'],
            ['La parité en politique est inscrite dans la Constitution en…', ['1999', '2008', '2013', '2000'], 0, 'La loi d’application suit en 2000.'],
            ['La question prioritaire de constitutionnalité permet…', ['À tout justiciable de contester une loi déjà en vigueur', 'Au président de dissoudre l’Assemblée', 'De réviser la Constitution par référendum', 'De saisir la Cour européenne'], 0, 'Créée en 2008, applicable depuis 2010.'],
            ['En 2024, la liberté de recourir à l’IVG est inscrite dans la Constitution française.', ['Vrai', 'Faux'], 0, 'Une première mondiale, adoptée en mars 2024.'],
            ['La décision du Conseil constitutionnel de 1971 est importante parce qu’elle…', ['Intègre les déclarations de droits au bloc de constitutionnalité', 'Crée le quinquennat', 'Supprime le Sénat', 'Instaure le référendum local'], 0, 'Le Conseil devient protecteur des libertés.'],
            ['L’article 1er définit la République comme indivisible, laïque, démocratique et sociale.', ['Vrai', 'Faux'], 0, 'Il ajoute depuis 2003 qu’elle est décentralisée.'],
          ],
        },
      ],
    },
  ],
}
