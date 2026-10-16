// -----------------------------------------------------------------------------
// QUI LIT QUELLE ANNALE (15/10/2026, Lucas : « il faut plus d'annales corrigées :
// 2 annales corrigées par matière pour le freemium, beaucoup plus pour
// Studuel+ »).
//
// Le GRATUIT lit les DEUX PLUS RÉCENTES de chaque matière et de chaque classe
// (les plus proches de ce qu'il passera) ; Studuel+ les lit toutes. Le SUJET
// officiel reste public (c'est un document de l'Éducation nationale, servi par
// public/annales) : ce qui est réservé, c'est NOTRE corrigé.
//
// Pur et testé : l'onglet Annales s'en sert pour poser la couronne, la page
// d'une annale pour ouvrir ou non le corrigé.
// -----------------------------------------------------------------------------

import { ANNALES_GRATUITES_PAR_MATIERE } from '@/lib/studuel-plus/formule'
import { lieuDe, type AnneeAnnales } from './apercu'
import type { AnnaleCorrigee } from './types'

type AnnaleTriable = Pick<AnnaleCorrigee, 'id' | 'matiere' | 'niveau' | 'annee' | 'centre' | 'jour'>

/** Les annales ouvertes au gratuit pour une matière et une classe (même ordre que l'onglet). */
export function annalesGratuites(annales: readonly AnnaleTriable[], matiere: string, niveau: string): Set<string> {
  const ids = annales
    .filter((a) => a.matiere === matiere && a.niveau === niveau)
    .sort((x, y) => y.annee - x.annee || lieuDe(x).localeCompare(lieuDe(y), 'fr'))
    .slice(0, ANNALES_GRATUITES_PAR_MATIERE)
    .map((a) => a.id)
  return new Set(ids)
}

export type AccesAnnale = 'libre' | 'plus'

export function accesAnnale(annale: AnnaleTriable, premium: boolean, annales: readonly AnnaleTriable[]): AccesAnnale {
  if (premium) return 'libre'
  return annalesGratuites(annales, annale.matiere, annale.niveau).has(annale.id) ? 'libre' : 'plus'
}

/** Pose la couronne sur les annales que le gratuit ne lit pas. */
export function marquerReservees(
  groupes: readonly AnneeAnnales[],
  annales: readonly AnnaleTriable[],
  matiere: string,
  niveau: string,
  premium: boolean,
): AnneeAnnales[] {
  if (premium) return groupes.map((g) => ({ ...g, annales: g.annales.map((a) => ({ ...a, reservee: false })) }))
  const libres = annalesGratuites(annales, matiere, niveau)
  return groupes.map((g) => ({ ...g, annales: g.annales.map((a) => ({ ...a, reservee: !libres.has(a.id) })) }))
}

/** « 2 annales offertes sur 7 » — la ligne qui dit ce que Studuel+ ajoute. */
export function phraseAnnales(total: number, premium: boolean): string {
  if (premium || total <= ANNALES_GRATUITES_PAR_MATIERE) return total === 1 ? '1 annale corrigée' : `${total} annales corrigées`
  return `${ANNALES_GRATUITES_PAR_MATIERE} offertes sur ${total} · toutes avec Studuel+`
}
