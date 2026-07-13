// Logique pure des notifications push (rappels de rétention).
// Ne construit que le CONTENU des notifications et la décision de les envoyer —
// aucun accès réseau ni DB ici, donc entièrement testable.
// L'infrastructure (service worker, abonnements, envoi VAPID, cron) s'appuie
// dessus : cf. public/sw.js, app/api/push/*, supabase/045_push.sql.

export type ReminderKind = 'srs' | 'streak' | 'commute'

export type PushMessage = {
  kind: ReminderKind
  title: string
  body: string
  url: string // page ouverte au clic sur la notification
}

// Destinations profondes dans l'app.
export const SRS_URL = '/reviser/revoir'
export const STREAK_URL = '/defi'
export const COMMUTE_URL = '/reviser'

// Rappel SRS : « X cartes à revoir ». Rien à envoyer si la file est vide.
export function srsMessage(
  dueCount: number,
  topSubject?: string | null,
): PushMessage | null {
  if (!Number.isFinite(dueCount) || dueCount <= 0) return null
  const cartes = dueCount === 1 ? '1 carte' : `${dueCount} cartes`
  const matiere = topSubject ? ` en ${topSubject}` : ''
  return {
    kind: 'srs',
    title: 'Tes révisions t’attendent',
    body: `${cartes} à revoir${matiere} aujourd’hui. C’est le bon moment !`,
    url: SRS_URL,
  }
}

// Protection de la série : le soir, uniquement si l'élève n'a pas travaillé
// aujourd'hui et qu'il a une série à perdre.
export function streakMessage(
  streak: number,
  activeToday: boolean,
): PushMessage | null {
  if (activeToday) return null
  if (!Number.isFinite(streak) || streak <= 0) return null
  return {
    kind: 'streak',
    title:
      streak === 1
        ? 'Ne casse pas ta série !'
        : `Ta série de ${streak} jours est en jeu`,
    body: 'Une petite session suffit à la garder en vie 🔥',
    url: STREAK_URL,
  }
}

// Rappel de créneau de trajet : au début d'un créneau habituel.
export function commuteMessage(slotStart: string): PushMessage {
  return {
    kind: 'commute',
    title: 'Un trajet = une révision',
    body: `Ton créneau de ${slotStart} commence — 5 minutes de quiz, ça compte.`,
    url: COMMUTE_URL,
  }
}

// Convertit une clé VAPID publique (base64url) en Uint8Array pour
// PushManager.subscribe({ applicationServerKey }). Utilisé côté client.
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}
