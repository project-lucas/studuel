import type { RevisionSubject, RevisionStatus, RevisionKind } from '@/lib/types'

// Entrée du plan de session : un élément à réviser, classé par urgence.
export type PlanEntry = {
  subjectName: string
  exam: string | null
  daysLeft: number | null
  itemTitle: string
  itemKind: RevisionKind
  status: RevisionStatus
}

const PRIORITY_WEIGHT = { critique: 0, prioritaire: 1, normale: 2 } as const
// « À revoir » passe avant « à faire » : on consolide avant d'ouvrir un front.
// (maitrise est exclu du plan mais gardé ici pour l'exhaustivité du type)
const STATUS_WEIGHT: Record<RevisionStatus, number> = {
  a_revoir: 0,
  a_faire: 1,
  en_cours: 2,
  maitrise: 3,
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const target = new Date(`${dateStr}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

// Classe tous les éléments non maîtrisés par urgence :
// priorité de la matière > statut > proximité de l'examen.
export function buildSessionPlan(
  subjects: RevisionSubject[],
  limit = 3,
): PlanEntry[] {
  const entries = subjects.flatMap((subject) => {
    const daysLeft = daysUntil(subject.exam_date)
    // Examen dans moins de 3 semaines : la matière gagne un cran d'urgence.
    const dateBoost = daysLeft !== null && daysLeft >= 0 && daysLeft <= 21 ? -1 : 0

    return subject.revision_items
      .filter((item) => item.status !== 'maitrise')
      .map((item) => ({
        entry: {
          subjectName: subject.name,
          exam: subject.exam,
          daysLeft,
          itemTitle: item.title,
          itemKind: item.kind,
          status: item.status,
        } satisfies PlanEntry,
        score:
          (PRIORITY_WEIGHT[subject.priority] + dateBoost) * 10 +
          STATUS_WEIGHT[item.status] +
          // Départage final : l'échéance la plus proche d'abord.
          (daysLeft !== null ? Math.min(daysLeft, 365) / 1000 : 0.5),
      }))
  })

  return entries
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((e) => e.entry)
}
