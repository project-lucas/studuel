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
import { DEFAULT_PALIER, type PalierLevel } from '@/lib/jeux/paliers'
import type { ZonePlanche } from '@/lib/jeux/anatomie-planche'
import {
  IMAGE_ORGANES,
  ORGANES_HAUTEUR,
  ORGANES_LARGEUR,
  ZONES_PEINTES,
} from '@/lib/jeux/organes-planche'
import { creerPlanche, tirerManches } from '@/lib/jeux/planche'

/**
 * Depuis le 14/10/2026 la planche est PEINTE (lib/jeux/organes-planche) : ces
 * trois exports gardent leur nom d'origine et désignent désormais elle.
 */
export const PLANCHE_LARGEUR = ORGANES_LARGEUR
export const PLANCHE_HAUTEUR = ORGANES_HAUTEUR
export const ZONES = ZONES_PEINTES
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

// ------------------------------------------------------------- la planche
// Le calcul du clic et le nom des zones vivent dans le moteur commun des
// planches (lib/jeux/planche, partagé depuis le 14/10/2026 avec la planche des
// muscles de Sport) ; ces exports gardent l'API d'origine de la planche
// d'anatomie — la table de jeu, elle, reçoit la planche entière.
export const PLANCHE_ORGANES = creerPlanche({
  largeur: PLANCHE_LARGEUR,
  hauteur: PLANCHE_HAUTEUR,
  corpsD: '',
  fonduDepuis: PLANCHE_HAUTEUR,
  image: IMAGE_ORGANES,
  zones: ZONES,
})

/** La zone touchée à ces coordonnées (unités du viewBox), ou null si le tap tombe à côté de tout. */
export const zoneAt = PLANCHE_ORGANES.zoneAt

/** Les lignes aplaties d'une zone — pour les tests, qui mesurent la planche. */
export const zoneLignes = PLANCHE_ORGANES.zoneLignes

/**
 * Le nom d'une zone pour qui ne voit pas la planche — décrit sa POSITION,
 * jamais son contenu (« à gauche du milieu du tronc »).
 */
export const zoneLabel = PLANCHE_ORGANES.zoneLabel

/**
 * `count` organes à trouver au palier `tier`, sans répétition tant que le
 * stock le permet.
 */
export function buildAnatomiePool(
  seed: string,
  count: number,
  tier: number = DEFAULT_PALIER,
): OrganRound[] {
  return tirerManches(ORGANS, seed, count, tier)
}
