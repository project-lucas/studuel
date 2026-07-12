import { createClient } from '@/lib/supabase/server'

// Versement du temps de travail mesuré par le chrono du Défi.
// Route API (et pas une server action) pour être compatible avec
// navigator.sendBeacon : le navigateur garantit l'envoi même quand la page
// se ferme — là où un fetch classique est souvent tué sur mobile.
// Corps : le nombre de secondes, en texte brut (sendBeacon n'envoie pas de JSON).
export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response(null, { status: 401 })

  const n = Number(await request.text())
  if (!Number.isFinite(n) || n <= 0) {
    return new Response(null, { status: 400 })
  }
  // Plafond côté serveur aussi (défense en profondeur) : max 1 h par appel —
  // la fonction SQL add_work_time borne également (cf. 014_temps.sql).
  const capped = Math.min(Math.round(n), 3600)

  const { error } = await supabase.rpc('add_work_time', { p_seconds: capped })
  if (error) return new Response(null, { status: 500 })
  return new Response(null, { status: 204 })
}
