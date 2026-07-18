// Examen blanc — logique pure : composition du sujet (équilibré entre les
// matières), chronomètre et bilan par chapitre. La progression vers l'examen
// se mesure ici sur des performances réelles en conditions (chrono, pas de
// correction immédiate), pas sur le volume de révision.

export const EXAM_MAX_QUESTIONS = 20
// 45 s par question : assez pour lire et réfléchir, assez court pour que le
// chrono se sente — c'est lui qui fait « examen ».
export const EXAM_SECONDS_PER_QUESTION = 45

export function examDurationSeconds(questionCount: number): number {
  return Math.max(0, questionCount) * EXAM_SECONDS_PER_QUESTION
}

export type ExamQuestion = {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string | null
  subject: string
  subjectSlug: string | null
  chapterId: string | null
  chapterTitle: string | null
}

// Sujet équilibré : round-robin entre les matières (chacune apporte sa
// question à tour de rôle) jusqu'au plafond — un vrai examen ne porte jamais
// sur une seule matière.
export function composeExam(
  bySubject: Map<string, ExamQuestion[]>,
  max: number = EXAM_MAX_QUESTIONS,
): ExamQuestion[] {
  const pools = [...bySubject.values()].filter((qs) => qs.length > 0)
  const picked: ExamQuestion[] = []
  let i = 0
  while (picked.length < max && pools.some((p) => p.length > 0)) {
    const pool = pools[i % pools.length]
    const q = pool.shift()
    if (q) picked.push(q)
    i++
  }
  return picked
}

// ------------------------------------------------------------------- bilan

export type ExamVerdict = 'solide' | 'fragile' | 'a_revoir'

export const VERDICT_LABELS: Record<ExamVerdict, string> = {
  solide: 'Solide',
  fragile: 'Fragile',
  a_revoir: 'À revoir',
}

// Seuils PROPRES à l'examen blanc, volontairement plus souples que la maîtrise
// de chapitre (lib/mastery.ts, « acquis » à 80 %) : en conditions d'examen,
// ≥ 75 % = solide, ≥ 50 % = fragile, sinon à revoir.
export function verdictFor(ratio: number): ExamVerdict {
  if (ratio >= 0.75) return 'solide'
  if (ratio >= 0.5) return 'fragile'
  return 'a_revoir'
}

export type ChapterReport = {
  chapterId: string | null
  chapterTitle: string | null
  subject: string
  subjectSlug: string | null
  correct: number
  total: number
  verdict: ExamVerdict
}

// Bilan par chapitre : chaque question compte pour son chapitre (les
// questions sans chapitre sont agrégées par matière). Une question sans
// réponse (temps écoulé) compte fausse — comme le jour J.
export function buildReport(
  questions: ExamQuestion[],
  goodById: Map<string, boolean>,
): ChapterReport[] {
  const byKey = new Map<string, ChapterReport>()
  for (const q of questions) {
    const key = q.chapterId ?? `subject:${q.subject}`
    const r = byKey.get(key) ?? {
      chapterId: q.chapterId,
      chapterTitle: q.chapterTitle,
      subject: q.subject,
      subjectSlug: q.subjectSlug,
      correct: 0,
      total: 0,
      verdict: 'a_revoir' as ExamVerdict,
    }
    r.total += 1
    if (goodById.get(q.id) === true) r.correct += 1
    byKey.set(key, r)
  }
  const reports = [...byKey.values()].map((r) => ({
    ...r,
    verdict: verdictFor(r.total > 0 ? r.correct / r.total : 0),
  }))
  // Les chapitres à revoir d'abord : c'est le plan de travail qui sort du bilan.
  const order: Record<ExamVerdict, number> = {
    a_revoir: 0,
    fragile: 1,
    solide: 2,
  }
  return reports.sort(
    (a, b) =>
      order[a.verdict] - order[b.verdict] || a.subject.localeCompare(b.subject),
  )
}
