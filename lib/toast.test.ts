import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  TOAST_DURATION_MS,
  TOAST_MAX,
  dismissToast,
  getToasts,
  resetToastsForTests,
  subscribeToasts,
  toast,
} from './toast'

beforeEach(() => {
  vi.useFakeTimers()
  resetToastsForTests()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('toast', () => {
  it('empile un message et prévient les abonnés', () => {
    const seen: number[] = []
    subscribeToasts(() => seen.push(getToasts().length))

    toast('Enregistré ✓')

    expect(getToasts()).toHaveLength(1)
    expect(getToasts()[0]).toMatchObject({ message: 'Enregistré ✓', kind: 'success' })
    expect(seen).toEqual([1])
  })

  it('expire tout seul après la durée d’affichage', () => {
    toast('Enregistré ✓')
    vi.advanceTimersByTime(TOAST_DURATION_MS - 1)
    expect(getToasts()).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(getToasts()).toHaveLength(0)
  })

  it('borne la file aux derniers messages', () => {
    for (let i = 0; i < TOAST_MAX + 2; i++) toast(`m${i}`)
    expect(getToasts()).toHaveLength(TOAST_MAX)
    expect(getToasts()[0].message).toBe('m2')
  })

  it('dismissToast retire le bon message, sans erreur si déjà parti', () => {
    toast('a')
    toast('b', 'error')
    const [a, b] = getToasts()
    dismissToast(a.id)
    expect(getToasts().map((t) => t.id)).toEqual([b.id])
    dismissToast(a.id) // déjà parti : no-op
    expect(getToasts()).toHaveLength(1)
  })

  it('le désabonnement arrête les notifications', () => {
    let calls = 0
    const off = subscribeToasts(() => calls++)
    toast('a')
    off()
    toast('b')
    expect(calls).toBe(1)
  })
})
