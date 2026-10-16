// LE JOURNAL D'USAGE, CÔTÉ NAVIGATEUR (16/10/2026, migration 590). Aucun import
// Supabase : les lots partent par la route `/api/evenements`, qui connaît la
// session. Même manière que les erreurs (lib/erreurs-client) : `sendBeacon`
// d'abord (il part même quand la page se ferme), rien n'attend de réponse.
//
// Ce qu'on note, et rien d'autre :
//   session      au lancement : l'appareil (d'après la largeur), l'app installée ou non ;
//   page_vue     chaque écran ouvert (page NORMALISÉE : lib/evenements) ;
//   page_quitte  en le quittant, le temps passé écran VISIBLE ;
//   recherche    une recherche (son texte borné, le nombre de résultats) ;
//   geste        un bouton qui compte (`noterGeste`), avec une cible courte.
// Rien en développement, rien dans la console coach/admin ni les aperçus /dev.

import { appareilDepuisLargeur, creerFile, normaliserPage, nouvelleSession, propsPropres, type Evenement } from '@/lib/evenements'

const CLE_SESSION = 'studuel_session_usage'
const ENVOI_MS = 20_000
const actif = process.env.NODE_ENV === 'production'

const file = creerFile()
let session: string | null = null
let pageCourante: string | null = null
let visibleDepuis: number | null = null
let visibleCumul = 0
let minuterie: ReturnType<typeof setInterval> | null = null

function horsSuivi(chemin: string): boolean {
  return /^\/(admin|coach|dev)(\/|$)/.test(chemin)
}

function maSession(): string {
  if (session) return session
  try {
    const s = sessionStorage.getItem(CLE_SESSION)
    if (s && /^[A-Za-z0-9]{20}$/.test(s)) {
      session = s
      return s
    }
  } catch {
    // Stockage indisponible (navigation privée) : une session par page.
  }
  session = nouvelleSession()
  try {
    sessionStorage.setItem(CLE_SESSION, session)
  } catch {
    // Idem.
  }
  return session
}

function envoyer(): void {
  if (file.taille() === 0) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return
  const lot = file.prendre(50)
  try {
    const corps = JSON.stringify({ session: maSession(), lot })
    if (typeof navigator.sendBeacon === 'function') {
      if (navigator.sendBeacon('/api/evenements', new Blob([corps], { type: 'application/json' }))) return
    }
    void fetch('/api/evenements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corps, keepalive: true }).catch(() => {})
  } catch {
    // Un journal d'usage qui casse l'app serait le comble.
  }
}

function ajouter(e: Omit<Evenement, 't'>): void {
  if (!actif || typeof window === 'undefined') return
  file.ajouter({ ...e, t: new Date().toISOString() })
  if (file.taille() >= 40) envoyer()
}

function tempsVisible(): number {
  return visibleCumul + (visibleDepuis !== null ? Date.now() - visibleDepuis : 0)
}

function quitterPage(): void {
  if (pageCourante === null) return
  const duree = Math.min(tempsVisible(), 2 * 60 * 60 * 1000)
  if (duree >= 500) ajouter({ nom: 'page_quitte', page: pageCourante, duree_ms: Math.round(duree) })
  pageCourante = null
}

/** Un nouvel écran (appelé au démarrage et à chaque navigation du routeur). */
export function noterPage(url: string): void {
  if (!actif || typeof window === 'undefined') return
  let chemin = url
  try {
    chemin = new URL(url, window.location.origin).pathname
  } catch {
    // On garde l'URL telle quelle.
  }
  const page = normaliserPage(chemin)
  if (page === pageCourante) return
  quitterPage()
  if (horsSuivi(chemin)) return
  pageCourante = page
  visibleCumul = 0
  visibleDepuis = document.visibilityState === 'visible' ? Date.now() : null
  ajouter({ nom: 'page_vue', page })
}

/** Une recherche : son texte (borné) et le nombre de résultats. */
export function noterRecherche(texte: string, resultats: number, ou: string): void {
  const t = texte.trim()
  if (t.length < 2) return
  ajouter({ nom: 'recherche', page: normaliserPage(ou), props: propsPropres({ texte: t.toLowerCase(), resultats }) })
}

/** Un geste qui compte (« ouvrir Marcel », « encaisser une quête »…). */
export function noterGeste(nom: string, cible?: string): void {
  ajouter({ nom, page: pageCourante, props: cible ? propsPropres({ cible }) : undefined })
}

/** Le démarrage : la session, l'appareil, puis l'envoi régulier et à la sortie. */
export function demarrerJournal(): void {
  if (!actif || typeof window === 'undefined' || minuterie) return
  const installee =
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  ajouter({ nom: 'session', props: { appareil: appareilDepuisLargeur(window.innerWidth), installee } })
  noterPage(window.location.pathname)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (visibleDepuis !== null) visibleCumul += Date.now() - visibleDepuis
      visibleDepuis = null
      // L'élève quitte l'app (ou la met de côté) : on clôt l'écran et on envoie.
      const page = pageCourante
      quitterPage()
      pageCourante = page
      visibleCumul = 0
      envoyer()
    } else if (pageCourante !== null) {
      visibleDepuis = Date.now()
    }
  })
  window.addEventListener('pagehide', () => {
    quitterPage()
    envoyer()
  })
  minuterie = setInterval(envoyer, ENVOI_MS)
}
