// LE PLATEAU DU DUEL — logique pure, sans React ni Supabase.
//
// UN SEUL MODÈLE pour les trois objets qui parlent de matière sur l'arène : la
// roulette qui la choisit, le bouton COMBAT qui la lance, et la Route des
// trophées qui la raconte. Chacun lisait sa propre source — le roster pour les
// jeux, le ladder pour le rang, le catalogue pour l'illustration — et l'écran
// portait déjà la facture : DEUX sélecteurs de matière cohabitaient (celui du
// module classé, celui de l'espace duel), sans jamais se dire qu'ils parlaient
// de la même chose. On en garde un, et il lit ce fichier.
//
// CE QUE LE PLATEAU AJOUTE aux deux sources qu'il assemble : rien de nouveau à
// stocker, seulement la RÉPONSE à la question que pose le bouton — « si je tape
// COMBAT sur cette matière, qu'est-ce qui se lance ? ». Cette réponse ne peut
// pas vivre dans le composant : elle dépend du déblocage (lib/subject-unlock),
// de la banque de questions (lib/jeux/programme) et du barème (lib/trophy-road),
// c'est-à-dire de trois règles métier qu'un bouton n'a pas à connaître.

import type { RosterGame, RosterSubject } from '@/lib/defi/roster'
import {
  LOCKED_HINT,
  subjectRankFor,
  type SubjectLadder,
  type SubjectRank,
} from '@/lib/subject-rank'
import { subjectPastel, subjectVignette } from '@/lib/subject-style'

/** Une matière, telle que la rangée de combat a besoin de la connaître. */
export type DuelSubject = {
  /** Nom affiché (« Histoire-Géo »). */
  subject: string
  /** Slug — l'identité stable, celle des trophées et des URLs. */
  slug: string
  emoji: string
  /**
   * L'illustration de la carte matière de Réviser. C'est volontairement la
   * MÊME image que dans l'onglet de révision : une matière doit avoir un seul
   * visage dans l'app, sinon la roulette apprend un seconde alphabet à l'élève.
   * Null quand le dessin n'existe pas encore — l'emoji reprend la place.
   */
  vignette: string | null
  /**
   * Le pastel de la matière (`subjects.color` → `subjectPastel`), qui sert de
   * FOND au médaillon de la roulette. Une vignette est dessinée pour un fond
   * clair : sans lui, posée sur le violet de l'arène, elle disparaît. Repli sur
   * le crème neutre quand la couleur n'est pas connue.
   */
  pastel: string
  trophies: number
  peakTrophies: number
  rank: SubjectRank
  /** Ouverte au duel CLASSÉ (un chapitre terminé, cf. lib/subject-unlock). */
  unlocked: boolean
  games: RosterGame[]
}

/** Ce que lancera le bouton COMBAT sur la matière choisie. */
export type DuelTarget = {
  href: string
  /** Nommé tel quel sur le bouton : « Duel classé », ou le nom du jeu. */
  label: string
  /** Vrai quand c'est le duel classé de la matière (le Programme). */
  isRanked: boolean
  /** Trophées que rapportera la victoire — la pastille qui fait arbitrer. */
  nextWin: number
}

/** Le nom du duel classé, partout où il s'affiche. Une seule formulation. */
export const RANKED_LABEL = 'Duel classé'

/**
 * Le plateau complet, RANGÉ PAR ORDRE ALPHABÉTIQUE.
 *
 * L'ordre du catalogue (Histoire-Géo, Français, Maths…) n'a de sens que pour
 * qui l'a écrit : sur une roulette où l'on ne voit qu'une matière à la fois, le
 * seul ordre qu'un élève puisse ANTICIPER est l'alphabet — il sait avant de
 * tourner combien de crans le séparent de « Maths ». Un ordre par trophées se
 * réorganiserait sous ses doigts d'une semaine à l'autre, ce qui est pire que
 * n'importe quel ordre fixe.
 *
 * Le ROSTER est la colonne vertébrale et non le ladder : il existe toujours,
 * même pour un visiteur non connecté (`buildRoster(new Map())`), alors que le
 * ladder n'est construit qu'une fois l'élève identifié. Prendre le ladder pour
 * base aurait vidé la roulette de l'arène sur le premier écran que voit un
 * visiteur — celui qu'on veut justement montrer avant de demander un compte.
 */
export function buildDuelBoard(
  roster: readonly RosterSubject[],
  ladders: readonly SubjectLadder[] = [],
  options: {
    /** Couleur de matière du catalogue (`subjects.color`), par slug. */
    colorBySlug?: ReadonlyMap<string, string>
  } = {},
): DuelSubject[] {
  const bySlug = new Map(ladders.map((l) => [l.slug, l]))

  return roster
    .map((entry) => {
      const ladder = bySlug.get(entry.slug)
      return {
        subject: entry.subject,
        slug: entry.slug,
        emoji: entry.emoji,
        vignette: subjectVignette(entry.slug) ?? null,
        pastel: subjectPastel(options.colorBySlug?.get(entry.slug) ?? ''),
        trophies: ladder?.trophies ?? entry.total,
        // Sans ladder, le pic vaut le compteur du jour : annoncer un record plus
        // bas que le score affiché juste à côté serait un mensonge visible.
        peakTrophies: ladder?.peakTrophies ?? entry.total,
        rank: ladder?.rank ?? subjectRankFor(entry.total),
        unlocked: ladder?.unlocked ?? false,
        games: entry.games,
      }
    })
    .sort((a, b) =>
      // `localeCompare` en français : sans lui « Français » passerait après
      // « Histoire-Géo » (le Ç trie après le Z en ordre de code).
      a.subject.localeCompare(b.subject, 'fr', { sensitivity: 'base' }),
    )
}

/** L'index d'un slug dans le plateau — 0 (la première matière) s'il est absent. */
export function boardIndex(
  board: readonly DuelSubject[],
  slug?: string | null,
): number {
  if (!slug) return 0
  const index = board.findIndex((entry) => entry.slug === slug)
  return index === -1 ? 0 : index
}

/** Le jeu « Ton programme » de la matière, c'est-à-dire son duel classé. */
export function rankedGame(entry: DuelSubject): RosterGame | null {
  return entry.games.find((game) => game.isProgramme) ?? null
}

/**
 * Pourquoi le duel CLASSÉ n'est pas ouvert sur cette matière, ou null s'il
 * l'est. Deux verrous, et deux phrases distinctes : ils ne se lèvent pas de la
 * même manière, et les confondre enverrait l'élève refaire un chapitre qu'il a
 * déjà terminé.
 */
export function rankedBlockedReason(entry: DuelSubject): string | null {
  if (!entry.unlocked) return LOCKED_HINT
  const programme = rankedGame(entry)
  if (!programme || !programme.href) {
    return programme?.unavailable ?? `${entry.subject} arrive bientôt en duel`
  }
  return null
}

/**
 * Ce que lance DUEL sur cette matière — LE DUEL DE LA MATIÈRE, toujours, dès
 * lors que son programme est jouable dans la classe de l'élève.
 *
 * CE QUI A CHANGÉ, ET POURQUOI. Le duel ne partait sur le programme de la
 * matière que si le CLASSÉ y était ouvert (`unlocked`, un chapitre terminé) ;
 * sinon il basculait sur le jeu de salon le plus rentable. Résultat vu à
 * l'usage : on choisissait « Français » sur la roulette, on tapait le bouton de
 * combat, et on tombait sur une Chasse à la faute. Le bouton central de l'arène
 * ne tenait pas sa promesse — il envoyait dans un mode de jeu, pas en duel dans
 * la matière demandée.
 *
 * Le verrou `unlocked` n'a jamais gardé la ROUTE, seulement le classement :
 * `/defi/programme/[matiere]` apparie un adversaire (fantôme d'ami, joueur à
 * portée de trophées, ou entraîneur calibré) pour n'importe qui. Il ne
 * commande donc plus la destination, seulement le NOM de ce qui se joue :
 * « Duel classé » quand les trophées comptent, le nom du programme sinon.
 *
 * LE REPLI RESTE — mais à sa vraie place : quand la matière n'a PAS de
 * programme jouable dans cette classe (`programmeHref` nul, cf. `lib/defi/
 * roster`). Là, un jeu de salon est bien la seule chose à lancer, et c'est
 * toujours ce qui évite d'avoir un écran d'accueil sans jeu le jour de
 * l'inscription. Ce qui a disparu, c'est le détour quand le duel existait.
 *
 * À gain égal, le compteur le plus bas gagne : on pousse vers ce qui n'a jamais
 * été travaillé, exactement comme `bestNextGame` sur la Route.
 */
export function duelTarget(entry: DuelSubject): DuelTarget | null {
  const programme = rankedGame(entry)
  if (programme?.href) {
    return {
      href: programme.href,
      label: entry.unlocked ? RANKED_LABEL : programme.name,
      isRanked: entry.unlocked,
      nextWin: programme.nextWin,
    }
  }

  let best: RosterGame | null = null
  for (const game of entry.games) {
    if (!game.href || game.isProgramme) continue
    if (
      best === null ||
      game.nextWin > best.nextWin ||
      (game.nextWin === best.nextWin && game.trophies < best.trophies)
    ) {
      best = game
    }
  }
  if (!best || !best.href) return null

  return {
    href: best.href,
    label: best.name,
    isRanked: false,
    nextWin: best.nextWin,
  }
}
