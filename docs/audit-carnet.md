# Audit — « Mon carnet » (l'espace de révision personnelle)

> Objectif visé : **battre Wooflash et Anki sur la personnalisation des révisions.**
> Audit du 24/08/2026. Aucun code écrit — c'est un état des lieux et un plan.

---

## 1. Ce que le carnet est aujourd'hui

**Données** (migration `186_carnet_cours.sql`, RLS owner-only)

| Table | Rôle | État |
|---|---|---|
| `carnet_courses` | un cours = un paquet | titre, description, icône, couleur |
| `carnet_chapters` | dossiers imbriqués (profondeur 3) | position, parent |
| `carnet_questions` | 5 types, contenu en JSONB | qcm, flashcard, vrai/faux, texte à trous, réponse libre |
| `carnet_review_sessions` | sessions | **écrite, jamais lue nulle part** |
| `carnet_review_attempts` | chaque réponse | seule mémoire de la révision |

**Logique** — `lib/carnet-cours.ts` (623 l.) : normalisation, arbre, correction.
`lib/carnet-revoir.ts` : le moteur « à revoir » — paliers fixes **1, 3, 7, 14, 35 jours**
selon la longueur de la suite de bonnes réponses.

**Écrans** — étagère `CoursesShelf`, écran de cours `CourseScreen` (onglets Contenu /
Résultats / Paramètres), arbre `CourseTree`, éditeur `QuestionEditor` (1 question = 1 page),
session `ReviewSession` + `QuestionPlayer`.

**IA** — `ai-actions.ts` : génère ≤ 15 questions depuis un thème de ≤ 500 caractères ;
génère un feedback. Quota journalier (migration 198).

**Ce qui marche déjà, et qu'il faut garder** : la sécurité (double contrôle de propriété
+ RLS), la correction faite côté serveur, les brouillons exclus des sessions, les couronnes
de maîtrise, la rangée « Brouillons » repliée, le `WorkTimer` qui compte le carnet comme du
vrai travail.

---

## 2. Le verdict en une page

| | Anki | Wooflash | **Studuel aujourd'hui** |
|---|---|---|---|
| Moteur de répétition espacée | ★★★★★ | ★★☆ | **★★☆ — échelle fixe, verdict binaire** |
| Vitesse de saisie | ★★★ | ★★★★★ | **★☆ — 1 question = 1 page, aucun import** |
| Personnalisation de la session | ★★★★ | ★★★ | **★☆ — « tout le cours » ou « un chapitre »** |
| Contenu riche (image, son, LaTeX) | ★★★★★ | ★★★★ | **☆ — texte seul** |
| Partage | ★★★★★ | ★★★★ | **☆ — privé, aucun partage** |
| Plaisir / motivation | ☆ | ★★ | **★★★★ (le reste de l'app) — mais le carnet n'y touche pas** |

**Diagnostic en une phrase :** le carnet a la bonne ossature et la bonne sécurité, mais il
est *plus faible qu'Anki là où Anki est fort* (le moteur), *plus lent que Wooflash là où
Wooflash est fort* (la saisie), et **il ne se sert pas de la seule chose qu'aucun des deux
n'a : le monde de jeu de Studuel.**

Le mot « personnalisation » est aujourd'hui tenu par **6 couleurs et 10 icônes** — c'est de
la décoration. Personnaliser ses révisions, c'est décider *quoi*, *comment*, *dans quel
sens*, *combien de temps* et *pour quelle échéance* on révise. Rien de cela n'existe.

---

## 3. Les constats, par gravité

### 🔴 C1 — Le moteur de révision est le point faible n° 1
`lib/carnet-revoir.ts`

- **Verdict binaire.** Une carte devinée de justesse et une carte sue par cœur avancent
  exactement pareil. Anki gagne sur ce seul point.
- **Pas d'« ease » par carte.** Tout le monde suit 1/3/7/14/35. Une carte facile revient
  trop souvent, une carte dure pas assez.
- **Une erreur = retour à la case départ.** Aucune rechute progressive : les cartes
  difficiles oscillent sans fin.
- **Aucune étape intra-journée.** Une carte vue aujourd'hui ne peut pas revenir aujourd'hui
  — or c'est là que la mémorisation se fait. Le premier palier est à J+1.
- **Aucun plafond quotidien.** 300 cartes dues = un mur. C'est le mode de décès n° 1 des
  utilisateurs d'Anki, et on l'a reproduit.
- **Pas de dispersion des échéances.** Tout ce qui est appris le même jour retombe le même
  jour : la charge arrive par vagues.
- **Pas de repérage des cartes-sangsues.** Une carte ratée 8 fois n'est jamais signalée
  comme « à reformuler ».
- **L'état de révision n'est pas stocké.** Il est recalculé à chaque affichage depuis
  jusqu'à **4 000 tentatives** (`app/reviser/page.tsx`, `cours/revoir/page.tsx`) — coût qui
  grandit indéfiniment, et impossible à requêter (« qu'est-ce qui est dû demain ? » n'est
  pas une question qu'on peut poser).

### 🔴 C2 — La saisie est le point faible n° 2
`QuestionEditor.tsx`, `app/reviser/cours/[id]/question/[qid]/page.tsx`

- **Une question = une page = un aller-retour serveur.** Écrire 20 flashcards = 20
  navigations. Wooflash et Quizlet font ça sur une ligne qui se dédouble à `Entrée`.
- **Aucun import.** Pas de CSV, pas de collage `terme⇥définition`, pas de `.apkg` Anki, pas
  de Quizlet. Un élève qui a déjà ses cartes ailleurs ne peut pas venir.
- **Aucune photo, aucun PDF.** Le cours de l'élève est *une photo dans son téléphone* — le
  produit n'a pas de porte pour ça.
- **La promesse de la carte IA n'est pas tenue.** Elle dit « **Colle ton cours**, l'IA rédige
  les questions. **Tu valides.** » Or le champ est un *thème* de 500 caractères (on n'y colle
  pas un cours), et les questions sont **insérées directement en base** : l'élève ne valide
  jamais rien. Deux promesses fausses sur une carte de trois lignes.
- **Pas d'édition en masse**, pas de recherche, pas de duplication de cours, pas de modèles.

### 🟠 C3 — Zéro personnalisation de la révision elle-même
`CourseScreen.tsx` (menu « Réviser »)

Le menu propose exactement deux choses : *tout le cours*, ou *un chapitre*. Manquent :

- le **sens** de révision (recto→verso / verso→recto / mixte) — critique pour les langues,
  et les colonnes `langue_recto` / `langue_verso` **existent déjà en base sans servir** ;
- le **type** de session (flashcards seules, QCM seuls, **mes erreurs seulement**) ;
- la **longueur** (10 questions / 5 minutes) ;
- le **mode** (apprentissage guidé / entraînement / examen blanc chronométré) ;
- les **étiquettes transverses** — un chapitre est un dossier ; on ne peut pas dire
  « révise tout ce qui est marqué *bac* » à travers plusieurs cours ;
- une **échéance** (« contrôle le 12/09 ») à partir de laquelle l'app planifierait à rebours.

### 🟠 C4 — Le carnet est une île dans l'app
C'est **le constat le plus rentable** de tout l'audit.

- Une session de carnet ne donne **aucun XP**, ne nourrit **aucune couronne globale**, ne
  crédite **pas la série**. Seul le `WorkTimer` la voit.
- Les questions de l'élève ne nourrissent **ni le Défi, ni les boss, ni le duel, ni
  l'examen blanc** — alors que `lib/questions/engine.ts` est déjà le moteur unique et
  mentionne le carnet en commentaire.
- **Marcel ne parle jamais du carnet.**
- Un cours n'est **rattaché ni à une matière ni à une classe** : impossible de le poser à
  côté du chapitre du programme qu'il révise.

Anki ne pourra jamais faire ça. Wooflash non plus. C'est le fossé.

### 🟡 C5 — Contenu pauvre et correction rigide
- **Aucune image, aucun son, aucune formule.** Les maths sont hors-jeu (pas de LaTeX), les
  langues sont muettes (pas de synthèse vocale), les SVT sont sans schéma.
- **Types manquants** vs concurrents : appariement, remise en ordre, catégorisation,
  légende de schéma, réponse numérique avec tolérance.
- **Texte à trous** (`parseTrous`) : un seul mot accepté par trou, pas d'alternative, pas
  d'indice, et la correction exige **le bon nombre de trous dans le bon ordre**.
- **Réponse libre** (`gradeLibre`) : égalité stricte après normalisation. « l'ONU » vs
  « ONU » = **faux**. Une faute de frappe = **faux**. Aucune tolérance, aucun « presque ».

### 🟡 C6 — Le partage n'existe pas
La migration 186 dit elle-même : *« le schéma reste prêt pour un partage futur »*. Or c'est
le moteur de croissance de Quizlet et d'Anki (les paquets partagés), **et** l'app a déjà des
amis et des clans. Personne ne peut envoyer son cours à un camarade, ni défier un ami sur
ses propres questions.

### 🟡 C7 — Les résultats ne racontent rien
`ResultsPanel`

Trois chiffres et trois barres. Manquent : l'évolution dans le temps, l'historique des
sessions (**la table `carnet_review_sessions` est écrite et n'est lue nulle part** — de la
donnée morte), « tes 5 questions les plus ratées », et la **prévision** (« demain :
12 cartes ») qui est justement ce qui fait revenir.

### 🟡 C8 — Dette et fiabilité
- **Une session interrompue est perdue** : l'avancement vit dans le `useState` de
  `ReviewSession`. Fermer l'onglet = tout recommencer.
- **« Rejouer » fait un `window.location.reload()`.**
- **Aucune reprise des erreurs en fin de session** — la boucle pédagogique reste ouverte au
  moment précis où elle devrait se refermer.
- **L'ordre des questions est toujours celui de la liste**, jamais mélangé. L'élève finit
  par apprendre l'ordre, pas le contenu.
- **`/reviser` charge le contenu JSONB de toutes les questions** de tous les cours à chaque
  affichage, uniquement pour compter ce qui est dû.
- **Aucun export** : l'élève est enfermé. Anki fait de l'ouverture un argument de confiance.
- L'écran d'un cours est **coupé en affichage large** (colonne rognée à droite).

---

## 4. Le plan d'action

Six lots. L'ordre compte : le lot 0 débloque tout le reste.

### Lot 0 — Fondations (dette qui bloque la suite)
1. **Table d'état par question** — `carnet_question_states` : `due_on`, `interval`, `ease`,
   `streak`, `lapses`, `last_seen`, `is_leech`. On arrête de recalculer 4 000 tentatives à
   chaque page ; « qu'est-ce qui est dû ? » devient une requête indexée.
   *(nouvelle migration numérotée, idempotente, à exécuter à la main)*
2. **Session reprenable** — persister la file et l'index (la table `carnet_review_sessions`
   existe déjà et ne sert à rien : lui donner enfin un rôle).
3. **Allègement de `/reviser`** — compteurs agrégés, plus de contenu JSONB pour compter.

### Lot 1 — Le moteur (l'arme contre Anki)
4. **Quatre verdicts** sur les flashcards : *Encore / Difficile / Bien / Facile* (les
   questions corrigées se notent seules à partir du résultat).
5. **SM-2 simplifié** : `ease` par carte, rechute progressive au lieu du retour à zéro,
   **étapes d'apprentissage intra-journée** (1 min / 10 min), **dispersion** des échéances.
6. **Plafond quotidien réglable** (nouvelles / révisions) — le remède au mur de 300 cartes.
7. **Cartes-sangsues** : au bout de N échecs, la carte est signalée « à reformuler » et
   proposée à la réécriture (avec l'aide de l'IA).
8. **Mélange systématique** + **« rejouer mes erreurs »** en fin de session.

### Lot 2 — La saisie (l'arme contre Wooflash)
9. **Saisie en rafale** : une ligne = une carte, `Entrée` ouvre la suivante, aucune
   navigation. C'est la fonctionnalité qui change le plus la vie de l'élève.
10. **Import par collage** : `terme⇥définition`, CSV, `;` — avec aperçu avant insertion.
11. **Photo du cours → questions** : photo ou PDF → texte → IA → **écran de validation**.
    C'est *la* promesse déjà affichée sur la carte violette ; il faut la tenir.
12. **Écran de validation de l'IA** : les questions générées s'affichent en attente, l'élève
    garde, modifie ou jette **une par une**. Et le champ accepte enfin un vrai cours
    (plusieurs milliers de caractères, découpé côté serveur), avec choix de la classe.
13. **Recherche, sélection multiple, actions groupées** (déplacer, étiqueter, supprimer).

### Lot 3 — La personnalisation (le cœur de l'objectif)
14. **Feuille « Comment tu veux réviser ? »** avant chaque session : portée · sens · types ·
    longueur · mode. Les réglages se retiennent par cours.
15. **Étiquettes transverses** + filtre (« tout ce qui est marqué *bac* », tous cours
    confondus).
16. **Échéance datée** sur un cours (« contrôle le 12/09 ») → planification à rebours et
    compte à rebours sur la carte du cours.
17. **Réglages par cours** : nouvelles/jour, révisions/jour, **tolérance orthographique**.

### Lot 4 — Le contenu riche
18. **Image** sur une question (Supabase Storage) — schémas, cartes, énoncés photographiés.
19. **Son** : synthèse vocale sur les faces de flashcard — `langue_recto`/`langue_verso`
    sont déjà en base, il n'y a qu'à s'en servir.
20. **LaTeX** pour les maths et la physique.
21. **Nouveaux types** : appariement, remise en ordre, réponse numérique tolérante.
22. **Correction plus juste** : alternatives et indices par trou, tolérance de frappe
    (distance d'édition) avec un verdict « presque — voilà l'orthographe exacte ».

### Lot 5 — L'intégration au monde Studuel (le fossé)
23. **XP et série** créditées par une session de carnet.
24. **Rattacher un cours à une matière + une classe** → il apparaît dans le dossier de la
    matière, à côté du programme officiel.
25. **Les questions du carnet nourrissent le Défi** : jeux de salon, boss, examen blanc — le
    moteur unique (`lib/questions/engine.ts`) est déjà prévu pour.
26. **Marcel s'occupe du carnet** : « 12 cartes dues », repérage des cartes-sangsues,
    proposition de reformulation.
27. **Duel sur son propre cours** : défier un ami sur *ses* questions à soi.

### Lot 6 — Partage & confiance
28. **Partager un cours** à un ami ou à un clan (lire, ou copier chez soi).
29. **Bibliothèque de classe** : les cours partagés du même niveau.
30. **Export CSV / Anki** : personne n'est enfermé. C'est un argument, pas une concession.

---

## 5. L'ordre de bataille

Si on ne fait que trois chantiers, ce sont ceux-là — ils répondent aux trois promesses
cassées :

1. **Lot 0 + lot 1** — *un moteur qui s'adapte à l'élève.* Sans état stocké par carte,
   aucune des autres améliorations n'est possible, et le carnet restera moins bon qu'Anki
   sur le seul terrain qui compte pour de la révision.

2. **Points 9 à 12 (rafale, import collé, photo → IA, validation)** — *remplir son carnet
   en deux minutes.* Aujourd'hui le coût d'entrée est tel que les cours restent vides : la
   capture de référence montre **4 cours vides sur 6**. Ce chiffre est le vrai symptôme.

3. **Point 14 + points 23 à 25 (feuille « comment réviser » + XP + Défi)** — *la
   personnalisation revendiquée, et le fossé que les concurrents ne franchiront pas.*

---

## 6. Ce qu'on ne fait pas

- **Pas de FSRS complet.** SM-2 simplifié suffit largement pour des collégiens et lycéens,
  et reste explicable à un élève. Le sur-réglage est le piège d'Anki, pas son atout.
- **Pas d'éditeur riche à la Notion.** Le carnet fabrique des *questions*, pas des documents.
- **Pas de bibliothèque publique mondiale** avant que le partage entre amis ne marche.
- **Pas de réglages par dizaines.** Chaque réglage ajouté doit remplacer une décision que
  l'élève prenait mal tout seul, pas s'ajouter à sa charge.

---

## 7. Comment on saura que c'est gagné

| Indicateur | Aujourd'hui | Cible |
|---|---|---|
| Part de cours vides (brouillons) | 4 sur 6 sur le compte de test | < 1 sur 5 |
| Temps pour créer 10 questions | ~10 navigations | < 2 minutes, 0 navigation |
| Sessions de carnet par élève actif / semaine | non mesuré | ≥ 3 |
| Part des cartes dues effectivement révisées | non mesuré | > 70 % |
| Cours rattachés à une matière | 0 (impossible) | > 50 % |
