'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { verifierContact } from '@/lib/abonnement'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { packParId } from '@/lib/boutique/packs-gemmes'

// -----------------------------------------------------------------------------
// Demander un pack de gemmes (migration 369). L'app n'encaisse pas encore
// d'euros : la demande est enregistrée avec le contact facultatif d'un parent,
// et les gemmes arrivent quand l'admin confirme le paiement.
// -----------------------------------------------------------------------------

export async function demanderPackGemmes(
  id: string,
  contactBrut?: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!packParId(id)) return { ok: false, message: 'Ce pack n’existe plus.' }
  const contact = verifierContact(contactBrut)
  if (!contact.ok) return { ok: false, message: contact.raison }

  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Connecte-toi pour acheter des gemmes.' }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('demander_pack_gemmes', {
    p_pack: id,
    p_contact: contact.valeur,
  })
  if (error) {
    if (isMissingSchemaObject(error)) {
      return { ok: false, message: 'La boutique des gemmes ouvre très bientôt.' }
    }
    console.error('[gemmes] demande impossible :', error.message)
    return { ok: false, message: 'Impossible pour le moment. Réessaie dans un instant.' }
  }

  const r = (data ?? {}) as { ok?: boolean; raison?: string }
  if (!r.ok) {
    return {
      ok: false,
      message: r.raison === 'anonyme' ? 'Connecte-toi pour acheter des gemmes.' : 'Ce pack n’existe plus.',
    }
  }
  revalidatePath('/tresor')
  return { ok: true }
}
