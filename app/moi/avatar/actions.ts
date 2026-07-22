'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { normalizeAvatarConfig } from '@/lib/avatar'
import {
  applyItem,
  fallbackCatalog,
  isFreeItem,
  normalizeCatalog,
  type AvatarItem,
} from '@/lib/avatar-studio'
import type { SupabaseClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// Actions du vestiaire. L'équipement est validé CÔTÉ SERVEUR (l'item doit être
// gratuit ou possédé — user_avatar_items — avant d'écrire profiles.avatar) ;
// l'achat passe par la RPC purchase_avatar_item qui lit le prix EN BASE et
// débite atomiquement (migration 189, même leçon que 088 : jamais de débit ni
// de prix côté client).
// -----------------------------------------------------------------------------

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// L'avatar apparaît sur ces onglets (hero card, top bars, classements…).
const AVATAR_PATHS = ['/moi', '/amis', '/defi', '/reviser', '/moi/avatar']

// Item du catalogue en base ; repli sur le catalogue gratuit embarqué si la
// table est vide/absente (189 pas encore passée) — ids `libre-…`, tous gratuits.
async function loadItem(
  supabase: SupabaseClient,
  itemId: string,
): Promise<AvatarItem | null> {
  const { data } = await supabase
    .from('avatar_items')
    .select('id, category, name, asset_key, price, unlock_condition, rarity, sort')
    .eq('id', itemId)
    .maybeSingle()
  const [item] = normalizeCatalog(data ? [data] : [])
  return item ?? fallbackCatalog().find((i) => i.id === itemId) ?? null
}

// Équipe un item (gratuit ou possédé) : applique son mapping à la config
// stockée et enregistre. Un équipement déjà porté se retire (toggle).
export async function equipAvatarItemAction(
  itemId: string,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof itemId !== 'string' || itemId.length === 0)
    return { ok: false }

  const item = await loadItem(supabase, itemId)
  if (!item) return { ok: false }

  // Possession : gratuit d'office, sinon une ligne user_avatar_items (achat ou
  // déblocage réclamé par claim_avatar_unlocks) doit exister.
  if (!isFreeItem(item)) {
    const { data: owned } = await supabase
      .from('user_avatar_items')
      .select('item_id')
      .eq('user_id', userId)
      .eq('item_id', item.id)
      .maybeSingle()
    if (!owned) return { ok: false }
  }

  const { data: row } = await supabase
    .from('profiles')
    .select('avatar')
    .eq('id', userId)
    .maybeSingle()
  const next = applyItem(normalizeAvatarConfig(row?.avatar), item)

  const { error } = await supabase
    .from('profiles')
    .update({ avatar: next })
    .eq('id', userId)
  if (error) {
    console.error('[vestiaire] équipement non enregistré:', error.message)
    return { ok: false }
  }
  for (const path of AVATAR_PATHS) revalidatePath(path)
  return { ok: true }
}

export type AvatarPurchaseResult = { bought: boolean; coins: number }

async function currentCoins(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', userId)
    .maybeSingle()
  return Number(data?.coins ?? 0) || 0
}

// Achète un item puis l'équipe dans la foulée (le débit et la possession sont
// atomiques côté SQL ; l'équipement raté n'annule pas l'achat).
export async function purchaseAvatarItemAction(
  itemId: string,
): Promise<AvatarPurchaseResult> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof itemId !== 'string' || itemId.length === 0)
    return { bought: false, coins: 0 }

  const { data: bought, error } = await supabase.rpc('purchase_avatar_item', {
    p_item_id: itemId,
  })
  if (error) {
    // RPC absente (189 pas passée) ou échec DB : rien n'a été débité.
    console.error('[vestiaire] achat impossible:', error.message)
    return { bought: false, coins: await currentCoins(supabase, userId) }
  }
  if (bought !== true)
    return { bought: false, coins: await currentCoins(supabase, userId) }

  await equipAvatarItemAction(itemId)
  return { bought: true, coins: await currentCoins(supabase, userId) }
}
