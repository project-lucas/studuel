import { describe, it, expect } from 'vitest'
import {
  readRememberedSubject,
  rememberSubject,
  SUBJECT_MEMORY_KEY,
} from '@/lib/defi/subject-memory'

/** Un `Storage` minimal, plus quelques variantes hostiles. */
function fakeStore(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial))
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (k: string) => data.get(k) ?? null,
    key: (i: number) => [...data.keys()][i] ?? null,
    removeItem: (k: string) => data.delete(k),
    setItem: (k: string, v: string) => data.set(k, v),
  } as Storage
}

const throwingStore = {
  getItem: () => {
    throw new Error('accès refusé')
  },
  setItem: () => {
    throw new Error('quota dépassé')
  },
} as unknown as Storage

describe('la mémoire de matière', () => {
  it('rend le slug retenu', () => {
    const store = fakeStore({ [SUBJECT_MEMORY_KEY]: 'histoire-geo' })
    expect(readRememberedSubject(store)).toBe('histoire-geo')
  })

  it('rend null quand rien n’a été choisi', () => {
    expect(readRememberedSubject(fakeStore())).toBeNull()
  })

  it('rend null sans stockage du tout (rendu serveur)', () => {
    expect(readRememberedSubject(null)).toBeNull()
  })

  it('ignore une valeur vide plutôt que de la rendre', () => {
    const store = fakeStore({ [SUBJECT_MEMORY_KEY]: '   ' })
    expect(readRememberedSubject(store)).toBeNull()
  })

  it('écrit puis relit le même choix', () => {
    const store = fakeStore()
    rememberSubject(store, 'maths')
    expect(readRememberedSubject(store)).toBe('maths')
  })

  it('n’écrit pas un slug vide — ça effacerait le choix précédent', () => {
    const store = fakeStore({ [SUBJECT_MEMORY_KEY]: 'maths' })
    rememberSubject(store, '')
    expect(readRememberedSubject(store)).toBe('maths')
  })

  it('ne tombe pas quand le stockage jette (navigation privée, quota)', () => {
    expect(readRememberedSubject(throwingStore)).toBeNull()
    expect(() => rememberSubject(throwingStore, 'maths')).not.toThrow()
  })
})
