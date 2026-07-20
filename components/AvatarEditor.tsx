'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  AVATAR_FIELDS,
  avatarDataUri,
  type AvatarConfig,
  type AvatarField,
} from '@/lib/avatar'
import { saveAvatar } from '@/app/moi/actions'
import { useTablist } from '@/components/useTablist'

// -----------------------------------------------------------------------------
// « Crée ton avatar » — l'éditeur façon Duolingo : un grand aperçu en direct,
// des onglets (peau, coiffure, yeux, lunettes, tenue…), chaque option montrée
// telle qu'elle rendra (vignette d'avatar pour les styles, pastille pour les
// couleurs). Le rendu est 100 % local (DiceBear), aucun appel réseau.
// -----------------------------------------------------------------------------

// Valeur spéciale pour « aucun » (chauve, sans lunettes, sans barbe, fond nul).
const NONE = '__none__'

function OptionButton({
  selected,
  onClick,
  children,
  label,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 bg-muted/40 transition-all active:scale-95',
        selected
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-transparent hover:border-primary/30',
      )}
    >
      {children}
      {selected ? (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />
        </span>
      ) : null}
    </button>
  )
}

function FieldOptions({
  field,
  cfg,
  onPick,
}: {
  field: AvatarField
  cfg: AvatarConfig
  onPick: (value: string) => void
}) {
  const current = cfg[field.key]

  // Une vignette d'avatar par option de style : la config actuelle avec ce seul
  // champ remplacé — l'élève voit exactement ce que l'option donne. Mémoïsé pour
  // ne pas régénérer tous les SVG à chaque frappe.
  const styleThumbs = useMemo(() => {
    if (field.kind !== 'style') return null
    const map: Record<string, string> = {}
    for (const opt of field.options) {
      map[opt] = avatarDataUri({ ...cfg, [field.key]: opt }, 72)
    }
    if (field.allowNone) map[NONE] = avatarDataUri({ ...cfg, [field.key]: '' }, 72)
    return map
  }, [field, cfg])

  const options = field.allowNone ? [NONE, ...field.options] : [...field.options]

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
      {options.map((opt) => {
        const value = opt === NONE ? '' : opt
        const selected = current === value

        if (field.kind === 'color') {
          return (
            <OptionButton
              key={opt}
              selected={selected}
              onClick={() => onPick(value)}
              label={opt === NONE ? 'Aucun' : `Couleur ${opt}`}
            >
              {opt === NONE ? (
                <span className="text-[10px] font-bold text-muted-foreground">
                  Aucun
                </span>
              ) : (
                <span
                  className="size-8 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: `#${opt}` }}
                  aria-hidden="true"
                />
              )}
            </OptionButton>
          )
        }

        return (
          <OptionButton
            key={opt}
            selected={selected}
            onClick={() => onPick(value)}
            label={opt === NONE ? 'Aucun' : opt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={styleThumbs?.[opt]}
              alt=""
              aria-hidden="true"
              className="size-full object-contain"
            />
          </OptionButton>
        )
      })}
    </div>
  )
}

export default function AvatarEditor({
  initial,
  onClose,
}: {
  initial: AvatarConfig
  onClose: () => void
}) {
  const [cfg, setCfg] = useState<AvatarConfig>(initial)
  const [activeKey, setActiveKey] = useState<AvatarField['key']>(
    AVATAR_FIELDS[0].key,
  )
  const [pending, startTransition] = useTransition()
  const fieldTabs = useTablist(AVATAR_FIELDS.length, (i) =>
    setActiveKey(AVATAR_FIELDS[i].key),
  )

  const activeField =
    AVATAR_FIELDS.find((f) => f.key === activeKey) ?? AVATAR_FIELDS[0]
  const preview = useMemo(() => avatarDataUri(cfg, 224), [cfg])

  // Échap ferme la modale ; on verrouille le scroll du fond pendant l'édition.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const pick = (value: string) => {
    sfx.tap()
    setCfg((prev) => {
      const next = { ...prev, [activeField.key]: value }
      // La couleur de barbe suit la couleur de cheveux (pas d'onglet dédié).
      if (activeField.key === 'hairColor') next.facialHairColor = value
      return next
    })
  }

  const save = () =>
    startTransition(async () => {
      await saveAvatar(cfg)
      onClose()
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Crée ton avatar"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête : titre + fermer. */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer sans enregistrer"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} />
          </button>
          <h2 className="font-heading text-base font-extrabold">Crée ton avatar</h2>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition active:translate-y-px disabled:opacity-60"
          >
            {pending ? '…' : 'Terminé'}
          </button>
        </div>

        {/* Grand aperçu en direct. */}
        <div className="flex justify-center bg-muted/40 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Aperçu de ton avatar"
            className="size-28 rounded-full bg-white shadow-md ring-4 ring-white"
          />
        </div>

        {/* Onglets des parties. */}
        <div
          role="tablist"
          aria-label="Parties de l'avatar"
          className="flex gap-1.5 overflow-x-auto border-y border-border px-3 py-2"
        >
          {AVATAR_FIELDS.map((f, i) => {
            const selected = f.key === activeKey
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                id={`avatar-tab-${f.key}`}
                aria-selected={selected}
                aria-controls="avatar-options"
                {...fieldTabs.props(i, selected)}
                onClick={() => {
                  sfx.tap()
                  setActiveKey(f.key)
                }}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Grille d'options de la partie active. */}
        <div
          id="avatar-options"
          role="tabpanel"
          aria-labelledby={`avatar-tab-${activeKey}`}
          className="min-h-0 flex-1 overflow-y-auto p-4"
        >
          <FieldOptions field={activeField} cfg={cfg} onPick={pick} />
        </div>
      </div>
    </div>
  )
}
