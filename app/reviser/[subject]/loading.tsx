import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la page matière : l'en-tête commun de Réviser (retour rond,
// médaillon + titre, barre, onglets) puis les chapitres — sur le mur crème,
// comme la page qu'il annonce (plus de bandeau coloré depuis le 23/09/2026).
export default function SubjectLoading() {
  return (
    <div>
      <Skeleton className="size-10 rounded-full" />
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="size-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <Skeleton className="mt-4 h-2 w-full rounded-full" />
      <Skeleton className="mt-4 h-10 w-full rounded-full" />
      <div className="mt-5">
        <Skeleton className="mb-4 h-5 w-28" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
