import { Skeleton } from '@/components/ui/skeleton'

// Squelette de « Mon carnet » : le bouton du titre de Réviser répond tout de
// suite, l'étagère des capsules et les dossiers arrivent derrière. Sans lui,
// le tap restait sans réponse visible le temps du rendu serveur.
export default function CarnetLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60" />
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
