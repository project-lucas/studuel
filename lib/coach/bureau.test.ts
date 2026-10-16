import { describe, expect, it } from 'vitest'
import type { Mission, MissionPlan } from '../mission'
import {
  bulleDuJour,
  decorDuMoment,
  poseDuMoment,
  nomDuJour,
  parseOnglet,
  planDuControle,
  preparation,
  quandEnMots,
  rythmeDeLHeure,
  seanceDuJour,
  tonPreparation,
} from './bureau'

const mission = (chapterId: string, extra: Partial<Mission> = {}): Mission => ({
  kind: 'reprise',
  subjectSlug: 'maths',
  subjectName: 'Mathématiques',
  chapterId,
  chapterTitle: `Chapitre ${chapterId}`,
  minutes: 5,
  progress: 0.4,
  countdown: null,
  controleId: null,
  isNew: false,
  ...extra,
})

const plan = (missions: Mission[]): MissionPlan => ({
  mission: missions[0] ?? null,
  ensuite: missions.slice(1),
  autresControles: [],
})

// 16/10/2026 est un vendredi.
const VENDREDI = '2026-10-16'

describe('parseOnglet', () => {
  it('reconnaît les quatre onglets et retombe sur Aujourd’hui', () => {
    expect(parseOnglet('radar')).toBe('radar')
    expect(parseOnglet('outils')).toBe('outils')
    expect(parseOnglet('nimporte')).toBe('aujourdhui')
    expect(parseOnglet(undefined)).toBe('aujourdhui')
  })
})

describe('rythmeDeLHeure — la fatigue suit la journée', () => {
  it('15 min avant 17 h, 10 min jusqu’à 20 h, 5 min après', () => {
    expect(rythmeDeLHeure(9).minutes).toBe(15)
    expect(rythmeDeLHeure(16).minutes).toBe(15)
    expect(rythmeDeLHeure(17).minutes).toBe(10)
    expect(rythmeDeLHeure(19).minutes).toBe(10)
    expect(rythmeDeLHeure(20).minutes).toBe(5)
    expect(rythmeDeLHeure(23).minutes).toBe(5)
  })

  it('trois gestes, puis deux, puis un', () => {
    expect([16, 18, 21].map((h) => rythmeDeLHeure(h).nbGestes)).toEqual([3, 2, 1])
  })
})

describe('seanceDuJour', () => {
  const quatre = plan([mission('a'), mission('b'), mission('c'), mission('d')])

  it('garde autant de gestes que l’heure le permet et reporte le reste', () => {
    const tot = seanceDuJour(quatre, 16)
    expect(tot.gestes.map((g) => g.cle)).toEqual(['reprise:a', 'reprise:b', 'reprise:c'])
    expect(tot.reportes).toHaveLength(1)

    const tard = seanceDuJour(quatre, 21)
    expect(tard.gestes).toHaveLength(1)
    expect(tard.reportes).toHaveLength(3)
  })

  it('ne propose jamais deux fois le même chapitre', () => {
    const doublon = plan([mission('a', { kind: 'controle', countdown: 'J-3' }), mission('a'), mission('b')])
    expect(seanceDuJour(doublon, 10).gestes.map((g) => g.cle)).toEqual(['controle:a', 'reprise:b'])
  })

  it('dit pourquoi : le contrôle, la maîtrise ou la découverte', () => {
    const s = seanceDuJour(
      plan([
        mission('a', { kind: 'controle', countdown: 'J-3', progress: null }),
        mission('b', { progress: 0.42 }),
        mission('c', { kind: 'decouverte', isNew: true, progress: 0 }),
      ]),
      10,
    )
    expect(s.gestes[0].titre).toBe('Préparer « Chapitre a »')
    expect(s.gestes[0].detail).toContain('contrôle J-3')
    expect(s.gestes[1].detail).toContain('à 42 %')
    expect(s.gestes[2].titre).toBe('Découvrir « Chapitre c »')
    expect(s.gestes[0].href).toBe('/reviser/maths/a')
  })

  it('sans mission, une séance vide plutôt qu’inventée', () => {
    expect(seanceDuJour(plan([]), 10).gestes).toEqual([])
  })
})

describe('les jours en mots', () => {
  it('nomme le jour de la semaine depuis la clé du jour', () => {
    expect(nomDuJour(VENDREDI, 0)).toBe('Vendredi')
    expect(nomDuJour(VENDREDI, 3)).toBe('Lundi')
  })

  it('aujourd’hui, demain, un jour de la semaine, puis « dans N jours »', () => {
    expect(quandEnMots(VENDREDI, 0)).toBe('aujourd’hui')
    expect(quandEnMots(VENDREDI, 1)).toBe('demain')
    expect(quandEnMots(VENDREDI, 3)).toBe('lundi')
    expect(quandEnMots(VENDREDI, 9)).toBe('dans 9 jours')
  })
})

describe('planDuControle', () => {
  it('trois temps quand il reste au moins deux jours', () => {
    const p = planDuControle({ dans: 3, chapitres: ['Fractions', 'Puissances'] }, VENDREDI)
    expect(p.map((e) => e.quand)).toEqual(['Ce soir', 'Dimanche', 'Lundi matin'])
    expect(p.map((e) => e.quoi)).toEqual(['Fractions', 'Puissances', '5 questions éclair'])
    expect(p[0].maintenant).toBe(true)
  })

  it('deux temps la veille, un seul le jour J', () => {
    expect(planDuControle({ dans: 1, chapitres: ['A', 'B'] }, VENDREDI)).toHaveLength(2)
    expect(planDuControle({ dans: 0, chapitres: ['A'] }, VENDREDI)).toEqual([
      { quand: 'Aujourd’hui', quoi: '5 questions éclair', maintenant: true },
    ])
  })

  it('un seul chapitre : la veille, on revoit tout', () => {
    expect(planDuControle({ dans: 4, chapitres: ['A'] }, VENDREDI)[1].quoi).toBe('Tout revoir')
  })
})

describe('preparation', () => {
  it('moyenne les maîtrises, bornées, en pourcent', () => {
    expect(preparation([0.5, 0.74])).toBe(62)
    expect(preparation([1.4, -1])).toBe(50)
    expect(preparation([])).toBe(0)
  })

  it('feu tricolore : moins de 40, de 40 à 69, 70 et plus', () => {
    expect([31, 62, 84].map(tonPreparation)).toEqual(['destructive', 'warning', 'success'])
  })
})

describe('bulleDuJour', () => {
  const ctrl = { matiere: 'maths', slug: 'maths', chapitreId: null, dans: 3, chapitres: [], pret: 62 }

  it('le soir, Marcel raccourcit et le dit', () => {
    expect(bulleDuJour(21, null, VENDREDI)).toContain('5 minutes')
    expect(bulleDuJour(18, null, VENDREDI)).toContain('10 minutes')
    expect(bulleDuJour(15, null, VENDREDI)).toContain('séance complète')
  })

  it('nomme le contrôle qui vient', () => {
    expect(bulleDuJour(15, ctrl, VENDREDI)).toContain('Ton contrôle de maths, c’est lundi.')
  })
})

describe('le décor et la pose suivent l’heure', () => {
  it('le bureau est au jour de 7 h à 18 h, à la lampe sinon', () => {
    expect([6, 7, 12, 17, 18, 23].map(decorDuMoment)).toEqual(['soir', 'jour', 'jour', 'jour', 'soir', 'soir'])
  })

  it('Marcel bâille quand la séance passe en express', () => {
    expect(poseDuMoment(16)).toBe('salut')
    expect(poseDuMoment(19)).toBe('salut')
    expect(poseDuMoment(21)).toBe('soir')
  })
})
