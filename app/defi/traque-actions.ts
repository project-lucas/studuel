'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

// Issues de combat de « La Traque » (migration 212).
//
// Le client déclare seulement CE QUI S'EST PASSÉ (gagné / perdu) : ni le
// montant, ni le rang, ni même le droit de combattre. La RPC revérifie que le
// gardien était bien débusqué et que sa fenêtre d'une heure court encore, puis
// recalcule le rang, le bonus du jour et le plafond hebdomadaire de gemmes.
// Une victoire hors fenêtre ne paie rien — et le dire honnêtement vaut mieux
// que de laisser croire à une récompense qui n'arrivera jamais.

export type TraqueVictory = {
  /** Le serveur a bien reconnu la victoire (fenêtre ouverte, boss sorti). */
  won: boolean
  /** Gemmes réellement versées (0 si le plafond de la semaine est atteint). */
  gems: number
  /** Nouveau rang du gardien (I → III) : il revient plus fort. */
  rank: number
  /** La victoire comptait, mais le plafond hebdomadaire a mangé les gemmes. */
  capped: boolean
}

const NO_VICTORY: TraqueVictory = { won: false, gems: 0, rank: 1, capped: false }

/** Encaisse une victoire de traque : gemmes, rang +1, le boss se recouche. */
export async function claimTraqueVictory(
  bossId: string,
): Promise<TraqueVictory> {
  if (typeof bossId !== 'string' || bossId.length === 0) return NO_VICTORY

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return NO_VICTORY

  const { data, error } = await supabase.rpc('traque_victoire', {
    p_boss_id: bossId,
  })
  if (error) {
    // Migration 212 pas encore passée : le combat a eu lieu, son XP est déjà
    // enregistrée par recordChallenge — seule la traque ne se solde pas.
    console.error('[traque] victoire non encaissée:', error.message)
    return NO_VICTORY
  }

  revalidatePath('/defi')
  const row = data as Record<string, unknown> | null
  return {
    won: row?.won === true,
    gems: Math.max(0, Number(row?.gems) || 0),
    rank: Math.min(3, Math.max(1, Number(row?.rank) || 1)),
    capped: row?.capped === true,
  }
}

export type TraqueDefeat = {
  /** La fenêtre d'une heure court TOUJOURS : la revanche est possible. */
  open: boolean
  /** Combats perdus depuis que le gardien est sorti. */
  attempts: number
}

/**
 * Enregistre une défaite. Elle ne coûte NI la fenêtre NI la jauge (migration
 * 213) : le gardien est sorti pour une heure, cette heure appartient à
 * l'élève. Perdre ne fait qu'incrémenter le compteur d'essais — la seule chose
 * qui solde une traque, c'est de laisser passer l'heure.
 */
export async function recordTraqueDefeat(
  bossId: string,
): Promise<TraqueDefeat> {
  const shut: TraqueDefeat = { open: false, attempts: 0 }
  if (typeof bossId !== 'string' || bossId.length === 0) return shut

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return shut

  const { data, error } = await supabase.rpc('traque_defaite', {
    p_boss_id: bossId,
  })
  if (error) {
    console.error('[traque] défaite non enregistrée:', error.message)
    return shut
  }

  revalidatePath('/defi')
  const row = data as Record<string, unknown> | null
  return {
    open: row?.open === true,
    attempts: Math.max(0, Number(row?.attempts) || 0),
  }
}
