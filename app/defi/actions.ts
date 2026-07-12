'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday } from '@/lib/habits'
import { isCommuteNow } from '@/lib/trajet'
import { XP_RULES } from '@/lib/xp'
import { MODE_XP_BONUS, modeXpBonus, type GameModeId } from '@/lib/defi-modes'
import { weeklyBoss, weeklyTrophyId, WEEKLY_TROPHY_COINS } from '@/lib/bosses'
import { toDayKey } from '@/lib/streak'
import type { CommuteSlot } from '@/lib/types'

// Enregistre un défi terminé : compte pour la série, les habitudes et l'XP.
// L'XP est recalculée ICI depuis score/total (+ bonus trajet, + bonus du mode
// de jeu, borné par le barème) — la valeur affichée côté client n'est jamais
// prise pour argent comptant.
export async function recordChallenge(
  score: number,
  total: number,
  mode?: GameModeId,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0

  const cleanTotal = clean(total, 50)
  const cleanScore = clean(score, cleanTotal)

  // Exploit de trajet : évalué au moment de l'enregistrement, avec les
  // créneaux du profil (même logique que l'affichage côté client).
  const { data: profile } = await supabase
    .from('profiles')
    .select('commute_slots')
    .eq('id', user.id)
    .maybeSingle()
  const slots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Bonus du mode : uniquement une valeur du barème (jamais un nombre client),
  // doublé si le mode est celui mis en avant aujourd'hui (mode du jour).
  const modeBonus =
    mode && mode in MODE_XP_BONUS ? modeXpBonus(mode, toDayKey(new Date())) : 0

  const xp =
    cleanScore * XP_RULES.challengePerCorrect +
    XP_RULES.challengeBonus +
    modeBonus +
    (isCommuteNow(slots) ? XP_RULES.commuteBonus : 0)

  const { error } = await supabase.from('challenge_sessions').insert({
    user_id: user.id,
    score: cleanScore,
    total: cleanTotal,
    xp,
  })

  // Coche « Révision quotidienne » du jour tout de suite si le seuil est atteint.
  if (!error) await validateRevisionToday(supabase, user.id)

  revalidatePath('/defi')
  revalidatePath('/moi')
  return { saved: !error }
}

// Victoire sur le boss de la semaine : débloque le trophée exclusif de la
// collection + quelques pièces. L'identité du boss (donc du trophée) est
// recalculée ICI depuis la date — le client ne choisit rien. La PK de
// collection_unlocks garantit un seul versement par trophée.
export async function claimWeeklyTrophy(): Promise<{
  claimed: boolean
  trophyId: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const boss = weeklyBoss(toDayKey(new Date()))
  const trophyId = weeklyTrophyId(boss.id)
  if (!user) return { claimed: false, trophyId }

  const { data: claimed, error } = await supabase.rpc('claim_weekly_trophy', {
    p_item_id: trophyId,
    p_coins: WEEKLY_TROPHY_COINS,
  })
  if (error) {
    console.error('[defi] trophée hebdo non réclamé:', error.message)
    return { claimed: false, trophyId }
  }

  revalidatePath('/tresor')
  return { claimed: claimed === true, trophyId }
}

// Fin de duel : les manches du joueur deviennent son fantôme (duel_recordings).
// Ses amis affronteront cet enregistrement — d'où les bornes strictes : au
// plus 3 manches (BO3), scores et temps plausibles seulement.
export async function saveDuelRecording(
  rounds: { correct: number; timeMs: number }[],
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const clean = (Array.isArray(rounds) ? rounds : [])
    .slice(0, 3)
    .flatMap((r) => {
      const correct = Number(r?.correct)
      const timeMs = Number(r?.timeMs)
      if (!Number.isFinite(correct) || !Number.isFinite(timeMs)) return []
      return [
        {
          correct: Math.max(0, Math.min(Math.round(correct), 5)),
          time_ms: Math.max(1000, Math.min(Math.round(timeMs), 600_000)),
        },
      ]
    })
  if (clean.length === 0) return { saved: false }

  const { error } = await supabase.from('duel_recordings').upsert({
    user_id: user.id,
    rounds: clean,
    updated_at: new Date().toISOString(),
  })
  return { saved: !error }
}

// Le versement du temps de travail (chrono du Défi) passe par la route
// app/api/work-time — compatible sendBeacon, garanti même quand la page se ferme.
