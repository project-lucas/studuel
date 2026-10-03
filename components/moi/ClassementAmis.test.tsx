import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ClassementAmis from '@/components/moi/ClassementAmis'
import type { AmiClasse } from '@/lib/moi/classement-amis'

const joueur = (over: Partial<AmiClasse> & { id: string }): AmiClasse => ({
  nom: over.id,
  portrait: '',
  moi: false,
  trophees: 0,
  tropheesSemaine: 0,
  secondesSemaine: 0,
  secondes: 0,
  ...over,
})

const moi = joueur({ id: 'moi', nom: 'Sacha', moi: true, trophees: 120, tropheesSemaine: 8, secondesSemaine: 1800 })
const lea = joueur({ id: 'lea', nom: 'Léa', trophees: 300, tropheesSemaine: 12, secondesSemaine: 7800 })
const rayan = joueur({ id: 'rayan', nom: 'Rayan', trophees: 40, tropheesSemaine: 30, secondesSemaine: 9000 })

/** Les lignes du classement, de haut en bas : « Rayan », « Léa », « Toi ». */
const ordre = () =>
  [...document.querySelectorAll('ol > li > button')].map(
    (b) => /^\d+e?r? : (.+?) ·/.exec(b.getAttribute('aria-label') ?? '')?.[1],
  )

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ClassementAmis', () => {
  it('s’ouvre au temps de travail de la semaine, ma ligne marquée', () => {
    render(<ClassementAmis joueurs={[moi, lea, rayan]} complet />)
    expect(ordre()).toEqual(['Rayan', 'Léa', 'Toi'])
    expect(document.querySelector('button[data-moi]')?.textContent).toContain('Toi')
    expect(screen.getByText('Encore 1 h 40 de travail pour passer devant Léa.')).toBeTruthy()
  })

  it('les trophées reclassent tout le monde', () => {
    render(<ClassementAmis joueurs={[moi, lea, rayan]} complet />)
    fireEvent.click(screen.getByRole('button', { name: 'Trophées' }))
    expect(ordre()).toEqual(['Léa', 'Toi', 'Rayan'])
    expect(screen.getByText('Encore 181 trophées pour passer devant Léa.')).toBeTruthy()
  })

  it('écrit la valeur de chacun au bout de sa barre', () => {
    render(<ClassementAmis joueurs={[moi, lea, rayan]} complet />)
    const lignes = [...document.querySelectorAll('ol > li > button')].map((b) => b.textContent)
    expect(lignes[0]).toContain('2 h 30')
    expect(lignes[2]).toContain('30 min')
  })

  it('nomme le challenger : la meilleure semaine, même dernier au total', () => {
    render(<ClassementAmis joueurs={[moi, lea, rayan]} complet />)
    expect(screen.getByRole('button', { name: /Rayan.*challenger de la semaine/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Léa.*challenger/ })).toBeNull()
    expect(screen.getByText(/Challenger/)).toBeTruthy()
  })

  it('toucher une ligne dit son détail, la retoucher rend la phrase', () => {
    render(<ClassementAmis joueurs={[moi, lea, rayan]} complet />)
    const ligneLea = screen.getByRole('button', { name: /^2e : Léa/ })
    fireEvent.click(ligneLea)
    expect(screen.getByText('Léa · 300 trophées (+12 cette semaine) · 2 h 10 de travail cette semaine')).toBeTruthy()
    expect(ligneLea.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(ligneLea)
    expect(screen.getByText('Encore 1 h 40 de travail pour passer devant Léa.')).toBeTruthy()
  })

  it('seul : une invitation, pas de légende', () => {
    render(<ClassementAmis joueurs={[moi]} complet />)
    expect(screen.getByText('Ajoute un ami pour vous mesurer.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Mes amis' }).getAttribute('href')).toBe('/amis')
    expect(screen.queryByText(/Challenger/)).toBeNull()
  })

  it('sans la migration : le dit, et ne relit rien', () => {
    const fetchEspion = vi.spyOn(globalThis, 'fetch')
    render(<ClassementAmis joueurs={[moi]} complet={false} />)
    expect(screen.getByText('Le classement de tes amis arrive avec la prochaine mise à jour.')).toBeTruthy()
    expect(fetchEspion).not.toHaveBeenCalled()
  })
})
