import type { Season } from '@/lib/defi/types'
import { ClockIcon, CrownIcon } from './icons'

interface SeasonBannerProps {
  season: Season
}

/**
 * Bandeau de saison compact : nom + temps restant à gauche, aperçu de la
 * récompense de fin de saison en badge à droite. Fond dégradé violet de marque.
 */
export default function SeasonBanner({ season }: SeasonBannerProps) {
  return (
    <section
      className="defi2-banner relative overflow-hidden text-white"
      aria-label={`Saison en cours : ${season.name}`}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-heading truncate text-lg leading-tight font-extrabold">
            {season.name}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white/75">
            <ClockIcon className="size-4 shrink-0" />
            {season.endsInLabel}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-1.5 pr-3 pl-2 backdrop-blur-sm"
          title={`Récompense de fin de saison : ${season.rewardLabel}`}
        >
          <span className="grid size-8 place-items-center rounded-xl bg-highlight/90 text-[oklch(0.28_0.06_75)]">
            <CrownIcon className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[0.62rem] font-bold tracking-wide text-white/65 uppercase">
              Récompense
            </p>
            <p className="max-w-28 truncate text-xs font-bold text-white">
              {season.rewardLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
