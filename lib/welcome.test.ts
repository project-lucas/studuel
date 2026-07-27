import { describe, it, expect } from 'vitest'
import type { Subject } from '@/lib/types'
import {
  EMPTY_ANSWERS,
  FAST_PATH,
  OFF_PATH,
  STEPS_BEFORE_PLAY,
  WELCOME_STEPS,
  canAdvance,
  defaultSelectedForGrade,
  isDailyGoalMinutes,
  makePlacement,
  minutesToSessions,
  nextStep,
  parseAnswers,
  placementLevel,
  screensBeforePlay,
  serializeAnswers,
  stepProgress,
  subjectsForGrade,
  type OnboardingAnswers,
  type WelcomeStep,
} from '@/lib/welcome'

function subject(slug: string, levels: string[]): Subject {
  return {
    id: slug,
    slug,
    name: slug,
    category: 'college',
    levels,
  } as Subject
}

const SUBJECTS: Subject[] = [
  subject('maths', ['6e', '5e', '4e', '3e']),
  subject('francais', ['6e', '5e', '4e', '3e']),
  subject('ses', ['1re', 'Tle']),
]

const FILLED: OnboardingAnswers = {
  profileType: 'eleve',
  source: 'tiktok',
  goal: 'moyenne',
  grade: '3e',
  subjects: ['maths'],
  dailyGoalMinutes: 15,
  placement: makePlacement(4, 5),
  friendsInvited: true,
  notificationsEnabled: true,
  schoolName: 'Collège Jean Moulin',
  schoolCity: 'Lyon',
}

describe('subjectsForGrade', () => {
  it('ne renvoie que les matières du niveau demandé', () => {
    const found = subjectsForGrade(SUBJECTS, '4e').map((s) => s.slug)
    expect(found).toEqual(['maths', 'francais'])
  })

  it('renvoie une liste vide sans niveau', () => {
    expect(subjectsForGrade(SUBJECTS, null)).toEqual([])
  })
})

describe('defaultSelectedForGrade', () => {
  it('coche toutes les matières du niveau', () => {
    expect(defaultSelectedForGrade(SUBJECTS, '6e')).toEqual(['maths', 'francais'])
  })
})

describe('canAdvance', () => {
  it('bloque tant que la question n’est pas répondue', () => {
    expect(canAdvance('profil', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('source', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('goal', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('grade', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('subjects', EMPTY_ANSWERS)).toBe(false)
  })

  it('laisse passer une fois répondu', () => {
    expect(canAdvance('profil', FILLED)).toBe(true)
    expect(canAdvance('source', FILLED)).toBe(true)
    expect(canAdvance('goal', FILLED)).toBe(true)
    expect(canAdvance('grade', FILLED)).toBe(true)
    expect(canAdvance('subjects', FILLED)).toBe(true)
    expect(canAdvance('dailyGoal', FILLED)).toBe(true)
  })

  it('l’objectif quotidien par défaut (10 min) est déjà valide', () => {
    expect(canAdvance('dailyGoal', EMPTY_ANSWERS)).toBe(true)
  })

  it('les écrans à boutons propres ne bloquent jamais', () => {
    expect(canAdvance('intro', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('motivation', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('placementIntro', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('placementQuiz', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('friends', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('notifications', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('signup', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('plan', EMPTY_ANSWERS)).toBe(true)
  })
})

describe('stepProgress', () => {
  it('suit le chemin réellement parcouru', () => {
    // Recalé sur le nouvel ordre : le jeu arrive tôt, le compte au milieu,
    // le confort ensuite. Une barre calée sur l'ancien ordre mentirait.
    expect(stepProgress('grade')).toBeCloseTo(0.2)
    expect(stepProgress('signup')).toBeCloseTo(0.55)
    expect(stepProgress('dailyGoal')).toBeCloseTo(0.8)
  })

  it('masque la barre sur accueil, profil, motivation et plan', () => {
    expect(stepProgress('intro')).toBeNull()
    expect(stepProgress('profil')).toBeNull()
    expect(stepProgress('motivation')).toBeNull()
    expect(stepProgress('plan')).toBeNull()
  })
})

describe('minutesToSessions', () => {
  it('mappe les minutes vers les sessions legacy', () => {
    expect(minutesToSessions(3)).toBe(1)
    expect(minutesToSessions(10)).toBe(1)
    expect(minutesToSessions(15)).toBe(2)
    expect(minutesToSessions(30)).toBe(3)
  })
})

describe('isDailyGoalMinutes', () => {
  it('n’accepte que 3 / 10 / 15 / 30', () => {
    expect(isDailyGoalMinutes(10)).toBe(true)
    expect(isDailyGoalMinutes(30)).toBe(true)
    expect(isDailyGoalMinutes(7)).toBe(false)
    expect(isDailyGoalMinutes('10')).toBe(false)
    expect(isDailyGoalMinutes(null)).toBe(false)
  })
})

describe('placementLevel', () => {
  it('classe selon le ratio de bonnes réponses', () => {
    expect(placementLevel(5, 5)).toBe('avance')
    expect(placementLevel(4, 5)).toBe('avance')
    expect(placementLevel(3, 5)).toBe('intermediaire')
    expect(placementLevel(2, 5)).toBe('intermediaire')
    expect(placementLevel(1, 5)).toBe('debutant')
  })

  it('un test vide (sauté) donne débutant', () => {
    expect(placementLevel(0, 0)).toBe('debutant')
  })
})

describe('makePlacement', () => {
  it('borne le score et calcule le niveau', () => {
    expect(makePlacement(9, 5)).toEqual({ correct: 5, total: 5, level: 'avance' })
    expect(makePlacement(-2, 5)).toEqual({
      correct: 0,
      total: 5,
      level: 'debutant',
    })
  })
})

describe('parseAnswers / serializeAnswers', () => {
  it('fait un aller-retour fidèle', () => {
    expect(parseAnswers(serializeAnswers(FILLED))).toEqual(FILLED)
  })

  it('retombe sur le défaut pour une entrée nulle ou cassée', () => {
    expect(parseAnswers(null)).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('pas du json')).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('[]')).toEqual(EMPTY_ANSWERS)
  })

  it('rejette les valeurs hors référentiel', () => {
    const parsed = parseAnswers(
      JSON.stringify({
        profileType: 'robot',
        source: 'tiktok',
        goal: 'piratage',
        grade: 'CP',
        subjects: ['maths', 42, ''],
        dailyGoalMinutes: 7,
        placement: { correct: 'x', total: 5 },
      }),
    )
    expect(parsed.profileType).toBeNull()
    expect(parsed.source).toBe('tiktok')
    expect(parsed.goal).toBeNull()
    expect(parsed.grade).toBeNull()
    expect(parsed.subjects).toEqual(['maths'])
    expect(parsed.dailyGoalMinutes).toBe(10)
    expect(parsed.placement).toBeNull()
  })
})

// --- Ordre du parcours : « jouer d'abord, questionner ensuite » --------------

function answers(over: Partial<OnboardingAnswers> = {}): OnboardingAnswers {
  return { ...EMPTY_ANSWERS, ...over }
}

describe('chemin par défaut', () => {
  it('ne met que trois écrans avant le premier jeu', () => {
    // GARDE-FOU produit : chaque écran ajouté ici se paie en abandons. Ce test
    // doit échouer si quelqu'un en rajoute un sans décision explicite.
    expect(screensBeforePlay()).toBe(3)
    expect(STEPS_BEFORE_PLAY).toEqual(['intro', 'profil', 'grade'])
  })

  it('place le quiz de placement juste après la classe', () => {
    const i = FAST_PATH.indexOf('placementQuiz')
    const g = FAST_PATH.indexOf('grade')
    expect(i - g).toBe(2) // grade → placementIntro → placementQuiz
  })

  it('demande le compte APRÈS le jeu, pas avant', () => {
    expect(FAST_PATH.indexOf('signup')).toBeGreaterThan(
      FAST_PATH.indexOf('placementQuiz'),
    )
  })

  it('renvoie tout le confort après la création du compte', () => {
    const signup = FAST_PATH.indexOf('signup')
    for (const s of ['goal', 'dailyGoal', 'school', 'notifications'] as WelcomeStep[]) {
      expect(FAST_PATH.indexOf(s)).toBeGreaterThan(signup)
    }
  })

  it('n’a ni doublon ni écran inconnu', () => {
    expect(new Set(FAST_PATH).size).toBe(FAST_PATH.length)
    for (const s of FAST_PATH) expect(WELCOME_STEPS).toContain(s)
    for (const s of OFF_PATH) expect(WELCOME_STEPS).toContain(s)
  })

  it('couvre chaque écran du design, sur le chemin ou hors chemin', () => {
    // Rien ne doit être perdu : un écran absent des deux listes serait du code
    // mort qu'on ne saurait plus remettre.
    const known = new Set([...FAST_PATH, ...OFF_PATH])
    for (const s of WELCOME_STEPS) expect(known.has(s)).toBe(true)
  })

  it('termine par le plan', () => {
    expect(FAST_PATH[FAST_PATH.length - 1]).toBe('plan')
  })
})

describe('nextStep', () => {
  it('suit le chemin pour un élève', () => {
    const a = answers({ profileType: 'eleve' })
    expect(nextStep('intro', a)).toBe('profil')
    expect(nextStep('profil', a)).toBe('grade')
    expect(nextStep('grade', a)).toBe('placementIntro')
    expect(nextStep('placementQuiz', a)).toBe('signup')
  })

  it('court-circuite tout l’élève pour un parent', () => {
    const a = answers({ profileType: 'parent' })
    expect(nextStep('profil', a)).toBe('signup')
    // Un parent n'a pas de plan élève : son parcours s'arrête au compte.
    expect(nextStep('signup', a)).toBeNull()
  })

  it('renvoie null à la fin du parcours', () => {
    expect(nextStep('plan', answers({ profileType: 'eleve' }))).toBeNull()
  })

  it('rattrape un écran hors chemin sans bloquer', () => {
    // Un brouillon repris d'une version antérieure peut pointer un écran
    // retiré du chemin : il doit rejoindre le parcours, pas rester coincé.
    for (const s of OFF_PATH) {
      expect(nextStep(s, answers({ profileType: 'eleve' }))).toBe('signup')
    }
  })
})

describe('stepProgress sur le nouvel ordre', () => {
  it('progresse dans l’ordre du chemin', () => {
    const values = FAST_PATH.map(stepProgress).filter(
      (v): v is number => v !== null,
    )
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1])
    }
  })

  it('a déjà bien avancé au moment du jeu', () => {
    // La barre doit dire « on y est presque » quand le quiz arrive, sinon les
    // trois premiers écrans paraissent être le début d'un long tunnel.
    expect(stepProgress('placementQuiz')).toBeGreaterThanOrEqual(0.3)
  })
})
