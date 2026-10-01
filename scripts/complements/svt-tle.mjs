export default {
  slug: 'svt',
  titreMigration: 'QUESTIONS EN PLUS — SVT Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'La conservation des génomes : stabilité génétique et évolution clonale',
      questions: [
        ["Quelle enzyme assemble le nouveau brin d’ADN lors de la réplication ?", ["L’ARN polymérase", "La ligase seule", "L’ADN polymérase", "L’hélicase"], 2, "L’ADN polymérase place en face de chaque nucléotide du brin matrice son complémentaire : A face à T, G face à C."],
        ["Un brin matrice porte la séquence ATGC. Quelle séquence porte le brin neuf formé en face ?", ["TACG", "ATGC", "UACG", "GCAT"], 0, "La complémentarité impose A-T et G-C : face à ATGC, la polymérase place TACG (l’uracile n’existe que dans l’ARN)."],
        ["Quel est l’ordre de grandeur du taux d’erreur de l’ADN polymérase seule, AVANT relecture ?", ["1 sur 10", "1 sur 10¹²", "1 sur 10⁹", "1 sur 10⁵"], 3, "Seule, la polymérase se trompe environ une fois sur 10⁵ ; relecture et réparation ramènent ce taux vers 1 sur 10⁹."],
        ["Par quel mécanisme le puceron se reproduit-il sans fécondation ?", ["La scissiparité", "La parthénogenèse", "Le bouturage", "Le marcottage"], 1, "La parthénogenèse produit un descendant à partir d’un ovule non fécondé ; la scissiparité est le mode des bactéries."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le brassage des génomes à chaque génération : la reproduction sexuée des eucaryotes',
      questions: [
        ["Que se sépare-t-il lors de la division II de la méiose ?", ["Les chromosomes homologues", "Les chromatides sœurs", "Les deux lots de gamètes", "Les brins d’ADN"], 1, "La division II est équationnelle, comme une mitose : ce sont les chromatides sœurs qui se séparent ; les homologues se sont séparés en division I."],
        ["Pourquoi la division I de méiose est-elle dite réductionnelle ?", ["Elle réduit la taille des chromosomes", "Elle supprime les crossing-over", "Elle réduit le nombre de cellules", "Elle fait passer la cellule de 2n à n chromosomes"], 3, "En séparant les homologues, la division I fait passer de 2n à n : chez l’humain, de 46 à 23 chromosomes."],
        ["Dans un croisement-test, des recombinés très rares indiquent que les deux gènes sont…", ["Proches sur le même chromosome", "Situés sur des chromosomes différents", "Très éloignés sur le même chromosome", "Récessifs tous les deux"], 0, "Plus deux gènes liés sont proches, plus un crossing-over entre eux est rare, donc moins il y a de recombinés."],
        ["Que deviennent les copies d’un gène dupliqué au fil des générations ?", ["Elles restent identiques pour toujours", "Elles fusionnent en un seul gène", "Elles mutent indépendamment et forment une famille multigénique", "Elles sont éliminées à la méiose suivante"], 2, "Chaque copie accumule ses propres mutations : c’est ainsi que s’est formée la famille des gènes des globines."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Mécanismes de diversification des êtres vivants',
      questions: [
        ["Quel exemple illustre un transfert horizontal de gènes chez les bactéries ?", ["La pêche aux termites", "La formation d’un lichen", "La diffusion de la résistance aux antibiotiques", "Le chant des oiseaux"], 2, "Par conjugaison, transformation ou transduction, un gène de résistance passe d’une bactérie à une autre sans reproduction."],
        ["Pourquoi un mulet est-il en général stérile ?", ["Il est né d’une hybridation entre deux espèces", "Il est polyploïde", "Il est issu d’un transfert viral", "Il n’a pas de microbiote"], 0, "L’hybride du cheval et de l’âne a des chromosomes mal appariés : sa méiose échoue. Seul un doublement du stock chromosomique peut la rétablir."],
        ["Quelle proportion des plantes dépendent des mycorhizes ?", ["Moins de 5 %", "Environ 20 %", "Aucune, c’est rare", "Plus de 80 %"], 3, "Plus de 80 % des plantes s’associent à un champignon au niveau des racines, ce qui décuple leur surface d’absorption."],
        ["Comment une transmission culturelle peut-elle influencer l’évolution génétique ?", ["Elle modifie directement l’ADN", "Elle modifie la pression de sélection qui s’exerce ensuite sur les gènes", "Elle provoque des mutations", "Elle n’a aucun effet possible"], 1, "Un comportement appris change le milieu ou les ressources exploitées, donc les allèles avantagés par la sélection."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'De la diversification des êtres vivants à l’évolution de la biodiversité',
      questions: [
        ["Une population respecte Hardy-Weinberg avec p = 0,7. Quelle est la fréquence attendue des homozygotes aa ?", ["0,49", "0,09", "0,42", "0,3"], 1, "q = 1 − p = 0,3, et la fréquence des aa vaut q² = 0,09 ; 0,49 correspond à AA et 0,42 aux hétérozygotes (2pq)."],
        ["Laquelle de ces conditions N’EST PAS une hypothèse du modèle de Hardy-Weinberg ?", ["Une population de grand effectif", "L’absence de migration", "Des croisements au hasard", "Une sélection naturelle forte"], 3, "Le modèle suppose au contraire l’absence de sélection, de mutation et de migration, dans une grande population panmictique."],
        ["Dans quel cas la dérive génétique a-t-elle le plus d’effet ?", ["Dans une population de petit effectif", "Dans une population très nombreuse", "Quand la sélection est forte", "Quand l’allèle est avantageux"], 0, "La dérive vient du hasard de l’échantillonnage des gamètes : plus la population est petite, plus ce hasard pèse."],
        ["Pourquoi le critère d’interfécondité ne s’applique-t-il pas aux fossiles ?", ["Ils sont trop anciens pour être classés", "Ils se reproduisaient tous de façon asexuée", "On ne peut pas les croiser", "Leur ADN est toujours intact"], 2, "L’interfécondité se teste par croisement ; pour les fossiles, on recourt aux critères morphologique et phylogénétique."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La chronologie relative : décrypter le temps des roches par l’observation',
      questions: [
        ["Un filon de basalte traverse trois couches sédimentaires. Que conclut-on ?", ["Le filon est plus ancien que les couches", "Le filon et les couches ont le même âge", "Le filon est plus récent que les couches qu’il recoupe", "On ne peut rien conclure"], 2, "Principe de recoupement : ce qui recoupe est postérieur à ce qui est recoupé."],
        ["Une couche change de faciès, de sable à argile, sur son extension. Que dit le principe de continuité ?", ["Elle a le même âge sur toute son extension", "Elle a deux âges différents", "La partie sableuse est plus ancienne", "Elle a été renversée"], 0, "Une même couche garde le même âge partout, même si les conditions de dépôt, donc son faciès, varient latéralement."],
        ["Pourquoi le cœlacanthe est-il un mauvais fossile stratigraphique ?", ["Il est trop petit", "Il est trop abondant", "Il vivait partout sur Terre", "Il a existé pendant une très longue durée"], 3, "Une espèce qui a vécu des centaines de millions d’années ne permet pas de découper finement le temps."],
        ["Qu’a apporté la radiochronologie à l’échelle stratigraphique ?", ["Elle l’a entièrement remplacée", "Elle l’a calibrée en millions d’années", "Elle a inversé l’ordre des ères", "Elle a supprimé les étages"], 1, "L’échelle ères-périodes-étages existait déjà grâce à la chronologie relative ; la radiochronologie y a ajouté des dates."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La chronologie absolue : décrypter le temps des roches par des mesures',
      questions: [
        ["Au bout de deux demi-vies, quelle fraction des atomes pères reste-t-il ?", ["La moitié", "Le quart", "Le tiers", "Aucun"], 1, "Chaque demi-vie divise le nombre de pères par deux : 1/2 puis 1/4."],
        ["Quelle méthode permet de s’affranchir de la quantité initiale d’isotope fils inconnue ?", ["Le principe de superposition", "Le granoclassement", "La demi-vie seule", "La droite isochrone"], 3, "La droite isochrone, construite sur plusieurs minéraux d’une même roche, donne l’âge par sa pente sans connaître la quantité initiale de fils."],
        ["Quel couple choisir pour dater une coulée volcanique de quelques millions d’années ?", ["Potassium 40 / argon 40", "Carbone 14 / azote 14", "Aucun, c’est impossible", "Le carbone 14 corrigé"], 0, "Le couple K/Ar, de demi-vie 1,3 milliard d’années, convient aux roches volcaniques ; le carbone 14 ne dépasse pas 50 000 ans."],
        ["Que date le carbone 14 dans un reste organique ?", ["La naissance de l’organisme", "La formation de la roche qui l’entoure", "La mort de l’organisme", "La fossilisation complète"], 2, "À sa mort, l’organisme cesse d’échanger du carbone : son stock de carbone 14 décroît sans être renouvelé."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Formation et disparition des océans : témoins d’un passé mouvementé de la Terre',
      questions: [
        ["Dans une ophiolite, quelle roche trouve-t-on tout en bas de la séquence ?", ["Les radiolarites", "Les basaltes en coussins", "Les péridotites", "Les gabbros"], 2, "De bas en haut : péridotites (le manteau), gabbros, basaltes en coussins, radiolarites (sédiments profonds)."],
        ["Quel exemple actuel illustre la phase de rifting ?", ["Le rift est-africain", "La chaîne des Alpes", "La fosse des Mariannes", "L’Himalaya"], 0, "Le rift est-africain et le fossé rhénan montrent une lithosphère continentale qui s’amincit et se casse en failles normales."],
        ["Quels minéraux caractérisent une éclogite ?", ["Le quartz et la calcite", "L’olivine seule", "Le feldspath et le mica", "Le grenat et la jadéite"], 3, "L’éclogite, à grenat et jadéite, se forme à plus grande profondeur que le faciès à glaucophane, lors de la subduction."],
        ["Jusqu’à quelle profondeur peut descendre la racine crustale d’une chaîne de collision ?", ["Environ 5 km", "Environ 70 km", "Environ 700 km", "Elle n’a pas de racine"], 1, "L’épaississement crustal enfonce la croûte comme un iceberg, jusqu’à environ 70 km sous la chaîne."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Organisation fonctionnelle des plantes à fleurs et adaptation à leurs milieux de vie',
      questions: [
        ["Quel tissu permet à une plante de croître toute sa vie ?", ["Le xylème", "Les méristèmes", "Le phloème", "La cuticule"], 1, "Les méristèmes produisent sans cesse de nouvelles cellules : la croissance d’une plante est modulaire et continue."],
        ["Quelle adaptation limite la perte d’eau chez une plante de milieu sec ?", ["Des feuilles larges et minces", "Des stomates nombreux sur la face supérieure", "Des racines très courtes", "Une cuticule cireuse épaisse"], 3, "Cuticule cireuse, feuilles en épines et stomates enfoncés réduisent la transpiration en milieu sec."],
        ["Qu’est-ce qui maintient la colonne d’eau continue dans le xylème ?", ["La cohésion des molécules d’eau", "Une pompe racinaire", "La pression du phloème", "La photosynthèse"], 0, "L’évaporation au sommet tire l’eau et la cohésion entre molécules empêche la colonne de se rompre."],
        ["Une plante attaquée par un herbivore peut émettre des composés volatils. Que peuvent-ils faire ?", ["Faire fuir la plante", "Accélérer la photosynthèse", "Alerter les plantes voisines et attirer des prédateurs de l’herbivore", "Fermer définitivement les stomates"], 2, "Même fixée, la plante communique : ses signaux volatils préparent ses voisines et recrutent parfois des alliés."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La plante, productrice de la matière organique grâce à la photosynthèse',
      questions: [
        ["Quelles couleurs de la lumière les chlorophylles absorbent-elles surtout ?", ["Le vert et le jaune", "Seulement l’infrarouge", "Le bleu et le rouge", "Seulement le vert"], 2, "Les chlorophylles absorbent le bleu et le rouge ; le vert, réfléchi, donne leur couleur aux feuilles."],
        ["Que se passe-t-il pour le cycle de Calvin quand on plonge une plante dans le noir ?", ["Il s’arrête en quelques secondes, faute d’ATP et de RH₂", "Il continue des heures sans changement", "Il accélère", "Il produit du dioxygène"], 0, "Les deux phases sont couplées : sans lumière, la phase photochimique ne fournit plus l’ATP et les RH₂ dont le cycle de Calvin a besoin."],
        ["Sous quelle forme les sucres sont-ils exportés des feuilles vers les organes non chlorophylliens ?", ["En amidon, par le xylème", "En cellulose", "En glucose, par les stomates", "En saccharose, par le phloème"], 3, "Le saccharose circule dans la sève élaborée du phloème ; l’amidon est une forme de réserve, la cellulose une forme de structure."],
        ["Quelle molécule forme la paroi des cellules végétales et donc la charpente de la plante ?", ["L’amidon", "La cellulose", "La chlorophylle", "La RuBisCO"], 1, "Le glucose produit par la photosynthèse est assemblé en cellulose, polymère de structure de la paroi."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Reproduction de la plante entre vie fixée et mobilité',
      questions: [
        ["Que devient l’ovaire de la fleur après la fécondation ?", ["La graine", "Le fruit", "L’embryon", "Le pollen"], 1, "L’ovaire devient le fruit, tandis que chaque ovule qu’il contient devient une graine."],
        ["Comment se disperse l’akène plumeux du pissenlit ?", ["Par zoochorie", "Par hydrochorie", "Par épizoochorie", "Par anémochorie"], 3, "Le fruit plumeux est emporté par le vent : c’est l’anémochorie, comme pour la samare ailée de l’érable."],
        ["Quel dispositif empêche l’autofécondation en faisant rejeter par le stigmate le pollen de la même plante ?", ["L’incompatibilité biochimique", "La dioécie", "La maturation décalée", "La multiplication végétative"], 0, "L’incompatibilité biochimique fait que le stigmate reconnaît et rejette le pollen de la plante elle-même."],
        ["Quel organe permet au fraisier de se multiplier de façon végétative ?", ["Le tubercule", "Le rhizome", "Le stolon", "Le drageon"], 2, "Le fraisier émet des stolons qui s’enracinent plus loin ; le tubercule est celui de la pomme de terre, le rhizome celui du bambou."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La domestication des plantes',
      questions: [
        ["Pourquoi la germination simultanée a-t-elle été sélectionnée chez les plantes cultivées ?", ["Elle protège des parasites", "Elle augmente la taille des grains", "Elle permet une récolte unique", "Elle supprime l’amertume"], 2, "Des graines qui germent en même temps donnent des plantes mûres en même temps, récoltables en une seule fois."],
        ["Pourquoi un agriculteur qui cultive un hybride F1 rachète-t-il ses semences chaque année ?", ["La F2 perd l’homogénéité et la vigueur de la F1", "La F1 est stérile", "La loi interdit de ressemer", "Les graines F1 ne germent pas"], 0, "Les descendants d’un hybride F1 ne sont plus homogènes : il faut recroiser les lignées pures, donc racheter."],
        ["Quelle technique consiste à provoquer des mutations au hasard puis à trier les plantes obtenues ?", ["La transgenèse", "La sélection massale", "L’hybridation F1", "La mutagenèse"], 3, "La mutagenèse est aveugle : elle crée des mutations au hasard, que le sélectionneur trie ensuite."],
        ["Quel événement historique illustre la vulnérabilité d’une culture génétiquement uniforme ?", ["La domestication du maïs", "Le mildiou de la pomme de terre en Irlande en 1845", "La création du Svalbard", "L’invention de la sélection massale"], 1, "Des pommes de terre presque toutes identiques ont été ravagées par un même parasite, provoquant une grande famine."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Comprendre les variations climatiques',
      questions: [
        ["Quelle puissance solaire moyenne la Terre reçoit-elle par mètre carré ?", ["Environ 34 W/m²", "Environ 340 W/m²", "Environ 3 400 W/m²", "Environ 34 000 W/m²"], 1, "La Terre reçoit en moyenne environ 340 W/m², dont environ 30 % est renvoyé directement par l’albédo."],
        ["Entre quelles valeurs varie l’obliquité de l’axe terrestre, et sur quelle période ?", ["Entre 0° et 90°, en 100 000 ans", "Entre 10° et 15°, en 21 000 ans", "Elle ne varie pas", "Entre 22° et 24,5°, en environ 41 000 ans"], 3, "L’obliquité oscille entre 22° et 24,5° avec une période d’environ 41 000 ans, modifiant le contraste des saisons."],
        ["Pourquoi la vapeur d’eau constitue-t-elle une rétroaction positive ?", ["Plus il fait chaud, plus l’air en contient, et elle renforce l’effet de serre", "Elle augmente l’albédo en permanence", "Elle consomme du CO₂", "Elle refroidit toujours la surface"], 0, "Un air plus chaud contient plus de vapeur d’eau, gaz à effet de serre, ce qui amplifie le réchauffement initial."],
        ["Quel forçage a contribué au refroidissement du Cénozoïque ?", ["Un volcanisme intense", "La combustion des énergies fossiles", "La surrection de l’Himalaya et l’altération de ses silicates", "L’augmentation de la constante solaire"], 2, "L’altération des silicates d’une chaîne jeune consomme du CO₂ atmosphérique, ce qui affaiblit l’effet de serre."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Les méthodes d’observation du climat passé',
      questions: [
        ["Pourquoi le δ18O des foraminifères augmente-t-il en période glaciaire ?", ["Les foraminifères grandissent plus", "L’océan se réchauffe", "Les glaces piègent l’isotope léger et enrichissent l’océan en isotope lourd", "La salinité baisse"], 2, "L’isotope léger part dans les calottes ; l’océan s’enrichit en ¹⁸O, et l’eau plus froide renforce encore cette signature."],
        ["Quelle archive renseigne sur l’extension passée des glaciers ?", ["Les moraines", "Les cernes des arbres", "Les bulles d’air", "Les tests de foraminifères"], 0, "Les moraines marquent la position des anciens fronts glaciaires, avec une résolution temporelle grossière."],
        ["Que montrent les carottes de glace sur 800 000 ans ?", ["Que le CO₂ est resté constant", "Que la température n’a jamais varié", "Que le méthane n’existe pas", "Que le CO₂ et la température varient de concert"], 3, "C’est la seule archive donnant les deux grandeurs au même instant : elle montre leur variation conjointe."],
        ["Quelle archive permet de remonter des dizaines de millions d’années ?", ["Les carottes de glace", "Les foraminifères marins", "Les cernes des arbres", "Les registres de vendanges"], 1, "Les sédiments marins et leurs foraminifères couvrent des dizaines de millions d’années, avec une résolution millénaire."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Comprendre les conséquences du réchauffement climatique et les possibilités d’actions',
      questions: [
        ["De combien le niveau marin est-il monté depuis 1900 ?", ["D’environ 2 cm", "D’environ 20 cm", "D’environ 2 m", "Il a baissé"], 1, "Le niveau marin a monté d’environ 20 cm depuis 1900, et cette hausse s’accélère."],
        ["Quelle cause de montée des eaux ne fait intervenir aucune fonte de glace ?", ["La fonte du Groenland", "La fonte des glaciers de montagne", "La fonte de l’Antarctique", "La dilatation thermique de l’eau de mer"], 3, "En se réchauffant, l’eau de mer occupe plus de volume : c’est la dilatation thermique."],
        ["Quelle part de nos émissions de CO₂ les puits de carbone absorbent-ils aujourd’hui ?", ["Environ la moitié", "Presque rien", "Environ un dixième", "La totalité"], 0, "Forêts, sols et océan absorbent environ la moitié de nos émissions, mais un puits saturé ne stocke plus."],
        ["Végétaliser une ville pour limiter les îlots de chaleur relève de…", ["L’atténuation", "La compensation", "L’adaptation", "La géo-ingénierie"], 2, "Cette mesure limite les dommages d’un réchauffement déjà engagé : c’est de l’adaptation, pas une baisse des émissions."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Les réflexes',
      questions: [
        ["Quelle est la fonction réelle du réflexe myotatique au quotidien ?", ["Retirer la main d’une flamme", "Déclencher la marche", "Maintenir la posture", "Réguler la glycémie"], 2, "Chaque étirement d’un muscle par le poids du corps provoque sa contraction ajustée : le réflexe maintient la posture."],
        ["Que dit la loi du « tout ou rien » d’un potentiel d’action ?", ["Son amplitude ne varie pas", "Sa fréquence est fixe", "Il ne se propage jamais", "Il n’existe qu’à la synapse"], 0, "Un potentiel d’action a toujours la même amplitude ; c’est leur fréquence qui code l’intensité du stimulus."],
        ["Quelle fibre nerveuse conduit le message du fuseau neuromusculaire vers la moelle ?", ["Le motoneurone", "Le nerf optique", "La fibre musculaire", "La fibre Ia"], 3, "La fibre sensitive Ia relie le fuseau à la moelle épinière, où elle fait synapse directement avec le motoneurone."],
        ["Comment le message nerveux est-il codé au niveau d’une synapse ?", ["Par l’amplitude des potentiels d’action", "Par la concentration de neurotransmetteur libéré", "Par la nature du neurotransmetteur, qui change", "Par la longueur de l’axone"], 1, "À la synapse, le message est codé par la quantité de neurotransmetteur libéré, qui dépend de la fréquence des potentiels d’action."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Cerveau et mouvement volontaire',
      questions: [
        ["Quelle structure assure la coordination, l’équilibre et la précision des gestes ?", ["Les noyaux gris centraux", "Le cervelet", "Les aires prémotrices", "Le bulbe rachidien"], 1, "Une atteinte du cervelet rend les gestes imprécis et la démarche instable."],
        ["Après une section de la moelle épinière, que peut-il persister sous le niveau lésé ?", ["La commande volontaire", "La sensibilité consciente", "Rien du tout", "Les réflexes médullaires"], 3, "La commande volontaire ne descend plus, mais les arcs réflexes médullaires situés sous la lésion peuvent encore fonctionner."],
        ["Pourquoi dit-on que les motoneurones sont la « voie finale commune » ?", ["Réflexes et mouvements volontaires passent tous par eux", "Ils meurent les premiers", "Ils sont situés dans le cortex", "Ils ne reçoivent qu’une seule synapse"], 0, "Qu’il vienne d’un arc réflexe ou du cortex moteur, tout ordre de contraction passe par le motoneurone."],
        ["Quel rôle jouent les aires prémotrices ?", ["Elles contractent directement le muscle", "Elles détectent l’étirement", "Elles planifient le geste", "Elles produisent la dopamine"], 2, "Les aires prémotrices organisent la séquence du geste ; leur atteinte gêne la planification d’un mouvement."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le cerveau : un organe fragile à préserver',
      questions: [
        ["Pourquoi un AVC est-il une urgence absolue ?", ["Parce qu’il est toujours mortel", "Parce qu’il est contagieux", "Plus la prise en charge est rapide, plus la zone cérébrale sauvée est grande", "Parce que les neurones se multiplient"], 2, "Chaque minute sans oxygène détruit des neurones qui ne se renouvellent presque pas."],
        ["Qu’est-ce que la réserve cognitive ?", ["Une capacité, entretenue par l’activité, qui retarde les symptômes des maladies neurodégénératives", "Un stock de neurones de rechange", "Un médicament", "Une zone du cervelet"], 0, "Activité physique, intellectuelle et sociale construisent une réserve qui retarde l’apparition des symptômes."],
        ["Sur quels récepteurs agit le THC du cannabis ?", ["Les récepteurs à l’insuline", "Les récepteurs à l’acétylcholine du muscle", "Les fuseaux neuromusculaires", "Les récepteurs endocannabinoïdes"], 3, "Le THC se fixe sur les récepteurs du système endocannabinoïde, impliqués notamment dans la mémoire et l’attention."],
        ["Parmi ces structures, laquelle appartient au système de récompense ?", ["Le cervelet", "Le noyau accumbens", "La moelle épinière", "Le cortex visuel"], 1, "L’aire tegmentale ventrale, le noyau accumbens et le cortex préfrontal forment le système de récompense, qui utilise la dopamine."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'La cellule musculaire : une structure spécialisée permettant son propre raccourcissement',
      questions: [
        ["Quelles structures délimitent un sarcomère ?", ["Deux noyaux", "Deux stries Z", "Deux mitochondries", "Deux tendons"], 1, "Le sarcomère va d’une strie Z à la suivante ; les filaments d’actine y sont ancrés."],
        ["Qu’est-ce que la rigidité cadavérique ?", ["Un excès de calcium dans le sang", "Un raccourcissement des filaments d’actine", "Une contraction réflexe", "Des têtes de myosine restées accrochées à l’actine faute d’ATP"], 3, "Sans ATP, la tête de myosine ne peut plus se détacher de l’actine : le muscle reste figé."],
        ["Pourquoi le relâchement musculaire consomme-t-il de l’énergie ?", ["Le calcium est repompé activement dans le réticulum sarcoplasmique", "Il faut allonger les filaments", "Il faut détruire la myosine", "Il ne consomme aucune énergie"], 0, "Le retour du Ca²⁺ dans le réticulum se fait contre son gradient, grâce à l’hydrolyse d’ATP."],
        ["Pourquoi les muscles de l’œil ont-ils des unités motrices de quelques fibres seulement ?", ["Pour la puissance", "Pour économiser le calcium", "Pour la finesse du contrôle", "Parce qu’ils n’ont pas de motoneurone"], 2, "Peu de fibres par motoneurone permettent des ajustements très fins ; le mollet, avec plus d’un millier de fibres par unité, vise la puissance."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Origine de l’énergie (ATP) nécessaire à la contraction de la cellule musculaire',
      questions: [
        ["Quelle réaction régénère l’ATP à partir de la phosphocréatine ?", ["ATP + créatine donne ADP + phosphocréatine", "Glucose donne 2 lactate", "ADP + phosphocréatine donne ATP + créatine", "Pyruvate donne CO₂ + eau"], 2, "La phosphocréatine cède son phosphate à l’ADP : direct, sans oxygène ni déchet, mais épuisé en une dizaine de secondes."],
        ["Quelle étape de la respiration cellulaire produit l’essentiel de l’ATP en réduisant le dioxygène en eau ?", ["La chaîne respiratoire", "La glycolyse", "Le cycle de Krebs", "La fermentation"], 0, "La chaîne respiratoire de la membrane interne mitochondriale produit l’essentiel de l’ATP."],
        ["Qu’augmente un entraînement en endurance ?", ["La section des fibres uniquement", "La réserve de lactate", "La proportion de fibres blanches", "Le nombre de mitochondries et la densité capillaire"], 3, "L’endurance développe mitochondries, capillaires et VO₂ max ; la musculation augmente surtout la section des fibres."],
        ["Pourquoi les fibres de type I sont-elles appelées fibres rouges ?", ["Elles contiennent de l’hémoglobine libre", "Elles sont riches en myoglobine et très vascularisées", "Elles accumulent du lactate", "Elles n’ont pas de mitochondries"], 1, "La myoglobine, qui fixe le dioxygène, et une forte vascularisation leur donnent leur couleur rouge."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le contrôle des flux de glucose, source essentielle d’énergie des cellules musculaires',
      questions: [
        ["Dans quelles structures du pancréas se trouvent les cellules α et β ?", ["Les acini digestifs", "Les îlots de Langerhans", "Les néphrons", "Les hépatocytes"], 1, "Les îlots de Langerhans détectent la glycémie et sécrètent insuline (cellules β) et glucagon (cellules α)."],
        ["Quel est l’effet du glucagon sur le foie ?", ["Il y fait stocker du glycogène", "Il y fait entrer les GLUT4", "Il y fait détruire l’insuline", "Il y fait hydrolyser le glycogène et fabriquer du glucose"], 3, "Hyperglycémiant, le glucagon fait libérer du glucose par le foie à partir du glycogène et par néoglucogenèse."],
        ["Pendant un effort, comment les GLUT4 gagnent-ils la membrane de la fibre musculaire ?", ["Grâce à la contraction elle-même, même sans insuline", "Seulement sous l’effet de l’insuline", "Grâce au glucagon", "Ils n’y vont jamais"], 0, "La contraction fait migrer les GLUT4 indépendamment de l’insuline : c’est pourquoi l’activité physique améliore le contrôle glycémique."],
        ["Pourquoi l’hyperglycémie chronique du diabète est-elle grave ?", ["Elle provoque des crampes", "Elle empêche la digestion", "Elle abîme les petits vaisseaux de la rétine, des reins, des nerfs et du cœur", "Elle fait disparaître le glycogène musculaire"], 2, "Les complications vasculaires font la gravité de la maladie, bien plus que le symptôme immédiat."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'L’adaptabilité de l’organisme face aux perturbations de l’environnement',
      questions: [
        ["Quel système nerveux porte la phase rapide de la réponse au stress ?", ["Le système parasympathique", "Le cervelet", "Le système nerveux sympathique", "L’axe corticotrope"], 2, "Le sympathique déclenche en quelques secondes la libération d’adrénaline par la médullosurrénale."],
        ["Quelle glande libère le cortisol ?", ["La corticosurrénale", "La médullosurrénale", "L’hypophyse", "L’hypothalamus"], 0, "La corticosurrénale libère le cortisol sous l’effet de l’ACTH ; la médullosurrénale libère l’adrénaline."],
        ["Pendant la phase d’alarme, vers où le sang est-il redistribué ?", ["Vers la digestion et la peau", "Vers les reins uniquement", "Il n’est pas redistribué", "Vers les muscles et le cerveau"], 3, "Le sang afflue vers les muscles et le cerveau, au détriment de la digestion et de la peau."],
        ["Dans le syndrome général d’adaptation, quelle phase n’est plus bénéfique ?", ["L’alarme", "L’épuisement", "La résistance", "Aucune"], 1, "À l’épuisement, les capacités d’adaptation sont dépassées : la réponse devient délétère."],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'L’organisme débordé dans ses capacités d’adaptation',
      questions: [
        ["Quelles sont les trois dimensions du burn-out ?", ["Fièvre, douleurs, toux", "Épuisement, détachement vis-à-vis du travail, sentiment de perte d’efficacité", "Colère, joie, tristesse", "Insomnie, hypoglycémie, hypertension"], 1, "Le burn-out associe épuisement émotionnel et physique, détachement et sentiment de perte d’efficacité."],
        ["Quelle conséquence cardiovasculaire le stress chronique favorise-t-il ?", ["Une hypotension permanente", "Un ralentissement du cœur", "Aucune", "Une hypertension durable et de l’athérosclérose"], 3, "L’activation prolongée entretient l’hypertension et l’athérosclérose, qui augmentent le risque d’infarctus et d’AVC."],
        ["Qu’arrive-t-il aux récepteurs au cortisol de l’hypothalamus sous stress prolongé ?", ["Ils se désensibilisent", "Ils se multiplient", "Ils disparaissent du jour au lendemain", "Ils deviennent des récepteurs à l’adrénaline"], 0, "Désensibilisés, ils freinent mal l’axe corticotrope : le cortisol reste élevé."],
        ["Parmi ces facteurs, lequel est l’un des facteurs protecteurs les mieux établis face au stress ?", ["L’isolement", "La caféine", "Le soutien social", "La privation de sommeil"], 2, "Le soutien social fait partie des leviers de résilience les mieux documentés, avec l’activité physique et le sommeil."],
      ],
    },
  ],
}
