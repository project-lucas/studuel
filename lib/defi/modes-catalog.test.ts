import { describe, expect, it } from 'vitest'
import {
  buildModeTickets,
  filterTickets,
  MODE_FILTERS,
  CATEGORY_LABELS,
  type ModeCategory,
} from '@/lib/defi/modes-catalog'
import { GAME_MODES, MODE_XP_BONUS, featuredModeId } from '@/lib/defi-modes'
import { SALONS, TEAM_GAMES } from '@/lib/jeux/catalog'

const DAY = '2026-07-17'

describe('buildModeTickets', () => {
  it('couvre tout le catalogue : compétitif + arène + salons + 2v2', () => {
    const tickets = buildModeTickets(DAY)
    expect(tickets).toHaveLength(
      2 + GAME_MODES.length + SALONS.length + TEAM_GAMES.length,
    )
  })

  it('donne à chaque mode de l’Arène un lien vers la salle de jeu', () => {
    const tickets = buildModeTickets(DAY)
    for (const mode of GAME_MODES) {
      const ticket = tickets.find((t) => t.id === mode.id)
      expect(ticket?.href).toBe(`/defi/jouer?mode=${mode.id}`)
      expect(ticket?.category).toBe('arene')
    }
  })

  it('marque le mode du jour « ×2 XP » avec le bonus doublé', () => {
    const featured = featuredModeId(DAY)
    const tickets = buildModeTickets(DAY)
    const ticket = tickets.find((t) => t.id === featured)
    expect(ticket?.badge).toBe('×2 XP')
    expect(ticket?.chip).toBe(`+${MODE_XP_BONUS[featured] * 2} XP`)
    // Les autres modes de l'Arène gardent leur bonus simple, sans ruban.
    const others = tickets.filter(
      (t) => t.category === 'arene' && t.id !== featured,
    )
    for (const other of others) {
      expect(other.badge).toBeUndefined()
    }
  })

  it('envoie chaque salon vers /defi/jeux avec sa matière présélectionnée', () => {
    const tickets = buildModeTickets(DAY)
    const salon = tickets.find((t) => t.id === 'salon-Histoire-Géo')
    expect(salon?.href).toBe(
      `/defi/jeux?matiere=${encodeURIComponent('Histoire-Géo')}`,
    )
  })

  it('ne met jamais de lien sur un 2v2 non construit (« Bientôt »)', () => {
    const tickets = buildModeTickets(DAY)
    for (const game of TEAM_GAMES.filter((g) => !g.implemented)) {
      const ticket = tickets.find((t) => t.id === game.id)
      expect(ticket?.href).toBeNull()
      expect(ticket?.badge).toBe('Bientôt')
    }
  })

  it('reste déterministe pour une même clé de jour (serveur = client)', () => {
    expect(buildModeTickets(DAY)).toEqual(buildModeTickets(DAY))
  })
})

describe('filterTickets', () => {
  it('« Tous » rend la liste complète, dans le même ordre', () => {
    const tickets = buildModeTickets(DAY)
    expect(filterTickets(tickets, 'tous')).toEqual(tickets)
  })

  it('chaque filtre ne garde que sa famille', () => {
    const tickets = buildModeTickets(DAY)
    for (const { id } of MODE_FILTERS.filter((f) => f.id !== 'tous')) {
      const kept = filterTickets(tickets, id)
      expect(kept.length).toBeGreaterThan(0)
      expect(kept.every((t) => t.category === id)).toBe(true)
    }
  })

  it('chaque catégorie a son titre de section', () => {
    const categories = new Set(
      buildModeTickets(DAY).map((t) => t.category),
    ) as Set<ModeCategory>
    for (const category of categories) {
      expect(CATEGORY_LABELS[category]).toBeTruthy()
    }
  })
})
