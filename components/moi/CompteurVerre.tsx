import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// UN COMPTEUR EN VERRE — une pastille de la carte de joueur.
//
// Neutre (pas de 'use client') : la pastille des notes est cliente (elle ouvre
// la saisie), les autres sont rendues par le serveur, et toutes doivent être
// le même dessin au pixel.
//
// COURT, ET SUR UNE SEULE RANGÉE. La version d'avant portait une ligne de
// détail (record, semaine en cours, courbe) en deux colonnes : quatre tuiles
// hautes, à moitié vides, qui repoussaient le classement d'un écran. Le
// détail n'y gagnait rien — le rythme des huit semaines a son propre bloc
// sous la carte. Ici : le chiffre, son mot, rien d'autre.
// -----------------------------------------------------------------------------

export type CompteurCarte = {
  valeur: ReactNode
  /** Le mot sous le chiffre, en petites capitales (« série », « travail »). */
  legende: string
}

export default function CompteurVerre({
  valeur,
  legende,
  className,
}: CompteurCarte & { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center justify-center rounded-2xl border border-white/16 bg-white/12 px-1.5 py-2 text-center backdrop-blur-[4px]',
        className,
      )}
    >
      <p className="font-heading truncate text-[19px] leading-none font-extrabold tabular-nums">
        {valeur}
      </p>
      <p className="mt-1 truncate text-[9.5px] font-bold tracking-[0.05em] text-white/80 uppercase">
        {legende}
      </p>
    </div>
  )
}
