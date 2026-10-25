import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { AwsClient } from 'aws4fetch'
import { configR2, urlObjetR2 } from '@/lib/fiches/r2'
import { nomObjetSujet, VARIABLE_BUCKET_ANNALES } from './sujet'

// LE SUJET HABILLÉ — la lecture (25/10/2026). Dans l'ordre :
//  1. Cloudflare R2, dès que `R2_BUCKET_ANNALES` et les clés sont posées
//     (lib/fiches/r2.ts) ;
//  2. le fichier sur le disque — `annales-out/<id>.pdf` (le rendu local, hors
//     git) puis `public/annales/<id>.pdf` — ce qui fait marcher le serveur de
//     développement sans R2 ;
//  3. sinon, « repli » : la route renvoie vers public/annales/<id>.pdf, que
//     Vercel sert pour les 42 premiers sujets.
// Le sujet est un document public : aucune session n'entre ici.

export type LectureSujet =
  | { ok: true; pdf: Response; source: 'r2' | 'disque' }
  | { ok: false; raison: 'repli' | 'echec' }

/** Les dossiers du disque où un sujet habillé peut vivre, du plus frais au plus ancien. */
const DOSSIERS_LOCAUX = ['annales-out', path.join('public', 'annales')]

export async function lireSujetPdf(id: string): Promise<LectureSujet> {
  const r2 = configR2(process.env, VARIABLE_BUCKET_ANNALES)
  if (r2) {
    const client = new AwsClient({ accessKeyId: r2.cleId, secretAccessKey: r2.secret, service: 's3', region: 'auto' })
    const reponse = await client.fetch(urlObjetR2(r2, nomObjetSujet(id)), { cache: 'no-store' }).catch(() => null)
    if (reponse?.ok && reponse.body) return { ok: true, pdf: reponse, source: 'r2' }
    // Un objet pas encore déposé, ou R2 injoignable : on retombe sur le disque.
  }

  for (const dossier of DOSSIERS_LOCAUX) {
    const octets = await readFile(path.join(process.cwd(), dossier, nomObjetSujet(id))).catch(() => null)
    if (octets) {
      return {
        ok: true,
        source: 'disque',
        pdf: new Response(new Uint8Array(octets), { headers: { 'Content-Length': String(octets.byteLength) } }),
      }
    }
  }

  return { ok: false, raison: 'repli' }
}
