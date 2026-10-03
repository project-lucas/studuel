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

**Au 03/10/2026 au soir : la 555** (`schema/555_quetes_trois_gestes.sql`) — le catalogue SQL des quêtes du jour autour des trois gestes (apprendre, se tester, jouer). Une seule fonction remplacée (`quest_catalog`), idempotente. Sans elle, les nouvelles quêtes s'affichent mais n'avancent pas et ne se paient pas (seuls les deux duels avancent) ; rien ne casse.

**Plus tôt le 03/10/2026 : rien.** Les 466 → 554 (corrections de cours et cahier de toutes les classes) sont passées par l’API de gestion et contrôlées : 8 841 exercices, les 2 947 chapitres de classe ont chacun leurs trois exercices et leurs clés. **Au 01/10/2026 dans la nuit : rien.** La **465** (`schema/465_classement_amis.sql`)
est passée la dernière : `classement_amis()`, qui sert le bloc « Toi et tes
amis » de l'onglet Moi — trophées et temps de travail de la semaine, pour
l'élève et ses amis acceptés. Essayée sur PGlite (rejeu double, périmètre,
droits), puis en production dans une transaction annulée, puis exécutée deux
fois (API de gestion) et contrôlée : la fonction existe, `SECURITY DEFINER`,
exécutable par `authenticated`, refusée à `anon`, et un élève n'y voit que son
cercle ; la sonde la marque ✓. ⚠️ La production n'avait ce soir-là **aucune
amitié** (9 profils) : le chemin « avec amis » n'a pu être vérifié que sur
PGlite. La 381 (`revision_par_quiz`) n'est plus appelée par l'app depuis que ce
bloc a remplacé « Tes matières » ; elle peut rester en base.

**Avant la 465 : rien non plus.** Mesuré en SQL (API de gestion), et non plus à la seule
clé anon : les 212 fonctions de la base sont identiques à leur dernière
définition dans les migrations, aucune policy n'appelle `auth.uid()` à nu,
aucune table n'est sans RLS, et les migrations « non sondables » (194 → 362,
340 → 350, 365) ont été contrôlées une à une. Ce qui suit est l'historique.

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

**Écrites depuis cette mesure**, dans l'ordre : 376 (ligue de la semaine) · 377
(tirelire d'amis) · 378 (crédits de Marcel, avatar dessiné) · **379 (coffre
d'équipe, qui remplace la tirelire : à coller APRÈS la 378)** · **380
(multiplicateur de gains d'XP : +0,1 par ami, ×2 sous potion ; APRÈS la 379)** ·
**381 (révision par quiz, pour le récap des matières de l'onglet Moi ; APRÈS la
380)**.
`npm run sonde` dit lesquelles manquent encore ; le générateur ci-dessus les
rassemble.

**Ensuite, `contenu/365_exercices_6e.sql`** : le catalogue d'exercices de 6e
dépend de la 364 (colonnes `difficulte` et `origine`). Sa sonde est impossible à la
clé anon, mais la 364 étant absente, la 365 n'a pas pu tourner.

Les migrations marquées `?` par la sonde (CREATE OR REPLACE, tables réservées aux
comptes connectés) sont invisibles à la clé anon **par conception**. Ce n'est pas
un retard ; ne les rejouer que si une voisine échoue.

## Le chantier « contenu 3e → Tle » : 382 → 420 (écrites les 26 et 28-29/09/2026)

Trente-neuf fichiers, **à coller dans l'ordre des numéros, un par un**. Tous sont
idempotents et ont été rejoués deux fois de suite sur un Postgres embarqué qui
reproduit le catalogue de production du 26/09 (1 672 fiches) : aucune erreur,
aucune fiche introuvable, la seconde passe ne change rien.

| N° | Ce que c'est | Dépend de |
|---|---|---|
| 382 | Rangement : anciens programmes du français 1re, rayons Langue/Culture, thèmes manquants | — |
| 383 (`schema/`) | Les 19 matières de la voie technologique | — |
| 384 | Anciennes fiches des options de Tle rattachées à leur chapitre | — |
| 385 → 387 | 243 fiches neuves de la voie générale (maths 3e/1re, œuvres du bac 2027, langues du lycée, options de Tle) | 382 |
| 388 → 392 | 386 fiches de la voie technologique (tronc commun, STMG, STI2D, STL, ST2S) | **383** |
| 393 → 397 | 6 168 questions de plus : les quiz passent de 8 à 12 questions (16 questions fausses corrigées) | — |
| 398 → 399 | 432 cours allongés ou corrigés | — |
| 400 → 419 | 6 123 sujets de contrôle blanc (3 par fiche, de la 3e à la Tle) | 364, **385 → 392** |
| 420 | 127 erreurs de cours et de quiz corrigées (remplacements ciblés, sources corrigées aussi) | 385 → 399 |

Les fichiers font de 450 à 760 Ko (les 341, 342 et 365, déjà passées, en
faisaient autant). `_ASSOCIE/genere-a-executer.mjs` n'en embarque qu'une partie :
382, 384 et 393 → 420 ne sont pas sondables à la clé anon. Les coller à la main.
Sources : `scripts/contenu/`, `scripts/complements/`, `contenu/controles/` ;
régénération : `scripts/seed-contenu.mjs --modules …`,
`scripts/seed-complements.mjs`, `scripts/controles-sql.ts`, `scripts/corrections-sql.mjs` (commande exacte dans
l'en-tête de chaque fichier).

## La suite : 421 → 430 (écrites les 29 et 30/09/2026), EXÉCUTÉES le 01/10/2026

382 → 420 sont passées en production le 29/09. Ces dix fichiers, rejoués deux
fois sur le catalogue de production du 29/09 (2 952 fiches), sont passés le
01/10/2026 par l'API de gestion (22 morceaux, aucune erreur) et ont été
vérifiés en SQL : 35 590 questions, 7 536 sujets de contrôle hors 6e, 51
exercices de cahier, aucune correction des 422 et 425 introuvable. **Toutes
les fiches du programme ont 12 questions** ; il ne reste sous ce seuil que les
22 fiches de culture générale de niveau « tous » (économie, entrepreneuriat,
figures historiques, finances personnelles, fiscalité), à 10 questions, qui
n'étaient pas dans le chantier.

Le même jour, la **365** (402 sujets de contrôle blanc de 6e) s'est révélée
absente — aucun sujet de 6e au catalogue — et a été exécutée : 402 sujets,
134 fiches sur 134.

| N° | Ce que c'est | Dépend de |
|---|---|---|
| 421 | Cahier d'exercices de 6e, première vague (51 exercices) | 372 |
| 422 | 19 cours mal affichés (tableaux collés, 12 programmes devenus des blocs de code) | — |
| 423 | 1 040 questions de plus, les 260 fiches de lecture de 1re | — |
| 424 | 944 questions de plus, fiches jumelles du collège | — |
| 425 | 17 erreurs de cours corrigées, dont une consigne de sécurité dangereuse en technologie 6e | — |
| 426 | 1 124 questions de plus, collège 5e et 4e | — |
| 427 | 504 questions de plus, 6e | — |
| 428 | 408 sujets de contrôle blanc, 5e | 364 |
| 429 | 225 sujets de contrôle blanc, 4e | 364 |
| 430 | 780 sujets de contrôle blanc, les 260 fiches de lecture de 1re (1,8 Mo : **découper** avec `_ASSOCIE/decoupe-migrations.mjs`, l'éditeur SQL tronque les gros collages) | 364 |

## Le cahier d'exercices de 3e, 1re et Tle : 431 → 455 (générées et EXÉCUTÉES le 01/10/2026)

Vingt-cinq fichiers, 2 199 exercices (3e 309, 1re 93, Tle 1 797), générés par
`scripts/exercices-sql.ts` depuis `contenu/exercices/` (commande exacte dans
l'en-tête de chaque fichier). Chaque fichier reste **sous ~300 Ko** : il crée
une table temporaire puis la verse, donc `_ASSOCIE/decoupe-migrations.mjs` ne
peut pas le couper — une matière trop lourde se partage avec `--fichiers`
(l'histoire-géo de Tle : 439 et 440). L'ordre entre eux est indifférent ;
prérequis : la 372.

Avant de passer, chaque fichier a été essayé sur la production dans une
transaction annulée (`BEGIN … ROLLBACK`). Après : 2 250 exercices en base
(les 51 de 6e compris), autant de clés, 9 060 questions ; le juge SQL
(`exercice_juger`) accepte la bonne réponse de chacune et refuse une réponse
vide ; un second passage ne change rien ; un élève de 3e ouvre l'exercice 1
d'un chapitre et trouve le 2 verrouillé.

| N° | Fichier | Exercices | Matières |
|---|---|---|---|
| 431 | `431_exercices_3e_1.sql` | 54 | français |
| 432 | `432_exercices_3e_2.sql` | 78 | histoire-géo |
| 433 | `433_exercices_3e_3.sql` | 84 | maths |
| 434 | `434_exercices_3e_4.sql` | 93 | physique-chimie |
| 435 | `435_exercices_1re.sql` | 93 | français |
| 436 | `436_exercices_tle_1.sql` | 75 | allemand, anglais |
| 437 | `437_exercices_tle_2.sql` | 99 | espagnol, LLCER anglais |
| 438 | `438_exercices_tle_3.sql` | 90 | grec, latin |
| 439 | `439_exercices_tle_4.sql` | 99 | histoire-géo (lots k154, k155, k156) |
| 440 | `440_exercices_tle_5.sql` | 60 | histoire-géo (lots k157, k158) |
| 441 | `441_exercices_tle_6.sql` | 108 | EMC, HGGSP |
| 442 | `442_exercices_tle_7.sql` | 87 | histoire-géo et philosophie de la voie techno |
| 443 | `443_exercices_tle_8.sql` | 99 | HLP, musique |
| 444 | `444_exercices_tle_9.sql` | 87 | philosophie, EPS |
| 445 | `445_exercices_tle_10.sql` | 93 | maths, maths expertes |
| 446 | `446_exercices_tle_11.sql` | 90 | maths complémentaires, maths de la voie techno |
| 447 | `447_exercices_tle_12.sql` | 93 | physique-chimie |
| 448 | `448_exercices_tle_13.sql` | 96 | I2D, physique-chimie et maths (STI2D, STL) |
| 449 | `449_exercices_tle_14.sql` | 66 | SVT |
| 450 | `450_exercices_tle_15.sql` | 108 | enseignement scientifique, NSI |
| 451 | `451_exercices_tle_16.sql` | 93 | SES |
| 452 | `452_exercices_tle_17.sql` | 96 | droit et économie, management (STMG) |
| 453 | `453_exercices_tle_18.sql` | 66 | sciences de l'ingénieur |
| 454 | `454_exercices_tle_19.sql` | 96 | biochimie-biologie-biotechnologie, SPCL (STL) |
| 455 | `455_exercices_tle_20.sql` | 96 | chimie-biologie-physiopathologie, sciences sanitaires et sociales (ST2S) |

Reste hors base : les 162 exercices de 5e écrits dans `contenu/exercices/5e/`.

## « Tout impeccable de la 3e à la Terminale » : 456 → 464 (écrites et EXÉCUTÉES le 01/10/2026)

Audit complet des quatre niveaux le même jour (2 301 fiches, 27 618 questions,
6 903 sujets de contrôle) : chaque fiche a son cours, son quiz à 12 questions
et ses trois contrôles ; aucun défaut de rendu dans les cours. Ce que l'audit
a trouvé, et ce qui le corrige :

| N° | Ce que c'est |
|---|---|
| 456 | 48 passages périmés ou inexacts dans les cours, les quiz ET les corrigés de contrôle : ASEAN à onze, zone euro à 21, 44 PMA, Grand oral de la session 2027 (deux temps, coefficient 8), ordonnance du 21 avril 1944 (CFLN), ODD, web au domaine public en 1993, majorité à 18 ans, Arctique, 8 milliards |
| 457 | Cahier de 3e, retouche : l'exercice sur l'ordonnance de 1944 (lot `histoire-geo.k012` reversé) |
| 458 | Cahier de Tle, retouche : les exercices de SI sur le Grand oral (lot `si.k195` reversé) |
| 459 | 73 explications de quiz d'un mot (« Symbole N. ») réécrites en une ou deux phrases |
| 460 | 23 questions qui renvoyaient à « l'exemple de la fiche » portent maintenant leurs données |
| 461 → 463 | Cahier de 3e, suite : SVT (93 exercices), EMC (30), technologie (69) — toutes les matières des épreuves écrites du brevet ont leur cahier (501 exercices en 3e, 2 442 en base) |
| 464 | 24 passages de fiches jumelles écrits pour un autre niveau : « au bac » lu en 3e et en 5e (allemand, espagnol), « du brevet » lu au lycée (anglais, espagnol) |

`scripts/corrections-sql.mjs` sait désormais corriger trois choses de plus :
`controle` (un fragment dans les sujets de contrôle du catalogue), `reponse`
(une option entière d'une question nommée) et `explication_de` (l'explication
d'une question nommée). Sans ces champs, il régénère les 420 et 425 à
l'identique. Les sources (`scripts/contenu`, `scripts/complements`,
`contenu/controles`, `contenu/exercices`) portent les mêmes corrections, et
une question reformulée garde son identifiant (clé d'origine en 5e élément).

## Le cahier pour toutes les classes : 466 → 554 (générées le 02/10/2026, EXÉCUTÉES le 03/10/2026)

Toutes les classes et toutes les matières ont leur cahier : 2 947 chapitres sur 2 952
ont leurs trois exercices (★ ★★ ★★★) ; les cinq restants sont les chapitres « tous
niveaux » (fiscalité, économie…). 166 lots écrits et relus, plus 545 fiches jumelles
recopiées (`contenu/exercices/<niveau>/<matière>.jumelles*.json`). Chaque fichier
est sous 300 Ko (table temporaire : il ne se découpe pas après coup).

| N° | Ce que c'est |
|---|---|
| 466 | 22 erreurs de cours relevées par les rédacteurs du cahier, vérifiées à une source (cours, quiz, contrôles) |
| 467 → 471 | Cahier de 6e (5 fichiers) |
| 472 → 481 | Cahier de 5e (10 fichiers) |
| 482 → 493 | Cahier de 4e (12 fichiers) |
| 494 → 498 | Cahier de 3e (5 fichiers) |
| 499 → 512 | Cahier de 2de (14 fichiers) |
| 513 → 548 | Cahier de 1re (36 fichiers) |
| 549 → 554 | Cahier de Tle (6 fichiers) |

Ordre : la 466 d'abord, puis 467 → 554 dans l'ordre ; toutes demandent la 372.
Elles mettent à jour sans doublon les exercices déjà en base (identifiant dérivé
du chapitre et de la position).

## Pourquoi ne pas « tout fusionner en un fichier » ?

Une migration exécutée ne se modifie jamais (règle du projet), et les fichiers ne
décrivent pas exactement la production. Les policies ont été réécrites en base
(208, 320), des contenus ont été corrigés depuis l'admin, et certains seeds n'ont
jamais tourné. Un vrai point de départ unique (« baseline ») se fabrique à partir
d'un `pg_dump --schema-only` de la production, pas en recollant ces fichiers.
C'est faisable le jour où l'on voudra recréer un projet Supabase de zéro.
