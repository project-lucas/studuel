import { describe, it, expect } from 'vitest'
import { subjectsWithContent, emptySubjectCount } from '@/lib/subject-visibility'

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
