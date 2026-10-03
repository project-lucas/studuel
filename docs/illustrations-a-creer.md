# Illustrations à créer — homogénéiser l'univers (03/10/2026)

Inventaire mesuré dans le code : tout ce qui s'affiche encore avec un **repli**
(emoji ou pictogramme) faute de dessin, plus ce que les chantiers du 03/10/2026
ont fait apparaître. Règle de style commune : **la famille de la barre
d'onglets** (`public/images/nav/`) — objet de jeu mobile dessiné, épais cerne
prune, volumes brillants, palette violet · or · crème ; fond crème uni
(`#F7F1E3`) pour le détourage ; jamais de texte dans l'image ; la gemme
s'écrit « cut gemstone seen from the front » (jamais « crystal »).

**Méthode qui marche** (coffres d'amis, 03/10/2026) : une **planche** de
plusieurs pièces dans UNE image quand elles forment une série (même échelle,
même lumière), puis découpe par script.

## Priorité 1 — visibles tout de suite · ✅ FAITE le 03/10/2026

Générée avec **Nano Banana 2 Lite** (connecteur Higgsfield, projet « Studuel — illustrations », 1 crédit l'image) : les 22 badges sur les icônes de la barre d'onglets en référence (`assets-sources/famille/badges/` → `node scripts/illustrations-famille.mjs badges`, déclarés dans `BADGES_ILLUSTRES`) ; les bustes, scènes, Coop, Grand oral, scène du programme et coffre de palier sur les fichiers voisins en référence (`node scripts/illustrations-lot-1003.mjs`). Le badge « 30 jours de série » est une flamme dans une couronne de laurier (la coupe est réservée aux trophées).

| Lot | Pièces | Où ça va | Déclaré dans |
|---|---|---|---|
| **Badges** | 22 (16 badges de progression + 6 de capsules) | `public/images/badges/<id>.webp` | `lib/illustrations.ts` (`BADGES_ILLUSTRES`) |
| **Coffre de palier de niveau** (fermé + ouvert) | 2 | `public/images/niveau/` | `components/niveau/FeteNiveau.tsx` (emprunte le coffre d'amis niv. 5) |
| **Scène « Ton programme »** (le duel classé de chaque matière) | 1 | `public/images/defi/jeux/programme-scene.webp` | `GAME_SCENE_IDS`, `lib/defi/modes-catalog.ts` |
| **Mode Coop** (objet + scène) | 2 | `public/images/defi/modes/coop.webp`, `coop-scene.webp` | `coopTicket()`, `lib/defi/modes-catalog.ts` |
| **Boss** : Mécatron (buste + scène), Coach Turbo (buste), Nox (buste) | 4 | `public/images/boss/` | `lib/bosses.ts` |
| **Vignette du Grand oral** | 1 | `public/images/matieres/` | `lib/subject-style.ts` (`SANS_DESSIN`) |

Ids des badges : `serie-7`, `serie-30`, `serie-100`, `habitude-ancree`,
`premiere-habitude`, `quiz-10`, `sans-faute`, `temps-1h`, `temps-10h`,
`temps-100h`, `temps-1000h`, `trajet-1`, `trajets-10`, `trajets-50`,
`trajet-serie-5`, `trajet-serie-20`, `capsule-sommeil`, `capsule-nutrition`,
`capsule-stress`, `capsule-methode`, `capsule-argent`, `capsule-orientation`.
Les séries (`serie-*`, `temps-*`, `trajet*`) se font en **planches** : même
objet, de plus en plus riche (bronze → argent → or → légendaire), comme les
coffres d'amis.

## Priorité 2 — la Boutique et les capsules · ✅ FAITE le 04/10/2026

| Lot | Pièces | Où ça va | Déclaré dans |
|---|---|---|---|
| **Bannières de profil** : les 8 du catalogue (5 refaites en 16:9 : elles étaient sorties en portrait) | 8 | `public/banners/<clé>.webp` (1280×720) | `lib/profile-banners.ts` (vérifié par `lib/assets.test.ts`) |
| **Vignettes des objets en vente** : `banner-couronne-royale`, `banner-dragon-savoir`, `banner-vitrail` (recadrées sur leur bannière), `equip-casque`, `equip-lunettes` | 5 | `public/images/boutique/objets/` | `OBJETS_ILLUSTRES` |
| **Scènes de capsules** : les six capsules à 4 scènes | 23 | `assets-sources/capsules/<id>/1..4.png` → `node scripts/scenes-capsules.mjs` | `SCENES_CAPSULES` |

Bannières et vignettes : `node scripts/illustrations-lot-1004.mjs` ; accessoires :
`node scripts/illustrations-famille.mjs objets`.

## Priorité 3 — l'univers à débloquer · ✅ DESSINS FAITS le 04/10/2026

Les **32 personnages historiques** (Rare = cadre argent, Épique = or gravé,
Légendaire = or rayonnant serti) : `assets-sources/profil/<matière>-<nom>.png`
→ `public/images/profil/personnages/<id>.webp` (384², détourés, même script),
déclarés dans `lib/personnages-historiques.ts`. **Le déblocage n'existe pas
encore** : aucun défi ne les accorde et ils ne sont pas dans les portraits
libres — la règle reste à choisir.

## Total

**Tout est livré** : priorité 1 (32 pièces), priorité 2 (36), priorité 3 (32).
