/**
 * Fabrique LES SIX DÉCORS HORAIRES DE LA COUR D'HONNEUR (/defi, 12/10/2026) :
 *   assets-sources/arene/cour/<plage>.png     (originaux Nano Banana 2.1, 1536×2752, LOCAL — hors dépôt)
 *     → public/images/arene/cour-<plage>.webp   (1080×1920, comme les décors du château)
 *
 *   node scripts/arene-cour.mjs
 *
 * Lucas a choisi la cour d'honneur de l'académie (planche
 * `assets-sources/maquettes/defi-cour/`, variante « frontale ») à la place de
 * l'île flottante : le même château, vu depuis sa cour — la fontaine au
 * centre, deux lanternes devant, le parvis vide pour la rangée de combat. Les
 * six lumières ont été peintes depuis cette variante en référence (« même
 * composition, seule la lumière change »), ce qui garde la fontaine, les
 * lanternes et les fenêtres à la MÊME PLACE d'une plage à l'autre : c'est ce
 * qui permet à `lib/arena-vivante.ts` d'animer les six avec les mêmes cotes.
 *
 * Même largeur et même qualité que `scripts/arene-fond.mjs`.
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC_DIR = 'assets-sources/arene/cour'
const DEST_DIR = 'public/images/arene'
const PLAGES = ['dawn', 'morning', 'noon', 'afternoon', 'evening', 'night']

const WIDTH = 1080
const HEIGHT = 1920
const QUALITY = 82

await mkdir(DEST_DIR, { recursive: true })

for (const plage of PLAGES) {
  const dest = `${DEST_DIR}/cour-${plage}.webp`
  const info = await sharp(`${SRC_DIR}/${plage}.png`)
    // Le rapport des originaux (9:16) est celui des décors : `cover` ne rogne
    // qu'une poignée de pixels.
    .resize({ width: WIDTH, height: HEIGHT, fit: 'cover' })
    .webp({ quality: QUALITY })
    .toFile(dest)
  console.log(`${plage}  →  ${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} Ko`)
}
