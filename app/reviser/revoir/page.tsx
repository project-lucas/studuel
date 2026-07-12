import Link from 'next/link'
import { CircleUser } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import ReviewPlayer, { type ReviewPlayItem } from '@/components/ReviewPlayer'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import { getReviewItems, reviewQueue } from '@/lib/srs'
import type { QuizQuestion, DeckCard } from '@/lib/types'

export const metadata = { title: 'À revoir — Scolaria' }
export const dynamic = 'force-dynamic'

// Une session « À revoir » reste courte : la régularité bat le marathon.
const SESSION_SIZE = 15

export default async function RevoirPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="À revoir"
          description="Ta file de révision espacée — chaque chose au bon moment."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour réviser
            </CardTitle>
            <CardDescription>
              La file « À revoir » planifie tes révisions au bon moment, pour
              que ça reste en tête.
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

  // File du jour : Revanche d'abord, puis les items dus les plus en retard.
  const today = toDayKey(new Date())
  const queue = reviewQueue(await getReviewItems(supabase, user.id), today)
  const picked = queue.slice(0, SESSION_SIZE)

  // Contenu des items (les review_items ne stockent que des ids).
  const questionIds = picked
    .filter((i) => i.item_kind === 'question')
    .map((i) => i.item_id)
  const cardIds = picked
    .filter((i) => i.item_kind === 'card')
    .map((i) => i.item_id)

  const [{ data: questions }, { data: cards }] = await Promise.all([
    questionIds.length > 0
      ? supabase
          .from('quiz_questions')
          .select(
            'id, quiz_id, question, kind, options, correct_index, explanation, position',
          )
          .in('id', questionIds)
          .returns<QuizQuestion[]>()
      : Promise.resolve({ data: [] as QuizQuestion[] }),
    cardIds.length > 0
      ? supabase
          .from('deck_cards')
          .select('id, deck_id, front, back, position')
          .in('id', cardIds)
          .returns<DeckCard[]>()
      : Promise.resolve({ data: [] as DeckCard[] }),
  ])

  const questionById = new Map((questions ?? []).map((q) => [q.id, q]))
  const cardById = new Map((cards ?? []).map((c) => [c.id, c]))

  // Items jouables — un contenu supprimé du programme disparaît de la file.
  const items: ReviewPlayItem[] = []
  for (const i of picked) {
    if (i.item_kind === 'question') {
      const q = questionById.get(i.item_id)
      if (
        !q ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        q.correct_index < 0 ||
        q.correct_index >= q.options.length
      )
        continue
      items.push({
        kind: 'question',
        id: q.id,
        subject: i.subject,
        inRevanche: i.in_revanche,
        prompt: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      })
    } else {
      const c = cardById.get(i.item_id)
      if (!c) continue
      items.push({
        kind: 'card',
        id: c.id,
        subject: i.subject,
        inRevanche: i.in_revanche,
        front: c.front,
        back: c.back,
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="À revoir"
        description="Revanche d'abord, puis ce que ta mémoire s'apprête à oublier."
      />
      <ReviewPlayer items={items} />
    </div>
  )
}
