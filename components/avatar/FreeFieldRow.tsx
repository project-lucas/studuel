'use client'

import { useMemo } from 'react'
import { Check, Ban } from 'lucide-react'
import {
  avatarDataUri,
  freeAvatarField,
  type AvatarConfig,
  type FreeAvatarFieldKey,
} from '@/lib/avatar'
import {
  FREE_FIELD_LABELS,
  FREE_FIELD_NONE_LABELS,
  freeOptionLabel,
} from '@/lib/avatar-studio'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Une rangée de champ LIBRE du vestiaire : expression, lunettes, barbe, fond.
//
// Ces quatre-là n'ont ni prix ni cadenas — ce sont les traits par lesquels un
// élève se reconnaît, pas des cosmétiques à collectionner. La vignette est donc
// nue : l'aperçu, le nom, et une coche sur celle qui est portée. Aucun jeton de
// pièce, aucun grisé.
//
// L'APERÇU MONTRE L'AVATAR DE L'ÉLÈVE, pas un modèle générique : chaque
// vignette rend SA configuration avec cette seule option changée. C'est la même
// règle que les vignettes du catalogue (`ItemTile`), et c'est la seule façon de
// choisir une expression — « smileTeethGap » ne veut rien dire tant qu'on ne
// l'a pas sur son propre visage.
// -----------------------------------------------------------------------------

function Vignette({
  field,
  value,
  config,
  selected,
  onPick,
}: {
  field: FreeAvatarFieldKey
  /** '' = l'option « aucun ». */
  value: string
  config: AvatarConfig
  selected: boolean
  onPick: (value: string) => void
}) {
  const spec = freeAvatarField(field)
  const isColor = spec?.kind === 'color'

  // Mémoïsé sur (champ, valeur, config) : la grille se re-rend à chaque
  // équipement, on ne recompose pas 18 SVG pour autant.
  const thumb = useMemo(() => {
    if (isColor) return null
    return avatarDataUri({ ...config, [field]: value, equipment: '' }, 96)
  }, [isColor, config, field, value])

  const noneLabel = FREE_FIELD_NONE_LABELS[field] ?? 'Aucun'
  const label = value === '' ? noneLabel : freeOptionLabel(field, value)

  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <button
        type="button"
        aria-label={selected ? `${label} — choisi` : label}
        aria-pressed={selected}
        onClick={() => onPick(value)}
        className={cn(
          'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-primary/8 transition-all active:scale-95',
          selected
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-transparent hover:border-primary/30',
        )}
      >
        {value === '' ? (
          <Ban className="size-7 text-muted-foreground" aria-hidden="true" />
        ) : isColor ? (
          <span
            className="size-10 rounded-full border border-black/10 shadow-inner"
            style={{ backgroundColor: `#${value}` }}
            aria-hidden="true"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb ?? undefined}
            alt=""
            aria-hidden="true"
            className="size-full object-contain"
          />
        )}

        {selected ? (
          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={3.5} aria-hidden="true" />
          </span>
        ) : null}
      </button>

      <p className="w-full truncate text-center text-[11px] font-bold text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

export default function FreeFieldRow({
  field,
  config,
  withTitle,
  onPick,
}: {
  field: FreeAvatarFieldKey
  config: AvatarConfig
  /** Faux quand l'onglet ne porte qu'un groupe : le titre serait redondant. */
  withTitle: boolean
  onPick: (field: FreeAvatarFieldKey, value: string) => void
}) {
  const spec = freeAvatarField(field)
  if (!spec) return null

  const current = config[field]
  const values = spec.allowNone ? ['', ...spec.options] : [...spec.options]

  return (
    <section aria-label={FREE_FIELD_LABELS[field]}>
      {withTitle ? (
        <h3 className="mb-2 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
          {FREE_FIELD_LABELS[field]}
        </h3>
      ) : null}
      <div className="grid grid-cols-3 gap-2.5">
        {values.map((value) => (
          <Vignette
            key={value || 'aucun'}
            field={field}
            value={value}
            config={config}
            selected={current === value}
            onPick={(v) => onPick(field, v)}
          />
        ))}
      </div>
    </section>
  )
}
