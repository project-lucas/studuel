// Anglais — Seconde : LE PROGRAMME DE LANGUE (24 fiches).
//
// LE DÉFAUT. La page « Anglais » d'un élève de Seconde s'ouvre sur QUATRE fiches
// thématiques héritées de la migration 008 (contenu rempli par la 125) :
// « Vivre entre générations », « Les univers professionnels », « Représentation
// de soi et d'autrui », « Le passé dans le présent ». Ce sont les axes
// CULTURELS du programme, pas la langue : un élève qui bloque sur les modaux,
// le present perfect, les verbes à particule, la voix passive ou le discours
// indirect ne trouve RIEN.
//
// CE QUE L'ÉLÈVE DOIT VOIR — la même chose qu'en Terminale et qu'en Première :
// les 4 chapitres du programme de langue et leurs 24 fiches.
//   1. Le groupe nominal  (3)    3. Les temps    (5)
//   2. Le groupe verbal   (5)    4. La phrase   (11)
// C'est la décision prise pour la Terminale (migration 243) puis pour la
// Première (266), et la règle inscrite dans CLAUDE.md : « un dossier de matière
// ne montre que son programme ». Les 4 axes culturels partent donc aussi de la
// Seconde, pour la raison qui les a fait partir des deux autres niveaux : une
// fiche unique qui prétend tenir tout un axe culturel d'une année n'est pas un
// chapitre du programme, c'est une ligne de plus qui rouvre le doute sur les
// autres.
//
// POURQUOI LE MÊME CONTENU QU'EN TERMINALE, IMPORTÉ ET NON RECOPIÉ. Même
// raisonnement qu'en 266 : les programmes de LV sont écrits pour le CYCLE
// TERMINAL (2de-1re-Tle), pas pour un niveau, et la grammaire anglaise de
// Seconde est celle de Terminale — ce sont la difficulté des supports et
// l'exigence attendue qui changent, pas les règles. Le générateur sait dupliquer
// un bloc sur plusieurs niveaux, mais pas ici : les migrations 226 et 266 sont
// DÉJÀ ÉCRITES, et ajouter '2de' aux niveaux de la première les ferait se
// régénérer différemment. On importe donc les 24 chapitres de `anglais-tle.mjs`
// sans y toucher, et on les republie sur le niveau '2de' : les UUID, dérivés de
// `slug|niveau|titre`, sont différents, le contenu est le même, et une
// correction de règle faite une fois vaut pour les trois niveaux.
//
// ⚠️ Le slug reste `anglais` et TROIS modules le portent désormais
// (`anglais-tle.mjs` → 226, `anglais-1re.mjs` → 266, celui-ci → 286) : ne JAMAIS
// générer avec `--slugs anglais`, qui les fusionnerait et réécrirait deux
// migrations. Toujours `--modules anglais-2de`.

import anglaisTle from './anglais-tle.mjs'

// Le chapitre de programme qui coiffe chaque fiche (colonne `chapters.theme`).
// Écrit ici, et non dans `anglais-tle.mjs` : ce module-là a généré la 226, qui
// ne portait pas encore la colonne — c'est la 243, écrite à la main, qui a rangé
// les 24 fiches de Terminale. La table ci-dessous en est la copie exacte, la
// même que celle de `anglais-1re.mjs`.
const AXES = {
  'Les déterminants': 'Le groupe nominal',
  'Exprimer une quantité': 'Le groupe nominal',
  'Les adjectifs qualificatifs': 'Le groupe nominal',
  'Les verbes lexicaux et les auxiliaires': 'Le groupe verbal',
  'Les auxiliaires modaux': 'Le groupe verbal',
  'Les verbes à particule et les verbes prépositionnels': 'Le groupe verbal',
  'Infinitif et gérondif': 'Le groupe verbal',
  'Les adverbes': 'Le groupe verbal',
  'Le présent simple et le présent en BE + -ING': 'Les temps',
  'Le prétérit simple et le prétérit BE + -ING': 'Les temps',
  'Le present perfect et le present perfect BE + -ING': 'Les temps',
  'Le past perfect et le past perfect BE + -ING': 'Les temps',
  'Exprimer le futur et le conditionnel': 'Les temps',
  'Les questions': 'La phrase',
  'La phrase exclamative': 'La phrase',
  'Le comparatif et le superlatif': 'La phrase',
  'Les subordonnées': 'La phrase',
  'Exprimer la temporalité et la durée': 'La phrase',
  'Exprimer la cause et le but': 'La phrase',
  'Exprimer la condition, la concession et l’opposition': 'La phrase',
  'Exprimer l’habitude': 'La phrase',
  'Faire faire quelque chose à quelqu’un': 'La phrase',
  'La voix passive': 'La phrase',
  'Le discours indirect': 'La phrase',
}

// Les 24 fiches de Terminale, telles quelles, chacune rattachée à son chapitre.
// Le `throw` n'est pas décoratif : si un titre bouge dans `anglais-tle.mjs`, la
// fiche partirait sans chapitre et la page la rangerait dans un bloc « Autres
// chapitres » — le défaut même que cette migration corrige. Mieux vaut que la
// génération s'arrête.
const chapitres = anglaisTle.blocs[0].chapitres.map((ch) => {
  const axe = AXES[ch.titre]
  if (!axe) throw new Error(`anglais-2de : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch, axe }
})

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'L’ANGLAIS DE SECONDE, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT : l'anglais de Seconde n'avait que les 4 fiches thématiques de la
migration 008 (contenu rempli par la 125) — « Vivre entre générations », « Les
univers professionnels », « Représentation de soi et d'autrui », « Le passé dans
le présent ». Ce sont les axes CULTURELS du programme, réduits à une fiche
chacun, pas la LANGUE. Un élève qui bloque sur les auxiliaires modaux, le
present perfect, les verbes à particule, l'infinitif et le gérondif, la voix
passive ou le discours indirect ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 243 l'a fait pour la Terminale et la 266 pour la Première — 4 chapitres
(Le groupe nominal, Le groupe verbal, Les temps, La phrase) et leurs 24 fiches,
aux positions 1 à 24. Les 4 fiches thématiques partent (leurs quiz et leurs
lignes de la file « À revoir » avec elles) : c'est la décision prise en 243, et
la règle inscrite dans CLAUDE.md — un dossier de matière ne montre que son
programme.
LE CONTENU EST CELUI DE LA TERMINALE, à dessein : les programmes de LV sont
écrits pour le CYCLE TERMINAL, la grammaire y est la même. Le module importe les
24 fiches de la 226 au lieu de les recopier.
PÉRIMÈTRE : la SECONDE SEULE. Le ménage est borné à level = '2de' — le collège a
ses propres chapitres, qu'aucun programme ne vient remplacer ici.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 24 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 285 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 4 anciennes fiches déjà supprimées et les 24
neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches thématiques de la 008 partent, au niveau 2de SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 266, 267, 276, 277
et 284. « Représentation de soi et d'autrui » porte une apostrophe, et rien ne
garantit que la base porte la même que ce fichier (droite dans le contenu ancien,
typographique dans le récent) : un DELETE par titre ne trouverait alors pas la
ligne, EN SILENCE. Le critère « pas de chapitre de programme » vise exactement
les quatre lignes voulues : elles datent de la 008, bien avant la colonne theme,
tandis que les 24 fiches neuves en portent un dès l'INSERT — le ménage tourne
AVANT les insertions et ne peut donc jamais mordre sur elles, ni au premier
passage ni au rejeu.
Le filtre level = '2de' est indispensable : l'anglais existe sur sept niveaux, et
le collège porte lui aussi des chapitres sans theme.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Anglais / 2de » par subject + grade_level, donc toujours tirables par le
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
   AND s.slug = 'anglais'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '2de'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      // Les 4 fiches thématiques viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 243 l'a fait en Terminale.
      chapitres,
    },
  ],
}
