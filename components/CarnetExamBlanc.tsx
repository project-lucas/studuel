'use client'

import Link from 'next/link'
import { GraduationCap, ChevronRight } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * CTA « Examen blanc » (espace Mon carnet) : lance la simulation d'examen
 * existante (/reviser/examen-blanc) depuis l'espace de préparation.
 */
export default function CarnetExamBlanc() {
  return (
    <Link
      href="/reviser/examen-blanc"
      onClick={() => sfx.tap()}
      className="group flex items-center gap-3 rounded-3xl bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-4 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
        <GraduationCap className="size-6" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-base leading-tight font-bold">
          Examen blanc
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-white/75">
          Conditions réelles, bilan chapitre par chapitre
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}
