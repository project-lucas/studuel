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
