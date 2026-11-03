// -----------------------------------------------------------------------------
// LA VOIX DES DICTÉES — ElevenLabs, une fois pour toutes (01/11/2026).
//
//   node scripts/dictees-audio.mjs <slug> [--force]
//
// Lit contenu/dictees/<slug>.json et écrit dans public/audio/dictees/<slug>/ :
//   · integrale.mp3 — le texte lu d'une traite, au débit d'une lecture ;
//   · 01.mp3, 02.mp3… — chaque morceau DICTÉ : plus lent, la ponctuation dite à
//     voix haute (« virgule », « point-virgule », « point, à la ligne »), comme
//     le fait un professeur.
//
// Un fichier déjà là n'est pas refait (les crédits sont comptés) ; --force
// refait tout. La clé est lue dans ELEVENLABS_API_KEY et n'est jamais écrite.
// -----------------------------------------------------------------------------
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/** « Voix ton info Nicolas Petit » : voix masculine française, posée. */
const VOIX = 'AmMsHJaCw4BtwV3KoUXF'
const MODELE = 'eleven_multilingual_v2'
const FORMAT = 'mp3_44100_64'
/** Débits : la lecture intégrale, puis le morceau dicté. */
const DEBIT_LECTURE = 0.95
const DEBIT_DICTEE = 0.82

const [slug, option] = process.argv.slice(2)
if (!slug) throw new Error('usage : node scripts/dictees-audio.mjs <slug> [--force]')
const forcer = option === '--force'
// --essai : affiche ce qui serait dit, sans rien envoyer.
const essai = option === '--essai'
const cle = process.env.ELEVENLABS_API_KEY
if (!cle && !essai) throw new Error('ELEVENLABS_API_KEY absente')

const dictee = JSON.parse(readFileSync(path.join('contenu', 'dictees', `${slug}.json`), 'utf8'))
const dossier = path.join('public', 'audio', 'dictees', slug)
mkdirSync(dossier, { recursive: true })

/**
 * Le morceau tel qu'un professeur le dicte : la ponctuation est NOMMÉE, celle
 * du milieu comme celle de la fin ; une phrase qui clôt un paragraphe
 * (`paragraphes` du JSON, index des morceaux) se termine par « point, à la
 * ligne », la dernière par « point final ».
 */
const NOMS = { ',': 'virgule', ';': 'point-virgule', ':': 'deux-points', '?': 'point d’interrogation', '!': 'point d’exclamation' }
function texteDicte(texte, { dernier, finParagraphe }) {
  const s = texte.trim()
  const fin = s.slice(-1)
  const ponctue = /[.,;:?!]/.test(fin)
  const corps = (ponctue ? s.slice(0, -1).trimEnd() : s).replace(/,\s+/g, ', virgule, ')
  if (!ponctue) return corps
  const nom = fin === '.' ? (dernier ? 'point final' : finParagraphe ? 'point, à la ligne' : 'point') : NOMS[fin]
  return `${corps}, ${nom}.`
}

async function dire(texte, debit, fichier) {
  if (essai) {
    console.log(path.basename(fichier), '→', texte)
    return texte.length
  }
  if (existsSync(fichier) && !forcer) {
    console.log('déjà là :', fichier)
    return 0
  }
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOIX}?output_format=${FORMAT}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': cle, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text: texte,
        model_id: MODELE,
        language_code: 'fr',
        voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0, speed: debit },
      }),
    },
  )
  if (!r.ok) throw new Error(`ElevenLabs ${r.status} : ${(await r.text()).slice(0, 200)}`)
  writeFileSync(fichier, Buffer.from(await r.arrayBuffer()))
  console.log('écrit :', fichier, '—', texte)
  return texte.length
}

const segments = dictee.segments
const finsDeParagraphe = new Set(dictee.paragraphes ?? [])
let caracteres = 0
caracteres += await dire(segments.join(' '), DEBIT_LECTURE, path.join(dossier, 'integrale.mp3'))
for (let i = 0; i < segments.length; i++) {
  const texte = texteDicte(segments[i], {
    dernier: i === segments.length - 1,
    finParagraphe: finsDeParagraphe.has(i),
  })
  caracteres += await dire(texte, DEBIT_DICTEE, path.join(dossier, `${String(i + 1).padStart(2, '0')}.mp3`))
}
console.log('caractères envoyés :', caracteres)
