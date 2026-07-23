'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import { LEVERS } from '@/lib/capacite-drivers'
import { trimestreOf } from '@/lib/notes'
import { GRADE_LEVELS } from '@/lib/types'
import { normalizeNextExam } from '@/lib/next-exam'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Classe / année scolaire : change le niveau de l'élève (6e → Tle). Pilote tout
// le contenu filtré par niveau (Réviser, Défi, examen blanc…), d'où le
// revalidate global. GRANT UPDATE(grade_level) déjà accordé par 010_moi.sql.
export async function saveGradeLevel(grade: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return
  if (!GRADE_LEVELS.includes(grade as (typeof GRADE_LEVELS)[number])) return

  const { error } = await supabase
    .from('profiles')
    .update({ grade_level: grade })
    .eq('id', userId)
  if (error) console.error('[moi] classe non enregistrée:', error.message)
  // Le niveau conditionne le contenu de tous les onglets : on rafraîchit tout.
  revalidatePath('/', 'layout')
}

// Annonce un ou plusieurs contrôles : un contrôle par chapitre coché (même
// matière, même date). On résout les chapitres EN BASE pour ne stocker que des
// données fiables (titre, niveau, slug), pas ce que dit le client. Chaque
// écriture passe par la RPC atomique add_upcoming_exam (read-modify-write sûr
// contre la concurrence : deux appareils qui annoncent en même temps ne
// s'écrasent plus) — appelée en séquence, un contrôle à la fois. Le Défi pioche
// ensuite dans ces chapitres. Voir supabase/087_upcoming_exams.sql.
// Renvoie { ok, added } pour que l'UI ne ferme la feuille qu'en cas de succès
// complet (si 087 n'est pas passée, la RPC est absente → ok: false, pas un
// faux OK) ; `added` permet un message partiel si une partie est passée.
const MAX_EXAMS_PER_ADD = 20

export async function addUpcomingExams(
  chapterIds: string[],
  date: string | null,
): Promise<{ ok: boolean; added: number }> {
  const { supabase, userId } = await requireUser()
  const cleanIds = Array.isArray(chapterIds)
    ? [
        ...new Set(
          chapterIds.filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
        ),
      ].slice(0, MAX_EXAMS_PER_ADD)
    : []
  if (!userId || cleanIds.length === 0) return { ok: false, added: 0 }

  const cleanDate =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null

  // Les chapitres doivent exister ; leur matière (slug) vient de la jointure.
  type ChapterRow = {
    id: string
    title: string
    level: string
    subject: { slug: string } | null
  }
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, level, subject:subjects!inner(slug)')
    .in('id', cleanIds)
    .returns<ChapterRow[]>()
  if (!chapters || chapters.length !== cleanIds.length)
    return { ok: false, added: 0 }

  let added = 0
  for (const chapter of chapters) {
    const exam = normalizeNextExam({
      subject: chapter.subject?.slug ?? '',
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      level: chapter.level,
      date: cleanDate,
    })
    if (!exam) break

    const { error } = await supabase.rpc('add_upcoming_exam', { p_exam: exam })
    if (error) {
      // RPC absente (087 pas passée) ou échec DB : on signale au client.
      console.error('[moi] contrôle non ajouté:', error.message)
      break
    }
    added += 1
  }

  if (added > 0) {
    revalidatePath('/moi')
    revalidatePath('/defi')
    revalidatePath('/reviser')
  }
  return { ok: added === chapters.length, added }
}

// Retire un contrôle annoncé (déclaré par erreur, ou passé). Même garantie
// d'atomicité que l'ajout : RPC remove_upcoming_exam (087).
export async function removeUpcomingExam(
  chapterId: string,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof chapterId !== 'string' || chapterId.length === 0)
    return { ok: false }

  const { error } = await supabase.rpc('remove_upcoming_exam', {
    p_chapter: chapterId,
  })
  if (error) {
    console.error('[moi] contrôle non retiré:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/defi')
  revalidatePath('/reviser')
  return { ok: true }
}

// `saveAvatar` vivait ici : elle écrivait n'importe quelle config normalisée
// dans profiles.avatar SANS aucun contrôle de possession — l'héritage de
// l'ancien éditeur libre (082), où tout était gratuit. Plus aucun appelant
// depuis l'arrivée du vestiaire, et pas enregistrée comme Server Action dans le
// build : elle n'était donc pas exploitable. Mais le jour où un composant
// client l'aurait ré-importée, elle contournait toute l'économie du vestiaire
// (`equipAvatarItemAction` est le seul chemin légitime, cf. app/moi/avatar).
// Supprimée plutôt que laissée en embuscade — cf. git si le sujet revient.

// --- Leviers de la semaine (hero card Moi) -----------------------------------
// Un tap sur une chip bascule le log DU JOUR de l'habitude du levier. Si
// l'élève n'a jamais activé cette habitude, elle est activée à la volée (avec
// la planification par défaut du catalogue) — habit_logs reste la source
// unique de vérité, aucune table parallèle.
export async function toggleLeverAction(
  catalogId: string,
  date: string,
  completed: boolean,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  // Catalogue fermé : seuls les 4 leviers de la carte sont acceptés.
  if (!LEVERS.some((l) => l.catalogId === catalogId)) return { ok: false }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false }

  let { data: habit } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
    .maybeSingle()

  if (!habit) {
    const { data: inserted, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, catalog_id: catalogId, target: {} })
      .select('id')
      .single()
    if (error) {
      // Course possible (autre appareil) : l'UNIQUE (user_id, catalog_id) a pu
      // claquer — on relit avant d'abandonner.
      const { data: retry } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', userId)
        .eq('catalog_id', catalogId)
        .maybeSingle()
      habit = retry
    } else {
      habit = inserted
    }
  }
  if (!habit) {
    console.error('[moi] levier — habitude introuvable/inactivable:', catalogId)
    return { ok: false }
  }

  const { error } = await supabase.from('habit_logs').upsert(
    {
      habit_id: habit.id,
      user_id: userId,
      date,
      completed,
      auto_validated: false,
    },
    { onConflict: 'habit_id,date' },
  )
  if (error) {
    console.error('[moi] levier non enregistré:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  return { ok: true }
}

// --- Moyennes trimestrielles saisies — migration 187 --------------------------
// Repli de « Ta trajectoire au bac » : quand un trimestre n'a aucune note
// détaillée, l'élève tape directement la moyenne de son bulletin. L'année
// scolaire est celle du jour (convention lib/notes.ts). Renvoie { ok } pour ne
// jamais afficher un faux succès si 187 n'est pas passée.
export async function saveTermAverageAction(
  term: number,
  average: number,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  if (term !== 1 && term !== 2 && term !== 3) return { ok: false }
  const avg = Number(average)
  if (!Number.isFinite(avg) || avg < 0 || avg > 20) return { ok: false }

  const now = trimestreOf(toDayKey(new Date()))
  if (!now) return { ok: false }

  const { error } = await supabase.from('term_grades').upsert(
    {
      user_id: userId,
      school_year: now.year,
      term,
      average: Math.round(avg * 100) / 100,
    },
    { onConflict: 'user_id,school_year,term' },
  )
  if (error) {
    console.error('[moi] moyenne de trimestre non enregistrée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  return { ok: true }
}
