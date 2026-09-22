// Anatomie express — la banque du salon SVT, en DÉSIGNATION SUR PLANCHE.
//
// Quatrième forme d'interaction du catalogue, après le QCM, la remise en ordre
// et le calcul construit : ici on touche un ENDROIT. On demande « où se trouve
// le foie ? » et l'élève le touche sur une planche d'anatomie où les organes
// sont DESSINÉS, sans étiquette — le schéma à légender du cours de SVT. Aucun
// nom à lire, donc rien à éliminer ; reconnaître le foie parmi treize formes
// muettes, à sa forme et à sa place sous les côtes, c'est exactement la
// connaissance qu'on veut tester. Et le geste est précis : la cible a un
// contour qu'on voit, et c'est ce contour qui juge.
//
// Le dessin (formes, ordre, halos) vit dans `anatomie-planche.ts` ; la
// géométrie du clic dans `svg-chemin.ts`. Ici : les organes qu'on DEMANDE, par
// palier, et le tirage des manches.
import { seededRng } from '@/lib/defi-modes'
import { DEFAULT_PALIER, type PalierLevel } from '@/lib/jeux/paliers'
import { shuffleWith } from '@/lib/jeux/shuffle'
import {
  PLANCHE_HAUTEUR,
  PLANCHE_LARGEUR,
  ZONES,
  type ZonePlanche,
} from '@/lib/jeux/anatomie-planche'
import {
  aplatirChemin,
  distanceALaLigne,
  distanceAuPolygone,
  pointDansForme,
  type Polyligne,
} from '@/lib/jeux/svg-chemin'

export { PLANCHE_HAUTEUR, PLANCHE_LARGEUR, ZONES }
export type { ZonePlanche }

/** Ce qu'on demande de trouver. */
export type Organ = {
  id: string
  /** Le nom demandé (« le foie »), prêt à entrer dans la consigne. */
  name: string
  /** Ce que la bonne réponse apprend — affiché une fois la zone touchée. */
  hint: string
  /** Les zones de la planche qui valent bonne réponse (une, sauf exception). */
  zones: readonly string[]
  /** Premier palier où l'organe est demandé… */
  from: PalierLevel
  /** …et dernier : « les intestins » cèdent la place au grêle et au côlon. */
  to: PalierLevel
}

/**
 * Les organes demandés, du plus connu au plus fin. La planche montre toujours
 * tout ; c'est la QUESTION qui monte avec le palier :
 *
 * - Éveil et Apprenti : les huit organes que tout le monde nomme, et « les
 *   intestins » en un seul mot (grêle ou côlon, les deux valent) ;
 * - Confirmé : la trachée et le diaphragme entrent en jeu, et l'intestin se
 *   sépare en grêle et gros intestin ;
 * - Expert : le pancréas ; Maître : la rate.
 *
 * Un élève de 6e qui touche le pancréas en cherchant l'estomac apprend quand
 * même ce qu'il vient de toucher : la correction le lui dit.
 */
export const ORGANS: readonly Organ[] = [
  {
    id: 'cerveau',
    name: 'le cerveau',
    hint: 'Il pilote tout : mouvements, sens, mémoire.',
    zones: ['cerveau'],
    from: 1,
    to: 5,
  },
  {
    id: 'poumons',
    name: 'les poumons',
    hint: 'Ils font passer l’oxygène de l’air vers le sang.',
    zones: ['poumons'],
    from: 1,
    to: 5,
  },
  {
    id: 'coeur',
    name: 'le cœur',
    hint: 'Une pompe : il envoie le sang dans tout le corps.',
    zones: ['coeur'],
    from: 1,
    to: 5,
  },
  {
    id: 'foie',
    name: 'le foie',
    hint: 'Le filtre du corps — il trie et stocke les nutriments.',
    zones: ['foie'],
    from: 1,
    to: 5,
  },
  {
    id: 'estomac',
    name: 'l’estomac',
    hint: 'Il brasse les aliments et commence la digestion.',
    zones: ['estomac'],
    from: 1,
    to: 5,
  },
  {
    id: 'reins',
    name: 'les reins',
    hint: 'Ils filtrent le sang et fabriquent l’urine.',
    zones: ['reins'],
    from: 1,
    to: 5,
  },
  {
    id: 'intestins',
    name: 'les intestins',
    hint: 'C’est là que les nutriments passent dans le sang.',
    zones: ['intestin-grele', 'gros-intestin'],
    from: 1,
    to: 2,
  },
  {
    id: 'vessie',
    name: 'la vessie',
    hint: 'Elle stocke l’urine avant son évacuation.',
    zones: ['vessie'],
    from: 1,
    to: 5,
  },
  {
    id: 'trachee',
    name: 'la trachée',
    hint: 'Le tuyau qui mène l’air de la gorge aux poumons.',
    zones: ['trachee'],
    from: 3,
    to: 5,
  },
  {
    id: 'diaphragme',
    name: 'le diaphragme',
    hint: 'Le muscle qui s’abaisse pour gonfler les poumons.',
    zones: ['diaphragme'],
    from: 3,
    to: 5,
  },
  {
    id: 'intestin-grele',
    name: 'l’intestin grêle',
    hint: 'Six mètres repliés : c’est là que les nutriments passent dans le sang.',
    zones: ['intestin-grele'],
    from: 3,
    to: 5,
  },
  {
    id: 'gros-intestin',
    name: 'le gros intestin',
    hint: 'Il récupère l’eau de ce qui reste et forme les selles.',
    zones: ['gros-intestin'],
    from: 3,
    to: 5,
  },
  {
    id: 'pancreas',
    name: 'le pancréas',
    hint: 'Il fabrique des sucs digestifs et l’insuline, qui règle le sucre du sang.',
    zones: ['pancreas'],
    from: 4,
    to: 5,
  },
  {
    id: 'rate',
    name: 'la rate',
    hint: 'Elle recycle les vieux globules rouges et aide à se défendre.',
    zones: ['rate'],
    from: 5,
    to: 5,
  },
]

/** Les organes qu'on peut demander à ce palier. */
export function organsForPalier(level: PalierLevel): Organ[] {
  return ORGANS.filter((o) => o.from <= level && level <= o.to)
}

/** Une question : l'organe à trouver, parmi toutes les zones de la planche. */
export type OrganRound = {
  id: string
  /** L'organe attendu. */
  target: Organ
}

/** Cette zone vaut-elle bonne réponse pour cet organe ? */
export function isGoodPick(target: Organ, zone: ZonePlanche | null): boolean {
  return zone !== null && target.zones.includes(zone.id)
}

// ------------------------------------------------------------- le clic

/** Une zone aplatie, prête pour l'arithmétique. Calculé une fois. */
type ZoneAplatie = {
  zone: ZonePlanche
  lignes: Polyligne[]
  /** Distance du point au bord de la forme (0 dedans). */
  distance: (x: number, y: number) => number
  dedans: (x: number, y: number) => boolean
}

const APLATIES: readonly ZoneAplatie[] = ZONES.map((zone) => {
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
})

/**
 * La zone touchée à ces coordonnées (unités du viewBox), ou null si le tap
 * tombe à côté de tout.
 *
 * Deux temps : d'abord la zone DESSINÉE la plus haute qui contient le point —
 * c'est ce que l'œil voit sous le doigt. Sinon, la zone la plus proche parmi
 * celles dont le halo atteint le point : un tube étroit reste touchable sans
 * être dessiné gros. Le halo ne mord jamais sur un organe dessiné.
 */
export function zoneAt(x: number, y: number): ZonePlanche | null {
  for (let i = APLATIES.length - 1; i >= 0; i--) {
    if (APLATIES[i].dedans(x, y)) return APLATIES[i].zone
  }
  let meilleure: ZonePlanche | null = null
  let meilleureDistance = Infinity
  for (const a of APLATIES) {
    if (a.zone.halo <= 0) continue
    const d = a.distance(x, y)
    if (d <= a.zone.halo && d < meilleureDistance) {
      meilleureDistance = d
      meilleure = a.zone
    }
  }
  return meilleure
}

/** Les lignes aplaties d'une zone — pour les tests, qui mesurent la planche. */
export function zoneLignes(id: string): Polyligne[] {
  return APLATIES.find((a) => a.zone.id === id)?.lignes ?? []
}

/**
 * Le nom d'une zone pour qui ne voit pas la planche — décrit sa POSITION,
 * jamais son contenu.
 *
 * Un jeu où l'on désigne un endroit est muet au clavier et au lecteur d'écran
 * si les zones n'ont pas de nom. Mais les nommer « le foie » reviendrait à
 * donner la réponse : il suffirait de tabuler jusqu'à l'organe demandé. On
 * décrit donc l'endroit (« à gauche du milieu du tronc »), exactement ce qu'un
 * élève voyant lit sur la planche — ni plus, ni moins.
 *
 * Le numéro n'est pas décoratif : deux organes voisins tombent dans la même
 * description, et deux zones homonymes seraient impossibles à distinguer à
 * l'oreille.
 */
export function zoneLabel(zone: ZonePlanche, index: number): string {
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
  return `Zone ${index + 1} sur ${ZONES.length}, ${zone.repere ?? `${side} ${level}`}`
}

/**
 * `count` organes à trouver au palier `tier`, sans répétition tant que le
 * stock le permet.
 */
export function buildAnatomiePool(
  seed: string,
  count: number,
  tier: number = DEFAULT_PALIER,
): OrganRound[] {
  const level = (Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER) as PalierLevel
  const picked = shuffleWith(seededRng(seed), organsForPalier(level))
  return Array.from({ length: count }, (_, i) => ({
    id: `${picked[i % picked.length].id}#${i}`,
    target: picked[i % picked.length],
  }))
}
