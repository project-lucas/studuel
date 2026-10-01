export default {
  slug: 'grec',
  titreMigration: 'QUESTIONS EN PLUS — GREC 3e, 2de, Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '3e',
      titre: 'L’alphabet grec',
      questions: [
        ['Quelle lettre grecque ressemble à un « v » mais note un N ?', ['υ (upsilon)', 'ν (nu)', 'η (êta)', 'ρ (rhô)'], 1, 'Le ν (nu) ressemble à notre « v » mais se lit « n » : c’est l’un des pièges de lecture de l’alphabet.'],
        ['Que note la lettre ρ (rhô) ?', ['Un P', 'Un B', 'Un R', 'Un F'], 2, 'Le rhô ressemble à notre « p » mais note un R ; le P grec s’écrit π (pi).'],
        ['Quelle est la seule lettre grecque qui change de forme selon sa place dans le mot ?', ['Le sigma', 'L’oméga', 'L’êta', 'Le khi'], 0, 'Le sigma s’écrit σ à l’intérieur du mot et ς en fin de mot, comme dans λόγος.'],
        ['Pourquoi « hippodrome » s’écrit-il avec un « h » ?', ['Parce que le mot vient du latin', 'Parce que ἵππος commence par un êta', 'Parce que c’est une règle d’orthographe française', 'Parce que ἵππος porte un esprit rude'], 3, 'L’esprit rude note une aspiration : il explique les « h » du vocabulaire savant français (histoire, hippodrome).'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les mots grecs dans le français',
      questions: [
        ['Que signifie le préfixe grec « péri- » ?', ['À travers', 'Autour', 'Au-delà', 'Contre'], 1, 'Péri- signifie « autour » : le périmètre est la mesure du tour d’une figure.'],
        ['Que signifie la racine « graphein » que l’on retrouve dans « orthographe » ?', ['Aimer', 'Parler', 'Écrire', 'Voir'], 2, 'Graphein veut dire « écrire » : l’orthographe, c’est l’art d’écrire correctement.'],
        ['De quoi s’occupe un néphrologue ?', ['Des reins', 'Du cœur', 'De la peau', 'Des poumons'], 0, 'La racine néphr- désigne le rein ; la peau se dit derm-, le poumon pneum-.'],
        ['Que signifie littéralement « chronologie » ?', ['L’amour du temps', 'La mesure de la vie', 'L’écriture de l’histoire', 'Le discours sur le temps'], 3, 'Chronologie = χρόνος (le temps) + λόγος (le discours, la science).'],
      ],
    },
    {
      niveau: '3e',
      titre: 'La mythologie grecque',
      questions: [
        ['Quel héros a vaincu Méduse, dont le regard pétrifiait ?', ['Thésée', 'Persée', 'Achille', 'Ulysse'], 1, 'Persée a tranché la tête de Méduse, la Gorgone qui changeait en pierre ceux qui la regardaient.'],
        ['Quel phénomène le mythe de l’enlèvement de Perséphone explique-t-il ?', ['L’origine du feu', 'Les malheurs humains', 'Le retour des saisons', 'La naissance des étoiles'], 2, 'Quand Perséphone rejoint Hadès aux Enfers, sa mère Déméter, déesse des moissons, fait mourir la végétation : c’est l’hiver.'],
        ['Quel dieu est le messager des dieux et le protecteur des voyageurs ?', ['Hermès', 'Apollon', 'Arès', 'Héphaïstos'], 0, 'Hermès, aux sandales ailées, porte les messages des dieux et protège les voyageurs.'],
        ['Quelle est la différence entre Athéna et Arès, tous deux liés à la guerre ?', ['Athéna protège la mer, Arès la terre', 'Arès est une déesse, Athéna un dieu', 'Ils sont en réalité la même divinité', 'Athéna incarne la guerre stratégique, Arès la guerre brutale'], 3, 'Athéna est la déesse de la sagesse et de la stratégie ; Arès, dieu de la violence guerrière.'],
      ],
    },
    {
      niveaux: ['2de', 'Tle'],
      titre: 'La déclinaison grecque',
      questions: [
        ['Combien de cas compte le grec de moins que le latin ?', ['Aucun, ils en ont autant', 'Un seul : le grec n’a pas d’ablatif', 'Deux', 'Trois'], 1, 'Le grec a cinq cas, le latin six : il n’y a pas d’ablatif, dont le datif reprend une partie des fonctions (moyen, lieu).'],
        ['Quel est le génitif de ὁ λόγος ?', ['τῆς λόγης', 'τὸ λόγον', 'τοῦ λόγου', 'τῷ λόγῳ'], 2, 'Les masculins en -ος de la 2e déclinaison font leur génitif en -ου : τοῦ λόγου, « de la parole ».'],
        ['À quelle déclinaison appartient ἡ τιμή (l’honneur) ?', ['À la 1re', 'À la 2e', 'À la 3e', 'Elle ne se décline pas'], 0, 'La 1re déclinaison regroupe surtout des féminins en -η ou -α, comme τιμή.'],
        ['Devant un nom inconnu, quel est le meilleur indice pour trouver son cas ?', ['Sa place dans la phrase', 'Sa longueur', 'Sa première lettre', 'La terminaison de l’article qui l’accompagne'], 3, 'L’article ὁ / ἡ / τό se décline aussi : lire sa terminaison donne le cas et fait gagner la moitié du travail.'],
      ],
    },
    {
      niveaux: ['2de', 'Tle'],
      titre: 'Athènes et la démocratie',
      questions: [
        ['Quelle réforme de Solon, en 594 av. J.-C., a marqué Athènes ?', ['Le tirage au sort des stratèges', 'L’abolition de l’esclavage pour dettes', 'La création du misthos', 'Le droit de vote des femmes'], 1, 'Solon abolit l’esclavage pour dettes et classe les citoyens selon leur richesse.'],
        ['Qu’est-ce que l’Héliée à Athènes ?', ['L’assemblée qui vote la guerre', 'Le conseil qui prépare les lois', 'Le tribunal populaire', 'Le collège des dix stratèges'], 2, 'L’Héliée est le tribunal populaire, composé de jurés tirés au sort parmi les citoyens.'],
        ['Parmi les habitants d’Athènes, quelle proportion environ était citoyenne ?', ['Un sur six', 'La moitié', 'Neuf sur dix', 'Tous les hommes libres'], 0, 'Environ 40 000 citoyens sur 250 000 habitants : la démocratie athénienne était directe mais restreinte.'],
        ['Pourquoi le morcellement du monde grec en cités a-t-il favorisé l’invention politique ?', ['Parce qu’un roi unique imposait la démocratie', 'Parce que les cités n’avaient pas de territoire', 'Parce que toutes les cités avaient les mêmes lois', 'Parce que des cités indépendantes pouvaient expérimenter chacune leur régime'], 3, 'Le monde grec n’est jamais un État unifié : des cités rivales et indépendantes rendent possible l’expérimentation politique.'],
      ],
    },
    {
      niveaux: ['2de', 'Tle'],
      titre: 'Théâtre et philosophie',
      questions: [
        ['Que désigne la némésis dans la tragédie grecque ?', ['La démesure du héros', 'Le châtiment qu’appelle la démesure', 'Le chant du chœur', 'La purgation des passions'], 1, 'L’hybris (démesure) appelle la némésis (châtiment) : c’est la mécanique même de la tragédie.'],
        ['Lequel de ces auteurs n’a PAS écrit de tragédies ?', ['Eschyle', 'Sophocle', 'Aristophane', 'Euripide'], 2, 'Aristophane est l’auteur comique qui raille la vie politique d’Athènes ; les trois autres sont les grands tragiques.'],
        ['Comment s’appelle la méthode de questionnement de Socrate ?', ['La maïeutique', 'La catharsis', 'La rhétorique', 'L’hybris'], 0, 'Socrate « accouche les esprits » par ses questions : c’est la maïeutique.'],
        ['Quelle école Platon a-t-il fondée ?', ['Le Lycée', 'Le Portique', 'Le Jardin', 'L’Académie'], 3, 'Platon fonde l’Académie et écrit les *Dialogues* ; son disciple Aristote fondera le Lycée.'],
      ],
    },
  ],
}
