import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import NavMoiBust from './NavMoiBust'

/**
 * L'onglet « Moi » porte le VISAGE DE L'ÉLÈVE, pas une silhouette générique.
 *
 * C'est ce qui règle pour de bon la confusion avec Marcel : les deux onglets
 * montrent quelqu'un, mais l'un montre le coach (adulte, lunettes rondes, veste
 * de tweed) et l'autre montre vous. Deux têtes, deux âges — plus besoin de
 * compter les silhouettes pour savoir où on va.
 *
 * Rendu SOUS un <Suspense> dans le layout, exactement comme la pastille du
 * coffre : la barre d'onglets s'affiche tout de suite, l'avatar se pose quand
 * la base répond. Une barre de navigation ne doit jamais attendre une requête.
 *
 * CE COMPOSANT REND TOUJOURS QUELQUE CHOSE. Le repli ne peut pas être décidé
 * par la barre : elle ne reçoit qu'un élément <Suspense>, qui n'est jamais nul
 * même quand il ne contient rien. Un `avatarSlot !== null` côté parent laissait
 * donc la case VIDE pour tout visiteur déconnecté.
 *
 * `avatarDataUri` est pure (elle compose un SVG DiceBear) : elle tourne ici,
 * côté serveur, sans embarquer un composant client de plus.
 */
export default async function NavAvatarLoader() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  if (!user) return <NavMoiBust />

  const { data, error } = await supabase
    .from('profiles')
    .select('avatar')
    .eq('id', user.id)
    .maybeSingle()

  // Panne ou colonne absente : le buste dessiné plutôt qu'un trou dans la barre.
  if (error) return <NavMoiBust />

  // 64 px de rendu pour ~26 px servis : net sur les écrans à densité doublée.
  const uri = avatarDataUri(normalizeAvatarConfig(data?.avatar), 64)

  // Rien que le visage : le disque qui le rogne et la couronne de laurier qui
  // l'entoure sont posés par la barre elle-même (`.nav-cadre-*`). Ce composant
  // ne connaît pas sa taille finale, et c'est voulu — la géométrie de l'onglet
  // ne doit pas être répartie entre deux fichiers qui ne se voient pas.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={uri} alt="" aria-hidden="true" className="size-full" />
}
