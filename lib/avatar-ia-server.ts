import { createHmac } from 'node:crypto'
import sharp from 'sharp'
import { promptAvatar } from '@/lib/avatar-ia'

// -----------------------------------------------------------------------------
// L'AVATAR DESSINÉ, CÔTÉ SERVEUR — l'appel au modèle d'image (Nano Banana,
// Gemini 2.5 Flash Image — choix de Lucas, 24/09/2026 : ~0,04 $ l'image), la
// compression en WebP 512 px (~50 Ko en base), et la SIGNATURE qui prouve à la
// base que l'image vient de cette route (migration 378, `avatar_ia_terminer`).
//
// Deux variables d'environnement, sans lesquelles la fonctionnalité répond
// « bientôt » sans dépenser un crédit :
//   GEMINI_API_KEY    — la clé de l'API Gemini (Google AI Studio) ;
//   AVATAR_IA_SECRET  — le secret de signature, le MÊME que la ligne de
//                       `avatars_ia_cle` en base (≥ 32 caractères).
// -----------------------------------------------------------------------------

export const MODELE_AVATAR = 'gemini-2.5-flash-image'
const URL_MODELE = `https://generativelanguage.googleapis.com/v1beta/models/${MODELE_AVATAR}:generateContent`
/** Au-delà, on abandonne : le job échoue et les crédits reviennent. */
const DELAI_MS = 45_000
/** L'avatar stocké : un carré de 512 px, assez pour le plus grand rond de l'app. */
const TAILLE = 512

export function avatarIaConfigure(): boolean {
  return Boolean(process.env.GEMINI_API_KEY) && (process.env.AVATAR_IA_SECRET ?? '').length >= 32
}

/** HMAC-SHA256 de « <job>.<image en base64> » — le miroir de `avatar_ia_terminer`. */
export function signerImage(job: string, imageBase64: string, secret = process.env.AVATAR_IA_SECRET ?? ''): string {
  return createHmac('sha256', secret).update(`${job}.${imageBase64}`).digest('hex')
}

export type Dessin = { ok: true; image: Buffer } | { ok: false; raison: 'bloque' | 'panne' }

type Partie = { text?: string; inlineData?: { mimeType?: string; data?: string } }
type ReponseGemini = {
  candidates?: { content?: { parts?: Partie[] }; finishReason?: string }[]
  promptFeedback?: { blockReason?: string }
}

/** Ce que le modèle a refusé pour raison de sécurité (et non une panne). */
const FINS_BLOQUEES = new Set(['SAFETY', 'PROHIBITED_CONTENT', 'IMAGE_SAFETY', 'BLOCKLIST', 'SPII', 'RECITATION'])

/**
 * Demande l'avatar au modèle. `reference` : un blason de l'app, joint pour que
 * le dessin en prenne le style. Filtres de sécurité du modèle au plus strict.
 */
export async function dessinerAvatar(
  demande: string,
  reference: { mimeType: string; data: string } | null,
): Promise<Dessin> {
  const cle = process.env.GEMINI_API_KEY
  if (!cle) return { ok: false, raison: 'panne' }

  const parts: Partie[] = []
  if (reference) parts.push({ inlineData: reference })
  parts.push({ text: promptAvatar(demande) })

  let reponse: Response
  try {
    reponse = await fetch(URL_MODELE, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': cle },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1' } },
        safetySettings: [
          'HARM_CATEGORY_HARASSMENT',
          'HARM_CATEGORY_HATE_SPEECH',
          'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'HARM_CATEGORY_DANGEROUS_CONTENT',
        ].map((category) => ({ category, threshold: 'BLOCK_LOW_AND_ABOVE' })),
      }),
      signal: AbortSignal.timeout(DELAI_MS),
    })
  } catch (e) {
    console.error('[avatar-ia] modèle injoignable :', e instanceof Error ? e.message : e)
    return { ok: false, raison: 'panne' }
  }

  if (!reponse.ok) {
    console.error('[avatar-ia] le modèle répond', reponse.status)
    return { ok: false, raison: reponse.status === 400 ? 'bloque' : 'panne' }
  }

  const json = (await reponse.json().catch(() => null)) as ReponseGemini | null
  if (!json) return { ok: false, raison: 'panne' }
  if (json.promptFeedback?.blockReason) return { ok: false, raison: 'bloque' }
  const candidat = json.candidates?.[0]
  const image = candidat?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data
  if (!image) {
    return { ok: false, raison: candidat?.finishReason && FINS_BLOQUEES.has(candidat.finishReason) ? 'bloque' : 'panne' }
  }
  return { ok: true, image: Buffer.from(image, 'base64') }
}

/** Le dessin, carré 512 px, en WebP : ce qui part en base (~50 Ko). */
export async function compresserAvatar(image: Buffer): Promise<Buffer> {
  return sharp(image).resize(TAILLE, TAILLE, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()
}

/** Un blason de l'app, joint au modèle comme référence de style. Null en cas d'échec. */
export async function chargerReference(origine: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    const r = await fetch(`${origine}/images/profil/7.webp`, { signal: AbortSignal.timeout(5_000) })
    if (!r.ok) return null
    // Le modèle lit mieux un PNG : la référence est convertie au passage.
    const png = await sharp(Buffer.from(await r.arrayBuffer())).png().toBuffer()
    return { mimeType: 'image/png', data: png.toString('base64') }
  } catch {
    return null
  }
}
