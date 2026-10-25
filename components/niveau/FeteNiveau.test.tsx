import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { decouvertesAuNiveau } from '@/lib/decouverte/catalogue'

// LA FÊTE DE NIVEAU, à l'assemblage (refaite façon « Level Up » le 25/10/2026).
//
// Ce qui ne se vérifie qu'ici : que la section « Débloqué » lit bien le
// catalogue des découvertes pour le niveau franchi (et tous les niveaux
// sautés d'un coup), que chaque nouveauté mène à sa page avec `?decouvrir=`,
// que rien ne s'affiche quand un niveau n'ouvre rien, et que le coffre de
// palier garde son bouton d'or.

vi.mock('@/lib/sounds', () => ({
  sfx: { levelUp: vi.fn(), tap: vi.fn(), treasure: vi.fn() },
  buzz: vi.fn(),
}))
vi.mock('@/app/niveau-actions', () => ({
  ouvrirPalierNiveau: vi.fn(async () => ({ ok: true, gemmes: 10 })),
}))

import { FeteNiveauScene, nouveautesEntre } from '@/components/niveau/FeteNiveau'

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
      levelTitle="Apprenti"
      paliersOuverts={ouverts}
      xp={{ actuel: 120, plancher: 100, prochain: 300 }}
      onFermer={() => {}}
    />,
  )
}

describe('la section « Débloqué »', () => {
  it('liste ce que le niveau ouvre, avec un bouton « Découvrir » vers la page et sa clé', () => {
    const attendues = decouvertesAuNiveau(2)
    expect(attendues.length).toBeGreaterThan(0)

    monter(2, 1)

    expect(screen.getByRole('heading', { name: /Débloqué/ })).toBeInTheDocument()
    for (const d of attendues) {
      expect(screen.getByText(d.nom)).toBeInTheDocument()
    }
    const liens = screen.getAllByRole('link', { name: 'Découvrir' })
    expect(liens.map((l) => l.getAttribute('href'))).toEqual(
      attendues.map((d) => `${d.href}?decouvrir=${d.cle}`),
    )
  })

  it('cumule les nouveautés quand plusieurs niveaux sont franchis d’un coup', () => {
    const attendues = nouveautesEntre(1, 3)
    expect(attendues.map((d) => d.cle)).toEqual([
      ...decouvertesAuNiveau(2).map((d) => d.cle),
      ...decouvertesAuNiveau(3).map((d) => d.cle),
    ])
    monter(3, 1)
    expect(screen.getAllByRole('link', { name: 'Découvrir' })).toHaveLength(attendues.length)
  })

  it('ne s’affiche pas quand le niveau n’ouvre rien', () => {
    expect(decouvertesAuNiveau(9)).toEqual([])
    monter(9, 8)
    expect(screen.queryByRole('heading', { name: /Débloqué/ })).not.toBeInTheDocument()
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
