'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  SHOP_CATALOG,
  COLLECTION_CATALOG,
  drawChestReward,
  type ChestReward,
} from '@/lib/tresor'

// Solde courant (après opération) — bigint PostgREST : nombre ou chaîne.
async function currentCoins(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', userId)
    .maybeSingle()
  const n = Number(data?.coins)
  return Number.isFinite(n) ? n : 0
}

export type ChestResult = {
  opened: boolean
  reward: ChestReward | null
  coins: number
}

// Ouvre le coffre du jour : tirage côté serveur, crédit atomique en SQL
// (open_chest garantit une ouverture par jour UTC). Un sticker débloque une
// carte de collection encore verrouillée ; s'il n'en reste aucune, il se
// transforme en pièces.
export async function openDailyChest(): Promise<ChestResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { opened: false, reward: null, coins: 0 }

  let reward = drawChestReward()

  if (reward.kind === 'sticker') {
    const { data: unlocks } = await supabase
      .from('collection_unlocks')
      .select('item_id')
      .eq('user_id', user.id)
    const unlocked = new Set((unlocks ?? []).map((u) => String(u.item_id)))
    // Les cartes exclusives (trophées de boss) ne sortent jamais d'un coffre.
    const locked = COLLECTION_CATALOG.filter(
      (c) => !c.exclusive && !unlocked.has(c.id),
    )
    if (locked.length === 0) {
      reward = {
        kind: 'coins',
        amount: 25,
        emoji: '🪙',
        label: '+25 pièces',
        weight: 0,
      }
    } else {
      const card = locked[Math.floor(Math.random() * locked.length)]
      reward = {
        ...reward,
        itemId: card.id,
        emoji: card.emoji,
        label: `Carte « ${card.name} » débloquée !`,
      }
    }
  }

  const payload =
    reward.kind === 'coins'
      ? { kind: 'coins', amount: reward.amount, label: reward.label }
      : { kind: 'sticker', item_id: reward.itemId, label: reward.label }

  const { data: opened, error } = await supabase.rpc('open_chest', {
    p_reward: payload,
  })
  if (error) {
    console.error('[tresor] ouverture du coffre impossible:', error.message)
    return { opened: false, reward: null, coins: 0 }
  }

  const coins = await currentCoins(supabase, user.id)
  revalidatePath('/coffre')
  return { opened: opened === true, reward: opened ? reward : null, coins }
}

export type LoginRewardResult = {
  claimed: boolean
  coins: number // pièces créditées (0 si déjà réclamé)
  streak: number // jours de connexion consécutifs
}

// Récompense de connexion journalière : tout est calculé côté SQL
// (claim_login_reward, migration 024) — série, montant, unicité par jour UTC.
export async function claimLoginReward(): Promise<LoginRewardResult> {
  const none: LoginRewardResult = { claimed: false, coins: 0, streak: 0 }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return none

  const { data, error } = await supabase.rpc('claim_login_reward')
  if (error) {
    // Migration 024 pas encore exécutée : on n'affiche simplement rien.
    console.error('[connexion] récompense indisponible:', error.message)
    return none
  }

  const r = data as { claimed?: boolean; coins?: number; streak?: number } | null
  if (!r?.claimed) return none
  revalidatePath('/coffre')
  return { claimed: true, coins: r.coins ?? 0, streak: r.streak ?? 1 }
}

export type PurchaseResult = { bought: boolean; coins: number }

// Achète un article : le prix vient du CATALOGUE (jamais du client), le débit
// et l'enregistrement sont atomiques côté SQL (buy_shop_item).
export async function buyShopItem(itemId: string): Promise<PurchaseResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { bought: false, coins: 0 }

  const item = SHOP_CATALOG.find((i) => i.id === itemId)
  if (!item) return { bought: false, coins: await currentCoins(supabase, user.id) }

  const { data: bought, error } = await supabase.rpc('buy_shop_item', {
    p_item_id: item.id,
    p_price: item.price,
  })
  if (error) {
    console.error('[tresor] achat impossible:', error.message)
    return { bought: false, coins: await currentCoins(supabase, user.id) }
  }

  const coins = await currentCoins(supabase, user.id)
  revalidatePath('/coffre')
  return { bought: bought === true, coins }
}
