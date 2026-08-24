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

// LA SÉANCE D'ENTRAÎNEMENT (`deck`).
//
// L'invariant qui porte tout : un paquet plus court que le quiz est PARTIEL,
// donc il ne s'enregistre pas comme une note. Sans ça, une séance de 2
// questions réussies ferait passer un chapitre à 100 % de maîtrise — c'est
// exactement le piège que `lib/mastery` documente pour le rejeu des erreurs, et
// le tirage adaptatif emprunte le même chemin.

const TROIS: QuizQuestion[] = [
  ...QUESTIONS,
  {
    id: 'q3',
    question: 'Combien de côtés a un carré ?',
    options: ['4', '3'],
    correct_index: 0,
    explanation: 'Quatre côtés.',
    kind: 'qcm',
  },
] as unknown as QuizQuestion[]

describe('QuizPlayer — la séance d’entraînement', () => {
  it('ne sert que les questions du paquet, pas le quiz entier', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={TROIS}
        deck={[TROIS[2]]}
        record={false}
      />,
    )
    // La session tient en UNE question : le bouton final sort tout de suite.
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(
      screen.getByRole('button', { name: 'Voir mon score' }),
    ).toBeInTheDocument()
  })

  it('n’enregistre pas de note quand le paquet est plus court que le quiz', async () => {
    const { recordTestSession } = await import('@/app/test/actions')
    const { recordReviewAnswers } = await import('@/app/reviser/actions')
    vi.mocked(recordTestSession).mockClear()
    vi.mocked(recordReviewAnswers).mockClear()

    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={TROIS}
        deck={[TROIS[2]]}
      />,
    )
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    // Pas de note…
    expect(recordTestSession).not.toHaveBeenCalled()
    // … mais la répétition espacée est bien nourrie : c'est tout l'intérêt.
    expect(recordReviewAnswers).toHaveBeenCalled()
    expect(screen.getByText(/Séance d.entraînement/)).toBeInTheDocument()
  })

  it('enregistre la note quand le paquet EST le quiz entier', async () => {
    const { recordTestSession } = await import('@/app/test/actions')
    vi.mocked(recordTestSession).mockClear()

    const user = userEvent.setup()
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} deck={QUESTIONS} />,
    )
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    expect(recordTestSession).toHaveBeenCalledWith('quiz-test', 2, 2)
  })
})

// LES DEUX REPRISES DE L'ÉCRAN DE FIN.
//
// Deux défauts vus le 23/08/2026 sur la même rangée :
//   1. le second bouton portait `text-primary-foreground` — du BLANC hérité du
//      temps où le volet du score était sombre. Depuis qu'il porte la robe
//      CLAIRE de la matière, ce blanc s'écrivait sur du crème : le bouton était
//      rendu, cliquable, et lisible par personne ;
//   2. les deux étaient étirés en `w-full`, deux barres pleines qui pesaient
//      autant que le score au-dessus.

describe('QuizPlayer — les reprises de l’écran de fin', () => {
  /** Joue la session de 2 questions avec UNE erreur, et rend les 2 boutons. */
  const jusquAuBout = async (user: ReturnType<typeof userEvent.setup>) => {
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: '5' })) // faux
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))
    return {
      revoir: screen.getByRole('button', { name: /Revoir mes 1 erreur/ }),
      refaire: screen.getByRole('button', { name: /Refaire/ }),
    }
  }

  it('ne pose jamais une encre claire sans plaque pleine dessous', async () => {
    // LE DÉFAUT D'ORIGINE : le bouton portait `text-primary-foreground` (du
    // blanc) SANS fond à lui, donc écrit à même le volet clair de la matière —
    // rendu, cliquable, et lisible par personne. Le blanc est revenu depuis,
    // mais sur une plaque violette pleine : c'est le COUPLE encre + fond qu'il
    // faut garder soudé, pas l'encre seule qu'il faut interdire.
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    for (const bouton of [revoir, refaire]) {
      const encreClaire = /text-white|text-primary-foreground/.test(bouton.className)
      const plaquePleine = /bg-primary|bg-\[color-mix/.test(bouton.className)
      expect(encreClaire && !plaquePleine).toBe(false)
    }
  })

  it('ne les étire pas sur toute la largeur', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    expect(revoir.className).not.toContain('w-full')
    expect(refaire.className).not.toContain('w-full')
  })

  it('les pose CÔTE À CÔTE, sur une seule rangée', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    // Même parent, en ligne : la rangée ne doit jamais repasser en colonne.
    expect(revoir.parentElement).toBe(refaire.parentElement)
    expect(revoir.parentElement?.className).not.toContain('flex-col')
  })

  it('donne à chacun sa couleur, texte en blanc', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    // Les erreurs prennent le corail des pastilles ratées, assombri pour que
    // le blanc y passe le seuil AA (3,34:1 → 4,94:1 mesurés).
    expect(revoir.className).toContain('var(--destructive)')
    expect(revoir.className).toContain('text-white')
    // « Refaire » prend le violet de l'action, et son encre dédiée.
    expect(refaire.className).toContain('bg-primary')
    expect(refaire.className).toContain('text-primary-foreground')
    // Deux robes distinctes : c'est ce qui les rend reconnaissables d'un coup.
    expect(revoir.className).not.toBe(refaire.className)
  })

  it('dit « Refaire » en un seul mot', async () => {
    const { refaire } = await jusquAuBout(userEvent.setup())
    expect(refaire.textContent?.trim()).toBe('Refaire')
  })
})
