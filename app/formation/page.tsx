import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Formation — Scolaria' }

export default function FormationPage() {
  return (
    <div>
      <PageHeader
        title="Formation"
        description="Ta banque de vidéos et de cours pour apprendre à ton rythme."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vidéos</CardTitle>
            <CardDescription>Le catalogue vidéo arrive bientôt.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : banque de vidéos par niveau et matière.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
