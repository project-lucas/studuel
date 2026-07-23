// Anatomie express — la banque du salon SVT, en DÉSIGNATION SUR SCHÉMA.
//
// Quatrième forme d'interaction du catalogue, après le QCM, la remise en ordre
// et le calcul construit : ici on touche un ENDROIT. On demande « où se trouve
// le foie ? » et l'élève pointe la zone sur une silhouette. Aucune proposition
// à lire, donc aucune possibilité d'éliminer les mauvaises réponses — c'est ce
// qui rend ce jeu franchement différent d'un QCM déguisé.
//
// Les zones sont des disques sur une toile de 100 × 220 (le viewBox du schéma).
// Les garder en coordonnées pures, hors du composant, permet de vérifier par un
// test qu'elles ne se chevauchent pas : deux zones superposées rendraient une
// bonne réponse refusée selon le pixel touché, sans que rien ne le signale.
import { seededRng } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'

/** Un disque cliquable sur le schéma, en unités du viewBox. */
export type OrganZone = { cx: number; cy: number; r: number }

export type Organ = {
  id: string
  /** Le nom demandé (« le foie »), prêt à entrer dans la consigne. */
  name: string
  /** Ce que la bonne réponse apprend — affiché une fois la zone touchée. */
  hint: string
  zone: OrganZone
}

/** Dimensions du schéma. Toute zone doit tenir dedans. */
export const BOARD_WIDTH = 100
export const BOARD_HEIGHT = 220

// Huit organes du programme de collège, posés à leur place réelle sur une
// silhouette de face. Le côté est celui du SCHÉMA (donc inversé par rapport au
// corps de l'élève) — c'est la convention des planches d'anatomie.
export const ORGANS: Organ[] = [
  {
    id: 'cerveau',
    name: 'le cerveau',
    hint: 'Il pilote tout : mouvements, sens, mémoire.',
    zone: { cx: 50, cy: 20, r: 12 },
  },
  {
    id: 'poumons',
    name: 'les poumons',
    hint: 'Ils font passer l’oxygène de l’air vers le sang.',
    zone: { cx: 36, cy: 66, r: 11 },
  },
  {
    id: 'coeur',
    name: 'le cœur',
    hint: 'Une pompe : il envoie le sang dans tout le corps.',
    zone: { cx: 57, cy: 70, r: 9 },
  },
  {
    id: 'foie',
    name: 'le foie',
    hint: 'Le filtre du corps — il trie et stocke les nutriments.',
    zone: { cx: 36, cy: 94, r: 11 },
  },
  {
    id: 'estomac',
    name: 'l’estomac',
    hint: 'Il brasse les aliments et commence la digestion.',
    zone: { cx: 60, cy: 92, r: 9 },
  },
  {
    id: 'reins',
    name: 'les reins',
    hint: 'Ils filtrent le sang et fabriquent l’urine.',
    zone: { cx: 68, cy: 108, r: 8.5 },
  },
  {
    id: 'intestins',
    name: 'les intestins',
    hint: 'C’est là que les nutriments passent dans le sang.',
    zone: { cx: 48, cy: 126, r: 12 },
  },
  {
    id: 'vessie',
    name: 'la vessie',
    hint: 'Elle stocke l’urine avant son évacuation.',
    zone: { cx: 48, cy: 148, r: 9 },
  },
]

/** Une question : l'organe à trouver, parmi toutes les zones du schéma. */
export type OrganRound = {
  id: string
  /** L'organe attendu. */
  target: Organ
}

/** Le tap tombe-t-il dans la zone ? Distance au centre, en unités du viewBox. */
export function isInZone(zone: OrganZone, x: number, y: number): boolean {
  const dx = x - zone.cx
  const dy = y - zone.cy
  return dx * dx + dy * dy <= zone.r * zone.r
}

/**
 * L'organe touché à ces coordonnées, ou null si le tap tombe à côté de tout.
 * Les zones ne se chevauchant pas (vérifié par test), le premier trouvé est
 * le seul possible.
 */
export function organAt(x: number, y: number): Organ | null {
  return ORGANS.find((o) => isInZone(o.zone, x, y)) ?? null
}

/**
 * Le nom d'une zone pour qui ne voit pas le schéma — décrit sa POSITION, jamais
 * son contenu.
 *
 * Un jeu où l'on désigne un endroit est muet au clavier et au lecteur d'écran
 * si les zones n'ont pas de nom. Mais les nommer « le foie » reviendrait à
 * donner la réponse : il suffirait de tabuler jusqu'à l'organe demandé. On
 * décrit donc l'endroit (« à droite du milieu du tronc »), exactement ce qu'un
 * élève voyant lit sur la planche — ni plus, ni moins.
 *
 * Le numéro n'est pas décoratif : deux organes voisins tombent dans la même
 * description (l'estomac et les reins sont tous deux « à droite du milieu du
 * tronc »), et deux zones homonymes seraient impossibles à distinguer à
 * l'oreille.
 */
export function zoneLabel(zone: OrganZone, index: number): string {
  const side =
    zone.cx < 42 ? 'à gauche' : zone.cx > 58 ? 'à droite' : 'au centre'
  const level =
    zone.cy <= 36
      ? 'de la tête'
      : zone.cy <= 78
        ? 'du haut du tronc'
        : zone.cy <= 112
          ? 'du milieu du tronc'
          : 'du bas du tronc'
  return `Zone ${index + 1} sur ${ORGANS.length}, ${side} ${level}`
}

/** `count` organes à trouver, sans répétition tant que le stock le permet. */
export function buildAnatomiePool(seed: string, count: number): OrganRound[] {
  const picked = shuffleWith(seededRng(seed), ORGANS)
  return Array.from({ length: count }, (_, i) => ({
    id: `${picked[i % picked.length].id}#${i}`,
    target: picked[i % picked.length],
  }))
}
