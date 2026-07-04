// Sound design façon Duolingo — tons synthétisés en WebAudio, aucun asset.
// Utilisable uniquement côté client ; préférence persistée en localStorage.

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
  // Mauvaise réponse : buzz grave, bref.
  wrong() {
    if (!isSoundOn()) return
    note(196, 0, 0.16, 'sawtooth', 0.03)
  },
  // Session terminée : arpège victorieux.
  complete() {
    if (!isSoundOn()) return
    note(523.25, 0, 0.1) // do
    note(659.25, 0.1, 0.1) // mi
    note(783.99, 0.2, 0.1) // sol
    note(1046.5, 0.3, 0.25) // do aigu
  },
}
