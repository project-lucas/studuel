import { after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { notifierMessage } from '@/lib/messagerie/server'

/**
 * LA MESSAGERIE, CÔTÉ ROUTE (migration 587).
 *
 * GET  → { nonLus } : la pastille de l'icône (console et app), relue en douce.
 * POST { messageId } → la notification push du message que l'on vient
 *       d'envoyer (le message lui-même part du navigateur par la RPC
 *       `message_envoyer`, directement : pas de Server Action, elles
 *       s'exécutent une par une et une conversation en enchaîne beaucoup).
 */
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('messagerie_non_lus')
  return Response.json({ nonLus: error ? 0 : Number(data ?? 0) || 0 }, { headers: { 'Cache-Control': 'no-store' } })
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request): Promise<Response> {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  let corps: unknown
  try {
    corps = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }
  const messageId = (corps as { messageId?: unknown })?.messageId
  if (typeof messageId !== 'string' || !UUID.test(messageId)) return new Response(null, { status: 400 })
  // La notification part après la réponse : l'envoi du message n'attend rien.
  after(() => notifierMessage(messageId, user.id, '/coach/messages', '/messages').then(() => undefined))
  return new Response(null, { status: 202 })
}
