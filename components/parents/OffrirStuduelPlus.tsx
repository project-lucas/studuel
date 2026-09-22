'use client'

import { useState, useTransition } from 'react'
import { Check, Crown } from 'lucide-react'
import { declarerInteret } from '@/app/tresor/actions'
import { PLANS, formatPrice, tierDuPlan } from '@/lib/premium'

/**
 * « Offrir Studuel+ » — la carte du PAYEUR, dans le volet Réglages.
 *
 * Le parent est celui qui paie ; jusqu'ici l'abonnement ne lui était proposé
 * nulle part : la Boutique est dans l'app de l'ÉLÈVE, et c'est l'élève qui y
 * « déclare son intérêt » avec, facultativement, le contact d'un parent. Cette
 * carte fait le même geste depuis le bon côté : elle enregistre la demande
 * du parent (même table `subscription_interest`, même circuit — un admin
 * ouvre l'abonnement, migration 221), avec le prénom de l'enfant en note.
 * Aucune promesse de paiement en ligne : la carte dit ce qui se passe ensuite.
 */
export default function OffrirStuduelPlus({
  childName,
  contact,
}: {
  childName: string
  /** L'e-mail du parent, pour que l'admin puisse le rappeler. */
  contact: string | null
}) {
  const plus = PLANS.find((p) => p.id === 'plus')
  const [etat, setEtat] = useState<'idle' | 'ok' | 'deja' | 'erreur'>('idle')
  const [pending, startTransition] = useTransition()
  if (!plus) return null
  const tier = tierDuPlan('plus')

  const demander = () => {
    if (!tier) return
    startTransition(async () => {
      const res = await declarerInteret(tier, contact, `Parent — pour ${childName}`)
      if (res.statut === 'enregistre') setEtat('ok')
      else if (res.statut === 'deja') setEtat('deja')
      else setEtat('erreur')
    })
  }

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl p-5 shadow-sm">
      <span aria-hidden="true" className="absolute -top-10 -right-8 size-32 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-highlight flex items-center gap-1.5 text-xs font-extrabold tracking-wide uppercase">
          <Crown className="size-4" strokeWidth={2.6} aria-hidden="true" />
          Studuel+ pour {childName}
        </p>
        <p className="mt-1 text-sm font-semibold text-primary-foreground/85">
          {plus.tagline} {formatPrice(plus.priceMonthly)} par mois.
        </p>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm">
          {plus.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="text-highlight mt-0.5 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {etat === 'ok' || etat === 'deja' ? (
            <p role="status" className="text-sm font-semibold">
              {etat === 'ok'
                ? 'Demande enregistrée — nous vous recontactons pour ouvrir l’abonnement.'
                : 'Votre demande est déjà enregistrée. Nous revenons vers vous rapidement.'}
            </p>
          ) : (
            <button
              type="button"
              onClick={demander}
              disabled={pending}
              className="bg-highlight text-foreground min-h-11 cursor-pointer rounded-xl px-5 font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Un instant…' : 'Je suis intéressé·e'}
            </button>
          )}
          {etat === 'erreur' ? (
            <p role="alert" className="text-sm font-semibold">
              La demande n’a pas pu partir. Réessayez dans un moment.
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-primary-foreground/75">
          Pas de paiement en ligne pour l’instant : un membre de l’équipe vous
          écrit pour finaliser. L’abonnement s’active sur le compte de votre enfant.
        </p>
      </div>
    </section>
  )
}
