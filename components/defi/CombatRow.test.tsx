import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { duelGoal } from '@/lib/duel-cta'
import { buildRoster, trophyMap } from '@/lib/defi/roster'
import { buildSubjectLadders } from '@/lib/subject-rank'
import { buildDuelBoard, type DuelSubject } from '@/lib/defi/duel-board'

// LA BARRE D'ACTION : [MODES] [DUEL] [MATIÈRE].
//
// Ce que ces tests gardent :
//   1. DUEL ouvre la RECHERCHE D'ADVERSAIRE (un bouton, plus un lien) : il ne
//      navigue plus lui-même, le rideau s'en charge. Son étiquette dit sur quoi
//      il part — sa destination dépend d'un objet voisin, la taire en ferait
//      une loterie ;
//   2. il n'est JAMAIS mort : sans classé ouvert, il replie sur un jeu de la
//      matière et le nomme ;
//   3. le mot DUEL est SEUL sur la plaque — la matière et le compteur de clan
//      vivent sur la ligne d'information, au-dessus, plus dans le bouton ;
//   4. la plaque Matière, le bouton et la Route des trophées partagent le même
//      choix de matière — c'est toute la raison du contexte ;
//   5. rien de ce qui a quitté le pixel n'a disparu des lecteurs d'écran (le
//      pourquoi du jour, l'objectif de clan).

vi.mock('@/lib/sounds', () => ({
  sfx: { battle: vi.fn(), tap: vi.fn(), back: vi.fn() },
}))
// Le rideau de recherche precharge puis pousse la route : sans routeur mocke,
// il jette des l'ouverture dans jsdom.
const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, prefetch: vi.fn(), back: vi.fn(), replace: vi.fn() }),
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
// Le mock transmet TOUTES les propriétés, `className` comprise : sans ça, un
// test sur l'apparence d'une image passerait à côté de son sujet — il
// mesurerait le mock, pas le composant.
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...reste
  }: { src: string; alt: string } & React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...reste} />
  ),
}))

import CombatButton from '@/components/defi/CombatButton'
import SubjectPlate from '@/components/defi/SubjectPlate'
import TrophyRoadSheet from '@/components/defi/TrophyRoadSheet'
import ArenaActionBar from '@/components/defi/ArenaActionBar'
import ModesSheet from '@/components/defi/ModesSheet'
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
      <SubjectPlate />
    </DuelSubjectProvider>,
  )
}

const combat = () => screen.getByRole('button', { name: /^Duel —/ })

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
  push.mockClear()
  window.localStorage.clear()
})

describe('le bouton COMBAT', () => {
  it('annonce le duel classé de la matière choisie', () => {
    renderRow(boardWith([], ['maths']))

    // Le bouton porte DEUX rangs : le mot, puis sa destination.
    expect(within(combat()).getByText('DUEL')).toBeInTheDocument()
    expect(within(combat()).getByText('Maths')).toBeInTheDocument()
    expect(combat().getAttribute('aria-label')).toContain(
      'Duel classé en Maths',
    )
  })

  it('ouvre la RECHERCHE D’ADVERSAIRE au lieu de naviguer', async () => {
    const user = userEvent.setup()
    renderRow(boardWith([], ['maths']))

    await user.click(combat())

    // Le rideau prend l'écran, et il dit dans quelle matière il cherche.
    const rideau = screen.getByRole('dialog', {
      name: /Recherche d’un adversaire en Maths/,
    })
    expect(within(rideau).getByText(/Recherche d’adversaire/)).toBeInTheDocument()
    // L'attente n'est plus chiffrée : elle est dite par les trois points
    // animés du titre, toujours présents et allumés l'un après l'autre.
    expect(within(rideau).queryByText(/Délai estimé/)).toBeNull()
    expect(rideau.querySelectorAll('.recherche-points span')).toHaveLength(3)
    // La navigation n'a PAS eu lieu au clic : c'est le rideau qui la déclenche,
    // une fois la mise en scène jouée.
    expect(push).not.toHaveBeenCalled()
  })

  it('pose « Annuler » sur l’empreinte exacte du bouton DUEL', async () => {
    // Le pouce vient de frapper là : c'est la seule place où l'annulation ne se
    // cherche pas. La rangée doit donc PARTAGER la géométrie de la barre
    // d'action, pas la recopier — les deux flancs portent la classe exportée
    // par `ArenaActionBar`, dont c'est toute la raison d'être.
    //
    // On rend ici la VRAIE composition (le bouton dans sa barre) : comparé à un
    // bouton rendu tout seul, comme dans les autres tests de ce fichier, la
    // comparaison des deux rangées ne prouverait rien.
    const user = userEvent.setup()
    render(
      <DuelSubjectProvider board={boardWith([], ['maths'])} initialSlug="maths">
        <ArenaActionBar
          left={<span />}
          center={<CombatButton />}
          right={<span />}
        />
      </DuelSubjectProvider>,
    )

    const rangeeDuel = combat().parentElement as HTMLElement
    await user.click(combat())
    const annuler = screen.getByRole('button', { name: 'Annuler' })
    const rangeeAnnuler = annuler.parentElement as HTMLElement

    // Les trois classes qui portent toute la géométrie de la rangée.
    for (const classe of ['h-[92px]', 'items-stretch', 'gap-3']) {
      expect(rangeeDuel.className).toContain(classe)
      expect(rangeeAnnuler.className).toContain(classe)
    }
    // Même largeur : un centre étiré entre deux flancs de largeur fixe.
    expect(annuler.className).toContain('flex-1')
    expect(rangeeAnnuler.querySelectorAll('.arena-plate-flank')).toHaveLength(2)
    // Même famille de plaque, et le mot au même gabarit typographique.
    expect(annuler.className).toContain('arena-plate')
    expect(annuler.querySelector('.combat-word')).not.toBeNull()
  })

  it('rend la main quand on annule la recherche', async () => {
    const user = userEvent.setup()
    renderRow(boardWith([], ['maths']))

    await user.click(combat())
    await user.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(screen.queryByRole('dialog', { name: /Recherche/ })).toBeNull()
    expect(push).not.toHaveBeenCalled()
    // Le bouton est de nouveau là : on n'a rien perdu en passant par le rideau.
    expect(combat()).toBeInTheDocument()
  })

  it('ne promet pas le classé quand les trophées ne comptent pas encore', () => {
    // Le bouton part QUAND MÊME sur le duel de la matière (cf. duelTarget) :
    // ce qui change sans `unlocked`, c'est le nom, pas la destination.
    renderRow(boardWith([], []))

    const cta = combat()
    expect(cta.getAttribute('aria-label')).not.toContain('Duel classé')
    expect(cta.getAttribute('aria-label')).toContain('en Maths')
  })

  it('reste au seul mot DUEL même quand un ami est en ligne', () => {
    renderRow(boardWith([], ['maths']), { onlineFriendName: 'Emma' })

    // La présence se dit par la PULSATION de la plaque ; le nom de l'ami reste
    // aux lecteurs d'écran. Le pixel, lui, ne gagne pas un troisième rang :
    // deux lignes sur un bouton, c'est déjà la limite.
    expect(within(combat()).getByText('DUEL')).toBeInTheDocument()
    expect(within(combat()).queryByText(/Emma/)).toBeNull()
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
    // LA JAUGE DE CLAN A QUITTÉ L'ÉCRAN. Elle vivait sur la ligne
    // d'information, qui flottait entre le socle et la barre et passait pour
    // un quatrième bouton. Elle n'est plus dessinée nulle part ici — mais elle
    // reste dite, en toutes lettres, à qui écoute la page.
    expect(screen.queryByText(/pts ·/)).toBeNull()
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

    expect(combat().getAttribute('aria-label')).toContain('en Maths')

    await pick(user, 'Anglais')

    // La destination a suivi la plaque : elle se lit dans l'étiquette, le
    // bouton ne portant plus de `href` depuis qu'il ouvre le rideau.
    expect(combat().getAttribute('aria-label')).toContain('en Anglais')
    expect(combat().getAttribute('aria-label')).not.toContain('en Maths')
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

  it('porte l’illustration « Modes », et non un pictogramme de trait', () => {
    // `renderRow` ne monte pas le flanc gauche : on rend ModesSheet lui-même,
    // sinon le test chercherait une plaque absente de l'arbre.
    render(<ModesSheet todayKey="2026-08-23" />)

    const plaque = screen.getByRole('button', { name: /^Modes de jeu/ })
    const dessin = plaque.querySelector('img')
    expect(dessin?.getAttribute('src')).toContain('/images/defi/icones/modes-v2')
    // UN SEUL FOND, ET L'ILLUSTRATION DESSUS. Trois états successifs ont été
    // essayés : posée sur la plaque violette elle disparaissait (violet sur
    // violet) ; sur un médaillon crème elle se lisait, mais l'œil comptait
    // trois épaisseurs — cadre, disque, dessin — et le disque lui volait la
    // moitié de la plaque. La plaque est désormais claire elle-même : plus de
    // disque, et le dessin passe de 48 à 64 px.
    expect(dessin?.className).toContain('size-16')
    expect(dessin?.parentElement?.className).toContain('arena-plate--clair')
    // Un seul fond, donc : la plaque le porte, rien d'autre.
    expect(dessin?.parentElement?.getAttribute('style')).toMatch(/background/)
    // Le mot a QUITTÉ le pixel — mais pas l'étiquette lue à voix haute.
    expect(within(plaque).queryByText(/^Modes$/)).toBeNull()
    expect(plaque.getAttribute('aria-label')).toMatch(/Modes de jeu/)
  })

  it('montre la matière en ILLUSTRATION, sur son médaillon pastel', () => {
    renderRow(boardWith([], ['maths']))

    const plaque = screen.getByRole('button', { name: /^Matière du duel :/ })
    const dessin = plaque.querySelector('img')
    // La vignette, la MÊME que dans Réviser : une matière, un seul visage.
    expect(dessin?.getAttribute('src')).toContain('/images/matieres/vignettes/')
    // LA PLAQUE PORTE LE PASTEL DE LA MATIÈRE — un seul fond, et il change à
    // chaque cran de la roulette. C'est ce qui rend le défilement visible
    // avant même qu'on ait reconnu l'illustration.
    expect(plaque.className).toContain('arena-plate--clair')
    expect(plaque.getAttribute('style')).toMatch(/linear-gradient/)
    // Même masse que l'icône Modes : cf. son jumeau plus haut.
    expect(dessin?.className).toContain('size-16')
    // Le mot a QUITTÉ le pixel — mais pas l'étiquette lue à voix haute.
    expect(within(plaque).queryByText(/^Matière$/)).toBeNull()
    expect(plaque.getAttribute('aria-label')).toMatch(/Matière du duel/)
  })

  it('fait défiler les matières par les deux triangles, en tournant en rond', async () => {
    const user = userEvent.setup()
    const board = boardWith([], [])
    renderRow(board, {}, board[0].slug)

    const nom = () =>
      screen
        .getByRole('button', { name: /^Matière du duel :/ })
        .getAttribute('aria-label')

    expect(nom()).toContain(board[0].subject)

    await user.click(screen.getByRole('button', { name: 'Matière suivante' }))
    expect(nom()).toContain(board[1].subject)

    // Et on reboucle : depuis la PREMIÈRE, « précédente » mène à la dernière.
    await user.click(screen.getByRole('button', { name: 'Matière précédente' }))
    await user.click(screen.getByRole('button', { name: 'Matière précédente' }))
    expect(nom()).toContain(board[board.length - 1].subject)
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

  it('nomme la matière courante DANS le bouton, et la met à jour', async () => {
    // L'inverse était vrai : la matière vivait sur une ligne d'information
    // au-dessus, et le bouton n'avait droit qu'à un mot. Cette ligne flottait
    // entre le socle du personnage et la barre, avec un fond sombre qui la
    // faisait ressembler à un quatrième bouton — d'où sa rentrée ici.
    const user = userEvent.setup()
    const board = boardWith([], ['maths'])
    const last = board[board.length - 1].subject
    renderRow(board)

    expect(within(combat()).getByText('Maths')).toBeInTheDocument()

    await pick(user, last)

    expect(within(combat()).getByText(last)).toBeInTheDocument()
    expect(within(combat()).queryByText('Maths')).toBeNull()
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
