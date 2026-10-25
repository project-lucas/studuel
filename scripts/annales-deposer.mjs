// DÉPOSER LES SUJETS D'ANNALES HABILLÉS SUR CLOUDFLARE R2 (25/10/2026).
//
//   node scripts/annales-deposer.mjs                → tous les sujets habillés
//   node scripts/annales-deposer.mjs <id> …         → seulement ceux-là
//     --manquants      saute ceux qui sont déjà sur R2, à la même taille
//
// Pour chaque sujet habillé par scripts/annales-sujets.mjs — dans
// `annales-out/<id>.pdf` (le rendu local, hors git) ou, pour les 42 premiers,
// dans `public/annales/<id>.pdf` — le PDF part dans le bucket R2
// `R2_BUCKET_ANNALES` sous `<id>.pdf`. La route /api/annales/<id>/sujet le
// sert ensuite (lib/annales-corrigees/sujet-server.ts). Un document public :
// le bucket peut rester privé, c'est la route qui sert.
//
// Les clés R2 (jeton « lecture et écriture » limité au bucket) sont lues dans
// `.env.local`, qui n'est pas suivi par git — comme pour les fiches
// (scripts/fiches-deposer.mjs, dont ce script reprend la partie R2).

import fs from 'node:fs'
import path from 'node:path'
import { AwsClient } from 'aws4fetch'

const RACINE = path.resolve(import.meta.dirname, '..')
/** Du plus frais au plus ancien : un rendu local l'emporte sur le fichier de public/. */
const DOSSIERS = [path.join(RACINE, 'annales-out'), path.join(RACINE, 'public', 'annales')]
const PARALLELE = 4

/** Une variable de `.env.local`, sans charger tout l'environnement de Next. */
function variableLocale(nom) {
  const fichier = path.join(RACINE, '.env.local')
  if (!fs.existsSync(fichier)) return undefined
  const ligne = fs
    .readFileSync(fichier, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${nom}=`))
  return ligne?.slice(nom.length + 1).trim().replace(/^["']|["']$/g, '')
}

const variable = (nom) => process.env[nom] ?? variableLocale(nom)

const args = process.argv.slice(2)
const options = new Set(args.filter((a) => a.startsWith('--')))
const demandes = args.filter((a) => !a.startsWith('--'))
const manquantsSeuls = options.has('--manquants')

// Miroir de lib/fiches/r2.ts (configR2, avec le bucket des annales).
const r2 = (() => {
  const compte = variable('R2_ACCOUNT_ID')
  const cleId = variable('R2_ACCESS_KEY_ID')
  const secret = variable('R2_SECRET_ACCESS_KEY')
  const bucket = variable('R2_BUCKET_ANNALES')
  if (!compte || !cleId || !secret || !bucket) return null
  return {
    bucket,
    base: `https://${compte}.r2.cloudflarestorage.com/${bucket}`,
    client: new AwsClient({ accessKeyId: cleId, secretAccessKey: secret, service: 's3', region: 'auto' }),
  }
})()
if (!r2) {
  console.error('Il faut R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY et R2_BUCKET_ANNALES dans .env.local (ou l’environnement).')
  process.exit(1)
}

/** Le fichier habillé d'un sujet, ou null s'il n'a pas été rendu. */
function fichierDe(id) {
  for (const d of DOSSIERS) {
    const f = path.join(d, `${id}.pdf`)
    if (fs.existsSync(f)) return f
  }
  return null
}

/** La taille d'un objet déjà sur R2, ou null s'il n'y est pas. */
async function tailleSurR2(nom) {
  const reponse = await r2.client.fetch(`${r2.base}/${encodeURIComponent(nom)}`, { method: 'HEAD' })
  if (reponse.status === 404) return null
  if (!reponse.ok) throw new Error(`R2 ${nom} : HEAD ${reponse.status}`)
  return Number(reponse.headers.get('content-length'))
}

/** Dépose un sujet ; rend false s'il y était déjà (avec --manquants). */
async function deposer(id) {
  const fichier = fichierDe(id)
  if (!fichier) throw new Error(`${id} : pas de sujet habillé (node scripts/annales-sujets.mjs ${id})`)
  const corps = fs.readFileSync(fichier)
  const nom = `${id}.pdf`
  if (manquantsSeuls && (await tailleSurR2(nom)) === corps.length) return false
  const reponse = await r2.client.fetch(`${r2.base}/${encodeURIComponent(nom)}`, {
    method: 'PUT',
    body: corps,
    headers: { 'Content-Type': 'application/pdf' },
  })
  if (!reponse.ok) throw new Error(`R2 ${nom} : PUT ${reponse.status} ${(await reponse.text()).slice(0, 200)}`)
  return true
}

const ids = demandes.length
  ? demandes
  : [...new Set(DOSSIERS.flatMap((d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.pdf')).map((f) => f.slice(0, -4)) : [])))].sort()
if (ids.length === 0) {
  console.error('Aucun sujet habillé à déposer.')
  process.exit(1)
}
console.log(`${ids.length} sujet(s) → R2 (${r2.bucket})${manquantsSeuls ? ', les manquants seulement' : ''}`)

let deposes = 0
let dejaLa = 0
let echecs = 0
for (let i = 0; i < ids.length; i += PARALLELE) {
  const lot = ids.slice(i, i + PARALLELE)
  const resultats = await Promise.allSettled(lot.map(deposer))
  resultats.forEach((r, j) => {
    if (r.status === 'rejected') {
      echecs++
      console.error(`  ✗ ${r.reason?.message ?? r.reason}`)
    } else if (r.value) {
      deposes++
      console.log(`  ✓ ${lot[j]}`)
    } else dejaLa++
  })
}
console.log(`${deposes} déposé(s), ${dejaLa} déjà là, ${echecs} échec(s).`)
if (echecs > 0) process.exit(2)
