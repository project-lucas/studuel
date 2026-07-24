import Image from 'next/image'
import { rankFor } from '@/lib/rank'
import RankBadge from '@/components/defi/RankBadge'

interface TrophyBlockProps {
  trophies: number
}

/**
 * La CARTOUCHE DE RANG, calée en haut à droite de l'arène (au-dessus du
 * parchemin du menu). Affiche le rang compétitif façon League of Legends : le
 * blason du palier, le total de trophées sur sa plaque de parchemin, le libellé
 * « Or III » et la barre de « LP » vers la division suivante.
 *
 * Elle vivait auparavant au centre bas, entre l'arène et le CTA : elle y
 * écrasait la scène et poussait le bouton de match hors du pouce. Compacte et
 * ancrée en coin, elle rend le centre de l'arène au décor — la lecture reste la
 * même (blason, nombre, progression), en trois fois moins de place.
 * Purement présentationnel : le mapping trophées → rang vit dans lib/rank.ts.
 */
export default function TrophyBlock({ trophies }: TrophyBlockProps) {
  const rank = rankFor(trophies)
  // Le rang juste au-dessus : relu au seuil de fin de division (null au sommet).
  const nextRank = rank.ceiling !== null ? rankFor(rank.ceiling) : null
  const pct = Math.round(rank.progress * 100)
  // Progression AU FORMAT « 20 / 100 » : les trophées dans la division courante
  // sur la largeur de la division (le palier suivant). Bien plus parlant qu'un
  // pourcentage nu — on lit d'un coup « il m'en manque 80 ». Null au sommet.
  const spanTarget = rank.ceiling !== null ? rank.ceiling - rank.floor : null
  const progressLabel =
    spanTarget !== null ? `${rank.inDivision} / ${spanTarget}` : null
  const nextLabel = nextRank
    ? `${rank.inDivision} sur ${spanTarget} vers ${nextRank.label}`
    : 'Sommet atteint — tu es Maître'

  return (
    <section className="flex w-[10.5rem] flex-col gap-1" aria-label="Ton rang">
      {/* Ligne haute : le blason vers le CENTRE (à gauche) et la plaque de
          trophées à l'EXTRÉMITÉ (bord droit), centrés sur LE MÊME AXE. Le blason
          s'aligne sur la plaque seule (pas sur toute la colonne, sinon il
          flotterait). */}
      <div className="flex items-center gap-1.5">
        {/* Le blason porte son intitulé en info-bulle + un libellé lecteur
            d'écran (plus une icône muette à côté du compteur). */}
        <span
          className="shrink-0"
          title={rank.label}
          aria-label={`Rang ${rank.label}`}
        >
          <RankBadge
            rank={rank}
            size={42}
            hideDivision
            className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
          />
        </span>

        <div className="trophy-plate trophy-plate--sm min-w-0 flex-1">
          <Image
            src="/images/defi/trophy-cup.webp"
            alt=""
            width={28}
            height={28}
            className="size-6 shrink-0 object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
            aria-hidden="true"
          />
          <span
            className="font-heading flex-1 text-center text-base font-extrabold tabular-nums text-[color:var(--foreground)]"
            aria-label={`${trophies} trophées`}
          >
            {trophies}
          </span>
        </div>
      </div>

      {/* Palier + division (la division n'est portée qu'ici, pas en double sur le
          blason → hideDivision), puis le ruban de LP. Calés SOUS la plaque : le
          padding gauche (largeur du blason + écart) les aligne sur la plaque et
          non sous le blason. */}
      <div className="flex flex-col gap-1 pl-12">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="font-heading text-[0.62rem] leading-none font-extrabold uppercase italic tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {rank.label}
          </span>
          {progressLabel ? (
            <span
              className="font-mono text-[0.58rem] leading-none font-bold tabular-nums text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              aria-hidden="true"
            >
              {progressLabel}
            </span>
          ) : null}
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full border border-[color:var(--foreground)]/25 bg-black/30"
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
