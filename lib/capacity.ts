// Bilan de capacités — logique pure, testable.
// Un questionnaire d'habitudes d'apprentissage, rempli après l'onboarding.
// Chaque réponse vaut 0 (Jamais) à 3 (Toujours) ; le score est le ratio
// global en % : « tu es à X % de tes capacités ».

export const CAPACITY_OPTIONS = [
  'Jamais',
  'Rarement',
  'Souvent',
  'Toujours',
] as const

export type CapacityAnswers = Record<string, number>

export const CAPACITY_QUESTIONS: {
  id: string
  label: string // libellé court, pour les priorités du bloc
  question: string
  why: string
}[] = [
  {
    id: 'hydration_wake',
    label: 'Hydratation au réveil',
    question: "Tu bois un grand verre d'eau au réveil ?",
    why: "2 % de déshydratation suffisent à faire baisser l'attention et la mémoire de travail.",
  },
  {
    id: 'hydration_day',
    label: 'Hydratation en journée',
    question: "Tu bois de l'eau régulièrement dans la journée ?",
    why: "Le cerveau est composé d'environ 75 % d'eau : il travaille mieux hydraté.",
  },
  {
    id: 'walk_morning',
    label: 'Marche le matin',
    question: 'Tu marches ou tu bouges le matin, avant les cours ?',
    why: '15 minutes de marche augmentent le flux sanguin cérébral et la vigilance pendant des heures.',
  },
  {
    id: 'self_test',
    label: 'Se tester',
    question: 'Tu te testes (quiz, questions) au lieu de simplement relire ?',
    why: 'La récupération active ancre les connaissances bien mieux que la relecture passive.',
  },
  {
    id: 'sugar',
    label: 'Excès de sucre',
    question: 'Tu évites les excès de sucre (sodas, snacks, pâtisseries) ?',
    why: 'Les pics de glycémie provoquent les coups de barre qui coulent la concentration en classe.',
  },
  {
    id: 'ask_class',
    label: 'Questions en classe',
    question: 'Tu poses des questions en classe quand tu ne comprends pas ?',
    why: "Une confusion levée sur le moment, c'est des heures de révision économisées plus tard.",
  },
  {
    id: 'spaced',
    label: 'Révision espacée',
    question: 'Tu révises en petites sessions espacées plutôt que la veille ?',
    why: 'La répétition espacée bat le bachotage : même temps de travail, mémorisation multipliée.',
  },
  {
    id: 'sleep',
    label: 'Coucher régulier',
    question: 'Tu te couches à heure régulière ?',
    why: 'La mémoire se consolide pendant le sommeil profond — il fixe ce que tu as appris le jour même.',
  },
  {
    id: 'screens',
    label: 'Écrans le soir',
    question: 'Tu évites les écrans juste avant de dormir ?',
    why: "La lumière bleue retarde l'endormissement et dégrade le sommeil qui fait mémoriser.",
  },
]

// Score 0-100 : moyenne des réponses valides, ramenée en pourcentage.
export function computeCapacity(answers: CapacityAnswers): number {
  const values = CAPACITY_QUESTIONS.map((q) => answers[q.id]).filter(
    (v): v is number => Number.isInteger(v) && v >= 0 && v <= 3,
  )
  if (values.length === 0) return 0
  return Math.round(
    (values.reduce((a, b) => a + b, 0) / (values.length * 3)) * 100,
  )
}

// Priorités : les habitudes les plus faibles du bilan (réponses les plus
// basses), celles qui feront le plus progresser le score.
export function capacityPriorities(
  answers: CapacityAnswers,
  max = 3,
): { id: string; label: string }[] {
  return CAPACITY_QUESTIONS.map((q) => ({ q, v: answers[q.id] }))
    .filter(
      (x): x is { q: (typeof CAPACITY_QUESTIONS)[number]; v: number } =>
        Number.isInteger(x.v) && x.v >= 0 && x.v < 3,
    )
    .sort((a, b) => a.v - b.v)
    .slice(0, max)
    .map(({ q }) => ({ id: q.id, label: q.label }))
}

export function capacityMessage(score: number): string {
  if (score >= 90) return 'Machine à apprendre — tout est en place.'
  if (score >= 70) return 'Solide. Quelques réglages et tu es au maximum.'
  if (score >= 50) return 'Bonne base — mais la marge est encore grande.'
  if (score >= 30) return 'Ton cerveau peut donner beaucoup plus.'
  return 'Énorme potentiel inexploité — chaque habitude compte.'
}
