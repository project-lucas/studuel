import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { gameBestKey } from '@/lib/jeux/records'

// Les jeux de l'arène, servis dans l'onglet Défis d'une matière. Ce qui se
// joue ici : la matière doit retrouver SES jeux (et seulement eux), une
// matière sans salon ne doit RIEN promettre, et le record personnel doit être
// affiché tel qu'il est stocké — c'est le chiffre qu'on vient battre.

vi.mock('@/lib/sounds', () => ({ sfx: { tap: vi.fn() } }))
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
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

import SubjectGames from '@/components/reviser/SubjectGames'

beforeEach(() => {
  window.localStorage.clear()
})

describe('SubjectGames', () => {
  it('sert les jeux de la matière, avec un lien vers chaque table', () => {
    render(<SubjectGames subject={{ slug: 'francais', name: 'Français' }} />)

    expect(screen.getByText('Duel d’orthographe')).toBeInTheDocument()
    expect(screen.getByText('Chasse à la faute')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Duel d’orthographe/ }),
    ).toHaveAttribute('href', '/defi/jeux/orthographe')
  })

  it('ne sert pas les jeux d’une autre matière', () => {
    render(<SubjectGames subject={{ slug: 'maths', name: 'Maths' }} />)

    expect(screen.getByText('Calcul mental éclair')).toBeInTheDocument()
    expect(screen.queryByText('Duel d’orthographe')).not.toBeInTheDocument()
  })

  it('ne promet rien pour une matière sans jeux', () => {
    const { container } = render(
      <SubjectGames subject={{ slug: 'emc', name: 'EMC' }} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('affiche le record personnel du jeu, et invite à en poser un sinon', () => {
    window.localStorage.setItem(gameBestKey('orthographe'), '1250')
    render(<SubjectGames subject={{ slug: 'francais', name: 'Français' }} />)

    expect(screen.getByText(/Record\s+1.250/)).toBeInTheDocument()
    // Les deux autres jeux de la matière n'ont jamais été joués.
    expect(screen.getAllByText('Aucun record')).toHaveLength(2)
  })
})
