import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import MesAmis from '@/components/amis/MesAmis'
import type { CoffreSemaine, JoueurAmi } from '@/lib/ligue'

// Le bloc est testé pour ce qu'il MONTRE : les actions serveur, le duel et
// l'ouverture du coffre ont leurs propres chemins, ici personne ne répond.
vi.mock('@/app/amis/actions', () => ({
  renameSquad: vi.fn(async () => ({ ok: false })),
  addFriendByCode: vi.fn(async () => ({ ok: true, message: 'Demande envoyée' })),
}))
vi.mock('@/components/amis/useDuelLaunch', () => ({
  useDuelLaunch: () => ({ launch: vi.fn(), launching: false }),
}))
vi.mock('@/components/amis/ligue/OuvrirCoffre', () => ({ default: () => null }))
vi.mock('@/components/FriendQrButton', () => ({ default: () => null }))
vi.mock('@/components/ParrainageCard', () => ({
  default: () => <p>Carte de parrainage</p>,
}))

const joueur = (id: string, nom: string, xp: number, moi = false): JoueurAmi => ({
  id,
  nom,
  portrait: '',
  xp,
  echelon: 1,
  moi,
})

const MOI = joueur('moi', 'Sacha', 120, true)
const TROIS = [MOI, joueur('a', 'Léa', 140), joueur('b', 'Rayan', 50), joueur('c', 'Inès', 0)]

const coffre = (over: Partial<CoffreSemaine> = {}): CoffreSemaine => ({
  xpMoi: 120,
  nbAmis: 3,
  partAmis: 190,
  points: 310,
  ...over,
})

const rendre = (joueurs: JoueurAmi[], c: CoffreSemaine) =>
  render(
    <MesAmis
      joueurs={joueurs}
      coffre={c}
      coffresPrets={[]}
      coffreOuvrable
      finIso={null}
      maintenantIso="2026-10-01T12:00:00.000Z"
      onlineFriendIds={[]}
      myFriendCode="ABC123"
      squadName={null}
      canRenameSquad={false}
      referral={{ pending: 0, activated: 0, gemsEarned: 0, gemsRemaining: 600, capped: false }}
    />,
  )

const places = () => screen.getByRole('list', { name: 'Tes 10 places d’amis' })

afterEach(cleanup)

describe('MesAmis — les dix places', () => {
  it('trois amis : ×1,3, trois places prises, sept à prendre', () => {
    rendre(TROIS, coffre())
    expect(screen.getByText('×1,3')).toBeTruthy()
    expect(places().querySelectorAll('li')).toHaveLength(10)
    expect(screen.getAllByRole('button', { name: /Place libre/ })).toHaveLength(7)
    expect(screen.getByText('3 amis sur 10')).toBeTruthy()
  })

  it('sans ami : ×1,0, dix places vides, et le bouton dit « mon premier ami »', () => {
    rendre([MOI], coffre({ nbAmis: 0, partAmis: 0, points: 120 }))
    expect(screen.getByText('×1,0')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /Place libre/ })).toHaveLength(10)
    expect(screen.getByRole('button', { name: /Ajouter mon premier ami/ })).toBeTruthy()
    // Pas de classement d'un seul joueur.
    expect(screen.queryByRole('list', { name: /classés à l’XP/ })).toBeNull()
  })

  it('une place vide ouvre la même fenêtre que le gros bouton', () => {
    rendre(TROIS, coffre())
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getAllByRole('button', { name: /Place libre/ })[0])
    expect(screen.getByRole('dialog', { name: 'Ajouter un ami' })).toBeTruthy()
    expect(screen.getByText('Carte de parrainage')).toBeTruthy()
  })

  it('dix amis ou plus : le sommet, plus aucune place libre', () => {
    const douze = [MOI, ...Array.from({ length: 12 }, (_, i) => joueur(`ami-${i}`, `Ami ${i}`, 10 * i))]
    rendre(douze, coffre({ nbAmis: 12 }))
    expect(screen.getByText('×2,0')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Place libre/ })).toBeNull()
    expect(screen.getByText(/2 de plus, qui remplissent aussi le coffre/)).toBeTruthy()
  })

  it('le coffre dit ma part et celle de mes amis', () => {
    rendre(TROIS, coffre())
    expect(screen.getByText('Niveau 2')).toBeTruthy()
    expect(screen.getByText('310 / 450 XP')).toBeTruthy()
    expect(screen.getByText('Toi 120')).toBeTruthy()
    expect(screen.getByText('Tes amis 190')).toBeTruthy()
  })
})
