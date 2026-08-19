import { describe, it, expect } from 'vitest'
import { buildRoster, trophyMap } from '@/lib/defi/roster'
import { buildSubjectLadders } from '@/lib/subject-rank'
import {
  boardIndex,
  buildDuelBoard,
  duelTarget,
  rankedBlockedReason,
  RANKED_LABEL,
} from '@/lib/defi/duel-board'

// Le plateau assemble deux sources déjà testées ailleurs (le roster, le ladder).
// Ce qui se vérifie ici n'est donc pas leur contenu, mais LES TROIS DÉCISIONS
// que le plateau prend seul :
//   1. le roster fait la colonne vertébrale (un visiteur voit quand même les
//      sept matières) ;
//   2. COMBAT a toujours une destination — le classé s'il est ouvert, le jeu le
//      plus rentable sinon, et le bouton NOMME lequel ;
//   3. les deux verrous du classé ne se disent pas avec la même phrase.

const READY = { programmeReady: new Set(['maths', 'histoire-geo']) }

function ladderFor(
  roster: ReturnType<typeof buildRoster>,
  rows: Parameters<typeof buildSubjectLadders>[0]['rows'],
  unlocked: string[],
) {
  return buildSubjectLadders({
    subjects: roster.map((e) => ({
      subject: e.subject,
      slug: e.slug,
      emoji: e.emoji,
    })),
    rows,
    unlockedSlugs: new Set(unlocked),
  })
}

describe('buildDuelBoard', () => {
  it('rend une matière par entrée du roster', () => {
    const roster = buildRoster(new Map())
    const board = buildDuelBoard(roster)

    expect([...board.map((e) => e.slug)].sort()).toEqual(
      [...roster.map((e) => e.slug)].sort(),
    )
  })

  it('range les matières par ordre alphabétique, accents compris', () => {
    const board = buildDuelBoard(buildRoster(new Map()))

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

  it('accroche à chaque matière l’illustration de sa carte de Réviser', () => {
    const board = buildDuelBoard(buildRoster(new Map()))
    const maths = board.find((e) => e.slug === 'maths')

    expect(maths?.vignette).toBe('/images/matieres/vignettes/maths.webp')
  })

  it('teinte le médaillon avec la couleur de la matière', () => {
    const board = buildDuelBoard(buildRoster(new Map()), [], {
      colorBySlug: new Map([['maths', 'blue']]),
    })

    const maths = board.find((e) => e.slug === 'maths')
    const svt = board.find((e) => e.slug === 'svt')
    // Une couleur connue donne son pastel ; une matière sans couleur garde le
    // crème neutre — jamais rien, sinon l'illustration retombe sur du violet.
    expect(maths?.pastel).toBe('#DFEBFF')
    expect(svt?.pastel).toBeTruthy()
    expect(svt?.pastel).not.toBe(maths?.pastel)
  })

  it('tient debout sans ladder — le visiteur voit les matières, fermées', () => {
    const rows = [{ subject: 'maths', gameId: 'calcul-mental', trophies: 240 }]
    const board = buildDuelBoard(buildRoster(trophyMap(rows)))
    const maths = board.find((e) => e.slug === 'maths')

    expect(maths?.unlocked).toBe(false)
    expect(maths?.trophies).toBe(240)
    // Le pic ne peut pas être inférieur au compteur affiché juste à côté.
    expect(maths?.peakTrophies).toBe(240)
    expect(maths?.rank.label).toBe('Bronze II')
  })

  it('reprend le rang et le déblocage du ladder quand il existe', () => {
    const rows = [{ subject: 'maths', gameId: 'calcul-mental', trophies: 890 }]
    const roster = buildRoster(trophyMap(rows), READY)
    const board = buildDuelBoard(roster, ladderFor(roster, rows, ['maths']))
    const maths = board.find((e) => e.slug === 'maths')

    expect(maths?.unlocked).toBe(true)
    expect(maths?.rank.label).toBe(
      ladderFor(roster, rows, ['maths']).find((l) => l.slug === 'maths')!.rank
        .label,
    )
  })
})

describe('boardIndex', () => {
  const board = buildDuelBoard(buildRoster(new Map()))

  it('retrouve la matière demandée', () => {
    expect(board[boardIndex(board, 'maths')].slug).toBe('maths')
  })

  it('retombe sur la première matière quand le slug est inconnu ou absent', () => {
    expect(boardIndex(board, 'klingon')).toBe(0)
    expect(boardIndex(board, null)).toBe(0)
  })
})

describe('duelTarget', () => {
  it('lance le duel classé quand la matière est ouverte et sa banque servie', () => {
    const rows: never[] = []
    const roster = buildRoster(trophyMap(rows), READY)
    const board = buildDuelBoard(roster, ladderFor(roster, rows, ['maths']))
    const target = duelTarget(board.find((e) => e.slug === 'maths')!)

    expect(target).toMatchObject({
      href: '/defi/programme/maths',
      label: RANKED_LABEL,
      isRanked: true,
    })
  })

  it('replie sur un jeu de la matière — nommé — quand le classé est fermé', () => {
    const rows: never[] = []
    const roster = buildRoster(trophyMap(rows), READY)
    // Aucune matière débloquée : le cas d'un compte du jour de l'inscription.
    const board = buildDuelBoard(roster, ladderFor(roster, rows, []))
    const maths = board.find((e) => e.slug === 'maths')!
    const target = duelTarget(maths)

    expect(target?.isRanked).toBe(false)
    expect(target?.href).toMatch(/^\/defi\/jeux\//)
    // Le bouton ne dira jamais « Duel classé » sur un jeu de salon.
    expect(target?.label).not.toBe(RANKED_LABEL)
    expect(maths.games.some((g) => g.name === target?.label)).toBe(true)
  })

  it('pousse vers le jeu le moins travaillé de la matière', () => {
    const rows = [
      { subject: 'maths', gameId: 'calcul-mental', trophies: 890 },
      { subject: 'maths', gameId: 'compte-est-bon', trophies: 350 },
    ]
    const roster = buildRoster(trophyMap(rows))
    const board = buildDuelBoard(roster)
    const maths = board.find((e) => e.slug === 'maths')!
    const target = duelTarget(maths)!

    // Le jeu jamais touché rapporte 10, les deux autres 2 et 7.
    expect(target.nextWin).toBe(10)
    const chosen = maths.games.find((g) => g.name === target.label)!
    expect(chosen.trophies).toBe(0)
  })
})

describe('rankedBlockedReason', () => {
  const rows: never[] = []

  it('renvoie la consigne de déblocage sur une matière jamais travaillée', () => {
    const roster = buildRoster(trophyMap(rows), READY)
    const board = buildDuelBoard(roster, ladderFor(roster, rows, []))

    expect(rankedBlockedReason(board.find((e) => e.slug === 'maths')!)).toMatch(
      /termine un chapitre/i,
    )
  })

  it('dit la banque manquante, et non le chapitre, quand la matière est ouverte', () => {
    const roster = buildRoster(trophyMap(rows), READY)
    const board = buildDuelBoard(roster, ladderFor(roster, rows, ['svt']))
    const svt = board.find((e) => e.slug === 'svt')!

    const reason = rankedBlockedReason(svt)
    expect(reason).toBeTruthy()
    expect(reason).not.toMatch(/termine un chapitre/i)
  })

  it('ne bloque rien quand les deux verrous sont levés', () => {
    const roster = buildRoster(trophyMap(rows), READY)
    const board = buildDuelBoard(roster, ladderFor(roster, rows, ['maths']))

    expect(rankedBlockedReason(board.find((e) => e.slug === 'maths')!)).toBeNull()
  })
})
