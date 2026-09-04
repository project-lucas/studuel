import { describe, it, expect } from 'vitest'
import {
  cleDeRegroupement,
  formatDuree,
  hauteursBarres,
  JOURS_HISTORIQUE,
  libelleCetteSemaine,
  lundiDe,
  phraseRythme,
  rythmeHebdo,
  semainesTenues,
  serieTravail,
  totalSerie,
  type SemaineTravail,
} from './temps'

// 2026-08-06 est un JEUDI ; son lundi est le 2026-08-03.
const AUJOURDHUI = '2026-08-06'

const semaine = (lundi: string, secondes: number): SemaineTravail => ({
  lundi,
  secondes,
})

describe('lundiDe', () => {
  it('ramène un jeudi à son lundi', () => {
    expect(lundiDe('2026-08-06')).toBe('2026-08-03')
  })

  it('laisse un lundi sur place', () => {
    expect(lundiDe('2026-08-03')).toBe('2026-08-03')
  })

  it('rattache le dimanche à la semaine qui vient de finir', () => {
    expect(lundiDe('2026-08-09')).toBe('2026-08-03')
  })

  it('rend la valeur telle quelle si ce n’est pas une date', () => {
    expect(lundiDe('bientôt')).toBe('bientôt')
  })
})

describe('rythmeHebdo', () => {
  it('produit 8 semaines, la dernière étant celle d’aujourd’hui', () => {
    const semaines = rythmeHebdo([], AUJOURDHUI)
    expect(semaines).toHaveLength(8)
    expect(semaines[7].lundi).toBe('2026-08-03')
    expect(semaines[0].lundi).toBe('2026-06-15')
  })

  it('additionne les jours d’une même semaine', () => {
    const semaines = rythmeHebdo(
      [
        { day: '2026-08-03', seconds: 600 },
        { day: '2026-08-05', seconds: 900 },
      ],
      AUJOURDHUI,
    )
    expect(semaines[7].secondes).toBe(1500)
  })

  it('garde les semaines vides à zéro plutôt que de les omettre', () => {
    // 2026-07-20 est le lundi de l'avant-avant-dernière semaine (index 5).
    const semaines = rythmeHebdo(
      [{ day: '2026-07-20', seconds: 1200 }],
      AUJOURDHUI,
    )
    expect(semaines.map((s) => s.secondes)).toEqual([0, 0, 0, 0, 0, 1200, 0, 0])
    expect(semaines[5].lundi).toBe('2026-07-20')
  })

  it('ignore les jours hors fenêtre et les valeurs aberrantes', () => {
    const semaines = rythmeHebdo(
      [
        { day: '2025-01-01', seconds: 9999 },
        { day: '2026-08-04', seconds: Number.NaN },
        { day: '2026-08-04', seconds: -50 },
        { day: '2026-08-04', seconds: 300 },
      ],
      AUJOURDHUI,
    )
    expect(semaines.reduce((s, w) => s + w.secondes, 0)).toBe(300)
  })

  it('renvoie une liste vide si la date du jour est illisible', () => {
    expect(rythmeHebdo([], 'pas-une-date')).toEqual([])
  })
})

describe('formatDuree', () => {
  it('affiche les minutes sous l’heure', () => {
    expect(formatDuree(45 * 60)).toBe('45 min')
  })

  it('arrondit les miettes à 0 min', () => {
    expect(formatDuree(30)).toBe('0 min')
  })

  it('affiche heures et minutes en dessous de 10 h', () => {
    expect(formatDuree(3 * 3600 + 20 * 60)).toBe('3 h 20')
  })

  it('laisse tomber les minutes au-delà de 10 h', () => {
    expect(formatDuree(27 * 3600 + 4 * 60)).toBe('27 h')
  })

  it('ne rend jamais de durée négative', () => {
    expect(formatDuree(-500)).toBe('0 min')
  })
})

describe('semainesTenues', () => {
  it('compte les semaines actives consécutives', () => {
    const semaines = [
      semaine('a', 0),
      semaine('b', 100),
      semaine('c', 100),
      semaine('d', 100),
    ]
    expect(semainesTenues(semaines)).toBe(3)
  })

  it('reste clément quand la semaine en cours vient de commencer', () => {
    const semaines = [semaine('a', 100), semaine('b', 100), semaine('c', 0)]
    expect(semainesTenues(semaines)).toBe(2)
  })

  it('tombe à zéro après deux semaines vides', () => {
    const semaines = [semaine('a', 100), semaine('b', 0), semaine('c', 0)]
    expect(semainesTenues(semaines)).toBe(0)
  })
})

describe('phraseRythme', () => {
  it('invite quand rien n’a jamais été mesuré', () => {
    expect(phraseRythme(rythmeHebdo([], AUJOURDHUI))).toBe(
      'Dès que tu travailles, ton rythme se dessine ici.',
    )
  })

  it('annonce la première semaine', () => {
    const semaines = [semaine('a', 0), semaine('b', 3600)]
    expect(phraseRythme(semaines)).toBe('Ta première semaine de travail est lancée.')
  })

  it('annonce un record quand la semaine en cours dépasse toutes les autres', () => {
    const semaines = [semaine('a', 3600), semaine('b', 7200)]
    expect(phraseRythme(semaines)).toBe('Ta meilleure semaine depuis 2 semaines.')
  })

  it('nomme la constance quand il n’y a pas de record', () => {
    const semaines = [semaine('a', 7200), semaine('b', 3600)]
    expect(phraseRythme(semaines)).toBe('Tu tiens depuis 2 semaines d’affilée.')
  })

  it('ne reproche rien à une semaine qui commence', () => {
    const semaines = [semaine('a', 0), semaine('b', 7200), semaine('c', 0)]
    expect(phraseRythme(semaines)).toBe('Ta semaine démarre. La précédente : 2 h.')
  })
})

describe('libelleCetteSemaine', () => {
  it('rend la micro-tendance du cumul', () => {
    expect(libelleCetteSemaine([semaine('a', 3 * 3600)])).toBe('+3 h cette semaine')
  })

  it('se tait plutôt que d’afficher « +0 min »', () => {
    expect(libelleCetteSemaine([semaine('a', 0)])).toBeNull()
  })
})

describe('cleDeRegroupement', () => {
  it('garde le jour pour la semaine et le mois', () => {
    expect(cleDeRegroupement('2026-08-06', 'semaine')).toBe('2026-08-06')
    expect(cleDeRegroupement('2026-08-06', 'mois')).toBe('2026-08-06')
  })

  it('regroupe par lundi sur le trimestre', () => {
    expect(cleDeRegroupement('2026-08-06', 'trimestre')).toBe('2026-08-03')
  })

  it('regroupe par mois sur l’année', () => {
    expect(cleDeRegroupement('2026-08-06', 'annee')).toBe('2026-08')
  })
})

describe('serieTravail', () => {
  it('rend 7 jours sur la semaine, aujourd’hui en dernier', () => {
    const points = serieTravail([], AUJOURDHUI, 'semaine')
    expect(points).toHaveLength(7)
    expect(points[6].cle).toBe('2026-08-06')
    expect(points[0].cle).toBe('2026-07-31')
  })

  it('étiquette la semaine par les initiales des jours', () => {
    const points = serieTravail([], AUJOURDHUI, 'semaine')
    // 2026-08-06 est un jeudi : la série finit donc par un J.
    expect(points.map((p) => p.label)).toEqual(['V', 'S', 'D', 'L', 'M', 'M', 'J'])
  })

  it('rend 30 jours sur le mois', () => {
    expect(serieTravail([], AUJOURDHUI, 'mois')).toHaveLength(30)
  })

  it('rend 13 semaines sur le trimestre et additionne dans le bon seau', () => {
    const points = serieTravail(
      [
        { day: '2026-08-03', seconds: 600 },
        { day: '2026-08-06', seconds: 900 },
      ],
      AUJOURDHUI,
      'trimestre',
    )
    expect(points).toHaveLength(13)
    expect(points[12].cle).toBe('2026-08-03')
    expect(points[12].secondes).toBe(1500)
  })

  it('rend 12 mois sur l’année, le mois courant en dernier', () => {
    const points = serieTravail(
      [{ day: '2026-08-01', seconds: 300 }],
      AUJOURDHUI,
      'annee',
    )
    expect(points).toHaveLength(12)
    expect(points[11].cle).toBe('2026-08')
    expect(points[11].label).toBe('août')
    expect(points[11].secondes).toBe(300)
    expect(points[0].cle).toBe('2025-09')
  })

  it('laisse les périodes vides à zéro plutôt que de les omettre', () => {
    const points = serieTravail([], AUJOURDHUI, 'semaine')
    expect(points.every((p) => p.secondes === 0)).toBe(true)
  })

  it('ignore les jours hors portée et les valeurs aberrantes', () => {
    const points = serieTravail(
      [
        { day: '2020-01-01', seconds: 999 },
        { day: '2026-08-06', seconds: Number.NaN },
        { day: '2026-08-06', seconds: -10 },
        { day: '2026-08-06', seconds: 120 },
      ],
      AUJOURDHUI,
      'semaine',
    )
    expect(totalSerie(points)).toBe(120)
  })
})

describe('JOURS_HISTORIQUE', () => {
  it('couvre la plus large des portées', () => {
    expect(JOURS_HISTORIQUE).toBe(365)
  })
})

describe('hauteursBarres', () => {
  const sem = (secondes: number, i: number): SemaineTravail => ({
    lundi: `2026-08-${String(3 + i * 7).padStart(2, '0')}`,
    secondes,
  })

  it('met les barres et l’objectif sur la même échelle, sans toucher le plafond', () => {
    const { hauteurs, objectifPct } = hauteursBarres([sem(0, 0), sem(1800, 1), sem(3600, 2)], 3600)
    // Plafond = objectif × 1,25 = 4 500 s : l'objectif est à 80 %, l'heure pleine aussi.
    expect(objectifPct).toBe(80)
    expect(hauteurs).toEqual([0, 40, 80])
  })

  it('laisse une grosse semaine dépasser l’objectif sans sortir du cadre', () => {
    const { hauteurs, objectifPct } = hauteursBarres([sem(9000, 0)], 3600)
    expect(hauteurs).toEqual([100])
    expect(objectifPct).toBe(40)
  })

  it('tient sans aucune semaine', () => {
    expect(hauteursBarres([], 3600)).toEqual({ hauteurs: [], objectifPct: 80 })
  })
})
