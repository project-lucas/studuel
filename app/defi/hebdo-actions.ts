'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { dailyQuests } from '@/lib/quests'
import { toDayKey } from '@/lib/streak'
import { contributeToClan } from '@/lib/clan-week-server'
import type { ClanReward } from '@/lib/clan-week'

// -----------------------------------------------------------------------------
// Réclamations : le coffre du clan (fin de semaine) et les quêtes du jour.
//
// Dans les deux cas, le CLIENT NE CHOISIT AUCUN MONTANT : il annonce ce qu'il
// veut encaisser, le serveur recalcule la récompense depuis son propre barème
// (migrations 204/205) et la PK des tables de réclamation interdit le double
// versement. `lib/clan-week.ts` et `lib/quests.ts` n'en tiennent que le miroir
// d'affichage.
// -----------------------------------------------------------------------------

export type ClanClaimOutcome = {
  claimed: boolean
  tier: ClanReward['tier']
  gems: number
  xp: number
}

const NO_CLAN_CLAIM: ClanClaimOutcome = {
  claimed: false,
  tier: 'aucune',
  gems: 0,
  xp: 0,
}

/**
 * Réclame le coffre d'une semaine de clan TERMINÉE. La RPC refuse une semaine
 * encore en cours : on ne récompense pas un classement provisoire.
 */
export async function claimClanWeek(weekKey: string): Promise<ClanClaimOutcome> {
  if (typeof weekKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) {
    return NO_CLAN_CLAIM
  }

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return NO_CLAN_CLAIM

  const { data, error } = await supabase.rpc('clan_week_claim', { p_week: weekKey })
  if (error || !data) {
    if (error) console.error('[clan] coffre non réclamé:', error.message)
    return NO_CLAN_CLAIM
  }

  const r = data as { claimed?: boolean; tier?: string; gems?: number; xp?: number }
  revalidatePath('/defi')
  revalidatePath('/coffre')
  return {
    claimed: r.claimed === true,
    tier: (r.tier as ClanReward['tier']) ?? 'aucune',
    gems: Math.max(0, Number(r.gems) || 0),
    xp: Math.max(0, Number(r.xp) || 0),
  }
}

export type QuestClaimOutcome = {
  claimed: boolean
  gems: number
  xp: number
  allDone: boolean
}

/**
 * Encaisse les quêtes terminées du jour. Le tirage des trois quêtes est
 * déterministe (lib/quests) : on le REFAIT ici côté serveur plutôt que de
 * laisser le client annoncer quelles quêtes il avait — sinon il suffirait de
 * réclamer les trois plus chères du catalogue.
 */
export async function claimDailyQuests(): Promise<QuestClaimOutcome> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { claimed: false, gems: 0, xp: 0, allDone: false }

  const ids = dailyQuests(toDayKey(new Date()), user.id).map((q) => q.id)

  const { data, error } = await supabase.rpc('quest_claim', { p_quest_ids: ids })
  if (error || !data) {
    if (error) console.error('[quetes] réclamation refusée:', error.message)
    return { claimed: false, gems: 0, xp: 0, allDone: false }
  }

  const r = data as {
    claimed?: boolean
    gems?: number
    xp?: number
    all_done?: boolean
  }

  // Journée complète : le clan en profite aussi. Le plafond quotidien côté SQL
  // rend l'appel inoffensif s'il a déjà été versé à la fin du dernier duel.
  if (r.all_done === true) await contributeToClan(supabase, 'quest_day')

  revalidatePath('/defi')
  revalidatePath('/moi')
  return {
    claimed: r.claimed === true,
    gems: Math.max(0, Number(r.gems) || 0),
    xp: Math.max(0, Number(r.xp) || 0),
    allDone: r.all_done === true,
  }
}

// --- Une quête à la fois, puis le coffre (14/10/2026) --------------------------
// Lucas : « les validations des missions journalières doivent se faire une à
// une pour le côté dopamine ». Chaque pièce de la feuille encaisse SA quête ;
// le coffre s'ouvre ensuite. Aucune migration : `quest_claim` (577) paie les
// quêtes finies parmi celles qu'on lui passe, et le coffre quand TOUTES celles
// qu'on lui passe sont finies — une seule quête ne l'ouvre jamais, les quatre
// (déjà payées, sans double versement grâce à la clé primaire) l'ouvrent.
//
// Pas de `revalidatePath` ici : on encaisse quatre fois de suite, et chaque
// revalidation jetterait tous les onglets préchargés. Le vol des éclairs
// relit la page une fois la vague rentrée (RecompensesProvider).

async function reclamer(ids: string[]): Promise<QuestClaimOutcome> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('quest_claim', { p_quest_ids: ids })
  if (error || !data) {
    if (error) console.error('[quetes] réclamation refusée:', error.message)
    return { claimed: false, gems: 0, xp: 0, allDone: false }
  }
  const r = data as { claimed?: boolean; gems?: number; xp?: number; all_done?: boolean }
  if (r.all_done === true) await contributeToClan(supabase, 'quest_day')
  return {
    claimed: r.claimed === true,
    gems: Math.max(0, Number(r.gems) || 0),
    xp: Math.max(0, Number(r.xp) || 0),
    allDone: r.all_done === true,
  }
}

/**
 * Encaisse UNE quête du jour. L'identifiant vient du client : on vérifie qu'il
 * fait partie du tirage du jour de CET élève (refait côté serveur), sinon on
 * refuse — le client ne peut pas réclamer une quête qu'il n'a pas.
 */
export async function claimDailyQuest(questId: string): Promise<QuestClaimOutcome> {
  const user = await getCurrentUser()
  if (!user || typeof questId !== 'string') return { claimed: false, gems: 0, xp: 0, allDone: false }
  const ids = dailyQuests(toDayKey(new Date()), user.id).map((q) => q.id)
  if (!ids.includes(questId)) return { claimed: false, gems: 0, xp: 0, allDone: false }
  return reclamer([questId])
}

/**
 * Ouvre le coffre du jour : on repasse TOUTES les quêtes du tirage. Celles déjà
 * encaissées ne repaient rien (clé primaire) ; s'il en restait une à payer,
 * elle l'est au passage ; le coffre (100 XP) ne tombe que si toutes sont finies.
 */
export async function openDailyChest(): Promise<QuestClaimOutcome> {
  const user = await getCurrentUser()
  if (!user) return { claimed: false, gems: 0, xp: 0, allDone: false }
  const ids = dailyQuests(toDayKey(new Date()), user.id).map((q) => q.id)
  return reclamer(ids)
}
