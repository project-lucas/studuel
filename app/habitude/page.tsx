import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Habitude — Scolaria' }

const WEEKS = 26
const DAYS = 7

// Intensités de démo, déterministes (pas de données réelles pour l'instant).
const demoLevel = (week: number, day: number) => ((week * 7 + day) * 13) % 5

const levelClasses = [
  'bg-muted',
  'bg-primary/25',
  'bg-primary/50',
  'bg-primary/75',
  'bg-primary',
]

// Historique de sessions façon "contribution graph" GitHub.
function HabitHeatmap() {
  return (
    <div className="overflow-x-auto">
      <div className="flex w-max gap-1">
        {Array.from({ length: WEEKS }, (_, week) => (
          <div key={week} className="flex flex-col gap-1">
            {Array.from({ length: DAYS }, (_, day) => (
              <div
                key={day}
                className={cn('size-3 rounded-[2px]', levelClasses[demoLevel(week, day)])}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HabitudePage() {
  return (
    <div>
      <PageHeader
        title="Habitude"
        description="Suis tes sessions de test au quotidien et construis ta régularité."
      />

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Historique des sessions</CardTitle>
            <CardDescription>
              Ton activité des 6 derniers mois, jour par jour (données de démo).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HabitHeatmap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes habitudes</CardTitle>
            <CardDescription>
              Personnalise ton expérience en ajoutant tes propres habitudes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              À venir : création d&apos;habitudes personnalisées et suivi de séries.
            </p>
            <Button disabled>+ Ajouter une habitude</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
