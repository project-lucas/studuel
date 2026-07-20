import Image from 'next/image'
import { rankFor } from '@/lib/rank'
import RankBadge from '@/components/defi/RankBadge'

interface TrophyBlockProps {
  trophies: number
}

/**
 * Le bloc rang, au-dessus de « Match classé ». Affiche le RANG compétitif façon
 * League of Legends : le blason du palier surmonté de sa division en chiffres
 * romains, le libellé « Or III », le total de trophées sur sa plaque de marbre
 * ciselée, et la barre de « LP » vers la division / le palier suivant. Le blason
 * lit sur le fond sombre de l'arène (drop-shadow), le libellé est en encre
 * claire. Purement présentationnel — le mapping trophées → rang vit dans
 * lib/rank.ts.
 */
export default function TrophyBlock({ trophies }: TrophyBlockProps) {
  const rank = rankFor(trophies)
  // Le rang juste au-dessus : relu au seuil de fin de division (null au sommet).
  const nextRank = rank.ceiling !== null ? rankFor(rank.ceiling) : null
  const pct = Math.round(rank.progress * 100)
  const nextLabel = nextRank
    ? `Encore ${rank.toNext} pour ${nextRank.label}`
    : 'Sommet atteint — tu es Maître'

  return (
    <section
      className="mx-auto flex w-full max-w-[19rem] flex-col items-center gap-1.5"
      aria-label="Ton rang"
    >
      {/* Palier + division, centré au-dessus (la division n'est donc portée
          qu'ici, pas en double sur le blason → hideDivision). */}
      <span className="font-heading text-lg font-extrabold uppercase italic tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {rank.label}
      </span>

      {/* Le blason illustré À GAUCHE, la plaque « parchemin » des trophées à
          droite (coupe or + nombre). Les rouleaux de parchemin en bout du ruban
          remplacent les anciennes gemmes violettes. */}
      <div className="flex w-full items-center justify-center gap-2.5">
        <RankBadge
          rank={rank}
          size={64}
          hideDivision
          className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
        />
        <div className="trophy-plate flex-1">
          <Image
            src="/images/defi/trophy-cup.webp"
            alt=""
            width={44}
            height={44}
            className="size-10 shrink-0 object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
            aria-hidden="true"
          />
          <span
            className="font-heading flex-1 text-center text-2xl font-extrabold tabular-nums text-[color:var(--foreground)]"
            aria-label={`${trophies} trophées`}
          >
            {trophies}
          </span>
          {/* Contrepoids symétrique à la coupe pour centrer le nombre. */}
          <span className="size-10 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* Barre de LP vers la division / le palier suivant — fin ruban doré. */}
      <div className="w-11/12">
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
      </div>
    </section>
  )
}
