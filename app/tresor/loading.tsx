import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onglet Trésor : le tap sur l'onglet répond immédiatement,
// le contenu (coffre, boutique, collection) arrive derrière.
export default function TresorLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-44 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
