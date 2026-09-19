// -----------------------------------------------------------------------------
// CE QU'ON PEUT TOUCHER DANS UN DOCUMENT — pour une question « zone ».
//
// Une zone se désigne par un identifiant. Trois familles :
//
//   · les identifiants ÉCRITS (lieux d'une carte, éléments d'un schéma, nœuds
//     d'une chaîne…), que le compilateur remplace par z1, z2… ;
//   · les identifiants de POSITION, calculés des deux côtés : k0 (catégorie
//     d'un graphique), r1c2 (case d'un tableau), v2.5 (graduation d'une
//     droite), m12 (mot d'un texte), et les codes de région d'un fond ;
//   · les noms de points d'une figure (« A »), écrits sur la figure.
// -----------------------------------------------------------------------------

import { CODES_FONDS } from './cartes/codes'
import { motsMarques, texteDuBloc } from './mots'
import type { BlocScratch, DocDroite, Document } from './types'

/** L'identifiant d'une graduation : « v2.5 », « v-1 », « v0.25 ». */
export function idGraduation(v: number): string {
  return `v${Math.round(v * 1e6) / 1e6}`
}

/** Les valeurs de toutes les graduations d'une droite (principales et fines). */
export function graduations(doc: Pick<DocDroite, 'min' | 'max' | 'pas' | 'division'>): number[] {
  const parts = Math.max(1, Math.round(doc.division ?? 1))
  const fin = doc.pas / parts
  const n = Math.round((doc.max - doc.min) / fin)
  return Array.from({ length: n + 1 }, (_, k) => Math.round((doc.min + k * fin) * 1e6) / 1e6)
}

function idsScratch(blocs: BlocScratch[], out: Set<string>) {
  for (const b of blocs) {
    if (b.id) out.add(b.id)
    if (b.interieur) idsScratch(b.interieur, out)
    if (b.sinon) idsScratch(b.sinon, out)
  }
}

/**
 * Les cibles qu'une question « zone » peut viser dans un document ÉCRIT
 * (avant compilation). Pour un texte ou un dialogue, ce sont les GROUPES de
 * mots marqués `[[g|…]]`.
 */
export function ciblesEcrites(doc: Document): Set<string> {
  const out = new Set<string>()
  switch (doc.type) {
    case 'texte':
      for (const g of motsMarques(doc.blocs.map(texteDuBloc)).groupes.keys()) out.add(g)
      break
    case 'dialogue':
      for (const g of motsMarques(doc.repliques.map((r) => r.texte)).groupes.keys()) out.add(g)
      break
    case 'carte':
      for (const l of doc.lieux ?? []) out.add(l.id)
      for (const a of doc.aires ?? []) if (a.id) out.add(a.id)
      for (const t of doc.traits ?? []) if (t.id) out.add(t.id)
      if (doc.regionsCliquables) for (const code of Object.keys(CODES_FONDS[doc.fond]?.zones ?? {})) out.add(code)
      break
    case 'schema':
      for (const e of doc.elements) if (e.id && e.zone) out.add(e.id)
      break
    case 'chaine':
      for (const n of doc.noeuds) out.add(n.id)
      break
    case 'frise':
      for (const e of doc.evenements ?? []) out.add(e.id)
      for (const p of doc.periodes ?? []) if (p.id) out.add(p.id)
      break
    case 'fiche':
      for (const l of doc.lignes) if (!('separateur' in l) && l.id) out.add(l.id)
      break
    case 'scratch':
      for (const s of doc.scripts) idsScratch(s, out)
      break
    case 'figure':
      for (const p of doc.points ?? []) out.add(p.id)
      for (const liste of [doc.segments, doc.droites, doc.demiDroites, doc.cercles, doc.angles, doc.polygones])
        for (const x of liste ?? []) if (x.id) out.add(x.id)
      break
    case 'tableau':
      doc.lignes.forEach((ligne, i) => ligne.forEach((_, j) => out.add(`r${i}c${j}`)))
      break
    case 'graphique':
      doc.categories.forEach((_, i) => out.add(`k${i}`))
      break
    case 'circuit':
      for (const b of doc.branches) if (b.id) out.add(b.id)
      break
    case 'droite':
      for (const p of doc.points ?? []) out.add(p.id)
      if (doc.graduationsCliquables) for (const v of graduations(doc)) out.add(idGraduation(v))
      break
    default:
      break
  }
  return out
}
