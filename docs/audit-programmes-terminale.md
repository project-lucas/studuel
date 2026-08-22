# Audit des programmes de Terminale — 7 août 2026

**Méthode.** L'état de l'app n'est pas lu dans les migrations mais SONDÉ en base
(`node _ASSOCIE/sonde-chapitres.mjs Tle`), parce qu'une migration écrite n'est
pas une migration exécutée. Les programmes de référence sont lus dans les textes
officiels eux-mêmes (BO, PDF Éduscol), pas dans des résumés d'éditeurs.

**Le déclencheur.** « Sur anglais il y avait des chapitres qui n'avaient rien à
voir. » C'est exact, et la cause est plus profonde qu'une erreur de saisie.

---

## 1. Anglais — le défaut signalé (CORRIGÉ, migration 243)

L'anglais de Terminale ouvrait sur quatre chapitres présentés dans le code comme
« les axes du programme de LV » :

| Ce que l'app affichait | Ce que c'est réellement |
|---|---|
| Faire société : unité et pluralité | Thématique de la spécialité **Anglais, monde contemporain** — pas du tronc commun |
| Environnements en mutation | Idem — **autre enseignement** |
| Art et débats d'idées | Reformulation approximative de l'axe « Art et pouvoir »… qui est un axe de **Première** |
| Innovations et responsabilité | Reformulation de « Innovations scientifiques et responsabilité »… axe de **Première** lui aussi |

**Aucun des quatre n'est un axe du programme de terminale.** Deux viennent d'un
autre enseignement, deux sont des paraphrases d'axes de l'année précédente.

### Le texte qui fait foi

Arrêté du 5 mai 2025, **BO n° 22 du 29 mai 2025** (MENE2504621A). Son **article 4**
fixe l'entrée en vigueur : seconde à la rentrée 2025-2026, **première et terminale
à la rentrée 2026-2027** — celle que vivent les élèves aujourd'hui. C'est donc ce
programme, et non celui de 2019, qui décrit leur année. Il compte **six axes** (le
programme de 2019 en comptait huit) :

1. Espace privé et espace public
2. Territoire et mémoire
3. Fictions et réalités
4. Enjeux et formes de la communication
5. Citoyenneté et mondes virtuels
6. **Le Royaume-Uni et ses nations** — le seul dont le traitement est obligatoire

*Cinq axes sur six doivent être traités dans l'année, dont obligatoirement le
sixième.* L'app ne proposait rien sur le Royaume-Uni : le seul axe garanti au
programme était le seul totalement absent.

### Ce qui a été fait

**Première réponse (migration 235, ABANDONNÉE le 19/08/2026).** Elle supprimait
les quatre faux axes et installait les six axes du BO 2025 aux positions 1 à 6,
avec cours et quiz. Elle n'a jamais été exécutée, et le fichier a été retiré du
dépôt : le programme d'anglais que l'app doit servir à un élève de terminale est
celui de la LANGUE, pas la liste des repères culturels de l'année. Ajouter six
chapitres culturels devant ses fiches aurait reconduit le défaut d'origine —
faire lire à l'élève, avant son cours, des intitulés qu'il ne retrouve pas
dessus. Le texte du BO reste juste, et la migration reste récupérable dans
l'historique git si l'on veut un jour lui donner sa place ailleurs (une entrée
« repères culturels » à part, par exemple).

**Ce qui est livré (migration 243).** Les quatre chapitres hors programme sont
supprimés — leçons par cascade, plus leurs quatre quiz, qui autrement
survivraient orphelins à leur chapitre (`quizzes.lesson_id` est ON DELETE SET
NULL) et resteraient tirables par le moteur de questions. Les 24 fiches de langue
de la migration 226 reculent aux positions 1 à 24 et reçoivent leur chapitre de
programme : **Le groupe nominal** (3 fiches), **Le groupe verbal** (5), **Les
temps** (5), **La phrase** (11). La page matière affiche donc quatre chapitres
repliables au lieu de 28 lignes à plat, et l'élève y retrouve exactement le
sommaire de son cours.

### Ce qui reste à faire sur l'anglais

- **Première** porte encore les axes de 2019 : « Identités et échanges » et « Art
  et pouvoir » sont justes (axes 1 et 3 du nouveau programme de 1re), mais
  « Espace privé et espace public » et « Citoyenneté et mondes virtuels » sont
  **passés en Terminale** dans le programme 2025. Il en manque quatre :
  *Diversité et inclusion*, *L'être humain et la nature*, *Les aires anglophones
  américaines*, et il faut retirer les deux qui ont déménagé.
- **Seconde** porte 4 axes là où le programme 2025 (en vigueur depuis la rentrée
  2025) en compte six, dont un axe spécifique aux pays du Commonwealth.

---

## 2. L'état de la Terminale, matière par matière

Sondé en base le 07/08/2026. « Chapitres » = ce que l'élève voit.

### Conformes — réécrits d'après le BO (migrations 225 → 233)

| Matière | Chapitres | Verdict |
|---|---|---|
| Philosophie | 19 | Les 17 notions + repères du programme ✅ |
| SVT (spé) | 22 | Les 7 chapitres du BO éclatés en 22 fiches ✅ |
| Espagnol | 35 | Grammaire complète + axes culturels ✅ |
| HLP (spé) | 19 | Les 6 chapitres des 2 semestres ✅ — **rangés sous leurs chapitres par la migration 257** (20/08/2026) : les 18 fiches de la 232 reçoivent leur `theme`, la fiche « Méthode de l'épreuve » reste volontairement hors chapitre |
| Enseignement scientifique | 16 | Les 4 thèmes du programme ✅ |
| EMC | 15 | ✅ |
| **Anglais** | **24** | ✅ **depuis la migration 243** — 4 chapitres de langue, 24 fiches |
| **Physique-Chimie (spé)** | **31** | ✅ **depuis la migration 252** — les 7 chapitres du programme éclatés en 31 fiches, 248 questions |
| **SES (spé)** | **31** | ✅ **depuis la migration 253** — les 12 chapitres du programme, 248 questions |
| **NSI (spé)** | **20** | ✅ **depuis la migration 254** — les 5 chapitres du programme, 160 questions |
| **Maths (spé)** | **19** | ✅ **depuis la migration 255** — algèbre et géométrie, analyse, probabilités ; 152 questions |
| **Maths expertes** | **12** | ✅ **depuis la migration 255** — nombres complexes, arithmétique, graphes et matrices |
| **Maths complémentaires** | **11** | ✅ **depuis la migration 255** — analyse, probabilités et statistique |

### Partiels — le programme n'est couvert qu'en partie

| Matière | Chapitres | Ce que dit le programme officiel |
|---|---|---|
| **Histoire-Géo** | 38 | Les 33 chapitres neufs (227/229) sont justes, mais **les 5 chapitres hérités de la migration 008 sont restés en positions 1-5** et deux d'entre eux DOUBLONNENT le contenu neuf : « Mers et océans dans la mondialisation » (pos. 4) contre « Mers et océans : vecteurs essentiels de la mondialisation » (pos. 39), « L'UE dans la mondialisation » (pos. 5) contre les chapitres 50-53. Les positions 6 à 25 sont vides — réservées aux thèmes 1 et 2 d'histoire, encore à écrire. |

### À réécrire — 3 à 5 chapitres inventés là où le programme en compte 10 à 20

| Matière | Chapitres | Programme officiel | Écart |
|---|---|---|---|
| ~~**Maths (spé)**~~ | ~~5~~ | **15 sections** en 4 parties (BO spécial n° 8 du 25/07/2019) : combinatoire et dénombrement · vecteurs, droites et plans de l'espace · orthogonalité et distances dans l'espace · représentations paramétriques et équations cartésiennes · suites · limites de fonctions · compléments sur la dérivation · continuité · fonction logarithme · fonctions sinus et cosinus · primitives et équations différentielles · calcul intégral · succession d'épreuves indépendantes · sommes de variables aléatoires · concentration et loi des grands nombres | **RÉGLÉ par la migration 255** (20/08/2026) : les 5 fiches composites remplacées par les 19 du programme, sous 3 chapitres. Les options partent dans leurs propres matières, `maths-expertes` (12 fiches) et `maths-complementaires` (11). |
| ~~**Physique-Chimie (spé)**~~ | ~~5~~ | 4 thèmes (constitution et transformations de la matière · mouvement et interactions · l'énergie · ondes et signaux), ~16 sections | **RÉGLÉ par la migration 252** (20/08/2026) : les 5 fiches composites remplacées par les 31 du programme, rangées sous ses 7 chapitres. |
| ~~**SES (spé)**~~ | ~~4~~ | 3 parties (science économique · sociologie et science politique · regards croisés), ~10 questionnements | **RÉGLÉ par la migration 253** (20/08/2026) : les 4 fiches composites remplacées par les 31 du programme, sous ses 12 questionnements. |
| ~~**HGGSP (spé)**~~ | ~~4~~ | **6 thèmes** | **RÉGLÉ par la migration 256** (20/08/2026) : les 4 fiches composites remplacées par les 24 du programme, quatre par thème — dont « De nouveaux espaces de conquête » et « Histoire et mémoires », qui n'existaient nulle part. |
| ~~**NSI (spé)**~~ | ~~4~~ | ~6 thèmes (structures de données · bases de données · architectures matérielles · langages et programmation · algorithmique) | **RÉGLÉ par la migration 254** (20/08/2026) : 20 fiches sous 5 chapitres, dont tout le génie logiciel, absent jusque-là. |
| ~~**Maths complémentaires**~~ | ~~4~~ | 12 thèmes | **RÉGLÉ par la migration 255** (20/08/2026) : 11 fiches sous 2 chapitres (analyse · probabilités et statistique). |
| ~~**Maths expertes**~~ | ~~3~~ | 3 thèmes (nombres complexes · arithmétique · matrices et graphes) | **RÉGLÉ par la migration 255** (20/08/2026) : les 3 chapitres éclatés en 12 fiches. |
| Options (allemand, latin, grec, musique, arts plastiques, EPS, SI, LLCER anglais) | 3 chacune | — | Fiches maison, jamais confrontées au BO |

---

## 3. Ce que l'audit a trouvé en dehors des chapitres

**`lib/exams.ts` ne connaît pas l'épreuve anticipée de mathématiques.** Depuis la
**session 2026**, les mathématiques — jusqu'ici évaluées en contrôle continu —
sont une épreuve anticipée du bac passée en fin de première par **tous** les
élèves, générale comme technologique (2 h, coefficient 2). `examsForProfile` ne
rend, en 1re, que « Bac de français — écrit & oral ». L'annale existe désormais
(migration 237) mais l'objectif examen de l'élève de 1re, lui, ignore encore
cette épreuve. **Correctif d'une ligne, non fait dans cette passe.**

**Le brevet a changé de barème pour la session 2026.** Note globale sur 20
(60 % épreuves finales / 40 % contrôle continu), et l'EMC devient une
**sous-partie autonome** de l'épreuve d'histoire-géographie, avec sa note et son
coefficient propres (0,5 contre 1,5). Les annales de la migration 237 en
tiennent compte — l'EMC y a sa propre fiche d'épreuve.

---

## 4. Priorités, dans l'ordre où je les traiterais

1. ~~**Maths spécialité Terminale**~~ — **RÉGLÉ par la migration 255**
   (20/08/2026) : 19 fiches en spécialité, plus 12 en mathématiques expertes et
   11 en mathématiques complémentaires, dans leurs matières respectives.
2. **Histoire-Géo : le ménage des 5 chapitres de la 008** — c'est le moins cher
   (une migration de suppression) pour le gain immédiat le plus visible : deux
   doublons disparaissent de la liste.
3. **Anglais Première et Seconde** — même défaut que celui corrigé en Terminale,
   même texte de référence, travail déjà balisé.
4. ~~**HGGSP**~~ — **RÉGLÉ par la migration 256** (20/08/2026) : 24 fiches sous
   les 6 thèmes du programme. Toutes les spécialités à coefficient 16 de
   Terminale sont désormais traitées — ~~Physique-Chimie~~ (252), ~~SES~~ (253),
   ~~NSI~~ (254), ~~Maths~~ (255) et ~~HGGSP~~ (256). Reste la **PREMIÈRE** :
   HGGSP y a 4 fiches composites pour 5 thèmes (il manque « Analyser les
   dynamiques des puissances internationales »).
5. **`lib/exams.ts`** : ajouter l'épreuve anticipée de maths en 1re.

---

## Sources

- [Arrêté du 5 mai 2025 fixant les programmes de langues vivantes étrangères (Légifrance) — article 4, entrée en vigueur](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051666594)
- [Programme d'anglais des classes de première et terminale, BO n° 22 du 29 mai 2025 (PDF)](https://pedagogie.ac-strasbourg.fr/fileadmin/pedagogie/langues/Textes_reglementaires/Programmes_LYCEE_1ere_Tle_Rentree_2026/ANGLAIS_Lycee_Programme_des_classes_de_Premiere_et_Terminale_2025.pdf)
- [Programme de spécialité de mathématiques de terminale, BO spécial n° 8 du 25 juillet 2019 (PDF)](https://cache.media.education.gouv.fr/file/SPE8_MENJ_25_7_2019/90/7/spe246_annexe_1158907.pdf)
- [Programme de spécialité de SES de terminale, BO spécial n° 8 du 25 juillet 2019](https://www.education.gouv.fr/bo/19/Special8/MENE1921253A.htm)
- [Les thèmes du programme de SES en terminale — SES-ENS Lyon](https://ses.ens-lyon.fr/enseigner/programmes/les-themes-du-programme-de-ses-en-terminale-rentree-2020)
- [Épreuves du DNB 2026 : calendrier, coefficients et barème](https://www.calcul-brevet.fr/epreuves-dnb-2026/)
- [Coefficients du bac par matière et série — L'Étudiant](https://www.letudiant.fr/bac/coefficients-bac-par-matiere-et-serie.html)
- [Épreuve anticipée de mathématiques, session 2026 (education.gouv.fr, PDF)](https://www.education.gouv.fr/sites/default/files/document/baccalaureat-general-2026-mathematiques-epreuve-anticipee-pour-les-candidats-sans-enseignements-de.pdf)
