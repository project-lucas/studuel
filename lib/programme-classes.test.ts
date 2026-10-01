import { describe, expect, it } from 'vitest'
import { GRADE_LEVELS } from '@/lib/types'
import {
  PROGRAMME_PAR_CLASSE,
  estDansLaClasse,
  programmeDeClasse,
  titreAChoisir,
} from '@/lib/programme-classes'

const CULTURE = ['economie', 'entrepreneuriat', 'figures-historiques', 'finances-personnelles', 'fiscalite']
const tout = (g: keyof typeof PROGRAMME_PAR_CLASSE) => [
  ...PROGRAMME_PAR_CLASSE[g].obligatoires,
  ...PROGRAMME_PAR_CLASSE[g].aChoisir,
]

describe('PROGRAMME_PAR_CLASSE', () => {
  it('couvre chaque classe, sans matière à la fois obligatoire et à choisir', () => {
    for (const g of GRADE_LEVELS) {
      const p = PROGRAMME_PAR_CLASSE[g]
      expect(p, g).toBeDefined()
      expect(p.obligatoires.filter((s) => p.aChoisir.includes(s)), g).toEqual([])
      expect(new Set(tout(g)).size, g).toBe(tout(g).length)
    }
  })

  it('ne propose jamais la culture générale', () => {
    for (const g of GRADE_LEVELS) {
      expect(tout(g).filter((s) => CULTURE.includes(s)), g).toEqual([])
    }
  })

  it('ne propose ni arts plastiques ni musique au lycée', () => {
    for (const g of ['2de', '1re', '1re techno', 'Tle', 'Tle techno'] as const) {
      for (const s of ['arts-plastiques', 'musique']) {
        expect(tout(g), `${g} ${s}`).not.toContain(s)
      }
      for (const s of ['latin', 'grec']) {
        expect(PROGRAMME_PAR_CLASSE[g].obligatoires, `${g} ${s}`).not.toContain(s)
      }
    }
  })

  it('range les spécialités en « à choisir » en 1re et Tle générales', () => {
    for (const g of ['1re', 'Tle'] as const) {
      for (const s of ['maths', 'physique-chimie', 'svt', 'ses', 'nsi', 'hggsp']) {
        expect(PROGRAMME_PAR_CLASSE[g].aChoisir, `${g} ${s}`).toContain(s)
      }
    }
  })

  it('met la LV2 en choix et l’anglais d’office', () => {
    for (const g of GRADE_LEVELS) {
      expect(PROGRAMME_PAR_CLASSE[g].obligatoires, g).toContain('anglais')
      expect(PROGRAMME_PAR_CLASSE[g].obligatoires, g).not.toContain('allemand')
      expect(PROGRAMME_PAR_CLASSE[g].obligatoires, g).not.toContain('espagnol')
    }
  })

  it('suit les repères officiels', () => {
    // Le Grand oral : Terminale seulement.
    expect(tout('1re')).not.toContain('grand-oral')
    expect(tout('1re techno')).not.toContain('grand-oral')
    expect(PROGRAMME_PAR_CLASSE.Tle.obligatoires).toContain('grand-oral')
    // Plus de technologie en 6e depuis la rentrée 2023.
    expect(tout('6e')).not.toContain('technologie')
    expect(PROGRAMME_PAR_CLASSE['5e'].obligatoires).toContain('technologie')
    // Pas de philosophie avant la Terminale, pas de français en Terminale.
    expect(tout('1re')).not.toContain('philosophie')
    expect(tout('Tle')).not.toContain('francais')
    // Pas d'histoire-géo en cycle 2.
    expect(tout('CE2')).not.toContain('histoire-geo')
    // Les maths sont au tronc commun de la voie technologique — les siennes
    // (migration 383), comme sa philosophie.
    expect(PROGRAMME_PAR_CLASSE['Tle techno'].obligatoires).toContain('maths-techno')
    expect(PROGRAMME_PAR_CLASSE['Tle techno'].obligatoires).toContain('philosophie-techno')
  })
})

describe('programmeDeClasse', () => {
  it('rend null sans classe connue', () => {
    expect(programmeDeClasse(null)).toBeNull()
    expect(programmeDeClasse('Master')).toBeNull()
    expect(programmeDeClasse('4e')?.obligatoires).toContain('technologie')
  })
})

describe('estDansLaClasse', () => {
  const m = (slug: string, category: string, levels: string[]) => ({ slug, category, levels })

  it('écarte une matière hors programme même si la base la rattache à la classe', () => {
    expect(estDansLaClasse(m('arts-plastiques', 'option', ['4e', 'Tle']), 'Tle')).toBe(false)
    expect(estDansLaClasse(m('musique', 'option', ['Tle']), 'Tle')).toBe(false)
    expect(estDansLaClasse(m('grand-oral', 'tronc_commun', ['1re', 'Tle']), '1re')).toBe(false)
    expect(estDansLaClasse(m('arts-plastiques', 'option', ['4e', 'Tle']), '4e')).toBe(true)
  })

  it('garde la culture générale et exige du contenu au niveau', () => {
    expect(estDansLaClasse(m('fiscalite', 'culture', ['Tle']), 'Tle')).toBe(true)
    expect(estDansLaClasse(m('philosophie', 'tronc_commun', ['Tle techno']), 'Tle')).toBe(false)
    expect(estDansLaClasse(m('philosophie', 'tronc_commun', ['Tle']), 'Tle')).toBe(true)
  })
})

describe('titreAChoisir', () => {
  it('parle de spécialités au lycée général seulement', () => {
    expect(titreAChoisir('Tle')).toBe('Tes spécialités et options')
    expect(titreAChoisir('4e')).toBe('Langues et options')
  })
})
