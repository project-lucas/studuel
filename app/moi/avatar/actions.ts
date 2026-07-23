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
//
// `/moi/avatar` n'y est PAS, volontairement : la page du vestiaire est
// `force-dynamic` (elle se recharge donc de toute façon à chaque visite) et
// c'est celle depuis laquelle on tape. L'y inclure faisait re-rendre tout le
// vestiaire — dont un `claim_avatar_unlocks` et cinq requêtes Supabase — à
// CHAQUE essayage d'une couleur de peau, alors que l'écran est déjà à jour
// côté client.
const AVATAR_PATHS = ['/moi', '/amis', '/defi', '/reviser']

// Item du catalogue en base ; repli sur le catalogue gratuit embarqué SEULEMENT
// si la table est vide/absente (189 pas encore passée) — ids `libre-…`.
//
// ⚠️ Le repli ne doit JAMAIS servir de porte de service. Ses items sont tous
// `price: null, unlock: null`, donc « gratuits d'office » pour le contrôle de
// possession ci-dessous, et leurs `assetKey` sont exactement ceux des objets
// payants ou verrouillés du vrai catalogue (`libre-banner-4` = la bannière
// légendaire Niveau 8, `libre-hair_color-7` = les cheveux roux à 150 pièces…).
// Comme ses ids sont déterministes, un id forgé suffisait à porter n'importe
// quel objet sans l'avoir mérité — le prix était bien enfermé en SQL (leçon de
// la 088), mais la POSSESSION avait une porte de service côté application.
async function loadItem(
  supabase: SupabaseClient,
  itemId: string,
): Promise<AvatarItem | null> {
  const { data, error } = await supabase
    .from('avatar_items')
    .select('id, category, name, asset_key, price, unlock_condition, rarity, sort')
    .eq('id', itemId)
    .maybeSingle()
  const [item] = normalizeCatalog(data ? [data] : [])
  if (item) return item

  // Pas de ligne pour cet id. Le catalogue existe-t-il seulement ? S'il répond
  // (même une seule ligne), l'id demandé est inconnu : on refuse. Une erreur,
  // elle, signe une table absente — le repli reprend alors tout son sens.
  if (!error) {
    const { data: sonde } = await supabase
      .from('avatar_items')
      .select('id')
      .limit(1)
    if (sonde && sonde.length > 0) return null
  }
  return fallbackCatalog().find((i) => i.id === itemId) ?? null
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
