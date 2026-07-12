'use client'

import { Fragment, useState, useTransition } from 'react'
import { ArrowRight, Check, Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  DEBRIEF_CATALOG,
  debriefIcon,
  debriefMessage,
  debriefScore,
  type DebriefOutcome,
  type DebriefPair,
} from '@/lib/debrief'
import { logDebrief, saveDebriefHabits } from '@/app/moi/actions'

// -----------------------------------------------------------------------------
// « Ton débrief » — l'élève référence ses habitudes actuelles (les freins),
// chacune en face de l'habitude saine qui la remplace + son bénéfice chiffré.
// Puis chaque jour, il raconte : rechute (colonne gauche) ou victoire (droite).
// -----------------------------------------------------------------------------

// L'icône d'une habitude : l'image-bouton illustrée si elle est déposée
// (DEBRIEF_ICON_IDS dans lib/debrief.ts), l'émoji du catalogue en pastille
// sinon. Taille et corps de l'émoji pilotés par className (size-* + text-*).
function DebriefIcon({
  pair,
  side,
  className,
}: {
  pair: DebriefPair
  side: DebriefOutcome
  className?: string
}) {
  const src = debriefIcon(pair.id, side)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={cn('shrink-0 object-contain', className)}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        side === 'bad' ? 'bg-destructive/10' : 'bg-green-600/10',
        className,
      )}
    >
      {side === 'bad' ? pair.badEmoji : pair.goodEmoji}
    </span>
  )
}

// Une ligne du tableau en mode sélection : frein → habitude saine (bénéfice).
function PickRow({
  pair,
  checked,
  onToggle,
}: {
  pair: (typeof DEBRIEF_CATALOG)[number]
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => {
        sfx.tap()
        onToggle()
      }}
      className={cn(
        'grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.99]',
        checked
          ? 'border-primary bg-primary/5'
          : 'border-transparent bg-muted/50 opacity-75 hover:opacity-100',
      )}
    >
      <span className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border text-white transition-colors',
            checked
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/40 bg-white',
          )}
        >
          {checked ? <Check className="size-3" strokeWidth={3} /> : null}
        </span>
        <DebriefIcon pair={pair} side="bad" className="size-6 text-sm" />
        <span className="min-w-0 text-xs leading-snug font-semibold">
          {pair.bad}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <span className="flex min-w-0 items-start gap-2 text-xs leading-snug">
        <DebriefIcon pair={pair} side="good" className="size-6 text-sm" />
        <span className="min-w-0">
          <span className="font-semibold">{pair.good}</span>
          <span className="mt-0.5 block text-[11px] font-semibold text-green-700 dark:text-green-400">
            {pair.benefit}
          </span>
        </span>
      </span>
    </button>
  )
}

// Une case du débrief du jour : l'image EST le bouton — l'icône illustrée en
// grand, le libellé réduit dessous (le bénéfice reste en mode sélection).
// Recliquer la même case efface la réponse ; l'autre côté se met en retrait.
function OutcomeCell({
  pair,
  side,
  outcome,
  onPick,
}: {
  pair: DebriefPair
  side: DebriefOutcome
  outcome: DebriefOutcome | undefined
  onPick: (next: DebriefOutcome | null) => void
}) {
  const active = outcome === side
  const dimmed = outcome !== undefined && !active

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        sfx.tap()
        onPick(active ? null : side)
      }}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-all active:scale-95',
        active &&
          (side === 'bad'
            ? 'bg-destructive/10 ring-2 ring-destructive'
            : 'bg-green-600/10 ring-2 ring-green-600'),
        dimmed && 'opacity-40 grayscale',
      )}
    >
      <DebriefIcon pair={pair} side={side} className="size-14 text-3xl" />
      <span className="text-center text-[10px] leading-tight font-semibold">
        {side === 'bad' ? pair.bad : pair.good}
      </span>
    </button>
  )
}

export default function DebriefCard({
  selected,
  outcomes,
  needsMigration = false,
}: {
  // Ids des paires référencées par l'élève (debrief_habits).
  selected: string[]
  // Issues du jour : pair_id → 'bad' | 'good' (debrief_logs, date du jour).
  outcomes: Record<string, DebriefOutcome>
  needsMigration?: boolean
}) {
  // État local optimiste : le tap répond tout de suite, l'action suit.
  const [mySelection, setMySelection] = useState<Set<string>>(
    () => new Set(selected),
  )
  const [myOutcomes, setMyOutcomes] = useState(outcomes)
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()

  const pairs = DEBRIEF_CATALOG.filter((p) => mySelection.has(p.id))
  const empty = pairs.length === 0
  const score = debriefScore([...mySelection], myOutcomes)

  const toggle = (id: string) =>
    setMySelection((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const finishEditing = () =>
    startTransition(async () => {
      await saveDebriefHabits([...mySelection])
      setEditing(false)
    })

  const pickOutcome = (pairId: string, next: DebriefOutcome | null) => {
    setMyOutcomes((prev) => {
      const copy = { ...prev }
      if (next === null) delete copy[pairId]
      else copy[pairId] = next
      return copy
    })
    startTransition(() => logDebrief(pairId, next))
  }

  return (
    <section
      aria-label="Ton débrief d'habitudes"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          Ton débrief
        </p>
        {!empty && !editing && !needsMigration ? (
          <button
            type="button"
            aria-label="Modifier mes habitudes référencées"
            title="Modifier mes habitudes"
            onClick={() => {
              sfx.tap()
              setEditing(true)
            }}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90"
          >
            <Pencil className="size-4" strokeWidth={2.2} />
          </button>
        ) : null}
      </div>

      {needsMigration ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Exécute <code>supabase/027_debrief.sql</code> dans le SQL Editor
          Supabase, puis recharge la page.
        </p>
      ) : empty || editing ? (
        /* ------------------------------------ sélection des habitudes-freins */
        <>
          <h2 className="font-heading text-xl font-bold">
            Fais le point sur tes habitudes
          </h2>
          <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
            Coche les habitudes qui te ressemblent. En face de chacune :
            l&apos;habitude saine qui la remplace, et ce qu&apos;elle te
            rapporte.
          </p>
          <div className="flex flex-col gap-2">
            {DEBRIEF_CATALOG.map((pair) => (
              <PickRow
                key={pair.id}
                pair={pair}
                checked={mySelection.has(pair.id)}
                onToggle={() => toggle(pair.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={finishEditing}
            disabled={pending}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition active:translate-y-px disabled:opacity-60"
          >
            <Check className="size-4" strokeWidth={2.5} />
            {pending
              ? 'Enregistrement…'
              : editing
                ? 'Terminé'
                : 'Commencer mon débrief'}
          </button>
        </>
      ) : (
        /* ------------------------------------------------ débrief du jour */
        <>
          <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
            Touche ce qui s&apos;est vraiment passé aujourd&apos;hui.
          </p>
          <div className="relative">
            {/* Le trait vertical entre les deux colonnes, comme la maquette. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* En-têtes de colonnes : ❌ mauvaises / ✅ saines. */}
              <div className="flex flex-col items-center gap-1.5 pb-1">
                <span className="flex size-9 items-center justify-center rounded-full bg-destructive text-white shadow-sm">
                  <X className="size-5" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="text-center text-sm leading-tight font-extrabold">
                  Mauvaises habitudes
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5 pb-1">
                <span className="flex size-9 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                  <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="text-center text-sm leading-tight font-extrabold">
                  Saines habitudes
                </p>
              </div>

              {pairs.map((pair) => (
                <Fragment key={pair.id}>
                  <OutcomeCell
                    pair={pair}
                    side="bad"
                    outcome={myOutcomes[pair.id]}
                    onPick={(next) => pickOutcome(pair.id, next)}
                  />
                  <OutcomeCell
                    pair={pair}
                    side="good"
                    outcome={myOutcomes[pair.id]}
                    onPick={(next) => pickOutcome(pair.id, next)}
                  />
                </Fragment>
              ))}
            </div>
          </div>
          {score.pending < score.total ? (
            <p className="mt-4 text-center text-xs font-semibold">
              <span className="text-green-700 dark:text-green-400">
                {score.wins} victoire{score.wins > 1 ? 's' : ''}
              </span>{' '}
              sur {score.total} aujourd&apos;hui —{' '}
              {debriefMessage(score.wins, score.total)}
            </p>
          ) : null}
        </>
      )}
    </section>
  )
}
