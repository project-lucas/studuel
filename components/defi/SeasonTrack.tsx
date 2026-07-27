'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Crown, Gem, Lock, Sparkles, Timer, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { claimSeasonTier } from '@/app/defi/saison-actions'
import {
  TIER_COUNT,
  claimableCount,
  countdownLabel,
  crownsToNextTier,
  isSeasonEndgame,
  lockedPrestigeCount,
  paceHeadline,
  tierFor,
  tierProgress,
  trackView,
  type Lane,
  type SeasonState,
  type TierView,
} from '@/lib/saison'

/**
 * La piste de saison — le calendrier qui manquait à l'app.
 *
 * Deux voies : LIBRE (tout le monde, quelque chose à chaque palier) et PRESTIGE
 * (abonnés, titres et gemmes). Rien de pédagogique dans aucune des deux : le
 * savoir reste gratuit, on ne monnaie que le prestige.
 *
 * L'information la plus haute n'est ni le palier ni le total de couronnes, mais
 * le RYTHME (« environ 2 duels par jour pour tout finir ») : c'est la seule qui
 * dise quoi faire aujourd'hui.
 */
export default function SeasonTrack({
  state,
  today,
}: {
  state: SeasonState
  today: string
}) {
  const [claimed, setClaimed] = useState<Set<string>>(new Set(state.claimed))
  const [pending, startTransition] = useTransition()
  const [flash, setFlash] = useState<string | null>(null)

  const views = trackView(state.crowns, claimed, state.hasPass)
  const current = tierFor(state.crowns)
  const pendingCount = claimableCount(views)
  const locked = lockedPrestigeCount(state.crowns, state.hasPass)
  const endgame = isSeasonEndgame(today)

  const claim = (tier: number, lane: Lane) => {
    if (pending) return
    sfx.complete()
    startTransition(async () => {
      const r = await claimSeasonTier(tier, lane)
      if (!r.claimed) return
      setClaimed((prev) => new Set(prev).add(`${lane}:${tier}`))
      setFlash(
        r.kind === 'titre'
          ? `Titre débloqué : « ${r.title} »`
          : `+${r.amount} 💎`,
      )
    })
  }

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-primary">
            Saison {state.season.number}
          </p>
          <h2 className="font-heading truncate text-lg font-bold">
            {state.season.name}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {state.season.tagline}
          </p>
        </div>
        <span
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold',
            endgame ? 'bg-destructive text-destructive-foreground' : 'bg-muted',
          )}
        >
          <Timer className="size-3.5" />
          {countdownLabel(today)}
        </span>
      </header>

      {/* Le palier courant et surtout le RYTHME à tenir. */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-heading text-2xl font-bold">
            Palier {current}
            <span className="text-base font-normal text-muted-foreground">
              /{TIER_COUNT}
            </span>
          </span>
          <span className="flex items-center gap-1 font-mono text-sm font-bold tabular-nums">
            <Crown className="size-4 text-highlight" />
            {state.crowns.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${Math.round(tierProgress(state.crowns) * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {current < TIER_COUNT
            ? `${crownsToNextTier(state.crowns)} couronnes avant le palier ${current + 1}`
            : 'Piste terminée'}
        </p>
        <p className="mt-2 text-sm font-semibold">{paceHeadline(state.crowns, today)}</p>
      </div>

      {flash ? (
        <p className="animate-in zoom-in mt-3 rounded-xl bg-highlight px-4 py-2.5 text-center text-sm font-bold">
          {flash}
        </p>
      ) : null}

      {/* La piste. Défilement horizontal : 30 paliers ne tiennent pas sur un
          téléphone, et une liste verticale de 30 lignes ne se lit pas comme une
          piste. Le conteneur scrolle seul — la page ne bouge jamais. */}
      <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-2">
        <ol className="flex gap-2">
          {views.map((v) => (
            <TierColumn
              key={v.tier}
              view={v}
              isCurrent={v.tier === current}
              hasPass={state.hasPass}
              onClaim={claim}
              disabled={pending}
            />
          ))}
        </ol>
      </div>

      {pendingCount > 0 ? (
        <p className="mt-2 text-center text-sm font-semibold text-primary">
          {pendingCount} récompense{pendingCount > 1 ? 's' : ''} à encaisser
        </p>
      ) : null}

      {/* L'argument du Pass : un nombre DÉJÀ gagné, pas une promesse. Et la
          phrase qui compte le plus pour la confiance : rien de pédagogique. */}
      {!state.hasPass && locked > 0 ? (
        <div className="mt-4 rounded-xl border-2 border-highlight/50 bg-highlight/10 p-3">
          <p className="flex items-center gap-2 font-heading text-sm font-bold">
            <Sparkles className="size-4 text-highlight-foreground" />
            {locked} palier{locked > 1 ? 's' : ''} prestige déjà gagné
            {locked > 1 ? 's' : ''}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            La voie prestige ne contient que des gemmes et des titres. Tous les
            cours, quiz et fiches restent gratuits — le Pass ne débloque rien
            pour réviser.
          </p>
          <Button asChild size="sm" className="mt-2 w-full font-bold">
            <Link href="/tresor">Voir le Pass</Link>
          </Button>
        </div>
      ) : null}
    </section>
  )
}

function TierColumn({
  view,
  isCurrent,
  hasPass,
  onClaim,
  disabled,
}: {
  view: TierView
  isCurrent: boolean
  hasPass: boolean
  onClaim: (tier: number, lane: Lane) => void
  disabled: boolean
}) {
  return (
    <li
      className={cn(
        'flex w-16 shrink-0 flex-col items-center gap-1.5',
        !view.reached && 'opacity-45',
      )}
    >
      <span
        className={cn(
          'font-mono text-xs font-bold tabular-nums',
          isCurrent && 'rounded-full bg-primary px-2 py-0.5 text-primary-foreground',
        )}
      >
        {view.tier}
      </span>

      <RewardCell
        reward={view.libre}
        claimed={view.libreClaimed}
        claimable={view.libreClaimable}
        locked={false}
        onClick={() => onClaim(view.tier, 'libre')}
        disabled={disabled}
      />
      <RewardCell
        reward={view.prestige}
        claimed={view.prestigeClaimed}
        claimable={view.prestigeClaimable}
        locked={!hasPass}
        onClick={() => onClaim(view.tier, 'prestige')}
        disabled={disabled}
      />
    </li>
  )
}

function RewardCell({
  reward,
  claimed,
  claimable,
  locked,
  onClick,
  disabled,
}: {
  reward: TierView['libre']
  claimed: boolean
  claimable: boolean
  locked: boolean
  onClick: () => void
  disabled: boolean
}) {
  const label =
    reward.kind === 'titre' ? (reward.title ?? 'Titre') : `${reward.amount}`

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!claimable || disabled}
      title={reward.kind === 'titre' ? `Titre « ${reward.title} »` : undefined}
      className={cn(
        'flex size-14 flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-1 text-center transition-all',
        claimed && 'border-primary/40 bg-primary/10',
        claimable && 'go-pulse border-highlight bg-highlight text-foreground shadow-md',
        !claimed && !claimable && 'border-border bg-muted/50',
        claimable && 'active:scale-95',
      )}
    >
      {claimed ? (
        <Check className="size-4 text-primary" strokeWidth={3} />
      ) : locked ? (
        <Lock className="size-3.5 text-muted-foreground" />
      ) : reward.kind === 'titre' ? (
        <Sparkles className="size-3.5" />
      ) : (
        <Gem className="size-3.5" />
      )}
      <span className="w-full truncate text-[0.6rem] font-bold leading-tight">
        {claimed ? 'Pris' : label}
      </span>
    </button>
  )
}
