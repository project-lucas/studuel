'use client'

import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import {
  countdownLabel,
  gapHeadline,
  myShare,
  type ClanWeekBoard,
} from '@/lib/clan-week'

/**
 * Le coffre d'équipe de la semaine (clan hebdo, migration 204), vu depuis
 * l'onglet Amis : l'objectif commun en jauge — une raison de revenir chaque
 * jour. Le détail (classement des clans, réclamation du coffre) vit sur le
 * Défi ; cette carte y emmène.
 */
export default function TeamChestCard({
  board,
  today,
}: {
  board: ClanWeekBoard
  today: string
}) {
  const mine = board.myClan
  if (!mine) return null

  const share = myShare(board)

  return (
    <Link
      href="/defi"
      onClick={() => sfx.tap()}
      aria-label={`Coffre d'équipe de la semaine — ${mine.points.toLocaleString('fr-FR')} points, ${countdownLabel(today)}`}
      className="block rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_22%)] p-4 text-primary-foreground shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold tracking-widest text-primary-foreground/70 uppercase">
            Coffre d&apos;équipe · {countdownLabel(today)}
          </p>
          <p className="font-heading mt-0.5 truncate text-lg leading-tight font-extrabold">
            {mine.points.toLocaleString('fr-FR')} pts —{' '}
            {mine.rank === 1 ? '1ᵉʳ' : `${mine.rank}ᵉ`} · {mine.schoolName}
          </p>
        </div>
        <span aria-hidden="true" className="shrink-0 text-3xl">
          🎁
        </span>
      </div>
      {/* Ta part du total : la contribution personnelle rend le collectif
          concret — c'est elle qui donne le droit d'ouvrir le coffre. */}
      <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/25">
        <div
          className="h-full rounded-full bg-highlight transition-all duration-700"
          style={{ width: `${share}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-primary-foreground/80">
        Ton apport : {board.myPoints.toLocaleString('fr-FR')} pts ({share}%) ·{' '}
        {gapHeadline(board)}
      </p>
    </Link>
  )
}
