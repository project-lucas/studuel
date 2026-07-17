// La feuille « Modes de jeu » de l'arène — catalogue et filtres, logique pure.
// Tout ce qui se joue dans le Défi, rassemblé en billets façon Clash Royale :
// le compétitif (classé, duel en direct), les modes de l'Arène (salle de jeu),
// les salons par matière et les 2v2. Les filtres évitent le long scroll — on
// tape une famille, on ne voit qu'elle. Les composants ne font qu'afficher.
import {
  GAME_MODES,
  MODE_XP_BONUS,
  FEATURED_XP_MULTIPLIER,
  featuredModeId,
  type GameModeId,
} from '@/lib/defi-modes'
import { SALONS, TEAM_GAMES } from '@/lib/jeux/catalog'

export type ModeCategory = 'competitif' | 'arene' | 'matieres' | 'duo'
export type ModeFilter = 'tous' | ModeCategory

// L'ordre des puces de filtre = l'ordre d'affichage des sections dans « Tous ».
export const MODE_FILTERS: { id: ModeFilter; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'competitif', label: 'Compétitif' },
  { id: 'arene', label: 'Arène' },
  { id: 'matieres', label: 'Par matière' },
  { id: 'duo', label: 'À deux' },
]

// Titres de section quand la liste est affichée sans filtre.
export const CATEGORY_LABELS: Record<ModeCategory, string> = {
  competitif: 'Modes compétitifs',
  arene: 'Modes de l’Arène',
  matieres: 'Salons par matière',
  duo: 'À deux',
}

export type ModeTicket = {
  id: string
  category: ModeCategory
  name: string
  tagline: string
  emoji: string
  /** Destination du billet — null tant que le mode n'est pas construit. */
  href: string | null
  /** Jeton d'info (« +20 XP », « 1 jeu dispo »…). */
  chip?: string
  /** Ruban en coin (« ×2 XP » du mode du jour, « Bientôt »). */
  badge?: string
}

// Emoji de chaque mode de l'Arène (la salle de jeu utilise des icônes Lucide,
// mais le billet parle le langage visuel du catalogue Jeux : un emoji fort).
const ARENA_EMOJI: Record<GameModeId, string> = {
  duel: '👻',
  blitz: '⏱️',
  chrono: '⏳',
  survie: '💀',
  boss: '👑',
}

/**
 * Tous les billets de la feuille, dans l'ordre d'affichage. `dayKey` (clé UTC
 * du jour) sert au mode du jour : son billet porte le ruban « ×2 XP » et son
 * jeton affiche le bonus doublé — même calcul que la salle de jeu.
 */
export function buildModeTickets(dayKey: string): ModeTicket[] {
  const featured = featuredModeId(dayKey)

  const competitif: ModeTicket[] = [
    {
      id: 'ranked',
      category: 'competitif',
      name: 'Match classé',
      tagline: 'BO3 · +30 victoire / −20 défaite',
      emoji: '🏆',
      href: '/defi/jouer?mode=ranked',
      chip: 'Trophées en jeu',
    },
    {
      id: 'duel-rapide',
      category: 'competitif',
      name: 'Duel en direct',
      tagline: 'Fais scanner ton QR — le match démarre aussitôt',
      emoji: '⚡',
      href: '/defi/duel-rapide',
    },
  ]

  const arene: ModeTicket[] = GAME_MODES.map((m) => {
    const isFeatured = m.id === featured
    const bonus =
      MODE_XP_BONUS[m.id] * (isFeatured ? FEATURED_XP_MULTIPLIER : 1)
    return {
      id: m.id,
      category: 'arene' as const,
      name: m.name,
      tagline: m.tagline,
      emoji: ARENA_EMOJI[m.id],
      href: `/defi/jouer?mode=${m.id}`,
      chip: `+${bonus} XP`,
      badge: isFeatured ? '×2 XP' : undefined,
    }
  })

  const matieres: ModeTicket[] = SALONS.map((salon) => {
    const jouables = salon.games.filter((g) => g.implemented).length
    return {
      id: `salon-${salon.subject}`,
      category: 'matieres' as const,
      name: salon.subject,
      tagline: salon.games.map((g) => g.name).join(' · '),
      emoji: salon.emoji,
      href: `/defi/jeux?matiere=${encodeURIComponent(salon.subject)}`,
      chip:
        jouables > 0
          ? `${jouables} jeu${jouables > 1 ? 'x' : ''} dispo`
          : `${salon.games.length} jeux bientôt`,
    }
  })

  const duo: ModeTicket[] = TEAM_GAMES.map((g) => ({
    id: g.id,
    category: 'duo' as const,
    name: g.name,
    tagline: g.tagline,
    emoji: g.emoji,
    // Aucun 2v2 n'est construit : billet-promesse, jamais un lien mort.
    href: g.implemented ? `/defi/jeux/${g.id}` : null,
    badge: g.implemented ? undefined : 'Bientôt',
  }))

  return [...competitif, ...arene, ...matieres, ...duo]
}

/** Les billets visibles pour une puce de filtre donnée. */
export function filterTickets(
  tickets: ModeTicket[],
  filter: ModeFilter,
): ModeTicket[] {
  if (filter === 'tous') return tickets
  return tickets.filter((t) => t.category === filter)
}
