import { Skeleton } from '@/components/ui/skeleton'

// Squelette d'une leçon : l'en-tête commun de Réviser (retour rond, titre,
// sous-titre) puis le corps du cours — sur le mur crème, comme la page qu'il
// annonce (plus de bandeau coloré depuis le 23/09/2026).
export default function LessonLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Skeleton className="size-10 rounded-full" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="mt-6 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="mt-6 h-11 w-48 rounded-full" />
      </div>
    </div>
  )
}
