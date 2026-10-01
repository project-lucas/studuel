// -----------------------------------------------------------------------------
// LE PROGRAMME EN « MONDES » — logique pure de l'onglet Programme d'une matière.
//
// Lucas, 01/10/2026, après quatre maquettes : les grands thèmes du programme ne
// sont plus six plaques violettes empilées mais une GRILLE DE TUILES, deux par
// rangée — tout le programme tient sur un écran, chaque thème porte son
// pictogramme et son anneau. Ce module calcule ce que la grille montre :
//
//   · la progression AFFICHÉE, qui ne doit « pas être déprimante » ;
//   · l'XP qu'une fiche peut encore rapporter (la carte « Reprendre ») ;
//   · les mondes eux-mêmes, leurs favoris et leur ordre ;
//   · la fiche à reprendre.
//
// Rien ici ne touche au navigateur ni à la base : tout se teste.
// -----------------------------------------------------------------------------

import { XP_AWARDS, xpPourCouronnes } from '@/lib/wallet'
import {
  CROWN_THRESHOLDS,
  chapterGroupProgress,
  groupChaptersByTheme,
  resumeCta,
  type ChapterExamHint,
  type ChapterRow,
  type ResumeCta,
  type SubjectProgress,
} from '@/lib/subject-template'

// ------------------------------------------------------- la progression affichée

/**
 * L'exposant de la courbe d'encouragement. Sous 1, la courbe est concave : les
 * premiers pas remplissent beaucoup, les derniers peu.
 */
export const EXPOSANT_ENCOURAGEANT = 0.6

/** Dès qu'un travail existe, la jauge montre au moins cela (en %). */
export const PLANCHER_VISIBLE = 6

/**
 * LE REMPLISSAGE D'UNE JAUGE, pour un avancement réel donné (0 → 100).
 *
 * « La barre de remplissage ne doit pas être déprimante, elle doit se remplir
 * même si l'élève a fait un chapitre : le plus important est de le mettre dans
 * la boucle d'apprendre » (Lucas, 01/10/2026). Une fiche sur vingt-huit, c'est
 * 3,6 % : sur une barre de 300 px, onze pixels — autant dire rien, pour une
 * demi-heure de travail. La courbe rend ce premier effort VISIBLE :
 *
 *     réel    4 %  10 %  25 %  50 %  75 %  100 %
 *     jauge  14 %  25 %  44 %  66 %  84 %  100 %
 *
 * ⚠️ C'EST UN DESSIN, PAS UN CHIFFRE. Tout nombre écrit à côté (« 3/28
 * fiches ») reste le compte exact, et l'`aria-valuenow` aussi : on encourage
 * par la jauge, on ne ment pas sur ce qui est fait. Zéro reste zéro, et la
 * jauge n'est pleine qu'à 100 % réels.
 */
export function progressionAffichee(pct: number): number {
  const reel = Math.min(100, Math.max(0, Number.isFinite(pct) ? pct : 0))
  if (reel <= 0) return 0
  if (reel >= 100) return 100
  const courbe = Math.round(100 * Math.pow(reel / 100, EXPOSANT_ENCOURAGEANT))
  return Math.min(99, Math.max(PLANCHER_VISIBLE, courbe))
}

/**
 * La même jauge, calculée depuis les fiches elles-mêmes : la moyenne EXACTE de
 * leurs avancements (0..1), pas le pourcentage déjà arrondi — un cours lu sur
 * soixante fiches vaut 0,5 %, que l'arrondi ramenait à zéro, donc à une barre
 * vide après du vrai travail.
 */
export function jaugeDesFiches(fiches: readonly { value: number }[]): number {
  if (fiches.length === 0) return 0
  const somme = fiches.reduce((s, f) => s + Math.min(1, Math.max(0, f.value)), 0)
  return progressionAffichee((somme / fiches.length) * 100)
}

// ------------------------------------------------------------------ l'XP à gagner

/**
 * L'XP qu'une fiche peut ENCORE rapporter, au barème de base : 5 par leçon pas
 * encore lue, puis 30 · 40 · 60 pour les couronnes qui restent (135 sur une
 * fiche vierge à une leçon). C'est le serveur qui applique le multiplicateur
 * d'amis au versement : ici on annonce le montant de base, comme partout.
 */
export function xpRestantFiche(input: { leconsALire: number; couronnes: number }): number {
  const lecons = Math.max(0, Math.trunc(input.leconsALire || 0))
  const couronnes = Math.min(CROWN_THRESHOLDS.length, Math.max(0, Math.trunc(input.couronnes || 0)))
  return lecons * XP_AWARDS.lecon + xpPourCouronnes(couronnes, CROWN_THRESHOLDS.length)
}

// ------------------------------------------------------------------- les mondes

export type EtatMonde = 'vierge' | 'entame' | 'termine'

export type Monde = {
  /** Clé stable du thème — celle des favoris et de l'URL (`?theme=`). */
  cle: string
  titre: string
  fiches: ChapterRow[]
  /** Le compte exact : fiches terminées, total, pourcentage réel. */
  avancement: SubjectProgress
  /** Le remplissage de l'anneau (0 → 100), courbe d'encouragement. */
  jauge: number
  etat: EtatMonde
  /** Le contrôle annoncé le plus proche parmi ses fiches, s'il y en a un. */
  controle: ChapterExamHint | null
}

/** La clé du groupe des fiches sans thème, dans une matière qui en a par ailleurs. */
export const CLE_SANS_THEME = 'autres-chapitres'

const URGENCE: Record<ChapterExamHint['proximity'], number> = { imminent: 0, soon: 1, far: 2 }

function controleLePlusProche(fiches: readonly ChapterRow[]): ChapterExamHint | null {
  let choisi: ChapterExamHint | null = null
  for (const fiche of fiches) {
    const hint = fiche.examHint
    if (hint && (!choisi || URGENCE[hint.proximity] < URGENCE[choisi.proximity])) choisi = hint
  }
  return choisi
}

/** Les grands thèmes de la liste, dans l'ordre du programme. */
export function mondesDuProgramme(chapters: ChapterRow[]): Monde[] {
  return groupChaptersByTheme(chapters).map((groupe) => {
    const avancement = chapterGroupProgress(groupe.chapters)
    const termine = avancement.total > 0 && avancement.done >= avancement.total
    const entame = groupe.chapters.some((c) => c.value > 0)
    return {
      cle: groupe.theme ?? CLE_SANS_THEME,
      titre: groupe.theme ?? 'Autres chapitres',
      fiches: groupe.chapters,
      avancement,
      jauge: jaugeDesFiches(groupe.chapters),
      etat: termine ? 'termine' : entame ? 'entame' : 'vierge',
      controle: controleLePlusProche(groupe.chapters),
    }
  })
}

/**
 * La grille ne vaut que pour un programme RANGÉ en plusieurs thèmes. Une liste
 * à plat (philosophie, petites matières) ou un rayon d'un seul bloc (les 260
 * fiches de lecture) garde sa liste : une tuile unique ne rangerait rien.
 */
export function afficheEnMondes(chapters: readonly { theme: string | null }[]): boolean {
  const themes = new Set(chapters.map((c) => c.theme).filter(Boolean))
  return themes.size >= 2
}

// ------------------------------------------------------------------ les favoris

/**
 * Les choix EXPLICITES de l'élève, par clé de thème : `true` il l'a épinglé,
 * `false` il l'a retiré. Ce qui n'y est pas suit la règle par défaut — un thème
 * où un contrôle est annoncé est favori d'office.
 */
export type ChoixFavoris = Readonly<Record<string, boolean>>

export function estFavori(
  monde: { cle: string; controle: ChapterExamHint | null },
  choix: ChoixFavoris,
): boolean {
  return choix[monde.cle] ?? monde.controle !== null
}

/** Le choix une fois l'étoile touchée : l'inverse de ce qu'elle montrait. */
export function basculerFavori(
  monde: { cle: string; controle: ChapterExamHint | null },
  choix: ChoixFavoris,
): Record<string, boolean> {
  return { ...choix, [monde.cle]: !estFavori(monde, choix) }
}

/** Les favoris d'abord ; à l'intérieur de chaque paquet, l'ordre du programme. */
export function ordonnerMondes<T extends { cle: string; controle: ChapterExamHint | null }>(
  mondes: readonly T[],
  choix: ChoixFavoris,
): T[] {
  return [
    ...mondes.filter((m) => estFavori(m, choix)),
    ...mondes.filter((m) => !estFavori(m, choix)),
  ]
}

// ------------------------------------------------------------- la fiche à reprendre

export type LibelleReprise = 'Commencer' | 'Reprendre' | 'Continuer'

export type Reprise = {
  fiche: ChapterRow
  /** La clé du monde qui l'abrite. */
  cle: string
  libelle: LibelleReprise
  /** Son rang dans son thème (1, 2, 3…), `null` hors thème. */
  rang: number | null
}

function reprise(mondes: readonly Monde[], fiche: ChapterRow, libelle: LibelleReprise): Reprise {
  const monde = mondes.find((m) => m.fiches.some((f) => f.id === fiche.id))
  const index = monde ? monde.fiches.findIndex((f) => f.id === fiche.id) : -1
  return {
    fiche,
    cle: monde?.cle ?? CLE_SANS_THEME,
    libelle,
    rang: monde && monde.cle !== CLE_SANS_THEME && index >= 0 ? index + 1 : null,
  }
}

/**
 * LA FICHE QUE LA CARTE « REPRENDRE » PROPOSE.
 *
 *   1. la fiche de la dernière session, tant qu'elle n'est pas terminée ;
 *   2. si elle l'est, la suivante à faire DANS SON THÈME — on finit ce qu'on a
 *      commencé avant de sauter ailleurs ;
 *   3. sinon la première fiche entamée, puis la première jamais ouverte
 *      (`resumeCta`, la règle historique du dossier) ;
 *   4. rien quand tout est terminé : il n'y a plus rien à reprendre.
 */
export function repriseDuProgramme(
  chapters: ChapterRow[],
  derniere: ResumeCta | null,
): Reprise | null {
  const mondes = mondesDuProgramme(chapters)
  const libelleDe = (fiche: ChapterRow): LibelleReprise =>
    fiche.status === 'en_cours' ? 'Reprendre' : 'Continuer'

  const vue = derniere ? chapters.find((c) => c.id === derniere.chapterId) : undefined
  if (vue && vue.status !== 'complete') return reprise(mondes, vue, 'Reprendre')
  if (vue) {
    const monde = mondes.find((m) => m.fiches.some((f) => f.id === vue.id))
    const suite = monde?.fiches.find((f) => f.status !== 'complete')
    if (suite) return reprise(mondes, suite, libelleDe(suite))
  }

  const cta = resumeCta(chapters)
  const cible = cta ? chapters.find((c) => c.id === cta.chapterId) : undefined
  if (!cible) return null
  const rienDeFait = chapters.every((c) => c.status === 'non_commence')
  return reprise(mondes, cible, rienDeFait ? 'Commencer' : libelleDe(cible))
}
