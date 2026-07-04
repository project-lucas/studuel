import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

// Squelette d'une session de quiz pendant le chargement des questions.
export default function QuizLoading() {
  return (
    <div>
      <header className="mb-8 space-y-2">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-40" />
      </header>

      <Card className="mx-auto max-w-xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Skeleton className="h-8 w-36" />
        </CardFooter>
      </Card>
    </div>
  )
}
