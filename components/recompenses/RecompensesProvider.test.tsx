import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { EVENEMENT_GAIN, type DetailGain } from '@/lib/hud-gains'
import type { Gain } from '@/lib/gains'

// LE VOL DES RÉCOMPENSES, à l'assemblage.
//
// La géométrie et le découpage sont déjà testés, purs, dans lib/gains. Ce qui
// ne peut se vérifier qu'ici, c'est le CÂBLAGE : que la volée parte, qu'elle
// dépose exactement le montant versé, qu'elle ne parte pas vers une cible
// absente, et que le mouvement réduit garde le résultat en retirant le trajet.
//
// jsdom n'implémente pas `Element.animate` : le composant bascule alors sur sa
// voie de repli (un minuteur), qui atterrit aux mêmes instants. C'est justement
// ce que ce fichier exerce — et c'est aussi le chemin qu'emprunterait un vrai
// navigateur sans Web Animations.

const refresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn(), refresh }),
  usePathname: () => '/reviser',
}))
vi.mock('@/lib/sounds', () => ({
  sfx: { coin: vi.fn(), tap: vi.fn(), complete: vi.fn() },
}))

import RecompensesProvider, {
  useRecompenses,
} from '@/components/recompenses/RecompensesProvider'

/** Une pastille de bandeau MESURABLE (jsdom rend des rectangles à zéro). */
function Cible({ unite }: { unite: string }) {
  return (
    <div
      data-hud-cible={unite}
      data-testid={`cible-${unite}`}
      ref={(el) => {
        if (!el) return
        el.getBoundingClientRect = () =>
          ({ width: 44, height: 44, left: 300, top: 8, right: 344, bottom: 52, x: 300, y: 8 }) as DOMRect
      }}
    />
  )
}

/** Déclenche une volée au montage, comme le ferait un écran de fin. */
function Declencheur({ gains }: { gains: Gain[] }) {
  const { celebrer } = useRecompenses()
  useEffect(() => {
    celebrer(gains)
    // Une seule volée, au montage — comme le panneau de récompenses.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <p>écran de fin</p>
}

function monter(gains: Gain[], cibles: string[] = ['ecu']) {
  return render(
    <RecompensesProvider>
      {cibles.map((u) => (
        <Cible key={u} unite={u} />
      ))}
      <Declencheur gains={gains} />
    </RecompensesProvider>,
  )
}

let recus: DetailGain[] = []
const collecter = (e: Event) => {
  recus.push((e as CustomEvent<DetailGain>).detail)
}

beforeEach(() => {
  vi.useFakeTimers()
  refresh.mockReset()
  recus = []
  window.addEventListener(EVENEMENT_GAIN, collecter)
  // jsdom n'a pas matchMedia : sans lui, le composant prendrait la branche
  // « mouvement réduit » et ces tests ne verraient jamais un seul jeton.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
})

afterEach(() => {
  window.removeEventListener(EVENEMENT_GAIN, collecter)
  vi.useRealTimers()
})

describe('le vol des récompenses', () => {
  it('dépose EXACTEMENT le montant versé, ni plus ni moins', async () => {
    // LE TEST QUI COMPTE. Le compteur du bandeau monte jeton par jeton ; si la
    // somme des jetons dépassait le montant, le solde afficherait plus que la
    // base, puis redescendrait au rafraîchissement suivant. Un solde qui recule
    // tout seul est un bug que l'élève voit et que personne ne reproduit.
    monter([{ unite: 'ecu', montant: 37 }])
    await act(async () => void vi.advanceTimersByTime(3000))

    expect(recus.length).toBeGreaterThan(1) // une pluie, pas un objet
    const total = recus.reduce((s, d) => s + d.montant, 0)
    expect(total).toBe(37)
    expect(recus.every((d) => d.unite === 'ecu')).toBe(true)
  })

  it('ÉGRÈNE le montant au lieu de le verser d’un coup', async () => {
    // C'est tout l'effet : un compteur qui saute d'un bloc ne se distingue pas
    // d'un rechargement de page.
    monter([{ unite: 'ecu', montant: 37 }])

    await act(async () => void vi.advanceTimersByTime(700))
    const apresUnPeu = recus.reduce((s, d) => s + d.montant, 0)
    expect(apresUnPeu).toBeGreaterThan(0)
    expect(apresUnPeu).toBeLessThan(37)

    await act(async () => void vi.advanceTimersByTime(3000))
    expect(recus.reduce((s, d) => s + d.montant, 0)).toBe(37)
  })

  it('ne fait rien voler vers une unité SANS pastille au bandeau', async () => {
    // Les couronnes de saison et les trophées n'ont pas de compteur permanent :
    // les envoyer vers un coin vide promettrait un compteur qui n'existe pas.
    // Elles s'affichent dans le panneau, elles ne traversent pas l'écran.
    monter([{ unite: 'couronne', montant: 12 }], ['ecu'])
    await act(async () => void vi.advanceTimersByTime(3000))
    expect(recus).toEqual([])
  })

  it('ne vole pas vers une pastille MASQUÉE (bandeau caché sur grand écran)', async () => {
    // `md:hidden` laisse la pastille DANS le DOM : `querySelector` la trouve et
    // son rectangle vaut zéro. Sans le contrôle de taille, tous les jetons
    // convergeraient vers le coin haut-gauche de l'écran, visiblement.
    render(
      <RecompensesProvider>
        <div data-hud-cible="ecu" />
        <Declencheur gains={[{ unite: 'ecu', montant: 20 }]} />
      </RecompensesProvider>,
    )
    await act(async () => void vi.advanceTimersByTime(3000))
    expect(recus).toEqual([])
  })

  it('ne verse RIEN quand il n’y a rien à fêter', async () => {
    monter([{ unite: 'ecu', montant: 0 }])
    await act(async () => void vi.advanceTimersByTime(3000))
    expect(recus).toEqual([])
    // Et surtout : pas de rafraîchissement de page pour zéro.
    expect(refresh).not.toHaveBeenCalled()
  })

  it('resynchronise avec le serveur APRÈS l’atterrissage, pas avant', async () => {
    // Rafraîchir pendant le vol ferait sauter le compteur à sa valeur finale
    // alors que les jetons sont encore en l'air.
    monter([{ unite: 'ecu', montant: 37 }])

    await act(async () => void vi.advanceTimersByTime(500))
    expect(refresh).not.toHaveBeenCalled()

    await act(async () => void vi.advanceTimersByTime(3000))
    expect(refresh).toHaveBeenCalled()
  })

  it('garde le RÉSULTAT en mouvement réduit, et retire le trajet', async () => {
    // La règle de toute l'app : on enlève l'animation, jamais l'information.
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia

    monter([{ unite: 'ecu', montant: 37 }])
    await act(async () => void vi.advanceTimersByTime(3000))

    // Le montant est versé EN UNE FOIS : pas de pluie, mais le compte y est.
    expect(recus).toHaveLength(1)
    expect(recus[0]).toEqual({ unite: 'ecu', montant: 37 })
  })

  it('n’empêche jamais l’écran de fin de s’afficher', async () => {
    // Le fournisseur est de la décoration : quoi qu'il arrive, ce qu'il
    // enveloppe doit se rendre.
    monter([{ unite: 'ecu', montant: 5 }])
    expect(screen.getByText('écran de fin')).toBeInTheDocument()
  })
})

describe('hors fournisseur', () => {
  it('rend un `celebrer` inerte plutôt que de jeter', async () => {
    // Un écran de fin monté seul (test isolé, page hors layout racine) ne doit
    // pas tomber parce que la couche d'animation manque.
    expect(() =>
      render(<Declencheur gains={[{ unite: 'ecu', montant: 5 }]} />),
    ).not.toThrow()
    await act(async () => void vi.advanceTimersByTime(3000))
    expect(recus).toEqual([])
  })
})
