import Link from 'next/link'
import { CircleUser, TriangleAlert } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import RevisionBoard from '@/components/RevisionBoard'
import { createClient } from '@/lib/supabase/server'
import type { RevisionSubject } from '@/lib/types'

export const metadata = { title: 'Planning — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function PlanningPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Planning"
          description="Ton tableau de révision : matières, chapitres et textes à prioriser avant l'examen."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour construire ton tableau
            </CardTitle>
            <CardDescription>
              Brevet, bac de français (écrit et oral), bac : liste tes matières et
              vois d&apos;un coup d&apos;œil ce qui est critique.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { data: subjects, error } = await supabase
    .from('revision_subjects')
    .select('id, name, exam, priority, created_at, revision_items(id, subject_id, title, kind, status, created_at)')
    .order('created_at', { ascending: true })
    .returns<RevisionSubject[]>()

  return (
    <div>
      <PageHeader
        title="Planning"
        description="Ton tableau de révision : priorise tes matières et suis chapitre par chapitre où tu en es."
      />

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Tableau indisponible
            </CardTitle>
            <CardDescription>
              Impossible de charger ton tableau de révision ({error.message}).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les tables ne sont probablement pas encore créées — exécute{' '}
            <code>supabase/005_revision_board.sql</code> dans le SQL Editor de
            Supabase.
          </CardContent>
        </Card>
      ) : (
        <RevisionBoard subjects={subjects ?? []} />
      )}
    </div>
  )
}
