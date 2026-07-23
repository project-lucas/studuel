// Le RESSENTI DU CLIC — la partition d'un bouton pressé. Pur, sans React.
//
// Un bouton qui répond bien, ce sont trois choses qui arrivent ENSEMBLE et
// TÔT : un enfoncement visible, un bruit court, une micro-vibration. Les jeux
// mobiles qui « sonnent premium » (Clash Royale en tête) ne font pas autre
// chose — ils le font juste partout, pareil, et dès l'appui.
//
// Deux principes qui décident de tout :
//
// 1. **Au POINTERDOWN, pas au click.** Le son au relâchement arrive ~80 ms trop
//    tard et le bouton semble mou. On joue à l'appui : c'est ce décalage-là,
//    et lui seul, qui sépare « ça réagit » de « ça traîne ».
// 2. **L'intensité suit l'importance.** Un bouton d'action principale claque ;
//    une croix de fermeture chuchote. Tout faire claquer fatigue au bout de
//    trois minutes — c'est le piège classique du sound design de bouton.
import type { ToneSpec } from '@/lib/game-audio'

/** Ce que le bouton « pèse » dans l'interface. */
export type PressIntent =
  /** L'action principale de l'écran (GO, Valider, Jouer). Le plus charnu. */
  | 'primary'
  /** Un bouton ordinaire (secondaire, contour, onglet). */
  | 'neutral'
  /** Discret : fantôme, lien, chevron. Se remarque à peine. */
  | 'quiet'
  /** Destructif ou risqué : plus grave, on veut une seconde d'hésitation. */
  | 'danger'
  /** Retour, fermeture, annulation : une descente, pas une frappe. */
  | 'back'

/**
 * Le « thock » d'un bouton : un corps court, un coup grave juste derrière, et
 * pour les boutons importants un transitoire aigu qui donne le claquant.
 * Trois notes maximum — au-delà on entend un accord, pas un clic.
 */
export function pressTones(intent: PressIntent): ToneSpec[] {
  switch (intent) {
    case 'primary':
      return [
        // Transitoire : la « peau » du clic, très court et très bas en volume.
        { freq: 1480, at: 0, dur: 0.018, wave: 'triangle', peak: 0.012 },
        // Corps : ce qu'on entend vraiment.
        { freq: 320, at: 0, dur: 0.045, wave: 'square', peak: 0.02 },
        // Coup grave : le poids. C'est lui qui rend l'appui satisfaisant.
        { freq: 180, at: 0.02, dur: 0.07, wave: 'sine', peak: 0.032 },
      ]
    case 'neutral':
      return [
        { freq: 420, at: 0, dur: 0.032, wave: 'triangle', peak: 0.016 },
        { freq: 260, at: 0.018, dur: 0.05, wave: 'sine', peak: 0.022 },
      ]
    case 'quiet':
      // Une seule note, à la limite de l'audible : sur une liste de dix
      // chevrons, tout ce qui dépasse devient du bruit.
      return [{ freq: 900, at: 0, dur: 0.028, wave: 'triangle', peak: 0.011 }]
    case 'danger':
      return [
        { freq: 220, at: 0, dur: 0.05, wave: 'sawtooth', peak: 0.016 },
        { freq: 148, at: 0.03, dur: 0.09, wave: 'sine', peak: 0.024 },
      ]
    case 'back':
      // Deux notes qui DESCENDENT : l'oreille entend « on recule » sans qu'on
      // ait à l'écrire nulle part.
      return [
        { freq: 540, at: 0, dur: 0.03, wave: 'triangle', peak: 0.014 },
        { freq: 360, at: 0.026, dur: 0.055, wave: 'sine', peak: 0.018 },
      ]
  }
}

/**
 * Vibration de l'appui, en millisecondes (ou motif). Volontairement plus courte
 * que celle d'une bonne réponse : un bouton se presse des dizaines de fois par
 * session, une vibration trop longue devient une nuisance physique.
 */
export function pressBuzz(intent: PressIntent): number | number[] | null {
  switch (intent) {
    case 'primary':
      return 14
    case 'neutral':
      return 9
    case 'quiet':
      // Rien : un chevron ne mérite pas de faire vibrer un téléphone.
      return null
    case 'danger':
      return [8, 26, 8]
    case 'back':
      return 7
  }
}

/**
 * Profondeur du socle 3D, en pixels. C'est la hauteur dont le bouton
 * « descend » à l'appui — donc l'épaisseur visible de son épaisseur.
 * `0` = bouton plat (fantôme, lien) : pas de socle, pas d'enfoncement.
 */
export function pressDepth(intent: PressIntent): number {
  switch (intent) {
    case 'primary':
      return 4
    case 'neutral':
    case 'danger':
      return 3
    case 'quiet':
    case 'back':
      return 0
  }
}

/** Les variantes du bouton partagé (components/ui/button.tsx). */
export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'

/**
 * L'intention d'une variante. Une seule table, pour que le son, la vibration et
 * la profondeur ne puissent pas se contredire d'un bouton à l'autre.
 */
export function intentOfVariant(variant: ButtonVariant | undefined): PressIntent {
  switch (variant) {
    case 'destructive':
      return 'danger'
    case 'ghost':
    case 'link':
      return 'quiet'
    case 'secondary':
    case 'outline':
      return 'neutral'
    case 'default':
    default:
      return 'primary'
  }
}
