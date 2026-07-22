import { Flame } from 'lucide-react'
import BackButton from '@/components/BackButton'
import SubjectIcon from '@/components/SubjectIcon'
import GemIcon from '@/components/ui/GemIcon'
import { cn } from '@/lib/utils'
import { subjectTheme, subjectDecor, GRID_PATTERN } from '@/lib/subject-style'
import type { SubjectProgress } from '@/lib/subject-template'

// Header de la page matière : retour, icône + nom (depuis la base), niveau,
// progression globale « X/Y chapitres · Z% » + barre, et l'économie en haut à
// droite — solde de gemmes 💎 et série 🔥 (jours consécutifs avec au moins une
// session, la même flamme que l'accueil Réviser). Le décor d'arène de la
// matière habille le fond quand il existe, sinon la tuile colorée du thème.
export default function SubjectHeader({
  subject,
  grade,
  progress,
  gems,
  streak,
  children,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  progress: SubjectProgress
  gems: number
  streak: number
  children?: React.ReactNode // barre d'onglets, rendue dans le monde coloré
}) {
  const theme = subjectTheme(subject.color)
  const decor = subjectDecor(subject.slug)

  return (
    <header
      className={cn(
        'relative overflow-hidden px-4 pt-20 pb-10 text-white md:px-8 md:pt-12',
        decor ? null : cn('arena-tile', theme.arena),
      )}
      style={
        decor
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(10,14,30,0.45), rgba(10,14,30,0.15) 45%, rgba(10,14,30,0.4)), url(${decor})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }
          : undefined
      }
    >
      {decor ? null : (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <BackButton fallback="/reviser" label="Retour aux matières" />

          {/* Économie : 💎 puis 🔥. La flamme reste le SEUL dégradé ambre→orange
              autorisé hors tokens (série uniquement, cf. design system). */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-sm font-bold tabular-nums backdrop-blur-sm"
              aria-label={`${gems} gemmes`}
            >
              <GemIcon className="size-4" aria-hidden="true" />
              {gems}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1.5 text-sm font-bold tabular-nums backdrop-blur-sm"
              aria-label={`Série de ${streak} jour${streak > 1 ? 's' : ''}`}
            >
              <Flame
                className={cn(
                  'size-4',
                  streak > 0
                    ? 'fill-orange-500 text-amber-400'
                    : 'text-white/50',
                )}
                aria-hidden="true"
              />
              {streak}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.25)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-gradient-to-b from-white/40 to-transparent"
            />
            <SubjectIcon
              slug={subject.slug}
              className="size-7 drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.35)]"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-bold md:text-4xl">
              {subject.name}
            </h1>
            <p className="text-sm font-medium opacity-70">
              Programme de {grade} · {progress.done}/{progress.total} chapitres
              · {progress.pct}%
            </p>
          </div>
        </div>

        {/* Barre de progression globale de la matière */}
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/25"
          role="progressbar"
          aria-label={`${subject.name} — ${progress.done} chapitres sur ${progress.total}, ${progress.pct}% travaillé`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.pct}
        >
          <div
            className="bar-fill h-full rounded-full bg-highlight transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>

        {children}
      </div>
    </header>
  )
}
