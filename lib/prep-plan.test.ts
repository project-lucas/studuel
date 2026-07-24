import { describe, it, expect } from 'vitest'
import {
  daysBetween,
  addDays,
  planSessionCount,
  planDates,
  buildSessionDrafts,
  weekdayLabel,
  countdownTag,
  planSummary,
  effectiveStatus,
  derivePlanView,
  isCardVisible,
  isNoteDue,
  noteRecap,
  rowsToControles,
  DEFAULT_GOAL_MINUTES,
  type Controle,
  type PrepChapter,
  type PrepSession,
} from './prep-plan'

const CHAPS: PrepChapter[] = [
  { id: 'c1', title: 'Chapitre 1' },
  { id: 'c2', title: 'Chapitre 2' },
]

// Fabrique un contrôle minimal pour les tests de vue.
function makeControle(over: Partial<Controle> = {}): Controle {
  return {
    id: 'ctl',
    subject: 'maths',
    chapters: CHAPS,
    date: '2026-07-31',
    grade: '3e',
    note: null,
    notePrompted: false,
    snoozeDate: null,
    sessions: [],
    ...over,
  }
}

function makeSession(over: Partial<PrepSession> = {}): PrepSession {
  return {
    id: 's',
    controleId: 'ctl',
    plannedDate: '2026-07-30',
    durationMin: 10,
    chapterId: 'c1',
    status: 'a_faire',
    position: 0,
    ...over,
  }
}

describe('daysBetween / addDays', () => {
  it('compte les jours entre deux clés UTC', () => {
    expect(daysBetween('2026-07-25', '2026-07-31')).toBe(6)
    expect(daysBetween('2026-07-31', '2026-07-25')).toBe(-6)
    expect(daysBetween('2026-07-25', '2026-07-25')).toBe(0)
  })

  it('ajoute et retire des jours', () => {
    expect(addDays('2026-07-31', -4)).toBe('2026-07-27')
    expect(addDays('2026-07-31', 1)).toBe('2026-08-01')
  })
})

describe('planSessionCount', () => {
  it('3 sessions à J-5 ou plus', () => {
    expect(planSessionCount('2026-07-31', '2026-07-25')).toBe(3) // J-6
    expect(planSessionCount('2026-07-30', '2026-07-25')).toBe(3) // J-5
  })

  it('2 sessions à J-2 à J-4', () => {
    expect(planSessionCount('2026-07-29', '2026-07-25')).toBe(2) // J-4
    expect(planSessionCount('2026-07-27', '2026-07-25')).toBe(2) // J-2
  })

  it('1 session à J-1 ou jour J', () => {
    expect(planSessionCount('2026-07-26', '2026-07-25')).toBe(1) // J-1
    expect(planSessionCount('2026-07-25', '2026-07-25')).toBe(1) // J-0
  })

  it('1 session sans date', () => {
    expect(planSessionCount(null, '2026-07-25')).toBe(1)
  })
})

describe('planDates', () => {
  it('crée 3 jours J-4, J-2, J-1 à J-6 (exemple du brief)', () => {
    // Contrôle vendredi 31, aujourd'hui samedi 25 (J-6).
    expect(planDates('2026-07-31', '2026-07-25')).toEqual([
      '2026-07-27', // J-4 (mardi)
      '2026-07-29', // J-2 (jeudi)
      '2026-07-30', // J-1 (vendredi… veille)
    ])
  })

  it('borne les jours passés à aujourd’hui et dédoublonne', () => {
    // J-5 pile : J-4 et J-2 et J-1 tous >= aujourd'hui, aucun clamp.
    const d = planDates('2026-07-30', '2026-07-25')
    expect(d).toHaveLength(3)
    expect(d.every((x) => x >= '2026-07-25')).toBe(true)
    expect(new Set(d).size).toBe(d.length)
  })

  it('2 jours à J-3', () => {
    expect(planDates('2026-07-28', '2026-07-25')).toEqual([
      '2026-07-26',
      '2026-07-27',
    ])
  })

  it('1 seul jour (aujourd’hui) à J-1, jour J et sans date', () => {
    expect(planDates('2026-07-26', '2026-07-25')).toEqual(['2026-07-25'])
    expect(planDates('2026-07-25', '2026-07-25')).toEqual(['2026-07-25'])
    expect(planDates(null, '2026-07-25')).toEqual(['2026-07-25'])
  })
})

describe('buildSessionDrafts', () => {
  it('fait tourner les chapitres et applique la durée = objectif', () => {
    const drafts = buildSessionDrafts(CHAPS, '2026-07-31', '2026-07-25', 15)
    expect(drafts).toHaveLength(3)
    expect(drafts.map((d) => d.chapterId)).toEqual(['c1', 'c2', 'c1'])
    expect(drafts.map((d) => d.position)).toEqual([0, 1, 2])
    expect(drafts.every((d) => d.durationMin === 15)).toBe(true)
  })

  it('retombe sur la durée par défaut si objectif invalide', () => {
    const drafts = buildSessionDrafts(CHAPS, null, '2026-07-25', 0)
    expect(drafts[0].durationMin).toBe(DEFAULT_GOAL_MINUTES)
  })
})

describe('weekdayLabel / countdownTag / planSummary', () => {
  it('nomme le jour de la semaine en français', () => {
    expect(weekdayLabel('2026-07-31')).toBe('vendredi')
    expect(weekdayLabel('2026-07-27')).toBe('lundi')
  })

  it('formate le compte à rebours', () => {
    expect(countdownTag('2026-07-31', '2026-07-28')).toBe('J-3')
    expect(countdownTag('2026-07-28', '2026-07-28')).toBe('J-0')
    expect(countdownTag(null, '2026-07-28')).toBeNull()
    expect(countdownTag('2026-07-27', '2026-07-28')).toBe('passé')
  })

  it('résume le plan pour la confirmation', () => {
    const drafts = buildSessionDrafts(CHAPS, '2026-07-31', '2026-07-25', 10)
    expect(planSummary('2026-07-31', drafts)).toBe(
      'Contrôle vendredi → 3 sessions de 10 min : lundi, mercredi, jeudi',
    )
  })
})

describe('effectiveStatus', () => {
  it('marque « à faire » en retard comme manquée', () => {
    expect(
      effectiveStatus({ status: 'a_faire', plannedDate: '2026-07-24' }, '2026-07-25'),
    ).toBe('manquee')
  })

  it('laisse « à faire » du jour intacte', () => {
    expect(
      effectiveStatus({ status: 'a_faire', plannedDate: '2026-07-25' }, '2026-07-25'),
    ).toBe('a_faire')
  })

  it('respecte un statut faite/manquée stocké', () => {
    expect(
      effectiveStatus({ status: 'faite', plannedDate: '2026-07-24' }, '2026-07-25'),
    ).toBe('faite')
  })
})

describe('derivePlanView', () => {
  const today = '2026-07-28'

  it('compte la progression et pointe la session du jour', () => {
    const ctl = makeControle({
      date: '2026-07-31',
      sessions: [
        makeSession({ id: 'a', plannedDate: '2026-07-27', status: 'faite', position: 0 }),
        makeSession({ id: 'b', plannedDate: '2026-07-28', status: 'a_faire', position: 1 }),
        makeSession({ id: 'c', plannedDate: '2026-07-30', status: 'a_faire', position: 2 }),
      ],
    })
    const v = derivePlanView(ctl, today)
    expect(v.total).toBe(3)
    expect(v.done).toBe(1)
    expect(v.progressLabel).toBe('1/3')
    expect(v.todaySession?.id).toBe('b')
    expect(v.nextDate).toBe('2026-07-28')
    expect(v.isComplete).toBe(false)
  })

  it('replanifie une session en retard sur aujourd’hui', () => {
    const ctl = makeControle({
      date: '2026-07-31',
      sessions: [
        makeSession({ id: 'a', plannedDate: '2026-07-26', status: 'a_faire', position: 0 }),
        makeSession({ id: 'b', plannedDate: '2026-07-30', status: 'a_faire', position: 1 }),
      ],
    })
    const v = derivePlanView(ctl, today)
    expect(v.missed).toBe(1)
    expect(v.todaySession?.id).toBe('a') // la retardée est surfacée…
    expect(v.nextDate).toBe(today) // …sur aujourd'hui
  })

  it('est terminé quand tout est fait', () => {
    const ctl = makeControle({
      date: '2026-07-31',
      sessions: [makeSession({ status: 'faite' })],
    })
    const v = derivePlanView(ctl, today)
    expect(v.isComplete).toBe(true)
    expect(v.todaySession).toBeNull()
  })

  it('est terminé quand le contrôle est passé', () => {
    const ctl = makeControle({
      date: '2026-07-27',
      sessions: [makeSession({ plannedDate: '2026-07-26', status: 'a_faire' })],
    })
    expect(derivePlanView(ctl, today).isComplete).toBe(true)
  })
})

describe('isCardVisible', () => {
  const today = '2026-07-28'

  it('cache la carte quand le plan est terminé', () => {
    const ctl = makeControle({ sessions: [makeSession({ status: 'faite' })] })
    const v = derivePlanView(ctl, today)
    expect(isCardVisible(ctl, v, today)).toBe(false)
  })

  it('cache la carte repliée aujourd’hui, la remontre le lendemain', () => {
    const ctl = makeControle({
      date: '2026-07-31',
      snoozeDate: today,
      sessions: [makeSession({ plannedDate: today, status: 'a_faire' })],
    })
    const v = derivePlanView(ctl, today)
    expect(isCardVisible(ctl, v, today)).toBe(false)
    expect(isCardVisible(ctl, v, '2026-07-29')).toBe(true)
  })
})

describe('isNoteDue / noteRecap', () => {
  it('demande la note le lendemain du contrôle, une seule fois', () => {
    const ctl = makeControle({ date: '2026-07-27' })
    expect(isNoteDue(ctl, '2026-07-28')).toBe(true) // lendemain
    expect(isNoteDue(ctl, '2026-07-27')).toBe(false) // le jour même
    expect(isNoteDue({ ...ctl, notePrompted: true }, '2026-07-28')).toBe(false)
    expect(isNoteDue({ ...ctl, note: 14 }, '2026-07-28')).toBe(false)
    expect(isNoteDue({ ...ctl, date: null }, '2026-07-28')).toBe(false)
  })

  it('formate le récap une fois la note saisie', () => {
    const ctl = makeControle({
      note: 14,
      sessions: [
        makeSession({ id: 'a', status: 'faite' }),
        makeSession({ id: 'b', status: 'faite' }),
        makeSession({ id: 'c', status: 'a_faire' }),
      ],
    })
    expect(noteRecap(ctl)).toBe('2 sessions de préparation → note 14/20')
    expect(noteRecap(makeControle())).toBeNull()
  })
})

describe('rowsToControles', () => {
  it('assemble contrôles + sessions et ignore une donnée invalide', () => {
    const controles = rowsToControles(
      [
        {
          id: 'ctl',
          subject_slug: 'maths',
          chapters: [{ id: 'c1', title: 'Chapitre 1' }],
          exam_date: '2026-07-31',
          grade: '3e',
          note: null,
          note_prompted: false,
          snooze_date: null,
        },
        // Contrôle sans chapitre valide : écarté.
        {
          id: 'bad',
          subject_slug: 'x',
          chapters: 'nope',
          exam_date: null,
          grade: null,
          note: null,
          note_prompted: null,
          snooze_date: null,
        },
      ],
      [
        {
          id: 's1',
          controle_id: 'ctl',
          planned_date: '2026-07-30',
          duration_min: 10,
          chapter_id: 'c1',
          status: 'faite',
          position: 0,
        },
        {
          id: 's2',
          controle_id: 'ctl',
          planned_date: '2026-07-29',
          duration_min: null,
          chapter_id: null,
          status: 'zzz', // statut inconnu → a_faire
          position: null,
        },
      ],
    )
    expect(controles).toHaveLength(1)
    const c = controles[0]
    expect(c.id).toBe('ctl')
    expect(c.sessions).toHaveLength(2)
    expect(c.sessions[1].status).toBe('a_faire')
    expect(c.sessions[1].durationMin).toBe(DEFAULT_GOAL_MINUTES)
  })
})
