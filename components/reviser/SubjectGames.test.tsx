import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { palierStorageKey } from '@/lib/jeux/paliers'

// Les jeux de l'arène, servis dans l'onglet Défis d'une matière. Ce qui se
// joue ici : la matière doit retrouver SES jeux (et seulement eux), une
// matière sans salon ne doit RIEN promettre, les étoiles décrochées doivent
// s'afficher telles qu'elles sont stockées — c'est la collection qu'on vient
// compléter —, et un jeu réservé à Studuel+ doit porter son cadenas.

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

    expect(screen.getByText('Chasse à la faute')).toBeInTheDocument()
    expect(screen.getByText('Conjugaison éclair')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Chasse à la faute/ }),
    ).toHaveAttribute('href', '/defi/jeux/chasse-faute')
  })

  it('ne sert pas les jeux d’une autre matière', () => {
    render(<SubjectGames subject={{ slug: 'maths', name: 'Maths' }} />)

    expect(screen.getByText('Calcul mental éclair')).toBeInTheDocument()
    expect(screen.queryByText('Chasse à la faute')).not.toBeInTheDocument()
  })

  it('ne promet rien pour une matière sans jeux', () => {
    const { container } = render(
      <SubjectGames subject={{ slug: 'emc', name: 'EMC' }} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('affiche les étoiles décrochées sur le jeu, sur 15', () => {
    window.localStorage.setItem(
      palierStorageKey('chasse-faute'),
      JSON.stringify({ 1: { stars: 3, best: 12 }, 2: { stars: 2, best: 9 } }),
    )
    render(<SubjectGames subject={{ slug: 'francais', name: 'Français' }} premium />)

    expect(
      screen.getByRole('link', { name: /Chasse à la faute — .* 5 étoiles sur 15/ }),
    ).toBeInTheDocument()
    // L'autre jeu de la matière n'a pas encore d'étoile.
    expect(screen.getAllByRole('link', { name: /0 étoiles sur 15/ })).toHaveLength(1)
  })

  it('sans Studuel+ : un jeu ouvert, les autres sous cadenas vers la Boutique', () => {
    render(<SubjectGames subject={{ slug: 'francais', name: 'Français' }} />)

    expect(screen.getByRole('link', { name: /Chasse à la faute/ })).toHaveAttribute(
      'href',
      '/defi/jeux/chasse-faute',
    )
    const verrous = screen.getAllByRole('link', { name: /réservé à Studuel\+/ })
    expect(verrous).toHaveLength(1)
    for (const v of verrous) expect(v).toHaveAttribute('href', '/tresor')
  })
})
