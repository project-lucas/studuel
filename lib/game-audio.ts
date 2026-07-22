// Le SOUND DESIGN des modes de jeu — la partition, pas le haut-parleur.
//
// Jusqu'ici tous les modes jouaient exactement les mêmes deux notes (do-sol) sur
// une bonne réponse. Deux jeux qui promettent des univers opposés — un tour du
// monde tranquille et une machine à calcul qui s'emballe — sonnaient identiques,
// et l'oreille est ce qui trahit le copier-coller en premier : on reconnaît un
// jeu à son bruit avant de le reconnaître à son écran.
//
// Chaque jeu a donc un TIMBRE : une forme d'onde, une tonique, un accord de
// récompense, un registre. Ce module ne fait que CALCULER les notes (fréquences,
// durées, gains) ; `lib/sounds.ts` les joue via WebAudio. Pur ⇒ testable.
import { transpose } from '@/lib/juice'

/** La couleur sonore d'un jeu. */
export type GameTimbre =
  /** Cloches claires, aériennes, registre haut. */
  | 'cristal'
  /** Cliquetis secs et carrés — une mécanique de précision. */
  | 'metal'
  /** Notes rondes et boisées, pentatonique — chaleureux, jamais agressif. */
  | 'bois'
  /** Nappes graves et feutrées, attaque lente — on réfléchit. */
  | 'velours'
  /** Cuivres courts et festifs — la fanfare. */
  | 'cuivre'

/** Une note à jouer : quand, quelle fréquence, quelle forme, quel volume. */
export type ToneSpec = {
  /** Fréquence en Hz. */
  freq: number
  /** Décalage de départ en secondes, relatif au déclenchement. */
  at: number
  /** Durée en secondes. */
  dur: number
  wave: OscillatorType
  /** Gain crête (0..1) — volontairement bas : c'est du feedback, pas de la musique. */
  peak: number
}

type TimbreProfile = {
  wave: OscillatorType
  /** Forme d'onde de la note d'accent (3e note des séries hautes). */
  accentWave: OscillatorType
  /** La tonique du jeu, en Hz — c'est elle qui donne le « registre ». */
  root: number
  /** Intervalles (demi-tons) de l'accord de récompense, joués en arpège. */
  reward: number[]
  /** Écart entre deux notes de l'arpège, en secondes. */
  spread: number
  /** Durée d'une note de récompense. */
  dur: number
  /** Gain crête de référence. */
  peak: number
  /** Forme d'onde et fréquence du refus. */
  wrongFreq: number
  wrongWave: OscillatorType
}

// Registres choisis pour être distinguables À L'OREILLE d'un jeu à l'autre :
// une octave d'écart au moins entre cristal (aigu) et velours (grave).
const PROFILES: Record<GameTimbre, TimbreProfile> = {
  cristal: {
    wave: 'sine',
    accentWave: 'triangle',
    root: 1046.5, // do aigu
    reward: [0, 7, 12],
    spread: 0.075,
    dur: 0.12,
    peak: 0.045,
    wrongFreq: 233.08,
    wrongWave: 'sine',
  },
  metal: {
    wave: 'square',
    accentWave: 'square',
    root: 587.33, // ré
    reward: [0, 5, 10],
    spread: 0.055, // le plus serré : ça claque
    dur: 0.06,
    peak: 0.025, // une onde carrée porte plus fort à gain égal
    wrongFreq: 110,
    wrongWave: 'square',
  },
  bois: {
    wave: 'triangle',
    accentWave: 'sine',
    root: 440, // la
    reward: [0, 4, 9], // pentatonique : rond, jamais dissonant
    spread: 0.09,
    dur: 0.15,
    peak: 0.05,
    wrongFreq: 164.81,
    wrongWave: 'triangle',
  },
  velours: {
    wave: 'sine',
    accentWave: 'sine',
    root: 329.63, // mi grave
    reward: [0, 3, 7], // mineur : feutré, contemplatif
    spread: 0.13, // le plus lent : on respire
    dur: 0.26,
    peak: 0.055,
    wrongFreq: 130.81,
    wrongWave: 'sine',
  },
  cuivre: {
    wave: 'sawtooth',
    accentWave: 'sawtooth',
    root: 523.25, // do
    reward: [0, 4, 7], // majeur franc : la fanfare
    spread: 0.07,
    dur: 0.11,
    peak: 0.028, // dents de scie : riche en harmoniques, donc plus bas
    wrongFreq: 146.83,
    wrongWave: 'sawtooth',
  },
}

/** Demi-tons ajoutés à la récompense par la série en cours, plafonnés. */
export const MAX_STREAK_SEMITONES = 10

export function streakSemitones(streak: number): number {
  if (streak <= 1) return 0
  return Math.min(streak - 1, MAX_STREAK_SEMITONES)
}

/**
 * Bonne réponse : l'arpège du timbre, transposé par la série. La 3e note ne
 * tombe qu'à partir de 3 d'affilée — sinon la récompense de base est trop
 * bavarde et perd son effet quand la série arrive vraiment.
 */
export function correctTones(timbre: GameTimbre, streak: number): ToneSpec[] {
  const p = PROFILES[timbre]
  const up = streakSemitones(streak)
  const notes = streak >= 3 ? p.reward : p.reward.slice(0, 2)
  return notes.map((semi, i) => ({
    freq: transpose(p.root, semi + up),
    at: p.spread * i,
    dur: p.dur,
    wave: i === notes.length - 1 && notes.length > 2 ? p.accentWave : p.wave,
    peak: p.peak,
  }))
}

/** Mauvaise réponse : une seule note grave, courte, dans la couleur du jeu. */
export function wrongTones(timbre: GameTimbre): ToneSpec[] {
  const p = PROFILES[timbre]
  return [{ freq: p.wrongFreq, at: 0, dur: 0.18, wave: p.wrongWave, peak: 0.03 }]
}

/**
 * Vie perdue : deux notes DESCENDANTES — l'inverse exact de la récompense.
 * C'est le son qui doit faire mal sans être désagréable.
 */
export function lifeLostTones(timbre: GameTimbre): ToneSpec[] {
  const p = PROFILES[timbre]
  return [
    { freq: p.root * 0.75, at: 0, dur: 0.14, wave: p.wave, peak: p.peak },
    { freq: p.root * 0.5, at: 0.12, dur: 0.3, wave: p.wrongWave, peak: p.peak },
  ]
}

/**
 * Étape franchie (vague, escale, étage) : l'arpège complet une octave plus
 * haut. Plus court qu'une victoire, plus marquant qu'une bonne réponse.
 */
export function stepClearedTones(timbre: GameTimbre): ToneSpec[] {
  const p = PROFILES[timbre]
  return p.reward.map((semi, i) => ({
    freq: transpose(p.root * 2, semi),
    at: p.spread * 0.8 * i,
    dur: p.dur * 1.2,
    wave: p.wave,
    peak: p.peak * 0.9,
  }))
}

/**
 * Tic du chrono. Une seule note très brève, qui MONTE quand l'urgence monte
 * (`urgency` de 0 à 1) — la pression se ressent avant même de lire le nombre.
 */
export function tickTone(timbre: GameTimbre, urgency: number): ToneSpec {
  const p = PROFILES[timbre]
  const u = Math.max(0, Math.min(1, urgency))
  return {
    freq: transpose(p.root * 0.5, Math.round(u * 12)),
    at: 0,
    dur: 0.035,
    wave: p.wave,
    peak: 0.008 + 0.014 * u,
  }
}

/** Victoire : l'arpège monté sur deux octaves, avec une note tenue à la fin. */
export function winTones(timbre: GameTimbre): ToneSpec[] {
  const p = PROFILES[timbre]
  const climb = [...p.reward, 12, 12 + p.reward[1], 24]
  return climb.map((semi, i) => ({
    freq: transpose(p.root, semi),
    at: p.spread * i,
    dur: i === climb.length - 1 ? 0.5 : p.dur,
    wave: i === climb.length - 1 ? p.accentWave : p.wave,
    peak: p.peak,
  }))
}

/** Défaite : la même figure, à l'envers et vers le bas. Digne, jamais moqueuse. */
export function loseTones(timbre: GameTimbre): ToneSpec[] {
  const p = PROFILES[timbre]
  return [0, -3, -7].map((semi, i) => ({
    freq: transpose(p.root * 0.5, semi),
    at: 0.14 * i,
    dur: i === 2 ? 0.45 : 0.16,
    wave: p.wave,
    peak: p.peak * 0.85,
  }))
}

/**
 * Compte à rebours de départ : `n` vaut 3, 2, 1 puis 0 (le « GO »). Le GO est
 * une octave au-dessus — c'est le signal que la partie commence VRAIMENT.
 */
export function countdownTone(timbre: GameTimbre, n: number): ToneSpec {
  const p = PROFILES[timbre]
  const go = n <= 0
  return {
    freq: go ? p.root * 2 : p.root,
    at: 0,
    dur: go ? 0.32 : 0.1,
    wave: go ? p.accentWave : p.wave,
    peak: go ? p.peak * 1.2 : p.peak * 0.8,
  }
}
