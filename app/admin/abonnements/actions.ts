'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { verifierMois } from '@/lib/abonnement'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// Actions de l'écran /admin/abonnements — la caisse v0 (migration 221).
//
// ⚠️ AUCUNE de ces actions ne fait autorité : le droit d'accorder un
// abonnement est vérifié EN BASE, par `grant_subscription` (SECURITY DEFINER,
// `IF NOT public.is_admin() THEN RAISE`). Ce fichier n'est qu'un guichet — un
// appel direct à la RPC avec la clé anon publique échouerait de la même façon.
// C'est la règle du projet depuis la migration 088 : jamais de garde qui
// n'existe que côté client.

export type OctroiResult =
  | { statut: 'ok'; tier: string; expiresAt: string | null }
  | { statut: 'invalide'; raison: string }
  | { statut: 'indisponible' }
  | { statut: 'refuse' }
  | { statut: 'erreur'; message: string }

export async function accorderAbonnement(
  userId: string,
  tier: string,
  mois: number,
  reference?: string | null,
): Promise<OctroiResult> {
  const user = await getCurrentUser()
  if (!user) return { statut: 'refuse' }

  if (!['free', 'tier1', 'tier2', 'tier3'].includes(tier)) {
    return { statut: 'invalide', raison: 'Palier inconnu.' }
  }
  const duree = verifierMois(mois)
  if (duree === null) {
    return { statut: 'invalide', raison: 'Durée hors bornes (0 à 36 mois).' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('grant_subscription', {
    p_user_id: userId,
    p_tier: tier,
    p_months: duree,
    p_source: 'manuel',
    p_reference: (reference ?? '').trim() || null,
  })

  if (error) {
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    if (error.message?.includes('reserve aux administrateurs')) {
      return { statut: 'refuse' }
    }
    return { statut: 'erreur', message: error.message }
  }

  const ligne = Array.isArray(data) ? data[0] : data
  revalidatePath('/admin/abonnements')
  return {
    statut: 'ok',
    tier: (ligne?.tier as string) ?? tier,
    expiresAt: (ligne?.expires_at as string | null) ?? null,
  }
}

// Marque une demande comme traitée (elle ne disparaît jamais : la demande d'un
// parent n'a pas à s'effacer d'un clic — cf. l'absence de policy DELETE).
export async function marquerTraitee(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('subscription_interest')
    .update({ handled_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false }
  revalidatePath('/admin/abonnements')
  return { ok: true }
}

// Repasse en `free` les abonnements dont l'échéance est dépassée. Sans ce
// bouton, « 1 mois » voudrait dire « à vie » : la contrepartie honnête de
// l'échéance, c'est que quelqu'un la fasse appliquer.
export async function expirerAbonnements(): Promise<{
  ok: boolean
  nombre: number
}> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('expire_subscriptions')
  if (error) return { ok: false, nombre: 0 }
  revalidatePath('/admin/abonnements')
  return { ok: true, nombre: Number(data) || 0 }
}
