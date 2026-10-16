import { createClient } from '@/lib/supabase/server'

/**
 * CE QUI ATTEND L'ÉLÈVE OU LE PARENT au lancement (16/10/2026) : les annonces
 * et sondages qui le visent (588) et ses messages non lus (587/591). Un GET,
 * pas une Server Action (elles passent une par une). Vide sans les migrations.
 */
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const [annonces, suivi] = await Promise.all([supabase.rpc('annonces_pour_moi'), supabase.rpc('mon_suivi_coach')])
  const d = !suivi.error && suivi.data && typeof suivi.data === 'object' ? (suivi.data as { non_lus?: number }) : null
  return Response.json(
    {
      annonces: !annonces.error && Array.isArray(annonces.data) ? annonces.data : [],
      nonLus: Number(d?.non_lus ?? 0) || 0,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
