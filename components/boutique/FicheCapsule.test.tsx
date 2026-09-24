import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { AchatCapsule, Capsule } from '@/lib/capsules'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn(), prefetch: vi.fn() }),
}))
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span data-image={alt} />,
}))
vi.mock('@/lib/sounds', () => ({ press: vi.fn(), sfx: { tap: vi.fn(), correct: vi.fn() } }))
const acheterCapsule = vi.fn<(id: string) => Promise<{ ok: true; gemmes: number }>>(async () => ({
  ok: true,
  gemmes: 40,
}))
const demanderCapsuleCarte = vi.fn<(id: string, contact?: string | null) => Promise<{ ok: true }>>(
  async () => ({ ok: true }),
)
vi.mock('@/app/tresor/capsules-actions', () => ({
  acheterCapsule: (id: string) => acheterCapsule(id),
  demanderCapsuleCarte: (id: string, c?: string | null) => demanderCapsuleCarte(id, c),
}))

import FicheCapsule from '@/components/boutique/FicheCapsule'

const orientation: Capsule = {
  id: 'orientation',
  theme: 'avenir',
  titre: 'Trouve ta voie, pas à pas',
  accroche: 'Découvrir les métiers.',
  emoji: '🧭',
  teinte: 'corail',
  prixGemmes: 500,
  prixEuros: 4.99,
  dureeMin: 12,
  auProgramme: ['Explorer tes envies'],
  badge: 'Cap sur l’avenir',
  ordre: 60,
}

const fiche = (gemmes: number, achat: AchatCapsule | null = null, capsule = orientation) =>
  render(
    <FicheCapsule open capsule={capsule} achat={achat} gemmes={gemmes} connecte onClose={() => {}} />,
  )

beforeEach(() => {
  acheterCapsule.mockClear()
  demanderCapsuleCarte.mockClear()
  push.mockClear()
})

describe('la fiche d’une capsule', () => {
  it('débloque en gemmes quand le solde suffit, puis mène à la bibliothèque', async () => {
    fiche(600)
    fireEvent.click(screen.getByRole('button', { name: /Débloquer pour/ }))
    await waitFor(() => expect(acheterCapsule).toHaveBeenCalledWith('orientation'))
    expect(await screen.findByText('C’est rangé dans ta bibliothèque !')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir maintenant' }))
    expect(push).toHaveBeenCalledWith('/carnet/capsules/orientation')
  })

  it('pousse la carte bancaire quand il manque des gemmes, et le dit honnêtement', async () => {
    fiche(100)
    expect(screen.getByRole('button', { name: /Débloquer pour/ })).toBeDisabled()
    expect(screen.getByText(/Il te manque/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Payer par carte · 4,99/ }))
    expect(screen.getByText(/Aucun paiement en ligne pour l’instant/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Où joindre ton parent/), { target: { value: 'parent@example.fr' } })
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer la demande' }))
    await waitFor(() => expect(demanderCapsuleCarte).toHaveBeenCalledWith('orientation', 'parent@example.fr'))
    expect(await screen.findByText(/On recontacte ton parent/)).toBeInTheDocument()
  })

  it('ne propose pas la carte à une capsule qui n’a pas de prix carte', () => {
    fiche(10, null, { ...orientation, prixEuros: null })
    expect(screen.queryByRole('button', { name: /Payer par carte/ })).toBeNull()
  })

  it('ouvre directement une capsule déjà à l’élève', () => {
    fiche(0, {
      capsuleId: 'orientation',
      statut: 'active',
      acheteeLe: 't',
      ouverteLe: null,
      termineeLe: null,
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir dans ma bibliothèque' }))
    expect(push).toHaveBeenCalledWith('/carnet/capsules/orientation')
  })

  it('garde la demande par carte visible, sans cacher la voie des gemmes', () => {
    fiche(100, {
      capsuleId: 'orientation',
      statut: 'attente_paiement',
      acheteeLe: 't',
      ouverteLe: null,
      termineeLe: null,
    })
    expect(screen.getByText(/Paiement par carte demandé/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Débloquer pour/ })).toBeDisabled()
  })
})
