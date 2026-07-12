import { Skeleton } from '@/components/ui/skeleton'

// Squelette de l'onglet Moi : carte bandeau (avec la place de la flamme),
// puis les cartes « jouet » empilées (7 jours, compagnon, capacités, débrief).
export default function MoiLoading() {
  return (
    <div className="mt-12 flex flex-col gap-5">
      <Skeleton className="h-52 rounded-3xl" />
      <Skeleton className="h-24 rounded-3xl" />
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  )
}
