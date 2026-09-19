'use client'

import { useState } from 'react'
import { Check, Crown, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { declarerInteret } from '@/app/tresor/actions'
import { PLANS, formatPrice, planForTier, tierDuPlan, type PlanId } from '@/lib/premium'
import type { Tier } from '@/lib/subscription'
import { sfx } from '@/lib/sounds'

/**
 * STUDUEL+ EN TÊTE DE LA BOUTIQUE (Lucas, 18/09/2026) : une seule grande
 * carte, ses avantages, et le bouton. La comparaison des trois offres a quitté
 * la page ; la formule Famille reste à un geste, sous le bouton.
 *
 * Pas d'essai gratuit ni de paiement en ligne : le bouton enregistre la
 * demande (contact d'un parent facultatif) et un admin ouvre l'abonnement
 * (migration 221). La carte le dit, elle ne promet rien d'autre.
 */
export default function CarteStudueLPlus({ tier }: { tier: Tier }) {
  const plus = PLANS.find((p) => p.id === 'plus')
  const famille = PLANS.find((p) => p.id === 'famille')
  const [choix, setChoix] = useState<PlanId | null>(null)
  const actuel = planForTier(tier)
  if (!plus) return null

  const abonne = actuel !== 'gratuit'

  return (
    <section
      aria-labelledby="studuel-plus-titre"
      className="relative overflow-hidden rounded-[28px] bg-primary p-5 text-primary-foreground shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--primary),black_20%)]"
    >
      <span aria-hidden="true" className="absolute -top-12 -right-10 size-40 rounded-full bg-white/10" />
      <span aria-hidden="true" className="absolute -bottom-16 -left-10 size-44 rounded-full bg-highlight/20" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-highlight uppercase">
              <Crown className="size-4" strokeWidth={2.6} aria-hidden="true" />
              {abonne ? 'Ton abonnement' : 'Abonnement'}
            </p>
            <h2 id="studuel-plus-titre" className="font-heading text-3xl leading-none font-extrabold">
              Studuel+
            </h2>
            <p className="mt-1 text-sm font-semibold text-primary-foreground/80">{plus.tagline}</p>
          </div>
          {abonne ? null : (
            <p className="shrink-0 text-right">
              <span className="font-heading block text-2xl leading-none font-extrabold tabular-nums">
                {formatPrice(plus.priceMonthly)}
              </span>
              <span className="text-xs font-bold text-primary-foreground/75">par mois</span>
            </p>
          )}
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {plus.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm font-semibold">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-highlight text-foreground">
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {abonne ? (
          <p className="mt-4 rounded-2xl bg-white/12 px-3 py-2.5 text-center text-sm font-bold">
            Tout est débloqué pour toi. Merci !
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <Button
              size="lg"
              variant="secondary"
              shine
              className="w-full rounded-full bg-highlight font-extrabold text-foreground hover:bg-highlight/90"
              onClick={() => {
                sfx.correct()
                setChoix('plus')
              }}
            >
              Passer à Studuel+
            </Button>
            {famille ? (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setChoix('famille')
                }}
                className="flex cursor-pointer items-center justify-center gap-1.5 text-xs font-bold text-primary-foreground/85 underline-offset-2 hover:underline"
              >
                <Users className="size-3.5" aria-hidden="true" />
                En famille : jusqu’à {famille.members} enfants pour {formatPrice(famille.priceMonthly)} par
                mois
              </button>
            ) : null}
            {choix ? <DemandeAbonnement key={choix} planId={choix} /> : null}
          </div>
        )}
      </div>
    </section>
  )
}

/** La demande d'abonnement : contact facultatif d'un parent, puis « c'est noté ». */
function DemandeAbonnement({ planId }: { planId: PlanId }) {
  const [contact, setContact] = useState('')
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'enregistre' | 'deja' | 'panne'>('saisie')
  const [erreur, setErreur] = useState<string | null>(null)
  const tier = tierDuPlan(planId)
  const plan = PLANS.find((p) => p.id === planId)
  if (!tier || !plan) return null

  const envoyer = async () => {
    setEtat('envoi')
    setErreur(null)
    const r = await declarerInteret(tier, contact)
    if (r.statut === 'invalide') {
      setErreur(r.raison)
      setEtat('saisie')
      return
    }
    setEtat(r.statut === 'enregistre' ? 'enregistre' : r.statut === 'deja' ? 'deja' : 'panne')
  }

  if (etat !== 'saisie' && etat !== 'envoi') {
    return (
      <p role="status" aria-live="polite" className="mt-1 rounded-2xl bg-white px-3 py-2.5 text-center text-sm font-bold text-foreground">
        {etat === 'enregistre'
          ? 'C’est noté ! On te recontacte pour finaliser l’abonnement.'
          : etat === 'deja'
            ? 'Ta demande est déjà enregistrée : on revient vers toi.'
            : 'Impossible d’enregistrer la demande pour l’instant. Réessaie dans un moment.'}
      </p>
    )
  }

  return (
    <div className="mt-1 rounded-2xl bg-white p-3 text-foreground">
      <p className="text-sm font-extrabold">
        {plan.name} · {formatPrice(plan.priceMonthly)} par mois
      </p>
      <label htmlFor={`contact-${planId}`} className="mt-2 block text-xs font-bold">
        Où joindre ton parent&nbsp;? <span className="font-normal">(facultatif)</span>
      </label>
      <input
        id={`contact-${planId}`}
        type="text"
        inputMode="email"
        autoComplete="off"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="email ou téléphone d’un parent"
        className="mt-1.5 h-11 w-full rounded-xl border bg-card px-3 text-sm"
      />
      {erreur ? (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
          {erreur}
        </p>
      ) : null}
      <Button
        size="lg"
        className="mt-2 w-full rounded-full font-bold"
        disabled={etat === 'envoi'}
        onClick={() => void envoyer()}
      >
        {etat === 'envoi' ? 'Envoi…' : 'Envoyer ma demande'}
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Aucun paiement en ligne pour l’instant : on te recontacte pour finaliser. Sans engagement.
      </p>
    </div>
  )
}
