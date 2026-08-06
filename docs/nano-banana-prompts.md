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

### P0-bis · Accueil Défi « façon Clash Royale » (2026-07-29 — remplace P0 sur `/defi`)

Décision : l'accueil du Défi copie la **grammaire** de l'écran d'accueil de Clash
Royale, avec notre mascotte. P0 (colisée) reste valable pour les décors de
match, mais **plus pour l'accueil**.

**Les 4 règles du décor CR** (à ne jamais casser, c'est ce qui fait tout) :

1. **Trois plans + un vrai plan au sol.** Ciel → architecture → sol qui fuit,
   caméra très légèrement au-dessus. Sans plan au sol, le héros est collé sur
   un poster.
2. **L'axe central est CLAIR — clair en valeur, pas délavé en couleur.** Le
   décor reste franchement saturé ; ce qui détache le héros, c'est qu'il est
   **sombre** et que le fond ne contient **aucun noir ni ombre profonde**. Ne
   jamais écrire « desaturated » : le modèle lave alors toute l'image (erreur
   commise le 29/07, cf. les pièges de la section A).
3. **Les bords restent riches mais peu contrastés** — c'est là que se posent les
   boutons ronds. Bords chargés = UI illisible.
4. **Guirlandes en diagonale en haut** : elles masquent la couture avec le
   bandeau d'UI et referment le cadre. **45 % du bas = sol vide** (la scène du
   socle, des slots et du CTA).

Monde retenu : **cour d'académie** (école-château). Palette : **ciel bleu**
(seul emprunt à CR, il fait énormément pour l'effet « jeu ») + le reste en
crème & violet + or.

Ordre de production : fond → mascotte → socle → 6 pictos ronds → 3 ressources →
4 coffres. **15 générations.**

#### A · Le fond — **LIVRÉ le 2026-07-29** : l'académie flottante, 6 heures

Le monde retenu n'est pas une cour au sol mais une **île flottante portant
l'académie**, en **six variantes horaires** branchées sur `lib/arena-background.ts`
(aube 5h, matin 8h, midi 12h, après-midi 15h, soirée 18h, nuit 21h). Le bas de
l'image est une pelouse ouverte : c'est le socle du personnage.

Dépôt : `public/images/arene/arena-{dawn,morning,noon,afternoon,evening,night}.webp`,
1080×1920, 53 à 72 Ko pièce.

**Le prompt de base** (une seule génération, puis les six heures en dérivent) :

> Highly detailed cartoon splash art background for a playful mobile quiz
> battle game for teenagers, painterly stylized 3D-cartoon look like a premium
> mobile game home screen, bold chunky shapes, thick clean outlines, glossy
> airbrushed shading, brilliant midday sunlight. Scene: a floating grassy
> island carrying a fantasy school-academy, drifting in a rich sky, seen
> head-on from a slightly elevated camera on the exact center axis. A deep
> saturated periwinkle sky with big crisp white volumetric clouds and a warm
> golden sun glow, a few small distant floating rocks. On the exact vertical
> center axis: a symmetrical academy building with warm cream stone walls, tall
> arched windows, deep violet pointed roofs and turrets, a golden clock above
> the entrance — softened only by a light warm atmospheric haze, but fully
> saturated. On the right edge of the island, a thin waterfall pours off the
> rim and dissolves into mist below. The lower half is one single continuous
> open lawn of lush vivid emerald green, sunlit, with only a few tiny purple
> flowers and drifting petals — completely free of objects, props and
> characters, it is an empty stage. Colour treatment: rich, vivid, highly
> saturated colours throughout, punchy premium mobile-game key art colour. The
> background is high-key: every value stays in the light-to-mid range, there is
> no black, no deep shadow, no dark corner; the darkest tone is a soft mid-tone.
> Depth comes from atmospheric haze and softness, not from darkening. Shadows
> are coloured — warm violet on cream stone, deep emerald on grass — never grey.
> Full-bleed vertical composition filling the entire canvas edge to edge, no
> frame, no border, no white margins, no letterboxing. No characters. No text,
> no letters, no numbers, no words, no logo, no watermark.

**Les six heures** : image de base en référence, format 9:16, et un seul bloc —
verrouillage + heure + fermeture — collé d'un coup. **Toujours repartir de
l'image de base**, jamais de la variante précédente, sinon l'île se déforme de
proche en proche.

Verrouillage : « Keep the exact same art style, composition, camera angle,
island shape, academy building, turret placement, waterfall, foreground lawn and
framing as the reference image. Change only the time of day, the sky, the
lighting and the colour temperature. »

Fermeture : « The foreground lawn stays bright, clean and clearly lit at all
times — it must never go dark, grey, olive or muddy. It is the brightest surface
in the lower half of the image. Keep the lower half as one single continuous
open lawn, completely free of objects, props and characters. Full-bleed vertical
composition edge to edge, no frame, no border, no white margins, no
letterboxing. No characters. No text, no letters, no numbers, no words, no logo,
no watermark. »

| Heure | Le cœur de la variante |
|---|---|
| Aube | blue hour, deep blue-violet sky with a few stars still visible, only a narrow rose-apricot band at the horizon, no sun disc, thick white mist wrapping the island, every window lit amber, cool mint-teal lawn |
| Matin | clean saturated sky-blue, big crisp cumulus, bright sun high on the left, lush emerald lawn with dew, short cool-violet shadows falling right, a few birds |
| Midi | deep periwinkle sky, brilliant white clouds, golden sun glow with bloom directly above, stone almost white on top surfaces, short tight shadows underneath |
| Après-midi | warm cornflower sky fading to creamy gold, clouds underlit peach, low golden sun on the right, honey-cream stone, long violet shadows sweeping right to left |
| Soirée | violet-to-magenta-to-gold vertical gradient, clouds rimmed in molten gold, sun sinking behind the island, windows blazing amber, fireflies rising |
| Nuit | indigo-to-teal sky with stars and milky way, a medium moon low and clearly OFF-CENTRE (loin de l'horloge), lanterns along the paths, luminous teal-emerald lawn under silver moonlight |

**Trois pièges payés cher sur ce lot** (2026-07-29) :

1. **Saturation ≠ valeur.** Demander « pale, sun-washed, desaturated » a lavé
   toute l'image. Clash Royale n'est pas délavé : son fond est **clair en
   valeur** et **saturé en couleur**. La bonne consigne est « rich saturated
   colours, but high-key: no black, no deep shadow, the darkest tone is a
   mid-tone ».
2. **Aucun mot en CAPITALES dans un prompt d'image.** Les étiquettes de
   structure (`TOP:`, `LOWER HALF:`) ont été **écrites en dur dans l'image**.
   Tout en prose minuscule.
3. **Le sol s'assombrit dès qu'on change l'heure.** Sans la phrase « the
   foreground lawn stays bright… it is the brightest surface in the lower half »,
   la nuit et l'aube rendent une pelouse gris-olive — et un personnage sombre y
   disparaît.

**Reskins saisonniers** (comme CR change d'habillage chaque mois) : même méthode
que les heures — image de base en référence + « change ONLY the season dressing
and the lighting to: … ». Le layout (île + bâtiment + horloge + cascade + pelouse)
ne bouge jamais. À produire ×6 heures, ou seulement sur midi si le budget serre.

| Saison | À demander |
|---|---|
| Rentrée | golden early-autumn light, orange and red leaves drifting, small pumpkins on the lawn |
| Hiver | soft snow on the roofs and lawn, pale cold blue sky, warm yellow light in the windows |
| Printemps | cherry blossom trees on the island, pink petals in the air, fresh green lawn |
| Examens | dramatic late-afternoon golden light, long shadows, torches lit on the facade |

#### B · La mascotte plein pied — format **3:4**

**Joindre la mascotte du splash en référence.** Sans elle, le visage dérive.

> Full body character render of the SAME boy character as the reference image —
> keep his exact face, hairstyle, round glasses, skin tone and outfit strictly
> identical. Highly detailed vibrant cartoon mascot for a playful mobile quiz
> battle game, painterly stylized 3D-cartoon look, bold chunky shapes, thick
> clean outlines, soft airbrushed shading. Pose: standing tall and heroic in a
> confident hero idle, three-quarter view turned slightly to his left, both
> fists planted firmly on his hips with elbows out wide, chest out, chin
> slightly up, warm confident smile, feet apart and solidly planted. Seen from
> a slightly LOW camera angle so he looks tall and imposing. Head to toe fully
> visible, with a little empty space above the hair and below the shoes.
> Lighting: bright neutral midday key light from the upper front, soft warm
> bounce light from below, a subtle golden rim light on the shoulders and hair
> to separate him from the background. Proportions: stylized mobile-game hero —
> slightly large head, wide shoulders, sturdy readable silhouette that still
> reads clearly at small size. Isolated on a plain flat neutral grey
> background, centered, no ground shadow, no podium, no props, no scenery, no
> text, no watermark.

Détourer, exporter en PNG 2× → webp. Fichier : `public/images/defi/mascotte-podium.webp`.

**Poses supplémentaires** (optionnel, pour `PersonnageAnime`) : même prompt,
image validée en référence + « keep the exact same character and art style,
change ONLY the pose to: … » → *victory: both arms raised, fists clenched,
laughing* / *thinking: one hand on the chin, eyebrow raised, looking up*.

#### C · Le socle — format **1:1**

> Game asset: a sturdy stylized podium platform for a playful mobile quiz
> game, seen from a slightly elevated three-quarter front angle. Carved cream
> stone base with a warm wood top surface and deep violet trim, rounded golden
> metal plates on the corners, a wide horizontal recessed empty slot across the
> front face (a groove meant to hold a progress bar), a small golden star
> emblem set into the left end of that groove. Painterly stylized 3D-cartoon
> look, bold chunky shapes, thick clean outlines, soft airbrushed shading,
> bright midday lighting, glossy highlights on the metal. Colours: cream,
> vivid purple, golden yellow, soft navy outlines. Isolated on a plain flat
> neutral grey background, centered, no text, no numbers, no watermark.

**Le bouton « Combattre » ne se génère pas** — biseau, dégradé jaune, ombre
portée et état pressé se font en CSS, sinon il ne peut pas s'animer ni changer
de libellé. Recette : dégradé `#FDD24B → #F5B722`, liseré interne blanc à 40 %
en haut, bordure basse `#C8890B` de 4 px, ombre portée dure de 6 px, radius
20 px, `translateY(3px)` au `:active`.

#### D · Les 6 pictos ronds — format **1:1**, un par génération

L'**anneau doré se fait en CSS**, pas dans l'image : chez CR tous les anneaux
sont rigoureusement identiques, et un générateur les fera tous différents. On ne
génère que le contenu.

Base commune :

> Game UI icon: **[SUJET]**. Painterly stylized 3D-cartoon look for a playful
> mobile quiz game, bold chunky rounded shapes, thick clean outlines, soft
> airbrushed shading, bright top-front lighting, glossy highlights. Slight
> three-quarter angle, tilted a few degrees, ONE single compact object that
> stays readable at 64 pixels. Colours: cream, vivid purple, golden yellow,
> soft navy outlines. Isolated on a plain flat white background, centered with
> even margins. No circle frame, no ring, no badge, no border, no background
> scenery, no text, no numbers, no watermark.

| Fichier | `[SUJET]` |
|---|---|
| `pictos/amis` | two friendly rounded character busts side by side, one violet and one cream, shoulders overlapping |
| `pictos/classement` | a three-step victory podium with a small golden trophy cup on the tallest step |
| `pictos/coffre` | a small closed treasure chest, warm wood with golden bands and a violet lock |
| `pictos/boutique` | a rounded shopping bag in violet with a golden handle and a purple gem tucked inside |
| `pictos/quetes` | a rolled-open parchment scroll with a violet wax seal and three golden checkmarks |
| `pictos/profil` | a heraldic shield crest in violet and gold with two crossed golden quills |

#### E · Les 3 ressources du bandeau — format **1:1**

Même prompt de base que D. Le cadre biseauté du compteur se fait en CSS.

| Fichier | `[SUJET]` |
|---|---|
| `ressources/xp` | a glowing sunny-yellow five-pointed star medallion with an embossed golden rim and a soft radiant halo |
| `ressources/pieces` | a small stack of three thick golden coins, each embossed with a tiny star, bright specular highlights |
| `ressources/cristal` | a single faceted brilliant-cut violet gemstone glowing softly from within, a few tiny sparkles around it |

Le trophée existe déjà (`public/images/defi/trophy-cup.webp`) — ne pas le refaire.

#### F · Les 4 coffres — format **1:1**

> Game reward asset: a closed treasure chest for a playful mobile quiz game,
> seen from a three-quarter front angle, slightly tilted, lid closed, sitting
> flat. **[MATIÈRE]**. Painterly stylized 3D-cartoon look, bold chunky rounded
> shapes, thick clean outlines, soft airbrushed shading, bright top-front
> lighting, glossy highlights, chunky readable silhouette. Isolated on a plain
> flat white background, centered, no ground shadow, no text, no numbers, no
> watermark.

| Fichier | `[MATIÈRE]` |
|---|---|
| `coffres/bois` | warm brown wood planks with simple dark iron bands and a small iron latch, humble and plain |
| `coffres/argent` | pale wood with polished silver bands, silver corner plates and a silver padlock, faint cool shine |
| `coffres/or` | rich violet wood with thick polished golden bands, ornate golden corners and a golden star lock, warm glow around it |
| `coffres/legendaire` | dark violet wood with elaborate golden filigree, a large glowing purple gem set in the lid, golden sparkles and soft rainbow light escaping from the seams |

### P0-ter · La rangée de combat — 3 plaques de bouton (2026-08-02)

**Le constat de Lucas** : depuis que l'arène est une illustration peinte, les
trois boutons du bas (Classé · DUEL 90 s · Modes) détonnent. Et c'est mérité :
ce sont des **dégradés CSS** (`.olympe-gold`, `.arena-flank` dans globals.css)
— du plat, aux bords nets, posé sur du peint. Clash Royale ne fait jamais ça :
ses boutons sont des OBJETS dessinés, avec matière, biseau et reflet.

On commande donc trois **plaques**, dans le style exact du décor.

#### La règle qui commande tout : la plaque, pas le bouton

L'image ne porte **ni texte ni chiffre** — le libellé reste rendu par l'app, et
il le doit : « DUEL 90 s » change de sous-ligne (raison du chapitre, ami en
ligne), porte une barre de progression et une échéance, et doit rester lisible
par un lecteur d'écran. Un mot gravé dans l'image serait aussi un mot qu'on ne
peut plus traduire ni corriger — sans compter que ces modèles écrivent mal (cf.
le piège « jamais de CAPITALES » plus bas).

L'ICÔNE, elle, est peinte dans la plaque : c'est elle qui fait tout l'effet
« objet de jeu », et elle ne change jamais. Le libellé se pose dessous, dans une
bande volontairement lisse réservée pour lui.

#### Géométrie mesurée (à respecter, sinon rien ne s'aligne)

| Plaque | Taille à l'écran | Format Higgsfield | Export |
|---|---|---|---|
| Classé (flanc gauche) | 72 × 72 px, fixe | **1:1** | 216×216 webp |
| Modes (flanc droit) | 72 × 72 px, fixe | **1:1** | 216×216 webp |
| DUEL 90 s (centre) | hauteur 64 px, **largeur VARIABLE** (~180 à 260 px) | **3:2** | 3 morceaux, cf. ci-dessous |

⚠️ **Le centre s'étire.** C'est le piège de ce lot : le bouton du milieu prend
toute la place que lui laissent ses deux flancs, donc sa largeur change d'un
téléphone à l'autre. Une image peinte étirée à 140 % se déforme visiblement —
les gemmes deviennent des olives. La plaque doit donc être **découpable en
trois** (9-slice) : les ornements confinés aux DEUX EXTRÉMITÉS, et tout le
milieu en dégradé lisse, sans rivet ni gravure. Le milieu s'étire sans que
personne ne le voie ; les caps ne s'étirent jamais.

#### A · « Classé » — plaque carrée sombre, trophée peint

Joindre `public/images/arene/arena-mascotte.webp` en référence.

> Match the exact art style of the reference image. Highly detailed painterly
> 3D-cartoon mobile game UI element for a premium fantasy quiz-battle game:
> ONE single square button plate with strongly rounded corners, seen perfectly
> head-on, flat orthographic view. Material: polished deep violet stone with a
> carved bevelled edge, a thin warm golden rim running around the outline, a
> soft glossy highlight along the top edge and a deeper violet at the bottom,
> thick clean dark ink outline all around the plate. Embossed in the UPPER
> HALF of the plate, a small golden laurel-wreath victory trophy, glossy and
> warmly lit, carved in relief. The LOWER THIRD of the plate is a smooth clean
> uninterrupted surface with no ornament, no carving and no detail. Tiny golden
> laurel sprigs in the two upper corners only. The plate is isolated and
> centered on a plain flat white background with generous empty margin all
> around. No text, no letters, no numbers, no words, no logo, no watermark, no
> UI mockup, no screen, no phone frame, no drop shadow on the background.

#### B · « Modes » — même plaque, borne d'arcade peinte

Même prompt que A, en remplaçant la phrase de l'icône par :

> Embossed in the UPPER HALF of the plate, a small glossy game controller with
> a golden d-pad and two violet gem buttons, carved in relief.

**Générer B en donnant A en référence** (« same plate, same material, same
lighting, only the embossed icon changes ») : c'est ce qui garantit que les deux
flancs soient jumeaux. Deux générations indépendantes donnent deux cousins, et
côte à côte l'écart se voit immédiatement.

#### C · « DUEL 90 s » — plaque d'or, découpable en trois

> Match the exact art style of the reference image. Highly detailed painterly
> 3D-cartoon mobile game UI element for a premium fantasy quiz-battle game: ONE
> single wide horizontal button plate with strongly rounded corners, seen
> perfectly head-on, flat orthographic view, filling the frame horizontally.
> Material: polished warm gold, bright buttery highlight along the top edge,
> deep amber and bronze at the bottom edge, a carved bevelled rim, thick clean
> dark ink outline all around the plate, a subtle warm glow spilling just
> around the plate. At the LEFT END and at the RIGHT END, symmetrically, a
> small round violet gem set in a golden laurel mount. The ENTIRE MIDDLE of the
> plate is one smooth uninterrupted polished gold gradient — completely free of
> ornament, rivets, engraving, gems and detail of any kind. The plate is
> isolated and centered on a plain flat white background with generous empty
> margin all around. No text, no letters, no numbers, no words, no logo, no
> watermark, no UI mockup, no screen, no phone frame.

#### Pièges de ce lot

- **Ne jamais écrire « button » seul.** Le mot fait dessiner une *maquette
  d'interface* — un écran de téléphone entier avec le bouton dedans. Dire
  « game UI element: ONE single plate », et fermer par « no UI mockup, no
  screen, no phone frame ».
- **Ne pas demander d'ombre portée.** Elle arrive collée au fond blanc et
  survit au détourage sous forme de halo gris. Le relief vient du biseau et de
  l'ombre dure du CSS (`0 4px 0`), qui existe déjà.
- **Le milieu du centre reste NU.** À la moindre gravure au milieu, la plaque
  n'est plus découpable et tout le lot est à refaire.
- Les trois plaques se jugent **ensemble et à la taille réelle** (72 px !), pas
  en grand sur l'écran du générateur : un biseau magnifique à 1024 px devient
  une bouillie grise à 72.

#### Après réception

1. Détourer (fond blanc peint — même piège que les vignettes, le détourage vit
   dans `scripts/lib/fond-peint.mjs`).
2. `public/images/defi/boutons/{classe,modes,duel}.webp`.
3. Câblage : les deux flancs remplacent `.arena-flank` par un
   `background-image` ; le centre passe en `border-image` avec un `slice`
   horizontal (caps figés, milieu étiré) — c'est le 9-slice CSS, aucune
   librairie. Les libellés, l'or du texte et l'ombre pressée (`.olympe-press`)
   ne bougent pas.

### P0 · Arène v2 — le fond du Défi (l'écran le plus vu du jeu)

Les 6 variantes actuelles (`public/images/arene/arena-*.webp`) sont cohérentes
et jolies, mais la scène est **déserte** : un escalier sans personne, aucun
sens de l'échelle. Une arène sans public n'est pas une arène — et c'est l'écran
que l'élève ouvre le plus souvent. La v2 garde toute l'identité (marbre blanc +
or, bannières violettes, médaillon aux plumes croisées en bas) et ajoute la
**vie** et la **démesure**.

Ce que la v2 change :

- **le public** : les gradins du colisée remplis d'une foule en silhouettes
  minuscules, floues et colorées, qui agite des fanions — vivante mais
  illisible (aucun visage, aucun détail net) ;
- **l'échelle** : deux statues colossales de savants couronnés de laurier
  tenant des plumes d'or géantes encadrent l'escalier ; l'arène flotte
  au-dessus d'une mer de nuages ;
- **la lumière** : rayons volumétriques visibles à travers l'arche, poussière
  dorée en suspension.

Contraintes de composition — **l'UI vit par-dessus** :

- format **9:16** (à cocher dans Higgsfield), livré en 1080×1920 ;
- le **cinquième haut** = ciel seul (le HUD blanc s'y pose) ;
- le **médaillon du bas** reste net, vide et peu chargé (le CTA Duel 90 s s'y
  pose) ;
- les éléments clés tiennent dans les **70 % centraux** de la largeur (le
  recadrage `cover` rogne les bords sur téléphone étroit) ;
- parchemins et bannières **vierges** — aucun texte nulle part (la variante
  morning actuelle a des parchemins griffonnés : à ne pas reproduire).

**Chemin de production** : générer d'abord **`afternoon`** (la plage la plus
vue, après les cours). Une fois validée, générer les 5 autres avec l'image
validée en référence + la mention « match the EXACT composition and every
architectural element of the reference image; change ONLY the sky, the
lighting and the mood ». Sans cette référence, les variantes divergent.

Dépôt : **mêmes noms de fichiers** (`arena-dawn.webp` … `arena-night.webp`)
→ aucun changement de code. Poids visé **< 100 Ko** par variante.

**Prompt maître (afternoon)** :

> Highly detailed vibrant cartoon splash art scene for a playful mobile quiz
> battle game for teenagers, rich painterly shading, bold chunky shapes with
> thick clean outlines, dramatic cinematic lighting, glowing atmospheric
> depth, rich saturated colors, premium mobile-game arena background,
> vertical portrait composition. A majestic white-marble arena of knowledge
> floating above a sea of soft volumetric clouds: a grand marble staircase
> with gold inlays climbs toward a radiant triumphal arch with a small golden
> throne far behind it; two COLOSSAL marble statues of laurel-crowned
> scholars holding giant golden quills flank the staircase on both sides,
> so tall their heads reach the upper third of the image; behind them the
> curved stone tiers of a colosseum are FILLED WITH A CHEERING CROWD rendered
> as tiny blurry colorful silhouettes waving small pennants — lively and
> festive, no faces, no readable details; violet banners with a golden
> crossed-quills emblem hang along the pillars; golden laurel wreaths and
> floating golden dust particles in the air; warm late-afternoon golden-hour
> sunlight streams through the arch in visible volumetric rays. At the very
> bottom, a clean circular marble medallion engraved with a golden laurel
> wreath and crossed quills, left empty like a stage. The top fifth of the
> image is open sky with soft clouds. The artwork is FULL-BLEED and fills the
> ENTIRE canvas edge to edge — no frame, no border, no letterboxing. All
> banners and scrolls are BLANK — no text, no letters, no numbers, no logo,
> no watermark.

**Les 5 relights** (l'image validée en référence + « change ONLY the sky, the
lighting and the mood to: … ») :

| Fichier | Lumière à demander |
|---|---|
| `arena-dawn` | pale pink-and-gold sunrise, thin morning mist drifting between the columns, long soft shadows, a few lanterns still glowing |
| `arena-morning` | crisp clear blue sky, fresh bright sunlight, sharp clean light on the marble, a few tiny birds far away in the sky |
| `arena-noon` | sun at its zenith, dazzling white marble, almost no shadows, deep saturated blue sky |
| `arena-evening` | blazing orange-and-violet sunset, the torches become the main light source, golden fireflies drifting over the stairs |
| `arena-night` | deep indigo starry sky, a big glowing full moon framed inside the arch, violet flames and soft blue wisps as the main lights, the crowd now a scatter of tiny warm lantern dots in the dark tiers |

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

### P5 · l'icône de l'app (le logo)

**Ce qui cloche dans la version actuelle** (deux crayons croisés + étoile sur
fond violet rayonnant) :

- les **gommes sont corail** — or le corail est la couleur d'**alerte** du
  design system. La seule couleur « attention » de l'app est posée sur la seule
  image que l'élève voit avant d'ouvrir l'app ;
- **trois foyers d'attention** se disputent le carré (le X, l'étoile blanche,
  les rayons) : à 48 px sur un écran d'accueil, tout fusionne en tache ;
- l'étoile blanche au centre **coupe le X** exactement au point qui porte le
  sens (« deux crayons qui se croisent ») ;
- rien ne relie l'icône au monde du jeu (la mascotte, les boss) : posée à côté
  de l'écran de chargement, elle a l'air de venir d'une autre app.

**Ce qui marche et qu'on garde** : le violet + jaune des deux crayons. Ce n'est
pas une incohérence — c'est exactement le code de l'app (violet = marque, jaune
= récompense), et deux crayons de camps opposés qui se croisent **disent le nom
du jeu** : Stud + **duel**. C'est la bonne idée, mal exécutée.

> Flat 2D vector app icon for a playful mobile learning game for teenagers, two
> chunky rounded pencils crossed in an X like duelling swords, the left pencil
> vivid purple (#7A3FE0), the right pencil sunny yellow (#F5B722), both with
> natural wood tips and matching-tone erasers (NO red, NO coral anywhere), one
> single small warm spark where the two pencils meet, thick dark indigo outline
> (#2A1150) around every shape, deep purple background with a soft radial glow
> only (no rays, no starburst, no confetti), bold silhouette readable at 48
> pixels, centered composition with generous margin for a rounded-square mask,
> square, no text, no watermark.

Deux points de vigilance à la génération :

1. **Le test des 48 px avant tout le reste** : réduire l'image à 48 px de côté.
   Si le X ne se lit plus, c'est raté — quel que soit le rendu en grand.
2. **Marge de sécurité** : Android rogne l'icône en cercle (`purpose:
   maskable`). Garder les pointes des crayons dans les 80 % centraux, sinon
   elles sont coupées sur la moitié des téléphones.

Livrer `public/icons/icon-192.png` et `icon-512.png` (les deux entrées de
`app/manifest.ts`, déjà déclarées : remplacer les fichiers suffit).

**Piste alternative, si le X ne passe jamais les 48 px** : la tête de la
mascotte de `public/images/splash.webp`, cadrée serré façon Duolingo ou Brawl
Stars. Un visage se reconnaît à n'importe quelle taille là où deux objets
croisés ne le font pas, et ça raccroche l'icône à l'écran de chargement.

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
| Barre d'onglets | 6 icônes, une par onglet | `public/images/nav/` |
| Débrief d'habitudes | icônes-boutons | `public/images/debrief/` |
| Barres CTA de l'arène | Match classé + Modes de jeu | `public/images/defi/` |
| Écran de chargement | mascotte + 6 boss en ombres + Nox | `public/images/splash.webp` |

**Leçon du splash (2026-07-29)**, valable pour toute silhouette à venir : une
ombre ne se reconnaît pas à son espèce mais à son **accessoire**. Le premier
essai demandait « un ogre, un dragon, un robot » et rendait des monstres
génériques ; en demandant « un ogre brandissant une plume d'oie géante », « un
dragon en haut-de-forme », « un loup en costume trois-pièces », ce sont nos
boss qui apparaissent. Second piège : la mascotte hérite de tout ce que porte
son image de référence (ici une baguette dans le dos) — il faut écrire
explicitement `he holds NOTHING… nothing sticking out behind his back`.

**Leçon de la barre d'onglets (2026-08-01)** : deux choses, dont une qui ne se
génère pas.

D'abord, une icône d'onglet échoue d'abord sur le **sens**, pas sur le style.
Le jeu de traits qu'elle remplace était propre, mais la maison de Réviser
disait « accueil », la couronne du Trésor disait « roi » au lieu de
« récompense à ouvrir », et Amis / Moi ne se distinguaient que par leur nombre
de silhouettes. Avant de commander un dessin, écrire la phrase que l'onglet
doit faire dire — et vérifier qu'elle ne décrit pas déjà un autre onglet.

Ensuite : **l'onglet d'un personnage se recadre, il ne se redessine pas.**
Marcel n'a demandé aucune génération — `scripts/nav-icones.mjs` découpe sa tête
dans une réaction de quiz existante. Un nouveau dessin de lui aurait produit un
cousin, pas lui, or tout l'intérêt de l'onglet est qu'on reconnaisse la tête
déjà vue partout ailleurs dans l'app. Seul réglage du cadrage : garder le
menton, qui tranché se lit comme un bug à 32 px.

**Et surtout : ne jamais régler la taille d'une icône à la main.** Les six
venaient de lots différents et occupaient leur canevas de 82 % à 96 %, avec une
surface d'encre allant du simple au tiers en plus — côte à côte, elles
semblaient de tailles différentes. `scripts/nav-icones.mjs` les normalise
toutes, et la leçon vaut pour tout jeu d'icônes à venir : **égaliser les boîtes
ne suffit pas**, l'œil compare des taches. Le script applique donc une trame
(transposée des keylines de Material : carré 79 %, rectangle 92 % sur son grand
côté) *puis* une correction de surface d'encre à moitié — corriger à fond fait
enfler les dessins ajourés jusqu'à crever la case, ne pas corriger laisse les
dessins denses écraser leurs voisins.

Prompts détaillés de ces lots retirés le 2026-07-22 (le dossier faisait 656
lignes pour ~90 % de travail terminé). Pour régénérer un asset à l'identique :
`git log -p docs/nano-banana-prompts.md`.
