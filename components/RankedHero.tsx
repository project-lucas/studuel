'use client'

import Image from 'next/image'
import { Trophy, Swords, ChevronUp, ChevronDown, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  rankPlayers,
  rivalAhead,
  rivalBehind,
  type RankPlayer,
} from '@/lib/trophies'
import { rankFor } from '@/lib/rank'
import RankBadge from '@/components/defi/RankBadge'

// LE hero du Défi : la carte de classement. Où j'en suis (trophées + rang LoL :
// palier + division romaine), où je me situe face à mes amis, et le bouton qui
// lance un match classé. Carte crème (lisible sur le fond sombre de l'Arène),
// accents violet + or.
export default function RankedHero({
  trophies,
  bestTrophies,
  players,
  onPlay,
}: {
  trophies: number
  bestTrophies: number
  players: RankPlayer[] // moi + amis (avec isMe sur moi)
  onPlay: () => void
}) {
  const rank = rankFor(trophies)
  // Le rang juste au-dessus : on relit le rang au seuil de fin de division.
  // (null au sommet, Maître — échelle ouverte.)
  const nextRank = rank.ceiling !== null ? rankFor(rank.ceiling) : null
  const rows = rankPlayers(players)
  const meIdx = rows.findIndex((r) => r.isMe)
  const myRank = meIdx >= 0 ? meIdx + 1 : 1
  const ahead = rivalAhead(rows)
  const behind = rivalBehind(rows)
  const friendCount = players.filter((p) => !p.isMe).length

  // Fenêtre du mini-classement : le rival devant, moi, le poursuivant derrière.
  const window = meIdx >= 0
    ? rows.slice(Math.max(0, meIdx - 1), meIdx + 2)
    : rows.slice(0, 3)

  return (
    <section
      aria-label="Classement"
      className="w-full max-w-sm overflow-hidden rounded-3xl bg-card text-left shadow-xl ring-1 ring-black/5"
    >
      {/* Bandeau rang : blason + palier/division + record. */}
      <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2.5 text-primary-foreground">
        <span className="flex items-center gap-2 text-sm font-bold">
          <RankBadge rank={rank} size={30} hideDivision />
          <span className="font-heading tracking-wide uppercase italic">
            {rank.label}
          </span>
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums">
          <Crown className="size-3 text-highlight" aria-hidden="true" /> {bestTrophies}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Trophées + place dans le classement d'amis. */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-4xl leading-none font-extrabold tabular-nums">
              <Image
                src="/images/defi/trophy-cup.webp"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
                aria-hidden="true"
              />
              {trophies}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              trophées
            </p>
          </div>
          {friendCount > 0 ? (
            <div className="text-right">
              <p className="font-heading text-2xl font-extrabold text-primary tabular-nums">
                {myRank}
                <span className="text-sm">
                  {myRank === 1 ? 'er' : 'e'}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                sur {friendCount + 1} amis
              </p>
            </div>
          ) : null}
        </div>

        {/* Progression (LP) vers la division / le palier suivant. */}
        {nextRank ? (
          <div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`Progression vers ${nextRank.label}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(rank.progress * 100)}
            >
              <div
                className="h-full rounded-full bg-highlight transition-all"
                style={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Encore <span className="font-bold text-foreground">{rank.toNext}</span> pour{' '}
              {nextRank.tier.emoji} {nextRank.label}
            </p>
          </div>
        ) : (
          <p className="text-[11px] font-semibold text-primary">
            Rang maximal atteint — reste Maître 👑
          </p>
        )}

        {/* Objectif : doubler le rival juste devant (ou tenir sa place). */}
        {ahead ? (
          <div className="flex items-center gap-2 rounded-2xl bg-accent/50 px-3 py-2 text-sm">
            <ChevronUp className="size-4 shrink-0 text-green-600" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="font-bold">{ahead.name}</span> est devant toi
            </span>
            <span className="flex shrink-0 items-center gap-1 font-mono text-xs font-bold text-primary tabular-nums">
              +{ahead.trophies - trophies}
              <Trophy className="size-3 text-highlight" aria-hidden="true" />
            </span>
          </div>
        ) : friendCount > 0 ? (
          <div className="flex items-center gap-2 rounded-2xl bg-highlight/25 px-3 py-2 text-sm font-semibold">
            <Crown className="size-4 shrink-0 text-highlight" aria-hidden="true" />
            Tu domines tes amis — garde ta couronne !
          </div>
        ) : null}

        {/* Mini-classement autour de moi. */}
        {window.length > 1 ? (
          <ol className="overflow-hidden rounded-2xl ring-1 ring-black/5">
            {window.map((r) => (
              <li
                key={r.id}
                className={cn(
                  'flex items-center gap-2.5 border-b bg-card px-3 py-2 text-sm last:border-b-0',
                  r.isMe && 'bg-accent/40',
                )}
              >
                <span className="w-5 shrink-0 text-center font-mono text-xs font-bold text-muted-foreground tabular-nums">
                  {r.rank}
                </span>
                <span aria-hidden="true" className="text-lg">
                  {r.emoji}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate',
                    r.isMe ? 'font-bold' : 'font-medium',
                  )}
                >
                  {r.name}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-mono text-xs font-bold tabular-nums">
                  {r.trophies}
                  <Trophy className="size-3 text-highlight" aria-hidden="true" />
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {behind && !ahead ? (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ChevronDown className="size-3.5 text-destructive" aria-hidden="true" />
            {behind.name} te talonne à {trophies - behind.trophies} trophées
          </p>
        ) : null}

        {/* LE bouton — lance un match classé. */}
        <button
          type="button"
          onClick={onPlay}
          className="press-3d-deep mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 font-heading text-base font-extrabold tracking-wide text-primary-foreground uppercase italic transition-transform active:scale-[0.99]"
        >
          <Swords className="size-5" aria-hidden="true" /> Match classé
        </button>
        <p className="-mt-1 text-center text-[11px] text-muted-foreground">
          BO3 · tes trophées sont en jeu
        </p>
      </div>
    </section>
  )
}
