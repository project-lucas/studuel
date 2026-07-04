'use client'

import { useState, useActionState } from 'react'
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
import { signIn, signUp, type AuthState } from '@/app/login/actions'

const initialState: AuthState = { error: null, message: null }

export default function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  )
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  )

  const state = mode === 'signin' ? signInState : signUpState
  const pending = mode === 'signin' ? signInPending : signUpPending

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin'
            ? 'Retrouve tes tests, ta progression et tes habitudes.'
            : 'Rejoins Scolaria et commence à t’entraîner gratuitement.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          action={mode === 'signin' ? signInAction : signUpAction}
          className="flex flex-col gap-4"
        >
          {mode === 'signup' ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Prénom et nom</Label>
              <Input
                id="full_name"
                name="full_name"
                autoComplete="name"
                placeholder="Lucas Potier"
              />
            </div>
          ) : null}

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              placeholder="••••••••"
            />
          </div>

          {state.error ? (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          ) : null}
          {state.message ? (
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending
              ? 'Un instant…'
              : mode === 'signin'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                type="button"
                className="font-medium text-foreground underline underline-offset-4"
                onClick={() => setMode('signup')}
              >
                S’inscrire
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{' '}
              <button
                type="button"
                className="font-medium text-foreground underline underline-offset-4"
                onClick={() => setMode('signin')}
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
