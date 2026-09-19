import { notFound, redirect } from 'next/navigation'
import CourseScreen from '@/components/carnet/CourseScreen'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fetchPlans } from '@/lib/carnet/planning-server'
import { toDayKey } from '@/lib/streak'
import { visionDisponible } from '@/lib/coach/ia-vision'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
  questionSummary,
  type CourseChapter,
} from '@/lib/carnet-cours'
import type { CourseQuestionRow } from '@/components/carnet/types'
import { normaliserOrigine } from '@/lib/carnet/origine'

export const metadata = { title: 'Mon carnet — Studuel' }
export const dynamic = 'force-dynamic'

// Page d'un cours du carnet : un seul bloc — titre et icône, chapitres,
// questions (`CourseScreen`, repris de zéro le 10/09/2026). Elle lit ce que ce
// bloc montre : le cours (RLS owner-only), ses chapitres, le résumé de ses
// questions, les étiquettes de l'élève pour la feuille « Réviser » — et ce
// que la feuille « Réglages de révision » règle (plafonds, tolérance, date du
// contrôle, matière — 315/316) avec les rendez-vous du planning (353).
// Les tentatives (statistiques) ne sont plus chargées : l'écran ne les
// affiche plus.
export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('carnet_courses')
    .select(
      'id, title, description, icon, color, new_per_day, reviews_per_day, spell_tolerance, exam_on, subject_id',
    )
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!course) notFound()

  const [
    { data: chapterRows },
    { data: questionRows },
    { data: tagRows },
    { data: subjectRows },
    plans,
  ] = await Promise.all([
    supabase
      .from('carnet_chapters')
      .select('id, parent_chapter_id, title, position')
      .eq('course_id', id),
    lireQuestions(supabase, id),
    // Les étiquettes de l'élève (migration 316) : proposées comme portée de
    // session. Si la 316 n'est pas passée, la liste est vide et la feuille se
    // contente des chapitres.
    supabase
      .from('carnet_tags')
      .select('id, label')
      .eq('owner_id', user.id)
      .order('label')
      .limit(50),
    // Les matières du catalogue : rattacher un cours à l'une d'elles est ce
    // qui le fait sortir de l'île du carnet (réglages de révision).
    supabase.from('subjects').select('id, name').order('name').limit(60),
    // Les rendez-vous posés sur les chapitres de ce cours (migration 353).
    fetchPlans(supabase, user.id, id),
  ])

  const chapters: CourseChapter[] = (chapterRows ?? []).map((r) => ({
    id: String(r.id),
    parentChapterId: r.parent_chapter_id ? String(r.parent_chapter_id) : null,
    title: String(r.title ?? 'Nouveau chapitre'),
    position: Number(r.position ?? 0),
  }))

  // On ne transfère au client que le nécessaire à la liste : type, résumé,
  // complétude, origine — jamais le contenu complet de chaque question.
  const questions: CourseQuestionRow[] = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    const content = normalizeQuestionContent(r.type, r.content)
    return [
      {
        id: String(r.id),
        chapterId: r.chapter_id ? String(r.chapter_id) : null,
        type: r.type,
        position: Number(r.position ?? 0),
        summary: questionSummary(r.type, content),
        ready: isQuestionReady(r.type, content),
        origine: normaliserOrigine(r.source),
      },
    ]
  })

  // Cartes JOUABLES par chapitre : c'est le poids de chaque chapitre dans la
  // proposition de planning à rebours (les brouillons ne pèsent rien).
  const cartesParChapitre: Record<string, number> = {}
  for (const q of questions) {
    if (!q.ready || !q.chapterId) continue
    cartesParChapitre[q.chapterId] = (cartesParChapitre[q.chapterId] ?? 0) + 1
  }

  return (
    <CourseScreen
      course={{
        id: String(course.id),
        title: String(course.title ?? 'Sans titre'),
        description: course.description ? String(course.description) : null,
        icon: course.icon ? String(course.icon) : null,
        color: course.color ? String(course.color) : null,
      }}
      chapters={chapters}
      questions={questions}
      etiquettes={(tagRows ?? []).map((t) => ({
        id: String(t.id),
        label: String(t.label),
      }))}
      photoDisponible={visionDisponible()}
      plans={plans}
      cartesParChapitre={cartesParChapitre}
      today={toDayKey(new Date())}
      matieres={(subjectRows ?? []).map((m) => ({
        id: String(m.id),
        name: String(m.name),
      }))}
      reglages={{
        id: String(course.id),
        // Les colonnes des 315/316 peuvent manquer : on retombe sur les mêmes
        // défauts que le SQL plutôt que sur NaN.
        newPerDay: Number(course.new_per_day ?? 15),
        reviewsPerDay: Number(course.reviews_per_day ?? 80),
        tolerance: course.spell_tolerance
          ? String(course.spell_tolerance)
          : null,
        examOn: course.exam_on ? String(course.exam_on) : null,
        subjectId: course.subject_id ? String(course.subject_id) : null,
      }}
    />
  )
}

type QuestionRow = {
  id: string
  chapter_id: string | null
  type: string
  position: number
  content: unknown
  source?: unknown
}

// Les questions AVEC leur origine (357). Tant que la 357 dort, Postgres refuse
// la requête entière (42703) : on relit sans la colonne, l'origine vaut null.
async function lireQuestions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
): Promise<{ data: QuestionRow[] | null }> {
  const base = 'id, chapter_id, type, position, content'
  const complet = await supabase
    .from('carnet_questions')
    .select(`${base}, source`)
    .eq('course_id', courseId)
    .returns<QuestionRow[]>()
  if (!complet.error) return { data: complet.data }

  const reduit = await supabase
    .from('carnet_questions')
    .select(base)
    .eq('course_id', courseId)
    .returns<QuestionRow[]>()
  return { data: reduit.data }
}
