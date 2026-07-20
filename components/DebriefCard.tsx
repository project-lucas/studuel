'use client'

import { useState, useTransition } from 'react'
import { ArrowRight, Check, History, ListChecks, Pencil, X } from 'lucide-react'
import CoinIcon from '@/components/ui/CoinIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  DEBRIEF_CATALOG,
  DEBRIEF_REWARD_COINS,
  debriefComplete,
  debriefIcon,
  debriefMessage,
  debriefScore,
  type DebriefOutcome,
  type DebriefPair,
  type DebriefYearStats,
} from '@/lib/debrief'
import DebriefYearRecap from '@/components/DebriefYearRecap'
import { logDebrief, saveDebriefHabits } from '@/app/moi/actions'
import { useTablist } from '@/components/useTablist'

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

// Un côté du débrief du jour : l'habitude (icône + libellé) qui EST le bouton.
// Recliquer le côté actif efface la réponse ; l'autre côté se met en retrait.
function OutcomeSide({
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
  const label = side === 'bad' ? pair.bad : pair.good

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        side === 'bad'
          ? `Aujourd'hui, j'ai flanché : ${label}`
          : `Aujourd'hui, j'ai tenu : ${label}`
      }
      onClick={() => {
        sfx.tap()
        onPick(active ? null : side)
      }}
      className={cn(
        'flex h-full items-start gap-2 rounded-2xl border-2 p-2.5 text-left transition-all active:scale-[0.98]',
        active
          ? side === 'bad'
            ? 'border-destructive bg-destructive/10'
            : 'border-green-600 bg-green-600/10'
          : dimmed
            ? 'border-transparent bg-muted/40 opacity-60 hover:opacity-100'
            : 'border-transparent bg-muted/50 hover:bg-muted',
      )}
    >
      <DebriefIcon pair={pair} side={side} className="size-7 text-base" />
      <span className="min-w-0 text-xs leading-snug">
        <span className="font-semibold">{label}</span>
        {side === 'good' ? (
          <span className="mt-0.5 block text-[11px] font-semibold text-green-700 dark:text-green-400">
            {pair.benefit}
          </span>
        ) : null}
      </span>
    </button>
  )
}

// Une ligne du débrief du jour : le frein à gauche, l'habitude saine à droite —
// on touche le côté qu'on a vécu aujourd'hui (rechute ou victoire).
function OutcomeRow({
  pair,
  outcome,
  onPick,
}: {
  pair: DebriefPair
  outcome: DebriefOutcome | undefined
  onPick: (next: DebriefOutcome | null) => void
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
      <OutcomeSide pair={pair} side="bad" outcome={outcome} onPick={onPick} />
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 self-center text-muted-foreground"
      />
      <OutcomeSide pair={pair} side="good" outcome={outcome} onPick={onPick} />
    </div>
  )
}

export default function DebriefCard({
  selected,
  outcomes,
  yearStats,
  today,
  rewardClaimedToday = false,
  needsMigration = false,
}: {
  // Ids des paires référencées par l'élève (debrief_habits).
  selected: string[]
  // Issues du jour : pair_id → 'bad' | 'good' (debrief_logs, date du jour).
  outcomes: Record<string, DebriefOutcome>
  // Rétrospective annuelle (debrief_logs sur ~1 an) — « ce que j'ai coaché ».
  yearStats: DebriefYearStats
  // Jour courant (clé UTC YYYY-MM-DD) — repère de la heatmap annuelle.
  today: string
  // La récompense du jour a-t-elle déjà été créditée (debrief_rewards) ?
  rewardClaimedToday?: boolean
  needsMigration?: boolean
}) {
  // État local optimiste : le tap répond tout de suite, l'action suit.
  const [mySelection, setMySelection] = useState<Set<string>>(
    () => new Set(selected),
  )
  const [myOutcomes, setMyOutcomes] = useState(outcomes)
  const [editing, setEditing] = useState(false)
  // Onglet interne du bloc : le débrief du jour ou l'historique annuel.
  const [tab, setTab] = useState<'today' | 'history'>('today')
  const DEBRIEF_VIEWS = ['today', 'history'] as const
  const viewTabs = useTablist(DEBRIEF_VIEWS.length, (i) =>
    setTab(DEBRIEF_VIEWS[i]),
  )
  const [pending, startTransition] = useTransition()

  const pairs = DEBRIEF_CATALOG.filter((p) => mySelection.has(p.id))
  const empty = pairs.length === 0
  const score = debriefScore([...mySelection], myOutcomes)
  // Complet côté client (optimiste) OU déjà crédité côté serveur → récompense
  // acquise. Sinon elle est « à la clé » : c'est la carotte mise en évidence.
  const rewardEarned =
    rewardClaimedToday || debriefComplete([...mySelection], myOutcomes)

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
      className="moi-card rounded-[1.75rem] bg-white p-5 ring-2 ring-primary/15"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          Ton débrief du jour
        </p>
        <div className="flex items-center gap-1.5">
          {!empty && !editing && !needsMigration ? (
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums transition-colors',
                rewardEarned
                  ? 'bg-green-600/15 text-green-700 dark:text-green-400'
                  : 'bg-highlight/20 text-amber-700 dark:text-amber-300',
              )}
              aria-label={
                rewardEarned
                  ? `Récompense obtenue : ${DEBRIEF_REWARD_COINS} pièces`
                  : `${DEBRIEF_REWARD_COINS} pièces à gagner en terminant ton débrief`
              }
            >
              {rewardEarned ? (
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              ) : (
                <CoinIcon className="size-3.5" strokeWidth={2.5} />
              )}
              +{DEBRIEF_REWARD_COINS}
            </span>
          ) : null}
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
      </div>

      {needsMigration ? (
        /* Message ÉLÈVE : cette carte s'affiche sur /moi — pas d'instruction
           technique ici. */
        <p className="text-xs leading-relaxed text-muted-foreground">
          Le point sur tes habitudes n&apos;est pas encore disponible. Reviens
          un peu plus tard !
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
        /* -------------------------------- débrief du jour + historique */
        <>
          {/* Segmented control : le geste du jour ou la vue sur l'année. */}
          <div
            role="tablist"
            aria-label="Vue du débrief"
            className="mb-4 flex gap-1 rounded-full bg-muted/70 p-1"
          >
            {(
              [
                { key: 'today', label: "Aujourd'hui", icon: ListChecks },
                { key: 'history', label: 'Historique', icon: History },
              ] as const
            ).map(({ key, label, icon: Icon }, i) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`debrief-tab-${key}`}
                aria-selected={tab === key}
                aria-controls="debrief-panel"
                {...viewTabs.props(i, tab === key)}
                onClick={() => {
                  sfx.tap()
                  setTab(key)
                }}
                className={cn(
                  'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-bold transition-all',
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <div
            id="debrief-panel"
            role="tabpanel"
            aria-labelledby={`debrief-tab-${tab}`}
          >
          {tab === 'history' ? (
            <DebriefYearRecap stats={yearStats} today={today} />
          ) : (
            <>
          <p className="mb-3 text-center text-xs leading-relaxed text-muted-foreground">
            Sur chaque ligne, touche ce qui s&apos;est vraiment passé
            aujourd&apos;hui : à gauche si tu as flanché, à droite si tu as tenu
            la bonne habitude.
          </p>
          {/* En-têtes de colonnes : ❌ rechute / ✅ victoire. */}
          <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <span className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-destructive">
              <span className="flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm">
                <X className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              Rechute
            </span>
            <span className="w-4" aria-hidden="true" />
            <span className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-green-700 dark:text-green-400">
              <span className="flex size-6 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              Victoire
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {pairs.map((pair) => (
              <OutcomeRow
                key={pair.id}
                pair={pair}
                outcome={myOutcomes[pair.id]}
                onPick={(next) => pickOutcome(pair.id, next)}
              />
            ))}
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

          {rewardEarned ? (
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-green-600/10 py-2 text-xs font-bold text-green-700 dark:text-green-400">
              <CoinIcon className="size-4" strokeWidth={2.5} />
              Débrief du jour validé · +{DEBRIEF_REWARD_COINS} pièces
            </p>
          ) : (
            <p className="mt-3 text-center text-[11px] font-semibold text-muted-foreground">
              Réponds à chaque habitude pour empocher tes{' '}
              {DEBRIEF_REWARD_COINS} pièces du jour.
            </p>
          )}
            </>
          )}
          </div>
        </>
      )}
    </section>
  )
}
