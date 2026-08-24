import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QUESTIONS } from '@/lib/francais/niveau-orthographe'
import { NIVEAU_KEY, parseNiveau } from '@/lib/francais/niveau-store'

// Test d'ASSEMBLAGE du parcours : on joue les neuf questions et on vérifie que
// l'écran de fin ne ment pas, que « Je ne sais pas » est bien une porte de
// sortie (et pas une réponse comptée juste), et qu'aucune correction ne fuit
// avant la fin — c'est cette dernière propriété qui rend la mesure valable.

vi.mock('@/lib/sounds', () => ({
  sfx: { tap: vi.fn(), back: vi.fn(), complete: vi.fn() },
  press: vi.fn(),
}))

import NiveauOrthographe from '@/components/francais/NiveauOrthographe'

/** Ouvre l'intro puis répond aux 9 questions avec la stratégie donnée. */
const jouer = async (
  user: ReturnType<typeof userEvent.setup>,
  choix: (i: number) => 'juste' | 'faux' | 'sais-pas',
) => {
  await user.click(screen.getByRole('button', { name: /Commencer le test/ }))
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]
    const quoi = choix(i)
    if (quoi === 'sais-pas') {
      await user.click(screen.getByRole('button', { name: 'Je ne sais pas.' }))
      continue
    }
    const cible =
      quoi === 'juste'
        ? q.options[q.correct]
        : q.options[(q.correct + 1) % q.options.length]
    await user.click(screen.getByRole('button', { name: cible }))
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('NiveauOrthographe', () => {
  it('annonce 100 % après un sans-faute', async () => {
    const user = userEvent.setup()
    render(<NiveauOrthographe onClose={vi.fn()} />)
    await jouer(user, () => 'juste')

    expect(screen.getByText('Ton niveau en orthographe')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    // Rien à retravailler : la section ne s'invente pas un contenu vide.
    expect(screen.queryByText('À travailler')).toBeNull()
  })

  it('compte « Je ne sais pas » comme une non-réponse, jamais comme un point', async () => {
    const user = userEvent.setup()
    render(<NiveauOrthographe onClose={vi.fn()} />)
    await jouer(user, () => 'sais-pas')

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('À travailler')).toBeInTheDocument()
    // Le bilan dit que ce sont des TROUS, pas des erreurs.
    expect(screen.getByText(/jamais rencontrées/)).toBeInTheDocument()
  })

  it('ne dévoile aucune correction avant la dernière question', async () => {
    const user = userEvent.setup()
    render(<NiveauOrthographe onClose={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /Commencer le test/ }))

    const q0 = QUESTIONS[0]
    await user.click(
      screen.getByRole('button', {
        name: q0.options[(q0.correct + 1) % q0.options.length],
      }),
    )
    // On est passé à la question 2 sans un mot sur la précédente : ni astuce,
    // ni bonne réponse, ni score partiel.
    expect(screen.getByText(/Question 2 \/ 9/)).toBeInTheDocument()
    expect(screen.queryByText(q0.astuce)).toBeNull()
    expect(screen.queryByText('Ton niveau en orthographe')).toBeNull()
  })

  it('range le résultat pour la carte d’entrée', async () => {
    const user = userEvent.setup()
    render(<NiveauOrthographe onClose={vi.fn()} />)
    await jouer(user, () => 'juste')

    const garde = parseNiveau(window.localStorage.getItem(NIVEAU_KEY))
    expect(garde?.pourcentage).toBe(100)
    expect(garde?.niveau).toBe('expert')
    expect(garde?.jour).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('rend les règles ratées avec leur astuce', async () => {
    const user = userEvent.setup()
    render(<NiveauOrthographe onClose={vi.fn()} />)
    // Tout faux sauf la première : une seule règle doit remonter en moins.
    await jouer(user, (i) => (i === 0 ? 'juste' : 'faux'))

    expect(screen.getByText('À travailler')).toBeInTheDocument()
    expect(screen.getByText(QUESTIONS[1].regle)).toBeInTheDocument()
    expect(screen.getByText(QUESTIONS[1].astuce)).toBeInTheDocument()
    expect(screen.queryByText(QUESTIONS[0].regle)).toBeNull()
  })
})
