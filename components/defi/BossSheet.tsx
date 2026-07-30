'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Flame, Gem, Hourglass, Swords, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { RANK_LABELS, MAX_BOSS_RANK } from '@/lib/bosses'
import {
  countdownLabel,
  teaseLabel,
  TRAQUE_MINUTES_EQUIV,
  type TraqueCard,
} from '@/lib/traque'

/**
 * La feuille « Boss » de l'arène — la carte de LA TRAQUE.
 *
 * On n'y choisit pas un combat : on y lit où en est chaque gardien. Une jauge
 * par matière, remplie par le travail réel (cartes révisées, bonnes réponses,
 * leçons, quiz). À 100 %, le gardien sort de sa tanière et reste défiable UNE
 * HEURE — sa carte passe en tête, en or, avec son compte à rebours.
 *
 * Le point clé : le CTA d'une carte non pleine renvoie sur RÉVISER, filtré sur
 * la matière. Le boss est un moteur de trafic vers le travail, pas un mode de
 * jeu de plus.
 *
 * Les cartes arrivent résolues du serveur (lib/traque-server.fetchTraqueBoard) ;
 * ce composant ne recalcule QUE le compte à rebours, qui se périmerait sinon
 * dès la seconde suivant le rendu.
 */
export default function BossSheet({ cards }: { cards: TraqueCard[] }) {
  // Une horloge unique pour toute la feuille : le rendu serveur est figé, la
  // fenêtre d'une heure, elle, s'écoule. On égrène à la demi-minute — assez
  // pour que « 12 min » ne mente jamais de plus de 30 s, sans réveiller le
  // téléphone toutes les secondes.
  const now = useClock(CLOCK_STEP_MS)

  if (cards.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="font-heading text-base font-extrabold text-white">
          Aucun gardien en vue
        </p>
        <p className="mt-1 text-sm font-semibold text-white/70">
          Choisis tes matières sur Réviser : chacune a son boss, et il se
          débusque en travaillant.
        </p>
        <Link
          href="/reviser"
          onClick={() => sfx.tap()}
          className="olympe-press mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-heading text-sm font-extrabold text-primary-foreground"
        >
          Aller réviser
        </Link>
      </div>
    )
  }

  const enChasse = cards.filter((c) => c.enChasse)

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* La règle du jeu, dite une fois, en haut : sans elle la jauge n'est
          qu'une barre de plus. */}
      <p className="rounded-2xl border border-white/12 bg-white/6 px-3 py-2 text-[0.7rem] leading-snug font-semibold text-white/75">
        Chaque matière a son gardien. <strong className="text-white">Il ne
        se choisit pas : il se débusque.</strong> Révise (~
        {TRAQUE_MINUTES_EQUIV} min) pour remplir sa jauge — à 100 % il sort, et
        tu as <strong className="text-white">une heure</strong> pour l&apos;abattre.
      </p>

      {enChasse.length > 0 ? (
        <p className="font-heading flex items-center gap-1.5 px-1 text-[0.68rem] font-extrabold tracking-widest text-highlight uppercase">
          <Flame className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          En chasse aujourd&apos;hui · gemmes doublées
        </p>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {cards.map((card) => (
          <li key={card.boss.id}>
            <TraqueRow card={card} now={now} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Le portrait du gardien : buste détouré si la DA est prête, emoji sinon. */
function BossFace({ card }: { card: TraqueCard }) {
  const ready = card.status === 'debusque'
  return (
    <span
      className={cn(
        'grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 text-3xl',
        ready
          ? 'border-highlight bg-highlight/15'
          : 'border-white/15 bg-white/8',
        // Le gardien qui rôde n'est qu'une OMBRE : on ne voit pas encore son
        // visage. C'est ce contraste qui rend l'apparition spectaculaire.
        !ready && 'brightness-[0.45] saturate-[0.35]',
      )}
      aria-hidden="true"
    >
      {card.boss.image ? (
        <Image
          src={card.boss.image}
          alt=""
          width={56}
          height={56}
          className="size-full scale-110 object-contain object-bottom"
        />
      ) : (
        card.boss.emoji
      )}
    </span>
  )
}

function TraqueRow({ card, now }: { card: TraqueCard; now: number | null }) {
  const ready = card.status === 'debusque'
  // Compte à rebours vivant : recalculé depuis la borne de fin. Tant que le
  // client n'a pas pris la main (SSR), on affiche la valeur du serveur.
  const remaining =
    now !== null && card.endsAt !== null
      ? Math.max(0, card.endsAt - now)
      : card.remainingMs
  // La fenêtre s'est refermée sous les yeux de l'élève : on cesse de proposer
  // un combat qui serait refusé par le serveur.
  const expired = ready && remaining <= 0

  return (
    <div
      className={cn(
        'rounded-2xl border p-3',
        ready && !expired
          ? 'border-highlight/70 bg-highlight/10 shadow-[0_0_24px_-6px_rgba(255,210,87,0.55)]'
          : 'border-white/12 bg-white/6',
      )}
    >
      <div className="flex items-center gap-3">
        <BossFace card={card} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-heading min-w-0 truncate text-base leading-tight font-extrabold text-white">
              {ready ? card.boss.name : '???'}
            </p>
            {card.enChasse ? (
              <span
                className="shrink-0 rounded-full bg-highlight px-1.5 py-px font-heading text-[0.55rem] font-extrabold text-foreground"
                aria-label="Boss en chasse aujourd'hui : gemmes doublées"
              >
                ×2 💎
              </span>
            ) : null}
          </div>
          <p className="truncate text-[0.7rem] font-bold text-white/60">
            {card.subject} · {RANK_LABELS[card.rank]}
          </p>

          {/* La jauge de traque. Elle vire à l'or dès qu'elle est pleine : la
              couleur dit l'état avant même que le texte soit lu. */}
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/35"
            role="progressbar"
            aria-label={`Traque de ${card.boss.name} : ${card.percent} %`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={card.percent}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                ready
                  ? 'bg-gradient-to-r from-highlight to-[#ff9f45]'
                  : 'bg-gradient-to-r from-[#8b53e8] to-[#cdb4f7]',
              )}
              style={{ width: `${Math.max(4, card.percent)}%` }}
            />
          </div>
        </div>

        <span className="shrink-0 font-mono text-xs font-bold text-white/70 tabular-nums">
          {card.percent}%
        </span>
      </div>

      {/* Ce qu'il reste à faire — en GESTES, jamais en pourcentage nu. */}
      <p className="mt-2 flex items-center gap-1.5 text-[0.72rem] font-semibold text-white/75">
        {ready && !expired ? (
          <>
            <Hourglass className="size-3.5 shrink-0 text-highlight" aria-hidden="true" />
            Il disparaît dans {countdownLabel(remaining)}
          </>
        ) : expired ? (
          <>Il s&apos;est recouché — sa jauge repart de la moitié.</>
        ) : (
          <>{teaseLabel(card.boss.name, card.points)}</>
        )}
      </p>

      <div className="mt-2.5 flex items-center gap-2">
        {ready && !expired ? (
          <Link
            href={`/defi/traque/${card.boss.id}`}
            onClick={() => sfx.tap()}
            className="olympe-press flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ffd257] to-[#eda50b] font-heading text-sm font-extrabold text-foreground shadow-[0_4px_0_#b17c02] focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
            Défier {card.boss.name}
          </Link>
        ) : (
          <Link
            href={card.subjectSlug ? `/reviser/${card.subjectSlug}` : '/reviser'}
            onClick={() => sfx.tap()}
            className="olympe-press flex h-11 flex-1 items-center justify-center rounded-full bg-primary font-heading text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_#2e1b54] focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
          >
            Réviser {card.subject} →
          </Link>
        )}

        {/* Ce qui est en jeu : la gemme est la monnaie du CONTENU — la battre
            ouvre une fiche de révision. La boucle se referme là. */}
        <span
          className="olympe-glass flex h-11 shrink-0 items-center gap-1 rounded-full px-3 font-heading text-sm font-extrabold tabular-nums"
          aria-label={`${card.gems} gemmes en cas de victoire`}
        >
          <Gem className="size-4 text-highlight" strokeWidth={2.4} aria-hidden="true" />
          {card.gems}
        </span>
      </div>

      {/* Le rituel hebdomadaire : « le mardi c'est Grammatork ». */}
      {!card.enChasse && card.backOn ? (
        <p className="mt-1.5 flex items-center gap-1 text-[0.62rem] font-bold text-white/45">
          <Star className="size-3 shrink-0" aria-hidden="true" />
          Gemmes doublées {card.backOn} · rang max {RANK_LABELS[MAX_BOSS_RANK]}
        </p>
      ) : null}
    </div>
  )
}
