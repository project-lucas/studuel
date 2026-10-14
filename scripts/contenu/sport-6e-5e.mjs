// SPORT — 6e · 5e : « DÉCOUVRIR » (10 fiches). La matière Sport refaite en
// CULTURE SPORTIVE (14/10/2026, Lucas : « on va s'écarter [du programme], on
// doit apporter l'histoire du sport notamment de la France, les fondamentaux
// du sport : hypertrophie, force, endurance, récupération, anti-blessure »).
// Le cadrage, le programme des 40 fiches et les règles de ton sont dans
// docs/CADRAGE-SPORT.md.
//
// Axes : les règles des grands sports (5), le corps qui étonne (3), les légendes (2).
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-6e-5e`.

import { createHash } from 'node:crypto'

const NIVEAUX = ['6e', '5e']

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
  // ---- Les règles des grands sports ---------------------------------------
  {
    titre: 'Football : le hors-jeu, enfin clair',
    axe: 'Les règles des grands sports',
    lecon: {
      titre: 'Le hors-jeu en trois phrases',
      cours: `Samedi soir, ton équipe marque à la dernière minute… et l’arbitre lève le bras : but refusé pour hors-jeu. Tout le stade proteste, personne ne sait vraiment pourquoi. Voici de quoi ne plus jamais être perdu.

## Le football en bref
Un match oppose deux équipes de **11 joueurs**, gardien compris. Il dure **deux mi-temps de 45 minutes**. Chaque équipe peut faire jusqu’à **5 remplacements**, une règle devenue permanente en 2022. Gagne l’équipe qui met le plus de buts.

## Le hors-jeu en trois phrases
1. Tu es en **position de hors-jeu** quand, au moment où un coéquipier te passe le ballon, tu es plus près de la ligne de but adverse que le ballon **et** que l’avant-dernier défenseur (le gardien compte comme défenseur).
2. Être en position de hors-jeu **n’est pas une faute** en soi.
3. C’est **sanctionné** seulement si tu participes au jeu : tu touches le ballon, tu gênes un adversaire ou tu profites de la situation.

> Position de hors-jeu et hors-jeu sanctionné, ce n’est pas la même chose : tout se joue au moment de la passe.

## Quand il n’y a jamais hors-jeu
| Situation | Hors-jeu possible ? |
| Tu es dans ta propre moitié de terrain | Non |
| Tu reçois le ballon sur une touche | Non |
| Tu reçois le ballon sur un corner | Non |
| Tu reçois le ballon sur un coup de pied de but | Non |
| Tu reçois le ballon d’un adversaire | Non |

C’est pour cela qu’un attaquant peut attendre juste devant la défense sur un corner sans craindre de sifflet.

## Les cartons et le penalty
Le **carton jaune** est un avertissement. **Deux jaunes** dans le même match donnent un **carton rouge**, et le rouge direct existe pour une faute très grave : le joueur est **expulsé** et son équipe joue à dix. Le **penalty** est accordé quand un défenseur commet une faute dans sa propre surface de réparation. Le tir se fait à **11 mètres**, face au seul gardien.

!> Un carton rouge ne se remplace pas : l’équipe qui perd un joueur finit le match en infériorité numérique.

## La VAR : une aide, pas un deuxième arbitre
La **VAR** est l’assistance vidéo à l’arbitrage. Des arbitres devant des écrans vérifient certaines décisions importantes (but, penalty, carton rouge) et conseillent l’arbitre sur le terrain. Elle a été utilisée pour la première fois à une Coupe du monde en **2018**. Le dernier mot reste à l’arbitre du match.

## Revoir le but refusé
Reprenons la scène. Ton attaquant reçoit une longue passe : au moment où elle part, il est devant l’avant-dernier défenseur adverse. Il est donc en position de hors-jeu. Comme il prend ensuite le ballon et marque, il participe au jeu : le but est annulé. Si le même attaquant avait été à la hauteur du défenseur, ou si la passe était venue d’une touche, le but comptait.

## À retenir
- Hors-jeu : plus près du but que le ballon ET que l’avant-dernier défenseur, au moment de la passe.
- Il n’y a pas de hors-jeu dans sa moitié de terrain, ni sur une touche, un corner ou un coup de pied de but.
- Deux jaunes font un rouge ; le penalty se tire à 11 mètres.`,
    },
    questions: [
      ['Combien de joueurs une équipe de football aligne-t-elle sur le terrain, gardien compris ?', ['7', '11', '9', '12'], 1, 'Une équipe de football compte 11 joueurs, dont le gardien.'],
      ['Combien de remplacements une équipe peut-elle faire dans un match, depuis la règle permanente de 2022 ?', ['3', '1', '8', '5'], 3, 'Depuis 2022, la règle permanente autorise 5 remplacements par équipe.'],
      ['Être en position de hors-jeu est toujours une faute sanctionnée.', ['Vrai', 'Faux'], 1, 'La position seule ne suffit pas : il faut aussi participer au jeu au moment de la passe pour être sanctionné.'],
      ['Par rapport à quoi est jugée la position de hors-jeu d’un attaquant ?', ['Le gardien seul', 'Le numéro du maillot', 'Le ballon et l’avant-dernier défenseur', 'Le milieu de terrain'], 2, 'L’attaquant doit être plus près de la ligne de but que le ballon et que l’avant-dernier défenseur adverse.'],
      ['Dans quelle situation le hors-jeu est-il impossible ?', ['Sur une touche', 'Sur une passe longue dans la surface', 'Sur un tir cadré', 'Sur un centre venu de l’aile'], 0, 'Il n’y a jamais de hors-jeu directement sur une touche, un corner ou un coup de pied de but.'],
      ['À quelle distance du but se tire un penalty ?', ['6 mètres', '16 mètres', '9 mètres', '11 mètres'], 3, 'Le penalty se tire à 11 mètres, face au gardien seul.'],
      ['Un joueur reçoit deux cartons jaunes dans le même match. Que se passe-t-il ?', ['Le match est arrêté', 'Il est expulsé, comme avec un carton rouge', 'Il reçoit un simple avertissement de plus', 'Il sort et son équipe peut le remplacer'], 1, 'Deux jaunes équivalent à un rouge : le joueur est expulsé et personne ne le remplace.'],
      ['Un joueur est dans sa propre moitié de terrain quand on lui passe le ballon. Peut-il être hors-jeu ?', ['Oui, s’il est le plus avancé', 'Oui, si le gardien est sorti', 'Non, jamais dans sa moitié de terrain', 'Oui, si un défenseur est derrière lui'], 2, 'Dans sa propre moitié de terrain, on ne peut pas être hors-jeu, quelle que soit la position des défenseurs.'],
      ['Le gardien adverse compte parmi les défenseurs pour juger un hors-jeu.', ['Vrai', 'Faux'], 0, 'Le gardien est un défenseur comme les autres : il peut être l’avant-dernier ou le dernier adversaire.'],
      ['La VAR a été utilisée pour la première fois à une Coupe du monde en…', ['2018', '1998', '2010', '2022'], 0, 'L’assistance vidéo à l’arbitrage a fait son entrée en Coupe du monde en 2018.'],
      ['La VAR remplace l’arbitre sur le terrain, qui n’a plus le dernier mot.', ['Vrai', 'Faux'], 1, 'La VAR conseille l’arbitre sur certaines décisions importantes, mais c’est lui qui décide.'],
    ],
  },
  {
    titre: 'Basket : marcher, 24 secondes, 3 points',
    axe: 'Les règles des grands sports',
    lecon: {
      titre: 'Les règles qui font le rythme du basket',
      cours: `Dernière minute, deux points de retard, le ballon dans les mains de ton meneur. L’horloge des 24 secondes tourne, et un seul faux pas peut tout gâcher. Le basket est un sport de règles courtes qui forcent à jouer vite.

## Les bases
Deux équipes de **5 joueurs** s’affrontent. Selon les règles internationales (FIBA), un match dure **4 quarts-temps de 10 minutes** ; en NBA, ce sont **4 quarts de 12 minutes**. Le panier est fixé à **3,05 mètres** du sol. On marque en lançant le ballon dans l’anneau adverse.

## Combien vaut un panier ?
| Tir | Points |
| Lancer franc (tir de réparation, sans défenseur) | 1 |
| Tir à l’intérieur de la ligne | 2 |
| Tir derrière la ligne à trois points | 3 |

La ligne à trois points est à **6,75 m** du panier en FIBA et **7,24 m** en NBA.

## Marcher, ou ne pas marcher
Tu peux courir avec le ballon à condition de **dribbler**, c’est-à-dire de le faire rebondir. Quand tu le prends dans les mains, tu n’as droit qu’à **deux appuis**. Aller plus loin sans dribbler, c’est **marcher** : le ballon passe à l’adversaire. Autre erreur classique : la **reprise de dribble**. Si tu arrêtes de dribbler, tu ne peux plus dribbler de nouveau avant d’avoir passé ou tiré.

> Dribbler, c’est avoir le droit de bouger. Dès que tu tiens le ballon, tu dois passer ou tirer.

## L’horloge qui presse
Le basket impose plusieurs chronomètres :
- **24 secondes** pour tirer : l’équipe qui a le ballon doit au moins toucher l’anneau avant la fin ;
- **8 secondes** pour franchir la ligne médiane après avoir récupéré le ballon ;
- **3 secondes** : un attaquant ne reste pas plus de trois secondes dans la raquette (le rectangle sous le panier) quand son équipe a le ballon.

!> Dépasser un de ces délais donne le ballon à l’adversaire. Une équipe qui joue trop lentement se fait siffler, même sans faute.

## Les fautes
Toucher, pousser ou gêner un adversaire est une **faute personnelle**. Un joueur qui en commet **5** est **exclu** du match (6 en NBA). Une faute sur un joueur en train de tirer lui donne des lancers francs, tirés sans défenseur.

## Revoir la fin de match
Reprenons ton meneur. Il reste huit secondes sur l’horloge des 24 secondes. Il doit tirer avant l’alarme, sans marcher, avec le ballon qui doit toucher l’anneau. S’il recule derrière la ligne à trois points et réussit, il apporte trois points d’un coup. L’histoire du basket est pleine de victoires qui se sont jouées sur une seule de ces règles.

## À retenir
- 5 joueurs, 4 quarts-temps (10 min en FIBA, 12 en NBA), panier à 3,05 m.
- Marcher, c’est dépasser deux appuis sans dribbler ; 24 secondes pour tirer, 8 pour passer la ligne médiane, 3 dans la raquette.
- Lancer franc = 1 point ; tir normal = 2 ; tir derrière la ligne = 3 (6,75 m en FIBA, 7,24 m en NBA).`,
    },
    questions: [
      ['À quelle hauteur se trouve le panier de basket ?', ['3,50 mètres', '3,05 mètres', '2,43 mètres', '2,80 mètres'], 1, 'Le panier est fixé à 3,05 mètres du sol, partout dans le monde.'],
      ['Combien de joueurs une équipe de basket aligne-t-elle sur le terrain ?', ['6', '7', '11', '5'], 3, 'Chaque équipe a 5 joueurs sur le terrain.'],
      ['Combien vaut un lancer franc réussi ?', ['3 points', '0 point', '1 point', '2 points'], 2, 'Un lancer franc vaut 1 point, un tir normal 2 et un tir derrière la ligne 3.'],
      ['Que signifie « marcher » au basket ?', ['Faire plus de deux appuis avec le ballon sans dribbler', 'Marcher sans le ballon', 'Dribbler avec les deux mains', 'Sortir du terrain'], 0, 'Tenir le ballon et avancer au-delà des deux appuis sans le faire rebondir est une violation : le ballon passe à l’adversaire.'],
      ['Dans quel délai une équipe doit-elle tirer après avoir récupéré le ballon ?', ['8 secondes', '3 secondes', '60 secondes', '24 secondes'], 3, 'Les 24 secondes obligent l’équipe à tenter sa chance avant la fin du chronomètre.'],
      ['Quelle règle impose de franchir la ligne médiane en 8 secondes ?', ['Le lancer franc', 'La règle des 8 secondes', 'La règle des 3 secondes', 'La reprise de dribble'], 1, 'Après avoir récupéré le ballon dans son camp, on a 8 secondes pour passer la ligne médiane.'],
      ['Un match de la NBA dure 4 quarts-temps de 12 minutes, contre 10 minutes en FIBA.', ['Vrai', 'Faux'], 0, 'La NBA joue 4 × 12 minutes, alors que les règles FIBA donnent 4 × 10 minutes.'],
      ['Après combien de fautes personnelles un joueur est-il exclu en règles FIBA ?', ['6', '10', '5', '3'], 2, 'En FIBA, la cinquième faute personnelle exclut le joueur (la sixième en NBA).'],
      ['La ligne à trois points est exactement à la même distance en FIBA et en NBA.', ['Vrai', 'Faux'], 1, 'Elle est à 6,75 m en FIBA et à 7,24 m en NBA.'],
      ['Un joueur arrête de dribbler, puis redémarre son dribble. Que se passe-t-il ?', ['C’est une reprise de dribble : le ballon passe à l’adversaire', 'C’est un panier de plus', 'C’est autorisé', 'C’est un lancer franc pour lui'], 0, 'Une fois le dribble arrêté, on doit passer ou tirer ; redribbler est une faute de reprise de dribble.'],
      ['Un attaquant peut rester trois minutes dans la raquette sans problème.', ['Vrai', 'Faux'], 1, 'La règle des 3 secondes l’interdit : au-delà, le ballon passe à l’adversaire.'],
    ],
  },
  {
    titre: 'Handball et volley : les règles qui comptent',
    axe: 'Les règles des grands sports',
    lecon: {
      titre: 'Handball et volley, deux rois de la cour',
      cours: `Chaque année, des millions d’élèves découvrent le handball ou le volley en cours d’EPS. Deux sports collectifs, deux univers : l’un se joue à la main et à l’impact, l’autre au-dessus d’un filet.

## Le handball : 7 joueurs et un duel de vitesse
Une équipe aligne **7 joueurs** : 6 joueurs de champ et un gardien. Le match dure **2 mi-temps de 30 minutes**. Autour du but, une zone de **6 mètres** est réservée au gardien : les autres n’ont pas le droit d’y poser le pied (ils peuvent tirer en l’air au-dessus, en sautant).

## Avec le ballon, on ne fait pas n’importe quoi
| Règle | Ce qu’elle dit |
| 3 pas | on ne fait pas plus de trois pas avec le ballon en main |
| 3 secondes | on ne garde pas le ballon plus de trois secondes sans dribbler ni passer |
| Jeu passif | si une équipe ne tente pas d’attaquer, l’arbitre lève le bras et elle doit tirer vite |
| Jet de 7 m | pénalité accordée quand une occasion de but nette est empêchée |

> Le handball récompense le jeu rapide : trois pas, trois secondes, et le jeu passif empêchent de garder la balle.

## La sanction : l’exclusion
Une faute grave ou répétée vaut une **exclusion de 2 minutes** : le joueur sort, son équipe joue à six pendant ce temps.

## Le volley : un filet et trois touches
Une équipe de volley compte **6 joueurs** sur le terrain. On marque en envoyant le ballon dans le camp adverse, sans le laisser tomber dans le sien. Chaque équipe a **3 touches maximum** pour renvoyer le ballon.
- Un **set** se gagne à **25 points avec 2 points d’écart** ;
- le **5e set**, décisif, se joue en **15 points** ;
- le **filet** est à **2,43 m** pour les hommes et **2,24 m** pour les femmes.

## La rotation et le libéro
Chaque fois qu’une équipe récupère le service, ses joueurs tournent d’une place. Ainsi, tout le monde sert et tout le monde joue à tous les postes. Le **libéro** est un joueur spécialisé dans la défense : il porte un maillot de couleur différente et ne peut ni attaquer ni servir.

!> Le libéro ne peut jamais smasher au-dessus du filet. Son rôle : réceptionner et défendre.

## La France à l’honneur
Le handball français a écrit sa légende. Les **Experts**, l’équipe masculine, ont décroché l’or olympique en **2008**, **2012** et **2020** (Tokyo). Les **Bleues** ont conquis l’or olympique en **2020**. Deux sports qui se pratiquent dans toutes les cours d’école, deux palmarès qui font rêver.

## À retenir
- Handball : 7 joueurs, 2 × 30 min, zone des 6 m pour le gardien, 3 pas et 3 secondes, exclusion de 2 minutes.
- Volley : 6 joueurs, sets à 25 points avec 2 d’écart (15 au 5e), 3 touches maximum, rotation au service.
- Le libéro défend seulement ; le filet est à 2,43 m (hommes) et 2,24 m (femmes).`,
    },
    questions: [
      ['Combien de joueurs, gardien compris, une équipe de handball a-t-elle sur le terrain ?', ['5', '7', '6', '11'], 1, 'Une équipe de handball aligne 6 joueurs de champ et un gardien, soit 7.'],
      ['Combien de pas peut-on faire avec le ballon en main au handball ?', ['1', '5', 'Autant qu’on veut', '3'], 3, 'On ne fait pas plus de trois pas avec le ballon sans dribbler.'],
      ['Qui a le droit d’entrer dans la zone des 6 mètres au handball ?', ['Les attaquants', 'Les remplaçants', 'Seulement le gardien', 'Tous les joueurs'], 2, 'La zone des 6 mètres est réservée au gardien de but.'],
      ['Que se passe-t-il quand un joueur de handball reçoit une exclusion de 2 minutes ?', ['Il sort 2 minutes et son équipe joue à six', 'Il est exclu du match pour toujours', 'Il reste mais perd un point', 'Son équipe joue à huit'], 0, 'Pendant deux minutes, l’équipe reste en infériorité numérique.'],
      ['Le jeu passif est une règle qui oblige une équipe à…', ['défendre en zone', 'changer de gardien', 'marquer deux fois', 'tenter vraiment d’attaquer'], 3, 'Si une équipe ne cherche pas à marquer, l’arbitre signale le jeu passif et elle doit tirer vite.'],
      ['À partir de combien de points un set de volley est-il gagné, avec 2 points d’écart ?', ['30', '25', '15', '21'], 1, 'Un set se gagne à 25 points, avec au moins 2 points d’écart ; seul le 5e set va à 15.'],
      ['Chaque équipe de volley peut toucher le ballon au maximum trois fois avant de le renvoyer.', ['Vrai', 'Faux'], 0, 'La règle des trois touches maximum oblige à construire l’attaque.'],
      ['Que peut faire le libéro, en maillot de couleur différente ?', ['Servir toujours', 'Arbitrer', 'Défendre seulement', 'Attaquer au filet'], 2, 'Le libéro est spécialisé dans la défense : il ne peut ni attaquer ni servir.'],
      ['À quelle hauteur est le filet de volley pour les hommes ?', ['2,43 m', '2,24 m', '3,05 m', '1,80 m'], 0, '2,43 m pour les hommes, 2,24 m pour les femmes.'],
      ['En volley, la rotation permet à tous les joueurs de servir.', ['Vrai', 'Faux'], 0, 'À chaque récupération du service, les joueurs tournent d’une place : tout le monde passe au service.'],
      ['En quelle année l’équipe de France masculine de handball a-t-elle remporté l’or olympique pour la première fois ?', ['2016', '2008', '1992', '2000'], 1, 'Les Experts ont gagné l’or olympique à Pékin en 2008, puis en 2012 et en 2020.'],
    ],
  },
  {
    titre: 'Rugby : l’en-avant, l’essai, la mêlée',
    axe: 'Les règles des grands sports',
    lecon: {
      titre: 'Le rugby, le ballon qui ne va qu’en arrière',
      cours: `Un ballon ovale, des joueurs qui courent vers l’avant… mais qui n’ont pas le droit de passer vers l’avant. C’est le paradoxe du rugby. Pour progresser, il faut se faire des passes en arrière ou sur les côtés.

## Les bases du rugby à XV
Une équipe compte **15 joueurs**. Le match dure **2 mi-temps de 40 minutes**. Le but : poser le ballon dans l’en-but adverse, la zone derrière la ligne de but.

## Comment marque-t-on ?
| Action | Points |
| Essai (ballon aplati dans l’en-but) | 5 |
| Transformation (tir après l’essai) | 2 |
| Pénalité (tir de réparation entre les poteaux) | 3 |
| Drop (coup de pied tombé en plein jeu) | 3 |

## L’en-avant et la mêlée
Passer le ballon vers l’avant, ou le lâcher vers l’avant, est un **en-avant**. L’arbitre siffle et l’équipe adverse obtient une **mêlée** : huit joueurs de chaque équipe se lient, se poussent et le ballon est lancé entre eux.

> Le ballon ne se passe qu’en arrière ou sur le côté ; on ne le jette jamais vers l’avant.

## Plaquer, c’est dangereux, alors c’est encadré
Tu peux plaquer un joueur qui porte le ballon, mais **sous la ligne des épaules**. Plaquer au cou ou à la tête est interdit et puni. Après un plaquage, le joueur doit lâcher le ballon.

## Deux mots à connaître
- Le **ruck** : après un plaquage, des joueurs se lient debout au-dessus du ballon posé au sol pour le protéger ou le récupérer.
- Le **maul** : un porteur du ballon est tenu debout par les adversaires, et ses coéquipiers s’accrochent à lui pour avancer ensemble.

## La touche
Quand le ballon sort sur le côté, on joue une **touche** : les joueurs forment deux lignes parallèles, un coéquipier lance le ballon entre elles, et les joueurs sautent, soulevés par leurs partenaires, pour l’attraper.

## Le respect avant tout
Au rugby, on s’adresse à l’arbitre par « **Monsieur** » et on ne le conteste pas. C’est le capitaine seul qui lui parle. Cette règle de politesse fait partie de l’esprit du jeu.

## Le rugby à 7
Même ballon, moins de joueurs : **7 par équipe**, des matchs de **2 × 7 minutes**. Les Français l’ont emporté à **Paris 2024**, avec un or olympique et Antoine Dupont comme figure de proue.

## Pourquoi le ballon est-il ovale ?
Sa forme ovale lui permet de rebondir de façon imprévisible, mais aussi de se glisser sous un bras et de se lancer en tournant sur lui-même. Un ballon rond, lui, rebondit trop régulièrement pour ce jeu de contact.

## À retenir
- 15 joueurs, 2 × 40 min ; le ballon ne se passe qu’en arrière ou sur le côté.
- Essai = 5 points, transformation = 2, pénalité = 3, drop = 3.
- En-avant : mêlée pour l’adversaire ; plaquage sous la ligne des épaules.`,
    },
    questions: [
      ['Combien de joueurs compte une équipe de rugby à XV ?', ['7', '11', '13', '15'], 3, 'XV, c’est 15 en chiffres romains : 15 joueurs par équipe.'],
      ['Combien de temps dure chaque mi-temps au rugby à XV ?', ['30 minutes', '7 minutes', '40 minutes', '45 minutes'], 2, 'Un match de rugby à XV se joue en deux mi-temps de 40 minutes.'],
      ['Dans quelle direction peut-on passer le ballon au rugby ?', ['Vers l’arrière ou sur le côté', 'Vers l’avant seulement', 'Dans toutes les directions', 'Vers le haut seulement'], 0, 'La passe vers l’avant est un en-avant : on passe en arrière ou latéralement.'],
      ['Que vaut un essai au rugby à XV ?', ['3 points', '2 points', '7 points', '5 points'], 3, 'L’essai vaut 5 points ; la transformation en ajoute 2.'],
      ['Que se passe-t-il après un en-avant ?', ['Une touche pour la même équipe', 'Une mêlée pour l’équipe adverse', 'Un essai de pénalité', 'Un carton rouge'], 1, 'L’en-avant se sanctionne par une mêlée au profit des adversaires.'],
      ['Où le plaquage doit-il se faire ?', ['À la tête', 'Peu importe où', 'Sous la ligne des épaules', 'Au niveau du cou'], 2, 'Plaquer au cou ou à la tête est interdit : on plaque sous la ligne des épaules.'],
      ['Une pénalité réussie entre les poteaux rapporte 3 points.', ['Vrai', 'Faux'], 0, 'La pénalité comme le drop valent 3 points.'],
      ['Que fait-on pendant une touche ?', ['On lance le ballon entre deux lignes de joueurs', 'On tire un penalty', 'On forme une mêlée', 'On change de camp'], 0, 'Un coéquipier lance le ballon entre les deux lignes, et les joueurs sautent pour l’attraper.'],
      ['Au rugby, qui peut discuter avec l’arbitre ?', ['Le public du stade', 'Le capitaine, avec respect', 'Tous les joueurs à voix haute', 'Les supporters'], 1, 'On appelle l’arbitre « Monsieur » et seul le capitaine lui parle.'],
      ['Le rugby à 7 oppose deux équipes de 7 joueurs sur des matchs de 2 × 7 minutes.', ['Vrai', 'Faux'], 0, 'C’est la version courte et rapide du rugby, qui a donné l’or à la France à Paris 2024.'],
      ['Un joueur lance le ballon vers l’avant à son coéquipier. L’arbitre siffle…', ['un essai', 'une transformation', 'un drop', 'un en-avant'], 3, 'Toute passe vers l’avant est un en-avant, quelle que soit la distance.'],
      ['Le ruck est un rassemblement de joueurs autour d’un ballon posé au sol.', ['Vrai', 'Faux'], 0, 'Après un plaquage, des joueurs se lient debout au-dessus du ballon au sol pour le protéger ou le récupérer.'],
    ],
  },
  {
    titre: 'Tennis et badminton : jeu, set, tie-break',
    axe: 'Les règles des grands sports',
    lecon: {
      titre: 'Lire un score de tennis ou de badminton',
      cours: `Sur l’écran, le score affiche « 6-4, 3-6, 7-6 ». Qui gagne ? Comment est-ce possible de mener 40-0 et de perdre quand même le jeu ? Les raquettes ont leurs propres mathématiques.

## Le tennis : jeu, set, match
Un match se découpe en trois niveaux : le **jeu**, le **set**, le **match**. Dans un jeu, les points s’appellent **15, 30, 40**. Le premier qui atteint 40 puis gagne le point suivant remporte le jeu.

## L’égalité et l’avantage
À **40 partout**, c’est l’**égalité**. Il faut alors deux points d’écart : le joueur qui gagne le point suivant a l’**avantage**. S’il gagne encore, il prend le jeu ; sinon, retour à l’égalité.

## Gagner un set
| Étape | Règle |
| Un set | 6 jeux gagnés avec 2 jeux d’écart (6-4, 6-3…) |
| À 6-6 | un **tie-break** décide du set |
| Tie-break | premier à 7 points, avec 2 points d’écart |
| Un match | 2 sets gagnants, ou 3 en Grand Chelem chez les messieurs |

> Au tennis, on gagne toujours avec deux unités d’écart : deux points à l’égalité, deux jeux dans un set, deux points au tie-break.

## Le service
Chaque joueur a **deux balles de service**. Si la première est faute, il en a une seconde ; si elle est faute aussi, c’est une **double faute** et le point est perdu. Si la balle de service touche le filet et tombe dans le bon carré, c’est un **let** : on rejoue le service.

## Roland-Garros
Le tournoi de Roland-Garros se joue sur **terre battue**, à Paris. Son stade a été construit en **1928**. Le recordman est l’Espagnol **Rafael Nadal**, qui l’a gagné **14 fois**.

## Le badminton
Autre sport, autres règles. Un set se joue en **21 points** avec 2 points d’écart, plafonné à **30** (à 29-29, le point suivant décide). Il faut gagner **2 sets**. Le service se fait par **en dessous**, et le volant ne pèse que **5 grammes** environ.

!> Le smash de badminton est le plus rapide de tous les sports de raquette : des vitesses de plus de 400 km/h ont été mesurées en match. Un record de 565 km/h a même été mesuré dans un test en 2023.

## Lire un score affiché
Revenons à « 6-4, 3-6, 7-6 ». Le joueur a gagné le premier set 6-4, perdu le deuxième 3-6, puis gagné le troisième au tie-break. Il a donc gagné deux sets contre un : le match est à lui.

## À retenir
- Tennis : 15, 30, 40, jeu ; set à 6 jeux (2 d’écart) ; tie-break à 6-6 (7 points, 2 d’écart).
- Deux balles de service ; le let se rejoue.
- Badminton : set à 21 points (2 d’écart, plafond à 30), 2 sets gagnants.`,
    },
    questions: [
      ['Quels sont les points d’un jeu au tennis ?', ['10, 20, 30', '5, 10, 15', '15, 30, 40', '1, 2, 3'], 2, 'Les points d’un jeu se comptent 15, 30 et 40, puis le jeu.'],
      ['Que se passe-t-il quand le score d’un jeu est de 40 partout ?', ['C’est l’égalité : il faut deux points d’écart', 'Le jeu est rejoué', 'Le premier serveur gagne', 'Le set se termine'], 0, 'À l’égalité, un joueur doit gagner deux points de suite (avantage puis jeu).'],
      ['Combien de jeux faut-il gagner pour un set, avec 2 jeux d’écart ?', ['4', '10', '3', '6'], 3, 'On gagne un set à 6 jeux, avec 2 jeux d’écart.'],
      ['Quand joue-t-on un tie-break ?', ['Au premier set', 'À 6 jeux partout', 'À 40 partout', 'À 3 sets partout'], 1, 'À 6-6 dans un set, on joue un tie-break pour décider du gagnant du set.'],
      ['Combien de points faut-il pour gagner un tie-break ?', ['10', '3', '7, avec 2 points d’écart', '5'], 2, 'Le tie-break se gagne à 7 points avec 2 points d’écart.'],
      ['Combien de balles de service a-t-on pour chaque point ?', ['Deux', 'Une', 'Trois', 'Quatre'], 0, 'Après une première faute, on a une seconde balle ; deux fautes font une double faute.'],
      ['Un « let » au service signifie…', ['que la balle est trop haute', 'qu’on rejoue le service', 'que le point est perdu', 'que le jeu est gagné'], 1, 'Quand le service touche le filet et tombe dans le bon carré, le service est rejoué.'],
      ['Roland-Garros se joue sur terre battue.', ['Vrai', 'Faux'], 0, 'Le tournoi de Roland-Garros se dispute sur terre battue, à Paris.'],
      ['Combien de fois Rafael Nadal a-t-il gagné Roland-Garros ?', ['7', '10', '20', '14'], 3, 'Rafael Nadal détient le record de 14 victoires à Roland-Garros.'],
      ['Au badminton, un set se joue en 21 points avec 2 points d’écart.', ['Vrai', 'Faux'], 0, 'Le set se joue à 21 points avec 2 d’écart, plafonné à 30.'],
      ['Combien de sets faut-il gagner pour remporter un match de badminton ?', ['1', '5', '2', '3'], 2, 'Un match de badminton se joue au meilleur des trois sets : il faut en gagner 2.'],
    ],
  },
  // ---- Le corps qui étonne -------------------------------------------------
  {
    titre: 'Pourquoi on transpire et pourquoi on a chaud',
    axe: 'Le corps qui étonne',
    lecon: {
      titre: 'La sueur, le radiateur du corps',
      cours: `Tu cours dix minutes dans la cour : ton visage devient rouge, tes cheveux collent, ton t-shirt est trempé. Ton corps ne dysfonctionne pas, au contraire : il se protège d’une surchauffe.

## Un muscle, c’est un petit moteur
Quand un muscle travaille, il brûle de l’énergie. Mais ce moteur est peu efficace : environ **un quart** de l’énergie dépensée sert à bouger, et les **trois quarts** partent en **chaleur**. Plus l’effort est intense, plus le corps chauffe.

## 37 °C, pas un de plus
Le corps doit rester autour de **37 °C**. Trop chaud, les organes souffrent. Ton cerveau, qui joue le rôle de thermostat, déclenche alors deux réactions :
- tu **transpires** ;
- tes vaisseaux sanguins, sous la peau, se **dilatent** pour laisser la chaleur sortir. C’est pour cela que tu **rougis** à l’effort.

## La sueur refroidit en s’évaporant
Tu as entre **2 et 4 millions de glandes sudoripares** sur la peau. Elles sécrètent de la sueur, de l’eau avec un peu de sel. Mais ce n’est pas la sueur qui refroidit : c’est son **évaporation**. En passant de liquide à gaz, l’eau prend de la chaleur à ta peau.

> Ce qui refroidit, ce n’est pas la sueur qui coule, c’est la sueur qui s’évapore.

| Situation | Évaporation | Effet |
| Air sec et ventilé | rapide | tu te refroidis bien |
| Air humide, sans vent | lente | la sueur coule « pour rien » |
| Vêtement imperméable | bloquée | tu surchauffes |

## Combien d’eau perd-on ?
Pendant un effort intense, on peut perdre **1 à 2 litres par heure**. Si on ne les remplace pas, on se déshydrate : fatigue, maux de tête, crampes. Le réflexe : **boire avant d’avoir soif**. Quand la soif apparaît, le manque d’eau a déjà commencé.

## Le coup de chaleur
Par forte chaleur, ou en s’entraînant trop habillé, le corps peut ne plus arriver à se refroidir : c’est le **coup de chaleur**.

!> Signes d’alerte : peau très rouge et chaude, mal de tête, vertiges, nausées, confusion. Il faut arrêter l’effort, se mettre à l’ombre, s’allonger, boire par petites gorgées, se refroidir avec de l’eau fraîche, et appeler les secours (le 15 ou le 112) s’il n’y a pas d’amélioration.

## Bien s’habiller
Le secret : **les couches**. Une couche respirante contre la peau, une plus chaude par-dessus qu’on enlève quand on chauffe. On évite le coton trempé qui refroidit mal, et on met une casquette quand il fait très chaud.

## La bouteille d’eau qu’on oublie
Tu pars à l’entraînement sans gourde ? C’est la première erreur. Avec une gourde, tu bois par petites gorgées avant, pendant et après l’effort. Sans elle, tu risques la déshydratation sans même t’en apercevoir.

## À retenir
- Les trois quarts de l’énergie d’un muscle partent en chaleur ; le corps tient 37 °C.
- Seule la sueur qui s’évapore refroidit.
- On boit avant d’avoir soif ; en cas de coup de chaleur, on s’arrête, on se refroidit, on appelle.`,
    },
    questions: [
      ['Quelle part de l’énergie dépensée par un muscle part en chaleur ?', ['Environ les trois quarts', 'Environ un dixième', 'Environ la moitié exactement', 'Presque rien'], 0, 'Environ les trois quarts de l’énergie partent en chaleur et un quart seulement en mouvement.'],
      ['Autour de quelle température le corps cherche-t-il à rester ?', ['30 °C', '42 °C', '25 °C', '37 °C'], 3, 'Le corps tient autour de 37 °C : c’est la température où les organes fonctionnent bien.'],
      ['Qu’est-ce qui refroidit réellement le corps quand on transpire ?', ['La couleur de la peau', 'L’évaporation de la sueur', 'La quantité de sueur', 'Le sel dans la sueur'], 1, 'L’eau qui s’évapore prend de la chaleur à la peau : c’est l’évaporation qui refroidit.'],
      ['Pourquoi rougit-on pendant un effort ?', ['Le sang devient plus rouge', 'La peau est abîmée', 'Les vaisseaux de la peau se dilatent pour évacuer la chaleur', 'Le cœur s’arrête un instant'], 2, 'Les vaisseaux sous la peau s’élargissent : plus de sang arrive près de la surface et la chaleur s’échappe.'],
      ['Quand faut-il boire pendant un effort ?', ['Avant d’avoir soif', 'Seulement quand on a soif', 'Jamais pendant l’effort', 'Après l’effort uniquement'], 0, 'La soif arrive quand le manque d’eau a déjà commencé : on boit avant, par petites gorgées.'],
      ['La sueur qui coule sans s’évaporer refroidit autant que celle qui s’évapore.', ['Vrai', 'Faux'], 1, 'Seule l’évaporation prend la chaleur de la peau ; une sueur qui coule ne refroidit presque pas.'],
      ['Pourquoi transpire-t-on davantage quand l’air est humide sans vent ?', ['Le soleil chauffe plus', 'La sueur s’évapore mal, alors le corps en produit plus', 'L’eau est plus chaude', 'On a moins de glandes'], 1, 'L’air humide ralentit l’évaporation : le corps transpire plus pour compenser et se refroidit moins bien.'],
      ['Combien de glandes sudoripares a-t-on environ sur la peau ?', ['20 à 40', '200 à 400', '2 à 4 milliards', '2 à 4 millions'], 3, 'On compte entre 2 et 4 millions de glandes qui fabriquent la sueur.'],
      ['Un élève a la peau très rouge et chaude, un mal de tête et des vertiges par forte chaleur. Que faire ?', ['Boire un grand verre d’eau glacée d’un coup', 'Mettre un pull pour transpirer plus', 'Arrêter l’effort, se mettre à l’ombre, se refroidir et prévenir un adulte', 'Continuer pour s’habituer'], 2, 'Ce sont les signes d’un coup de chaleur : il faut stopper, refroidir le corps et faire appeler les secours si ça ne passe pas.'],
      ['On peut perdre 1 à 2 litres de sueur par heure lors d’un effort intense.', ['Vrai', 'Faux'], 0, 'À effort intense, la perte atteint un à deux litres par heure : d’où l’importance de s’hydrater.'],
      ['Pourquoi s’habiller en couches est-il pratique pour le sport ?', ['On peut en enlever une quand on a chaud', 'Cela fait plus joli', 'On transpire moins', 'On court plus vite'], 0, 'Les couches s’ajoutent ou s’enlèvent selon la température du corps, sans surchauffer ni se refroidir.'],
    ],
  },
  {
    titre: 'Le cœur, le souffle et le point de côté',
    axe: 'Le corps qui étonne',
    lecon: {
      titre: 'Quand ça bat vite et que ça pique',
      cours: `Tu sprintes jusqu’au bout de la cour : ton cœur cogne, ta bouche s’ouvre, et soudain une douleur te perce sous les côtes. Pas de panique : ton corps fait exactement son travail.

## Ton cœur au repos
Au repos, le cœur d’un adulte bat **60 à 80 fois par minute**. Chez un enfant ou un adolescent, c’est un peu plus. Pour le compter, pose deux doigts sur ton poignet, du côté du pouce, et compte les battements pendant 15 secondes, puis multiplie par 4.

## Quand l’effort commence
Tes muscles réclament de l’oxygène. Le cœur accélère pour leur en envoyer plus : il pompe environ **5 litres de sang par minute** au repos, et **20 à 25 litres** à l’effort.

Il existe une approximation de la fréquence cardiaque maximale : **220 moins ton âge**. À 12 ans, cela donne autour de 208. C’est une estimation, pas une mesure exacte, et chacun est un peu différent.

## On respire plus vite
| Ce que fait le corps | Pourquoi |
| Le cœur bat plus vite | pour envoyer plus de sang aux muscles |
| On respire plus vite et plus profond | pour apporter l’oxygène |
| On expire plus | pour évacuer le gaz carbonique (CO2) |

> Être essoufflé à l’effort est normal : c’est le signe que ton corps s’adapte. Avec l’entraînement, tu t’essouffles moins vite.

## Le point de côté
Cette douleur vive sous les côtes, souvent à droite, est très courante. Ses **causes ne sont pas totalement connues** : on pense que le diaphragme (le muscle de la respiration) et les ligaments qui retiennent les organes tirent sur le ventre quand on court et respire mal.

Pour le faire passer :
- ralentir, voire marcher ;
- respirer profondément, en soufflant longtemps ;
- presser avec la main à l’endroit de la douleur.

Pour l’éviter, on ne mange pas **juste avant** de courir et on s’échauffe doucement.

!> Une douleur dans la poitrine, un malaise ou un essoufflement anormal doivent être signalés tout de suite à un adulte.

## Le cœur d’athlète
Le cœur est un muscle, et comme les autres, il se renforce à l’entraînement. Chez les sportifs d’endurance, il pompe plus de sang à chaque battement : **au repos, il bat plus lentement**. Chez certains champions, on a mesuré environ **40 battements par minute**.

## À toi de jouer
Compte ton pouls au repos, puis après une course de deux minutes. Tu verras la différence : ton cœur a accéléré pour répondre à ta demande.

## À retenir
- Pouls au repos : 60 à 80 par minute ; à l’effort, le cœur envoie jusqu’à 20-25 litres de sang par minute.
- Fréquence maximale ≈ 220 − âge, une approximation.
- Point de côté : on ralentit et on respire profondément ; l’endurance renforce le cœur.`,
    },
    questions: [
      ['Quelle est la fréquence cardiaque d’un adulte au repos ?', ['10 à 20 battements par minute', '150 à 180 battements par minute', '300 battements par minute', '60 à 80 battements par minute'], 3, 'Au repos, le cœur d’un adulte bat 60 à 80 fois par minute.'],
      ['Combien de litres de sang le cœur envoie-t-il par minute à l’effort ?', ['200 litres', '20 à 25 litres', '1 litre', '5 litres'], 1, 'Au repos il envoie environ 5 litres par minute, et jusqu’à 20 à 25 à l’effort.'],
      ['Comment estime-t-on la fréquence cardiaque maximale ?', ['L’âge multiplié par 10', '60 moins l’âge', '220 moins l’âge', '100 plus l’âge'], 2, 'La formule 220 − âge donne une approximation, pas une mesure exacte.'],
      ['Pourquoi respire-t-on plus vite à l’effort ?', ['Pour apporter plus d’oxygène et évacuer le CO2', 'Parce qu’on a peur', 'Pour avoir plus chaud', 'Pour économiser de l’énergie'], 0, 'Les muscles ont besoin d’oxygène et produisent du CO2 qu’il faut rejeter.'],
      ['Être essoufflé à l’effort est le signe d’un corps malade.', ['Vrai', 'Faux'], 1, 'C’est normal : le corps s’adapte à l’effort, et on s’essouffle moins vite avec l’entraînement.'],
      ['Que faire quand on a un point de côté ?', ['Boire beaucoup d’un coup', 'Ralentir et respirer profondément', 'Courir plus vite', 'Retenir son souffle'], 1, 'Ralentir, souffler longuement et respirer profondément aide la douleur à passer.'],
      ['On connaît parfaitement la cause du point de côté.', ['Vrai', 'Faux'], 1, 'Ses causes restent mal connues : le diaphragme et les ligaments qui tirent sur les organes sont les pistes principales.'],
      ['Comment éviter plus facilement le point de côté ?', ['Manger un gros repas avant', 'Ne jamais s’échauffer', 'Courir en retenant son souffle', 'Ne pas manger juste avant de courir'], 3, 'Un estomac plein juste avant l’effort favorise le point de côté.'],
      ['Que devient le cœur d’un sportif d’endurance ?', ['Il s’arrête plus souvent', 'Il rétrécit', 'Il bat plus lentement au repos', 'Il bat plus vite au repos'], 2, 'Le muscle cardiaque, renforcé, pompe plus à chaque battement : il bat moins souvent au repos.'],
      ['Comment compter son pouls au poignet ?', ['Compter les battements pendant 15 secondes puis multiplier par 4', 'Compter une seule seconde', 'Compter pendant 10 minutes', 'Appuyer fort sur le ventre'], 0, '15 secondes × 4 donne le nombre de battements par minute.'],
      ['Certains champions ont un pouls au repos d’environ 40 battements par minute.', ['Vrai', 'Faux'], 0, 'C’est la marque d’un « cœur d’athlète » : très entraîné, il bat lentement au repos.'],
    ],
  },
  {
    titre: 'Crampe, courbature, ampoule : que faire ?',
    axe: 'Le corps qui étonne',
    lecon: {
      titre: 'Les petits bobos du sportif',
      cours: `Tu t’es entraîné dur. Le soir, ton mollet se contracte d’un coup. Le lendemain, descendre l’escalier est une épreuve. Et ta chaussure a laissé une cloque sur ton talon. Tous ces bobos ont une explication, et une solution.

## La crampe
La **crampe** est une contraction brutale, douloureuse et **involontaire** du muscle. Elle vient surtout de la **fatigue musculaire**, parfois aggravée par la **déshydratation**.

Que faire ? Étirer **doucement** le muscle, le masser, et boire.

## La courbature
La **courbature** apparaît **24 à 48 heures** après un effort inhabituel et dure 2 à 3 jours. Elle vient de **micro-lésions** dans les fibres du muscle. Bouger doucement aide (marche, vélo tranquille).

!> Les courbatures ne prouvent pas que tu progresses. On progresse sans courbature, et on peut avoir des courbatures sans progresser.

## L’ampoule
L’**ampoule** naît d’un **frottement** répété : la peau se décolle et se remplit de liquide. Mieux vaut **ne pas la percer** : la peau protège la plaie des microbes. Si elle est grosse et gênante, on la perce avec une aiguille **désinfectée** en gardant la peau, puis on protège avec un pansement adapté.

Pour l’éviter : chaussures à la bonne taille, chaussettes sans couture qui plissent.

## L’entorse de cheville
Un faux mouvement, la cheville tourne : c’est une **entorse**, un étirement ou une déchirure des ligaments. Le réflexe est le **GREC** :
| Lettre | Geste |
| G | Glace (enveloppée, jamais directement sur la peau) |
| R | Repos |
| E | Élévation de la jambe |
| C | Compression avec une bande |

> En cas de douleur, on arrête : continuer à jouer sur une articulation blessée transforme un bobo en blessure longue.

## Quand voir un médecin ?
Consulte si :
- tu ne peux pas poser le pied ou marcher ;
- l’articulation est gonflée, déformée ou instable ;
- la douleur te réveille la nuit ;
- la douleur ne diminue pas après quelques jours.

## Le kit de l’élève sportif
Dans ton sac, glisse :
- une **gourde** pleine ;
- des **pansements** adaptés, de type anti-ampoules ;
- une paire de **chaussettes** de rechange ;
- une serviette ou un petit vêtement chaud pour après l’effort.

Ce petit kit évite bien des bobos.

## À retenir
- Crampe : étirer doucement, masser, boire. Courbature : micro-lésions, 24 à 48 h plus tard, pas une preuve de progrès.
- Ampoule : ne pas la percer, protéger. Entorse : GREC.
- On consulte si on ne peut pas poser le pied, si l’articulation est déformée ou si la douleur réveille la nuit.`,
    },
    questions: [
      ['Qu’est-ce qu’une crampe ?', ['Une déchirure d’un os', 'Une brûlure de la peau', 'Une infection', 'Une contraction brutale et involontaire du muscle'], 3, 'La crampe est une contraction du muscle, soudaine, douloureuse et que l’on ne contrôle pas.'],
      ['Que faire en cas de crampe ?', ['Appliquer de la glace sans arrêt', 'Étirer doucement le muscle, le masser, boire', 'Forcer d’un coup', 'Continuer à courir'], 1, 'L’étirement doux relâche le muscle ; masser et boire aident aussi.'],
      ['Quand apparaissent les courbatures après un effort inhabituel ?', ['Une semaine après', 'Jamais', '24 à 48 heures plus tard', 'Immédiatement pendant l’effort'], 2, 'Elles apparaissent un à deux jours après l’effort et durent 2 à 3 jours.'],
      ['Les courbatures prouvent qu’on a bien progressé.', ['Vrai', 'Faux'], 1, 'Elles signalent des micro-lésions, pas un progrès : on progresse aussi sans courbature.'],
      ['Que provoque une ampoule ?', ['Un frottement répété sur la peau', 'Un coup de soleil', 'Un manque d’eau', 'Une crampe'], 0, 'Le frottement décolle la peau, qui se remplit de liquide.'],
      ['Faut-il percer systématiquement une ampoule ?', ['Oui, avec la main sale', 'Non, la peau protège la plaie', 'Oui, avec les doigts', 'Oui, avec un couteau'], 1, 'Percer expose la plaie aux microbes : on ne le fait que si l’ampoule est grosse et gênante, avec du matériel désinfecté.'],
      ['Que veut dire GREC pour une entorse ?', ['Geste, Rapidité, Effort, Course', 'Gel, Rouler, Étirer, Courir', 'Gants, Rampe, Eau, Chaleur', 'Glace, Repos, Élévation, Compression'], 3, 'Glace, repos, élévation et compression : le réflexe d’une entorse.'],
      ['Dans quel cas faut-il aller voir un médecin ?', ['Pour une soif légère', 'Pour une chaussette mouillée', 'Quand on ne peut pas poser le pied', 'Pour une petite courbature'], 2, 'Ne pas pouvoir poser le pied ou marcher indique une blessure sérieuse à faire examiner.'],
      ['Une douleur qui réveille la nuit est un signe qu’il faut consulter.', ['Vrai', 'Faux'], 0, 'Une douleur nocturne ou qui ne diminue pas mérite l’avis d’un médecin.'],
      ['Que mettre dans son sac de sport ?', ['Une gourde, des pansements et des chaussettes de rechange', 'Seulement une console', 'Uniquement des boissons sucrées', 'Rien du tout'], 0, 'Le petit kit de l’élève évite déshydratation et ampoules.'],
      ['La glace sur une entorse se pose…', ['directement sur la peau', 'pendant toute la nuit', 'seulement le lendemain', 'enveloppée dans un linge'], 3, 'La glace brûle la peau si on la pose directement : on l’enveloppe d’un linge.'],
    ],
  },
  // ---- Les légendes --------------------------------------------------------
  {
    titre: 'Les Jeux olympiques, d’Olympie à Paris 2024',
    axe: 'Les légendes',
    lecon: {
      titre: 'Une frise de presque 2 800 ans',
      cours: `Le 26 juillet 2024, des bateaux descendent la Seine devant des milliers de spectateurs : c’est la cérémonie d’ouverture des Jeux de Paris. Cette fête est l’héritière d’une course disputée il y a plus de 2 700 ans.

## L’Antiquité : Olympie, 776 av. J.-C.
Les premiers Jeux connus ont lieu en **776 avant J.-C.** à **Olympie**, en Grèce. Ils se tiennent **tous les 4 ans** en l’honneur de **Zeus**. Pendant les Jeux, une **trêve sacrée** suspend les guerres entre cités. La première épreuve est la **course du stade** (192 mètres), et le vainqueur reçoit une **couronne d’olivier**. Ils sont interdits en **393 après J.-C.**

## 1896 : les Jeux modernes
Le baron **Pierre de Coubertin** les fait renaître. En **1896**, à **Athènes**, ils accueillent **14 nations** et **241 athlètes**, uniquement des hommes. Les **anneaux** olympiques, créés en **1913**, représentent les cinq continents.

## Les symboles
- La **flamme** apparaît à Amsterdam en **1928** ; le **relais** de la flamme depuis Olympie commence à Berlin en **1936**.
- Les premiers **Jeux d’hiver** ont lieu à **Chamonix**, en France, en **1924**.

## Les Jeux paralympiques
Tout commence à **Stoke Mandeville**, en Angleterre, en **1948**, avec des athlètes en fauteuil roulant. Les premiers Jeux paralympiques officiels ont lieu à **Rome** en **1960**.

| Date | Événement |
| 776 av. J.-C. | premiers Jeux connus, à Olympie |
| 393 | Jeux interdits |
| 1896 | premiers Jeux modernes, à Athènes |
| 1924 | premiers Jeux d’hiver, à Chamonix |
| 1948 | Stoke Mandeville, naissance du mouvement paralympique |
| 1960 | premiers Jeux paralympiques, à Rome |
| 2024 | Jeux de Paris |

> Les Jeux sont une trêve : l’esprit olympique est de réunir les peuples, pas de les opposer.

## Paris 2024 en chiffres
Les Jeux se déroulent du **26 juillet au 11 août 2024**. La cérémonie d’ouverture a lieu **sur la Seine**, une première. Au programme : **32 sports**, **329 épreuves** et environ **10 500 athlètes**. Pour la première fois, il y a la **parité** entre hommes et femmes parmi les athlètes.

## Les héros français
Le nageur **Léon Marchand** remporte **4 titres**. La France termine **5e nation** au tableau des médailles avec **64 médailles**, dont **16 d’or**.

!> Retiens la logique : la Grèce antique a inventé les Jeux, Coubertin les a relancés, Paris les a accueillis trois fois : en 1900, 1924 et 2024.

## À retenir
- Olympie, 776 av. J.-C. : trêve sacrée, course du stade, couronne d’olivier.
- 1896 Athènes : Jeux modernes ; 1924 Chamonix : Jeux d’hiver ; 1960 Rome : premiers Jeux paralympiques.
- Paris 2024 : 32 sports, 329 épreuves, parité, la France 5e avec 16 titres.`,
    },
    questions: [
      ['Où ont lieu les premiers Jeux olympiques connus de l’Antiquité ?', ['À Athènes en 1896', 'À Olympie, en Grèce', 'À Rome', 'À Paris'], 1, 'Les premiers Jeux connus se déroulent à Olympie en 776 av. J.-C.'],
      ['En l’honneur de quel dieu avaient lieu les Jeux de l’Antiquité ?', ['Poséidon', 'Hercule', 'Zeus', 'Apollon'], 2, 'Les Jeux d’Olympie honoraient Zeus, le roi des dieux.'],
      ['Que recevait le vainqueur d’une épreuve dans l’Antiquité ?', ['Une couronne d’olivier', 'Une médaille d’or', 'Un bouclier en acier', 'Un sac de pièces'], 0, 'Le vainqueur était couronné d’olivier.'],
      ['Qui a relancé les Jeux olympiques modernes ?', ['Jules Verne', 'Pierre de Coubertin', 'Zeus', 'Napoléon'], 1, 'Pierre de Coubertin a fait renaître les Jeux, dont la première édition moderne est celle d’Athènes en 1896.'],
      ['En quelle année a lieu la première édition des Jeux modernes ?', ['1900', '1924', '1948', '1896'], 3, 'En 1896, à Athènes, avec 14 nations et 241 athlètes.'],
      ['Les cinq anneaux olympiques représentent…', ['les cinq premiers sports', 'les cinq premiers vainqueurs', 'les cinq continents', 'les cinq sens'], 2, 'Créés en 1913, ils symbolisent les cinq continents unis.'],
      ['Où ont eu lieu les premiers Jeux d’hiver, en 1924 ?', ['À Chamonix, en France', 'À Athènes', 'À Berlin', 'À Oslo'], 0, 'Les premiers Jeux d’hiver se sont tenus à Chamonix en 1924.'],
      ['Le mouvement paralympique est né à Stoke Mandeville, en Angleterre, en 1948.', ['Vrai', 'Faux'], 0, 'Des athlètes en fauteuil roulant s’y sont affrontés ; les premiers Jeux paralympiques ont eu lieu à Rome en 1960.'],
      ['Paris 2024 a eu lieu du 26 juillet au 11 août 2024.', ['Vrai', 'Faux'], 0, 'C’est la date exacte des Jeux de Paris 2024.'],
      ['Combien de titres olympiques Léon Marchand a-t-il gagnés à Paris 2024 ?', ['1', '7', '10', '4'], 3, 'Léon Marchand a remporté quatre titres olympiques.'],
      ['Aux Jeux de 1896, des femmes participaient déjà aux épreuves.', ['Vrai', 'Faux'], 1, 'En 1896, seuls des hommes étaient engagés ; la parité n’a été atteinte qu’à Paris 2024.'],
      ['Quelle place la France a-t-elle occupée au tableau des médailles de Paris 2024 ?', ['20e', '5e', '1re', '10e'], 1, 'La France a terminé 5e, avec 64 médailles dont 16 d’or.'],
    ],
  },
  {
    titre: 'Dix champions français à connaître',
    axe: 'Les légendes',
    lecon: {
      titre: 'Un hall of fame à la française',
      cours: `La France a produit des champions dans presque tous les sports. Voici dix noms que tout le monde devrait pouvoir citer, chacun avec son exploit le plus marquant.

## Les dix portraits
**1. Marie-José Pérec (athlétisme).** Elle gagne le 400 m aux Jeux de **Barcelone en 1992**, puis le 200 m et le 400 m à **Atlanta en 1996**. Une foulée immense et trois titres olympiques.

**2. Teddy Riner (judo).** Dans la catégorie des plus de 100 kg, il est champion olympique individuel en **2012, 2016 et 2024**, avec deux ors par équipes en plus. Onze fois champion du monde : le géant du tatami.

**3. Léon Marchand (natation).** À **Paris 2024**, il remporte quatre ors : le 200 m brasse, le 200 m papillon, le 200 m 4 nages et le 400 m 4 nages. La piscine de La Défense a explosé de joie.

**4. Zinédine Zidane (football).** En finale de la **Coupe du monde 1998**, il marque deux buts de la tête contre le Brésil. La France gagne **3-0** au Stade de France.

**5. Kylian Mbappé (football).** Champion du monde en **2018 à 19 ans**, il marque **4 buts** pendant la compétition. En **2022**, il signe un triplé en finale.

**6. Tony Parker (basket).** Il gagne **4 titres NBA** avec San Antonio : **2003, 2005, 2007 et 2014**. Un Français sur le toit du basket mondial.

**7. Martin Fourcade (biathlon).** Entre **2014 et 2018**, il glane **5 titres olympiques** : courir vite, puis tirer juste au carabine.

**8. Laure Manaudou (natation).** Elle remporte le 400 m nage libre aux Jeux d’**Athènes en 2004**, à 17 ans.

**9. Jean-Claude Killy (ski alpin).** Aux Jeux de **Grenoble en 1968**, il gagne les **3 épreuves** de ski alpin, une légende nationale.

**10. Clarisse Agbegnenou (judo).** Elle devient championne olympique en **−63 kg** à **Tokyo, en 2021**, après une longue série de titres mondiaux.

| Champion | Discipline | Exploit |
| Pérec | athlétisme | or 1992 et 1996 |
| Riner | judo | or 2012, 2016, 2024 |
| Marchand | natation | 4 ors à Paris 2024 |
| Zidane | football | 2 buts en finale 1998 |
| Mbappé | football | champion du monde 2018 |
| Parker | basket | 4 titres NBA |
| Fourcade | biathlon | 5 ors olympiques |
| Manaudou | natation | or 400 m libre 2004 |
| Killy | ski | 3 ors à Grenoble 1968 |
| Agbegnenou | judo | or −63 kg à Tokyo 2021 |

> Un champion, ce n’est pas seulement un talent : c’est des années de travail, des défaites, et un jour où tout se joue.

## Ce qu’ils ont en commun
Aucun n’est devenu champion en un jour. Tous ont commencé jeunes, dans un club près de chez eux, avec un entraîneur et de la régularité.

## À retenir
- Pérec, Riner, Marchand, Zidane, Mbappé, Parker, Fourcade, Manaudou, Killy, Agbegnenou.
- Chaque nom, un exploit daté : ors olympiques, Coupe du monde, titres NBA.
- Derrière un champion, il y a toujours des années de travail.`,
    },
    questions: [
      ['Quelle athlète française a gagné le 400 m aux Jeux de 1992 et de 1996 ?', ['Clarisse Agbegnenou', 'Pauline Ferrand-Prévot', 'Marie-José Pérec', 'Laure Manaudou'], 2, 'Marie-José Pérec a remporté le 400 m à Barcelone et à Atlanta (où elle a aussi gagné le 200 m).'],
      ['Dans quelle discipline Teddy Riner est-il champion ?', ['Le judo', 'Le tennis', 'La natation', 'Le biathlon'], 0, 'Teddy Riner est un judoka des plus de 100 kg.'],
      ['Combien de titres olympiques individuels a remporté Léon Marchand à Paris 2024 ?', ['1', '4', '2', '6'], 1, 'Il a gagné le 200 m brasse, le 200 m papillon, le 200 m 4 nages et le 400 m 4 nages.'],
      ['Qui a marqué deux buts de la tête en finale de la Coupe du monde 1998 ?', ['Kylian Mbappé', 'Tony Parker', 'Teddy Riner', 'Zinédine Zidane'], 3, 'Zidane a marqué deux buts de la tête contre le Brésil (3-0).'],
      ['Quel est le score de la finale de la Coupe du monde 1998 entre la France et le Brésil ?', ['2-1', '4-2', '3-0', '1-0'], 2, 'La France a battu le Brésil 3-0 au Stade de France.'],
      ['Kylian Mbappé est devenu champion du monde en 2018 à 19 ans.', ['Vrai', 'Faux'], 0, 'Il avait 19 ans et a marqué 4 buts dans la compétition.'],
      ['Avec quelle équipe Tony Parker a-t-il gagné ses titres NBA ?', ['San Antonio', 'Boston', 'Chicago', 'Miami'], 0, 'Tony Parker a gagné 4 titres NBA avec San Antonio (2003, 2005, 2007 et 2014).'],
      ['Dans quel sport Martin Fourcade a-t-il gagné ses titres olympiques ?', ['Le judo', 'La natation', 'L’athlétisme', 'Le biathlon'], 3, 'Le biathlon combine ski de fond et tir à la carabine.'],
      ['Laure Manaudou a gagné le 400 m nage libre aux Jeux d’Athènes en 2004.', ['Vrai', 'Faux'], 0, 'Elle avait 17 ans quand elle a remporté ce titre olympique.'],
      ['Combien d’épreuves de ski alpin Jean-Claude Killy a-t-il gagnées à Grenoble en 1968 ?', ['0', '3', '1', '5'], 1, 'Jean-Claude Killy a gagné les trois épreuves de ski alpin, devenant une légende nationale.'],
      ['En quelle catégorie Clarisse Agbegnenou est-elle devenue championne olympique à Tokyo ?', ['−48 kg', '−90 kg', '−63 kg', '+100 kg'], 2, 'Clarisse Agbegnenou a été championne olympique des moins de 63 kg à Tokyo en 2021.'],
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

  titreMigration: 'SPORT 6e · 5e — « DÉCOUVRIR », LA CULTURE SPORTIVE (10 fiches)',

  motif: `LA MATIÈRE SPORT EST REFAITE EN CULTURE SPORTIVE (14/10/2026, Lucas :
« on va s'écarter du programme : l'histoire du sport, notamment de la France,
les fondamentaux — hypertrophie, force, endurance, récupération, anti-blessure »).
Les 8 fiches du programme officiel (champs d'apprentissage, rôles sociaux…),
identiques de la 6e à la 3e, n'intéressaient personne : rien à réviser pour un
écrit, et la langue de l'institution. Cadrage : docs/CADRAGE-SPORT.md.
Ce bloc installe 10 fiches sur 6e et 5e, et retire les
anciens chapitres de Sport de ce(s) niveau(x) (cascade : leçons, quiz,
questions, cahier, contrôles, déblocages).`,

  menage: [
    {
      raison: `Les anciens chapitres de Sport (6e, 5e) partent — TOUS ceux dont
l'identifiant n'est pas dans ce bloc. Le ménage tourne AVANT les insertions ;
un rejeu ne touche donc jamais aux 10 fiches neuves (ni aux progrès des élèves
dessus). Les niveaux sont bornés à 6e et 5e : chaque bloc de la nouvelle
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
