import { Skeleton } from '@/components/ui/skeleton'

// Squelette de /moi/habitudes : la jauge de capacité, le verdict du jour, puis
// la liste du catalogue.
export default function HabitudesLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-11 w-48 rounded-full" />
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-20 rounded-3xl" />
      <Skeleton className="h-28 rounded-3xl" />
      <Skeleton className="h-28 rounded-3xl" />
      <Skeleton className="h-28 rounded-3xl" />
    </div>
  )
}
