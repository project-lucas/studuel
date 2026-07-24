import { describe, expect, it } from 'vitest'
import type { Subject, SubjectCategory } from '@/lib/types'
import {
  folderCountLabel,
  folderOf,
  folderProgress,
  folderStorageKey,
  folderSubjects,
  isCollegeLevel,
  resolveOpenState,
  subjectFolders,
  usesTrackGroups,
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

describe('usesTrackGroups', () => {
  it('ne sous-groupe qu’en 1re et Terminale (pas de spécialités avant)', () => {
    for (const g of ['1re', 'Tle']) expect(usesTrackGroups(g)).toBe(true)
    for (const g of ['6e', '5e', '4e', '3e', '2de']) {
      expect(usesTrackGroups(g)).toBe(false)
    }
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
      programmeSubjects: [sub('francais', 'tronc_commun', ['1re'])],
      cultureSubjects: [],
      grade: '1re',
    })
    expect(f[0].groups.map((g) => g.label)).toEqual(['Tronc commun'])
  })

  it('ne perd jamais une matière dont la catégorie sort des sous-groupes', () => {
    // Une matière « college » qui traînerait sur un niveau à sous-groupes n'entre
    // dans aucun des trois : sans filet, elle disparaissait de l'écran.
    const orpheline = sub('techno', 'college', ['1re'])
    const f = subjectFolders({
      programmeSubjects: [sub('francais', 'tronc_commun', ['1re']), orpheline],
      cultureSubjects: [],
      grade: '1re',
    })
    const all = f[0].groups.flatMap((g) => g.items)
    expect(all).toContain(orpheline)
    expect(f[0].groups.at(-1)?.label).toBe('Autres matières')
  })
})

describe('subjectFolders — seconde', () => {
  it('range la 2de en grille unique, sans section « Spécialités »', () => {
    // La 2de n'a pas de spécialités : Maths (marquée `specialite` car elle le
    // devient au cycle terminal) ne doit PAS créer de sous-groupe « Spécialités »
    // — tout le tronc commun de seconde vit dans une seule grille.
    const f = subjectFolders({
      programmeSubjects: [
        sub('francais', 'tronc_commun', ['2de']),
        sub('maths', 'specialite', ['2de']),
        sub('svt', 'specialite', ['2de']),
      ],
      cultureSubjects: [],
      grade: '2de',
    })
    expect(f[0].groups).toHaveLength(1)
    expect(f[0].groups[0].label).toBeNull()
    expect(f[0].groups[0].items).toHaveLength(3)
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

describe('libellé de comptage', () => {
  it('accole l’unité au nombre, accordée en nombre', () => {
    expect(folderCountLabel({ count: 6, unit: 'matières' })).toBe('6 matières')
    expect(folderCountLabel({ count: 5, unit: 'modules' })).toBe('5 modules')
    expect(folderCountLabel({ count: 1, unit: 'matières' })).toBe('1 matière')
    expect(folderCountLabel({ count: 1, unit: 'modules' })).toBe('1 module')
    expect(folderCountLabel({ count: 0, unit: 'matières' })).toBe('0 matières')
  })

  it('donne « matières » au programme et « modules » à la culture générale', () => {
    const folders = subjectFolders({
      programmeSubjects: [sub('maths', 'tronc_commun')],
      cultureSubjects: [sub('economie', 'culture')],
      grade: '6e',
    })
    expect(folders[0].unit).toBe('matières')
    expect(folders[1].unit).toBe('modules')
  })
})

describe('avancement d’un dossier', () => {
  const [programme] = subjectFolders({
    programmeSubjects: [sub('maths', 'tronc_commun'), sub('francais', 'tronc_commun')],
    cultureSubjects: [],
    grade: '6e',
  })

  it('liste les matières du dossier, groupes confondus', () => {
    expect(folderSubjects(programme).map((s) => s.slug)).toEqual([
      'maths',
      'francais',
    ])
  })

  it('fait la moyenne des pourcentages de ses matières', () => {
    expect(folderProgress(programme, { maths: 80, francais: 20 })).toBe(50)
  })

  it('compte une matière sans avancement comme 0 %', () => {
    expect(folderProgress(programme, { maths: 50 })).toBe(25)
  })

  it('renvoie null pour un dossier vide (et non 0 %)', () => {
    const vide = { ...programme, groups: [] }
    expect(folderProgress(vide, {})).toBeNull()
  })
})
