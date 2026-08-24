import { describe, expect, it } from 'vitest'
import {
  AISANCE_DEPART,
  AISANCE_MAX,
  AISANCE_MIN,
  bilanCours,
  composerFile,
  couronnes,
  disperser,
  estDue,
  estNouvelle,
  etatInitial,
  ETAPES_APPRENTISSAGE,
  INTERVALLE_FACILE,
  INTERVALLE_MAX,
  isVerdict,
  planifier,
  SEUIL_ACQUISE,
  SEUIL_SANGSUE,
  verdictAutomatique,
  type CardState,
} from '@/lib/carnet/planification'

const T0 = '2026-08-24T10:00:00.000Z'

/** Écart en minutes entre `dueAt` et l'instant de référence. */
const minutesApres = (dueAt: string, from = T0) =>
  Math.round((Date.parse(dueAt) - Date.parse(from)) / 60_000)

/** Écart en jours (calendaire UTC) entre `dueAt` et le jour de référence. */
const joursApres = (dueAt: string, from = T0) => {
  const a = new Date(Date.parse(from))
  a.setUTCHours(0, 0, 0, 0)
  return Math.round((Date.parse(dueAt) - a.getTime()) / 86_400_000)
}

/** Une carte déjà diplômée, pour attaquer directement la phase révision. */
const carteDiplomee = (over: Partial<CardState> = {}): CardState => ({
  ...etatInitial(T0),
  phase: 'revision',
  intervalDays: 10,
  ease: AISANCE_DEPART,
  streak: 3,
  reps: 5,
  ...over,
})

describe('etatInitial', () => {
  it('une carte jamais vue est neuve, en apprentissage et due tout de suite', () => {
    const s = etatInitial(T0)
    expect(s.phase).toBe('apprentissage')
    expect(s.reps).toBe(0)
    expect(s.intervalDays).toBe(0)
    expect(s.ease).toBe(AISANCE_DEPART)
    expect(estNouvelle(s)).toBe(true)
    expect(estDue(s, T0)).toBe(true)
  })
})

describe('planifier — phase apprentissage', () => {
  it('« Bien » monte d’une marche et revient dans la journée', () => {
    const s = planifier(etatInitial(T0), 'bien', T0)
    expect(s.phase).toBe('apprentissage')
    expect(s.step).toBe(1)
    expect(minutesApres(s.dueAt)).toBe(ETAPES_APPRENTISSAGE[1])
  })

  it('« Bien » sur la DERNIÈRE marche diplôme la carte en jours', () => {
    const marche1 = planifier(etatInitial(T0), 'bien', T0)
    const diplome = planifier(marche1, 'bien', T0)
    expect(diplome.phase).toBe('revision')
    expect(diplome.intervalDays).toBe(1)
    expect(joursApres(diplome.dueAt)).toBe(1)
  })

  it('« Encore » renvoie à la première marche', () => {
    const marche1 = planifier(etatInitial(T0), 'bien', T0)
    const rate = planifier(marche1, 'encore', T0)
    expect(rate.step).toBe(0)
    expect(minutesApres(rate.dueAt)).toBe(ETAPES_APPRENTISSAGE[0])
    expect(rate.streak).toBe(0)
  })

  it('« Difficile » garde la même marche sans punir ni faire progresser', () => {
    const marche1 = planifier(etatInitial(T0), 'bien', T0)
    const dur = planifier(marche1, 'difficile', T0)
    expect(dur.step).toBe(1)
    expect(minutesApres(dur.dueAt)).toBe(ETAPES_APPRENTISSAGE[1])
  })

  it('« Facile » diplôme d’emblée, sans gravir les marches', () => {
    const s = planifier(etatInitial(T0), 'facile', T0)
    expect(s.phase).toBe('revision')
    expect(s.intervalDays).toBe(INTERVALLE_FACILE)
  })

  it('l’aisance ne bouge PAS pendant l’apprentissage', () => {
    // Une carte qu'on découvre n'a pas encore de difficulté propre : la punir
    // au premier tâtonnement la condamnerait à des intervalles courts à vie.
    let s = etatInitial(T0)
    s = planifier(s, 'encore', T0)
    s = planifier(s, 'difficile', T0)
    expect(s.ease).toBe(AISANCE_DEPART)
  })
})

describe('planifier — phase révision', () => {
  it('« Bien » multiplie l’intervalle par l’aisance', () => {
    const s = planifier(carteDiplomee({ intervalDays: 10 }), 'bien', T0)
    // 10 × 2,5 = 25, dispersion neutre (grain 0,5)
    expect(s.intervalDays).toBe(25)
    expect(s.ease).toBe(AISANCE_DEPART)
    expect(joursApres(s.dueAt)).toBe(25)
  })

  it('« Difficile » avance peu et fait baisser l’aisance', () => {
    const s = planifier(carteDiplomee({ intervalDays: 10 }), 'difficile', T0)
    expect(s.intervalDays).toBe(12) // 10 × 1,2
    expect(s.ease).toBeCloseTo(2.35, 5)
  })

  it('« Facile » avance plus vite et fait monter l’aisance', () => {
    const s = planifier(carteDiplomee({ intervalDays: 10 }), 'facile', T0)
    expect(s.ease).toBeCloseTo(2.65, 5)
    expect(s.intervalDays).toBe(Math.round(10 * 2.65 * 1.3))
  })

  it('un intervalle d’un jour DÉCOLLE toujours, même avec « Difficile »', () => {
    // 1 × 1,2 arrondi vaut 1 : sans le plancher « courant + 1 », la carte
    // resterait bloquée à un jour indéfiniment.
    const s = planifier(carteDiplomee({ intervalDays: 1 }), 'difficile', T0)
    expect(s.intervalDays).toBeGreaterThanOrEqual(2)
  })

  it('l’intervalle est plafonné', () => {
    const s = planifier(carteDiplomee({ intervalDays: 300 }), 'facile', T0)
    expect(s.intervalDays).toBe(INTERVALLE_MAX)
  })

  it('l’aisance reste dans ses bornes', () => {
    let bas = carteDiplomee({ ease: AISANCE_MIN })
    for (let i = 0; i < 10; i++) bas = planifier(bas, 'difficile', T0)
    expect(bas.ease).toBe(AISANCE_MIN)

    let haut = carteDiplomee({ ease: AISANCE_MAX })
    haut = planifier(haut, 'facile', T0)
    expect(haut.ease).toBe(AISANCE_MAX)
  })
})

describe('planifier — la rechute', () => {
  it('« Encore » sur une carte diplômée la renvoie en apprentissage', () => {
    const s = planifier(carteDiplomee({ intervalDays: 20 }), 'encore', T0)
    expect(s.phase).toBe('apprentissage')
    expect(s.step).toBe(0)
    expect(s.lapses).toBe(1)
    expect(minutesApres(s.dueAt)).toBe(ETAPES_APPRENTISSAGE[0])
  })

  it('elle garde la MOITIÉ de son intervalle, pas zéro', () => {
    const s = planifier(carteDiplomee({ intervalDays: 20 }), 'encore', T0)
    expect(s.intervalDays).toBe(10)
  })

  it('et le retrouve en sortant de la rechute', () => {
    // C'est tout l'écart avec l'ancien moteur : une carte sue depuis trois
    // semaines, ratée une fois, ne repart pas de J+1 comme au premier jour.
    let s = planifier(carteDiplomee({ intervalDays: 20 }), 'encore', T0)
    s = planifier(s, 'bien', T0) // marche 1
    s = planifier(s, 'bien', T0) // diplôme
    expect(s.phase).toBe('revision')
    expect(s.intervalDays).toBe(10)
  })

  it('la carte devient sangsue au-delà du seuil de rechutes', () => {
    const s = planifier(
      carteDiplomee({ lapses: SEUIL_SANGSUE - 1 }),
      'encore',
      T0,
    )
    expect(s.lapses).toBe(SEUIL_SANGSUE)
    expect(s.isLeech).toBe(true)
  })

  it('en deçà du seuil, elle ne l’est pas', () => {
    const s = planifier(carteDiplomee({ lapses: 0 }), 'encore', T0)
    expect(s.isLeech).toBe(false)
  })
})

describe('planifier — comptage', () => {
  it('chaque passage incrémente reps ; seul « Encore » casse la série', () => {
    let s = carteDiplomee({ reps: 5, streak: 3 })
    s = planifier(s, 'bien', T0)
    expect(s.reps).toBe(6)
    expect(s.streak).toBe(4)
    s = planifier(s, 'encore', T0)
    expect(s.reps).toBe(7)
    expect(s.streak).toBe(0)
  })

  it('le passage horodate la carte', () => {
    const s = planifier(etatInitial(T0), 'bien', T0)
    expect(s.lastSeenAt).toBe(T0)
  })
})

describe('disperser', () => {
  it('un grain neutre laisse l’intervalle intact', () => {
    expect(disperser(20, 0.5)).toBe(20)
  })

  it('les grains extrêmes restent dans ±5 %', () => {
    expect(disperser(100, 0)).toBe(95)
    expect(disperser(100, 0.999999)).toBe(105)
  })

  it('les intervalles très courts ne sont pas dispersés', () => {
    // Disperser 1 jour, c'est le transformer en 0 ou 2 : le bruit vaudrait le
    // signal.
    expect(disperser(1, 0)).toBe(1)
    expect(disperser(1, 0.99)).toBe(1)
  })
})

describe('estDue', () => {
  it('une carte due dans le futur ne l’est pas', () => {
    const s = { ...etatInitial(T0), dueAt: '2026-08-25T10:00:00.000Z' }
    expect(estDue(s, T0)).toBe(false)
  })

  it('une carte due dans le passé l’est', () => {
    const s = { ...etatInitial(T0), dueAt: '2026-08-23T10:00:00.000Z' }
    expect(estDue(s, T0)).toBe(true)
  })

  it('une échéance illisible rend la carte due (jamais perdue en silence)', () => {
    const s = { ...etatInitial(T0), dueAt: 'n’importe quoi' }
    expect(estDue(s, T0)).toBe(true)
  })
})

describe('verdictAutomatique', () => {
  it('une bonne réponse vaut « Bien »', () => {
    expect(verdictAutomatique({ correct: true })).toBe('bien')
  })
  it('un « presque » (faute de frappe) vaut « Difficile »', () => {
    expect(verdictAutomatique({ correct: true, presque: true })).toBe('difficile')
  })
  it('une mauvaise réponse vaut « Encore »', () => {
    expect(verdictAutomatique({ correct: false })).toBe('encore')
  })
})

describe('isVerdict', () => {
  it('accepte les quatre verdicts et rien d’autre', () => {
    expect(isVerdict('bien')).toBe(true)
    expect(isVerdict('facile')).toBe(true)
    expect(isVerdict('parfait')).toBe(false)
    expect(isVerdict(null)).toBe(false)
  })
})

describe('composerFile', () => {
  const carte = (id: string, state: Partial<CardState>) => ({
    id,
    state: { ...etatInitial(T0), ...state },
  })

  it('ne retient que les cartes dues', () => {
    const file = composerFile(
      [
        carte('due', { reps: 2, dueAt: '2026-08-23T00:00:00.000Z' }),
        carte('plus-tard', { reps: 2, dueAt: '2026-09-01T00:00:00.000Z' }),
      ],
      { nouvelles: 10, revisions: 10 },
      T0,
    )
    expect(file).toEqual(['due'])
  })

  it('plafonne séparément les nouvelles et les révisions', () => {
    const cartes = [
      ...Array.from({ length: 30 }, (_, i) =>
        carte(`rev${i}`, { reps: 3, dueAt: T0 }),
      ),
      ...Array.from({ length: 30 }, (_, i) => carte(`new${i}`, { reps: 0 })),
    ]
    const file = composerFile(cartes, { nouvelles: 5, revisions: 20 }, T0)
    expect(file.filter((id) => id.startsWith('rev'))).toHaveLength(20)
    expect(file.filter((id) => id.startsWith('new'))).toHaveLength(5)
  })

  it('sert les révisions AVANT les nouvelles', () => {
    // Découvrir dix cartes le jour où trente sont à revoir, c'est creuser la
    // dette de demain.
    const file = composerFile(
      [
        carte('neuve', { reps: 0 }),
        carte('revue', { reps: 4, phase: 'revision', dueAt: T0 }),
      ],
      { nouvelles: 5, revisions: 5 },
      T0,
    )
    expect(file[0]).toBe('revue')
  })

  it('met les cartes en RECHUTE en tête des révisions', () => {
    const file = composerFile(
      [
        carte('calme', { reps: 4, phase: 'revision', dueAt: T0 }),
        carte('coince', {
          reps: 6,
          phase: 'apprentissage',
          lapses: 2,
          dueAt: T0,
        }),
      ],
      { nouvelles: 5, revisions: 5 },
      T0,
    )
    expect(file[0]).toBe('coince')
  })

  it('un plafond à zéro écarte toute la catégorie', () => {
    const file = composerFile(
      [carte('neuve', { reps: 0 }), carte('revue', { reps: 4, dueAt: T0 })],
      { nouvelles: 0, revisions: 5 },
      T0,
    )
    expect(file).toEqual(['revue'])
  })

  it('les grains fournis décident du mélange (reproductible)', () => {
    const cartes = ['a', 'b', 'c'].map((id) =>
      carte(id, { reps: 2, phase: 'revision', dueAt: T0 }),
    )
    const file = composerFile(
      cartes,
      { nouvelles: 0, revisions: 10 },
      T0,
      [0.9, 0.1, 0.5],
    )
    expect(file).toEqual(['b', 'c', 'a'])
  })
})

describe('bilanCours & couronnes', () => {
  const carte = (state: Partial<CardState>) => ({
    id: Math.random().toString(36),
    state: { ...etatInitial(T0), ...state },
  })

  it('compte ce qui est dû, neuf, en rechute, sangsue et acquis', () => {
    const bilan = bilanCours(
      [
        carte({ reps: 0 }), // neuve, due
        carte({ reps: 3, phase: 'apprentissage', lapses: 1, dueAt: T0 }), // rechute
        carte({
          reps: 9,
          phase: 'revision',
          intervalDays: SEUIL_ACQUISE,
          dueAt: '2026-09-30T00:00:00.000Z',
        }), // acquise, pas due
        carte({ reps: 12, lapses: SEUIL_SANGSUE, isLeech: true, dueAt: T0 }),
      ],
      T0,
    )
    expect(bilan.total).toBe(4)
    expect(bilan.dues).toBe(3)
    expect(bilan.nouvelles).toBe(1)
    expect(bilan.enRechute).toBe(2)
    expect(bilan.sangsues).toBe(1)
    expect(bilan.acquises).toBe(1)
  })

  it('les couronnes se comptent sur les cartes ACQUISES', () => {
    const acquise = () =>
      carte({ reps: 9, phase: 'revision', intervalDays: SEUIL_ACQUISE })
    const jeune = () => carte({ reps: 1, phase: 'revision', intervalDays: 2 })

    expect(couronnes(bilanCours([jeune(), jeune(), jeune()], T0))).toBe(0)
    expect(couronnes(bilanCours([acquise(), jeune(), jeune()], T0))).toBe(1)
    expect(couronnes(bilanCours([acquise(), acquise(), jeune()], T0))).toBe(2)
    expect(couronnes(bilanCours([acquise(), acquise()], T0))).toBe(3)
  })

  it('un cours vide n’a aucune couronne', () => {
    expect(couronnes(bilanCours([], T0))).toBe(0)
  })

  it('une carte devinée UNE fois ne vaut pas une carte sue depuis deux mois', () => {
    // Le défaut de l'ancien `crownsForCourse` : « dernier essai juste » mettait
    // les deux au même rang.
    const devinee = carte({ reps: 1, phase: 'revision', intervalDays: 1 })
    expect(bilanCours([devinee], T0).acquises).toBe(0)
  })
})
