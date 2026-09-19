'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  isHeure,
  normalizeDays,
  normalizeLongueur,
  normalizeMode,
  type PlanPropose,
} from '@/lib/carnet/planning'

type Ok = { ok: boolean; message?: string }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** L'entrée d'un plan, telle que la feuille l'envoie. Tout est revalidé ici. */
export type PlanEntree = {
  days: readonly number[]
  time: string | null
  longueur: number | null
  mode: string
}

function revalider(courseId: string) {
  revalidatePath('/reviser')
  revalidatePath(`/carnet/cours/${courseId}`)
}

/**
 * Pose (ou remplace) le plan d'un dossier — le cours entier quand
 * `chapterId` est null. Un dossier n'a qu'un plan : l'index unique de la 353
 * le garantit, et on écrit en upsert dessus.
 *
 * Rend `{ ok: false, message }` quand la migration 353 dort (table absente) :
 * la feuille affiche la phrase, rien ne casse.
 */
export async function enregistrerPlan(
  courseId: string,
  chapterId: string | null,
  entree: PlanEntree,
): Promise<Ok> {
  if (!UUID.test(courseId)) return { ok: false }
  if (chapterId !== null && !UUID.test(chapterId)) return { ok: false }
  const days = normalizeDays(entree.days)
  if (days.length === 0) return { ok: false, message: 'Choisis au moins un jour.' }

  const user = await getCurrentUser()
  if (!user) return { ok: false }
  const supabase = await createClient()

  // Le chapitre doit être au cours — sinon un plan pointerait un dossier
  // d'un autre cours (la RLS de carnet_chapters le rendrait invisible, mais
  // la ligne existerait).
  if (chapterId) {
    const { data: chap } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!chap) return { ok: false }
  }

  const ligne = {
    owner_id: user.id,
    course_id: courseId,
    chapter_id: chapterId,
    days,
    at_time: isHeure(entree.time) ? entree.time : null,
    length: normalizeLongueur(entree.longueur),
    mode: normalizeMode(entree.mode),
    updated_at: new Date().toISOString(),
  }

  // L'upsert sur l'index unique (owner, course, COALESCE(chapter)) ne passe
  // pas par PostgREST (expression) : on cherche, puis on écrit.
  let requete = supabase
    .from('carnet_plans')
    .select('id')
    .eq('owner_id', user.id)
    .eq('course_id', courseId)
  requete = chapterId ? requete.eq('chapter_id', chapterId) : requete.is('chapter_id', null)
  const { data: existant, error: errLecture } = await requete.maybeSingle()
  if (errLecture) {
    return { ok: false, message: 'Le planning n’est pas encore disponible.' }
  }

  const { error } = existant
    ? await supabase.from('carnet_plans').update(ligne).eq('id', existant.id)
    : await supabase.from('carnet_plans').insert(ligne)
  if (error) {
    console.error('[carnet] plan non enregistré:', error.message)
    return { ok: false, message: 'Le planning n’a pas pu être enregistré.' }
  }
  revalider(courseId)
  return { ok: true }
}

export async function supprimerPlan(planId: string): Promise<Ok> {
  if (!UUID.test(planId)) return { ok: false }
  const user = await getCurrentUser()
  if (!user) return { ok: false }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('carnet_plans')
    .delete()
    .eq('id', planId)
    .eq('owner_id', user.id)
    .select('course_id')
    .maybeSingle()
  if (error) return { ok: false }
  if (data?.course_id) revalider(String(data.course_id))
  else revalidatePath('/reviser')
  return { ok: true }
}

/**
 * Applique un planning PROPOSÉ (à rebours depuis la date du contrôle) : un
 * plan par dossier proposé, sans heure ni longueur — l'élève retouche après.
 * Remplace les plans existants des mêmes dossiers.
 */
export async function appliquerProposition(
  courseId: string,
  plans: readonly PlanPropose[],
): Promise<Ok> {
  if (!UUID.test(courseId)) return { ok: false }
  let poses = 0
  for (const p of plans.slice(0, 12)) {
    const r = await enregistrerPlan(courseId, p.chapterId, {
      days: p.days,
      time: null,
      longueur: null,
      mode: 'apprentissage',
    })
    if (r.ok) poses += 1
    else if (r.message) return r
  }
  return { ok: poses > 0 }
}
