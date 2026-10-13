# Les fiches de révision — le format et la chaîne de production

*13/10/2026. Lucas : « ok go, la 3e, la 2de, la 1re, la Terminale doivent être faites ». La liste des 260 fiches à produire, par palier, est dans `docs/fiches-mvp.md`.*

## Ce qu'est une fiche

**Une page A4 composée** (794 × 1123 px à 96 ppp), à imprimer ou à lire sur téléphone : le gabarit Thalès validé par Lucas (`assets-sources/fiches/gabarit-pdf/thales.html`, puis la maquette B `assets-sources/fiches/maquettes/planche-a-b.png`). Le texte, les formules et les figures sont **écrits** — jamais générés par un modèle d'image : la fiche entière peinte par Nano Banana se trompait à chaque essai (« connuss », « AN = 2 », un papillon faux). Seule l'**illustration** d'ambiance en haut à droite est générée (Nano Banana 2.1, 1,5 crédit, fond magenta détouré).

Une fiche se lit par étages, et on peut s'arrêter à n'importe lequel : l'accroche, les figures ou les définitions, la formule ou la règle, la méthode, l'exemple résolu, les verdicts, « sur ta copie », les pièges, « je me teste » (réponses à l'envers).

## Les fichiers

```
contenu/fiches/<niveau>/<matière>.json              l'index : chapitre (uuid), titre, thème, palier, slug
contenu/fiches/<niveau>/<matière>/<slug>.json       le contenu d'une fiche
assets-sources/fiches/illustrations/<niveau>/<matière>/<slug>.webp   l'illustration (facultative)
fiches-out/<niveau>/<matière>/<slug>.{html,png,pdf} le rendu (hors git)
scripts/fiches/gabarit.css                           la feuille, commune à toutes les fiches
scripts/fiches-rendre.mjs                            le rendu + la mesure du débordement
```

```
node scripts/fiches-rendre.mjs 3e maths                        toute la matière
node scripts/fiches-rendre.mjs 3e maths utiliser-le-theoreme-de-thales
node scripts/fiches-rendre.mjs --html                          le HTML seul
```

Le script **mesure le débordement** (`data-deborde`) : une fiche dont un bloc passe sous le pied est signalée et le script sort en code 2. On raccourcit le contenu, jamais on ne laisse une fiche se couper.

## Le contenu d'une fiche

```json
{
  "titreSurligne": "Thalès",            // le mot du titre surligné en jaune (facultatif)
  "accroche": "Des droites parallèles, des quotients égaux.",
  "epreuve": "brevet",                  // brevet · bac · bac-1re · oral · socle (→ l'autocollant jaune)
  "bonus": "…",                         // la pilule du pied (facultatif)
  "illustration": { "fichier": "assets-sources/fiches/illustrations/…webp", "prompt": "…" },
  "marcel": "Pas de parallèles,\npas de Thalès !",   // Marcel et sa bulle, SI pas d'illustration
  "rangs": [ { "colonnes": "348px 1fr", "blocs": [ … ] }, { "blocs": [ … ] } ]
}
```

Une **rangée** = une ligne de la page ; `colonnes` est une `grid-template-columns` (par défaut, une part égale par bloc).

### Le balisage dans les chaînes

`**gras**` · `==surligné==` · `__violet__` · `~~à la main~~` (Caveat, violet) · `{num/dén}` fraction · `[[entouré]]` (le résultat cerclé de corail, dans un post-it) · `\n` saut de ligne · `&nbsp;` avant `: ; ? !` · le HTML (`<i>`, `<sup>`, `<br>`) passe tel quel.

### Les blocs

| `type` | Champs | Ce que c'est |
|---|---|---|
| `figures` | `numero`, `titre`, `figures: [{svg, legende, sous}]`, `colonnes`, `legende: {jeton, texte}` | une ou plusieurs figures SVG (`viewBox` 220 × 170 en général), tracées à la main |
| `formule` | `numero`, `titre`, `lignes: ["{AM/AB} = {AN/AC}"]`, `petite`, `regle`, `note`, `teinte` (jaune) | la formule en grand, la règle dessous, une note à la main avec sa flèche |
| `etapes` | `numero`, `titre`, `etapes: [{titre, texte}]` | la méthode en 2 à 4 temps, numéros et flèches |
| `postit` | `titre`, `donnees`, `calcul`, `aparte`, `resultat` | l'exemple résolu sur un post-it lavande, le résultat `[[cerclé]]` |
| `verdicts` | `numero`, `titre`, `oui: {titre, texte}`, `non: {titre, texte}`, `essai: {titre, texte}` | une coche verte, une croix corail, un essai en pointillés |
| `copie` | `titre`, `lignes: [{texte, quoi}]`, `pied` | « Sur ta copie » : les lignes à écrire, à la main, étiquetées |
| `pieges` | `items: [texte]` | la carte corail des erreurs classiques |
| `test` | `questions: [texte]`, `reponses`, `colonnes` | « Je me teste », réponses imprimées à l'envers |
| `texte` | `numero`, `titre`, `paragraphes: [texte]`, `teinte` | un bloc de prose courte |
| `liste` | `numero`, `titre`, `items: [{titre, texte}]`, `deux` | des points clés à puce carrée, sur une ou deux colonnes |
| `definitions` | `numero`, `titre`, `items: [{terme, definition}]` | un lexique |
| `tableau` | `numero`, `titre`, `entetes`, `lignes: [[…]]` | un tableau à 2-4 colonnes |
| `frise` | `numero`, `titre`, `etapes: [{date, texte}]`, `horizontale` | une frise (histoire, étapes d'un processus) |
| `cartes` | `numero`, `titre`, `cartes: [{titre, texte}]`, `colonnes` | des mini-cartes lavande (notions, auteurs, cas) |
| `citation` | `texte`, `auteur`, `teinte` | une citation à la main |

`teinte` sur une carte : `jaune` · `lavande` · `corail` · `vert` · `bleu` (ruban assorti). `numero` accepte un nombre ou un symbole (`★`, `!`, `?`).

## Écrire une fiche

1. **Partir du cours en base** : `node <scratchpad>/cours-extraire.mjs 3e maths plan.txt` relit les seeds (`supabase/contenu/*.sql`, le plus récent gagne) et donne sections et termes en gras de chaque leçon ; `--complet` donne le texte. La fiche parle le vocabulaire du cours et du quiz.
2. **Choisir ce qui tombe** : une fiche n'est pas un résumé du chapitre, c'est ce qu'on doit savoir refaire le jour de l'épreuve — la figure, la formule, la méthode, UN exemple résolu, ce qu'on écrit sur la copie, les pièges, trois questions.
3. **Tenir sur la page** : rendre, lire la mesure, couper. Une fiche de maths : 5 rangées ; une fiche d'histoire : frise + 2 ou 3 cartes + pièges + test.
4. **L'illustration** : un prompt par fiche dans `illustration.prompt` (la scène, en anglais, « same art style as the reference icons », fond magenta), généré par lots de 10 avec le connecteur Higgsfield, détouré par chroma-key (comme `scripts/duel-titres.mjs`), déposé sous `assets-sources/fiches/illustrations/`. Sans fichier, la fiche se rend quand même, avec Marcel et sa bulle si `marcel` est renseigné.

## Le reste du catalogue : le palier P3 (13/10/2026)

Lucas, le 13/10 au soir : « fais toutes les fiches de révision manquantes de la 3e à la Terminale, travail en continu, puis les classes manquantes du collège — objectif : toutes les fiches de révision faites ». Mesuré en base ce soir-là : **2 952 chapitres** (3e 307, 2de 336, 1re 947 dont 260 fiches de lecture, Tle 711, 4e 262, 5e 250, 6e 134), 260 fiches faites → **2 041 à écrire au lycée, 646 au collège**.

- **Le palier `P3`** marque tout ce qui n'est pas dans le MVP. Même gabarit, même contrat, une différence : **l'illustration n'est pas exigée** — le prompt est écrit dans `illustration.prompt`, le fichier viendra quand les crédits le permettront (2 600 images à 1,5 crédit, les ~257 crédits restants n'en couvrent pas un dixième) ; en attendant la fiche se rend **avec Marcel et sa bulle** (`marcel`, obligatoire sur une P3 sans image). `lib/fiches/contenu.test.ts` tient ce contrat : le MVP (P1, P2) reste illustré et complet (plancher 97 · 12 · 54 · 97), une P3 a son prompt, et une image ou une bulle.
- **L'index d'abord, le contenu ensuite** : les entrées d'un lot sont ajoutées à l'index (`palier: "P3"`, slug dérivé du titre, 60 caractères au plus, unique dans la matière) AVANT que les rédacteurs écrivent ; `listerFiches` ignore une entrée sans contenu, donc un lot en cours ne casse ni le rendu ni le registre — seul le test « chaque entrée a son contenu » attend la fin du lot. Les rédacteurs (agents, dix fiches chacun, en parallèle) n'écrivent QUE `contenu/fiches/<niveau>/<matière>/<slug>.json` et rendent chaque fiche aussitôt ; un lot qui n'a pas abouti se retire de l'index.
- **Le nom court de chaque matière** du catalogue est dans `MATIERES` (`scripts/fiches-rendre.mjs`) : une matière inconnue y est un bloc du test, pas une page sans nom.
- **L'ordre** : 3e (brevet : sciences, EMC, puis les langues), 2de, 1re, Tle, puis 4e, 5e, 6e. Dans une classe, les matières à examen avant les langues, les langues avant les arts et l'EPS ; les 260 fiches de lecture de 1re en dernier.
- Après chaque lot : rendre, `fiches-registre.mjs`, puis le dépôt complet `fiches-deposer.mjs <niveau> <matière>` (le PDF et la page floutée ; l'aperçu 360 px, que l'app ne lit pas, est sauté quand l'illustration manque).

## Reste à faire

- ~~Le stockage payant~~ — fait le 13/10/2026 : migration `563_fiches_pdf_storage.sql` (bucket privé `fiches`, bucket public `fiches-apercus`, `fiche_pdf_acces`), registre `lib/fiches/registre.ts` (`node scripts/fiches-registre.mjs`), page Fiche du chapitre qui montre la fiche PDF (`components/fiches/FichePdfCarte.tsx`), route `app/api/fiches/[chapitre]` (URL signée par la session), dépôt `SUPABASE_SERVICE_ROLE_KEY=… node scripts/fiches-deposer.mjs`. Après une fiche ajoutée ou modifiée : rendre, `fiches-registre.mjs`, `fiches-deposer.mjs <niveau> <matière>` (le PDF, l'illustration en 360 px et la page FLOUTÉE que voit l'élève avant de payer — fabriquée depuis le PNG rendu, jamais en CSS sur le vrai contenu). Débloquée, la fiche se lit dans l'app (`LecteurPdf`, loupe jusqu'à 3×) et se télécharge (`?dl=1`).
- ~~Un test Vitest~~ — fait : `lib/fiches/contenu.test.ts` relit les 260 fiches (index ↔ contenu, un chapitre = une fiche, composition sans bloc inconnu ni balisage en clair, un bloc `test` à trois questions, illustration présente, `titreSurligne` dans le titre). Le débordement, lui, reste mesuré par `scripts/fiches-rendre.mjs` (il faut Chromium).
