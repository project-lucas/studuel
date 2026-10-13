// -----------------------------------------------------------------------------
// LA REMONTÉE DES ERREURS — ce qu'on garde d'un plantage, et comment on le trie.
//
// Jusqu'au 12/10/2026, un plantage en production ne laissait AUCUNE trace :
// pas de page d'erreur (l'écran brut de Next, en anglais), pas de journal
// durable (les logs de Vercel vivent une heure), rien qu'on puisse relire le
// lendemain. Pour des milliers d'élèves, c'est l'aveuglement complet : on ne
// saura pas ce qui casse chez eux.
//
// Le circuit, de bout en bout :
//
//   navigateur  window.onerror / unhandledrejection (instrumentation-client.ts)
//               + la frontière d'erreur de l'app (app/error.tsx)
//               → `signalerErreur` (lib/erreurs-client.ts) → POST /api/erreurs
//   serveur     `onRequestError` (instrumentation.ts) — rendu, route, action
//   base        RPC `erreur_signaler` (migration 559) → table `erreurs_app`,
//               lisible par l'admin seulement (/admin/erreurs)
//
// CE MODULE EST PUR : ni navigateur, ni Supabase. Il dit ce qu'est un rapport,
// ce qui est du bruit, combien on en envoie, et comment l'admin les lit.
// -----------------------------------------------------------------------------

export type SourceErreur = 'navigateur' | 'serveur'

/** Une valeur de contexte : un scalaire, jamais un objet (c'est un journal). */
export type ValeurContexte = string | number | boolean | null

export type RapportErreur = {
  source: SourceErreur
  message: string
  nom: string | null
  pile: string | null
  url: string | null
  /** L'identifiant que Next pose sur une erreur serveur : il relie la ligne
   *  « serveur » et la ligne « navigateur » d'un même plantage. */
  digest: string | null
  contexte: Record<string, ValeurContexte>
}

/**
 * Les bornes d'un rapport. Un message tronqué vaut mieux qu'une ligne de
 * 200 Ko : la table est un journal, pas une archive.
 */
export const LIMITES = {
  message: 500,
  nom: 80,
  pile: 4000,
  url: 500,
  digest: 80,
  /** Clés de contexte au plus. */
  clesContexte: 20,
  /** Longueur d'une valeur de contexte (chaîne). */
  valeurContexte: 200,
  /** Rapports envoyés par une page ouverte : au-delà, on se tait. */
  rapportsParSession: 20,
} as const

export function tronquer(texte: string, max: number): string {
  return texte.length <= max ? texte : `${texte.slice(0, max - 1)}…`
}

/** Ce qu'on lit d'une valeur levée, quelle qu'elle soit. */
export function normaliserErreur(e: unknown): {
  nom: string | null
  message: string
  pile: string | null
  digest: string | null
} {
  if (e instanceof Error) {
    const digest =
      'digest' in e && typeof (e as { digest?: unknown }).digest === 'string'
        ? (e as { digest: string }).digest
        : null
    return {
      nom: e.name || null,
      message: e.message || 'Erreur sans message',
      pile: typeof e.stack === 'string' && e.stack.length > 0 ? e.stack : null,
      digest,
    }
  }
  if (typeof e === 'string') {
    return { nom: null, message: e.trim() || 'Erreur sans message', pile: null, digest: null }
  }
  if (e && typeof e === 'object') {
    const o = e as { message?: unknown; name?: unknown; digest?: unknown }
    const message = typeof o.message === 'string' && o.message.trim() ? o.message : null
    return {
      nom: typeof o.name === 'string' ? o.name : null,
      message: message ?? 'Erreur sans message',
      pile: null,
      digest: typeof o.digest === 'string' ? o.digest : null,
    }
  }
  return { nom: null, message: e == null ? 'Erreur sans message' : String(e), pile: null, digest: null }
}

function contexteBorne(contexte: Record<string, ValeurContexte>): Record<string, ValeurContexte> {
  const sortie: Record<string, ValeurContexte> = {}
  let n = 0
  for (const [cle, valeur] of Object.entries(contexte)) {
    if (n >= LIMITES.clesContexte) break
    if (
      valeur !== null &&
      typeof valeur !== 'string' &&
      typeof valeur !== 'number' &&
      typeof valeur !== 'boolean'
    ) {
      continue
    }
    sortie[tronquer(cle, 40)] =
      typeof valeur === 'string' ? tronquer(valeur, LIMITES.valeurContexte) : valeur
    n += 1
  }
  return sortie
}

/** Un rapport borné, prêt à partir, depuis n'importe quelle valeur levée. */
export function rapportDepuis(
  e: unknown,
  source: SourceErreur,
  extra: { url?: string | null; contexte?: Record<string, ValeurContexte> } = {},
): RapportErreur {
  const n = normaliserErreur(e)
  return {
    source,
    message: tronquer(n.message, LIMITES.message),
    nom: n.nom ? tronquer(n.nom, LIMITES.nom) : null,
    pile: n.pile ? tronquer(n.pile, LIMITES.pile) : null,
    url: extra.url ? tronquer(extra.url, LIMITES.url) : null,
    digest: n.digest ? tronquer(n.digest, LIMITES.digest) : null,
    contexte: contexteBorne(extra.contexte ?? {}),
  }
}

/**
 * Le BRUIT qu'on ne remonte pas : ce que le navigateur lève tout seul et qui
 * ne dit rien de l'app.
 *
 *   · « ResizeObserver loop … » : un avertissement de mise en page, pas une
 *     erreur, et Chrome le lève à chaque redimensionnement ;
 *   · « Script error. » : une erreur d'un script d'une AUTRE origine, dont le
 *     navigateur ne nous donne rien (ni message, ni pile) ;
 *   · AbortError : une requête annulée volontairement (navigation, `signal`) ;
 *   · une pile qui passe par une extension : ce n'est pas notre code.
 */
export function estBruit(r: Pick<RapportErreur, 'message' | 'pile' | 'nom'>): boolean {
  if (/ResizeObserver loop/i.test(r.message)) return true
  if (/^Script error\.?$/.test(r.message.trim())) return true
  if (r.nom === 'AbortError') return true
  if (r.pile && /(chrome|moz|safari)-extension:\/\//.test(r.pile)) return true
  return false
}

/** La clé qui dit « c'est la même erreur » : même nom, même message, même page. */
export function cleDeDoublon(r: Pick<RapportErreur, 'message' | 'nom' | 'url'>): string {
  return `${r.nom ?? ''}|${r.message.slice(0, 200)}|${r.url ?? ''}`
}

/**
 * Le limiteur d'une page ouverte : jamais deux fois la même erreur, jamais plus
 * de `max` rapports. Une boucle de rendu qui plante 60 fois par seconde ne
 * doit pas inonder la base — ni le réseau de l'élève.
 */
export function creerLimiteur(max: number = LIMITES.rapportsParSession): {
  accepte: (r: Pick<RapportErreur, 'message' | 'nom' | 'url'>) => boolean
} {
  const vues = new Set<string>()
  let envoyes = 0
  return {
    accepte(r) {
      if (envoyes >= max) return false
      const cle = cleDeDoublon(r)
      if (vues.has(cle)) return false
      vues.add(cle)
      envoyes += 1
      return true
    },
  }
}

function chaineOuNull(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? tronquer(v, max) : null
}

/**
 * Lit un rapport reçu PAR LE RÉSEAU (le corps de POST /api/erreurs) : c'est de
 * la donnée non fiable. Rien n'est cru sur parole — la source est imposée par
 * l'appelant, chaque champ est typé et borné, le contexte ne garde que des
 * scalaires. `null` = rien d'exploitable (400).
 */
export function lireRapport(brut: unknown, source: SourceErreur): RapportErreur | null {
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return null
  const o = brut as Record<string, unknown>
  const message = chaineOuNull(o.message, LIMITES.message)
  if (!message) return null
  const contexte =
    o.contexte && typeof o.contexte === 'object' && !Array.isArray(o.contexte)
      ? contexteBorne(o.contexte as Record<string, ValeurContexte>)
      : {}
  return {
    source,
    message,
    nom: chaineOuNull(o.nom, LIMITES.nom),
    pile: chaineOuNull(o.pile, LIMITES.pile),
    url: chaineOuNull(o.url, LIMITES.url),
    digest: chaineOuNull(o.digest, LIMITES.digest),
    contexte,
  }
}

// -----------------------------------------------------------------------------
// LA LECTURE PAR L'ADMIN (/admin/erreurs)
// -----------------------------------------------------------------------------

/** Une ligne de `erreurs_app` telle que la base la rend. */
export type LigneErreur = {
  id: number
  cree_le: string
  source: SourceErreur
  user_id: string | null
  message: string
  nom: string | null
  pile: string | null
  url: string | null
  digest: string | null
  contexte: Record<string, ValeurContexte> | null
  navigateur: string | null
}

export type GroupeErreur = {
  cle: string
  nom: string | null
  message: string
  nombre: number
  /** ISO de la plus récente. */
  derniere: string
  premiere: string
  sources: SourceErreur[]
  /** Élèves distincts touchés (les lignes anonymes ne comptent pas). */
  eleves: number
  /** Les pages les plus touchées, au plus trois, la plus fréquente d'abord. */
  urls: string[]
  /** La ligne la plus récente du groupe (sa pile, son digest, son contexte). */
  exemple: LigneErreur
}

/**
 * Regroupe les lignes par erreur (même nom, même message) — c'est ce qu'on veut
 * lire le matin : « 40 fois cette erreur, 12 élèves, surtout sur /reviser ».
 * Les groupes les plus nombreux d'abord, puis les plus récents.
 */
export function resumerErreurs(lignes: readonly LigneErreur[]): GroupeErreur[] {
  const groupes = new Map<
    string,
    { lignes: LigneErreur[]; urls: Map<string, number>; eleves: Set<string>; sources: Set<SourceErreur> }
  >()
  for (const l of lignes) {
    const cle = `${l.nom ?? ''}|${l.message.slice(0, 200)}`
    let g = groupes.get(cle)
    if (!g) {
      g = { lignes: [], urls: new Map(), eleves: new Set(), sources: new Set() }
      groupes.set(cle, g)
    }
    g.lignes.push(l)
    if (l.url) g.urls.set(l.url, (g.urls.get(l.url) ?? 0) + 1)
    if (l.user_id) g.eleves.add(l.user_id)
    g.sources.add(l.source)
  }
  const sortie: GroupeErreur[] = []
  for (const [cle, g] of groupes) {
    const triees = [...g.lignes].sort((a, b) => (a.cree_le < b.cree_le ? 1 : a.cree_le > b.cree_le ? -1 : 0))
    sortie.push({
      cle,
      nom: triees[0].nom,
      message: triees[0].message,
      nombre: triees.length,
      derniere: triees[0].cree_le,
      premiere: triees[triees.length - 1].cree_le,
      sources: [...g.sources].sort(),
      eleves: g.eleves.size,
      urls: [...g.urls.entries()]
        .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
        .slice(0, 3)
        .map(([u]) => u),
      exemple: triees[0],
    })
  }
  return sortie.sort((a, b) => b.nombre - a.nombre || (a.derniere < b.derniere ? 1 : a.derniere > b.derniere ? -1 : 0))
}

/** Combien de lignes depuis l'instant donné. */
export function compterDepuis(lignes: readonly LigneErreur[], depuis: Date): number {
  const seuil = depuis.toISOString()
  return lignes.reduce((n, l) => (l.cree_le >= seuil ? n + 1 : n), 0)
}
