import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onboarding : carte d'étape (progression + choix).
export default function OnboardingLoading() {
  return (
    <div>
      <Skeleton className="mb-8 h-9 w-56" />
      <Skeleton className="mx-auto h-96 w-full max-w-md rounded-2xl" />
    </div>
  )
}
