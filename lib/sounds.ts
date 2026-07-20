// Sound design façon Duolingo — micro-feedbacks synthétisés en WebAudio,
// jingles premium (assets Mixkit dans public/sounds/) pour les moments forts.
// Utilisable uniquement côté client ; préférence persistée en localStorage.

import { comboSemitones, comboTier, transpose, buzzPattern } from '@/lib/juice'

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
  // Tap de navigation : à peine audible, juste un retour tactile.
  tap() {
    if (!isSoundOn()) return
    note(880, 0, 0.035, 'triangle', 0.012)
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
