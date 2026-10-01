export default {
  slug: 'physique-chimie',
  titreMigration: 'QUESTIONS EN PLUS — PHYSIQUE-CHIMIE Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Acides et bases selon Brönsted',
      questions: [
        ['Selon Brönsted, une base est une espèce qui…', ['Cède un proton H⁺', 'Libère un électron', 'Capte un proton H⁺', 'Cède un ion HO⁻'], 2, 'Une base capte un proton ; l’acide, lui, le cède. Aucune espèce n’est acide ou basique dans l’absolu : elle l’est face à une autre.'],
        ['Dans le couple H₂O / HO⁻, quel rôle joue l’eau ?', ['La base', 'L’acide', 'Aucun, elle est spectatrice', 'Le catalyseur'], 1, 'H₂O perd un proton pour donner HO⁻ : elle est l’acide de ce couple. Dans H₃O⁺ / H₂O, elle en est la base.'],
        ['Quelle est la base conjuguée de l’ion ammonium NH₄⁺ ?', ['NH₂⁻', 'NH₄OH', 'N₂', 'NH₃'], 3, 'En perdant un proton, NH₄⁺ devient l’ammoniac NH₃ : le couple NH₄⁺ / NH₃.'],
        ['Pourquoi l’eau pure conduit-elle faiblement le courant ?', ['Parce que l’autoprotolyse y produit un peu d’ions H₃O⁺ et HO⁻', 'Parce qu’elle contient toujours du sel', 'Parce que les molécules d’eau sont chargées', 'Parce que les électrons y circulent librement'], 0, 'L’autoprotolyse, très limitée, crée quelques ions H₃O⁺ et HO⁻, toujours présents ensemble : juste assez pour une faible conduction.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le pH des solutions',
      questions: [
        ['Quelle est la définition du pH ?', ['pH = log([H₃O⁺]/c°)', 'pH = −log([H₃O⁺]/c°)', 'pH = −ln([H₃O⁺]/c°)', 'pH = [H₃O⁺] × 14'], 1, 'pH = −log([H₃O⁺]/c°), avec c° = 1 mol·L⁻¹ qui rend l’argument du logarithme sans dimension.'],
        ['Que vaut [H₃O⁺] dans une solution neutre à 25 °C ?', ['1,0 × 10⁻¹⁴ mol·L⁻¹', '7,0 mol·L⁻¹', '1,0 × 10⁻⁷ mol·L⁻¹', '0 mol·L⁻¹'], 2, 'À la neutralité, [H₃O⁺] = [HO⁻] et leur produit vaut 10⁻¹⁴ : chacune vaut donc 10⁻⁷ mol·L⁻¹, soit pH 7,0.'],
        ['On dilue dix fois une solution de base forte de pH 12. Le nouveau pH vaut environ…', ['13', '12', '10', '11'], 3, 'Diluer dix fois une base forte fait baisser le pH d’une unité : il se rapproche de 7 sans jamais le franchir.'],
        ['Une solution acide, diluée autant qu’on veut, peut devenir basique.', ['Vrai', 'Faux'], 1, 'La dilution rapproche le pH de 7 sans jamais le franchir : une solution acide diluée reste acide.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Propriétés électriques des solutions',
      questions: [
        ['Comment la conductance G est-elle reliée à la conductivité σ ?', ['G = σ × S / L', 'G = σ × L / S', 'G = σ / (S × L)', 'G = σ × S × L'], 0, 'G = σ × S/L, où S est la surface des électrodes et L leur distance : c’est pourquoi G dépend de la cellule et σ non.'],
        ['Combien valent 0,010 mol·L⁻¹ en mol·m⁻³ ?', ['0,010 mol·m⁻³', '10 mol·m⁻³', '1,0 × 10⁻⁵ mol·m⁻³', '100 mol·m⁻³'], 1, '1 mol·L⁻¹ = 10³ mol·m⁻³ : 0,010 mol·L⁻¹ font donc 10 mol·m⁻³. C’est cette conversion qu’exige la loi de Kohlrausch.'],
        ['Pourquoi H₃O⁺ et HO⁻ conduisent-ils environ cinq fois mieux que les autres ions ?', ['Ils sont plus petits que tous les autres ions', 'Ils portent une charge double', 'Ils se déplacent par relais de proton d’une molécule d’eau à l’autre', 'Ils sont attirés plus fort par les électrodes'], 2, 'Le proton passe de molécule d’eau en molécule d’eau : l’ion n’a pas à parcourir lui-même toute la distance.'],
        ['Avant de mesurer une conductivité avec un conductimètre, il faut…', ['Le rincer à l’acide chlorhydrique', 'Chauffer la solution', 'Ajouter un indicateur coloré', 'L’étalonner avec une solution de conductivité connue'], 3, 'Le conductimètre s’étalonne sur une solution de conductivité connue : c’est ce qui permet de passer de G à σ.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Propriétés spectrales des substances chimiques et solutions',
      questions: [
        ['Quelle est l’unité de l’absorbance A ?', ['Elle est sans unité', 'L·mol⁻¹·cm⁻¹', 'mol·L⁻¹', 'cm'], 0, 'A = ε × ℓ × c est un nombre sans unité : les unités de ε, ℓ et c se compensent.'],
        ['À quoi sert le « blanc » avant un dosage par étalonnage ?', ['À mesurer λ_max', 'À fixer le zéro d’absorbance avec le solvant seul', 'À nettoyer la cuve', 'À tracer la droite d’étalonnage'], 1, 'Le solvant seul fixe le zéro : on ne mesure ensuite que ce qu’absorbe l’espèce dissoute.'],
        ['Une bande fine et intense vers 1700 cm⁻¹ sur un spectre IR signale une liaison…', ['O—H d’alcool', 'N—H', 'C=O', 'C—H'], 2, 'La liaison C=O donne une bande fine et intense vers 1700 cm⁻¹ ; le O—H d’alcool donne une bande large vers 3300 cm⁻¹.'],
        ['Quelle spectroscopie sert à quantifier une concentration ?', ['L’infrarouge', 'La RMN du proton', 'Aucune des trois', 'L’UV-visible'], 3, 'L’UV-visible quantifie grâce à la loi de Beer-Lambert ; l’IR reconnaît les groupes et la RMN reconstruit le squelette.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Suivi temporel d’une réaction chimique : modèle macroscopique',
      questions: [
        ['Au bout de combien de temps de demi-réaction une transformation est-elle pratiquement terminée ?', ['2 fois t₁/₂', '5 à 7 fois t₁/₂', 'Exactement 1 fois t₁/₂', '100 fois t₁/₂'], 1, 'Le temps de demi-réaction donne l’ordre de grandeur de la durée totale : 5 à 7 fois t₁/₂ suffisent en pratique.'],
        ['Pour une réaction d’ordre 1 de constante k, que vaut t₁/₂ ?', ['ln2 / k', 'k / ln2', '1 / (2k)', '2k'], 0, 'Avec [A](t) = [A]₀ × e^(−kt), on trouve t₁/₂ = ln2 / k, indépendant de la concentration initiale.'],
        ['Quelle méthode de suivi choisir si un gaz se forme au cours de la réaction ?', ['La spectrophotométrie', 'La pH-métrie', 'La mesure de pression', 'La conductimétrie'], 2, 'Un gaz formé fait monter la pression dans une enceinte fermée : on suit la réaction au capteur de pression.'],
        ['Pourquoi une poudre réagit-elle plus vite qu’un bloc du même solide ?', ['Elle est plus concentrée', 'Elle est plus chaude', 'Elle joue le rôle de catalyseur', 'Elle offre une plus grande surface de contact'], 3, 'L’état de division est un facteur cinétique : plus le solide est fin, plus la surface de contact avec les réactifs est grande.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Étapes d’une transformation chimique : modèle microscopique',
      questions: [
        ['Pourquoi un acte élémentaire met-il en jeu au plus deux entités ?', ['Parce que les chocs à trois entités sont trop improbables', 'Parce que trois molécules se repoussent', 'Par convention d’écriture', 'Parce que les catalyseurs l’imposent'], 0, 'Une rencontre simultanée de trois entités au même endroit, au même instant, est trop improbable pour compter.'],
        ['Qu’est-ce qu’un catalyseur ne modifie pas ?', ['La durée de la transformation', 'Le chemin réactionnel', 'L’état final et la constante d’équilibre', 'L’énergie demandée par les étapes'], 2, 'Le catalyseur ouvre un chemin plus rapide, mais l’état final et K restent les mêmes.'],
        ['Quel facteur augmente la PART des chocs assez énergétiques pour être efficaces ?', ['La concentration', 'La température', 'Le volume du récipient', 'La couleur de la solution'], 1, 'La concentration augmente le nombre de chocs ; la température augmente la part de ceux qui sont assez énergétiques.'],
        ['Peut-on déduire le mécanisme d’une réaction de son équation de bilan ?', ['Oui, il suffit de lire les coefficients', 'Oui, si la réaction est totale', 'Oui, quand il n’y a pas de catalyseur', 'Non, il s’établit expérimentalement'], 3, 'Deux réactions au bilan identique peuvent suivre des chemins très différents : le mécanisme ne se devine pas.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La radioactivité naturelle',
      questions: [
        ['Deux isotopes d’un même élément ont…', ['Le même A et des Z différents', 'Le même Z et des A différents', 'Le même nombre de neutrons', 'Des propriétés chimiques différentes'], 1, 'Même Z, donc même élément et même chimie ; A différent, donc un nombre de neutrons différent : carbone 12 et carbone 14.'],
        ['Quelle particule est émise lors d’une désintégration β⁺ ?', ['Un positon', 'Un électron', 'Un noyau d’hélium', 'Un neutron'], 0, 'En β⁺, un proton devient neutron et un positon ⁰₊₁e est émis ; cela concerne les noyaux trop riches en protons.'],
        ['Le carbone 14 (Z = 6) subit une désintégration β⁻. Quel noyau obtient-on ?', ['Le bore 14 (Z = 5)', 'Le carbone 13 (Z = 6)', 'L’oxygène 14 (Z = 8)', 'L’azote 14 (Z = 7)'], 3, 'En β⁻, A se conserve et Z augmente de 1 : ¹⁴₆C donne ¹⁴₇N, l’azote 14.'],
        ['Quels noyaux subissent surtout une désintégration α ?', ['Les noyaux trop riches en protons', 'Les noyaux légers', 'Les noyaux lourds', 'Les noyaux excités seulement'], 2, 'L’émission α, qui retire quatre nucléons d’un coup, concerne les noyaux lourds comme l’uranium ou le radium.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Évolution d’une population de noyaux radioactifs',
      questions: [
        ['Quelle est la demi-vie du carbone 14 ?', ['8 jours', '5 730 ans', '50 000 ans', '4,5 milliards d’années'], 1, 'Le carbone 14 a une demi-vie de 5 730 ans ; 8 jours est celle de l’iode 131, 4,5 milliards d’années celle de l’uranium 238.'],
        ['Quelle équation différentielle vérifie N(t) ?', ['dN/dt = λN', 'dN/dt = −λ', 'dN/dt = −λN', 'dN/dt = N/λ'], 2, 'dN/dt = −λN : le nombre de désintégrations par unité de temps est proportionnel au nombre de noyaux restants.'],
        ['Après 10 demi-vies, quelle part des noyaux initiaux reste-t-il ?', ['La moitié', 'Un dixième', 'Aucune', 'Moins d’un millième'], 3, '(1/2)¹⁰ = 1/1024 : il reste moins d’un millième des noyaux. La décroissance est exponentielle, pas linéaire.'],
        ['Que mesure-t-on au compteur Geiger ?', ['L’activité de l’échantillon', 'Le nombre de noyaux N', 'La constante radioactive λ', 'La masse de l’échantillon'], 0, 'On mesure l’activité, en désintégrations par seconde ; N ne se mesure jamais directement, on le déduit de A = λN.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'L’équilibre chimique',
      questions: [
        ['Si Qr,i > K, dans quel sens le système évolue-t-il ?', ['Dans le sens direct', 'Dans le sens indirect', 'Il n’évolue pas', 'Il évolue jusqu’à Qr = 0'], 1, 'Qr doit diminuer pour rejoindre K : le système consomme des produits, il évolue dans le sens indirect.'],
        ['Comment se définit le taux d’avancement final τ ?', ['τ = x_max / x_f', 'τ = K / Qr', 'τ = x_f × x_max', 'τ = x_f / x_max'], 3, 'τ = x_f / x_max mesure jusqu’où la transformation est allée : τ = 1 pour une transformation totale.'],
        ['Dans une solution aqueuse diluée, l’eau solvant figure dans l’expression de Qr.', ['Vrai', 'Faux'], 1, 'Comme les solides, le solvant n’apparaît pas dans Qr : sa concentration ne varie pratiquement pas.'],
        ['À l’équilibre chimique, qu’est-ce qui cesse de varier ?', ['Les concentrations, à l’échelle macroscopique', 'Les réactions à l’échelle microscopique', 'La température du milieu obligatoirement', 'La valeur de K'], 0, 'L’équilibre est dynamique : les réactions directe et inverse continuent, à la même vitesse, et seules les concentrations se figent.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Les piles : générateurs électrochimiques',
      questions: [
        ['Dans une pile, qu’est-ce qui circule dans le pont salin ?', ['Des électrons', 'Des protons seulement', 'Des ions', 'Des molécules d’eau'], 2, 'Les électrons circulent dans le fil extérieur ; dans le pont salin, ce sont des ions qui ferment le circuit.'],
        ['Que se passe-t-il à la cathode d’une pile ?', ['Une réduction, au pôle positif', 'Une oxydation, au pôle positif', 'Une réduction, au pôle négatif', 'Une oxydation, au pôle négatif'], 0, 'Cathode = réduction (deux consonnes) ; dans une pile, c’est le pôle positif.'],
        ['Dans le circuit extérieur d’une pile, le courant conventionnel circule…', ['De l’anode vers la cathode', 'De la cathode vers l’anode', 'Dans le pont salin uniquement', 'Dans les deux sens alternativement'], 1, 'Les électrons vont de l’anode vers la cathode ; le courant conventionnel, en sens inverse, sort par le pôle positif.'],
        ['Quel réactif limite le plus souvent la durée de vie d’une pile ?', ['Le sel du pont salin', 'L’eau des solutions', 'Le fil de connexion', 'Le métal de l’anode, qui se dissout'], 3, 'L’anode est oxydée et se dissout peu à peu : c’est presque toujours elle le réactif limitant.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Électrolyse et générateurs électrochimiques',
      questions: [
        ['Lors d’une électrolyse, la cathode est reliée à…', ['La borne + du générateur', 'La borne − du générateur', 'La terre', 'Aucune borne'], 1, 'La cathode, siège de la réduction, reçoit les électrons : elle est reliée à la borne − du générateur.'],
        ['En galvanoplastie, où place-t-on la pièce à recouvrir de métal ?', ['À la cathode', 'À l’anode', 'Dans le pont salin', 'Hors de la solution'], 0, 'Les ions métalliques sont réduits à la cathode et s’y déposent : c’est donc là qu’on place la pièce.'],
        ['Quelle conversion d’énergie réalise une électrolyse ?', ['Chimique vers électrique', 'Thermique vers électrique', 'Électrique vers chimique', 'Lumineuse vers chimique'], 2, 'Le générateur fournit de l’énergie électrique qui force une réaction non spontanée : elle est stockée sous forme chimique.'],
        ['Que doit fournir le générateur d’une électrolyse ?', ['Une tension nulle', 'Un courant alternatif', 'Une tension égale à celle de la pile correspondante', 'Une tension supérieure à celle que délivrerait la pile correspondante'], 3, 'Pour forcer le système contre son sens spontané, il faut dépasser la tension que la pile correspondante délivrerait.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Force des acides et des bases',
      questions: [
        ['Parmi ces acides, lequel est un acide fort ?', ['L’acide éthanoïque', 'L’acide fluorhydrique HF', 'L’acide nitrique HNO₃', 'L’ion ammonium'], 2, 'HCl, HNO₃ et H₂SO₄ réagissent totalement avec l’eau ; CH₃COOH, HF et NH₄⁺ sont des acides faibles.'],
        ['Quelle relation relie pH et pKa d’un couple ?', ['pH = pKa + log([A⁻]/[AH])', 'pH = pKa + log([AH]/[A⁻])', 'pH = pKa × [A⁻]/[AH]', 'pH = pKa − Ke'], 0, 'C’est la relation de Henderson, obtenue en prenant le logarithme de l’expression de Ka.'],
        ['Combien de domaines de prédominance compte un diacide ?', ['Deux', 'Trois', 'Quatre', 'Un seul'], 1, 'Ses deux pKa coupent l’axe de pH en trois domaines : le diacide, l’espèce intermédiaire et la dibase.'],
        ['L’ammoniac NH₃ est une base…', ['Forte, comme HO⁻', 'Qui n’existe pas en solution', 'Amphotère seulement', 'Faible, de pKa 9,2 pour son couple'], 3, 'NH₃ réagit de façon limitée avec l’eau : c’est une base faible, et le couple NH₄⁺/NH₃ a un pKa de 9,2.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Équilibre chimique et calcul du pH d’une solution',
      questions: [
        ['Quel est le pH d’une solution de base forte de concentration 1,0 × 10⁻² mol·L⁻¹ à 25 °C ?', ['2,0', '12,0', '7,0', '10,0'], 1, 'pH = 14,0 + log(c/c°) = 14,0 − 2,0 = 12,0 : on passe par [HO⁻] puis par Ke.'],
        ['Comment évolue le taux d’avancement d’un acide faible quand on le dilue ?', ['Il augmente', 'Il diminue', 'Il reste constant', 'Il devient nul'], 0, 'Diluer augmente τ : un acide faible très dilué se comporte presque comme un acide fort.'],
        ['Comment repère-t-on l’équivalence sur une courbe de titrage pH-métrique ?', ['Au point où pH = 7 toujours', 'Au point où pH = pKa', 'Par la méthode des tangentes ou le maximum de la dérivée', 'Au début de la courbe'], 2, 'L’équivalence est le point d’inflexion du saut de pH : méthode des tangentes ou maximum de dpH/dV.'],
        ['Quel couple tamponne le sang autour de pH 7,4 ?', ['NH₄⁺ / NH₃', 'H₃O⁺ / H₂O', 'CH₃COOH / CH₃COO⁻', 'CO₂,H₂O / HCO₃⁻'], 3, 'Le sang est tamponné par le couple CO₂,H₂O / HCO₃⁻, qui limite les variations de pH autour de 7,4.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Structure des molécules organiques',
      questions: [
        ['Où se trouve toujours le groupe d’un aldéhyde, —CHO ?', ['En milieu de chaîne', 'En bout de chaîne', 'Sur un cycle obligatoirement', 'Sur un carbone tertiaire'], 1, 'Le groupe —CHO est toujours en bout de chaîne ; le groupe cétone —CO— est toujours en milieu de chaîne.'],
        ['Quel groupe caractéristique définit un ester ?', ['—COO—', '—CONH—', '—COOH', '—CHO'], 0, 'L’ester porte —COO— ; —CONH— est l’amide, —COOH l’acide carboxylique, —CHO l’aldéhyde.'],
        ['Quelle formule ne permet pas de distinguer deux isomères ?', ['La formule topologique', 'La formule semi-développée', 'La formule brute', 'La formule développée'], 2, 'La formule brute ne donne que le nombre d’atomes : C₂H₆O est aussi bien l’éthanol que le méthoxyméthane.'],
        ['Pourquoi deux énantiomères peuvent-ils avoir des effets biologiques très différents ?', ['Parce que leurs masses molaires diffèrent', 'Parce que l’un est toujours toxique', 'Parce qu’ils n’ont pas la même formule brute', 'Parce que les récepteurs biologiques sont eux-mêmes chiraux'], 3, 'Un récepteur chiral ne reconnaît qu’une des deux formes, alors que leurs propriétés physiques sont identiques.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Stratégie et sélectivité en chimie organique',
      questions: [
        ['Comment reconnaît-on une réaction d’élimination ?', ['Une insaturation disparaît', 'Une liaison multiple se crée', 'Un groupe en remplace un autre', 'La chaîne s’allonge'], 1, 'Dans une élimination, une liaison multiple apparaît ; dans une addition, elle disparaît.'],
        ['Qu’appelle-t-on régiosélectivité ?', ['Une seule position réagit parmi plusieurs possibles', 'Un seul type de groupe réagit', 'Un seul stéréo-isomère se forme', 'La réaction se fait sans solvant'], 0, 'La régiosélectivité porte sur la position ; la chimiosélectivité sur le type de groupe ; la stéréosélectivité sur le stéréo-isomère.'],
        ['Combien d’étapes une protection de fonction ajoute-t-elle à une synthèse ?', ['Aucune', 'Une', 'Deux', 'Trois'], 2, 'Protéger puis déprotéger : deux étapes de plus, donc un coût et une perte de rendement, mais souvent le seul chemin possible.'],
        ['Parmi ces choix, lequel relève de la chimie verte ?', ['Multiplier les solvants', 'Employer des réactifs en quantité stœchiométrique plutôt qu’un catalyseur', 'Prolonger le chauffage à reflux', 'Préférer la catalyse et les matières premières renouvelables'], 3, 'La chimie verte limite les solvants, préfère la catalyse aux réactifs stœchiométriques et les ressources renouvelables.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Modélisation d’un mouvement',
      questions: [
        ['Quel référentiel choisit-on pour étudier le mouvement d’un satellite de la Terre ?', ['Le référentiel héliocentrique', 'Le référentiel géocentrique', 'Le référentiel terrestre', 'Le référentiel du satellite'], 1, 'Le référentiel géocentrique, centré sur la Terre, sert pour les satellites ; l’héliocentrique pour les planètes.'],
        ['Que traduit la composante tangentielle de l’accélération aₜ = dv/dt ?', ['La variation de la valeur de la vitesse', 'La variation de la direction de la vitesse', 'La courbure de la trajectoire', 'La distance parcourue'], 0, 'aₜ traduit la variation de la valeur de la vitesse ; aₙ = v²/R, celle de sa direction.'],
        ['Vers où le vecteur accélération est-il toujours orienté sur une trajectoire courbe ?', ['Vers l’extérieur de la courbure', 'Tangent à la trajectoire', 'Vers l’intérieur de la courbure', 'Vers le haut'], 2, 'Pour qu’une trajectoire tourne, l’accélération doit pointer vers l’intérieur de la courbure.'],
        ['Sur un pointage vidéo, que se passe-t-il si l’on réduit trop l’intervalle τ entre deux images ?', ['La dérivée devient exacte', 'La vitesse calculée double', 'Les positions deviennent inutiles', 'L’incertitude de pointage pèse davantage'], 3, 'Un petit τ approche mieux la dérivée, mais l’erreur de pointage devient relativement plus grande : c’est un compromis.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Appliquer la deuxième loi de Newton',
      questions: [
        ['Comment s’écrit la quantité de mouvement p d’un système ?', ['p = m a', 'p = ½ m v²', 'p = m v', 'p = m g'], 2, 'p = m v ; la deuxième loi de Newton s’écrit ΣF = dp/dt, soit ΣF = m a si la masse est constante.'],
        ['D’après la deuxième loi de Newton, une force donne…', ['La vitesse du système', 'La variation de la vitesse', 'La position du système', 'La masse du système'], 1, 'Une force ne donne pas la vitesse, mais sa variation : on peut avancer vite sans aucune force, par inertie.'],
        ['Où viennent les constantes d’intégration quand on intègre deux fois ΣF = m a ?', ['Des conditions initiales', 'De la masse du système', 'Du référentiel choisi', 'De la troisième loi de Newton'], 0, 'Position et vitesse à t = 0 fixent les constantes : ce sont les conditions initiales.'],
        ['Dans la méthode d’Euler, comment améliorer la fidélité de la solution approchée ?', ['En augmentant Δt', 'En supprimant les frottements', 'En changeant de référentiel', 'En diminuant le pas Δt'], 3, 'Plus le pas Δt est petit, plus la solution pas à pas colle à la solution exacte.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Mouvement dans un champ uniforme',
      questions: [
        ['Comment est orienté le champ électrique entre deux plaques chargées ?', ['De la plaque + vers la plaque −', 'De la plaque − vers la plaque +', 'Parallèlement aux plaques', 'Il n’a pas de sens défini'], 0, 'E est dirigé du + vers le − ; une charge positive est poussée dans le sens de E, une charge négative en sens inverse.'],
        ['Dans un tir sans frottement, quel est le mouvement selon l’axe horizontal ?', ['Uniformément accéléré', 'Uniforme', 'Circulaire', 'Uniformément ralenti jusqu’à l’arrêt'], 1, 'a_x = 0 : la composante horizontale de la vitesse reste v₀ cos α, le mouvement horizontal est uniforme.'],
        ['Pourquoi néglige-t-on le poids d’un électron entre deux plaques chargées ?', ['Parce qu’un électron n’a pas de masse', 'Parce que g est nul entre les plaques', 'Parce qu’il est totalement négligeable devant la force électrique', 'Parce que le poids est compensé par la poussée d’Archimède'], 2, 'La masse de l’électron est si faible que son poids est négligeable devant qE : on ne le fait pas figurer au bilan.'],
        ['Quelle méthode donne le plus vite la vitesse d’un projectile en un point, sans frottement ?', ['Intégrer deux fois les équations', 'Tracer la parabole point par point', 'Calculer la portée d’abord', 'Utiliser la conservation de l’énergie mécanique'], 3, '½mv² + mgz = constante donne la vitesse en un point sans passer par les équations horaires.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Mouvement dans un champ de gravitation',
      questions: [
        ['La vitesse d’un satellite en orbite circulaire dépend de sa masse.', ['Vrai', 'Faux'], 1, 'v = √(G M / r) : seule la masse M de l’astre attracteur intervient, celle du satellite disparaît de l’équation.'],
        ['Selon la deuxième loi de Kepler, une planète va plus vite…', ['Au périhélie, au plus près du Soleil', 'À l’aphélie, au plus loin du Soleil', 'Toujours à la même vitesse', 'Seulement quand elle est alignée avec la Terre'], 0, 'Des aires égales en des durées égales : près du Soleil, le rayon est court, la planète doit donc parcourir plus d’arc, elle va plus vite.'],
        ['À quelle altitude se trouve un satellite géostationnaire ?', ['Environ 400 km', 'Environ 6 400 km', 'Environ 36 000 km', 'Environ 384 000 km'], 2, 'La troisième loi de Kepler impose un rayon de 42 200 km depuis le centre de la Terre, soit environ 36 000 km d’altitude.'],
        ['À quoi sert la troisième loi de Kepler T²/r³ = 4π²/(G M) ?', ['À calculer la masse du satellite', 'À mesurer la forme des orbites', 'À prouver que les orbites sont circulaires', 'À peser l’astre attracteur à partir d’une seule orbite'], 3, 'Connaissant T et r d’un seul satellite, on en déduit M : c’est ainsi qu’on pèse un astre.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Écoulement d’un fluide incompressible',
      questions: [
        ['Une canalisation passe d’une section S à une section S/2. La vitesse du fluide…', ['Est divisée par 2', 'Double', 'Reste la même', 'Est multipliée par 4'], 1, 'Le débit S × v se conserve : si la section est divisée par deux, la vitesse double.'],
        ['Dans la relation de Bernoulli, comment s’appelle le terme ½ρv² ?', ['La pression dynamique', 'La pression statique', 'Le terme de hauteur', 'La viscosité'], 0, 'P est la pression statique, ½ρv² la pression dynamique, ρgz le terme de hauteur : tous homogènes à une pression.'],
        ['Dans une conduite réelle, pourquoi faut-il une pompe pour entretenir la pression ?', ['Parce que le fluide est compressible', 'Parce que le débit augmente', 'Parce que les frottements dus à la viscosité font chuter la pression', 'Parce que Bernoulli l’interdit'], 2, 'Bernoulli suppose un fluide sans viscosité ; dans le réel, les frottements font baisser la pression le long du trajet.'],
        ['Quelle est l’unité du débit volumique ?', ['m·s⁻¹', 'kg·s⁻¹', 'Pa', 'm³·s⁻¹'], 3, 'Dv = V / Δt = S × v s’exprime en m³·s⁻¹ ; le débit massique, lui, serait en kg·s⁻¹.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Description d’un système thermodynamique',
      questions: [
        ['Un calorimètre idéal est un système…', ['Ouvert', 'Fermé', 'Isolé', 'Qui échange seulement de la matière'], 2, 'Un système isolé n’échange ni matière ni énergie : c’est ce qu’approche un calorimètre idéal.'],
        ['À combien de degrés Celsius correspond le zéro absolu ?', ['−273,15 °C', '0 °C', '−100 °C', '−373,15 °C'], 0, '0 K = −273,15 °C : c’est l’agitation minimale des entités.'],
        ['Pourquoi peut-on écrire un écart de température ΔT en °C ?', ['Parce que le kelvin est interdit', 'Parce qu’un écart de 1 °C vaut exactement un écart de 1 K', 'Parce que les deux échelles ont le même zéro', 'On ne le peut jamais'], 1, 'Les deux échelles ne diffèrent que par leur zéro : un écart de 1 °C est un écart de 1 K.'],
        ['Pourquoi l’eau est-elle un bon fluide caloporteur ?', ['Parce qu’elle bout à 100 °C', 'Parce qu’elle est incompressible', 'Parce qu’elle conduit le courant', 'Parce que sa capacité thermique massique est remarquablement élevée'], 3, 'Avec c = 4185 J·kg⁻¹·K⁻¹, l’eau stocke beaucoup d’énergie pour un faible échauffement : elle adoucit aussi les climats côtiers.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Variation de l’énergie interne d’un système',
      questions: [
        ['Pendant la fusion d’un corps pur, à quoi sert l’énergie reçue ?', ['À augmenter l’agitation des entités', 'À rompre les interactions entre entités', 'À augmenter la masse', 'À élever la température'], 1, 'L’énergie sert à rompre des interactions, pas à agiter davantage les entités : la température reste constante.'],
        ['Quelle est la nature d’un transfert thermique Q ?', ['Un transfert désordonné d’énergie', 'Un transfert ordonné par une force', 'Un transfert de matière', 'Un transfert électrique'], 0, 'Le transfert thermique est désordonné, de proche en proche ; le travail est un transfert ordonné, par une force.'],
        ['Dans un calorimètre, on mélange deux corps. Quelle relation écrit-on ?', ['Q₁ = Q₂', 'Q₁ = 2 × Q₂', 'Q₁ + Q₂ = 0', 'Q₁ × Q₂ = 1'], 2, 'Le calorimètre approche un système isolé : les transferts s’annulent, ce que l’un cède, l’autre le reçoit.'],
        ['Pourquoi la transpiration rafraîchit-elle le corps ?', ['La sueur est plus froide que la peau', 'La sueur isole la peau', 'La sueur réfléchit le rayonnement', 'L’eau qui s’évapore prélève son énergie de vaporisation sur la peau'], 3, 'La vaporisation coûte beaucoup d’énergie (2,26 × 10⁶ J·kg⁻¹), prélevée sur la peau qui se refroidit.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le premier principe de la thermodynamique',
      questions: [
        ['Pour une phase condensée subissant une transformation isotherme, que vaut ΔU ?', ['ΔU = W', 'ΔU = 0, donc W = −Q', 'ΔU = Q', 'ΔU = W + 2Q'], 1, 'Pour une phase condensée, la température fixe U : à T constante ΔU = 0, et le travail reçu est intégralement cédé en chaleur.'],
        ['Qu’a établi l’expérience de Joule ?', ['L’équivalence entre travail et chaleur', 'L’existence du zéro absolu', 'La conservation de la masse', 'La loi de refroidissement'], 0, 'Agiter de l’eau dans une enceinte calorifugée la réchauffe sans la chauffer : le travail produit le même effet qu’un transfert thermique.'],
        ['Quel principe interdit à la chaleur de passer spontanément du froid vers le chaud ?', ['Le premier principe', 'Le principe d’inertie', 'Le second principe', 'Le principe des actions réciproques'], 2, 'Le premier principe ne dit rien sur le sens des échanges ; c’est le second principe qui l’impose.'],
        ['Un moteur reçoit 1000 J et fournit 350 J d’énergie utile. Que vaut son rendement ?', ['2,86', '0,65', '350', '0,35'], 3, 'η = E_utile / E_fournie = 350 / 1000 = 0,35 ; les 650 J restants partent en pertes, surtout en chaleur.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Transferts thermiques',
      questions: [
        ['Par quel mode la chaleur d’un radiateur se répartit-elle dans une pièce, l’air chaud montant ?', ['La conduction', 'La convection', 'Le rayonnement seul', 'L’électrolyse'], 1, 'La convection transporte l’énergie par déplacement d’un fluide : l’air chaud, moins dense, monte.'],
        ['Qu’est-ce qui isole vraiment dans une laine de verre ou un pull ?', ['L’air immobile emprisonné', 'Les fibres elles-mêmes', 'La couleur du matériau', 'L’humidité contenue'], 0, 'L’air immobile a une conductivité de 0,026 W·m⁻¹·K⁻¹ : c’est lui qui isole, d’où l’inefficacité d’un isolant mouillé ou tassé.'],
        ['Dans l’analogie électrique, à quoi correspond l’écart de température ΔT ?', ['À l’intensité I', 'À la résistance R', 'À la tension U', 'À la charge q'], 2, 'ΔT joue le rôle de la tension U, le flux Φ celui de l’intensité, R_th celui de la résistance : Φ = ΔT / R_th.'],
        ['Que fait réellement un manteau ?', ['Il produit de la chaleur', 'Il absorbe le froid', 'Il augmente la température du corps', 'Il freine le flux thermique qui sort'], 3, 'Un manteau n’est pas une source : c’est une résistance thermique qui freine le flux sortant.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'L’intensité sonore',
      questions: [
        ['Quel niveau sonore correspond au seuil de douleur ?', ['60 dB', '120 dB', '85 dB', '0 dB'], 1, 'Le seuil de douleur est à 120 dB, soit une intensité de 1 W·m⁻² ; le seuil d’audibilité est à 0 dB.'],
        ['Que vaut l’intensité de référence I₀ ?', ['1,0 × 10⁻¹² W·m⁻²', '1,0 W·m⁻²', '1,0 × 10⁻⁶ W·m⁻²', '1,0 × 10¹² W·m⁻²'], 0, 'I₀ = 10⁻¹² W·m⁻² est le seuil d’audibilité : à cette intensité, L = 0 dB.'],
        ['Entre quelles fréquences l’oreille humaine est-elle la plus sensible ?', ['Entre 20 et 100 Hz', 'Au-delà de 15 kHz', 'Entre 1 et 4 kHz', 'Elle est également sensible partout'], 2, 'L’oreille est plus sensible entre 1 et 4 kHz, d’où la pondération dB(A) de l’acoustique réglementaire.'],
        ['Que devient l’énergie sonore perdue par absorption dans un milieu ?', ['Elle s’étale sur une sphère plus grande', 'Elle est détruite', 'Elle est réfléchie vers la source', 'Elle est convertie en énergie interne du milieu'], 3, 'L’absorption convertit réellement l’énergie ; l’atténuation géométrique, elle, ne fait que la répartir.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'L’effet Doppler',
      questions: [
        ['Quelle relation donne la fréquence reçue quand la source s’éloigne à la vitesse v ?', ['f_r = f_e × c / (c − v)', 'f_r = f_e × c / (c + v)', 'f_r = f_e × v / c', 'f_r = f_e × (c + v) / c²'], 1, 'Quand la source s’éloigne, le dénominateur c + v est plus grand que c : la fréquence reçue diminue.'],
        ['Quelle découverte le décalage vers le rouge des galaxies a-t-il permise ?', ['L’expansion de l’Univers', 'L’existence des photons', 'La vitesse du son', 'Les lois de Kepler'], 0, 'Les galaxies lointaines s’éloignent de nous, et d’autant plus vite qu’elles sont loin : l’Univers est en expansion.'],
        ['Comment l’effet Doppler permet-il de détecter une exoplanète ?', ['La planète émet un son', 'La planète cache l’étoile', 'Le spectre de l’étoile oscille au rythme de la planète', 'La planète réfléchit un radar'], 2, 'La planète fait osciller son étoile : ses raies se décalent tantôt vers le bleu, tantôt vers le rouge.'],
        ['Que se passe-t-il quand la vitesse de la source atteint la célérité du son ?', ['Le son disparaît', 'La fréquence émise double', 'La célérité du son augmente', 'Les fronts d’onde s’accumulent en une onde de choc : le mur du son'], 3, 'Les fronts d’onde s’accumulent en une seule surface ; la formule f_e × c / (c − v) diverge et annonce le phénomène.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Diffraction d’une onde',
      questions: [
        ['En quelle unité s’exprime θ dans la relation θ = λ / a ?', ['En degrés', 'En radians', 'En mètres', 'En hertz'], 1, 'θ = λ / a est un rapport de deux longueurs qui donne un angle en radians.'],
        ['Pourquoi la lumière semble-t-elle aller tout droit au quotidien ?', ['Sa longueur d’onde, quelques centaines de nm, est minuscule devant les ouvertures courantes', 'Elle ne se diffracte jamais', 'Elle va plus vite que le son', 'Elle est absorbée par l’air'], 0, 'Les ouvertures courantes sont immenses devant λ ≈ 500 nm : l’étalement est trop faible pour être remarqué.'],
        ['Qu’est-ce qui pousse surtout à construire de grands télescopes ?', ['Un grossissement plus fort', 'Un tube plus long', 'Une résolution moins limitée par la diffraction', 'Un poids plus stable'], 2, 'Plus l’ouverture est grande, moins la diffraction étale l’image : deux étoiles proches sont mieux séparées.'],
        ['Comment peut-on mesurer le diamètre d’un cheveu au laboratoire ?', ['À la règle graduée', 'Par effet Doppler', 'Par conductimétrie', 'En mesurant la tache centrale de diffraction qu’il produit'], 3, 'Le cheveu diffracte comme une fente de même largeur : de L = 2λD/a on tire a, connaissant λ et D.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Interférences de deux ondes',
      questions: [
        ['Quelle est la condition d’interférences constructives ?', ['δ = (k + ½) λ', 'δ = k λ', 'δ = λ / 4', 'δ = 2k + 1'], 1, 'Une différence de marche multiple entière de λ met les ondes en phase : frange brillante.'],
        ['Deux lampes distinctes de même couleur donnent-elles des interférences visibles ?', ['Non, elles ne sont pas cohérentes', 'Oui, si elles ont la même intensité', 'Oui, toujours', 'Oui, si elles sont proches'], 0, 'Leur déphasage varie sans cesse : on n’obtient d’interférences stables qu’en dédoublant une même source.'],
        ['Comment évolue l’interfrange si l’on écarte davantage les deux fentes d’Young ?', ['Il augmente', 'Il ne change pas', 'Il diminue', 'Il s’annule'], 2, 'i = λD / b : l’interfrange est inversement proportionnel à l’écart b entre les fentes.'],
        ['Comment distinguer une couleur interférentielle d’une couleur de pigment ?', ['Elle est toujours bleue', 'Elle disparaît dans le noir', 'Elle ne se voit qu’au microscope', 'Elle change avec l’angle de vue'], 3, 'Les couleurs d’une bulle ou d’une plume de paon changent avec l’angle : aucun pigment ne fait cela.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Système optique et formation d’images : la lunette astronomique',
      questions: [
        ['Quelle est la vergence d’une lentille de focale f′ = 0,50 m ?', ['0,50 δ', '2,0 δ', '5,0 δ', '50 δ'], 1, 'V = 1/f′ = 1/0,50 = 2,0 dioptries : la vergence s’exprime en m⁻¹.'],
        ['Un rayon incident passant par le foyer objet F d’une lentille convergente…', ['Ressort parallèle à l’axe', 'N’est pas dévié', 'Passe par le foyer image', 'Est réfléchi'], 0, 'C’est l’une des trois constructions de base : passant par F, le rayon émerge parallèle à l’axe optique.'],
        ['Pourquoi l’image finale d’une lunette afocale est-elle rejetée à l’infini ?', ['Pour agrandir le tube', 'Pour redresser l’image', 'Pour que l’œil observe sans accommoder', 'Pour augmenter la lumière collectée'], 2, 'Une image à l’infini s’observe œil au repos : c’est la condition d’un confort d’observation sur plusieurs heures.'],
        ['Une lunette a un objectif de focale 900 mm et un oculaire de 10 mm. Son grossissement vaut…', ['9', '0,011', '910', '90'], 3, 'G = f′₁ / f′₂ = 900 / 10 = 90. On change de grossissement en changeant d’oculaire.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Modèle corpusculaire de la lumière : le photon',
      questions: [
        ['À combien de joules correspond un électronvolt ?', ['6,63 × 10⁻³⁴ J', '1,60 × 10⁻¹⁹ J', '3,00 × 10⁸ J', '9,11 × 10⁻³¹ J'], 1, '1 eV = 1,60 × 10⁻¹⁹ J : c’est l’unité commode pour l’énergie d’un photon.'],
        ['Lequel de ces photons transporte le plus d’énergie ?', ['Un photon bleu à 450 nm', 'Un photon rouge à 700 nm', 'Un photon infrarouge à 1000 nm', 'Ils ont tous la même énergie'], 0, 'E = hc/λ : plus la longueur d’onde est courte, plus le photon est énergétique (environ 2,8 eV pour le bleu contre 1,8 eV pour le rouge).'],
        ['Quelle est la condition pour qu’un photon arrache un électron à un métal ?', ['Que la lumière soit très intense', 'Que l’éclairement dure longtemps', 'Que hν soit supérieur au travail d’extraction W₀', 'Que le métal soit chauffé'], 2, 'Un électron reçoit un photon entier ou rien : il faut hν > W₀, quelle que soit l’intensité.'],
        ['Que montre l’expérience des fentes d’Young photon par photon ?', ['Que la lumière n’est qu’une onde', 'Que les photons n’existent pas', 'Que les franges apparaissent dès le premier photon', 'Que chaque photon arrive en un point, mais que leur accumulation dessine des franges'], 3, 'Impacts ponctuels (corpuscule), figure de franges à l’accumulation (onde) : c’est la dualité onde-corpuscule.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Dynamique d’un circuit électrique et capteurs capacitifs',
      questions: [
        ['Quelle relation lie l’intensité traversant un condensateur à la tension à ses bornes ?', ['i = C × u', 'i = C × du/dt', 'i = u / C', 'i = ½ C u²'], 1, 'i = C × du/dt : l’intensité est le débit de charge, nulle quand la tension ne varie plus.'],
        ['Lors de la décharge d’un condensateur, quel pourcentage de la tension initiale reste-t-il à t = τ ?', ['37 %', '63 %', '50 %', '5 %'], 0, 'u(t) = E × e^(−t/τ) : à t = τ, il reste e⁻¹ ≈ 37 % de la tension initiale.'],
        ['Où la tangente à l’origine de la courbe de charge coupe-t-elle l’asymptote u = E ?', ['À t = 5τ', 'À t = 0', 'À t = τ', 'À t = τ/2'], 2, 'La tangente à l’origine coupe l’asymptote à t = τ : c’est une seconde méthode de lecture de la constante de temps.'],
        ['Sur quoi repose un capteur capacitif de niveau de liquide ?', ['Le liquide chauffe les armatures', 'Le liquide ferme un circuit', 'Le liquide réfléchit la lumière', 'Le liquide remplace l’air entre les armatures, ce qui change C'], 3, 'Changer l’isolant entre les armatures change la capacité, donc τ : une durée mesurable qui renseigne sur le niveau.'],
      ],
    },
  ],
}
