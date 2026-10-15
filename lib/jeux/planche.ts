// -----------------------------------------------------------------------------
// LA PLANCHE À DÉSIGNER — le moteur commun des jeux où l'on répond en TOUCHANT
// un endroit sur un schéma : la planche d'anatomie (les organes, SVT) et,
// depuis le 14/10/2026, la planche des muscles (Sport — Lucas : « un mode
// proche de l'anatomie, notamment sur les muscles, sur le fait de reconnaître
// les muscles »).
//
// Le DESSIN de chaque planche vit dans son fichier (`anatomie-planche.ts`,
// `muscles-planche.ts`) ; ce qu'elles partagent est ici : la forme d'une cible,
// le calcul du clic (la zone la plus haute qui contient le point, sinon le
// halo le plus proche sur du vide), le nom d'une zone au clavier (sa
// position, jamais son contenu), le tirage des manches par palier. Pur, testé
// par chaque planche (anatomie.test.ts, muscles.test.ts).
// -----------------------------------------------------------------------------
import { seededRng } from '@/lib/defi-modes'
import { DEFAULT_PALIER, type PalierLevel } from '@/lib/jeux/paliers'
import { shuffleWith } from '@/lib/jeux/shuffle'
import type { ZonePlanche } from '@/lib/jeux/anatomie-planche'
import {
  aplatirChemin,
  distanceALaLigne,
  distanceAuPolygone,
  pointDansForme,
  type Polyligne,
} from '@/lib/jeux/svg-chemin'

export type { ZonePlanche }

/** Ce qu'on demande de trouver — un organe, un muscle. */
export type Cible = {
  id: string
  /** Le nom demandé (« le foie », « les biceps »), prêt à entrer dans la consigne. */
  name: string
  /** Ce que la bonne réponse apprend — affiché une fois la zone touchée. */
  hint: string
  /** Les zones de la planche qui valent bonne réponse (une, sauf exception). */
  zones: readonly string[]
  /** Premier palier où la cible est demandée… */
  from: PalierLevel
  /** …et dernier. */
  to: PalierLevel
  /**
   * La vue où on la cherche, pour une planche à plusieurs vues (l'écorché de
   * face et de dos). Absente : la planche n'a qu'une vue.
   */
  vue?: string
}

/** Une question : la cible à trouver, parmi toutes les zones de la planche. */
export type Manche = {
  id: string
  target: Cible
}

/** Cette zone vaut-elle bonne réponse pour cette cible ? */
export function isGoodPick(target: Cible, zone: ZonePlanche | null): boolean {
  return zone !== null && target.zones.includes(zone.id)
}

/** « Où se trouve » le foie, « Où se trouvent » les biceps : l'accord de la consigne. */
export function questionPour(target: Cible): string {
  return target.name.startsWith('les ') ? 'Où se trouvent' : 'Où se trouve'
}

/** Les cibles qu'on peut demander à ce palier. */
export function ciblesDuPalier<T extends Cible>(cibles: readonly T[], level: PalierLevel): T[] {
  return cibles.filter((c) => c.from <= level && level <= c.to)
}

/**
 * `count` cibles à trouver au palier `tier`, sans répétition tant que le stock
 * le permet.
 */
export function tirerManches<T extends Cible>(
  cibles: readonly T[],
  seed: string,
  count: number,
  tier: number = DEFAULT_PALIER,
): Manche[] {
  const level = (Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER) as PalierLevel
  const picked = shuffleWith(seededRng(seed), ciblesDuPalier(cibles, level))
  if (picked.length === 0) return []
  return Array.from({ length: count }, (_, i) => ({
    id: `${picked[i % picked.length].id}#${i}`,
    target: picked[i % picked.length],
  }))
}

// ------------------------------------------------------------- la planche

export type Planche = {
  largeur: number
  hauteur: number
  /**
   * Une planche PEINTE (l'écorché de Muscles express) : l'image se pose sous
   * les zones, qui restent invisibles jusqu'à la correction. Absente : le corps
   * et les zones sont dessinés en traits (la planche d'anatomie).
   */
  image?: string
  /** La vue de cette planche (« face », « dos »), quand il y en a plusieurs. */
  vue?: string
  /** Le contour du corps, prêt pour un attribut `d`. */
  corpsD: string
  /** Hauteur à partir de laquelle la planche s'estompe vers le bas. */
  fonduDepuis: number
  /** Les zones, dans l'ORDRE DU DESSIN (la dernière est dessinée au-dessus). */
  zones: readonly ZonePlanche[]
  /** La zone touchée à ces coordonnées (unités du viewBox), ou null. */
  zoneAt: (x: number, y: number) => ZonePlanche | null
  /** Les lignes aplaties d'une zone — pour les tests, qui mesurent la planche. */
  zoneLignes: (id: string) => Polyligne[]
  /** Le nom d'une zone pour qui ne voit pas la planche — sa POSITION, jamais son contenu. */
  zoneLabel: (zone: ZonePlanche, index: number) => string
}

/** Une zone aplatie, prête pour l'arithmétique. Calculé une fois. */
type ZoneAplatie = {
  zone: ZonePlanche
  lignes: Polyligne[]
  /** Distance du point au bord de la forme (0 dedans). */
  distance: (x: number, y: number) => number
  dedans: (x: number, y: number) => boolean
}

function aplatir(zone: ZonePlanche): ZoneAplatie {
  const lignes = aplatirChemin(zone.forme.d)
  if (zone.forme.type === 'tube') {
    const demi = zone.forme.largeur / 2
    const distanceAxe = (x: number, y: number) =>
      Math.min(...lignes.map((l) => distanceALaLigne(l, x, y)))
    return {
      zone,
      lignes,
      dedans: (x, y) => distanceAxe(x, y) <= demi,
      distance: (x, y) => Math.max(0, distanceAxe(x, y) - demi),
    }
  }
  return {
    zone,
    lignes,
    dedans: (x, y) => pointDansForme(lignes, x, y),
    distance: (x, y) =>
      pointDansForme(lignes, x, y)
        ? 0
        : Math.min(...lignes.map((l) => distanceAuPolygone(l, x, y))),
  }
}

/**
 * La position d'une zone en mots, depuis son ancre, quand la zone ne porte pas
 * son propre `repere`. Les seuils sont ceux de la planche d'anatomie (une tête,
 * un tronc en trois tiers) — la planche des muscles, elle, nomme chaque zone.
 */
function positionParDefaut(zone: ZonePlanche): string {
  const [cx, cy] = zone.ancre
  const side = cx < 44 ? 'à gauche' : cx > 56 ? 'à droite' : 'au centre'
  const level =
    cy <= 30
      ? 'de la tête'
      : cy <= 78.5
        ? 'du haut du tronc'
        : cy <= 112
          ? 'du milieu du tronc'
          : 'du bas du tronc'
  return `${side} ${level}`
}

/**
 * Fabrique une planche : ses zones aplaties une fois, et les trois fonctions
 * que la table de jeu et les tests lui demandent.
 */
export function creerPlanche(def: {
  largeur: number
  hauteur: number
  image?: string
  vue?: string
  corpsD: string
  fonduDepuis: number
  zones: readonly ZonePlanche[]
}): Planche {
  const aplaties: readonly ZoneAplatie[] = def.zones.map(aplatir)

  // Deux temps : d'abord la zone DESSINÉE la plus haute qui contient le point —
  // c'est ce que l'œil voit sous le doigt. Sinon, la zone la plus proche parmi
  // celles dont le halo atteint le point : un tube étroit reste touchable sans
  // être dessiné gros. Le halo ne mord jamais sur une zone dessinée.
  const zoneAt = (x: number, y: number): ZonePlanche | null => {
    for (let i = aplaties.length - 1; i >= 0; i--) {
      if (aplaties[i].dedans(x, y)) return aplaties[i].zone
    }
    let meilleure: ZonePlanche | null = null
    let meilleureDistance = Infinity
    for (const a of aplaties) {
      if (a.zone.halo <= 0) continue
      const d = a.distance(x, y)
      if (d <= a.zone.halo && d < meilleureDistance) {
        meilleureDistance = d
        meilleure = a.zone
      }
    }
    return meilleure
  }

  const zoneLignes = (id: string): Polyligne[] =>
    aplaties.find((a) => a.zone.id === id)?.lignes ?? []

  // Le numéro n'est pas décoratif : deux zones voisines tombent dans la même
  // description, et deux zones homonymes seraient impossibles à distinguer à
  // l'oreille.
  const zoneLabel = (zone: ZonePlanche, index: number): string =>
    `Zone ${index + 1} sur ${def.zones.length}, ${zone.repere ?? positionParDefaut(zone)}`

  return {
    largeur: def.largeur,
    hauteur: def.hauteur,
    image: def.image,
    vue: def.vue,
    corpsD: def.corpsD,
    fonduDepuis: def.fonduDepuis,
    zones: def.zones,
    zoneAt,
    zoneLignes,
    zoneLabel,
  }
}
