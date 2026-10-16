// -----------------------------------------------------------------------------
// LE JOURNAL D'USAGE — la logique pure (16/10/2026, migration 590).
//
// Ce que la base ne voit pas : les écrans ouverts, le temps qu'on y passe, les
// recherches sans résultat, les gestes. RIEN DE PERSONNEL : une page est
// NORMALISÉE avant de partir (un identifiant, un nombre ou un slug de matière
// devient `[id]`, `[n]`, `[matiere]` ; jamais de paramètre de recherche), et
// les propriétés sont courtes. Sans réseau, testé.
// -----------------------------------------------------------------------------

export type Evenement = {
  nom: string
  page?: string | null
  duree_ms?: number
  props?: Record<string, string | number | boolean | null>
  t: string
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOMBRE = /^\d+$/
/** Un segment qui ressemble à un identifiant (long, mélange chiffres et lettres). */
const IDENT = /^(?=.*\d)[A-Za-z0-9_-]{12,}$/

/**
 * Les routes à paramètre de l'app, pour nommer le segment qui suit : on garde
 * `/reviser/[matiere]/[chapitre]`, lisible dans les insights.
 */
const APRES: Record<string, string[]> = {
  reviser: ['[matiere]', '[chapitre]', '[lecon]'],
  programme: ['[matiere]'],
  jeux: ['[jeu]'],
  eleves: ['[id]'],
  capsules: ['[id]'],
  cours: ['[id]'],
  annales: ['[id]'],
  parrain: ['[code]'],
}

/** Les segments fixes connus de l'app après un paramètre (gardés tels quels). */
const FIXES = new Set([
  'quiz', 'cours', 'carte', 'exercice', 'controle', 'flashcards', 'erreurs', 'annales', 'encyclopedie',
  'sujet', 'reviser', 'jeu', 'jouer', 'fiches', 'cahier', 'dictee', 'examen', 'oral',
])

/** `/reviser/maths/3f2a…/quiz?x=1` → `/reviser/[matiere]/[chapitre]/quiz`. */
export function normaliserPage(chemin: string): string {
  const sansQuery = (chemin || '/').split(/[?#]/)[0]
  const parts = sansQuery.split('/').filter(Boolean)
  const out: string[] = []
  let attendus: string[] = []
  for (const p of parts) {
    let seg = p
    if (UUID.test(p) || IDENT.test(p)) seg = attendus.shift() ?? '[id]'
    else if (NOMBRE.test(p)) seg = attendus.shift() ?? '[n]'
    else if (attendus.length > 0 && !FIXES.has(p)) seg = attendus.shift() ?? p
    else if (attendus.length > 0) attendus = []
    if (APRES[p]) attendus = [...APRES[p]]
    out.push(seg.slice(0, 40))
  }
  return `/${out.join('/')}`.slice(0, 120)
}

/** « mobile », « tablette », « ordinateur » — d'après la largeur d'écran, pas l'agent. */
export function appareilDepuisLargeur(largeur: number): 'mobile' | 'tablette' | 'ordinateur' {
  if (largeur < 640) return 'mobile'
  if (largeur < 1024) return 'tablette'
  return 'ordinateur'
}

/** Un identifiant de session : 20 caractères de l'alphabet sûr. */
export function nouvelleSession(aleatoire: () => number = Math.random): string {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < 20; i++) s += a[Math.floor(aleatoire() * a.length)]
  return s
}

/** Nettoie des propriétés : 8 clés au plus, textes bornés à 60 caractères, rien d'autre que des scalaires. */
export function propsPropres(p: Record<string, unknown> | undefined): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {}
  if (!p) return out
  for (const [k, v] of Object.entries(p).slice(0, 8)) {
    if (!/^[a-z_]{1,24}$/.test(k)) continue
    if (typeof v === 'string') out[k] = v.slice(0, 60)
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
    else if (typeof v === 'boolean' || v === null) out[k] = v
  }
  return out
}

export const NOM_VALIDE = /^[a-z_]{2,40}$/

/**
 * La file d'attente : on garde au plus 200 événements, on envoie par lots de
 * 50. Pure : l'appelant décide quand envoyer.
 */
export function creerFile(max = 200) {
  let file: Evenement[] = []
  return {
    ajouter(e: Evenement): void {
      if (!NOM_VALIDE.test(e.nom)) return
      file = [...file, e].slice(-max)
    },
    prendre(n = 50): Evenement[] {
      const lot = file.slice(0, n)
      file = file.slice(n)
      return lot
    },
    taille(): number {
      return file.length
    },
  }
}
