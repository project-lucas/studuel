// -----------------------------------------------------------------------------
// LE RÉCAP DES SUJETS TOMBÉS (25/10/2026, Lucas : « une icône dans l'angle de
// la section Annales : un récap des sujets tombés par année — ex. en histoire :
// 2021 14-18, 2022 14-18 de nouveau, 2023 mers et océans — pour que l'élève
// voie tout de suite les sujets qui tombent le plus souvent et priorise »).
//
// Deux lectures du même corpus, pour une matière et une classe :
//  · LA FRISE — année par année, la plus récente d'abord, chaque session
//    (centre, jour) avec les thèmes tombés et la nature de la partie ;
//  · CE QUI TOMBE LE PLUS — chaque thème avec le nombre de SESSIONS où il est
//    tombé (une session où deux parties portent le même thème compte UNE fois :
//    on mesure la probabilité qu'il tombe, pas le nombre de questions).
//
// Pur : il lit les aperçus (apercu.ts) que l'onglet reçoit déjà, le corpus ne
// descend donc toujours pas dans le navigateur. `theme` est posé sur chaque
// partie (types.ts, relu par le validateur) avec la MÊME graphie d'une annale à
// l'autre — c'est la clé du comptage.
// -----------------------------------------------------------------------------

import { annalesParAnnee, type AnneeAnnales } from './apercu'
import type { AnnaleCorrigee, NaturePartie } from './types'

export type SujetTombe = { theme: string; nature: NaturePartie; titre: string }

export type SessionRecap = { id: string; lieu: string; sujets: SujetTombe[] }

export type AnneeRecap = { annee: number; sessions: SessionRecap[] }

export type ThemeFrequent = {
  theme: string
  /** Le nombre de sessions où le thème est tombé. */
  fois: number
  /** Les années où il est tombé, la plus récente d'abord, sans doublon. */
  annees: number[]
}

export type RecapAnnales = {
  /** Le nombre de sessions du corpus — le dénominateur de « tombé 3 fois en 6 sessions ». */
  sessions: number
  annees: AnneeRecap[]
  /** Du plus fréquent au plus rare ; à fréquence égale, le plus récent d'abord. */
  frequents: ThemeFrequent[]
}

/** Le récap d'un corpus déjà groupé par année (ce que l'onglet Annales reçoit). */
export function recapDesAnnales(groupes: readonly AnneeAnnales[]): RecapAnnales {
  const annees: AnneeRecap[] = groupes.map((g) => ({
    annee: g.annee,
    sessions: g.annales.map((a) => ({
      id: a.id,
      lieu: a.lieu,
      sujets: a.parties.map((p) => ({ theme: p.theme, nature: p.nature, titre: p.titre })),
    })),
  }))

  const comptes = new Map<string, { fois: number; annees: Set<number> }>()
  for (const g of annees) {
    for (const s of g.sessions) {
      // Un thème ne compte qu'une fois par session.
      for (const theme of new Set(s.sujets.map((x) => x.theme))) {
        const c = comptes.get(theme) ?? { fois: 0, annees: new Set<number>() }
        comptes.set(theme, { fois: c.fois + 1, annees: c.annees.add(g.annee) })
      }
    }
  }

  const frequents = [...comptes]
    .map(([theme, c]) => ({ theme, fois: c.fois, annees: [...c.annees].sort((x, y) => y - x) }))
    .sort((x, y) => y.fois - x.fois || (y.annees[0] ?? 0) - (x.annees[0] ?? 0) || x.theme.localeCompare(y.theme, 'fr'))

  const sessions = annees.reduce((n, g) => n + g.sessions.length, 0)
  return { sessions, annees, frequents }
}

/** Le récap d'une matière pour une classe, depuis le corpus complet. */
export function recapAnnales(annales: readonly AnnaleCorrigee[], matiere: string, niveau: string): RecapAnnales {
  return recapDesAnnales(annalesParAnnee(annales, matiere, niveau))
}

/** « tombé 3 fois en 6 sessions », « tombé 1 fois en 1 session ». */
export function phraseFrequence(fois: number, sessions: number): string {
  return `tombé ${fois} fois en ${sessions} session${sessions > 1 ? 's' : ''}`
}

/** Le poids d'un thème, de 0 à 1 — la longueur de sa barre dans le récap. */
export function poidsTheme(fois: number, sessions: number): number {
  if (sessions <= 0) return 0
  return Math.min(1, Math.max(0, fois / sessions))
}
