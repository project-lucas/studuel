import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FILIERES, estFiliere, filiere, prepaPourClasse } from './catalogue'

describe('la prépa du supérieur', () => {
  it('propose huit filières, chacune avec au moins cinq modules', () => {
    expect(FILIERES).toHaveLength(8)
    for (const f of FILIERES) {
      expect(f.modules.length).toBeGreaterThanOrEqual(5)
      expect(f.nom.length).toBeGreaterThan(2)
    }
  })

  it('n’a aucune filière violette (le violet est l’action)', () => {
    expect(FILIERES.map((f) => f.teinte)).not.toContain('violet')
    const palette = ['bleu', 'vert', 'corail', 'rose', 'ambre', 'turquoise', 'indigo']
    for (const f of FILIERES) expect(palette).toContain(f.teinte)
  })

  it('s’ouvre au lycée qui choisit son orientation', () => {
    expect(prepaPourClasse('Tle')).toBe(true)
    expect(prepaPourClasse('1re techno')).toBe(true)
    expect(prepaPourClasse('3e')).toBe(false)
    expect(prepaPourClasse(null)).toBe(false)
  })

  it('reconnaît une filière', () => {
    expect(filiere('droit')?.nom).toBe('Droit')
    expect(estFiliere('sante')).toBe(true)
    expect(estFiliere('astrologie')).toBe(false)
  })

  it('est le miroir de la liste blanche de la migration 582', () => {
    const sql = readFileSync(join(process.cwd(), 'supabase/schema/582_prepa_sup_interet.sql'), 'utf8')
    const liste = sql.match(/piste IN \(([^)]+)\)/)?.[1] ?? ''
    expect(liste.split(',').map((s) => s.trim().replace(/'/g, '')).sort()).toEqual(FILIERES.map((f) => f.id).sort())
  })
})
