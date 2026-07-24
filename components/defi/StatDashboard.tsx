'use client'

import {
  Swords,
  Trophy,
  Flame,
  Zap,
  Clock,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { ProfileSummary } from '@/lib/profile-stats'

// Une tuile de stat : icône, valeur proéminente, libellé, et une note optionnelle
// (record, sous-total). Sur fond sombre d'arène → carte de verre (olympe-glass).
function StatTile({
  Icon,
  value,
  label,
  note,
}: {
  Icon: LucideIcon
  value: string
  label: string
  note?: string
}) {
  return (
    <div className="olympe-glass flex flex-col gap-1 rounded-2xl p-3">
      <Icon className="size-5 text-highlight" aria-hidden="true" />
      <p className="font-heading text-xl font-extrabold text-white tabular-nums">
        {value}
      </p>
      <p className="text-[11px] leading-tight font-semibold text-white/70">
        {label}
      </p>
      {note ? (
        <p className="text-[10px] leading-tight text-white/50 tabular-nums">
          {note}
        </p>
      ) : null}
    </div>
  )
}

// Le tableau de bord : les stats clés du profil, en grille de tuiles. Toutes
// les valeurs viennent de `buildProfileSummary` (lib pure) — ici, que du rendu.
export default function StatDashboard({ summary }: { summary: ProfileSummary }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatTile
        Icon={Swords}
        value={String(summary.gamesPlayed)}
        label="Parties"
        note={`${summary.wins} V · ${summary.winRateLabel}`}
      />
      <StatTile
        Icon={Trophy}
        value={summary.trophies.toLocaleString('fr-FR')}
        label="Trophées"
        note={`Record ${summary.bestTrophies.toLocaleString('fr-FR')}`}
      />
      <StatTile
        Icon={Flame}
        value={String(summary.currentStreak)}
        label="Série"
        note={`Record ${summary.bestStreak} j`}
      />
      <StatTile
        Icon={Zap}
        value={summary.totalXp.toLocaleString('fr-FR')}
        label="XP total"
        note={`Niveau ${summary.level}`}
      />
      <StatTile
        Icon={Clock}
        value={summary.studyTimeLabel}
        label="Temps de jeu"
      />
      <StatTile
        Icon={Target}
        value={summary.preferredSubject ?? '—'}
        label="Matière préférée"
      />
    </div>
  )
}
