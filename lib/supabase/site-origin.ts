import { headers } from 'next/headers'

// URL publique de l'app, reconstruite depuis la requête (dev et prod), pour le
// `redirectTo` des liens qui reviennent par /auth/callback (OAuth, e-mail de
// réinitialisation). Helper serveur, PAS une Server Action : il n'a rien à
// faire exposé au client.
export async function siteOrigin(): Promise<string> {
  const h = await headers()
  const explicit = h.get('origin')
  if (explicit) return explicit
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}
