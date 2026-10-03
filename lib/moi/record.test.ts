import { describe, expect, it } from 'vitest'
import {
  anneauRecord,
  libellesRecord,
  meilleureSerie,
  recordSemaine,
} from '@/lib/moi/record'
import type { JourTravail } from '@/lib/moi/temps'

const MIN = 60
const H = 3600

// Jeudi 1er octobre 2026 : la semaine en cours part du lundi 28 septembre.
const JEUDI = '2026-10-01'

const jour = (day: string, minutes: number): JourTravail => ({ day, seconds: minutes * MIN })

// Une semaine record de 3 h 05 (du 14 au 20 septembre), une semaine dernière
// de 1 h 50, et 2 h 40 depuis lundi.
const HISTOIRE: JourTravail[] = [
  jour('2026-09-14', 60),
  jour('2026-09-16', 65),
  jour('2026-09-19', 60),
  jour('2026-09-22', 50),
  jour('2026-09-25', 60),
  jour('2026-09-28', 35),
  jour('2026-09-29', 50),
  jour('2026-09-30', 20),
  jour('2026-10-01', 55),
]

describe('recordSemaine — la semaine en cours face à la meilleure d’avant', () => {
  it('additionne la semaine en cours et retient la meilleure semaine passée', () => {
    const r = recordSemaine(HISTOIRE, JEUDI)
    expect(r.secondes).toBe(2 * H + 40 * MIN)
    expect(r.record).toBe(3 * H + 5 * MIN)
    expect(r.etat).toBe('en_course')
    expect(r.manque).toBe(25 * MIN)
    expect(r.depassement).toBe(0)
  })

  it('range les sept jours du lundi au dimanche, aujourd’hui repéré', () => {
    const r = recordSemaine(HISTOIRE, JEUDI)
    expect(r.jours.map((j) => j.secondes / MIN)).toEqual([35, 50, 20, 55, 0, 0, 0])
    expect(r.jours.map((j) => j.aujourdhui)).toEqual([false, false, false, true, false, false, false])
    expect(r.jours.map((j) => j.aVenir)).toEqual([false, false, false, false, true, true, true])
  })

  it('le record tombe dès que la semaine dépasse la meilleure d’avant', () => {
    const r = recordSemaine([...HISTOIRE, jour('2026-10-01', 40)], JEUDI)
    expect(r.secondes).toBe(3 * H + 20 * MIN)
    expect(r.etat).toBe('battu')
    expect(r.depassement).toBe(15 * MIN)
    expect(r.manque).toBe(0)
  })

  it('un record égalé n’est pas un record battu', () => {
    const r = recordSemaine([...HISTOIRE, jour('2026-10-01', 25)], JEUDI)
    expect(r.etat).toBe('en_course')
    expect(r.manque).toBe(0)
  })

  it('compare à la minute, comme l’écran l’écrit', () => {
    // 2 h 40 min 59 s s'écrit « 2 h 40 » : il manque 25 min, pas 24.
    const r = recordSemaine([...HISTOIRE, { day: '2026-10-01', seconds: 59 }], JEUDI)
    expect(r.manque).toBe(25 * MIN)
    // … et 30 secondes au-delà du record ne le battent pas « de 0 min ».
    const egal = recordSemaine([...HISTOIRE, { day: '2026-10-01', seconds: 25 * MIN + 30 }], JEUDI)
    expect(egal.etat).toBe('en_course')
  })

  it('sans semaine passée, la semaine en cours pose le premier record', () => {
    const r = recordSemaine([jour('2026-09-29', 20)], JEUDI)
    expect(r.etat).toBe('premier')
    expect(r.record).toBe(0)
    expect(r.manque).toBe(0)
  })

  it('rien du tout : ni semaine, ni record', () => {
    expect(recordSemaine([], JEUDI).etat).toBe('vide')
  })

  it('une semaine pas encore commencée garde son record à battre', () => {
    const r = recordSemaine(HISTOIRE.filter((j) => j.day < '2026-09-28'), JEUDI)
    expect(r.etat).toBe('en_course')
    expect(r.secondes).toBe(0)
    expect(r.manque).toBe(3 * H + 5 * MIN)
  })

  it('ignore les lignes illisibles et les jours à venir', () => {
    const r = recordSemaine(
      [
        ...HISTOIRE,
        { day: 'pas une date', seconds: 9999 },
        { day: '2026-10-03', seconds: 5 * H },
        { day: '2026-09-15', seconds: Number.NaN },
        { day: '2026-09-15', seconds: -40 },
      ],
      JEUDI,
    )
    expect(r.secondes).toBe(2 * H + 40 * MIN)
    expect(r.record).toBe(3 * H + 5 * MIN)
  })

  it('une date du jour illisible ne fabrique rien', () => {
    const r = recordSemaine(HISTOIRE, 'hier')
    expect(r.etat).toBe('vide')
    expect(r.jours).toHaveLength(7)
  })
})

describe('anneauRecord — ce que l’anneau dessine', () => {
  it('se remplit à proportion du record', () => {
    const a = anneauRecord(recordSemaine(HISTOIRE, JEUDI))
    expect(a.fait).toBeCloseTo(160 / 185, 5)
    expect(a.surplus).toBe(0)
  })

  it('battu : l’anneau est plein, le dépassement s’écrit en plus', () => {
    const a = anneauRecord(recordSemaine([...HISTOIRE, jour('2026-10-01', 40)], JEUDI))
    expect(a.fait).toBe(1)
    expect(a.surplus).toBeCloseTo(15 / 185, 5)
  })

  it('le surplus ne fait jamais plus d’un tour', () => {
    const a = anneauRecord(recordSemaine([...HISTOIRE, jour('2026-10-01', 600)], JEUDI))
    expect(a.surplus).toBe(1)
  })

  it('premier record : plein ; rien : vide', () => {
    expect(anneauRecord(recordSemaine([jour('2026-09-29', 20)], JEUDI))).toEqual({ fait: 1, surplus: 0 })
    expect(anneauRecord(recordSemaine([], JEUDI))).toEqual({ fait: 0, surplus: 0 })
  })
})

describe('libellesRecord — ce que la tuile écrit', () => {
  it('en course : le record à battre et ce qui manque', () => {
    expect(libellesRecord(recordSemaine(HISTOIRE, JEUDI))).toEqual({
      valeur: '2 h 40',
      sourcil: 'Record à battre',
      cible: '3 h 05',
      pastille: 'Encore 25 min',
      ton: 'vue',
    })
  })

  it('battu : l’ancien record et l’avance', () => {
    const l = libellesRecord(recordSemaine([...HISTOIRE, jour('2026-10-01', 40)], JEUDI))
    expect(l.sourcil).toBe('Ancien record')
    expect(l.cible).toBe('3 h 05')
    expect(l.pastille).toBe('Battu de 15 min')
    expect(l.ton).toBe('battu')
  })

  it('égalé : la minute suivante le bat', () => {
    const l = libellesRecord(recordSemaine([...HISTOIRE, jour('2026-10-01', 25)], JEUDI))
    expect(l.pastille).toBe('Record égalé')
  })

  it('premier record : la semaine le pose', () => {
    const l = libellesRecord(recordSemaine([jour('2026-09-29', 20)], JEUDI))
    expect(l.sourcil).toBe('Ton premier record')
    expect(l.cible).toBe('20 min')
    expect(l.ton).toBe('vue')
  })

  it('rien : une invitation, pas un zéro', () => {
    const l = libellesRecord(recordSemaine([], JEUDI))
    expect(l.valeur).toBe('0 min')
    expect(l.cible).toBe('—')
    expect(l.ton).toBe('neutre')
  })
})

describe('meilleureSerie — la plus longue suite de jours', () => {
  it('compte la plus longue suite de jours consécutifs', () => {
    const jours = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-10', '2026-09-11']
    expect(meilleureSerie(jours, 0)).toBe(3)
  })

  it('passe les changements de mois', () => {
    expect(meilleureSerie(['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02'], 0)).toBe(4)
  })

  it('ne descend jamais sous la série en cours (les gels y comptent)', () => {
    expect(meilleureSerie(['2026-09-01', '2026-09-02'], 12)).toBe(12)
  })

  it('doublons et dates illisibles ne comptent pas', () => {
    expect(meilleureSerie(['2026-09-01', '2026-09-01', 'x', '2026-09-02'], 0)).toBe(2)
    expect(meilleureSerie([], 0)).toBe(0)
  })
})
