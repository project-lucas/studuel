'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { gainsVerses, recompenserEpreuve } from '@/lib/wallet-server'
import type { Gain } from '@/lib/gains'

// L'ANNALE COMME ÉPREUVE (557). Ouvrir le corrigé lance le chrono (la première
// fois seulement) ; « J'ai traité ce sujet » ne paie qu'au bout de 15 minutes
// — 150 XP et 10 gemmes, une fois par annale. Le serveur tient l'heure : le
// client ne peut ni l'avancer ni payer deux fois.

const ID_ANNALE = /^[a-z0-9-]{3,80}$/

/** Ouvre l'annale (lance le chrono) et dit si elle a déjà été traitée. */
export async function commencerAnnale(id: string): Promise<{ traitee: boolean }> {
  if (!ID_ANNALE.test(String(id))) return { traitee: false }
  const user = await getCurrentUser()
  if (!user) return { traitee: false }
  const supabase = await createClient()
  const { error } = await supabase.rpc('annale_commencer', { p_annale: id })
  if (error) {
    // 557 pas encore exécutée : le bouton restera sans effet, rien ne casse.
    console.error('[annales] chrono non lancé:', error.message)
    return { traitee: false }
  }
  const { data } = await supabase
    .from('annales_travail')
    .select('termine_le')
    .eq('user_id', user.id)
    .eq('annale_id', id)
    .maybeSingle<{ termine_le: string | null }>()
  return { traitee: Boolean(data?.termine_le) }
}

export type ResultatAnnale =
  | { ok: true; gains: Gain[] }
  | { ok: false; raison: 'trop_tot'; minutes: number }
  | { ok: false; raison: 'erreur' }

/** « J'ai traité ce sujet » : la récompense, ou le temps qu'il reste. */
export async function terminerAnnale(id: string): Promise<ResultatAnnale> {
  if (!ID_ANNALE.test(String(id))) return { ok: false, raison: 'erreur' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'erreur' }
  const supabase = await createClient()
  const award = await recompenserEpreuve(supabase, 'annale', id)
  if (!award) return { ok: false, raison: 'erreur' }
  if (award.raison === 'trop_tot') {
    return { ok: false, raison: 'trop_tot', minutes: Math.max(1, Number(award.minutes) || 1) }
  }
  if (award.raison === 'pas_commencee') return { ok: false, raison: 'erreur' }
  return { ok: true, gains: gainsVerses(award) }
}
