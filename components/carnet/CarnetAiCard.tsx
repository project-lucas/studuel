'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import CreateCourseSheet from '@/components/carnet/CreateCourseSheet'

/**
 * La carte « Ton cours → questions » du carnet : l'argument massue (l'IA rédige
 * les questions, l'élève valide) sortait de sa cachette derrière le « + ».
 * Elle ouvre la même feuille de création que le bouton flottant — le nom
 * d'abord, puis la voie IA.
 */
export default function CarnetAiCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center gap-3 rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_22%)] p-4 text-left text-primary-foreground shadow-sm transition active:scale-[0.99]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/16 text-2xl">
          ✨
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block text-[0.95rem] leading-snug font-extrabold">
            Ton cours → questions
          </span>
          <span className="mt-0.5 block text-xs text-primary-foreground/80">
            Colle ton cours, l&apos;IA rédige les questions. Tu valides. 2 min.
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-highlight px-3 py-1.5 text-xs font-extrabold text-foreground">
          <Sparkles className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          Essayer
        </span>
      </button>

      <CreateCourseSheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
