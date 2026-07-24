'use client'

import { useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { X, Pencil, Check, GraduationCap, Shield } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import RankBadge from '@/components/defi/RankBadge'
import ProfileBannerArt from '@/components/defi/ProfileBannerArt'
import StatDashboard from '@/components/defi/StatDashboard'
import BadgeGallery from '@/components/defi/BadgeGallery'
import ProfileEditor from '@/components/defi/ProfileEditor'
import { useDialog } from '@/lib/use-dialog'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { MAX_EQUIPPED } from '@/lib/badges'
import type { ProfileData } from '@/app/defi/profile-actions'
import { sfx } from '@/lib/sounds'

// La modale de profil plein écran (façon Clash Royale) : en-tête bannière +
// avatar + identité, puis stats et badges. Le bouton crayon bascule en édition
// (pseudo, bannière, badges à mettre en avant).
export default function ProfileModal({
  data,
  onClose,
}: {
  data: ProfileData
  onClose: () => void
}) {
  const panelRef = useDialog(onClose)
  const [editing, setEditing] = useState(false)
  const [equipped, setEquipped] = useState<string[]>(data.equippedBadgeIds)
  const [banner, setBanner] = useState<string | null>(data.profileBanner)
  const [, startTransition] = useTransition()

  const earnedIds = new Set(data.badges.filter((b) => b.earned).map((b) => b.id))

  // Équiper/retirer un badge : maj optimiste (ordre conservé, ≤3), puis
  // persistance serveur qui re-nettoie contre les badges réellement acquis.
  const toggleEquip = (id: string) => {
    if (!earnedIds.has(id)) return
    setEquipped((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_EQUIPPED
          ? prev
          : [...prev, id]
      sfx.tap()
      startTransition(async () => {
        const r = await setEquippedBadges(next)
        if (r.ok && r.equipped) setEquipped(r.equipped)
      })
      return next
    })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      role="presentation"
    >
      {/* Voile */}
      <button
        type="button"
        aria-label="Fermer le profil"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Panneau */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Profil de ${data.displayName}`}
        className="defi-arena-bg relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl ring-1 ring-white/15 sm:rounded-3xl"
      >
        {/* En-tête bannière + avatar + identité */}
        <header className="relative h-40 shrink-0">
          <ProfileBannerArt banner={banner} />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="olympe-press absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <X className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 p-3">
            <div className="size-20 shrink-0 rounded-2xl bg-white/10 p-1 ring-2 ring-white/30 backdrop-blur">
              <AvatarRender config={data.avatar} />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="font-heading truncate text-xl font-extrabold text-white">
                {data.displayName}
              </h2>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-semibold text-white/70">
                {data.gradeLabel ? (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3.5" aria-hidden="true" />
                    {data.gradeLabel}
                  </span>
                ) : null}
                {data.schoolName ? (
                  <span className="flex min-w-0 items-center gap-1">
                    <Shield className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{data.schoolName}</span>
                  </span>
                ) : null}
              </div>
            </div>
            {/* Blason de rang */}
            <div className="shrink-0 pb-1">
              <RankBadge rank={data.summary.rank} size={52} />
            </div>
          </div>
        </header>

        {/* Corps défilant */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/60">
              {data.summary.rank.label} · Niveau {data.summary.level}
            </p>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setEditing((v) => !v)
              }}
              aria-pressed={editing}
              className="olympe-press flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white ring-1 ring-white/20"
            >
              {editing ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> Terminé
                </>
              ) : (
                <>
                  <Pencil className="size-4" aria-hidden="true" /> Éditer
                </>
              )}
            </button>
          </div>

          {editing ? (
            <ProfileEditor
              gamertag={data.gamertag}
              currentBanner={banner}
              availableBanners={data.availableBanners}
              onBannerChange={setBanner}
            />
          ) : (
            <StatDashboard summary={data.summary} />
          )}

          <BadgeGallery
            badges={data.badges}
            equippedIds={equipped}
            editing={editing}
            onToggle={toggleEquip}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
