import { Sparkles } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Coaching — Scolaria' }

// Onglet réservé : le coaching humain arrive ici plus tard.
export default function CoachingPage() {
  return (
    <div>
      <PageHeader
        title="Coaching"
        description="Un accompagnement humain pour aller plus loin."
      />
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Bientôt disponible
          </CardTitle>
          <CardDescription>
            Cet espace accueillera prochainement ton coach Scolaria. En
            attendant, continue tes sessions — chaque jour compte.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
