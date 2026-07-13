import { createClient } from '@/lib/supabase/server'

// Enregistre (ou remplace) l'abonnement push de l'appareil courant.
// Corps JSON : { endpoint, keys: { p256dh, auth } } (format PushSubscription).
export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response(null, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }

  const sub = body as {
    endpoint?: unknown
    keys?: { p256dh?: unknown; auth?: unknown }
  }
  const endpoint = sub.endpoint
  const p256dh = sub.keys?.p256dh
  const auth = sub.keys?.auth
  if (
    typeof endpoint !== 'string' ||
    typeof p256dh !== 'string' ||
    typeof auth !== 'string'
  ) {
    return new Response(null, { status: 400 })
  }

  // upsert par endpoint : réabonnement du même appareil = simple mise à jour.
  const { error } = await supabase.from('push_subscriptions').upsert(
    { user_id: user.id, endpoint, p256dh, auth },
    { onConflict: 'endpoint' },
  )
  if (error) {
    console.error('push subscribe', error)
    return new Response(null, { status: 500 })
  }
  return new Response(null, { status: 204 })
}

// Désabonnement de l'appareil courant.
export async function DELETE(request: Request): Promise<Response> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response(null, { status: 401 })

  let endpoint: string | null = null
  try {
    const body = (await request.json()) as { endpoint?: unknown }
    if (typeof body.endpoint === 'string') endpoint = body.endpoint
  } catch {
    endpoint = null
  }
  if (!endpoint) return new Response(null, { status: 400 })

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)
    .eq('user_id', user.id)
  if (error) {
    console.error('push unsubscribe', error)
    return new Response(null, { status: 500 })
  }
  return new Response(null, { status: 204 })
}
