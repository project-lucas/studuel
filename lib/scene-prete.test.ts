// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { markAppReady, resetAppReady } from './app-ready'
import { PLAFOND_MS, POSE_MS, quandLaScenePrete } from './scene-prete'

function visibilite(etat: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: etat, configurable: true })
}

describe('quandLaScenePrete', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetAppReady()
    document.body.innerHTML = ''
    document.body.className = ''
    visibilite('visible')
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('attend le premier écran peint, puis pose, puis rappelle', () => {
    const fn = vi.fn()
    quandLaScenePrete(fn)
    vi.advanceTimersByTime(POSE_MS + 50)
    expect(fn).not.toHaveBeenCalled()
    markAppReady()
    expect(fn).not.toHaveBeenCalled() // le temps de pose
    vi.advanceTimersByTime(POSE_MS)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('attend que le rideau soit démonté et la scène arrivée', () => {
    const fn = vi.fn()
    document.body.innerHTML = '<div class="splash"></div>'
    markAppReady()
    quandLaScenePrete(fn)
    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
    document.body.innerHTML = ''
    document.body.classList.add('hub-entering')
    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
    document.body.classList.remove('hub-entering')
    vi.advanceTimersByTime(100 + POSE_MS)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('n’attend pas le rideau pour toujours', () => {
    const fn = vi.fn()
    document.body.innerHTML = '<div class="splash"></div>'
    markAppReady()
    quandLaScenePrete(fn)
    vi.advanceTimersByTime(PLAFOND_MS + 200 + POSE_MS)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('attend que l’onglet soit visible', () => {
    const fn = vi.fn()
    visibilite('hidden')
    markAppReady()
    quandLaScenePrete(fn)
    vi.advanceTimersByTime(POSE_MS + 50)
    expect(fn).not.toHaveBeenCalled()
    visibilite('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('l’annulation empêche tout rappel', () => {
    const fn = vi.fn()
    markAppReady()
    const annuler = quandLaScenePrete(fn)
    annuler()
    vi.advanceTimersByTime(POSE_MS + 50)
    expect(fn).not.toHaveBeenCalled()
  })
})
