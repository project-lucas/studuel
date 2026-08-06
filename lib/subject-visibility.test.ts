import { describe, it, expect } from 'vitest'
import {
  subjectsWithContent,
  emptySubjectCount,
  subjectsWithContentAt,
} from '@/lib/subject-visibility'

const S = (id: string) => ({ id, slug: id, name: id })
const C = (subject_id: string) => ({ subject_id })

describe('subjectsWithContent', () => {
  it('garde les matières qui ont au moins un chapitre', () => {
    const subjects = [S('maths'), S('snt'), S('francais')]
    const chapters = [C('maths'), C('maths'), C('francais')]

    const visibles = subjectsWithContent(subjects, chapters)

    expect(visibles.map((s) => s.id)).toEqual(['maths', 'francais'])
  })

  it('masque une matière ajoutée par la 193 sans contenu (snt)', () => {
    const subjects = [S('maths'), S('snt')]
    const chapters = [C('maths')]

    expect(subjectsWithContent(subjects, chapters).map((s) => s.id)).toEqual([
      'maths',
    ])
  })

  it('garde-fou : aucun chapitre → ne filtre pas (pas de grille vide)', () => {
    const subjects = [S('maths'), S('snt')]

    expect(subjectsWithContent(subjects, []).map((s) => s.id)).toEqual([
      'maths',
      'snt',
    ])
  })

  it('réapparition automatique dès qu’un chapitre est seedé', () => {
    const subjects = [S('musique')]
    expect(subjectsWithContent(subjects, [])).toHaveLength(1) // garde-fou
    // Avec un autre contenu mais rien pour musique → masquée.
    expect(subjectsWithContent(subjects, [C('maths')])).toHaveLength(0)
    // Un chapitre de musique arrive → visible.
    expect(subjectsWithContent(subjects, [C('musique')])).toHaveLength(1)
  })

  it('ne mute pas le tableau d’entrée', () => {
    const subjects = [S('maths'), S('snt')]
    const copie = [...subjects]
    subjectsWithContent(subjects, [C('maths')])
    expect(subjects).toEqual(copie)
  })

  it('emptySubjectCount compte les culs-de-sac', () => {
    const subjects = [S('maths'), S('snt'), S('grec')]
    expect(emptySubjectCount(subjects, [C('maths')])).toBe(2)
    expect(emptySubjectCount(subjects, [])).toBe(0) // garde-fou
  })
})

// --- Matières hors-niveau (fixed_level) --------------------------------------
// Le défaut mesuré le 2026-07-31 : cinq matières de « culture générale »
// (Économie, Fiscalité, Finances perso, Entrepreneuriat, Figures historiques)
// déclarent 6e→Tle et rangent leur contenu au niveau `tous`. Jugées au niveau
// de l'élève, elles paraissaient vides — masquées de Réviser et du plateau de
// la Traque pour TOUTES les classes, alors qu'elles ont du contenu.

describe('subjectsWithContentAt — le niveau fixe est respecté', () => {
  const MATHS = { id: 'm', fixed_level: null, levels: ['3e'] }
  const ECO = { id: 'e', fixed_level: 'tous', levels: ['6e', '3e', 'Tle'] }
  const VIDE = { id: 'v', fixed_level: null, levels: ['3e'] }
  const PAIRS: [string, string][] = [
    ['m', '3e'],
    ['e', 'tous'],
  ]

  it('garde une matière hors-niveau dont le contenu vit à son niveau fixe', () => {
    const kept = subjectsWithContentAt([MATHS, ECO, VIDE], PAIRS, '3e')
    expect(kept.map((s) => s.id)).toEqual(['m', 'e'])
  })

  it('la garde à TOUTES les classes, pas seulement celle qui l’a seedée', () => {
    for (const grade of ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']) {
      expect(
        subjectsWithContentAt([ECO], PAIRS, grade).map((s) => s.id),
        `classe ${grade}`,
      ).toEqual(['e'])
    }
  })

  it('écarte une matière hors-niveau dont le niveau fixe est vide', () => {
    const orphelin = { id: 'o', fixed_level: 'tous', levels: ['3e'] }
    expect(subjectsWithContentAt([orphelin], PAIRS, '3e')).toEqual([])
  })

  it('ne filtre rien sans aucune paire (cache froid) — jamais de grille vide', () => {
    expect(subjectsWithContentAt([MATHS, VIDE], [], '3e')).toHaveLength(2)
  })
})
