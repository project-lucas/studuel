import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la carte mentale : l'en-tête commun de Réviser (retour rond,
// titre, sous-titre) puis le centre et les branches — sur le mur crème, comme
// la page qu'il annonce (plus de bandeau coloré depuis le 23/09/2026).
export default function CarteLoading() {
  return (
    <div>
      <Skeleton className="size-10 rounded-full" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="mt-6 flex w-full flex-col items-center">
        <Skeleton className="h-14 w-64 rounded-3xl" />
        <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
