import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { QuizQuestion } from '@/lib/types'
import { AUTO_ADVANCE_MS } from '@/lib/juice'

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

// La feuille de la mascotte a d'abord été posée sur le seul anglais 3e, puis
// généralisée : elle porte désormais TOUT le retour après réponse, quelle que
// soit la matière — l'ancien bandeau en ligne n'existe plus.
describe('QuizPlayer — feuille de la mascotte (toutes matières)', () => {
  it('remplace le feedback en ligne par la feuille, avec la bonne réponse', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        subject="Anglais"
        gradeLevel="3e"
        record={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Lyon' }))

    // La feuille annonce la bonne réponse — l'ancien bandeau, jamais.
    expect(screen.getByText(/La bonne réponse/)).toBeInTheDocument()
    expect(screen.queryByText('❌ Pas tout à fait…')).not.toBeInTheDocument()
  })

  it('sert la feuille aux autres matières, et même sans matière du tout', async () => {
    // Le dossier pilote n'existe plus : ce qui se joue ici est qu'AUCUN quiz ne
    // retombe sur l'ancien bandeau, y compris un quiz personnel sans matière.
    for (const props of [{ subject: 'Mathématiques', gradeLevel: '5e' }, {}]) {
      const user = userEvent.setup()
      const vue = render(
        <QuizPlayer
          quizId="quiz-test"
          title="Test"
          questions={QUESTIONS}
          record={false}
          {...props}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Lyon' }))

      expect(screen.getByText(/La bonne réponse/)).toBeInTheDocument()
      expect(screen.queryByText('❌ Pas tout à fait…')).not.toBeInTheDocument()
      vue.unmount()
    }
  })

  it('n’enchaîne PAS tout seul : la feuille attend le tap', async () => {
    // Sans explication à lire, une bonne réponse enchaîne d'habitude seule
    // (AUTO_ADVANCE_MS). Avec la feuille, ce serait un aller-retour illisible.
    const sansExplication = QUESTIONS.map((q) => ({ ...q, explanation: null }))
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={sansExplication}
        subject="Anglais"
        gradeLevel="3e"
        record={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Paris' }))
    // Horloge réelle : les animations de la feuille (rAF) rendent les faux
    // minuteurs instables ici, et l'attente reste courte (AUTO_ADVANCE_MS).
    await act(async () => {
      await new Promise((r) => setTimeout(r, AUTO_ADVANCE_MS + 400))
    })

    // Toujours la question 1 : rien n'a filé sous les yeux de l'élève.
    expect(screen.getByText('Capitale de la France ?')).toBeInTheDocument()
  })

  // L'illustration monte avec la série. Le choix du rang est testé à part
  // (lib/quiz-feedback.test.ts) ; ce qui se joue ICI c'est le CÂBLAGE des deux
  // compteurs — et surtout la remise à zéro de celui des erreurs, qui est tout
  // le sel du gag : les cheveux de la mascotte repoussent.
  it('fait monter la série d’erreurs, puis la remet à zéro sur une bonne réponse', async () => {
    const user = userEvent.setup()
    // Trois questions : deux erreurs d'affilée, puis une bonne réponse.
    const trois = [...QUESTIONS, { ...QUESTIONS[0], id: 'q3' }] as unknown as QuizQuestion[]
    const { container } = render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={trois}
        subject="Anglais"
        gradeLevel="3e"
        record={false}
      />,
    )
    // L'image est décorative (aria-hidden) : le titre porte le sens, pas elle.
    const src = () => container.querySelector('img')?.getAttribute('src')

    await user.click(screen.getByRole('button', { name: 'Lyon' })) // faux
    expect(src()).toBe('/images/mascotte/reaction-mauvaise-1.webp')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: '5' })) // faux
    expect(src()).toBe('/images/mascotte/reaction-mauvaise-2.webp')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: 'Paris' })) // juste
    // Retour au premier rang du bon côté : la série d'erreurs est bien tombée.
    expect(src()).toBe('/images/mascotte/reaction-bonne-1.webp')
  })
})
