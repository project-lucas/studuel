import { cookies, headers } from 'next/headers'
import { getCurrentUser } from '@/lib/supabase/user'
import { COOKIE_BOUTIQUE_VUE, vitrineAVoir } from '@/lib/boutique/vue'
import NavBoutiqueBadge from './NavBoutiqueBadge'

/**
 * Décide si l'onglet Boutique porte sa pastille : oui tant que la vitrine de
 * la semaine n'a pas été vue (cookie posé par la Boutique). Rendu SOUS un
 * <Suspense> dans le layout — la barre d'onglets s'affiche immédiatement, la
 * pastille arrive en flux. Aucune requête en base : un cookie suffit.
 */
export default async function NavBoutiqueBadgeLoader() {
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (pathname === '/tresor' || pathname.startsWith('/tresor/')) return null

  const user = await getCurrentUser()
  if (!user) return null

  const vue = (await cookies()).get(COOKIE_BOUTIQUE_VUE)?.value
  if (!vitrineAVoir(vue, new Date())) return null

  return <NavBoutiqueBadge />
}
