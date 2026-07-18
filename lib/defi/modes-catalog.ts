// La feuille « Modes de jeu » de l'arène — catalogue et logique pure.
// Refonte « roulette » : on ne rejoue PAS le compétitif ici (le Match classé et
// le Duel en direct ont déjà leurs boutons sur l'écran d'arène). La feuille fait
// deux choses, dans cet ordre : une ROULETTE de matières (on fait défiler, on
// choisit) qui révèle les 2-3 JEUX de cette matière, puis les MODES FUN de
// l'Arène (Blitz, Chrono, Survie, Duel fantôme, Boss), communs à toutes les
// matières. Les composants ne font qu'afficher — tout le calcul est ici.
import {
  GAME_MODES,
  MODE_XP_BONUS,
  FEATURED_XP_MULTIPLIER,
  featuredModeId,
} from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'

// La robe d'un billet : matière (violet), mode fun (bleu Arène), ou mode du
// jour (or). Sert au composant à choisir le dégradé — pas de hex en dur ici.
export type ModeTone = 'matiere' | 'fun' | 'featured'

export type ModeTicket = {
  id: string
  tone: ModeTone
  name: string
  tagline: string
  emoji: string
  /** Destination du billet — null tant que le jeu n'est pas construit. */
  href: string | null
  /** Jeton d'info (« +20 XP », « Jouer »…). */
  chip?: string
  /** Ruban en coin (« ×2 XP » du mode du jour, « Bientôt »). */
  badge?: string
}

// Un cran de la roulette : une matière, son emoji, et le nombre de jeux qu'elle
// propose (le talon affiche « 3 jeux »).
export type RouletteSubject = {
  subject: string
  emoji: string
  count: number
}

// Les crans de la roulette, dans l'ordre du catalogue de salons.
export const ROULETTE_SUBJECTS: RouletteSubject[] = SALONS.map((s) => ({
  subject: s.subject,
  emoji: s.emoji,
  count: s.games.length,
}))

// Emoji de chaque mode de l'Arène (la salle de jeu utilise des icônes Lucide,
// mais le billet parle le langage visuel du catalogue : un emoji fort).
const ARENA_EMOJI: Record<string, string> = {
  duel: '👻',
  blitz: '⏱️',
  chrono: '⏳',
  survie: '💀',
  boss: '👑',
}

/**
 * Les jeux d'une matière, en billets. Un jeu construit mène DROIT à sa table de
 * jeu (`/defi/jeux/{id}`) — plus d'écran intermédiaire : on tape, on joue. Un
 * jeu pas encore construit n'a pas de lien (le billet affiche « Bientôt »).
 * Matière inconnue → [].
 */
export function subjectGameTickets(subject: string): ModeTicket[] {
  const salon = SALONS.find((s) => s.subject === subject)
  if (!salon) return []
  return salon.games.map((g) => ({
    id: `${subject}:${g.id}`,
    tone: 'matiere' as const,
    name: g.name,
    tagline: g.tagline,
    emoji: g.emoji,
    href: g.implemented ? `/defi/jeux/${g.id}` : null,
    chip: g.implemented ? 'Jouer' : undefined,
    badge: g.implemented ? undefined : 'Bientôt',
  }))
}

/**
 * Les modes fun de l'Arène (communs à toutes les matières), en billets.
 * `dayKey` (clé UTC du jour) sert au mode du jour : son billet porte le ruban
 * « ×2 XP », son jeton le bonus doublé, sa robe passe en or — même calcul que
 * la salle de jeu.
 */
export function funModeTickets(dayKey: string): ModeTicket[] {
  const featured = featuredModeId(dayKey)
  return GAME_MODES.map((m) => {
    const isFeatured = m.id === featured
    const bonus =
      MODE_XP_BONUS[m.id] * (isFeatured ? FEATURED_XP_MULTIPLIER : 1)
    return {
      id: m.id,
      tone: isFeatured ? ('featured' as const) : ('fun' as const),
      name: m.name,
      tagline: m.tagline,
      emoji: ARENA_EMOJI[m.id] ?? '🎮',
      href: `/defi/jouer?mode=${m.id}`,
      chip: `+${bonus} XP`,
      badge: isFeatured ? '×2 XP' : undefined,
    }
  })
}
