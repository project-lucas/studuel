# Le Prof — doctrine

> Approfondissement de `COACH.md` après le brief du 31/07/2026.
> Ce document renverse la hiérarchie posée dans le cadrage initial.

---

## 1. Le renversement

Le cadrage de ce matin faisait du Coach un **assistant IA avec un plan du jour**.
Le brief inverse : le Prof est **le repère et la clarté**, l'aide aux devoirs
vient après.

Ce n'est pas une nuance de ton, ça change ce qu'on construit :

| | Assistant IA | Le Prof (retenu) |
|---|---|---|
| Sa valeur | répondre à des questions | **dire comment on travaille cette matière** |
| Son actif | un bon modèle | **une méthode par matière, écrite, opposable** |
| Sa limite | le quota | le quota **n'est plus le sujet** |
| Ce qui coûte | chaque interaction | presque rien |
| Ce qui différencie | rien (tout le monde a le même modèle) | **tout** |

Un élève de 3e ne manque pas de réponses — il en a des millions dans sa poche.
Il manque de quelqu'un qui lui dise : *« en histoire tu ne révises pas comme en
maths, et voilà exactement ce que tu fais ce soir »*. C'est ça qu'on vend, et
c'est ça que ChatGPT ne fera jamais parce qu'il ne sait pas ce qu'on lui demande.

**Conséquence immédiate sur la maquette** : le bloc « Demander au coach » doit
descendre. L'ordre devient ① le point du jour ② la séance ③ **la méthode de la
matière** ④ le contrôle de chapitre ⑤ demander. L'IA passe cinquième — à sa
place.

---

## 2. Le nom

Le personnage existe déjà : les visuels de réaction du quiz montrent **un prof à
lunettes qui perd ses cheveux quand l'élève enchaîne les erreurs**. C'est lui le
Prof — pas la flamme, qui reste le compagnon de la série (`lib/compagnon.ts`).

Critères : deux ou trois syllabes, **aucun accent** (on le tape, on le cherche),
prononçable par un 6e sans honte pour un Terminale, et **aucune collision avec
les 16 boss** (Atlas, Glitch, Socratus, Astro, Sylvarok, Kaiser Fang, Fiscus,
Coach Turbo) — ce qui écarte tout ce qui sonne mythologique ou savant.

| Nom | Ce qu'il porte | Risque |
|---|---|---|
| **Marcel** ✅ | prof à l'ancienne, chaleureux, drôle sans être bébé ; « Marcel te dit : » fonctionne à l'écrit | connote un peu « vieux » — c'est précisément le gag |
| Célestin | plus tendre, très « instituteur » | 3 syllabes, un peu précieux pour un Terminale |
| Hector | court, noble | sonne comme un boss → collision |
| Nino | neutre, jeune, international | ne raconte rien, oubliable |

**Recommandation : Marcel.** Le nom fait la moitié du gag de calvitie, il vieillit
bien avec l'élève, et il donne une voix immédiatement reconnaissable dans les
bulles (« Marcel a regardé ta semaine »).

---

## 3. Les quatre régimes d'apprentissage

**On ne révise pas l'histoire comme les maths.** C'est le cœur du produit. Chaque
matière du catalogue reçoit un **régime**, et le régime pilote tout : la séance
type, ce qu'on mesure, ce que l'élève produit, ce que Marcel dit.

### R1 — La PRATIQUE (le geste)
`maths` · `maths-expertes` · `physique-chimie` · `nsi` · `technologie` ·
`finances-personnelles` · `fiscalite`

> « Ici, seule la pratique compte. Relire un exercice corrigé ne t'apprend rien —
> c'est en le refaisant seul que ça rentre. »

- **Séance type** : 0 lecture. Exercice → correction → *le même type* refait à froid.
- **Signal de maîtrise** : % de réussite **à froid**, sur des exercices jamais vus, sous chrono.
- **Objet produit** : rien à rédiger. Le volume est l'objet.
- **Piège que Marcel doit nommer** : « j'ai compris » ≠ « je sais faire ». L'élève qui relit se croit prêt.

### R2 — La RESTITUTION structurée (la carte)
`histoire-geo` · `svt` · `ses` · `enseignement-scientifique` · `economie` ·
`figures-historiques` · `culture-generale`

> « Ici, ce n'est pas la quantité de travail qui paie, c'est l'ordre. Si tu ne
> peux pas me raconter le chapitre en 90 secondes sans tes notes, tu ne le sais
> pas. »

- **Séance type** : carte mentale/plan → restitution à vide → on ne rouvre le cours que sur les trous.
- **Signal de maîtrise** : capacité à restituer le plan **sans support** (déjà mesurable par les flashcards et les cartes mentales existantes).
- **Objet produit** : une carte par chapitre, refaite de mémoire.
- **Piège** : le surlignage. Trois heures de fluo, zéro rappel actif.

### R3 — L'ARGUMENTATION / L'EXPRESSION (la voix)
`francais` · `philosophie` · `hggsp` · `entrepreneuriat`

> « Ici, tu n'es pas noté sur ce que tu sais, mais sur la façon dont tu
> l'articules. On travaille l'intro et l'annonce de plan — c'est là que se joue
> la moitié de la note, et c'est ce que personne ne répète. »

- **Séance type** : **l'échelle de l'oral** (§4), plus des intros écrites en 10 minutes chrono.
- **Signal de maîtrise** : **le rituel accompli**, pas une note. On mesure « fait / pas fait », jamais une évaluation automatique de la pensée.
- **Objet produit** : des intros, des plans annoncés, des enregistrements.
- **Piège** : apprendre le cours par cœur en croyant que ça suffira.

### R4 — LA LANGUE (la fréquence)
`anglais` · `espagnol` · `allemand` · `latin` · `grec`

> « Ici, dix minutes tous les jours battent deux heures le dimanche. Et il faut
> produire, pas seulement reconnaître. »

- **Séance type** : micro-exposition quotidienne + rappel actif du vocabulaire + une phrase produite.
- **Signal de maîtrise** : **régularité** (jours d'exposition sur 14) avant le score.
- **Objet produit** : des phrases, à l'écrit puis à l'oral.
- **Piège** : le QCM de vocabulaire, où l'on reconnaît sans savoir produire.
- **Cas particulier** `latin`/`grec` : régime mixte R4 + R1 (la version est un geste, elle se pratique).

### Hors doctrine pour l'instant
`musique` · `sport` · `arts-plastiques` — la pratique y est physique et hors de
l'app. Marcel ne prétend pas les coacher ; il se tait plutôt que de dire une
bêtise.

### Ce que ça implique techniquement

Un module pur `lib/coach/regimes.ts` : `regimeOf(slug)`, et par régime un
**barème de séance** (quels blocs, dans quel ordre, quelle durée) et une
**banque de phrases**. Testable, sans base, **sans un seul token**. C'est
l'actif différenciant de l'app et il ne coûte rien à exploiter.

---

## 4. L'échelle de l'oral (R3) — quatre barreaux

L'intuition du brief, développée. Le bac de français, le grand oral, l'oral du
brevet se jouent là, et **aucune app ne le fait** parce que tout le monde cherche
à faire noter l'oral par une IA. On ne note pas : on **fait répéter**.

1. **Les cartes.** L'élève génère/télécharge ses fiches (le carnet et les
   flashcards existent déjà). Une carte = un texte, un axe, une problématique.
2. **Seul, à voix haute, chrono.** L'app lance un minuteur et affiche seulement
   la carte. Elle ne capte rien. Elle mesure la **durée tenue**.
3. **Enregistré.** L'élève s'enregistre et **se réécoute** avec trois cases :
   *intro claire ? plan annoncé ? transitions ?* L'auto-évaluation est l'exercice
   — pas un score rendu par la machine.
4. **Devant quelqu'un.** « Demander à un ami de m'écouter » → notification à un
   membre du clan (ou un parent) → il coche les trois mêmes critères.

Le barreau 4 est le meilleur du lot : **coût IA nul**, il branche le Prof sur
l'onglet Amis, il crée une raison d'inviter quelqu'un, et c'est exactement ce que
font les élèves qui réussissent leur oral. L'audio reste sur l'appareil par
défaut — pas de stockage serveur, pas de RGPD sur mineur, pas de facture.

---

## 5. Les contrôles de chapitre

Le brief pose la bonne question : à la volée, ou d'avance ? **D'avance**, à 90 %.

- **Contrôle de chapitre : pré-généré, 3 variantes A/B/C.** Le contrôle d'un
  chapitre du catalogue est le même pour tous les élèves de France. On le génère
  une fois par script admin, on le range, on le sert à l'infini. Trois variantes
  suffisent à empêcher l'apprentissage par cœur des questions et couvrent la
  reprise. **Coût fixe, marge intacte, disponible même hors quota.**
- **Contrôle personnalisé : à la volée, compté.** Tiré des erreurs de *cet*
  élève. Là seulement il faut un appel, donc un jeton (§6).

### Le produit, c'est le débrief — pas la note

Un « faux contrôle » qui rend un 12/20 n'apprend rien. Ce qui apprend, c'est :

> « Tu as perdu 5 points, et **pas** parce que tu ne connaissais pas le cours :
> 3 points sur des énoncés mal lus, 2 sur du calcul. Ton cours est su. Ta
> méthode de lecture, non. »

Donc chaque question porte une **typologie d'erreur** — `cours non su` /
`méthode` / `calcul` / `lecture de l'énoncé` / `temps` — renseignée à la
génération (donc gratuite à l'usage). C'est l'actif le plus précieux du chantier :
il alimente le débrief, le dashboard, et le plan de révision, sans jamais
rappeler un modèle.

---

## 6. Les cristaux — « pay to learn »

Le principe du brief est juste et défendable : **on paie pour apprendre plus,
jamais pour sauter l'apprentissage.** À écrire en dur dans la doctrine :

> **Aucun cristal n'achète une réponse. Les cristaux achètent du temps de Prof.**

Sans cette règle, on construit une machine à tricher payante, et on la vend à des
parents. Avec elle, la dépense est alignée sur l'apprentissage — et c'est
racontable aux parents comme aux stores.

### Le piège à ne pas déclencher

`lib/gems.ts` pose un invariant explicite et argumenté : les gemmes **n'ouvrent
pas** les quiz premium, et **ne s'achètent pas avec des pièces** — sinon le grind
cosmétique achète Studuel+. Or 30 gemmes = 1 chapitre déverrouillé à vie. Donc
**écu → cristal ouvre mécaniquement le contenu payant au farming**. C'est la
seule chose du brief qui casse quelque chose d'existant.

### Trois façons de garder la boucle sans le trou

| Option | Principe | Effet |
|---|---|---|
| **A — Le jeton de Prof** ✅ | Une 3e ressource, **consommable**, qui n'ouvre aucun contenu. S'obtient en écus (cher, plafonné/jour), en cristaux (bon taux), ou par l'abonnement (quota large) | Donne à Lucas sa conversion et sa boucle, ne touche à aucun invariant |
| B — Cristal marqué | Les cristaux issus d'une conversion sont marqués « coach uniquement » | Marche, mais deux cristaux qui ne valent pas pareil = incompréhensible pour l'élève |
| C — Refonte | Le cristal devient la monnaie du savoir, les chapitres passent à l'abonnement seul | Le plus lisible à terme, mais vide la récompense de parrainage |

**Recommandation : A.** L'écu (gagné en jouant) achète du temps de Prof à taux
dur ; le cristal (gagné en amenant des amis) en achète mieux ; l'abonnement en
donne assez pour ne jamais y penser. Les trois chemins mènent au même endroit, et
c'est ça, le cercle vertueux : **jouer finance apprendre, inviter finance
apprendre, payer finance apprendre.**

### Ce qu'il faut border

Un plafond **quotidien absolu**, quota + jetons confondus, décidé en SQL. Sinon
un élève (ou un script) qui a accumulé 10 000 écus se paie 10 000 appels dans la
nuit. Le jeton lève une limite d'usage, **jamais** la limite de coût.

---

## 7. Les autres talents de Marcel (la file de compétences)

Le brief voit juste : s'il y en a plusieurs et qu'ils sont bons, les gens
convertissent. Chaque talent doit être **jugé sur trois axes** avant d'être
construit : sa valeur pour l'élève, son coût marginal, et s'il peut être
mutualisé (donc gratuit).

| Talent | Régime | Coût | Verdict |
|---|---|---|---|
| Expliquer une erreur du catalogue | tous | **fixe** (L1) | gratuit, toujours |
| Contrôle de chapitre A/B/C | tous | **fixe** | gratuit, toujours |
| Le plan de la séance et la méthode | tous | **zéro** | gratuit, c'est le produit |
| Faire répéter un oral (échelle §4) | R3 | **zéro** | gratuit — et ça branche les Amis |
| Interroger sur MES fiches | tous | jeton | payant |
| Reformuler un chapitre autrement | R2 | jeton | payant |
| Corriger mon intro / mon plan | R3 | jeton | payant, **fort** — personne ne le fait |
| Photo d'exercice (Snap) | R1 | jeton ×3 | payant, hameçon d'acquisition |
| Contrôle tiré de MES erreurs | tous | jeton | payant |
| Thème/version commentée | R4 | jeton | payant |

Le tableau dit aussi ce qu'il ne faut **pas** faire : un talent cher qui
n'apporte rien de plus qu'un talent gratuit (générer un cours, résumer une
leçon déjà écrite) ne rentre pas dans la file.

---

## 8. Le dashboard — trois lecteurs, trois profondeurs

La couverture par matière a plu ; elle doit devenir un vrai espace. Mais un 6e
ne lit pas un graphe.

- **Le collégien : une phrase.** « En histoire tu sais restituer, en maths tu
  comprends mais tu ne t'entraînes pas assez. » Une phrase par matière, dérivée
  du régime + de la typologie d'erreurs. Zéro courbe.
- **Le lycéen : la trajectoire.** Couverture, régularité, typologie d'erreurs
  dominante, tendance sur 8 semaines. C'est lui qui pilote son bac — il a le
  droit à ses données.
- **Le parent : la preuve.** Régularité, progression, ce qui est fait — jamais
  le détail des notes. C'est le convertisseur.

La donnée qui manque n'est pas la quantité de travail (on l'a déjà), c'est
**pourquoi l'élève se trompe** — donc la typologie du §5. Elle se collecte à
coût nul et vaut plus que tout le reste.

---

## 9. Ce que ça change dans les lots

- **Lot 1** absorbe `lib/coach/regimes.ts` et le bloc « méthode de la matière ».
  Toujours **zéro IA**, et c'est maintenant le cœur, plus un préambule.
- **Lot 1 bis — LIVRÉ le 01/08/2026** : l'échelle de l'oral, barreaux 1 à 4
  (migration 222). Zéro IA, comme prévu. Le barreau 4 a été livré AVEC les
  autres et non repoussé au lot 3 : sans lui, l'échelle s'arrête à
  l'auto-évaluation, et c'est précisément l'auditeur qui fait la différence.
  · `lib/coach/oral.ts` (pur, testé) · vue « L'oral » dans Marcel ·
  `/marcel/oral` (chrono + enregistrement LOCAL) · carte « On te demande
  d'écouter » en tête de l'onglet Amis.
- **Lot 2** : contrôles A/B/C pré-générés + typologie d'erreurs (batch admin) —
  reste à coût fixe. Puis les jetons. **Toujours à faire.**
- **Lot 3** : le Snap, le dashboard lycéen, le rapport parent.

L'ordre est important : **tout ce qui différencie l'app est dans les lots sans
IA.** Si le fournisseur ferme demain, le Prof reste le meilleur de sa catégorie.

---

## 9 bis. État du chantier — 31/07/2026, soir

**Décisions prises** (Lucas) : le nom est **Marcel** ; la monnaie sera le **jeton
de Prof** (option A) ; les contrôles passent à la granularité **matière × niveau**
(le catalogue ne porte que 2-3 questions par chapitre — 521 questions pour ~257
chapitres, comptées dans les seeds) ; **Réviser et Marcel se partagent** le
« quoi faire ».

**Règle du partage, appliquée dans le code** : *Marcel dit pourquoi et comment,
Réviser est où on le fait.* Marcel ne recalcule rien — il reprend `pickMission`,
la source exacte de Réviser — et son bouton renvoie dans Réviser
(`missionHref`). En retour, le héros de Réviser porte un lien discret
« Pourquoi ce chapitre ? Demande à Marcel ». Une seule voix, deux endroits.

**Livré et vert** (1775 tests, `tsc` et `eslint` propres, zéro IA, zéro migration) :

| Fichier | Rôle |
|---|---|
| `lib/coach/regimes.ts` (+ test) | Les 4 régimes, les 26 matières, la séance minutée, les pièges. **La doctrine exécutable.** |
| `lib/coach/point-du-jour.ts` (+ test) | Les 5 tons (jour 1, contrôle, reprise, découverte, en avance), le diagnostic, les étiquettes |
| `lib/coach/marcel-server.ts` | L'assemblage serveur, calqué sur Réviser |
| `app/marcel/page.tsx` + `loading.tsx` | L'onglet, ses deux vues, son squelette |
| `components/marcel/*` | Segments (état dans l'URL), hero, séance, panneau Méthode |
| `lib/nav-tabs.ts`, `Navigation.tsx` | 6ᵉ onglet, entre Réviser et Défi |

**Vérifié** : `/marcel`, `/marcel?vue=methode`, `?matiere=francais` et une vue
inconnue répondent 200 ; l'état déconnecté s'affiche correctement. Le rendu
connecté demande la session du navigateur de Lucas.

### Deuxième passe — les quatre segments

| Fichier | Rôle |
|---|---|
| `lib/coach/entrainement.ts` (+ test) | Un contrôle par matière **au niveau de l'élève**. Seuil de 8 questions : en dessous, Marcel annonce qu'il manque de matière plutôt que de servir un sujet creux |
| `lib/coach/couverture.ts` (+ test) | Solide / entamé / **jamais ouvert** par matière, le constat et l'ordre d'urgence |
| `components/marcel/EntrainementPanel.tsx` | La liste des contrôles, matières incomplètes comprises et expliquées |
| `components/marcel/ProgresPanel.tsx` | La couverture, sa légende, et l'aveu de ce qui manque |

**Le contrôle est joué par l'examen blanc ciblé qui existait déjà**
(`/reviser/examen-blanc?subject=…`, disponible à toutes les classes) : même
chrono, même bilan par chapitre. Aucun second joueur écrit, aucune migration,
aucun appel IA.

**Ce que « Progrès » ne dit PAS, volontairement.** La typologie d'erreur
(méthode / calcul / lecture d'énoncé / cours non su) n'existe sur aucune
question du catalogue. L'écran affiche donc la couverture — ce qu'il lit
réellement — et se termine par : *« Je sais te dire où tu en es. Pour te dire
pourquoi tu te trompes, il me faut encore analyser tes erreurs. »* Dire ce qu'on
ne sait pas encore vaut mieux que de le laisser deviner.

### Troisième passe — « Demander à Marcel » et l'économie du jeton

| Fichier | Rôle |
|---|---|
| `supabase/215_marcel_jetons.sql` | **À EXÉCUTER À LA MAIN.** Compteur quotidien, solde de jetons, `coach_ask_allowed`, `coach_buy_tokens` |
| `lib/coach/jetons.ts` (+ test) | Miroir applicatif : quotas, plafond absolu, prix du pack, messages |
| `app/marcel/actions.ts` | L'appel au modèle, derrière la porte SQL |
| `components/marcel/DemanderMarcel.tsx` | Intentions, champ borné, réponse, mur à deux sorties |
| `lib/sante.ts` + `_ASSOCIE/sonde-base.mjs` | La 215 est déclarée au catalogue de santé |

**Les deux plafonds, à ne pas confondre** — c'est tout le garde-fou :

- le **quota quotidien** (3 gratuit / 30 abonné) est une limite d'**usage**, que
  le jeton lève ;
- le **plafond absolu** (50/jour, jetons compris) est une limite de **coût**,
  que rien ne lève. Sans lui, un élève assis sur un gros solde se paierait des
  milliers d'appels dans la nuit.

**Fail closed, contrairement à la 198.** Si la migration n'est pas exécutée, la
RPC est absente et l'action **refuse** au lieu de laisser passer. La 198 avait
choisi l'inverse pour ne pas couper une fonction existante ; ici la fonction est
neuve, personne ne perd rien, et le trou ne peut donc jamais s'ouvrir.

**Ce que Marcel ne fait jamais** : donner la réponse toute faite. La consigne
système lui impose un indice, puis la première étape, puis la main rendue — et
elle porte la méthode du régime de la matière, gratuitement (la phrase est
écrite d'avance dans `regimes.ts`).

**Fait le 01/08/2026 — l'échelle de l'oral (§4), les quatre barreaux.**
Migration 222. Ce qu'il faut retenir de l'implémentation :

- **aucun audio ne quitte l'appareil.** Le barreau 3 enregistre via
  `MediaRecorder`, lit depuis une `URL.createObjectURL`, et il n'existe aucun
  chemin, dans le code, entre ce Blob et le réseau. La base ne stocke qu'une
  DURÉE et trois booléens. Pas de voix de mineur sur nos serveurs : pas de RGPD
  à porter, pas de stockage à payer, rien à fuiter ;
- **le barreau 4 vérifie l'amitié EN BASE** (`request_oral_listen`, SECURITY
  DEFINER) : on ne peut pas faire sonner un inconnu, même en appelant la RPC à
  la clé anon. Anti-spam : une demande en attente par binôme, 20 par jour ;
- **les noms d'amis passent par RPC, jamais par jointure.** `profiles` est en
  RLS « soi uniquement » : une jointure aurait rendu la liste d'amis vide et
  chaque demande anonyme, *sans lever la moindre erreur*. `oral_friends` et
  `oral_listen_inbox` rendent le **prénom seul**, comme les RPC sociales 159/160 ;
- **Marcel ne note toujours pas.** Il compte le temps tenu et rend la grille.
  Les trois critères de l'auto-évaluation sont exactement ceux que coche l'ami :
  l'élève apprend à se juger avec la grille d'un auditeur.

**Reste à faire** : la typologie d'erreur (migration + remplissage du
catalogue) — c'est le seul chantier qui débloque la moitié de « Progrès » ; le
compteur « N cartes à revoir » du point du jour (branché quand un écran chargera
déjà la file du carnet) ; l'achat de jetons en **écus** (aujourd'hui seules les
gemmes convertissent) ; et une passe sur téléphone réel — 6 icônes sur 360 px
n'a jamais été vu ailleurs qu'en maquette.

## 10. Décisions à trancher

1. **Le nom** — Marcel (reco), Célestin, Nino ?
2. **La monnaie du Prof** — option A (jeton distinct, reco), B ou C ?
3. **L'oral** — l'audio du barreau 3 reste-t-il sur l'appareil (reco : oui, et
   on évite tout stockage de voix de mineur) ?
4. **Le dashboard** — on le construit dans le Prof, ou on l'ajoute à l'onglet
   Moi qui porte déjà la trajectoire et la capacité ?
