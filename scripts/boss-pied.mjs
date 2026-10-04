/**
 * Fabrique LES PORTRAITS EN PIED DES BOSS (04/10/2026) — l'illustration
 * verticale 9:16, le boss de la tête aux pieds dans son décor, qu'on voit dès
 * qu'il sort de sa tanière (BossApparition), à l'accueil de son combat et à la
 * fin (BossMode, `BossPortrait`) :
 *
 *   assets-sources/buste scene boss 2/hf_….png  (portraits de Lucas, 768×1376)
 *   assets-sources/boss-pied/<base>.png          (les deux qui manquaient : fiscus, mecatron)
 *     → public/images/boss/<base>-pied.webp      (720×1290)
 *
 *   node scripts/boss-pied.mjs
 *
 * Puis déclarer la base dans `PORTRAITS_PIED` (lib/bosses.ts) ; lib/assets.test.ts
 * vérifie que chaque fichier existe. Le Marcel qui félicite la série est fait
 * ici aussi (fond crème détouré) : public/images/mascotte/marcel-bravo.webp.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const LUCAS = 'assets-sources/buste scene boss 2'
// Nom de fichier de Lucas (son début) → base servie (celle des bustes et scènes).
const DE_LUCAS = {
  'hf_20260721_201526_3387549b': 'delta',
  'hf_20260721_202316_4f3fa51a': 'grammatork',
  'hf_20260721_202440_968dc7ec': 'imperator',
  'hf_20260721_202800_085b3e53': 'atlas',
  'hf_20260721_203114_5abe21aa': 'bigben',
  'hf_20260721_203221_a8e165db': 'eltoro',
  'hf_20260721_203327_cdda276a': 'plasma',
  'hf_20260721_203556_77b553ce': 'sylvarok',
  'hf_20260721_204548_652e9a1a': 'glitch',
  'hf_20260721_204812_d56002f1': 'krach',
  'hf_20260721_205012_a57fd702': 'socratus',
  'hf_20260721_205331_94acbfc2': 'astro',
  'hf_20260721_205533_4a0cb638': 'nox',
  'hf_20260721_213043_fb6367ed': 'coach-turbo',
  'hf_20260721_213253_324d32f5': 'kaiser-fang',
}

const sources = []
for (const f of fs.readdirSync(LUCAS)) {
  const cle = Object.keys(DE_LUCAS).find((k) => f.startsWith(k))
  if (cle) sources.push([path.join(LUCAS, f), DE_LUCAS[cle]])
}
for (const f of fs.readdirSync('assets-sources/boss-pied').filter((f) => f.endsWith('.png'))) {
  sources.push([path.join('assets-sources/boss-pied', f), f.replace(/\.png$/, '')])
}

for (const [src, base] of sources) {
  const info = await sharp(src)
    .resize(720, 1290, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toFile(`public/images/boss/${base}-pied.webp`)
  console.log(`${base.padEnd(12)} ${Math.round(info.size / 1024)} Ko`)
}

// --- Marcel qui félicite (célébration de série) ----------------------------
const marcel = await sharp(await detourerFondPeint('assets-sources/mascotte/marcel/bravo-a.png', { silencieux: true }))
  .trim({ threshold: 1 })
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile('public/images/mascotte/marcel-bravo.webp')
console.log(`marcel-bravo ${Math.round(marcel.size / 1024)} Ko`)
