'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp, type AuthState } from '@/app/login/actions'
import { GOALS, type OnboardingAnswers } from '@/lib/welcome'
import { MascotBubble } from './WelcomeSteps'

const initialState: AuthState = { error: null, message: null }

// Mur d'inscription : dernière étape. Les réponses du parcours voyagent en
// champs cachés → l'action signUp les applique au profil (via le trigger),
// même si la confirmation d'email est activée (aucune session immédiate).
export default function SignUpStep({
  answers,
  subjectCount,
}: {
  answers: OnboardingAnswers
  subjectCount: number
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, pending] = useActionState(signUp, initialState)
  const goalLabel = GOALS.find((g) => g.value === answers.goal)?.label

  return (
    <div className="flex flex-col gap-5">
      <MascotBubble image="/images/mascotte/flamme-2-vive.webp" size={88}>
        Dernière étape ! Je garde ta progression au chaud. 🔥
      </MascotBubble>

      <div className="text-center">
        <h1 className="font-heading text-xl leading-tight font-bold text-balance">
          Crée ton compte pour tout sauvegarder
        </h1>
        {/* Récap des choix : rassure sur ce qu'on retient de son parcours. */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {answers.grade ? <RecapChip>Classe : {answers.grade}</RecapChip> : null}
          <RecapChip>
            {subjectCount} matière{subjectCount > 1 ? 's' : ''}
          </RecapChip>
          {goalLabel ? <RecapChip>{goalLabel}</RecapChip> : null}
        </div>
      </div>

      <form action={action} className="flex flex-col gap-4">
        {/* Réponses du parcours transmises à l'inscription. */}
        <input type="hidden" name="grade_level" value={answers.grade ?? ''} />
        <input type="hidden" name="daily_goal" value={answers.goal} />
        <input type="hidden" name="motivation" value={answers.motivation ?? ''} />
        <input type="hidden" name="source" value={answers.source ?? ''} />
        {answers.subjects.map((slug) => (
          <input key={slug} type="hidden" name="subjects" value={slug} />
        ))}

        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name">Prénom et nom</Label>
          <Input
            id="full_name"
            name="full_name"
            autoComplete="name"
            placeholder="Lucas Potier"
          />
        </div>

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
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
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

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? 'Un instant…' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}

function RecapChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-highlight/20 px-2.5 py-1 text-[11px] font-semibold text-foreground/75">
      {children}
    </span>
  )
}
