// -----------------------------------------------------------------------------
// « Progrès » — ce que Marcel voit, matière par matière PUIS chapitre par
// chapitre.
//
// CE QU'IL DIT, ET SEULEMENT ÇA. La typologie d'erreur (méthode / calcul /
// lecture d'énoncé / cours non su) n'existe encore sur aucune question du
// catalogue : tant qu'elle n'est pas là, Marcel ne peut PAS dire pourquoi
// l'élève se trompe, et un écran qui le prétendrait mentirait.
//
// CE QUI A CHANGÉ LE 2026-08-01. Le pourcentage mesurait l'avancement dans le
// programme de l'ANNÉE : un chapitre jamais ouvert comptait zéro, et une matière
// dont le prof n'avait traité qu'un chapitre s'affichait à 10 % en rouge. Il
// mesure désormais la maîtrise de ce qui a été COMMENCÉ — la définition vit dans
// `lib/progression.ts`, partagée avec les couronnes de Réviser pour que les deux
// onglets ne puissent pas se contredire.
//
// La couverture n'est pas perdue pour autant : `commences`, `total` et `reste`
// partent avec chaque matière. Un écran qui montre « 80 % » a toujours de quoi
// dire « sur 1 chapitre des 10 » — sans quoi le chiffre serait un mensonge par
// omission trois semaines avant le brevet.
//
// Logique PURE, aucun accès base.
// -----------------------------------------------------------------------------

import {
  gainSiMaitrise,
  prioriteFor,
  progressionMatiere,
  RANG_PRIORITE,
  type Priorite,
  type ProgressionMatiere,
} from '../progression'
import type { ChapterState } from '../mastery'
import { REGIMES, regimeOf, type Regime } from './regimes'

/** Un chapitre du niveau de l'élève, tel qu'il entre dans le calcul. */
export type ChapitreCouvert = {
  chapterId: string
  chapterTitle: string
  subjectSlug: string
  subjectName: string
  state: ChapterState
  value: number
  /** L'élève a déclaré que le prof a traité ce chapitre (migration 224). */
  vuEnCours: boolean
}

/** Une ligne du tableau, sous une matière dépliée. */
export type ChapitreDetail = {
  id: string
  titre: string
  state: ChapterState
  /** Maîtrise mesurée, en pourcent (0–100). */
  pct: number
  vuEnCours: boolean
  /** Entre-t-il dans le pourcentage de la matière ? */
  commence: boolean
  /**
   * Points que la matière gagnerait si ce chapitre était maîtrisé. Zéro quand
   * il n'y a rien à promettre — l'écran n'affiche alors aucun bouton.
   */
  gain: number
}

export type CouvertureMatiere = ProgressionMatiere & {
  slug: string
  name: string
  regime: Regime | null
  priorite: Priorite
  /** Le constat de Marcel : des chiffres, jamais une interprétation inventée. */
  constat: string
  /** Ce qui n'a pas encore été vu en cours — `null` s'il n'en reste aucun. */
  reste: string | null
  /** La consigne du régime, ou `null` si la matière est hors doctrine. */
  consigne: string | null
  chapitres: ChapitreDetail[]
}

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`

function constatFor(p: ProgressionMatiere): string {
  if (p.total === 0) return 'Rien à ton niveau pour l’instant.'
  if (p.commences === 0) {
    // Le seul cas où Marcel demande quelque chose à l'élève : sans ce geste, il
    // n'a aucun moyen de savoir si la matière est en retard ou simplement pas
    // encore abordée par le prof.
    return 'Dis-moi ce que ton prof a déjà traité, et je te dis où tu en es.'
  }
  if (p.solides === p.commences) {
    return `Tout est solide sur ce que tu as commencé (${pluriel(p.commences, 'chapitre')}).`
  }
  return `${p.solides} solide${p.solides > 1 ? 's' : ''} sur ${pluriel(p.commences, 'chapitre')} commencé${p.commences > 1 ? 's' : ''}.`
}

/**
 * La phrase de couverture, dite SÉPARÉMENT du constat de maîtrise.
 *
 * C'est le garde-fou du nouveau pourcentage : « 80 % » sur un seul chapitre
 * commencé ne veut pas dire prêt. Les deux informations ne sont jamais fondues
 * en une seule phrase — on ne mélange pas « ce que je sais » et « ce qu'il reste
 * à voir ».
 */
function resteFor(p: ProgressionMatiere): string | null {
  if (p.jamais === 0) return null
  return `${pluriel(p.jamais, 'chapitre')} pas encore vu${p.jamais > 1 ? 's' : ''} en cours.`
}

/**
 * Regroupe les chapitres par matière et en tire le constat de Marcel.
 *
 * Les matières les plus urgentes remontent : c'est l'ordre utile, pas
 * l'alphabet. Celles dont rien n'a été traité descendent en DERNIER — elles ne
 * réclament rien tant que le prof ne les a pas abordées, et les mettre en tête
 * (ce que faisait l'ancien tri, qui les voyait à 0 %) revenait à reprocher à
 * l'élève le calendrier de son établissement.
 *
 * Une matière sans chapitre au niveau de l'élève n'apparaît pas — Marcel ne
 * commente pas un vide qui ne lui appartient pas.
 */
export function couvertureFor(
  chapitres: readonly ChapitreCouvert[],
): CouvertureMatiere[] {
  const parMatiere = new Map<
    string,
    { name: string; chapitres: ChapitreCouvert[] }
  >()

  for (const chapitre of chapitres) {
    const agg = parMatiere.get(chapitre.subjectSlug) ?? {
      name: chapitre.subjectName,
      chapitres: [],
    }
    agg.chapitres.push(chapitre)
    parMatiere.set(chapitre.subjectSlug, agg)
  }

  const liste: CouvertureMatiere[] = []
  for (const [slug, agg] of parMatiere) {
    const progression = progressionMatiere(agg.chapitres)
    const regime = regimeOf(slug)

    liste.push({
      ...progression,
      slug,
      name: agg.name,
      regime,
      priorite: prioriteFor(progression),
      constat: constatFor(progression),
      reste: resteFor(progression),
      consigne: regime === null ? null : REGIMES[regime].consigne,
      chapitres: agg.chapitres.map((c, i) => ({
        id: c.chapterId,
        titre: c.chapterTitle,
        state: c.state,
        pct: Math.round(
          Math.max(0, Math.min(1, Number.isFinite(c.value) ? c.value : 0)) * 100,
        ),
        vuEnCours: c.vuEnCours,
        // Recalculé par la même fonction que le pourcentage : impossible qu'une
        // ligne du tableau se dise « commencée » sans compter dans le total.
        commence: progressionMatiere([c]).commences === 1,
        // Ce que ce chapitre RAPPORTERAIT à la matière — de quoi transformer
        // chaque ligne en geste, au lieu d'un constat de plus.
        gain: gainSiMaitrise(agg.chapitres, i),
      })),
    })
  }

  return liste.sort(
    (a, b) =>
      RANG_PRIORITE[a.priorite] - RANG_PRIORITE[b.priorite] || a.pct - b.pct,
  )
}

/**
 * Maîtrise moyenne sur toutes les matières suivies, en pourcent. Pondérée par
 * les chapitres COMMENCÉS : une matière que le prof n'a pas abordée ne tire plus
 * la moyenne générale vers le bas.
 */
export function couvertureGlobale(
  liste: readonly CouvertureMatiere[],
): number {
  const commences = liste.reduce((sum, m) => sum + m.commences, 0)
  if (commences === 0) return 0
  const pondere = liste.reduce((sum, m) => sum + m.pct * m.commences, 0)
  return Math.round(pondere / commences)
}

/**
 * L'assiette du pourcentage global : sur combien de chapitres il porte, sur
 * combien au total.
 *
 * La règle « jamais le pourcentage sans son assiette » valait déjà pour chaque
 * matière ; le chiffre du haut d'écran, lui, sortait tout seul. « 32 % » sur 2
 * chapitres des 24 et « 32 % » sur 24 des 24 ne disent pourtant pas la même
 * chose — surtout trois semaines avant le brevet.
 */
export function assietteGlobale(liste: readonly CouvertureMatiere[]): {
  commences: number
  total: number
} {
  return {
    commences: liste.reduce((sum, m) => sum + m.commences, 0),
    total: liste.reduce((sum, m) => sum + m.total, 0),
  }
}
