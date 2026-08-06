# scripts/contenu — la source du contenu scolaire

Ce dossier contient le **contenu pédagogique écrit à la main**, en JavaScript.
`scripts/seed-contenu.mjs` le transforme en migration SQL idempotente.

```powershell
# Regénérer les migrations de contenu (216 → 220, puis 225 → 233)
node scripts/seed-contenu.mjs --num 216 --modules emc,sport                        > supabase/216_contenu_emc_sport.sql
node scripts/seed-contenu.mjs --num 217 --slugs musique,arts-plastiques            > supabase/217_contenu_musique_arts.sql
node scripts/seed-contenu.mjs --num 218 --slugs allemand,grec                      > supabase/218_contenu_allemand_grec.sql
node scripts/seed-contenu.mjs --num 219 --modules snt,hlp,llcer-anglais,si,maths-complementaires > supabase/219_contenu_lycee.sql
node scripts/seed-contenu.mjs --num 220 --modules espagnol-lycee,latin-lycee       > supabase/220_contenu_espagnol_latin_lycee.sql
node scripts/seed-contenu.mjs --num 225 --slugs philosophie                        > supabase/225_contenu_philosophie_tle.sql
node scripts/seed-contenu.mjs --num 226 --slugs anglais                            > supabase/226_contenu_anglais_grammaire_tle.sql
node scripts/seed-contenu.mjs --num 227 --modules histoire-geo-tle                 > supabase/227_contenu_histoire_tle.sql
node scripts/seed-contenu.mjs --num 228 --slugs enseignement-scientifique          > supabase/228_contenu_enseignement_scientifique_tle.sql
node scripts/seed-contenu.mjs --num 229 --modules geographie-tle                   > supabase/229_contenu_geographie_tle.sql
node scripts/seed-contenu.mjs --num 230 --modules emc-tle                          > supabase/230_contenu_emc_tle.sql
node scripts/seed-contenu.mjs --num 231 --modules espagnol-tle                     > supabase/231_contenu_espagnol_tle.sql
node scripts/seed-contenu.mjs --num 232 --modules hlp-tle                          > supabase/232_contenu_hlp_tle.sql
node scripts/seed-contenu.mjs --num 233 --modules svt-tle                          > supabase/233_contenu_svt_tle.sql
```

Un slug = un ou PLUSIEURS modules : `scripts/contenu/anglais-tle.mjs` porte le
slug `anglais`, le nom du fichier ne dit que le périmètre couvert.

## `--slugs` ou `--modules` ?

`--slugs` filtre par MATIÈRE, `--modules` par FICHIER (sans le `.mjs`). Le
second est nécessaire dès qu'une matière est écrite en plusieurs modules qui
doivent partir dans des migrations SÉPARÉES :

- `histoire-geo-tle.mjs` (227, **exécutée**) et `geographie-tle.mjs` (229)
  portent tous deux le slug `histoire-geo` ;
- `emc.mjs` (216, **exécutée**) et `emc-tle.mjs` (230) portent tous deux `emc` ;
- `espagnol-lycee.mjs` (220, **exécutée**) et `espagnol-tle.mjs` (231) portent
  tous deux `espagnol` ;
- `hlp.mjs` (219, **exécutée**) et `hlp-tle.mjs` (232) portent tous deux `hlp`.

`svt-tle.mjs` (233) est aujourd'hui le seul module du slug `svt` — la SVT des
autres niveaux vient encore des migrations écrites à la main (094 → 142). Il est
généré par `--modules` malgré tout, pour que la commande imprimée dans l'en-tête
reste juste le jour où un second module SVT apparaîtra.

`--slugs histoire-geo` les fusionnerait dans un seul fichier SQL et RÉÉCRIRAIT
une migration déjà exécutée — ce que le projet interdit. D'où le passage de 216
et 227 à `--modules` : leur contenu est inchangé (vérifié à l'octet près), seule
la commande de régénération l'est.

L'en-tête généré imprime désormais **la commande qui a servi** (`--modules …`
quand c'est par fichier qu'on a filtré) et non une reconstruction par slug :
recopier l'ancienne ligne d'en-tête d'une migration écrite en plusieurs modules
aurait justement produit la fusion qu'on veut éviter.

Ou en une commande : `npm run contenu`.

## Pourquoi passer par un générateur

Le contenu se pense **par cycle** (le programme d'EPS du cycle 4 vaut pour la 5e,
la 4e et la 3e) alors que la base range les chapitres **par niveau**. Écrire le
SQL à la main obligerait à recopier trois fois les mêmes questions avec des UUID
différents — c'est exactement là que naissent les doublons.

Ici : on écrit une fois, la duplication par niveau est mécanique, et les UUID
sont **dérivés du contenu** (SHA-1). Conséquence directe : regénérer produit les
mêmes identifiants, donc **rejouer une migration ne crée jamais de doublon**.

## Format d'un module

```js
export default {
  slug: 'emc',        // slug de la matière, DÉJÀ présente dans `subjects`
  nom: 'EMC',         // ce qui atterrit dans `quizzes.subject`
  blocs: [{
    niveaux: ['5e', '4e', '3e'],   // le bloc est dupliqué sur chaque niveau
    positionDepart: 5,             // FACULTATIF : numérote depuis 5 au lieu de 1
    chapitres: [{
      titre: 'La règle et le droit',
      lecon: { titre: '…', cours: '…markdown…' },
      questions: [
        ['Question ?', ['a', 'b', 'c', 'd'], 0, 'Explication.'],  // QCM (4 options)
        ['Affirmation.', ['Vrai', 'Faux'], 1, 'Explication.'],    // vrai/faux
      ],
    }],
  }],
}
```

### Trois champs facultatifs

```js
titreMigration: 'LE PROGRAMME DE PHILOSOPHIE (Tle)',  // titre de l'en-tête SQL
motif: `Pourquoi cette migration existe.\nPlusieurs lignes possibles.`,
menage: [{                    // du SQL joué AVANT les insertions
  raison: 'Pourquoi ce ménage est nécessaire.',
  sql: `DELETE FROM …;`,
}],
```

`menage` sert quand un ancien découpage entre en collision avec le nouveau :
`chapters` porte `UNIQUE(subject_id, level, title)`, donc un titre déjà pris fait
passer le chapitre à la trappe (`ON CONFLICT DO NOTHING`) et sa leçon tombe
ensuite sur une clé étrangère absente — la migration s'arrête à mi-parcours.
C'est le cas de `philosophie.mjs`, qui retire les 5 chapitres hérités de 008/051
avant d'installer les 19 notions du programme.

Un module qui déclare `motif` prend son en-tête en main : le constat historique
des « 11 matières vides » n'est plus imprimé, ni le paragraphe sur la
duplication par cycle si la matière n'a qu'un niveau.

`positionDepart` sert quand un bloc VIENT S'AJOUTER derrière des chapitres déjà
en base : la page matière trie par `position`, et repartir de 1 mêlerait les
nouveaux aux anciens dans un ordre indéfini. On peut aussi laisser un TROU
volontaire (`histoire-geo-tle.mjs` démarre à 26 pour réserver les positions 6 à
25 aux chapitres encore à écrire) : un `INSERT … ON CONFLICT DO NOTHING` ne met
jamais à jour la position d'une ligne déjà en base, donc la place se réserve
d'avance ou ne se réserve plus.

## Les règles que le générateur fait respecter

Il **refuse de générer** (et dit pourquoi) si :

- un cours fait moins de 200 caractères ;
- un cours n'a **aucune section `##`** — sans elle, la carte mentale n'est pas
  dérivable (cf. `lib/mind-map-auto.ts`) et la tuile « Carte » promettrait dans
  le vide ;
- un chapitre a moins de 6 questions ;
- une question n'a pas exactement 2 (`Vrai`/`Faux`) ou 4 options, ou a des
  options en double, ou une bonne réponse hors bornes ;
- deux chapitres portent le même titre au même niveau (contrainte `UNIQUE` de la
  table `chapters` : la migration échouerait à mi-parcours).

## Conventions de rédaction

- **Pas de LaTeX** : `components/LessonRichContent` ne le rend pas. Écrire
  `P = U × I`, `x²`, `√n` en texte.
- Le markdown supporté est celui du composant : `##` (sections), `-` (puces),
  `**gras**`, `>` (idée clé).
- Tout est en français, y compris pour les langues vivantes : les énoncés
  interrogent la langue étrangère **en français**, comme le reste de l'app.
- Une explication par question, systématiquement : c'est elle qui fait la
  différence entre un quiz et une leçon.
