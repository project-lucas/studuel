import Link from 'next/link'
import {
  duelHistorySummary,
  dayLabelFr,
  type DuelHistoryEntry,
} from '@/lib/defi/history'
import { ChevronRightIcon, SwordsIcon, TrophyIcon } from './icons'

interface DuelHistoryProps {
  entries: DuelHistoryEntry[]
  /** Nombre d'items dans la file « À revoir » (SRS + Revanche). */
  reviewCount: number
  /** Clé de jour UTC du jour courant (pour les libellés relatifs). */
  todayKey: string
}

/**
 * « Historique » (feuille de l'écran Défi) : les derniers matchs classés —
 * victoire/défaite, adversaire, trophées gagnés/perdus — puis le pont
 * pédagogique : « Revoir mes erreurs », qui rejoue la file SRS alimentée par
 * les questions ratées en défi. Purement présentationnel.
 */
export default function DuelHistory({
  entries,
  reviewCount,
  todayKey,
}: DuelHistoryProps) {
  const summary = duelHistorySummary(entries)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Bilan compact des derniers matchs. */}
      {summary.total > 0 ? (
        <p className="text-center text-sm font-bold text-white/75">
          {summary.wins} victoire{summary.wins > 1 ? 's' : ''} ·{' '}
          {summary.losses} défaite{summary.losses > 1 ? 's' : ''}
          <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/85 tabular-nums">
            {summary.winRate} %
          </span>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <SwordsIcon className="size-8 text-white/35" />
          <p className="text-sm font-semibold text-white/70">
            Aucun match classé pour l&apos;instant.
            <br />
            Lance ton premier duel — tes matchs s&apos;afficheront ici.
          </p>
        </div>
      )}

      {/* La liste des matchs, du plus récent au plus ancien. */}
      {entries.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5"
            >
              <span
                className={`font-heading grid size-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${
                  e.won
                    ? 'bg-[oklch(0.55_0.14_155)]/30 text-[oklch(0.85_0.14_155)]'
                    : 'bg-destructive/25 text-[oklch(0.82_0.1_20)]'
                }`}
                aria-label={e.won ? 'Victoire' : 'Défaite'}
              >
                {e.won ? 'V' : 'D'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">
                  {e.opponent}
                </span>
                <span className="block text-xs font-semibold text-white/55">
                  {dayLabelFr(e.dayKey, todayKey)}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-extrabold tabular-nums ${
                  e.delta >= 0
                    ? 'bg-[oklch(0.55_0.14_155)]/25 text-[oklch(0.85_0.14_155)]'
                    : 'bg-destructive/20 text-[oklch(0.82_0.1_20)]'
                }`}
              >
                {e.delta >= 0 ? `+${e.delta}` : e.delta}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/60 tabular-nums">
                <TrophyIcon className="size-3.5 text-highlight" />
                {e.trophies}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Le pont pédagogique : rejouer ses erreurs alimente la maîtrise. */}
      <Link
        href="/reviser/revoir"
        className="defi2-press flex items-center gap-3 rounded-2xl border border-highlight/35 bg-highlight/12 px-4 py-3 focus-visible:ring-4 focus-visible:ring-highlight/40 focus-visible:outline-none"
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-highlight/20 text-highlight">
          <SwordsIcon className="size-5" />
          {reviewCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white/70 bg-destructive px-1 text-[0.6rem] font-extrabold text-white tabular-nums">
              {reviewCount > 99 ? '99+' : reviewCount}
            </span>
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block text-sm leading-tight font-extrabold text-white">
            Revoir mes erreurs
          </span>
          <span className="block text-xs font-semibold text-white/60">
            {reviewCount > 0
              ? `${reviewCount} question${reviewCount > 1 ? 's' : ''} à retravailler`
              : 'Rien à revoir, bravo !'}
          </span>
        </span>
        <ChevronRightIcon className="size-5 shrink-0 text-white/50" />
      </Link>
    </div>
  )
}
