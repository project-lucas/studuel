import { describe, expect, it } from 'vitest'
import {
  BOX_ANCRAGE,
  bilanDuQuiz,
  formatDureeGain,
  formatDureeTotale,
  type EtatBilan,
} from '@/lib/quiz-bilan'

const vue = (box: number): EtatBilan => ({ box, timesSeen: 3 })
const jamaisVue = (): EtatBilan => ({ box: 1, timesSeen: 0 })

describe('bilanDuQuiz — réussite', () => {
  it('se divise par les questions POSÉES, pas par le quiz entier', () => {
    // Une séance d'entraînement de 5 questions sur 8, toutes justes, vaut
    // 100 % — pas 62 %.
    const b = bilanDuQuiz(8, [], { justes: 5, posees: 5 })
    expect(b.reussite).toBe(100)
  })

  it('vaut 0 quand rien n’a été posé (jamais NaN)', () => {
    expect(bilanDuQuiz(8, [], { justes: 0, posees: 0 }).reussite).toBe(0)
  })

  it('arrondit', () => {
    expect(bilanDuQuiz(8, [], { justes: 3, posees: 8 }).reussite).toBe(38)
  })
})

describe('bilanDuQuiz — avancement', () => {
  it('compte les questions déjà rencontrées sur le quiz ENTIER', () => {
    const b = bilanDuQuiz(8, [vue(1), vue(2), vue(3), vue(1)], {
      justes: 0,
      posees: 0,
    })
    expect(b.avancement).toBe(50)
  })

  it('une question sans état n’a jamais été rencontrée', () => {
    const b = bilanDuQuiz(4, [vue(2), jamaisVue()], { justes: 0, posees: 0 })
    expect(b.avancement).toBe(25)
  })

  it('vaut 0 sur un quiz vide, sans division par zéro', () => {
    expect(bilanDuQuiz(0, [], { justes: 0, posees: 0 }).avancement).toBe(0)
  })

  it('ne dépasse jamais 100 %, même avec plus d’états que de questions', () => {
    // Arrive si le quiz a été raccourci depuis que l'élève l'a passé.
    const b = bilanDuQuiz(2, [vue(1), vue(1), vue(1), vue(1)], {
      justes: 0,
      posees: 0,
    })
    expect(b.avancement).toBe(100)
  })
})

describe('bilanDuQuiz — ancrage', () => {
  it('ne compte que les questions montées au palier durable', () => {
    const b = bilanDuQuiz(
      4,
      [vue(BOX_ANCRAGE), vue(BOX_ANCRAGE + 1), vue(1), vue(2)],
      { justes: 0, posees: 0 },
    )
    expect(b.ancrage).toBe(50)
  })

  it('une question tout juste découverte n’est pas ancrée', () => {
    expect(bilanDuQuiz(1, [vue(1)], { justes: 1, posees: 1 }).ancrage).toBe(0)
  })

  it('une boîte illisible retombe au plancher plutôt que de compter', () => {
    const b = bilanDuQuiz(
      1,
      [{ box: Number.NaN, timesSeen: 5 }],
      { justes: 0, posees: 0 },
    )
    expect(b.ancrage).toBe(0)
  })

  it('une boîte hors bornes est ramenée dans les bornes', () => {
    const b = bilanDuQuiz(1, [{ box: 99, timesSeen: 5 }], {
      justes: 0,
      posees: 0,
    })
    expect(b.ancrage).toBe(100)
  })
})

describe('bilanDuQuiz — les trois ensemble', () => {
  it('avancement et ancrage sont indépendants de la réussite du jour', () => {
    // Un élève qui rate tout aujourd'hui sur un chapitre qu'il a déjà ancré
    // doit voir un ancrage élevé et une réussite basse : c'est exactement
    // l'information que « 0/4 » cachait.
    const b = bilanDuQuiz(
      4,
      [vue(5), vue(5), vue(4), vue(4)],
      { justes: 0, posees: 4 },
    )
    expect(b.reussite).toBe(0)
    expect(b.avancement).toBe(100)
    expect(b.ancrage).toBe(100)
  })
})

describe('formatDureeGain', () => {
  it('écrit les secondes seules en dessous d’une minute', () => {
    expect(formatDureeGain(45)).toBe('+45s')
    expect(formatDureeGain(0)).toBe('+0s')
  })

  it('écrit minutes et secondes, secondes sur deux chiffres', () => {
    expect(formatDureeGain(136)).toBe('+2m16')
    expect(formatDureeGain(126)).toBe('+2m06')
    expect(formatDureeGain(60)).toBe('+1m00')
  })

  it('passe aux heures au-delà de soixante minutes', () => {
    expect(formatDureeGain(3600)).toBe('+1h00')
    expect(formatDureeGain(3840)).toBe('+1h04')
  })

  it('ne rend jamais de valeur négative ni NaN', () => {
    expect(formatDureeGain(-10)).toBe('+0s')
    expect(formatDureeGain(Number.NaN)).toBe('+0s')
  })
})

describe('formatDureeTotale', () => {
  it('n’a PAS de « + » — un total ne s’ajoute à rien', () => {
    // C'est ce qui le distingue de `formatDureeGain` : l'un annonce un gain,
    // l'autre une somme.
    expect(formatDureeTotale(3840)).not.toContain('+')
  })

  it('écrit les secondes, puis les minutes, puis les heures', () => {
    expect(formatDureeTotale(12)).toBe('12 s')
    expect(formatDureeTotale(47 * 60)).toBe('47 min')
    expect(formatDureeTotale(2 * 3600 + 14 * 60)).toBe('2 h 14')
  })

  it('met les minutes sur deux chiffres', () => {
    expect(formatDureeTotale(3600 + 4 * 60)).toBe('1 h 04')
  })

  it('ne rend jamais de valeur négative ni NaN', () => {
    expect(formatDureeTotale(-10)).toBe('0 s')
    expect(formatDureeTotale(Number.NaN)).toBe('0 s')
  })
})
