import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onglet Amis : le tap sur l'onglet répond immédiatement,
// le contenu (mission, en direct, duels, classements) arrive derrière.
export default function AmisLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-40 rounded-3xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
