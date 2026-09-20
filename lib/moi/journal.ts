import { after } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  autoHabitLogs,
  habitudesAutoDuJour,
  mergeHabitLogs,
  type SessionsByKind,
} from '@/lib/habits'
import type { CommuteSlot, Habit, HabitLog } from '@/lib/types'

// -----------------------------------------------------------------------------
// LE JOURNAL DES HABITUDES — la validation automatique du jour, en un endroit.
//
// Réviser, jouer un quiz, terminer une leçon coche tout seul « Révision
// quotidienne » (et « Test sur trajets » si on est dans un créneau). Cette
// décision est PURE (`autoHabitLogs`) mais elle doit être appliquée sur CHAQUE
// écran qui lit les habitudes, sinon les deux se contredisent : /moi afficherait
// la case cochée et /moi/habitudes la montrerait vide, pour le même jour.
//
// Deux temps, comme sur l'onglet Moi depuis la passe de performance :
//   1. on applique la décision EN MÉMOIRE sur les logs déjà lus — l'écran connaît
//      donc son résultat sans attendre l'écriture ;
//   2. on persiste APRÈS l'envoi de la réponse (`after`), pour qu'au prochain
//      chargement la base dise la même chose.
//
// L'élève n'attend jamais une écriture dont l'écran connaît déjà le résultat.
// -----------------------------------------------------------------------------

const AUCUNE_ACTIVITE: SessionsByKind = {
  tests: [],
  studies: [],
  lessons: [],
  challenges: [],
}

/**
 * Les sessions de la JOURNÉE (UTC) qui peuvent cocher une habitude — et rien du
 * tout si aucune habitude automatique n'est prévue aujourd'hui.
 *
 * Avant le 19/09/2026, /moi et /moi/habitudes lisaient les quatre tables
 * d'activité sur 400 JOURS (des milliers de lignes pour un élève assidu) alors
 * que la décision (`autoHabitLogs`) ne regarde que la journée en cours. La
 * série, elle, vient de `jours_actifs()` (lib/jours-actifs).
 */
export async function lireActiviteDuJour(
  supabase: SupabaseClient,
  userId: string,
  habits: Habit[],
  today: string,
): Promise<SessionsByKind> {
  if (habitudesAutoDuJour(habits, today).length === 0) return AUCUNE_ACTIVITE
  const debut = `${today}T00:00:00Z`
  const lire = (table: string) =>
    supabase
      .from(table)
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', debut)
  const [t, s, l, c] = await Promise.all([
    lire('test_sessions'),
    lire('study_sessions'),
    lire('lesson_completions'),
    lire('challenge_sessions'),
  ])
  return {
    tests: t.data ?? [],
    studies: s.data ?? [],
    lessons: l.data ?? [],
    challenges: c.data ?? [],
  }
}

export function appliquerValidationsAuto(
  supabase: SupabaseClient,
  userId: string,
  params: {
    habits: Habit[]
    storedLogs: HabitLog[]
    commuteSlots: CommuteSlot[]
    /** Les historiques d'activité qui déclenchent les validations. */
    activite: SessionsByKind
    today: string
  },
): HabitLog[] {
  const autoRows = autoHabitLogs(
    userId,
    params.habits,
    params.commuteSlots,
    params.activite,
    params.today,
  )

  if (autoRows.length > 0) {
    after(async () => {
      const { error } = await supabase
        .from('habit_logs')
        .upsert(autoRows, { onConflict: 'habit_id,date' })
      if (error) {
        console.error('[moi] validations auto non enregistrées :', error.message)
      }
    })
  }

  return mergeHabitLogs(params.storedLogs, autoRows)
}
