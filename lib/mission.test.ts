import { describe, it, expect } from 'vitest'
import {
  pickMission,
  sessionMinutes,
  missionHref,
  ENSUITE_MAX,
  type ChapterCandidate,
  type MissionInput,
} from './mission'
import type { Controle, PrepSession } from './prep-plan'

const TODAY = '2026-07-28'

function chapter(over: Partial<ChapterCandidate> = {}): ChapterCandidate {
  return {
    subjectSlug: 'svt',
    subjectName: 'SVT',
    chapterId: 'ch-1',
    chapterTitle: 'Le programme génétique',
    state: 'en_cours',
    value: 0.4,
    ...over,
  }
}

function session(over: Partial<PrepSession> = {}): PrepSession {
  return {
    id: 's-1',
    controleId: 'c-1',
    plannedDate: TODAY,
    durationMin: 10,
    chapterId: 'ch-exam',
    status: 'a_faire',
    position: 0,
    ...over,
  }
}

function controle(over: Partial<Controle> = {}): Controle {
  return {
    id: 'c-1',
    subject: 'anglais',
    chapters: [{ id: 'ch-exam', title: 'Le passif' }],
    date: '2026-07-30',
    grade: '3e',
    note: null,
    notePrompted: false,
    snoozeDate: null,
    sessions: [session()],
    ...over,
  }
}

function input(over: Partial<MissionInput> = {}): MissionInput {
  return {
    today: TODAY,
    controles: [],
    subjectNameBySlug: { anglais: 'Anglais', svt: 'SVT' },
    chapters: [],
    goalMinutes: 10,
    ...over,
  }
}

describe('sessionMinutes', () => {
  it('renvoie 5 min pour un chapitre jamais commencé', () => {
    expect(sessionMinutes(0, true)).toBe(5)
  })

  it('raccourcit la session quand le chapitre est presque acquis', () => {
    expect(sessionMinutes(0.7, false)).toBe(3)
    expect(sessionMinutes(0.4, false)).toBe(5)
    expect(sessionMinutes(0.1, false)).toBe(10)
  })
})

describe('missionHref', () => {
  it('pointe vers la page du chapitre', () => {
    expect(missionHref({ subjectSlug: 'svt', chapterId: 'ch-1' })).toBe(
      '/reviser/svt/ch-1',
    )
  })
})

describe('pickMission', () => {
  it('renvoie une mission nulle sans aucun candidat', () => {
    const plan = pickMission(input())
    expect(plan.mission).toBeNull()
    expect(plan.ensuite).toEqual([])
  })

  it('priorise la session de préparation du contrôle actif', () => {
    const plan = pickMission(
      input({
        controles: [controle()],
        chapters: [chapter({ value: 0.9 })],
      }),
    )
    expect(plan.mission?.kind).toBe('controle')
    expect(plan.mission?.subjectName).toBe('Anglais')
    expect(plan.mission?.chapterId).toBe('ch-exam')
    expect(plan.mission?.chapterTitle).toBe('Le passif')
    expect(plan.mission?.countdown).toBe('J-2')
    expect(plan.mission?.minutes).toBe(10)
  })

  it('ignore un contrôle dont le plan est terminé', () => {
    const done = controle({
      sessions: [session({ status: 'faite' })],
    })
    const plan = pickMission(input({ controles: [done], chapters: [chapter()] }))
    expect(plan.mission?.kind).toBe('reprise')
  })

  it('reprend le chapitre en cours le plus avancé avant les fragiles', () => {
    const plan = pickMission(
      input({
        chapters: [
          chapter({ chapterId: 'a', state: 'fragile', value: 0.1 }),
          chapter({ chapterId: 'b', state: 'en_cours', value: 0.3 }),
          chapter({ chapterId: 'c', state: 'en_cours', value: 0.6 }),
        ],
      }),
    )
    expect(plan.mission?.chapterId).toBe('c')
    expect(plan.mission?.kind).toBe('reprise')
    // Ensuite : l'en-cours restant, puis le fragile.
    expect(plan.ensuite.map((m) => m.chapterId)).toEqual(['b', 'a'])
  })

  it('classe les fragiles du plus bas au plus haut', () => {
    const plan = pickMission(
      input({
        chapters: [
          chapter({ chapterId: 'a', state: 'fragile', value: 0.3 }),
          chapter({ chapterId: 'b', state: 'fragile', value: 0.1 }),
        ],
      }),
    )
    expect(plan.mission?.chapterId).toBe('b')
    expect(plan.mission?.minutes).toBe(10)
  })

  it('propose une découverte quand rien n’est commencé', () => {
    const plan = pickMission(
      input({
        chapters: [
          chapter({ chapterId: 'a', state: 'a_commencer', value: 0 }),
          chapter({ chapterId: 'b', state: 'a_commencer', value: 0 }),
        ],
      }),
    )
    expect(plan.mission?.kind).toBe('decouverte')
    expect(plan.mission?.isNew).toBe(true)
    expect(plan.mission?.minutes).toBe(5)
    expect(plan.ensuite.map((m) => m.chapterId)).toEqual(['b'])
  })

  it('exclut la mission des suggestions et borne « Ensuite »', () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      chapter({ chapterId: `ch-${i}`, state: 'en_cours', value: 0.5 - i * 0.02 }),
    )
    const plan = pickMission(input({ chapters: many }))
    expect(plan.mission?.chapterId).toBe('ch-0')
    expect(plan.ensuite).toHaveLength(ENSUITE_MAX)
    expect(plan.ensuite.some((m) => m.chapterId === 'ch-0')).toBe(false)
  })

  it('garde les reprises en « Ensuite » quand un contrôle occupe la mission', () => {
    const plan = pickMission(
      input({
        controles: [controle()],
        chapters: [chapter({ chapterId: 'a', state: 'en_cours', value: 0.5 })],
      }),
    )
    expect(plan.mission?.kind).toBe('controle')
    expect(plan.ensuite.map((m) => m.chapterId)).toEqual(['a'])
  })

  it('replie sur l’objectif quotidien quand la session du plan n’a pas de durée propre', () => {
    const c = controle({ sessions: [] })
    const plan = pickMission(input({ controles: [c], goalMinutes: 15 }))
    expect(plan.mission?.minutes).toBe(15)
  })
})
