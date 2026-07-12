import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Proxy Next.js 16 (ex-middleware) : rafraîchit la session Supabase
// (cookies) avant le rendu, pour que les Server Components voient
// toujours un utilisateur à jour.
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Déclenche le refresh du token si expiré (écrit les cookies via setAll).
  // getClaims() valide le JWT localement (clés asymétriques mises en cache)
  // au lieu de l'aller-retour réseau de getUser() à CHAQUE navigation ; si le
  // projet est encore en clé symétrique, il retombe sur la vérification
  // serveur — même comportement qu'avant, jamais pire.
  await supabase.auth.getClaims()

  return supabaseResponse
}

export const config = {
  // Tout sauf les assets statiques.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
