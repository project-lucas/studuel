import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=lien-expire`)
}
