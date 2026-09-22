// -----------------------------------------------------------------------------
// L'APERÇU — ce que le CLIENT reçoit d'une fiche.
//
// Le corpus complet fait plusieurs centaines de kilo-octets de texte : il ne
// descend jamais dans le navigateur. La liste, la recherche et les filtres
// n'ont pourtant besoin que de six lignes par fiche — un nom, des dates, une
// citation, de quoi chercher. C'est ce paquet-là, et lui seul, que la page
// serveur sérialise pour l'écran de liste ; la fiche entière n'est lue que par
// la page de la fiche, côté serveur.
//
// `cles` est la MOITIÉ INVISIBLE de la chaîne de recherche, déjà normalisée
// (sans accent, en minuscules, mots dédoublonnés) : les tags, les rôles,
// l'origine, les mots distinctifs des citations qui ne tiennent pas sur la
// carte. L'autre moitié — le nom, les dates, la citation tronquée — descend
// déjà pour être PEINTE, et le client recolle les deux (`indexer`,
// recherche.ts). Envoyer les deux moitiés coûtait cinquante kilo-octets de
// doublon sur deux cent cinquante fiches.
// -----------------------------------------------------------------------------

import { clesAffichees, elisions, normaliser } from './recherche'
import {
  datesDe,
  estEvenement,
  estPersonnage,
  PERIODE_LABELS,
  type Entree,
  type Niveau,
  type Periode,
  type Volet,
} from './types'

export type Apercu = {
  id: string
  volet: Volet
  nom: string
  /** Le surnom d'un personnage, le lieu d'un événement : la seconde ligne. */
  detail?: string
  dates: string
  tri: number
  periode: Periode
  emoji: string
  /** La phrase phare, telle qu'elle s'affiche sur la carte. */
  citation: string
  /** Qui l'a dite, quand la fiche n'est pas un portrait. */
  citationQui?: string
  niveaux: Niveau[]
  /** Chaîne de recherche normalisée, mots séparés par une espace. */
  cles: string
}

/** Combien de signes de citation tiennent sur une carte de liste (2 lignes). */
export const CITATION_CARTE_MAX = 132

/**
 * Tronque une citation à la coupe de mot, sans couper un mot en deux et sans
 * laisser de ponctuation orpheline. Une carte qui affiche « la liberté c… »
 * donne envie de fermer l'écran.
 */
export function citationCourte(texte: string, max = CITATION_CARTE_MAX): string {
  const lettres = [...texte]
  if (lettres.length <= max) return texte
  const coupe = lettres.slice(0, max).join('')
  const dernier = coupe.lastIndexOf(' ')
  const garde = (dernier > max * 0.6 ? coupe.slice(0, dernier) : coupe).replace(
    /[\s,;:.!?«»"'’-]+$/u,
    '',
  )
  return `${garde}…`
}

/**
 * LES MOTS DE LIAISON, exclus de l'index des citations.
 *
 * Une phrase célèbre compte deux tiers de mots-outils (« de », « que », « dans
 * les », « il n'y a »). Indexés, ils pèsent la moitié du poids de l'index et ne
 * servent à rien : personne ne cherche « dans ». Les mots des NOMS, eux, sont
 * tous gardés — « de » compte dans « Blanche de Castille ».
 */
const MOTS_DE_LIAISON = new Set([
  'ainsi', 'alors', 'apres', 'aucun', 'aucune', 'aussi', 'autre', 'autres',
  'avant', 'avec', 'avoir', 'beaucoup', 'bien', 'cela', 'celle', 'celles',
  'celui', 'cette', 'ceux', 'chaque', 'chez', 'comme', 'dans', 'depuis',
  'donc', 'elle', 'elles', 'encore', 'entre', 'etait', 'etre', 'faire',
  'fait', 'jamais', 'jusqu', 'leur', 'leurs', 'mais', 'meme', 'memes',
  'moins', 'nous', 'plus', 'pour', 'quand', 'quelque', 'rien', 'sans',
  'sera', 'seront', 'sont', 'sous', 'tous', 'tout', 'toute', 'toutes',
  'toujours', 'trop', 'vers', 'vous',
])

/**
 * La longueur minimale d'un mot de citation pour entrer dans l'index. Cinq
 * lettres : c'est le seuil au-delà duquel un mot est DISTINCTIF (« boutes »,
 * « brioche », « democratie », « infame ») et en deçà duquel il appartient à
 * toutes les phrases de la langue.
 */
const CITATION_MOT_MIN = 5

/**
 * Le budget d'index d'une fiche pour ses citations, en signes. Les fiches
 * portent jusqu'à quatre citations de quatre lignes : sans borne, l'index
 * complet pesait 234 ko pour 242 fiches — un quart de méga-octet envoyé au
 * navigateur pour afficher une liste. Avec cette borne, les mots les plus
 * cherchables de chaque phrase restent, et l'index tient dans le tiers.
 */
const CITATION_CLES_MAX = 260

/**
 * Les mots de recherche d'une fiche QUE LA CARTE N'AFFICHE PAS.
 *
 * Le nom, le surnom, les dates et la citation tronquée descendent déjà dans le
 * navigateur pour être PEINTS : les réindexer ici, c'est les envoyer deux fois.
 * Le client recolle les deux moitiés à l'arrivée (`indexer`, recherche.ts) — un
 * `map` sur deux cent cinquante lignes, une fois par ouverture d'écran.
 *
 * Ce qui reste ici est donc ce qu'on ne voit pas : les tags (les mots du cours,
 * les lieux, les orthographes voisines), les rôles, l'origine, et les mots
 * distinctifs des citations qui n'ont pas tenu dans les deux lignes de la carte.
 */
export function clesDe(entree: Entree, deja: string): string {
  const invisible: string[] = [...entree.tags, PERIODE_LABELS[entree.periode]]
  if (estPersonnage(entree)) {
    invisible.push(...entree.roles, entree.origine ?? '')
  }
  if (estEvenement(entree)) {
    invisible.push(entree.lieu ?? '')
  }

  const vus = new Set(deja.split(' '))
  const mots = new Set<string>()
  const normalise = normaliser(invisible.join(' '))
  for (const mot of normalise.split(' ')) {
    if (mot.length > 1 && !vus.has(mot)) mots.add(mot)
  }
  for (const recolle of elisions(normalise)) {
    if (!vus.has(recolle)) mots.add(recolle)
  }

  // LES CITATIONS. On cherche souvent une phrase dont on a retenu trois mots,
  // sans savoir de qui elle est — c'est même le cas le plus fréquent une fois
  // qu'on a lu deux ou trois fiches. Mais seuls les mots DISTINCTIFS méritent
  // d'être indexés, et dans les limites d'un budget : la phrase phare passe en
  // premier, c'est elle qu'on cherche.
  let budget = CITATION_CLES_MAX
  for (const citation of entree.citations) {
    for (const mot of normaliser(citation.texte).split(' ')) {
      if (budget <= 0) break
      if (mot.length < CITATION_MOT_MIN) continue
      if (MOTS_DE_LIAISON.has(mot)) continue
      if (vus.has(mot) || mots.has(mot)) continue
      mots.add(mot)
      budget -= mot.length + 1
    }
    if (budget <= 0) break
  }

  return [...mots].join(' ')
}

export function apercuDe(entree: Entree): Apercu {
  const phare = entree.citations[0]
  const apercu: Omit<Apercu, 'cles'> = {
    id: entree.id,
    volet: entree.volet,
    nom: entree.nom,
    detail: estPersonnage(entree) ? entree.surnom : entree.lieu,
    dates: datesDe(entree),
    tri: entree.tri,
    periode: entree.periode,
    emoji: entree.emoji,
    citation: phare ? citationCourte(phare.texte) : '',
    citationQui: estEvenement(entree) ? phare?.qui : undefined,
    niveaux: entree.niveaux,
  }
  return { ...apercu, cles: clesDe(entree, clesAffichees(apercu)) }
}

export function apercus(entrees: readonly Entree[]): Apercu[] {
  return entrees.map(apercuDe)
}
