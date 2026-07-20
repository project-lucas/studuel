// -----------------------------------------------------------------------------
// « Ta trajectoire au bac » — logique pure, testable.
//
// Deux futurs possibles à partir des moyennes de trimestre :
//   T1/T2 : moyennes RÉELLES — calculées depuis les notes saisies
//           (school_grades → lib/notes.ts) en priorité, sinon la moyenne
//           trimestrielle tapée à la main (term_grades, migration 187).
//   T3    : deux projections —
//           « sans changement » : plate, la dernière moyenne connue ;
//           « avec leviers »    : + uplift dérivé de l'écart de capacité
//                                 (capacité → plafond, lib/capacite-drivers.ts).
//
// Projection PRUDENTE et transparente (modale « Comment c'est calculé ? ») :
//   uplift = (plafond − capacité) × 0,1 point de moyenne, plafonné à +2 pts.
// Un point de capacité regagné ≈ 0,1 point de moyenne — jamais plus de +2.
// -----------------------------------------------------------------------------

import type { Trimestre, TrimestreSummary } from '@/lib/notes'

// Bornes de la projection : jamais plus de +2 pts, jamais au-dessus de 20.
export const MAX_UPLIFT = 2
export const UPLIFT_PER_CAPACITY_POINT = 0.1
const MAX_AVERAGE = 20

const round1 = (n: number): number => Math.round(n * 10) / 10

// Moyenne trimestrielle saisie à la main (ligne de term_grades).
export type TermGrade = { term: Trimestre; average: number }

// Valide les lignes brutes de term_grades pour UNE année scolaire (année civile
// de la rentrée, convention lib/notes.ts). Bornes identiques aux CHECK SQL.
export function normalizeTermGrades(
  raw: unknown,
  schoolYear: number,
): TermGrade[] {
  if (!Array.isArray(raw)) return []
  const out: TermGrade[] = []
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue
    const o = row as Record<string, unknown>
    const year = Number(o.school_year)
    const term = Number(o.term)
    const average = Number(o.average)
    if (year !== schoolYear) continue
    if (term !== 1 && term !== 2 && term !== 3) continue
    if (!Number.isFinite(average) || average < 0 || average > MAX_AVERAGE) continue
    out.push({ term: term as Trimestre, average })
  }
  return out
}

export type TermPoint = {
  t: Trimestre
  avg: number | null // moyenne /20 retenue pour ce trimestre
  source: 'notes' | 'manuel' | null // d'où elle vient (null = trimestre vide)
}

// Fusionne les deux sources : la moyenne CALCULÉE depuis les notes réelles
// gagne toujours ; la saisie manuelle ne comble que les trimestres vides.
export function mergeTermAverages(
  computed: readonly TrimestreSummary[],
  manual: readonly TermGrade[],
): TermPoint[] {
  return ([1, 2, 3] as const).map((t) => {
    const fromNotes = computed.find((s) => s.t === t)
    if (fromNotes && fromNotes.avg !== null) {
      return { t, avg: round1(fromNotes.avg), source: 'notes' }
    }
    const fromManual = manual.find((m) => m.term === t)
    if (fromManual) return { t, avg: round1(fromManual.average), source: 'manuel' }
    return { t, avg: null, source: null }
  })
}

export type BacTrajectory = {
  terms: TermPoint[] // T1 → T3, moyennes retenues
  hasData: boolean // au moins un trimestre renseigné
  // Projections T3 (null si aucune donnée, ou si le T3 est déjà noté).
  sansChangement: number | null
  avecLeviers: number | null // null aussi quand la capacité est inconnue
  uplift: number | null // le « +N pts » du badge
}

// La trajectoire complète. `capacite`/`plafond` viennent de
// lib/capacite-drivers.ts (null si l'élève n'a encore rien suivi).
export function computeBacTrajectory(
  terms: readonly TermPoint[],
  capacite: number | null,
  plafond: number | null,
): BacTrajectory {
  const known = terms.filter((p) => p.avg !== null)
  const t3 = terms.find((p) => p.t === 3)
  const hasData = known.length > 0

  // Rien à projeter : aucune moyenne, ou l'année est déjà finie (T3 noté).
  if (!hasData || (t3 && t3.avg !== null)) {
    return {
      terms: [...terms],
      hasData,
      sansChangement: null,
      avecLeviers: null,
      uplift: null,
    }
  }

  // « Sans changement » : la dernière moyenne connue, à plat.
  const base = known[known.length - 1].avg as number
  const sansChangement = round1(base)

  if (capacite === null || plafond === null) {
    return { terms: [...terms], hasData, sansChangement, avecLeviers: null, uplift: null }
  }

  const uplift = round1(
    Math.min(MAX_UPLIFT, Math.max(0, (plafond - capacite) * UPLIFT_PER_CAPACITY_POINT)),
  )
  const avecLeviers = round1(Math.min(MAX_AVERAGE, base + uplift))

  return { terms: [...terms], hasData, sansChangement, avecLeviers, uplift }
}
