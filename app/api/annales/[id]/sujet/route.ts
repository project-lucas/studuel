import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { CACHE_SUJET, cheminSujetPublic, estIdAnnale, nomTelechargementSujet } from '@/lib/annales-corrigees/sujet'
import { lireSujetPdf } from '@/lib/annales-corrigees/sujet-server'

// LE SUJET OFFICIEL HABILLÉ D'UNE ANNALE — `/api/annales/<id>/sujet` (`?dl=1`
// pour l'enregistrer au lieu de le lire).
//
// Un document public de l'Éducation nationale (le PDF du ministère, habillé par
// scripts/annales-sujets.mjs) : PAS d'authentification — ce qui est réservé,
// c'est NOTRE corrigé, pas le sujet. Il est lu sur Cloudflare R2 (ou sur le
// disque sans R2, cf. lib/annales-corrigees/sujet-server.ts) puis SERVI par la
// route, en même origine : pdf.js (`LecteurPdf`) lit par `fetch`, un renvoi
// vers R2 buterait sur CORS. Immuable : un an de cache.
//
// Tant que rien n'est trouvé (R2 pas réglé, fichier absent du disque — le cas
// de Vercel pour les 42 premiers sujets), la route renvoie vers
// public/annales/<id>.pdf, qui les sert comme avant.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params
  if (!estIdAnnale(id) || !ANNALES_CORRIGEES.some((a) => a.id === id)) return new Response(null, { status: 404 })

  const telecharger = new URL(request.url).searchParams.get('dl') === '1'
  const lecture = await lireSujetPdf(id)
  if (!lecture.ok) {
    if (lecture.raison === 'repli') {
      return new Response(null, {
        status: 307,
        headers: { Location: new URL(cheminSujetPublic(id), request.url).toString(), 'Cache-Control': CACHE_SUJET },
      })
    }
    return new Response('Le sujet n’a pas pu être chargé.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }

  const entetes = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${telecharger ? 'attachment' : 'inline'}; filename="${nomTelechargementSujet(id)}"`,
    'Cache-Control': CACHE_SUJET,
  })
  const taille = lecture.pdf.headers.get('content-length')
  if (taille) entetes.set('Content-Length', taille)
  return new Response(lecture.pdf.body, { status: 200, headers: entetes })
}
