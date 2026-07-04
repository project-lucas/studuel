import { Skeleton } from '@/components/ui/skeleton'

// Squelette du Défi : niveau, série, gros bouton.
export default function DefiLoading() {
  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <Skeleton className="h-16 w-full max-w-sm rounded-2xl" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="size-36 rounded-full" />
    </div>
  )
}
