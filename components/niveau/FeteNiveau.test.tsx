import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { decouvertesAuNiveau } from '@/lib/decouverte/catalogue'

// LA FÊTE DE NIVEAU, à l'assemblage (refaite façon « Level Up » le 25/10/2026).
//
// Ce qui ne se vérifie qu'ici : que les RÉCOMPENSES (29/10/2026) montrent une
// carte par gain du passage (lib/niveau-recompenses, testé à part), que
// chaque écran ouvert mène à sa page avec `?decouvrir=`, que rien ne
// s'affiche quand un niveau ne rapporte rien, et que le coffre de palier garde
// son bouton d'or.

vi.mock('@/lib/sounds', () => ({
  sfx: { levelUp: vi.fn(), tap: vi.fn(), treasure: vi.fn(), coffreTremble: vi.fn() },
  buzz: vi.fn(),
}))
vi.mock('@/app/niveau-actions', () => ({
  ouvrirPalierNiveau: vi.fn(async () => ({ ok: true, gemmes: 10 })),
}))

import { FeteNiveauScene } from '@/components/niveau/FeteNiveau'
import { gainsDuPassage } from '@/lib/niveau-recompenses'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

function monter(level: number, depuis: number, ouverts: number[] = []) {
  return render(
    <FeteNiveauScene
      level={level}
      depuis={depuis}
      paliersOuverts={ouverts}
      xp={{ actuel: 120, plancher: 100, prochain: 300 }}
      onFermer={() => {}}
    />,
  )
}

describe('les récompenses', () => {
  it('montre une carte par gain : l’écran ouvert avec « Découvrir », le titre', () => {
    const ouverts = decouvertesAuNiveau(4)
    expect(ouverts.length).toBeGreaterThan(0)

    monter(4, 3)

    expect(screen.getByRole('heading', { name: /Récompenses/ })).toBeInTheDocument()
    for (const g of gainsDuPassage(3, 4)) expect(screen.getByText(g.nom)).toBeInTheDocument()
    expect(screen.getByText('Nouveau titre')).toBeInTheDocument()
    const liens = screen.getAllByRole('link', { name: 'Découvrir' })
    expect(liens.map((l) => l.getAttribute('href'))).toEqual(ouverts.map((d) => `${d.href}?decouvrir=${d.cle}`))
  })

  it('cumule les écrans quand plusieurs niveaux sont franchis d’un coup', () => {
    const ecrans = gainsDuPassage(1, 3).filter((g) => g.type === 'decouverte')
    expect(ecrans.length).toBe(decouvertesAuNiveau(2).length + decouvertesAuNiveau(3).length)
    monter(3, 1)
    expect(screen.getAllByRole('link', { name: 'Découvrir' })).toHaveLength(ecrans.length)
  })

  it('ne s’affiche pas quand le niveau ne rapporte rien', () => {
    expect(gainsDuPassage(13, 14)).toEqual([])
    monter(14, 13, [5, 10])
    expect(screen.queryByRole('heading', { name: /Récompenses/ })).not.toBeInTheDocument()
  })
})

describe('la scène', () => {
  it('dit le niveau atteint, l’avant et l’après', () => {
    monter(7, 6)
    expect(screen.getByRole('dialog', { name: 'Niveau 7 atteint' })).toBeInTheDocument()
    expect(screen.getByText('Niv. 6')).toBeInTheDocument()
    expect(screen.getByText('Niv. 7')).toBeInTheDocument()
    expect(screen.getByText('Niveau 7 !')).toBeInTheDocument()
  })

  it('annonce « +2 niveaux » quand on en saute deux', () => {
    monter(8, 6)
    expect(screen.getByText('+2 niveaux !')).toBeInTheDocument()
  })

  it('propose le coffre de palier à ouvrir, puis montre ce qui a été versé', async () => {
    monter(5, 4)
    expect(screen.getByText('Coffre du niveau 5')).toBeInTheDocument()
    const bouton = screen.getByRole('button', { name: /Ouvrir/ })
    await act(async () => {
      bouton.click()
    })
    await act(async () => void vi.advanceTimersByTime(50))
    expect(screen.getByText('Coffre du niveau 5 ouvert !')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('+10')
  })

  it('montre la distance au prochain coffre hors palier, une fois le coffre du 5 ouvert', () => {
    monter(7, 6, [5])
    expect(screen.getByText(/Prochain coffre au/)).toBeInTheDocument()
    expect(screen.getByText(/Encore 180 XP pour le niveau 8/)).toBeInTheDocument()
  })
})
