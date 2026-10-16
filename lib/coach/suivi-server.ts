import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  avanceeDepuis,
  ficheEntreeDepuis,
  objectifDepuis,
  semainesDepuis,
  type Avancee,
  type FicheEntree,
  type Objectif,
  type Semaine,
} from '@/lib/coach/suivi'

/**
 * LES LECTURES DU SUIVI (migration 591). `null` quand la migration manque.
 */

export type SuiviLigne = {
  eleveId: string
  objMinutes: number | null
  objJours: number | null
  objQuiz: number | null
  minutesSemaine: number
  joursSemaine: number
  quizSemaine: number
  nonLus: number
  ficheEntree: boolean
  parentLie: boolean
}

export async function lireSuiviTableau(): Promise<Map<string, SuiviLigne> | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_tableau_suivi')
  if (error) return null
  const m = new Map<string, SuiviLigne>()
  for (const r of Array.isArray(data) ? data : []) {
    const x = r as Record<string, unknown>
    const num = (v: unknown) => (v == null ? null : Number(v))
    m.set(String(x.eleve_id), {
      eleveId: String(x.eleve_id),
      objMinutes: num(x.obj_minutes),
      objJours: num(x.obj_jours),
      objQuiz: num(x.obj_quiz),
      minutesSemaine: Number(x.minutes_semaine ?? 0) || 0,
      joursSemaine: Number(x.jours_semaine ?? 0) || 0,
      quizSemaine: Number(x.quiz_semaine ?? 0) || 0,
      nonLus: Number(x.non_lus ?? 0) || 0,
      ficheEntree: x.fiche_entree === true,
      parentLie: x.parent_lie === true,
    })
  }
  return m
}

export async function lireFicheEntree(eleveId: string): Promise<FicheEntree | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_fiche_entree_lire', { p_eleve: eleveId })
  if (error) return null
  return ficheEntreeDepuis(data)
}

export type NoteCoach = { id: number; corps: string; creeLe: string; auteur: string | null; moi: boolean }

export async function lireNotes(eleveId: string): Promise<NoteCoach[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_notes_lire', { p_eleve: eleveId })
  if (error) return null
  return (Array.isArray(data) ? data : []).map((r) => {
    const x = r as Record<string, unknown>
    return { id: Number(x.id), corps: String(x.corps ?? ''), creeLe: String(x.cree_le ?? ''), auteur: typeof x.auteur === 'string' ? x.auteur : null, moi: x.moi === true }
  })
}

export type DetailEleve = {
  semaines: Semaine[]
  jours: { jour: string; minutes: number }[]
  recent: { source: string; xp: number; quand: string }[]
  objectif: Objectif | null
  avancee: Avancee
  parents: { id: string; prenom: string }[]
  fils: { id: string; type: string; dernier: string | null }[]
}

export async function lireDetail(eleveId: string): Promise<DetailEleve | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_eleve_detail', { p_eleve: eleveId })
  if (error || !data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const liste = (v: unknown) => (Array.isArray(v) ? (v as Record<string, unknown>[]) : [])
  return {
    semaines: semainesDepuis(d.semaines),
    jours: liste(d.jours).map((j) => ({ jour: String(j.jour ?? ''), minutes: Number(j.minutes ?? 0) || 0 })),
    recent: liste(d.recent).map((r) => ({ source: String(r.source ?? ''), xp: Number(r.xp ?? 0) || 0, quand: String(r.quand ?? '') })),
    objectif: objectifDepuis(d.objectif),
    avancee: avanceeDepuis(d.avancee),
    parents: liste(d.parents).map((p) => ({ id: String(p.id ?? ''), prenom: String(p.prenom ?? 'Parent') })),
    fils: liste(d.fils).map((f) => ({ id: String(f.id ?? ''), type: String(f.type ?? ''), dernier: typeof f.dernier === 'string' ? f.dernier : null })),
  }
}

/**
 * Un jeton de l'assistant IA (591 : 80 travaux par coach et par jour, et
 * seulement pour un coach). À prendre AVANT chaque appel à Claude. Rend null
 * quand c'est permis, sinon la phrase à afficher.
 */
export async function prendreJetonIA(): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_ia_jeton')
  if (error) return 'L’assistant attend la migration 591.'
  return data === true ? null : 'Limite du jour atteinte pour l’assistant (80 travaux). Il revient demain.'
}
