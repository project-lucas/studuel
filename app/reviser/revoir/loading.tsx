import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la session « À revoir » : titre, barre de progression, item.
export default function RevoirLoading() {
  return (
    <div className="flex flex-col gap-4">
      <header className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </header>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-12 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
