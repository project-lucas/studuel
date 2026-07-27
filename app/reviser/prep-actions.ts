'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { toDayKey } from '@/lib/streak'
import {
  buildSessionDrafts,
  type PrepChapter,
  type SessionDraft,
} from '@/lib/prep-plan'

// -----------------------------------------------------------------------------
// Server Actions du « Plan de préparation » (migration 203). Toute écriture
// passe par une RPC SECURITY DEFINER : le client ne fabrique jamais un contrôle
// orphelin (invariant « aucun contrôle sans plan », garanti par create_controle).
// Les chapitres sont RÉSOLUS EN BASE (titres/niveau fiables), jamais ce que dit
// le client — même principe que addUpcomingExams.
// -----------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isDayKey = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

// Un contrôle porte au plus ce nombre de chapitres (garde-fou anti-abus).
const MAX_CHAPTERS = 12

type ChapterRow = {
  id: string
  title: string
  level: string
  subject: { slug: string } | null
}

// Crée un contrôle (1 matière + N chapitres + 1 date) et son plan de sessions,
// atomiquement. `sessionDates` (optionnel) permet à l'écran de confirmation
// d'imposer les jours ajustés par l'élève ; sinon le plan est généré par défaut
// (règles J-5/J-2-4/J-1). Renvoie { ok, controleId }.
export async function createControle(
  chapterIds: string[],
  date: string | null,
  goalMinutes: number,
  sessionDates?: string[],
): Promise<{ ok: boolean; controleId: string | null }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, controleId: null }

  const cleanIds = Array.isArray(chapterIds)
    ? [
        ...new Set(
          chapterIds.filter(
            (id): id is string => typeof id === 'string' && UUID_RE.test(id),
          ),
        ),
      ].slice(0, MAX_CHAPTERS)
    : []
  if (cleanIds.length === 0) return { ok: false, controleId: null }

  // Résolution des chapitres en base : titres + matière fiables, et vérification
  // que tous les chapitres existent et partagent la même matière (un contrôle =
  // une matière).
  const { data: rows } = await supabase
    .from('chapters')
    .select('id, title, level, subject:subjects(slug)')
    .in('id', cleanIds)
    .returns<ChapterRow[]>()
  if (!rows || rows.length !== cleanIds.length) {
    return { ok: false, controleId: null }
  }
  const slugs = new Set(rows.map((r) => r.subject?.slug ?? ''))
  if (slugs.size !== 1 || slugs.has('')) return { ok: false, controleId: null }
  const subjectSlug = rows[0].subject!.slug
  const grade = rows[0].level

  const chapters: PrepChapter[] = rows.map((r) => ({ id: r.id, title: r.title }))
  const cleanDate = isDayKey(date) ? date : null
  const today = toDayKey(new Date())

  // Plan : jours ajustés par l'élève (validés) si fournis, sinon plan par défaut.
  let drafts: SessionDraft[]
  const adjusted = Array.isArray(sessionDates)
    ? sessionDates.filter(isDayKey)
    : []
  if (adjusted.length > 0) {
    const duration = Math.round(goalMinutes) > 0 ? Math.round(goalMinutes) : 10
    drafts = [...new Set(adjusted)].sort().map((plannedDate, i) => ({
      plannedDate,
      durationMin: duration,
      chapterId: chapters[i % chapters.length].id,
      position: i,
    }))
  } else {
    drafts = buildSessionDrafts(chapters, cleanDate, today, goalMinutes)
  }
  if (drafts.length === 0) return { ok: false, controleId: null }

  const { data: id, error } = await supabase.rpc('create_controle', {
    p_subject: subjectSlug,
    p_chapters: chapters,
    p_date: cleanDate,
    p_grade: grade,
    p_sessions: drafts,
  })
  if (error || !id) {
    console.error('[reviser] contrôle non créé:', error?.message)
    return { ok: false, controleId: null }
  }

  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/defi')
  return { ok: true, controleId: String(id) }
}

// Marque une session de préparation « faite » (bouton explicite « J'ai révisé »).
export async function completePrepSession(
  sessionId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(String(sessionId))) return { ok: false }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc('complete_prep_session', {
    p_session: sessionId,
  })
  if (error) {
    console.error('[reviser] session non cochée:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser')
  revalidatePath('/moi')
  return { ok: data === true }
}

// Replie la carte de préparation pour aujourd'hui (« me le rappeler ce soir ») :
// elle réapparaît le lendemain. Ne supprime jamais le contrôle.
export async function snoozeControleCard(
  controleId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(String(controleId))) return { ok: false }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc('snooze_controle_card', {
    p_controle: controleId,
  })
  if (error) {
    console.error('[reviser] carte non repliée:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser')
  return { ok: data === true }
}

// Enregistre la note obtenue (0..20, bornée en base) et clôt la relance.
export async function setControleNote(
  controleId: string,
  note: number,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(String(controleId))) return { ok: false }
  if (!Number.isFinite(note)) return { ok: false }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc('set_controle_note', {
    p_controle: controleId,
    p_note: Math.round(note),
  })
  if (error) {
    console.error('[reviser] note non enregistrée:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser')
  revalidatePath('/moi')
  return { ok: data === true }
}

// Ferme la relance de note sans en saisir (« plus tard »).
export async function dismissControleNote(
  controleId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(String(controleId))) return { ok: false }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc('dismiss_controle_note', {
    p_controle: controleId,
  })
  if (error) {
    console.error('[reviser] relance de note non fermée:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser')
  return { ok: data === true }
}

// Supprime un contrôle (« je me suis trompé ») — cascade sur ses sessions.
export async function deleteControle(
  controleId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(String(controleId))) return { ok: false }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc('delete_controle', {
    p_controle: controleId,
  })
  if (error) {
    console.error('[reviser] contrôle non supprimé:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/defi')
  return { ok: data === true }
}
