import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'accueil Réviser : série, reprendre, consolider, matières.
export default function ReviserLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
