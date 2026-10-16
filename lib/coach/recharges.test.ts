import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RECHARGES, enPeriodeExamens, prixParQuestion, rechargeParId, rechargesDansLOrdre } from './recharges'

describe('les recharges de Marcel', () => {
  it('coûtent de moins en moins cher la question', () => {
    const parCredit = RECHARGES.map((r) => r.prixEuros / r.credits)
    expect([...parCredit].sort((a, b) => b - a)).toEqual(parCredit)
    expect(prixParQuestion(RECHARGES[0])).toBe('4 centimes la question')
  })

  it('mettent le Pack examens en tête au printemps et en janvier', () => {
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 4, 20)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 3, 14)))).toBe(false)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 3, 15)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2027, 0, 8)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 9, 15)))).toBe(false)
    expect(rechargesDansLOrdre(new Date(Date.UTC(2026, 5, 2)))[0].id).toBe('examens')
    expect(rechargesDansLOrdre(new Date(Date.UTC(2026, 9, 2)))[0].id).toBe('coup-de-pouce')
  })

  it('retrouve une recharge par son id', () => {
    expect(rechargeParId('semaine')?.credits).toBe(150)
    expect(rechargeParId('inconnue')).toBeNull()
  })

  it('est le miroir du seed de la migration 581', () => {
    const sql = readFileSync(join(process.cwd(), 'supabase/schema/581_marcel_recharges_usage.sql'), 'utf8')
    for (const r of RECHARGES) {
      expect(sql).toContain(`('${r.id}', '${r.titre}', ${r.credits}, ${r.prixEuros.toFixed(2)}`)
    }
  })
})
