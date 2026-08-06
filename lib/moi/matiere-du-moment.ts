// -----------------------------------------------------------------------------
// LA MATIÈRE DU MOMENT — le seul geste de l'onglet Moi.
//
// UNE matière, jamais un tableau. Le tableau chapitre par chapitre existe déjà,
// il est l'écran « Progrès » de Marcel ; le refaire ici donnerait deux écrans
// qui disent la même chose avec deux mises en page différentes — et le jour où
// la définition du pourcentage change, deux endroits à corriger.
//
// Moi ne fait donc qu'une chose que Marcel ne fait pas : il DÉSIGNE. L'élève qui
// regarde ses chiffres repart avec un nom de matière et un bouton, pas avec une
// liste à trier lui-même.
//
// LA RÈGLE DE CHOIX, dans cet ordre :
//   1. la priorité (`lib/progression`) — urgente, puis attention, puis ok ;
//   2. à priorité égale, le pourcentage le plus bas ;
//   3. puis le plus de cartes à revoir (une file due est un travail déjà prêt) ;
//   4. puis l'ordre alphabétique, pour que le choix soit STABLE d'un chargement
//      à l'autre — une matière du moment qui change à chaque rafraîchissement
//      ne serait plus une consigne.
//
// Les matières dont AUCUN chapitre n'a été commencé sont écartées : elles ne
// réclament rien tant que le prof ne les a pas abordées (même raison que le tri
// de `couvertureFor`). Si aucune ne reste, la fonction renvoie null et l'écran
// affiche l'invitation à déclarer son programme — jamais une matière au hasard.
//
// Logique pure, aucun accès base.
// -----------------------------------------------------------------------------

import type { CouvertureMatiere } from '@/lib/coach/couverture'
import { RANG_PRIORITE, type Priorite } from '@/lib/progression'

export type MatiereDuMoment = {
  slug: string
  name: string
  /** Maîtrise sur les chapitres commencés (0–100). */
  pct: number
  priorite: Exclude<Priorite, 'rien'>
  /** Chapitres commencés mais pas encore solides. */
  fragiles: number
  /** Chapitres commencés et maîtrisés. */
  solides: number
  /** Items de la file « À revoir » rattachés à cette matière. */
  cartes: number
  /** Pourquoi elle, en une ligne — des faits, jamais un jugement. */
  raison: string
  /**
   * `urgence` = il y a du retard à rattraper ; `entretien` = tout est solide,
   * on maintient. Le ton change la couleur et le verbe du bouton : féliciter un
   * élève à jour avec la même carte rouge qu'un élève en retard rendrait
   * l'alerte inaudible le jour où elle compte.
   */
  ton: 'urgence' | 'entretien'
}

/**
 * Clé de rapprochement entre une matière du catalogue et la file « À revoir ».
 *
 * `review_items.subject` est une colonne DÉNORMALISÉE (021) : selon le chemin
 * qui l'a écrite, elle porte le slug (« maths ») ou le nom d'affichage
 * (« Mathématiques »), avec ou sans accents. Comparer les deux formes normalisées
 * évite d'afficher « 0 carte » à un élève qui en a douze — sans imposer une
 * reprise de données à toute la table.
 */
export function normaliseCle(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/** Cartes dues d'une matière, quel que soit le libellé stocké dans la file. */
export function cartesPourMatiere(
  matiere: Pick<CouvertureMatiere, 'slug' | 'name'>,
  cartesParMatiere: ReadonlyMap<string, number>,
): number {
  const cles = new Set([normaliseCle(matiere.slug), normaliseCle(matiere.name)])
  let total = 0
  for (const [libelle, n] of cartesParMatiere) {
    if (cles.has(normaliseCle(libelle))) total += n
  }
  return total
}

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`

function raisonFor(
  fragiles: number,
  solides: number,
  cartes: number,
  ton: MatiereDuMoment['ton'],
): string {
  const morceaux: string[] = []
  if (fragiles > 0) morceaux.push(`${pluriel(fragiles, 'chapitre')} à consolider`)
  if (cartes > 0) morceaux.push(`${pluriel(cartes, 'carte')} à revoir`)
  if (morceaux.length > 0) return morceaux.join(' · ')
  // Rien à rattraper : on ne fabrique pas une alerte pour remplir la ligne.
  return ton === 'entretien' && solides > 0
    ? `${pluriel(solides, 'chapitre')} solide${solides > 1 ? 's' : ''} — garde-les au chaud`
    : 'À reprendre en premier'
}

export function matiereDuMoment(
  couverture: readonly CouvertureMatiere[],
  cartesParMatiere: ReadonlyMap<string, number> = new Map(),
): MatiereDuMoment | null {
  const candidates = couverture.filter(
    (m) => m.commences > 0 && m.priorite !== 'rien',
  )
  if (candidates.length === 0) return null

  const avecCartes = candidates.map((m) => ({
    matiere: m,
    cartes: cartesPourMatiere(m, cartesParMatiere),
  }))

  avecCartes.sort(
    (a, b) =>
      RANG_PRIORITE[a.matiere.priorite] - RANG_PRIORITE[b.matiere.priorite] ||
      a.matiere.pct - b.matiere.pct ||
      b.cartes - a.cartes ||
      a.matiere.name.localeCompare(b.matiere.name, 'fr'),
  )

  const { matiere, cartes } = avecCartes[0]
  const priorite = matiere.priorite as Exclude<Priorite, 'rien'>
  const ton = priorite === 'ok' ? 'entretien' : 'urgence'

  return {
    slug: matiere.slug,
    name: matiere.name,
    pct: matiere.pct,
    priorite,
    fragiles: matiere.enRoute,
    solides: matiere.solides,
    cartes,
    raison: raisonFor(matiere.enRoute, matiere.solides, cartes, ton),
    ton,
  }
}
