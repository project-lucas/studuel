import { describe, expect, it } from 'vitest'
import { FRISES } from '@/lib/jeux/frise-folle'
import { PHRASES } from '@/lib/jeux/phrase-en-vrac'
import {
  boardFromOrdered,
  drawBoards,
  expectedIndex,
  isBoardComplete,
  isNextInOrder,
  type OrderItem,
} from '@/lib/jeux/ordering'

const abc: OrderItem[] = [
  { label: 'un', hint: '1' },
  { label: 'deux', hint: '2' },
  { label: 'trois', hint: '3' },
  { label: 'quatre', hint: '4' },
]

describe('boardFromOrdered', () => {
  it('garde solution et affichage cohérents après mélange', () => {
    const board = boardFromOrdered('t', 'Compte', abc, 'graine')
    // Rejouer la solution redonne l'ordre d'origine, quel que soit le mélange.
    expect(board.solution.map((i) => board.items[i].label)).toEqual([
      'un',
      'deux',
      'trois',
      'quatre',
    ])
  })

  it('mélange vraiment l’affichage (au moins une graine le prouve)', () => {
    const shuffled = ['a', 'b', 'c', 'd', 'e'].some((g) => {
      const board = boardFromOrdered('t', 'Compte', abc, g)
      return board.items.map((i) => i.label).join() !== 'un,deux,trois,quatre'
    })
    expect(shuffled).toBe(true)
  })

  it('est déterministe', () => {
    expect(boardFromOrdered('t', 'C', abc, 'g')).toEqual(
      boardFromOrdered('t', 'C', abc, 'g'),
    )
  })
})

describe('validation des taps', () => {
  const board = boardFromOrdered('t', 'Compte', abc, 'graine')

  it('accepte la tuile attendue et refuse toutes les autres', () => {
    for (let placed = 0; placed < board.solution.length; placed++) {
      const expected = expectedIndex(board, placed)
      expect(expected).not.toBeNull()
      for (let i = 0; i < board.items.length; i++) {
        expect(isNextInOrder(board, placed, i)).toBe(i === expected)
      }
    }
  })

  it('déclare le tableau complet au bon moment, et pas avant', () => {
    expect(isBoardComplete(board, 3)).toBe(false)
    expect(isBoardComplete(board, 4)).toBe(true)
    expect(expectedIndex(board, 4)).toBeNull()
  })
})

describe('drawBoards', () => {
  const source = FRISES.map((f) => ({
    id: f.id,
    prompt: f.prompt,
    ordered: f.ordered,
  }))

  it('sert exactement le nombre de tableaux demandé', () => {
    expect(drawBoards(source, 3, 'g')).toHaveLength(3)
    expect(drawBoards(source, 12, 'g')).toHaveLength(12)
  })

  it('donne un id unique à chaque tableau, même en recyclant la banque', () => {
    const boards = drawBoards(source, 12, 'g')
    expect(new Set(boards.map((b) => b.id)).size).toBe(12)
  })

  it('ne répète pas un contenu tant que la banque n’est pas épuisée', () => {
    const boards = drawBoards(source, source.length, 'g')
    const prompts = boards.map((b) => b.prompt)
    expect(new Set(prompts).size).toBe(source.length)
  })
})

// Extrait l'année d'un repère (« 753 av. J.-C. », « 6 juin 1944 », « ≈ 496 »).
// Renvoie null si le repère n'en contient pas.
function yearOf(hint: string): number | null {
  // Les grands nombres sont écrits avec une espace de milliers (« 17 000 ») :
  // on la retire avant de lire, sinon « 17 000 » se lit « 000 ».
  const flat = hint.replace(/(\d)[\s  ](?=\d)/g, '$1')
  const m = flat.match(/(\d{1,6})/g)
  if (!m) return null
  const year = Number(m[m.length - 1])
  return /av\. ?J\.-?C\./.test(hint) ? -year : year
}

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

function monthOf(hint: string): number {
  const i = MONTHS.findIndex((m) => hint.toLowerCase().includes(m))
  return i === -1 ? 0 : i + 1
}

describe('données : les frises sont réellement chronologiques', () => {
  // Le jeu CORRIGE l'élève : une frise mal ordonnée lui apprendrait une erreur.
  // Ce test relit les dates des repères et refuse tout ordre décroissant.
  for (const frise of FRISES) {
    it(`« ${frise.prompt} » va bien du plus ancien au plus récent`, () => {
      let previous = Number.NEGATIVE_INFINITY
      let previousMonth = 0
      for (const item of frise.ordered) {
        const year = yearOf(item.hint)
        expect(year, `repère sans date : « ${item.hint} »`).not.toBeNull()
        expect(
          year!,
          `« ${item.label} » (${item.hint}) est antérieur au repère précédent`,
        ).toBeGreaterThanOrEqual(previous)
        // Même année : c'est le mois qui doit départager, et il doit être écrit.
        if (year === previous) {
          const month = monthOf(item.hint)
          expect(
            month,
            `« ${item.label} » partage son année : le mois doit être précisé`,
          ).toBeGreaterThan(0)
          expect(month).toBeGreaterThanOrEqual(previousMonth)
          previousMonth = month
        } else {
          previousMonth = monthOf(item.hint)
        }
        previous = year!
      }
    })
  }

  it('propose assez de frises pour une partie de 4 sans répétition', () => {
    expect(FRISES.length).toBeGreaterThanOrEqual(4)
    expect(new Set(FRISES.map((f) => f.id)).size).toBe(FRISES.length)
  })

  it('donne 5 événements à chaque frise, comme le catalogue le promet', () => {
    for (const f of FRISES) expect(f.ordered).toHaveLength(5)
  })
})

describe('données : les phrases sont jouables sans ambiguïté', () => {
  it('ne répète jamais un mot dans une même phrase', () => {
    // Deux tuiles identiques rendraient le tableau injustement bloquant : le
    // joueur toucherait « le bon mot » et se ferait refuser parce que ce n'est
    // pas la bonne TUILE.
    for (const p of PHRASES) {
      const labels = p.ordered.map((i) => i.label.toLowerCase())
      expect(new Set(labels).size, `« ${p.prompt} » répète un mot`).toBe(
        labels.length,
      )
    }
  })

  it('garde des phrases courtes et complètes', () => {
    for (const p of PHRASES) {
      expect(p.ordered.length).toBeGreaterThanOrEqual(3)
      expect(p.ordered.length).toBeLessThanOrEqual(6)
      for (const item of p.ordered) {
        expect(item.label.trim().length).toBeGreaterThan(0)
        expect(item.hint.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('offre assez de phrases pour tenir un chrono de 75 secondes', () => {
    expect(PHRASES.length).toBeGreaterThanOrEqual(8)
    expect(new Set(PHRASES.map((p) => p.id)).size).toBe(PHRASES.length)
  })
})
