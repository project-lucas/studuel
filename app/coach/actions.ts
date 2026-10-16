'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

/**
 * LES GESTES DU COACH (migration 560). Chaque RPC vérifie le lien en base ;
 * ici on ne fait qu'appeler et rafraîchir l'espace coach (hors des onglets :
 * aucun onglet préchargé n'est jeté).
 */
export type ResultatCoach = { ok: true } | { ok: false; erreur: string }

const CATEGORIES = ['U11', 'U13', 'U15', 'U17', 'U18', 'U20', 'Seniors', 'Autre'] as const

function categorieSure(brute: unknown): string | null {
  if (typeof brute !== 'string') return null
  const c = brute.trim().slice(0, 30)
  return c.length > 0 ? c : null
}

export async function creerGroupe(formData: FormData): Promise<ResultatCoach> {
  const nom = String(formData.get('nom') ?? '').trim().slice(0, 60)
  if (!nom) return { ok: false, erreur: 'Donne un nom au groupe.' }
  const categorie = categorieSure(formData.get('categorie'))
  const supabase = await createClient()
  const { error } = await supabase.rpc('coach_creer_groupe', { p_nom: nom, p_categorie: categorie })
  if (error) return { ok: false, erreur: 'Le groupe n’a pas pu être créé.' }
  revalidatePath('/coach/groupes')
  revalidatePath('/coach')
  return { ok: true }
}

export async function renommerGroupe(groupeId: string, nom: string, categorie: string | null): Promise<ResultatCoach> {
  const n = nom.trim().slice(0, 60)
  if (!n) return { ok: false, erreur: 'Le nom ne peut pas être vide.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_renommer_groupe', {
    p_groupe: groupeId,
    p_nom: n,
    p_categorie: categorieSure(categorie),
  })
  if (error || data !== true) return { ok: false, erreur: 'Le groupe n’a pas été renommé.' }
  revalidatePath('/coach/groupes')
  revalidatePath('/coach')
  return { ok: true }
}

export async function regenererCode(groupeId: string): Promise<ResultatCoach & { code?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_regenerer_code', { p_groupe: groupeId })
  if (error || typeof data !== 'string') return { ok: false, erreur: 'Le code n’a pas été régénéré.' }
  revalidatePath('/coach/groupes')
  return { ok: true, code: data }
}

export async function archiverGroupe(groupeId: string): Promise<ResultatCoach> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_archiver_groupe', { p_groupe: groupeId })
  if (error || data !== true) return { ok: false, erreur: 'Le groupe n’a pas été archivé.' }
  revalidatePath('/coach/groupes')
  revalidatePath('/coach')
  return { ok: true }
}

export async function retirerEleve(groupeId: string, eleveId: string): Promise<ResultatCoach> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_retirer_eleve', { p_groupe: groupeId, p_eleve: eleveId })
  if (error || data !== true) return { ok: false, erreur: 'L’élève n’a pas été retiré.' }
  revalidatePath('/coach')
  revalidatePath('/coach/groupes')
  revalidatePath(`/coach/eleves/${eleveId}`)
  return { ok: true }
}

export { CATEGORIES as CATEGORIES_GROUPE }

// -----------------------------------------------------------------------------
// LES ACTIONS GROUPÉES DU TABLEAU (16/10/2026, migrations 587 et 591).
// -----------------------------------------------------------------------------
const UUID_ELEVE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function elevesSurs(ids: unknown): string[] {
  return Array.isArray(ids) ? [...new Set(ids.filter((x): x is string => typeof x === 'string' && UUID_ELEVE.test(x)))].slice(0, 300) : []
}

export type ResultatGroupe =
  | { ok: true; envoyes: number; sansConsentement: number; ignores: number }
  | { ok: false; erreur: string }

/** Le même message à chaque élève sélectionné, dans son fil (ouvert au besoin). */
export async function envoyerGroupeAction(
  eleveIds: string[],
  corps: string,
  consentement: 'papier' | 'majeur' | null,
): Promise<ResultatGroupe> {
  const ids = elevesSurs(eleveIds)
  const texte = String(corps ?? '').trim()
  if (ids.length === 0) return { ok: false, erreur: 'Sélectionne au moins un élève.' }
  if (!texte) return { ok: false, erreur: 'Écris le message.' }
  if (consentement !== null && consentement !== 'papier' && consentement !== 'majeur') return { ok: false, erreur: 'Demande invalide.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('message_envoyer_groupe', { p_eleves: ids, p_corps: texte.slice(0, 4000), p_consentement: consentement })
  if (error || !data || typeof data !== 'object') {
    const { messageErreurBase } = await import('@/lib/messagerie/fil')
    return { ok: false, erreur: messageErreurBase(error?.message) }
  }
  const d = data as { envoyes?: number; messages?: string[]; sans_consentement?: string[]; ignores?: number }
  const user = await getCurrentUser()
  const messages = Array.isArray(d.messages) ? d.messages : []
  if (user && messages.length) {
    const { notifierMessage } = await import('@/lib/messagerie/server')
    after(async () => {
      for (const id of messages) await notifierMessage(id, user.id, '/coach/messages', '/messages')
    })
  }
  revalidatePath('/coach')
  return { ok: true, envoyes: Number(d.envoyes ?? 0), sansConsentement: d.sans_consentement?.length ?? 0, ignores: Number(d.ignores ?? 0) }
}

/** L'objectif de la semaine, pour un ou plusieurs élèves. */
export async function fixerObjectifAction(
  eleveIds: string[],
  objectif: { minutes: number | null; jours: number | null; quiz: number | null; message: string | null },
): Promise<{ ok: true; fixes: number } | { ok: false; erreur: string }> {
  const ids = elevesSurs(eleveIds)
  if (ids.length === 0) return { ok: false, erreur: 'Sélectionne au moins un élève.' }
  const borne = (v: number | null, max: number) => (v === null || !Number.isFinite(v) ? null : Math.max(0, Math.min(max, Math.round(v))))
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_objectif_fixer', {
    p_eleves: ids,
    p_minutes: borne(objectif.minutes, 3000),
    p_jours: borne(objectif.jours, 7),
    p_quiz: borne(objectif.quiz, 200),
    p_message: objectif.message?.slice(0, 280) ?? null,
  })
  if (error) return { ok: false, erreur: 'L’objectif n’a pas été enregistré (migration 591 absente ?).' }
  revalidatePath('/coach')
  return { ok: true, fixes: Number(data ?? 0) }
}
