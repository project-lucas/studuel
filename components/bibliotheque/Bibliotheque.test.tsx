import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { lireFichesAchetees } from '@/lib/bibliotheque'
import type { AchatCapsule, Capsule } from '@/lib/capsules'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))
vi.mock('@/lib/sounds', () => ({ press: vi.fn(), sfx: { tap: vi.fn() } }))

import Bibliotheque from './Bibliotheque'

// -----------------------------------------------------------------------------
// MA BIBLIOTHÈQUE : trois onglets (plus de « Tout »), sans rien recharger ; l’URL garde
// le rayon (le retour depuis une fiche le rouvre), et les dossiers restent
// montés — cachés — quand un autre rayon s'affiche.
// -----------------------------------------------------------------------------

const capsule = (id: string, theme: Capsule['theme'], titre: string): Capsule => ({
  id,
  theme,
  titre,
  accroche: '',
  emoji: '✨',
  teinte: 'violet',
  prixGemmes: 60,
  prixEuros: null,
  dureeMin: 10,
  auProgramme: [],
  badge: '',
  ordre: 0,
})
const achat = (capsuleId: string): AchatCapsule => ({
  capsuleId,
  statut: 'active',
  acheteeLe: '2026-09-20T10:00:00Z',
  ouverteLe: null,
  termineeLe: null,
})

const capsules = [
  { capsule: capsule('sommeil', 'bien-etre', 'Le sommeil'), achat: achat('sommeil') },
  { capsule: capsule('pomodoro', 'methode', 'Pomodoro'), achat: achat('pomodoro') },
]
const fiches = lireFichesAchetees(
  [
    { chapter_id: 'c1', created_at: '2026-09-20', chapter: { id: 'c1', title: 'Les fonctions', position: 1, subject_id: 'm' } },
    { chapter_id: 'c2', created_at: '2026-09-21', chapter: { id: 'c2', title: 'La Révolution', position: 1, subject_id: 'h' } },
  ],
  [
    { id: 'm', slug: 'maths', name: 'Maths' },
    { id: 'h', slug: 'histoire-geo', name: 'Histoire-Géo' },
  ],
)

function rendre(props: Partial<Parameters<typeof Bibliotheque>[0]> = {}) {
  return render(
    <Bibliotheque
      rayonInitial="dossiers"
      capsules={capsules}
      capsulesDisponibles
      fiches={fiches}
      premium={false}
      nbDossiers={2}
      dossiers={<p>LES DOSSIERS</p>}
      {...props}
    />,
  )
}

beforeEach(() => {
  window.history.replaceState(null, '', '/carnet')
})

describe('Bibliotheque', () => {
  it('s’appelle « Ma bibliothèque », sur la rangée de la flèche de retour', () => {
    rendre()
    const titre = screen.getByRole('heading', { level: 1, name: 'Ma bibliothèque' })
    const retour = screen.getByRole('button', { name: 'Retour à Réviser' })
    // Même rangée : le titre et la flèche partagent leur parent.
    expect(titre.parentElement).toBe(retour.closest('span')?.parentElement)
  })

  it('range en trois onglets, sans « Tout », et arrive sur les Dossiers', () => {
    rendre()
    const onglets = within(screen.getByRole('radiogroup', { name: 'Ranger ma bibliothèque' })).getAllByRole('radio')
    expect(onglets.map((o) => o.textContent)).toEqual(['Dossiers', 'Capsules', 'Fiches'])
    expect(screen.getByRole('radio', { name: 'Dossiers (2)' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('LES DOSSIERS')).toBeVisible()
  })

  it('l’onglet Fiches range par matière, écrit le rayon dans l’URL et cache les dossiers sans les démonter', () => {
    rendre()
    fireEvent.click(screen.getByRole('radio', { name: 'Fiches (2)' }))

    expect(screen.getByRole('radio', { name: 'Fiches (2)' })).toHaveAttribute('aria-checked', 'true')
    expect(window.location.search).toBe('?rayon=fiches')
    expect(screen.getByRole('link', { name: /Les fonctions/ })).toHaveAttribute('href', '/reviser/maths/c1/carte')
    // Toujours dans le DOM, mais caché.
    expect(screen.getByText('LES DOSSIERS').parentElement).toHaveClass('hidden')
  })

  it('le second filtre ne garde que la matière choisie', () => {
    rendre({ rayonInitial: 'fiches' })
    const puces = screen.getByRole('radiogroup', { name: 'Matière' })
    fireEvent.click(within(puces).getByRole('radio', { name: /Maths/ }))
    expect(screen.getByText('Les fonctions')).toBeInTheDocument()
    expect(screen.queryByText('La Révolution')).not.toBeInTheDocument()
  })

  it('l’onglet Capsules montre la grille ; revenir aux Dossiers efface le paramètre', () => {
    rendre()
    fireEvent.click(screen.getByRole('radio', { name: 'Capsules (2)' }))
    expect(window.location.search).toBe('?rayon=capsules')
    expect(screen.getByRole('list', { name: 'Mes capsules' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Dossiers (2)' }))
    expect(window.location.search).toBe('')
  })

  it('n’invite pas un abonné à acheter des fiches', () => {
    rendre({ fiches: [], premium: true, rayonInitial: 'fiches' })
    expect(screen.getByText('Toutes tes fiches sont ouvertes')).toBeInTheDocument()
    expect(screen.queryByText('Débloque ta première fiche')).not.toBeInTheDocument()
  })
})
