import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { adressePiste, cibleMusique, PISTES, type Demande } from './musique'

const d = (id: number, piste: Demande['piste'], boucle = true): Demande => ({ id, piste, boucle })
const base = { silenceForce: false, reglage: true, visible: true }

describe('cibleMusique — la dernière demande joue', () => {
  it('rien demandé : silence', () => {
    expect(cibleMusique({ ...base, pile: [] })).toBeNull()
  })

  it('le combat demandé par-dessus l’arène prend la main', () => {
    expect(cibleMusique({ ...base, pile: [d(1, 'arene'), d(2, 'combat')] })?.piste).toBe('combat')
  })

  it('une demande de silence (la défaite) tait tout', () => {
    expect(cibleMusique({ ...base, pile: [d(1, 'combat'), d(2, null)] })).toBeNull()
  })

  it('réglage coupé, app en arrière-plan ou blanc de l’entrée : silence', () => {
    const pile = [d(1, 'arene')]
    expect(cibleMusique({ ...base, pile, reglage: false })).toBeNull()
    expect(cibleMusique({ ...base, pile, visible: false })).toBeNull()
    expect(cibleMusique({ ...base, pile, silenceForce: true })).toBeNull()
  })
})

describe('les fichiers des musiques', () => {
  it('chaque piste est servie dans public/', () => {
    for (const p of PISTES) expect(existsSync(join(process.cwd(), 'public', adressePiste(p)))).toBe(true)
  })
})
