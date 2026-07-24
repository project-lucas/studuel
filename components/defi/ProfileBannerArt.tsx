'use client'

import { useState } from 'react'
import { bannerFor } from '@/lib/profile-banners'
import { cn } from '@/lib/utils'

// Fond de bannière du profil : dégradé de repli TOUJOURS présent, surmonté du
// visuel illustré webp s'il existe (généré en phase 5). Si le webp manque
// encore (404), on retombe proprement sur le dégradé — jamais de trou blanc.
export default function ProfileBannerArt({
  banner,
  className,
  withImage = true,
}: {
  banner: string | null
  className?: string
  /** Tenter de charger le visuel webp par-dessus le dégradé. */
  withImage?: boolean
}) {
  const b = bannerFor(banner)
  const [broken, setBroken] = useState(false)

  return (
    <div
      className={cn('absolute inset-0', className)}
      style={{ background: `linear-gradient(160deg, ${b.from}, ${b.to})` }}
    >
      {withImage && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={b.image}
          alt=""
          aria-hidden="true"
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      ) : null}
    </div>
  )
}
