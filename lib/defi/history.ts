// Historique des matchs classés — logique pure, sans React ni Supabase.
// Normalise les lignes de `ranked_matches` (migration 079) en entrées prêtes
// à afficher, avec libellés de jour en français et résumé victoires/défaites.

export interface DuelHistoryEntry {
  id: string
  won: boolean
  /** Trophées gagnés/perdus sur le match (borné ±100 par sécurité). */
  delta: number
  /** Total de trophées APRÈS le match. */
  trophies: number
  /** Libellé de l'adversaire (fantôme, prénom…) — jamais vide. */
  opponent: string
  /** Clé de jour UTC `YYYY-MM-DD` du match. */
  dayKey: string
}

export interface DuelHistorySummary {
  total: number
  wins: number
  losses: number
  /** Taux de victoire en %, arrondi (0 si aucun match). */
  winRate: number
}

const MONTHS_FR = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
] as const

/** Borne un delta de trophées à ±100 (le barème serveur reste bien en deçà). */
function clampDelta(n: number): number {
  return Math.max(-100, Math.min(100, Math.round(n)))
}

/**
 * Normalise les lignes brutes de `ranked_matches` (souvent `unknown` côté
 * Supabase). Les lignes invalides sont ignorées ; le tri est du plus récent au
 * plus ancien.
 */
export function normalizeRankedHistory(rows: unknown): DuelHistoryEntry[] {
  if (!Array.isArray(rows)) return []
  const withTs = rows.flatMap(
    (r): { entry: DuelHistoryEntry; ts: string }[] => {
      const o = r as Record<string, unknown>
      const id = String(o?.id ?? '')
      const createdAt = String(o?.created_at ?? '')
      const dayKey = createdAt.slice(0, 10)
      if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return []
      const delta = Number(o?.delta)
      const trophies = Number(o?.trophies)
      if (!Number.isFinite(delta) || !Number.isFinite(trophies)) return []
      const opponent = String(o?.opponent ?? '').trim()
      return [
        {
          ts: createdAt,
          entry: {
            id,
            won: o?.won === true,
            delta: clampDelta(delta),
            trophies: Math.max(0, Math.round(trophies)),
            opponent: opponent || 'Adversaire mystère',
            dayKey,
          },
        },
      ]
    },
  )
  // Du plus récent au plus ancien (départage stable par id).
  withTs.sort((a, b) =>
    a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : a.entry.id < b.entry.id ? -1 : 1,
  )
  return withTs.map((w) => w.entry)
}

/** Résumé victoires/défaites d'une liste d'entrées. */
export function duelHistorySummary(
  entries: DuelHistoryEntry[],
): DuelHistorySummary {
  const wins = entries.filter((e) => e.won).length
  const total = entries.length
  return {
    total,
    wins,
    losses: total - wins,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
  }
}

/**
 * Libellé de jour en français : « Aujourd'hui », « Hier », sinon « 12 juil. »
 * (avec l'année si différente de celle du jour courant). Les clés sont des
 * jours UTC `YYYY-MM-DD`, comme partout dans l'app.
 */
export function dayLabelFr(dayKey: string, todayKey: string): string {
  if (dayKey === todayKey) return "Aujourd'hui"

  const d = new Date(`${dayKey}T00:00:00Z`)
  const t = new Date(`${todayKey}T00:00:00Z`)
  if (Number.isNaN(d.getTime()) || Number.isNaN(t.getTime())) return dayKey

  const diffDays = Math.round((t.getTime() - d.getTime()) / 86_400_000)
  if (diffDays === 1) return 'Hier'

  const label = `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]}`
  return d.getUTCFullYear() === t.getUTCFullYear()
    ? label
    : `${label} ${d.getUTCFullYear()}`
}
