import { describe, expect, it } from 'vitest'
import { etatInitial, type CardState } from '@/lib/carnet/planification'
import {
  correctionDifferee,
  filtrerPourSession,
  longueurEffective,
  modePlanifie,
  normalizeOptions,
  OPTIONS_DEFAUT,
  resumeOptions,
  sensDeLaCarte,
  type CarteCandidate,
  type SessionOptions,
} from '@/lib/carnet/session-options'

const T0 = '2026-08-24T10:00:00.000Z'

const carte = (
  id: string,
  over: Partial<CarteCandidate> = {},
  etat: Partial<CardState> = {},
): CarteCandidate => ({
  id,
  type: 'flashcard',
  chapterId: null,
  chapitresParents: [],
  tagIds: [],
  state: { ...etatInitial(T0), ...etat },
  ...over,
})

const opts = (over: Partial<SessionOptions> = {}): SessionOptions => ({
  ...OPTIONS_DEFAUT,
  ...over,
})

describe('normalizeOptions', () => {
  it('rend les défauts pour une entrée vide', () => {
    expect(normalizeOptions(undefined)).toEqual(OPTIONS_DEFAUT)
  })

  it('accepte une portée de chapitre', () => {
    const o = normalizeOptions({ portee: { kind: 'chapitre', chapterId: 'c1' } })
    expect(o.portee).toEqual({ kind: 'chapitre', chapterId: 'c1' })
  })

  it('refuse une portée de chapitre sans identifiant', () => {
    expect(normalizeOptions({ portee: { kind: 'chapitre' } }).portee).toEqual({
      kind: 'tout',
    })
  })

  it('jette les types inconnus et dédoublonne', () => {
    const o = normalizeOptions({
      types: ['flashcard', 'flashcard', 'sorcellerie', 'qcm'],
    })
    expect(o.types).toEqual(['flashcard', 'qcm'])
  })

  it('retombe sur les défauts pour un sens ou un mode inconnus', () => {
    const o = normalizeOptions({ sens: 'en-diagonale', mode: 'sieste' })
    expect(o.sens).toBe(OPTIONS_DEFAUT.sens)
    expect(o.mode).toBe(OPTIONS_DEFAUT.mode)
  })

  it('borne la longueur et refuse les valeurs absurdes', () => {
    expect(normalizeOptions({ longueur: 10 }).longueur).toBe(10)
    expect(normalizeOptions({ longueur: 0 }).longueur).toBe(null)
    expect(normalizeOptions({ longueur: -5 }).longueur).toBe(null)
    expect(normalizeOptions({ longueur: 99_999 }).longueur).toBe(500)
    expect(normalizeOptions({ longueur: 'beaucoup' }).longueur).toBe(null)
  })
})

describe('filtrerPourSession — la portée', () => {
  it('« tout » laisse passer les cartes dues', () => {
    const cartes = [carte('a'), carte('b')]
    expect(filtrerPourSession(cartes, opts(), T0)).toHaveLength(2)
  })

  it('un chapitre ne garde que les siennes', () => {
    const cartes = [
      carte('dedans', { chapterId: 'c1' }),
      carte('dehors', { chapterId: 'c2' }),
    ]
    const gardees = filtrerPourSession(
      cartes,
      opts({ portee: { kind: 'chapitre', chapterId: 'c1' } }),
      T0,
    )
    expect(gardees.map((c) => c.id)).toEqual(['dedans'])
  })

  it('un chapitre emporte ses SOUS-chapitres', () => {
    const cartes = [
      carte('petit-fils', { chapterId: 'c3', chapitresParents: ['c1', 'c2'] }),
    ]
    expect(
      filtrerPourSession(
        cartes,
        opts({ portee: { kind: 'chapitre', chapterId: 'c1' } }),
        T0,
      ),
    ).toHaveLength(1)
  })

  it('une étiquette ne garde que les cartes marquées', () => {
    const cartes = [
      carte('bac', { tagIds: ['t-bac'] }),
      carte('rien', { tagIds: [] }),
    ]
    const gardees = filtrerPourSession(
      cartes,
      opts({ portee: { kind: 'etiquette', tagId: 't-bac' } }),
      T0,
    )
    expect(gardees.map((c) => c.id)).toEqual(['bac'])
  })
})

describe('filtrerPourSession — « mes erreurs »', () => {
  const erreurs = opts({ portee: { kind: 'erreurs' } })

  it('garde une carte retombée en apprentissage (rechute)', () => {
    const c = carte('rechute', {}, { reps: 5, phase: 'apprentissage', lapses: 2 })
    expect(filtrerPourSession([c], erreurs, T0)).toHaveLength(1)
  })

  it('garde une carte-sangsue', () => {
    const c = carte('sangsue', {}, { reps: 9, phase: 'revision', isLeech: true })
    expect(filtrerPourSession([c], erreurs, T0)).toHaveLength(1)
  })

  it('écarte une carte jamais vue — une inconnue n’est pas une erreur', () => {
    const c = carte('neuve', {}, { reps: 0, phase: 'apprentissage' })
    expect(filtrerPourSession([c], erreurs, T0)).toHaveLength(0)
  })

  it('écarte une carte qui va bien', () => {
    const c = carte('calme', {}, { reps: 4, phase: 'revision', intervalDays: 12 })
    expect(filtrerPourSession([c], erreurs, T0)).toHaveLength(0)
  })
})

describe('filtrerPourSession — les types', () => {
  it('une liste vide accepte tout', () => {
    const cartes = [carte('f'), carte('q', { type: 'qcm' })]
    expect(filtrerPourSession(cartes, opts({ types: [] }), T0)).toHaveLength(2)
  })

  it('une liste non vide ne garde que ces types', () => {
    const cartes = [carte('f'), carte('q', { type: 'qcm' })]
    const gardees = filtrerPourSession(cartes, opts({ types: ['qcm'] }), T0)
    expect(gardees.map((c) => c.id)).toEqual(['q'])
  })
})

describe('filtrerPourSession — les modes et l’échéance', () => {
  const plusTard = { dueAt: '2026-12-01T00:00:00.000Z', reps: 3 }

  it('« apprendre » écarte ce qui n’est pas dû', () => {
    const c = carte('pas-due', {}, plusTard)
    expect(filtrerPourSession([c], opts({ mode: 'apprentissage' }), T0)).toHaveLength(0)
  })

  it('« s’entraîner » ignore les échéances', () => {
    const c = carte('pas-due', {}, plusTard)
    expect(filtrerPourSession([c], opts({ mode: 'entrainement' }), T0)).toHaveLength(1)
  })

  it('« examen blanc » ignore aussi les échéances', () => {
    const c = carte('pas-due', {}, plusTard)
    expect(filtrerPourSession([c], opts({ mode: 'examen' }), T0)).toHaveLength(1)
  })
})

describe('modePlanifie & correctionDifferee', () => {
  it('seul l’apprentissage écrit les échéances', () => {
    // Repasser vingt fois ses cartes la veille d'un contrôle ne doit pas
    // repousser leurs révisions de six mois.
    expect(modePlanifie('apprentissage')).toBe(true)
    expect(modePlanifie('entrainement')).toBe(false)
    expect(modePlanifie('examen')).toBe(false)
  })

  it('seul l’examen diffère la correction', () => {
    expect(correctionDifferee('examen')).toBe(true)
    expect(correctionDifferee('apprentissage')).toBe(false)
  })
})

describe('sensDeLaCarte', () => {
  it('les sens fixes ignorent le grain', () => {
    expect(sensDeLaCarte('recto-verso', 0.9)).toBe('endroit')
    expect(sensDeLaCarte('verso-recto', 0.1)).toBe('envers')
  })

  it('le mixte se décide sur le grain', () => {
    expect(sensDeLaCarte('mixte', 0.2)).toBe('endroit')
    expect(sensDeLaCarte('mixte', 0.8)).toBe('envers')
  })
})

describe('longueurEffective', () => {
  it('« tout » rend ce qui existe', () => {
    expect(longueurEffective(37, null)).toBe(37)
  })

  it('borne par ce qui existe réellement', () => {
    expect(longueurEffective(7, 20)).toBe(7)
    expect(longueurEffective(50, 20)).toBe(20)
  })

  it('ne rend jamais un nombre négatif', () => {
    expect(longueurEffective(0, 10)).toBe(0)
  })
})

describe('resumeOptions', () => {
  it('nomme la portée et le mode', () => {
    expect(resumeOptions(opts())).toBe('Tout le cours · Apprendre')
    expect(resumeOptions(opts({ portee: { kind: 'erreurs' } }))).toBe(
      'Mes erreurs · Apprendre',
    )
  })

  it('utilise le nom du chapitre quand il est fourni', () => {
    const o = opts({
      portee: { kind: 'chapitre', chapterId: 'c1' },
      mode: 'examen',
    })
    expect(resumeOptions(o, 'La Grande Guerre')).toBe(
      'La Grande Guerre · Examen blanc',
    )
  })
})
