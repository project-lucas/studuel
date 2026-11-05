// LES BRUITAGES ENREGISTRÉS DE STUDUEL (05/11/2026, docs/CADRAGE-DOPAMINE.md).
//
// Dix sons courts d'un seul univers (académie de fantasy, bois et cristal, do
// majeur), faits par `scripts/sons-studuel.mjs` et servis depuis
// `public/sounds/v2/`. Ce module ne fait que les JOUER : il ne lit aucun
// réglage — c'est `sfx` (lib/sounds) qui décide si l'élève veut des effets.
//
// Joués en WebAudio (AudioBuffer) plutôt qu'en <audio> : un même tic peut
// partir dix fois en une seconde (la vague d'éclairs), à une hauteur
// différente chaque fois (`playbackRate`), et iOS ignore le volume d'un
// élément <audio>.

import { audioContexte } from '@/lib/audio-contexte'
import { attenuerMusique } from '@/lib/musique'

export const NOMS_SONS = [
  'rencontre',
  'vitesse',
  'flash',
  'impact',
  'critique',
  'scintillement',
  'tic',
  'coffre-tremble',
  'coffre-ouvre',
  'piece',
] as const

export type NomSon = (typeof NOMS_SONS)[number]

export function adresseSon(nom: NomSon): string {
  return `/sounds/v2/${nom}.mp3`
}

/** Fondamentale du tic, mesurée sur le master retenu (spectrogramme). */
export const TIC_HZ = 2387
/** La première perle de la vague sonne en sol (G6) : do majeur, comme le motif. */
const SOL6_HZ = 1567.98
/** Pentatonique de do posée sur sol : G A C D E, sur deux octaves. */
const GAMME_DEPUIS_SOL = [0, 2, 5, 7, 9, 12, 14, 17, 19, 21] as const

/**
 * Le décalage (en demi-tons, par rapport au tic enregistré) de la perle n°
 * `rang` d'une vague. Plafonné en haut de la gamme : une vague de trente
 * éclairs ne finit pas en sifflet.
 */
export function demiTonsPerle(rang: number): number {
  const r = Math.max(0, Math.min(GAMME_DEPUIS_SOL.length - 1, Math.floor(Number.isFinite(rang) ? rang : 0)))
  const base = 12 * Math.log2(SOL6_HZ / TIC_HZ)
  return base + GAMME_DEPUIS_SOL[r]
}

/** Demi-tons → vitesse de lecture d'un AudioBuffer. */
export function tauxDeLecture(demiTons: number): number {
  return Math.pow(2, demiTons / 12)
}

const tampons = new Map<NomSon, Promise<AudioBuffer | null>>()

function charger(nom: NomSon): Promise<AudioBuffer | null> {
  const deja = tampons.get(nom)
  if (deja) return deja
  const audio = audioContexte()
  if (!audio) return Promise.resolve(null)
  const promesse = Promise.resolve()
    .then(() => fetch(adresseSon(nom)))
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((octets) => audio.decodeAudioData(octets))
    .catch(() => {
      // Hors ligne ou fichier absent : on oublie l'échec pour retenter plus
      // tard, et l'appelant joue son repli synthétisé.
      tampons.delete(nom)
      return null
    })
  tampons.set(nom, promesse)
  return promesse
}

/** Décode d'avance les sons d'un écran (le premier tic ne doit pas attendre le réseau). */
export function prechargerSons(noms: readonly NomSon[]): void {
  for (const nom of noms) void charger(nom)
}

export type OptionsSon = {
  /** 0..1, multiplié au niveau du fichier (déjà normalisé à -16 LUFS). */
  volume?: number
  /** Transposition en demi-tons (la vague de perles). */
  demiTons?: number
  /** Baisse la musique le temps du son (le coffre, le flash). */
  attenuer?: boolean
}

/** Au-delà, un son arrivé en retard (réseau lent) n'a plus de sens : on le tait. */
const RETARD_MAX_MS = 350

/**
 * Joue un bruitage. `repli` est joué si le fichier n'a pas pu être lu (le
 * bip synthétisé d'avant), pour qu'un geste ne reste jamais muet.
 */
export function jouerSon(nom: NomSon, options: OptionsSon = {}, repli?: () => void): void {
  const audio = audioContexte()
  if (!audio) {
    repli?.()
    return
  }
  const demande = performance.now()
  void charger(nom).then((tampon) => {
    if (!tampon) {
      repli?.()
      return
    }
    if (performance.now() - demande > RETARD_MAX_MS) return
    const source = audio.createBufferSource()
    source.buffer = tampon
    source.playbackRate.value = tauxDeLecture(options.demiTons ?? 0)
    const gain = audio.createGain()
    gain.gain.value = Math.max(0, Math.min(1, options.volume ?? 0.8))
    source.connect(gain).connect(audio.destination)
    source.start()
    if (options.attenuer) attenuerMusique(tampon.duration / source.playbackRate.value)
  })
}
