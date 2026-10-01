export default {
  slug: 'physique-chimie',
  titreMigration: 'QUESTIONS EN PLUS — PHYSIQUE-CHIMIE 5e (lot 35)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: ["5e","4e"], titre: "Les différentes formes d’énergie",
      questions: [
        ['Si l’on double la hauteur à laquelle est placé un objet, que devient son énergie de position ?', ['Elle reste identique', 'Elle est multipliée par 4', 'Elle est divisée par 2', 'Elle est doublée'], 3, 'Epp = m × g × h : l’énergie de position est proportionnelle à la hauteur. Hauteur ×2, énergie ×2 (le carré ne concerne que la vitesse de l’énergie cinétique).'],
        ['Dans quelle forme d’énergie range-t-on celle stockée dans une pile ou un carburant ?', ['Thermique', 'Chimique', 'Nucléaire', 'Lumineuse'], 1, 'Aliments, carburants et piles stockent de l’énergie chimique, liée aux liaisons entre atomes, qui sera convertie en une autre forme.'],
        ['Une calorie (utilisée en nutrition) vaut environ :', ['4,18 J', '3,6 × 10⁶ J', '1 000 J', '0,24 J'], 0, '1 cal ≈ 4,18 J. Le kilowattheure, lui, vaut 3,6 × 10⁶ J : ne pas confondre ces deux unités.'],
        ['Un radiateur de 1 000 W fonctionne pendant une heure. Quelle énergie a-t-il consommée ?', ['3 600 J', '10³ kWh', '1 kWh', '1 J'], 2, '1 000 W pendant 1 h font 1 kW × 1 h = 1 kWh, soit 3,6 × 10⁶ J. Les 3 600 J correspondent à un seul watt pendant une heure.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Transferts et conversions d’énergie",
      questions: [
        ['L’air chaud qui monte au-dessus d’un radiateur illustre quel mode de transfert thermique ?', ['La conduction', 'La convection', 'Le rayonnement', 'La conversion'], 1, 'La convection est un transfert par déplacement de matière dans un fluide : l’air chaud, moins dense, s’élève.'],
        ['Quelle conversion réalise un alternateur ?', ['Électrique → cinétique', 'Lumineuse → électrique', 'Cinétique → électrique', 'Chimique → thermique'], 2, 'L’alternateur est mis en rotation (énergie cinétique) et fournit de l’énergie électrique. Le moteur électrique fait l’inverse.'],
        ['Dans une centrale thermique, sous quelle forme est l’énergie au niveau de la turbine ?', ['Électrique', 'Chimique', 'Thermique', 'Cinétique'], 3, 'Chimique (charbon) → thermique (chaudière) → cinétique (turbine) → électrique (alternateur).'],
        ['Une lampe reçoit 100 J d’énergie électrique et en convertit 5 J en lumière. Quel est son rendement ?', ['5 %', '95 %', '20 %', '500 %'], 0, 'rendement = énergie utile ÷ énergie reçue = 5 ÷ 100 = 5 %. C’est le rendement typique d’une lampe à incandescence ; les 95 J restants partent en chaleur.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Calculer la vitesse et l’énergie cinétique",
      questions: [
        ['Quelle est la vitesse de 90 km/h exprimée en m/s ?', ['324 m/s', '90 m/s', '25 m/s', '250 m/s'], 2, 'On divise par 3,6 : 90 ÷ 3,6 = 25 m/s. Multiplier par 3,6 est l’erreur classique, elle donne 324.'],
        ['Un cycliste et son vélo (80 kg au total) roulent à 10 m/s. Quelle est leur énergie cinétique ?', ['4 000 J', '8 000 J', '800 J', '40 000 J'], 0, 'Ec = ½ × m × v² = 0,5 × 80 × 10² = 0,5 × 80 × 100 = 4 000 J. Oublier le carré ou le ½ donne les autres résultats.'],
        ['Par combien l’énergie cinétique est-elle multipliée quand la vitesse est multipliée par 3 ?', ['3', '6', '9', '27'], 2, 'Ec dépend de v² : 3² = 9. Trois fois plus vite, c’est neuf fois plus d’énergie à dissiper au freinage.'],
        ['Lequel de ces facteurs allonge la distance de freinage ?', ['Le téléphone', 'La fatigue', 'L’alcool', 'Les pneus usés'], 3, 'Téléphone, fatigue et alcool allongent la distance de réaction. Pluie et pneus usés allongent la distance de freinage.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Conservation et pertes d’énergie",
      questions: [
        ['Quel est le bilan énergétique d’un appareil ?', ['énergie reçue = énergie utile − énergie dissipée', 'énergie reçue = énergie utile + énergie dissipée', 'énergie reçue = énergie utile × énergie dissipée', 'énergie reçue = énergie utile ÷ énergie dissipée'], 1, 'L’énergie se conserve : ce qui est reçu se retrouve en énergie utile plus énergie dissipée (le plus souvent en chaleur).'],
        ['Une lampe reçoit 200 J et en convertit 10 J en lumière utile. Quelle énergie est dissipée ?', ['10 J', '210 J', '20 J', '190 J'], 3, 'énergie dissipée = énergie reçue − énergie utile = 200 − 10 = 190 J. Le rendement n’est que de 5 %.'],
        ['Que devient l’énergie « perdue » par un moteur ?', ['Elle est détruite définitivement par les frottements', 'Elle repasse intégralement dans le réservoir de carburant', 'Elle est dissipée sous forme de chaleur dans l’environnement', 'Elle est créée en trop par le moteur'], 2, 'L’énergie ne disparaît pas : elle est dissipée en chaleur, trop diluée pour être récupérée. « Perte » désigne une énergie inutilisable, pas détruite.'],
        ['À quoi sert l’étiquette énergie d’un appareil ?', ['À en comparer le rendement pour choisir le plus économe', 'À en connaître le prix d’achat', 'À en mesurer la tension', 'À en lire la durée de garantie'], 0, 'L’étiquette énergie classe les appareils selon leur efficacité : choisir un bon rendement est un geste d’économie d’énergie.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "L’Univers et le Système solaire",
      questions: [
        ['La lumière met environ 500 s pour aller du Soleil à la Terre. Sa vitesse est de 300 000 km/s. Quelle est la distance Terre-Soleil ?', ['6 × 10² km', '1,5 × 10⁵ km', '1,5 × 10⁸ km', '9,5 × 10¹² km'], 2, 'd = v × t = 300 000 × 500 = 150 000 000 km = 1,5 × 10⁸ km. La durée est en secondes et la vitesse en km/s : la distance sort en km.'],
        ['Quelles sont les planètes telluriques du Système solaire ?', ['Jupiter, Saturne, Uranus, Neptune', 'Mercure, Vénus, la Terre, Mars', 'Mars, Jupiter, Saturne, Uranus', 'Vénus, la Terre, Saturne, Neptune'], 1, 'Les planètes telluriques sont rocheuses : Mercure, Vénus, la Terre et Mars. Les quatre autres sont gazeuses.'],
        ['Proxima du Centaure est à 4,2 années-lumière. Que voit-on quand on l’observe ?', ['4,2 jours', '8 minutes', '4,2 milliards d’années', '4,2 ans'], 3, 'Sa lumière a mis 4,2 ans à nous parvenir : on la voit telle qu’elle était il y a 4,2 ans. Regarder loin, c’est regarder tôt.'],
        ['Une année-lumière vaut environ :', ['9,5 × 10¹² km', '3 × 10⁵ km', '1,5 × 10⁸ km', '4,2 × 10⁶ km'], 0, 'C’est la distance parcourue par la lumière en un an : 300 000 km/s × environ 31,5 millions de secondes ≈ 9,5 × 10¹² km.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La continuité de la matière dans l’Univers",
      questions: [
        ['Parmi ces éléments, lequel a été fabriqué au cœur des étoiles ?', ['L’hydrogène', 'L’hélium', 'Le carbone', 'Aucun élément'], 2, 'L’hydrogène et l’hélium datent des débuts de l’Univers. Le carbone, l’oxygène et le fer sont fabriqués dans les étoiles, puis dispersés quand elles explosent.'],
        ['Quel est l’ordre de grandeur de la taille d’une cellule ?', ['10⁻¹⁰ m', '10⁻⁵ m', '1 m', '10⁷ m'], 1, 'Atome 10⁻¹⁰ m, cellule 10⁻⁵ m, organisme 1 m, planète 10⁷ m, Univers observable 10²⁶ m.'],
        ['Qu’est-ce qu’une molécule ?', ['Un atome ayant perdu des électrons', 'Un noyau entouré d’un seul électron', 'Une particule du noyau', 'Un assemblage d’atomes'], 3, 'Une molécule est un assemblage d’atomes, comme H₂O, CO₂ ou O₂. Un atome chargé, lui, s’appelle un ion.'],
        ['Quel est l’ordre de grandeur de la taille d’une planète ?', ['10⁷ m', '10⁻⁵ m', '10²⁶ m', '1 m'], 0, 'Une planète mesure de l’ordre de 10⁷ m (la Terre : environ 1,3 × 10⁷ m de diamètre). 10²⁶ m est la taille de l’Univers observable.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les constituants de l’atome",
      questions: [
        ['Que désigne le symbole Co ?', ['Le cuivre', 'Le monoxyde de carbone', 'Le cobalt', 'Le carbone'], 2, 'Co avec une minuscule est le cobalt. CO en deux majuscules est le monoxyde de carbone (un atome de carbone, un d’oxygène). La casse compte.'],
        ['L’atome de carbone possède 6 protons. Combien a-t-il d’électrons ?', ['12', '6', '0', '8'], 1, 'Un atome est neutre : il a autant d’électrons que de protons. Le carbone a donc 6 électrons.'],
        ['Un atome perd un électron. Quelle est la charge de l’ion obtenu ?', ['Positive', 'Négative', 'Nulle', 'Il devient un autre élément'], 0, 'L’électron est négatif : en perdre un laisse un excès de charge positive. L’élément ne change pas, car le nombre de protons est le même.'],
        ['Combien d’atomes contient une molécule de CO₂ ?', ['2', '4', '1', '3'], 3, 'CO₂ comporte un atome de carbone et deux atomes d’oxygène (l’indice 2 compte l’atome qui le précède) : 3 atomes.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le courant électrique",
      questions: [
        ['Quels sont les porteurs de charge du courant dans une solution ionique ?', ['Les électrons libres', 'Les ions', 'Les atomes neutres', 'Les neutrons'], 1, 'Dans un métal, ce sont les électrons libres ; dans une solution ionique (eau salée), ce sont les ions qui se déplacent.'],
        ['Lequel de ces éléments est conducteur ?', ['Le bois sec', 'Le verre', 'Le caoutchouc', 'Le corps humain'], 3, 'Le corps humain est conducteur, surtout humide : d’où le danger de l’électricité. Bois sec, verre et caoutchouc sont isolants.'],
        ['Que se passe-t-il quand on ouvre l’interrupteur d’un circuit ?', ['La boucle est coupée, plus aucun courant ne circule', 'Le courant circule mais moins fort', 'Le générateur est en court-circuit', 'Les électrons circulent en sens inverse'], 0, 'Le courant n’existe que dans un circuit fermé. L’interrupteur ouvert interrompt la boucle : il ne circule plus rien, nulle part dans le circuit.'],
        ['Quel est le symbole normalisé d’une lampe ?', ['Un rectangle', 'Deux traits inégaux', 'Un cercle barré d’une croix', 'Un cercle avec une flèche'], 2, 'La lampe est un cercle barré d’une croix ; la résistance est un rectangle et la pile deux traits inégaux.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les montages électriques",
      questions: [
        ['Deux lampes sont montées en dérivation aux bornes d’un générateur de 6 V. Quelle est la tension aux bornes de chaque lampe ?', ['3 V', '6 V', '12 V', '0 V'], 1, 'En dérivation, la tension est la même dans chaque branche que celle du générateur : 6 V pour chacune.'],
        ['Deux lampes en série ont pour tensions 2 V et 4 V. Quelle est la tension du générateur ?', ['2 V', '4 V', '8 V', '6 V'], 3, 'En série, les tensions s’additionnent : U = 2 + 4 = 6 V.'],
        ['Une intensité se sépare en deux branches qui portent 0,3 A et 0,5 A. Quelle est l’intensité dans la branche principale ?', ['0,2 A', '0,15 A', '0,8 A', '0,5 A'], 2, 'Loi des nœuds : l’intensité principale est la somme de celles des branches, soit 0,3 + 0,5 = 0,8 A.'],
        ['Que se passe-t-il quand on ajoute une lampe identique dans un circuit en série ?', ['Les lampes brillent moins', 'Les lampes brillent plus', 'La tension du générateur augmente', 'Rien ne change'], 0, 'En série, la tension du générateur se partage entre plus de lampes : chacune reçoit moins et brille moins.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La tension électrique",
      questions: [
        ['Parmi ces tensions, laquelle est celle du secteur domestique ?', ['230 V', '1,5 V', 'Environ 25 V', 'Environ 1 000 V'], 0, 'Le secteur domestique fournit 230 V, une tension mortelle. Le seuil de sécurité est d’environ 25 V, une pile bâton donne 1,5 V.'],
        ['Quelle est la tension aux bornes d’un interrupteur ouvert ?', ['0 V', 'Toute la tension du générateur', 'La moitié de celle du générateur', 'Une tension négative'], 1, 'Ouvert, l’interrupteur porte toute la tension du générateur (sans courant). Fermé, sa tension est presque nulle.'],
        ['Un générateur de 9 V alimente en série deux lampes. La première a 3,5 V à ses bornes. Quelle tension a la seconde ?', ['5,5 V', '12,5 V', '3,5 V', '4 V'], 0, 'En série, U générateur = U₁ + U₂, donc U₂ = 9 − 3,5 = 5,5 V.'],
        ['Combien de fois par seconde la tension du secteur change-t-elle de signe ?', ['50', '25', '230', '100'], 3, 'La fréquence est de 50 Hz : 50 périodes par seconde, et chaque période comporte deux changements de signe, soit 100 par seconde.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "L’intensité électrique",
      questions: [
        ['Un appareil est traversé par un courant de 250 mA. Combien cela fait-il en ampères ?', ['2,5 A', '25 A', '0,25 A', '0,025 A'], 2, '1 mA = 0,001 A, donc 250 mA = 250 × 0,001 = 0,25 A.'],
        ['Dans l’analogie avec l’eau dans un tuyau, à quoi correspond la tension ?', ['Au débit', 'À la pression', 'À la longueur du tuyau', 'Au volume d’eau'], 1, 'La tension est comparable à la pression de l’eau ; l’intensité est comparable au débit.'],
        ['Un courant de 1,2 A se sépare en deux branches. L’une porte 0,7 A. Que porte l’autre ?', ['0,5 A', '1,9 A', '0,7 A', '0,6 A'], 0, 'Loi des nœuds : 1,2 = 0,7 + I, donc I = 1,2 − 0,7 = 0,5 A.'],
        ['Quel dispositif de sécurité se réarme après avoir coupé le circuit ?', ['Le fusible', 'Le voltmètre', 'L’ampèremètre', 'Le disjoncteur'], 3, 'Le disjoncteur coupe le circuit et se réarme. Le fusible fond et doit être remplacé.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La résistance électrique",
      questions: [
        ['Un conducteur ohmique de 100 Ω est traversé par un courant de 0,05 A. Quelle est la tension à ses bornes ?', ['2 000 V', '5 V', '0,5 V', '50 V'], 1, 'U = R × I = 100 × 0,05 = 5 V.'],
        ['Une résistance a 6 V à ses bornes et est traversée par 0,02 A. Quelle est sa valeur ?', ['0,12 Ω', '120 Ω', '3 Ω', '300 Ω'], 3, 'R = U ÷ I = 6 ÷ 0,02 = 300 Ω.'],
        ['Une tension de 12 V est appliquée à une résistance de 240 Ω. Quelle intensité la traverse ?', ['0,05 A', '20 A', '2 880 A', '5 A'], 0, 'I = U ÷ R = 12 ÷ 240 = 0,05 A, soit 50 mA.'],
        ['Dans quelle situation mesure-t-on une résistance à l’ohmmètre ?', ['Alimentée par le générateur', 'Traversée par un courant de 1 A', 'Hors circuit, débranchée', 'Branchée en dérivation sur la pile'], 2, 'L’ohmmètre envoie lui-même un petit courant : le dipôle doit être hors circuit, sinon la mesure est faussée.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Puissance et énergie électrique",
      questions: [
        ['Un appareil sous 230 V est traversé par 0,5 A. Quelle est sa puissance ?', ['460 W', '115 W', '0,002 W', '230,5 W'], 1, 'P = U × I = 230 × 0,5 = 115 W.'],
        ['Une ampoule de 10 W reste allumée 5 h. Quelle énergie consomme-t-elle ?', ['2 Wh', '15 Wh', '50 Wh', '0,5 Wh'], 2, 'E = P × t = 10 W × 5 h = 50 Wh, soit 0,05 kWh.'],
        ['Une énergie de 2 kWh coûte 0,20 € le kWh. Quel est le coût ?', ['0,40 €', '0,10 €', '2,00 €', '4,00 €'], 0, 'Coût = 2 × 0,20 = 0,40 €.'],
        ['Une ampoule de 60 W allumée 1 h consomme autant qu’une ampoule de 6 W allumée pendant :', ['1 h', '6 h', '100 h', '10 h'], 3, '60 Wh = 6 W × 10 h : à énergie égale, une puissance dix fois plus faible demande une durée dix fois plus longue.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Mélanges et corps purs",
      questions: [
        ['Comment classe-t-on l’air ?', ['Un mélange homogène', 'Un mélange hétérogène', 'Un corps pur', 'Un solide'], 0, 'On ne distingue pas ses constituants : c’est un mélange homogène (comme l’eau salée ou le vinaigre).'],
        ['Quel est le principe de la décantation ?', ['Le solide est retenu par un papier filtre', 'La vapeur est refroidie puis recueillie', 'Le constituant le plus dense tombe au fond', 'Tous les constituants s’évaporent'], 2, 'On laisse reposer le mélange hétérogène : le constituant le plus dense se dépose au fond. Le filtre retient les solides en filtration.'],
        ['Que laisse l’évaporation complète d’une eau minérale ?', ['Rien du tout', 'Un résidu de sels minéraux', 'Du sulfate de cuivre bleu', 'De l’eau distillée'], 1, 'Une eau pure ne laisse aucun résidu, une eau minérale en laisse : ce résidu prouve qu’elle contient des substances dissoutes, donc que ce n’est pas un corps pur.'],
        ['Comment un mélange change-t-il d’état ?', ['À une température fixe', 'À 100 °C toujours', 'En restant à 0 °C', 'Sur un intervalle de températures'], 3, 'Un corps pur change d’état à température constante (palier). Un mélange change d’état sur un intervalle de températures.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les états de la matière",
      questions: [
        ['Pourquoi une bouteille pleine d’eau peut-elle éclater au congélateur ?', ['La masse de l’eau augmente en gelant', 'Le froid détruit les molécules d’eau', 'Le volume de l’eau augmente en gelant', 'L’eau se transforme en gaz'], 2, 'L’eau fait exception : son volume augmente en gelant, alors que sa masse est conservée. La bouteille pleine ne peut pas s’y adapter.'],
        ['Que vaut le zéro absolu ?', ['−100 °C', '0 °C', '−32 °C', '−273 °C'], 3, 'Le zéro absolu vaut −273 °C : l’agitation des molécules cesserait, c’est le zéro de l’échelle des kelvins.'],
        ['Quelle est l’allure de la surface libre d’un liquide au repos ?', ['Plane et horizontale', 'Bombée vers le haut', 'Inclinée', 'Creuse'], 0, 'Un liquide n’a pas de forme propre : au repos, sa surface est plane et horizontale.'],
        ['Comment se déplacent les molécules d’un liquide ?', ['Elles vibrent sur place sans bouger', 'Elles glissent les unes sur les autres', 'Elles s’éloignent à grande vitesse', 'Elles restent alignées en cristal'], 1, 'Dans un liquide, les molécules sont serrées, désordonnées, et glissent les unes sur les autres.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les changements d’état de l’eau",
      questions: [
        ['Le givre sur une vitre en hiver est le résultat de quel changement d’état ?', ['Une liquéfaction', 'Une fusion', 'Une condensation solide', 'Une vaporisation'], 2, 'Le givre se forme quand la vapeur d’eau passe directement à l’état solide : c’est une condensation solide. La rosée est une liquéfaction.'],
        ['Quelle différence y a-t-il entre l’évaporation et l’ébullition ?', ['L’ébullition a lieu seulement en surface', 'L’évaporation a lieu dans toute la masse', 'Les deux ont lieu uniquement à 100 °C', 'L’ébullition a lieu dans toute la masse, à température fixe'], 3, 'L’évaporation se fait en surface à toute température ; l’ébullition se fait dans toute la masse du liquide, à température fixe.'],
        ['On continue de chauffer de l’eau qui bout à 100 °C. Que devient sa température ?', ['Elle reste à 100 °C', 'Elle continue d’augmenter', 'Elle redescend à 0 °C', 'Elle dépasse 120 °C'], 0, 'Pendant l’ébullition d’un corps pur, la température reste constante (palier) : l’eau se vaporise seulement plus vite.'],
        ['La buée qui se forme sur une vitre froide est le résultat de :', ['Une fusion', 'Une vaporisation', 'Une sublimation', 'Une liquéfaction'], 3, 'La vapeur d’eau de l’air se liquéfie au contact de la vitre froide : ce sont de fines gouttelettes.'],
      ],
    },
  ],
}
