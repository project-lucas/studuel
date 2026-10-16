import { createClient } from '@/lib/supabase/server'

// LE JOURNAL D'USAGE (16/10/2026, migration 590). Reçoit un lot d'événements
// de `lib/evenements-client` — par `sendBeacon`, sans attendre de réponse — et
// le confie à la RPC `evenements_signaler`, seule porte d'écriture, qui borne,
// nettoie et plafonne. Le corps est de la donnée NON FIABLE : plafonné à 24 Ko
// avant d'être analysé, la forme vérifiée, la RPC refait tout le reste.
const CORPS_MAX = 24_000

// Une borne par adresse IP, en mémoire de l'instance (au mieux : une instance
// serverless ne voit qu'une part du trafic) — la RPC borne aussi par session
// et au total. 30 lots par minute, c'est déjà 1 500 événements.
const LOTS_PAR_MINUTE = 30
const parIp = new Map<string, { debut: number; n: number }>()

function tropDeLots(ip: string): boolean {
  const maintenant = Date.now()
  const e = parIp.get(ip)
  if (!e || maintenant - e.debut > 60_000) {
    if (parIp.size > 5000) parIp.clear()
    parIp.set(ip, { debut: maintenant, n: 1 })
    return false
  }
  e.n += 1
  return e.n > LOTS_PAR_MINUTE
}

export async function POST(request: Request): Promise<Response> {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'inconnue'
  if (tropDeLots(ip)) return new Response(null, { status: 429 })
  const texte = await request.text()
  if (texte.length > CORPS_MAX) return new Response(null, { status: 413 })

  let brut: unknown
  try {
    brut = JSON.parse(texte)
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!brut || typeof brut !== 'object') return new Response(null, { status: 400 })
  const { session, lot } = brut as { session?: unknown; lot?: unknown }
  if (typeof session !== 'string' || !/^[A-Za-z0-9_-]{8,40}$/.test(session) || !Array.isArray(lot)) {
    return new Response(null, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('evenements_signaler', { p_session: session, p_lot: lot.slice(0, 50) })
  // Migration 590 absente : on se tait (204), le navigateur n'a rien à en faire.
  if (error && !/evenements_signaler/.test(error.message)) {
    console.error('[evenements] lot refusé :', error.message)
  }
  return new Response(null, { status: 204 })
}
