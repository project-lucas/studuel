import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

// Squelette du catalogue de tests pendant la requête Supabase.
export default function TestLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </header>

      {[0, 1].map((section) => (
        <section key={section} className="mb-8">
          <Skeleton className="mb-3 h-6 w-28" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
