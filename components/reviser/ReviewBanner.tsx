'use client'

import Link from 'next/link'
import { ChevronRight, Flame } from 'lucide-react'
import { sfx } from '@/lib/sounds'

// Bloc « À revoir » en tête de la vue Chapitres : visible SEULEMENT si des
// notions faibles sont détectées (file SRS de la matière), masqué sinon.
// Le CTA lance la session ciblée existante (/reviser/revoir).
export default function ReviewBanner({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <Link
      href="/reviser/revoir"
      onClick={() => sfx.tap()}
      className="group mt-3 flex items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-destructive p-3.5 text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Flame className="size-5.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-sm leading-tight font-bold">
          {count} notion{count > 1 ? 's' : ''} à revoir
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
          Une session ciblée pour les remettre en tête
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}
