import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

// Squelette de la page Habitude (heatmap + dernières sessions).
export default function HabitudeLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </header>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </CardHeader>
          <CardContent>
            {/* Grille façon heatmap */}
            <div className="flex w-max gap-1 overflow-hidden">
              {Array.from({ length: 26 }, (_, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, d) => (
                    <Skeleton key={d} className="size-3 rounded-[2px]" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
