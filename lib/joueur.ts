// -----------------------------------------------------------------------------
// LA PAGE DU JOUEUR (/joueur, 25/10/2026, chantier « le jeu vivant ») — la
// logique PURE de ce que l'écran écrit : la ligne « Niveau 7 · Argent II », la
// barre d'XP jusqu'au niveau suivant, l'XP de la semaine relue dans
// `classement_amis()`, le personnage en pied s'il existe, le décor de la page.
//
// Rien d'autre : la page (app/joueur/page.tsx) lit, ce module calcule, le
// composant (components/joueur/PageJoueur) dessine. Testé à côté.
// -----------------------------------------------------------------------------

import { arenaPeriodAt, type ArenaPeriod } from '@/lib/arena-background'
import { lireClassementAmis } from '@/lib/moi/classement-amis'
import { isPortraitKey, portraitPiedSrc, type PortraitKey } from '@/lib/portraits'
import { parisHourMinute } from '@/lib/time'
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

/**
 * LE DÉCOR DE REPLI DE LA PAGE DU JOUEUR (26/10/2026, Lucas : « il faut un
 * autre fond d'écran ici », puis « le fond, on va opter pour la chambre,
 * ambiance Studuel ») : la chambre de l'élève la nuit, VIDE, peinte dans la DA
 * de la cour d'honneur — plus la cour elle-même. Depuis le 27/10 elle ne sert
 * qu'aux avatars sans scène au bureau (`bureauDuPortrait` → null), le héros
 * debout ou le buste posé dessus.
 */
export const DECOR_JOUEUR = '/images/joueur/chambre.webp'

/**
 * LE BUREAU DU JOUEUR (27/10/2026, Lucas : « l'avatar assis au bureau, en
 * train de travailler, la fenêtre et le château derrière ; la lampe animée ;
 * cohérent avec l'accueil qui change selon l'heure ») : pour chacun des treize
 * portraits libres, SIX scènes peintes (GPT Image 2.5, la chambre et le
 * portrait en pied en références, puis la cour de chaque plage pour la
 * lumière) — l'élève assis à son bureau sous la grande fenêtre, à l'aube, le
 * matin, à midi, l'après-midi, le soir, la nuit : les mêmes plages que la cour
 * d'honneur (lib/arena-background), la fenêtre suit la lumière de l'arène.
 * `public/images/joueur/bureau/<portrait>-<plage>.webp`, 752 × 1344, ~95 Ko ;
 * les PNG sources dans `assets-sources/joueur/bureau/`.
 *
 * Un personnage historique, un avatar dessiné par Marcel ou composé n'ont pas
 * de scène : null, la page garde `DECOR_JOUEUR` et l'ancien héros.
 */
export function bureauDuPortrait(portrait: unknown): PortraitKey | null {
  return isPortraitKey(portrait) ? portrait : null
}

/** L'image de la scène d'un portrait à une plage du jour. */
export function decorBureau(portrait: PortraitKey, periode: ArenaPeriod): string {
  return `/images/joueur/bureau/${portrait}-${periode}.webp`
}

/**
 * La plage du PREMIER rendu, côté serveur : l'heure de Paris (le serveur
 * tourne en UTC, l'élève est en France). Le client se recale ensuite sur
 * l'heure de l'appareil, comme l'arène (components/joueur/DecorBureau).
 */
export function periodeInitiale(now: Date): ArenaPeriod {
  return arenaPeriodAt(parisHourMinute(now).hour)
}
