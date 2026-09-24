// -----------------------------------------------------------------------------
// LES MATIÈRES QUE JE RÉVISE LE PLUS — le récap en colonnes de l'onglet Moi
// (Lucas, 24/09/2026 : « un récap visuel sous forme de colonnes, qui
// augmenteraient de taille à mesure que l'élève révise une matière »).
//
// LA MESURE : les QUESTIONS travaillées — la somme des questions de chaque
// séance de quiz ou de flashcards jouée jusqu'au bout (`test_sessions`). Une
// séance abandonnée au chrono n'écrit rien (lib/quiz-chrono) : elle ne compte
// pas, et c'est juste. Agrégée en base par quiz (`revision_par_quiz`,
// migration 381), puis rattachée ici à sa matière par la charpente du
// catalogue : quiz → leçon → chapitre → matière. Les chapitres sont ceux du
// niveau de l'élève et de ses matières suivies — le même périmètre que les
// couronnes du même onglet.
//
// Logique pure, aucun accès base.
// -----------------------------------------------------------------------------

/** Les révisions d'un quiz : combien de séances, combien de questions. */
export type RevisionQuiz = { quizId: string; seances: number; questions: number }

/** Une matière du récap. */
export type MatiereRevisee = {
  subjectId: string
  slug: string
  nom: string
  questions: number
  seances: number
}

export type MatiereCatalogue = { id: string; slug: string; name: string }

const entier = (v: unknown): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : Number.NaN
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0
}

/** Relit la réponse de `revision_par_quiz()` (381). Tolérant : on ignore ce qu'on ne sait pas lire. */
export function lireRevisionParQuiz(raw: unknown): RevisionQuiz[] {
  return (Array.isArray(raw) ? raw : []).flatMap((r): RevisionQuiz[] => {
    if (!r || typeof r !== 'object') return []
    const o = r as Record<string, unknown>
    const quizId = typeof o.quiz_id === 'string' ? o.quiz_id : ''
    const questions = entier(o.questions)
    if (!quizId || questions <= 0) return []
    return [{ quizId, seances: entier(o.seances), questions }]
  })
}

/**
 * Le REPLI tant que la 381 manque : les dernières séances lues telles quelles
 * (`quiz_id`, `total`), pliées par quiz. Même résultat que l'agrégat SQL sur
 * les mêmes lignes.
 */
export function plierSeances(rows: readonly { quiz_id: string | null; total: number | null }[] | null | undefined): RevisionQuiz[] {
  const parQuiz = new Map<string, RevisionQuiz>()
  for (const r of rows ?? []) {
    const total = entier(r?.total)
    if (!r?.quiz_id || total <= 0) continue
    const q = parQuiz.get(r.quiz_id) ?? { quizId: r.quiz_id, seances: 0, questions: 0 }
    q.seances += 1
    q.questions += total
    parQuiz.set(r.quiz_id, q)
  }
  return [...parQuiz.values()]
}

/**
 * Les révisions rangées par matière, de la plus travaillée à la moins
 * travaillée. Une matière sans question ne figure pas : une colonne vide ne
 * dit rien qu'une invitation ne dise mieux. À égalité, l'ordre du catalogue.
 */
export function matieresRevisees({
  revisions,
  quizLecon,
  leconChapitre,
  chapitreMatiere,
  matieres,
}: {
  revisions: readonly RevisionQuiz[]
  quizLecon: ReadonlyMap<string, string>
  leconChapitre: ReadonlyMap<string, string>
  /** chapitre → matière, pour les chapitres du périmètre de l'élève. */
  chapitreMatiere: ReadonlyMap<string, string>
  /** Les matières suivies, dans l'ordre du catalogue. */
  matieres: readonly MatiereCatalogue[]
}): MatiereRevisee[] {
  const totaux = new Map<string, { questions: number; seances: number }>()
  for (const r of revisions) {
    const lecon = quizLecon.get(r.quizId)
    const chapitre = lecon ? leconChapitre.get(lecon) : undefined
    const matiere = chapitre ? chapitreMatiere.get(chapitre) : undefined
    if (!matiere) continue
    const t = totaux.get(matiere) ?? { questions: 0, seances: 0 }
    t.questions += r.questions
    t.seances += r.seances
    totaux.set(matiere, t)
  }
  const ordre = new Map(matieres.map((m, i) => [m.id, i]))
  return matieres
    .flatMap((m): MatiereRevisee[] => {
      const t = totaux.get(m.id)
      return t && t.questions > 0 ? [{ subjectId: m.id, slug: m.slug, nom: m.name, ...t }] : []
    })
    .sort((a, b) => b.questions - a.questions || (ordre.get(a.subjectId) ?? 0) - (ordre.get(b.subjectId) ?? 0))
}

/** Hauteur minimale d'une colonne, en % : la plus petite reste visible. */
export const HAUTEUR_MIN_PCT = 8

/** La hauteur de chaque colonne, en % de la plus haute (qui fait 100). */
export function hauteursColonnes(matieres: readonly Pick<MatiereRevisee, 'questions'>[]): number[] {
  const max = Math.max(0, ...matieres.map((m) => m.questions))
  if (max <= 0) return matieres.map(() => 0)
  return matieres.map((m) => Math.max(HAUTEUR_MIN_PCT, Math.round((m.questions / max) * 100)))
}

/** Le nom qui tient sous une colonne étroite. */
const NOMS_COURTS: Record<string, string> = {
  maths: 'Maths',
  francais: 'Français',
  'histoire-geo': 'Hist-Géo',
  'physique-chimie': 'Phys-Chimie',
  svt: 'SVT',
  anglais: 'Anglais',
  espagnol: 'Espagnol',
  allemand: 'Allemand',
  philosophie: 'Philo',
  ses: 'SES',
  nsi: 'NSI',
  'enseignement-scientifique': 'Ens. sci.',
  'arts-plastiques': 'Arts',
  technologie: 'Techno',
  musique: 'Musique',
  economie: 'Éco',
  emc: 'EMC',
  hggsp: 'HGGSP',
  latin: 'Latin',
  grec: 'Grec',
  sport: 'Sport',
  entrepreneuriat: 'Entrepr.',
  fiscalite: 'Fiscalité',
  'figures-historiques': 'Figures',
}

export function nomCourtMatiere(slug: string, nom: string): string {
  return NOMS_COURTS[slug] ?? nom
}

/** « 1 question », « 240 questions ». */
export function libelleQuestions(n: number): string {
  const v = Math.max(0, Math.trunc(n || 0))
  return `${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} question${v > 1 ? 's' : ''}`
}
