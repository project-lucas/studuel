import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

// Squelette du tableau de révision pendant la requête Supabase.
export default function PlanningLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </header>

      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <Card key={i} className="border-l-4 border-l-transparent">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
