'use client'

import { useEffect, useRef, useState } from 'react'
import BackButton from '@/components/BackButton'
import { cn } from '@/lib/utils'
import type { SubjectProgress } from '@/lib/subject-template'

/**
 * Barre compacte de la page matière : elle prend le relais du grand header dès
 * qu'il quitte l'écran.
 *
 * Pourquoi : le header fait ~210 px (retour, monnaies, icône, titre, programme,
 * classement, barre, onglets). Sur un petit téléphone il ne restait que trois
 * chapitres visibles, et une fois descendu dans la liste l'élève perdait à la
 * fois le nom de la matière, sa progression et le chemin du retour. En 44 px,
 * les trois reviennent.
 *
 * La sentinelle (1 px, posée juste sous le header) évite d'écouter le scroll :
 * l'IntersectionObserver ne réveille le composant qu'aux deux basculements.
 */
export default function SubjectStickyBar({
  name,
  progress,
  gardien = null,
}: {
  name: string
  progress: SubjectProgress
  /**
   * L'écusson du gardien, repris ici en petit. Sans lui, l'anneau s'évaporerait
   * dès qu'on descend dans la liste des chapitres — c'est-à-dire pendant tout
   * le travail qui le remplit.
   */
  gardien?: React.ReactNode
}) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      // Le seuil suit la hauteur du HUD mobile (h-14) : la barre apparaît
      // pile quand le header passe dessous, pas avant.
      { rootMargin: '-56px 0px 0px 0px', threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div
        className={cn(
          // Mobile seulement, comme le HUD sous lequel elle se range : sur
          // desktop la sidebar occupe la gauche, un bandeau pleine largeur y
          // passerait par-dessus — et le header entier y tient déjà à l'écran.
          'fixed inset-x-0 top-14 z-30 border-b bg-card/95 backdrop-blur-md transition-all duration-200 md:hidden',
          stuck
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-full opacity-0',
        )}
        // Décorative tant qu'elle est masquée : rien à annoncer, rien à tabuler.
        aria-hidden={!stuck}
        inert={!stuck}
      >
        <div className="mx-auto flex h-11 w-full max-w-4xl items-center gap-3 px-4">
          <BackButton
            fallback="/reviser"
            label="Retour aux matières"
            className="size-8 bg-transparent shadow-none"
          />
          <span className="font-heading min-w-0 flex-1 truncate font-bold">
            {name}
          </span>
          {gardien}
          <span className="flex shrink-0 items-center gap-2">
            <span
              className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${name} — ${progress.pct}% travaillé`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.pct}
            >
              <span
                className="block h-full rounded-full bg-highlight transition-all"
                style={{ width: `${progress.pct}%` }}
              />
            </span>
            <span className="text-xs font-bold text-muted-foreground tabular-nums">
              {progress.pct}%
            </span>
          </span>
        </div>
      </div>
    </>
  )
}
