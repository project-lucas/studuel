'use client'

import { useState, useActionState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
import { updatePassword, type AuthState } from '@/app/login/actions'

const initialState: AuthState = { error: null, message: null }

// Mot de passe oublié, étape 2 : choix du nouveau mot de passe (l'élève
// arrive connecté par le lien email → /auth/callback).
export default function NewPasswordForm() {
  const [show, setShow] = useState(false)
  const [state, action, pending] = useActionState(updatePassword, initialState)

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Nouveau mot de passe</CardTitle>
        <CardDescription>
          Choisis ton nouveau mot de passe — tu seras reconnecté dans la
          foulée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={
                  show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }
                aria-pressed={show}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Confirme le mot de passe</Label>
            <Input
              id="confirm"
              name="confirm"
              type={show ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          {/* Retours d'état annoncés au lecteur d'écran. */}
          <div aria-live="polite" className="empty:hidden">
            {state.error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {state.error}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? 'Un instant…' : 'Changer mon mot de passe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
