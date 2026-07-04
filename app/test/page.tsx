import Link from 'next/link'
import { Lock, ChevronRight, TriangleAlert } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessPremiumTests } from '@/lib/subscription'
import type { Quiz } from '@/lib/types'

export const metadata = { title: 'Test — Scolaria' }

// Catalogue dynamique : pas de cache statique au build.
export const dynamic = 'force-dynamic'

export default async function TestPage() {
  const supabase = await createClient()

  const [{ data: quizzes, error }, tier] = await Promise.all([
    supabase
      .from('quizzes')
      .select('id, title, subject, grade_level, chapter, is_free')
      .order('subject', { ascending: true })
      .order('title', { ascending: true }),
    getUserTier(),
  ])

  const hasPremium = canAccessPremiumTests(tier)

  // Regroupe le catalogue par matière pour l'affichage.
  const bySubject = new Map<string, Quiz[]>()
  for (const quiz of (quizzes ?? []) as Quiz[]) {
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
                          ? 'opacity-70'
                          : 'transition-shadow hover:shadow-md'
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
