import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Coaching — Scolaria' }

export default function CoachingPage() {
  return (
    <div>
      <PageHeader
        title="Espace Coaching"
        description="Bienvenue dans ton espace de coaching. C'est ici que nous suivrons ta progression."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Messagerie</CardTitle>
            <CardDescription>Échange avec ton coach.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            À venir : fil de messages (table `messages`).
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
