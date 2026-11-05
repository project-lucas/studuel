#!/usr/bin/env node
// -----------------------------------------------------------------------------
// LES BRUITAGES DE STUDUEL (05/11/2026, docs/CADRAGE-DOPAMINE.md + CADRAGE-SON.md)
//
// Deux temps :
//   node scripts/sons-studuel.mjs generer [nom…]   → ElevenLabs (bruitages),
//        masters dans assets-sources/son/sfx/<nom>-<n>.mp3 (hors git), N essais
//   node scripts/sons-studuel.mjs servir           → ffmpeg : le master RETENU
//        (table RETENUS ci-dessous) devient public/sounds/v2/<nom>.mp3 — mono,
//        coupé au premier son, fondu de sortie, -16 LUFS, 96 kb/s ; les
//        musiques du pilote (assets-sources/son/pilote) deviennent
//        public/music/<piste>.mp3 à 96 kb/s.
//
// La clé vient de l'environnement (ELEVENLABS_API_KEY), jamais du dépôt.
// UN UNIVERS : tout est décrit « bright, magical academy, fantasy school,
// warm wooden and crystal timbres, C major », court, sans voix ni musique.
// -----------------------------------------------------------------------------

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const RACINE = process.cwd()
const MASTERS = join(RACINE, 'assets-sources', 'son', 'sfx')
const PILOTE = join(RACINE, 'assets-sources', 'son', 'pilote')
const SONS = join(RACINE, 'public', 'sounds', 'v2')
const MUSIQUE = join(RACINE, 'public', 'music')

const UNIVERS =
  'bright magical fantasy academy game UI sound, warm wooden and crystal timbres, in C major, clean, no voice, no music, no reverb tail'

/** Le catalogue : nom → prompt et durée (s). Les noms sont ceux de lib/sons-studuel. */
export const BRUITAGES = {
  rencontre: {
    duree: 0.9,
    prompt: 'quick rising magical whoosh stinger that swells upward in pitch, anime monster encounter alert, tension building, sharp ending',
  },
  vitesse: {
    duree: 0.7,
    prompt: 'fast air rush whoosh, speed lines, wind swoosh passing by, airy and bright',
  },
  flash: {
    duree: 0.8,
    prompt: 'bright shimmering white flash impact, sparkling crystal burst that fades to silence',
  },
  impact: {
    duree: 0.5,
    prompt: 'cartoon punchy hit impact, soft thump with a bright pop, game combat hit',
  },
  critique: {
    duree: 0.7,
    prompt: 'powerful critical hit impact, heavy thump with crystal shatter sparkle, satisfying game combat',
  },
  scintillement: {
    duree: 0.8,
    prompt: 'magical sparkle shimmer, twinkling chimes rising, reward appears, glittering',
  },
  tic: {
    duree: 0.5,
    prompt: 'single short crystal glass tick, one bright marimba note, plink, very short and dry',
  },
  'coffre-tremble': {
    duree: 0.8,
    prompt: 'small wooden treasure chest rattling and shaking, lid clattering, anticipation',
  },
  'coffre-ouvre': {
    duree: 1.2,
    prompt: 'wooden treasure chest bursts open with a magical golden shimmer and sparkle chime, rewarding',
  },
  piece: {
    duree: 0.5,
    prompt: 'single bright gem collected, crystal clink pickup, game reward pickup',
  },
}

/** Le master gardé pour chaque bruitage (numéro d'essai). Choisi à l'écoute/à l'analyse. */
const RETENUS = {
  rencontre: 2, // monte jusqu'au bout, jusque dans le blanc
  vitesse: 1,
  flash: 2, // le plus brillant
  impact: 2, // le 1 bourdonne (trémolo grave)
  critique: 2,
  scintillement: 2,
  tic: 1, // le 2 est presque muet ; fondamentale mesurée ≈ 2 387 Hz (TIC_HZ de lib/sons-studuel)
  'coffre-tremble': 2, // les cliquetis tiennent plus longtemps
  'coffre-ouvre': 1,
  piece: 1,
}

/** Les musiques du lot pilote (30/10/2026) : piste servie ← fichier source. */
const MUSIQUES = {
  arene: '04-ambiance-reviser.mp3',
  combat: '02-duel-boucle.mp3',
  victoire: '03-victoire.mp3',
}

const ESSAIS = 2

async function generer(noms) {
  const cle = process.env.ELEVENLABS_API_KEY
  if (!cle) throw new Error('ELEVENLABS_API_KEY absente de l’environnement')
  mkdirSync(MASTERS, { recursive: true })
  for (const nom of noms) {
    const b = BRUITAGES[nom]
    if (!b) throw new Error(`bruitage inconnu : ${nom}`)
    for (let n = 1; n <= ESSAIS; n++) {
      const sortie = join(MASTERS, `${nom}-${n}.mp3`)
      if (existsSync(sortie)) {
        console.log(`· ${nom}-${n} existe déjà`)
        continue
      }
      const r = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
        method: 'POST',
        headers: { 'xi-api-key': cle, 'content-type': 'application/json' },
        body: JSON.stringify({ text: `${b.prompt}. ${UNIVERS}`, duration_seconds: b.duree, prompt_influence: 0.6 }),
      })
      if (!r.ok) throw new Error(`${nom}-${n} : HTTP ${r.status} ${await r.text()}`)
      writeFileSync(sortie, Buffer.from(await r.arrayBuffer()))
      console.log(`✓ ${nom}-${n}`)
    }
  }
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
}

function servir() {
  mkdirSync(SONS, { recursive: true })
  mkdirSync(MUSIQUE, { recursive: true })
  for (const [nom, n] of Object.entries(RETENUS)) {
    const source = join(MASTERS, `${nom}-${n}.mp3`)
    if (!existsSync(source)) throw new Error(`master absent : ${source}`)
    const duree = BRUITAGES[nom].duree
    ffmpeg([
      '-i', source,
      '-af',
      [
        // Coupe le silence de tête : le son part AU geste.
        'silenceremove=start_periods=1:start_threshold=-45dB',
        `afade=t=out:st=${Math.max(0, duree - 0.12).toFixed(2)}:d=0.12`,
        'loudnorm=I=-16:TP=-1.5:LRA=7',
      ].join(','),
      '-ac', '1', '-ar', '44100', '-b:a', '96k',
      join(SONS, `${nom}.mp3`),
    ])
    console.log(`→ public/sounds/v2/${nom}.mp3`)
  }
  for (const [piste, fichier] of Object.entries(MUSIQUES)) {
    ffmpeg([
      '-i', join(PILOTE, fichier),
      '-af', 'loudnorm=I=-20:TP=-2:LRA=9',
      // 96 kb/s : public/ refuse tout fichier de plus de 600 Ko (lib/public-poids).
      '-ac', '2', '-ar', '44100', '-b:a', '96k',
      join(MUSIQUE, `${piste}.mp3`),
    ])
    console.log(`→ public/music/${piste}.mp3`)
  }
}

const [commande, ...reste] = process.argv.slice(2)
if (commande === 'generer') await generer(reste.length > 0 ? reste : Object.keys(BRUITAGES))
else if (commande === 'servir') servir()
else console.log('usage : node scripts/sons-studuel.mjs generer [nom…] | servir')
