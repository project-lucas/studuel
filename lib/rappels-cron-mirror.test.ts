import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { isReminderDue, type ScheduledReminder } from '@/lib/notifications'

// Garde du MIROIR planificateur ↔ lib/notifications.
//
// Les rappels vivent en DEUX endroits : les horaires `cron:` de
// `.github/workflows/rappels.yml` (en UTC, hors du monde TypeScript) et
// `isReminderDue` qui, à l'arrivée, ne laisse passer que l'heure de Paris
// attendue. Si l'un bouge sans l'autre, RIEN ne casse : le cron appelle la
// route, `isReminderDue` répond non, et plus aucun rappel ne part — en
// silence. Ce projet s'est fait mordre cinq fois par un miroir qui dérive
// (boss, coffre, maîtrise, paliers, barème de duel) ; un planificateur hors
// du dépôt TypeScript est exactement le même piège.

const WORKFLOW = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '.github',
  'workflows',
  'rappels.yml',
)

const yml = readFileSync(WORKFLOW, 'utf8')

/** Les `- cron: '...'` du bloc `on.schedule`. */
function scheduledCrons(): string[] {
  return [...yml.matchAll(/-\s*cron:\s*'([^']+)'/g)].map((m) => m[1])
}

/**
 * La table `case "$SCHEDULE"` du job : horaire cron (entre quotes) → route
 * appelée. Les branches du déclenchement manuel (`srs)`, `streak)`…) ne sont
 * pas entre quotes et restent donc hors du filet, c'est voulu.
 */
function cronToRoute(): Map<string, string> {
  return new Map(
    [...yml.matchAll(/'([^']*\*[^']*)'\)\s*chemin='([^']+)'/g)].map((m) => [
      m[1],
      m[2],
    ]),
  )
}

/** Champs d'une expression cron à 5 champs. */
function cronFields(expr: string) {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = expr.trim().split(/\s+/)
  return { minute, hour, dayOfMonth, month, dayOfWeek }
}

/**
 * Les heures UTC auxquelles `isReminderDue` accepte d'envoyer le rappel,
 * mesurées sur un jour d'hiver ET un jour d'été (les deux côtés du changement
 * d'heure). C'est la SOURCE DE VÉRITÉ : le YAML doit programmer exactement
 * ces heures-là — une de moins et le rappel saute une demi-année, une de
 * plus et un runner tourne pour rien.
 */
function utcHoursAccepted(kind: ScheduledReminder): number[] {
  const hours = new Set<number>()
  for (const [year, month, day] of [
    [2026, 0, 15], // hiver (UTC+1)
    [2026, 6, 15], // été (UTC+2)
  ]) {
    for (let h = 0; h < 24; h++) {
      if (isReminderDue(kind, new Date(Date.UTC(year, month, day, h)))) {
        hours.add(h)
      }
    }
  }
  return [...hours].sort((a, b) => a - b)
}

const REMINDER_ROUTES: Record<ScheduledReminder, string> = {
  srs: '/api/push/send?type=srs',
  streak: '/api/push/send?type=streak',
}

describe('rappels planifiés : rappels.yml ↔ isReminderDue', () => {
  const crons = scheduledCrons()
  const routes = cronToRoute()

  it('chaque cron planifié est routé explicitement dans le case', () => {
    // Un cron ajouté au `schedule` sans branche dans le `case` retombe sur la
    // branche par défaut… qui envoie le rappel SRS : le nouveau rappel
    // n'existerait pas et le SRS partirait une fois de trop.
    for (const cron of crons) {
      expect(routes.has(cron), `cron « ${cron} » absent du case`).toBe(true)
    }
    expect(routes.size, 'routes orphelines dans le case').toBe(crons.length)
  })

  for (const kind of ['srs', 'streak'] as const) {
    it(`programme le rappel « ${kind} » exactement aux heures qu'accepte isReminderDue`, () => {
      const entry = [...routes.entries()].find(
        ([, route]) => route === REMINDER_ROUTES[kind],
      )
      expect(entry, `aucun cron n'appelle ${REMINDER_ROUTES[kind]}`).toBeDefined()
      const fields = cronFields(entry![0])
      // Tous les jours, à la minute 0 : c'est le contrat d'`isReminderDue`,
      // qui ne filtre que sur l'HEURE de Paris.
      expect(fields.minute).toBe('0')
      expect(fields.dayOfMonth).toBe('*')
      expect(fields.month).toBe('*')
      expect(fields.dayOfWeek).toBe('*')
      const cronHours = fields.hour
        .split(',')
        .map(Number)
        .sort((a, b) => a - b)
      expect(cronHours, `heures UTC du cron « ${kind} »`).toEqual(
        utcHoursAccepted(kind),
      )
    })
  }

  it('clôt la ligue le lundi, juste après minuit UTC', () => {
    // La semaine du projet commence le lundi (index 0, clés UTC — CLAUDE.md) :
    // la clôture doit tomber lundi tôt pour que le classement de la semaine
    // écoulée soit figé avant les premières sessions du matin.
    const entry = [...routes.entries()].find(
      ([, route]) => route === '/api/cron/league-reset',
    )
    expect(entry, 'aucun cron n’appelle /api/cron/league-reset').toBeDefined()
    const fields = cronFields(entry![0])
    expect(fields.dayOfWeek, 'jour de clôture de la ligue').toBe('1')
    expect(fields.hour, 'heure de clôture de la ligue').toBe('0')
  })
})
