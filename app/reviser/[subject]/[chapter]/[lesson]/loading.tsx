import { Skeleton } from '@/components/ui/skeleton'

// Squelette d'une leçon : bandeau de titre + corps de contenu.
export default function LessonLoading() {
  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <div className="bg-muted/60 px-4 pt-20 pb-6 md:px-8 md:pt-12">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-72 max-w-full" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 md:px-8">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="mt-6 h-11 w-48 rounded-full" />
      </div>
    </div>
  )
}
