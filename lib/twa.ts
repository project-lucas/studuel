// L'APP ANDROID DU PLAY STORE (25/10/2026) — une Trusted Web Activity : la
// même app web, ouverte en plein écran par Chrome. Android ne retire la barre
// d'adresse que si le site déclare l'app comme sienne, dans
// `/.well-known/assetlinks.json` : le nom du paquet et l'empreinte SHA-256 du
// certificat qui signe l'app (Play Console › Intégrité de l'app).
//
// Les deux valeurs viennent des variables d'environnement Vercel, pour ne pas
// redéployer de code quand Google change ou ajoute une clé :
//   ANDROID_PACKAGE   app.studuel
//   ANDROID_SHA256    une ou plusieurs empreintes, séparées par des virgules
//                     (clé de signature de Google Play, clé d'importation)

export type AssetLink = {
  relation: string[]
  target: { namespace: 'android_app'; package_name: string; sha256_cert_fingerprints: string[] }
}

const EMPREINTE = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/

/** Les empreintes valides de la variable, normalisées en majuscules. */
export function empreintesDepuis(brut: string | undefined): string[] {
  return (brut ?? '')
    .split(',')
    .map((e) => e.trim().toUpperCase())
    .filter((e) => EMPREINTE.test(e))
}

/** Le contenu de assetlinks.json ; vide tant que l'app n'est pas configurée. */
export function assetLinks(paquet: string | undefined, empreintes: string[]): AssetLink[] {
  const nom = (paquet ?? '').trim()
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(nom) || empreintes.length === 0) return []
  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: { namespace: 'android_app', package_name: nom, sha256_cert_fingerprints: empreintes },
    },
  ]
}
