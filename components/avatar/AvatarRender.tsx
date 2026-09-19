'use client'

import { useMemo } from 'react'
import { avatarDataUri, avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
import { PORTRAIT_FACE_CROP } from '@/lib/portraits'
import { BannerArt, EquipmentArt } from '@/components/avatar/vestiaire-assets'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Rendu de l'avatar en couches, ordre fixe : bannière (optionnelle) → corps
// (blason peint OU avatar DiceBear composé) → équipement porté.
// Réutilisable partout : grand dans le vestiaire, petit dans la hero card ou
// une top bar. La taille suit le conteneur (le parent fixe la largeur).
//
// LE BLASON A DEUX FORMES (lib/portraits.ts). Un portrait choisi est un ÉCU,
// pas un disque : entier, il veut un cadre carré (la carte Moi, le vestiaire,
// la grille de l'onboarding) ; dans un rond (couloir du duel, ligne du
// classement, onglet de la barre) on ne garde que le VISAGE, zoomé. Le parent
// dit ce qu'il est — `forme="blason"` là où le cadre est carré ; par défaut,
// le visage, parce que la plupart des cadres de l'app sont ronds et qu'un écu
// rogné par un cercle ne ressemble à rien. Sans portrait, la forme est sans
// effet : DiceBear dessine déjà un disque.
// -----------------------------------------------------------------------------

export default function AvatarRender({
  config,
  showBanner = false,
  forme = 'visage',
  className,
}: {
  config: AvatarConfig
  /** Affiche la bannière équipée derrière l'avatar (carte de profil). */
  showBanner?: boolean
  /** Portrait : l'écu entier (cadre carré) ou le visage seul (cadre rond). */
  forme?: 'blason' | 'visage'
  className?: string
}) {
  const portrait = avatarPortraitSrc(config)
  // 320 px de rendu : net jusqu'en grand format, mis en cache par config.
  // Pas composé quand un blason le remplace — DiceBear n'est pas gratuit.
  const uri = useMemo(() => (portrait ? null : avatarDataUri(config, 320)), [config, portrait])

  return (
    <div className={cn('relative aspect-square', className)}>
      {showBanner ? (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <BannerArt slug={config.banner} />
        </div>
      ) : null}
      {portrait ? (
        forme === 'blason' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait} alt="" className="relative size-full object-contain" />
        ) : (
          <span className="relative block size-full overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait}
              alt=""
              className="absolute max-w-none object-contain"
              style={PORTRAIT_FACE_CROP}
            />
          </span>
        )
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={uri ?? undefined} alt="" className="relative size-full" />
      )}
      {config.equipment ? (
        <span className="absolute right-0 bottom-0 block size-[38%] drop-shadow-md">
          <EquipmentArt slug={config.equipment} />
        </span>
      ) : null}
    </div>
  )
}
