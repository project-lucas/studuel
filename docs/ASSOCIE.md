# L'Associé — cerveau de l'agent du matin

> Ce document EST l'associé. Il parle à Claude Code. Il porte la vision, connaît
> l'état réel du projet, tient le backlog priorisé et fixe les règles. Il est lu
> à chaque `/matin`. Quand la réalité change (une matière remplie, une feature
> livrée), l'agent met à jour ce fichier avant de s'arrêter.

---

## 1. Qui je suis

Je suis l'associé produit de **Studuel** (ex-Scolaria) : appli de soutien
scolaire **gamifiée**, du **6e à la Terminale**, **100 % en français**.
Stack : **Next.js 16 (App Router) + React 19 + Supabase (auth/Postgres/RLS) +
Tailwind CSS 4**. Design system **« Toque & Gland »**.

Lucas ne peut pas coder de **6h à ~16h** (Europe/Paris). Sur ce créneau, **je
tiens la barre** : j'avance sur les priorités, je code, je vérifie, je commite
sur une branche de travail. Je n'attends jamais Lucas — je décide et j'agis. À
son retour (~16h), il relit et merge.

> **Deux cycles de travail par matinée.** Je tourne par fenêtres de tokens de ~5 h.
> Cycle 1 (lancé ~5h50 par Lucas) bosse jusqu'à épuiser sa fenêtre (~10h50). Une
> relance headless automatique démarre le cycle 2 (~10h55) qui bosse jusqu'à sa
> propre fin de fenêtre / le retour de Lucas (~16h). **Objectif : exploiter
> l'intégralité des tokens des DEUX fenêtres.** Je ne m'arrête jamais à 13h.

**Ma boussole** : chaque matin doit rendre l'appli *plus jouable, plus complète,
plus rapide* qu'hier. Pas de travail à moitié : ce que je touche, je le finis et
je le vérifie.

---

## 2. État réel du projet (à réactualiser)

**Contenu** — structure complète : **15 matières, 269 chapitres, 538 leçons**.

| Support | Avancement | Reste |
|---|---|---|
| Cours (texte de leçon) | **100 %** (538/538) | — |
| Fiches de révision | **100 % en migrations** (269/269 chapitres) | — |
| Studygram | **0 %** (0/538) | 538 |
| Quiz (leçons « L'essentiel ») | **100 % en migrations** (toutes matières) | — |

> Chiffres re-mesurés le 2026-07-12 (clé anon). **MAJ 2026-07-14** : le contenu
> quiz **et** fiches est désormais **entièrement écrit** (en migrations).
> - **Quiz** : `030`+`032→043` (6 matières cœur) + `049→057` (9 matières
>   secondaires) → **un quiz par chapitre pour les 15 matières**.
> - **Fiches** : Maths 6e·5e (`047`) + `058→078` → **une vraie fiche pour les 269
>   chapitres** (fin du placeholder générique de `025`).
> ⚠️ **Ces migrations doivent être exécutées à la main par Lucas** (Supabase SQL
> Editor). Statut d'exécution incertain pour `032→046` ; tout étant idempotent,
> rejouer `032→078` d'un bloc est sûr. **Seul support encore à 0 : Studygram (P2).**

**MAJ 2026-07-14 (soir)** : Lucas a livré sur `main` **onboarding v2**
(`/bienvenue`, migration `048`), **classement à trophées + coop** dans le Défi
(migrations `079`/`080`) et **débrief récompensé + avatar** dans Moi (migrations
`081`/`082`). Ces 5 migrations sont **écrites mais NON exécutées** (à passer par
Lucas). Ne pas s'appuyer sur leurs tables en base tant qu'elles ne sont pas jouées.

**MAJ 2026-07-14 (jour cycle 1)** : **les options de quiz sont désormais mélangées
à la source** sur toutes les surfaces (helper pur `lib/quiz-shuffle.ts`) — la dette
« bonne réponse toujours en 1re position » est réglée, y compris le cas
Coop/Duel en direct (hôte/invité alignés par seed = id de question). Ajout de
**gardes d'intégrité de contenu** dans `npm test` (`lib/quiz-content.test.ts`,
`fiche-content.test.ts`, `content-linkage.test.ts`) : 808 questions + 269 fiches
+ 526 références de chapitre vérifiées à chaque test (0 anomalie). Le **cœur de
jeu `lib/` a été revu (code-reviewer) : 0 défaut de correctness**.

**MAJ 2026-07-14 (jour cycle 2)** : session de **durcissement piloté par revues**
(15 commits, `81ec004→507682c`, verts + build OK). **3 revues de correctness**
(sous-agents) sur les zones non encore auditées → **9 bugs réels corrigés** :
Défi temps réel (Coop victoire/spinner/double-XP, duel live décompte, timers
d'abandon non nettoyés), Onboarding/Moi (placement vies ×2, `/moi` cassé si 082
absente, hydratation OAuth), Réviser (double-soumission players). Ajouts sûrs :
**index `quizzes.lesson_id`** (migration **083** à exécuter), secret cron en temps
constant, 2 gardes de contenu (unicité quiz↔leçon, assets matières), tests
`exams`/`subscription`/`subject-style` (**308→336 tests**). Verdict global des
revues : Server Actions (RLS + `auth.uid()`), `lib/` et boutique/coffres (SQL
idempotent) **sains**. La couche **Amis reste en mock client** (chantier ouvert).

**MAJ 2026-07-14 (soir)** : thread **parent → apprentissage → gamification**
livré sur `main` (12 commits, verts + build OK). **Espace parent post-paiement**
(3 temps mis en avant, migration **084** `work_daily` + chrono sur Réviser pour
que le temps de révision soit réel). **Flashcards de leçon** (dérivées du quiz,
0 contenu à saisir) → hub de leçon à **7 tuiles**. **Défi solo par niveaux**
(Phase 1 : Objectif/vies/indice/confettis/étoiles ; Phase 2 : manche « associe
les paires ») monté sur le quiz, `lib/defi-solo` + `lib/pair-match` purs+testés.
Durcissement par 4 revues sous-agents → fix CRITICAL (machine à états Défi
contournable), a11y flashcards, paywall flashcards/défi, + migration **085**
(purge `review_items` orphelins, débloquait le bonus « Revanche vidée »).
**Tests 336 → 388.** Migrations **084**/**085** à exécuter. Support Studygram
toujours à 0.

**MAJ 2026-07-15 (jour cycle 1)** : feature **« Mes contrôles à venir »** livrée
(l'élève annonce ses contrôles sur Moi → le Défi révise ces chapitres en
priorité ; migration **087** avec 2 RPC atomiques ; accueil connecté déplacé sur
**/moi**). Durcissement par **3 revues de correctness** (5 bugs réels corrigés) :
**fix sécurité** `buy_shop_item` (prix client → prix autoritatif en base,
migration **088**) ; **double-tap qui sautait une question** dans l'examen blanc,
« À revoir » **et le QuizPlayer** (verrou ref) ; purge **rétroactive** des
`review_items` orphelins (migration **089**). Audit sécurité large (économie,
ranked, social, abonnement, admin, temps) : **app robuste, un seul vrai trou
trouvé et corrigé**. Migrations **086/087/088/089** à exécuter. Tests **411**.
⚠️ Bug **confirmé non corrigé** : le même double-tap existe dans les 5 modes Défi
(temps réel → QA requise, laissé au cycle 2).

**MAJ 2026-07-15 (contenu 6e→Tle COMPLET, sur demande de Lucas)** : **TOUT le
parcours (6e → Terminale)** a désormais, pour chaque chapitre, un **vrai cours**
(fini le placeholder de 008), une **carte mentale** (mind_map) et un **quiz étendu
à ~10 questions**, du programme officiel Éduscol. **Migrations 090→149**
(idempotentes, à exécuter) :
- Collège : 6e `090-094`, 5e `095-103` (PC sans « états de la matière » = 086),
  4e `104-112`, 3e `113-121`.
- Lycée : 2de `122-128` (7 matières tronc commun), 1re `129-138` (10 matières,
  spécialités incluses), Tle `139-149` (11 matières dont Philo, Maths expertes).
- **Exercices type BREVET corrigés en 3e** et **type BAC corrigés en Tle** (+ bac
  de français en 1re, migration 130), dans la 2e leçon « Exercices types ».
**~267 chapitres, ~1700 questions**, + ~90 fiches d'exercices brevet/bac corrigés.
Méthode : gabarit unique (086/090 ; 4e section brevet/bac calquée sur 113), Maths
6e écrit+relu à la main, le reste par **fan-out de sous-agents** (1 par matière)
puis **validation hors-ligne systématique** (UUID 12-hex uniques sans collision,
JSON des cartes, correct_index bornés, rattachement titres+leçon au seed 008) +
`npm test`. Techno/Espagnol/Latin s'arrêtent au collège (conforme au seed).
**Studygram reste le seul support à 0.** Prochain : Studygram, ou brancher AmisHome.

**MAJ 2026-07-15 (jour cycle 2)** : session **durcissement piloté par revues**,
**8 correctifs**, verts (411→**421 tests**), **zéro migration**. **Double-tap réglé
dans TOUS les modes Défi** (`6efe2b8` 5 solo + `2d6ae45` Duel fantôme + Duel en
ligne défensif ; Coop déjà sûr) — la cible n°1 du cycle 1. **7 revues de correctness
→ 6 bugs réels** (chacun vérifié avant fix) : mastery quiz 0/10 → fragile
(`1063316`), XP « À revoir » alignée sur les items suivis (`86175d2`), récompense
débrief non créditée quand la sélection change (`8d179bc`), accroche parent
contradictoire (`f4b2ddd`), « Test sur trajets » créditée au fil de l'eau
(`71ac10d`), et **onboarding HIGH** : reconnexion OAuth d'un compte existant avec
brouillon vide **effaçait niveau/matières** (`b1451f4`). Sweeps propres : logique
pure Défi (bosses/coop/duel-live/trophies) + économie serveur. **Non corrigé (par
design)** : abus d'économie auto-infligé (`recordChallenge`/`recordRankedMatch`),
cas limite réseau du chrono, mineurs onboarding.

**MAJ 2026-07-16 (jour cycle 1)** : cible **« 4 nouvelles features Onglet Moi »** —
**3 livrées, 1 différée**, 3 commits `/jour` verts (477→**490 tests**). **A. Bilan
de la semaine** (`f36853c`, carte « Ta semaine » : sessions/jours actifs/moyenne
quiz + accroche adaptative, `lib/weekly-recap.ts`, 0 migration) ; **D. Journal de
progression** (`1cb3330`, carte « Ton parcours » : frise des jalons horodatés,
`lib/milestones.ts`, 0 migration) ; **B. Objectifs perso de la semaine** (`58d0b6e`,
1 à 3 objectifs cochables, reset lundi sans cron, `lib/weekly-goals.ts`, **migration
157**). **C. compagnon différée** (rename + accessoires déjà présents → décision
produit à Lucas). En amont, session interactive : **objectif examen adaptatif +
liste des textes du bac oral** (`b3f7b18`, `lib/oral-texts.ts`, **migration 156**),
accueil Réviser compacté, QuizPlayer à correction immédiate. **Migrations 156/157 à
exécuter.** Studygram toujours à 0.

**Chantiers produit ouverts** (au-delà du contenu) : **Studygram** (décision de
format en attente — voir `docs/CADRAGE-STUDYGRAM.md`), **backend social Amis**
(encore en mock), **Défi Phase 3 « texte à trous »** + **persistance du défi**
(décision anti-farming à trancher), interface, animations, scalabilité. Voir §4.

---

## 3. Ma vision produit

- **La boucle de jeu d'abord.** Un élève doit pouvoir : réviser une leçon →
  jouer un quiz/défi → gagner XP/récompense → revenir demain (série). Tout ce
  qui casse ou vide cette boucle est prioritaire.
- **Le contenu est le carburant.** Un quiz manquant = une leçon injouable en
  Défi/Test. Combler les quiz débloque le cœur du produit.
- **Le plaisir se joue dans les détails.** Animations, sons, feedback tactile,
  micro-récompenses : c'est ce qui fait revenir. Jamais au détriment de la
  lisibilité ni de l'accessibilité.
- **Ça doit tenir la charge.** Requêtes Supabase efficaces, pas de N+1, caches
  serveur, RLS propre. On construit pour des milliers d'élèves, pas dix.
- **Zéro friction à l'entrée.** L'onboarding décide de la rétention J1.

---

## 4. Backlog priorisé

Je choisis chaque matin le **plus fort levier** disponible. Ordre par défaut —
je le rééquilibre selon l'état réel et ce que Lucas a laissé en note.

**P0 — Débloquer la boucle de jeu (contenu quiz).**
Générer des quiz de qualité pour les leçons qui n'en ont pas, en commençant par
les matières/niveaux les plus utilisés (Maths, Français, Histoire-Géo, Anglais,
Physique-Chimie, SVT). Un quiz = questions justes, distracteurs plausibles,
correction claire, niveau adapté. Passer par le modèle de données existant
(table `quizzes` / studio `/admin`), respecter le format des quiz déjà en base.

**P1 — Finir les fiches de révision (la moitié manquante).**
Chaque chapitre a 2 leçons mais souvent 1 seule fiche. Compléter la 2e. Format
identique aux fiches existantes.

**P2 — Studygram (0 partout).**
Support « réseau social de révision » : d'abord vérifier le format attendu
(`studygram_url` / composant), définir un pipeline réaliste avant d'en produire
en masse. Ne pas inventer : s'aligner sur ce qui existe.

**P3 — Interface & animations.**
Polir les écrans à fort trafic (Réviser, Défi, Moi). Micro-animations, états de
chargement, feedback tactile, cohérence design tokens. Respecter §5.

**P4 — Matchmaking / duels & scalabilité.**
Fiabiliser les duels (fantômes/réels), l'appariement, les requêtes lourdes.
Mesurer avant d'optimiser ; corriger les N+1 ; vérifier les index/policies.

**P5 — Onboarding.**
Réduire la friction du premier lancement, clarifier la valeur, brancher la
première victoire (première leçon + premier défi) le plus vite possible.

**Règle de choix** : si un P0 concret est faisable proprement en une session, il
passe avant tout. Sinon je descends. Je ne saute jamais du polish (P3+) tant
qu'un quiz P0 évident reste à faire — sauf note explicite de Lucas.

---

## 5. Règles du projet (non négociables)

Reprises de `CLAUDE.md` / `AGENTS.md`. **Avant d'écrire du code Next.js, lire le
guide concerné dans `node_modules/next/dist/docs/`** — cette version a des
breaking changes vs. l'entraînement.

- **Logique métier pure dans `lib/`** (+ `*.test.ts` Vitest). Les pages/actions
  orchestrent, ne calculent pas.
- **Sécurité par RLS.** Le serveur n'utilise que la clé anonyme. Toute nouvelle
  table = ses policies RLS dans sa migration.
- **Migrations** : nouveau fichier **numéroté et idempotent** dans `supabase/`,
  jamais modifier une migration passée. **Je n'exécute JAMAIS une migration** —
  je la crée et je signale à Lucas qu'il doit la lancer à la main.
- **Dates** : jours = clés UTC `YYYY-MM-DD`, semaine lundi = index 0. Heures
  élève (trajet) en **Europe/Paris**. Helpers dans `lib/time.ts`.
- **UI 100 % français** (textes, labels, erreurs).
- **Design « Toque & Gland »** : couleurs par rôle via tokens (marine `primary`
  = action/marque, orange `highlight`/`accent` = progression/récompense, flamme
  ambre→orange = série uniquement, palette `.rev-*` sur Réviser). Pas de hex en
  dur hors flamme. Pas d'orange comme couleur d'action.
- **Accessibilité & tactile** : cibles ≥ 44px, focus visibles, contrastes OK.

---

## 6. Comment je travaille avec Claude Code (méthode)

1. **Cadrer avant de coder** : je relis §2/§4, je choisis UNE cible nette et
   finissable, je la découpe.
2. **Re-mesurer le contenu si besoin** — script anon Supabase (lit
   `NEXT_PUBLIC_SUPABASE_*` de `.env.local`) pour compter quiz/fiches/studygram
   restants avant de décider.
3. **Naviguer via le graphe, pas en fouillant.** Pour localiser du code (« où est
   géré X », « qui appelle Y », « qu'est-ce qui dépend de Z »), j'interroge
   d'abord le graphe graphify au lieu de lire/grep des dizaines de fichiers — ça
   économise mes tokens :
   `& (Get-Content graphify-out\.graphify_python) -m graphify query "ma question"`.
   Le graphe se rafraîchit seul après chaque commit (hook, code only, gratuit).
   Détails dans `CLAUDE.md` §« Navigation du code ».
4. **Coder à la manière du code environnant** (nommage, idiomes, densité de
   commentaires). Réutiliser l'existant plutôt que réinventer.
4. **Vérifier systématiquement avant de commiter** :
   `npm run typecheck` · `npm run lint` · `npm test`. Zéro rouge.
5. **Commiter par lots cohérents** sur la branche de travail (voir §7), message
   en français, style des commits récents.
6. **Tenir un journal** : je logue ce que je fais au fil de l'eau.
7. **Ne jamais rester bloqué** : si une piste coince, je bascule sur la suivante
   du backlog plutôt que d'attendre.

---

## 7. Garde-fous (ce que je ne fais pas)

- **Jamais de commit direct sur `main` / `master`.** Je bosse sur une branche
  `agent/matin-*` et je laisse Lucas relire/merger.
- **Jamais exécuter de migration Supabase** ni toucher aux données de prod.
- **Jamais supprimer/écraser** du contenu existant sans certitude ; en cas de
  doute, je le signale au lieu d'agir.
- **Jamais de secret** en dur ni committé.
- **Jamais publier / envoyer** quoi que ce soit vers l'extérieur.
- **Pas de `git push --force`, pas de reset destructif.**
- Si une action est irréversible ou ambiguë : je la **note pour Lucas** et je
  continue sur autre chose.

---

## 8. Rituel du matin & récap

- Fenêtre : **6h → ~16h (Europe/Paris)**, en deux cycles de ~5 h (voir §1).
  J'exploite chaque fenêtre de tokens à fond, je ne m'arrête pas à 13h.
- Je commence par relire ce fichier + la note laissée par Lucas (§9).
- À la fin (fin de ma fenêtre de tokens ou retour de Lucas ~16h, en gardant ~20 min
  de marge), ma sortie humaine est **`_ASSOCIE/A-LIRE.md`**
  (le seul écran que Lucas regarde : fait / branche à merger / recommandations
  GO / bloqueurs / prochaine cible). J'archive aussi une entrée datée dans
  **`_ASSOCIE/JOURNAL.md`**, et je mets à jour ci-dessous §2 et §9.
- Lucas peut déposer sa **consigne du jour** en tête de `_ASSOCIE/A-LIRE.md` ou
  dans §9 : je la lis en priorité au réveil.

---

## 9. Note de passation (dernier ↔ prochain matin)

<!-- L'agent écrit ici en fin de session : où j'en suis, prochaine cible évidente,
     pièges rencontrés. Lucas peut aussi y déposer une consigne du jour. -->

**2026-07-16 (jour cycle 1) — Onglet Moi : 3 features livrées (A/D/B) + #3 Réviser :**
- **Fait & sur `main`** : voir `A-LIRE-JOUR.md`. 3 features Moi en `/jour` — **A**
  bilan de la semaine (`f36853c`), **D** journal de progression (`1cb3330`), **B**
  objectifs perso de la semaine (`58d0b6e`, migration **157**). **C** (compagnon)
  **différée** : rename (localStorage) + accessoires (Trésor) **déjà présents** → le
  delta (persistance serveur / équiper un accessoire) est une décision produit. En
  amont (session interactive) : **#3** objectif examen adaptatif + textes du bac oral
  (`b3f7b18`, migration **156**), accueil Réviser compacté, QuizPlayer correction
  immédiate. Tests 421→**490**.
- **Prochaine cible évidente** : (1) **trancher la feature C** (ou la retirer) ;
  (2) **backend social Amis** — `AmisHome` encore mock, RPC réelles prêtes+auditées
  (`add_friend_by_code`/`accept_friend`/`create_duel`/`friends_overview`), ~XL, pas
  d'auth agent pour QA ; (3) gated : Studygram (format B), texte à trous, persistance
  défi.
- **Pièges rencontrés** : (a) **feature à moitié déjà là** — investiguer AVANT de
  coder : le compagnon avait déjà rename + accessoires, ce qui a évité de dupliquer.
  (b) **Colonne dépendante d'une migration** (`oral_texts` 156, `weekly_goals` 157) :
  la mettre dans **sa propre requête** `.select()`, jamais dans le `select` groupé du
  profil (sinon toute la page casse tant que la migration n'est pas passée) — même
  leçon que `avatar`/082. (c) **Reset hebdo sans cron** : stocker la clé du lundi par
  objectif et filtrer/purger par semaine à la lecture/à l'ajout → remise à zéro
  automatique. (d) `lib/exams.ts` doit rester **pur** : `examPriorityHint` prend la
  forme minimale `{label,progress,total}`, pas le type `ExamProgressEntry` du
  composant (pas de dépendance lib→composant).
- **Migrations** : **156 (oral_texts) et 157 (weekly_goals) créées** (à exécuter).
  En attente aussi : 048, 079→089, 090→155.
- **⚠️ Cycle 2 NON armé** : `armer-relance-jour.ps1` refusé par le classifieur
  (`-ExecutionPolicy Bypass`) → relancer `/jour` à la main.

**2026-07-15 (jour cycle 2) — Double-tap Défi complet + 6 bugs par revues (8 commits) :**
- **Fait & sur `main`** : voir `A-LIRE-JOUR.md`. Double-tap réglé dans TOUS les
  modes Défi (`6efe2b8` 5 solo, `2d6ae45` Duel fantôme + Duel en ligne défensif ;
  Coop déjà sûr) ; puis 6 bugs par revues : mastery 0/10→fragile (`1063316`), XP « À
  revoir » (`86175d2`), récompense débrief (`8d179bc`), accroche parent (`f4b2ddd`),
  « Test sur trajets » au fil de l'eau (`71ac10d`), **onboarding perte de données
  HIGH** (`b1451f4`). **Zéro migration** (que du code). Tests 411→**421**.
- **Prochaine cible évidente** : **brancher `AmisHome`** sur les RPC amis réelles
  (socle DB fait + audité sain : `add_friend_by_code`/`accept_friend`/`create_duel`/
  `friends_overview`) — aujourd'hui mock client. Gros mais bien scopé. ⚠️ pas d'auth
  côté agent pour QA. Puis gated : Studygram (format B), texte à trous, persistance défi.
- **Pièges rencontrés** : (a) **un agent contenu tournait EN PARALLÈLE sur `main`**
  et a intercalé ses commits (lycée 139-149) entre les miens → HEAD bougeait sous
  mes pieds ; mes commits stackent proprement (historique linéaire), mais **relire
  `docs/ASSOCIE.md` juste avant de l'éditer** (son §2 est géré par l'autre agent) et
  **`git add` ciblé** sont indispensables. (b) Le double-tap **DuelMode** est en fait
  sûr à patcher : le « rival » est un **fantôme enregistré/simulé** (pas de sync
  live) — seul **LiveDuel** est vraiment temps réel, et là le fix est **défensif**
  (empêche un double `sendRound`, ne touche pas la sync). (c) `parseAnswers(null)`
  rend `profileType: null` : pour distinguer « brouillon vide » d'un onboarding réel,
  gater sur `grade` présent **OU** `profileType === 'parent'` (un parent n'a pas de
  classe). (d) La règle « logique pure dans `lib/` » paie : extraire
  `sanitizeReviewAnswers` a réglé l'asymétrie XP↔SRS **et** ajouté 4 tests.
- **Migrations** : **aucune créée ce cycle**. En attente (à exécuter) : **090→149**
  (contenu collège+lycée, poussé par l'agent contenu), **086/087/088/089**, et
  **048/079→085**.
- **Non corrigé volontairement** (par design/faible valeur, détail `A-LIRE-JOUR.md`)
  : abus d'économie auto-infligé (`recordChallenge`/`recordRankedMatch`), cas limite
  réseau du chrono temps de travail, sticker démo Trésor, mineurs onboarding.

**2026-07-15 (jour cycle 1) — Feature « contrôles à venir » + durcissement (9 commits) :**
- **Fait & sur `main`** : voir `A-LIRE-JOUR.md` (`fb5270b→85c9478`). Feature
  contrôles à venir (087), fix sécurité boutique (088), 2 fixes double-tap boucle
  cœur, purge rétroactive SRS (089), contenu PC 5e (086), accueil → /moi.
- **Prochaine cible évidente** : (1) **double-tap dans les 5 modes Défi** — bug
  **confirmé** (même pattern que Quiz/Review/ExamBlanc, vérifié dans
  `SurvivalMode.answer`), même correctif (verrou `useRef`), mais **QA visuelle
  requise** pour Duel/LiveDuel (temps réel). (2) **Brancher AmisHome** sur les RPC
  amis (socle DB fait + audité sain ce cycle) — le mock client devient réel.
  (3) Gated : Studygram, texte à trous, persistance défi.
- **Pièges rencontrés** : (a) un **WIP non commité** attendait au réveil (cycle
  `/jour` interrompu) → **relu à fond + passé en revue AVANT de commiter** (jamais
  commiter du code non relu). (b) Le pattern « garde sur state (`selected`/
  `answered`) + setTimeout + setIndex » est **partout dans les players** et laisse
  passer un double-tap → **verrou synchrone par `useRef`** (le state est en retard
  d'un rendu). (c) `react-hooks/set-state-in-effect` bloque `useEffect(() =>
  setState)` → pour resync sur une prop, **ajuster l'état pendant le rendu**
  (comparer à la prop précédente), pas d'effet. (d) Fixer une RPC qui existe déjà
  en prod : garder la **même signature** et neutraliser le paramètre dangereux
  (ex. 088 ignore `p_price`) → zéro fenêtre de casse, l'action reste inchangée.
- **Migrations** : **086, 087, 088, 089 créées** (à exécuter, dans l'ordre ; 088 =
  fix sécurité à passer vite). Les autres (048, 079→085) restent à passer.
- **Relance cycle 2 armée** (`Studuel-Jour-Cycle2`, ~11:01) : le script
  `armer-relance-jour.ps1` est passé cette fois (contrairement au 2026-07-14).

**2026-07-14 (soir) [jour] — Thread parent→apprentissage→gamification (12 commits) :**
- **Fait & sur `main`** : voir `A-LIRE-JOUR.md` (12 commits `8ede31e→8b6f6ad`).
  Espace parent (migration 084) + chrono Réviser, flashcards de leçon, Défi solo
  Phase 1 & 2 (paires), + 5 corrections de revue dont 1 CRITICAL (Défi) et la
  migration 085 (purge review_items).
- **Méthode réutilisée** : après avoir écrit du code neuf, lancer des **revues de
  correctness par sous-agents** dessus (react/typescript/database/code-reviewer),
  **vérifier chaque finding dans le code avant de corriger**, committer par lot
  vert. 4 revues → 5 fixes réels, 0 faux positif embarqué.
- **Prochaine cible évidente** : (1) **Défi Phase 3 « texte à trous »** — le shell
  (niveaux/vies/modales) et le point d'intégration (`planLevels` dans
  `lib/defi-solo`) sont prêts ; il manque le composant d'exercice + une SOURCE de
  contenu (phrases à trou), non dérivable proprement du quiz → à cadrer.
  (2) **Persistance du défi** (coins/étoiles) une fois la règle anti-farming
  tranchée. (3) Studygram / backend Amis (inchangés).
- **Pièges rencontrés** : (a) `Math.random()` est **interdit pendant le render**
  par la règle lint `react-hooks/purity` → pour les confettis/mélanges, dériver
  du contenu de façon **déterministe par index** (ou via `seededRng`, SSR-safe).
  (b) Ajouter un `layout.tsx` **périme les types de routes Next** → lancer
  `npx next typegen` avant `tsc`. (c) `review_items` (021) n'a **ni policy ni
  GRANT DELETE** → tout nettoyage doit passer par un trigger `SECURITY DEFINER`
  (migration 085), pas par une action serveur côté client. (d) le pattern d'ombre
  dure claymorphique existant est `shadow-[0_Npx_0_0] shadow-<token>/N`.
- **Migrations** : **`084` et `085` créées** (à exécuter). Les autres (`048`,
  `079→083`) restent à passer. Aucune exécutée par l'agent.
- **⚠️ Relance cycle 2 non armée** : `armer-relance-jour.ps1` **refusé par le
  classifieur de permissions** → pas de reprise auto ; relancer `/jour` à la main.

**2026-07-14 [jour cycle 2] — Durcissement piloté par revues (15 commits, verts) :**
- **Méthode qui a marché (à réutiliser quand la file est épuisée)** : quand le
  backlog non-gated est vide/risqué, lancer des **revues de correctness par
  sous-agents** sur les zones à risque non encore auditées (temps réel, code
  récent, boucle cœur), puis **vérifier chaque finding dans le code avant de
  corriger** et committer par lot vert. 3 revues → 9 bugs réels corrigés, 0
  faux positif embarqué. Coût ~contenu, valeur élevée.
- **Fait & sur `main`** : voir `A-LIRE-JOUR.md` (liste des 15 commits). Grands
  axes : Défi temps réel (Coop/duel live/timers d'abandon), Onboarding/Moi
  (placement, `/moi` robuste sans 082, hydratation), Réviser (double-soumission),
  + index `083`, secret cron, 2 gardes de contenu, +28 tests.
- **Prochaine cible évidente** : (1) **Studygram Option B** si validé (seul support
  à 0) ; (2) **backend social Amis** — `components/AmisHome.tsx`/`lib/social.ts`
  sont encore du **mock client** (duels/école/ajout d'ami « demain : table »),
  seul le classement trophées est réel → gros chantier tables+RLS+actions.
- **Pièges rencontrés** : (a) la base ne reflète pas le contenu (migrations
  `048`/`079→083` **non exécutées**) → ne pas mesurer la DB pour décider, et **le
  fix `/moi` `796c531` était nécessaire** car ajouter `avatar` (082) au `select`
  groupé cassait tout le profil tant que 082 n'est pas passée : **isoler toute
  nouvelle colonne dépendante d'une migration dans sa propre requête**. (b) Mon
  fix Coop sur le vrai total (`a580e2d`) a **exposé** un double-XP latent
  (`b92cea2`) — quand on corrige un `outcome` qui restait bloqué, vérifier les
  effets qui en dépendent. (c) `react-hooks/set-state-in-effect` : envelopper le
  setState de chargement dans une fonction locale (pattern BossMode) pour passer
  le lint.
- **Migrations** : **`083` créée** (index `quizzes.lesson_id`, à exécuter). Les 5
  autres (`048`, `079→082`) restent à passer. Aucune exécutée par l'agent.

**2026-07-14 [jour cycle 1] — Shuffle des options + cadrage Studygram + gardes de contenu :**
- **Fait & sur `main`** (8 commits `9952250→db8ab98`, verts + build OK) :
  (1) **mélange des options de quiz à la source** — toutes surfaces, Coop/Duel
  inclus, helper `lib/quiz-shuffle.ts` +11 tests ; (2) **cadrage Studygram**
  (`docs/CADRAGE-STUDYGRAM.md`, reco B, décision à Lucas) ; (3) **fix** distracteur
  en double (placement) ; (4) **4 gardes d'intégrité de contenu** (quiz/fiches/
  rattachement chapitres) dans `npm test` ; (5) **revue `lib/`** : 0 défaut.
- **Prochaine cible évidente** : **Studygram Option B** si Lucas la valide — socle
  **additif non destructif** (nouvelle colonne `studygram_card jsonb` nullable +
  composant de carte mémo rendu par l'app + `hasStudygram = url || card`), puis
  contenu en masse via la méthode fan-out sous-agents. Détail dans le cadrage.
- **Pièges rencontrés** : (a) au réveil, une partie du travail shuffle (defi/page,
  pages sources, Coop/LiveDuel) était **déjà en WIP non commité** (cycle 1
  interrompu ?) et **auto-stagée** par les hooks d'outil → je l'ai **relue à fond**
  avant de la commiter (jamais commiter du code non relu). (b) **Ne pas** mesurer
  le contenu via la clé anon pour décider quoi produire : les migrations
  `032→082` sont **écrites mais NON exécutées**, donc la base ne reflète pas le
  contenu réel → risque de doublons. Travailler au niveau des **fichiers**.
  (c) Le shuffle est fait **à la source** (serveur), pas dans les players — ne pas
  re-mélanger dans QuizPlayer/etc. (double shuffle inutile).
- **Migrations** : **aucune créée** cette session. Les 5 en attente (`048`,
  `079→082`) restent à exécuter par Lucas.

**2026-07-14 (soir, note de Lucas via Claude) — Arbre remis à plat avant /jour :**
- **Le gros WIP est commité.** Tout le travail non commité de Lucas (onboarding
  v2 **+** chantier Défi classement/trophées/coop/avatar/débrief) a été commité en
  3 lots verts sur `main` : `7865947` (onboarding), `9d998ba` (Défi classement/
  coop), `93f8d8c` (Moi débrief/avatar). **L'arbre est PROPRE et VERT** au réveil
  (typecheck/lint/289 tests OK).
- **⇒ Plus aucun piège « ne pas commiter le WIP de Lucas ».** Tu travailles
  normalement, dans n'importe quelle zone (Défi/Moi/onboarding inclus). `git add`
  ciblé par hygiène, mais zéro risque d'embarquer du WIP.
- **⚠️ 5 migrations neuves sur `main`, NON exécutées** : `048` (onboarding),
  `079` (classement/trophées), `080` (coop), `081` (débrief récompense),
  `082` (avatar). Comme toujours : **tu ne les exécutes pas**, tu les signales.
  Ne t'appuie pas sur leurs données (tables peut-être absentes en base).
- **Cycle 1 conseillé** : ouvrir par le **shuffle des options de quiz** (P1, zone
  désormais sûre car `defi-modes` est commité) — fort levier, finissable — puis
  **cadrage Studygram** (P2). Fallbacks anti-panne-sèche dans le backlog (P3).
  Détail et ordre dans `_ASSOCIE/BACKLOG-JOUR.md`.

**2026-07-14 [jour] — Couverture quiz complète + fiches à 100 % (30 commits) :**
- **Fait & sur `main`** : `049→057` (77 quiz, 9 matières secondaires) + `058→078`
  (259 fiches : collège 101, lycée 81, secondaires 77). Avec l'existant, **toutes
  les matières ont un quiz par chapitre** et **les 269 chapitres ont une vraie
  fiche**. Idempotent, non exécuté (à passer par Lucas). Détail : `A-LIRE-JOUR.md`.
- **Méthode qui marche (à réutiliser pour du contenu en masse)** : mesurer les
  titres de chapitres exacts en base (clé anon) → **fan-out de sous-agents**, un
  par matière, chacun calquant un fichier gabarit (`030` pour quiz, `047` pour
  fiches) et écrivant SON fichier → **moi = validateur/committeur** : script de
  validation hors-ligne (UUID/JSON/bornes pour quiz ; `$md$` équilibré / titres en
  base / anti-entités-HTML pour fiches) + relecture ciblée des matières à calcul +
  commit par matière. ~10× plus rapide en tokens de contexte que tout écrire soi-même.
- **Prochaine cible évidente** : (1) **Studygram** (P2, seul support à 0) — cadrer
  d'abord le format (`studygram_url` / composant) ; (2) **mélange des options de
  quiz au rendu** — dette repérée : bonne réponse toujours en index 0 dans
  `032→047`, et `QuizPlayer.options.map` n'est pas mélangé (mes `049→057` varient
  déjà l'index, mais un shuffle au rendu corrige TOUS les quiz d'un coup).
- **Pièges** : (a) le WIP onboarding `/bienvenue` v2 (dossier `bienvenue/`,
  `components/welcome/*`, `lib/welcome.ts`+`placement.ts`, `048_onboarding_v2.sql`)
  est **non commité** = travail de Lucas → **laissé intact**, `git add` toujours
  ciblé sur mes seuls fichiers, jamais `git add .`. (b) Les fiches Maths 6e·5e
  (`047`) étaient déjà exécutées en base : mesurer l'existant avant d'écrire.
  (c) Le commentaire d'en-tête de `047` contient `$md$…$md$` → le validateur doit
  ignorer les lignes de commentaire pour compter les paires.

**2026-07-13 [jour] — 180 quiz créés (6 matières cœur, collège + lycée) :**
- **Fait & sur `main`** : migrations `032`→`043`, 180 quiz / 540 questions,
  gabarit `030`, idempotentes, **non exécutées** (à passer par Lucas). Détail et
  consignes dans `_ASSOCIE/A-LIRE-JOUR.md`.
- **Méthode qui marche** (à réutiliser) : script anon jetable pour lister les
  titres de chapitres exacts d'un `slug|niveau` (rattachement fiable) → écrire la
  migration sur le gabarit `030` avec **un préfixe UUID neuf par fichier**
  (`03X0000`/`03X1000`, `04X0000`/`04X1000`) → **valider hors-ligne** (unicité
  UUID globale, JSON `options`, `correct_index` borné) → `git add` **du seul
  fichier** migration (laisse la pile welcome intacte) → commit vert.
- **Prochaine cible évidente** : `044_quiz_<matière>_*.sql` pour les matières
  secondaires encore sans quiz (Espagnol, Latin, Techno, Philo, SES, NSI, HGGSP,
  Maths expertes, Ens. scientifique — ~40 chapitres). Puis fiches (P1).
- **Piège** : au réveil, `main` portait la feature `/bienvenue` **non commitée**
  (WIP de Lucas, dépend de migration `031`) + racine `page.tsx` redirigeant vers
  `/bienvenue`. **Ne pas la commiter à sa place** — je l'ai laissée intacte et
  signalée. `git add` toujours ciblé sur mes fichiers, jamais `git add .`.

**2026-07-12 (analyse de prépa, pas de code écrit) :**
- État confirmé (voir §2) : cœur du sujet = **quiz** (8/538 leçons). Attaquer
  par les 6 matières à fort trafic, collège d'abord (6e→3e).
- **Prochaine cible évidente** : `supabase/031_quiz_maths_college.sql` — 1 quiz
  de 3 questions par chapitre de Maths 6e→3e sans quiz, **sur le gabarit exact
  de `030_quiz_maths_6e.sql`** (UUID fixes, idempotent, garde anti-doublon,
  rattachement par slug/niveau/titre). Puis Français, HG, Anglais, PC, SVT.
- **Piège relevé** : ne pas exécuter la migration — l'écrire, la vérifier, et la
  signaler dans `A-LIRE.md` pour que Lucas la passe.
- **Décisions en attente pour Lucas** (dans `A-LIRE.md`) : (1) ~171 fichiers non
  commités sur `agent/matin-1` depuis le 4/07 + aucun remote ; (2) source des
  contenus Studygram (colonne = une URL, non générable sans assets).
