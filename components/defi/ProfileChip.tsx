'use client'

import { useState } from 'react'
import AvatarRender from '@/components/avatar/AvatarRender'
import ProfileBannerArt from '@/components/defi/ProfileBannerArt'
import ProfileModal from '@/components/defi/ProfileModal'
import { cardBadges } from '@/lib/badges'
import type { ProfileData } from '@/app/defi/profile-actions'
import { sfx } from '@/lib/sounds'

// La carte de profil compacte, ancrée en haut-gauche de l'arène (façon le
// « roi » de Clash Royale). Avatar sur sa bannière + pseudo + niveau, et jusqu'à
// 3 badges mis en avant. Un tap ouvre la modale complète.
export default function ProfileChip({ data }: { data: ProfileData }) {
  const [open, setOpen] = useState(false)
  const badges = cardBadges(data.badges, data.equippedBadgeIds)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Profil de ${data.displayName} — voir mes stats et badges`}
        className="olympe-press flex max-w-[62vw] items-center gap-2 rounded-2xl p-1 pr-2.5 text-left ring-1 ring-white/15 sm:max-w-xs"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      >
        {/* Avatar sur sa bannière de profil (miniature). */}
        <span className="relative block size-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/20">
          <ProfileBannerArt banner={data.profileBanner} />
          <span className="absolute inset-0 p-0.5">
            <AvatarRender config={data.avatar} className="size-full" />
          </span>
        </span>

        <span className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-sm font-extrabold text-white">
            {data.displayName}
          </span>
          {/* Le niveau de compte n'est PLUS répété ici : il vit une seule fois,
              dans le bandeau du haut (toujours visible) et dans la modale de
              profil. La ligne sous le pseudo ne porte donc que les badges mis en
              avant — chacun avec son intitulé en info-bulle + un libellé lisible
              par lecteur d'écran (plus d'icônes muettes). */}
          {badges.length > 0 ? (
            <span
              className="flex items-center gap-0.5"
              aria-label={`Badges : ${badges.map((b) => b.title).join(', ')}`}
            >
              {badges.map((b) => (
                <span
                  key={b.id}
                  className="text-xs leading-none"
                  title={b.title}
                  aria-hidden="true"
                >
                  {b.icon}
                </span>
              ))}
            </span>
          ) : null}
        </span>
      </button>

      {open ? <ProfileModal data={data} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
