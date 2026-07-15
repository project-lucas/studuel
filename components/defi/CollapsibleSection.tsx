'use client'

import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDownIcon } from './icons'

interface CollapsibleSectionProps {
  /** Titre affiché dans l'en-tête cliquable. */
  title: string
  /** Picto de gauche (SVG ou emoji). */
  icon?: ReactNode
  /** Aperçu montré à droite quand la section est repliée (ex. ton rang). */
  preview?: ReactNode
  /** Ouvert au montage ? Par défaut replié (c'est tout l'intérêt). */
  defaultOpen?: boolean
  /** Libellé accessible de la section (défaut : le titre). */
  ariaLabel?: string
  children: ReactNode
}

/**
 * Section dépliable réutilisable (motif accordéon WAI-ARIA). En-tête = bouton
 * dans un `<h2>` avec `aria-expanded` / `aria-controls` ; le corps glisse en
 * hauteur (Framer, respecte `prefers-reduced-motion`). Sert à replier les blocs
 * secondaires de l'onglet Défi (classements, ligue) pour aérer le scroll.
 */
export default function CollapsibleSection({
  title,
  icon,
  preview,
  defaultOpen = false,
  ariaLabel,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const reduce = useReducedMotion()
  const bodyId = useId()

  return (
    <section className="defi2-card overflow-hidden" aria-label={ariaLabel ?? title}>
      <h2 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-highlight/40 focus-visible:outline-none"
        >
          {icon ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8 text-xl leading-none">
              {icon}
            </span>
          ) : null}

          <span className="min-w-0 flex-1">
            <span className="font-heading block truncate text-base leading-tight font-extrabold text-white">
              {title}
            </span>
          </span>

          {preview ? (
            <span
              className={`shrink-0 text-sm font-bold text-white/70 tabular-nums transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden={open}
            >
              {preview}
            </span>
          ) : null}

          <ChevronDownIcon
            className={`size-5 shrink-0 text-white/50 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={bodyId}
            key="body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/10"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
