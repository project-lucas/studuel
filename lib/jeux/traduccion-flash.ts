// Traducción flash — la banque du salon Espagnol.
// Un mot espagnol, quatre traductions françaises : la bonne et trois leurres
// piochés parmi les traductions des autres mots. Générateur déterministe.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type WordPair = { es: string; fr: string }

// Vocabulaire fréquent (nombres, famille, verbes, couleurs, quotidien).
export const ES_WORDS: WordPair[] = [
  { es: 'casa', fr: 'maison' },
  { es: 'perro', fr: 'chien' },
  { es: 'agua', fr: 'eau' },
  { es: 'amigo', fr: 'ami' },
  { es: 'libro', fr: 'livre' },
  { es: 'escuela', fr: 'école' },
  { es: 'coche', fr: 'voiture' },
  { es: 'ciudad', fr: 'ville' },
  { es: 'playa', fr: 'plage' },
  { es: 'árbol', fr: 'arbre' },
  { es: 'comer', fr: 'manger' },
  { es: 'beber', fr: 'boire' },
  { es: 'hablar', fr: 'parler' },
  { es: 'correr', fr: 'courir' },
  { es: 'dormir', fr: 'dormir' },
  { es: 'escribir', fr: 'écrire' },
  { es: 'feliz', fr: 'heureux' },
  { es: 'triste', fr: 'triste' },
  { es: 'grande', fr: 'grand' },
  { es: 'pequeño', fr: 'petit' },
  { es: 'rojo', fr: 'rouge' },
  { es: 'verde', fr: 'vert' },
  { es: 'mañana', fr: 'matin' },
  { es: 'noche', fr: 'nuit' },
  { es: 'semana', fr: 'semaine' },
  { es: 'dinero', fr: 'argent' },
  { es: 'pan', fr: 'pain' },
  { es: 'leche', fr: 'lait' },
  { es: 'ventana', fr: 'fenêtre' },
  { es: 'trabajo', fr: 'travail' },
]

export function buildTraduccionFlashPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`traduccion:${seed}`)
  const pool = shuffleWith(rng, ES_WORDS).slice(0, Math.min(count, ES_WORDS.length))
  return pool.map((w) => {
    const decoys = pickDistinct(
      rng,
      ES_WORDS.filter((o) => o.fr !== w.fr).map((o) => o.fr),
      3,
    )
    const options = shuffleWith(rng, [w.fr, ...decoys])
    return {
      id: `jx-tres-${w.es.replace(/\s+/g, '-')}`,
      prompt: `Traduis « ${w.es} » en français`,
      options,
      correctIndex: options.indexOf(w.fr),
      explanation: `« ${w.es} » se traduit par « ${w.fr} ».`,
      subject: 'Espagnol',
    }
  })
}
