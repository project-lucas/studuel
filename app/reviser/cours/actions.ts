'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  canMoveChapter,
  emptyQuestionContent,
  gradeLibre,
  gradeQcm,
  gradeTrous,
  gradeVraiFaux,
  isQuestionType,
  normalizeCourseColor,
  normalizeCourseIcon,
  normalizeDescription,
  normalizeQuestionContent,
  normalizeTitle,
  type CourseChapter,
  type LibreContent,
  type QcmContent,
  type TrousContent,
  type VraiFauxContent,
} from '@/lib/carnet-cours'

// « Mon carnet » → cours façon Wooflash (migration 186). CRUD des cours,
// chapitres, questions + sessions/tentatives de révision. Accès direct sous
// RLS owner-only ; chaque mutation revérifie la propriété du cours côté
// serveur (défense en profondeur, en plus des policies).

type Ok = { ok: boolean }
type OkId = { ok: boolean; id: string | null }

const fail: OkId = { ok: false, id: null }

async function requireUserId(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Vérifie que `courseId` appartient à `userId` (les policies le garantissent
// déjà, mais on refuse tôt et explicitement).
async function ownsCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('carnet_courses')
    .select('id')
    .eq('id', courseId)
    .eq('owner_id', userId)
    .maybeSingle()
  return data !== null
}

const refresh = (courseId?: string) => {
  revalidatePath('/reviser')
  if (courseId) revalidatePath(`/reviser/cours/${courseId}`)
}

// ------------------------------------------------------------------- cours ---

export async function createCourse(): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId) return fail

  const { data, error } = await supabase
    .from('carnet_courses')
    .insert({ owner_id: userId, title: 'Nouveau cours' })
    .select('id')
    .single()
  if (error) {
    console.error('[carnet-cours] création du cours impossible:', error.message)
    return fail
  }
  refresh()
  return { ok: true, id: String(data.id) }
}

export async function updateCourse(
  id: string,
  patch: {
    title?: string
    description?: string
    icon?: string
    color?: string
  },
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof id !== 'string') return { ok: false }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if ('title' in patch) update.title = normalizeTitle(patch.title)
  if ('description' in patch) {
    update.description = normalizeDescription(patch.description)
  }
  if ('icon' in patch) update.icon = normalizeCourseIcon(patch.icon)
  if ('color' in patch) update.color = normalizeCourseColor(patch.color)

  const { error } = await supabase
    .from('carnet_courses')
    .update(update)
    .eq('id', id)
    .eq('owner_id', userId)
  if (error) {
    console.error('[carnet-cours] mise à jour du cours impossible:', error.message)
    return { ok: false }
  }
  refresh(id)
  return { ok: true }
}

export async function deleteCourse(id: string): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof id !== 'string') return { ok: false }

  const { error } = await supabase
    .from('carnet_courses')
    .delete()
    .eq('id', id)
    .eq('owner_id', userId)
  if (error) {
    console.error('[carnet-cours] suppression du cours impossible:', error.message)
    return { ok: false }
  }
  refresh()
  return { ok: true }
}

// --------------------------------------------------------------- chapitres ---

// Prochaine position libre dans un conteneur (fin de liste).
async function nextPosition(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: 'carnet_chapters' | 'carnet_questions',
  courseId: string,
  parentColumn: 'parent_chapter_id' | 'chapter_id',
  parentId: string | null,
): Promise<number> {
  let query = supabase
    .from(table)
    .select('position')
    .eq('course_id', courseId)
    .order('position', { ascending: false })
    .limit(1)
  query = parentId === null
    ? query.is(parentColumn, null)
    : query.eq(parentColumn, parentId)
  const { data } = await query
  return data && data.length > 0 ? Number(data[0].position) + 1 : 0
}

export async function createChapter(
  courseId: string,
  parentChapterId: string | null,
): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return fail
  if (!(await ownsCourse(supabase, userId, courseId))) return fail

  const position = await nextPosition(
    supabase,
    'carnet_chapters',
    courseId,
    'parent_chapter_id',
    parentChapterId,
  )
  const { data, error } = await supabase
    .from('carnet_chapters')
    .insert({
      course_id: courseId,
      parent_chapter_id: parentChapterId,
      title: 'Nouveau chapitre',
      position,
    })
    .select('id')
    .single()
  if (error) {
    console.error('[carnet-cours] création du chapitre impossible:', error.message)
    return fail
  }
  refresh(courseId)
  return { ok: true, id: String(data.id) }
}

export async function renameChapter(
  courseId: string,
  chapterId: string,
  title: string,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof chapterId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { error } = await supabase
    .from('carnet_chapters')
    .update({ title: normalizeTitle(title, 'Nouveau chapitre') })
    .eq('id', chapterId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] renommage du chapitre impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

// Déplace un chapitre sous un autre parent (null = racine), avec validation
// anti-cycle et de profondeur via la logique pure.
export async function moveChapter(
  courseId: string,
  chapterId: string,
  newParentId: string | null,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof chapterId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { data: rows } = await supabase
    .from('carnet_chapters')
    .select('id, parent_chapter_id, title, position')
    .eq('course_id', courseId)
  const chapters: CourseChapter[] = (rows ?? []).map((r) => ({
    id: String(r.id),
    parentChapterId: r.parent_chapter_id ? String(r.parent_chapter_id) : null,
    title: String(r.title),
    position: Number(r.position),
  }))
  if (!canMoveChapter(chapters, chapterId, newParentId)) return { ok: false }

  const position = await nextPosition(
    supabase,
    'carnet_chapters',
    courseId,
    'parent_chapter_id',
    newParentId,
  )
  const { error } = await supabase
    .from('carnet_chapters')
    .update({ parent_chapter_id: newParentId, position })
    .eq('id', chapterId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] déplacement du chapitre impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

// Duplique un chapitre : son sous-arbre complet (sous-chapitres + questions).
export async function duplicateChapter(
  courseId: string,
  chapterId: string,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof chapterId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const [{ data: chapterRows }, { data: questionRows }] = await Promise.all([
    supabase
      .from('carnet_chapters')
      .select('id, parent_chapter_id, title, position')
      .eq('course_id', courseId),
    supabase
      .from('carnet_questions')
      .select('id, chapter_id, type, position, content')
      .eq('course_id', courseId),
  ])
  const chapters = chapterRows ?? []
  const source = chapters.find((c) => String(c.id) === chapterId)
  if (!source) return { ok: false }

  // Sous-arbre du chapitre source (BFS).
  const subtreeIds = new Set<string>([chapterId])
  let frontier = [chapterId]
  while (frontier.length > 0) {
    const next: string[] = []
    for (const c of chapters) {
      const parent = c.parent_chapter_id ? String(c.parent_chapter_id) : null
      if (parent && frontier.includes(parent) && !subtreeIds.has(String(c.id))) {
        subtreeIds.add(String(c.id))
        next.push(String(c.id))
      }
    }
    frontier = next
  }

  // Copie du chapitre racine puis, niveau par niveau, de ses descendants.
  const position = await nextPosition(
    supabase,
    'carnet_chapters',
    courseId,
    'parent_chapter_id',
    source.parent_chapter_id ? String(source.parent_chapter_id) : null,
  )
  const { data: rootCopy, error: rootErr } = await supabase
    .from('carnet_chapters')
    .insert({
      course_id: courseId,
      parent_chapter_id: source.parent_chapter_id,
      title: `${String(source.title)} (copie)`.slice(0, 120),
      position,
    })
    .select('id')
    .single()
  if (rootErr || !rootCopy) {
    console.error('[carnet-cours] duplication impossible:', rootErr?.message)
    return { ok: false }
  }

  // ancien id → nouvel id
  const idMap = new Map<string, string>([[chapterId, String(rootCopy.id)]])
  let level = [chapterId]
  while (level.length > 0) {
    const children = chapters.filter((c) => {
      const parent = c.parent_chapter_id ? String(c.parent_chapter_id) : null
      return parent !== null && level.includes(parent)
    })
    for (const child of children) {
      const parentNewId = idMap.get(String(child.parent_chapter_id))
      if (!parentNewId) continue
      const { data: copy } = await supabase
        .from('carnet_chapters')
        .insert({
          course_id: courseId,
          parent_chapter_id: parentNewId,
          title: String(child.title),
          position: Number(child.position),
        })
        .select('id')
        .single()
      if (copy) idMap.set(String(child.id), String(copy.id))
    }
    level = children.map((c) => String(c.id))
  }

  // Copie des questions du sous-arbre.
  const toCopy = (questionRows ?? []).filter(
    (q) => q.chapter_id && subtreeIds.has(String(q.chapter_id)),
  )
  if (toCopy.length > 0) {
    const inserts = toCopy.flatMap((q) => {
      const newChapterId = idMap.get(String(q.chapter_id))
      if (!newChapterId) return []
      return [
        {
          course_id: courseId,
          chapter_id: newChapterId,
          type: q.type,
          position: Number(q.position),
          content: q.content,
        },
      ]
    })
    const { error } = await supabase.from('carnet_questions').insert(inserts)
    if (error) {
      console.error('[carnet-cours] copie des questions impossible:', error.message)
    }
  }
  refresh(courseId)
  return { ok: true }
}

// Supprime un chapitre — ses sous-chapitres et questions partent en cascade
// (FK ON DELETE CASCADE, migration 186).
export async function deleteChapter(
  courseId: string,
  chapterId: string,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof chapterId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { error } = await supabase
    .from('carnet_chapters')
    .delete()
    .eq('id', chapterId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] suppression du chapitre impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

// Réordonne les chapitres d'un conteneur : positions = ordre du tableau reçu.
export async function reorderChapters(
  courseId: string,
  orderedIds: string[],
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || !Array.isArray(orderedIds)) return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i]
    if (typeof id !== 'string') continue
    await supabase
      .from('carnet_chapters')
      .update({ position: i })
      .eq('id', id)
      .eq('course_id', courseId)
  }
  refresh(courseId)
  return { ok: true }
}

// --------------------------------------------------------------- questions ---

export async function createQuestion(
  courseId: string,
  chapterId: string | null,
  type: string,
): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string' || !isQuestionType(type)) {
    return fail
  }
  if (!(await ownsCourse(supabase, userId, courseId))) return fail

  const position = await nextPosition(
    supabase,
    'carnet_questions',
    courseId,
    'chapter_id',
    chapterId,
  )
  const { data, error } = await supabase
    .from('carnet_questions')
    .insert({
      course_id: courseId,
      chapter_id: chapterId,
      type,
      position,
      content: emptyQuestionContent(type),
    })
    .select('id')
    .single()
  if (error) {
    console.error('[carnet-cours] création de la question impossible:', error.message)
    return fail
  }
  refresh(courseId)
  return { ok: true, id: String(data.id) }
}

// Enregistre le contenu (normalisé) d'une question ; peut changer son type.
export async function saveQuestion(
  courseId: string,
  questionId: string,
  type: string,
  content: unknown,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string' || !isQuestionType(type)) {
    return { ok: false }
  }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { error } = await supabase
    .from('carnet_questions')
    .update({
      type,
      content: normalizeQuestionContent(type, content),
      updated_at: new Date().toISOString(),
    })
    .eq('id', questionId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] enregistrement de la question impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

export async function moveQuestion(
  courseId: string,
  questionId: string,
  chapterId: string | null,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  // Le chapitre cible doit appartenir au même cours.
  if (chapterId !== null) {
    const { data } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!data) return { ok: false }
  }

  const position = await nextPosition(
    supabase,
    'carnet_questions',
    courseId,
    'chapter_id',
    chapterId,
  )
  const { error } = await supabase
    .from('carnet_questions')
    .update({ chapter_id: chapterId, position })
    .eq('id', questionId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] déplacement de la question impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

export async function duplicateQuestion(
  courseId: string,
  questionId: string,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { data: source } = await supabase
    .from('carnet_questions')
    .select('chapter_id, type, content')
    .eq('id', questionId)
    .eq('course_id', courseId)
    .maybeSingle()
  if (!source) return { ok: false }

  const position = await nextPosition(
    supabase,
    'carnet_questions',
    courseId,
    'chapter_id',
    source.chapter_id ? String(source.chapter_id) : null,
  )
  const { error } = await supabase.from('carnet_questions').insert({
    course_id: courseId,
    chapter_id: source.chapter_id,
    type: source.type,
    position,
    content: source.content,
  })
  if (error) {
    console.error('[carnet-cours] duplication de la question impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

export async function deleteQuestion(
  courseId: string,
  questionId: string,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string') return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  const { error } = await supabase
    .from('carnet_questions')
    .delete()
    .eq('id', questionId)
    .eq('course_id', courseId)
  if (error) {
    console.error('[carnet-cours] suppression de la question impossible:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

// Réordonne les questions d'un conteneur (racine ou chapitre).
export async function reorderQuestions(
  courseId: string,
  orderedIds: string[],
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || !Array.isArray(orderedIds)) return { ok: false }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i]
    if (typeof id !== 'string') continue
    await supabase
      .from('carnet_questions')
      .update({ position: i })
      .eq('id', id)
      .eq('course_id', courseId)
  }
  refresh(courseId)
  return { ok: true }
}

// ---------------------------------------------------------------- révision ---

export async function startReviewSession(
  courseId: string,
  chapterId: string | null,
): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return fail
  if (!(await ownsCourse(supabase, userId, courseId))) return fail

  // Le chapitre révisé (venu de l'URL) doit appartenir au cours.
  if (chapterId !== null) {
    const { data: chapter } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!chapter) return fail
  }

  const { data, error } = await supabase
    .from('carnet_review_sessions')
    .insert({ user_id: userId, course_id: courseId, chapter_id: chapterId })
    .select('id')
    .single()
  if (error) {
    console.error('[carnet-cours] ouverture de session impossible:', error.message)
    return fail
  }
  return { ok: true, id: String(data.id) }
}

export async function recordAttempt(
  sessionId: string | null,
  questionId: string,
  // Verdict côté client : seule source pour la flashcard (auto-évaluation) ;
  // tous les autres types sont RE-CORRIGÉS côté serveur.
  clientCorrect: boolean,
  givenAnswer: unknown,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string') return { ok: false }

  // La question doit appartenir à un cours de l'élève (défense en profondeur :
  // la policy des tentatives ne vérifie que user_id).
  const { data: question } = await supabase
    .from('carnet_questions')
    .select('id, course_id, type, content')
    .eq('id', questionId)
    .maybeSingle()
  if (!question || !isQuestionType(question.type)) return { ok: false }
  if (!(await ownsCourse(supabase, userId, String(question.course_id)))) {
    return { ok: false }
  }

  // La session éventuelle doit être à l'élève — sinon on enregistre hors
  // session plutôt que d'accrocher la tentative à la session d'un autre.
  let boundSessionId: string | null = null
  if (typeof sessionId === 'string' && sessionId.length > 0) {
    const { data: session } = await supabase
      .from('carnet_review_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle()
    if (session) boundSessionId = sessionId
  }

  // Correction côté serveur à partir de la réponse brute (le client peut
  // mentir sur son booléen, pas sur sa copie).
  const content = normalizeQuestionContent(question.type, question.content)
  const o = (givenAnswer ?? {}) as Record<string, unknown>
  let isCorrect: boolean
  if (question.type === 'qcm') {
    isCorrect = gradeQcm(
      content as QcmContent,
      Array.isArray(o.selected) ? o.selected.map(Number) : [],
    )
  } else if (question.type === 'vrai_faux') {
    isCorrect = gradeVraiFaux(content as VraiFauxContent, o.value === true)
  } else if (question.type === 'texte_a_trous') {
    isCorrect = gradeTrous(
      content as TrousContent,
      Array.isArray(o.values) ? o.values.map(String) : [],
    )
  } else if (question.type === 'reponse_libre') {
    isCorrect = gradeLibre(
      content as LibreContent,
      typeof o.value === 'string' ? o.value : '',
    )
  } else {
    isCorrect = clientCorrect === true
  }

  // Réponse brute bornée : au-delà de 2 000 caractères sérialisés, on ne
  // stocke rien (jamais un blob illimité, jamais un JSON tronqué invalide).
  const serialized = JSON.stringify(givenAnswer ?? null)
  const boundedAnswer =
    serialized !== undefined && serialized.length <= 2_000
      ? (givenAnswer ?? null)
      : null

  const { error } = await supabase.from('carnet_review_attempts').insert({
    user_id: userId,
    session_id: boundSessionId,
    question_id: questionId,
    is_correct: isCorrect,
    given_answer: boundedAnswer,
  })
  if (error) {
    console.error('[carnet-cours] enregistrement de la tentative impossible:', error.message)
    return { ok: false }
  }
  return { ok: true }
}

export async function endReviewSession(sessionId: string): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof sessionId !== 'string') return { ok: false }

  const { error } = await supabase
    .from('carnet_review_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', userId)
  if (error) {
    console.error('[carnet-cours] clôture de session impossible:', error.message)
    return { ok: false }
  }
  return { ok: true }
}
