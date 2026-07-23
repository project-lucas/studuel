// Logique pure des notifications push (rappels de rétention).
// Ne construit que le CONTENU des notifications et la décision de les envoyer —
// aucun accès réseau ni DB ici, donc entièrement testable.
// L'infrastructure (service worker, abonnements, envoi VAPID, cron) s'appuie
// dessus : cf. public/sw.js, app/api/push/*, supabase/045_push.sql.
//
// Deux rappels, et deux seulement : `srs` le matin, `streak` le soir. Un
// troisième (« ton créneau de trajet commence ») a existé ici sans jamais être
// envoyé par quoi que ce soit — il demanderait un ciblage par créneau, propre à
// chaque élève, donc un autre cron et une autre requête. Il est retiré plutôt
// que gardé en vitrine : cf. git si le sujet revient.

import { parisHourMinute } from '@/lib/time'

export type ReminderKind = 'srs' | 'streak'

export type PushMessage = {
  kind: ReminderKind
  title: string
  body: string
  url: string // page ouverte au clic sur la notification
}

// Destinations profondes dans l'app.
export const SRS_URL = '/reviser/revoir'
export const STREAK_URL = '/defi'

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

// -----------------------------------------------------------------------------
// À quelle heure part un rappel ?
// -----------------------------------------------------------------------------

/** Les deux rappels envoyés par le cron (le `?type=` de /api/push/send). */
export type ScheduledReminder = 'srs' | 'streak'

/** Heure de PARIS à laquelle chaque rappel doit arriver chez l'élève. */
export const REMINDER_PARIS_HOUR: Record<ScheduledReminder, number> = {
  srs: 8,
  streak: 19,
}

/**
 * Le rappel doit-il partir maintenant ?
 *
 * Les crons Vercel tournent en **UTC** et n'acceptent pas de fuseau : une heure
 * fixe dans `vercel.json` dérive donc d'une heure à chaque changement d'horaire
 * (le rappel du matin arrivait à 8h en hiver et 9h en été, contre la règle
 * « heures élève en Europe/Paris »). Le cron est donc programmé sur les DEUX
 * heures UTC candidates, et cette fonction ne laisse passer que celle qui tombe
 * à la bonne heure de Paris — l'autre sort sans rien envoyer, gratuitement.
 */
export function isReminderDue(
  kind: ScheduledReminder,
  now: Date = new Date(),
): boolean {
  return parisHourMinute(now).hour === REMINDER_PARIS_HOUR[kind]
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
