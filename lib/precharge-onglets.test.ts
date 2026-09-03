import { describe, expect, it } from 'vitest'
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types'
import { NAV_TABS } from './nav-tabs'
import {
  CADENCE_RONDE_MS,
  DELAI_PREMIER_PRECHARGEMENT_MS,
  ESPACEMENT_MS,
  INACTIVITE_MAX_MS,
  PRECHARGEMENT_COMPLET,
  doitPrecharger,
  ongletsAPrecharger,
  planifierRonde,
} from './precharge-onglets'

describe('ongletsAPrecharger', () => {
  it('donne les quatre autres onglets, voisins de balayage en tête', () => {
    // Depuis Réviser (index 1) : Défi (voisin droit) puis Boutique (voisin
    // gauche), puis les autres dans l'ordre de la barre.
    expect(ongletsAPrecharger('/reviser')).toEqual([
      '/defi',
      '/tresor',
      '/amis',
      '/moi',
    ])
  })

  it('fait passer l’arène avant le reste quand elle n’est pas voisine', () => {
    // Depuis Moi (dernier onglet) : le seul voisin est Amis, puis l'arène.
    expect(ongletsAPrecharger('/moi')).toEqual([
      '/amis',
      '/defi',
      '/tresor',
      '/reviser',
    ])
  })

  it('exclut l’onglet courant et ne doublonne jamais', () => {
    for (const tab of NAV_TABS) {
      const liste = ongletsAPrecharger(tab.path)
      expect(liste).not.toContain(tab.path)
      expect(new Set(liste).size).toBe(NAV_TABS.length - 1)
    }
  })

  it('couvre les sous-pages d’un onglet', () => {
    expect(ongletsAPrecharger('/reviser/maths')).toEqual(
      ongletsAPrecharger('/reviser'),
    )
  })

  it('ne précharge rien hors des onglets (quiz, cours, onboarding)', () => {
    expect(ongletsAPrecharger('/test/abc')).toEqual([])
    expect(ongletsAPrecharger('/bienvenue')).toEqual([])
    expect(ongletsAPrecharger('/compte')).toEqual([])
  })
})

describe('doitPrecharger', () => {
  const base = {
    pathname: '/defi',
    visible: true,
    derniereActiviteMs: 1_000,
    nowMs: 2_000,
  }

  it('précharge depuis un onglet visible avec un élève actif', () => {
    expect(doitPrecharger(base)).toBe(true)
  })

  it('refuse un onglet de navigateur caché', () => {
    expect(doitPrecharger({ ...base, visible: false })).toBe(false)
  })

  it('refuse hors des onglets principaux', () => {
    expect(doitPrecharger({ ...base, pathname: '/test/abc' })).toBe(false)
  })

  it('refuse un téléphone posé (aucun geste depuis trop longtemps)', () => {
    expect(
      doitPrecharger({
        ...base,
        nowMs: base.derniereActiviteMs + INACTIVITE_MAX_MS + 1,
      }),
    ).toBe(false)
    expect(
      doitPrecharger({
        ...base,
        nowMs: base.derniereActiviteMs + INACTIVITE_MAX_MS,
      }),
    ).toBe(true)
  })
})

describe('planifierRonde', () => {
  it('espace les onglets un par un à partir du délai initial', () => {
    const plan = planifierRonde('/reviser', 1_000)
    expect(plan.map((p) => p.href)).toEqual(ongletsAPrecharger('/reviser'))
    expect(plan.map((p) => p.retardMs)).toEqual([
      1_000,
      1_000 + ESPACEMENT_MS,
      1_000 + 2 * ESPACEMENT_MS,
      1_000 + 3 * ESPACEMENT_MS,
    ])
  })

  it('est vide hors des onglets', () => {
    expect(planifierRonde('/test/abc', 0)).toEqual([])
  })
})

describe('les constantes tiennent leurs promesses', () => {
  it('parle le même dialecte que le routeur Next pour « complet »', () => {
    // Le mot est passé à `router.prefetch` ; s'il change chez Next, la page
    // ne serait plus préchargée qu'à moitié (le squelette seul) — en silence.
    expect(PRECHARGEMENT_COMPLET).toBe(PrefetchKind.FULL)
  })

  it('laisse la page courante passer d’abord, et rattrape une expiration vite', () => {
    expect(DELAI_PREMIER_PRECHARGEMENT_MS).toBeGreaterThanOrEqual(1_000)
    // staleTimes.dynamic vaut 120 s : la ronde doit repasser bien avant.
    expect(CADENCE_RONDE_MS).toBeLessThan(120_000)
    expect(CADENCE_RONDE_MS).toBeGreaterThanOrEqual(30_000)
  })
})
