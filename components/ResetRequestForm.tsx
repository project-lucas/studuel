'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordReset, type AuthState } from '@/app/login/actions'

const initialState: AuthState = { error: null, message: null }

// Mot de passe oublié, étape 1 : demande de l'email de réinitialisation.
export default function ResetRequestForm() {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initialState,
  )

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>
          Donne l&apos;adresse de ton compte : on t&apos;envoie un lien pour en
          choisir un nouveau.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="eleve@exemple.fr"
            />
          </div>

          {/* Retours d'état annoncés au lecteur d'écran. */}
          <div aria-live="polite" className="empty:hidden">
            {state.error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {state.error}
              </p>
            ) : null}
            {state.message ? (
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                {state.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? 'Un instant…' : 'Envoyer le lien'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Retour à la connexion
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
