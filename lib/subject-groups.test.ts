import { describe, expect, it } from 'vitest'
import type { Subject, SubjectCategory } from '@/lib/types'
import { programmeGroups, usesTrackGroups } from '@/lib/subject-groups'

let seq = 0
function sub(
  slug: string,
  category: SubjectCategory,
  levels: string[] = ['6e'],
): Subject {
  seq += 1
  return {
    id: `id-${seq}`,
    slug,
    name: slug,
    icon: '📘',
    color: 'blue',
    category,
    levels,
  }
}

describe('usesTrackGroups', () => {
  it('ne sous-groupe ni au primaire ni dans la voie technologique', () => {
    // La techno a des spécialités, mais elles dépendent de sa série (STMG,
    // STI2D…) que le profil ne demande pas encore : le catalogue ne lui en
    // déclare aucune. La sous-grouper afficherait « Tronc commun » seul,
    // au-dessus de deux sections vides.
    for (const g of ['CP', 'CM2', '1re techno', 'Tle techno']) {
      expect(usesTrackGroups(g), g).toBe(false)
    }
  })

  it('ne sous-groupe qu’en 1re et Terminale (pas de spécialités avant)', () => {
    for (const g of ['1re', 'Tle']) expect(usesTrackGroups(g)).toBe(true)
    for (const g of ['6e', '5e', '4e', '3e', '2de']) {
      expect(usesTrackGroups(g)).toBe(false)
    }
  })
})

describe('programmeGroups — collège', () => {
  const groups = programmeGroups({
    subjects: [
      sub('maths', 'specialite'),
      sub('francais', 'tronc_commun'),
      sub('techno', 'college'),
    ],
    grade: '6e',
  })

  it('ne découpe pas le collège en spécialités et options', () => {
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBeNull()
    expect(groups[0].items).toHaveLength(3)
  })
})

describe('programmeGroups — lycée', () => {
  const groups = programmeGroups({
    subjects: [
      sub('francais', 'tronc_commun', ['1re']),
      sub('maths', 'specialite', ['1re']),
      sub('nsi', 'specialite', ['1re']),
      sub('latin', 'option', ['1re']),
    ],
    grade: '1re',
  })

  it('garde les sous-groupes tronc commun / spécialités / options', () => {
    expect(groups.map((g) => g.label)).toEqual([
      'Tronc commun',
      'Spécialités',
      'Options',
    ])
    expect(groups[1].items).toHaveLength(2)
  })

  it('n’affiche pas un sous-groupe vide', () => {
    const g = programmeGroups({
      subjects: [sub('francais', 'tronc_commun', ['1re'])],
      grade: '1re',
    })
    expect(g.map((x) => x.label)).toEqual(['Tronc commun'])
  })

  it('ne perd jamais une matière dont la catégorie sort des sous-groupes', () => {
    // Une matière « college » qui traînerait sur un niveau à sous-groupes n'entre
    // dans aucun des trois : sans filet, elle disparaissait de l'écran.
    const orpheline = sub('techno', 'college', ['1re'])
    const g = programmeGroups({
      subjects: [sub('francais', 'tronc_commun', ['1re']), orpheline],
      grade: '1re',
    })
    expect(g.flatMap((x) => x.items)).toContain(orpheline)
    expect(g.at(-1)?.label).toBe('Autres matières')
  })
})

describe('programmeGroups — seconde', () => {
  it('range la 2de en grille unique, sans section « Spécialités »', () => {
    // La 2de n'a pas de spécialités : Maths (marquée `specialite` car elle le
    // devient au cycle terminal) ne doit PAS créer de sous-groupe « Spécialités »
    // — tout le tronc commun de seconde vit dans une seule grille.
    const groups = programmeGroups({
      subjects: [
        sub('francais', 'tronc_commun', ['2de']),
        sub('maths', 'specialite', ['2de']),
        sub('svt', 'specialite', ['2de']),
      ],
      grade: '2de',
    })
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBeNull()
    expect(groups[0].items).toHaveLength(3)
  })

  it('ne rend aucun groupe sans matière', () => {
    expect(programmeGroups({ subjects: [], grade: '2de' })).toEqual([])
  })
})
