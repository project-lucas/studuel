import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fichePdfDe, nomDeTelechargement } from '@/lib/fiches/pdf'
import { urlSigneeFiche } from '@/lib/fiches/pdf-server'

// LE PDF D'UNE FICHE DE RÉVISION — `/api/fiches/<chapitre>` (`?dl=1` pour
// l'enregistrer au lieu de le lire).
//
// La route obtient une URL signée par la SESSION de l'élève — Storage ne la
// signe que si la policy de la migration 563 le permet (abonné, ou chapitre
// déverrouillé en gemmes) — puis SERT le fichier elle-même, en même origine.
// Pas une redirection : la fiche se lit DANS l'app (pdf.js, `LecteurPdf`), et
// pdf.js lit par `fetch` — un renvoi vers le domaine de Storage aurait buté
// sur CORS et les requêtes de plage. Une page A4 pèse ~1 Mo : ce passage par
// Vercel ne coûte rien de sensible.
//
// Une route GET, pas une Server Action : c'est une adresse, que pdf.js lit et
// que le navigateur enregistre comme n'importe quel fichier.
export async function GET(request: Request, { params }: { params: Promise<{ chapitre: string }> }): Promise<Response> {
  const { chapitre } = await params
  const fiche = fichePdfDe(chapitre)
  if (!fiche) return new Response(null, { status: 404 })

  const user = await getCurrentUser()
  if (!user) return Response.redirect(new URL('/login', request.url), 307)

  const telecharger = new URL(request.url).searchParams.get('dl') === '1'
  const supabase = await createClient()
  const signee = await urlSigneeFiche(supabase, chapitre)
  if (!signee) {
    // Pas d'accès (ou bucket pas encore en place) : pas d'oracle sur la cause.
    return new Response('Cette fiche n’est pas débloquée.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
  }

  const pdf = await fetch(signee, { cache: 'no-store' })
  if (!pdf.ok || !pdf.body) {
    return new Response('La fiche n’a pas pu être chargée.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
  }
  const nom = nomDeTelechargement(fiche)
  const entetes = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${telecharger ? 'attachment' : 'inline'}; filename="${nom}"`,
    'Cache-Control': 'private, no-store',
  })
  const taille = pdf.headers.get('content-length')
  if (taille) entetes.set('Content-Length', taille)
  return new Response(pdf.body, { status: 200, headers: entetes })
}
