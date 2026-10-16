'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { verifierContact } from '@/lib/abonnement'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { rechargeParId } from '@/lib/coach/recharges'

// -----------------------------------------------------------------------------
// Demander une recharge de Marcel (migration 581). Même circuit qu'un pack de
// gemmes : l'app n'encaisse pas encore d'euros, la demande est enregistrée avec
// le contact facultatif d'un parent, et les crédits arrivent quand l'admin
// confirme le paiement (`accorder_recharge_marcel`).
// -----------------------------------------------------------------------------

export async function demanderRechargeMarcel(
  id: string,
  contactBrut?: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!rechargeParId(id)) return { ok: false, message: 'Cette recharge n’existe plus.' }
  const contact = verifierContact(contactBrut)
  if (!contact.ok) return { ok: false, message: contact.raison }

  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Connecte-toi pour recharger Marcel.' }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('demander_recharge_marcel', {
    p_recharge: id,
    p_contact: contact.valeur,
  })
  if (error) {
    if (isMissingSchemaObject(error) || error.code === 'PGRST202') {
      return { ok: false, message: 'Les recharges de Marcel arrivent très bientôt.' }
    }
    console.error('[recharges] demande impossible :', error.message)
    return { ok: false, message: 'Impossible pour le moment. Réessaie dans un instant.' }
  }

  const r = (data ?? {}) as { ok?: boolean; raison?: string }
  if (!r.ok) {
    return {
      ok: false,
      message: r.raison === 'anonyme' ? 'Connecte-toi pour recharger Marcel.' : 'Cette recharge n’existe plus.',
    }
  }
  return { ok: true }
}
