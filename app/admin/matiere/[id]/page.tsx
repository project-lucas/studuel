import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConfirmSubmit from '@/components/admin/ConfirmSubmit'
import {
  createChapter,
  createLesson,
  deleteChapter,
  deleteLesson,
  updateChapter,
} from '@/app/admin/actions'
import { createClient } from '@/lib/supabase/server'
import { GRADE_LEVELS, type Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ChapterRow = {
  id: string
  level: string
  title: string
  position: number
  lessons: {
    id: string
    title: string
    position: number
    content: string | null
    has_revision_sheet: boolean | null
    studygram_url: string | null
    quizzes: { id: string }[]
  }[]
}

// Structure d'une matière : chapitres groupés par niveau, leçons dépliées.
// Tout s'édite en place — renommer, réordonner (position), ajouter, supprimer.
export default async function AdminSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: subject }, { data: chapters }] = await Promise.all([
    supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .maybeSingle<Subject>(),
    supabase
      .from('chapters')
      .select(
        // `has_revision_sheet` (colonne générée) et NON `revision_sheet` : la
        // migration 185 a retiré le droit de lire la fiche elle-même, y compris
        // à `authenticated` — un GRANT Postgres s'applique au RÔLE, donc être
        // admin côté application n'y change rien. Nommer la colonne interdite
        // dans cette jointure imbriquée faisait répondre « permission denied »
        // pour TOUT le lot, et l'écran affichait 0 chapitre sans un mot.
        // Cet écran n'a de toute façon besoin que de savoir si la fiche existe.
        'id, level, title, position, lessons(id, title, position, content, has_revision_sheet, studygram_url, quizzes(id))',
      )
      .eq('subject_id', id)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .returns<ChapterRow[]>(),
  ])
  if (!subject) notFound()

  // Niveaux dans l'ordre scolaire ; ceux de la matière d'abord, puis ceux qui
  // auraient déjà des chapitres hors liste (données historiques).
  const levels = [...GRADE_LEVELS].filter(
    (l) =>
      subject.levels.includes(l) ||
      (chapters ?? []).some((c) => c.level === l),
  )

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {subject.icon}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">{subject.name}</h1>
          <p className="text-sm text-muted-foreground">
            Chapitres et leçons par niveau — clique sur une leçon pour éditer
            son contenu.
          </p>
        </div>
      </header>

      {levels.map((level) => {
        const levelChapters = (chapters ?? []).filter((c) => c.level === level)
        return (
          <section key={level} className="space-y-3">
            <h2 className="font-heading text-lg font-semibold">{level}</h2>

            {levelChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                {/* Renommer / réordonner le chapitre */}
                <div className="flex items-center gap-2">
                  <form
                    action={updateChapter}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <input type="hidden" name="id" value={chapter.id} />
                    <Input
                      name="position"
                      type="number"
                      min={1}
                      defaultValue={chapter.position}
                      aria-label="Position du chapitre"
                      className="w-16 shrink-0 text-center"
                    />
                    <Input
                      name="title"
                      defaultValue={chapter.title}
                      aria-label="Titre du chapitre"
                      required
                      className="min-w-0 flex-1 font-medium"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      aria-label="Enregistrer le chapitre"
                      title="Enregistrer"
                    >
                      <Check className="size-4" />
                    </Button>
                  </form>
                  {chapter.lessons.length === 0 ? (
                    <form action={deleteChapter}>
                      <input type="hidden" name="id" value={chapter.id} />
                      <ConfirmSubmit
                        message={`Supprimer le chapitre « ${chapter.title} » ?`}
                        label="Supprimer le chapitre"
                      />
                    </form>
                  ) : null}
                </div>

                {/* Leçons du chapitre */}
                <ul className="mt-3 space-y-1">
                  {chapter.lessons.map((lesson) => {
                    const filled = [
                      lesson.content,
                      lesson.has_revision_sheet ? 'fiche' : null,
                      lesson.studygram_url,
                      lesson.quizzes.length > 0 ? 'quiz' : null,
                    ].filter(Boolean).length
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/60"
                      >
                        <FileText
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Link
                          href={`/admin/lecon/${lesson.id}`}
                          className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                        >
                          {lesson.position}. {lesson.title}
                        </Link>
                        <span
                          className="shrink-0 text-xs tabular-nums text-muted-foreground"
                          title="Supports remplis (cours, fiche, studygram, quiz)"
                        >
                          {filled}/4
                        </span>
                        <form action={deleteLesson}>
                          <input type="hidden" name="id" value={lesson.id} />
                          <ConfirmSubmit
                            message={`Supprimer la leçon « ${lesson.title} » et son quiz ?`}
                            label="Supprimer la leçon"
                          />
                        </form>
                      </li>
                    )
                  })}
                </ul>

                {/* Ajouter une leçon */}
                <form
                  action={createLesson}
                  className="mt-2 flex items-center gap-2"
                >
                  <input type="hidden" name="chapter_id" value={chapter.id} />
                  <Input
                    name="title"
                    placeholder="Nouvelle leçon…"
                    aria-label="Titre de la nouvelle leçon"
                    required
                    className="min-w-0 flex-1"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    <Plus className="size-4" /> Leçon
                  </Button>
                </form>
              </div>
            ))}

            {/* Ajouter un chapitre à ce niveau */}
            <form
              action={createChapter}
              className="flex items-center gap-2 rounded-2xl border border-dashed p-3"
            >
              <input type="hidden" name="subject_id" value={subject.id} />
              <input type="hidden" name="level" value={level} />
              <Input
                name="title"
                placeholder={`Nouveau chapitre de ${level}…`}
                aria-label={`Titre du nouveau chapitre de ${level}`}
                required
                className="min-w-0 flex-1"
              />
              <Button type="submit" variant="outline" size="sm">
                <Plus className="size-4" /> Chapitre
              </Button>
            </form>
          </section>
        )
      })}
    </div>
  )
}
