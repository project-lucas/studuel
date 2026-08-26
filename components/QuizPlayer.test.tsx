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
  // `tap` compris : c'est le son de la SÉLECTION d'une réponse, depuis que
  // choisir et valider sont deux gestes. Sans lui dans le mock, le clic sur une
  // option lève une TypeError et la sélection n'a jamais lieu — le symptôme
  // ressemble alors à un bug d'interface, pas à un mock incomplet.
  sfx: {
    complete: vi.fn(),
    correctCombo: vi.fn(),
    tap: vi.fn(),
    wrong: vi.fn(),
  },
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
vi.mock('@/components/ui/SoundToggle', () => ({ default: () => null }))
vi.mock('@/components/ComboBadge', () => ({ default: () => null }))
vi.mock('@/components/ProgressRing', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

import QuizPlayer from '@/components/QuizPlayer'

/**
 * Répondre à une question : choisir une option, PUIS valider.
 *
 * Le tap corrigeait autrefois d'un seul geste. Depuis le bouton « Valider », la
 * sélection est un brouillon révocable — tous les tests passent donc par ici.
 */
const repondre = async (
  user: ReturnType<typeof userEvent.setup>,
  option: string,
) => {
  await user.click(screen.getByRole('button', { name: option }))
  await user.click(screen.getByRole('button', { name: 'Valider' }))
}

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
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    // Q2 : MAUVAISE réponse (on tape '5' alors que la réponse est '4').
    await repondre(user, '5')
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

    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '4')
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

    await repondre(user, 'Lyon')

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

      await repondre(user, 'Lyon')

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

    await repondre(user, 'Paris')
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
    // La mascotte de la FEUILLE de retour, pas celle qui pose la question :
    // depuis que Marcel attend à côté de l'énoncé, `querySelector('img')`
    // ramenait sa tête. On vise donc les réactions, qui sont les seules à
    // porter un verdict.
    const src = () =>
      container
        .querySelector('img[src*="reaction-"]')
        ?.getAttribute('src')

    await repondre(user, 'Lyon') // faux
    expect(src()).toBe('/images/mascotte/reaction-mauvaise-1.webp')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '5') // faux
    expect(src()).toBe('/images/mascotte/reaction-mauvaise-2.webp')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, 'Paris') // juste
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
    await repondre(user, '4')
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
    await repondre(user, '4')
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
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '4')
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

// L'écran de question, refondu à la Duolingo : l'app s'efface, la progression
// passe en barre horizontale en haut, les réponses tombent sous le pouce.
describe('QuizPlayer — l’écran de question', () => {
  const rendreQuestion = () =>
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
      />,
    )

  it('montre la progression en BARRE, plus en anneau', () => {
    rendreQuestion()
    const barre = screen.getByRole('progressbar', {
      name: /Question 1 sur 2/,
    })
    // Une barre, pas un cercle : elle se lit sans être regardée et rend au
    // contenu la hauteur que l'anneau prenait au milieu de l'écran.
    expect(barre.className).toContain('rounded-full')
    expect(barre.className).toContain('flex-1')
    expect(barre.tagName).toBe('DIV')
  })

  it('la remplit vers la droite à mesure des réponses', async () => {
    const user = userEvent.setup()
    rendreQuestion()
    const largeur = () =>
      (
        screen.getByRole('progressbar').firstElementChild as HTMLElement
      ).style.width

    expect(largeur()).toBe('0%')
    await repondre(user, 'Paris')
    // Une réponse donnée sur deux questions : la barre est à la moitié.
    expect(largeur()).toBe('50%')
  })

  it('garde « Valider » ÉTEINT tant que rien n’est coché', async () => {
    const user = userEvent.setup()
    rendreQuestion()
    const valider = () => screen.getByRole('button', { name: 'Valider' })
    expect(valider()).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    expect(valider()).toBeEnabled()
  })

  it('ne corrige RIEN tant qu’on n’a pas validé', async () => {
    // Un doigt qui ripe coûtait la question, sans recours : le tap corrigeait
    // d'un seul geste. La sélection est maintenant un brouillon.
    const user = userEvent.setup()
    rendreQuestion()
    await user.click(screen.getByRole('button', { name: 'Lyon' }))
    expect(screen.queryByText(/La bonne réponse/)).not.toBeInTheDocument()
  })

  it('laisse CHANGER d’avis avant de valider', async () => {
    const user = userEvent.setup()
    rendreQuestion()
    await user.click(screen.getByRole('button', { name: 'Lyon' }))
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: 'Valider' }))
    // C'est le SECOND choix qui compte : la feuille félicite.
    expect(screen.queryByText(/La bonne réponse/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Continuer' }),
    ).toBeInTheDocument()
  })

  it('« Je ne sais pas » compte la question ratée et montre la réponse', async () => {
    // Un aveu, pas un abandon : le proposer évite le clic au hasard, qui
    // apprendrait à la répétition espacée que la carte est sue.
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Je ne sais pas' }))
    expect(screen.getByText(/La bonne réponse/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '4')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))
    // 1 sur 2 : la question passée est bien comptée fausse.
    expect(screen.getByLabelText('1 bonne réponse sur 2')).toBeInTheDocument()
  })

  it('montre l’ILLUSTRATION de la matière — l’écran n’était que teinté', () => {
    const { container } = render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        subjectColor="red"
        subjectSlug="allemand"
        record={false}
      />,
    )
    const vignette = container.querySelector('img[src*="vignettes"]')
    expect(vignette).not.toBeNull()
  })

  it('n’invente pas d’illustration pour un quiz sans matière', () => {
    const { container } = rendreQuestion()
    expect(container.querySelector('img[src*="vignettes"]')).toBeNull()
  })

  it('« Je ne sais pas » est une PLAQUE, pas un texte nu', async () => {
    // Il n'avait ni contour ni fond : rien ne disait qu'on pouvait le toucher,
    // et sa zone tactile s'arrêtait aux lettres.
    rendreQuestion()
    const bouton = screen.getByRole('button', { name: 'Je ne sais pas' })
    expect(bouton.className).toContain('quiz-plaque')
    expect(bouton.className).toContain('--plaque-bord')
  })

  it('« Valider » reste une plaque même ÉTEINT', async () => {
    // Un bouton désactivé doit rester reconnaissable comme bouton : c'est sa
    // saturation qui tombe, pas sa forme.
    const user = userEvent.setup()
    rendreQuestion()
    const valider = () => screen.getByRole('button', { name: 'Valider' })
    expect(valider()).toBeDisabled()
    expect(valider().className).toContain('quiz-plaque')
    expect(valider().className).toContain('--plaque-bord')
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    // Allumé : la robe change, la plaque reste.
    expect(valider().className).toContain('quiz-plaque')
    expect(valider().className).toContain('var(--success)')
  })

  it('« Valider » et « Continuer » ont la MÊME plaque et la même hauteur', async () => {
    // Chez Duolingo ce bouton ne bouge jamais : seuls son libellé et sa couleur
    // changent. Ici il avait sa propre géométrie dans la feuille de retour —
    // rayon, contour et hauteur différents — et sautait de quelques pixels à
    // l'instant où l'élève y pose déjà le pouce.
    const user = userEvent.setup()
    rendreQuestion()

    await user.click(screen.getByRole('button', { name: 'Paris' }))
    const valider = screen.getByRole('button', { name: 'Valider' })
    const formeValider = ['quiz-plaque', 'h-13', 'w-full'].filter((c) =>
      valider.className.includes(c),
    )
    expect(formeValider).toHaveLength(3)

    await user.click(valider)
    const continuer = screen.getByRole('button', { name: 'Continuer' })
    for (const classe of formeValider) {
      expect(continuer.className, classe).toContain(classe)
    }
  })

  it('fait poser la question par Marcel, dans une bulle', () => {
    const { container } = rendreQuestion()
    // Sa tête, celle de la nav : neutre et attentive. Surtout PAS une réaction
    // du jeu de dix — ce sont toutes des verdicts (pouce levé, grimace), et en
    // montrer une avant la réponse approuverait ou plaindrait d'avance.
    const mascotte = container.querySelector('img[src*="marcel"]')
    expect(mascotte).not.toBeNull()
    const src = mascotte?.getAttribute('src') ?? ''
    expect(src).not.toContain('reaction-')
  })

  it('teinte le fond à la MATIÈRE, pas seulement le liseré', () => {
    const { container } = render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        subjectColor="red"
        record={false}
      />,
    )
    const table = container.querySelector('.quiz-fond')
    expect(table).not.toBeNull()
    // La robe de la matière est bien celle demandée : sans elle, `--jeu-accent`
    // retomberait sur le violet et toutes les matières se ressembleraient.
    expect(table?.className).toContain('robe-red')
  })

  it('ancre les réponses en BAS de la colonne', () => {
    rendreQuestion()
    const plateau = screen.getByRole('group', { name: 'Réponses' })
    // `shrink-0` en fin de colonne flex : les réponses restent collées au bas
    // quelle que soit la hauteur de l'écran, au lieu de flotter au milieu avec
    // un vide sous elles.
    expect(plateau.className).toContain('shrink-0')
    // Et elles viennent APRÈS la question dans l'ordre du document.
    const question = screen.getByText('Capitale de la France ?')
    expect(
      question.compareDocumentPosition(plateau) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})

describe('QuizPlayer — les reprises de l’écran de fin', () => {
  /** Joue la session de 2 questions avec UNE erreur, et rend les 2 boutons. */
  const jusquAuBout = async (user: ReturnType<typeof userEvent.setup>) => {
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '5') // faux
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))
    return {
      revoir: screen.getByRole('button', { name: /À revoir/ }),
      refaire: screen.getByRole('button', { name: /Continuer/ }),
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

  it('donne à chacun sa couleur — et PLUS DE ROUGE sur « À revoir »', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    // Le corail se lisait comme un avertissement : on évitait le bouton, alors
    // que les questions ratées sont le seul contenu utile qui reste. Il prend
    // le VERT du succès.
    expect(revoir.className).toContain('var(--success)')
    expect(revoir.className).not.toContain('var(--destructive)')
    expect(revoir.className).toContain('text-white')
    // « Continuer » garde le violet, en version claire, avec l'encre marine.
    expect(refaire.className).toContain('var(--primary)')
    expect(refaire.className).toContain('text-foreground')
    // Deux robes distinctes : c'est ce qui les rend reconnaissables d'un coup.
    expect(revoir.className).not.toBe(refaire.className)
  })

  it('dit « Continuer » et « À revoir », courts et sur une ligne', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    expect(refaire.textContent?.trim()).toBe('Continuer')
    // Le compte des erreurs passe en PASTILLE, à côté du libellé : celui-ci ne
    // s'allonge plus avec lui (« Revoir mes 5 erreurs » repassait sur deux
    // lignes dès qu'on était à l'étroit).
    expect(revoir.textContent).toContain('À revoir')
    expect(revoir.textContent).toContain('1')
    expect(revoir.textContent).not.toContain('erreur')
  })

  it('FIGE le chrono au bilan — il ne doit pas grimper sous les yeux', async () => {
    // Le hook `useWorkTimer` continue de compter (l'élève qui lit la correction
    // travaille encore, et ces minutes vont au total du profil). Mais le chiffre
    // AFFICHÉ annonce « le temps que tu viens de faire » : s'il continue de
    // monter sur l'écran de score, il ne veut plus rien dire.
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={true}
      />,
    )
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '4')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    const chrono = screen.getByTitle(/Temps de révision/)
    const avant = chrono.textContent
    // Une bonne seconde de plus passe sur l'écran de score : le hook a eu le
    // temps de faire au moins un tic, donc de trahir une valeur non figée.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1300))
    })
    expect(chrono.textContent).toBe(avant)
  })

  it('CUMULE le temps quand on rejoue ses erreurs', async () => {
    // Refaire ses erreurs est du travail EN PLUS, pas du travail à la place :
    // le second bilan doit annoncer au moins autant que le premier. Il repartait
    // de zéro, et les minutes du quiz d'avant avaient l'air perdues — alors que
    // le total du profil, lui, les avait bien comptées.
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={true}
      />,
    )
    // Une bonne, une mauvaise : il reste une erreur à rejouer.
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '5')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    const secondesDe = (t: string | null) =>
      Number(/\+(\d+)s/.exec(t ?? '')?.[1] ?? -1)
    const premier = secondesDe(screen.getByTitle(/Temps de révision/).textContent)

    // On repart sur l'erreur, après une seconde de lecture de la correction.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1300))
    })
    await user.click(screen.getByRole('button', { name: /À revoir/ }))
    await repondre(user, '4')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    const second = secondesDe(screen.getByTitle(/Temps de révision/).textContent)
    expect(second).toBeGreaterThan(premier)
  })

  it('sont plus petits qu’avant — une pilule, pas une plaque', async () => {
    const { refaire } = await jusquAuBout(userEvent.setup())
    expect(refaire.className).toContain('h-11')
    // Le coin plein vient de `.quiz-pilule` (border-radius: 999px) ET de la
    // base du Button : les deux disent la même chose, aucune ne contredit.
    expect(refaire.className).toContain('rounded-full')
  })

  it('portent le traitement du bouton DUEL, pas le socle plat de la maison', async () => {
    // `.btn-chunky` pose UN trait sombre sous le bouton ; sous une carte claire
    // il se lit comme une ombre portée mal découpée. `.quiz-pilule` reprend la
    // plaque de l'arène : contour, dégradé, reflet interne, puis la tranche.
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    for (const bouton of [revoir, refaire]) {
      expect(bouton.className).toContain('quiz-pilule')
      // Le socle de la maison est neutralisé : deux profondeurs superposées
      // donneraient deux tranches de couleurs différentes.
      expect(bouton.className).toContain('[--btn-edge:transparent]')
      expect(bouton.className).not.toContain('shadow-md')
      // Chaque pilule porte ses trois teintes — sans elles, `.quiz-pilule`
      // n'aurait ni fond ni contour.
      expect(bouton.className).toContain('--pilule-haut')
      expect(bouton.className).toContain('--pilule-bas')
      expect(bouton.className).toContain('--pilule-bord')
    }
  })
})
