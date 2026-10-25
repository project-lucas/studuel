// LES PDF SUR CLOUDFLARE R2 (25/10/2026) — ce qui se calcule sans réseau.
//
// Les 2 947 fiches (~1,1 Go) faisaient dépasser le stockage gratuit de
// Supabase (1 Go). Elles vivent désormais dans un bucket R2 PRIVÉ — 10 Go
// gratuits et aucun frais de sortie, ce qui compte pour des PDF téléchargés en
// masse. Les aperçus publics (illustration, page floutée) restent dans Supabase.
//
// Le même compte et les mêmes clés servent UN BUCKET PAR USAGE, nommé par sa
// propre variable : `R2_BUCKET_FICHES` (les fiches, privées) et
// `R2_BUCKET_ANNALES` (les sujets d'annales habillés, documents publics de
// l'Éducation nationale — lib/annales-corrigees/sujet*.ts). `configR2` lit le
// bucket demandé ; par défaut celui des fiches.
//
// Le contrôle d'accès des fiches ne bouge pas : c'est toujours
// `fiche_pdf_acces` (563), appelée avec la session de l'élève
// (lib/fiches/pdf-server.ts). R2 ne connaît que des clés d'API, qui ne
// quittent jamais le serveur.

export type ConfigR2 = {
  compte: string
  cleId: string
  secret: string
  bucket: string
}

/** La variable qui nomme le bucket des fiches. */
export const VARIABLE_BUCKET_FICHES = 'R2_BUCKET_FICHES'

/**
 * La configuration R2 lue dans l'environnement, ou null si elle est
 * incomplète. `variableBucket` dit quel bucket on veut (fiches par défaut).
 */
export function configR2(
  env: Record<string, string | undefined>,
  variableBucket: string = VARIABLE_BUCKET_FICHES,
): ConfigR2 | null {
  const compte = env.R2_ACCOUNT_ID?.trim()
  const cleId = env.R2_ACCESS_KEY_ID?.trim()
  const secret = env.R2_SECRET_ACCESS_KEY?.trim()
  const bucket = env[variableBucket]?.trim()
  if (!compte || !cleId || !secret || !bucket) return null
  if (!/^[a-f0-9]{32}$/.test(compte)) return null
  return { compte, cleId, secret, bucket }
}

/** L'adresse S3 d'un objet du bucket. */
export function urlObjetR2(config: Pick<ConfigR2, 'compte' | 'bucket'>, cle: string): string {
  return `https://${config.compte}.r2.cloudflarestorage.com/${config.bucket}/${encodeURIComponent(cle)}`
}
