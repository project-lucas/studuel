# Migrations Supabase

Toutes les migrations s'exécutent **à la main**, dans le SQL Editor du dashboard
Supabase, et sont **idempotentes** (réexécutables sans erreur). Aucun outil ne les
lance automatiquement.

## Le rangement (depuis le 19/09/2026)

| Dossier | Ce qu'il contient | Fichiers |
|---|---|---|
| `schema/` | La structure : `schema.sql`, tables, fonctions (RPC), policies RLS, droits, index, correctifs de données | ~150 |
| `contenu/` | Les seeds de contenu : quiz, fiches, cours, chapitres, annales, capsules, exercices | ~225 (95 % du poids) |
| `outils/` | Des requêtes de diagnostic (`_mesurer-perf.sql`), jamais des migrations | 1 |

Le **numéro** reste l'ordre d'exécution, quel que soit le dossier. Une nouvelle
migration prend le numéro suivant et va dans `schema/` ou `contenu/` selon sa nature.
Le nom de fichier est la clé partout (tests miroirs, `lib/sante.ts`, générateur de
lots) : le rangement n'y change rien.

**Le nombre de fichiers n'a aucun effet sur l'app.** La base n'exécute une
migration qu'une fois, quand on la colle ; elle ne relit jamais ce dossier. La
vitesse de l'app dépend des requêtes faites à chaque écran, pas de l'historique.

## Ce qui reste à exécuter en production

Mesuré par la sonde (`npm run sonde`, lecture seule, clé anon) le **22/09/2026**
(inchangé depuis le 19/09) :

**14 migrations absentes** : 353 · 354 · 355 · 363 · 364 · 366 · 367 · 368 · 369 ·
370 · 371 · 372 · 373 · 374 — dont deux de **performance** (354 : comptes du
catalogue en base ; 374 : fin de course en une transaction, Realtime par clé
primaire, index en double retirés) sur lesquelles le code tourne en mode
dégradé tant qu'elles dorment. Puis la **375** (ménage du schéma, audit du 22/09 :
`docs/audit-migrations.md`). Elles sont rassemblées, dans l'ordre, en **un seul
fichier** à coller, qui se termine par le filet RLS de la 320
(`SELECT public.optimiser_policies_rls();`) :

```bash
node _ASSOCIE/genere-a-executer.mjs   # sonde la base, écrit _ASSOCIE/a-executer.sql
```

puis coller `_ASSOCIE/a-executer.sql` en entier (Ctrl+A) → Run.

**Ensuite, `contenu/365_exercices_6e.sql`** : le catalogue d'exercices de 6e
dépend de la 364 (colonnes `difficulte` et `origine`). Sa sonde est impossible à la
clé anon, mais la 364 étant absente, la 365 n'a pas pu tourner.

Les migrations marquées `?` par la sonde (CREATE OR REPLACE, tables réservées aux
comptes connectés) sont invisibles à la clé anon **par conception**. Ce n'est pas
un retard ; ne les rejouer que si une voisine échoue.

## Pourquoi ne pas « tout fusionner en un fichier » ?

Une migration exécutée ne se modifie jamais (règle du projet), et les fichiers ne
décrivent pas exactement la production. Les policies ont été réécrites en base
(208, 320), des contenus ont été corrigés depuis l'admin, et certains seeds n'ont
jamais tourné. Un vrai point de départ unique (« baseline ») se fabrique à partir
d'un `pg_dump --schema-only` de la production, pas en recollant ces fichiers.
C'est faisable le jour où l'on voudra recréer un projet Supabase de zéro.
