import type { ComponentType, ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// UNE TUILE DE PREUVE — série, temps, moyenne.
//
// Ce fichier n'a PAS de directive 'use client' : il est neutre, et se laisse
// importer des deux côtés de la frontière — la tuile des notes est cliente
// (elle ouvre la saisie), les deux autres sont rendues par le serveur, et les
// trois doivent être le même dessin au pixel.
//
// CE QUI A CHANGÉ (03/09/2026). Les chiffres vivaient en cellules centrées sur
// une plaque blanche, en gris, tous du même poids. La tuile est maintenant une
// petite carte à part entière : la pastille d'icône en haut à gauche, le
// chiffre en Baloo 2 dessous, la légende en bas — un objet qu'on peut montrer.
// Et un chiffre absent n'est plus un tiret : la tuile porte alors un VERBE
// (« Ajoute tes notes », « Lance ta série ») — cf. les appelants.
//
// TROIS TEINTES, PAS SIX : la flamme pour la série, le violet pour le travail,
// l'or pour l'arène (`.moi-chiffre-pastille--*`, globals.css).
// -----------------------------------------------------------------------------

export type TonChiffre = 'serie' | 'travail' | 'arene'

export type Tendance = 'hausse' | 'baisse' | 'stable' | null

const PASTILLE: Record<TonChiffre, string> = {
  serie: 'moi-chiffre-pastille--serie',
  travail: 'moi-chiffre-pastille--travail',
  arene: 'moi-chiffre-pastille--arene',
}

/** Vert qui monte, ambre qui descend — jamais le corail des alertes. */
function Fleche({ tendance }: { tendance: Exclude<Tendance, null> }) {
  const Icon =
    tendance === 'hausse' ? ArrowUpRight : tendance === 'baisse' ? ArrowDownRight : Minus
  return (
    <Icon
      className={cn(
        'size-4 shrink-0',
        tendance === 'hausse'
          ? 'text-success'
          : tendance === 'baisse'
            ? 'text-warning'
            : 'text-muted-foreground',
      )}
      strokeWidth={3}
      aria-hidden="true"
    />
  )
}

export function Chiffre({
  Icon,
  illustration,
  illustrationEteinte = false,
  ton,
  valeur,
  unite,
  legende,
  note,
  tendance = null,
  graphe,
}: {
  Icon?: ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>
  /** Une image à la place de l'icône de trait (la flamme de série). */
  illustration?: string
  /** L'illustration est ÉTEINTE (désaturée) : série à zéro. */
  illustrationEteinte?: boolean
  ton: TonChiffre
  valeur: ReactNode
  unite?: string
  legende: string
  note?: ReactNode
  tendance?: Tendance
  /** Une mini-courbe sous le chiffre (le temps). */
  graphe?: ReactNode
}) {
  return (
    <div className="flex min-h-[104px] min-w-0 flex-1 flex-col gap-1.5 text-left">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-[10px]',
          'moi-chiffre-pastille',
          illustrationEteinte ? 'moi-chiffre-pastille--eteinte' : PASTILLE[ton],
        )}
      >
        {illustration ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={illustration}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className={cn(
              'size-[18px] object-contain',
              illustrationEteinte ? 'opacity-45 grayscale' : null,
            )}
          />
        ) : Icon ? (
          <Icon className="size-[15px]" strokeWidth={2.4} aria-hidden={true} />
        ) : null}
      </span>
      <p className="font-heading flex items-baseline gap-0.5 leading-none font-extrabold text-foreground">
        <span className="text-[22px] tabular-nums">{valeur}</span>
        {unite ? <span className="text-xs text-muted-foreground">{unite}</span> : null}
        {tendance ? (
          <span className="ml-0.5 self-center">
            <Fleche tendance={tendance} />
          </span>
        ) : null}
      </p>
      {graphe}
      <p className="mt-auto text-[10.5px] leading-tight font-bold text-muted-foreground">
        {legende}
        {note ? <span className="block">{note}</span> : null}
      </p>
    </div>
  )
}
