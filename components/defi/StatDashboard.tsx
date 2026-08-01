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
import type { ReactNode } from 'react'
import type { ProfileSummary } from '@/lib/profile-stats'
import StandingLine from '@/components/StandingLine'
import { EMPTY_STANDINGS, type GradeStandings } from '@/lib/percentile'

// Une tuile de stat : icône, valeur proéminente, libellé, et une note optionnelle
// (record, sous-total). Sur fond sombre d'arène → carte de verre (olympe-glass).
function StatTile({
  Icon,
  value,
  label,
  note,
  extra = null,
}: {
  Icon: LucideIcon
  value: string
  label: string
  note?: string
  /** Ligne libre sous la note — sert la traduction en pourcentage. */
  extra?: ReactNode
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
      {extra}
    </div>
  )
}

// Le tableau de bord : les stats clés du profil, en grille de tuiles. Toutes
// les valeurs viennent de `buildProfileSummary` (lib pure) — ici, que du rendu.
export default function StatDashboard({
  summary,
  standings = EMPTY_STANDINGS,
}: {
  summary: ProfileSummary
  /** Place dans la cohorte de niveau — ici la mesure TROPHÉES (l'arène). */
  standings?: GradeStandings
}) {
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
        // Ce que le chiffre veut DIRE. Un total de trophées ne parle qu'à qui
        // connaît déjà l'échelle ; « top 2 % des 3e » se comprend seul. En or,
        // parce que c'est une distinction — et la seule ligne de la tuile qui
        // ne soit pas un simple compteur.
        extra={
          <StandingLine
            standing={standings.trophies}
            grade={standings.grade}
            className="text-highlight"
          />
        }
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
