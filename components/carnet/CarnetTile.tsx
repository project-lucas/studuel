'use client'

import { ChevronRight, NotebookPen } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * La porte d'entrée de « Mon carnet » (cours façon Wooflash) : une tuile dédiée
 * en bas de l'accueil, à la place de l'ancien segmented control d'en haut — un
 * étage de navigation en moins au-dessus de la mission. Le volet actif vit dans
 * l'URL (`?espace=carnet`), même mécanique que ReviserSpaces.
 */
export default function CarnetTile({
  coursesCount,
  questionsCount,
}: {
  coursesCount: number
  questionsCount: number
}) {
  const open = () => {
    sfx.tap()
    const url = new URL(window.location.href)
    url.searchParams.set('espace', 'carnet')
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0 })
  }

  const summary =
    coursesCount > 0
      ? `${coursesCount} cours · ${questionsCount} question${questionsCount > 1 ? 's' : ''}`
      : 'Crée tes cours et révise-les.'

  return (
    <button
      type="button"
      onClick={open}
      data-tour="carnet-switch"
      className="rev-card group flex w-full items-center gap-3 rounded-3xl bg-secondary p-4 text-left ring-1 ring-black/5 transition hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-sm"
      >
        <NotebookPen className="size-5.5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-base font-extrabold text-secondary-foreground">
          Mon carnet
        </span>
        <span className="block truncate text-xs font-semibold text-secondary-foreground/70">
          {summary}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
        strokeWidth={2.6}
      />
    </button>
  )
}
