'use server'

import { createClient } from '@/lib/supabase/server'
import { messageErreurBase, type TypeFil } from '@/lib/messagerie/fil'
import { lireMessages } from '@/lib/messagerie/server'
import { CONSIGNE_RESUME, filPourResume, masquerNoms } from '@/lib/coach/assistant'
import { prendreJetonIA } from '@/lib/coach/suivi-server'
import { demanderTexte } from '@/lib/coach/claude-server'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TYPES: readonly TypeFil[] = ['eleve', 'parent', 'trio']

/** Ouvre (ou retrouve) un fil : la base vérifie le lien coach ↔ élève et le consentement. */
export async function ouvrirFilAction(
  eleveId: string,
  type: TypeFil,
  consentement: 'papier' | 'majeur' | null,
): Promise<{ ok: true; id: string } | { ok: false; erreur: string }> {
  if (!UUID.test(eleveId) || !TYPES.includes(type)) return { ok: false, erreur: 'Demande invalide.' }
  if (consentement !== null && consentement !== 'papier' && consentement !== 'majeur') return { ok: false, erreur: 'Demande invalide.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('messagerie_ouvrir', { p_eleve: eleveId, p_type: type, p_consentement: consentement, p_parent: null })
  if (error || typeof data !== 'string') return { ok: false, erreur: messageErreurBase(error?.message) }
  return { ok: true, id: data }
}

/**
 * Le résumé d'un fil par l'assistant (Claude). Les messages sont relus par la
 * RPC (qui vérifie que je peux lire le fil) ; aucun prénom ne part : les
 * auteurs deviennent COACH, ÉLÈVE, PARENT.
 */
export async function resumerFilAction(conversationId: string): Promise<{ ok: true; texte: string } | { ok: false; erreur: string }> {
  if (!UUID.test(conversationId)) return { ok: false, erreur: 'Demande invalide.' }
  const messages = await lireMessages(conversationId, null, 120)
  if (!messages || messages.length === 0) return { ok: false, erreur: 'Rien à résumer.' }
  // Le jeton vérifie aussi que je suis coach (un élève membre du fil n'y a pas droit).
  const refus = await prendreJetonIA()
  if (refus) return { ok: false, erreur: refus }
  // Les prénoms des membres, écrits dans les messages, ne partent pas non plus.
  const texte = masquerNoms(filPourResume(messages), messages.map((m) => m.auteurPrenom), '[Nom]')
  const r = await demanderTexte(CONSIGNE_RESUME, texte, 1500)
  return r.ok ? { ok: true, texte: r.valeur } : { ok: false, erreur: r.erreur }
}
