// -----------------------------------------------------------------------------
// LE MANUEL NUMÉRIQUE — les exercices d'un THÈME lus comme un livre (30/09/2026).
//
// Lucas : « la navigation entre les exercices par thème se fait comme la
// navigation d'un livre numérique ». Un thème (colonne `chapters.theme`) est un
// livre ; ses chapitres, pris dans l'ordre du programme, en sont les sections ;
// chaque exercice du cahier est une PAGE. On tourne les pages d'un chapitre à
// l'autre sans repasser par un sommaire, on sait toujours où l'on est
// (« p. 7 / 24 »), et le sommaire du livre est à un toucher.
//
// Pur et testé : la page calcule le livre, le composant ne fait que l'afficher.
// Une page verrouillée reste une page du livre (on la voit, on ne l'ouvre pas) :
// les règles de déblocage sont celles du cahier (`etatsExercices`), chapitre
// par chapitre — le premier exercice d'un chapitre est toujours ouvert.
// -----------------------------------------------------------------------------

import type { EtatExercice } from './progression'
import type { Etoiles } from './types'

export type ChapitreLivre = { id: string; titre: string }

export type PageSource = {
  chapitreId: string
  position: number
  etoiles: Etoiles
  titre: string
  etat: EtatExercice
}

export type PageLivre = PageSource & {
  /** Numéro de page dans le livre, à partir de 1. */
  numero: number
  chapitreTitre: string
  href: string
}

export type SectionLivre = ChapitreLivre & {
  /** Numéros de la première et de la dernière page du chapitre. */
  debut: number
  fin: number
  pages: PageLivre[]
}

export type Livre = {
  /** Le nom du thème, ou le titre du chapitre quand il n'est rangé dans aucun thème. */
  titre: string
  pages: PageLivre[]
  sections: SectionLivre[]
}

/** L'adresse d'une page : l'exercice `position` du chapitre. */
export const hrefPage = (matiere: string, chapitreId: string, position: number) =>
  `/reviser/${matiere}/${chapitreId}/exercice/${position}`

/**
 * Assemble le livre : les chapitres dans l'ordre donné, leurs exercices par
 * position. Un chapitre sans exercice n'a pas de page (il n'apparaît pas).
 */
export function construireLivre(
  titre: string,
  matiere: string,
  chapitres: readonly ChapitreLivre[],
  pagesSources: readonly PageSource[],
  /** L'adresse d'une page (les vraies routes par défaut ; l'aperçu de dev en donne d'autres). */
  href: (chapitreId: string, position: number) => string = (c, p) => hrefPage(matiere, c, p),
): Livre {
  const parChapitre = new Map<string, PageSource[]>()
  for (const p of pagesSources) {
    const liste = parChapitre.get(p.chapitreId) ?? []
    liste.push(p)
    parChapitre.set(p.chapitreId, liste)
  }

  const pages: PageLivre[] = []
  const sections: SectionLivre[] = []
  for (const c of chapitres) {
    const siennes = [...(parChapitre.get(c.id) ?? [])].sort((a, b) => a.position - b.position)
    if (!siennes.length) continue
    const debut = pages.length + 1
    const pagesSection = siennes.map((p) => ({
      ...p,
      numero: pages.length + siennes.indexOf(p) + 1,
      chapitreTitre: c.titre,
      href: href(c.id, p.position),
    }))
    pages.push(...pagesSection)
    sections.push({ ...c, debut, fin: pages.length, pages: pagesSection })
  }
  return { titre, pages, sections }
}

export type Voisinage = {
  courante: PageLivre
  precedente: PageLivre | null
  suivante: PageLivre | null
  total: number
  /** La section (le chapitre) de la page courante. */
  section: SectionLivre
  /** Part du livre déjà atteinte, de 0 à 1 (la page courante comprise). */
  avancee: number
}

/** Où l'on est dans le livre, et les deux pages voisines. `null` si la page n'y est pas. */
export function voisinage(livre: Livre, chapitreId: string, position: number): Voisinage | null {
  const i = livre.pages.findIndex((p) => p.chapitreId === chapitreId && p.position === position)
  if (i < 0) return null
  const courante = livre.pages[i]
  const section = livre.sections.find((s) => s.id === chapitreId)
  if (!section) return null
  return {
    courante,
    precedente: livre.pages[i - 1] ?? null,
    suivante: livre.pages[i + 1] ?? null,
    total: livre.pages.length,
    section,
    avancee: livre.pages.length ? (i + 1) / livre.pages.length : 0,
  }
}

/** Ajoute le sens de la page tournée à une adresse (qui a peut-être déjà des paramètres). */
export const avecSens = (href: string, sens: 'suivante' | 'precedente') =>
  `${href}${href.includes('?') ? '&' : '?'}sens=${sens}`

/** Combien de pages du livre sont réussies. */
export const pagesReussies = (livre: Livre) => livre.pages.filter((p) => p.etat === 'reussi').length

/**
 * Un geste horizontal est-il un « tourner la page » ? Assez long, nettement
 * plus horizontal que vertical (un défilement de la page ne doit jamais
 * tourner la page). Rend le sens, ou null.
 */
export function sensDuGeste(dx: number, dy: number): 'suivante' | 'precedente' | null {
  const SEUIL = 70
  if (Math.abs(dx) < SEUIL || Math.abs(dx) < Math.abs(dy) * 2) return null
  return dx < 0 ? 'suivante' : 'precedente'
}
