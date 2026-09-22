// « Quand la scène est prête » — le moment où une animation d'accueil peut
// se jouer SOUS LES YEUX de l'élève, et pas derrière le rideau.
//
// POURQUOI. La validation du jour (SerieBar) partait dès l'hydratation : elle
// se jouait entière DERRIÈRE l'écran de chargement (`SplashScreen`, levé
// après le premier écran peint + un fondu de 420 ms + l'arrivée de la scène,
// 560 ms). Quand le rideau se levait, la coche était déjà posée — Lucas,
// 22/09/2026 : « je ne vois pas l'animation ». Même chose sur un onglet en
// arrière-plan : les animations CSS n'y avancent pas.
//
// Ce module attend, dans l'ordre : le premier écran peint (`onAppReady`), le
// rideau démonté (`.splash` absent du DOM) et la scène arrivée (`body` sans
// `hub-entering`), puis l'onglet VISIBLE — et seulement alors rappelle.
// Sans rideau (navigation entre onglets), tout est déjà vrai : le rappel part
// après un court temps de pose. Un plafond évite d'attendre pour toujours si
// le rideau ne se démonte jamais (onglet caché depuis le lancement).
//
// Client uniquement (DOM). Testé dans scene-prete.test.ts (jsdom).

import { onAppReady } from '@/lib/app-ready'

/** Le temps de pose une fois la scène en place : l'œil arrive avant l'animation. */
export const POSE_MS = 250
/** Le pas de vérification du rideau. */
const PAS_MS = 100
/** Au-delà, on n'attend plus le rideau : il ne partira pas. */
export const PLAFOND_MS = 4000

function rideauParti(): boolean {
  return (
    document.querySelector('.splash') === null &&
    !document.body.classList.contains('hub-entering')
  )
}

function ongletVisible(): boolean {
  return document.visibilityState !== 'hidden'
}

/**
 * Rappelle `fn` quand la scène est prête et l'onglet visible. Renvoie la
 * fonction d'annulation, à appeler au démontage : après elle, `fn` ne part
 * jamais.
 */
export function quandLaScenePrete(fn: () => void): () => void {
  let annule = false
  let timer: number | undefined
  let ecouteVisibilite: (() => void) | undefined

  const attendreVisible = () => {
    if (annule) return
    if (ongletVisible()) {
      fn()
      return
    }
    ecouteVisibilite = () => {
      if (!ongletVisible()) return
      document.removeEventListener('visibilitychange', ecouteVisibilite as () => void)
      ecouteVisibilite = undefined
      if (!annule) fn()
    }
    document.addEventListener('visibilitychange', ecouteVisibilite)
  }

  const attendreRideau = () => {
    const debut = Date.now()
    const verifier = () => {
      if (annule) return
      if (rideauParti() || Date.now() - debut > PLAFOND_MS) {
        timer = window.setTimeout(attendreVisible, POSE_MS)
        return
      }
      timer = window.setTimeout(verifier, PAS_MS)
    }
    verifier()
  }

  const desabonner = onAppReady(attendreRideau)

  return () => {
    annule = true
    desabonner()
    if (timer !== undefined) window.clearTimeout(timer)
    if (ecouteVisibilite) document.removeEventListener('visibilitychange', ecouteVisibilite)
  }
}
