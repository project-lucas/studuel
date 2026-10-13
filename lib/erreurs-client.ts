// L'ENVOI D'UN RAPPORT D'ERREUR, CÔTÉ NAVIGATEUR. Aucun import Supabase : le
// rapport part par la route `/api/erreurs`, qui connaît la session.
//
// `sendBeacon` d'abord : il part même si la page se ferme (c'est souvent le
// cas après un plantage : l'élève recharge), et il ne bloque rien. À défaut,
// un `fetch` en `keepalive`. Ni l'un ni l'autre n'attend de réponse — un
// rapport perdu n'est pas grave, un rapport qui gêne l'élève le serait.

import { creerLimiteur, estBruit, rapportDepuis, type ValeurContexte } from '@/lib/erreurs'

const limiteur = creerLimiteur()

/** La dernière navigation du routeur (posée par instrumentation-client.ts). */
let derniereNavigation: string | null = null

export function noterNavigation(url: string): void {
  derniereNavigation = url
}

/**
 * Signale une erreur. Se tait : en double, au-delà du plafond, hors
 * connexion (rien ne partirait), ou pour le bruit du navigateur.
 */
export function signalerErreur(e: unknown, contexte: Record<string, ValeurContexte> = {}): void {
  if (typeof window === 'undefined') return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return
  try {
    const rapport = rapportDepuis(e, 'navigateur', {
      url: window.location.pathname + window.location.search,
      contexte: { ...contexte, navigation: derniereNavigation },
    })
    if (estBruit(rapport)) return
    if (!limiteur.accepte(rapport)) return
    const corps = JSON.stringify(rapport)
    if (typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon('/api/erreurs', new Blob([corps], { type: 'application/json' }))
      if (ok) return
    }
    void fetch('/api/erreurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: corps,
      keepalive: true,
    }).catch(() => {
      // Le réseau a lâché : rien à faire de plus, on ne relance pas.
    })
  } catch {
    // Un rapporteur d'erreurs qui lève une erreur serait le comble.
  }
}
