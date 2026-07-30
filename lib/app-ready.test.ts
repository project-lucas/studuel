import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isAppReady, markAppReady, onAppReady, resetAppReady } from './app-ready'

beforeEach(() => {
  resetAppReady()
})

describe('app-ready', () => {
  it('prévient les abonnés quand le premier écran est peint', () => {
    const rappel = vi.fn()
    onAppReady(rappel)

    expect(rappel).not.toHaveBeenCalled()
    markAppReady()
    expect(rappel).toHaveBeenCalledTimes(1)
  })

  it('prévient immédiatement un abonné arrivé APRÈS le signal', () => {
    // Le cas réel : avec le streaming, l'ordre de montage entre la balise et
    // l'écran de chargement n'est pas garanti. Un abonné tardif ne doit pas
    // rester bloqué à attendre un signal déjà passé.
    markAppReady()

    const rappel = vi.fn()
    onAppReady(rappel)
    expect(rappel).toHaveBeenCalledTimes(1)
  })

  it('ne joue les rappels qu’une seule fois', () => {
    const rappel = vi.fn()
    onAppReady(rappel)

    markAppReady()
    markAppReady()

    expect(rappel).toHaveBeenCalledTimes(1)
  })

  it('prévient tous les abonnés', () => {
    const premier = vi.fn()
    const second = vi.fn()
    onAppReady(premier)
    onAppReady(second)

    markAppReady()

    expect(premier).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('n’appelle plus un abonné désabonné', () => {
    const rappel = vi.fn()
    const desabonner = onAppReady(rappel)

    desabonner()
    markAppReady()

    expect(rappel).not.toHaveBeenCalled()
  })

  it('survit à un rappel qui se désabonne pendant la diffusion', () => {
    // Sans copie du Set avant parcours, muter la collection en cours
    // d'itération sauterait l'abonné suivant.
    const second = vi.fn()
    let desabonnerSecond = () => {}
    onAppReady(() => desabonnerSecond())
    desabonnerSecond = onAppReady(second)

    expect(() => markAppReady()).not.toThrow()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('expose l’état courant', () => {
    expect(isAppReady()).toBe(false)
    markAppReady()
    expect(isAppReady()).toBe(true)
  })
})
