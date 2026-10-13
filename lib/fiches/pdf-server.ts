import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BUCKET_APERCUS, BUCKET_FICHES, DUREE_URL_SIGNEE_S, fichePdfDe, nomApercu, nomDeTelechargement, nomPdf } from './pdf'

// LES FICHES PDF — la lecture qui a besoin de la session.
//
// Le serveur n'a que la clé anonyme : c'est la SESSION DE L'ÉLÈVE qui signe
// l'URL, et Storage ne la signe que si la policy `fiches_pdf_lire` (563) le
// permet — administrateur, abonné, ou chapitre déverrouillé en gemmes. Un
// élève qui n'a pas payé reçoit null, jamais une adresse.

/**
 * L'URL signée du PDF d'un chapitre, ou null (pas de fiche, pas d'accès,
 * bucket absent). Avec `telecharger`, l'URL force l'enregistrement du fichier
 * sous un nom lisible au lieu de l'ouvrir dans le navigateur.
 */
export async function urlSigneeFiche(
  supabase: SupabaseClient,
  chapitreId: string,
  { telecharger = false } = {},
): Promise<string | null> {
  const fiche = fichePdfDe(chapitreId)
  if (!fiche) return null
  const { data, error } = await supabase.storage
    .from(BUCKET_FICHES)
    .createSignedUrl(nomPdf(chapitreId), DUREE_URL_SIGNEE_S, telecharger ? { download: nomDeTelechargement(fiche) } : undefined)
  if (error || !data?.signedUrl) return null
  return data.signedUrl
}

/** L'adresse publique de l'illustration d'une fiche (bucket public : pas de signature). */
export function urlApercuFiche(supabase: SupabaseClient, chapitreId: string): string {
  return supabase.storage.from(BUCKET_APERCUS).getPublicUrl(nomApercu(chapitreId)).data.publicUrl
}
