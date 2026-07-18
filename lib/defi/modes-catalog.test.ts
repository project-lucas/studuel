import { describe, expect, it } from 'vitest'
import {
  ROULETTE_SUBJECTS,
  subjectGameTickets,
  funModeTickets,
} from '@/lib/defi/modes-catalog'
import { GAME_MODES, MODE_XP_BONUS, featuredModeId } from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'

const DAY = '2026-07-17'

describe('ROULETTE_SUBJECTS', () => {
  it('a un cran par matière du catalogue de salons', () => {
    expect(ROULETTE_SUBJECTS).toHaveLength(SALONS.length)
    for (const salon of SALONS) {
      const cran = ROULETTE_SUBJECTS.find((s) => s.subject === salon.subject)
      expect(cran?.emoji).toBe(salon.emoji)
      expect(cran?.count).toBe(salon.games.length)
    }
  })
})

describe('subjectGameTickets', () => {
  it('rend tous les jeux de la matière', () => {
    const salon = SALONS[0]
    const tickets = subjectGameTickets(salon.subject)
    expect(tickets).toHaveLength(salon.games.length)
  })

  it('mène droit à la table du jeu construit, sans lien pour « Bientôt »', () => {
    const salon = SALONS.find((s) => s.subject === 'Histoire-Géo')!
    const tickets = subjectGameTickets(salon.subject)
    salon.games.forEach((game, i) => {
      const ticket = tickets[i]
      expect(ticket.tone).toBe('matiere')
      if (game.implemented) {
        expect(ticket.href).toBe(`/defi/jeux/${game.id}`)
      } else {
        expect(ticket.href).toBeNull()
      }
    })
  })

  it('marque « Jouer » les jeux construits et « Bientôt » les autres', () => {
    for (const salon of SALONS) {
      const tickets = subjectGameTickets(salon.subject)
      salon.games.forEach((game, i) => {
        const t = tickets[i]
        if (game.implemented) {
          expect(t.chip).toBe('Jouer')
          expect(t.badge).toBeUndefined()
        } else {
          expect(t.badge).toBe('Bientôt')
          expect(t.chip).toBeUndefined()
        }
      })
    }
  })

  it('rend [] pour une matière inconnue', () => {
    expect(subjectGameTickets('Latin ancien')).toEqual([])
  })
})

describe('funModeTickets', () => {
  it('donne à chaque mode de l’Arène un lien vers la salle de jeu', () => {
    const tickets = funModeTickets(DAY)
    expect(tickets).toHaveLength(GAME_MODES.length)
    for (const mode of GAME_MODES) {
      const ticket = tickets.find((t) => t.id === mode.id)
      expect(ticket?.href).toBe(`/defi/jouer?mode=${mode.id}`)
    }
  })

  it('marque le mode du jour « ×2 XP » (robe or, bonus doublé)', () => {
    const featured = featuredModeId(DAY)
    const tickets = funModeTickets(DAY)
    const ticket = tickets.find((t) => t.id === featured)
    expect(ticket?.badge).toBe('×2 XP')
    expect(ticket?.tone).toBe('featured')
    expect(ticket?.chip).toBe(`+${MODE_XP_BONUS[featured] * 2} XP`)
    // Les autres modes gardent leur bonus simple, sans ruban ni robe or.
    for (const other of tickets.filter((t) => t.id !== featured)) {
      expect(other.badge).toBeUndefined()
      expect(other.tone).toBe('fun')
    }
  })

  it('reste déterministe pour une même clé de jour (serveur = client)', () => {
    expect(funModeTickets(DAY)).toEqual(funModeTickets(DAY))
  })
})
