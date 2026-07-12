'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Garde-fou du retour matériel (geste/bouton Android, balayage iOS) : sans
// lui, un « retour » de trop sur la page d'entrée quitte l'application —
// exactement le défaut constaté sur l'app concurrente.
//
// Principe : au chargement, l'entrée d'entrée est marquée « plancher » et une
// entrée tampon identique est poussée par-dessus. Quand l'élève dépile tout
// l'historique interne et retombe sur le plancher (il allait sortir de
// l'app), on le ramène à l'accueil à la place. S'il insiste depuis
// l'accueil, le retour suivant quitte vraiment — comme une app native.
const FLOOR_FLAG = '__scolariaFloor'

export default function BackGuard() {
  const router = useRouter()

  useEffect(() => {
    // Arme le plancher une seule fois par chargement (l'état est cloné pour
    // préserver les clés internes du router Next).
    const state = window.history.state ?? {}
    if (state[FLOOR_FLAG] === undefined) {
      window.history.replaceState(
        { ...state, [FLOOR_FLAG]: true },
        '',
        window.location.href,
      )
      window.history.pushState(
        { ...state, [FLOOR_FLAG]: false },
        '',
        window.location.href,
      )
    }

    const onPop = (e: PopStateEvent) => {
      if (e.state?.[FLOOR_FLAG] !== true) return
      // L'élève vient de retomber sur le plancher : un retour de plus
      // quitterait l'app. On désarme (une interception par chargement,
      // pas de piège infini) et on le garde dans l'app.
      window.history.replaceState(
        { ...e.state, [FLOOR_FLAG]: false },
        '',
        window.location.href,
      )
      if (window.location.pathname !== '/') router.push('/')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [router])

  return null
}
