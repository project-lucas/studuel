import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'
import type { Gain } from '@/lib/gains'

// LE PANNEAU DE RÉCOMPENSES — la moitié visible du geste de Clash Royale.
//
// Ce qui se vérifie ici tient en trois lignes de conduite, et chacune vient
// d'un défaut qu'on peut fabriquer sans le vouloir :
//   · rien à annoncer = rien à l'écran (sinon chaque rejeu devient un constat
//     d'échec sous un cadre « Récompenses » vide) ;
//   · une seule volée par écran de fin, même si le parent se re-rend (ces
//     écrans reçoivent presque tous une seconde réponse serveur en retard) ;
//   · une phrase lisible au lecteur d'écran, les pastilles étant muettes.

const celebrer = vi.fn()

vi.mock('@/components/recompenses/RecompensesProvider', () => ({
  useRecompenses: () => ({ celebrer }),
}))

import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'

beforeEach(() => {
  vi.useFakeTimers()
  celebrer.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ce que le panneau affiche', () => {
  it('ne rend RIEN quand il n’y a rien à annoncer', () => {
    // Un quiz rejoué ne verse plus d'XP : le panneau doit disparaître, pas
    // afficher un cadre vide qui ferait passer le rejeu pour un échec.
    const { container } = render(<PanneauRecompenses gains={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('ne rend rien non plus sur des montants nuls', () => {
    const { container } = render(
      <PanneauRecompenses gains={[{ unite: 'xp', montant: 0 }]} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('montre une pastille par unité, accordée en nombre', () => {
    render(
      <PanneauRecompenses
        gains={[
          { unite: 'xp', montant: 30 },
          { unite: 'gemme', montant: 1 },
        ]}
      />,
    )
    expect(screen.getByText('+30')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
    // Singulier pour 1, pluriel au-delà.
    expect(screen.getByText('cristal')).toBeInTheDocument()
  })

  it('ADDITIONNE deux versements de la même unité', () => {
    // Un chapitre qui franchit deux paliers d'un coup verse l'XP de chacun :
    // deux appels, une seule chose du point de vue de l'élève.
    render(
      <PanneauRecompenses
        gains={[
          { unite: 'xp', montant: 40 },
          { unite: 'xp', montant: 60 },
        ]}
      />,
    )
    expect(screen.getByText('+100')).toBeInTheDocument()
    expect(screen.queryByText('+40')).not.toBeInTheDocument()
  })

  it('dit la récompense en UNE phrase au lecteur d’écran', () => {
    // Les pastilles sont `aria-hidden` : lues une à une, elles donnent
    // « plus cent XP plus trente cristaux », sans liaison ni verbe.
    render(
      <PanneauRecompenses
        gains={[
          { unite: 'xp', montant: 100 },
          { unite: 'gemme', montant: 30 },
        ]}
      />,
    )
    expect(
      screen.getByText('Tu as gagné 100 XP, 30 cristaux.'),
    ).toBeInTheDocument()
  })
})

describe('le départ de la volée', () => {
  it('part une fois le panneau posé, pas au premier rendu', () => {
    // Des jetons qui partent d'une pastille encore en train d'apparaître volent
    // depuis un point qui a déjà bougé.
    render(<PanneauRecompenses gains={[{ unite: 'ecu', montant: 12 }]} />)
    expect(celebrer).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(1000))
    expect(celebrer).toHaveBeenCalledTimes(1)
    expect(celebrer.mock.calls[0][0]).toEqual([{ unite: 'ecu', montant: 12 }])
  })

  it('ne part QU’UNE FOIS, même si le parent se re-rend', () => {
    // LE TEST QUI COMPTE. Ces écrans de fin reçoivent presque tous une seconde
    // réponse serveur en retard (le bilan des cartes, l'apparition d'un
    // gardien) : chaque re-rendu relancerait la volée, et le compteur monterait
    // deux fois pour un seul gain.
    function Parent() {
      const [n, setN] = useState(0)
      return (
        <>
          <button type="button" onClick={() => setN(n + 1)}>
            re-rendre {n}
          </button>
          <PanneauRecompenses gains={[{ unite: 'ecu', montant: 12 }]} />
        </>
      )
    }
    render(<Parent />)
    act(() => void vi.advanceTimersByTime(1000))
    expect(celebrer).toHaveBeenCalledTimes(1)

    act(() => {
      screen.getByRole('button').click()
    })
    act(() => void vi.advanceTimersByTime(2000))
    expect(celebrer).toHaveBeenCalledTimes(1)
  })

  it('ne part pas du tout quand il n’y a rien à faire voler', () => {
    render(<PanneauRecompenses gains={[]} />)
    act(() => void vi.advanceTimersByTime(2000))
    expect(celebrer).not.toHaveBeenCalled()
  })

  it('annule la volée si l’écran est quitté avant le décollage', () => {
    // Un élève qui tape « Rejouer » dans la demi-seconde ne doit pas voir des
    // jetons partir d'un panneau qui n'est plus là.
    const { unmount } = render(
      <PanneauRecompenses gains={[{ unite: 'ecu', montant: 12 }]} />,
    )
    unmount()
    act(() => void vi.advanceTimersByTime(2000))
    expect(celebrer).not.toHaveBeenCalled()
  })
})

describe('les gains venus du serveur', () => {
  it('encaisse une liste absente sans tomber', () => {
    // Une page encore ouverte pendant un déploiement peut recevoir la réponse
    // d'une version qui ne renvoyait pas encore de gains.
    const { container } = render(
      <PanneauRecompenses gains={undefined as unknown as Gain[]} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
