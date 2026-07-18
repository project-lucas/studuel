// Chasse aux éléments — la banque du salon Physique-Chimie.
// Le nom d'un élément, quatre symboles : retrouve le bon. Les leurres sont les
// symboles des autres éléments (jamais inventés). Les pièges sont là où le
// symbole ne suit pas le nom français (fer → Fe, or → Au, plomb → Pb…).
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type Element = { name: string; symbol: string }

export const ELEMENTS: Element[] = [
  { name: 'Hydrogène', symbol: 'H' },
  { name: 'Hélium', symbol: 'He' },
  { name: 'Carbone', symbol: 'C' },
  { name: 'Azote', symbol: 'N' },
  { name: 'Oxygène', symbol: 'O' },
  { name: 'Fluor', symbol: 'F' },
  { name: 'Néon', symbol: 'Ne' },
  { name: 'Sodium', symbol: 'Na' },
  { name: 'Magnésium', symbol: 'Mg' },
  { name: 'Aluminium', symbol: 'Al' },
  { name: 'Silicium', symbol: 'Si' },
  { name: 'Phosphore', symbol: 'P' },
  { name: 'Soufre', symbol: 'S' },
  { name: 'Chlore', symbol: 'Cl' },
  { name: 'Potassium', symbol: 'K' },
  { name: 'Calcium', symbol: 'Ca' },
  { name: 'Fer', symbol: 'Fe' },
  { name: 'Cuivre', symbol: 'Cu' },
  { name: 'Zinc', symbol: 'Zn' },
  { name: 'Argent', symbol: 'Ag' },
  { name: 'Étain', symbol: 'Sn' },
  { name: 'Or', symbol: 'Au' },
  { name: 'Mercure', symbol: 'Hg' },
  { name: 'Plomb', symbol: 'Pb' },
  { name: 'Iode', symbol: 'I' },
  { name: 'Lithium', symbol: 'Li' },
  { name: 'Nickel', symbol: 'Ni' },
  { name: 'Cobalt', symbol: 'Co' },
]

// Astuces de mémorisation pour les symboles « traîtres » (issus du latin).
const LATIN_HINT: Record<string, string> = {
  Na: 'du latin natrium',
  K: 'du latin kalium',
  Fe: 'du latin ferrum',
  Cu: 'du latin cuprum',
  Ag: 'du latin argentum',
  Sn: 'du latin stannum',
  Au: 'du latin aurum',
  Hg: 'du latin hydrargyrum',
  Pb: 'du latin plumbum',
}

export function buildChasseElementsPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`chasse-elements:${seed}`)
  const pool = shuffleWith(rng, ELEMENTS).slice(0, Math.min(count, ELEMENTS.length))
  return pool.map((e) => {
    const decoys = pickDistinct(
      rng,
      ELEMENTS.filter((o) => o.symbol !== e.symbol).map((o) => o.symbol),
      3,
    )
    const options = shuffleWith(rng, [e.symbol, ...decoys])
    const hint = LATIN_HINT[e.symbol]
    return {
      id: `jx-elt-${e.symbol}`,
      prompt: `Quel est le symbole de l’élément « ${e.name} » ?`,
      options,
      correctIndex: options.indexOf(e.symbol),
      explanation: `${e.name} → ${e.symbol}${hint ? ` (${hint})` : ''}.`,
      subject: 'Physique-Chimie',
    }
  })
}
