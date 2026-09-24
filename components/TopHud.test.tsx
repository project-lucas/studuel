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
  it('marque l’écusson et la bourse de cristaux, et rien d’autre', () => {
    // Le vol cherche ses cibles par `data-hud-cible` : sans cet attribut, les
    // jetons n'ont nulle part où aller et le geste entier se tait.
    const { container } = render(<TopHud {...PROPS} />)
    const cibles = [...container.querySelectorAll('[data-hud-cible]')].map((el) =>
      el.getAttribute('data-hud-cible'),
    )
    expect(cibles.sort()).toEqual(['gemme', 'xp'])
  })
})

describe('le compteur qui encaisse', () => {
  it('monte quand un jeton atterrit', () => {
    render(<TopHud {...PROPS} />)
    expect(screen.getByText('40')).toBeInTheDocument()

    act(() => emettreGain({ unite: 'gemme', montant: 7 }))
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('s’égrène jeton après jeton', () => {
    // C'est tout l'effet : le solde ne saute pas, il monte à mesure que la
    // pluie tombe.
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'gemme', montant: 3 }))
    expect(screen.getByText('43')).toBeInTheDocument()
    act(() => emettreGain({ unite: 'gemme', montant: 4 }))
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('n’encaisse QUE son unité', () => {
    render(<TopHud {...PROPS} />)
    // L'XP a sa cible (l'écusson) mais pas de nombre : la bourse de cristaux
    // ne doit pas la compter.
    act(() => emettreGain({ unite: 'xp', montant: 20 }))
    expect(screen.getByText('40')).toBeInTheDocument()
    expect(screen.queryByText('60')).not.toBeInTheDocument()
  })

  it('ignore une unité SANS compteur au bandeau', () => {
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'couronne', montant: 12 }))
    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('NE COMPTE PAS DEUX FOIS quand le serveur rapporte le nouveau solde', () => {
    // LE TEST QUI COMPTE. Après la volée, la page se rafraîchit et le serveur
    // renvoie 47 — un solde qui contient DÉJÀ les 7 cristaux qu'on vient
    // d'ajouter à la volée. Garder le delta par-dessus afficherait 54.
    const { rerender } = render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'gemme', montant: 7 }))
    expect(screen.getByText('47')).toBeInTheDocument()

    rerender(<TopHud {...PROPS} gems={47} />)
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.queryByText('54')).not.toBeInTheDocument()
  })

  it('repart de zéro pour la volée SUIVANTE', () => {
    const { rerender } = render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'gemme', montant: 7 }))
    rerender(<TopHud {...PROPS} gems={47} />)

    act(() => emettreGain({ unite: 'gemme', montant: 3 }))
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('dit le nouveau solde au lecteur d’écran, pas l’ancien', () => {
    // Le libellé accessible se construit sur la valeur AFFICHÉE : sinon un
    // élève au lecteur d'écran entendrait le solde d'avant la récompense.
    render(<TopHud {...PROPS} />)
    act(() => emettreGain({ unite: 'gemme', montant: 7 }))
    expect(
      screen.getByLabelText('47 cristaux — à quoi sert cette monnaie'),
    ).toBeInTheDocument()
  })
})

describe('l’écusson', () => {
  it('montre l’avatar à la place du numéro de niveau, déjà écrit à côté', () => {
    const { container } = render(
      <TopHud {...PROPS} avatar={{ src: '/images/profil/renard.webp', visage: true }} />,
    )
    const disque = container.querySelector('img[src="/images/profil/renard.webp"]')
    expect(disque).not.toBeNull()
    expect(screen.getByText(/Niveau 7/)).toBeInTheDocument()
    expect(screen.queryByText(/^7$/)).not.toBeInTheDocument()
  })

  it('garde le numéro sans avatar connu', () => {
    render(<TopHud {...PROPS} />)
    expect(screen.getByText(/^7$/)).toBeInTheDocument()
  })
})

describe('le multiplicateur d’XP', () => {
  it('affiche ×1,3 à trois amis et l’explique au toucher', () => {
    render(<TopHud {...PROPS} nbAmis={3} />)
    const bouton = screen.getByRole('button', { name: /Multiplicateur d’XP ×1,3/ })
    act(() => bouton.click())
    expect(bouton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/Toute l’XP que tu gagnes est multipliée par ce nombre/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ajouter un ami/ })).toHaveAttribute('href', '/amis')
    expect(screen.getByRole('link', { name: /Potion d’XP/ })).toHaveAttribute('href', '/tresor#marche')
  })

  it('compte la potion d’XP qui court, dit ×1,0 sans ami, et se tait quand le compte est inconnu', () => {
    const dansUneHeure = new Date(Date.now() + 3_600_000).toISOString()
    const { rerender } = render(<TopHud {...PROPS} nbAmis={3} boostXpJusqua={dansUneHeure} />)
    expect(screen.getByRole('button', { name: /Multiplicateur d’XP ×2,6/ })).toBeInTheDocument()
    rerender(<TopHud {...PROPS} nbAmis={0} />)
    expect(screen.getByRole('button', { name: /Multiplicateur d’XP ×1,0/ })).toBeInTheDocument()
    rerender(<TopHud {...PROPS} />)
    expect(screen.queryByRole('button', { name: /Multiplicateur d’XP/ })).not.toBeInTheDocument()
  })
})
