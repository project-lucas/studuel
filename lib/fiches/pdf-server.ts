import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AwsClient } from 'aws4fetch'
import { BUCKET_APERCUS, BUCKET_FICHES, DUREE_URL_SIGNEE_S, fichePdfDe, nomApercu, nomFlou, nomPdf } from './pdf'
import { configR2, urlObjetR2 } from './r2'

// LES FICHES PDF — la lecture qui a besoin de la session.
//
// Le serveur n'a que la clé anonyme : c'est la SESSION DE L'ÉLÈVE qui décide,
// par `fiche_pdf_acces` (563) — administrateur, abonné, ou chapitre
// déverrouillé en gemmes. Un élève qui n'a pas payé reçoit null, jamais un
// fichier. La route /api/fiches lit ensuite le PDF et le sert elle-même.
//
// OÙ EST LE PDF (25/10/2026) : sur Cloudflare R2 dès que ses variables sont
// posées (lib/fiches/r2.ts) ; sinon, comme avant, dans le bucket Supabase,
// par une URL signée. La bascule ne demande donc qu'un réglage Vercel.

/** Ce que la route reçoit : le PDF, ou la raison de l'échec (refus d'accès / fichier injoignable). */
export type LectureFiche = { ok: true; pdf: Response } | { ok: false; raison: 'refus' | 'echec' }

/** Le PDF d'un chapitre, lu avec la session de l'élève. */
export async function lireFichePdf(supabase: SupabaseClient, chapitreId: string): Promise<LectureFiche> {
  if (!fichePdfDe(chapitreId)) return { ok: false, raison: 'refus' }
  const r2 = configR2(process.env)
  if (r2) {
    const { data: autorise, error } = await supabase.rpc('fiche_pdf_acces', { p_nom: nomPdf(chapitreId) })
    if (error || autorise !== true) return { ok: false, raison: 'refus' }
    const client = new AwsClient({ accessKeyId: r2.cleId, secretAccessKey: r2.secret, service: 's3', region: 'auto' })
    return servi(await client.fetch(urlObjetR2(r2, nomPdf(chapitreId)), { cache: 'no-store' }).catch(() => null))
  }
  const { data, error } = await supabase.storage.from(BUCKET_FICHES).createSignedUrl(nomPdf(chapitreId), DUREE_URL_SIGNEE_S)
  if (error || !data?.signedUrl) return { ok: false, raison: 'refus' }
  return servi(await fetch(data.signedUrl, { cache: 'no-store' }).catch(() => null))
}

function servi(reponse: Response | null): LectureFiche {
  return reponse?.ok && reponse.body ? { ok: true, pdf: reponse } : { ok: false, raison: 'echec' }
}

/** L'adresse publique de l'illustration d'une fiche (bucket public : pas de signature). */
export function urlApercuFiche(supabase: SupabaseClient, chapitreId: string): string {
  return supabase.storage.from(BUCKET_APERCUS).getPublicUrl(nomApercu(chapitreId)).data.publicUrl
}

/** L'adresse publique de la page floutée d'une fiche — ce qu'on montre sous le paywall. */
export function urlFlouFiche(supabase: SupabaseClient, chapitreId: string): string {
  return supabase.storage.from(BUCKET_APERCUS).getPublicUrl(nomFlou(chapitreId)).data.publicUrl
}
