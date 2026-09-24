import { avatarDataUri, avatarEstDessine, avatarPortraitSrc, normalizeAvatarConfig } from '@/lib/avatar'

// -----------------------------------------------------------------------------
// L'AVATAR D'UN ÉLÈVE, PRÊT À AFFICHER — le même partout où l'app montre « toi »
// dans un rond : le disque de l'écusson du bandeau, la fenêtre « Fais équipe »,
// ma ligne dans la ligue et le classement des amis. Le blason choisi (cadré sur
// le visage) ou l'avatar composé (DiceBear, en data-URI).
//
// À appeler CÔTÉ SERVEUR : DiceBear (lib/avatar) n'a rien à faire dans le
// paquet des écrans qui ne font qu'afficher une image. Les composants clients
// n'importent que le TYPE.
// -----------------------------------------------------------------------------

export type AvatarAffiche = {
  src: string
  /** Blason peint : à cadrer sur le visage (PORTRAIT_FACE_CROP). */
  visage: boolean
}

/** `taille` : pixels de rendu de l'avatar composé (le double de la case, pour les écrans denses). */
export function avatarAffiche(brut: unknown, taille = 96): AvatarAffiche {
  const config = normalizeAvatarConfig(brut)
  const portrait = avatarPortraitSrc(config)
  if (!portrait) return { src: avatarDataUri(config, taille), visage: false }
  // Un avatar dessiné par Marcel est déjà un portrait carré : entier.
  return { src: portrait, visage: !avatarEstDessine(config) }
}
