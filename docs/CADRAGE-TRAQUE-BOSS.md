# Cadrage — La Traque (boss dissociés des modes de jeu)

**Date** : 2026-07-29 · **Mise à jour** : 2026-07-30
**Statut** : **LOTS 1 & 2 IMPLÉMENTÉS** + la mise en scène de l'apparition
(message éclair, boss sur l'île). Migration **212 à exécuter à la main**.
**Inspiration** : le Death Match / Raid Boss de *Seven Deadly Sins: Grand Cross* —
une jauge de rencontre monte à chaque combat livré, le boss est garanti à 100 %,
et une fois débusqué il n'est défiable que pendant une fenêtre courte.

---

## 1. Le problème

Les boss existent (`lib/bosses.ts` : 16 gardiens + Nox, rangs I→III, boss
hebdomadaire) mais ils sont **invisibles** : un billet parmi d'autres dans la
feuille « Modes de jeu », et un onglet enterré dans la page matière. Résultat :
le contenu le plus incarné du jeu ne sert à rien, et les modes fun (Blitz,
Chrono, Survie, Duel fantôme) sont dilués par un intrus qui n'a pas la même
nature.

Et surtout : **rien ne relie le travail de révision au combat**. Battre un boss
ne récompense pas d'avoir révisé, et réviser ne donne pas envie de se battre.

## 2. Le principe

> L'élève ne choisit pas de combattre un boss. Il le **débusque** en révisant.

Chaque matière a son gardien qui « rôde ». Le travail réel de l'élève sur cette
matière remplit une **jauge de traque**. À 100 %, le boss sort de sa tanière,
apparaît sur l'île de l'arène, et reste défiable pendant une fenêtre limitée.
Le combat porte **sur les chapitres qui ont rempli sa jauge** — il interroge
littéralement ce qui vient d'être révisé.

Boucle complète, tenable en un écran :

```
je révise  →  le boss sort  →  je le bats  →  gemmes  →  j'ouvre la fiche
     ↑                                                          │
     └──────────────────  de quoi mieux réviser  ───────────────┘
```

## 3. Décisions prises (2026-07-29)

| Décision | Choix retenu |
|---|---|
| Ce qui remplit la jauge | **Des actions**, jamais du temps de présence |
| Récompense de victoire | **Gemmes 💎**, l'économie de contenu existante |
| Rotation hebdomadaire | **Jauge libre + bonus du jour** — jamais bloquer l'effort |
| Placement UI | **Icône dans le rail droit + le boss apparaît dans le décor** |

### 3.1 Le barème

Le temps de présence se triche (onglet laissé ouvert) ; les actions sont déjà
instrumentées par les quêtes du jour. On compte donc des gestes, et on affiche
l'équivalent en minutes pour rester lisible.

| Geste | Points |
|---|---|
| Carte révisée (SRS / carnet) | +4 |
| Bonne réponse en quiz | +2 |
| Leçon terminée | +15 |
| Quiz de chapitre terminé | +25 |

**Seuil : 100 points** ≈ 20 minutes de travail réel.
**Plafond : 150 pts/jour/matière** — sinon on farme une seule matière toute la
journée et la rotation ne veut plus rien dire.

Palier visible et sonore **tous les 10 %** (le « tic » 7DS). Le libellé ne dit
jamais un pourcentage nu : « Delta est à 5 cartes de sortir de sa tanière ».

### 3.2 Le pool du combat

Chaque geste qui crédite la jauge **mémorise son chapitre**. Au déclenchement,
le pool du boss est tiré de ces chapitres-là, pondéré par les plus récents.
C'est ce qui rend le combat gagnable — donc jouable, donc rejouable.

### 3.3 La récompense

| Situation | Gemmes |
|---|---|
| Victoire rang I | 10 💎 |
| Victoire rang II | 15 💎 |
| Victoire rang III | 20 💎 |
| Boss « en chasse » du jour | ×2 |
| Nox (dimanche) | 30 💎 = **un chapitre entier** |

Rappel : `GEM_COST_CHAPTER = 30` — la gemme ouvre les fiches de révision et la
carte mentale d'un chapitre, à vie.

L'écran de victoire ne propose pas « Continuer » mais
**« Ouvrir la fiche de <chapitre travaillé> — 30 💎 »**. La boucle se referme là.

> ⚠️ **Inflation à surveiller.** Les quêtes du jour versent déjà 3 à 12 💎 ×3.
> Ajouter les boss sans recalibrer ouvre le catalogue en trois semaines et vide
> Studuel+ de sa contrepartie — `lib/gems.ts` met explicitement en garde.
> Prévoir un plafond hebdomadaire de gemmes gagnées en jeu, ou baisser les quêtes.

### 3.4 Le calendrier

**La jauge monte tous les jours, dans toutes les matières.** On ne punit jamais
un élève qui révise la matière de son contrôle hors du « bon » jour. Ce qui
tourne, c'est le bonus.

| Jour | En chasse (×2 💎) |
|---|---|
| Lundi | Delta (Maths) · Imperator (Latin) |
| Mardi | Grammatork (Français) · Dr Plasma (Physique-Chimie) |
| Mercredi | Atlas (Histoire-Géo) · Big Ben (Anglais) |
| Jeudi | Sylvarok (SVT) · El Toro (Espagnol) |
| Vendredi | Kaiser Fang (Allemand) · Fiscus (SES) |
| Samedi–dimanche | **tous** — rattrapage |
| Dimanche | **+ Nox** |

Calendrier **fixe et affiché** : le rituel (« le mardi c'est Grammatork ») vaut
mieux qu'une rotation maligne mais illisible. Chaque jour mélange une matière
scientifique et une littéraire ou une langue.

**Nox** : sa jauge se remplit avec toutes les matières confondues et exige
d'avoir battu ≥ 3 boss dans la semaine. Son pool est tiré des 7 derniers jours
de révision — c'est un examen blanc hebdomadaire déguisé en boss final.

## 4. L'interface

### 4.1 Dissociation

- **Retirer** `subjectBossTicket` de la feuille Modes
  (`lib/defi/modes-catalog.ts`) → Modes redevient Blitz · Chrono · Survie ·
  Duel fantôme, une famille cohérente.
- **Ajouter** une icône Boss dans le rail droit de l'arène (avec trophée,
  malle, coffre), badge quand une traque est pleine.
- **Le boss apparaît dans le décor** : à 100 %, sa silhouette se pose sur l'île
  derrière le personnage, la lumière vire. On ne lit pas une notification, on
  voit la menace. Tape dessus → combat.

### 4.2 La feuille Boss (`SheetShell` existe déjà)

```
🔥 EN CHASSE AUJOURD'HUI
┌────────────────────────────────┐
│ [Delta]  Maths        Rang II  │
│ ████████████████░░░░  82 %     │
│ 5 cartes de plus pour le sortir│
│         [ RÉVISER MATHS → ]    │
├────────────────────────────────┤
│ [Grammatork] Français  Rang I  │
│ ██████████████████████ PRÊT !  │
│ ⏳ disparaît dans 3 h 12       │
│         [ ⚔ DÉFIER ]           │
├────────────────────────────────┤
│ [Big Ben] Anglais — de retour  │
│ ░░░░░ mercredi                 │
└────────────────────────────────┘
```

Le CTA d'une carte non pleine **renvoie sur Réviser**, filtré sur la matière.
C'est le point clé : le boss devient un moteur de trafic vers le travail, pas un
mode de jeu de plus.

## 5. Technique

### 5.1 Ce qu'il faut créer

- `lib/traque.ts` — **pur et testé** : barème, seuil, paliers, calendrier des
  boss en chasse, fenêtre d'expiration, calcul du pool à partir des chapitres
  nourris.
- `supabase/212_boss_gauges.sql` — table `boss_gauges` (`user_id`, `boss_id`,
  `points`, `chapitres_nourris jsonb`, `victoires`, `debusque_a`, `jour_credit`),
  RLS complète, RPC d'incrément atomique. **211 est réservée au chantier
  « contrôles partout ».**
- `components/defi/BossSheet.tsx` + l'icône du rail + l'apparition dans le décor.

### 5.2 Pièges identifiés

- **localStorage → serveur.** Les victoires de boss vivent aujourd'hui en
  `localStorage` (`scolaria-boss-victories`). Une jauge qui représente du travail
  réel doit être en base : changement de téléphone = progression perdue = élève
  furieux. Migrer les victoires en même temps.
- **`ALL_BOSSES` est dupliqué en SQL.** La migration 165 (`claim_weekly_trophy`)
  recalcule le boss hebdomadaire en dur à partir de l'ordre et des ids. Toute
  modification du catalogue exige une migration miroir — `lib/bosses-mirror.test.ts`
  garde le contrat.
- **Ne pas doublonner les quêtes du jour.** La traque compte les mêmes gestes
  que `QuestKind`. Brancher les deux compteurs au même endroit plutôt que de
  faire deux passes.

### 5.3 Découpage

1. **Lot 1 — la jauge.** `lib/traque.ts` + migration 212 + branchement des
   compteurs. Rien de visible, tout est testable.
2. **Lot 2 — la feuille Boss.** Icône du rail, cartes de traque, dissociation
   d'avec les Modes, combat sur pool nourri, versement des gemmes.
3. **Lot 3 — la mise en scène.** Boss dans le décor, paliers sonores, écran de
   victoire qui propose la fiche, Nox du dimanche.

## 6. Questions ouvertes — tranchées le 30/07

| Question | Décision |
|---|---|
| Durée de la fenêtre | **1 h**, façon 7DS. Lucas : « la barre monte, possibilité de l'affronter durant 1 h ». Le compte à rebours est affiché partout (tuile, feuille, message éclair). |
| Jauge après défaite | **50 %**, jamais zéro (`traque_apres_defaite()`). Une fenêtre laissée passer sans combattre applique la même règle, à la lecture suivante. |
| Sort du `weeklyBoss` | **Maintenu pour l'instant** : il vit encore dans le billet « Boss » des modes fun (`/defi/jouer?mode=boss`) et garde son trophée de collection (migration 165). Son absorption par Nox reste à faire — elle touche `claim_weekly_trophy` et exige une migration miroir. |

## 7. Ce qui a été livré le 30/07

**Lot 1 — la jauge.**
- `lib/traque.ts` (pur, 43 tests) : barème, seuil, plafond quotidien, fenêtre
  d'une heure, paliers de 10 %, calendrier de la chasse, gemmes + plafond
  hebdomadaire, composition du pool, libellés (« 5 cartes de plus »).
- `supabase/212_traque_boss.sql` : table `boss_gauges` (RLS lecture seule,
  aucune écriture directe), trois RPC `SECURITY DEFINER` — `traque_credit`,
  `traque_victoire`, `traque_defaite`. Le serveur décide seul du débusquage,
  du rang, du bonus du jour et du montant versé.
- `lib/traque-server.ts` + branchement dans les gestes RÉELS :
  `finishReviewSession` (cartes, par matière), `recordTestSession` (quiz de
  chapitre + bonnes réponses), `completeLesson` (leçon terminée).
- `lib/bosses-mirror.test.ts` garde le miroir lib ↔ SQL (seuil, plafond,
  fenêtre, calendrier, gemmes, source `traque_win`) — c'est exactement le piège
  qui avait tué le trophée hebdomadaire avant la 194.

**Lot 2 — la feuille Boss.**
- `components/defi/BossSheet.tsx` : une carte par matière, jauge, ce qu'il
  reste à faire en GESTES, gemmes en jeu, jour de retour en chasse. Le CTA d'une
  carte non pleine renvoie sur `/reviser/{matière}`.
- La tuile Boss du rail ouvre cette feuille (pastille = boss sortis, minuteur =
  temps restant ou avancement). Elle disparaît tant que la 212 n'est pas passée.
- `subjectBossTicket` **retiré** de `lib/defi/modes-catalog.ts` : Modes
  redevient Blitz · Chrono · Survie · Duel fantôme.
- Combat : `/defi/traque/[bossId]` — pool tiré des chapitres qui ont rempli la
  jauge, les plus récents d'abord. La page revérifie la fenêtre et redirige sur
  `/defi` si le boss n'est plus là.
- Écran de victoire : gemmes versées + **« Ouvrir « <chapitre> » — 30 💎 »**.
  La boucle se referme.

**Lot 3 — la mise en scène (partielle).**
- **Le message éclair** (`BossFlash`) : bannière écarlate qui balaie, en tête du
  bloc d'action, avec le visage du gardien et son compte à rebours. Un tap mène
  au combat. Le rugissement (`sfx.battle`) ne se joue qu'une fois par apparition.
- **Le boss sur l'île** (`ArenaHero`) : sa silhouette se pose derrière le
  personnage, halo écarlate pulsant au sol. Tant qu'il rôde, on ne voit de lui
  qu'une ombre — dans la feuille comme sur la tuile.

**Reste à faire (Lot 3) :** paliers sonores tous les 10 %, Nox du dimanche
(`noxUnlocked` est écrit et testé, mais aucune jauge « toutes matières » ne le
nourrit encore), et l'absorption du boss de la semaine.
