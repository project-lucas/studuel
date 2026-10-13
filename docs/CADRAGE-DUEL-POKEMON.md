# Cadrage — le duel façon Pokémon, de la peau à la version « gros budget »

13/10/2026. Lucas : « les duels devraient s'inspirer des duels sur Pokémon…
use Higgsfield pour que les duels soient banger (avec l'apparition de
l'avatar, dégât si bonne réponse…) », puis « quel serait la version encore
plus banger, animée, de duel scolaire — les personnages entiers — le maximum
du maximum, la version gros budget ».

Ce document dit ce que « le maximum » veut dire concrètement, palier par
palier, avec ce que chaque palier coûte (jours, crédits Higgsfield, poids
d'assets) et ce qu'il risque. Les maquettes de la peau sont dans
`assets-sources/maquettes/duel-pokemon.html` (A · B · C · D) ; les trois
images-concept de la version gros budget dans
`assets-sources/maquettes/duel-pokemon/concept-*.png`.

## 0. Ce qui ne change pas, quel que soit le palier

**Le moteur de course reste le moteur.** Deux compteurs qui montent à 1 000,
90 s, une dorée ×2, le rival rejoué sur sa ligne de temps, `courseId`, les
relances, et **le serveur seul juge** (`lib/duel/fin-course-server.ts`,
`duel_course_enregistrer`). Les trophées, les bots du banc, les replays, le
duel en direct, le défi d'un ami : rien ne bouge. Tout ce qui suit est une
PRÉSENTATION de la même partie — sauf le palier 4 (l'invocation), qui est la
seule règle nouvelle et le seul endroit où le serveur change.

Le vocabulaire de la peau, commun à tous les paliers :

| La course dit | La peau montre |
|---|---|
| mes points montent | **ses PV descendent** (PV rival = 1 000 − mes points) |
| ses points montent | mes PV descendent |
| une bonne réponse | une **attaque** : le dégât vole, il encaisse |
| la question dorée | un **coup critique** (×2, ralenti, flash) |
| un compteur à 1 000 | l'autre est **K.O.** |
| le combo | la traînée du projectile, puis l'écran qui tremble |

## 1. Les paliers

### Palier 1 — la peau (les maquettes A/B/C/D) · 2 à 3 jours · 0 crédit

Plateaux, cadres de PV en plaque blanche à bague lavande, dégât qui vole,
éclat d'impact, K.O. et bilan. Tout en `transform` et `opacity`
(framer-motion pour les entrées, CSS pour les boucles). Un seul asset
nouveau : l'éclat d'impact (un sprite, ou un `conic-gradient` comme sur la
maquette). Les avatars restent les portraits actuels (bustes), sur leur
plateau.

C'est le palier qui rend déjà le duel « Pokémon ». Les suivants le rendent
« banger ».

### Palier 2 — les personnages ENTIERS : le corps commun · 3 à 4 jours · ~15 crédits

**Le problème** : un élève a 13 portraits par défaut, 32 personnages
historiques, un avatar dessiné par Marcel (Nano Banana), ou un robot
DiceBear. On ne dessinera jamais un corps par élève.

**La solution : la poupée de papier.** Quatre CORPS chibi génériques (deux
silhouettes × deux tenues — le hoodie violet, la veste crème — dans le style
des portraits v2 : grosse tête, cerne épais, aplats), dessinés une fois par
Nano Banana : vus de trois-quarts DOS pour moi (en bas à gauche), de
trois-quarts FACE pour lui (en haut à droite). La TÊTE est le portrait de
l'élève, recadré sur le visage (`PORTRAIT_FACE_CROP` existe déjà), posée sur
le corps avec son cerne. Un avatar dessiné par Marcel, un personnage
historique, un robot : même corps, sa tête dessus. Trois couches par
personnage — ombre, corps, tête — et la tête suit le corps avec un léger
retard (ressort) : c'est ce qui fait « vivant » pour trois lignes de CSS.

**Les états du corps**, tous en transform/opacité :

| État | Quand | Mouvement |
|---|---|---|
| repos | toujours | respiration : 2 px de haut en bas, 2 s |
| attaque | ma bonne réponse | fente avant 120 ms, retour 220 ms |
| touché | sa bonne réponse | recul 16 px, flash blanc (opacité d'un voile), tremblement 300 ms |
| K.O. | sa barre vide | bascule 80°, chute hors plateau, ombre qui s'étire |
| victoire | ma barre vide chez lui | saut, bras levé (sprite « victoire » du corps) |

**Option vidéo** : les quatre corps animés par FLUX 3 Video (la pose en
première ET dernière image, la méthode de la flamme de série), détourés image
par image en WebP animé 128 px : 4 corps × 3 états = 12 fichiers × ~150 Ko =
1,8 Mo à précharger sur l'écran VS. À réserver à « attaque » et « K.O. » —
le repos et le touché n'ont pas besoin de vidéo.

### Palier 3 — les attaques PAR MATIÈRE (les VFX) · 2 jours · ~60 crédits

Chaque matière a sa signature, un sprite animé par matière :

| Matière | L'attaque |
|---|---|
| Maths | une pluie de chiffres et de signes qui se referme en cercle |
| Français | une plume qui fend l'air, une tache d'encre à l'impact |
| SVT | l'hélice d'ADN qui file, ou une liane qui claque |
| Physique-Chimie | la fiole qui explose en plasma |
| Histoire-Géo | un boulet de canon de carte, une frise qui claque |
| Anglais | la cloche de Big Ben, onde de choc |
| Espagnol | la charge du toro |

Fabrication : une vidéo d'une seconde sur fond magenta (FLUX 3 Video ou
Kling, 10 à 20 crédits), détourage chroma-key (la méthode des nuages de
l'arène), 24 images en WebP animé 256 px (~200 Ko). Plus deux sprites
communs : l'éclat d'impact, et le coup critique (le même, doré, plus grand).

**La grammaire du coup** : la bonne réponse → la carte de la question se
contracte et PART vers l'adversaire (150 ms, c'est le projectile) → le VFX de
la matière éclate au point d'impact → le nombre vole → sa barre de PV
tremble en rouge puis descend par paliers. Mauvaise réponse : rien ne part,
mon personnage encaisse un petit recul. Quand SA ligne de temps marque (elle
est déjà rejouée), c'est son VFX qui arrive sur moi. Combo ×3 : traînée dorée
derrière le projectile ; ×5 : l'écran tremble (transform sur la scène) ; la
dorée : ralenti 400 ms, flash, « COUP CRITIQUE ».

### Palier 4 — l'invocation du gardien · 2 jours · 10 à 100 crédits · UNE migration

La seule règle nouvelle. Si l'élève a battu le gardien de la matière (rang I
ou plus dans la Traque), il dispose d'**une invocation par duel** : au
cinquième combo, le gardien SURGIT derrière lui (les 17 portraits en pied
existent déjà, `public/images/boss/*-pied.webp`) et frappe : **+50 % sur
cette attaque**. Le rival rejoué peut invoquer aussi, si sa trace le dit —
l'honnêteté de la course tient.

Côté serveur : un pas « invocation » dans la trace, vérifié contre
`boss_gauges.victories` ; `duel_course_enregistrer` recalcule le score avec
ce bonus. C'est le seul palier qui touche `lib/duel/fin-course-server.ts` et
demande une migration (miroir pur dans `lib/duel`).

Côté image : une entrée commune (le gardien monte du sol, flash, deux yeux
qui s'allument) en CSS sur le portrait en pied ; la frappe = UN VFX commun
teinté par matière (10 crédits), ou un VFX par gardien (17 vidéos, ~100
crédits) — à décider sur un modèle.

### Palier 5 — les cinématiques : entrée, K.O., bilan · 2 jours · 0 crédit

- **L'entrée** : la cour vivante tourne déjà (nuages, fontaine, lanternes).
  Les deux personnages ENTRENT en marchant (translateX + balancement), les
  plaques de nom claquent, « VS » éclate (échelle 3 → 1, onde), l'emblème de
  la matière tourne au-dessus, « Partez ! ». 2,5 s, interruptible d'un tap.
- **Le K.O.** : le dernier coup au ralenti, flash blanc, le perdant bascule
  et tombe hors de son plateau, « K.O. ! » cerné tombe du haut avec rebond,
  confettis dorés, les trophées se comptent (le compteur de l'arène existe),
  Revanche en or.
- **La défaite** : Marcel entre et console (une de ses réactions existantes),
  pas de rouge, pas de moquerie — la règle des bots vaut pour tout l'écran.

### Palier 6 — le son et le toucher · 1 jour · 0 crédit

`lib/duel/audio.ts` (`duelSfx`) prend : impact, critique, K.O., invocation,
une foule qui monte avec le combo ; `navigator.vibrate` court sur « touché »
et long sur K.O. Le « cuivre » de la course reste la fanfare d'entrée.

### Palier 7 — le social du combat · 2 à 3 jours · 0 crédit

- **La carte de victoire** : une image PNG générée par une route (satori) —
  les deux avatars, « K.O. en 71 s », les trophées — partageable d'un tap
  (`navigator.share`), avec le lien de parrainage dessous.
- **Le duel en direct** (déjà) : les attaques arrivent en temps réel, les
  deux téléphones montrent le même combat.
- **Le spectateur** (plus tard) : un ami regarde le duel d'un autre.

## 2. Le budget

| Palier | Jours | Crédits | Poids ajouté | Risque |
|---|---|---|---|---|
| 1 · la peau | 2-3 | 0 | ~0 | faible : du CSS sur l'écran actuel |
| 2 · les corps | 3-4 | ~15 | 0,2 Mo (poupée) à 2 Mo (vidéo) | le raccord tête/corps sur 50 têtes différentes |
| 3 · les VFX | 2 | ~60 | ~1,8 Mo (7 + 2 sprites) | le détourage des vidéos ; le poids |
| 4 · l'invocation | 2 | 10-100 | 0 (portraits existants) | la règle : serveur + migration |
| 5 · cinématiques | 2 | 0 | 0 | la durée (2,5 s max, interruptible) |
| 6 · son, toucher | 1 | 0 | ~0,2 Mo | — |
| 7 · social | 2-3 | 0 | 0 | la génération d'image côté serveur |
| **Total** | **~2 semaines** | **~100-200** | **~3-4 Mo**, préchargés à l'écran VS, en cache (service worker) | |

## 3. Les garde-fous

- **Transform et opacité seulement** — un VFX est un sprite qui se déplace et
  se fond, jamais un `filter` animé (la règle de l'arène vivante). Mesurer
  avec le protocole CDP (`mesurer-cout-animations`) : ≤ 4 points de fil
  principal pendant la course, les réponses doivent rester instantanées.
- **Tout est préchargé pendant l'écran VS** (2,5 s suffisent pour 3 Mo en
  4G) ; rien ne se charge en cours de combat.
- **Mouvement réduit** : pas de tremblement d'écran, VFX posés sur leur
  dernière image, dégât qui apparaît sans voler.
- **Un modèle avant la série** : UN corps (le hoodie violet, de dos), UNE
  attaque (la SVT), l'éclat d'impact — validés sur l'écran réel — puis la
  série. Les 17 frappes de gardien ne se commandent qu'après le VFX commun.
- **Le serveur ne change qu'au palier 4**, et seulement pour l'invocation.

## 4. L'ordre que je propose

1 (la peau) → 2 (un corps, puis quatre) → 3 (la SVT, puis six) → 5
(cinématiques) → 6 (son) → 4 (invocation) → 7 (social). Les paliers 1, 2 et
3 font déjà « le duel Pokémon » ; 4 et 7 en font un jeu qu'on montre à ses
amis.
