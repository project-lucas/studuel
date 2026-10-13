'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Flame, Hourglass, Swords, Star } from 'lucide-react'
import XpIcon from '@/components/ui/XpIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { RANK_LABELS, MAX_BOSS_RANK } from '@/lib/bosses'
import {
  countdownLabel,
  restantLabel,
  sortCards,
  TRAQUE_MINUTES_EQUIV,
  type TraqueCard,
} from '@/lib/traque'
import s from './BossSheet.module.css'

/**
 * La feuille « Boss » de l'arène — la carte de LA TRAQUE, en TANIÈRES
 * (13/10/2026, maquette « B » choisie par Lucas : « le fond violet c'est
 * froid… il faut que ça donne envie de les affronter » ; puis « je veux le
 * titre du boss et rien d'autre, la bannière doit être épurée »).
 *
 * On n'y choisit pas un combat : on y lit où en est chaque gardien. Une jauge
 * par matière, remplie par le travail réel (cartes révisées, bonnes réponses,
 * leçons, quiz). À 100 %, le gardien sort de sa tanière et reste défiable UNE
 * HEURE — sa carte se cercle d'or, avec son compte à rebours.
 *
 * Chaque gardien est SA SCÈNE (la bannière du mode Boss et du billet de la
 * porte Jeux) et n'y porte que son nom, cerné. Dessous, la bande blanche : la
 * légende de l'état, la jauge d'or, le bouton et le gain. Celui qui rôde est
 * une ombre — sa scène s'assombrit —, celui du jour reste en pleine lumière.
 * Le nom se lit toujours : la légende le disait déjà (« Nox est à 12
 * cartes… »), le cacher derrière « ??? » ne cachait rien.
 *
 * Le point clé ne change pas : le CTA d'une carte non pleine renvoie sur
 * RÉVISER, filtré sur la matière. Le boss est un moteur de trafic vers le
 * travail, pas un mode de jeu de plus. La feuille s'ouvre en grand pop-up
 * crème (SheetShell `format="popup"`), pas en page.
 *
 * Le gain est de l'XP (557 : la gemme est réservée aux épreuves notées),
 * doublée le jour de chasse du gardien — « gemmes doublées » était un reste
 * d'avant la 557.
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
        <p className="font-heading text-base font-extrabold text-foreground">
          Aucun gardien en vue
        </p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
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

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* La règle du jeu, dite une fois, en haut : sans elle la jauge n'est
          qu'une barre de plus. */}
      <p className="px-0.5 text-[0.8rem] leading-snug font-bold text-muted-foreground">
        Chaque matière a son gardien.{' '}
        <strong className="text-foreground">Il ne se choisit pas : il se débusque.</strong>{' '}
        Révise (~{TRAQUE_MINUTES_EQUIV} min) pour remplir sa jauge — à 100 % il sort, et tu
        as <strong className="text-foreground">une heure</strong> pour l&apos;abattre.
      </p>

      {/* LE PREMIER BLOC EST LE GARDIEN LE PLUS PROCHE D'ÊTRE DÉFIÉ (Lucas,
          13/10/2026 : « pour éviter le scrolling ») : le débusqué, sinon la
          jauge la plus pleine. Le serveur range déjà ainsi ; la feuille le
          garantit elle-même, à l'heure du client — un gardien recouché sous
          les yeux de l'élève redescend. */}
      <ul className="flex flex-col gap-3">
        {sortCards(cards, now ?? undefined).map((card) => (
          <li key={card.boss.id}>
            <Taniere card={card} now={now} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Taniere({ card, now }: { card: TraqueCard; now: number | null }) {
  const ready = card.status === 'debusque'
  // Compte à rebours vivant : recalculé depuis la borne de fin. Tant que le
  // client n'a pas pris la main (SSR), on affiche la valeur du serveur.
  const remaining =
    now !== null && card.endsAt !== null ? Math.max(0, card.endsAt - now) : card.remainingMs
  // La fenêtre s'est refermée sous les yeux de l'élève : on cesse de proposer
  // un combat qui serait refusé par le serveur.
  const expired = ready && remaining <= 0
  const libre = ready && !expired
  const chasse = !libre && !expired && card.enChasse
  // Le gardien qui rôde n'est qu'une ombre ; celui du jour reste en lumière.
  const ombre = !libre && !card.enChasse
  const { boss } = card

  return (
    <article
      className={s.taniere}
      data-libre={libre ? '' : undefined}
      data-ombre={ombre ? '' : undefined}
    >
      {/* LA SCÈNE : le nom, et rien d'autre. */}
      <div className={s.scene}>
        {boss.scene ? (
          <Image
            src={boss.scene}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 448px) 100vw, 420px"
            className="object-cover object-[70%_45%]"
          />
        ) : boss.image ? (
          // Un boss sans scène (il n'y en a plus, mais le type le permet) :
          // son buste à droite, sur la robe prune.
          <Image
            src={boss.image}
            alt=""
            aria-hidden="true"
            fill
            sizes="160px"
            className="object-contain object-right-bottom"
          />
        ) : null}
        <h3 className={cn(s.nom, 'font-heading font-extrabold')}>{boss.name}</h3>
      </div>

      <div className={s.bas}>
        {/* La légende de la jauge : l'état en GESTES, jamais un pourcentage
            nu — et le pourcentage exact à droite, pour qui le veut. */}
        <div className={s.legende}>
          <span
            className={cn(s.etat, 'font-heading font-extrabold')}
            data-or={libre || chasse ? '' : undefined}
          >
            {libre ? (
              <>
                <Hourglass className="size-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                Il disparaît dans {countdownLabel(remaining)}
              </>
            ) : expired ? (
              <>Il s’est recouché — sa jauge repart de la moitié</>
            ) : chasse ? (
              <>
                <Flame className="size-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                En chasse aujourd’hui · XP ×2
              </>
            ) : (
              <>
                {restantLabel(card.points)} · {RANK_LABELS[card.rank]}
              </>
            )}
          </span>
          <span className={cn(s.pct, 'font-heading font-extrabold tabular-nums')}>
            {card.percent} %
          </span>
        </div>
        <div
          className={s.piste}
          role="progressbar"
          aria-label={`Traque de ${boss.name} : ${card.percent} %`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={card.percent}
        >
          <div className={s.remplissage} style={{ width: `${Math.max(4, card.percent)}%` }} />
        </div>

        <div className={s.actions}>
          {libre ? (
            <Link
              href={`/defi/traque/${boss.id}`}
              onClick={() => sfx.tap()}
              className="olympe-press flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ffd257] to-[#eda50b] font-heading text-sm font-extrabold text-foreground shadow-[0_4px_0_#b17c02] focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
              Défier {boss.name}
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

          {/* Ce qui est en jeu : de l'XP, DORÉE le jour de chasse (×2). */}
          <span
            className={cn(s.xp, 'font-heading font-extrabold tabular-nums')}
            data-or={chasse ? '' : undefined}
            aria-label={`${card.xp} XP en cas de victoire${chasse ? ', doublée aujourd’hui' : ''}`}
          >
            <XpIcon className="size-4" />
            {card.xp}
          </span>
        </div>

        {/* Le rituel hebdomadaire : « le mardi c'est Grammatork ». */}
        {!card.enChasse && !expired && card.backOn ? (
          <p className={s.note}>
            <Star className="size-3 shrink-0" aria-hidden="true" />
            XP ×2 {card.backOn} · rang max {RANK_LABELS[MAX_BOSS_RANK]}
          </p>
        ) : null}
      </div>
    </article>
  )
}
