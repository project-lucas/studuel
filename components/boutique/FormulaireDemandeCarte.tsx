'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

/**
 * « Un parent paie par carte » : le contact facultatif d'un parent, puis la
 * demande. Partagé par les capsules chères et les packs de gemmes. L'app
 * n'encaisse pas encore d'euros : la mention du bas le dit, toujours.
 */
export default function FormulaireDemandeCarte({
  id,
  intro,
  contact,
  onContact,
  enCours,
  onEnvoyer,
  onAnnuler,
  annulerLabel = 'Annuler',
}: {
  /** Préfixe unique de l'identifiant du champ (un formulaire par feuille). */
  id: string
  intro: ReactNode
  contact: string
  onContact: (v: string) => void
  enCours: boolean
  onEnvoyer: () => void
  onAnnuler?: () => void
  annulerLabel?: string
}) {
  const champ = `${id}-contact`
  return (
    <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
      <p className="text-sm font-bold">{intro}</p>
      <label htmlFor={champ} className="mt-3 block text-xs font-bold">
        Où joindre ton parent&nbsp;? <span className="font-normal">(facultatif)</span>
      </label>
      <input
        id={champ}
        type="text"
        inputMode="email"
        autoComplete="off"
        value={contact}
        onChange={(e) => onContact(e.target.value)}
        placeholder="email ou téléphone d’un parent"
        className="mt-1.5 h-11 w-full rounded-xl border bg-background px-3 text-sm"
      />
      <Button size="lg" className="mt-3 w-full rounded-full font-bold" disabled={enCours} onClick={onEnvoyer}>
        {enCours ? 'Envoi…' : 'Envoyer la demande'}
      </Button>
      {onAnnuler ? (
        <button
          type="button"
          onClick={onAnnuler}
          className="mt-2 w-full cursor-pointer text-center text-xs font-bold text-muted-foreground"
        >
          {annulerLabel}
        </button>
      ) : null}
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Aucun paiement en ligne pour l’instant : on vous recontacte pour finaliser.
      </p>
    </div>
  )
}
