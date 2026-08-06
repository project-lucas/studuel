'use client'

import { NotebookPen } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * La porte d'entrée de « Mon carnet » (cours façon Wooflash) : un bouton-icône
 * rond collé à la loupe de la rangée de commandes — même robe que les autres
 * commandes flottantes de l'accueil. L'ancienne tuile pleine largeur en bas de
 * page doublait visuellement les dossiers et poussait le carnet sous le pli.
 * Le résumé (n cours · n questions) reste annoncé aux lecteurs d'écran via
 * l'aria-label. Le volet actif vit dans l'URL (`?espace=carnet`), même
 * mécanique que ReviserSpaces.
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
      aria-label={`Mon carnet — ${summary}`}
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
    >
      <NotebookPen className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
    </button>
  )
}
