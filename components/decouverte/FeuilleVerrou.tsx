'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import BottomSheet from '@/components/carnet/BottomSheet'
import XpIcon from '@/components/ui/XpIcon'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { progressionVersNiveau, xpManquante } from '@/lib/decouverte/etat'
import type { Decouverte } from '@/lib/decouverte/catalogue'

/**
 * LA FEUILLE D'UN ONGLET FERMÉ (25/10/2026, cadrage « le jeu vivant » § E) :
 * ce qui monte quand un nouveau compte touche un onglet que son niveau n'ouvre
 * pas encore. « Se débloque au niveau 2 — encore 60 XP », le dessin de
 * l'onglet sous cadenas, ce que Marcel en dit, la barre vers le niveau, et UN
 * geste : aller réviser (c'est là que l'XP se gagne). Jamais de navigation
 * vers l'onglet fermé.
 *
 * Bâtie sur la feuille montante du carnet (CSS, pas de framer-motion).
 */
export default function FeuilleVerrou({
  verrou,
  xp,
  onClose,
}: {
  /** La découverte qui ferme l'onglet touché ; null = feuille fermée. */
  verrou: Decouverte | null
  xp: number
  onClose: () => void
}) {
  // La feuille reste montée le temps de sa sortie : on garde le dernier verrou
  // affiché pour que le contenu ne disparaisse pas avant le panneau.
  const [dernier, setDernier] = useState(verrou)
  if (verrou && verrou !== dernier) setDernier(verrou)
  const d = verrou ?? dernier
  if (!d) return null

  const manque = xpManquante(xp, d.niveau)
  const pct = Math.round(progressionVersNiveau(xp, d.niveau) * 100)

  return (
    <BottomSheet open={verrou !== null} onClose={onClose} title={`Se débloque au niveau ${d.niveau}`}>
      <div className="flex flex-col items-center gap-4 pb-1 text-center">
        <div className="relative">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-muted">
            {d.dessin ? (
              <Image
                src={d.dessin}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                className="size-20 object-contain opacity-70 saturate-[0.3]"
              />
            ) : (
              <Lock className="size-10 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -bottom-1.5 flex size-8 items-center justify-center rounded-full bg-foreground text-background ring-4 ring-white"
          >
            <Lock className="size-4" />
          </span>
        </div>

        <div>
          <p className="font-heading text-2xl font-extrabold text-foreground">{d.nom}</p>
          <p className="mt-1 text-sm text-muted-foreground">{d.phrase}</p>
        </div>

        <div className="w-full rounded-2xl bg-muted/60 p-3">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-1.5 text-foreground">
              <XpIcon className="size-4" />
              <span>{manque > 0 ? `Encore ${manque} XP` : 'Tu y es !'}</span>
            </span>
            <span className="text-muted-foreground">Niveau {d.niveau}</span>
          </div>
          <div
            role="progressbar"
            aria-label={`Progression vers le niveau ${d.niveau}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-2 h-3 overflow-hidden rounded-full bg-background ring-1 ring-foreground/10"
          >
            <div className="h-full rounded-full bg-highlight" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link
          href="/reviser"
          onClick={onClose}
          className={cn(buttonVariants({ size: 'xl' }), 'w-full')}
        >
          Aller réviser
        </Link>
      </div>
    </BottomSheet>
  )
}
