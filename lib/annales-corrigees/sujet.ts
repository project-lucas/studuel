// -----------------------------------------------------------------------------
// LE SUJET HABILLÉ D'UNE ANNALE — ce qui se calcule sans réseau (25/10/2026).
//
// `public/annales/` est plafonné à 25 Mo (lib/public-poids.test.ts) : les 42
// premiers sujets y tiennent, des centaines non. Les sujets habillés par
// scripts/annales-sujets.mjs partent donc dans un bucket Cloudflare R2
// `studuel-annales` (variable `R2_BUCKET_ANNALES`, déposés par
// scripts/annales-deposer.mjs) et sont SERVIS par la route GET
// /api/annales/<id>/sujet — un document public de l'Éducation nationale : pas
// d'authentification, cache long. Tant que R2 n'est pas réglé, la route
// retombe sur le fichier local (annales-out/, hors git, puis public/annales/)
// ou renvoie vers public/annales/<id>.pdf. La lecture elle-même est dans
// sujet-server.ts ; ici, les noms et les adresses, purs et testés.
// -----------------------------------------------------------------------------

/** La variable d'environnement qui nomme le bucket R2 des sujets. */
export const VARIABLE_BUCKET_ANNALES = 'R2_BUCKET_ANNALES'

/** Un document public et immuable : un an de cache, partout. */
export const CACHE_SUJET = 'public, max-age=31536000, immutable'

/** Les identifiants d'annale : des mots en minuscules et des chiffres, tirets entre eux. */
const ID_ANNALE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function estIdAnnale(id: string): boolean {
  return id.length >= 3 && id.length <= 80 && ID_ANNALE.test(id)
}

/** Le nom de l'objet dans le bucket, et du fichier sur le disque. */
export function nomObjetSujet(id: string): string {
  return `${id}.pdf`
}

/** L'adresse de l'app qui sert le sujet (`?dl=1` pour l'enregistrer au lieu de le lire). */
export function hrefSujet(id: string, { telecharger = false } = {}): string {
  return `/api/annales/${id}/sujet${telecharger ? '?dl=1' : ''}`
}

/** Le chemin du sujet dans public/ — le repli de la route tant que R2 n'est pas réglé. */
export function cheminSujetPublic(id: string): string {
  return `/annales/${id}.pdf`
}

/** Le nom du fichier enregistré sur le téléphone. */
export function nomTelechargementSujet(id: string): string {
  return `${id}-studuel.pdf`
}
