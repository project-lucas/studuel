'use client'

import { useEffect, useRef, useState } from 'react'

// Cœur du chronomètre de temps de travail : compte les secondes tant que
// l'onglet est visible et les verse à /api/work-time (fetch keepalive pendant
// la session, sendBeacon en sortie de page pour ne rien perdre sur mobile).
// Partagé par le chrono VISIBLE du Défi (DefiTimer) et le compteur INVISIBLE de
// Réviser (WorkTimer) — pour que « temps de révision » de l'espace parents
// reflète aussi le travail fait hors Défi. Voir [[temps-de-travail]].
export function useWorkTimer(): number {
  const [seconds, setSeconds] = useState(0)
  // Secondes comptées mais pas encore envoyées au serveur.
  const unsavedRef = useRef(0)

  useEffect(() => {
    // Versement périodique : fetch keepalive, pour pouvoir remettre les
    // secondes en attente si le réseau échoue.
    const flush = () => {
      const n = unsavedRef.current
      if (n <= 0) return
      unsavedRef.current = 0
      fetch('/api/work-time', {
        method: 'POST',
        body: String(n),
        keepalive: true,
      })
        .then((r) => {
          if (!r.ok) unsavedRef.current += n
        })
        .catch(() => {
          unsavedRef.current += n
        })
    }

    // Versement de sortie : sendBeacon — le navigateur garantit l'envoi même
    // quand la page se ferme (un fetch y est souvent tué sur mobile).
    const flushOnExit = () => {
      const n = unsavedRef.current
      if (n <= 0) return
      if (navigator.sendBeacon?.('/api/work-time', String(n))) {
        unsavedRef.current = 0
      } else {
        flush() // vieux navigateur : au moins un fetch keepalive
      }
    }

    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setSeconds((s) => s + 1)
      unsavedRef.current += 1
      if (unsavedRef.current >= 20) flush() // versement toutes les ~20 s
    }, 1000)

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushOnExit()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flushOnExit)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flushOnExit)
      flushOnExit() // sortie de page (navigation interne)
    }
  }, [])

  return seconds
}
