import type { SupabaseClient } from '@supabase/supabase-js'
import { STARTING_GEMS, type ReferralStatus, type UnlockResult } from '@/lib/gems'

// Accès aux gemmes 💎 — la partie qui touche la base (migration 183).
//
// Les règles (montants, plafonds, statuts) vivent dans `lib/gems.ts`, qui est
// pur et testé. Ce module ne fait que lire/écrire, et il TOLÈRE une base où la
// migration 183 n'est pas encore passée : le code doit pouvoir être déployé
// AVANT elle, sinon Réviser et Amis cassent le temps du déploiement. Chaque
// fonction a donc un repli explicite, jamais un `throw`.

/** Solde de gemmes de l'élève. `STARTING_GEMS` si la colonne n'existe pas encore. */
export async function fetchGems(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('gems')
    .eq('id', userId)
    .maybeSingle<{ gems: number }>()

  // Migration 183 pas encore exécutée : on affiche la dotation de départ plutôt
  // qu'un 0 trompeur qui ferait croire à l'élève qu'il a tout dépensé.
  if (error) return STARTING_GEMS
  return Math.max(0, data?.gems ?? STARTING_GEMS)
}

/** Chapitres déverrouillés à la gemme. Ensemble vide si la table n'existe pas. */
export async function fetchUnlockedChapters(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('chapter_unlocks')
    .select('chapter_id')
    .eq('user_id', userId)
    .returns<{ chapter_id: string }[]>()

  if (error) return new Set()
  return new Set((data ?? []).map((r) => r.chapter_id))
}

/**
 * Dépense une gemme pour ouvrir un chapitre. Tout se joue côté serveur (RPC
 * `unlock_chapter_with_gem`) : le débit et l'ouverture sont indissociables, et
 * un client bidouillé ne peut ni s'offrir un chapitre ni se recréditer.
 */
export async function unlockChapter(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<UnlockResult> {
  const { data, error } = await supabase.rpc('unlock_chapter_with_gem', {
    p_chapter_id: chapterId,
  })
  if (error) return 'error'

  const result = String(data ?? '') as UnlockResult
  const known: UnlockResult[] = [
    'unlocked',
    'already',
    'premium',
    'no_gems',
    'not_found',
  ]
  return known.includes(result) ? result : 'error'
}

// ---------------------------------------------------------------- parrainage

export type ReferralCounts = { pending: number; activated: number }

/** Filleuls de l'élève, comptés par statut. */
export async function fetchReferralCounts(
  supabase: SupabaseClient,
  userId: string,
): Promise<ReferralCounts> {
  const { data, error } = await supabase
    .from('referrals')
    .select('status')
    .eq('referrer_id', userId)
    .returns<{ status: ReferralStatus }[]>()

  if (error) return { pending: 0, activated: 0 }

  const rows = data ?? []
  return {
    pending: rows.filter((r) => r.status === 'pending').length,
    activated: rows.filter((r) => r.status === 'activated').length,
  }
}

/**
 * Déclare son parrain à partir de son code ami. Appelé une seule fois, à
 * l'arrivée : la fonction SQL refuse un compte déjà parrainé ou vieux de plus
 * de sept jours. Aucune gemme ne tombe ici — elles arrivent à la première
 * session de révision du filleul (trigger sur `test_sessions`).
 */
export type ClaimResult =
  | 'claimed'
  | 'already'
  | 'self'
  | 'too_late'
  | 'not_found'
  | 'error'

export async function claimReferral(
  supabase: SupabaseClient,
  code: string,
): Promise<ClaimResult> {
  const { data, error } = await supabase.rpc('claim_referral', {
    p_code: code.trim().toUpperCase(),
  })
  if (error) return 'error'

  const result = String(data ?? '') as ClaimResult
  const known: ClaimResult[] = [
    'claimed',
    'already',
    'self',
    'too_late',
    'not_found',
  ]
  return known.includes(result) ? result : 'error'
}

// --------------------------------------------------------------------- squad

/** Membres du squad (le cercle intime). Ensemble vide si la table n'existe pas. */
export async function fetchSquadIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('squad_members')
    .select('member_id')
    .eq('owner_id', userId)
    .returns<{ member_id: string }[]>()

  if (error) return new Set()
  return new Set((data ?? []).map((r) => r.member_id))
}

export type SquadAddResult =
  | 'added'
  | 'full'
  | 'not_friend'
  | 'already'
  | 'self'
  | 'error'

export async function addToSquad(
  supabase: SupabaseClient,
  memberId: string,
): Promise<SquadAddResult> {
  const { data, error } = await supabase.rpc('squad_add', {
    p_member: memberId,
  })
  if (error) return 'error'

  const result = String(data ?? '') as SquadAddResult
  const known: SquadAddResult[] = [
    'added',
    'full',
    'not_friend',
    'already',
    'self',
  ]
  return known.includes(result) ? result : 'error'
}

/** Sort quelqu'un du squad. La policy `squad_members_delete_own` borne la ligne. */
export async function removeFromSquad(
  supabase: SupabaseClient,
  userId: string,
  memberId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('squad_members')
    .delete()
    .eq('owner_id', userId)
    .eq('member_id', memberId)
  return !error
}
