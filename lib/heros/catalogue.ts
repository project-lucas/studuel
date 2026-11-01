// LES HÉROS DE L'ACADÉMIE (29/10/2026, Lucas : « des personnages identifiables
// […] chaque classe de héros, après une bonne réponse, une attaque fétiche
// pour enlever de la vie à l'autre, puis la cinématique de victoire, avec la
// possibilité d'en acheter d'autres »). L'élève INCARNE un héros ; dix classes
// à terme (cinq garçons, cinq filles), un seul âge, l'équipement qui évolue.
//
// Le Templier est le MODÈLE : tout ce qu'une classe doit fournir pour entrer
// dans le duel est ici, en données pures. Les images sortent de Google Flow,
// détourées par `scripts/heros-detourer.mjs` (sources hors git dans
// `assets-sources/heros/<id>/`).
//
// La règle d'or du catalogue : une cinématique achetée FÊTE la victoire, elle
// ne la donne jamais. Rien ici ne touche aux points de la course.

/** Les cinq poses d'un héros en combat, toutes détourées (WebP à transparence). */
export type PosesHeros = {
  /** Au repos, de trois-quarts face : c'est ainsi qu'on voit l'ADVERSAIRE. */
  face: string
  /** Au repos, de trois-quarts dos : c'est ainsi qu'on se voit SOI. */
  dos: string
  attaqueFace: string
  attaqueDos: string
  /** Assommé, assis par terre, les étoiles autour de la tête — drôle, jamais violent. */
  ko: string
}

/** Vers où regarde chaque pose telle qu'elle est dessinée. L'arène retourne
 *  celles qui tournent le dos à l'adversaire (29/10/2026, Lucas : « le perso
 *  du joueur n'est pas tourné vers le bon endroit ») : moi, je regarde à
 *  droite, l'adversaire à gauche. */
export type RegardsHeros = Record<keyof PosesHeros, 'gauche' | 'droite'>

/** L'attaque fétiche : jouée à chaque bonne réponse, en critique sur la dorée. */
export type AttaqueHeros = {
  nom: string
  /** Le cri, une ligne, affiché sur le coup critique. */
  cri: string
}

export type TableauVictoire = {
  image: string
  alt: string
}

export type CinematiqueVictoire = {
  id: string
  nom: string
  /** La devise qui s'inscrit sous « Victoire ! ». */
  devise: string
  /** 0 = offerte avec le héros. Sinon, son prix en gemmes. */
  prixGemmes: number
  tableaux: readonly TableauVictoire[]
}

export type Heros = {
  id: string
  nom: string
  /** Une phrase : la silhouette et la blague, ce qui fait qu'on le reconnaît. */
  devise: string
  poses: PosesHeros
  regards: RegardsHeros
  attaque: AttaqueHeros
  /** La première est celle par défaut — elle doit être offerte. */
  victoires: readonly CinematiqueVictoire[]
}

const DOSSIER = '/images/heros'

/** L'ARÈNE DE L'ACADÉMIE (29/10/2026, Lucas : « un autre endroit lié à
 *  l'académie mais tourné vers l'arène, pour appuyer le côté défi », « pas de
 *  fond violet ») : la lice de l'académie, gradins et bannières, peinte dans
 *  la DA de la cour d'honneur. Elle couvre tout l'écran du duel des héros. */
export const ARENE_HEROS = `${DOSSIER}/arene/academie-arene.webp`

export const TEMPLIER: Heros = {
  id: 'templier',
  nom: 'Le Templier',
  devise: 'Il révise en armure complète. Il transpire, mais il ne recule jamais.',
  poses: {
    face: `${DOSSIER}/templier/face.webp`,
    dos: `${DOSSIER}/templier/dos.webp`,
    attaqueFace: `${DOSSIER}/templier/attaque-face.webp`,
    attaqueDos: `${DOSSIER}/templier/attaque-dos.webp`,
    // v2 (29/10) : le bouclier sortait du cadre de la planche, coupé net.
    ko: `${DOSSIER}/templier/ko-v2.webp`,
  },
  regards: { face: 'droite', dos: 'gauche', attaqueFace: 'droite', attaqueDos: 'droite', ko: 'droite' },
  attaque: { nom: 'Charge du bouclier', cri: 'Pour la connaissance !' },
  victoires: [
    {
      id: 'serment',
      nom: 'Le Serment',
      devise: 'Par le savoir, la victoire.',
      prixGemmes: 0,
      tableaux: [
        {
          image: `${DOSSIER}/templier/victoire-serment-1.webp`,
          alt: 'Le Templier plante son épée entre les pavés de la cour et s’agenouille dans un rayon de lumière dorée.',
        },
        {
          image: `${DOSSIER}/templier/victoire-serment-2.webp`,
          alt: 'Le Templier se relève, soulagé et fier, le bouclier levé, la croix rouge qui brille.',
        },
        {
          image: `${DOSSIER}/templier/victoire-serment-3.webp`,
          alt: 'Le Templier debout sur la margelle de la fontaine, l’épée levée vers le ciel, la bannière au vent.',
        },
      ],
    },
    {
      id: 'charge-celeste',
      nom: 'La Charge céleste',
      devise: 'En avant, pour la connaissance !',
      prixGemmes: 120,
      tableaux: [
        {
          image: `${DOSSIER}/templier/victoire-charge-1.webp`,
          alt: 'Le Templier sur un destrier blanc qui se cabre au milieu de la cour de l’académie.',
        },
        {
          image: `${DOSSIER}/templier/victoire-charge-2.webp`,
          alt: 'Le Templier et son destrier cabré devant un immense coucher de soleil doré, au-dessus des tours de l’académie.',
        },
      ],
    },
  ],
}

export const HEROS: readonly Heros[] = [TEMPLIER]

export function herosParId(id: string): Heros | null {
  return HEROS.find((h) => h.id === id) ?? null
}
