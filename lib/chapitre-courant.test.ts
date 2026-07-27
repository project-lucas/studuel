import { describe, it, expect } from 'vitest'
import {
  pickCurrentChapter,
  reasonLabel,
  reasonUrgency,
  FRAGILE_THRESHOLD,
  type ChapterCandidate,
} from './chapitre-courant'
import type { Controle } from './prep-plan'

const TODAY = '2026-07-25' // un samedi

function chap(id: string, questionCount = 20): ChapterCandidate {
  return { id, title: `Chapitre ${id}`, subject: 'maths', questionCount }
}

function makeControle(over: Partial<Controle> = {}): Controle {
  return {
    id: 'ctrl-1',
    subject: 'maths',
    chapters: [{ id: 'c-exam', title: 'Thalès' }],
    date: '2026-07-30',
    grade: '3e',
    note: null,
    notePrompted: false,
    snoozeDate: null,
    sessions: [
      {
        id: 's1',
        controleId: 'ctrl-1',
        plannedDate: TODAY,
        durationMin: 10,
        chapterId: 'c-exam',
        status: 'a_faire',
        position: 0,
      },
    ],
    ...over,
  }
}

describe('pickCurrentChapter — priorités', () => {
  it('choisit le chapitre du contrôle avant tout le reste', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-recent'), chap('c-exam'), chap('c-faible')],
      controles: [makeControle()],
      today: TODAY,
      recentChapterIds: ['c-recent'],
      mastery: new Map([['c-faible', 5]]),
    })
    expect(r?.id).toBe('c-exam')
    expect(r?.reason).toBe('controle')
    expect(r?.examDate).toBe('2026-07-30')
  })

  it('reste sur le contrôle en changeant de chapitre si le visé n’est pas alimenté', () => {
    const controle = makeControle({
      chapters: [
        { id: 'c-vide', title: 'Vide' },
        { id: 'c-plein', title: 'Plein' },
      ],
      sessions: [
        {
          id: 's1',
          controleId: 'ctrl-1',
          plannedDate: TODAY,
          durationMin: 10,
          chapterId: 'c-vide',
          status: 'a_faire',
          position: 0,
        },
      ],
    })
    const r = pickCurrentChapter({
      candidates: [chap('c-plein'), chap('c-autre')],
      controles: [controle],
      today: TODAY,
    })
    expect(r?.id).toBe('c-plein')
    expect(r?.reason).toBe('controle')
  })

  it('ignore un contrôle dont le plan est terminé', () => {
    const fini = makeControle({
      sessions: [
        {
          id: 's1',
          controleId: 'ctrl-1',
          plannedDate: TODAY,
          durationMin: 10,
          chapterId: 'c-exam',
          status: 'faite',
          position: 0,
        },
      ],
    })
    const r = pickCurrentChapter({
      candidates: [chap('c-exam'), chap('c-recent')],
      controles: [fini],
      today: TODAY,
      recentChapterIds: ['c-recent'],
    })
    expect(r?.reason).toBe('recent')
    expect(r?.id).toBe('c-recent')
  })

  it('reprend là où l’élève s’est arrêté sans contrôle', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-a'), chap('c-b')],
      today: TODAY,
      recentChapterIds: ['c-inconnu', 'c-b'],
    })
    expect(r?.id).toBe('c-b')
    expect(r?.reason).toBe('recent')
  })

  it('vise le chapitre le plus fragile faute de mieux', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-fort'), chap('c-faible')],
      today: TODAY,
      mastery: new Map([
        ['c-fort', 90],
        ['c-faible', 20],
      ]),
    })
    expect(r?.id).toBe('c-faible')
    expect(r?.reason).toBe('faible')
  })

  it('propose un chapitre jamais travaillé quand tout le reste est solide', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-fort'), chap('c-neuf')],
      today: TODAY,
      mastery: new Map([['c-fort', 95]]),
    })
    expect(r?.id).toBe('c-neuf')
    expect(r?.reason).toBe('decouverte')
  })

  it('retombe sur le moins maîtrisé quand tout est travaillé et solide', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-a'), chap('c-b')],
      today: TODAY,
      mastery: new Map([
        ['c-a', 95],
        ['c-b', 80],
      ]),
    })
    expect(r?.id).toBe('c-b')
    expect(r?.reason).toBe('faible')
  })
})

describe('pickCurrentChapter — chapitres jouables', () => {
  it('écarte les chapitres trop maigres', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-maigre', 2), chap('c-plein', 30)],
      today: TODAY,
      recentChapterIds: ['c-maigre'],
    })
    expect(r?.id).toBe('c-plein')
  })

  it('renvoie null si aucun chapitre n’est jouable', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-1', 1), chap('c-2', 0)],
      today: TODAY,
    })
    expect(r).toBeNull()
  })

  it('renvoie null sans aucun candidat', () => {
    expect(pickCurrentChapter({ candidates: [], today: TODAY })).toBeNull()
  })

  it('respecte un seuil de questions personnalisé', () => {
    const r = pickCurrentChapter({
      candidates: [chap('c-1', 10)],
      today: TODAY,
      minQuestions: 20,
    })
    expect(r).toBeNull()
  })

  it('écarte un candidat sans identifiant', () => {
    const r = pickCurrentChapter({
      candidates: [{ id: '', title: 'X', subject: 'maths', questionCount: 50 }],
      today: TODAY,
    })
    expect(r).toBeNull()
  })
})

describe('reasonLabel', () => {
  const base = { id: 'c', title: 'T', subject: 'maths', questionCount: 20 }

  it('compte les jours jusqu’au contrôle', () => {
    expect(
      reasonLabel({ ...base, reason: 'controle', examDate: TODAY }, TODAY),
    ).toBe('Contrôle aujourd’hui')
    expect(
      reasonLabel({ ...base, reason: 'controle', examDate: '2026-07-26' }, TODAY),
    ).toBe('Contrôle demain')
    expect(
      reasonLabel({ ...base, reason: 'controle', examDate: '2026-07-29' }, TODAY),
    ).toBe('Contrôle dans 4 jours')
  })

  it('gère un contrôle sans date', () => {
    expect(
      reasonLabel({ ...base, reason: 'controle', examDate: null }, TODAY),
    ).toBe('Pour ton contrôle')
  })

  it('donne une raison pour chaque autre cas', () => {
    expect(reasonLabel({ ...base, reason: 'recent', examDate: null }, TODAY)).toContain(
      'arrêté',
    )
    expect(reasonLabel({ ...base, reason: 'faible', examDate: null }, TODAY)).toContain(
      'fragile',
    )
    expect(
      reasonLabel({ ...base, reason: 'decouverte', examDate: null }, TODAY),
    ).toContain('découvrir')
  })
})

describe('reasonUrgency', () => {
  const base = { id: 'c', title: 'T', subject: 'maths', questionCount: 20 }

  it('passe en urgent à deux jours ou moins du contrôle', () => {
    expect(
      reasonUrgency({ ...base, reason: 'controle', examDate: '2026-07-27' }, TODAY),
    ).toBe('urgent')
    expect(
      reasonUrgency({ ...base, reason: 'controle', examDate: '2026-07-28' }, TODAY),
    ).toBe('normal')
  })

  it('n’est jamais urgent hors contrôle', () => {
    expect(reasonUrgency({ ...base, reason: 'faible', examDate: null }, TODAY)).toBe(
      'normal',
    )
  })
})

describe('seuil de fragilité', () => {
  it('reste une valeur nommée et cohérente', () => {
    expect(FRAGILE_THRESHOLD).toBeGreaterThan(0)
    expect(FRAGILE_THRESHOLD).toBeLessThan(100)
  })
})
