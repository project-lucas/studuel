import Link from 'next/link'
import { ChevronRight, MonitorPlay } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Accueil admin : les matières du catalogue, avec le volume de contenu de
// chacune. Cliquer ouvre la structure (chapitres → leçons) de la matière.
export default async function AdminHomePage() {
  const supabase = await createClient()

  const [{ data: subjects }, { data: chapters }] = await Promise.all([
    supabase.from('subjects').select('*').order('name').returns<Subject[]>(),
    supabase
      .from('chapters')
      .select('id, subject_id, lessons(id)')
      .returns<{ id: string; subject_id: string; lessons: { id: string }[] }[]>(),
  ])

  const counts = new Map<string, { chapters: number; lessons: number }>()
  for (const c of chapters ?? []) {
    const entry = counts.get(c.subject_id) ?? { chapters: 0, lessons: 0 }
    entry.chapters += 1
    entry.lessons += c.lessons?.length ?? 0
    counts.set(c.subject_id, entry)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">Contenu pédagogique</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisis une matière pour éditer ses chapitres, leçons, fiches et quiz.
          Les modifications sont visibles immédiatement par les élèves.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {(subjects ?? []).map((subject) => {
          const count = counts.get(subject.id) ?? { chapters: 0, lessons: 0 }
          return (
            <li key={subject.id}>
              <Link
                href={`/admin/matiere/${subject.id}`}
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
              >
                <span className="text-2xl" aria-hidden="true">
                  {subject.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-heading block truncate font-semibold">
                    {subject.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {count.chapters} chapitre{count.chapters > 1 ? 's' : ''} ·{' '}
                    {count.lessons} leçon{count.lessons > 1 ? 's' : ''} ·{' '}
                    {subject.levels.join(', ')}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          )
        })}
      </ul>

      {(subjects ?? []).length === 0 ? (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Aucune matière — exécute d’abord les migrations du catalogue (008).
        </p>
      ) : null}

      {/* Espace parents : le programme de vidéos du coach (migration 029). */}
      <Link
        href="/admin/parents"
        className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
      >
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
          <MonitorPlay className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block font-semibold">Programme parents</span>
          <span className="block text-xs text-muted-foreground">
            Les vidéos du coach visibles sur l’espace parents
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </div>
  )
}
