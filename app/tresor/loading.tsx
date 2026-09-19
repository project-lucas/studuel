import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la Boutique, dans l'ordre de la page : la carte Studuel+, le
// Marché (trois cartes), puis les rayons de capsules. Chaque titre de catégorie est une
// image pleine largeur (BandeauSection) : plaque de 56 px, parchemin de 96 px.
export default function BoutiqueLoading() {
  return (
    <div className="flex flex-col gap-9">
      <Skeleton className="h-72 rounded-[28px]" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-14" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="mx-3 h-24" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-64 w-60 shrink-0 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
