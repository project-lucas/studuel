import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Coaching — Studuel' }

export default function CoachingPage() {
  return (
    <div>
      {/* ⚠️ DOUBLON À TRANCHER : /planning rend exactement le même écran
          « Coaching — bientôt », avec la même metadata. Aucune des deux routes
          n'est atteignable depuis la navigation. À fusionner (ou à supprimer)
          une fois décidé laquelle garder. */}
      <PageHeader
        title="Espace Coaching"
        description="Bienvenue dans ton espace de coaching. C'est ici qu'on suivra ta progression."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Messagerie</CardTitle>
            <CardDescription>Échange avec ton coach.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : tu pourras discuter directement avec ton coach.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
