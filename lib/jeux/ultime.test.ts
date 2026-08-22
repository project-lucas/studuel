import { describe, expect, it } from 'vitest'
import { GAME_FORMATS, ultimeSeconds } from './formats'
import { answer, startRun, timeout } from './run'
import { MAX_STARS, PALIERS, type PalierProgress } from './paliers'
import {
  COTE_BASE,
  COTE_PER_LEVEL,
  COTE_RUNS,
  COTE_TITLES,
  ULTIME,
  ULTIME_GAMES,
  ULTIME_MAX_LEVEL,
  ULTIME_PREPARED_LEVELS,
  bankTierFor,
  coteFor,
  coteTitle,
  hasUltime,
  isUltimeUnlocked,
  nextCoteTitle,
  starsMissingForUltime,
  ultimeFormat,
} from './ultime'

const FORMAT = ultimeFormat(GAME_FORMATS['calcul-mental'])
const juste = { good: true, elapsedMs: 1000 }
const faux = { good: false, elapsedMs: 1000 }

describe('le format de l’épreuve', () => {
  it('garde le jeu, change la mécanique', () => {
    const base = GAME_FORMATS['calcul-mental']
    expect(FORMAT.id).toBe(base.id)
    expect(FORMAT.theme).toBe(base.theme)
    expect(FORMAT.timbre).toBe(base.timbre)
    expect(FORMAT.params.mechanic).toBe('ultime')
  })

  it('parle de NIVEAUX, pas de régimes', () => {
    expect(FORMAT.lexicon.step).toBe('niveau')
    expect(FORMAT.lexicon.steps).toBe('niveaux')
  })

  it('est le MÊME réglage pour tous les jeux — c’est ce qui le rend comparable', () => {
    for (const base of Object.values(GAME_FORMATS)) {
      const f = ultimeFormat(base)
      if (f.params.mechanic !== 'ultime') throw new Error('mécanique inattendue')
      expect(f.params.ultime).toEqual(ULTIME)
    }
  })
})

describe('la montée', () => {
  it('démarre au premier cran de banque et durcit à chaque niveau', () => {
    expect(bankTierFor(0)).toBe(1)
    expect(bankTierFor(4)).toBe(5)
    // Au-delà du dernier palier, la banque continue : c'est ce qui rend
    // l'épreuve sans plafond.
    expect(bankTierFor(9)).toBe(10)
    expect(bankTierFor(-3)).toBe(1)
  })

  it('resserre le chrono à chaque niveau, sans passer sous le plancher', () => {
    if (FORMAT.params.mechanic !== 'ultime') throw new Error('mécanique inattendue')
    const p = FORMAT.params.ultime
    expect(ultimeSeconds(p, 0)).toBe(p.startSeconds)
    expect(ultimeSeconds(p, 1)).toBeLessThan(ultimeSeconds(p, 0))
    expect(ultimeSeconds(p, 500)).toBe(p.minSeconds)
  })

  it('prépare assez de niveaux d’avance pour que personne ne touche le fond', () => {
    expect(ULTIME_PREPARED_LEVELS).toBeGreaterThanOrEqual(20)
    expect(ULTIME_MAX_LEVEL).toBeGreaterThan(ULTIME_PREPARED_LEVELS)
  })
})

describe('le moteur de l’épreuve', () => {
  it('démarre avec UNE vie — c’est la règle entière', () => {
    expect(startRun(FORMAT).lives).toBe(1)
  })

  it('franchit un niveau tous les N succès', () => {
    let run = startRun(FORMAT)
    for (let i = 0; i < ULTIME.perLevel; i++) run = answer(FORMAT, run, juste)
    expect(run.step).toBe(1)
    expect(run.inWave).toBe(0)
    expect(run.stepJustCleared).toBe(true)
    expect(run.status).toBe('playing')
  })

  it('S’ARRÊTE à la première erreur, quel que soit le niveau atteint', () => {
    let run = startRun(FORMAT)
    for (let i = 0; i < ULTIME.perLevel * 4; i++) run = answer(FORMAT, run, juste)
    expect(run.step).toBe(4)
    run = answer(FORMAT, run, faux)
    expect(run.status).toBe('lost')
    expect(run.lives).toBe(0)
    // Le niveau atteint est CONSERVÉ : c'est lui qu'on classe.
    expect(run.step).toBe(4)
  })

  it('traite le chrono écoulé comme une erreur', () => {
    let run = startRun(FORMAT)
    run = answer(FORMAT, run, juste)
    run = timeout(FORMAT, run)
    expect(run.status).toBe('lost')
  })

  it('ne se gagne JAMAIS — elle n’a pas de fin', () => {
    let run = startRun(FORMAT)
    for (let i = 0; i < ULTIME.perLevel * 40; i++) {
      run = answer(FORMAT, run, juste)
      expect(run.status).toBe('playing')
    }
    expect(run.step).toBe(40)
  })
})

describe('le déblocage', () => {
  const dernier = PALIERS[PALIERS.length - 1].level

  it('demande les TROIS étoiles du dernier palier, pas deux', () => {
    const deux: PalierProgress = { [dernier]: { stars: 2, best: 0 } }
    const trois: PalierProgress = { [dernier]: { stars: MAX_STARS, best: 0 } }
    expect(isUltimeUnlocked(deux)).toBe(false)
    expect(isUltimeUnlocked(trois)).toBe(true)
    expect(starsMissingForUltime(deux)).toBe(1)
    expect(starsMissingForUltime(trois)).toBe(0)
    expect(starsMissingForUltime({})).toBe(MAX_STARS)
  })

  it('ne s’ouvre PAS par la classe — aucune fonction de niveau scolaire ici', () => {
    // Le test est structurel : `isUltimeUnlocked` ne prend qu'une progression.
    // Si la classe entrait un jour dans cette porte, un lycéen y passerait sans
    // l'avoir méritée et un 6e très fort resterait dehors.
    expect(isUltimeUnlocked.length).toBe(1)
  })
})

describe('la cote', () => {
  it('vaut la base tant qu’on n’a rien prouvé', () => {
    expect(coteFor([])).toBe(0)
    expect(coteFor([0])).toBe(COTE_BASE)
  })

  it('moyenne les 3 MEILLEURES parties, pas la dernière', () => {
    // 10, 8, 6 retenus ; les deux runs ratées ne comptent pas.
    expect(coteFor([10, 0, 8, 1, 6])).toBe(
      Math.round(COTE_BASE + COTE_PER_LEVEL * 8),
    )
  })

  it('ne redescend jamais : une mauvaise partie de plus ne change rien', () => {
    const avant = coteFor([12, 11, 10])
    expect(coteFor([12, 11, 10, 0])).toBe(avant)
    expect(coteFor([12, 11, 10, 1, 2, 0, 0])).toBe(avant)
  })

  it('monte quand une partie entre dans le trio de tête', () => {
    expect(coteFor([12, 11, 10, 14])).toBeGreaterThan(coteFor([12, 11, 10]))
  })

  it('ne retient que `COTE_RUNS` parties', () => {
    const beaucoup = Array.from({ length: 20 }, (_, i) => i)
    const meilleures = [19, 18, 17].slice(0, COTE_RUNS)
    expect(coteFor(beaucoup)).toBe(coteFor(meilleures))
  })

  it('ignore les valeurs qui ne veulent rien dire', () => {
    expect(coteFor([Number.NaN, -5, 4])).toBe(
      Math.round(COTE_BASE + COTE_PER_LEVEL * 4),
    )
  })
})

describe('les titres', () => {
  it('commencent au premier et montent avec la cote', () => {
    expect(coteTitle(0)).toBe(COTE_TITLES[0].name)
    expect(coteTitle(COTE_TITLES[COTE_TITLES.length - 1].from)).toBe(
      COTE_TITLES[COTE_TITLES.length - 1].name,
    )
  })

  it('ne redescendent pas quand la cote monte', () => {
    const noms = [0, 500, 900, 1300, 2000].map(coteTitle)
    expect(new Set(noms).size).toBe(noms.length)
  })

  it('annoncent le suivant, et rien au sommet', () => {
    expect(nextCoteTitle(0)?.name).toBe(COTE_TITLES[1].name)
    expect(nextCoteTitle(99_999)).toBeNull()
  })

  it('sont GÉNÉRIQUES : le même mot doit tenir sur toutes les matières', () => {
    for (const t of COTE_TITLES) {
      expect(t.name).not.toMatch(/calcul|math|orthograph/i)
    }
  })
})

describe('les jeux concernés', () => {
  it('n’ouvre l’épreuve qu’aux jeux à banque générative', () => {
    expect(hasUltime('calcul-mental')).toBe(true)
    // Banque FINIE : sa difficulté ne pourrait monter que par le chrono, et le
    // classement mesurerait la vitesse de lecture, pas la maîtrise.
    expect(hasUltime('capitales')).toBe(false)
    expect(hasUltime('anatomie-express')).toBe(false)
  })

  it('ne déclare que des jeux réellement au catalogue', () => {
    for (const id of ULTIME_GAMES) {
      expect(Object.keys(GAME_FORMATS)).toContain(id)
    }
  })
})
