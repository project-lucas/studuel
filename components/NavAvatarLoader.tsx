import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { avatarDataUri, avatarPortraitSrc, normalizeAvatarConfig } from '@/lib/avatar'
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

  const config = normalizeAvatarConfig(data?.avatar)

  // Un blason choisi (lib/portraits) : l'ÉCU ENTIER, tel que l'élève l'a
  // choisi, sans cadre ni disque de rognage (16/09/2026). Le blason est déjà un
  // objet détouré — écu, cerne, couronne d'or — de la même famille graphique
  // que les quatre autres icônes de la barre ; il se pose comme elles, en
  // `object-contain` dans toute la case.
  const portrait = avatarPortraitSrc(config)
  if (portrait) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={portrait} alt="" aria-hidden="true" className="size-full object-contain" />
  }

  // 96 px de rendu pour 40 px servis : net sur les écrans à densité doublée.
  const uri = avatarDataUri(config, 96)

  // L'avatar DiceBear, lui, est un carré plein (fond compris) : sans cadre, il
  // garde au moins un rond pour ne pas poser un pavé au milieu des dessins
  // détourés. Un rond nu, sans couronne ni liseré.
  return (
    <span className="block size-full overflow-hidden rounded-full" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={uri} alt="" className="size-full" />
    </span>
  )
}
