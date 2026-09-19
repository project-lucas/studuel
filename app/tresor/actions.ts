'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { estPlanPayant, verifierContact, verifierNote } from '@/lib/abonnement'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// Le coffre du jour, le cadeau de connexion et la boutique en écus ont quitté
// l'onglet avec la refonte du 18/09/2026 : les achats en gemmes vivent dans
// capsules-actions.ts (capsules) et boutique-actions.ts (boosts, objets).
// Il ne reste ici que la demande d'abonnement.

// -----------------------------------------------------------------------------
// LA CAISSE, v0 (migration 221)
//
// Avant : cliquer « Choisir cette offre » affichait « le paiement arrive très
// bientôt » et n'écrivait RIEN. On ne savait donc même pas combien de familles
// avaient voulu payer — la donnée la plus précieuse du produit était jetée à
// chaque clic.
//
// Maintenant : l'intention est enregistrée (offre, contact facultatif, note),
// et un admin peut accorder l'abonnement pour de vrai depuis /admin/abonnements
// une fois le paiement encaissé hors de l'app.
//
// Tolérant à l'absence de la 221 (convention du projet : le code se déploie
// AVANT la migration) — dans ce cas on répond `indisponible`, et l'écran le dit
// franchement au lieu de faire semblant d'avoir enregistré.
// -----------------------------------------------------------------------------

export type InteretResult =
  | { statut: 'enregistre' }
  | { statut: 'deja' }
  | { statut: 'invalide'; raison: string }
  | { statut: 'indisponible' }
  | { statut: 'erreur' }

export async function declarerInteret(
  planId: string,
  contactBrut?: string | null,
  noteBrute?: string | null,
): Promise<InteretResult> {
  if (!estPlanPayant(planId)) return { statut: 'invalide', raison: 'Offre inconnue.' }

  const contact = verifierContact(contactBrut)
  if (!contact.ok) return { statut: 'invalide', raison: contact.raison }

  const user = await getCurrentUser()
  if (!user) return { statut: 'erreur' }

  const supabase = await createClient()
  const { error } = await supabase.from('subscription_interest').insert({
    user_id: user.id,
    plan_id: planId,
    contact: contact.valeur,
    note: verifierNote(noteBrute),
  })

  if (error) {
    // 23505 = l'unicité (user, offre, jour) : l'élève a déjà demandé
    // aujourd'hui. Ce n'est pas une panne, c'est le garde anti-spam.
    if (error.code === '23505') return { statut: 'deja' }
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    console.error('[abonnement] intérêt non enregistré:', error.message)
    return { statut: 'erreur' }
  }

  revalidatePath('/tresor')
  return { statut: 'enregistre' }
}
