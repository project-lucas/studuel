import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Studio — Scolaria' }

export default function StudioPage() {
  return (
    <div>
      <PageHeader
        title="Studio"
        description="Génère flashcards et cartes mentales assistées par l'IA."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>Crée et révise tes cartes mémoire.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : génération de flashcards (GPT-4o).
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mind Maps</CardTitle>
            <CardDescription>Visualise tes connaissances avec React Flow.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : éditeur de cartes mentales.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
