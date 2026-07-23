// Traduction flash — la banque du salon Anglais.
// Un mot anglais, quatre traductions : la bonne et trois leurres piochés parmi
// les traductions des autres mots (des mots français plausibles, jamais du
// charabia). Générateur déterministe comme les capitales.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type WordPair = { en: string; fr: string }

// Vocabulaire fréquent du collège (verbes, noms, adjectifs courants).
export const EN_WORDS: WordPair[] = [
  { en: 'apple', fr: 'pomme' },
  { en: 'house', fr: 'maison' },
  { en: 'water', fr: 'eau' },
  { en: 'friend', fr: 'ami' },
  { en: 'school', fr: 'école' },
  { en: 'book', fr: 'livre' },
  { en: 'dog', fr: 'chien' },
  { en: 'cat', fr: 'chat' },
  { en: 'tree', fr: 'arbre' },
  { en: 'car', fr: 'voiture' },
  { en: 'to run', fr: 'courir' },
  { en: 'to eat', fr: 'manger' },
  { en: 'to sleep', fr: 'dormir' },
  { en: 'to buy', fr: 'acheter' },
  { en: 'to speak', fr: 'parler' },
  { en: 'to write', fr: 'écrire' },
  { en: 'happy', fr: 'heureux' },
  { en: 'sad', fr: 'triste' },
  { en: 'fast', fr: 'rapide' },
  { en: 'slow', fr: 'lent' },
  { en: 'big', fr: 'grand' },
  { en: 'small', fr: 'petit' },
  { en: 'red', fr: 'rouge' },
  { en: 'blue', fr: 'bleu' },
  { en: 'morning', fr: 'matin' },
  { en: 'night', fr: 'nuit' },
  { en: 'week', fr: 'semaine' },
  { en: 'year', fr: 'année' },
  { en: 'money', fr: 'argent' },
  { en: 'bread', fr: 'pain' },
  { en: 'milk', fr: 'lait' },
  { en: 'window', fr: 'fenêtre' },
  { en: 'to open', fr: 'ouvrir' },
  { en: 'to close', fr: 'fermer' },
  { en: 'street', fr: 'rue' },
]

export function buildTraductionFlashPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`traduction:${seed}`)
  const pool = shuffleWith(rng, EN_WORDS).slice(0, Math.min(count, EN_WORDS.length))
  return pool.map((w) => {
    const decoys = pickDistinct(
      rng,
      EN_WORDS.filter((o) => o.fr !== w.fr).map((o) => o.fr),
      3,
    )
    const options = shuffleWith(rng, [w.fr, ...decoys])
    return {
      id: `jx-tren-${w.en.replace(/\s+/g, '-')}`,
      prompt: `Traduis « ${w.en} » en français`,
      options,
      correctIndex: options.indexOf(w.fr),
      explanation: `« ${w.en} » se traduit par « ${w.fr} ».`,
      subject: 'Anglais',
    }
  })
}
