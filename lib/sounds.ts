// Sound design façon Duolingo — micro-feedbacks synthétisés en WebAudio,
// jingles premium (assets Mixkit dans public/sounds/) pour les moments forts.
// Utilisable uniquement côté client ; préférence persistée en localStorage.

import { comboSemitones, comboTier, transpose, buzzPattern } from '@/lib/juice'
import {
  correctTones,
  countdownTone,
  lifeLostTones,
  loseTones,
  stepClearedTones,
  tickTone,
  winTones,
  wrongTones,
  type GameTimbre,
  type ToneSpec,
} from '@/lib/game-audio'
import { pressBuzz, pressTones, type PressIntent } from '@/lib/press'

const STORAGE_KEY = 'scolaria-sound'

export function isSoundOn(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) !== 'off'
}

export function setSoundOn(on: boolean): void {
  window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
}

let ctx: AudioContext | null = null

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// Une note avec une petite enveloppe pour éviter les clics.
function note(
  freq: number,
  startIn: number,
  duration: number,
  type: OscillatorType = 'sine',
  peak = 0.05,
) {
  const audio = ensureCtx()
  if (!audio) return
  const t0 = audio.currentTime + startIn
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(audio.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

// Jingles premium : joués via <audio>, fallback synthé si l'asset ne charge pas.
const ASSETS = {
  coin: '/sounds/coin.wav',
  unlock: '/sounds/unlock.wav',
  treasure: '/sounds/treasure.wav',
  levelUp: '/sounds/level-up.wav',
  sessionComplete: '/sounds/session-complete.wav',
} as const

type AssetName = keyof typeof ASSETS

const assetCache = new Map<AssetName, HTMLAudioElement>()

function playAsset(name: AssetName, volume: number, fallback?: () => void) {
  if (typeof window === 'undefined') return
  let el = assetCache.get(name)
  if (!el) {
    el = new Audio(ASSETS[name])
    el.preload = 'auto'
    assetCache.set(name, el)
  }
  el.currentTime = 0
  el.volume = volume
  el.play().catch(() => fallback?.())
}

export const sfx = {
  // Tap de navigation. Rendu par le MÊME moteur que le clic des boutons
  // (lib/press) : partout où l'app appelait déjà `sfx.tap()` — barre d'onglets,
  // croix de fermeture, pastilles de classe — le retour devient celui d'un
  // bouton pressé, sans avoir à toucher ces fichiers un par un.
  tap() {
    press('neutral')
  },
  // Retournement de carte : petit clic doux.
  flip() {
    if (!isSoundOn()) return
    note(660, 0, 0.07, 'triangle', 0.03)
  },
  // Bonne réponse : deux notes ascendantes.
  correct() {
    if (!isSoundOn()) return
    note(523.25, 0, 0.1) // do
    note(783.99, 0.09, 0.14) // sol
  },
  // Bonne réponse EN SÉRIE : la même récompense, mais transposée vers le haut à
  // chaque bonne réponse d'affilée. C'est le cœur du « juice » — la montée se
  // ressent immédiatement et donne envie d'enchaîner. Plafonnée par
  // `comboSemitones` pour ne pas finir dans des aigus pénibles. Une troisième
  // note s'ajoute à partir du palier « en feu » pour marquer le cap.
  correctCombo(streak: number) {
    if (!isSoundOn()) return
    const up = comboSemitones(streak)
    note(transpose(523.25, up), 0, 0.1) // do transposé
    note(transpose(783.99, up), 0.09, 0.14) // sol transposé
    if (comboTier(streak) !== 'aucun' && comboTier(streak) !== 'chaud') {
      note(transpose(1046.5, up), 0.19, 0.18, 'triangle', 0.04) // do aigu
    }
  },
  // Mauvaise réponse : buzz grave, bref.
  wrong() {
    if (!isSoundOn()) return
    note(196, 0, 0.16, 'sawtooth', 0.03)
  },
  // Session/défi terminé : fanfare (asset), fallback arpège victorieux.
  complete() {
    if (!isSoundOn()) return
    playAsset('sessionComplete', 0.35, () => {
      note(523.25, 0, 0.1) // do
      note(659.25, 0.1, 0.1) // mi
      note(783.99, 0.2, 0.1) // sol
      note(1046.5, 0.3, 0.25) // do aigu
    })
  },
  // Pièces gagnées ou dépensées : tintement brillant.
  coin() {
    if (!isSoundOn()) return
    playAsset('coin', 0.35, () => {
      note(1318.51, 0, 0.06, 'triangle', 0.04) // mi aigu
      note(1567.98, 0.06, 0.12, 'triangle', 0.045) // sol aigu
    })
  },
  // Déblocage (badge, chapitre, mode) : notification satisfaisante.
  unlock() {
    if (!isSoundOn()) return
    playAsset('unlock', 0.35, () => {
      note(659.25, 0, 0.1) // mi
      note(1046.5, 0.1, 0.18) // do aigu
    })
  },
  // Ouverture du coffre : cascade scintillante.
  treasure() {
    if (!isSoundOn()) return
    playAsset('treasure', 0.4, () => {
      note(783.99, 0, 0.09) // sol
      note(1046.5, 0.09, 0.09) // do aigu
      note(1318.51, 0.18, 0.2, 'triangle', 0.045) // mi aigu
    })
  },
  // Montée de niveau : envolée triomphante.
  levelUp() {
    if (!isSoundOn()) return
    playAsset('levelUp', 0.35, () => {
      note(523.25, 0, 0.09) // do
      note(783.99, 0.09, 0.09) // sol
      note(1046.5, 0.18, 0.09) // do aigu
      note(1567.98, 0.27, 0.25, 'triangle', 0.04) // sol aigu
    })
  },
  // Journée validée dans la série : carillon chaleureux, deux notes.
  dayComplete() {
    if (!isSoundOn()) return
    note(659.25, 0, 0.12, 'sine', 0.045) // mi
    note(987.77, 0.12, 0.22, 'sine', 0.05) // si
  },
  // Semaine parfaite : fanfare ascendante + étincelle.
  weekComplete() {
    if (!isSoundOn()) return
    note(523.25, 0, 0.09) // do
    note(659.25, 0.09, 0.09) // mi
    note(783.99, 0.18, 0.09) // sol
    note(1046.5, 0.27, 0.12) // do aigu
    note(1318.51, 0.39, 0.3, 'sine', 0.05) // mi aigu
    note(1567.98, 0.5, 0.35, 'triangle', 0.035) // sol aigu, étincelle
  },
}

// ------------------------------------------------------- sons par mode de jeu
// `sfx` ci-dessus est le langage COMMUN de l'app (tap, coin, level-up) : il doit
// sonner pareil partout. Les modes de jeu, eux, ont besoin de l'inverse — une
// couleur qui leur appartient. `gameSfx(timbre)` rend la même palette d'événements
// jouée dans le timbre du mode (partition calculée dans lib/game-audio).

function playTones(tones: ToneSpec[]) {
  if (!isSoundOn()) return
  for (const t of tones) note(t.freq, t.at, t.dur, t.wave, t.peak)
}

export type GameSfx = {
  /** Bonne réponse : monte avec la série. */
  correct: (streak: number) => void
  wrong: () => void
  /** Vie perdue — plus lourd qu'une simple erreur. */
  lifeLost: () => void
  /** Vague / escale / étage franchi. */
  stepCleared: () => void
  /** Tic du chrono ; `urgency` de 0 (calme) à 1 (dernière seconde). */
  tick: (urgency: number) => void
  win: () => void
  lose: () => void
  /** Décompte de départ : 3, 2, 1 puis 0 pour le « GO ». */
  countdown: (n: number) => void
}

export function gameSfx(timbre: GameTimbre): GameSfx {
  return {
    correct: (streak) => playTones(correctTones(timbre, streak)),
    wrong: () => playTones(wrongTones(timbre)),
    lifeLost: () => playTones(lifeLostTones(timbre)),
    stepCleared: () => playTones(stepClearedTones(timbre)),
    tick: (urgency) => playTones([tickTone(timbre, urgency)]),
    win: () => playTones(winTones(timbre)),
    lose: () => playTones(loseTones(timbre)),
    countdown: (n) => playTones([countdownTone(timbre, n)]),
  }
}

// ----------------------------------------------------------- clic de bouton
// Le retour d'appui commun à toute l'app. Joué au POINTERDOWN (cf. lib/press) :
// au relâchement, le son arrive ~80 ms trop tard et le bouton semble mou.

// Un même geste déclenche souvent DEUX retours : `press()` au pointerdown du
// bouton partagé, puis un `sfx.tap()` que le gestionnaire de clic appelait déjà
// de son côté. Sans garde, on entendrait le clic en double — le défaut le plus
// audible qu'on puisse introduire en généralisant un son.
//
// On ne déduplique pas par bouton (impossible à suivre) mais par FENÊTRE : deux
// clics à moins de 150 ms d'intervalle sont le même geste. Taper deux boutons
// différents aussi vite n'arrive pas au doigt.
const CLICK_DEDUPE_MS = 150
let lastClickAt = -Infinity

function claimClick(): boolean {
  const now = Date.now()
  if (now - lastClickAt < CLICK_DEDUPE_MS) return false
  lastClickAt = now
  return true
}

/**
 * Joue le clic d'un bouton : son + vibration, accordés à son importance.
 * Silencieux si l'élève a coupé le son — l'interrupteur couvre aussi la
 * vibration (couper le son en cours, c'est vouloir la discrétion complète).
 */
export function press(intent: PressIntent = 'primary'): void {
  if (!isSoundOn() || !claimClick()) return
  playTones(pressTones(intent))
  const pattern = pressBuzz(intent)
  if (pattern === null || typeof window === 'undefined') return
  const nav = window.navigator as Navigator & {
    vibrate?: (p: number | number[]) => boolean
  }
  if (typeof nav.vibrate !== 'function') return
  try {
    nav.vibrate(pattern)
  } catch {
    // Certains navigateurs lèvent hors geste utilisateur : l'haptique est un
    // bonus, jamais une raison de casser un clic.
  }
}

// Retour HAPTIQUE — le compagnon du son sur mobile (PWA installée), et le plus
// souvent oublié : sur téléphone c'est lui qui donne la sensation « premium ».
// Il suit le même interrupteur que le son (un élève qui coupe le son en cours
// veut la discrétion COMPLÈTE, vibration comprise), et se tait silencieusement
// là où l'API n'existe pas (iOS Safari, bureau).
export function buzz(good: boolean, streak = 0): void {
  if (typeof window === 'undefined' || !isSoundOn()) return
  const nav = window.navigator as Navigator & {
    vibrate?: (p: number | number[]) => boolean
  }
  if (typeof nav.vibrate !== 'function') return
  try {
    nav.vibrate(buzzPattern(good, streak))
  } catch {
    // Certains navigateurs lèvent si l'appel n'est pas lié à un geste : le
    // retour haptique est un bonus, jamais une raison de casser la session.
  }
}
