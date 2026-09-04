// -----------------------------------------------------------------------------
// LA PARTITION DE LA COURSE — les sons qui n'existent que dans le duel.
//
// Le timbre d'une bonne réponse, d'une erreur, du décompte, vient déjà de
// `lib/game-audio` (la course sonne « cuivre » : la fanfare, le seul timbre qui
// dise « compétition »). Ce fichier ajoute ce qu'aucun jeu solo n'a : les sons
// DE L'AUTRE, et ceux de la position.
//
//   · le rival marque / rate — plus grave et plus doux que les miens : on
//     l'entend jouer sans que ça couvre ma propre partie ;
//   · le dépassement — un glissando qui monte quand je passe devant, qui
//     descend quand on me double. L'oreille sait qui mène avant les yeux ;
//   · la jauge — à chaque bonne réponse, une note dont la hauteur suit le
//     remplissage de MA barre : plus elle est pleine, plus ça monte ;
//   · le cœur du sprint — deux coups sourds, dont le tempo se resserre avec
//     l'avance de la course ;
//   · la question dorée — un scintillement ;
//   · l'arrivée — la fanfare, ou la chute.
//
// Pur : ce module CALCULE les notes ; `lib/sounds.ts` les joue.
// -----------------------------------------------------------------------------

import type { ToneSpec } from '@/lib/game-audio'
import { transpose } from '@/lib/juice'

/** Le rival marque : un pluck grave, feutré, en deux notes qui montent à peine. */
export function rivalGoodTones(): ToneSpec[] {
  return [
    { freq: 261.63, at: 0, dur: 0.09, wave: 'triangle', peak: 0.026 },
    { freq: 329.63, at: 0.08, dur: 0.12, wave: 'triangle', peak: 0.024 },
  ]
}

/** Le rival rate : un coup mat, une seule note grave et courte. */
export function rivalWrongTones(): ToneSpec[] {
  return [{ freq: 146.83, at: 0, dur: 0.1, wave: 'triangle', peak: 0.022 }]
}

/**
 * Le dépassement. Cinq notes en glissando, ascendant quand JE passe devant,
 * descendant quand on me double. Même durée, même volume : l'information est
 * dans la direction, pas dans la force.
 */
export function overtakeTones(up: boolean): ToneSpec[] {
  const steps = [0, 2, 4, 7, 12]
  const ordered = up ? steps : [...steps].reverse()
  return ordered.map((semi, i) => ({
    freq: transpose(392, semi),
    at: i * 0.045,
    dur: 0.09,
    wave: up ? 'sine' : 'triangle',
    peak: up ? 0.045 : 0.04,
  }))
}

/**
 * La jauge qui monte : une note dont la hauteur suit le remplissage (0..1),
 * sur une octave et demie. À moitié pleine on est à la quinte ; pleine, à
 * l'octave + quinte. C'est ce qui fait ENTENDRE qu'on approche de l'arrivée.
 */
export const FILL_ROOT = 523.25
export const FILL_SPAN_SEMITONES = 19

export function fillTone(ratio: number): ToneSpec {
  const r = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0))
  return {
    freq: transpose(FILL_ROOT, Math.round(r * FILL_SPAN_SEMITONES)),
    at: 0.12,
    dur: 0.16,
    wave: 'sine',
    peak: 0.04,
  }
}

/**
 * Le cœur du sprint : deux coups sourds (lub-dub). L'INTERVALLE entre deux
 * battements est décidé par `heartbeatIntervalMs` — plus la course avance,
 * plus il se resserre.
 */
export function heartbeatTones(): ToneSpec[] {
  return [
    { freq: 55, at: 0, dur: 0.12, wave: 'sine', peak: 0.06 },
    { freq: 49, at: 0.16, dur: 0.14, wave: 'sine', peak: 0.045 },
  ]
}

export const HEARTBEAT_SLOW_MS = 900
export const HEARTBEAT_FAST_MS = 480

/** L'intervalle entre deux battements, selon la barre la plus avancée (0..1). */
export function heartbeatIntervalMs(maxRatio: number): number {
  const r = Math.min(1, Math.max(0, Number.isFinite(maxRatio) ? maxRatio : 0))
  return Math.round(HEARTBEAT_SLOW_MS - (HEARTBEAT_SLOW_MS - HEARTBEAT_FAST_MS) * r)
}

/** La question dorée arrive : un scintillement de quatre notes cristallines. */
export function goldenTones(): ToneSpec[] {
  return [1046.5, 1318.51, 1567.98, 2093].map((freq, i) => ({
    freq,
    at: i * 0.06,
    dur: 0.14,
    wave: 'sine',
    peak: 0.035,
  }))
}

/** La rencontre : deux coups de cuivre, un par camp, puis l'accord. */
export function vsTones(): ToneSpec[] {
  return [
    { freq: 196, at: 0, dur: 0.22, wave: 'sawtooth', peak: 0.03 },
    { freq: 261.63, at: 0.26, dur: 0.22, wave: 'sawtooth', peak: 0.03 },
    { freq: 392, at: 0.52, dur: 0.4, wave: 'sawtooth', peak: 0.032 },
    { freq: 523.25, at: 0.52, dur: 0.4, wave: 'sine', peak: 0.025 },
  ]
}

/** L'arrivée. Gagnée : la fanfare qui monte. Perdue : deux notes qui tombent. */
export function finishTones(won: boolean): ToneSpec[] {
  if (won) {
    return [
      { freq: 523.25, at: 0, dur: 0.12, wave: 'sawtooth', peak: 0.03 },
      { freq: 659.25, at: 0.12, dur: 0.12, wave: 'sawtooth', peak: 0.03 },
      { freq: 783.99, at: 0.24, dur: 0.12, wave: 'sawtooth', peak: 0.03 },
      { freq: 1046.5, at: 0.36, dur: 0.5, wave: 'sawtooth', peak: 0.034 },
      { freq: 1318.51, at: 0.36, dur: 0.5, wave: 'sine', peak: 0.03 },
    ]
  }
  return [
    { freq: 329.63, at: 0, dur: 0.3, wave: 'triangle', peak: 0.035 },
    { freq: 246.94, at: 0.3, dur: 0.55, wave: 'triangle', peak: 0.035 },
  ]
}

/** Le sprint s'ouvre : un roulement bref qui monte. */
export function sprintTones(): ToneSpec[] {
  return [0, 0, 0, 3, 7].map((semi, i) => ({
    freq: transpose(220, semi),
    at: i * 0.07,
    dur: 0.08,
    wave: 'square',
    peak: 0.02,
  }))
}
