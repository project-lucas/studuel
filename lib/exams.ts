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
