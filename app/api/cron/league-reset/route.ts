import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

// Endpoint déclenché par le cron Vercel (cf. vercel.json), chaque lundi : clôt la
// semaine de ligue écoulée en appelant process_league_rollover() — les 5 premiers
// de chaque palier montent, les 5 derniers descendent. Idempotent côté base
// (journal league_rollovers). Sécurisé par Authorization: Bearer $CRON_SECRET et
// exécuté avec la clé service_role (seule habilitée à lancer le rollover).

export const dynamic = 'force-dynamic'

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return new Response('league cron not configured', { status: 503 })
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  const { data, error } = await admin.rpc('process_league_rollover')
  if (error) {
    console.error('league rollover', error)
    return new Response('rollover failed', { status: 500 })
  }

  return Response.json({ ok: true, result: data })
}
