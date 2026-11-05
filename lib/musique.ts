// LA MUSIQUE DE STUDUEL (05/11/2026, docs/CADRAGE-DOPAMINE.md § 1).
//
// TROIS PISTES SEULEMENT : l'arène (fond doux), le combat (duel classé et
// gardiens), la victoire. Rien dans Réviser : on y lit, on y réfléchit.
//
// UNE PILE DE DEMANDES. Chaque écran qui veut une musique la demande en se
// montant et la rend en se démontant (`MusiqueDeFond`) ; c'est la DERNIÈRE
// demande qui joue. Une demande peut être le silence (`null`) : la défaite.
// Avec les onglets gardés vivants, un onglet masqué démonte ses effets — sa
// musique s'arrête toute seule.
//
// RÈGLES : un réglage à part des effets (`studuel-musique`) ; jamais de note
// avant le premier tap (on attend le geste) ; la musique se tait quand l'app
// passe en arrière-plan ; elle se baisse sous un gros bruitage (coffre,
// flash) ; elle passe par un GainNode — iOS ignore `volume` sur un <audio>.

import { aDejaInteragi, audioContexte } from '@/lib/audio-contexte'

export const PISTES = ['arene', 'combat', 'victoire'] as const
export type Piste = (typeof PISTES)[number]

export function adressePiste(piste: Piste): string {
  return `/music/${piste}.mp3`
}

// ------------------------------------------------------------------ réglage

const CLE_REGLAGE = 'studuel-musique'
type Abonne = () => void
const abonnes = new Set<Abonne>()

export function isMusiqueOn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(CLE_REGLAGE) !== 'off'
  } catch {
    return true
  }
}

export function setMusiqueOn(on: boolean): void {
  try {
    window.localStorage.setItem(CLE_REGLAGE, on ? 'on' : 'off')
  } catch {
    // Stockage bloqué : le réglage vaut pour la session.
  }
  for (const a of abonnes) a()
  appliquer()
}

/** Contrat `useSyncExternalStore`. */
export function subscribeMusique(abonne: Abonne): () => void {
  abonnes.add(abonne)
  const surStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CLE_REGLAGE) abonne()
  }
  window.addEventListener('storage', surStorage)
  return () => {
    abonnes.delete(abonne)
    window.removeEventListener('storage', surStorage)
  }
}

export function getMusiqueOnServer(): boolean {
  return false
}

// ------------------------------------------------------------------ la pile

export type Demande = { id: number; piste: Piste | null; boucle: boolean }

/** Ce qui doit jouer, ou `null` pour le silence. Pure, testée. */
export function cibleMusique(etat: {
  pile: readonly Demande[]
  silenceForce: boolean
  reglage: boolean
  visible: boolean
}): Demande | null {
  if (etat.silenceForce || !etat.reglage || !etat.visible) return null
  const tete = etat.pile[etat.pile.length - 1]
  return tete && tete.piste ? tete : null
}

let pile: Demande[] = []
let prochainId = 1
let silenceForce = false

/**
 * Demande une piste (ou le silence) ; rend la fonction qui la retire. Une
 * nouvelle demande lève le silence imposé par l'entrée en combat.
 */
export function demanderMusique(piste: Piste | null, options: { boucle?: boolean } = {}): () => void {
  const demande: Demande = { id: prochainId++, piste, boucle: options.boucle ?? true }
  pile = [...pile, demande]
  silenceForce = false
  installerEcoutes()
  appliquer()
  return () => {
    pile = pile.filter((d) => d.id !== demande.id)
    appliquer()
  }
}

/** Coupe net la musique en cours jusqu'à la prochaine demande (le blanc de l'entrée en combat). */
export function couperMusique(): void {
  silenceForce = true
  appliquer(0.15)
}

/** Lève le silence imposé (l'entrée en combat n'a pas abouti). */
export function reprendreMusique(): void {
  silenceForce = false
  appliquer()
}

// ------------------------------------------------------------------ lecture

const VOLUME = 0.45
const VOLUME_ATTENUE = 0.15
const FONDU_S = 0.6

type Lecteur = { el: HTMLAudioElement; gain: GainNode | null }
const lecteurs = new Map<Piste, Lecteur>()
let enCours: { demande: Demande; lecteur: Lecteur } | null = null
let attenteGeste = false
let ecoutesInstallees = false

function lecteur(piste: Piste): Lecteur {
  const deja = lecteurs.get(piste)
  if (deja) return deja
  const el = new Audio(adressePiste(piste))
  el.preload = 'auto'
  let gain: GainNode | null = null
  const audio = audioContexte()
  if (audio) {
    try {
      gain = audio.createGain()
      gain.gain.value = 0
      audio.createMediaElementSource(el).connect(gain).connect(audio.destination)
    } catch {
      gain = null
    }
  }
  const l = { el, gain }
  lecteurs.set(piste, l)
  return l
}

function rampe(l: Lecteur, vers: number, secondes: number): void {
  const audio = audioContexte()
  if (l.gain && audio) {
    const t = audio.currentTime
    l.gain.gain.cancelScheduledValues(t)
    l.gain.gain.setValueAtTime(l.gain.gain.value, t)
    l.gain.gain.linearRampToValueAtTime(vers, t + Math.max(0.01, secondes))
  } else {
    l.el.volume = vers
  }
}

function arreter(l: Lecteur, fondu: number): void {
  rampe(l, 0, fondu)
  window.setTimeout(() => {
    if (enCours?.lecteur !== l) l.el.pause()
  }, fondu * 1000 + 50)
}

function appliquer(fondu = FONDU_S): void {
  if (typeof window === 'undefined') return
  const cible = cibleMusique({
    pile,
    silenceForce,
    reglage: isMusiqueOn(),
    visible: document.visibilityState !== 'hidden',
  })
  if (enCours && cible && enCours.demande.piste === cible.piste && (cible.boucle || enCours.demande.id === cible.id)) {
    enCours = { ...enCours, demande: cible }
    return
  }
  if (enCours) {
    arreter(enCours.lecteur, fondu)
    enCours = null
  }
  if (!cible || !cible.piste) return
  if (!aDejaInteragi()) {
    attendreGeste()
    return
  }
  const l = lecteur(cible.piste)
  l.el.loop = cible.boucle
  if (!cible.boucle || l.el.ended) l.el.currentTime = 0
  enCours = { demande: cible, lecteur: l }
  // `play()` rend une promesse (refus possible hors geste) ; certains
  // environnements (jsdom, vieux navigateurs) rendent `undefined` ou lèvent.
  new Promise<void>((ok) => ok(l.el.play())).then(
    () => rampe(l, VOLUME, FONDU_S),
    () => {
      // Refus du navigateur (pas encore de geste) : on retentera au tap.
      if (enCours?.lecteur === l) enCours = null
      attendreGeste()
    },
  )
}

function attendreGeste(): void {
  if (attenteGeste) return
  attenteGeste = true
  const surGeste = () => {
    attenteGeste = false
    window.removeEventListener('pointerdown', surGeste, true)
    window.removeEventListener('keydown', surGeste, true)
    audioContexte()
    appliquer()
  }
  window.addEventListener('pointerdown', surGeste, true)
  window.addEventListener('keydown', surGeste, true)
}

function installerEcoutes(): void {
  if (ecoutesInstallees || typeof document === 'undefined') return
  ecoutesInstallees = true
  // L'app en arrière-plan (autre appli, écran verrouillé) se tait aussitôt.
  document.addEventListener('visibilitychange', () => appliquer(0.2))
}

let finAttenuation = 0

/** Baisse la musique le temps d'un gros bruitage, puis la remonte. */
export function attenuerMusique(secondes: number): void {
  if (!enCours) return
  const l = enCours.lecteur
  rampe(l, VOLUME_ATTENUE, 0.08)
  const fin = performance.now() + secondes * 1000
  finAttenuation = Math.max(finAttenuation, fin)
  window.setTimeout(() => {
    if (performance.now() + 20 < finAttenuation) return
    if (enCours?.lecteur === l) rampe(l, VOLUME, 0.5)
  }, secondes * 1000)
}
