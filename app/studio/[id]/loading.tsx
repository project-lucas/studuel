import { Skeleton } from '@/components/ui/skeleton'

// Squelette du lecteur de flashcards.
export default function DeckLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-40" />
      </header>

      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  )
}
