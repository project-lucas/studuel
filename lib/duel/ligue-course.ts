// -----------------------------------------------------------------------------
// LA LIGUE APRÈS UNE COURSE — ce que l'écran de fin de duel dit de ma place.
//
// Depuis le 13/10/2026 (Lucas : « une seule échelle, la division, gagnée à
// l'XP de la semaine »), la ligne du milieu de l'écran de fin n'est plus le
// delta de trophées mais MA PLACE DANS LA LIGUE, avant et après l'XP que la
// course vient de verser : « Ligue Bronze 1 · 14e → 11e ». Les trophées
// restent le score du duel par matière (appariement, record, Top %), ils ne
// sont plus un rang.
//
// Pur : le serveur relit `ligue_etat` APRÈS avoir versé l'XP (lib/duel/
// fin-course-server), et ce module en déduit la place d'avant — la liste des
// 30 est déjà classée, il suffit de recompter avec mon XP d'avant la course.
// Aucune seconde lecture : l'état d'avant n'est jamais stocké.
// -----------------------------------------------------------------------------

import { echelon, nbPromus, nbRelegues, type EtatLigue } from '@/lib/ligue'

export type LigueApresCourse = {
  /** L'échelon (0 = Bronze 4 … 20 = Maître). */
  echelon: number
  /** « Bronze 1 », « Maître ». */
  nom: string
  /** Ma place après la course (1 = premier). */
  rang: number
  /** Ma place avant la course — jamais meilleure qu'après : l'XP ne descend pas. */
  rangAvant: number
  /** Les joueurs du groupe, rivaux IA compris. */
  taille: number
  /** Combien montent en fin de semaine. */
  promus: number
  /** Combien descendent. */
  relegues: number
  /** Mon XP de la semaine, course comprise. */
  xpSemaine: number
  /** Ce que la course a versé. */
  xpAjoutee: number
  /** Cette course est ma PREMIÈRE XP de la semaine : je viens d'entrer dans le groupe. */
  entree: boolean
}

/**
 * Ma place avant et après la course, d'après l'état relu après le versement.
 *
 * La place d'avant se recompte : les autres membres n'ont pas bougé pendant
 * ma course, seul mon XP a changé. Avant, j'avais `xp − ajout` ; étaient devant
 * moi tous ceux qui ont PLUS que ça aujourd'hui. Une égalité exacte se départage
 * à l'ordre d'arrivée, que l'écran ne connaît pas : on la laisse derrière moi,
 * ce qui ne peut que sous-estimer la montée — jamais l'inventer.
 *
 * `null` sans ligue (migration absente) ou hors groupe (aucune XP cette
 * semaine : impossible juste après une course payée, mais une course rejouée
 * ne verse rien).
 */
export function ligueApresCourse(etat: EtatLigue | null, xpAjoutee: number): LigueApresCourse | null {
  if (!etat || !etat.inscrit) return null
  const moi = etat.groupe.find((m) => m.moi)
  if (!moi) return null

  const ajout = Math.max(0, Math.floor(Number.isFinite(xpAjoutee) ? xpAjoutee : 0))
  const xpAvant = Math.max(0, moi.xp - ajout)
  const taille = etat.groupe.length
  const rangAvant =
    ajout === 0 ? moi.rang : Math.max(moi.rang, 1 + etat.groupe.filter((m) => !m.moi && m.xp > xpAvant).length)

  return {
    echelon: etat.echelon,
    nom: echelon(etat.echelon).nom,
    rang: moi.rang,
    rangAvant,
    taille,
    promus: nbPromus(taille, etat.echelon),
    relegues: nbRelegues(taille, etat.echelon),
    xpSemaine: moi.xp,
    xpAjoutee: ajout,
    entree: ajout > 0 && xpAvant === 0,
  }
}

/** « 14e », « 1er ». */
export function ordinal(rang: number): string {
  const n = Math.max(1, Math.floor(rang))
  return n === 1 ? '1er' : `${n}e`
}

/**
 * La phrase sous la place : ce qu'il reste pour la zone de promotion, ou qu'on
 * y est, ou qu'on en est sorti par le bas.
 */
export function enjeuLigue(l: LigueApresCourse): string {
  if (l.rang <= l.promus) return 'En zone de promotion'
  if (l.relegues > 0 && l.rang > l.taille - l.relegues) return 'En zone de relégation'
  const places = l.rang - l.promus
  return places === 1 ? 'À 1 place de la promotion' : `À ${places} places de la promotion`
}
