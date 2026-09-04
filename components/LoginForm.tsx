'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
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
import { signIn, signUp, type AuthState } from '@/app/login/actions'
import { auMoinsUnePorteOAuth, type PortesOAuth } from '@/lib/auth-portes'
import BoutonsOAuth from '@/components/auth/BoutonsOAuth'

const initialState: AuthState = { error: null, message: null }

export default function LoginForm({ portes }: { portes: PortesOAuth }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
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
            : 'Rejoins Studuel et commence à t’entraîner gratuitement.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Un compte créé avec Google ou Apple n'a PAS de mot de passe : sans
            ces portes ici, il ne pouvait plus se reconnecter depuis /login
            (où renvoient toutes les pages gardées). Elles n'apparaissent que
            si le fournisseur est activé côté Supabase. */}
        {auMoinsUnePorteOAuth(portes) ? (
          <>
            <BoutonsOAuth
              portes={portes}
              next="/login/suite"
              retour="/login?error=oauth"
              className="flex flex-col gap-2.5"
            />
            <p
              aria-hidden
              className="my-4 flex items-center gap-3 text-xs font-semibold text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
            >
              ou avec un e-mail
            </p>
          </>
        ) : null}
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
                placeholder="Prénom et nom"
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword
                    ? 'Masquer le mot de passe'
                    : 'Afficher le mot de passe'
                }
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {mode === 'signin' ? (
            <p className="-mt-2 flex justify-end text-sm">
              {/* Zone tactile ≥ 44px (règle du design system) sans déplacer le
                  texte : le lien s'étend en hauteur, le -my compense le visuel. */}
              <Link
                href="/login/reset"
                className="inline-flex min-h-[44px] items-center font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Mot de passe oublié ?
              </Link>
            </p>
          ) : null}

          {/* Retours d'état annoncés au lecteur d'écran (erreur = assertif). */}
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
            {pending
              ? 'Un instant…'
              : mode === 'signin'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </Button>
        </form>

        {/* Cible tactile ≥ 44px : la bascule s'aligne verticalement avec le
            texte via inline-flex + min-h, sans casser la phrase. */}
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center font-medium text-foreground underline underline-offset-4"
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
                className="inline-flex min-h-[44px] items-center font-medium text-foreground underline underline-offset-4"
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
