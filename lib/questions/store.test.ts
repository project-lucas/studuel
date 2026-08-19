import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyAnswer, type QuestionRef, type QuestionState } from './engine'
import {
  cacheStates,
  clearPending,
  clearSnapshot,
  lastSessionFor,
  localStates,
  MAX_PENDING,
  pendingAnswers,
  queueAnswer,
  readSnapshot,
  recentFor,
  recordServed,
  writeSnapshot,
} from './store'

// Les tests de `lib/` tournent en environnement node : pas de `window`. On en
// pose un minimal, avec un localStorage en mémoire — c'est tout ce que le store
// consomme, et ça garde le test hermétique (aucun état ne fuit d'un cas à
// l'autre).
class FakeStorage {
  private data = new Map<string, string>()
  /**
   * Taille maximale d'une valeur. Au-delà, `setItem` lève — comme un vrai
   * navigateur à court de quota. Un plafond par TAILLE et non un interrupteur
   * « tout échoue » : c'est ce qui rend le repli du store observable (la charge
   * réduite, elle, doit passer).
   */
  limit = Infinity

  getItem(k: string): string | null {
    return this.data.get(k) ?? null
  }
  setItem(k: string, v: string): void {
    if (v.length > this.limit) throw new Error('QuotaExceededError')
    this.data.set(k, v)
  }
  removeItem(k: string): void {
    this.data.delete(k)
  }
  get size(): number {
    return this.data.size
  }
}

let store: FakeStorage
const USER = 'user-1'
const NOW = Date.UTC(2026, 7, 17, 10, 0, 0)

function ref(n: number): QuestionRef {
  return {
    questionId: `q${n}`,
    chapterId: 'chap-1',
    subjectId: 'maths',
    level: '3e',
  }
}

beforeEach(() => {
  store = new FakeStorage()
  ;(globalThis as { window?: unknown }).window = { localStorage: store }
})

afterEach(() => {
  delete (globalThis as { window?: unknown }).window
})

describe('instantané local', () => {
  it('rend une forme vide et valide quand rien n’est stocké', () => {
    expect(readSnapshot(USER)).toEqual({
      v: 1,
      states: {},
      recent: {},
      lastSession: {},
      pending: [],
    })
  })

  it('survit à un contenu illisible plutôt que de faire tomber la session', () => {
    store.setItem('studuel.questions.v1.user-1', '{ pas du json')
    expect(readSnapshot(USER).pending).toEqual([])
  })

  it('jette un instantané d’une autre version au lieu de le migrer', () => {
    store.setItem(
      'studuel.questions.v1.user-1',
      JSON.stringify({ v: 99, pending: [{ questionId: 'q1' }] }),
    )
    expect(readSnapshot(USER).pending).toEqual([])
  })

  it('fonctionne sans stockage du tout (navigation privée verrouillée)', () => {
    delete (globalThis as { window?: unknown }).window
    expect(() => recordServed(USER, 'chapter:c1', ['q1'])).not.toThrow()
    expect(readSnapshot(USER).pending).toEqual([])
  })

  it('sauve au moins la file d’attente quand le quota déborde', () => {
    const s = applyAnswer(null, ref(1), false, NOW)
    queueAnswer(USER, { ...ref(1), isCorrect: false, answeredAt: NOW }, s)

    // On règle le plafond entre les deux charges : l'instantané complet ne
    // passe plus, la charge réduite (la seule file) passe encore.
    const complet = store.getItem('studuel.questions.v1.user-1')!.length
    const reduit = JSON.stringify({
      v: 1,
      states: {},
      recent: {},
      lastSession: {},
      pending: readSnapshot(USER).pending,
    }).length
    expect(reduit).toBeLessThan(complet)
    store.limit = complet - 1

    // Une écriture qui ne tiendrait pas : le store se replie.
    cacheStates(USER, [applyAnswer(null, ref(2), true, NOW)])

    store.limit = Infinity
    // La file est ce qu'on ne peut pas reconstituer : elle a la priorité, et
    // le cache d'états — reconstructible depuis le serveur — est sacrifié.
    expect(readSnapshot(USER).pending).toHaveLength(1)
    expect(readSnapshot(USER).states).toEqual({})
  })

  it('efface tout à la demande', () => {
    recordServed(USER, 'chapter:c1', ['q1'])
    clearSnapshot(USER)
    expect(recentFor(USER, 'chapter:c1')).toEqual([])
  })
})

describe('mémoire des sessions', () => {
  it('avance la fenêtre glissante et retient la session précédente', () => {
    recordServed(USER, 'chapter:c1', ['q1', 'q2'])
    expect(lastSessionFor(USER, 'chapter:c1')).toEqual(['q1', 'q2'])

    recordServed(USER, 'chapter:c1', ['q3', 'q4'])
    expect(lastSessionFor(USER, 'chapter:c1')).toEqual(['q3', 'q4'])
    expect(recentFor(USER, 'chapter:c1')).toEqual(['q3', 'q4', 'q1', 'q2'])
  })

  it('sépare les périmètres : une matière n’assèche pas un chapitre', () => {
    recordServed(USER, 'chapter:c1', ['q1'])
    recordServed(USER, 'subject:maths', ['q9'])
    expect(recentFor(USER, 'chapter:c1')).toEqual(['q1'])
    expect(recentFor(USER, 'subject:maths')).toEqual(['q9'])
  })

  it('borne la fenêtre à 20 même après beaucoup de sessions', () => {
    for (let i = 0; i < 40; i++) recordServed(USER, 'chapter:c1', [`q${i}`])
    expect(recentFor(USER, 'chapter:c1')).toHaveLength(20)
    expect(recentFor(USER, 'chapter:c1')[0]).toBe('q39')
  })
})

describe('file d’attente hors ligne', () => {
  it('avance l’état local tout de suite, sans réseau', () => {
    const s1 = applyAnswer(null, ref(1), true, NOW)
    queueAnswer(USER, { ...ref(1), isCorrect: true, answeredAt: NOW }, s1)

    const local = localStates(USER)
    expect(local.get('q1')?.box).toBe(2)
    expect(pendingAnswers(USER)).toHaveLength(1)
  })

  it('empile plusieurs réponses sur la même question sans les perdre', () => {
    let s: QuestionState | null = null
    for (let i = 0; i < 3; i++) {
      s = applyAnswer(s, ref(1), true, NOW + i)
      queueAnswer(USER, { ...ref(1), isCorrect: true, answeredAt: NOW + i }, s)
    }
    expect(pendingAnswers(USER)).toHaveLength(3)

    const local = localStates(USER).get('q1')!
    // Les trois passages sont comptés…
    expect(local.timesSeen).toBe(3)
    // …mais la boîte n'a monté qu'une fois : les deux suivants tombent avant
    // l'échéance (garde anti-bachotage du barème, cf. engine.applyAnswer).
    expect(local.box).toBe(2)
  })

  it('ne purge que ce qui a été confirmé', () => {
    const a = { ...ref(1), isCorrect: true, answeredAt: NOW }
    const b = { ...ref(2), isCorrect: false, answeredAt: NOW + 1 }
    queueAnswer(USER, a, applyAnswer(null, ref(1), true, NOW))
    queueAnswer(USER, b, applyAnswer(null, ref(2), false, NOW + 1))

    clearPending(USER, [a])
    expect(pendingAnswers(USER)).toEqual([b])
  })

  it('ne jette pas une réponse arrivée pendant la synchronisation', () => {
    // Le cas qu'une purge « les N premières » casserait : on lit la file, une
    // réponse s'ajoute, puis on confirme l'ancien lot.
    const lot = [{ ...ref(1), isCorrect: true, answeredAt: NOW }]
    queueAnswer(USER, lot[0], applyAnswer(null, ref(1), true, NOW))
    const tardive = { ...ref(2), isCorrect: true, answeredAt: NOW + 500 }
    queueAnswer(USER, tardive, applyAnswer(null, ref(2), true, NOW + 500))

    clearPending(USER, lot)
    expect(pendingAnswers(USER)).toEqual([tardive])
  })

  it('borne la file : un élève hors ligne longtemps ne fait pas déborder le stockage', () => {
    for (let i = 0; i < MAX_PENDING + 50; i++) {
      queueAnswer(
        USER,
        { ...ref(i), isCorrect: true, answeredAt: NOW + i },
        applyAnswer(null, ref(i), true, NOW + i),
      )
    }
    const file = pendingAnswers(USER)
    expect(file).toHaveLength(MAX_PENDING)
    // Ce sont les plus RÉCENTES qu'on garde.
    expect(file[file.length - 1].questionId).toBe(`q${MAX_PENDING + 49}`)
  })
})

describe('cache des états serveur', () => {
  it('fusionne sans écraser le reste de l’instantané', () => {
    recordServed(USER, 'chapter:c1', ['q1'])
    const s = applyAnswer(null, ref(7), true, NOW)
    cacheStates(USER, [s])

    expect(localStates(USER).get('q7')?.box).toBe(2)
    expect(recentFor(USER, 'chapter:c1')).toEqual(['q1'])
  })

  it('ignore un lot vide', () => {
    cacheStates(USER, [])
    expect(store.size).toBe(0)
  })

  it('accepte une écriture directe de l’instantané', () => {
    writeSnapshot(USER, {
      v: 1,
      states: {},
      recent: { 'chapter:c1': ['q5'] },
      lastSession: {},
      pending: [],
    })
    expect(recentFor(USER, 'chapter:c1')).toEqual(['q5'])
  })
})
