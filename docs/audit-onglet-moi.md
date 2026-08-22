# Audit de l'onglet Moi — le dernier onglet à droite

_19 août 2026. Analyse faite au code et au schéma (pas de compte de test : la vue
connectée n'a pas pu être ouverte, cf. §7)._

---

## 1. Ce que l'onglet est aujourd'hui

`app/moi/page.tsx` (475 lignes, `force-dynamic`, ~16 requêtes en une vague) rend
**cinq blocs dans un seul scroll** :

| # | Bloc | Fichier | Ce qu'il montre | Condition d'affichage |
|---|------|---------|-----------------|----------------------|
| 1 | Panneau d'identité | `components/moi/PanneauIdentite.tsx` | avatar (→ vestiaire), prénom, classe, **rang de travail**, ligne de classement (assiduité), puis 3 preuves : série + record, temps cumulé + tendance, moyenne + delta | toujours |
| 2 | Historique de travail | `HistoriqueTravail.tsx` | la vague du temps travaillé + sélecteur semaine/mois/3 mois/année | migration **084** (`work_daily`) présente |
| 3 | La matière du moment | `MatiereDuMomentCard.tsx` | UNE matière désignée, sa raison en faits, 2 boutons | au moins un chapitre commencé |
| 4 | Habitudes | `HabitudesCard.tsx` | les leviers du jour + le bilan (→ `/moi/habitudes`) | toujours |
| 5 | Trajectoire au bac | `TrajectoryCard.tsx` | projection deux futurs | des notes saisies |

Deux sous-pages : `/moi/avatar` (vestiaire) et `/moi/habitudes` (catalogue,
capacité, plafond).

**Sorties de l'onglet** : `/moi/avatar`, `/moi/habitudes`, `/reviser/<matière>`,
le tableau Progrès de Marcel. C'est tout.

---

## 2. Diagnostic — six constats

### A. L'onglet promet une identité et livre un bulletin

Son icône est **le visage de l'élève**, entouré d'une couronne de laurier. C'est
le seul onglet dont l'icône change d'un élève à l'autre. Il s'appelle « Moi ».

Ce qu'il contient est un **rapport de travail**. Le profil de joueur —
pseudo, bannière, badges, statistiques de duel, blason — existe bel et bien dans
l'app, mais **il vit dans une modale de `/defi`** (`components/defi/ProfileModal.tsx`,
alimentée par `app/defi/profile-actions.ts`). L'onglet qui porte la figure de
l'élève ne porte pas son profil.

### B. Deux systèmes de niveau, tous les deux appelés « niveau »

- `/moi` affiche `workLevel(work_seconds)` → « Assidu · niveau 5 », barre de
  progression en heures (`lib/work-level.ts`, 11 paliers Recrue → Légende).
- Le bandeau du haut, sur **tous** les écrans, affiche le niveau d'XP →
  « Niveau 6 · 2 055 / 2 100 XP » (`lib/xp.ts`, `user_wallet`).

Même mot, même forme (un nombre + une barre), deux échelles sans rapport, à
l'écran **en même temps** sur `/moi`. C'est le défaut le plus coûteux de
l'onglet : il apprend à l'élève que le mot « niveau » ne veut rien dire.

Même schisme, en plus discret, sur le **classement** (`/moi` traduit
l'assiduité, `/defi` les trophées — même RPC `my_grade_standings`) et sur
l'**identité** (prénom ici, pseudo de jeu là-bas).

### C. Il est vide les deux premières semaines

Trois blocs sur cinq sont conditionnels, et les trois conditions sont
exactement celles qu'un élève neuf ne remplit pas : pas de journal de travail,
pas de chapitre commencé, pas de notes saisies.

Un compte de moins d'une semaine voit donc **deux blocs** : le panneau (série 0,
temps 0, moyenne « — ») et les habitudes. La décision « pas d'état vide » prise
à la refonte du 6 août est juste — une carte qui ne dit rien vaut moins que rien
— mais **rien n'a été mis à la place**, et un onglet à deux blocs se lit comme
un chantier.

### D. Il ne dit rien de ce que l'élève possède ni de ce qu'il a gagné

Tout ceci existe en base, est déjà calculé, et n'apparaît nulle part sur `/moi` :

| Donnée | Table / module | Où c'est aujourd'hui |
|---|---|---|
| Trophées par (matière × jeu) | `game_trophies`, `subject_peaks`, `lib/trophy-road` | Route des trophées, dans le HUD de `/defi` |
| Rang par matière (blason, division) | `lib/subject-rank` | idem |
| Badges gagnés / à gagner | `badges`, `user_badges` | modale de `/defi` |
| Duels joués, gagnés, ratio, meilleure série | `game_matches`, `ranked_matches`, `lib/profile-stats` | modale de `/defi` |
| Boss vaincus, revanches | `boss_gauges`, `revanche_clears` | `/defi` |
| Collection, cosmétiques, compagnons | `avatar_items`, `library_items`, `collection_unlocks` | `/tresor` |
| Saison, pass, réclamations | `season_progress`, `season_claims` | `/defi` |
| Écus, cristaux, coffres | `user_wallet`, `chest_opens` | bandeau + `/tresor` |
| Clan, contribution de la semaine | `squad_members`, `clan_week_contributions` | `/amis` |

Le profil est **la seule page où ces choses ont un sens rassemblées** : c'est là
qu'on va voir ce qu'on est devenu. Éparpillées, elles ne racontent rien.

### E. Il ne regarde que derrière

Aucune échéance à l'écran, alors que la matière première est là :
`controles` (contrôles déclarés), `sessions_preparation` (le plan de révision),
`exam_papers` + `lib/exams.ts` (les épreuves du bac / brevet, session 2026, avec
leurs dates). Un miroir qui ne montre que le passé n'appelle aucune action ; il
manque le « dans 12 jours, épreuve d'histoire-géo ».

### F. Fragilités techniques

- **La ligne de classement peut être absente en silence.** Elle dépend de la
  migration **223** ; `lib/sante.ts` le dit explicitement, et `parseGradeStandings`
  avale ce qu'elle ne comprend pas. À vérifier en prod.
- **`/moi/avatar` peut être une page vide** si la migration **189** n'est pas
  passée (même source). La porte du vestiaire est pourtant le geste le plus
  visible du panneau (le crayon sur l'avatar).
- **La saisie de moyennes** est désactivée sans la **187**.
- `components/CompagnonCard.tsx` est **du code mort** : plus aucun écran ne
  l'importe (le compagnon ne survit que par `StreakMascot` + `lib/compagnon`).
- ~16 requêtes en parallèle à chaque visite, sans cache — c'est aujourd'hui la
  page la plus lourde de l'app côté base.

---

## 3. La décision de fond

**Faire de `/moi` le PROFIL, et y ranger le bulletin comme une de ses sections.**

Ce n'est pas un renommage : c'est rapatrier la modale de `/defi` ici, et laisser
sur l'arène ce qui appartient à l'arène (la carte-pastille en haut à gauche
reste, elle ouvre `/moi` au lieu d'une modale).

Trois raisons :

1. **La convention est déjà dans la tête de l'élève.** Clash Royale, Brawl
   Stars, Duolingo : l'onglet à l'extrême droite avec le visage, c'est le profil,
   et le profil contient les réglages. L'app suit ce modèle partout ailleurs (la
   nav a été rangée « comme Clash Royale » exprès) — sauf ici.
2. **Un profil de jeu enfermé dans une modale ne se visite pas.** Une modale
   n'a pas d'URL, pas de retour arrière, pas de partage ; personne n'y va « pour
   voir ».
3. **C'est le seul endroit où la vue transversale est possible.** `/reviser`
   voit une matière à la fois, `/defi` voit les trophées, Marcel voit les
   chapitres. Personne ne voit **l'élève**.

---

## 4. Les fonctionnalités, par ordre de valeur

### P1 — l'onglet devient cohérent (aucune nouvelle donnée à produire)

1. **Un seul niveau.** Le niveau d'XP gagne (il est déjà partout, dans le
   bandeau). Le rang de travail garde son titre — « Assidu », « Bosseur » — mais
   perd son numéro et sa barre : il devient un **titre porté sous le pseudo**, pas
   un second compteur. _Coût : petit. Gain : le mot « niveau » redevient
   univoque._
2. **L'en-tête de profil monte sur `/moi`** : bannière + avatar + pseudo (ou
   prénom) + classe + école + 3 badges mis en avant + le crayon d'édition. Tout
   le code existe (`ProfileModal`, `ProfileEditor`, `profile-actions`).
3. **L'engrenage sur le profil** → `/compte`. Il n'est aujourd'hui accessible que
   par le bandeau du haut. Au passage, `/compte` est resté une carte shadcn brute
   (abonnement, classe, notifications, espace parents, tutoriel, déconnexion) :
   c'est le dernier écran de l'app qui n'a pas eu la passe de DA.
4. **« Ce qui vient »** — un bandeau au-dessus du pli : prochain contrôle
   déclaré, prochaine épreuve d'examen, compte à rebours. Données déjà en base
   (`controles`, `sessions_preparation`, `exam_papers`).

### P2 — l'onglet devient une destination

5. **« Mes matières » — le tableau transversal.** Une ligne par matière :
   blason + division, trophées, % du programme, moyenne scolaire. C'est la
   synthèse que personne ne donne, et elle n'est **devenue possible que la
   semaine dernière**, avec le rang cloisonné par matière (`lib/subject-rank`,
   migrations 238/239). Une ligne mène à la matière, une autre au duel.
6. **La vitrine.** Badges (acquis / à acquérir, avec la condition en clair),
   bannières, compagnons et skins possédés, taux de complétion de la collection.
   C'est le moteur de rétention que Supercell met toujours dans le profil, et il
   pousse mécaniquement vers `/tresor`.
7. **Mes duels.** Parties jouées, ratio de victoires, meilleure série, matière
   préférée — `lib/profile-stats` les calcule déjà, `StatDashboard` les dessine
   déjà.

### P3 — l'onglet devient partageable

8. **Le bilan de la semaine, en image.** `components/story-share.ts` existe et
   fonctionne (il sert déjà la bulle de classement). Un bilan « ma semaine » —
   série, temps, matière montée — est le seul contenu de l'app qu'un élève a
   envie de montrer.
9. **L'objectif quotidien éditable ici.** `profiles.daily_goal` ne se règle
   aujourd'hui que dans l'onboarding ; c'est un réglage de profil.
10. **Un état vide qui vaut quelque chose** pour les 7 premiers jours : les trois
    preuves à zéro sont une promesse, pas une honte — les afficher avec leur
    premier palier (« 3 jours d'affilée → ton premier badge ») remplace les trois
    blocs absents.

### Ménage

11. Supprimer `components/CompagnonCard.tsx` (mort).
12. Vérifier en prod l'état des migrations **223**, **189**, **187** — trois
    fonctions de `/moi` s'éteignent en silence sans elles.
13. Mettre en cache ce qui peut l'être dans la vague de 16 requêtes (le
    catalogue l'est déjà ; la maîtrise et les chapitres vus ne le sont pas).

---

## 5. Ordre de chantier proposé

| Lot | Contenu | Migration ? |
|---|---|---|
| **1** | Un seul niveau + en-tête de profil rapatriée + engrenage → `/compte` | non |
| **2** | « Ce qui vient » (échéances) | non |
| **3** | « Mes matières » (tableau transversal) | non (238/239 suffisent) |
| **4** | La vitrine (badges + collection) + « Mes duels » | non |
| **5** | Passe de DA sur `/compte`, bilan partageable, objectif éditable | non |

Aucun lot ne demande de nouvelle table : **tout est déjà en base.** Ce qui manque
à cet onglet n'est pas de la donnée, c'est un écran.

---

## 6. Ce qui reste à trancher (décisions produit, pas techniques)

- **Le pseudo ou le prénom ?** Le profil de jeu a un `gamertag`, `/moi` affiche
  le prénom. Un seul doit gagner, et ce n'est pas au code de le décider.
- **La modale de `/defi` disparaît-elle** au profit de l'onglet, ou reste-t-elle
  en raccourci ? (Recommandation : la pastille de l'arène ouvre `/moi`, la modale
  part — deux chemins vers le même contenu, c'est un chemin de trop.)
- **Le rang de travail survit-il** comme titre, ou disparaît-il complètement ?

---

## 7. Ce que je n'ai pas pu vérifier

- **La vue connectée.** L'app n'a pas de compte de test dans le dépôt et je ne
  crée pas de compte ; tout ce document est établi au code, au schéma et aux
  commentaires d'intention. Les proportions, la densité et le ressenti réel de
  l'onglet une fois rempli restent à confirmer à l'écran.
- **L'état réel des migrations en prod** (223, 189, 187) : `lib/sante.ts` décrit
  les symptômes, seule une sonde en base dit lesquelles sont passées.
