import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import {
  etatEchelle,
  type Criteres,
  type BarreauId,
  type EpreuveId,
  type EtatEchelle,
  type PassageOral,
  type StatutDemande,
} from './oral'

// Lecture serveur de l'échelle de l'oral (migration 222). La décision est pure
// et testée (./oral) ; ce module ne fait que rassembler les lignes.
//
// Tolérant à l'absence de la 222, comme tout le reste du dépôt : le code se
// déploie AVANT la migration, et l'écran doit alors dire honnêtement que
// l'atelier n'est pas encore ouvert — pas afficher une échelle vide qui
// laisserait croire que l'élève n'a jamais répété.

export type OralRow = {
  barreau: number
  duree: number
  intro: boolean | null
  plan: boolean | null
  transitions: boolean | null
  jour: string
}

export type DemandeRow = {
  id: string
  speaker_id: string
  listener_id: string
  sujet: string
  epreuve: string
  statut: StatutDemande
  intro: boolean | null
  plan: boolean | null
  transitions: boolean | null
  commentaire: string | null
  created_at: string
}

function criteresOf(r: {
  intro: boolean | null
  plan: boolean | null
  transitions: boolean | null
}): Criteres | null {
  if (r.intro === null && r.plan === null && r.transitions === null) return null
  return {
    intro: Boolean(r.intro),
    plan: Boolean(r.plan),
    transitions: Boolean(r.transitions),
  }
}

export type OralSnapshot = {
  /** `false` = migration 222 pas encore exécutée. */
  disponible: boolean
  etat: EtatEchelle
  /** Demandes que J'AI envoyées, la plus récente d'abord. */
  envoyees: (DemandeRow & { criteres: Criteres | null })[]
  /** Demandes qui M'ATTENDENT (je suis l'auditeur). */
  recues: (DemandeRow & { criteres: Criteres | null })[]
}

const VIDE: EtatEchelle = {
  franchis: [],
  prochain: 1,
  passages: 0,
  meilleureDuree: 0,
  jours: 0,
}

export async function getOralSnapshot(
  supabase: SupabaseClient,
  userId: string,
): Promise<OralSnapshot> {
  const [sessions, demandes] = await Promise.all([
    supabase
      .from('oral_sessions')
      .select('barreau, duree, intro, plan, transitions, jour')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200)
      .returns<OralRow[]>(),
    supabase
      .from('oral_listen_requests')
      .select(
        'id, speaker_id, listener_id, sujet, epreuve, statut, intro, plan, transitions, commentaire, created_at',
      )
      .or(`speaker_id.eq.${userId},listener_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(50)
      .returns<DemandeRow[]>(),
  ])

  if (isMissingSchemaObject(sessions.error) || isMissingSchemaObject(demandes.error)) {
    return { disponible: false, etat: VIDE, envoyees: [], recues: [] }
  }

  const passages: PassageOral[] = (sessions.data ?? []).map((r) => ({
    barreau: Math.min(4, Math.max(1, r.barreau)) as BarreauId,
    duree: r.duree ?? 0,
    criteres: criteresOf(r),
    jour: r.jour,
  }))

  const toutes = (demandes.data ?? []).map((d) => ({ ...d, criteres: criteresOf(d) }))

  return {
    disponible: true,
    etat: etatEchelle(passages),
    envoyees: toutes.filter((d) => d.speaker_id === userId),
    recues: toutes.filter(
      (d) => d.listener_id === userId && d.statut === 'en_attente',
    ),
  }
}

// Les demandes d'écoute en attente pour MOI — tout ce dont l'onglet Amis a
// besoin.
//
// ⚠️ PAR RPC, ET PAS PAR JOINTURE. `profiles` est en RLS « soi uniquement »
// (schema.sql) : une jointure PostgREST vers le profil de l'ami qui demande
// renvoie NULL, sans la moindre erreur — chaque demande s'afficherait « Un ami »
// et personne ne comprendrait pourquoi. `oral_listen_inbox` est SECURITY
// DEFINER et ne rend que le PRÉNOM, comme toutes les lectures croisées du
// projet (RPC 159/160/164).
export type DemandeRecue = {
  id: string
  sujet: string
  epreuve: string
  nom: string | null
}

export async function getDemandesRecues(
  supabase: SupabaseClient,
): Promise<{ disponible: boolean; demandes: DemandeRecue[] }> {
  const { data, error } = await supabase.rpc('oral_listen_inbox')

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[oral] demandes reçues indisponibles:', error.message)
    }
    return { disponible: false, demandes: [] }
  }

  const lignes = (data ?? []) as {
    id: string
    sujet: string
    epreuve: string
    speaker_name: string | null
  }[]

  return {
    disponible: true,
    demandes: lignes.map((d) => ({
      id: d.id,
      sujet: d.sujet,
      epreuve: d.epreuve,
      nom: d.speaker_name,
    })),
  }
}

/** Mes amis acceptés, prénom seul — même raison : jamais par jointure. */
export async function getAmisPourOral(
  supabase: SupabaseClient,
): Promise<{ id: string; nom: string }[]> {
  const { data, error } = await supabase.rpc('oral_friends')
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[oral] amis indisponibles:', error.message)
    }
    return []
  }
  return ((data ?? []) as { id: string; name: string | null }[]).map((a) => ({
    id: a.id,
    nom: a.name ?? 'Ami',
  }))
}

export type { EpreuveId }
