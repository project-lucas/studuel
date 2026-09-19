import { describe, expect, it } from 'vitest'
import { cleSemaineVitrine, vitrineAVoir } from './vue'

describe('la semaine de la vitrine', () => {
  it('est le lundi de la semaine, du lundi au dimanche', () => {
    expect(cleSemaineVitrine(new Date('2026-09-14T00:00:00Z'))).toBe('2026-09-14')
    expect(cleSemaineVitrine(new Date('2026-09-18T15:00:00Z'))).toBe('2026-09-14')
    expect(cleSemaineVitrine(new Date('2026-09-20T23:59:00Z'))).toBe('2026-09-14')
    expect(cleSemaineVitrine(new Date('2026-09-21T00:00:00Z'))).toBe('2026-09-21')
  })

  it('traverse les fins de mois et d’année', () => {
    expect(cleSemaineVitrine(new Date('2027-01-01T10:00:00Z'))).toBe('2026-12-28')
  })

  it('allume la pastille tant que la semaine n’a pas été vue', () => {
    const vendredi = new Date('2026-09-18T15:00:00Z')
    expect(vitrineAVoir(undefined, vendredi)).toBe(true)
    expect(vitrineAVoir('2026-09-07', vendredi)).toBe(true)
    expect(vitrineAVoir('2026-09-14', vendredi)).toBe(false)
  })
})
