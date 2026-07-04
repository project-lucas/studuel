import { cn } from '@/lib/utils'

// Anneau hebdomadaire : 7 segments (lundi → dimanche) qui se remplissent
// quand la session du jour est faite. La série 🔥 s'affiche au centre.
// Composant pur (SVG), rendu côté serveur.

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const SIZE = 220
const CENTER = SIZE / 2
const RADIUS = 88
const LETTER_RADIUS = RADIUS + 20
const SEGMENT_GAP = 10 // degrés de vide entre segments
const START = -90 // lundi en haut

function polar(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  }
}

function arcPath(startDeg: number, endDeg: number) {
  const s = polar(startDeg, RADIUS)
  const e = polar(endDeg, RADIUS)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export default function WeekRing({
  week,
  streak,
}: {
  week: { done: boolean; isToday: boolean; isFuture: boolean }[]
  streak: number
}) {
  const span = 360 / 7

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-56 max-w-full"
      role="img"
      aria-label={`Série de ${streak} jour${streak > 1 ? 's' : ''} — ${week.filter((d) => d.done).length} jour(s) fait(s) cette semaine`}
    >
      {week.map((day, i) => {
        const a0 = START + i * span + SEGMENT_GAP / 2
        const a1 = START + (i + 1) * span - SEGMENT_GAP / 2
        const letterPos = polar(START + (i + 0.5) * span, LETTER_RADIUS)
        return (
          <g key={i}>
            <path
              d={arcPath(a0, a1)}
              fill="none"
              strokeWidth={day.isToday ? 15 : 11}
              strokeLinecap="round"
              className={cn(
                'transition-all',
                day.done
                  ? 'stroke-highlight'
                  : day.isToday
                    ? 'stroke-primary/35'
                    : 'stroke-muted',
              )}
            />
            <text
              x={letterPos.x}
              y={letterPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                'font-mono text-[11px]',
                day.isToday
                  ? 'fill-primary font-bold'
                  : day.done
                    ? 'fill-foreground'
                    : 'fill-muted-foreground',
              )}
            >
              {DAY_LETTERS[i]}
            </text>
          </g>
        )
      })}

      {/* Centre : flamme + série */}
      <text
        x={CENTER}
        y={CENTER - 26}
        textAnchor="middle"
        className="text-[26px]"
      >
        🔥
      </text>
      <text
        x={CENTER}
        y={CENTER + 14}
        textAnchor="middle"
        className="fill-foreground font-mono text-[40px] font-bold tabular-nums"
      >
        {streak}
      </text>
      <text
        x={CENTER}
        y={CENTER + 38}
        textAnchor="middle"
        className="fill-muted-foreground text-[12px]"
      >
        jour{streak > 1 ? 's' : ''} de série
      </text>
    </svg>
  )
}
