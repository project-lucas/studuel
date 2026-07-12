import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'espace parents : titre + intro + liste de vidéos.
export default function ParentsLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Skeleton className="mb-4 h-9 w-56" />
      <Skeleton className="mb-8 h-4 w-full max-w-sm" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}
