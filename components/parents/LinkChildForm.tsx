'use client'

import { useActionState } from 'react'
import { UserPlus } from 'lucide-react'
import { linkChild, type LinkChildState } from '@/app/parents/actions'

const initialState: LinkChildState = { error: null }

// Saisie du code de l'enfant pour lier son compte à l'espace parents.
export default function LinkChildForm() {
  const [state, action, pending] = useActionState(linkChild, initialState)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="child-code" className="text-sm font-medium">
        Code de votre enfant
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="child-code"
          name="code"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={6}
          required
          placeholder="Ex. K7M3PQ"
          aria-describedby="child-code-help"
          className="bg-background focus:ring-primary/40 flex-1 rounded-xl border px-4 py-3 text-center text-lg font-semibold tracking-[0.3em] uppercase outline-none focus:ring-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          {pending ? 'Liaison…' : 'Lier'}
        </button>
      </div>
      <p id="child-code-help" className="text-muted-foreground text-xs">
        Votre enfant trouve son code dans l&apos;onglet{' '}
        <span className="font-medium">Amis</span> de son application.
      </p>
      {state.error ? (
        <p role="alert" className="text-destructive text-sm font-medium">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="text-sm font-medium text-green-600">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
