import { Skeleton } from '@/components/ui/skeleton'

// Squelette de la carte mentale : header coloré + centre + branches.
export default function CarteLoading() {
  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-6 md:px-8">
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
