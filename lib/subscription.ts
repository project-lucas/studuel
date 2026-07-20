import { createClient } from '@/lib/supabase/server'

// Niveaux d'abonnement du PRD + 'anonymous' pour les visiteurs non connectés.
export type Tier = 'anonymous' | 'free' | 'tier1' | 'tier2' | 'tier3'

// La liste des paliers payants est définie une seule fois, dans lib/gems.ts —
// module PUR, donc importable aussi bien ici (serveur) que par les composants
// client. L'inverse ne serait pas vrai : ce fichier-ci tire le client Supabase
// serveur, et le réexporter vers un composant client casserait le bundle.
import { PREMIUM_TIERS } from '@/lib/gems'

// Récupère le niveau d'abonnement de l'utilisateur courant (côté serveur).
// Visiteur non connecté → 'anonymous' (traité comme 'free' pour l'accès).
export async function getUserTier(): Promise<Tier> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return 'anonymous'

    return await getUserTierFor(supabase, user.id)
  } catch {
    // Supabase injoignable : on retombe sur l'accès minimal.
    return 'anonymous'
  }
}

// Variante pour les pages qui ont DÉJÀ le client et l'utilisateur en main :
// évite de revalider le JWT auprès de l'Auth API (aller-retour réseau) et de
// recréer un client — une seule lecture profiles. À préférer partout où
// auth.getUser() a déjà été appelé dans le rendu.
export async function getUserTierFor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<Tier> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    return (profile?.subscription_tier as Tier) ?? 'free'
  } catch {
    return 'free'
  }
}

// Studuel+ (tier1) et au-dessus débloquent les tests premium.
export function canAccessPremiumTests(tier: Tier): boolean {
  return PREMIUM_TIERS.includes(tier)
}

// Les cartes mentales des chapitres sont réservées aux abonnés Studuel+.
// Les gratuits voient la tuile mais ne peuvent pas l'ouvrir.
export function canAccessMindMaps(tier: Tier): boolean {
  return PREMIUM_TIERS.includes(tier)
}
