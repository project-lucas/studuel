// Suite logique — la banque du salon Maths.
// Générateur déterministe de suites simples (arithmétique, géométrique, pas
// croissant). On montre les 4 premiers termes, on devine le 5e. Les leurres
// sont les pièges classiques : le pas appliqué une fois de trop / de moins, ou
// le mauvais type de suite. Même graine → même feuille, donc testable.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { intBetween, pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export const SUITE_OPTIONS = 4

// Une suite tirée : ses 4 termes visibles, le terme à trouver, et le libellé
// de la règle (pour l'explication de fin).
type Sequence = { terms: number[]; answer: number; rule: string }

function drawSequence(rng: () => number): Sequence {
  const kind = intBetween(rng, 0, 2)
  if (kind === 0) {
    // Arithmétique : on ajoute un pas constant.
    const start = intBetween(rng, 1, 12)
    const step = intBetween(rng, 2, 9)
    const terms = [0, 1, 2, 3].map((i) => start + i * step)
    return {
      terms,
      answer: start + 4 * step,
      rule: `on ajoute ${step} à chaque fois`,
    }
  }
  if (kind === 1) {
    // Géométrique : on multiplie par une raison constante.
    const start = intBetween(rng, 1, 4)
    const ratio = intBetween(rng, 2, 3)
    const terms = [0, 1, 2, 3].map((i) => start * ratio ** i)
    return {
      terms,
      answer: start * ratio ** 4,
      rule: `on multiplie par ${ratio} à chaque fois`,
    }
  }
  // Pas croissant : +1, +2, +3, +4… (suite des différences).
  const start = intBetween(rng, 1, 8)
  const first = intBetween(rng, 1, 3)
  const terms = [start]
  for (let i = 1; i < 4; i++) terms.push(terms[i - 1] + first + i - 1)
  const answer = terms[3] + first + 3
  return { terms, answer, rule: `le pas augmente de 1 à chaque étape` }
}

// Leurres : voisins du bon terme (le piège du « un cran trop loin »), positifs
// et distincts.
function decoysFor(rng: () => number, seq: Sequence): number[] {
  const last = seq.terms[3]
  const raw = [
    seq.answer + 1,
    seq.answer - 1,
    seq.answer + (seq.answer - last),
    last + (seq.answer - last) - 1,
    seq.answer + 2,
    seq.answer - 2,
  ].filter((n) => n > 0 && n !== seq.answer)
  return pickDistinct(rng, raw, SUITE_OPTIONS - 1)
}

export function buildSuiteLogiquePool(seed: string, count = 20): ModeQuestion[] {
  const rng = seededRng(`suite:${seed}`)
  const questions: ModeQuestion[] = []
  const seen = new Set<string>()
  let guard = 0
  while (questions.length < count && guard < count * 8) {
    guard++
    const seq = drawSequence(rng)
    const key = seq.terms.join('-')
    if (seen.has(key)) continue
    seen.add(key)
    const decoys = decoysFor(rng, seq)
    if (decoys.length < SUITE_OPTIONS - 1) continue
    const options = shuffleWith(rng, [seq.answer, ...decoys]).map(String)
    questions.push({
      id: `jx-suite-${key}`,
      prompt: `Quel nombre continue la suite : ${seq.terms.join(', ')}, … ?`,
      options,
      correctIndex: options.indexOf(String(seq.answer)),
      explanation: `La règle : ${seq.rule}. Le terme suivant est ${seq.answer}.`,
      subject: 'Maths',
    })
  }
  return questions
}
