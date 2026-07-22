import { describe, it, expect } from 'vitest'
import {
  MAX_STREAK_SEMITONES,
  correctTones,
  countdownTone,
  lifeLostTones,
  loseTones,
  stepClearedTones,
  streakSemitones,
  tickTone,
  winTones,
  wrongTones,
  type GameTimbre,
  type ToneSpec,
} from '@/lib/game-audio'
import { GAME_FORMATS } from '@/lib/jeux/formats'
import { MODE_TIMBRE } from '@/lib/defi-modes'

const TIMBRES: GameTimbre[] = ['cristal', 'metal', 'bois', 'velours', 'cuivre']

// Toute note jouable doit être audible, finie, et dans une plage qui ne fait pas
// mal aux oreilles — un bug de fréquence se paie très cher en sound design.
function expectPlayable(tones: ToneSpec[], label: string) {
  expect(tones.length, `${label} : aucune note`).toBeGreaterThan(0)
  for (const t of tones) {
    expect(Number.isFinite(t.freq), `${label} : fréquence non finie`).toBe(true)
    expect(t.freq, `${label} : sous le seuil audible`).toBeGreaterThan(40)
    expect(t.freq, `${label} : trop aigu`).toBeLessThan(12_000)
    expect(t.dur).toBeGreaterThan(0)
    expect(t.at).toBeGreaterThanOrEqual(0)
    expect(t.peak).toBeGreaterThan(0)
    expect(t.peak, `${label} : volume agressif`).toBeLessThanOrEqual(0.08)
  }
}

describe('toutes les figures sonores sont jouables', () => {
  for (const timbre of TIMBRES) {
    it(`${timbre} : notes valides sur toute la palette`, () => {
      expectPlayable(correctTones(timbre, 0), `${timbre}.correct`)
      expectPlayable(correctTones(timbre, 12), `${timbre}.correct(série)`)
      expectPlayable(wrongTones(timbre), `${timbre}.wrong`)
      expectPlayable(lifeLostTones(timbre), `${timbre}.lifeLost`)
      expectPlayable(stepClearedTones(timbre), `${timbre}.stepCleared`)
      expectPlayable(winTones(timbre), `${timbre}.win`)
      expectPlayable(loseTones(timbre), `${timbre}.lose`)
      expectPlayable([tickTone(timbre, 0)], `${timbre}.tick(0)`)
      expectPlayable([tickTone(timbre, 1)], `${timbre}.tick(1)`)
      expectPlayable([countdownTone(timbre, 3)], `${timbre}.countdown(3)`)
      expectPlayable([countdownTone(timbre, 0)], `${timbre}.countdown(GO)`)
    })
  }
})

describe('les timbres sont vraiment différents', () => {
  it('donne une tonique distincte à chaque timbre', () => {
    const roots = TIMBRES.map((t) => correctTones(t, 0)[0].freq)
    expect(new Set(roots).size).toBe(roots.length)
  })

  it('sépare le plus aigu du plus grave d’au moins une octave', () => {
    const roots = TIMBRES.map((t) => correctTones(t, 0)[0].freq)
    expect(Math.max(...roots) / Math.min(...roots)).toBeGreaterThanOrEqual(2)
  })

  it('ne joue pas la même forme d’onde partout', () => {
    const waves = TIMBRES.map((t) => correctTones(t, 0)[0].wave)
    expect(new Set(waves).size).toBeGreaterThan(2)
  })
})

describe('la série s’entend', () => {
  it('monte d’un demi-ton par bonne réponse puis plafonne', () => {
    expect(streakSemitones(0)).toBe(0)
    expect(streakSemitones(1)).toBe(0)
    expect(streakSemitones(4)).toBe(3)
    expect(streakSemitones(999)).toBe(MAX_STREAK_SEMITONES)
  })

  it('transpose la récompense vers le haut quand la série monte', () => {
    const flat = correctTones('bois', 1)[0].freq
    const hot = correctTones('bois', 5)[0].freq
    expect(hot).toBeGreaterThan(flat)
  })

  it('n’ajoute la note d’accent qu’à partir de 3 d’affilée', () => {
    expect(correctTones('bois', 2)).toHaveLength(2)
    expect(correctTones('bois', 3)).toHaveLength(3)
  })

  it('ne finit jamais dans les aigus pénibles, même en série infinie', () => {
    for (const timbre of TIMBRES) {
      const tones = correctTones(timbre, 500)
      for (const t of tones) expect(t.freq).toBeLessThan(6000)
    }
  })
})

describe('l’échec descend, la réussite monte', () => {
  it('fait descendre la perte de vie', () => {
    for (const timbre of TIMBRES) {
      const [a, b] = lifeLostTones(timbre)
      expect(b.freq).toBeLessThan(a.freq)
    }
  })

  it('fait monter la victoire et descendre la défaite', () => {
    for (const timbre of TIMBRES) {
      const win = winTones(timbre)
      expect(win[win.length - 1].freq).toBeGreaterThan(win[0].freq)
      const lose = loseTones(timbre)
      expect(lose[lose.length - 1].freq).toBeLessThan(lose[0].freq)
    }
  })

  it('joue l’étape franchie au-dessus de la bonne réponse simple', () => {
    for (const timbre of TIMBRES) {
      expect(stepClearedTones(timbre)[0].freq).toBeGreaterThan(
        correctTones(timbre, 0)[0].freq,
      )
    }
  })
})

describe('le chrono se fait sentir', () => {
  it('monte en fréquence et en volume quand l’urgence monte', () => {
    const calm = tickTone('metal', 0)
    const panic = tickTone('metal', 1)
    expect(panic.freq).toBeGreaterThan(calm.freq)
    expect(panic.peak).toBeGreaterThan(calm.peak)
  })

  it('borne l’urgence hors de [0,1] au lieu de délirer', () => {
    expect(tickTone('metal', -5).freq).toBe(tickTone('metal', 0).freq)
    expect(tickTone('metal', 99).freq).toBe(tickTone('metal', 1).freq)
  })

  it('fait sonner le GO une octave au-dessus du décompte', () => {
    for (const timbre of TIMBRES) {
      expect(countdownTone(timbre, 0).freq).toBeCloseTo(
        countdownTone(timbre, 3).freq * 2,
        5,
      )
    }
  })
})

describe('couverture : aucun mode muet', () => {
  it('donne un timbre valide à chaque jeu de salon', () => {
    for (const f of Object.values(GAME_FORMATS)) {
      expect(TIMBRES, `${f.id}`).toContain(f.timbre)
    }
  })

  it('donne un timbre valide à chaque mode de l’Arène', () => {
    for (const [mode, timbre] of Object.entries(MODE_TIMBRE)) {
      expect(TIMBRES, mode).toContain(timbre)
    }
  })

  it('ne fait pas sonner les cinq modes de l’Arène à l’identique', () => {
    expect(new Set(Object.values(MODE_TIMBRE)).size).toBe(5)
  })
})
