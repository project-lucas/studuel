'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  accorderAbonnement,
  marquerTraitee,
  expirerAbonnements,
} from '@/app/admin/abonnements/actions'
import { MOIS_MAX } from '@/lib/abonnement'

// Le geste qui fait passer un compte en payant — le seul de toute l'app.
//
// Volontairement minimal et un peu austère : c'est un écran d'admin, pas une
// vitrine, et un bouton qui donne un accès payant doit se lire d'un coup d'œil.
// Le vrai contrôle de droit est en base (`grant_subscription` refuse tout
// appelant non-admin) : ce composant ne fait qu'appeler.
export default function GrantPanel({
  userId,
  interetId,
  planPropose,
  dejaTraitee,
}: {
  userId: string
  interetId: string
  planPropose: string
  dejaTraitee: boolean
}) {
  const [tier, setTier] = useState(planPropose)
  const [mois, setMois] = useState(1)
  const [reference, setReference] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [occupe, setOccupe] = useState(false)
  const [traitee, setTraitee] = useState(dejaTraitee)

  const accorder = async () => {
    setOccupe(true)
    setMessage(null)
    const r = await accorderAbonnement(userId, tier, mois, reference)
    setOccupe(false)
    if (r.statut === 'ok') {
      setMessage(`Accordé : ${r.tier}${r.expiresAt ? '' : ' (sans échéance)'}`)
      await marquerTraitee(interetId)
      setTraitee(true)
      return
    }
    setMessage(
      r.statut === 'invalide'
        ? r.raison
        : r.statut === 'refuse'
          ? 'Refusé : ce compte n’est pas administrateur.'
          : r.statut === 'indisponible'
            ? 'Migration 221 non exécutée.'
            : `Échec : ${r.message}`,
    )
  }

  return (
    <div className="mt-1.5 flex w-full flex-wrap items-center gap-2">
      <select
        aria-label="Palier"
        value={tier}
        onChange={(e) => setTier(e.target.value)}
        className="bg-card h-9 rounded-lg border px-2 text-xs"
      >
        <option value="tier1">Studuel+</option>
        <option value="tier2">Famille</option>
        <option value="tier3">Famille+</option>
        <option value="free">Révoquer (free)</option>
      </select>
      <label className="text-muted-foreground flex items-center gap-1 text-xs">
        <input
          aria-label="Durée en mois"
          type="number"
          min={0}
          max={MOIS_MAX}
          value={mois}
          onChange={(e) => setMois(Number(e.target.value))}
          className="bg-card h-9 w-16 rounded-lg border px-2 text-xs tabular-nums"
        />
        mois
      </label>
      <input
        aria-label="Référence de paiement"
        type="text"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="réf. virement"
        className="bg-card h-9 min-w-32 flex-1 rounded-lg border px-2 text-xs"
      />
      <Button size="sm" disabled={occupe} onClick={() => void accorder()}>
        {occupe ? '…' : 'Accorder'}
      </Button>
      {traitee ? (
        <span className="text-muted-foreground text-[11px] font-semibold">
          traitée
        </span>
      ) : null}
      {message ? (
        <span role="status" className="w-full text-[11px] font-medium">
          {message}
        </span>
      ) : null}
    </div>
  )
}

// Bouton séparé (il agit sur TOUS les comptes, pas sur une ligne) : passer les
// échéances dépassées. Sans lui, « 1 mois » signifierait « à vie ».
export function ExpirePanel() {
  const [message, setMessage] = useState<string | null>(null)
  const [occupe, setOccupe] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={occupe}
        onClick={async () => {
          setOccupe(true)
          const r = await expirerAbonnements()
          setOccupe(false)
          setMessage(
            r.ok
              ? `${r.nombre} abonnement(s) repassé(s) en gratuit.`
              : 'Échec — migration 221 exécutée ?',
          )
        }}
      >
        Passer les échéances
      </Button>
      {message ? (
        <span role="status" className="text-muted-foreground text-xs">
          {message}
        </span>
      ) : null}
    </div>
  )
}
