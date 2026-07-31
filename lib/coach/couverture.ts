// -----------------------------------------------------------------------------
// « Progrès » — ce que Marcel voit, matière par matière.
//
// CE QU'IL DIT, ET SEULEMENT ÇA. La typologie d'erreur (méthode / calcul /
// lecture d'énoncé / cours non su) n'existe encore sur aucune question du
// catalogue : tant qu'elle n'est pas là, Marcel ne peut PAS dire pourquoi
// l'élève se trompe, et un écran qui le prétendrait mentirait. Il dit donc ce
// qu'il sait vraiment lire — la COUVERTURE du programme : ce qui est solide, ce
// qui est en route, ce qui n'a jamais été ouvert.
//
// C'est déjà ce que le SRS ne sait pas faire : il ne connaît que ce qui a été
// vu, jamais ce qui manque.
//
// Logique PURE, aucun accès base.
// -----------------------------------------------------------------------------

import type { ChapterState } from '../mastery'
import { REGIMES, regimeOf, type Regime } from './regimes'

/** L'état d'ensemble d'une matière, du plus inquiétant au plus rassurant. */
export type EtatMatiere = 'vide' | 'retard' | 'en_route' | 'solide'

export type CouvertureMatiere = {
  slug: string
  name: string
  regime: Regime | null
  /** Chapitres maîtrisés. */
  solide: number
  /** Chapitres commencés mais pas acquis (en cours + fragiles). */
  enRoute: number
  /** Chapitres jamais ouverts — l'information que le SRS ne donne pas. */
  jamais: number
  total: number
  /** Maîtrise moyenne de la matière, en pourcent (0-100). */
  pct: number
  etat: EtatMatiere
  /** Le constat de Marcel : des chiffres, jamais une interprétation inventée. */
  constat: string
  /** La consigne du régime, ou `null` si la matière est hors doctrine. */
  consigne: string | null
}

export type ChapitreCouvert = {
  subjectSlug: string
  subjectName: string
  state: ChapterState
  value: number
}

/** À partir de cette part de chapitres maîtrisés, la matière est « solide ». */
export const SEUIL_SOLIDE = 0.7

/** En dessous de cette part de chapitres ouverts, la matière est « en retard ». */
export const SEUIL_RETARD = 0.4

function etatFor(solide: number, jamais: number, total: number): EtatMatiere {
  if (total === 0 || jamais === total) return 'vide'
  if (solide / total >= SEUIL_SOLIDE) return 'solide'
  if ((total - jamais) / total < SEUIL_RETARD) return 'retard'
  return 'en_route'
}

function constatFor(
  etat: EtatMatiere,
  couverture: { solide: number; enRoute: number; jamais: number; total: number },
): string {
  const { solide, jamais, total } = couverture

  switch (etat) {
    case 'vide':
      return total === 0
        ? 'Rien à ton niveau pour l’instant.'
        : 'Tu n’as encore ouvert aucun chapitre ici.'
    case 'retard':
      return jamais === 1
        ? 'Un chapitre n’a jamais été ouvert — c’est là que je regarderais.'
        : `${jamais} chapitres sur ${total} n’ont jamais été ouverts.`
    case 'solide':
      return solide === total
        ? 'Tout est solide ici. Tu peux passer à autre chose.'
        : `${solide} chapitres sur ${total} sont solides.`
    case 'en_route':
      return jamais === 0
        ? `Tout est entamé, ${solide} chapitres sur ${total} sont solides.`
        : `${solide} solides, ${jamais} jamais ouverts.`
  }
}

/**
 * Regroupe les chapitres par matière et en tire le constat de Marcel.
 *
 * Les matières les plus en retard remontent : c'est l'ordre utile, pas
 * l'alphabet. Une matière sans chapitre au niveau de l'élève n'apparaît pas —
 * Marcel ne commente pas un vide qui ne lui appartient pas.
 */
export function couvertureFor(
  chapitres: readonly ChapitreCouvert[],
): CouvertureMatiere[] {
  const parMatiere = new Map<
    string,
    { name: string; solide: number; enRoute: number; jamais: number; somme: number; total: number }
  >()

  for (const chapitre of chapitres) {
    const agg = parMatiere.get(chapitre.subjectSlug) ?? {
      name: chapitre.subjectName,
      solide: 0,
      enRoute: 0,
      jamais: 0,
      somme: 0,
      total: 0,
    }
    if (chapitre.state === 'maitrise') agg.solide += 1
    else if (chapitre.state === 'a_commencer') agg.jamais += 1
    else agg.enRoute += 1

    const value = Number.isFinite(chapitre.value) ? chapitre.value : 0
    agg.somme += Math.max(0, Math.min(1, value))
    agg.total += 1
    parMatiere.set(chapitre.subjectSlug, agg)
  }

  const liste: CouvertureMatiere[] = []
  for (const [slug, agg] of parMatiere) {
    const etat = etatFor(agg.solide, agg.jamais, agg.total)
    const regime = regimeOf(slug)
    liste.push({
      slug,
      name: agg.name,
      regime,
      solide: agg.solide,
      enRoute: agg.enRoute,
      jamais: agg.jamais,
      total: agg.total,
      pct: agg.total === 0 ? 0 : Math.round((agg.somme / agg.total) * 100),
      etat,
      constat: constatFor(etat, agg),
      consigne: regime === null ? null : REGIMES[regime].consigne,
    })
  }

  // Le plus urgent d'abord : vide, puis retard, puis en route, puis solide ;
  // à état égal, la maîtrise la plus basse remonte.
  const rang: Record<EtatMatiere, number> = {
    vide: 0,
    retard: 1,
    en_route: 2,
    solide: 3,
  }
  return liste.sort(
    (a, b) => rang[a.etat] - rang[b.etat] || a.pct - b.pct,
  )
}

/** Maîtrise moyenne sur toutes les matières suivies, en pourcent. */
export function couvertureGlobale(
  liste: readonly CouvertureMatiere[],
): number {
  const total = liste.reduce((sum, m) => sum + m.total, 0)
  if (total === 0) return 0
  const pondere = liste.reduce((sum, m) => sum + m.pct * m.total, 0)
  return Math.round(pondere / total)
}
