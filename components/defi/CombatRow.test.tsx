import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { duelGoal } from '@/lib/duel-cta'
import { buildRoster, trophyMap } from '@/lib/defi/roster'
import { buildSubjectLadders } from '@/lib/subject-rank'
import { buildDuelBoard, type DuelSubject } from '@/lib/defi/duel-board'

// LA RANGÉE DE COMBAT après la fusion : [Modes] [COMBAT] [roulette de matières].
//
// Ce que ces tests gardent :
//   1. COMBAT LANCE (un lien), il n'ouvre plus d'écran de sélection, et il dit
//      sur quoi il part — sa destination dépend d'un objet voisin, la taire en
//      ferait une loterie ;
//   2. il n'est JAMAIS mort : sans classé ouvert, il replie sur un jeu de la
//      matière et le nomme ;
//   3. la roulette et la Route des trophées partagent le même choix — c'est
//      toute la raison du contexte ;
//   4. rien de ce qui a quitté le pixel faute de place n'a disparu des lecteurs
//      d'écran (le pourquoi du jour, l'objectif de clan).

vi.mock('@/lib/sounds', () => ({
  sfx: { battle: vi.fn(), tap: vi.fn(), back: vi.fn() },
}))
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

import CombatButton from '@/components/defi/CombatButton'
import SubjectDial from '@/components/defi/SubjectDial'
import TrophyRoadSheet from '@/components/defi/TrophyRoadSheet'
import DuelSubjectProvider from '@/components/defi/DuelSubjectProvider'

const READY = { programmeReady: new Set(['maths', 'histoire-geo']) }

/** Un plateau où seules les matières citées sont ouvertes au classé. */
function boardWith(
  rows: { subject: string; gameId: string; trophies: number }[],
  unlocked: string[],
): DuelSubject[] {
  const roster = buildRoster(trophyMap(rows), READY)
  return buildDuelBoard(
    roster,
    buildSubjectLadders({
      subjects: roster.map((e) => ({
        subject: e.subject,
        slug: e.slug,
        emoji: e.emoji,
      })),
      rows,
      unlockedSlugs: new Set(unlocked),
    }),
  )
}

function renderRow(
  board: DuelSubject[],
  props: React.ComponentProps<typeof CombatButton> = {},
  initialSlug = 'maths',
) {
  return render(
    <DuelSubjectProvider board={board} initialSlug={initialSlug}>
      <CombatButton {...props} />
      <SubjectDial />
    </DuelSubjectProvider>,
  )
}

const combat = () => screen.getByRole('link', { name: /^Combat —/ })

// La matière choisie SURVIT à la session (localStorage) : sans ce ménage, le
// choix d'un test s'imposerait au suivant.
beforeEach(() => {
  window.localStorage.clear()
})

describe('le bouton COMBAT', () => {
  it('lance le duel classé de la matière choisie, sans écran intermédiaire', () => {
    renderRow(boardWith([], ['maths']))

    expect(combat()).toHaveAttribute('href', '/defi/programme/maths')
    // Le pixel ne porte QUE la matière ; l'étiquette dit ce qui se lance.
    expect(within(combat()).getByText('Maths')).toBeInTheDocument()
    expect(combat().getAttribute('aria-label')).toContain(
      'Duel classé en Maths',
    )
  })

  it('replie sur un jeu de la matière — et le nomme — quand le classé est fermé', () => {
    renderRow(boardWith([], []))

    const cta = combat()
    expect(cta.getAttribute('href')).toMatch(/^\/defi\/jeux\//)
    // Il ne promet jamais le classé quand ce n'est pas le classé.
    expect(cta.getAttribute('aria-label')).not.toContain('Duel classé')
    expect(cta.getAttribute('aria-label')).toContain('en Maths')
  })

  it('garde la matière sur la sous-ligne même quand un ami est en ligne', () => {
    renderRow(boardWith([], ['maths']), { onlineFriendName: 'Emma' })

    // La sous-ligne appartient à la matière : la présence se dit par le point
    // vert et la pulsation, et son nom reste pour les lecteurs d'écran.
    expect(within(combat()).getByText('Maths')).toBeInTheDocument()
    expect(combat().getAttribute('aria-label')).toContain('Emma est en ligne')
    expect(combat().getAttribute('aria-label')).toContain(
      'Duel classé en Maths',
    )
  })

  it('garde le pourquoi du jour et l’objectif de clan pour les lecteurs d’écran', () => {
    renderRow(boardWith([], ['maths']), {
      reason: 'Contrôle dans 3 jours',
      // 2026-07-30 = un jeudi : il reste des jours avant la clôture du dimanche.
      goal: duelGoal(30, '2026-07-30'),
    })

    const label = combat().getAttribute('aria-label') ?? ''
    expect(label).toContain('Contrôle dans 3 jours')
    expect(label).toContain('30 points sur 50')
    expect(screen.getByText(/30\/50 pts · \d+ j/)).toBeInTheDocument()
  })

  it('n’invente aucun compteur sans semaine de clan', () => {
    renderRow(boardWith([], ['maths']), { goal: duelGoal(null, '2026-07-30') })

    expect(screen.queryByText(/pts ·/)).not.toBeInTheDocument()
  })
})

describe('la roulette de matières', () => {
  it('change la matière — et donc la destination du bouton', async () => {
    const user = userEvent.setup()
    // Espagnol est ouvert mais n'a pas de banque : son classé reste fermé, donc
    // la destination change de nature en même temps que de matière.
    renderRow(boardWith([], ['maths']))

    expect(combat()).toHaveAttribute('href', '/defi/programme/maths')

    await user.click(screen.getByRole('button', { name: /Matière suivante/ }))

    expect(combat()).not.toHaveAttribute('href', '/defi/programme/maths')
    expect(
      screen.getByRole('button', { name: /^Matière du duel : /i }),
    ).toBeInTheDocument()
  })

  it('range les matières par ordre alphabétique', () => {
    const board = boardWith([], [])
    renderRow(board)

    expect(board.map((e) => e.subject)).toEqual([
      'Anglais',
      'Espagnol',
      'Français',
      'Histoire-Géo',
      'Maths',
      'Physique-Chimie',
      'SVT',
    ])
  })

  it('boucle : reculer depuis la première matière mène à la dernière', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])
    renderRow(board, {}, board[0].slug)

    await user.click(screen.getByRole('button', { name: /Matière précédente/ }))

    expect(
      screen.getByRole('button', { name: /^Matière du duel :/ }),
    ).toHaveAccessibleName(new RegExp(board[board.length - 1].subject))
  })

  it('rouvre sur la matière de la session précédente, pas sur celle du serveur', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])

    // Séance 1 : l'élève quitte « Maths » pour la matière suivante.
    const first = renderRow(board, {}, 'maths')
    await user.click(screen.getByRole('button', { name: /Matière suivante/ }))
    const chosen = screen
      .getByRole('button', { name: /^Matière du duel :/ })
      .getAttribute('aria-label')
    first.unmount()

    // Séance 2 : le serveur propose encore « Maths » (chapitre en cours), mais
    // le choix du joueur passe devant.
    renderRow(board, {}, 'maths')

    expect(
      screen.getByRole('button', { name: /^Matière du duel :/ }),
    ).toHaveAccessibleName(chosen as string)
    expect(chosen).not.toContain('Maths,')
  })
})

describe('la Route des trophées', () => {
  const MATHS = [
    { subject: 'maths', gameId: 'calcul-mental', trophies: 890 },
    { subject: 'maths', gameId: 'compte-est-bon', trophies: 350 },
  ]

  function openRoad(board: DuelSubject[]) {
    return render(
      <DuelSubjectProvider board={board} initialSlug="maths">
        <TrophyRoadSheet />
      </DuelSubjectProvider>,
    )
  }

  it('annonce le total dans l’étiquette de son bouton', () => {
    openRoad(boardWith(MATHS, ['maths']))

    expect(screen.getByRole('button').getAttribute('aria-label')).toContain(
      '1240 trophées',
    )
  })

  it('détaille chaque jeu avec le gain de sa prochaine victoire', async () => {
    const user = userEvent.setup()
    openRoad(boardWith(MATHS, ['maths']))
    await user.click(screen.getByRole('button', { name: /route des trophées/i }))

    const dialog = screen.getByRole('dialog')
    // Le jeu monté à 890 ne rapporte plus que +2, le jeu neuf en rapporte 10 :
    // c'est l'écart que l'élève doit pouvoir lire d'un coup d'œil.
    expect(within(dialog).getByText('890')).toBeInTheDocument()
    expect(within(dialog).getAllByText('+2').length).toBeGreaterThan(0)
    expect(within(dialog).getAllByText('+10').length).toBeGreaterThan(0)
  })

  it('porte le rang de la matière — le module qu’elle a absorbé', async () => {
    const user = userEvent.setup()
    openRoad(boardWith(MATHS, ['maths']))
    await user.click(screen.getByRole('button', { name: /route des trophées/i }))

    const dialog = screen.getByRole('dialog')
    // 1240 trophées en maths : le blason et la division doivent s'y lire.
    expect(within(dialog).getByText(/Argent|Bronze|Or/)).toBeInTheDocument()
    expect(
      within(dialog).getByRole('progressbar', { name: /progression vers/i }),
    ).toBeInTheDocument()
  })

  it('explique le barème et les conditions, chiffres à l’appui', async () => {
    const user = userEvent.setup()
    openRoad(boardWith(MATHS, ['maths']))
    await user.click(screen.getByRole('button', { name: /route des trophées/i }))

    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole('heading', { name: /comment on gagne/i }),
    ).toBeInTheDocument()
    // La bande du débutant, celle qui ne coûte rien, doit être lisible en clair.
    expect(within(dialog).getByText('0 – 99')).toBeInTheDocument()
    expect(within(dialog).getByText(/ouvrir le duel classé/i)).toBeInTheDocument()
  })

  it('dit pourquoi le classé est fermé, sans confondre les deux verrous', async () => {
    const user = userEvent.setup()
    openRoad(boardWith(MATHS, []))
    await user.click(screen.getByRole('button', { name: /route des trophées/i }))

    expect(
      within(screen.getByRole('dialog')).getByText(/termine un chapitre/i),
    ).toBeInTheDocument()
  })
})
