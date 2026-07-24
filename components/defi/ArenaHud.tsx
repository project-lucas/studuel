'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
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
  /** Cartouche de rang (blason + trophées), posée AU-DESSUS du parchemin. */
  rankSlot?: ReactNode
  /** Carte de profil (avatar + pseudo), calée en haut à GAUCHE (façon Clash
   *  Royale). Symétrique du bloc rang/menu de droite. */
  profileSlot?: ReactNode
  /** Pilule de saison, calée discrètement en bas à gauche de la scène. */
  seasonSlot?: ReactNode
  /** Le centre de la scène (optionnel : l'arène peut rester plein cadre). */
  children?: ReactNode
}

/**
 * La scène de l'onglet Défi : le décor d'arène est laissé libre au centre, et
 * toutes les entrées secondaires sont regroupées derrière un unique bouton
 * « burger » calé EN HAUT À DROITE, juste sous la cartouche de rang. Au tap, le
 * parchemin se DÉROULE sur place : la pile des six médaillons (ligue,
 * classements, entraînement, clan, historique, amis) descend verticalement en
 * cascade — un vrai rouleau qui se déplie vers le bas, pas une feuille qui monte
 * du bas. Chaque médaillon navigue (`href`) ou ouvre sa propre feuille de détail
 * (`sheetContent`, fournie par le serveur).
 *
 * Rang + parchemin partagent le même coin : c'est le bloc « mon statut, mes
 * accès », et il libère tout le centre-bas pour la scène et le bouton de match.
 */
export default function ArenaHud({
  leftOrbs,
  rightOrbs,
  rankSlot,
  profileSlot,
  seasonSlot,
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

  // Cascade : les médaillons se déroulent depuis le parchemin vers le BAS — le
  // premier de la liste (le plus proche du bouton) apparaît en premier, donc
  // stagger dans l'ordre naturel.
  const listVariants = {
    open: { transition: { staggerChildren: 0.05 } },
    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  }
  const rowVariants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 0 } }
    : {
        open: { opacity: 1, y: 0, scale: 1 },
        closed: { opacity: 0, y: -16, scale: 0.8 },
      }

  return (
    <div className="relative min-h-0 flex-1">
      {/* Le centre, dégagé pour l'arène. */}
      <div className="flex h-full items-center justify-center px-6">
        {children}
      </div>

      {/* Voile de fermeture, façon Clash Royale : assombrit TOUTE l'interface
          (portail plein viewport, au-dessus de la barre d'onglets), pour ne
          laisser rayonner que les médaillons du menu. Un tap le referme. */}
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {menuOpen ? (
                <motion.button
                  type="button"
                  aria-label="Fermer le menu"
                  className="fixed inset-0 z-[55] cursor-default bg-black/65 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMenuOpen(false)}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {/* Carte de profil : angle haut-GAUCHE, symétrique du bloc rang/menu de
          droite. `fixed` pour tenir l'angle quel que soit le format (mêmes
          offsets verticaux que la droite). z-40 : sous les feuilles modales et
          sous le voile du menu (elle s'assombrit avec le reste quand il ouvre). */}
      {profileSlot ? (
        <div className="fixed top-14 left-3 z-40 md:top-4">{profileSlot}</div>
      ) : null}

      {/* Pilule de saison : posée en bas à gauche de la scène, hors du chemin
          du regard. Le centre haut reste au décor. */}
      {seasonSlot ? (
        <div className="pointer-events-none absolute bottom-1 left-0 z-30 flex max-w-[62%] justify-start [&>*]:pointer-events-auto">
          {seasonSlot}
        </div>
      ) : null}

      {/* Le bloc « statut & accès », icônes FLOTTANTES en haut à DROITE : la
          cartouche de rang, le parchemin scellé juste dessous, et — une fois
          déroulé — la pile des entrées qui descend. Position `fixed` (pas
          `absolute`) pour tenir l'angle haut-droit PEU IMPORTE LE FORMAT : calé
          sous la pastille « solde » du bandeau flottant (`top-14 right-3` sur
          mobile, `md:top-4` sur desktop). `items-end` pour que la cartouche, le
          parchemin et la pile se plaquent tous au bord droit. Z-index
          conditionnel : menu OUVERT → z-[60] > voile (55), pour que la pile et le
          parchemin restent en pleine lumière quand le reste s'assombrit ; menu
          FERMÉ → z-40, SOUS les feuilles modales (ModesSheet, feuilles de détail
          en z-50) pour que le parchemin ne transperce plus leur voile sombre. */}
      <div
        className={`fixed top-14 right-3 flex flex-col items-end gap-1.5 md:top-4 ${
          menuOpen ? 'z-[60]' : 'z-40'
        }`}
      >
        {rankSlot}

        {/* Le burger lui-même : parchemin scellé qui, au tap, se DÉROULE — le
            rouleau fermé se fond vers le parchemin ouvert (et non plus un simple
            pivot). Les deux visuels restent montés, superposés au centre, et on
            croise leurs opacités/échelles pour l'effet d'ouverture. Rouvrir
            referme le parchemin (le bouton fait aussi office de « fermer »). */}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setMenuOpen((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Menu de l'arène — ligue, classements, clan, amis…"
          title="Menu de l'arène"
          className="olympe-press flex size-14 cursor-pointer items-center justify-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
        >
          <span className="relative grid size-11 place-items-center">
            {/* Rouleau fermé — se rétracte et s'efface à l'ouverture. */}
            <motion.span
              className="col-start-1 row-start-1 block"
              initial={false}
              animate={
                reduce
                  ? { opacity: menuOpen ? 0 : 1 }
                  : { opacity: menuOpen ? 0 : 1, scale: menuOpen ? 0.7 : 1 }
              }
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
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

            {/* Parchemin ouvert — se déroule et apparaît à l'ouverture. */}
            <motion.span
              className="pointer-events-none col-start-1 row-start-1 block"
              initial={false}
              animate={
                reduce
                  ? { opacity: menuOpen ? 1 : 0 }
                  : {
                      opacity: menuOpen ? 1 : 0,
                      scale: menuOpen ? 1 : 0.6,
                      y: menuOpen ? 0 : 4,
                    }
              }
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            >
              <Image
                src="/images/defi/modes/burger-open.webp"
                alt=""
                width={92}
                height={137}
                className="w-12 drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
                aria-hidden
              />
            </motion.span>
          </span>
        </button>

        {/* La pile déroulée, SOUS le parchemin : elle descend en cascade. */}
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
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel)

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
        ref={panel}
        data-no-swipe
        className="defi3-sheet w-full max-w-md outline-none"
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
    <span className="olympe-glass flex items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-3">
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

  // Aligné à DROITE sous le parchemin : le libellé d'abord (il s'étend vers la
  // gauche), puis le médaillon calé sur le bord droit, sous le rouleau — les
  // médaillons s'empilent ainsi en colonne juste sous le parchemin.
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
