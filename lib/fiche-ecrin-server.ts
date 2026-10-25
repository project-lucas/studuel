import { existsSync } from 'node:fs'
import path from 'node:path'
import { ROULEAU_FERME, ROULEAU_OUVERT, type RouleauFiche } from '@/lib/fiche-ecrin'

// -----------------------------------------------------------------------------
// L'ILLUSTRATION DE LA FICHE ROULÉE, SI ELLE EXISTE (serveur seulement).
//
// Le rouleau au sceau est livré par le chantier d'assets, pas par celui-ci :
// un import statique de `public/images/fiche/rouleau.webp` casserait le build
// tant que le fichier manque. On regarde donc sur le disque, côté serveur, et
// la page passe le chemin (ou null) à l'écrin, qui se replie sur la fiche du
// Marché. Déposer les deux WebP dans `public/images/fiche/` suffit : rien à
// recompiler, rien à brancher.
//
// En production le résultat est retenu (le dossier `public/` ne change pas en
// cours de route) ; en développement on regarde à chaque fois, pour voir une
// image déposée sans relancer le serveur.
// -----------------------------------------------------------------------------

let memo: RouleauFiche | null = null

function existe(chemin: string): boolean {
  try {
    return existsSync(path.join(process.cwd(), 'public', chemin))
  } catch {
    return false
  }
}

export function rouleauFiche(): RouleauFiche {
  if (memo && process.env.NODE_ENV === 'production') return memo
  const r: RouleauFiche = {
    ferme: existe(ROULEAU_FERME) ? ROULEAU_FERME : null,
    ouvert: existe(ROULEAU_OUVERT) ? ROULEAU_OUVERT : null,
  }
  memo = r
  return r
}
