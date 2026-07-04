import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la grille « Mes matières ».
export default function ReviserLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
