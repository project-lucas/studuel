import { describe, expect, it } from 'vitest'
import {
  SALONS,
  SALON_UNLOCK_VALUE,
  TEAM_GAMES,
  playableSalonGame,
  salonState,
  salonStates,
} from './catalog'
import type { ChapterMastery } from '@/lib/mastery'

describe('catalogue des salons', () => {
  it('a un salon par matière, sans doublon', () => {
    const subjects = SALONS.map((s) => s.subject)
    expect(new Set(subjects).size).toBe(subjects.length)
    expect(subjects).toContain('Histoire-Géo')
    expect(subjects).toContain('Français')
  })

  it('a des ids de jeux uniques à travers tout le catalogue', () => {
    const ids = [
      ...SALONS.flatMap((s) => s.games.map((g) => g.id)),
      ...TEAM_GAMES.map((g) => g.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('retrouve un jeu jouable par id avec son salon', () => {
    const found = playableSalonGame('capitales')
    expect(found?.salon.subject).toBe('Histoire-Géo')
    expect(found?.game.name).toBe('Capitales du monde')
  })

  it('ne retourne jamais un jeu non implémenté ni inconnu', () => {
    // « Pointe la carte » reste annoncé sans être construit : c'est le cas que
    // ce garde-fou protège (un billet « Bientôt » ne doit jamais mener au jeu).
    expect(playableSalonGame('pointe-carte')).toBeNull()
    expect(playableSalonGame('nimporte-quoi')).toBeNull()
  })
})

describe('déblocage des salons', () => {
  it('ouvre le salon dès un chapitre maîtrisé (seuil or)', () => {
    expect(salonState([0.2, SALON_UNLOCK_VALUE]).unlocked).toBe(true)
    expect(salonState([0.95]).unlocked).toBe(true)
  })

  it('reste verrouillé sous le seuil, avec la meilleure jauge visible', () => {
    const s = salonState([0.3, 0.6])
    expect(s.unlocked).toBe(false)
    expect(s.best).toBe(0.6)
  })

  it('reste verrouillé à zéro sans aucun chapitre', () => {
    expect(salonState([])).toEqual({ unlocked: false, best: 0 })
  })

  it('calcule un état par salon du catalogue', () => {
    const mastery: ChapterMastery = new Map([
      ['ch-hg', { value: 0.9, quizAttempted: true, lessonDone: true }],
      ['ch-fr', { value: 0.4, quizAttempted: true, lessonDone: false }],
    ])
    const chapters = new Map([
      ['Histoire-Géo', ['ch-hg']],
      ['Français', ['ch-fr']],
    ])
    const states = salonStates(chapters, mastery)
    expect(states.get('Histoire-Géo')?.unlocked).toBe(true)
    expect(states.get('Français')).toEqual({ unlocked: false, best: 0.4 })
    // Matière sans chapitre connu : présente mais verrouillée à zéro.
    expect(states.get('Maths')).toEqual({ unlocked: false, best: 0 })
  })
})

describe('équipes 2v2', () => {
  it('sont toutes annoncées, sans condition de déblocage', () => {
    expect(TEAM_GAMES.length).toBeGreaterThanOrEqual(3)
    expect(TEAM_GAMES.every((g) => g.name && g.tagline)).toBe(true)
  })
})
