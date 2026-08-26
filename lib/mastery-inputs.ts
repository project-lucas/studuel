// Les deux entrées de la maîtrise — le meilleur score par quiz et les leçons
// terminées — lues de la façon la moins chère possible.
//
// POURQUOI CE MODULE EXISTE. `getChapterMastery` lisait `test_sessions` SANS
// LIMITE ET SANS AGRÉGAT (« une ligne par session jouée depuis l'inscription »)
// pour n'en tirer qu'un `max(score / total)` par quiz, en JavaScript. Trois
// facteurs faisaient de cette seule requête le point le plus coûteux du code :
//
//   · `test_sessions` est la table qui grossit le plus vite du projet —
//     ~3 M de lignes par jour à cent mille élèves ;
//   · elle grossit PAR ÉLÈVE : un terminale qui a commencé en seconde traîne
//     des milliers de lignes, et il les retransférait à chaque écran ;
//   · `getChapterMastery` a SEPT sites d'appel, dont /defi, /reviser, /moi et
//     Marcel — les écrans les plus vus.
//
// La migration 321 fait le `GROUP BY` en base : une ligne par quiz JOUÉ (borné
// par le catalogue) au lieu d'une par session jouée (non borné).
//
// LE REPLI N'EST PAS DÉCORATIF. Le projet déploie le code AVANT d'exécuter ses
// migrations : tant que la 321 dort, la RPC répond PGRST202 et on refait
// l'ancienne lecture. Sans ce repli, la maîtrise tomberait à zéro partout —
// donc les couronnes de l'élève avec elle — pour un déploiement en avance de
// quelques heures sur un copier-coller de SQL.
//
// La lecture est ici, le calcul est pur juste en dessous : voir
// mastery-inputs.test.ts.

import type { SupabaseClient } from '@supabase/supabase-js'

export type MasteryInputs = {
  /** quiz_id → meilleur ratio obtenu, 0..1. */
  bestByQuiz: Map<string, number>
  completedLessons: Set<string>
}

const VIDE: MasteryInputs = {
  bestByQuiz: new Map(),
  completedLessons: new Set(),
}

/** Une ligne brute de `test_sessions`, telle que la rendait l'ancienne lecture. */
export type SessionRow = {
  quiz_id: string | null
  score: number
  total: number
}

/**
 * Le meilleur essai de chaque quiz, calculé en JavaScript.
 *
 * Sert au REPLI (migration 321 absente) et de référence de comportement pour
 * l'agrégat SQL : les deux doivent rendre exactement la même chose, et un test
 * le vérifie sur les mêmes données.
 *
 * Le ratio est ÉCRÊTÉ à 1. Un score supérieur au total est arrivé — un total
 * corrigé après coup — et sans écrêtage il gonflerait la maîtrise au-delà du
 * maximum, donnant une couronne imméritée que rien n'expliquerait à l'élève.
 */
export function foldBestByQuiz(
  rows: readonly SessionRow[] | null | undefined,
): Map<string, number> {
  const best = new Map<string, number>()
  for (const r of rows ?? []) {
    if (!r?.quiz_id || !(r.total > 0)) continue
    const ratio = Math.min(r.score / r.total, 1)
    best.set(r.quiz_id, Math.max(best.get(r.quiz_id) ?? 0, ratio))
  }
  return best
}

/**
 * Le JSON de `mastery_inputs()` (321) mis en forme.
 *
 * Tolérant par construction : la RPC est une frontière de système, et une clé
 * absente ou une ligne malformée ne doit pas faire tomber la maîtrise entière
 * — on ignore ce qu'on ne sait pas lire, on garde le reste. Un ratio illisible
 * n'est PAS traité comme un zéro : zéro veut dire « raté », et afficher
 * « raté » sur un chapitre réussi est pire que de ne rien afficher.
 */
export function parseMasteryInputs(raw: unknown): MasteryInputs {
  if (!raw || typeof raw !== 'object') return VIDE
  const o = raw as {
    best_per_quiz?: unknown
    completed_lessons?: unknown
  }

  const bestByQuiz = new Map<string, number>()
  if (Array.isArray(o.best_per_quiz)) {
    for (const entry of o.best_per_quiz) {
      if (!entry || typeof entry !== 'object') continue
      const { quiz_id: id, ratio } = entry as { quiz_id?: unknown; ratio?: unknown }
      if (typeof id !== 'string' || id.length === 0) continue
      // Le type est vérifié AVANT la conversion, et ce n'est pas de la
      // pédanterie : `Number(null)`, `Number('')` et `Number([])` valent tous
      // 0 — un zéro qui passerait le test « fini » et se lirait « chapitre
      // raté ». `numeric` traverse PostgREST en CHAÎNE (pour ne pas perdre de
      // précision), la chaîne est donc légitime ; null ne l'est pas.
      if (typeof ratio !== 'number' && typeof ratio !== 'string') continue
      if (typeof ratio === 'string' && ratio.trim() === '') continue
      const n = Number(ratio)
      if (!Number.isFinite(n)) continue
      bestByQuiz.set(id, Math.min(Math.max(n, 0), 1))
    }
  }

  const completedLessons = new Set<string>()
  if (Array.isArray(o.completed_lessons)) {
    for (const id of o.completed_lessons) {
      if (typeof id === 'string' && id.length > 0) completedLessons.add(id)
    }
  }

  return { bestByQuiz, completedLessons }
}

/** PGRST202 = la fonction n'est pas (encore) dans la base. */
function migrationAbsente(code?: string): boolean {
  return code === 'PGRST202'
}

/**
 * Les entrées de la maîtrise, par l'agrégat SQL quand il existe, par l'ancienne
 * lecture sinon.
 */
export async function masteryInputs(
  supabase: SupabaseClient,
  userId: string,
): Promise<MasteryInputs> {
  const { data, error } = await supabase.rpc('mastery_inputs')

  if (!error) return parseMasteryInputs(data)

  if (!migrationAbsente(error.code)) {
    // Une vraie panne. La journaliser : sans ça, une erreur transitoire est
    // indiscernable d'« élève sans historique » et fait retomber toutes les
    // couronnes à zéro en silence.
    console.error('[mastery] agrégat indisponible:', error.message)
  }

  return repli(supabase, userId)
}

// L'ancienne lecture, mot pour mot. Elle transfère une ligne par session
// jouée — c'est cher, et c'est exactement pour ça que la 321 existe ; mais
// c'est juste, et une maîtrise juste et lente vaut mieux qu'une maîtrise vide.
async function repli(
  supabase: SupabaseClient,
  userId: string,
): Promise<MasteryInputs> {
  const [{ data: sessions, error: sessErr }, { data: completions, error: compErr }] =
    await Promise.all([
      supabase
        .from('test_sessions')
        .select('quiz_id, score, total')
        .eq('user_id', userId)
        .returns<SessionRow[]>(),
      supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', userId)
        .returns<{ lesson_id: string }[]>(),
    ])

  if (sessErr) console.error('[mastery] scores indisponibles:', sessErr.message)
  if (compErr) {
    console.error('[mastery] leçons terminées indisponibles:', compErr.message)
  }

  return {
    bestByQuiz: foldBestByQuiz(sessions),
    completedLessons: new Set((completions ?? []).map((c) => c.lesson_id)),
  }
}
