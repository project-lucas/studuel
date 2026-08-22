import { describe, expect, it } from 'vitest'
import { bossForSubject } from '@/lib/bosses'
import {
  TRAQUE_FENETRE_MS,
  TRAQUE_SEUIL,
  emptyGauge,
  traqueCard,
  type TraqueCard,
} from '@/lib/traque'
import {
  BULLE_DISPONIBLE,
  afficheEcusson,
  gardienVue,
  peutAffronter,
} from './gardien'

const BOSS = bossForSubject('Français')
const JOUR = '2026-08-24'
const MAINTENANT = Date.parse('2026-08-24T10:00:00.000Z')

/** Une carte de traque à `points`, éventuellement sortie depuis `sortiIlYaMs`. */
function carte(points: number, sortiIlYaMs: number | null = null): TraqueCard {
  const gauge = {
    ...emptyGauge(BOSS.id),
    points,
    debusqueAt:
      sortiIlYaMs === null
        ? null
        : new Date(MAINTENANT - sortiIlYaMs).toISOString(),
  }
  return traqueCard(gauge, BOSS, 'Français', JOUR, MAINTENANT, 'francais')
}

describe('les quatre états du gardien', () => {
  it('n’affiche RIEN sans jauge lisible (migration 212 absente, visiteur)', () => {
    const vue = gardienVue(null)
    expect(vue.etat).toBe('absent')
    expect(afficheEcusson(vue)).toBe(false)
    expect(vue.boss).toBeNull()
  })

  it('tanière : jauge à zéro, le gardien rôde', () => {
    const vue = gardienVue(carte(0))
    expect(vue.etat).toBe('taniere')
    expect(vue.ratio).toBe(0)
    expect(afficheEcusson(vue)).toBe(true)
  })

  it('traque : la jauge monte, l’anneau suit', () => {
    const vue = gardienVue(carte(TRAQUE_SEUIL / 2))
    expect(vue.etat).toBe('traque')
    expect(vue.percent).toBe(50)
    expect(vue.ratio).toBeCloseTo(0.5)
  })

  it('débusqué : il est sorti, la fenêtre court', () => {
    const vue = gardienVue(carte(TRAQUE_SEUIL, 10 * 60_000))
    expect(vue.etat).toBe('debusque')
    expect(peutAffronter(vue)).toBe(true)
  })

  it('une fenêtre passée le rend à la traque, pas au combat', () => {
    const vue = gardienVue(carte(TRAQUE_SEUIL, TRAQUE_FENETRE_MS + 60_000))
    expect(vue.etat).toBe('traque')
    expect(peutAffronter(vue)).toBe(false)
  })
})

describe('la révélation', () => {
  it('garde le buste CACHÉ tant qu’il rôde — c’est tout le sujet de l’anneau', () => {
    expect(gardienVue(carte(0)).revele).toBe(false)
    expect(gardienVue(carte(TRAQUE_SEUIL - 1)).revele).toBe(false)
  })

  it('ne le révèle qu’une fois sorti', () => {
    expect(gardienVue(carte(TRAQUE_SEUIL, 60_000)).revele).toBe(true)
  })

  it('affiche un anneau PLEIN dès qu’il est sorti, quoi que dise la jauge', () => {
    // La fenêtre est ouverte : c'est le seul fait qui compte à cet instant.
    const vue = gardienVue(carte(TRAQUE_SEUIL, 30 * 60_000))
    expect(vue.ratio).toBe(1)
    expect(vue.percent).toBe(100)
  })
})

describe('ce qui est écrit', () => {
  it('dit le GESTE suivant tant qu’il rôde, jamais un pourcentage nu', () => {
    const vue = gardienVue(carte(TRAQUE_SEUIL / 2))
    expect(vue.detail).toMatch(/carte/)
    expect(vue.detail).not.toMatch(/%/)
  })

  it('dit le TEMPS restant une fois sorti', () => {
    const vue = gardienVue(carte(TRAQUE_SEUIL, 17 * 60_000))
    expect(vue.detail).toBe('43 min')
    expect(vue.titre).toContain('est sorti')
  })

  it('nomme le gardien dans les deux états', () => {
    expect(gardienVue(carte(20)).titre).toContain(BOSS.name)
    expect(gardienVue(carte(TRAQUE_SEUIL, 60_000)).titre).toContain(BOSS.name)
  })

  it('annonce la jauge et le geste au lecteur d’écran', () => {
    const aria = gardienVue(carte(40)).aria
    expect(aria).toContain(BOSS.name)
    expect(aria).toContain('40 %')
    expect(aria).toMatch(/carte/)
  })
})

describe('la bulle de l’onglet', () => {
  it('n’existe QUE lorsque le gardien est sorti', () => {
    expect(gardienVue(carte(0)).bulle).toBeNull()
    expect(gardienVue(carte(TRAQUE_SEUIL - 4)).bulle).toBeNull()
    expect(gardienVue(carte(TRAQUE_SEUIL, 60_000)).bulle).toBe(BULLE_DISPONIBLE)
  })

  it('disparaît avec la fenêtre', () => {
    expect(gardienVue(carte(TRAQUE_SEUIL, TRAQUE_FENETRE_MS + 1)).bulle).toBeNull()
  })
})

describe('la porte unique du combat', () => {
  it('ne s’ouvre que sur un gardien sorti', () => {
    expect(peutAffronter(gardienVue(carte(0)))).toBe(false)
    expect(peutAffronter(gardienVue(carte(TRAQUE_SEUIL - 1)))).toBe(false)
    expect(peutAffronter(gardienVue(carte(TRAQUE_SEUIL, 1000)))).toBe(true)
  })

  it('reste ouverte quand la traque est illisible — sinon le boss serait perdu', () => {
    // Sans jauge (212 absente), le billet garde sa forme d'avant : c'est
    // `TrainingPanel` qui tient cette règle, et `absent` est ce qui la déclenche.
    expect(gardienVue(null).etat).toBe('absent')
    expect(peutAffronter(gardienVue(null))).toBe(false)
  })
})
