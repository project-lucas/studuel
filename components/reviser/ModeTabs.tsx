'use client'

import { Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { tabId, type ModeIcon, type ModeTab } from '@/lib/subject-template'

// Le catalogue (lib/) ne connaît que le NOM du pictogramme ; la correspondance
// avec l'icône vit ici, au seul endroit qui a le droit de rendre du JSX.
const MODE_ICONS: Record<ModeIcon, typeof Gamepad2> = { manette: Gamepad2 }

// Barre d'onglets du template matière : Programme · Mode de jeu, plus Annales
// pour les années à examen (cf. `modesFor`). Une matière qui réunit DEUX
// disciplines (histoire-géo) remplace « Programme » par un onglet par
// discipline — d'où l'identification par `tabId` et non par la clé : deux
// onglets peuvent désormais porter la même (`programme`).
//
// DEUX OU TROIS onglets qui tiennent la largeur, au lieu de sept qui
// débordaient : les deux derniers (« Mes erreurs », « Boss ») vivaient hors
// écran, derrière un scroll horizontal que rien n'annonçait. Ici tout est
// visible d'un coup d'œil, chaque onglet occupe la même part — plus de contenu
// caché, plus de scroll. Actif : fond crème, texte encre ; inactifs : outline
// sur le fond coloré.
export default function ModeTabs({
  modes,
  active,
  onChange,
  bulle = null,
}: {
  modes: ModeTab[]
  /** Identifiant de l'onglet actif (« jeu », « programme:geographie »). */
  active: string
  onChange: (tab: string) => void
  /**
   * Une BULLE posée au-dessus d'un onglet (« Boss disponible »), pour annoncer
   * ce qui vient de s'ouvrir derrière lui. Elle ne vit que le temps de
   * l'événement : une bulle permanente n'est plus vue au bout de deux jours.
   */
  bulle?: { tab: string; label: string } | null
}) {
  return (
    <nav
      aria-label="Contenus de la matière"
      className="mt-5 flex items-stretch gap-2"
    >
      {modes.map((mode) => {
        const id = tabId(mode)
        const isActive = id === active
        const Icon = mode.icon ? MODE_ICONS[mode.icon] : null
        const annonce = bulle && bulle.tab === id ? bulle.label : null
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (isActive) return
              sfx.tap()
              onChange(id)
            }}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm transition-colors',
              isActive
                ? 'bg-card font-bold text-foreground shadow-sm'
                : 'border border-white/50 font-semibold text-white hover:bg-white/10',
              annonce ? 'relative' : null,
            )}
          >
            {/* La bulle : posée SUR le bord haut de l'onglet, avec sa pointe.
                Elle n'est pas annoncée deux fois au lecteur d'écran — l'écusson
                du header dit déjà que le gardien est sorti. */}
            {annonce ? (
              <span
                aria-hidden="true"
                className="font-heading absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-highlight px-2 py-0.5 text-[10px] leading-tight font-extrabold whitespace-nowrap text-foreground shadow-md after:absolute after:top-full after:left-1/2 after:-mt-px after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-highlight after:content-['']"
              >
                {annonce}
              </span>
            ) : null}
            {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
            <span className="truncate">{mode.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
