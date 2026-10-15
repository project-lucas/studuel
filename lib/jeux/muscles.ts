// Muscles express — la banque du salon SPORT, en DÉSIGNATION SUR PLANCHE
// (14/10/2026, Lucas : « pour le sport il doit y avoir un mode proche de
// l'anatomie, notamment sur les muscles, sur le fait de reconnaître les
// muscles », puis « la version encore plus supérieure »).
//
// Le même geste qu'« Anatomie express » : on demande « où se trouvent les
// biceps ? » et l'élève les touche sur un ÉCORCHÉ PEINT, sans étiquette — de
// face ou de dos selon le muscle demandé. Reconnaître un muscle à sa forme et à
// sa place, c'est exactement ce que la culture sportive de Studuel enseigne
// (les fondamentaux : hypertrophie, force, anti-blessure) — et ce qu'un élève
// retrouve en salle, devant le miroir.
//
// Le dessin vit dans `muscles-planche.ts` (et l'image peinte), le moteur commun
// dans `planche.ts` ; ici : les muscles qu'on DEMANDE, par palier, et le tirage.
import { type PalierLevel } from '@/lib/jeux/paliers'
import {
  ECORCHE_HAUTEUR,
  ECORCHE_LARGEUR,
  IMAGE_ECORCHE,
  ZONES_DOS,
  ZONES_FACE,
  type VueMuscles,
} from '@/lib/jeux/muscles-planche'
import {
  ciblesDuPalier,
  creerPlanche,
  tirerManches,
  type Cible,
  type Manche,
  type Planche,
} from '@/lib/jeux/planche'

export type Muscle = Cible & { vue: VueMuscles }
export type MuscleRound = Manche

/**
 * Les muscles demandés, du plus connu au plus fin. La planche montre toujours
 * tout ; c'est la QUESTION qui monte avec le palier :
 *
 * - Éveil et Apprenti : les six que tout le monde nomme — biceps, pectoraux,
 *   abdominaux, quadriceps, deltoïdes, et les fessiers (de dos) ;
 * - Confirmé : le dos du bras et de la jambe — triceps, ischio-jambiers,
 *   mollets —, les avant-bras, les obliques ;
 * - Expert : les grands dorsaux, les trapèzes, les adducteurs ;
 * - Maître : le tibial antérieur et le couturier, le plus long muscle du corps.
 *
 * Chaque repère dit à quoi sert le muscle et ce qui le travaille : la
 * correction enseigne, comme sur la planche d'anatomie.
 */
export const MUSCLES: readonly Muscle[] = [
  {
    id: 'biceps',
    name: 'les biceps',
    hint: 'Devant le bras : ils plient le coude. Tractions et curls les travaillent.',
    zones: ['biceps'],
    vue: 'face',
    from: 1,
    to: 5,
  },
  {
    id: 'pectoraux',
    name: 'les pectoraux',
    hint: 'La poitrine : ils rapprochent les bras devant soi. Pompes et développé couché.',
    zones: ['pectoraux'],
    vue: 'face',
    from: 1,
    to: 5,
  },
  {
    id: 'abdominaux',
    name: 'les abdominaux',
    hint: 'Le centre du corps : ils plient le buste et tiennent le gainage.',
    zones: ['abdominaux'],
    vue: 'face',
    from: 1,
    to: 5,
  },
  {
    id: 'quadriceps',
    name: 'les quadriceps',
    hint: 'Devant la cuisse : quatre chefs qui tendent le genou. Squats, course, vélo.',
    zones: ['quadriceps'],
    vue: 'face',
    from: 1,
    to: 5,
  },
  {
    id: 'deltoides',
    name: 'les deltoïdes',
    hint: 'Le rond de l’épaule : ils lèvent le bras. Développé militaire, élévations.',
    zones: ['deltoides'],
    vue: 'face',
    from: 1,
    to: 5,
  },
  {
    id: 'fessiers',
    name: 'les fessiers',
    hint: 'Le grand fessier est le plus gros muscle du corps : il pousse la hanche pour courir, sauter, monter. Squats et fentes.',
    zones: ['fessiers'],
    vue: 'dos',
    from: 1,
    to: 5,
  },
  {
    id: 'triceps',
    name: 'les triceps',
    hint: 'Derrière le bras : ils tendent le coude. Ce sont eux qui poussent aux pompes et aux dips.',
    zones: ['triceps'],
    vue: 'dos',
    from: 3,
    to: 5,
  },
  {
    id: 'ischios',
    name: 'les ischio-jambiers',
    hint: 'Derrière la cuisse : ils plient le genou. Le sprinteur les claque s’il ne les étire pas.',
    zones: ['ischios'],
    vue: 'dos',
    from: 3,
    to: 5,
  },
  {
    id: 'mollets',
    name: 'les mollets',
    hint: 'Derrière la jambe : ils lèvent le talon. Chaque foulée, chaque saut part d’eux.',
    zones: ['mollets'],
    vue: 'dos',
    from: 3,
    to: 5,
  },
  {
    id: 'avant-bras',
    name: 'les avant-bras',
    hint: 'Entre le coude et la main : ils serrent le poing. La prise, en escalade comme au judo.',
    zones: ['avant-bras'],
    vue: 'face',
    from: 3,
    to: 5,
  },
  {
    id: 'obliques',
    name: 'les obliques',
    hint: 'Les flancs : ils font tourner et pencher le buste. Le gainage latéral.',
    zones: ['obliques'],
    vue: 'face',
    from: 3,
    to: 5,
  },
  {
    id: 'dorsaux',
    name: 'les grands dorsaux',
    hint: 'Les « ailes » du dos : ils tirent les bras vers le bas. Tractions, rameur, natation.',
    zones: ['dorsaux'],
    vue: 'dos',
    from: 4,
    to: 5,
  },
  {
    id: 'trapezes',
    name: 'les trapèzes',
    hint: 'De la nuque au milieu du dos : ils haussent et resserrent les épaules. Shrugs, rowing.',
    zones: ['trapezes'],
    vue: 'dos',
    from: 4,
    to: 5,
  },
  {
    id: 'adducteurs',
    name: 'les adducteurs',
    hint: 'L’intérieur de la cuisse : ils serrent les jambes. Fragiles chez le footballeur — à étirer.',
    zones: ['adducteurs'],
    vue: 'face',
    from: 4,
    to: 5,
  },
  {
    id: 'tibial',
    name: 'le tibial antérieur',
    hint: 'Devant le tibia : il relève la pointe du pied. La douleur du coureur débutant, c’est souvent lui.',
    zones: ['tibial'],
    vue: 'face',
    from: 5,
    to: 5,
  },
  {
    id: 'couturier',
    name: 'le couturier',
    hint: 'Le plus long muscle du corps, en diagonale sur la cuisse : c’est lui qui fait croiser les jambes en tailleur.',
    zones: ['couturier'],
    vue: 'face',
    from: 5,
    to: 5,
  },
]

/** Les muscles qu'on peut demander à ce palier. */
export function musclesForPalier(level: PalierLevel): Muscle[] {
  return ciblesDuPalier(MUSCLES, level)
}

function plancheDeLaVue(vue: VueMuscles): Planche {
  return creerPlanche({
    largeur: ECORCHE_LARGEUR,
    hauteur: ECORCHE_HAUTEUR,
    corpsD: '',
    fonduDepuis: ECORCHE_HAUTEUR,
    image: IMAGE_ECORCHE[vue],
    vue,
    zones: vue === 'face' ? ZONES_FACE : ZONES_DOS,
  })
}

/** Les deux vues de l'écorché, prêtes pour la table de jeu et les tests. */
export const PLANCHES_MUSCLES: Record<VueMuscles, Planche> = {
  face: plancheDeLaVue('face'),
  dos: plancheDeLaVue('dos'),
}

/** La vue de face — la planche par défaut (aperçus, compatibilité). */
export const PLANCHE_MUSCLES = PLANCHES_MUSCLES.face

/** `count` muscles à trouver au palier `tier`, sans répétition tant que le stock le permet. */
export function buildMusclesPool(seed: string, count: number, tier?: number): MuscleRound[] {
  return tirerManches(MUSCLES, `muscles:${seed}`, count, tier)
}
