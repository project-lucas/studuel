import { after } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  autoHabitLogs,
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
