// Les jeux de REMISE EN ORDRE — une interaction que le catalogue promettait
// depuis toujours sans jamais la livrer.
//
// « La Frise folle » (5 événements à remettre dans l'ordre chronologique) et
// « Phrase en vrac » (remets les mots dans l'ordre) étaient marqués « Bientôt »
// parce qu'aucune de nos tables de jeu ne savait faire autre chose qu'un QCM.
// Ce module apporte la brique manquante : un TABLEAU d'éléments mélangés qu'on
// remet en place en les touchant dans le bon ordre.
//
// Tout est pur : le tirage est déterministe (même graine → même tableau), et la
// validation d'un tap ne dépend que de l'état passé en argument.
import { seededRng } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'

/** Un élément à placer : ce qu'on lit sur la tuile, et ce qui se révèle après. */
export type OrderItem = {
  /** Le texte de la tuile (un événement, un mot). */
  label: string
  /**
   * Le repère qui se dévoile une fois la tuile posée (une date, une fonction
   * grammaticale). C'est là que le jeu apprend quelque chose plutôt que de
   * seulement tester.
   */
  hint: string
}

/** Un tableau à reconstituer. */
export type OrderBoard = {
  id: string
  /** La consigne du tableau (« Des Gaulois à la Révolution »). */
  prompt: string
  /** Les tuiles, DANS L'ORDRE D'AFFICHAGE (mélangé). */
  items: OrderItem[]
  /**
   * L'ordre attendu, exprimé en index de `items`. `solution[0]` est l'index de
   * la tuile à toucher en premier.
   */
  solution: number[]
}

/**
 * La tuile attendue au rang `placed` (nombre de tuiles déjà posées), ou null si
 * le tableau est complet.
 */
export function expectedIndex(board: OrderBoard, placed: number): number | null {
  return placed < board.solution.length ? board.solution[placed] : null
}

/** Ce tap est-il le bon ? */
export function isNextInOrder(
  board: OrderBoard,
  placed: number,
  tapped: number,
): boolean {
  return expectedIndex(board, placed) === tapped
}

/** Le tableau est-il terminé ? */
export function isBoardComplete(board: OrderBoard, placed: number): boolean {
  return placed >= board.solution.length
}

/**
 * Construit un tableau à partir d'une suite d'éléments DÉJÀ dans le bon ordre :
 * on mélange l'affichage et on en déduit la solution. C'est la seule façon de
 * garantir que solution et items ne divergent jamais.
 */
export function boardFromOrdered(
  id: string,
  prompt: string,
  ordered: OrderItem[],
  seed: string,
): OrderBoard {
  // On mélange des INDEX, pas les éléments : la solution se lit ensuite
  // directement dans la permutation.
  const positions = shuffleWith(
    seededRng(seed),
    ordered.map((_, i) => i),
  )
  const items = positions.map((i) => ordered[i])
  // `solution[rang]` = la position, dans `items`, de l'élément de ce rang.
  const solution = ordered.map((_, rank) => positions.indexOf(rank))
  return { id, prompt, items, solution }
}

/**
 * Tire `count` tableaux dans un jeu de suites ordonnées, sans répétition tant
 * que le stock le permet. Déterministe.
 */
export function drawBoards(
  source: Array<{ id: string; prompt: string; ordered: OrderItem[] }>,
  count: number,
  seed: string,
): OrderBoard[] {
  const picked = shuffleWith(seededRng(`${seed}#tirage`), [...source])
  const boards: OrderBoard[] = []
  for (let i = 0; i < count; i++) {
    const entry = picked[i % picked.length]
    boards.push(
      boardFromOrdered(
        `${entry.id}#${i}`,
        entry.prompt,
        entry.ordered,
        `${seed}#${entry.id}#${i}`,
      ),
    )
  }
  return boards
}
