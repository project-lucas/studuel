import { describe, it, expect } from 'vitest'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'
import {
  GRADE_CYCLES,
  GRADE_FULL_LABELS,
  GRADE_SHORT_LABELS,
  contentLevelFor,
  cycleOf,
  gradeLabel,
  isGradeLevel,
  isTechno,
} from '@/lib/grades'

describe('les cycles couvrent toutes les classes', () => {
  it('range chaque classe une fois et une seule, dans l’ordre scolaire', () => {
    // Le filet qui compte : ajouter une classe à GRADE_LEVELS sans la ranger
    // dans un cycle la ferait disparaître du menu « Ma classe » — en silence.
    const ranged = GRADE_CYCLES.flatMap((c) => c.grades)
    expect(ranged).toEqual([...GRADE_LEVELS])
  })

  it('donne son cycle à chaque classe', () => {
    expect(cycleOf('CP')).toBe('primaire')
    expect(cycleOf('CM2')).toBe('primaire')
    expect(cycleOf('6e')).toBe('college')
    expect(cycleOf('3e')).toBe('college')
    expect(cycleOf('2de')).toBe('lycee')
    expect(cycleOf('Tle techno')).toBe('lycee')
  })

  it('retombe sur le collège quand la classe est inconnue ou absente', () => {
    expect(cycleOf(null)).toBe('college')
    expect(cycleOf(undefined)).toBe('college')
    expect(cycleOf('')).toBe('college')
    expect(cycleOf('MPSI')).toBe('college')
  })
})

describe('la voie technologique', () => {
  it('reconnaît les deux classes techno, et elles seules', () => {
    expect(isTechno('1re techno')).toBe(true)
    expect(isTechno('Tle techno')).toBe(true)
    for (const g of ['1re', 'Tle', '2de', '3e', 'CP', null, undefined]) {
      expect(isTechno(g), String(g)).toBe(false)
    }
  })

  it('replie le contenu techno sur son niveau général', () => {
    // Le tronc commun de la techno EST celui du général, et il est rangé en
    // base au niveau général. Sans ce repli, l'élève ouvre une app vide.
    expect(contentLevelFor('1re techno')).toBe('1re')
    expect(contentLevelFor('Tle techno')).toBe('Tle')
  })

  it('laisse toutes les autres classes intactes', () => {
    for (const g of GRADE_LEVELS) {
      if (g === '1re techno' || g === 'Tle techno') continue
      expect(contentLevelFor(g), g).toBe(g)
    }
  })

  it('ne fabrique pas de niveau à partir de rien', () => {
    expect(contentLevelFor(null)).toBe('')
    expect(contentLevelFor(undefined)).toBe('')
  })

  it('n’aliase PAS le primaire (son contenu lui est propre)', () => {
    for (const g of ['CP', 'CE1', 'CE2', 'CM1', 'CM2']) {
      expect(contentLevelFor(g), g).toBe(g)
    }
  })
})

describe('écriture des classes', () => {
  it('nomme chaque classe, en long comme en court', () => {
    for (const g of GRADE_LEVELS) {
      expect(GRADE_FULL_LABELS[g], g).toBeTruthy()
      expect(GRADE_SHORT_LABELS[g], g).toBeTruthy()
    }
  })

  it('ne laisse jamais « Tle » à l’écran : ça ne se prononce pas', () => {
    expect(GRADE_FULL_LABELS.Tle).toBe('Terminale')
    expect(GRADE_SHORT_LABELS.Tle).toBe('Terminale')
    expect(GRADE_SHORT_LABELS['Tle techno']).toBe('Terminale techno')
  })

  it('dit toujours la voie : une techno n’est pas une générale', () => {
    for (const g of ['1re techno', 'Tle techno'] as GradeLevel[]) {
      expect(GRADE_FULL_LABELS[g]).toContain('techno')
      expect(GRADE_SHORT_LABELS[g]).toContain('techno')
    }
  })

  it('ne nomme pas une classe qui n’existe pas', () => {
    expect(gradeLabel('MPSI')).toBeNull()
    expect(gradeLabel(null)).toBeNull()
    expect(gradeLabel('Tle')).toBe('Terminale')
  })

  it('reconnaît une classe valide', () => {
    expect(isGradeLevel('1re techno')).toBe(true)
    expect(isGradeLevel('1re Techno')).toBe(false)
    expect(isGradeLevel(42)).toBe(false)
  })
})
