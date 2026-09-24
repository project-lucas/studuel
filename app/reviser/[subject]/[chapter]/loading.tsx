import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'écran de chapitre : l'en-tête commun de Réviser (retour rond,
// titre, sous-titre) puis les tuiles des supports — sur le mur crème, comme la
// page qu'il annonce (plus de bandeau coloré depuis le 23/09/2026).
export default function ChapterLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Skeleton className="size-10 rounded-full" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-6 space-y-4">
        <Skeleton className="mx-auto h-6 w-1/2" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
