export default {
  slug: 'physique-chimie',
  titreMigration: 'QUESTIONS EN PLUS — PHYSIQUE-CHIMIE 2de',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '2de',
      titre: 'Corps purs et mélanges',
      questions: [
        ['Sous pression atmosphérique normale, à quelle température la glace d’eau pure fond-elle ?', ['4 °C', '−10 °C', '0 °C', '100 °C'], 2, 'La fusion de l’eau pure a lieu à 0 °C sous 1 013 hPa, et la température reste constante pendant tout le changement d’état.'],
        ['Quelle est l’unité de la densité ?', ['Elle n’a pas d’unité', 'Le g·cm⁻³', 'Le kg·m⁻³', 'Le kilogramme'], 0, 'La densité est une masse volumique divisée par celle de l’eau : les unités se simplifient, c’est un nombre sans unité.'],
        ['Lequel de ces exemples est un corps pur ?', ['Un alliage', 'L’eau salée', 'L’air', 'Le saccharose'], 3, 'Le saccharose ne contient qu’une espèce chimique ; eau salée, air et alliage sont des mélanges homogènes.'],
        ['Quelle technique permet de récupérer le sel dissous dans de l’eau salée ?', ['La filtration', 'L’évaporation', 'La décantation', 'La centrifugation'], 1, 'Le sel dissous passe à travers un filtre ; en évaporant l’eau, on récupère le solide.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Composition d’un mélange',
      questions: [
        ['On dissout 5,0 g de sucre et on complète à 250 mL de solution. Quelle est la concentration en masse ?', ['1,25 g·L⁻¹', '20 g·L⁻¹', '5,0 g·L⁻¹', '50 g·L⁻¹'], 1, 't = m / V = 5,0 g / 0,250 L = 20 g·L⁻¹ : pense à convertir le volume en litres.'],
        ['Une solution à 10 g·L⁻¹ est diluée d’un facteur 5. Quelle est la concentration de la solution fille ?', ['15 g·L⁻¹', '50 g·L⁻¹', '5,0 g·L⁻¹', '2,0 g·L⁻¹'], 3, 'F = t₁ / t₂, donc t₂ = t₁ / F = 10 / 5 = 2,0 g·L⁻¹ : diluer, c’est diminuer la concentration.'],
        ['Quel gaz est le plus abondant dans l’air, en volume ?', ['Le diazote', 'Le dioxygène', 'Le dioxyde de carbone', 'L’argon'], 0, 'L’air contient environ 78 % de diazote, 21 % de dioxygène et 1 % d’autres gaz.'],
        ['Quelle verrerie utilise-t-on pour prélever un volume précis de solution mère lors d’une dilution ?', ['L’erlenmeyer', 'Le bécher', 'La pipette jaugée', 'Le tube à essai'], 2, 'La pipette jaugée prélève un volume précis ; on l’introduit ensuite dans une fiole jaugée qu’on complète.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Identification d’une espèce chimique',
      questions: [
        ['Quel réactif met en évidence le dioxyde de carbone ?', ['Une bûchette incandescente, qui se rallume', 'Le sulfate de cuivre anhydre, qui bleuit', 'L’eau de chaux, qui se trouble', 'Une flamme, qui provoque une détonation'], 2, 'Le CO2 trouble l’eau de chaux ; la bûchette rallumée signale le dioxygène, la détonation le dihydrogène.'],
        ['Quelle couleur a le précipité obtenu avec la soude en présence d’ions cuivre II ?', ['Bleu', 'Rouille', 'Vert', 'Blanc'], 0, 'Cuivre II : bleu ; fer III : rouille ; fer II : vert ; zinc ou aluminium : blanc.'],
        ['Sur une chromatographie, une tache a migré de 3,0 cm et le front d’éluant de 6,0 cm. Que vaut son Rf ?', ['9,0', '2,0', '3,0', '0,50'], 3, 'Rf = distance de la tache / distance du front = 3,0 / 6,0 = 0,50 ; un Rf est toujours compris entre 0 et 1.'],
        ['Quel instrument mesure l’indice de réfraction d’un liquide ?', ['Le banc Kofler', 'Le réfractomètre', 'L’éprouvette graduée', 'Le spectrophotomètre'], 1, 'Le réfractomètre mesure l’indice de réfraction, autre grandeur caractéristique d’une espèce pure.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Le noyau de l’atome',
      questions: [
        ['Combien de neutrons contient un noyau de carbone 14 (Z = 6) ?', ['6', '8', '14', '20'], 1, 'Nombre de neutrons = A − Z = 14 − 6 = 8.'],
        ['Environ combien de fois un nucléon est-il plus massif qu’un électron ?', ['10 fois', '2 fois', '100 000 fois', '1 800 fois'], 3, 'Un nucléon pèse environ 1 800 fois plus qu’un électron : la masse de l’atome est donc concentrée dans le noyau.'],
        ['Pourquoi deux isotopes ont-ils les mêmes propriétés chimiques ?', ['Parce qu’ils ont le même nombre d’électrons', 'Parce qu’ils ont le même nombre de neutrons', 'Parce qu’ils ont la même masse', 'Parce qu’ils ont le même nombre de nucléons'], 0, 'Les propriétés chimiques dépendent des électrons ; deux isotopes ont le même Z, donc le même nombre d’électrons.'],
        ['Que compte le nombre de masse A ?', ['Le nombre d’électrons', 'Le nombre de protons', 'Le nombre total de nucléons', 'Le nombre de neutrons seulement'], 2, 'A compte protons et neutrons, c’est-à-dire tous les nucléons ; Z compte les protons.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Configuration électronique d’un atome',
      questions: [
        ['Quelle est la configuration électronique du sodium (Z = 11) ?', ['1s² 2s² 2p⁶ 3p¹', '1s² 2s² 2p⁷', '1s² 2s² 2p⁶ 3s¹', '1s² 2s⁸ 3s¹'], 2, 'On remplit 1s (2), 2s (2), 2p (6), soit 10 électrons, puis le onzième va en 3s.'],
        ['Combien d’électrons de valence possède le chlore (1s² 2s² 2p⁶ 3s² 3p⁵) ?', ['7', '5', '17', '2'], 0, 'La couche externe est la couche 3 : 3s² 3p⁵, soit 2 + 5 = 7 électrons de valence.'],
        ['Comment se comportent les halogènes, dans l’avant-dernière colonne ?', ['Ils perdent deux électrons', 'Ils perdent facilement un électron', 'Ils sont chimiquement inertes', 'Ils gagnent facilement un électron'], 3, 'Il leur manque un électron pour saturer leur couche externe : ils en gagnent facilement un.'],
        ['Selon quel critère Mendeleïev a-t-il classé les éléments ?', ['Le numéro atomique croissant', 'La masse croissante et les propriétés voisines', 'L’ordre alphabétique', 'La date de découverte'], 1, 'Mendeleïev classait par masse croissante en regroupant les propriétés voisines ; le classement actuel suit le numéro atomique.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Stabilité et charge électrique d’une entité chimique',
      questions: [
        ['Quel ion forme le magnésium ?', ['Mg⁺', 'Mg²⁺', 'Mg²⁻', 'Mg⁻'], 1, 'Le magnésium perd deux électrons pour prendre la configuration du néon : il devient Mg²⁺.'],
        ['Quel gaz noble sert de modèle à la règle du duet ?', ['Le krypton', 'Le néon', 'L’argon', 'L’hélium'], 3, 'La règle du duet vise 2 électrons externes, comme l’hélium ; elle concerne notamment l’hydrogène.'],
        ['Combien de doublets non liants porte l’oxygène dans la molécule d’eau ?', ['Deux', 'Aucun', 'Un', 'Quatre'], 0, 'L’oxygène forme deux liaisons O–H et garde deux doublets non liants : il a bien huit électrons autour de lui.'],
        ['Que donne une formule brute ?', ['Les doublets non liants', 'L’enchaînement des liaisons', 'La nature et le nombre des atomes', 'La forme de la molécule dans l’espace'], 2, 'C₂H₆O dit quels atomes et combien ; l’enchaînement des liaisons est donné par la formule développée.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Compter les entités dans un échantillon de matière',
      questions: [
        ['Quelle est la masse molaire du dioxyde de carbone CO₂ ? (C : 12,0 ; O : 16,0 g·mol⁻¹)', ['32,0 g·mol⁻¹', '28,0 g·mol⁻¹', '44,0 g·mol⁻¹', '40,0 g·mol⁻¹'], 2, 'M(CO₂) = 12,0 + 2 × 16,0 = 44,0 g·mol⁻¹.'],
        ['Quelle quantité de matière représente 12 L de gaz à 20 °C sous 1 013 hPa (V_m = 24,0 L·mol⁻¹) ?', ['0,50 mol', '2,0 mol', '288 mol', '12 mol'], 0, 'n = V / V_m = 12 / 24,0 = 0,50 mol.'],
        ['On dissout 0,20 mol de soluté dans 0,50 L de solution. Quelle est la concentration en quantité de matière ?', ['0,70 mol·L⁻¹', '0,10 mol·L⁻¹', '2,5 mol·L⁻¹', '0,40 mol·L⁻¹'], 3, 'c = n / V = 0,20 / 0,50 = 0,40 mol·L⁻¹.'],
        ['Combien de molécules contient 2,0 mol d’eau ?', ['Environ 3,0 × 10²³', 'Environ 1,2 × 10²⁴', 'Environ 6,02 × 10²³', '2,0'], 1, 'N = n × N_A = 2,0 × 6,02 × 10²³ ≈ 1,2 × 10²⁴ molécules.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Caractéristiques et représentation d’un changement d’état',
      questions: [
        ['Comment appelle-t-on le passage direct de l’état gazeux à l’état solide ?', ['La liquéfaction', 'La condensation', 'La solidification', 'La sublimation'], 1, 'Gaz → solide : condensation ; son inverse, solide → gaz, est la sublimation.'],
        ['Lequel de ces changements d’état est exothermique ?', ['La sublimation', 'La fusion', 'La vaporisation', 'La solidification'], 3, 'Solidification, liquéfaction et condensation libèrent de l’énergie ; fusion, vaporisation et sublimation en absorbent.'],
        ['À quoi sert l’énergie apportée pendant le palier de température ?', ['À défaire les interactions entre les entités', 'À faire monter la température', 'À transformer les molécules', 'À rien, elle est perdue'], 0, 'Pendant le palier, l’énergie ne fait pas monter la température : elle sépare les entités les unes des autres.'],
        ['Comment les entités sont-elles organisées dans un solide ?', ['Très éloignées et en mouvement rapide', 'Désordonnées mais en contact', 'Ordonnées et fixes', 'Totalement libres, sans forme propre'], 2, 'Dans un solide, les entités sont ordonnées et fixes : c’est ce qui lui donne une forme propre.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Écriture et analyse d’une réaction chimique',
      questions: [
        ['Dans un tableau d’avancement, comment s’écrit la quantité d’un réactif de coefficient 2 à l’avancement x ?', ['n(initial) − x/2', 'n(initial) + 2x', 'n(initial) − 2x', '2 × n(initial) − x'], 2, 'Un réactif disparaît : on retire coefficient × x à sa quantité initiale.'],
        ['Réaction 2 H₂ + O₂ donne 2 H₂O, avec 3,0 mol de H₂ et 1,0 mol de O₂. Que vaut x_max ?', ['1,0 mol', '1,5 mol', '3,0 mol', '0,50 mol'], 0, 'H₂ s’annule pour 3,0 − 2x = 0, soit x = 1,5 mol ; O₂ pour 1,0 − x = 0, soit x = 1,0 mol. On garde la plus petite valeur : O₂ est limitant.'],
        ['Quel coefficient faut-il placer devant O₂ pour équilibrer « 2 H₂ + … O₂ donne 2 H₂O » ?', ['4', '2', '3', '1'], 3, 'À droite, 2 H₂O contiennent 2 atomes d’oxygène : une seule molécule O₂ suffit.'],
        ['Qu’est-ce qu’une équation de réaction ne donne PAS ?', ['Les proportions dans lesquelles les espèces réagissent', 'Les quantités réellement engagées', 'La nature des réactifs', 'La nature des produits'], 1, 'L’équation donne les proportions, pas les quantités mises en jeu (ni la vitesse) : c’est le rôle du tableau d’avancement.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Synthèse d’une espèce chimique présente dans la nature',
      questions: [
        ['Une synthèse fournit 0,30 mol de produit pour 0,40 mol attendues au maximum. Quel est le rendement ?', ['133 %', '75 %', '30 %', '40 %'], 1, 'Rendement = 0,30 / 0,40 = 0,75, soit 75 % : il est toujours inférieur à 100 %.'],
        ['À quelle étape d’un protocole appartient la recristallisation ?', ['La sécurité', 'La transformation', 'L’identification', 'La séparation'], 3, 'Recristallisation, filtration, extraction et décantation servent à isoler le produit : c’est l’étape de séparation.'],
        ['Parmi ces techniques, laquelle sert à identifier le produit obtenu ?', ['La mesure de sa température de fusion', 'Le chauffage à reflux', 'La décantation à l’ampoule', 'La filtration'], 0, 'L’identification compare le produit à une référence : chromatographie, température de fusion, spectres.'],
        ['Lequel de ces arguments justifie de synthétiser une espèce présente dans la nature ?', ['La molécule naturelle n’existe qu’en laboratoire', 'La molécule de synthèse est toujours plus sûre', 'La ressource naturelle n’est disponible qu’à certaines saisons', 'Le corps assimile mieux la molécule de synthèse'], 2, 'Quantité, coût, saisonnalité ou impact de l’extraction justifient une synthèse ; la molécule obtenue est identique à la naturelle.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Identifier une réaction nucléaire',
      questions: [
        ['Que se passe-t-il lors d’une désintégration β⁺ ?', ['Un noyau d’hélium est émis', 'Un électron est émis et Z augmente de 1', 'Un positon est émis et Z diminue de 1', 'A diminue de 4'], 2, 'En β⁺, un positon est émis : A ne change pas, Z diminue de 1.'],
        ['L’uranium 238 (Z = 92) subit une désintégration α. Quel noyau obtient-on ?', ['A = 234 et Z = 90', 'A = 238 et Z = 93', 'A = 236 et Z = 91', 'A = 234 et Z = 92'], 0, 'Lois de Soddy : l’émission d’un noyau d’hélium (A = 4, Z = 2) donne A = 238 − 4 = 234 et Z = 92 − 2 = 90.'],
        ['Quel est l’ordre de grandeur de l’énergie mise en jeu par une réaction nucléaire, par noyau ?', ['Le joule', 'L’électronvolt', 'Le millième d’électronvolt', 'Le million d’électronvolts'], 3, 'Les réactions nucléaires libèrent de l’ordre du MeV par noyau, environ un million de fois plus qu’une réaction chimique.'],
        ['Qu’est-ce qui provoque la fission d’un noyau d’uranium 235 dans une centrale ?', ['Un choc avec un électron', 'L’impact d’un neutron', 'La lumière', 'La fusion de deux noyaux d’hydrogène'], 1, 'Un neutron frappe le noyau lourd, qui se casse en deux noyaux plus légers en libérant de l’énergie.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Relativité du mouvement',
      questions: [
        ['Quel référentiel choisit-on pour étudier le mouvement d’un satellite autour de la Terre ?', ['Le référentiel héliocentrique', 'Le référentiel géocentrique', 'Le référentiel terrestre', 'Le référentiel du satellite'], 1, 'Le référentiel géocentrique est centré sur le centre de la Terre : c’est celui des satellites.'],
        ['À combien de m·s⁻¹ correspond une vitesse de 72 km·h⁻¹ ?', ['72 m·s⁻¹', '259 m·s⁻¹', '7,2 m·s⁻¹', '20 m·s⁻¹'], 3, 'Pour passer des km·h⁻¹ aux m·s⁻¹, on divise par 3,6 : 72 / 3,6 = 20 m·s⁻¹.'],
        ['Quelle est la trajectoire de la valve d’une roue pour le cycliste lui-même ?', ['Un cercle', 'Une cycloïde', 'Une droite', 'Une parabole'], 0, 'Dans le référentiel du vélo, la valve tourne autour de l’axe de la roue ; c’est pour le piéton au bord de la route qu’elle décrit une cycloïde.'],
        ['Un coureur parcourt 100 m en 20 s. Quelle est sa vitesse moyenne ?', ['0,20 m·s⁻¹', '2 000 m·s⁻¹', '5,0 m·s⁻¹', '80 m·s⁻¹'], 2, 'v = d / Δt = 100 / 20 = 5,0 m·s⁻¹.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Représentation et variation d’un vecteur vitesse',
      questions: [
        ['Dans un mouvement circulaire uniforme, vers où est dirigée la variation du vecteur vitesse ?', ['Vers l’extérieur du cercle', 'Vers l’avant, dans le sens du mouvement', 'Vers le centre du cercle', 'Elle est nulle'], 2, 'Seule la direction change : la variation de vitesse est non nulle et pointe vers le centre.'],
        ['Dans un mouvement rectiligne accéléré, comment est orientée la variation du vecteur vitesse ?', ['Dans le sens du mouvement', 'En sens inverse du mouvement', 'Perpendiculaire à la trajectoire', 'Elle est nulle'], 0, 'La valeur de la vitesse augmente sur une droite : la variation est dans le sens du mouvement.'],
        ['Sur un enregistrement, M(i−1)M(i+1) = 4,0 cm et τ = 0,040 s. Que vaut v(i) ?', ['50 m·s⁻¹', '1,0 m·s⁻¹', '0,16 m·s⁻¹', '0,50 m·s⁻¹'], 3, 'v(i) ≈ M(i−1)M(i+1) / 2τ = 0,040 m / 0,080 s = 0,50 m·s⁻¹.'],
        ['À l’échelle 1 cm pour 0,5 m·s⁻¹, quelle longueur de flèche représente une vitesse de 2,0 m·s⁻¹ ?', ['1,0 cm', '4,0 cm', '2,0 cm', '0,25 cm'], 1, '2,0 / 0,5 = 4 : la flèche mesure 4,0 cm.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Modélisation d’une action par une force',
      questions: [
        ['Quel est le poids d’un objet de 2,0 kg à la surface de la Terre (g ≈ 9,8 N·kg⁻¹) ?', ['2,0 N', 'Environ 20 N', 'Environ 4,9 N', '2,0 kg'], 1, 'P = m × g = 2,0 × 9,8 ≈ 19,6 N, soit environ 20 N ; un poids s’exprime en newtons, pas en kilogrammes.'],
        ['Parmi ces actions, laquelle est une action à distance ?', ['Les frottements de l’air', 'La poussée d’une main', 'La tension d’un fil', 'L’attraction d’un aimant sur un clou'], 3, 'Le magnétisme agit sans contact, comme la pesanteur ; fil, main et air agissent par contact.'],
        ['Quelle est la direction du poids ?', ['Verticale, vers le bas', 'Horizontale', 'Verticale, vers le haut', 'Celle du mouvement'], 0, 'Le poids est vertical, dirigé vers le bas, appliqué au centre de gravité.'],
        ['À quoi sert un diagramme objet-interaction ?', ['À tracer la trajectoire', 'À calculer la masse du système', 'À n’oublier aucune action qui s’exerce sur le système', 'À mesurer une vitesse'], 2, 'On place le système au centre, les acteurs autour, et une double flèche par interaction : l’inventaire est complet.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Le principe d’inertie',
      questions: [
        ['Un palet lancé sur une table à coussin d’air conserve sa vitesse et sa direction. Pourquoi ?', ['Parce qu’il n’a pas de masse', 'Parce qu’une force le pousse en permanence', 'Parce que les frottements sont presque nuls et les forces se compensent', 'Parce que son poids est nul'], 2, 'Le poids est compensé par le coussin d’air et il n’y a presque pas de frottement : le mouvement reste rectiligne uniforme.'],
        ['Quelle force agit sur une pierre lâchée sans vitesse, si l’on néglige l’air ?', ['Son seul poids', 'Aucune force', 'Une force vers le haut', 'Le poids et une force de lancement'], 0, 'Seul le poids agit : les forces ne se compensent pas, et la vitesse augmente vers le bas.'],
        ['Dans l’air, qu’est-ce qui fait tomber une plume moins vite qu’une bille ?', ['Son poids qui est nul', 'Sa masse plus faible', 'Sa couleur', 'La résistance de l’air'], 3, 'Dans le vide, elles tombent ensemble : c’est la résistance de l’air, et non la masse, qui les sépare.'],
        ['Un livre est immobile sur une table, dans un référentiel galiléen. Que peut-on en conclure ?', ['Aucune force ne s’exerce sur lui', 'Les forces qui s’exercent sur lui se compensent', 'Seul son poids agit', 'Il n’a pas de masse'], 1, 'Immobile, son vecteur vitesse ne varie pas : d’après le principe d’inertie, son poids est compensé par l’action de la table.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Émission et propagation d’un signal sonore',
      questions: [
        ['Quelle est la célérité du son dans l’eau ?', ['Environ 340 m·s⁻¹', 'Environ 1 500 m·s⁻¹', 'Plus de 5 000 m·s⁻¹', 'Environ 3,0 × 10⁸ m·s⁻¹'], 1, 'Le son va environ 4 fois plus vite dans l’eau que dans l’air, et encore plus vite dans l’acier.'],
        ['Un écho revient 0,40 s après un cri, dans l’air (v = 340 m·s⁻¹). À quelle distance est la paroi ?', ['34 m', '136 m', '850 m', '68 m'], 3, 'd = v × Δt / 2 = 340 × 0,40 / 2 = 68 m : le son fait l’aller et le retour.'],
        ['On compte 3 s entre l’éclair et le tonnerre. À quelle distance environ est l’orage ?', ['Environ 1 km', 'Environ 100 m', 'Environ 3 km', 'Environ 10 km'], 0, 'La lumière arrive presque instantanément ; le son parcourt 340 × 3 ≈ 1 000 m.'],
        ['Que fait chaque molécule d’air lors du passage d’un son ?', ['Elle reste parfaitement immobile', 'Elle voyage de la source jusqu’à l’oreille', 'Elle oscille autour de sa position d’équilibre', 'Elle se transforme en énergie'], 2, 'Le son est une onde mécanique : compressions et dilatations se transmettent de proche en proche, sans transport de matière.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les sons : fréquence, intensité et perception',
      questions: [
        ['Deux sources identiques sont placées côte à côte. De combien augmente le niveau sonore ?', ['De 10 dB', 'Il double', 'De 3 dB', 'Il ne change pas'], 2, 'L’échelle des décibels est logarithmique : doubler l’intensité ajoute seulement 3 dB.'],
        ['Vers quel niveau sonore se situe le seuil de douleur ?', ['120 dB', '60 dB', '0 dB', '80 dB'], 0, '0 dB est le seuil d’audibilité, 60 dB une conversation, et la douleur apparaît vers 120 dB.'],
        ['Qu’appelle-t-on les harmoniques d’un son ?', ['Des échos successifs', 'Des sons de même intensité', 'Des sons inaudibles', 'Des fréquences multiples de la fréquence fondamentale'], 3, 'Les harmoniques, de fréquences multiples du fondamental, donnent au son son timbre.'],
        ['Comment appelle-t-on les sons de fréquence inférieure à 20 Hz ?', ['Les ultrasons', 'Les infrasons', 'Les sons aigus', 'Les harmoniques'], 1, 'Sous 20 Hz, ce sont des infrasons, inaudibles pour l’humain mais perçus par certains animaux.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Intensité et tension dans un circuit complexe',
      questions: [
        ['Comment branche-t-on un voltmètre ?', ['En série dans la branche', 'En dérivation aux bornes du dipôle', 'À la place du générateur', 'Il n’a pas besoin d’être branché'], 1, 'Le voltmètre mesure une différence entre deux points : il se branche en dérivation ; l’ampèremètre, lui, en série.'],
        ['Deux lampes en série sur un générateur de 12 V ; l’une a 5,0 V à ses bornes. Quelle tension aux bornes de l’autre ?', ['17 V', '12 V', '5,0 V', '7,0 V'], 3, 'Loi des mailles : en série, la tension du générateur est la somme des tensions des récepteurs, 12 − 5,0 = 7,0 V.'],
        ['0,80 A arrivent à un nœud ; une branche en emporte 0,30 A. Combien part dans l’autre ?', ['0,50 A', '1,1 A', '0,30 A', '0,80 A'], 0, 'Loi des nœuds : ce qui arrive repart, 0,80 − 0,30 = 0,50 A.'],
        ['Que traduit la loi des nœuds ?', ['La proportionnalité entre U et I', 'La conservation de l’énergie thermique', 'La conservation de la charge électrique', 'L’égalité des tensions en série'], 2, 'Aucune charge ne s’accumule à un nœud : tout ce qui arrive repart.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La loi d’Ohm et la résistance au courant électrique',
      questions: [
        ['Un conducteur ohmique de 100 Ω est traversé par 0,050 A. Quelle est la tension à ses bornes ?', ['0,50 V', '2 000 V', '5,0 V', '50 V'], 2, 'U = R × I = 100 × 0,050 = 5,0 V.'],
        ['Comment varie la résistance d’un fil quand sa section augmente ?', ['Elle diminue', 'Elle augmente', 'Elle ne change pas', 'Elle double toujours'], 0, 'Un fil plus épais laisse passer le courant plus facilement : sa résistance diminue.'],
        ['Comment mesure-t-on une résistance à l’ohmmètre ?', ['On ne peut pas la mesurer', 'En série, circuit alimenté', 'En dérivation, circuit alimenté', 'Directement, hors circuit'], 3, 'L’ohmmètre mesure la résistance d’un dipôle isolé, hors circuit.'],
        ['Un radiateur de 1 kW fonctionne 2 h. Quelle énergie consomme-t-il ?', ['0,5 kWh', '2 kWh', '2 000 kWh', '1 kWh'], 1, 'E = P × Δt = 1 kW × 2 h = 2 kWh, soit 7,2 × 10⁶ J.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Propagation et décomposition de la lumière',
      questions: [
        ['Parmi ces objets, lequel est un objet diffusant, et non une source primaire ?', ['Le Soleil', 'La Lune', 'Une flamme', 'Un écran allumé'], 1, 'La Lune ne produit pas de lumière : elle renvoie celle du Soleil dans toutes les directions.'],
        ['Combien de temps la lumière du Soleil met-elle à nous parvenir ?', ['Environ 8 heures', 'Instantanément', 'Environ 8 secondes', 'Environ 8 minutes'], 3, 'Le Soleil que nous voyons est celui d’il y a environ huit minutes : voir loin, c’est voir tôt.'],
        ['Comment appelle-t-on les radiations de longueur d’onde supérieure à 800 nm ?', ['Les infrarouges', 'Les ultraviolets', 'Le visible', 'Les rayons X'], 0, 'Au-delà du rouge (800 nm), ce sont les infrarouges ; en deçà du violet (400 nm), les ultraviolets.'],
        ['Qu’a montré Newton en recombinant le spectre de la lumière blanche ?', ['Que la lumière est un son', 'Que le prisme colore la lumière', 'Que le blanc est une superposition de radiations', 'Que le blanc est une couleur simple'], 2, 'En recombinant les couleurs, il a retrouvé du blanc : la lumière blanche est composite.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Réflexion et réfraction de la lumière, le prisme',
      questions: [
        ['Dans un prisme, quelle radiation est la plus déviée ?', ['Le jaune', 'Le rouge', 'Le violet', 'Toutes sont déviées de la même façon'], 2, 'L’indice dépend de la longueur d’onde : le violet est plus dévié que le rouge.'],
        ['Dans quel cas peut se produire une réflexion totale ?', ['Quand la lumière passe d’un milieu plus réfringent à un milieu moins réfringent', 'Quand la lumière passe de l’air à l’eau', 'Quand l’angle d’incidence est nul', 'Sur toute surface rugueuse'], 0, 'En sortant d’un milieu plus réfringent, au-delà d’un angle limite, il n’y a plus de rayon réfracté.'],
        ['Un rayon passe de l’air (n = 1,00) à l’eau (n = 1,33) avec i₁ = 30°. Que vaut environ i₂ ?', ['60°', '30°', '40°', '22°'], 3, 'sin i₂ = 1,00 × sin 30° / 1,33 ≈ 0,38, soit i₂ ≈ 22° : le rayon se rapproche de la normale.'],
        ['Quel phénomène explique l’arc-en-ciel ?', ['La réflexion totale dans les nuages', 'La dispersion de la lumière dans des gouttes d’eau', 'La diffusion par l’air', 'L’absorption par la vapeur d’eau'], 1, 'Comme un prisme, les gouttes d’eau séparent les radiations de la lumière blanche.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les lentilles convergentes',
      questions: [
        ['Que devient un rayon incident passant par le foyer objet F ?', ['Il passe par F′', 'Il repart parallèle à l’axe optique', 'Il n’est pas dévié', 'Il revient en arrière'], 1, 'C’est le troisième rayon particulier : par F, il ressort parallèle à l’axe.'],
        ['Quelle lentille corrige l’hypermétropie ?', ['Un prisme', 'Une lentille divergente', 'Un verre plan', 'Une lentille convergente'], 3, 'Chez l’hypermétrope, l’image se forme en arrière de la rétine : une lentille convergente la ramène sur la rétine.'],
        ['Qu’est-ce que l’accommodation ?', ['La déformation du cristallin qui garde l’image nette quand l’objet se rapproche', 'L’ouverture de la pupille dans le noir', 'Le fait de s’habituer à des lunettes', 'Le déplacement de la rétine'], 0, 'Le cristallin se bombe pour augmenter sa vergence quand on regarde de près.'],
        ['Quelle est la vergence d’une lentille de distance focale 50 cm ?', ['0,5 δ', '50 δ', '2 δ', '0,02 δ'], 2, 'C = 1 / f′ avec f′ en mètres : 1 / 0,50 = 2 δ.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Construction de l’image d’un objet',
      questions: [
        ['Objet à OA = −20 cm d’une lentille de distance focale 10 cm. Où se forme l’image ?', ['À 20 cm du même côté que l’objet', 'À 10 cm de l’autre côté', 'À 20 cm de l’autre côté de la lentille', 'À l’infini'], 2, '1/OA′ = 1/OF′ + 1/OA = 1/10 − 1/20 = 1/20, donc OA′ = 20 cm.'],
        ['Que signifie un grandissement γ = −1 ?', ['L’image est renversée et de même taille que l’objet', 'L’image est droite et de même taille', 'L’image est deux fois plus grande', 'Il n’y a pas d’image'], 0, 'γ négatif : image renversée ; |γ| = 1 : même taille que l’objet.'],
        ['Quelle différence pratique entre une image réelle et une image virtuelle ?', ['Il n’y en a aucune', 'L’image réelle est toujours plus grande', 'L’image virtuelle est toujours renversée', 'L’image réelle se projette sur un écran, l’image virtuelle se regarde à travers la lentille'], 3, 'Une image réelle se projette, une image virtuelle se regarde, comme à travers une loupe.'],
        ['Une fois B′ trouvé, où place-t-on A′ ?', ['Au foyer image F′', 'Sur l’axe optique, à la verticale de B′', 'Au centre optique O', 'Sur la lentille'], 1, 'L’objet AB étant perpendiculaire à l’axe avec A sur l’axe, l’image A′B′ l’est aussi : A′ est sur l’axe, à l’aplomb de B′.'],
      ],
    },
  ],
}
