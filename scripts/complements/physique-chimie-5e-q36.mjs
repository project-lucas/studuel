export default {
  slug: 'physique-chimie',
  titreMigration: 'QUESTIONS EN PLUS — PHYSIQUE-CHIMIE 5e (lot 36)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: ["5e","4e"], titre: "La miscibilité et la solubilité",
      questions: [
        ['On dissout 10 g de sucre dans 200 g d’eau. Quelle est la masse de la solution obtenue ?', ['190 g', '210 g', '2 000 g', '20 g'], 1, 'Masse de la solution = masse du solvant + masse du soluté = 200 + 10 = 210 g : la masse se conserve.'],
        ['On ajoute du sucre dans une solution déjà saturée. Que devient le sucre en excès ?', ['Il se dissout peu à peu', 'Il disparaît de la solution', 'Il se transforme en solvant', 'Il reste au fond du récipient'], 3, 'Une solution saturée a atteint sa limite : le surplus de soluté ne se dissout plus et reste au fond.'],
        ['Dans quelle unité exprime-t-on la solubilité ?', ['g/cm³', 'N/kg', 'g/L', 'mL'], 2, 'La solubilité est la masse maximale de soluté dissoute dans un litre de solvant : elle s’exprime en g/L. Les g/cm³ sont l’unité de la masse volumique.'],
        ['Quel mélange forme un mélange homogène ?', ['L’eau et l’alcool', 'L’eau et l’huile', 'L’eau et le cyclohexane', 'Aucun des trois'], 0, 'L’eau et l’alcool sont miscibles : ils forment un seul liquide. Eau et huile, eau et cyclohexane forment deux phases superposées.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La composition de l’air",
      questions: [
        ['Un litre d’air a une masse d’environ 1,2 g. Quelle est la masse de 5 L d’air ?', ['0,24 g', '1,2 g', '6 g', '60 g'], 2, '5 × 1,2 = 6 g. L’air a une masse : on la prouve en pesant un ballon gonflé puis dégonflé.'],
        ['Quelle est l’origine de l’augmentation du CO₂ dans l’air ?', ['Les volcans éteints', 'La respiration des poissons', 'L’évaporation des océans', 'La combustion des énergies fossiles'], 3, 'Le CO₂ est un gaz à effet de serre issu des énergies fossiles (pétrole, charbon, gaz) que l’on brûle.'],
        ['Que devient le volume d’une quantité d’air soumise à une forte pression ?', ['Il diminue beaucoup', 'Il augmente', 'Il devient nul', 'Il reste identique'], 0, 'Un gaz est compressible : dans une bouteille de plongée, le même air occupe un volume bien plus petit sous forte pression.'],
        ['Quelle est la valeur de la pression atmosphérique au niveau de la mer ?', ['101 hPa', '1 013 hPa', '10 130 hPa', '1 013 N'], 1, 'La pression atmosphérique au niveau de la mer vaut environ 1 013 hPa ; elle se mesure avec un baromètre.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La masse volumique",
      questions: [
        ['Un objet de 200 g occupe 25 cm³. Quelle est sa masse volumique ?', ['0,125 g/cm³', '5 000 g/cm³', '8 g/cm³', '225 g/cm³'], 2, 'ρ = m ÷ V = 200 ÷ 25 = 8 g/cm³, valeur proche de celle du fer (7,9 g/cm³).'],
        ['Quelle est la masse de 50 cm³ d’huile de masse volumique 0,92 g/cm³ ?', ['46 g', '54 g', '0,018 g', '4,6 g'], 0, 'De ρ = m ÷ V on tire m = ρ × V = 0,92 × 50 = 46 g.'],
        ['Le fer a une masse volumique de 7,9 g/cm³. Quelle est-elle en kg/m³ ?', ['790 kg/m³', '79 kg/m³', '0,0079 kg/m³', '7 900 kg/m³'], 3, '1 g/cm³ = 1 000 kg/m³, donc 7,9 g/cm³ = 7 900 kg/m³.'],
        ['Un morceau de bois flotte sur l’eau. Que peut-on en déduire ?', ['Sa masse est inférieure à 1 g', 'Sa masse volumique est inférieure à 1 g/cm³', 'Son volume est toujours inférieur à celui de l’eau', 'Il est nécessairement creux'], 1, 'Un corps flotte si sa masse volumique est inférieure à celle du liquide (1 g/cm³ pour l’eau). La masse seule ne dit rien.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Signal et information",
      questions: [
        ['Combien d’octets contient un fichier de 2 ko ?', ['16 octets', '2 000 octets', '2 000 000 octets', '200 octets'], 1, '1 ko = 1 000 octets, donc 2 ko = 2 000 octets (et 1 octet = 8 bits).'],
        ['Dans un objet connecté, quel élément agit sur l’environnement ?', ['Le capteur', 'Le microcontrôleur', 'L’émetteur', 'L’actionneur'], 3, 'Le capteur mesure, le microcontrôleur traite le signal, l’actionneur agit (moteur, lampe, alarme).'],
        ['Quel est un avantage du signal numérique sur le signal analogique ?', ['Il se copie sans perte', 'Il varie de façon continue', 'Il se dégrade à chaque copie', 'Il ne peut pas être compressé'], 0, 'Le signal numérique, une suite de 0 et de 1, se copie sans perte et se compresse : c’est pourquoi photo, musique et télévision sont passées au numérique.'],
        ['Quel schéma décrit une chaîne de transmission ?', ['Récepteur → milieu → émetteur', 'Milieu → émetteur → récepteur', 'Émetteur → milieu de propagation → récepteur', 'Capteur → émetteur → écran'], 2, 'Un signal va d’un émetteur vers un récepteur en traversant un milieu de propagation, sans transport de matière.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La lumière",
      questions: [
        ['La Lune est-elle une source primaire de lumière ?', ['Oui, elle produit sa propre lumière', 'Non, c’est un objet diffusant', 'Oui, mais seulement la nuit', 'Non, car elle est transparente'], 1, 'La Lune diffuse la lumière du Soleil : c’est un objet diffusant, pas une source primaire (comme un mur ou une page de livre).'],
        ['Qu’appelle-t-on une ombre portée ?', ['La face non éclairée de l’objet', 'Une image renversée dans une boîte', 'La zone entourant l’objet éclairée', 'L’ombre formée sur le sol ou un écran'], 3, 'L’ombre portée se forme sur le sol ou l’écran ; la face non éclairée de l’objet est l’ombre propre.'],
        ['Quelles sont les couleurs primaires de la synthèse soustractive (peinture) ?', ['Cyan, magenta, jaune', 'Rouge, vert, bleu', 'Rouge, jaune, bleu', 'Noir, blanc, gris'], 0, 'En peinture, chaque pigment retire des couleurs à la lumière blanche : les primaires sont cyan, magenta et jaune. Rouge, vert, bleu sont celles de la synthèse additive (écrans).'],
        ['Dans un arc-en-ciel, qu’est-ce qui disperse la lumière blanche ?', ['La chaleur du Soleil', 'Le vent', 'Les gouttes d’eau', 'La poussière'], 2, 'Les gouttes d’eau jouent le rôle d’un prisme : elles dispersent la lumière blanche en un spectre continu de couleurs.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le son",
      questions: [
        ['Dans un orage, 6 s s’écoulent entre l’éclair et le tonnerre. À quelle distance est l’éclair ?', ['6 km', '0,5 km', '20 km', '2 km'], 3, 'On divise le nombre de secondes par 3 : 6 ÷ 3 = 2 km. En effet d = 340 × 6 ≈ 2 040 m.'],
        ['Un sonar reçoit l’écho d’un son 2 s après son émission dans l’eau (1 500 m/s). À quelle distance est l’obstacle ?', ['3 000 m', '1 500 m', '750 m', '300 m'], 1, 'Le son fait l’aller-retour : distance totale 1 500 × 2 = 3 000 m, donc l’obstacle est à la moitié, soit 1 500 m.'],
        ['Dans lequel de ces milieux le son se propage-t-il le plus vite ?', ['L’air', 'L’eau', 'L’acier', 'Le vide'], 2, 'Le son va d’autant plus vite que le milieu est dense et rigide : environ 340 m/s dans l’air, 1 500 m/s dans l’eau, 5 000 m/s dans l’acier. Il ne se propage pas dans le vide.'],
        ['À quoi sert l’expérience de la cloche à vide ?', ['À montrer que le son ne se propage pas dans le vide', 'À mesurer la vitesse du son', 'À amplifier une sonnerie', 'À mesurer le niveau sonore'], 0, 'Quand on pompe l’air, la sonnerie s’éteint alors qu’on voit toujours le marteau frapper : le son a besoin d’un milieu matériel.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les signaux sonores",
      questions: [
        ['Quelle est la période d’un son de fréquence 1 000 Hz ?', ['1 s', '0,1 ms', '1 ms', '10 ms'], 2, 'T = 1 ÷ f = 1 ÷ 1 000 = 0,001 s = 1 ms.'],
        ['Deux notes ont pour périodes 2 ms et 4 ms. Laquelle est la plus aiguë ?', ['Celle de période 4 ms', 'Celle de période 2 ms', 'Elles sont identiques', 'Celle de plus grande amplitude'], 1, 'Plus la période est courte, plus la fréquence est grande et plus le son est aigu : 2 ms correspond à 500 Hz, 4 ms à 250 Hz.'],
        ['Que sont les infrasons ?', ['Des sons de fréquence supérieure à 20 000 Hz', 'Des sons compris entre 20 et 20 000 Hz', 'Des sons de fréquence toujours nulle', 'Des sons de fréquence inférieure à 20 Hz'], 3, 'Les infrasons ont une fréquence inférieure à 20 Hz (éléphants, séismes). Au-delà de 20 000 Hz, ce sont des ultrasons.'],
        ['Sur l’écran d’un oscilloscope, qu’est-ce qui montre qu’un son est plus fort ?', ['Une amplitude plus grande', 'Une période plus courte', 'Une fréquence plus grande', 'Une courbe sans période'], 0, 'Plus l’amplitude est grande, plus le son est fort. Elle ne change pas la hauteur du son, liée à la fréquence.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les atomes et la transformation chimique",
      questions: [
        ['Combien d’atomes d’oxygène représente l’écriture 2 O₂ ?', ['2', '3', '4', '8'], 2, 'Le nombre devant la formule multiplie la molécule : 2 molécules O₂ contiennent 2 × 2 = 4 atomes d’oxygène.'],
        ['Lequel de ces signes indique une transformation chimique ?', ['Un changement d’état', 'Un dégagement de gaz', 'Une dissolution de sucre', 'Une variation de volume'], 1, 'Dégagement de gaz, changement de couleur, précipité, dégagement de chaleur ou disparition d’un réactif signalent une transformation chimique.'],
        ['6 g de carbone réagissent entièrement avec 16 g de dioxygène pour donner du dioxyde de carbone. Quelle masse de CO₂ se forme ?', ['10 g', '96 g', '16 g', '22 g'], 3, 'Loi de Lavoisier : la masse totale se conserve, donc masse des produits = 6 + 16 = 22 g.'],
        ['Complète l’équation ajustée : 2 H₂ + O₂ → … H₂O', ['2 H₂O', 'H₂O', '4 H₂O', '3 H₂O'], 0, 'À gauche, 4 atomes d’hydrogène et 2 d’oxygène ; il faut donc 2 molécules H₂O à droite (4 H et 2 O).'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les tests caractéristiques des espèces chimiques",
      questions: [
        ['L’eau de chaux se trouble dans un gaz. Quel gaz est identifié ?', ['Le dioxygène', 'Le dihydrogène', 'Le dioxyde de carbone', 'La vapeur d’eau'], 2, 'L’eau de chaux qui se trouble (blanc laiteux) identifie le dioxyde de carbone.'],
        ['On ajoute de la soude à une solution : un précipité vert apparaît. Quel ion est identifié ?', ['Fer II', 'Fer III', 'Cuivre II', 'Chlorure'], 0, 'Fer II : précipité vert. Fer III : rouille. Cuivre II : bleu. Zinc : blanc.'],
        ['Que devient le précipité blanc formé par les ions chlorure et le nitrate d’argent ?', ['Il devient vert', 'Il noircit à la lumière', 'Il devient bleu', 'Il se dissout'], 1, 'Le précipité de chlorure d’argent est blanc et noircit à la lumière.'],
        ['Quelle protection porte-t-on pour manipuler de la soude ?', ['Aucune protection', 'Des gants seulement', 'Un simple tablier', 'Lunettes, gants et blouse'], 3, 'La soude est corrosive : lunettes, gants et blouse sont indispensables (comme pour le nitrate d’argent).'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les ions",
      questions: [
        ['Quel est le symbole de l’ion sodium ?', ['Na⁻', 'Na⁺', 'Na²⁺', 'Cl⁺'], 1, 'L’atome de sodium perd un électron : il devient un cation de charge 1+, noté Na⁺.'],
        ['Cl⁻ est :', ['Un cation', 'Un isotope', 'Un atome neutre', 'Un anion'], 3, 'Un ion négatif, qui a gagné un électron, s’appelle un anion. Un cation est positif.'],
        ['Que devient un atome quand il perd un électron ?', ['Il devient un cation, avec un proton de plus que d’électrons', 'Il devient un anion, avec un électron de moins que de protons', 'Il devient un autre élément chimique', 'Il reste neutre mais plus léger'], 0, 'Il a perdu une charge négative : il porte un proton de trop, donc une charge positive. Le noyau ne change pas, l’élément reste le même.'],
        ['Une solution d’eau salée est-elle électriquement chargée ?', ['Non, elle porte une charge positive', 'Non, elle porte une charge négative', 'Oui, autant de charges positives que négatives', 'Oui, mais seulement si elle est chauffée'], 2, 'Elle est neutre dans son ensemble : autant de charges positives (Na⁺) que négatives (Cl⁻). Les ions restent mobiles.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le pH ou potentiel hydrogène",
      questions: [
        ['Une eau savonneuse a un pH d’environ 9. Comment est-elle ?', ['Acide', 'Neutre', 'Basique', 'Saturée'], 2, 'pH supérieur à 7 : solution basique. Inférieur à 7 : acide. Égal à 7 : neutre.'],
        ['Quelle est la précision du papier pH ?', ['Au centième', 'Environ 1 unité', 'Au dixième', 'Exacte'], 1, 'Le papier pH donne le pH à environ 1 unité près ; le pH-mètre est précis au dixième.'],
        ['Quels ions dominent dans une solution basique ?', ['Les ions hydroxyde OH⁻', 'Les ions hydrogène H⁺', 'Les ions chlorure Cl⁻', 'Les ions sodium seulement'], 0, 'Une solution basique contient surtout des ions hydroxyde OH⁻ ; une solution acide, des ions hydrogène H⁺.'],
        ['On dilue beaucoup une solution basique de pH 13. Que devient son pH ?', ['Il devient inférieur à 7', 'Il augmente au-delà de 13', 'Il reste à 13', 'Il diminue en se rapprochant de 7'], 3, 'La dilution rapproche le pH de 7 sans jamais le dépasser : on ne rend pas une solution basique acide en la diluant.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les réactions aux solutions acides",
      questions: [
        ['Dans la réaction de l’acide chlorhydrique avec le fer, quel est l’ion spectateur ?', ['H⁺', 'Fe²⁺', 'Cl⁻', 'OH⁻'], 2, 'L’ion chlorure Cl⁻ ne participe pas à la réaction : c’est un ion spectateur. Les ions H⁺ réagissent avec le fer.'],
        ['Que se passe-t-il quand on met du zinc dans l’acide chlorhydrique ?', ['Il réagit avec dégagement de dihydrogène', 'Il ne réagit pas', 'Il dégage du dioxygène', 'Il se dissout sans rien produire'], 0, 'Zinc, aluminium et magnésium réagissent avec l’acide chlorhydrique en dégageant du dihydrogène.'],
        ['Comment est la masse de rouille formée par rapport au fer disparu ?', ['Égale à celle du fer disparu', 'Supérieure, car des atomes d’oxygène s’y ajoutent', 'Inférieure, car du fer est perdu', 'Nulle : la rouille est légère'], 1, 'La rouille contient du fer et de l’oxygène : sa masse est supérieure à celle du fer disparu. Le fer ne s’use pas, il se transforme.'],
        ['Lequel de ces métaux est attaqué par l’acide chlorhydrique ?', ['L’or', 'L’argent', 'Le cuivre', 'L’aluminium'], 3, 'Cuivre, or et argent ne réagissent pas avec l’acide chlorhydrique ; l’aluminium, le zinc et le magnésium, si.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les mouvements",
      questions: [
        ['Un train parcourt 150 km en 2 h. Quelle est sa vitesse moyenne ?', ['300 km/h', '75 km/h', '0,013 km/h', '152 km/h'], 1, 'v = d ÷ t = 150 ÷ 2 = 75 km/h.'],
        ['Quelle est la vitesse de 54 km/h en m/s ?', ['194,4 m/s', '5,4 m/s', '15 m/s', '54 m/s'], 2, 'On divise par 3,6 : 54 ÷ 3,6 = 15 m/s.'],
        ['Un cycliste roule à 20 m/s à vitesse constante pendant 30 s. Quelle distance parcourt-il ?', ['600 m', '0,67 m', '50 m', '6 000 m'], 0, 'd = v × t = 20 × 30 = 600 m.'],
        ['Sur une chronophotographie, les positions successives d’un objet sont régulièrement espacées. Que peut-on dire de son mouvement ?', ['Il est accéléré', 'Il est ralenti', 'Il est immobile', 'Il est uniforme'], 3, 'Des positions à intervalles de temps égaux et à distances égales indiquent une vitesse constante : un mouvement uniforme.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Interactions et forces",
      questions: [
        ['Quelle grandeur le dynamomètre mesure-t-il ?', ['Une masse', 'Une force', 'Une énergie', 'Une vitesse'], 1, 'Le dynamomètre mesure la valeur d’une force, en newtons (N). La balance mesure la masse.'],
        ['Lequel de ces exemples est une interaction à distance ?', ['Le magnétisme', 'La poussée d’une main', 'Le frottement de l’air', 'Le sol qui soutient un objet'], 0, 'Gravitation, magnétisme et électrostatique s’exercent sans contact. Les trois autres sont des interactions de contact.'],
        ['Un palet glisse en ligne droite à vitesse constante. Que peut-on dire des forces qui s’exercent sur lui ?', ['Il n’y a aucune force sur lui', 'Elles le font ralentir peu à peu', 'Elles se compensent', 'Elles sont toutes dirigées vers l’avant'], 2, 'Une vitesse constante en ligne droite signifie que les forces se compensent. Il n’est pas nécessaire d’avoir une force pour continuer d’avancer.'],
        ['Que représente la longueur de la flèche qui schématise une force ?', ['Le sens', 'La direction', 'Le point d’application', 'La valeur de la force'], 3, 'La longueur de la flèche traduit la valeur de la force (en newtons). Le sens est celui de la pointe.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Poids et gravitation",
      questions: [
        ['Quel est le poids sur Terre d’un objet de 5 kg (g = 9,8 N/kg) ?', ['49 N', '5 N', '0,51 N', '4,9 N'], 0, 'P = m × g = 5 × 9,8 = 49 N.'],
        ['Quel est le poids sur la Lune d’un objet de 10 kg (g = 1,6 N/kg) ?', ['98 N', '10 N', '16 N', '1,6 N'], 2, 'P = m × g = 10 × 1,6 = 16 N. Sa masse, elle, reste égale à 10 kg.'],
        ['Un objet a un poids de 196 N sur Terre (g = 9,8 N/kg). Quelle est sa masse ?', ['196 kg', '20 kg', '2 kg', '1 920 kg'], 1, 'De P = m × g, on tire m = P ÷ g = 196 ÷ 9,8 = 20 kg.'],
        ['En quel point s’applique le poids d’un objet ?', ['À la base de l’objet', 'À la surface supérieure', 'Au point de contact avec le sol', 'Au centre de gravité de l’objet'], 3, 'Le poids s’applique au centre de gravité de l’objet ; il est vertical et dirigé vers le bas.'],
      ],
    },
  ],
}
