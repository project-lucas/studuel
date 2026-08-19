// Le jeu « Programme » — un par matière, tiré des VRAIS chapitres de la classe.
//
// POURQUOI IL VIT HORS DU CATALOGUE DES SALONS. Les 17 jeux de
// `lib/jeux/catalog.ts` sont des exercices d'habileté (calcul mental, capitales)
// avec chacun sa banque locale, sa robe et sa mécanique — et des invariants
// testés le garantissent : robe unique, jamais deux fois la même mécanique dans
// une matière, une banque enregistrée par jeu. Le Programme est l'exact inverse :
// c'est LE MÊME jeu répété dans les sept matières, et sa banque est en base
// (les `quiz_questions` de la classe de l'élève). Le décliner en sept ids de
// salon aurait violé les cinq invariants d'un coup, et il aurait fallu inventer
// sept robes pour un seul jeu.
//
// Il est donc une catégorie à part, et ça tombe juste : les trophées sont
// indexés par (matière × jeu), donc UN id `programme` partagé suffit — la
// matière fait déjà la distinction dans la clé.
//
// CE QU'IL RÉPARE. Sans lui, la Route des trophées pousserait l'élève vers les
// seuls drills : on fabriquerait un très bon jeu qui enseigne moins que le
// Classé qu'il remplace. Avec lui, chaque matière a une entrée qui suit le BO.
// Accessoirement il égalise le catalogue — Maths, Français et Anglais ont trois
// jeux quand SVT, Physique-Chimie et Espagnol n'en ont que deux, et un total de
// matière « somme des jeux » aurait rendu « je suis fort en SVT » illisible.
import type { GameFormat } from '@/lib/jeux/formats'
import { SALONS } from '@/lib/jeux/catalog'

/**
 * L'id du jeu, partagé par toutes les matières. C'est la valeur stockée dans
 * `game_trophies.game_id` — la colonne `subject` porte la distinction.
 */
export const PROGRAMME_GAME_ID = 'programme'

/**
 * Le format, unique lui aussi. Mécanique à VIES et sans chrono par question,
 * délibérément : une question de programme se lit (un énoncé de Thalès n'est
 * pas un mot à traduire), donc la pression du temps y punirait la lecture et
 * pas la connaissance. La tension vient des trois vies.
 *
 * Il n'entre PAS dans `GAME_FORMATS` : les invariants de `formats.test.ts`
 * portent sur les jeux de salon, et le Programme partagerait forcément sa
 * mécanique avec un jeu de la même matière (« Chasse à la faute » en français,
 * « Faux amis » en anglais tournent déjà aux vies).
 */
export const PROGRAMME_FORMAT: GameFormat = {
  id: PROGRAMME_GAME_ID,
  theme: 'programme',
  timbre: 'velours',
  layout: 'liste',
  rule: '10 questions de ton programme. Prends ton temps — mais tu n’as que 3 vies.',
  emoji: '📘',
  lexicon: {
    verb: 'Réponds',
    step: 'question',
    steps: 'questions',
    hit: 'question réussie',
    win: 'Chapitre tenu !',
    lose: 'À revoir — mais tu sais lesquelles',
  },
  params: {
    mechanic: 'vies',
    vies: { lives: 3, questionSeconds: null, target: 10 },
  },
}

/**
 * Questions minimales pour que la partie vaille le coup. En dessous, la matière
 * n'offre PAS le Programme : mieux vaut une tuile absente qu'une partie qui
 * reboucle sur les mêmes six questions et transforme le trophée en compteur de
 * présence. C'est le garde-fou du piège de profondeur — le vrai risque d'une
 * ladder, cf. l'analyse du chantier.
 */
export const MIN_PROGRAMME_QUESTIONS = 15

/**
 * PROXY BON MARCHÉ du seuil ci-dessus, pour l'arène.
 *
 * `MIN_PROGRAMME_QUESTIONS` porte sur les QUESTIONS, qu'on ne peut compter
 * qu'en lisant `quiz_questions` — trop cher pour la page d'accueil, qui a déjà
 * ses deux vagues de requêtes. L'arène compte donc les QUIZ de la matière, ce
 * qu'une seule lecture légère donne, et n'allume la tuile qu'au-delà de ce
 * seuil (un quiz porte une dizaine de questions).
 *
 * C'est une approximation ASSUMÉE, et elle n'a pas besoin d'être exacte : la
 * route `/defi/programme/[matiere]` refait le vrai décompte et reste seule
 * juge. Le proxy ne sert qu'à ne pas promettre une tuile visiblement vide.
 */
export const MIN_PROGRAMME_QUIZZES = 2

/** Le nom affiché de la tuile, dans la matière. */
export const PROGRAMME_NAME = 'Ton programme'

/** L'accroche du billet — la même promesse que `formatTeaser` pour les salons. */
export const PROGRAMME_TEASER = '3 vies · 10 questions'

/** L'accroche longue, sous le nom, dans l'espace duel. */
export const PROGRAMME_TAGLINE =
  'Les chapitres de ta classe, tes points faibles en premier'

/**
 * Le slug d'une matière pour l'URL du jeu. Repris à l'identique de
 * `lib/defi/modes-catalog.ts` (`slugify`) : les deux doivent produire la même
 * chaîne, sinon un lien construit ici n'ouvrirait pas la matière visée.
 */
export function programmeSlug(subject: string): string {
  return subject
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** La matière du catalogue portant ce slug, ou null. */
export function subjectFromProgrammeSlug(slug: string): string | null {
  const wanted = programmeSlug(slug)
  return SALONS.find((s) => programmeSlug(s.subject) === wanted)?.subject ?? null
}

/** Le lien vers le Programme d'une matière. */
export function programmeHref(subject: string): string {
  return `/defi/programme/${programmeSlug(subject)}`
}

// ------------------------------------------------------- l'ordre de la pioche

export type ProgrammeQuiz = { id: string; lesson_id: string | null }

/**
 * Les quiz d'une matière, du chapitre le MOINS maîtrisé au mieux maîtrisé.
 * C'est ce qui rend la promesse de la tuile (« tes points faibles en premier »)
 * et ce qui distingue le Programme d'un QCM au hasard : la partie porte sur ce
 * qui manque, pas sur ce qui est déjà su.
 *
 * Un quiz sans leçon, ou dont le chapitre n'a jamais été travaillé, compte pour
 * 0 — priorité maximale. Le tri est STABLE : à maîtrise égale l'ordre d'entrée
 * est conservé, donc l'appelant peut mélanger en amont pour varier les parties
 * sans que ce tri ne défasse son mélange.
 */
export function orderQuizzesByWeakness<T extends ProgrammeQuiz>(
  quizzes: readonly T[],
  chapterByLesson: ReadonlyMap<string, string>,
  masteryOf: (chapterId: string) => number | undefined,
): T[] {
  const weight = (q: T): number => {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    if (!chapterId) return 0
    return masteryOf(chapterId) ?? 0
  }
  // `map` + index avant le tri : `Array.prototype.sort` est stable depuis ES2019,
  // mais on ne veut pas que la stabilité du tri du Défi dépende d'un détail de
  // moteur — le départage par index la garantit explicitement.
  return quizzes
    .map((quiz, index) => ({ quiz, index, weight: weight(quiz) }))
    .sort((a, b) => a.weight - b.weight || a.index - b.index)
    .map((entry) => entry.quiz)
}
