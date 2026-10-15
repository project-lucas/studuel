// -----------------------------------------------------------------------------
// LA PLANCHE DES MUSCLES — l'écorché PEINT, de face et de dos (14/10/2026,
// Lucas : « peux-tu faire la version encore plus supérieure du mode de jeu
// Muscles express ? »).
//
// La première version dessinait neuf muscles en traits sur le corps de la
// planche d'anatomie : un schéma juste, mais pauvre. Celle-ci pose sous le
// doigt un VRAI écorché, peint par Nano Banana 2.1 dans la famille de l'app
// (cerne prune, chair corail, reflets), en deux vues — la face et le dos —, et
// seize groupes musculaires au lieu de neuf : le dos (trapèzes, grands
// dorsaux, triceps, fessiers, ischio-jambiers, mollets) entre enfin en jeu.
//
// Les ZONES ne sont pas retracées à la main : elles sont LUES dans la peinture
// (`scripts/ecorche-zones.mjs` → `muscles-ecorche-zones.ts`, généré) — une
// graine par muscle, un remplissage qui suit le corail jusqu'au cerne. Ce que
// l'œil voit est exactement ce que le doigt touche. Ici : ce que chaque zone
// EST (son nom, son repère au clavier, son halo).
//
// Chaque repère dit OÙ est la zone sans jamais dire CE qu'elle est (test
// « ne laisse jamais fuiter » de muscles.test.ts).
// -----------------------------------------------------------------------------
import type { ZonePlanche } from '@/lib/jeux/anatomie-planche'
import { ECORCHE } from '@/lib/jeux/muscles-ecorche-zones'

export type VueMuscles = 'face' | 'dos'

export const VUES_MUSCLES: readonly VueMuscles[] = ['face', 'dos']

/** L'image peinte de chaque vue (scripts/ecorche-muscles.mjs). */
export const IMAGE_ECORCHE: Record<VueMuscles, string> = {
  face: '/images/jeux/muscles/face.webp',
  dos: '/images/jeux/muscles/dos.webp',
}

type Fiche = { nom: string; repere: string; halo?: number }

/**
 * Ce que chaque zone est, par vue. Le halo (en unités du viewBox, 100 × 180)
 * rend touchable à côté d'un muscle FIN — le jambier, le couturier, les
 * adducteurs : un doigt qui tombe sur le cerne compte quand même.
 */
const FICHES: Record<VueMuscles, Record<string, Fiche>> = {
  face: {
    cou: { nom: 'les muscles du cou', repere: 'sous la tête', halo: 1 },
    deltoides: { nom: 'les deltoïdes', repere: 'sur le rond de l’épaule' },
    pectoraux: { nom: 'les pectoraux', repere: 'sur la poitrine' },
    biceps: { nom: 'les biceps', repere: 'entre l’épaule et le coude' },
    'avant-bras': { nom: 'les avant-bras', repere: 'entre le coude et le poignet', halo: 1 },
    obliques: { nom: 'les obliques', repere: 'sur les flancs' },
    abdominaux: { nom: 'les abdominaux', repere: 'au centre du ventre' },
    quadriceps: { nom: 'les quadriceps', repere: 'sur le devant des cuisses' },
    couturier: { nom: 'le couturier', repere: 'en diagonale sur la cuisse', halo: 1.2 },
    adducteurs: { nom: 'les adducteurs', repere: 'à l’intérieur des cuisses', halo: 1.2 },
    tibial: { nom: 'le tibial antérieur', repere: 'sur le devant des jambes', halo: 1.2 },
    mollets: { nom: 'les mollets', repere: 'à l’intérieur des jambes', halo: 1 },
  },
  dos: {
    trapezes: { nom: 'les trapèzes', repere: 'entre la nuque et le milieu du dos' },
    deltoides: { nom: 'les deltoïdes', repere: 'sur l’arrière de l’épaule' },
    omoplate: { nom: 'les muscles de l’omoplate', repere: 'en haut du dos, sous l’épaule', halo: 0.8 },
    triceps: { nom: 'les triceps', repere: 'à l’arrière du bras' },
    'avant-bras': { nom: 'les avant-bras', repere: 'entre le coude et le poignet', halo: 1 },
    dorsaux: { nom: 'les grands dorsaux', repere: 'sur les côtés du bas du dos' },
    fessiers: { nom: 'les fessiers', repere: 'au bas du dos, au-dessus des cuisses' },
    ischios: { nom: 'les ischio-jambiers', repere: 'à l’arrière des cuisses' },
    mollets: { nom: 'les mollets', repere: 'à l’arrière des jambes' },
  },
}

/** Les zones d'une vue, dans l'ORDRE DU DESSIN (celui du fichier généré). */
export function zonesDeLaVue(vue: VueMuscles): readonly ZonePlanche[] {
  return ECORCHE[vue].zones.map((z) => {
    const fiche = FICHES[vue][z.id]
    if (!fiche) throw new Error(`Zone sans fiche : ${vue}/${z.id}`)
    return {
      id: z.id,
      nom: fiche.nom,
      forme: { type: 'plein', d: z.d },
      halo: fiche.halo ?? 0,
      ancre: z.ancre,
      repere: fiche.repere,
    }
  })
}

export const ZONES_FACE = zonesDeLaVue('face')
export const ZONES_DOS = zonesDeLaVue('dos')

/** La taille du viewBox des deux vues (la même toile). */
export const ECORCHE_LARGEUR = ECORCHE.face.largeur
export const ECORCHE_HAUTEUR = ECORCHE.face.hauteur
