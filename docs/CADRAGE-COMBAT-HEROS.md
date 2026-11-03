# Cadrage — le COMBAT DES HÉROS : le duel PvP et le duel contre le boss

02/11/2026. Lucas : « maintenant que l'on a les perso, on doit mettre en place
le PvP plus proprement et le système de duel avec le boss », « la version la
plus développée possible, digne des plus gros studios », « image
d'affrontement, animation d'attaque, les cœurs, la perte des cœurs », « crée
autant d'images des perso de dos », « on s'inspire de Pokémon le plus possible
car simple et clair, mais en version 2026 et boostée », « mettre dans la
boutique les animations d'attaque supérieures, encore plus banger », « liste
tout ce qu'il faut d'abord, ce qui pourrait améliorer l'expérience que je n'ai
pas pensé », « obligation de qualité, d'animation visuelle ».

Ce document prend la suite de `docs/CADRAGE-DUEL-POKEMON.md` (13/10, les
paliers de la peau) et de la démo du Templier (`/dev/duel-heros`, 29/10) :
depuis, l'élève INCARNE l'un des quinze élèves-héros (`lib/heros/eleves.ts`) et
les dix-sept gardiens sont devenus les profs du lore (`lib/bosses.ts`).

---

## 1. La règle d'or : UNE arène, trois combats

| Combat | Qui est en face | Ce qui frappe | Ce qui se perd |
|---|---|---|---|
| **Duel classé** (course à 1 000) | un rival rejoué ou un robot, avec SON héros | chaque bonne réponse, des deux côtés | des cœurs, des deux côtés |
| **Défi d'un ami** (558) | l'ami, son héros, sa trace | idem | idem |
| **Combat de gardien** (la Traque) | le prof-boss, en pied | ma bonne réponse le frappe ; **mon erreur, c'est LUI qui attaque** | ses cœurs / mes trois cœurs |

Un seul écran (`ArenaCombat`), une seule grammaire du coup, un seul jeu de
sprites par personnage. Le serveur juge comme aujourd'hui : la course par
`/api/duel/fin`, la Traque par `claimTraqueVictory`. **La peau ne décide
d'aucun point** : une attaque achetée FÊTE un coup, elle ne le rend jamais plus
fort (zéro « payer pour gagner », c'est aussi la règle des stores pour des
mineurs).

## 2. Les cœurs — ce qui remplace la barre de PV

Pokémon a une barre ; Lucas veut des **cœurs**, et il a raison : un cœur se
compte d'un coup d'œil, se perd avec un drame, et c'est le langage de Duolingo
que nos élèves connaissent déjà.

- **Duel classé** : 5 cœurs chacun. 1 cœur = 200 points de la course, cassé en
  QUARTS (50 points) — une bonne réponse (80 à 170 points) arrache un demi à
  trois quarts de cœur, la dorée un cœur et demi. Le chiffre des dégâts vole
  quand même : le cœur dit « combien », le chiffre dit « exactement ».
- **Gardien** : moi, 3 cœurs entiers (le `BOSS_LIVES` actuel) ; lui, ses PV
  du rang en cœurs (Rang I : 5 cœurs, II : 7, III : 9 ; un coup = un demi-cœur).
- **La perte d'un cœur**, en 600 ms : le cœur blanchit (flash), se FEND, ses
  deux moitiés tombent en tournant et s'effacent, trois éclats partent ; la
  rangée tremble. Un quart perdu : le quart se vide en rouge sombre, sans
  casse.
- **Le dernier cœur** BAT (battement 1 s), le bord de l'écran rougit en
  vignette, le téléphone vibre au rythme ; le son du cœur monte. Pas de rouge
  plein écran : ça doit tendre, pas agresser.
- **Lisibilité** : chaque rangée porte aussi son nombre (« 3½ ») pour les
  daltoniens et le lecteur d'écran (`role="meter"`).

## 3. Les personnages — ce qu'il faut dessiner

### 3.1 Les quinze élèves-héros — SIX poses chacun (90 images)

Dessinés par Nano Banana Pro (Higgsfield), la scène du héros en référence,
**sur fond vert pur** puis détourés (`scripts/heros-detourer.mjs`), en deux
planches de trois poses pour que le personnage reste le même :

| Planche | Pose | Sert à |
|---|---|---|
| **Dos** | repos, trois-quarts DOS, regard vers le haut à droite | MOI, en bas à gauche, tout le combat |
| | attaque, de dos, le geste fétiche lancé | ma bonne réponse |
| | touché, de dos, recule, grimace de profil | sa bonne réponse / l'attaque du boss |
| **Face** | repos, trois-quarts FACE | l'ADVERSAIRE (un rival joue mon héros de face) |
| | attaque, de face | sa bonne réponse |
| | K.O., assis par terre, étoiles autour de la tête — **drôle, jamais violent** | le perdant |

### 3.2 L'attaque fétiche de chaque héros (15 VFX)

Un PROJECTILE et un IMPACT dessinés à part (fond noir pur → mode `screen`, ou
fond vert → détourage), animés en CSS (transform, opacité) — la méthode des
nuages de l'arène :

| Héros | Attaque | Projectile → impact |
|---|---|---|
| Le Mage de feu | Boule de feu runique | sphère de feu à runes → explosion de flammes |
| L'Appel de l'orage | Foudre captive | éclair en zigzag → étoile électrique |
| Le Forgeron de runes | Marteau-rune | rune d'or qui tourne → enclume de lumière |
| Le Rôdeur des neiges | Flèche de givre | flèche bleue → éclat de glace |
| Le Guetteur de minuit | Dagues de lune | trois dagues violettes → croissant |
| Le Harponneur | Harpon des glaces | harpon → geyser gelé |
| Le Veilleur du pont | Pierre sculptée | rocher gravé → poussière |
| Le Caïd du fond | Avion de papier | avion de copie → pluie de feuilles |
| Le Coureur des bois | La charge du chien | le chien qui bondit → étoiles de pattes |
| L'Ombre des toits | Grappin acrobate | grappin → coup de pied étoilé |
| La Cavalière des crêtes | Ruade du poney | fer à cheval → onde de choc |
| La Vigie des cimes | Bourrasque de cerf-volant | rafale de vent → tourbillon |
| La Barde de la cour | Accord sonique | notes de musique → onde dorée |
| La Rêveuse du saule | Tempête de pages | pages qui tournoient → explosion de papier |
| La Fusée | Sprint éclair | traînée de vitesse → impact de choc |

### 3.3 Les dix-sept profs-boss — TROIS poses de plus (51 images)

Le portrait en pied existe (`*-pied.webp`, c'est la pose de repos de face).
Il manque : **attaque** (son arme du lore : la règle de Mme Guerre, le dico de
Grammatork, la fiole de Plasma…), **touché** (recul, lunettes de travers),
**vaincu** (assis, sonné, drôle). Plus une attaque VFX par boss (17).

### 3.4 Les décors

- **Duel classé** : la lice de l'académie (`academie-arene.webp`, existe).
- **Gardien** : sa TANIÈRE — la scène du prof (`*-scene.webp`, existe),
  floutée et assombrie derrière lui : on va le chercher chez lui.

## 4. La grammaire d'un coup (Pokémon, en 2026)

1. **La réponse est juste** → la carte de question se contracte (80 ms).
2. Mon héros passe en pose d'**attaque** (fente avant, 120 ms).
3. Le **projectile** part de sa main vers l'adversaire (220 ms, courbe).
4. **Impact** : éclat de l'attaque, l'adversaire passe en pose **touché**
   (recul + flash blanc), l'écran a un micro-arrêt (« hit-stop », 60 ms — le
   secret des jeux de combat), le **chiffre** des dégâts jaillit.
5. Ses **cœurs** perdent leur quart, ou se brisent.
6. Retour au repos, question suivante (le tout ≤ 650 ms : la course ne
   ralentit jamais).

- **Coup critique** (la question dorée) : ralenti 400 ms, bandeau du cri
  (« Pour la connaissance ! »), « COUP CRITIQUE ! » façon « C'est super
  efficace ! », l'écran tremble.
- **Le SUPER** (idée Brawl Stars) : 3 bonnes réponses de suite chargent la
  jauge du super ; la suivante déclenche l'attaque fétiche en GRAND (le
  projectile ×1,6, un zoom de caméra). Mise en scène seulement : les points
  sont ceux de la course.
- **Mauvaise réponse** : en duel, rien ne part (« Raté ! » sur ma carte) ; face
  au gardien, **il attaque** : son geste, son projectile, mon cœur se brise.
- **L'esquive** : quand le rival rejoué se trompe, mon héros fait un pas de
  côté, « Esquivé ! » — l'adversaire existe même quand il rate.

## 5. Les écrans autour du combat

- **La recherche** (l'ascenseur de Lucas) : la lice, mon héros seul qui
  s'échauffe — et PENDANT ce temps tout se précharge (§ 8).
- **Le VS** : les deux héros entrent (glissent depuis les bords), plaques de
  nom qui claquent, « VS » qui éclate, emblème de matière. 2,5 s,
  interruptible d'un tap.
- **Face au gardien, la boîte de dialogue Pokémon** : « Grammatork veut se
  battre ! », écrite lettre à lettre en bas d'écran, puis sa réplique
  (`boss.intro`). À la fin : « Grammatork est vaincu ! » puis `boss.defeat`.
- **Le K.O.** : le dernier coup au ralenti, flash, le perdant en pose K.O.,
  « K.O. ! » qui tombe avec rebond, confettis.
- **La victoire** : la cinématique du héros (les tableaux du Templier) ; la
  fin de partie actuelle (`FinDuelHeros`) avec XP et trophées qui montent.
- **La défaite** : Marcel console, pas de rouge, « Revanche » en or.

## 6. La boutique : les attaques légendaires

Un rayon « **Attaques légendaires** » dans `/tresor`, et un aperçu jouable de
chaque achat :

- **Attaque légendaire** (par héros, 150 gemmes) : son super devient une
  courte CINÉMATIQUE plein écran (vidéo Google Flow, 1,5 s, muette, jouée au
  super et au coup de grâce) — le héros en gros plan, l'attaque qui traverse
  l'écran. C'est le « Super Art » de Street Fighter.
- **Couleur d'attaque** (60 gemmes) : la même attaque teinte or, givre ou
  ombre (même sprite, autre teinte : zéro image de plus).
- **Coup de grâce** (100 gemmes) : l'animation du K.O. adverse (feux
  d'artifice, pluie de gemmes, statue de pierre…).
- **Cinématique de victoire** (existe : « La Charge céleste », 120 gemmes).
- **Réactions** (40 gemmes le lot) : quatre émotes du héros en combat (§ 7).

Règles : cosmétique seulement ; masqué derrière `estAppPlay()` s'il y a des
euros (il n'y en a pas : tout est en gemmes) ; aperçu avant achat ;
« Équiper » dans la page du joueur.

## 7. Ce que Lucas n'a pas demandé et qui fera la différence

1. **Le préchargement pendant l'attente** (recherche, VS) — rien ne se charge
   pendant le combat. C'est l'ascenseur.
2. **Le super à charger** (Brawl Stars) — une raison de viser la série.
3. **La boîte de dialogue Pokémon** pour le gardien — la madeleine des parents
   et l'humour des profs.
4. **L'esquive** quand l'autre rate.
5. **Le hit-stop et le chiffre qui jaillit** — ce qui fait « jeu », pas
   « quiz ».
6. **Les réactions** en combat (Clash Royale) : quatre émotes PRÉDÉFINIES du
   héros (« Bien joué ! », « Oups », « Encore ! », « GG ») — jamais de texte
   libre entre mineurs.
7. **La carte de victoire partageable** (image générée, lien de parrainage).
8. **Le bestiaire** : la galerie des gardiens vaincus, leur rang, leur
   réplique de défaite — la collection (le Pokédex).
9. **Le combat d'entraînement contre Marcel** au premier duel : apprendre les
   cœurs et le super sans perdre de trophée.
10. **Le son** : un son par attaque, le cœur qui bat, le cri du gardien —
    `lib/duel/audio.ts`.
11. **La vibration** : courte au coup reçu, longue au K.O., battement au
    dernier cœur.
12. **Mouvement réduit** : pas de secousse ni de ralenti, les cœurs se vident
    sans se briser, les sprites changent de pose sans voler.
13. **La maîtrise du héros** : un compteur de victoires par héros, un badge à
    10 / 50 / 100 (la fidélité au personnage).
14. **L'abandon propre** : quitter en plein combat = défaite, annoncée avant.

## 8. Les temps morts — le préchargement « ascenseur » (Réviser d'abord)

Ce qui existe : `PrechargeurOnglets` (onglets un par un), l'intention sur les
portes (`onIntention` → `prechargerCahier`), six dossiers préchargés.

Ce qui manque, par ordre de rendement :

1. **Le combat** : pendant la recherche et le VS, précharger les 6 poses des
   deux personnages, les VFX, les sons (`Image.decode()`) — 2,5 s suffisent.
2. **Réviser au repos** : quand l'élève LIT un cours (il y passe des minutes),
   précharger en tâche de fond le quiz du chapitre et la fiche suivante
   (`requestIdleCallback`) — c'est le moment le plus long et le plus calme de
   l'app.
3. **La fin d'un quiz** : pendant le panneau des récompenses (la vague
   d'éclairs dure 1,5 s), précharger le chapitre suivant.
4. **L'ouverture d'un dossier** : pendant que la bannière s'anime, précharger
   les images des portes Jeux et Boss (billets, scène du gardien).
5. **Le doigt qui hésite** : `pointerdown` (et non `click`) sur les cartes de
   chapitre, les billets de jeu — 100 à 200 ms gagnées par tap.
6. **Jamais sur données mobiles économes** (`navigator.connection.saveData`)
   et jamais plus d'une requête de fond à la fois.

## 9. L'inspiration — ce qu'on prend à qui

| Jeu | Ce qu'on prend |
|---|---|
| Pokémon (Écarlate/Violet, Champions) | la mise en scène : moi de dos, lui de face, la boîte de dialogue, « super efficace », le K.O. |
| Prodigy Math | la preuve qu'un combat Pokémon fait réviser des millions d'élèves — et ce qu'il ne faut pas faire (la paye pour gagner) |
| Brawl Stars | le super à charger, la revanche immédiate, la fin de partie qui compte |
| Clash Royale | les émotes, les trophées, la boutique d'objets cosmétiques |
| Street Fighter 6 | le Super Art en cinématique, le hit-stop |
| Duolingo | les cœurs, la vague de récompenses |
| Fortnite | la boutique 100 % cosmétique, l'aperçu avant achat |
| Hearthstone | le « juice » : chaque coup a son poids, son son, sa secousse |

## 10. Le budget et les garde-fous

- **Images** : 90 poses de héros + 51 poses de boss + 32 VFX ≈ 60 planches
  Higgsfield (Nano Banana Pro, ~2 à 4 crédits) ; les cinématiques légendaires
  dans Google Flow.
- **Poids** : une pose ≈ 50-70 Ko en WebP 720 px ; un combat charge 12 poses +
  4 VFX ≈ 1 Mo, préchargé à la recherche.
- **Transform et opacité seulement**, valeurs littérales (la règle de l'arène
  vivante) ; mesuré au protocole CDP.
- **Un modèle avant la série** : le Mage de feu et Grammatork faits jusqu'au
  bout, jugés sur l'écran réel, puis les quatorze et les seize autres.
- **Le serveur ne change pas** pour la peau. Les achats de la boutique
  demandent une migration (catalogue des cosmétiques possédés et équipés).

## 11. L'ordre

1. Les cœurs et l'arène commune (`ArenaCombat`), sur la démo.
2. Le modèle : Mage de feu (6 poses + son attaque) et Grammatork (3 poses +
   son attaque), dans le duel ET dans le combat de gardien.
3. La série : 14 héros, 16 boss, leurs attaques.
4. Le duel classé réel branché sur l'arène (héros du profil).
5. La Traque branchée sur l'arène (boîte de dialogue, cœurs).
6. La boutique des attaques légendaires (migration) et les cinématiques Flow.
7. Le préchargement des temps morts dans Réviser.
