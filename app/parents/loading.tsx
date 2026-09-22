import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'espace parents : l'en-tête violet, la rangée des volets,
// puis le bilan et les blocs de la carte de suivi.
export default function ParentsLoading() {
  return (
    <div className="bg-background min-h-svh">
      <div className="bg-primary px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-8 md:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <Skeleton className="mb-6 h-6 w-32 bg-white/20" />
          <Skeleton className="mb-3 h-9 w-56 bg-white/20" />
          <Skeleton className="h-4 w-full max-w-sm bg-white/20" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-8">
        <Skeleton className="mb-5 h-12 w-full rounded-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
