'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  canMoveChapter,
  emptyQuestionContent,
  gradeQcm,
  gradeAppariement,
  gradeOrdre,
  gradeNumerique,
  gradeVraiFaux,
  isQuestionType,
  normalizeCourseColor,
  normalizeCourseIcon,
  normalizeDescription,
  normalizeQuestionContent,
  normalizeTitle,
  type AppariementContent,
  type CourseChapter,
  type NumeriqueContent,
  type OrdreContent,
  type LibreContent,
  type QcmContent,
  type TrousContent,
  type VraiFauxContent,
} from '@/lib/carnet-cours'
import {
  etatInitial,
  isVerdict,
  planifier,
  verdictAutomatique,
  vientDEtreAcquise,
  type Verdict,
} from '@/lib/carnet/planification'
import { chargerEtats, ecrireEtat } from '@/lib/carnet/etats-server'
import { nettoyerSaisie } from '@/lib/carnet/import-colle'
import { awardXp, walletTouch } from '@/lib/wallet-server'
import {
  comparerReponse,
  corrigerTrous,
  normalizeTolerance,
  type Tolerance,
} from '@/lib/carnet/correction'

// « Mon carnet » → cours façon Wooflash (migration 186). CRUD des cours,
// chapitres, questions + sessions/tentatives de révision. Accès direct sous
// RLS owner-only ; chaque mutation revérifie la propriété du cours côté
// serveur (défense en profondeur, en plus des policies).

type Ok = { ok: boolean }
type OkId = { ok: boolean; id: string | null }

/**
 * Borne d'un réordonnancement. `orderedIds` arrive du client et n'était pas
 * bornée : la limite de corps d'une Server Action étant de 1 Mo, un appel forgé
 * pouvait demander ~27 000 mises à jour PostgREST simultanées depuis le
 * serveur. Aucun cours réel n'approche ce chiffre.
 */
const MAX_REORDER = 500

/**
 * Les écritures parallèles ont-elles TOUTES réussi ? Les résultats du
 * `Promise.all` étaient jetés et `{ ok: true }` renvoyé quoi qu'il arrive : un
 * glisser-déposer raté laissait l'interface dans l'ordre optimiste jusqu'au
 * prochain chargement, qui « annulait » le geste sans explication.
 */
function allSucceeded(
  results: { error: { message: string } | null }[],
  label: string,
): boolean {
  const failed = results.filter((r) => r.error)
  if (failed.length === 0) return true
  console.error(
    `[carnet-cours] ${label} : ${failed.length} écriture(s) en échec —`,
    failed[0].error?.message,
  )
  return false
}

const fail: OkId = { ok: false, id: null }

async function requireUserId(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string | null
}> {
  const supabase = await createClient()
  const user = await getCurrentUser()
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

/**
 * La tolérance orthographique réglée sur le cours (migration 315). Tant que la
 * migration n'est pas exécutée, la colonne est absente : on retombe sur
 * « normale » plutôt que de refuser la correction.
 */
async function courseTolerance(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
): Promise<Tolerance> {
  const { data, error } = await supabase
    .from('carnet_courses')
    .select('spell_tolerance')
    .eq('id', courseId)
    .maybeSingle()
  if (error || !data) return 'normale'
  return normalizeTolerance(data.spell_tolerance)
}

const refresh = (courseId?: string) => {
  revalidatePath('/reviser')
  if (courseId) revalidatePath(`/reviser/cours/${courseId}`)
}

// ------------------------------------------------------------------- cours ---

// La création demande désormais un nom (fini les « Nouveau cours » fantômes) —
// le repli reste là pour un appel sans titre (robustesse, pas un chemin d'UI).
export async function createCourse(title?: string): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId) return fail

  const { data, error } = await supabase
    .from('carnet_courses')
    .insert({ owner_id: userId, title: normalizeTitle(title, 'Nouveau cours') })
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

/**
 * Les réglages de RÉVISION d'un cours (migrations 315 et 316) : plafonds
 * quotidiens, tolérance orthographique, date du contrôle, matière et classe.
 *
 * Séparé d'`updateCourse`, qui ne touche qu'à l'allure (titre, icône, couleur) :
 * ce sont deux gestes différents, et mélanger les deux ferait qu'un changement
 * de couleur réécrirait les plafonds.
 */
export async function updateCourseReglages(
  id: string,
  patch: {
    newPerDay?: number
    reviewsPerDay?: number
    tolerance?: string
    examOn?: string | null
    subjectId?: string | null
    gradeLevel?: string | null
  },
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof id !== 'string') return { ok: false }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if ('newPerDay' in patch) {
    // Bornes = celles de la contrainte SQL. Les répéter ici n'est pas une
    // duplication inutile : un dépassement doit devenir une valeur SENSÉE, pas
    // une erreur 400 que l'écran traduirait en « échec » sans rien expliquer.
    update.new_per_day = Math.max(0, Math.min(200, Math.floor(Number(patch.newPerDay) || 0)))
  }
  if ('reviewsPerDay' in patch) {
    update.reviews_per_day = Math.max(
      0,
      Math.min(500, Math.floor(Number(patch.reviewsPerDay) || 0)),
    )
  }
  if ('tolerance' in patch) {
    update.spell_tolerance = normalizeTolerance(patch.tolerance)
  }
  if ('examOn' in patch) {
    // Une date au format 'YYYY-MM-DD' ou rien. On refuse tout le reste plutôt
    // que de laisser PostgreSQL trancher sur une chaîne fantaisiste.
    const brut = patch.examOn
    update.exam_on =
      typeof brut === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(brut) ? brut : null
  }
  if ('subjectId' in patch) {
    update.subject_id =
      typeof patch.subjectId === 'string' && patch.subjectId.length > 0
        ? patch.subjectId
        : null
  }
  if ('gradeLevel' in patch) {
    update.grade_level =
      typeof patch.gradeLevel === 'string' && patch.gradeLevel.length > 0
        ? patch.gradeLevel.slice(0, 40)
        : null
  }

  const { error } = await supabase
    .from('carnet_courses')
    .update(update)
    .eq('id', id)
    .eq('owner_id', userId)
  if (error) {
    console.error('[carnet-cours] réglages non enregistrés:', error.message)
    return { ok: false }
  }
  refresh(id)
  return { ok: true }
}

// ------------------------------------------------------------- étiquettes ---

/** Longueur maximale d'une étiquette — c'est un mot-clé, pas une phrase. */
const MAX_TAG_LEN = 30

/**
 * Crée une étiquette (ou retrouve celle qui porte déjà ce nom).
 *
 * Le doublon n'est PAS une erreur : un élève qui tape « bac » deux fois veut
 * la même étiquette, pas un message. L'index unique de la 316 le garantit en
 * base ; ici on retombe simplement dessus.
 */
export async function creerEtiquette(label: string): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId) return fail

  const propre = String(label ?? '')
    .trim()
    .slice(0, MAX_TAG_LEN)
  if (propre.length === 0) return fail

  const { data, error } = await supabase
    .from('carnet_tags')
    .insert({ owner_id: userId, label: propre })
    .select('id')
    .single()

  if (error) {
    // 23505 = violation d'unicité : l'étiquette existe déjà, on la rend.
    if (error.code === '23505') {
      const { data: existante } = await supabase
        .from('carnet_tags')
        .select('id')
        .eq('owner_id', userId)
        .ilike('label', propre)
        .maybeSingle()
      if (existante) return { ok: true, id: String(existante.id) }
    }
    console.error('[carnet-cours] étiquette non créée:', error.message)
    return fail
  }
  refresh()
  return { ok: true, id: String(data.id) }
}

/** Pose ou retire une étiquette sur une question. */
export async function basculerEtiquette(
  courseId: string,
  questionId: string,
  tagId: string,
  poser: boolean,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string' || typeof tagId !== 'string') {
    return { ok: false }
  }
  if (!(await ownsCourse(supabase, userId, courseId))) return { ok: false }

  // La question doit appartenir à CE cours, et l'étiquette à CET élève. Les
  // policies de la 316 vérifient déjà les deux ; on refuse tôt et clairement.
  const [{ data: question }, { data: tag }] = await Promise.all([
    supabase
      .from('carnet_questions')
      .select('id')
      .eq('id', questionId)
      .eq('course_id', courseId)
      .maybeSingle(),
    supabase
      .from('carnet_tags')
      .select('id')
      .eq('id', tagId)
      .eq('owner_id', userId)
      .maybeSingle(),
  ])
  if (!question || !tag) return { ok: false }

  const { error } = poser
    ? await supabase
        .from('carnet_question_tags')
        .upsert(
          { question_id: questionId, tag_id: tagId },
          { onConflict: 'question_id,tag_id' },
        )
    : await supabase
        .from('carnet_question_tags')
        .delete()
        .eq('question_id', questionId)
        .eq('tag_id', tagId)

  if (error) {
    console.error('[carnet-cours] étiquette non posée:', error.message)
    return { ok: false }
  }
  refresh(courseId)
  return { ok: true }
}

/** Supprime une étiquette (elle se détache de toutes ses questions). */
export async function supprimerEtiquette(tagId: string): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof tagId !== 'string') return { ok: false }

  const { error } = await supabase
    .from('carnet_tags')
    .delete()
    .eq('id', tagId)
    .eq('owner_id', userId)
  if (error) {
    console.error('[carnet-cours] étiquette non supprimée:', error.message)
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

  // Le parent doit appartenir AU MÊME cours. La policy ne contrôle que
  // `course_id` : sans ce test, un appel forgé accrochait son chapitre sous
  // celui d'un autre élève, qui l'emporterait en supprimant le sien.
  // `moveQuestion` fait déjà ce contrôle — on s'aligne.
  if (parentChapterId !== null) {
    const { data: parent } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', parentChapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!parent) return fail
  }

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
  // Une copie qui perd des morceaux ne doit pas se présenter comme réussie.
  let incomplet = false
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
      // Un sous-chapitre non copié emporte TOUTE sa descendance en silence :
      // on retient l'incident pour ne pas annoncer une copie complète.
      else incomplet = true
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
      incomplet = true
    }
  }
  refresh(courseId)
  // La copie existe mais lui manque des morceaux : le dire, plutôt que laisser
  // l'élève découvrir tout seul, plus tard, qu'il en manque.
  return { ok: !incomplet }
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

  if (orderedIds.length > MAX_REORDER) return { ok: false }

  // En parallèle : un glisser-déposer sur un cours de 20 chapitres faisait
  // autant d'allers-retours ATTENDUS un par un, soit plusieurs secondes de
  // latence pour un simple réordonnancement. Aucune contrainte d'unicité sur
  // `position` n'impose de les sérialiser.
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      typeof id === 'string'
        ? supabase
            .from('carnet_chapters')
            .update({ position: i })
            .eq('id', id)
            .eq('course_id', courseId)
        : Promise.resolve({ error: null }),
    ),
  )
  refresh(courseId)
  return { ok: allSucceeded(results, 'réordonnancement des chapitres') }
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

  // Même contrôle que dans `createChapter` et `moveQuestion` : le chapitre
  // d'accueil doit appartenir à CE cours.
  if (chapterId !== null) {
    const { data: chapter } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!chapter) return fail
  }

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

/**
 * Crée PLUSIEURS flashcards d'un coup (saisie en rafale ou import collé).
 *
 * C'est la porte d'entrée qui manquait au carnet : jusqu'ici une question = une
 * page = un aller-retour, ce qui rendait le remplissage si coûteux que la
 * plupart des cours restaient vides. Une seule requête d'insertion ici, quel
 * que soit le nombre de cartes.
 */
export async function creerCartesEnLot(
  courseId: string,
  chapterId: string | null,
  cartes: readonly { recto: string; verso: string }[],
): Promise<{ ok: boolean; created: number }> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return { ok: false, created: 0 }
  if (!(await ownsCourse(supabase, userId, courseId))) {
    return { ok: false, created: 0 }
  }

  // Le chapitre d'accueil doit appartenir À CE cours (même contrôle que
  // `createQuestion` : la policy ne vérifie que `course_id`).
  if (chapterId !== null) {
    const { data: chapter } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!chapter) return { ok: false, created: 0 }
  }

  // Le nettoyage est la MÊME logique pure que l'aperçu montré à l'élève : ce
  // qu'il a vu est exactement ce qui est écrit.
  const propres = nettoyerSaisie(Array.isArray(cartes) ? cartes : [])
  if (propres.length === 0) return { ok: false, created: 0 }

  let position = await nextPosition(
    supabase,
    'carnet_questions',
    courseId,
    'chapter_id',
    chapterId,
  )

  const inserts = propres.map((c) => ({
    course_id: courseId,
    chapter_id: chapterId,
    type: 'flashcard' as const,
    position: position++,
    content: normalizeQuestionContent('flashcard', {
      recto: c.recto,
      verso: c.verso,
      langue_recto: null,
      langue_verso: null,
    }),
  }))

  const { error } = await supabase.from('carnet_questions').insert(inserts)
  if (error) {
    console.error('[carnet-cours] création en lot impossible:', error.message)
    return { ok: false, created: 0 }
  }
  refresh(courseId)
  return { ok: true, created: inserts.length }
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

  if (orderedIds.length > MAX_REORDER) return { ok: false }

  // Même raison que `reorderChapters` : en parallèle, pas un par un.
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      typeof id === 'string'
        ? supabase
            .from('carnet_questions')
            .update({ position: i })
            .eq('id', id)
            .eq('course_id', courseId)
        : Promise.resolve({ error: null }),
    ),
  )
  refresh(courseId)
  return { ok: allSucceeded(results, 'réordonnancement des questions') }
}

// ---------------------------------------------------------------- révision ---

/** Borne de la file d'une session : au-delà, personne ne va au bout. */
const MAX_FILE = 500

export async function startReviewSession(
  courseId: string | null,
  chapterId: string | null,
  // La file décidée par le serveur au rendu de la page. Elle est ENREGISTRÉE :
  // c'est ce qui permet de rouvrir la session là où elle s'est arrêtée, au lieu
  // de recomposer une file différente (les échéances ayant bougé entre-temps)
  // et de renvoyer l'élève au début.
  queue: readonly string[] = [],
  options: unknown = null,
): Promise<OkId> {
  const { supabase, userId } = await requireUserId()
  if (!userId) return fail

  // La session transverse (« À revoir », tous cours confondus) n'a pas de
  // cours : depuis la 315 la colonne l'accepte.
  if (courseId !== null) {
    if (typeof courseId !== 'string') return fail
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
  }

  const file = Array.isArray(queue)
    ? queue.filter((id) => typeof id === 'string').slice(0, MAX_FILE)
    : []

  const { data, error } = await supabase
    .from('carnet_review_sessions')
    .insert({
      user_id: userId,
      course_id: courseId,
      chapter_id: courseId === null ? null : chapterId,
      queue: file,
      cursor_index: 0,
      correct_count: 0,
      options: options ?? null,
    })
    .select('id')
    .single()
  if (error) {
    console.error('[carnet-cours] ouverture de session impossible:', error.message)
    return fail
  }
  return { ok: true, id: String(data.id) }
}

/**
 * Enregistre l'avancement d'une session. Appelé après chaque réponse, sans
 * bloquer l'élève : c'est ce qui fait qu'une session fermée en cours de route
 * reprend au bon endroit au lieu de recommencer à zéro.
 */
export async function avancerSession(
  sessionId: string,
  cursorIndex: number,
  correctCount: number,
): Promise<Ok> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof sessionId !== 'string') return { ok: false }

  const curseur = Number.isFinite(cursorIndex)
    ? Math.max(0, Math.min(MAX_FILE, Math.floor(cursorIndex)))
    : 0
  const justes = Number.isFinite(correctCount)
    ? Math.max(0, Math.min(MAX_FILE, Math.floor(correctCount)))
    : 0

  const { error } = await supabase
    .from('carnet_review_sessions')
    .update({ cursor_index: curseur, correct_count: justes })
    .eq('id', sessionId)
    .eq('user_id', userId)
  if (error) {
    console.error('[carnet-cours] avancement de session impossible:', error.message)
    return { ok: false }
  }
  return { ok: true }
}

/**
 * Ce que le serveur rend après un passage sur une carte : le verdict retenu et
 * la prochaine échéance. L'écran s'en sert pour dire « revu dans 3 jours » —
 * sans quoi le nouveau moteur travaillerait sans que l'élève le voie jamais.
 */
export type AttemptResult = {
  ok: boolean
  verdict: Verdict | null
  /** Intervalle retenu, en jours (0 = revient dans la journée). */
  prochainJours: number
  /** L'orthographe exacte, quand la réponse était juste À LA FRAPPE PRÈS. */
  orthographe: string | null
  presque: boolean
  /** La carte vient de passer sangsue : elle est à reformuler. */
  sangsue: boolean
}

const ATTEMPT_FAIL: AttemptResult = {
  ok: false,
  verdict: null,
  prochainJours: 0,
  orthographe: null,
  presque: false,
  sangsue: false,
}

export async function recordAttempt(
  sessionId: string | null,
  questionId: string,
  // Verdict côté client : seule source pour la flashcard (auto-évaluation, où
  // l'élève choisit entre Encore / Difficile / Bien / Facile). Tous les autres
  // types sont RE-CORRIGÉS côté serveur et leur verdict en est DÉDUIT.
  clientVerdict: unknown,
  givenAnswer: unknown,
  // Les modes « entraînement » et « examen blanc » ne PLANIFIENT PAS : repasser
  // vingt fois ses cartes la veille d'un contrôle ne doit pas repousser leurs
  // révisions de six mois. La tentative, elle, est toujours enregistrée.
  planifie = true,
): Promise<AttemptResult> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof questionId !== 'string') return ATTEMPT_FAIL

  // La question doit appartenir à un cours de l'élève (défense en profondeur :
  // la policy des tentatives ne vérifie que user_id). On récupère au passage la
  // tolérance orthographique du cours : elle se règle par cours, en langues on
  // la veut serrée, en histoire large.
  const { data: question } = await supabase
    .from('carnet_questions')
    .select('id, course_id, type, content')
    .eq('id', questionId)
    .maybeSingle()
  if (!question || !isQuestionType(question.type)) return ATTEMPT_FAIL
  const courseId = String(question.course_id)
  if (!(await ownsCourse(supabase, userId, courseId))) return ATTEMPT_FAIL

  const tolerance = await courseTolerance(supabase, courseId)

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
  // mentir sur son verdict, pas sur sa copie).
  const content = normalizeQuestionContent(question.type, question.content)
  const o = (givenAnswer ?? {}) as Record<string, unknown>
  let isCorrect: boolean
  let presque = false
  let orthographe: string | null = null
  let verdict: Verdict

  if (question.type === 'flashcard') {
    // LE SEUL type auto-évalué : personne ne peut corriger « te rappelais-tu
    // ce mot ? » à la place de l'élève. Un verdict illisible retombe sur
    // « Encore » — le choix le plus sévère, donc jamais celui qui offrirait
    // une progression gratuite à un appel forgé.
    verdict = isVerdict(clientVerdict) ? clientVerdict : 'encore'
    isCorrect = verdict !== 'encore'
  } else {
    if (question.type === 'qcm') {
      isCorrect = gradeQcm(
        content as QcmContent,
        Array.isArray(o.selected) ? o.selected.map(Number) : [],
      )
    } else if (question.type === 'vrai_faux') {
      isCorrect = gradeVraiFaux(content as VraiFauxContent, o.value === true)
    } else if (question.type === 'texte_a_trous') {
      const issue = corrigerTrous(
        (content as TrousContent).texte,
        Array.isArray(o.values) ? o.values.map(String) : [],
        tolerance,
      )
      isCorrect = issue.correct
      presque = issue.presque
      orthographe = issue.attendue
    } else if (question.type === 'appariement') {
      isCorrect = gradeAppariement(
        content as AppariementContent,
        Array.isArray(o.liens) ? o.liens.map(Number) : [],
      )
    } else if (question.type === 'remise_en_ordre') {
      isCorrect = gradeOrdre(
        content as OrdreContent,
        Array.isArray(o.ordre) ? o.ordre.map(Number) : [],
      )
    } else if (question.type === 'numerique') {
      isCorrect = gradeNumerique(
        content as NumeriqueContent,
        typeof o.valeur === 'number' ? o.valeur : Number.NaN,
      )
    } else {
      const issue = comparerReponse(
        typeof o.value === 'string' ? o.value : '',
        (content as LibreContent).reponses,
        tolerance,
      )
      isCorrect = issue.correct
      presque = issue.presque
      orthographe = issue.attendue
    }
    verdict = verdictAutomatique({ correct: isCorrect, presque })
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
    return ATTEMPT_FAIL
  }

  // --- La planification : c'est ici que la carte reçoit sa prochaine échéance.
  // L'historique (ci-dessus) et l'état (ci-dessous) sont deux écritures
  // distinctes : si la seconde échoue (migration 315 pas encore exécutée, par
  // exemple), la réponse de l'élève n'est pas perdue pour autant.
  const nowIso = new Date().toISOString()
  const etats = await chargerEtats(supabase, userId, [questionId], nowIso)
  const avant = etats.get(questionId) ?? etatInitial(nowIso)
  const apres = planifie
    ? planifier(avant, verdict, nowIso, Math.random())
    : avant
  if (planifie) {
    await ecrireEtat(supabase, userId, questionId, apres)
    // L'ACQUISITION, et elle seule, paye de l'XP côté révision : la carte vient
    // de franchir les 21 jours d'intervalle. Clé = la question, donc une fois
    // pour toutes — la revoir plus tard ne repaye rien (migration 348).
    if (vientDEtreAcquise(avant, apres)) {
      await awardXp(supabase, 'carte', questionId)
    }
  }

  return {
    ok: true,
    verdict,
    prochainJours:
      planifie && apres.phase === 'revision' ? apres.intervalDays : 0,
    orthographe,
    presque,
    // On ne le signale qu'au MOMENT où la carte bascule : le répéter à chaque
    // passage ferait du diagnostic un reproche.
    sangsue: planifie && apres.isLeech && !avant.isLeech,
  }
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

  // L'XP de la session. Réviser son propre carnet ne rapportait RIEN : ni XP,
  // ni couronne, ni série — un élève qui travaillait une heure sur ses cartes
  // voyait sa flamme s'éteindre le soir même. La source `flashcards` était
  // pourtant déjà prévue par `wallet_award_xp` (migration 192) et n'avait
  // jamais été appelée depuis ici.
  //
  // La clé, c'est l'identifiant de session : la RPC dédoublonne, donc rejouer
  // la fin d'une même session ne verse pas deux fois. Un échec de versement
  // n'annule pas la session (elle est déjà close ci-dessus) — il se lit dans
  // les logs de `awardXp`.
  await walletTouch(supabase)

  // La série, elle, se lit sur `carnet_review_sessions` depuis la 317 : rien
  // à écrire ici, la ligne de session suffit.
  revalidatePath('/reviser')
  return { ok: true }
}
