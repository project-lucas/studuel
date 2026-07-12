// Trajet maison-école — logique pure.
// L'idée produit : on ne déplace pas du travail scolaire, on exploite un
// temps mort (le trajet retour) que l'élève n'utilisait pas avant. Toute
// session jouée dans un créneau de trajet devient un « exploit de trajet » :
// XP bonus, série dédiée, badges.

import { computeStreak, toDayKey } from '@/lib/streak'
import { isInCommuteSlot } from '@/lib/habits'
import type { CommuteSlot } from '@/lib/types'

// Sommes-nous dans un créneau de trajet, là, maintenant ? (heure de Paris —
// la conversion est faite par isInCommuteSlot, ce code tourne aussi en UTC.)
export function isCommuteNow(slots: CommuteSlot[], now = new Date()): boolean {
  if (slots.length === 0) return false
  return isInCommuteSlot(now.toISOString(), slots)
}

// Jours ('YYYY-MM-DD') où au moins une session a été jouée pendant un trajet.
export function commuteDayKeys(
  sessions: { created_at: string }[],
  slots: CommuteSlot[],
): Set<string> {
  return new Set(
    sessions
      .filter((s) => isInCommuteSlot(String(s.created_at), slots))
      .map((s) => String(s.created_at).slice(0, 10)),
  )
}

// Série de trajets studieux : jours consécutifs avec une session en trajet.
// Même clémence que la série principale (hier compte encore) — et le week-end
// sans trajet casse volontairement la série : c'est une série de trajets.
export function commuteStreak(
  sessions: { created_at: string }[],
  slots: CommuteSlot[],
  now = new Date(),
): number {
  return computeStreak(commuteDayKeys(sessions, slots), now)
}

export { toDayKey }
