'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Une icône flottante de l'écran d'arène. Deux comportements exclusifs :
 * - `href` : simple raccourci de navigation (ex. l'orbe Amis → onglet Amis) ;
 * - `sheetContent` : ouvre une feuille ancrée en bas par-dessus l'arène.
 */
export interface OrbItem {
  id: string
  /** Libellé court affiché sous le disque. */
  label: string
  /** Picto du disque (SVG dimensionné par l'appelant, ou emoji). */
  icon: ReactNode
  /** Pastille corail en haut à droite du disque (compteur, « ! »…). */
  badge?: string
  /** Aperçu sous le libellé (rang, minuterie…), en jeton sombre. */
  sub?: string
  /** Navigation directe — exclusif de `sheetContent`. */
  href?: string
  /** Titre de la feuille (défaut : le libellé). */
  sheetTitle?: string
  /** Contenu de la feuille ouverte au tap. */
  sheetContent?: ReactNode
}

interface ArenaHudProps {
  /** Colonne d'orbes de gauche (compétition). */
  leftOrbs: OrbItem[]
  /** Colonne d'orbes de droite (social). */
  rightOrbs: OrbItem[]
  /** Le centre de la scène (arène, mascotte, trophées). */
  children: ReactNode
}

/**
 * La scène de l'onglet Défi : le centre est dégagé pour l'arène, les entrées
 * secondaires flottent en orbes sur les bords (façon écran d'accueil Clash
 * Royale). Un tap sur un orbe ouvre une feuille ancrée en bas — le contenu
 * (ligue, classements…) est fourni par le serveur via `sheetContent`.
 */
export default function ArenaHud({
  leftOrbs,
  rightOrbs,
  children,
}: ArenaHudProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const open =
    [...leftOrbs, ...rightOrbs].find((o) => o.id === openId && o.sheetContent) ??
    null

  // Fermeture au clavier (Échap), comme les autres modales de l'app.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative min-h-0 flex-1">
      {/* Colonnes d'orbes, par-dessus le décor mais sous les feuilles. */}
      <div className="absolute top-1 left-0 z-10 flex flex-col gap-4">
        {leftOrbs.map((orb) => (
          <OrbButton key={orb.id} orb={orb} onOpen={setOpenId} />
        ))}
      </div>
      <div className="absolute top-1 right-0 z-10 flex flex-col gap-4">
        {rightOrbs.map((orb) => (
          <OrbButton key={orb.id} orb={orb} onOpen={setOpenId} />
        ))}
      </div>

      {/* Le centre, dégagé entre les deux colonnes. */}
      <div className="flex h-full items-center justify-center px-16">
        {children}
      </div>

      {/* Feuille ancrée en bas — portail pour échapper à l'overflow du layout. */}
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key={open.id}
                  className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label={open.sheetTitle ?? open.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setOpenId(null)}
                >
                  <motion.div
                    className="defi3-sheet w-full max-w-md"
                    initial={reduce ? { opacity: 0 } : { y: '100%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    exit={reduce ? { opacity: 0 } : { y: '100%' }}
                    transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8 leading-none"
                        aria-hidden
                      >
                        {open.icon}
                      </span>
                      <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                        {open.sheetTitle ?? open.label}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        aria-label="Fermer"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 active:scale-90"
                      >
                        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="max-h-[72dvh] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
                      {open.sheetContent}
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  )
}

function OrbButton({
  orb,
  onOpen,
}: {
  orb: OrbItem
  onOpen: (id: string) => void
}) {
  const face = (
    <>
      <span className="defi3-orb relative">
        {orb.icon}
        {orb.badge ? (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white/85 bg-destructive px-1 text-[0.6rem] font-extrabold text-white">
            {orb.badge}
          </span>
        ) : null}
      </span>
      <span className="defi3-orb-label max-w-20 truncate">{orb.label}</span>
      {orb.sub ? (
        <span className="max-w-20 truncate rounded-md bg-black/45 px-1.5 py-0.5 text-[0.55rem] font-extrabold text-highlight">
          {orb.sub}
        </span>
      ) : null}
    </>
  )

  const className =
    'defi2-press flex w-16 cursor-pointer flex-col items-center gap-1 focus-visible:outline-none focus-visible:[&>.defi3-orb]:ring-4 focus-visible:[&>.defi3-orb]:ring-highlight/50'

  if (orb.href) {
    return (
      <Link
        href={orb.href}
        onClick={() => sfx.tap()}
        className={className}
        aria-label={orb.label}
      >
        {face}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onOpen(orb.id)
      }}
      className={className}
      aria-label={orb.label}
      aria-haspopup="dialog"
    >
      {face}
    </button>
  )
}
