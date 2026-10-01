/**
 * GÉNÉRER DES ILLUSTRATIONS PAR L'API HIGGSFIELD — un outil de l'agent de
 * code, pas une fonctionnalité de l'app : aucun élève n'appelle Higgsfield,
 * la clé ne quitte jamais cette machine (.env.local, ignoré par git).
 *
 *   node scripts/higgsfield.mjs <commande.json> [--modele <endpoint>] [--seulement id1,id2] [--essai]
 *
 * La COMMANDE est un fichier JSON :
 *   {
 *     "modele": "xai/grok-imagine-image-2.0",        // endpoint Higgsfield (défaut)
 *     "parametres": { "aspect_ratio": "1:1", "resolution": "2k" },
 *     "references": ["public/images/nav/tresor.webp"],  // jointes à chaque image
 *     "prefixe": "texte ajouté devant chaque prompt",
 *     "images": [
 *       { "id": "bronze", "sortie": "assets-sources/famille/rangs/bronze.png",
 *         "prompt": "…", "references": ["…"], "parametres": { … } }
 *     ]
 *   }
 *
 * Le cycle suit la documentation (docs.higgsfield.ai, 24/09/2026) :
 *   1. chaque référence locale est envoyée par une URL présignée
 *      (POST /files/generate-upload-url puis PUT), son URL publique est gardée
 *      au journal (clé = empreinte du fichier) : jamais renvoyée deux fois ;
 *   2. POST <endpoint> → `request_id`, ÉCRIT AU JOURNAL AVANT d'attendre :
 *      une commande relancée reprend le suivi au lieu de payer une seconde
 *      génération (l'API n'accepte pas de clé d'idempotence) ;
 *   3. GET status_url : 2 s, puis ×1,5 jusqu'à 10 s, avec un peu de hasard,
 *      jusqu'à completed · failed · nsfw · canceled, ou 10 min ;
 *   4. l'image est téléchargée dans `sortie` (les URL de Higgsfield ne vivent
 *      que sept jours).
 * Une image dont la sortie existe déjà est sautée. `--essai` ne soumet rien :
 * il affiche ce qui partirait.
 *
 * Erreurs : 401 (clé) et 403 (crédits) arrêtent tout ; 400, 422, 423, 503
 * (modèle désactivé) arrêtent l'image concernée ; 5xx et réseau sont
 * retentés sur le SUIVI, jamais sur la soumission.
 *
 * Variables (dans .env.local) : HF_API_KEY_ID, HF_API_KEY_SECRET.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const API = 'https://api.higgsfield.ai'
const JOURNAL = 'assets-sources/.higgsfield-journal.json'
const TERMINAUX = new Set(['completed', 'failed', 'nsfw', 'canceled'])
const DELAI_MAX_SUIVI_MS = 10 * 60 * 1000
const EN_PARALLELE = 2
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }

// --- Arguments et identifiants ------------------------------------------------

const args = process.argv.slice(2)
const option = (nom) => {
  const i = args.indexOf(nom)
  return i >= 0 ? args[i + 1] : undefined
}
const fichierCommande = args.find((a) => !a.startsWith('--') && a !== option('--modele') && a !== option('--seulement'))
if (!fichierCommande) {
  console.error('Usage : node scripts/higgsfield.mjs <commande.json> [--modele <endpoint>] [--seulement a,b] [--essai]')
  process.exit(1)
}
const essai = args.includes('--essai')
const seulement = option('--seulement')?.split(',').map((s) => s.trim()).filter(Boolean)

function lireEnv() {
  if (process.env.HF_API_KEY_ID && process.env.HF_API_KEY_SECRET) return
  if (!existsSync('.env.local')) return
  for (const ligne of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = /^\s*(HF_API_KEY_ID|HF_API_KEY_SECRET)\s*=\s*(.+?)\s*$/.exec(ligne)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
lireEnv()
const { HF_API_KEY_ID, HF_API_KEY_SECRET } = process.env
if (!essai && (!HF_API_KEY_ID || !HF_API_KEY_SECRET)) {
  console.error('HF_API_KEY_ID et HF_API_KEY_SECRET manquent (.env.local).')
  process.exit(1)
}
const AUTH = { Authorization: `Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}` }

// --- Le journal : références envoyées, générations soumises ------------------

const journal = existsSync(JOURNAL)
  ? JSON.parse(readFileSync(JOURNAL, 'utf8'))
  : { references: {}, generations: {} }
const sauverJournal = () => {
  mkdirSync(path.dirname(JOURNAL), { recursive: true })
  writeFileSync(JOURNAL, JSON.stringify(journal, null, 2))
}

class ArretTotal extends Error {}
class EchecImage extends Error {}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))

async function appel(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...AUTH, 'Content-Type': 'application/json', ...init.headers } })
  const texte = await res.text()
  let corps = null
  try {
    corps = texte ? JSON.parse(texte) : null
  } catch {
    corps = texte
  }
  return { res, corps, correlation: res.headers.get('x-correlation-id') }
}

function detail(corps) {
  const d = corps && typeof corps === 'object' ? corps.detail : corps
  return typeof d === 'string' ? d : JSON.stringify(d)
}

// --- 1. Références ------------------------------------------------------------

async function urlReference(chemin) {
  if (/^https?:\/\//.test(chemin)) return chemin
  if (!existsSync(chemin)) throw new EchecImage(`référence introuvable : ${chemin}`)
  const contenu = readFileSync(chemin)
  const empreinte = createHash('sha256').update(contenu).digest('hex').slice(0, 24)
  const connue = journal.references[empreinte]
  // Les URL présignées de Higgsfield sont temporaires : on les garde six jours.
  if (connue && Date.now() - connue.le < 6 * 24 * 3600 * 1000) return connue.url
  const type = TYPES[path.extname(chemin).toLowerCase()]
  if (!type) throw new EchecImage(`type de référence non pris en charge : ${chemin}`)

  const { res, corps } = await appel(`${API}/files/generate-upload-url`, {
    method: 'POST',
    body: JSON.stringify({ content_type: type }),
  })
  if (res.status === 401) throw new ArretTotal('clé Higgsfield refusée (401)')
  if (!res.ok) throw new EchecImage(`envoi de ${chemin} refusé (${res.status}) : ${detail(corps)}`)
  // Les en-têtes renvoyés, et SEULEMENT eux : jamais la clé vers le stockage.
  const put = await fetch(corps.upload_url, { method: 'PUT', headers: corps.upload_headers, body: contenu })
  if (!put.ok) throw new EchecImage(`dépôt de ${chemin} échoué (${put.status})`)
  journal.references[empreinte] = { url: corps.public_url, chemin, le: Date.now() }
  sauverJournal()
  return corps.public_url
}

// --- 2. Soumission ------------------------------------------------------------

async function soumettre(modele, corpsRequete) {
  const { res, corps, correlation } = await appel(`${API}/${modele}`, {
    method: 'POST',
    body: JSON.stringify(corpsRequete),
  })
  if (res.status === 401) throw new ArretTotal('clé Higgsfield refusée (401)')
  if (res.status === 403) throw new ArretTotal(`crédits insuffisants (403) : ${detail(corps)}`)
  if (res.status === 404) throw new ArretTotal(`modèle introuvable pour ce compte : ${modele} (${detail(corps)})`)
  if (res.status === 503 || res.status === 423)
    throw new ArretTotal(`modèle indisponible pour ce compte : ${modele} (${res.status} ${detail(corps)})`)
  if (!res.ok || !corps?.request_id)
    throw new EchecImage(`soumission refusée (${res.status}, corrélation ${correlation}) : ${detail(corps)}`)
  return corps
}

// --- 3. Suivi -----------------------------------------------------------------

async function suivre(statusUrl) {
  const debut = Date.now()
  let delai = 2000
  for (;;) {
    if (Date.now() - debut > DELAI_MAX_SUIVI_MS) throw new EchecImage('délai de 10 min dépassé (la génération reste au journal)')
    let r
    try {
      r = await appel(statusUrl)
    } catch {
      r = null // réseau : on retente
    }
    if (r) {
      if (r.res.status === 401) throw new ArretTotal('clé Higgsfield refusée (401)')
      if (r.res.status === 404) throw new EchecImage('génération inconnue de ce compte (404)')
      if (r.res.ok && TERMINAUX.has(r.corps?.status)) return r.corps
    }
    await attendre(delai + Math.random() * 500)
    delai = Math.min(delai * 1.5, 10_000)
  }
}

// --- 4. Téléchargement --------------------------------------------------------

async function telecharger(url, sortie) {
  const res = await fetch(url)
  if (!res.ok) throw new EchecImage(`téléchargement échoué (${res.status})`)
  mkdirSync(path.dirname(sortie), { recursive: true })
  writeFileSync(sortie, Buffer.from(await res.arrayBuffer()))
}

// --- Une image ----------------------------------------------------------------

async function produire(commande, image) {
  const modele = option('--modele') ?? image.modele ?? commande.modele ?? 'xai/grok-imagine-image-2.0'
  const cle = `${modele}::${image.sortie}`
  let suivi = journal.generations[cle]

  if (!suivi || TERMINAUX.has(suivi.status)) {
    const references = [...(commande.references ?? []), ...(image.references ?? [])]
    const prompt = [commande.prefixe, image.prompt].filter(Boolean).join('\n\n')
    if (essai) {
      console.log(`· ${image.id} → ${modele}\n  références : ${references.join(', ') || 'aucune'}\n  ${prompt.slice(0, 220)}…`)
      return
    }
    const urls = []
    for (const r of references) urls.push(await urlReference(r))
    const corps = { prompt, ...(commande.parametres ?? {}), ...(image.parametres ?? {}) }
    if (urls.length > 0) corps.image_urls = urls
    const soumis = await soumettre(modele, corps)
    suivi = { request_id: soumis.request_id, status_url: soumis.status_url, status: soumis.status, le: Date.now() }
    journal.generations[cle] = suivi
    sauverJournal()
    console.log(`→ ${image.id} soumise (${soumis.request_id})`)
  } else {
    console.log(`↻ ${image.id} : reprise du suivi de ${suivi.request_id}`)
  }

  const fin = await suivre(suivi.status_url)
  journal.generations[cle] = { ...suivi, status: fin.status }
  sauverJournal()
  if (fin.status !== 'completed') throw new EchecImage(`${fin.status}${fin.error ? ` : ${fin.error}` : ''}`)
  const url = fin.images?.[0]?.url
  if (!url) throw new EchecImage('terminée sans image')
  await telecharger(url, image.sortie)
  console.log(`✓ ${image.id} → ${image.sortie}`)
}

// --- La commande --------------------------------------------------------------

const commande = JSON.parse(readFileSync(fichierCommande, 'utf8'))
const aFaire = (commande.images ?? []).filter(
  (i) => (!seulement || seulement.includes(i.id)) && !existsSync(i.sortie),
)
console.log(`${aFaire.length} image(s) à produire${essai ? ' (essai, rien ne part)' : ''}`)

const echecs = []
let arret = null
const file = [...aFaire]
async function ouvrier() {
  while (file.length > 0 && !arret) {
    const image = file.shift()
    try {
      await produire(commande, image)
    } catch (e) {
      if (e instanceof ArretTotal) arret = e
      else echecs.push(`${image.id} : ${e.message}`)
    }
  }
}
await Promise.all(Array.from({ length: EN_PARALLELE }, ouvrier))

if (echecs.length) console.error(`\n${echecs.length} échec(s) :\n  ${echecs.join('\n  ')}`)
if (arret) {
  console.error(`\nArrêt : ${arret.message}`)
  process.exit(2)
}
if (echecs.length) process.exit(1)
