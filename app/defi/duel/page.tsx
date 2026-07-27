import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import DuelArena from '@/components/defi/DuelArena'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import { toDayKey } from '@/lib/streak'
import { fetchDisplayLevel } from '@/lib/wallet-server'
import { resolveCurrentChapter } from '@/lib/chapitre-courant-server'
import { reasonLabel } from '@/lib/chapitre-courant'
import { DUEL_QUESTION_BUFFER } from '@/lib/duel90'
import type { ModeQuestion } from '@/lib/defi-modes'

export const metadata = { title: 'Duel 90 s — Studuel' }
export const dynamic = 'force-dynamic'

type QuestionRow = {
  id: string
  quiz_id: string
  question: string
  kind: 'mcq' | 'true_false'
  options: unknown
  correct_index: number
  explanation: string | null
}

/**
 * La page du Duel 90 s — LE bouton JOUER du jeu.
 *
 * Elle ne pose aucune question à l'élève : elle décide elle-même du chapitre le
 * plus utile maintenant (contrôle à venir > là où il s'est arrêté > chapitre
 * fragile, cf. lib/chapitre-courant), charge de quoi tenir 90 secondes, et
 * lance le duel. Aucun écran intermédiaire, aucun choix à faire : c'est la
 * différence entre « je joue » et « je réfléchis à si je joue ».
 */
export default async function DuelPage({
  searchParams,
}: {
  // `?n=` change la graine du rival : c'est ainsi que « Rejouer » relance un
  // duel différent sans changer de page.
  searchParams: Promise<{ n?: string }>
}) {
  const { n } = await searchParams
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level, full_name')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null
  if (!grade) {
    return (
      <div>
        <PageHeader title="Duel 90 s" />
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border bg-card p-6 text-center">
          <GraduationCap className="mx-auto size-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            Dis-nous ta classe pour que le duel porte sur ton programme.
          </p>
          <Button asChild>
            <Link href="/onboarding">Choisir ma classe</Link>
          </Button>
        </div>
      </div>
    )
  }

  const today = toDayKey(new Date())

  const [resolved, level] = await Promise.all([
    resolveCurrentChapter(supabase, user.id, grade, today),
    // Le niveau vient du portefeuille (source unique de vérité). Le repli à 0
    // suffit : il ne sert ici qu'à calibrer le rival.
    fetchDisplayLevel(supabase, user.id, 0),
  ])

  // Aucun chapitre assez alimenté : on joue quand même, sur tout le programme.
  // Un duel qui ne se lance pas est un joueur perdu.
  const quizIds =
    resolved.quizIds.length > 0 ? resolved.quizIds : resolved.allQuizIds

  const { data: questions } = quizIds.length
    ? await supabase
        .from('quiz_questions')
        .select('id, quiz_id, question, kind, options, correct_index, explanation')
        .in('quiz_id', quizIds)
        .returns<QuestionRow[]>()
    : { data: null as QuestionRow[] | null }

  const round = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0

  const pool: ModeQuestion[] = shuffleSeeded(
    (questions ?? []).filter(isPlayable),
    `${user.id}#${today}#${round}`,
  )
    .slice(0, DUEL_QUESTION_BUFFER)
    .map((q) => {
      const options = (q.options as string[]).filter((o) => typeof o === 'string')
      const shuffled = permuteQuizOptions(q.kind, options, q.correct_index, q.id)
      return {
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        subject: resolved.chapter?.subject ?? null,
      }
    })

  // Graine du duel : elle change à chaque « Rejouer » (?n=), donc le rival
  // aussi. Deux élèves ne tombent jamais sur le même adversaire.
  const seed = `${user.id}#${today}#${round}`

  return (
    <div>
      <PageHeader title="Duel 90 s" />
      <DuelArena
        pool={pool}
        seed={seed}
        round={round}
        myLevel={level.level}
        myName={profile?.full_name ?? null}
        chapterId={resolved.chapter?.id}
        chapterTitle={resolved.chapter?.title}
        reason={
          resolved.chapter ? reasonLabel(resolved.chapter, today) : undefined
        }
      />
    </div>
  )
}

// Une question jouable : au moins deux options et une bonne réponse dans les
// bornes. La donnée vient de la base, on ne la suppose jamais saine.
function isPlayable(q: QuestionRow): boolean {
  return (
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    Number.isInteger(q.correct_index) &&
    q.correct_index >= 0 &&
    q.correct_index < (q.options as unknown[]).length
  )
}

// Mélange déterministe : le même élève au même tour retrouve le même ordre
// (un rechargement de page ne doit pas rebattre les cartes en plein duel).
function shuffleSeeded<T>(list: readonly T[], key: string): T[] {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + i) >>> 0
    const j = h % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
