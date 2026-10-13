// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
  it('dit le total et la bande — plus de rang : le rang est la division de ligue (13/10/2026)', () => {
    expect(libelleCompteTrophees(30, 90)).toBe('30 trophées, top 90 % de tous les élèves')
  })

  it('se passe de bande quand la base ne la donne pas', () => {
    expect(libelleCompteTrophees(30, null)).toBe('30 trophées')
    const sommet = libelleCompteTrophees(12_000, 5)
    expect(sommet).not.toContain('rang')
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

  it('retombe sur le mot « trophées » quand la base ne donne pas de bande — jamais un rang', () => {
    render(<CompteTropheesArene trophees={1240} top={null} cle={null} />)
    const compte = screen.getByRole('img')
    expect(compte.textContent).toContain('trophées')
    expect(compte.textContent).not.toMatch(/Bronze|Argent|Or |Platine|Diamant|Maître/)
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
