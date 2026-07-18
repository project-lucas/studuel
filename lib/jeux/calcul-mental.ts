// Calcul mental éclair — la banque du salon Maths.
// Pas de dataset statique : un GÉNÉRATEUR déterministe fabrique les opérations
// à partir de la graine (addition, soustraction sans négatif, multiplication
// dans les tables). Les leurres sont des erreurs plausibles (voisins du bon
// résultat, retenue oubliée), jamais des nombres au hasard — c'est ce qui rend
// le choix piégeux. Même graine → même feuille d'opérations, donc testable.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { intBetween, pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export const CALCUL_OPTIONS = 4

type Op = '+' | '−' | '×'

// Une opération tirée : les opérandes, le signe et le bon résultat.
type Operation = { a: number; b: number; op: Op; answer: number }

function drawOperation(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 2)
  if (kind === 0) {
    // Addition de deux nombres à deux chiffres (avec retenue possible).
    const a = intBetween(rng, 13, 89)
    const b = intBetween(rng, 12, 89)
    return { a, b, op: '+', answer: a + b }
  }
  if (kind === 1) {
    // Soustraction : le plus grand d'abord, jamais de résultat négatif.
    const a = intBetween(rng, 35, 99)
    const b = intBetween(rng, 11, a - 1)
    return { a, b, op: '−', answer: a - b }
  }
  // Multiplication dans les tables (jusqu'à 12) — le nerf du calcul mental.
  const a = intBetween(rng, 3, 12)
  const b = intBetween(rng, 3, 12)
  return { a, b, op: '×', answer: a * b }
}

// Leurres : des résultats FAUX mais crédibles (±1, ±2, ±10, la retenue oubliée
// en dizaine), positifs et distincts du bon résultat.
function decoysFor(rng: () => number, answer: number): number[] {
  const raw = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 10,
    answer - 10,
    answer + 9,
  ].filter((n) => n > 0 && n !== answer)
  return pickDistinct(rng, raw, CALCUL_OPTIONS - 1)
}

export function buildCalculMentalPool(seed: string, count = 24): ModeQuestion[] {
  const rng = seededRng(`calcul:${seed}`)
  const questions: ModeQuestion[] = []
  const seen = new Set<string>()
  let guard = 0
  while (questions.length < count && guard < count * 8) {
    guard++
    const o = drawOperation(rng)
    const key = `${o.a}${o.op}${o.b}`
    if (seen.has(key)) continue
    seen.add(key)
    const decoys = decoysFor(rng, o.answer)
    if (decoys.length < CALCUL_OPTIONS - 1) continue
    const options = shuffleWith(rng, [o.answer, ...decoys]).map(String)
    questions.push({
      id: `jx-calc-${key}`,
      prompt: `Combien font ${o.a} ${o.op} ${o.b} ?`,
      options,
      correctIndex: options.indexOf(String(o.answer)),
      explanation: `${o.a} ${o.op} ${o.b} = ${o.answer}.`,
      subject: 'Maths',
    })
  }
  return questions
}
