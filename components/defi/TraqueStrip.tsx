'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { restantLabel, type TraqueCard } from '@/lib/traque'

/**
 * LE BANDEAU DES GARDIENS DU JOUR — les jauges de traque À DÉCOUVERT sur
 * l'arène, sans ouvrir la moindre feuille.
 *
 * La progression vivait uniquement dans la feuille Boss : il fallait savoir
 * qu'elle existait, taper la tuile du rail, puis lire. Une jauge qu'on ne voit
 * pas ne donne envie de rien. Elle remonte donc au-dessus du bloc d'action,
 * juste sous la scène : deux barres, le temps d'un coup d'œil, et un tap qui
 * mène là où on les remplit — RÉVISER la matière.
 *
 * Le gardien reste une OMBRE tant qu'il rôde (son portrait est assombri, son
 * nom masqué) : c'est ce qui rend l'apparition spectaculaire. À 100 %, il sort,
 * la barre vire à l'or, et le tap mène au combat.
 *
 * Les cartes arrivent résolues du serveur (lib/traque.dayBossCards) — ce
 * composant ne décide de rien, il montre.
 */
export default function TraqueStrip({ cards }: { cards: TraqueCard[] }) {
  if (cards.length === 0) return null

  return (
    <ul className="flex items-stretch gap-2" aria-label="Gardiens du jour">
      {cards.map((card) => (
        <li key={card.boss.id} className="min-w-0 flex-1">
          <TraqueGaugeChip card={card} />
        </li>
      ))}
    </ul>
  )
}

function TraqueGaugeChip({ card }: { card: TraqueCard }) {
  const ready = card.status === 'debusque'
  const href = ready
    ? `/defi/traque/${card.boss.id}`
    : card.subjectSlug
      ? `/reviser/${card.subjectSlug}`
      : '/reviser'

  return (
    <Link
      href={href}
      onClick={() => sfx.tap()}
      aria-label={
        ready
          ? `${card.boss.name} est sorti de sa tanière en ${card.subject} — le défier`
          : `Traque en ${card.subject} : ${card.percent} %. ${restantLabel(card.points)}. Aller réviser.`
      }
      className={cn(
        'olympe-press flex h-full items-center gap-2 rounded-2xl border px-2 py-1.5 focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none',
        ready
          ? 'border-highlight/70 bg-highlight/12 shadow-[0_0_18px_-6px_rgba(255,210,87,0.6)]'
          : 'olympe-glass border-white/12',
      )}
    >
      {/* Le portrait : ombre tant qu'il rôde, en pleine lumière une fois sorti. */}
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border text-lg',
          ready
            ? 'border-highlight/80 bg-black/25'
            : 'border-white/15 bg-black/25 brightness-[0.45] saturate-[0.35]',
        )}
        aria-hidden="true"
      >
        {card.boss.image ? (
          <Image
            src={card.boss.image}
            alt=""
            width={32}
            height={32}
            className="size-full scale-110 object-contain object-bottom"
          />
        ) : (
          card.boss.emoji
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1">
          <span className="font-heading min-w-0 flex-1 truncate text-[0.68rem] leading-tight font-extrabold text-white">
            {ready ? card.boss.name : card.subject}
          </span>
          {/* Le bonus du jour se dit d'un picto : le texte « ×2 » vit dans la
              feuille, la place manque ici. */}
          {card.enChasse && !ready ? (
            <Flame
              className="size-3 shrink-0 text-highlight"
              strokeWidth={2.8}
              aria-hidden="true"
            />
          ) : null}
          <span className="shrink-0 font-mono text-[0.62rem] font-bold text-white/70 tabular-nums">
            {ready ? 'prêt' : `${card.percent}%`}
          </span>
        </span>

        <span
          className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-black/40"
          role="progressbar"
          aria-label={`Traque de ${card.subject}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={card.percent}
        >
          <span
            className={cn(
              'block h-full rounded-full transition-all duration-700',
              ready
                ? 'bg-gradient-to-r from-highlight to-[#ff9f45]'
                : 'bg-gradient-to-r from-[#8b53e8] to-[#cdb4f7]',
            )}
            style={{ width: `${Math.max(4, card.percent)}%` }}
          />
        </span>
      </span>
    </Link>
  )
}
