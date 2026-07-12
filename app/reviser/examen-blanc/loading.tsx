import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'examen blanc : titre puis écran d'intro (badge, GO).
export default function ExamenBlancLoading() {
  return (
    <div className="flex flex-col gap-4">
      <header className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </header>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 pt-4">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="size-32 rounded-full" />
      </div>
    </div>
  )
}
