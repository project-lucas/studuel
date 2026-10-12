import { Skeleton } from '@/components/ui/skeleton'

// Squelette du dossier de matière, À LA FORME de la page qu'il annonce (le
// gabarit du 05/10/2026) : la bannière, le rail de quatre portes, la rangée
// des rayons, puis un thème ouvert sur ses fiches. Mêmes hauteurs que les
// vrais blocs : quand la page arrive, rien ne saute.
//
// La bannière n'a pas encore sa teinte (le squelette ne connaît pas la
// matière) : elle est en lavande, la couleur neutre de la marque.
export default function SubjectLoading() {
  return (
    <div aria-busy="true" aria-label="Ouverture du dossier">
      <div className="mt-4 rounded-[1.75rem] bg-secondary p-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-10 rounded-full bg-card" />
          <Skeleton className="h-8 w-36 bg-card" />
        </div>
        <Skeleton className="mt-3 ml-[3.125rem] h-4 w-32 bg-card" />
        <Skeleton className="mt-3 h-[1.375rem] w-full rounded-full bg-card" />
        <Skeleton className="mt-3.5 h-[5.5rem] w-full rounded-[1.25rem] bg-card" />
      </div>

      <div className="mt-[1.125rem] grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[5.125rem] rounded-[1.25rem] bg-card" />
        ))}
      </div>

      <Skeleton className="mt-3 h-11 w-full rounded-full bg-card" />

      <div className="mt-3 flex flex-col gap-2.5">
        <Skeleton className="h-64 rounded-[1.375rem] bg-card" />
        <Skeleton className="h-16 rounded-[1.375rem] bg-card" />
      </div>
    </div>
  )
}
