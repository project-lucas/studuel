import { Activity, useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OngletsVivants from './OngletsVivants'
import { useFermeAuMasquage } from './useFermeAuMasquage'

let chemin = '/defi'
vi.mock('next/navigation', () => ({ usePathname: () => chemin }))

const ONGLETS = {
  '/defi': <p>arène</p>,
  '/reviser': <p>réviser</p>,
  '/amis': <p>amis</p>,
  '/moi': <p>moi</p>,
  '/tresor': <p>boutique</p>,
}

/** Visible = monté ET pas sous un `display: none` posé par <Activity>. */
const visible = (texte: string) => {
  const el = screen.getByText(texte)
  let n: HTMLElement | null = el
  while (n) {
    if (n.style.display === 'none') return false
    n = n.parentElement
  }
  return true
}

describe('OngletsVivants', () => {
  beforeEach(() => {
    chemin = '/defi'
  })

  it('montre l’onglet de l’URL et garde les autres montés, cachés', () => {
    const { rerender } = render(<OngletsVivants onglets={ONGLETS}>{<p>page</p>}</OngletsVivants>)
    expect(visible('arène')).toBe(true)
    // Les autres onglets et le contenu ordinaire sont dans le DOM, cachés.
    for (const t of ['réviser', 'amis', 'moi', 'boutique', 'page']) expect(visible(t)).toBe(false)

    chemin = '/reviser'
    rerender(<OngletsVivants onglets={ONGLETS}>{<p>page</p>}</OngletsVivants>)
    expect(visible('réviser')).toBe(true)
    expect(visible('arène')).toBe(false)
  })

  it('montre le contenu ordinaire sur une sous-page d’onglet (elle n’est pas l’onglet)', () => {
    chemin = '/reviser/maths'
    render(<OngletsVivants onglets={ONGLETS}>{<p>page</p>}</OngletsVivants>)
    expect(visible('page')).toBe(true)
    for (const t of ['arène', 'réviser', 'amis', 'moi', 'boutique']) expect(visible(t)).toBe(false)
  })

  it('ne détruit pas l’onglet qu’on quitte : son état survit au retour', async () => {
    function Compteur() {
      const [n, setN] = useState(0)
      return <button onClick={() => setN(n + 1)}>compté {n}</button>
    }
    const onglets = { ...ONGLETS, '/reviser': <Compteur /> }
    chemin = '/reviser'
    const { rerender } = render(<OngletsVivants onglets={onglets}>{null}</OngletsVivants>)
    await userEvent.click(screen.getByRole('button', { name: 'compté 0' }))

    chemin = '/amis'
    rerender(<OngletsVivants onglets={onglets}>{null}</OngletsVivants>)
    chemin = '/reviser'
    rerender(<OngletsVivants onglets={onglets}>{null}</OngletsVivants>)
    expect(screen.getByRole('button', { name: 'compté 1' })).toBeInTheDocument()
  })
})

describe('OngletsVivants — le défilement de chaque onglet', () => {
  it('rend à chaque onglet la position où on l’avait laissé', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    const defiler = (y: number) => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    }
    chemin = '/reviser'
    const { rerender } = render(<OngletsVivants onglets={ONGLETS}>{null}</OngletsVivants>)
    defiler(616)

    chemin = '/amis'
    rerender(<OngletsVivants onglets={ONGLETS}>{null}</OngletsVivants>)
    // Première visite d’Amis : en haut.
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' })
    defiler(120)

    chemin = '/reviser'
    rerender(<OngletsVivants onglets={ONGLETS}>{null}</OngletsVivants>)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 616, behavior: 'instant' })

    chemin = '/amis'
    rerender(<OngletsVivants onglets={ONGLETS}>{null}</OngletsVivants>)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 120, behavior: 'instant' })

    // Une sous-page ne touche pas au défilement : Next s’en occupe.
    const appels = scrollTo.mock.calls.length
    chemin = '/amis/ajouter/ABC'
    rerender(<OngletsVivants onglets={ONGLETS}>{null}</OngletsVivants>)
    expect(scrollTo.mock.calls.length).toBe(appels)
    vi.unstubAllGlobals()
  })
})

describe('useFermeAuMasquage', () => {
  function Feuille() {
    const [ouverte, setOuverte] = useState(false)
    useFermeAuMasquage(setOuverte, false)
    return (
      <button onClick={() => setOuverte(true)}>{ouverte ? 'feuille ouverte' : 'feuille fermée'}</button>
    )
  }

  it('referme l’écran transitoire quand son onglet est caché', async () => {
    const { rerender } = render(
      <Activity mode="visible">
        <Feuille />
      </Activity>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('feuille ouverte')).toBeInTheDocument()

    await act(async () => {
      rerender(
        <Activity mode="hidden">
          <Feuille />
        </Activity>,
      )
    })
    await act(async () => {
      rerender(
        <Activity mode="visible">
          <Feuille />
        </Activity>,
      )
    })
    expect(screen.getByText('feuille fermée')).toBeInTheDocument()
  })
})
