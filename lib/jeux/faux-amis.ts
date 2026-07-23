// Faux amis — la banque du salon Anglais.
// Un mot anglais qui RESSEMBLE à un mot français mais ne veut pas dire la même
// chose. La bonne réponse est le vrai sens ; le leurre-vedette est le faux ami
// (la traduction tentante mais fausse), complété par deux autres leurres.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'

export type FalseFriend = {
  id: string
  word: string
  real: string
  trap: string
  decoys: [string, string]
  tip: string
}

export const EN_FALSE_FRIENDS: FalseFriend[] = [
  {
    id: 'actually',
    word: 'actually',
    real: 'en fait',
    trap: 'actuellement',
    decoys: ['activement', 'récemment'],
    tip: '« actually » = en fait. « actuellement » se dit *currently*.',
  },
  {
    id: 'library',
    word: 'library',
    real: 'bibliothèque',
    trap: 'librairie',
    decoys: ['libération', 'liberté'],
    tip: '« library » = bibliothèque. Une librairie est un *bookshop*.',
  },
  {
    id: 'attend',
    word: 'to attend',
    real: 'assister à',
    trap: 'attendre',
    decoys: ['atteindre', 'tenter'],
    tip: '« to attend » = assister à. Attendre se dit *to wait*.',
  },
  {
    id: 'eventually',
    word: 'eventually',
    real: 'finalement',
    trap: 'éventuellement',
    decoys: ['événement', 'également'],
    tip: '« eventually » = finalement. Éventuellement = *possibly*.',
  },
  {
    id: 'deception',
    word: 'deception',
    real: 'tromperie',
    trap: 'déception',
    decoys: ['réception', 'perception'],
    tip: '« deception » = tromperie. Une déception = *disappointment*.',
  },
  {
    id: 'sensible',
    word: 'sensible',
    real: 'raisonnable',
    trap: 'sensible',
    decoys: ['sensationnel', 'sensé'],
    tip: '« sensible » = raisonnable. Sensible (émotif) = *sensitive*.',
  },
  {
    id: 'pass-exam',
    word: 'to pass an exam',
    real: 'réussir un examen',
    trap: 'passer un examen',
    decoys: ['rater un examen', 'réviser un examen'],
    tip: '« to pass » = réussir. Passer (juste s’y présenter) = *to take*.',
  },
  {
    id: 'location',
    word: 'location',
    real: 'emplacement',
    trap: 'location',
    decoys: ['localisation', 'locataire'],
    tip: '« location » = emplacement. Une location (bail) = *rental*.',
  },
  {
    id: 'college',
    word: 'college',
    real: 'université',
    trap: 'collège',
    decoys: ['collègue', 'colline'],
    tip: '« college » = université. Le collège (français) = *middle school*.',
  },
  {
    id: 'demand',
    word: 'to demand',
    real: 'exiger',
    trap: 'demander',
    decoys: ['démolir', 'dénoncer'],
    tip: '« to demand » = exiger. Demander (poliment) = *to ask*.',
  },
  {
    id: 'figure',
    word: 'figure',
    real: 'chiffre',
    trap: 'figure',
    decoys: ['figurant', 'figurine'],
    tip: '« figure » = chiffre. Une figure (visage) = *face*.',
  },
  {
    id: 'journey',
    word: 'journey',
    real: 'voyage',
    trap: 'journée',
    decoys: ['journal', 'journaliste'],
    tip: '« journey » = voyage. Une journée = *day*.',
  },
  {
    id: 'lecture',
    word: 'lecture',
    real: 'cours magistral',
    trap: 'lecture',
    decoys: ['leçon particulière', 'conférencier'],
    tip: '« lecture » = un cours. La lecture (lire) = *reading*.',
  },
  {
    id: 'petrol',
    word: 'petrol',
    real: 'essence',
    trap: 'pétrole',
    decoys: ['pétard', 'péril'],
    tip: '« petrol » = essence. Le pétrole brut = *crude oil*.',
  },
  {
    id: 'injure',
    word: 'to injure',
    real: 'blesser',
    trap: 'injurier',
    decoys: ['injecter', 'ignorer'],
    tip: '« to injure » = blesser. Injurier (insulter) = *to insult*.',
  },
  {
    id: 'coin',
    word: 'coin',
    real: 'pièce de monnaie',
    trap: 'coin (angle)',
    decoys: ['coing', 'couloir'],
    tip: '« coin » = pièce de monnaie. Un coin (angle) = *corner*.',
  },
  {
    id: 'achieve',
    word: 'to achieve',
    real: 'réussir',
    trap: 'achever',
    decoys: ['acheter', 'accueillir'],
    tip: '« to achieve » = réussir, accomplir. Achever = *to complete*.',
  },
  {
    id: 'hazard',
    word: 'hazard',
    real: 'danger',
    trap: 'hasard',
    decoys: ['hâte', 'habitude'],
    tip: '« hazard » = un danger. Le hasard = *chance*.',
  },
  {
    id: 'resume',
    word: 'to resume',
    real: 'reprendre',
    trap: 'résumer',
    decoys: ['résister', 'résoudre'],
    tip: '« to resume » = reprendre. Résumer = *to summarize*.',
  },
  {
    id: 'sympathetic',
    word: 'sympathetic',
    real: 'compatissant',
    trap: 'sympathique',
    decoys: ['symbolique', 'systématique'],
    tip: '« sympathetic » = compatissant. Sympathique = *friendly*.',
  },
]

export function buildFauxAmisPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`faux-amis:${seed}`)
  const pool = shuffleWith(rng, EN_FALSE_FRIENDS).slice(
    0,
    Math.min(count, EN_FALSE_FRIENDS.length),
  )
  return pool.map((f) => {
    const options = shuffleWith(rng, [f.real, f.trap, ...f.decoys])
    return {
      id: `jx-fauxen-${f.id}`,
      prompt: `En anglais, que veut dire « ${f.word} » ?`,
      options,
      correctIndex: options.indexOf(f.real),
      explanation: f.tip,
      subject: 'Anglais',
    }
  })
}
