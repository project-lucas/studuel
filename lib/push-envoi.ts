import 'server-only'

import { createClient as createAdmin, type SupabaseClient } from '@supabase/supabase-js'
import webpush from 'web-push'

/**
 * L'ENVOI D'UNE NOTIFICATION PUSH, depuis le serveur, pour un événement qui
 * n'attend pas de planification (un message reçu, une annonce publiée). Même
 * mécanique que les rappels (app/api/push/send) et le défi d'un ami : la clé
 * service n'est utilisée que pour lire les appareils CIBLES, rendus par une RPC
 * réservée au rôle service qui vérifie elle-même le droit d'envoyer, et pour
 * retirer un abonnement expiré.
 */

export type Appareil = { endpoint: string; p256dh: string; auth: string }
export type MessagePush = { kind: string; title: string; body: string; url: string }

/** Le client service, ou null si l'envoi n'est pas configuré (dev, aperçu). */
export function clientService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !cle || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return null
  return createAdmin(url, cle, { auth: { persistSession: false } })
}

/** Envoie à chaque appareil ; retire ceux qui n'existent plus. Rend le nombre envoyé. */
export async function envoyerPushs(
  admin: SupabaseClient,
  envois: readonly { appareil: Appareil; message: MessagePush }[],
): Promise<number> {
  const pub = process.env.VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv || envois.length === 0) return 0
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'mailto:contact@studuel.app', pub, priv)
  let n = 0
  // Par paquets de 50 : une annonce à tous peut viser des milliers d'appareils.
  for (let i = 0; i < envois.length; i += 50) {
    await Promise.all(
      envois.slice(i, i + 50).map(async ({ appareil, message }) => {
        try {
          await webpush.sendNotification(
            { endpoint: appareil.endpoint, keys: { p256dh: appareil.p256dh, auth: appareil.auth } },
            JSON.stringify(message),
          )
          n += 1
        } catch (err: unknown) {
          const code = err && typeof err === 'object' && 'statusCode' in err ? (err as { statusCode?: number }).statusCode : undefined
          if (code === 404 || code === 410) {
            await admin.from('push_subscriptions').delete().eq('endpoint', appareil.endpoint)
          } else {
            console.error('[push] envoi :', code ?? err)
          }
        }
      }),
    )
  }
  return n
}
