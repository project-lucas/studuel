import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { decouverteParCle } from '@/lib/decouverte/catalogue'
import FeuilleVerrou from './FeuilleVerrou'

describe('FeuilleVerrou', () => {
  it('dit le niveau, l’XP qui manque et mène à Réviser', () => {
    render(<FeuilleVerrou verrou={decouverteParCle('defi')} xp={40} onClose={() => {}} />)

    expect(screen.getByRole('dialog', { name: 'Se débloque au niveau 2' })).toBeInTheDocument()
    expect(screen.getByText('Encore 60 XP')).toBeInTheDocument()
    expect(screen.getByText('L’arène')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
    expect(screen.getByRole('link', { name: 'Aller réviser' })).toHaveAttribute('href', '/reviser')
  })

  it('dit « Tu y es ! » quand le niveau est atteint mais pas encore relu', () => {
    render(<FeuilleVerrou verrou={decouverteParCle('amis')} xp={300} onClose={() => {}} />)
    expect(screen.getByText('Tu y es !')).toBeInTheDocument()
  })

  it('ne rend rien tant qu’aucun verrou n’est ouvert', () => {
    render(<FeuilleVerrou verrou={null} xp={0} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
