import { describe, it, expect } from 'vitest'
import { arenaProgress, ARENAS } from './arena'

describe('arenaProgress', () => {
  it('place un débutant dans la Cour de récré', () => {
    const p = arenaProgress(0)
    expect(p.current.id).toBe('recre')
    expect(p.next?.id).toBe('etude')
    expect(p.remaining).toBe(300)
    expect(p.ratio).toBe(0)
  })

  it('calcule la progression au milieu d’une arène', () => {
    // 480 trophées : dans « Salle d'étude » (300 → 700), soit 180/400.
    const p = arenaProgress(480)
    expect(p.current.id).toBe('etude')
    expect(p.next?.id).toBe('profs')
    expect(p.trophiesIntoArena).toBe(180)
    expect(p.span).toBe(400)
    expect(p.remaining).toBe(220)
    expect(p.ratio).toBeCloseTo(0.45)
  })

  it('atteint pile un seuil = entrée dans la nouvelle arène', () => {
    const p = arenaProgress(700)
    expect(p.current.id).toBe('profs')
    expect(p.trophiesIntoArena).toBe(0)
    expect(p.ratio).toBe(0)
  })

  it('sature au sommet (Grand Oral) sans arène suivante', () => {
    const p = arenaProgress(4200)
    expect(p.current.id).toBe('oral')
    expect(p.next).toBeNull()
    expect(p.span).toBeNull()
    expect(p.remaining).toBeNull()
    expect(p.ratio).toBe(1)
  })

  it('traite les trophées négatifs comme zéro', () => {
    const p = arenaProgress(-50)
    expect(p.current.id).toBe('recre')
    expect(p.trophiesIntoArena).toBe(0)
  })

  it('couvre chaque palier de l’échelle', () => {
    expect(ARENAS.map((a) => a.minTrophies)).toEqual([
      0, 300, 700, 1200, 2000, 3000,
    ])
    expect(arenaProgress(1200).current.id).toBe('cdi')
    expect(arenaProgress(2000).current.id).toBe('amphi')
    expect(arenaProgress(3000).current.id).toBe('oral')
  })
})
