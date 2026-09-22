# Cadrage — la refonte des modes de jeu

> Écrit le 22/09/2026 à partir d'un inventaire complet des 13 jeux de salon et
> des 7 modes d'arène (code lu, constantes relevées) et d'une lecture de ce que
> font les plateformes qui marchent auprès des collégiens et lycéens : Blooket,
> Gimkit, 99math, Times Tables Rock Stars, Kahoot, Quizizz, Quizlet, Duolingo,
> Mathador, Calculatice, Sutom, Projet Voltaire — et des études récentes sur
> compétition, coopération et anxiété. Sources en fin de document.
>
> La demande de Lucas : garder le chrono et la compétition, être plus original,
> une refonte complète est acceptée, et le calcul mental doit apprendre à
> calculer plus vite.

## 0. Le constat en une phrase

**Nos treize jeux sont dix fois le même jeu.** Dix sur treize sont un QCM à
quatre options construit par le même patron (`shuffleWith(rng, [bonne, …3
leurres])`) sur une liste de 8 à 81 entrées ; onze sur treize servent la même
banque aux cinq paliers, seul le tempo change. Trois seulement ont un geste
propre (ranger une frise, ranger une phrase, toucher un organe). Les sept modes
d'arène ne partagent pas le socle des jeux et réécrivent chacun leur chrono.
La variété est dans les noms et les couleurs, pas dans ce que fait le pouce.

Ce que les meilleurs font différemment tient en cinq mots : **un geste, un
enjeu, quelqu'un en face, quelque chose à collectionner, un rituel**. Et ils
séparent le contenu (les questions) de la mécanique (le mode) — chez nous les
deux sont soudés, d'où un catalogue qui grossit sans que rien ne change.

## 1. Ce qui plaît, et pourquoi

| Plateforme | Ce qui marche | La leçon pour Studuel |
|---|---|---|
| **Blooket** (27 modes) | UN jeu de questions, 27 façons d'y jouer : voler l'or des autres (Gold Quest), pirater (Crypto Hack), pêcher des poissons de valeur variable (Fishing Frenzy), défendre une tour, élimination (Battle Royale). Les « blooks » à collectionner font revenir sur le long terme. | Découpler le contenu de la mécanique. Un mode est un VERBE + un RISQUE + une RÉCOMPENSE, pas une matière. La collection retient. |
| **Gimkit** | Les bonnes réponses rapportent de l'argent qu'on dépense en améliorations et pouvoirs : de la STRATÉGIE, pas seulement de la vitesse. Modes sociaux (Trust No One, façon Among Us). Rotation saisonnière des modes. | Des choix pendant la partie (miser, s'équiper, protéger) ; un catalogue qui tourne au lieu de grossir. |
| **99math** | Des courses d'arithmétique en direct, classe contre classe, en moins d'une minute de mise en route. | La course en direct sur un contenu simple est la mécanique la plus forte du marché. |
| **Times Tables Rock Stars** | Le MÊME exercice sous six cadres : Jamming (sans chrono), Garage (entraînement), Studio (chrono → une « vitesse rock » = moyenne des 10 dernières), Soundcheck (25 questions × 6 s), Arena (la classe en direct), Festival (le monde, 1 minute). | Un exercice, trois cadres : sans chrono pour apprendre, chrono pour se mesurer à soi, direct pour se mesurer aux autres. La cote personnelle (moyenne glissante) vaut mieux qu'un record isolé. |
| **Kahoot** | Le nouveau mode Précision : même temps pour tous, les points ne récompensent que la justesse. | Vitesse et précision doivent pouvoir se jouer séparément. |
| **Quizizz** | Le rythme au choix de l'élève ; les études montrent que beaucoup d'élèves préfèrent progresser sans classement. | Un mode « pour moi » à côté de l'arène, pas à la place. |
| **Duolingo** (Match Madness) | Relier des paires, 9 manches, la mise monte, puis un « Extrême » optionnel. Le mode le plus joué de l'app parce qu'il est simple. | « Relier » est un geste à part entière, et la mise qui monte donne une forme à la session. |
| **Mathador** | Le compte est bon à l'envers ; Flash (le plus rapide) contre Expert (les opérations valent des points selon leur difficulté). | Construire un résultat, pas seulement le reconnaître ; récompenser la MÉTHODE. |
| **Calculatice** | Des jeux réglables en vitesse pour installer le répertoire par répétition. | Le calcul mental est un répertoire qui s'installe ; ce qu'on rate doit revenir. |
| **Sutom** | Un mot par jour pour tout le monde, six essais, une grille à partager ; adopté dans des collèges. | Le rituel commun est un moteur de retour quotidien et de conversation. |
| **Projet Voltaire** | Des mises en situation (repérer la faute dans une vraie phrase) plutôt que des QCM, avec ancrage mémoriel. | L'orthographe se joue dans une phrase, pas dans une liste de quatre mots. |
| **Recherche** (revues 2024-2026) | La compétition dope la motivation à court terme puis s'use ; la coopération et la compétition contre soi-même tiennent ; la pression du chrono angoisse une partie des élèves. | Garder le chrono et le classement, mais toujours offrir la voie sans chrono et la voie coopérative. |

## 2. Les principes de la refonte

1. **Un mode = un geste.** Taper, glisser, relier, ranger, viser, construire.
   Jamais « choisir parmi quatre » comme geste principal : reconnaître n'est
   pas savoir, et quatre options se devinent par élimination.
2. **Le contenu est une cartouche.** Une banque (les capitales, les faux amis,
   les formes conjuguées, les symboles) se joue dans plusieurs moteurs. Un
   moteur nouveau sert toutes les matières le jour où il sort.
3. **Trois cadres pour chaque exercice** : le **Dojo** (sans chrono, la méthode
   à chaque erreur), le **Studio** (chrono, une COTE personnelle = moyenne des
   dix dernières parties), l'**Arène** (les autres : fantômes, direct, école).
4. **Quelqu'un en face, ou quelque chose à gagner.** Une partie solo court contre
   le fantôme d'un ami ou d'un élève du même niveau (les traces existent déjà
   pour la course) ; sinon elle remplit une collection.
5. **Un rituel par jour**, le même pour tous, partageable.
6. **Précision et vitesse, séparées.** Les étoiles récompensent la précision (déjà
   le cas : 60 / 80 / 95 %), la cote récompense la vitesse ; un mode Précision
   donne le même temps à tous.
7. **Des choix pendant la partie.** Une petite économie de partie (ce qu'on
   gagne dans la manche s'y dépense : bouclier d'une erreur, double mise sur
   la prochaine, révéler une lettre), jamais de gemmes perdues.
8. **On apprend en jouant.** Chaque erreur montre la méthode. C'est fait pour le
   calcul mental (§ 4) ; c'est la règle pour tout ce qui suit.

## 3. La proposition : six moteurs, un rituel, une arène

### Les six moteurs

| Moteur | Geste | Ce qu'on y joue (cartouches) | Remplace |
|---|---|---|---|
| **Frappe** | taper la réponse (pavé numérique ou lettres) | calcul mental, terminaisons de conjugaison, un mot d'orthographe, un symbole chimique, une date | Calcul mental (QCM), Conjugaison éclair, Chasse aux éléments |
| **Tri** | glisser à gauche / à droite (deux bacs), ou trois bacs | vrai/faux, faux amis, mammifère/reptile/…, bonne unité, accord ou pas, ce siècle-ci ou l'autre | Falsos amigos, Classe-moi ça, La bonne unité, Chasse à la faute |
| **Relie** | relier des paires (façon Match Madness, 9 manches, mise qui monte) | mot ↔ traduction, symbole ↔ élément, date ↔ événement, capitale ↔ pays, forme ↔ temps, grandeur ↔ unité | Traduction flash, Traducción flash, Capitales |
| **Range** | ranger dans l'ordre (existant) | frise, phrase, étapes d'une méthode, nombres par taille, priorités d'un calcul | Frise folle, Phrase en vrac (gardés) |
| **Vise** | toucher au bon endroit sur un schéma, une carte, une droite graduée, un tableau | anatomie (gardé), **la carte** (« Pointe la carte », promise et jamais construite : capitales, fleuves, régions), la droite graduée (place 0,75), le tableau périodique, le verbe dans la phrase | Anatomie express (gardé) |
| **Construis** | assembler des tuiles pour atteindre une cible | le compte est bon inversé (Mathador : un nombre cible, cinq nombres, les quatre opérations ; Flash ou Expert), un mot à partir de syllabes, un verbe = radical + terminaison, une équation | nouveau |

Six gestes différents, chacun reconnaissable en une seconde. Les treize jeux
actuels deviennent des cartouches de ces moteurs : rien n'est perdu, tout se
joue de plus de façons. Le catalogue affiché ne grossit pas : **une matière = ses
cartouches, jouables dans les moteurs qui leur vont** (« Anglais : Relie, Tri,
Frappe »), et le mode du jour choisit un moteur, pas un jeu.

### Le rituel : le Défi du jour

Une grille par jour, la même pour tout le monde, un essai :
- **Maths** : le nombre du jour (Mathador : cible et cinq nombres) ;
- **Français** : le mot du jour (Sutom : six essais, première lettre donnée, mots
  du programme) ;
- **Histoire-Géo** : la date du jour (placer trois événements) ;
- **Langues** : les cinq paires du jour.

Résultat partageable en grille (sans dévoiler la réponse), classement de l'école
du jour, série de jours de défi. C'est le levier de retour quotidien le moins
cher du marché, et il crée la conversation en classe.

### L'arène

- **La course classée** reste le cœur (cf. `docs/CADRAGE-PVP.md`).
- **Le Festival** : une minute, cinq fantômes de vrais élèves (les traces de
  `duel_replays`), un moteur tiré au sort — TTRS Festival avec ce qu'on a déjà.
- **La Coop** remonte du tiroir « tous les modes » : c'est la voie de ceux que la
  compétition angoisse, et la recherche dit qu'elle tient dans la durée.
- Blitz, Contre-la-montre, Survie deviennent des **cadres** du Studio (le
  chrono, le temps qui fond, la mort subite) applicables à n'importe quel
  moteur — plus des modes à part avec leur propre code.

### Les trois cadres de chaque moteur

| Cadre | Chrono | Ce qu'on gagne | Pour qui |
|---|---|---|---|
| Dojo | aucun ; la méthode à chaque erreur | rien, sinon les étoiles de précision | apprendre, ceux que le chrono bloque |
| Studio | oui ; la cote = moyenne des 10 dernières | étoiles + gemmes des paliers (existant) | se mesurer à soi |
| Arène | oui, contre quelqu'un | trophées, classement d'école | se mesurer aux autres |

## 4. Le calcul mental, en particulier

Ce qui est **fait aujourd'hui** (22/09/2026) :
- **Chaque opération porte son astuce** (`lib/jeux/calcul-astuces.ts`, pur,
  testé sur ~900 opérations pour n'être jamais faux) : ×5 c'est ×10 puis la
  moitié, ×9 c'est ×10 moins une fois, 47 + 29 c'est 47 + 30 − 1, 7 × 8 passe par
  5 × 8, 52 − 37 se compte en avant, 75 % c'est tout moins un quart… trente-deux
  méthodes, celles du programme (compléments à 10, doubles et moitiés, point
  d'appui 5, distributivité, passage par la dizaine). L'astuce s'affiche sous la
  correction, avec les nombres de l'opération jouée ; après une erreur, la pause
  s'allonge pour la lire (2,2 s au lieu de 0,75), sans coûter de chrono.
- **Le dojo des astuces** sur la carte du jeu : les trente-deux méthodes par
  famille, avec un exemple calculé par le même code que la partie.

Ce qui vient ensuite, dans l'ordre :
1. **Frappe** : taper le résultat sur un pavé, au lieu de le reconnaître parmi
   quatre. Un QCM de calcul se résout à l'élimination (parité, ordre de
   grandeur) — il mesure la lecture, pas le calcul.
2. **Le répertoire** (Calculatice) : les faits ratés reviennent dans les parties
   suivantes jusqu'à être sus (la file « À revoir » existe pour les quiz ; la
   brancher sur les faits de table).
3. **Le compte est bon** (moteur Construis, Mathador) avec le double barème
   Flash / Expert.
4. **La cote Studio** (moyenne des 10 dernières) à la place du record isolé, et
   le mode Précision.
5. **Le nombre du jour** (rituel).

## 5. Ce que ça implique techniquement

- **Le socle est prêt** : `lib/jeux/formats.ts` (mécaniques), `run.ts` (barème
  commun), `paliers.ts` (étoiles par précision), `palier-gemmes` (gemmes une
  fois) et les trois tables (`GameTable`, `OrderTable`, `AnatomyTable`)
  deviennent les six moteurs. Les banques (`pools.ts`) deviennent des
  cartouches typées par le geste qu'elles autorisent.
- **Sans migration** : les six moteurs, les cadres Dojo/Studio, la cote (locale
  d'abord, comme les records), l'astuce partout, la Coop remontée.
- **Une migration** : le Défi du jour (une table `defis_jour` : jour, élève,
  résultat, graine) et son classement d'école.
- **Réutilisé** : les traces de la course (`duel_replays`) pour le Festival ;
  `mode_bests` (352) pour la cote si on la veut en base ; `apply_game_trophies`
  pour les trophées par matière × moteur.
- **La graduation des banques** est le gros travail de contenu : aujourd'hui
  seuls Calcul mental et Conjugaison servent une banque différente par palier.
  Chaque cartouche doit dire ce qu'elle sert à chaque palier (`BANK_BRIEFS`),
  sinon la carte des paliers ment.

## 6. Un ordre en trois lots

**Lot 1 — sans migration.** Astuces de calcul mental (fait). Moteur **Frappe**
(pavé) pour Calcul mental et Conjugaison. Moteur **Relie** pour les langues,
les capitales et les éléments (il remplace trois QCM d'un coup). Moteur **Tri**
pour SVT, faux amis, unités, orthographe. Cadre **Dojo** et cote **Studio**. La
Coop remontée. Mode **Précision**.

**Lot 2 — une migration.** Le **Défi du jour** avec son classement d'école et
sa grille partageable. Les cartouches graduées pour toutes les matières.

**Lot 3.** Le **Festival** (cinq fantômes, une minute). Le moteur **Construis**
(compte est bon, radical + terminaison). **Vise** étendu à la carte et à la
droite graduée. La collection (ce qui s'ouvre quand on gagne : blasons, robes
de moteur), et la petite économie de partie.

## 7. Ce qu'on ne fait pas

- **Pas de mode de plus dans la feuille** : six verbes, un rituel, une arène.
  Un nouveau contenu est une cartouche, pas un billet (« trop de modes de jeu »,
  Lucas, 19/09/2026).
- **Pas d'XP en jouant** (décision 348), pas de gemmes perdues : la mise de
  partie porte sur des points de manche.
- **Pas de chrono obligatoire** : tout ce qui se joue au chrono se joue aussi au
  Dojo.
- **Pas de texte libre entre élèves** ; la grille partagée du Défi du jour est
  générée, pas écrite.

## 8. Ce qu'on mesurera

| Métrique | Cible |
|---|---|
| Part des parties jouées hors QCM (Frappe, Tri, Relie, Range, Vise, Construis) | > 70 % après le lot 1 |
| Parties par élève actif et par jour | +50 % |
| Part des élèves jouant le Défi du jour | 40 % des actifs |
| Erreurs répétées sur un même fait de calcul (répertoire) | −50 % en trois semaines |
| Abandons en cours de partie | < 10 % |

## Sources

- Blooket, modes et fonctionnement : [help.blooket.com](https://help.blooket.com/hc/en-us/sections/31587463192215-Game-Modes), [blooketiq.com](https://blooketiq.com/blooket-game-modes/), [blooketcalc.us](https://blooketcalc.us/game-modes/)
- Gimkit, modes et économie : [gimkitinfo.com](https://gimkitinfo.com/gimkit-game-modes/), [plisio.net](https://plisio.net/education/what-is-gimkit), [gimkit.wiki](https://gimkit.wiki/wiki/Fishtopia)
- Blooket contre Gimkit, ce qui motive : [jotform.com](https://www.jotform.com/blog/blooket-vs-gimkit/), [differentiatedteaching.com](https://www.differentiatedteaching.com/blooket-vs-gimkit/)
- 99math : [softwarecurio.com](https://www.softwarecurio.com/blog/99math-review-2025-free-multiplayer-math-game-for-classrooms-setup-guide-safety-check/), [makerstations.io](https://www.makerstations.io/99math/)
- Times Tables Rock Stars, les modes : [intercom.help](https://intercom.help/times-tables-rock-stars/en/articles/1616983-game-types-modes-ttrs-schools), [internetmatters.org](https://www.internetmatters.org/advice/apps-and-platforms/skills-building/times-tables-rock-stars/)
- Kahoot, mode Précision et nouveaux modes : [support.kahoot.com](https://support.kahoot.com/hc/en-us/articles/32601683697053-Here-s-What-s-New-in-Kahoot), [support.kahoot.com — modes](https://support.kahoot.com/hc/en-us/sections/22972100732435-Game-modes)
- Quizizz et Kahoot, préférences des élèves : [ieeexplore.ieee.org](https://ieeexplore.ieee.org/document/9573176/), [triviamaker.com](https://triviamaker.com/kahoot-vs-quizziz/)
- Quizlet, Blast et Match : [quizlet.com](https://quizlet.com/features/blast-single-player), [help.quizlet.com](https://help.quizlet.com/hc/en-us/articles/360030841732-Studying-on-Quizlet)
- Duolingo, Match Madness et défis chronométrés : [duoplanet.com](https://duoplanet.com/duolingo-match-madness/), [duoplanet.com — timed](https://duoplanet.com/duolingo-timed-challenges/) ; Duolingo Math : [techlearning.com](https://www.techlearning.com/how-to/what-is-duolingo-math-and-how-can-it-be-used-to-teach-tips-and-tricks)
- Prodigy : [prodigygame.com](https://www.prodigygame.com/main-en)
- Mathador et Calculatice : [mathador.fr](https://www.mathador.fr/), [blog.mathador.fr](https://blog.mathador.fr/le-jeu-un-outil-pour-se-fabriquer-son-repertoire-mental-calculatice-trio-mathador/7706/), [guide pédagogique](https://www.mathador.fr/pdf-V4/guide-pedagogique-boite-mathador-2019.pdf)
- Sutom : [sutom.fr](https://sutom.fr/en), [bullesetjeunesse.fr](https://www.bullesetjeunesse.fr/2026/03/22/sutom-nocle-fr-jouer-et-reussir-au-mot-du-jour-en-ligne/)
- Projet Voltaire : [projet-voltaire.fr](https://www.projet-voltaire.fr/), [sherpas.com](https://sherpas.com/blog/quest-ce-que-le-projet-voltaire/)
- Techniques de calcul mental (programme du collège) : [maths-college.fr](https://www.maths-college.fr/cours-mathematiques-3eme/astuces-calcul-mental-college.html), [cours-et-fiches.com](https://cours-et-fiches.com/calcul-mental/), [dugastcollege.wordpress.com](https://dugastcollege.wordpress.com/pages-par-themes/calcul/techniques-de-calcul-mental/)
- Recherche sur la gamification, la compétition et la coopération : [tandfonline.com (2025)](https://www.tandfonline.com/doi/full/10.1080/0020739X.2025.2555333), [ncbi.nlm.nih.gov](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10448467/), [sciencedirect.com (2026)](https://www.sciencedirect.com/science/article/pii/S0001691826009765), [springer.com (2026)](https://link.springer.com/article/10.1007/s10758-026-09997-0)
