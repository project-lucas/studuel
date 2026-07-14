'use client'

import { useState } from 'react'
import { Check, Crown, Users, Sparkles, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  PLANS,
  formatPrice,
  pricePerMember,
  isCurrentPlan,
  type Plan,
  type PlanId,
} from '@/lib/premium'
import type { Tier } from '@/lib/subscription'

// Bandeau de valeur en tête : ce que débloque le passage payant, en une phrase.
function ValueHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-center text-primary-foreground shadow-sm">
      <span
        aria-hidden="true"
        className="absolute -top-10 -left-10 size-32 rounded-full bg-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute -right-10 -bottom-12 size-36 rounded-full bg-highlight/20"
      />
      <div className="relative">
        <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-highlight text-3xl shadow-sm">
          💎
        </span>
        <h2 className="font-heading text-2xl font-bold text-balance">
          Débloque tout Studuel
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-primary-foreground/80">
          Cartes illimitées, tests premium, zéro pub — et jusqu’à 3 enfants sur
          une seule offre.
        </p>
      </div>
    </section>
  )
}

function PlanCard({
  plan,
  isCurrent,
  chosen,
  onChoose,
}: {
  plan: Plan
  isCurrent: boolean
  chosen: boolean
  onChoose: (id: PlanId) => void
}) {
  const isFree = plan.priceMonthly <= 0

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10',
        plan.recommended && 'ring-2 ring-primary shadow-md',
      )}
    >
      {/* Ruban « RECOMMANDÉ » (dégradé marque → jaune) sur l'offre phare. */}
      {plan.recommended ? (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-highlight px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
          <Sparkles className="size-3.5" strokeWidth={2.6} />
          Recommandé
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading flex items-center gap-1.5 text-lg font-bold">
              {plan.id === 'famille' ? (
                <Users className="size-4 text-primary" strokeWidth={2.4} />
              ) : plan.recommended ? (
                <Crown className="size-4 text-highlight" strokeWidth={2.4} />
              ) : null}
              {plan.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{plan.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-2xl font-extrabold text-foreground tabular-nums">
              {formatPrice(plan.priceMonthly)}
            </p>
            {!isFree ? (
              <p className="text-[11px] text-muted-foreground">
                /mois
                {plan.members > 1
                  ? ` · ${formatPrice(pricePerMember(plan))}/pers.`
                  : ''}
              </p>
            ) : null}
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {plan.features.map((f) => {
            const isAds = /publicité/i.test(f)
            return (
              <li key={f} className="flex items-start gap-2 text-sm">
                {isAds ? (
                  <X
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={2.4}
                  />
                ) : (
                  <Check
                    className={cn(
                      'mt-0.5 size-4 shrink-0',
                      plan.recommended ? 'text-primary' : 'text-green-600',
                    )}
                    strokeWidth={2.6}
                  />
                )}
                <span className={cn(isAds && 'text-muted-foreground')}>{f}</span>
              </li>
            )
          })}
        </ul>

        <div className="mt-5">
          {isCurrent ? (
            <Button
              variant="outline"
              className="w-full rounded-full font-bold"
              disabled
            >
              <Check className="size-4" /> Ton offre actuelle
            </Button>
          ) : isFree ? null : (
            <Button
              className={cn(
                'w-full rounded-full font-bold',
                plan.recommended && 'shadow-sm',
              )}
              variant={plan.recommended ? 'default' : 'secondary'}
              onClick={() => {
                sfx.correct()
                onChoose(plan.id)
              }}
            >
              {plan.cta}
            </Button>
          )}

          {chosen ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-2 rounded-2xl bg-highlight/15 px-3 py-2 text-center text-sm font-medium text-foreground"
            >
              Merci ! Le paiement arrive très bientôt — on te préviendra ✨
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

// Onglet de conversion (ex-« Trésor ») : donne envie de passer à l'offre
// payante. Le coffre/boutique/collection a migré vers l'icône de l'onglet Moi.
export default function PremiumHome({ currentTier }: { currentTier: Tier }) {
  const [chosen, setChosen] = useState<PlanId | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <ValueHero />

      <div>
        <p className="mb-2 px-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Comparer les abonnements
        </p>
        <div className="flex flex-col gap-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={isCurrentPlan(plan.id, currentTier)}
              chosen={chosen === plan.id}
              onChoose={setChosen}
            />
          ))}
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 px-1 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        Sans engagement · annulable à tout moment · paiement sécurisé
      </p>
    </div>
  )
}
