// LES ILLUSTRATIONS DE L'ONBOARDING (13/10/2026, Lucas : « un design qui montre
// que l'app promet de belles choses, des illustrations ou des fonds d'écran »).
//
//   node scripts/onboarding-illustrations.mjs
//
// Cinq images peintes par Nano Banana 2.1 dans le monde de l'académie (les
// références : la cour d'honneur du soir, Marcel, une icône de la barre) :
//   assets-sources/onboarding/hero-1.png  → public/images/onboarding/accueil.webp   (9:16, l'accueil)
//   assets-sources/onboarding/hero-2.png  → public/images/onboarding/bienvenue.webp (9:16, le dernier écran)
//   assets-sources/onboarding/tuto-1.png  → public/images/onboarding/tuto-cours.webp  (3:4)
//   assets-sources/onboarding/tuto-2.png  → public/images/onboarding/tuto-duel.webp   (3:4)
//   assets-sources/onboarding/tuto-3.png  → public/images/onboarding/tuto-marcel.webp (3:4)
// Les originaux (2 Mo chacun) restent hors dépôt ; servis en webp de 900 px
// de haut pour les fonds (≈ 150 Ko) et 720 px de large pour les diapos
// (≈ 80 Ko) — le budget de public/ (lib/public-poids.test.ts) est de 20 Mo.

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets-sources/onboarding'
const DEST = 'public/images/onboarding'

const LOT = [
  { source: 'hero-1.png', sortie: 'accueil.webp', largeur: 900, hauteur: 1600 },
  { source: 'hero-2.png', sortie: 'bienvenue.webp', largeur: 900, hauteur: 1600 },
  { source: 'tuto-1.png', sortie: 'tuto-cours.webp', largeur: 720, hauteur: 960 },
  { source: 'tuto-2.png', sortie: 'tuto-duel.webp', largeur: 720, hauteur: 960 },
  { source: 'tuto-3.png', sortie: 'tuto-marcel.webp', largeur: 720, hauteur: 960 },
]

await mkdir(DEST, { recursive: true })
for (const { source, sortie, largeur, hauteur } of LOT) {
  const info = await sharp(`${SRC}/${source}`)
    .resize(largeur, hauteur, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toFile(`${DEST}/${sortie}`)
  console.log(`${sortie.padEnd(18)} ${info.width}x${info.height} · ${Math.round(info.size / 1024)} Ko`)
}
