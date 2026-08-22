import { bannerFor } from '@/lib/profile-banners'
import { cn } from '@/lib/utils'

// Fond de bannière du profil : dégradé de repli TOUJOURS présent, surmonté du
// visuel illustré webp s'il existe.
//
// POURQUOI UN FOND CSS ET PAS UNE `<img>` (corrigé le 2026-08-19). Le composant
// portait une balise `<img onError>` qui devait se démonter en cas de 404. Elle
// ne se démontait jamais : le serveur rend le HTML, le navigateur échoue à
// charger l'image AVANT que React n'hydrate, et l'événement `error` est perdu —
// il n'a plus personne à qui parler. Résultat : l'icône « image cassée » du
// navigateur, en haut à gauche de chaque carte de profil, tant que les visuels
// de bannières ne sont pas générés.
//
// Une image de FOND n'a pas ce problème : si le fichier manque, le navigateur
// ne peint rien et le dégradé posé en dessous reste visible. Aucun état, aucun
// événement, aucune hydratation — c'est aussi ce qui permet à ce composant
// d'être rendu par le serveur.
//
// LE DÉGRADÉ DE REPLI EST OPTIONNEL (`withGradient`). Il a un sens sur une
// vignette de bannière — une case vide doit montrer QUELQUE CHOSE. Il n'en a
// aucun quand la bannière est le haut d'une surface déjà violette : elle y
// peignait un second violet (bleuté, #4c1d95 → #7c3aed) par-dessus le violet de
// la surface (magenta), et la couture entre les deux traversait l'écran. Là où
// le fond porte déjà sa couleur, c'est LUI le repli.
export default function ProfileBannerArt({
  banner,
  className,
  withImage = true,
  withGradient = true,
}: {
  banner: string | null
  className?: string
  /** Superposer le visuel webp au dégradé (faux = dégradé seul). */
  withImage?: boolean
  /**
   * Peindre le dégradé de repli sous le visuel. Faux quand la surface qui porte
   * la bannière a déjà sa propre couleur de fond — voir ci-dessus.
   */
  withGradient?: boolean
}) {
  const b = bannerFor(banner)

  // L'ordre des couches suit celui de `background` : le visuel d'abord (donc
  // au-dessus), le dégradé ensuite. `url()` ne reçoit qu'un chemin du catalogue
  // fermé de lib/profile-banners — aucune valeur venue de l'élève.
  const image = withImage ? `url("${b.image}") center / cover no-repeat` : ''
  const gradient = withGradient ? `linear-gradient(160deg, ${b.from}, ${b.to})` : ''
  const background = [image, gradient].filter(Boolean).join(', ')

  // Sans visuel ET sans repli il n'y a rien à peindre : on ne pose pas une
  // couche transparente de plus au-dessus du fond.
  if (!background) return null

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0', className)}
      style={{ background }}
    />
  )
}
