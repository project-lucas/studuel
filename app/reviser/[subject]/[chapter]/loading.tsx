import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la page chapitre (header coloré + leçons).
export default function ChapterLoading() {
  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <div className="bg-muted/60 px-4 pt-20 pb-6 md:px-8 md:pt-12">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-72" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
