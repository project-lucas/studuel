'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronRight, Hourglass, Moon, Swords } from 'lucide-react'
import XpIcon from '@/components/ui/XpIcon'
import GemIcon from '@/components/ui/GemIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { RANK_LABELS, MAX_BOSS_RANK } from '@/lib/bosses'
import {
  countdownLabel,
  departLabel,
  finDuJourCourant,
  gestesPourTraquer,
  sortCards,
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
 * porte Jeux) et n'y porte que son nom, cerné. Dessous, la bande blanche.
 * Celui qui rôde est une ombre — sa scène s'assombrit —, celui du jour reste
 * en pleine lumière.
 *
 * L'AFFICHE (25/10/2026, « Le jeu vivant » § C, Lucas : « inspire-toi et
 * trouve le juste milieu pour Studuel pour les boss des matières ») : la
 * tanière du JOUR est un AVIS DE RECHERCHE. Un bandeau parchemin « RECHERCHÉ ·
 * aujourd'hui seulement » (« DÉBUSQUÉ ! » quand il est sorti) au-dessus de la
 * scène, dans la bande blanche le compte à rebours jusqu'à la fin du jour de
 * traque (« Il part dans 6 h 12 », vivant), la jauge, puis TROIS GESTES
 * calculés par `gestesPourTraquer` — Lire 1 cours · Finir 1 quiz · Réviser N
 * cartes —, chacun avec son « Aller » vers Réviser filtré sur la matière,
 * cochés quand la jauge dit qu'ils sont faits ; la RÉCOMPENSE en grand, en or.
 * La règle du jeu tient en une ligne en tête de feuille : l'affiche dit le
 * reste.
 *
 * Le point clé ne change pas : le CTA d'une carte non pleine renvoie sur
 * RÉVISER, filtré sur la matière. Le boss est un moteur de trafic vers le
 * travail, pas un mode de jeu de plus. La feuille s'ouvre en grand pop-up
 * crème (SheetShell `format="popup"`), pas en page.
 *
 * LA RARETÉ (576, 14/10/2026) : un gardien n'est disponible que SES jours
 * (le week-end, tous ; Nox le dimanche), sa jauge ne monte que ces jours-là et
 * repart de zéro chaque nuit — « pas de boss rempli à l'avance ». Un gardien
 * indisponible garde son RUBAN par-dessus sa scène (Lucas : « une bannière
 * par-dessus les bannières de boss pour signaler qu'il n'est pas disponible
 * aujourd'hui »), sa scène s'éteint, sa jauge disparaît, et l'affiche ne dit
 * que « Revient mardi ». Le gain est de l'XP fixe ET des gemmes (5 · 8 · 10
 * par rang, Nox 20, 40 par semaine).
 *
 * Les cartes arrivent résolues du serveur (lib/traque-server.fetchTraqueBoard) ;
 * ce composant ne recalcule QUE les comptes à rebours, qui se périmeraient
 * sinon dès la seconde suivant le rendu.
 */
export default function BossSheet({ cards }: { cards: TraqueCard[] }) {
  // Une horloge unique pour toute la feuille : le rendu serveur est figé, la
  // fenêtre d'une heure et le jour, eux, s'écoulent. On égrène à la demi-minute
  // — assez pour que « 12 min » ne mente jamais de plus de 30 s, sans réveiller
  // le téléphone toutes les secondes.
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
      {/* La règle du jeu, en UNE ligne : l'affiche de chaque tanière dit le reste
          (le jour, les gestes, le gain). */}
      <p className="px-0.5 text-[0.78rem] leading-snug font-bold text-muted-foreground">
        Remplis la jauge du gardien du jour : il sort, et tu as{' '}
        <strong className="text-foreground">une heure</strong>
        {' '}pour l&apos;abattre.
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
  // LA RARETÉ (576) : pas son jour — un ruban sur la scène, pas de jauge.
  const repos = card.status === 'indisponible'
  // Compte à rebours vivant : recalculé depuis la borne de fin. Tant que le
  // client n'a pas pris la main (SSR), on affiche la valeur du serveur.
  const remaining =
    now !== null && card.endsAt !== null ? Math.max(0, card.endsAt - now) : card.remainingMs
  // La fenêtre s'est refermée sous les yeux de l'élève : on cesse de proposer
  // un combat qui serait refusé par le serveur.
  const expired = ready && remaining <= 0
  const libre = ready && !expired
  // Recouché : la fenêtre est passée (vu par le serveur, ou à l'instant).
  const recouche = expired || card.status === 'expire'
  // Le gardien indisponible n'est qu'une ombre ; ceux du jour restent en lumière.
  const ombre = !libre && (repos || !card.enChasse)
  // L'AFFICHE : la tanière du jour, tant qu'il n'est pas sorti — le bandeau
  // « Recherché », le compte à rebours du jour et les trois gestes. Un gardien
  // sorti garde le bandeau (« Débusqué ! ») mais plus de gestes : c'est fait.
  const affiche = !repos && !libre
  // Le compte à rebours de l'affiche vise la FIN DU JOUR DE TRAQUE (minuit
  // UTC, la clé du jour de la 576). Avant que le client ne prenne la main :
  // « aujourd'hui seulement », qui dit la même chose sans heure.
  const depart = now === null ? null : finDuJourCourant(now) - now
  // Pas de gestes sur une carte pleine qui vient d'expirer sous les yeux de
  // l'élève (ses 100 points seraient tous cochés) : le serveur la redescend à
  // la moitié au prochain rendu.
  const gestes = affiche && !expired ? gestesPourTraquer(card) : []
  const { boss } = card

  return (
    <article
      className={s.taniere}
      data-libre={libre ? '' : undefined}
      data-ombre={ombre ? '' : undefined}
      data-repos={repos ? '' : undefined}
    >
      {/* LE BANDEAU PARCHEMIN de l'avis de recherche, épinglé au-dessus de la
          scène — déchiré en bas, le rang tamponné à droite. */}
      {affiche || libre ? (
        <div className={s.parcheminCadre}>
          <div className={cn(s.parchemin, 'font-heading font-extrabold')} data-or={libre ? '' : undefined}>
            <span className={s.parcheminTitre}>{libre ? 'Débusqué' : 'Recherché'}</span>
            <span className={s.parcheminSous}>{libre ? 'à abattre maintenant' : 'aujourd’hui seulement'}</span>
            <span className={s.tampon}>{RANK_LABELS[card.rank]}</span>
          </div>
        </div>
      ) : null}

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
        {/* LE RUBAN (576) : barré par-dessus la scène quand ce n'est pas son jour. */}
        {repos ? (
          <span className={cn(s.ruban, 'font-heading font-extrabold')}>Indisponible aujourd’hui</span>
        ) : null}
      </div>

      <div className={s.bas}>
        {/* La légende de la jauge : le TEMPS qui reste (sa fenêtre d'une heure,
            ou son jour), et le pourcentage exact à droite, pour qui le veut. */}
        <div className={s.legende}>
          <span
            className={cn(s.etat, 'font-heading font-extrabold')}
            data-or={libre ? '' : undefined}
          >
            {libre ? (
              <>
                <Hourglass className="size-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                Il disparaît dans {countdownLabel(remaining)}
              </>
            ) : repos ? (
              <>
                <Moon className="size-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                Revient {card.backOn ?? 'bientôt'} · à traquer ce jour-là
              </>
            ) : (
              <>
                <Hourglass className="size-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                {depart === null ? 'Aujourd’hui seulement' : departLabel(depart)}
              </>
            )}
          </span>
          {repos ? null : (
            <span className={cn(s.pct, 'font-heading font-extrabold tabular-nums')}>
              {card.percent} %
            </span>
          )}
        </div>
        {/* Pas de jauge pour un gardien indisponible : elle ne bougerait pas. */}
        {repos ? null : (
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
        )}
        {recouche ? (
          <p className={s.note}>Il s’est recouché — sa jauge repart de la moitié</p>
        ) : null}

        {/* LES TROIS GESTES : un bouton chacun, cochés quand la jauge le dit. */}
        {gestes.length > 0 ? (
          <ol className={s.gestes} aria-label={`Trois gestes pour débusquer ${boss.name}`}>
            {gestes.map((geste) => (
              <li key={geste.cle} className={s.geste} data-fait={geste.fait ? '' : undefined}>
                <span className={s.coche} aria-hidden="true">
                  {geste.fait ? <Check className="size-3.5" strokeWidth={3.5} /> : null}
                </span>
                <span className={s.gesteLibelle}>
                  {geste.libelle}
                  {geste.fait ? <span className="sr-only"> — fait</span> : null}
                </span>
                <span className={cn(s.gestePoints, 'tabular-nums')} aria-label={`${geste.points} points`}>
                  +{geste.points}
                </span>
                {geste.fait ? null : (
                  <Link
                    href={geste.href}
                    onClick={() => sfx.tap()}
                    className={cn(s.aller, 'olympe-press font-heading font-extrabold')}
                    aria-label={`${geste.libelle} : aller`}
                  >
                    Aller
                    <ChevronRight className="size-4" strokeWidth={2.8} aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        ) : null}

        {/* LA RÉCOMPENSE, en grand : de l'XP et des GEMMES (576) — en or tant
            que le gardien est à prendre aujourd'hui, éteinte quand il se repose. */}
        <div
          className={s.gains}
          role="group"
          data-or={!repos && !expired ? '' : undefined}
          aria-label={`${card.xp} XP et ${card.gemmes} gemmes en cas de victoire`}
        >
          <span className={s.gainsTitre}>Récompense</span>
          <span className={s.gainsRang}>
            <span className={cn(s.gain, 'font-heading font-extrabold tabular-nums')}>
              <XpIcon className="size-6" />
              {card.xp}
              <span className={s.gainUnite}>XP</span>
            </span>
            <span className={cn(s.gain, 'font-heading font-extrabold tabular-nums')}>
              <GemIcon className="size-6" />
              {card.gemmes}
              <span className={s.gainUnite}>{card.gemmes === 1 ? 'gemme' : 'gemmes'}</span>
            </span>
          </span>
        </div>

        <div className={s.actions}>
          {libre ? (
            <Link
              href={`/defi/traque/${boss.id}`}
              onClick={() => sfx.tap()}
              className={cn(s.btn, s.btnOr, 'olympe-press font-heading font-extrabold')}
            >
              <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
              Défier {boss.name}
            </Link>
          ) : (
            <Link
              href={card.subjectSlug ? `/reviser/${card.subjectSlug}` : '/reviser'}
              onClick={() => sfx.tap()}
              className={cn(s.btn, s.btnViolet, 'olympe-press font-heading font-extrabold')}
            >
              Réviser {card.subject} →
            </Link>
          )}
        </div>

        {/* Le rituel hebdomadaire : « le mardi c'est Grammatork » — et jusqu'où il monte. */}
        {repos ? (
          <p className={s.note}>Rang max {RANK_LABELS[MAX_BOSS_RANK]} · le week-end, tous les gardiens sortent</p>
        ) : null}
      </div>
    </article>
  )
}
