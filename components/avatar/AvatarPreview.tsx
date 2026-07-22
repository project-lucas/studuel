'use client'

import type { AvatarConfig } from '@/lib/avatar'
import AvatarRender from '@/components/avatar/AvatarRender'
import { BannerArt } from '@/components/avatar/vestiaire-assets'

// -----------------------------------------------------------------------------
// Zone haute du vestiaire : la bannière équipée remplit le fond, l'avatar
// trône au centre, prénom + niveau dessous. Chaque changement de config
// remonte `popKey` : la clé React rejoue le micro-pop (150 ms).
// -----------------------------------------------------------------------------

export default function AvatarPreview({
  config,
  name,
  levelLabel,
  popKey,
}: {
  config: AvatarConfig
  name: string
  levelLabel: string
  popKey: number
}) {
  return (
    <div className="relative flex h-full flex-col items-center justify-end overflow-hidden pb-4">
      {/* Bannière plein fond, voile en bas pour asseoir le texte. */}
      <div className="absolute inset-0" aria-hidden="true">
        <BannerArt slug={config.banner} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div key={popKey} className="avatar-pop relative w-36 sm:w-44">
        <AvatarRender config={config} className="drop-shadow-lg" />
      </div>

      <div className="relative mt-2 text-center text-white drop-shadow-sm">
        <p className="font-heading text-xl leading-tight font-extrabold">{name}</p>
        <p className="text-xs font-bold text-white/90">{levelLabel}</p>
      </div>
    </div>
  )
}
