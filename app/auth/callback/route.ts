import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { claimPendingReferral } from '@/lib/referral-claim'

// Retour des liens email Supabase (réinitialisation de mot de passe,
// confirmations) : échange le code PKCE contre une session (cookies),
// puis redirige vers la destination demandée — chemin interne uniquement.
export async function GET(request: Request): Promise<Response> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextRaw = searchParams.get('next') ?? '/'
  const next = nextRaw.startsWith('/') && !nextRaw.startsWith('//') ? nextRaw : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Une session vient de s'ouvrir : c'est le premier moment où le
      // parrainage devient réclamable sur le parcours « inscription email avec
      // confirmation ». Sans cet appel, ce parcours-là perdait le parrainage à
      // tous les coups (signUp renvoie une session nulle et rend la main avant
      // toute réclamation). Best-effort : n'empêche jamais la redirection.
      await claimPendingReferral()
      return NextResponse.redirect(`${origin}${next}`)
    }
    // L'élève ne verra qu'« lien expiré » — c'est volontaire (ne rien révéler
    // sur l'existence d'un compte). Mais côté serveur, un lien qui échoue
    // toujours ne laissait AUCUNE trace : impossible de distinguer un code
    // réellement périmé d'une configuration Supabase cassée.
    console.error('[auth] échange du code impossible:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=lien-expire`)
}
