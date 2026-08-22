import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { duelGoal } from '@/lib/duel-cta'
import { buildRoster, trophyMap } from '@/lib/defi/roster'
import { buildSubjectLadders } from '@/lib/subject-rank'
import { buildDuelBoard, type DuelSubject } from '@/lib/defi/duel-board'

// LA BARRE D'ACTION : [MODES] [COMBAT] [MATIÈRE], plus sa ligne d'information.
//
// Ce que ces tests gardent :
//   1. COMBAT LANCE (un lien), il n'ouvre pas d'écran de sélection, et son
//      étiquette dit sur quoi il part — sa destination dépend d'un objet
//      voisin, la taire en ferait une loterie ;
//   2. il n'est JAMAIS mort : sans classé ouvert, il replie sur un jeu de la
//      matière et le nomme ;
//   3. le mot COMBAT est SEUL sur la plaque — la matière et le compteur de clan
//      vivent sur la ligne d'information, au-dessus, plus dans le bouton ;
//   4. la plaque Matière, la ligne d'information et la Route des trophées
//      partagent le même choix — c'est toute la raison du contexte ;
//   5. rien de ce qui a quitté le pixel n'a disparu des lecteurs d'écran (le
//      pourquoi du jour, l'objectif de clan).

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
import CombatMeta from '@/components/defi/CombatMeta'
import SubjectPlate from '@/components/defi/SubjectPlate'
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
      <CombatMeta goal={props.goal} onlineFriendName={props.onlineFriendName} />
      <CombatButton {...props} />
      <SubjectPlate />
    </DuelSubjectProvider>,
  )
}

const combat = () => screen.getByRole('link', { name: /^Combat —/ })

/** Ouvre la feuille de sélection et choisit une matière par son nom. */
async function pick(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole('button', { name: /^Matière du duel :/ }))
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: new RegExp(`^${name}`),
    }),
  )
}

// La matière choisie SURVIT à la session (localStorage) : sans ce ménage, le
// choix d'un test s'imposerait au suivant.
beforeEach(() => {
  window.localStorage.clear()
})

describe('le bouton COMBAT', () => {
  it('lance le duel classé de la matière choisie, sans écran intermédiaire', () => {
    renderRow(boardWith([], ['maths']))

    expect(combat()).toHaveAttribute('href', '/defi/programme/maths')
    // Le pixel ne porte QUE le mot ; l'étiquette dit ce qui se lance.
    expect(combat()).toHaveTextContent(/^COMBAT$/)
    expect(within(combat()).queryByText('Maths')).not.toBeInTheDocument()
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

  it('reste au seul mot COMBAT même quand un ami est en ligne', () => {
    renderRow(boardWith([], ['maths']), { onlineFriendName: 'Emma' })

    // La présence se dit par le point vert de la ligne d'information et par la
    // pulsation de la plaque ; le nom de l'ami reste aux lecteurs d'écran.
    expect(combat()).toHaveTextContent(/^COMBAT$/)
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
    // Le compteur a QUITTÉ le bouton : il vit sur la ligne d'information.
    expect(screen.getByText(/30\/50 pts · \d+ j/)).toBeInTheDocument()
    expect(combat()).toHaveTextContent(/^COMBAT$/)
  })

  it('n’invente aucun compteur sans semaine de clan', () => {
    renderRow(boardWith([], ['maths']), { goal: duelGoal(null, '2026-07-30') })

    expect(screen.queryByText(/pts ·/)).not.toBeInTheDocument()
  })
})

describe('la plaque Matière', () => {
  it('change la matière — et donc la destination du bouton', async () => {
    const user = userEvent.setup()
    // Anglais n'a pas de banque de questions : son classé reste fermé, donc la
    // destination change de nature en même temps que de matière.
    renderRow(boardWith([], ['maths']))

    expect(combat()).toHaveAttribute('href', '/defi/programme/maths')

    await pick(user, 'Anglais')

    expect(combat()).not.toHaveAttribute('href', '/defi/programme/maths')
    expect(
      screen.getByRole('button', { name: /^Matière du duel : Anglais/ }),
    ).toBeInTheDocument()
  })

  it('montre tout le plateau d’un coup — une matière, un tap', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])
    renderRow(board, {}, 'anglais')

    // Ce que la roulette à tambour, qui n'affichait qu'un cran, ne pouvait pas
    // faire : aller d'Anglais à SVT demandait six crans, il faut un tap.
    await user.click(screen.getByRole('button', { name: /^Matière du duel :/ }))
    const dialog = screen.getByRole('dialog')
    for (const entry of board) {
      expect(
        within(dialog).getByRole('button', {
          name: new RegExp(`^${entry.subject}`),
        }),
      ).toBeInTheDocument()
    }
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

  it('nomme la matière courante sur la ligne d’information, jamais sur le bouton', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])
    const last = board[board.length - 1].subject
    renderRow(board, {}, 'maths')

    // Deux occurrences attendues : la pastille de la ligne d'information, et la
    // région vivante qui annonce le changement aux lecteurs d'écran.
    expect(screen.getAllByText('Maths').length).toBeGreaterThan(0)
    expect(within(combat()).queryByText('Maths')).not.toBeInTheDocument()

    await pick(user, last)

    expect(screen.getAllByText(last).length).toBeGreaterThan(0)
    expect(combat()).toHaveTextContent(/^COMBAT$/)
    expect(combat().getAttribute('aria-label')).toContain(`en ${last}`)
  })

  it('rouvre sur la matière de la session précédente, pas sur celle du serveur', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])

    // Séance 1 : l'élève quitte « Maths » pour une autre matière.
    const first = renderRow(board, {}, 'maths')
    await pick(user, 'Anglais')
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
