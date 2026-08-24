'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, LogIn } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import {
  isHudAccountHidden,
  isHudHidden,
  isHudLevelHidden,
  isHudOverDarkScene,
} from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'

/** Quelle bulle de monnaie est ouverte, s'il y en a une. */
type OpenPurse = 'ecu' | 'cristal' | null

/**
 * Le bandeau du haut, façon Clash Royale : les infos de jeu que l'élève garde
 * sous les yeux partout — son niveau, ses DEUX monnaies (pièces et gemmes,
 * chacune avec son « + » vers l'endroit où elle se gagne) et l'accès au profil —
 * FLOTTENT au-dessus du fond d'écran de chaque interface. Plus de barre pleine
 * largeur opaque : chaque info est une pastille translucide (backdrop-blur +
 * ombre) posée sur le décor, si bien qu'on voit le fond de l'arène / de l'onglet
 * derrière. Mobile uniquement (`md:hidden`) : sur desktop la sidebar porte déjà
 * l'identité. Les valeurs viennent du serveur (TopHudLoader) ; ce composant ne
 * fait que l'affichage + le masquage sur le parcours d'accueil plein écran.
 */
export default function TopHud({
  coins,
  gems,
  streak,
  level,
  levelTitle,
  progress,
  userLabel,
}: {
  /** Solde de pièces, ou null pour un visiteur non connecté. */
  coins: number | null
  /** Solde de gemmes, ou null pour un visiteur non connecté. */
  gems: number | null
  /**
   * Série en cours, en jours. `null` = inconnue (visiteur, ou base dont la
   * migration 155 n'est pas passée) : la flamme ne s'affiche pas du tout. Zéro,
   * lui, s'affiche — une flamme éteinte est une invitation, une flamme absente
   * n'est rien.
   */
  streak: number | null
  /** Niveau (1..10), ou null pour un visiteur. */
  level: number | null
  levelTitle: string | null
  /** Progression vers le niveau suivant (0..1). */
  progress: number
  userLabel: string | null
}) {
  const pathname = usePathname()
  // La bulle d'explication d'une monnaie (façon Brawl Stars). Une seule ouverte
  // à la fois : taper l'autre monnaie bascule, taper ailleurs referme. On
  // mémorise l'écran d'ouverture pour DÉDUIRE la fermeture au changement de
  // page (plutôt qu'un effet qui remettrait l'état à zéro après coup).
  const [opened, setOpened] = useState<{ purse: OpenPurse; path: string }>({
    purse: null,
    path: pathname,
  })
  const openPurse = opened.path === pathname ? opened.purse : null
  const pursesRef = useRef<HTMLDivElement>(null)

  const togglePurse = (purse: Exclude<OpenPurse, null>) =>
    setOpened({ purse: openPurse === purse ? null : purse, path: pathname })
  const closePurse = () => setOpened({ purse: null, path: pathname })

  // Fermeture au tap extérieur / Échap. Les écouteurs ne sont posés QUE quand
  // une bulle est ouverte : le bandeau est monté sur toutes les pages.
  useEffect(() => {
    if (!openPurse) return

    const closeOnOutside = (event: PointerEvent) => {
      if (!pursesRef.current?.contains(event.target as Node)) closePurse()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePurse()
    }

    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
    // `closePurse` se reconstruit à chaque rendu ; ce qui compte pour poser ou
    // retirer les écouteurs, c'est l'ouverture et l'écran courant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPurse, pathname])

  // Parcours d'accueil plein écran (façon Duolingo) : aucun bandeau. Garde
  // indispensable même si le serveur filtre déjà : en navigation CLIENT, le
  // layout racine n'est pas re-rendu, donc ce composant reste monté.
  if (isHudHidden(pathname)) {
    return null
  }

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = pathname === '/compte' || pathname.startsWith('/login')
  const connected = coins !== null && level !== null
  const pct = Math.round(progress * 100)
  // Sur l'arène, le niveau est porté par le ProfileChip du HUD : la pastille
  // du bandeau se replie pour ne pas afficher le niveau en double.
  const levelHidden = isHudLevelHidden(pathname)
  // Scène sombre (arène) : les pastilles prennent le verre de nuit du HUD de
  // jeu au lieu du crème des onglets clairs. Un seul matériau par écran.
  const dark = isHudOverDarkScene(pathname)
  // Sur l'arène, l'engrenage est passé DANS le burger (avec l'historique, les
  // classements, le tournoi…) : le bandeau ne garde que les pièces, et le haut
  // de l'écran laisse la place au bandeau de saison, au centre.
  const accountHidden = isHudAccountHidden(pathname)
  // Le fond commun des pastilles : verre de nuit sur l'arène, carte crème
  // ailleurs. Écrit une fois, appliqué aux trois pastilles du bandeau.
  const pillSurface = dark
    ? 'olympe-glass'
    : 'bg-card/85 ring-1 ring-black/5 shadow-lg backdrop-blur-md'

  // Le bandeau ne capte plus les taps : seules les pastilles sont cliquables,
  // le reste de la bande laisse passer vers le décor derrière.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 px-3 md:hidden">
      {connected ? (
        <>
          {/* Niveau : écusson de jeu flottant — disque violet ciselé (dégradé,
              reflet haut + liseré or, façon médaillon d'arène en miniature),
              libellé violet marqué, et ruban doré de progression surmonté du
              pourcentage pour rendre l'avancée lisible d'un coup d'œil.
              Replié sur /defi (le ProfileChip de l'arène est LA source). */}
          {levelHidden ? null : (
            <div
              className={cn(
                'pointer-events-auto flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-3.5 pl-1',
                pillSurface,
              )}
              title={levelTitle ?? undefined}
            >
              <span
                className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] text-sm font-extrabold text-primary-foreground tabular-nums ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(0,0,0,0.3)]"
                aria-hidden="true"
              >
                {level}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    'font-heading text-[10px] leading-none font-extrabold tracking-wide uppercase',
                    dark ? 'text-[#faf6ef]' : 'text-primary',
                  )}
                >
                  Niveau {level}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <div
                    className={cn(
                      'h-2 w-16 overflow-hidden rounded-full',
                      dark
                        ? 'bg-black/35 ring-1 ring-white/15'
                        : 'bg-muted ring-1 ring-black/[0.06]',
                    )}
                    role="progressbar"
                    aria-label={`Progression vers le niveau ${level + 1}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-highlight to-accent shadow-[0_0_6px_color-mix(in_oklch,var(--highlight),transparent_45%)] transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'hidden min-[360px]:inline font-mono text-[9px] leading-none font-bold tabular-nums',
                      dark ? 'text-white/70' : 'text-muted-foreground',
                    )}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LE GROUPE DE DROITE : la série, puis les deux monnaies. Tout ce
              qui se COMPTE tient ensemble, poussé contre le bord ; la gauche du
              bandeau reste au niveau (et, sur l'arène où le niveau se replie,
              à la carte joueur du décor).

              La série y était d'abord posée à gauche, juste après le niveau —
              elle se superposait à la carte joueur de l'arène, qui occupe cet
              angle et que le bandeau ne connaît pas. Un bandeau flottant ne
              doit rien déposer là où le décor de la page a déjà quelque chose. */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {/* LA SÉRIE, partout. C'est le geste de Duolingo : la flamme est en
                haut de CHAQUE écran, pas rangée dans l'onglet qui la calcule.
                Une série qu'on ne voit qu'en allant la chercher ne retient
                personne — il faut qu'elle croise le regard sur l'arène, dans la
                boutique, chez les amis.

                Elle garde sa propre pastille : le niveau dit le chemin
                parcouru, la série dit la régularité, ce sont deux comptes
                différents. Série à zéro = flamme éteinte (désaturée) et non
                pastille absente : la place reste, à rallumer. */}
            {streak === null ? null : (
              <div
                className={cn(
                  'pointer-events-auto flex h-11 shrink-0 items-center gap-1 rounded-full pr-3 pl-1.5',
                  pillSurface,
                )}
                aria-label={`Série : ${streak} jour${streak > 1 ? 's' : ''}`}
                title={`${streak} jour${streak > 1 ? 's' : ''} de série`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/serie/flamme.webp"
                  alt=""
                  aria-hidden="true"
                  width={128}
                  height={128}
                  className={cn(
                    'size-8 shrink-0 object-contain',
                    streak > 0 ? 'flame-breathe' : 'opacity-40 grayscale',
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-mono text-sm font-extrabold tabular-nums',
                    streak > 0
                      ? dark
                        ? 'text-highlight'
                        : 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {streak}
                </span>
              </div>
            )}

            {/* LA BANDE DE RESSOURCES, façon Clash Royale : les soldes ne sont
              pas rangés dans une boutique qu'on pense à ouvrir, ils sont sous
              les yeux en permanence. Chaque pastille porte DEUX gestes, comme
              chez Supercell :
                • le solde (à gauche) OUVRE une bulle qui explique la monnaie —
                  un chiffre seul ne dit jamais à quoi il sert ;
                • le « + » (à droite) MÈNE À LA BOUTIQUE, pour les deux monnaies.

              Sur crème, l'écu illustré est doré et ressort du fond clair ; sur
              la scène sombre, la pastille prend le verre de nuit et c'est le
              CHIFFRE qui devient or — l'or dit la valeur, pas le contenant. */}
            {/* La bande des monnaies garde SA propre boîte : c'est elle que
              surveille la fermeture au tap extérieur (`pursesRef`). La flamme
              n'en fait pas partie — elle n'ouvre aucune bulle. */}
            <div ref={pursesRef} className="flex shrink-0 items-center gap-1.5">
              <ResourcePill
                name="Écu"
                nameClassName={
                  dark
                    ? 'text-highlight'
                    : // Sur crème, le jaune solaire pur passerait sous le seuil de
                      // contraste : on le fonce pour le TEXTE seulement — c'est le
                      // même or, lisible.
                      'text-[color-mix(in_oklch,var(--highlight),black_42%)]'
                }
                description={
                  <>
                    La monnaie du style. Tu la gagnes en révisant et en jouant,
                    et tu la dépenses dans la Boutique : tenues, décors et
                    objets pour ton avatar.
                  </>
                }
                open={openPurse === 'ecu'}
                onToggle={() => togglePurse('ecu')}
                label={`${coins} écus — à quoi sert cette monnaie`}
                plusLabel="Obtenir des écus"
                value={coins}
                icon={<EcuIcon className="size-5" />}
                dark={dark}
                className={
                  dark
                    ? 'olympe-glass olympe-glass--sculpte text-highlight'
                    : 'bg-card/90 text-foreground shadow-lg ring-1 ring-black/10 backdrop-blur-md'
                }
              />
              {/* LA MONNAIE QUI CÈDE. Le bandeau ne peut pas tenir, sur un
                téléphone, l'écusson de niveau + la série + DEUX monnaies + les
                réglages : à 390 px on demande environ 100 px de trop. Il faut
                donc que quelque chose s'efface, et c'est le cristal — c'est la
                monnaie secondaire, et elle reste à un tap de là (le « + » de
                l'écu et l'onglet Boutique mènent au même endroit). Le seuil
                (430 px) couvre les téléphones courants ; au-delà, les deux
                monnaies reviennent. */}
              {gems !== null ? (
                <ResourcePill
                  name="Cristal"
                  nameClassName={dark ? 'text-[#c9b4ff]' : 'text-primary'}
                  description={
                    <>
                      La monnaie du contenu. {GEM_COST_CHAPTER} cristaux ouvrent
                      un chapitre entier — sa carte mentale et ses fiches — pour
                      toujours. Ils se gagnent surtout en invitant tes amis.
                    </>
                  }
                  open={openPurse === 'cristal'}
                  onToggle={() => togglePurse('cristal')}
                  label={`${gems} cristaux — à quoi sert cette monnaie`}
                  plusLabel="Obtenir des cristaux"
                  value={gems}
                  icon={<CristalIcon className="size-5" />}
                  dark={dark}
                  className={cn(
                    'max-[429px]:hidden',
                    dark
                      ? 'olympe-glass text-[#d8c9ff]'
                      : 'bg-card/85 text-primary shadow-lg ring-1 ring-black/5 backdrop-blur-md',
                  )}
                />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <Link
          href="/"
          className={cn(
            'pointer-events-auto font-heading rounded-full px-3 py-1.5 text-lg font-bold',
            pillSurface,
          )}
        >
          Studuel
        </Link>
      )}

      {/* Réglages du compte — pastille ronde flottante à l'extrême droite. Ce
          n'est PAS l'entrée « profil de jeu » (avatar, stats, badges) : celle-ci
          est la carte joueur en haut à gauche de l'arène. Pour lever la
          confusion des deux entrées jumelles, on affiche ici un engrenage
          (réglages du compte : /compte), pas une silhouette qui se lisait comme
          un second bouton profil. Visiteur non connecté → icône « entrer ». */}
      {accountHidden ? null : (
        <Link
          href={accountHref}
          aria-label={
            userLabel ? `Réglages du compte — ${userLabel}` : 'Se connecter'
          }
          title={userLabel ? 'Réglages du compte' : 'Se connecter'}
          className={cn(
            'pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full transition active:scale-95',
            pillSurface,
            connected ? '' : 'ml-auto',
            dark
              ? accountActive
                ? 'text-highlight'
                : 'text-[#faf6ef]'
              : accountActive
                ? 'text-primary'
                : 'text-foreground',
          )}
        >
          {userLabel ? (
            <Settings className="size-6" strokeWidth={2.1} aria-hidden="true" />
          ) : (
            <LogIn className="size-6" strokeWidth={2.1} aria-hidden="true" />
          )}
        </Link>
      )}
    </header>
  )
}

/**
 * Une pastille de ressource de la bande du haut. Elle porte DEUX gestes
 * distincts, et c'est voulu — c'est le partage de Brawl Stars :
 *   • à GAUCHE (picto + solde) : un bouton qui déplie une bulle expliquant à
 *     quoi sert la monnaie. Un compteur qu'on ne comprend pas ne motive rien.
 *   • à DROITE (le « + ») : le lien vers la boutique. Il transforme un
 *     compteur passif en PORTE.
 */
function ResourcePill({
  name,
  nameClassName,
  description,
  open,
  onToggle,
  label,
  plusLabel,
  value,
  icon,
  dark,
  className,
}: {
  /** Le nom de la monnaie, écrit dans SA couleur en tête de la bulle. */
  name: string
  nameClassName: string
  description: ReactNode
  open: boolean
  onToggle: () => void
  label: string
  plusLabel: string
  value: number
  icon: ReactNode
  /** Scène sombre (arène) : la bulle prend le verre de nuit. */
  dark: boolean
  /** Robe de la pastille (verre de nuit sur l'arène, crème ailleurs). */
  className: string
}) {
  const panelId = `bourse-${name.toLowerCase()}`

  return (
    <div className="pointer-events-auto relative shrink-0">
      <div
        className={cn(
          'flex min-h-11 items-center rounded-full font-mono text-sm font-extrabold tabular-nums',
          className,
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={label}
          className="flex min-h-11 items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-3 transition active:scale-95"
        >
          {icon}
          {value.toLocaleString('fr-FR')}
        </button>
      </div>

      {/* La bulle : ancrée sous la pastille, avec sa pointe. Elle sort du flux
          (absolute) pour ne jamais pousser la bande de ressources. */}
      {open ? (
        <div
          id={panelId}
          className={cn(
            'absolute top-full right-0 z-10 mt-2 w-60 rounded-2xl p-3 text-left font-sans text-xs leading-relaxed shadow-xl',
            dark
              ? 'olympe-glass olympe-glass--sculpte text-[#ece5f7]'
              : 'bg-card text-foreground/80 ring-1 ring-black/10 backdrop-blur-md',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute -top-1 right-6 size-2.5 rotate-45 rounded-[2px]',
              // La pointe doit être OPAQUE (elle sort du verre, donc du flou) et
              // reprendre le ton du HAUT de la bulle, où le voile clair de
              // `.olympe-glass` est le plus fort — d'où le violet éclairci.
              dark ? 'bg-[oklch(0.31_0.055_300)]' : 'bg-card',
            )}
          />
          <p
            className={cn(
              'font-heading mb-1 text-sm font-extrabold',
              nameClassName,
            )}
          >
            {name}
          </p>
          <p>{description}</p>
          {/* LE CHEMIN VERS LA BOUTIQUE, en toutes lettres.
              Il était porté par un petit disque « + » collé au compteur : le
              dernier pictogramme de trait du bandeau, et un second objet dans
              une pastille qui n'a qu'une chose à dire — un nombre. Descendu
              ici, il est nommé au lieu d'être deviné, et le compteur redevient
              un compteur. Un tap de plus, pour une action qui n'est pas
              quotidienne. */}
          <Link
            href="/tresor?volet=boutique"
            className={cn(
              'font-heading mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-extrabold',
              nameClassName,
            )}
          >
            {plusLabel} →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
