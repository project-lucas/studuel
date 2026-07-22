// Phrase en vrac — la banque du salon Anglais, en remise en ordre.
//
// Les mots d'une phrase anglaise arrivent mélangés : il faut les remettre dans
// l'ordre. Même interaction que la Frise folle (on touche les tuiles dans le bon
// ordre) mais un jeu radicalement différent : là où la frise se joue lentement
// sur 4 tableaux et 3 vies, celui-ci se joue AU CHRONO, sans vies, et compte
// combien de phrases on reconstruit avant la fin.
//
// Le repère révélé sous chaque tuile est sa FONCTION dans la phrase (sujet,
// verbe, complément) : c'est ce qui transforme un jeu de puzzle en révision de
// la structure de la phrase anglaise, là où le français ferait autrement.
import { drawBoards, type OrderBoard, type OrderItem } from '@/lib/jeux/ordering'

type Phrase = { id: string; prompt: string; ordered: OrderItem[] }

// Phrases courtes (5 à 7 mots), toutes construites sur l'ordre canonique
// sujet-verbe-complément-circonstant, et choisies pour que l'ordre français
// diffère au moins une fois — sinon le jeu ne fait rien apprendre.
export const PHRASES: Phrase[] = [
  {
    id: 'red-car',
    prompt: 'Elle conduit une voiture rouge.',
    ordered: [
      { label: 'She', hint: 'sujet' },
      { label: 'drives', hint: 'verbe' },
      { label: 'a', hint: 'article' },
      { label: 'red', hint: 'adjectif — avant le nom !' },
      { label: 'car', hint: 'nom' },
    ],
  },
  {
    id: 'never-late',
    prompt: 'Il n’est jamais en retard.',
    ordered: [
      { label: 'He', hint: 'sujet' },
      { label: 'is', hint: 'verbe' },
      { label: 'never', hint: 'adverbe de fréquence — après « be »' },
      { label: 'late', hint: 'adjectif' },
    ],
  },
  {
    id: 'homework',
    prompt: 'Je fais mes devoirs tous les soirs.',
    ordered: [
      { label: 'I', hint: 'sujet' },
      { label: 'do', hint: 'verbe' },
      { label: 'my', hint: 'possessif' },
      { label: 'homework', hint: 'nom — toujours singulier' },
      { label: 'every', hint: 'déterminant' },
      { label: 'evening', hint: 'complément de temps — en fin de phrase' },
    ],
  },
  {
    id: 'question-live',
    prompt: 'Où habites-tu ?',
    ordered: [
      { label: 'Where', hint: 'mot interrogatif' },
      { label: 'do', hint: 'auxiliaire' },
      { label: 'you', hint: 'sujet' },
      { label: 'live', hint: 'verbe — base verbale' },
    ],
  },
  {
    id: 'yesterday',
    prompt: 'Nous sommes allés au cinéma hier.',
    ordered: [
      { label: 'We', hint: 'sujet' },
      { label: 'went', hint: 'prétérit irrégulier de « go »' },
      { label: 'to', hint: 'préposition' },
      { label: 'the', hint: 'article défini' },
      { label: 'cinema', hint: 'nom' },
      { label: 'yesterday', hint: 'complément de temps' },
    ],
  },
  {
    id: 'can-swim',
    prompt: 'Mon frère sait très bien nager.',
    ordered: [
      { label: 'My', hint: 'possessif' },
      { label: 'brother', hint: 'sujet' },
      { label: 'can', hint: 'modal' },
      { label: 'swim', hint: 'verbe — jamais de « to » après un modal' },
      { label: 'very', hint: 'adverbe d’intensité' },
      { label: 'well', hint: 'adverbe de manière' },
    ],
  },
  {
    id: 'raining',
    prompt: 'Il pleut depuis ce matin.',
    ordered: [
      { label: 'It', hint: 'sujet impersonnel' },
      { label: 'has', hint: 'auxiliaire du present perfect' },
      { label: 'been', hint: 'participe de « be »' },
      { label: 'raining', hint: 'forme en -ing' },
      { label: 'since', hint: '« depuis » + point de départ' },
      { label: 'morning', hint: 'complément de temps' },
    ],
  },
  {
    id: 'dont-like',
    prompt: 'Ils n’aiment pas les films d’horreur.',
    ordered: [
      { label: 'They', hint: 'sujet' },
      { label: 'do', hint: 'auxiliaire' },
      { label: 'not', hint: 'négation — entre auxiliaire et verbe' },
      { label: 'like', hint: 'verbe' },
      { label: 'horror', hint: 'nom employé comme adjectif' },
      { label: 'films', hint: 'nom' },
    ],
  },
  {
    id: 'tomorrow',
    prompt: 'Je vais rencontrer mes amis demain.',
    ordered: [
      { label: 'I', hint: 'sujet' },
      { label: 'am', hint: 'auxiliaire « be »' },
      { label: 'going', hint: 'futur proche : be going to' },
      { label: 'to', hint: 'particule du futur proche' },
      { label: 'meet', hint: 'verbe' },
      { label: 'friends', hint: 'complément' },
    ],
  },
  {
    id: 'always-coffee',
    prompt: 'Elle boit toujours du café le matin.',
    ordered: [
      { label: 'She', hint: 'sujet' },
      { label: 'always', hint: 'adverbe de fréquence — AVANT le verbe' },
      { label: 'drinks', hint: 'verbe — 3ᵉ personne en -s' },
      { label: 'coffee', hint: 'complément' },
      { label: 'in', hint: 'préposition' },
      { label: 'morning', hint: 'complément de temps' },
    ],
  },
]

export function buildPhrasePool(seed: string, count: number): OrderBoard[] {
  return drawBoards(PHRASES, count, seed)
}
