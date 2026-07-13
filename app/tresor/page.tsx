import PageHeader from '@/components/PageHeader'
import TresorHome from '@/components/TresorHome'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import {
  getMockShop,
  getMockCollection,
  shopWithOwnership,
  collectionWithUnlocks,
  MOCK_COINS,
} from '@/lib/tresor'

export const metadata = { title: 'Trésor — Studuel' }
export const dynamic = 'force-dynamic'

// Onglet récompense (extrême droite). Connecté : données réelles
// (018_tresor.sql). Visiteur — ou migration pas encore passée — : démo.
export default async function TresorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let live = false
  let coins = MOCK_COINS
  let shop = getMockShop()
  let collection = getMockCollection()
  let chestOpened = false

  if (user) {
    const [{ data: profile, error }, { data: purchases }, { data: unlocks }, { data: chest }] =
      await Promise.all([
        supabase.from('profiles').select('coins').eq('id', user.id).maybeSingle(),
        supabase.from('shop_purchases').select('item_id').eq('user_id', user.id),
        supabase
          .from('collection_unlocks')
          .select('item_id')
          .eq('user_id', user.id),
        supabase
          .from('chest_opens')
          .select('date')
          .eq('user_id', user.id)
          .eq('date', toDayKey(new Date()))
          .maybeSingle(),
      ])

    if (error) {
      // Migration 018 pas encore exécutée : l'onglet reste visitable en démo.
      console.error('[tresor] données indisponibles (migration 018 ?):', error.message)
    } else {
      live = true
      const n = Number(profile?.coins)
      coins = Number.isFinite(n) ? n : 0
      shop = shopWithOwnership(
        new Set((purchases ?? []).map((p) => String(p.item_id))),
      )
      collection = collectionWithUnlocks(
        new Set((unlocks ?? []).map((u) => String(u.item_id))),
      )
      chestOpened = Boolean(chest)
    }
  }

  return (
    <div>
      <PageHeader
        title="Trésor"
        description="Ton XP se transforme en pièces — ouvre, dépense, collectionne."
      />
      <TresorHome
        live={live}
        initialCoins={coins}
        shop={shop}
        collection={collection}
        chestOpened={chestOpened}
      />
    </div>
  )
}
