// Le SOUND DESIGN de l'INTERFACE — la partition des gestes de navigation (retour,
// balayage, ouverture, rebond, « Battle »), pas des jeux. Pur : aucun WebAudio
// ici, on ne fait que CALCULER des ToneSpec que lib/sounds.ts joue. Pur ⇒ testable.
//
// Parti pris, façon Clash Royale : chaque geste a son bruit — court, choisi, et
// surtout COHÉRENT avec les autres. On reste dans le même moteur à oscillateurs
// que tout le reste de l'app (aucun asset à charger) : un « whoosh » se dessine
// donc en ESCALIER de notes qui se recouvrent plutôt qu'en bruit filtré — ça
// suffit largement à l'oreille et ça garde la palette unie.
import type { ToneSpec } from '@/lib/game-audio'

/**
 * Plafond de gain de l'UI : au-delà, un feedback cesse d'être discret et devient
 * de la musique. Sert de garde-fou (et d'invariant testé) — le seul son autorisé
 * à s'en approcher est le coup grave du « MATCH CLASSÉ ».
 */
export const UI_MAX_PEAK = 0.06

/**
 * Ouverture d'un dossier de matières OU entrée dans un mode de jeu : un petit
 * « pwip » qui monte. Assez charnu pour dire « ça s'ouvre », assez court pour se
 * répéter sans lasser. Le MÊME son pour les deux gestes : ouvrir un dossier et
 * lancer un mode, c'est le même mouvement, ça doit sonner pareil.
 */
export function openTones(): ToneSpec[] {
  return [
    // Corps : le petit poids de l'appui.
    { freq: 300, at: 0, dur: 0.045, wave: 'sine', peak: 0.02 },
    // La montée en deux notes : c'est elle qui dit « ça s'ouvre ».
    { freq: 560, at: 0.02, dur: 0.06, wave: 'triangle', peak: 0.03 },
    { freq: 740, at: 0.06, dur: 0.08, wave: 'triangle', peak: 0.026 },
  ]
}

// ------------------------------------------------------------------- balayage
const SWIPE_STEPS = 7
const SWIPE_LO = 380
const SWIPE_HI = 900

/**
 * Balayage entre onglets : un souffle court et directionnel. Il MONTE quand on
 * va vers l'onglet suivant, DESCEND quand on revient — l'oreille entend le sens
 * du geste sans qu'on ait à l'écrire. Dessiné en escalier de notes douces qui se
 * recouvrent (glissando) et à très bas volume : un swish, pas une mélodie.
 */
export function swipeTones(direction: 'up' | 'down'): ToneSpec[] {
  const tones: ToneSpec[] = []
  for (let i = 0; i < SWIPE_STEPS; i++) {
    const t = i / (SWIPE_STEPS - 1) // 0 → 1
    const freq =
      direction === 'up'
        ? SWIPE_LO + (SWIPE_HI - SWIPE_LO) * t
        : SWIPE_HI - (SWIPE_HI - SWIPE_LO) * t
    tones.push({ freq, at: i * 0.016, dur: 0.05, wave: 'sine', peak: 0.014 })
  }
  return tones
}

/**
 * Rebond d'extrémité (rubber-band) : le petit « bwomp » grave quand on tire une
 * liste au-delà de son haut ou de son bas. Joué UNE seule fois par geste (garanti
 * par l'appelant) — un tic en continu pendant le défilement fatiguerait vite,
 * c'est pour ça que Clash Royale ne sonne qu'au rebond, pas au scroll.
 */
export function edgeBumpTones(): ToneSpec[] {
  return [
    { freq: 150, at: 0, dur: 0.07, wave: 'sine', peak: 0.03 },
    { freq: 110, at: 0.05, dur: 0.12, wave: 'sine', peak: 0.024 },
  ]
}

/**
 * Le bouton « MATCH CLASSÉ » — le « Battle! » de l'arène, et le SEUL son épique
 * de l'app. Une levée de cuivres (dents de scie) puis un accord plaqué
 * root-quinte-octave posé sur un coup grave : « ba-DAA ». Volontairement plus
 * fort et plus long que tout le reste — c'est LE moment, il doit trancher.
 */
export function battleTones(): ToneSpec[] {
  return [
    // « ba » : la levée, une seule note qui appelle le coup.
    { freq: 196.0, at: 0, dur: 0.09, wave: 'sawtooth', peak: 0.03 },
    // « DAA » : l'accord de cuivres, root-quinte-octave (do-sol-do).
    { freq: 261.63, at: 0.1, dur: 0.32, wave: 'sawtooth', peak: 0.03 },
    { freq: 392.0, at: 0.1, dur: 0.32, wave: 'sawtooth', peak: 0.026 },
    { freq: 523.25, at: 0.1, dur: 0.3, wave: 'sawtooth', peak: 0.022 },
    // Le coup grave : le poids qui rend le hit « épique ». Le plus fort de l'app.
    { freq: 65.41, at: 0.1, dur: 0.36, wave: 'sine', peak: 0.055 },
  ]
}
