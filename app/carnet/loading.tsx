import { Skeleton } from '@/components/ui/skeleton'

// Squelette de « Ma bibliothèque » : le bouton de Réviser répond tout de
// suite — titre, filtre des rayons, étagère des capsules, puis les dossiers
// arrivent derrière. Sans lui, le tap restait sans réponse visible le temps du
// rendu serveur.
export default function CarnetLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="size-11 rounded-full" />
        <Skeleton className="mt-4 h-8 w-52" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-9 flex-1 rounded-full" />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-28 shrink-0 rounded-2xl" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
