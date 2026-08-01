# Cadrage — Le classement en pourcentage (« top 2 % des 3e »)

> Demande de Lucas (2026-08-01) : « vous êtes dans le top 2 % en 3e, c'est bien
> plus parlant que 3 000 trophées ». Ce document fixe les décisions AVANT le
> code, comme `CADRAGE-GEO.md`. Les quatre décisions ont été tranchées par
> Lucas le 2026-08-01 ; elles sont marquées ✅ ci-dessous.

## 1. L'idée, et pourquoi elle tient

3 000 trophées n'a de sens qu'une fois l'échelle intériorisée : il faut déjà
savoir que 3 000, c'est beaucoup. « Top 2 % des 3e » **se décrit tout seul**, et
c'est la *même donnée* réexprimée — aucune monnaie de plus, aucun grind de plus.
C'est aussi la seule formulation qui se raconte à voix haute à la récré, et la
seule qu'un parent lit sans mode d'emploi.

## 2. Ce qu'on avait déjà (et qui rend le chantier court)

- `profiles.grade_level` (`schema.sql`) : la cohorte est en base depuis le début.
- `national_ranking()` (159) renvoie **déjà `my_rank` et `total`** : le
  percentile est une division. Il ne manquait que le découpage par niveau.
- `PalierCelebration` + `lib/palier.ts` : la fête partageable existe, il suffira
  de lui donner un `kind` « percentile » pour célébrer une entrée dans le top 5 %.
- Les trois mesures sont toutes déjà stockées (cf. §3).

## 3. D1 — Sur quoi porte le pourcentage ✅ les trois, selon l'écran

Un percentile n'a de sens que si on sait de quoi il parle. Un seul chiffre pour
tout aurait menti : un élève sérieux qui ne joue pas au Défi serait dans les
derniers pourcents. Chaque onglet porte donc **sa** mesure, celle qui correspond
à ce qu'on y fait.

| Écran | Mesure | Source | Phrase type |
|---|---|---|---|
| `/defi` | **Trophées** — la compétition | `profiles.trophies` | « Top 2 % des 3e » |
| `/moi` | **Assiduité** — le travail fourni | `profiles.work_seconds` | « Tu travailles plus que 96 % des 3e » |
| `/reviser` | **Maîtrise** — par matière | `test_sessions` × `quizzes.subject` | « Maths — top 8 % des 3e » |

Règle de la maîtrise : on prend le **meilleur score par quiz** (un quiz refait
ne pénalise pas), puis la moyenne par matière. Un élève n'entre dans le
classement d'une matière qu'à partir de `MASTERY_MIN_QUIZZES` quiz passés —
sinon un seul 10/10 chanceux placerait n'importe qui premier.

## 4. D2 — La population de référence ✅ tous les élèves du même niveau, avec un plancher

Le percentile compare aux élèves **réels** du même `grade_level`, toute l'app
confondue. Et surtout :

> **En dessous de `COHORT_MIN` élèves dans la cohorte, on n'affiche AUCUN
> pourcentage.** On retombe sur le rang brut : « 4e sur 61 en 3e ».

C'est la décision la plus importante du document. Sur 60 élèves de 3e, « top
2 % » veut dire *premier*, et le chiffre bouge de cinq points dès qu'un copain
joue une partie. Le jour où deux élèves comparent leurs écrans, l'illusion
tombe et emporte la crédibilité du reste. Le rang brut, lui, est vrai à toute
taille.

Conséquence assumée : **la fonctionnalité est invisible au lancement.** Elle
s'allume toute seule quand la cohorte atteint le seuil. C'est le prix de ne
jamais afficher un chiffre faux.

Écartées : le barème absolu calibré (marche tout de suite, mais « top 2 % »
devient une note déguisée en rang), le département (le code postal n'est pas en
base, cf. `CADRAGE-GEO.md` D1) et l'école (15 élèves : un pourcentage n'y veut
rien dire).

## 5. D3 — L'élève sous la médiane ✅ toujours affiché, formulé à l'endroit

Par construction, la moitié des élèves sont sous la médiane. Dans une app de
**soutien scolaire**, leur annoncer « tu es dans les 70 % derniers » est
exactement l'inverse du service rendu.

La règle est donc : **on montre toujours le chiffre, mais lu du bon côté.**

| Position | Ce qu'on affiche |
|---|---|
| Moitié haute | « **Top 12 %** des 3e » — la position |
| Moitié basse | « Tu fais mieux que **32 %** des 3e » — le chemin déjà fait |

C'est la même donnée dans les deux cas, jamais un arrondi complaisant : on bascule
de formulation à la médiane, là où les deux phrases disent la même chose.

**Corollaire : les arrondis vont toujours CONTRE l'élève.** Top 2,3 % s'affiche
« top 5 % » (bande supérieure), et « mieux que 34 % » s'affiche « mieux que
30 % » (multiple de 5 inférieur). Un élève ne doit jamais pouvoir démontrer que
l'app l'a flatté — c'est ce qui rend les bons chiffres croyables.

Les bandes (1, 2, 5, 10, 25, 50 %) servent aussi la stabilité : passer de « top
2,1 % » à « top 2,4 % » se lirait comme une chute, alors que « top 5 % » ne
bouge pas de la semaine.

## 6. D4 — Rapport aux trophées ✅ à côté, le % traduit le trophée

Les trophées **restent le moteur** : les rangs (`lib/rank.ts`), la ligue
hebdomadaire, la saison et le Pass en dépendent tous. Y toucher casserait
quatre systèmes pour un gain d'affichage.

Le pourcentage est leur **traduction**, posée juste en dessous du compteur :

```
🏆 3 000
Top 2 % des 3e     ← la traduction, en plus petit
```

## 7. Fraîcheur du calcul

Le classement se recalcule **à la demande, côté base**, par une RPC
`SECURITY DEFINER` (migration 223) — même patron que `national_ranking()`.

⚠️ **Piège RLS connu du projet** : la lecture croisée de `profiles` passe
TOUJOURS par une RPC `SECURITY DEFINER`, jamais par une jointure — une jointure
ne verrait que la ligne de l'élève et renverrait « 1er sur 1 ».

Si le coût devient sensible (`count(*)` sur tous les profils à chaque rendu),
la sortie est connue : une vue matérialisée rafraîchie une fois par jour. Le
percentile n'a aucun besoin d'être à la seconde — c'est même un avantage qu'il
ne bouge pas en cours de journée.

## 8. Ce qui reste ouvert

- **La célébration.** Entrer dans le top 5 % mérite la bulle partageable de
  `PalierCelebration`. Demande de mémoriser le dernier palier atteint pour ne
  fêter qu'une fois — donc une colonne de plus. Non fait.
- **L'espace parents.** « Votre enfant travaille plus que 88 % des 3e » est
  probablement la phrase la plus vendeuse de toute l'app. Non fait.
- **La progression** (« +14 places cette semaine ») : demande un historique,
  donc une table de snapshots. Non fait.
