// -----------------------------------------------------------------------------
// LE MONDE CONTEMPORAIN — huit événements qui font le monde d'aujourd'hui, de
// la décolonisation de l'Afrique au passage à l'euro.
//
// Trois fils s'y croisent, et c'est ce qui rend la période lisible en 3e :
// l'EMPIRE qui se défait (Bandung, 1960, les guerres d'indépendance), la
// GUERRE FROIDE qui se fige puis se dénoue (le Mur, Cuba, la Lune, le 9
// novembre 1989), et l'EUROPE qui s'invente une monnaie et une citoyenneté
// (Maastricht, l'euro). Le 11 septembre 2001 ferme la parenthèse ouverte en
// 1989 : le monde d'après la guerre froide découvre son propre désordre.
//
// Sur le 11 septembre, consigne de `docs/encyclopedie.md`, § 3 : factuel,
// précis et sobre. Les heures, les chiffres, la riposte — pas d'émotion
// rajoutée, la précision suffit.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_CONTEMPORAIN_MONDE: Evenement[] = [
  {
    id: 'decolonisation-de-l-afrique',
    volet: 'evenements',
    nom: 'La décolonisation de l’Afrique',
    date: '1945 – 1975',
    tri: 1960,
    fin: 1975,
    periode: 'contemporain',
    emoji: '🌍',
    lieu: 'L’Afrique, d’Alger au Cap',
    accroche:
      'En trente ans, un continent reprend la main : quatre États africains sont indépendants en 1945, près de cinquante en 1975.',
    citations: [
      {
        texte:
          'Nous préférons la pauvreté dans la liberté à la richesse dans l’esclavage.',
        qui: 'Sékou Touré',
        contexte:
          'Devant le général de Gaulle, à Conakry, le 25 août 1958, un mois avant le référendum sur la Communauté française.',
        sens:
          'La Guinée est la seule colonie à voter non. Elle devient indépendante le 2 octobre 1958, et la France retire tout : crédits, fonctionnaires, jusqu’aux dossiers.',
      },
      {
        texte: 'The wind of change is blowing through this continent.',
        qui: 'Harold Macmillan',
        contexte:
          'Premier ministre britannique, devant le Parlement d’Afrique du Sud, au Cap, le 3 février 1960.',
        sens:
          '« Un vent de changement souffle sur ce continent. » Le chef de l’empire colonial le plus vaste du monde annonce lui-même que le temps des colonies est fini.',
      },
      {
        texte: 'At long last the battle has ended! Ghana, your beloved country, is free for ever.',
        qui: 'Kwame Nkrumah',
        contexte: 'À Accra, dans la nuit du 5 au 6 mars 1957, à l’indépendance du Ghana.',
        sens:
          '« La bataille est enfin finie ! Ghana, ton pays bien-aimé, est libre pour toujours. » Le Ghana est la première colonie d’Afrique noire à devenir indépendante.',
      },
    ],
    reperes: [
      'En 1945, quatre États africains seulement sont indépendants : l’Égypte, l’Éthiopie, le Liberia et l’Union sud-africaine.',
      'La conférence de Bandung, en avril 1955, réunit 29 pays d’Asie et d’Afrique et condamne le colonialisme.',
      '1960 est « l’année de l’Afrique » : 17 pays deviennent indépendants, dont 14 anciennes colonies françaises.',
      'Deux voies : l’indépendance négociée (Ghana, Afrique noire française) ou la guerre (Algérie, Angola, Mozambique).',
      'Les nouveaux États gardent les frontières tracées par les colonisateurs, déclarées intangibles par l’OUA en 1964.',
    ],
    causes: [
      'La Seconde Guerre mondiale, qui ruine et affaiblit les puissances coloniales : l’Europe n’a plus les moyens de tenir des empires.',
      'Les soldats coloniaux — près de 200 000 Africains dans l’armée française — qui se sont battus pour la liberté de l’Europe et réclament la leur.',
      'La Charte des Nations unies (1945), qui inscrit le droit des peuples à disposer d’eux-mêmes, et deux superpuissances hostiles aux vieux empires.',
      'Des élites africaines formées à Paris et à Londres, qui retournent contre la métropole ses propres principes.',
      'L’exemple de l’Asie : l’Inde indépendante en 1947, la France battue à Diên Biên Phu en 1954.',
      'La conférence de Bandung (1955), où les colonisés parlent d’une seule voix pour la première fois.',
      'Le coût politique et financier des guerres coloniales, que les opinions métropolitaines finissent par refuser.',
    ],
    recit: [
      {
        titre: 'Une guerre qui change tout',
        texte:
          'En 1939, l’Afrique est presque entièrement partagée entre sept puissances européennes. Six ans plus tard, tout a bougé. Les colonies ont fourni des hommes — près de **200 000 tirailleurs** dans l’armée française — des vivres et des matières premières ; l’**Afrique-Équatoriale française** a été la base arrière de la France libre dès 1940. Ceux qui ont combattu le nazisme au nom de la liberté rentrent chez eux et posent la question évidente. En janvier 1944, la conférence de **Brazzaville** promet des réformes, mais écarte explicitement « toute idée d’autonomie ». La **Charte des Nations unies** (1945), elle, écrit noir sur blanc le droit des peuples à disposer d’eux-mêmes. Et l’Asie montre le chemin : l’**Inde** est indépendante en 1947, la France est battue à **Diên Biên Phu** en 1954. Le rapport de force a changé de camp avant que les traités ne le disent.',
      },
      {
        titre: 'Bandung, la voix des colonisés',
        texte:
          'Du 18 au 24 avril **1955**, vingt-neuf pays d’Asie et d’Afrique se réunissent à **Bandung**, en Indonésie. **Nehru** pour l’Inde, **Nasser** pour l’Égypte, **Sukarno** pour le pays hôte, **Zhou Enlai** pour la Chine : des hommes qui, dix ans plus tôt, n’auraient pas été reçus dans une conférence internationale. Ils condamnent le colonialisme « sous toutes ses formes », réclament l’égalité des races et des nations, et refusent de choisir entre Washington et Moscou — c’est le **non-alignement**. Bandung ne décide rien de contraignant, mais elle fait exister une troisième force : le **tiers-monde**, mot forgé en 1952 par le démographe Alfred Sauvy sur le modèle du Tiers état de 1789. À l’ONU, ces pays vont voter ensemble, et faire adopter le 14 décembre **1960** la résolution 1514, qui déclare la domination coloniale contraire à la Charte.',
      },
      {
        titre: 'Le non de la Guinée, 1958',
        texte:
          'Revenu au pouvoir en 1958, **de Gaulle** propose aux colonies africaines une **Communauté française** : autonomie interne, mais défense, monnaie et diplomatie à Paris. Le **28 septembre 1958**, un référendum leur demande de répondre oui ou non, en sachant que le non signifie l’indépendance immédiate — et la fin de toute aide. Tous votent oui, sauf un territoire. La **Guinée** de **Sékou Touré** répond non à plus de 95 % des voix. Elle est indépendante le **2 octobre 1958**. La réponse française est brutale : départ des fonctionnaires en deux mois, arrêt des crédits, matériel emporté ou détruit. L’avertissement était clair ; il n’a pas servi longtemps. Dès 1960, la Communauté se vide d’elle-même, et Paris préfère négocier des indépendances ordonnées plutôt que de les subir.',
      },
      {
        titre: '1960, l’année de l’Afrique',
        texte:
          'En une seule année, **dix-sept** pays africains accèdent à l’indépendance, dont quatorze anciennes colonies françaises : Cameroun, Togo, Madagascar, Sénégal, Mali, Côte d’Ivoire, Haute-Volta, Niger, Tchad, Gabon, Congo, Dahomey, Mauritanie, Centrafrique. Le **30 juin 1960**, le **Congo belge** devient indépendant, et le 1er octobre le **Nigeria**, le pays le plus peuplé du continent. La plupart de ces passages se font sans un coup de feu, drapeau contre drapeau, hymne contre hymne. Le Congo, lui, bascule en quelques jours : mutinerie de l’armée, sécession du Katanga riche en cuivre, intervention de l’ONU, assassinat du Premier ministre **Patrice Lumumba** en janvier 1961. La décolonisation n’est pas seulement une date sur un calendrier : c’est un État à construire, avec une administration, une armée et des frontières dont personne n’a choisi le tracé.',
      },
      {
        titre: 'Celles qu’il a fallu arracher',
        texte:
          'Là où des colons européens sont installés en nombre, ou là où la métropole refuse de discuter, l’indépendance passe par la guerre. En **Algérie**, où vivent un million d’Européens et qui est juridiquement composée de départements français, la guerre dure de **1954 à 1962** et fait des centaines de milliers de morts ; elle se termine par les **accords d’Évian** du 18 mars 1962. Au **Kenya**, la révolte des **Mau Mau** (1952-1956) est écrasée par les Britanniques avant que l’indépendance ne vienne en 1963. Les colonies portugaises — **Angola**, **Mozambique**, Guinée-Bissau — se battent treize ans, jusqu’à ce que la **révolution des Œillets** renverse la dictature à Lisbonne en avril 1974 : elles sont libres en **1975**. C’est cette année-là qui ferme la carte des empires, trente ans après 1945.',
      },
      {
        titre: 'Ce que l’indépendance n’a pas réglé',
        texte:
          'Les nouveaux États héritent de frontières dessinées à la règle par les Européens lors du **partage de l’Afrique** (conférence de Berlin, 1885) : des peuples coupés en deux, des États sans accès à la mer, des ensembles sans unité. L’**Organisation de l’unité africaine**, créée à Addis-Abeba en 1963, choisit pourtant de les déclarer **intangibles** en 1964 — les rouvrir aurait allumé cent guerres. Elles en ont quand même allumé quelques-unes : sécession du **Biafra** au Nigeria (1967-1970), conflits de la Corne de l’Afrique et des Grands Lacs. Les économies, elles, restent construites pour exporter une ou deux matières premières vers l’ancienne métropole ; l’aide, les accords de défense et le **franc CFA** maintiennent des liens étroits, que l’on désignera du mot de **néocolonialisme**. L’indépendance politique était une première marche, pas la dernière.',
      },
    ],
    consequences: [
      'Près de cinquante États nouveaux apparaissent : l’ONU passe de 51 membres en 1945 à plus de 140 en 1975.',
      'Le tiers-monde devient une force de vote à l’ONU et impose le thème du développement dans les relations internationales.',
      'Les frontières coloniales, maintenues par l’OUA, laissent des peuples divisés et nourrissent des conflits jusqu’à aujourd’hui.',
      'La France conserve des liens étroits avec ses anciennes colonies : franc CFA, accords de défense, coopération — ce qu’on appellera la Françafrique.',
      'L’immigration africaine vers l’Europe et la francophonie se développent à partir de ces indépendances.',
      'Les économies de rente héritées de la colonisation rendent le développement long et inégal.',
    ],
    chiffres: [
      { valeur: '17', quoi: 'pays africains devenus indépendants en 1960' },
      { valeur: '4', quoi: 'États africains indépendants en 1945' },
      { valeur: '29', quoi: 'pays réunis à la conférence de Bandung' },
      { valeur: '95 %', quoi: 'de non au référendum de 1958 en Guinée' },
    ],
    chrono: [
      { date: 'janvier 1944', fait: 'Conférence de Brazzaville : des réformes, pas l’autonomie.' },
      { date: '1947', fait: 'Indépendance de l’Inde : l’Asie ouvre la voie.' },
      { date: 'avril 1955', fait: 'Conférence de Bandung, 29 pays contre le colonialisme.' },
      { date: '6 mars 1957', fait: 'Le Ghana, première indépendance d’Afrique noire.' },
      { date: '28 septembre 1958', fait: 'La Guinée dit non à la Communauté française.' },
      { date: '1960', fait: '« Année de l’Afrique » : 17 indépendances.' },
      { date: '14 décembre 1960', fait: 'Résolution 1514 de l’ONU contre la colonisation.' },
      { date: '18 mars 1962', fait: 'Accords d’Évian : l’Algérie indépendante.' },
      { date: '25 mai 1963', fait: 'Création de l’Organisation de l’unité africaine.' },
      { date: '1975', fait: 'Angola et Mozambique indépendants : la carte est close.' },
    ],
    leSaisTu:
      'Le 30 juin 1960, à Léopoldville, le roi Baudouin fait l’éloge de l’œuvre coloniale belge. Patrice Lumumba, qui ne devait pas parler, monte à la tribune et répond devant le roi : « Nous avons connu le travail harassant exigé en échange de salaires qui ne nous permettaient ni de manger à notre faim, ni de nous vêtir. » Le protocole n’a pas prévu de réponse.',
    aRetenir: [
      'La conférence de Bandung (avril 1955) réunit 29 pays d’Asie et d’Afrique et condamne le colonialisme.',
      'En 1960, dix-sept États africains deviennent indépendants : on appelle 1960 « l’année de l’Afrique ».',
      'Le 28 septembre 1958, la Guinée de Sékou Touré est la seule colonie à refuser la Communauté française.',
      'Certaines indépendances sont négociées, d’autres arrachées par la guerre : Algérie (1954-1962), Angola et Mozambique jusqu’en 1975.',
      'Les nouveaux États conservent les frontières coloniales, déclarées intangibles par l’OUA en 1964.',
    ],
    mots: [
      {
        mot: 'Décolonisation',
        sens: 'Processus par lequel un territoire colonisé devient un État indépendant, par la négociation ou par la guerre.',
      },
      {
        mot: 'Tiers-monde',
        sens: 'Mot forgé en 1952 par Alfred Sauvy, sur le modèle du Tiers état, pour désigner les pays pauvres ni occidentaux ni soviétiques.',
      },
      {
        mot: 'Non-alignement',
        sens: 'Refus de choisir entre le bloc américain et le bloc soviétique, affirmé à Bandung en 1955.',
      },
      {
        mot: 'Communauté française',
        sens: 'Ensemble créé en 1958 groupant la France et ses colonies africaines autonomes ; elle disparaît en quelques années.',
      },
    ],
    lies: ['partage-de-l-afrique', 'charles-de-gaulle', 'gandhi', 'mur-de-berlin'],
    niveaux: ['3e', 'Tle'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'décolonisation',
      'Afrique',
      'Bandung',
      'indépendance',
      'Sékou Touré',
      'Nkrumah',
      'Ghana',
      'année de l’Afrique',
      'tiers-monde',
      'non-alignement',
      'OUA',
      'Communauté française',
      'empire colonial',
    ],
  },
  {
    id: 'mur-de-berlin',
    volet: 'evenements',
    nom: 'La construction du mur de Berlin',
    date: '13 août 1961',
    tri: 1961,
    periode: 'contemporain',
    emoji: '🧱',
    lieu: 'Berlin, Allemagne',
    accroche:
      'Dans la nuit du 12 au 13 août 1961, l’Est coupe Berlin au barbelé : le rideau de fer devient un mur au milieu d’une ville.',
    citations: [
      {
        texte: 'Niemand hat die Absicht, eine Mauer zu errichten.',
        qui: 'Walter Ulbricht',
        contexte:
          'Chef de l’État est-allemand, en conférence de presse à Berlin-Est, le 15 juin 1961 — huit semaines avant.',
        sens:
          '« Personne n’a l’intention de construire un mur. » Le mot « mur » est prononcé pour la première fois par celui qui allait le bâtir : la phrase reste comme le démenti le plus démenti du siècle.',
      },
      {
        texte: 'Ich bin ein Berliner.',
        qui: 'John Fitzgerald Kennedy',
        contexte:
          'Devant 400 000 personnes, sur la place de l’hôtel de ville de Schöneberg, à Berlin-Ouest, le 26 juin 1963.',
        sens:
          '« Je suis un Berlinois. » Kennedy dit aux Berlinois de l’Ouest que les États-Unis ne les lâcheront pas : une ville enclavée à 170 km dans le bloc adverse devient l’affaire de tout l’Occident.',
      },
      {
        texte: 'A wall is a hell of a lot better than a war.',
        qui: 'John Fitzgerald Kennedy',
        contexte:
          'Propos rapportés par ses collaborateurs, en août 1961, en apprenant la fermeture de la frontière.',
        sens:
          '« Un mur vaut tout de même bien mieux qu’une guerre. » Washington proteste, mais ne bouge pas : le Mur enferme Berlin-Est, il ne touche pas aux secteurs occidentaux.',
        incertaine: true,
      },
    ],
    reperes: [
      'Berlin est coupée en quatre secteurs depuis 1945 ; les trois secteurs occidentaux forment une enclave à 170 km dans la RDA.',
      'Entre 1949 et 1961, environ 2,7 millions d’Allemands de l’Est passent à l’Ouest, souvent jeunes et diplômés.',
      'Dans la nuit du 12 au 13 août 1961, des milliers d’hommes déroulent 155 km de barbelés ; le béton suit en quelques semaines.',
      'Le dispositif compte jusqu’à 302 miradors, une bande de sable dégagée et l’ordre de tirer sur les fuyards.',
      'Au moins 140 personnes meurent au Mur entre 1961 et 1989 ; il tombe le 9 novembre 1989.',
    ],
    causes: [
      'La division de l’Allemagne en deux États en 1949, la RFA à l’Ouest et la RDA à l’Est, et de Berlin en quatre secteurs depuis 1945.',
      'L’hémorragie humaine : 2,7 millions de départs en douze ans, près d’un sixième de la population de la RDA, et d’abord les médecins, les ingénieurs et les jeunes.',
      'L’écart de niveau de vie entre le « miracle économique » ouest-allemand et la pénurie à l’Est, visible d’un quartier à l’autre.',
      'L’ultimatum de Khrouchtchev, en novembre 1958, exigeant le départ des Occidentaux de Berlin-Ouest.',
      'L’échec de la rencontre Kennedy-Khrouchtchev à Vienne, en juin 1961 : chacun repart convaincu que l’autre cédera.',
      'Berlin-Ouest, vitrine du capitalisme plantée au cœur du bloc de l’Est, et seul trou resté ouvert dans le rideau de fer.',
    ],
    recit: [
      {
        titre: 'Une ville coupée, une porte ouverte',
        texte:
          'En 1945, les vainqueurs partagent l’Allemagne en quatre zones, et sa capitale en quatre secteurs — alors que Berlin se trouve à **170 km à l’intérieur** de la zone soviétique. La rupture est consommée par le **blocus de Berlin** (juin 1948 - mai 1949), brisé par le pont aérien, puis par la naissance de deux États en 1949 : la **RFA** à l’Ouest, la **RDA** à l’Est. Mais Berlin reste une anomalie : à l’intérieur de la ville, on passe. Le métro et le S-Bahn traversent, 500 000 personnes franchissent chaque jour la ligne pour travailler, étudier, aller au cinéma. Des milliers de Berlinois dorment à l’Est et travaillent à l’Ouest. Tant que cette porte reste ouverte, le rideau de fer a un trou — et tout le monde le sait, des deux côtés.',
      },
      {
        titre: 'L’hémorragie',
        texte:
          'Passer à l’Ouest ne demande qu’un ticket de métro et une valise discrète. Entre 1949 et 1961, environ **2,7 millions** d’Allemands de l’Est le font, sur dix-sept millions d’habitants. Ce ne sont pas n’importe qui : la RDA perd ses **médecins**, ses ingénieurs, ses enseignants, et surtout ses jeunes — la moitié des partants ont moins de vingt-cinq ans. Un pays qui forme des cadres pour son voisin ne tient pas longtemps. À l’été 1961, la rumeur d’une fermeture prochaine accélère tout : **30 000 départs** dans le seul mois de juillet, plus de 2 000 pour la seule journée du 12 août. Pour Ulbricht et pour Moscou, la question n’est plus de savoir s’il faut fermer, mais quand.',
      },
      {
        titre: 'La nuit du 13 août',
        texte:
          'On choisit un dimanche, la nuit la plus creuse de la semaine. Le **13 août 1961**, vers 1 heure du matin, la police populaire, les ouvriers des groupes de combat et l’armée est-allemande prennent position le long des 43 km de limite intérieure. On arrache les pavés, on plante des poteaux, on déroule des barbelés, on coupe les lignes de métro et de S-Bahn, on mure les fenêtres des immeubles qui donnent sur l’Ouest. Au matin, des Berlinois découvrent qu’ils ne peuvent plus rejoindre leur travail, leur école, leurs parents. Des fiancés sont séparés pour vingt-huit ans. Les Occidentaux protestent, envoient un renfort symbolique de 1 500 hommes, et n’interviennent pas : les secteurs occidentaux ne sont pas touchés. En quelques semaines, le barbelé devient un mur de **béton**.',
      },
      {
        titre: 'Vivre avec le Mur',
        texte:
          'Ce que l’on appelle « le Mur » est en réalité un dispositif de **155 km** autour de Berlin-Ouest, dont 43 en pleine ville : deux murs parallèles, un chemin de ronde, des projecteurs, des chiens, jusqu’à **302 miradors** et une bande de sable ratissée que l’on nomme la **bande de la mort**, parce que les gardes ont l’ordre de tirer. La RDA, elle, l’appelle officiellement le « mur de protection antifasciste ». En octobre 1961, chars américains et soviétiques se font face canon contre canon à **Checkpoint Charlie** pendant seize heures. Le 17 août 1962, **Peter Fechter**, dix-huit ans, est abattu en tentant de passer et agonise une heure au pied du Mur, sous les yeux des deux camps. Au moins **140 personnes** y meurent en vingt-huit ans ; environ 5 000 réussissent à passer, par des tunnels, des ballons, des voitures truquées ou de faux uniformes.',
      },
      {
        titre: 'Le symbole du rideau de fer',
        texte:
          'Militairement, le Mur est un aveu de faiblesse : un régime qui doit enfermer sa population pour la garder. Politiquement, il stabilise tout. La fuite s’arrête net, la RDA se redresse, et Berlin cesse d’être le point où la guerre froide pouvait devenir chaude — c’est pourquoi Kennedy, tout en protestant, soupire qu’un mur vaut mieux qu’une guerre. Le 26 juin **1963**, devant 400 000 personnes, il lance son « **Ich bin ein Berliner** » et fait de la ville le symbole du monde libre. Le Mur devient l’image la plus efficace de la **guerre froide** : une phrase de Churchill — le « rideau de fer » de 1946 — soudain visible en béton, photographiable, filmable. Il faudra attendre l’**Ostpolitik** de Willy Brandt (1970-1972) pour que les deux Allemagnes se parlent, et le 9 novembre 1989 pour que le Mur cède.',
      },
    ],
    consequences: [
      'La fuite vers l’Ouest cesse presque entièrement : la RDA se stabilise et survivra vingt-huit ans de plus.',
      'Berlin cesse d’être le point de rupture possible entre les deux blocs : la frontière est figée, donc moins dangereuse.',
      'Des milliers de familles sont séparées ; au moins 140 personnes meurent en tentant de franchir le Mur.',
      'Le Mur devient le symbole mondial du rideau de fer et de l’échec du modèle est-allemand.',
      'La détente s’organise ensuite : Ostpolitik de Willy Brandt, traité fondamental de 1972 reconnaissant les deux Allemagnes.',
      'Sa chute, le 9 novembre 1989, sera lue partout comme la fin de la guerre froide.',
    ],
    chiffres: [
      { valeur: '2,7 millions', quoi: 'd’Allemands de l’Est passés à l’Ouest entre 1949 et 1961' },
      { valeur: '155 km', quoi: 'de mur autour de Berlin-Ouest, dont 43 en pleine ville' },
      { valeur: '140', quoi: 'morts au moins en tentant de franchir le Mur' },
      { valeur: '28 ans', quoi: 'de mur, du 13 août 1961 au 9 novembre 1989' },
    ],
    chrono: [
      { date: '1945', fait: 'Berlin est partagée en quatre secteurs d’occupation.' },
      { date: '1948-1949', fait: 'Blocus de Berlin, brisé par le pont aérien.' },
      { date: 'novembre 1958', fait: 'Ultimatum de Khrouchtchev sur Berlin-Ouest.' },
      { date: 'juin 1961', fait: 'Kennedy et Khrouchtchev à Vienne : aucun accord.' },
      { date: '15 juin 1961', fait: 'Ulbricht : « Personne n’a l’intention de construire un mur. »' },
      { date: '13 août 1961', fait: 'La frontière est fermée dans la nuit, au barbelé.' },
      { date: 'octobre 1961', fait: 'Face-à-face des chars à Checkpoint Charlie.' },
      { date: '17 août 1962', fait: 'Peter Fechter est abattu au pied du Mur.' },
      { date: '26 juin 1963', fait: 'Kennedy à Berlin : « Ich bin ein Berliner. »' },
      { date: '9 novembre 1989', fait: 'Le Mur s’ouvre.' },
    ],
    leSaisTu:
      'Le 15 août 1961, Conrad Schumann, garde-frontière est-allemand de dix-neuf ans, jette son fusil et saute par-dessus les barbelés, à Bernauer Strasse. Un photographe de dix-neuf ans, Peter Leibing, attendait depuis une heure et appuie au bon moment. Le « saut vers la liberté » fera le tour du monde — et Schumann dira n’avoir été vraiment libre qu’en 1989.',
    aRetenir: [
      'Entre 1949 et 1961, environ 2,7 millions d’Allemands de l’Est fuient vers l’Ouest en passant par Berlin.',
      'Le mur de Berlin est construit dans la nuit du 12 au 13 août 1961 sur ordre de la RDA et de l’URSS.',
      'Il mesure 155 km autour de Berlin-Ouest et fait au moins 140 morts en vingt-huit ans.',
      'Le 26 juin 1963, Kennedy proclame à Berlin-Ouest : « Ich bin ein Berliner. »',
      'Le Mur devient le symbole du rideau de fer et de la division de l’Europe jusqu’en 1989.',
    ],
    mots: [
      {
        mot: 'Rideau de fer',
        sens: 'Expression de Churchill (1946) désignant la frontière fermée qui coupe l’Europe entre bloc soviétique et bloc occidental.',
      },
      {
        mot: 'RDA',
        sens: 'République démocratique allemande : l’État communiste créé en 1949 dans la zone soviétique, disparu en 1990.',
      },
      {
        mot: 'Checkpoint Charlie',
        sens: 'Poste de passage entre les secteurs américain et soviétique de Berlin, réservé aux étrangers et aux diplomates.',
      },
      {
        mot: 'Ostpolitik',
        sens: 'Politique d’ouverture de la RFA de Willy Brandt vers l’Est, à partir de 1969, pour rendre la division vivable.',
      },
    ],
    lies: [
      'chute-du-mur-de-berlin',
      'crise-de-cuba',
      'premiers-pas-sur-la-lune',
      'decolonisation-de-l-afrique',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Un monde bipolaire au temps de la guerre froide',
    tags: [
      'mur de Berlin',
      'Berlin',
      'guerre froide',
      'rideau de fer',
      'RDA',
      'RFA',
      'Ulbricht',
      'Kennedy',
      'Checkpoint Charlie',
      '13 août 1961',
      'Allemagne',
    ],
  },
  {
    id: 'crise-de-cuba',
    volet: 'evenements',
    nom: 'La crise de Cuba',
    date: 'octobre 1962',
    tri: 1962,
    periode: 'contemporain',
    emoji: '☢️',
    lieu: 'Cuba, Washington et Moscou',
    accroche:
      'Treize jours d’octobre 1962 : des missiles nucléaires soviétiques à 150 km de la Floride mettent le monde au bord de la guerre atomique.',
    citations: [
      {
        texte: 'We’re eyeball to eyeball, and I think the other fellow just blinked.',
        qui: 'Dean Rusk',
        contexte:
          'Secrétaire d’État américain, le 24 octobre 1962, quand les cargos soviétiques font demi-tour devant la ligne de blocus.',
        sens:
          '« Nous sommes les yeux dans les yeux, et je crois que l’autre vient de ciller. » La formule dit tout de la crise : deux puissances qui se fixent, et celle qui baisse les yeux la première a perdu.',
      },
      {
        texte:
          'Nous ne devrions pas tirer sur les deux bouts de la corde où vous avez noué le nœud de la guerre.',
        qui: 'Nikita Khrouchtchev',
        contexte:
          'Lettre personnelle à Kennedy, le 26 octobre 1962, traduite du russe par le département d’État dans la nuit.',
        sens:
          'Plus chacun tire, plus le nœud se serre, et vient un moment où personne ne peut plus le défaire. Khrouchtchev propose l’échange qui met fin à la crise.',
      },
      {
        texte:
          'The 1930s taught us a clear lesson: aggressive conduct, if allowed to go unchecked and unchallenged, ultimately leads to war.',
        qui: 'John Fitzgerald Kennedy',
        contexte:
          'Allocution télévisée à la nation, le 22 octobre 1962, en annonçant le blocus de Cuba.',
        sens:
          '« Les années 1930 nous ont appris une leçon claire : une conduite agressive que l’on ne conteste pas finit par mener à la guerre. » Kennedy justifie la fermeté par le souvenir de Munich.',
      },
    ],
    reperes: [
      'Cuba bascule dans le camp soviétique après la révolution de Fidel Castro (1959) et l’échec du débarquement de la baie des Cochons (avril 1961).',
      'Le 14 octobre 1962, un avion espion U-2 photographie des rampes de missiles nucléaires en construction sur l’île.',
      'Cuba est à 150 km de la Floride : les missiles installés frappent Washington en moins de dix minutes.',
      'Le 22 octobre, Kennedy annonce à la télévision un blocus naval, qu’il appelle « quarantaine » pour ne pas dire acte de guerre.',
      'Le 28 octobre, Khrouchtchev accepte de retirer les missiles ; les Américains s’engagent à ne pas envahir Cuba.',
    ],
    causes: [
      'La révolution cubaine de 1959 : Fidel Castro nationalise les biens américains, Washington décrète l’embargo, La Havane se tourne vers Moscou.',
      'L’échec du débarquement de la baie des Cochons (avril 1961), organisé par la CIA, qui convainc Castro qu’une invasion viendra et qu’il lui faut un protecteur.',
      'Les missiles américains Jupiter installés en Turquie et en Italie, à portée immédiate du territoire soviétique.',
      'Le retard nucléaire de l’URSS, que Khrouchtchev veut rattraper d’un coup en plaçant des fusées de portée moyenne près des côtes américaines.',
      'Le bras de fer de Berlin en 1961 : chaque camp cherche à mesurer jusqu’où l’autre est prêt à aller.',
      'Le secret de l’opération Anadyr : des missiles livrés en cachette, découverts par hasard, qui transforment une manœuvre en crise.',
    ],
    recit: [
      {
        titre: 'Une île qui change de camp',
        texte:
          'Le 1er janvier **1959**, **Fidel Castro** renverse le dictateur Batista. Cuba était la chasse gardée économique des États-Unis : sucre, tabac, casinos, hôtels. Castro nationalise ; Washington réplique par un **embargo** en 1960. En avril **1961**, la CIA débarque 1 400 exilés cubains à la **baie des Cochons** : c’est un fiasco complet, écrasé en trois jours. Castro se proclame alors socialiste et demande la protection de Moscou. À l’été 1962, l’URSS lance en secret l’**opération Anadyr** : 40 000 soldats, du matériel antiaérien et surtout des rampes pour des missiles **SS-4** capables d’emporter une charge nucléaire à 2 000 km. Tout arrive par cargo, caché sous des machines agricoles. Moscou compte mettre Washington devant le fait accompli.',
      },
      {
        titre: 'Les photos du 14 octobre',
        texte:
          'Le **14 octobre 1962**, un avion espion **U-2** survole l’ouest de Cuba et photographie ce que les analystes identifient sans hésiter : des rampes de lancement en construction. Kennedy est prévenu le 16 au matin. Il réunit en secret un petit groupe de conseillers, l’**ExComm**, qui va siéger presque sans dormir pendant treize jours. Trois options : bombarder les sites, envahir l’île, ou bloquer la mer. Les chefs militaires veulent frapper ; Kennedy, qui vient de lire un livre sur l’enchaînement d’août 1914, refuse le coup qui ne laisse plus de porte de sortie. Le **22 octobre** à 19 heures, il parle à la télévision devant près de cent millions d’Américains : il révèle l’existence des missiles et annonce une **quarantaine** navale. Le mot « blocus » désignerait un acte de guerre ; « quarantaine » laisse une marge.',
      },
      {
        titre: 'Les treize jours',
        texte:
          'Le **24 octobre**, 180 navires américains tiennent la ligne. Les cargos soviétiques approchent, ralentissent, font demi-tour : c’est le moment du « l’autre vient de ciller ». Mais les rampes déjà à terre continuent d’être montées. Le 26, Khrouchtchev écrit une longue lettre personnelle proposant le retrait contre la promesse de ne pas envahir Cuba ; le 27, une seconde lettre, plus dure, exige en plus le départ des **Jupiter de Turquie**. Ce même **samedi 27 octobre**, dit le « samedi noir », un U-2 est abattu au-dessus de Cuba et son pilote tué, un autre s’égare au-dessus de la Sibérie, et un sous-marin soviétique traqué à la grenade sous-marine envisage de tirer une torpille nucléaire. Kennedy choisit de répondre à la première lettre et d’ignorer la seconde, tandis que son frère Robert promet en secret à l’ambassadeur Dobrynine le retrait des Jupiter, quelques mois plus tard et sans publicité.',
      },
      {
        titre: 'Le recul et le marché',
        texte:
          'Le **28 octobre 1962** au matin, Radio Moscou lit la réponse de Khrouchtchev : les missiles seront démontés et rapatriés sous contrôle. Publiquement, l’URSS recule et les États-Unis s’engagent à ne pas envahir Cuba. Secrètement, les **missiles Jupiter** américains quittent la Turquie en avril 1963. **Castro**, qui n’a pas été consulté, apprend la nouvelle par la radio et entre en fureur. Khrouchtchev, lui, a évité la guerre mais passe pour avoir cédé : c’est l’un des griefs qui le feront écarter du pouvoir en octobre **1964**. Chacun peut dire qu’il a gagné, ce qui est exactement ce qu’il fallait pour que la crise s’arrête.',
      },
      {
        titre: 'Ce que la peur a fabriqué',
        texte:
          'Les deux Grands viennent de découvrir qu’ils peuvent se détruire par accident, faute de pouvoir se parler assez vite : pendant la crise, un message mettait des heures à traverser. Le **20 juin 1963**, une ligne directe est installée entre la Maison-Blanche et le Kremlin — le fameux **téléphone rouge**, qui n’est ni un téléphone ni rouge, mais un téléscripteur. Le **5 août 1963**, le traité de Moscou interdit les essais nucléaires dans l’atmosphère, sous l’eau et dans l’espace. C’est le début de la **Détente** : les deux blocs restent ennemis, la course aux armements continue, mais on installe des règles pour que la peur ne décide pas toute seule. Cuba, elle, reste communiste et sous embargo américain pendant plus d’un demi-siècle.',
      },
    ],
    consequences: [
      'Les missiles soviétiques sont retirés de Cuba, contre l’engagement américain de ne jamais envahir l’île.',
      'Les missiles américains Jupiter quittent discrètement la Turquie en avril 1963.',
      'Une ligne directe — le « téléphone rouge » — relie la Maison-Blanche et le Kremlin à partir du 20 juin 1963.',
      'Le traité de Moscou du 5 août 1963 interdit les essais nucléaires dans l’atmosphère : premier accord de désarmement.',
      'Khrouchtchev, jugé trop imprudent puis trop conciliant, est écarté du pouvoir en octobre 1964.',
      'La Détente s’ouvre entre les deux blocs, sans mettre fin à la course aux armements.',
    ],
    chiffres: [
      { valeur: '13', quoi: 'jours de crise, du 16 au 28 octobre 1962' },
      { valeur: '150 km', quoi: 'entre Cuba et les côtes de Floride' },
      { valeur: '42', quoi: 'missiles soviétiques déjà acheminés vers Cuba' },
      { valeur: 'DEFCON 2', quoi: 'niveau d’alerte américain, le plus élevé jamais atteint' },
    ],
    chrono: [
      { date: '1er janvier 1959', fait: 'Fidel Castro prend le pouvoir à Cuba.' },
      { date: 'avril 1961', fait: 'Échec du débarquement de la baie des Cochons.' },
      { date: 'été 1962', fait: 'Opération Anadyr : missiles soviétiques envoyés à Cuba.' },
      { date: '14 octobre 1962', fait: 'Un U-2 photographie les rampes de lancement.' },
      { date: '22 octobre 1962', fait: 'Kennedy annonce la quarantaine à la télévision.' },
      { date: '24 octobre 1962', fait: 'Les cargos soviétiques font demi-tour.' },
      { date: '27 octobre 1962', fait: '« Samedi noir » : un U-2 abattu au-dessus de Cuba.' },
      { date: '28 octobre 1962', fait: 'Khrouchtchev annonce le retrait des missiles.' },
      { date: '20 juin 1963', fait: 'Installation de la ligne directe Washington-Moscou.' },
      { date: '5 août 1963', fait: 'Traité de Moscou sur les essais nucléaires.' },
    ],
    leSaisTu:
      'Le 27 octobre 1962, le sous-marin soviétique B-59, traqué au large de Cuba et privé de radio, croit la guerre commencée. Son commandant veut tirer une torpille à charge nucléaire ; il faut l’accord de trois officiers. Le second, Vassili Arkhipov, refuse. Le sous-marin remonte à la surface. Trois hommes dans un cylindre d’acier ont décidé de la suite du siècle.',
    aRetenir: [
      'En octobre 1962, l’URSS installe en secret des missiles nucléaires à Cuba, à 150 km des États-Unis.',
      'Kennedy répond par un blocus naval annoncé à la télévision le 22 octobre 1962.',
      'Le 28 octobre, Khrouchtchev retire les missiles ; les États-Unis promettent de ne pas envahir Cuba.',
      'La crise de Cuba est le moment où la guerre froide a été le plus près de devenir une guerre nucléaire.',
      'Elle débouche sur le « téléphone rouge » (1963) et sur le premier traité limitant les essais nucléaires.',
    ],
    mots: [
      {
        mot: 'Guerre froide',
        sens: 'Affrontement entre les blocs américain et soviétique (1947-1991) qui use de tous les moyens sauf la guerre directe.',
      },
      {
        mot: 'Quarantaine',
        sens: 'Nom donné par Kennedy au blocus naval de Cuba : un blocus déclaré serait juridiquement un acte de guerre.',
      },
      {
        mot: 'Dissuasion nucléaire',
        sens: 'Stratégie qui empêche l’attaque en garantissant à l’agresseur une riposte destructrice — « l’équilibre de la terreur ».',
      },
      {
        mot: 'Détente',
        sens: 'Période d’apaisement entre les deux blocs, des années 1960 au milieu des années 1970, faite d’accords et de rencontres.',
      },
    ],
    lies: ['mur-de-berlin', 'premiers-pas-sur-la-lune', 'hiroshima'],
    niveaux: ['3e', 'Tle'],
    programme: 'Un monde bipolaire au temps de la guerre froide',
    tags: [
      'crise de Cuba',
      'Cuba',
      'Castro',
      'Kennedy',
      'Khrouchtchev',
      'missiles',
      'guerre froide',
      'blocus',
      'U-2',
      'téléphone rouge',
      'baie des Cochons',
      'octobre 1962',
    ],
  },
  {
    id: 'premiers-pas-sur-la-lune',
    volet: 'evenements',
    nom: 'Les premiers pas sur la Lune',
    date: '21 juillet 1969',
    tri: 1969,
    periode: 'contemporain',
    emoji: '🚀',
    lieu: 'Mer de la Tranquillité, sur la Lune',
    accroche:
      'À 3 h 56 du matin, heure de Paris, un homme pose le pied sur un autre monde — et six cents millions de personnes le regardent en direct.',
    citations: [
      {
        texte: 'That’s one small step for man, one giant leap for mankind.',
        qui: 'Neil Armstrong',
        contexte:
          'En posant le pied gauche sur le sol lunaire, le 21 juillet 1969 à 2 h 56 (temps universel).',
        sens:
          '« C’est un petit pas pour l’homme, un bond de géant pour l’humanité. » Armstrong a toujours soutenu avoir dit « for a man », « pour un homme » : la radio a mangé l’article.',
      },
      {
        texte: 'Poyekhali !',
        qui: 'Iouri Gagarine',
        contexte: 'Au décollage de Vostok 1, le 12 avril 1961 : le premier homme dans l’espace.',
        sens: '« On y va ! » en russe. Huit ans séparent ce cri du premier pas sur la Lune.',
      },
      {
        texte:
          'I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the Moon and returning him safely to the Earth.',
        qui: 'John Fitzgerald Kennedy',
        contexte: 'Devant le Congrès des États-Unis, le 25 mai 1961, six semaines après le vol de Gagarine.',
        sens:
          '« Cette nation doit se donner pour but, avant la fin de la décennie, de poser un homme sur la Lune et de le ramener sain et sauf sur la Terre. » Un pari public, avec une date : impossible de reculer.',
      },
      {
        texte: 'Houston, Tranquility Base here. The Eagle has landed.',
        qui: 'Neil Armstrong',
        contexte: 'Premiers mots après l’alunissage du module, le 20 juillet 1969 à 20 h 17 (temps universel).',
        sens:
          '« Ici Houston, base de la Tranquillité. L’Aigle s’est posé. » Au centre de contrôle, un ingénieur répond qu’ils étaient « en train de virer au bleu » : il restait une vingtaine de secondes de carburant.',
      },
    ],
    reperes: [
      'Le 4 octobre 1957, l’URSS met en orbite Spoutnik 1, premier satellite artificiel : l’Amérique se découvre seconde.',
      'Le 12 avril 1961, Iouri Gagarine fait le tour de la Terre en 108 minutes : premier homme dans l’espace.',
      'Le 25 mai 1961, Kennedy promet au Congrès un Américain sur la Lune avant la fin de la décennie.',
      'Apollo 11 décolle le 16 juillet 1969 sur une fusée Saturn V de 110 mètres, avec Armstrong, Aldrin et Collins.',
      'Armstrong et Aldrin passent 2 h 31 hors du module ; Michael Collins reste seul en orbite autour de la Lune.',
    ],
    causes: [
      'La guerre froide : l’espace devient le terrain où chaque bloc prouve la supériorité de sa science, de son industrie et de son système.',
      'Les fusées héritées des V2 allemandes, avec Wernher von Braun aux États-Unis et Sergueï Korolev en URSS.',
      'Le choc de Spoutnik en 1957 : une bille de 83 kg qui bipe au-dessus des États-Unis et prouve que l’URSS peut aussi envoyer une bombe.',
      'La création de la NASA en 1958 et un budget spatial porté jusqu’à plus de 4 % des dépenses fédérales.',
      'Le vol de Gagarine et l’échec de la baie des Cochons, la même semaine d’avril 1961 : Kennedy a besoin d’une victoire.',
      'L’assassinat de Kennedy en 1963, qui transforme son pari en engagement moral que personne n’ose annuler.',
    ],
    recit: [
      {
        titre: 'Spoutnik, le bip qui affole l’Amérique',
        texte:
          'Le **4 octobre 1957**, une sphère de 83 kg hérissée d’antennes tourne autour de la Terre en émettant un bip que n’importe quel radioamateur peut capter. **Spoutnik 1** n’a aucune utilité militaire directe, mais il dit une chose terrible aux Américains : la fusée qui a mis cet objet en orbite peut y mettre une bombe. Un mois plus tard, la chienne **Laïka** devient le premier être vivant en orbite. La réponse américaine, la fusée Vanguard, explose en décembre 1957 sur son pas de tir devant les caméras : la presse titre « Flopnik ». En juillet **1958**, les États-Unis créent la **NASA**, agence civile, et rouvrent leurs programmes scolaires de sciences. La course à l’espace commence sur une humiliation.',
      },
      {
        titre: 'Gagarine, et le pari de Kennedy',
        texte:
          'Le **12 avril 1961**, **Iouri Gagarine**, vingt-sept ans, boucle une orbite complète en **108 minutes** à bord de Vostok 1. Nouveau coup dur : le premier Américain, Alan Shepard, ne fera qu’un saut de quinze minutes trois semaines plus tard. Kennedy demande à ses conseillers s’il existe un domaine spatial où l’Amérique puisse encore arriver première. Réponse : la Lune, parce que tout y reste à inventer. Le **25 mai 1961**, il prend l’engagement devant le Congrès — un homme sur la Lune et son retour, **avant la fin de la décennie**. Le programme **Apollo** emploiera jusqu’à **400 000 personnes**, 20 000 entreprises et universités, et coûtera environ 25 milliards de dollars de l’époque. Le 12 septembre 1962, à Houston, Kennedy ajoute la phrase qui restera : nous choisissons d’aller sur la Lune non parce que c’est facile, mais parce que c’est difficile.',
      },
      {
        titre: 'Le prix du chemin',
        texte:
          'La route n’a rien d’une marche triomphale. Le **27 janvier 1967**, un incendie éclate dans la cabine d’**Apollo 1** pendant un essai au sol : Grissom, White et Chaffee meurent en quelques secondes, dans une capsule dont la trappe s’ouvrait vers l’intérieur. Le programme est arrêté vingt mois, la capsule entièrement repensée. Côté soviétique, le coup est plus rude encore : **Sergueï Korolev**, l’ingénieur en chef qui a tout conçu et dont le nom est resté secret jusqu’à sa mort, disparaît en janvier 1966, et sa fusée géante **N-1** explose à chacun de ses quatre essais. À Noël **1968**, **Apollo 8** tourne autour de la Lune sans se poser, et ses trois hommes envoient la photo d’une Terre bleue se levant au-dessus d’un horizon gris. La course est déjà gagnée ; il reste à se poser.',
      },
      {
        titre: 'Vingt secondes de carburant',
        texte:
          '**16 juillet 1969**, 13 h 32 TU : la **Saturn V**, 110 mètres et 3 000 tonnes, arrache Apollo 11 du pas de tir de Floride. Quatre jours plus tard, **Armstrong** et **Aldrin** descendent vers la mer de la Tranquillité à bord du module **Eagle**, pendant que **Collins** reste en orbite. La descente tourne mal : l’ordinateur de bord, moins puissant qu’une calculatrice d’aujourd’hui, lance des alarmes « 1202 » parce qu’il est saturé de données, et le pilote automatique vise un cratère semé de blocs gros comme des voitures. Armstrong prend les commandes à la main et cherche une surface plate, trente secondes de plus, quarante. Le **20 juillet à 20 h 17 TU**, Eagle se pose ; il reste une vingtaine de secondes de carburant. Six heures et demie plus tard, dans la nuit du 20 au 21 juillet, la caméra fixée à l’échelle s’allume.',
      },
      {
        titre: 'Le direct',
        texte:
          'L’image est floue, en noir et blanc, et c’est l’une des plus vues de l’histoire : environ **600 millions** de personnes, un sixième de l’humanité, regardent Armstrong descendre les neuf barreaux de l’échelle. Il est **2 h 56 TU** le 21 juillet — 3 h 56 à Paris. Aldrin le rejoint vingt minutes plus tard et décrit un paysage de « magnifique désolation ». Ils resteront **2 h 31** dehors : plaque commémorative (« Nous sommes venus en paix au nom de toute l’humanité »), drapeau maintenu par une tringle parce qu’il n’y a pas de vent, sismomètre, réflecteur laser encore utilisé aujourd’hui pour mesurer la distance Terre-Lune, et **21,5 kg** de roches. Puis il faut redécoller : le module n’a qu’un seul moteur, sans secours. Le 24 juillet, la capsule amerrit dans le Pacifique.',
      },
      {
        titre: 'Après la Lune',
        texte:
          'Douze hommes marcheront sur la Lune, tous américains, entre 1969 et décembre **1972** et le retour d’**Apollo 17** — puis plus personne. L’URSS, distancée, abandonne son programme lunaire et se tourne vers les stations orbitales. La rivalité laisse la place à la coopération : en **1975**, une capsule Apollo et un vaisseau Soyouz s’amarrent en orbite et leurs équipages se serrent la main, en pleine Détente ; la **Station spatiale internationale**, assemblée à partir de 1998, en est l’héritière. Les retombées techniques du programme — informatique embarquée, matériaux, télécommunications par satellite — irriguent la vie quotidienne. Et la photo de la Terre vue de là-bas, petite, bleue et sans frontières, nourrit une idée neuve dans les années 1970 : que cette planète est un objet fragile et unique.',
      },
    ],
    consequences: [
      'Les États-Unis gagnent la course à l’espace ; l’URSS renonce à son programme lunaire habité.',
      'Douze hommes marchent sur la Lune entre 1969 et 1972, puis plus aucun jusqu’à aujourd’hui.',
      'Près de 400 kg de roches lunaires sont rapportés au total et renouvellent la connaissance du Système solaire.',
      'Les retombées techniques d’Apollo touchent l’informatique embarquée, les matériaux et les télécommunications par satellite.',
      'La rivalité laisse place à la coopération spatiale : Apollo-Soyouz en 1975, puis la Station spatiale internationale.',
      'L’image de la Terre vue de l’espace devient un symbole de la prise de conscience écologique.',
    ],
    chiffres: [
      { valeur: '600 millions', quoi: 'de téléspectateurs devant le direct' },
      { valeur: '384 400 km', quoi: 'entre la Terre et la Lune' },
      { valeur: '2 h 31', quoi: 'passées hors du module par Armstrong et Aldrin' },
      { valeur: '400 000', quoi: 'personnes employées par le programme Apollo' },
    ],
    chrono: [
      { date: '4 octobre 1957', fait: 'Spoutnik 1, premier satellite artificiel.' },
      { date: '12 avril 1961', fait: 'Gagarine, premier homme dans l’espace.' },
      { date: '25 mai 1961', fait: 'Kennedy promet la Lune avant la fin de la décennie.' },
      { date: '27 janvier 1967', fait: 'Incendie d’Apollo 1 : trois astronautes tués.' },
      { date: '24 décembre 1968', fait: 'Apollo 8 fait le tour de la Lune.' },
      { date: '16 juillet 1969', fait: 'Décollage d’Apollo 11.' },
      { date: '20 juillet 1969', fait: 'Le module Eagle se pose à 20 h 17 TU.' },
      { date: '21 juillet 1969', fait: 'Armstrong marche sur la Lune à 2 h 56 TU.' },
      { date: '24 juillet 1969', fait: 'Amerrissage dans le Pacifique.' },
      { date: 'décembre 1972', fait: 'Apollo 17 : dernier homme sur la Lune.' },
    ],
    leSaisTu:
      'En remontant dans le module, Aldrin casse d’un coup de sac à dos le disjoncteur qui commande l’allumage du moteur de remontée. Sans lui, les deux hommes restaient sur place. Aldrin enfonce un feutre dans la fente pour rétablir le contact : le décollage d’une autre planète a tenu à un stylo. Il l’a gardé.',
    aRetenir: [
      'Le 21 juillet 1969, Neil Armstrong est le premier homme à marcher sur la Lune, avec Buzz Aldrin.',
      'La course à l’espace oppose l’URSS (Spoutnik 1957, Gagarine 1961) et les États-Unis pendant la guerre froide.',
      'Le 25 mai 1961, Kennedy engage son pays à poser un homme sur la Lune avant la fin de la décennie.',
      'Environ 600 millions de personnes suivent l’événement en direct à la télévision.',
      'Douze hommes ont marché sur la Lune, tous entre 1969 et 1972.',
    ],
    mots: [
      {
        mot: 'Course à l’espace',
        sens: 'Compétition entre États-Unis et URSS, de 1957 à 1975, pour prouver dans l’espace la supériorité de son camp.',
      },
      {
        mot: 'Module lunaire',
        sens: 'Petit vaisseau en deux étages qui se détache du vaisseau principal pour descendre sur la Lune et en repartir.',
      },
      {
        mot: 'Temps universel',
        sens: 'Heure de référence mondiale, notée TU ; en juillet 1969, il fallait ajouter une heure pour avoir l’heure de Paris.',
      },
    ],
    lies: ['crise-de-cuba', 'mur-de-berlin', 'hiroshima'],
    niveaux: ['3e'],
    programme: 'Un monde bipolaire au temps de la guerre froide',
    tags: [
      'Lune',
      'Apollo 11',
      'Armstrong',
      'Aldrin',
      'Gagarine',
      'Spoutnik',
      'NASA',
      'conquête spatiale',
      'course à l’espace',
      'Kennedy',
      'Saturn V',
      '1969',
    ],
  },
  {
    id: 'chute-du-mur-de-berlin',
    volet: 'evenements',
    nom: 'La chute du mur de Berlin',
    date: '9 novembre 1989',
    tri: 1989,
    periode: 'contemporain',
    emoji: '🔨',
    lieu: 'Berlin, Allemagne',
    accroche:
      'Un porte-parole mal informé lit une note de travers à la télévision — et le soir même, les Berlinois passent le mur qui tenait depuis vingt-huit ans.',
    citations: [
      {
        texte: 'Das tritt nach meiner Kenntnis… ist das sofort, unverzüglich.',
        qui: 'Günter Schabowski',
        contexte:
          'En conférence de presse à Berlin-Est, le 9 novembre 1989 à 18 h 53, en cherchant dans ses notes quand la mesure entre en vigueur.',
        sens:
          '« Cela prend effet, pour autant que je sache… immédiatement, sans délai. » La mesure devait s’appliquer le lendemain, avec des formalités. Personne ne rattrapera la phrase.',
      },
      {
        texte: 'Mr. Gorbachev, tear down this wall!',
        qui: 'Ronald Reagan',
        contexte: 'Devant la porte de Brandebourg, côté Berlin-Ouest, le 12 juin 1987.',
        sens:
          '« Monsieur Gorbatchev, abattez ce mur ! » Le Département d’État avait demandé trois fois de retirer la phrase du discours ; Reagan l’a gardée.',
      },
      {
        texte: 'Jetzt wächst zusammen, was zusammengehört.',
        qui: 'Willy Brandt',
        contexte:
          'À Berlin, le 10 novembre 1989 ; ancien maire de Berlin-Ouest en 1961, il avait vu monter le Mur.',
        sens:
          '« Maintenant grandit ensemble ce qui va ensemble. » L’homme de l’Ostpolitik annonce en une phrase la réunification, qui aura lieu onze mois plus tard.',
      },
      {
        texte: 'Wer zu spät kommt, den bestraft das Leben.',
        qui: 'Mikhaïl Gorbatchev',
        contexte:
          'Formule prêtée à Gorbatchev à Berlin-Est, le 7 octobre 1989, pour le 40ᵉ anniversaire de la RDA.',
        sens:
          '« Celui qui arrive trop tard, la vie le punit. » C’est la version retenue par la presse d’une phrase plus longue de son interprète, adressée à un Honecker qui refusait toute réforme.',
        incertaine: true,
      },
    ],
    reperes: [
      'Depuis 1985, Gorbatchev lance la perestroïka et la glasnost, et renonce à envoyer les chars chez les alliés de l’URSS.',
      'Le 2 mai 1989, la Hongrie ouvre sa frontière avec l’Autriche : le rideau de fer est percé.',
      'Chaque lundi à Leipzig, les manifestations grossissent : 70 000 personnes le 9 octobre, 300 000 le 6 novembre.',
      'Le 9 novembre à 18 h 53, Günter Schabowski annonce l’ouverture des frontières « immédiatement, sans délai ».',
      'Vers 23 h 30, le poste de Bornholmer Strasse ouvre sa barrière : la foule passe sans un coup de feu.',
      'L’Allemagne est réunifiée le 3 octobre 1990 ; l’URSS disparaît le 25 décembre 1991.',
    ],
    causes: [
      'L’échec économique du bloc de l’Est : pénuries, dette extérieure, retard technologique, usines hors d’âge.',
      'L’arrivée de Mikhaïl Gorbatchev en 1985, la perestroïka, la glasnost et l’abandon de la doctrine Brejnev qui autorisait l’intervention militaire chez les alliés.',
      'L’exemple polonais : Solidarność légalisée, élections semi-libres de juin 1989, premier gouvernement non communiste du bloc.',
      'L’ouverture de la frontière hongroise en mai 1989, par laquelle des dizaines de milliers d’Allemands de l’Est s’échappent.',
      'Les manifestations pacifiques du lundi, à Leipzig puis dans toute la RDA, que le pouvoir n’ose pas réprimer.',
      'La paralysie des dirigeants est-allemands : Honecker écarté le 18 octobre, un nouveau règlement rédigé dans l’urgence et mal expliqué.',
    ],
    recit: [
      {
        titre: 'Gorbatchev change les règles',
        texte:
          'Arrivé au pouvoir en mars **1985**, **Mikhaïl Gorbatchev** veut sauver le système soviétique en le réformant : c’est la **perestroïka** (restructuration) et la **glasnost** (transparence). Il en tire une conséquence que ses prédécesseurs n’avaient jamais admise : l’URSS n’enverra plus ses chars pour tenir ses alliés, comme elle l’avait fait à Budapest en 1956 et à Prague en 1968. Un porte-parole soviétique la baptise en plaisantant la « doctrine Sinatra » : chaque pays fait les choses *à sa façon*. Le **7 octobre 1989**, Gorbatchev vient à Berlin-Est pour le quarantième anniversaire de la RDA. Dans la rue, la foule crie son nom face à un **Erich Honecker** de soixante-dix-sept ans qui refuse toute réforme. Les dirigeants d’Europe de l’Est viennent de comprendre qu’ils sont seuls.',
      },
      {
        titre: 'Le rideau se perce par la Hongrie',
        texte:
          'Le **2 mai 1989**, des soldats hongrois commencent à couper les barbelés de la frontière autrichienne. Le 19 août, à l’occasion d’un « pique-nique paneuropéen » près de Sopron, un poste est ouvert quelques heures : six cents Allemands de l’Est en profitent pour passer à l’Ouest, sans qu’un coup de feu soit tiré. Le **11 septembre**, la Hongrie ouvre officiellement sa frontière : **30 000** Allemands de l’Est passent en trois semaines. D’autres s’entassent par milliers dans les jardins de l’ambassade de RFA à Prague, jusqu’à ce que des trains spéciaux les emmènent vers l’Ouest — en traversant la RDA, ce qui provoque des émeutes dans les gares. Le Mur n’a pas bougé d’un centimètre, mais il ne sert plus à rien : on sort de RDA par Budapest.',
      },
      {
        titre: 'Les lundis de Leipzig',
        texte:
          'À **Leipzig**, la Nikolaikirche organise depuis des années une prière pour la paix le lundi soir. À l’automne 1989, les fidèles sortent de l’église en cortège, et le cortège grossit chaque semaine. Leur slogan tient en quatre mots : « **Wir sind das Volk** » — nous sommes le peuple. Le **9 octobre**, ils sont **70 000** face à 8 000 policiers et miliciens, avec des hôpitaux qui ont reçu l’ordre de préparer des lits et des réserves de sang. Personne ne donne l’ordre de tirer. Ce soir-là, la RDA perd la partie. Le 18 octobre, **Honecker** démissionne ; le 4 novembre, un million de personnes manifestent à Berlin-Est ; le 7 novembre, le gouvernement entier démissionne. Le nouveau pouvoir cherche une mesure spectaculaire pour reprendre la main : il décide d’assouplir les règles de voyage.',
      },
      {
        titre: 'La conférence de presse du 9 novembre',
        texte:
          'Le **9 novembre 1989**, en fin d’après-midi, **Günter Schabowski** tient la conférence de presse quotidienne du parti. Il n’a pas assisté à la réunion où le nouveau règlement a été adopté ; on lui a glissé une note. À **18 h 53**, un journaliste italien demande quand la mesure entre en vigueur. Schabowski cherche dans ses papiers, hésite, puis lâche : « immédiatement, sans délai ». Le texte prévoyait une entrée en vigueur le lendemain, avec des demandes à déposer. Les télévisions ouest-allemandes, que regardent presque tous les Est-Allemands, annoncent que la frontière est ouverte. Vers 21 heures, les postes sont assiégés par des milliers de personnes. Les gardes appellent leur hiérarchie : personne ne décide. À **23 h 30**, à **Bornholmer Strasse**, le lieutenant-colonel **Harald Jäger** lève la barrière de sa propre autorité. La foule passe. Sur les trottoirs de l’Ouest, on crie « *Wahnsinn !* », c’est de la folie.',
      },
      {
        titre: 'Ce qui suit, très vite',
        texte:
          'Dès le lendemain, des Berlinois montent sur le Mur devant la porte de Brandebourg, et les **Mauerspechte**, les « piverts du Mur », attaquent le béton au marteau et au burin. Plus de deux millions d’Allemands de l’Est visitent l’Ouest le premier week-end. Tout s’accélère : premières élections libres de RDA en mars **1990**, union monétaire le 1er juillet, traité « **deux plus quatre** » signé en septembre par les deux Allemagnes et les quatre vainqueurs de 1945, et **réunification le 3 octobre 1990**. En Europe de l’Est, les régimes tombent les uns après les autres en quelques semaines — révolution de velours en Tchécoslovaquie, chute des Ceaușescu en Roumanie. Le **25 décembre 1991**, Gorbatchev démissionne et l’**URSS** cesse d’exister. La guerre froide est finie ; le monde n’a plus deux camps.',
      },
    ],
    consequences: [
      'La RDA s’effondre : élections libres en mars 1990, union monétaire en juillet, disparition en octobre.',
      'L’Allemagne est réunifiée le 3 octobre 1990, avec l’accord des quatre vainqueurs de 1945 (traité « deux plus quatre »).',
      'Les régimes communistes d’Europe de l’Est tombent en quelques semaines, de Prague à Bucarest.',
      'L’URSS disparaît le 25 décembre 1991 : la guerre froide s’achève et le monde cesse d’être bipolaire.',
      'L’Europe occidentale accélère son union : traité de Maastricht en 1992, puis élargissement à l’Est en 2004.',
      'Berlin redevient la capitale de l’Allemagne ; le gouvernement s’y réinstalle en 1999.',
    ],
    chiffres: [
      { valeur: '18 h 53', quoi: 'l’heure de la phrase de Schabowski' },
      { valeur: '28 ans', quoi: 'de mur, du 13 août 1961 au 9 novembre 1989' },
      { valeur: '300 000', quoi: 'manifestants à Leipzig le 6 novembre 1989' },
      { valeur: '2 millions', quoi: 'd’Allemands de l’Est venus à l’Ouest le premier week-end' },
    ],
    chrono: [
      { date: 'mars 1985', fait: 'Gorbatchev arrive au pouvoir en URSS.' },
      { date: '12 juin 1987', fait: 'Reagan à Berlin : « Abattez ce mur ! »' },
      { date: '2 mai 1989', fait: 'La Hongrie ouvre sa frontière avec l’Autriche.' },
      { date: '9 octobre 1989', fait: '70 000 manifestants à Leipzig ; la police ne tire pas.' },
      { date: '18 octobre 1989', fait: 'Démission d’Erich Honecker.' },
      { date: '9 novembre 1989', fait: '18 h 53 : la phrase de Schabowski.' },
      { date: '9 novembre 1989', fait: '23 h 30 : Bornholmer Strasse ouvre la barrière.' },
      { date: '3 octobre 1990', fait: 'Réunification de l’Allemagne.' },
      { date: '25 décembre 1991', fait: 'Disparition de l’URSS.' },
    ],
    leSaisTu:
      'Harald Jäger, l’officier de garde de Bornholmer Strasse, a appris l’ouverture de la frontière à la télévision, en mangeant. Il a appelé sa hiérarchie toute la soirée ; un supérieur l’a traité de lâche devant ses hommes. À 23 h 30, avec 20 000 personnes devant sa barrière et aucun ordre, il a dit : « Ouvrez tout. » Personne ne lui avait rien demandé.',
    aRetenir: [
      'Le mur de Berlin s’ouvre dans la nuit du 9 au 10 novembre 1989, après une annonce mal formulée de Günter Schabowski.',
      'La perestroïka de Gorbatchev et le refus d’intervenir militairement rendent possible la chute des régimes de l’Est.',
      'L’ouverture de la frontière hongroise (mai 1989) et les manifestations de Leipzig préparent le 9 novembre.',
      'L’Allemagne est réunifiée le 3 octobre 1990 ; l’URSS disparaît le 25 décembre 1991.',
      'La chute du Mur marque la fin de la guerre froide et d’un monde partagé en deux blocs.',
    ],
    mots: [
      {
        mot: 'Perestroïka',
        sens: 'La « restructuration » de l’économie et des institutions soviétiques engagée par Gorbatchev à partir de 1985.',
      },
      {
        mot: 'Glasnost',
        sens: 'La « transparence » : liberté de parler et d’écrire sur les problèmes du pays, accordée par Gorbatchev.',
      },
      {
        mot: 'Doctrine Brejnev',
        sens: 'Principe soviétique autorisant l’intervention militaire chez un allié qui s’écarte du communisme ; abandonné en 1989.',
      },
      {
        mot: 'Réunification',
        sens: 'Fusion de la RDA et de la RFA en un seul État, réalisée le 3 octobre 1990.',
      },
    ],
    lies: ['mur-de-berlin', 'traite-de-maastricht', 'francois-mitterrand', 'crise-de-cuba', 'attentats-du-11-septembre-2001'],
    niveaux: ['3e', 'Tle'],
    programme: 'Un monde nouveau depuis 1989',
    tags: [
      'chute du Mur',
      'Berlin',
      '9 novembre 1989',
      'Schabowski',
      'Gorbatchev',
      'perestroïka',
      'Leipzig',
      'RDA',
      'réunification',
      'guerre froide',
      'URSS',
      'Reagan',
    ],
  },
  {
    id: 'traite-de-maastricht',
    volet: 'evenements',
    nom: 'Le traité de Maastricht',
    date: '7 février 1992',
    tri: 1992,
    periode: 'contemporain',
    emoji: '🤝',
    lieu: 'Maastricht, Pays-Bas',
    accroche:
      'Douze États signent un traité qui change un marché commun en Union européenne : une citoyenneté, une monnaie unique, et une France coupée en deux.',
    citations: [
      {
        texte: 'Le nationalisme, c’est la guerre.',
        qui: 'François Mitterrand',
        contexte:
          'Devant le Parlement européen, à Strasbourg, le 17 janvier 1995 : son dernier discours européen, trois ans après Maastricht.',
        sens:
          'Mitterrand, ancien prisonnier de guerre, résume ce que l’Europe doit empêcher : c’est l’argument qu’il oppose aux adversaires du traité pendant toute la campagne de 1992.',
      },
      {
        texte: 'Die deutsche Einheit und die europäische Einigung sind zwei Seiten derselben Medaille.',
        qui: 'Helmut Kohl',
        contexte: 'Formule répétée par le chancelier allemand entre 1990 et 1992, à propos de Maastricht.',
        sens:
          '« L’unité allemande et l’unification européenne sont les deux faces d’une même médaille. » L’Allemagne réunifiée accepte de perdre son mark pour rassurer ses voisins.',
      },
      {
        texte: 'On ne tombe pas amoureux d’un grand marché.',
        qui: 'Jacques Delors',
        contexte:
          'Président de la Commission européenne de 1985 à 1995, pour expliquer que l’Europe ne peut se réduire à l’économie.',
        sens:
          'Une union qui ne serait qu’un espace de libre-échange n’attacherait personne : d’où la citoyenneté européenne et le « pilier » politique ajoutés à Maastricht.',
      },
    ],
    reperes: [
      'Signé le 7 février 1992 à Maastricht par les Douze, il entre en vigueur le 1er novembre 1993.',
      'La Communauté économique européenne devient l’Union européenne, bâtie sur trois piliers.',
      'Il crée une citoyenneté européenne : circuler, s’installer, voter aux municipales et aux européennes là où l’on vit.',
      'Il fixe le calendrier de la monnaie unique et ses critères : déficit public sous 3 % du PIB, dette sous 60 %.',
      'En France, le référendum du 20 septembre 1992 l’approuve par 51,04 % des voix contre 48,96 %.',
    ],
    causes: [
      'L’Acte unique de 1986 et le grand marché de 1993 : la libre circulation des marchandises appelait une monnaie stable.',
      'La chute du Mur et la réunification allemande de 1990 : il fallait ancrer une Allemagne de 80 millions d’habitants dans l’Europe.',
      'L’instabilité monétaire : les dévaluations à répétition désorganisaient les échanges entre les Douze.',
      'Le rapport Delors de 1989, qui trace en trois étapes le chemin de l’union économique et monétaire.',
      'L’entente entre François Mitterrand et Helmut Kohl, décidés à passer de l’Europe des marchandises à l’Europe politique.',
      'La guerre qui éclate en Yougoslavie en 1991, et qui montre l’impuissance diplomatique européenne.',
    ],
    recit: [
      {
        titre: 'De Rome à Maastricht',
        texte:
          'Le **traité de Rome** (25 mars 1957) avait créé une **Communauté économique européenne** à six, autour d’un marché commun et d’une politique agricole. Trente-cinq ans plus tard, ils sont douze : Royaume-Uni, Irlande et Danemark entrés en 1973, Grèce en 1981, Espagne et Portugal en 1986. L’**Acte unique** (1986) fixe au 1er janvier 1993 l’achèvement du **marché unique** — libre circulation des marchandises, des services, des capitaux et des personnes —, et les accords de **Schengen** (1985) commencent à supprimer les contrôles aux frontières. Mais un marché de trois cent cinquante millions de consommateurs avec douze monnaies qui se dévaluent les unes contre les autres fonctionne mal. Le rapport **Delors** de 1989 tire la conséquence : il faut une monnaie unique, donc un traité.',
      },
      {
        titre: 'Ce que le traité crée',
        texte:
          'Maastricht ne modifie pas un détail : il change le nom et la nature de la chose. La Communauté devient l’**Union européenne**, bâtie sur trois « piliers » : les communautés existantes, la **politique étrangère et de sécurité commune**, et la coopération en matière de justice et de police. Il invente une **citoyenneté européenne** qui s’ajoute — sans la remplacer — à la nationalité : droit de circuler et de séjourner, de voter et d’être élu aux **municipales** et aux **européennes** dans son pays de résidence, d’être protégé par l’ambassade de n’importe quel État membre. Il donne au Parlement européen un vrai pouvoir législatif par la **codécision**, crée une **Banque centrale européenne** à Francfort, fixe l’arrivée de la monnaie unique au plus tard en 1999, et inscrit le principe de **subsidiarité** : l’Union n’agit que là où elle est plus efficace que les États.',
      },
      {
        titre: 'Le référendum du 20 septembre 1992',
        texte:
          'Mitterrand n’était pas obligé de consulter les Français : il choisit le **référendum**, annoncé le 3 juin 1992, le lendemain du **non danois** (50,7 %) qui vient de fissurer le projet. La campagne coupe la France en travers des partis : la gauche de gouvernement et une partie de la droite pour le oui ; **Philippe Séguin** et **Charles Pasqua** à droite, une partie de la gauche et les extrêmes pour le non, au nom de la souveraineté nationale. Le débat télévisé Mitterrand-Séguin du 3 septembre à la Sorbonne est suivi par des millions de téléspectateurs. Le **20 septembre 1992**, avec près de 70 % de participation, le oui l’emporte par **51,04 %** contre 48,96 % — environ 537 000 voix d’écart. On l’appellera « le petit oui ». La carte du vote sépare les villes et les métropoles, majoritairement pour, des zones rurales et industrielles, majoritairement contre.',
      },
      {
        titre: 'Ce que Maastricht a mis en route',
        texte:
          'Le traité entre en vigueur le **1er novembre 1993**, après un second référendum danois favorable. Il tient son calendrier : l’**euro** naît comme monnaie de compte le 1er janvier 1999, et en pièces et billets le 1er janvier 2002. L’Union s’élargit — quinze membres en 1995, vingt-cinq en 2004 avec l’entrée des anciens pays de l’Est — et se dote de nouveaux traités : Amsterdam (1997), Nice (2001), Lisbonne (2007). Le droit de vote municipal des citoyens européens s’applique en France à partir de 2001. Mais Maastricht ouvre aussi un débat qui ne s’est jamais refermé : les **critères de convergence** imposent une discipline budgétaire que les électeurs n’ont pas choisie poste par poste, et la question européenne continue de traverser les partis français au lieu de les séparer.',
      },
    ],
    consequences: [
      'La Communauté économique européenne devient l’Union européenne le 1er novembre 1993.',
      'Une citoyenneté européenne s’ajoute à la nationalité : circulation, séjour, vote aux municipales et aux européennes.',
      'Les critères de convergence encadrent les budgets nationaux ; le pacte de stabilité les prolonge en 1997.',
      'La monnaie unique suit le calendrier prévu : euro de compte en 1999, pièces et billets en 2002.',
      'Le Parlement européen gagne un réel pouvoir législatif grâce à la procédure de codécision.',
      'La question européenne coupe durablement les partis français, bien au-delà du référendum de 1992.',
    ],
    chiffres: [
      { valeur: '12', quoi: 'États signataires, le 7 février 1992' },
      { valeur: '51,04 %', quoi: 'de oui au référendum français du 20 septembre 1992' },
      { valeur: '3 %', quoi: 'du PIB : le déficit public maximal exigé' },
      { valeur: '60 %', quoi: 'du PIB : la dette publique maximale exigée' },
    ],
    chrono: [
      { date: '25 mars 1957', fait: 'Traité de Rome : naissance de la CEE à six.' },
      { date: '1986', fait: 'L’Acte unique lance le grand marché pour 1993.' },
      { date: 'avril 1989', fait: 'Le rapport Delors trace l’union monétaire.' },
      { date: '3 octobre 1990', fait: 'Réunification allemande : l’Europe doit s’approfondir.' },
      { date: '7 février 1992', fait: 'Signature du traité de Maastricht.' },
      { date: '2 juin 1992', fait: 'Le Danemark rejette le traité par référendum.' },
      { date: '20 septembre 1992', fait: 'La France dit oui à 51,04 %.' },
      { date: '1er novembre 1993', fait: 'Entrée en vigueur : l’Union européenne existe.' },
      { date: '1er janvier 1999', fait: 'L’euro devient monnaie de compte.' },
      { date: '1er janvier 2002', fait: 'Pièces et billets en euros.' },
    ],
    leSaisTu:
      'Le traité de Maastricht ne contient pas le mot « euro » : il appelle la future monnaie l’« écu », du nom de l’unité de compte européenne créée en 1979 — et d’une vieille pièce d’or française. Le nom « euro » n’est choisi qu’au sommet de Madrid, en décembre 1995, parce qu’il se prononce à peu près pareil dans les onze langues de l’Union.',
    aRetenir: [
      'Le traité de Maastricht est signé le 7 février 1992 par les douze États membres et entre en vigueur le 1er novembre 1993.',
      'Il transforme la CEE en Union européenne et crée une citoyenneté européenne.',
      'Il fixe le passage à la monnaie unique et les critères de convergence (déficit sous 3 %, dette sous 60 % du PIB).',
      'Les Français l’approuvent de justesse par référendum le 20 septembre 1992, à 51,04 % des voix.',
      'La réunification allemande de 1990 est l’une des raisons qui poussent à approfondir l’Union.',
    ],
    mots: [
      {
        mot: 'Union européenne',
        sens: 'L’ensemble créé par le traité de Maastricht, qui ajoute à l’économie une dimension politique, diplomatique et judiciaire.',
      },
      {
        mot: 'Citoyenneté européenne',
        sens: 'Statut qui s’ajoute à la nationalité : circuler, s’installer, voter aux municipales et aux européennes dans son pays de résidence.',
      },
      {
        mot: 'Critères de convergence',
        sens: 'Conditions à remplir pour adopter l’euro : déficit sous 3 % du PIB, dette sous 60 %, inflation et taux maîtrisés.',
      },
      {
        mot: 'Subsidiarité',
        sens: 'Principe selon lequel l’Union n’intervient que si son action est plus efficace que celle des États ou des régions.',
      },
    ],
    lies: [
      'passage-a-l-euro',
      'chute-du-mur-de-berlin',
      'francois-mitterrand',
      'jean-monnet',
      'robert-schuman',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La construction européenne',
    tags: [
      'Maastricht',
      'Union européenne',
      'traité',
      'euro',
      'citoyenneté européenne',
      'Mitterrand',
      'Delors',
      'Kohl',
      'référendum 1992',
      'construction européenne',
      'subsidiarité',
    ],
  },
  {
    id: 'attentats-du-11-septembre-2001',
    volet: 'evenements',
    nom: 'Les attentats du 11 septembre 2001',
    date: '11 septembre 2001',
    tri: 2001,
    periode: 'contemporain',
    emoji: '🕯️',
    lieu: 'New York, Arlington et Shanksville, États-Unis',
    accroche:
      'Quatre avions détournés en une matinée, deux tours effondrées en direct, 2 977 morts : le monde né de la fin de la guerre froide bascule.',
    citations: [
      {
        texte: 'Nous sommes tous Américains.',
        qui: 'Jean-Marie Colombani',
        contexte: 'Titre de son éditorial dans Le Monde, daté du 13 septembre 2001.',
        sens:
          'La formule dit la solidarité immédiate des alliés européens. Elle sera discutée deux ans plus tard, quand la France refusera de suivre les États-Unis en Irak.',
      },
      {
        texte: 'A terrorist attack on one country is an attack on humanity as a whole.',
        qui: 'Kofi Annan',
        contexte:
          'Secrétaire général des Nations unies, devant l’Assemblée générale de l’ONU, le 12 septembre 2001.',
        sens:
          '« Une attaque terroriste contre un pays est une attaque contre l’humanité tout entière. » L’ONU condamne à l’unanimité et reconnaît aux États-Unis le droit de se défendre.',
      },
      {
        texte: 'Either you are with us, or you are with the terrorists.',
        qui: 'George W. Bush',
        contexte: 'Devant le Congrès des États-Unis, le 20 septembre 2001.',
        sens:
          '« Vous êtes avec nous, ou vous êtes avec les terroristes. » Le président américain place le monde devant un choix binaire : c’est l’acte de naissance de la « guerre contre le terrorisme ».',
      },
      {
        texte: 'Let’s roll.',
        qui: 'Todd Beamer',
        contexte:
          'Passager du vol United 93, au téléphone avec une opératrice, avant que les passagers ne tentent de reprendre l’appareil.',
        sens:
          '« On y va. » Prévenus par téléphone de ce qui venait de se passer à New York, les passagers ont voté et sont passés à l’action ; l’avion s’est écrasé en Pennsylvanie.',
      },
    ],
    reperes: [
      'Le matin du 11 septembre 2001, dix-neuf membres d’Al-Qaïda détournent quatre avions de ligne aux États-Unis.',
      'À 8 h 46 et 9 h 03, deux Boeing frappent les tours nord et sud du World Trade Center, à New York.',
      'À 9 h 37, un troisième avion percute le Pentagone ; le quatrième s’écrase à 10 h 03 en Pennsylvanie.',
      'Les deux tours s’effondrent en moins de deux heures ; 2 977 personnes sont tuées, de plus de 90 nationalités.',
      'Les États-Unis et leurs alliés attaquent l’Afghanistan des talibans dès le 7 octobre 2001.',
    ],
    causes: [
      'La formation d’Al-Qaïda autour d’Oussama Ben Laden à partir de 1988, dans le prolongement de la guerre menée en Afghanistan contre l’URSS.',
      'La présence de troupes américaines en Arabie saoudite depuis la guerre du Golfe de 1991, que Ben Laden présente comme une profanation.',
      'L’usage par Al-Qaïda du conflit israélo-palestinien et des sanctions contre l’Irak comme justifications de son action.',
      'Une série d’attentats antérieurs jamais dissuadés : World Trade Center en 1993, ambassades de Nairobi et Dar es Salam en 1998, navire USS Cole en 2000.',
      'La position d’hyperpuissance des États-Unis depuis 1991, qui en fait la cible symbolique d’un terrorisme transnational.',
      'Des failles de sécurité aérienne et de circulation de l’information entre services de renseignement, relevées après coup.',
    ],
    recit: [
      {
        titre: 'Une matinée',
        texte:
          'Le 11 septembre 2001, entre 7 h 59 et 8 h 42, quatre avions de ligne décollent de Boston, Newark et Washington pour la côte Ouest, réservoirs pleins. Chacun est détourné en vol par quatre ou cinq hommes armés de cutters. À **8 h 46**, le vol American Airlines 11 percute la **tour nord** du World Trade Center. On croit d’abord à un accident, les caméras convergent — et à **9 h 03**, devant des millions de téléspectateurs en direct, le vol United 175 entre dans la **tour sud**. À **9 h 37**, le vol American 77 s’écrase sur le **Pentagone**, à Arlington. Le quatrième appareil, le vol **United 93**, a décollé avec quarante minutes de retard : ses passagers, prévenus par téléphone, se jettent sur les pirates. L’avion s’écrase à **10 h 03** dans un champ de Pennsylvanie, à vingt minutes de vol de Washington.',
      },
      {
        titre: 'Les tours',
        texte:
          'Les tours jumelles, 110 étages, 417 mètres, avaient été conçues pour encaisser le choc d’un avion — mais pas l’incendie de plusieurs dizaines de tonnes de kérosène, qui affaiblit les structures d’acier. La **tour sud**, touchée en second mais plus bas, s’effondre à **9 h 59** ; la **tour nord** à **10 h 28**, **102 minutes** après l’impact. Des milliers de personnes ont été évacuées par les escaliers pendant ce temps, croisant les pompiers qui montaient. **343 pompiers** de New York et 71 policiers meurent dans les décombres. Le bilan total est de **2 977 victimes**, hors les dix-neuf pirates : employés de bureau, passagers, secouristes, militaires du Pentagone, de plus de quatre-vingt-dix nationalités. Le déblaiement de **Ground Zero** durera neuf mois.',
      },
      {
        titre: 'Al-Qaïda',
        texte:
          'L’attaque est revendiquée par **Al-Qaïda** (« la base »), organisation fondée en 1988 par **Oussama Ben Laden**, fils d’un richissime entrepreneur saoudien, au moment où s’achève la guerre des moudjahidines contre l’Armée rouge en Afghanistan. Ben Laden rompt avec Riyad après 1991, quand des troupes américaines s’installent en Arabie saoudite, et proclame en 1998 une « guerre » contre les Américains. Réfugié en **Afghanistan** auprès des **talibans**, il y organise des camps d’entraînement. Les dix-neuf pirates du 11 septembre — dont quinze Saoudiens — vivaient depuis des mois aux États-Unis ; quatre d’entre eux avaient pris des cours de pilotage en Floride, sans jamais demander à apprendre l’atterrissage. L’opération n’a coûté qu’environ un demi-million de dollars.',
      },
      {
        titre: 'La riposte',
        texte:
          'Le **12 septembre**, l’**OTAN** invoque pour la première fois de son histoire l’**article 5** de son traité : une attaque contre l’un est une attaque contre tous. L’ONU condamne à l’unanimité. Le **7 octobre 2001**, une coalition attaque l’**Afghanistan** ; le régime taliban tombe en deux mois, mais Ben Laden s’échappe. Aux États-Unis, le **Patriot Act** du 26 octobre élargit fortement les pouvoirs de surveillance, et le camp de **Guantánamo** ouvre en janvier 2002 pour des détenus sans statut. En **2003**, Washington décide d’envahir l’**Irak** en invoquant des armes de destruction massive qu’on ne trouvera jamais : cette fois, il n’y a pas de mandat de l’ONU, et la France s’y oppose — le discours de **Dominique de Villepin** au Conseil de sécurité, le 14 février 2003, est applaudi, fait rarissime dans cette salle. **Ben Laden** est tué au Pakistan le 2 mai 2011.',
      },
      {
        titre: 'Le monde d’après',
        texte:
          'On avait cru, après 1989, que la fin de la guerre froide ouvrait une période sans grand conflit. Le 11 septembre montre que la menace a changé de forme : elle ne vient plus d’un État mais d’un réseau, elle ne vise pas des armées mais des civils, et elle utilise les instruments de la mondialisation — avions de ligne, télévision en direct, transferts bancaires. La **« guerre contre le terrorisme »** devient le cadre de la politique américaine pour vingt ans : deux guerres, des milliers de morts, une surveillance généralisée, des libertés restreintes au nom de la sécurité. Les contrôles d’aéroport de toute la planète en gardent la trace. En **2021**, les États-Unis quittent l’Afghanistan et les talibans reprennent Kaboul. Les attentats djihadistes, eux, ont frappé l’Europe — Madrid en 2004, Londres en 2005, **Paris en 2015**.',
      },
    ],
    consequences: [
      'L’OTAN invoque pour la première fois l’article 5 de son traité : une attaque contre un membre engage tous les autres.',
      'Intervention en Afghanistan dès le 7 octobre 2001 : les talibans tombent, mais la guerre dure jusqu’en 2021.',
      'Le Patriot Act, la surveillance de masse et le camp de Guantánamo font reculer certaines libertés au nom de la sécurité.',
      'Les États-Unis envahissent l’Irak en 2003 sans mandat de l’ONU ; la France s’y oppose au Conseil de sécurité.',
      'La sécurité aérienne est transformée dans le monde entier : contrôles, cockpits blindés, listes de passagers.',
      'Le terrorisme djihadiste devient la principale menace désignée par les démocraties, jusqu’aux attentats de Paris en 2015.',
    ],
    chiffres: [
      { valeur: '2 977', quoi: 'personnes tuées, sans compter les dix-neuf pirates de l’air' },
      { valeur: '343', quoi: 'pompiers de New York morts dans les décombres' },
      { valeur: '102 minutes', quoi: 'entre le premier impact et l’effondrement de la tour nord' },
      { valeur: '4', quoi: 'avions de ligne détournés en une matinée' },
    ],
    chrono: [
      { date: '8 h 46', fait: 'Le vol American 11 percute la tour nord.' },
      { date: '9 h 03', fait: 'Le vol United 175 percute la tour sud.' },
      { date: '9 h 37', fait: 'Le vol American 77 frappe le Pentagone.' },
      { date: '9 h 59', fait: 'La tour sud s’effondre.' },
      { date: '10 h 03', fait: 'Le vol United 93 s’écrase en Pennsylvanie.' },
      { date: '10 h 28', fait: 'La tour nord s’effondre.' },
      { date: '12 septembre 2001', fait: 'L’OTAN invoque l’article 5 pour la première fois.' },
      { date: '7 octobre 2001', fait: 'Début de l’intervention en Afghanistan.' },
      { date: '20 mars 2003', fait: 'Invasion de l’Irak, sans mandat de l’ONU.' },
      { date: '2 mai 2011', fait: 'Mort d’Oussama Ben Laden au Pakistan.' },
    ],
    leSaisTu:
      'Le vol United 93 avait quarante minutes de retard. Ce retard a tout changé : par téléphone, les passagers ont appris ce qui venait d’arriver aux tours, ont compris qu’ils étaient dans une bombe volante, et ont décidé d’agir. L’avion s’est écrasé à Shanksville, à environ vingt minutes de vol de Washington, où il se dirigeait.',
    aRetenir: [
      'Le 11 septembre 2001, Al-Qaïda détourne quatre avions et frappe le World Trade Center et le Pentagone.',
      'Les attentats font 2 977 morts, dont 343 pompiers de New York.',
      'L’OTAN invoque pour la première fois l’article 5 de son traité, le 12 septembre 2001.',
      'Les États-Unis interviennent en Afghanistan dès le 7 octobre 2001, puis en Irak en 2003 sans mandat de l’ONU.',
      'Le 11 septembre ouvre la « guerre contre le terrorisme » et referme l’après-guerre froide commencé en 1989.',
    ],
    mots: [
      {
        mot: 'Al-Qaïda',
        sens: '« La base » en arabe : réseau terroriste djihadiste fondé en 1988 par Oussama Ben Laden, sans territoire propre.',
      },
      {
        mot: 'Terrorisme',
        sens: 'Usage organisé de la violence contre des civils pour terroriser une population et peser sur un pouvoir politique.',
      },
      {
        mot: 'Article 5',
        sens: 'Clause du traité de l’OTAN : une attaque armée contre un membre est considérée comme une attaque contre tous.',
      },
      {
        mot: 'Hyperpuissance',
        sens: 'Mot employé en 1998 par Hubert Védrine pour désigner la domination américaine sans rivale après 1991.',
      },
    ],
    lies: ['chute-du-mur-de-berlin', 'crise-de-cuba', 'hiroshima'],
    niveaux: ['3e', 'Tle'],
    programme: 'Un monde nouveau depuis 1989',
    tags: [
      '11 septembre',
      'World Trade Center',
      'New York',
      'Al-Qaïda',
      'Ben Laden',
      'terrorisme',
      'Bush',
      'Afghanistan',
      'OTAN',
      'Pentagone',
      'tours jumelles',
      '2001',
    ],
  },
  {
    id: 'passage-a-l-euro',
    volet: 'evenements',
    nom: 'Le passage à l’euro',
    date: '1er janvier 2002',
    tri: 2002,
    periode: 'contemporain',
    emoji: '💶',
    lieu: 'Les douze pays de la zone euro',
    accroche:
      'Le 1er janvier 2002, plus de 300 millions d’Européens changent d’argent en une nuit : la plus grande opération monétaire jamais menée.',
    citations: [
      {
        texte: 'L’Europe se fera par la monnaie ou ne se fera pas.',
        qui: 'Jacques Rueff',
        contexte:
          'Économiste français, en 1950, sept ans avant le traité de Rome et cinquante ans avant l’euro.',
        sens:
          'Tant que chaque pays garde sa monnaie, il garde le pouvoir de dévaluer contre ses voisins : partager la monnaie, c’est accepter de ne plus pouvoir le faire.',
      },
      {
        texte:
          'The euro is much more than just a currency; it is a symbol of European integration in every sense of the word.',
        qui: 'Wim Duisenberg',
        contexte:
          'Premier président de la Banque centrale européenne, le 1er janvier 2002, jour de la mise en circulation.',
        sens:
          '« L’euro est bien plus qu’une monnaie : c’est un symbole de l’intégration européenne, dans tous les sens du mot. »',
      },
      {
        texte:
          'Die europäische Einigung ist in Wahrheit eine Frage von Krieg und Frieden im 21. Jahrhundert.',
        qui: 'Helmut Kohl',
        contexte: 'Discours à l’université de Louvain, le 2 février 1996, pour défendre la monnaie unique.',
        sens:
          '« L’unification européenne est en vérité une question de guerre et de paix au XXIᵉ siècle. » Le chancelier allemand demande à son pays d’abandonner le mark, symbole de sa reconstruction.',
      },
    ],
    reperes: [
      'L’euro existe comme monnaie de compte depuis le 1er janvier 1999 ; les pièces et billets n’arrivent que trois ans plus tard.',
      'Douze pays y passent en 2002 : Allemagne, Autriche, Belgique, Espagne, Finlande, France, Grèce, Irlande, Italie, Luxembourg, Pays-Bas, Portugal.',
      'Le taux est fixé une fois pour toutes : un euro vaut 6,55957 francs, sans arrondi possible.',
      'Près de quinze milliards de billets et plus de cinquante milliards de pièces sont fabriqués avant le jour J.',
      'Le franc, né en 1360, cesse d’avoir cours légal le 17 février 2002.',
    ],
    causes: [
      'Le traité de Maastricht (1992), qui fixe le calendrier de la monnaie unique et les conditions pour y entrer.',
      'Le marché unique de 1993 : changer d’argent à chaque frontière coûtait cher aux entreprises comme aux voyageurs.',
      'L’instabilité du Système monétaire européen, secoué par les crises spéculatives de 1992 et 1993.',
      'Les critères de convergence, remplis par onze pays en 1998 puis par la Grèce en 2000, qui rendent l’opération possible.',
      'La volonté franco-allemande d’ancrer définitivement l’Allemagne réunifiée dans l’Europe.',
      'Le besoin d’une monnaie de taille mondiale, capable de compter face au dollar dans les échanges internationaux.',
    ],
    recit: [
      {
        titre: 'De l’écu à l’euro',
        texte:
          'L’idée est ancienne. Après la fin de la convertibilité du dollar en or (1971), les Européens tentent d’abord le « **serpent monétaire** » en 1972, puis le **Système monétaire européen** en 1979, qui limite les écarts entre monnaies et crée une unité de compte, l’**écu**. Le système tient mal : les dévaluations se succèdent, et les crises de 1992-1993 chassent la livre sterling du mécanisme. Le rapport **Delors** de 1989, puis le traité de **Maastricht** en 1992, tranchent : ce sera une monnaie unique, et pas seulement des monnaies alignées. Le nom « euro » est choisi au sommet de **Madrid**, en décembre 1995 — il se prononce à peu près de la même façon dans toutes les langues de l’Union. La **Banque centrale européenne** ouvre à Francfort le 1er juin 1998.',
      },
      {
        titre: 'Les critères de convergence',
        texte:
          'On n’entre pas dans l’euro parce qu’on le souhaite : il faut ressembler assez aux autres pour partager leur monnaie. Maastricht fixe cinq **critères de convergence** : un déficit public inférieur à **3 % du PIB**, une dette publique sous **60 %**, une inflation et des taux d’intérêt à long terme proches des meilleurs élèves, et deux années de stabilité de change. En mai **1998**, onze pays sont jugés prêts ; la **Grèce** les rejoint en 2000. Le **Royaume-Uni** et le **Danemark** avaient négocié à Maastricht le droit de rester dehors ; la **Suède** s’y maintient par un référendum en 2003. Pour respecter les critères, plusieurs gouvernements mènent des politiques d’économies impopulaires : la monnaie unique se paie d’avance.',
      },
      {
        titre: 'Trois ans de monnaie invisible',
        texte:
          'Le **1er janvier 1999**, l’euro naît — mais on ne peut pas le toucher. Les taux de conversion sont fixés de façon **irrévocable** : 6,55957 francs, 1,95583 mark, 1 936,27 lires. Les entreprises tiennent leurs comptes en euros, les Bourses cotent en euros, on peut faire un chèque ou un virement en euros, mais les pièces dans les poches restent des francs. Pendant trois ans, les magasins pratiquent le **double affichage** des prix pour habituer les yeux. Les banques centrales, elles, fabriquent en secret et stockent des montagnes d’argent : près de quinze milliards de billets, dessinés par l’Autrichien Robert Kalina avec des ponts et des fenêtres qui n’existent nulle part, pour ne favoriser aucun pays.',
      },
      {
        titre: 'La nuit du passage',
        texte:
          'En décembre **2001**, des millions de « sachets premiers euros » sont distribués dans les banques et les bureaux de poste, pour que chacun ait de la monnaie le 1er janvier. Dans la nuit du 31 décembre, les **distributeurs** sont rechargés les uns après les autres ; dès le matin du **1er janvier 2002**, on peut payer en euros dans douze pays. Suit une brève période de **double circulation** : on paie encore en francs, on rend la monnaie en euros. Le **17 février 2002**, le franc perd son cours légal, après six siècles et demi d’existence. Les pièces retirées sont fondues par milliers de tonnes ; les billets sont broyés. Beaucoup d’Européens continueront pendant des années à « convertir dans leur tête », et à trouver la vie plus chère qu’avant — alors que l’inflation mesurée de 2002 a été faible, sauf sur les petits achats du quotidien.',
      },
      {
        titre: 'Ce que ça change',
        texte:
          'À l’intérieur de la zone, les frais de change et le risque de dévaluation disparaissent, les prix deviennent comparables d’un pays à l’autre, et voyager ou commander à l’étranger devient banal. Mais une monnaie unique impose un **taux d’intérêt unique**, décidé à Francfort, à des économies très différentes — et l’euro a été construit sans budget commun pour amortir les chocs. La **crise de la dette** de 2010-2012 le montre brutalement : la Grèce, l’Irlande et le Portugal doivent être secourus, et l’on se demande si la zone va éclater. Elle tient, au prix de plans d’aide, de règles budgétaires renforcées et de la promesse du président de la BCE Mario Draghi, en 2012, de faire « tout ce qu’il faudra ». Vingt ans après, l’euro est la **deuxième monnaie** du monde derrière le dollar, et une vingtaine de pays l’utilisent.',
      },
    ],
    consequences: [
      'Les monnaies nationales disparaissent : franc, mark, lire, peseta, drachme, florin, escudo…',
      'La politique monétaire passe à la Banque centrale européenne : un seul taux d’intérêt pour toute la zone.',
      'Les frais de change et le risque de dévaluation disparaissent entre les pays membres.',
      'Les prix deviennent directement comparables d’un pays à l’autre, ce qui simplifie commerce et voyages.',
      'Une monnaie commune sans budget commun montre ses limites lors de la crise de la dette de 2010-2012.',
      'L’euro devient la deuxième monnaie de réserve du monde, derrière le dollar.',
    ],
    chiffres: [
      { valeur: '12', quoi: 'pays passés à l’euro le 1er janvier 2002' },
      { valeur: '6,55957', quoi: 'francs pour un euro, taux fixé à jamais' },
      { valeur: '300 millions', quoi: 'd’Européens concernés le jour du passage' },
      { valeur: '17 février 2002', quoi: 'dernier jour du franc, né en 1360' },
    ],
    chrono: [
      { date: '1979', fait: 'Système monétaire européen et création de l’écu.' },
      { date: '7 février 1992', fait: 'Maastricht fixe le cap de la monnaie unique.' },
      { date: 'décembre 1995', fait: 'Le sommet de Madrid choisit le nom « euro ».' },
      { date: '1er juin 1998', fait: 'Création de la Banque centrale européenne à Francfort.' },
      { date: '1er janvier 1999', fait: 'L’euro naît comme monnaie de compte, 1 € = 6,55957 F.' },
      { date: 'décembre 2001', fait: 'Distribution des premiers sachets de pièces.' },
      { date: '1er janvier 2002', fait: 'Pièces et billets en circulation dans douze pays.' },
      { date: '17 février 2002', fait: 'Le franc n’a plus cours légal.' },
      { date: '2010-2012', fait: 'Crise de la dette dans la zone euro.' },
      { date: '1er janvier 2023', fait: 'La Croatie rejoint la zone euro.' },
    ],
    leSaisTu:
      'Chaque pièce d’euro a une face commune et une face nationale — le semeur français, l’aigle allemand, le roi d’Espagne — mais toutes ont cours dans toute la zone : une pièce frappée à Dublin paie un café à Athènes. Monaco, Saint-Marin et le Vatican frappent aussi les leurs, en très petites quantités : les collectionneurs les traquent.',
    aRetenir: [
      'Les pièces et billets en euros entrent en circulation le 1er janvier 2002 dans douze pays.',
      'L’euro existait déjà comme monnaie de compte depuis le 1er janvier 1999.',
      'Le taux de conversion du franc est fixé une fois pour toutes : 1 euro = 6,55957 francs.',
      'Pour adopter l’euro, un pays doit respecter les critères de convergence fixés à Maastricht en 1992.',
      'Le franc cesse d’avoir cours légal le 17 février 2002, après six siècles et demi d’existence.',
    ],
    mots: [
      {
        mot: 'Zone euro',
        sens: 'L’ensemble des pays de l’Union européenne qui ont adopté l’euro comme monnaie : douze en 2002, une vingtaine aujourd’hui.',
      },
      {
        mot: 'Banque centrale européenne',
        sens: 'Institution installée à Francfort, indépendante des États, qui émet l’euro et fixe les taux d’intérêt de la zone.',
      },
      {
        mot: 'Taux de conversion',
        sens: 'Valeur fixée définitivement entre une monnaie nationale et l’euro, sans possibilité d’arrondi ni de révision.',
      },
      {
        mot: 'Dévaluation',
        sens: 'Baisse décidée de la valeur d’une monnaie pour rendre les exportations moins chères ; impossible à l’intérieur de l’euro.',
      },
    ],
    lies: ['traite-de-maastricht', 'chute-du-mur-de-berlin', 'francois-mitterrand', 'jean-monnet'],
    niveaux: ['3e'],
    programme: 'La construction européenne',
    tags: [
      'euro',
      'monnaie unique',
      'franc',
      'zone euro',
      'BCE',
      'Maastricht',
      'critères de convergence',
      '2002',
      'construction européenne',
      'Duisenberg',
    ],
  },
]
