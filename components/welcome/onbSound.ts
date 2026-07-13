// Petit « pop » de sélection synthétisé à la volée (Web Audio), sans aucun asset.
// Joué à chaque appui sur une carte de choix de l'onboarding. Client-only :
// l'AudioContext est créé paresseusement, au premier geste utilisateur, ce qui
// respecte les politiques d'autoplay des navigateurs.

let ctx: AudioContext | null = null

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
  if (!AC) return null
  ctx ??= new AC()
  return ctx
}

// `pitch` (0.9 → 1.15) permet de varier légèrement la note selon l'élément,
// pour que ça sonne vivant plutôt que robotique.
export function playPop(pitch = 1): void {
  try {
    const audio = getContext()
    if (!audio) return
    // Un contexte suspendu (première interaction) se réveille dans le geste.
    if (audio.state === 'suspended') void audio.resume()

    const now = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(430 * pitch, now)
    osc.frequency.exponentialRampToValueAtTime(720 * pitch, now + 0.09)

    // Enveloppe courte : attaque rapide puis extinction ~160 ms.
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)

    osc.connect(gain).connect(audio.destination)
    osc.start(now)
    osc.stop(now + 0.18)
  } catch {
    // Audio indisponible (permission, contexte fermé…) : on n'interrompt jamais
    // le parcours pour un effet sonore.
  }
}
