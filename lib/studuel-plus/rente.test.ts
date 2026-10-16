import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  FICHES_PAR_SEMAINE,
  RENTE_GEMMES_SEMAINE,
  RENTE_PLAFOND,
  SECONDES_PAR_GEMME,
  departApresRecolte,
  depuisInitial,
  dureeLisible,
  etatRente,
  phraseRente,
  promesseRente,
} from './rente'

const T0 = Date.UTC(2026, 9, 15, 8, 0, 0)
const S = 1000

describe('la rente de gemmes', () => {
  it('rapporte 60 gemmes par semaine, soit 2 fiches', () => {
    expect(RENTE_GEMMES_SEMAINE).toBe(60)
    expect(FICHES_PAR_SEMAINE).toBe(2)
    expect(SECONDES_PAR_GEMME).toBe(10_080)
    expect(promesseRente()).toBe('60 gemmes par semaine, soit 2 fiches de révision offertes')
  })

  it('pousse une gemme toutes les 2 h 48', () => {
    expect(etatRente(T0, T0).gemmes).toBe(0)
    expect(etatRente(T0, T0 + (SECONDES_PAR_GEMME - 1) * S).gemmes).toBe(0)
    expect(etatRente(T0, T0 + SECONDES_PAR_GEMME * S).gemmes).toBe(1)
    expect(etatRente(T0, T0 + 3.5 * 86_400 * S).gemmes).toBe(30)
  })

  it('plafonne le coffre à une semaine', () => {
    const e = etatRente(T0, T0 + 30 * 86_400 * S)
    expect(e.gemmes).toBe(RENTE_PLAFOND)
    expect(e.plein).toBe(true)
    expect(e.prochaineDansS).toBe(0)
    expect(e.remplissage).toBe(1)
    expect(e.fiches).toBe(2)
  })

  it('ne recule jamais (horloge en arrière)', () => {
    expect(etatRente(T0, T0 - 3600 * S).gemmes).toBe(0)
  })

  it('offre un coffre plein au premier passage', () => {
    expect(etatRente(depuisInitial(T0), T0).gemmes).toBe(60)
  })

  it('garde les secondes entamées après une récolte', () => {
    const maintenant = T0 + (SECONDES_PAR_GEMME * 5 + 600) * S
    const depart = departApresRecolte(T0, maintenant)
    expect(etatRente(depart, maintenant).gemmes).toBe(0)
    expect(etatRente(depart, maintenant).prochaineDansS).toBe(SECONDES_PAR_GEMME - 600)
  })

  it('perd ce qui a débordé d’un coffre plein', () => {
    const maintenant = T0 + 9 * 86_400 * S
    expect(departApresRecolte(T0, maintenant)).toBe(maintenant)
  })

  it('écrit une durée à lire', () => {
    expect(dureeLisible(10_080)).toBe('2 h 48')
    expect(dureeLisible(35 * 60)).toBe('35 min')
    expect(dureeLisible(20)).toBe('1 min')
    expect(dureeLisible(3 * 86_400 + 4 * 3600)).toBe('3 j 4 h')
    expect(dureeLisible(2 * 86_400)).toBe('2 j')
  })

  it('dit quoi faire', () => {
    expect(phraseRente(etatRente(T0, T0 + 10 * 86_400 * S))).toMatch(/plein/)
    expect(phraseRente(etatRente(T0, T0 + 60 * S))).toMatch(/Prochaine gemme dans 2 h 47/)
  })

  it('est le miroir de la migration 580', () => {
    const sql = readFileSync(join(process.cwd(), 'supabase/schema/580_studuel_plus_rente_fiches.sql'), 'utf8')
    expect(sql).toMatch(new RegExp(`v_periode\\s+CONSTANT INTEGER := ${SECONDES_PAR_GEMME};`))
    expect(sql).toMatch(new RegExp(`v_plafond\\s+CONSTANT INTEGER := ${RENTE_PLAFOND};`))
    expect(sql).toMatch(/interval '7 days'/)
  })
})
