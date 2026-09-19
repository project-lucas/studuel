import { describe, expect, it } from 'vitest'
import {
  TEINTE_MATIERE,
  coopTicket,
  duelDirectTicket,
  funModeTickets,
  modesReplies,
  salonSubjectFor,
  sectionsMatieres,
  subjectGameTickets,
  vueModes,
} from '@/lib/defi/modes-catalog'
import { gameBestKey } from '@/lib/jeux/records'
import { GAME_MODES, featuredModeId } from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'
import { formatTeaser, gameFormat } from '@/lib/jeux/formats'
import { LIEN_STUDUEL_PLUS, jeuLibre } from '@/lib/jeux/acces'

const DAY = '2026-07-17'

describe('subjectGameTickets', () => {
  it('rend tous les jeux de la matière', () => {
    const salon = SALONS[0]
    const tickets = subjectGameTickets(salon.subject)
    expect(tickets).toHaveLength(salon.games.length)
  })

  it('mène à la carte du jeu construit, sans lien pour « Bientôt »', () => {
    const salon = SALONS.find((s) => s.subject === 'Histoire-Géo')!
    const tickets = subjectGameTickets(salon.subject)
    salon.games.forEach((game, i) => {
      const ticket = tickets[i]
      expect(ticket.teinte).toBe(TEINTE_MATIERE['Histoire-Géo'])
      if (game.implemented) {
        expect(ticket.href).toBe(`/defi/jeux/${game.id}`)
      } else {
        expect(ticket.href).toBeNull()
      }
    })
  })

  it('annonce la règle des jeux construits et « Bientôt » pour les autres', () => {
    for (const salon of SALONS) {
      const tickets = subjectGameTickets(salon.subject)
      salon.games.forEach((game, i) => {
        const t = tickets[i]
        if (game.implemented) {
          // La pastille porte la promesse du format (« 8 escales », « 45 s
          // chrono »), jamais un « Jouer » qui laisserait croire que tous les
          // jeux se jouent pareil.
          expect(t.chip).toBe(formatTeaser(gameFormat(game.id)!))
          expect(t.chip).not.toBe('Jouer')
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

  it('porte la clé du record et l’id du jeu construit, rien pour « Bientôt »', () => {
    for (const salon of SALONS) {
      const tickets = subjectGameTickets(salon.subject)
      salon.games.forEach((game, i) => {
        expect(tickets[i].recordKey).toBe(game.implemented ? gameBestKey(game.id) : undefined)
        expect(tickets[i].gameId).toBe(game.implemented ? game.id : undefined)
      })
    }
  })

  it('pose la vignette du dossier de la matière (art de repli du corps)', () => {
    for (const t of subjectGameTickets('SVT')) {
      expect(t.vignette).toBe('/images/matieres/vignettes/svt.webp')
    }
  })
})

describe('le freemium des billets', () => {
  it('sans Studuel+ : un jeu ouvert par matière, les autres sous cadenas vers la Boutique', () => {
    for (const salon of SALONS) {
      const tickets = subjectGameTickets(salon.subject, { premium: false })
      const ouverts = tickets.filter((t) => t.href && !t.verrou)
      expect(ouverts, salon.subject).toHaveLength(1)
      for (const t of tickets.filter((x) => x.verrou)) {
        expect(t.href).toBe(LIEN_STUDUEL_PLUS)
        expect(jeuLibre(t.gameId!)).toBe(false)
      }
    }
  })

  it('avec Studuel+ : aucun cadenas', () => {
    for (const salon of SALONS) {
      expect(subjectGameTickets(salon.subject, { premium: true }).some((t) => t.verrou)).toBe(false)
    }
  })

  it('vue par défaut : UN jeu par matière, son jeu libre — ouvert, sans cadenas', () => {
    for (const s of sectionsMatieres(false, false)) {
      expect(s.tickets, s.subject).toHaveLength(1)
      expect(jeuLibre(s.tickets[0].gameId!)).toBe(true)
      expect(s.tickets[0].verrou).toBe(false)
    }
  })

  it('« tous les modes » déplie le reste, et dit combien il en cache', () => {
    const tous = sectionsMatieres(false, true).reduce((n, s) => n + s.tickets.length, 0)
    expect(tous).toBe(SALONS.reduce((n, s) => n + s.games.length, 0))
    expect(modesReplies(false)).toBe(tous - SALONS.length)
    expect(modesReplies(true)).toBe(modesReplies(false))
  })

  it('les sections suivent le catalogue des salons, matière par matière', () => {
    const sections = sectionsMatieres(false)
    expect(sections.map((s) => s.subject)).toEqual(SALONS.map((s) => s.subject))
    for (const s of sections) expect(s.vignette).toMatch(/^\/images\/matieres\/vignettes\//)
  })
})

describe('salonSubjectFor', () => {
  it('reconnaît une matière du programme par son nom', () => {
    expect(salonSubjectFor({ slug: 'francais', name: 'Français' })).toBe('Français')
  })

  it('retombe sur le slug quand le nom en base diffère', () => {
    expect(salonSubjectFor({ slug: 'histoire-geo', name: 'Histoire et Géographie' })).toBe(
      'Histoire-Géo',
    )
    expect(salonSubjectFor({ slug: 'physique-chimie', name: 'Physique / Chimie' })).toBe(
      'Physique-Chimie',
    )
  })

  it('rend null pour une matière sans salon — elle ne promet rien', () => {
    expect(salonSubjectFor({ slug: 'emc', name: 'EMC' })).toBeNull()
    expect(salonSubjectFor({ slug: 'sport', name: 'Sport' })).toBeNull()
  })

  it('trouve un salon pour chaque matière du catalogue', () => {
    for (const salon of SALONS) {
      expect(salonSubjectFor({ slug: '', name: salon.subject })).toBe(salon.subject)
    }
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

  it('met le mode du jour en vedette, et lui seul', () => {
    const featured = featuredModeId(DAY)
    const tickets = funModeTickets(DAY)
    const ticket = tickets.find((t) => t.id === featured)
    expect(ticket?.vedette).toBe(true)
    expect(ticket?.badge).toBe('Mode du jour')
    for (const other of tickets.filter((t) => t.id !== featured)) {
      expect(other.badge).toBeUndefined()
      expect(other.vedette).toBe(false)
    }
  })

  it('n’annonce plus d’XP que le portefeuille ne verse pas (348)', () => {
    for (const t of funModeTickets(DAY)) {
      expect(t.chip ?? '').not.toMatch(/XP/)
      expect(t.badge ?? '').not.toMatch(/XP/)
    }
  })

  it('reste déterministe pour une même clé de jour (serveur = client)', () => {
    expect(funModeTickets(DAY)).toEqual(funModeTickets(DAY))
  })
})

describe('vueModes — ce que montre la feuille', () => {
  it('par défaut : le mode du jour et UN jeu par matière, aucun mode de l’Arène', () => {
    const v = vueModes({ dayKey: DAY, premium: false, tout: false, connecte: true })
    expect(v.vedette?.id).toBe(featuredModeId(DAY))
    for (const s of v.sections) expect(s.tickets).toHaveLength(1)
    expect(v.arene).toEqual([])
  })

  it('« tous les modes » : les seconds jeux, puis les modes de l’Arène, Duel en direct et Coop', () => {
    const v = vueModes({ dayKey: DAY, premium: false, tout: true, connecte: true })
    const ids = v.arene.map((t) => t.id)
    // Tous les modes du tirage sauf celui du jour (déjà en tête).
    expect(ids).toHaveLength(GAME_MODES.length - 1 + 2)
    expect(ids).not.toContain(featuredModeId(DAY))
    expect(ids.slice(-2)).toEqual(['duel-direct', 'coop'])
    expect(coopTicket().href).toBe('/defi/jouer?mode=coop')
  })

  it('la pastille du bouton compte exactement ce qu’il dévoile', () => {
    const repli = vueModes({ dayKey: DAY, premium: false, tout: false, connecte: true })
    const tout = vueModes({ dayKey: DAY, premium: false, tout: true, connecte: true })
    const compte = (v: typeof repli) => v.sections.reduce((n, s) => n + s.tickets.length, 0) + v.arene.length
    expect(repli.replies).toBe(compte(tout) - compte(repli))
  })

  it('un visiteur n’a ni Duel en direct ni Coop (il faut un compte)', () => {
    const v = vueModes({ dayKey: DAY, premium: false, tout: true, connecte: false })
    expect(v.arene.map((t) => t.id)).not.toContain('coop')
    expect(v.arene.map((t) => t.id)).not.toContain('duel-direct')
  })
})

describe('duelDirectTicket', () => {
  it('mène au duel en direct par QR', () => {
    expect(duelDirectTicket().href).toBe('/defi/duel-rapide')
  })
})
