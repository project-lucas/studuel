import { NextResponse } from 'next/server'
import { REFERRAL_COOKIE } from '@/lib/gems'

// Lien d'invitation : /parrain/AB12CD → pose le code dans un cookie, puis
// envoie sur l'accueil.
//
// Pourquoi un cookie et pas un paramètre d'URL traîné de page en page : entre
// le clic sur le lien et la création du compte, l'élève passe par plusieurs
// écrans ET, s'il choisit Google/Apple, par une redirection OAuth qui perd
// toute la query string. Le cookie survit à tout ça ; le code est réclamé une
// fois la session ouverte (cf. `claimPendingReferral`), quel que soit le
// chemin d'inscription emprunté.

// Un code ami fait 6 caractères (A-Z sans 0/O/1/I/L, 2-9). On tolère 4→10 et
// on rejette tout le reste : ce qui entre ici vient d'une URL publique.
const CODE_RE = /^[A-Z0-9]{4,10}$/

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const clean = decodeURIComponent(code ?? '')
    .trim()
    .toUpperCase()

  const response = NextResponse.redirect(new URL('/bienvenue', request.url))

  // Code malformé : on redirige quand même (l'élève arrive sur l'accueil, ce
  // qui reste le bon résultat) mais on ne pose rien.
  if (!CODE_RE.test(clean)) return response

  response.cookies.set(REFERRAL_COOKIE, clean, {
    // Lisible côté serveur uniquement : rien à faire de ce code dans le JS.
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // Une semaine : la même fenêtre que celle appliquée par `claim_referral`
    // côté SQL. Au-delà, le parrainage ne récompense plus une arrivée.
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
