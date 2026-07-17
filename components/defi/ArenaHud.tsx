'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { NotificationBadge } from './SculptedPlate'

/**
 * Une entrée du menu de l'écran d'arène. Deux comportements exclusifs :
 * - `href` : simple raccourci de navigation (ex. l'entrée Amis → onglet Amis) ;
 * - `sheetContent` : ouvre une feuille ancrée en bas par-dessus l'arène.
 */
export interface OrbItem {
  id: string
  /** Libellé court affiché sous le disque. */
  label: string
  /** Picto du disque (SVG dimensionné par l'appelant, ou emoji). */
  icon?: ReactNode
  /**
   * Médaillon illustré (chemin `/images/...`) qui remplace tout le disque —
   * l'image porte déjà son cadre violet + liseré or, donc le fond de `.defi3-orb`
   * est neutralisé. Prioritaire sur `icon`.
   */
  image?: string
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
  /** Colonne d'entrées « compétition » (ligue, classements, entraînement). */
  leftOrbs: OrbItem[]
  /** Colonne d'entrées « social » (clan, historique, amis). */
  rightOrbs: OrbItem[]
  /** Le centre de la scène (arène, mascotte, trophées). */
  children: ReactNode
}

/**
 * La scène de l'onglet Défi : le décor d'arène est laissé libre au centre, et
 * toutes les entrées secondaires sont regroupées derrière un unique bouton
 * « burger » en haut à droite (au lieu des deux colonnes d'orbes qui
 * encombraient le fond). Le tap ouvre une feuille-menu listant les six
 * médaillons (ligue, classements, entraînement, clan, historique, amis) ;
 * chaque médaillon navigue (`href`) ou ouvre sa propre feuille de détail
 * (`sheetContent`, fournie par le serveur).
 */
export default function ArenaHud({
  leftOrbs,
  rightOrbs,
  children,
}: ArenaHudProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const items = [...leftOrbs, ...rightOrbs]
  const open = items.find((o) => o.id === openId && o.sheetContent) ?? null

  // Fermeture au clavier (Échap) : la feuille de détail d'abord, sinon le menu.
  useEffect(() => {
    if (!open && !menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (open) setOpenId(null)
      else setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, menuOpen])

  // Ouvre une entrée depuis le menu : navigation gérée par le <Link>, sinon on
  // ferme le menu et on laisse monter la feuille de détail.
  const openSheet = (id: string) => {
    setMenuOpen(false)
    setOpenId(id)
  }

  return (
    <div className="relative min-h-0 flex-1">
      {/* Bouton burger : unique porte vers les entrées secondaires, calé dans le
          coin haut-droit pour dégager complètement le décor de l'arène. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setMenuOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Menu de l'arène — ligue, classements, clan, amis…"
        className="olympe-glass olympe-press absolute top-1 right-0 z-10 flex size-12 cursor-pointer items-center justify-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <Menu className="size-6 text-[#faf6ef]" strokeWidth={2.6} aria-hidden="true" />
      </button>

      {/* Le centre, dégagé pour l'arène. */}
      <div className="flex h-full items-center justify-center px-6">
        {children}
      </div>

      {/* Feuille-menu et feuille de détail — portail pour échapper à l'overflow
          du layout. Les deux partagent la même mécanique (fond + panneau qui
          monte du bas). */}
      {typeof document !== 'undefined'
        ? createPortal(
            <>
              {/* Feuille-menu : la grille des six médaillons. */}
              <AnimatePresence>
                {menuOpen ? (
                  <SheetShell
                    label="Menu de l'arène"
                    reduce={reduce}
                    onClose={() => setMenuOpen(false)}
                    header={
                      <>
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8 leading-none"
                          aria-hidden="true"
                        >
                          <Menu className="size-5 text-white" strokeWidth={2.4} />
                        </span>
                        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                          Menu
                        </h2>
                      </>
                    }
                  >
                    <div className="grid grid-cols-3 gap-3 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                      {items.map((item) => (
                        <MenuTile
                          key={item.id}
                          item={item}
                          onOpen={openSheet}
                        />
                      ))}
                    </div>
                  </SheetShell>
                ) : null}
              </AnimatePresence>

              {/* Feuille de détail d'une entrée (ligue, classements…). */}
              <AnimatePresence>
                {open ? (
                  <SheetShell
                    label={open.sheetTitle ?? open.label}
                    reduce={reduce}
                    onClose={() => setOpenId(null)}
                    header={
                      <>
                        {open.image ? (
                          <Image
                            src={open.image}
                            alt=""
                            width={36}
                            height={36}
                            className="size-9 shrink-0 object-contain"
                            aria-hidden
                          />
                        ) : (
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8 leading-none"
                            aria-hidden
                          >
                            {open.icon}
                          </span>
                        )}
                        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                          {open.sheetTitle ?? open.label}
                        </h2>
                      </>
                    }
                  >
                    {open.sheetContent}
                  </SheetShell>
                ) : null}
              </AnimatePresence>
            </>,
            document.body,
          )
        : null}
    </div>
  )
}

/**
 * L'enveloppe commune des feuilles ancrées en bas (fond assombri + panneau
 * `.defi3-sheet` qui monte, en-tête avec bouton Fermer). Le contenu et
 * l'en-tête sont fournis par l'appelant.
 */
function SheetShell({
  label,
  reduce,
  onClose,
  header,
  children,
}: {
  label: string
  reduce: boolean | null
  onClose: () => void
  header: ReactNode
  children: ReactNode
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        data-no-swipe
        className="defi3-sheet w-full max-w-md"
        initial={reduce ? { opacity: 0 } : { y: '100%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          {header}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[72dvh] overflow-y-auto overscroll-contain">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Une tuile de la feuille-menu : le médaillon « objet sculpté » (anneau or
 * ciselé + cœur gemme + icône crème) surmonté de son libellé et d'un éventuel
 * aperçu. Navigue (`href`) ou ouvre la feuille de détail via `onOpen`.
 */
function MenuTile({
  item,
  onOpen,
}: {
  item: OrbItem
  onOpen: (id: string) => void
}) {
  const face = (
    <>
      <span className="olympe-medallion relative">
        <span className="olympe-medallion-core">{item.icon}</span>
        {item.badge ? (
          <NotificationBadge className="absolute -top-1 -right-1">
            {item.badge}
          </NotificationBadge>
        ) : null}
      </span>
      <span className="defi3-orb-label max-w-full truncate">{item.label}</span>
      {item.sub ? (
        <span className="olympe-tag max-w-full truncate rounded-full px-2 py-0.5 font-heading text-[0.55rem] font-extrabold">
          {item.sub}
        </span>
      ) : null}
    </>
  )

  const className =
    'defi2-press flex cursor-pointer flex-col items-center gap-1 rounded-2xl py-2 focus-visible:outline-none focus-visible:[&_.olympe-medallion]:ring-4 focus-visible:[&_.olympe-medallion]:ring-highlight/60'

  if (item.href) {
    return (
      <Link
        href={item.href}
        onClick={() => sfx.tap()}
        className={className}
        aria-label={item.label}
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
        onOpen(item.id)
      }}
      className={className}
      aria-label={item.label}
      aria-haspopup="dialog"
    >
      {face}
    </button>
  )
}
