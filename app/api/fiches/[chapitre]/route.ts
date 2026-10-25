import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fichePdfDe, nomDeTelechargement } from '@/lib/fiches/pdf'
import { lireFichePdf } from '@/lib/fiches/pdf-server'

// LE PDF D'UNE FICHE DE RÉVISION — `/api/fiches/<chapitre>` (`?dl=1` pour
// l'enregistrer au lieu de le lire).
//
// L'accès se décide avec la SESSION de l'élève (`fiche_pdf_acces`, 563 :
// abonné, ou chapitre déverrouillé en gemmes) ; le PDF est lu sur Cloudflare
// R2 (ou, sans R2 configuré, dans Storage) puis SERVI par la route elle-même,
// en même origine.
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
  const lecture = await lireFichePdf(supabase, chapitre)
  if (!lecture.ok && lecture.raison === 'refus') {
    // Pas d'accès : pas d'oracle sur la cause.
    return new Response('Cette fiche n’est pas débloquée.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
  }

  if (!lecture.ok) {
    return new Response('La fiche n’a pas pu être chargée.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
  }
  const pdf = lecture.pdf
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
