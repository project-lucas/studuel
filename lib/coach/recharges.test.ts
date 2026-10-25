import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RECHARGES, enPeriodeExamens, prixParCafe, prixParQuestion, rechargeParId, rechargesDansLOrdre } from './recharges'

describe('le café de Marcel (les recharges)', () => {
  it('coûte de moins en moins cher le café', () => {
    const parCafe = RECHARGES.map((r) => r.prixEuros / r.credits)
    expect([...parCafe].sort((a, b) => b - a)).toEqual(parCafe)
    expect(prixParCafe(RECHARGES[0])).toBe('4 centimes le café')
    expect(prixParQuestion).toBe(prixParCafe)
  })

  it('se vend en trois formats : Dosette · Grande tasse · Thermos', () => {
    expect(RECHARGES.map((r) => [r.titre, r.credits])).toEqual([
      ['Dosette', 50],
      ['Grande tasse', 150],
      ['Thermos', 400],
    ])
    for (const r of RECHARGES) expect(`${r.titre} ${r.accroche}`).not.toMatch(/cr[ée]dit|jeton/i)
  })

  it('a son objet dessiné sur le disque', () => {
    for (const r of RECHARGES) {
      expect(existsSync(join(process.cwd(), 'public', 'images', 'marcel', 'cafe', `${r.objet}.webp`)), r.id).toBe(true)
    }
    expect(existsSync(join(process.cwd(), 'public', 'images', 'marcel', 'cafe', 'dosette.webp'))).toBe(true)
  })

  it('met le Thermos en tête au printemps et en janvier', () => {
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 4, 20)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 3, 14)))).toBe(false)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 3, 15)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2027, 0, 8)))).toBe(true)
    expect(enPeriodeExamens(new Date(Date.UTC(2026, 9, 15)))).toBe(false)
    expect(rechargesDansLOrdre(new Date(Date.UTC(2026, 5, 2)))[0].id).toBe('examens')
    expect(rechargesDansLOrdre(new Date(Date.UTC(2026, 9, 2)))[0].id).toBe('coup-de-pouce')
  })

  it('retrouve un format par son id', () => {
    expect(rechargeParId('semaine')?.credits).toBe(150)
    expect(rechargeParId('inconnue')).toBeNull()
  })

  it('est le miroir du seed de la migration 581 (id, quantité, prix — le nom SQL reste l’ancien)', () => {
    const sql = readFileSync(join(process.cwd(), 'supabase/schema/581_marcel_recharges_usage.sql'), 'utf8')
    for (const r of RECHARGES) {
      expect(sql).toMatch(new RegExp(`\\('${r.id}', '[^']+', ${r.credits}, ${r.prixEuros.toFixed(2)}`))
    }
  })
})
