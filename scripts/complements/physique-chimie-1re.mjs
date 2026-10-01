export default {
  slug: 'physique-chimie',
  titreMigration: 'QUESTIONS EN PLUS — PHYSIQUE-CHIMIE 1re',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '1re',
      titre: 'La statique des fluides',
      questions: [
        ['Combien de pascals vaut 1 bar ?', ['1 000 Pa', '100 000 Pa', '1 013 Pa', '10 Pa'], 1, '1 bar = 100 000 Pa = 10⁵ Pa ; la pression atmosphérique, environ 1 013 hPa, en est très proche.'],
        ['Quelle est la valeur approximative de la pression atmosphérique au niveau de la mer ?', ['Environ 100 hPa', 'Environ 10 hPa', 'Environ 1 013 hPa', 'Environ 1 013 Pa'], 2, '1 013 hectopascals, soit environ 101 300 Pa : à peu près 1 bar.'],
        ['Quelle est la direction de la poussée d’Archimède ?', ['Horizontale', 'Verticale, vers le bas', 'Perpendiculaire au mouvement du corps', 'Verticale, vers le haut'], 3, 'La poussée d’Archimède est toujours verticale et orientée vers le haut, quelle que soit la forme du corps.'],
        ['Un gaz occupe 2,0 L sous 1,0 bar. À température constante, on le comprime jusqu’à 0,50 L. Quelle est sa nouvelle pression ?', ['4,0 bar', '0,25 bar', '2,0 bar', '1,0 bar'], 0, 'Loi de Mariotte : p × V reste constant, donc p = 1,0 × 2,0 / 0,50 = 4,0 bar. Volume divisé par quatre, pression multipliée par quatre.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Mouvements et cinématique',
      questions: [
        ['Un passager est assis dans un train qui roule. Dans le référentiel du sol, il est…', ['immobile', 'en mouvement', 'sans vitesse définie', 'en chute libre'], 1, 'Dans le référentiel du train, il est immobile ; dans celui du sol, il se déplace avec le train. Le mouvement dépend toujours du référentiel.'],
        ['Vers où est dirigée l’accélération d’un mobile en mouvement circulaire uniforme ?', ['Vers l’extérieur du cercle', 'Dans le sens du mouvement', 'Vers le centre du cercle', 'Elle n’a pas de direction, elle est nulle'], 2, 'La valeur de la vitesse ne change pas, mais sa direction tourne : l’accélération est dirigée vers le centre.'],
        ['Dans un mouvement rectiligne uniformément accéléré, comment varie la vitesse ?', ['Elle reste constante', 'Elle varie comme le carré du temps', 'Elle diminue toujours', 'Elle varie linéairement avec le temps'], 3, 'L’accélération est constante : la vitesse augmente (ou diminue) de la même quantité à chaque seconde.'],
        ['Quelle est la première étape de la méthode pour étudier un mouvement ?', ['Définir le système', 'Appliquer la deuxième loi de Newton', 'Faire le bilan des forces', 'Intégrer pour obtenir la position'], 0, 'On définit le système, puis le référentiel, on fait le bilan des forces, on applique la deuxième loi et on intègre.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le champ gravitationnel',
      questions: [
        ['Par combien est divisée la force gravitationnelle si la distance entre deux corps est triplée ?', ['Par trois', 'Par six', 'Par neuf', 'Par vingt-sept'], 2, 'La force varie en 1 / d² : tripler d divise la force par 3² = 9.'],
        ['Quelle est la valeur approximative du champ de pesanteur sur la Lune ?', ['9,8 N/kg', '1,6 N/kg', '3,7 N/kg', '0 N/kg'], 1, 'Environ 1,6 N/kg, soit six fois moins que sur Terre : même masse, poids six fois plus faible.'],
        ['Quel est le poids d’un élève de 60 kg sur Terre, avec g = 9,8 N/kg ?', ['588 N', '60 N', '6,1 N', '69,8 N'], 0, 'P = m × g = 60 × 9,8 = 588 N. La masse se compte en kilogrammes, le poids en newtons.'],
        ['Quelle est la valeur de la constante de gravitation universelle G, en unités du Système international ?', ['9 × 10⁹', '6,02 × 10²³', '3,00 × 10⁸', '6,67 × 10⁻¹¹'], 3, 'G ≈ 6,67 × 10⁻¹¹ : sa petitesse explique qu’on ne ressente pas l’attraction entre deux objets ordinaires.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Champ électrique et électrostatique',
      questions: [
        ['Quelle est l’unité du champ électrique ?', ['Le newton par kilogramme', 'Le coulomb', 'L’ampère', 'Le volt par mètre'], 3, 'Le champ électrique se mesure en V/m, ce que confirme la relation E = U / d.'],
        ['Quelle est la valeur de la charge élémentaire ?', ['Environ 1,6 × 10⁻¹⁹ C', 'Environ 6,63 × 10⁻³⁴ C', 'Environ 9 × 10⁹ C', 'Environ 6,02 × 10²³ C'], 0, 'e ≈ 1,6 × 10⁻¹⁹ C : c’est la charge d’un proton, et l’opposée de celle d’un électron.'],
        ['Un condensateur plan est soumis à une tension de 100 V, ses plaques sont distantes de 2,0 cm. Que vaut le champ entre elles ?', ['50 V/m', '200 V/m', '5 000 V/m', '2 V/m'], 2, 'E = U / d = 100 / 0,020 = 5 000 V/m. Il faut convertir la distance en mètres.'],
        ['Entre deux protons, comment se comparent la répulsion électrique et l’attraction gravitationnelle ?', ['La gravitation l’emporte largement', 'La répulsion électrique est environ 10³⁶ fois plus grande', 'Elles sont égales', 'Elles s’annulent exactement'], 1, 'Même forme en 1 / d², mais une intensité sans commune mesure : à l’échelle des particules, la gravitation est négligeable.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Définition des ondes',
      questions: [
        ['Une onde a une période de 0,01 s. Quelle est sa fréquence ?', ['0,01 Hz', '100 Hz', '10 Hz', '1 000 Hz'], 1, 'f = 1 / T = 1 / 0,01 = 100 Hz : cent motifs par seconde.'],
        ['Sur une corde qu’on secoue, la perturbation est perpendiculaire à la propagation. L’onde est…', ['longitudinale', 'électromagnétique', 'transversale', 'sonore'], 2, 'Transversale : la perturbation est perpendiculaire à la direction de propagation, comme sur une corde ou une vague.'],
        ['On compte 3 s entre l’éclair et le tonnerre. À quelle distance environ est l’orage ?', ['Environ 100 m', 'Environ 3 km', 'Environ 10 km', 'Environ 1 km'], 3, 'τ = d / v donne d = v × τ ≈ 340 × 3 ≈ 1 000 m. La lumière arrive quasi instantanément.'],
        ['Quelle est la célérité approximative du son dans l’eau ?', ['Environ 1 500 m/s', 'Environ 340 m/s', 'Environ 5 000 m/s', 'Environ 3,00 × 10⁸ m/s'], 0, 'Environ 1 500 m/s : plus que dans l’air (340 m/s), moins que dans l’acier (5 000 m/s). Plus le milieu est rigide, plus l’onde va vite.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Ondes et spectre électromagnétiques',
      questions: [
        ['Quel rayonnement sert à la radiographie ?', ['L’ultraviolet', 'L’infrarouge', 'Les micro-ondes', 'Les rayons X'], 3, 'Les rayons X, de longueur d’onde environ 0,01 à 10 nm, traversent les tissus mous mais pas les os.'],
        ['Qu’est-ce qu’une onde électromagnétique ?', ['La propagation couplée d’un champ électrique et d’un champ magnétique', 'Une vibration de la matière', 'Un déplacement d’électrons dans un fil', 'Une onde de pression'], 0, 'Deux champs couplés qui se propagent sans support : c’est pourquoi la lumière traverse le vide.'],
        ['Quand la température d’un corps chaud augmente, où se déplace le maximum de son spectre continu ?', ['Vers le rouge', 'Vers le bleu', 'Il ne bouge pas', 'Vers les ondes radio'], 1, 'Plus un corps est chaud, plus son maximum d’émission se décale vers les courtes longueurs d’onde, donc vers le bleu.'],
        ['Où se placent les raies noires du spectre d’absorption d’un gaz ?', ['À des positions choisies au hasard', 'Uniquement dans l’infrarouge', 'Exactement là où ce même gaz émettrait ses raies', 'Toujours au milieu du spectre visible'], 2, 'Absorption et émission se font aux mêmes longueurs d’onde : c’est la signature de l’élément.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les photons et l’interaction matière-lumière',
      questions: [
        ['Quelle est la valeur de la constante de Planck h ?', ['1,60 × 10⁻¹⁹ J·s', '3,00 × 10⁸ J·s', '6,63 × 10⁻³⁴ J·s', '6,02 × 10²³ J·s'], 2, 'h ≈ 6,63 × 10⁻³⁴ J·s : elle relie l’énergie d’un photon à sa fréquence, E = h × f.'],
        ['Si la longueur d’onde d’une lumière double, que devient l’énergie de ses photons ?', ['Elle double', 'Elle est divisée par deux', 'Elle quadruple', 'Elle ne change pas'], 1, 'E = h × c / λ : l’énergie est inversement proportionnelle à la longueur d’onde.'],
        ['Un atome passe d’un niveau à −3,4 eV au niveau −13,6 eV. Quelle est l’énergie du photon émis ?', ['17,0 eV', '3,4 eV', '13,6 eV', '10,2 eV'], 3, 'E(photon) = E(haut) − E(bas) = −3,4 − (−13,6) = 10,2 eV.'],
        ['Sur quel phénomène repose le laser ?', ['Une émission provoquée entre deux niveaux d’énergie', 'Un spectre continu de corps chaud', 'L’absorption d’un photon par un métal', 'La réfraction de la lumière'], 0, 'L’émission provoquée donne une lumière monochromatique et très directive.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Vergence, image, grandissement et relation de conjugaison',
      questions: [
        ['Une lentille de distance focale f’ = 0,10 m donne d’un objet placé à OA = −0,30 m une image. Où est-elle ?', ['OA’ = 0,15 m', 'OA’ = 0,30 m', 'OA’ = 0,075 m', 'OA’ = −0,15 m'], 0, '1 / OA’ = 1 / f’ + 1 / OA = 10 − 3,33 ≈ 6,67, donc OA’ ≈ 0,15 m : une image réelle, de l’autre côté de la lentille.'],
        ['Le grandissement vaut γ = −0,5. Comment est l’image ?', ['Droite et deux fois plus grande', 'Renversée et deux fois plus petite', 'Renversée et deux fois plus grande', 'Droite et deux fois plus petite'], 1, 'Le signe moins indique une image renversée ; une valeur absolue de 0,5 signifie qu’elle est deux fois plus petite.'],
        ['Que devient un rayon passant par le foyer objet F ?', ['Il passe par F’', 'Il n’est pas dévié', 'Il est réfléchi', 'Il ressort parallèle à l’axe optique'], 3, 'C’est le « retour » du rayon parallèle à l’axe : ce qui arrive par F ressort parallèle à l’axe.'],
        ['Quel instrument utilise une image virtuelle, droite et agrandie ?', ['L’appareil photo', 'L’œil', 'La loupe', 'Le projecteur de diapositives'], 2, 'L’objet est placé entre O et F : on voit à travers la lentille une image droite et agrandie. L’œil et l’appareil photo forment des images réelles.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Couleurs',
      questions: [
        ['Quelle est la couleur complémentaire du vert ?', ['Le cyan', 'Le magenta', 'Le jaune', 'Le rouge'], 1, 'Vert et magenta (rouge + bleu) superposés donnent du blanc en synthèse additive.'],
        ['De quelle couleur apparaît une feuille blanche éclairée en lumière rouge ?', ['Rouge', 'Blanche', 'Noire', 'Cyan'], 0, 'Un objet blanc diffuse toutes les lumières qu’il reçoit : il ne reçoit que du rouge, il renvoie du rouge.'],
        ['Qu’est-ce qui détermine la couleur d’un objet transparent ?', ['La lumière qu’il diffuse', 'La lumière qu’il absorbe', 'La lumière qu’il transmet', 'Sa température'], 2, 'Un vitrail ou un filtre a la couleur de la lumière qui le traverse ; il absorbe le reste.'],
        ['D’où vient le daltonisme ?', ['D’une absence de bâtonnets', 'D’un cristallin opaque', 'D’un excès de lumière', 'D’une déficience d’un type de cônes'], 3, 'Les trois types de cônes sont sensibles au rouge, au vert et au bleu ; s’il en manque un, certaines couleurs se confondent.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’énergie mécanique : énergies cinétique et potentielle',
      questions: [
        ['Quelle est l’énergie cinétique d’un objet de 2,0 kg lancé à 3,0 m/s ?', ['6,0 J', '3,0 J', '18 J', '9,0 J'], 3, 'Ec = ½ × m × v² = ½ × 2,0 × 3,0² = 9,0 J. Attention au carré de la vitesse.'],
        ['Quelle est l’énergie potentielle de pesanteur d’un objet de 10 kg à 5,0 m d’altitude, avec g = 10 N/kg ?', ['50 J', '500 J', '5 000 J', '2,0 J'], 1, 'Epp = m × g × z = 10 × 10 × 5,0 = 500 J, en prenant le sol comme origine des altitudes.'],
        ['Une force de 10 N déplace un objet de 5,0 m en faisant un angle de 60° avec le déplacement. Quel est son travail ?', ['25 J', '50 J', '0 J', '43 J'], 0, 'W = F × d × cos α = 10 × 5,0 × 0,5 = 25 J.'],
        ['Quand des frottements interviennent, à quoi est égale la variation d’énergie mécanique ?', ['À zéro', 'Au travail du poids', 'Au travail des frottements, qui est négatif', 'À l’énergie cinétique finale'], 2, 'Les frottements font diminuer l’énergie mécanique : ΔEm égale leur travail, négatif.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’énergie électrique',
      questions: [
        ['Une lampe de 60 W reste allumée 2 heures. Quelle énergie consomme-t-elle ?', ['120 kWh', '0,12 kWh', '30 kWh', '1,2 kWh'], 1, 'E = P × Δt = 60 W × 2 h = 120 Wh = 0,12 kWh.'],
        ['Un générateur de force électromotrice E = 12 V et de résistance interne r = 2,0 Ω débite 1,0 A. Quelle tension délivre-t-il ?', ['14 V', '12 V', '10 V', '6,0 V'], 2, 'U = E − r × I = 12 − 2,0 × 1,0 = 10 V : la résistance interne fait chuter la tension.'],
        ['Un moteur reçoit 100 J et en restitue 80 J sous forme mécanique. Quel est son rendement ?', ['1,25', '20 %', '80 J', '0,80'], 3, 'η = E(utile) / E(reçue) = 80 / 100 = 0,80, soit 80 % ; les 20 J restants sont dissipés.'],
        ['Quel est le rendement lumineux approximatif d’une lampe à incandescence ?', ['Moins de 5 %', 'Environ 50 %', 'Plus de 90 %', 'Exactement 100 %'], 0, 'Presque toute l’énergie part en chaleur par effet Joule ; une LED fait bien mieux, largement plus de 30 %.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'La mole et ses formules',
      questions: [
        ['Quelle est la masse molaire du dioxyde de carbone CO₂ (C = 12,0 g/mol ; O = 16,0 g/mol) ?', ['28,0 g/mol', '44,0 g/mol', '32,0 g/mol', '40,0 g/mol'], 1, 'On additionne tous les atomes : 12,0 + 2 × 16,0 = 44,0 g/mol.'],
        ['Quelle quantité de matière représentent 48 L de gaz, avec un volume molaire de 24 L/mol ?', ['0,50 mol', '24 mol', '1 152 mol', '2,0 mol'], 3, 'n = V / V(m) = 48 / 24 = 2,0 mol, quel que soit le gaz.'],
        ['Avec quelle verrerie prélève-t-on la solution mère lors d’une dilution ?', ['Une éprouvette graduée', 'Un bécher', 'Une pipette jaugée', 'Une burette graduée'], 2, 'La pipette jaugée est précise ; on verse ensuite dans une fiole jaugée qu’on complète au trait de jauge.'],
        ['Comment se calcule le facteur de dilution ?', ['C(mère) / C(fille)', 'C(fille) / C(mère)', 'V(prélevé) / V(fille)', 'C(mère) × V(fille)'], 0, 'Il est supérieur à 1 : c’est aussi V(fille) / V(prélevé), puisque la quantité de soluté ne change pas.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Absorbance et spectre d’absorption',
      questions: [
        ['Autour de quelle longueur d’onde une solution bleue absorbe-t-elle le plus ?', ['450 nm', '600 nm', '800 nm', '300 nm'], 1, 'Elle absorbe la couleur complémentaire du bleu, le jaune-orangé, vers 600 nm.'],
        ['Une solution à 2,0 mmol/L a une absorbance de 0,40. Une autre, de la même espèce, mesurée dans les mêmes conditions, a une absorbance de 0,60. Quelle est sa concentration ?', ['1,5 mmol/L', '4,0 mmol/L', '3,0 mmol/L', '0,60 mmol/L'], 2, 'A = k × C : l’absorbance est multipliée par 1,5, la concentration aussi, soit 3,0 mmol/L.'],
        ['De quoi dépend le coefficient k de la loi de Beer-Lambert ?', ['De la concentration de la solution', 'Du volume de solution dans la cuve', 'De la couleur du bécher', 'De l’espèce, de la longueur d’onde et de la longueur de cuve traversée'], 3, 'k ne dépend pas de la concentration : c’est ce qui rend l’absorbance proportionnelle à C.'],
        ['Pourquoi mesure-t-on à λ(max) ?', ['Parce que la variation d’absorbance y est la plus forte', 'Parce que l’absorbance y est nulle', 'Pour éviter de faire le blanc', 'Parce que la loi de Beer-Lambert n’y est plus valable'], 0, 'À λ(max), la mesure est la plus sensible, et un petit écart de réglage change peu le résultat.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Modélisation de l’évolution d’une réaction chimique',
      questions: [
        ['Pour 2 H₂ + O₂ → 2 H₂O, on part de 3,0 mol de H₂ et 2,0 mol de O₂. Que vaut x(max) ?', ['2,0 mol', '3,0 mol', '1,5 mol', '1,0 mol'], 2, 'Rapports : 3,0 / 2 = 1,5 pour H₂ et 2,0 / 1 = 2,0 pour O₂. Le plus petit, 1,5 mol, donne x(max) et désigne H₂ comme limitant.'],
        ['Pour N₂ + 3 H₂ → 2 NH₃, on part de 2,0 mol de N₂ et 3,0 mol de H₂. Quel est le réactif limitant ?', ['N₂', 'H₂', 'Aucun : le mélange est stœchiométrique', 'NH₃'], 1, 'Rapports : 2,0 / 1 = 2,0 pour N₂ et 3,0 / 3 = 1,0 pour H₂. H₂ est limitant, bien qu’il soit le plus abondant.'],
        ['Un réactif de coefficient 2 est introduit à 5,0 mol. Combien en reste-t-il pour un avancement x = 1,5 mol ?', ['3,5 mol', '6,5 mol', '0,50 mol', '2,0 mol'], 3, 'n = n(initial) − coefficient × x = 5,0 − 2 × 1,5 = 2,0 mol.'],
        ['On obtient 0,50 mol d’eau (M = 18 g/mol). Quelle masse cela représente-t-il ?', ['9,0 g', '36 g', '18,5 g', '0,028 g'], 0, 'm = n × M = 0,50 × 18 = 9,0 g.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Dosage par titrage',
      questions: [
        ['Où se trouve le réactif titrant ?', ['Dans le bécher', 'Dans la burette graduée', 'Dans la fiole jaugée', 'Dans la pipette jaugée'], 1, 'Le titrant, de concentration connue, est versé progressivement à la burette ; le titré est dans le bécher.'],
        ['Avant l’équivalence, quel est le réactif limitant ?', ['Le titrant', 'Le titré', 'Aucun', 'L’eau distillée'], 0, 'Tant qu’il reste du titré dans le bécher, chaque goutte de titrant versée est entièrement consommée.'],
        ['On titre 20,0 mL d’une solution par un titrant à 0,10 mol/L (réaction 1-1). L’équivalence est à 12,0 mL. Quelle est la concentration du titré ?', ['0,17 mol/L', '0,24 mol/L', '0,0060 mol/L', '0,060 mol/L'], 3, 'C(titré) = C(titrant) × V(éq) / V(titré) = 0,10 × 12,0 / 20,0 = 0,060 mol/L.'],
        ['Dans un titrage colorimétrique, où repère-t-on l’équivalence ?', ['À la première goutte versée', 'Quand la burette est à moitié vide', 'Au premier changement de couleur persistant', 'Quand la solution devient incolore puis recolorée plusieurs fois'], 2, 'L’indicateur coloré, ou la décoloration du permanganate, signale l’équivalence par un changement qui persiste.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Représentation de Lewis d’un atome et d’une molécule',
      questions: [
        ['Combien d’électrons de valence possède le chlore, dans la colonne 17 ?', ['17', '5', '1', '7'], 3, 'On retranche 10 au numéro de colonne pour les colonnes 13 à 18 : 17 − 10 = 7.'],
        ['Quelle est la géométrie autour d’un atome entouré de quatre doublets ?', ['Linéaire', 'Triangulaire plane', 'Tétraédrique', 'Carrée'], 2, 'Les quatre doublets se repoussent et s’écartent au maximum : ils pointent vers les sommets d’un tétraèdre.'],
        ['Quelle est la première étape pour établir un schéma de Lewis ?', ['Compter le total des électrons de valence de tous les atomes', 'Placer les doublets non liants', 'Former les liaisons doubles', 'Dessiner la géométrie de la molécule'], 0, 'On compte d’abord tous les électrons de valence (en ajoutant ou retranchant pour un ion), puis on place les liaisons simples.'],
        ['Combien de doublets non liants porte l’atome d’azote dans l’ammoniac NH₃ ?', ['Aucun', 'Un', 'Deux', 'Trois'], 1, 'L’azote a 5 électrons de valence : 3 dans les liaisons avec H, et 2 formant un doublet non liant.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Électronégativité des atomes et polarité des molécules',
      questions: [
        ['Comment varie l’électronégativité de haut en bas dans une colonne ?', ['Elle augmente', 'Elle diminue', 'Elle reste constante', 'Elle double à chaque ligne'], 1, 'Elle augmente de gauche à droite et diminue de haut en bas : le fluor, en haut à droite, est le plus électronégatif.'],
        ['Dans une liaison O–H de l’eau, quel atome porte la charge partielle δ− ?', ['L’hydrogène', 'Aucun des deux', 'L’oxygène', 'Les deux à la fois'], 2, 'L’oxygène, plus électronégatif, attire le doublet de la liaison : il porte δ−, l’hydrogène δ+.'],
        ['Quels éléments sont peu électronégatifs ?', ['Les halogènes', 'Les métaux', 'L’oxygène et l’azote', 'Le fluor et le chlore'], 1, 'Les métaux, à gauche du tableau, attirent peu les électrons ; ils ont plutôt tendance à en céder.'],
        ['À quelle condition une molécule est-elle polaire ?', ['Il suffit qu’elle contienne de l’oxygène', 'Il suffit qu’elle soit linéaire', 'Il suffit que ses atomes soient identiques', 'Ses liaisons sont polarisées et les charges partielles ne se compensent pas'], 3, 'Il faut les deux : c’est pourquoi CO₂, aux liaisons polarisées mais linéaire et symétrique, est apolaire.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Cohésion de la matière',
      questions: [
        ['Comment se comparent les interactions faibles et les liaisons covalentes ?', ['Elles sont dix à cent fois moins énergétiques', 'Elles ont la même énergie', 'Elles sont dix à cent fois plus énergétiques', 'Elles sont un million de fois plus énergétiques'], 0, 'C’est pourquoi un changement d’état se fait à bien plus basse température qu’une réaction chimique.'],
        ['Qu’est-ce qu’une liaison ionique ?', ['Un doublet partagé entre deux atomes', 'Une liaison hydrogène entre deux molécules', 'Une interaction de Van der Waals', 'L’attraction entre des ions de charges opposées'], 3, 'Elle forme un solide ionique, empilement régulier d’ions, électriquement neutre dans son ensemble.'],
        ['Quelle est la dernière étape de la dissolution d’un solide ionique ?', ['La dissociation', 'La solvatation', 'La dispersion', 'La cristallisation'], 2, 'Dissociation des ions, solvatation par les molécules d’eau, puis dispersion des ions solvatés dans le solvant.'],
        ['Pourquoi l’eau dissout-elle bien les solides ioniques ?', ['Parce qu’elle est liquide', 'Parce qu’elle est polaire', 'Parce qu’elle est linéaire', 'Parce qu’elle contient des ions'], 1, 'Ses molécules orientent leur pôle opposé vers chaque ion : c’est la solvatation, possible grâce à sa polarité.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Solubilité et extraction par solvant',
      questions: [
        ['Qu’est-ce que la solubilité d’une espèce ?', ['La masse maximale qu’on peut dissoudre dans un litre de solvant, à une température donnée', 'La vitesse à laquelle elle se dissout', 'Sa masse volumique', 'La masse de solvant nécessaire pour la dissoudre'], 0, 'Au-delà de cette masse, l’espèce ne se dissout plus : la solution est saturée.'],
        ['Comment évolue la solubilité d’un solide quand la température monte ?', ['Elle diminue toujours', 'Elle augmente presque toujours', 'Elle ne change pas', 'Elle devient nulle'], 1, 'C’est l’inverse pour un gaz, dont la solubilité diminue quand on chauffe.'],
        ['On extrait une espèce de l’eau avec du dichlorométhane (1,33 g/mL). Où se trouve la phase organique ?', ['Au-dessus de l’eau', 'Mélangée à l’eau', 'En dessous de l’eau', 'Elle s’évapore pendant l’agitation'], 2, 'Le dichlorométhane est plus dense que l’eau : la phase organique est en bas. Avec l’éther (0,71 g/mL), elle serait en haut.'],
        ['Comment récupère-t-on l’espèce extraite une fois les phases séparées ?', ['Par filtration', 'Par décantation', 'Par titrage', 'Par évaporation du solvant extracteur'], 3, 'On élimine le solvant extracteur par évaporation : il ne reste que l’espèce extraite.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les différentes représentations des molécules et leur nomenclature',
      questions: [
        ['Quelle est la formule brute du butane ?', ['C₄H₈', 'C₄H₁₀', 'CH₄', 'C₅H₁₂'], 1, 'Le butane est un alcane à 4 carbones : C₄H₁₀. C₄H₈ serait un alcène.'],
        ['Quelle famille porte la terminaison -al ?', ['Les alcools', 'Les cétones', 'Les aldéhydes', 'Les alcanes'], 2, 'Aldéhyde : -al ; cétone : -one ; alcool : -ol ; alcane : -ane.'],
        ['Dans une formule semi-développée, qu’est-ce qui n’est pas dessiné ?', ['Les liaisons avec les atomes d’hydrogène', 'Les atomes de carbone', 'Les doubles liaisons', 'Les atomes d’oxygène'], 0, 'On écrit par exemple CH₃−CH₂−CH₂−CH₃ : les liaisons C–H sont sous-entendues.'],
        ['Combien d’atomes de carbone compte la chaîne principale de l’hexan-1-ol ?', ['Cinq', 'Quatre', 'Sept', 'Six'], 3, 'Le préfixe hex- signifie six carbones ; la terminaison -ol indique un alcool, sur le carbone 1.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Synthèse organique',
      questions: [
        ['Quand isole-t-on le produit par filtration sur Büchner ?', ['Quand le produit est solide', 'Quand le produit est un gaz', 'Quand il est dissous dans l’eau', 'Quand deux liquides sont miscibles'], 0, 'La filtration sous vide sur Büchner sépare rapidement un solide du liquide qui l’entoure.'],
        ['Lors d’une recristallisation, où restent les impuretés ?', ['Dans les cristaux formés', 'Dans la solution, car elles y sont plus solubles', 'Dans le réfrigérant', 'Dans la pierre ponce'], 1, 'On dissout à chaud puis on refroidit lentement : le produit cristallise, les impuretés plus solubles restent dissoutes.'],
        ['Que révèle la RMN d’un produit de synthèse ?', ['Ses groupes fonctionnels', 'Sa couleur', 'Son squelette carboné', 'Sa masse'], 2, 'L’infrarouge révèle les groupes fonctionnels ; la RMN renseigne sur le squelette carboné.'],
        ['On obtient 0,30 mol de produit pour 0,40 mol attendues au maximum. Quel est le rendement ?', ['133 %', '30 %', '40 %', '75 %'], 3, 'η = n(obtenu) / n(théorique) = 0,30 / 0,40 = 0,75, soit 75 %.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les réactions de combustion',
      questions: [
        ['Dans l’équation C₃H₈ + … O₂ → 3 CO₂ + 4 H₂O, quel coefficient faut-il devant O₂ ?', ['3', '4', '5', '7'], 2, 'À droite : 3 × 2 + 4 × 1 = 10 atomes d’oxygène, donc 5 O₂. On ajuste l’oxygène en dernier.'],
        ['Pourquoi le monoxyde de carbone est-il mortel ?', ['Il se fixe sur l’hémoglobine à la place du dioxygène', 'Il brûle les voies respiratoires', 'Il acidifie le sang', 'Il est plus dense que l’air et chasse l’oxygène de la pièce'], 0, 'Inodore et incolore, il empêche le sang de transporter le dioxygène : première cause d’intoxication domestique liée au chauffage.'],
        ['Quelle énergie libère la combustion complète de 2,0 kg de bois, de pouvoir calorifique 15 MJ/kg ?', ['7,5 MJ', '17 MJ', '13 MJ', '30 MJ'], 3, 'E = m × pouvoir calorifique = 2,0 × 15 = 30 MJ.'],
        ['Pour une réaction exothermique, quel est le signe du bilan calculé par les énergies de liaison ?', ['Positif', 'Nul', 'Négatif', 'Il dépend du combustible'], 2, 'Former les liaisons des produits libère plus d’énergie que rompre celles des réactifs n’en coûte : le bilan est négatif.'],
      ],
    },
  ],
}
