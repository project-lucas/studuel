'use client'

import Link from 'next/link'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { sfx } from '@/lib/sounds'

// Bannière « Examen blanc de [Matière] » (conservée du template précédent) :
// conditions réelles, bilan chapitre par chapitre.
export default function ExamBanner({
  subject,
}: {
  subject: { slug: string; name: string }
}) {
  return (
    <Link
      href={`/reviser/examen-blanc?subject=${subject.slug}`}
      onClick={() => sfx.tap()}
      className="group mt-3 flex items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-3.5 text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <GraduationCap className="size-5.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-sm leading-tight font-bold">
          Examen blanc de {subject.name}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
          Conditions réelles · bilan chapitre par chapitre
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}
