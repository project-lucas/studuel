import type { Subject } from '@/lib/types'

// Épreuves officielles dérivées AUTOMATIQUEMENT du profil d'onboarding
// (classe + matières sélectionnées) — zéro configuration manuelle.

export type ExamSubject = {
  label: string // nom de l'épreuve (ex : « Brevet — Maths »)
  subject: Subject // matière du catalogue correspondante
}

// Matières du brevet (3e) — épreuves écrites officielles.
const BREVET_SLUGS: { slug: string; label: string }[] = [
  { slug: 'francais', label: 'Brevet — Français' },
  { slug: 'maths', label: 'Brevet — Maths' },
  { slug: 'histoire-geo', label: 'Brevet — Histoire-Géo' },
  { slug: 'svt', label: 'Brevet — Sciences (SVT)' },
  { slug: 'physique-chimie', label: 'Brevet — Sciences (Physique-Chimie)' },
]

export function examsForProfile(
  grade: string,
  selected: string[] | null,
  subjects: Subject[],
): ExamSubject[] {
  const bySlug = new Map(subjects.map((s) => [s.slug, s]))
  const isSelected = (slug: string) =>
    selected === null || selected.length === 0 || selected.includes(slug)

  // 3e : le brevet.
  if (grade === '3e') {
    return BREVET_SLUGS.flatMap(({ slug, label }) => {
      const subject = bySlug.get(slug)
      return subject ? [{ label, subject }] : []
    })
  }

  // 1re : le bac de français (écrit + oral, même programme).
  if (grade === '1re') {
    const subject = bySlug.get('francais')
    return subject
      ? [{ label: 'Bac de français — écrit & oral', subject }]
      : []
  }

  // Tle : philosophie (tronc commun) + les spécialités choisies à l'onboarding.
  if (grade === 'Tle') {
    const exams: ExamSubject[] = []
    const philo = bySlug.get('philosophie')
    if (philo) exams.push({ label: 'Bac — Philosophie', subject: philo })

    for (const s of subjects) {
      if (
        s.category === 'specialite' &&
        s.levels.includes('Tle') &&
        isSelected(s.slug)
      ) {
        exams.push({ label: `Bac — Spécialité ${s.name}`, subject: s })
      }
    }
    return exams
  }

  // 6e, 5e, 4e, 2de : pas d'examen officiel cette année.
  return []
}

// -----------------------------------------------------------------------------
// Objectif examen ADAPTATIF — un conseil qui s'ajuste à l'état réel de l'élève :
// où mettre l'effort en priorité (l'épreuve la plus en retard), ou un
// encouragement quand tout est déjà haut. Pur → testable. Prend la forme
// minimale des entrées d'ExamProgress pour ne pas coupler lib → composant.
// -----------------------------------------------------------------------------

// ≥ ce % global partout → on considère l'élève « prêt·e ».
export const EXAM_READY_PCT = 80
// < ce % sur l'épreuve la plus faible → priorité « démarrer ».
export const EXAM_START_PCT = 40

export type ExamReadiness = 'start' | 'focus' | 'ready'

export type ExamHint = {
  tone: ExamReadiness
  message: string
  focusLabel: string | null // épreuve à prioriser (null si « prêt·e »)
}

type ExamEntryLike = { label: string; progress: number; total: number }

// Conseil adaptatif à partir de la progression par épreuve. Null si aucune
// épreuve n'a de contenu mesurable (rien à conseiller).
export function examPriorityHint(entries: ExamEntryLike[]): ExamHint | null {
  const scored = entries.filter((e) => e.total > 0)
  if (scored.length === 0) return null

  // L'épreuve la plus en retard (progress le plus bas) — la première en cas
  // d'égalité, pour rester déterministe.
  const weakest = scored.reduce((min, e) => (e.progress < min.progress ? e : min))
  const weakestPct = Math.round(weakest.progress * 100)

  const totalUnits = scored.reduce((s, e) => s + e.total, 0)
  const globalPct = Math.round(
    (scored.reduce((s, e) => s + e.progress * e.total, 0) / totalUnits) * 100,
  )

  if (globalPct >= EXAM_READY_PCT) {
    return {
      tone: 'ready',
      message: 'Tu es prêt·e — garde le rythme et enchaîne un examen blanc.',
      focusLabel: null,
    }
  }
  if (weakestPct < EXAM_START_PCT) {
    return {
      tone: 'start',
      message: `Commence par ${weakest.label} — c'est là que tu as le plus à gagner.`,
      focusLabel: weakest.label,
    }
  }
  return {
    tone: 'focus',
    message: `Concentre-toi sur ${weakest.label} (${weakestPct} %) pour équilibrer ton objectif.`,
    focusLabel: weakest.label,
  }
}
