// Espagnol — Troisième : LE PROGRAMME DE LANGUE (34 fiches).
//
// LE DÉFAUT. La page « Espagnol » d'un élève de 3e s'ouvre sur QUATRE fiches
// héritées du tout premier jeu de données (migration 008) : « El pretérito
// indefinido », « Hablar del futuro », « El mundo hispánico » et « Preparar la
// expresión oral ». Quatre lignes pour une année entière. Un élève qui bloque
// sur la négation, l'enclise des pronoms, ser et estar, l'apocope, gustar ou le
// subjonctif ne trouve RIEN.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 3e, et c'est le même découpage qu'en 2de, en 1re et en Terminale :
// les 4 chapitres du programme de langue et leurs 34 fiches.
//   1. La phrase          (4)    3. Le groupe verbal  (12)
//   2. Le groupe nominal  (12)   4. Les temps         (6)
//
// POURQUOI LE MÊME CONTENU QU'AU LYCÉE, IMPORTÉ ET NON RECOPIÉ. La règle posée
// pour la campagne de 3e — « toutes écrites, aucune importée, un programme de
// collège n'a pas d'équivalent au lycée » — ne vaut PAS ici, et c'est la
// maquette elle-même qui le dit : ses 4 chapitres et ses 34 fiches sont, titre
// pour titre, ceux de la Terminale. La grammaire espagnole ne change pas entre
// la 3e et la Tle ; seuls le lexique et les attentes de production évoluent. On
// importe donc les 34 chapitres de `espagnol-tle.mjs` sans y toucher, et on les
// republie sur le niveau '3e' : les UUID, dérivés de `slug|niveau|titre`, sont
// différents, le contenu est le même, et une correction de règle faite une fois
// vaut désormais pour QUATRE niveaux.
//
// C'est le geste des migrations 266 (anglais 1re), 267 (espagnol 1re), 276
// (allemand 1re) et 286-288 (les trois LV de 2de).
//
// ⚠️ Le slug `espagnol` porte désormais CINQ modules (`espagnol-lycee.mjs` →
// 220, `espagnol-tle.mjs` → 231, `espagnol-1re.mjs` → 267, `espagnol-2de.mjs` →
// 287, celui-ci → 297) : ne JAMAIS générer avec `--slugs espagnol`, qui les
// fusionnerait et réécrirait quatre migrations. Toujours `--modules espagnol-3e`.

import espagnolTle from './espagnol-tle.mjs'

// Le chapitre de programme qui coiffe chaque fiche (colonne `chapters.theme`).
// Écrit ici, et non dans `espagnol-tle.mjs` : ce module-là a généré la 231, qui
// ne portait pas encore la colonne — c'est la 244, écrite à la main, qui a rangé
// les 34 fiches de Terminale. La table ci-dessous en est la copie exacte, la
// même que celle de `espagnol-1re.mjs` et de `espagnol-2de.mjs`.
const AXES = {
  'Les questions': 'La phrase',
  'La négation': 'La phrase',
  'La proposition subordonnée relative': 'La phrase',
  'La proposition subordonnée complétive': 'La phrase',
  'Genre et nombre': 'Le groupe nominal',
  'Les articles': 'Le groupe nominal',
  'Les démonstratifs': 'Le groupe nominal',
  'Les adjectifs': 'Le groupe nominal',
  'Les pronoms personnels sujets': 'Le groupe nominal',
  'Les pronoms personnels compléments': 'Le groupe nominal',
  'Les possessifs': 'Le groupe nominal',
  'Les pronoms relatifs': 'Le groupe nominal',
  'Les indéfinis': 'Le groupe nominal',
  'La comparaison': 'Le groupe nominal',
  'Le superlatif': 'Le groupe nominal',
  'L’apocope': 'Le groupe nominal',
  'L’auxiliaire haber': 'Le groupe verbal',
  'Les verbes pronominaux': 'Le groupe verbal',
  'Les verbes à diphtongue': 'Le groupe verbal',
  'Les verbes à affaiblissement': 'Le groupe verbal',
  'Ser et estar': 'Le groupe verbal',
  'Le gérondif': 'Le groupe verbal',
  'Le participe passé': 'Le groupe verbal',
  'Les verbes du type « gustar »': 'Le groupe verbal',
  'L’obligation': 'Le groupe verbal',
  'L’habitude': 'Le groupe verbal',
  'La probabilité': 'Le groupe verbal',
  'Le conseil': 'Le groupe verbal',
  'Le présent de l’indicatif': 'Les temps',
  'Le subjonctif présent': 'Les temps',
  'L’imparfait': 'Les temps',
  'Le passé composé': 'Les temps',
  'Le passé simple': 'Les temps',
  'Le futur': 'Les temps',
}

// Les 34 fiches de Terminale, telles quelles, chacune rattachée à son chapitre.
//
// Le `throw` n'est pas décoratif : si un titre bouge dans `espagnol-tle.mjs`, la
// fiche partirait sans chapitre et la page la rangerait dans un bloc « Autres
// chapitres » — le défaut même que cette migration corrige. Mieux vaut que la
// génération s'arrête.
const chapitres = espagnolTle.blocs[0].chapitres.map((ch) => {
  const axe = AXES[ch.titre]
  if (!axe) throw new Error(`espagnol-3e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch, axe }
})

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'L’ESPAGNOL DE TROISIÈME, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT : l'espagnol de 3e n'avait que les 4 fiches du premier jeu de
données de l'app — « El pretérito indefinido », « Hablar del futuro », « El
mundo hispánico » et « Preparar la expresión oral ». Un élève qui bloque sur la
négation, l'enclise des pronoms, ser et estar, l'apocope, gustar ou le
subjonctif ne trouvait RIEN à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 231 puis la 244 l'ont fait pour la Terminale, la 267 pour la Première
et la 287 pour la Seconde — 4 chapitres (La phrase, Le groupe nominal, Le groupe
verbal, Les temps) et leurs 34 fiches, aux positions 1 à 34. Les 4 fiches
héritées partent, leurs quiz et leurs lignes de la file « À revoir » avec elles.
LE CONTENU EST CELUI DU LYCÉE, à dessein : la maquette de 3e reprend, titre pour
titre, les 4 chapitres et les 34 fiches de la Terminale. La grammaire espagnole
ne change pas d'un niveau à l'autre — seuls le lexique et les attentes de
production évoluent. Une correction de règle faite une fois vaut désormais pour
la 3e, la 2de, la 1re et la Terminale.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 34 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 296 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 4 anciennes fiches déjà supprimées et les 34
neuves pas encore posées : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui, pas seulement
avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches héritées de la 008 partent, au niveau 3e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 286, 287 et 288 :
les quatre titres sont en espagnol et portent des accents (« El pretérito
indefinido », « El mundo hispánico », « Preparar la expresión oral »), et rien ne
garantit qu'un copier-coller les restitue à l'octet près ; un DELETE par titre ne
trouverait alors pas la ligne, EN SILENCE. Le critère « pas de chapitre de
programme » vise exactement les quatre lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 34 fiches neuves en portent un dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '3e' est indispensable : l'espagnol existe sur six niveaux
(5e → Tle) et les autres niveaux du collège portent eux aussi des chapitres sans
theme.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Espagnol / 3e » par subject + grade_level, donc toujours tirables par le
moteur de questions), puis les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '3e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      // Les 4 fiches héritées viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 244 l'a fait en Terminale.
      chapitres,
    },
  ],
}
