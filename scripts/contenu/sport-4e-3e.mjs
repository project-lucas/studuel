// SPORT — 4e · 3e : « COMPRENDRE » (10 fiches). La matière Sport refaite en
// CULTURE SPORTIVE (14/10/2026, Lucas : « on va s'écarter [du programme], on
// doit apporter l'histoire du sport notamment de la France, les fondamentaux
// du sport : hypertrophie, force, endurance, récupération, anti-blessure »).
// Le cadrage, le programme des 40 fiches et les règles de ton sont dans
// docs/CADRAGE-SPORT.md.
//
// Trois axes : les fondamentaux de l'entraînement (5), l'histoire du sport en
// France (4), arbitrer et jouer juste (1). Un seul module pour les deux
// niveaux : ce qui change entre la 4e et la 3e est la pratique, pas la culture.
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-4e-3e`.

import { createHash } from 'node:crypto'

const NIVEAUX = ['4e', '3e']

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
  // ---- Les fondamentaux de l'entraînement --------------------------------
  {
    titre: 'Force, vitesse, endurance : les trois moteurs',
    axe: 'Les fondamentaux de l’entraînement',
    lecon: {
      titre: 'Trois moteurs, trois méthodes',
      cours: `Sur la ligne de départ du 100 mètres, personne ne ressemble au coureur de marathon posté deux cents mètres plus loin. Pourtant, les deux ont le même corps de départ : ils ont simplement entraîné des moteurs différents.

## Les trois moteurs
Le sport repose sur trois qualités de base. Chacune répond à une question simple.

| Moteur | La question | Un exemple |
| **Force** | combien de tension puis-je produire contre une résistance ? | soulever, lancer, pousser un adversaire |
| **Vitesse** | à quelle vitesse puis-je réagir et exécuter ? | un départ de sprint, une frappe de balle |
| **Endurance** | combien de temps puis-je tenir sans m’effondrer ? | un match de 90 minutes, un cross |

La vitesse regroupe trois choses : le **temps de réaction** (partir au signal), la **fréquence** des mouvements (des appuis rapides) et l’**amplitude** (des foulées longues). L’endurance dont on parle ici est surtout **aérobie** : le corps fabrique son énergie avec de l’oxygène, ce qui permet de durer.

## Deux familles de fibres
Dans tes muscles cohabitent deux grandes familles de fibres.

| Fibre | Son talent | Qui en a beaucoup |
| Lente (type I) | tenir longtemps sans se fatiguer | le coureur de fond |
| Rapide (type II) | produire de la force et de la vitesse, mais s’épuiser vite | le sprinteur, le lanceur |

La proportion de chaque type est **en partie héritée**. Mais cela ne décide pas de tout : **tout s’entraîne**, et chacun peut progresser dans les trois moteurs.

## Trois portraits
- **Le sprinteur** : fibres rapides, départs explosifs, sprints très courts avec une **récupération complète** entre chaque, pour repartir frais et rester vraiment vite.
- **Le lanceur** : de la force maximale, des charges lourdes soulevées avec une technique parfaite, et de la vitesse d’exécution au moment du lancer.
- **Le coureur de fond** : des sorties longues à allure modérée, semaine après semaine, pour bâtir son endurance.

> Chaque moteur a sa méthode : on devient fort avec des charges, vite avec des sprints courts bien récupérés, endurant avec des efforts longs.

## Les deux moteurs oubliés
Deux qualités ne figurent pas sur la liste mais font gagner des matchs. La **souplesse** : l’amplitude de tes articulations, qui permet de bouger large sans se blesser. La **coordination** : faire travailler ensemble tes bras, tes jambes et ton regard, comme un dribble en courant ou une réception de volley.

## Mesurer, pour progresser
Quelques tests simples donnent un point de départ à refaire quelques mois plus tard.

| Test | Ce qu’il mesure |
| Saut en longueur sans élan | la détente des jambes |
| Sprint sur 30 m | la vitesse de départ |
| Test navette de Luc Léger (1982) | l’endurance |
| Flexion du tronc, jambes tendues | la souplesse |

Le but n’est pas de se comparer aux autres, mais à soi-même : refaire le même test trois mois plus tard montre si la méthode marche.

## Et à ton âge ?
Entre 13 et 15 ans, la **coordination** et la **vitesse** se travaillent particulièrement bien : le cerveau apprend vite les gestes nouveaux. La **force maximale**, elle, attend la fin de la croissance : on la prépare avec le poids du corps et des charges légères, sans jamais chercher la charge limite.

!> Un adolescent n’est pas un adulte en miniature : ses os grandissent encore. Technique d’abord, charge ensuite.

## À retenir
- Force, vitesse et endurance sont trois moteurs, chacun entraîné par sa propre méthode.
- Fibres lentes pour durer, fibres rapides pour la puissance : en partie héritées, mais tout s’entraîne.
- À 13-15 ans : coordination et vitesse d’abord, force maximale plus tard.`,
    },
    questions: [
      ['Que mesure la qualité physique appelée « force » ?', ['L’amplitude d’une articulation', 'La durée pendant laquelle on peut courir', 'La tension qu’on peut produire contre une résistance', 'La rapidité avec laquelle on réagit à un signal'], 2, 'La force, c’est produire de la tension contre une résistance : soulever, pousser, lancer.'],
      ['Quelles fibres musculaires fournissent surtout force et vitesse, mais se fatiguent vite ?', ['Les fibres rapides, de type II', 'Les fibres lentes, de type I', 'Les fibres du cœur uniquement', 'Aucune fibre : c’est le squelette'], 0, 'Les fibres rapides produisent beaucoup de puissance mais s’épuisent vite ; les fibres lentes durent plus longtemps.'],
      ['La proportion de fibres lentes et rapides décide de tout : on ne peut pas progresser contre elle.', ['Vrai', 'Faux'], 1, 'Elle est en partie héritée, mais tout s’entraîne : chacun peut progresser dans la force, la vitesse et l’endurance.'],
      ['Quelle méthode convient le mieux pour devenir plus vite en sprint ?', ['Des sorties de deux heures à allure lente', 'Des sprints courts avec récupération complète', 'Des étirements de dix minutes', 'Un sprint chaque minute sans pause'], 1, 'Pour rester vraiment vite, il faut repartir frais : sprints courts et récupération complète entre chaque.'],
      ['Quel moteur est entraîné par de longues sorties à allure modérée ?', ['La force maximale', 'Le temps de réaction', 'L’endurance', 'La souplesse'], 2, 'L’endurance aérobie se construit en tenant longtemps : des efforts longs et réguliers.'],
      ['Le test navette de Luc Léger, créé en 1982, évalue…', ['la détente verticale', 'la souplesse', 'l’endurance', 'la précision de tir'], 2, 'On court en aller-retour sur 20 mètres au rythme de bips de plus en plus rapides : le test mesure l’endurance.'],
      ['À 14 ans, il vaut mieux soulever la charge maximale pour progresser plus vite en force.', ['Vrai', 'Faux'], 1, 'La force maximale attend la fin de la croissance : à cet âge, on travaille la technique et le poids du corps.'],
      ['Parmi ces trois composantes, laquelle ne fait PAS partie de la vitesse ?', ['La fréquence des mouvements', 'Le temps de réaction', 'L’amplitude de la foulée', 'La souplesse du tronc'], 3, 'La vitesse regroupe réaction, fréquence et amplitude. La souplesse est une autre qualité.'],
      ['Que travaille le saut en longueur sans élan ?', ['La détente des jambes', 'L’endurance aérobie', 'La coordination des bras', 'La souplesse du dos'], 0, 'Ce test mesure la puissance des jambes sur un seul effort, c’est-à-dire la détente.'],
      ['La coordination est la capacité de faire travailler ensemble ses membres et son regard.', ['Vrai', 'Faux'], 0, 'Dribbler en courant ou réceptionner un ballon demande à tout le corps de travailler ensemble : c’est la coordination.'],
      ['Pourquoi refaire un test physique trois mois plus tard ?', ['Parce que les résultats changent chaque jour', 'Pour remplacer l’échauffement', 'Pour battre les autres élèves', 'Pour se comparer à soi-même et vérifier ses progrès'], 3, 'Le but d’un test est de mesurer sa propre progression : même test, mêmes conditions, quelques mois d’écart.'],
      ['Quelles qualités un adolescent de 13 à 15 ans travaille-t-il particulièrement bien ?', ['La force maximale', 'Aucune : il est trop jeune', 'Uniquement la souplesse', 'La coordination et la vitesse'], 3, 'Le cerveau apprend vite les gestes nouveaux à cet âge : coordination et vitesse progressent très bien.'],
    ],
  },
  {
    titre: 'L’hypertrophie : comment un muscle grossit',
    axe: 'Les fondamentaux de l’entraînement',
    lecon: {
      titre: 'Casser, réparer, reconstruire plus gros',
      cours: `Soulève une charge, repose-la, recommence. À la fin de la série, le muscle brûle et tremble ; le lendemain, il est raide. Trois semaines plus tard, le même poids paraît léger. Que s’est-il passé dedans ?

## Un muscle, c’est des fibres
Tu as plus de 600 muscles, et chacun est un faisceau de **fibres musculaires** : des cellules fines comme un cheveu mais longues de plusieurs centimètres, remplies de filaments qui glissent les uns sur les autres pour se contracter. Quand un muscle « grossit », le nombre de fibres ne change presque pas : **ce sont les fibres elles-mêmes qui s’épaississent**. C’est cela, l’**hypertrophie**.

| Fibre | Ce qu’elle fait | Qui en a beaucoup |
| Lente (type I) | tient longtemps, se fatigue peu | le marathonien |
| Rapide (type II) | forte et explosive, se fatigue vite | le sprinteur, l’haltérophile |

Tout le monde a les deux. La proportion est en partie héritée, mais l’entraînement fait progresser les deux.

## Les trois leviers qui font grossir un muscle
| Levier | Ce que c’est | Comment on l’obtient |
| **Tension mécanique** | la force que la fibre doit produire contre une résistance | une charge assez lourde, un mouvement complet |
| **Stress métabolique** | la « brûlure » : des déchets qui s’accumulent dans la fibre | des séries assez longues, peu de repos |
| **Micro-lésions** | de minuscules déchirures des filaments | la phase où l’on freine la charge (la descente) |

> La tension mécanique est le patron : sans elle, pas d’hypertrophie. Les deux autres leviers l’accompagnent.

## Casser, réparer, reconstruire plus gros
Pendant la séance, le muscle ne grossit pas : il s’abîme un peu. C’est APRÈS que tout se joue. Les cellules réparent les fibres en fabriquant de nouvelles protéines — cette **synthèse protéique** reste élevée **24 à 48 heures** après l’effort. Si le repos, le sommeil et l’assiette suivent, la fibre se reconstruit **un peu plus épaisse qu’avant** : c’est la **surcompensation**. Réentraîner le même muscle avant la fin de la réparation, c’est casser un mur qu’on n’a pas fini de remonter.

Deux idées fausses à ranger tout de suite :
- La **courbature** signale des micro-lésions, pas le progrès : on progresse souvent sans courbature, et on peut avoir des courbatures sans progresser.
- Le muscle « gonflé » juste après la séance, c’est du sang et de l’eau (la **congestion**) : une heure plus tard, il a repris sa taille. Le vrai gain vient des jours suivants.

## La recette qui marche
| Réglage | Pour l’hypertrophie |
| Répétitions par série | **8 à 12**, avec une charge qui fatigue vraiment à la fin |
| Séries par exercice | 3 ou 4 |
| Repos entre les séries | 60 à 90 secondes |
| Fréquence | chaque muscle **2 fois par semaine**, jamais deux jours de suite |
| Ce qui compte le plus | la **régularité** sur des mois, pas la séance héroïque |

Les premières semaines, la force monte vite alors que le muscle n’a pas encore grossi : c’est le **système nerveux** qui apprend à recruter plus de fibres en même temps. L’hypertrophie visible, elle, demande six à huit semaines de régularité.

## Et à ton âge ?
Entre 12 et 16 ans, le squelette n’a pas fini de grandir : les **cartilages de croissance**, aux extrémités des os, sont fragiles. La musculation n’est pas interdite — elle est même bonne pour les os, la posture et la confiance — mais elle se fait **avec la technique avant la charge** : poids du corps (pompes, squats, tractions, gainage), élastiques, charges légères, et **jamais de charge maximale**. Les muscles grossissent surtout après la puberté, quand les hormones s’en mêlent : avant, on gagne en force et en coordination, et c’est déjà beaucoup.

## Ce qui ne fait PAS grossir un muscle
| On croit que… | En réalité |
| Manger plus de protéines suffit | sans entraînement, le surplus est stocké ou éliminé ; 1,2 à 1,6 g par kilo et par jour suffisent, et l’assiette les apporte |
| S’entraîner tous les jours va plus vite | sans 48 h de repos, on s’épuise au lieu de reconstruire |
| Les poudres et boissons « miracle » font la différence | elles ne remplacent ni le travail, ni le sommeil, ni l’assiette |

!> Les **anabolisants** sont des hormones de synthèse, **interdites** par la loi et par l’antidopage : ils abîment le cœur, le foie et le système hormonal, et bloquent la croissance à l’adolescence.

## À retenir
- Un muscle grossit parce que ses fibres s’épaississent, pendant la **récupération**, pas pendant la séance.
- 8 à 12 répétitions, 3 à 4 séries, 48 h de repos, deux fois par semaine, pendant des mois.
- À ton âge : la technique et le poids du corps d’abord, jamais de charge maximale.`,
    },
    questions: [
      ['Qu’est-ce que l’hypertrophie musculaire ?', ['L’épaississement des fibres qui composent le muscle', 'L’augmentation du nombre de muscles du corps', 'La fonte du muscle quand on arrête le sport', 'L’allongement des os pendant la croissance'], 0, 'Un muscle grossit parce que chacune de ses fibres s’épaissit : leur nombre, lui, ne change presque pas.'],
      ['Après une séance, pendant combien de temps le muscle fabrique-t-il des protéines pour se réparer ?', ['Environ 24 à 48 heures', 'Une dizaine de minutes', 'Une semaine entière', 'Seulement pendant la séance'], 0, 'C’est pendant ces 24 à 48 heures de récupération que la fibre se reconstruit un peu plus épaisse : d’où le repos entre deux séances du même muscle.'],
      ['Plus on a de courbatures, plus le muscle grossit.', ['Vrai', 'Faux'], 1, 'La courbature signale des micro-lésions, pas le progrès : on progresse souvent sans courbature, et on peut avoir des courbatures sans progresser.'],
      ['Quelle fourchette de répétitions par série vise le mieux la prise de muscle ?', ['8 à 12', '1 à 3', '30 à 50', 'Au moins 100'], 0, 'Entre 8 et 12 répétitions avec une charge qui fatigue à la fin de la série : assez lourd pour tendre le muscle, assez long pour le fatiguer.'],
      ['Quel est le levier principal de l’hypertrophie ?', ['La tension mécanique : la force produite contre une résistance', 'La température du muscle', 'La vitesse à laquelle on court', 'Le nombre de muscles sollicités'], 0, 'Sans tension mécanique, rien ne pousse la fibre à s’épaissir ; la brûlure et les micro-lésions ne font que l’accompagner.'],
      ['Entraîner le même muscle tous les jours le fait grossir plus vite.', ['Vrai', 'Faux'], 1, 'Sans 48 heures de repos, le muscle n’a pas le temps de se reconstruire : on casse un mur qu’on n’a pas fini de remonter.'],
      ['À 14 ans, quelle est la priorité en musculation ?', ['Apprendre le geste juste avant d’ajouter de la charge', 'Soulever le plus lourd possible', 'S’entraîner chaque jour sans exception', 'Prendre des protéines en poudre'], 0, 'Le squelette finit de grandir et ses cartilages de croissance sont fragiles : technique, poids du corps et charges légères, jamais de charge maximale.'],
      ['Au début d’un entraînement de force, les progrès rapides viennent surtout…', ['du système nerveux, qui apprend à recruter plus de fibres en même temps', 'de muscles qui ont déjà grossi', 'd’une alimentation plus riche', 'de la chance'], 0, 'Les premières semaines, le cerveau commande mieux les fibres existantes : la force monte avant que le muscle ne grossisse.'],
      ['De quoi un muscle a-t-il besoin pour se reconstruire après l’effort ?', ['De protéines, de sommeil et de repos', 'De sucre uniquement', 'De courbatures', 'D’anabolisants'], 0, 'Les protéines apportent les briques, le sommeil et le repos donnent le temps : les trois ensemble, sinon rien ne se construit.'],
      ['Les anabolisants sont interdits et dangereux pour le cœur et les hormones.', ['Vrai', 'Faux'], 0, 'Ce sont des hormones de synthèse : interdites par la loi et par l’antidopage, elles abîment le cœur, le foie et le système hormonal, et bloquent la croissance.'],
      ['Qu’appelle-t-on la surcompensation ?', ['La fibre se reconstruit un peu plus épaisse qu’avant l’effort', 'Un excès d’entraînement qui épuise', 'Une crampe qui dure plusieurs jours', 'Le gonflement du muscle pendant la séance'], 0, 'Après la réparation, le muscle reconstruit « par anticipation », un peu au-dessus de son niveau de départ : c’est ce surplus qui fait progresser.'],
      ['Le muscle gonflé juste après une séance (la congestion), c’est…', ['temporaire : du sang et de l’eau, pas du muscle en plus', 'définitif : le muscle vient de grossir', 'dangereux : il faut arrêter', 'le signe d’une blessure'], 0, 'Pendant l’effort, le sang afflue : le muscle paraît plus gros pendant une heure, puis revient à sa taille. Le vrai gain vient des jours suivants.'],
    ],
  },
  {
    titre: 'L’endurance : VMA, VO2max et allures',
    axe: 'Les fondamentaux de l’entraînement',
    lecon: {
      titre: 'Calculer son allure',
      cours: `8 octobre 2023, Chicago : Kelvin Kiptum boucle le marathon en **2 h 00 min 35 s**, record du monde masculin. Soit plus de 42 kilomètres à plus de 20 km/h de moyenne. Ce que tu ne vois pas, c’est le moteur : un corps capable d’utiliser énormément d’oxygène.

## La VO2max : la taille du moteur
La **VO2max** est la quantité maximale d’oxygène que ton corps peut utiliser **par minute**. On l’exprime en millilitres par minute et par kilo (ml/min/kg).

| Profil | VO2max approximative |
| Adolescent en bonne santé | 40 à 50 |
| Meilleurs coureurs et cyclistes du monde | 80 à 90 |

Plus la VO2max est haute, plus ton corps fabrique d’énergie avec l’oxygène, donc plus il peut courir vite et longtemps.

## La VMA : ta vitesse repère
Mesurer une VO2max demande un laboratoire. Sur le terrain, on utilise la **VMA**, la **vitesse maximale aérobie** : la vitesse de course à laquelle on atteint sa VO2max. Elle s’exprime en **km/h**. Pour la trouver, on passe un test de terrain : la **navette de 20 mètres** de Luc Léger ou le test **VAMEVAL**. On accélère par paliers jusqu’à ne plus pouvoir suivre ; le dernier palier tenu donne la VMA.

> La VMA est ta vitesse repère : toutes tes allures d’entraînement se calculent en pourcentage de celle-ci.

## Les allures, en pourcentage de VMA
| Allure | % de VMA | À quoi ça sert |
| Endurance fondamentale | 60 à 70 % | bâtir la base, on peut parler en courant |
| Seuil | 80 à 85 % | allure soutenue, on ne tient pas une conversation |
| Fractionné | 100 à 110 % | courts efforts, par exemple 30 s vite / 30 s lent |

## Calculer son allure
Prenons une VMA de **12 km/h**. À cette vitesse, un kilomètre se parcourt en **5 minutes** (60 minutes divisées par 12).

| Allure | Calcul | Vitesse |
| Endurance fondamentale | 60 à 70 % de 12 | 7,2 à 8,4 km/h |
| Seuil | 80 à 85 % de 12 | 9,6 à 10,2 km/h |
| Fractionné 30 s / 30 s | 100 à 110 % de 12 | 12 à 13,2 km/h |

Pour passer d’une vitesse à un temps au kilomètre, on divise 60 par la vitesse. À 8 km/h, on met 7 min 30 s par kilomètre.

## Comment progresser
La recette est étonnante : **beaucoup de volume lent**, et **un peu de fractionné**. L’endurance fondamentale construit la base, sans fatiguer. Le fractionné, lui, tire la VMA vers le haut, mais on le garde pour une séance par semaine environ : trop souvent, il épuise.

Ta **fréquence cardiaque maximale** (FC max) est le plus grand nombre de battements par minute que ton cœur atteint à l’effort. Elle sert de repère : en endurance fondamentale, le cœur reste bien en dessous.

## Une légende de l’endurance
Le Kényan Eliud Kipchoge a couru un marathon en **1 h 59 min 40 s** à Vienne en **2019**, premier humain sous les deux heures. Mais cette course ne compte pas comme record officiel : elle était organisée, avec des meneurs relayés et un équipement spécial, hors des règles des compétitions. Le record officiel est celui de Kiptum, en 2023.

!> Chacun a sa VMA. Courir trop vite à l’endurance fondamentale ne sert à rien : on s’épuise sans bâtir la base.

## À retenir
- La VO2max est la quantité maximale d’oxygène utilisée par minute ; la VMA est la vitesse à laquelle on l’atteint.
- Les allures se calculent en pourcentage de VMA : 60-70 % en endurance fondamentale, 100-110 % en fractionné.
- Pour progresser : beaucoup de volume lent, un peu de fractionné.`,
    },
    questions: [
      ['Que mesure la VO2max ?', ['La vitesse maximale en sprint', 'Le nombre de battements du cœur au repos', 'La quantité maximale d’oxygène que le corps peut utiliser par minute', 'La force maximale des jambes'], 2, 'La VO2max est la quantité maximale d’oxygène utilisée par minute, exprimée en ml/min/kg.'],
      ['Que signifie le sigle VMA ?', ['Vitesse maximale aérobie', 'Volume musculaire accéléré', 'Variation maximale d’allure', 'Vitesse moyenne annuelle'], 0, 'La VMA est la vitesse de course à laquelle on atteint sa VO2max, exprimée en km/h.'],
      ['Une VMA de 12 km/h correspond à un kilomètre en…', ['5 minutes', '4 minutes', '6 minutes', '7 minutes'], 0, 'On divise 60 minutes par 12 km/h : 60 ÷ 12 = 5 minutes par kilomètre.'],
      ['Quelle valeur de VO2max est typique d’un adolescent en bonne santé ?', ['Environ 80 à 90 ml/min/kg', 'Environ 150 ml/min/kg', 'Environ 5 à 10 ml/min/kg', 'Environ 40 à 50 ml/min/kg'], 3, 'Un adolescent en bonne santé tourne autour de 40 à 50 ; les meilleurs coureurs et cyclistes atteignent 80 à 90.'],
      ['L’endurance fondamentale se travaille à environ…', ['150 % de la VMA', '60 à 70 % de la VMA', '100 à 110 % de la VMA', '30 % de la VMA'], 1, 'L’endurance fondamentale est une allure confortable, entre 60 et 70 % de la VMA, où l’on peut encore parler.'],
      ['Avec une VMA de 12 km/h, à quelle vitesse court-on un fractionné à 100 % de VMA ?', ['8 km/h', '6 km/h', '12 km/h', '20 km/h'], 2, '100 % de 12 km/h, c’est 12 km/h : l’allure du fractionné part de la VMA elle-même.'],
      ['Pour progresser en endurance, la meilleure recette est surtout…', ['Du fractionné tous les jours', 'Ne jamais courir lentement', 'Beaucoup de volume lent et un peu de fractionné', 'Uniquement des sprints de 10 secondes'], 2, 'Le volume lent bâtit la base sans fatiguer ; un peu de fractionné fait monter la VMA.'],
      ['Kelvin Kiptum a établi le record du monde du marathon à Chicago en 2023.', ['Vrai', 'Faux'], 0, 'Le 8 octobre 2023, il a couru en 2 h 00 min 35 s, record officiel du marathon masculin.'],
      ['La course d’Eliud Kipchoge sous les 2 heures à Vienne en 2019 est un record du monde officiel.', ['Vrai', 'Faux'], 1, 'Elle était hors des règles des compétitions (meneurs relayés, équipement spécial) : elle ne compte pas comme record officiel.'],
      ['Comment passe-t-on d’une vitesse en km/h à un temps au kilomètre ?', ['On ajoute 60 à la vitesse', 'On divise 60 par la vitesse', 'On multiplie la vitesse par 60', 'On soustrait 60 à la vitesse'], 1, 'Un kilomètre à 10 km/h dure 60 ÷ 10 = 6 minutes : la division fait passer de la vitesse au temps.'],
      ['Courir plus vite à l’endurance fondamentale bâtit mieux la base.', ['Vrai', 'Faux'], 1, 'Trop vite, on s’épuise sans bâtir la base : l’endurance fondamentale doit rester une allure où l’on peut parler.'],
      ['Quel test de terrain permet d’estimer sa VMA ?', ['La flexion du tronc', 'La navette de 20 mètres de Luc Léger', 'Le saut en longueur sans élan', 'Le lancer de poids'], 1, 'On accélère par paliers au rythme de bips jusqu’à ne plus pouvoir suivre : le dernier palier tenu donne la VMA.'],
    ],
  },
  {
    titre: 'La récupération : sommeil, repos, surcompensation',
    axe: 'Les fondamentaux de l’entraînement',
    lecon: {
      titre: 'On progresse quand on se repose',
      cours: `Imagine un sportif qui s’entraîne plus que tout le monde et qui, pourtant, ne progresse plus. Le secret manquant n’est pas une séance de plus : c’est une nuit de plus. On ne devient pas plus fort pendant l’effort, mais **après**.

## Le cycle en trois temps
Chaque séance suit le même schéma.

| Temps | Ce qui se passe |
| **Fatigue** | l’effort épuise les réserves et abîme un peu les fibres |
| **Réparation** | le corps reconstruit, recharge ses réserves |
| **Surcompensation** | le corps reconstruit un peu au-dessus de son niveau de départ |

C’est cette marche gagnée qui te fait progresser. Si tu t’entraînes **trop tôt**, avant la fin de la réparation, tu pars d’un niveau plus bas : rien n’est gagné. Si tu attends **trop longtemps**, la surcompensation s’efface. Le bon rythme se trouve entre les deux.

## Le sommeil, premier outil du sportif
À 14-17 ans, il faut **8 à 10 heures** de sommeil par nuit. C’est pendant le **sommeil profond** que le corps sécrète l’**hormone de croissance**, qui aide à réparer les muscles et à grandir.

Les **écrans** retardent l’endormissement : leur lumière bloque la **mélatonine**, l’hormone qui donne le signal du sommeil. Éteindre les écrans une heure avant de dormir, c’est un entraînement comme un autre.

> On ne progresse pas pendant la séance, mais pendant la nuit qui suit.

## Récupérer activement
La **récupération active** consiste à bouger doucement le lendemain d’un effort : marche, vélo tranquille. Elle aide à se sentir mieux sans réentraîner les muscles fatigués.

Après l’effort, il faut aussi **boire** et **manger** : des **glucides** pour refaire les réserves d’énergie et des **protéines** pour réparer, de préférence **dans les deux heures**. Une banane, un yaourt, un sandwich font très bien l’affaire.

## Le jour de repos fait partie du programme
Un jour sans sport n’est pas un jour perdu : c’est un jour où la surcompensation se construit. Les meilleurs athlètes planifient leurs repos comme leurs séances.

## Quand le corps dit stop
Le **surentraînement** guette ceux qui enchaînent sans récupérer. Voici les signaux d’alerte.

| Signe | Ce qu’on observe |
| Fatigue | elle persiste malgré le repos |
| Cœur | la fréquence cardiaque de repos monte |
| Sommeil | il devient haché, on dort mal |
| Humeur | irritabilité, envie de rien |
| Performance | elle baisse alors qu’on s’entraîne plus |

La bonne réponse est de **récupérer**, pas d’en faire plus.

## Étirements, froid, massage : que valent-ils ?
Les étirements sont agréables, mais leur effet contre les courbatures n’est pas prouvé. Le froid (bain, douche) et le massage ont un effet **modeste** : ils font du bien, sans remplacer le sommeil.

## La semaine d’un collégien sportif
Entraînement au club le mardi et le jeudi, EPS le lundi et le vendredi, match le samedi. Entre tout cela : mercredi calme ou promenade, dimanche de vrai repos, et chaque nuit 8 à 10 heures de sommeil. Voilà un programme complet.

!> Si la fatigue dure plusieurs jours malgré le repos, il faut en parler à un adulte ou à un médecin.

## À retenir
- Le corps progresse après l’effort : fatigue, réparation, surcompensation.
- À 14-17 ans : 8 à 10 heures de sommeil, écrans éteints avant de dormir.
- Fatigue qui dure, sommeil cassé, performances en baisse : récupérer, pas en faire plus.`,
    },
    questions: [
      ['Dans le cycle de l’entraînement, que désigne la surcompensation ?', ['La fatigue juste après l’effort', 'Le corps reconstruit un peu au-dessus de son niveau de départ', 'Un excès d’entraînement', 'Une douleur musculaire'], 1, 'Après la réparation, le corps reconstruit un peu plus fort qu’avant : c’est cette marche gagnée qui fait progresser.'],
      ['Combien d’heures de sommeil conseille-t-on entre 14 et 17 ans ?', ['4 à 5 heures', '12 à 14 heures', '8 à 10 heures', '6 heures exactement'], 2, 'À cet âge, le corps grandit et se répare beaucoup : 8 à 10 heures par nuit.'],
      ['Quelle hormone est sécrétée pendant le sommeil profond et aide à réparer les muscles ?', ['L’insuline', 'L’hormone de croissance', 'La mélatonine', 'L’adrénaline'], 1, 'L’hormone de croissance est sécrétée surtout pendant le sommeil profond : le sommeil fait partie de l’entraînement.'],
      ['Pourquoi les écrans retardent-ils l’endormissement ?', ['Ils font monter la température du corps', 'Leur lumière bloque la mélatonine, l’hormone du sommeil', 'Ils produisent des protéines', 'Ils fatiguent les muscles'], 1, 'La lumière des écrans empêche la sécrétion de mélatonine, qui donne le signal de dormir.'],
      ['Après l’effort, dans quel délai est-il conseillé de manger glucides et protéines ?', ['Au bout de six heures', 'Seulement le lendemain', 'Dans les deux heures', 'Jamais : il vaut mieux jeûner'], 2, 'Dans les deux heures, les glucides refont les réserves et les protéines aident à réparer.'],
      ['Un jour de repos est un jour perdu pour la progression.', ['Vrai', 'Faux'], 1, 'Le repos est le moment où la surcompensation se construit : il fait partie du programme.'],
      ['Que fait-on pour la récupération active ?', ['On bouge doucement : marche ou vélo tranquille', 'On reste couché toute la journée', 'On refait une séance intense', 'On saute le repas'], 0, 'Bouger doucement aide à se sentir mieux sans réentraîner les muscles fatigués.'],
      ['Lequel de ces signes peut indiquer un surentraînement ?', ['Une envie de courir plus longtemps', 'Un appétit stable', 'Une fréquence cardiaque de repos qui monte', 'Des courbatures légères après un effort'], 2, 'Fatigue persistante, cœur qui s’emballe au repos, sommeil cassé et performances en baisse sont des signaux d’alerte.'],
      ['Face à un surentraînement, la bonne réponse est de s’entraîner davantage.', ['Vrai', 'Faux'], 1, 'Il faut récupérer, pas en faire plus : le corps a besoin de temps pour se reconstruire.'],
      ['Que sait-on des étirements contre les courbatures ?', ['Ils sont agréables, mais leur effet n’est pas prouvé', 'Ils les aggravent toujours', 'Ils remplacent le sommeil', 'Ils les suppriment toujours'], 0, 'Les étirements font du bien, mais aucune preuve solide ne montre qu’ils évitent les courbatures.'],
      ['S’entraîner avant la fin de la réparation permet de progresser plus vite.', ['Vrai', 'Faux'], 1, 'Réentraîner un corps pas encore réparé, c’est partir d’un niveau plus bas : rien n’est gagné.'],
      ['Quel effet ont le froid et le massage sur la récupération ?', ['Un effet dangereux', 'Un effet immédiat et total', 'Aucun effet sur le bien-être', 'Un effet modeste'], 3, 'Ils font du bien sans remplacer le sommeil, le repos et l’assiette.'],
    ],
  },
  {
    titre: 'Éviter la blessure : échauffement, gainage, étirements',
    axe: 'Les fondamentaux de l’entraînement',
    lecon: {
      titre: 'La routine d’avant-match',
      cours: `Dix minutes. C’est le temps qui sépare un joueur qui entre sur le terrain prêt d’un joueur qui sort sur une civière au bout d’un quart d’heure. Les blessures arrivent rarement par malchance : elles se préviennent.

## L’échauffement progressif, 10 à 15 minutes
Un bon échauffement prépare le corps étape par étape :
- **du cardio léger** : trottiner, sautiller, pour faire monter doucement le cœur et la température ;
- **de la mobilité articulaire** : cercles de chevilles, de hanches, d’épaules ;
- **des gestes spécifiques accélérés** : les passes, les tirs, les appuis du sport qu’on va jouer, de plus en plus vite.

Le programme **FIFA 11+**, proposé pour les jeunes footballeurs, a réduit les blessures **d’environ un tiers** chez ceux qui le pratiquaient régulièrement.

## Étirements : avant ou après ?
| Type | Quand | Pourquoi |
| **Dynamiques** (mouvements amples, en bougeant) | avant l’effort | préparent les articulations |
| **Statiques** (position tenue longtemps) | après l’effort, ou à part | détendent et améliorent la souplesse |

Avant l’effort, les étirements statiques longs diminuent la force pendant un moment et **ne préviennent pas les blessures**. On les garde pour la fin de séance.

## Le gainage : protéger le dos
Le **gainage** consiste à tenir son corps immobile et droit, comme une planche. La **planche** (sur les avant-bras) et le **gainage latéral** (sur le côté) renforcent les muscles profonds du ventre et du dos, qui protègent la colonne vertébrale à chaque course, chaque saut, chaque lancer.

## La proprioception : protéger la cheville
La **proprioception** est la capacité de ton corps à savoir où se trouvent tes articulations sans les regarder. Pour la travailler : tenir en équilibre sur un pied, d’abord yeux ouverts, puis fermés. Une cheville entraînée corrige une mauvaise réception avant de se tordre.

> Une bonne routine, c’est du cardio qui chauffe, de la mobilité qui libère, des gestes qui préparent, et des étirements longs pour la fin.

## La progressivité : la règle des 10 %
On n’augmente pas tout d’un coup. Règle courante : **pas plus de 10 % de charge d’entraînement en plus d’une semaine à l’autre** (durée, distance ou intensité). Les chaussures comptent aussi : adaptées au sport et pas trop usées, elles amortissent les chocs.

## Les blessures de croissance
Pendant la croissance, les tendons s’attachent à des zones d’os encore fragiles. Deux douleurs sont classiques :

| Maladie | Où | Âge typique |
| **Osgood-Schlatter** | sous le genou | 10 à 15 ans |
| **Sever** | talon | 8 à 13 ans |

Dans ces cas, on **adapte** l’activité (moins de sauts, moins de course sur sol dur) et on ne force pas. Elles passent avec le temps et le repos relatif.

!> Une douleur qui dure plus de quelques jours, qui augmente ou qui réveille la nuit mérite l’avis d’un médecin. On n’« avance pas malgré la douleur ».

## La routine d’avant-match en 10 minutes
- 3 minutes de trot léger ;
- 3 minutes de mobilité (chevilles, hanches, épaules) ;
- 2 minutes d’équilibre sur un pied ;
- 2 minutes de gestes du jeu qui accélèrent.

## À retenir
- Échauffement de 10 à 15 minutes, progressif : cardio, mobilité, gestes spécifiques.
- Étirements dynamiques avant, statiques longs après ; gainage et équilibre protègent dos et chevilles.
- À l’adolescence : on adapte devant une douleur de croissance, on ne force pas.`,
    },
    questions: [
      ['Combien de temps dure un échauffement efficace ?', ['Une heure', '30 secondes', 'Aucun temps : on s’échauffe en jouant', '10 à 15 minutes'], 3, 'Dix à quinze minutes suffisent à préparer cœur, articulations et gestes du sport.'],
      ['Dans quel ordre se déroule un bon échauffement ?', ['Gestes à vitesse maximale, puis cardio', 'Cardio léger, mobilité, puis gestes spécifiques accélérés', 'Étirements longs, puis sprint, puis repos', 'Aucun ordre particulier'], 1, 'On monte progressivement : d’abord le cœur et les articulations, ensuite les gestes du sport de plus en plus vite.'],
      ['Que réduit environ d’un tiers le programme FIFA 11+ chez les jeunes footballeurs ?', ['Le temps de jeu', 'Le nombre de buts', 'Les blessures', 'Les fautes sifflées'], 2, 'Pratiqué régulièrement, ce programme d’échauffement diminue les blessures d’environ un tiers.'],
      ['Quel type d’étirement fait-on plutôt avant l’effort ?', ['Aucun étirement jamais', 'Statique, tenu une minute', 'Dynamique, en mouvement', 'Forcé jusqu’à la douleur'], 2, 'Les mouvements amples préparent les articulations sans diminuer la force.'],
      ['Les étirements statiques longs avant l’effort préviennent les blessures.', ['Vrai', 'Faux'], 1, 'Avant l’effort, ils diminuent la force un moment et ne préviennent pas les blessures : on les garde pour après.'],
      ['À quoi sert surtout le gainage ?', ['À prendre du poids', 'À gagner en souplesse', 'À courir plus vite', 'À protéger le dos'], 3, 'Planche et gainage latéral renforcent les muscles profonds qui soutiennent la colonne.'],
      ['Quel exercice travaille la proprioception de la cheville ?', ['Soulever une charge lourde', 'S’étirer les bras', 'Tenir en équilibre sur un pied', 'Courir en ligne droite'], 2, 'Tenir sur un pied, yeux ouverts puis fermés, entraîne la cheville à corriger les déséquilibres.'],
      ['De combien peut-on augmenter la charge d’entraînement d’une semaine à l’autre, selon la règle courante ?', ['Autant qu’on veut', 'De 100 %', 'Pas plus de 10 %', 'De 50 %'], 2, 'La progressivité protège les tendons et les os : pas plus de 10 % en plus d’une semaine à l’autre.'],
      ['La maladie d’Osgood-Schlatter touche surtout…', ['l’épaule des nageurs adultes', 'le genou, entre 10 et 15 ans', 'le poignet, après 60 ans', 'le dos des enfants de 3 ans'], 1, 'C’est une douleur de croissance sous le genou, fréquente entre 10 et 15 ans.'],
      ['Que fait-on devant une douleur de croissance comme celle de Sever au talon ?', ['On l’ignore', 'On supprime tout le sport pour toujours', 'On adapte l’activité sans forcer', 'On double l’entraînement'], 2, 'Moins de sauts, moins de sol dur : on adapte, et la douleur passe avec le temps.'],
      ['Une douleur qui dure plusieurs jours doit être ignorée pour continuer à progresser.', ['Vrai', 'Faux'], 1, 'Une douleur qui dure ou qui augmente mérite l’avis d’un médecin : on n’avance pas malgré la douleur.'],
      ['Qu’est-ce que la proprioception ?', ['Savoir où sont ses articulations sans les regarder', 'La capacité à courir longtemps', 'La souplesse du dos', 'La puissance d’un sprint'], 0, 'C’est le sens de la position du corps, qui permet à la cheville de corriger un faux pas avant la torsion.'],
    ],
  },
  // ---- L'histoire du sport en France -------------------------------------
  {
    titre: 'Coubertin et la naissance du sport moderne',
    axe: 'Histoire du sport en France',
    lecon: {
      titre: 'Du modèle anglais aux Jeux modernes',
      cours: `23 juin 1894, dans un amphithéâtre de la Sorbonne, à Paris. Un baron français convainc des délégués venus de plusieurs pays de recréer les Jeux olympiques. Deux ans plus tard, Athènes accueille les premiers Jeux modernes. Cet homme, c’est **Pierre de Coubertin**.

## Un Français qui admire les Anglais
Pierre de Coubertin (1863-1937) est frappé par l’école anglaise : à **Rugby School**, le directeur **Thomas Arnold** fait du sport un moyen d’éduquer le caractère. Coubertin se dit qu’en France, où l’on fait surtout de la gymnastique et du drill, le sport pourrait donner plus d’énergie à la jeunesse.

> Le sport français naît des Anglais, puis s’en émancipe : Coubertin importe le modèle, la France le fait sien.

## Le sport s’organise en France
Avant Coubertin, des Français pratiquent déjà. Les repères à retenir :

| Date | Événement |
| 1872 | création du **Havre Athletic Club**, plus vieux club français |
| 1887 | création de l’**USFSA**, qui fédère les sociétés sportives |
| 1894 | congrès de la Sorbonne et création du **CIO** (le 23 juin) |
| 1896 | premiers Jeux modernes à Athènes |

## Le CIO et la devise olympique
Le **Comité international olympique** (CIO) est créé le 23 juin 1894. Il organise les Jeux et fixe leurs règles. La devise olympique, **Citius, Altius, Fortius** (« plus vite, plus haut, plus fort »), vient du dominicain **Henri Didon**, qui l’a lancée en **1891**. Coubertin l’a adoptée.

## Une phrase célèbre, une origine plus nuancée
Tu as sûrement entendu : « L’important dans la vie n’est pas le triomphe mais le combat. » Coubertin la cite en **1908**, mais il reprend en réalité un propos de l’évêque américain **Ethelbert Talbot**. Elle est souvent résumée en « l’important, c’est de participer ».

## Les limites de Coubertin
Il faut aussi savoir regarder les limites : Coubertin était **opposé au sport féminin de compétition**. Pour lui, les Jeux devaient être masculins. Cela explique pourquoi les femmes ont dû se battre pour obtenir leur place.

!> On peut admirer ce que Coubertin a construit et reconnaître ce qu’il n’a pas compris.

## Alice Milliat et les Jeux mondiaux féminins
**Alice Milliat** a pris le contre-pied. Elle organise les premiers **Jeux mondiaux féminins** à **Paris en 1922**, avec des athlètes venues de plusieurs pays. Elle montre que les femmes veulent concourir et savent le faire.

## Jules Rimet et la Coupe du monde
Autre grand nom : **Jules Rimet**, président de la **FIFA**. Il imagine un tournoi mondial de football, ouvert aux nations. La première **Coupe du monde** se joue en **1930** en **Uruguay**.

| Personnage | Son apport |
| Pierre de Coubertin | les Jeux olympiques modernes (1896) |
| Henri Didon | la devise Citius, Altius, Fortius (1891) |
| Alice Milliat | les Jeux mondiaux féminins (Paris, 1922) |
| Jules Rimet | la Coupe du monde de football (1930) |

## Pourquoi ça compte
Presque toutes les compétitions que tu regardes aujourd’hui viennent de ces années : clubs, fédérations, Jeux, Coupe du monde. Les Français n’ont pas inventé tous les sports, mais ils ont inventé la manière de les faire se rencontrer.

## À retenir
- Coubertin (1863-1937) crée le CIO à la Sorbonne le 23 juin 1894 ; les premiers Jeux modernes ont lieu à Athènes en 1896.
- La devise Citius, Altius, Fortius vient du dominicain Henri Didon (1891).
- Alice Milliat (Jeux mondiaux féminins, Paris, 1922) et Jules Rimet (Coupe du monde, 1930) complètent l’histoire.`,
    },
    questions: [
      ['Où et quand le CIO est-il créé ?', ['À la Sorbonne, à Paris, le 23 juin 1894', 'À Athènes, en 1896', 'À Londres, en 1908', 'À Berlin, en 1936'], 0, 'Le congrès de la Sorbonne crée le CIO le 23 juin 1894 ; les premiers Jeux ont lieu deux ans plus tard à Athènes.'],
      ['Quelle ville accueille les premiers Jeux olympiques modernes en 1896 ?', ['New York', 'Rome', 'Athènes', 'Paris'], 2, 'Les premiers Jeux modernes se tiennent à Athènes en 1896, en hommage à la Grèce antique.'],
      ['Qui est à l’origine de la devise « Citius, Altius, Fortius » ?', ['Le dominicain Henri Didon', 'Alice Milliat', 'Jules Rimet', 'Pierre de Coubertin seul'], 0, 'Henri Didon la lance en 1891 ; Coubertin l’adopte ensuite pour les Jeux.'],
      ['Que veut dire « Citius, Altius, Fortius » ?', ['Plus vite, plus haut, plus fort', 'Plus tôt, plus tard, plus loin', 'Ensemble, unis, solidaires', 'Gagner, jouer, participer'], 0, 'C’est la devise latine des Jeux : plus vite, plus haut, plus fort.'],
      ['Quel est le plus vieux club sportif français cité par l’histoire du sport ?', ['Le Havre Athletic Club, créé en 1872', 'L’Olympique de Marseille, créé en 1899', 'Le Paris Saint-Germain, créé en 1970', 'Le Stade de France, créé en 1998'], 0, 'Le Havre Athletic Club, fondé en 1872, est considéré comme le plus vieux club français.'],
      ['Coubertin était favorable à la compétition sportive féminine.', ['Vrai', 'Faux'], 1, 'Il était opposé au sport féminin de compétition : c’est l’une de ses limites, que les femmes ont dû combattre.'],
      ['Que crée Alice Milliat à Paris en 1922 ?', ['Le CIO', 'Les Jeux mondiaux féminins', 'La Coupe du monde de football', 'Le Tour de France'], 1, 'Alice Milliat organise les premiers Jeux mondiaux féminins pour que les femmes puissent concourir.'],
      ['Qui est à l’origine de la Coupe du monde de football, jouée pour la première fois en 1930 ?', ['Jules Rimet, président de la FIFA', 'Pierre de Coubertin', 'Thomas Arnold', 'Henri Didon'], 0, 'Jules Rimet, président de la FIFA, imagine le tournoi mondial, joué en Uruguay en 1930.'],
      ['Le modèle d’éducation par le sport que Coubertin admire vient…', ['Des écoles de Sparte antique', 'D’une académie japonaise', 'D’une université américaine', 'Des écoles anglaises comme Rugby School'], 3, 'Coubertin admire l’école anglaise, où Thomas Arnold fait du sport un moyen de former le caractère.'],
      ['La phrase « L’important n’est pas le triomphe mais le combat » est une invention de Coubertin sans autre origine.', ['Vrai', 'Faux'], 1, 'Coubertin la cite en 1908 en reprenant un propos de l’évêque Ethelbert Talbot.'],
      ['Que fait l’USFSA, créée en 1887 ?', ['Elle gère la Coupe du monde', 'Elle organise les Jeux olympiques', 'Elle fabrique du matériel sportif', 'Elle fédère des sociétés sportives françaises'], 3, 'L’USFSA rassemble les sociétés sportives françaises : un pas vers le sport organisé.'],
      ['Les premiers Jeux mondiaux féminins ont eu lieu à Paris.', ['Vrai', 'Faux'], 0, 'Alice Milliat les a organisés à Paris en 1922, avec des athlètes de plusieurs pays.'],
    ],
  },
  {
    titre: 'Le Tour de France, de 1903 à aujourd’hui',
    axe: 'Histoire du sport en France',
    lecon: {
      titre: 'Une idée pour vendre des journaux',
      cours: `Été 1903. Des cyclistes s’élancent pour six étapes et 2 428 kilomètres autour de la France. L’idée vient d’un journal qui cherche à gagner des lecteurs. Plus de cent vingt ans plus tard, la course existe toujours.

## Une invention de journal
Le **Tour de France** est créé en **1903** par le journal **L’Auto**. Son directeur, **Henri Desgrange**, reprend l’idée de **Géo Lefèvre**, un journaliste : organiser une course autour du pays pour **vendre du papier**. La première édition compte **6 étapes** pour **2 428 km** ; le vainqueur est **Maurice Garin**.

## Les grands moments
| Date | Événement |
| 1903 | première édition, Maurice Garin gagne |
| 1910 | premier passage du **Tourmalet** : Octave Lapize crie « Vous êtes des assassins ! » aux organisateurs |
| 1919 | apparition du **maillot jaune**, porté par Eugène Christophe |
| 1952 | première arrivée à l’**Alpe d’Huez**, victoire de Fausto Coppi |

Le maillot est **jaune** parce que L’Auto était imprimé sur du papier jaune.

## Une course d’aujourd’hui
Le Tour moderne dure en juillet, sur environ **3 400 km** en **21 étapes**. On l’appelle aussi la **Grande Boucle**. Quatre maillots récompensent des qualités différentes :

| Maillot | Il récompense |
| **Jaune** | le leader du classement général |
| **Vert** | le meilleur sprinteur |
| **À pois** | le meilleur grimpeur |
| **Blanc** | le meilleur jeune |

## Les légendes
Quatre légendes ont gagné le Tour **cinq fois** : **Jacques Anquetil**, **Eddy Merckx**, **Bernard Hinault** et **Miguel Indurain**. **Bernard Hinault** reste le **dernier Français vainqueur**, en **1985**.

Aujourd’hui, le Slovène **Tadej Pogačar** domine : vainqueur en **2020, 2021, 2024 et 2025**.

> Le Tour de France est né d’une idée de journal et est devenu une fête nationale à ciel ouvert.

## Une histoire qui a aussi ses ombres
**Lance Armstrong** a été **déchu de ses sept Tours en 2012** pour dopage. Cette affaire a poussé le cyclisme à renforcer ses contrôles antidopage.

## Et les femmes ?
Le **Tour de France Femmes** existe depuis **2022**. En **2025**, c’est **Pauline Ferrand-Prévot** qui l’a gagné.

## La caravane et les spectateurs
Chaque été, **plusieurs millions** de personnes bordent les routes pour voir passer les coureurs, gratuitement. Avant eux, la **caravane publicitaire** distribue casquettes et bonbons : un spectacle à part entière, qui fait partie de la tradition.

## Pourquoi on l’aime
Le Tour mêle tout : paysages, histoires d’hommes et de femmes qui souffrent, tactique d’équipe, et routes ouvertes à tous. On n’a pas besoin d’acheter un billet pour y assister.

!> Gagner le Tour demande trois semaines de régularité : une seule mauvaise journée en montagne peut tout faire perdre.

## À retenir
- Le Tour est créé en 1903 par le journal L’Auto (Desgrange, idée de Lefèvre) ; Garin gagne la première édition.
- Le maillot jaune apparaît en 1919 ; il est jaune comme le papier de L’Auto.
- Hinault (1985) est le dernier Français vainqueur ; le Tour de France Femmes existe depuis 2022.`,
    },
    questions: [
      ['En quelle année le Tour de France est-il créé ?', ['1952', '1919', '1903', '1985'], 2, 'Le journal L’Auto lance la première édition en 1903, avec 6 étapes et 2 428 km.'],
      ['Pourquoi le journal L’Auto a-t-il créé le Tour de France ?', ['Pour fêter une victoire militaire', 'Pour promouvoir un fabricant de vélos', 'Pour vendre davantage de journaux', 'Pour former des champions olympiques'], 2, 'Desgrange et L’Auto cherchaient à augmenter leurs ventes : la course était d’abord une opération de presse.'],
      ['Qui a gagné la toute première édition du Tour ?', ['Maurice Garin', 'Bernard Hinault', 'Miguel Indurain', 'Eddy Merckx'], 0, 'Maurice Garin remporte le Tour de 1903, sur 6 étapes et 2 428 km.'],
      ['Pourquoi le maillot du leader est-il jaune ?', ['Parce que le soleil brille en juillet', 'Parce que le jaune se voit de loin', 'Parce que c’est la couleur de la France', 'Parce que le journal L’Auto était imprimé sur du papier jaune'], 3, 'La couleur reprend celle du papier du journal organisateur ; le maillot jaune apparaît en 1919.'],
      ['Quel maillot récompense le meilleur grimpeur ?', ['Le maillot blanc', 'Le maillot à pois', 'Le maillot vert', 'Le maillot jaune'], 1, 'Le maillot à pois est celui du meilleur grimpeur ; le vert va au sprinteur et le blanc au meilleur jeune.'],
      ['Quel est le dernier Français vainqueur du Tour de France ?', ['Laurent Fignon, en 2000', 'Jacques Anquetil, en 1964', 'Bernard Hinault, en 1985', 'Richard Virenque, en 1999'], 2, 'Bernard Hinault l’a emporté en 1985 : depuis, aucun Français n’a gagné.'],
      ['Que s’est-il passé pour Lance Armstrong en 2012 ?', ['Il a pris sa retraite sportive', 'Il a été élu président de l’UCI', 'Il a été déchu de ses sept Tours pour dopage', 'Il a gagné un huitième Tour'], 2, 'Reconnu coupable de dopage, il a perdu ses sept victoires.'],
      ['Combien d’étapes compte le Tour de France actuel ?', ['21', '3', '60', '6'], 0, 'Le Tour actuel compte 21 étapes en juillet, pour environ 3 400 km.'],
      ['Le Tour de France Femmes existe depuis 2022.', ['Vrai', 'Faux'], 0, 'Il a été lancé en 2022 ; Pauline Ferrand-Prévot l’a gagné en 2025.'],
      ['Le Tour de France est né pour un but sportif sans lien avec l’argent.', ['Vrai', 'Faux'], 1, 'C’est une idée de journal pour vendre du papier : la presse est à l’origine de la course.'],
      ['Qui a remporté le Tour de France en 2024 et 2025 ?', ['Eddy Merckx', 'Tadej Pogačar', 'Miguel Indurain', 'Bernard Hinault'], 1, 'Pogačar l’a emporté en 2020, 2021, 2024 et 2025.'],
      ['Que crie Octave Lapize aux organisateurs au Tourmalet en 1910 ?', ['« Encore un tour ! »', '« Vous êtes des assassins ! »', '« Vive la France ! »', '« Je suis le meilleur ! »'], 1, 'Épuisé par l’ascension, il dénonce la dureté de l’étape : la montagne devient un mythe du Tour.'],
    ],
  },
  {
    titre: 'Les Bleus : 1998, 2018 et le football français',
    axe: 'Histoire du sport en France',
    lecon: {
      titre: 'Deux étoiles sur le maillot',
      cours: `12 juillet 1998, Stade de France. Zinédine Zidane monte plus haut que tout le monde et frappe de la tête. Une fois, deux fois. Le Brésil est battu 3-0 et la France devient, pour la première fois, championne du monde de football.

## 1998 : la première étoile
Pour la finale à Saint-Denis, la France bat le Brésil **3-0** : deux buts de **Zidane** de la tête, un de **Petit**. L’équipe est dirigée par **Aimé Jacquet**. On l’appelle « **black-blanc-beur** », image d’une France unie. Une foule immense descend sur les Champs-Élysées pour fêter les Bleus.

## Avant 1998 : les Bleus gagnent déjà
- **Euro 1984** : la France gagne à domicile. **Michel Platini** marque **9 buts**, un record dans un Euro.
- **Euro 2000** : après 1998, la France remporte aussi le championnat d’Europe.

## 2006 : le coup de boule
En 2006, la France atteint la finale de la Coupe du monde, mais la perd **aux tirs au but**. La soirée reste marquée par le **coup de tête de Zidane** : un geste qui lui vaut l’expulsion.

## 2018 : la deuxième étoile
**15 juillet 2018, Moscou** : la France bat la Croatie **4-2**. À la tête de l’équipe, **Didier Deschamps** : il est champion du monde comme **joueur** en 1998 et comme **sélectionneur** en 2018. Dans l’équipe, **Kylian Mbappé**, 19 ans.

| Année | Compétition | Résultat |
| 1984 | Euro | vainqueur, à domicile |
| 1998 | Coupe du monde | vainqueur, 3-0 contre le Brésil |
| 2000 | Euro | vainqueur |
| 2006 | Coupe du monde | finale perdue aux tirs au but |
| 2018 | Coupe du monde | vainqueur, 4-2 contre la Croatie |
| 2022 | Coupe du monde | finale perdue aux tirs au but |

## 2022 : une finale folle
En 2022, la finale oppose la France à l’Argentine. Mbappé marque **trois buts** et le score est de **3-3**, mais l’Argentine l’emporte **aux tirs au but**.

> Deux étoiles sur le maillot, deux finales perdues : le football français a connu les sommets et les larmes.

## D’où viennent les talents ?
La France forme beaucoup de joueurs grâce à ses centres de formation. Le **centre de Clairefontaine**, ouvert en **1988**, est la vitrine de cette « formation à la française » : on y accueille les meilleurs jeunes du pays.

## Les clubs et les Bleues
En 2025, le **Paris Saint-Germain** a battu l’**Inter** 5-0 à Munich (31 mai 2025) et devient le premier club français champion d’Europe depuis l’**Olympique de Marseille**, sacré en 1993.

Du côté des **Bleues**, l’équipe de France féminine a atteint les **demi-finales** de l’Euro 2022.

!> Le football français n’a pas toujours gagné : les tirs au but de 2006 et 2022 rappellent que le sport garde sa part d’incertitude.

## À retenir
- 1998 (3-0 contre le Brésil) et 2018 (4-2 contre la Croatie) : deux étoiles sur le maillot.
- Didier Deschamps est champion du monde comme joueur (1998) et comme sélectionneur (2018).
- Le PSG, en 2025, devient le premier club français champion d’Europe depuis l’OM de 1993.`,
    },
    questions: [
      ['Quel est le score de la finale de la Coupe du monde 1998 ?', ['France 3 – Brésil 0', 'France 2 – Brésil 1', 'France 4 – Brésil 2', 'France 1 – Brésil 0'], 0, 'La France bat le Brésil 3-0 au Stade de France, le 12 juillet 1998.'],
      ['Qui marque deux buts de la tête lors de la finale 1998 ?', ['Michel Platini', 'Didier Deschamps', 'Kylian Mbappé', 'Zinédine Zidane'], 3, 'Zidane marque deux fois de la tête, avant le but de Petit.'],
      ['Qui est le sélectionneur de l’équipe de France championne du monde en 1998 ?', ['Aimé Jacquet', 'Michel Hidalgo', 'Raymond Domenech', 'Didier Deschamps'], 0, 'Aimé Jacquet dirige les Bleus de 1998 ; Deschamps en sera le capitaine puis, plus tard, le sélectionneur.'],
      ['Combien de buts Michel Platini a-t-il marqués à l’Euro 1984 ?', ['3', '12', '5', '9'], 3, 'Il marque 9 buts pendant le tournoi, un record, et la France gagne à domicile.'],
      ['Contre quelle équipe la France gagne-t-elle la finale de la Coupe du monde 2018 ?', ['L’Argentine', 'Le Brésil', 'L’Italie', 'La Croatie'], 3, 'La France bat la Croatie 4-2 à Moscou, le 15 juillet 2018.'],
      ['Quelle est la particularité de Didier Deschamps ?', ['Champion du monde comme joueur en 1998 et comme sélectionneur en 2018', 'Meilleur buteur de l’Euro 1984', 'Auteur d’un triplé en finale 2022', 'Fondateur du centre de Clairefontaine'], 0, 'Il a soulevé la Coupe du monde deux fois, d’abord sur le terrain, ensuite sur le banc.'],
      ['La finale de la Coupe du monde 2006 a été perdue par la France aux tirs au but.', ['Vrai', 'Faux'], 0, 'Elle est restée célèbre aussi pour le coup de tête de Zidane, qui a été expulsé.'],
      ['Quel joueur marque un triplé en finale de la Coupe du monde 2022 ?', ['Zinédine Zidane', 'Olivier Giroud', 'Antoine Griezmann', 'Kylian Mbappé'], 3, 'Mbappé marque trois buts (3-3), mais l’Argentine gagne aux tirs au but.'],
      ['Que représente le centre de Clairefontaine, ouvert en 1988 ?', ['Le siège du CIO', 'Une école d’arbitrage', 'La formation des meilleurs jeunes footballeurs français', 'Un stade de 80 000 places'], 2, 'Clairefontaine est le centre national de formation du football français.'],
      ['En 2025, le PSG est devenu le premier club français champion d’Europe depuis l’OM en 1993.', ['Vrai', 'Faux'], 0, 'Le PSG a battu l’Inter 5-0 à Munich, le 31 mai 2025.'],
      ['La France a remporté la Coupe du monde 2022 en battant l’Argentine.', ['Vrai', 'Faux'], 1, 'La finale s’est terminée 3-3, puis l’Argentine l’a emporté aux tirs au but.'],
      ['Quel résultat l’équipe de France féminine a-t-elle obtenu à l’Euro 2022 ?', ['Une médaille d’or', 'Une élimination au premier tour', 'Une victoire en finale', 'Une demi-finale'], 3, 'Les Bleues ont atteint les demi-finales de l’Euro 2022.'],
    ],
  },
  {
    titre: 'Paris olympique : 1900, 1924, 2024',
    axe: 'Histoire du sport en France',
    lecon: {
      titre: 'Trois Paris, trois époques',
      cours: `Paris a accueilli les Jeux d’été trois fois : en 1900, 1924 et 2024. Entre la première et la dernière, plus d’un siècle, et trois façons très différentes de faire des Jeux.

## 1900 : des Jeux noyés dans l’Exposition
En 1900, les Jeux ont lieu en même temps que l’**Exposition universelle**. Ils s’étalent sur **cinq mois**, au milieu des pavillons et des spectacles. Mais un fait historique : pour la première fois, des **femmes** participent, **22** au total. **Charlotte Cooper**, au tennis, devient la **première championne olympique** de l’histoire.

## 1924 : les Jeux modernes prennent forme
En 1924, les Jeux d’hiver se tiennent d’abord à **Chamonix** : on les reconnaîtra plus tard comme les **premiers Jeux d’hiver**. Puis Paris reçoit les Jeux d’été à **Colombes**. Plusieurs nouveautés :
- le premier **village olympique** ;
- le Finlandais **Paavo Nurmi** remporte **5 médailles d’or** ;
- l’Américain **Johnny Weissmuller** gagne **3 ors** en natation : il deviendra plus tard l’acteur qui joue **Tarzan** ;
- les coureurs britanniques inspirent le film Les Chariots de feu.

## 2024 : les Jeux sortent du stade
Du **26 juillet au 11 août 2024**, Paris organise ses troisièmes Jeux. L’idée forte : sortir les Jeux des stades.

| Fait marquant | Détail |
| Cérémonie d’ouverture | sur la **Seine**, une première hors d’un stade |
| Sports | 32 sports, 329 épreuves |
| Parité | autant d’athlètes femmes que d’hommes |
| Sites | 95 % de sites existants ou temporaires |
| Classement de la France | 5e nation au tableau des médailles |

Pour la France, on retient les exploits de **Léon Marchand** en natation, **Teddy Riner** en judo et **Antoine Dupont** au rugby à 7. Les **Jeux paralympiques** suivent du **28 août au 8 septembre**.

> Trois Paris, trois époques : une exposition, un village olympique, la Seine.

## Que reste-t-il ?
L’héritage de 2024 se voit dans la ville :
- la **Seine** a été rendue **baignable** en **2025** ;
- le **village des athlètes** est devenu des **logements** à Saint-Denis et Saint-Ouen ;
- le **centre aquatique** olympique reste ouvert au public.

## Comment les Jeux ont changé
En 1900, on parle de concours dispersés ; en 1924, d’un événement structuré avec un village et des champions mondiaux ; en 2024, d’un grand spectacle pensé pour la ville entière, avec les Jeux paralympiques dans la foulée. Chaque fois, Paris a adapté les Jeux à son époque : ce qui reste, c’est l’idée que le sport rassemble des gens très différents au même endroit.

## Pourquoi Paris ?
Paris est l’une des rares villes à avoir reçu les Jeux trois fois. Pour Coubertin, c’était la ville où tout avait commencé : le CIO y est né en 1894.

!> En 1900, les Jeux se perdent dans la fête de l’Exposition : l’idée olympique n’est pas encore bien installée.

## À retenir
- 1900 : Jeux noyés dans l’Exposition universelle, avec les premières femmes (Charlotte Cooper, première championne olympique).
- 1924 : premier village olympique, Nurmi (5 ors) et Weissmuller (3 ors) ; Chamonix, premiers Jeux d’hiver.
- 2024 : cérémonie sur la Seine, 32 sports, parité, 95 % de sites existants ou temporaires.`,
    },
    questions: [
      ['Pendant quelle manifestation se tiennent les Jeux de Paris en 1900 ?', ['La Coupe du monde de football', 'L’Exposition universelle', 'Un congrès du CIO', 'Le Tour de France'], 1, 'Les Jeux de 1900 sont noyés dans l’Exposition universelle et durent cinq mois.'],
      ['Qui est la première championne olympique de l’histoire, en 1900 ?', ['Marie-José Pérec, en athlétisme', 'Alice Milliat, en athlétisme', 'Charlotte Cooper, au tennis', 'Laure Manaudou, en natation'], 2, 'Charlotte Cooper gagne le tournoi de tennis en 1900, l’année où les femmes entrent aux Jeux.'],
      ['Combien de femmes participent aux Jeux de Paris en 1900 ?', ['2', '220', '2 200', '22'], 3, 'Elles sont 22, une première dans l’histoire olympique.'],
      ['Quelle nouveauté marque les Jeux de 1924 à Paris ?', ['Le premier village olympique', 'Le premier match de football', 'La première cérémonie sur un fleuve', 'La parité parfaite'], 0, 'En 1924, les athlètes sont logés dans un village olympique, une première.'],
      ['Combien de médailles d’or le Finlandais Paavo Nurmi remporte-t-il à Paris en 1924 ?', ['1', '10', '3', '5'], 3, 'Paavo Nurmi gagne 5 ors en athlétisme, un exploit en une seule édition.'],
      ['Quel nageur de 1924 jouera ensuite Tarzan au cinéma ?', ['Eddy Merckx', 'Mark Spitz', 'Paavo Nurmi', 'Johnny Weissmuller'], 3, 'Weissmuller gagne 3 ors à Paris avant de devenir l’acteur le plus célèbre à incarner Tarzan.'],
      ['Où se déroulent en 1924 les premiers Jeux d’hiver reconnus plus tard ?', ['À Grenoble', 'À Colombes', 'À Chamonix', 'À Lyon'], 2, 'Chamonix a accueilli en 1924 les Jeux d’hiver, reconnus plus tard comme premiers Jeux d’hiver.'],
      ['Les Jeux de 2024 se sont déroulés du 26 juillet au 11 août.', ['Vrai', 'Faux'], 0, 'Ils ont suivi par les Jeux paralympiques, du 28 août au 8 septembre.'],
      ['Qu’y a-t-il d’inédit dans la cérémonie d’ouverture des Jeux de 2024 ?', ['Elle a lieu dans un stade vide', 'Elle est organisée sous terre', 'Elle ne dure qu’une minute', 'Elle a lieu sur la Seine et non dans un stade'], 3, 'La cérémonie se déroule sur la Seine : une première hors d’un stade.'],
      ['Environ quelle part des sites de 2024 était existante ou temporaire ?', ['95 %', '10 %', '30 %', '50 %'], 0, 'Environ 95 % des sites existaient déjà ou étaient temporaires : peu de constructions neuves.'],
      ['Aux Jeux de 2024, la France a terminé 5e au tableau des médailles.', ['Vrai', 'Faux'], 0, 'Elle se classe cinquième nation, une belle performance à domicile.'],
      ['Que sont devenus le village des athlètes de 2024 ?', ['Un parc d’attractions', 'Un musée de la Seine', 'Des logements à Saint-Denis et Saint-Ouen', 'Un stade de rugby'], 2, 'Le village olympique est transformé en logements, un héritage concret pour les habitants.'],
    ],
  },
  // ---- Arbitrer et jouer juste -------------------------------------------
  {
    titre: 'L’arbitre, la VAR et le fair-play',
    axe: 'Arbitrer et jouer juste',
    lecon: {
      titre: 'Et toi, tu siffles quoi ?',
      cours: `Imagine un match sans arbitre. À la première faute discutée, tout le monde proteste, le jeu s’arrête, et personne ne sait qui a raison. L’arbitre n’est pas là pour gâcher le plaisir : il est là pour que le jeu soit possible.

## Ce que fait l’arbitre
Un arbitre a trois missions :
- **faire respecter la règle**, la même pour les deux camps ;
- **protéger les joueurs**, en sanctionnant les gestes dangereux ;
- **décider vite**, car le jeu ne peut pas attendre.

Il communique par des **signaux** : un coup de sifflet, un bras levé, un carton jaune ou rouge, des gestes que les joueurs reconnaissent sans qu’il parle.

## Les arbitres qui parlent
Au rugby, l’arbitre **explique ses décisions au micro**, et seul le **capitaine** a le droit de lui parler. Le football a testé une idée proche : des **essais** de capitaines seuls autorisés à discuter, notamment lors de l’**Euro 2024** (expérimentation de l’IFAB). Le but : moins de contestations, plus de respect.

## Quand la technologie aide
| Technologie | Où | Depuis quand |
| **Goal-line technology** | football, ballon dans le but ou non | Coupe du monde 2014 |
| **VAR** (arbitrage vidéo) | football | Coupe du monde 2018 |
| **Hawk-Eye** | tennis, ballon sur la ligne ou non | 2006 |

Le **VAR** n’intervient que dans **quatre cas** : un **but**, un **penalty**, un **carton rouge direct**, ou une **erreur d’identité** (le mauvais joueur sanctionné). L’arbitre sur le terrain reste le patron : la vidéo l’aide, elle ne le remplace pas.

> La technologie corrige les erreurs de fait, mais le respect de l’arbitre reste l’affaire de chacun.

## Le fair-play : jouer juste, même quand ça coûte
Le fair-play, c’est respecter l’adversaire et la règle, même sans arbitre pour regarder. Trois histoires célèbres :

| Année | Qui | Le geste |
| 1936 | **Lutz Long** (Allemagne) | aux JO de Berlin, il conseille son rival **Jesse Owens** au saut en longueur ; Owens gagne, Long arrive deuxième |
| 2000 | **Paolo Di Canio** | il refuse de marquer devant un gardien blessé et attrape le ballon à la main |
| 2012 | **Iván Fernández** | en cross, il laisse passer **Abel Mutai** qui s’était trompé de ligne d’arrivée |

Ce sont des gestes que l’on retient plus longtemps que beaucoup de victoires.

## À l’école aussi
En EPS, tu peux être **arbitre** : on t’apprend les règles, à siffler, à rester calme et à expliquer. C’est une façon de comprendre qu’un jeu n’existe que si tout le monde accepte la règle. Beaucoup de sports se jouent sans arbitre en cour de récréation : le fair-play y est le seul arbitre.

## Le respect, la règle numéro un
Insulter l’arbitre, protester sans cesse, tricher : cela abîme le jeu pour tout le monde. À l’inverse, serrer la main de l’adversaire, reconnaître une faute, aider quelqu’un qui est tombé : voilà ce qui rend un sport grand.

!> Quand tu joues, essaie de te mettre à la place de l’arbitre : il voit le match d’un seul endroit, en quelques secondes, et il doit décider.

## À retenir
- L’arbitre fait respecter la règle, protège les joueurs et décide vite ; la technologie (VAR, goal-line, Hawk-Eye) l’aide sans le remplacer.
- Le VAR n’intervient que dans quatre cas : but, penalty, carton rouge direct, erreur d’identité.
- Le fair-play, c’est jouer juste même quand ça coûte : Lutz Long, Di Canio, Fernández.`,
    },
    questions: [
      ['Quelle est la première mission de l’arbitre ?', ['Aider l’équipe qui perd', 'Faire respecter la règle, la même pour tous', 'Donner de l’ambiance au match', 'Choisir les joueurs de chaque équipe'], 1, 'L’arbitre applique la même règle aux deux camps pour que le jeu soit juste.'],
      ['Dans quel sport l’arbitre explique-t-il ses décisions au micro, seul le capitaine pouvant lui parler ?', ['Le cyclisme', 'Le tennis', 'La natation', 'Le rugby'], 3, 'Au rugby, l’arbitre s’explique et seul le capitaine échange avec lui : moins de contestation.'],
      ['Depuis quelle Coupe du monde le VAR est-il utilisé en football ?', ['1998', '2006', '2014', '2018'], 3, 'Le VAR débute à la Coupe du monde 2018 ; la goal-line technology date de 2014.'],
      ['Quel cas ne relève PAS de l’intervention du VAR ?', ['Un penalty', 'Un but', 'Une erreur d’identité', 'Un hors-jeu de touche'], 3, 'Le VAR intervient pour un but, un penalty, un carton rouge direct ou une erreur d’identité, pas pour une touche.'],
      ['Que permet la goal-line technology, utilisée depuis la Coupe du monde 2014 ?', ['Savoir si le ballon a franchi la ligne de but', 'Mesurer la vitesse des joueurs', 'Désigner le meilleur joueur', 'Compter les passes'], 0, 'Elle signale immédiatement à l’arbitre si le ballon a entièrement franchi la ligne.'],
      ['Le Hawk-Eye est utilisé au tennis depuis 2006.', ['Vrai', 'Faux'], 0, 'Ce système suit la balle et indique si elle est dedans ou dehors.'],
      ['Qui conseille Jesse Owens au saut en longueur aux Jeux de Berlin en 1936 ?', ['Pierre de Coubertin', 'Lutz Long, son rival allemand', 'Paavo Nurmi', 'Johnny Weissmuller'], 1, 'Lutz Long, un adversaire, aide Owens ; c’est un exemple célèbre de fair-play.'],
      ['Que fait Paolo Di Canio en 2000 ?', ['Il refuse de marquer devant un gardien blessé', 'Il change de maillot en cours de match', 'Il marque un but de la main', 'Il quitte le terrain en protestant'], 0, 'Il attrape le ballon à la main au lieu de profiter d’un gardien au sol.'],
      ['Que fait Iván Fernández pour Abel Mutai en 2012 ?', ['Il le laisse gagner alors que Mutai s’était trompé de ligne d’arrivée', 'Il lui vole la victoire', 'Il abandonne la course', 'Il l’accuse de tricher'], 0, 'Fernández ralentit et laisse passer Mutai : le geste est resté un symbole du fair-play.'],
      ['Le VAR remplace l’arbitre sur le terrain.', ['Vrai', 'Faux'], 1, 'L’arbitre reste le patron : la vidéo l’aide dans quatre cas précis sans le remplacer.'],
      ['Le fair-play, c’est respecter l’adversaire et la règle même quand personne ne regarde.', ['Vrai', 'Faux'], 0, 'Il s’agit de jouer juste par choix, même sans arbitre ni caméra.'],
      ['Pourquoi l’arbitrage par les élèves est-il utile en EPS ?', ['Il permet aux élèves de choisir qui gagne', 'Il fait comprendre qu’un jeu n’existe que si tous acceptent la règle', 'Il supprime les règles', 'Il remplace le professeur'], 1, 'En arbitrant, on voit le match d’un seul endroit et on mesure la difficulté de décider vite.'],
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

  titreMigration: 'SPORT 4e · 3e — « COMPRENDRE », LA CULTURE SPORTIVE (10 fiches)',

  motif: `LA MATIÈRE SPORT EST REFAITE EN CULTURE SPORTIVE (14/10/2026, Lucas :
« on va s'écarter du programme : l'histoire du sport, notamment de la France,
les fondamentaux — hypertrophie, force, endurance, récupération, anti-blessure »).
Les 8 fiches du programme officiel (champs d'apprentissage, rôles sociaux…),
identiques de la 6e à la 3e, n'intéressaient personne : rien à réviser pour un
écrit, et la langue de l'institution. Cadrage : docs/CADRAGE-SPORT.md.
Ce bloc installe 10 fiches sous 3 thèmes sur la 4e et la 3e, et retire les
anciens chapitres de Sport de ces deux niveaux (cascade : leçons, quiz,
questions, cahier, contrôles, déblocages).`,

  menage: [
    {
      raison: `Les anciens chapitres de Sport de la 4e et de la 3e partent — TOUS ceux dont
l'identifiant n'est pas dans ce bloc. Le ménage tourne AVANT les insertions ;
un rejeu ne touche donc jamais aux 10 fiches neuves (ni aux progrès des élèves
dessus). Les niveaux sont bornés à la 4e et à la 3e : chaque bloc de la nouvelle
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
