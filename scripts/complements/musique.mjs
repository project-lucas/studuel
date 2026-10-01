export default {
  slug: 'musique',
  titreMigration: 'QUESTIONS EN PLUS — MUSIQUE 3e → Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '3e',
      titre: 'Les grandes périodes de l’histoire de la musique',
      questions: [
        ['Quelles sont les dates de la période baroque ?', ['1450-1600', '1600-1750', '1750-1820', '1820-1900'], 1, 'Le baroque va de 1600 à 1750 environ, date de la mort de Bach ; vient ensuite la période classique.'],
        ['Quelle forme baroque oppose un soliste à l’orchestre ?', ['La fugue', 'L’opéra', 'Le concerto', 'Le chant grégorien'], 2, 'Le concerto naît au baroque sur l’opposition entre un soliste et l’orchestre ; Vivaldi en a écrit des centaines.'],
        ['Quel trait domine la musique classique (1750-1820) ?', ['L’équilibre et la clarté', 'La rupture avec la tonalité', 'La monodie en latin', 'L’expression débordante du sentiment'], 0, 'Mozart et Haydn cherchent l’équilibre et la clarté ; l’expression du sentiment sera la marque du romantisme.'],
        ['Qu’est-ce qui transforme les musiques actuelles depuis 1900 ?', ['La basse continue', 'La polyphonie', 'Le chant grégorien', 'L’enregistrement'], 3, 'L’enregistrement change tout : jazz, rock, électronique et rap se diffusent et se créent grâce à lui.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Forme et structure d’une œuvre',
      questions: [
        ['Dans la forme AABA, que désigne la partie B ?', ['Un pont, placé au milieu', 'Le refrain final', 'L’introduction', 'Une improvisation libre'], 0, 'En AABA, on entend trois fois le thème A, avec un pont (B) au milieu pour contraster.'],
        ['Quelle chanson est un exemple classique de canon ?', ['*La Marseillaise*', '*Frère Jacques*', '*Les Quatre Saisons*', '*Au clair de la lune* chanté seul'], 1, 'Dans *Frère Jacques*, chaque voix reprend exactement la mélodie de la précédente, à distance : c’est un canon.'],
        ['Qu’est-ce qu’une variation peut changer au thème ?', ['Rien : elle le rejoue à l’identique', 'Seulement ses paroles', 'Le rythme, l’harmonie, le mode ou l’instrumentation', 'Sa place dans le programme du concert'], 2, 'Une variation déguise le thème (rythme, harmonie, mode, instruments) tout en le laissant reconnaissable.'],
        ['Dans une fugue, comment s’appellent les éléments qui s’enchaînent ?', ['Couplet, refrain, pont', 'Thème, variations, coda', 'Exposition, crise, dénouement', 'Sujet, réponse, épisodes'], 3, 'La fugue développe l’imitation de façon savante : un sujet, une réponse qui l’imite, et des épisodes.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Musique et société',
      questions: [
        ['Au cinéma, une valse légère sur une scène violente…', ['anticipe un danger', 'contredit l’image', 'soutient l’émotion visible', 'sert de leitmotiv'], 1, 'Quand la musique va à l’encontre de ce qu’on voit, elle contredit l’image et crée un malaise.'],
        ['Que font les algorithmes de recommandation des plateformes ?', ['Ils rémunèrent les auteurs', 'Ils enregistrent les concerts', 'Ils décident en partie de ce qu’on écoute', 'Ils écrivent les partitions'], 2, 'En proposant les morceaux suivants, les algorithmes orientent nos découvertes musicales.'],
        ['Quelle musique française a porté la contestation politique ?', ['La chanson engagée', 'Le chant grégorien', 'La musique officielle', 'L’hymne national'], 0, 'La chanson engagée française met des mots et une mélodie sur la contestation politique.'],
        ['Qu’est-ce qu’une musique officielle dans un régime autoritaire ?', ['Une musique interdite', 'Une chanson de rue', 'Une improvisation de jazz', 'Une musique qui célèbre le régime'], 3, 'Les régimes autoritaires encouragent des musiques qui les célèbrent et censurent les artistes d’opposition.'],
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      titre: 'Langage musical et analyse',
      questions: [
        ['Quel effet produit une cadence suspensive ?', ['L’achèvement : la phrase se ferme', 'L’attente : la phrase reste ouverte', 'La surprise : l’attente est déjouée', 'Le silence complet'], 1, 'On s’arrête sur la dominante : l’oreille attend une suite, la phrase reste ouverte.'],
        ['Une cadence rompue enchaîne la dominante…', ['avec la tonique', 'avec elle-même', 'avec un autre degré que la tonique', 'avec un silence'], 2, 'Au lieu d’aller à la tonique attendue, la dominante part vers un autre degré : c’est la surprise de la cadence rompue.'],
        ['Quelle texture superpose plusieurs lignes mélodiques indépendantes ?', ['La polyphonie', 'La monodie', 'L’homophonie', 'L’hétérophonie'], 0, 'La polyphonie, celle de la fugue et du motet, fait entendre plusieurs lignes indépendantes en même temps.'],
        ['Où trouve-t-on une musique modale, ni majeure ni mineure ?', ['Dans la cadence parfaite', 'Dans l’accord de trois sons', 'Dans l’homophonie classique', 'Dans le chant grégorien et le jazz modal'], 3, 'Le système modal utilise d’autres échelles : on le trouve dans le grégorien, les musiques traditionnelles et le jazz modal.'],
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      titre: 'Création et technologies',
      questions: [
        ['Qu’a permis le multipiste dans les années 1950 ?', ['Faire du studio un instrument', 'Faire dialoguer les machines', 'Inventer le disque', 'Enregistrer les sons du réel pour la première fois'], 0, 'En enregistrant les pistes séparément puis en les mixant, le multipiste fait du studio un véritable instrument.'],
        ['Comment fonctionne la synthèse additive ?', ['En filtrant un son riche', 'En modulant une fréquence par une autre', 'En empilant des harmoniques', 'En enregistrant une porte qui claque'], 2, 'La synthèse additive construit le son en superposant des harmoniques ; la soustractive filtre, la FM module.'],
        ['Pourquoi un même fichier MIDI sonne-t-il différemment d’une machine à l’autre ?', ['Parce qu’il est compressé avec perte', 'Parce qu’il ne transporte que des instructions, pas du son', 'Parce qu’il s’abîme à chaque lecture', 'Parce qu’il contient un enregistrement de mauvaise qualité'], 1, 'Le MIDI dit quelle note, quelle intensité, quelle durée ; chaque machine fabrique ensuite son propre son.'],
        ['Qu’est-ce qui distingue l’électroacoustique de la musique concrète ?', ['Elle refuse tout son enregistré', 'Elle est née avant 1948', 'Elle ne se joue qu’en concert', 'Elle élargit le matériau à tout son possible, même synthétique'], 3, 'La musique concrète part de sons enregistrés du réel ; l’électroacoustique accepte tout son, y compris entièrement synthétique.'],
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      titre: 'Interpréter et écouter',
      questions: [
        ['Quel choix de l’interprète agit surtout sur le relief, sur ce qui passe au premier plan ?', ['Le tempo', 'Les nuances', 'Le phrasé', 'Le diapason'], 1, 'Les nuances (forte, piano…) règlent l’intensité et font ressortir certains éléments.'],
        ['Quelles cordes utilisent souvent les musiciens « historiquement informés » ?', ['Des cordes en acier', 'Des cordes en nylon', 'Des cordes en boyau', 'Des cordes électriques'], 2, 'Pour retrouver le son d’époque, ils jouent avec des cordes en boyau, un diapason plus bas et des effectifs réduits.'],
        ['Pendant une écoute active, que faut-il surtout repérer ?', ['Les retours et les ruptures', 'Le nom de chaque musicien', 'Le prix du billet', 'La durée exacte en secondes'], 0, 'Ce qui revient et ce qui casse structure l’œuvre : c’est là que l’intention du compositeur se lit.'],
        ['Quel est le raccourci le plus efficace pour comprendre ce que décide un interprète ?', ['Lire sa biographie', 'Écouter l’œuvre très fort', 'Apprendre la partition par cœur', 'Comparer deux interprétations du même passage'], 3, 'Ce qui diffère entre deux versions du même passage, c’est exactement ce que l’interprète a choisi.'],
      ],
    },
  ],
}
