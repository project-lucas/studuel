// LES THÈMES MUSICAUX AU CHOIX (05/11/2026).
//
// Lucas : « avoir la possibilité de changer de musique, même si celle-ci est
// très bien […] dans le style un peu héroïque fantasy ». La musique de fond
// (« arene », la cour d'honneur) reste le thème par défaut ; ce script en
// compose d'autres dans le même univers (instruments de l'Académie, motif de
// quatre notes de docs/CADRAGE-SON.md) et les sert en
// `public/music/arene-<id>.mp3`. Le catalogue côté app : `THEMES` de
// lib/musique.ts — un thème ajouté ici s'y déclare aussi.
//
//   node scripts/musiques-themes.mjs generer [id…]   → assets-sources/son/themes/<id>.mp3 (hors git)
//   node scripts/musiques-themes.mjs servir          → public/music/arene-<id>.mp3
//
// Clé : ELEVENLABS_API_KEY (environnement, jamais écrite). API : POST /v1/music.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const RACINE = join(import.meta.dirname, '..')
const MASTERS = join(RACINE, 'assets-sources', 'son', 'themes')
const MUSIQUE = join(RACINE, 'public', 'music')

// 45 s : à 96 kb/s, une boucle tient sous les 600 Ko qu'accepte public/.
const DUREE_MS = 45_000

const UNIVERS =
  'Instrumental loop for the menus of a cozy heroic fantasy academy video game. ' +
  'A recurring four-note motif: a rising fourth, a step up, then a falling leap. ' +
  'Acoustic orchestra only, no synthesizer, no vocals, no choir lyrics. ' +
  'Background music under menus: never harsh, gentle dynamics, the ending flows back into the opening so it loops seamlessly.'

const THEMES = {
  rempart: {
    prompt:
      'Noble and uplifting adventure theme, French horn melody over warm strings, pizzicato, harp arpeggios, light frame drums, steady 100 bpm, the feeling of looking out from a castle rampart at sunrise before a journey.',
  },
  taverne: {
    prompt:
      'Cheerful medieval village theme, lute and wooden flute lead, fiddle, hand drum and tambourine, bouncy 96 bpm, warm and friendly, the inn of a fantasy school town on market day, playful but heroic.',
  },
}

async function generer(ids) {
  const cle = process.env.ELEVENLABS_API_KEY
  if (!cle) throw new Error('ELEVENLABS_API_KEY absente de l’environnement')
  mkdirSync(MASTERS, { recursive: true })
  for (const id of ids) {
    const theme = THEMES[id]
    if (!theme) throw new Error(`thème inconnu : ${id}`)
    const sortie = join(MASTERS, `${id}.mp3`)
    if (existsSync(sortie)) {
      console.log(`· ${id} existe déjà`)
      continue
    }
    const r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
      method: 'POST',
      headers: { 'xi-api-key': cle, 'content-type': 'application/json' },
      body: JSON.stringify({
        prompt: `${theme.prompt} ${UNIVERS}`,
        music_length_ms: DUREE_MS,
        force_instrumental: true,
      }),
    })
    if (!r.ok) throw new Error(`${id} : HTTP ${r.status} ${await r.text()}`)
    writeFileSync(sortie, Buffer.from(await r.arrayBuffer()))
    console.log(`✓ ${id}`)
  }
}

function servir() {
  mkdirSync(MUSIQUE, { recursive: true })
  for (const id of Object.keys(THEMES)) {
    const source = join(MASTERS, `${id}.mp3`)
    if (!existsSync(source)) {
      console.log(`· ${id} : master absent, ignoré`)
      continue
    }
    execFileSync('ffmpeg', [
      '-v', 'error', '-y',
      '-i', source,
      // Le même niveau que la piste « arene » (scripts/sons-studuel.mjs) : un
      // changement de thème ne doit pas changer le volume.
      '-af', 'loudnorm=I=-20:TP=-2:LRA=9',
      '-ac', '2', '-ar', '44100', '-b:a', '96k',
      join(MUSIQUE, `arene-${id}.mp3`),
    ], { stdio: 'inherit' })
    console.log(`→ public/music/arene-${id}.mp3`)
  }
}

const [commande, ...reste] = process.argv.slice(2)
if (commande === 'generer') await generer(reste.length > 0 ? reste : Object.keys(THEMES))
else if (commande === 'servir') servir()
else console.log('usage : node scripts/musiques-themes.mjs generer [id…] | servir')
