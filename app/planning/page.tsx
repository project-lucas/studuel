import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Planning — Scolaria' }

export default function PlanningPage() {
  return (
    <div>
      <PageHeader
        title="Planning"
        description="Organise tes sessions de révision et suis ton emploi du temps."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Agenda</CardTitle>
            <CardDescription>Tes prochaines sessions de travail.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : calendrier des révisions.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
