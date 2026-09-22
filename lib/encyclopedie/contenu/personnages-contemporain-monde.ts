// -----------------------------------------------------------------------------
// MONDE CONTEMPORAIN — sept vies d'après 1945 : un président américain
// (Kennedy), un pasteur qui fait tomber la ségrégation sans lever la main
// (Martin Luther King), la philosophe qui démonte l'idée de « nature
// féminine » (Beauvoir), un pape venu de l'Est (Jean-Paul II), le premier
// homme sur la Lune (Armstrong), un prisonnier devenu président (Mandela) et
// le dernier dirigeant de l'URSS (Gorbatchev).
//
// Deux consignes du guide se croisent ici (docs/encyclopedie.md) : § 3, la
// figure chrétienne — Jean-Paul II — est racontée avec sa foi prise au sérieux
// comme moteur de ses actes, sans ironie et sans être réduite à un rôle
// politique ; et sur les pages douloureuses (ségrégation, apartheid, Shoah en
// arrière-plan, Tchernobyl), on reste factuel, daté, chiffré, sobre.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_CONTEMPORAIN_MONDE: Personnage[] = [
  {
    id: 'john-fitzgerald-kennedy',
    volet: 'personnages',
    nom: 'John Fitzgerald Kennedy',
    surnom: 'JFK',
    dates: '1917 – 1963',
    tri: 1963,
    periode: 'contemporain',
    emoji: '🇺🇸',
    roles: ['Président des États-Unis', 'Sénateur du Massachusetts', 'Officier de marine'],
    origine: 'Brookline, Massachusetts',
    accroche:
      'Plus jeune président élu des États-Unis, il évite la guerre nucléaire en treize jours et promet la Lune — puis tombe à Dallas à quarante-six ans.',
    citations: [
      {
        texte:
          'Ne demandez pas ce que votre pays peut faire pour vous, demandez ce que vous pouvez faire pour votre pays.',
        contexte:
          'Discours d’investiture, devant le Capitole de Washington, le 20 janvier 1961, par moins sept degrés.',
        sens:
          'Le citoyen n’est pas un client de l’État : il en est un acteur. La phrase lance l’esprit de la « Nouvelle Frontière » — corps de la paix, droits civiques, conquête spatiale.',
      },
      {
        texte: 'Ich bin ein Berliner.',
        contexte:
          'Devant 400 000 personnes, place Rudolph-Wilde à Berlin-Ouest, le 26 juin 1963, deux ans après la construction du Mur.',
        sens:
          '« Je suis un Berlinois. » Dit en allemand, dans une ville encerclée par le bloc communiste, cela signifie que toute la puissance américaine se tient derrière elle.',
      },
      {
        texte:
          'Nous choisissons d’aller sur la Lune dans cette décennie et de faire les autres choses, non parce que c’est facile, mais parce que c’est difficile.',
        contexte: 'Université Rice, Houston, le 12 septembre 1962, devant 40 000 personnes.',
        sens:
          'Il assume le coût du programme Apollo : la difficulté est le but, parce qu’elle seule mesure la puissance d’une nation face à l’URSS.',
      },
    ],
    reperes: [
      'Né en 1917 dans une grande famille catholique irlandaise de Boston ; héros du Pacifique en 1943.',
      'Élu en novembre 1960 face à Richard Nixon : à 43 ans, le plus jeune président élu et le premier catholique.',
      'Avril 1961 : le débarquement manqué de la baie des Cochons, à Cuba, est un désastre dès ses cent premiers jours.',
      'Octobre 1962 : la crise des missiles de Cuba, treize jours au bord de la guerre nucléaire.',
      'Il engage les États-Unis à poser un homme sur la Lune avant 1970 : c’est le programme Apollo.',
      'Assassiné à Dallas le 22 novembre 1963 ; Lyndon Johnson prête serment dans l’avion, deux heures après.',
    ],
    recit: [
      {
        titre: 'Un président de quarante-trois ans',
        texte:
          'Deuxième des neuf enfants d’un homme d’affaires irlandais de Boston, **John Fitzgerald Kennedy** commande dans le Pacifique une vedette lance-torpilles coupée en deux par un destroyer japonais en 1943 : il ramène son équipage à la nage, une blessure au dos qui ne le quittera jamais. Élu à la Chambre en 1946, sénateur en 1952, il gagne de justesse l’élection de **1960** contre Richard Nixon — 112 000 voix d’écart sur 68 millions. Le tournant s’est joué devant les caméras : le premier **débat télévisé** de l’histoire américaine, le 26 septembre 1960, montre un candidat bronzé et calme face à un adversaire fatigué. La radio donnait Nixon gagnant ; la télévision donne Kennedy. À 43 ans, il est le plus jeune président élu et le premier catholique.',
      },
      {
        titre: 'Treize jours d’octobre',
        texte:
          'Le 14 octobre 1962, un avion espion U-2 photographie à **Cuba** des rampes de missiles soviétiques capables d’atteindre Washington en quelques minutes. Ses généraux réclament des frappes aériennes puis l’invasion de l’île. Kennedy refuse et choisit une voie moyenne : un **blocus naval** — qu’il appelle « quarantaine » pour ne pas employer un mot qui signifie la guerre —, annoncé à la télévision le 22 octobre. Pendant six jours, les cargos soviétiques font route vers la ligne américaine ; un U-2 est abattu au-dessus de Cuba. Le 28 octobre, **Khrouchtchev** accepte de retirer ses missiles contre l’engagement américain de ne pas envahir Cuba — et, en secret, le retrait des missiles américains de Turquie. Le monde n’a jamais été aussi près de la guerre nucléaire. L’année suivante naît le « **téléphone rouge** », une ligne directe entre le Kremlin et la Maison-Blanche, et se signe le traité de Moscou interdisant les essais nucléaires dans l’atmosphère.',
      },
      {
        titre: '« Ich bin ein Berliner »',
        texte:
          'Depuis août 1961, un mur coupe **Berlin** en deux et enferme la partie occidentale au milieu de l’Allemagne communiste. Le 26 juin 1963, Kennedy parle devant 400 000 Berlinois. Il a griffonné la phrase allemande en phonétique sur son texte quelques minutes plus tôt. « Il y a deux mille ans, la fierté était de dire : *civis romanus sum*, je suis citoyen romain. Aujourd’hui, dans le monde libre, la fierté est de dire : *Ich bin ein Berliner*. » La foule hurle. Le geste ne libère personne, mais il fixe une règle que l’URSS n’essaiera plus de forcer : on ne touche pas à Berlin-Ouest.',
      },
      {
        titre: 'La Lune et les droits civiques',
        texte:
          'L’URSS a lancé le premier satellite en 1957 et le premier homme dans l’espace le 12 avril 1961. Six semaines plus tard, devant le Congrès, Kennedy fixe un objectif que rien ne garantit : un Américain sur la **Lune** avant la fin de la décennie. Le **programme Apollo** emploiera 400 000 personnes et coûtera 25 milliards de dollars de l’époque. Au même moment, le Sud brûle : à Birmingham, la police lâche les chiens sur des manifestants noirs. Le 11 juin 1963, Kennedy parle à la télévision de la ségrégation comme d’une **question morale**, « aussi vieille que les Écritures et aussi claire que la Constitution », et dépose un projet de loi sur les droits civiques. Il n’en verra pas le vote.',
      },
      {
        titre: 'Dallas, 22 novembre 1963',
        texte:
          'À 12 h 30, dans une décapotable qui traverse **Dallas**, deux balles atteignent le président. Il est déclaré mort trente minutes plus tard. **Lee Harvey Oswald**, un ancien marine qui avait vécu en URSS, est arrêté dans l’après-midi, puis abattu deux jours plus tard dans les sous-sols du commissariat, sous les caméras. La **commission Warren** conclut en 1964 qu’Oswald a agi seul ; ce verdict n’a jamais cessé d’être contesté, et l’affaire a nourri plus de théories que n’importe quel autre fait du siècle. Le **Civil Rights Act**, voté le 2 juillet 1964 par son successeur Lyndon Johnson, et les **premiers pas sur la Lune**, le 21 juillet 1969, ont été portés par sa mort autant que par sa parole.',
      },
    ],
    chrono: [
      { date: '29 mai 1917', fait: 'Naissance à Brookline, dans le Massachusetts.' },
      { date: '1943', fait: 'Son bateau coulé dans le Pacifique, il sauve son équipage.' },
      { date: '8 novembre 1960', fait: 'Élu président face à Richard Nixon.' },
      { date: '20 janvier 1961', fait: 'Investiture : « Ne demandez pas… ».' },
      { date: 'avril 1961', fait: 'Échec du débarquement de la baie des Cochons, à Cuba.' },
      { date: '12 septembre 1962', fait: 'Discours de Rice : « Nous choisissons d’aller sur la Lune ».' },
      { date: 'octobre 1962', fait: 'Crise des missiles de Cuba : treize jours de blocus.' },
      { date: '26 juin 1963', fait: '« Ich bin ein Berliner », à Berlin-Ouest.' },
      { date: '5 août 1963', fait: 'Traité de Moscou sur l’arrêt des essais nucléaires.' },
      { date: '22 novembre 1963', fait: 'Assassiné à Dallas, au Texas.' },
    ],
    leSaisTu:
      'La légende dit qu’en disant « Ich bin ein Berliner », Kennedy aurait annoncé « je suis un beignet », le mot désignant une pâtisserie en Allemagne. C’est faux : à Berlin, ce beignet s’appelle un *Pfannkuchen*, et les 400 000 auditeurs ont applaudi sans rire une seule seconde. L’histoire du beignet n’est apparue qu’une vingtaine d’années plus tard.',
    aRetenir: [
      'John Fitzgerald Kennedy est président des États-Unis du 20 janvier 1961 au 22 novembre 1963.',
      'En octobre 1962, la crise des missiles de Cuba amène les États-Unis et l’URSS au bord de la guerre nucléaire ; le blocus et la négociation l’évitent.',
      'Le 26 juin 1963, son « Ich bin ein Berliner » engage les États-Unis derrière Berlin-Ouest, encerclée depuis 1961.',
      'Il lance le programme Apollo en 1961 : l’objectif d’un homme sur la Lune avant 1970 sera tenu en 1969.',
      'Assassiné à Dallas le 22 novembre 1963, il ne voit ni le Civil Rights Act de 1964 ni les premiers pas sur la Lune.',
    ],
    mots: [
      {
        mot: 'Guerre froide',
        sens: 'Affrontement des États-Unis et de l’URSS, de 1947 à 1991, sans guerre directe entre eux.',
      },
      {
        mot: 'Blocus',
        sens: 'Interdiction militaire faite aux navires d’approcher une côte, pour couper un pays de ses livraisons.',
      },
      {
        mot: 'Course à l’espace',
        sens: 'Compétition entre l’URSS et les États-Unis pour les exploits spatiaux, preuves de la supériorité d’un camp.',
      },
    ],
    lies: ['martin-luther-king', 'neil-armstrong', 'mikhail-gorbatchev', 'charles-de-gaulle'],
    niveaux: ['3e'],
    programme: 'Un monde bipolaire au temps de la guerre froide',
    tags: [
      'JFK',
      'Kennedy',
      'Cuba',
      'Dallas',
      'Berlin',
      'Ich bin ein Berliner',
      'Apollo',
      'guerre froide',
      'missiles',
      'Maison-Blanche',
      'Oswald',
    ],
  },
  {
    id: 'martin-luther-king',
    volet: 'personnages',
    nom: 'Martin Luther King',
    surnom: 'le pasteur du rêve américain',
    dates: '1929 – 1968',
    tri: 1968,
    periode: 'contemporain',
    emoji: '🎤',
    roles: ['Pasteur baptiste', 'Militant des droits civiques', 'Prix Nobel de la paix'],
    origine: 'Atlanta, Géorgie',
    accroche:
      'Pasteur noir dans un Sud où la loi sépare les races, il fait tomber la ségrégation sans jamais lever la main — et le paie de sa vie à trente-neuf ans.',
    citations: [
      {
        texte:
          'I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.',
        contexte:
          'Marche sur Washington pour l’emploi et la liberté, devant le Lincoln Memorial, le 28 août 1963, face à 250 000 personnes.',
        sens:
          '« Je fais un rêve : que mes quatre enfants vivent un jour dans un pays où on ne les jugera pas à la couleur de leur peau, mais à la nature de leur caractère. »',
      },
      {
        texte:
          'L’obscurité ne peut pas chasser l’obscurité : seule la lumière le peut. La haine ne peut pas chasser la haine : seul l’amour le peut.',
        contexte: '*Strength to Love*, recueil de ses sermons, 1963.',
        sens:
          'Le principe de la non-violence : répondre par la violence, c’est entrer dans le jeu de l’adversaire et lui donner raison.',
      },
      {
        texte: 'Une injustice où qu’elle soit est une menace pour la justice partout.',
        contexte:
          'Lettre écrite en marge d’un journal, dans sa cellule de la prison de Birmingham, en avril 1963.',
        sens:
          'Réponse aux prêtres blancs qui lui reprochaient de venir « de l’extérieur » agiter leur ville : aucune injustice n’est une affaire locale.',
      },
      {
        texte:
          'Je suis monté au sommet de la montagne, et j’ai vu la Terre promise. Je n’y entrerai peut-être pas avec vous, mais je veux que vous le sachiez ce soir : nous, en tant que peuple, nous entrerons dans la Terre promise.',
        contexte: 'Memphis, le 3 avril 1968, dernier discours — la veille de son assassinat.',
      },
    ],
    reperes: [
      'Fils et petit-fils de pasteurs d’Atlanta, docteur en théologie à 26 ans.',
      '1955-1956 : le boycott des bus de Montgomery, déclenché par l’arrestation de Rosa Parks, dure 381 jours.',
      'Il fonde en 1957 la SCLC et impose la non-violence, apprise de l’Évangile et de Gandhi.',
      '28 août 1963 : la marche sur Washington réunit 250 000 personnes ; il y prononce « I have a dream ».',
      'Prix Nobel de la paix en 1964, à 35 ans : le plus jeune lauréat de son temps.',
      'Abattu sur le balcon de son motel à Memphis, le 4 avril 1968, à 39 ans.',
    ],
    recit: [
      {
        titre: 'Un pays où la loi sépare les races',
        texte:
          'Dans le Sud des États-Unis, les lois dites **Jim Crow** organisent la séparation depuis les années 1880 : écoles, hôpitaux, cimetières, fontaines à eau, salles d’attente, places de bus, tout est doublé — « séparés mais égaux », dit la formule officielle, et rien n’est égal. Un Noir du Mississippi qui veut voter doit réciter un article de la Constitution devant un fonctionnaire blanc qui juge seul de la réponse. En **1954**, la Cour suprême déclare la ségrégation scolaire contraire à la Constitution (*Brown contre Board of Education*) ; trois ans plus tard, il faut encore l’armée fédérale pour faire entrer neuf élèves noirs dans un lycée de Little Rock. La loi a changé ; le pays, pas encore.',
      },
      {
        titre: 'Montgomery, 381 jours à pied',
        texte:
          'Le 1ᵉʳ décembre 1955, à **Montgomery** (Alabama), une couturière de 42 ans, **Rosa Parks**, refuse de céder sa place à un passager blanc. Elle est arrêtée. La communauté noire de la ville, 40 000 personnes, décide de ne plus prendre le bus. On confie la direction du mouvement à un pasteur arrivé depuis un an, âgé de **26 ans** : Martin Luther King. Le boycott devait durer une journée ; il durera **381 jours**. Les gens marchent des kilomètres, organisent un covoiturage géant, perdent leur emploi. La maison de King est bombardée le 30 janvier 1956 ; il sort sur le perron et empêche la foule de se venger. En novembre 1956, la Cour suprême déclare la ségrégation dans les bus inconstitutionnelle. Un inconnu vient de gagner, et il est devenu un chef national.',
      },
      {
        titre: 'La non-violence comme méthode',
        texte:
          'La non-violence de King n’est pas de la passivité : c’est une **tactique**, apprise de l’Évangile, de Thoreau et de **Gandhi**, dont il étudie l’action en Inde et visite le pays en 1959. On s’assoit aux comptoirs interdits, on monte dans les bus interdits, on marche sans permis — et on accepte d’être arrêté, sans rendre un coup. King ira **vingt-neuf fois en prison**. À **Birmingham**, en avril et mai 1963, la police du shérif Bull Connor lâche les chiens et braque les lances à incendie sur des manifestants dont beaucoup sont des enfants. Les images font le tour du monde ; c’est exactement le calcul. La brutalité photographiée fait pour la cause ce que des années de discours n’avaient pas fait.',
      },
      {
        titre: 'Washington, 28 août 1963',
        texte:
          'Deux cent cinquante mille personnes, dont un quart de Blancs, marchent sur la capitale « pour l’emploi et la liberté ». King parle le dernier, depuis les marches du **Lincoln Memorial**, cent ans après l’abolition de l’esclavage par Lincoln. Son texte préparé s’achève sur une métaphore de chèque impayé. Puis il abandonne ses feuilles et improvise la fin — « **I have a dream** » —, une image qu’il avait déjà employée à Detroit deux mois plus tôt. Les dix-sept minutes du discours sont retransmises en direct par les trois chaînes nationales. Kennedy, qui le regarde à la Maison-Blanche, dira simplement : « Il a été bon. »',
      },
      {
        titre: 'Les lois, puis le Nobel',
        texte:
          'Le **2 juillet 1964**, le **Civil Rights Act** interdit la ségrégation dans tous les lieux publics et la discrimination à l’embauche. Il manque encore le vote : en mars 1965, trois marches partent de **Selma** vers Montgomery ; la première est brisée à coups de matraque sur le pont Edmund-Pettus, un « dimanche sanglant » filmé par la télévision. Le **Voting Rights Act** est signé le 6 août 1965 et fait entrer des centaines de milliers d’électeurs noirs sur les listes. En décembre 1964, King reçoit le **prix Nobel de la paix** ; il verse la totalité des 54 000 dollars au mouvement. Ses dernières années sont plus dures : il dénonce la guerre du Vietnam et la pauvreté du Nord, perd des soutiens, et voit monter des militants qui ne croient plus à la non-violence.',
      },
      {
        titre: 'Memphis, 4 avril 1968',
        texte:
          'Il est venu à **Memphis** soutenir la grève des éboueurs noirs de la ville, payés moitié moins que leurs collègues blancs. Le 3 avril au soir, épuisé, il improvise un discours où il dit avoir vu la Terre promise sans être sûr d’y entrer. Le lendemain, à 18 h 01, un coup de feu tiré depuis une fenêtre l’atteint au visage sur le balcon du motel Lorraine. Il a **39 ans**. Cent vingt-cinq villes américaines s’embrasent dans les jours qui suivent. **James Earl Ray**, un évadé de prison arrêté à Londres, est condamné à 99 ans. Depuis **1986**, le troisième lundi de janvier est férié dans tous les États-Unis : c’est le seul jour férié américain au nom d’un citoyen qui n’a jamais exercé aucune fonction officielle.',
      },
    ],
    chrono: [
      { date: '15 janvier 1929', fait: 'Naissance à Atlanta, en Géorgie.' },
      { date: '1ᵉʳ décembre 1955', fait: 'Rosa Parks refuse de céder sa place dans un bus.' },
      { date: '1955 – 1956', fait: 'Boycott des bus de Montgomery : 381 jours.' },
      { date: '1957', fait: 'Il fonde la SCLC et devient un chef national.' },
      { date: 'avril 1963', fait: 'Birmingham : prison et lettre écrite en cellule.' },
      { date: '28 août 1963', fait: 'Marche sur Washington : « I have a dream ».' },
      { date: '2 juillet 1964', fait: 'Civil Rights Act : fin de la ségrégation légale.' },
      { date: 'décembre 1964', fait: 'Prix Nobel de la paix, à 35 ans.' },
      { date: 'mars – août 1965', fait: 'Marches de Selma, puis Voting Rights Act.' },
      { date: '4 avril 1968', fait: 'Assassiné à Memphis, sur le balcon du motel Lorraine.' },
      { date: '1986', fait: 'Sa naissance devient un jour férié national.' },
    ],
    leSaisTu:
      'La partie la plus célèbre du discours de Washington n’était pas écrite. King lisait son texte quand la chanteuse de gospel **Mahalia Jackson**, debout derrière lui, lui a lancé : « Parle-leur du rêve, Martin ! » Il a poussé ses feuilles de côté, saisi le pupitre à deux mains et improvisé « I have a dream ».',
    aRetenir: [
      'Le boycott des bus de Montgomery (1955-1956), déclenché par l’arrestation de Rosa Parks, dure 381 jours et fait de Martin Luther King un chef national.',
      'Il choisit la non-violence, inspirée de l’Évangile et de Gandhi : manifester, se laisser arrêter, ne jamais rendre les coups.',
      'Le 28 août 1963, la marche sur Washington réunit 250 000 personnes ; il y prononce « I have a dream ».',
      'Le Civil Rights Act du 2 juillet 1964 met fin à la ségrégation légale, le Voting Rights Act de 1965 garantit le droit de vote.',
      'Prix Nobel de la paix en 1964, il est assassiné à Memphis le 4 avril 1968, à 39 ans.',
    ],
    mots: [
      {
        mot: 'Ségrégation',
        sens: 'Séparation imposée par la loi entre groupes de population, avec des lieux et des droits différents.',
      },
      {
        mot: 'Non-violence',
        sens: 'Manière de lutter qui refuse la force : on désobéit ouvertement à une loi injuste et on assume la sanction.',
      },
      {
        mot: 'Droits civiques',
        sens: 'Les droits du citoyen : voter, être jugé équitablement, accéder aux mêmes lieux et aux mêmes emplois que les autres.',
      },
    ],
    lies: [
      'gandhi',
      'nelson-mandela',
      'john-fitzgerald-kennedy',
      'abraham-lincoln',
      'rene-cassin',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Affirmation des libertés et conquête des droits depuis 1945',
    tags: [
      'King',
      'MLK',
      'I have a dream',
      'ségrégation',
      'Rosa Parks',
      'Montgomery',
      'Washington',
      'Selma',
      'non-violence',
      'droits civiques',
      'Memphis',
      'Nobel',
    ],
  },
  {
    id: 'simone-de-beauvoir',
    volet: 'personnages',
    nom: 'Simone de Beauvoir',
    surnom: 'le Castor',
    dates: '1908 – 1986',
    tri: 1986,
    periode: 'contemporain',
    emoji: '✍️',
    roles: ['Philosophe', 'Écrivaine', 'Féministe'],
    origine: 'Paris',
    accroche:
      'Avec « Le Deuxième Sexe », en 1949, elle démonte l’idée qu’une femme serait faite par la nature — et donne au féminisme moderne sa phrase fondatrice.',
    citations: [
      {
        texte: 'On ne naît pas femme : on le devient.',
        contexte:
          'Première phrase du tome II du *Deuxième Sexe*, publié en 1949. Elle a alors 41 ans.',
        sens:
          'Être « une femme » n’est pas un destin biologique mais un rôle appris : l’éducation, les jouets, les vêtements, les métiers permis ou interdits fabriquent ce qu’on croit naturel.',
      },
      {
        texte:
          'Un million de femmes se font avorter chaque année en France. Je déclare que je suis l’une d’elles. Je déclare avoir avorté.',
        contexte:
          'Manifeste des 343, publié par *Le Nouvel Observateur* le 5 avril 1971 : elle en rédige le texte et le signe avec 342 autres femmes.',
        sens:
          'L’avortement est alors un délit. En l’avouant publiquement, ces femmes mettent l’État au défi de les poursuivre toutes : aucune ne le sera.',
      },
      {
        texte:
          'N’oubliez jamais qu’il suffira d’une crise politique, économique ou religieuse pour que les droits des femmes soient remis en question. Ces droits ne sont jamais acquis.',
        contexte:
          'Phrase très répandue, souvent citée dans les manifestations, dont on n’a jamais retrouvé la source exacte dans son œuvre.',
        incertaine: true,
      },
    ],
    reperes: [
      'Reçue deuxième à l’agrégation de philosophie en 1929, derrière Jean-Paul Sartre : elle a 21 ans.',
      'Professeure de philosophie à Marseille, Rouen puis Paris, jusqu’à son renvoi en 1943.',
      'Compagne de Sartre pendant cinquante et un ans, sans mariage, sans enfants et sans vie commune.',
      '1949 : *Le Deuxième Sexe* se vend à 22 000 exemplaires en une semaine et déclenche un scandale.',
      'Prix Goncourt 1954 pour *Les Mandarins*, roman de l’après-guerre intellectuelle.',
      '1971 : elle rédige et signe le manifeste des 343 pour la légalisation de l’avortement.',
    ],
    recit: [
      {
        titre: 'Une jeune fille rangée qui ne l’est pas restée',
        texte:
          'Née en 1908 dans une famille catholique et ruinée du boulevard Raspail, Simone de Beauvoir est élevée chez les sœurs pour devenir une épouse convenable. À quatorze ans, elle cesse de croire en Dieu et décide qu’elle écrira. À la Sorbonne, elle prépare l’**agrégation de philosophie** et rencontre, dans le groupe des candidats, un petit homme borgne et bavard nommé **Jean-Paul Sartre**. En 1929, il est reçu premier, elle deuxième — et elle est la plus jeune agrégée de philosophie de France. Ils concluent un pacte : une « **liberté nécessaire** », des amours contingentes, aucune obligation de vivre ensemble, mais ne jamais se mentir. Ce pacte tiendra cinquante et un ans, jusqu’à la mort de Sartre, et lui vaudra autant de reproches que ses livres.',
      },
      {
        titre: 'L’existentialisme, ou l’homme sans nature',
        texte:
          'Beauvoir n’est pas « la compagne d’un philosophe » : elle est philosophe. Le courant qu’elle porte avec Sartre, l’**existentialisme**, tient en une idée simple et dérangeante : il n’existe pas de nature humaine fixée d’avance ; on est ce qu’on fait de ce qu’on a. Dans *Pour une morale de l’ambiguïté* (1947), elle tire de cette liberté une **responsabilité** : puisque rien n’est écrit, personne ne peut se retrancher derrière son caractère, son sexe ou son milieu. C’est cette philosophie, appliquée à la condition des femmes, qui donnera *Le Deuxième Sexe*. Après-guerre, elle codirige avec Sartre la revue *Les Temps modernes*, voyage aux États-Unis, en Chine, à Cuba, et devient l’une des figures les plus attaquées et les plus lues de Saint-Germain-des-Prés.',
      },
      {
        titre: '« Le Deuxième Sexe », 1949',
        texte:
          'Elle voulait écrire sur elle-même ; elle s’aperçoit qu’elle ne peut pas le faire sans expliquer d’abord ce que signifie « être une femme ». Deux ans d’enquête — biologie, histoire, droit, psychanalyse, littérature — donnent mille pages en deux tomes. La thèse : la femme a été construite par les sociétés comme l’**Autre**, définie par rapport à l’homme pris pour la norme, et cette construction passe pour la nature. D’où la phrase d’ouverture du tome II : « **On ne naît pas femme : on le devient.** » Le livre fait scandale. François Mauriac écrit qu’il a « tout appris sur le vagin de madame de Beauvoir » ; le Vatican le met à l’**Index** ; des lecteurs l’insultent dans la rue. Il se vend à 22 000 exemplaires la première semaine, puis dans le monde entier, et devient le texte fondateur du féminisme de la seconde moitié du siècle.',
      },
      {
        titre: 'Des livres à la rue',
        texte:
          'Longtemps, Beauvoir a cru que l’émancipation des femmes viendrait du socialisme. À partir de 1970, elle rejoint le **Mouvement de libération des femmes** et descend dans la rue. Le **5 avril 1971**, *Le Nouvel Observateur* publie le **manifeste des 343** : trois cent quarante-trois femmes, dont Catherine Deneuve, Françoise Sagan et Marguerite Duras, déclarent avoir avorté alors que l’avortement est un délit puni de prison. Beauvoir en a rédigé le texte. Le pari est simple : l’État n’osera pas juger trois cent quarante-trois femmes connues. Il n’ose pas. Quatre ans plus tard, **Simone Veil** fait voter la loi du 17 janvier 1975. Beauvoir préside ensuite la Ligue du droit des femmes et meurt le 14 avril 1986, six ans jour pour jour après Sartre, enterrée auprès de lui au cimetière du Montparnasse.',
      },
    ],
    chrono: [
      { date: '9 janvier 1908', fait: 'Naissance à Paris, dans une famille bourgeoise.' },
      { date: '1929', fait: 'Agrégée de philosophie à 21 ans ; pacte avec Sartre.' },
      { date: '1943', fait: 'Premier roman, *L’Invitée* ; elle quitte l’enseignement.' },
      { date: '1949', fait: 'Publication du *Deuxième Sexe* : scandale et succès mondial.' },
      { date: '1954', fait: 'Prix Goncourt pour *Les Mandarins*.' },
      { date: '1958', fait: '*Mémoires d’une jeune fille rangée*, premier volume de ses souvenirs.' },
      { date: '5 avril 1971', fait: 'Manifeste des 343 pour la légalisation de l’avortement.' },
      { date: '17 janvier 1975', fait: 'Loi Veil : l’avortement est dépénalisé.' },
      { date: '14 avril 1986', fait: 'Mort à Paris ; enterrée auprès de Sartre.' },
    ],
    leSaisTu:
      'Sartre l’appelait « le Castor ». Le surnom vient d’un camarade de la Sorbonne qui avait remarqué que « Beauvoir » sonne comme l’anglais *beaver*, le castor — un animal qui construit sans jamais s’arrêter. Elle a signé des lettres de ce nom toute sa vie.',
    aRetenir: [
      'Simone de Beauvoir publie *Le Deuxième Sexe* en 1949 : la thèse en est que la « féminité » est construite par la société, pas donnée par la nature.',
      'Sa phrase « On ne naît pas femme : on le devient » ouvre le tome II de l’ouvrage.',
      'Philosophe existentialiste, elle affirme que l’être humain n’a pas de nature fixée et qu’il est responsable de ce qu’il fait de sa liberté.',
      'Le 5 avril 1971, elle rédige et signe le manifeste des 343, qui réclame la légalisation de l’avortement.',
      'La loi Veil du 17 janvier 1975 dépénalise l’avortement en France, quatre ans après le manifeste.',
    ],
    mots: [
      {
        mot: 'Existentialisme',
        sens: 'Philosophie selon laquelle l’être humain n’a pas de nature donnée d’avance : il se construit par ses actes.',
      },
      {
        mot: 'Féminisme',
        sens: 'Combat pour l’égalité des droits entre les femmes et les hommes, dans la loi comme dans les faits.',
      },
      {
        mot: 'Manifeste',
        sens: 'Texte public par lequel un groupe proclame une position et l’assume au grand jour.',
      },
    ],
    lies: ['simone-veil', 'olympe-de-gouges', 'louise-michel', 'marie-curie'],
    niveaux: ['3e', 'Tle'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'Beauvoir',
      'Le Deuxième Sexe',
      'féminisme',
      'Sartre',
      'existentialisme',
      'manifeste des 343',
      'avortement',
      'Goncourt',
      'droits des femmes',
    ],
  },
  {
    id: 'jean-paul-ii',
    volet: 'personnages',
    nom: 'Jean-Paul II',
    surnom: 'le pape venu de l’Est',
    dates: '1920 – 2005',
    tri: 2005,
    periode: 'contemporain',
    emoji: '✝️',
    roles: ['Pape', 'Archevêque de Cracovie', 'Saint'],
    origine: 'Wadowice, Pologne',
    accroche:
      'Premier pape non italien depuis 1523, il parcourt le monde vingt-six ans durant, pardonne à celui qui a tiré sur lui et voit le communisme quitter son pays.',
    citations: [
      {
        texte: 'N’ayez pas peur ! Ouvrez, ouvrez toutes grandes les portes au Christ !',
        contexte:
          'Messe d’inauguration de son pontificat, place Saint-Pierre à Rome, le 22 octobre 1978.',
        sens:
          'Appel à ne pas régler sa vie sur la peur. Derrière le rideau de fer, où la foi est surveillée, des millions de gens l’entendent aussi comme un mot d’ordre.',
      },
      {
        texte:
          'Que l’Esprit Saint descende et renouvelle la face de la terre — de cette terre !',
        contexte:
          'Place de la Victoire, à Varsovie, le 2 juin 1979, devant un million de Polonais et sous l’œil du régime communiste.',
        sens:
          'La prière est ancienne ; les trois derniers mots sont de lui. La foule comprend qu’il parle de la Pologne. Quatorze mois plus tard naissent les grèves de Gdańsk.',
      },
      {
        texte:
          'Je prie pour le frère qui m’a frappé, et auquel j’ai sincèrement pardonné.',
        contexte:
          'Message dicté depuis sa chambre d’hôpital, le 17 mai 1981, quatre jours après l’attentat de la place Saint-Pierre.',
        sens:
          'Il ira le dire lui-même à Mehmet Ali Ağca, dans sa cellule de la prison de Rebibbia, le 27 décembre 1983.',
      },
      {
        texte:
          'Nous ne pouvons pas ne pas reconnaître les infidélités à l’Évangile commises par certains de nos frères, et nous demandons pardon.',
        contexte:
          'Journée du pardon, basilique Saint-Pierre, le 12 mars 2000, pour les fautes commises par des chrétiens au long de l’histoire.',
      },
    ],
    reperes: [
      'Karol Wojtyła, né en 1920 près de Cracovie ; ouvrier dans une carrière sous l’occupation nazie.',
      'Il étudie la théologie dans un séminaire clandestin et est ordonné prêtre en 1946.',
      'Évêque à 38 ans, archevêque de Cracovie en 1964, cardinal en 1967, face à un régime communiste.',
      'Élu pape le 16 octobre 1978 : premier Polonais, premier non-Italien depuis 1523.',
      '104 voyages hors d’Italie, 129 pays visités : aucun pape n’avait autant marché.',
      'Atteint de la maladie de Parkinson, il meurt le 2 avril 2005 ; canonisé en 2014.',
    ],
    recit: [
      {
        titre: 'Un enfant de Wadowice',
        texte:
          'Karol Wojtyła perd sa mère à neuf ans, son frère médecin à douze, son père à vingt : il reste seul. Lycéen brillant, passionné de théâtre et de poésie, il entre à l’université de Cracovie en 1938. Un an plus tard, l’Allemagne envahit la **Pologne**. Les universités sont fermées, les professeurs déportés ; pour échapper au travail forcé, Karol casse la pierre dans une carrière, puis travaille à l’usine chimique Solvay. C’est là, dans la ville occupée où l’on fusille dans la rue, qu’il décide de devenir prêtre. Il suit les cours d’un **séminaire clandestin** organisé par l’archevêque de Cracovie et cache un camarade juif chez lui. Ordonné en **1946**, il part étudier à Rome, revient curé de campagne, part camper et faire du canoë avec ses étudiants — en soutane rangée dans le sac, pour ne pas être repéré.',
      },
      {
        titre: 'Évêque sous un régime athée',
        texte:
          'Nommé évêque auxiliaire de Cracovie en **1958**, à 38 ans, il fait face à un État qui veut effacer l’Église. Le cas de **Nowa Huta** est resté célèbre : les autorités avaient bâti aux portes de Cracovie une ville ouvrière modèle, volontairement sans église. Wojtyła vient y célébrer la messe en plein air, l’hiver, pendant des années, jusqu’à obtenir l’autorisation de construire ; l’église est consacrée en 1977. Entre-temps, il participe aux quatre sessions du **concile Vatican II** (1962-1965) et contribue au texte sur la liberté religieuse. Archevêque en 1964, cardinal en 1967, il est peu connu hors de Pologne quand, le **16 octobre 1978**, après l’année des trois papes, le conclave le choisit au huitième tour. Il a 58 ans. Six jours plus tard, il lance à la place Saint-Pierre : « N’ayez pas peur ! »',
      },
      {
        titre: 'Le pape polonais et Solidarność',
        texte:
          'En **juin 1979**, il rentre en Pologne pour neuf jours. Un tiers du pays vient le voir ; à Varsovie, un million de personnes prient sur la place de la Victoire sans qu’un seul policier n’ait à intervenir — le service d’ordre est assuré par les fidèles eux-mêmes. Les Polonais découvrent qu’ils sont nombreux et que le régime, ce jour-là, ne gouverne plus rien. Quatorze mois après, les grèves des chantiers navals de **Gdańsk** donnent naissance à **Solidarność**, premier syndicat libre du bloc soviétique, qui comptera dix millions d’adhérents. Le pape le soutient sans jamais appeler à l’insurrection, y compris sous l’état de siège décrété en décembre 1981. Dix ans plus tard, **Gorbatchev** écrira que rien de ce qui s’est passé à l’Est n’aurait été possible « sans ce pape ».',
      },
      {
        titre: 'Place Saint-Pierre, 13 mai 1981',
        texte:
          'À 17 h 17, alors qu’il traverse la foule en voiture découverte, un tueur turc de 23 ans, **Mehmet Ali Ağca**, tire deux balles. L’une traverse l’abdomen et manque l’aorte de quelques millimètres. Opéré cinq heures durant, il survit. Dès qu’il peut dicter, il demande qu’on prie « pour le frère qui m’a frappé, et auquel j’ai sincèrement pardonné ». Le **27 décembre 1983**, il se rend à la prison de Rebibbia et s’entretient vingt minutes en tête-à-tête avec son agresseur ; la photographie des deux hommes assis l’un près de l’autre a fait le tour du monde. Les commanditaires de l’attentat n’ont jamais été établis avec certitude.',
      },
      {
        titre: 'Le pape des foules et des voyages',
        texte:
          '**104 voyages** hors d’Italie, 129 pays, plus d’un million de kilomètres : il décide que le pape ira vers les gens. Il crée en 1985 les **Journées mondiales de la jeunesse**, qui rassembleront plus d’un million de jeunes à Paris en 1997 et deux millions à Rome en 2000. Il ouvre aussi des portes restées fermées depuis des siècles : premier pape à entrer dans une **synagogue** (Rome, 1986), où il appelle les juifs « nos frères aînés » ; premier à entrer dans une **mosquée** (Damas, 2001) ; il réunit à Assise en 1986 les responsables de douze religions pour une journée de prière pour la paix. En mars 2000, à Jérusalem, il glisse au **mur des Lamentations** un billet demandant pardon pour les souffrances infligées au peuple juif.',
      },
      {
        titre: 'Demander pardon, puis mourir en public',
        texte:
          'Le **12 mars 2000**, dans la basilique Saint-Pierre, il demande publiquement pardon pour les fautes commises par des chrétiens au long de l’histoire : les divisions entre chrétiens, les violences faites au nom de la vérité, les torts envers les juifs, les femmes et les peuples colonisés. Aucun pape n’avait fait cela. Ses dernières années sont marquées par la **maladie de Parkinson** : il tremble, sa voix s’éteint, il n’arrive plus à lire ses textes. Il refuse de se cacher. Le **2 avril 2005**, il meurt au Vatican ; quatre millions de pèlerins viennent à Rome, et la foule crie *Santo subito* — « saint tout de suite ». Il est béatifié en 2011 et **canonisé le 27 avril 2014**.',
      },
    ],
    chrono: [
      { date: '18 mai 1920', fait: 'Naissance de Karol Wojtyła à Wadowice, en Pologne.' },
      { date: '1946', fait: 'Ordonné prêtre, après un séminaire clandestin sous l’occupation.' },
      { date: '1964', fait: 'Archevêque de Cracovie ; cardinal trois ans plus tard.' },
      { date: '16 octobre 1978', fait: 'Élu pape : le premier non-Italien depuis 1523.' },
      { date: '22 octobre 1978', fait: '« N’ayez pas peur ! », place Saint-Pierre.' },
      { date: 'juin 1979', fait: 'Premier voyage en Pologne : un tiers du pays vient le voir.' },
      { date: '13 mai 1981', fait: 'Attentat place Saint-Pierre : il est grièvement blessé.' },
      { date: '27 décembre 1983', fait: 'Il rend visite en prison à Mehmet Ali Ağca.' },
      { date: '1986', fait: 'Premier pape à entrer dans une synagogue, à Rome.' },
      { date: '12 mars 2000', fait: 'Journée du pardon, à Saint-Pierre de Rome.' },
      { date: '2 avril 2005', fait: 'Mort au Vatican, après vingt-six ans de pontificat.' },
      { date: '27 avril 2014', fait: 'Canonisation par le pape François.' },
    ],
    leSaisTu:
      'L’attentat a eu lieu le 13 mai, jour anniversaire des apparitions de Fátima, au Portugal. Jean-Paul II y a vu une protection et a offert un an plus tard, au sanctuaire portugais, l’une des balles extraites de son corps : elle a été sertie dans la couronne de la statue, où elle se trouve encore.',
    aRetenir: [
      'Karol Wojtyła, archevêque de Cracovie, est élu pape le 16 octobre 1978 sous le nom de Jean-Paul II : premier pape non italien depuis 1523.',
      'Son voyage en Pologne de juin 1979 précède de quatorze mois la naissance de Solidarność, premier syndicat libre du bloc soviétique.',
      'Il survit à l’attentat du 13 mai 1981 et pardonne à son agresseur, Mehmet Ali Ağca, qu’il va voir en prison le 27 décembre 1983.',
      'Il accomplit 104 voyages hors d’Italie en vingt-six ans et crée les Journées mondiales de la jeunesse en 1985.',
      'Le 12 mars 2000, il demande pardon pour les fautes commises par des chrétiens au cours de l’histoire ; il meurt le 2 avril 2005.',
    ],
    mots: [
      {
        mot: 'Pontificat',
        sens: 'La durée pendant laquelle un pape exerce sa charge ; celui de Jean-Paul II a duré vingt-six ans.',
      },
      {
        mot: 'Conclave',
        sens: 'Assemblée des cardinaux, enfermés à clé, qui élit le pape au scrutin secret.',
      },
      {
        mot: 'Solidarność',
        sens: '« Solidarité » : syndicat libre polonais né à Gdańsk en 1980, interdit puis vainqueur des élections de 1989.',
      },
      {
        mot: 'Canonisation',
        sens: 'Acte par lequel l’Église catholique reconnaît officiellement quelqu’un comme saint.',
      },
    ],
    lies: ['mikhail-gorbatchev', 'abbe-pierre', 'robert-schuman', 'jesus-de-nazareth'],
    niveaux: ['3e'],
    programme: 'Enjeux et conflits dans le monde après 1989',
    tags: [
      'Karol Wojtyła',
      'pape',
      'Pologne',
      'Cracovie',
      'Solidarność',
      'Vatican',
      'N’ayez pas peur',
      'attentat',
      'Ali Ağca',
      'JMJ',
      'canonisation',
    ],
  },
  {
    id: 'neil-armstrong',
    volet: 'personnages',
    nom: 'Neil Armstrong',
    surnom: 'le premier homme sur la Lune',
    dates: '1930 – 2012',
    tri: 2012,
    periode: 'contemporain',
    emoji: '🚀',
    roles: ['Astronaute', 'Pilote d’essai', 'Ingénieur'],
    origine: 'Wapakoneta, Ohio',
    accroche:
      'Le 21 juillet 1969 à 3 h 56, heure française, il pose le pied sur la Lune devant 600 millions de téléspectateurs — et prononce onze mots préparés pour l’histoire.',
    citations: [
      {
        texte: 'That’s one small step for [a] man, one giant leap for mankind.',
        contexte:
          'En descendant l’échelle du module lunaire *Eagle*, mer de la Tranquillité, le 21 juillet 1969 à 3 h 56 (heure de Paris).',
        sens:
          '« C’est un petit pas pour [un] homme, un bond de géant pour l’humanité. » Sans le *a*, inaudible dans la transmission, la phrase dit « un petit pas pour l’Homme » — et se contredit.',
      },
      {
        texte: 'Houston, Tranquility Base here. The Eagle has landed.',
        contexte:
          'Premiers mots après l’alunissage, le 20 juillet 1969 à 21 h 17 (heure de Paris).',
        sens:
          '« Houston, ici la base de la Tranquillité. L’Aigle s’est posé. » Il restait moins de trente secondes de carburant dans le module.',
      },
      {
        texte: 'I am, and ever will be, a white-socks, pocket-protector, nerdy engineer.',
        contexte: 'Devant le National Press Club, à Washington, en février 2000.',
        sens:
          '« Je suis, et je serai toujours, un ingénieur à chaussettes blanches et stylos dans la poche. » Rentré de la Lune, il a refusé la politique et enseigné l’ingénierie.',
      },
    ],
    reperes: [
      'Pilote de chasse en Corée à 21 ans, puis pilote d’essai de l’avion-fusée X-15, jusqu’à 63 km d’altitude.',
      'Astronaute en 1962 ; en 1966, il sauve son équipage d’une vrille mortelle à bord de Gemini 8.',
      '16 juillet 1969 : Apollo 11 décolle de Floride avec Aldrin et Collins à bord.',
      'Il pose *Eagle* à la main, à vingt-cinq secondes de la panne sèche, dans la mer de la Tranquillité.',
      'Deux heures et demie de sortie, 21,5 kg de roches lunaires rapportées.',
      'Rentré sur Terre, il fuit la célébrité et enseigne l’ingénierie à Cincinnati jusqu’en 1979.',
    ],
    recit: [
      {
        titre: 'La course à l’espace',
        texte:
          'Tout commence par une humiliation : le 4 octobre 1957, l’URSS met en orbite **Spoutnik**, une bille de métal qui bipe au-dessus des États-Unis. Le 12 avril 1961, **Youri Gagarine** devient le premier homme dans l’espace. Six semaines plus tard, **Kennedy** fixe au Congrès un objectif que personne ne sait encore atteindre : poser un Américain sur la Lune et le ramener vivant avant la fin de la décennie. Le **programme Apollo** emploiera jusqu’à 400 000 personnes et coûtera 25 milliards de dollars de l’époque. Le prix est aussi humain : le 27 janvier 1967, l’incendie de la capsule **Apollo 1** tue ses trois occupants au sol en quelques secondes. La conquête de la Lune n’est pas une aventure scientifique désintéressée : c’est une bataille de la **guerre froide**, où la maîtrise des fusées prouve la supériorité d’un camp.',
      },
      {
        titre: 'Un pilote d’essai, pas un héros',
        texte:
          'Neil Armstrong a passé son brevet de pilote avant son permis de conduire. Pilote de chasse en **Corée** à 21 ans — 78 missions, un avion rentré sans une partie de son aile —, il devient ensuite pilote d’essai du **X-15**, un avion-fusée qui monte à 63 kilomètres et vole à sept fois la vitesse du son. Sélectionné par la NASA en 1962, il commande en mars 1966 **Gemini 8** : après le premier amarrage spatial de l’histoire, un propulseur bloqué met le vaisseau en rotation à une tour par seconde ; Armstrong reprend la main à la limite de l’évanouissement. C’est ce sang-froid, et le fait qu’il soit un **civil** peu porté sur les caméras, qui le désignent pour Apollo 11.',
      },
      {
        titre: 'Les treize dernières minutes',
        texte:
          'Le 20 juillet 1969, **Armstrong** et **Buzz Aldrin** se détachent du vaisseau, où **Michael Collins** reste seul en orbite, et entament la descente. Tout va de travers : des alarmes « 1202 » inconnues font craindre l’abandon — l’ordinateur, saturé, se réinitialise en priorité —, et le pilote automatique vise un champ de rochers de la taille d’une voiture. Armstrong débranche l’automatisme et pilote à la main, à l’horizontale, pour trouver un sol plat. Les réserves tombent ; Houston annonce « **60 secondes** », puis « 30 secondes ». Il pose à 21 h 17, heure de Paris, avec une vingtaine de secondes de marge. Dans la salle de contrôle, personne ne respire. Puis vient sa voix : « *Houston, Tranquility Base here. The Eagle has landed.* »',
      },
      {
        titre: 'Le pied, la phrase, et le « a » manquant',
        texte:
          'Six heures et demie plus tard, il descend l’échelle et pose le pied gauche sur la poussière : il est **3 h 56 du matin** en France, le 21 juillet, et environ 600 millions de personnes regardent. Sa phrase a fait couler autant d’encre que le voyage. Armstrong a toujours affirmé avoir dit « *one small step for a man* » — « un petit pas pour **un** homme », c’est-à-dire pour lui, par opposition à l’humanité entière. Mais le *a*, minuscule et avalé, n’est pas audible dans l’enregistrement radio, brouillé par le souffle. Sans lui, *man* signifie « l’Homme » en général, et la phrase se mord la queue : un petit pas pour l’humanité, un bond de géant pour l’humanité. Des analyses acoustiques ont tenté, depuis, de retrouver le *a* — sans jamais trancher. La NASA l’écrit entre parenthèses dans ses transcriptions. Aldrin le rejoint et décrit le paysage en deux mots : « *magnificent desolation* », une désolation magnifique.',
      },
      {
        titre: 'Après la Lune',
        texte:
          'Ils plantent un drapeau raidi par une tige (il n’y a pas de vent), laissent une plaque — « Nous sommes venus en paix au nom de toute l’humanité » —, installent un réflecteur laser qui sert encore à mesurer la distance Terre-Lune, ramassent **21,5 kg** de roches et repartent après deux heures et demie dehors. Retour dans le Pacifique le 24 juillet, puis vingt et un jours de **quarantaine** au cas où la Lune abriterait des microbes. Suit une tournée mondiale que le premier homme sur la Lune traverse avec un embarras visible. Il quitte la NASA en 1971, enseigne l’ingénierie à l’université de Cincinnati, refuse presque toutes les interviews et ne signe plus d’autographes quand il découvre qu’on les revend. Il meurt le **25 août 2012** ; sa famille demande à ceux qui pensent à lui un soir de ciel clair de « faire un clin d’œil à la Lune ».',
      },
    ],
    chrono: [
      { date: '5 août 1930', fait: 'Naissance à Wapakoneta, dans l’Ohio.' },
      { date: '1955 – 1962', fait: 'Pilote d’essai : 900 vols, dont sept sur X-15.' },
      { date: '1962', fait: 'Sélectionné comme astronaute par la NASA.' },
      { date: '16 mars 1966', fait: 'Gemini 8 : il maîtrise une vrille et sauve l’équipage.' },
      { date: '16 juillet 1969', fait: 'Décollage d’Apollo 11 depuis la Floride.' },
      { date: '20 juillet 1969', fait: 'Alunissage à 21 h 17, heure de Paris.' },
      { date: '21 juillet 1969', fait: 'Premier pas sur la Lune, à 3 h 56 (heure de Paris).' },
      { date: '24 juillet 1969', fait: 'Retour et amerrissage dans le Pacifique.' },
      { date: '1971', fait: 'Il quitte la NASA et devient professeur d’ingénierie.' },
      { date: '25 août 2012', fait: 'Mort à Cincinnati, à 82 ans.' },
    ],
    leSaisTu:
      'Armstrong et Aldrin n’ont pas laissé que des empreintes. Dans un petit sac déposé sur le sol se trouvaient l’écusson d’Apollo 1, dont l’équipage avait brûlé, et deux médailles à la mémoire des cosmonautes soviétiques **Youri Gagarine** et **Vladimir Komarov**, morts eux aussi. En pleine guerre froide, les Américains ont emporté les morts de l’autre camp.',
    aRetenir: [
      'Neil Armstrong est le premier homme à marcher sur la Lune, le 21 juillet 1969 à 3 h 56 (heure française).',
      'Apollo 11 répond au défi lancé par Kennedy en 1961 après l’avance soviétique (Spoutnik en 1957, Gagarine en 1961).',
      'Sa phrase — « un petit pas pour un homme, un bond de géant pour l’humanité » — est entrée dans l’histoire amputée de son « a ».',
      'La mission rapporte 21,5 kg de roches lunaires et est suivie par environ 600 millions de téléspectateurs.',
      'La conquête de la Lune est un épisode de la guerre froide : la maîtrise de l’espace y sert de preuve de puissance.',
    ],
    mots: [
      {
        mot: 'Module lunaire',
        sens: 'Petit vaisseau détachable qui descend sur la Lune et en repart, laissant sa base au sol.',
      },
      {
        mot: 'Alunissage',
        sens: 'Le fait de se poser sur la Lune, comme « atterrissage » pour la Terre.',
      },
      {
        mot: 'Course à l’espace',
        sens: 'Compétition entre l’URSS et les États-Unis pour les exploits spatiaux, de 1957 à 1975.',
      },
    ],
    lies: ['john-fitzgerald-kennedy', 'galilee', 'copernic'],
    niveaux: ['3e'],
    programme: 'Un monde bipolaire au temps de la guerre froide',
    tags: [
      'Armstrong',
      'Apollo 11',
      'Lune',
      'NASA',
      'Aldrin',
      'un petit pas',
      'Gagarine',
      'conquête spatiale',
      'guerre froide',
      '1969',
    ],
  },
  {
    id: 'nelson-mandela',
    volet: 'personnages',
    nom: 'Nelson Mandela',
    surnom: 'Madiba',
    dates: '1918 – 2013',
    tri: 2013,
    periode: 'contemporain',
    emoji: '🤝',
    roles: ['Président d’Afrique du Sud', 'Avocat', 'Prix Nobel de la paix'],
    origine: 'Mvezo, Transkei, Afrique du Sud',
    accroche:
      'Vingt-sept ans de prison pour avoir combattu l’apartheid, puis premier président noir d’Afrique du Sud — élu par le pays qui l’avait enfermé.',
    citations: [
      {
        texte:
          'J’ai nourri l’idéal d’une société libre et démocratique, dans laquelle tous vivraient ensemble en harmonie et avec des chances égales. C’est un idéal pour lequel j’espère vivre et que j’espère atteindre. Mais, s’il le faut, c’est un idéal pour lequel je suis prêt à mourir.',
        contexte:
          'Fin de sa déclaration au procès de Rivonia, à Pretoria, le 20 avril 1964 : il a parlé quatre heures, debout dans le box, en risquant la pendaison.',
      },
      {
        texte:
          'Personne ne naît en haïssant une autre personne à cause de la couleur de sa peau. On apprend à haïr, et si l’on peut apprendre à haïr, on peut apprendre à aimer.',
        contexte: '*Un long chemin vers la liberté*, son autobiographie, publiée en 1994.',
        sens:
          'La haine raciale n’est pas un fait de nature mais une chose enseignée : c’est ce qui rend la réconciliation possible, et c’est la clé de sa politique après 1994.',
      },
      {
        texte:
          'Plus jamais, plus jamais cette terre magnifique ne connaîtra l’oppression d’un homme par un autre.',
        contexte:
          'Discours d’investiture comme président de la République d’Afrique du Sud, à Pretoria, le 10 mai 1994.',
      },
    ],
    reperes: [
      'Fils d’un chef xhosa, il ouvre en 1952 le premier cabinet d’avocats noirs de Johannesburg.',
      'Après le massacre de Sharpeville (1960), il dirige la branche armée de l’ANC et passe à la clandestinité.',
      'Condamné à la prison à vie au procès de Rivonia, le 12 juin 1964.',
      '18 ans à Robben Island à casser des pierres, puis 9 ans ailleurs : 27 ans de prison en tout.',
      'Libéré le 11 février 1990 ; prix Nobel de la paix en 1993 avec Frederik De Klerk.',
      'Élu président le 27 avril 1994, aux premières élections ouvertes à tous ; il ne fait qu’un mandat.',
    ],
    recit: [
      {
        titre: 'L’apartheid, un pays coupé par la loi',
        texte:
          'En 1948, le Parti national arrive au pouvoir en Afrique du Sud et organise en lois ce qui n’était qu’une habitude : c’est l’**apartheid**, « séparation » en afrikaans. Chaque habitant est enregistré dans une **race** ; les mariages mixtes sont interdits ; les Noirs, 70 % de la population, se voient attribuer 13 % des terres, dans des réserves appelées **bantoustans**. Hors de ces zones, ils doivent porter en permanence un laissez-passer, le *pass*, sous peine d’arrestation immédiate. Plages, bus, hôpitaux, écoles et bancs publics sont séparés. Le **21 mars 1960**, à **Sharpeville**, la police tire sur une manifestation contre les *pass* : 69 morts, la plupart dans le dos. L’ANC est interdit. Après Sharpeville, la voie légale est fermée.',
      },
      {
        titre: 'De l’avocat au clandestin',
        texte:
          'Né en 1918 dans le Transkei, fils d’un chef xhosa, **Nelson Mandela** monte à Johannesburg, y étudie le droit et ouvre en **1952** avec Oliver Tambo le premier cabinet d’avocats noirs du pays : la salle d’attente ne désemplit pas de gens poursuivis pour avoir habité, marché ou travaillé au mauvais endroit. Militant de l’**ANC** depuis 1944, il organise la campagne de défiance de 1952 et participe à la Charte de la liberté de 1955 — « L’Afrique du Sud appartient à tous ceux qui y vivent ». Après Sharpeville, il fonde **Umkhonto we Sizwe**, « le fer de lance de la nation », et choisit le **sabotage** d’installations, pas les attentats contre des personnes. Recherché, déguisé en chauffeur, il est surnommé « le Mouron noir » par la presse. Il est arrêté le 5 août 1962.',
      },
      {
        titre: 'Rivonia : le discours du box',
        texte:
          'En juillet 1963, la police tombe sur la ferme de **Rivonia**, quartier général clandestin de l’ANC, et saisit les plans du groupe. Mandela, déjà en prison, est jugé avec neuf autres accusés pour sabotage et complot : le procureur réclame la **pendaison**. Le **20 avril 1964**, au lieu de se défendre, Mandela lit une déclaration de quatre heures : il explique pourquoi un avocat en est venu au sabotage, décrit la vie des Noirs sous l’apartheid, et termine par la phrase qui fera le tour du monde — un idéal « pour lequel je suis prêt à mourir ». Le 12 juin, la cour prononce la **prison à vie**. Dans la nuit, les condamnés sont emmenés à Robben Island. Il a 45 ans ; il en ressortira à 71.',
      },
      {
        titre: 'Robben Island, vingt-sept ans',
        texte:
          'Sur **Robben Island**, au large du Cap, le prisonnier **46664** casse la pierre à la carrière de chaux : la réverbération lui abîmera les yeux à vie. Cellule de deux mètres sur deux, une paillasse, une lettre et une visite tous les six mois, courriers censurés à la lame. Il n’apprendra la mort de sa mère et celle de son fils aîné que par ces lettres, sans pouvoir assister aux obsèques. Les détenus transforment pourtant la prison en école — on l’appellera « l’université de Robben Island » — et Mandela apprend l’**afrikaans**, la langue de ses gardiens, pour comprendre ceux d’en face. En **1985**, le président Botha lui propose la liberté s’il renonce à la lutte armée. Il refuse par un message lu par sa fille : « Seuls des hommes libres peuvent négocier. » Les négociations secrètes commenceront quand même, à son initiative.',
      },
      {
        titre: 'Le 11 février 1990',
        texte:
          'L’Afrique du Sud est alors mise au ban du monde : embargo sur les armes, boycott sportif, sanctions économiques, concerts et campagnes « Free Mandela » — un homme dont personne ne connaît plus le visage, aucune photo n’ayant filtré depuis vingt ans. Le 2 février 1990, le nouveau président **Frederik De Klerk** lève l’interdiction de l’ANC ; le **11 février**, Mandela franchit à pied les grilles de la prison Victor-Verster, la main levée, devant les télévisions du monde entier. Suivent quatre années de négociations et de violences : plus de dix mille morts dans les affrontements entre factions. Les deux hommes tiennent. En 1993, ils reçoivent ensemble le **prix Nobel de la paix**. Le **27 avril 1994**, les Sud-Africains votent enfin tous : des files d’attente de plusieurs kilomètres, certains ayant patienté quatre heures pour un premier bulletin à 70 ans.',
      },
      {
        titre: 'Vérité et réconciliation',
        texte:
          'Président le 10 mai 1994, Mandela fait un choix que peu de vainqueurs font : ni vengeance, ni amnistie générale. La **Commission vérité et réconciliation**, présidée à partir de 1996 par l’archevêque **Desmond Tutu**, entend plus de 20 000 victimes et propose l’amnistie à quiconque avoue **complètement** ses crimes politiques, policiers compris. Les audiences sont publiques et retransmises : le pays regarde en face ce qui lui a été fait. Mandela apprend l’hymne afrikaner, invite à déjeuner la veuve du chef de l’apartheid, et apparaît à la finale de la **Coupe du monde de rugby 1995** en maillot des Springboks, symbole des Blancs, devant un stade qui scande son nom. Il quitte le pouvoir en **1999** après un seul mandat, alors que rien ne l’y obligeait. Il meurt le **5 décembre 2013**, à 95 ans.',
      },
    ],
    chrono: [
      { date: '18 juillet 1918', fait: 'Naissance à Mvezo, dans le Transkei.' },
      { date: '1944', fait: 'Il rejoint l’ANC et fonde sa ligue de jeunesse.' },
      { date: '21 mars 1960', fait: 'Massacre de Sharpeville : 69 morts, l’ANC est interdit.' },
      { date: '1961', fait: 'Il prend la tête de la branche armée de l’ANC.' },
      { date: '20 avril 1964', fait: 'Déclaration au procès de Rivonia.' },
      { date: '12 juin 1964', fait: 'Condamné à la prison à vie ; direction Robben Island.' },
      { date: '1985', fait: 'Il refuse une libération conditionnelle.' },
      { date: '11 février 1990', fait: 'Libéré après vingt-sept ans de détention.' },
      { date: '1993', fait: 'Prix Nobel de la paix, partagé avec De Klerk.' },
      { date: '27 avril 1994', fait: 'Premières élections ouvertes à tous les Sud-Africains.' },
      { date: '1996', fait: 'Ouverture de la Commission vérité et réconciliation.' },
      { date: '5 décembre 2013', fait: 'Mort à Johannesburg, à 95 ans.' },
    ],
    leSaisTu:
      'Le 24 juin 1995, pour la finale de la Coupe du monde de rugby, Mandela entre sur la pelouse en maillot vert des **Springboks**, l’équipe que les Noirs avaient toujours vue comme celle de l’apartheid, avec le numéro 6 du capitaine afrikaner François Pienaar. Soixante mille spectateurs, en majorité blancs, se lèvent en criant « Nelson ! Nelson ! ».',
    aRetenir: [
      'L’apartheid est le régime de séparation raciale organisé par la loi en Afrique du Sud de 1948 à 1991.',
      'Militant de l’ANC, Nelson Mandela est condamné à la prison à vie au procès de Rivonia en 1964 et y passe vingt-sept ans.',
      'Libéré le 11 février 1990, il négocie la fin de l’apartheid avec le président De Klerk ; tous deux reçoivent le prix Nobel de la paix en 1993.',
      'Le 27 avril 1994, les premières élections ouvertes à tous les Sud-Africains le portent à la présidence.',
      'La Commission vérité et réconciliation, ouverte en 1996, échange l’amnistie contre l’aveu complet des crimes.',
    ],
    mots: [
      {
        mot: 'Apartheid',
        sens: '« Séparation » en afrikaans : système sud-africain qui classait chacun par race et lui assignait des lieux et des droits.',
      },
      {
        mot: 'ANC',
        sens: 'Congrès national africain, principal mouvement de lutte contre l’apartheid, interdit de 1960 à 1990.',
      },
      {
        mot: 'Bantoustan',
        sens: 'Territoire réservé où l’État sud-africain parquait les populations noires, déclaré faussement indépendant.',
      },
      {
        mot: 'Amnistie',
        sens: 'Décision d’effacer les poursuites pour certains actes ; en Afrique du Sud, elle exigeait l’aveu complet.',
      },
    ],
    lies: ['gandhi', 'martin-luther-king', 'abraham-lincoln'],
    niveaux: ['3e', 'Tle'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'Mandela',
      'Madiba',
      'apartheid',
      'Afrique du Sud',
      'Robben Island',
      'ANC',
      'Rivonia',
      'De Klerk',
      'réconciliation',
      'Sharpeville',
      'Nobel',
    ],
  },
  {
    id: 'mikhail-gorbatchev',
    volet: 'personnages',
    nom: 'Mikhaïl Gorbatchev',
    surnom: 'le dernier dirigeant de l’URSS',
    dates: '1931 – 2022',
    tri: 2022,
    periode: 'contemporain',
    emoji: '🔓',
    roles: ['Secrétaire général du PCUS', 'Président de l’URSS', 'Prix Nobel de la paix'],
    origine: 'Privolnoïe, Caucase du Nord',
    accroche:
      'Il voulait réparer le communisme soviétique : il a libéré la parole, refusé d’envoyer les chars en 1989 et laissé l’URSS se défaire sans guerre civile.',
    citations: [
      {
        texte: 'Nous avons besoin de la démocratie comme de l’air que nous respirons.',
        contexte:
          'Devant le Comité central du Parti communiste, à Moscou, en janvier 1987, en lançant les réformes politiques.',
        sens:
          'Il ne veut pas renverser le régime mais le sauver : pour lui, un système sans débat ni critique s’étouffe lui-même, comme l’a montré Tchernobyl.',
      },
      {
        texte: 'La vie punit ceux qui arrivent trop tard.',
        contexte:
          'Berlin-Est, le 7 octobre 1989, aux dirigeants est-allemands qui refusent toute réforme. Le Mur tombe un mois plus tard.',
        sens:
          'La formule a circulé dans sa version allemande, *Wer zu spät kommt, den bestraft das Leben* ; Gorbatchev a toujours dit ne pas l’avoir prononcée exactement ainsi. Le sens, lui, était bien celui-là.',
        incertaine: true,
      },
      {
        texte:
          'Tchernobyl a été un tournant : il a ouvert la possibilité d’une liberté d’expression bien plus grande, au point que le système que nous connaissions ne pouvait plus continuer.',
        contexte:
          'Texte écrit en 2006, vingt ans après la catastrophe du 26 avril 1986.',
        sens:
          'Le mensonge d’État sur le nuage radioactif a convaincu le dirigeant soviétique lui-même que le secret coûtait plus cher que la vérité.',
      },
      {
        texte:
          'Je quitte mes fonctions avec inquiétude, mais aussi avec espoir, avec foi en vous, en votre sagesse et votre force d’âme.',
        contexte:
          'Allocution télévisée de démission, le 25 décembre 1991 ; le drapeau rouge est descendu du Kremlin une heure plus tard.',
      },
    ],
    reperes: [
      'Petit-fils de paysans du Caucase : ses deux grands-pères ont été arrêtés sous Staline.',
      'Secrétaire général du Parti communiste le 11 mars 1985, à 54 ans — le plus jeune depuis Staline.',
      'Deux mots d’ordre : la perestroïka, « restructuration », et la glasnost, « transparence ».',
      'Il retire l’Armée rouge d’Afghanistan en février 1989, après dix ans de guerre.',
      'À l’automne 1989, il refuse d’envoyer les chars quand les démocraties populaires basculent.',
      'Prix Nobel de la paix en 1990 ; il démissionne le 25 décembre 1991 et l’URSS disparaît le lendemain.',
    ],
    recit: [
      {
        titre: 'Un réformateur au Kremlin',
        texte:
          'L’URSS du début des années 1980 vieillit sur place : trois dirigeants meurent en trois ans (Brejnev en 1982, Andropov en 1984, Tchernenko en 1985), l’économie ne tient que grâce au pétrole, les magasins sont vides et l’on fait la queue des heures pour des chaussures. Le **11 mars 1985**, le Parti choisit **Mikhaïl Gorbatchev**, 54 ans, juriste et agronome, petit-fils de paysans dont les deux grands-pères avaient été arrêtés sous Staline. Il est convaincu que le socialisme soviétique peut être réparé — pas remplacé. Il commence par l’« accélération » de la production et une campagne contre l’alcool, qui vide les caisses de l’État sans assainir grand-chose. Les vraies ruptures viendront d’ailleurs.',
      },
      {
        titre: 'Perestroïka et glasnost',
        texte:
          'Deux mots russes font le tour du monde. La **perestroïka** — « restructuration » — autorise de petites entreprises privées, donne de l’autonomie aux usines, tolère les coopératives. La **glasnost** — « transparence » — desserre la censure : les journaux publient ce qui était interdit, la télévision débat en direct, les crimes de Staline sont enfin nommés publiquement, *Le Docteur Jivago* et Soljenitsyne paraissent légalement. En décembre 1986, Gorbatchev appelle lui-même le physicien dissident **Andreï Sakharov** pour le sortir de son exil à Gorki. En **mars 1989**, les Soviétiques votent pour la première fois dans des élections en partie libres, et des dizaines de dignitaires du Parti sont battus. Mais les réformes économiques, à moitié faites, désorganisent la production : en 1990, il manque du pain dans les villes, et la popularité du réformateur s’effondre chez lui au moment même où elle explose à l’étranger.',
      },
      {
        titre: 'Tchernobyl, la leçon du mensonge',
        texte:
          'Le **26 avril 1986**, le réacteur n° 4 de la centrale de **Tchernobyl**, en Ukraine soviétique, explose. L’appareil d’État réagit comme toujours : silence. La ville voisine de Pripiat n’est évacuée que trente-six heures plus tard, le défilé du 1ᵉʳ mai est maintenu à Kiev sous le nuage, et c’est une centrale suédoise qui alerte le monde en détectant la radioactivité. Gorbatchev ne parle à la télévision que le **14 mai**. Des centaines de milliers de « liquidateurs » sont envoyés sur le site ; la facture engloutit une part énorme du budget. Il écrira plus tard que Tchernobyl, plus que toute autre chose, l’a convaincu que le **secret** était devenu mortel pour le pays — et a rendu la glasnost irréversible.',
      },
      {
        titre: 'Désarmer, et rentrer d’Afghanistan',
        texte:
          'Face au président américain **Ronald Reagan**, Gorbatchev ne joue pas la surenchère. Après le sommet de Reykjavik (1986), les deux hommes signent à Washington, le **8 décembre 1987**, le traité **FNI** : pour la première fois de l’histoire, une catégorie entière de missiles nucléaires — les armes de portée intermédiaire braquées sur l’Europe — est détruite, et non simplement plafonnée. Le **15 février 1989**, le dernier soldat soviétique repasse le pont de l’Amou-Daria : l’URSS quitte l’**Afghanistan** après dix ans de guerre, 15 000 morts soviétiques et une défaite qui ne dit pas son nom. À Malte, en décembre 1989, Gorbatchev et George Bush déclarent la **guerre froide** terminée.',
      },
      {
        titre: 'L’automne 1989 : les chars ne partent pas',
        texte:
          'Depuis 1968, la « doctrine Brejnev » autorisait Moscou à envoyer ses blindés dans tout pays du bloc qui s’écarterait de la ligne — Budapest en 1956, Prague en 1968. Gorbatchev l’abandonne, avec une ironie restée célèbre au Kremlin : la **doctrine Sinatra**, chacun fait « à sa façon ». Les effets s’enchaînent en quelques mois : élections semi-libres en **Pologne** en juin 1989, que Solidarność remporte ; ouverture du rideau de fer par la **Hongrie** en août ; manifestations monstres à Leipzig ; chute du **mur de Berlin** le **9 novembre 1989** ; révolution de velours à Prague. Pas un char soviétique ne bouge. Ce **refus d’intervenir** est le geste décisif de la fin de la guerre froide, et il lui vaut le **prix Nobel de la paix** en 1990.',
      },
      {
        titre: 'La fin de l’URSS',
        texte:
          'Libérées de la peur, les républiques soviétiques réclament leur indépendance : les pays baltes d’abord, puis l’Ukraine, la Géorgie, l’Asie centrale. Gorbatchev tente un traité qui sauverait une union rénovée. Le **19 août 1991**, des conservateurs du Parti, de l’armée et du KGB le séquestrent dans sa datcha de Crimée et proclament l’état d’urgence : le **putsch** échoue en trois jours, brisé dans la rue par les Moscovites et par **Boris Eltsine**, debout sur un char. Gorbatchev revient sans pouvoir. Le 8 décembre, la Russie, l’Ukraine et la Biélorussie dissolvent l’URSS entre elles. Le **25 décembre 1991**, il démissionne à la télévision ; le drapeau rouge descend du Kremlin. Détesté chez lui pour l’effondrement du pays, honoré ailleurs pour la paix, il est mort à Moscou le **30 août 2022**.',
      },
    ],
    chrono: [
      { date: '2 mars 1931', fait: 'Naissance à Privolnoïe, dans le Caucase du Nord.' },
      { date: '11 mars 1985', fait: 'Il devient secrétaire général du Parti communiste.' },
      { date: '26 avril 1986', fait: 'Catastrophe nucléaire de Tchernobyl.' },
      { date: '1987', fait: 'Perestroïka et glasnost deviennent la ligne officielle.' },
      { date: '8 décembre 1987', fait: 'Traité FNI avec Reagan : des missiles détruits.' },
      { date: '15 février 1989', fait: 'Fin du retrait soviétique d’Afghanistan.' },
      { date: 'automne 1989', fait: 'Il laisse basculer les démocraties populaires.' },
      { date: '9 novembre 1989', fait: 'Chute du mur de Berlin.' },
      { date: '1990', fait: 'Prix Nobel de la paix ; il devient président de l’URSS.' },
      { date: '19 août 1991', fait: 'Putsch manqué des conservateurs à Moscou.' },
      { date: '25 décembre 1991', fait: 'Démission : l’URSS disparaît le lendemain.' },
      { date: '30 août 2022', fait: 'Mort à Moscou, à 91 ans.' },
    ],
    leSaisTu:
      'En 1997, l’ancien maître de l’URSS a tourné une publicité pour une chaîne de pizzas américaine, filmée sur la place Rouge, afin de financer sa fondation et une école. Dans le spot, des clients se disputent pour savoir s’il a ruiné ou libéré le pays — avant de trinquer tous ensemble à sa santé.',
    aRetenir: [
      'Mikhaïl Gorbatchev dirige l’URSS du 11 mars 1985 au 25 décembre 1991.',
      'La perestroïka (restructuration économique) et la glasnost (transparence) visaient à réformer le système soviétique, non à le supprimer.',
      'Il signe avec Reagan le traité FNI de 1987, premier accord détruisant toute une catégorie de missiles, et quitte l’Afghanistan en 1989.',
      'À l’automne 1989, il refuse d’intervenir militairement : les démocraties populaires basculent et le mur de Berlin tombe le 9 novembre.',
      'Prix Nobel de la paix en 1990, il démissionne le 25 décembre 1991 et l’URSS disparaît le lendemain.',
    ],
    mots: [
      {
        mot: 'Perestroïka',
        sens: '« Restructuration » : réforme de l’économie soviétique ouvrant la porte à l’initiative privée.',
      },
      {
        mot: 'Glasnost',
        sens: '« Transparence » : fin de la censure et droit de critiquer publiquement le pouvoir et le passé.',
      },
      {
        mot: 'PCUS',
        sens: 'Parti communiste de l’Union soviétique, parti unique qui dirigeait l’État de 1922 à 1991.',
      },
      {
        mot: 'Démocraties populaires',
        sens: 'Les États d’Europe de l’Est soumis à Moscou de 1947 à 1989 : Pologne, Hongrie, RDA, Tchécoslovaquie…',
      },
    ],
    lies: [
      'staline',
      'lenine',
      'jean-paul-ii',
      'john-fitzgerald-kennedy',
      'francois-mitterrand',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Enjeux et conflits dans le monde après 1989',
    tags: [
      'Gorbatchev',
      'URSS',
      'perestroïka',
      'glasnost',
      'Tchernobyl',
      'guerre froide',
      'mur de Berlin',
      'Reagan',
      'Afghanistan',
      'Kremlin',
      'Nobel',
    ],
  },
]
