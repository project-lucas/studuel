import {
  tournamentStatusLabel,
  type TournamentBoard,
} from '@/lib/tournament'
import { CrownIcon, TrophyIcon } from './icons'

interface SchoolTournamentProps {
  board: TournamentBoard
  /** Clé de jour UTC courante (libellé d'état + fenêtre). */
  todayKey: string
  /** Vitrine mockée (visiteur / migration 162 pas encore passée). */
  isDemo?: boolean
}

/**
 * « Tournoi des écoles » (feuille Mon clan) — le week-end, chaque XP gagné en
 * défi compte pour ton école ; en semaine, les résultats du dernier tournoi.
 * Purement présentationnel — fenêtre et classement viennent de lib/tournament.
 */
export default function SchoolTournament({
  board,
  todayKey,
  isDemo = false,
}: SchoolTournamentProps) {
  const status = tournamentStatusLabel(todayKey)
  const top = board.standings.slice(0, 5)
  const mine = board.standings.find((s) => s.schoolId === board.mySchoolId)

  return (
    <section
      aria-label="Tournoi des écoles"
      className="rounded-2xl border border-white/12 bg-white/6"
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-highlight/20 text-highlight">
          <CrownIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base leading-tight font-extrabold text-white">
            Tournoi des écoles
          </h3>
          <p className="text-xs font-semibold text-white/60">{status}</p>
        </div>
        {isDemo ? (
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-extrabold tracking-wide text-white/60 uppercase">
            Aperçu
          </span>
        ) : null}
      </div>

      <p className="px-4 pt-2 text-xs font-semibold text-white/55">
        {!board.isOpen && top.length > 0
          ? 'Résultats du dernier week-end — chaque XP gagné en défi compte pour ton école.'
          : 'Le week-end, chaque XP gagné en défi compte pour ton école.'}
      </p>

      {top.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1.5 px-3 pb-3">
          {top.map((s) => {
            const isMine = s.schoolId === board.mySchoolId
            return (
              <li
                key={s.schoolId}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${
                  isMine
                    ? 'border border-highlight/45 bg-highlight/12'
                    : 'bg-white/5'
                }`}
              >
                <span
                  className={`font-heading w-6 shrink-0 text-center text-sm font-extrabold tabular-nums ${
                    s.rank === 1 ? 'text-highlight' : 'text-white/60'
                  }`}
                  aria-hidden
                >
                  {s.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">
                    {s.name}
                    {isMine ? (
                      <span className="ml-1.5 rounded-full bg-highlight px-1.5 py-0.5 text-[0.55rem] font-extrabold text-[oklch(0.24_0.06_75)] uppercase">
                        Toi
                      </span>
                    ) : null}
                  </span>
                  {s.city ? (
                    <span className="block truncate text-[0.65rem] font-semibold text-white/45">
                      {s.city}
                      {s.students > 0
                        ? ` · ${s.students} élève${s.students > 1 ? 's' : ''}`
                        : ''}
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-white tabular-nums">
                  <TrophyIcon className="size-3.5 text-highlight" />
                  {s.points}
                </span>
              </li>
            )
          })}
          {/* Mon école hors top 5 : sa ligne en rappel sous le podium. */}
          {mine && !top.some((s) => s.schoolId === mine.schoolId) ? (
            <li className="flex items-center gap-2.5 rounded-xl border border-highlight/45 bg-highlight/12 px-2.5 py-2">
              <span
                className="font-heading w-6 shrink-0 text-center text-sm font-extrabold text-white/60 tabular-nums"
                aria-hidden
              >
                {mine.rank}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">
                {mine.name}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-white tabular-nums">
                <TrophyIcon className="size-3.5 text-highlight" />
                {mine.points}
              </span>
            </li>
          ) : null}
        </ul>
      ) : (
        <p className="px-4 pb-4 pt-3 text-center text-sm font-semibold text-white/60">
          Aucune école au classement pour l&apos;instant — rejoins la tienne et
          lance le mouvement !
        </p>
      )}
    </section>
  )
}
