export default {
  slug: 'svt',
  titreMigration: 'QUESTIONS EN PLUS — SVT 1re',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '1re',
      titre: 'La division cellulaire chez les eucaryotes',
      questions: [
        ['Quelles phases du cycle cellulaire forment l’interphase ?', ['Prophase, métaphase, anaphase', 'G1, S et G2', 'Méiose I et méiose II', 'Télophase et cytodiérèse'], 1, 'L’interphase regroupe la croissance (G1), la réplication (S) et la préparation à la division (G2) ; la mitose vient ensuite.'],
        ['Pendant quelle phase de la mitose les chromosomes s’alignent-ils à l’équateur de la cellule ?', ['La prophase', 'La télophase', 'L’anaphase', 'La métaphase'], 3, 'En métaphase, les chromosomes condensés forment la plaque équatoriale, juste avant que leurs chromatides se séparent.'],
        ['Combien de combinaisons le seul brassage interchromosomique offre-t-il chez l’humain ?', ['2 puissance 23, soit plus de 8 millions', '23', '46', '2 × 23, soit 46'], 0, 'Chacune des 23 paires d’homologues se répartit au hasard : 2 puissance 23 combinaisons, avant même le crossing-over et la fécondation.'],
        ['Quel est le rôle des points de contrôle du cycle cellulaire ?', ['Accélérer la réplication de l’ADN', 'Déclencher la méiose', 'Vérifier l’intégrité de l’ADN et l’attachement des chromosomes', 'Fusionner les deux noyaux fils'], 2, 'Ces vérifications empêchent une cellule endommagée de se diviser ; leur défaillance est l’un des mécanismes de la cancérisation.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'La réplication de l’ADN',
      questions: [
        ['Quelle expérience a confirmé en 1958 le modèle semi-conservatif ?', ['Celle de Meselson et Stahl', 'Celle de Watson et Crick', 'Celle de Mendel', 'Celle de Pasteur'], 0, 'Meselson et Stahl ont écarté les hypothèses conservative et dispersive : chaque molécule fille garde un brin parental.'],
        ['Que prévoyait l’hypothèse conservative, écartée ensuite ?', ['Des fragments anciens et neufs mêlés sur chaque brin', 'Un brin ancien et un brin neuf par molécule', 'Une molécule intacte et une molécule entièrement neuve', 'La destruction de la molécule parentale'], 2, 'Le modèle conservatif gardait la molécule parentale entière ; l’expérience a montré qu’il était faux.'],
        ['Pourquoi un des deux brins est-il copié par fragments ?', ['Parce que l’hélicase le coupe', 'Parce que l’ADN polymérase ne synthétise que dans un seul sens', 'Parce que ce brin contient des introns', 'Parce que ce brin est plus court'], 1, 'La synthèse est orientée : sur l’un des brins la polymérase avance avec la fourche, sur l’autre elle doit repartir par fragments.'],
        ['Quel est l’ordre de grandeur des erreurs qui subsistent après la réplication et les réparations ?', ['Une erreur par dizaine de nucléotides', 'Une erreur par millier de nucléotides', 'Aucune erreur', 'Une erreur par milliard de nucléotides'], 3, 'Grâce à la correction par la polymérase et aux systèmes de réparation, il ne reste qu’environ une erreur par milliard : ce sont les mutations.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’expression du patrimoine génétique',
      questions: [
        ['Quelle enzyme réalise la transcription ?', ['L’ADN polymérase', 'L’ADN hélicase', 'L’ARN polymérase', 'La ligase'], 2, 'L’ARN polymérase copie le brin transcrit du gène en ARN pré-messager, dans le noyau.'],
        ['Que signifie « le code génétique est universel » ?', ['Il est le même chez presque tous les êtres vivants', 'Chaque codon code tous les acides aminés', 'Tous les gènes codent une protéine', 'Il ne change jamais par mutation'], 0, 'Cette universalité rend possible le génie génétique : un gène humain peut être traduit par une bactérie.'],
        ['Combien de codons le code génétique compte-t-il pour 20 acides aminés ?', ['20', '32', '61', '64'], 3, 'Il existe 64 codons (4 × 4 × 4) pour 20 acides aminés : d’où des codons synonymes, c’est la redondance.'],
        ['Qu’est-ce qui arrête la traduction ?', ['La fin de l’ARN de transfert', 'Un codon stop', 'Un intron', 'Le premier codon de l’ARN messager'], 1, 'Le ribosome allonge la chaîne d’acides aminés jusqu’à rencontrer un codon stop, qui ne code aucun acide aminé.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les mutations de l’ADN et la variabilité génétique',
      questions: [
        ['Qu’est-ce qu’une mutation faux-sens ?', ['Une mutation qui remplace un acide aminé par un autre', 'Une mutation qui fait apparaître un codon stop', 'Une mutation qui donne un codon synonyme', 'Une mutation qui supprime le gène entier'], 0, 'La protéine obtenue peut rester fonctionnelle, devenir moins efficace ou être inactive selon l’acide aminé touché.'],
        ['Quelle délétion ne décale pas le cadre de lecture ?', ['La délétion d’un nucléotide', 'La délétion de deux nucléotides', 'La délétion de trois nucléotides', 'Toute délétion décale le cadre'], 2, 'Une délétion d’un multiple de trois retire des codons entiers : le cadre de lecture est conservé en aval.'],
        ['Pourquoi seules les mutations germinales comptent-elles pour l’évolution des espèces ?', ['Parce qu’elles sont plus fréquentes', 'Parce qu’elles sont transmises à la descendance', 'Parce qu’elles sont toujours avantageuses', 'Parce qu’elles touchent tous les organes'], 1, 'Une mutation somatique disparaît avec l’individu ; seule une mutation de la lignée reproductrice passe à la génération suivante.'],
        ['Quel exemple montre qu’un allèle peut être avantageux selon l’environnement ?', ['La mucoviscidose dans les régions froides', 'L’hémophilie en altitude', 'Le daltonisme sous les tropiques', 'L’allèle de la drépanocytose, qui protège du paludisme'], 3, 'Là où le paludisme sévit, les porteurs de cet allèle sont mieux protégés : c’est l’environnement qui fait la valeur d’un allèle.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’histoire humaine lue dans les génomes',
      questions: [
        ['Que signifie le fait que deux populations partagent beaucoup de marqueurs génétiques ?', ['Elles ont divergé très tôt', 'Elles ont divergé récemment', 'Elles vivent sous le même climat', 'Elles n’ont jamais été séparées par une mer'], 1, 'Plus la séparation est récente, moins les mutations neutres ont eu le temps de s’accumuler différemment dans chaque lignée.'],
        ['Chez quelles populations trouve-t-on de l’ADN de Denisova ?', ['Chez toutes les populations africaines', 'Uniquement en Europe', 'Chez certaines populations d’Asie et d’Océanie', 'Chez aucune population actuelle'], 2, 'Ces métissages anciens ont laissé quelques pour cent d’ADN dénisovien dans certaines populations d’Asie et d’Océanie.'],
        ['Quelle adaptation génétique récente s’observe chez les Tibétains ?', ['Des variants facilitant la vie en haute altitude', 'La persistance de la lactase', 'Une résistance au froid polaire', 'Une peau plus claire'], 0, 'Des allèles favorisant la vie en altitude ont été sélectionnés dans cette population.'],
        ['Quel argument appuie l’origine africaine d’Homo sapiens ?', ['L’absence de fossiles hors d’Afrique', 'La présence d’ADN néandertalien en Afrique', 'La couleur de peau', 'La diversité génétique maximale en Afrique'], 3, 'La population la plus ancienne a eu le plus de temps pour accumuler des mutations : sa diversité est la plus grande.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le rôle des enzymes dans les réactions métaboliques',
      questions: [
        ['Qu’appelle-t-on métabolisme ?', ['L’ensemble des réactions chimiques d’une cellule', 'La seule digestion des aliments', 'La division des cellules', 'La synthèse des protéines uniquement'], 0, 'Presque toutes ces réactions seraient trop lentes à température corporelle sans les enzymes qui les catalysent.'],
        ['Comment appelle-t-on la zone de l’enzyme où se fixe le substrat ?', ['Le codon', 'Le site actif', 'Le plasmide', 'Le promoteur'], 1, 'Le site actif a une forme complémentaire du substrat : c’est l’origine de la spécificité de substrat.'],
        ['Quel modèle affine l’image « clé-serrure » de la fixation du substrat ?', ['Le modèle semi-conservatif', 'Le modèle de la sélection clonale', 'L’ajustement induit', 'L’équilibre isostatique'], 2, 'Dans l’ajustement induit, le site actif se déforme légèrement au contact du substrat pour l’enserrer.'],
        ['Quelle maladie résulte d’une enzyme déficiente qui interrompt la dégradation d’un acide aminé ?', ['La mucoviscidose', 'Le diabète de type 2', 'L’hémophilie', 'La phénylcétonurie'], 3, 'La phénylcétonurie montre le contrôle génétique du métabolisme : un gène muté, une enzyme inactive, une voie bloquée.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'La surface de la Terre, contrastes entre les continents et les océans',
      questions: [
        ['Quels éléments rendent la croûte océanique plus riche que la croûte continentale ?', ['Le fer et le magnésium', 'La silice et l’aluminium', 'Le calcium et le carbone', 'L’uranium et le thorium'], 0, 'La croûte océanique basaltique est riche en fer et magnésium ; la croûte continentale granitique, en silice et aluminium.'],
        ['Quelle est la densité moyenne de la croûte continentale ?', ['Environ 1', 'Environ 2,7', 'Environ 3,3', 'Environ 5,5'], 1, 'Environ 2,7 contre 2,9 pour la croûte océanique : plus légère, la croûte continentale flotte plus haut.'],
        ['Pourquoi la croûte océanique est-elle toujours jeune ?', ['Parce qu’elle fond sous l’effet du Soleil', 'Parce que l’érosion la détruit', 'Parce qu’elle est renouvelée en permanence', 'Parce qu’elle s’est formée récemment sur toute la Terre'], 2, 'Elle naît aux dorsales et disparaît en subduction : elle ne dépasse pas 200 millions d’années, alors que les continents sont conservés.'],
        ['À quelle altitude se situe le maximum de la courbe hypsométrique correspondant aux fonds océaniques ?', ['Entre 0 et 1 000 m', 'Vers −11 000 m', 'Vers −200 m', 'Entre −4 000 et −5 000 m'], 3, 'Le second maximum, entre −4 000 et −5 000 m, correspond aux plaines abyssales ; le premier, entre 0 et 1 000 m, aux continents.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Sismologie et structure de la Terre',
      questions: [
        ['Quelle onde sismique est la plus rapide ?', ['L’onde S', 'L’onde P', 'Les deux vont à la même vitesse', 'Cela dépend uniquement de la magnitude'], 1, 'L’onde P, de compression, arrive la première ; l’onde S, de cisaillement, est plus lente.'],
        ['Que sépare la discontinuité de Lehmann ?', ['La croûte et le manteau', 'Le manteau et le noyau externe', 'La lithosphère et l’asthénosphère', 'Le noyau externe et la graine'], 3, 'Vers 5 100 km, elle sépare le noyau externe liquide de la graine solide.'],
        ['De quoi dépend la vitesse des ondes sismiques dans un milieu ?', ['De sa rigidité et de sa densité', 'De sa couleur', 'De sa température de surface seulement', 'De la distance à l’épicentre uniquement'], 0, 'Une variation brutale de vitesse trahit un changement de milieu : c’est ainsi qu’on repère les discontinuités.'],
        ['Quelle est l’épaisseur approximative de la lithosphère ?', ['Environ 7 km', 'Environ 2 900 km', 'Environ 100 km', 'Environ 700 km'], 2, 'La lithosphère rigide réunit la croûte et le sommet du manteau sur environ 100 km, au-dessus de l’asthénosphère ductile.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Mécanismes de transferts thermiques',
      questions: [
        ['Quelle part de la chaleur interne provient de la radioactivité naturelle ?', ['Environ 10 %', 'Environ 50 %', 'Environ 80 %', 'La totalité'], 2, 'Environ 80 % viennent de la désintégration de l’uranium, du thorium et du potassium 40 ; le reste est une chaleur résiduelle.'],
        ['Pourquoi la conduction est-elle un mode de transfert peu efficace dans la lithosphère ?', ['Parce que la roche est un mauvais conducteur de la chaleur', 'Parce que la lithosphère est liquide', 'Parce qu’elle déplace trop de matière', 'Parce qu’elle ne fonctionne que la nuit'], 0, 'Transmise de proche en proche sans déplacement de matière, la chaleur traverse lentement la roche.'],
        ['Comment le manteau peut-il convecter alors qu’il est solide ?', ['Il fond chaque hiver', 'Il est gazeux en profondeur', 'Il se brise en blocs qui tombent', 'Il flue comme un solide ductile, à quelques centimètres par an'], 3, 'À haute température et sur des millions d’années, la roche solide se déforme lentement : c’est ce fluage qui permet la convection.'],
        ['Qu’est-ce que le flux géothermique ?', ['La vitesse de déplacement des plaques', 'La puissance thermique évacuée par unité de surface', 'La température au centre de la Terre', 'La quantité de magma émise par an'], 1, 'Élevé aux dorsales et faible sur les vieux boucliers, il dessine à lui seul les frontières de plaques.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'La tectonique des plaques, caractérisation de la mobilité horizontale',
      questions: [
        ['Quels fossiles Wegener a-t-il retrouvés sur des continents aujourd’hui séparés ?', ['Mesosaurus et Glossopteris', 'Des ammonites et des trilobites', 'Des dinosaures et des mammouths', 'Des coraux et des éponges'], 0, 'La présence de ce reptile d’eau douce et de cette fougère de part et d’autre de l’Atlantique suggérait des continents autrefois réunis.'],
        ['Qu’enregistrent les bandes d’anomalies magnétiques du plancher océanique ?', ['Les séismes passés', 'Les variations du niveau de la mer', 'Les inversions successives du champ magnétique terrestre', 'Les éruptions des points chauds'], 2, 'En refroidissant, le basalte fige l’orientation du champ de son époque ; Vine et Matthews ont montré leur symétrie en 1963.'],
        ['Dans la chaîne d’Hawaï, comment varie l’âge des volcans ?', ['Il est identique pour tous', 'Il croît en s’éloignant du point chaud actif', 'Il diminue en s’éloignant du point chaud', 'Il varie au hasard'], 1, 'La plaque défile au-dessus d’un point chaud fixe : les volcans les plus éloignés sont les plus anciens.'],
        ['Qu’a apporté le GPS à partir des années 1990 ?', ['La découverte des dorsales', 'La preuve de la dérive par les fossiles', 'La datation des sédiments', 'Une mesure directe des déplacements, cohérente avec les anomalies magnétiques'], 3, 'Les quelques centimètres par an mesurés en temps réel concordent avec les vitesses déduites des anomalies : la discussion est close.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les zones de divergence entre les plaques lithosphériques',
      questions: [
        ['Quelle est la longueur approximative du réseau des dorsales océaniques ?', ['600 km', '6 000 km', '60 000 km', '600 000 km'], 2, 'Cette chaîne sous-marine de 60 000 km fait le tour du globe : c’est là que naît la croûte océanique.'],
        ['Quelle structure présente un basalte refroidi brutalement au contact de l’eau ?', ['Une structure microlitique', 'Une structure grenue', 'Une structure feuilletée', 'Une structure cristalline entière'], 0, 'Le refroidissement brutal ne laisse pas le temps aux cristaux de grandir : quelques microlites dans du verre.'],
        ['Quelle est la vitesse d’écartement d’une dorsale lente comme celle de l’Atlantique ?', ['Jusqu’à 15 cm par an', '2 à 3 cm par an', 'Quelques mètres par an', 'Quelques millimètres par siècle'], 1, 'La dorsale atlantique, lente, présente un rift axial profond ; les dorsales rapides du Pacifique est atteignent 15 cm par an.'],
        ['Comment la lithosphère océanique s’épaissit-elle en s’éloignant de la dorsale ?', ['Par dépôt de laves en surface', 'Par collision avec un continent', 'Par fusion de sa base', 'Par accrétion du manteau refroidi à sa base'], 3, 'En refroidissant, le manteau sous-jacent s’ajoute à la lithosphère : elle s’épaissit et devient plus dense.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les zones de subduction entre les plaques lithosphériques',
      questions: [
        ['Pourquoi la lithosphère continentale ne subduit-elle pas ?', ['Parce qu’elle est trop peu dense', 'Parce qu’elle est trop chaude', 'Parce qu’elle est liquide', 'Parce qu’elle est trop mince'], 0, 'Trop légère pour s’enfoncer dans l’asthénosphère, elle est conservée : d’où l’âge très ancien des continents.'],
        ['Jusqu’à quelle profondeur environ observe-t-on des foyers sismiques dans une subduction ?', ['30 km', '100 km', '2 900 km', '700 km'], 3, 'Le plan de Wadati-Benioff descend jusqu’à environ 700 km : c’est la preuve directe de la plongée de la plaque.'],
        ['Qu’est-ce qui libère l’eau de la croûte océanique plongeante ?', ['L’érosion', 'Des transformations métamorphiques', 'La fusion du noyau', 'L’évaporation en surface'], 1, 'En s’enfonçant, la croûte hydratée change de minéraux et relâche son eau dans le manteau sus-jacent.'],
        ['Quelles roches volcaniques se forment en surface dans une zone de subduction ?', ['Gabbros et péridotites', 'Basaltes en coussins', 'Andésites et rhyolites', 'Granites et gneiss'], 2, 'Le magma riche en silice donne andésites et rhyolites en surface, granodiorites en profondeur.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les zones de collision continentales (convergence)',
      questions: [
        ['Qu’est-ce qui déclenche la collision entre deux continents ?', ['L’apparition d’un point chaud', 'La disparition complète de la lithosphère océanique qui les séparait', 'L’ouverture d’un rift', 'La fonte d’une calotte glaciaire'], 1, 'Une fois l’océan entièrement subduit, aucun des deux blocs trop légers ne peut plonger : la croûte s’épaissit.'],
        ['Quels minéraux permettent de reconstituer le trajet pression-température d’une roche ?', ['Glaucophane, disthène, sillimanite, grenat', 'Quartz, calcite, sel gemme', 'Olivine seule', 'Argiles et gypse'], 0, 'Ces minéraux métamorphiques n’apparaissent que dans certaines conditions : ils racontent l’histoire de l’enfouissement.'],
        ['Quel est l’ordre des étapes du cycle de Wilson ?', ['Subduction, rift, collision, océanisation, érosion', 'Collision, rift, subduction, érosion, océanisation', 'Rift, océanisation, subduction, collision, érosion', 'Océanisation, rift, érosion, subduction, collision'], 2, 'Un océan s’ouvre, s’élargit, se referme par subduction, puis les continents entrent en collision avant que la chaîne soit érodée.'],
        ['Quelle chaîne est une chaîne ancienne aujourd’hui très usée ?', ['Les Alpes', 'L’Himalaya', 'Les Andes', 'Le Massif central'], 3, 'Le Massif central, comme les Appalaches, n’est plus qu’un relief usé ; Alpes et Himalaya s’élèvent encore.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les écosystèmes : des interactions dynamiques entre les êtres vivants et avec leur milieu',
      questions: [
        ['Comment appelle-t-on une interaction où l’un gagne et l’autre reste indifférent ?', ['Le commensalisme', 'Le parasitisme', 'Le mutualisme', 'La compétition'], 0, 'Les épiphytes, qui poussent sur un arbre sans lui nuire, en sont un exemple.'],
        ['Pourquoi les chaînes alimentaires comptent-elles rarement plus de quatre ou cinq maillons ?', ['Parce que les prédateurs se mangent entre eux', 'Parce que l’énergie se dégrade fortement à chaque niveau', 'Parce que la matière disparaît', 'Parce que les producteurs sont trop peu nombreux'], 1, 'Environ 10 % seulement de l’énergie passe au niveau suivant : très vite, il n’en reste plus assez pour un maillon de plus.'],
        ['Quelle interaction illustrent les nodosités à Rhizobium sur les racines des légumineuses ?', ['Le parasitisme', 'La prédation', 'Le commensalisme', 'Le mutualisme'], 3, 'La bactérie fixe l’azote de l’air pour la plante, qui lui fournit en échange des sucres : les deux y gagnent.'],
        ['Que se passe-t-il quand une perturbation dépasse le seuil de résilience d’un écosystème ?', ['Il retrouve toujours son état initial', 'Il devient plus productif', 'Il bascule vers un autre état', 'Il cesse de recevoir de l’énergie'], 2, 'La résilience n’est pas illimitée : au-delà d’un seuil, l’écosystème ne revient pas à son fonctionnement antérieur.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’humanité et les écosystèmes : les services écosystémiques et leur gestion',
      questions: [
        ['Le stockage du carbone par une forêt est un service…', ['d’approvisionnement', 'culturel', 'de régulation', 'de production industrielle'], 2, 'Comme la pollinisation ou l’épuration de l’eau, le stockage du carbone régule le fonctionnement du milieu.'],
        ['Quelle pression humaine regroupe la pêche excessive, la chasse et la coupe de bois ?', ['La surexploitation', 'La fragmentation des habitats', 'L’eutrophisation', 'Les espèces envahissantes'], 0, 'Prélever plus vite que la ressource ne se renouvelle l’épuise : c’est la surexploitation.'],
        ['En quoi le changement climatique menace-t-il la biodiversité ?', ['Il supprime la photosynthèse', 'Il déplace les aires de répartition plus vite que les espèces ne suivent', 'Il augmente la pollinisation', 'Il n’a aucun effet sur les espèces'], 1, 'Les conditions favorables se déplacent ; les espèces trop lentes à migrer se retrouvent hors de leur aire.'],
        ['Que désignent les « trames verte et bleue » ?', ['Des zones de pêche autorisée', 'Des cultures sans engrais', 'Des parcs urbains', 'Des corridors écologiques reliant les habitats'], 3, 'Ces réseaux relient les milieux naturels terrestres (verte) et aquatiques (bleue) pour que les espèces puissent circuler.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Mutations, patrimoine génétique et santé',
      questions: [
        ['Dans une maladie autosomique dominante, quelle proportion des enfants d’un parent atteint hétérozygote hérite de l’allèle muté ?', ['Aucun', 'La moitié', 'Le quart', 'Tous'], 1, 'Le parent transmet l’un de ses deux allèles au hasard : un enfant sur deux reçoit l’allèle muté, qui suffit à exprimer la maladie.'],
        ['Laquelle de ces maladies est liée à l’X ?', ['La mucoviscidose', 'La chorée de Huntington', 'L’hémophilie', 'La drépanocytose'], 2, 'L’hémophilie, comme le daltonisme et la myopathie de Duchenne, touche surtout les garçons, qui n’ont qu’un X.'],
        ['Quelle maladie est multifactorielle ?', ['Le diabète de type 2', 'La mucoviscidose', 'La chorée de Huntington', 'L’hémophilie'], 0, 'Plusieurs gènes de prédisposition et l’environnement (alimentation, activité) interviennent ; elle ne suit pas les lois de Mendel.'],
        ['En quoi consiste la thérapie génique ?', ['Supprimer le chromosome porteur de la mutation', 'Greffer un organe sain', 'Prescrire des antibiotiques ciblés', 'Apporter aux cellules une version fonctionnelle du gène'], 3, 'Elle compense le gène défectueux ; l’édition du génome par CRISPR-Cas9 vise, elle, à corriger directement la séquence.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Origine et mécanismes de la cancérisation',
      questions: [
        ['Quel est le rôle normal d’un gène suppresseur de tumeur ?', ['Stimuler la division cellulaire', 'Freiner la division, déclencher la réparation ou l’apoptose', 'Former les vaisseaux sanguins', 'Produire des anticorps'], 1, 'Sa mutation entraîne une perte de fonction : c’est le frein qui lâche.'],
        ['Quelle est la première étape de la cancérisation ?', ['Les métastases', 'La progression', 'La promotion', 'L’initiation'], 3, 'L’initiation est une première mutation ; suivent la promotion, la progression, puis les métastases.'],
        ['Que se transmet-il dans les formes familiales de cancer, comme avec BRCA1 ?', ['Une prédisposition', 'Le cancer lui-même', 'Une tumeur déjà formée', 'Une infection virale'], 0, 'L’allèle hérité augmente la probabilité de cancer ; il faudra encore d’autres mutations somatiques pour qu’il se déclare.'],
        ['Quelle mesure relève de la prévention primaire du cancer du col de l’utérus ?', ['La chimiothérapie', 'La radiothérapie', 'La vaccination contre le papillomavirus', 'L’immunothérapie'], 2, 'Le papillomavirus est un facteur de risque : s’en protéger par la vaccination prévient le cancer avant qu’il apparaisse.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Variation génétique des bactéries et résistance aux antibiotiques',
      questions: [
        ['Comment appelle-t-on la capture par une bactérie d’ADN libre présent dans le milieu ?', ['La conjugaison', 'La transduction', 'La transformation', 'La réplication'], 2, 'Avec la conjugaison et la transduction, c’est l’un des transferts de gènes qui accélèrent la diffusion des résistances.'],
        ['Pourquoi la sélection de bactéries résistantes s’observe-t-elle en quelques jours ?', ['Parce que les antibiotiques provoquent des mutations', 'Parce que leurs générations se succèdent en une vingtaine de minutes', 'Parce que les bactéries sont peu nombreuses', 'Parce qu’elles ne mutent jamais'], 1, 'Avec des populations immenses et des générations très courtes, la sélection naturelle agit à vue d’œil.'],
        ['Qu’est-ce que la phagothérapie ?', ['L’usage de virus bactériophages pour détruire des bactéries', 'La phagocytose par les macrophages', 'Un antibiotique à large spectre', 'Un vaccin antibactérien'], 0, 'Piste de recherche contre les bactéries résistantes, elle ne dispense pas du bon usage des antibiotiques.'],
        ['Où la transmission des souches résistantes est-elle particulièrement surveillée ?', ['Dans les écoles', 'Dans les forêts', 'En haute montagne', 'À l’hôpital'], 3, 'D’où l’isolement des patients porteurs et le lavage des mains, leviers d’hygiène contre la diffusion.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’immunité innée',
      questions: [
        ['Quelle cause explique le gonflement (œdème) lors d’une inflammation ?', ['La vasoconstriction', 'L’augmentation de la perméabilité des vaisseaux', 'La destruction des nerfs', 'La production d’anticorps'], 1, 'Le plasma sort des vaisseaux devenus plus perméables et s’accumule dans les tissus.'],
        ['Lequel de ces éléments n’est PAS une cellule sentinelle ?', ['Le macrophage', 'Le mastocyte', 'La cellule dendritique', 'Le plasmocyte'], 3, 'Le plasmocyte, producteur d’anticorps, appartient à l’immunité adaptative ; les sentinelles résident dans les tissus.'],
        ['Où la cellule dendritique présente-t-elle les fragments de l’intrus ?', ['Dans un ganglion lymphatique', 'Dans l’estomac', 'Dans la moelle épinière', 'Dans le foie'], 0, 'Devenue cellule présentatrice de l’antigène, elle y déclenche l’immunité adaptative.'],
        ['Quelle molécule fait partie des médiateurs de l’inflammation ?', ['L’hémoglobine', 'L’insuline', 'L’histamine', 'L’amylase'], 2, 'Histamine, prostaglandines et cytokines provoquent la vasodilatation et attirent les phagocytes.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'L’immunité adaptative',
      questions: [
        ['Quand le répertoire des récepteurs des lymphocytes est-il engendré ?', ['Après la rencontre avec l’antigène', 'Avant toute rencontre avec un antigène', 'Seulement après une vaccination', 'Pendant la réaction inflammatoire'], 1, 'Des milliards de spécificités existent déjà : l’antigène ne fait que sélectionner le clone qui le reconnaît.'],
        ['Contre quoi la voie humorale est-elle efficace ?', ['Les agents présents dans les liquides de l’organisme', 'Les virus à l’intérieur des cellules', 'Les cellules cancéreuses uniquement', 'Les mutations de l’ADN'], 0, 'Les anticorps circulent dans les liquides et n’entrent pas dans les cellules : les agents intracellulaires relèvent des LT8.'],
        ['Quelles molécules le lymphocyte T auxiliaire sécrète-t-il pour amplifier la réponse ?', ['Des anticorps', 'Des enzymes digestives', 'Des histamines', 'Des interleukines'], 3, 'Les interleukines stimulent la prolifération et la différenciation des lymphocytes B et T cytotoxiques.'],
        ['Combien de temps faut-il à l’immunité adaptative pour se mettre en place lors d’un premier contact ?', ['Quelques secondes', 'Quelques minutes', 'Plusieurs jours', 'Plusieurs années'], 2, 'Sélection, prolifération et différenciation des clones prennent plusieurs jours, contre une réponse immédiate pour l’innée.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'La vaccination et l’immunothérapie',
      questions: [
        ['Pourquoi le seuil d’immunité collective est-il très élevé pour la rougeole ?', ['Parce que le vaccin est peu efficace', 'Parce que la maladie est très contagieuse', 'Parce que la maladie est bénigne', 'Parce qu’elle ne touche que les adultes'], 1, 'Plus une maladie est contagieuse, plus il faut de personnes immunisées pour rompre la chaîne de transmission.'],
        ['Qu’injecte-t-on lors d’une vaccination ?', ['Des anticorps déjà formés', 'Des lymphocytes mémoire', 'Un antigène inoffensif', 'Des antibiotiques'], 2, 'Agent inactivé, atténué, fragment protéique ou ARN messager : le système immunitaire travaille et construit sa mémoire.'],
        ['En quoi consiste la thérapie cellulaire CAR-T ?', ['Modifier en laboratoire les lymphocytes du patient, puis les réinjecter', 'Injecter des anticorps de cheval', 'Greffer de la moelle osseuse d’un donneur', 'Vacciner contre une tumeur'], 0, 'Les lymphocytes T du patient reçoivent un récepteur qui leur fait reconnaître la tumeur.'],
        ['À quoi sont destinés les anticorps monoclonaux en immunothérapie antitumorale ?', ['À remplacer les globules rouges', 'À stimuler la cicatrisation', 'À bloquer la réplication de l’ADN viral', 'À se fixer sur une cible de la tumeur'], 3, 'Produits en laboratoire, tous identiques, ils sont dirigés contre une molécule précise des cellules tumorales.'],
      ],
    },
  ],
}
