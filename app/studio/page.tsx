import Link from 'next/link'
import { Lock, ChevronRight, TriangleAlert, Layers } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { createClient } from '@/lib/supabase/server'
import type { FlashcardDeck } from '@/lib/types'

export const metadata = { title: 'Studio — Studuel' }
export const dynamic = 'force-dynamic'

const PREMIUM_TIERS = ['tier1', 'tier2', 'tier3']

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ tous?: string }>
}) {
  const { tous } = await searchParams
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

  const { data: decks, error } = await supabase
    .from('flashcard_decks')
    .select('id, title, subject, grade_level, is_free, deck_cards(count)')
    .order('subject', { ascending: true })
    .returns<FlashcardDeck[]>()

  // Filtre par classe de l'élève (désactivable via « Voir tout »).
  const all = decks ?? []
  const filterByGrade = Boolean(grade) && !tous
  let visible = filterByGrade ? all.filter((d) => d.grade_level === grade) : all
  const gradeEmpty = filterByGrade && visible.length === 0
  if (gradeEmpty) visible = all

  return (
    <div>
      <PageHeader
        title="Studio"
        description="Tes flashcards du programme : retourne, mémorise, recommence jusqu'à tout savoir."
      />

      {filterByGrade && !gradeEmpty ? (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
            Ta classe : {grade}
          </span>
          <Link
            href="/studio?tous=1"
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Voir toutes les classes
          </Link>
        </div>
      ) : null}
      {gradeEmpty ? (
        <p className="mb-6 text-sm text-muted-foreground">
          Pas encore de deck pour la {grade} — voici tout le catalogue en
          attendant.
        </p>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Studio indisponible
            </CardTitle>
            <CardDescription>
              Impossible de charger les decks ({error.message}) — exécute{' '}
              <code>supabase/007_programme.sql</code> dans le SQL Editor.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun deck disponible</CardTitle>
            <CardDescription>
              Exécute <code>supabase/007_programme.sql</code> pour créer les
              decks du programme.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((deck) => {
            const locked = !deck.is_free && !hasPremium
            const count = deck.deck_cards?.[0]?.count ?? 0
            const meta = [deck.subject, deck.grade_level]
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
                    {deck.title}
                    {locked ? (
                      <Lock className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <CardDescription>{meta}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="size-3.5" />
                  {count} carte{count > 1 ? 's' : ''}
                  {locked ? ' · Offre 1' : ''}
                </CardContent>
              </Card>
            )

            return locked ? (
              <div key={deck.id} aria-disabled="true">
                {card}
              </div>
            ) : (
              <Link key={deck.id} href={`/studio/${deck.id}`} className="block">
                {card}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
