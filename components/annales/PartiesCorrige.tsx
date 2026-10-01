'use client'

import { useState, type ReactNode } from 'react'
import { sfx } from '@/lib/sounds'

/**
 * Les parties d'une annale (Sujet 1 · Sujet 2 · Explication, Exercice 1…4) :
 * une rangée de pilules, et UNE partie visible à la fois — un élève traite un
 * sujet de philosophie, pas les trois, et quatre exercices de maths à la suite
 * font un défilement sans fin.
 *
 * Les panneaux sont rendus par le serveur (KaTeX compris) et tous montés : on
 * les cache, on ne les reconstruit pas. La partie choisie vit dans l'URL
 * (`?partie=`, écrite par `history.replaceState`) : un retour depuis le sujet
 * rouvre celle qu'on lisait.
 */
export default function PartiesCorrige({
  parties,
  initiale,
}: {
  parties: { id: string; titre: string; contenu: ReactNode }[]
  initiale: string | null
}) {
  const [active, setActive] = useState(
    parties.some((p) => p.id === initiale) ? (initiale as string) : parties[0]?.id,
  )

  function choisir(id: string) {
    if (id === active) return
    sfx.tap()
    setActive(id)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('partie', id)
      window.history.replaceState(window.history.state, '', url)
    } catch {
      // L'URL n'est qu'une commodité : sans elle, la partie reste choisie.
    }
    document.getElementById('corrige-debut')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  return (
    <div id="corrige-debut" className="scroll-mt-20">
      {parties.length > 1 ? (
        <div
          role="tablist"
          aria-label="Parties du sujet"
          className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
        >
          {parties.map((p) => {
            const on = p.id === active
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`partie-${p.id}`}
                onClick={() => choisir(p.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                  on
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border bg-card text-foreground/80 hover:bg-secondary'
                }`}
              >
                {p.titre}
              </button>
            )
          })}
        </div>
      ) : null}
      {parties.map((p) => (
        <div key={p.id} id={`partie-${p.id}`} role="tabpanel" hidden={p.id !== active}>
          {p.contenu}
        </div>
      ))}
    </div>
  )
}
