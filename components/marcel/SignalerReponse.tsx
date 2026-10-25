'use client'

import { useState, useTransition } from 'react'
import { Flag } from 'lucide-react'
import { signalerReponseMarcel } from '@/app/marcel/signalement-actions'
import { RAISONS_SIGNALEMENT, type RaisonSignalement } from '@/lib/ia-signalement'

/**
 * « Signaler » sous une réponse de Marcel (25/10/2026, migration 597) : exigé
 * par Google Play pour toute IA générative. Discret (un petit drapeau gris),
 * puis trois raisons en pastilles ; un geste, et l'élève reste dans le fil.
 */
export default function SignalerReponse({ question, reponse }: { question: string; reponse: string }) {
  const [ouvert, setOuvert] = useState(false)
  const [retour, setRetour] = useState<string | null>(null)
  const [enCours, startTransition] = useTransition()

  if (retour) {
    return (
      <p role="status" className="text-muted-foreground mt-1 text-[11px] font-bold">
        {retour}
      </p>
    )
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-muted-foreground mt-0.5 inline-flex min-h-8 items-center gap-1 px-1 text-[11px] font-bold"
      >
        <Flag aria-hidden="true" className="size-3" />
        Signaler
      </button>
    )
  }

  const envoyer = (raison: RaisonSignalement) =>
    startTransition(async () => {
      const r = await signalerReponseMarcel(raison, question, reponse)
      setRetour(r.message)
    })

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5" role="group" aria-label="Signaler cette réponse">
      {RAISONS_SIGNALEMENT.map((r) => (
        <button
          key={r.id}
          type="button"
          disabled={enCours}
          onClick={() => envoyer(r.id)}
          className="bg-secondary min-h-8 rounded-full px-3 text-[11.5px] font-extrabold disabled:opacity-50"
        >
          {r.libelle}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setOuvert(false)}
        className="text-muted-foreground min-h-8 px-2 text-[11.5px] font-bold"
      >
        Annuler
      </button>
    </div>
  )
}
