import Image from 'next/image'
// Importé et non désigné par son chemin : l'URL porte alors l'empreinte du
// fichier, donc remplacer le dessin suffit à invalider tous les caches. Voir
// l'explication complète dans `components/Navigation.tsx`.
import moiIcone from '@/public/images/nav/moi.webp'

/**
 * Le buste dessiné de l'onglet Moi — le REPLI de l'avatar, et rien d'autre.
 *
 * Il existe en composant à part parce qu'il est rendu depuis deux endroits que
 * rien ne relie : le `fallback` du <Suspense> dans le layout (le temps que la
 * base réponde) et `NavAvatarLoader` lui-même (déconnecté, ou requête en
 * échec). La case de l'onglet ne doit JAMAIS rester vide — un trou au milieu de
 * la barre se lit comme une app cassée.
 *
 * Il se glisse dans le même disque que l'avatar, sous la même couronne de
 * laurier : le repli change le VISAGE, jamais la forme de l'onglet.
 */
export default function NavMoiBust() {
  return (
    <Image
      src={moiIcone}
      alt=""
      aria-hidden="true"
      width={64}
      height={64}
      className="size-full object-contain"
    />
  )
}
