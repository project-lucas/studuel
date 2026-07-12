import { createClient } from '@/lib/supabase/server'

// Niveaux d'abonnement du PRD + 'anonymous' pour les visiteurs non connectés.
export type Tier = 'anonymous' | 'free' | 'tier1' | 'tier2' | 'tier3'

const PREMIUM_TIERS: Tier[] = ['tier1', 'tier2', 'tier3']

// Récupère le niveau d'abonnement de l'utilisateur courant (côté serveur).
// Visiteur non connecté → 'anonymous' (traité comme 'free' pour l'accès).
export async function getUserTier(): Promise<Tier> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return 'anonymous'

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    return (profile?.subscription_tier as Tier) ?? 'free'
  } catch {
    // Supabase injoignable : on retombe sur l'accès minimal.
    return 'anonymous'
  }
}

// Offre 1 (tier1) et supérieures débloquent les tests premium.
export function canAccessPremiumTests(tier: Tier): boolean {
  return PREMIUM_TIERS.includes(tier)
}

// Les cartes mentales des chapitres sont réservées aux abonnés (Offre 1+).
// Les gratuits voient la tuile mais ne peuvent pas l'ouvrir.
export function canAccessMindMaps(tier: Tier): boolean {
  return PREMIUM_TIERS.includes(tier)
}
