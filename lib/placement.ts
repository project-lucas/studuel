import { cycleOf, type GradeCycle } from '@/lib/grades'

// Mini-quiz de placement (écran 10 de l'onboarding). Les questions viennent en
// priorité des quiz GRATUITS en base (lisibles par un visiteur via RLS), avec
// une banque de repli ici pour garantir un test même sans contenu gratuit pour
// la classe. Le placement n'a aucun enjeu (aucune mauvaise réponse pénalisante)
// — il ne sert qu'à caler le niveau de départ.

export type PlacementQuestion = {
  id: string
  subject?: string
  question: string
  options: string[]
  correctIndex: number
}

export const PLACEMENT_SIZE = 5

// Repli PRIMAIRE. Il n'existait pas : un CP recevait les questions de collège
// (pourcentages, pluriel de « cheval », prise de la Bastille). Cinq échecs
// d'affilée au tout premier écran de jeu, et un placement faux par-dessus.
// Ces questions tiennent du CP au CM2 — le placement ne classe pas l'élève dans
// son année, il cale seulement un point de départ.
const FALLBACK_PRIMAIRE: PlacementQuestion[] = [
  {
    id: 'fb-pri-1',
    subject: 'Maths',
    question: 'Combien font 7 + 5 ?',
    options: ['11', '12', '13', '10'],
    correctIndex: 1,
  },
  {
    id: 'fb-pri-2',
    subject: 'Maths',
    question: 'Combien font 4 × 3 ?',
    options: ['7', '12', '9', '15'],
    correctIndex: 1,
  },
  {
    id: 'fb-pri-3',
    subject: 'Français',
    question: 'Quel est le pluriel de « un chat » ?',
    options: ['des chats', 'des chates', 'des chat', 'des chatz'],
    correctIndex: 0,
  },
  {
    id: 'fb-pri-4',
    subject: 'Français',
    question: 'Dans « le chien court », quel mot est le verbe ?',
    options: ['le', 'chien', 'court', 'aucun'],
    correctIndex: 2,
  },
  {
    id: 'fb-pri-5',
    subject: 'Sciences',
    question: 'Quel animal pond des œufs ?',
    options: ['le chat', 'la poule', 'le chien', 'la vache'],
    correctIndex: 1,
  },
]

const FALLBACK_COLLEGE: PlacementQuestion[] = [
  {
    id: 'fb-col-1',
    subject: 'Maths',
    question: 'Combien font 15 % de 80 ?',
    options: ['8', '12', '15', '20'],
    correctIndex: 1,
  },
  {
    id: 'fb-col-2',
    subject: 'Maths',
    question: 'Quel est le résultat de 7 × 8 ?',
    options: ['54', '56', '48', '64'],
    correctIndex: 1,
  },
  {
    id: 'fb-col-3',
    subject: 'Français',
    question: 'Quel est le pluriel de « cheval » ?',
    options: ['chevals', 'chevaux', 'cheveaux', 'chevaus'],
    correctIndex: 1,
  },
  {
    id: 'fb-col-4',
    subject: 'Histoire',
    question: 'En quelle année a eu lieu la prise de la Bastille ?',
    options: ['1789', '1815', '1492', '1918'],
    correctIndex: 0,
  },
  {
    id: 'fb-col-5',
    subject: 'Maths',
    question: 'Combien vaut 1/2 + 1/4 ?',
    options: ['3/4', '2/6', '1/6', '2/4'],
    correctIndex: 0,
  },
]

const FALLBACK_LYCEE: PlacementQuestion[] = [
  {
    id: 'fb-lyc-1',
    subject: 'Maths',
    question: 'Quelle est la dérivée de f(x) = x² ?',
    options: ['x', '2x', 'x²', '2'],
    correctIndex: 1,
  },
  {
    id: 'fb-lyc-2',
    subject: 'Maths',
    question: 'Combien font 15 % de 80 ?',
    options: ['8', '12', '15', '20'],
    correctIndex: 1,
  },
  {
    id: 'fb-lyc-3',
    subject: 'Français',
    question: 'Qui a écrit « Les Misérables » ?',
    options: ['Zola', 'Hugo', 'Balzac', 'Flaubert'],
    correctIndex: 1,
  },
  {
    id: 'fb-lyc-4',
    subject: 'Histoire',
    question: 'En quelle année débute la Première Guerre mondiale ?',
    options: ['1914', '1939', '1870', '1918'],
    correctIndex: 0,
  },
  {
    id: 'fb-lyc-5',
    subject: 'Physique',
    question: "Quelle est l'unité de la force dans le système international ?",
    options: ['Joule', 'Watt', 'Newton', 'Pascal'],
    correctIndex: 2,
  },
]

// Une banque par cycle. Le cycle se lit dans lib/grades : redéclarer les classes
// de lycée ici, c'est la liste qu'on oublie de mettre à jour — c'est exactement
// ce qui a envoyé le primaire sur les questions de collège.
const BANQUES: Record<GradeCycle, PlacementQuestion[]> = {
  primaire: FALLBACK_PRIMAIRE,
  college: FALLBACK_COLLEGE,
  lycee: FALLBACK_LYCEE,
}

export function fallbackPlacement(grade: string | null): PlacementQuestion[] {
  return BANQUES[cycleOf(grade)]
}

// Complète une liste de questions (issues de la base) jusqu'à PLACEMENT_SIZE en
// piochant dans la banque de repli, sans doublon de libellé. Déterministe.
export function ensurePlacement(
  questions: PlacementQuestion[],
  grade: string | null,
  size: number = PLACEMENT_SIZE,
): PlacementQuestion[] {
  const seen = new Set(questions.map((q) => q.question.trim().toLowerCase()))
  const out = questions.slice(0, size)
  for (const q of fallbackPlacement(grade)) {
    if (out.length >= size) break
    const key = q.question.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(q)
  }
  return out.slice(0, size)
}
