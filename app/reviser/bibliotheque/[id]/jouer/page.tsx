import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { Pencil } from 'lucide-react'
import BackButton from '@/components/BackButton'
import LessonRichContent from '@/components/LessonRichContent'
import MindMap from '@/components/MindMap'
import QuizPlayer from '@/components/QuizPlayer'
import { createClient } from '@/lib/supabase/server'
import {
  isLibraryKind,
  normalizeContent,
  normalizeTitle,
  isContentReady,
  toQuizQuestions,
  KIND_LABEL,
  type FicheContent,
  type QuizContent,
  type CarteContent,
} from '@/lib/library'

export const metadata = { title: 'Bibliothèque — Studuel' }
export const dynamic = 'force-dynamic'

// Vue « lecture / jeu » d'un contenu de la bibliothèque : on lit sa fiche, on
// joue son quiz (sans l'enregistrer comme une session de catalogue), on regarde
// sa carte mentale. L'édition reste sur /reviser/bibliotheque/[id].
export default async function LibraryViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = await supabase
    .from('library_items')
    .select('id, kind, title, content')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!row || !isLibraryKind(row.kind)) notFound()

  const kind = row.kind
  const title = normalizeTitle(row.title)
  const content = normalizeContent(kind, row.content)
  const editHref = `/reviser/bibliotheque/${id}`

  // Quiz jouable : QuizPlayer prend tout l'écran, on le rend seul.
  if (kind === 'quiz' && isContentReady(kind, content)) {
    return (
      <QuizPlayer
        quizId={id}
        title={title}
        questions={toQuizQuestions(id, content as QuizContent)}
        backHref="/reviser/bibliotheque"
        record={false}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <BackButton fallback="/reviser/bibliotheque" label="Ma bibliothèque" />

      <div className="mt-4 mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {KIND_LABEL[kind]}
          </p>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            {title}
          </h1>
        </div>
        <Link
          href={editHref}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-xs font-bold text-foreground shadow-sm transition active:translate-y-px"
        >
          <Pencil className="size-3.5" aria-hidden="true" /> Modifier
        </Link>
      </div>

      {!isContentReady(kind, content) ? (
        <div className="rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-muted-foreground">
            Ce contenu est encore vide.
          </p>
          <Link
            href={editHref}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <Pencil className="size-4" /> Le compléter
          </Link>
        </div>
      ) : kind === 'fiche' ? (
        <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <LessonRichContent content={(content as FicheContent).markdown} />
        </div>
      ) : (
        <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <MindMap data={content as CarteContent} />
        </div>
      )}
    </div>
  )
}
