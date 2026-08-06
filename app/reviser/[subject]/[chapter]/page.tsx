import { notFound, redirect } from 'next/navigation'
import BackButton from '@/components/BackButton'
import SupportChips from '@/components/reviser/SupportChips'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'
import { loadChapterSupports } from './supports'

export const dynamic = 'force-dynamic'

// L'écran de chapitre : on choisit AVANT d'entrer.
//
// Ouvrir un chapitre menait droit au cours, sans rien demander. C'était rapide
// pour qui venait lire, et fermé pour tous les autres — celui qui voulait ses
// flashcards ou son défi tombait sur trois écrans de leçon rédigée et devait
// repartir en arrière. L'écran rend le choix : cinq boutons, rien d'autre. Le
// cours en est un, plus le passage obligé.
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Slug vérifié par la jointure : un chapitre atteint sous la mauvaise matière
  // n'existe pas.
  type Row = Chapter & { subject: Subject | null }
  const { data: row } = await supabase
    .from('chapters')
    .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
    .eq('id', chapterId)
    .eq('subjects.slug', slug)
    .maybeSingle<Row>()
  if (!row?.subject) notFound()

  const { subject, ...chapter } = row
  const supports = await loadChapterSupports(
    supabase,
    user.id,
    subject.slug,
    chapter as Chapter,
  )

  // Chapitre encore vide (ni leçon, ni quiz) : retour à la matière plutôt qu'un
  // écran de choix qui n'en propose aucun.
  if (supports.length === 0) redirect(`/reviser/${slug}`)

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <header
        className={cn(
          'relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-12',
          theme.header,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton fallback={`/reviser/${subject.slug}`} />
          <p className="mt-4 text-center text-sm font-semibold opacity-70">
            Chapitre {chapter.position}
          </p>
          <h1 className="font-heading mt-0.5 text-center text-2xl font-bold text-balance md:text-3xl">
            {chapter.title}
          </h1>
        </div>
      </header>

      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">
          <h2 className="font-heading text-center text-lg font-bold">
            Par quoi tu commences ?
          </h2>
          <p className="mt-0.5 mb-5 text-center text-sm text-muted-foreground">
            Tout ce chapitre, dans le format qui te va.
          </p>
          <SupportChips
            chips={supports}
            layout="grid"
            label={`Travailler ${chapter.title}`}
          />
        </div>
      </div>
    </div>
  )
}
