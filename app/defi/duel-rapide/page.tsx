import Link from 'next/link'
import { Zap, GraduationCap } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import QuickMatch from '@/components/defi/QuickMatch'
import { createClient } from '@/lib/supabase/server'
import { toModeQuestions, type QuickQuestionRow } from '@/lib/defi/quick-pool'
import { ROUND_SIZE, ROUNDS_TO_WIN, type ModeQuestion } from '@/lib/defi-modes'

export const metadata = { title: 'Duel en direct — Studuel' }
export const dynamic = 'force-dynamic'

// BO3 : jusqu'à 3 manches de ROUND_SIZE questions à partager avec le rival.
const MAX_QUESTIONS = ROUND_SIZE * (ROUNDS_TO_WIN * 2 - 1)
// Nombre de quiz piochés pour composer le pool de l'hôte.
const QUIZ_SAMPLE = 8

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Route /defi/duel-rapide — la « Partie rapide » façon Clash Royale :
 * - sans paramètre : crée une session de duel live et affiche son QR code ;
 *   quiconque le scanne commence instantanément un match contre toi ;
 * - avec ?rejoindre=<id> (l'URL encodée dans le QR) : rejoint la session
 *   et le match démarre. Tout repose sur le duel temps réel existant
 *   (migration 046, useLiveDuel) — seule l'entrée en matière change.
 */
export default async function DuelRapidePage({
  searchParams,
}: {
  searchParams: Promise<{ rejoindre?: string }>
}) {
  const { rejoindre } = await searchParams
  const joinId = rejoindre && UUID_RE.test(rejoindre) ? rejoindre : null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Shell>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Connecte-toi pour jouer
            </CardTitle>
            <CardDescription>
              {joinId
                ? 'Connecte-toi, puis rescanne le QR code de ton ami pour lancer le match.'
                : 'Le duel en direct te donne un QR code : ton ami le scanne et le match démarre.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </Shell>
    )
  }

  // L'hôte fournit les questions partagées ; le rival les recevra par la
  // session (question_ids) — son pool local reste vide.
  let pool: ModeQuestion[] = []
  if (!joinId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle()
    const grade = profile?.grade_level ?? null

    if (!grade) {
      return (
        <Shell>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="size-4" /> Dis-nous ta classe
              </CardTitle>
              <CardDescription>
                Les questions du duel en direct s&apos;adaptent à ton
                programme — 30 secondes de config.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/onboarding">Choisir ma classe</Link>
              </Button>
            </CardFooter>
          </Card>
        </Shell>
      )
    }

    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, subject')
      .eq('grade_level', grade)
    const picked = shuffle(quizzes ?? []).slice(0, QUIZ_SAMPLE)

    if (picked.length > 0) {
      const { data: questions } = await supabase
        .from('quiz_questions')
        .select('id, quiz_id, question, kind, options, correct_index, explanation')
        .in('quiz_id', picked.map((q) => q.id))
        .returns<QuickQuestionRow[]>()
      const subjectByQuiz = new Map(picked.map((q) => [q.id, q.subject]))
      pool = shuffle(
        toModeQuestions(questions, (id) => subjectByQuiz.get(id) ?? null),
      ).slice(0, MAX_QUESTIONS)
    }

    if (pool.length < ROUND_SIZE) {
      return (
        <Shell>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pas encore assez de questions</CardTitle>
              <CardDescription>
                Il faut au moins {ROUND_SIZE} questions dans ta classe pour
                lancer un duel en direct. Réessaie bientôt !
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/defi">Retour à l&apos;arène</Link>
              </Button>
            </CardFooter>
          </Card>
        </Shell>
      )
    }
  }

  return (
    <Shell>
      {/* Panneau clair : les écrans du duel live (match, verdict) sont conçus
          sur fond crème — l'arène sombre reste le décor autour. */}
      <div className="w-full rounded-3xl bg-background shadow-xl">
        <QuickMatch
          userId={user.id}
          pool={pool}
          subject="Duel en direct"
          joinId={joinId}
        />
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      {children}
    </div>
  )
}
