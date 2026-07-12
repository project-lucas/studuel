import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'accueil Réviser : bandeau de salutation, cartes matières qui
// le chevauchent, puis les actions du jour.
export default function ReviserLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Skeleton className="h-40 rounded-3xl" />
        <div className="-mt-12 flex flex-col gap-3 px-2 sm:px-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-2xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  )
}
