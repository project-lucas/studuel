// LA PIÈCE JOINTE — ce que l'élève accroche à sa question.
//
// Le cours d'un élève n'est pas un fichier bien rangé : c'est une PHOTO dans son
// téléphone, prise de travers, de son cahier ou du tableau. C'est aussi, plus
// rarement, un texte collé. Le « + » du champ ouvre ces deux portes, et
// seulement celles-là : le PDF est refusé avec une consigne utile (« prends-le
// en photo ») plutôt qu'avalé puis illisible.
//
// LA TAILLE EST LE VRAI SUJET. Une photo de téléphone fait 3 à 8 Mo ; en base64
// elle en fait un tiers de plus, et elle voyage dans le corps d'une Server
// Action. On la RÉDUIT donc dans le navigateur (canvas, 1 400 px de côté, JPEG)
// avant l'envoi : 200 à 400 Ko, largement assez pour lire un cahier, et le
// serveur revérifie de son côté — ce qui arrive du client n'est jamais cru.
//
// Ce module mélange volontairement du pur (les règles d'acceptation, testées)
// et du navigateur (la réduction). Seule la première moitié est appelée côté
// serveur.

export type PieceJointe = {
  type: 'image' | 'texte'
  /** Nom du fichier, montré à l'élève — jamais envoyé au modèle. */
  nom: string
  /** Image : data URL. Texte : le contenu, déjà borné. */
  data: string
}

export const TYPES_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
export const TYPES_TEXTE = ['text/plain', 'text/markdown', 'text/csv']

/** Ce qu'on accepte de recevoir du disque (avant réduction). */
export const MAX_FICHIER_OCTETS = 12_000_000
/** Ce qu'on accepte d'ENVOYER (après réduction) — vérifié aussi côté serveur. */
export const MAX_ENVOI_OCTETS = 3_000_000
/** Un fichier texte plus long que ça ne tient pas dans une fenêtre de contexte. */
export const MAX_TEXTE_LEN = 12_000
/** Côté le plus long d'une photo réduite. Assez pour lire une page de cahier. */
export const LARGEUR_MAX = 1_400

export type Refus = { erreur: string }

/**
 * Le fichier est-il recevable ? Rend `null` si oui, un message d'élève sinon.
 *
 * Pur : il ne prend que ce qu'un `File` expose (nom, type, taille), pour être
 * testable et réutilisable côté serveur.
 */
export function refusFichier(f: {
  name: string
  type: string
  size: number
}): Refus | null {
  const type = (f.type || '').toLowerCase()
  const nom = (f.name || '').toLowerCase()

  if (type === 'application/pdf' || nom.endsWith('.pdf')) {
    return {
      erreur: 'Je ne lis pas les PDF. Prends la page en photo, ça marchera.',
    }
  }

  const image = TYPES_IMAGE.includes(type)
  const texte =
    TYPES_TEXTE.includes(type) || /\.(txt|md|csv)$/.test(nom)
  if (!image && !texte) {
    return { erreur: 'Je sais lire une photo ou un fichier texte, rien d’autre.' }
  }

  if (f.size > MAX_FICHIER_OCTETS) {
    return { erreur: 'Ce fichier est trop lourd. Prends une photo plus petite.' }
  }

  return null
}

/** Le poids réel d'une data URL base64, sans la décoder. */
export function poidsDataUrl(data: string): number {
  const virgule = data.indexOf(',')
  if (virgule === -1) return data.length
  const base64 = data.length - virgule - 1
  return Math.floor(base64 * 0.75)
}

/**
 * La pièce est-elle envoyable au modèle ? Même fonction des deux côtés : le
 * client refuse tôt, le serveur refuse pour de bon.
 */
export function refusPiece(piece: unknown): Refus | null {
  if (piece === null || typeof piece !== 'object') return { erreur: 'Pièce jointe illisible.' }
  const p = piece as Partial<PieceJointe>

  if (p.type === 'texte') {
    if (typeof p.data !== 'string' || p.data.trim().length === 0) {
      return { erreur: 'Ce fichier est vide.' }
    }
    return null
  }

  if (p.type === 'image') {
    if (typeof p.data !== 'string' || !p.data.startsWith('data:image/')) {
      return { erreur: 'Cette image n’a pas pu être lue.' }
    }
    if (poidsDataUrl(p.data) > MAX_ENVOI_OCTETS) {
      return { erreur: 'Cette image est trop lourde.' }
    }
    return null
  }

  return { erreur: 'Pièce jointe illisible.' }
}

/**
 * Réduit une image dans le navigateur et rend sa data URL.
 *
 * JPEG et non PNG : sur une photo de cahier, le PNG pèse cinq fois plus pour
 * un résultat identique à l'œil du modèle. Qualité 0,72 — au-delà, on paie des
 * octets que personne ne lit ; en dessous, l'écriture manuscrite bave.
 */
export async function reduireImage(file: File): Promise<string> {
  const bitmap = await creerBitmap(file)
  const echelle = Math.min(1, LARGEUR_MAX / Math.max(bitmap.width, bitmap.height))
  const largeur = Math.max(1, Math.round(bitmap.width * echelle))
  const hauteur = Math.max(1, Math.round(bitmap.height * echelle))

  const canvas = document.createElement('canvas')
  canvas.width = largeur
  canvas.height = hauteur
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas indisponible')
  // Fond blanc : un PNG transparent aplati sur du noir rendrait un cahier
  // illisible pour le modèle.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, largeur, hauteur)
  ctx.drawImage(bitmap, 0, 0, largeur, hauteur)

  if ('close' in bitmap) bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.72)
}

async function creerBitmap(file: File): Promise<ImageBitmap> {
  // `createImageBitmap` gère l'orientation EXIF : sans ça, une photo prise en
  // portrait arrive couchée, et le modèle lit un cahier de travers.
  return createImageBitmap(file, { imageOrientation: 'from-image' })
}

/** Lit un fichier texte, borné. */
export async function lireTexte(file: File): Promise<string> {
  const brut = await file.text()
  return brut.slice(0, MAX_TEXTE_LEN)
}
