import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fichePdfDe } from '@/lib/fiches/pdf'
import { urlSigneeFiche } from '@/lib/fiches/pdf-server'

// LE PDF D'UNE FICHE DE RÉVISION — `/api/fiches/<chapitre>` (`?dl=1` pour
// l'enregistrer au lieu de l'ouvrir).
//
// La route ne sert pas le fichier : elle REDIRIGE vers une URL signée par la
// session de l'élève, que Storage n'accorde que si la policy de la migration
// 563 le permet (abonné, ou chapitre déverrouillé en gemmes). Le PDF ne passe
// donc jamais par Vercel, et un lien copié n'ouvre rien passé dix minutes.
//
// Une route GET, pas une Server Action : c'est un lien (`<a href>`), que le
// navigateur ouvre dans un nouvel onglet ou enregistre comme n'importe quel
// fichier.
export async function GET(request: Request, { params }: { params: Promise<{ chapitre: string }> }): Promise<Response> {
  const { chapitre } = await params
  if (!fichePdfDe(chapitre)) return new Response(null, { status: 404 })

  const user = await getCurrentUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const telecharger = new URL(request.url).searchParams.get('dl') === '1'
  const supabase = await createClient()
  const signee = await urlSigneeFiche(supabase, chapitre, { telecharger })
  if (!signee) {
    // Pas d'accès (ou bucket pas encore en place) : pas d'oracle sur la cause.
    return new Response('Cette fiche n’est pas débloquée.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
  }
  return NextResponse.redirect(signee, { status: 302, headers: { 'Cache-Control': 'private, no-store' } })
}
