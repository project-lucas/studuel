// Ce que l'onglet Annales montre d'une annale corrigée, SANS son corrigé : le
// composant client ne reçoit que ces aperçus (quelques centaines d'octets),
// jamais le corpus. Pur et testé.

import { hrefSujet } from './sujet'
import type { AnnaleCorrigee, Examen, NaturePartie, Niveau } from './types'

export type AnnaleApercu = {
  id: string
  /** L’épreuve : la carte dit « Brevet » ou « Bac » au-dessus de l’année. */
  examen: Examen
  annee: number
  /** « Amérique du Nord · jour 1 », « Sujet zéro n° 1 ». */
  lieu: string
  dureeMin: number
  /** Les parties, par leur titre court (« Sujet 1 », « Exercice 2 ») et le thème tombé (recap.ts). */
  parties: { titre: string; nature: NaturePartie; theme: string }[]
  /** Le corrigé est réservé à Studuel+ (./acces : deux annales offertes par matière). */
  reservee?: boolean
}

export type AnneeAnnales = { annee: number; annales: AnnaleApercu[] }

export function lieuDe(a: Pick<AnnaleCorrigee, 'centre' | 'jour'>): string {
  return a.jour ? `${a.centre} · jour ${a.jour}` : a.centre
}

/**
 * L'adresse du sujet habillé : la route GET /api/annales/<id>/sujet (R2, avec
 * repli sur public/annales — lib/annales-corrigees/sujet.ts, 25/10/2026).
 */
export function pdfSujet(id: string, options: { telecharger?: boolean } = {}): string {
  return hrefSujet(id, options)
}

/** Chemin de la page d'une annale dans le dossier de la matière. */
export function cheminAnnale(matiere: string, id: string): string {
  return `/reviser/${matiere}/annales/${id}`
}

/**
 * Les annales corrigées d'une matière, pour une classe, regroupées par année —
 * la plus RÉCENTE d'abord (c'est la plus proche de ce que l'élève passera). À
 * l'intérieur d'une année, l'ordre alphabétique du lieu : stable, prévisible.
 *
 * Une voie technologique lit les annales de la voie générale (son contenu
 * aussi est celui du niveau général, cf. `contentLevelOf`) : le `niveau` reçu
 * ici est donc le niveau de CONTENU, pas la classe de l'élève.
 */
export function annalesParAnnee(
  annales: readonly AnnaleCorrigee[],
  matiere: string,
  niveau: Niveau | string,
): AnneeAnnales[] {
  const choisies = annales
    .filter((a) => a.matiere === matiere && a.niveau === niveau)
    .map(
      (a): AnnaleApercu => ({
        id: a.id,
        examen: a.examen,
        annee: a.annee,
        lieu: lieuDe(a),
        dureeMin: a.dureeMin,
        parties: a.parties.map((p) => ({ titre: p.titre, nature: p.nature, theme: p.theme })),
      }),
    )
    .sort((x, y) => y.annee - x.annee || x.lieu.localeCompare(y.lieu, 'fr'))

  const groupes: AnneeAnnales[] = []
  for (const a of choisies) {
    const dernier = groupes.at(-1)
    if (dernier && dernier.annee === a.annee) dernier.annales.push(a)
    else groupes.push({ annee: a.annee, annales: [a] })
  }
  return groupes
}

/** L'annale `id` de la matière `matiere`, ou `null` (lien mort, autre matière). */
export function trouverAnnale(
  annales: readonly AnnaleCorrigee[],
  matiere: string,
  id: string,
): AnnaleCorrigee | null {
  return annales.find((a) => a.id === id && a.matiere === matiere) ?? null
}

const NATURES: Record<NaturePartie, string> = {
  dissertation: 'Dissertation',
  explication: 'Explication de texte',
  commentaire: 'Commentaire',
  etude: 'Étude critique de documents',
  essai: 'Essai',
  interpretation: 'Interprétation',
  composee: 'Épreuve composée',
  exercice: 'Exercice',
}

export function libelleNature(n: NaturePartie): string {
  return NATURES[n]
}

/**
 * Le résumé d'une annale en une ligne : « 2 dissertations · 1 explication de
 * texte », « 4 exercices ». L'ordre suit le sujet.
 */
export function resumeParties(parties: readonly { nature: NaturePartie }[]): string {
  const comptes = new Map<NaturePartie, number>()
  for (const p of parties) comptes.set(p.nature, (comptes.get(p.nature) ?? 0) + 1)
  return [...comptes]
    .map(([nature, n]) => {
      const nom = NATURES[nature].toLowerCase()
      if (n === 1) return `1 ${nom}`
      // Pluriel du PREMIER mot seulement (« études critiques de documents »
      // est le seul cas à deux mots accordés — on l'écrit en entier).
      if (nature === 'etude') return `${n} études critiques de documents`
      const [tete, ...reste] = nom.split(' ')
      return `${n} ${tete}s${reste.length ? ' ' + reste.join(' ') : ''}`
    })
    .join(' · ')
}
