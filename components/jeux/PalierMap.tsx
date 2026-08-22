'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Infinity as InfinityIcon,
  Lock,
  Play,
  Star,
  Timer,
  Trophy,
} from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import PalierStars from '@/components/jeux/PalierStars'
import { MECHANIC_ICON } from '@/components/jeux/icons'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { GameFormat } from '@/lib/jeux/formats'
import { hasTimeRecord, palierChips } from '@/lib/jeux/palier-format'
import { usePalierProgress } from '@/lib/jeux/use-palier-progress'
import {
  PALIERS,
  TOTAL_STARS,
  bestAt,
  bestTimeAt,
  formatDuration,
  currentPalier,
  isUnlocked,
  palierDef,
  starsAt,
  starsMissingFor,
  totalStars,
  type PalierLevel,
  type PalierProgress,
} from '@/lib/jeux/paliers'
import {
  speedLabelFor,
  type PalierStandings,
} from '@/lib/jeux/palier-standing'
import {
  coteTitle,
  hasUltime,
  isUltimeUnlocked,
  starsMissingForUltime,
} from '@/lib/jeux/ultime'
import {
  gradeLabel,
  worldLabel,
  type UltimeStanding,
} from '@/lib/jeux/ultime-standing'

/**
 * LA CARTE DU JEU — l'échelle des cinq paliers d'un salon.
 *
 * Elle s'intercale là où l'on tombait autrefois directement dans la partie. Ce
 * détour est le cœur de la boucle : sans écran qui MONTRE l'échelle, un palier
 * franchi n'est qu'un réglage interne, et il ne manque jamais « une étoile pour
 * ouvrir le suivant » — donc on ne relance pas.
 *
 * Trois choses, et rien d'autre : où j'en suis (les étoiles), ce que chaque
 * palier me réserve (les chiffres réels, pas une promesse vague), et un bouton
 * pour y aller. Les paliers déjà ouverts restent tous jouables : celui du bas
 * est là pour les mauvais jours, celui du haut pour les records.
 *
 * La progression vit dans le stockage local (lib/jeux/paliers) : elle est donc
 * lue APRÈS montage, comme les records, sinon le rendu serveur et le rendu
 * client divergeraient. La rangée d'étoiles est dessinée dès le premier rendu,
 * vide — la carte ne change pas de hauteur quand la progression arrive.
 */
export default function PalierMap({
  format,
  name,
  subject,
  subjectEmoji,
  floor,
  standings,
  ultime,
}: {
  format: GameFormat
  name: string
  subject: string
  subjectEmoji: string
  /** Paliers ouverts d'office par la classe de l'élève (lib/jeux/paliers). */
  floor: PalierLevel
  /**
   * Mes places au chrono, palier par palier (migration 313). Vide quand la
   * migration n'est pas passée ou qu'aucun palier n'a encore été bouclé : la
   * carte affiche alors le chrono local, sans pourcentage.
   */
  standings: PalierStandings
  /**
   * Ma cote et mes rangs à l'épreuve ultime (migration 314). Null quand elle n'a
   * jamais été jouée, ou quand la migration n'est pas passée.
   */
  ultime: UltimeStanding | null
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  // `null` tant que le navigateur n'a pas parlé : la carte se dessine alors
  // avec ses étoiles vides, à la bonne hauteur — rien ne saute quand elles
  // arrivent.
  const progress: PalierProgress = usePalierProgress(format.id) ?? {}

  const stars = totalStars(progress)
  const current = currentPalier(progress, floor)

  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      onExit={() => router.push('/defi')}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          <span aria-hidden="true">{subjectEmoji}</span> {subject}
        </span>
      }
    >
      <div className="pt-1 pb-6">
        {/* Le bandeau de progression : la moisson d'étoiles du jeu, en un coup
            d'œil. C'est le compteur qu'on cherche à remplir — il vaut mieux
            qu'un score, qui ne dit jamais s'il reste quelque chose à faire. */}
        <section
          aria-label="Progression sur ce jeu"
          className="mb-5 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-black/5"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-extrabold">
              Ta collection d’étoiles
            </h2>
            <span className="flex items-center gap-1.5 rounded-full bg-highlight/15 px-3 py-1 font-mono text-sm font-extrabold tabular-nums">
              <Star
                className="size-4 fill-highlight text-highlight"
                aria-hidden="true"
              />
              {stars}
              <span className="text-foreground/50">/{TOTAL_STARS}</span>
            </span>
          </div>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL_STARS}
            aria-valuenow={stars}
            aria-label={`${stars} étoiles sur ${TOTAL_STARS}`}
          >
            <div
              className="h-full rounded-full bg-highlight transition-[width] duration-500 ease-out"
              style={{ width: `${(stars / TOTAL_STARS) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stars >= TOTAL_STARS
              ? 'Toutes les étoiles décrochées. Il ne te reste qu’à battre tes propres records.'
              : `Deux étoiles sur un palier ouvrent le suivant. Tu es à ${palierDef(current).name}.`}
          </p>
        </section>

        {/* L'échelle. Le trait vertical derrière les numéros la fait lire comme
            un chemin plutôt que comme une liste de réglages. */}
        <ol className="relative flex flex-col gap-3">
          <span
            aria-hidden="true"
            className="absolute top-8 bottom-8 left-[2.05rem] w-0.5 rounded-full bg-[color:var(--jeu-accent)]/20"
          />
          {PALIERS.map((palier, index) => (
            <motion.li
              key={palier.level}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <PalierRow
                format={format}
                level={palier.level}
                unlocked={isUnlocked(progress, floor, palier.level)}
                isCurrent={palier.level === current}
                stars={starsAt(progress, palier.level)}
                best={bestAt(progress, palier.level)}
                timeMs={
                  standings[palier.level]?.bestMs ??
                  bestTimeAt(progress, palier.level)
                }
                speed={speedLabelFor(standings[palier.level])}
                missing={starsMissingFor(progress, floor, palier.level)}
              />
            </motion.li>
          ))}
        </ol>

        {/* L'ÉPREUVE ULTIME, détachée de l'échelle. Elle n'est pas un sixième
            palier : elle n'a pas d'étoiles, aucun plancher de classe ne
            l'ouvre, et elle est la même pour tout le monde. C'est ce qui permet
            à un 6e d'y dépasser un lycéen — et de le prouver. */}
        {hasUltime(format.id) ? (
          <UltimeRow
            gameId={format.id}
            unlocked={isUltimeUnlocked(progress)}
            missing={starsMissingForUltime(progress)}
            standing={ultime}
          />
        ) : null}

        <p className="mt-5 px-2 text-center text-xs text-muted-foreground">
          Une étoile décrochée ne se reperd jamais : un palier ouvert reste
          ouvert, même après une mauvaise partie.
        </p>
      </div>
    </ModeStage>
  )
}

/**
 * LE BARREAU ULTIME — celui qui n'a pas de plafond.
 *
 * Il porte la robe du jeu à plein, là où les paliers ne la portent que sur leur
 * numéro : à l'œil, il n'appartient pas à la même échelle, et c'est exact. Il
 * n'affiche ni étoile ni record de score — une cote, et deux classements.
 */
function UltimeRow({
  gameId,
  unlocked,
  missing,
  standing,
}: {
  gameId: string
  unlocked: boolean
  /** Étoiles manquantes au dernier palier pour l'ouvrir. */
  missing: number
  standing: UltimeStanding | null
}) {
  const world = worldLabel(standing)
  const grade = gradeLabel(standing)

  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-14 shrink-0 place-items-center rounded-2xl shadow-sm',
          unlocked
            ? 'bg-[color:var(--jeu-ink)] text-[color:var(--jeu-accent)]'
            : 'bg-muted text-foreground/35',
        )}
      >
        {unlocked ? (
          <InfinityIcon className="size-7" strokeWidth={2.6} />
        ) : (
          <Lock className="size-6" strokeWidth={2.6} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-heading text-lg font-extrabold">
            Épreuve ultime
          </span>
          {standing ? (
            <span className="font-heading rounded-full bg-highlight px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-foreground uppercase">
              {coteTitle(standing.cote)}
            </span>
          ) : null}
        </span>

        <span className="mt-0.5 block text-sm text-muted-foreground">
          {unlocked
            ? 'Une seule vie, aucune fin. La même épreuve pour tout le monde.'
            : `Décroche les ${missing} étoile${missing > 1 ? 's' : ''} qui manquent au palier Maître pour l’ouvrir`}
        </span>

        {standing ? (
          <>
            <span className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-2xl font-extrabold tabular-nums">
                {standing.cote}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                de cote · niveau {standing.bestLevel + 1} atteint
              </span>
            </span>
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              {world ? (
                <span className="font-heading rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold text-primary-foreground uppercase">
                  {world}
                </span>
              ) : null}
              {grade ? (
                <span className="rounded-full bg-highlight/20 px-2.5 py-1 text-[11px] font-bold">
                  {grade}
                </span>
              ) : null}
            </span>
          </>
        ) : unlocked ? (
          <span className="mt-2 block text-xs font-bold text-primary">
            Jamais tentée — jusqu’où montes-tu ?
          </span>
        ) : null}
      </span>

      {unlocked ? (
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center self-center rounded-2xl bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)] shadow-md"
        >
          <Play className="size-5 fill-current" />
        </span>
      ) : null}
    </>
  )

  const shell =
    'mt-4 flex items-start gap-3 rounded-3xl p-3.5 text-left ring-1 transition-colors duration-200'

  if (!unlocked) {
    return (
      <div
        className={cn(shell, 'bg-card/60 ring-black/5')}
        aria-label={`Épreuve ultime — verrouillée. Encore ${missing} étoile${missing > 1 ? 's' : ''} au palier Maître.`}
      >
        {body}
      </div>
    )
  }

  return (
    <Link
      href={`/defi/jeux/${gameId}/ultime`}
      onClick={() => sfx.tap()}
      aria-label="Jouer l’épreuve ultime — une seule vie, sans fin"
      className={cn(
        shell,
        'cursor-pointer bg-card shadow-sm ring-2 ring-[color:var(--jeu-accent)] hover:bg-[color:var(--jeu-accent)]/8 focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none',
      )}
    >
      {body}
    </Link>
  )
}

/** Un barreau de l'échelle : le palier, ce qu'il contient, et par où y entrer. */
function PalierRow({
  format,
  level,
  unlocked,
  isCurrent,
  stars,
  best,
  timeMs,
  speed,
  missing,
}: {
  format: GameFormat
  level: PalierLevel
  unlocked: boolean
  isCurrent: boolean
  stars: 0 | 1 | 2 | 3
  best: number
  /** Meilleur temps de bouclage, ou null tant que le palier n'a pas été gagné. */
  timeMs: number | null
  /** « Top 5 % des joueurs », ou null quand il n'y a rien d'honnête à dire. */
  speed: string | null
  /** Étoiles manquantes au palier d'en dessous pour ouvrir celui-ci. */
  missing: number
}) {
  const def = palierDef(level)
  const chips = palierChips(format, level)
  const timed = timeMs !== null && hasTimeRecord(format)
  const previous = level > 1 ? palierDef((level - 1) as PalierLevel) : null

  const body = (
    <>
      {/* Le numéro du palier, dans la robe du jeu quand il est ouvert. */}
      <span
        aria-hidden="true"
        className={cn(
          'font-heading grid size-14 shrink-0 place-items-center rounded-2xl text-2xl font-extrabold shadow-sm',
          unlocked
            ? 'bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)]'
            : 'bg-muted text-foreground/35',
        )}
      >
        {unlocked ? level : <Lock className="size-6" strokeWidth={2.6} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-heading text-lg font-extrabold">{def.name}</span>
          <PalierStars stars={stars} size="sm" />
          {isCurrent && unlocked ? (
            <span className="font-heading rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-primary-foreground uppercase">
              En cours
            </span>
          ) : null}
        </span>

        <span className="mt-0.5 block text-sm text-muted-foreground">
          {unlocked
            ? def.tagline
            : `Encore ${missing} étoile${missing > 1 ? 's' : ''} au palier ${previous?.name ?? ''} pour l’ouvrir`}
        </span>

        {/* Ce qui change VRAIMENT à ce palier : les chiffres du format, et la
            promesse de la banque quand elle est graduée. Deux paliers qui
            n'annonceraient que « plus dur » ne donneraient envie de monter. */}
        <span className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-bold',
                unlocked
                  ? 'bg-[color:var(--jeu-accent)]/12 text-[color:var(--jeu-accent)]'
                  : 'bg-muted text-foreground/45',
              )}
            >
              {chip}
            </span>
          ))}
        </span>

        {/* La ligne des records : le score, le CHRONO de bouclage, et la place
            qu'il donne. Le chrono n'apparaît que là où il veut dire quelque
            chose (`hasTimeRecord`) — sur un sprint de 40 secondes, tout le monde
            met 40 secondes. Le pourcentage, lui, ne s'affiche qu'au-delà de 100
            joueurs classés : en dessous, `speedLabelFor` annonce le rang brut,
            qui est vrai à toute taille. */}
        {best > 0 || timed ? (
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground">
            {best > 0 ? (
              <span className="flex items-center gap-1.5">
                <Trophy className="size-3.5" aria-hidden="true" />
                Record {best}
              </span>
            ) : null}
            {timed ? (
              <span className="flex items-center gap-1.5 tabular-nums">
                <Timer className="size-3.5" aria-hidden="true" />
                {formatDuration(timeMs as number)}
              </span>
            ) : null}
            {timed && speed ? (
              <span className="text-primary">{speed}</span>
            ) : null}
          </span>
        ) : null}
      </span>

      {unlocked ? (
        <span
          aria-hidden="true"
          className={cn(
            'grid size-11 shrink-0 place-items-center self-center rounded-2xl transition-colors duration-200',
            isCurrent
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Play className="size-5 fill-current" />
        </span>
      ) : null}
    </>
  )

  const shell =
    'flex items-start gap-3 rounded-3xl p-3.5 text-left ring-1 transition-colors duration-200'

  if (!unlocked) {
    return (
      <div
        className={cn(shell, 'bg-card/60 ring-black/5')}
        aria-label={`Palier ${level}, ${def.name} — verrouillé. Encore ${missing} étoile${missing > 1 ? 's' : ''} au palier ${previous?.name ?? ''}.`}
      >
        {body}
      </div>
    )
  }

  return (
    <Link
      href={`/defi/jeux/${format.id}/${level}`}
      onClick={() => sfx.tap()}
      aria-label={`Jouer le palier ${level}, ${def.name} — ${stars} étoile${stars > 1 ? 's' : ''} sur 3`}
      className={cn(
        shell,
        'cursor-pointer bg-card shadow-sm hover:bg-[color:var(--jeu-accent)]/8 focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none',
        isCurrent ? 'ring-2 ring-primary' : 'ring-black/5',
      )}
    >
      {body}
    </Link>
  )
}
