// -----------------------------------------------------------------------------
// LE PRÉCHARGEMENT AU REPOS (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md § 8,
// « Réviser d'abord ».
//
// Le moment le plus long et le plus calme de l'app, c'est la LECTURE d'un
// cours : l'élève y passe des minutes sans rien demander au réseau. On y
// prépare la suite — le quiz du chapitre, la leçon suivante, le cahier — pour
// qu'au tap la page soit déjà là. Les règles, ici, pures et testées ; le
// composant `PrechargeAuRepos` ne fait que les appliquer.
//
//   · jamais sur une connexion économe (`saveData`) ni en 2G ;
//   · une page à la fois, espacées, et seulement quand le navigateur est oisif ;
//   · trois pages au plus : on prépare la suite, pas tout le chapitre ;
//   · jamais ce qui est verrouillé (gemme), réservé (« bientôt ») ni hors de
//     l'app — une page qu'on ne peut pas ouvrir n'a pas à coûter une requête.
// -----------------------------------------------------------------------------
import type { SupportChip, SupportKind } from './subject-template'

/** L'attente après l'arrivée sur la page : elle a fini de se peindre. */
export const DELAI_REPOS_MS = 2500
/** L'espace entre deux pages préchargées. */
export const ESPACEMENT_REPOS_MS = 1500
/** Au plus trois pages par écran. */
export const MAX_PAGES_AU_REPOS = 3

/** Ce que l'API Network Information dit de la connexion (souvent absente). */
export type Connexion = { saveData?: boolean; effectiveType?: string } | null | undefined

/** Peut-on dépenser du réseau en avance ? Sans information : oui. */
export function peutPrechargerAuRepos(connexion: Connexion): boolean {
  if (!connexion) return true
  if (connexion.saveData) return false
  return connexion.effectiveType !== 'slow-2g' && connexion.effectiveType !== '2g'
}

/** L'ordre d'intérêt après un cours : tester, puis lire la suite, puis s'exercer. */
const PRIORITE: readonly SupportKind[] = ['quiz', 'cours', 'exercice', 'erreurs', 'carte']

/**
 * Les pages à préparer pendant la lecture, dans l'ordre où l'élève a le plus
 * de chances de les ouvrir : ce qui est jouable, interne, sans doublon.
 */
export function pagesAuRepos(chips: readonly SupportChip[], max = MAX_PAGES_AU_REPOS): string[] {
  const rang = (k: SupportKind) => {
    const i = PRIORITE.indexOf(k)
    return i < 0 ? PRIORITE.length : i
  }
  const vues = new Set<string>()
  return [...chips]
    .filter((c) => !c.locked && !c.bientot && c.href.startsWith('/') && !c.href.startsWith('//'))
    .sort((a, b) => rang(a.kind) - rang(b.kind))
    .flatMap((c) => {
      if (vues.has(c.href)) return []
      vues.add(c.href)
      return [c.href]
    })
    .slice(0, Math.max(0, max))
}
