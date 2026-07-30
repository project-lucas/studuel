// Écran de chargement (splash) — logique pure.
//
// Le visuel (public/images/splash.webp) ne porte AUCUN texte : le wordmark,
// l'astuce du jour et la barre sont rendus par l'app par-dessus l'image. C'est
// ce qui permet de changer une astuce sans regénérer l'illustration.

// ------------------------------------------------------------ astuce du jour
// Façon Clash Royale (« Le golem a un cœur de pierre ») : une phrase courte,
// tournée vers le jeu, qui apprend une règle en passant. Deux familles : les
// boss (on tease le mode Boss) et les habitudes de révision.

export const SPLASH_TIPS: readonly string[] = [
  'Grammatork ne dévore que les participes mal accordés.',
  'Imperator ne pardonne aucune date approximative.',
  'Big Ben pose ses questions entre deux gorgées de thé.',
  'Krach mise gros sur tes hésitations.',
  'El Toro charge dès que tu doutes.',
  'Sylvarok repousse plus vite que tes révisions.',
  'Nox se nourrit des chapitres jamais ouverts.',
  'Une carte ratée revient le lendemain. Toujours.',
  'Dix minutes par jour battent deux heures le dimanche.',
  'Le mode du jour rapporte deux fois plus d’XP.',
  'Un duel de 90 secondes, c’est déjà une révision.',
  'La série se garde en révisant, pas en ouvrant l’app.',
]

/**
 * Astuce du jour : déterministe sur la clé UTC 'YYYY-MM-DD' (même formule que
 * `featuredModeId`). Serveur et client affichent la même — sans quoi React
 * signale une différence d'hydratation sur le tout premier écran de l'app.
 */
export function tipOfDay(dayKey: string): string {
  const days = Math.floor(Date.parse(`${dayKey}T00:00:00Z`) / 86_400_000)
  if (!Number.isFinite(days)) return SPLASH_TIPS[0]
  const n = SPLASH_TIPS.length
  return SPLASH_TIPS[((days % n) + n) % n]
}

// ------------------------------------------------------- où le rideau s'ouvre
// Un écran de chargement de jeu est un RIDEAU, pas un indicateur d'attente : il
// s'ouvre une fois, au lancement, et il s'ouvre SUR LE JEU. Le jouer devant le
// formulaire de connexion ou l'onboarding brûlerait le seul moment où l'on a
// toute l'attention de l'élève sur quelqu'un qui n'est pas encore joueur — et
// ferait lever le rideau sur un champ e-mail.

/** Chemins hors du « jeu » : le rideau n'y joue pas. */
const OUTSIDE_GAME_PREFIXES = [
  '/bienvenue',
  '/onboarding',
  '/login',
  '/auth',
  '/parents',
  '/admin',
] as const

/**
 * L'écran de chargement doit-il jouer pour ce chargement à froid ?
 *
 * Appelée côté SERVEUR (layout racine, `x-pathname` posé par proxy.ts) : le
 * composant n'est même pas monté quand elle dit non. Aucune garde client n'est
 * nécessaire en plus — le layout racine n'est pas re-rendu en navigation
 * client, donc le rideau ne peut pas rejouer d'un onglet à l'autre, ce qui est
 * exactement la règle voulue : un rideau par lancement.
 */
export function shouldShowSplash(
  pathname: string,
  isSignedIn: boolean,
): boolean {
  if (!isSignedIn) return false
  return !OUTSIDE_GAME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

// ------------------------------------------------- quand le rideau peut lever
// Le péché capital d'un écran de chargement : afficher 100 % puis s'ouvrir sur
// des squelettes. « Document chargé » ne veut pas dire « écran prêt » — le
// bandeau du haut arrive en flux (Suspense) APRÈS l'événement `load`. On attend
// donc les deux, avec un plafond de sécurité pour ne jamais retenir l'élève
// prisonnier si un signal manque (bandeau masqué, erreur réseau…).

/** Au-delà, le rideau lève quoi qu'il arrive : mieux vaut un squelette qu'un mur. */
export const SPLASH_READY_CAP_MS = 4000

/** L'app est-elle réellement prête à être révélée ? */
export function isSplashReady(state: {
  /** L'événement `load` du document est passé. */
  documentLoaded: boolean
  /** Le premier écran a signalé qu'il est peint (AppReadyBeacon). */
  appReady: boolean
  /** Temps écoulé depuis l'affichage du rideau (ms). */
  elapsedMs: number
}): boolean {
  if (state.elapsedMs >= SPLASH_READY_CAP_MS) return true
  return state.documentLoaded && state.appReady
}

// -------------------------------------------------------- barre de chargement
// Une barre honnête est impossible : le navigateur ne donne pas de « % de
// l'app chargée ». On fait comme les jeux — une courbe qui ralentit en
// approchant du but et qui n'atteint 100 % que lorsque l'app est réellement
// prête. Elle ne recule jamais et ne ment jamais sur la fin.

/** Durée avant que la barre n'atteigne son plafond d'attente (ms). */
export const SPLASH_RAMP_MS = 2200
/** Plafond tant que l'app n'est pas prête : on garde les 8 derniers % pour elle. */
export const SPLASH_WAIT_CEILING = 92
/**
 * Durée d'affichage minimale (ms). 900 ms était un flash : l'astuce du jour
 * n'avait pas le temps d'être lue, donc on payait le coût d'un écran de
 * chargement sans en encaisser le bénéfice — apprendre une chose au passage.
 * Les jeux qui font ça bien tiennent 1,5 à 2,5 s.
 */
export const SPLASH_MIN_MS = 1700

/**
 * Avancement affiché (0 → 100) après `elapsedMs` d'attente.
 *
 * Tant que `ready` est faux, la courbe monte vite puis s'aplatit sous le
 * plafond (ease-out) ; dès que l'app est prête ET la durée minimale écoulée,
 * elle file à 100.
 */
export function splashProgress(elapsedMs: number, ready: boolean): number {
  if (ready && elapsedMs >= SPLASH_MIN_MS) return 100
  const t = Math.min(1, Math.max(0, elapsedMs / SPLASH_RAMP_MS))
  const eased = 1 - Math.pow(1 - t, 3) // ease-out cubique
  return Math.round(eased * SPLASH_WAIT_CEILING)
}

/**
 * Pourcentage tel qu'il s'écrit en français : « 80 % ». L'espace insécable est
 * écrite ` ` et non tapée au clavier : à l'œil elle est identique à une
 * espace normale, et une comparaison entre les deux échoue sans qu'on voie
 * pourquoi.
 */
export function formatSplashPercent(progress: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)))
  return `${clamped} %`
}
