import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import type { ModeQuestion } from '@/lib/defi-modes'
import { GAME_FORMATS } from '@/lib/jeux/formats'

// 3e test d'ASSEMBLAGE — les salons de l'espace Jeux.
//
// L'audit du 23/07 avait sorti d'un coup, sur ces mêmes salons : un écran de
// fin qui annonçait « 8/8 » avec 2 bonnes réponses, une XP affichée différente
// de l'XP versée, et DEUX jeux qui ne pouvaient jamais se terminer. Aucun de
// ces défauts ne vit dans `lib/jeux/run` (moteur pur, déjà testé) : ils
// naissent du câblage table ↔ moteur ↔ Server Action. D'où ce fichier.
//
// Format choisi : `chasse-faute`, mécanique « vies » — 3 vies, AUCUN chrono par
// question. C'est le seul qui se joue jusqu'au bout sans dépendre d'une horloge,
// donc le seul déterministe à 100 %.

const recordChallenge = vi.fn()

vi.mock('@/lib/sounds', () => ({
  gameSfx: () => ({
    correct: vi.fn(),
    wrong: vi.fn(),
    lifeLost: vi.fn(),
    stepCleared: vi.fn(),
    tick: vi.fn(),
    countdown: vi.fn(),
    win: vi.fn(),
    lose: vi.fn(),
  }),
  sfx: { tap: vi.fn(), back: vi.fn(), flip: vi.fn(), complete: vi.fn() },
  buzz: vi.fn(),
  press: vi.fn(),
}))
vi.mock('@/app/defi/actions', () => ({
  recordChallenge: (...args: unknown[]) => recordChallenge(...args),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/defi',
}))

import GameTable from '@/components/jeux/GameTable'

const FORMAT = GAME_FORMATS['chasse-faute']

// Un pool à réponse stable : « Juste » est TOUJOURS bon, « Faux » toujours
// mauvais, quelle que soit la question tirée.
const POOL: ModeQuestion[] = Array.from({ length: 6 }, (_, i) => ({
  id: `q${i}`,
  prompt: `Quelle orthographe est correcte ? (${i})`,
  options: ['Juste', 'Faux'],
  correctIndex: 0,
  subject: 'Français',
})) as unknown as ModeQuestion[]

const PROPS = {
  format: FORMAT,
  pool: POOL,
  name: 'Chasse à la faute',
  subject: 'Français',
  subjectEmoji: '🖋️',
}

/** Intro → décompte 3·2·1 → partie lancée. */
async function lancerLaPartie() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /GO/ }))
  })
  // Le décompte s'enchaîne par minuteurs SUCCESSIFS (3 → 2 → 1 → GO), chacun
  // reprogrammé par l'effet du rendu suivant : il faut donc rendre la main à
  // React entre deux avances, sinon on reste bloqué sur « 2 ».
  for (let i = 0; i < 6; i += 1) {
    await act(async () => void vi.advanceTimersByTime(800))
  }
}

/** Une réponse, puis l'auto-avance vers la suivante. */
async function repondre(libelle: 'Juste' | 'Faux') {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: libelle }))
  })
  await act(async () => void vi.advanceTimersByTime(2_000))
}

beforeEach(() => {
  vi.useFakeTimers()
  recordChallenge.mockReset()
  recordChallenge.mockResolvedValue({ saved: true, xp: 77 })
  window.localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('GameTable — une partie de salon se termine, et son écran de fin ne ment pas', () => {
  it('perd bien ses 3 vies et termine la partie (aucun jeu sans fin)', async () => {
    render(<GameTable {...PROPS} />)
    await lancerLaPartie()

    // Deux erreurs : encore en jeu.
    await repondre('Faux')
    await repondre('Faux')
    expect(recordChallenge).not.toHaveBeenCalled()

    // La troisième solde la partie.
    await repondre('Faux')
    expect(recordChallenge).toHaveBeenCalledTimes(1)
    expect(screen.getByText(FORMAT.lexicon.lose)).toBeInTheDocument()
  })

  it('envoie au serveur le décompte RÉEL des bonnes réponses, pas le nombre de questions', async () => {
    render(<GameTable {...PROPS} />)
    await lancerLaPartie()

    // 2 bonnes, 3 mauvaises → 2 bonnes sur 5 répondues.
    await repondre('Juste')
    await repondre('Faux')
    await repondre('Juste')
    await repondre('Faux')
    await repondre('Faux')

    expect(recordChallenge).toHaveBeenCalledTimes(1)
    const [correct, answered] = recordChallenge.mock.calls[0] as number[]
    expect(correct).toBe(2) // et surtout PAS 5 (« 8/8 avec 2 bonnes réponses »)
    expect(answered).toBe(5)
  })

  it('affiche l’XP DU SERVEUR dès qu’il répond, pas son estimation locale', async () => {
    // Le serveur connaît des bonus que le client ignore (trajet, écrêtage) :
    // l'estimation locale ne doit jamais rester à l'écran une fois la vraie
    // valeur connue.
    render(<GameTable {...PROPS} />)
    await lancerLaPartie()
    await repondre('Faux')
    await repondre('Faux')
    await repondre('Faux')
    await act(async () => {})

    expect(screen.getByText(/\+77 XP/)).toBeInTheDocument()
    expect(screen.getByText(/série continue/)).toBeInTheDocument()
  })

  it('ne repeint pas l’écran d’une NOUVELLE partie avec l’XP de la précédente', async () => {
    // Le garde-fou `partieRef`. Sur réseau lent, la réponse de la partie 1
    // arrive APRÈS que le joueur a rejoué ET reperdu : sans garde, elle
    // repeindrait l'écran de fin de la partie 2 avec l'XP de la partie 1.
    let repondre1: (v: unknown) => void = () => {}
    let repondre2: (v: unknown) => void = () => {}
    recordChallenge
      .mockReturnValueOnce(new Promise((r) => (repondre1 = r)))
      .mockReturnValueOnce(new Promise((r) => (repondre2 = r)))

    render(<GameTable {...PROPS} />)
    await lancerLaPartie()
    await repondre('Faux')
    await repondre('Faux')
    await repondre('Faux')

    // Rejouer AVANT que le serveur n'ait répondu, puis reperdre.
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Rejouer/ }))
    })
    for (let i = 0; i < 6; i += 1) {
      await act(async () => void vi.advanceTimersByTime(800))
    }
    await repondre('Faux')
    await repondre('Faux')
    await repondre('Faux')

    // La réponse RETARDATAIRE de la partie 1 arrive maintenant.
    await act(async () => {
      repondre1({ saved: true, xp: 11 })
    })
    expect(screen.queryByText(/\+11 XP/)).not.toBeInTheDocument()

    // Celle de la partie 2, elle, fait foi.
    await act(async () => {
      repondre2({ saved: true, xp: 99 })
    })
    expect(screen.getByText(/\+99 XP/)).toBeInTheDocument()
  })
})
