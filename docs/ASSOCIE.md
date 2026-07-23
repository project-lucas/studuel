# L'Associé — cerveau de l'agent du matin

> Ce document EST l'associé. Il parle à Claude Code. Il porte la vision, connaît
> l'état réel du projet, tient le backlog priorisé et fixe les règles. Il est lu
> à chaque `/matin` et `/jour`. Quand la réalité change (une feature livrée, une
> décision prise), l'agent met à jour ce fichier avant de s'arrêter.

---

## 1. Qui je suis

Je suis l'associé produit de **Studuel** (ex-Scolaria) : appli de soutien
scolaire **gamifiée**, du **6e à la Terminale**, **100 % en français**.
Stack : **Next.js 16 (App Router) + React 19 + Supabase (auth/Postgres/RLS) +
Tailwind CSS 4**. Design system **« crème & violet » (façon Duolingo)**.

Lucas ne peut pas coder de **6h à ~16h** (Europe/Paris). Sur ce créneau, **je
tiens la barre** : j'avance sur les priorités, je code, je vérifie, je commite.
Je n'attends jamais Lucas — je décide et j'agis. À son retour (~16h), il relit.

> **Deux cycles de travail par session.** Je tourne par fenêtres de tokens de
> ~5 h. Cycle 1 (lancé par Lucas) bosse jusqu'à épuiser sa fenêtre ; une relance
> headless automatique démarre le cycle 2. **Objectif : exploiter l'intégralité
> des tokens des DEUX fenêtres.**

**Ma boussole** : chaque session doit rendre l'appli *plus jouable, plus
complète, plus rapide* qu'hier. Pas de travail à moitié : ce que je touche, je
le finis et je le vérifie.

---

## 2. État réel du projet (à réactualiser)

**Dernière remise à plat : 2026-07-23** (Lia, `/jour` cycle 1), **après mesure
réelle à la clé anon** — les chiffres ci-dessous sont sondés, pas recopiés.

**Contenu mesuré le 2026-07-23** : **25 matières, 278 chapitres, 564 leçons**,
**295 quiz**. Répartition par classe (matières / chapitres) : 6e 15/29 ·
5e 18/40 · 4e 18/39 · 3e 19/40 · 2de 14/33 · 1re 17/44 · Tle 18/48.

⚠️ **5 matières sont des coquilles vides** (déclarées au catalogue, zéro
chapitre) : `allemand`, `arts-plastiques`, `grec`, `musique`, `sport` — toutes
posées par la migration 191. L'écran s'en sort proprement (« Le programme de X
en 6e arrive bientôt »), donc ce n'est pas un bug, mais **la migration 193 en
ajouterait 6 de plus** (`emc`, `snt`, `hlp`, `llcer-anglais`, `si`,
`maths-complementaires`) : on passerait à **11 matières sans contenu sur 31**.
C'est une décision de Lucas, pas une correction à faire à l'aveugle.

**Bonne nouvelle mesurée** : le vieux « levier n°1 » (la 6e trop pauvre) est
**réglé côté matières** — 15 au lieu de 5 — et **chaque classe a désormais au
moins un deck gratuit** (6e=2, toutes les autres=1), ce qui referme la
dégradation silencieuse du pool du Défi. Reste que la 6e est toujours la classe
la moins fournie en CHAPITRES (29).

Cours, cartes mentales, fiches de révision et quiz : **100 %** sur les matières
remplies. **Studygram : 0 %** — seul support vide, gated par une décision de
format (voir `docs/CADRAGE-STUDYGRAM.md`).

**Base de données : 001→194 créées. État SONDÉ à la clé anon le 2026-07-23** —
et il ne ressemble pas du tout à ce que ce document affirmait :

- **Exécutées (vérifiées)** : jusqu'à **191 inclus**, à l'exception de la 188.
  Notamment **179** (decks gratuits), **181/182** (cartes mentales — *le trou
  premium est FERMÉ*, `chapters.mind_map` répond « permission denied »),
  **183** (gemmes/parrainage/squad), **184/185** (fiches de révision, même motif
  correct), **186** (carnet), **187** (capacité), **189** (avatar), **190/191**
  (nouvelles matières).
- **NON exécutées** : **188** (tour guidé — `profiles.tutorial_completed`
  absente), **192** (économie/progression — `user_wallet`, `xp_events`,
  `gem_events`, `app_flags` absentes), **193** et **194** (écrites, jamais
  passées). **Prochaine à créer = `195`.**
- **Le code encaisse les deux absences sans casser** (vérifié ligne à ligne) :
  `tutorial_completed` est isolée dans sa propre requête, `fetchWallet` renvoie
  `null` si `user_wallet` manque, `defiEvents` retombe sur `[]`. Le tour guidé
  ne s'affiche simplement jamais et le portefeuille reste en XP dérivée.

⚠️ **Ne pas exécuter la 192 sans avoir déployé `15577ed`** (voir §9).

*Ancienne ligne, fausse depuis plusieurs jours : « 001→173 créées, 001→167
confirmées exécutées ». Leçon : **sonder, ne jamais recopier**.*

**Fonctionnel livré (l'essentiel)** :
- **Boucle cœur Réviser** : accueil « carnet violet », matières rangées en
  **dossiers repliables** (Programme / Hors programme), chapitres → leçon-hub
  multi-supports (cours, fiche, flashcards, quiz à correction immédiate, défi
  solo par niveaux), SRS + file « À revoir », examen blanc, contrôles à venir,
  bibliothèque de l'élève, Mon carnet de cours (chapitres, questions, révision).
- **Défi v3 « écran d'arène »** : HUD plein écran, salle de jeu `/defi/jouer`
  (Duel BO3, Blitz, Chrono, Survie, Boss, coop temps réel, classé), historique
  des duels, partie rapide par QR, camp d'entraînement, espace Jeux (salons 1v1
  par matière — **chaque jeu a désormais son propre gameplay**, dont
  « Anatomie express », 4e forme d'interaction : on désigne au lieu de choisir).
- **Social réel** : amis par code + QR, clans = écoles, classements, ligue
  hebdomadaire, tournoi des écoles, « en direct », squad, parrainage.
- **Moi v7 « miroir motivant »** : capacité/plafond, trajectoire au bac,
  leviers de la semaine, compagnon, avatar, débrief récompensé.
- **Trésor** (coffres/boutique/collection), **gemmes** (déblocage de chapitre,
  parrainage), **espace parents**, **onboarding v2** `/bienvenue`, PWA.

**Chantiers ouverts** : échelle géographique (cadrage `docs/CADRAGE-GEO.md`,
décisions D1-D4 requises) ; Studygram, salons 2v2, texte à trous, persistance du
défi solo (gated) ; perf navigation niveau 3 (remisé : exige
`cacheComponents: true`, session dédiée sur branche) ; **grading serveur des
quiz** — désormais chiffré, voir §9.

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

L'ordre vivant, détaillé et **estimé en tokens** est dans
**`_ASSOCIE/BACKLOG-JOUR.md`** — c'est la file que je consomme. Grandes lignes :

**P0 — L'arbre d'abord.** Un WIP non commité au réveil se relit à fond puis se
commite (jamais de commit non relu) avant toute nouvelle feature.

**P1 — Durcir le code neuf.** Revues de correctness par sous-agents sur les
commits récents non audités ; **chaque finding vérifié dans le code avant
fix** ; commit par lot vert. Méthode éprouvée : coût faible, valeur élevée.

**P2 — Demandes produit de Lucas (GO donné)** : célébration de palier
partageable (story) + échelle géographique ville→département→région→national
(cadrage d'abord). Détail dans la file.

**P3 — Chantiers gated** (décision de Lucas requise, ne pas coder à
l'aveugle) : Studygram, salons 2v2, texte à trous, persistance du défi solo,
compagnon.

**P4 — Polish & dettes UX** des écrans à fort trafic (Réviser, Défi, Moi),
puis scalabilité/perf (mesurer avant d'optimiser ; N+1, index, policies).

**Règle de choix** : je prends le plus fort levier **non gated** ; je ne saute
jamais sur du polish tant qu'une tâche P0/P1 reste faisable — sauf consigne de
Lucas (tête de `A-LIRE-JOUR.md` ou §9).

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
  je la crée et je signale à Lucas qu'il doit la lancer (il a un runner pg).
- **Dates** : jours = clés UTC `YYYY-MM-DD`, semaine lundi = index 0. Heures
  élève (trajet) en **Europe/Paris**. Helpers dans `lib/time.ts`.
- **UI 100 % français** (textes, labels, erreurs).
- **Design « crème & violet » (façon Duolingo)** : tokens sémantiques de
  `globals.css` — fond **crème** `--background`, encre marine douce
  `--foreground`, **violet** `primary` = action/marque, **jaune solaire**
  `highlight`/`accent` = progression/récompense/XP, corail `destructive` =
  alertes, flamme ambre→orange = série uniquement. Typo **Nunito** (corps) +
  **Baloo 2** (titres). Mondes scopés : `.rev-*` (Réviser), `.moi-*` (Moi),
  `.onb-*` (onboarding), arène Défi en violet profond (`.defi-arena-bg`).
  **Pas de hex en dur** hors flamme. Mode sombre neutralisé
  (`<html class="light">`).
- **Accessibilité & tactile** : cibles ≥ 44px, focus visibles, contrastes OK.

---

## 6. Comment je travaille avec Claude Code (méthode)

1. **Cadrer avant de coder** : je relis §2/§4, je choisis UNE cible nette et
   finissable, je la découpe.
2. **Re-mesurer le contenu si besoin** — script anon Supabase (lit
   `NEXT_PUBLIC_SUPABASE_*` de `.env.local`). La base étant à jour, la mesure
   est fiable.
3. **Naviguer via le graphe, pas en fouillant.** Pour localiser du code (« où
   est géré X », « qui appelle Y »), j'interroge d'abord le graphe graphify :
   `& (Get-Content graphify-out\.graphify_python) -m graphify query "ma question"`.
   Il se rafraîchit seul après chaque commit. Détails : `CLAUDE.md`.
4. **Coder à la manière du code environnant** (nommage, idiomes, densité de
   commentaires). Réutiliser l'existant plutôt que réinventer.
5. **Vérifier systématiquement avant de commiter** :
   `npm run typecheck` · `npm run lint` · `npm test`. Zéro rouge.
6. **Commiter par lots cohérents**, message en français, style des commits
   récents.
7. **Tenir un journal** au fil de l'eau.
8. **Ne jamais rester bloqué** : si une piste coince, je bascule sur la
   suivante du backlog plutôt que d'attendre.

---

## 7. Garde-fous (ce que je ne fais pas)

- **`/matin` : jamais de commit direct sur `main`** (branche `agent/matin-*`).
  **`/jour` : commits directs sur `main` autorisés, mais toujours verts.**
- **Jamais exécuter de migration Supabase** ni toucher aux données de prod.
- **Jamais supprimer/écraser** du contenu existant sans certitude ; en cas de
  doute, je le signale au lieu d'agir.
- **Jamais de secret** en dur ni committé.
- **Jamais publier / envoyer** quoi que ce soit vers l'extérieur.
- **Pas de `git push --force`, pas de reset destructif.**
- Si une action est irréversible ou ambiguë : je la **note pour Lucas** et je
  continue sur autre chose.

---

## 8. Rituel & récap

- Je commence par relire ce fichier + la consigne de Lucas (tête de
  `A-LIRE-JOUR.md` ou §9), puis la file `_ASSOCIE/BACKLOG-JOUR.md`.
- À la fin (fin de fenêtre de tokens, ~20 min de marge), ma sortie humaine est
  **`_ASSOCIE/A-LIRE-JOUR.md`** (le seul écran que Lucas regarde : fait /
  recommandations GO / bloqueurs / prochaine cible). J'archive une entrée datée
  dans **`_ASSOCIE/JOURNAL.md`**, je mets à jour la file, et ici §2 + §9.

---

## 9. Note de passation (dernier ↔ prochain cycle)

<!-- L'agent écrit ici en fin de session : où j'en suis, prochaine cible,
     pièges. Lucas peut y déposer une consigne du jour. Les anciennes notes
     (2026-07-12 → 2026-07-16) sont dans le git log de ce fichier. -->

**2026-07-23 — fin du cycle 1 `/jour` (Lia) :**
- **Réveil sur un arbre sale** (~2 700 lignes non relues laissées par trois jours
  de sessions interactives) → P0 = 4 revues sous-agents, findings vérifiés un par
  un, puis **6 lots verts**. Ensuite **4 audits** de zones jamais relues.
  **12 commits**, tous `typecheck` + `lint` + `test` + `next build` verts,
  **poussés sur `origin/main`** (dernier `f4c1c49`, 1145 tests).
- **⚠️ BLOQUEUR N°1 À VÉRIFIER — les duels en direct sont peut-être MORTS en
  prod.** Le commit `0ba384a` (20/07) a basculé `useLiveDuel` et `useCoop` en
  `config: { private: true }`. Sur un canal privé **sans policies**, Supabase
  refuse TOUTES les souscriptions. Or la migration `178` qui pose ces policies a
  connu un échec (`c8b762c` la corrige) et je **n'ai pas pu vérifier son état à
  la clé anon** (les policies `realtime.messages` ne sont pas sondables ainsi).
  **Test à faire à deux comptes : lancer un duel.** Si ça ne marche pas, exécuter
  la `178` — c'est l'ordre inverse des autres migrations.
- **⚠️ NE PAS EXÉCUTER LA 192 telle qu'elle était.** L'audit économie a sorti un
  trou : `wallet_award_xp` est `GRANT EXECUTE TO authenticated`, la clé anon est
  publique, et le montant de `defi_arena` était **fourni par l'appelant**
  (clampé à 600, 30 fois/jour = **18 000 XP/jour fabriqués sans jouer**, plus les
  gemmes de niveau). **Corrigé sur place** (`15577ed`) : le montant est relu sur
  la session d'arène désignée par la clé. C'était légitime parce que **la 192
  n'a jamais été exécutée** (sondé) — la règle « ne jamais modifier une migration
  déjà exécutée » ne s'appliquait pas.
- **Trou économique qui reste OUVERT, et qui est une décision de Lucas** : la
  migration `183` étant passée, `referral_activation_trigger` se déclenche sur
  **n'importe quel** INSERT dans `test_sessions` — table dont la policy autorise
  l'écriture directe (`auth.uid() = user_id`). Un faux compte + un
  `insert({score:1,total:1})` suffit donc à activer un parrainage : **+30 💎 au
  parrain et au filleul, sans avoir rien révisé** (borné à 600 💎 par le cap).
  Je ne l'ai **pas** colmaté : le seul vrai correctif est le **grading serveur
  des quiz**, déjà en attente d'arbitrage depuis le 18/07, et un demi-correctif
  (exiger `quiz_id` + `total >= 3`) n'ajoute que deux lignes au script d'un
  attaquant tout en risquant de casser une activation légitime. **Ce trou est le
  chiffrage concret qui manquait à cette décision.**
- **Piège confirmé une 3e fois — le « site oublié ».** La migration 185 a révoqué
  `lessons.revision_sheet`, et un site de lecture avait échappé au balayage :
  `app/admin/matiere/[id]/page.tsx` nommait la colonne dans une **jointure
  imbriquée** `lessons(...)`. Résultat, **en production depuis le 20/07** : le
  Studio affichait **0 chapitre pour toutes les matières**, sans un mot (l'erreur
  n'était pas testée, `data` retombait à `null`). Corrigé (`6e64596`). Le
  changelog du commit d'origine annonçait 4 sites ; il y en avait 6. **Un plan
  qui énumère des sites n'est pas une mesure — re-balayer soi-même, jointures
  imbriquées comprises.** Et : être admin **côté application** ne contourne pas
  un `GRANT` Postgres, qui s'applique au RÔLE.
- **Contenu re-mesuré (sondé, pas recopié)** : le vieux « levier n°1 » (6e trop
  pauvre) est réglé côté matières (15 au lieu de 5) et **chaque classe a enfin un
  deck gratuit**. Mais **5 matières sont des coquilles vides** (0 chapitre) et la
  **193 en ajouterait 6 de plus** → 11 sur 31. Décision de Lucas.
- **Cycle 2 démarré en avance (demande de Lucas), + un cycle 3 armé à 16:10.**
  Le mécanisme ne prévoyait que 2 cycles (`relance-jour.cmd` pose
  `JOUR_CYCLE=2` = « ne ré-arme rien ») : le cycle 3 a donc ses propres fichiers
  (`_ASSOCIE/relance-jour-cycle3.cmd`, `armer-relance-jour-cycle3.ps1`), et son
  heure est **lue sur la tâche du cycle 2** plutôt que recalculée.
- **Espace Jeux audité (cycle 2, `c393d9b`) — en MESURANT.** Un agent a construit
  une partie de chaque jeu (graine fixe) au lieu de lire le code. C'est ce qui a
  révélé qu'**il y a 17 jeux et non 13**, et surtout que **2 d'entre eux ne
  peuvent jamais se terminer** : la mécanique `ascension` n'a ni vies ni chrono
  global, et `run.ts` ne renvoyait jamais `lost` — le message de défaite de ces
  jeux était du code mort. **Leçon : sur du gameplay, simuler bat relire.**
- **Le garde-fou qui ne gardait rien.** Le test de cohérence des banques
  vérifiait un plancher **constant** de 10 questions, jamais la consommation
  réelle : vert depuis toujours pendant que `POOL_BUILDERS` tronquait les
  banques. Même famille de piège que le `REVOKE` par colonne et que le plan qui
  énumère 4 sites quand il y en a 6. **Un test qui ne peut pas échouer n'est pas
  un test.**
- **Piège de langage à retenir** : `manque > dette ?? 0` se parse
  `(manque > dette) ?? 0` — `??` a une précédence PLUS BASSE que `>`. Le contrôle
  était désactivé exactement là où il servait. Toujours parenthéser, et toujours
  vérifier qu'un nouveau garde-fou ÉCHOUE quand on lui retire sa raison d'être.
- **Prochaine cible** : rembourser la **dette de banque (34 questions**, chiffres
  exacts dans `DETTE_DE_BANQUE`), puis les suites d'audit listées dans
  `_ASSOCIE/BACKLOG-JOUR.md` (écran de fin qui ment, XP affichée ≠ versée, crons
  push en UTC). Levier produit inchangé : **le contenu des 5 matières vides**.

**2026-07-20 — fin du cycle 2 `/jour` (Lia) :**
- **Fait** : la **P0 laissée par le cycle 1 est fermée** (`4c4396e`) — le contenu
  payant des cartes mentales n'est plus lisible par requête directe. Puis la file
  « quiz & flashcards » **entièrement consommée** (6 lots), le duel en direct
  débloqué, le motif ARIA des onglets complété, et **2 revues sous-agents sur mon
  propre travail du jour**. **11 commits verts** (dernier `fa01717`),
  typecheck/lint/**844 tests**/build prod. Migrations **181** et **182** créées.
- **⚠️ PIÈGE MAJEUR — à retenir pour toute future révocation de colonne.** Le
  plan (écrit par le cycle 1) prévoyait `REVOKE SELECT (mind_map) ON chapters`.
  **Ça n'aurait rien protégé** : Supabase accorde `SELECT` au niveau **TABLE** à
  `anon`/`authenticated`, et un retrait de droit par COLONNE ne rogne pas un
  droit accordé sur la TABLE. La migration serait passée **verte sans rien
  fermer** — le pire scénario possible, une faille qu'on croit corrigée. Le bon
  motif : `REVOKE SELECT ON <table>` puis `GRANT SELECT (colonnes publiques)`.
- **Autre piège** : un plan qui énumère les sites à corriger n'est pas une
  mesure. Le plan listait 4 `select('*')` sur `chapters` ; il y en avait **5** —
  la jointure imbriquée `chapters!inner(*)` du hub de leçon échappe à un grep
  naïf sur `from('chapters')`. **Toujours re-balayer soi-même**, y compris les
  jointures PostgREST imbriquées.
- **Défaut que j'ai failli introduire**, attrapé en le codant : le rejeu des
  seules erreurs d'un quiz allait être enregistré comme une session normale — or
  `lib/mastery.ts` agrège le **MEILLEUR ratio par quiz**, donc un 2/2 sur les
  questions ratées aurait fait passer le chapitre « maîtrisé » (couronne
  comprise) alors que l'élève avait fait 8/10. **Réflexe à garder** : avant
  d'enregistrer une session d'un type nouveau, se demander ce que les agrégats
  existants (maîtrise, XP, ligue, série) vont en faire.
- **Leçon de méthode reconfirmée** : les revues sous-agents sur MON PROPRE
  travail du jour ont sorti 1 HIGH (un message qui promettait une reprogrammation
  SRS jamais effectuée) **et un défaut préexistant** — `advance()` sans verrou
  anti-double-tap dans `QuizPlayer` alors que `choose()` et `finish()` en ont un,
  désalignant `choices[i]`/`questions[i]` pour toute la session. Elles ont aussi
  pointé deux angles morts de couverture, comblés (`7bd276a`, `89b3f42`).
- **Prochaine cible** : la file explicite non gated est **vide**. Zones jamais
  auditées en profondeur restantes : **notifications push**, **studio de contenu**
  côté correctness, **funnel onboarding → paiement**. Idée neuve à instruire :
  aucun test ne couvre les 3 players eux-mêmes (toute la logique pure est testée,
  l'assemblage non) — or les défauts trouvés aujourd'hui étaient TOUS des défauts
  d'assemblage ; installer `@testing-library/react` demande l'accord de Lucas.
  Levier produit n°1 mesuré, inchangé : **le contenu de 6e**.

**2026-07-20 — fin du cycle 1 `/jour` (Lia) :**
- **Fait** : réveil **sur un arbre sale** (~2900 lignes non commitées et non
  relues laissées par la session interactive) → P0 = 5 revues sous-agents puis
  5 lots verts, suivis de 4 autres commits. **9 commits** (dernier `b55f6e9`),
  typecheck/lint/774 tests/build + smoke HTTP. Points forts : **incohérence de
  paliers fermée** (`8bd76f8` — « Bronze III » vs « Salle d'étude » pour le même
  total ; ancienne échelle SUPPRIMÉE de `lib/trophies.ts` pour qu'il n'en reste
  qu'une), modèle de carte mentale qui ne s'affichait jamais (`af73c10`),
  rétrospective /moi incohérente avec ses propres heatmaps (`00f2a8a`), perf
  `/moi` (`8580e32`), a11y Coffre (`a17a855`). **Migration 176 créée.**
- **Piège que je me suis infligé — à retenir** : en ajoutant l'en-tête
  `x-pathname` dans `proxy.ts` (`69ac0fb`), j'ai capturé
  `new Headers(request.headers)` **une seule fois, avant** le callback `setAll`
  des cookies. Or `request.cookies.set()` met à jour l'en-tête `cookie` : le
  rendu recevait l'ANCIEN cookie sur la requête qui rafraîchit le jeton →
  déconnexion passagère possible. **Ne JAMAIS figer les en-têtes dans ce
  proxy** : les reconstruire à chaque usage (corrigé en `b55f6e9`). C'est une
  revue de mon PROPRE travail qui l'a fait sortir — garder ce réflexe.
- **Prochaine cible** : onboarding `/bienvenue` (focus au changement d'écran +
  sémantique `radiogroup`), dernier item non gated, demande une QA visuelle sur
  les 14 écrans. Ensuite la file non gated est VIDE → il faut une décision de
  Lucas. Deux décisions produit neuves l'attendent (cf. `A-LIRE-JOUR.md`) :
  fêter ou non les changements de **division** (aujourd'hui seuls les paliers le
  sont), et appliquer ou non côté serveur la règle « seul le n°1 renomme le
  groupe » (impact réel nul, `squad_name` est personnel).
- **Autre piège du jour** : `emptyContent()` ne peut PAS servir à amorcer un
  contenu d'édition — la page d'édition normalise au chargement et retire
  justement les formes vides. Tout « modèle » visible doit vivre côté édition
  (`carteWithModel`).
- **Leçon de méthode confirmée** : quand la file explicite est vide, l'audit de
  zones sous-auditées reste la source de valeur n°1. Trois défauts RÉELS sortis
  du seul cœur pédagogique, tous **silencieux** (aucune exception, aucun test
  rouge) : SRS avançable sans échéance (`6ae70d2` — J+1→J+35 en une session de
  grind, la « répétition espacée » n'espaçait plus), `test_sessions` sans borne
  en base (`cd9d0c6`, migration 177), file « À revoir » tronquée sans tri
  (`9d79219`). **Réflexe à garder** : quand une table jumelle reçoit un
  durcissement (165 sur `challenge_sessions`), vérifier SYSTÉMATIQUEMENT les
  tables de même forme — c'est comme ça que la 177 est sortie.
- **P0 laissé au prochain cycle (à faire d'un bloc)** : les cartes mentales
  restent lisibles par requête directe (`chapters` en RLS `USING (true)`). La
  moitié applicative est fermée (`6fafd33`, leurre au lieu du contenu flouté),
  mais le correctif complet est une migration `179` (REVOKE de la colonne +
  `has_mind_map` généré + RPC `SECURITY DEFINER`) qui **casse Réviser si elle est
  exécutée avant le changement de code** : 4 requêtes font `select('*')` sur
  `chapters` et un `*` renverrait « permission denied ». Plan ordonné dans
  `_ASSOCIE/BACKLOG-JOUR.md`. **Ne pas écrire la 179 sans faire d'abord les
  colonnes explicites.**
- **Zones auditées et déclarées SAINES le 2026-07-20** (ne pas les ré-auditer au
  prochain cycle, c'est du budget perdu) : **studio/admin** (le gate n'est pas
  qu'une page — chaque table du catalogue porte une policy `FOR ALL USING
  (is_admin())`, donc un élève ne peut pas écrire le contenu par requête
  directe ; `is_admin` est absent de TOUS les `GRANT UPDATE` par colonnes, sur 8
  migrations — revérifié à la main) et **push/PWA** (clé VAPID privée seulement
  dans le Route Handler serveur, endpoint d'envoi protégé par `CRON_SECRET` en
  comparaison à temps constant, RLS « soi uniquement » sur `push_subscriptions`).
  Vérifié aussi au passage : **aucun `dangerouslySetInnerHTML` dans le dépôt**.
- **Écarté volontairement, décision de Lucas** : l'espace parents (offre Famille
  à 9,99 €) n'a AUCUN contrôle d'abonnement — seulement un contrôle de rôle.
  Verrouiller une page aujourd'hui gratuite est un choix produit/business, pas
  une correction de bug ; et le gate devrait être posé côté page ET côté RPC
  (`child_dashboard`, `parent_children_overview`) pour ne pas être contournable.
- **Écarté volontairement, décision de Lucas** : la maîtrise agrège par
  `Math.max` (« meilleur score par quiz », choix assumé et commenté) donc ne
  redescend jamais. Ce n'est pas clairement un bug — l'oubli est déjà géré par le
  SRS, et faire disparaître des couronnes acquises est un changement produit
  visible. Ne PAS le « corriger » à l'aveugle au prochain cycle.

**2026-07-18 — fin du cycle 2 `/jour` (Lia) :**
- **Fait** : file explicite déjà épuisée (cycle 1) → **6 revues sous-agents** sur
  zones sous-auditées, findings vérifiés en code. **8 commits verts** (dernier
  `9a20de8`, typecheck/lint/704 + build ×2). Points forts : **faille de
  confidentialité fermée** (`30017e8`, **migration 172** : `link_child_by_code`
  laissait un élève espionner un camarade via son code ami) ; **robustesse selects
  groupés** (`f20a539` : colonnes de migration tardive isolées sur `defi` +
  `reviser`, sinon la page casse pendant la fenêtre de migration manuelle) ; **4
  correctifs onboarding J1** (`9a20de8`) ; perf pages chaudes (`613ee91`) ;
  anti-double-tap flashcards (`07d02c2`) ; a11y (`5cff5ae`) ; rate-limit
  `add_friend_by_code` (`e7b4ace`, **migration 173**). Correctness/sécurité :
  arènes + 8 miroirs SQL↔app cohérents, admin/onboarding/auth **sains**.
- **Prochaine cible** : rien de non gated ne reste dans la file ; le code neuf est
  audité en profondeur. Restent des **décisions produit** (grading serveur des
  quiz — conflit design « correction immédiate » ; `apply_ranked_match` jeton ;
  géo D1-D4 ; Studygram ; 2v2 ; texte à trous) et des **items à QA visuelle**
  (focus onboarding au changement d'écran, sémantiques ARIA radiogroup/tablist,
  perf `syncAutoHabits` de /moi). Débloquer une décision → coder l'item.
- **Pièges du cycle** : 172 dépend de 048 (`profile_type`) ET 169
  (`friend_lookup_allowed`) ; 173 dépend de 019 ET 169 → exécuter 169 avant/avec.
  La garde 172 refuse le NÉGATIF (`profile_type='eleve'`) pour ne PAS casser un
  vrai parent (`'parent'`/NULL) sur une feature PAYANTE ; un gate positif
  (`='parent'`) est possible si tu confirmes que tous les comptes parents portent
  `'parent'`. Le finding « grading quiz » ne se corrige PAS à l'aveugle : masquer
  `correct_index` casse la correction immédiate.

**2026-07-18 — fin du cycle 1 `/jour` (Lia) :**
- **Fait** : durcissement des deux gros commits récents non audités. `b63d14d`
  (2185 l.) — 2 revues sous-agents : économie coffre SAINE, 2 findings MEDIUM
  corrigés (`92eeceb` : ArenaHud `image`, examen ciblé). `60b17c1` (« Mes notes »,
  167) — 2 revues : SAIN, 0 fix. P1b assets (`45151e4`). **3 migrations
  créées 168/169/170 À EXÉCUTER** (tirage coffre SQL / rate-limit amis / borne
  série). Bonus `ded28dd` (coffre déjà-ouvert vs panne). 6 commits verts, dernier
  `ded28dd`. Détail : `_ASSOCIE/A-LIRE-JOUR.md`.
- **Prochaine cible** : la file explicite + les 3 idées neuves non gated sont
  épuisées. Reste du GATED en attente de décisions Lucas (géo D1-D4, swipe
  sous-onglets, Studygram, 2v2, texte à trous, persistance défi solo, rename
  Trésor) et la perf nav niveau 3 (remisée, branche dédiée). **Décision produit
  ouverte** : nav Défi décentré depuis l'ajout de l'onglet Coffre (6 onglets →
  Défi à 58 %) — réordonner vs FAB overlay.
- **Pièges du jour** : 168 **supprime `open_chest(JSONB)`** — la Server Action
  `openDailyChest` bascule sur `open_chest_v2` (repli PGRST202 avant exécution) ;
  le tirage SQL est un MIROIR de `CHEST_REWARDS`+`c1..c8` (lib/tresor.ts). 169
  passe `friend_preview` de sql STABLE à plpgsql VOLATILE et re-crée
  `add_friend_qr` (fidèle à 163) — si la liste des statuts d'`add_friend_qr`
  change, re-vérifier. 170 est un miroir d'`activityCutoff` (400 j).
- **Passe « incohérences » (à la demande de Lucas)** : 3 analyses sous-agents
  (autorité économie / dérive miroirs SQL↔app / cohérence boucle cœur). Résultats :
  **migration 171** (4 RPC créditrices durcies, dont `apply_ranked_match`
  CRITIQUE) ; **échelle d'arènes unifiée** (`f8d6635` : `lib/defi/arena.ts`
  supprimé, `TrophyBlock` pointe sur `lib/trophies.ts` — l'écran Arène et l'écran
  classé montraient des noms de paliers DIFFÉRENTS pour un même total) ; commentaire
  seuils exam-blanc corrigé (`851000f`). Miroirs SQL↔app tous cohérents. Reste
  ouvert (signalé) : le VRAI correctif d'`apply_ranked_match` = jeton de match
  serveur (refonte du flux `/defi/jouer` + QA) ; la 171 ne fait que BORNER le
  rythme (30/h).

**2026-07-17 — fin du cycle 1 `/jour` (Lia) :**
- **Fait** : P0 WIP commité, P1 durci par 8 revues (fixes + migrations
  164/165/166 **à faire exécuter**), P2 célébration de palier livrée +
  cadrage géo + `lib/geo`, P4 toast, perf pages chaudes, fixes onboarding
  (boutons OAuth morts). 14 commits verts sur `main`, dernier `ad5649f`.
  Détail : `_ASSOCIE/A-LIRE-JOUR.md` + `_ASSOCIE/JOURNAL.md`.
- **Cycle 2 (relance ~11h01)** : prendre les décisions de Lucas arrivées
  entre-temps (D1-D4 géo, GO des recommandations), sinon les idées neuves en
  bas de `_ASSOCIE/BACKLOG-JOUR.md` (tirage coffre SQL ~M est le meilleur
  levier sans décision), et rien d'autre du P3 gated.
- **Pièges du jour** : la 166 ÉCRASE `school_tournament_standings` de la 164
  (garde NULL conservée — exécuter 164→165→166 dans l'ordre) ; la rotation
  des boss est dupliquée en SQL (165) — tout changement de `ALL_BOSSES` exige
  une migration miroir ; `data-no-swipe` est LE mécanisme pour protéger un
  écran d'activité du swipe d'onglets (posé sur QuizPlayer + 4 salles).

**Pièges durables (leçons des cycles passés — à garder en tête) :**
- **Jamais commiter du code non relu** : un WIP au réveil se relit à fond
  (+ revue sous-agent si gros) avant commit. `git add` toujours ciblé, jamais
  `git add .`.
- **Colonne dépendant d'une migration pas encore passée** : l'isoler dans SA
  propre requête `.select()`, jamais dans le select groupé du profil (sinon
  toute la page casse). Modèle : `avatar`/082, `oral_texts`/156.
- **Feature « déjà à moitié là »** : investiguer l'existant AVANT de coder
  (ex. compagnon : rename + accessoires existaient déjà).
- **Double-tap dans les players** : verrou synchrone `useRef` (le state est en
  retard d'un rendu). En temps réel : fix défensif seulement, pas de refonte
  de sync sans QA.
- Lint `react-hooks/set-state-in-effect` : resync sur une prop = ajuster
  l'état **pendant le rendu** (comparer à la prop précédente), pas d'effet.
  `Math.random()` interdit au render → `seededRng`/dérivation par index.
- Nouveau `layout.tsx` → `npx next typegen` avant `tsc`.
- **RPC déjà en prod à corriger** : garder la même signature, neutraliser le
  paramètre dangereux (modèle 088 `buy_shop_item`).
- **`armer-relance-jour.ps1` souvent refusé** par le classifieur de
  permissions → si le cycle 2 ne s'arme pas, le noter dans `A-LIRE-JOUR.md` ;
  Lucas relancera `/jour` à la main.
- Un autre agent peut committer sur `main` en parallèle → relire ce fichier
  juste avant de l'éditer, commits ciblés.
