// Anglais — Première : LA GRAMMAIRE (24 fiches).
//
// LE DÉFAUT. La page « Anglais » d'un élève de Première s'ouvre sur quatre
// intitulés CULTURELS et rien d'autre : « Identités et échanges », « Espace
// privé et espace public », « Art et pouvoir », « Citoyenneté et mondes
// virtuels ». Ils viennent de la migration 008 et ont reçu leur cours en 132.
// Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re anglais) : ce sont
// toujours les quatre seuls chapitres de la matière. Un élève qui bloque sur le
// present perfect, les modaux ou le discours indirect ne trouve rien à réviser.
//
// CE QUE L'ÉLÈVE DOIT VOIR — la même chose qu'en Terminale : le programme de
// LANGUE, en quatre chapitres et vingt-quatre fiches.
//   1. Le groupe nominal  (3)   3. Les temps  (5)
//   2. Le groupe verbal   (5)   4. La phrase  (11)
// C'est la décision prise pour la Terminale (migration 243) et la règle inscrite
// dans CLAUDE.md : « un dossier de matière ne montre que son programme — ni axe
// culturel isolé, ni chapitre hérité d'un vieux seed ». Les quatre axes de 1re
// sont, eux, de vrais axes du BO (le cycle terminal en compte huit) ; ce qui
// leur est reproché n'est pas d'être faux mais d'être SEULS, et de tenir la
// place d'un programme que l'élève ne retrouve nulle part ailleurs dans l'app.
// Leur cours reste dans le dépôt (migration 132) si on veut un jour leur rendre
// un rayon à eux (`chapters.discipline`, comme le français de 1re).
//
// POURQUOI LE MÊME CONTENU QU'EN TERMINALE, IMPORTÉ ET NON RECOPIÉ. La grammaire
// anglaise de Première et celle de Terminale sont le même corps de règles : les
// programmes de LV sont écrits pour le CYCLE TERMINAL (2de-1re-Tle), pas pour un
// niveau. Le générateur sait déjà dupliquer un bloc sur plusieurs niveaux — mais
// pas ici : la migration 226 est DÉJÀ EXÉCUTÉE, et ajouter '1re' à ses niveaux
// la ferait se régénérer différemment. On importe donc les 24 chapitres de
// `anglais-tle.mjs` sans y toucher, et on les republie sur le niveau '1re' : les
// UUID, dérivés de `slug|niveau|titre`, sont différents, le contenu est le même,
// et une correction de règle faite une fois vaut pour les deux niveaux.
//
// ⚠️ Le slug reste `anglais` (la matière existe depuis 008) : ne JAMAIS générer
// avec `--slugs anglais`, qui fusionnerait ce module avec `anglais-tle.mjs` et
// réécrirait la 226. Toujours `--modules anglais-1re`.

import anglaisTle from './anglais-tle.mjs'

// Le chapitre de programme qui coiffe chaque fiche (colonne `chapters.theme`).
// Écrit ici, et non dans `anglais-tle.mjs` : ce module-là a généré la 226, qui
// ne portait pas encore la colonne — c'est la 243, écrite à la main, qui a rangé
// les 24 fiches de Terminale. La table ci-dessous en est la copie exacte.
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
  if (!axe) throw new Error(`anglais-1re : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch, axe }
})

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'L’ANGLAIS DE PREMIÈRE, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT (sondé le 21/08/2026, node _ASSOCIE/sonde-chapitres.mjs 1re anglais) :
l'anglais de Première n'a QUE ses 4 axes culturels — « Identités et échanges »,
« Espace privé et espace public », « Art et pouvoir », « Citoyenneté et mondes
virtuels » — et aucune fiche de langue. Un élève qui bloque sur le present
perfect, les modaux ou le discours indirect ne trouve rien à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 243 l'a fait pour la Terminale — 4 chapitres (Le groupe nominal, Le
groupe verbal, Les temps, La phrase) et leurs 24 fiches, aux positions 1 à 24.
Les 4 axes partent (leurs quiz et leurs lignes de la file « À revoir » avec
eux) : leur cours reste dans le dépôt, migration 132, si on veut un jour leur
rendre un rayon à eux.
LE CONTENU EST CELUI DE LA TERMINALE, à dessein : les programmes de LV sont
écrits pour le CYCLE TERMINAL, la grammaire y est la même. Le module importe
les 24 fiches de la 226 au lieu de les recopier.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les
migrations 243 à 259 — la 234 n'a jamais été exécutée telle quelle.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 axes culturels partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même raison qu'en français (259) :
deux de ces quatre titres portent une apostrophe, et rien ne garantit que la
base porte la même que ce fichier (droite dans le contenu ancien, typographique
dans le récent) ; un DELETE par titre ne trouverait alors pas la ligne, EN
SILENCE. Le critère « pas de chapitre de programme » vise exactement les quatre
lignes voulues : elles datent de la 008, bien avant la colonne theme, tandis que
les 24 fiches neuves en portent un dès l'INSERT — le ménage tourne AVANT les
insertions et ne peut donc jamais mordre sur elles, ni au premier passage ni au
rejeu.
Le filtre level = '1re' est indispensable : l'anglais existe sur SEPT niveaux,
tous bâtis sur le même modèle d'axes culturels. Seule la Première est refondue
ici (la Terminale l'a été par la 243).
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Anglais / 1re » par subject + grade_level, donc toujours tirables par le
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
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      // Les 4 axes viennent d'être supprimés par le ménage : la numérotation
      // repart de 1, comme la 243 l'a fait en Terminale.
      chapitres,
    },
  ],
}
