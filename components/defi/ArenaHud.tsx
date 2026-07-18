'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { NotificationBadge } from './SculptedPlate'

/**
 * Une entrée du menu de l'écran d'arène. Deux comportements exclusifs :
 * - `href` : simple raccourci de navigation (ex. l'entrée Amis → onglet Amis) ;
 * - `sheetContent` : ouvre une feuille ancrée en bas par-dessus l'arène.
 */
export interface OrbItem {
  id: string
  /** Libellé court affiché à côté du disque. */
  label: string
  /** Picto du disque (SVG dimensionné par l'appelant, ou emoji). */
  icon?: ReactNode
  /**
   * Médaillon illustré (chemin `/images/...`) qui remplace tout le disque —
   * l'image porte déjà son cadre violet + liseré or. Prioritaire sur `icon`.
   */
  image?: string
  /** Pastille corail en haut à droite du disque (compteur, « ! »…). */
  badge?: string
  /** Aperçu à côté du libellé (rang, minuterie…), en jeton sombre. */
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
  /** Le centre de la scène (optionnel : l'arène peut rester plein cadre). */
  children?: ReactNode
}

/**
 * La scène de l'onglet Défi : le décor d'arène est laissé libre au centre, et
 * toutes les entrées secondaires sont regroupées derrière un unique bouton
 * « burger » calé EN BAS À DROITE. Au tap, le burger se DÉPLIE sur place : la
 * pile des six médaillons (ligue, classements, entraînement, clan, historique,
 * amis) se déroule verticalement vers le haut en cascade — un vrai menu
 * dépliant, pas une feuille qui monte du bas. Chaque médaillon navigue (`href`)
 * ou ouvre sa propre feuille de détail (`sheetContent`, fournie par le serveur).
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

  // Cascade : les médaillons se déroulent depuis le burger vers le haut
  // (staggerDirection -1 → le plus proche du bouton apparaît en premier).
  const listVariants = {
    open: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    closed: { transition: { staggerChildren: 0.03 } },
  }
  const rowVariants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 0 } }
    : {
        open: { opacity: 1, y: 0, scale: 1 },
        closed: { opacity: 0, y: 16, scale: 0.8 },
      }

  return (
    <div className="relative min-h-0 flex-1">
      {/* Le centre, dégagé pour l'arène. */}
      <div className="flex h-full items-center justify-center px-6">
        {children}
      </div>

      {/* Voile de fermeture : un tap hors du menu déplié le referme. Cantonné à
          la scène (le reste de l'écran reste actionnable), fondu discret. */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 z-10 cursor-default bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      {/* Le menu dépliant, ancré en bas à droite : la pile des entrées au-dessus
          du burger. Le parchemin descend d'un cran (-bottom) pour venir se
          poser tout contre le bloc trophée qui le suit. */}
      <div className="absolute right-1 -bottom-3 z-20 flex flex-col items-end gap-2">
        <AnimatePresence>
          {menuOpen ? (
            <motion.ul
              key="menu"
              className="flex flex-col items-end gap-2"
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {items.map((item) => (
                <motion.li key={item.id} variants={rowVariants}>
                  <MenuRow item={item} onOpen={openSheet} />
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>

        {/* Le burger lui-même : parchemin scellé, il pivote quand le menu est
            ouvert (et refait office de bouton « fermer »). */}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setMenuOpen((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Menu de l'arène — ligue, classements, clan, amis…"
          className="olympe-press flex size-14 cursor-pointer items-center justify-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
        >
          <motion.span
            className="block"
            animate={
              reduce
                ? undefined
                : { rotate: menuOpen ? 90 : 0, scale: menuOpen ? 1.06 : 1 }
            }
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            <Image
              src="/images/defi/modes/burger.webp"
              alt=""
              width={56}
              height={47}
              className="w-11 drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
              aria-hidden
            />
          </motion.span>
        </button>
      </div>

      {/* Feuille de détail d'une entrée (ligue, classements…) — portail pour
          échapper à l'overflow du layout. */}
      {typeof document !== 'undefined'
        ? createPortal(
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
            </AnimatePresence>,
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
 * Une entrée de la pile dépliée : un libellé (jeton verre fumé, avec un éventuel
 * aperçu) à gauche, le médaillon « objet sculpté » (anneau or + cœur gemme +
 * icône crème) à droite, aligné sous le burger. Navigue (`href`) ou ouvre la
 * feuille de détail via `onOpen`.
 */
function MenuRow({
  item,
  onOpen,
}: {
  item: OrbItem
  onOpen: (id: string) => void
}) {
  const badge = item.badge ? (
    <NotificationBadge className="absolute -top-1 -right-1">
      {item.badge}
    </NotificationBadge>
  ) : null

  // Un médaillon illustré (`image`) porte déjà son cadre ; sinon le disque
  // « objet sculpté » compact (anneau or + cœur gemme) avec l'icône crème.
  const medallion = item.image ? (
    <span className="olympe-medallion-img relative block size-12 shrink-0 rounded-full">
      <Image
        src={item.image}
        alt=""
        width={48}
        height={48}
        className="size-full rounded-full object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
        aria-hidden
      />
      {badge}
    </span>
  ) : (
    <span className="olympe-medallion olympe-medallion--sm relative">
      <span className="olympe-medallion-core">{item.icon}</span>
      {badge}
    </span>
  )

  const label = (
    <span className="olympe-glass flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-3.5">
      <span className="font-heading text-sm font-extrabold whitespace-nowrap text-white">
        {item.label}
      </span>
      {item.sub ? (
        <span className="olympe-tag rounded-full px-1.5 py-0.5 font-heading text-[0.6rem] font-extrabold">
          {item.sub}
        </span>
      ) : null}
    </span>
  )

  const face = (
    <>
      {label}
      {medallion}
    </>
  )

  const className =
    'defi2-press flex cursor-pointer items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:[&_.olympe-medallion]:ring-4 focus-visible:[&_.olympe-medallion]:ring-highlight/60 focus-visible:[&_.olympe-medallion-img]:ring-4 focus-visible:[&_.olympe-medallion-img]:ring-highlight/60'

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
