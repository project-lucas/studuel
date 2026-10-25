// -----------------------------------------------------------------------------
// LA PAGE DU JOUEUR (/joueur, 25/10/2026, chantier « le jeu vivant ») — la
// logique PURE de ce que l'écran écrit : la ligne « Niveau 7 · Argent II », la
// barre d'XP jusqu'au niveau suivant, l'XP de la semaine relue dans
// `classement_amis()`, le personnage en pied s'il existe.
//
// Rien d'autre : la page (app/joueur/page.tsx) lit, ce module calcule, le
// composant (components/joueur/PageJoueur) dessine. Testé à côté.
// -----------------------------------------------------------------------------

import { lireClassementAmis } from '@/lib/moi/classement-amis'
import { isPortraitKey, portraitPiedSrc } from '@/lib/portraits'
import { xpForLevel, type WalletLevelInfo } from '@/lib/wallet'

/** La barre d'XP de la page : ce qui est fait DANS le niveau, le pas, le reste. */
export type BarreNiveau = {
  level: number
  /** XP gagnée depuis le plancher du niveau. */
  fait: number
  /** XP qui sépare le plancher du niveau suivant. */
  pas: number
  /** Ce qu'il reste pour passer au niveau suivant. */
  reste: number
  /** 0..100, entier. */
  pct: number
}

export function barreNiveau(info: Pick<WalletLevelInfo, 'level' | 'currentXp' | 'nextAt'>): BarreNiveau {
  const plancher = xpForLevel(info.level)
  const pas = Math.max(1, info.nextAt - plancher)
  const fait = Math.min(pas, Math.max(0, info.currentXp - plancher))
  return {
    level: info.level,
    fait,
    pas,
    reste: Math.max(0, info.nextAt - info.currentXp),
    pct: Math.round((fait / pas) * 100),
  }
}

/** « Niveau 7 · Argent II », ou « Niveau 7 » sans rang connu. */
export function ligneRang(level: number, rang: string | null): string {
  return rang ? `Niveau ${level} · ${rang}` : `Niveau ${level}`
}

/**
 * Mon XP de la semaine, relue dans la réponse de `classement_amis()` (465,
 * complétée par la 558 : `xp_semaine`). Null si la ligne « moi » manque ou si
 * la 558 n'est pas en base — l'écran cache alors la tuile plutôt que d'écrire
 * un zéro faux.
 */
export function xpSemaineDepuisClassement(brut: unknown): number | null {
  const moi = lireClassementAmis(brut).find((l) => l.moi)
  if (!moi || moi.xpSemaine === null || moi.xpSemaine === undefined) return null
  return moi.xpSemaine
}

/**
 * Le personnage EN PIED d'un portrait, s'il en a un : seuls les treize
 * portraits libres (lib/portraits) sont dessinés debout. Un personnage
 * historique, un avatar dessiné par Marcel ou un avatar composé n'en ont pas :
 * la page montre alors le buste dans l'anneau de rang.
 */
export function piedDuPortrait(portrait: unknown): string | null {
  return isPortraitKey(portrait) ? portraitPiedSrc(portrait) : null
}
