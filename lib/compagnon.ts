// Le compagnon d'étude — un tamagotchi nourri par la régularité.
// Il évolue avec la série (streak) : plus l'élève est régulier, plus la
// créature grandit. Une session aujourd'hui = compagnon nourri ; un jour
// sans rien = il a faim ; série à zéro = il s'endort en attendant.
// Logique pure ici ; le nom vit en localStorage, les accessoires viennent
// de la boutique du Trésor (shop_purchases, kind « compagnon »).

export type CompanionStage = {
  minStreak: number
  name: string // nom d'étape (« Braise », « Étincelle »…)
  image: string // mascotte flamme correspondante (public/images/mascotte)
  hint: string // ce qui attend l'élève à cette étape
}

// L'évolution suit la série : chaque palier est une promesse visible.
// La mascotte est une flamme : elle grandit avec la régularité.
export const COMPANION_STAGES: CompanionStage[] = [
  {
    minStreak: 0,
    name: 'Braise',
    image: '/images/mascotte/flamme-0-braise.webp',
    hint: 'Une session et elle se rallume !',
  },
  {
    minStreak: 1,
    name: 'Étincelle',
    image: '/images/mascotte/flamme-1-etincelle.webp',
    hint: 'Née d’une première session. Nourris-la chaque jour.',
  },
  {
    minStreak: 3,
    name: 'Flamme vive',
    image: '/images/mascotte/flamme-2-vive.webp',
    hint: '3 jours d’affilée — elle tient bien droite.',
  },
  {
    minStreak: 7,
    name: 'Rayonnante',
    image: '/images/mascotte/flamme-3-rayonnante.webp',
    hint: 'Une semaine complète — un halo doré l’entoure.',
  },
  {
    minStreak: 14,
    name: 'Brasier',
    image: '/images/mascotte/flamme-4-brasier.webp',
    hint: '14 jours — un vrai brasier, impossible à éteindre.',
  },
  {
    minStreak: 30,
    name: 'Légendaire',
    image: '/images/mascotte/flamme-5-legendaire.webp',
    hint: '30 jours — la forme finale. Personne ne t’arrête.',
  },
]

// Visuels d'humeur et de célébration (hors évolution).
export const COMPANION_HUNGRY_IMAGE = '/images/mascotte/flamme-affamee.webp'
export const COMPANION_CELEBRATION_IMAGE =
  '/images/mascotte/flamme-celebration.webp'

export function stageForStreak(streak: number): CompanionStage {
  let stage = COMPANION_STAGES[0]
  for (const s of COMPANION_STAGES) {
    if (streak >= s.minStreak) stage = s
  }
  return stage
}

// Prochaine évolution (null à la forme finale).
export function nextStage(streak: number): CompanionStage | null {
  return COMPANION_STAGES.find((s) => s.minStreak > streak) ?? null
}

// Progression 0..1 vers la prochaine étape (1 à la forme finale).
export function stageProgress(streak: number): number {
  const current = stageForStreak(streak)
  const next = nextStage(streak)
  if (!next) return 1
  return Math.min(
    1,
    Math.max(0, (streak - current.minStreak) / (next.minStreak - current.minStreak)),
  )
}

// ------------------------------------------------------------------- humeur

export type CompanionMood = 'endormi' | 'affame' | 'en_forme' | 'rayonnant'

// L'humeur ne culpabilise jamais : elle invite. « Affamé » = la série est
// vivante mais rien aujourd'hui ; « endormi » = série éteinte.
export function companionMood(
  activeToday: boolean,
  streak: number,
): CompanionMood {
  if (activeToday) return streak >= 7 ? 'rayonnant' : 'en_forme'
  return streak > 0 ? 'affame' : 'endormi'
}

export const MOOD_LINES: Record<CompanionMood, string> = {
  endormi: 'Zzz… une session et elle se rallume.',
  affame: 'Elle faiblit ! Une session la nourrit pour la journée.',
  en_forme: 'Nourrie et en pleine forme — reviens demain !',
  rayonnant: 'Elle rayonne ! Ta régularité la rend invincible.',
}

// ---------------------------------------------------------------------- nom

const NAME_STORAGE_KEY = 'scolaria-compagnon-name'
export const DEFAULT_COMPANION_NAME = 'Pixel'

export function companionName(): string {
  if (typeof window === 'undefined') return DEFAULT_COMPANION_NAME
  try {
    return (
      window.localStorage.getItem(NAME_STORAGE_KEY) || DEFAULT_COMPANION_NAME
    )
  } catch {
    return DEFAULT_COMPANION_NAME
  }
}

export function setCompanionName(name: string): void {
  try {
    const clean = name.trim().slice(0, 20)
    if (clean) window.localStorage.setItem(NAME_STORAGE_KEY, clean)
  } catch {
    // stockage bloqué : le nom par défaut fera l'affaire
  }
}
