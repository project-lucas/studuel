import type { SupabaseClient } from '@supabase/supabase-js'
import {
  reviewAfterAnswer,
  sanitizeReviewAnswers,
  REVIEW_STATE_COLUMNS,
  type ReviewAnswer,
  type ReviewState,
} from '@/lib/srs'

// -----------------------------------------------------------------------------
// L'ÉCRITURE de la file « À revoir » — côté serveur uniquement. Les règles
// (boîtes, échéances) restent dans lib/srs, pur et testé.
//
// Sortie de app/reviser/actions (19/09/2026) pour que la fin d'une course
// classée puisse l'appeler SANS `revalidatePath` : dans une Server Action, une
// revalidation fait re-rendre la page courante (la course elle-même, ~14
// requêtes) et vide le cache client de tous les onglets. L'action de Réviser
// garde sa revalidation ; la course, elle, rafraîchit l'arène au retour.
// -----------------------------------------------------------------------------

/** Enregistre des réponses dans la file de révision. `true` si c'est écrit. */
export async function enregistrerReponsesRevision(
  supabase: SupabaseClient,
  userId: string,
  answers: ReviewAnswer[],
): Promise<boolean> {
  // Assainissement : formes valides seulement, dernière réponse par item,
  // volume borné (une session ne dépasse jamais quelques dizaines d'items).
  const clean = sanitizeReviewAnswers(answers)
  if (clean.length === 0) return true

  // État actuel des items touchés. Toutes les colonnes du moteur sont
  // nécessaires : `due_at` dit si l'item était RÉELLEMENT à revoir (un succès
  // sur un item pas encore dû ne fait pas monter la boîte), et les compteurs
  // de passages doivent être PROLONGÉS et non recalculés — les relire à moitié
  // remettrait `times_seen` à 1 à chaque session.
  const { data: existing } = await supabase
    .from('review_items')
    .select(`item_kind, item_id, ${REVIEW_STATE_COLUMNS}`)
    .eq('user_id', userId)
    .in(
      'item_id',
      clean.map((a) => a.id),
    )
  const prevByKey = new Map(
    ((existing ?? []) as unknown as (ReviewState & { item_kind: string; item_id: string })[]).map(
      (r) => [`${r.item_kind}:${r.item_id}`, r as ReviewState],
    ),
  )

  const now = Date.now()
  const rows = clean.map((a) => {
    const prev = prevByKey.get(`${a.kind}:${a.id}`) ?? null
    const next = reviewAfterAnswer(prev, a.good, now)
    return {
      user_id: userId,
      item_kind: a.kind,
      item_id: a.id,
      subject: a.subject,
      ...next,
      updated_at: new Date(now).toISOString(),
    }
  })

  const { error } = await supabase
    .from('review_items')
    .upsert(rows, { onConflict: 'user_id,item_kind,item_id' })
  if (error) {
    console.error('[srs] enregistrement des réponses impossible:', error.message)
    return false
  }
  return true
}
