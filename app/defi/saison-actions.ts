'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { TIER_COUNT, type Lane, type RewardKind } from '@/lib/saison'

// -----------------------------------------------------------------------------
// Encaissement d'un palier de saison.
//
// Le client annonce (palier, voie) ; le SERVEUR vérifie que le palier est
// atteint, que la voie est ouverte (abonnement pour la voie prestige), calcule
// lui-même la récompense depuis son propre barème, et la PK de season_claims
// empêche de la reprendre. Aucun montant ne transite depuis le navigateur.
// -----------------------------------------------------------------------------

export type SeasonClaimOutcome = {
  claimed: boolean
  kind: RewardKind | null
  amount: number
  title: string | null
}

const NONE: SeasonClaimOutcome = {
  claimed: false,
  kind: null,
  amount: 0,
  title: null,
}

export async function claimSeasonTier(
  tier: number,
  lane: Lane,
): Promise<SeasonClaimOutcome> {
  // Validation de forme AVANT le réseau : un palier hors piste ou une voie
  // inventée ne mérite pas un aller-retour.
  if (!Number.isInteger(tier) || tier < 1 || tier > TIER_COUNT) return NONE
  if (lane !== 'libre' && lane !== 'prestige') return NONE

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return NONE

  const { data, error } = await supabase.rpc('season_claim', {
    p_tier: tier,
    p_lane: lane,
  })
  if (error || !data) {
    if (error) console.error('[saison] palier non encaissé:', error.message)
    return NONE
  }

  const r = data as {
    claimed?: boolean
    kind?: string
    amount?: number
    title?: string | null
  }
  revalidatePath('/defi')
  revalidatePath('/moi')
  return {
    claimed: r.claimed === true,
    kind: (r.kind as RewardKind) ?? null,
    amount: Math.max(0, Number(r.amount) || 0),
    title: r.title ?? null,
  }
}
