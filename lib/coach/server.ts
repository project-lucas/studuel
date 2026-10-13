import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { ligneDepuis, type LigneCoach } from '@/lib/coach/statut'

/**
 * LES LECTURES DU COACH (migration 560). Chacune rend `null` quand la
 * migration n'est pas passée (la RPC est inconnue) : les pages le disent au
 * lieu de planter.
 */

export type GroupeCoach = {
  id: string
  nom: string
  categorie: string | null
  code: string
  creeLe: string
  archiveLe: string | null
  membres: number
}

/** La fiche d'un élève : le JSON de `child_dashboard` (319), même clés. */
export type FicheEleve = {
  full_name: string | null
  grade_level: string | null
  work_seconds: number
  week_seconds: number
  week_active_days: number
  active_days: string[]
  sessions_total: number
  sessions_7: number
  avg_ratio: number | null
  per_subject: { subject: string; ratio: number; attempts: number }[]
  weeks: { start: string; seconds: number; active_days: number }[]
  controles: { id: number; subject_slug: string; chapters: unknown; exam_date: string }[]
  last_activity: string | null
}

/** Le jour UTC, `YYYY-MM-DD` — le même que celui des agrégats de la base. */
export function aujourdhuiUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function estCoach(): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('est_coach')
  return !error && data === true
}

export async function lireTableau(groupeId: string | null = null): Promise<LigneCoach[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_tableau', { p_groupe: groupeId })
  if (error) return null
  return (Array.isArray(data) ? data : []).map((l) => ligneDepuis(l as Record<string, unknown>))
}

export async function lireGroupes(): Promise<GroupeCoach[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_mes_groupes')
  if (error) return null
  return (Array.isArray(data) ? data : []).map((g) => {
    const r = g as Record<string, unknown>
    return {
      id: String(r.id ?? ''),
      nom: typeof r.nom === 'string' ? r.nom : '',
      categorie: typeof r.categorie === 'string' ? r.categorie : null,
      code: typeof r.code === 'string' ? r.code : '',
      creeLe: typeof r.cree_le === 'string' ? r.cree_le.slice(0, 10) : '',
      archiveLe: typeof r.archive_le === 'string' ? r.archive_le.slice(0, 10) : null,
      membres: typeof r.membres === 'number' ? r.membres : Number(r.membres ?? 0) || 0,
    }
  })
}

export async function lireFiche(eleveId: string): Promise<FicheEleve | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_fiche_eleve', { p_eleve: eleveId })
  if (error || !data || typeof data !== 'object') return null
  const d = data as Partial<FicheEleve>
  return {
    full_name: d.full_name ?? null,
    grade_level: d.grade_level ?? null,
    work_seconds: Number(d.work_seconds ?? 0),
    week_seconds: Number(d.week_seconds ?? 0),
    week_active_days: Number(d.week_active_days ?? 0),
    active_days: Array.isArray(d.active_days) ? d.active_days.map(String) : [],
    sessions_total: Number(d.sessions_total ?? 0),
    sessions_7: Number(d.sessions_7 ?? 0),
    avg_ratio: typeof d.avg_ratio === 'number' ? d.avg_ratio : d.avg_ratio ? Number(d.avg_ratio) : null,
    per_subject: Array.isArray(d.per_subject)
      ? d.per_subject.map((s) => ({
          subject: String(s.subject ?? ''),
          ratio: Number(s.ratio ?? 0),
          attempts: Number(s.attempts ?? 0),
        }))
      : [],
    weeks: Array.isArray(d.weeks)
      ? d.weeks.map((w) => ({
          start: String(w.start ?? ''),
          seconds: Number(w.seconds ?? 0),
          active_days: Number(w.active_days ?? 0),
        }))
      : [],
    controles: Array.isArray(d.controles)
      ? d.controles.map((c) => ({
          id: Number(c.id ?? 0),
          subject_slug: String(c.subject_slug ?? ''),
          chapters: c.chapters,
          exam_date: String(c.exam_date ?? ''),
        }))
      : [],
    last_activity: typeof d.last_activity === 'string' ? d.last_activity : null,
  }
}
