'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { menuAlertCount } from '@/lib/arene-hud'
import { useDialogFocus } from '@/lib/use-dialog'
import SheetShell from './SheetShell'
import { NotificationBadge } from './SculptedPlate'

/**
 * Une entrée du menu burger. Deux comportements exclusifs :
 * - `href` : simple raccourci de navigation (ex. l'entrée Amis → onglet Amis) ;
 * - `sheetContent` : ouvre une feuille ancrée en bas par-dessus l'arène.
 */
export interface OrbItem {
  id: string
  /** Libellé de la plaque — toujours affiché (c'est la plaque qui parle). */
  label: string
  /** Picto de la plaque (SVG dimensionné par l'appelant, ou emoji). */
  icon?: ReactNode
  /**
   * Objet illustré (chemin `/images/...`) qui remplace le picto : la coupe du
   * tournoi, le coffre d'équipe… Prioritaire sur `icon`.
   */
  image?: string
  /** Pastille de la plaque (compteur, « ! »…). */
  badge?: string
  /**
   * Ton de la pastille : `alert` (corail) UNIQUEMENT pour ce qui se réclame
   * maintenant (coffre prêt, récompense) ; `neutral` (violet) pour un
   * compteur d'avancement. Défaut : `alert`.
   */
  badgeTone?: 'alert' | 'neutral'
  /** Aperçu à côté du libellé (rang, minuterie…), en jeton violet. */
  sub?: string
  /** Filet de séparation AU-DESSUS de cette entrée (groupes du menu). */
  dividerBefore?: boolean
  /** Navigation directe — exclusif de `sheetContent`. */
  href?: string
  /** Titre de la feuille (défaut : le libellé). */
  sheetTitle?: string
  /** Contenu de la feuille ouverte au tap. */
  sheetContent?: ReactNode
}

/**
 * Robe d'une plaque de bord : `violet` (la plaque sculptée de l'arène, défaut)
 * ou `amber` (l'urgence : un gardien sorti de sa tanière). Les autres familles
 * de couleur d'avant (or, vert, magenta, bois) sont parties avec les tuiles de
 * verre : une seule matière pour tout le bord, c'est ce qui fait la famille.
 */
export type TileFamily = 'violet' | 'amber'

/**
 * Une plaque de bord : un objet illustré sur la PLAQUE SCULPTÉE (opaque,
 * biseau or, socle — `.arena-plaque`), 68 px, l'illustration à 58 px. Aucun
 * libellé visible — l'illustration, la pastille et la légende sous la plaque
 * suffisent (l'aria-label porte le nom). Comme les entrées du menu : `href`
 * OU `sheetContent`.
 */
export interface RailTile {
  id: string
  /** Nom de la tuile — aria-label uniquement, jamais affiché. */
  label: string
  /** Illustration détourée (webp) qui remplit la tuile. */
  image?: string
  /** À défaut d'illustration : picto SVG centré. */
  icon?: ReactNode
  /** Robe de la plaque (défaut : violet, la marque). */
  family?: TileFamily
  badge?: string
  badgeTone?: 'alert' | 'neutral'
  /** Légende SOUS la plaque (« 3j », « 96 % ») — crème à contour marine. */
  timer?: string
  href?: string
  sheetTitle?: string
  sheetContent?: ReactNode
}

interface ArenaHudProps {
  /** Rail gauche, tuiles flottantes libres : le duo missions (Quêtes, Boss). */
  leftTiles?: RailTile[]
  /**
   * Entrées du menu burger — TOUT le second rang : historique, classements,
   * ligue, tournoi, coffre d'équipe, réglages.
   */
  menuItems: OrbItem[]
  /**
   * L'appel Studuel+ (PremiumPill), posé JUSTE SOUS le burger, dans la même
   * colonne de l'angle.
   */
  premiumSlot?: ReactNode
  /**
   * La Route des trophées, SOUS Studuel+ — le troisième cran de la colonne de
   * l'angle. C'est un écran de LECTURE (où j'en suis, ce que vaut la prochaine
   * partie, pourquoi) : il rejoint les commandes du HUD au lieu d'occuper la
   * rangée de combat, rendue à l'action.
   */
  roadSlot?: ReactNode
  /**
   * LA CARTE DU JOUEUR, calée dans l'ANGLE haut-gauche (façon Clash Royale) :
   * avatar, nom, série et cristaux, puis la barre de niveau et la barre de
   * trophées. Depuis le 17/09/2026 elle porte SEULE tout le haut-gauche — le
   * bandeau du haut (TopHud) se masque sur l'arène et la bande de saison a
   * été retirée.
   */
  profileSlot?: ReactNode
  /** Le centre de la scène (la scène du héros, calée en bas). */
  children?: ReactNode
}

/**
 * La scène de l'onglet Défi, version « écran d'arène finale » : le décor est
 * laissé au personnage (children, ancré en bas au-dessus de la zone CTA), et
 * les systèmes réclament leur visite depuis le HUD.
 *
 * Rangement façon Clash Royale : la CARTE DU JOUEUR tient l'angle gauche
 * (avatar, nom, série, cristaux, barre de niveau, barre de trophées — un seul
 * objet depuis le 17/09/2026), la colonne des commandes tient l'angle droit
 * (burger, Studuel+, Route des trophées), et le rail des missions descend
 * sous la carte, le long de la scène.
 *
 * Le burger était posé au troisième cran, sous le bandeau de saison : il ne
 * tenait plus l'angle, et la colonne droite n'avait qu'un seul objet. Remonté
 * au ras des monnaies avec Amis à sa gauche, les deux rails se répondent de
 * part et d'autre du personnage. Le reste du second rang (tournoi, coffre,
 * ligue, classements, historique, réglages) vit toujours derrière le burger :
 * une seule porte.
 */
export default function ArenaHud({
  leftTiles = [],
  menuItems,
  premiumSlot,
  roadSlot,
  profileSlot,
  children,
}: ArenaHudProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const reduce = useReducedMotion()
  // Le panneau du menu : le focus y entre à l'ouverture et revient au burger
  // à la fermeture.
  const menuRef = useRef<HTMLDivElement>(null)
  useDialogFocus(menuRef, menuOpen)

  const sheetItems: (OrbItem | RailTile)[] = [...leftTiles, ...menuItems]
  const open = sheetItems.find((o) => o.id === openId && o.sheetContent) ?? null
  // Menu fermé, le burger doit quand même DIRE qu'il y a un dû derrière lui :
  // sinon un coffre prêt disparaîtrait de l'écran (il était visible en tuile).
  const alerts = menuAlertCount(menuItems)

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
      {/* Le centre : la scène du héros, posée en bas du cadre (au-dessus de la
          zone CTA), jamais écrasée par le HUD qui flotte par-dessus. */}
      <div className="flex h-full items-end justify-center px-6">
        {children}
      </div>

      {/* LE MENU, UNE PAGE POSÉE SUR L'ANGLE (Lucas, 18/09/2026). Le panneau
          s'ouvrait SOUS le burger, dans la même colonne : la colonne prenait
          la largeur du panneau, le burger devenu croix glissait au centre,
          puis repartait à droite à la fermeture. Désormais le burger ne bouge
          JAMAIS : le panneau se pose PAR-DESSUS lui, calé dans le même angle,
          avec sa propre croix dans son coin haut-droit. Fermé, le burger est
          là où il a toujours été. Fond crème : les entrées, en plaques
          blanches, s'y détachent — le violet profond les noyait.
          Portail plein viewport, au-dessus de la barre d'onglets ; le voile
          assombrit tout le reste, et un tap dessus referme. */}
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  key="menu"
                  className="fixed inset-0 z-[55]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <button
                    type="button"
                    aria-label="Fermer le menu"
                    tabIndex={-1}
                    className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    ref={menuRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="arena-menu-titre"
                    className="arena-menu absolute top-2 right-3 flex max-h-[calc(100dvh-1rem)] w-[min(20rem,calc(100vw-1.5rem))] flex-col outline-none md:top-4"
                    style={{ transformOrigin: 'top right' }}
                    initial={reduce ? false : { scale: 0.96, y: -6 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={reduce ? undefined : { scale: 0.96, y: -6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 pl-2">
                      <h2
                        id="arena-menu-titre"
                        className="font-heading text-lg font-extrabold text-foreground"
                      >
                        Menu
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          sfx.tap()
                          setMenuOpen(false)
                        }}
                        aria-label="Fermer le menu"
                        className="arena-menu-fermer defi2-press grid size-11 shrink-0 cursor-pointer place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
                      >
                        <X className="size-6" strokeWidth={2.6} aria-hidden="true" />
                      </button>
                    </div>
                    <ul className="-mx-1 flex min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain px-1 pb-1">
                      {menuItems.map((item) => (
                        <li key={item.id}>
                          {item.dividerBefore ? (
                            <span className="arena-menu-sep block" aria-hidden="true" />
                          ) : null}
                          <MenuRow item={item} onOpen={openSheet} />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {/* La carte du joueur tient l'angle haut-gauche. `fixed` pour tenir
          l'angle quel que soit le format ; sur desktop, après la barre
          latérale (md:left-56). */}
      <div className="fixed top-2 left-3 z-40 md:top-4 md:left-56">
        {profileSlot}
      </div>

      {/* Le rail des missions, SOUS la carte du joueur, le long de la scène —
          une COLONNE régulière : même plaque, même écart. */}
      {leftTiles.length > 0 ? (
        <div className="fixed top-[9rem] left-3 z-40 flex flex-col items-center gap-3 md:top-[10rem] md:left-[14.125rem]">
          {leftTiles.map((tile) => (
            <RailTileFace key={tile.id} tile={tile} onOpen={openSheet} />
          ))}
        </div>
      ) : null}

      {/* ANGLE HAUT-DROIT : la COLONNE d'objets, au ras de la bande des
          monnaies — le burger tient l'angle, puis dessous, sur la même plaque
          sculptée et au même écart : Studuel+ (en or) et la Route des
          trophées. (Amis a rejoint le menu le 16/09/2026.) z-40 : SOUS les
          feuilles modales (z-50) et sous le menu ouvert, qui la recouvre. */}
      <div className="fixed top-2 right-3 z-40 flex flex-col items-center gap-3 md:top-4">
        <div className="flex items-center gap-2">
          {/* Le burger, sur la plaque sculptée comme le reste de la colonne :
              chez Clash Royale la colonne est une SÉRIE d'objets de la même
              matière. Rond, pour dire « commande » et non « porte ». */}
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setMenuOpen((v) => !v)
            }}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label={`Menu de l’arène — classements, tournoi, coffre, réglages…${
              alerts > 0 ? ` ${alerts} à voir` : ''
            }`}
            title="Menu de l'arène"
            className="arena-plaque arena-plaque--ronde defi2-press relative grid size-12 cursor-pointer place-items-center focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
          >
            {/* Toujours un burger : c'est le panneau ouvert, posé par-dessus,
                qui porte la croix. Le bouton ne se transforme plus. */}
            <Menu
              className="size-6 text-[#faf6ef]"
              strokeWidth={2.6}
              aria-hidden="true"
            />
            {alerts > 0 ? (
              <NotificationBadge
                tone="alert"
                className="arena-pastille absolute -top-1.5 -right-1.5"
              >
                {alerts}
              </NotificationBadge>
            ) : null}
          </button>
        </div>

        {/* L'appel Studuel+, au cran suivant : le seul objet doré du HUD. Il
            reste en place quand le menu s'ouvre — le panneau et le voile le
            recouvrent, rien ne bouge dans la colonne. */}
        {premiumSlot ?? null}

        {/* La Route des trophées, au cran suivant de la même colonne. */}
        {roadSlot ?? null}
      </div>

      {/* Feuille de détail d'une entrée (tuile ou plaque) — portail pour
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
 * Une plaque de bord — la même des deux côtés de la scène : la plaque sculptée
 * (opaque, biseau or, socle), 68 px, l'illustration à 58 px avec son ombre, la
 * pastille à cheval sur l'angle, et la légende SOUS la plaque. Avant, le rail
 * gauche portait des squircles colorés et l'angle droit des jetons de verre :
 * deux robes pour un même geste (ouvrir quelque chose), et des dessins de 36 px
 * qui perdaient leur cerne. Une seule matière, un seul format.
 */
function RailTileFace({
  tile,
  onOpen,
}: {
  tile: RailTile
  onOpen: (id: string) => void
}) {
  const face = (
    <span
      className={cn(
        'hud-face arena-plaque relative grid size-[68px] place-items-center text-[#faf6ef]',
        tile.family === 'amber' && 'arena-plaque--ambre',
      )}
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt=""
          width={116}
          height={116}
          className="size-[58px] object-contain drop-shadow-[0_3px_4px_rgba(23,16,48,0.55)]"
          aria-hidden
        />
      ) : (
        tile.icon
      )}
      {tile.badge ? (
        <NotificationBadge
          tone={tile.badgeTone ?? 'alert'}
          className="arena-pastille absolute -top-2 -right-2"
        >
          {tile.badge}
        </NotificationBadge>
      ) : null}
    </span>
  )

  const contenu = (
    <>
      {face}
      {tile.timer ? (
        <span className="arena-legende font-heading text-[11px] leading-none font-extrabold">
          {tile.timer}
        </span>
      ) : null}
    </>
  )

  const className =
    'defi2-press flex cursor-pointer flex-col items-center gap-1 focus-visible:outline-none focus-visible:[&_.hud-face]:ring-4 focus-visible:[&_.hud-face]:ring-highlight/60'

  if (tile.href) {
    return (
      <Link
        href={tile.href}
        onClick={() => sfx.tap()}
        className={className}
        aria-label={tile.label}
      >
        {contenu}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onOpen(tile.id)
      }}
      className={className}
      aria-label={tile.label}
      aria-haspopup="dialog"
    >
      {contenu}
    </button>
  )
}

/**
 * Une plaque du menu, façon Clash Royale : picto (ou objet illustré) à gauche,
 * libellé, puis l'aperçu chiffré et la pastille calés à droite. Navigue
 * (`href`) ou ouvre la feuille de détail via `onOpen`.
 */
function MenuRow({
  item,
  onOpen,
}: {
  item: OrbItem
  onOpen: (id: string) => void
}) {
  const face = (
    <span className="arena-menu-row flex w-full items-center gap-3 rounded-2xl py-1.5 pr-3 pl-1.5">
      {/* Le puits de l'icône : même carré creusé, même taille, pour TOUTES les
          entrées — c'est lui qui aligne la colonne de gauche au pixel et donne
          un fond commun aux objets peints comme au picto du coffre. Les
          illustrations y sont posées à 36 px, avec leur ombre. */}
      <span className="arena-menu-ico" aria-hidden>
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            width={72}
            height={72}
            className="size-9 object-contain drop-shadow-[0_2px_2px_rgba(23,16,48,0.28)]"
          />
        ) : (
          item.icon
        )}
      </span>
      <span className="font-heading min-w-0 flex-1 truncate text-left text-[15px] font-extrabold text-foreground">
        {item.label}
      </span>
      {item.sub ? (
        <span className="font-heading shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-extrabold text-secondary-foreground">
          {item.sub}
        </span>
      ) : null}
      {item.badge ? (
        <NotificationBadge
          tone={item.badgeTone ?? 'alert'}
          className="arena-pastille shrink-0"
        >
          {item.badge}
        </NotificationBadge>
      ) : null}
    </span>
  )

  const className =
    'defi2-press block w-full cursor-pointer focus-visible:outline-none focus-visible:[&_.arena-menu-row]:ring-4 focus-visible:[&_.arena-menu-row]:ring-primary/40'

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
