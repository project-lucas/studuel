import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { duelGoal } from '@/lib/duel-cta'

// La rangée de combat de l'arène : le bouton d'or au centre, la tuile Classé à
// son flanc. Depuis qu'ils sont sur UNE seule ligne, l'écran a perdu de la
// place — plusieurs informations ont quitté le pixel pour l'`aria-label` (la
// règle du classé) ou cèdent leur ligne à plus urgent (la raison du chapitre
// s'efface quand un ami est en ligne). Ces tests gardent exactement ça : rien
// de ce qui a quitté l'écran ne doit disparaître AUSSI des lecteurs d'écran.

vi.mock('@/lib/sounds', () => ({ sfx: { battle: vi.fn(), tap: vi.fn() } }))
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import Duel90Cta from '@/components/defi/Duel90Cta'
import MatchClasseCta from '@/components/defi/MatchClasseCta'

describe('Duel90Cta', () => {
  it('affiche la raison du chapitre en sous-ligne', () => {
    render(<Duel90Cta reason="Contrôle dans 3 jours" />)

    expect(screen.getByText('DUEL 90 s')).toBeInTheDocument()
    expect(screen.getByText('Contrôle dans 3 jours')).toBeInTheDocument()
  })

  it('retombe sur le chapitre en cours quand aucune raison n’est connue', () => {
    render(<Duel90Cta />)

    expect(screen.getByText('Sur ton chapitre en cours')).toBeInTheDocument()
  })

  it('laisse l’ami en ligne prendre la sous-ligne, sans perdre la raison pour les lecteurs d’écran', () => {
    render(<Duel90Cta reason="Contrôle dans 3 jours" onlineFriendName="Emma" />)

    expect(screen.getByText('Emma est en ligne')).toBeInTheDocument()
    expect(screen.queryByText('Contrôle dans 3 jours')).not.toBeInTheDocument()

    const label = screen.getByRole('link').getAttribute('aria-label') ?? ''
    expect(label).toContain('contrôle dans 3 jours')
    expect(label).toContain('Emma est en ligne')
  })

  it('porte le compteur de clan et son échéance quand la semaine existe', () => {
    // 2026-07-30 = un jeudi : il reste des jours avant la clôture du dimanche.
    const goal = duelGoal(30, '2026-07-30')
    render(<Duel90Cta goal={goal} />)

    expect(screen.getByText(/30\/50 pts · \d+ j/)).toBeInTheDocument()
    expect(screen.getByRole('link').getAttribute('aria-label')).toContain(
      '30 points sur 50',
    )
  })

  it('n’invente aucun compteur sans semaine de clan', () => {
    render(<Duel90Cta goal={duelGoal(null, '2026-07-30')} />)

    expect(screen.queryByText(/pts ·/)).not.toBeInTheDocument()
  })
})

describe('MatchClasseCta', () => {
  it('garde la règle du classé dans son étiquette, faute de place dans la tuile', () => {
    render(<MatchClasseCta />)

    const link = screen.getByRole('link', { name: /match classé/i })
    expect(link).toHaveAttribute('href', '/defi/jouer?mode=ranked')
    expect(link.getAttribute('aria-label')).toContain('+30')
    expect(link.getAttribute('aria-label')).toContain('−20')
    expect(screen.getByText('Classé')).toBeInTheDocument()
  })
})
