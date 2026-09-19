import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { PACKS_GEMMES } from '@/lib/boutique/packs-gemmes'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
}))
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span data-image={alt} />,
}))
vi.mock('@/lib/sounds', () => ({ press: vi.fn(), sfx: { tap: vi.fn(), correct: vi.fn() } }))
const demanderPackGemmes = vi.fn<(id: string, contact?: string | null) => Promise<{ ok: true }>>(
  async () => ({ ok: true }),
)
vi.mock('@/app/tresor/gemmes-actions', () => ({
  demanderPackGemmes: (id: string, c?: string | null) => demanderPackGemmes(id, c),
}))

import RayonGemmes from '@/components/boutique/RayonGemmes'

describe('la section Gemmes de la Boutique', () => {
  it('montre les trois packs, chacun avec sa quantité et son prix en euros', () => {
    render(<RayonGemmes packs={PACKS_GEMMES} connecte />)
    expect(screen.getByRole('heading', { name: 'Gemmes' })).toBeInTheDocument()
    const packs = screen.getAllByRole('button', { name: /gemmes pour/ })
    expect(packs).toHaveLength(3)
    expect(within(packs[2]).getByText('Baril de gemmes')).toBeInTheDocument()
    expect(within(packs[2]).getByText(/11,99/)).toBeInTheDocument()
  })

  it('demande un pack pour un parent, et le dit honnêtement', async () => {
    render(<RayonGemmes packs={PACKS_GEMMES} connecte />)
    fireEvent.click(screen.getByRole('button', { name: /^Sac de gemmes/ }))
    expect(screen.getByText(/Aucun paiement en ligne pour l’instant/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Où joindre ton parent/), { target: { value: 'parent@example.fr' } })
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer la demande' }))
    await waitFor(() => expect(demanderPackGemmes).toHaveBeenCalledWith('sac', 'parent@example.fr'))
    expect(await screen.findByText(/tes gemmes arrivent dès qu’il est confirmé/)).toBeInTheDocument()
  })

  it('invite un visiteur à se connecter au lieu de demander', () => {
    render(<RayonGemmes packs={PACKS_GEMMES} connecte={false} />)
    fireEvent.click(screen.getByRole('button', { name: /^Baril de gemmes/ }))
    expect(screen.getByRole('button', { name: 'Connecte-toi pour acheter des gemmes' })).toBeInTheDocument()
  })
})
