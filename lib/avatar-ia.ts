// -----------------------------------------------------------------------------
// L'AVATAR DESSINÉ PAR MARCEL (Lucas, 24/09/2026 : « avoir la possibilité de
// changer son avatar via Nano Banana, avec un prompt, est banger dans son
// expérience ») — la logique pure : ce qu'on accepte d'une demande d'élève, le
// prompt envoyé au modèle, et l'identifiant d'un avatar généré.
//
// L'app s'adresse à des élèves de 11 à 18 ans : la demande passe un filtre
// avant tout appel (et avant tout crédit dépensé), le prompt enferme la
// demande dans un cadre (portrait, style de l'app, rien de choquant), et le
// modèle applique en plus ses propres filtres de sécurité.
//
// Coûts et crédits : lib/coach/credits.ts. Serveur : lib/avatar-ia-server.ts,
// route app/api/avatar-ia. Base : migration 378.
// -----------------------------------------------------------------------------

export const DEMANDE_MIN = 3
export const DEMANDE_MAX = 200

/** Un avatar généré s'écrit `ia:<uuid>` dans `profiles.avatar.portrait`. */
const IA = /^ia:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/

export function estAvatarIa(portrait: unknown): portrait is string {
  return typeof portrait === 'string' && IA.test(portrait)
}

/** L'identifiant du job d'un portrait `ia:<uuid>`, ou null. */
export function idAvatarIa(portrait: unknown): string | null {
  if (typeof portrait !== 'string') return null
  const m = IA.exec(portrait)
  return m ? m[1] : null
}

/** L'URL publique d'un avatar généré (servie par app/api/avatar-ia/[id]). */
export function srcAvatarIa(id: string): string {
  return `/api/avatar-ia/${id}`
}

/** Espaces resserrés, caractères de contrôle retirés, longueur bornée. */
export function nettoyerDemande(texte: string): string {
  return texte
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, DEMANDE_MAX)
}

/** Minuscules, sans accents : la forme sur laquelle le filtre travaille. */
function aplatir(texte: string): string {
  return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Ce qu'on ne dessine pas pour un élève. Des MOTS ENTIERS (un « nu » ne doit
// pas refuser « nuage »), en français et en anglais, sans accents.
const INTERDITS = [
  // corps et sexualité
  'nu', 'nue', 'nus', 'nues', 'nudite', 'naked', 'nude', 'sexy', 'sexe', 'sex', 'seins', 'bikini',
  'lingerie', 'porno', 'porn', 'erotique', 'hot',
  // violence
  'sang', 'blood', 'gore', 'cadavre', 'mort', 'morte', 'dead', 'tue', 'tuer', 'kill', 'meurtre',
  'suicide', 'torture', 'decapite', 'pistolet', 'fusil', 'flingue', 'gun', 'arme', 'armes',
  'bombe', 'terroriste', 'terrorist',
  // drogues, alcool, tabac
  'drogue', 'drug', 'cocaine', 'weed', 'cannabis', 'joint', 'alcool', 'biere', 'vodka', 'cigarette',
  'clope', 'vape',
  // haine
  'nazi', 'hitler', 'swastika', 'croix gammee', 'kkk',
]

export type RefusDemande = 'courte' | 'longue' | 'interdite'

/** Pourquoi une demande est refusée (avant tout crédit dépensé), ou null. */
export function refusDemande(texte: string): RefusDemande | null {
  const propre = nettoyerDemande(texte)
  if (propre.length < DEMANDE_MIN) return 'courte'
  if (texte.trim().length > DEMANDE_MAX) return 'longue'
  const mots = ` ${aplatir(propre).replace(/[^a-z0-9]+/g, ' ')} `
  if (INTERDITS.some((mot) => mots.includes(` ${mot} `))) return 'interdite'
  return null
}

/** Ce qu'on dit à l'élève quand sa demande est refusée — sans le gronder. */
export function messageRefus(refus: RefusDemande): string {
  if (refus === 'courte') return 'Dis-en un peu plus à Marcel : quel personnage veux-tu ?'
  if (refus === 'longue') return `Fais plus court : ${DEMANDE_MAX} caractères au plus.`
  return 'Marcel ne dessine pas ça. Essaie un autre personnage !'
}

/**
 * Le prompt envoyé au modèle : la demande de l'élève, CITÉE, dans un cadre qui
 * ne bouge pas — un portrait dans le style des blasons de l'app (l'image de
 * référence jointe), fond uni, sans texte, adapté à des collégiens.
 */
export function promptAvatar(demande: string): string {
  const propre = nettoyerDemande(demande).replace(/[«»"]/g, "'")
  return [
    'Create ONE square avatar portrait for a friendly educational game played by students aged 11 to 18.',
    'Match the art style of the reference image exactly: painted cartoon illustration, bold clean outlines, soft cel shading, warm saturated colours.',
    'Framing: head and shoulders, centred, facing the viewer, friendly and confident expression, the face filling the middle of the image.',
    'Background: plain soft lavender, no scenery. No text, no letters, no numbers, no logo, no watermark, no frame, no border.',
    'Keep it wholesome and age-appropriate: no blood, no violence, no weapon pointed at anyone, no revealing clothing, no real person or celebrity likeness.',
    `The character the student asked for (written in French): «${propre}».`,
  ].join('\n')
}

/** Des idées à toucher, pour qui ne sait pas quoi demander. */
export const IDEES_AVATAR = [
  'un astronaute avec un casque doré',
  'une chevalière en armure violette',
  'un renard ninja',
  'une pilote de course',
  'un magicien avec des lunettes rondes',
  'une exploratrice de la jungle',
] as const
