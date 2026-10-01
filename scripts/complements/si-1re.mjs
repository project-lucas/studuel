export default {
  slug: 'si',
  titreMigration: 'QUESTIONS EN PLUS — SCIENCES DE L’INGÉNIEUR 1re',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '1re',
      titre: 'Structure de la démarche de projet',
      questions: [
        ['Dans le triangle du projet, que se passe-t-il si l’on réduit le délai ?', ['Rien ne change pour le reste', 'Le coût monte ou la qualité se dégrade', 'La qualité s’améliore forcément', 'Le coût baisse automatiquement'], 1, 'Les trois contraintes sont liées : en améliorer une pèse sur les deux autres.'],
        ['Quelles trois questions structurent l’analyse du besoin ?', ['Combien, quand, où ?', 'Comment, avec quoi, pour combien ?', 'À qui rend-il service, sur quoi agit-il, dans quel but ?', 'Qui paie, qui fabrique, qui vend ?'], 2, 'Le produit rend service à quelqu’un, agit sur quelque chose, dans un but précis : c’est le point de départ du cahier des charges.'],
        ['Pourquoi « utiliser un moteur pas à pas » n’a-t-il pas sa place dans un cahier des charges fonctionnel ?', ['C’est une solution, qui ferme d’avance les autres pistes', 'Ce moteur est trop cher', 'Il manque une tolérance', 'Un moteur n’est pas une contrainte normative'], 0, 'Le cahier des charges dit ce qu’il faut faire, jamais comment le faire.'],
        ['L’écart entre le réel mesuré et le cahier des charges valide…', ['La pertinence du modèle', 'La justesse des hypothèses', 'Le planning du projet', 'La conformité du produit'], 3, 'L’écart 3 compare le produit réel au besoin exprimé : il dit si le produit est conforme.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Analyser un système',
      questions: [
        ['Dans « autonomie : 40 km ± 5 km », que représente « ± 5 km » ?', ['Le critère', 'Le niveau', 'La flexibilité', 'La fonction'], 2, 'La flexibilité est la tolérance admise autour du niveau attendu (40 km), le critère étant l’autonomie.'],
        ['Quels sont les maillons de la chaîne d’information ?', ['Alimenter, distribuer, convertir', 'Acquérir, traiter, communiquer', 'Mesurer, stocker, afficher', 'Transmettre, agir, contrôler'], 1, 'La chaîne d’information décide : elle acquiert par les capteurs, traite, puis communique.'],
        ['Une batterie appartient à quel maillon de la chaîne d’énergie ?', ['Transmettre', 'Convertir', 'Agir', 'Alimenter'], 3, 'La batterie fournit l’énergie au système : elle alimente la chaîne.'],
        ['Qu’est-ce qui fait d’un ensemble de composants un véritable système ?', ['La boucle où l’information commande l’énergie et les capteurs renvoient de l’information', 'La présence d’un moteur puissant', 'La juxtaposition d’une chaîne d’énergie et d’une chaîne d’information', 'Un cahier des charges signé'], 0, 'Les deux chaînes se croisent : c’est cette boucle, et non leur simple juxtaposition, qui fait un système.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le projet : la phase de conception',
      questions: [
        ['Qu’est-ce qui est interdit pendant la phase de convergence ?', ['Évaluer les idées', 'Rouvrir la liste des idées', 'Retenir une solution', 'Utiliser un tableau multicritère'], 1, 'La divergence interdit de juger, la convergence interdit de rouvrir la liste : chaque temps a sa règle.'],
        ['Dans un tableau multicritère, que se passe-t-il si l’on change les poids des critères ?', ['Rien, le classement est objectif', 'Le tableau devient invalide', 'Le classement des solutions peut changer', 'Seule la meilleure solution reste en tête'], 2, 'Le tableau rend le choix explicite et discutable : changer les poids change le classement.'],
        ['Qu’appelle-t-on solution constructive ?', ['La pièce, le composant ou le programme retenu', 'Ce que le produit doit rendre à l’utilisateur', 'Une contrainte du milieu extérieur', 'Un critère du cahier des charges'], 0, 'On descend de la fonction de service à la fonction technique, puis à la solution constructive, le choix concret.'],
        ['Laquelle de ces hypothèses est une hypothèse simplificatrice courante en simulation ?', ['Le produit est déjà vendu', 'Le budget est illimité', 'Le client a validé le prototype', 'Les frottements sont négligés'], 3, 'Solide indéformable, frottements négligés, régime permanent : ces hypothèses bornent la validité du résultat.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Énergie et mécanique',
      questions: [
        ['Quel est le rendement global de cinq éléments de rendement 0,9 en cascade ?', ['0,90', '0,45', '0,59', '0,81'], 2, '0,9 puissance 5 ≈ 0,59 : les rendements se multiplient, la chaîne longue perd beaucoup.'],
        ['Quel système transforme une rotation en translation alternée ?', ['Bielle-manivelle', 'Poulies-courroie', 'Engrenages', 'Réducteur'], 0, 'La bielle-manivelle donne un mouvement de va-et-vient, comme dans un moteur à piston.'],
        ['Pour un système poulies-courroie, de quoi dépend le rapport de transmission ?', ['Du nombre de dents', 'Des diamètres des poulies', 'Du pas de la vis', 'De la longueur de la courroie'], 1, 'Le rapport d’un système poulies-courroie dépend des diamètres ; il transmet la rotation à distance.'],
        ['Que dit la relation fondamentale de la dynamique ?', ['Somme des forces = 0', 'P = C × ω', 'E = P × t', 'Somme des forces = m × a'], 3, 'En dynamique, la somme des forces n’est plus nulle : elle donne l’accélération.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Information, capteurs et programmation',
      questions: [
        ['Combien de niveaux offre une conversion analogique-numérique sur 12 bits ?', ['1 024', '4 096', '256', '2 048'], 1, '2 puissance 12 = 4 096 niveaux.'],
        ['Que font les deux opérations du CAN ?', ['Il amplifie puis filtre', 'Il chiffre puis compresse', 'Il échantillonne dans le temps et quantifie en amplitude', 'Il code en ASCII puis transmet'], 2, 'L’échantillonnage découpe le temps, la quantification arrondit l’amplitude aux niveaux disponibles.'],
        ['Quel type de capteur fournit une valeur codée sur un bus I2C ou SPI ?', ['Un capteur numérique', 'Un capteur TOR', 'Un capteur analogique', 'Un fin de course'], 0, 'Le capteur numérique transmet directement une valeur codée sur un bus de communication.'],
        ['Dans quel ordre s’enchaînent les étapes de la boucle d’un système embarqué ?', ['Écrire les sorties, lire, calculer', 'Calculer, écrire, lire les entrées', 'Lire les sorties, écrire les entrées', 'Lire les entrées, calculer, écrire les sorties'], 3, 'Le programme lit les capteurs, calcule l’action, commande les actionneurs, puis recommence.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le projet : la phase de planification',
      questions: [
        ['Comment obtient-on les dates au plus tôt dans un réseau PERT ?', ['En parcourant le réseau de la fin vers le début', 'En parcourant le réseau du début vers la fin', 'En lisant le diagramme de Gantt à l’envers', 'En divisant la durée totale par le nombre de tâches'], 1, 'Les dates au plus tôt se calculent du début vers la fin, les dates au plus tard dans le sens inverse.'],
        ['Que donne la longueur du chemin critique ?', ['La durée minimale du projet', 'Le coût total du projet', 'La marge totale disponible', 'Le nombre de ressources nécessaires'], 0, 'Le chemin critique, suite des tâches de marge nulle, fixe la durée la plus courte possible du projet.'],
        ['Quel outil sert surtout à suivre l’avancement au quotidien ?', ['Le réseau PERT', 'Le tableau multicritère', 'Le diagramme de Gantt', 'Le cahier des charges'], 2, 'Le Gantt montre les tâches simultanées sur une échelle de temps : c’est le tableau de bord.'],
        ['Un retard sur une tâche disposant d’une marge suffisante retarde le projet.', ['Vrai', 'Faux'], 1, 'Tant que le retard reste inférieur à sa marge, il se résorbe sans toucher la date de fin.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le projet : les phases de réalisation et de terminaison',
      questions: [
        ['Que doit-on faire de toute évolution du besoin en cours de réalisation ?', ['L’appliquer directement', 'La refuser systématiquement', 'L’ignorer jusqu’à la livraison', 'La tracer, la chiffrer et la valider'], 3, 'La gestion des modifications impose de tracer, chiffrer et valider chaque évolution.'],
        ['« A-t-on construit le bon produit ? » : quelle démarche pose cette question ?', ['Valider', 'Vérifier', 'Planifier', 'Concevoir'], 0, 'Valider confronte le produit au besoin réel ; vérifier le confronte aux spécifications.'],
        ['Lors d’un essai, l’écart vient d’un instrument mal réglé. Quelle origine est en cause ?', ['Le produit', 'Une hypothèse du modèle', 'Le protocole de mesure', 'Le cahier des charges'], 2, 'L’instrument et les conditions d’essai relèvent du protocole de mesure, à examiner avant d’accuser le produit.'],
        ['Que comprend la documentation livrée à la fin du projet ?', ['Le brainstorming initial', 'Notice, plan de maintenance et dossier technique', 'Le tableau multicritère uniquement', 'La liste des idées écartées'], 1, 'La documentation permet d’utiliser et de maintenir le produit après la livraison.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le SysML',
      questions: [
        ['Quel diagramme SysML montre la décomposition du système en blocs ?', ['Le diagramme de séquence', 'Le diagramme de définition de blocs', 'Le diagramme de cas d’utilisation', 'Le diagramme d’états'], 1, 'Le diagramme de définition de blocs décrit la structure : de quoi le système est fait.'],
        ['Quel diagramme montre les échanges de messages dans le temps ?', ['Le diagramme de séquence', 'Le diagramme des exigences', 'Le diagramme de blocs internes', 'Le diagramme de définition de blocs'], 0, 'Le diagramme de séquence décrit un comportement, en ordonnant les messages dans le temps.'],
        ['Dans un diagramme d’états, qu’est-ce qu’une garde ?', ['Un acteur extérieur', 'Un flux d’énergie', 'Une condition à laquelle une transition est soumise', 'Un bloc de sécurité'], 2, 'Une transition est déclenchée par un événement et peut être soumise à une condition : la garde.'],
        ['Quel composant réalise la fonction « distribuer » de la chaîne d’énergie ?', ['L’actionneur', 'Le capteur', 'Le réducteur', 'Le préactionneur'], 3, 'Le préactionneur distribue l’énergie à l’actionneur sur ordre de la chaîne d’information.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Calcul vectoriel et repères',
      questions: [
        ['À quoi sert le produit scalaire en mécanique ?', ['Au calcul des moments', 'Au calcul du travail d’une force', 'Au calcul de la masse', 'Au changement de repère'], 1, 'Le produit scalaire donne un nombre : c’est lui qui calcule le travail d’une force.'],
        ['Quelle est la norme du vecteur de coordonnées (3 ; 4) ?', ['7', '12', '5', '25'], 2, '√(3² + 4²) = √25 = 5.'],
        ['Une force de 10 N fait un angle de 60° avec un axe. Quelle est sa composante le long de cet axe ?', ['5 N', '8,7 N', '10 N', '0 N'], 0, 'Composante le long de l’axe = F × cos α = 10 × cos 60° = 10 × 0,5 = 5 N.'],
        ['Quel est le résultat d’un produit vectoriel ?', ['Un nombre', 'Un angle', 'Une norme seule', 'Un vecteur perpendiculaire aux deux vecteurs'], 3, 'Le produit vectoriel donne un vecteur perpendiculaire aux deux, de norme ‖u‖ × ‖v‖ × sin α.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Modélisation des actions',
      questions: [
        ['Quel est le moment d’une force de 50 N appliquée perpendiculairement à 0,3 m du point considéré ?', ['150 N·m', '15 N·m', '166 N·m', '1,5 N·m'], 1, 'M = F × d = 50 × 0,3 = 15 N·m.'],
        ['Que transmet une liaison ponctuelle parfaite ?', ['Toutes les forces et tous les moments', 'Un moment seul', 'Une seule force, perpendiculaire au contact', 'Aucune action'], 2, 'La liaison ponctuelle laisse 5 degrés de liberté et ne transmet qu’une force normale au contact.'],
        ['Combien de degrés de liberté autorise une liaison glissière ?', ['Un, en translation', 'Un, en rotation', 'Zéro', 'Cinq'], 0, 'La glissière n’autorise qu’une translation le long de son axe.'],
        ['Par quoi peut-on remplacer une action répartie sur une surface ?', ['Par un moment seul', 'Par plusieurs forces perpendiculaires', 'Par le poids du solide', 'Par une force unique équivalente'], 3, 'Une action répartie se remplace par une force unique appliquée au point où la répartition s’équilibre.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Représentation complète des actions',
      questions: [
        ['Combien de composantes compte une action mécanique dans l’espace ?', ['Trois', 'Six', 'Deux', 'Neuf'], 1, 'Trois composantes de force et trois de moment, contre trois seulement dans un problème plan.'],
        ['Le calcul donne une valeur négative pour une inconnue tracée avec un sens supposé. Que conclure ?', ['Le calcul est faux', 'Il faut changer de repère', 'Le sens réel est l’inverse du sens supposé', 'L’action n’existe pas'], 2, 'Le signe négatif indique simplement que le sens réel est opposé : la solution reste juste.'],
        ['Que doit toujours porter une représentation graphique des actions ?', ['Une échelle indiquée', 'Le nom du fabricant', 'Les actions intérieures', 'La masse de chaque pièce'], 0, 'La longueur de chaque flèche est proportionnelle à l’intensité : sans échelle, le tracé ne se lit pas.'],
        ['Quand on transporte un torseur d’un point à un autre, qu’est-ce qui change ?', ['La résultante', 'Rien du tout', 'La direction de la résultante', 'Le moment'], 3, 'La résultante ne change pas, mais le moment si, puisque le bras de levier change.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Principe fondamental de la statique',
      questions: [
        ['Que désigne l’adhérence ?', ['Ce qui s’oppose au glissement en cours', 'Ce qui empêche le glissement', 'La composante normale du contact', 'Le poids du solide'], 1, 'L’adhérence empêche le glissement ; le frottement s’oppose à un glissement déjà commencé.'],
        ['Sur un plan incliné, une pièce reste immobile tant que…', ['L’angle du plan reste inférieur à l’angle d’adhérence', 'Sa masse est faible', 'Le plan est horizontal', 'Son poids passe par le point de contact'], 0, 'Au-delà de l’angle d’adhérence, la limite T ≤ f × N est dépassée et le glissement commence.'],
        ['Quelle est la première étape de la méthode de résolution en statique ?', ['Écrire les équations', 'Choisir le point de calcul des moments', 'Isoler le solide', 'Vérifier l’homogénéité'], 2, 'On isole, on fait le bilan des actions extérieures, puis on choisit repère et point avant d’écrire.'],
        ['Un contact a une composante normale N = 200 N et un coefficient f = 0,3. Jusqu’à quelle valeur T peut-il monter sans glissement ?', ['200 N', '600 N', '0,3 N', '60 N'], 3, 'T ≤ f × N = 0,3 × 200 = 60 N.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Énergie et puissance',
      questions: [
        ['Combien de joules vaut un kilowattheure ?', ['1 000 J', '3,6 × 10⁶ J', '3 600 J', '3,6 × 10³ J'], 1, '1 kWh = 1 000 W × 3 600 s = 3,6 × 10⁶ J.'],
        ['Quelle est la puissance dissipée par une résistance de 10 Ω traversée par 2 A ?', ['20 W', '5 W', '40 W', '200 W'], 2, 'P = R × I² = 10 × 2² = 40 W.'],
        ['Quel est le rendement de trois maillons à 80 % chacun ?', ['Environ 51 %', '80 %', '240 %', 'Environ 64 %'], 0, '0,8 × 0,8 × 0,8 = 0,512 : environ 51 %.'],
        ['Pourquoi réduire le nombre de conversions améliore-t-il le rendement global ?', ['Parce que chaque conversion ajoute de l’énergie', 'Parce que les pertes s’annulent', 'Parce que les rendements s’additionnent', 'Parce que chaque conversion multiplie par un facteur inférieur à 1'], 3, 'Chaque maillon supplémentaire multiplie le total par un rendement inférieur à 1.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Cinématique du point',
      questions: [
        ['Quelle est la valeur de l’accélération d’un point en mouvement circulaire uniforme ?', ['a = v × R', 'a = v² / R', 'a = 0', 'a = R / v'], 1, 'L’accélération est centripète et vaut v² / R, même si la vitesse est constante en valeur.'],
        ['Un point est à 0,5 m de l’axe d’un solide tournant à 10 rad/s. Quelle est sa vitesse linéaire ?', ['5 m/s', '20 m/s', '0,05 m/s', '10,5 m/s'], 0, 'v = ω × R = 10 × 0,5 = 5 m/s.'],
        ['Dans un mouvement rectiligne uniforme, l’accélération est…', ['Constante non nulle', 'Centripète', 'Nulle', 'Proportionnelle au temps'], 2, 'La vitesse est constante en valeur et en direction : l’accélération est nulle.'],
        ['Une roue d’entrée de rayon 2 cm entraîne une roue de sortie de rayon 6 cm. Que devient la vitesse angulaire ?', ['Elle est multipliée par 3', 'Elle reste la même', 'Elle est multipliée par 12', 'Elle est divisée par 3'], 3, 'ω(sortie) / ω(entrée) = R(entrée) / R(sortie) = 2 / 6 = 1/3 : la vitesse est divisée par 3.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les signaux',
      questions: [
        ['Un signal a une période de 20 ms. Quelle est sa fréquence ?', ['20 Hz', '50 Hz', '500 Hz', '0,05 Hz'], 1, 'f = 1 / T = 1 / 0,020 s = 50 Hz.'],
        ['Que fait l’étape de quantification ?', ['Elle prélève la valeur à intervalles réguliers', 'Elle écrit chaque niveau en binaire', 'Elle arrondit chaque échantillon au niveau disponible le plus proche', 'Elle supprime le bruit'], 2, 'La quantification arrondit l’amplitude ; sa finesse dépend de la résolution en bits.'],
        ['Quelle est la nature du signal délivré par un microphone ?', ['Analogique', 'Logique', 'Numérique', 'Binaire'], 0, 'La tension d’un microphone varie continûment : elle peut prendre une infinité de valeurs.'],
        ['Pourquoi un signal numérique se régénère-t-il exactement ?', ['Parce qu’il n’est jamais bruité', 'Parce qu’il est compressé', 'Parce qu’il est échantillonné très vite', 'Parce que le bruit reste sous le seuil de décision entre 0 et 1'], 3, 'Tant que le bruit ne dépasse pas le seuil de décision, chaque bit est relu sans erreur.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Codage de l’information',
      questions: [
        ['Que vaut le nombre binaire 1101 en décimal ?', ['11', '13', '15', '9'], 1, '1101 = 8 + 4 + 0 + 1 = 13.'],
        ['Que vaut le nombre hexadécimal F en décimal ?', ['16', '10', '15', '14'], 2, 'Les chiffres hexadécimaux vont de 0 à 9 puis de A (10) à F (15).'],
        ['Sur combien de bits l’ASCII code-t-il les caractères ?', ['7 bits', '16 bits', '4 bits', '32 bits'], 0, 'L’ASCII sur 7 bits ne suffit pas aux langues accentuées, d’où Unicode et UTF-8.'],
        ['Le mot 01000001 représente-t-il forcément la lettre A ?', ['Oui, toujours', 'Oui, sauf dans une image', 'Non, il vaut toujours 65', 'Non, c’est la convention du programme qui l’interprète'], 3, 'Ce mot vaut 65 en entier, A en ASCII, ou une nuance de gris : rien dans le mot ne dit ce qu’il représente.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les opérateurs logiques fondamentaux',
      questions: [
        ['Comment note-t-on l’opérateur ET dans une équation logique ?', ['Par un signe plus', 'Par un point', 'Par une barre', 'Par une flèche'], 1, 'Le ET se note comme une multiplication, le OU comme une addition.'],
        ['Combien de lignes compte la table de vérité d’une fonction à quatre entrées ?', ['Huit', 'Douze', 'Seize', 'Quatre'], 2, 'Une fonction à n entrées a 2 puissance n lignes : 2⁴ = 16.'],
        ['Une alarme se déclenche dès que l’un des capteurs détecte une intrusion. Quel opérateur la décrit ?', ['OU', 'ET', 'NON', 'NON-ET'], 0, 'Le OU vaut 1 dès qu’au moins une entrée vaut 1.'],
        ['Que vaut la sortie d’un NON-ET dont les deux entrées valent 1 ?', ['1', 'Indéterminée', 'Cela dépend du circuit', '0'], 3, 'Le ET de 1 et 1 vaut 1 ; inversé par le NON-ET, il donne 0.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Association de portes logiques',
      questions: [
        ['Quel est l’intérêt de la table de vérité parmi les trois représentations ?', ['Elle se câble directement', 'Elle est exhaustive', 'Elle se simplifie', 'Elle occupe moins de place'], 1, 'La table de vérité liste toutes les combinaisons : elle ne ment pas.'],
        ['Sur quelles lignes de la table de vérité s’appuie la méthode du produit de sommes ?', ['Celles où la sortie vaut 1', 'Toutes les lignes', 'Celles où la sortie vaut 0', 'Seulement la dernière'], 2, 'Le produit de sommes est la construction duale de la somme de produits : il part des 0.'],
        ['Quelle est la dernière étape de l’analyse d’un montage existant ?', ['Dresser la table de vérité pour vérifier', 'Nommer les sorties intermédiaires', 'Compter les portes', 'Remplacer les portes par des NON-ET'], 0, 'On nomme, on écrit, on remonte jusqu’à la sortie, puis la table de vérité vérifie le tout.'],
        ['Quelle représentation d’une fonction logique se câble directement ?', ['L’équation logique', 'La table de vérité', 'Le tableau de Karnaugh', 'Le logigramme'], 3, 'Le logigramme est le schéma du montage de portes : c’est lui qu’on câble.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Algèbre de Boole',
      questions: [
        ['Que vaut a . complément de a ?', ['1', '0', 'a', 'Le complément de a'], 1, 'Une variable et son complément ne valent jamais 1 en même temps : leur ET vaut 0.'],
        ['Que vaut a . 0 en algèbre de Boole ?', ['a', '1', '0', 'Le complément de a'], 2, '0 est l’élément absorbant du ET.'],
        ['Que donne la loi de De Morgan appliquée au complément de (a + b) ?', ['Complément de a . complément de b', 'Complément de a + complément de b', 'a . b', 'a + b'], 0, 'On complémente chaque terme et on échange les opérateurs : le OU devient un ET.'],
        ['Que vaut a . (a + b) ?', ['a + b', 'b', 'a . b', 'a'], 3, 'C’est le théorème d’absorption : a . (a + b) se réduit à a.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Simplification des expressions logiques',
      questions: [
        ['Combien de cases compte un tableau de Karnaugh à trois variables ?', ['Six', 'Huit', 'Neuf', 'Seize'], 1, 'Le tableau a 2 puissance n cases, une par ligne de la table de vérité : 2³ = 8.'],
        ['Que se passe-t-il si l’on écrit les en-têtes d’un tableau de Karnaugh en binaire naturel ?', ['Rien, le résultat est identique', 'Le tableau devient plus petit', 'Les voisinages sont faux, donc la simplification aussi', 'Les groupes doublent de taille'], 2, 'Il faut le code de Gray (00, 01, 11, 10) pour que deux cases voisines ne diffèrent que d’une variable.'],
        ['Qu’apporte un groupe deux fois plus grand dans un tableau de Karnaugh ?', ['Il élimine une variable de plus', 'Il ajoute un terme', 'Il rend le résultat faux', 'Il ne change rien'], 0, 'Doubler la taille d’un groupe fait disparaître une variable supplémentaire du terme.'],
        ['Quelle est la principale difficulté de la simplification par l’algèbre ?', ['Elle change la fonction réalisée', 'Elle interdit les lois de De Morgan', 'Elle exige un tableau de Karnaugh', 'Rien ne garantit qu’on est arrivé au plus simple'], 3, 'On peut toujours avoir manqué une factorisation : d’où l’intérêt de la méthode graphique de Karnaugh.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Sécurité du transfert d’information',
      questions: [
        ['Quelle exigence garantit que l’émetteur ne peut nier avoir envoyé le message ?', ['La confidentialité', 'La non-répudiation', 'La disponibilité', 'L’intégrité'], 1, 'La non-répudiation, apportée par la signature numérique, empêche l’émetteur de renier son message.'],
        ['Comment HTTPS combine-t-il les deux chiffrements ?', ['Il n’utilise que le symétrique', 'Il chiffre deux fois chaque message en asymétrique', 'L’asymétrique transmet une clé de session symétrique, qui chiffre ensuite le trafic', 'Le symétrique transmet la clé privée'], 2, 'L’asymétrique résout l’échange de clés, le symétrique chiffre vite le trafic.'],
        ['Quelle est la difficulté propre au chiffrement symétrique ?', ['Il faut transmettre la clé au destinataire', 'Il est très lent', 'Il ne protège pas le contenu', 'Il nécessite deux clés différentes'], 0, 'Émetteur et destinataire partagent la même clé : encore faut-il la leur faire parvenir.'],
        ['Avec quelle clé vérifie-t-on la signature numérique d’un émetteur ?', ['La clé privée de l’émetteur', 'La clé privée du destinataire', 'Une clé symétrique de session', 'La clé publique de l’émetteur'], 3, 'L’émetteur signe avec sa clé privée ; chacun vérifie avec sa clé publique.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Réseau de données',
      questions: [
        ['Quel type de réseau couvre quelques mètres autour d’une personne, comme le Bluetooth ?', ['LAN', 'PAN', 'WAN', 'MAN'], 1, 'Le PAN est le réseau personnel ; le LAN couvre un bâtiment, le WAN une large étendue.'],
        ['D’après quelle adresse un commutateur distribue-t-il les trames ?', ['L’adresse IP', 'Le numéro de port', 'L’adresse MAC', 'Le masque de sous-réseau'], 2, 'Le commutateur travaille dans le réseau local avec les adresses MAC ; le routeur, avec les adresses IP.'],
        ['Quelle topologie offre plusieurs chemins et une grande robustesse, au prix d’un câblage coûteux ?', ['La topologie maillée', 'La topologie en bus', 'La topologie en étoile', 'La topologie en anneau'], 0, 'Le réseau maillé survit à la coupure d’un lien car les données peuvent passer par un autre chemin.'],
        ['Quel protocole d’application, léger et fondé sur la publication-abonnement, est la référence des objets connectés ?', ['FTP', 'HTTP', 'TCP', 'MQTT'], 3, 'MQTT est conçu pour des équipements modestes qui publient et s’abonnent à des sujets.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le circuit électrique',
      questions: [
        ['Quelle conservation traduit la loi des nœuds ?', ['Celle de l’énergie', 'Celle de la charge', 'Celle de la puissance', 'Celle de la tension'], 1, 'Rien ne s’accumule dans un fil : ce qui entre dans un nœud en ressort.'],
        ['Quelle est la résistance équivalente de deux résistances de 100 Ω en dérivation ?', ['200 Ω', '100 Ω', '50 Ω', '10 000 Ω'], 2, 'En dérivation, les inverses s’additionnent : 1/100 + 1/100 = 1/50, soit 50 Ω.'],
        ['Que se passe-t-il si l’on branche un ampèremètre en dérivation ?', ['Il court-circuite le dipôle, car sa résistance est presque nulle', 'Il mesure la tension', 'Il ne se passe rien', 'Il mesure une intensité doublée'], 0, 'Un ampèremètre se branche en série ; en dérivation, il crée un court-circuit qui peut détruire l’appareil ou le circuit.'],
        ['Deux résistances de 1 kΩ et 3 kΩ en série sont alimentées sous 8 V. Quelle tension aux bornes de celle de 3 kΩ ?', ['2 V', '8 V', '4 V', '6 V'], 3, 'Le pont diviseur partage la tension selon les valeurs : 8 × 3 / (1 + 3) = 6 V.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les composants électriques : générateur, résistance et condensateur',
      questions: [
        ['Un générateur de fém E = 12 V et de résistance interne r = 0,5 Ω débite 4 A. Quelle tension délivre-t-il ?', ['12 V', '10 V', '14 V', '6 V'], 1, 'U = E − r × I = 12 − 0,5 × 4 = 10 V.'],
        ['Au bout de combien de temps considère-t-on la charge d’un condensateur terminée à 99 % ?', ['τ', '2 τ', '5 τ', '10 τ'], 2, 'La charge suit une exponentielle : le régime établi est atteint à 99 % après 5 τ.'],
        ['Quelle relation lie la charge, la capacité et la tension d’un condensateur ?', ['Q = C × U', 'Q = C / U', 'Q = U / C', 'Q = ½ × C × U²'], 0, 'Q = C × U, avec Q en coulombs, C en farads et U en volts.'],
        ['De quoi ne dépend pas la résistance d’un fil ?', ['De sa longueur', 'De sa section', 'De son matériau', 'De sa couleur'], 3, 'La résistance d’un fil dépend de sa longueur, de sa section et du matériau conducteur.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les composants électriques : inductance, diode et transistor',
      questions: [
        ['Quelle est l’unité de l’inductance ?', ['Le farad', 'Le henry', 'L’ohm', 'Le weber'], 1, 'L’inductance d’une bobine s’exprime en henrys (H).'],
        ['Comment se comporte une bobine en régime continu établi ?', ['Comme un interrupteur ouvert', 'Comme un générateur', 'Comme un simple fil', 'Comme une diode'], 2, 'Son comportement est le symétrique du condensateur, qui se comporte, lui, en interrupteur ouvert.'],
        ['Quel régime du transistor est employé dans l’électronique analogique ?', ['L’amplification', 'La commutation', 'Le blocage permanent', 'La saturation permanente'], 0, 'En régime linéaire, la sortie reproduit l’entrée en plus grand : c’est l’amplification.'],
        ['Comment la diode de roue libre est-elle montée aux bornes de la bobine ?', ['En série avec la bobine, en direct', 'À la place du transistor', 'En parallèle avec l’alimentation', 'En inverse, à ses bornes'], 3, 'Montée en inverse, elle ne conduit qu’à la coupure et offre au courant de la bobine un chemin pour s’éteindre.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les outils d’étude',
      questions: [
        ['Une amplitude occupe 3 divisions avec une sensibilité de 5 V/div. Quelle est sa valeur ?', ['8 V', '15 V', '1,7 V', '35 V'], 1, 'On compte les divisions et on multiplie par le calibre : 3 × 5 = 15 V.'],
        ['Quel appareil révèle un rebond de contact ou un temps de montée ?', ['Le multimètre', 'Le générateur de fonctions', 'L’oscilloscope', 'L’ampèremètre'], 2, 'Seul l’oscilloscope montre l’allure du signal dans le temps.'],
        ['Que révèle un écart entre le calcul et la simulation ?', ['Une erreur de modèle ou d’hypothèse', 'Un composant hors tolérance', 'Un cahier des charges non respecté', 'Une panne de l’oscilloscope'], 0, 'Calcul et simulation reposent tous deux sur des modèles : leur écart signale une erreur de modèle ou d’hypothèse.'],
        ['Laquelle de ces grandeurs un simulateur ignore-t-il, sauf si on la modélise ?', ['La loi d’Ohm', 'La loi des mailles', 'La valeur nominale des résistances', 'Les capacités parasites'], 3, 'Le simulateur ne connaît que les phénomènes modélisés : capacités parasites, contacts, échauffement en sont exclus par défaut.'],
      ],
    },
  ],
}
