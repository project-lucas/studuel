import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import FlashcardPlayer from '@/components/FlashcardPlayer'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessPremiumTests } from '@/lib/subscription'
import type { DeckCard } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: deck } = await supabase
    .from('flashcard_decks')
    .select('id, title, subject, grade_level, is_free')
    .eq('id', id)
    .maybeSingle()

  if (!deck) notFound()

  // Même règle que les quiz : le contenu premium requiert l'Offre 1.
  const tier = await getUserTier()
  if (!deck.is_free && !canAccessPremiumTests(tier)) {
    return (
      <div>
        <PageHeader title={deck.title} description={deck.subject} />
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-4" /> Deck réservé à l’Offre 1
            </CardTitle>
            <CardDescription>
              Ces flashcards font partie du contenu premium de Studuel.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/studio">
                <ArrowLeft className="size-4" /> Retour au Studio
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { data: cards, error } = await supabase
    .from('deck_cards')
    .select('id, deck_id, front, back, position')
    .eq('deck_id', deck.id)
    .order('position', { ascending: true })
    .returns<DeckCard[]>()

  const meta = [deck.subject, deck.grade_level].filter(Boolean).join(' · ')

  return (
    <div>
      <PageHeader title={deck.title} description={meta} />

      {error || !cards || cards.length === 0 ? (
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Deck indisponible</CardTitle>
            <CardDescription>
              {error
                ? `Erreur de chargement (${error.message}).`
                : 'Aucune carte dans ce deck pour le moment.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/studio">
                <ArrowLeft className="size-4" /> Retour au Studio
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <FlashcardPlayer
          deckId={deck.id}
          title={deck.title}
          cards={cards}
          subject={deck.subject}
        />
      )}
    </div>
  )
}
