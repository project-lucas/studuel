import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import type { Lettre } from '@/lib/courrier'
import type { PorteCourrier } from './porte'

// LA BOÎTE AUX LETTRES, à l'assemblage. La logique (tri, onglets, non-lus)
// est testée pure dans lib/courrier ; ici, le CÂBLAGE : qu'ouvrir une lettre
// la marque lue (et le dise au serveur), que « Récupérer » demande au serveur
// et fasse voler EXACTEMENT ce qu'il a versé, qu'un refus ne marque rien, que
// les onglets filtrent, et que le magasin du bouton flottant suive.

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, back: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/courrier',
}))
vi.mock('@/lib/sounds', () => ({
  sfx: { tap: vi.fn(), open: vi.fn(), back: vi.fn(), coin: vi.fn(), perle: vi.fn(), complete: vi.fn() },
  press: vi.fn(),
}))
const celebrer = vi.fn()
vi.mock('@/components/recompenses/RecompensesProvider', () => ({
  useRecompenses: () => ({ celebrer, ouvrirRuban: vi.fn() }),
  origineUnique: (_e: unknown, gains: readonly { unite: string }[]) =>
    Object.fromEntries(gains.map((g) => [g.unite, { x: 10, y: 10 }])),
}))
const toast = vi.fn()
vi.mock('@/lib/toast', () => ({ toast: (...args: unknown[]) => toast(...args) }))
// Les Server Actions ne tournent pas en jsdom : la porte de test les remplace.
vi.mock('./porte', () => ({ PORTE_SERVEUR: {} }))

import BoiteAuxLettres from './BoiteAuxLettres'
import { useNonLusCourrier } from './store'

const ID_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const ID_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const ID_C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const ID_D = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'

function lettre(sur: Partial<Lettre> & { id: string; titre: string }): Lettre {
  return {
    source: 'courrier',
    type: 'marcel',
    corps: 'Un corps de lettre.',
    lien: null,
    lienLibelle: null,
    gains: null,
    expediteur: 'Marcel',
    visage: { genre: 'marcel', pose: 'salut' },
    lue: false,
    recuperee: true,
    recueLe: new Date(Date.now() - 3_600_000).toISOString(),
    expireLe: null,
    defi: null,
    ...sur,
  }
}

const CADEAU = lettre({ id: ID_A, titre: 'Bienvenue !', gains: { xp: 50, gemmes: 0 }, recuperee: false })
const MOT = lettre({ id: ID_B, titre: 'Un mot de Marcel', lien: '/reviser' })
const COACH = lettre({ id: ID_C, source: 'annonce', type: 'coach', titre: 'Entraînement jeudi', expediteur: 'Coach Karim', visage: { genre: 'coach' } })
const DEFI = lettre({
  id: ID_D,
  source: 'defi',
  type: 'ami',
  titre: 'Léa te défie !',
  lien: '/defi/jouer?mode=blitz',
  lienLibelle: 'Relever',
  expediteur: 'Léa',
  visage: { genre: 'joueur', id: ID_B, portrait: '6' },
  defi: { mode: 'blitz', sonScore: 800 },
})

function porte(sur: Partial<PorteCourrier> = {}): PorteCourrier {
  return {
    lire: vi.fn(async () => true),
    toutLire: vi.fn(async () => true),
    encaisser: vi.fn(async () => ({ ok: true, gains: [{ unite: 'xp' as const, montant: 50 }], raison: 'ok' as const })),
    toutRecuperer: vi.fn(async () => ({ ok: true, gains: [{ unite: 'xp' as const, montant: 50 }], raison: 'ok' as const, lettres: 1 })),
    relever: vi.fn(async () => ({ ok: true })),
    ...sur,
  }
}

function Badge() {
  const n = useNonLusCourrier()
  return <output data-testid="badge">{n ?? 'rien'}</output>
}

const tick = () => act(async () => {})

beforeEach(() => {
  celebrer.mockClear()
  toast.mockClear()
  push.mockClear()
})

describe('BoiteAuxLettres', () => {
  it('dit ce qui attend, et le magasin du bouton flottant suit', () => {
    render(
      <>
        <BoiteAuxLettres lettres={[CADEAU, MOT, COACH, DEFI]} disponible porte={porte()} />
        <Badge />
      </>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Courrier')
    expect(screen.getByText('4 non lues · 1 cadeau à récupérer')).toBeInTheDocument()
    expect(screen.getByTestId('badge')).toHaveTextContent('4')
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('ouvrir une lettre la marque lue, ici et au serveur', async () => {
    const p = porte()
    render(
      <>
        <BoiteAuxLettres lettres={[MOT]} disponible porte={p} />
        <Badge />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Un mot de Marcel/ }))
    await tick()
    expect(p.lire).toHaveBeenCalledWith(ID_B, 'courrier')
    expect(screen.getByText('Tout est lu')).toBeInTheDocument()
    expect(screen.getByTestId('badge')).toHaveTextContent('0')
    // Une seconde ouverture ne redemande rien.
    fireEvent.click(screen.getByRole('button', { name: /Un mot de Marcel/ }))
    await tick()
    expect(p.lire).toHaveBeenCalledTimes(1)
  })

  it('« Récupérer » demande au serveur et fait voler ce qu’il a VERSÉ', async () => {
    const p = porte({
      encaisser: vi.fn(async () => ({ ok: true, gains: [{ unite: 'xp' as const, montant: 100 }], raison: 'ok' as const })),
    })
    render(<BoiteAuxLettres lettres={[CADEAU]} disponible porte={p} />)
    fireEvent.click(screen.getByRole('button', { name: 'Récupérer' }))
    await tick()
    expect(p.encaisser).toHaveBeenCalledWith(ID_A)
    // L'écran affiche 50 (ce que la lettre promet) mais fait voler 100 (ce que
    // le serveur a versé, multiplicateur compris) : jamais l'inverse.
    expect(celebrer).toHaveBeenCalledWith([{ unite: 'xp', montant: 100 }], { xp: { x: 10, y: 10 } }, { vague: true })
    expect(screen.queryByRole('button', { name: 'Récupérer' })).not.toBeInTheDocument()
    expect(screen.getByText('Récupéré')).toBeInTheDocument()
    expect(screen.getByText('Tout est lu')).toBeInTheDocument()
  })

  it('un refus du serveur ne marque rien et prévient', async () => {
    const p = porte({ encaisser: vi.fn(async () => ({ ok: false, gains: [], raison: 'expiree' as const })) })
    render(<BoiteAuxLettres lettres={[CADEAU]} disponible porte={p} />)
    fireEvent.click(screen.getByRole('button', { name: 'Récupérer' }))
    await tick()
    expect(celebrer).not.toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith('Ce cadeau a expiré.', 'error')
    expect(screen.getByRole('button', { name: 'Récupérer' })).toBeInTheDocument()
  })

  it('« déjà versé » (deux onglets ouverts) : marqué récupéré, sans vol', async () => {
    const p = porte({ encaisser: vi.fn(async () => ({ ok: false, gains: [], raison: 'deja' as const })) })
    render(<BoiteAuxLettres lettres={[CADEAU]} disponible porte={p} />)
    fireEvent.click(screen.getByRole('button', { name: 'Récupérer' }))
    await tick()
    expect(celebrer).not.toHaveBeenCalled()
    expect(screen.getByText('Récupéré')).toBeInTheDocument()
  })

  it('les onglets filtrent et portent leur compte', () => {
    render(<BoiteAuxLettres lettres={[CADEAU, MOT, COACH, DEFI]} disponible porte={porte()} />)
    const onglets = screen.getByRole('tablist')
    expect(within(onglets).getByRole('tab', { name: /Coach/ })).toHaveTextContent('1')
    fireEvent.click(within(onglets).getByRole('tab', { name: /Amis/ }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Léa te défie !')).toBeInTheDocument()
    fireEvent.click(within(onglets).getByRole('tab', { name: /Marcel/ }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('« Relever » pose le défi puis emmène sur le mode', async () => {
    const p = porte()
    render(<BoiteAuxLettres lettres={[DEFI]} disponible porte={p} />)
    fireEvent.click(screen.getByRole('button', { name: 'Relever' }))
    await tick()
    expect(p.relever).toHaveBeenCalledWith(ID_D)
    expect(push).toHaveBeenCalledWith('/defi/jouer?mode=blitz')
  })

  it('« Tout lire et récupérer » annonce le total, paie tout, marque tout lu — les diffusions comprises', async () => {
    const p = porte()
    render(
      <>
        <BoiteAuxLettres lettres={[CADEAU, MOT, COACH]} disponible porte={p} />
        <Badge />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Tout lire et récupérer · 50 XP/ }))
    await tick()
    expect(p.toutRecuperer).toHaveBeenCalledWith([ID_C])
    expect(celebrer).toHaveBeenCalledWith([{ unite: 'xp', montant: 50 }], expect.anything(), { vague: true })
    expect(screen.getByTestId('badge')).toHaveTextContent('0')
    expect(screen.queryByRole('button', { name: /Tout/ })).not.toBeInTheDocument()
  })

  it('sans cadeau, le bouton du bas marque seulement comme lu', async () => {
    const p = porte()
    render(<BoiteAuxLettres lettres={[MOT, COACH]} disponible porte={p} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tout marquer comme lu' }))
    await tick()
    expect(p.toutLire).toHaveBeenCalledWith([ID_C])
    expect(p.toutRecuperer).not.toHaveBeenCalled()
    expect(celebrer).not.toHaveBeenCalled()
    expect(screen.getByText('Tout est lu')).toBeInTheDocument()
  })

  it('une boîte vide, et la boîte sans migration', () => {
    const { unmount } = render(<BoiteAuxLettres lettres={[]} disponible porte={porte()} />)
    expect(screen.getByText('Ta boîte est vide')).toBeInTheDocument()
    unmount()
    render(<BoiteAuxLettres lettres={[]} disponible={false} porte={porte()} />)
    expect(screen.getByText('La boîte n’est pas encore ouverte')).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })
})
