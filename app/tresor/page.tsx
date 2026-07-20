import TabHeader from '@/components/TabHeader'
import PremiumHome from '@/components/PremiumHome'
import { getUserTier } from '@/lib/subscription'

export const metadata = { title: 'Premium — Studuel' }
export const dynamic = 'force-dynamic'

// Onglet de conversion (extrême droite) : présente les offres et donne envie de
// passer au payant. Le coffre / boutique / collection a migré vers l'icône
// « coffre » de l'onglet Moi (route /coffre).
export default async function TresorPage() {
  const tier = await getUserTier()

  return (
    <div>
      <TabHeader
        title="Trésor"
        subtitle="Débloque tout Studuel, sans limite."
      />
      <PremiumHome currentTier={tier} />
    </div>
  )
}
