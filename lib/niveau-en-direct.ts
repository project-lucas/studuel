import { walletLevelInfo, xpForLevel } from '@/lib/wallet'

// -----------------------------------------------------------------------------
// LE NIVEAU EN DIRECT (29/10/2026, Lucas : « le gain d'XP qui remplit la barre
// de niveau n'ouvre pas tout de suite l'animation du gain de niveau, elle doit
// être instantanée »).
//
// Le bandeau reçoit le niveau du serveur, et les éclairs d'une volée y tombent
// un à un AVANT que le serveur ne soit relu. Avant, la barre plafonnait à
// « 300 / 300 » et la fête attendait le rafraîchissement. Désormais l'XP
// encaissée compte tout de suite au niveau qu'elle donne : la barre passe au
// niveau suivant à l'éclair qui la remplit, et la fête s'ouvre avec lui.
// Pur et testé ; le barème est celui du portefeuille (lib/wallet).
// -----------------------------------------------------------------------------

export type XpNiveau = { actuel: number; plancher: number; prochain: number | null }

export type NiveauVif = {
  niveau: number
  titre: string
  xp: XpNiveau
}

/**
 * Le niveau que donne l'XP du serveur plus ce qui vient d'être encaissé.
 * Jamais en dessous du niveau du serveur (un jeton perdu ne fait pas
 * redescendre), et sans gain c'est exactement l'état du serveur.
 */
export function niveauEnDirect(
  niveauServeur: number,
  titreServeur: string | null,
  xp: XpNiveau,
  gain: number,
): NiveauVif {
  const ajout = Number.isFinite(gain) && gain > 0 ? Math.floor(gain) : 0
  if (ajout === 0) return { niveau: niveauServeur, titre: titreServeur ?? '', xp }
  const info = walletLevelInfo(xp.actuel + ajout)
  if (info.level <= niveauServeur) {
    return { niveau: niveauServeur, titre: titreServeur ?? info.title, xp: { ...xp, actuel: xp.actuel + ajout } }
  }
  return {
    niveau: info.level,
    titre: info.title,
    xp: { actuel: info.currentXp, plancher: xpForLevel(info.level), prochain: info.nextAt },
  }
}
