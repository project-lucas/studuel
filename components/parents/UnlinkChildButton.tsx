'use client'

import { useActionState } from 'react'
import { Unlink } from 'lucide-react'
import { unlinkChild } from '@/app/parents/actions'

/**
 * Le bouton « Délier » et son retour d'état.
 *
 * Il vit dans son propre composant client uniquement pour ça : la carte de
 * l'enfant est un composant serveur, et un `<form action={…}>` posé dessus
 * avalait silencieusement les échecs de la RPC. Le parent cliquait, rien ne
 * bougeait, aucun message.
 */
export default function UnlinkChildButton({
  childId,
  childName,
}: {
  childId: string
  childName: string
}) {
  const [error, formAction, pending] = useActionState(unlinkChild, null)

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="childId" value={childId} />
      <button
        type="submit"
        disabled={pending}
        className="text-muted-foreground hover:text-destructive flex min-h-11 items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors disabled:opacity-60"
        aria-label={`Rompre le lien avec ${childName}`}
      >
        <Unlink className="size-3.5" aria-hidden="true" />
        {pending ? 'En cours…' : 'Délier'}
      </button>
      {error ? (
        <p role="alert" className="text-destructive max-w-48 text-right text-xs">
          {error}
        </p>
      ) : null}
    </form>
  )
}
