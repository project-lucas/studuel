'use client'

import { useMemo } from 'react'
import { Check, Lock } from 'lucide-react'
import { avatarDataUri, type AvatarConfig } from '@/lib/avatar'
import {
  applyItem,
  unlockLabel,
  type AvatarItem,
  type ItemState,
} from '@/lib/avatar-studio'
import { BannerArt, EquipmentArt } from '@/components/avatar/vestiaire-assets'
import CoinIcon from '@/components/ui/CoinIcon'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Vignette d'un item du catalogue : l'objet isolé sur fond pastel arrondi, et
// son état — équipé (bordure violette + check), possédé (tap = équipé),
// achetable (pill prix jaune), verrouillé (grisé + cadenas + condition).
// -----------------------------------------------------------------------------

/** Aperçu selon la catégorie : pastille couleur, mini-avatar, objet ou fond. */
function TileArt({ item, config }: { item: AvatarItem; config: AvatarConfig }) {
  // Coiffures et tenues : l'avatar ACTUEL portant cette option — l'élève voit
  // exactement ce que ça donne (même approche que l'ancien éditeur). Mémoïsé :
  // on ne régénère pas les SVG à chaque re-rendu de la grille.
  const thumb = useMemo(() => {
    if (item.category !== 'hair_style' && item.category !== 'outfit') return null
    // Sans la bannière ni l'équipement : seul l'item de la vignette compte.
    return avatarDataUri({ ...applyItem(config, item), equipment: '' }, 96)
  }, [item, config])

  switch (item.category) {
    case 'body_skin':
    case 'hair_color':
      return (
        <span
          className="size-10 rounded-full border border-black/10 shadow-inner"
          style={{ backgroundColor: `#${item.assetKey}` }}
          aria-hidden="true"
        />
      )
    case 'hair_style':
    case 'outfit':
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={thumb ?? undefined} alt="" aria-hidden="true" className="size-full object-contain" />
    case 'equipment':
      return (
        <span className="block size-12" aria-hidden="true">
          <EquipmentArt slug={item.assetKey} />
        </span>
      )
    case 'banner':
      return (
        <span className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
          <BannerArt slug={item.assetKey} />
        </span>
      )
  }
}

export default function ItemTile({
  item,
  state,
  config,
  onTap,
}: {
  item: AvatarItem
  state: ItemState
  config: AvatarConfig
  onTap: (item: AvatarItem, state: ItemState) => void
}) {
  const locked = state === 'locked'
  const label =
    state === 'equipped'
      ? `${item.name} — équipé`
      : state === 'buyable'
        ? `Acheter ${item.name} pour ${item.price} pièces`
        : locked && item.unlock
          ? `${item.name} — verrouillé (${unlockLabel(item.unlock)})`
          : `Équiper ${item.name}`

  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <button
        type="button"
        aria-label={label}
        aria-pressed={state === 'equipped'}
        onClick={() => onTap(item, state)}
        className={cn(
          'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-primary/8 transition-all active:scale-95',
          state === 'equipped'
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-transparent hover:border-primary/30',
          locked && 'opacity-60 grayscale',
        )}
      >
        <TileArt item={item} config={config} />

        {state === 'equipped' ? (
          <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={3.5} aria-hidden="true" />
          </span>
        ) : null}

        {state === 'buyable' ? (
          <span className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-full bg-highlight px-1.5 py-0.5 text-[11px] font-extrabold text-foreground shadow-sm">
            <CoinIcon className="size-3" />
            {item.price}
          </span>
        ) : null}

        {locked ? (
          <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-foreground/70 text-white">
            <Lock className="size-3" aria-hidden="true" />
          </span>
        ) : null}
      </button>

      <p className="w-full truncate text-center text-[11px] font-bold text-muted-foreground">
        {locked && item.unlock ? unlockLabel(item.unlock) : item.name}
      </p>
    </div>
  )
}
