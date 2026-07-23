import { describe, expect, it } from 'vitest'
import type { Subject, SubjectCategory } from '@/lib/types'
import {
  folderOf,
  folderStorageKey,
  isCollegeLevel,
  resolveOpenState,
  subjectFolders,
} from '@/lib/reviser-folders'

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

describe('isCollegeLevel', () => {
  it('couvre la 6e à la 3e, et rien d’autre', () => {
    for (const g of ['6e', '5e', '4e', '3e']) expect(isCollegeLevel(g)).toBe(true)
    for (const g of ['2de', '1re', 'Tle']) expect(isCollegeLevel(g)).toBe(false)
  })
})

describe('folderOf', () => {
  it('envoie la culture générale hors programme et le reste dans le programme', () => {
    expect(folderOf(sub('economie', 'culture'))).toBe('hors-programme')
    expect(folderOf(sub('maths', 'specialite'))).toBe('programme')
    expect(folderOf(sub('francais', 'tronc_commun'))).toBe('programme')
    expect(folderOf(sub('techno', 'college'))).toBe('programme')
    expect(folderOf(sub('latin', 'option'))).toBe('programme')
  })
})

describe('subjectFolders — collège', () => {
  const programme = [
    sub('maths', 'specialite'),
    sub('francais', 'tronc_commun'),
    sub('techno', 'college'),
  ]
  const culture = [sub('economie', 'culture'), sub('fiscalite', 'culture')]
  const folders = subjectFolders({
    programmeSubjects: programme,
    cultureSubjects: culture,
    grade: '6e',
  })

  it('rend deux dossiers, le programme d’abord', () => {
    expect(folders.map((f) => f.id)).toEqual(['programme', 'hors-programme'])
  })

  it('ne découpe pas le collège en spécialités et options', () => {
    const prog = folders[0]
    expect(prog.groups).toHaveLength(1)
    expect(prog.groups[0].label).toBeNull()
    expect(prog.groups[0].items).toHaveLength(3)
  })

  it('ouvre le programme et ferme le hors-programme par défaut', () => {
    expect(folders[0].defaultOpen).toBe(true)
    expect(folders[1].defaultOpen).toBe(false)
  })

  it('compte les matières de chaque dossier', () => {
    expect(folders[0].count).toBe(3)
    expect(folders[1].count).toBe(2)
  })

  it('nomme la classe dans l’indice du dossier programme', () => {
    expect(folders[0].hint).toContain('6e')
  })
})

describe('subjectFolders — lycée', () => {
  const programme = [
    sub('francais', 'tronc_commun', ['1re']),
    sub('maths', 'specialite', ['1re']),
    sub('nsi', 'specialite', ['1re']),
    sub('latin', 'option', ['1re']),
  ]
  const folders = subjectFolders({
    programmeSubjects: programme,
    cultureSubjects: [],
    grade: '1re',
  })

  it('garde les sous-groupes tronc commun / spécialités / options', () => {
    expect(folders[0].groups.map((g) => g.label)).toEqual([
      'Tronc commun',
      'Spécialités',
      'Options',
    ])
    expect(folders[0].groups[1].items).toHaveLength(2)
  })

  it('n’affiche pas un sous-groupe vide', () => {
    const f = subjectFolders({
      programmeSubjects: [sub('francais', 'tronc_commun', ['2de'])],
      cultureSubjects: [],
      grade: '2de',
    })
    expect(f[0].groups.map((g) => g.label)).toEqual(['Tronc commun'])
  })

  it('ne perd jamais une matière dont la catégorie sort des sous-groupes', () => {
    // Une matière « college » qui traînerait sur un niveau lycée n'entre dans
    // aucun des trois sous-groupes : sans filet, elle disparaissait de l'écran.
    const orpheline = sub('techno', 'college', ['2de'])
    const f = subjectFolders({
      programmeSubjects: [sub('francais', 'tronc_commun', ['2de']), orpheline],
      cultureSubjects: [],
      grade: '2de',
    })
    const all = f[0].groups.flatMap((g) => g.items)
    expect(all).toContain(orpheline)
    expect(f[0].groups.at(-1)?.label).toBe('Autres matières')
  })
})

describe('subjectFolders — dossiers vides', () => {
  it('n’ouvre pas un dossier sur rien', () => {
    expect(
      subjectFolders({
        programmeSubjects: [],
        cultureSubjects: [sub('economie', 'culture')],
        grade: '6e',
      }).map((f) => f.id),
    ).toEqual(['hors-programme'])

    expect(
      subjectFolders({
        programmeSubjects: [sub('maths', 'specialite')],
        cultureSubjects: [],
        grade: '6e',
      }).map((f) => f.id),
    ).toEqual(['programme'])

    expect(
      subjectFolders({
        programmeSubjects: [],
        cultureSubjects: [],
        grade: '6e',
      }),
    ).toEqual([])
  })
})

describe('mémorisation ouvert/fermé', () => {
  const folders = subjectFolders({
    programmeSubjects: [sub('maths', 'specialite')],
    cultureSubjects: [sub('economie', 'culture')],
    grade: '6e',
  })
  const [programme, hors] = folders

  it('donne une clé de stockage distincte par dossier', () => {
    expect(folderStorageKey('programme')).not.toBe(
      folderStorageKey('hors-programme'),
    )
  })

  it('respecte le choix mémorisé de l’élève', () => {
    expect(resolveOpenState(programme, 'closed')).toBe(false)
    expect(resolveOpenState(hors, 'open')).toBe(true)
  })

  it('retombe sur le défaut sans choix mémorisé', () => {
    expect(resolveOpenState(programme, null)).toBe(true)
    expect(resolveOpenState(hors, null)).toBe(false)
  })

  it('ignore une valeur de stockage corrompue', () => {
    expect(resolveOpenState(programme, 'oui')).toBe(true)
    expect(resolveOpenState(hors, '')).toBe(false)
  })
})
