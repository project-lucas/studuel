// LE ROSTER de la Route des trophées — logique pure, sans React ni Supabase.
//
// Assemble, pour chaque matière, la liste des jeux qui portent des trophées :
// les jeux de salon jouables (lib/jeux/catalog) PLUS le « Programme »
// (lib/jeux/programme), qui vit hors du catalogue mais compte comme les autres.
// À chaque jeu il attache son compteur et — le point qui fait tout le système —
// CE QUE VAUDRA LA PROCHAINE VICTOIRE.
//
// C'est la source unique de l'espace duel (choisir sa matière puis son jeu) et
// de la Route des trophées (le bilan par matière). Les deux écrans lisaient
// sinon le catalogue chacun de leur côté, et auraient fini par ne plus proposer
// la même chose.
import { SALONS } from '@/lib/jeux/catalog'
import { gameFormat, formatTeaser } from '@/lib/jeux/formats'
import {
  PROGRAMME_GAME_ID,
  PROGRAMME_NAME,
  PROGRAMME_TAGLINE,
  PROGRAMME_TEASER,
  programmeHref,
  programmeSlug,
} from '@/lib/jeux/programme'
import { subjectTotal, trophyBand, type GameTrophyRow } from '@/lib/trophy-road'

export type RosterGame = {
  gameId: string
  name: string
  emoji: string
  tagline: string
  /** L'accroche courte du billet (« 8 escales », « 3 vies · 10 questions »). */
  teaser: string
  /** Destination, ou null quand le jeu n'est pas jouable pour cet élève. */
  href: string | null
  trophies: number
  /** Gain de la prochaine victoire — la pastille qui permet d'arbitrer. */
  nextWin: number
  /** Perte de la prochaine défaite (valeur positive). */
  nextLoss: number
  /** Le jeu « Ton programme », qui se lit autrement que les drills. */
  isProgramme: boolean
  /** Pourquoi le jeu n'est pas jouable, à afficher sur la tuile éteinte. */
  unavailable?: string
}

export type RosterSubject = {
  subject: string
  slug: string
  emoji: string
  /** Somme des jeux de la matière. */
  total: number
  games: RosterGame[]
}

export type RosterOptions = {
  /**
   * Slugs des matières dont le Programme est réellement jouable (banque de
   * questions suffisante pour la classe de l'élève). Une matière absente garde
   * sa tuile, éteinte : mieux vaut une promesse datée qu'un tap qui rebondit
   * sur l'arène sans explication.
   */
  programmeReady?: ReadonlySet<string>
}

/** Clé de lecture des compteurs : « slug:jeu ». */
export function trophyKey(subjectSlug: string, gameId: string): string {
  return `${subjectSlug}:${gameId}`
}

/** Les compteurs, rangés par clé, à partir des lignes de `game_trophies`. */
export function trophyMap(rows: readonly GameTrophyRow[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(
      trophyKey(row.subject, row.gameId),
      Math.max(0, Math.floor(row.trophies)),
    )
  }
  return map
}

/**
 * Le roster complet : une entrée par matière du catalogue, ses jeux jouables
 * suivis de son Programme.
 *
 * Le Programme est mis EN DERNIER et non en tête, bien qu'il soit le seul à
 * porter le vrai cours : l'ordre d'une liste se lit comme un classement, et
 * mettre le programme en avant transformerait l'espace duel en devoir. La
 * pastille de gain, elle, l'appellera d'elle-même dès qu'il sera le plus
 * rentable — c'est le rôle de la courbe, pas celui d'un tri.
 */
export function buildRoster(
  trophies: ReadonlyMap<string, number>,
  options: RosterOptions = {},
): RosterSubject[] {
  return SALONS.map((salon) => {
    const slug = programmeSlug(salon.subject)

    const games: RosterGame[] = salon.games
      .filter((game) => game.implemented)
      .map((game) => {
        const format = gameFormat(game.id)
        return withBand({
          gameId: game.id,
          name: game.name,
          emoji: game.emoji,
          tagline: game.tagline,
          teaser: format ? formatTeaser(format) : 'Jouer',
          href: `/defi/jeux/${game.id}`,
          trophies: trophies.get(trophyKey(slug, game.id)) ?? 0,
          isProgramme: false,
        })
      })

    const ready = options.programmeReady?.has(slug) ?? true
    games.push(
      withBand({
        gameId: PROGRAMME_GAME_ID,
        name: PROGRAMME_NAME,
        emoji: '📘',
        tagline: PROGRAMME_TAGLINE,
        teaser: PROGRAMME_TEASER,
        href: ready ? programmeHref(salon.subject) : null,
        trophies: trophies.get(trophyKey(slug, PROGRAMME_GAME_ID)) ?? 0,
        isProgramme: true,
        unavailable: ready ? undefined : 'Bientôt dans ta classe',
      }),
    )

    return {
      subject: salon.subject,
      slug,
      emoji: salon.emoji,
      total: games.reduce((sum, game) => sum + game.trophies, 0),
      games,
    }
  })
}

// Complète une tuile avec le barème de sa bande — le seul endroit où l'UI
// apprend ce que vaut la prochaine partie.
function withBand(
  game: Omit<RosterGame, 'nextWin' | 'nextLoss'>,
): RosterGame {
  const band = trophyBand(game.trophies)
  return { ...game, nextWin: band.win, nextLoss: band.loss }
}

/** Total global : la somme de toutes les matières du roster. */
export function rosterTotal(roster: readonly RosterSubject[]): number {
  return roster.reduce((sum, entry) => sum + entry.total, 0)
}

/**
 * Le jeu JOUABLE le plus rentable de tout le roster — la ligne de conseil de
 * la Route. À gain égal, le compteur le plus bas gagne ; à égalité parfaite,
 * l'ordre du catalogue tranche, pour que le conseil ne saute pas d'un rendu à
 * l'autre.
 *
 * Se distingue de `mostRewarding` (lib/trophy-road) qui ne travaille que sur
 * des compteurs bruts : ici on écarte les jeux non jouables, qu'il serait
 * absurde de conseiller.
 */
export function bestNextGame<
  // Générique et non `RosterSubject` : le plateau du duel (`lib/defi/duel-board`)
  // porte les mêmes jeux sous un type plus riche, et il pose exactement la même
  // question. Le contraindre à `RosterSubject` aurait imposé une seconde copie
  // de ce conseil, donc deux conseils qui finiraient par diverger.
  T extends { subject: string; games: readonly RosterGame[] },
>(roster: readonly T[]): { subject: T; game: RosterGame } | null {
  let best: { subject: T; game: RosterGame } | null = null
  for (const subject of roster) {
    for (const game of subject.games) {
      if (!game.href) continue
      if (
        best === null ||
        game.nextWin > best.game.nextWin ||
        (game.nextWin === best.game.nextWin &&
          game.trophies < best.game.trophies)
      ) {
        best = { subject, game }
      }
    }
  }
  return best
}

/** La matière d'un slug dans le roster, ou null. */
export function subjectBySlug(
  roster: readonly RosterSubject[],
  slug: string,
): RosterSubject | null {
  return roster.find((entry) => entry.slug === slug) ?? null
}

/**
 * Le total d'une matière recalculé depuis les lignes brutes — sert au serveur,
 * qui n'a pas toujours construit le roster complet.
 */
export function subjectTotalFromRows(
  rows: readonly GameTrophyRow[],
  subjectSlug: string,
): number {
  return subjectTotal(rows, subjectSlug)
}
