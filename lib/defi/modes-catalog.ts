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
  BLITZ_BEST_STORAGE_KEY,
  CHRONO_BEST_STORAGE_KEY,
  SURVIE_BEST_STORAGE_KEY,
  featuredModeId,
  modeImage,
  modeScene,
} from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'
import { formatTeaser, gameFormat } from '@/lib/jeux/formats'
import { gameBestKey } from '@/lib/jeux/records'

// La robe d'un billet : matière (violet), mode fun (bleu Arène), ou mode du
// jour (or). Sert au composant à choisir le dégradé — pas de hex en dur ici.
export type ModeTone = 'matiere' | 'fun' | 'featured'

export type ModeTicket = {
  id: string
  tone: ModeTone
  name: string
  tagline: string
  emoji: string
  /**
   * Visuel illustré du billet (chemin `/images/...`) qui remplace l'emoji dans
   * la zone d'art. Optionnel : tant qu'il n'est pas fourni, on retombe sur
   * l'emoji.
   */
  image?: string | null
  /**
   * Scène illustrée plein-fond (bannière 16:9) qui remplace la robe unie du
   * corps du billet. Optionnel : sans scène, on garde le dégradé de la famille.
   */
  scene?: string | null
  /** Destination du billet — null tant que le jeu n'est pas construit. */
  href: string | null
  /** Jeton d'info (« +20 XP », « Jouer »…). */
  chip?: string
  /** Ruban en coin (« ×2 XP » du mode du jour, « Bientôt »). */
  badge?: string
  /**
   * Clé du RECORD personnel de ce défi dans le stockage local, quand il en
   * garde un (tous les jeux de salon, et les trois modes de l'Arène qui se
   * jouent au score). Absente pour ce qui n'a pas de record à battre — un
   * duel fantôme ou un boss ne se mesurent pas à un compteur.
   */
  recordKey?: string
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
// Les trois modes de l'Arène qui se jouent au SCORE gardent un record local
// (même clé que leur écran de jeu). Le duel fantôme et le boss n'en ont pas :
// on ne bat pas un compteur, on bat quelqu'un.
const ARENA_RECORD_KEY: Record<string, string> = {
  blitz: BLITZ_BEST_STORAGE_KEY,
  chrono: CHRONO_BEST_STORAGE_KEY,
  survie: SURVIE_BEST_STORAGE_KEY,
}

const ARENA_EMOJI: Record<string, string> = {
  duel: '👻',
  blitz: '⏱️',
  chrono: '⏳',
  survie: '💀',
  boss: '👑',
}

// Scènes plein-fond des billets de jeux (bannières 16:9 du batch 13 des
// prompts). Ajouter l'id ici dès que la scène est déposée dans
// public/images/defi/jeux/<id>-scene.webp — repli sur la robe unie sinon.
const GAME_SCENE_IDS = [
  'conjugaison-eclair',
  'frise-folle',
  'orthographe',
  'chasse-faute',
  'capitales',
  'pointe-carte',
  'calcul-mental',
  'traduction-flash',
  'traduccion-flash',
]

export function gameScene(id: string): string | undefined {
  return GAME_SCENE_IDS.includes(id)
    ? `/images/defi/jeux/${id}-scene.webp`
    : undefined
}

/**
 * Les jeux d'une matière, en billets. Un jeu construit mène à sa CARTE
 * (`/defi/jeux/{id}`) : l'échelle de ses cinq paliers de difficulté, où l'on
 * choisit son niveau avant de jouer (la partie vit sur `/{id}/{palier}`). Ce
 * détour a remplacé l'entrée directe dans la partie le jour où un même jeu a
 * cessé de servir la même feuille à un 6e et à un Terminale. Un jeu pas encore
 * construit n'a pas de lien (le billet affiche « Bientôt »). Matière inconnue → [].
 */
export function subjectGameTickets(subject: string): ModeTicket[] {
  const salon = SALONS.find((s) => s.subject === subject)
  if (!salon) return []
  return salon.games.map((g) => {
    // Le jeton annonce la RÈGLE du jeu (« 8 escales », « 2 vies · 10 pièges »),
    // pas un « Jouer » interchangeable : c'est la première moitié de la promesse
    // que la table de jeu doit ensuite tenir.
    const format = g.implemented ? gameFormat(g.id) : null
    return {
      id: `${subject}:${g.id}`,
      tone: 'matiere' as const,
      name: g.name,
      tagline: g.tagline,
      emoji: g.emoji,
      scene: gameScene(g.id),
      href: g.implemented ? `/defi/jeux/${g.id}` : null,
      chip: format ? formatTeaser(format) : g.implemented ? 'Jouer' : undefined,
      badge: g.implemented ? undefined : 'Bientôt',
      // Un jeu pas encore construit n'a évidemment pas de record.
      recordKey: g.implemented ? gameBestKey(g.id) : undefined,
    }
  })
}

// Les matières du programme portent le même NOM que les matières du catalogue
// de salons (« Français », « Histoire-Géo »…), mais rien ne l'impose en base :
// on retombe donc sur le SLUG, dérivable du nom de façon stable.
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * La matière du catalogue de salons qui correspond à une matière du programme
 * (page `/reviser/[matiere]`), ou `null` quand elle n'a pas de jeux — une
 * matière sans salon ne doit rien promettre.
 */
export function salonSubjectFor(subject: {
  slug: string
  name: string
}): string | null {
  const byName = SALONS.find((s) => s.subject === subject.name)
  if (byName) return byName.subject
  const slug = slugify(subject.slug || subject.name)
  return SALONS.find((s) => slugify(s.subject) === slug)?.subject ?? null
}

// Le billet « Boss » d'une matière a été SUPPRIMÉ d'ici (chantier La Traque,
// lib/traque.ts) : un gardien ne se choisit plus dans un menu de modes, il se
// débusque en révisant. Il vivait au milieu de Blitz, Chrono et Survie alors
// qu'il n'a pas la même nature — et rien ne reliait le travail au combat. Sa
// carte vit maintenant dans la feuille Boss du rail de l'arène
// (components/defi/BossSheet), et le combat dans /defi/traque/[bossId].

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
      image: modeImage(m.id),
      scene: modeScene(m.id),
      href: `/defi/jouer?mode=${m.id}`,
      chip: `+${bonus} XP`,
      badge: isFeatured ? '×2 XP' : undefined,
      recordKey: ARENA_RECORD_KEY[m.id],
    }
  })
}
