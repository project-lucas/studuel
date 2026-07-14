import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { srsMessage, streakMessage, type PushMessage } from '@/lib/notifications'

// Endpoint déclenché par le cron Vercel (cf. vercel.json) pour envoyer les
// rappels push. Deux passes selon ?type= :
//   - srs    : « X cartes à revoir » (le matin)
//   - streak : « ta série est en jeu » (le soir)
// Sécurisé par l'en-tête Authorization: Bearer $CRON_SECRET (posé par Vercel).
// Utilise la clé service_role (RLS contournée) pour lire tous les abonnés.

export const dynamic = 'force-dynamic'

type Target = {
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  due_count?: number
  top_subject?: string | null
  streak?: number
}

function todayKeyUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

// Comparaison à temps constant du secret cron (évite qu'une attaque par timing
// puisse deviner CRON_SECRET caractère par caractère). Échoue fermé.
function matchesCronSecret(authHeader: string | null, secret: string): boolean {
  if (!authHeader) return false
  const provided = Buffer.from(authHeader)
  const expected = Buffer.from(`Bearer ${secret}`)
  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (!secret || !matchesCronSecret(authHeader, secret)) {
    return new Response(null, { status: 401 })
  }

  const url = new URL(request.url)
  const type = url.searchParams.get('type') ?? 'srs'
  if (type !== 'srs' && type !== 'streak') {
    return new Response('unknown type', { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const vapidPublic = process.env.VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!supabaseUrl || !serviceKey || !vapidPublic || !vapidPrivate) {
    return new Response('push not configured', { status: 503 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? 'mailto:contact@studuel.app',
    vapidPublic,
    vapidPrivate,
  )

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  const today = todayKeyUtc()
  const rpcName = type === 'srs' ? 'push_srs_targets' : 'push_streak_targets'
  const { data, error } = await admin.rpc(rpcName, { p_today: today })
  if (error) {
    console.error('push targets', error)
    return new Response('targets failed', { status: 500 })
  }

  const targets = (data ?? []) as Target[]
  let sent = 0
  let pruned = 0

  await Promise.all(
    targets.map(async (t) => {
      const message: PushMessage | null =
        type === 'srs'
          ? srsMessage(Number(t.due_count ?? 0), t.top_subject ?? null)
          : streakMessage(Number(t.streak ?? 0), false)
      if (!message) return

      try {
        await webpush.sendNotification(
          { endpoint: t.endpoint, keys: { p256dh: t.p256dh, auth: t.auth } },
          JSON.stringify(message),
        )
        sent += 1
      } catch (err: unknown) {
        // 404/410 : abonnement expiré → on le supprime.
        const statusCode =
          err && typeof err === 'object' && 'statusCode' in err
            ? (err as { statusCode?: number }).statusCode
            : undefined
        if (statusCode === 404 || statusCode === 410) {
          await admin
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', t.endpoint)
          pruned += 1
        } else {
          console.error('push send', statusCode ?? err)
        }
      }
    }),
  )

  return Response.json({ type, targets: targets.length, sent, pruned })
}
