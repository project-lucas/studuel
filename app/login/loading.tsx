import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la page Connexion : titre + carte de formulaire.
export default function LoginLoading() {
  return (
    <div>
      <Skeleton className="mb-8 h-9 w-40" />
      <Skeleton className="mx-auto h-80 w-full max-w-md rounded-2xl" />
    </div>
  )
}
