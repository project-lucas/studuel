import { getServerAuth } from '@/lib/supabase/user'
import { parserBrouillon } from '@/lib/quiz-brouillon'

// LA MANCHE INACHEVÉE, RECOPIÉE EN BASE (28/10/2026, migration 604).
//
// Une route et pas une Server Action : Next exécute les actions une par une,
// et cette écriture — envoyée quand l'élève quitte l'écran du quiz, en
// `keepalive` — ferait la queue devant `recordTestSession`. Le corps :
//
//   { quizId, brouillon }   la manche à jour (lib/quiz-brouillon) ;
//   { quizId, brouillon: null }   la manche est close, on l'efface.
//
// Le brouillon ne rapporte rien : le serveur juge la manche à la fin, jamais
// d'ici. Il est quand même validé champ par champ (`parserBrouillon`), borné en
// taille, et la RLS limite tout à l'élève connecté.

const TAILLE_MAX = 16_000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** Le ménage : les manches de l'élève de plus de deux jours partent à chaque écriture. */
const MENAGE_MS = 2 * 24 * 60 * 60 * 1000
/** « relation absente » (42P01 / PGRST205) : la 604 n'est pas exécutée. */
const TABLE_ABSENTE = new Set(['42P01', 'PGRST205'])

export async function POST(request: Request): Promise<Response> {
  // Un formulaire d'un autre site ne pose pas ce type : la requête serait
  // alors soumise au contrôle préalable du navigateur.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return new Response(null, { status: 415 })
  }
  const { supabase, user } = await getServerAuth()
  if (!user) return new Response(null, { status: 401 })

  const brut = await request.text()
  if (brut.length > TAILLE_MAX) return new Response(null, { status: 413 })

  let corps: unknown
  try {
    corps = JSON.parse(brut)
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!corps || typeof corps !== 'object') return new Response(null, { status: 400 })
  const { quizId, brouillon } = corps as { quizId?: unknown; brouillon?: unknown }
  if (typeof quizId !== 'string' || !UUID.test(quizId)) {
    return new Response(null, { status: 400 })
  }

  if (brouillon === null) {
    const { error } = await supabase
      .from('quiz_brouillons')
      .delete()
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
    return reponse(error)
  }

  const b = parserBrouillon(brouillon)
  if (!b || b.quizId !== quizId) return new Response(null, { status: 400 })

  const { error } = await supabase.from('quiz_brouillons').upsert(
    { user_id: user.id, quiz_id: quizId, etat: b, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,quiz_id' },
  )
  if (!error) {
    // Le ménage ne retarde pas la réponse de façon sensible (une ligne ou
    // deux, par l'index de l'élève) et son échec ne change rien.
    await supabase
      .from('quiz_brouillons')
      .delete()
      .eq('user_id', user.id)
      .lt('updated_at', new Date(Date.now() - MENAGE_MS).toISOString())
  }
  return reponse(error)
}

function reponse(error: { code?: string; message: string } | null): Response {
  if (!error) return new Response(null, { status: 204 })
  if (error.code && TABLE_ABSENTE.has(error.code)) return new Response(null, { status: 503 })
  console.error('[quiz-brouillon] écriture :', error.message)
  return new Response(null, { status: 500 })
}
