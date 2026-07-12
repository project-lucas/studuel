import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la page Mon compte : titre + carte profil.
export default function CompteLoading() {
  return (
    <div>
      <Skeleton className="mb-8 h-9 w-48" />
      <Skeleton className="mx-auto h-64 w-full max-w-md rounded-2xl" />
    </div>
  )
}
