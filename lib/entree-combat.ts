// L'ENTRÉE EN COMBAT AU FLASH BLANC (05/11/2026, docs/CADRAGE-DOPAMINE.md § 4).
//
// Le geste qu'aime Lucas (« comme Pokémon ») : entre le tap qui lance le
// combat et l'écran du combat, l'écran s'assombrit, une onde de choc part,
// des lignes de vitesse convergent, le BLANC monte et c'est sous le blanc
// qu'on change de page. Puis le blanc se dissout sur le combat.
//
// Ici : le calendrier, la géométrie des lignes (pures, testées) et le petit
// magasin qui permet à n'importe quel bouton de lancer l'entrée
// (`lancerEntreeCombat(href)`) ; la scène vit une fois pour toutes dans le
// layout (`components/combat/EntreeCombat`), pour survivre à la navigation.

/** Le calendrier, en ms depuis le tap. */
export const TEMPS_ENTREE = {
  /** L'écran s'éteint (voile prune). */
  voile: 150,
  /** L'onde de choc part du centre. */
  onde: 150,
  /** Les lignes de vitesse (et leur souffle). */
  vitesse: 400,
  /** Le blanc commence à monter ; la musique est coupée net. */
  blanc: 850,
  /** L'éclat du blanc (son). */
  eclat: 1000,
  /** Plein blanc : on navigue. */
  plein: 1100,
  /** Tenu après l'arrivée de la nouvelle page. */
  tenu: 200,
  /** Le blanc se dissout. */
  fondu: 400,
  /** Filet : la page n'est pas arrivée, on rend la main quand même. */
  secours: 4000,
} as const

/** Le chemin d'une adresse, sans requête ni ancre (pour reconnaître l'arrivée). */
export function cheminDe(href: string): string {
  const coupe = href.search(/[?#]/)
  const chemin = coupe === -1 ? href : href.slice(0, coupe)
  return chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin
}

export type LigneVitesse = { angle: number; rayonInterieur: number; demiLargeur: number }

/**
 * Les lignes de vitesse : `n` coins blancs qui pointent vers le centre, d'angle
 * et de longueur un peu irréguliers (une suite déterministe : le même dessin à
 * chaque fois, et au rendu serveur comme au client).
 */
export function lignesDeVitesse(n = 28): LigneVitesse[] {
  let graine = 7
  const hasard = () => {
    graine = (graine * 16807) % 2147483647
    return graine / 2147483647
  }
  return Array.from({ length: n }, (_, i) => ({
    angle: (360 / n) * i + (hasard() - 0.5) * (300 / n),
    rayonInterieur: 26 + hasard() * 24,
    demiLargeur: 0.9 + hasard() * 1.4,
  }))
}

/** Les points SVG d'une ligne (repère -100..100, la pointe vers le centre). */
export function pointsLigne(l: LigneVitesse, rayonExterieur = 160): string {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const p = (r: number, deg: number) => `${(r * Math.cos(rad(deg))).toFixed(2)},${(r * Math.sin(rad(deg))).toFixed(2)}`
  return [p(l.rayonInterieur, l.angle), p(rayonExterieur, l.angle - l.demiLargeur), p(rayonExterieur, l.angle + l.demiLargeur)].join(' ')
}

// ------------------------------------------------------------------ magasin

export type EntreeEnCours = { id: number; href: string }

let enCours: EntreeEnCours | null = null
let prochainId = 1
const abonnes = new Set<() => void>()

function prevenir(): void {
  for (const a of abonnes) a()
}

/**
 * Lance l'entrée en combat vers `href`. Rend `false` si une entrée est déjà en
 * cours (un double tap ne relance pas la scène).
 */
export function lancerEntreeCombat(href: string): boolean {
  if (enCours) return false
  enCours = { id: prochainId++, href }
  prevenir()
  return true
}

export function finirEntreeCombat(id: number): void {
  if (enCours?.id !== id) return
  enCours = null
  prevenir()
}

export function lireEntreeCombat(): EntreeEnCours | null {
  return enCours
}

export function lireEntreeCombatServeur(): EntreeEnCours | null {
  return null
}

export function subscribeEntreeCombat(abonne: () => void): () => void {
  abonnes.add(abonne)
  return () => {
    abonnes.delete(abonne)
  }
}
