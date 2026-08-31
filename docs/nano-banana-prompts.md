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

**État vérifié le 2026-08-27**, fichier par fichier, contre `lib/bosses.ts`,
`VIGNETTE_SLUGS` (`lib/subject-style.ts`), `GAME_SCENE_IDS`
(`lib/defi/modes-catalog.ts`), `lib/jeux/catalog.ts` et `lib/profile-banners.ts`.
Les lots qui étaient listés ici et qui sont depuis tombés (mascotte au podium,
socle) ont été retirés : l'arène est passée au fond unique à la mascotte, ils
n'ont plus de destinataire.

| Lot | Quoi | Générations | Pourquoi celui-là d'abord |
|---|---|---|---|
| **L1** | **Avatars** — le nouveau système | **46** | c'est le visage de l'élève dans toute l'app, et le seul endroit encore rendu par un générateur tiers |
| **L1-bis** | ~~L'habillage des onglets~~ | **1** | **abandonné** — les fonds dessinés sont invisibles sous les cartes ; seul le correctif du fond `/defi` survit |
| **L2** | Les trous visibles | 24 | des écrans finis qui affichent un emoji, un aplat violet ou un dessin d’un autre lot |
| **L3** | L'économie (coffres, cartes, boosters) | 18 | tout ce qui s'achète est encore un emoji système |
| **L4** | L'icône de l'app | 1 | la seule image vue avant d'ouvrir l'app |
| **L5** | **Les icônes de produit** — sortir de Lucide | 9 | le vocabulaire du produit est dessiné par une bibliothèque gratuite : un concurrent a la même rangée en trois minutes |
| **L6** | **L'onglet Amis** | 8 | le seul onglet sans une seule illustration ; et le podium est la scène que L1-bis cherchait au mauvais endroit |

**Total : 107 générations.** Lire L1-bis avant de commander le moindre fond : il
a coûté deux campagnes et il dit à quelle condition un décor sert à quelque
chose.

---

## L1 · Les avatars — on quitte DiceBear

**Décision du 2026-08-27.** L'avatar est aujourd'hui un SVG généré par DiceBear
(collection Open Peeps) : trait plat de banque d'illustrations, cheveux
toujours noirs (impossible à teindre, cf. l'en-tête de `lib/avatar.ts`), et
surtout **aucun rapport visuel avec le reste du jeu** — les boss, la mascotte et
les arènes sont peints, l'élève est un pictogramme.

Le remplaçant n'est pas un meilleur générateur, c'est un **roster** : l'élève ne
construit plus un bonhomme pièce par pièce, il **choisit un personnage** dans une
galerie, comme dans Brawl Stars. Ce qui change tout pour la production : un
avatar = **une image entière**, donc un prompt. Aucune couche à caler au pixel.

Ce qu'on perd, assumé : « je me fabrique moi-même ». Ce qu'on récupère : la
diversité passe par le **casting** (12 élèves gratuits couvrant peaux, textures
de cheveux, voile, turban, locks, lunettes) au lieu de passer par des menus, et
la personnalisation se déplace sur le **cadre** et la **bannière** — qui, eux,
se gagnent.

### Le contrat technique (à brancher après réception)

- Fichiers : `public/images/avatars/<id>.webp`, **512×512**, fond transparent.
- Un `lib/avatars.ts` sur le modèle de `lib/bosses.ts` : liste **fermée**, id +
  nom FR + palier de déblocage. L'action serveur valide contre cette liste.
- `profiles.avatar` (JSONB) garde trois champs : `character`, `frame`, `banner`.
  `normalizeAvatarConfig` replie toute ancienne config Open Peeps sur
  `eleve-01` — personne ne perd son compte, tout le monde change de tête.
- `AvatarRender` cesse d'appeler DiceBear : bannière → portrait → cadre.
- Les dépendances `@dicebear/core` et `@dicebear/collection` sortent du
  `package.json`.

### La règle qui commande tout le lot : **le cadrage est identique sur les 32**

Un roster se regarde **en grille**. Si une tête est plus grosse, plus haute ou
plus proche que sa voisine, la galerie a l'air cassée — et aucune retouche CSS
ne rattrape ça. Le prompt maître fige donc la caméra, la hauteur du visage dans
le cadre et la ligne des yeux, et **les 31 autres se génèrent avec le premier en
image de référence.**

### Prompt maître — le buste (format **1:1**)

**Le fichier est carré, la forme vue ne l'est pas.** L'avatar est rogné par un
**disque** dans la barre d'onglets (`.nav-cadre-*`, avec sa couronne de laurier)
et par un carré arrondi sur la carte de profil. Un cercle inscrit dans un carré
**jette 21 % de l'image — les quatre coins**. Le prompt doit donc tenir tout ce
qui compte dans le disque central : tête bien centrée, rien dans les angles, et
des épaules dont on accepte qu'elles soient coupées en courbe. La phrase
« keep the four corners empty… everything that matters inside the central
circle » ci-dessous est là pour ça, et ne se retire pas.

**Joindre `public/images/mascotte/reaction-bonne-1.webp` en image de référence.**
Ce n'est pas facultatif : c'est la règle d'or de tout ce dossier, et le premier
essai d'`eleve-01` (2026-08-27) l'a payée. Sans référence, le modèle rend un
**sticker vectoriel** — proportions réalistes, petits yeux, sourcils fins,
dégradé doux, aucune texture — propre, mais d'une autre famille que Marcel.
Cette réaction-là est le meilleur repère possible : c'est **déjà un buste sur
fond blanc**, exactement le cadrage d'un avatar.

Les trois écarts constatés, et ce que le prompt corrige :

| | Marcel | Le premier essai |
|---|---|---|
| Proportions | **tête énorme** (chibi), gros yeux, sourcils épais | proportions réalistes, petits yeux |
| Ombres | **cel-shading à bords durs** + texture tissée sur les vêtements | dégradé doux, aucune texture |
| Lumière | **liseré violet-lavande** en haut des cheveux | aucune |

> Character portrait bust for a playful mobile quiz game for teenagers, in the
> exact art style of the reference image — match its line work, shading,
> proportions and colour treatment precisely. Stylized cartoon illustration
> with thick dark navy ink outlines of varying weight, cel shading with
> hard-edged shadow shapes, a subtle woven fabric texture on the clothing, and
> a violet-lavender rim light along the top of the hair. Chibi mobile-game
> proportions: an oversized head, a small rounded body, large expressive eyes
> with bold thick eyebrows, a tiny nose and a small warm smile. Framing: head
> and shoulders only, at eye level, turned very slightly to their left. The
> bust fills the whole frame: the hair and shoulders reach the left and right
> edges, the top of the hair sits just below the top edge, the shoulders are
> cut off by the bottom edge, and there is no empty margin anywhere around the
> character. The character is centred exactly on the vertical axis. The head is
> about as wide as the shoulders.
> The image will be cropped to a circle, so keep the four corners empty and
> keep everything that matters inside the central circle. Muted warm palette —
> cream, warm brown, deep navy, with violet accents. Isolated on a plain flat
> white background, centered, no ground shadow, no props, no frame, no border,
> no badge, no text, no letters, no logo, no watermark. It is a drawn cartoon
> illustration, not a flat vector sticker, not a soft airbrushed portrait, not
> a 3D render. The character is: … (la ligne du tableau)

**Deux formulations qui n'ont PAS suffi au 2e essai (2026-08-27), à ne pas
remettre telles quelles** :

- « the head filling about two thirds of the frame width » → rendu à ~45 %, avec
  une large marge vide et un sujet décentré. Un pourcentage ne se mesure pas :
  il faut décrire des **contacts avec les bords** (« the hair and shoulders
  reach the left and right edges… no empty margin anywhere »).
- « chibi proportions: an oversized head » → visage encore trop réaliste. La
  consigne qui mord est un **rapport entre deux choses visibles dans l'image** :
  « the head is about as wide as the shoulders ».

**Ce qui a été retiré du premier jet, et pourquoi** : « painterly stylized
3D-cartoon look like premium mobile game key art » et « glossy airbrushed
shading » décrivaient Clash Royale, pas notre trait — Marcel est **encré et
cel-shadé**, pas rendu en 3D. Et « colours: cream, vivid purple, sunny yellow »
appelait la palette de l'**interface**, alors que les personnages vivent dans
une gamme **sourde** (brun chaud, marine, crème) où le violet n'est qu'un
accent. Ne pas les réintroduire.

**Verrouillage pour les 31 suivants** — non plus Marcel en référence, mais
**`eleve-01` une fois validé** : c'est lui qui devient l'étalon du roster.

> Keep the exact same art style, line work, cel shading, chibi proportions,
> head size, framing, camera angle, eye line, lighting, palette and background
> as the reference image. Change only the character. The character is: …
> (la ligne du tableau)

### Le casting — 32 portraits

**Palier « Toi » — 12, gratuits.** Ce ne sont pas des cosmétiques : c'est la
condition pour qu'un élève sur deux se reconnaisse. Même règle que le voile et
les tresses dans l'ancien vestiaire — **jamais payants**.

| Id | Le personnage (à coller après « The character is: ») |
|---|---|
| `eleve-01` | a cheerful teenage girl with light skin, freckles, warm chestnut hair in a high ponytail, wearing a cream hoodie |
| `eleve-02` | a friendly teenage boy with light skin, short tousled blond hair, wearing a purple crew-neck sweater |
| `eleve-03` | a calm teenage girl with light-olive skin and long straight black hair with a blunt fringe, wearing a mustard-yellow shirt |
| `eleve-04` | a grinning teenage boy with medium-brown skin and short curly dark hair, wearing a teal zip jacket |
| `eleve-05` | a confident teenage girl with deep-brown skin and neat cornrows gathered at the back, small gold hoop earrings, wearing a coral top |
| `eleve-06` | a beaming teenage boy with deep-brown skin and a full round afro, wearing a purple varsity jacket |
| `eleve-07` | a warm teenage girl wearing a soft violet hijab framing her face, medium skin, wearing a cream tunic |
| `eleve-08` | a serene teenage boy wearing a neat navy turban, medium-brown skin, short dark beard, wearing a cream shirt |
| `eleve-09` | a joyful teenage girl with deep-brown skin and shoulder-length locs tied back with a yellow band, wearing a green top |
| `eleve-10` | a bookish teenage boy with pale skin, ginger hair and round glasses, wearing a striped cream and purple sweater |
| `eleve-11` | a playful teenage girl with medium skin and a short pixie cut dyed lavender, square glasses, wearing a denim jacket |
| `eleve-12` | a laughing teenage boy with medium-brown skin, a closely shaved head and braces on his teeth, wearing a yellow t-shirt |

**Palier « Clubs » — 8, débloqués par la progression** (niveau, série, chapitres
maîtrisés). Le même élève, mais dans ce qu'il aime : c'est le palier qui
récompense le travail sans passer par la caisse.

| Id | Le personnage |
|---|---|
| `club-sciences` | a teenage scientist in a cream lab coat with safety goggles pushed up on the forehead, a small violet chemical stain on the collar |
| `club-sport` | a teenage athlete with a yellow sweatband, damp hair, wearing a purple sports jersey, mid-laugh after a match |
| `club-arts` | a teenage artist wearing a violet beret, a paint smudge on one cheek, a paintbrush tucked behind the ear |
| `club-musique` | a teenage musician wearing large golden over-ear headphones around the neck, a guitar strap over one shoulder |
| `club-code` | a teenage coder in a dark purple hoodie with the hood up, faint cyan screen glow on the face, a tiny pixel motif on the chest |
| `club-lettres` | a teenage reader wrapped in a long cream scarf, holding the top edge of a closed book against the chest |
| `club-explorateur` | a teenage explorer in a khaki cap with binoculars hanging around the neck, a small leaf caught in the hair |
| `club-debat` | a teenage debater in a smart violet blazer, chin slightly raised, a small golden microphone at the bottom edge |

**Palier « Héros » — 8, boutique et rangs.** Le costume complet. C'est ce que
l'élève regarde en se disant « je veux celui-là ».

| Id | Le personnage |
|---|---|
| `hero-astronaute` | a teenage astronaut in a cream and purple spacesuit, helmet visor tipped open, tiny golden stars reflected in the glass |
| `hero-chevaliere` | a teenage knight girl in ornate cream and gold plate armour, helmet under the arm at the bottom edge, a violet plume |
| `hero-ninja` | a teenage ninja in a deep violet hood and mask, only the eyes and brow visible, a golden headband knot |
| `hero-magicienne` | a teenage sorceress in a starry violet pointed hat, small golden runes floating close around the shoulders |
| `hero-detective` | a teenage detective in a cream trench coat and a checked cap, one eyebrow raised, a magnifying glass at the bottom edge |
| `hero-pilote` | a teenage pilot in a leather aviator cap and goggles on the forehead, a cream fur-lined collar, a golden wing pin |
| `hero-samourai` | a teenage samurai in lacquered violet and gold shoulder armour, hair in a top knot, a calm steady gaze |
| `hero-pirate` | a teenage pirate in a violet tricorn hat with a golden trim, a red bandana underneath, a cheeky grin |

**Palier « Légendaires » — 4, rang Maître et fin de saison.** Ils ne sont pas
humains : c'est ce qui doit se voir d'un coup d'œil dans un classement.

| Id | Le personnage |
|---|---|
| `legend-dragon` | a small friendly cartoon dragon scholar with emerald scales, tiny golden spectacles perched on the snout, a cream academic collar |
| `legend-robot` | a rounded cream and violet student robot with one large glowing golden eye-screen showing a gentle smile, a small antenna |
| `legend-phenix` | a noble cartoon phoenix with amber and gold plumage, a warm ember glow around the crest, calm golden eyes |
| `legend-esprit` | a luminous spirit of knowledge, a translucent violet hooded figure with two calm glowing golden eyes and drifting page-fragments |

### Les 6 cadres — format **1:1**, centre vide

Un cadre par palier de rang (`lib/rank.ts` en déclare exactement six). Il se
superpose au portrait : **le centre doit être entièrement transparent**, sinon
il masque le visage.

> Game asset: an ornate circular avatar frame ring for a playful mobile quiz
> game, seen perfectly flat and head-on. It is a ring only — the entire centre
> is empty, there is no portrait, no face, no character, no fill inside the
> ring. Painterly stylized 3D-cartoon look, bold chunky shapes, thick clean
> dark-indigo outlines, glossy airbrushed shading, soft inner glow. A small
> decorative crest sits at the bottom of the ring on the vertical centre axis,
> and two small symmetrical flourishes at the upper left and upper right. The
> ring material is: … (la ligne du tableau). Perfectly centred and symmetrical,
> isolated on a plain flat white background, no text, no numbers, no letters,
> no watermark.

| Id | La matière du cadre |
|---|---|
| `bronze` | warm hammered bronze with darker patina in the recesses, a single small amber gem in the bottom crest |
| `argent` | polished pale silver with cool blue-grey shading, a single small clear gem in the bottom crest |
| `or` | bright polished gold with warm honey shading and crisp specular highlights, a small amber gem |
| `platine` | cool white platinum with faint violet iridescence, two small pale-blue gems |
| `diamant` | translucent crystal facets with pale cyan and violet refractions, a bright faceted gem in the crest, a soft outer glow |
| `maitre` | radiant molten gold with violet flame licking along the outer edge, a small crown replacing the bottom crest, a strong golden aura |

**Le piège de ce sous-lot** : le mot « frame » suffit rarement — le modèle
dessine un cadre **avec un portrait dedans**. La phrase « it is a ring only —
the entire centre is empty, there is no portrait, no face » est ce qui l'évite,
et il faut la garder telle quelle. Après réception, vérifier le trou central en
posant l'image sur un aplat de couleur.

### Les 8 bannières de profil — format **16:9**, recadrées en bandeau

Elles sont **déjà déclarées** dans `lib/profile-banners.ts` avec leurs clés et
leurs dégradés de repli — les fichiers `public/banners/*.webp` n'ont simplement
jamais existé. Rien à brancher : dès que le fichier est là, il s'affiche (la
carte de profil les charge en image de fond CSS, un fichier manquant ne peint
rien).

Générer en 16:9 puis recadrer en **1024×384** : le bandeau fait 128 px de haut
sur toute la largeur de la carte.

Style « scène », avec une contrainte propre au format : **le tiers gauche
accueille l'avatar et le pseudo**. Ajouter à chaque prompt :

> The left third of the image stays calm and uncluttered — same rich
> atmosphere, but no object and no character there; it is where a portrait and
> a name will be laid over the artwork.

| Clé | Rareté | La scène |
|---|---|---|
| `arene-crepuscule` | commune | the floating academy island seen from far away at dusk, violet and magenta sky, warm lit windows, drifting petals |
| `cour-recre` | commune | a sunlit school courtyard from a low angle, cream stone arcades, a basketball hoop, confetti-like leaves in a fresh blue sky |
| `flamme-serie` | rare | a river of amber and orange flame curling across a deep indigo field, rising embers and sparks, warm glow |
| `podium-or` | rare | a golden victory podium under falling golden confetti and streamers, warm spotlights sweeping a violet arena |
| `cosmos` | rare | a deep indigo nebula with constellations drawn between the stars, a small ringed planet on the right, drifting stardust |
| `vitrail` | rare | a huge cathedral stained-glass window in violet, gold and deep blue, warm light shafts pouring through the coloured panes |
| `couronne-royale` | légendaire | a golden crown floating above a violet velvet field, golden light rays radiating behind it, floating gold particles |
| `dragon-savoir` | légendaire | a majestic emerald dragon coiled around a giant glowing book, deep forest-green and gold, magical motes in the air |

### L'ordre de production de L1 (et le seul test qui compte)

1. **`eleve-01` seul, avec Marcel en image de référence.** Ne rien générer
   d'autre tant qu'il n'est pas validé — et le valider sur la **ressemblance de
   famille** avec Marcel (proportions chibi, encrage, cel-shading), pas sur le
   fait qu'il soit joli.
2. **Le test des 40 px** — c'est la taille de l'avatar dans le bandeau du haut,
   là où il est vu le plus souvent. Réduire le portrait à 40 px de côté : si le
   visage devient une tache, le cadrage est trop large, régénérer avec un visage
   plus grand dans le cadre. Ce test se fait **avant** les 31 autres, jamais
   après.
3. Les 11 autres élèves, puis les clubs, les héros, les légendaires.
4. **La planche de contrôle** : les 32 côte à côte en grille de 4 colonnes. Toute
   tête visiblement plus grosse ou plus haute que ses voisines se régénère —
   c'est le seul défaut qu'on ne pourra pas rattraper ensuite.
5. Les 6 cadres, puis les 8 bannières.

---

## L1-bis · L'habillage de l'app — ABANDONNÉ, et pourquoi

**Ne rien générer pour ce lot.** Il a été spécifié, produit en deux campagnes,
essayé à l'écran et retiré le 2026-08-27. Ce qui suit est ce qu'il a coûté et ce
qu'il a appris — c'est la seule chose qui vaut d'être gardée.

### L'intention de départ, qui était juste

Un seul onglet sur cinq avait un décor : `/defi` a sa scène peinte, `/moi` et
`/reviser` étaient un aplat crème, `/tresor` et `/amis` n'avaient rien. Le
diagnostic tenait. Et la règle posée au départ était la bonne :

> **On met un décor là où l'on pose un héros, et un MUR là où du contenu
> défile.**

C'est ce que fait Clash Royale : une scène peinte sur l'accueil et la bataille,
une texture répétée derrière les cartes et la boutique.

### Les deux campagnes, et ce qui les a tuées

**1re campagne — « une académie, cinq salles ».** Colonnes cannelées,
chapiteaux dorés, tentures, laurier, strictement symétrique, vu de face. Rendu :
un **foyer d'opéra**. Froid, adulte, sans rapport avec un gamin en veste de
tweed. La leçon : *une façade symétrique vue de face est un plan d'architecte,
c'est formel par construction* — et chacun des mots ci-dessus dit « palais ».

**2e campagne — « le bazar de Marcel ».** Bureau encombré, caisses,
tableau de liège, étagère à trophées, asymétrie, guirlande d'ampoules. Le
concept, lui, marchait : ça respirait. Deux dérives corrigées en une passe (tout
était parti en **sépia**, sans violet ni encre marine ; et deux caméras
différentes cohabitaient). Le résultat était **beau — isolé.**

**Puis on l'a posé sur l'écran, et il a disparu.** Les cartes de `/amis`
couvraient l'étagère, les coupes et le miroir ; le seul morceau qui dépassait de
derrière une carte se lisait comme un **débris**. La guirlande, seule partie
entièrement visible, passait **derrière le titre de la page** et le rendait
moins lisible. Et la moitié basse, dessinée pour être recouverte, restait vide
parce que le contenu s'arrêtait avant.

### La leçon, qui vaut pour tout décor à venir

**La règle avait été écrite, puis pas tenue.** On a spécifié un mur, et produit
une scène. Sur un écran fait de cartes opaques, un décor dessiné n'est pas
« discret » : il est **invisible par endroits et parasite par d'autres** — et
les deux au même moment.

Avant de commander un fond, poser la question dans cet ordre :
1. **Qu'est-ce qui se pose par-dessus ?** Une pile de cartes → mur. Un héros
   seul au centre → scène.
2. **Que reste-t-il de visible ?** Si la réponse est « des bouts », c'est raté :
   un fragment d'objet reconnaissable se lit comme un bug, pas comme un décor.

Corollaire : `/defi` reste **le seul écran de l'app qui mérite un fond
dessiné**, parce qu'il est le seul où rien ne recouvre le centre.

### Ce qui a été retenu à la place — 0 génération

Le fond des quatre onglets de liste est une **feuille de papier quadrillé** :
crème de la marque, carreau de 28 px, lignes empruntées au violet plutôt qu'à un
gris, et un halo ambré très léger en haut pour que l'aplat ne soit pas
parfaitement uniforme.

Tout en CSS (`.tab-bg` dans `app/globals.css`) : un motif régulier se répète
sans couture par construction, ne coûte **aucune requête**, ne se recadre jamais
mal, et suit le viewport. Il dit « école » d'un seul motif sans rien disputer au
contenu.

L'ironie utile : ce quadrillage était le **tiers bas** de l'illustration
abandonnée — la seule partie qui fonctionnait à l'écran.

### Le correctif du fond `/defi` — 1 génération, lui, reste valable

La scène actuelle est bonne et n'est pas à refaire. Elle viole seulement la
règle du haut : elle est riche exactement là où l'UI se pose — nuages violets
contrastés derrière le bandeau, colonnes sombres et détaillées le long des deux
bords, là où vivent les boutons Quêtes, Boss, Menu et Trophées.

Image actuelle en référence, format **9:16** :

> Keep the exact same scene, character, podium, columns, braziers, laurel,
> floor inlay and art style as the reference image. Change only the lighting
> and the level of detail in two places. First, the top third of the image:
> keep the violet sky, but make it calm and even, much lighter in value, with
> no contrasted cloud shapes and no dark areas — it must stay quiet, because a
> heads-up display sits over it. Second, the left and right vertical edges over
> their full height: keep the columns and the hangings, but light them clearly
> and flatten their detail, with no deep shadow and no dark corner — round
> buttons sit over them. All the remaining detail, contrast and warm glow
> concentrates in the central stage and on the floor. High-key throughout:
> there is no black anywhere, the darkest tone is a soft mid-tone. Full-bleed
> vertical composition edge to edge, no frame, no border, no letterboxing. No
> text, no letters, no numbers, no logo, no watermark.

---

## L2 · Les trous visibles — 24 générations

Des écrans terminés qui affichent aujourd'hui un emoji de repli, un médaillon
d'initiales ou un aplat violet.

### L2-a · 5 fichiers de boss

`lib/bosses.ts` déclare **17** boss. Quatre ne sont pas complets. Le boss de la
semaine passe sur **tous** les élèves à tour de rôle : un trou se voit une
semaine entière.

Deux fichiers par boss : le **buste** (carré détouré, style « vignette »,
`public/images/boss/<id>.webp`) et la **scène** 16:9 (style « scène »,
`public/images/boss/<id>-scene.webp`).

| Id | Manque | Matière | Le sujet (après le style maître) |
|---|---|---|---|
| `nox` | buste | *repli* | A hooded shadow figure with two calm glowing violet eyes, star-dust cloak, midnight-blue background — mysterious, never frightening. |
| `mecatron` | buste **+ scène** | Technologie | A chunky retro robot boss with one big glowing amber eye and gear-shoulders, steam venting, slate-and-copper workshop background. |
| `coach-turbo` | buste | Sport | A cartoon coach blowing a whistle, turbo jetpack on the back and a stopwatch in hand, lime-and-orange stadium energy. |
| `delta` | scène | Maths | A geometric guardian built from luminous triangles and rulers, violet-and-gold grid background with floating equation shapes (shapes only, no readable symbols). |

> **Commencer par `nox`** : c'est le boss de **repli**, affiché dès qu'une
> matière n'a pas son gardien. Sa scène existe déjà — c'est le buste le plus
> rentable des cinq fichiers.

### L2-b · 9 scènes de jeux de salon

Ces neuf jeux sont **jouables** et s'affichent encore sur la robe unie violette.
Format 16:9 → `public/images/defi/jeux/<id>-scene.webp`, puis ajouter l'id à
`GAME_SCENE_IDS` (`lib/defi/modes-catalog.ts`) — **sans ça, l'image déposée
n'est jamais affichée.**

**Lien de famille** : les jeux d'une même matière partagent leur ambiance, comme
une collection.

| Id | Jeu | Matière | Le sujet (après le style maître) |
|---|---|---|---|
| `suite-logique` | Suite logique | Maths | A mystical violet crystal orb floating above an open geometric grimoire, glowing shapes rising in a sequence, deep indigo-and-gold arcane background. |
| `compte-est-bon` | Le compte est bon | Maths | Six glowing golden number-plates orbiting a big target ring, arithmetic sparks, deep navy-and-gold game-show background (shapes only, no readable digits). |
| `faux-amis` | Faux amis | Anglais | Two theatre masks face to face, one royal blue and one pop red, ribbons and confetti swirling, deep blue stage background with warm spotlights. |
| `phrase-en-vrac` | Phrase en vrac | Anglais | Blank wooden word-tiles tumbling into a neat line on a slate-blue desk, royal blue and pop red highlights, chalky classroom glow (tiles are blank). |
| `falsos-amigos` | Falsos amigos | Espagnol | A shimmering desert mirage with a scarlet flamenco fan half-dissolving into hot air, sunflower-yellow dunes, wavy heat haze. |
| `anatomie-express` | Anatomie express | SVT | A glowing anatomical figure of light standing on a mint-green platform, softly pulsing organs shown as warm light shapes, teal medical-lab background. |
| `classe-moi-ca` | Classe-moi ça | SVT | Three cartoon animals (a mammal, a reptile, an amphibian) perched on floating mint-green jungle platforms, teal canopy background with fireflies. |
| `chasse-elements` | Chasse aux éléments | Physique-Chimie | Glowing laboratory vials on a rack, each holding a different neon-green liquid, dark teal lab background with bubbling condensers (labels are blank). |
| `bonne-unite` | La bonne unité | Physique-Chimie | A precision workshop bench with a glowing caliper, a balance scale and a stopwatch, dark slate-and-neon-green background (all dials are blank). |

> `pointe-carte` a **déjà sa scène** mais pas son jeu (carte muette cliquable) —
> ne rien générer de plus tant que le jeu n'existe pas.

### L2-c · 10 vignettes de matières

Ces matières s'affichent avec le médaillon d'initiales de repli, ou empruntent
le dessin d'une matière sœur. Style « vignette », carré détouré **320×320** →
`public/images/matieres/vignettes/<slug>.webp`, puis ajouter le slug à
`VIGNETTE_SLUGS` (`lib/subject-style.ts`).

| Slug | Matière | L'objet principal (après le style maître) |
|---|---|---|
| `snt` | SNT | A turquoise smartphone with a purple wifi arc above it and small floating pixel squares. |
| `hlp` | HLP | An open cream book with a violet thinking-statue head rising from its pages, golden light rays. |
| `llcer-anglais` | LLCER Anglais | Two theatre masks in indigo and coral in front of an open book, small yellow stars. |
| `si` | Sciences de l'ingénieur | A big blue gear meshed with a purple drawing compass and a small yellow lightbulb. |
| `maths-complementaires` | Maths complémentaires | A soft violet division sign and a gentle rising curve on a sky-blue grid card, small golden dots. |
| `maths-expertes` | Maths expertes | A glowing purple infinity symbol intertwined with a golden spiral and small floating polyhedra. |
| `finances-personnelles` | Finances personnelles | A friendly coral piggy bank with golden coins arcing into its slot and a small violet wallet. |
| `culture-generale` | Culture générale | A violet globe wearing a golden graduation cap, a small open book and a turquoise question mark orbiting it. |
| `grand-oral` | Grand oral | A golden standing microphone in front of a violet speech bubble, small yellow sparkles rising. |
| `sciences-technologie` | Sciences et technologie | A turquoise microscope beside a purple gear and a small yellow lightning bolt. |

> Le **Grand oral** est le seul slug qui n'a aujourd'hui ni vignette ni alias
> (cf. `lib/subject-catalogue.test.ts`, qui tient la liste à jour).

---

## L3 · L'économie — 18 générations

Tout ce qui s'achète, s'ouvre ou se collectionne est encore rendu par un
**emoji système** (`lib/tresor.ts`). Un emoji ne se possède pas : il a la même
tête sur toutes les apps du téléphone. C'est le lot qui fait le plus pour la
sensation de butin — donc juste après L1 et L2.

### L3-a · 4 coffres — format **1:1**

Style « vignette », mais volume assumé : un coffre doit avoir l'air lourd.

> Game asset: a closed treasure chest for a playful mobile quiz game, seen from
> a slightly elevated three-quarter front angle, lid shut. Painterly stylized
> 3D-cartoon look, bold chunky shapes, thick clean dark-indigo outlines, glossy
> airbrushed shading, bright key light from the upper front, a soft coloured
> glow escaping from the seam of the lid. The chest is: … (la ligne du tableau).
> Isolated on a plain flat white background, centered, no ground shadow, no
> text, no numbers, no watermark.

| Id | Le coffre |
|---|---|
| `commun` | plain warm wood with simple iron bands and a small iron clasp, a faint cream glow at the seam |
| `rare` | polished blue-lacquered wood with silver corners and a silver clasp, a cool blue glow at the seam |
| `epique` | deep violet lacquer with ornate golden filigree, a violet gem on the clasp, a bright violet glow |
| `legendaire` | radiant gold with molten light in every crack, a large amber gem on the clasp, golden particles rising around it |

### L3-b · 3 boosters — format **1:1**

Les objets de la boutique (`SHOP_CATALOG`). Même prompt « vignette ».

| Id | Nom dans l'app | L'objet |
|---|---|---|
| `freeze` | Gel de série | A small flame frozen inside a pale-blue ice cube, frost crystals radiating from the corners. |
| `double` | Double XP · 24 h | A golden lightning bolt splitting into two identical bolts, a small violet clock face behind them. |
| `indice` | Indice | A warm yellow lightbulb with a small violet question mark glowing inside the glass. |

### L3-c · 8 cartes à collectionner — format **1:1**

`COLLECTION_CARDS` — huit savants, aujourd'hui huit emojis (🍎, ⚗️, 📐…). Ce
sont des **portraits**, donc **le même cadrage que les avatars du L1** : les
générer juste après le roster, avec `eleve-01` en image de référence, et ils
entreront dans les mêmes cadres.

| Id | Nom | Le personnage |
|---|---|---|
| `c1` | Newton | a cartoon Isaac Newton with a long curly grey wig, a small red apple floating just above the hair |
| `c2` | Curie | a cartoon Marie Curie with dark hair in a bun, a cream lab coat, a faint green glow held between the hands |
| `c3` | Pythagore | a cartoon Pythagoras with a white beard and a cream toga, a golden triangle glowing beside the head |
| `c4` | Ada Lovelace | a cartoon Ada Lovelace with dark ringlets and a violet Victorian dress, small golden punched-card motifs floating around |
| `c5` | Einstein | a cartoon Albert Einstein with wild white hair and a moustache, a cream sweater, a small violet spiral galaxy behind |
| `c6` | Champollion | a cartoon Champollion with dark curly hair and a beard, a cream scholar coat, golden hieroglyph shapes floating (shapes only, no readable writing) |
| `c7` | Darwin | a cartoon Charles Darwin with a long white beard and a brown coat, a small green tortoise on his shoulder |
| `c8` | Hypatie | a cartoon Hypatia with dark hair bound in a cream headband and a violet robe, a golden armillary sphere beside her |

### L3-d · 3 skins de flamme — format **1:1**

La série a déjà ses six paliers (`public/images/serie/`). Il manque les skins
**vendus** en boutique ou tirés au coffre. Reprendre la flamme du palier
« Rayonnante » en image de référence et ne changer **que** la couleur du feu.

| Id | Nom | Le feu |
|---|---|---|
| `flame-blue` | Flamme azur | cool azure and cyan flame with a white-hot core, pale blue sparks |
| `flame-rainbow` | Flamme arc-en-ciel | a flame shading smoothly from magenta at the base through violet, cyan and gold at the tip, iridescent sparks |
| `flame-braise` | Braise (butin de coffre) | a deep ember-red flame low and glowing, dark charcoal at the base, orange embers drifting up |

---

## L4 · L'icône de l'app — 1 génération

**Ce qui cloche dans la version actuelle** (deux crayons croisés + étoile sur
fond violet rayonnant) :

- les **gommes sont corail** — or le corail est la couleur d'**alerte** du
  design system. La seule couleur « attention » de l'app est posée sur la seule
  image que l'élève voit avant d'ouvrir l'app ;
- **trois foyers d'attention** se disputent le carré (le X, l'étoile blanche,
  les rayons) : à 48 px sur un écran d'accueil, tout fusionne en tache ;
- l'étoile blanche au centre **coupe le X** exactement au point qui porte le
  sens (« deux crayons qui se croisent ») ;
- rien ne relie l'icône au monde du jeu.

**Ce qui marche et qu'on garde** : le violet + jaune des deux crayons. Ce n'est
pas une incohérence — c'est exactement le code de l'app (violet = marque, jaune
= récompense), et deux crayons de camps opposés qui se croisent **disent le nom
du jeu** : Stud + **duel**. C'est la bonne idée, mal exécutée.

> Flat 2D vector app icon for a playful mobile learning game for teenagers, two
> chunky rounded pencils crossed in an X like duelling swords, the left pencil
> vivid purple (#7A3FE0), the right pencil sunny yellow (#F5B722), both with
> natural wood tips and matching-tone erasers (no red, no coral anywhere), one
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
croisés ne le font pas.

---

## L5 · Les icônes de produit — 9 générations

### Le raisonnement, avant la liste

Un concurrent ne nous copie pas par notre croix de fermeture. Personne ne
reconnaît une app à son chevron, son engrenage ou sa flèche de retour : ce sont
des **panneaux de signalisation**, ils gagnent à ressembler à ceux de tout le
monde, et les redessiner coûterait de la lisibilité à 16 px sans rien rapporter.

Ce qui se reconnaît — et donc ce qui se copie — c'est le **vocabulaire du
produit** : les quelques objets que l'élève voit dix fois par séance et qui
NOMMENT ce qu'on lui propose. « Cours · Quiz · Flashcards · Fiches · Défi » :
cette rangée EST l'offre de Studuel. Elle est aujourd'hui dessinée par
**Lucide** (`BookOpen`, `ListChecks`, `Layers`, `FileText`, `Swords`) — une
bibliothèque gratuite, installée en une commande. N'importe qui sort la même
rangée en trois minutes.

D'où la règle de partage, qui tient tout ce lot :

| | Reste en trait (Lucide) | Passe au dessin |
|---|---|---|
| Quoi | chrome système : croix, chevrons, engrenage, retour, coche, loupe, plus | vocabulaire produit : les supports, les tuiles de Marcel |
| Pourquoi | signalisation — la banalité est une qualité | identité — c'est ce qu'on nous prendrait |
| Combien | ~169 fichiers, **on n'y touche pas** | **9 dessins** |

Neuf dessins, pas cent soixante-neuf : la différenciation se joue sur une
poignée d'objets vus tout le temps, pas sur l'inventaire.

### L5-a · Les 6 supports — 5 générations, 1 reprise

`components/reviser/SupportChips.tsx`. Rendus à **quatre endroits** (écran de
chapitre, pied de cours, onglet « Mode de jeu », sous une fiche dépliée) : c'est
la rangée la plus vue de l'app après la barre d'onglets.

**`defi` ne se génère pas.** Le support « Défi » mène au Défi : il doit porter
les **épées croisées de son onglet** (`public/images/nav/defi.webp`). Un second
dessin ferait un cousin là où il faut une reprise — exactement le raisonnement
de la tête de Marcel dans la barre d'onglets.

| Kind | Libellé | Aujourd'hui | L'objet à dessiner (après le prompt maître) |
|---|---|---|---|
| `cours` | Cours | `BookOpen` | An open notebook seen at a three-quarter angle, its pages cream with a few soft violet ruled lines, and a golden ribbon bookmark falling from the spine. |
| `quiz` | Quiz | `ListChecks` | A rounded violet speech bubble tilted slightly, with one big bold golden question mark inside it and two small golden sparkles at its corner. |
| `flashcards` | Flashcards | `Layers` | Three rounded cards fanned out like a hand of cards, the front one cream with a violet folded corner, the two behind in violet and gold. |
| `carte` | Fiches | `FileText` | A single cream index card with a folded top-right corner and three short violet ruled lines, held by a golden paperclip at its top-left. |
| `erreurs` | Revoir mes erreurs | `Undo2` | A chunky violet eraser tilted on its side, with a thick golden circular arrow looping around it. |
| `defi` | Défi | `Swords` | **aucune génération** — reprendre `public/images/nav/defi.webp`. |

> **LE PIÈGE DE CE LOT : trois papiers dans la même rangée.** Cours, Flashcards
> et Fiches sont tous les trois « du papier crème ». À 40 px, côte à côte, ils
> deviendront une bouillie si on les laisse se ressembler. Ce qui les sépare
> n'est PAS la couleur, c'est la **silhouette** — et elle est écrite dans les
> lignes ci-dessus, à ne pas diluer : un **bloc épais relié** (cahier), un
> **éventail** (cartes), une **feuille unique à trombone** (fiche). Vérifier les
> trois en grille avant de valider, jamais un par un.

### L5-b · Les 4 tuiles de Marcel — 4 générations

`components/marcel/MarcelHub.tsx`. Quatre tuiles icône / mot / explication,
elles aussi du vocabulaire produit — et elles aussi en Lucide.

| Kind | Tuile | Aujourd'hui | L'objet à dessiner |
|---|---|---|---|
| `methode` | Méthode | `GraduationCap` | A golden drawing compass and ruler crossed over a small cream card, tracing a violet dotted path — the tools of a method, not a diploma. |
| `oral` | Oral | `Mic` | A rounded retro microphone in violet with a golden grille and stand, and two small golden sound arcs on its right. |
| `entrainement` | Entraînement | `Timer` | A chunky golden stopwatch tilted slightly, its crown and ring in violet, with one small violet motion arc behind it. |
| `progres` | Progrès | `BarChart3` | Three rounded bars rising left to right — violet, violet, gold — with a small golden arrow curving up over the tallest. |

> **Méthode ne prend PAS la toque de diplômé.** `GraduationCap` dit
> « diplôme », or la tuile dit « comment s'y prendre ». C'est la leçon de la
> barre d'onglets, à rejouer ici : une icône échoue d'abord sur le **sens**, pas
> sur le style — écrire la phrase que la tuile doit faire dire avant de
> commander le dessin.

### Le prompt maître de ce lot — l'icône, pas la vignette

Ce sont des **icônes** : vues à 40 px dans un disque, pas à 100 px sur une
carte. Elles appartiennent donc à la famille de la **barre d'onglets**, pas à
celle des vignettes de matières. **Joindre `public/images/nav/reviser.webp` en
image de référence.** Format **1:1**.

> Flat cartoon app icon of ONE single object for a playful mobile learning app
> for teenagers. Match the exact art style of the reference image — its outline
> weight, shading and colour treatment. Bold rounded chunky shapes with a thick
> uniform dark plum-purple outline all around the object, flat cel shading with
> one darker tone and one glossy cream highlight sweep, no gradients, no
> texture, no drop shadow. Restricted palette: dark plum purple, royal violet,
> golden yellow, warm cream. The object is seen from the front, tilted slightly,
> simple and READABLE AT VERY SMALL SIZE: few parts, big shapes, no thin lines,
> no small details, no scattered confetti. It fills the frame and reaches the
> left and right edges with no empty margin. Isolated on a plain flat white
> background, square composition, centered.
> NO folder, no binder, no card frame, no border, no background objects, no
> text, no letters, no numbers, no logo, no watermark.
> The object is: … (la colonne du tableau)

La différence avec le prompt des vignettes tient en une phrase — `READABLE AT
VERY SMALL SIZE: few parts, big shapes, no thin lines` — et elle n'est pas
cosmétique : les vignettes de matières sont vues six fois plus grandes, elles
peuvent porter un motif grec ou une trame de tissu. Ici, tout détail sous 3 px
devient une salissure.

### Après réception — le script, et surtout la trame

Fichiers : `public/images/supports/<kind>.webp` et
`public/images/marcel/<kind>.webp`, **256×256**, fond transparent (même taille
que la barre d'onglets, servie à 40-48 px).

1. Déposer les originaux dans `assets-sources/supports/` et
   `assets-sources/marcel-tuiles/`.
2. Écrire `scripts/supports-icones.mjs` **sur le modèle de
   `scripts/nav-icones.mjs`** — il ne s'agit pas de convertir en WebP, mais de
   passer les six (puis les quatre) par `scripts/lib/trame.mjs`.

   **C'est le point à ne pas sauter, et il a déjà coûté une campagne.** Les six
   icônes de la barre d'onglets venaient de lots différents et occupaient leur
   canevas de 82 % à 96 %, avec une surface d'encre allant du simple au tiers en
   plus : côte à côte, elles semblaient de tailles différentes — ce qu'on lit
   comme un bug d'alignement, pas comme un parti pris. **Égaliser les boîtes ne
   suffit pas : l'œil compare des taches d'encre.** Une rangée de supports mal
   calibrée serait pire qu'une rangée de Lucide, qui a au moins l'avantage
   d'être régulière.
3. Remplacer les `Record<SupportKind, LucideIcon>` par des imports statiques
   d'images (`import coursIcone from '@/public/images/supports/cours.webp'`) —
   **jamais un chemin littéral** : l'URL à empreinte de contenu est ce qui évite
   qu'un remplacement de dessin reste invisible derrière le cache de Next et des
   navigateurs. Même raison que dans `components/Navigation.tsx`.
4. `npm test`, puis regarder la rangée **en grille**, les trois papiers ensemble.
---

## L6 · L'onglet Amis — 8 générations

### Ce qu'on NE fait pas, et il faut le lire d'abord

La demande de départ était **« un grand fond avec la mascotte qui prend la pose,
or, argent, bronze »**. Telle quelle, c'est **exactement la campagne L1-bis**,
produite deux fois et retirée le 2026-08-27 — sur `/amis` précisément, où les
cartes couvraient l'étagère, les coupes et le miroir.

La règle qui en est sortie tient en une phrase : **on met un décor là où l'on
pose un héros, et un MUR là où du contenu défile.** `/amis` est un empilement de
cartes opaques du haut au bas de l'écran : un fond dessiné y serait invisible
sous les cartes et parasite entre elles, les deux au même moment.

**Mais l'intuition était bonne.** Ce qui manque à cet onglet, ce n'est pas un
fond : c'est **une scène bornée**, une zone que rien ne recouvre parce qu'elle
fait partie de la carte. D'où le déplacement : le podium n'est pas derrière
l'écran, il est **dans le bloc du classement**, en bandeau de tête.

### Deux économies avant de commander quoi que ce soit

**Les blasons de rang existent déjà.** `public/images/defi/ranks/{bronze,
argent, or, platine, diamant, maitre}.webp` sont produits et servis depuis le
2026-07-19 — `components/defi/RankBadge.tsx` les affiche. Or `AmisHome` rend
`tier.emoji` (médaille système) à deux endroits. **Zéro génération à commander :
il y a un composant à brancher.** C'est l'amélioration la moins chère du lot.

**Les avatars des amis ne sont pas de ce lot.** Les huit animaux
(`GHOST_AVATARS`, `lib/social.ts`) sont des emoji, mais **L1** refait déjà tout
le système d'avatar en roster de 32 portraits. Les redessiner ici produirait un
jeu concurrent. Le jour où L1 arrive, ces huit lignes tombent d'elles-mêmes.

**Le coffre d'équipe non plus** : `TeamChestCard` prendra le coffre `epique` de
**L3-a**. Un coffre collectif n'a pas besoin d'un dessin propre — c'est le même
objet, ouvert par plusieurs.

### Le lot, donc

| Id | Où | Format | Ce que ça remplace |
|---|---|---|---|
| `podium` | tête du bloc « classement de l'école » | **3:1** | rien — zone à créer |
| `solo` | état vide « En solo pour l'instant » | 1:1 | un texte gris seul |
| `parrainage` | carte « Invite un ami, +30 gemmes » | 1:1 | un aplat violet |
| `oral-ecoute` | `OralListenCard`, en tête d'onglet | 1:1 | une icône Lucide |
| `echelle-*` (×4) | segments « Échelle du classement » | 1:1 | quatre onglets de texte nu |

### L6-a · Le podium — la pièce maîtresse, format **3:1**

**LE PODIUM EST UN DÉCOR, PAS UN CASTING.** Les trois premiers du classement
sont de VRAIS élèves : l'app pose leurs avatars sur les marches. Si le dessin
contient déjà trois personnages, il ment — et il ment différemment chaque
semaine. On dessine donc **la scène vide** : trois marches, la lumière, les
lauriers. Les têtes viennent du produit.

C'est aussi ce qui rend le dessin réutilisable : classement d'école, de
département, de région, national — quatre écrans, une image.

> Game asset: an empty three-step winners podium for a playful mobile learning
> app for teenagers, seen straight from the front, slightly below eye level.
> The centre step is the tallest and glows warm gold, the left step is silver,
> the right step is bronze. Painterly stylized 3D-cartoon look, bold chunky
> shapes, thick clean dark-indigo outlines, glossy airbrushed shading, warm
> spotlights from above with soft light beams and floating golden dust. A
> laurel wreath motif is carved on the front face of the centre step. The
> podium sits on a deep violet stage floor that fades to darkness at the far
> left and far right edges. THE STEPS ARE EMPTY — no characters, no figures, no
> trophies, no cups standing on them. Wide horizontal composition, the podium
> centred and occupying the middle half of the frame. No text, no numbers, no
> watermark.

**Le piège à surveiller sur celui-ci** : les modèles ajoutent des personnages
sur un podium par réflexe. Si la première sortie en contient, relancer en
insistant — « an EMPTY podium, a stage with nobody on it ». Ne pas détourer :
cette image garde son fond, c'est un bandeau plein.

### L6-b · La mascotte en solo — format **1:1**

**VOICI où la mascotte qui prend la pose a sa place.** Pas en fond d'écran, mais
dans le **vide** : l'élève sans ami voit aujourd'hui « En solo pour l'instant »
en gris sur blanc. Un état vide est le seul endroit d'une interface où un dessin
ne recouvre rien et n'est recouvert par rien — il EST le contenu.

> Game asset: the app mascot — a cheerful teenage boy with dark tousled hair,
> round glasses and a warm brown tweed jacket — standing alone on a small
> podium step, one hand raised in a friendly wave, the other holding a blank
> pennant flag, smiling and looking straight at the viewer. Painterly stylized
> 3D-cartoon look, bold chunky shapes, thick clean dark-indigo outlines, glossy
> airbrushed shading, warm rim light from the upper left. A few small golden
> confetti shapes float around him. Isolated on a plain flat white background,
> centered, full body, no ground shadow, no text, no watermark.

**Joindre la mascotte existante en référence** (`public/images/mascotte/`) avec
`match the exact art style and the exact character design of the reference
image`. C'est le même personnage que partout ailleurs : il ne doit pas changer
de visage en changeant d'onglet.

### L6-c · Le parrainage — format **1:1**

La carte « Invite un ami : vous gagnez chacun 30 gemmes ». Le mot qui compte est
**chacun** : le dessin doit montrer une réciprocité, pas un cadeau à sens unique.

> Game asset: two hands doing a high-five, seen from the side, with a large
> glowing violet gem crystal floating in the space between the palms and small
> golden sparks radiating outward. Painterly stylized 3D-cartoon look, bold
> chunky shapes, thick clean dark-indigo outlines, glossy airbrushed shading,
> bright key light from the upper front. Isolated on a plain flat white
> background, centered, no ground shadow, no text, no watermark.

### L6-d · L'écoute de l'oral — format **1:1**

`OralListenCard` est placée **au-dessus de tous les classements**, et pour une
raison écrite dans le code : c'est le seul usage social du produit qui ne soit
pas une comparaison — quelqu'un attend quelque chose de toi. Elle mérite mieux
qu'un pictogramme au trait.

> Game asset: a warm wooden desk microphone with a soft violet foam windscreen,
> seen from a three-quarter front angle, with two curved golden sound waves
> radiating from it and a small glowing amber notification dot at the tip.
> Painterly stylized 3D-cartoon look, bold chunky shapes, thick clean
> dark-indigo outlines, glossy airbrushed shading, bright key light from the
> upper front. Isolated on a plain flat white background, centered, no ground
> shadow, no text, no watermark.

### L6-e · L'échelle du classement — 4 emblèmes, format **1:1**

Quatre segments aujourd'hui rendus en texte nu : **Lycée · Département · Région
· National**. C'est une échelle — elle doit se lire comme une montée, donc
partager une forme commune (l'écusson) et ne varier que par ce qu'il contient.

**À faire en dernier, et c'est discutable.** Un sélecteur de portée est de la
*signalisation* au sens de L5 : la banalité y est une qualité. On les commande
parce qu'ils sont quatre et qu'ils forment une progression visible — pas parce
qu'un concurrent nous les prendrait.

> Game asset: a heraldic shield emblem for a playful mobile learning app, seen
> straight from the front, with a thin golden rim and a deep violet field.
> Inside the shield: … (la ligne du tableau). Painterly stylized 3D-cartoon
> look, bold chunky shapes, thick clean dark-indigo outlines, glossy airbrushed
> shading, bright key light from the upper front. Isolated on a plain flat
> white background, centered, no ground shadow, no text, no letters, no
> watermark.

| Id | Dans l'écusson |
|---|---|
| `echelle-lycee` | a simple school building with a clock on its facade and two small flags |
| `echelle-departement` | three small rooftops side by side above a winding road |
| `echelle-region` | a range of rolling hills with a river cutting through them |
| `echelle-national` | a stylized globe with meridian lines and a laurel branch curving beneath it |

### Le contrat technique de ce lot

- `podium` : `public/images/amis/podium.webp`, **1536×512**, fond CONSERVÉ.
- Les six autres : `public/images/amis/<id>.webp`, **512×512**, fond
  transparent (détourage via `scripts/lib/fond-peint.mjs`, comme partout).
- Les sources 4K vont dans `assets-sources/amis/`, **jamais dans `public/`**
  (cf. `lib/public-poids.test.ts`, qui refuse désormais l'inverse).
- Aucun de ces fichiers n'est référencé tant que le code n'est pas branché :
  générer d'abord, câbler ensuite, une pièce à la fois.

---

## Checklist technique

1. Générer → détourer → **WebP**. Garder les sources hors dépôt
   (`assets-sources/`, gitignoré).
2. Tailles : vignettes de matières **320×320** ; bustes de boss **512×512** ;
   avatars, cadres, coffres, cartes **512×512** ; bannières de profil
   **1024×384** ; scènes 16:9 **1536×864**. Poids visé **< 100 Ko** par scène,
   **< 60 Ko** par objet détouré, **< 40 Ko** par avatar (ils s'affichent par
   32 dans la galerie).
3. **Déposer le fichier ne suffit pas** — chaque famille a sa liste à compléter,
   sinon l'image reste invisible :
   - vignette de matière → `VIGNETTE_SLUGS` (`lib/subject-style.ts`) ;
   - scène de jeu → `GAME_SCENE_IDS` (`lib/defi/modes-catalog.ts`) ;
   - boss → champs `image` / `scene` du catalogue de `lib/bosses.ts` ;
   - avatar, cadre → `lib/avatars.ts` (le fichier à créer avec le lot L1).
   Seule exception : les **bannières de profil**, déjà déclarées dans
   `lib/profile-banners.ts` — le fichier déposé s'affiche tout seul.
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
| Boss (DA v2) | 14 bustes + 15 scènes sur 17 | `public/images/boss/` |
| Blasons de rang | 6 paliers (Bronze → Maître) | `public/images/defi/ranks/` |
| Modes de l'Arène | 5 affiches + 5 scènes 16:9 | `public/images/defi/modes/` |
| Jeux de salon | 9 scènes 16:9 | `public/images/defi/jeux/` |
| Vignettes de matières | 24 objets détourés — lot **complet** depuis le v4 | `public/images/matieres/vignettes/` |
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
