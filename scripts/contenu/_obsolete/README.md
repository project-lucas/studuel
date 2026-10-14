# Modules de contenu obsolètes

Les sources des migrations déjà exécutées dont la matière a été REFAITE depuis.
Ils ne sont pas chargés par `scripts/seed-contenu.mjs` par défaut (il ne lit que
la racine de `scripts/contenu/`), mais il les relit quand `--modules` les nomme :
c'est ce qui permet à `npm run contenu` de régénérer la 216 (`emc,sport`) à
l'identique. On ne les modifie plus.

- `sport.mjs` (216), `sport-college.mjs` (339), `sport-tle-2026-09.mjs` (387) :
  l'EPS du programme officiel, remplacée le 14/10/2026 par la culture sportive
  (`sport-6e-5e`, `sport-4e-3e`, `sport-2de-1re`, `sport-tle` — docs/CADRAGE-SPORT.md).
