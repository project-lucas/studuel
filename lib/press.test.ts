import { describe, expect, it } from 'vitest'
import {
  intentOfVariant,
  pressBuzz,
  pressDepth,
  pressTones,
  type ButtonVariant,
  type PressIntent,
} from '@/lib/press'

const INTENTS: PressIntent[] = ['primary', 'neutral', 'quiet', 'danger', 'back']
const VARIANTS: ButtonVariant[] = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
]

describe('le clic est toujours jouable', () => {
  for (const intent of INTENTS) {
    it(`${intent} : notes valides et courtes`, () => {
      const tones = pressTones(intent)
      expect(tones.length).toBeGreaterThan(0)
      // Trois notes maximum : au-delà, on entend un accord, plus un clic.
      expect(tones.length).toBeLessThanOrEqual(3)
      for (const t of tones) {
        expect(t.freq).toBeGreaterThan(80)
        expect(t.freq).toBeLessThan(8000)
        expect(t.peak).toBeGreaterThan(0)
        // Un bouton se presse des dizaines de fois : il ne doit jamais dominer
        // les sons de jeu (plafonnés à 0.08).
        expect(t.peak).toBeLessThanOrEqual(0.035)
        expect(t.at).toBeGreaterThanOrEqual(0)
      }
    })

    it(`${intent} : tient en moins de 150 ms`, () => {
      // Un clic qui traîne se superpose au suivant quand on tape vite.
      const end = Math.max(...pressTones(intent).map((t) => t.at + t.dur))
      expect(end).toBeLessThan(0.15)
    })
  }
})

describe('l’intensité suit l’importance', () => {
  const loudest = (i: PressIntent) =>
    Math.max(...pressTones(i).map((t) => t.peak))

  it('fait claquer l’action principale plus qu’un bouton discret', () => {
    expect(loudest('primary')).toBeGreaterThan(loudest('quiet'))
    expect(loudest('neutral')).toBeGreaterThan(loudest('quiet'))
  })

  it('donne au discret une seule note, à peine audible', () => {
    expect(pressTones('quiet')).toHaveLength(1)
    expect(loudest('quiet')).toBeLessThan(loudest('neutral'))
  })

  it('descend sur le retour (l’oreille entend qu’on recule)', () => {
    const back = pressTones('back')
    expect(back.at(-1)!.freq).toBeLessThan(back[0].freq)
  })

  it('joue le danger dans le grave', () => {
    const lowest = (i: PressIntent) =>
      Math.min(...pressTones(i).map((t) => t.freq))
    expect(lowest('danger')).toBeLessThan(lowest('neutral'))
  })
})

describe('vibration', () => {
  it('reste courte partout — un bouton se presse cent fois', () => {
    for (const intent of INTENTS) {
      const b = pressBuzz(intent)
      if (b === null) continue
      const total = Array.isArray(b) ? b.reduce((s, n) => s + n, 0) : b
      expect(total, intent).toBeLessThanOrEqual(50)
    }
  })

  it('ne fait pas vibrer pour un chevron', () => {
    expect(pressBuzz('quiet')).toBeNull()
  })

  it('vibre plus fort pour l’action principale que pour un bouton ordinaire', () => {
    expect(pressBuzz('primary')).toBeGreaterThan(pressBuzz('neutral') as number)
  })
})

describe('profondeur du socle', () => {
  it('donne le socle le plus épais à l’action principale', () => {
    expect(pressDepth('primary')).toBeGreaterThan(pressDepth('neutral'))
  })

  it('laisse les boutons plats vraiment plats', () => {
    expect(pressDepth('quiet')).toBe(0)
    expect(pressDepth('back')).toBe(0)
  })

  it('reste dans une plage crédible (jamais un socle de 10 px)', () => {
    for (const intent of INTENTS) {
      expect(pressDepth(intent)).toBeGreaterThanOrEqual(0)
      expect(pressDepth(intent)).toBeLessThanOrEqual(6)
    }
  })
})

describe('variantes du bouton partagé', () => {
  it('donne une intention à chaque variante', () => {
    for (const v of VARIANTS) {
      expect(INTENTS, v).toContain(intentOfVariant(v))
    }
  })

  it('range les variantes là où on les attend', () => {
    expect(intentOfVariant('default')).toBe('primary')
    expect(intentOfVariant('secondary')).toBe('neutral')
    expect(intentOfVariant('outline')).toBe('neutral')
    expect(intentOfVariant('ghost')).toBe('quiet')
    expect(intentOfVariant('link')).toBe('quiet')
    expect(intentOfVariant('destructive')).toBe('danger')
  })

  it('retombe sur l’action principale quand la variante est absente', () => {
    // `<Button>` sans variante EST le bouton principal : le défaut doit suivre.
    expect(intentOfVariant(undefined)).toBe('primary')
  })
})
