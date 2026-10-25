// LA CINÉMATIQUE D'OUVERTURE (25/10/2026, Lucas : « ajouter une cinématique au
// début de l'onboarding au minimum, pour romancer l'histoire ou l'univers de
// Studuel ; fais le nécessaire pour avoir notre première cinématique avec
// Marcel »). Cinq tableaux peints, Marcel en voix off ÉCRITE : le texte
// s'écrit mot à mot sur l'image. Tout ce qui se décide vit ici, en données
// pures ; le composant (`components/welcome/Cinematique.tsx`) ne fait que
// jouer la partition.

/** Le mouvement lent de caméra d'un tableau (Ken Burns), un par tableau pour
 *  que l'œil ne s'habitue pas : avance = on s'approche, plonge = on s'approche
 *  en descendant vers le sujet, droite / gauche = panoramique, recule = on
 *  part du sujet et on découvre la scène. Les images-clés sont dans la feuille
 *  de style, à valeurs littérales. */
export type MouvementTableau = 'avance' | 'plonge' | 'droite' | 'gauche' | 'recule'

export type TableauCinematique = {
  id: string
  /** L'image peinte (880 × 1100, 4:5), servie telle quelle. */
  image: string
  /** La description de l'image pour le lecteur d'écran. */
  alt: string
  /** Ce que Marcel dit — s'écrit mot à mot. */
  texte: string
  mouvement: MouvementTableau
}

export const CINEMATIQUE: readonly TableauCinematique[] = [
  {
    id: 'academie',
    image: '/images/cinematique/01.webp',
    alt: 'L’académie au petit matin, un château violet et crème dans la brume dorée.',
    texte: 'Il y a une académie où réviser n’a jamais été une corvée.',
    mouvement: 'avance',
  },
  {
    id: 'marcel',
    image: '/images/cinematique/02.webp',
    alt: 'Marcel à son bureau, la nuit, sous sa lampe, entouré de livres.',
    texte: 'Moi, c’est Marcel. J’y suis coach depuis… longtemps.',
    mouvement: 'plonge',
  },
  {
    id: 'duel',
    image: '/images/cinematique/03.webp',
    alt: 'Deux élèves en duel autour de la fontaine de la cour d’honneur, un trophée doré au-dessus, les camarades aux balcons.',
    texte: 'Ici, on s’affronte pour de l’XP, on monte de ligue, on collectionne des trophées.',
    mouvement: 'droite',
  },
  {
    id: 'gardiens',
    image: '/images/cinematique/04.webp',
    alt: 'Les gardiens des matières dans l’ombre d’un cloître : un golem au compas, un minotaure à la plume, un hibou mécanique.',
    texte: 'Et chaque matière a son gardien. Ils ne sortent que si tu travailles.',
    mouvement: 'gauche',
  },
  {
    id: 'grilles',
    image: '/images/cinematique/05.webp',
    alt: 'Marcel devant les grilles ouvertes de l’académie, la main tendue, au soleil couchant.',
    // L'écran qui suit la cinématique est « Ta classe » (FAST_PATH) : la
    // phrase annonce ce geste-là, pas un autre.
    texte: 'Alors, tu entres ? Dis-moi ta classe, je m’occupe du reste.',
    mouvement: 'recule',
  },
]

/** Un mot toutes les 70 ms : le rythme d'une voix posée, lisible sans attendre. */
export const MS_PAR_MOT = 70
/** L'apparition d'un mot (montée + fondu), pour savoir quand la phrase est finie. */
export const MS_APPARITION_MOT = 260
/** Sans geste de l'élève, le tableau suivant vient tout seul. */
export const MS_AUTO_AVANCE = 5500
/** Le fondu croisé entre deux tableaux. */
export const MS_FONDU = 600
/** La durée du mouvement de caméra — un peu plus long que l'avance
 *  automatique, pour qu'il ne s'arrête jamais à l'écran. */
export const MS_MOUVEMENT = 6000

/** Les mots d'une phrase, dans l'ordre, sans blanc. */
export function mots(texte: string): string[] {
  return texte.split(/\s+/).filter((m) => m.length > 0)
}

/** Le temps que met une phrase à finir de s'écrire. */
export function dureeEcriture(texte: string): number {
  const n = mots(texte).length
  if (n === 0) return 0
  return (n - 1) * MS_PAR_MOT + MS_APPARITION_MOT
}

/** L'index (0-based) du tableau demandé par `?tableau=3` (1-based, page de
 *  développement) — 0 pour tout ce qui n'est pas un numéro de tableau. */
export function indexDepuisParametre(valeur: unknown): number {
  if (typeof valeur !== 'string' || !/^\d+$/.test(valeur)) return 0
  const n = Number(valeur)
  if (n < 1 || n > CINEMATIQUE.length) return 0
  return n - 1
}
