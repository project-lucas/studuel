'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { School as SchoolIcon, X } from 'lucide-react'
import SchoolPicker from '@/components/SchoolPicker'
import { sfx } from '@/lib/sounds'
import { SCHOOL_LEVEL_LABEL, type School, type SchoolLevel } from '@/lib/clan'

// Bannière « clan » en tête des classements du Défi : montre l'école de l'élève
// (son clan) et permet d'en choisir/changer via le sélecteur d'école, ouvert en
// feuille. Après un changement, on rafraîchit pour recharger les classements.
export default function ClanBanner({
  level,
  current,
}: {
  level: SchoolLevel
  current: School | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const done = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        className="defi2-press flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-left backdrop-blur-sm focus-visible:ring-4 focus-visible:ring-highlight/40 focus-visible:outline-none"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-highlight/20 text-highlight">
          <SchoolIcon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          {current ? (
            <>
              <span className="block text-[0.7rem] font-bold tracking-wide text-white/55 uppercase">
                Ton clan · {SCHOOL_LEVEL_LABEL[level]}
              </span>
              <span className="font-heading block truncate text-base font-extrabold text-white">
                {current.name}
              </span>
            </>
          ) : (
            <>
              <span className="font-heading block text-base font-extrabold text-white">
                Rejoins ton école
              </span>
              <span className="block text-xs font-semibold text-white/55">
                Ton {SCHOOL_LEVEL_LABEL[level].toLowerCase()} devient ton clan au
                classement.
              </span>
            </>
          )}
        </span>
        <span className="shrink-0 rounded-full bg-highlight px-3 py-1.5 font-heading text-xs font-extrabold text-[oklch(0.24_0.06_75)]">
          {current ? 'Changer' : 'Choisir'}
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choisir mon école"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-extrabold text-foreground">
                Ton clan — ton {SCHOOL_LEVEL_LABEL[level].toLowerCase()}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
              >
                <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
            <SchoolPicker level={level} current={current} onChange={done} />
          </div>
        </div>
      ) : null}
    </>
  )
}
