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
import { getVolume, subscribeVolume } from '@/lib/volumes'
import type { NavIconName } from '@/lib/nav-tabs'

export const PISTES = ['arene', 'combat', 'victoire'] as const
export type Piste = (typeof PISTES)[number]

// ------------------------------------------------------------------ thèmes
//
// LE THÈME DE FOND AU CHOIX (05/11/2026, Lucas : « avoir la possibilité de
// changer de musique, même si celle-ci est très bien »). Il ne change que la
// piste de FOND (`arene` : Défi, Amis, Moi, Boutique) ; le combat et la
// victoire restent les mêmes pour tous. Les morceaux sont composés par
// scripts/musiques-themes.mjs, dans le même univers que la cour d'honneur.

export const THEMES = [
  { id: 'cour', titre: 'La cour d’honneur', court: 'Académie' },
  { id: 'rempart', titre: 'Le rempart', court: 'Rempart' },
  { id: 'taverne', titre: 'La taverne', court: 'Taverne' },
] as const
export type Theme = (typeof THEMES)[number]['id']
export const THEME_DEFAUT: Theme = 'cour'

/** Le thème lu du stockage ; le défaut si absent ou inconnu. Pure. */
export function lireTheme(brut: string | null): Theme {
  return THEMES.find((t) => t.id === brut)?.id ?? THEME_DEFAUT
}

// ------------------------------------------------------------------ onglets
//
// LA MUSIQUE ONGLET PAR ONGLET (05/11/2026, Lucas : « les icônes des onglets :
// il clique, l'icône a une couleur, la musique est écoutable dans l'onglet ;
// s'il rappuie, elle devient grise »). Par défaut partout SAUF Réviser (on y
// lit) ; l'élève en allume ou en coupe un, deux… les cinq.

export type OngletMusique = NavIconName
const ONGLETS: readonly OngletMusique[] = ['tresor', 'reviser', 'defi', 'amis', 'moi']
export const ONGLETS_MUSIQUE_DEFAUT: readonly OngletMusique[] = ['tresor', 'defi', 'amis', 'moi']

/** Les onglets où la musique joue, lus du stockage ; le défaut si absent ou illisible. Pure. */
export function lireOngletsMusique(brut: string | null): OngletMusique[] {
  if (brut === null) return [...ONGLETS_MUSIQUE_DEFAUT]
  try {
    const v: unknown = JSON.parse(brut)
    if (!Array.isArray(v)) return [...ONGLETS_MUSIQUE_DEFAUT]
    return ONGLETS.filter((o) => v.includes(o))
  } catch {
    return [...ONGLETS_MUSIQUE_DEFAUT]
  }
}

/** Allume ou coupe un onglet ; rend une NOUVELLE liste, dans l'ordre de la barre. Pure. */
export function basculerOngletMusique(liste: readonly OngletMusique[], onglet: OngletMusique): OngletMusique[] {
  const allume = liste.includes(onglet)
  return ONGLETS.filter((o) => (o === onglet ? !allume : liste.includes(o)))
}

export function adressePiste(piste: Piste, theme: Theme = THEME_DEFAUT): string {
  if (piste === 'arene' && theme !== THEME_DEFAUT) return `/music/arene-${theme}.mp3`
  return `/music/${piste}.mp3`
}

// ------------------------------------------------------------------ réglage

const CLE_REGLAGE = 'studuel-musique'
const CLE_THEME = 'studuel-theme-musique'
const CLE_ONGLETS = 'studuel-musique-onglets'
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

export function getTheme(): Theme {
  if (typeof window === 'undefined') return THEME_DEFAUT
  try {
    return lireTheme(window.localStorage.getItem(CLE_THEME))
  } catch {
    return THEME_DEFAUT
  }
}

export function getThemeServer(): Theme {
  return THEME_DEFAUT
}

export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(CLE_THEME, theme)
  } catch {
    // Stockage bloqué : le thème vaut pour la session.
  }
  for (const a of abonnes) a()
  appliquer()
}

function lireOngletsStockes(): OngletMusique[] {
  if (typeof window === 'undefined') return [...ONGLETS_MUSIQUE_DEFAUT]
  try {
    return lireOngletsMusique(window.localStorage.getItem(CLE_ONGLETS))
  } catch {
    return [...ONGLETS_MUSIQUE_DEFAUT]
  }
}

/** La musique de fond joue-t-elle dans cet onglet ? (snapshot booléen, stable) */
export function musiqueDansOnglet(onglet: OngletMusique): boolean {
  return lireOngletsStockes().includes(onglet)
}

export function basculerMusiqueOnglet(onglet: OngletMusique): void {
  try {
    window.localStorage.setItem(CLE_ONGLETS, JSON.stringify(basculerOngletMusique(lireOngletsStockes(), onglet)))
  } catch {
    // Stockage bloqué : rien à retenir.
  }
  for (const a of abonnes) a()
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
    if (e.key === null || e.key === CLE_REGLAGE || e.key === CLE_THEME || e.key === CLE_ONGLETS) abonne()
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
// Un lecteur par ADRESSE (et non par piste) : deux thèmes de fond sont deux
// fichiers.
const lecteurs = new Map<string, Lecteur>()
let enCours: { demande: Demande; lecteur: Lecteur; adresse: string } | null = null

/** Le niveau de la musique : le plafond de l'app × le curseur « Musique » (lib/volumes). */
function niveau(base = VOLUME): number {
  return base * getVolume('musique')
}
let attenteGeste = false
let ecoutesInstallees = false

function lecteur(adresse: string): Lecteur {
  const deja = lecteurs.get(adresse)
  if (deja) return deja
  const el = new Audio(adresse)
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
  lecteurs.set(adresse, l)
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
  const adresse = cible?.piste ? adressePiste(cible.piste, getTheme()) : null
  if (enCours && cible && enCours.adresse === adresse && (cible.boucle || enCours.demande.id === cible.id)) {
    enCours = { ...enCours, demande: cible }
    return
  }
  if (enCours) {
    arreter(enCours.lecteur, fondu)
    enCours = null
  }
  if (!cible || !adresse) return
  if (!aDejaInteragi()) {
    attendreGeste()
    return
  }
  const l = lecteur(adresse)
  l.el.loop = cible.boucle
  if (!cible.boucle || l.el.ended) l.el.currentTime = 0
  enCours = { demande: cible, lecteur: l, adresse }
  // `play()` rend une promesse (refus possible hors geste) ; certains
  // environnements (jsdom, vieux navigateurs) rendent `undefined` ou lèvent.
  new Promise<void>((ok) => ok(l.el.play())).then(
    () => rampe(l, niveau(), FONDU_S),
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
  // Le curseur « Musique » bouge : la piste en cours suit aussitôt.
  subscribeVolume(() => {
    if (enCours) rampe(enCours.lecteur, niveau(), 0.15)
  })
}

let finAttenuation = 0

/** Baisse la musique le temps d'un gros bruitage, puis la remonte. */
export function attenuerMusique(secondes: number): void {
  if (!enCours) return
  const l = enCours.lecteur
  rampe(l, niveau(VOLUME_ATTENUE), 0.08)
  const fin = performance.now() + secondes * 1000
  finAttenuation = Math.max(finAttenuation, fin)
  window.setTimeout(() => {
    if (performance.now() + 20 < finAttenuation) return
    if (enCours?.lecteur === l) rampe(l, niveau(), 0.5)
  }, secondes * 1000)
}
