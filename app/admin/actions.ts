'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

// Server actions de l'espace admin (/admin). Double garde : vérification
// is_admin ici (message d'erreur propre) + politiques RLS de la migration 028
// (sécurité réelle — le serveur n'a que la clé anon).

export type AdminResult = { saved: boolean; error?: string; id?: string }

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const NOT_ADMIN: AdminResult = { saved: false, error: 'Accès réservé.' }

async function adminClient(): Promise<SupabaseClient | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle<{ is_admin: boolean }>()
  return profile?.is_admin ? supabase : null
}

// Le catalogue est en cache serveur 5 min (lib/catalog.ts) : chaque écriture
// le purge pour que l'élève voie la modification immédiatement (updateTag =
// expiration immédiate dans une Server Action, recommandé par Next 16).
function bustCatalog() {
  updateTag('catalog')
  revalidatePath('/reviser')
  revalidatePath('/admin')
}

const text = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

// -----------------------------------------------------------------------------
// Structure : chapitres et leçons (formulaires de /admin/matiere/[id])
// -----------------------------------------------------------------------------

export async function createChapter(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const subjectId = text(formData.get('subject_id'), 40)
  const level = text(formData.get('level'), 8)
  const title = text(formData.get('title'), 160)
  if (!UUID_RE.test(subjectId) || !level || !title) return

  const { count } = await supabase
    .from('chapters')
    .select('id', { count: 'exact', head: true })
    .eq('subject_id', subjectId)
    .eq('level', level)

  await supabase.from('chapters').insert({
    subject_id: subjectId,
    level,
    title,
    position: (count ?? 0) + 1,
  })
  bustCatalog()
}

export async function updateChapter(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const id = text(formData.get('id'), 40)
  const title = text(formData.get('title'), 160)
  const position = Number(formData.get('position'))
  if (!UUID_RE.test(id) || !title) return

  await supabase
    .from('chapters')
    .update({
      title,
      position: Number.isFinite(position) ? Math.max(1, Math.round(position)) : 1,
    })
    .eq('id', id)
  bustCatalog()
}

// Refuse si le chapitre contient encore des leçons : on ne perd pas de
// contenu par cascade silencieuse.
export async function deleteChapter(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const id = text(formData.get('id'), 40)
  if (!UUID_RE.test(id)) return

  const { count } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('chapter_id', id)
  if ((count ?? 0) > 0) return

  await supabase.from('chapters').delete().eq('id', id)
  bustCatalog()
}

export async function createLesson(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const chapterId = text(formData.get('chapter_id'), 40)
  const title = text(formData.get('title'), 160)
  if (!UUID_RE.test(chapterId) || !title) return

  const { count } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('chapter_id', chapterId)

  const { data: created } = await supabase
    .from('lessons')
    .insert({ chapter_id: chapterId, title, position: (count ?? 0) + 1 })
    .select('id')
    .single<{ id: string }>()
  bustCatalog()

  // Direction l'éditeur : on crée une leçon pour la remplir tout de suite.
  if (created) redirect(`/admin/lecon/${created.id}`)
}

// Supprime la leçon, son quiz (FK en SET NULL : sans ça le quiz deviendrait
// orphelin) et, par cascade, les questions du quiz.
export async function deleteLesson(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const id = text(formData.get('id'), 40)
  if (!UUID_RE.test(id)) return

  await supabase.from('quizzes').delete().eq('lesson_id', id)
  await supabase.from('lessons').delete().eq('id', id)
  bustCatalog()
}

// -----------------------------------------------------------------------------
// Contenu d'une leçon : les 3 supports texte (éditeur /admin/lecon/[id])
// -----------------------------------------------------------------------------

export async function saveLesson(
  lessonId: string,
  input: {
    title: string
    content: string
    revision_sheet: string
    studygram_url: string
  },
): Promise<AdminResult> {
  const supabase = await adminClient()
  if (!supabase) return NOT_ADMIN
  if (!UUID_RE.test(String(lessonId))) return { saved: false, error: 'Leçon inconnue.' }

  const title = String(input.title ?? '').trim().slice(0, 160)
  if (!title) return { saved: false, error: 'Le titre est obligatoire.' }

  const clean = (v: unknown, max: number) => {
    const s = String(v ?? '').trim().slice(0, max)
    return s === '' ? null : s
  }

  const { error } = await supabase
    .from('lessons')
    .update({
      title,
      content: clean(input.content, 40_000),
      revision_sheet: clean(input.revision_sheet, 40_000),
      studygram_url: clean(input.studygram_url, 2_000),
    })
    .eq('id', lessonId)

  if (error) return { saved: false, error: error.message }
  bustCatalog()
  return { saved: true }
}

// -----------------------------------------------------------------------------
// Quiz de la leçon : métadonnées + questions
// -----------------------------------------------------------------------------

export async function createQuizForLesson(
  lessonId: string,
): Promise<AdminResult> {
  const supabase = await adminClient()
  if (!supabase) return NOT_ADMIN
  if (!UUID_RE.test(String(lessonId))) return { saved: false, error: 'Leçon inconnue.' }

  // Contexte pour remplir les colonnes historiques de quizzes (subject,
  // grade_level, chapter en texte).
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, chapters!inner(title, level, subjects!inner(name))')
    .eq('id', lessonId)
    .maybeSingle<{
      title: string
      chapters: { title: string; level: string; subjects: { name: string } }
    }>()
  if (!lesson) return { saved: false, error: 'Leçon introuvable.' }

  const { data: created, error } = await supabase
    .from('quizzes')
    .insert({
      title: `Quiz — ${lesson.title}`.slice(0, 160),
      subject: lesson.chapters.subjects.name,
      grade_level: lesson.chapters.level,
      chapter: lesson.chapters.title,
      is_free: true,
      lesson_id: lessonId,
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !created) return { saved: false, error: error?.message }
  bustCatalog()
  return { saved: true, id: created.id }
}

export async function saveQuizMeta(
  quizId: string,
  input: { title: string; is_free: boolean },
): Promise<AdminResult> {
  const supabase = await adminClient()
  if (!supabase) return NOT_ADMIN
  if (!UUID_RE.test(String(quizId))) return { saved: false, error: 'Quiz inconnu.' }

  const title = String(input.title ?? '').trim().slice(0, 160)
  if (!title) return { saved: false, error: 'Le titre est obligatoire.' }

  const { error } = await supabase
    .from('quizzes')
    .update({ title, is_free: input.is_free === true })
    .eq('id', quizId)

  if (error) return { saved: false, error: error.message }
  bustCatalog()
  return { saved: true }
}

export type QuestionInput = {
  id?: string | null
  quiz_id: string
  question: string
  kind: 'mcq' | 'true_false'
  options: string[]
  correct_index: number
  explanation: string
  position: number
}

// Upsert d'une question (création si id absent). Renvoie l'id pour que
// l'éditeur remplace sa carte « brouillon » par la version enregistrée.
export async function saveQuestion(input: QuestionInput): Promise<AdminResult> {
  const supabase = await adminClient()
  if (!supabase) return NOT_ADMIN
  if (!UUID_RE.test(String(input.quiz_id))) {
    return { saved: false, error: 'Quiz inconnu.' }
  }

  const kind = input.kind === 'true_false' ? 'true_false' : 'mcq'
  const options = (
    kind === 'true_false'
      ? ['Vrai', 'Faux']
      : (Array.isArray(input.options) ? input.options : [])
          .map((o) => String(o ?? '').trim().slice(0, 300))
          .filter((o) => o !== '')
  ).slice(0, 6)
  const question = String(input.question ?? '').trim().slice(0, 1_000)
  const explanation = String(input.explanation ?? '').trim().slice(0, 2_000)
  const correctIndex = Math.round(Number(input.correct_index))

  if (!question) return { saved: false, error: 'La question est vide.' }
  if (kind === 'mcq' && options.length < 2) {
    return { saved: false, error: 'Il faut au moins 2 réponses.' }
  }
  if (!(correctIndex >= 0 && correctIndex < options.length)) {
    return { saved: false, error: 'Coche la bonne réponse.' }
  }

  const row = {
    quiz_id: input.quiz_id,
    question,
    kind,
    options,
    correct_index: correctIndex,
    explanation: explanation === '' ? null : explanation,
    position: Number.isFinite(Number(input.position))
      ? Math.max(1, Math.round(Number(input.position)))
      : 1,
  }

  if (input.id && UUID_RE.test(String(input.id))) {
    const { error } = await supabase
      .from('quiz_questions')
      .update(row)
      .eq('id', input.id)
    if (error) return { saved: false, error: error.message }
    return { saved: true, id: String(input.id) }
  }

  const { data: created, error } = await supabase
    .from('quiz_questions')
    .insert(row)
    .select('id')
    .single<{ id: string }>()
  if (error || !created) return { saved: false, error: error?.message }
  return { saved: true, id: created.id }
}

export async function deleteQuestion(questionId: string): Promise<AdminResult> {
  const supabase = await adminClient()
  if (!supabase) return NOT_ADMIN
  if (!UUID_RE.test(String(questionId))) {
    return { saved: false, error: 'Question inconnue.' }
  }

  const { error } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', questionId)
  if (error) return { saved: false, error: error.message }
  return { saved: true }
}

// -----------------------------------------------------------------------------
// Espace parents : programme de vidéos du coach (formulaires de /admin/parents)
// -----------------------------------------------------------------------------

export async function createParentVideo(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const title = text(formData.get('title'), 160)
  const url = text(formData.get('url'), 2000)
  if (!title || !url) return

  const { count } = await supabase
    .from('parent_videos')
    .select('id', { count: 'exact', head: true })

  await supabase.from('parent_videos').insert({
    title,
    url,
    description: text(formData.get('description'), 500) || null,
    theme: text(formData.get('theme'), 60) || 'Méthode',
    duration: text(formData.get('duration'), 20) || null,
    position: (count ?? 0) + 1,
  })
  revalidatePath('/parents')
  revalidatePath('/admin/parents')
}

export async function updateParentVideo(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const id = text(formData.get('id'), 40)
  const title = text(formData.get('title'), 160)
  const url = text(formData.get('url'), 2000)
  if (!UUID_RE.test(id) || !title || !url) return

  const position = Number(formData.get('position'))
  await supabase
    .from('parent_videos')
    .update({
      title,
      url,
      description: text(formData.get('description'), 500) || null,
      theme: text(formData.get('theme'), 60) || 'Méthode',
      duration: text(formData.get('duration'), 20) || null,
      position: Number.isFinite(position) ? Math.max(1, Math.round(position)) : 1,
      published: formData.get('published') === 'on',
    })
    .eq('id', id)
  revalidatePath('/parents')
  revalidatePath('/admin/parents')
}

export async function deleteParentVideo(formData: FormData): Promise<void> {
  const supabase = await adminClient()
  if (!supabase) return

  const id = text(formData.get('id'), 40)
  if (!UUID_RE.test(id)) return

  await supabase.from('parent_videos').delete().eq('id', id)
  revalidatePath('/parents')
  revalidatePath('/admin/parents')
}
