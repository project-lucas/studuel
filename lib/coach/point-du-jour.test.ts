import { describe, it, expect } from 'vitest'
import { pointDuJour, BONUS_MINUTES, type PointInput } from './point-du-jour'
import { REGIMES } from './regimes'
import type { Mission, MissionPlan } from '../mission'

function mission(over: Partial<Mission> = {}): Mission {
  return {
    kind: 'reprise',
    subjectSlug: 'maths',
    subjectName: 'Mathématiques',
    chapterId: 'ch-1',
    chapterTitle: 'Fractions',
    minutes: 10,
    progress: 0.41,
    countdown: null,
    controleId: null,
    isNew: false,
    ...over,
  }
}

function input(over: Partial<PointInput> = {}): PointInput {
  const plan: MissionPlan = { mission: mission(), ensuite: [] }
  return { plan, srsDue: 0, streak: 0, hasHistory: true, goalMinutes: 10, ...over }
}

describe('le ton', () => {
  it('se présente au lieu de diagnostiquer quand il n’y a pas d’historique', () => {
    // Le jour 1, l'élève n'a ni erreur ni maîtrise : inventer un constat serait
    // la première chose qui décrédibilise un prof.
    const point = pointDuJour(input({ hasHistory: false }))

    expect(point.ton).toBe('jour1')
    expect(point.titre).toContain('Faisons connaissance')
    expect(point.raisons).toEqual([])
    expect(point.consigne).toBeNull()
  })

  it('fait passer une échéance datée avant tout le reste', () => {
    const plan: MissionPlan = {
      mission: mission({ kind: 'controle', countdown: 'J-4', progress: null }),
      ensuite: [],
    }
    const point = pointDuJour(input({ plan, srsDue: 12 }))

    expect(point.ton).toBe('controle')
    expect(point.raisons[0]).toEqual({
      key: 'controle',
      label: 'J-4',
      urgent: true,
    })
  })

  it('distingue une découverte d’une reprise', () => {
    const decouverte: MissionPlan = {
      mission: mission({ kind: 'decouverte', isNew: true, progress: 0 }),
      ensuite: [],
    }
    expect(pointDuJour(input({ plan: decouverte })).ton).toBe('decouverte')
    expect(pointDuJour(input()).ton).toBe('reprise')
  })

  it('félicite au lieu d’inventer quand il n’y a plus rien à faire', () => {
    // Sans ce ton, Marcel n'aurait que des reproches et l'élève cesserait
    // d'ouvrir l'onglet.
    const point = pointDuJour(input({ plan: { mission: null, ensuite: [] } }))

    expect(point.ton).toBe('avance')
    expect(point.titre).toContain('Rien à rattraper')
    expect(point.href).toBeNull()
    expect(point.minutes).toBe(BONUS_MINUTES)
  })
})

describe('la méthode', () => {
  it('porte la consigne du régime de la matière', () => {
    expect(pointDuJour(input()).consigne).toBe(REGIMES.pratique.consigne)

    const francais: MissionPlan = {
      mission: mission({ subjectSlug: 'francais', subjectName: 'Français' }),
      ensuite: [],
    }
    expect(pointDuJour(input({ plan: francais })).consigne).toBe(
      REGIMES.expression.consigne,
    )
  })

  it('dit deux choses différentes pour deux matières de régimes différents', () => {
    // C'est tout le produit : on ne révise pas l'histoire comme les maths.
    const hg: MissionPlan = {
      mission: mission({ subjectSlug: 'histoire-geo', subjectName: 'Histoire-géo' }),
      ensuite: [],
    }
    const a = pointDuJour(input())
    const b = pointDuJour(input({ plan: hg }))

    expect(a.consigne).not.toBe(b.consigne)
    expect(a.seance.map((e) => e.key)).not.toEqual(b.seance.map((e) => e.key))
  })

  it('se tait sur une matière hors doctrine, sans casser l’écran', () => {
    const sport: MissionPlan = {
      mission: mission({ subjectSlug: 'sport', subjectName: 'EPS' }),
      ensuite: [],
    }
    const point = pointDuJour(input({ plan: sport }))

    expect(point.regime).toBeNull()
    expect(point.consigne).toBeNull()
    expect(point.seance).toEqual([])
    expect(point.href).not.toBeNull() // la session reste lançable
  })

  it('minute la séance sur la durée réellement annoncée', () => {
    const point = pointDuJour(input())
    const total = point.seance.reduce((s, e) => s + e.minutes, 0)

    expect(total).toBe(point.minutes)
    expect(point.cta).toContain(`${point.minutes} min`)
  })
})

describe('le renvoi vers Réviser', () => {
  it('envoie sur le chapitre, jamais sur une page de Marcel', () => {
    // Marcel oriente, Réviser exécute : une seule voix, deux endroits.
    expect(pointDuJour(input()).href).toBe('/reviser/maths/ch-1')
  })

  it('porte la matière DE LA MISSION, pour ne pas renvoyer vers la mauvaise méthode', () => {
    const hg: MissionPlan = {
      mission: mission({ subjectSlug: 'histoire-geo', subjectName: 'Histoire-géo' }),
      ensuite: [],
    }
    expect(pointDuJour(input({ plan: hg })).matiere).toEqual({
      slug: 'histoire-geo',
      name: 'Histoire-géo',
    })
  })

  it('n’a pas de matière quand il n’y a rien à faire', () => {
    const point = pointDuJour(input({ plan: { mission: null, ensuite: [] } }))
    expect(point.matiere).toBeNull()
  })
})

describe('les raisons', () => {
  it('accorde le pluriel des cartes à revoir', () => {
    const une = pointDuJour(input({ srsDue: 1 })).raisons
    const sept = pointDuJour(input({ srsDue: 7 })).raisons

    expect(une.find((r) => r.key === 'srs')?.label).toBe('1 carte à revoir')
    expect(sept.find((r) => r.key === 'srs')?.label).toBe('7 cartes à revoir')
  })

  it('ne parle de série qu’à partir de deux jours', () => {
    expect(
      pointDuJour(input({ streak: 1 })).raisons.some((r) => r.key === 'streak'),
    ).toBe(false)
    expect(
      pointDuJour(input({ streak: 2 })).raisons.some((r) => r.key === 'streak'),
    ).toBe(true)
  })

  it('n’affiche pas de progression sur un chapitre jamais ouvert', () => {
    const neuf: MissionPlan = {
      mission: mission({ kind: 'decouverte', isNew: true, progress: 0 }),
      ensuite: [],
    }
    expect(
      pointDuJour(input({ plan: neuf })).raisons.some((r) => r.key === 'progress'),
    ).toBe(false)
  })

  it('borne un pourcentage aberrant au lieu de l’afficher tel quel', () => {
    const cassé: MissionPlan = { mission: mission({ progress: 3.7 }), ensuite: [] }
    const label = pointDuJour(input({ plan: cassé })).raisons.find(
      (r) => r.key === 'progress',
    )?.label

    expect(label).toBe('Chapitre à 100 %')
  })
})
