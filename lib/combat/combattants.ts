// -----------------------------------------------------------------------------
// LES COMBATTANTS (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md § 3.
//
// Tout ce qu'un personnage doit fournir pour entrer dans l'arène : ses poses
// détourées (scripts/combat-sprites.mjs → public/images/combat/), le sens dans
// lequel chacune regarde, et son ATTAQUE FÉTICHE — un nom, un cri, un
// projectile et un impact.
//
// Deux familles, une seule forme :
//   · les quinze ÉLÈVES-HÉROS (lib/heros/eleves.ts) — six poses : de DOS quand
//     c'est moi (en bas à gauche), de FACE quand c'est l'adversaire ;
//   · les dix-sept PROFS-BOSS (lib/bosses.ts) — toujours de face, trois poses.
//
// Un personnage n'entre au catalogue que quand ses images EXISTENT (la règle
// d'or des quêtes, appliquée aux sprites : combattants.test.ts vérifie chaque
// fichier). Un héros sans combattant joue avec le héros de repli.
//
// Rien ici ne touche aux points : une attaque FÊTE un coup, elle ne le rend
// jamais plus fort.
// -----------------------------------------------------------------------------
import { isHerosKey, type HerosKey } from '@/lib/heros/eleves'

export type Sens = 'gauche' | 'droite'

export type PosesCombat = {
  /** Au repos, de trois-quarts face : l'adversaire. */
  face: string
  attaqueFace: string
  /** Assommé, assis, les étoiles autour de la tête — drôle, jamais violent. */
  ko: string
  /** De trois-quarts dos : moi. Absent pour un boss (jamais de mon côté). */
  dos?: string
  attaqueDos?: string
  /** Le coup reçu, de dos. Absent : la pose de repos qui recule et blanchit. */
  toucheDos?: string
}

export type CleDePose = keyof PosesCombat

export type EffetAttaque = {
  /** Ce qui vole de l'attaquant à sa cible (absent : l'attaquant fond sur elle). */
  projectile?: string
  /** Vers où pointe le projectile tel qu'il est dessiné. */
  projectileVers?: Sens
  /** L'éclat sur la cible. */
  impact: string
}

export type AttaqueFetiche = {
  nom: string
  /** Une ligne, affichée sur le coup critique et le super. */
  cri: string
  effet: EffetAttaque
}

export type Combattant = {
  id: string
  nom: string
  famille: 'heros' | 'boss'
  poses: PosesCombat
  /** Vers où regarde chaque pose telle qu'elle est DESSINÉE : l'arène retourne
   *  celles qui tournent le dos à l'adversaire. */
  regards: Partial<Record<CleDePose, Sens>>
  attaque: AttaqueFetiche
}

const DOSSIER = '/images/combat'
const VFX = `${DOSSIER}/vfx`

/** L'éclat commun du coup critique, posé par-dessus l'impact de l'attaque. */
export const ECLAT_CRITIQUE = `${VFX}/critique.webp`

/** Les quatre pièces d'un cœur. */
export const IMAGES_COEUR = {
  plein: `${DOSSIER}/coeurs/plein.webp`,
  vide: `${DOSSIER}/coeurs/vide.webp`,
  moitieGauche: `${DOSSIER}/coeurs/moitie-gauche.webp`,
  moitieDroite: `${DOSSIER}/coeurs/moitie-droite.webp`,
} as const

function posesDeHeros(cle: string): PosesCombat {
  const d = `${DOSSIER}/heros/${cle}`
  return {
    dos: `${d}/dos.webp`,
    attaqueDos: `${d}/attaque-dos.webp`,
    toucheDos: `${d}/touche-dos.webp`,
    face: `${d}/face.webp`,
    attaqueFace: `${d}/attaque-face.webp`,
    ko: `${d}/ko.webp`,
  }
}

function posesDeBoss(dossier: string): PosesCombat {
  const d = `${DOSSIER}/boss/${dossier}`
  return { face: `${d}/face.webp`, attaqueFace: `${d}/attaque.webp`, ko: `${d}/ko.webp` }
}

/** L'attaque fétiche d'un personnage (scripts/combat-sprites.mjs → vfx/attaques/).
 *  Le projectile est toujours DESSINÉ vers la droite ; l'arène le retourne. */
function fetiche(id: string, nom: string, cri: string, avecProjectile = true): AttaqueFetiche {
  const a = `${VFX}/attaques/${id}`
  return {
    nom,
    cri,
    effet: {
      ...(avecProjectile ? { projectile: `${a}-projectile.webp`, projectileVers: 'droite' as const } : {}),
      impact: `${a}-impact.webp`,
    },
  }
}

/** De dos, toutes les poses d'un élève regardent vers sa cible, en haut à droite. */
const DOS_A_DROITE = { dos: 'droite', attaqueDos: 'droite', toucheDos: 'droite' } as const

function heros(
  cle: HerosKey,
  nom: string,
  face: Partial<Record<'face' | 'attaqueFace' | 'ko', Sens>>,
  attaque: AttaqueFetiche,
): Combattant {
  return { id: cle, nom, famille: 'heros', poses: posesDeHeros(cle), regards: { ...DOS_A_DROITE, ...face }, attaque }
}

/** Un prof-boss : en face, à droite — seule son attaque regarde nettement d'un côté. */
function boss(id: string, nom: string, attaqueVers: Sens | null, attaque: AttaqueFetiche, dossier = id): Combattant {
  return {
    id,
    nom,
    famille: 'boss',
    poses: posesDeBoss(dossier),
    regards: attaqueVers ? { attaqueFace: attaqueVers } : {},
    attaque,
  }
}

// --- les élèves-héros ---------------------------------------------------------
// Les regards de face ne sont notés que quand la pose regarde nettement d'un
// côté (relevés sur les planches, assets-sources/heros/combat/<clé>/).

export const COMBATTANTS_HEROS: Partial<Record<HerosKey, Combattant>> = {
  'demi-elfe-mage': {
    id: 'demi-elfe-mage',
    nom: 'Le Mage de feu',
    famille: 'heros',
    poses: posesDeHeros('demi-elfe-mage'),
    regards: { dos: 'droite', attaqueDos: 'droite', toucheDos: 'droite', face: 'droite', attaqueFace: 'droite', ko: 'droite' },
    attaque: {
      nom: 'Boule de feu runique',
      cri: 'Brûle, ignorance !',
      effet: { projectile: `${VFX}/feu-projectile.webp`, projectileVers: 'droite', impact: `${VFX}/feu-impact.webp` },
    },
  },
  'elfe-rodeur': heros('elfe-rodeur', 'Le Rôdeur des neiges', { face: 'gauche', attaqueFace: 'droite' }, fetiche('elfe-rodeur', 'Flèche de givre', 'Pile dans le mille !')),
  'nain-forge': heros('nain-forge', 'Le Forgeron de runes', { face: 'droite', attaqueFace: 'droite' }, fetiche('nain-forge', 'Rune de forge', 'Frappe de l’enclume !')),
  'demi-elfe-orage': heros('demi-elfe-orage', 'L’Appel de l’orage', { attaqueFace: 'droite' }, fetiche('demi-elfe-orage', 'Éclair captif', 'Foudre, à moi !')),
  'elfe-ombre': heros('elfe-ombre', 'Le Guetteur de minuit', { attaqueFace: 'droite' }, fetiche('elfe-ombre', 'Lames de lune', 'Pas un bruit…')),
  'elfe-harpon': heros('elfe-harpon', 'Le Harponneur', { attaqueFace: 'droite' }, fetiche('elfe-harpon', 'Harpon des glaces', 'Rien ne m’échappe !')),
  'troll-pont': heros('troll-pont', 'Le Veilleur du pont', {}, fetiche('troll-pont', 'Rocher runique', 'Attention, ça tombe !')),
  'orc-classe': heros('orc-classe', 'Le Caïd du fond', { attaqueFace: 'droite' }, fetiche('orc-classe', 'Avion de papier', 'Envoyé du fond de la classe !')),
  'orc-chien': heros('orc-chien', 'Le Coureur des bois', { attaqueFace: 'gauche' }, fetiche('orc-chien', 'Sifflet du chien', 'Au pied… et attaque !')),
  'gobeline-mur': heros('gobeline-mur', 'L’Ombre des toits', { attaqueFace: 'gauche' }, fetiche('gobeline-mur', 'Grappin des toits', 'Accrochée !')),
  'naine-poney': heros('naine-poney', 'La Cavalière des crêtes', { attaqueFace: 'droite' }, fetiche('naine-poney', 'Fer porte-bonheur', 'La chance est dans mon camp !')),
  'elfe-cerf-volant': heros('elfe-cerf-volant', 'La Vigie des cimes', { attaqueFace: 'gauche' }, fetiche('elfe-cerf-volant', 'Bourrasque des cimes', 'Le vent est avec moi !')),
  'humaine-luth': heros('humaine-luth', 'La Barde de la cour', { attaqueFace: 'droite' }, fetiche('humaine-luth', 'Accord étincelant', 'Écoute bien ça !')),
  'gobeline-lectrice': heros('gobeline-lectrice', 'La Rêveuse du saule', { attaqueFace: 'gauche' }, fetiche('gobeline-lectrice', 'Tourbillon de pages', 'Chapitre suivant !')),
  'elfe-course': heros('elfe-course', 'La Fusée', { attaqueFace: 'gauche' }, fetiche('elfe-course', 'Sprint éclair', 'Trop lent !', false)),
}

/** Le héros qui joue quand le sien n'a pas encore ses poses de combat. */
export const HEROS_DE_REPLI: HerosKey = 'demi-elfe-mage'

/** Le combattant d'un élève-héros, ou celui de repli. */
export function combattantHeros(cle: HerosKey | null | undefined): Combattant {
  return (cle ? COMBATTANTS_HEROS[cle] : undefined) ?? (COMBATTANTS_HEROS[HEROS_DE_REPLI] as Combattant)
}

/** Le héros d'un élève : celui de son portrait (`profiles.avatar.portrait`)
 *  s'il en a choisi un et qu'il a ses poses de combat, sinon le repli. */
export function herosDuPortrait(portrait: unknown): HerosKey {
  return isHerosKey(portrait) && COMBATTANTS_HEROS[portrait] ? portrait : HEROS_DE_REPLI
}

/** Les héros jouables en combat (ceux dont les poses existent). */
export function herosJouables(): HerosKey[] {
  return Object.keys(COMBATTANTS_HEROS) as HerosKey[]
}

/**
 * Le héros de l'adversaire d'une course : un élève rejoué garde le sien (son
 * portrait) ; un robot, ou un élève sans héros, en reçoit un FIXE tiré de sa
 * graine (le même robot a toujours le même héros), autre que le mien quand
 * c'est possible — deux fois le même personnage dans la lice se lit mal.
 */
export function herosDuRival(portrait: unknown, graine: string, monHeros: HerosKey): HerosKey {
  if (isHerosKey(portrait) && COMBATTANTS_HEROS[portrait]) return portrait
  const choix = herosJouables().filter((h) => h !== monHeros)
  if (choix.length === 0) return monHeros
  let h = 0
  for (const ch of String(graine)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return choix[h % choix.length]
}

// --- les profs-boss -----------------------------------------------------------
// Le dossier des poses suit l'image, l'id suit lib/bosses.ts (le Proviseur
// garde l'id historique `nox`).

export const COMBATTANTS_BOSS: Record<string, Combattant> = {
  grammatork: {
    id: 'grammatork',
    nom: 'Grammatork',
    famille: 'boss',
    poses: posesDeBoss('grammatork'),
    regards: { face: 'gauche', attaqueFace: 'droite', ko: 'droite' },
    attaque: {
      nom: 'Dictée infernale',
      cri: 'Accorde-moi ça !',
      effet: { projectile: `${VFX}/lettres-projectile.webp`, projectileVers: 'gauche', impact: `${VFX}/encre-impact.webp` },
    },
  },
  delta: boss('delta', 'Mme Guerre', 'droite', fetiche('delta', 'Règle de glace', 'Au tableau !')),
  imperator: boss('imperator', 'Imperator', 'droite', fetiche('imperator', 'Bouclier de Rome', 'Veni, vidi, vici !')),
  chronos: boss('chronos', 'Atlas', 'gauche', fetiche('chronos', 'Maelström des cartes', 'Cap sur ta défaite !')),
  bigben: boss('bigben', 'Big Ben', 'droite', fetiche('bigben', 'Fanfare de la Garde', 'Garde à vous !')),
  eltoro: boss('eltoro', 'El Toro', 'droite', fetiche('eltoro', 'Charge du taureau', '¡ Olé !')),
  plasma: boss('plasma', 'Dr Plasma', 'droite', fetiche('plasma', 'Fiole explosive', 'Réaction en chaîne !')),
  mitochondrix: boss('mitochondrix', 'Sylvarok', 'droite', fetiche('mitochondrix', 'Liane dévoreuse', 'La nature reprend ses droits !')),
  bugzilla: boss('bugzilla', 'Glitch', 'droite', fetiche('bugzilla', 'Scarabée-bug', 'Erreur 404 : réponse introuvable !')),
  mecatron: boss('mecatron', 'Mécatron', 'droite', fetiche('mecatron', 'Engrenage d’or', 'Calcul… terminé !')),
  krach: boss('krach', 'Krach', 'droite', fetiche('krach', 'Pluie d’écus', 'Tout se paie !')),
  sphinx: boss('sphinx', 'Socratus', 'gauche', fetiche('sphinx', 'Orbe de la sagesse', 'Connais-toi toi-même !')),
  nova: boss('nova', 'Nova', 'gauche', fetiche('nova', 'Comète bleue', 'Lève les yeux vers les étoiles !')),
  'coach-turbo': boss('coach-turbo', 'Coach Turbo', 'droite', fetiche('coach-turbo', 'Médecine-ball de feu', 'Encore une série !')),
  'kaiser-fang': boss('kaiser-fang', 'Kaiser Fang', 'droite', fetiche('kaiser-fang', 'Esprit du loup', 'La meute ne pardonne pas !')),
  fiscus: boss('fiscus', 'Fiscus', 'droite', fetiche('fiscus', 'Avis d’imposition', 'Payez, et que ça saute !')),
  nox: boss('nox', 'Le Proviseur', 'droite', fetiche('proviseur', 'Souffle du dragon', 'Dans mon bureau !'), 'proviseur'),
}

/** Le combattant d'un gardien, ou `null` tant que ses poses n'existent pas. */
export function combattantBoss(id: string): Combattant | null {
  return COMBATTANTS_BOSS[id] ?? null
}

/** Toutes les images d'un combattant : ce qu'on précharge pendant l'attente. */
export function imagesDe(c: Combattant): string[] {
  const poses = Object.values(c.poses).filter((v): v is string => typeof v === 'string')
  const { projectile, impact } = c.attaque.effet
  return [...poses, ...(projectile ? [projectile] : []), impact]
}

/** Les images d'un combat entier (les deux camps, les cœurs, l'éclat critique), sans doublon. */
export function imagesDuCombat(a: Combattant, b: Combattant): string[] {
  return [...new Set([...imagesDe(a), ...imagesDe(b), ...Object.values(IMAGES_COEUR), ECLAT_CRITIQUE])]
}
