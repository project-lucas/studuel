import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onglet Moi : score, habitudes, courbe, badges.
export default function MoiLoading() {
  return (
    <div className="flex flex-col gap-4">
      <header className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </header>
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  )
}
