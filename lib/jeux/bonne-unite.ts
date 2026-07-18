// La bonne unité — la banque du salon Physique-Chimie.
// Une grandeur physique, quatre unités : associe la bonne. Les leurres sont
// les unités des autres grandeurs (jamais inventées) — le piège est de
// confondre des unités électriques voisines (volt / ampère / ohm / watt…).
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

// La grandeur, son unité affichée (nom + symbole) et l'astuce.
export type Quantity = {
  id: string
  grandeur: string
  unit: string
  tip: string
}

export const QUANTITIES: Quantity[] = [
  { id: 'longueur', grandeur: 'une longueur', unit: 'le mètre (m)', tip: 'La longueur se mesure en mètres (m).' },
  { id: 'masse', grandeur: 'une masse', unit: 'le kilogramme (kg)', tip: 'La masse se mesure en kilogrammes (kg).' },
  { id: 'duree', grandeur: 'une durée', unit: 'la seconde (s)', tip: 'La durée se mesure en secondes (s).' },
  { id: 'temperature', grandeur: 'une température', unit: 'le degré Celsius (°C)', tip: 'On la mesure en degrés Celsius (°C), ou en kelvins.' },
  { id: 'intensite', grandeur: 'une intensité électrique', unit: 'l’ampère (A)', tip: 'L’intensité du courant se mesure en ampères (A).' },
  { id: 'tension', grandeur: 'une tension électrique', unit: 'le volt (V)', tip: 'La tension se mesure en volts (V).' },
  { id: 'resistance', grandeur: 'une résistance électrique', unit: 'l’ohm (Ω)', tip: 'La résistance se mesure en ohms (Ω).' },
  { id: 'force', grandeur: 'une force', unit: 'le newton (N)', tip: 'Une force se mesure en newtons (N).' },
  { id: 'energie', grandeur: 'une énergie', unit: 'le joule (J)', tip: 'L’énergie se mesure en joules (J).' },
  { id: 'puissance', grandeur: 'une puissance', unit: 'le watt (W)', tip: 'La puissance se mesure en watts (W).' },
  { id: 'pression', grandeur: 'une pression', unit: 'le pascal (Pa)', tip: 'La pression se mesure en pascals (Pa).' },
  { id: 'frequence', grandeur: 'une fréquence', unit: 'le hertz (Hz)', tip: 'La fréquence se mesure en hertz (Hz).' },
  { id: 'vitesse', grandeur: 'une vitesse', unit: 'le mètre par seconde (m/s)', tip: 'Une vitesse se mesure en mètres par seconde (m/s).' },
  { id: 'volume', grandeur: 'un volume', unit: 'le litre (L)', tip: 'Un volume se mesure en litres (L) ou en mètres cubes.' },
  { id: 'quantite', grandeur: 'une quantité de matière', unit: 'la mole (mol)', tip: 'La quantité de matière se mesure en moles (mol).' },
  { id: 'charge', grandeur: 'une charge électrique', unit: 'le coulomb (C)', tip: 'La charge électrique se mesure en coulombs (C).' },
  { id: 'aire', grandeur: 'une aire', unit: 'le mètre carré (m²)', tip: 'Une aire se mesure en mètres carrés (m²).' },
]

export function buildBonneUnitePool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`bonne-unite:${seed}`)
  const pool = shuffleWith(rng, QUANTITIES).slice(0, Math.min(count, QUANTITIES.length))
  return pool.map((q) => {
    const decoys = pickDistinct(
      rng,
      QUANTITIES.filter((o) => o.unit !== q.unit).map((o) => o.unit),
      3,
    )
    const options = shuffleWith(rng, [q.unit, ...decoys])
    return {
      id: `jx-unite-${q.id}`,
      prompt: `Quelle est l’unité pour mesurer ${q.grandeur} ?`,
      options,
      correctIndex: options.indexOf(q.unit),
      explanation: q.tip,
      subject: 'Physique-Chimie',
    }
  })
}
