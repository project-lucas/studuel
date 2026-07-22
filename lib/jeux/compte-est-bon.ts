// Le compte est bon — la banque du salon Maths, en calcul construit.
//
// Six plaques, un nombre cible : on combine les plaques deux à deux (+, −, ×, ÷)
// jusqu'à tomber sur la cible. Rien à voir avec un QCM — c'est le seul jeu du
// catalogue où l'élève FABRIQUE sa réponse au lieu de la choisir.
//
// Les tirages sont générés À L'ENVERS : on part des plaques, on enchaîne des
// opérations valides au hasard (piloté par la graine), et le résultat obtenu
// DEVIENT la cible. Un tirage est donc solvable par construction — on ne peut
// pas servir un « compte » impossible, et la solution de référence est connue.
import { seededRng } from '@/lib/defi-modes'
import { intBetween, shuffleWith } from '@/lib/jeux/shuffle'

/** Les opérations autorisées. La division n'est offerte que si elle tombe juste. */
export type CountdownOp = '+' | '−' | '×' | '÷'

export const COUNTDOWN_OPS: CountdownOp[] = ['+', '−', '×', '÷']

/** Une étape de la solution de référence, en toutes lettres. */
export type CountdownStep = { a: number; op: CountdownOp; b: number; result: number }

export type CountdownPuzzle = {
  id: string
  /** Le nombre à atteindre. */
  target: number
  /** Les six plaques du tirage. */
  tiles: number[]
  /** Une solution (il en existe souvent d'autres) — sert d'indice et de test. */
  solution: CountdownStep[]
}

/** Les grosses plaques du jeu télévisé. */
export const BIG_TILES = [25, 50, 75, 100]
/** Nombre de plaques d'un tirage. */
export const TILE_COUNT = 6
/** Bornes de la cible : au-dessous c'est trivial, au-dessus c'est décourageant. */
export const TARGET_MIN = 101
export const TARGET_MAX = 899

/**
 * Applique une opération, ou renvoie null si elle n'est pas valide dans les
 * règles du jeu : pas de résultat négatif ou nul, pas de division inexacte, et
 * aucune opération neutre (×1, ÷1) qui gaspillerait une plaque pour rien.
 */
export function applyOp(a: number, op: CountdownOp, b: number): number | null {
  switch (op) {
    case '+':
      return a + b
    case '−':
      return a - b > 0 ? a - b : null
    case '×':
      return a === 1 || b === 1 ? null : a * b
    case '÷':
      return b !== 0 && b !== 1 && a % b === 0 && a / b > 1 ? a / b : null
  }
}

/** Le tirage des six plaques : `bigCount` grosses plaques, le reste en petites. */
function drawTiles(rng: () => number, bigCount: number): number[] {
  const bigs = shuffleWith(rng, BIG_TILES).slice(0, bigCount)
  const smalls = Array.from({ length: TILE_COUNT - bigCount }, () =>
    intBetween(rng, 1, 10),
  )
  return shuffleWith(rng, [...bigs, ...smalls])
}

/**
 * Marche aléatoire : combine les plaques jusqu'à obtenir une valeur utilisable
 * comme cible. Renvoie null si la marche n'aboutit pas dans les bornes — l'appelant
 * relance avec une autre graine.
 */
function walk(rng: () => number, tiles: number[]): CountdownPuzzle['solution'] | null {
  let pool = [...tiles]
  const steps: CountdownStep[] = []
  // 3 à 5 opérations : en dessous le compte est trop facile, au-dessus il ne
  // reste plus assez de plaques pour laisser des chemins alternatifs.
  const wanted = intBetween(rng, 3, 5)

  for (let s = 0; s < wanted && pool.length >= 2; s++) {
    // On tente quelques couples avant d'abandonner cette marche : selon le
    // tirage, beaucoup de combinaisons sont invalides (division inexacte…).
    let done = false
    for (let attempt = 0; attempt < 24 && !done; attempt++) {
      const i = intBetween(rng, 0, pool.length - 1)
      let j = intBetween(rng, 0, pool.length - 1)
      if (i === j) j = (j + 1) % pool.length
      const [a, b] = pool[i] >= pool[j] ? [pool[i], pool[j]] : [pool[j], pool[i]]
      const op = COUNTDOWN_OPS[intBetween(rng, 0, COUNTDOWN_OPS.length - 1)]
      const result = applyOp(a, op, b)
      if (result === null || result > 9999) continue
      pool = pool.filter((_, k) => k !== i && k !== j)
      pool.push(result)
      steps.push({ a, op, b, result })
      done = true
    }
    if (!done) break
  }

  if (steps.length < 2) return null
  const target = steps[steps.length - 1].result
  return target >= TARGET_MIN && target <= TARGET_MAX ? steps : null
}

/** Un tirage solvable, ou null si la graine n'aboutit pas. */
export function buildPuzzle(id: string, seed: string): CountdownPuzzle | null {
  const rng = seededRng(seed)
  // Une ou deux grosses plaques : c'est ce qui rend les grandes cibles atteignables.
  const tiles = drawTiles(rng, intBetween(rng, 1, 2))
  const solution = walk(rng, tiles)
  if (!solution) return null
  return {
    id,
    target: solution[solution.length - 1].result,
    tiles,
    solution,
  }
}

/**
 * `count` tirages solvables. Chaque tirage retente jusqu'à 40 graines dérivées
 * avant d'être abandonné — en pratique une poignée suffit, mais la garde évite
 * toute boucle infinie si les bornes venaient à changer.
 */
export function buildComptePool(seed: string, count: number): CountdownPuzzle[] {
  const puzzles: CountdownPuzzle[] = []
  for (let i = 0; puzzles.length < count && i < count * 40; i++) {
    const puzzle = buildPuzzle(`compte#${puzzles.length}`, `${seed}#${i}`)
    if (puzzle) puzzles.push(puzzle)
  }
  return puzzles
}
