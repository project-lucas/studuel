import { describe, it, expect, vi } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
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
  // Les classes, le clic et l'aria-label passent : depuis l'écran de fin en
  // XP, « Continuer » et « Quiz suivant » sont des LIENS habillés par Button
  // (asChild) — un mock qui les jetterait ferait passer une plaque pleine
  // pour un lien nu.
  default: ({
    children,
    href,
    ...rest
  }: React.ComponentProps<'a'> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
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
    // Le chiffre brut « 1 / 2 » a quitté l'écran : la PILULE de réussite
    // porte le pourcentage, et la carte « Questions maîtrisées » compte les
    // bonnes réponses de la manche (sans mémoire à lire : `maitrise` absente).
    expect(screen.getByText('50 %')).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: 'Questions maîtrisées' }),
    ).toHaveAttribute('aria-valuenow', '1')
    // Le compte vit dans la carte (le volet de correction le répète en bas).
    expect(
      within(screen.getByRole('region', { name: 'Questions maîtrisées' })).getByText('1/2'),
    ).toBeInTheDocument()
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
describe('QuizPlayer — la question à trous', () => {
  // La troisième forme, celle de Duolingo : on lit LA PHRASE, avec un manque au
  // milieu, et l'option touchée vient s'y poser. Elle ne coûte aucune migration
  // — c'est un QCM dont l'énoncé porte « ___ ».
  const TROU: QuizQuestion[] = [
    {
      id: 'q-trou',
      quiz_id: 'quiz-test',
      question: 'La capitale du Royaume-Uni est ___ depuis 1066.',
      kind: 'mcq',
      options: ['Londres', 'Dublin', 'Édimbourg', 'Cardiff'],
      correct_index: 0,
      explanation: null,
      position: 0,
    },
  ]

  const rendreTrou = () =>
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={TROU}
        record={false}
      />,
    )

  it('affiche la PHRASE, pas le souligné brut', () => {
    rendreTrou()
    // Les trois soulignés ne doivent jamais atteindre l'écran.
    expect(screen.queryByText(/___/)).not.toBeInTheDocument()
    expect(screen.getByText(/La capitale du Royaume-Uni est/)).toBeInTheDocument()
    expect(screen.getByText(/depuis 1066/)).toBeInTheDocument()
  })

  it('change la CONSIGNE : on complète, on ne choisit pas', () => {
    rendreTrou()
    expect(screen.getByText('Complète la phrase')).toBeInTheDocument()
    expect(screen.queryByText('Choisis la bonne réponse')).not.toBeInTheDocument()
  })

  it('annonce le creux vide au lecteur d’écran', () => {
    // Sans ça, la phrase s'entend en deux morceaux sans rien entre les deux.
    rendreTrou()
    expect(screen.getByText('blanc à compléter')).toBeInTheDocument()
  })

  it('POSE le mot choisi dans le creux', async () => {
    const user = userEvent.setup()
    rendreTrou()
    await user.click(screen.getByRole('button', { name: 'Londres' }))
    // Le mot apparaît DEUX fois : sur sa plaque de réponse et dans la phrase.
    expect(screen.getAllByText('Londres').length).toBeGreaterThan(1)
    expect(screen.queryByText('blanc à compléter')).not.toBeInTheDocument()
  })

  it('laisse un QCM ordinaire exactement comme avant', () => {
    // Les 3 300 questions du catalogue n'ont pas de trou : rien ne doit changer
    // pour elles. (`rendreQuestion` vit plus bas dans le fichier — on rend ici
    // directement, pour ne pas dépendre de l'ordre des blocs.)
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
      />,
    )
    expect(screen.getByText('Choisis la bonne réponse')).toBeInTheDocument()
    expect(screen.queryByText('blanc à compléter')).not.toBeInTheDocument()
  })
})

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

  it('ne propose PLUS « Je ne sais pas »', async () => {
    // Retiré le 01/09 à la demande. Ce qu'on perd est écrit dans QuizPlayer :
    // l'élève qui ne sait pas doit désormais tenter, et un coup de chance
    // apprend à la répétition espacée que la carte est sue.
    rendreQuestion()
    expect(
      screen.queryByRole('button', { name: 'Je ne sais pas' }),
    ).not.toBeInTheDocument()
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

  it('« Valider » est le bouton de la maison, violet, éteint comme allumé', async () => {
    // Un bouton désactivé doit rester reconnaissable comme bouton : c'est sa
    // saturation qui tombe, pas sa forme — et il ne change pas de robe en
    // s'allumant (il a été vert : un verdict posé sur une action).
    const user = userEvent.setup()
    rendreQuestion()
    const valider = () => screen.getByRole('button', { name: 'Valider' })
    expect(valider()).toBeDisabled()
    expect(valider().className).toContain('btn-chunky')
    expect(valider().className).toContain('bg-primary')
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    expect(valider()).toBeEnabled()
    expect(valider().className).toContain('btn-chunky')
    expect(valider().className).toContain('bg-primary')
    expect(valider().className).not.toContain('bg-success')
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
    const formeValider = ['btn-chunky', 'h-13', 'w-full', 'text-base'].filter((c) =>
      valider.className.includes(c),
    )
    expect(formeValider).toHaveLength(4)

    await user.click(valider)
    const continuer = screen.getByRole('button', { name: 'Continuer' })
    for (const classe of formeValider) {
      expect(continuer.className, classe).toContain(classe)
    }
  })

  it('ne met RIEN sous « Valider »', async () => {
    // C'est le mécanisme qui met « Valider » et « Continuer » au même pixel :
    // « Valider » doit être le DERNIER élément de sa colonne. « Je ne sais
    // pas » était dessous, et ses 48 px plus la gouttière poussaient
    // « Valider » 58 px plus haut que le « Continuer » qui allait le
    // remplacer — le bouton sautait sous le pouce à l'instant précis où il
    // change de rôle. Tout ce qu'on rajouterait là referait le défaut.
    const user = userEvent.setup()
    rendreQuestion()
    await user.click(screen.getByRole('button', { name: 'Paris' }))

    const valider = screen.getByRole('button', { name: 'Valider' })
    const fratrie = [...(valider.parentElement?.children ?? [])]
    expect(fratrie.at(-1)).toBe(valider)
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

  it('se joue sur le mur de l’app, en violet — plus de lavis de matière', () => {
    // La session prenait la robe de la matière (`robe-red` pour l'allemand),
    // et la teinte remontait jusque sur « Valider » et la barre. La couleur
    // d'une matière est une identité (la vignette dans l'angle), jamais un
    // rôle : ce qui se clique est violet, et le fond est celui de l'app.
    const { container } = render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        subjectColor="red"
        record={false}
      />,
    )
    expect(container.querySelector('.quiz-fond')).toBeNull()
    expect(container.querySelector('.robe-red')).toBeNull()
    // La robe violette reste posée pour `AnswerBoard`, qui lit `--jeu-accent`
    // pour cerner la réponse choisie.
    expect(container.querySelector('.robe-purple')).not.toBeNull()
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

/**
 * La case « Temps » de l'écran de fin. Elle portait une infobulle
 * (`title="Temps de révision…"`) tant qu'elle était une boîte à bandeau ; son
 * explication vit désormais derrière le « i » de la carte. On la retrouve donc
 * par son titre, et on lit la case entière.
 */
const caseTemps = (): HTMLElement => {
  const carte = screen.getByText('Temps').closest('li')
  if (!carte) throw new Error('case « Temps » introuvable')
  return carte
}

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
      revoir: screen.getByRole('button', { name: /Revoir mes/ }),
      // « Continuer » est un LIEN (il ramène d'où l'on vient) depuis que le
      // rejeu est passé en lien texte « Rejouer ce quiz ».
      refaire: screen.getByRole('link', { name: /Continuer/ }),
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

  // ⚠️ CES DEUX RÈGLES ONT ÉTÉ RETOURNÉES, ET C'EST VOULU.
  // Elles gardaient l'état d'avant : deux pilules étroites posées côte à côte.
  // L'écran de fin a été refait sur le modèle de Duolingo, dont le CONTINUER
  // occupe toute la largeur en bas — deux cibles à demi-largeur, c'est un pouce
  // qui vise ; une plaque pleine largeur, c'est un pouce qui pose. Si un jour
  // ces tests redeviennent rouges, la question à se poser est « a-t-on voulu
  // revenir à deux pilules ? », pas « comment les faire repasser au vert ? ».
  it('les ÉTIRE sur toute la largeur', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    expect(revoir.className).toContain('w-full')
    expect(refaire.className).toContain('w-full')
  })

  it('les EMPILE, le plus utile en premier', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    // Même parent, en colonne.
    expect(revoir.parentElement).toBe(refaire.parentElement)
    expect(revoir.parentElement?.className).toContain('flex-col')
    // « Revoir mes erreurs » est AU-DESSUS de « Continuer » : les questions
    // ratées sont le seul contenu utile qui reste après un quiz.
    const rangee = [...(revoir.parentElement?.children ?? [])]
    expect(rangee.indexOf(revoir)).toBeLessThan(rangee.indexOf(refaire))
  })

  it('met « Revoir » en violet plein et « Continuer » en contour', async () => {
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    // « Revoir mes erreurs » a été corail (on l'évitait : un avertissement),
    // puis vert (le succès — un verdict posé sur une action). Il porte le
    // violet de ce qui se clique, comme tout le reste de l'app.
    expect(revoir.className).toContain('bg-primary')
    expect(revoir.className).not.toContain('bg-success')
    expect(revoir.className).not.toContain('bg-destructive')
    // « Continuer », sous lui, en contour : une seule évidence par écran.
    expect(refaire.className).toContain('border-border')
    expect(refaire.className).not.toContain('bg-primary')
    // Deux reliefs distincts : c'est ce qui les rend reconnaissables d'un coup.
    expect(revoir.className).not.toBe(refaire.className)
  })

  it('nomme l’action en toutes lettres, avec le compte dedans', async () => {
    // Le libellé était raccourci à « À revoir » + une pastille de compte, pour
    // tenir dans une pilule étroite. Sur une plaque pleine largeur la place ne
    // manque plus, et « Revoir mes 3 erreurs » dit ce qui va se passer sans
    // qu'on ait à lire un chiffre posé à côté.
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    expect(refaire.textContent?.trim()).toBe('Continuer')
    expect(revoir.textContent).toContain('Revoir mes 1 erreur')
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

    const chrono = caseTemps()
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
    const premier = secondesDe(caseTemps().textContent)

    // On repart sur l'erreur, après une seconde de lecture de la correction.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1300))
    })
    await user.click(screen.getByRole('button', { name: /Revoir mes/ }))
    await repondre(user, '4')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))

    const second = secondesDe(caseTemps().textContent)
    expect(second).toBeGreaterThan(premier)
  })

  it('sont assez hauts pour un pouce', async () => {
    // 52 px : la taille xl du bouton de la maison, celle de « Valider » et de
    // « C'est parti ». Les pilules faisaient 44 px, le minimum tactile — assez
    // pour être touchées, pas pour être visées sans regarder.
    const { refaire } = await jusquAuBout(userEvent.setup())
    expect(refaire.className).toContain('h-13')
    expect(refaire.className).toContain('rounded-full')
  })

  it('REPLIE la correction, et l’ouvre au tap', async () => {
    // Elle s'affichait dépliée sous le score : autant de cartes que de
    // questions, à traverser avant d'atteindre quoi que ce soit d'autre. Elle
    // se consulte — elle ne s'impose pas.
    const user = userEvent.setup()
    await jusquAuBout(user)

    const volet = screen.getByRole('button', { name: /Voir la correction/ })
    expect(volet).toHaveAttribute('aria-expanded', 'false')
    // Rien de la correction n'est à l'écran tant qu'on n'a pas ouvert.
    expect(screen.queryByText(/Bonne réponse/)).not.toBeInTheDocument()

    await user.click(volet)
    expect(volet).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByText(/Bonne réponse/).length).toBeGreaterThan(0)
  })

  it('met la MASCOTTE en tête, et en grand', async () => {
    // Elle tenait 112 px dans un coin, à droite d'un chiffre de 48 px. C'est le
    // seul personnage de l'app : sur l'écran qu'on regarde le plus longtemps,
    // elle passe devant.
    await jusquAuBout(userEvent.setup())
    const mascotte = document.querySelector('img[src*="reaction-"]')
    expect(mascotte).not.toBeNull()
    expect(mascotte?.className).toContain('w-56')
  })

  it('portent le socle de la maison, et plus la pilule du duel', async () => {
    // Ils ont eu leur propre plaque (`.quiz-pilule`, reprise de l'arène) :
    // une famille de gros bouton de plus. Depuis le 23/09/2026, hors arène il
    // n'y en a qu'une — `Button` et son socle `.btn-chunky`.
    const { revoir, refaire } = await jusquAuBout(userEvent.setup())
    for (const bouton of [revoir, refaire]) {
      expect(bouton.className).toContain('btn-chunky')
      expect(bouton.className).not.toContain('quiz-pilule')
      expect(bouton.className).not.toContain('--pilule')
    }
  })
})

describe('QuizPlayer — l’écran de fin en XP', () => {
  const jouerToutJuste = async (user: ReturnType<typeof userEvent.setup>) => {
    await repondre(user, 'Paris')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await repondre(user, '4')
    await user.click(screen.getByRole('button', { name: 'Voir mon score' }))
  }

  it('TENTE le quiz suivant, avec l’XP promise dans sa pastille', async () => {
    // La mécanique de Wilgo : l'écran de fin n'est jamais une fin. Le bouton
    // principal mène au quiz d'après et annonce ce qu'il paye ; « Pas
    // maintenant » ramène d'où l'on vient.
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
        backHref="/reviser/svt"
        quizSuivant={{ href: '/test/q-suite', titre: 'La suite', xp: 30 }}
      />,
    )
    await jouerToutJuste(user)

    const suivant = screen.getByRole('link', { name: /Quiz suivant/ })
    expect(suivant).toHaveAttribute('href', '/test/q-suite')
    expect(suivant.textContent).toContain('+30 XP')
    // Même bouton pleine largeur que les autres boutons de fin, en violet.
    expect(suivant.className).toContain('w-full')
    expect(suivant.className).toContain('btn-chunky')
    expect(suivant.className).toContain('bg-primary')

    expect(screen.getByRole('link', { name: 'Pas maintenant' })).toHaveAttribute(
      'href',
      '/reviser/svt',
    )
    // Plus de « Continuer » quand il y a une suite : une seule évidence.
    expect(screen.queryByRole('link', { name: /Continuer/ })).toBeNull()
    // Le rejeu reste possible, en retrait.
    expect(
      screen.getByRole('button', { name: 'Rejouer ce quiz' }),
    ).toBeInTheDocument()
  })

  it('ne promet pas d’XP quand le chapitre n’en verse plus', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
        quizSuivant={{ href: '/test/q-suite', titre: 'La suite', xp: 0 }}
      />,
    )
    await jouerToutJuste(user)
    expect(
      screen.getByRole('link', { name: /Quiz suivant/ }).textContent,
    ).not.toContain('XP')
  })

  it('compte les acquises DÉJÀ en base plus celles de la manche, sans doublon', async () => {
    // q1 était déjà acquise ; la manche réussit q1 et q2 → 2 sur 4, pas 3.
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
        maitrise={{ acquisesIds: ['q1'], total: 4 }}
      />,
    )
    await jouerToutJuste(user)
    expect(
      within(screen.getByRole('region', { name: 'Questions maîtrisées' })).getByText('2/4'),
    ).toBeInTheDocument()
    const jauge = screen.getByRole('progressbar', { name: 'Questions maîtrisées' })
    expect(jauge).toHaveAttribute('aria-valuenow', '2')
    expect(jauge).toHaveAttribute('aria-valuemax', '4')
    expect(
      screen.getByText(/Réponds correctement à toutes les questions/),
    ).toBeInTheDocument()
  })

  it('déclare le quiz VALIDÉ quand toutes les questions sont maîtrisées', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
        maitrise={{ acquisesIds: [], total: 2 }}
      />,
    )
    await jouerToutJuste(user)
    const carte = screen.getByRole('region', { name: 'Questions maîtrisées' })
    expect(within(carte).getByText('2/2')).toBeInTheDocument()
    expect(within(carte).getByText(/Quiz validé/)).toBeInTheDocument()
  })

  it('« Rejouer ce quiz » repart de la première question', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    await jouerToutJuste(user)
    await user.click(screen.getByRole('button', { name: 'Rejouer ce quiz' }))
    expect(screen.getByText('Capitale de la France ?')).toBeInTheDocument()
  })
})

/**
 * LE CHRONO DE LA MANCHE (lib/quiz-chrono, 16/09/2026). Le quiz se joue comme
 * le duel : un budget pour tout le paquet, et à zéro la manche est abandonnée
 * SANS RIEN ÉCRIRE. C'est le câblage qu'aucun test de lib/ ne voit : que le
 * cadran affiche bien le budget, qu'une bonne réponse le fasse monter, et
 * surtout qu'à zéro les Server Actions ne soient jamais appelées.
 */
describe('QuizPlayer — le chrono de la manche', () => {
  it('affiche le budget du paquet au départ (deux questions : le plancher, 0:30)', () => {
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    expect(screen.getByRole('timer')).toHaveTextContent('0:30')
  })

  it('une bonne réponse rend trois secondes', async () => {
    const user = userEvent.setup()
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    await repondre(user, 'Paris')
    expect(screen.getByRole('timer')).toHaveTextContent('0:33')
  })

  it('à zéro : « Temps écoulé », et RIEN n’est enregistré', async () => {
    const { recordTestSession } = await import('@/app/test/actions')
    const { recordReviewAnswers } = await import('@/app/reviser/actions')
    vi.mocked(recordTestSession).mockClear()
    vi.mocked(recordReviewAnswers).mockClear()
    vi.useFakeTimers()
    try {
      render(<QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} />)
      await act(async () => {
        vi.advanceTimersByTime(31_000)
      })
      expect(screen.getByText('Temps écoulé !')).toBeInTheDocument()
      expect(recordTestSession).not.toHaveBeenCalled()
      expect(recordReviewAnswers).not.toHaveBeenCalled()
      // Et l'écran de fin n'existe pas : pas de score à afficher.
      expect(screen.queryByText('Voir la correction')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('« Réessayer » repart avec le budget plein', async () => {
    // Les faux minuteurs ne servent qu'à ATTEINDRE zéro ; le clic se joue en
    // temps réel (userEvent et les faux minuteurs s'attendent mutuellement).
    vi.useFakeTimers()
    render(
      <QuizPlayer quizId="quiz-test" title="Test" questions={QUESTIONS} record={false} />,
    )
    await act(async () => {
      vi.advanceTimersByTime(31_000)
    })
    vi.useRealTimers()
    expect(screen.getByText('Temps écoulé !')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(screen.getByRole('timer')).toHaveTextContent('0:30')
    expect(screen.getByText('Capitale de la France ?')).toBeInTheDocument()
  })

  it('chrono={false} garde le compteur de révision, sans cadran de manche', () => {
    render(
      <QuizPlayer
        quizId="quiz-test"
        title="Test"
        questions={QUESTIONS}
        record={false}
        chrono={false}
      />,
    )
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    expect(screen.getByTitle('Ton temps de révision total')).toBeInTheDocument()
  })
})
