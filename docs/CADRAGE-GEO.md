# Cadrage — Échelle géographique ville → département → région → national

> Demande de Lucas (2026-07-17) : « tout le monde est content quand on change
> de niveau ». Remplacer/compléter la progression d'arène abstraite par des
> paliers **géographiques réels**, basés sur l'école (clan) de l'élève, et
> **célébrer chaque passage** (la bulle partageable de `PalierCelebration`,
> livrée le 2026-07-17, est prête à être réutilisée telle quelle).
> Ce document cadre les décisions AVANT de coder. Rien n'est implémenté.

## 1. Ce qu'on a déjà

- `schools` (159) : `name`, `city` (**texte libre, nullable**, saisi par les
  élèves), `level` (college|lycee). **Ni code postal, ni département, ni
  région.** Unicité souple (nom+ville+cycle, insensible à la casse).
- `profiles.trophies` (079) + arènes à trophées (`lib/trophies.ts`).
- Classements réels clan/national/amis (159/160), tournoi des écoles (162),
  ligue hebdo (161/164).
- `PalierCelebration` + `lib/palier.ts` : détection de palier et fête
  partageable — il suffira d'ajouter un `kind` géographique.

**Verrou principal : la donnée géo.** `city` en texte libre ne permet pas de
regrouper fiablement par département/région (fautes, variantes, vides).

## 2. Décisions à trancher (Lucas)

### D1 — Source de la donnée géo ⭐ la décision structurante

| Option | Principe | Coût | Fiabilité |
|---|---|---|---|
| **A. Code postal à la création d'école** (recommandée) | On ajoute `postal_code` à `schools`, demandé dans l'onboarding/le choix d'école. Département = 2 premiers chiffres (+ règles 2A/2B, DOM 3 chiffres), région = table statique dept→région dans `lib/geo.ts` (pure, testée). | M | Bonne — le CP est connu des élèves, une seule saisie courte |
| B. Département choisi dans une liste (101 entrées) | Pas de CP ; l'élève choisit son département au moment du choix d'école. | S/M | Bonne mais une saisie de plus, et « ville » reste du texte libre |
| C. Seed de l'annuaire officiel (open data Éducation nationale, ~60 k établissements, UAI + commune + dept + région) | La recherche d'école matche un référentiel propre ; plus aucune saisie libre. | XL (import, matching des écoles existantes, re-rattachement) | Excellente — mais gros chantier |

**Recommandation : A maintenant, C plus tard.** A débloque l'échelle géo en
une migration + un champ d'UI ; C reste la cible long terme (l'annuaire
officiel éliminera les doublons d'écoles) et A y survit (le CP devient une
donnée de recoupement).

- Écoles existantes sans CP : bandeau « complète ton école » (le premier
  élève du clan qui renseigne le CP le fixe pour tout le clan) — pas de
  blocage, l'élève sans CP reste classé « national » seulement.

### D2 — Nombre de paliers : 3 ou 4 ?

Lucas a écrit « 3 niveaux » mais en liste 4 (ville, département, région,
national). **Recommandation : 4 échelons d'affichage, 3 passages célébrés**
(ville→dept, dept→région, région→national), ce qui réconcilie les deux
formulations. La « ville » est l'échelon de départ (celle de ton école), pas
un palier à conquérir.

### D3 — Règle de passage d'un échelon à l'autre

| Option | Règle | Lecture élève |
|---|---|---|
| **A. Seuil de rang** (recommandée) | Être **top N** de l'échelon courant débloque le suivant (ex. top 10 de ta ville → tu entres au classement départemental). N fixe et affiché. | « Encore 2 places et je passe au départemental ! » — clair, actionnable |
| B. Top X % | Même idée en pourcentage. | Instable quand l'échelon est peu peuplé (1 élève = top 100 %) |
| C. Seuil de trophées par échelon | Comme les arènes (300, 700…). | Simple mais « géographique » seulement en façade |

Départage : trophées (comme les classements actuels). Un élève qui rechute
sous le seuil **ne redescend pas** d'échelon (pas de double peine — même
esprit que la relégation douce de la ligue).

### D4 — Affichage

- Un **sélecteur d'échelon** dans la feuille Classements du Défi (onglets
  Ville / Département / Région / National), l'échelon atteint le plus haut mis
  en avant ; les échelons verrouillés visibles mais grisés (« top 10 de ta
  ville pour débloquer »).
- Le classement d'un échelon = les élèves des écoles de cet échelon (même
  mécanique SECURITY DEFINER que `clan_ranking`/`national_ranking`, prénom
  seul, LIMIT + ma ligne).
- Passage de palier → `PalierCelebration` (déjà partageable en story).

## 3. Plan d'implémentation (une fois D1–D4 tranchées, option A partout)

1. **Migration 165** : `schools.postal_code TEXT` + `schools.dept TEXT`
   (dérivé à l'écriture, indexé) ; RPC `set_school_postal_code` (premier
   renseigne, anti-vandalisme : pas d'écrasement) ; RPC
   `geo_ranking(scope)` (ville/dept/région) calquées sur `clan_ranking`.
   Idempotente, jamais exécutée par l'agent.
2. **`lib/geo.ts`** (pur + tests) : `deptFromPostalCode` (2A/2B, DOM),
   `regionForDept` (table statique des 18 régions), `geoPalier` ajouté à
   `lib/palier.ts`.
3. **UI** : champ CP dans le choix d'école (onboarding + profil), onglets
   d'échelon dans Classements, bandeau « complète ton école ».
4. **Célébration** : brancher `geoPalier` sur la même vigie que la ligue.

Estimation totale : **L** (~350 k) une fois les décisions prises — la
migration et `lib/geo.ts` sont le gros ; l'UI réutilise l'existant.

## 4. Ce qui n'est PAS dans ce cadrage

- Récompenses spécifiques par échelon (coffres géo…) — à cadrer après v1.
- Classement d'ÉCOLES par ville/dept (le tournoi 162 y répondra mieux).
- Import de l'annuaire officiel (option C) — chantier séparé si GO.
