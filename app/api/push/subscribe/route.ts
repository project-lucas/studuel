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

  // Mise à jour de MON abonnement pour cet appareil, sinon création.
  //
  // Écrit ainsi plutôt qu'en `upsert(onConflict:…)` parce que la clé d'unicité
  // change de forme avec la migration 196 (`endpoint` seul → `endpoint,
  // user_id`, pour l'appareil familial) : un `onConflict` nommerait une clé qui
  // n'existe que d'un côté de la migration et casserait l'abonnement pendant la
  // fenêtre d'exécution. Ce couple update-puis-insert, lui, marche avec les
  // deux schémas.
  const { error: updateError, count } = await supabase
    .from('push_subscriptions')
    .update({ p256dh, auth }, { count: 'exact' })
    .eq('endpoint', endpoint)
    .eq('user_id', user.id)
  if (updateError) {
    console.error('push subscribe', updateError)
    return new Response(null, { status: 500 })
  }

  if (!count) {
    const { error } = await supabase
      .from('push_subscriptions')
      .insert({ user_id: user.id, endpoint, p256dh, auth })
    if (error) {
      // Avant la 196, l'endpoint appartient au PREMIER élève qui s'est abonné
      // sur ce navigateur : le second se heurte à la clé primaire et n'a aucun
      // recours. C'est précisément ce que la migration débloque.
      console.error('push subscribe', error)
      return new Response(null, { status: 500 })
    }
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
