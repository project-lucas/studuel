'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

/**
 * La flèche de retour de l'univers Défi : une PASTILLE RONDE FLOTTANTE calée en
 * haut à gauche, qui remplace partout les anciens boutons-TEXTE (« Retour à
 * l'Arène », « Retour aux modes »…). Un picto, pas une phrase — le sens du geste
 * se lit d'un coup d'œil, et l'écran de fin de partie garde sa seule action
 * inline qui compte (Rejouer).
 *
 * Position `fixed` aux MÊMES repères que le HUD de l'arène (voir ArenaHud), pour
 * tenir l'angle haut-gauche PEU IMPORTE LE FORMAT : sous la pastille « Niveau »
 * du bandeau flottant sur mobile (`top-14 left-3`), dégagée de la sidebar
 * (`w-64`) sur desktop (`md:top-4 md:left-[17rem]`).
 *
 * Deux emplois exclusifs : une ACTION (`onClick`, ex. le `onExit` d'un mode de
 * jeu) ou un LIEN (`href`, ex. retour vers /defi).
 */
export default function ArenaBackButton({
  onClick,
  href,
  label = 'Retour à l’Arène',
  className,
}: {
  onClick?: () => void
  href?: string
  label?: string
  className?: string
}) {
  const cls = cn(
    'fixed top-14 left-3 z-40 inline-flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-lg ring-1 ring-black/10 backdrop-blur-md transition-transform active:scale-95 md:top-4 md:left-[17rem]',
    className,
  )
  const icon = <ArrowLeft className="size-5" aria-hidden="true" />

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        onClick={() => sfx.back()}
        className={cls}
      >
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        sfx.back()
        onClick?.()
      }}
      className={cls}
    >
      {icon}
    </button>
  )
}
