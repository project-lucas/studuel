// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rankFor } from '@/lib/rank'
import { cleEtatCompte } from '@/lib/defi/classement-arene'
import CompteTropheesArene, {
  formatTrophees,
  libelleCompteTrophees,
} from './CompteTropheesArene'

describe('formatTrophees', () => {
  it('écrit le compte à la française, avec une espace fine insécable', () => {
    expect(formatTrophees(30)).toBe('30')
    expect(formatTrophees(1240)).toBe('1 240')
  })
})

describe('libelleCompteTrophees', () => {
  it('dit le total, la bande, le rang et la place dans la division', () => {
    expect(libelleCompteTrophees(30, 90)).toBe(
      '30 trophées, top 90 % de tous les élèves, rang Bronze IV (30 sur 500 dans la division)',
    )
  })

  it('se passe de bande quand la base ne la donne pas, et de division au sommet', () => {
    expect(libelleCompteTrophees(30, null)).toBe(
      '30 trophées, rang Bronze IV (30 sur 500 dans la division)',
    )
    const sommet = libelleCompteTrophees(12_000, 5)
    expect(sommet).toContain('rang Maître')
    expect(sommet).not.toContain('division')
  })
})

describe('CompteTropheesArene', () => {
  // « Moins de mouvement » : les chiffres se posent sans fête — c'est le chemin
  // qui se teste sans rideau ni horloge.
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })
  afterEach(() => {
    window.localStorage.clear()
  })

  it('montre la coupe, le nombre en or et la bande en jaune — et n’est pas un bouton', () => {
    render(<CompteTropheesArene trophees={1240} top={85} cle={null} />)

    const compte = screen.getByRole('img', { name: /1240 trophées/ })
    expect(compte.querySelector('img')?.getAttribute('src')).toContain(
      '/images/defi/icones/trophees-v3',
    )
    expect(compte.textContent).toContain('1 240')
    expect(compte.textContent).toContain('Top 85 %')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('retombe sur le rang quand la base ne donne pas de bande', () => {
    render(<CompteTropheesArene trophees={1240} top={null} cle={null} />)
    expect(screen.getByRole('img').textContent).toContain(rankFor(1240).label)
  })

  it('mémorise ce qu’il a montré, sous la clé de l’élève', () => {
    const cle = cleEtatCompte('eleve-1')
    render(<CompteTropheesArene trophees={38} top={85} cle={cle} />)
    expect(JSON.parse(window.localStorage.getItem(cle) ?? 'null')).toEqual({
      trophees: 38,
      top: 85,
    })
  })
})
