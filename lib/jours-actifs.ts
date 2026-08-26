// Les jours où l'élève a travaillé — la matière première de la flamme de série
// et de la grille de la semaine.
//
// CE QUE FAISAIT `/reviser`. Quatre lectures, à chaque affichage, sur les
// quatre tables d'activité, sur une fenêtre de 400 jours — pour n'en tirer
// qu'un `Set` de chaînes « YYYY-MM-DD ». Un élève assidu joue plusieurs
// sessions par jour : sur 400 jours, ce sont des milliers de lignes
// transférées pour produire au plus 400 chaînes, et le rapport empire à chaque
// session jouée.
//
// Pire : ces lectures ramenaient `score`, `cards_count` et `xp`, que plus rien
// ne consommait — le commentaire de la page disait qu'elles « alimentent l'XP
// du header », ce qui n'était plus vrai. Trois colonnes de données transportées
// pour rien, sur les quatre tables les plus volumineuses de la base.
//
// `jours_actifs()` (migration 323) fait le DISTINCT en base : au plus 400
// entrées, quel que soit l'usage. C'est exactement la CTE `days` que
// `child_dashboard` utilise déjà de son côté depuis la 199.
//
// LE CALCUL DE LA SÉRIE NE BOUGE PAS. `computeStreak` et `weekProgress`
// restent en TypeScript, là où ils sont testés — la base ne fournit que
// l'ensemble des jours, jamais la règle.

import type { SupabaseClient } from '@supabase/supabase-js'
import { activityCutoff } from '@/lib/streak'

/** PGRST202 = la fonction n'est pas (encore) dans la base. */
function migrationAbsente(code?: string): boolean {
  return code === 'PGRST202'
}

/**
 * Les clés UTC des jours travaillés, quel que soit le type d'activité.
 *
 * Tolérant : une ligne illisible est ignorée, jamais convertie en une date
 * bidon — un faux jour actif prolongerait une série que l'élève n'a pas tenue,
 * ce qui est exactement le mensonge qu'une flamme ne doit pas faire.
 */
export function parseJoursActifs(raw: unknown): Set<string> {
  const jours = new Set<string>()
  if (!Array.isArray(raw)) return jours
  for (const d of raw) {
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) jours.add(d)
  }
  return jours
}

/** Les lignes brutes des quatre tables → l'ensemble des jours (repli). */
export function joursDepuisLignes(
  ...listes: (readonly { created_at?: unknown }[] | null | undefined)[]
): Set<string> {
  const jours = new Set<string>()
  for (const liste of listes) {
    for (const row of liste ?? []) {
      const at = row?.created_at
      if (typeof at !== 'string' || at.length < 10) continue
      jours.add(at.slice(0, 10))
    }
  }
  return jours
}

export async function fetchJoursActifs(
  supabase: SupabaseClient,
  userId: string,
  now: Date = new Date(),
): Promise<Set<string>> {
  const since = activityCutoff(now)
  const { data, error } = await supabase.rpc('jours_actifs', { p_since: since })

  if (!error) return parseJoursActifs(data)
  if (!migrationAbsente(error.code)) {
    console.error('[serie] jours actifs indisponibles:', error.message)
  }

  // Le repli : les quatre lectures d'avant, MOINS les colonnes que plus rien
  // ne consommait. Même sans la 323, la page transporte donc déjà moins.
  const [t, s, l, c] = await Promise.all([
    supabase
      .from('test_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', since),
    supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', since),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', since),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', since),
  ])

  return joursDepuisLignes(
    t.data as { created_at?: unknown }[] | null,
    s.data as { created_at?: unknown }[] | null,
    l.data as { created_at?: unknown }[] | null,
    c.data as { created_at?: unknown }[] | null,
  )
}
