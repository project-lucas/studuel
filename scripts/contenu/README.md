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
node scripts/seed-contenu.mjs --num 226 --modules anglais-tle                      > supabase/226_contenu_anglais_grammaire_tle.sql
node scripts/seed-contenu.mjs --num 227 --modules histoire-geo-tle                 > supabase/227_contenu_histoire_tle.sql
node scripts/seed-contenu.mjs --num 228 --slugs enseignement-scientifique          > supabase/228_contenu_enseignement_scientifique_tle.sql
node scripts/seed-contenu.mjs --num 229 --modules geographie-tle                   > supabase/229_contenu_geographie_tle.sql
node scripts/seed-contenu.mjs --num 230 --modules emc-tle                          > supabase/230_contenu_emc_tle.sql
node scripts/seed-contenu.mjs --num 231 --modules espagnol-tle                     > supabase/231_contenu_espagnol_tle.sql
node scripts/seed-contenu.mjs --num 232 --modules hlp-tle                          > supabase/232_contenu_hlp_tle.sql
node scripts/seed-contenu.mjs --num 233 --modules svt-tle                          > supabase/233_contenu_svt_tle.sql
node scripts/seed-contenu.mjs --num 245 --modules histoire-geo-1re                 > supabase/245_contenu_histoire_geo_1re.sql
node scripts/seed-contenu.mjs --num 246 --modules histoire-tle-1-6                 > supabase/246_contenu_histoire_tle_1_6.sql
node scripts/seed-contenu.mjs --num 249 --modules allemand-tle                     > supabase/249_contenu_allemand_tle.sql
node scripts/seed-contenu.mjs --num 252 --modules physique-chimie-tle             > supabase/252_contenu_physique_chimie_tle.sql
node scripts/seed-contenu.mjs --num 253 --modules ses-tle                          > supabase/253_contenu_ses_tle.sql
node scripts/seed-contenu.mjs --num 254 --modules nsi-tle                          > supabase/254_contenu_nsi_tle.sql
node scripts/seed-contenu.mjs --num 255 --modules maths-tle,maths-expertes-tle,maths-complementaires-tle > supabase/255_contenu_maths_tle.sql
node scripts/seed-contenu.mjs --num 267 --modules espagnol-1re                     > supabase/267_contenu_espagnol_1re_programme.sql
node scripts/seed-contenu.mjs --num 268 --modules ses-1re                          > supabase/268_contenu_ses_1re_programme.sql
node scripts/seed-contenu.mjs --num 269 --modules svt-1re                          > supabase/269_contenu_svt_1re_programme.sql
node scripts/seed-contenu.mjs --num 270 --modules physique-chimie-1re              > supabase/270_contenu_physique_chimie_1re.sql
node scripts/seed-contenu.mjs --num 271 --modules maths-1re                        > supabase/271_contenu_maths_1re.sql
node scripts/seed-contenu.mjs --num 272 --modules si-1re                           > supabase/272_contenu_si_1re.sql
node scripts/seed-contenu.mjs --num 273 --modules nsi-1re                          > supabase/273_contenu_nsi_1re.sql
node scripts/seed-contenu.mjs --num 274 --modules hlp-1re                          > supabase/274_contenu_hlp_1re.sql
node scripts/seed-contenu.mjs --num 275 --modules hggsp-1re                        > supabase/275_contenu_hggsp_1re.sql
node scripts/seed-contenu.mjs --num 276 --modules allemand-1re                     > supabase/276_contenu_allemand_1re.sql
node scripts/seed-contenu.mjs --num 277 --modules emc-1re                          > supabase/277_contenu_emc_1re.sql
node scripts/seed-contenu.mjs --num 279 --modules histoire-geo-2de                 > supabase/279_contenu_histoire_geo_2de.sql
node scripts/seed-contenu.mjs --num 280 --modules ses-2de                          > supabase/280_contenu_ses_2de.sql
node scripts/seed-contenu.mjs --num 281 --modules snt-2de                          > supabase/281_contenu_snt_2de.sql
node scripts/seed-contenu.mjs --num 282 --modules maths-2de                        > supabase/282_contenu_maths_2de.sql
node scripts/seed-contenu.mjs --num 283 --modules francais-2de                     > supabase/283_contenu_francais_2de.sql
node scripts/seed-contenu.mjs --num 284 --modules emc-2de                          > supabase/284_contenu_emc_2de.sql
node scripts/seed-contenu.mjs --num 285 --modules svt-2de                          > supabase/285_contenu_svt_2de.sql
node scripts/seed-contenu.mjs --num 286 --modules anglais-2de                      > supabase/286_contenu_anglais_2de.sql
node scripts/seed-contenu.mjs --num 287 --modules espagnol-2de                     > supabase/287_contenu_espagnol_2de.sql
node scripts/seed-contenu.mjs --num 288 --modules allemand-2de                     > supabase/288_contenu_allemand_2de.sql
node scripts/seed-contenu.mjs --num 289 --modules physique-chimie-2de              > supabase/289_contenu_physique_chimie_2de.sql
node scripts/seed-contenu.mjs --num 290 --modules francais-3e                      > supabase/290_contenu_francais_3e.sql
node scripts/seed-contenu.mjs --num 291 --modules histoire-3e                      > supabase/291_contenu_histoire_3e.sql
node scripts/seed-contenu.mjs --num 292 --modules svt-3e                           > supabase/292_contenu_svt_3e.sql
node scripts/seed-contenu.mjs --num 293 --modules geographie-3e                    > supabase/293_contenu_geographie_3e.sql
node scripts/seed-contenu.mjs --num 294 --modules maths-3e                         > supabase/294_contenu_maths_3e.sql
node scripts/seed-contenu.mjs --num 295 --modules physique-chimie-3e               > supabase/295_contenu_physique_chimie_3e.sql
node scripts/seed-contenu.mjs --num 296 --modules technologie-3e                   > supabase/296_contenu_technologie_3e.sql
node scripts/seed-contenu.mjs --num 297 --modules espagnol-3e                      > supabase/297_contenu_espagnol_3e.sql
node scripts/seed-contenu.mjs --num 298 --modules anglais-3e                       > supabase/298_contenu_anglais_3e.sql
node scripts/seed-contenu.mjs --num 299 --modules allemand-3e                      > supabase/299_contenu_allemand_3e.sql
node scripts/seed-contenu.mjs --num 300 --modules francais-4e                      > supabase/300_contenu_francais_4e.sql
node scripts/seed-contenu.mjs --num 301 --modules maths-4e                         > supabase/301_contenu_maths_4e.sql
node scripts/seed-contenu.mjs --num 302 --modules physique-chimie-4e               > supabase/302_contenu_physique_chimie_4e.sql
node scripts/seed-contenu.mjs --num 303 --modules svt-4e                           > supabase/303_contenu_svt_4e.sql
node scripts/seed-contenu.mjs --num 304 --modules anglais-4e                       > supabase/304_contenu_anglais_4e.sql
node scripts/seed-contenu.mjs --num 305 --modules espagnol-4e                      > supabase/305_contenu_espagnol_4e.sql
node scripts/seed-contenu.mjs --num 306 --modules histoire-geo-5e                  > supabase/306_contenu_histoire_geo_5e.sql
node scripts/seed-contenu.mjs --num 307 --modules francais-5e                      > supabase/307_contenu_francais_5e.sql
node scripts/seed-contenu.mjs --num 308 --modules maths-5e                         > supabase/308_contenu_maths_5e.sql
node scripts/seed-contenu.mjs --num 309 --modules physique-chimie-5e               > supabase/309_contenu_physique_chimie_5e.sql
node scripts/seed-contenu.mjs --num 310 --modules svt-5e                           > supabase/310_contenu_svt_5e.sql
node scripts/seed-contenu.mjs --num 311 --modules anglais-5e                       > supabase/311_contenu_anglais_5e.sql
node scripts/seed-contenu.mjs --num 312 --modules espagnol-5e                      > supabase/312_contenu_espagnol_5e.sql
```

## Les campagnes de Cinquième (306 → 312) et de Quatrième (300 → 305)

Le collège rejoint le lycée : après la 3e, la **4e** et la **5e** reçoivent leur
programme complet. Treize migrations, et une bascule de méthode.

| Niveau | Migration | Matière | Chapitres → fiches |
|---|---|---|---|
| 4e | **300** | Français | 5 génériques → **5 chapitres, 18 fiches** |
| 4e | **301** | Maths | 5 génériques → **5 chapitres, 36 fiches** |
| 4e | **302** | Physique-chimie | 4 génériques → **7 chapitres, 31 fiches** (IMPORTÉES) |
| 4e | **303** | SVT | 4 génériques → **14 chapitres, 31 fiches** (IMPORTÉES) |
| 4e | **304** | Anglais | 5 génériques → **4 chapitres, 41 fiches** (IMPORTÉES) |
| 4e | **305** | Espagnol | 4 génériques → **4 chapitres, 34 fiches** (IMPORTÉES) |
| 5e | **306** | Histoire-géo | 5 génériques → **6 chapitres, 21 fiches, 2 ONGLETS** |
| 5e | **307** | Français | 5 génériques → **5 chapitres, 13 fiches** |
| 5e | **308** | Maths | 5 génériques → **4 chapitres, 26 fiches** |
| 5e | **309** | Physique-chimie | 4 génériques → **31 fiches** (IMPORTÉES) |
| 5e | **310** | SVT | 5 génériques → **31 fiches** (IMPORTÉES) |
| 5e | **311** | Anglais | 5 génériques → **41 fiches** (IMPORTÉES) |
| 5e | **312** | Espagnol | 4 génériques → **34 fiches** (IMPORTÉES) |

**L'IMPORT S'ÉTEND AUX MATIÈRES SCIENTIFIQUES, et c'est le BO qui le justifie.**
Jusqu'ici, seules les langues vivantes s'importaient d'un niveau à l'autre. Mais
le BO écrit la **physique-chimie** et les **SVT** pour le **cycle 4 tout entier**
(5e, 4e, 3e) : les mêmes thèmes s'y approfondissent d'année en année sans changer
de découpage, et la maquette de référence affiche les MÊMES 31 fiches aux trois
niveaux. Les modules de 4e et de 5e importent donc ceux de 3e — une correction
faite une fois vaut désormais pour trois niveaux.

Restent **écrits**, parce que leurs programmes diffèrent réellement d'un niveau à
l'autre : le français, les maths et l'histoire-géo.

**LA 5e OUVRE SES DEUX ONGLETS D'UN SEUL COUP.** Contrairement à la 3e, où
l'histoire (291) et la géographie (293) sont arrivées en deux temps, les deux
maquettes de 5e ont été relevées ensemble : `histoire-geo-5e.mjs` porte **deux
blocs** et **deux rayons** (13 fiches d'histoire en positions 1 → 13, 8 de
géographie en 14 → 21). Le dossier s'ouvre sur « Histoire » et « Géographie » dès
l'exécution de la 306.

⚠️ **TROIS COLLISIONS DE TITRES, toutes traitées par `theme IS NULL`.** Un titre
hérité de la 008 est parfois EXACTEMENT celui d'une fiche du programme neuf, et
`chapters` porte `UNIQUE(subject_id, level, title)` :
- **anglais 4e** : « Le present perfect » et « Exprimer le futur » ;
- **physique-chimie 5e** : « Les états de la matière » ;
- **histoire-géo 5e** : « La croissance démographique et ses effets ».

Dans ces trois cas le ménage n'est pas seulement souhaitable, il est
**obligatoire** — sans lui l'INSERT tombe dans le ON CONFLICT DO NOTHING et la
leçon échoue sur une clé étrangère absente. Et c'est le repère **`theme IS NULL`**
qui rend le REJEU sûr : borné au titre, le ménage supprimerait au second passage
la fiche NEUVE qui porte le même titre. Toutes les migrations de 4e et de 5e
emploient donc ce repère, borné à leur seul niveau.

## La campagne de Troisième (290 → 299)

Dix migrations écrites d'après les captures de la maquette de référence, qui
rendent à la 3e le programme de ses matières. Le collège n'avait jusqu'ici que
les QUATRE OU CINQ chapitres par matière du tout premier jeu de données
(migration 008) :

| Matière | Module | Migration | Chapitres → fiches |
|---|---|---|---|
| Français | `francais-3e.mjs` | **290** | 5 génériques → **6 chapitres, 18 fiches** |
| Histoire | `histoire-3e.mjs` | **291** | 4 fiches d'histoire → **3 chapitres, 14 fiches** |
| SVT | `svt-3e.mjs` | **292** | 5 génériques → **14 chapitres, 31 fiches** |
| Géographie | `geographie-3e.mjs` | **293** | 1 fiche héritée → **3 chapitres, 12 fiches** |
| Maths | `maths-3e.mjs` | **294** | 5 génériques → **3 chapitres, 14 fiches** |
| Physique-chimie | `physique-chimie-3e.mjs` | **295** | 4 génériques → **7 chapitres, 31 fiches** |
| Technologie | `technologie-3e.mjs` | **296** | 4 génériques → **8 chapitres, 23 fiches** |
| Espagnol | `espagnol-3e.mjs` | **297** | 4 génériques → **4 chapitres, 34 fiches** (IMPORTÉES) |
| Anglais | `anglais-3e.mjs` | **298** | 5 génériques → **4 chapitres, 41 fiches** |
| Allemand | `allemand-3e.mjs` | **299** | 6 fiches du bloc collège → **5 chapitres, 36 fiches** (IMPORTÉES) |

**Deux familles, et la frontière n'est pas celle de la 2de.** Huit modules sont
**écrits** — un programme de collège n'a pas d'équivalent au lycée. Mais
l'espagnol (297) et l'allemand (299) sont **importés** de la Terminale, parce que
la maquette de 3e y reprend, **titre pour titre**, les 4 et 5 chapitres du
programme de langue du lycée : la grammaire ne change pas d'un niveau à l'autre,
seuls le lexique et les attentes de production évoluent. Une correction de règle
faite une fois vaut désormais pour la 3e, la 2de, la 1re et la Terminale.

⚠️ **L'anglais fait exception parmi les langues, et c'est délibéré.**
`anglais-tle.mjs` tient le programme en 24 fiches FUSIONNÉES (un seul « Les
auxiliaires modaux », un seul « Le comparatif et le superlatif ») là où la
maquette de 3e en demande **41**, dépliées une notion à la fois — sept fiches
pour la seule modalité. Importer les 24 aurait donné un dossier qui ne ressemble
pas à la maquette et qui oblige un élève de collège à chercher « donner un
conseil » au milieu d'une fiche traitant aussi de la probabilité. Conséquence
assumée : une même règle existe à deux endroits, et une correction devra être
portée aux deux modules.

**Le ménage, deux repères selon la matière** : par **TITRE exact** quand les
anciens titres viennent de la 008 sans apostrophe ni accent douteux (histoire,
SVT, français, maths, physique-chimie, technologie) ; par **`theme IS NULL`**
pour les trois langues et pour la géographie, dont les titres portent apostrophes
ou accents et dont un DELETE mal orthographié ne trouverait rien EN SILENCE.
Dans tous les cas, **borné au seul niveau `3e`**.

**La 293 dédouble l'onglet du dossier d'histoire-géo.** Les 14 fiches
d'histoire de la 291 portaient déjà `rayon: 'histoire'`, posé d'avance ; les 12
fiches de géographie portent `rayon: 'geographie'`. `disciplinesOf`
(lib/subject-template) n'ouvre des onglets qu'à partir de DEUX rayons : la 3e
passe donc d'un onglet « Programme » à deux onglets « Histoire » et
« Géographie », comme la 2de, la 1re et la Tle — sans toucher au code ni
reprendre la 291.

⚠️ **Le piège du titre identique, dans la 293.** La première fiche de la
maquette s'appelle « Les aires urbaines en France » — le titre EXACT de la fiche
héritée de la 008 qu'elle remplace, et `chapters` porte
`UNIQUE(subject_id, level, title)`. Le ménage est donc obligatoire, et **borné
par `theme IS NULL` en plus du titre** : sans cette seconde borne, un REJEU
supprimerait la fiche neuve et ses quiz, qui portent le même titre. L'ancienne
est d'avant la colonne `theme` et n'en porte aucun ; les neuves en portent un dès
l'INSERT. L'`UPDATE position = 99` de la 291, qui protégeait cette fiche héritée,
devient sans objet — et reste inoffensif.

Restent à écrire pour finir la 3e : **latin** et **EMC** — les deux dernières
matières du niveau encore sur leurs chapitres de 2016.

## La campagne de Seconde (279 → 289)

Onze migrations, écrites d'après les captures de la maquette de référence, qui
rendent à la 2de le programme de chacune de ses matières. Deux familles :

- **écrites** — histoire-géo (279), SES (280), SNT (281), maths (282), français
  (283), EMC (284), SVT (285), physique-chimie (289) ;
- **importées** — anglais (286), espagnol (287), allemand (288) reprennent
  TELLES QUELLES les fiches du module de Terminale et les republient au niveau
  2de, exactement comme les 266, 267 et 276 l'ont fait pour la Première : les
  programmes de LV sont écrits pour le CYCLE TERMINAL, la grammaire y est la
  même, et une correction faite une fois vaut désormais pour les trois niveaux.

Tous ces modules passent par `--modules` : leurs slugs portent chacun plusieurs
fichiers, et `--slugs` réécrirait des migrations déjà exécutées.

Les deux repères de ménage, selon ce qu'on retire :

- **par TITRE exact** quand les anciennes fiches sont peu nombreuses et connues
  (008 ou une migration de contenu) — français, SVT, physique-chimie, SES,
  maths, histoire-géo ;
- **par `theme IS NULL`** quand un titre porte une apostrophe et qu'on ne peut
  pas garantir laquelle la base contient (droite dans le contenu ancien,
  typographique dans le récent) : un DELETE par titre ne trouverait alors rien
  EN SILENCE. C'est le choix de l'EMC (284), de l'anglais (286), de l'espagnol
  (287) et de l'allemand (288). Le critère vise exactement les fiches d'avant la
  colonne `theme` : les fiches neuves en portent une dès l'INSERT, et le ménage
  tourne AVANT les insertions.

Dans les deux cas, le ménage est **borné au seul niveau `2de`** : sans cette
borne il mordrait sur le collège ou sur les autres niveaux du lycée, qu'aucun
programme ne vient remplacer ici.

Un slug = un ou PLUSIEURS modules : `scripts/contenu/anglais-tle.mjs` porte le
slug `anglais`, le nom du fichier ne dit que le périmètre couvert.

## `--slugs` ou `--modules` ?

`--slugs` filtre par MATIÈRE, `--modules` par FICHIER (sans le `.mjs`). Le
second est nécessaire dès qu'une matière est écrite en plusieurs modules qui
doivent partir dans des migrations SÉPARÉES :

- `histoire-geo-tle.mjs` (227, **exécutée**), `geographie-tle.mjs` (229),
  `histoire-geo-1re.mjs` (245) et `histoire-tle-1-6.mjs` (246) portent tous
  quatre le slug `histoire-geo` ;
- `emc.mjs` (216, **exécutée**), `emc-tle.mjs` (230) et `emc-1re.mjs` (277)
  portent tous **trois** `emc` — le dernier installe le programme de Première du
  BO du 13 juin 2024 et retire les 3 fiches du socle lycée au seul niveau 1re ;
- `espagnol-lycee.mjs` (220, **exécutée**), `espagnol-tle.mjs` (231) et
  `espagnol-1re.mjs` (267) portent tous **trois** `espagnol` — ce dernier
  IMPORTE les 34 fiches du deuxième et les republie sur le niveau 1re ;
- `hlp.mjs` (219, **exécutée**), `hlp-tle.mjs` (232) et `hlp-1re.mjs` (274)
  portent tous **trois** `hlp` ;
- `allemand.mjs` (218, **exécutée**), `allemand-tle.mjs` (249) et
  `allemand-1re.mjs` (276) portent tous **trois** `allemand` — la 218 couvre le
  collège et le lycée d'un bloc, la 249 rend la Terminale à son programme de
  langue, et la 276 IMPORTE ces 36 fiches pour les republier en Première ;
- `anglais` porte désormais **six** modules (`anglais-tle` = 226, `-1re` = 266,
  `-2de` = 286, `-3e` = 298, `-4e` = 304, `-5e` = 311). Les trois premiers republient les 24 fiches de la Terminale sur
  un autre niveau ; le quatrième est ÉCRIT, la maquette de 3e demandant 41 fiches
  plus fines (voir la campagne de Troisième). La 235 (`anglais-axes-tle.mjs`, les
  six axes du programme) a été ABANDONNÉE le 19/08/2026 et retirée du dépôt ;
  elle reste récupérable dans l'historique git.

`maths-complementaires.mjs` (219, **exécutée**) et `maths-complementaires-tle.mjs`
(255) portent tous deux le slug `maths-complementaires` — la 219 pose 4 fiches
de synthèse, la 255 le programme officiel en 11 fiches. Même configuration que
le couple allemand.

`maths-expertes-tle.mjs` (255) est aujourd'hui le seul module de son slug — les
autres niveaux viennent encore des migrations écrites à la main, qui ne doivent
plus être régénérées. Il passe par `--modules` malgré tout, pour que la commande
d'en-tête reste juste le jour où un second module apparaîtra.

`nsi-tle.mjs` (254) et `nsi-1re.mjs` (273) portent tous deux le slug `nsi`,
`hggsp-tle.mjs` (256) et `hggsp-1re.mjs` (275) le slug `hggsp`. Dans les deux
cas, `--slugs` réécrirait une migration déjà générée.

`maths` porte désormais **cinq** modules (`maths-tle` = 255, `maths-1re` = 271,
`maths-3e` = 294, `maths-4e` = 301, `maths-5e` = 308) ; `physique-chimie` en
porte **six** (252, 270, 289, 295, 302, 309) ; `si.mjs` (219, **exécutée**) et
`si-1re.mjs` (272) partagent le slug `si`. Dans les trois cas, `--slugs`
réécrirait une migration déjà exécutée.

`ses-tle.mjs` (253) et `ses-1re.mjs` (268) portent tous deux le slug `ses` — le
second est le premier module de SES écrit pour un autre niveau que la Terminale.
`--slugs ses` les fusionnerait et RÉÉCRIRAIT la 253.

⚠️ LA 255 EST GÉNÉRÉE À PARTIR DE TROIS MODULES, sur trois matières distinctes
(`maths`, `maths-expertes`, `maths-complementaires`). C'est voulu : la maquette
de référence range les 8 chapitres sous un seul dossier « Maths Tle », alors que
l'app sépare la spécialité et ses deux options depuis l'origine — un dossier de
matière ne montre QUE son programme. Une seule migration à coller, trois dossiers
à l'arrivée.

La physique-chimie des trois autres niveaux (5e, 4e, et les fiches communes)
vient encore des migrations écrites à la main (037 → 143), qui ne doivent plus
être régénérées : seuls la 3e (295), la 2de (289), la 1re (270) et la Tle (252)
ont un module.

`technologie.mjs` (216, **exécutée**, qui couvre la 5e et la 4e) et
`technologie-3e.mjs` (296) portent tous deux le slug `technologie` : `--slugs
technologie` réécrirait la 216. La technologie n'existe qu'au collège, sur trois
niveaux — la 3e est le premier à recevoir son programme complet.

`espagnol` porte désormais **sept** modules (220, 231, 267, 287, 297, 305, 312)
et `allemand` **cinq** (218, 249, 276, 288, 299). Tous les modules postérieurs à
celui de Terminale IMPORTENT ses fiches et les republient sur leur niveau —
`espagnol-4e` et `espagnol-5e` passent par `espagnol-3e.mjs`, qui porte déjà la
table des chapitres de programme. `--slugs` y fusionnerait six migrations.

`svt` porte désormais **six** modules (`svt-tle` = 233, `svt-1re` = 269,
`svt-2de` = 285, `svt-3e` = 292, `svt-4e` = 303, `svt-5e` = 310) — les trois
derniers du collège partagent les mêmes 31 fiches, le BO écrivant les SVT pour le
cycle 4 entier. La SVT des autres niveaux vient encore des migrations écrites à
la main (094 → 142), qui ne doivent plus être régénérées. `--slugs svt` les
fusionnerait et RÉÉCRIRAIT la 233 : toujours `--modules`.

`histoire-geo` porte désormais **huit** modules, dont `histoire-3e` (291),
`geographie-3e` (293) et `histoire-geo-5e` (306). Les deux premiers sont les SIXIÈME et
SEPTIÈME modules du slug, et les premiers écrits pour le collège.
Ils se partagent le dossier par le rayon (`histoire` / `geographie`), qui en fait
deux onglets : l'histoire numérote ses fiches de 1 à 14, la géographie prend les
positions 15 à 26 (voir la campagne de Troisième plus haut). `--slugs
histoire-geo` fusionnerait les sept et réécrirait six migrations.

`francais` porte désormais **dix** modules : les cinq modules de fiches de lecture
(261 → 265), `francais-1re` (259), `francais-2de` (283), `francais-3e` (290),
`francais-4e` (300) et `francais-5e` (307). `--slugs francais` les réécrirait
tous.

`--slugs histoire-geo` les fusionnerait dans un seul fichier SQL et RÉÉCRIRAIT
une migration déjà exécutée — ce que le projet interdit. D'où le passage de 216
et 227 à `--modules` : leur contenu est inchangé (vérifié à l'octet près), seule
la commande de régénération l'est.

L'en-tête généré imprime désormais **la commande qui a servi** (`--modules …`
quand c'est par fichier qu'on a filtré) et non une reconstruction par slug :
recopier l'ancienne ligne d'en-tête d'une migration écrite en plusieurs modules
aurait justement produit la fusion qu'on veut éviter.

Ou en une commande : `npm run contenu`. Elle ne rejoue QUE les migrations qui se
regénèrent à l'octet près — c'est son seul intérêt : un filet qui prouve que le
dépôt et les modules disent la même chose.

⚠️ **218 et 228 en sont sorties le 21/08/2026.** Leur en-tête imprime
`--slugs allemand,grec` et `--slugs enseignement-scientifique`, et ces deux slugs
portent désormais PLUSIEURS modules chacun (`allemand.mjs` + `allemand-tle.mjs`
+ `allemand-1re.mjs`,
`enseignement-scientifique-tle.mjs` + `enseignement-scientifique-1re.mjs`) : la
commande de leur propre en-tête produirait aujourd'hui un fichier FUSIONNÉ, à la
place d'une migration déjà exécutée. Les regénérer par `--modules` donnerait le
bon contenu mais changerait leur ligne d'en-tête, donc modifierait une migration
exécutée. Aucune des deux issues n'étant acceptable, elles sortent du filet.
`--num 226 --slugs anglais` avait le même défaut depuis la 266 et a été corrigé
en `--modules anglais-tle` (vérifié identique à l'octet près).

## ⚠️ Ne jamais écrire un extrait SQL exécutable dans un cours

Retour d'expérience du 20/08/2026, sur la 254 (NSI). La migration a échoué dans
l'éditeur SQL de Supabase sur « 42P01 : la relation *eleve* n'existe pas », alors
que le fichier était **irréprochable** — 12 instructions, zéro `eleve` hors
chaîne, aucun `--`, `/*` ni `$$` dans le contenu.

Le contenu des cours voyage dans des littéraux `E'…'`. Il suffit qu'un maillon de
la chaîne (l'éditeur, le presse-papiers, un formateur) rompe ce littéral pour que
le texte du cours reparte à l'exécution. Selon ce que le cours contient, le
symptôme change du tout au tout :

- un cours de **prose** produit une erreur de syntaxe, qu'on rattache vite à sa
  cause ;
- un cours de **NSI** qui cite `SELECT nom FROM eleve …;` produit une requête
  **syntaxiquement valide**, donc une erreur qui parle d'une table fantôme et
  n'oriente vers rien.

**Règle** : un extrait SQL dans un cours s'écrit **mot-clé par mot-clé en gras**
et **sans point-virgule** — `**SELECT** nom **FROM** eleve **WHERE** …`. L'élève
lit la même requête, aucune ligne du contenu ne commence par un mot-clé nu, et
une rupture ne peut plus produire qu'une erreur de syntaxe, qui au moins désigne
le bon endroit.

Avant de douter d'un fichier, le passer au lexeur, qui applique les règles de
Postgres (`E'…'`, `''`, dollar-quoting, commentaires) :

```powershell
node _ASSOCIE/verifie-chaines.mjs supabase/254_contenu_nsi_tle.sql eleve
```

Bonne nouvelle au passage : l'éditeur Supabase joue le script dans une
**transaction**. Un collage raté n'applique rien — une matière n'est jamais
laissée à moitié vidée.

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
    axe: 'Thème 2 — …',            // FACULTATIF : l'axe du programme (voir plus bas)
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

### L'axe du programme (`axe`)

`axe` porte l'intitulé du programme officiel qui coiffe le chapitre — « Axe 6.
Le Royaume-Uni et ses nations », « Thème 3 — Histoire et mémoires ». Il atterrit
dans `chapters.theme` (migration 234) et c'est lui qui fait GROUPER la page
matière au lieu d'aligner les chapitres à plat. Se déclare sur le bloc (tous ses
chapitres le prennent) ou sur un chapitre (il gagne sur celui du bloc) :

```js
blocs: [{ niveaux: ['Tle'], axe: 'Repères culturels — les six axes', chapitres: [
  { titre: '…', axe: 'Un autre axe', … },   // ce chapitre-ci déroge
]}]
```

Deux garde-fous à connaître :

- **La colonne n'est écrite que si au moins un chapitre déclare un axe.** Sans
  cette condition, régénérer 216 → 233 (qui n'en portent aucun) produirait un
  SQL différent de celui du dépôt, et la commande imprimée dans leur en-tête ne
  les reproduirait plus à l'octet près.
- **Un `UPDATE` accompagne l'`INSERT`.** Les chapitres sont insérés en
  `ON CONFLICT DO NOTHING` : sur un chapitre DÉJÀ en base, l'insertion ne
  toucherait rien et l'axe ne serait jamais posé. L'`UPDATE` qui suit vise les
  mêmes UUID dérivés du contenu, donc stables et rejouables.

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
