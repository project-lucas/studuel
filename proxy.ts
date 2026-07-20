import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Proxy Next.js 16 (ex-middleware) : rafraîchit la session Supabase
// (cookies) avant le rendu, pour que les Server Components voient
// toujours un utilisateur à jour.
export async function proxy(request: NextRequest) {
  // Chemin demandé, exposé aux Server Components (Next ne le leur donne pas).
  // Sert au layout à ne PAS charger le bandeau du haut sur les parcours plein
  // écran (/bienvenue) : sans ça, l'onboarding paie 5 requêtes Supabase par
  // écran pour un bandeau qui se masque ensuite côté client.
  //
  // ⚠️ Les en-têtes sont reconstruits À CHAQUE FOIS depuis `request.headers`,
  // JAMAIS capturés une fois pour toutes : `request.cookies.set()` (plus bas,
  // au rafraîchissement du jeton) met à jour l'en-tête `cookie` de la requête.
  // Un instantané pris trop tôt transmettrait l'ANCIEN cookie au rendu, et
  // l'élève apparaîtrait déconnecté le temps de la requête qui rafraîchit son
  // jeton. Un `x-pathname` éventuellement forgé par le client est écrasé ici.
  const forwardedHeaders = () => {
    const headers = new Headers(request.headers)
    headers.set('x-pathname', request.nextUrl.pathname)
    return headers
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: forwardedHeaders() },
  })

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
          // Après la mise à jour des cookies de la requête : l'en-tête `cookie`
          // reconstruit ici porte donc bien le jeton fraîchement rafraîchi.
          supabaseResponse = NextResponse.next({
            request: { headers: forwardedHeaders() },
          })
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
