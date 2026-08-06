'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import BottomSheet from '@/components/carnet/BottomSheet'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import type { Trimestre } from '@/lib/notes'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { saveTermAverageAction } from '@/app/moi/actions'

// La saisie des moyennes de trimestre — extraite de TrajectoryCard.
//
// Elle y vivait en composant privé, et la trajectoire était donc le SEUL endroit
// d'où l'élève pouvait déclarer ses moyennes. Depuis que la tuile « Moyenne
// générale » ouvre la même saisie, deux écrans en ont besoin : une seule
// implémentation, sinon deux formulaires divergeront sur les bornes ou sur le
// verrouillage des trimestres calculés.

export function SaisieMoyennesSheet({
  open,
  onClose,
  terms,
}: {
  open: boolean
  onClose: () => void
  /** Les trois trimestres, fusionnés (notes réelles d'abord). */
  terms: readonly TermPoint[]
}) {
  const [values, setValues] = useState<Record<number, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const submit = () => {
    setError(null)
    const updates: { term: Trimestre; average: number }[] = []
    for (const p of terms) {
      // Un trimestre calculé depuis les notes n'est pas saisissable : deux
      // sources de vérité pour une même moyenne, c'est une contradiction à
      // retardement.
      if (p.source === 'notes') continue
      const raw = values[p.t]
      if (raw === undefined || raw.trim() === '') continue
      const n = Number(raw.replace(',', '.'))
      if (!Number.isFinite(n) || n < 0 || n > 20) {
        setError('Chaque moyenne doit être un nombre entre 0 et 20.')
        return
      }
      updates.push({ term: p.t, average: n })
    }
    if (updates.length === 0) {
      onClose()
      return
    }
    startTransition(async () => {
      for (const u of updates) {
        const { ok } = await saveTermAverageAction(u.term, u.average)
        if (!ok) {
          setError('Impossible d’enregistrer pour l’instant. Réessaie plus tard.')
          return
        }
      }
      sfx.tap()
      onClose()
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Mes moyennes de trimestre">
      <div className="space-y-3">
        {terms.map((p) => (
          <label key={p.t} className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">
              Trimestre {p.t}
              {p.source === 'notes' ? (
                <span className="block text-xs font-semibold text-muted-foreground">
                  calculée depuis tes notes
                </span>
              ) : null}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.1}
              disabled={p.source === 'notes'}
              defaultValue={p.avg ?? undefined}
              onChange={(e) =>
                setValues((v) => ({ ...v, [p.t]: e.target.value }))
              }
              placeholder="— /20"
              className="w-24 rounded-xl border border-border bg-white px-3 py-2 text-right font-mono text-sm font-bold text-foreground tabular-nums disabled:bg-muted disabled:text-muted-foreground"
            />
          </label>
        ))}
        {error ? (
          <p role="alert" className="text-xs font-bold text-destructive">
            {error}
          </p>
        ) : null}
        <Button className="w-full" onClick={submit} disabled={pending}>
          {pending ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </BottomSheet>
  )
}

/**
 * Le contenu de la tuile « Moyenne générale » quand aucune note n'est connue.
 *
 * Un appel à l'action, PAS un mur : les deux autres preuves restent pleines à
 * côté. L'ancien écran bloquait un tiers de la page sur « Ajoute tes moyennes
 * pour voir ta trajectoire » — une demande de saisie avant tout retour.
 */
export default function AjouterMoyennes({
  terms,
  disabled = false,
}: {
  terms: readonly TermPoint[]
  /** La migration 187 n'est pas passée : la saisie n'a nulle part où aller. */
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  // Ce bouton vit sur le violet du panneau d'identité, à la place du chiffre
  // manquant : son encre est donc blanche, pas la couleur de marque — laquelle
  // disparaîtrait sur son propre fond.
  if (disabled) {
    return (
      <span className="text-[13px] leading-tight font-bold text-white/70">
        Bientôt
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        className="flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs leading-tight font-extrabold text-white ring-1 ring-white/30 transition-transform active:scale-95"
      >
        <Plus className="size-3.5" strokeWidth={3} aria-hidden="true" />
        Ajouter
      </button>
      <SaisieMoyennesSheet
        open={open}
        onClose={() => setOpen(false)}
        terms={terms}
      />
    </>
  )
}
