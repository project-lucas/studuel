'use client'

import type { ReactNode } from 'react'
import { useLinkStatus } from 'next/link'
import { cn } from '@/lib/utils'
import s from './BanniereMatiere.module.css'

/**
 * LE TÉMOIN D'UN LIEN TOUCHÉ. Posé DANS un `<Link>`, il fait respirer son
 * contenu le temps que la page arrive (`useLinkStatus`) : sur un téléphone, un
 * bouton qui ne répond pas dans les cent millisecondes se retouche — et la
 * seconde frappe tombe sur la page suivante.
 *
 * Rien ne bouge quand la page est déjà là (lien préchargé) : l'animation ne
 * part qu'après 120 ms, opacité seule.
 */
export default function Attente({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { pending } = useLinkStatus()
  return (
    <span className={cn(className, pending ? s.attente : null)} aria-busy={pending || undefined}>
      {children}
    </span>
  )
}
