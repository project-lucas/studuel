import { lireRapport } from '@/lib/erreurs'
import { enregistrerErreur } from '@/lib/erreurs-server'
import { createClient } from '@/lib/supabase/server'

// LA REMONTÉE D'UNE ERREUR DU NAVIGATEUR (12/10/2026). Reçoit le rapport de
// `signalerErreur` (lib/erreurs-client) — par `sendBeacon`, donc sans attendre
// de réponse — et le range dans `erreurs_app` par la RPC `erreur_signaler`.
//
// Le corps est de la donnée NON FIABLE : lu par `lireRapport` (type et borne
// chaque champ, impose la source), plafonné à 16 Ko avant même d'être analysé.
// Un visiteur sans compte peut signaler (l'onboarding est public) : la RPC
// borne la rafale, par élève et au total.
const CORPS_MAX = 16_000

export async function POST(request: Request): Promise<Response> {
  const texte = await request.text()
  if (texte.length > CORPS_MAX) return new Response(null, { status: 413 })

  let brut: unknown
  try {
    brut = JSON.parse(texte)
  } catch {
    return new Response(null, { status: 400 })
  }
  const rapport = lireRapport(brut, 'navigateur')
  if (!rapport) return new Response(null, { status: 400 })

  const supabase = await createClient()
  await enregistrerErreur(supabase, rapport, request.headers.get('user-agent'))
  return new Response(null, { status: 204 })
}
