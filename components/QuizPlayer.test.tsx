import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { QuizQuestion } from '@/lib/types'

// Premier test d'ASSEMBLAGE du projet : on joue une VRAIE session de quiz et on
// vérifie que l'écran de fin ne ment pas. Le défaut historique « 8/8 planté avec
// 2 bonnes réponses » ne pouvait être attrapé par aucun test de lib/ — il naît
// du câblage choix ↔ question ↔ score, pas d'une fonction pure.
//
// Périmètre isolé : le « chrome » (boutons de sortie, son, liens, badge, anneau)
// est stubbé ; les Server Actions ne sont jamais appelées ici (record={false}),
// mais on mocke leurs MODULES pour ne pas importer de code serveur dans jsdom.

vi.mock('@/lib/sounds', () => ({
  sfx: { complete: vi.fn(), correctCombo: vi.fn(), wrong: vi.fn() },
  buzz: vi.fn(),
  // Le composant Button (ui/button) joue press() à chaque clic.
  press: vi.fn(),
}))
vi.mock('@/app/test/actions', () => ({
  recordTestSession: vi.fn(async () => ({ saved: true })),
}))
vi.mock('@/app/reviser/actions', () => ({
  recordReviewAnswers: vi.fn(async () => {}),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/reviser',
}))
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
vi.mock('@/components/QuitGuardButton', () => ({ default: () => null }))
vi.mock('@/components/BackButton', () => ({ default: () => null }))
vi.mock('@/components/FlashcardPlayer', () => ({ SoundToggle: () => null }))
vi.mock('@/components/ComboBadge', () => ({ default: () => null }))
vi.mock('@/components/ProgressRing', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

import QuizPlayer from '@/components/QuizPlayer'

// Chaque question porte une explication : autoAdvanceDelay renvoie alors null,
// donc AUCUN enchaînement automatique — l'avancement est piloté au clic, sans
// minuteur, ce qui rend le test déterministe.
const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Capitale de la France ?',
    options: ['Paris', 'Lyon'],
    correct_index: 0,
    explanation: 'Paris est la capitale.',
    kind: 'qcm',
  },
  {
    id: 'q2',
    question: 'Combien font 2 + 2 ?',
    options: ['4', '5'],
    correct_index: 0,
    explanation: 'Deux plus deux font quatre.',
    kind: 'qcm',
  },
] as unknown as QuizQuestion[]

describe('QuizPlayer — l’écran de fin ne ment pas', () => {
  it('affiche le score RÉEL après une bonne et une mauvaise réponse (1/2)', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
      />,
    )

    // Q1 : bonne réponse, puis « Continuer ».
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    // Q2 : MAUVAISE réponse (on tape '5' alors que la réponse est '4').
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    // L'écran de fin doit compter EXACTEMENT 1 bonne réponse sur 2 — pas 2/2
    // (l'ancien défaut), pas 0/2. L'aria-label des pastilles porte le décompte.
    expect(
      screen.getByLabelText('1 bonne réponse sur 2'),
    ).toBeInTheDocument()
    expect(screen.getByText('Score du quiz')).toBeInTheDocument()
  })

  it('affiche 2/2 quand les deux réponses sont bonnes', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    expect(screen.getByLabelText('2 bonnes réponses sur 2')).toBeInTheDocument()
  })
})
