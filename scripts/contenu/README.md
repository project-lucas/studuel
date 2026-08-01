# scripts/contenu — la source du contenu scolaire

Ce dossier contient le **contenu pédagogique écrit à la main**, en JavaScript.
`scripts/seed-contenu.mjs` le transforme en migration SQL idempotente.

```powershell
# Regénérer les 4 migrations de contenu (216 → 219)
node scripts/seed-contenu.mjs --num 216 --slugs emc,sport                          > supabase/216_contenu_emc_sport.sql
node scripts/seed-contenu.mjs --num 217 --slugs musique,arts-plastiques            > supabase/217_contenu_musique_arts.sql
node scripts/seed-contenu.mjs --num 218 --slugs allemand,grec                      > supabase/218_contenu_allemand_grec.sql
node scripts/seed-contenu.mjs --num 219 --slugs snt,hlp,llcer-anglais,si,maths-complementaires > supabase/219_contenu_lycee.sql
```

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
