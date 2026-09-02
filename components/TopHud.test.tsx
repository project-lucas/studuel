import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { emettreGain } from '@/lib/hud-gains'

// LE BANDEAU QUI ENCAISSE — la moitié « arrivée » du geste de Clash Royale.
//
// Le vol dépose ses jetons un à un (components/recompenses) ; ici on vérifie ce
// que le compteur en fait. Deux dangers, et ce sont les deux seuls qui se
// voient à l'écran :
//   · le compteur qui ne bouge pas (le jeton arrive, rien ne se passe : il n'a
//     pas atterri, il a disparu) ;
//   · le gain compté DEUX FOIS, quand le rafraîchissement rapporte un solde qui
//     contient déjà les jetons et qu'on garde le delta par-dessus.

vi.mock('next/navigation', () => ({
  usePathname: () => '/reviser',
}))

import TopHud from '@/components/TopHud'

const PROPS = {
  coins: 120,
  gems: 40,
  streak: 3,
  level: 7,
  levelTitle: 'Apprenti',
  progress: 0.5,
  userLabel: 'Lucas',
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('les cibles du vol', () => {
  it('marque l’écusson et les DEUX bourses, et rien d’autre', () => {
    // Le vol cherche ses cibles par `data-hud-cible` : sans cet attribut, les
    // jetons n'ont nulle part où aller et le geste entier se tait.
    const { container } = render(<TopHud {...PROPS} />)
    const cibles = [...container.querySelectorAll('[data-hud-cible]')].map((el) =>
      el.getAttribute('data-hud-cible'),
    )
    expect(cibles.sort()).toEqual(['ecu', 'gemme', 'xp'])
  })
})

describe('le compteur qui encaisse', () => {
  it('monte quand un jeton atterrit', () => {
    render(<TopHud {...PROPS} />)
    expect(screen.getByText('120')).toBeInTheDocument()

    act(() => emettreGain({ unite: 'ecu', montant: 7 }))
    expect(screen.getByText('127')).toBeInTheDocument()
  })

  it('s’égrène jeton après jeton', () => {
    // C'est tout l'effet : le solde ne saute pas, il monte à mesure que la
    // pluie tombe.
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'ecu', montant: 3 }))
    expect(screen.getByText('123')).toBeInTheDocument()
    act(() => emettreGain({ unite: 'ecu', montant: 4 }))
    expect(screen.getByText('127')).toBeInTheDocument()
  })

  it('n’encaisse QUE son unité', () => {
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'gemme', montant: 20 }))
    // La bourse d'écus n'a pas bougé ; celle des cristaux, si.
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('ignore une unité SANS compteur au bandeau', () => {
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'couronne', montant: 12 }))
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('NE COMPTE PAS DEUX FOIS quand le serveur rapporte le nouveau solde', () => {
    // LE TEST QUI COMPTE. Après la volée, la page se rafraîchit et le serveur
    // renvoie 127 — un solde qui contient DÉJÀ les 7 écus qu'on vient
    // d'ajouter à la volée. Garder le delta par-dessus afficherait 134.
    const { rerender } = render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'ecu', montant: 7 }))
    expect(screen.getByText('127')).toBeInTheDocument()

    rerender(<TopHud {...PROPS} coins={127} />)
    expect(screen.getByText('127')).toBeInTheDocument()
    expect(screen.queryByText('134')).not.toBeInTheDocument()
  })

  it('repart de zéro pour la volée SUIVANTE', () => {
    const { rerender } = render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'ecu', montant: 7 }))
    rerender(<TopHud {...PROPS} coins={127} />)

    act(() => emettreGain({ unite: 'ecu', montant: 3 }))
    expect(screen.getByText('130')).toBeInTheDocument()
  })

  it('dit le nouveau solde au lecteur d’écran, pas l’ancien', () => {
    // Le libellé accessible se construit sur la valeur AFFICHÉE : sinon un
    // élève au lecteur d'écran entendrait le solde d'avant la récompense.
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'ecu', montant: 7 }))
    expect(
      screen.getByLabelText('127 écus — à quoi sert cette monnaie'),
    ).toBeInTheDocument()
  })
})
