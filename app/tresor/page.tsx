import TabHeader from '@/components/TabHeader'
import WorldBackdrop from '@/components/WorldBackdrop'
import TresorSpaces from '@/components/TresorSpaces'
import PremiumHome from '@/components/PremiumHome'
import TresorHome from '@/components/TresorHome'
import CapsulesShelf from '@/components/CapsulesShelf'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTier } from '@/lib/subscription'
import { toDayKey } from '@/lib/streak'
import { fetchGems } from '@/lib/gems-access'
import { STARTING_GEMS } from '@/lib/gems'
import {
  getMockShop,
  getMockCollection,
  shopWithOwnership,
  collectionWithUnlocks,
  MOCK_COINS,
} from '@/lib/tresor'

export const metadata = { title: 'Boutique — Studuel' }
export const dynamic = 'force-dynamic'

// L'onglet Boutique fusionne les deux économies, chacune dans son volet :
// « Objets » = les PIÈCES uniquement (coffre du jour en tête, rayons de
// boosts, compagnons & collection, fonds & skins), « Studuel+ » = les EUROS
// (capsules vidéo du coach en tête, puis les abonnements). Connecté : données
// réelles (018_tresor.sql). Visiteur — ou migration pas encore passée — : démo.
export default async function TresorPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  let live = false
  let coins = MOCK_COINS
  let gems = STARTING_GEMS
  let shop = getMockShop()
  let collection = getMockCollection()
  let chestOpened = false

  // L'abonnement se résout en parallèle des données boutique (attendu en bas).
  const tierPromise = getUserTier()

  if (user) {
    const [
      { data: profile, error },
      { data: purchases },
      { data: unlocks },
      { data: chest },
      gemsBalance,
    ] = await Promise.all([
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
      // Gemmes (migration 183) : le helper a son propre repli.
      fetchGems(supabase, user.id),
    ])

    gems = gemsBalance

    if (error) {
      // Migration 018 pas encore exécutée : la page reste visitable en démo.
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

  const tier = await tierPromise

  return (
    <div>
      {/* Le fond de l'onglet. Porté sur <body> par WorldBackdrop (et pas posé
          ici en `fixed`) : le conteneur de balayage applique un transform
          pendant le geste, ce qui recadrerait un fond fixé dans la page. */}
      <WorldBackdrop className="tab-bg" />

      <TabHeader
        title="Boutique"
        subtitle="Ton coffre du jour, tes pièces, et tout ce qu’elles ouvrent."
      />
      <TresorSpaces
        boutique={
          <TresorHome
            live={live}
            initialCoins={coins}
            gems={gems}
            shop={shop}
            collection={collection}
            chestOpened={chestOpened}
          />
        }
        premium={
          <div className="flex flex-col gap-8">
            {/* Les capsules du coach passent DEVANT les cartes d'abonnement :
                on montre ce qu'on achète avant de montrer ce que ça coûte.
                Une page qui s'ouvre sur trois tarifs demande de décider ; une
                page qui s'ouvre sur le contenu donne d'abord envie. */}
            <CapsulesShelf />
            <PremiumHome currentTier={tier} />
          </div>
        }
      />
    </div>
  )
}
