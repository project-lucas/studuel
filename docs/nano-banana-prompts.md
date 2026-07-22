# Assets à générer avec Nano Banana Pro — Scolaria

Tous les prompts sont en anglais (les modèles d'image comprennent mieux).
Format : carré 1:1, 2K. Nano Banana Pro ne sort pas de PNG transparent →
demander `on a plain flat white background`, puis détourer (remove.bg, Photoshop, ou
l'outil de ton choix). Exporter en **PNG transparent** puis convertir en **WebP**.

## Le prompt de style maître (à coller au début de CHAQUE prompt)

> Cute 2D game asset for a French school revision app for teenagers, soft cel-shaded
> sticker style with clean bold dark-navy outlines, rounded friendly shapes,
> Duolingo-like charm. Palette: deep navy blue #2F3B6B, warm golden orange #E8A33D,
> flame amber gradient #FBBF24 to #EA580C, cream white. Subtle gradient shading,
> slight top-light glow. Centered, square composition, isolated on a plain flat
> white background, no text, no watermark.

**Règle d'or pour la cohérence** : génère d'abord la mascotte (batch 1), garde
l'image, et joins-la en **image de référence** à tous les prompts suivants avec
la mention `match the exact art style of the reference image`.

**Astuce planche (sprite sheet)** : pour les sets (badges, boutique, savants),
génère UNE image en grille (`a 3x3 grid sprite sheet of...`) — la cohérence
interne est parfaite — puis découpe chaque case.

---

## Batch 1 — Mascotte + logo (PRIORITÉ 1)

Le concept de marque existe déjà dans le code : « Toque & Gland » (bleu marine
de la toque de diplômé + orange du gland). La constante `MASCOT = '🦉'` est un hibou.

| Fichier | Prompt (après le style maître) |
|---|---|
| `public/images/brand/mascotte.png` | A wise cheerful little owl mascot wearing a navy graduation cap (mortarboard) with a golden acorn charm hanging from the tassel, big friendly eyes, chest puffed proudly, waving one wing. Full body, front 3/4 view. |
| `public/images/brand/mascotte-sheet.png` | Character sheet of the same owl mascot from the reference image: 6 poses in a 3x2 grid — waving, thinking with wing on chin, celebrating with confetti, sleeping, reading a book, pointing forward encouragingly. Same character, same outfit. |
| `public/images/brand/logo.png` | Minimal flat logo icon: the head of the owl mascot from the reference image simplified into a geometric emblem, navy blue on white, works at 32px, app-icon style, extremely simple. |

Usages : logo dans `Navigation.tsx` (marque texte seule aujourd'hui), favicon,
hero du login (`LoginForm.tsx`, aucun visuel actuellement), onboarding, empty states.

---

## Batch 2 — Compagnon tamagotchi (PRIORITÉ 2)

`lib/compagnon.ts` / `CompagnonCard.tsx` — 6 stades liés à la série.
**Ne génère PAS les 4 humeurs × 6 stades (24 images)** : les humeurs sont déjà
gérées en CSS (grisé = endormi, anneau = rayonnant). 6 images neutres suffisent,
+ éventuellement 1 variante « affamé » par stade plus tard.

Préfixe commun : `match the exact art style of the reference image. A tiny pet
creature for a virtual pet feature, full body, front view, sitting centered.`

| Stade | Fichier | Prompt |
|---|---|---|
| 0 Œuf | `compagnon/stade-0-oeuf.png` | A cute pale cream egg with navy speckles, tiny crack starting to appear, sitting on a small orange cushion, gentle glow. |
| 1 Poussin | `compagnon/stade-1-poussin.png` | A newborn fluffy chick just hatched, still wearing half of the eggshell as a hat, wide curious eyes, golden-cream feathers with navy accents. |
| 2 Curieux | `compagnon/stade-2-curieux.png` | The same chick slightly older, standing, leaning forward with curious sparkling eyes, one tiny wing raised, a small navy scarf. |
| 3 Malin | `compagnon/stade-3-malin.png` | A clever young fox-like creature with golden-orange fur, smart confident smirk, fluffy tail curled, navy bandana. |
| 4 Savant | `compagnon/stade-4-savant.png` | A scholarly owl creature with round glasses and a tiny navy graduation cap, holding a small book under its wing, calm proud expression. |
| 5 Légende | `compagnon/stade-5-legende.png` | A small majestic friendly dragon with navy-blue scales and flame-amber belly, tiny golden crown, confident heroic pose, small flame wisps. |

> Option plus forte (à décider) : au lieu de 5 espèces différentes, faire évoluer
> **le même hibou** (œuf → bébé hibou → hibou à lunettes → hibou-dragon ailé de
> feu) pour unifier compagnon + mascotte. Une seule lignée = identité plus forte.

---

## Batch 3 — Les 14 boss (PRIORITÉ 3)

`lib/bosses.ts` / `BossMode.tsx`. Portrait en médaillon (rond), donc buste centré.
Préfixe commun : `match the art style of the reference image. A charismatic
cartoon villain boss portrait for a quiz battle game for teens, bust framing,
front view, intimidating but fun, never scary. Dark navy vignette background.`

| Boss | Fichier | Prompt |
|---|---|---|
| Delta, Golem du Calcul (maths) | `boss/delta.png` | A stone golem made of chalkboard slate covered in glowing golden math equations, cracked grin, delta-triangle shaped head. |
| Grammatork, Ogre des Accords (français) | `boss/grammatork.png` | A burly ogre wearing a tattered French academic robe, holding a giant quill like a club, grammar symbols floating around him. |
| Imperator, Aigle de Rome (latin) | `boss/imperator.png` | An imperial golden eagle with a Roman laurel crown and a red toga sash, proud haughty stare, marble column hints behind. |
| Chronos, Gardien des Siècles (histoire-géo) | `boss/chronos.png` | An ancient hooded keeper whose body is a swirling hourglass of golden sand, clock gears floating, wise stern glowing eyes. |
| Big Ben, Dragon d'Albion (anglais) | `boss/bigben.png` | A dapper dragon with a Union-Jack-patterned top hat and monocle, sipping tea, smug grin, clock tower silhouette behind. |
| El Toro, Taureau de l'Arène (espagnol) | `boss/eltoro.png` | A powerful bull with a red matador cape draped over one shoulder, golden nose ring, dramatic confident pose, arena dust. |
| Dr Plasma, Savant Instable (physique-chimie) | `boss/plasma.png` | A wild-haired mad-scientist with crackling purple-electric energy, goggles, bubbling flask, lightning arcs between his hands. |
| Mitochondrix, Créature des Profondeurs (SVT) | `boss/mitochondrix.png` | A bioluminescent deep-sea microbe monster, translucent teal-green body with glowing organelles, many curious eyes, tentacle cilia. |
| Bugzilla, Monstre du Code (NSI) | `boss/bugzilla.png` | A giant glitchy pixel-bug creature, part insect part corrupted computer sprite, neon green code fragments, mischievous antennas. |
| Mécatron, Machine Impitoyable (techno) | `boss/mecatron.png` | A hulking retro battle robot in navy steel with orange warning stripes, glowing visor eye, steam vents, giant wrench hand. |
| Krach, Loup des Marchés (SES) | `boss/krach.png` | A sly wolf in a sharp pinstripe suit, golden pocket watch, smirking over a crashing red stock chart behind him. |
| Le Sphinx, Poseur d'Énigmes (philo) | `boss/sphinx.png` | A majestic sphinx with a lion body and enigmatic human face, golden headdress, one eyebrow raised, floating question-mark hieroglyphs. |
| Nova, Supernova Savante (ens. sci.) | `boss/nova.png` | A cosmic entity made of swirling galaxy and starlight, feminine silhouette, supernova halo crown, serene powerful gaze. |
| Nox, l'Ombre du Bulletin (fallback) | `boss/nox.png` | A mysterious shadow creature made of dark ink and floating torn report-card papers, two glowing amber eyes, playful menace. |

**Rangs I→III** : pas besoin de 3 artworks — au rang II/III ajoute en CSS un
anneau/aura (déjà l'esprit du design). Si tu veux le luxe plus tard : reprendre
chaque portrait en référence + `add glowing amber battle aura and battle scars`.

---

## Batch 4 — Trésor / coffre / boutique / collection

`lib/tresor.ts` / `TresorHome.tsx`.

### Coffre (2 images, remplace 🎁)
- `tresor/coffre-ferme.png` — An ornate treasure chest, navy wood with golden metal bands and an acorn-shaped lock, closed, slight magical glow from the seams.
- `tresor/coffre-ouvert.png` — The same chest wide open, burst of golden light, coins and sparkles flying out.
- `tresor/piece.png` — A single shiny golden coin embossed with a tiny graduation-cap owl emblem. (remplace 🪙, sert aussi à `DailyLoginReward`)

### Cartes de savants (8) — génère en UNE planche
> A 4x2 grid sprite sheet of collectible trading-card portraits of famous
> scientists as friendly cartoon characters, each in an ornate card frame:
> Isaac Newton with a falling apple; Marie Curie with a glowing green vial;
> Pythagoras with a golden triangle; Ada Lovelace with punched cards and gears;
> Albert Einstein with wild hair and E=mc² chalk glow; Champollion with the
> Rosetta stone; Charles Darwin with a giant tortoise; Hypatia with an
> astrolabe and starry sky.

Fichiers : `tresor/savant-newton.png` … `savant-hypatie.png`.
Raretés (commune/rare/épique/légendaire) = cadre coloré en CSS, pas en image.

### Boutique (9 items) — planche 3x3
> A 3x3 grid sprite sheet of game shop item icons: an ice cube freezing a small
> flame; a golden lightning bolt with "x2" energy; a blue mystical flame; a
> starry night-sky orb; an astronaut helmet; a rainbow flame; a tiny navy
> graduation cap; round scholar glasses; a cozy winter scarf.

Fichiers : `tresor/item-freeze.png`, `item-double.png`, `item-flamme-azur.png`,
`item-theme-nuit.png`, `item-avatar-astro.png`, `item-flamme-rainbow.png`,
`item-chapeau.png`, `item-lunettes.png`, `item-echarpe.png`.
Les 3 accessoires compagnon (chapeau/lunettes/écharpe) doivent pouvoir se
superposer sur les images du compagnon (batch 2) → les regénérer si besoin avec
le compagnon en référence.

---

## Batch 5 — Badges (8) — planche 4x2

`BadgeGrid.tsx`. **Un seul état suffit** : le verrouillé = `grayscale + opacity`
en CSS (déjà le cas).

> A 4x2 grid sprite sheet of achievement badge icons, each on a round medal
> base with navy rim and golden center: a proud flame (7-day streak); a golden
> trophy with laurels (30 days); a brilliant diamond (100 days); a golden
> anchor (anchored habit); a cheerful school bus with motion lines (learning
> on the go); a sprouting seedling (first step); a target with an arrow
> bullseye (sharp mind); a perfect golden star with sparkles (flawless quiz).

Fichiers : `badges/serie-7.png`, `serie-30.png`, `serie-100.png`,
`habitude-ancree.png`, `trajets-10.png`, `premiere-habitude.png`,
`quiz-10.png`, `sans-faute.png`.

### Médailles de maîtrise (5) — planche 5x1 (remplace 🥉🥈🥇💎👑)
> A row of 5 rank medallions, same shape, ascending prestige: bronze, silver,
> gold, diamond (icy blue crystal), legendary (golden crown with amber flame halo).

Fichiers : `medailles/bronze.png` … `legendaire.png` (`ChapterExplorer.tsx`).

---

## Batch 6 — Illustrations d'écrans (le « waouh »)

Format paysage 3:2 ou 16:9 pour celles-ci. Toujours la mascotte en référence.

| Écran | Fichier | Prompt |
|---|---|---|
| Login (aucun visuel aujourd'hui) | `illustrations/login-hero.png` | The owl mascot flying joyfully over an open giant book at dawn, golden light, papers and stars trailing, warm welcoming mood. |
| Onboarding | `illustrations/onboarding.png` | The owl mascot handing a glowing golden key to the viewer, doorway of light shaped like a graduation cap behind. |
| Victoire de défi | `illustrations/victoire.png` | The owl mascot triumphant on a podium, golden confetti rain, trophy held high, fireworks of amber sparks. |
| Défaite encourageante | `illustrations/defaite.png` | The owl mascot dusting itself off with a determined smile, bandage on forehead, clenched wing, "get back up" energy, warm light. |
| Empty state révisions | `illustrations/vide-reviser.png` | The owl mascot peacefully napping on a stack of closed books under a reading lamp, cozy, a small "zzz" of stars. |
| Examen blanc réussi | `illustrations/examen-reussi.png` | The owl mascot in full graduation outfit throwing its cap in the air, diploma scroll, golden burst. |
| Série perdue (gel) | `illustrations/serie-gelee.png` | A small flame safely preserved inside a crystal ice cube, cute and reassuring, soft blue glow. |

---

## Batch 7 — Décors de matières (onglet Réviser)

Un décor vertical par matière, affiché sur la tuile/le header de la matière pour
donner envie d'entrer dans le programme. **Format portrait 9:16, 2K.**
L'arène maths déjà générée sert d'**image de référence de style** pour tous les
suivants. Structure commune : une arène de cristal marine + un **emblème doré
géant** flottant au centre + des **constellations thématiques** dans le ciel.

### Le prompt de style maître « décor » (à coller au début de chaque prompt)

⚠️ **Piège vérifié** : si on joint la référence sans précaution, le modèle
recopie son **symbole ∞** au centre (c'est arrivé sur le décor français).
D'où les deux garde-fous du prompt : la référence ne sert **que** pour le style,
et l'interdiction explicite de l'infini.

> Use the reference image ONLY for the art style, color mood and rendering —
> do NOT copy its content or symbols. The infinity symbol must NOT appear
> anywhere in this image. Stylized 2D mobile-game environment splash art:
> a mystical arena at night under a starry sky, warm golden light, stone
> platform in the center, soft painterly cel shading, vertical 9:16
> composition, no text, no characters, no watermark. Floating above the
> platform, ONE large glowing golden emblem, which is: [EMBLÈME].

**Rattrapage sans tout regénérer** : Nano Banana édite bien une image
existante. Pour un décor réussi mais avec le mauvais emblème, joindre l'image
**à corriger** (pas la référence maths) et demander uniquement le remplacement,
ex. pour le français :

> Edit this image: remove the glowing golden infinity symbol and replace it
> with a giant glowing golden quill feather dripping a drop of golden ink.
> Keep everything else exactly identical.

### Les 15 prompts complets (copier-coller tel quel, référence maths jointe)

Chaque prompt inclut une **couleur d'accent** = la couleur de la matière dans
l'app (`subjects.color`), comme le rouge apparu naturellement sur le décor
français.

**maths** → `matieres/maths.webp` (couleur app : bleu)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant π (pi) symbol. In the starry sky, golden constellations of a right triangle, a fraction and multiplication signs. A giant golden compass and ruler standing like obelisks around the arena. Deep navy and sky-blue accents.

**maths-expertes** → `matieres/maths-expertes.webp` — **déjà générée** (l'image ∞).
Pour la regénérer un jour (sans la clause anti-infini, évidemment) :
> Use the reference image ONLY for the art style, color mood and rendering. Stylized 2D mobile-game environment splash art: a mystical arena of navy rock and blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant infinity symbol. In the starry sky, golden constellations of a parabola, a Fibonacci golden spiral and wireframe polyhedra. Floating geometric solids among the crystals. Deep navy and royal-blue accents.

**francais** → `matieres/francais.webp` (rouge) — déjà générée, corriger le ∞
avec le prompt d'édition ci-dessus. Pour une regénération complète :
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant elegant quill feather dripping a drop of golden ink. In the starry sky, golden constellations of open books and cursive calligraphy strokes. Giant books, parchment scrolls and candlesticks around the arena. Warm red and gold accents.

**histoire-geo** → `matieres/histoire-geo.webp` (orange)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant ornate hourglass with flowing golden sand. In the starry sky, golden constellations of a pyramid, an ancient temple and a sailing ship. Old parchment scrolls and ancient stone ruins around the arena. Warm orange accents.

**anglais** → `matieres/anglais.webp` (indigo)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant Big Ben clock tower. In the starry sky, golden constellations of a royal crown, a double-decker bus and a cup of tea. Red telephone boxes and British flags around the arena. Indigo-blue and red accents.

**espagnol** → `matieres/espagnol.webp` (jaune)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant radiant sun with wavy rays. In the starry sky, golden constellations of a Spanish guitar, a flamenco fan and a bull. Terracotta arches and orange trees around the arena. Warm yellow and red accents.

**latin** → `matieres/latin.webp` (jaune)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant golden laurel wreath. In the starry sky, golden constellations of an imperial eagle and a Colosseum arch. Roman marble columns around the arena. Warm golden-yellow accents.

**svt** → `matieres/svt.webp` (vert)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant DNA double helix. In the starry sky, golden constellations of a butterfly, a leaf and a living cell. Luminous vines and giant glowing plants growing over the arena. Emerald-green accents.

**physique-chimie** → `matieres/physique-chimie.webp` (violet)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant atom with orbiting electrons. In the starry sky, golden constellations of molecules and a lightning bolt. Giant glass flasks with glowing liquids around the arena. Violet-purple accents.

**enseignement-scientifique** → `matieres/enseignement-scientifique.webp` (teal)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant ringed planet. In the starry sky, golden constellations of a telescope, orbital paths and a comet. Floating asteroids and a small observatory dome around the arena. Teal accents.

**technologie** → `matieres/technologie.webp` (gris ardoise)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant gear wheel. In the starry sky, golden constellations of circuit-board traces and bolts. Robotic pillars with glowing joints around the arena. Steel-grey accents.

**nsi** → `matieres/nsi.webp` (violet)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant pair of code angle brackets. In the starry sky, golden constellations of circuit traces and pixel clusters. Floating holographic screens around the arena. Violet-purple accents.

**ses** → `matieres/ses.webp` (teal)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant balance scale. In the starry sky, golden constellations of a rising line chart and coins. Stacks of golden coins and market stalls around the arena. Teal accents.

**hggsp** → `matieres/hggsp.webp` (orange) — v2 : la v1 (globe à méridiens +
rose des vents + réseau + échecs) était illisible, trop d'idées. Un seul
concept : le monde comme jeu de stratégie.
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a majestic SOLID golden globe of planet Earth with embossed continents in relief (not a wireframe icon), crowned with a golden laurel wreath. A few giant chess pieces standing among the blue crystals around the arena. In the starry sky, only three small golden constellations: a chess knight, a shield and a dove. Warm orange accents on the platform.

**philosophie** → `matieres/philosophie.webp` (rose)
> Use the reference image ONLY for the art style, color mood and rendering — do NOT copy its content or symbols. The infinity symbol must NOT appear anywhere in this image. Stylized 2D mobile-game environment splash art: a mystical arena of navy-blue rock and glowing blue crystals at night under a starry sky, warm golden light, stone platform in the center, soft painterly cel shading, vertical 9:16 composition, no text, no characters, no watermark. Floating above the platform, ONE large glowing golden emblem: a giant question mark shaped like a torch flame. In the starry sky, golden constellations of a thinking silhouette and a lantern. Ancient stone busts and a small owl statue around the arena. Soft pink accents.

Intégration : `public/images/matieres/<slug>.webp`, affichés dans l'onglet
Réviser (`SubjectsHome.tsx` pour les tuiles, `app/reviser/[subject]/page.tsx`
pour le header du programme). Prévoir un dégradé sombre en bas (CSS) pour la
lisibilité du titre par-dessus.

---

## Batch 8 — Vignettes de matières « carnet violet » (accueil Réviser)

La maquette validée (2026-07-10) : cartes blanches sur fond crème, header
violet, et **une illustration flat colorée qui déborde du coin droit de chaque
carte** (calculatrice, plume, casque romain…). Style DIFFÉRENT du style maître
« Toque & Gland » : flat vector moderne, pas de contours marine.

**Format 1:1, 512×512.** Fond blanc uni → détourer → **WebP transparent**
< 40 Ko → déposer dans `public/images/matieres/vignettes/<slug>.webp` → ajouter
le slug à `VIGNETTE_SLUGS` dans `lib/subject-style.ts` (repli médaillon sinon).
Générer la première (maths), la garder en **référence de style** pour toutes
les autres (`match the exact art style of the reference image`).

### Le prompt de style maître « vignette » (à coller au début de chaque prompt)

> Flat 2D vector illustration sticker for a playful mobile learning app for
> teenagers, modern flat design, soft rounded shapes, NO outlines, vibrant
> saturated palette (turquoise, coral pink, vivid purple, sunny yellow, sky
> blue), simple two-tone flat shading, a few small abstract confetti shapes
> (triangles, dots, squiggles) scattered around the main object, main object
> large and slightly tilted, isolated on a plain flat white background,
> square composition, no text, no watermark.

| Matière | Fichier `vignettes/` | Objet principal (après le style maître) |
|---|---|---|
| maths | `maths.webp` | A friendly blue calculator with sky-blue screen, surrounded by floating geometric shapes: a turquoise triangle, a purple ruler, a yellow protractor. |
| maths-expertes | `maths-expertes.webp` | A glowing purple infinity symbol intertwined with a golden spiral and small floating polyhedra. |
| francais | `francais.webp` | An elegant large purple quill feather with a coral-pink ink blot and small lilac leaves, a tiny open book below. |
| histoire-geo | `histoire-geo.webp` | A golden-orange Roman gladiator helmet with a bright crest, next to a small teal globe on a coral stand. |
| hggsp | `hggsp.webp` | A teal globe of planet Earth with a golden chess knight piece leaning against it and a small purple shield. |
| anglais | `anglais.webp` | A cheerful Big Ben clock tower in indigo and cream with a tiny Union Jack flag and a coral cup of tea. |
| espagnol | `espagnol.webp` | A sunny yellow Spanish guitar with a coral-red flamenco fan and a small orange sun. |
| latin | `latin.webp` | A golden laurel wreath around a cream marble column, with a small purple scroll. |
| svt | `svt.webp` | A big teal-green spiral seashell with a young green sprout and a small purple butterfly. |
| physique-chimie | `physique-chimie.webp` | A round sky-blue chemistry flask with bubbling turquoise liquid and floating purple bubbles, a small yellow lightning bolt. |
| enseignement-scientifique | `enseignement-scientifique.webp` | A teal telescope pointing at a coral-pink ringed planet with small yellow stars. |
| technologie | `technologie.webp` | A friendly slate-blue robot head with turquoise eyes and a big yellow gear behind it. |
| nsi | `nsi.webp` | A purple laptop with colorful code brackets on screen and small floating pixel squares in turquoise and pink. |
| ses | `ses.webp` | A rising turquoise bar chart with golden coins and a coral arrow pointing up. |
| philosophie | `philosophie.webp` | A soft-pink glowing lantern next to a small cream thinking-statue bust and a purple question mark. |

### Vignettes « culture » (migration 190 — thèmes sortis du dossier Culture générale)

Mêmes contraintes et même prompt de style maître que ci-dessus. Une fois chaque
image déposée dans `public/images/matieres/vignettes/`, ajouter son slug à
`VIGNETTE_SLUGS` (lib/subject-style.ts) — en attendant, la carte replie sur le
médaillon d'icône.

| Matière | Fichier `vignettes/` | Objet principal (après le style maître) |
|---|---|---|
| economie | `economie.webp` | A large golden coin with a classical profile portrait, a rising turquoise line-chart arrow behind it and two small purple factory chimneys. |
| finances-personnelles | `finances-personnelles.webp` | A cheerful coral-pink piggy bank with golden coins dropping into its slot and a small turquoise wallet leaning against it. |
| fiscalite | `fiscalite.webp` | A long cream paper receipt curling at the bottom with a big purple percent sign on it, golden coins and a small teal calculator. |
| entrepreneuriat | `entrepreneuriat.webp` | A coral rocket lifting off from an open purple cardboard box, with a sunny yellow lightbulb and small turquoise spark shapes. |
| figures-historiques | `figures-historiques.webp` | A cream marble bust statue wearing a purple Napoleon-style bicorne hat, with a small blue-white-red French cockade ribbon and a golden laurel branch. |

---

## Batch 9 — Icônes de la barre d'onglets (5)

`Navigation.tsx` — remplace les icônes Lucide de la barre horizontale
(Amis, Réviser, Défi, Moi, Trésor). Contraintes spécifiques : l'icône doit
**rester lisible à 24 px** → un seul objet, silhouette simple, contours épais,
pas de petits détails. Générer en 1:1, détourer, exporter WebP 128×128.

**Astuce cohérence** : générer les 5 en UNE image
(`a 1x5 grid sprite sheet of five app tab-bar icons...`) puis découper —
la cohérence interne d'une planche est meilleure que 5 générations séparées.

**Style spécifique à ce batch** (référence SchoolMouv validée par Lucas —
remplace le style maître, PAS de contours ici) :

> Glossy 3D emoji-style app icon, in the style of modern Apple emojis: smooth
> rounded puffy shapes, vibrant saturated gradients, soft shiny highlights and
> subtle inner glow, NO outlines, playful and juicy. Palette: deep navy blue
> #2F3B6B, vivid violet #7C3AED, warm golden yellow #FBBF24, flame gradient
> amber to red-orange. Single object, bold readable silhouette, legible at very
> small size, no fine details. Centered, square composition, isolated on a
> plain flat white background, no text, no watermark.

| Onglet | Fichier | Prompt |
|---|---|---|
| Amis | `nav/amis.webp` | Two cheerful glossy round character heads side by side, one navy blue and one golden yellow, slightly overlapping, both smiling warmly. |
| Réviser | `nav/reviser.webp` | A glossy violet backpack with golden zipper and a small yellow badge, puffy and shiny like a 3D emoji. |
| Défi | `nav/defi.webp` | A glossy vivid flame, amber core with red-orange tips, shiny highlights, energetic — like the fire emoji but juicier. |
| Moi | `nav/moi.webp` | A glossy cute smiling flame character head with big friendly dark eyes and rosy cheeks, amber-to-orange gradient, shiny emoji finish. |
| Trésor | `nav/tresor.webp` | A glossy navy treasure chest with golden trim, lid slightly open with shiny gold coins spilling out and tiny sparkles. |

> État actif/inactif : garder les icônes en couleur et gérer l'état en CSS
> (pastille de fond + scale sur l'actif, opacité réduite sur l'inactif) —
> ne PAS générer de variantes grises.

---

## Batch 10 — Icônes-boutons du débrief d'habitudes (onglet Moi)

`DebriefCard.tsx` — l'image EST le bouton dans la grille « Mauvaises / Saines
habitudes » : 2 icônes par paire du catalogue `lib/debrief.ts` (le frein et
l'habitude saine), soit **16 icônes**. Comme les onglets : un seul objet,
silhouette lisible à petite taille, pas de petits détails.

**Style** : le même style « emoji 3D glossy » que le batch 9 (coller son prompt
de style maître au début de chaque prompt). Garder les icônes « mauvaises »
aussi colorées que les saines — l'état (sélection, retrait) est géré en CSS.

**Format 1:1, 256×256.** Détourer → **WebP transparent** < 40 Ko → déposer dans
`public/images/debrief/<id>-bad.webp` et `<id>-good.webp` → ajouter l'id à
`DEBRIEF_ICON_IDS` dans `lib/debrief.ts` (repli émoji tant que la paire est
incomplète).

| id | `<id>-bad.webp` (le frein) | `<id>-good.webp` (l'habitude saine) |
|---|---|---|
| hydratation | A glossy takeaway soda cup with a red straw and fizzy bubbles. | A glossy sky-blue glass of fresh water with shiny droplets and a small splash. |
| questions | A glossy emoji face with a golden zipper closing its mouth. | A glossy raised hand, golden yellow, palm open, energetic. |
| telephone | A glossy smartphone buzzing with red notification bubbles and vibration lines. | A glossy smartphone face down with a violet crescent moon (do not disturb). |
| coucher | A glossy wide-awake owl under a navy crescent moon and stars. | A glossy sleeping emoji face with rosy cheeks and golden « zzz » letters. |
| bachotage | A glossy alarm clock about to ring on top of a messy pile of books. | A glossy violet calendar page with golden checkmarks on several days. |
| relecture | A glossy open book with sleepy half-closed emoji eyes floating above it. | A glossy coral-red dartboard target with a golden dart in the bullseye. |
| pauses | A glossy overheated red emoji face with sweat drops and steam. | A glossy rounded turquoise pause button with two soft bars, shiny finish. |
| petit-dej | A glossy empty plate with crossed fork and knife, a small sad sparkle. | A glossy golden croissant next to a small glass of orange juice. |

---

## Batch 11 — Champions de matière plein pied (bouton Boss sur Réviser)

Feature « Champion de matière » : chaque boss du Défi devient aussi le champion
de sa matière sur la page Réviser — un bouton **Boss** y lance un combat sur
tout le programme (vies + jauge de PV, rangs I→III existants). Il faut donc le
**plein pied** de chaque personnage pour l'écran de combat, en plus du portrait
médaillon du batch 3.

**Règle de cohérence** : joindre le portrait du batch 3 en **image de référence**
pour chaque personnage (`match the exact character and art style of the reference
image`). Générer les portraits d'abord si ce n'est pas fait.

Préfixe commun : `match the exact character and art style of the reference
image. Full body view of the same character, confident battle-ready stance,
facing the viewer in 3/4 view, dynamic but friendly, feet visible, centered,
isolated on a plain flat white background.`

| Champion | Fichier | Complément de prompt |
|---|---|---|
| Delta (maths) | `boss/delta-full.png` | The slate golem standing tall, one fist raised glowing with golden equations, cracked confident grin. |
| Grammatork (français) | `boss/grammatork-full.png` | The ogre in his tattered academic robe, giant quill held like a war club over his shoulder. |
| Imperator (latin) | `boss/imperator-full.png` | The imperial eagle perched upright on a marble capital, wings half-spread, laurel crown and red sash. |
| Chronos (histoire-géo) | `boss/chronos-full.png` | The hooded keeper floating slightly, hourglass body swirling with golden sand, clock gears orbiting. |
| Big Ben (anglais) | `boss/bigben-full.png` | The dapper dragon standing with a cane umbrella, Union-Jack top hat, teacup in the other claw. |
| El Toro (espagnol) | `boss/eltoro-full.png` | The bull standing on two legs, matador cape flowing, one hoof stomping arena dust. |
| Dr Plasma (physique-chimie) | `boss/plasma-full.png` | The mad scientist in lab coat, lightning arcing between raised hands, goggles up on forehead. |
| Mitochondrix (SVT) | `boss/mitochondrix-full.png` | The bioluminescent microbe creature rearing up, tentacle cilia spread, organelles glowing. |
| Bugzilla (NSI) | `boss/bugzilla-full.png` | The glitchy pixel-bug on six legs, antennas sparking, trailing neon-green code fragments. |
| Mécatron (techno) | `boss/mecatron-full.png` | The battle robot in full stance, wrench hand raised, visor glowing, steam venting from shoulders. |
| Krach (SES) | `boss/krach-full.png` | The wolf in pinstripe suit leaning on a cane, pocket watch dangling, sly grin. |
| Le Sphinx (philo) | `boss/sphinx-full.png` | The sphinx seated regally, lion body fully visible, golden headdress, floating question marks. |
| Nova (ens. sci.) | `boss/nova-full.png` | The cosmic entity hovering, galaxy body flowing like a gown, supernova halo blazing. |
| Nox (fallback) | `boss/nox-full.png` | The ink-shadow creature rising in a swirl of torn report-card papers, amber eyes glowing. |

**Format** : personnage plein pied → cible **768×1024** (3:4), détourer →
**WebP transparent** < 80 Ko → `public/images/boss/<id>-full.webp`.
Les rangs II/III restent gérés en CSS (aura/anneau), comme pour les portraits.

---

## Batch 12 — Scènes des modes de jeu (feuille « Modes » du Défi)

Objectif : casser le violet uniforme de la feuille des modes. Chaque billet
(ticket Clash Royale de `ModesSheet.tsx`) reçoit une **scène illustrée
plein-fond** avec sa propre ambiance colorée — le violet reste le cadre de
l'app, les modes deviennent des mondes. Le titre, le jeton XP et le ruban
« ×2 XP »/« Bientôt » restent posés **en code** (jamais de texte dans l'image :
le mode du jour change chaque jour, les bonus aussi).

**Contrainte de composition (cruciale)** : le titre s'affiche sur la moitié
gauche du billet → sujet principal dans le **tiers droit**, moitié gauche plus
calme et plus sombre (le texte blanc doit rester lisible). Le billet fait
~2.5:1 en hauteur 136 px : générer en **16:9 (1536×864)**, le CSS rognera
haut/bas — garder l'action au centre vertical.

**Format** : 16:9 → **WebP < 100 Ko** → `public/images/defi/modes/<id>-scene.webp`.
Générer la première (blitz), la garder en **référence de style** pour les
autres (`match the exact art style of the reference image`).

**✅ LIVRÉ (2026-07-22)** : les 5 scènes (blitz, duel, chrono, survie, boss)
sont générées et branchées (`modeScene()` dans `lib/defi-modes.ts`, fond
plein-cadre du corps du billet dans `ModesSheet.tsx`). Sources PNG 4K dans
`assets-sources/bannieres-modes/` (hors git).

### Le prompt de style maître « scène de mode » (à coller au début de chaque prompt)

**Higgsfield** : cocher le format **16:9** dans l'interface — le ratio ne se
met PAS dans le prompt (ça embrouille le modèle). Le prompt ne décrit que la
composition : sujet unique dans le tiers droit, les deux tiers gauches vides.

> Highly detailed vibrant cartoon splash art scene for a playful mobile
> quiz battle game for teenagers, rich painterly shading, bold chunky
> shapes with thick clean outlines, dramatic cinematic lighting, glowing
> atmospheric depth, volumetric clouds and mist, rich saturated colors,
> premium mobile-game event splash art. The artwork is FULL-BLEED and
> fills the ENTIRE canvas edge to edge — no frame, no border, no white
> margins, no card, no mockup, no letterboxing.
> Composition: ONE single hero subject placed in the RIGHT third of the
> image; the same rich atmospheric background continues across the LEFT
> two thirds but gets progressively darker toward the left, with only soft
> clouds, glow and floating particles there — no objects and no characters
> on the left side. No text, no letters, no logo, no watermark.

**Piège appris (2026-07-22)** : demander une gauche « vide/calme/simple »
appauvrit TOUT le rendu (le modèle aplatit l'image entière). Il faut décrire
une gauche **riche mais sombre et sans objet**, jamais « empty ».

**Piège appris (2026-07-22, bis)** : le mot **« banner »** dans le prompt fait
dessiner à Higgsfield une *maquette de bannière* — une petite image encadrée de
blanc au centre de la toile (vu sur `duel-scene`). Dire « splash art scene » +
« full-bleed, fills the entire canvas edge to edge, no frame, no border ».

| Mode | Fichier | Scène (après le style maître) |
|---|---|---|
| Duel fantôme | `duel-scene.webp` | A mischievous friendly translucent cyan ghost wearing a gaming headset, striking a challenge pose with sparks flying, spectral teal-and-midnight-blue misty background, glowing wisps. |
| Blitz 60s | `blitz-scene.webp` | A giant electric yellow lightning bolt character sprinting at full speed, orange energy trail behind it, amber-and-gold storm background, crackling sparks. |
| Contre-la-montre | `chrono-scene.webp` | A golden hourglass bursting with flowing sand that turns into glowing clock hands, deep teal-and-blue background with speed lines, floating gears. |
| Survie | `survie-scene.webp` | A single glowing heart held inside a cracked shield, embers and small flames rising, crimson-and-dark-red arena background, dramatic but fun, never scary. |
| Boss de la semaine | `boss-scene.webp` | A massive royal golden crown radiating light above a dark menacing (but cartoonish) silhouette with glowing eyes, deep purple-and-gold throne-room background, epic. |

---

## Batch 13 — Scènes des jeux de matière (roulette de la feuille « Modes »)

La suite directe du batch 12 : les billets violets des jeux de la roulette
(Capitales du monde, La Frise folle…) reçoivent leur scène plein-fond, avec le
**même style maître** que les 5 modes fun (le coller au début de chaque prompt,
et donner une scène du batch 12 en référence : `match the exact art style of
the reference image`).

**Lien de famille** : chaque MATIÈRE a sa palette dominante — les 2-3 jeux
d'une même matière partagent l'ambiance, comme une collection. Palettes
choisies pour ne pas répéter celles des modes fun (teal fantôme, ambre Blitz,
bleu Chrono, cramoisi Survie, violet-or Boss) :

| Matière | Ambiance commune |
|---|---|
| Histoire-Géo | émeraude + or vieux parchemin |
| Français | bordeaux + bleu encre |
| Maths | marine profond + or cosmique |
| Anglais | bleu royal + rouge pop |
| Espagnol | écarlate + tournesol fiesta |
| SVT | vert menthe + teal jungle |
| Physique-Chimie | teal sombre + vert néon de labo |

**Format** : identique au batch 12 — 16:9 (1536×864, cocher le ratio dans
Higgsfield, pas dans le prompt), sujet unique dans le **tiers droit**, gauche
riche mais sombre et sans objet, **jamais de texte ni de lettres** (les jeux de
mots utilisent des cartes/bulles VIERGES). WebP < 100 Ko →
`public/images/defi/jeux/<id>-scene.webp`.

**Câblage** : `gameScene(id)` dans `lib/defi/modes-catalog.ts` — ajouter l'id
du jeu à `GAME_SCENE_IDS` dès que sa scène est déposée. Sources PNG 4K dans
`assets-sources/bannieres-jeux/` (hors git).

**✅ Livrées (2026-07-22)** : conjugaison-eclair, frise-folle, orthographe,
chasse-faute, capitales, pointe-carte, calcul-mental, traduction-flash,
traduccion-flash. Restent : compte-est-bon, suite-logique, faux-amis,
phrase-en-vrac, falsos-amigos, anatomie-express, classe-moi-ca,
chasse-elements, bonne-unite.

| Jeu | Fichier | Scène (après le style maître) |
|---|---|---|
| Capitales du monde | `capitales-scene.webp` | A cheerful spinning globe character surrounded by tiny famous landmarks popping out of it (tower, pyramid, big clock), small blank waving flags orbiting around, deep emerald-and-antique-gold atlas background with glowing dotted travel routes. |
| La Frise folle | `frise-folle-scene.webp` | A long parchment scroll unrolling and twisting like a roller-coaster track, tiny historical icons riding it (a crown, a knight helmet, a rocket), sepia-and-gold dusty library background with floating candle sparks. |
| Pointe la carte | `pointe-carte-scene.webp` | A giant glossy red map pin character slamming into a stylized blank paper map with a burst of impact, a glowing compass rose spinning beside it, deep emerald-and-parchment cartography background. |
| Duel d'orthographe | `orthographe-scene.webp` | Two elegant fountain pens crossed like fencing swords, dark ink drops splashing like sparks between them, deep burgundy-and-ink-blue library background with floating quill feathers. |
| Chasse à la faute | `chasse-faute-scene.webp` | A giant golden magnifying glass revealing a sneaky little ink-blot creature caught in its lens, warm lamplight beam, deep plum-and-burgundy detective office background with drifting dust motes. |
| Conjugaison éclair | `conjugaison-eclair-scene.webp` | A heroic open book character surfing on a bolt of blue lightning, pages flapping at high speed, deep ink-blue-and-burgundy stormy background with electric sparks. |
| Calcul mental éclair | `calcul-mental-scene.webp` | A rocket-powered wooden abacus blasting forward with a fiery trail, its beads glowing like little stars, deep navy-and-gold cosmic background with shooting stars. |
| Le compte est bon | `compte-est-bon-scene.webp` | A glowing golden dartboard target with playful dice and blank tiles flying toward the bullseye, spotlight beams crossing, deep navy game-show background with golden confetti. |
| Suite logique | `suite-logique-scene.webp` | A mystical glowing crystal ball with a spiral of shining dominoes continuing a pattern inside it, deep midnight-blue-and-gold starry background with drifting sparkles. |
| Traduction flash | `traduction-flash-scene.webp` | Two cheerful blank speech-bubble characters high-fiving in mid-air with a bright energy flash between them, comic speed lines, royal-blue-and-red pop background with halftone dots. |
| Faux amis | `faux-amis-scene.webp` | Two twin theater masks — one smiling, one mischievous — secretly swapping blank cards behind their backs, crossing spotlight beams, deep royal-blue-and-crimson stage background with velvet curtains. |
| Phrase en vrac | `phrase-en-vrac-scene.webp` | Colorful blank jigsaw puzzle pieces snapping together in mid-air around a proud little puzzle-piece character flexing its arms, royal-blue-and-red workshop background with floating sparks. |
| Traducción flash | `traduccion-flash-scene.webp` | A festive blank speech-bubble character shaking maracas mid-dance, colorful papel-picado pennants and folding fans swirling around, warm scarlet-and-sunflower fiesta background with glowing lanterns. |
| Falsos amigos | `falsos-amigos-scene.webp` | Two flamenco-dancing twin masks swapping blank cards mid-twirl, rose petals and a red fan flying, deep carmine-and-orange stage background with warm string lights. |
| Anatomie express | `anatomie-express-scene.webp` | A friendly cartoon skeleton striking a sprinter pose while soft glowing organ shapes float around it waiting to snap into place, mint-and-deep-green laboratory background with DNA helix glows. |
| Classe-moi ça | `classe-moi-ca-scene.webp` | A cheerful trio — a lion cub, a gecko and a round frog — leaping through floating glowing sorting rings, lush emerald-and-teal jungle background with fireflies. |
| Chasse aux éléments | `chasse-elements-scene.webp` | A bubbling round-flask character with goggles chasing glowing colored orbs with a butterfly net, neon-green liquid sloshing, dark-teal-and-neon-green laboratory background with rising bubbles. |
| La bonne unité | `bonne-unite-scene.webp` | A heroic golden folding ruler and a round stopwatch character bumping fists, measuring tapes swirling like victory ribbons around them, dark-teal-and-amber workshop background with floating gears. |

---

## Batch 14 — Les 2 barres CTA de l'écran d'arène (Match classé + Modes de jeu)

Objectif : les deux barres pleine largeur sous l'arène (`app/defi/page.tsx` et
le déclencheur de `ModesSheet.tsx`) troquent leur robe unie (plaque or ciselé /
gemme violette) contre une **scène illustrée plein-fond**, comme les billets —
le « donne envie de cliquer » de Clash Royale. Titre, sous-titre et chevron
restent posés en code.

**Géométrie (différente des billets, cruciale)** : ces barres sont des
**bandeaux très plats** (~430×60, ratio ≈ 6,5:1). On génère quand même en
**16:9 (cocher dans Higgsfield)** : le CSS (`object-cover`) ne gardera que la
**bande horizontale centrale (~le tiers du milieu)**. Donc :

- TOUTE l'action sur la **ligne médiane horizontale** — rien d'important en
  haut ou en bas de l'image (coupés au rognage) ;
- sujet **compact, dans le quart droit** (il vit entre le texte et le chevron),
  pas de sujet géant qui déborde verticalement ;
- moitié gauche : le fond continue, riche mais **sans objet ni personnage**
  (le texte s'affiche là).

**Lisibilité — contrainte inversée entre les deux** :

- **Match classé** : le texte est **encre foncée** → la moitié gauche doit
  rester **claire et dorée** (jamais sombre).
- **Modes de jeu** : le texte est **blanc** → la moitié gauche doit rester
  **sombre et violette** (comme les billets).

**Format** : 16:9 → WebP < 100 Ko → `public/images/defi/<id>-scene.webp`.
Donner une scène du batch 12 en référence de style (`match the exact art style
of the reference image`).

### Prompt de style maître « barre CTA » (à coller au début de chaque prompt)

> Highly detailed vibrant cartoon splash art scene for a playful mobile
> quiz battle game for teenagers, rich painterly shading, bold chunky
> shapes with thick clean outlines, dramatic cinematic lighting, glowing
> atmospheric depth, rich saturated colors, premium mobile-game event
> splash art. The artwork is FULL-BLEED and fills the ENTIRE canvas edge
> to edge — no frame, no border, no white margins, no card, no mockup,
> no letterboxing.
> Composition: everything important sits on the HORIZONTAL CENTER LINE of
> the image — the top quarter and bottom quarter contain only background
> atmosphere. ONE compact hero subject in the RIGHT quarter of the image;
> the same rich atmospheric background continues across the rest with only
> soft glow and floating particles — no objects and no characters outside
> the right quarter. No text, no letters, no logo, no watermark.

**Pièges appris (2026-07-22, essai 1)** : (a) le sujet sort **centré** si le
prompt ne martèle pas « ENTIRELY in the RIGHT QUARTER, never crossing the
center » — centré = collision avec le texte de la barre ; (b) demander une
ambiance « arcade/néon » fait dessiner des **panneaux avec des mots** (« LEVEL
UP! », « LARN! »…) — interdire explicitement « no neon signs, no billboards,
no banners with words ».

| Barre | Fichier | Scène (après le style maître) |
|---|---|---|
| Match classé | `classe-scene.webp` | Two crossed cartoon swords through a compact golden laurel wreath with a small trophy cup gleaming between them, a tight emblem placed ENTIRELY in the RIGHT QUARTER of the image, never crossing the center — the left three quarters are only a luminous bright golden glow with soft light rays, warm bokeh crowd lights and sparkles, no objects there. The whole image stays bright and golden. The emblem is vertically centered and compact. No text, no letters, no numbers, no logo. |
| Modes de jeu | `modes-scene.webp` | A cheerful chunky game controller character standing on a small glowing stage, juggling a rainbow arc of small glowing colored orbs with simple mute icons (a book, a flask, a globe), placed ENTIRELY in the RIGHT QUARTER of the image, never crossing the center — the left three quarters fade into rich dark violet mist with floating confetti and particles only, no objects there. Deep royal-purple-and-magenta festive background with soft neon glows. Strictly NO text anywhere: no neon signs, no billboards, no banners with words, no letters, no numbers. |

**Câblage prévu** : dès les 2 PNG déposés → conversion webp → fond plein-cadre
dans le `<Link>` or (`app/defi/page.tsx`) et le `<button>` gemme
(`ModesSheet.tsx`) avec `next/image` + voile dégradé côté texte, robes
`olympe-gold`/`olympe-gem` conservées en repli tant que l'image manque.

**✅ LIVRÉ (2026-07-22)** : les 2 barres. `modes-scene.webp` branché dans le
déclencheur de `ModesSheet.tsx` (le « LEVEL UP » résiduel du bord droit a été
supprimé au rognage — couper à 3600 px avant resize) ; `classe-scene.webp`
(trophée mascotte + crayons croisés) branché dans le `<Link>` or de
`app/defi/page.tsx` avec voile CLAIR (`from-white/35`) côté texte — texte encre
sur or, on éclaircit au lieu d'assombrir. Sources dans
`assets-sources/bannieres-cta/`.

**Piège appris (2026-07-22, ter)** : une 16:9 `object-cover` dans une barre
6,6:1 = zoom ×2,6 sur la tranche centrale (on ne voyait que le visage du
trophée). Si le sujet doit rester ENTIER dans une barre plate → fabriquer la
bannière AU RATIO DE LA BARRE en composite sharp (fond = bande de dégradé
étirée, sujet complet réduit à la hauteur de bande, fondu aux bords, ancré à
droite) + `object-right` pour que les petits écrans ne rognent que le dégradé.
Script : scratchpad `classe-strip.mjs`. La barre Modes garde sa 16:9 rognée
(là, le zoom sur la mascotte rend bien).

**Piège appris (2026-07-22, quater)** : remplacer un webp SOUS LE MÊME NOM ne
suffit pas — l'optimiseur d'images de Next ressert sa version en cache (on a
cru la correction inefficace alors que c'était l'ancien fichier). Toujours
**renommer** l'asset quand on change son contenu (`classe-scene.webp` →
`classe-strip.webp`). Au passage, barre Match classé agrandie (`min-h-20`,
c'est LE CTA) et bannière refaite à ce ratio (1536×290, 5.3:1).

---

## Checklist technique

1. Générer → détourer → **WebP** (garde les PNG sources dans un dossier hors repo).
2. Tailles cibles : mascotte/boss/compagnon **512×512**, badges/items **256×256**,
   illustrations **1200×800**. Poids < 60 Ko par asset en WebP.
3. Arborescence : `public/images/{brand,compagnon,boss,tresor,badges,medailles,illustrations}/`.
4. Intégration : `next/image` avec `alt` descriptif (a11y), remplacer les emojis
   dans `CompagnonCard.tsx`, `BossMode.tsx`, `TresorHome.tsx`, `BadgeGrid.tsx`,
   `ChapterExplorer.tsx`, `DailyLoginReward.tsx`, `LoginForm.tsx`.
5. Mode sombre : les assets sur fond transparent passent bien ; éviter les fonds
   blancs opaques dans les images.
6. Ordre conseillé : Batch 1 → 2 → 3 (impact max), puis 4-6.
