import { enregistrerFinCourse } from '@/lib/duel/fin-course-server'
import type { DuelCourseInput } from '@/lib/duel/fin-course'

// La fin d'une course classée. Route API (et pas une Server Action) pour que
// l'écran puisse INTERROMPRE un envoi resté sans réponse et le RELANCER : Next
// exécute les Server Actions une par une, et un appel bloqué par le réseau
// bloquait toute relance derrière lui. Rejouer est sans risque — la course
// porte son identifiant (lib/duel/envoi, migration 374).

/** Une course pèse quelques kilo-octets (50 pas, 50 réponses au plus). */
const CORPS_MAX_OCTETS = 64 * 1024

export async function POST(request: Request): Promise<Response> {
  // Même origine seulement : la route écrit au nom de l'élève connecté.
  const origine = request.headers.get('origin')
  const hote = request.headers.get('host')
  if (origine && hote) {
    try {
      if (new URL(origine).host !== hote) return new Response(null, { status: 403 })
    } catch {
      return new Response(null, { status: 403 })
    }
  }

  const brut = await request.text()
  if (brut.length > CORPS_MAX_OCTETS) return new Response(null, { status: 413 })
  let input: DuelCourseInput
  try {
    input = JSON.parse(brut) as DuelCourseInput
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!input || typeof input !== 'object') return new Response(null, { status: 400 })

  const resultat = await enregistrerFinCourse(input)
  if (resultat.statut === 'non_connecte') return new Response(null, { status: 401 })
  return Response.json(resultat, { headers: { 'Cache-Control': 'no-store' } })
}
