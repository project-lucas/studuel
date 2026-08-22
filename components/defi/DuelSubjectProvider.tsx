'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  boardIndex,
  type DuelSubject,
} from '@/lib/defi/duel-board'
import {
  readRememberedSubject,
  rememberSubject,
} from '@/lib/defi/subject-memory'

/**
 * LA MATIÈRE COURANTE DE L'ARÈNE — un seul état, partagé par tout l'écran.
 *
 * Quatre objets en dépendent et doivent toujours parler de la même matière : la
 * plaque Matière (qui la choisit), la ligne d'information (qui la nomme), le
 * bouton COMBAT (qui la lance) et la Route des trophées (qui la raconte). Ils
 * vivent dans des branches différentes du rendu — le HUD flottant pour la
 * Route, la barre du bas pour les trois autres — donc aucun parent commun ne
 * pouvait tenir l'état sans le faire descendre à travers des composants qui
 * n'en ont que faire. D'où un contexte, et non du prop drilling.
 *
 * C'est aussi ce qui rend le geste juste : choisir Maths sur la plaque met la
 * Route sur Maths. L'écran précédent avait DEUX sélecteurs de matière (le
 * module classé, l'espace duel) qui s'ignoraient — on choisissait deux fois la
 * même chose, sans jamais savoir laquelle comptait.
 */
type DuelSubjectValue = {
  board: DuelSubject[]
  index: number
  active: DuelSubject | null
  /** Va à une matière précise (tap sur une ligne de la feuille). */
  select: (index: number) => void
}

const DuelSubjectContext = createContext<DuelSubjectValue | null>(null)

// LE STOCKAGE DU NAVIGATEUR, LU COMME UNE SOURCE EXTÉRIEURE.
//
// `localStorage` n'existe pas au rendu serveur : le lire dans un `useState`
// ferait diverger les deux rendus (erreur d'hydratation), et le lire dans un
// effet pour appeler `setState` est précisément ce que React déconseille.
// `useSyncExternalStore` est l'outil prévu pour ça — il sert l'instantané
// SERVEUR (rien de retenu) pendant l'hydratation, puis bascule sur celui du
// client une fois la page vivante. C'est la seule mécanique qui rende les deux
// rendus identiques sans mentir sur le contenu.
//
// Aucun abonnement : rien d'autre que cet écran n'écrit cette clé, et ses
// propres écritures passent par l'état React.
const noSubscribe = () => () => {}
const readMemory = () =>
  readRememberedSubject(
    typeof window === 'undefined' ? null : window.localStorage,
  )
const noMemory = () => null

function writeMemory(slug: string | undefined) {
  if (!slug) return
  rememberSubject(
    typeof window === 'undefined' ? null : window.localStorage,
    slug,
  )
}

export function useDuelSubject(): DuelSubjectValue {
  const value = useContext(DuelSubjectContext)
  if (!value) {
    throw new Error(
      'useDuelSubject doit être appelé sous <DuelSubjectProvider> (arène /defi).',
    )
  }
  return value
}

export default function DuelSubjectProvider({
  board,
  initialSlug,
  children,
}: {
  board: DuelSubject[]
  /** Matière présentée à l'ouverture (celle du chapitre en cours, en général). */
  initialSlug?: string | null
  children: ReactNode
}) {
  // Rien n'a encore été choisi DANS CETTE SESSION : la matière vient alors du
  // souvenir de la session précédente, à défaut de la déduction du serveur
  // (le chapitre en cours). Cet ordre est le point : un élève qui monte son
  // ladder d'histoire depuis trois jours ne veut pas retrouver « Maths » sous
  // COMBAT parce qu'il a lu une leçon de maths entre-temps.
  const [chosen, setChosen] = useState<number | null>(null)
  const remembered = useSyncExternalStore(noSubscribe, readMemory, noMemory)

  // L'index EFFECTIF, borné au plateau : le stockage peut retenir une matière
  // que le catalogue a depuis perdue (`boardIndex` retombe alors sur 0).
  const index = Math.min(
    Math.max(0, chosen ?? boardIndex(board, remembered ?? initialSlug)),
    Math.max(0, board.length - 1),
  )

  // Un seul point d'écriture pour les deux gestes : la feuille de la barre
  // d'action et la roulette de la Route des trophées y passent toutes les deux.
  const goTo = useCallback(
    (next: number) => {
      setChosen(next)
      writeMemory(board[next]?.slug)
    },
    [board],
  )

  const select = useCallback(
    (next: number) => {
      goTo(Math.max(0, Math.min(board.length - 1, next)))
    },
    [board.length, goTo],
  )

  const value = useMemo<DuelSubjectValue>(
    () => ({ board, index, active: board[index] ?? null, select }),
    [board, index, select],
  )

  return (
    <DuelSubjectContext.Provider value={value}>
      {children}
    </DuelSubjectContext.Provider>
  )
}
