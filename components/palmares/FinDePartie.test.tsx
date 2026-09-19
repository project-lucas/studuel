import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FinDePartie from '@/components/palmares/FinDePartie'
import { parseBilan } from '@/lib/palmares/bilan'

// Test d'ASSEMBLAGE de l'écran de fin commun aux modes de l'Arène.
//
// Trois défauts que les tests de lib/palmares ne voient pas, parce qu'ils
// naissent du câblage écran ↔ bilan serveur :
//   1. un « Nouveau record ! » affiché AVANT que le serveur ait répondu ;
//   2. l'échelle (rang, prochaine marche) dessinée sans bilan ;
//   3. le repli local qui invente une échelle quand la migration dort.

const fetchModeLadder = vi.fn<(mode: string, periode: string) => Promise<never[]>>(async () => [])

vi.mock('@/lib/sounds', () => ({
  sfx: { tap: vi.fn(), levelUp: vi.fn(), complete: vi.fn() },
  press: vi.fn(),
  buzz: vi.fn(),
}))
vi.mock('@/app/defi/palmares-actions', () => ({
  fetchModeLadder: (mode: string, periode: string) => fetchModeLadder(mode, periode),
  recordModeScore: vi.fn(),
}))
vi.mock('@/components/avatar/AvatarRender', () => ({
  default: () => <div data-testid="avatar" />,
}))
vi.mock('@/components/recompenses/PanneauRecompenses', () => ({
  default: () => <div data-testid="recompenses" />,
}))

const bilan = parseBilan({
  mode: 'blitz',
  score: 1200,
  plays: 4,
  last: 900,
  best_before: 1100,
  best: 1200,
  week_key: '2026-08-31',
  week_best_before: 900,
  week_best: 1200,
  week_rank_before: 12,
  week_total_before: 40,
  week_rank: 7,
  week_total: 41,
  all_rank: 30,
  all_total: 200,
  grade: '3e',
  next: { name: 'Léa', avatar: {}, score: 1370 },
  leader: { name: 'Nour', score: 2100, is_me: false },
})

const base = {
  mode: 'blitz' as const,
  score: 1200,
  titreAttente: 'Temps écoulé !',
  detail: '14/18 bonnes réponses',
  gains: [],
  saved: true,
  recordLocalAvant: 0,
  onRejouer: vi.fn(),
}

describe('FinDePartie', () => {
  it('reste neutre tant que le serveur n’a pas répondu — pas de record inventé', () => {
    render(<FinDePartie {...base} bilan={null} enAttente />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Temps écoulé !')
    expect(screen.queryByText(/Nouveau record/)).toBeNull()
    expect(screen.queryByLabelText('Ton échelle de la semaine')).toBeNull()
    expect(screen.getByText(/On compare avec ta dernière fois/)).toBeInTheDocument()
  })

  it('révèle le verdict, le mouvement sur l’échelle et la prochaine marche quand le bilan arrive', () => {
    const { rerender } = render(<FinDePartie {...base} bilan={null} enAttente />)
    rerender(<FinDePartie {...base} bilan={bilan} enAttente={false} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nouveau record !')
    expect(screen.getByText('+100 pts sur ton ancien record.')).toBeInTheDocument()
    const echelle = screen.getByLabelText('Ton échelle de la semaine')
    expect(echelle).toHaveTextContent('12e → 7e des 3e cette semaine.')
    expect(echelle).toHaveTextContent('Encore 170 pts pour dépasser Léa')
    expect(echelle).toHaveTextContent('sur 41')
  })

  it('déplie l’échelle à la demande, jamais avant', () => {
    render(<FinDePartie {...base} bilan={bilan} enAttente={false} />)
    expect(fetchModeLadder).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /Voir l’échelle/ }))
    expect(fetchModeLadder).toHaveBeenCalledWith('blitz', 'semaine')
  })

  it('sans serveur, le record LOCAL fait foi et aucune échelle n’apparaît', () => {
    render(<FinDePartie {...base} bilan={null} enAttente={false} recordLocalAvant={1100} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nouveau record !')
    expect(screen.queryByLabelText('Ton échelle de la semaine')).toBeNull()
  })

  it('sans serveur ni record local, il invite à se connecter', () => {
    render(<FinDePartie {...base} bilan={null} enAttente={false} />)
    expect(screen.getByText(/Ton record est gardé sur cet appareil/)).toBeInTheDocument()
  })

  it('Rejouer est le premier geste', () => {
    render(<FinDePartie {...base} bilan={bilan} enAttente={false} />)
    fireEvent.click(screen.getByRole('button', { name: /Rejouer/ }))
    expect(base.onRejouer).toHaveBeenCalledTimes(1)
  })
})
