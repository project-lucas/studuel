import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { CLASSE_HUD_REPLIE, SEUIL_REPLI_HUD, hudReplie, useHudAuDefilement } from './useHudAuDefilement'

// Le bandeau du haut s'efface dès qu'on défile dans un mode de jeu, revient en
// haut de page, et la classe ne survit jamais à l'écran qui l'a posée.

function defiler(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  vi.unstubAllGlobals()
  defiler(0)
  document.documentElement.classList.remove(CLASSE_HUD_REPLIE)
})

describe('hudReplie', () => {
  it('garde le bandeau en haut de page, le replie au-delà du seuil', () => {
    expect(hudReplie(0)).toBe(false)
    expect(hudReplie(SEUIL_REPLI_HUD)).toBe(false)
    expect(hudReplie(SEUIL_REPLI_HUD + 1)).toBe(true)
  })
})

describe('useHudAuDefilement', () => {
  it('pose la classe au défilement, la retire en haut et au démontage', () => {
    // Les images arrivent quand le test le décide (`image()`), comme un vrai
    // `requestAnimationFrame` : asynchrone, jamais pendant l'appel.
    let file: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => file.push(f))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const image = () => {
      const a = file
      file = []
      a.forEach((f) => f(0))
    }
    const racine = document.documentElement
    const { unmount } = renderHook(() => useHudAuDefilement())
    expect(racine.classList.contains(CLASSE_HUD_REPLIE)).toBe(false)

    act(() => {
      defiler(300)
      image()
    })
    expect(racine.classList.contains(CLASSE_HUD_REPLIE)).toBe(true)

    act(() => {
      defiler(0)
      image()
    })
    expect(racine.classList.contains(CLASSE_HUD_REPLIE)).toBe(false)

    act(() => {
      defiler(300)
      image()
    })
    unmount()
    expect(racine.classList.contains(CLASSE_HUD_REPLIE)).toBe(false)
  })
})
