import { describe, it, expect } from 'vitest'
import { GAME_FORMATS, type GameFormat } from '@/lib/jeux/formats'
import {
  BASE_POINTS,
  FAST_BONUS,
  FLOOR_BONUS,
  PERFECT_BONUS,
  WAVE_BONUS,
  answer,
  comboMultiplier,
  globalSeconds,
  globalTimeUp,
  isRecordable,
  questionSeconds,
  runProgress,
  runTarget,
  startRun,
  timeout,
  type GameRun,
} from '@/lib/jeux/run'

const sprint = GAME_FORMATS['traduction-flash'] // 45 s, fastMs 2500
const vies = GAME_FORMATS['faux-amis'] // 2 vies, 6 s, cible 10
const paliers = GAME_FORMATS['calcul-mental'] // 4 vagues × 5, 2 vies
const expedition = GAME_FORMATS.capitales // 8 escales
const ascension = GAME_FORMATS['suite-logique'] // 10 étages, chute 2

const good = { good: true, elapsedMs: 4000 }
const fast = { good: true, elapsedMs: 100 }
const bad = { good: false, elapsedMs: 4000 }

// Rejoue une suite de réponses depuis le départ.
function play(format: GameFormat, inputs: Array<boolean>): GameRun {
  return inputs.reduce(
    (run, ok) => answer(format, run, ok ? good : bad),
    startRun(format),
  )
}

describe('comboMultiplier', () => {
  it('monte par paliers de 3 et plafonne à ×4', () => {
    expect(comboMultiplier(0)).toBe(1)
    expect(comboMultiplier(2)).toBe(1)
    expect(comboMultiplier(3)).toBe(2)
    expect(comboMultiplier(6)).toBe(3)
    expect(comboMultiplier(9)).toBe(4)
    expect(comboMultiplier(50)).toBe(4)
  })
})

describe('départ', () => {
  it('donne des vies aux seules mécaniques qui en ont', () => {
    expect(startRun(vies).lives).toBe(2)
    expect(startRun(paliers).lives).toBe(2)
    expect(startRun(sprint).lives).toBeNull()
    expect(startRun(expedition).lives).toBeNull()
    expect(startRun(ascension).lives).toBeNull()
  })

  it('part à zéro partout ailleurs', () => {
    const run = startRun(sprint)
    expect(run).toMatchObject({
      status: 'playing',
      score: 0,
      streak: 0,
      correct: 0,
      answered: 0,
      step: 0,
    })
  })
})

describe('chrono par question', () => {
  it('laisse le sprint sans chrono par question (le global suffit)', () => {
    expect(questionSeconds(sprint, startRun(sprint))).toBeNull()
  })

  it('resserre le chrono du mode à paliers à chaque vague', () => {
    const run = startRun(paliers)
    expect(questionSeconds(paliers, run)).toBe(8)
    expect(questionSeconds(paliers, { ...run, step: 1 })).toBe(6.5)
    expect(questionSeconds(paliers, { ...run, step: 3 })).toBe(3.5)
  })

  it('laisse réfléchir sans chrono là où le format le promet', () => {
    expect(questionSeconds(ascension, startRun(ascension))).toBeNull()
  })
})

describe('sprint', () => {
  it('ajoute le bonus de vitesse sous le seuil, jamais au-dessus', () => {
    expect(answer(sprint, startRun(sprint), fast).score).toBe(
      BASE_POINTS + FAST_BONUS,
    )
    expect(answer(sprint, startRun(sprint), good).score).toBe(BASE_POINTS)
  })

  it('ne s’arrête jamais tout seul, même après une erreur', () => {
    const run = play(sprint, [false, false, false, false, false])
    expect(run.status).toBe('playing')
    expect(run.lives).toBeNull()
  })

  it('se termine en victoire au coup de sifflet final', () => {
    const run = globalTimeUp(sprint, play(sprint, [true, false]))
    expect(run.status).toBe('won')
  })

  it('ne ressuscite pas une partie déjà finie', () => {
    const done = globalTimeUp(sprint, startRun(sprint))
    expect(globalTimeUp(sprint, done)).toBe(done)
    expect(answer(sprint, done, good)).toBe(done)
  })
})

describe('vies', () => {
  it('perd une vie par erreur et meurt à zéro', () => {
    expect(play(vies, [false]).lives).toBe(1)
    const dead = play(vies, [false, false])
    expect(dead.lives).toBe(0)
    expect(dead.status).toBe('lost')
  })

  it('gagne quand la cible de prises est atteinte', () => {
    const run = play(vies, Array(10).fill(true))
    expect(run.status).toBe('won')
    expect(run.correct).toBe(10)
    expect(run.stepJustCleared).toBe(true)
  })

  it('traite le chrono écoulé comme une erreur, sans bonus de vitesse', () => {
    const run = timeout(vies, startRun(vies))
    expect(run.lives).toBe(1)
    expect(run.score).toBe(0)
    expect(run.streak).toBe(0)
  })
})

describe('paliers', () => {
  it('avance de vague tous les waveSize et prime la vague franchie', () => {
    const run = play(paliers, Array(5).fill(true))
    expect(run.step).toBe(1)
    expect(run.inWave).toBe(0)
    expect(run.stepJustCleared).toBe(true)
    // 5 bonnes réponses (combo montant) + prime de 1re vague.
    const answers = BASE_POINTS * (1 + 1 + 1 + 2 + 2)
    expect(run.score).toBe(answers + WAVE_BONUS)
  })

  it('gagne au bout de la dernière vague', () => {
    const run = play(paliers, Array(20).fill(true))
    expect(run.status).toBe('won')
    expect(run.step).toBe(4)
  })

  it('meurt quand les vies tombent, même en pleine vague', () => {
    const run = play(paliers, [true, false, true, false])
    expect(run.status).toBe('lost')
    expect(run.lives).toBe(0)
  })

  it('ne franchit pas de vague sur la réponse qui tue', () => {
    // Dernière question d'une vague, dernière vie : la réponse fatale arrête la
    // partie — elle ne doit pas offrir la vague ni sa prime au passage.
    const onEdge: GameRun = { ...startRun(paliers), lives: 1, inWave: 4, step: 2 }
    const dead = answer(paliers, onEdge, bad)
    expect(dead.status).toBe('lost')
    expect(dead.step).toBe(2)
    expect(dead.stepJustCleared).toBe(false)
  })
})

describe('expédition', () => {
  it('ne tue jamais : on va au bout des escales', () => {
    const run = play(expedition, [false, false, false, false, false])
    expect(run.status).toBe('playing')
    expect(run.lives).toBeNull()
  })

  it('prime le parcours parfait', () => {
    const run = play(expedition, Array(8).fill(true))
    expect(run.status).toBe('won')
    expect(run.score).toBeGreaterThanOrEqual(PERFECT_BONUS)
  })

  it('boucle le parcours en échec sous le seuil de réussite', () => {
    const run = play(expedition, [
      true, true, true, false, false, false, false, false,
    ])
    expect(run.step).toBe(8)
    expect(run.status).toBe('lost')
  })

  it('réussit dès 60 % de bonnes réponses', () => {
    const run = play(expedition, [
      true, true, true, true, true, false, false, false,
    ])
    expect(run.status).toBe('won')
  })
})

describe('ascension', () => {
  it('monte d’un étage par bonne réponse', () => {
    expect(play(ascension, [true, true, true]).step).toBe(3)
  })

  it('fait redescendre de la hauteur de chute, sans passer sous zéro', () => {
    expect(play(ascension, [true, true, true, false]).step).toBe(1)
    expect(play(ascension, [false]).step).toBe(0)
    expect(play(ascension, [true, false, false]).step).toBe(0)
  })

  it('gagne en atteignant le sommet', () => {
    const run = play(ascension, Array(10).fill(true))
    expect(run.status).toBe('won')
    expect(run.step).toBe(10)
  })

  it('ajoute la prime d’étage à chaque montée', () => {
    expect(answer(ascension, startRun(ascension), good).score).toBe(
      BASE_POINTS + FLOOR_BONUS,
    )
  })

  it('PERD quand les essais sont épuisés (la partie se termine toujours)', () => {
    // C'était le trou : ni vies ni chrono global, et une erreur ne fait que
    // redescendre. Un élève qui alterne juste/faux montait et redescendait
    // indéfiniment, sans autre issue que « Abandonner » — et le message de
    // défaite du jeu n'était jamais affichable.
    const params = ascension.params
    if (params.mechanic !== 'ascension') throw new Error('format inattendu')
    const essais = params.ascension.attempts

    // Yo-yo parfait : on ne monte jamais durablement, on ne gagne jamais.
    const yoyo = Array.from({ length: essais }, (_, i) => i % 2 === 0)
    const run = play(ascension, yoyo)
    expect(run.status).toBe('lost')
    expect(run.answered).toBe(essais)
  })

  it('ne perd pas tant qu’il reste un essai', () => {
    const params = ascension.params
    if (params.mechanic !== 'ascension') throw new Error('format inattendu')
    const presque = Array.from(
      { length: params.ascension.attempts - 1 },
      (_, i) => i % 2 === 0,
    )
    expect(play(ascension, presque).status).toBe('playing')
  })
})

describe('ordre', () => {
  const frise = GAME_FORMATS['frise-folle'] // 4 tableaux × 5, 3 vies, sans chrono
  const phrase = GAME_FORMATS['phrase-en-vrac'] // sans vies, chrono 75 s, 6 tuiles

  it('démarre avec les vies du format, ou sans vies du tout', () => {
    expect(startRun(frise).lives).toBe(3)
    expect(startRun(phrase).lives).toBeNull()
  })

  it('n’a jamais de chrono par tuile — c’est le tableau qu’on reconstitue', () => {
    expect(questionSeconds(frise, startRun(frise))).toBeNull()
    expect(questionSeconds(phrase, startRun(phrase))).toBeNull()
  })

  it('ne fait PAS avancer le tableau sur une erreur (on retente)', () => {
    const run = play(frise, [true, false, false])
    expect(run.inWave).toBe(1) // une seule tuile posée
    expect(run.lives).toBe(1)
    expect(run.step).toBe(0)
  })

  it('boucle un tableau au bout de itemsPerBoard bonnes poses', () => {
    const run = play(frise, [true, true, true, true, true])
    expect(run.step).toBe(1)
    expect(run.inWave).toBe(0)
    expect(run.stepJustCleared).toBe(true)
    expect(run.score).toBeGreaterThan(BASE_POINTS * 5)
  })

  it('compte les erreurs sans perdre la progression du tableau', () => {
    const run = play(frise, [true, false, true, true, true, true])
    expect(run.step).toBe(1) // le tableau a bien été bouclé
    expect(run.lives).toBe(2) // et l'erreur a bien coûté une vie
  })

  it('boucle sur la taille RÉELLE du tableau, pas sur le max du format', () => {
    // Une phrase de 4 mots doit se boucler en 4 poses, alors que le format
    // annonce 6 tuiles au maximum. Sans cela, la partie se bloquerait sur le
    // premier tableau court venu.
    const short = { good: true, elapsedMs: 0, boardSize: 4 }
    let run = startRun(phrase)
    for (let i = 0; i < 4; i++) run = answer(phrase, run, short)
    expect(run.step).toBe(1)
    expect(run.inWave).toBe(0)
    expect(run.stepJustCleared).toBe(true)
  })

  it('retombe sur le max du format quand la taille n’est pas fournie', () => {
    const run = play(phrase, Array(6).fill(true))
    expect(run.step).toBe(1)
  })

  it('gagne au dernier tableau', () => {
    const run = play(frise, Array(20).fill(true))
    expect(run.status).toBe('won')
    expect(run.step).toBe(4)
  })

  it('meurt quand les vies tombent, sans offrir le tableau en cours', () => {
    const run = play(frise, [true, true, false, false, false])
    expect(run.status).toBe('lost')
    expect(run.step).toBe(0)
  })

  it('ne tue jamais le jeu chronométré : il n’a pas de vies', () => {
    const run = play(phrase, Array(12).fill(false))
    expect(run.status).toBe('playing')
    expect(run.lives).toBeNull()
  })

  it('laisse le jeu chronométré enchaîner les tableaux sans fin', () => {
    const run = play(phrase, Array(18).fill(true)) // 3 tableaux de 6
    expect(run.step).toBe(3)
    expect(run.status).toBe('playing')
  })

  it('conclut le jeu chronométré au coup de sifflet', () => {
    const run = globalTimeUp(phrase, play(phrase, [true, true]))
    expect(run.status).toBe('won')
  })
})

describe('chrono global', () => {
  it('n’existe que là où le format le prévoit', () => {
    expect(globalSeconds(sprint)).toBe(45)
    expect(globalSeconds(GAME_FORMATS['phrase-en-vrac'])).toBe(75)
    expect(globalSeconds(GAME_FORMATS['frise-folle'])).toBeNull()
    expect(globalSeconds(vies)).toBeNull()
    expect(globalSeconds(expedition)).toBeNull()
  })
})

describe('série et enregistrement', () => {
  it('retient la meilleure série même après l’avoir cassée', () => {
    const run = play(sprint, [true, true, true, false, true])
    expect(run.bestStreak).toBe(3)
    expect(run.streak).toBe(1)
  })

  it('n’enregistre rien tant que rien n’a été joué', () => {
    expect(isRecordable(startRun(sprint))).toBe(false)
    expect(isRecordable(play(sprint, [false]))).toBe(true)
  })
})

describe('HUD : objectif et avancement', () => {
  it('parle la même unité que la mécanique', () => {
    expect(runTarget(vies)).toBe(10)
    expect(runProgress(vies, play(vies, [true, false, true]))).toBe(2)

    expect(runTarget(expedition)).toBe(8)
    expect(runProgress(expedition, play(expedition, [true, false]))).toBe(2)

    expect(runTarget(ascension)).toBe(10)
    expect(runProgress(ascension, play(ascension, [true, true]))).toBe(2)

    expect(runTarget(paliers)).toBe(4)
    expect(runTarget(sprint)).toBeNull()
  })
})
