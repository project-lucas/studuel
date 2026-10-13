'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
