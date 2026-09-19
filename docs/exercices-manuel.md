# Le cahier d’exercices — guide de rédaction

> La tuile **Exercice** de chaque chapitre ouvre un **cahier** : trois exercices faits comme une page de manuel scolaire (une mise en situation, des documents, des questions dessous), notés **★ / ★★ / ★★★**, débloqués l’un après l’autre, qui rapportent des gemmes (5 / 10 / 15). Ce guide dit comment les écrire.
>
> Moteur : `lib/exercices/` (types, validation, compilation, jugement) · écran : `components/exercices/` · base : `supabase/372_cahier_exercices.sql` · contenu : `contenu/exercices/<niveau>/<matière>.json`.

---

## 1. L’esprit

Lucas, 18/09/2026 : *« Ce n’est pas un quiz mais la résolution d’un problème : un schéma, un document, une analyse de texte avec des questions dessous, l’interprétation d’un graphique, une carte de France… La résolution de problème doit devenir un plaisir et non plus une peur esquivée. »*

Un bon exercice du cahier :

- **part d’une situation** concrète, vivante, à hauteur d’élève (Inès prépare des crêpes pour la kermesse ; une ville balnéaire change de taille l’été ; un immeuble rattrapé par la mer). Jamais « Exercice 3 : calculer ».
- **fait travailler sur un DOCUMENT** : on ne peut pas répondre sans le regarder. Si une question se répond sans le document, elle n’a rien à faire là (c’est une question de quiz).
- **fait raisonner pas à pas** : les questions s’enchaînent comme dans un manuel (on lit → on relève → on calcule → on conclut).
- **est original** : situations inventées pour l’exercice, prénoms variés, lieux réels quand on fait de la géographie. Pas de « Pierre achète des pommes ».
- **est juste** : chaque chiffre, chaque date, chaque fait est exact ; chaque réponse attendue est la SEULE défendable.
- **se corrige tout seul** : l’élève a deux essais par question ; au premier raté il reçoit le **coup de pouce** (`aide`), au second la **correction** (`explication`). Écris-les avec soin : c’est là qu’on apprend.

### La progression des trois exercices d’un chapitre

| | ★ Exercice 1 | ★★ Exercice 2 | ★★★ Exercice 3 |
|---|---|---|---|
| Rôle | **Mettre en confiance.** Doit être réussi par tout élève qui a lu le cours. | Appliquer dans une situation nouvelle. | Croiser, justifier, aller un cran plus loin. |
| Questions | 2 à 4 (idéal : 3) | 3 à 5 (idéal : 4) | 3 à 6 (idéal : 5) |
| Documents | 1 (parfois 2) | 1 ou 2 | 2 (parfois 3), à **croiser** |
| Gestes | lire, relever, repérer, un calcul direct | déduire, calculer en 2 étapes, comparer | combiner deux documents, raisonner en plusieurs étapes, conclure |
| Piège | aucun | un détail à bien lire (unité, légende) | un raisonnement complet, mais **jamais une astuce cachée** |

- **L’exercice 1 ne fait peur à personne** : réponses lisibles directement dans le document ou à un calcul près. Pas de piège, pas de vocabulaire hors cours.
- **Reste au niveau de la classe.** Un ★★★ de 6e est un exercice de 6e un peu plus long, pas un exercice de 4e.
- **Varie** : les trois exercices d’un chapitre n’ont ni la même compétence, ni le même type de document principal, ni la même forme de questions.

---

## 2. Le fichier

Un fichier par niveau et par matière : `contenu/exercices/6e/maths.json`.

```json
{
  "niveau": "6e",
  "matiere": "maths",
  "exercices": [
    {
      "chapitre": "972a14b2-f06b-557c-82f6-f68521a51e80",
      "position": 1,
      "etoiles": 1,
      "titre": "Les crêpes de la kermesse",
      "competence": "calculer",
      "situation": "Inès prépare des crêpes pour la kermesse du collège…",
      "documents": [ … ],
      "questions": [ … ]
    }
  ]
}
```

- `chapitre` : l’UUID du chapitre (table `chapters`), fourni avec la commande.
- `position` 1, 2, 3 et `etoiles` **égales** à la position.
- `titre` : 3 à 70 caractères, qui donne envie (« L’immeuble que la mer a rattrapé »).
- `competence` (affichée en tête, comme dans un manuel) : `resoudre` · `calculer` · `raisonner` · `lire-carte` · `lire-graphique` · `lire-tableau` · `analyser-texte` · `analyser-document` · `observer-schema` · `se-reperer-temps` · `se-reperer-espace` · `geometrie` · `programmer` · `experimenter` · `comprendre-langue` · `manier-langue` · `argumenter` · `modeliser`.
- `situation` : 1 à 3 phrases, 520 caractères au plus.

**Mise en forme des textes** (partout : situation, énoncés, options, cellules, explications) : `**gras**`, `*italique*`, `{{3/4}}` pour une fraction en étage, `\n` pour un retour à la ligne. Typographie française : apostrophe courbe `’`, guillemets « … » avec espaces, `…`.

**Vérifier son fichier** : `npx vitest run lib/exercices/contenu.test.ts` (validation stricte + chaque bonne réponse rejouée). **Le voir et le jouer** : `http://localhost:3000/dev/exercices?f=6e/maths&i=0` (serveur de dev lancé ; moteur de démonstration, aucun compte). **Capture téléphone** :

```bash
"$LOCALAPPDATA/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=390,2400 --virtual-time-budget=20000 --screenshot=<scratchpad>/x.png "http://localhost:3000/dev/exercices?f=6e/maths&i=0"
```

**Générer la migration** (quand un niveau est prêt) :

```bash
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercices-sql.ts --num 374 --niveau 6e --matieres maths,svt --suffixe 1 > supabase/374_exercices_6e_1.sql
```

---

## 3. Les documents

Chaque document a un `id` (lettres, chiffres, `-`, `_`), un `type`, un `titre` conseillé (affiché à côté de l’onglet « Doc 1 ») et une `source` facultative (italique, en dessous).

**Sources honnêtes.** Un texte ou des chiffres inventés pour l’exercice le disent : « Article imaginé pour l’exercice », « Chiffres arrondis, 2023 », « D’après Molière, *Le Médecin malgré lui* (1666) » pour une œuvre du domaine public légèrement adaptée. **Jamais** une fausse citation attribuée à une personne réelle, jamais un journal réel inventé.

**Droits — et recopie.** On ne recopie **jamais mot pour mot** un texte publié au-delà d’une ou deux lignes célèbres, même du domaine public (une traduction de la Bible, de Kipling, d’Ovide a elle-même un traducteur ; et une recopie longue est bloquée à l’écriture). Les extraits sont des **adaptations rédigées pour l’exercice**, dans une langue de la classe, annoncées honnêtement : « D’après la Genèse », « Récit adapté d’Ovide », « D’après Molière, *Les Fourberies de Scapin* (1671) — texte adapté ». Pour une œuvre récente au programme (Pommerat, Roubaud…) : **aucune citation**, un texte « à la manière de », présenté comme « écrit pour l’exercice ».

**Palette** (`teinte`) : `encre` · `violet` · `jaune` · `corail` · `vert` · `bleu` · `ciel` · `turquoise` · `rose` · `ambre` · `brun` · `sable` · `gris` · `blanc`. La couleur porte une information (légende, série, eau, forêt) ; restes-en aux conventions (eau bleue/ciel, forêt vert, désert sable, relief brun).
**Motifs** (`motif`) : `plein` · `clair` · `hachures` · `points` · `aucun`.

### 3.1 `texte` — récit, poème, théâtre, article, lettre, source historique

```json
{ "id": "scene", "type": "texte", "genre": "theatre", "titre": "Acte I, scène 1",
  "auteur": "D’après Molière, Le Médecin malgré lui (1666)",
  "blocs": [
    { "didascalie": "Sganarelle et Martine entrent en se querellant." },
    { "personnage": "Sganarelle", "replique": "Trouve-moi un [[m|faiseur]] [[m|de]] [[m|fagots]]…" },
    "Un paragraphe simple (récit, article…)."
  ] }
```

- `genre` : `recit` · `poeme` · `theatre` · `article` · `lettre` · `source` · `consigne`. Paragraphes numérotés en marge (récit, article, source) ; vers numérotés (1, 5, 10…) pour un poème, où une chaîne vide `""` sépare deux strophes.
- **Mots à toucher** : `[[g|mot]]` marque un mot-cible du groupe `g` ; une question `zone` vise le groupe (`"reponse": ["g"]`) et l’élève doit toucher **tous** les mots du groupe. Tous les autres mots sont des leurres automatiques. Ne marque que le mot (pas l’article : dans « l’enfant », seul « enfant »). Évite de viser un mot qui apparaît plusieurs fois.
- 3 500 caractères au plus. Un extrait se lit en moins de deux minutes.

### 3.2 `tableau`

```json
{ "id": "tarifs", "type": "tableau", "titre": "…", "colonnes": ["Nombre d’entrées", "1", "5", "10"],
  "lignes": [["Tarif A (€)", 4, 20, "?"], ["Tarif B (€)", 22, 30, 40]], "enteteLignes": true }
```
Une case `"?"` s’affiche en violet (valeur à trouver). Cases touchables : `r<ligne>c<colonne>` (à partir de 0, sans compter l’en-tête). 7 colonnes, 14 lignes au plus.

### 3.3 `graphique`

```json
{ "id": "pop", "type": "graphique", "forme": "barres", "titre": "…",
  "categories": ["Janv.", "Févr.", "Mars"],
  "series": [{ "nom": "Population", "valeurs": [7, 6, 7], "teinte": "turquoise" }],
  "axeY": { "titre": "Personnes présentes", "unite": "en milliers", "min": 0, "max": 45, "pas": 5 },
  "axeX": { "titre": "Mois" }, "valeurs": false }
```
- `forme` : `barres` · `barres-h` (libellés longs) · `courbe` (points sur les graduations, le premier sur l’axe : idéal pour une proportionnalité) · `secteurs` (une série, en %) · `climat` (diagramme ombrothermique : 12 mois, séries[0] = températures °C, séries[1] = précipitations mm).
- 1 à 3 séries (légende automatique au-delà d’une). Catégories touchables : `k0`, `k1`…
- `valeurs: true` écrit la valeur au bout de chaque barre : à éviter quand la question consiste justement à lire le graphique.

### 3.4 `carte`

```json
{ "id": "carte", "type": "carte", "titre": "…", "fond": "france",
  "regions": [{ "code": "BRE", "teinte": "vert", "motif": "hachures", "etiquette": "Bretagne" }],
  "regionsCliquables": true,
  "fleuves": ["loire", "seine"], "reliefs": true,
  "lieux": [
    { "id": "a", "lieu": "lyon", "symbole": "lettre", "lettre": "A", "teinte": "corail" },
    { "id": "b", "lon": -1.13, "lat": 45.51, "nom": "Soulac-sur-Mer", "symbole": "point" }
  ],
  "traits": [{ "points": ["marseille", "lyon", "paris"], "style": "fleche", "teinte": "corail", "etiquette": "Couloir rhodanien" }],
  "aires": [{ "contour": [[-5, 48], [-1, 48], [-1, 47], [-5, 47]], "teinte": "bleu", "motif": "clair", "etiquette": "…" }],
  "etiquettes": [{ "texte": "Golfe de Gascogne", "lon": -3, "lat": 45.2, "style": "mer" }],
  "legende": [{ "teinte": "vert", "motif": "hachures", "texte": "Région de montagne" }],
  "muette": false }
```

**Les fonds** :

| `fond` | Emprise | Zones (`code`) | Fleuves | Massifs (`reliefs`) | Déserts |
|---|---|---|---|---|---|
| `france` | métropole + voisins | 13 régions : `ARA` Auvergne-Rhône-Alpes · `BFC` Bourgogne-Franche-Comté · `BRE` Bretagne · `CVL` Centre-Val de Loire · `COR` Corse · `GES` Grand Est · `HDF` Hauts-de-France · `IDF` Île-de-France · `NOR` Normandie · `NAQ` Nouvelle-Aquitaine · `OCC` Occitanie · `PDL` Pays de la Loire · `PAC` Provence-Alpes-Côte d’Azur | `seine` `loire` `garonne` `rhone` `rhin` `dordogne` `marne` `vienne` `tarn` `durance` `moselle` `meuse` `saone` `lot` `allier` `adour` `charente` | `alpes` `pyrenees` `massif-central` `jura` `vosges` `ardennes` | — |
| `monde` | planisphère (Equal Earth), 60° S → 84° N | pays, code ISO 3 (`FRA`, `CHN`, `USA`, `BRA`…) | `nil` `amazone` `mississippi` `yangzi` `huang-he` `gange` `indus` `niger` `congo` `mekong` `volga` `danube` `saint-laurent` `ob` `ienissei` `lena` `parana` `zambeze` `brahmaputra` | `himalaya` `andes` `rocheuses` `alpes` `oural` `atlas` `appalaches` `tibet` `caucase` | `sahara` `gobi` `kalahari` `namib` `atacama` `arabie` `syrie` `thar` `australie` |
| `mediterranee` | de l’Atlantique au golfe Persique, 22° N → 48° N | pays actuels (ISO 3) | `nil` `tigre` `euphrate` `jourdain` `danube` `po` `tibre` `rhone` `ebre` `tage` `douro` `guadalquivir` `garonne` `loire` `seine` `rhin` | `alpes` `pyrenees` `apennins` `atlas` `taurus` `zagros` `caucase` `balkans` `pinde` `liban` `alpes-dinariques` `carpates` | `sahara` `arabie` `syrie` |
| `europe` | de l’Islande à l’Oural | pays (ISO 3) | `rhin` `danube` `rhone` `seine` `loire` `elbe` `oder` `vistule` `tamise` `po` `ebre` `tage` `douro` `dniepr` `volga` `garonne` `meuse` | `alpes` `pyrenees` `apennins` `carpates` `balkans` `alpes-dinariques` `caucase` `oural` `alpes-scandinaves` `massif-central` | — |

- La liste exacte des codes est dans `lib/exercices/cartes/codes.ts`.
- **Antiquité** : sur `mediterranee`, les frontières d’aujourd’hui ne sont PAS dessinées (sauf `"frontieres": true`) — on voit les terres, les mers, les fleuves. Dessine l’extension d’un empire avec une `aire` (contour en [lon, lat]).
- `cadrage` : `[lonMin, latMin, lonMax, latMax]` pour zoomer (ex. l’Asie de l’Est sur le fond monde, la Grèce sur la Méditerranée). Sur un grand fond, zoome dès que les repères sont serrés : deux lettres à moins de 5 % de la largeur visible se chevauchent.
- **Lieux** : par leur clé dans `lib/exercices/cartes/lieux.ts` (villes de France et du monde, sites préhistoriques et antiques : `lascaux`, `athenes`, `carthage`, `babylone`, `changan`…) ou par `lon`/`lat`. `symbole` : `point` · `etoile` · `carre` · `triangle` · `lettre` (un rond avec `lettre`). `nom` écrit le nom à côté ; sans `nom`, le point est muet.
- `reperes: true` (fond monde) trace l’équateur, les tropiques et les cercles polaires.
- `muette: true` tait les noms des mers et des pays du fond (carte muette).
- Zones touchables : `lieux`, `aires` et `traits` qui ont un `id` ; les régions/pays si `"regionsCliquables": true` (alors TOUTES les régions se touchent).

### 3.5 `frise`

```json
{ "id": "frise", "type": "frise", "titre": "…", "debut": -800, "fin": 500, "pas": 100,
  "periodes": [{ "id": "rep", "debut": -509, "fin": -27, "nom": "République romaine", "teinte": "ambre" }],
  "evenements": [{ "id": "fond", "date": -753, "nom": "Fondation légendaire de Rome" }] }
```
Années négatives = avant J.-C. 24 graduations et 9 événements au plus ; noms d’événements courts (≤ 20 caractères s’affichent en entier, sinon ils sont rappelés en légende).

### 3.6 `figure` (géométrie)

```json
{ "id": "fig", "type": "figure", "cadre": { "xmin": 0, "xmax": 10, "ymin": 0, "ymax": 7 }, "quadrillage": true,
  "points": [{ "id": "A", "x": 1, "y": 1 }, { "id": "B", "x": 7, "y": 1, "position": "se" }, { "id": "C", "x": 1, "y": 5, "position": "no" }],
  "segments": [{ "de": "A", "a": "B", "codage": 1, "longueur": "6 cm" }, { "de": "A", "a": "C", "codage": 1 }],
  "polygones": [{ "sommets": ["A", "B", "C"], "teinte": "violet", "motif": "clair" }],
  "angles": [{ "sommet": "A", "de": "B", "a": "C", "droit": true }],
  "droites": [{ "par": ["P", "Q"], "nom": "(d)", "style": "axe" }],
  "cercles": [{ "centre": "O", "rayon": 3 }] }
```
Unités = carreaux ; y vers le haut. 40 unités au plus de côté. `style: "axe"` = axe de symétrie (trait mixte corail). Touchables : points (par leur id) et tout élément qui a un `id`.

### 3.7 `droite` (graduée)

```json
{ "id": "dg", "type": "droite", "min": 0, "max": 3, "pas": 1, "division": 10,
  "points": [{ "id": "a", "valeur": 1.4, "nom": "A" }], "graduationsCliquables": true }
```
`division` = en combien de parts on coupe un pas (10 = dixièmes). Avec `graduationsCliquables`, chaque graduation se touche : `v1.4`, `v2.5`… (« Place 2,7 sur la droite » → `"reponse": ["v2.7"]`).

### 3.8 `schema` (dessin libre)

```json
{ "id": "cellule", "type": "schema", "titre": "…", "largeur": 320, "hauteur": 220,
  "elements": [
    { "forme": "ellipse", "cx": 160, "cy": 110, "rx": 120, "ry": 80, "teinte": "vert", "motif": "clair", "id": "membrane", "zone": true },
    { "forme": "cercle", "cx": 150, "cy": 105, "r": 24, "teinte": "violet", "motif": "plein", "id": "noyau", "zone": true },
    { "forme": "etiquette", "x": 270, "y": 30, "texte": "?", "vers": [180, 100] },
    { "forme": "ligne", "de": [20, 200], "a": [300, 200], "fleche": "fin", "teinte": "bleu" },
    { "forme": "texte", "x": 160, "y": 215, "texte": "Légende", "taille": "petit", "italique": true },
    { "forme": "emoji", "x": 40, "y": 40, "emoji": "🌱", "taille": 28 }
  ] }
```
Formes : `rect` (x, y, l, h, arrondi, texte) · `cercle` (cx, cy, r, texte) · `ellipse` · `ligne` (de, a, fleche `fin`/`debut`/`deux`, style `pointilles`, courbe) · `polygone` (points) · `chemin` (d SVG, ferme) · `texte` (taille `petit`/`normal`/`grand`, gras, italique, ancre `debut`/`milieu`/`fin`) · `etiquette` (bulle avec trait de rappel `vers`) · `emoji`. Repère : x vers la droite, y vers le BAS. Garde 20 unités de marge ; vise 300–340 de large ; un texte « normal » fait ~12 unités de haut. Touchables : éléments avec `id` et `"zone": true`. **Relis toujours un schéma en capture** : c’est le document où l’on se trompe le plus.

### 3.9 `chaine` (alimentaire, d’énergie, d’information, cycle)

```json
{ "id": "chaine", "type": "chaine", "disposition": "ligne",
  "noeuds": [{ "id": "herbe", "texte": "Herbe", "emoji": "🌿" }, { "id": "lapin", "texte": "Lapin", "emoji": "🐇" }, { "id": "renard", "texte": "?" }],
  "liens": [{ "de": "herbe", "a": "lapin", "texte": "est mangée par" }, { "de": "lapin", "a": "renard" }] }
```
`disposition` : `ligne` · `colonne` · `cycle`. Les liens relient des nœuds **voisins** (en cycle, le dernier et le premier aussi) ; une toile plus compliquée se dessine en `schema`. Un nœud `"?"` s’affiche en violet (à trouver). Tous les nœuds se touchent.

### 3.10 `fiche` (document « authentique »)

```json
{ "id": "ticket", "type": "fiche", "modele": "ticket", "entete": "Supérette du port", "sousTitre": "12/06 — 10:42", "emoji": "🧾",
  "lignes": [{ "texte": "2 baguettes", "valeur": "2,40 €" }, { "separateur": true }, { "texte": "TOTAL", "valeur": "8,75 €", "gras": true, "id": "total" }],
  "pied": "Merci de votre visite !", "teinte": "bleu" }
```
`modele` : `ticket` · `menu` · `affiche` · `etiquette` (nutritionnelle) · `invitation` · `panneau` · `recette` · `horaires` · `carte-postale`. Lignes touchables si elles ont un `id`.

### 3.11 `dialogue` (SMS ou bulles de BD)

```json
{ "id": "sms", "type": "dialogue", "modele": "sms",
  "participants": [{ "nom": "Emma", "emoji": "👧", "cote": "gauche" }, { "nom": "Tom", "emoji": "👦", "cote": "droite" }],
  "repliques": [{ "qui": "Emma", "texte": "Where [[v|is]] my bag?" }] }
```
Les mots se marquent comme dans un texte.

### 3.12 `scratch`

```json
{ "id": "prog", "type": "scratch", "scripts": [[
  { "categorie": "evenement", "texte": "quand le drapeau vert est cliqué" },
  { "categorie": "controle", "texte": "répéter (4) fois", "interieur": [
    { "categorie": "mouvement", "texte": "avancer de (50) pas", "id": "av" },
    { "categorie": "mouvement", "texte": "tourner de (90) degrés", "id": "tr" } ] } ]] }
```
Catégories : `evenement` · `mouvement` · `apparence` · `son` · `controle` · `capteur` · `operateur` · `variable` · `stylo`. `(10)` = case ronde, `[texte]` = case carrée. Blocs touchables : ceux qui ont un `id`.

### 3.13 `circuit` (schéma électrique normalisé)

```json
{ "id": "c", "type": "circuit", "titre": "Deux lampes en dérivation",
  "branches": [
    { "de": [0, 4], "a": [0, 0], "composant": "pile" },
    { "de": [0, 0], "a": [4, 0] }, { "de": [4, 0], "a": [8, 0] },
    { "de": [0, 4], "a": [4, 4] }, { "de": [4, 4], "a": [8, 4] },
    { "de": [4, 0], "a": [4, 4], "composant": "lampe", "nom": "L1", "allume": true, "id": "l1" },
    { "de": [8, 0], "a": [8, 4], "composant": "moteur", "id": "m" } ] }
```
Chaque branche est un segment **horizontal ou vertical** entre deux nœuds du quadrillage ([x, y] en carreaux, 0 à 20, y vers le BAS) ; un composant se dessine au milieu de sa branche (2 carreaux au moins). Composants : `pile` · `lampe` · `interrupteur-ouvert` · `interrupteur-ferme` · `moteur` · `del` · `diode` · `resistance` · `amperemetre` · `voltmetre` · `generateur` · `buzzer`. **Sens** : la borne **+ de la pile est du côté de `de`** ; une **diode / DEL laisse passer le courant de `de` vers `a`** (vérifie que le courant sortant du + la traverse dans ce sens, sinon elle est bloquée et ne s’allume pas). `allume: true` fait briller une lampe ou une DEL. Les points de dérivation (3 fils ou plus) se posent tout seuls. Composants touchables : ceux qui ont un `id`.

### 3.14 `horloge` et `solide`

```json
{ "id": "h", "type": "horloge", "heures": 14, "minutes": 35, "numerique": false }
{ "id": "p", "type": "solide", "longueur": 4, "largeur": 3, "hauteur": 2, "cubes": true, "cotes": true, "unite": "cm" }
```

---

## 4. Les questions

Toutes ont `enonce` (5–320 car.), `explication` (obligatoire, 5–520 car.) et `aide` (fortement conseillée, ≤ 260 car.).

- **`aide`** (coup de pouce, après un premier essai faux) : met sur la voie SANS donner la réponse. « Attention : le graphique compte en milliers. » « Cherche la barre la plus basse. »
- **`explication`** (après la question finie) : la bonne réponse **en gras** et le pourquoi en une ou deux phrases chaleureuses. C’est la correction du manuel.

| `type` | Champs | Bon usage |
|---|---|---|
| `zone` | `document`, `reponse` (ids / groupes), `multiple?`, `portee?` | **Le plus « manuel »** : toucher sur la carte, le mot dans le texte, la barre du graphique, l’élément du schéma. À privilégier. |
| `nombre` | `reponse`, `unite?`, `tolerance?` | Calculs, lectures de valeurs. L’élève tape « 12,5 », « 1 200 » ou « 3/4 ». Mets une `tolerance` quand on lit une valeur approchée sur un graphique. |
| `choix` | `options` (2–6), `reponse` (indice, ou liste d’indices), `ordreFixe?` | Pour conclure, interpréter, justifier. Options plausibles, de longueur comparable ; la bonne n’est pas toujours la plus longue. Les options sont mélangées (sauf `ordreFixe`, pour Vrai/Faux ou une échelle). |
| `texte` | `reponse` (réponses acceptées), `placeholder?` | Un MOT court et sans ambiguïté (un nom de fleuve, une ville, un mot du texte). Liste toutes les variantes acceptables (« Loire », « la Loire »). Accents, majuscules et ponctuation sont ignorés. Jamais une phrase. |
| `ordre` | `items` (3–7) **dans le bon ordre** | Étapes d’un protocole, d’un récit, dates à ranger. |
| `association` | `paires` (2–6) `[gauche, droite]` | Mot ↔ définition, pays ↔ capitale, organe ↔ fonction. |
| `categories` | `categories` (2–4), `items` (3–10) `[texte, indice]` | Trier : vivant / non vivant, nom / verbe, gestes / mots. |
| `trous` | `texte` avec `___`, `reponses` (une liste par trou), `banque?` | Phrase de conclusion à compléter, conjugaison, vocabulaire. Avec `banque` (mots à toucher, leurres compris) c’est plus doux ; sans banque, l’élève tape. |

**Deux essais, deux points.** Juste du premier coup = 2 points, au second = 1, sinon 0. L’exercice est **réussi à la moitié des points** : c’est lui qui ouvre le suivant et verse les gemmes. Donc : pas de question « impossible » ; une question difficile est une question qui demande de réfléchir, pas de deviner.

**Les pièges à éviter**
- Une question qui se répond sans le document.
- Deux options défendables ; une réponse `texte` qu’on peut écrire de plusieurs façons non listées ; un nombre dont l’arrondi n’est pas précisé (« arrondi à l’unité » dans l’énoncé, ou une `tolerance`).
- Un document qui donne la réponse d’une question (une chaîne déjà dans l’ordre quand on demande l’ordre).
- Des chiffres faux, des dates approximatives, une carte où le lieu n’est pas au bon endroit.
- Le même geste trois fois de suite (trois `choix` d’affilée).

---

## 5. La relecture (à faire pour chaque exercice)

1. `npx vitest run lib/exercices/contenu.test.ts` est vert.
2. Je l’ai **joué** dans l’aperçu : chaque réponse juste est acceptée, chaque coup de pouce aide, chaque explication corrige.
3. Je l’ai **regardé** en capture téléphone (390 px) : rien ne déborde, les étiquettes se lisent, les repères ne se chevauchent pas.
4. L’exercice 1 est facile pour tous ; le 3 demande de croiser les documents ; les trois sont différents.
5. Chaque fait est exact ; chaque source est honnête.
