import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PALIER,
  MAX_RUN_MS,
  MIN_RUN_MS,
  MAX_STARS,
  PALIERS,
  TOTAL_STARS,
  applyRun,
  bestTimeAt,
  currentPalier,
  formatDuration,
  isPlausibleTime,
  isUnlocked,
  nextStarAccuracy,
  palierFloor,
  palierTitle,
  parsePalier,
  parseProgress,
  starsFor,
  starsMissingFor,
  totalStars,
  unlockedThrough,
  type PalierProgress,
} from './paliers'

/** Une partie fabriquée : `n` réponses dont `good` justes, gagnée ou perdue. */
const run = (good: number, answered: number, won = true) => ({
  status: (won ? 'won' : 'lost') as 'won' | 'lost',
  correct: good,
  answered,
  score: 100 * good,
})

describe('l’échelle', () => {
  it('a cinq paliers numérotés de 1 à 5, sans trou', () => {
    expect(PALIERS.map((p) => p.level)).toEqual([1, 2, 3, 4, 5])
    expect(TOTAL_STARS).toBe(PALIERS.length * MAX_STARS)
  })

  it('nomme un palier de la même façon partout', () => {
    expect(palierTitle(4)).toBe('Palier 4 · Expert')
  })

  it('ne lit comme palier que les niveaux de l’échelle', () => {
    expect(parsePalier('3')).toBe(3)
    expect(parsePalier('0')).toBeNull()
    expect(parsePalier('6')).toBeNull()
    expect(parsePalier('deux')).toBeNull()
    expect(parsePalier(undefined)).toBeNull()
  })
})

describe('starsFor', () => {
  it('ne donne rien à une partie sans réponse', () => {
    expect(starsFor(run(0, 0))).toBe(0)
  })

  it('plafonne une DÉFAITE à une étoile, si bonne soit la précision', () => {
    expect(starsFor(run(19, 20, false))).toBe(1)
    expect(starsFor(run(5, 20, false))).toBe(0)
  })

  it('récompense la victoire selon le taux de réussite', () => {
    expect(starsFor(run(14, 20))).toBe(1) // 70 %
    expect(starsFor(run(17, 20))).toBe(2) // 85 %
    expect(starsFor(run(20, 20))).toBe(3) // 100 %
  })

  it('annonce le seuil de l’étoile suivante, et rien au sommet', () => {
    expect(nextStarAccuracy(0)).toBe(0.6)
    expect(nextStarAccuracy(2)).toBe(0.95)
    expect(nextStarAccuracy(3)).toBeNull()
  })
})

describe('déblocage', () => {
  it('ouvre le palier suivant à deux étoiles, pas à une', () => {
    const une: PalierProgress = { 1: { stars: 1, best: 0 } }
    const deux: PalierProgress = { 1: { stars: 2, best: 0 } }
    expect(unlockedThrough(une)).toBe(1)
    expect(unlockedThrough(deux)).toBe(2)
  })

  it('remonte l’échelle d’un coup quand plusieurs paliers sont acquis', () => {
    const progress: PalierProgress = {
      1: { stars: 3, best: 0 },
      2: { stars: 2, best: 0 },
      3: { stars: 3, best: 0 },
    }
    expect(unlockedThrough(progress)).toBe(4)
  })

  it('ne dépasse jamais le sommet de l’échelle', () => {
    const tout: PalierProgress = Object.fromEntries(
      PALIERS.map((p) => [p.level, { stars: 3, best: 0 }]),
    )
    expect(unlockedThrough(tout)).toBe(PALIERS.length)
  })

  it('le plancher de classe ouvre plus tôt, jamais moins', () => {
    expect(unlockedThrough({}, 4)).toBe(4)
    // Un plancher bas ne referme pas ce que les étoiles ont ouvert.
    expect(unlockedThrough({ 1: { stars: 3, best: 0 } }, 1)).toBe(2)
    expect(isUnlocked({}, 4, 4)).toBe(true)
    expect(isUnlocked({}, 4, 5)).toBe(false)
  })

  it('dit combien d’étoiles manquent pour ouvrir un palier verrouillé', () => {
    expect(starsMissingFor({ 1: { stars: 1, best: 0 } }, 1, 2)).toBe(1)
    expect(starsMissingFor({}, 1, 2)).toBe(2)
    // Déjà ouvert : rien ne manque.
    expect(starsMissingFor({}, 4, 3)).toBe(0)
  })
})

describe('currentPalier', () => {
  it('pointe le premier palier ouvert qui n’a pas ses deux étoiles', () => {
    expect(currentPalier({ 1: { stars: 3, best: 0 } })).toBe(2)
  })

  it('ne renvoie jamais un élève de Terminale au bas de l’échelle', () => {
    // Plancher 4 : on ne lui propose pas « Éveil » alors que quatre paliers
    // lui sont ouverts — c'est tout l'intérêt du plancher.
    expect(currentPalier({}, 4)).toBe(4)
    expect(currentPalier({ 4: { stars: 2, best: 0 } }, 4)).toBe(5)
  })

  it('pointe le sommet quand tout est acquis', () => {
    const tout: PalierProgress = Object.fromEntries(
      PALIERS.map((p) => [p.level, { stars: 3, best: 0 }]),
    )
    expect(currentPalier(tout)).toBe(PALIERS.length)
  })
})

describe('applyRun', () => {
  it('range les étoiles et le meilleur score', () => {
    const { progress, outcome } = applyRun({}, 1, 1, run(20, 20))
    expect(outcome.stars).toBe(3)
    expect(outcome.gained).toBe(3)
    expect(outcome.isBest).toBe(true)
    expect(progress[1]).toEqual({ stars: 3, best: 2000 })
  })

  it('n’écrase JAMAIS un meilleur résultat par une partie ratée', () => {
    const avant: PalierProgress = { 2: { stars: 3, best: 5000 } }
    const { progress, outcome } = applyRun(avant, 1, 2, run(2, 10, false))
    expect(progress[2]).toEqual({ stars: 3, best: 5000 })
    expect(outcome.stars).toBe(0)
    expect(outcome.gained).toBe(0)
    expect(outcome.isBest).toBe(false)
  })

  it('signale le palier ouvert par CETTE partie, une seule fois', () => {
    const premiere = applyRun({}, 1, 1, run(9, 10))
    expect(premiere.outcome.unlocked).toBe(2)
    // Rejouer le même palier n'ouvre plus rien.
    const seconde = applyRun(premiere.progress, 1, 1, run(10, 10))
    expect(seconde.outcome.unlocked).toBeNull()
  })

  it('n’annonce pas comme « ouvert » un palier que la classe ouvrait déjà', () => {
    const { outcome } = applyRun({}, 4, 1, run(10, 10))
    expect(outcome.unlocked).toBeNull()
  })
})

describe('palierFloor', () => {
  it('part du bas au primaire et en début de collège', () => {
    expect(palierFloor('CM1')).toBe(1)
    expect(palierFloor('6e')).toBe(1)
    expect(palierFloor('5e')).toBe(1)
  })

  it('monte avec le cycle, voie technologique comprise', () => {
    expect(palierFloor('3e')).toBe(2)
    expect(palierFloor('2de')).toBe(3)
    expect(palierFloor('1re techno')).toBe(3)
    expect(palierFloor('Tle')).toBe(4)
    expect(palierFloor('Tle techno')).toBe(4)
  })

  it('retombe en bas pour une classe inconnue (visiteur)', () => {
    expect(palierFloor(null)).toBe(1)
  })
})

describe('parseProgress', () => {
  it('relit ce qui a été écrit', () => {
    const progress: PalierProgress = {
      1: { stars: 3, best: 1200 },
      2: { stars: 1, best: 400 },
    }
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress)
  })

  it('rend une progression vide plutôt que de jeter, quoi qu’on lui donne', () => {
    expect(parseProgress(null)).toEqual({})
    expect(parseProgress('pas du json')).toEqual({})
    expect(parseProgress('"une chaîne"')).toEqual({})
    expect(parseProgress('[1,2,3]')).toEqual({})
  })

  it('borne des étoiles aberrantes au lieu de les croire', () => {
    const lu = parseProgress('{"1":{"stars":99,"best":-5},"9":{"stars":3}}')
    expect(lu[1]).toEqual({ stars: 3, best: 0 })
    // Le palier 9 n'existe pas : il est ignoré, pas recopié.
    expect(totalStars(lu)).toBe(3)
  })
})

describe('le palier de référence', () => {
  it('est bien dans l’échelle', () => {
    expect(PALIERS.some((p) => p.level === DEFAULT_PALIER)).toBe(true)
  })
})

describe('le chrono de bouclage', () => {
  it('n’est retenu que sur une partie GAGNÉE', () => {
    // Sinon abandonner à la première question donnerait le meilleur temps du jeu.
    const perdue = applyRun({}, 1, 1, run(1, 4, false), 5_000)
    expect(perdue.outcome.timeMs).toBeNull()
    expect(bestTimeAt(perdue.progress, 1)).toBeNull()

    const gagnee = applyRun({}, 1, 1, run(10, 10), 42_000)
    expect(gagnee.outcome.timeMs).toBe(42_000)
    expect(gagnee.outcome.isBestTime).toBe(true)
    expect(bestTimeAt(gagnee.progress, 1)).toBe(42_000)
  })

  it('garde le PLUS PETIT temps, et ne se perd pas sur une partie molle', () => {
    const rapide = applyRun({}, 1, 2, run(10, 10), 30_000).progress
    const lente = applyRun(rapide, 1, 2, run(10, 10), 55_000)
    expect(lente.outcome.isBestTime).toBe(false)
    expect(bestTimeAt(lente.progress, 2)).toBe(30_000)

    const record = applyRun(rapide, 1, 2, run(10, 10), 21_500)
    expect(record.outcome.isBestTime).toBe(true)
    expect(bestTimeAt(record.progress, 2)).toBe(21_500)
  })

  it('n’efface pas un temps acquis quand la partie suivante est perdue', () => {
    const avec = applyRun({}, 1, 3, run(10, 10), 30_000).progress
    const apres = applyRun(avec, 1, 3, run(2, 9, false), 4_000)
    expect(apres.outcome.timeMs).toBeNull()
    expect(bestTimeAt(apres.progress, 3)).toBe(30_000)
  })

  it('refuse un chrono invraisemblable (horloge, onglet en veille)', () => {
    expect(isPlausibleTime(MIN_RUN_MS - 1)).toBe(false)
    expect(isPlausibleTime(MAX_RUN_MS + 1)).toBe(false)
    expect(isPlausibleTime(Number.NaN)).toBe(false)
    expect(isPlausibleTime(null)).toBe(false)
    expect(isPlausibleTime(60_000)).toBe(true)
    expect(applyRun({}, 1, 1, run(10, 10), 12).outcome.timeMs).toBeNull()
    expect(applyRun({}, 1, 1, run(10, 10)).outcome.timeMs).toBeNull()
  })

  it('survit à l’aller-retour par le stockage', () => {
    const progress = applyRun({}, 1, 5, run(10, 10), 77_000).progress
    expect(bestTimeAt(parseProgress(JSON.stringify(progress)), 5)).toBe(77_000)
  })

  it('ne relit pas un temps aberrant écrit à la main', () => {
    expect(bestTimeAt(parseProgress('{"1":{"stars":3,"best":10,"timeMs":5}}'), 1))
      .toBeNull()
  })
})

describe('formatDuration', () => {
  it('donne le dixième sous la minute — c’est lui qui départage', () => {
    expect(formatDuration(47_320)).toBe('47,3 s')
    expect(formatDuration(2_000)).toBe('2,0 s')
  })

  it('passe aux minutes au-delà', () => {
    expect(formatDuration(84_000)).toBe('1 min 24 s')
    expect(formatDuration(120_000)).toBe('2 min')
  })

  it('n’écrit jamais « 1 min 60 s » quand l’arrondi déborde', () => {
    expect(formatDuration(119_800)).toBe('2 min')
  })

  it('ne dépend pas de la locale de l’appareil (virgule française toujours)', () => {
    expect(formatDuration(12_340)).toContain(',')
    expect(formatDuration(12_340)).not.toContain('.')
  })
})
