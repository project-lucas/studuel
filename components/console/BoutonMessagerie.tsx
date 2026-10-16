'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Megaphone, MessageCircle, MessageSquarePlus, MessagesSquare } from 'lucide-react'

const RELECTURE_MS = 30_000

/**
 * L'ICÔNE MESSAGERIE DE LA CONSOLE (16/10/2026, Lucas : « une icône messagerie
 * pour que je puisse envoyer des messages à tous mes users, en coachant si
 * c'est pour mes coachés, si c'est pour les users de Studuel, ou à tout le
 * monde »). La pastille dit les messages non lus (relue toutes les 30 s tant
 * que l'onglet est visible) ; le menu mène aux conversations et à la diffusion.
 */
export default function BoutonMessagerie({ admin }: { admin: boolean }) {
  const [ouvert, setOuvert] = useState(false)
  const [nonLus, setNonLus] = useState(0)
  const boite = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let vivant = true
    const relire = () => {
      if (document.visibilityState !== 'visible') return
      fetch('/api/messagerie', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { nonLus?: number } | null) => {
          if (vivant && d) setNonLus(Number(d.nonLus ?? 0) || 0)
        })
        .catch(() => {})
    }
    relire()
    const id = setInterval(relire, RELECTURE_MS)
    document.addEventListener('visibilitychange', relire)
    return () => {
      vivant = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', relire)
    }
  }, [])

  useEffect(() => {
    if (!ouvert) return
    const fermer = (e: MouseEvent) => {
      if (boite.current && !boite.current.contains(e.target as Node)) setOuvert(false)
    }
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && setOuvert(false)
    document.addEventListener('mousedown', fermer)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('mousedown', fermer)
      document.removeEventListener('keydown', echap)
    }
  }, [ouvert])

  const entrees = [
    { href: '/coach/messages', icone: MessagesSquare, titre: 'Mes conversations', aide: nonLus > 0 ? `${nonLus} message${nonLus > 1 ? 's' : ''} non lu${nonLus > 1 ? 's' : ''}` : 'Élèves et parents' },
    { href: '/coach/messages?nouveau=1', icone: MessageSquarePlus, titre: 'Nouvelle conversation', aide: 'Avec un élève, un parent, ou les deux' },
    { href: '/coach/diffusion', icone: Megaphone, titre: admin ? 'Message à un public' : 'Message à mes élèves', aide: admin ? 'Coachés, gratuits, Studuel+, parents, tout le monde' : 'Tous tes coachés ou un groupe' },
    { href: '/coach/diffusion?type=sondage', icone: ClipboardList, titre: 'Nouveau sondage', aide: 'Pour mieux connaître les élèves' },
  ]

  return (
    <div ref={boite} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-haspopup="menu"
        aria-label={nonLus > 0 ? `Messagerie, ${nonLus} non lus` : 'Messagerie'}
        className="relative grid size-11 place-items-center rounded-full bg-card shadow-sm ring-1 ring-primary/15 transition-colors hover:bg-secondary"
      >
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        {nonLus > 0 ? (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[11px] font-extrabold text-white tabular-nums">
            {nonLus > 99 ? '99+' : nonLus}
          </span>
        ) : null}
      </button>
      {ouvert ? (
        <div role="menu" className="absolute top-13 right-0 z-40 w-80 rounded-2xl border bg-card p-2 shadow-xl">
          {entrees.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              role="menuitem"
              onClick={() => setOuvert(false)}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary"
            >
              <e.icone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">{e.titre}</span>
                <span className="block truncate text-xs font-semibold text-muted-foreground">{e.aide}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
