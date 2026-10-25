'use server'

import { createClient } from '@/lib/supabase/server'
import { messageSuppression, motConfirme } from '@/lib/suppression-compte'

/**
 * « Supprimer mon compte » (Mon compte, 25/10/2026, migration 596) : exigé par
 * Apple, Google Play et le RGPD. Le serveur revérifie le mot, la base le
 * revérifie encore (`compte_supprimer`) puis efface `auth.users` — tout le
 * reste suit par les clés étrangères.
 *
 * Pas de redirection ici : le client recharge la page entière (les onglets
 * gardés vivants tiennent encore les données du compte effacé).
 */
export type ResultatSuppression = { ok: true } | { ok: false; erreur: string }

export async function supprimerCompte(formData: FormData): Promise<ResultatSuppression> {
  const mot = String(formData.get('confirmation') ?? '')
  if (!motConfirme(mot)) return { ok: false, erreur: messageSuppression('confirmation') }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('compte_supprimer', { p_confirmation: 'SUPPRIMER' })
  if (error) return { ok: false, erreur: messageSuppression('panne') }
  if (data !== 'ok') return { ok: false, erreur: messageSuppression(String(data)) }

  // Le compte n'existe plus : on efface la session du navigateur sans
  // appeler le serveur d'auth, qui ne connaît plus l'utilisateur.
  await supabase.auth.signOut({ scope: 'local' })
  return { ok: true }
}
