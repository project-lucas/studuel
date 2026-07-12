'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'

// Chronomètre du Défi : démarre dès l'affichage de la page, ne compte que
// lorsque l'onglet est visible, et verse régulièrement le temps mesuré au
// compteur de travail (onglet Moi). Verse aussi le reliquat en quittant.
export default function DefiTimer() {
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

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div
      className="inline-flex w-fit items-center gap-3 rounded-2xl border bg-gradient-to-br from-card to-muted/50 px-3.5 py-2 shadow-sm"
      role="timer"
      aria-label={`Temps de travail de la session : ${mm} minutes ${ss} secondes`}
    >
      {/* Horloge dans une pastille, avec un point qui pulse au coin. */}
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock className="size-4.5" strokeWidth={2.2} />
        <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-highlight ring-2 ring-card" />
        </span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-mono text-lg font-bold tabular-nums">
          {mm}:{ss}
        </span>
        <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Temps de travail
        </span>
      </span>
    </div>
  )
}
