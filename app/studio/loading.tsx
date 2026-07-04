import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

// Squelette du catalogue de decks pendant la requête Supabase.
export default function StudioLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
