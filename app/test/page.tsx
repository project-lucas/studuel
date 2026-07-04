import Link from 'next/link'
import { Lock, ChevronRight, TriangleAlert, X } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { createClient } from '@/lib/supabase/server'
import type { Quiz } from '@/lib/types'

export const metadata = { title: 'Test — Scolaria' }

// Catalogue dynamique : pas de cache statique au build.
export const dynamic = 'force-dynamic'

// Comparaison tolérante : « Français », « francais », « FRANCAIS » se valent.
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

const PREMIUM_TIERS = ['tier1', 'tier2', 'tier3']

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ matiere?: string; tous?: string }>
}) {
  const { matiere, tous } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasPremium = false
  let grade: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, grade_level')
      .eq('id', user.id)
      .maybeSingle()
    hasPremium = PREMIUM_TIERS.includes(profile?.subscription_tier ?? 'free')
    grade = profile?.grade_level ?? null
  }

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('id, title, subject, grade_level, chapter, is_free')
    .order('subject', { ascending: true })
    .order('title', { ascending: true })

  // Filtre optionnel par matière (lien « M'entraîner » du Planning).
  let filtered = matiere
    ? ((quizzes ?? []) as Quiz[]).filter((q) => norm(q.subject) === norm(matiere))
    : ((quizzes ?? []) as Quiz[])

  // Filtre par classe de l'élève (sauf filtre matière ou « Voir tout »).
  const filterByGrade = Boolean(grade) && !matiere && !tous
  let gradeEmpty = false
  if (filterByGrade) {
    const ofGrade = filtered.filter((q) => q.grade_level === grade)
    gradeEmpty = ofGrade.length === 0
    if (!gradeEmpty) filtered = ofGrade
  }

  // Regroupe le catalogue par matière pour l'affichage.
  const bySubject = new Map<string, Quiz[]>()
  for (const quiz of filtered) {
    const list = bySubject.get(quiz.subject) ?? []
    list.push(quiz)
    bySubject.set(quiz.subject, list)
  }

  return (
    <div>
      <PageHeader
        title="Test"
        description="Choisis une matière puis lance un quiz pour évaluer tes connaissances."
      />

      {matiere ? (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
            Matière : {matiere}
            <Link
              href="/test"
              aria-label="Retirer le filtre"
              className="transition-opacity hover:opacity-70"
            >
              <X className="size-3.5" />
            </Link>
          </span>
        </div>
      ) : filterByGrade && !gradeEmpty ? (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
            Ta classe : {grade}
          </span>
          <Link
            href="/test?tous=1"
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Voir toutes les classes
          </Link>
        </div>
      ) : gradeEmpty ? (
        <p className="mb-6 text-sm text-muted-foreground">
          Pas encore de quiz pour la {grade} — voici tout le catalogue en
          attendant.
        </p>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Base de données indisponible
            </CardTitle>
            <CardDescription>
              Impossible de charger le catalogue des tests ({error.message}).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les tables ne sont probablement pas encore créées — voir{' '}
            <code>LOG_ERREUR.md</code> à la racine du projet pour la marche à suivre.
          </CardContent>
        </Card>
      ) : bySubject.size === 0 && matiere ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun quiz pour « {matiere} »</CardTitle>
            <CardDescription>
              Cette matière de ton tableau de révision n&apos;a pas encore de
              quiz dans le catalogue.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <Link href="/test" className="font-medium text-primary underline underline-offset-4">
              Voir tous les tests disponibles
            </Link>
          </CardContent>
        </Card>
      ) : bySubject.size === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun test disponible</CardTitle>
            <CardDescription>
              La connexion à Supabase fonctionne, mais le catalogue est vide.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Exécute <code>supabase/schema.sql</code> puis{' '}
            <code>supabase/002_quizzes.sql</code> dans le SQL Editor de Supabase
            pour créer les tables et les quiz de démonstration.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {[...bySubject.entries()].map(([subject, subjectQuizzes]) => (
            <section key={subject}>
              <h2 className="font-heading mb-3 text-xl font-semibold">{subject}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjectQuizzes.map((quiz) => {
                  const locked = !quiz.is_free && !hasPremium
                  const meta = [quiz.grade_level, quiz.chapter]
                    .filter(Boolean)
                    .join(' · ')

                  const card = (
                    <Card
                      className={
                        locked
                          ? 'opacity-60'
                          : 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/25'
                      }
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                          {quiz.title}
                          {locked ? (
                            <Lock className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                          )}
                        </CardTitle>
                        {meta ? <CardDescription>{meta}</CardDescription> : null}
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {locked
                          ? 'Réservé à l’Offre 1 — abonne-toi pour débloquer ce test.'
                          : quiz.is_free
                            ? 'Gratuit — lance le quiz.'
                            : 'Inclus dans ton abonnement.'}
                      </CardContent>
                    </Card>
                  )

                  return locked ? (
                    <div key={quiz.id} aria-disabled="true">
                      {card}
                    </div>
                  ) : (
                    <Link key={quiz.id} href={`/test/${quiz.id}`} className="block">
                      {card}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
