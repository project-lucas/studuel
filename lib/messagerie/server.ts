import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { clientService, envoyerPushs } from '@/lib/push-envoi'
import { filDepuis, messageDepuis, type Fil, type Message } from '@/lib/messagerie/fil'

/**
 * LES LECTURES DE LA MESSAGERIE (migration 587). Chacune rend `null` quand la
 * migration n'est pas passée : la page le dit au lieu de planter.
 */

export async function lireFils(tous = false): Promise<Fil[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('messagerie_fils', { p_tous: tous })
  if (error) return null
  return (Array.isArray(data) ? data : []).map((r) => filDepuis(r as Record<string, unknown>))
}

export async function lireMessages(conv: string, avant: string | null = null, limite = 60): Promise<Message[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('messagerie_messages', { p_conv: conv, p_avant: avant, p_limite: limite })
  if (error) return null
  return (Array.isArray(data) ? data : []).map((r) => messageDepuis(r as Record<string, unknown>))
}

export type FilEnfant = { conversationId: string; elevePrenom: string; coachPrenom: string; creeLe: string; dernierMessageLe: string | null; messages: number }

export async function lireFilsEnfants(): Promise<FilEnfant[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('messagerie_fils_enfants')
  if (error || !Array.isArray(data)) return []
  return data.map((r) => {
    const x = r as Record<string, unknown>
    return {
      conversationId: String(x.conversation_id ?? ''),
      elevePrenom: String(x.eleve_prenom ?? ''),
      coachPrenom: String(x.coach_prenom ?? ''),
      creeLe: String(x.cree_le ?? ''),
      dernierMessageLe: typeof x.dernier_message_le === 'string' ? x.dernier_message_le : null,
      messages: Number(x.messages ?? 0) || 0,
    }
  })
}

const LIBELLE_ROLE: Record<string, string> = { coach: 'ton coach', eleve: 'un élève', parent: 'un parent' }

/**
 * La notification d'un message tout juste envoyé, aux AUTRES membres du fil.
 * La RPC vérifie que l'auteur est bien celui de la session, que le message a
 * moins de 10 minutes et qu'on ne l'a pas déjà notifié.
 */
export async function notifierMessage(messageId: string, auteurId: string, versCoach: string, versAutres: string): Promise<number> {
  const admin = clientService()
  if (!admin) return 0
  const { data, error } = await admin.rpc('messagerie_cibles_push', { p_message: messageId, p_auteur: auteurId })
  if (error || !Array.isArray(data) || data.length === 0) return 0
  const envois = data.map((r) => {
    const t = r as {
      endpoint: string; p256dh: string; auth: string; auteur: string; role: string | null
      destinataire: string | null; conversation_id: string; extrait: string | null
    }
    const deCoach = t.role === 'coach'
    return {
      appareil: { endpoint: t.endpoint, p256dh: t.p256dh, auth: t.auth },
      message: {
        kind: `message-${t.conversation_id}`,
        title: deCoach ? `Message de ${t.auteur}` : `${t.auteur} (${LIBELLE_ROLE[t.role ?? ''] ?? 'message'})`,
        // Jamais le contenu : la notification s'affiche sur l'écran verrouillé.
        body: deCoach ? 'Nouveau message de ton coach' : 'Nouveau message',
        // Chaque destinataire ouvre SA messagerie : la console pour le coach.
        url: `${t.destinataire === 'coach' ? versCoach : versAutres}?fil=${t.conversation_id}`,
      },
    }
  })
  return envoyerPushs(admin, envois)
}
