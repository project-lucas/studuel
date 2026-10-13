// DÉPOSER LES FICHES PDF DANS SUPABASE STORAGE (migration 563).
//
//   SUPABASE_SERVICE_ROLE_KEY=… node scripts/fiches-deposer.mjs [niveau] [matière]
//     --sans-pdf       ne dépose que les aperçus
//     --sans-apercus   ne dépose que les PDF
//
// Pour chaque fiche du registre : le PDF rendu par scripts/fiches-rendre.mjs
// (`fiches-out/<niveau>/<matière>/<slug>.pdf`, hors git) part dans le bucket
// PRIVÉ `fiches` sous `<chapter_id>.pdf` ; son illustration
// (`assets-sources/fiches/illustrations/…/<slug>.webp`, hors git) part en
// 360 px dans le bucket PUBLIC `fiches-apercus` sous `<chapter_id>.webp` ; et
// LA PAGE FLOUTÉE — le PNG rendu, réduit à 640 px et flouté jusqu'à
// l'illisible — sous `<chapter_id>-flou.webp`, dans le même bucket public :
// c'est ce que l'élève voit tant qu'il n'a pas dépensé ses 30 gemmes. Le flou
// se fait ICI, pas en CSS : une image floutée ne contient plus le texte.
//
// LA CLÉ SERVICE ne vit nulle part dans le dépôt ni sur Vercel : elle se passe
// en variable d'environnement le temps du dépôt, depuis le dashboard Supabase
// (Project settings → API). L'URL du projet est lue dans `.env.local`
// (NEXT_PUBLIC_SUPABASE_URL) à défaut de SUPABASE_URL.

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { listerFiches } from './fiches-rendre.mjs'

const RACINE = path.resolve(import.meta.dirname, '..')
const SORTIE = path.join(RACINE, 'fiches-out')
const ILLUSTRATIONS = path.join(RACINE, 'assets-sources', 'fiches', 'illustrations')
const BUCKET_FICHES = 'fiches'
const BUCKET_APERCUS = 'fiches-apercus'
const LARGEUR_APERCU = 360
/** La page floutée : 640 px de large (le corps de texte fait ~4 px) et un flou de rayon 10 — rien ne se lit, tout se devine. */
const LARGEUR_FLOU = 640
const RAYON_FLOU = 10
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

const url = process.env.SUPABASE_URL ?? variableLocale('NEXT_PUBLIC_SUPABASE_URL')
const cle = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !cle) {
  console.error('Il faut SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL dans .env.local) et SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const args = process.argv.slice(2)
const options = new Set(args.filter((a) => a.startsWith('--')))
const [niveau, matiere] = args.filter((a) => !a.startsWith('--'))
const avecPdf = !options.has('--sans-pdf')
const avecApercus = !options.has('--sans-apercus')

const supabase = createClient(url, cle, { auth: { persistSession: false, autoRefreshToken: false } })

/** Dépose un objet ; lève une erreur lisible si Storage refuse. */
async function deposer(bucket, nom, corps, contentType) {
  const { error } = await supabase.storage.from(bucket).upload(nom, corps, { contentType, upsert: true })
  if (error) throw new Error(`${bucket}/${nom} : ${error.message}`)
}

/** Dépose une fiche ; rend ce qui a été fait, ou ce qui manquait. */
async function deposerFiche({ niveau, matiere, index }) {
  const fait = []
  const manque = []
  const pdf = path.join(SORTIE, niveau, matiere, `${index.slug}.pdf`)
  const page = path.join(SORTIE, niveau, matiere, `${index.slug}.png`)
  const illustration = path.join(ILLUSTRATIONS, niveau, matiere, `${index.slug}.webp`)

  if (avecPdf) {
    if (fs.existsSync(pdf)) {
      await deposer(BUCKET_FICHES, `${index.chapitre}.pdf`, fs.readFileSync(pdf), 'application/pdf')
      fait.push('pdf')
    } else manque.push(path.relative(RACINE, pdf))
  }
  if (avecApercus) {
    if (fs.existsSync(illustration)) {
      const apercu = await sharp(illustration).resize({ width: LARGEUR_APERCU, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
      await deposer(BUCKET_APERCUS, `${index.chapitre}.webp`, apercu, 'image/webp')
      fait.push('aperçu')
    } else manque.push(path.relative(RACINE, illustration))
    if (fs.existsSync(page)) {
      const flou = await sharp(page).resize({ width: LARGEUR_FLOU }).blur(RAYON_FLOU).webp({ quality: 60 }).toBuffer()
      await deposer(BUCKET_APERCUS, `${index.chapitre}-flou.webp`, flou, 'image/webp')
      fait.push('flou')
    } else manque.push(path.relative(RACINE, page))
  }
  return { nom: `${niveau}/${matiere}/${index.slug}`, fait, manque }
}

const fiches = listerFiches({ niveau, matiere })
if (fiches.length === 0) {
  console.error('Aucune fiche ne correspond.')
  process.exit(1)
}
console.log(`${fiches.length} fiche(s) → ${url} (${[avecPdf && 'PDF', avecApercus && 'aperçus'].filter(Boolean).join(' + ')})`)

let deposees = 0
let manquantes = 0
let echecs = 0
for (let i = 0; i < fiches.length; i += PARALLELE) {
  const lot = fiches.slice(i, i + PARALLELE)
  const resultats = await Promise.allSettled(lot.map(deposerFiche))
  for (const r of resultats) {
    if (r.status === 'rejected') {
      echecs++
      console.error(`  ✗ ${r.reason?.message ?? r.reason}`)
      continue
    }
    deposees += r.value.fait.length > 0 ? 1 : 0
    manquantes += r.value.manque.length
    for (const m of r.value.manque) console.warn(`  ! manque ${m}`)
  }
  process.stdout.write(`\r  ${Math.min(i + PARALLELE, fiches.length)} / ${fiches.length}`)
}
console.log(`\n${deposees} fiche(s) déposée(s), ${manquantes} fichier(s) manquant(s), ${echecs} échec(s).`)
if (echecs > 0) process.exit(2)
