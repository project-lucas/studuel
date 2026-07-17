import Image from 'next/image'
import { arenaProgress } from '@/lib/defi/arena'

interface TrophyBlockProps {
  trophies: number
}

/**
 * Le bloc trophées, descendu du centre de l'arène vers la pile d'actions (au-
 * dessus de « Match classé »). La plaque illustrée (`trophee.webp` : coupe or à
 * gauche, panneau marbre à droite) sert de cadre ; le nombre est posé dans le
 * panneau, et la progression vers l'arène suivante tient sur un fin ruban doré
 * juste en dessous. Purement présentationnel (`arenaProgress` fait le calcul).
 */
export default function TrophyBlock({ trophies }: TrophyBlockProps) {
  const p = arenaProgress(trophies)
  const pct = Math.round(p.ratio * 100)
  const nextLabel =
    p.next && p.remaining !== null
      ? `Encore ${p.remaining} pour ${p.next.name}`
      : 'Sommet atteint — tu es au Grand Oral'

  return (
    <section className="flex w-full flex-col items-center" aria-label="Tes trophées">
      {/* Plaque illustrée : le nombre est centré dans le panneau marbre de droite
          (l'illustration réserve la coupe or à gauche). */}
      <div className="relative w-full">
        <Image
          src="/images/defi/modes/trophee.webp"
          alt=""
          width={1000}
          height={264}
          priority
          className="h-auto w-full select-none"
          aria-hidden
        />
        <span
          className="font-heading absolute inset-y-0 left-[35%] right-[13%] flex items-center justify-center text-3xl font-extrabold tabular-nums text-[color:var(--foreground)]"
          aria-label={`${trophies} trophées`}
        >
          {trophies}
        </span>
      </div>

      {/* Progression vers l'arène suivante — fin ruban doré + caption crème. */}
      <div className="-mt-1 w-11/12">
        <div
          className="h-2 w-full overflow-hidden rounded-full border border-[color:var(--foreground)]/25 bg-black/25"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={nextLabel}
        >
          <div
            className="bar-fill h-full rounded-full bg-gradient-to-r from-[#fcd34d] to-[#f9b233] shadow-[0_0_10px_color-mix(in_oklch,var(--highlight),transparent_40%)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-center text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(36,48,79,0.9)]">
          {nextLabel}
        </p>
      </div>
    </section>
  )
}
