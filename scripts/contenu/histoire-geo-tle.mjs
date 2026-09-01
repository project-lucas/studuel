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
            cours: `En moins de trois ans, l’Europe issue de Yalta disparaît. Le continent qui en sort n’est pas seulement réunifié : il est **à reconstruire**.

## L’effondrement, 1989-1991
**Gorbatchev**, au pouvoir depuis 1985, lance deux réformes et renonce à un principe — et c’est ce renoncement qui fait tout tomber.

| Réforme | Ce qu’elle vise |
| *Perestroïka* | La restructuration économique |
| *Glasnost* | La transparence, la fin de la censure |
| Abandon de la doctrine Brejnev | Moscou n’interviendra plus pour sauver les régimes frères |

| Date | L’événement |
| 9 novembre 1989 | Ouverture du **mur de Berlin** |
| 3 octobre 1990 | Réunification de l’**Allemagne** |
| 25 décembre 1991 | Dissolution de l’**URSS** |

> Privés du filet soviétique, les régimes d’Europe centrale tombent en quelques mois — Pologne, Hongrie, RDA, Tchécoslovaquie, Roumanie. Ce n’est pas une révolution simultanée : c’est un effet domino déclenché par une décision prise à Moscou.

## Une transition brutale
Les anciennes démocraties populaires passent à l’économie de marché par la « **thérapie de choc** ».

| La mesure | Sa conséquence immédiate |
| Privatisations massives | Concentration des actifs, corruption |
| Fin des prix administrés | Inflation, chute du pouvoir d’achat |
| Ouverture à la concurrence | Effondrement de la production |
| Fin de l’emploi garanti | Chômage de masse, inconnu jusque-là |

La Russie d’Eltsine connaît une décennie de crise, jusqu’au redressement autoritaire engagé par **Poutine** à partir de 2000.

## L’Europe recomposée
| Date | L’élargissement |
| 1999 | Pologne, Hongrie, République tchèque entrent dans l’**OTAN** |
| 2004 | Les pays baltes rejoignent l’OTAN |
| 2004 | Dix pays rejoignent l’**Union européenne** |

L’Allemagne réunifiée devient la première puissance économique du continent.

## Le retour de la guerre
La disparition du carcan communiste libère aussi les **nationalismes**.

| Date | L’événement |
| 1991 | Éclatement de la **Yougoslavie** : guerres de Croatie puis de Bosnie |
| Juillet 1995 | Massacre de **Srebrenica** |
| 1999 | Intervention de l’OTAN au **Kosovo** |

> L’Europe découvre qu’elle ne sait pas régler seule un conflit sur son propre sol : c’est l’OTAN, donc les États-Unis, qui tranchent.`,
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
            cours: `Le Proche et le Moyen-Orient concentrent depuis 1945 trois enjeux qui s’entretiennent : les **hydrocarbures**, le **conflit israélo-palestinien**, et la **rivalité des puissances**.

## Le poids du pétrole
La région détient près de la **moitié** des réserves mondiales de pétrole.

| Élément | Ce qu’il pèse |
| Les chocs de **1973** et **1979** | Un événement régional dérègle l’économie mondiale |
| Le détroit d’**Ormuz** | Un cinquième du pétrole mondial y transite |
| Le canal de **Suez** | La route Europe-Asie la plus courte |

## Le conflit israélo-palestinien
| Date | L’événement | Ce qu’il change |
| 1948 | Première guerre israélo-arabe | Naissance d’Israël, exode palestinien |
| 1967 | Guerre des **Six Jours** | Occupation de la Cisjordanie, de Gaza et du Golan |
| 1973 | Guerre du Kippour | Le choc pétrolier suit |
| 1987 | Première **Intifada** | Le rapport de force change |
| 1993 | Accords d’**Oslo** | Autorité palestinienne, solution à deux États esquissée |
| 1995 | Assassinat de **Rabin** | Le processus s’enraye |
| 2000 | Seconde Intifada | Il s’effondre |

> Aucun règlement n’est intervenu depuis Oslo : la colonisation s’est poursuivie, et la solution à deux États s’est éloignée à mesure que le territoire disponible se réduisait.

## Les guerres du Golfe
| | Guerre du Golfe (1991) | Invasion de l’Irak (2003) |
| Le motif | Invasion du Koweït par Saddam Hussein | Des armes de destruction massive |
| Le mandat de l’ONU | **Oui** | **Non** |
| La France | Participe | S’y oppose : discours de Villepin à l’ONU |
| Les armes invoquées | Sans objet | **Jamais retrouvées** |

## Fractures et recompositions
| Ligne de fracture | Ce qu’elle oppose |
| Arabie saoudite / Iran | Sunnisme et chiisme, deux puissances régionales |
| 1979 | La révolution iranienne installe une république islamique |
| 2011 | Les **printemps arabes**, aux issues divergentes |
| 2014 | La guerre civile syrienne et l’émergence de **Daech** |

La région reste le premier foyer de conflits armés du monde.`,
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
            cours: `En une génération, la Chine passe d’une économie collectivisée et fermée au rang d’atelier du monde — **sans changer de régime politique**. C’est cette dissociation qui fait tout l’intérêt du chapitre.

## Le tournant de 1978
Deux ans après la mort de Mao, **Deng Xiaoping** engage les **Quatre Modernisations** : agriculture, industrie, défense, science et technique. Le mot d’ordre est pragmatique — « peu importe qu’un chat soit noir ou blanc, pourvu qu’il attrape les souris ».

| La réforme | Son effet |
| Démantèlement des communes populaires | La terre revient aux familles par contrat |
| Liberté de vendre les surplus | La production agricole bondit |
| Autonomie des entreprises | Le plan cesse de tout décider |

## L’ouverture maîtrisée
Quatre **zones économiques spéciales** sont créées en 1980, dont **Shenzhen**, alors village de pêcheurs face à Hong Kong.

| L’avantage offert | À qui il profite |
| Avantages fiscaux | Aux capitaux étrangers |
| Main-d’œuvre bon marché | Aux industries d’exportation |
| Cadre juridique dérogatoire | À l’expérimentation, sans toucher au reste du pays |

> Le littoral devient le moteur de la croissance — et creuse avec l’intérieur rural un écart qui n’a jamais été comblé depuis.

## Réforme économique, pas politique
Le printemps de Pékin s’achève par la répression de la place **Tian’anmen** en juin 1989 : le Parti montre que l’ouverture économique **ne s’étendra pas au politique**. La croissance reprend après la « tournée dans le Sud » de Deng en 1992, sous le nom d’« économie socialiste de marché ».

## L’entrée dans la mondialisation
| Date | L’événement |
| 1997 | Rétrocession de **Hong Kong** |
| 1999 | Rétrocession de Macao |
| Décembre 2001 | Adhésion à l’**OMC** |

L’adhésion à l’OMC fait exploser les exportations : la Chine devient l’usine du monde, puis, dans la décennie suivante, la **deuxième économie mondiale**. La croissance a longtemps dépassé 9 % par an.`,
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

## L’année en quatre temps
| Mois | L’événement | Où |
| Avril-juin | Occupation puis répression de **Tian’anmen** | Chine |
| Juin | Élections semi-libres | Pologne |
| Été | La Hongrie ouvre le rideau de fer | Hongrie |
| 9 novembre | **Chute du mur de Berlin** | RDA |
| Novembre-décembre | « Révolution de velours » | Tchécoslovaquie |
| Décembre | Exécution de Ceaușescu | Roumanie |

## Le printemps de Pékin
Des étudiants occupent la place Tian’anmen et réclament des réformes politiques. Le mouvement est écrasé dans la nuit du **3 au 4 juin 1989**.

> La Chine choisit exactement la voie **inverse** de celle qui s’ouvre en Europe : réformer l’économie, verrouiller le politique. Trente ans plus tard, c’est ce choix qui a survécu.

## L’automne des peuples
Les régimes communistes d’Europe centrale s’effondrent presque tous **sans violence**, en quelques semaines. Seule la Roumanie connaît un dénouement sanglant.

## Un basculement économique
Le **consensus de Washington** (1989) formule le programme des institutions financières internationales :

| Le mot d’ordre | Ce qu’il impose |
| Libéralisation | Ouverture des marchés |
| Privatisations | Retrait de l’État de la production |
| Discipline budgétaire | Réduction des déficits |
| Ouverture aux capitaux | Libre circulation financière |

Il servira de cadre aux transitions post-communistes comme aux plans d’ajustement du Sud.

## « La fin de l’histoire » ?
**Francis Fukuyama** annonce en 1989 le triomphe définitif de la démocratie libérale et de l’économie de marché. Les décennies suivantes démentiront la prophétie — guerres yougoslaves, terrorisme international, régimes autoritaires assumés, retour de la guerre en Europe — mais la formule dit bien l’**euphorie du moment**, et c’est à ce titre qu’elle est un document.`,
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
            cours: `En 1974, la France entre dans une crise dont elle ne sortira pas : le chômage de masse s’installe, et avec lui une recomposition complète de la vie politique.

## Le choc et la fin d’un cycle
| Indicateur | Avant 1974 | Après |
| Croissance | Près de 5 % par an | Autour de 2 % |
| Inflation | Modérée | Plus de **13 %** par an |
| Chômage | 400 000 personnes (1974) | Plus de **2,5 millions** (1988) |

Le **premier choc pétrolier** (1973) quadruple le prix du baril, le **second** (1979) achève le mouvement. L’industrie lourde — sidérurgie lorraine, charbon, textile, chantiers navals — entre en déclin irréversible.

## Giscard : la modernisation dans la crise
Élu en 1974, **Valéry Giscard d’Estaing** engage des réformes de société et confie l’économie à **Raymond Barre** à partir de 1976 : lutte contre l’inflation, rigueur, libéralisme. Sans résultat sur l’emploi.

## 1981 : l’alternance
**François Mitterrand** est élu le 10 mai 1981 — première alternance de la Ve République.

| La mesure | Ce qu’elle change |
| Nationalisations | Banques et grands groupes industriels |
| Retraite à **60 ans** | Un droit nouveau |
| Cinquième semaine de congés payés | Le temps libre s’étend |
| Semaine de **39 heures** | Réduction du temps de travail |
| Hausse du SMIC | Relance par la consommation |

> La relance dans un contexte de **récession mondiale** produit l’effet inverse de celui recherché : la consommation supplémentaire part vers les importations, le déficit extérieur se creuse, et le franc est dévalué trois fois.

## Le tournant de la rigueur
En **mars 1983**, le gouvernement choisit de rester dans le Système monétaire européen et adopte un plan de rigueur : blocage des salaires, réduction des déficits. C’est une **rupture idéologique durable** pour la gauche française.

Les élections de 1986 sont perdues, ouvrant la **première cohabitation** — Mitterrand président, Chirac Premier ministre — qui procède aux premières privatisations.`,
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
            cours: `Pendant que l’économie se dégrade, la société française connaît une transformation profonde de ses droits, de ses mœurs et de sa culture. Les deux mouvements sont simultanés — c’est ce qui rend la période difficile à résumer d’une formule.

## Les grandes lois de société
| Année | La loi | Ce qu’elle change |
| 1974 | Majorité à **18 ans** | Un million d’électeurs de plus |
| 1975 | Divorce par consentement mutuel | Le mariage devient dissoluble sans faute |
| 1975 | **Loi Veil** | Dépénalisation de l’IVG, remboursée à partir de 1982 |
| 1981 | Abolition de la **peine de mort** | Sous l’impulsion de Robert Badinter |

## Les femmes
| Évolution | Ce qu’elle produit |
| L’activité professionnelle progresse | Le modèle de la femme au foyer recule |
| La contraception se diffuse | Loi Neuwirth (1967), remboursement en 1974 |
| Ministère des Droits de la femme (1981) | Yvette Roudy ; loi de 1983 sur l’égalité professionnelle |
| Ce qui résiste | Les écarts de salaire et le partage des tâches domestiques |

## Immigration et société
| Date | L’événement | Sa portée |
| 1974 | Suspension de l’immigration de travail | Fin d’un cycle ouvert en 1945 |
| 1976 | **Regroupement familial** | D’une immigration d’hommes seuls à une immigration de familles installées |
| 1983-1984 | Le Front national entre dans les urnes | L’immigration devient un enjeu politique central |
| 1983 | **Marche pour l’égalité et contre le racisme** | Une génération née en France entre dans le débat public |

## Une culture de masse
| Date | L’événement |
| 1981 | Libéralisation des **radios libres** |
| 1982 | Première **Fête de la musique** |
| 1984 | Création de **Canal+**, puis des chaînes privées |

L’État culturel s’affirme sous **Jack Lang** : doublement du budget de la Culture, grands travaux, reconnaissance des pratiques juvéniles jusque-là ignorées.`,
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
            cours: `Après 1991, les États-Unis sont la **seule** superpuissance — militaire, économique, technologique et culturelle. Hubert Védrine forge en 1998 le mot d’**hyperpuissance** pour dire cette situation inédite.

## Les fondements de la domination
| Domaine | L’atout |
| Militaire | Premier budget du monde, bases sur tous les continents |
| Monétaire | Le dollar, monnaie des échanges internationaux |
| Scientifique | Universités et firmes dominantes |
| Culturel | Un *soft power* — cinéma, musique, numérique — sans équivalent |

## Le gendarme des années 1990
| Année | L’intervention | Mandat de l’ONU |
| 1991 | Guerre du Golfe | **Oui** |
| 1992 | Somalie | Oui |
| 1995 | Bosnie, accords de Dayton | Oui |
| 1999 | Kosovo | **Non** |

> La contre-épreuve est le **génocide des Tutsi au Rwanda** (1994), où rien n’est fait. Les États-Unis se posent en garants de l’ordre international tout en **choisissant** leurs engagements : c’est la limite de la notion de gendarme.

## Le 11 septembre 2001 et ses suites
Les attentats d’al-Qaïda font près de **3 000 morts**. Washington lance la « guerre contre le terrorisme ».

| Année | L’intervention | Le motif | Ce qu’il en reste |
| 2001 | Afghanistan | Abriter al-Qaïda | Retrait en 2021, retour des talibans |
| 2003 | **Irak** | Des armes de destruction massive | Jamais retrouvées ; pas de mandat de l’ONU |

L’enlisement, **Guantánamo** et **Abou Ghraib** abîment durablement l’image du pays — y compris auprès de ses alliés.

## Les limites
| La limite | Ce qu’elle montre |
| Le coût humain et financier des guerres | La puissance militaire ne suffit pas à gagner la paix |
| Les retraits d’Irak (2011) et d’Afghanistan (2021) | L’engagement a une fin, et l’adversaire le sait |
| La montée de la Chine | Le monopole économique est terminé |
| La tentation du repli (« America First ») | La volonté de puissance elle-même est discutée à l’intérieur |

La puissance reste immense, mais elle ne suffit plus à imposer un ordre : c’est le sens du passage d’un monde **unipolaire** à un monde **multipolaire**.`,
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
            cours: `Les problèmes sont devenus mondiaux — climat, pandémies, finance, migrations — alors que le pouvoir reste **national**. Tout le chapitre tient dans cet écart : d’où la multiplication des institutions, et la fragilité de chacune.

## Les organisations
| Institution | Créée | Ce qu’elle fait |
| **ONU** | 1945 | Maintien de la paix (casques bleus), agences spécialisées : OMS, UNESCO, PNUD |
| **OMC** | 1995 | Arbitre le commerce mondial |
| **G7** | 1975 | Réunit les grandes économies occidentales |
| **G20** | Sommet de 2008 | L’élargissement acte le poids nouveau des émergents |

## Le climat
| Date | L’étape | Sa portée |
| 1988 | Création du **GIEC** | Une base scientifique commune |
| 1992 | Sommet de **Rio** | Le climat entre à l’agenda mondial |
| 1997 | Protocole de **Kyoto** | Contraignant — mais les États-Unis ne ratifient pas |
| 2015 | Accord de **Paris**, COP21 | 195 États, bien en dessous de 2 °C |

> L’accord de Paris est **universel mais non contraignant** : chaque État fixe lui-même son engagement, et la somme des engagements reste en deçà de l’objectif. C’est le résumé exact de toute la coopération internationale contemporaine.

## La justice et les droits
| Institution ou texte | Date | Sa limite |
| **Cour pénale internationale** | En fonction en 2002 | États-Unis, Chine et Russie n’en reconnaissent pas la compétence |
| **Objectifs de développement durable** | 2015 | 17 cibles à l’horizon 2030, sans sanction |

## Les limites structurelles
| L’obstacle | Ce qu’il empêche |
| Le **droit de veto** des cinq permanents | Toute décision contraire à leurs intérêts |
| La **souveraineté** des États | Aucune institution ne peut les contraindre |
| Le financement volontaire | Une agence peut être asphyxiée par un retrait |

La coopération produit des **normes**, rarement des **sanctions**. C’est sa force — elle rend possible l’accord — et sa faiblesse.`,
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
            cours: `Le monde issu de 1991 n’a pas duré. Depuis 2001, la puissance se **redistribue**, et la guerre **change de forme**.

## De l’unipolaire au multipolaire
| Acteur | Ce qui a changé |
| **Chine** | Deuxième économie mondiale, puissance militaire assumée |
| **Russie** | Réaffirmation militaire, contestation de l’ordre occidental |
| Inde, Brésil, Turquie, Afrique du Sud | Des puissances régionales qui pèsent |
| **BRICS** (formalisés en 2009) | Contestent l’ordre issu de 1945 |
| **Union européenne** | Puissance économique et normative, sans commandement militaire unifié |

## Le terrorisme transnational
Al-Qaïda puis **Daech** — proclamation du « califat » en 2014 — mènent une guerre **sans territoire fixe et sans armée régulière**.

| Date | L’attentat en France |
| Janvier 2015 | *Charlie Hebdo* |
| 13 novembre 2015 | Paris et le **Bataclan** |
| Juillet 2016 | Nice |

La riposte mêle interventions extérieures (Sahel, Levant) et sécurité intérieure — au prix d’un débat récurrent entre **sécurité et libertés**.

## Les guerres asymétriques et hybrides
| Type de moyen | Exemples |
| Militaire irrégulier | Guérilla, attentats, prise d’otages |
| Informationnel | Propagande en ligne, désinformation |
| Cyber | Attaques sur les réseaux, les hôpitaux, les administrations |
| Économique | Pressions énergétiques, sanctions |
| Privatisé | Mercenaires, sociétés militaires privées |

> Le champ de bataille inclut désormais l’**information** et les **réseaux** : un conflit peut être mené sans qu’un seul soldat franchisse une frontière.

## Le retour de la guerre interétatique
| Date | L’événement |
| 2014 | Annexion de la **Crimée** par la Russie |
| Février 2022 | **Invasion de l’Ukraine** |

Un conflit classique de haute intensité revient en Europe : front, artillerie, occupation. La guerre n’avait pas disparu — elle avait changé de **lieu**.`,
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
            cours: `L’Europe communautaire naît d’un projet de **paix** et se construit par l’**économie** : lier assez les intérêts pour rendre la guerre impossible.

## Les fondations
| Date | Le traité | Ce qu’il crée |
| 1951 | **CECA** | Charbon et acier mis en commun — les matières de la guerre |
| 25 mars 1957 | **Traité de Rome** | La **CEE** entre six États |

Les six : France, RFA, Italie, Belgique, Pays-Bas, Luxembourg. Objectifs : union douanière, libre circulation des marchandises, des personnes, des services et des capitaux, et politiques communes.

La **PAC**, mise en place à partir de 1962, assure l’autosuffisance alimentaire et modernise l’agriculture — elle absorbera longtemps la majeure partie du budget communautaire.

## Les élargissements
| Année | Les entrants | Ce que l’adhésion signifie |
| 1973 | Royaume-Uni, Irlande, Danemark | L’ouverture au nord |
| 1981 | Grèce | Sortie de la dictature des colonels |
| 1986 | Espagne, Portugal | Sortie du franquisme et du salazarisme |

> L’adhésion devient un **instrument d’ancrage démocratique** : entrer dans la Communauté, c’est rendre coûteux le retour à la dictature.

## L’approfondissement
| Date | Le texte | Son effet |
| 1985 | Accords de **Schengen** | Suppression des contrôles aux frontières intérieures (application en 1995) |
| 1986 | **Acte unique européen** | Fixe l’achèvement du marché unique |
| 1er janvier 1993 | **Marché unique** | Fin des barrières non tarifaires et des contrôles |

## Maastricht
Le **traité de Maastricht** — signé en 1992, en vigueur en 1993 — crée l’**Union européenne**, la **citoyenneté européenne**, et prépare la monnaie unique avec des critères de convergence stricts.

En France, il est ratifié par référendum à une **très courte majorité (51,04 %)** : premier signe visible que l’opinion ne suit plus automatiquement le projet européen.`,
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
            cours: `Depuis les années 2000, l’Union avance de crise en crise. Chacune pose la même question : **jusqu’où les États acceptent-ils de décider ensemble ?**

## Le choc de 2005
| Date | L’événement |
| 29 mai 2005 | La France rejette le **traité constitutionnel** (54,7 % de non) |
| Juin 2005 | Les Pays-Bas le rejettent à leur tour |
| 2007 | Le traité de **Lisbonne** en reprend l’essentiel, par voie **parlementaire** |

> C’est ce contournement du référendum qui nourrit durablement le reproche d’un projet **mené sans les peuples** — quels que soient les mérites juridiques du traité de Lisbonne.

## La crise de la zone euro
À partir de 2010, la Grèce, puis l’Irlande, le Portugal, l’Espagne et Chypre sont frappés par la crise des dettes souveraines.

| La réponse | Ce qu’elle a produit |
| Plans d’aide conditionnés | Austérité imposée aux pays aidés |
| **Mécanisme européen de stabilité** | Un pare-feu permanent |
| La **BCE** : « whatever it takes » (Draghi, 2012) | La spéculation contre l’euro cesse |

La monnaie unique est sauvée — au prix d’un coût social très lourd, notamment en Grèce.

## La crise migratoire
En **2015**, plus d’**un million** de personnes demandent l’asile dans l’Union, fuyant surtout la guerre en Syrie.

| Le dispositif | Pourquoi il échoue |
| Le système de **Dublin** | Il fait peser la demande sur le seul pays d’entrée |
| La répartition par **quotas** | Plusieurs États la refusent |
| Schengen | Des frontières intérieures sont temporairement rétablies |

## Le Brexit et après
| Date | L’événement |
| 23 juin 2016 | Référendum britannique : **51,9 %** pour la sortie |
| 31 janvier 2020 | Retrait effectif du Royaume-Uni |

C’est le **premier départ** de l’histoire de la construction européenne. S’y ajoutent les conflits sur l’**État de droit** avec la Hongrie et la Pologne.

À l’inverse, la pandémie de Covid-19 débouche en 2020 sur un **plan de relance financé par un emprunt commun** — une première, et un pas fédéral qu’aucune crise n’avait obtenu auparavant.`,
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
            cours: `La Ve République, née en 1958 d’un État très centralisé, a passé quarante ans à **redistribuer son pouvoir** — vers les territoires, et vers des autorités indépendantes.

## L’acte I de la décentralisation
Les **lois Defferre (1982-1983)** rompent avec deux siècles de tutelle.

| La mesure | Ce qu’elle change |
| Fin de la tutelle du préfet | Les actes des collectivités s’appliquent sans son accord préalable |
| Le président du conseil général devient l’exécutif | Le préfet ne dirige plus le département |
| La **région** devient une collectivité de plein exercice | Première élection au suffrage universel en 1986 |

| Compétence transférée | À qui |
| Les collèges | Aux départements |
| Les lycées | Aux régions |
| L’urbanisme | Aux communes |

## L’acte II
La révision constitutionnelle du **28 mars 2003** inscrit à l’article 1er que l’organisation de la République « est **décentralisée** ».

| L’apport | Ce qu’il permet |
| Autonomie financière | Une part garantie de ressources propres |
| **Référendum local** | Consulter les habitants sur un projet |
| Droit à l’expérimentation | Tester une politique sur un territoire |

De nouveaux transferts suivent : RMI puis RSA aux départements, routes nationales.

## La carte redessinée
| Échelon | Évolution |
| Régions métropolitaines | De 22 à **13** (loi de 2015, effective au 1er janvier 2016) |
| Intercommunalités et métropoles | Montée en puissance continue |
| Communes | Plus de **34 000** : l’échelon le plus ancien reste le plus nombreux |

## La décentralisation fonctionnelle
L’État délègue aussi à des **autorités administratives indépendantes** : Défenseur des droits (2011), Autorité de la concurrence, CNIL, ARCOM.

> Un contrepoint centralisateur traverse pourtant tout ce mouvement : le passage au **quinquennat** (référendum de 2000) et l’inversion du calendrier électoral renforcent le président. L’État se décentralise et se présidentialise en même temps.`,
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
            cours: `« La France est une République indivisible, laïque, démocratique et sociale » : l’article 1er n’a pas changé — mais ce qu’il **garantit** s’est considérablement élargi.

## La laïcité
| Date | Le texte | Ce qu’il pose |
| 1905 | Séparation des Églises et de l’État | Liberté de conscience, neutralité de l’État |
| 15 mars 2004 | Loi sur les signes religieux | Interdiction des signes ostensibles à l’école publique |
| 2010 | Dissimulation du visage | Interdiction dans l’espace public |
| 2021 | Respect des principes de la République | Contrôle renforcé des associations et de l’instruction |

## L’égalité en actes
| Date | L’avancée |
| 1999 | Révision constitutionnelle et loi de 2000 sur la **parité** en politique |
| 1999 | Le **PACS** |
| 2013 | Le **mariage pour tous** |
| Mars 2024 | La liberté de recourir à l’**IVG** inscrite dans la Constitution — une première mondiale |

## Le citoyen face à la loi
| Date | L’étape | Ce qu’elle change |
| 1971 | Décision du Conseil constitutionnel | Le préambule de 1946 et la Déclaration de 1789 entrent dans le **bloc de constitutionnalité** |
| 2008 | Révision constitutionnelle | Création de la **question prioritaire de constitutionnalité** |
| 2010 | Entrée en vigueur de la QPC | Tout justiciable peut faire contrôler une loi **déjà en vigueur** |

> Le Conseil constitutionnel, simple régulateur des pouvoirs en 1958, est devenu un **protecteur des droits**. Ce n’est pas une réforme unique : c’est un glissement en trois temps, sur quarante ans.

## Les tensions
| La tension | Ce qui la manifeste |
| Sécurité et libertés | États d’urgence de 2015 et de 2020 |
| Participation et défiance | Abstention élevée, mouvement des Gilets jaunes (2018) |
| Unité et diversité | Place des outre-mer, reconnaissance des minorités |

La République se redéfinit sans cesse dans ces tensions — ce qui est aussi le signe qu’elle reste **vivante**.`,
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
