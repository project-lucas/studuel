'use client'

import type { ReactNode } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

/**
 * La « scène » d'un mode de jeu : une PAGE plein cadre et OPAQUE qui recouvre le
 * décor d'arène pendant qu'on joue, avec un en-tête constant (nom du mode +
 * fermeture). Avant cette scène, chaque mode s'affichait à même le fond d'arène
 * (l'image du colisée), ce qui rendait les questions illisibles — surtout les
 * modes « clairs » (texte encre sur crème) posés sur une image sombre.
 *
 * Deux teintes, selon la palette d'origine du mode (aucun mode n'est repeint) :
 * - `light` : fond crème `bg-background`, encre marine. Pour les modes conçus
 *   clairs (Blitz, Chrono, Survie, Boss, Duel, Duel en direct) — leur éventuel
 *   texte blanc vit dans des panneaux colorés autonomes, jamais à même la page.
 * - `dark` : fond violet profond UNI (`.mode-stage-dark`), texte blanc. Pour les
 *   modes conçus sombres (Match classé, Coop).
 *
 * Full-bleed hors du `padding` de <main> par la même technique que /defi (marges
 * négatives), pour que la page couvre toute la largeur sans laisser transparaître
 * l'arène sur les côtés. La barre du haut et la barre d'onglets (z-50) restent
 * au-dessus ; l'en-tête colle sous la barre du haut sur mobile.
 */
export default function ModeStage({
  title,
  Icon,
  tone = 'light',
  theme,
  onExit,
  headerRight,
  children,
}: {
  title: string
  Icon: LucideIcon
  tone?: 'light' | 'dark'
  /**
   * Robe du mode : le nom d'une classe `.jeu-*` de globals.css (sans le préfixe).
   * Elle pose `--jeu-accent` / `--jeu-surface` / `--jeu-glow`, et la scène prend
   * alors l'atmosphère du mode au lieu du crème commun à tous.
   *
   * Sans thème, on garde le fond `bg-background` d'origine — un mode qui n'a pas
   * encore sa robe ne doit pas devenir illisible pour autant.
   */
  theme?: string
  onExit: () => void
  /** Emplacement optionnel à droite du titre (score, adversaire compact…). */
  headerRight?: ReactNode
  children: ReactNode
}) {
  const dark = tone === 'dark'
  const themed = !dark && !!theme
  return (
    // data-no-swipe : une partie en cours ne doit jamais changer d'onglet sur un
    // balayage (on quitte par la croix ou les boutons explicites du mode).
    <div
      data-no-swipe
      className={cn(
        '-mx-4 -mt-16 -mb-24 flex min-h-dvh flex-col pt-12 md:-mx-8 md:-my-10 md:pt-0',
        dark
          ? 'mode-stage-dark text-white'
          : themed
            ? `jeu-${theme} jeu-table text-foreground`
            : 'bg-background text-foreground',
      )}
    >
      <header
        className={cn(
          'sticky top-12 z-10 flex items-center gap-3 px-4 py-3 backdrop-blur-md md:top-0',
          dark
            ? 'border-b border-white/10 bg-black/15'
            : themed
              ? 'border-b border-black/5 bg-[color:var(--jeu-surface)]/80'
              : 'border-b border-black/5 bg-background/80',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-xl',
            dark
              ? 'bg-white/12 text-white'
              : themed
                ? 'bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)]'
                : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="size-5" />
        </span>
        <h1 className="font-heading min-w-0 flex-1 truncate text-base font-extrabold tracking-wide uppercase italic">
          {title}
        </h1>
        {headerRight}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onExit()
          }}
          aria-label="Quitter le mode"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors active:scale-90',
            dark
              ? 'text-white/70 hover:bg-white/10'
              : 'text-muted-foreground hover:bg-muted',
          )}
        >
          <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </header>

      {/* Le contenu du mode, centré, avec la marge basse qui dégage la barre
          d'onglets (safe-area comprise). */}
      <div className="mx-auto w-full max-w-xl flex-1 px-4 pt-3 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  )
}
