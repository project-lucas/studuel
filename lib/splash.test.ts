import { describe, expect, it } from 'vitest'
import {
  SPLASH_MIN_MS,
  SPLASH_RAMP_MS,
  SPLASH_READY_CAP_MS,
  SPLASH_TIPS,
  SPLASH_WAIT_CEILING,
  formatSplashPercent,
  isSplashReady,
  shouldShowSplash,
  splashProgress,
  tipOfDay,
} from './splash'

describe('tipOfDay', () => {
  it('renvoie la même astuce pour une même journée', () => {
    expect(tipOfDay('2026-07-29')).toBe(tipOfDay('2026-07-29'))
  })

  it('change d’astuce d’un jour à l’autre', () => {
    expect(tipOfDay('2026-07-29')).not.toBe(tipOfDay('2026-07-30'))
  })

  it('parcourt tout le catalogue sur un cycle complet', () => {
    const vus = new Set<string>()
    for (let i = 0; i < SPLASH_TIPS.length; i += 1) {
      const jour = new Date(Date.UTC(2026, 6, 1 + i)).toISOString().slice(0, 10)
      vus.add(tipOfDay(jour))
    }
    expect(vus.size).toBe(SPLASH_TIPS.length)
  })

  it('retombe sur la première astuce si la clé de jour est illisible', () => {
    expect(tipOfDay('pas-une-date')).toBe(SPLASH_TIPS[0])
  })

  it('n’expose aucune astuce vide', () => {
    for (const tip of SPLASH_TIPS) expect(tip.trim().length).toBeGreaterThan(0)
  })
})

describe('shouldShowSplash', () => {
  it('joue le rideau sur les onglets du jeu', () => {
    for (const route of ['/reviser', '/defi', '/amis', '/moi', '/tresor']) {
      expect(shouldShowSplash(route, true)).toBe(true)
    }
  })

  it('joue le rideau sur les sous-pages du jeu', () => {
    expect(shouldShowSplash('/defi/jouer', true)).toBe(true)
    expect(shouldShowSplash('/reviser/cours/revoir', true)).toBe(true)
  })

  it('ne joue jamais pour un visiteur non connecté', () => {
    expect(shouldShowSplash('/reviser', false)).toBe(false)
    expect(shouldShowSplash('/defi', false)).toBe(false)
  })

  it('ne joue pas devant l’onboarding ni la connexion', () => {
    for (const route of ['/bienvenue', '/onboarding', '/login', '/auth/callback']) {
      expect(shouldShowSplash(route, true)).toBe(false)
    }
  })

  it('ne joue pas dans les espaces qui ne sont pas le jeu', () => {
    expect(shouldShowSplash('/parents', true)).toBe(false)
    expect(shouldShowSplash('/admin/matieres', true)).toBe(false)
  })

  it('ne confond pas un préfixe avec un début de mot', () => {
    // /admin est exclu, /administration serait une autre page : elle garderait
    // le rideau. La garde compare des SEGMENTS, pas des chaînes.
    expect(shouldShowSplash('/administration', true)).toBe(true)
    expect(shouldShowSplash('/bienvenue-bis', true)).toBe(true)
  })
})

describe('isSplashReady', () => {
  it('n’est pas prêt tant que le document charge', () => {
    expect(
      isSplashReady({ documentLoaded: false, appReady: true, elapsedMs: 500 }),
    ).toBe(false)
  })

  it('n’est pas prêt tant que le premier écran n’est pas peint', () => {
    // Le cas qui faisait s'ouvrir le rideau sur des squelettes : `load` est
    // passé, mais le bandeau streamé n'est pas encore arrivé.
    expect(
      isSplashReady({ documentLoaded: true, appReady: false, elapsedMs: 500 }),
    ).toBe(false)
  })

  it('est prêt quand les deux signaux sont là', () => {
    expect(
      isSplashReady({ documentLoaded: true, appReady: true, elapsedMs: 500 }),
    ).toBe(true)
  })

  it('lève le rideau au plafond même si un signal manque', () => {
    expect(
      isSplashReady({
        documentLoaded: false,
        appReady: false,
        elapsedMs: SPLASH_READY_CAP_MS,
      }),
    ).toBe(true)
  })

  it('laisse au premier écran le temps d’arriver avant le plafond', () => {
    expect(SPLASH_READY_CAP_MS).toBeGreaterThan(SPLASH_MIN_MS)
  })
})

describe('splashProgress', () => {
  it('part de zéro', () => {
    expect(splashProgress(0, false)).toBe(0)
  })

  it('ne dépasse jamais le plafond tant que l’app n’est pas prête', () => {
    expect(splashProgress(SPLASH_RAMP_MS * 10, false)).toBe(SPLASH_WAIT_CEILING)
  })

  it('progresse sans jamais reculer', () => {
    let precedent = -1
    for (let t = 0; t <= SPLASH_RAMP_MS; t += 100) {
      const valeur = splashProgress(t, false)
      expect(valeur).toBeGreaterThanOrEqual(precedent)
      precedent = valeur
    }
  })

  it('ralentit en approchant du plafond (ease-out)', () => {
    const debut = splashProgress(SPLASH_RAMP_MS * 0.25, false)
    const fin =
      splashProgress(SPLASH_RAMP_MS, false) -
      splashProgress(SPLASH_RAMP_MS * 0.75, false)
    expect(debut).toBeGreaterThan(fin)
  })

  it('file à 100 quand l’app est prête et la durée minimale écoulée', () => {
    expect(splashProgress(SPLASH_MIN_MS, true)).toBe(100)
  })

  it('retient la barre si l’app est prête trop tôt (pas de flash)', () => {
    expect(splashProgress(SPLASH_MIN_MS - 1, true)).toBeLessThan(100)
  })

  it('monte encore quand la durée minimale est atteinte', () => {
    // Une barre figée à son plafond pendant que le rideau attend donne
    // l'impression que l'app a planté. La rampe doit survivre au plancher.
    expect(SPLASH_RAMP_MS).toBeGreaterThan(SPLASH_MIN_MS)
    expect(splashProgress(SPLASH_MIN_MS, false)).toBeLessThan(
      SPLASH_WAIT_CEILING,
    )
  })

  it('laisse le temps de lire l’astuce du jour', () => {
    // En dessous d'environ 1,5 s, la phrase n'est pas lisible : on paierait le
    // coût d'un écran de chargement sans le bénéfice pédagogique.
    expect(SPLASH_MIN_MS).toBeGreaterThanOrEqual(1500)
  })
})

describe('formatSplashPercent', () => {
  it('sépare le nombre du signe par une espace insécable', () => {
    expect(formatSplashPercent(80)).toBe('80 %')
  })

  it('borne les valeurs hors échelle', () => {
    expect(formatSplashPercent(-5)).toBe('0 %')
    expect(formatSplashPercent(140)).toBe('100 %')
  })

  it('arrondit les valeurs intermédiaires', () => {
    expect(formatSplashPercent(66.6)).toBe('67 %')
  })
})
