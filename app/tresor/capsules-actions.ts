'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { verifierContact } from '@/lib/abonnement'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// -----------------------------------------------------------------------------
// Acheter une capsule (migration 366). Le prix, le solde et l'unicité sont
// tranchés en base, sous verrou : ces actions ne font que transmettre et
// traduire la réponse en français.
// -----------------------------------------------------------------------------

export type ResultatAchatCapsule =
  | { ok: true; gemmes: number | null }
  | { ok: false; message: string }

const MESSAGES: Record<string, string> = {
  anonyme: 'Connecte-toi pour débloquer une capsule.',
  inconnue: 'Cette capsule n’est plus disponible.',
  deja: 'Cette capsule est déjà dans ta bibliothèque.',
  pas_assez: 'Il te manque des gemmes pour cette capsule.',
  pas_de_carte: 'Cette capsule ne se paie pas par carte.',
}

const INDISPONIBLE = 'La boutique des capsules ouvre très bientôt.'
const PANNE = 'Impossible pour le moment. Réessaie dans un instant.'

function rafraichir() {
  revalidatePath('/tresor')
  revalidatePath('/carnet')
  revalidatePath('/reviser')
}

function idValide(id: string): boolean {
  return /^[a-z0-9-]{2,40}$/.test(id)
}

export async function acheterCapsule(id: string): Promise<ResultatAchatCapsule> {
  if (!idValide(id)) return { ok: false, message: MESSAGES.inconnue }
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: MESSAGES.anonyme }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('acheter_capsule', { p_capsule: id })
  if (error) {
    if (isMissingSchemaObject(error)) return { ok: false, message: INDISPONIBLE }
    console.error('[capsules] achat impossible :', error.message)
    return { ok: false, message: PANNE }
  }

  const r = (data ?? {}) as { ok?: boolean; raison?: string; gemmes?: number }
  if (!r.ok) return { ok: false, message: MESSAGES[r.raison ?? ''] ?? PANNE }
  rafraichir()
  return { ok: true, gemmes: typeof r.gemmes === 'number' ? r.gemmes : null }
}

/**
 * « Payer par carte » : l'app n'encaisse pas encore d'euros. La demande est
 * enregistrée avec le contact facultatif d'un parent, et la capsule devient
 * active dès que le paiement est confirmé (`accorder_capsule`).
 */
export async function demanderCapsuleCarte(
  id: string,
  contactBrut?: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!idValide(id)) return { ok: false, message: MESSAGES.inconnue }
  const contact = verifierContact(contactBrut)
  if (!contact.ok) return { ok: false, message: contact.raison }

  const user = await getCurrentUser()
  if (!user) return { ok: false, message: MESSAGES.anonyme }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('demander_capsule_carte', {
    p_capsule: id,
    p_contact: contact.valeur,
  })
  if (error) {
    if (isMissingSchemaObject(error)) return { ok: false, message: INDISPONIBLE }
    console.error('[capsules] demande carte impossible :', error.message)
    return { ok: false, message: PANNE }
  }

  const r = (data ?? {}) as { ok?: boolean; raison?: string }
  if (!r.ok) return { ok: false, message: MESSAGES[r.raison ?? ''] ?? PANNE }
  revalidatePath('/tresor')
  return { ok: true }
}
