'use client'

import { useMemo } from 'react'
import { avatarDataUri, type AvatarConfig } from '@/lib/avatar'
import { BannerArt, EquipmentArt } from '@/components/avatar/vestiaire-assets'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Rendu de l'avatar en couches, ordre fixe : bannière (optionnelle) → corps
// DiceBear (peau/coiffure/tenue, déjà composé en un SVG) → équipement porté.
// Réutilisable partout : grand dans le vestiaire, petit dans la hero card ou
// une top bar. La taille suit le conteneur (le parent fixe la largeur).
// -----------------------------------------------------------------------------

export default function AvatarRender({
  config,
  showBanner = false,
  className,
}: {
  config: AvatarConfig
  /** Affiche la bannière équipée derrière l'avatar (carte de profil). */
  showBanner?: boolean
  className?: string
}) {
  // 320 px de rendu : net jusqu'en grand format, mis en cache par config.
  const uri = useMemo(() => avatarDataUri(config, 320), [config])

  return (
    <div className={cn('relative aspect-square', className)}>
      {showBanner ? (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <BannerArt slug={config.banner} />
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={uri} alt="" className="relative size-full" />
      {config.equipment ? (
        <span className="absolute right-0 bottom-0 block size-[38%] drop-shadow-md">
          <EquipmentArt slug={config.equipment} />
        </span>
      ) : null}
    </div>
  )
}
