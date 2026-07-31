import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import type { ModeQuestion } from '@/lib/defi-modes'
import { DUEL_MS, buildRival } from '@/lib/duel90'

// Test d'ASSEMBLAGE du Duel 90 s — le CTA principal de /defi, jamais parcouru.
//
// Trois défauts qu'aucun test de `lib/` ne peut attraper, parce qu'ils naissent
// du câblage (écran ↔ refs ↔ Server Action), pas d'une fonction pure :
//   1. l'écran de fin annonce un décompte différent de ce qui est envoyé ;
//   2. il affiche « +0 XP » pendant que l'aller-retour serveur court, puis se
//      corrige — le défaut maison n°1 (« l'XP affichée ≠ l'XP versée ») ;
//   3. le duel se consomme pendant que l'appli est en arrière-plan.

const recordDuel90 = vi.fn()

vi.mock('@/lib/sounds', () => ({
  gameSfx: () => ({
    correct: vi.fn(),
    wrong: vi.fn(),
    lifeLost: vi.fn(),
    tick: vi.fn(),
    win: vi.fn(),
    lose: vi.fn(),
  }),
  sfx: { flip: vi.fn() },
  buzz: vi.fn(),
  // Button (ui/button) joue press() à chaque clic.
  press: vi.fn(),
}))
vi.mock('@/app/defi/duel90-actions', () => ({
  recordDuel90: (...args: unknown[]) => recordDuel90(...args),
}))
vi.mock('@/app/reviser/actions', () => ({
  recordReviewAnswers: vi.fn(async () => {}),
}))

import Duel90Mode from '@/components/Duel90Mode'

// Deux questions, réponse correcte en position 0 : « Vrai » est toujours bon,
// « Faux » toujours mauvais, d'où qu'on clique.
const POOL: ModeQuestion[] = [
  {
    id: 'q1',
    prompt: 'Thalès parle de triangles ?',
    options: ['Vrai', 'Faux'],
    correctIndex: 0,
    subject: 'maths',
  },
  {
    id: 'q2',
    prompt: 'Pythagore parle du carré de l’hypoténuse ?',
    options: ['Vrai', 'Faux'],
    correctIndex: 0,
    subject: 'maths',
  },
] as unknown as ModeQuestion[]

const PROPS = {
  pool: POOL,
  rivalName: 'Rival',
  rivalLevel: 3,
  myLevel: 3,
  seed: 'duel-test',
  onExit: vi.fn(),
}

/** Fin de partie : on laisse filer les 90 secondes du chrono. */
async function laisserFilerLeChrono() {
  await act(async () => {
    vi.advanceTimersByTime(DUEL_MS + 1_000)
  })
}

/** Bascule l'onglet en arrière-plan (ou en avant), comme le ferait le système. */
function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

/**
 * L'appli passe en arrière-plan pendant `ms`, puis revient.
 *
 * Le point CRUCIAL : pendant l'absence, l'horloge avance (`setSystemTime`) mais
 * le `setInterval` ne tourne quasiment pas — c'est exactement ce que fait un
 * navigateur, qui bride (voire suspend) les minuteurs d'un onglet caché. Un test
 * qui se contenterait d'`advanceTimersByTime` ferait tourner la boucle à pleine
 * cadence et resterait vert MÊME avec l'ancienne compensation « +TICK_MS par
 * tour » : il ne pourrait pas échouer, donc ne prouverait rien.
 */
async function absence(ms: number) {
  setVisibility('hidden')
  await act(async () => {
    vi.setSystemTime(Date.now() + ms)
    vi.advanceTimersByTime(100) // un seul tour de boucle en cinq minutes
  })
  setVisibility('visible')
  await act(async () => void vi.advanceTimersByTime(200))
}

/** Un clic sur une réponse, puis le délai de transition vers la suivante. */
async function repondre(libelle: 'Vrai' | 'Faux') {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: libelle }))
  })
  await act(async () => void vi.advanceTimersByTime(500))
}

beforeEach(() => {
  vi.useFakeTimers()
  recordDuel90.mockReset()
  recordDuel90.mockResolvedValue(null)
  setVisibility('visible')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Duel90Mode — l’écran de fin ne ment pas', () => {
  it('envoie au serveur EXACTEMENT le décompte qu’il affiche', async () => {
    recordDuel90.mockResolvedValue({
      saved: true,
      result: { outcome: 'win', xp: 42, trophies: 7, correct: 2, answered: 3, bestCombo: 2 },
      trophiesAfter: 100,
      clanPoints: 0,
      questsCompleted: [],
      questDayDone: false,
      crowns: 0,
    })
    render(<Duel90Mode {...PROPS} />)

    // Deux bonnes réponses, une mauvaise. Entre chaque, le délai de transition.
    await repondre('Vrai')
    await repondre('Vrai')
    await repondre('Faux')

    await laisserFilerLeChrono()

    // Ce que l'écran annonce…
    expect(screen.getByText(/2\/3 bonnes réponses/)).toBeInTheDocument()

    // …est EXACTEMENT ce qui part au serveur : (score, correct, answered,
    // bestCombo, scoreDuRival, chapitre).
    expect(recordDuel90).toHaveBeenCalledTimes(1)
    const [score, correct, answered, bestCombo, rivalFinal] =
      recordDuel90.mock.calls[0] as number[]
    expect(correct).toBe(2)
    expect(answered).toBe(3)
    expect(bestCombo).toBe(2)
    expect(score).toBeGreaterThan(0)
    // Le score du rival est celui de la graine, recalculable côté serveur.
    expect(rivalFinal).toBe(buildRival('duel-test', 'Rival', 3, 3).finalScore)

    // Et le score affiché en gros est bien celui envoyé.
    expect(screen.getByText(String(score))).toBeInTheDocument()
  })

  it('affiche l’XP DU SERVEUR, jamais un zéro en attendant sa réponse', async () => {
    // La Server Action ne répond pas tout de suite : c'est la vraie vie (réseau
    // mobile). Pendant ce temps, l'écran ne doit annoncer AUCUN chiffre.
    let resoudre: (v: unknown) => void = () => {}
    recordDuel90.mockReturnValue(
      new Promise((r) => {
        resoudre = r
      }),
    )
    render(<Duel90Mode {...PROPS} />)
    await repondre('Vrai')
    await laisserFilerLeChrono()

    // Pendant l'attente : pas de « +0 XP » qui passerait pour la vérité.
    expect(screen.getByText('… XP')).toBeInTheDocument()
    expect(screen.queryByText('+0 XP')).not.toBeInTheDocument()

    await act(async () => {
      resoudre({
        saved: true,
        result: { outcome: 'win', xp: 42, trophies: 7, correct: 1, answered: 1, bestCombo: 1 },
        trophiesAfter: 100,
        clanPoints: 0,
        questsCompleted: [],
        questDayDone: false,
        crowns: 0,
      })
    })

    expect(screen.getByText('+42 XP')).toBeInTheDocument()
    expect(screen.getByText('+7 🏆')).toBeInTheDocument()
  })

  it('dit franchement quand le serveur n’a pas confirmé (panne réseau)', async () => {
    recordDuel90.mockRejectedValue(new Error('offline'))
    render(<Duel90Mode {...PROPS} />)
    await repondre('Vrai')
    await laisserFilerLeChrono()
    await act(async () => {})

    expect(screen.getByText(/Résultat non confirmé/)).toBeInTheDocument()
    // Toujours pas de zéro inventé.
    expect(screen.queryByText('+0 XP')).not.toBeInTheDocument()
  })
})

describe('Duel90Mode — l’arrière-plan ne consomme pas le duel', () => {
  it('rend au joueur la durée RÉELLE passée hors de l’appli', async () => {
    render(<Duel90Mode {...PROPS} />)

    // 30 s jouées, puis l'élève passe sur une autre appli pendant 5 minutes.
    await act(async () => void vi.advanceTimersByTime(30_000))
    await absence(300_000)

    // Le duel n'est PAS terminé : il reste ~60 s. (Avant correctif, la
    // compensation valait TICK_MS par tour de boucle — inopérante dès que le
    // navigateur bride la boucle — et on revenait sur un duel perdu.)
    expect(recordDuel90).not.toHaveBeenCalled()
    expect(screen.getByText('1:00')).toBeInTheDocument()
  })

  it('finit quand même le duel après 90 s réellement jouées', async () => {
    render(<Duel90Mode {...PROPS} />)
    await absence(120_000)
    await laisserFilerLeChrono()

    expect(recordDuel90).toHaveBeenCalledTimes(1)
  })
})
