import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la page matière (header + chapitres).
export default function SubjectLoading() {
  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <div className="bg-muted/60 px-4 pt-20 pb-6 md:px-8 md:pt-12">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-2xl" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
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
