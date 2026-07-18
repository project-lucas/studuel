// Chasse à la faute — la banque du salon Français.
// Quatre mots s'affichent, un seul est mal orthographié : débusque l'intrus.
// Chaque item porte le mot fautif (la réponse), sa graphie correcte (pour
// l'astuce) et trois mots bien écrits comme leurres. Générateur déterministe.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'

// Le mot fautif à repérer, sa forme correcte, et 3 mots corrects en leurres.
export type MisspellItem = {
  id: string
  wrong: string
  right: string
  others: [string, string, string]
  tip: string
}

export const MISSPELLINGS: MisspellItem[] = [
  {
    id: 'langage',
    wrong: 'language',
    right: 'langage',
    others: ['courage', 'village', 'nuage'],
    tip: '« langage » n’a pas de u : « language » est le mot anglais.',
  },
  {
    id: 'accueil',
    wrong: 'acceuil',
    right: 'accueil',
    others: ['orgueil', 'recueil', 'écureuil'],
    tip: '« accueil » : le u passe avant le e après le c (c-u-e-i-l).',
  },
  {
    id: 'developpement',
    wrong: 'dévelopement',
    right: 'développement',
    others: ['événement', 'logement', 'mouvement'],
    tip: '« développement » prend deux p.',
  },
  {
    id: 'professeur',
    wrong: 'proffesseur',
    right: 'professeur',
    others: ['ascenseur', 'chanteur', 'docteur'],
    tip: '« professeur » : un seul f, deux s.',
  },
  {
    id: 'nourriture',
    wrong: 'nouriture',
    right: 'nourriture',
    others: ['ceinture', 'peinture', 'voiture'],
    tip: '« nourriture » prend deux r, comme « nourrir ».',
  },
  {
    id: 'apparaitre',
    wrong: 'aparaître',
    right: 'apparaître',
    others: ['connaître', 'paraître', 'naître'],
    tip: '« apparaître » prend deux p.',
  },
  {
    id: 'occasion',
    wrong: 'occassion',
    right: 'occasion',
    others: ['passion', 'mission', 'pression'],
    tip: '« occasion » : deux c mais un seul s.',
  },
  {
    id: 'adresse',
    wrong: 'addresse',
    right: 'adresse',
    others: ['caresse', 'paresse', 'richesse'],
    tip: '« adresse » : un seul d en français (deux en anglais).',
  },
  {
    id: 'parmi',
    wrong: 'parmis',
    right: 'parmi',
    others: ['tapis', 'permis', 'radis'],
    tip: '« parmi » ne prend jamais de s final.',
  },
  {
    id: 'malgre',
    wrong: 'malgrés',
    right: 'malgré',
    others: ['progrès', 'succès', 'décès'],
    tip: '« malgré » est invariable : jamais de s.',
  },
  {
    id: 'bizarre',
    wrong: 'bizzare',
    right: 'bizarre',
    others: ['cigare', 'phare', 'guitare'],
    tip: '« bizarre » : un seul z, deux r.',
  },
  {
    id: 'trottoir',
    wrong: 'trotoir',
    right: 'trottoir',
    others: ['couloir', 'miroir', 'arrosoir'],
    tip: '« trottoir » prend deux t.',
  },
  {
    id: 'habitude',
    wrong: 'abitude',
    right: 'habitude',
    others: ['altitude', 'attitude', 'multitude'],
    tip: '« habitude » commence par un h.',
  },
  {
    id: 'exercice',
    wrong: 'exercisse',
    right: 'exercice',
    others: ['service', 'justice', 'notice'],
    tip: '« exercice » se termine par -ice, avec un c.',
  },
]

export function buildChasseFautePool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`chasse-faute:${seed}`)
  const pool = shuffleWith(rng, MISSPELLINGS).slice(
    0,
    Math.min(count, MISSPELLINGS.length),
  )
  return pool.map((m) => {
    const options = shuffleWith(rng, [m.wrong, ...m.others])
    return {
      id: `jx-faute-${m.id}`,
      prompt: 'Quel mot est mal orthographié ?',
      options,
      correctIndex: options.indexOf(m.wrong),
      explanation: `On écrit « ${m.right} ». ${m.tip}`,
      subject: 'Français',
    }
  })
}
