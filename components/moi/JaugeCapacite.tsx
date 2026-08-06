import {
  BookOpen,
  Brain,
  Droplet,
  Moon,
  type LucideIcon,
} from 'lucide-react'
import {
  DRIVER_WINDOW_DAYS,
  type DriverKey,
  type DriverScore,
} from '@/lib/capacite-drivers'

// LA CAPACITÉ — déménagée de la hero card vers la page des habitudes.
//
// Le calcul n'a pas changé (lib/capacite-drivers) ; sa PLACE, si. En tête de
// l'onglet Moi, « Capacité 8 · plafond 95 » avec trois drivers à 0 % était la
// première chose qu'un élève lisait sur l'écran qui porte son nom : une note,
// basse, sur une échelle qu'il ne pouvait relier à rien de ce qu'il avait fait.
//
// Ici, entourée des habitudes qui la produisent, elle redevient ce qu'elle est :
// le cadran d'un système qu'on règle. Chaque driver à 0 % désigne une habitude à
// activer juste en dessous — le chiffre a enfin un bouton à côté de lui.

const DRIVER_ICONS: Record<DriverKey, LucideIcon> = {
  sommeil: Moon,
  hydratation: Droplet,
  concentration: Brain,
  regularite: BookOpen,
}

function Anneau({
  capacite,
  plafond,
}: {
  capacite: number | null
  plafond: number | null
}) {
  const R = 64
  const C = 2 * Math.PI * R
  const filled = capacite === null ? 0 : (capacite / 100) * C

  return (
    <div className="relative mx-auto w-fit">
      <svg
        viewBox="0 0 160 160"
        className="size-32"
        role="img"
        aria-label={
          capacite === null
            ? 'Capacité inconnue — active une habitude pour la mesurer'
            : `Capacité ${capacite} sur 100, plafond possible ${plafond ?? '—'}`
        }
      >
        <defs>
          <linearGradient id="jauge-capacite-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-emerald-300)" />
            <stop offset="100%" stopColor="var(--destructive)" />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={R}
          fill="none"
          stroke="currentColor"
          className="text-white/15"
          strokeWidth="13"
        />
        {/* Pas d'arc à 0 : le strokeLinecap rond dessinerait un point parasite. */}
        {filled > 0 ? (
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="url(#jauge-capacite-grad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${C}`}
            transform="rotate(-90 80 80)"
          />
        ) : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-white/85">Capacité</span>
        <span className="font-heading text-3xl leading-none font-extrabold tabular-nums">
          {capacite ?? '—'}
        </span>
      </div>
      {plafond !== null ? (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex size-10 items-center justify-center rounded-full border-2 border-white/45 bg-white/10 font-mono text-sm font-extrabold text-white/90 tabular-nums"
        >
          {plafond}
        </span>
      ) : null}
    </div>
  )
}

export default function JaugeCapacite({
  capacite,
  plafond,
  drivers,
}: {
  capacite: number | null
  plafond: number | null
  drivers: DriverScore[]
}) {
  const marge = capacite !== null && plafond !== null ? plafond - capacite : null

  return (
    <section
      aria-label="Ma capacité"
      className="moi-hero moi-card relative overflow-hidden rounded-3xl p-4 text-white"
    >
      <span
        aria-hidden="true"
        className="moi-blob absolute -top-10 -right-8 h-24 w-24 rounded-full"
      />

      <div className="relative flex items-center gap-4">
        <Anneau capacite={capacite} plafond={plafond} />
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg leading-tight font-bold">
            Ton plafond invisible
          </h2>
          <p className="mt-1 text-sm leading-snug text-white/85">
            {marge !== null && marge > 0
              ? `Tes habitudes des ${DRIVER_WINDOW_DAYS} derniers jours te placent à ${capacite}. En les tenant, tu montes à ${plafond}.`
              : capacite === null
                ? `Active une habitude ci-dessous : l’app mesure alors ta constance sur ${DRIVER_WINDOW_DAYS} jours.`
                : 'Tes habitudes tiennent. C’est exactement ce plafond-là qu’il faut garder.'}
          </p>
        </div>
      </div>

      {/* Les 4 drivers : chacun nomme la famille d'habitudes qui le remplit. */}
      <div className="relative mt-3 grid grid-cols-2 gap-2">
        {drivers.map((d) => {
          const Icon = DRIVER_ICONS[d.key]
          return (
            <div
              key={d.key}
              className="flex items-center gap-2 rounded-2xl bg-white/12 px-2.5 py-2 ring-1 ring-white/20"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white/85">
                  {d.label}
                </p>
                <p className="font-mono text-sm leading-none font-extrabold tabular-nums">
                  {d.score === null ? '—' : `${d.score}%`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
