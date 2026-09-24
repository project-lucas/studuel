import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { messageRefus, nettoyerDemande, refusDemande, srcAvatarIa } from '@/lib/avatar-ia'
import {
  avatarIaConfigure,
  chargerReference,
  compresserAvatar,
  dessinerAvatar,
  signerImage,
} from '@/lib/avatar-ia-server'

// L'AVATAR DESSINÉ PAR MARCEL — une route (et pas une Server Action) : le
// dessin prend une dizaine de secondes, et Next exécute les actions une par
// une. Ordre, et il compte : filtre de la demande → réservation en base (qui
// dépense les 25 crédits) → modèle → compression → dépôt SIGNÉ. Si le modèle
// ne dessine pas, le job échoue et les crédits reviennent (migration 378).

export const runtime = 'nodejs'
export const maxDuration = 60

type Raison = 'connexion' | 'demande' | 'abonnement' | 'credits' | 'plafond' | 'indisponible' | 'bloque' | 'panne'

const reponse = (status: number, corps: { ok: false; raison: Raison; message?: string }) =>
  Response.json(corps, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request: Request): Promise<Response> {
  // Même origine seulement : la route dépense les crédits de l'élève connecté.
  const origine = request.headers.get('origin')
  const hote = request.headers.get('host')
  if (origine && hote) {
    try {
      if (new URL(origine).host !== hote) return new Response(null, { status: 403 })
    } catch {
      return new Response(null, { status: 403 })
    }
  }

  const user = await getCurrentUser()
  if (!user) return reponse(401, { ok: false, raison: 'connexion' })

  const corps = (await request.json().catch(() => null)) as { demande?: unknown } | null
  const brute = typeof corps?.demande === 'string' ? corps.demande : ''
  const refus = refusDemande(brute)
  if (refus) return reponse(400, { ok: false, raison: 'demande', message: messageRefus(refus) })
  if (!avatarIaConfigure()) return reponse(503, { ok: false, raison: 'indisponible' })

  const supabase = await createClient()
  const demande = nettoyerDemande(brute)
  const { data: reserve, error } = await supabase.rpc('avatar_ia_reserver', { p_demande: demande })
  if (error) {
    if (error.code !== 'PGRST202') console.error('[avatar-ia] réservation :', error.message)
    return reponse(503, { ok: false, raison: 'indisponible' })
  }
  const r = (reserve ?? {}) as { ok?: boolean; job?: string; raison?: Raison }
  if (!r.ok || typeof r.job !== 'string') {
    return reponse(r.raison === 'indisponible' ? 503 : 403, { ok: false, raison: r.raison ?? 'indisponible' })
  }
  const job = r.job

  const reference = await chargerReference(new URL(request.url).origin)
  const dessin = await dessinerAvatar(demande, reference)
  if (!dessin.ok) {
    await supabase.rpc('avatar_ia_echec', { p_job: job })
    return reponse(dessin.raison === 'bloque' ? 422 : 502, {
      ok: false,
      raison: dessin.raison,
      message:
        dessin.raison === 'bloque'
          ? 'Marcel ne peut pas dessiner ça. Essaie un autre personnage : tes crédits te sont rendus.'
          : 'Marcel n’a pas réussi à dessiner. Réessaie : tes crédits te sont rendus.',
    })
  }

  let image: string
  try {
    image = (await compresserAvatar(dessin.image)).toString('base64')
  } catch (e) {
    console.error('[avatar-ia] compression :', e instanceof Error ? e.message : e)
    await supabase.rpc('avatar_ia_echec', { p_job: job })
    return reponse(502, { ok: false, raison: 'panne' })
  }

  const { data: depose } = await supabase.rpc('avatar_ia_terminer', {
    p_job: job,
    p_image: image,
    p_signature: signerImage(job, image),
  })
  if (depose !== true) {
    await supabase.rpc('avatar_ia_echec', { p_job: job })
    return reponse(502, { ok: false, raison: 'panne' })
  }

  return Response.json({ ok: true, id: job, src: srcAvatarIa(job) }, { headers: { 'Cache-Control': 'no-store' } })
}
