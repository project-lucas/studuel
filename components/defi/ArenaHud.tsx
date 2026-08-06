'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { menuAlertCount } from '@/lib/arene-hud'
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
  /**
   * L'illustration EST déjà une tuile (squircle coloré, liseré, ombre) et se
   * suffit : le jeton d'icône lui retire son fond et son cadre. Sans ce
   * drapeau, on empile une tuile dans une tuile — deux liserés, deux ombres,
   * et un objet qui rétrécit au centre d'un carré qui ne lui sert à rien.
   */
  imageIsTile?: boolean
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

/** Famille de couleur d'une tuile de rail — une famille = une fonction. */
export type TileFamily =
  | 'violet'
  | 'gold'
  | 'green'
  | 'magenta'
  | 'wood'
  | 'amber'

/**
 * Une tuile du rail GAUCHE : un objet illustré dans un cadre commun (squircle,
 * liseré blanc), la couleur dite par sa famille. Aucun libellé visible —
 * l'illustration, le badge et le minuteur suffisent (l'aria-label porte le
 * nom). Comme les entrées du menu : `href` OU `sheetContent`.
 */
export interface RailTile {
  id: string
  /** Nom de la tuile — aria-label uniquement, jamais affiché. */
  label: string
  /** Illustration détourée (webp) qui remplit la tuile. */
  image?: string
  /**
   * L'illustration EST déjà une tuile : le cadre commun (squircle coloré,
   * liseré, socle) s'efface devant elle. Sinon on empile deux tuiles.
   */
  imageIsTile?: boolean
  /** À défaut d'illustration : picto SVG centré. */
  icon?: ReactNode
  /** Robe de la tuile (défaut : violet, la marque). */
  family?: TileFamily
  badge?: string
  badgeTone?: 'alert' | 'neutral'
  /** Minuteur marine sous la tuile (« 3j ») — l'urgence qui réclame. */
  timer?: string
  href?: string
  sheetTitle?: string
  sheetContent?: ReactNode
}

interface ArenaHudProps {
  /** Rail gauche, tuiles flottantes libres : le duo missions (Quêtes, Boss). */
  leftTiles?: RailTile[]
  /**
   * Les COMPAGNONS DU BURGER — jetons ronds posés à sa GAUCHE, dans la même
   * rangée de l'angle haut-droit (la barrette de boutons de Clash Royale, juste
   * sous la bande des monnaies). Réservé aux portes qu'on ouvre d'un tap sans
   * passer par le menu (Amis).
   */
  cornerTiles?: RailTile[]
  /**
   * Entrées du menu burger — TOUT le second rang : historique, classements,
   * ligue, tournoi, coffre d'équipe, réglages.
   */
  menuItems: OrbItem[]
  /**
   * L'appel Studuel+ (PremiumPill), posé JUSTE SOUS le burger, dans la même
   * colonne de l'angle. Il quitte l'écran quand le menu s'ouvre : la cascade
   * des plaques prend alors la colonne, et deux objets dorés superposés ne
   * feraient qu'un empilement illisible.
   */
  premiumSlot?: ReactNode
  /** Pastille niveau + XP, calée dans l'ANGLE haut-gauche (façon Clash Royale). */
  profileSlot?: ReactNode
  /** Cartouche de rang, JUSTE SOUS la pastille de niveau (même colonne). */
  rankSlot?: ReactNode
  /** Bandeau de saison — la bande du haut, centrée entre niveau et pièces. */
  seasonSlot?: ReactNode
  /** Le centre de la scène (la scène du héros, calée en bas). */
  children?: ReactNode
}

/**
 * La scène de l'onglet Défi, version « écran d'arène finale » : le décor est
 * laissé au personnage (children, ancré en bas au-dessus de la zone CTA), et
 * les systèmes réclament leur visite depuis le HUD.
 *
 * Rangement façon Clash Royale (cette passe) : QUATRE rangées, exactement
 * comme la home de Clash Royale.
 *   1. la bande des monnaies (TopHud) à droite, la pastille de niveau dans
 *      l'angle gauche ;
 *   2. juste DESSOUS : la cartouche de rang à gauche, et dans l'angle DROIT la
 *      barrette de boutons — les compagnons (Amis) puis le burger, tout au
 *      bord ;
 *   3. le bandeau de SAISON, pleine largeur (le « Pass Royale ») ;
 *   4. le rail des missions, à gauche, qui descend le long de la scène.
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
  cornerTiles = [],
  menuItems,
  premiumSlot,
  profileSlot,
  rankSlot,
  seasonSlot,
  children,
}: ArenaHudProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const sheetItems: (OrbItem | RailTile)[] = [
    ...leftTiles,
    ...cornerTiles,
    ...menuItems,
  ]
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

  // Cascade : les plaques se déroulent depuis le burger vers le BAS — la
  // première de la liste (la plus proche du bouton) apparaît en premier, donc
  // stagger dans l'ordre naturel.
  const listVariants = {
    open: { transition: { staggerChildren: 0.04 } },
    closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  }
  const rowVariants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 0 } }
    : {
        open: { opacity: 1, y: 0, scale: 1 },
        closed: { opacity: 0, y: -14, scale: 0.9 },
      }

  return (
    <div className="relative min-h-0 flex-1">
      {/* Le centre : la scène du héros, posée en bas du cadre (au-dessus de la
          zone CTA), jamais écrasée par le HUD qui flotte par-dessus. */}
      <div className="flex h-full items-end justify-center px-6">
        {children}
      </div>

      {/* Voile de fermeture, façon Clash Royale : assombrit TOUTE l'interface
          (portail plein viewport, au-dessus de la barre d'onglets), pour ne
          laisser rayonner que le menu. Un tap le referme. */}
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

      {/* La pastille de niveau REMONTE dans l'angle : elle occupe la ligne du
          bandeau (laissée libre à gauche, les pièces étant à droite et
          l'engrenage parti dans le burger). `fixed` pour tenir l'angle quel que
          soit le format ; sur desktop, après la barre latérale (md:left-56). */}
      <div className="fixed top-2 left-3 z-40 md:top-4 md:left-56">
        {profileSlot}
      </div>

      {/* RANGÉE 2, à gauche : la cartouche de rang, calée juste sous la
          pastille de niveau — en face de la barrette de boutons de l'angle
          droit (même hauteur, comme la bannière de nom face aux boutons chez
          Clash Royale). */}
      <div className="fixed top-16 left-3 z-40 md:top-[4.5rem] md:left-56">
        {rankSlot}
      </div>

      {/* RANGÉE 3 : le bandeau de SAISON, pleine largeur. `absolute` (et non
          `fixed`) pour rester dans la colonne de l'arène. Il occupait le cran
          juste sous les monnaies ; ce cran appartient désormais à la barrette
          de boutons, il descend donc d'une rangée — sans rien perdre, il reste
          la bande qui traverse l'écran. */}
      {seasonSlot ? (
        <div className="absolute inset-x-0 top-0 z-30 mt-[4.75rem] md:mt-[7.75rem]">
          {seasonSlot}
        </div>
      ) : null}

      {/* RANGÉE 4 : le rail des missions, qui descend le long de la scène. */}
      {leftTiles.length > 0 ? (
        <div className="fixed top-[10.5rem] left-3.5 z-40 flex flex-col gap-4 md:top-44 md:left-[14.125rem]">
          {leftTiles.map((tile) => (
            <RailTileFace key={tile.id} tile={tile} onOpen={openSheet} />
          ))}
        </div>
      ) : null}

      {/* ANGLE HAUT-DROIT : la barrette de boutons, au ras de la bande des
          monnaies — les compagnons à GAUCHE, le burger tout au BORD (c'est lui
          qui tient l'angle). Z-index conditionnel : menu OUVERT → z-[60] >
          voile (55) pour rester en pleine lumière ; menu FERMÉ → z-40, SOUS
          les feuilles modales (z-50). */}
      <div
        className={`fixed top-16 right-3 flex flex-col items-end gap-2 md:top-[4.5rem] ${
          menuOpen ? 'z-[60]' : 'z-40'
        }`}
      >
        <div className="flex items-center gap-2">
          {cornerTiles.map((tile) => (
            <RailTileFace
              key={tile.id}
              tile={tile}
              onOpen={openSheet}
              variant="corner"
            />
          ))}
          {/* Le burger. Il était NU (trois barres à même le décor) tant qu'il
              était seul sur son bord : le fond aurait fait un objet de plus.
              Maintenant qu'Amis l'accompagne, deux boutons côte à côte dont un
              seul porte un matériau se lisent comme un oubli, pas comme une
              hiérarchie — chez Clash Royale la barrette est une SÉRIE de
              boutons identiques. Il prend donc le jeton de verre de nuit, le
              matériau commun du HUD, qui règle au passage sa lisibilité sur
              les arènes claires (aube, midi). */}
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setMenuOpen((v) => !v)
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={
              menuOpen
                ? 'Fermer le menu de l’arène'
                : `Menu de l’arène — classements, tournoi, coffre, réglages…${
                    alerts > 0 ? ` ${alerts} à voir` : ''
                  }`
            }
            title="Menu de l'arène"
            className="olympe-glass defi2-press relative grid size-11 cursor-pointer place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
          >
            <motion.span
              className="col-start-1 row-start-1 grid place-items-center"
              initial={false}
              animate={
                reduce
                  ? { opacity: menuOpen ? 0 : 1 }
                  : { opacity: menuOpen ? 0 : 1, scale: menuOpen ? 0.6 : 1 }
              }
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            >
              <Menu
                className="size-6 text-[#faf6ef]"
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </motion.span>
            <motion.span
              className="pointer-events-none col-start-1 row-start-1 grid place-items-center"
              initial={false}
              animate={
                reduce
                  ? { opacity: menuOpen ? 1 : 0 }
                  : { opacity: menuOpen ? 1 : 0, scale: menuOpen ? 1 : 0.6 }
              }
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            >
              <X
                className="size-6 text-[#faf6ef]"
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </motion.span>
            {alerts > 0 && !menuOpen ? (
              <NotificationBadge
                tone="alert"
                className="absolute -top-1.5 -right-1.5"
              >
                {alerts}
              </NotificationBadge>
            ) : null}
          </button>
        </div>

        {/* L'appel Studuel+, sous le burger : le seul objet doré du HUD. Il
            s'efface quand le menu s'ouvre — la colonne appartient alors à la
            cascade des plaques. */}
        {premiumSlot && !menuOpen ? premiumSlot : null}

        {/* Le panneau, SOUS la barrette : la pile des plaques, façon carte
            Clash Royale. Borné en hauteur (petits écrans) plutôt que de
            déborder sous la barre d'onglets. */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.ul
              key="menu"
              className="olympe-glass arena-menu max-h-[calc(100dvh-12rem)] w-[15.5rem] overflow-y-auto"
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {menuItems.map((item) => (
                <motion.li key={item.id} variants={rowVariants}>
                  {item.dividerBefore ? (
                    <span className="arena-menu-sep block" aria-hidden="true" />
                  ) : null}
                  <MenuRow item={item} onOpen={openSheet} />
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
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
 * Une tuile de rail. Deux robes, une seule mécanique :
 * - `rail` (défaut, rail gauche) : le cadre commun des OBJETS — squircle,
 *   liseré blanc, socle 3D peint par la famille de couleur ;
 * - `corner` (barrette de l'angle haut-droit) : un jeton ROND de verre de nuit,
 *   la robe des COMMANDES du HUD — celle du burger qu'il accompagne, et celle
 *   de la pastille de niveau et de la cartouche de rang en face.
 * Dans les deux cas : l'illustration ou le picto, la pastille et le minuteur.
 */
function RailTileFace({
  tile,
  onOpen,
  variant = 'rail',
}: {
  tile: RailTile
  onOpen: (id: string) => void
  variant?: 'rail' | 'corner'
}) {
  const family = tile.family ?? 'violet'
  const corner = variant === 'corner'

  // Une illustration qui EST déjà une tuile porte son propre cadre : le nôtre
  // s'efface (plus de fond, plus de liseré, plus de socle) et elle occupe TOUTE
  // la place, au lieu de rétrécir à 88 % au centre d'un carré redondant.
  const nue = Boolean(tile.image && tile.imageIsTile)

  const face = (
    <span
      className={
        nue
          ? cn(
              'hud-face relative grid place-items-center',
              corner ? 'size-11' : 'size-[52px]',
            )
          : corner
            ? 'hud-face olympe-glass relative grid size-11 place-items-center rounded-full text-[#faf6ef]'
            : `hud-face rail-tile rail-tile-${family} size-[52px]`
      }
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt=""
          width={56}
          height={56}
          className={cn(
            'object-contain',
            nue
              ? 'size-full drop-shadow-[0_3px_5px_rgba(23,16,48,0.5)]'
              : 'size-[88%] drop-shadow-[0_2px_3px_rgba(23,16,48,0.4)]',
          )}
          aria-hidden
        />
      ) : (
        tile.icon
      )}
      {tile.badge ? (
        <NotificationBadge
          tone={tile.badgeTone ?? 'alert'}
          className="absolute -top-1.5 -right-1.5"
        >
          {tile.badge}
        </NotificationBadge>
      ) : null}
      {tile.timer ? <span className="rail-timer">{tile.timer}</span> : null}
    </span>
  )

  const className =
    'defi2-press block cursor-pointer focus-visible:outline-none focus-visible:[&_.hud-face]:ring-4 focus-visible:[&_.hud-face]:ring-highlight/60'

  if (tile.href) {
    return (
      <Link
        href={tile.href}
        onClick={() => sfx.tap()}
        className={className}
        aria-label={tile.label}
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
        onOpen(tile.id)
      }}
      className={className}
      aria-label={tile.label}
      aria-haspopup="dialog"
    >
      {face}
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
    <span className="arena-menu-row flex w-full items-center gap-2.5 rounded-xl py-1.5 pr-2.5 pl-1.5">
      {/* Le jeton d'icône : même carré, même taille, pour TOUTES les entrées —
          c'est lui qui aligne la colonne de gauche au pixel. Son FOND, lui,
          s'efface devant une illustration qui porte déjà le sien (`imageIsTile`),
          sinon on lit deux carrés emboîtés. */}
      <span
        className={cn(
          'arena-menu-ico',
          item.image && item.imageIsTile && 'arena-menu-ico-nue',
        )}
        aria-hidden
      >
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            width={32}
            height={32}
            className={cn(
              'object-contain',
              item.imageIsTile ? 'size-full' : 'size-7',
            )}
          />
        ) : (
          item.icon
        )}
      </span>
      <span className="font-heading min-w-0 flex-1 truncate text-left text-[0.82rem] font-extrabold text-[#faf6ef]">
        {item.label}
      </span>
      {item.sub ? (
        <span className="font-heading shrink-0 rounded-full bg-white/12 px-1.5 py-0.5 text-[0.6rem] font-extrabold text-[#faf6ef]/85">
          {item.sub}
        </span>
      ) : null}
      {item.badge ? (
        <NotificationBadge tone={item.badgeTone ?? 'alert'} className="shrink-0">
          {item.badge}
        </NotificationBadge>
      ) : null}
    </span>
  )

  const className =
    'defi2-press block w-full cursor-pointer focus-visible:outline-none focus-visible:[&_.arena-menu-row]:ring-4 focus-visible:[&_.arena-menu-row]:ring-highlight/60'

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
