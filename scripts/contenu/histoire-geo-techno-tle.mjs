// Histoire-géographie — Terminale TECHNOLOGIQUE : le programme de la voie techno.
//
// Programme de l'arrêté du 19 juillet 2019 (BO spécial n° 8 du 25 juillet 2019,
// annexe « terminale technologique »). Chaque thème porte UNE question
// obligatoire (A) et DEUX sujets d'étude (B) dont le professeur choisit un seul :
// on écrit les deux, l'élève ne sait pas lequel il aura.
//   HISTOIRE — « Totalitarismes, guerres et démocratie : des années 1920 à nos
//   jours » : 3 thèmes × (A + 2 B) = 9 fiches.
//   GÉOGRAPHIE — « La mondialisation : une mise en relation inégale des
//   territoires » : 3 thèmes × (A + 2 B) = 9 fiches.
// `axe` (chapters.theme) = le thème du programme ; `rayon` (chapters.discipline)
// = l'onglet histoire / géographie. Niveau 'Tle' : la « Tle techno » lit le
// contenu de Tle (contentLevelFor, lib/grades.ts).
//
// Pas de fiche « méthode de l'épreuve » : depuis la session 2022, l'histoire-
// géographie de la voie technologique est évaluée en contrôle continu (moyennes
// du livret scolaire), sans épreuve terminale écrite.

const H = 'histoire'
const G = 'geographie'

const T1 = 'Totalitarismes et Seconde Guerre mondiale'
const T2 = 'Du monde bipolaire au monde multipolaire'
const T3 = 'La France de 1945 à nos jours : une démocratie'
const G1 = 'Mers et océans : au cœur de la mondialisation'
const G2 = 'Des territoires inégalement intégrés dans la mondialisation, en fonction des décisions publiques et des stratégies des entreprises'
const G3 = 'La France et ses régions dans l’Union européenne et dans la mondialisation : lignes de force et recompositions'

export default {
  slug: 'histoire-geo-techno',
  nom: 'Histoire-géographie',

  titreMigration: 'HISTOIRE-GÉOGRAPHIE Tle TECHNOLOGIQUE — le programme (18 fiches)',

  motif: `La voie technologique a son propre programme d'histoire-géographie
(BO spécial n° 8 du 25 juillet 2019) : trois thèmes d'histoire et trois de
géographie, chacun organisé en une question obligatoire et deux sujets d'étude
au choix du professeur. Cette migration installe les 18 fiches de la Tle
technologique (9 d'histoire, 9 de géographie), rangées sous leur thème et dans
leur rayon, avec un cours et un quiz de 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ===================================================================
        // HISTOIRE — Thème 1
        // ===================================================================
        {
          titre: 'L’affirmation des totalitarismes et la guerre',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'Des régimes totalitaires à la guerre mondiale (1917-1945)',
            cours: `Dans l’entre-deux-guerres, des **régimes totalitaires** s’installent en URSS et en Allemagne. Ils déstabilisent les démocraties et mènent à la **Seconde Guerre mondiale** (1939-1945), le conflit le plus meurtrier de l’histoire : environ **60 millions de morts**, dont une majorité de civils.

## Qu’est-ce qu’un totalitarisme ?
Un **totalitarisme** est un régime qui veut contrôler **toute** la société et **tous** les individus :
1. un **parti unique** et un chef tout-puissant (culte de la personnalité) ;
2. une **idéologie** officielle qui prétend créer un « homme nouveau » ;
3. l’**encadrement** de la population (jeunesse, travail, loisirs) et la **propagande** ;
4. la **terreur** : police politique, camps, élimination des opposants.

| | **URSS de Staline** | **Allemagne de Hitler** |
| Arrivée au pouvoir | Staline s’impose après la mort de Lénine (1924), seul maître vers 1929 | Hitler nommé chancelier le 30 janvier 1933 |
| Idéologie | Communisme : société sans classes | Nazisme : racisme, antisémitisme, « espace vital » |
| Violences | Collectivisation, famine en Ukraine (1932-1933), **goulag**, Grande Terreur (1937-1938) | Camps de concentration (Dachau, 1933), lois de **Nuremberg** (1935), Nuit de cristal (1938) |
| Résistances | Rares et écrasées | Quelques opposants (la Rose blanche, attentat du 20 juillet 1944) |

## Une guerre mondiale (1939-1945)
@ 1er septembre 1939 — L’Allemagne envahit la Pologne ; le Royaume-Uni et la France lui déclarent la guerre
@ Mai-juin 1940 — Défaite de la France
@ 22 juin 1941 — L’Allemagne attaque l’URSS
@ 7 décembre 1941 — Le Japon attaque Pearl Harbor : les États-Unis entrent en guerre
@ Février 1943 — Victoire soviétique à Stalingrad
@ 6 juin 1944 — Débarquement en Normandie
@ 8 mai 1945 — Capitulation allemande
@ 6 et 9 août 1945 — Bombes atomiques sur Hiroshima et Nagasaki ; le Japon capitule le 2 septembre

Les théâtres d’opération : l’Europe (Ouest, front de l’Est, Méditerranée), l’Afrique du Nord, l’Atlantique, le Pacifique et l’Asie.

## Crimes de guerre, crimes de masse et génocides
- Les nazis organisent le **génocide des Juifs** d’Europe (**Shoah**) : environ **6 millions** de morts, par les fusillades des Einsatzgruppen puis les centres de mise à mort (Auschwitz-Birkenau, Treblinka). Les **Tsiganes** sont aussi victimes d’un génocide.
- Le Japon commet des massacres en Chine (Nankin, 1937).
- Les civils sont bombardés (Coventry, Dresde, Tokyo).

## La France dans la guerre
- Après la défaite, le **maréchal Pétain** obtient les pleins pouvoirs le **10 juillet 1940** : c’est le **régime de Vichy**, autoritaire, qui pratique la **collaboration** avec l’Allemagne (lois antijuives d’octobre 1940, rafle du **Vél’ d’Hiv** en juillet 1942).
- Face à lui, la **Résistance** : la **France libre** du général de Gaulle depuis Londres (appel du **18 juin 1940**) et la Résistance intérieure, unifiée par **Jean Moulin** dans le **Conseil national de la Résistance** (1943).

## Un nouvel ordre international
- **1945** : création de l’**ONU** (conférence de San Francisco) pour garantir la paix.
- **Procès de Nuremberg** (1945-1946) et de **Tokyo** (1946-1948) : ils jugent les dirigeants nazis et japonais et définissent le **crime contre l’humanité**.

> Le **génocide** est la destruction délibérée d’un peuple ; le **crime contre l’humanité** vise des civils pour ce qu’ils sont. Ces notions juridiques naissent de la Seconde Guerre mondiale.

## Repères à retenir
| Repère | Date |
| Hitler chancelier | 1933 |
| Invasion de la Pologne | 1er septembre 1939 |
| Appel du 18 juin | 1940 |
| Stalingrad | 1942-1943 |
| Débarquement | 6 juin 1944 |
| Fin de la guerre en Europe | 8 mai 1945 |

**Notions** : totalitarisme, génocide, crime contre l’humanité, collaboration, Résistance.`,
          },
          questions: [
            ['Quel élément caractérise un régime totalitaire ?', ['Plusieurs partis en concurrence', 'Un parti unique qui veut contrôler toute la société', 'Une presse libre', 'Des élections libres'], 1, 'Le totalitarisme veut encadrer tous les individus par l’idéologie, la propagande et la terreur.'],
            ['Quand Hitler devient-il chancelier ?', ['Le 30 janvier 1933', 'Le 1er septembre 1939', 'Le 9 novembre 1923', 'Le 8 mai 1945'], 0, 'Il est nommé légalement par le président Hindenburg, puis détruit la démocratie en quelques mois.'],
            ['Comment s’appelle le système des camps de travail forcé en URSS ?', ['Le Reich', 'Le kolkhoze', 'Le goulag', 'Le Komintern'], 2, 'Des millions de personnes y ont été déportées, beaucoup y sont mortes.'],
            ['Quelles lois de 1935 excluent les Juifs de la citoyenneté allemande ?', ['Les lois Ferry', 'Les lois de Vichy', 'Les lois de Weimar', 'Les lois de Nuremberg'], 3, 'Elles interdisent aussi les mariages entre Juifs et non-Juifs.'],
            ['Quel événement déclenche la Seconde Guerre mondiale en Europe ?', ['L’attaque de Pearl Harbor', 'L’invasion de la Pologne par l’Allemagne', 'Le débarquement en Normandie', 'La bataille de Stalingrad'], 1, 'Le 1er septembre 1939, l’Allemagne envahit la Pologne ; la France et le Royaume-Uni déclarent la guerre le 3.'],
            ['Pourquoi les États-Unis entrent-ils en guerre en décembre 1941 ?', ['Parce que l’Allemagne envahit la France', 'Parce que le Japon attaque Pearl Harbor', 'Parce que l’URSS les attaque', 'Pour libérer la Pologne'], 1, 'Le 7 décembre 1941, l’attaque japonaise sur leur base du Pacifique les fait entrer dans le conflit.'],
            ['Combien de Juifs d’Europe ont été assassinés pendant la Shoah ?', ['Environ 600 000', 'Environ 60 000', 'Environ 6 millions', 'Environ 60 millions'], 2, 'Les nazis ont voulu exterminer tous les Juifs d’Europe, par les fusillades puis les centres de mise à mort.'],
            ['Qu’est-ce que la collaboration ?', ['La politique de coopération du régime de Vichy avec l’Allemagne nazie', 'L’alliance entre la France libre et le Royaume-Uni', 'La Résistance intérieure', 'La reconstruction après 1945'], 0, 'Vichy collabore sur le plan économique, policier (rafles) et politique.'],
            ['Qui unifie la Résistance intérieure au sein du Conseil national de la Résistance ?', ['Philippe Pétain', 'Pierre Laval', 'Jean Moulin', 'Léon Blum'], 2, 'Envoyé par de Gaulle, Jean Moulin réunit le CNR en mai 1943 ; il est arrêté en juin et meurt sous la torture.'],
            ['Le génocide des Tsiganes a aussi été perpétré par les nazis.', ['Vrai', 'Faux'], 0, 'Les Tsiganes (Roms et Sinti) ont été persécutés, internés et exterminés en raison de leur origine.'],
            ['Quelle organisation internationale est créée en 1945 pour garantir la paix ?', ['La SDN', 'L’OTAN', 'L’Union européenne', 'L’ONU'], 3, 'Sa charte est signée à San Francisco en juin 1945.'],
            ['Le procès de Nuremberg juge les dirigeants japonais.', ['Vrai', 'Faux'], 1, 'Nuremberg juge les dirigeants nazis (1945-1946) ; les dirigeants japonais sont jugés à Tokyo.'],
          ],
        },
        {
          titre: 'La guerre d’anéantissement à l’Est et le génocide des Juifs',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'À l’Est, la guerre et le génocide s’entraînent l’un l’autre',
            cours: `Le **22 juin 1941**, l’Allemagne attaque l’URSS : c’est l’**opération Barbarossa**. Pour Hitler, ce n’est pas une guerre comme les autres, mais une **guerre d’anéantissement** contre le « judéo-bolchevisme » et les peuples slaves. Ce sujet d’étude montre comment l’évolution de la guerre à l’Est **accélère** la mise en œuvre du **génocide des Juifs** et en **modifie les formes**.

## Une guerre idéologique et raciale
- Le nazisme veut conquérir un « **espace vital** » (*Lebensraum*) à l’Est, le coloniser et en réduire les populations slaves en esclavage.
- Les ordres de l’armée allemande (Wehrmacht) autorisent l’exécution des commissaires politiques soviétiques et des violences contre les civils.
- Les **prisonniers de guerre soviétiques** sont affamés : environ **3 millions** meurent en captivité.
- Le blocus de **Leningrad** (1941-1944) fait environ un million de morts civils.

## Les étapes du génocide
| Étape | Date | Forme |
| Persécutions et exclusion | 1933-1939 | Lois de Nuremberg (1935), Nuit de cristal (1938), émigration forcée |
| **Ghettos** | 1939-1942 | En Pologne, les Juifs sont enfermés (Varsovie, Łódź) ; faim et épidémies |
| **« Shoah par balles »** | À partir de juin 1941 | Les **Einsatzgruppen** fusillent les Juifs derrière le front : **Babi Yar** près de Kiev (plus de 33 000 morts en deux jours, septembre 1941) |
| **Centres de mise à mort** | Fin 1941-1944 | Chambres à gaz : Chełmno, Bełżec, Sobibór, **Treblinka**, **Auschwitz-Birkenau** |

> À l’Est, l’avancée des armées ouvre aux nazis des territoires peuplés de millions de Juifs : les massacres de masse commencent avec l’invasion.

## De la fusillade au gaz
1. Au second semestre **1941**, les fusillades touchent hommes, femmes et enfants : environ **1,5 million** de victimes à la fin de l’année 1942 dans les territoires soviétiques occupés.
2. Les nazis cherchent une méthode plus « efficace » et moins éprouvante pour les tueurs : camions à gaz, puis **chambres à gaz**.
3. La **conférence de Wannsee** (**20 janvier 1942**) organise la coordination administrative de la « **solution finale** » : la déportation de tous les Juifs d’Europe vers les centres de mise à mort de Pologne.
4. **Auschwitz-Birkenau** devient le plus grand centre de mise à mort : environ **1,1 million** de morts, dont environ **un million de Juifs**.

## Résistances et fin de la guerre
- Soulèvement du **ghetto de Varsovie** (avril-mai 1943), révoltes à Treblinka et Sobibór (1943).
- La défaite allemande à **Stalingrad** (février 1943) retourne la guerre ; l’Armée rouge libère **Auschwitz** le **27 janvier 1945** — date devenue la journée internationale de la mémoire de l’Holocauste.
- Bilan : environ **6 millions** de Juifs assassinés, dont environ la moitié venue de Pologne.

## Le croquis en mots
Sur une carte de l’Europe de l’Est : la ligne de front qui avance jusqu’aux portes de Moscou et à Stalingrad. En arrière du front, des points marquent les massacres par balles (Babi Yar en Ukraine, les pays baltes, la Biélorussie). En Pologne occupée, les ghettos (Varsovie, Łódź) et six centres de mise à mort. Des flèches, venues de toute l’Europe (France, Pays-Bas, Grèce, Hongrie), convergent vers Auschwitz.

## Repères à retenir
| Repère | Date |
| Opération Barbarossa | 22 juin 1941 |
| Babi Yar | 29-30 septembre 1941 |
| Conférence de Wannsee | 20 janvier 1942 |
| Soulèvement du ghetto de Varsovie | avril 1943 |
| Libération d’Auschwitz | 27 janvier 1945 |`,
          },
          questions: [
            ['Comment s’appelle l’attaque allemande contre l’URSS le 22 juin 1941 ?', ['L’opération Overlord', 'L’opération Barbarossa', 'L’opération Torch', 'Le Blitz'], 1, 'Elle ouvre sur le front de l’Est une guerre d’anéantissement.'],
            ['Pourquoi parle-t-on de « guerre d’anéantissement » à l’Est ?', ['Parce que la guerre y est courte', 'Parce qu’elle vise à détruire des peuples et une idéologie, pas seulement une armée', 'Parce qu’on n’y combat pas', 'Parce qu’elle se déroule en mer'], 1, 'Pour Hitler, il s’agit d’éliminer le « judéo-bolchevisme » et de coloniser l’espace slave.'],
            ['Qui sont les Einsatzgruppen ?', ['Des unités mobiles de tuerie qui fusillent les Juifs derrière le front', 'Des résistants polonais', 'Des soldats soviétiques', 'Des diplomates allemands'], 0, 'Ces unités de la SS et de la police commettent la « Shoah par balles ».'],
            ['Quel massacre fait plus de 33 000 victimes près de Kiev en septembre 1941 ?', ['Oradour-sur-Glane', 'Katyn', 'Nankin', 'Babi Yar'], 3, 'En deux jours, les 29 et 30 septembre 1941, les Juifs de Kiev sont fusillés dans un ravin.'],
            ['Que décide la conférence de Wannsee en janvier 1942 ?', ['L’invasion de l’URSS', 'La coordination administrative de la « solution finale »', 'La paix avec les Alliés', 'La création des ghettos'], 1, 'Des hauts responsables nazis y organisent la déportation des Juifs de toute l’Europe.'],
            ['Quel est le plus grand centre de mise à mort nazi ?', ['Dachau', 'Buchenwald', 'Auschwitz-Birkenau', 'Drancy'], 2, 'Environ 1,1 million de personnes y sont assassinées, en grande majorité des Juifs.'],
            ['Les ghettos ont été créés avant les centres de mise à mort.', ['Vrai', 'Faux'], 0, 'Dès 1939-1940, les Juifs de Pologne sont enfermés dans des ghettos, où la faim et les épidémies tuent en masse.'],
            ['Pourquoi les nazis passent-ils des fusillades aux chambres à gaz ?', ['Par manque de soldats à l’Est', 'Parce que les Alliés l’exigent', 'Pour tuer davantage et plus vite, en éloignant les tueurs des victimes', 'Pour cacher la guerre'], 2, 'Les chambres à gaz industrialisent le meurtre de masse.'],
            ['Combien de prisonniers de guerre soviétiques meurent en captivité allemande ?', ['Environ 3 millions', 'Environ 30 000', 'Environ 300', 'Aucun'], 0, 'Affamés et maltraités, ils sont victimes de la dimension raciale de la guerre.'],
            ['Quand le ghetto de Varsovie se soulève-t-il ?', ['En 1939', 'En avril 1943', 'En 1945', 'En juin 1941'], 1, 'Les combattants juifs résistent près d’un mois à l’armée allemande.'],
            ['Le 27 janvier est la journée internationale de la mémoire de l’Holocauste.', ['Vrai', 'Faux'], 0, 'C’est la date de la libération d’Auschwitz par l’Armée rouge en 1945.'],
            ['Quel pays a compté le plus de victimes juives de la Shoah ?', ['La France', 'L’Allemagne', 'L’Italie', 'La Pologne'], 3, 'Environ 3 millions de Juifs polonais ont été assassinés, soit environ la moitié des victimes.'],
          ],
        },
        {
          titre: 'De Gaulle et la France libre',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'Un général rebelle qui incarne la France combattante',
            cours: `En juin 1940, un général presque inconnu refuse la défaite et s’installe à Londres. En quatre ans, **Charles de Gaulle** fait de la **France libre** une force militaire et politique qui unit la **Résistance** et rend à la France sa place parmi les vainqueurs.

## Refuser l’armistice
@ 17 juin 1940 — Le maréchal Pétain annonce qu’il faut « cesser le combat »
@ 18 juin 1940 — De Gaulle lance depuis Londres, sur la BBC, l’appel à poursuivre la lutte
@ 22 juin 1940 — Armistice signé à Rethondes
@ 28 juin 1940 — Churchill reconnaît de Gaulle comme chef des Français libres

**L’appel du 18 juin** affirme que la guerre est mondiale, que la France a un empire et des alliés, et que « la flamme de la résistance française ne doit pas s’éteindre ». Condamné à mort par contumace par Vichy, de Gaulle dispose au départ de quelques milliers d’hommes.

## Bâtir la France libre
1. **Des soldats** : les **Forces françaises libres** (FFL), avec les ralliés de l’Empire. À **Bir Hakeim** (Libye, mai-juin 1942), les troupes du général **Kœnig** résistent deux semaines à Rommel. La colonne **Leclerc**, partie du Tchad, prend **Koufra** (1941) : c’est le serment de ne déposer les armes que lorsque le drapeau flottera sur Strasbourg.
2. **Des territoires** : l’Afrique équatoriale française (AEF) se rallie dès août 1940 grâce au gouverneur **Félix Éboué**, au Tchad. Brazzaville devient la capitale de la France libre.
3. **Des institutions** : le **Conseil de défense de l’Empire** (1940), le **Comité national français** (1941), puis le **Comité français de libération nationale** (CFLN) à Alger (1943), qui devient le **Gouvernement provisoire de la République française** (GPRF) en juin 1944.

> De Gaulle affirme que **Vichy est illégitime** : la vraie France est celle qui continue le combat.

## Unifier la Résistance
- **Jean Moulin**, ancien préfet, est envoyé par de Gaulle pour unifier les mouvements de résistance intérieure : il crée le **Conseil national de la Résistance** (CNR), réuni le **27 mai 1943**. Arrêté à Caluire en juin 1943, il meurt sous la torture.
- Le **programme du CNR** (mars 1944) prévoit des réformes sociales pour après la guerre (Sécurité sociale, nationalisations).
- Les **Forces françaises de l’intérieur** (FFI) sont créées en 1944.

## Une relation difficile avec les Alliés
Churchill soutient de Gaulle, mais **Roosevelt** se méfie de lui et traite d’abord avec d’autres chefs (l’amiral Darlan puis le général **Giraud** à Alger). De Gaulle doit s’imposer face à eux.

## La Libération
- **6 juin 1944** : débarquement en Normandie ; la **2e division blindée** de Leclerc débarque en août.
- **25 août 1944** : libération de **Paris**. Le lendemain, de Gaulle descend les Champs-Élysées, acclamé par la foule.
- Le GPRF rétablit la République et évite l’administration militaire alliée prévue par les Américains.
- La France obtient une zone d’occupation en Allemagne et un siège permanent au Conseil de sécurité de l’ONU.

## Repères à retenir
| Repère | Date |
| Appel du 18 juin | 18 juin 1940 |
| Ralliement du Tchad | août 1940 |
| Bir Hakeim | mai-juin 1942 |
| Première réunion du CNR | 27 mai 1943 |
| GPRF | juin 1944 |
| Libération de Paris | 25 août 1944 |`,
          },
          questions: [
            ['D’où de Gaulle lance-t-il son appel le 18 juin 1940 ?', ['D’Alger', 'De Londres, sur la BBC', 'De Paris', 'De Vichy'], 1, 'Il s’exprime à la radio britannique, avec l’accord de Churchill.'],
            ['Que dit l’appel du 18 juin ?', ['Qu’il faut signer l’armistice', 'Que la guerre est perdue', 'Que la guerre est mondiale et qu’il faut continuer le combat', 'Qu’il faut collaborer avec l’Allemagne'], 2, 'Il rappelle que la France a un empire et des alliés, et appelle à poursuivre la lutte.'],
            ['Quel territoire se rallie le premier à la France libre, en août 1940 ?', ['Le Tchad', 'L’Algérie', 'Le Maroc', 'L’Indochine'], 0, 'Le gouverneur Félix Éboué rallie le Tchad, puis l’AEF suit.'],
            ['Quelle bataille de 1942 montre la valeur militaire des Forces françaises libres ?', ['Stalingrad', 'Verdun', 'Dunkerque', 'Bir Hakeim'], 3, 'Les troupes de Kœnig résistent deux semaines à l’Afrikakorps de Rommel en Libye.'],
            ['Quelle est la mission de Jean Moulin ?', ['Diriger l’armée à Londres', 'Unifier les mouvements de la Résistance intérieure', 'Négocier avec Vichy', 'Commander la 2e DB'], 1, 'Il crée le Conseil national de la Résistance, réuni pour la première fois le 27 mai 1943.'],
            ['Quel chef allié se méfie de de Gaulle ?', ['Churchill', 'Staline', 'Roosevelt', 'Eisenhower'], 2, 'Le président américain préfère d’abord traiter avec Darlan puis Giraud.'],
            ['Le régime de Vichy a condamné de Gaulle à mort par contumace.', ['Vrai', 'Faux'], 0, 'Pour Vichy, il est un rebelle ; pour de Gaulle, c’est Vichy qui est illégitime.'],
            ['Que prévoit le programme du CNR de mars 1944 ?', ['Le retour de la monarchie', 'Des réformes sociales comme la Sécurité sociale', 'L’alliance avec l’Allemagne', 'L’indépendance des colonies'], 1, 'Ce programme inspire les grandes réformes de la Libération.'],
            ['Quel serment le général Leclerc prononce-t-il à Koufra en 1941 ?', ['Libérer Paris avant Noël', 'Ne jamais revenir en France', 'Ne déposer les armes que quand le drapeau flottera sur Strasbourg', 'Prendre Berlin'], 2, 'Il tiendra parole : la 2e DB libère Strasbourg en novembre 1944.'],
            ['Comment s’appelle le gouvernement de la France libre formé en juin 1944 ?', ['Le GPRF', 'Le Directoire', 'Le Front populaire', 'Le Consulat'], 0, 'Le Gouvernement provisoire de la République française succède au CFLN d’Alger.'],
            ['Quand Paris est-il libéré ?', ['Le 6 juin 1944', 'Le 8 mai 1945', 'Le 11 novembre 1944', 'Le 25 août 1944'], 3, 'La 2e DB de Leclerc et les FFI libèrent la capitale ; de Gaulle y défile le lendemain.'],
            ['Grâce à l’action de la France libre, la France obtient un siège permanent au Conseil de sécurité de l’ONU.', ['Vrai', 'Faux'], 0, 'La France est comptée parmi les vainqueurs, avec une zone d’occupation en Allemagne.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Thème 2
        // ===================================================================
        {
          titre: 'Le monde de 1945 à nos jours',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'De la guerre froide au monde multipolaire',
            cours: `Depuis 1945, le monde est passé d’un **monde bipolaire**, dominé par deux superpuissances, à un **monde multipolaire** où plusieurs puissances s’affrontent et coopèrent. En même temps, les empires coloniaux ont disparu et l’Europe s’est construite.

## La guerre froide (1947-1991)
La **guerre froide** oppose les **États-Unis** (capitalisme, démocratie libérale) et l’**URSS** (communisme, parti unique), sans affrontement direct entre eux, à cause de la menace **nucléaire**.
| Bloc de l’Ouest | Bloc de l’Est |
| États-Unis, Europe de l’Ouest | URSS, démocraties populaires d’Europe de l’Est |
| **OTAN** (1949) | **Pacte de Varsovie** (1955) |
| **Plan Marshall** (1947) | **CAEM** (1949) |

@ 1947 — Doctrine Truman (endiguement) et doctrine Jdanov : début de la guerre froide
@ 1948-1949 — Blocus de Berlin
@ 1950-1953 — Guerre de Corée
@ 1961 — Construction du mur de Berlin
@ 1962 — Crise des missiles de Cuba : le monde au bord de la guerre nucléaire
@ 1955-1975 — Guerre du Vietnam
@ 9 novembre 1989 — Chute du mur de Berlin
@ 25 décembre 1991 — Disparition de l’URSS

Les deux Grands s’affrontent **indirectement** : conflits régionaux (Corée, Vietnam, Afghanistan), course aux armements, conquête spatiale, propagande.

## La décolonisation et le tiers monde
- De **1945 aux années 1970**, les empires coloniaux disparaissent : Inde (**1947**), Indonésie (1949), Indochine (**1954**), Afrique subsaharienne (surtout **1960**), Algérie (**1962**).
- Certaines indépendances sont négociées, d’autres arrachées par la guerre.
- La **conférence de Bandung** (1955) réunit les pays d’Asie et d’Afrique ; ils forment le **tiers monde** et le mouvement des **non-alignés** (1961), qui refusent de choisir entre les deux blocs.

## Le monde depuis 1991
- Les **États-Unis** restent l’**hyperpuissance** dans les années 1990.
- De **nouvelles puissances** s’affirment : la **Chine** (deuxième économie mondiale), l’Inde, le Brésil ; la Russie de Poutine redevient une puissance militaire agressive (Géorgie 2008, Crimée 2014, invasion de l’**Ukraine** en février **2022**).
- **Nouvelles formes de conflits** : guerres civiles et ethniques (ex-Yougoslavie, génocide des Tutsi au **Rwanda** en 1994), **terrorisme** islamiste (11 septembre 2001), cyberattaques.

> On parle de **monde multipolaire** : plusieurs pôles de puissance, des rivalités, mais aussi des coopérations (ONU, G20, accords sur le climat).

## Le projet européen
@ 1951 — Communauté européenne du charbon et de l’acier (CECA) : 6 pays
@ 1957 — Traités de Rome : Communauté économique européenne (CEE)
@ 1992 — Traité de Maastricht : naissance de l’Union européenne
@ 2002 — L’euro en pièces et billets
@ 2004 — Élargissement à dix pays, surtout d’Europe de l’Est
@ 2020 — Sortie du Royaume-Uni (Brexit)

L’Union européenne compte **27 États** membres depuis 2020. Ses fondateurs (Robert **Schuman**, Jean **Monnet**, Konrad Adenauer) voulaient rendre la guerre impossible entre voisins.

## Repères à retenir
| Repère | Date |
| Début de la guerre froide | 1947 |
| Crise de Cuba | 1962 |
| Indépendances africaines | 1960 |
| Chute du mur de Berlin | 1989 |
| Fin de l’URSS | 1991 |
| Traité de Maastricht | 1992 |

**Notions** : guerre froide, monde bipolaire, décolonisation, monde multipolaire, construction européenne.`,
          },
          questions: [
            ['Quelles puissances s’opposent pendant la guerre froide ?', ['La France et l’Allemagne', 'Les États-Unis et l’URSS', 'La Chine et le Japon', 'Le Royaume-Uni et l’Inde'], 1, 'Les deux superpuissances s’affrontent sans guerre directe, sous la menace nucléaire.'],
            ['Pourquoi parle-t-on de guerre « froide » ?', ['Parce qu’elle se déroule en Arctique', 'Parce qu’elle dure un hiver', 'Parce que les deux Grands ne s’affrontent pas directement', 'Parce qu’il n’y a aucun mort'], 2, 'La dissuasion nucléaire empêche le conflit direct ; les affrontements sont indirects.'],
            ['Quelle alliance militaire les États-Unis créent-ils en 1949 ?', ['Le pacte de Varsovie', 'L’ONU', 'Le CAEM', 'L’OTAN'], 3, 'L’Organisation du traité de l’Atlantique Nord unit les États-Unis et les pays d’Europe de l’Ouest.'],
            ['Quelle crise de 1962 met le monde au bord de la guerre nucléaire ?', ['La crise des missiles de Cuba', 'Le blocus de Berlin', 'La guerre de Corée', 'La crise de Suez'], 0, 'L’URSS installe des missiles à Cuba ; après treize jours de tension, elle les retire.'],
            ['Quand le mur de Berlin tombe-t-il ?', ['Le 13 août 1961', 'Le 9 novembre 1989', 'Le 25 décembre 1991', 'En 1945'], 1, 'Sa chute annonce la fin des démocraties populaires et la réunification allemande (1990).'],
            ['Quel pays devient indépendant en 1947 ?', ['L’Algérie', 'Le Sénégal', 'L’Inde', 'Le Vietnam'], 2, 'L’indépendance de l’Inde, avec la partition et la création du Pakistan, ouvre la décolonisation.'],
            ['Que réunit la conférence de Bandung en 1955 ?', ['Les pays d’Asie et d’Afrique décolonisés ou en lutte', 'Les pays de l’OTAN', 'Les pays communistes', 'Les fondateurs de l’Europe'], 0, 'Elle marque l’entrée du tiers monde sur la scène internationale.'],
            ['Les non-alignés refusent de choisir entre les deux blocs.', ['Vrai', 'Faux'], 0, 'Le mouvement, fondé à Belgrade en 1961, veut une troisième voie.'],
            ['Quel traité fonde l’Union européenne en 1992 ?', ['Le traité de Rome', 'Le traité de Lisbonne', 'Le traité de Versailles', 'Le traité de Maastricht'], 3, 'Il crée l’UE et prévoit la monnaie unique.'],
            ['Combien d’États membres compte l’Union européenne depuis 2020 ?', ['6', '15', '27', '28'], 2, 'Elle est passée de 28 à 27 membres avec la sortie du Royaume-Uni.'],
            ['Après 1991, les nouvelles formes de conflits incluent le terrorisme et les guerres civiles.', ['Vrai', 'Faux'], 0, 'Le génocide des Tutsi au Rwanda (1994) ou les attentats du 11 septembre 2001 en sont des exemples.'],
            ['Quel pays s’affirme comme deuxième économie mondiale au XXIe siècle ?', ['La Russie', 'La Chine', 'Le Brésil', 'L’Allemagne'], 1, 'La Chine est un pôle majeur du monde multipolaire, rival des États-Unis.'],
          ],
        },
        {
          titre: 'De Youri Gagarine à la guerre des étoiles',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'La conquête spatiale, vitrine de la guerre froide',
            cours: `Pendant la guerre froide, l’espace devient un champ de bataille **scientifique**, **technologique**, **symbolique** et **militaire**. De **Youri Gagarine** (1961) à l’**Initiative de défense stratégique** de Reagan, surnommée « **guerre des étoiles** » (1983), la conquête spatiale montre la rivalité entre les États-Unis et l’URSS.

## Les premiers succès soviétiques
@ 4 octobre 1957 — Lancement de Spoutnik 1, premier satellite artificiel
@ 3 novembre 1957 — Spoutnik 2 emporte la chienne Laïka
@ 12 avril 1961 — Youri Gagarine, premier homme dans l’espace, à bord de Vostok 1
@ 16 juin 1963 — Valentina Terechkova, première femme dans l’espace
@ 18 mars 1965 — Alexeï Leonov réalise la première sortie dans l’espace

Aux États-Unis, **Spoutnik** provoque un choc : si l’URSS peut mettre un satellite en orbite, elle peut aussi lancer des missiles nucléaires sur l’Amérique. Les Américains créent la **NASA** en **1958** et investissent massivement dans l’éducation scientifique.

> La fusée qui lance un satellite est aussi un missile : la conquête spatiale est inséparable de la course aux armements.

## La riposte américaine : la Lune
- **25 mai 1961** : le président **Kennedy** fixe l’objectif d’envoyer un homme sur la Lune avant la fin de la décennie.
- Le programme **Apollo** mobilise environ 400 000 personnes et environ 4 % du budget fédéral à son maximum.
- **21 juillet 1969** (heure française ; 20 juillet aux États-Unis) : **Neil Armstrong** et **Buzz Aldrin** (Apollo 11) marchent sur la Lune. Environ 600 millions de téléspectateurs suivent l’événement.
- L’URSS abandonne son programme lunaire habité.

## Les enjeux de la conquête spatiale
| Enjeu | Exemples |
| **Scientifique et technologique** | Fusées, informatique, matériaux, télécommunications |
| **Symbolique** | Prouver la supériorité de son modèle ; héros nationaux (Gagarine, Armstrong) |
| **Militaire** | Missiles intercontinentaux, satellites espions, satellites de communication |
| **Économique** | Satellites de télécommunication et météo |

## La détente dans l’espace
Pendant la **détente** des années 1970, les deux Grands coopèrent : en **1975**, les vaisseaux **Apollo** et **Soyouz** s’arriment en orbite, et les équipages se serrent la main. Le **traité de l’espace** (1967) interdit de placer des armes nucléaires en orbite.

## La « guerre des étoiles »
En **mars 1983**, le président **Ronald Reagan** lance l’**Initiative de défense stratégique** (IDS) : un bouclier de satellites et de lasers capable de détruire les missiles soviétiques en vol. La presse la surnomme « **guerre des étoiles** », d’après le film *Star Wars*.
- Le projet est techniquement irréalisable à l’époque, mais il relance la **course aux armements**.
- L’URSS, en crise économique, ne peut pas suivre : cette pression contribue à son affaiblissement, puis à la fin de la guerre froide.

## Repères à retenir
| Repère | Date |
| Spoutnik 1 | 4 octobre 1957 |
| Création de la NASA | 1958 |
| Gagarine | 12 avril 1961 |
| Apollo 11 | juillet 1969 |
| Apollo-Soyouz | 1975 |
| Initiative de défense stratégique | 1983 |`,
          },
          questions: [
            ['Quel est le premier satellite artificiel de l’histoire ?', ['Explorer 1', 'Apollo 11', 'Spoutnik 1', 'Vostok 1'], 2, 'Lancé par l’URSS le 4 octobre 1957, il provoque un choc aux États-Unis.'],
            ['Qui est le premier homme dans l’espace ?', ['Youri Gagarine', 'Neil Armstrong', 'Alexeï Leonov', 'John Glenn'], 0, 'Le 12 avril 1961, il fait un tour de la Terre à bord de Vostok 1.'],
            ['Pourquoi Spoutnik inquiète-t-il les Américains ?', ['Parce qu’il pollue l’espace', 'Parce qu’il montre que l’URSS peut aussi lancer des missiles jusqu’aux États-Unis', 'Parce qu’il espionne la Lune', 'Parce qu’il est américain'], 1, 'La fusée qui lance un satellite peut porter une bombe nucléaire.'],
            ['Quelle agence les États-Unis créent-ils en 1958 ?', ['La CIA', 'L’ESA', 'Le CNES', 'La NASA'], 3, 'La NASA organise le programme spatial civil américain.'],
            ['Quel président américain fixe l’objectif d’aller sur la Lune ?', ['Kennedy', 'Nixon', 'Reagan', 'Eisenhower'], 0, 'Le 25 mai 1961, il promet un homme sur la Lune avant la fin de la décennie.'],
            ['Qui est la première femme dans l’espace, en 1963 ?', ['Sally Ride', 'Valentina Terechkova', 'Claudie Haigneré', 'Svetlana Savitskaïa'], 1, 'Cette Soviétique vole à bord de Vostok 6 : nouvelle victoire symbolique de l’URSS.'],
            ['Neil Armstrong et Buzz Aldrin marchent sur la Lune en juillet 1969.', ['Vrai', 'Faux'], 0, 'La mission Apollo 11 est une victoire symbolique majeure des États-Unis.'],
            ['Que symbolise la mission Apollo-Soyouz de 1975 ?', ['Le début de la guerre froide', 'La course à la Lune', 'La coopération pendant la détente', 'La fin de l’URSS'], 2, 'Américains et Soviétiques s’arriment et se serrent la main en orbite.'],
            ['Qu’est-ce que l’Initiative de défense stratégique de 1983 ?', ['Un projet de bouclier antimissile dans l’espace', 'Une station spatiale commune', 'Un traité de désarmement', 'Une mission vers Mars'], 0, 'Reagan veut détruire les missiles soviétiques en vol grâce à des satellites et des lasers.'],
            ['Pourquoi surnomme-t-on l’IDS « guerre des étoiles » ?', ['Parce qu’elle vise les étoiles', 'Par référence au film Star Wars', 'Parce qu’elle a lieu la nuit', 'Parce qu’elle est soviétique'], 1, 'La presse reprend le titre du film de George Lucas sorti en 1977.'],
            ['Le traité de l’espace de 1967 autorise les armes nucléaires en orbite.', ['Vrai', 'Faux'], 1, 'Il les interdit, ainsi que l’appropriation de la Lune par un État.'],
            ['Quel effet la « guerre des étoiles » a-t-elle sur l’URSS ?', ['Elle la rend plus riche', 'Elle lui fait gagner la guerre froide', 'Elle n’a aucun effet', 'Elle la pousse dans une course aux armements qu’elle ne peut plus financer'], 3, 'En crise économique, l’URSS ne peut suivre, ce qui contribue à la fin de la guerre froide.'],
          ],
        },
        {
          titre: 'Le 11 septembre 2001',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'Un attentat qui change le monde',
            cours: `Le **11 septembre 2001**, des terroristes d’**Al-Qaïda** détournent quatre avions de ligne aux États-Unis. Près de **3 000 personnes** sont tuées. Ce sujet d’étude permet de saisir l’**événement** et ses multiples **conséquences**, et d’appréhender la question du **terrorisme** dans l’évolution du monde.

## La journée du 11 septembre
@ 8 h 46 (heure de New York) — Un avion percute la tour nord du World Trade Center
@ 9 h 03 — Un deuxième avion percute la tour sud
@ 9 h 37 — Un troisième avion s’écrase sur le Pentagone, à Washington
@ 9 h 59 — La tour sud s’effondre
@ 10 h 03 — Le vol United 93 s’écrase en Pennsylvanie : les passagers se sont révoltés contre les pirates de l’air
@ 10 h 28 — La tour nord s’effondre

- **19 terroristes**, pour la plupart saoudiens, ont préparé l’attaque ; ils visent des **symboles** de la puissance américaine : économique (le **World Trade Center**), militaire (le **Pentagone**), politique (le Capitole ou la Maison-Blanche, cible probable du 4e avion).
- **2 977 victimes** (hors terroristes), de plus de 90 nationalités, dont plus de 400 pompiers, policiers et secouristes.
- L’événement est suivi **en direct** à la télévision dans le monde entier.

## Qui est Al-Qaïda ?
**Al-Qaïda** (« la base ») est une organisation **terroriste islamiste** fondée à la fin des années 1980 par **Oussama Ben Laden**, un Saoudien qui a combattu les Soviétiques en Afghanistan. Elle veut chasser les Occidentaux du monde musulman et y imposer sa lecture extrémiste de l’islam. Elle était protégée en Afghanistan par le régime des **talibans**.

> Le **terrorisme** est l’usage de la violence contre des civils pour créer la peur et atteindre des buts politiques.

## Les conséquences internationales
1. **La « guerre contre le terrorisme »** : le président **George W. Bush** lance l’intervention en **Afghanistan** (octobre **2001**), avec le soutien de l’OTAN et de l’ONU ; le régime des talibans tombe.
2. **La guerre d’Irak (2003)** : les États-Unis renversent **Saddam Hussein**, au nom d’armes de destruction massive qui n’existaient pas, **sans mandat de l’ONU** ; la France s’y oppose. L’Irak plonge dans le chaos, terreau de l’**État islamique**.
3. **Ben Laden** est tué par un commando américain au Pakistan le **2 mai 2011**.
4. En **2021**, les troupes américaines quittent l’Afghanistan ; les talibans reprennent le pouvoir.

## Les conséquences aux États-Unis et dans le monde
- Renforcement de la **sécurité** : contrôles dans les aéroports, surveillance (**Patriot Act**, 2001), création du département de la Sécurité intérieure.
- Des atteintes aux droits : prison de **Guantánamo**, torture pendant les interrogatoires.
- D’autres attentats djihadistes frappent le monde : Madrid (2004), Londres (2005), Paris (2015).

## La mémoire
Sur le site des tours, **Ground Zero**, s’élèvent le **mémorial du 11-Septembre** (deux bassins à l’emplacement des tours, avec les noms des victimes) et le **One World Trade Center** (541 m), inauguré en 2014.

## Repères à retenir
| Repère | Date |
| Attentats | 11 septembre 2001 |
| Intervention en Afghanistan | octobre 2001 |
| Guerre d’Irak | 2003 |
| Mort de Ben Laden | 2 mai 2011 |
| Retour des talibans | août 2021 |`,
          },
          questions: [
            ['Quelle organisation terroriste commet les attentats du 11 septembre 2001 ?', ['L’État islamique', 'Le Hezbollah', 'Al-Qaïda', 'L’IRA'], 2, 'Dirigée par Oussama Ben Laden, elle a préparé l’attaque depuis l’Afghanistan.'],
            ['Combien de personnes sont tuées le 11 septembre 2001 ?', ['Environ 300', 'Près de 3 000', 'Environ 30 000', 'Environ 30'], 1, 'On compte 2 977 victimes, de plus de 90 nationalités.'],
            ['Quels bâtiments sont frappés par les avions ?', ['Le World Trade Center et le Pentagone', 'La Maison-Blanche et le Capitole', 'La statue de la Liberté et l’Empire State Building', 'Le siège de l’ONU'], 0, 'Le quatrième avion, qui visait sans doute Washington, s’écrase en Pennsylvanie.'],
            ['Pourquoi le vol United 93 n’atteint-il pas sa cible ?', ['Il est abattu par l’armée', 'Il tombe en panne', 'Il fait demi-tour', 'Les passagers se révoltent contre les pirates de l’air'], 3, 'Informés par téléphone des autres attaques, ils tentent de reprendre l’avion, qui s’écrase en Pennsylvanie.'],
            ['Que symbolise le World Trade Center pour les terroristes ?', ['La puissance militaire', 'La puissance économique et financière des États-Unis', 'La religion chrétienne', 'Le pouvoir politique'], 1, 'Les tours jumelles incarnaient le capitalisme américain et la mondialisation.'],
            ['Quel pays les États-Unis attaquent-ils dès octobre 2001 ?', ['L’Irak', 'L’Iran', 'L’Afghanistan', 'La Syrie'], 2, 'Le régime des talibans y protégeait Al-Qaïda ; il est renversé.'],
            ['La guerre d’Irak de 2003 a été autorisée par l’ONU.', ['Vrai', 'Faux'], 1, 'Les États-Unis interviennent sans mandat de l’ONU ; la France s’y oppose.'],
            ['Qu’est-ce que le terrorisme ?', ['L’usage de la violence contre des civils pour créer la peur et atteindre des buts politiques', 'Une guerre entre deux armées', 'Une révolution pacifique', 'Un coup d’État militaire'], 0, 'Frapper des civils vise à terroriser une société entière.'],
            ['Quand Oussama Ben Laden est-il tué ?', ['En 2001', 'En 2003', 'En 2021', 'En 2011'], 3, 'Un commando américain le tue au Pakistan le 2 mai 2011.'],
            ['Quelle loi américaine de 2001 renforce la surveillance ?', ['Le Patriot Act', 'Le New Deal', 'Le Civil Rights Act', 'Le plan Marshall'], 0, 'Elle étend les pouvoirs des services de renseignement, au prix de certaines libertés.'],
            ['Les talibans ont repris le pouvoir en Afghanistan en 2021.', ['Vrai', 'Faux'], 0, 'Après vingt ans de présence, les troupes américaines se retirent en août 2021.'],
            ['Qu’y a-t-il aujourd’hui à l’emplacement des tours jumelles ?', ['Un parc d’attractions', 'Un aéroport', 'Le mémorial du 11-Septembre et le One World Trade Center', 'Rien, le site est abandonné'], 2, 'Deux bassins marquent l’emplacement des tours, avec les noms des victimes.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Thème 3
        // ===================================================================
        {
          titre: 'La France depuis 1945 : politique et société',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Reconstruire la République, transformer la société',
            cours: `Depuis 1945, la France a reconstruit son régime républicain, perdu son empire colonial, changé de constitution et connu de profondes mutations sociales. Cette question montre l’évolution de la **démocratie** française et de la **place de la France** dans le monde.

## Le GPRF et les réformes de la Libération (1944-1946)
Le **Gouvernement provisoire de la République française**, dirigé par de Gaulle, applique en partie le **programme du CNR** :
| Réforme | Date |
| **Droit de vote des femmes** (ordonnance d’avril 1944) — premier vote en avril 1945 | 1944-1945 |
| **Sécurité sociale** | octobre 1945 |
| **Nationalisations** : Renault, charbonnages, banques, électricité (EDF) et gaz (GDF) | 1945-1946 |
| Comités d’entreprise | 1945 |
| **École nationale d’administration** (ENA) | 1945 |

La **IVe République** (1946-1958) est un régime parlementaire instable (plus de 20 gouvernements en 12 ans), mais elle reconstruit le pays et participe à la construction européenne.

## La fin de l’empire colonial
- Guerre d’**Indochine** (1946-1954), perdue à **Diên Biên Phu** ; accords de Genève (1954).
- Indépendance du Maroc et de la Tunisie (1956), de l’Afrique subsaharienne (**1960**).
- Guerre d’**Algérie** (1954-1962), qui fait tomber la IVe République en **mai 1958** ; indépendance en **1962**.

## La Ve République et ses réformes institutionnelles
- **Constitution de 1958**, voulue par de Gaulle : un exécutif fort, un président arbitre.
- **1962** : élection du président au **suffrage universel direct** (référendum).
- **1974** : saisine du Conseil constitutionnel par 60 députés ou sénateurs ; majorité à **18 ans**.
- **1981** : première **alternance** à gauche (**François Mitterrand**) ; **1986** : première **cohabitation**.
- **2000** : **quinquennat** ; **2008** : réforme qui renforce le Parlement et crée la question prioritaire de constitutionnalité.

## Les transformations de la société
| Domaine | Évolutions |
| **Démographie** | **Baby-boom** (1946-1974), allongement de l’espérance de vie, vieillissement |
| **Immigration** | Main-d’œuvre des Trente Glorieuses (Italie, Espagne, Portugal, Maghreb) ; regroupement familial (1976) |
| **Place des femmes** | Travail salarié, **contraception** (loi Neuwirth, 1967), **IVG** (loi Veil, 1975), **parité** (1999-2000) |
| **Code civil** | **Autorité parentale** partagée (1970), divorce par consentement mutuel (1975), **PACS** (1999), **mariage pour tous** (2013) |

## La puissance française
La France reste une puissance moyenne d’influence mondiale : membre permanent du **Conseil de sécurité** de l’ONU, **puissance nucléaire** (1960), moteur de la construction européenne (couple franco-allemand), présente sur tous les océans grâce aux outre-mer.

> La démocratie française s’est transformée : des institutions plus stables, des droits nouveaux pour les personnes, une société plus diverse.

## Repères à retenir
| Repère | Date |
| Vote des femmes | 1944-1945 |
| Sécurité sociale | 1945 |
| Constitution de la Ve République | 1958 |
| Élection du président au suffrage universel | 1962 |
| Loi Veil | 1975 |
| Première alternance | 1981 |

**Notions** : régime politique, démocratie, République, institutions, décolonisation, immigration, puissance, parité.`,
          },
          questions: [
            ['Quand les Françaises votent-elles pour la première fois ?', ['En 1936', 'En 1945', 'En 1958', 'En 1968'], 1, 'Le droit est accordé par l’ordonnance d’avril 1944 ; premier vote aux municipales d’avril 1945.'],
            ['Quelle grande institution sociale est créée en 1945 ?', ['La Sécurité sociale', 'Le RSA', 'Pôle emploi', 'Le SMIC'], 0, 'Elle protège les travailleurs contre la maladie, les accidents et la vieillesse.'],
            ['Pourquoi la IVe République est-elle jugée instable ?', ['Parce qu’elle n’a pas de parlement', 'Parce que le président a trop de pouvoir', 'Parce que les gouvernements tombent très souvent', 'Parce qu’elle dure 50 ans'], 2, 'Plus de vingt gouvernements se succèdent en douze ans.'],
            ['Quelle guerre fait tomber la IVe République en 1958 ?', ['La guerre d’Indochine', 'La guerre de Corée', 'La guerre du Golfe', 'La guerre d’Algérie'], 3, 'La crise du 13 mai 1958 à Alger ramène de Gaulle au pouvoir.'],
            ['Depuis 1962, comment le président de la République est-il élu ?', ['Par le Parlement', 'Au suffrage universel direct', 'Par les maires', 'Par le Conseil constitutionnel'], 1, 'La réforme de 1962, adoptée par référendum, renforce la légitimité du président.'],
            ['Qu’est-ce qu’une cohabitation ?', ['Un président et un Premier ministre de camps politiques opposés', 'Deux présidents en même temps', 'Une union entre deux partis', 'Un gouvernement sans ministres'], 0, 'La première a lieu en 1986 : Mitterrand (gauche) et Chirac (droite).'],
            ['La loi Veil de 1975 légalise l’interruption volontaire de grossesse.', ['Vrai', 'Faux'], 0, 'Portée par la ministre Simone Veil, elle est une étape majeure des droits des femmes.'],
            ['Pourquoi la France a-t-elle fait appel à l’immigration pendant les Trente Glorieuses ?', ['Pour peupler les colonies', 'Pour le service militaire', 'Pour fournir de la main-d’œuvre à une économie en forte croissance', 'Pour des raisons touristiques'], 2, 'Travailleurs italiens, espagnols, portugais et maghrébins construisent routes, logements et usines.'],
            ['Quelle loi de 2000 favorise l’égal accès des femmes et des hommes aux mandats électoraux ?', ['La loi sur le PACS', 'La loi sur la parité', 'La loi Neuwirth', 'La loi Veil'], 1, 'Elle impose des listes paritaires à certaines élections.'],
            ['En quelle année le mariage est-il ouvert aux couples de même sexe ?', ['1999', '1975', '2020', '2013'], 3, 'La loi de 2013 fait évoluer le Code civil ; le PACS existait depuis 1999.'],
            ['Le quinquennat a remplacé le septennat présidentiel en 1981.', ['Vrai', 'Faux'], 1, 'Le quinquennat est adopté par référendum en 2000 et s’applique à partir de 2002.'],
            ['Quel atout fait de la France une puissance d’influence mondiale ?', ['Son siège permanent au Conseil de sécurité de l’ONU', 'Sa population, la plus nombreuse d’Europe', 'Son empire colonial actuel', 'Sa monnaie nationale, le franc'], 0, 'Elle est aussi puissance nucléaire et moteur de l’Union européenne.'],
          ],
        },
        {
          titre: 'La guerre d’Algérie',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Une guerre de huit ans, deux mémoires blessées',
            cours: `De **1954 à 1962**, l’Algérie est le théâtre d’une guerre entre les nationalistes algériens et la France. Longtemps appelée « **événements** », elle n’est officiellement reconnue comme une **guerre** par la France qu’en **1999**. Elle a des conséquences politiques et humaines durables, en Algérie comme en France.

## Une situation particulière
- Conquise à partir de **1830**, l’Algérie est formée de **départements français**. Environ **un million d’Européens** (les « pieds-noirs ») y vivent à côté d’environ **8 à 9 millions d’Algériens musulmans**, qui n’ont pas les mêmes droits.
- Le **8 mai 1945**, à **Sétif** et Guelma, des manifestations nationalistes sont suivies d’une répression très meurtrière (plusieurs milliers de morts).

## Les mouvements indépendantistes
| Mouvement | Rôle |
| **FLN** (Front de libération nationale) et **ALN** (son armée) | Lancent l’insurrection le **1er novembre 1954** (« Toussaint rouge ») |
| **MNA** de Messali Hadj | Nationaliste rival, en lutte violente avec le FLN |
| **GPRA** (1958) | Gouvernement provisoire créé par le FLN, qui négocie avec la France |

## Une guerre sans nom
1. La France envoie les **appelés du contingent** : environ **1,5 million** de jeunes Français servent en Algérie.
2. **Bataille d’Alger (1957)** : les parachutistes du général Massu démantèlent le FLN à Alger, en pratiquant la **torture**, dénoncée par des intellectuels et des journaux.
3. Les deux camps commettent des **attentats** et des violences contre les civils.
4. Des « **harkis** », Algériens musulmans, servent dans l’armée française comme supplétifs.

> La guerre d’Algérie mêle guerre de libération, guerre civile entre Algériens et violences contre les civils des deux côtés.

## La crise de 1958 et la marche vers l’indépendance
@ 13 mai 1958 — Émeute à Alger : les partisans de l’Algérie française réclament de Gaulle
@ 1959 — De Gaulle reconnaît le droit des Algériens à l’autodétermination
@ Avril 1961 — Putsch des généraux à Alger, qui échoue
@ 1961-1962 — L’OAS (Organisation de l’armée secrète) multiplie les attentats
@ 17 octobre 1961 — Une manifestation d’Algériens à Paris est violemment réprimée par la police
@ 18 mars 1962 — Accords d’Évian : cessez-le-feu le 19 mars
@ 1er juillet 1962 — Référendum : 99,7 % pour l’indépendance
@ 5 juillet 1962 — Indépendance de l’Algérie

## Les conséquences humaines et politiques
- Un bilan lourd : plusieurs centaines de milliers de morts algériens (les estimations varient fortement), environ **25 000 soldats français**, plusieurs milliers de civils européens.
- Environ **800 000 pieds-noirs** quittent l’Algérie pour la métropole en 1962 : ce sont les **rapatriés**.
- Beaucoup de **harkis** sont massacrés après l’indépendance ; une partie seulement est accueillie en France, souvent dans des camps.
- En France, la guerre a fait tomber la IVe République et fondé la Ve. En Algérie, le FLN devient parti unique.
- Les **mémoires** restent conflictuelles (appelés, pieds-noirs, harkis, immigrés algériens) ; la France reconnaît progressivement la torture et les violences (rapport Stora, 2021).

## Repères à retenir
| Repère | Date |
| Toussaint rouge | 1er novembre 1954 |
| Bataille d’Alger | 1957 |
| Retour de de Gaulle | mai-juin 1958 |
| Accords d’Évian | 18 mars 1962 |
| Indépendance | 5 juillet 1962 |`,
          },
          questions: [
            ['Quand commence la guerre d’Algérie ?', ['Le 8 mai 1945', 'Le 1er novembre 1954', 'Le 13 mai 1958', 'Le 18 mars 1962'], 1, 'Le FLN lance une série d’attentats : c’est la « Toussaint rouge ».'],
            ['Quel était le statut de l’Algérie avant 1962 ?', ['Un protectorat', 'Un État indépendant', 'Un ensemble de départements français', 'Un territoire ottoman'], 2, 'Cette situation particulière explique que la France ait refusé longtemps de parler de guerre.'],
            ['Quel mouvement lance l’insurrection de 1954 ?', ['Le FLN', 'L’OAS', 'Le MNA', 'Le GPRA'], 0, 'Le Front de libération nationale et son armée, l’ALN, mènent la lutte armée.'],
            ['Qui sont les appelés du contingent ?', ['Des soldats professionnels', 'Des Algériens engagés dans l’armée française', 'Des militants du FLN', 'Des jeunes Français effectuant leur service militaire en Algérie'], 3, 'Environ 1,5 million de jeunes hommes servent en Algérie.'],
            ['Quelle pratique de l’armée française pendant la bataille d’Alger est dénoncée ?', ['La torture', 'Le bombardement atomique', 'L’usage des gaz', 'La conscription des femmes'], 0, 'Utilisée pour obtenir des renseignements, elle est dénoncée par des intellectuels et des journalistes.'],
            ['Qui sont les harkis ?', ['Des colons européens', 'Des Algériens musulmans ayant servi comme supplétifs dans l’armée française', 'Des soldats de l’ALN', 'Des généraux putschistes'], 1, 'Beaucoup sont massacrés après l’indépendance ; une partie est accueillie en France.'],
            ['Quelle organisation multiplie les attentats pour empêcher l’indépendance ?', ['Le FLN', 'L’ONU', 'L’OAS', 'Le GPRA'], 2, 'L’Organisation de l’armée secrète frappe en Algérie et en métropole en 1961-1962.'],
            ['Les accords d’Évian sont signés le 18 mars 1962.', ['Vrai', 'Faux'], 0, 'Ils prévoient un cessez-le-feu le 19 mars et un référendum d’autodétermination.'],
            ['Combien de pieds-noirs quittent l’Algérie en 1962 ?', ['Environ 8 000', 'Environ 80 000', 'Environ 8 millions', 'Environ 800 000'], 3, 'Ces rapatriés arrivent souvent dans l’urgence en métropole.'],
            ['Quelle conséquence politique la guerre a-t-elle en France ?', ['Le retour de la monarchie', 'La chute de la IVe République et la naissance de la Ve', 'La fin du suffrage universel', 'Le départ de la France de l’ONU'], 1, 'La crise du 13 mai 1958 ramène de Gaulle, qui fait adopter une nouvelle constitution.'],
            ['La France a officiellement reconnu l’expression « guerre d’Algérie » dès 1954.', ['Vrai', 'Faux'], 1, 'Il faut attendre une loi de 1999 ; on parlait avant d’« événements » ou d’« opérations de maintien de l’ordre ».'],
            ['Quand l’Algérie devient-elle indépendante ?', ['Le 5 juillet 1962', 'Le 1er novembre 1954', 'Le 19 mars 1962', 'Le 13 mai 1958'], 0, 'L’indépendance est proclamée après le référendum du 1er juillet 1962.'],
          ],
        },
        {
          titre: 'L’évolution de la place et des droits des femmes dans la société française',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Depuis 1944, la conquête de l’égalité des droits',
            cours: `En 1944, les Françaises ne votent pas et une femme mariée ne peut pas ouvrir seule un compte en banque. Depuis, par leurs combats et grâce à des changements de mentalités, les femmes ont conquis une **égalité de droits** avec les hommes, inscrite dans le **droit positif** (Constitution, Code civil, Code du travail). L’égalité **réelle** reste pourtant inachevée.

## Les droits politiques
@ 21 avril 1944 — Ordonnance donnant aux femmes le droit de vote et d’éligibilité
@ 29 avril 1945 — Premier vote des femmes (élections municipales)
@ 1946 — Le préambule de la Constitution garantit l’égalité femmes-hommes dans tous les domaines
@ 1991 — Édith Cresson, première femme Première ministre
@ 1999-2000 — Révision constitutionnelle et loi sur la parité en politique

## Les droits civils : l’évolution du Code civil
| Loi | Date | Ce qu’elle change |
| Réforme des régimes matrimoniaux | **1965** | Une femme mariée peut exercer un métier et ouvrir un compte bancaire sans l’autorisation de son mari |
| **Autorité parentale** | **1970** | Elle remplace la « puissance paternelle » : les deux parents décident ensemble |
| **Divorce par consentement mutuel** | **1975** | Le divorce n’est plus seulement une sanction d’une faute |

## Disposer de son corps
- **1967** : la **loi Neuwirth** autorise la **contraception** (la pilule).
- **1971** : le « **manifeste des 343** » : des femmes déclarent avoir avorté, alors que c’est un délit.
- **1972** : procès de **Bobigny**, où l’avocate **Gisèle Halimi** défend une jeune fille poursuivie pour avortement.
- **1975** : la **loi Veil** légalise l’**interruption volontaire de grossesse** (IVG), défendue par la ministre **Simone Veil** face à une Assemblée presque entièrement masculine.
- **2024** : la liberté de recourir à l’IVG est inscrite dans la **Constitution**.

> Ces droits sont le fruit de **combats** : mouvements féministes (MLF, 1970), avocates, femmes politiques, mais aussi évolution des mentalités.

## Le travail et l’égalité professionnelle
- Les femmes entrent massivement dans le salariat : environ **48 %** des actifs sont aujourd’hui des femmes.
- **1972** : principe « à travail égal, salaire égal » ; **1983** : **loi Roudy** sur l’égalité professionnelle.
- Elles restent moins payées (écart de salaire d’environ **14 %** à temps de travail égal en équivalent temps plein au milieu des années 2020, **plus de 20 %** tous temps de travail confondus), plus souvent à temps partiel et peu nombreuses aux postes de direction (« **plafond de verre** »).

## Des combats d’aujourd’hui
- Lutte contre les **violences faites aux femmes** : le viol est reconnu comme crime (loi de 1980) ; mouvement **#MeToo** (2017) ; lutte contre les **féminicides**.
- Partage des tâches domestiques, encore très inégal.

## Repères à retenir
| Repère | Date |
| Droit de vote des femmes | 1944 |
| Travail et compte bancaire sans autorisation du mari | 1965 |
| Loi Neuwirth | 1967 |
| Autorité parentale | 1970 |
| Loi Veil | 1975 |
| Parité | 2000 |
| IVG dans la Constitution | 2024 |`,
          },
          questions: [
            ['Quand les femmes obtiennent-elles le droit de vote en France ?', ['En 1918', 'En 1944', 'En 1968', 'En 1975'], 1, 'L’ordonnance du 21 avril 1944 leur donne le droit de vote et d’éligibilité.'],
            ['Que permet la réforme de 1965 aux femmes mariées ?', ['Voter', 'Divorcer', 'Travailler et ouvrir un compte bancaire sans l’autorisation de leur mari', 'Avorter'], 2, 'Avant 1965, le mari pouvait s’opposer à ce que sa femme exerce un métier.'],
            ['Que remplace l’autorité parentale en 1970 ?', ['La puissance paternelle', 'Le mariage', 'Le divorce', 'Le PACS'], 0, 'Désormais, les deux parents exercent ensemble l’autorité sur leurs enfants.'],
            ['Quelle loi autorise la contraception en 1967 ?', ['La loi Veil', 'La loi Roudy', 'La loi sur la parité', 'La loi Neuwirth'], 3, 'Portée par le député Lucien Neuwirth, elle autorise notamment la pilule.'],
            ['Qui défend la loi légalisant l’IVG en 1975 ?', ['Gisèle Halimi', 'Simone Veil', 'Édith Cresson', 'Simone de Beauvoir'], 1, 'Ministre de la Santé, elle affronte une Assemblée presque entièrement masculine.'],
            ['Quelle avocate défend une jeune fille poursuivie pour avortement au procès de Bobigny ?', ['Gisèle Halimi', 'Simone Veil', 'Yvette Roudy', 'Olympe de Gouges'], 0, 'Le procès de 1972 prépare la légalisation de l’IVG.'],
            ['En 2024, la liberté de recourir à l’IVG a été inscrite dans la Constitution.', ['Vrai', 'Faux'], 0, 'La France est devenue le premier pays à le faire.'],
            ['Quel est l’objectif de la loi sur la parité de 2000 ?', ['Interdire le divorce', 'Favoriser l’égal accès des femmes et des hommes aux mandats électoraux', 'Supprimer le vote des femmes', 'Créer l’autorité parentale'], 1, 'Elle impose des listes paritaires à certaines élections.'],
            ['Qui est la première femme Première ministre en France ?', ['Élisabeth Borne', 'Simone Veil', 'Édith Cresson', 'Ségolène Royal'], 2, 'Elle est nommée par François Mitterrand en 1991.'],
            ['Que désigne le « plafond de verre » ?', ['Une loi sur le logement', 'Un type de bâtiment', 'Un salaire minimum', 'L’obstacle invisible qui freine l’accès des femmes aux postes de direction'], 3, 'Les femmes restent minoritaires dans les directions d’entreprise.'],
            ['Aujourd’hui, les salaires des femmes et des hommes sont parfaitement égaux en France.', ['Vrai', 'Faux'], 1, 'Un écart persiste, lié au temps partiel, aux métiers exercés et aux discriminations.'],
            ['Quelle loi de 1983 porte sur l’égalité professionnelle ?', ['La loi Roudy', 'La loi Neuwirth', 'La loi Veil', 'La loi Ferry'], 0, 'Portée par la ministre des Droits de la femme Yvette Roudy, elle interdit les discriminations professionnelles.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 1
        // ===================================================================
        {
          titre: 'Mers et océans : vecteurs essentiels de la mondialisation',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Routes, ports et détroits : l’océan au cœur des échanges',
            cours: `Les mers et les océans couvrent environ **71 %** de la surface de la Terre. Ils fournissent des **ressources** et portent l’essentiel des **échanges** : environ **80 %** du commerce mondial en volume voyage par la mer. On parle de **maritimisation** des économies.

## Les notions à maîtriser
| Notion | Définition |
| **Mondialisation** | Mise en relation croissante des territoires et des sociétés à l’échelle mondiale par les flux |
| **Maritimisation** | Poids croissant des activités et des échanges maritimes dans l’économie mondiale |
| **Route maritime** | Itinéraire emprunté régulièrement par les navires entre deux régions |
| **Canaux et détroits internationaux** | Passages étroits (naturels ou creusés) où se concentrent les navires : Malacca, Ormuz, Gibraltar, Suez, Panama |

## Des ressources convoitées
1. **Halieutiques** : la pêche et l’aquaculture fournissent une grande part des protéines consommées dans le monde (Chine, Indonésie, Pérou).
2. **Énergétiques** : environ un tiers du pétrole est extrait en mer (golfe de Guinée, mer du Nord, golfe du Mexique, Brésil) ; éolien en mer.
3. **Biochimiques et minérales** : molécules pour la pharmacie, nodules polymétalliques des grands fonds.
Le droit de la mer (convention de **Montego Bay**, 1982) donne à chaque État une **zone économique exclusive** (ZEE) de 200 milles marins, où il exploite seul les ressources.

## Des routes maritimes concentrées
- La **conteneurisation** (le conteneur, inventé en 1956) a fait baisser le coût du transport : les porte-conteneurs géants transportent plus de 24 000 conteneurs (EVP).
- Les grandes routes relient les trois pôles de la **Triade** élargie : la route **Asie-Europe** par Malacca et **Suez**, la route **transpacifique**, la route **transatlantique**.
- Les **ports** sont concentrés : sur les dix premiers ports à conteneurs, sept sont chinois (Shanghai, Ningbo, Shenzhen…), avec Singapour, Busan et Rotterdam dans les premiers rangs mondiaux.

> Les échanges maritimes sont **mondiaux**, mais **concentrés** : quelques routes, quelques ports et quelques passages portent l’essentiel des flux.

## Des passages stratégiques et vulnérables
| Passage | Enjeu |
| **Détroit de Malacca** | Environ un tiers du commerce mondial |
| **Détroit d’Ormuz** | Environ un cinquième du pétrole mondial |
| **Canal de Suez** | Environ 12 % du commerce mondial ; bloqué par l’*Ever Given* en 2021 ; trafic détourné en 2024 par les attaques des Houthis en mer Rouge |
| **Canal de Panama** | Relie Atlantique et Pacifique ; ralenti par la sécheresse en 2023 |

Piraterie (golfe d’Aden, golfe de Guinée), rivalités de puissance (mer de Chine méridionale) et changement climatique (ouverture des routes arctiques) accroissent les enjeux **géostratégiques**.

## Des territoires inégalement intégrés
Les grandes **façades maritimes** (Asie de l’Est, Northern Range, Nord-Est américain) concentrent les flux ; d’autres littoraux (Afrique de l’Ouest, îles du Pacifique) restent en marge.

## Le croquis en mots
Sur un planisphère centré sur l’Atlantique : trois façades maritimes majeures (Asie de l’Est, Europe du Nord-Ouest, Amérique du Nord) reliées par des routes épaisses ; la route Asie-Europe passe par **Malacca**, l’océan Indien, **Bab-el-Mandeb**, la mer Rouge et **Suez** ; au centre de l’Amérique, **Panama**. Des symboles signalent les zones de piraterie et les tensions en mer de Chine.

## Repères à retenir
| Repère | Donnée |
| Surface océanique | environ 71 % du globe |
| Part du commerce mondial par mer | environ 80 % en volume |
| ZEE | 200 milles marins (Montego Bay, 1982) |
| Premier port à conteneurs | Shanghai |`,
          },
          questions: [
            ['Quelle part du commerce mondial, en volume, passe par la mer ?', ['Environ 20 %', 'Environ 50 %', 'Environ 80 %', 'Environ 99 %'], 2, 'Le transport maritime est le plus économique pour de grandes quantités.'],
            ['Qu’est-ce que la maritimisation ?', ['La montée du niveau de la mer', 'Le poids croissant des activités et échanges maritimes dans l’économie', 'La pollution des océans', 'La construction de navires de guerre'], 1, 'Elle est l’un des moteurs de la mondialisation.'],
            ['Quelle invention de 1956 a révolutionné le transport maritime ?', ['Le conteneur', 'Le moteur à vapeur', 'Le GPS', 'Le pétrolier'], 0, 'Standardisé, il permet de charger et décharger rapidement et à bas coût.'],
            ['Qu’est-ce qu’une zone économique exclusive (ZEE) ?', ['Une zone franche portuaire', 'Une zone interdite à la navigation', 'Une zone de pêche internationale', 'Un espace maritime de 200 milles où un État exploite seul les ressources'], 3, 'Elle est définie par la convention de Montego Bay (1982).'],
            ['Quel détroit voit passer environ un cinquième du pétrole mondial ?', ['Gibraltar', 'Le Bosphore', 'Ormuz', 'Le pas de Calais'], 2, 'À la sortie du golfe Persique, il est très sensible aux tensions avec l’Iran.'],
            ['Quel navire a bloqué le canal de Suez en 2021 ?', ['Le Titanic', 'L’Ever Given', 'Le Queen Mary 2', 'Le Charles-de-Gaulle'], 1, 'Ce porte-conteneurs échoué a bloqué le canal six jours, montrant sa vulnérabilité.'],
            ['Sept des dix premiers ports à conteneurs du monde sont chinois.', ['Vrai', 'Faux'], 0, 'Shanghai, Ningbo-Zhoushan, Shenzhen, Qingdao, Canton, Tianjin, Xiamen : la Chine domine le classement.'],
            ['Quelle route maritime passe par Malacca et Suez ?', ['La route transatlantique', 'La route transpacifique', 'La route arctique', 'La route Asie-Europe'], 3, 'C’est l’une des routes les plus fréquentées du monde.'],
            ['Où la piraterie maritime est-elle particulièrement active ?', ['En mer Baltique', 'Dans le golfe de Guinée et le golfe d’Aden', 'En Méditerranée occidentale', 'Dans les Grands Lacs'], 1, 'Elle menace les navires et justifie des opérations navales internationales.'],
            ['Pourquoi le trafic du canal de Suez a-t-il chuté en 2024 ?', ['À cause d’une sécheresse', 'À cause des attaques des Houthis en mer Rouge', 'À cause de sa fermeture définitive', 'À cause d’un nouveau canal'], 1, 'De nombreux navires ont contourné l’Afrique par le cap de Bonne-Espérance.'],
            ['Les échanges maritimes sont répartis de façon égale entre tous les littoraux du monde.', ['Vrai', 'Faux'], 1, 'Ils se concentrent sur quelques façades ; d’autres littoraux restent en marge.'],
            ['Quelle ressource est extraite en mer, notamment dans le golfe de Guinée ?', ['Le pétrole', 'Le charbon', 'L’uranium', 'Le cuivre'], 0, 'Environ un tiers du pétrole mondial provient de gisements offshore.'],
          ],
        },
        {
          titre: 'Les réseaux de câbles sous-marins : des infrastructures essentielles de la mondialisation',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Internet passe sous la mer',
            cours: `On imagine qu’Internet passe par les satellites. En réalité, plus de **95 %** des communications intercontinentales (Internet, téléphone, transactions financières) passent par des **câbles sous-marins** en fibre optique posés au fond des océans. Ces infrastructures sont **essentielles** à la mondialisation, et **vulnérables**.

## Un réseau mondial
- On compte environ **550 câbles** en service ou en projet, pour environ **1,4 million de km** au total.
- Un câble a le diamètre d’un tuyau d’arrosage au fond de l’océan ; il est renforcé près des côtes.
- La fibre optique transporte la lumière : un seul câble moderne peut faire passer plusieurs centaines de térabits par seconde.
- Le premier câble télégraphique transatlantique date de **1858** ; le premier câble à fibre optique transatlantique (TAT-8) de **1988**.

## Les acteurs
| Acteur | Rôle |
| **Opérateurs de télécommunications** | Orange, AT&T, China Telecom : longtemps les principaux propriétaires |
| **Géants du numérique** (GAFAM) | Google, Meta, Microsoft, Amazon financent aujourd’hui une grande part des nouveaux câbles |
| **Poseurs de câbles** | Trois grands industriels : **Alcatel Submarine Networks** (France), SubCom (États-Unis), NEC (Japon) ; le chinois HMN Tech monte en puissance |
| **États** | Autorisent les atterrages, protègent les câbles, les surveillent |

> Les câbles reflètent la hiérarchie du monde : ils sont **nombreux** entre l’Amérique du Nord, l’Europe et l’Asie de l’Est, **rares** vers l’Afrique ou les petites îles.

## Des points stratégiques : les atterrages
Le point où un câble sort de la mer est un **point d’atterrage** : c’est là que le réseau est le plus **vulnérable**. Certains lieux concentrent de nombreux câbles :
- **Marseille**, carrefour entre l’Europe, l’Afrique, le Moyen-Orient et l’Asie (plus de quinze câbles) ;
- la côte de Bretagne et de Cornouailles pour l’Atlantique ;
- Singapour, l’Égypte (passage vers la mer Rouge), New York.

## Des infrastructures vulnérables
1. **Accidents** : ancres et chaluts causent la plupart des ruptures (environ 150 à 200 incidents par an), réparés par des navires câbliers.
2. **Catastrophes naturelles** : séismes, glissements sous-marins (Taïwan, 2006 ; Tonga, 2022, où l’archipel est resté coupé du monde plusieurs semaines).
3. **Sabotages et espionnage** : câbles coupés en mer Baltique (2023-2024) et en mer Rouge (2024) ; écoutes par les services de renseignement.
Les États renforcent donc la **surveillance** des fonds marins (la France adopte une stratégie de maîtrise des fonds marins en 2022).

## Une inégale insertion dans la mondialisation
Certains pays ne dépendent que d’un ou deux câbles : une coupure les isole. L’Afrique, longtemps mal reliée, voit arriver de nouveaux câbles (2Africa, projet de Meta, environ 45 000 km autour du continent).

## Le croquis en mots
Sur un planisphère : un faisceau très dense de lignes entre l’Amérique du Nord et l’Europe, et entre l’Amérique du Nord et l’Asie par le Pacifique ; une route Europe-Asie qui passe par la Méditerranée, **Marseille**, l’Égypte, la mer Rouge et Singapour ; quelques lignes seulement vers l’Afrique, l’Amérique du Sud et les îles du Pacifique.

## Repères à retenir
| Repère | Donnée |
| Part des communications intercontinentales | plus de 95 % |
| Nombre de câbles | environ 550 |
| Premier câble transatlantique | 1858 |
| Grand point d’atterrage français | Marseille |`,
          },
          questions: [
            ['Quelle part des communications intercontinentales passe par des câbles sous-marins ?', ['Environ 10 %', 'Environ 50 %', 'Plus de 95 %', 'Aucune, tout passe par satellite'], 2, 'Les satellites ne transportent qu’une petite part du trafic.'],
            ['En quoi sont faits les câbles sous-marins modernes ?', ['En cuivre', 'En fibre optique', 'En plastique simple', 'En acier uniquement'], 1, 'La fibre transporte la lumière et des débits énormes.'],
            ['Qu’est-ce qu’un point d’atterrage ?', ['Le lieu où un câble sort de la mer et rejoint la terre', 'Un aéroport', 'Un port de pêche', 'Un satellite'], 0, 'C’est un point stratégique et vulnérable du réseau.'],
            ['Quelle ville française est un grand carrefour de câbles sous-marins ?', ['Lyon', 'Strasbourg', 'Paris', 'Marseille'], 3, 'Plus de quinze câbles y relient l’Europe à l’Afrique, au Moyen-Orient et à l’Asie.'],
            ['Qui finance aujourd’hui une grande part des nouveaux câbles ?', ['Les géants du numérique comme Google ou Meta', 'L’ONU', 'Les compagnies aériennes', 'Les agriculteurs'], 0, 'Ils ont besoin d’énormes capacités pour leurs services et centres de données.'],
            ['Quelle est la principale cause des ruptures de câbles ?', ['Les requins', 'Les ancres et les chaluts', 'Le froid', 'Les satellites'], 1, 'Les activités humaines accidentelles causent la plupart des incidents.'],
            ['Quel archipel a été coupé du monde après une éruption volcanique en 2022 ?', ['Hawaï', 'Les Canaries', 'Tonga', 'Les Açores'], 2, 'L’éruption et le tsunami ont rompu son unique câble international.'],
            ['Une entreprise française figure parmi les grands poseurs de câbles sous-marins.', ['Vrai', 'Faux'], 0, 'Alcatel Submarine Networks est l’un des trois leaders mondiaux avec SubCom et NEC.'],
            ['Pourquoi les câbles sont-ils des enjeux stratégiques pour les États ?', ['Parce qu’ils produisent de l’électricité', 'Parce qu’ils peuvent être sabotés ou espionnés', 'Parce qu’ils transportent du pétrole', 'Parce qu’ils servent à la pêche'], 1, 'Des câbles ont été coupés en mer Baltique et en mer Rouge ; les États surveillent les fonds marins.'],
            ['De quand date le premier câble télégraphique transatlantique ?', ['1988', '1945', '1914', '1858'], 3, 'Le premier câble à fibre optique transatlantique date de 1988.'],
            ['Tous les pays du monde sont reliés par de nombreux câbles.', ['Vrai', 'Faux'], 1, 'Certains pays ou îles ne dépendent que d’un ou deux câbles : le réseau reflète une insertion inégale.'],
            ['Entre quels espaces les câbles sont-ils les plus nombreux ?', ['Afrique et Amérique du Sud', 'Amérique du Nord, Europe et Asie de l’Est', 'Océanie et Antarctique', 'Asie centrale et Afrique'], 1, 'Ce sont les pôles majeurs de la mondialisation.'],
          ],
        },
        {
          titre: 'Le détroit de Malacca : un point de passage majeur et stratégique',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Malacca, le goulet de l’Asie',
            cours: `Entre la péninsule malaise et l’île indonésienne de **Sumatra**, le **détroit de Malacca** relie l’**océan Indien** à la **mer de Chine méridionale**. Long d’environ **800 km**, il ne mesure qu’environ **2,8 km** de large à son point le plus étroit, près de Singapour. Près du **tiers du commerce mondial** l’emprunte.

## Un passage majeur
- Environ **90 000 navires** par an y passent (années 2020), soit plus de 200 par jour.
- Il voit passer une grande part du **pétrole** importé par la Chine, le Japon et la Corée du Sud, venu du golfe Persique.
- Le détroit est **saturé** : risques de collision, profondeur limitée (environ 25 m par endroits), qui interdit le passage des plus gros pétroliers (ils passent par le détroit de Lombok).

## De grands ports sur ses rives
| Port | Pays | Rôle |
| **Singapour** | Singapour | Deuxième port à conteneurs du monde, grand port de transbordement et de soutage (ravitaillement en carburant) |
| **Port Klang** | Malaisie | Grand port à conteneurs, desservant Kuala Lumpur |
| **Tanjung Pelepas** | Malaisie | Port de transbordement concurrent de Singapour |

> Malacca est un **goulet d’étranglement** : si le passage était bloqué, une grande partie du commerce et de l’énergie de l’Asie de l’Est serait paralysée.

## Des menaces et des coopérations
1. **La piraterie** : au début des années 2000, Malacca était l’une des zones les plus touchées au monde.
2. **Les coopérations** : l’Indonésie, la Malaisie et Singapour (rejoints par la Thaïlande) organisent des patrouilles communes (**Malacca Strait Patrols**, depuis 2004), avec le soutien du Japon et des États-Unis ; l’accord régional **ReCAAP** (2006) partage les informations. La piraterie a fortement reculé, mais les vols à bord persistent.
3. **La pollution** : marées noires, fumées des incendies de forêt à Sumatra.

## Des stratégies d’influence rivales
- **La Chine** redoute le « **dilemme de Malacca** » : en cas de conflit, les États-Unis pourraient bloquer le détroit et couper ses approvisionnements. Elle développe des routes de contournement (oléoducs à travers la **Birmanie**, ports du **Pakistan** avec Gwadar) dans le cadre des **nouvelles routes de la soie** et renforce sa marine.
- **Les États-Unis** maintiennent une présence navale (7e flotte, base logistique à Singapour) pour garantir la liberté de navigation.
- **L’Inde** surveille l’entrée ouest du détroit depuis les îles **Andaman-et-Nicobar**.
- Le détroit se trouve au contact de la **mer de Chine méridionale**, où la Chine revendique la quasi-totalité des eaux contre ses voisins.

## Le croquis en mots
Une carte de l’Asie du Sud-Est : entre la péninsule malaise au nord-est et Sumatra au sud-ouest, le long couloir du détroit, de l’océan Indien (au nord-ouest, près des îles Andaman) jusqu’à **Singapour** (au sud-est). Au-delà, la mer de Chine méridionale. Sur les rives, les ports de Singapour, Port Klang et Tanjung Pelepas ; des flèches épaisses de pétroliers et porte-conteneurs entre le golfe Persique et l’Asie de l’Est ; plus au sud, les détroits de secours de la Sonde et de Lombok.

## Repères à retenir
| Repère | Donnée |
| Longueur | environ 800 km |
| Largeur minimale | environ 2,8 km |
| Part du commerce mondial | près d’un tiers |
| Navires par an | environ 90 000 |`,
          },
          questions: [
            ['Quels espaces maritimes le détroit de Malacca relie-t-il ?', ['L’Atlantique et le Pacifique', 'L’océan Indien et la mer de Chine méridionale', 'La Méditerranée et la mer Rouge', 'La mer Noire et la Méditerranée'], 1, 'Il est le passage le plus court entre l’océan Indien et le Pacifique.'],
            ['Entre quelles terres se trouve le détroit ?', ['La péninsule malaise et Sumatra', 'Java et Bornéo', 'Taïwan et la Chine', 'L’Inde et le Sri Lanka'], 0, 'La Malaisie est au nord-est, l’Indonésie (Sumatra) au sud-ouest.'],
            ['Quelle part du commerce mondial passe par Malacca ?', ['Environ 5 %', 'Environ 60 %', 'Environ 1 %', 'Près d’un tiers'], 3, 'C’est l’un des passages les plus fréquentés au monde.'],
            ['Quel grand port se situe à l’extrémité sud-est du détroit ?', ['Hong Kong', 'Shanghai', 'Singapour', 'Djakarta'], 2, 'Deuxième port à conteneurs du monde, c’est un grand port de transbordement.'],
            ['Quelle menace a longtemps touché le détroit de Malacca ?', ['La piraterie', 'Les icebergs', 'Les cyclones polaires', 'Les requins'], 0, 'Au début des années 2000, c’était l’une des zones les plus touchées au monde.'],
            ['Les États riverains organisent des patrouilles communes contre la piraterie.', ['Vrai', 'Faux'], 0, 'Indonésie, Malaisie, Singapour et Thaïlande coopèrent depuis 2004.'],
            ['Qu’appelle-t-on le « dilemme de Malacca » ?', ['Le choix entre deux ports', 'La crainte chinoise d’un blocage du détroit qui couperait ses approvisionnements', 'Un conflit entre pêcheurs', 'Un problème de pollution'], 1, 'La Chine développe des routes de contournement et renforce sa marine.'],
            ['Pourquoi les plus gros pétroliers évitent-ils Malacca ?', ['À cause de la profondeur limitée du détroit', 'À cause de la glace', 'À cause d’un péage trop cher', 'À cause d’une interdiction de l’ONU'], 0, 'Ils passent par le détroit de Lombok, plus profond.'],
            ['Quel pays surveille l’entrée ouest du détroit depuis les îles Andaman-et-Nicobar ?', ['Le Japon', 'La Chine', 'Les États-Unis', 'L’Inde'], 3, 'L’Inde veut peser face à l’influence chinoise dans l’océan Indien.'],
            ['Quelle est la largeur minimale du détroit ?', ['Environ 280 km', 'Environ 28 km', 'Environ 2,8 km', 'Environ 28 m'], 2, 'Près de Singapour, le chenal est très étroit, d’où la saturation.'],
            ['Les nouvelles routes de la soie chinoises cherchent notamment à contourner Malacca.', ['Vrai', 'Faux'], 0, 'Oléoducs à travers la Birmanie et port de Gwadar au Pakistan en sont des exemples.'],
            ['Pourquoi dit-on que Malacca est un goulet d’étranglement ?', ['Parce qu’il est très large', 'Parce qu’il est fermé', 'Parce qu’un passage étroit concentre un trafic énorme dont dépend l’économie asiatique', 'Parce qu’il n’a pas de port'], 2, 'Un blocage paralyserait une grande partie du commerce et de l’énergie de l’Asie de l’Est.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 2
        // ===================================================================
        {
          titre: 'Dynamiques territoriales contrastées au sein de la mondialisation',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'Des territoires connectés, d’autres en marge',
            cours: `Tous les territoires ne profitent pas de la même façon de la mondialisation. Quelle que soit l’échelle — États, régions, métropoles —, l’accès aux flux est **inégal**. La hiérarchie dépend des **décisions publiques** (États, organisations régionales) et des **stratégies des entreprises**.

## Les notions à maîtriser
| Notion | Définition |
| **Centre de décision** | Lieu où se prennent les décisions qui orientent l’économie ou la politique mondiale (sièges de FTN, bourses, organisations internationales) |
| **Métropole** | Grande ville qui concentre les fonctions de commandement |
| **Hub** | Plateforme où convergent et se redistribuent les flux (aéroport, port) |
| **Plateforme multimodale** | Lieu qui relie plusieurs modes de transport (avion, train, route, bateau) |

## Une hiérarchie des territoires
| Type de territoire | Exemples |
| **Centres** de la mondialisation | Les grandes métropoles (New York, Londres, Tokyo, Paris, Shanghai), les façades maritimes |
| **Périphéries intégrées** | Pays émergents et leurs régions littorales (Chine côtière, Mexique du Nord, Inde des métropoles) |
| **Marges** | Pays les moins avancés (Sahel), régions enclavées ou en guerre |

- Les **centres de décision** sont concentrés : environ la moitié des 500 plus grandes firmes mondiales ont leur siège aux États-Unis et en Chine.
- Leur hiérarchie évolue : la montée de l’Asie (Shanghai, Shenzhen, Singapour, Dubaï) concurrence les centres historiques.

## Le rôle des acteurs
1. **Les États** attirent les investissements (zones franches, fiscalité, infrastructures), mais peuvent aussi fermer leurs frontières : **protectionnisme** (droits de douane américains relevés en 2018 puis fortement en 2025), sanctions (contre la Russie depuis 2022).
2. **Les organisations régionales** (Union européenne, ASEAN, ACEUM en Amérique du Nord) facilitent les échanges entre membres.
3. **Les firmes transnationales** choisissent leurs implantations selon le coût du travail, la taille du marché, la qualité des infrastructures ; elles relocalisent parfois une partie de la production (« **nearshoring** » vers le Mexique ou le Maroc).

> Être **connecté** (ports, aéroports, câbles, capitaux) est la condition de l’intégration ; la distance et les barrières restent des facteurs contraignants.

## Des contrastes à toutes les échelles
- **Mondiale** : un fort écart entre le Nord et les pays les moins avancés, dont la part dans le commerce mondial est d’environ 1 %.
- **Nationale** : en Chine, le littoral est plus intégré que l’intérieur ; aux États-Unis, les métropoles côtières plus que certaines régions de la « Rust Belt ».
- **Locale** : à l’intérieur d’une même métropole, des quartiers d’affaires connectés côtoient des quartiers pauvres.

## Le croquis en mots
Sur un planisphère : les trois grands pôles (Amérique du Nord, Europe de l’Ouest, Asie de l’Est) en couleur foncée, avec leurs métropoles mondiales ; les pays émergents en couleur intermédiaire, reliés à ces pôles par des flèches ; les marges (Sahel, Asie centrale, Afrique centrale) en couleur claire. Des symboles signalent les barrières (protectionnisme, sanctions, conflits).

## Repères à retenir
| Repère | Donnée |
| Pôles majeurs | Amérique du Nord, Europe, Asie de l’Est |
| Part des pays les moins avancés dans le commerce mondial | environ 1 % |
| Organisations régionales | UE, ASEAN, ACEUM, Mercosur |`,
          },
          questions: [
            ['Qu’est-ce qu’un centre de décision ?', ['Un bureau de vote', 'Un lieu où se prennent les décisions qui orientent l’économie ou la politique mondiale', 'Un centre commercial', 'Un tribunal'], 1, 'Sièges de firmes, bourses et organisations internationales en sont des exemples.'],
            ['Qu’est-ce qu’un hub ?', ['Une plateforme où convergent et se redistribuent les flux', 'Un quartier résidentiel', 'Une frontière', 'Un satellite'], 0, 'Les grands aéroports et ports fonctionnent comme des hubs.'],
            ['Quelle région fait partie des marges de la mondialisation ?', ['La Northern Range', 'Le Sahel', 'La Mégalopolis américaine', 'Le delta de la rivière des Perles'], 1, 'Enclavement, pauvreté et conflits y limitent l’intégration.'],
            ['Quelle mesure est un exemple de protectionnisme ?', ['La création d’une zone de libre-échange', 'La suppression des douanes', 'La hausse des droits de douane', 'Un nouveau câble sous-marin'], 2, 'Les États-Unis ont relevé leurs droits de douane en 2018 puis fortement en 2025.'],
            ['Qu’est-ce qu’une plateforme multimodale ?', ['Une scène de concert', 'Un réseau social', 'Un lieu qui relie plusieurs modes de transport', 'Un aéroport sans avion'], 2, 'Roissy associe avion, TGV, RER et autoroutes.'],
            ['Les organisations régionales comme l’UE ou l’ASEAN facilitent les échanges entre leurs membres.', ['Vrai', 'Faux'], 0, 'Elles réduisent les barrières et créent de grands marchés.'],
            ['Quelle part du commerce mondial représentent les pays les moins avancés ?', ['Environ 25 %', 'Environ 10 %', 'Environ 50 %', 'Environ 1 %'], 3, 'Ils restent en marge malgré leur population importante.'],
            ['Que désigne le « nearshoring » ?', ['Le rapprochement de la production vers les marchés de consommation', 'La délocalisation vers l’Asie lointaine', 'La fermeture des ports', 'La construction de câbles'], 0, 'Des firmes installent des usines au Mexique ou au Maroc pour être plus près des États-Unis ou de l’Europe.'],
            ['Quels critères guident les implantations des firmes transnationales ?', ['Uniquement le climat', 'Le coût du travail, la taille du marché, les infrastructures', 'La couleur du drapeau', 'Le hasard'], 1, 'Elles cherchent à maximiser leurs profits et l’accès aux marchés.'],
            ['La hiérarchie des centres de décision mondiaux ne change jamais.', ['Vrai', 'Faux'], 1, 'Elle évolue : les métropoles asiatiques concurrencent New York, Londres ou Paris.'],
            ['Quelle région chinoise est la mieux intégrée à la mondialisation ?', ['Le Tibet', 'Le Xinjiang', 'Le littoral', 'La Mongolie-Intérieure'], 2, 'Ports, zones franches et métropoles en font l’interface avec le monde.'],
            ['À quelle échelle observe-t-on des contrastes entre quartiers d’affaires et quartiers pauvres ?', ['Mondiale', 'Continentale', 'Nationale', 'Locale'], 3, 'Les inégalités existent aussi à l’intérieur d’une même métropole.'],
          ],
        },
        {
          titre: 'New York, un centre de la mondialisation',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'New York, ville-monde',
            cours: `**New York** est une métropole de **rang mondial** : environ **8,3 millions** d’habitants dans la ville, plus de **19 millions** dans l’aire métropolitaine. Elle abrite des **fonctions de commandement** qui en font un lieu majeur de la mondialisation, au cœur de la **Mégalopolis** du Nord-Est des États-Unis.

## Un centre économique et financier
- **Wall Street**, à Manhattan : le **New York Stock Exchange** et le **Nasdaq** sont les deux premières bourses du monde par la capitalisation.
- Sièges de grandes banques (JPMorgan Chase, Goldman Sachs, Citigroup), de compagnies d’assurances, de cabinets d’avocats et de conseil.
- De nombreux sièges de **firmes transnationales** (médias, luxe, pharmacie).
- L’aire métropolitaine produit environ **2 000 milliards de dollars** de richesse par an, plus que bien des pays.

## Un centre politique mondial
Depuis **1952**, New York accueille le **siège de l’ONU**, au bord de l’East River : chaque automne, l’**Assemblée générale** réunit les chefs d’État du monde entier. La ville incarne un lieu du **pouvoir politique** et de la **gouvernance mondiale**.

## Un centre culturel
| Domaine | Exemples |
| Musées | **Metropolitan Museum**, **MoMA**, Guggenheim |
| Spectacles | Les théâtres de **Broadway** |
| Médias | New York Times, grands réseaux de télévision, maisons d’édition |
| Universités | Columbia, New York University |
| Tourisme | Plus de **60 millions** de visiteurs par an |

> New York concentre les fonctions **financières**, **politiques** et **culturelles** : c’est ce cumul qui en fait une ville-monde.

## Une ville connectée
- Trois grands aéroports : **JFK**, Newark, LaGuardia.
- Le **port de New York-New Jersey**, l’un des premiers ports à conteneurs des États-Unis.
- Un des principaux nœuds des **câbles sous-marins** transatlantiques.
- Une population **cosmopolite** : plus d’un tiers des New-Yorkais sont nés à l’étranger.

## Des contrastes et des défis
- Le coût du logement est parmi les plus élevés du monde : **gentrification** de Brooklyn, de Harlem ; des dizaines de milliers de personnes sans abri.
- Les inégalités sont très fortes entre Manhattan et certains quartiers du **Bronx**.
- La ville est vulnérable : attentats du **11 septembre 2001**, ouragan **Sandy** (2012), montée du niveau de la mer.
- Elle est concurrencée par Londres, Tokyo, Shanghai, Singapour.

## Le croquis en mots
Au centre, l’île de **Manhattan**, entre l’Hudson et l’East River : au sud, **Wall Street** et le quartier du World Trade Center ; au milieu, **Midtown** (Times Square, Broadway, sièges sociaux) et le **siège de l’ONU** sur l’East River ; au nord, Central Park puis Harlem. Autour, les autres arrondissements (Brooklyn, Queens avec JFK et LaGuardia, le Bronx, Staten Island), et à l’ouest le New Jersey avec Newark et ses terminaux portuaires. Au-delà, la Mégalopolis de Boston à Washington.

## Repères à retenir
| Repère | Donnée |
| Population de la ville | environ 8,3 millions |
| Aire métropolitaine | plus de 19 millions |
| Siège de l’ONU | depuis 1952 |
| Bourses | NYSE et Nasdaq, premières mondiales |`,
          },
          questions: [
            ['Quelle rue de Manhattan symbolise la finance mondiale ?', ['Broadway', 'Wall Street', 'Fifth Avenue', 'Times Square'], 1, 'Elle abrite le New York Stock Exchange, première bourse mondiale.'],
            ['Quelle organisation internationale a son siège à New York ?', ['L’ONU', 'L’OTAN', 'L’Union européenne', 'L’OMC'], 0, 'Le siège, sur l’East River, accueille l’Assemblée générale chaque automne.'],
            ['Combien d’habitants compte l’aire métropolitaine de New York ?', ['Environ 2 millions', 'Environ 8 millions', 'Plus de 19 millions', 'Environ 50 millions'], 2, 'La ville elle-même compte environ 8,3 millions d’habitants.'],
            ['Quelles sont les deux premières bourses du monde ?', ['Londres et Paris', 'Tokyo et Shanghai', 'Francfort et Hong Kong', 'Le NYSE et le Nasdaq'], 3, 'Toutes deux sont à New York.'],
            ['Quel quartier new-yorkais est célèbre pour ses théâtres ?', ['Broadway', 'Harlem', 'Le Bronx', 'Staten Island'], 0, 'Les comédies musicales de Broadway attirent des millions de spectateurs.'],
            ['New York fait partie de la Mégalopolis du Nord-Est des États-Unis.', ['Vrai', 'Faux'], 0, 'Cette mégalopole s’étend de Boston à Washington.'],
            ['Pourquoi dit-on que New York est une ville-monde ?', ['Parce qu’elle est la plus peuplée du monde', 'Parce qu’elle cumule des fonctions financières, politiques et culturelles de rang mondial', 'Parce qu’elle est la capitale des États-Unis', 'Parce qu’elle est la plus ancienne'], 1, 'Washington est la capitale ; New York domine par ses fonctions de commandement.'],
            ['Quel est le principal aéroport international de New York ?', ['Heathrow', 'O’Hare', 'JFK', 'Roissy'], 2, 'New York est desservie par trois grands aéroports : JFK, Newark et LaGuardia.'],
            ['Quelle part des New-Yorkais sont nés à l’étranger ?', ['Aucun', 'Environ 5 %', 'Plus des trois quarts', 'Plus d’un tiers'], 3, 'Cette population cosmopolite reflète l’attractivité mondiale de la ville.'],
            ['Quel ouragan a frappé New York en 2012 ?', ['Katrina', 'Sandy', 'Irma', 'Harvey'], 1, 'Il a inondé une partie de Manhattan et montré la vulnérabilité de la ville.'],
            ['New York n’a aucune concurrente parmi les métropoles mondiales.', ['Vrai', 'Faux'], 1, 'Londres, Tokyo, Shanghai ou Singapour lui disputent des fonctions de commandement.'],
            ['Quel musée new-yorkais est consacré à l’art moderne ?', ['Le MoMA', 'Le Louvre', 'Le British Museum', 'Le Prado'], 0, 'Le Museum of Modern Art est l’un des plus grands musées d’art moderne du monde.'],
          ],
        },
        {
          titre: 'L’aéroport de Paris-Roissy-Charles de Gaulle, un hub au cœur des échanges européens',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'Roissy, porte de la France sur le monde',
            cours: `Au nord-est de Paris, l’aéroport **Paris-Charles de Gaulle** (Roissy-CDG) est l’un des plus grands aéroports d’Europe : environ **70 millions** de passagers par an au milieu des années 2020, plus de 300 destinations. C’est un **hub** au cœur des échanges européens, en **concurrence** avec de nombreux grands aéroports mondiaux.

## Pourquoi un hub ?
- L’ouverture à la **concurrence** des transports aériens et la **déréglementation** (dans l’UE, dans les années 1990) ont transformé le paysage aérien.
- Les grandes compagnies concentrent leurs vols sur un **pôle unique** : c’est le modèle en **« hub and spokes »** (moyeu et rayons). Les passagers venus de villes moyennes changent d’avion au hub pour partir vers le monde entier.
| Hub | Compagnie |
| **Paris-CDG** | **Air France** (groupe Air France-KLM) |
| Londres-Heathrow | British Airways |
| Francfort | Lufthansa |
| Amsterdam-Schiphol | KLM |
| Istanbul, Dubaï, Doha | Turkish Airlines, Emirates, Qatar Airways |

> Un **hub** est une plateforme de correspondance : son succès dépend du nombre de connexions possibles en peu de temps.

## Une grande plateforme de fret
- Roissy est l’une des premières places de **fret aérien** en Europe (environ 2 millions de tonnes par an), avec Francfort, Londres, Amsterdam et **Leipzig** (hub de DHL).
- **FedEx** y a son hub européen ; La Poste et de nombreux transitaires y sont installés.
- Le fret aérien transporte des produits de forte valeur ou urgents : médicaments, électronique, luxe.

## Une plateforme multimodale
Roissy est relié :
1. à Paris par le **RER B** et bientôt par le **CDG Express** et la ligne 17 du métro du Grand Paris ;
2. au reste de la France et de l’Europe par la **gare TGV Aéroport CDG 2** (ouverte en 1994), sur l’**interconnexion** des lignes à grande vitesse : Lille et Bruxelles au nord, Lyon et Marseille au sud-est, Bordeaux et Rennes à l’ouest ;
3. par les **autoroutes** A1 et A3.

## Un pôle économique
- Environ **90 000** emplois directs sur la plateforme, bien plus en comptant les emplois indirects : c’est l’un des premiers pôles d’emploi d’Île-de-France.
- Zones d’activités, hôtels, sièges logistiques, parc des expositions de Paris-Nord Villepinte.
- Gestionnaire : le **Groupe ADP** (Aéroports de Paris).

## Des limites et des débats
- Les **nuisances sonores** pour les riverains du Val-d’Oise et de la Seine-Saint-Denis.
- Le **contraste** entre la richesse créée et les communes voisines populaires dont les habitants accèdent peu aux emplois qualifiés.
- Le **climat** : le projet de nouveau terminal (T4) a été abandonné en **2021** ; l’aviation doit réduire ses émissions.
- La **concurrence** des hubs du Golfe et d’Istanbul.

## Le croquis en mots
Au nord-est de Paris (environ 25 km), l’aéroport avec ses terminaux (T1, T2, T3) et ses quatre pistes parallèles. Il est relié à Paris par le RER B et l’autoroute A1 ; la gare TGV au cœur du terminal 2 est branchée sur une ligne qui dessert Lille, Bruxelles et Londres au nord, Lyon et Marseille au sud-est. Autour, les zones logistiques (Paris Nord 2, zones de fret) et Villepinte.

## Repères à retenir
| Repère | Donnée |
| Passagers | environ 70 millions par an |
| Compagnie basée | Air France |
| Gare TGV | 1994 |
| Emplois directs | environ 90 000 |`,
          },
          questions: [
            ['Qu’est-ce qu’un hub aéroportuaire ?', ['Un petit aéroport régional', 'Une plateforme de correspondance où une compagnie concentre ses vols', 'Une piste d’atterrissage', 'Une compagnie aérienne'], 1, 'Les passagers y changent d’avion pour rejoindre de nombreuses destinations.'],
            ['Quelle compagnie a fait de Roissy-CDG son hub ?', ['Air France', 'British Airways', 'Lufthansa', 'Emirates'], 0, 'Air France, au sein du groupe Air France-KLM, concentre ses vols long-courriers à Roissy.'],
            ['Combien de passagers Roissy-CDG accueille-t-il environ par an ?', ['7 millions', '700 millions', '70 millions', '7 000'], 2, 'C’est l’un des plus grands aéroports d’Europe.'],
            ['Quel changement a favorisé la formation des hubs ?', ['La nationalisation des compagnies', 'L’interdiction des vols internationaux', 'La fin du fret aérien', 'L’ouverture à la concurrence et la déréglementation du transport aérien'], 3, 'Les compagnies ont concentré leurs dessertes sur un pôle unique pour être plus compétitives.'],
            ['Quel aéroport est le hub de British Airways ?', ['Londres-Heathrow', 'Paris-Orly', 'Francfort', 'Amsterdam-Schiphol'], 0, 'Chaque grande compagnie européenne a son hub.'],
            ['Roissy est relié au réseau TGV depuis 1994.', ['Vrai', 'Faux'], 0, 'La gare TGV du terminal 2 est sur l’interconnexion des lignes à grande vitesse.'],
            ['Pourquoi dit-on que Roissy est une plateforme multimodale ?', ['Parce qu’il a plusieurs terminaux', 'Parce qu’il relie avion, trains (RER, TGV) et autoroutes', 'Parce qu’il accueille plusieurs compagnies', 'Parce qu’il a quatre pistes'], 1, 'Cette connexion multiplie son aire d’attraction.'],
            ['Quel type de marchandises transporte surtout le fret aérien ?', ['Du charbon', 'Du pétrole brut', 'Des produits de forte valeur ou urgents', 'Des céréales'], 2, 'Médicaments, électronique et luxe justifient le coût élevé de l’avion.'],
            ['Quelle entreprise de livraison a son hub européen à Roissy ?', ['DHL', 'UPS', 'Amazon Air', 'FedEx'], 3, 'DHL a choisi Leipzig ; FedEx a choisi Roissy.'],
            ['Pourquoi le projet de terminal 4 a-t-il été abandonné en 2021 ?', ['Par manque de terrain', 'Pour des raisons climatiques et de trafic', 'À cause d’une grève', 'Parce que Roissy ferme'], 1, 'Le gouvernement l’a jugé incompatible avec les objectifs de réduction des émissions.'],
            ['Les communes voisines de Roissy profitent toutes pleinement des emplois de l’aéroport.', ['Vrai', 'Faux'], 1, 'Beaucoup d’habitants des communes populaires proches accèdent peu aux emplois qualifiés, et subissent les nuisances.'],
            ['Quels hubs concurrencent Roissy pour les correspondances entre l’Europe et l’Asie ?', ['Dubaï, Doha et Istanbul', 'Lyon et Marseille', 'Nice et Bâle', 'Orly et Beauvais'], 0, 'Les hubs du Golfe et d’Istanbul captent une part croissante des correspondances.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 3
        // ===================================================================
        {
          titre: 'Les lieux de l’influence française dans la mondialisation',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'Rayonner, influencer, attirer : la place de la France',
            cours: `La France n’est plus une grande puissance au sens de 1900, mais elle reste une **puissance d’influence** mondiale. Elle affirme sa place d’un point de vue **diplomatique**, **militaire**, **linguistique**, **culturel** et **économique**, et son influence est renforcée par son appartenance à l’**Union européenne**.

## Les notions à maîtriser
| Notion | Définition |
| **Rayonnement** | Capacité d’un pays à se faire connaître et apprécier au-delà de ses frontières |
| **Influence** | Capacité à orienter les décisions et les comportements des autres acteurs |
| **Attractivité** | Capacité à attirer sur son territoire touristes, étudiants, entreprises, capitaux, événements |

## Les leviers de l’influence française
1. **Diplomatique** : membre permanent du **Conseil de sécurité** de l’ONU ; troisième réseau diplomatique du monde (environ 160 ambassades) ; membre du G7, du G20, de l’OTAN.
2. **Militaire** : **puissance nucléaire** ; bases et forces prépositionnées (Djibouti, Émirats arabes unis, Gabon, Côte d’Ivoire… dont plusieurs réduites depuis 2022) ; présence sur tous les océans grâce aux outre-mer.
3. **Linguistique et culturelle** : environ **320 millions de francophones** ; l’**Organisation internationale de la francophonie** ; plus de 580 établissements scolaires français à l’étranger (réseau de l’AEFE) ; **Instituts français** et **Alliances françaises** ; le **Louvre Abu Dhabi** (2017).
4. **Économique** : filiales de grandes entreprises françaises dans le monde (TotalEnergies, LVMH, L’Oréal, Airbus, Danone) ; un des premiers exportateurs d’armement, d’aéronautique, de luxe, de vins.
5. **Maritime** : deuxième **ZEE** du monde (environ 10 millions de km²), grâce aux outre-mer.

> L’influence française repose moins sur la taille (environ 1 % de la population mondiale) que sur un **réseau** : diplomatie, langue, culture, entreprises, territoires ultramarins.

## Un territoire attractif
- **Première destination touristique mondiale** : environ **100 millions** de touristes internationaux en 2024.
- Premier pays européen pour les projets d’**investissements étrangers** plusieurs années de suite.
- Sièges d’**organisations internationales** : **UNESCO** et **OCDE** à Paris, **Conseil de l’Europe** et **Parlement européen** à Strasbourg, Interpol à Lyon.
- Grands événements : **Jeux olympiques et paralympiques de Paris 2024**, Festival de Cannes, Roland-Garros, Tour de France, salon VivaTech.
- Ces fonctions se concentrent surtout à **Paris** et dans les principales **métropoles**.

## Des limites et des rivalités
- Recul de l’influence en Afrique de l’Ouest (départ du Mali, du Burkina Faso et du Niger en 2022-2023, retrait d’autres bases ensuite).
- Concurrence des autres puissances (États-Unis, Chine, Russie, pays du Golfe) ; poids de l’anglais.
- L’influence française passe de plus en plus par l’**Union européenne**.

## Le croquis en mots
Sur un planisphère centré sur l’Europe : la France métropolitaine et les outre-mer avec leurs **ZEE** sur tous les océans ; des symboles pour les bases militaires (Djibouti, Abou Dhabi), les lieux culturels (Louvre Abu Dhabi), les pays francophones (Afrique de l’Ouest et centrale, Québec). En encart, Paris et ses sièges d’organisations internationales.

## Repères à retenir
| Repère | Donnée |
| Francophones dans le monde | environ 320 millions |
| Touristes internationaux | environ 100 millions (2024) |
| ZEE | environ 10 millions de km², deuxième mondiale |
| Louvre Abu Dhabi | 2017 |

**Notions** : rayonnement, influence, attractivité.`,
          },
          questions: [
            ['Quelle différence entre rayonnement et attractivité ?', ['Aucune', 'Le rayonnement se fait connaître à l’étranger ; l’attractivité attire sur son territoire', 'Le rayonnement concerne l’économie seulement', 'L’attractivité concerne l’armée'], 1, 'Un pays rayonne vers l’extérieur et attire vers l’intérieur.'],
            ['Quel siège la France occupe-t-elle à l’ONU ?', ['Un siège de membre permanent du Conseil de sécurité', 'Aucun', 'Un siège d’observateur', 'La présidence permanente'], 0, 'Avec les États-Unis, la Chine, la Russie et le Royaume-Uni, elle dispose d’un droit de veto.'],
            ['Combien de francophones compte-t-on dans le monde ?', ['Environ 32 millions', 'Environ 3 milliards', 'Environ 320 millions', 'Environ 68 millions'], 2, 'Une grande partie vit en Afrique, où la francophonie progresse avec la démographie.'],
            ['Quel musée français a ouvert une antenne à Abu Dhabi en 2017 ?', ['Le musée d’Orsay', 'Le Centre Pompidou', 'Le musée Grévin', 'Le Louvre'], 3, 'Le Louvre Abu Dhabi est un exemple de diplomatie culturelle.'],
            ['Quel est le rang de la ZEE française dans le monde ?', ['Deuxième', 'Premier', 'Dixième', 'Vingtième'], 0, 'Grâce aux outre-mer, elle couvre environ 10 millions de km².'],
            ['La France est la première destination touristique du monde.', ['Vrai', 'Faux'], 0, 'Elle accueille environ 100 millions de touristes internationaux par an.'],
            ['Quelle organisation internationale a son siège à Paris ?', ['L’ONU', 'L’UNESCO', 'L’OTAN', 'L’OMC'], 1, 'Paris accueille aussi l’OCDE ; Strasbourg le Conseil de l’Europe et le Parlement européen.'],
            ['Quel grand événement sportif la France a-t-elle accueilli en 2024 ?', ['La Coupe du monde de football', 'Les Jeux olympiques et paralympiques', 'Le Mondial de rugby', 'L’Euro de football'], 1, 'Paris 2024 a renforcé l’attractivité et l’image internationale de la France.'],
            ['Dans quel pays la France dispose-t-elle d’une grande base militaire à l’entrée de la mer Rouge ?', ['Djibouti', 'Le Mali', 'Le Maroc', 'La Turquie'], 0, 'Djibouti, près du détroit de Bab-el-Mandeb, est un point d’appui stratégique.'],
            ['Où se concentrent surtout les fonctions d’attractivité en France ?', ['Dans les espaces ruraux isolés', 'Dans les montagnes', 'À Paris et dans les grandes métropoles', 'Uniformément partout'], 2, 'Sièges, événements et investissements étrangers privilégient les métropoles.'],
            ['L’influence française en Afrique de l’Ouest a progressé depuis 2022.', ['Vrai', 'Faux'], 1, 'Elle a reculé : départ des troupes françaises du Mali, du Burkina Faso et du Niger.'],
            ['Quel cadre renforce l’influence de la France dans le monde ?', ['L’Union européenne', 'Le pacte de Varsovie', 'L’ASEAN', 'Le Mercosur'], 0, 'Membre fondateur, la France pèse davantage au sein de l’UE.'],
          ],
        },
        {
          titre: 'Le centre spatial guyanais (Kourou) : coopérer pour s’affirmer à l’échelle mondiale',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'Kourou, le port spatial de l’Europe',
            cours: `En **Guyane**, sur la côte d’Amérique du Sud, le **centre spatial guyanais** (CSG) de **Kourou** est la base de lancement de l’Europe. C’est un moteur économique pour la Guyane et une **vitrine de la coopération européenne et internationale** dans le domaine spatial.

## Une localisation optimale
Le site est choisi en **1964** par le général de Gaulle, après la perte des bases françaises du Sahara algérien (indépendance de l’Algérie). Ses atouts :
1. **La proximité de l’équateur** (environ 5° de latitude nord) : la rotation de la Terre y donne aux fusées un « élan » supplémentaire, ce qui économise du carburant, surtout pour placer des satellites en **orbite géostationnaire**.
2. **L’ouverture sur l’océan Atlantique** à l’est et au nord : les fusées survolent la mer, sans risque pour les populations.
3. **Une zone faiblement peuplée**, et à l’abri des cyclones et des séismes.
4. **Un territoire français et européen** (région ultrapériphérique de l’UE).
Le premier lancement a lieu en **1968**.

## Les acteurs d’une coopération
| Acteur | Rôle |
| **CNES** (Centre national d’études spatiales) | Agence française, gère la base |
| **ESA** (Agence spatiale européenne) | Finance une grande partie des installations et des lanceurs |
| **Arianespace** | Société qui commercialise les lancements |
| **ArianeGroup**, Avio (Italie) | Industriels qui fabriquent Ariane et Vega |
| **Clients** | Opérateurs de satellites du monde entier, agences spatiales |

## Les lanceurs
- **Ariane** : Ariane 1 (1979), puis **Ariane 5** (1996-2023), qui a lancé le télescope spatial **James Webb** en 2021 ; **Ariane 6** fait son premier vol en **juillet 2024**.
- **Vega**, lanceur léger italien et européen.
- De **2011 à 2022**, des fusées russes **Soyouz** ont aussi décollé de Kourou ; cette coopération a pris fin avec la guerre en Ukraine.

> Kourou permet à l’Europe d’avoir un **accès autonome à l’espace**, sans dépendre des États-Unis, de la Russie ou de la Chine.

## Un moteur économique pour la Guyane
- Le spatial représente environ **15 %** de la richesse produite en Guyane et plusieurs milliers d’emplois directs et indirects.
- Mais le contraste est fort : la Guyane connaît chômage élevé, pauvreté et manque d’équipements. En **2017**, un grand mouvement social a bloqué le territoire et même un lancement.

## Une concurrence mondiale
L’Europe est concurrencée par **SpaceX** (fusées réutilisables, bas prix), la Chine, l’Inde. Ariane 6 doit reconquérir des clients ; de nouveaux acteurs privés (mini-lanceurs) s’installent à Kourou.

## Le croquis en mots
Sur une carte de la Guyane : la côte atlantique au nord-est, la forêt amazonienne qui couvre l’intérieur. Entre Cayenne et **Kourou**, le long du littoral, la base et ses pas de tir. Des flèches montrent les trajectoires des fusées vers l’est et le nord, au-dessus de l’océan. En encart, un planisphère place Kourou près de l’équateur et le relie aux pays membres de l’ESA et aux clients du monde entier.

## Repères à retenir
| Repère | Donnée |
| Choix du site | 1964 |
| Premier lancement | 1968 |
| Première Ariane | 1979 |
| Premier vol d’Ariane 6 | juillet 2024 |
| Latitude | environ 5° nord |`,
          },
          questions: [
            ['Dans quel territoire se trouve le centre spatial de Kourou ?', ['En Martinique', 'En Guyane', 'À La Réunion', 'En Nouvelle-Calédonie'], 1, 'La Guyane est un territoire français d’Amérique du Sud.'],
            ['Pourquoi la proximité de l’équateur est-elle un atout ?', ['Il y fait chaud', 'La rotation de la Terre donne un élan supplémentaire aux fusées', 'Il n’y a jamais de vent', 'Il y a moins de gravité'], 1, 'Cela économise du carburant, surtout pour l’orbite géostationnaire.'],
            ['Pourquoi les fusées de Kourou survolent-elles la mer ?', ['Pour éviter de survoler des populations', 'Pour être vues des bateaux', 'Pour se refroidir', 'Par hasard'], 0, 'L’ouverture sur l’Atlantique réduit les risques en cas d’accident.'],
            ['Quelle agence européenne finance une grande partie de la base ?', ['L’OTAN', 'L’ONU', 'La NASA', 'L’ESA'], 3, 'L’Agence spatiale européenne réunit plus de vingt États membres.'],
            ['Quel lanceur européen a fait son premier vol en juillet 2024 ?', ['Ariane 5', 'Soyouz', 'Ariane 6', 'Falcon 9'], 2, 'Il succède à Ariane 5, retirée en 2023.'],
            ['Quel télescope spatial Ariane 5 a-t-elle lancé en 2021 ?', ['Hubble', 'James Webb', 'Kepler', 'Gaia'], 1, 'Le télescope James Webb est l’un des plus grands succès d’Ariane 5.'],
            ['Des fusées russes Soyouz ont décollé de Kourou jusqu’en 2022.', ['Vrai', 'Faux'], 0, 'La coopération a pris fin avec la guerre en Ukraine.'],
            ['Que signifie un « accès autonome à l’espace » pour l’Europe ?', ['Ne plus envoyer de satellites', 'Lancer ses satellites sans dépendre d’autres puissances', 'Acheter des fusées américaines', 'Interdire les lancements étrangers'], 1, 'C’est un enjeu de souveraineté, notamment pour les satellites militaires et de navigation (Galileo).'],
            ['Quelle société commercialise les lancements d’Ariane ?', ['Arianespace', 'SpaceX', 'Airbus', 'Thales'], 0, 'Elle vend les lancements à des clients du monde entier.'],
            ['Quel est le principal concurrent d’Ariane sur le marché des lancements ?', ['Airbus', 'Le CNES', 'Vega', 'SpaceX'], 3, 'Ses fusées réutilisables ont fait baisser les prix.'],
            ['Le spatial a supprimé toutes les difficultés sociales de la Guyane.', ['Vrai', 'Faux'], 1, 'Chômage et pauvreté restent élevés ; le mouvement social de 2017 l’a montré.'],
            ['Pourquoi la France choisit-elle Kourou en 1964 ?', ['Pour remplacer les bases du Sahara perdues avec l’indépendance de l’Algérie', 'Parce que c’est près de Paris', 'Parce que la Guyane est un désert', 'Pour être loin de l’océan'], 0, 'Les premiers essais français avaient lieu à Hammaguir, dans le Sahara algérien.'],
          ],
        },
        {
          titre: 'Disneyland Paris : un marqueur de l’intégration de la France dans la mondialisation',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'Un parc américain au cœur de l’Europe',
            cours: `Ouvert en **1992** à **Marne-la-Vallée**, à l’est de Paris, **Disneyland Paris** est une filiale de la firme américaine **Walt Disney Company**. Avec environ **15 millions** de visites par an dans les années 2020, c’est la **première destination touristique payante d’Europe**. Il témoigne du positionnement attractif de la France dans l’espace européen et dans la mondialisation.

## Pourquoi en France ?
Disney hésitait entre la France et l’Espagne. La région parisienne l’emporte pour plusieurs raisons :
1. **La situation** : au centre de l’Europe occidentale, à moins de deux heures d’avion ou de train de plusieurs dizaines de millions d’Européens.
2. **La renommée** internationale de la France et de **Paris**, première destination touristique mondiale.
3. **Les infrastructures** : autoroute A4, RER A, puis une **gare TGV** (Marne-la-Vallée-Chessy, 1994) sur l’interconnexion, à moins de 15 minutes de Roissy.
4. **L’accord de 1987** avec l’État : terrains à prix avantageux, prolongement du RER et de l’autoroute, dans le cadre de la **ville nouvelle** de Marne-la-Vallée.

> Disneyland Paris bénéficie de la renommée de Paris et de la France, et la renforce en retour.

## Une clientèle européenne et mondiale
- Environ la moitié des visiteurs sont **français** ; l’autre moitié vient surtout du **Royaume-Uni**, d’**Espagne**, de **Belgique**, des **Pays-Bas**, d’**Italie** et d’**Allemagne**.
- Des touristes du monde entier le combinent avec une visite de Paris.

## Un pôle économique
| Donnée | Ordre de grandeur |
| Parcs | Deux : **Disneyland Park** (1992) et **Disney Adventure World** (ex-Walt Disney Studios, 2002, agrandi en 2026) |
| Hôtels | Environ 6 000 chambres dans les hôtels Disney, bien plus alentour |
| Emplois | Environ **17 000** salariés, premier employeur privé mono-site d’Île-de-France |
| Retombées | Des milliards d’euros de recettes touristiques pour la France depuis 1992 |

## Un aménagement mené par des acteurs publics et privés
- Le **secteur IV de Marne-la-Vallée** (Val d’Europe) s’est urbanisé autour du parc : centre commercial Val d’Europe, **outlet** de La Vallée Village, logements, bureaux, campus.
- L’État, la Région et les communes (établissement public d’aménagement **EPAFRANCE**) aménagent avec Disney.
- Des extensions régulières : nouvel espace consacré à *La Reine des neiges* ouvert en 2026.

## Des limites
- Artificialisation de terres agricoles de la Brie.
- Emplois souvent précaires et saisonniers ; débuts difficiles (pertes financières dans les années 1990).
- Critiques sur l’« américanisation » culturelle à son ouverture.

## Le croquis en mots
À l’est de Paris (environ 30 km), le long de l’**autoroute A4** et du **RER A** : la ville nouvelle de Marne-la-Vallée, et à son extrémité, le complexe Disney avec ses deux parcs, ses hôtels, le Val d’Europe. La **gare TGV** de Chessy relie le site à Roissy (15 minutes), Lille, Londres, Bruxelles, Lyon et Marseille. Des flèches venues du Royaume-Uni, du Benelux, d’Espagne et d’Allemagne convergent vers le site.

## Repères à retenir
| Repère | Donnée |
| Ouverture | 1992 |
| Gare TGV Marne-la-Vallée-Chessy | 1994 |
| Second parc | 2002 |
| Visites | environ 15 millions par an |
| Salariés | environ 17 000 |`,
          },
          questions: [
            ['Quand Disneyland Paris a-t-il ouvert ?', ['En 1972', 'En 1992', 'En 2002', 'En 1987'], 1, 'L’accord avec l’État date de 1987 ; le parc ouvre en avril 1992.'],
            ['Dans quelle ville nouvelle Disneyland Paris est-il installé ?', ['Cergy-Pontoise', 'Évry', 'Marne-la-Vallée', 'Saint-Quentin-en-Yvelines'], 2, 'Il est à l’est de Paris, dans le secteur du Val d’Europe.'],
            ['De quelle firme Disneyland Paris est-il une filiale ?', ['Walt Disney Company', 'Universal', 'Warner Bros', 'Parques Reunidos'], 0, 'C’est un exemple d’implantation d’une firme transnationale américaine en France.'],
            ['Quel pays concurrençait la France pour accueillir le parc ?', ['L’Allemagne', 'L’Italie', 'Le Royaume-Uni', 'L’Espagne'], 3, 'Disney a finalement choisi la région parisienne pour sa situation et sa renommée.'],
            ['Quelle part des visiteurs vient de l’étranger ?', ['Environ la moitié', 'Aucun', 'Environ 5 %', 'Tous'], 0, 'Britanniques, Espagnols, Belges, Néerlandais, Italiens et Allemands sont nombreux.'],
            ['Disneyland Paris est la première destination touristique payante d’Europe.', ['Vrai', 'Faux'], 0, 'Avec environ 15 millions de visites par an, il devance tous les autres sites payants.'],
            ['Quelle infrastructure relie directement le site à Roissy et aux grandes villes européennes ?', ['Un aéroport privé', 'La gare TGV Marne-la-Vallée-Chessy', 'Un port fluvial', 'Un téléphérique'], 1, 'Ouverte en 1994, elle est à moins de 15 minutes de Roissy.'],
            ['Combien de salariés compte environ Disneyland Paris ?', ['Environ 170', 'Environ 1 700', 'Environ 170 000', 'Environ 17 000'], 3, 'C’est le premier employeur privé sur un seul site en Île-de-France.'],
            ['Qui aménage le secteur autour du parc ?', ['Disney seul', 'L’Union européenne seule', 'Des acteurs publics et privés ensemble', 'Aucun acteur'], 2, 'L’État, la Région, les communes et l’établissement public EPAFRANCE travaillent avec Disney.'],
            ['Pourquoi Disneyland Paris est-il un marqueur de l’intégration de la France dans la mondialisation ?', ['Parce qu’il est gratuit', 'Parce qu’une firme américaine y attire des visiteurs du monde entier grâce à la renommée de la France', 'Parce qu’il appartient à l’État', 'Parce qu’il n’accueille que des Français'], 1, 'Il associe firme transnationale, flux touristiques internationaux et attractivité française.'],
            ['Le parc n’a eu aucun effet négatif sur son territoire.', ['Vrai', 'Faux'], 1, 'Artificialisation des terres, emplois précaires, critiques culturelles : il y a aussi des limites.'],
            ['Quel centre commercial s’est développé à côté du parc ?', ['Val d’Europe', 'Les Quatre Temps', 'Part-Dieu', 'Euralille'], 0, 'Le Val d’Europe et l’outlet La Vallée Village attirent aussi une clientèle internationale.'],
          ],
        },
      ],
    },
  ],
}
