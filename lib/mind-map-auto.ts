// Carte mentale DÉRIVÉE du cours — logique pure, testée.
//
// LE PROBLÈME MESURÉ (sonde du 01/08/2026) : la quasi-totalité des 278
// chapitres n'a pas de carte mentale rédigée à la main, donc la page
// `/reviser/[matière]/[chapitre]/carte` affichait « La carte mentale de ce
// chapitre arrive bientôt » — une tuile qui promet et ne tient pas.
//
// LA RÈGLE : une carte mentale n'est rien d'autre que la STRUCTURE du cours.
// Or cette structure existe déjà, en markdown, dans `lessons.content` : le
// chapitre au centre, une branche par leçon, un rameau par titre de section.
// On la dérive donc, au lieu de promettre.
//
// Une carte rédigée à la main (`chapters.mind_map`) reste PRIORITAIRE : la
// dérivation n'est qu'un filet, jamais un remplacement.
//
// ⚠️ Le verrou payant ne bouge pas : la page ne dérive la carte que pour un
// élève qui y a droit (abonnement ou gemme). Les autres continuent de voir le
// leurre de `mindMapPlaceholder()`.

import type { MindMapData } from '@/lib/types'

export type LessonForMap = { title: string; content: string | null }

const MAX_BRANCHES = 6
const MAX_ENFANTS = 5
const MAX_LONGUEUR = 48

// Coupe proprement (sur un mot) : une carte mentale ne se lit pas en paragraphes.
function court(texte: string): string {
  const propre = texte.replace(/\s+/g, ' ').trim()
  if (propre.length <= MAX_LONGUEUR) return propre
  const coupe = propre.slice(0, MAX_LONGUEUR)
  const espace = coupe.lastIndexOf(' ')
  return `${(espace > 20 ? coupe.slice(0, espace) : coupe).trimEnd()}…`
}

// Retire le balisage markdown résiduel (gras, italique, code, liens).
function sansBalises(texte: string): string {
  return texte
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]+/g, '')
    .trim()
}

// Les rameaux d'une leçon : d'abord ses titres de section (## / ###), à défaut
// ses termes en gras, à défaut ses puces. C'est l'ordre de fiabilité : un titre
// est toujours une idée, un gras l'est presque toujours, une puce parfois.
export function branchChildren(content: string | null): string[] {
  if (!content) return []

  const titres = [...content.matchAll(/^#{2,4}\s+(.+)$/gm)].map((m) =>
    sansBalises(m[1]),
  )
  if (titres.length > 0) return dedupe(titres).slice(0, MAX_ENFANTS).map(court)

  const gras = [...content.matchAll(/\*\*([^*\n]{2,})\*\*/g)].map((m) =>
    sansBalises(m[1]),
  )
  if (gras.length > 0) return dedupe(gras).slice(0, MAX_ENFANTS).map(court)

  const puces = [...content.matchAll(/^\s*[-•]\s+(.+)$/gm)].map((m) =>
    sansBalises(m[1]),
  )
  return dedupe(puces).slice(0, MAX_ENFANTS).map(court)
}

function dedupe(valeurs: string[]): string[] {
  const vus = new Set<string>()
  return valeurs.filter((v) => {
    const cle = v.toLowerCase()
    if (!v || vus.has(cle)) return false
    vus.add(cle)
    return true
  })
}

// Carte dérivée du chapitre. `null` si le cours est trop maigre pour produire
// autre chose qu'une carte vide — dans ce cas la page reste honnête et le dit.
export function mindMapFromLessons(
  chapterTitle: string,
  lessons: readonly LessonForMap[],
): MindMapData | null {
  const branches = lessons
    .slice(0, MAX_BRANCHES)
    .map((l) => ({ titre: court(sansBalises(l.title)), enfants: branchChildren(l.content) }))
    .filter((b) => b.titre.length > 0 && b.enfants.length > 0)

  if (branches.length === 0) return null
  return { centre: court(sansBalises(chapterTitle)), branches }
}
