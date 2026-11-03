// -----------------------------------------------------------------------------
// LES DICTÉES ÉCRITES PAR STUDUEL (01/11/2026) — le contenu, en JSON.
//
// Lucas : « des dictées par niveau, de la 6e à la Terminale, pas trop
// difficiles », « les plus grands discours des rois ou des figures chrétiennes
// de la France, puis les autres », « une dictée intéressante est liée à un
// contexte politique intéressant : on la replace, et cela nous marque », « 99 %
// des élèves les feront en ligne : le texte, et de mini-enregistrements de
// phrases sur lesquels on peut revenir ou avancer, puis corriger ».
//
// Une dictée = `contenu/dictees/<slug>.json` (texte en morceaux, contexte,
// pièges) + sa voix, `public/audio/dictees/<slug>/` (scripts/dictees-audio.mjs).
// Les textes sont du DOMAINE PUBLIC (auteur mort depuis plus de 70 ans) ou
// écrits par Studuel ; l'orthographe est modernisée et le dit.
// -----------------------------------------------------------------------------
import louisXviTestament from '@/contenu/dictees/louis-xvi-testament.json'
import type { NiveauDictee } from '@/lib/francais/dictee/niveaux'

export type DicteeContenu = {
  slug: string
  titre: string
  auteur: string
  source: string
  date: string
  /** Les classes à qui elle s'adresse (« 4e », « 3e »). */
  classes: string[]
  niveau: NiveauDictee
  /** Index des morceaux qui ferment un paragraphe (« point, à la ligne »). */
  paragraphes?: number[]
  duree_min: number
  contexte: string[]
  /** Les difficultés du texte, expliquées après la correction. */
  pieges: string[]
  segments: string[]
}

export const DICTEES_CONTENU: readonly DicteeContenu[] = [louisXviTestament as DicteeContenu]

export function dicteeContenu(slug: string): DicteeContenu | null {
  return DICTEES_CONTENU.find((d) => d.slug === slug) ?? null
}

/** L'adresse de l'enregistrement d'un morceau (rang 0 → « 01.mp3 »). */
export function audioDuMorceau(slug: string, index: number): string {
  return `/audio/dictees/${slug}/${String(index + 1).padStart(2, '0')}.mp3`
}

/** L'adresse de la lecture d'une traite. */
export function audioIntegral(slug: string): string {
  return `/audio/dictees/${slug}/integrale.mp3`
}

/** Ce que la session de dictée reçoit : les morceaux avec leur voix, et le contexte. */
export function sessionDeContenu(d: DicteeContenu) {
  return {
    segments: d.segments.map((texte, position) => ({
      position,
      texte,
      audio: audioDuMorceau(d.slug, position),
    })),
    audioIntegral: audioIntegral(d.slug),
    contexte: { date: d.date, source: d.source, paragraphes: d.contexte },
  }
}
