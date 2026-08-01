'use client'

import { useState } from 'react'
import { Check, Crown, Users, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { declarerInteret } from '@/app/tresor/actions'
import { estPlanPayant } from '@/lib/abonnement'
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
        {/* Le nettoyage documenté dans lib/premium.ts (« vendre du vide est le
            meilleur moyen de faire résilier un parent ») avait été appliqué à
            la liste des offres, mais PAS à ce bandeau : il re-promettait
            « zéro pub » alors qu'il n'y a aucune publicité dans l'app, et donc
            rien à retirer. On n'annonce plus que ce qui est vérifiable écran
            par écran. */}
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-primary-foreground/80">
          Cartes mentales, fiches de révision — et jusqu’à 3 enfants sur une
          seule offre.
        </p>
      </div>
    </section>
  )
}

// Le formulaire qui a remplacé « Le paiement arrive très bientôt ✨ ».
//
// Ce message-là ne faisait RIEN : aucune trace, aucun rappel possible, et un
// parent qui revenait deux semaines plus tard lisait le même « bientôt ». Ici
// on enregistre l'intention (migration 221) et on dit exactement la suite :
// quelqu'un recontacte. Le contact est FACULTATIF — on ne bloque pas un élève
// qui n'a pas l'email de ses parents sous la main.
function InterestForm({ planId }: { planId: PlanId }) {
  const [contact, setContact] = useState('')
  const [etat, setEtat] = useState<
    'saisie' | 'envoi' | 'enregistre' | 'deja' | 'indisponible' | 'erreur'
  >('saisie')
  const [erreur, setErreur] = useState<string | null>(null)

  // Les offres gratuites n'ont pas de bouton, donc pas de formulaire.
  if (!estPlanPayant(planId)) return null

  const envoyer = async () => {
    setEtat('envoi')
    setErreur(null)
    const r = await declarerInteret(planId, contact)
    if (r.statut === 'invalide') {
      setErreur(r.raison)
      setEtat('saisie')
      return
    }
    setEtat(
      r.statut === 'enregistre'
        ? 'enregistre'
        : r.statut === 'deja'
          ? 'deja'
          : r.statut === 'indisponible'
            ? 'indisponible'
            : 'erreur',
    )
  }

  if (etat === 'enregistre' || etat === 'deja') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="mt-2 rounded-2xl bg-highlight/15 px-3 py-2 text-center text-sm font-medium text-foreground"
      >
        {etat === 'deja'
          ? 'Ta demande est déjà enregistrée pour cette offre — on revient vers toi.'
          : 'C’est noté ! On te recontacte pour finaliser l’abonnement.'}
      </p>
    )
  }

  if (etat === 'indisponible' || etat === 'erreur') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-muted-foreground mt-2 rounded-2xl bg-muted px-3 py-2 text-center text-sm"
      >
        Impossible d’enregistrer la demande pour l’instant. Réessaie dans un
        moment.
      </p>
    )
  }

  return (
    <div className="mt-2 rounded-2xl bg-highlight/10 px-3 py-3 text-left">
      <label
        htmlFor={`contact-${planId}`}
        className="block text-xs font-bold text-foreground"
      >
        Où te recontacter&nbsp;? <span className="font-normal">(facultatif)</span>
      </label>
      <input
        id={`contact-${planId}`}
        type="text"
        inputMode="email"
        autoComplete="email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="email ou téléphone d’un parent"
        className="mt-1.5 h-11 w-full rounded-xl border bg-card px-3 text-sm"
      />
      {erreur ? (
        <p role="alert" className="text-destructive mt-1.5 text-xs font-medium">
          {erreur}
        </p>
      ) : null}
      <Button
        className="mt-2 w-full rounded-full font-bold"
        disabled={etat === 'envoi'}
        onClick={() => {
          sfx.correct()
          void envoyer()
        }}
      >
        {etat === 'envoi' ? 'Envoi…' : 'Envoyer ma demande'}
      </Button>
      <p className="text-muted-foreground mt-2 text-center text-[11px]">
        Aucun paiement en ligne pour l’instant&nbsp;: on te recontacte pour
        finaliser.
      </p>
    </div>
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
          {/* La branche « publicité » (croix grise au lieu d'une coche) est
              partie avec la promesse : plus aucune offre ne cite de publicité,
              elle ne pouvait donc plus jamais s'afficher. */}
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  plan.recommended ? 'text-primary' : 'text-green-600',
                )}
                strokeWidth={2.6}
              />
              <span>{f}</span>
            </li>
          ))}
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

          {chosen ? <InterestForm planId={plan.id} /> : null}
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
        {/* Ne PAS annoncer « paiement sécurisé » : il n'y a pas encore de
            paiement du tout, et le bouton juste au-dessus le dit lui-même
            (« Le paiement arrive très bientôt »). Promettre la sécurité d'une
            transaction inexistante, c'est le genre de détail qui fait douter
            un parent de tout le reste. */}
        Sans engagement · annulable à tout moment
      </p>
    </div>
  )
}
