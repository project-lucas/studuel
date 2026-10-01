// Carte mentale DÉRIVÉE du cours — logique pure, testée.
//
// LE PROBLÈME MESURÉ (sonde du 01/08/2026) : la quasi-totalité des 278
// chapitres n'a pas de carte mentale rédigée à la main, donc la page
// `/reviser/[matière]/[chapitre]/carte` affichait « La carte mentale de ce
// chapitre arrive bientôt » — une tuile qui promet et ne tient pas.
//
// LA RÈGLE : une carte mentale n'est rien d'autre que la STRUCTURE du cours.
// Or cette structure existe déjà, en markdown, dans `lessons.content` : le
// chapitre au centre, puis — une seule leçon, le cas de toutes les fiches du
// programme — une branche par SECTION et ses mots-clés pour rameaux ; à
// plusieurs leçons, une branche par leçon et un rameau par titre de section.
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

// -----------------------------------------------------------------------------
// UNE SEULE LEÇON : LA CARTE SUIT LES SECTIONS DU COURS (01/10/2026).
//
// Depuis que le programme est rangé en fiches, un chapitre n'a plus qu'UNE
// leçon. « Une branche par leçon » ne donnait donc plus qu'une branche, avec
// les titres de section pour seuls rameaux : la « Fiche de révision » de 2 301
// chapitres (3e → Tle) se réduisait à cinq intertitres, coupés au bord de
// l'écran sur un téléphone. La carte prend maintenant une branche par SECTION
// (`## …`) et, pour rameaux, les mots-clés de la section — ce qu'on surligne
// en relisant un cours.
// -----------------------------------------------------------------------------

const MAX_SECTIONS = 8
/** Au-delà, un « mot-clé » en gras est une phrase : il n'a pas sa place sur une carte. */
const MAX_MOT_CLE = 40
/**
 * Mis en gras dans un tableau (« **Oui** », « **Non** », « **deux** »), ces mots
 * portent le sens de leur ligne, pas d'une carte : seuls, ils ne disent rien.
 */
const MOTS_CREUX = new Set([
  'oui', 'non', 'tous', 'toutes', 'tout', 'toute', 'un', 'une', 'deux', 'trois',
  'pas', 'ne', 'ni', 'et', 'ou', 'plus', 'moins', 'très', 'jamais', 'toujours',
])
/** Les sections d'illustration : les premières écartées quand il y en a trop. */
const EST_EXEMPLE = /^(exemple|exemples|exercice|application|pour aller plus loin)\b/i

type Section = { titre: string; corps: string[] }

function sectionsDe(content: string | null): Section[] {
  const sections: Section[] = []
  for (const ligne of (content ?? '').split('\n')) {
    const titre = /^##\s+(.+)$/.exec(ligne.trim())?.[1]
    if (titre) sections.push({ titre: sansBalises(titre), corps: [] })
    else sections.at(-1)?.corps.push(ligne)
  }
  return sections.filter((s) => s.titre.length > 0)
}

const estLigneTableau = (l: string) => /^\|.*\|$/.test(l.trim())
const estSeparateur = (l: string) => /^\|[\s:|-]+\|$/.test(l.trim())

/**
 * Les mots-clés d'une section : ses termes en gras ; à défaut ce qui la
 * structure — jalons de frise, première colonne de ses tableaux, puces, étapes.
 */
function motsCles(corps: readonly string[]): string[] {
  const gras = corps
    .flatMap((l) => [...l.matchAll(/\*\*([^*\n]{2,})\*\*/g)].map((m) => sansBalises(m[1])))
    .filter((t) => t.length <= MAX_MOT_CLE && !MOTS_CREUX.has(t.toLowerCase()))
  if (dedupe(gras).length >= 2) return dedupe(gras).slice(0, MAX_ENFANTS)

  const autres: string[] = []
  let dansTableau = false
  for (const brut of corps) {
    const l = brut.trim()
    if (estLigneTableau(l)) {
      // La première ligne d'un tableau est son en-tête : pas un mot-clé.
      if (dansTableau && !estSeparateur(l)) {
        const premiere = sansBalises(l.replace(/^\|/, '').split('|')[0] ?? '')
        if (premiere) autres.push(premiere)
      }
      dansTableau = true
      continue
    }
    dansTableau = false
    const jalon = /^@\s+(.+?)\s+—\s+(.+)$/.exec(l)
    if (jalon) autres.push(`${sansBalises(jalon[1])} · ${sansBalises(jalon[2])}`)
    const puce = /^(?:[-•]|\d{1,2}\.)\s+(.+)$/.exec(l)
    if (puce) autres.push(sansBalises(puce[1]))
  }
  return dedupe([...gras, ...autres]).slice(0, MAX_ENFANTS).map(court)
}

/** Les branches d'une leçon unique, une par section. Vide s'il n'y a pas deux sections. */
function branchesParSection(content: string | null): MindMapData['branches'] {
  let sections = sectionsDe(content)
  if (sections.length > MAX_SECTIONS) {
    const sansExemples = sections.filter((s) => !EST_EXEMPLE.test(s.titre))
    if (sansExemples.length >= 2) sections = sansExemples
  }
  if (sections.length < 2) return []
  return sections
    .slice(0, MAX_SECTIONS)
    .map((s) => ({ titre: court(s.titre), enfants: motsCles(s.corps) }))
}

// Carte dérivée du chapitre. `null` si le cours est trop maigre pour produire
// autre chose qu'une carte vide — dans ce cas la page reste honnête et le dit.
export function mindMapFromLessons(
  chapterTitle: string,
  lessons: readonly LessonForMap[],
): MindMapData | null {
  if (lessons.length === 1) {
    const parSection = branchesParSection(lessons[0].content)
    if (parSection.length > 0) {
      // Le cœur porte le titre ENTIER du chapitre : sur un téléphone il occupe
      // toute la largeur, et un titre coupé (« … : vers une guerre… ») est la
      // première chose qu'on lit.
      return { centre: sansBalises(chapterTitle).replace(/\s+/g, ' ').trim(), branches: parSection }
    }
  }

  const branches = lessons
    .slice(0, MAX_BRANCHES)
    .map((l) => ({ titre: court(sansBalises(l.title)), enfants: branchChildren(l.content) }))
    .filter((b) => b.titre.length > 0 && b.enfants.length > 0)

  if (branches.length === 0) return null
  return { centre: court(sansBalises(chapterTitle)), branches }
}
