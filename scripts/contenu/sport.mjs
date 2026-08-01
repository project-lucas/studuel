// EPS — Éducation physique et sportive, 6e → Terminale.
// L'EPS se pratique ; ce qui s'apprend et se révise, ce sont les connaissances
// qui la rendent efficace et sûre : le corps en effort, les règles, les rôles,
// l'entraînement, la santé. C'est ce que couvre ce contenu.

export default {
  slug: 'sport',
  nom: 'Sport',
  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        {
          titre: 'Le corps en mouvement',
          lecon: {
            titre: 'S’échauffer, respirer, récupérer',
            cours: `Avant l'effort, pendant, après : le corps suit toujours les mêmes règles.

## Pourquoi s'échauffer
L'échauffement augmente la température du muscle, accélère le cœur et la respiration, et prépare les articulations. Il **réduit le risque de blessure** et améliore la performance. Il dure 10 à 15 minutes et va du général (course lente) au spécifique (gestes de l'activité).

## Ce qui change pendant l'effort
Le cœur bat plus vite (**fréquence cardiaque**), la respiration s'accélère, on transpire pour évacuer la chaleur, les muscles consomment de l'oxygène et du glucose.

## La récupération
Après l'effort : ralentir progressivement, boire, s'étirer doucement. La fréquence cardiaque redescend d'autant plus vite qu'on est entraîné — c'est un bon indicateur de progrès.

## Les signaux d'alerte
Douleur vive, point de côté qui ne passe pas, vertiges, essoufflement anormal : on s'arrête et on prévient l'enseignant. Écouter son corps fait partie de l'apprentissage.`,
          },
          questions: [
            ['À quoi sert principalement l’échauffement ?', ['À préparer le corps et réduire le risque de blessure', 'À fatiguer avant l’effort', 'À perdre du poids', 'À gagner des points'], 0, 'Il élève la température musculaire et prépare cœur et articulations.'],
            ['Combien de temps dure un échauffement complet ?', ['10 à 15 minutes', '1 minute', '45 minutes', '2 heures'], 0, 'Assez long pour élever la température, assez court pour ne pas fatiguer.'],
            ['Pendant l’effort, la fréquence cardiaque augmente.', ['Vrai', 'Faux'], 0, 'Le cœur envoie plus de sang, donc plus d’oxygène, vers les muscles.'],
            ['Pourquoi transpire-t-on à l’effort ?', ['Pour évacuer la chaleur produite', 'Pour éliminer les graisses', 'Pour respirer mieux', 'Pour muscler la peau'], 0, 'La transpiration est le système de refroidissement du corps.'],
            ['Un sportif entraîné récupère plus vite qu’un débutant.', ['Vrai', 'Faux'], 0, 'La vitesse de retour au calme est un bon indicateur de condition physique.'],
            ['Que faire en cas de douleur vive pendant un exercice ?', ['S’arrêter et prévenir l’enseignant', 'Continuer pour finir', 'Courir plus vite', 'Boire beaucoup d’un coup'], 0, 'La douleur vive est un signal d’alerte, pas un obstacle à franchir.'],
            ['Après l’effort, il faut…', ['Ralentir progressivement et boire', 'S’asseoir immédiatement', 'Manger un repas complet', 'Prendre une douche froide'], 0, 'Le retour au calme progressif aide la récupération.'],
            ['L’échauffement commence par le spécifique puis va vers le général.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : du général (course lente) vers le spécifique (gestes de l’activité).'],
          ],
        },
        {
          titre: 'Les sports collectifs',
          lecon: {
            titre: 'Jouer ensemble : règles et fair-play',
            cours: `Un sport collectif se joue à plusieurs contre plusieurs, dans un espace partagé, avec des règles communes.

## L'attaque et la défense
En attaque : **conserver** la balle, **progresser** vers la cible, **marquer**. En défense : **récupérer** la balle, **protéger** sa cible, gêner la progression. Toute équipe alterne les deux rôles à chaque perte de balle.

## Le démarquage
Se démarquer, c'est se placer là où le porteur peut vous passer la balle sans qu'un adversaire l'intercepte. Un bon joueur sans ballon crée les solutions.

## Quelques règles à connaître
Au **basket** : marcher (plus de deux appuis sans dribble) et reprise de dribble sont des fautes. Au **handball** : trois pas, trois secondes. Au **football** : le hors-jeu. Au **volley** : trois touches maximum par équipe.

## Le fair-play
Accepter la décision de l'arbitre, respecter l'adversaire, ne pas humilier, féliciter. Le fair-play n'est pas un supplément : c'est ce qui rend le jeu possible.`,
          },
          questions: [
            ['Quelles sont les trois missions de l’attaque ?', ['Conserver, progresser, marquer', 'Courir, sauter, lancer', 'Défendre, gêner, récupérer', 'Passer, tirer, sortir'], 0, 'Elles structurent toutes les activités collectives.'],
            ['Au volley-ball, combien de touches de balle par équipe au maximum ?', ['3', '2', '4', '5'], 0, 'Réception, passe, attaque : trois touches avant de renvoyer.'],
            ['Se démarquer, c’est se placer pour pouvoir recevoir la balle.', ['Vrai', 'Faux'], 0, 'Le joueur sans ballon crée les solutions de passe.'],
            ['Au handball, combien de pas maximum sans dribbler ?', ['3', '2', '5', 'Aucun'], 0, 'Trois pas, et trois secondes balle en main.'],
            ['Au basket, la reprise de dribble est autorisée.', ['Vrai', 'Faux'], 1, 'Reprendre son dribble après l’avoir arrêté est une faute.'],
            ['Que fait une équipe qui perd le ballon ?', ['Elle passe immédiatement en défense', 'Elle sort du terrain', 'Elle demande un temps mort', 'Elle attend l’arbitre'], 0, 'Le changement de statut est immédiat : c’est le rapport de force qui bascule.'],
            ['Le fair-play consiste notamment à…', ['Accepter la décision de l’arbitre', 'Gagner à tout prix', 'Feindre une faute', 'Ignorer l’adversaire'], 0, 'Sans acceptation des décisions, il n’y a plus de jeu possible.'],
            ['En défense, on cherche à protéger sa cible et récupérer la balle.', ['Vrai', 'Faux'], 0, 'Ce sont les deux missions défensives fondamentales.'],
          ],
        },
        {
          titre: 'Sécurité et activités physiques',
          lecon: {
            titre: 'Pratiquer en sécurité',
            cours: `La sécurité en EPS n'est pas une contrainte extérieure : elle fait partie de la compétence.

## Les règles de base
Tenue adaptée et lacets serrés, bijoux retirés, matériel vérifié, espace dégagé, consignes écoutées avant de commencer. On ne s'engage jamais dans un atelier sans savoir ce qu'on y fait.

## En natation
On ne plonge jamais dans un bassin dont on ignore la profondeur. On ne nage pas seul. La règle du **test d'aisance aquatique** conditionne l'accès à certaines activités nautiques.

## En gymnastique et en escalade
La **parade** consiste à accompagner le camarade pour éviter la chute dangereuse ; l'**assurage** en escalade est un rôle à part entière, avec vérification mutuelle du baudrier et du nœud avant de grimper.

## L'hydratation et la chaleur
Boire avant, pendant et après. En cas de forte chaleur, réduire l'intensité, chercher l'ombre, surveiller les signes de malaise chez les autres.`,
          },
          questions: [
            ['Avant de grimper en escalade, on vérifie…', ['Le baudrier et le nœud, mutuellement', 'La météo', 'Sa vitesse', 'La hauteur du mur'], 0, 'La vérification croisée est la règle de sécurité de base.'],
            ['On peut plonger dans un bassin dont on ignore la profondeur.', ['Vrai', 'Faux'], 1, 'C’est l’une des principales causes d’accidents graves.'],
            ['Qu’est-ce que la parade en gymnastique ?', ['Accompagner le camarade pour éviter une chute dangereuse', 'Un enchaînement de figures', 'Une note de jury', 'Un échauffement'], 0, 'C’est un rôle actif, qui s’apprend.'],
            ['Quand faut-il boire lors d’une séance de sport ?', ['Avant, pendant et après', 'Seulement après', 'Seulement si on a soif', 'Jamais pendant l’effort'], 0, 'La soif apparaît quand la déshydratation a déjà commencé.'],
            ['Les bijoux doivent être retirés avant la pratique.', ['Vrai', 'Faux'], 0, 'Bagues, colliers et montres provoquent coupures et accrochages.'],
            ['Par forte chaleur, il faut…', ['Réduire l’intensité et chercher l’ombre', 'Augmenter l’effort', 'Éviter de boire', 'Se couvrir davantage'], 0, 'La chaleur ajoute une charge au système cardiovasculaire.'],
            ['Qu’est-ce que le test d’aisance aquatique ?', ['Une évaluation qui conditionne l’accès à certaines activités nautiques', 'Un chronomètre de natation', 'Un diplôme de sauveteur', 'Une épreuve du brevet'], 0, 'Il atteste qu’un élève sait se débrouiller dans l’eau.'],
            ['Écouter les consignes avant un atelier fait partie de la sécurité.', ['Vrai', 'Faux'], 0, 'On ne s’engage jamais sans savoir ce qu’on va faire.'],
          ],
        },
      ],
    },
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'Effort, endurance et santé',
          lecon: {
            titre: 'Connaître son effort : FC, VMA, filières',
            cours: `Progresser suppose de savoir **à quelle intensité** on travaille.

## La fréquence cardiaque
Elle se mesure en battements par minute (bpm). La **FC maximale** s'estime par la formule « 220 – âge ». On travaille l'endurance entre **60 et 80 %** de la FC max, un effort où l'on peut encore parler.

## La VMA
La **vitesse maximale aérobie** est la vitesse à partir de laquelle on consomme le maximum d'oxygène. Elle se mesure par un test progressif (Luc Léger, VAMEVAL). Elle sert à calibrer les séances : 60 % de VMA pour l'endurance, 100 % et plus pour le fractionné.

## Les trois filières énergétiques
**Anaérobie alactique** : très courte (0-10 s), très intense (sprint, saut). **Anaérobie lactique** : 10 s à 2 min, production d'acide lactique (400 m). **Aérobie** : au-delà, avec oxygène (course longue).

## Les effets de l'entraînement
Le cœur devient plus gros et plus efficace, la FC de repos baisse, la récupération s'accélère, l'endurance augmente. Les bénéfices apparaissent dès 2 à 3 séances hebdomadaires régulières.`,
          },
          questions: [
            ['Comment estime-t-on simplement la fréquence cardiaque maximale ?', ['220 moins l’âge', '180 moins l’âge', 'Le poids fois 3', 'La taille moins 100'], 0, 'C’est une estimation rapide, utile pour calibrer une séance.'],
            ['Que signifie VMA ?', ['Vitesse maximale aérobie', 'Volume musculaire actif', 'Variation moyenne d’amplitude', 'Vitesse moyenne d’accélération'], 0, 'C’est la vitesse à laquelle la consommation d’oxygène est maximale.'],
            ['Un sprint de 8 secondes sollicite surtout la filière aérobie.', ['Vrai', 'Faux'], 1, 'Sur un effort aussi court et intense, c’est l’anaérobie alactique.'],
            ['Dans quelle zone travaille-t-on l’endurance ?', ['60 à 80 % de la FC max', '30 à 40 % de la FC max', '95 à 100 % de la FC max', 'Peu importe'], 0, 'C’est la zone où l’on peut encore parler en courant.'],
            ['L’entraînement régulier fait baisser la fréquence cardiaque de repos.', ['Vrai', 'Faux'], 0, 'Le cœur, plus efficace, envoie plus de sang à chaque battement.'],
            ['Quel test permet de mesurer sa VMA ?', ['Le test de Luc Léger', 'Le test de Cooper de force', 'Le test de souplesse', 'Le test d’équilibre'], 0, 'Un test progressif par paliers, comme le VAMEVAL.'],
            ['La filière anaérobie lactique concerne des efforts de…', ['10 secondes à 2 minutes', '0 à 5 secondes', '30 minutes et plus', '2 heures'], 0, 'Typiquement un 400 m, avec accumulation de lactate.'],
            ['Il faut au moins deux à trois séances par semaine pour progresser durablement.', ['Vrai', 'Faux'], 0, 'La régularité prime sur l’intensité ponctuelle.'],
          ],
        },
        {
          titre: 'Les rôles sociaux en EPS',
          lecon: {
            titre: 'Arbitre, coach, observateur',
            cours: `En EPS, on n'est pas seulement pratiquant : on tient aussi des rôles qui font vivre l'activité.

## L'arbitre
Il connaît le règlement, se place pour voir, siffle clairement et **assume** sa décision. Une erreur d'arbitrage arrive : ce qui compte, c'est la constance et l'impartialité. Arbitrer apprend aussi à mieux jouer, en comprenant les règles de l'intérieur.

## L'observateur
Il relève des données concrètes : nombre de passes réussies, zones de tir, temps de possession. Ces relevés transforment une impression (« on a mal joué ») en fait mesurable (« 7 ballons perdus sur 12 en zone centrale »).

## Le coach
Il conseille un camarade ou une équipe : rappeler une consigne, encourager, proposer un changement. Un bon conseil est **court, précis et positif**.

## Le juge
En gymnastique, en danse ou en acrosport, il évalue selon des critères annoncés : difficulté, exécution, composition. Juger oblige à expliciter ce qui fait la qualité d'une prestation.`,
          },
          questions: [
            ['Que fait un observateur en EPS ?', ['Il relève des données concrètes sur le jeu', 'Il encourage seulement', 'Il arbitre', 'Il note les élèves'], 0, 'Les relevés transforment une impression en fait mesurable.'],
            ['Un bon conseil de coach est…', ['Court, précis et positif', 'Long et détaillé', 'Critique et sévère', 'Donné après le match'], 0, 'En pleine action, seul un message court est utilisable.'],
            ['Arbitrer aide à mieux comprendre le jeu.', ['Vrai', 'Faux'], 0, 'On découvre les règles de l’intérieur, donc les intentions du jeu.'],
            ['Qu’évalue un juge en gymnastique ?', ['La difficulté, l’exécution et la composition', 'La vitesse seule', 'Le nombre de points marqués', 'La taille de l’élève'], 0, 'Les critères sont annoncés avant la prestation.'],
            ['L’arbitre doit surtout être…', ['Impartial et constant', 'Sévère', 'Silencieux', 'Du côté de la meilleure équipe'], 0, 'La constance rend ses décisions prévisibles, donc acceptables.'],
            ['Un observateur peut relever le nombre de passes réussies.', ['Vrai', 'Faux'], 0, 'C’est un indicateur simple et parlant du jeu collectif.'],
            ['Contester systématiquement l’arbitre…', ['Désorganise le jeu et fait perdre du temps', 'Améliore l’arbitrage', 'Est un droit du joueur', 'Est recommandé'], 0, 'Le jeu suppose une autorité acceptée.'],
            ['Tenir un rôle social fait partie de l’évaluation en EPS.', ['Vrai', 'Faux'], 0, 'Les programmes intègrent explicitement ces rôles.'],
          ],
        },
        {
          titre: 'Les quatre champs d’apprentissage',
          lecon: {
            titre: 'Ce qu’on apprend selon l’activité',
            cours: `Les programmes d'EPS classent les activités en **quatre champs d'apprentissage**, chacun avec un problème à résoudre différent.

## Champ 1 — Performance mesurée
Course, saut, lancer, natation de vitesse. Le problème : produire sa **meilleure performance** à un moment donné, en gérant l'allure et l'effort.

## Champ 2 — Milieu incertain
Escalade, course d'orientation, activités nautiques. Le problème : **adapter ses déplacements** à un environnement qui change et qu'on ne maîtrise pas.

## Champ 3 — Prestation artistique
Danse, gymnastique, acrosport, arts du cirque. Le problème : **s'exprimer devant un public** et être jugé sur une prestation composée.

## Champ 4 — Opposition
Sports collectifs, raquettes, sports de combat. Le problème : **prendre le dessus sur un adversaire** qui cherche exactement l'inverse.

Une même qualité physique se travaille dans plusieurs champs ; ce qui change, c'est la nature du problème à résoudre.`,
          },
          questions: [
            ['La course d’orientation relève de quel champ d’apprentissage ?', ['Adapter ses déplacements à un milieu incertain', 'Produire une performance mesurée', 'Réaliser une prestation artistique', 'Conduire un affrontement'], 0, 'Le milieu change et n’est pas maîtrisé : c’est le champ 2.'],
            ['Le badminton relève du champ de l’opposition.', ['Vrai', 'Faux'], 0, 'Un adversaire cherche exactement l’inverse de ce qu’on veut.'],
            ['Quel champ regroupe danse, gymnastique et acrosport ?', ['La prestation artistique devant un public', 'La performance mesurée', 'Le milieu incertain', 'L’opposition'], 0, 'On y est jugé sur une composition présentée.'],
            ['Combien de champs d’apprentissage structurent l’EPS ?', ['4', '3', '5', '6'], 0, 'Performance, milieu incertain, prestation artistique, opposition.'],
            ['Le 800 m relève de la performance mesurée.', ['Vrai', 'Faux'], 0, 'Il s’agit de produire sa meilleure performance en gérant son allure.'],
            ['Dans le champ « milieu incertain », la difficulté vient…', ['De l’environnement qui change', 'Du chronomètre', 'Du jury', 'De l’adversaire'], 0, 'Relief, vent, courant, itinéraire : le milieu impose ses conditions.'],
            ['Le judo appartient au champ de la prestation artistique.', ['Vrai', 'Faux'], 1, 'C’est un sport d’opposition : un adversaire s’oppose directement.'],
            ['Une même qualité physique peut se travailler dans plusieurs champs.', ['Vrai', 'Faux'], 0, 'L’endurance sert en course comme en sport collectif ; le problème posé diffère.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'S’entraîner et planifier',
          lecon: {
            titre: 'Construire un programme d’entraînement',
            cours: `S'entraîner, ce n'est pas répéter : c'est organiser une **charge** dans le temps.

## Les paramètres de la charge
**Volume** (durée, distance, nombre de répétitions), **intensité** (% de VMA ou de charge maximale), **densité** (rapport effort/récupération), **fréquence** (séances par semaine). Modifier un seul paramètre à la fois permet de savoir ce qui produit l'effet.

## La surcompensation
Après un effort, l'organisme récupère puis dépasse son niveau initial : c'est la **surcompensation**. Reprendre trop tôt épuise ; reprendre trop tard perd le bénéfice. C'est la récupération qui fait progresser, pas l'effort seul.

## La progressivité et la spécificité
Augmenter la charge par paliers (5 à 10 % par semaine). Et travailler ce que l'on veut améliorer : un nageur ne progresse pas en course à pied autant qu'en nageant.

## Le surentraînement
Fatigue persistante, sommeil dégradé, FC de repos élevée, baisse de performance, irritabilité. La réponse n'est pas d'en faire plus, mais de récupérer.`,
          },
          questions: [
            ['Qu’est-ce que la surcompensation ?', ['Le dépassement du niveau initial après récupération', 'Un excès d’entraînement', 'Un supplément alimentaire', 'Une compensation de blessure'], 0, 'C’est ce qui rend la récupération aussi importante que l’effort.'],
            ['Quels sont les paramètres de la charge d’entraînement ?', ['Volume, intensité, densité, fréquence', 'Poids, taille, âge, sexe', 'Force, vitesse, souplesse, adresse', 'Durée, plaisir, envie, météo'], 0, 'On en modifie un à la fois pour savoir ce qui agit.'],
            ['Augmenter brutalement la charge accélère les progrès.', ['Vrai', 'Faux'], 1, 'C’est la voie de la blessure : la progressivité est de 5 à 10 % par semaine.'],
            ['Une fréquence cardiaque de repos élevée peut signaler…', ['Un surentraînement', 'Une bonne forme', 'Une progression', 'Une bonne hydratation'], 0, 'Avec la fatigue persistante et la baisse de performance, c’est un signe d’alerte.'],
            ['Le principe de spécificité dit qu’on progresse surtout dans ce qu’on pratique.', ['Vrai', 'Faux'], 0, 'Le transfert existe, mais il est limité.'],
            ['La densité d’une séance désigne…', ['Le rapport entre effort et récupération', 'Le nombre de séances', 'Le poids soulevé', 'La distance totale'], 0, 'Réduire la récupération augmente la densité, donc la difficulté.'],
            ['Face au surentraînement, la bonne réponse est…', ['Récupérer davantage', 'Augmenter le volume', 'Changer de sport', 'Prendre des compléments'], 0, 'En faire plus aggrave le problème.'],
            ['Le repos fait partie intégrante du programme d’entraînement.', ['Vrai', 'Faux'], 0, 'Sans récupération, la surcompensation n’a pas lieu.'],
          ],
        },
        {
          titre: 'Alimentation, sommeil et performance',
          lecon: {
            titre: 'Ce qui se joue en dehors du terrain',
            cours: `La performance se construit autant hors séance que pendant.

## Les nutriments
Les **glucides** sont le carburant principal de l'effort (pâtes, riz, pain, fruits). Les **protéines** réparent et construisent le muscle (viande, poisson, œufs, légumineuses). Les **lipides** fournissent une énergie de longue durée. Aucun n'est à supprimer.

## Autour de l'effort
Repas complet 3 heures avant. Hydratation régulière par petites quantités : une perte de 2 % du poids en eau réduit déjà nettement la performance. Après l'effort, glucides et protéines dans les deux heures favorisent la récupération.

## Le sommeil
C'est pendant le sommeil profond que se produit la réparation tissulaire et la sécrétion d'hormone de croissance. Un adolescent a besoin de **8 à 9 heures**. Les écrans le soir retardent l'endormissement en freinant la mélatonine.

## Les fausses solutions
Boissons énergisantes, compléments miracles, régimes drastiques : rien ne remplace la régularité. Le dopage, lui, est interdit et dangereux — il triche avec le corps avant de tricher avec les autres.`,
          },
          questions: [
            ['Quel nutriment est le carburant principal de l’effort ?', ['Les glucides', 'Les protéines', 'Les lipides', 'Les vitamines'], 0, 'Pâtes, riz, pain, fruits : ils alimentent le muscle en glucose.'],
            ['Une perte de 2 % du poids en eau altère déjà la performance.', ['Vrai', 'Faux'], 0, 'La déshydratation agit bien avant la sensation de soif intense.'],
            ['De combien d’heures de sommeil un adolescent a-t-il besoin ?', ['8 à 9 heures', '5 à 6 heures', '10 à 12 heures', '7 heures maximum'], 0, 'C’est pendant le sommeil que se fait l’essentiel de la récupération.'],
            ['À quoi servent principalement les protéines ?', ['À réparer et construire le muscle', 'À fournir l’énergie immédiate', 'À hydrater', 'À stocker les vitamines'], 0, 'Viandes, poissons, œufs, légumineuses en apportent.'],
            ['Les boissons énergisantes améliorent durablement la performance.', ['Vrai', 'Faux'], 1, 'Elles stimulent ponctuellement et perturbent le sommeil : le bilan est négatif.'],
            ['Combien de temps avant l’effort prendre un repas complet ?', ['Environ 3 heures', '15 minutes', '30 minutes', '8 heures'], 0, 'Le temps que la digestion soit suffisamment avancée.'],
            ['Les écrans tardifs retardent l’endormissement.', ['Vrai', 'Faux'], 0, 'La lumière freine la sécrétion de mélatonine.'],
            ['Après l’effort, la fenêtre favorable à la récupération dure environ…', ['2 heures', '10 minutes', '12 heures', '3 jours'], 0, 'Glucides et protéines y sont mieux utilisés.'],
          ],
        },
        {
          titre: 'Sport, société et valeurs',
          lecon: {
            titre: 'Le sport comme fait social',
            cours: `Le sport n'est pas seulement une pratique : c'est une institution, une économie et un discours.

## L'olympisme
Rénovés par **Pierre de Coubertin** en 1894, les Jeux olympiques modernes portent des valeurs affichées : excellence, amitié, respect. Ils sont aussi une scène politique — 1936 à Berlin, 1968 à Mexico, les boycotts de 1980 et 1984.

## L'égalité femmes-hommes
Exclues des premiers Jeux modernes, les femmes ont conquis les épreuves une à une ; la parité des athlètes a été atteinte aux Jeux de Paris 2024. Les écarts demeurent : médiatisation, salaires, accès aux responsabilités.

## Le dopage
Il fausse la compétition, met la santé en danger et détruit la confiance. L'**AMA** (Agence mondiale antidopage) fixe la liste des produits interdits ; les contrôles peuvent avoir lieu hors compétition.

## Sport et santé publique
La sédentarité est un facteur de risque majeur. L'OMS recommande au moins **60 minutes** d'activité physique par jour pour un adolescent. L'activité physique adaptée est aujourd'hui prescrite comme un soin.`,
          },
          questions: [
            ['Qui a rénové les Jeux olympiques modernes ?', ['Pierre de Coubertin', 'Jules Rimet', 'Jesse Owens', 'Alice Milliat'], 0, 'Il fonde le Comité international olympique en 1894.'],
            ['Combien de minutes d’activité physique l’OMS recommande-t-elle par jour à un adolescent ?', ['60 minutes', '20 minutes', '120 minutes', '30 minutes'], 0, 'C’est un seuil de santé publique, pas de performance.'],
            ['Les contrôles antidopage n’ont lieu que pendant les compétitions.', ['Vrai', 'Faux'], 1, 'Les contrôles inopinés hors compétition sont essentiels.'],
            ['Quel organisme fixe la liste mondiale des produits interdits ?', ['L’AMA', 'L’UNESCO', 'Le CIO seul', 'La FIFA'], 0, 'L’Agence mondiale antidopage, créée en 1999.'],
            ['La parité entre athlètes femmes et hommes a été atteinte aux Jeux de…', ['Paris 2024', 'Londres 2012', 'Rio 2016', 'Tokyo 2020'], 0, 'Une première dans l’histoire olympique.'],
            ['Les Jeux olympiques ont parfois été un enjeu politique.', ['Vrai', 'Faux'], 0, 'Berlin 1936, Mexico 1968, les boycotts de 1980 et 1984 le montrent.'],
            ['La sédentarité est aujourd’hui considérée comme…', ['Un facteur de risque majeur pour la santé', 'Un choix sans conséquence', 'Un problème réservé aux adultes', 'Un mythe'], 0, 'Elle est associée aux maladies cardiovasculaires et métaboliques.'],
            ['L’activité physique peut être prescrite par un médecin.', ['Vrai', 'Faux'], 0, 'C’est le sport sur ordonnance, ou activité physique adaptée.'],
          ],
        },
      ],
    },
  ],
}
