# La matière Sport, refaite en « culture sportive » (14/10/2026)

*Lucas, 14/10/2026 : « la matière sport est très pauvre et peu intéressante, analyse vraiment la pertinence, il faut peut-être s'écarter du programme pour la rendre plus intéressante » — puis : « oui on va s'écarter, on doit apporter l'histoire du sport notamment de la France, les fondamentaux du sport (hypertrophie, force, endurance, récupération, anti-blessure) […] on refait donc tout le sport en entier (cours, fiches, exercices, banque de données des questions de Coach Turbo) ».*

## 1. Le diagnostic (mesuré le 14/10/2026)

| Niveau | Fiches | Ce qu'il y avait |
|---|---|---|
| 6e → 3e | 8, identiques les quatre années | les « champs d'apprentissage », l'échauffement, l'effort, l'hygiène de vie, les rôles, les règles, la sécurité (`scripts/contenu/sport-college.mjs`, migration 339) |
| 2de | 3 | s'entraîner, alimentation, sport et société (`sport.mjs`, 216) |
| 1re générale | 0 | retirée en 278 : « on ne révise pas l'EPS » (la 1re techno gardait les trois de 2de) |
| Tle | 13 | CA1 → CA5, AFL, bac d'EPS (`sport-tle.mjs`, 387) |

Huit QCM par fiche, fiches PDF et contrôles présents, aucun jeu de salon. **Le problème n'est pas la quantité** : c'est écrit dans la langue de l'institution (champs d'apprentissage, AFL1/2/3, CCF), un 3e relit mot pour mot ce qu'il a lu en 6e, il n'y a rien à réviser pour un écrit (l'EPS ne s'évalue qu'en pratique), la physiologie doublonne la SVT, et la forme est sèche (tableaux, définitions, pas une histoire, pas un record, pas un nom).

## 2. La décision

**Sport devient une CULTURE SPORTIVE**, comme l'encyclopédie l'a fait pour l'histoire : ce dont les élèves parlent entre eux, écrit pour être retenu, raconté, cité — et taillé pour le quiz, le duel et Coach Turbo. Quatre familles de contenu, présentes à chaque niveau dans des proportions différentes :

1. **Les règles des grands sports, enfin claires** (hors-jeu, marcher, en-avant, tie-break, VAR…).
2. **Les fondamentaux de l'entraînement** (force, vitesse, endurance, hypertrophie, récupération, prévention des blessures, nutrition sans mythes) — la demande explicite de Lucas, et le lien avec la couche coaching (`docs/CADRAGE-COACHING.md`).
3. **L'histoire du sport, et d'abord en France** (Coubertin, le Tour, les Bleus, Paris 1900 · 1924 · 2024, Alice Milliat, Festina) et les légendes (Bolt, Riner, Marchand, Zidane, Pérec…).
4. **Le corps qui étonne** (transpirer, le point de côté, la crampe, VO2max, le mental).

**Ce qu'on garde du programme officiel** : la physiologie de l'effort (absorbée dans les familles 2 et 4) et, en Tle, **« Le bac d'EPS : épreuves, AFL et barème »**, la seule fiche réellement utile à un écrit, reprise telle quelle. **La 1re est rouverte** (`subjects.levels` reçoit `1re`).

**Tout est refait** : cours, quiz (la banque de Coach Turbo : `drawSubjectSession` pioche dans `quiz_questions` de la matière), cahier d'exercices, contrôles blancs, fiches PDF. Les anciens chapitres sont SUPPRIMÉS niveau par niveau par le ménage de chaque migration (cascade sur leçons, quiz, questions, exercices, contrôles, déblocages).

## 3. Le programme : 40 fiches, 4 blocs, 10 par bloc

Un bloc = un module `scripts/contenu/sport-<bloc>.mjs` = une migration. Les titres sont les titres de chapitre (clé de l'identifiant : `sport|<niveau>|<titre>`), les axes sont les thèmes du dossier (`chapters.theme`).

### 6e · 5e — « Découvrir » (`sport-6e-5e.mjs`)

| Axe | Fiches |
|---|---|
| Les règles des grands sports | Football : le hors-jeu, enfin clair · Basket : marcher, 24 secondes, 3 points · Handball et volley : les règles qui comptent · Rugby : l'en-avant, l'essai, la mêlée · Tennis et badminton : jeu, set, tie-break |
| Le corps qui étonne | Pourquoi on transpire et pourquoi on a chaud · Le cœur, le souffle et le point de côté · Crampe, courbature, ampoule : que faire ? |
| Les légendes | Les Jeux olympiques, d'Olympie à Paris 2024 · Dix champions français à connaître |

### 4e · 3e — « Comprendre » (`sport-4e-3e.mjs`)

| Axe | Fiches |
|---|---|
| Les fondamentaux de l'entraînement | Force, vitesse, endurance : les trois moteurs · L'hypertrophie : comment un muscle grossit · L'endurance : VMA, VO2max et allures · La récupération : sommeil, repos, surcompensation · Éviter la blessure : échauffement, gainage, étirements |
| Histoire du sport en France | Coubertin et la naissance du sport moderne · Le Tour de France, de 1903 à aujourd'hui · Les Bleus : 1998, 2018 et le football français · Paris olympique : 1900, 1924, 2024 |
| Arbitrer et jouer juste | L'arbitre, la VAR et le fair-play |

### 2de · 1re — « S'entraîner » (`sport-2de-1re.mjs`)

| Axe | Fiches |
|---|---|
| La science de l'effort | Les filières énergétiques : 10 secondes, 2 minutes, 1 heure · Construire son programme : volume, intensité, progressivité · Musculation : hypertrophie, force, puissance · Nutrition du sportif : le vrai et le faux · Blessures du sportif : entorse, tendinite, claquage, commotion |
| Le sport, une histoire | Le sport moderne, une invention anglaise adoptée par la France · Le sport et la politique : 1936, 1968, 1980, 2024 · Les femmes dans le sport : d'Alice Milliat à la parité · Le sport business : droits TV, sponsors, salaires · Le dopage : de Festina à l'AMA |

### Tle — « Performer » (`sport-tle.mjs`, réécrit)

| Axe | Fiches |
|---|---|
| Performer | Planifier une saison : périodisation et pic de forme · Mesurer et analyser : fréquence cardiaque, VMA, tests et carnet · Le mental : stress, concentration, routines · Surentraînement et récupération |
| Le sport dans la société | Sport et santé publique : sédentarité et sport sur ordonnance · Le sport comme fait social · L'olympisme : valeurs, Paris 2024 et l'héritage · Les métiers du sport et la filière STAPS |
| L'évaluation au baccalauréat | Le bac d'EPS : épreuves, AFL et barème (gardée) · L'option EPS et la spécialité EPPCS |

## 4. Le ton (règles, pas goûts)

- **On raconte, on ne cadre pas.** Un cours s'ouvre sur une scène, un chiffre, un nom (« 9 s 58 : depuis 2009, personne n'a couru plus vite »), jamais sur une définition institutionnelle. Les mots du programme (AFL, CCF, champ d'apprentissage) n'apparaissent qu'en Tle, dans la fiche du bac.
- **Chaque fait est vérifié** (date, record, règle, chiffre physiologique) : un record se donne avec son année et son lieu ; une règle se donne telle qu'elle est en vigueur en 2026 ; une fourchette physiologique (8 à 12 répétitions, 48 h de repos) est celle des recommandations courantes, pas un chiffre inventé pour faire précis.
- **Le corps d'un adolescent n'est pas celui d'un adulte** : toute fiche de fondamentaux dit ce qui change à 12, 14, 17 ans (technique avant charge, pas de charge maximale avant la fin de la croissance, sommeil 8-10 h).
- **Pas de mythe, pas de produit** : protéines en poudre, boissons énergisantes, régimes, anabolisants — la fiche dit ce qui est vrai, ce qui est faux, et ce qui est interdit et pourquoi.
- **Une question de quiz se suffit à elle-même** (jamais « cette fiche », « l'exemple ci-dessus ») et **son explication redit la méthode ou la raison**, pas seulement la réponse. 10 à 12 questions par fiche : c'est la banque de Coach Turbo.
- **Même recette que le reste du catalogue** : cours en sections `##` (carte mentale dérivable), tableaux, un `>` pour la phrase à retenir, un `!>` pour l'alerte ; cahier selon `docs/exercices-manuel.md` (★ lire un document, ★★ appliquer, ★★★ croiser) ; contrôles à trois niveaux ; fiche PDF selon `docs/fiches-revision.md`, palier P3 (Marcel et sa bulle, prompt d'illustration écrit).

## 5. La chaîne de production

1. **Modèle avant série** : la fiche « L'hypertrophie : comment un muscle grossit » (4e-3e) écrite entière — cours, 12 questions, 3 exercices du cahier, 3 contrôles, fiche PDF rendue — et montrée à Lucas.
2. **Cours + quiz** : un module par bloc, `node scripts/seed-contenu.mjs --num NNN --modules sport-<bloc>` → `supabase/contenu/NNN_sport_<bloc>.sql` (< 300 Ko chacun). Le ménage de chaque module supprime les chapitres de Sport de SES niveaux dont l'identifiant n'est pas dans le bloc (idempotent : un rejeu ne touche pas aux nouveaux). Le module 2de-1re rouvre la 1re.
3. **Cahier** : `contenu/exercices/<niveau>/sport.culture.json` (jumelles copiées pour le second niveau du bloc), `scripts/exercices-sql.ts --niveau <niveau> --fichiers sport.culture` → une migration par niveau.
4. **Contrôles** : `contenu/controles/<niveau>/sport.culture.json`, `scripts/controles-sql.ts` → une migration par niveau.
5. **Fiches PDF** : `contenu/fiches/<niveau>/sport.json` RÉÉCRIT (les anciennes entrées partent avec leurs JSON), `fiches-rendre.mjs <niveau> sport <slug>`, `fiches-registre.mjs`, `fiches-deposer.mjs <niveau> sport`.
6. **Inscription** : `lib/sante.ts`, `_ASSOCIE/sonde-base.mjs`, `supabase/README.md` ; tests (`lib/exercices/contenu.test.ts`, `lib/fiches/contenu.test.ts`, `lib/subject-catalogue.test.ts` : l'exception « pas de sport en 1re » saute).
7. **Exécution par Lucas** (ou par l'API de gestion avec son jeton), dans l'ordre des numéros ; les PDF orphelins des anciens chapitres restent dans le bucket, sans porte.

## 6. État au 14/10/2026

**Fait** : les 40 fiches (cours + 823 questions), 210 exercices du cahier, 210 contrôles, 70 fiches PDF rendues (5e, 3e, 1re jumelles de 6e, 4e, 2de), migrations 565 → 575 générées, rejouées deux fois sur PGlite et inscrites. **Exécuté le 14/10/2026** : les 565 → 575 sont passées en production (API de gestion : essai annulé, passage, rejeu, mesure conforme) et les 70 PDF sont déposés dans Storage. Reste à commiter et déployer le code (registre des fiches, index, modules, tests) pour que l'app serve les nouvelles fiches. Le libellé de la pilule des fiches est passé à « Sport ».

## 7. Ce qui reste ouvert

- Un **jeu de salon** pour Sport (« La bonne règle », « Record ou pas ») : le catalogue des jeux est figé à 12 sans décision de Lucas (« trop de modes de jeu »).
- Les **illustrations** des fiches PDF (palier P3 : Marcel en attendant).
