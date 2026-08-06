'use client'

import { useState, useTransition } from 'react'
import { Check, Lock, Loader2 } from 'lucide-react'
import { PROFILE_BANNERS } from '@/lib/profile-banners'
import { updateGamertag, equipProfileBanner } from '@/app/defi/profile-actions'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// Édition inline du profil : pseudo de jeu + choix de bannière. Les badges
// s'équipent dans la galerie (mode édition), pas ici. L'avatar renvoie au
// vestiaire (/moi/avatar) — géré par la modale.
export default function ProfileEditor({
  gamertag,
  currentBanner,
  availableBanners,
  onBannerChange,
}: {
  gamertag: string | null
  currentBanner: string | null
  availableBanners: string[]
  /** Remonte la bannière équipée pour un aperçu immédiat dans l'en-tête. */
  onBannerChange: (key: string) => void
}) {
  const [name, setName] = useState(gamertag ?? '')
  const [nameMsg, setNameMsg] = useState<string | null>(null)
  const [savedName, setSavedName] = useState(false)
  const [banner, setBanner] = useState(currentBanner)
  const [pending, startTransition] = useTransition()

  const owned = new Set(availableBanners)

  const saveName = () => {
    setNameMsg(null)
    setSavedName(false)
    startTransition(async () => {
      const r = await updateGamertag(name)
      if (r.ok) {
        setSavedName(true)
        sfx.correct()
      } else {
        setNameMsg(r.error ?? 'Erreur.')
        sfx.wrong()
      }
    })
  }

  const chooseBanner = (key: string) => {
    if (!owned.has(key) || key === banner) return
    const prev = banner
    setBanner(key)
    onBannerChange(key)
    sfx.tap()
    startTransition(async () => {
      const r = await equipProfileBanner(key)
      if (!r.ok) {
        setBanner(prev ?? null)
        if (prev) onBannerChange(prev)
        sfx.wrong()
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pseudo de jeu */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="gamertag"
          className="font-heading text-sm font-extrabold tracking-wide text-white uppercase"
        >
          Pseudo de jeu
        </label>
        <div className="flex gap-2">
          <input
            id="gamertag"
            value={name}
            maxLength={16}
            onChange={(e) => {
              setName(e.target.value)
              setSavedName(false)
            }}
            placeholder="Ton pseudo"
            className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/20 placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-highlight focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={saveName}
            disabled={pending || name.trim() === (gamertag ?? '')}
            className="olympe-press flex items-center gap-1 rounded-xl bg-highlight px-3 py-2 text-sm font-extrabold text-foreground disabled:opacity-40"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : savedName ? (
              <Check className="size-4" aria-hidden="true" />
            ) : null}
            {savedName ? 'Enregistré' : 'Valider'}
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={cn('text-[11px]', nameMsg ? 'text-red-300' : 'sr-only')}
        >
          {nameMsg ?? ''}
        </p>
      </div>

      {/* Bannière */}
      <div className="flex flex-col gap-1.5">
        <p className="font-heading text-sm font-extrabold tracking-wide text-white uppercase">
          Bannière
        </p>
        <ul className="grid grid-cols-2 gap-2" role="list">
          {PROFILE_BANNERS.map((b) => {
            const isOwned = owned.has(b.key)
            const isCurrent = b.key === banner
            return (
              <li key={b.key}>
                <button
                  type="button"
                  disabled={!isOwned || pending}
                  onClick={() => chooseBanner(b.key)}
                  aria-pressed={isCurrent}
                  aria-label={`Bannière ${b.name}${isOwned ? '' : ' (verrouillée)'}`}
                  className={cn(
                    'relative flex h-16 w-full items-end overflow-hidden rounded-xl p-1.5 text-left transition-transform',
                    isOwned ? 'active:scale-95' : 'cursor-not-allowed',
                    isCurrent && 'ring-2 ring-highlight',
                  )}
                  style={{
                    background: `linear-gradient(160deg, ${b.from}, ${b.to})`,
                  }}
                >
                  <span className="relative z-10 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {b.name}
                  </span>
                  {isCurrent ? (
                    <Check
                      className="absolute right-1 top-1 z-10 size-4 text-highlight"
                      aria-hidden="true"
                    />
                  ) : null}
                  {!isOwned ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Lock className="size-4 text-white/80" aria-hidden="true" />
                    </span>
                  ) : null}
                  {b.rarity === 'legendary' ? (
                    <span className="absolute right-1 bottom-1 z-10 rounded bg-highlight px-1 text-[8px] font-extrabold text-foreground uppercase">
                      Légendaire
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="text-[11px] leading-snug text-white/50">
          Débloque de nouvelles bannières par la progression ou en Boutique.
        </p>
      </div>
    </div>
  )
}
