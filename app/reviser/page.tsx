import Link from 'next/link'
import { CircleUser, GraduationCap, TriangleAlert } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import SubjectsHome from '@/components/SubjectsHome'
import { createClient } from '@/lib/supabase/server'
import type { Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function ReviserPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Mes matières"
          description="Ton programme, chapitre par chapitre, avec cours et quiz."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour réviser
            </CardTitle>
            <CardDescription>
              Tes matières s&apos;adaptent à ta classe, de la 6e à la Terminale.
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

  const [{ data: profile }, { data: subjects, error }] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level, selected_subjects')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('subjects').select('*').order('name').returns<Subject[]>(),
  ])

  const grade = profile?.grade_level ?? null

  if (!grade) {
    return (
      <div>
        <PageHeader title="Mes matières" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Dis-nous ta classe
            </CardTitle>
            <CardDescription>
              Ton programme dépend de ta classe — configure-la en 10 secondes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/onboarding">Choisir ma classe</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Mes matières" />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Matières indisponibles
            </CardTitle>
            <CardDescription>
              {error.message} — exécute <code>supabase/008_reviser.sql</code>{' '}
              dans le SQL Editor.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Un élève de 5e ne voit que les matières enseignées en 5e.
  const ofLevel = (subjects ?? []).filter((s) => s.levels.includes(grade))
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null

  return <SubjectsHome subjects={ofLevel} selected={selected} grade={grade} />
}
