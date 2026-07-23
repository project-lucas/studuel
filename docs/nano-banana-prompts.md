# Illustrations de Studuel — prompts et reste à faire

Ce dossier ne liste plus que **ce qui reste à produire**. Les lots déjà livrés
sont résumés en une ligne chacun (§ Déjà livré) : leurs prompts ont fait leur
travail, les garder in extenso ne servait qu'à noyer le reste. Ils restent
récupérables dans l'historique git.

**Outil** : Higgsfield / Nano Banana Pro. Prompts en anglais (les modèles
d'image les comprennent mieux). Aucun de ces modèles ne sort de PNG transparent
→ demander `on a plain flat white background`, détourer, puis convertir en WebP.

---

## Le monde visuel de l'app (à respecter partout)

L'app tourne sur le design system **« crème & violet »** (cf. CLAUDE.md et les
tokens de `app/globals.css`). Les anciens prompts « marine + orange » de ce
dossier ne correspondaient plus à rien à l'écran — ils ont été remplacés.

| Rôle | Couleur | Hex |
|---|---|---|
| Fond | crème | `#EDE7D6` |
| Encre | marine douce | `#24304F` |
| Action / marque | violet | `#7A3FE0` |
| Récompense / XP | jaune solaire | `#F5B722` |
| Alerte | corail | `#F1566C` |
| Série (flamme) | ambre → orange | `#FBBF24` → `#EA580C` |

Typo de l'app : **Nunito** (corps) + **Baloo 2** (titres). Aucune illustration
ne porte de texte — les mots sont rendus par l'app, jamais gravés dans l'image.

### Prompt de style « vignette » (objets détourés : matières)

> Flat 2D vector illustration sticker for a playful mobile learning app for
> teenagers, modern flat design, soft rounded shapes, NO outlines, vibrant
> saturated palette (vivid purple, sunny yellow, turquoise, coral pink, sky
> blue), simple two-tone flat shading, a few small abstract confetti shapes
> (triangles, dots, squiggles) scattered around the main object, main object
> large and slightly tilted, isolated on a plain flat white background,
> square composition, no text, no watermark.

### Prompt de style « scène » (bannières 16:9 : modes, jeux, boss)

**Higgsfield** : cocher le format **16:9** dans l'interface — le ratio ne se met
PAS dans le prompt (ça embrouille le modèle).

> Highly detailed vibrant cartoon splash art scene for a playful mobile quiz
> battle game for teenagers, rich painterly shading, bold chunky shapes with
> thick clean outlines, dramatic cinematic lighting, glowing atmospheric depth,
> volumetric clouds and mist, rich saturated colors, premium mobile-game event
> splash art. The artwork is FULL-BLEED and fills the ENTIRE canvas edge to
> edge — no frame, no border, no white margins, no card, no mockup, no
> letterboxing. Composition: ONE single hero subject placed in the RIGHT third
> of the image; the same rich atmospheric background continues across the LEFT
> two thirds but gets progressively darker toward the left, with only soft
> clouds, glow and floating particles there — no objects and no characters on
> the left side. No text, no letters, no logo, no watermark.

**Deux pièges appris (2026-07-22)**, à ne pas réintroduire :
- demander une gauche « empty / calme / simple » **appauvrit toute l'image** (le
  modèle aplatit l'ensemble). Dire : riche mais **sombre et sans objet** ;
- le mot **« banner »** fait dessiner une *maquette de bannière* encadrée de
  blanc au centre de la toile. Dire « splash art scene » + « full-bleed ».

**Règle d'or** : joindre une image déjà validée en référence, avec la mention
`match the exact art style of the reference image`.

---

## À produire — par priorité

### P1 · 9 illustrations de boss manquantes

`lib/bosses.ts` déclare **17** boss ; 8 tournent encore sur leur emoji de repli.
Le boss de la semaine passe sur **tous** les élèves à tour de rôle : un trou ici
se voit une semaine entière.

Deux fichiers par boss : le **buste** (carré détouré, style « vignette »,
`public/images/boss/<id>.webp`) et la **scène** 16:9 (style « scène »,
`public/images/boss/<id>-scene.webp`).

| Id | Manque | Matière | Sujet (après le style maître) |
|---|---|---|---|
| `nox` | buste | *repli* | A hooded shadow figure with two calm glowing violet eyes, star-dust cloak, midnight-blue background — mysterious, never frightening. |
| `chronos` | buste + scène | Histoire | An imposing but cartoonish time-keeper wearing a toga made of clock faces, holding an hourglass sceptre, sand and roman numerals swirling around, deep amber-and-bronze background. |
| `mitochondrix` | buste + scène | SVT | A grinning cartoon cell-creature shaped like a mitochondrion, green energy arcs pulsing along its folds, microscopic teal-and-lime background with floating organelles. |
| `bugzilla` | buste + scène | NSI | A friendly-menacing pixel-art beetle made of glitching code blocks, magenta error sparks, dark violet screen-glow background with falling green characters. |
| `mecatron` | buste + scène | Technologie | A chunky retro robot boss with one big glowing amber eye and gear-shoulders, steam venting, slate-and-copper workshop background. |
| `sphinx` | buste + scène | Philosophie | A serene cartoon sphinx with a cream marble face and violet eyes, floating question marks carved in stone, dusk-pink desert background. |
| `nova` | buste + scène | Physique-Chimie | A radiant star-being with a molten golden core and swirling plasma arms, deep indigo cosmic background with bursting light. |
| `coach-turbo` | buste | Sport | A cartoon coach blowing a whistle, turbo jetpack on the back and a stopwatch in hand, lime-and-orange stadium energy. |
| `delta` | scène | Maths | A geometric guardian built from luminous triangles and rulers, violet-and-gold grid background with floating equation shapes (SHAPES ONLY, no readable symbols). |

> **Commencer par `nox`** : c'est le boss de **repli**, affiché dès qu'une
> matière n'a pas son gardien. C'est le buste le plus rentable des neuf.

### P2 · 8 scènes de jeux de salon

Chaque jeu de la roulette est vendu par sa scène. Ces 8 jeux sont **jouables**
mais s'affichent encore sur la robe unie violette.

Format 16:9 → `public/images/defi/jeux/<id>-scene.webp`, puis ajouter l'id à
`GAME_SCENE_IDS` dans `lib/defi/modes-catalog.ts` (sans ça, l'image déposée
n'est jamais affichée).

**Lien de famille** : les jeux d'une même matière partagent leur ambiance, comme
une collection.

| Id | Jeu | Matière | Sujet (après le style maître) |
|---|---|---|---|
| `suite-logique` | Suite logique | Maths | A mystical violet crystal orb floating above an open geometric grimoire, glowing shapes rising in a sequence, deep indigo-and-gold arcane background. |
| `compte-est-bon` | Le compte est bon | Maths | Six glowing golden number-plates orbiting a big target ring, arithmetic sparks, deep navy-and-gold game-show background (SHAPES ONLY, no readable digits). |
| `faux-amis` | Faux amis | Anglais | Two theatre masks face to face, one royal blue and one pop red, ribbons and confetti swirling, deep blue stage background with warm spotlights. |
| `phrase-en-vrac` | Phrase en vrac | Anglais | Blank wooden word-tiles tumbling into a neat line on a slate-blue desk, royal blue and pop red highlights, chalky classroom glow (tiles are BLANK). |
| `falsos-amigos` | Falsos amigos | Espagnol | A shimmering desert mirage with a scarlet flamenco fan half-dissolving into hot air, sunflower-yellow dunes, wavy heat haze. |
| `classe-moi-ca` | Classe-moi ça | SVT | Three cartoon animals (a mammal, a reptile, an amphibian) perched on floating mint-green jungle platforms, teal canopy background with fireflies. |
| `chasse-elements` | Chasse aux éléments | Physique-Chimie | Glowing laboratory vials on a rack, each holding a different neon-green liquid, dark teal lab background with bubbling condensers (labels are BLANK). |
| `bonne-unite` | La bonne unité | Physique-Chimie | A precision workshop bench with a glowing caliper, a balance scale and a stopwatch, dark slate-and-neon-green background (all dials are BLANK). |

### P3 · 9 vignettes de matières

Ces matières s'affichent avec le médaillon d'initiales de repli. Style
« vignette », carré détouré **320×320** →
`public/images/matieres/vignettes/<slug>.webp`, puis ajouter le slug à
`VIGNETTE_SLUGS` dans `lib/subject-style.ts`.

Six d'entre elles arrivent avec la **migration 193** (catalogue complet 6e→Tle).

| Slug | Matière | Objet principal (après le style maître) |
|---|---|---|
| `emc` | EMC | A cream-and-violet balance scale with a small tricolour ribbon and a golden speech bubble. |
| `snt` | SNT | A turquoise smartphone with a purple wifi arc above it and small floating pixel squares. |
| `hlp` | HLP | An open cream book with a violet thinking-statue head rising from its pages, golden light rays. |
| `llcer-anglais` | LLCER Anglais | Two theatre masks in indigo and coral in front of an open book, small yellow stars. |
| `si` | Sciences de l'ingénieur | A big blue gear meshed with a purple drawing compass and a small yellow lightbulb. |
| `maths-complementaires` | Maths complémentaires | A soft violet division sign and a gentle rising curve on a sky-blue grid card, small golden dots. |
| `maths-expertes` | Maths expertes | A glowing purple infinity symbol intertwined with a golden spiral and small floating polyhedra. |
| `enseignement-scientifique` | Ens. scientifique | A teal telescope pointing at a coral-pink ringed planet with small yellow stars. |
| `finances-personnelles` | Finances personnelles | A friendly coral piggy bank with golden coins arcing into its slot and a small violet wallet. |

### P4 · les deux jeux encore « Bientôt »

À produire **seulement quand le jeu sera construit** — une belle scène sur un
billet « Bientôt » promet ce qui n'existe pas.

| Id | Jeu | Ce qu'il attend |
|---|---|---|
| `pointe-carte` | Pointe la carte | Scène **déjà faite** ; il manque le jeu (carte muette cliquable). |
| `anatomie-express` | Anatomie express | Scène + silhouette anatomique interactive. |

---

## Checklist technique

1. Générer → détourer → **WebP**. Garder les sources hors dépôt
   (`assets-sources/`, gitignoré).
2. Tailles : vignettes de matières **320×320** ; bustes de boss **512×512** ;
   scènes 16:9 **1536×864**. Poids visé **< 100 Ko** par scène, **< 60 Ko** par
   objet détouré.
3. **Déposer le fichier ne suffit pas** — chaque famille a sa liste à compléter,
   sinon l'image reste invisible :
   - vignette de matière → `VIGNETTE_SLUGS` (`lib/subject-style.ts`) ;
   - scène de jeu → `GAME_SCENE_IDS` (`lib/defi/modes-catalog.ts`) ;
   - boss → champs `image` / `scene` du catalogue de `lib/bosses.ts`.
4. Lancer `npm test` après chaque dépôt : des gardes comparent les listes
   déclarées aux fichiers réellement présents.
5. Accessibilité : toujours un `alt` descriptif ; jamais d'information portée
   par la seule image.
6. Le mode sombre est neutralisé dans l'app (`<html class="light">`) — aucune
   variante sombre à produire.

---

## Déjà livré

| Lot | Contenu | Où |
|---|---|---|
| Mascotte & logo | identité « Toque & Gland » | `public/images/logo app/`, `mascotte/` |
| Boss (DA v2) | 15 bustes + 15 scènes sur 17 | `public/images/boss/` |
| Blasons de rang | 6 paliers (Bronze → Maître) | `public/images/defi/ranks/` |
| Modes de l'Arène | 5 affiches + 5 scènes 16:9 | `public/images/defi/modes/` |
| Jeux de salon | 9 scènes 16:9 | `public/images/defi/jeux/` |
| Vignettes de matières | 22 objets détourés | `public/images/matieres/vignettes/` |
| Arènes horaires | 6 variantes du colisée | `public/images/arene/` |
| Barre d'onglets | 5 icônes | `public/images/nav/` |
| Débrief d'habitudes | icônes-boutons | `public/images/debrief/` |
| Barres CTA de l'arène | Match classé + Modes de jeu | `public/images/defi/` |

Prompts détaillés de ces lots retirés le 2026-07-22 (le dossier faisait 656
lignes pour ~90 % de travail terminé). Pour régénérer un asset à l'identique :
`git log -p docs/nano-banana-prompts.md`.
