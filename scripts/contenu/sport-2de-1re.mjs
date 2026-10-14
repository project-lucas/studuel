// SPORT — 2de · 1re : « S’ENTRAÎNER » (10 fiches). La matière Sport refaite en
// CULTURE SPORTIVE (14/10/2026, Lucas : « on va s'écarter [du programme], on
// doit apporter l'histoire du sport notamment de la France, les fondamentaux
// du sport : hypertrophie, force, endurance, récupération, anti-blessure »).
// Le cadrage, le programme des 40 fiches et les règles de ton sont dans
// docs/CADRAGE-SPORT.md.
//
// Axes : la science de l’effort (5), le sport, une histoire (5).
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-2de-1re`.

import { createHash } from 'node:crypto'

const NIVEAUX = ['2de', '1re']

// L'identifiant d'un chapitre, tel que le calcule scripts/seed-contenu.mjs
// (clé `sport|<niveau>|<titre>`, espace de noms fixe) : le ménage en a besoin
// pour ne supprimer que les chapitres qui ne font PAS partie de ce bloc.
function uuid(cle) {
  const h = createHash('sha1').update(`studuel.contenu.v1:${cle}`).digest('hex')
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + h.slice(18, 20),
    h.slice(20, 32),
  ].join('-')
}

const chapitres = [
  // ---- La science de l’effort ---------------------------------------------
  {
    titre: 'Les filières énergétiques : 10 secondes, 2 minutes, 1 heure',
    axe: 'La science de l’effort',
    lecon: {
      titre: 'Trois voies pour fabriquer de l’énergie',
      cours: `Sur la ligne de départ du 100 m, le sprinteur n’a besoin que de dix secondes de carburant. Sur celle du 10 000 m, le fondeur en prépare plus de vingt-cinq minutes. Deux sportifs, deux corps, deux façons de produire de l’énergie : le muscle ne marche pas à la même essence selon la durée de l’effort.

## L’ATP, la seule monnaie du muscle
Un muscle ne brûle ni sucre ni graisse directement : il ne sait dépenser qu’une molécule, l’**ATP**. Le problème, c’est que le stock d’ATP est minuscule : il tient à peine quelques secondes. Tout l’effort consiste donc à **refabriquer de l’ATP** aussi vite qu’on le consomme. Pour cela, le corps dispose de trois voies, les **filières énergétiques**.

## Les trois filières
| Filière | Durée où elle domine | Carburant | Exemples |
| Anaérobie alactique | de 0 à environ 10 s | la phosphocréatine, déjà stockée dans le muscle | sprint, saut, lancer |
| Anaérobie lactique | d’environ 10 s à 2 min | le glucose (la glycolyse), sans oxygène | 400 m, 100 m nage |
| Aérobie | au-delà de 2 min | glucides puis lipides, avec de l’oxygène | 10 km, marathon |

« Anaérobie » veut dire « sans oxygène » : la réaction est immédiate, donc très puissante, mais elle s’épuise vite. La filière aérobie, elle, demande à l’oxygène de faire le voyage des poumons jusqu’au muscle : elle démarre plus lentement et elle est **moins puissante**, mais elle est **quasi inépuisable**.

> Plus l’effort est intense, plus il est court : puissance et durée ne vont jamais ensemble.

## Elles travaillent toujours ensemble
Les trois filières ne s’allument pas l’une après l’autre comme des interrupteurs. Elles se **chevauchent en permanence** : à chaque instant, les trois tournent, et c’est l’une d’elles qui domine selon l’intensité et la durée. Pendant un marathon, la filière aérobie fournit presque tout, mais le sprint final fait remonter les deux autres.

## Le lactate, un faux coupable
On entend souvent que le **lactate** « empoisonne » les muscles et provoque les courbatures. C’est faux. Le lactate est un déchet de la glycolyse, certes, mais surtout un **carburant recyclé** : le cœur et les muscles voisins le réutilisent, et le foie le retransforme en glucose. Les courbatures, elles, viennent de micro-lésions dans les fibres.

!> Si les jambes brûlent à la fin d’un 400 m, ce n’est pas « le lactate qui empoisonne » : c’est tout un ensemble de changements dans le muscle qui l’empêche de continuer au même rythme.

## Trois corps, trois entraînements
Le 100 m, le 400 m et le 10 000 m sollicitent trois corps différents, et chaque filière s’entraîne à sa façon.
| Filière | Comment l’entraîner |
| Alactique | efforts très courts et maximaux, avec une **récupération complète** entre chaque |
| Lactique | séries de **30 secondes à 2 minutes** à forte intensité, récupération incomplète |
| Aérobie | du **volume** : de longues séances à allure modérée, régulières |

Un footballeur ou un basketteur ont besoin des trois : des démarrages explosifs, des enchaînements intenses, et un moteur aérobie qui récupère vite entre les actions.

## À retenir
- Le muscle ne dépense que de l’ATP, et il en refabrique par trois filières : alactique (0 à 10 s), lactique (10 s à 2 min), aérobie (au-delà).
- Les trois filières tournent toujours ensemble ; l’intensité et la durée décident de celle qui domine.
- Le lactate est un carburant recyclé, pas un poison, et il n’est pas la cause des courbatures.`,
    },
    questions: [
      ['Quelle molécule le muscle utilise-t-il directement pour se contracter ?', ['L’oxygène', 'L’ATP', 'Le lactate', 'Le glucose seul'], 1, 'Le muscle ne sait dépenser que de l’ATP ; toutes les filières servent à en refabriquer.'],
      ['Combien de filières énergétiques le corps utilise-t-il pour refabriquer l’ATP ?', ['Trois', 'Cinq', 'Une seule', 'Deux'], 0, 'Il y en a trois : alactique, lactique et aérobie, qui se chevauchent en permanence.'],
      ['Quelle filière domine pendant un sprint de 100 m ?', ['L’anaérobie lactique', 'L’anaérobie alactique', 'Aucune, le corps se repose', 'L’aérobie'], 1, 'Sur les premières secondes, la phosphocréatine déjà stockée fournit l’énergie : c’est très puissant mais ça ne dure qu’une dizaine de secondes.'],
      ['Un 400 m ou un 100 m nage sollicite surtout la filière anaérobie lactique.', ['Vrai', 'Faux'], 0, 'Entre environ 10 secondes et 2 minutes, la glycolyse sans oxygène domine : c’est la zone du 400 m et du 100 m nage.'],
      ['Quelle filière est « inépuisable » mais moins puissante ?', ['L’alactique', 'L’aérobie', 'La lactique', 'Aucune'], 1, 'Avec l’oxygène, glucides et lipides peuvent être brûlés longtemps, mais plus lentement : idéal pour le 10 km et le marathon.'],
      ['Le lactate est un poison qui provoque les courbatures.', ['Vrai', 'Faux'], 1, 'Le lactate est un carburant recyclé par le cœur, les muscles et le foie ; les courbatures viennent de micro-lésions des fibres.'],
      ['Comment entraîne-t-on surtout la filière alactique ?', ['Des étirements', 'De longues sorties à allure lente', 'Des efforts très courts et maximaux, avec récupération complète', 'Des séries de 10 minutes sans repos'], 2, 'Le stock de phosphocréatine ne se reconstitue qu’au repos : il faut récupérer complètement entre deux efforts pour rester explosif.'],
      ['Pour entraîner la filière lactique, on utilise plutôt…', ['Des séries de 30 secondes à 2 minutes à forte intensité', 'Des siestes', 'Des sprints de 3 secondes', 'Une marche tranquille d’une heure'], 0, 'C’est la durée où la glycolyse domine : des séries de 30 s à 2 min en poussant fort la sollicitent directement.'],
      ['Pendant un marathon, quelle filière fournit presque toute l’énergie ?', ['La phosphocréatine seule', 'La lactique seule', 'L’aérobie', 'L’alactique'], 2, 'Sur plusieurs heures, seule la filière aérobie peut suivre : elle brûle glucides puis lipides avec de l’oxygène.'],
      ['Les trois filières s’allument l’une après l’autre, jamais en même temps.', ['Vrai', 'Faux'], 1, 'Elles tournent toujours ensemble ; c’est l’intensité et la durée qui décident de celle qui domine.'],
      ['Que signifie « anaérobie » ?', ['Avec beaucoup d’oxygène', 'Sans oxygène', 'Sans sucre', 'Sans effort'], 1, 'Les filières anaérobies produisent l’ATP sans oxygène : c’est immédiat et puissant, mais ça s’épuise vite.'],
      ['Pourquoi un footballeur doit-il entraîner les trois filières ?', ['Il enchaîne démarrages, efforts intenses et récupérations pendant tout le match', 'Il ne court jamais vite', 'Il n’utilise que l’aérobie', 'Les filières n’existent pas en football'], 0, 'Un match mêle explosivité, séquences intenses et un moteur aérobie qui récupère vite entre les actions.'],
    ],
  },
  {
    titre: 'Construire son programme : volume, intensité, progressivité',
    axe: 'La science de l’effort',
    lecon: {
      titre: 'Écrire SON programme, un réglage à la fois',
      cours: `Tu t’inscris à un club, tu veux progresser, et tu te lances dans trois séances intenses dès la première semaine. Deux semaines plus tard, tu as mal partout et tu abandonnes. L’erreur n’est pas ton courage, c’est l’absence de programme : un entraînement efficace se construit, il ne s’improvise pas.

## Les quatre réglages de la charge
Toute séance se décrit avec quatre boutons.
| Réglage | Ce que c’est | Exemples |
| Volume | la quantité de travail | durée, distance, nombre de répétitions |
| Intensité | la difficulté de l’effort | % de VMA, % de la charge max, % de la fréquence cardiaque max |
| Densité | le rapport entre effort et repos | 30 s d’effort pour 30 s de repos |
| Fréquence | le nombre de séances | trois séances par semaine |

> On ne tourne qu’un bouton à la fois : si tu augmentes tout en même temps, tu ne sais plus ce qui marche, et ton corps encaisse mal.

Les entraîneurs résument aussi tout cela par le principe **FITT** : Fréquence, Intensité, Temps, Type d’exercice.

## Les grands principes
Un bon programme respecte six règles.
- **Surcharge progressive** : pour progresser, il faut demander un peu plus qu’avant — environ **10 % de plus par semaine**, pas davantage.
- **Spécificité** : on progresse dans ce qu’on travaille. Courir améliore la course, pas la natation.
- **Variété** : changer les exercices évite l’ennui et les blessures de répétition.
- **Récupération** : le progrès se fait au repos, pas pendant la séance.
- **Réversibilité** : après **2 à 3 semaines d’arrêt**, les acquis redescendent.
- **Individualisation** : le programme de ton voisin n’est pas le tien (âge, niveau, objectif, sommeil).

## Un exemple de semaine
Voici une semaine type à trois séances pour un coureur débutant.
| Jour | Séance | Intérêt |
| Lundi | endurance fondamentale, allure facile | construire le moteur aérobie |
| Mercredi | fractionné : répétitions rapides entrecoupées de récupération | gagner en vitesse |
| Samedi | renforcement : gainage, squats au poids du corps | solidifier le corps, éviter les blessures |

Les jours entre les séances ne sont pas perdus : ce sont eux qui rendent la progression possible.

## Le carnet d’entraînement
Note après chaque séance : ce que tu as fait, la fréquence cardiaque si tu la mesures, ton **ressenti** sur dix, et ta forme. En quelques semaines, ce carnet te montre ce qui marche et t’alerte quand quelque chose cloche.

## Les signes du surentraînement
!> Si tu es fatigué en permanence, si tes performances stagnent ou baissent, si ton sommeil se dégrade, si tu es irritable ou si ton cœur bat plus vite au repos, tu en fais trop. La réponse n’est pas de forcer, c’est de **lever le pied** quelques jours.

## À retenir
- Une séance se règle avec quatre boutons : volume, intensité, densité, fréquence — un seul à la fois.
- Progresser, c’est une surcharge d’environ 10 % par semaine, avec de la récupération.
- Après 2 à 3 semaines d’arrêt, les acquis redescendent : la régularité compte plus que l’exploit.`,
    },
    questions: [
      ['Que désigne le « volume » d’un entraînement ?', ['Le nombre de jours de repos', 'La quantité de travail : durée, distance, répétitions', 'La difficulté de l’effort', 'Le bruit de la musique'], 1, 'Le volume mesure la quantité faite ; la difficulté, c’est l’intensité.'],
      ['Que signifient les lettres de FITT ?', ['Fréquence, Intensité, Temps, Type', 'Fatigue, Inertie, Travail, Tension', 'Fitness, Initiation, Tests, Terrain', 'Force, Impact, Technique, Tempo'], 0, 'FITT rappelle les quatre questions à se poser : combien de fois, à quelle difficulté, combien de temps, quel type d’exercice.'],
      ['De combien peut-on augmenter la charge de travail chaque semaine, environ ?', ['100 %', '50 %', '10 %', '0 %'], 2, 'Environ 10 % par semaine : assez pour progresser, assez peu pour que le corps s’adapte sans se blesser.'],
      ['Pour progresser vite, il vaut mieux changer tous les réglages à la fois.', ['Vrai', 'Faux'], 1, 'On ne modifie qu’un réglage à la fois : sinon on ne sait plus ce qui marche, et le corps encaisse mal.'],
      ['Que dit le principe de spécificité ?', ['Il ne faut jamais changer d’exercice', 'Tous les sports se valent', 'On progresse dans ce qu’on travaille', 'Il faut s’entraîner seul'], 2, 'Courir améliore la course, pas la natation : l’entraînement doit ressembler à ce qu’on veut améliorer.'],
      ['Après combien de temps d’arrêt les acquis commencent-ils à redescendre ?', ['Après 2 ans', 'Environ 2 à 3 semaines', 'Après 24 heures', 'Jamais'], 1, 'C’est la réversibilité : sans entraînement, le corps perd ses adaptations en quelques semaines.'],
      ['Où se fait réellement le progrès ?', ['Pendant la récupération, après la séance', 'Pendant les repas seulement', 'Nulle part, tout est inné', 'Uniquement pendant la séance'], 0, 'La séance donne le signal, mais c’est au repos que le corps se reconstruit plus solide.'],
      ['Quel est l’intérêt d’un carnet d’entraînement ?', ['Impressionner ses amis', 'Remplacer la séance', 'Voir ce qui marche et repérer les signes de fatigue', 'Compter les calories des autres'], 2, 'En notant séance, ressenti et fréquence cardiaque, on repère les tendances et on ajuste le programme.'],
      ['Un sportif fatigué en permanence, qui stagne et dort mal doit forcer davantage.', ['Vrai', 'Faux'], 1, 'Ce sont les signes du surentraînement : la bonne réponse est de lever le pied quelques jours.'],
      ['Que mesure l’« intensité » d’une séance ?', ['La difficulté de l’effort, par exemple en % de la VMA', 'La durée de la séance', 'Le prix du matériel', 'Le nombre de spectateurs'], 0, 'L’intensité se règle en pourcentage de la VMA, de la charge maximale ou de la fréquence cardiaque maximale.'],
      ['Pourquoi varier les exercices au fil du programme ?', ['Pour perdre du temps', 'Pour supprimer la récupération', 'Pour changer de club', 'Pour éviter l’ennui et les blessures de répétition'], 3, 'C’est le principe de variété : changer les gestes ménage les articulations et garde la motivation.'],
      ['Le programme d’un autre sportif convient forcément à tout le monde.', ['Vrai', 'Faux'], 1, 'L’individualisation impose d’adapter le programme à son âge, son niveau, son objectif et son sommeil.'],
    ],
  },
  {
    titre: 'Musculation : hypertrophie, force, puissance',
    axe: 'La science de l’effort',
    lecon: {
      titre: 'Trois objectifs, trois façons de soulever',
      cours: `Deux lycéens vont à la salle. L’un enchaîne trois répétitions avec une barre très chargée, l’autre quinze avec une charge légère. Ils font tous les deux de la musculation, mais ils ne travaillent pas la même chose. Le secret : le nombre de répétitions et la charge décident de ce que ton corps va devenir.

## Les zones de travail
| Objectif | Répétitions | Charge (% du max) | Repos entre séries |
| Force maximale | 1 à 5 | 85 % et plus | 2 à 5 min |
| Hypertrophie (volume du muscle) | 6 à 12 | 65 à 85 % | 60 à 90 s |
| Endurance de force | 15 et plus | moins de 60 % | court |

> Plus la charge est lourde, moins on la soulève de fois : la force se construit lourd et court, le volume en moyen, l’endurance en léger et long.

## La puissance, force fois vitesse
Une personne très forte mais lente n’est pas puissante. La **puissance**, c’est la **force multipliée par la vitesse** : savoir produire de la force vite. C’est ce qui fait sauter plus haut, lancer plus loin, démarrer plus fort. On la travaille avec des **charges moyennes soulevées le plus vite possible** et avec la **pliométrie** (sauts, bonds, lancers de médecine-ball).

## Estimer son max sans le tester
Tester sa charge maximale sur une seule répétition est risqué, surtout sans pareur. On peut l’estimer avec la **formule d’Epley** : charge × (1 + répétitions / 30). Par exemple, si tu soulèves 60 kg pour 10 répétitions, ton max est d’environ 60 × (1 + 10 / 30), soit 80 kg. C’est une estimation, pas une vérité : elle te sert à choisir tes charges sans aller au bout de toi-même.

## Le tempo et les gestes de base
Le **tempo** est la vitesse de chaque phase : descendre en trois secondes, marquer une pause, remonter franchement. Il rend l’exercice plus propre et plus efficace que de balancer la barre. Les quatre gestes de base d’une séance « corps entier » :
| Geste | Ce qu’il travaille | Point clé de technique |
| Squat | cuisses, fessiers | dos droit, genoux dans l’axe des pieds |
| Soulevé de terre | dos, fessiers, arrière des cuisses | dos plat, barre près des jambes |
| Développé couché | pectoraux, épaules, triceps | omoplates serrées, trajectoire contrôlée |
| Tirage | dos, biceps | tirer avec le dos, sans élan |

## À 16-18 ans
!> Le squelette n’a pas fini de se solidifier : on monte les charges **progressivement**, la technique est **encadrée** par un adulte compétent, et on ne cherche **pas de charge maximale** avant la maturité du squelette. La musculation est bonne pour les os et la posture, à condition de ne pas brûler les étapes.

## Les signaux d’alerte
Le **dos rond** sous charge, une **douleur articulaire** vive (genou, épaule, lombaires) ou une technique qui se dégrade en fin de série : tu poses la barre. Fatigue musculaire et douleur de blessure ne se confondent pas : la première se ressent dans le muscle, la seconde dans l’articulation.

## Une séance corps entier, commentée
Échauffement de dix minutes, puis squat (4 × 8), développé couché (3 × 8), tirage (3 × 10), soulevé de terre léger (3 × 6), gainage pour finir. Trois séances de ce type par semaine, avec un jour de repos entre chaque, suffisent à progresser.

## À retenir
- Force : 1 à 5 répétitions lourdes ; hypertrophie : 6 à 12 ; endurance de force : 15 et plus avec une charge légère.
- Puissance = force × vitesse ; Epley : charge × (1 + répétitions / 30) pour estimer son max.
- À ton âge : charges progressives, technique encadrée, pas de maximum, et on s’arrête au moindre dos rond ou douleur articulaire.`,
    },
    questions: [
      ['Pour développer la force maximale, quelle fourchette de répétitions vise-t-on ?', ['6 à 12', '15 à 30', '50 et plus', '1 à 5'], 3, 'Une charge très lourde ne se soulève que peu de fois : la force maximale se travaille entre 1 et 5 répétitions.'],
      ['Quelle fourchette de répétitions correspond à l’hypertrophie ?', ['1 à 3', '6 à 12', '30 à 50', 'Un nombre quelconque'], 1, 'Entre 6 et 12 répétitions à 65-85 % du max : assez de tension pour faire grossir le muscle.'],
      ['La puissance, c’est…', ['La taille du muscle', 'La force multipliée par la vitesse', 'La force seule', 'L’endurance multipliée par la durée'], 1, 'Être puissant, c’est savoir produire de la force vite : un athlète fort mais lent manque de puissance.'],
      ['Comment travaille-t-on surtout la puissance ?', ['Séries de 50 répétitions', 'Étirements prolongés', 'Charges moyennes soulevées vite et pliométrie', 'Charges maximales très lentes'], 2, 'Il faut associer force et vitesse : charges moyennes mouvées rapidement, sauts et lancers.'],
      ['Un lycéen soulève 60 kg pour 10 répétitions. Quel est son max estimé avec la formule d’Epley ?', ['Environ 80 kg', 'Environ 100 kg', 'Environ 60 kg', 'Environ 70 kg'], 0, 'Epley : 60 × (1 + 10 / 30) = 60 × 1,33, soit environ 80 kg.'],
      ['Pourquoi estime-t-on son max plutôt que de le tester ?', ['Pour éviter le risque d’une répétition maximale', 'Parce que ça ne sert à rien', 'Parce que le max n’existe pas', 'Pour soulever plus lourd'], 0, 'Tester un maximum, surtout sans pareur, expose aux blessures ; la formule donne un repère sûr.'],
      ['Que désigne le tempo en musculation ?', ['La charge de la barre', 'La vitesse de chaque phase du mouvement', 'Le rythme de la musique', 'La durée du repos après la séance'], 1, 'Contrôler la descente, marquer une pause, remonter franchement : le tempo rend le geste plus propre et plus efficace.'],
      ['Au squat, quel point de technique est essentiel ?', ['Genoux qui rentrent vers l’intérieur', 'Talons qui décollent', 'Dos droit, genoux dans l’axe des pieds', 'Dos rond pour mieux descendre'], 2, 'Un dos droit et des genoux alignés protègent la colonne et les articulations.'],
      ['À 16-18 ans, on peut chercher sa charge maximale dès que possible.', ['Vrai', 'Faux'], 1, 'Le squelette n’a pas fini de se solidifier : on monte les charges progressivement, sans chercher de maximum.'],
      ['Que fait-on si le dos s’arrondit sous la charge ?', ['On force pour finir la série', 'On ajoute du poids', 'On ferme les yeux', 'On repose la barre et on corrige la technique'], 3, 'Le dos rond sous charge est un signal d’alerte : mieux vaut arrêter que de risquer le dos.'],
      ['Une douleur vive dans une articulation est une simple fatigue musculaire.', ['Vrai', 'Faux'], 1, 'La fatigue se ressent dans le muscle ; une douleur d’articulation est un signal d’alerte qui impose d’arrêter.'],
      ['Combien de séances « corps entier » par semaine suffisent pour progresser, avec du repos entre chacune ?', ['Une tous les deux mois', 'Environ trois', 'Quinze', 'Aucune'], 1, 'Trois séances par semaine avec un jour de repos entre chaque laissent le temps de récupérer et de progresser.'],
    ],
  },
  {
    titre: 'Nutrition du sportif : le vrai et le faux',
    axe: 'La science de l’effort',
    lecon: {
      titre: 'Ce que tu manges, ce que tu peux oublier',
      cours: `Veille de match. Au self, l’un prend des pâtes, un yaourt et une pomme. L’autre n’avale qu’une barre protéinée et une canette « énergie ». Lequel sera le plus en forme demain ? Pas besoin de magie : la nutrition du sportif tient en quelques règles solides, et en beaucoup de mythes à écarter.

## Les trois macronutriments
| Nutriment | Son rôle | Où on le trouve |
| Glucides | carburant de l’intensité | pâtes, riz, pain, fruits |
| Protéines | réparer et construire les muscles | viandes, poisson, œufs, produits laitiers, légumineuses |
| Lipides | énergie de fond, hormones, cellules | huiles, poissons gras, fruits à coque |

## Les quantités à retenir
Pour un sportif régulier, les glucides représentent **5 à 7 g par kilo et par jour** : c’est le carburant principal dès que l’effort est intense. Les protéines, c’est **1,2 à 2 g par kilo et par jour**, et surtout **réparties sur la journée**, pas avalées en une seule fois. Un repas normal en apporte déjà beaucoup : l’**assiette suffit**.

## L’hydratation
> Une perte de 2 % du poids du corps en eau suffit à faire baisser la performance.

Pour un sportif de 60 kg, cela représente à peine plus d’un litre de sueur non remplacé. On boit avant, pendant et après, par petites gorgées régulières, sans attendre d’avoir soif.

## Autour de l’effort
- **Avant** : un repas riche en glucides environ trois heures avant.
- **Pendant** : de l’eau, et un peu de glucides si l’effort dure longtemps.
- **Après** : des glucides pour refaire les stocks et des protéines pour réparer.

## Le vrai et le faux
| Idée reçue | Ce qui est vrai |
| « Il faut des protéines dans les 30 minutes » (la fenêtre anabolique) | c’est moins strict qu’on le dit : le total de la journée compte davantage |
| La créatine, c’est le produit miracle | efficace et étudiée chez l’adulte, mais pas conseillée avant 18 ans sans avis médical |
| Un café ou un shot de caféine avant l’effort | pas pour les mineurs |
| Les boissons énergisantes donnent des ailes | déconseillées aux adolescents par l’ANSES |
| Un régime ou un jeûne pour être plus léger | à éviter pendant la croissance |

!> Certains **compléments alimentaires** contiennent des substances dopantes non indiquées sur l’étiquette. Un contrôle positif « involontaire » reste un contrôle positif : l’athlète est responsable de ce qu’il avale.

## Un plateau de cantine avant un match
Une bonne combinaison, la veille : une portion de féculents (pâtes, riz ou pommes de terre), une source de protéines (poisson, œuf, poulet), des légumes, un produit laitier, un fruit et de l’eau. Pas de nouveauté le jour J : on ne teste jamais un aliment inconnu avant une compétition.

## À retenir
- Glucides 5 à 7 g/kg/jour, protéines 1,2 à 2 g/kg/jour réparties sur la journée : l’assiette suffit.
- Perdre 2 % de son poids en eau fait déjà baisser la performance : on boit avant, pendant et après.
- Créatine, caféine, boissons énergisantes, régimes : rien de tout cela n’est pour un adolescent, et les compléments peuvent contenir des produits dopants.`,
    },
    questions: [
      ['Quel nutriment est le carburant principal d’un effort intense ?', ['Le sel', 'Les glucides', 'Les protéines', 'Les fibres'], 1, 'Les glucides sont brûlés le plus vite : c’est le carburant de l’intensité.'],
      ['Quelle quantité de glucides un sportif régulier doit-il viser par kilo et par jour ?', ['20 g', '50 g', '0,5 g', '5 à 7 g'], 3, 'Cinq à sept grammes par kilo et par jour couvrent les besoins de l’entraînement régulier.'],
      ['Quel est le rôle principal des protéines pour un sportif ?', ['Hydrater le corps', 'Fournir l’énergie la plus rapide', 'Remplacer le sommeil', 'Réparer et construire les muscles'], 3, 'Elles apportent les briques qui servent à réparer les fibres après l’effort.'],
      ['Mieux vaut répartir les protéines sur la journée que tout manger en un seul repas.', ['Vrai', 'Faux'], 0, 'Le corps utilise mieux les protéines en apports répartis, et l’assiette normale suffit à les apporter.'],
      ['Quelle perte de poids en eau suffit à faire baisser la performance ?', ['Environ 2 %', 'Environ 20 %', 'Environ 50 %', 'Aucune'], 0, 'Dès 2 % du poids en eau perdus, la performance diminue : on boit avant d’avoir soif.'],
      ['Combien de temps avant l’effort prend-on un repas riche en glucides ?', ['Le lendemain', 'Environ trois heures', 'Deux minutes', 'Dix secondes'], 1, 'Trois heures laissent le temps de digérer tout en ayant des réserves pleines.'],
      ['La « fenêtre anabolique » de 30 minutes est une obligation stricte.', ['Vrai', 'Faux'], 1, 'Elle est moins stricte qu’on le dit : c’est l’apport total de la journée qui compte le plus.'],
      ['Que dit-on de la créatine pour un adolescent ?', ['Elle remplace l’entraînement', 'Elle est sans danger à tout âge sans réserve', 'Elle n’est pas conseillée avant 18 ans sans avis médical', 'Elle est obligatoire'], 2, 'Efficace et étudiée chez l’adulte, elle n’est pas conseillée avant 18 ans sans avis médical.'],
      ['Que recommande l’ANSES à propos des boissons énergisantes pour les adolescents ?', ['En boire avant chaque match', 'En faire une boisson quotidienne', 'Les mélanger avec de l’alcool', 'Les déconseiller'], 3, 'Ces boissons sont déconseillées aux adolescents, et la caféine n’est pas pour les mineurs.'],
      ['Faire un régime strict ou un jeûne est une bonne idée pendant la croissance.', ['Vrai', 'Faux'], 1, 'Pendant la croissance, le corps a besoin d’énergie et de nutriments : on évite régimes et jeûne.'],
      ['Pourquoi un complément alimentaire peut-il poser problème à un athlète ?', ['Il peut contenir des substances dopantes non indiquées', 'Il est toujours gratuit', 'Il rend invisible aux contrôles', 'Il est interdit de le manger'], 0, 'Certains compléments contiennent des produits interdits : le contrôle positif « involontaire » reste un contrôle positif.'],
      ['La veille d’un match, que choisir ?', ['Seulement une boisson énergisante', 'Pâtes, protéines, légumes et eau, sans nouveauté', 'Un aliment inconnu pour tester', 'Rien du tout'], 1, 'Féculents et protéines habituels, sans essai de nouveauté : on ne teste jamais un aliment le jour J.'],
    ],
  },
  {
    titre: 'Blessures du sportif : entorse, tendinite, claquage, commotion',
    axe: 'La science de l’effort',
    lecon: {
      titre: 'Reconnaître, soigner, repartir',
      cours: `Trois scènes de vestiaire. Un joueur s’assoit en grimaçant, la cheville gonflée. Une coureuse a le tendon d’Achille qui tire chaque matin. Un rugbyman s’est cogné la tête, dit que « ça va », mais se répète. Trois blessures, trois conduites à tenir : savoir les reconnaître évite de les aggraver.

## L’entorse : la cheville en tête
Une **entorse** est une lésion d’un **ligament**, la bande qui tient l’articulation. La cheville est la plus touchée. On distingue **trois grades** : étirement, déchirure partielle, rupture complète. Dans l’immédiat, on applique le réflexe **PEACE & LOVE** : on **protège** la zone au début, on **comprime**, on **surélève**, on **éduque** (pas de panique). Puis, très vite, on **remet en mouvement progressivement**, sans douleur vive, car l’articulation a besoin de bouger pour guérir.

## La « tendinite », en réalité une surcharge
La plupart des douleurs qu’on nomme tendinites sont des **tendinopathies de surcharge**: le tendon a reçu **trop d’effort, trop vite**. La solution est d’adapter la charge et de renforcer progressivement, pas d’arrêter tout mouvement.

## Les lésions musculaires, par gravité
| Lésion | Ce qui se passe | Délai indicatif |
| Contracture | muscle durci, douloureux | environ une semaine |
| Élongation | fibres étirées | quelques semaines |
| Claquage | rupture de quelques fibres | plusieurs semaines |
| Déchirure | rupture plus étendue | 6 semaines et plus |

Ces délais sont indicatifs : seul un avis médical précise la durée du repos.

## La commotion cérébrale
> Au moindre doute, on sort.

Après un choc à la tête, on reconnaît une **commotion** à plusieurs signes : maux de tête, confusion, nausées, troubles de la vue. Le joueur ne finit **jamais** le match, même s’il dit aller bien. Le retour se fait par **repos, puis reprise progressive par paliers**, et prend **plusieurs semaines** pour un mineur. Un second choc sur un cerveau déjà fragilisé peut être grave.

!> Un sportif qui a peur de décevoir peut cacher ses symptômes. C’est à l’entraîneur, aux coéquipiers et à l’arbitre d’agir à sa place.

## Quand consulter ?
Une douleur qui **persiste**, un genou ou une cheville qui se **bloque**, un gonflement important, une douleur qui réveille la nuit, des symptômes après un choc à la tête : on consulte un médecin, on ne s’improvise pas kiné.

## Prévenir plutôt que guérir
L’échauffement, la progressivité, le renforcement, le sommeil et l’hydratation sont la première assurance contre la blessure.

## À retenir
- Entorse : lésion d’un ligament en trois grades ; protéger au début, puis remettre en mouvement progressivement.
- La tendinite est une surcharge (trop, trop vite) ; les lésions musculaires vont de la contracture (une semaine) à la déchirure (6 semaines et plus).
- Commotion : au moindre doute, on sort ; retour par paliers, plusieurs semaines chez un mineur.`,
    },
    questions: [
      ['Quel tissu est touché lors d’une entorse ?', ['Un nerf', 'Un muscle uniquement', 'Un ligament', 'Un os'], 2, 'Un ligament tient l’articulation ; l’entorse le met à rude épreuve, voire le rompt.'],
      ['Combien de grades distingue-t-on pour une entorse ?', ['Trois', 'Sept', 'Un seul', 'Deux'], 0, 'Du simple étirement à la rupture complète, on décrit trois grades.'],
      ['Quelle articulation est la plus souvent touchée par les entorses ?', ['La cheville', 'Le coude', 'Le poignet', 'La nuque'], 0, 'La cheville encaisse des appuis violents et des torsions : c’est l’entorse la plus fréquente.'],
      ['Que mettent en avant les recommandations « PEACE & LOVE » après la phase initiale ?', ['Masser très fort', 'Remettre l’articulation en mouvement progressivement', 'Rester immobile pendant des mois', 'Forcer le plus vite possible'], 1, 'Bouger peu à peu, sans douleur vive, aide l’articulation à guérir mieux que l’immobilité totale.'],
      ['Une « tendinite » est en réalité le plus souvent…', ['Un os cassé', 'Un manque d’eau', 'Une tendinopathie de surcharge', 'Un microbe'], 2, 'Le tendon a reçu trop d’effort trop vite : on adapte la charge et on renforce progressivement.'],
      ['Quelle lésion musculaire est la plus grave ?', ['La contracture', 'La courbature', 'Le point de côté', 'La déchirure'], 3, 'La déchirure est la rupture la plus étendue ; elle demande 6 semaines et plus.'],
      ['Après un choc à la tête avec confusion, le joueur doit finir le match s’il se sent mieux.', ['Vrai', 'Faux'], 1, 'Au moindre doute, on sort : un second choc sur un cerveau fragilisé peut être grave.'],
      ['Parmi ces signes, lequel évoque une commotion ?', ['Mal de tête, confusion, nausée', 'Une crampe au mollet', 'Un hoquet', 'Une courbature'], 0, 'Maux de tête, confusion, nausées et troubles de la vue sont les signes d’une commotion.'],
      ['Comment se fait le retour au sport après une commotion ?', ['Sans avis médical', 'Repos, puis reprise progressive par paliers', 'Directement en match', 'Par un sprint maximal'], 1, 'Le cerveau a besoin de repos, puis d’une reprise graduée sur plusieurs semaines chez un mineur.'],
      ['Une contracture dure en général environ…', ['Un jour exactement', 'Dix ans', 'Une semaine', 'Un an'], 2, 'C’est la lésion musculaire la plus bénigne, d’environ une semaine à titre indicatif.'],
      ['Une douleur qui persiste ou une articulation qui se bloque justifie de consulter un médecin.', ['Vrai', 'Faux'], 0, 'Ce sont des signes d’alerte : on consulte au lieu de s’improviser soignant.'],
      ['Quelle est la meilleure prévention des blessures ?', ['Ne jamais s’entraîner', 'Forcer chaque séance', 'Supprimer l’échauffement', 'Échauffement, progressivité, renforcement et sommeil'], 3, 'Un corps préparé, progressivement entraîné et reposé encaisse beaucoup mieux les efforts.'],
    ],
  },
  // ---- Le sport, une histoire ---------------------------------------------
  {
    titre: 'Le sport moderne, une invention anglaise adoptée par la France',
    axe: 'Le sport, une histoire',
    lecon: {
      titre: 'Du jeu de collège anglais au club français',
      cours: `Pourquoi dit-on « football » et pas « balle au pied » ? Pourquoi « tennis », « rugby », « match », « penalty » ? Parce que le sport tel qu’on le pratique aujourd’hui est né en Angleterre au XIXe siècle, avec ses règles, ses clubs, ses mots… et la France l’a adopté à son tour.

## Des jeux de collège aux règles écrites
Au XIXe siècle, dans les **public schools** anglaises, les élèves jouent à des jeux de balle, chacun avec ses règles locales. Pour que des équipes de lieux différents puissent s’affronter, il faut écrire des règles communes. C’est la naissance du sport moderne : des **règles codifiées**, des **clubs**, des **fédérations**.
| Date | Événement |
| 1863 | création de la Football Association |
| 1871 | création de la Rugby Football Union |
| 1874 | brevet du lawn-tennis |
| 1877 | premier tournoi de Wimbledon |

À l’époque, les sportifs sont des **amateurs**, qui jouent par plaisir et ne sont pas payés. Les **professionnels**, payés pour jouer, sont mal vus : l’opposition entre les deux va durer plus d’un siècle.

> Le sport moderne naît d’une idée simple : des règles écrites, les mêmes pour tous.

## L’arrivée en France
Ce sont des **Anglais installés en France** qui apportent leurs jeux. On fonde des clubs : le **Havre Athletic Club** en 1872, le **Racing Club de France** en 1882, le **Stade français** en 1883. D’abord réservé à une élite, le sport se diffuse peu à peu.

## Avant le sport, la gymnastique
En France, avant le sport, c’est la **gymnastique** qui domine, inspirée du modèle allemand du **Turnen**. On pratique la gymnastique dans les écoles et les **bataillons scolaires** : le but est de former des corps forts pour la patrie. Le sport anglais, plus libre et plus ludique, va peu à peu s’imposer face à cette discipline.

## Une loi pour s’associer
La **loi de 1901** permet à n’importe qui de créer une **association**. Des milliers de clubs sportifs apparaissent partout en France : c’est encore aujourd’hui la base du sport français.

## Le Front populaire et le sport pour tous
En 1936, le gouvernement du **Front populaire** crée un sous-secrétariat d’État aux Sports et aux Loisirs confié à **Léo Lagrange**. Avec les **congés payés**, le sport et les loisirs deviennent accessibles au plus grand nombre : on développe les **auberges de jeunesse** et on proclame le sport pour tous.

!> Le sport n’a pas toujours été « pour tout le monde » : c’est une conquête, et elle est récente.

## L’État et le sport après 1945
Après 1945, l’État organise le sport : un **ministère**, des **fédérations** qui gèrent chaque discipline, et le **mouvement sportif**. Pour les jeunes, le **sport scolaire** (UNSS) propose des compétitions entre établissements.

## À retenir
- Le sport moderne naît en Angleterre au XIXe siècle : règles écrites, clubs, fédérations (Football Association en 1863, Rugby Football Union en 1871).
- La France l’adopte à partir de 1872 (Le Havre AC), après avoir longtemps privilégié la gymnastique.
- La loi de 1901 et le Front populaire (1936) font du sport un loisir pour tous.`,
    },
    questions: [
      ['Dans quel pays est né le sport moderne au XIXe siècle ?', ['L’Angleterre', 'La France', 'L’Italie', 'Les États-Unis'], 0, 'Dans les public schools et les clubs anglais, on a codifié les jeux : des règles écrites, les mêmes pour tous.'],
      ['En quelle année la Football Association a-t-elle été créée ?', ['1998', '1863', '1763', '1913'], 1, 'En 1863, elle fixe les premières règles communes du football ; la Rugby Football Union suivra en 1871.'],
      ['Quel tournoi de tennis débute en 1877 ?', ['Les Jeux olympiques', 'Le Tour de France', 'Wimbledon', 'Roland-Garros'], 2, 'Le lawn-tennis est breveté en 1874, et Wimbledon organise son premier tournoi en 1877.'],
      ['Un sportif « amateur » est un sportif…', ['payé pour jouer', 'qui ne s’entraîne jamais', 'étranger', 'qui joue par plaisir, sans être payé'], 3, 'Au XIXe siècle, les amateurs s’opposent aux professionnels, payés pour jouer.'],
      ['Quel club est fondé au Havre en 1872 ?', ['Le Havre Athletic Club', 'Le Stade français', 'Le Racing Club de France', 'Le Paris Saint-Germain'], 0, 'Le Havre AC, créé en 1872, est l’un des premiers clubs à introduire le sport anglais en France.'],
      ['Qui a apporté les premiers sports modernes en France ?', ['Aucun étranger', 'Des Anglais installés en France', 'Des Espagnols', 'Des Japonais'], 1, 'Ce sont des Anglais installés en France qui ont apporté leurs jeux et fondé les premiers clubs.'],
      ['Avant le sport, quelle pratique domine à l’école en France ?', ['Le tennis', 'L’escalade', 'La gymnastique, inspirée du Turnen allemand', 'Le rugby'], 2, 'La gymnastique et les bataillons scolaires devaient former des corps forts avant l’arrivée du sport.'],
      ['Quelle loi permet de créer librement des associations sportives ?', ['La loi de 1789', 'La loi de 1936', 'La loi de 2024', 'La loi de 1901'], 3, 'La loi de 1901 donne à tous le droit de fonder une association : les clubs se multiplient.'],
      ['Léo Lagrange est associé…', ['au sport pour tous sous le Front populaire en 1936', 'à la création du football en 1863', 'au tennis de 1877', 'au dopage'], 0, 'Avec les congés payés, il incarne en 1936 l’idée que le sport et les loisirs sont pour tous.'],
      ['Le sport moderne est né sans aucune règle écrite.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : le sport moderne naît de la codification, c’est-à-dire des règles écrites communes à tous.'],
      ['Le Racing Club de France est créé en 1882.', ['Vrai', 'Faux'], 0, 'C’est l’un des premiers clubs français, avec le Havre AC (1872) et le Stade français (1883).'],
      ['En France, l’UNSS organise…', ['les transferts de joueurs', 'le sport scolaire', 'le Tour de France', 'les Jeux olympiques'], 1, 'L’UNSS propose des compétitions entre établissements : c’est le sport scolaire.'],
    ],
  },
  {
    titre: 'Le sport et la politique : 1936, 1968, 1980, 2024',
    axe: 'Le sport, une histoire',
    lecon: {
      titre: 'Le sport n’est jamais neutre',
      cours: `16 octobre 1968, stade olympique de Mexico. Sur le podium du 200 m, deux Américains montent chacun un poing ganté de noir, la tête baissée, pendant l’hymne. L’image fait le tour du monde. Elle prouve une chose : le sport n’a jamais été à l’écart de la politique.

## Berlin 1936 : la vitrine d’un régime
Les Jeux de 1936 se tiennent dans l’Allemagne d’**Hitler**, qui en fait une vitrine pour la **propagande** nazie. La cinéaste **Leni Riefenstahl** les filme. Mais l’Américain **Jesse Owens**, athlète noir, gagne **quatre médailles d’or**, et ruine le discours sur la supériorité d’une prétendue race.

## Mexico 1968 : le poing levé
Sur le podium, **Tommie Smith** et **John Carlos** lèvent le poing pour dénoncer le sort des Noirs américains. Le deuxième du 200 m, l’Australien **Peter Norman**, se montre solidaire des deux Américains.

## Munich 1972 : le drame
Un commando attaque l’équipe d’**Israël** : **onze** membres de la délégation sont tués. Les Jeux sont l’une des scènes d’un conflit qui les dépasse.

## Les boycotts de la guerre froide
| Année | Ce qui se passe |
| 1980, Moscou | une soixantaine de pays boycottent après l’invasion de l’Afghanistan par l’URSS |
| 1984, Los Angeles | l’URSS et ses alliés boycottent à leur tour |

## L’apartheid et le ping-pong
L’**Afrique du Sud**, pays de l’apartheid, est exclue des Jeux de **1964 à 1992**. À l’inverse, en **1971**, la « **diplomatie du ping-pong** » rapproche États-Unis et Chine : des joueurs de tennis de table servent de messagers.

> Le sport peut diviser, mais il peut aussi ouvrir une porte que la diplomatie n’ose pas encore pousser.

## Aujourd’hui
- **Pékin 2008** : les Jeux sont une vitrine du pouvoir chinois.
- **Russie** : suspendue depuis 2022, elle voit ses athlètes concourir à **Paris 2024** sous bannière « neutre ».
- **Qatar 2022** : la Coupe du monde relance le débat sur les droits humains.

!> Qu’on le veuille ou non, un grand événement sportif est aussi un message politique : il se prépare, se critique et se célèbre.

## Pourquoi les États investissent-ils dans le sport ?
Organiser des Jeux ou une Coupe du monde, c’est montrer sa puissance, son organisation et son image. D’où l’intérêt des pays à accueillir ces événements, et l’importance des athlètes qui, par leurs gestes, rappellent que le sport est fait d’humains.

## À retenir
- Berlin 1936 (propagande, quatre ors de Jesse Owens) et Mexico 1968 (poing levé de Smith et Carlos) montrent le sport comme scène politique.
- Munich 1972, Moscou 1980 et Los Angeles 1984 : attentat et boycotts.
- Aujourd’hui encore : Russie suspendue depuis 2022, Qatar 2022 et droits humains.`,
    },
    questions: [
      ['Combien de médailles d’or Jesse Owens a-t-il gagnées à Berlin en 1936 ?', ['Dix', 'Aucune', 'Quatre', 'Une'], 2, 'Ses quatre ors dans l’Allemagne nazie ont contredit le discours de propagande sur la supériorité raciale.'],
      ['Qui filme les Jeux de Berlin pour le régime nazi ?', ['Alice Milliat', 'Léo Lagrange', 'Pierre de Coubertin', 'Leni Riefenstahl'], 3, 'La cinéaste Leni Riefenstahl a mis en images les Jeux de 1936.'],
      ['Quel geste Tommie Smith et John Carlos font-ils à Mexico en 1968 ?', ['Ils lèvent le poing ganté de noir', 'Ils s’agenouillent', 'Ils quittent le stade', 'Ils chantent'], 0, 'Le 16 octobre 1968, poing levé, ils dénoncent le sort des Noirs américains.'],
      ['Qui est Peter Norman ?', ['Un dirigeant du CIO', 'L’Australien deuxième du 200 m, solidaire du geste', 'Un arbitre', 'Un entraîneur américain'], 1, 'Il se montre solidaire des deux Américains sur le podium.'],
      ['Quelle équipe est attaquée aux Jeux de Munich en 1972 ?', ['L’équipe de Chine', 'L’équipe d’Italie', 'L’équipe d’Israël', 'L’équipe de France'], 2, 'Onze membres de la délégation israélienne sont tués lors de cet attentat.'],
      ['Pourquoi les Jeux de Moscou en 1980 sont-ils boycottés par une soixantaine de pays ?', ['À cause d’une grève', 'À cause de la météo', 'À cause d’un virus', 'À cause de l’invasion de l’Afghanistan par l’URSS'], 3, 'C’est une réaction politique à l’invasion soviétique de l’Afghanistan.'],
      ['Qui boycotte les Jeux de Los Angeles en 1984 ?', ['L’URSS et ses alliés', 'Les États-Unis', 'La France', 'Le Japon'], 0, 'Les Soviétiques répondent au boycott de 1980 : c’est la logique de la guerre froide.'],
      ['L’Afrique du Sud, pays de l’apartheid, a été exclue des Jeux de…', ['1936 à 1948', '1964 à 1992', '1900 à 1924', '2000 à 2010'], 1, 'Le sport a servi de moyen de pression contre l’apartheid.'],
      ['Qu’appelle-t-on la « diplomatie du ping-pong » ?', ['Un boycott', 'Un attentat', 'Le rapprochement États-Unis–Chine en 1971', 'Un traité sur le tennis'], 2, 'Des joueurs de tennis de table ont servi de messagers entre les deux pays en 1971.'],
      ['Le sport est toujours neutre et sans lien avec la politique.', ['Vrai', 'Faux'], 1, 'L’histoire montre l’inverse : propagande, boycotts, gestes de protestation… le sport n’est jamais neutre.'],
      ['Depuis 2022, quel pays est suspendu des compétitions internationales avec des athlètes « neutres » à Paris 2024 ?', ['La Belgique', 'Le Canada', 'L’Espagne', 'La Russie'], 3, 'Les athlètes russes ne concourent pas sous leur drapeau : ils sont « neutres » à Paris 2024.'],
      ['La Coupe du monde 2022 au Qatar a relancé le débat sur…', ['les droits humains', 'le prix des billets d’avion', 'la météo', 'le nombre de buts'], 0, 'Les conditions de travail et les libertés au Qatar ont nourri la critique de l’événement.'],
    ],
  },
  {
    titre: 'Les femmes dans le sport : d’Alice Milliat à la parité',
    axe: 'Le sport, une histoire',
    lecon: {
      titre: 'Une frise de conquêtes',
      cours: `En 1900, aux Jeux de Paris, vingt-deux femmes sont autorisées à concourir. En 2024, toujours à Paris, les Jeux sont les premiers de l’histoire à atteindre la parité. Entre les deux, plus d’un siècle de combats, menés par des femmes qui ont refusé qu’on leur dise « ce n’est pas fait pour vous ».

## Une frise du XXe siècle à aujourd’hui
| Année | Ce qui se passe |
| 1900 | 22 femmes aux Jeux de Paris ; Charlotte Cooper gagne en tennis |
| 1921 | Alice Milliat fonde la FSFI |
| 1922 | premiers Jeux mondiaux féminins, à Paris |
| 1928 | l’athlétisme féminin entre aux Jeux |
| 1967 | Kathrine Switzer court le marathon de Boston avec un dossard |
| 1973 | Billie Jean King bat Bobby Riggs |
| 1984 | premier marathon olympique féminin, gagné par Joan Benoit |
| 2024 | premiers Jeux à parité, à Paris |

## Coubertin, hostile
Le fondateur des Jeux modernes, **Pierre de Coubertin**, est hostile à la présence des femmes. Face à ce refus, **Alice Milliat** (1884-1957) ne s’avoue pas vaincue : elle fonde la **FSFI** en 1921 et organise les **Jeux mondiaux féminins** à Paris en 1922.

> Quand on ferme la porte, on en ouvre une autre.

## Le 800 m, retiré pour « trop dur »
En **1928**, l’athlétisme féminin entre enfin aux Jeux. Mais le **800 m** est retiré du programme jusqu’en **1960**, sous prétexte que l’épreuve serait « trop dure » pour les femmes.

## Deux gestes qui changent tout
- **1967** : **Kathrine Switzer** s’inscrit au marathon de Boston. Elle prend le départ avec un dossard et court.
- **1973** : **Billie Jean King** bat **Bobby Riggs** : la « **bataille des sexes** » est un événement mondial.

En **1984**, le marathon féminin devient enfin olympique, et c’est **Joan Benoit** qui le remporte.

## Les championnes françaises
Aujourd’hui, des noms comme **Amandine Henry**, **Wendie Renard** (football), **Clarisse Agbegnenou** (judo) ou **Pauline Ferrand-Prévot** (cyclisme) sont connus du grand public. En 2024, le championnat de football féminin devient professionnel en France : la **Première Ligue**.

## Ce qui reste inégal
!> La parité aux Jeux ne veut pas dire l’égalité partout : la **médiatisation**, les **primes**, la présence de **femmes dirigeantes** restent plus faibles chez les femmes que chez les hommes.

## À retenir
- 1900 : 22 femmes aux Jeux ; Coubertin est hostile ; Alice Milliat fonde la FSFI en 1921 et les Jeux mondiaux féminins en 1922.
- 1928 : l’athlétisme féminin entre aux Jeux ; 1967 Switzer à Boston ; 1973 Billie Jean King ; 1984 premier marathon olympique féminin.
- Paris 2024 : premiers Jeux à parité, mais médiatisation, primes et dirigeantes restent inégales.`,
    },
    questions: [
      ['Combien de femmes participent aux Jeux de Paris en 1900 ?', ['Aucune', '22', '2 000', '220'], 1, 'Elles sont vingt-deux : les femmes entrent aux Jeux, mais en très petit nombre.'],
      ['Quelle sportive gagne le tournoi de tennis des Jeux de 1900 ?', ['Joan Benoit', 'Billie Jean King', 'Charlotte Cooper', 'Alice Milliat'], 2, 'Charlotte Cooper, en tennis, est l’une des premières championnes olympiques.'],
      ['Qui fonde la FSFI en 1921 ?', ['Pierre de Coubertin', 'Léo Lagrange', 'Joan Benoit', 'Alice Milliat'], 3, 'Alice Milliat crée la Fédération sportive féminine internationale face au refus de Coubertin.'],
      ['Où ont lieu les premiers Jeux mondiaux féminins en 1922 ?', ['À Paris', 'À Londres', 'À Berlin', 'À New York'], 0, 'Paris accueille ces Jeux organisés par Alice Milliat et la FSFI.'],
      ['Quel est le point de vue de Coubertin sur les femmes aux Jeux ?', ['Il les choisit lui-même', 'Il y est hostile', 'Il les encourage fortement', 'Il en est indifférent'], 1, 'Coubertin refuse leur présence, ce qui pousse Alice Milliat à créer ses propres Jeux.'],
      ['Après son entrée aux Jeux en 1928, quelle épreuve féminine est retirée jusqu’en 1960 ?', ['Le relais', 'Le tennis', 'Le 800 m', 'Le saut en longueur'], 2, 'On a jugé le 800 m « trop dur » pour les femmes, un préjugé sans fondement.'],
      ['Que fait Kathrine Switzer en 1967 ?', ['Elle gagne Wimbledon', 'Elle remporte l’or à Paris', 'Elle fonde la FSFI', 'Elle court le marathon de Boston avec un dossard'], 3, 'Elle court le marathon de Boston avec un dossard, à une époque où cela ne se faisait pas.'],
      ['Qui bat Bobby Riggs en 1973 lors de la « bataille des sexes » ?', ['Billie Jean King', 'Joan Benoit', 'Clarisse Agbegnenou', 'Wendie Renard'], 0, 'La victoire de Billie Jean King devient un symbole mondial de l’égalité.'],
      ['Qui gagne le premier marathon olympique féminin en 1984 ?', ['Amandine Henry', 'Joan Benoit', 'Kathrine Switzer', 'Alice Milliat'], 1, 'Joan Benoit remporte le premier marathon olympique féminin, dix-sept ans après Boston 1967.'],
      ['Les Jeux de Paris 2024 sont les premiers à atteindre la parité hommes-femmes.', ['Vrai', 'Faux'], 0, 'Il y a autant d’athlètes femmes que d’hommes : une première dans l’histoire des Jeux.'],
      ['La parité aux Jeux signifie que tout est égal dans le sport.', ['Vrai', 'Faux'], 1, 'La médiatisation, les primes et la présence de dirigeantes restent inégales.'],
      ['Comment s’appelle le championnat féminin de football devenu professionnel en France en 2024 ?', ['La Coupe du monde', 'Le Top 14', 'La Première Ligue', 'La Ligue des champions'], 2, 'La Première Ligue marque la professionnalisation du football féminin français.'],
    ],
  },
  {
    titre: 'Le sport business : droits TV, sponsors, salaires',
    axe: 'Le sport, une histoire',
    lecon: {
      titre: 'D’où vient l’argent du sport',
      cours: `Tu achètes un maillot à quatre-vingts euros. Où va cet argent ? Une partie à la marque, une autre au club, une autre au magasin… Et le reste du système, c’est le « sport business » : un monde où s’échangent des milliards, et où chaque euro a une origine.

## D’où vient l’argent ?
| Source | Qui paie |
| Droits TV | les chaînes qui diffusent les matchs |
| Sponsors et équipementiers | des marques comme Nike ou Adidas |
| Billetterie | les spectateurs |
| Transferts | un club qui achète un joueur à un autre |
| Propriétaires | des États ou des fonds d’investissement |

## Les droits TV : un équilibre fragile
Le football français vit en partie de la télévision. En **2020**, la chaîne **Mediapro** fait faillite, laissant la Ligue 1 sans diffuseur. Puis vient **DAZN** en 2024-25, avant que la Ligue lance sa propre chaîne, **Ligue 1+**, en 2025. La **Premier League** anglaise, elle, est beaucoup plus riche : ses droits TV rapportent bien davantage.

## Les transferts et les propriétaires
Le record historique est celui de **Neymar**, acheté **222 millions d’euros** en 2017 par le PSG. Depuis **2011**, le PSG appartient au **Qatar** : ce n’est pas un cas unique, des clubs sont détenus par des États ou des fonds.

> Quand l’argent d’un propriétaire est illimité, la compétition devient inégale.

## Les règles de l’UEFA
Pour éviter les excès, l’UEFA impose des règles de **durabilité financière** : un club ne doit pas dépenser durablement plus qu’il ne gagne.

## Les salaires et leurs écarts
!> Les écarts sont immenses : entre stars et amateurs, et entre hommes et femmes. La majorité des sportifs ne vivent pas de leur sport.

## Les Jeux de Paris 2024
Le **comité d’organisation** a un budget d’environ **4,4 milliards d’euros**, financé surtout par le **privé**. Les **infrastructures** représentent environ **4,5 milliards**. La **Cour des comptes** a estimé en 2025 le coût public à environ 6,6 milliards d’euros : ces chiffres sont des estimations et se discutent.

## Paris sportifs et e-sport
Les **paris sportifs** et l’**e-sport** (les compétitions de jeux vidéo) sont d’autres secteurs en plein essor. Ils posent aussi la question de l’addiction et de la protection des plus jeunes.

## Où va le prix d’un maillot ?
Une part revient à l’équipementier, une part au club (et à ses joueurs), une part au distributeur : le maillot est un produit de marque autant qu’un souvenir de supporter.

## À retenir
- L’argent du sport vient des droits TV, des sponsors, de la billetterie, des transferts et des propriétaires.
- Mediapro (2020), DAZN (2024-25) puis Ligue 1+ (2025) : la télévision reste fragile en France ; Neymar, 222 millions d’euros en 2017.
- L’UEFA encadre la dépense (durabilité financière) ; les écarts de salaires restent immenses.`,
    },
    questions: [
      ['Quelle est la principale source d’argent d’un championnat de football ?', ['La vente de ballons', 'Les cours de sport', 'Les amendes', 'Les droits de télévision'], 3, 'Les chaînes paient très cher pour diffuser les matchs : c’est une ressource majeure.'],
      ['Quelle chaîne a fait faillite en 2020 en laissant la Ligue 1 sans diffuseur ?', ['Mediapro', 'DAZN', 'Ligue 1+', 'Canal+'], 0, 'La faillite de Mediapro en 2020 a fragilisé les finances de la Ligue 1.'],
      ['Quelle chaîne la Ligue a-t-elle lancée elle-même en 2025 ?', ['Eurosport', 'Ligue 1+', 'DAZN', 'Mediapro'], 1, 'Après DAZN en 2024-25, la Ligue crée sa propre chaîne, Ligue 1+.'],
      ['Quel joueur détient le record de transfert, 222 millions d’euros en 2017 ?', ['Mbappé', 'Messi', 'Neymar', 'Zidane'], 2, 'Neymar a été acheté par le PSG pour 222 millions d’euros en 2017.'],
      ['Depuis quelle année le PSG appartient-il au Qatar ?', ['1970', '1999', '2024', '2011'], 3, 'Depuis 2011, des investisseurs qataris détiennent le club.'],
      ['À quoi servent les règles de « durabilité financière » de l’UEFA ?', ['Éviter qu’un club dépense durablement plus qu’il ne gagne', 'Fixer le prix des billets', 'Choisir les arbitres', 'Interdire les sponsors'], 0, 'Elles limitent les déficits et l’avantage des propriétaires trop riches.'],
      ['La Premier League anglaise tire des droits TV bien plus élevés que la Ligue 1.', ['Vrai', 'Faux'], 0, 'Son marché est beaucoup plus riche : ses droits TV rapportent bien davantage.'],
      ['Qui finance surtout le comité d’organisation de Paris 2024 ?', ['Aucune entreprise', 'Le privé', 'Uniquement les impôts locaux', 'Les spectateurs seuls'], 1, 'Le budget d’environ 4,4 milliards d’euros du comité vient surtout de ressources privées.'],
      ['Le coût public des Jeux de Paris 2024 est connu avec une précision parfaite.', ['Vrai', 'Faux'], 1, 'Ce sont des estimations, comme celle de la Cour des comptes en 2025 : elles se discutent.'],
      ['Tous les sportifs gagnent des fortunes.', ['Vrai', 'Faux'], 1, 'Les écarts sont immenses : la majorité des sportifs ne vivent pas de leur sport.'],
      ['Quelles marques sont des équipementiers célèbres ?', ['Apple et Google', 'Danone et Nestlé', 'Nike et Adidas', 'Michelin et Renault'], 2, 'Elles fabriquent les maillots et les chaussures et sponsorisent clubs et athlètes.'],
      ['Que désigne l’e-sport ?', ['Le sport en extérieur', 'Le sport électrique', 'Un régime alimentaire', 'Les compétitions de jeux vidéo'], 3, 'C’est une compétition de jeux vidéo, aussi en plein essor économique.'],
    ],
  },
  {
    titre: 'Le dopage : de Festina à l’AMA',
    axe: 'Le sport, une histoire',
    lecon: {
      titre: 'Pourquoi on triche, et pourquoi ça ne vaut pas le coup',
      cours: `Juillet 1998. À la frontière franco-belge, la police fouille la voiture d’un soigneur de l’équipe Festina et y trouve des centaines de produits dopants. Le Tour de France plonge dans la crise. Ce scandale n’est pas le premier ni le dernier : il montre que la triche tente, et qu’elle coûte cher.

## Qu’est-ce que le dopage ?
Le **dopage**, c’est l’usage de **substances ou de méthodes interdites** pour améliorer artificiellement ses performances. La liste des produits interdits est **mise à jour chaque année**. Se doper, c’est tricher, c’est aussi mettre sa santé en danger.

## Quelques affaires qui ont marqué l’histoire
| Année | Affaire |
| 1967 | Tom Simpson meurt sur le Mont Ventoux |
| 1988 | Ben Johnson est déclassé après son 100 m à Séoul |
| 1998 | affaire Festina sur le Tour de France (Willy Voet) |
| 2012 | Lance Armstrong déchu de ses titres |
| 2016 | rapport McLaren sur le dopage d’État en Russie |

## L’organisation de la lutte
- L’**AMA** (Agence mondiale antidopage) est créée en **1999**, siège à Montréal. Elle édicte le **Code mondial antidopage**.
- En France, l’**AFLD** (Agence française de lutte contre le dopage) date de **2006**.
- Les athlètes subissent des **contrôles inopinés** et doivent indiquer où ils se trouvent (système **ADAMS**).
- Le **passeport biologique** suit leurs valeurs sanguines dans le temps, pour repérer les anomalies.
- La sanction habituelle est de **4 ans** de suspension.

> Le contrôle ne se contente pas de chercher un produit : il suit le corps dans la durée.

## Ce que ça fait au corps
Le dopage n’a rien de magique : l’**EPO** rend le sang plus épais (risque cardiaque), les **anabolisants** abîment cœur, foie et système hormonal, l’**hormone de croissance** dérègle l’organisme. Des sportifs en sont morts.

## Les autorisations thérapeutiques
Un sportif malade peut parfois avoir besoin d’un médicament interdit. L’**AUT** (autorisation à usage thérapeutique) lui permet de le prendre légalement, après examen par un médecin.

## Le dopage « involontaire »
!> Certains compléments alimentaires contiennent des substances interdites non étiquetées. Dire « je ne savais pas » ne protège pas : l’athlète est toujours responsable de ce qu’il avale.

## Pourquoi on triche, et pourquoi ça ne vaut pas le coup
La pression de gagner, l’argent, la peur d’échouer poussent certains à tricher. Mais le risque est triple : pour la **santé**, pour la **carrière** (suspension, titres retirés) et pour l’**honneur**. Les médailles de Lance Armstrong ont fini retirées.

## À retenir
- Le dopage = substances ou méthodes interdites, listées chaque année ; affaires : Simpson (1967), Johnson (1988), Festina (1998), Armstrong (2012), Russie (2016).
- AMA (1999, Montréal), AFLD (2006), contrôles inopinés, ADAMS, passeport biologique, 4 ans de suspension.
- Les compléments peuvent contenir des produits dopants, et l’AUT est la seule dérogation légale.`,
    },
    questions: [
      ['Que désigne le dopage ?', ['L’usage de substances ou de méthodes interdites pour améliorer ses performances', 'Un régime alimentaire', 'Un type d’entraînement', 'Une blessure'], 0, 'C’est de la triche et un danger pour la santé : la liste des produits interdits est mise à jour chaque année.'],
      ['Quel coureur meurt sur le Mont Ventoux en 1967 ?', ['Willy Voet', 'Tom Simpson', 'Lance Armstrong', 'Ben Johnson'], 1, 'La mort de Tom Simpson a marqué les esprits et relancé le débat sur le dopage.'],
      ['Quel sprinter est déclassé après les Jeux de Séoul en 1988 ?', ['Usain Bolt', 'Carl Lewis', 'Ben Johnson', 'Jesse Owens'], 2, 'Ben Johnson perd son titre sur 100 m à cause d’un contrôle positif.'],
      ['Quelle affaire éclate pendant le Tour de France 1998 ?', ['L’affaire Mediapro', 'L’affaire Milliat', 'L’affaire Lagrange', 'L’affaire Festina'], 3, 'Willy Voet, soigneur de Festina, est arrêté avec des produits dopants dans sa voiture.'],
      ['Qu’est-il arrivé à Lance Armstrong en 2012 ?', ['Il a été déchu de ses titres', 'Il a reçu un trophée', 'Il a pris sa retraite avec les honneurs', 'Il a battu un record'], 0, 'Ses victoires lui ont été retirées après les révélations sur le dopage.'],
      ['Que révèle le rapport McLaren en 2016 ?', ['Une fraude de billetterie', 'Un dopage d’État en Russie', 'Un tournoi de tennis', 'Un record du monde'], 1, 'Il met en évidence un système de dopage organisé par l’État russe.'],
      ['En quelle année est créée l’Agence mondiale antidopage (AMA) ?', ['2020', '1945', '1999', '1899'], 2, 'L’AMA naît en 1999 ; son siège est à Montréal.'],
      ['Que fait le passeport biologique ?', ['Il donne le droit de voyager', 'Il vérifie le casier judiciaire', 'Il remplace le contrôle urinaire', 'Il suit les valeurs sanguines de l’athlète dans le temps'], 3, 'En observant l’évolution du sang, il repère des anomalies même sans produit détecté.'],
      ['Quelle est la sanction habituelle d’un dopage en principe ?', ['4 ans de suspension', '1 jour', 'Un simple avertissement', 'Aucune sanction'], 0, 'Quatre ans en principe, ce qui peut mettre fin à une carrière.'],
      ['Que permet une AUT ?', ['Gagner une médaille', 'Prendre légalement un médicament interdit pour une raison médicale', 'Se doper sans contrôle', 'Ne jamais être testé'], 1, 'L’autorisation à usage thérapeutique est la seule dérogation légale, après examen médical.'],
      ['L’EPO épaissit le sang et fait courir un risque cardiaque.', ['Vrai', 'Faux'], 0, 'Un sang plus épais gêne la circulation et peut provoquer des accidents cardiaques.'],
      ['Si un complément alimentaire contenait un produit interdit à l’insu du sportif, celui-ci n’est pas responsable.', ['Vrai', 'Faux'], 1, 'L’athlète est toujours responsable de ce qu’il avale : « je ne savais pas » ne protège pas.'],
    ],
  },
]

// Les identifiants des chapitres de CE bloc, sur ses deux niveaux : tout
// chapitre de Sport de ces niveaux qui n'en fait pas partie est un chapitre de
// l'ancienne matière, et part.
const ids = NIVEAUX.flatMap((niveau) => chapitres.map((ch) => uuid(`sport|${niveau}|${ch.titre}`)))
const listeIds = ids.map((id) => `'${id}'::uuid`).join(', ')
const listeNiveaux = NIVEAUX.map((n) => `'${n}'`).join(', ')

export default {
  slug: 'sport',
  nom: 'Sport',

  titreMigration: 'SPORT 2de · 1re — « S’ENTRAÎNER », LA CULTURE SPORTIVE (10 fiches)',

  motif: `LA MATIÈRE SPORT EST REFAITE EN CULTURE SPORTIVE (14/10/2026, Lucas :
« on va s'écarter du programme : l'histoire du sport, notamment de la France,
les fondamentaux — hypertrophie, force, endurance, récupération, anti-blessure »).
Les 8 fiches du programme officiel (champs d'apprentissage, rôles sociaux…),
identiques de la 6e à la 3e, n'intéressaient personne : rien à réviser pour un
écrit, et la langue de l'institution. Cadrage : docs/CADRAGE-SPORT.md.
Ce bloc installe 10 fiches sur 2de et 1re, et retire les
anciens chapitres de Sport de ce(s) niveau(x) (cascade : leçons, quiz,
questions, cahier, contrôles, déblocages).`,

  menage: [
    {
      raison: `La 1re générale est ROUVERTE : la 278 l'avait retirée des niveaux de Sport
(« on ne révise pas l'EPS ») ; la culture sportive se lit à tout âge.`,
      sql: `UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug = 'sport';`,
    },
    {
      raison: `Les anciens chapitres de Sport (2de, 1re) partent — TOUS ceux dont
l'identifiant n'est pas dans ce bloc. Le ménage tourne AVANT les insertions ;
un rejeu ne touche donc jamais aux 10 fiches neuves (ni aux progrès des élèves
dessus). Les niveaux sont bornés à 2de et 1re : chaque bloc de la nouvelle
matière fait son propre ménage sur ses niveaux. La cascade (ON DELETE CASCADE
sur chapters) emporte leçons, quiz, questions, exercices, contrôles et
déblocages ; review_items n'a pas de clé étrangère et se vide à la main, et
les QUIZ se suppriment EXPLICITEMENT avant les chapitres : quizzes.lesson_id est en
ON DELETE SET NULL, pas en cascade — sans ce DELETE, les anciens quiz et leurs
questions resteraient orphelins et continueraient de nourrir Coach Turbo
(défaut trouvé au rejeu PGlite du 14/10/2026).`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});`,
    },
  ],

  blocs: [
    {
      niveaux: NIVEAUX,
      chapitres,
    },
  ],
}
