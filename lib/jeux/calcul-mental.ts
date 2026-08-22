// Calcul mental éclair — la banque du salon Maths.
// Pas de dataset statique : un GÉNÉRATEUR déterministe fabrique les opérations
// à partir de la graine. Les leurres sont des erreurs plausibles (voisins du bon
// résultat, retenue oubliée, priorité inversée), jamais des nombres au hasard —
// c'est ce qui rend le choix piégeux. Même graine → même feuille d'opérations,
// donc testable.
//
// C'est aussi la première banque GRADUÉE de l'app : le palier (lib/jeux/paliers)
// ne change pas seulement le chrono, il change ce qu'on calcule. Un 6e reçoit
// ses tables de 2 et de 5, un Terminale des pourcentages et des priorités
// opératoires. Sans cela, les cinq paliers d'un même jeu auraient servi la même
// feuille de plus en plus vite — un défi de rapidité de lecture, pas de calcul.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { intBetween, pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'
import { DEFAULT_PALIER, type PalierLevel } from '@/lib/jeux/paliers'

export const CALCUL_OPTIONS = 4

/**
 * Ce que la banque sert à chaque palier — affiché tel quel sur la carte du jeu.
 * Chaque ligne doit décrire EXACTEMENT ce que `drawOperation` tire au palier
 * correspondant : c'est la promesse faite avant de lancer la partie.
 */
export const CALCUL_TIER_BRIEF: Record<PalierLevel, string> = {
  1: 'Tables de 2, 3, 5 et 10 · additions sans retenue',
  2: 'Additions à retenue · tables jusqu’à 10',
  3: 'Soustractions à emprunt · tables jusqu’à 12',
  4: 'Nombres à 3 chiffres · ×11, ×15, ×25 · pourcentages simples',
  5: 'Produits à deux chiffres · pourcentages · priorités opératoires',
}

/**
 * Une opération tirée. `label` est l'expression telle qu'elle s'affiche
 * (« 48 × 7 », « 25 % de 80 », « 7 + 6 × 4 ») : les paliers hauts sortent de la
 * forme « a op b », il faut donc que le générateur porte le texte lui-même.
 * `traps` sont les faux résultats PROPRES à cette opération — la priorité
 * inversée, la retenue oubliée — les plus crédibles de tous.
 */
type Operation = {
  key: string
  label: string
  answer: number
  traps?: number[]
  tip?: string
}

function drawOperation(rng: () => number, tier: number): Operation {
  // Au-delà du dernier palier, la banque continue de durcir toute seule : c'est
  // ce qui rend l'ÉPREUVE ULTIME possible (lib/jeux/ultime), et ce qui distingue
  // un jeu à générateur d'un jeu à liste finie.
  if (tier >= 6) return drawAuDela(rng, tier)
  switch (tier) {
    case 1:
      return drawEveil(rng)
    case 2:
      return drawApprenti(rng)
    case 4:
      return drawExpert(rng)
    case 5:
      return drawMaitre(rng)
    default:
      return drawConfirme(rng)
  }
}

// Palier 1 — les briques : additions qui ne débordent pas la dizaine,
// soustractions sous 20, et les quatre tables qu'on apprend en premier.
function drawEveil(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 2)
  if (kind === 0) {
    // Unités bornées à 8 pour qu'il reste toujours de la place sous la dizaine :
    // sans cette borne, un `a` en 9 forcerait un tirage vide et rendrait la
    // retenue par la fenêtre qu'on vient de fermer.
    const a = intBetween(rng, 1, 4) * 10 + intBetween(rng, 0, 8)
    const b = intBetween(rng, 1, 9 - (a % 10))
    return { key: `${a}+${b}`, label: `${a} + ${b}`, answer: a + b }
  }
  if (kind === 1) {
    const a = intBetween(rng, 8, 20)
    const b = intBetween(rng, 1, a - 1)
    return { key: `${a}-${b}`, label: `${a} − ${b}`, answer: a - b }
  }
  const table = [2, 3, 5, 10][intBetween(rng, 0, 3)] as number
  const b = intBetween(rng, 2, 10)
  return { key: `${table}x${b}`, label: `${table} × ${b}`, answer: table * b }
}

// Palier 2 — la retenue arrive, les tables vont jusqu'à 10.
function drawApprenti(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 2)
  if (kind === 0) {
    const a = intBetween(rng, 14, 49)
    // Force la retenue : les unités dépassent 10 ensemble.
    const b = intBetween(rng, 10 - (a % 10), 49)
    return {
      key: `${a}+${b}`,
      label: `${a} + ${b}`,
      answer: a + b,
      traps: [a + b - 10],
      tip: 'Pense à la retenue.',
    }
  }
  if (kind === 1) {
    const a = intBetween(rng, 25, 69)
    const b = intBetween(rng, 6, a - 5)
    return { key: `${a}-${b}`, label: `${a} − ${b}`, answer: a - b }
  }
  const a = intBetween(rng, 2, 10)
  const b = intBetween(rng, 2, 10)
  return { key: `${a}x${b}`, label: `${a} × ${b}`, answer: a * b }
}

// Palier 3 — le réglage d'origine du jeu : deux chiffres partout, emprunt à la
// soustraction, tables jusqu'à 12.
function drawConfirme(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 2)
  if (kind === 0) {
    const a = intBetween(rng, 13, 89)
    const b = intBetween(rng, 12, 89)
    return { key: `${a}+${b}`, label: `${a} + ${b}`, answer: a + b }
  }
  if (kind === 1) {
    const a = intBetween(rng, 35, 99)
    const b = intBetween(rng, 11, a - 1)
    return { key: `${a}-${b}`, label: `${a} − ${b}`, answer: a - b }
  }
  const a = intBetween(rng, 3, 12)
  const b = intBetween(rng, 3, 12)
  return { key: `${a}x${b}`, label: `${a} × ${b}`, answer: a * b }
}

// Palier 4 — on change d'ordre de grandeur : trois chiffres, les tables qui ne
// s'apprennent pas par cœur (×11, ×15, ×25) et les pourcentages usuels.
function drawExpert(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 3)
  if (kind === 0) {
    const a = intBetween(rng, 45, 199)
    const b = intBetween(rng, 25, 99)
    return { key: `${a}+${b}`, label: `${a} + ${b}`, answer: a + b }
  }
  if (kind === 1) {
    const a = intBetween(rng, 120, 399)
    const b = intBetween(rng, 15, 119)
    return { key: `${a}-${b}`, label: `${a} − ${b}`, answer: a - b }
  }
  if (kind === 2) {
    const a = [11, 12, 15, 25][intBetween(rng, 0, 3)] as number
    const b = intBetween(rng, 3, 12)
    return { key: `${a}x${b}`, label: `${a} × ${b}`, answer: a * b }
  }
  // Le multiple de 20 garantit un résultat entier pour les quatre pourcentages.
  const n = intBetween(rng, 1, 10) * 20
  const p = [10, 25, 50, 75][intBetween(rng, 0, 3)] as number
  return {
    key: `${p}%${n}`,
    label: `${p} % de ${n}`,
    answer: (n * p) / 100,
    traps: [n / 10, n / 4],
    tip: `${p} % de ${n}, c'est ${n} ÷ ${100 / p}${p === 75 ? ' × 3' : ''}.`,
  }
}

// Palier 5 — le palier des records : produits à deux chiffres, pourcentages
// moins ronds, et la priorité opératoire, dont le leurre naturel (« on calcule
// de gauche à droite ») est le piège le plus courant du collège au lycée.
function drawMaitre(rng: () => number): Operation {
  const kind = intBetween(rng, 0, 3)
  if (kind === 0) {
    const a = intBetween(rng, 125, 899)
    const b = intBetween(rng, 125, 899)
    return { key: `${a}+${b}`, label: `${a} + ${b}`, answer: a + b }
  }
  if (kind === 1) {
    const a = intBetween(rng, 12, 25)
    const b = intBetween(rng, 12, 19)
    return { key: `${a}x${b}`, label: `${a} × ${b}`, answer: a * b }
  }
  if (kind === 2) {
    const n = intBetween(rng, 1, 12) * 20
    const p = [15, 20, 30, 60][intBetween(rng, 0, 3)] as number
    return {
      key: `${p}%${n}`,
      label: `${p} % de ${n}`,
      answer: (n * p) / 100,
      traps: [(n * (p + 10)) / 100, n / 10],
      tip: `${p} % de ${n} = ${n} × ${p} ÷ 100.`,
    }
  }
  const a = intBetween(rng, 3, 20)
  const b = intBetween(rng, 3, 9)
  const c = intBetween(rng, 3, 9)
  return {
    key: `${a}+${b}x${c}`,
    label: `${a} + ${b} × ${c}`,
    answer: a + b * c,
    // Le résultat de qui additionne d'abord : le leurre le plus crédible du lot.
    traps: [(a + b) * c],
    tip: 'La multiplication passe avant l’addition.',
  }
}

/**
 * Croissance des opérandes au-delà du dernier palier, BORNÉE.
 *
 * Sans borne, le niveau 40 demanderait des additions à six chiffres : ce ne
 * serait plus du calcul mental mais une épreuve de patience, et le classement
 * mesurerait la tolérance à l'absurde. Passé ce plafond, c'est le CHRONO qui
 * continue de se resserrer — et il suffit largement.
 */
const MAX_CROISSANCE = 6

/**
 * Les crans au-delà du palier Maître, pour l'épreuve ultime. Mêmes familles
 * d'opérations qu'au palier 5, mais des nombres qui grandissent, plus une
 * quatrième famille — la double opération — que rien d'autre ne sert.
 */
function drawAuDela(rng: () => number, tier: number): Operation {
  const g = Math.min(MAX_CROISSANCE, tier - 5)
  const kind = intBetween(rng, 0, 3)
  if (kind === 0) {
    const a = intBetween(rng, 200 * g, 400 + 900 * g)
    const b = intBetween(rng, 150 * g, 300 + 700 * g)
    return { key: `${a}+${b}`, label: `${a} + ${b}`, answer: a + b }
  }
  if (kind === 1) {
    const a = intBetween(rng, 12 + 3 * g, 25 + 6 * g)
    const b = intBetween(rng, 12, 19 + 3 * g)
    return { key: `${a}x${b}`, label: `${a} × ${b}`, answer: a * b }
  }
  if (kind === 2) {
    // Multiple de 20 : le résultat reste entier pour tous les pourcentages
    // multiples de 5 servis ici.
    const n = intBetween(rng, 1, 10 + 5 * g) * 20
    const p = [15, 35, 45, 65, 70, 85][intBetween(rng, 0, 5)] as number
    return {
      key: `${p}%${n}`,
      label: `${p} % de ${n}`,
      answer: (n * p) / 100,
      traps: [(n * (p + 10)) / 100, n / 10],
      tip: `${p} % de ${n} = ${n} × ${p} ÷ 100.`,
    }
  }
  // La double opération : deux priorités à tenir dans la tête à la fois.
  const a = intBetween(rng, 3, 9 + 2 * g)
  const b = intBetween(rng, 3, 9 + g)
  const c = intBetween(rng, 4, 12 + 2 * g)
  const d = intBetween(rng, 2, 9 + g)
  return {
    key: `${a}x${b}+${c}x${d}`,
    label: `${a} × ${b} + ${c} × ${d}`,
    answer: a * b + c * d,
    // Qui additionne avant de multiplier, et qui n'en fait qu'une des deux.
    traps: [(a + b) * (c + d), a * b + c + d],
    tip: 'Les deux produits d’abord, la somme ensuite.',
  }
}

/**
 * Leurres : des résultats FAUX mais crédibles. Les pièges propres à l'opération
 * (priorité inversée, retenue oubliée) passent en premier ; on complète avec les
 * voisins du bon résultat, à un écart proportionné à l'ordre de grandeur — ±1
 * sur 847 ne trompe personne, ±100 sur 12 non plus.
 */
function decoysFor(
  rng: () => number,
  answer: number,
  traps: number[] = [],
): number[] {
  const scale = answer >= 300 ? 100 : answer >= 60 ? 10 : 1
  const raw = [
    ...traps,
    answer + 1,
    answer - 1,
    answer + scale,
    answer - scale,
    answer + 2 * scale,
    answer - 2 * scale,
    answer + scale - 1,
    answer + 2,
    answer - 2,
  ].filter((n) => n > 0 && n !== answer && Number.isInteger(n))
  return pickDistinct(rng, raw, CALCUL_OPTIONS - 1)
}

/**
 * @param tier Cran de difficulté de la banque. 1 à 5 = les paliers
 *   (`lib/jeux/paliers`) ; au-delà, l'épreuve ultime, qui n'a pas de plafond.
 */
export function buildCalculMentalPool(
  seed: string,
  count = 24,
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] {
  const rng = seededRng(`calcul:${tier}:${seed}`)
  const questions: ModeQuestion[] = []
  const seen = new Set<string>()
  let guard = 0
  while (questions.length < count && guard < count * 8) {
    guard++
    const o = drawOperation(rng, tier)
    if (seen.has(o.key)) continue
    seen.add(o.key)
    const decoys = decoysFor(rng, o.answer, o.traps)
    if (decoys.length < CALCUL_OPTIONS - 1) continue
    const options = shuffleWith(rng, [o.answer, ...decoys]).map(String)
    questions.push({
      id: `jx-calc-${o.key}`,
      prompt: `Combien font ${o.label} ?`,
      options,
      correctIndex: options.indexOf(String(o.answer)),
      explanation: `${o.label} = ${o.answer}.${o.tip ? ` ${o.tip}` : ''}`,
      subject: 'Maths',
    })
  }
  return questions
}
