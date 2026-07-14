import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onglet Premium : le tap répond immédiatement, les offres
// (hero de valeur + comparatif des abonnements) arrivent derrière.
export default function PremiumLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-40 rounded-3xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-52 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
