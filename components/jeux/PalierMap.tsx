'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Infinity as InfinityIcon, Lock, Play, Star } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import ModeStage from '@/components/defi/ModeStage'
import ModeHero from '@/components/defi/ModeHero'
import XpIcon from '@/components/ui/XpIcon'
import { reclamerEtoilesPalier } from '@/app/defi/palier-actions'
import PalierStars from '@/components/jeux/PalierStars'
import PistePalier from '@/components/jeux/PistePalier'
import { MECHANIC_ICON } from '@/components/jeux/icons'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { GameFormat } from '@/lib/jeux/formats'
import { hasTimeRecord } from '@/lib/jeux/palier-format'
import { usePalierProgress } from '@/lib/jeux/use-palier-progress'
import {
  TOTAL_STARS,
  accuracyAt,
  bestAt,
  bestTimeAt,
  currentPalier,
  palierDef,
  paliersVisibles,
  starsAt,
  starsMissingFor,
  totalStars,
  type PalierLevel,
  type PalierProgress,
} from '@/lib/jeux/paliers'
import {
  XP_PAR_JEU,
  etoilesDeProgression,
  recompenseDuPalier,
  xpDesEtoiles,
  resteAReclamer,
  type EtoilesParPalier,
} from '@/lib/jeux/palier-gemmes'
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
 * FAÇON DONJON DE 7DS (14/10/2026, Lucas : « on voit le palier 1, on le fait,
 * puis le palier 2 apparaît au-dessus, puis le 3 au-dessus du 2, jusqu'au
 * niveau max — voir tous les paliers d'un coup donne envie de procrastiner ») :
 * seuls les paliers OUVERTS sont dessinés, le plus haut en tête, et une seule
 * ligne au-dessus dit ce qu'il faut pour faire apparaître le suivant. Le
 * bouton des paliers 2 à 5 montre LA RÉCOMPENSE qui reste à prendre (l'éclair
 * d'XP, et la gemme le jour où un palier en paiera) ; celui du palier 1 dit
 * simplement « Jouer ».
 *
 * La progression vit dans le stockage local (lib/jeux/paliers) : elle est donc
 * lue APRÈS montage, comme les records, sinon le rendu serveur et le rendu
 * client divergeraient. La rangée d'étoiles est dessinée dès le premier rendu,
 * vide — la carte ne change pas de hauteur quand la progression arrive.
 */
export default function PalierMap({
  format,
  name,
  tagline,
  subject,
  subjectEmoji,
  subjectVignette,
  scene,
  floor,
  standings,
  ultime,
  etoilesPayees,
  dojo = null,
}: {
  format: GameFormat
  name: string
  /** La promesse du jeu (catalogue des salons), sous le titre du bandeau. */
  tagline: string
  subject: string
  subjectEmoji: string
  /** La vignette du dossier de la matière (Réviser), ou null. */
  subjectVignette: string | null
  /** La scène du billet du jeu, ou null tant qu'il n'a pas la sienne. */
  scene: string | null
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
  /**
   * Étoiles déjà PAYÉES en gemmes, palier par palier (migration 373). Null
   * quand la migration n'est pas passée : on affiche le tarif, sans réclamer.
   */
  etoilesPayees: EtoilesParPalier | null
  /**
   * Un bloc propre au jeu, posé sous la collection : le dojo des astuces du
   * Calcul mental (components/jeux/DojoAstuces). Null pour les autres jeux.
   */
  dojo?: ReactNode
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  // `null` tant que le navigateur n'a pas parlé : la carte se dessine alors
  // avec ses étoiles vides, à la bonne hauteur — rien ne saute quand elles
  // arrivent.
  const progress: PalierProgress = usePalierProgress(format.id) ?? {}

  const stars = totalStars(progress)
  const current = currentPalier(progress, floor)
  const { visibles, suivant } = paliersVisibles(progress, floor)
  const sommet = visibles[0]

  // LES GEMMES DES ÉTOILES. Les étoiles vivent dans le navigateur, les gemmes
  // au serveur : une étoile décrochée avant la 373 (ou dont la réclamation a
  // échoué en fin de partie) n'a jamais été payée. La carte la réclame en
  // arrivant, et dit ce que ça a rapporté.
  const [payees, setPayees] = useState<EtoilesParPalier | null>(etoilesPayees)
  const [rattrapage, setRattrapage] = useState<number | null>(null)
  const locales = etoilesDeProgression(progress)
  const cleLocales = locales.join(',')
  const clePayees = payees === null ? null : payees.join(',')
  useEffect(() => {
    if (clePayees === null) return
    const loc = cleLocales.split(',').map(Number)
    const deja = clePayees.split(',').map(Number)
    const [a, b, c, d, e] = loc
    const [f, g, h, i, j] = deja
    if (!resteAReclamer([a, b, c, d, e], [f, g, h, i, j])) return
    let vivant = true
    reclamerEtoilesPalier(format.id, loc)
      .then((r) => {
        if (!vivant || !r) return
        setPayees(r.etoiles)
        if (r.xp > 0) {
          setRattrapage(r.xp)
          // Le bandeau du haut relit sa barre d'XP.
          router.refresh()
        }
      })
      .catch(() => {
        // Réseau : on retentera à la prochaine visite.
      })
    return () => {
      vivant = false
    }
  }, [format.id, cleLocales, clePayees, router])

  // Ce que l'élève a déjà gagné : ses étoiles, locales ou payées (un stockage
  // vidé n'efface pas ce que le serveur a versé).
  const acquises = locales.map((n, index) => Math.max(n, payees?.[index] ?? 0))
  const [a1, a2, a3, a4, a5] = acquises
  const xpGagnee = xpDesEtoiles([a1, a2, a3, a4, a5])

  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      scene={scene}
      onExit={() => router.push('/defi')}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          <span aria-hidden="true">{subjectEmoji}</span> {subject}
        </span>
      }
    >
      {/* L'AMBIANCE DU JEU : sa scène (celle de son billet), sa robe, son
          titre — l'écran continue le billet qu'on vient de toucher. */}
      <ModeHero
        scene={scene}
        titre={name}
        sousTitre={tagline}
        matiere={{ nom: subject, vignette: subjectVignette }}
      />

      <div className="relative z-10 -mt-1 pb-6">
        {/* CE QU'IL RESTE À GAGNER, et rien d'autre (Lucas, 24/09/2026 : « à
            l'arrivée, je veux voir les étoiles et les gemmes à compléter, et
            c'est tout » ; l'XP a remplacé les gemmes le 04/10/2026). Le bloc « Ta collection » — titre, barre, phrase sur
            la règle des paliers — est parti : deux compteurs, au centre. */}
        <section
          aria-label="Progression sur ce jeu"
          className="mb-5 flex flex-col items-center gap-2"
        >
          <span className="flex items-center justify-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 font-mono text-base font-extrabold tabular-nums shadow-sm ring-1 ring-black/5"
              aria-label={`${stars} étoiles sur ${TOTAL_STARS}`}
            >
              <Star className="size-5 fill-highlight text-highlight" aria-hidden="true" />
              {stars}
              <span className="text-foreground/50">/{TOTAL_STARS}</span>
            </span>
            {/* L'XP que ces étoiles ont rapportée, sur tout le jeu (557). */}
            <span
              className="flex items-center gap-1 rounded-full bg-card py-1.5 pr-3.5 pl-2 font-mono text-base font-extrabold tabular-nums shadow-sm ring-1 ring-black/5"
              aria-label={`${xpGagnee} XP gagnée sur ${XP_PAR_JEU}`}
            >
              <XpIcon className="size-6" />
              {xpGagnee}
              <span className="text-foreground/50">/{XP_PAR_JEU}</span>
            </span>
          </span>
          {rattrapage ? (
            <p
              role="status"
              className="flex items-center gap-2 rounded-2xl bg-highlight/20 px-3 py-2 text-sm font-bold"
            >
              <XpIcon className="size-6 shrink-0" />
              Tes étoiles déjà décrochées t’ont rapporté {rattrapage} XP !
            </p>
          ) : null}
        </section>

        {dojo}

        {/* LE DONJON : les paliers ouverts, le plus haut en tête, et au-dessus
            une seule ligne pour le suivant. Un palier qui vient de s'ouvrir
            glisse en haut de la pile au retour de la partie (`layout`). */}
        <ol className="relative flex flex-col gap-3">
          {suivant !== null ? (
            <li key={`suivant-${suivant}`}>
              <p
                className="flex items-center gap-2 rounded-3xl border-2 border-dashed border-foreground/15 px-4 py-3 text-sm font-bold text-muted-foreground"
                aria-label={`Palier ${suivant}, ${palierDef(suivant).name} — encore ${starsMissingFor(progress, floor, suivant)} étoile${starsMissingFor(progress, floor, suivant) > 1 ? 's' : ''} au palier ${palierDef(sommet).name} pour le faire apparaître.`}
              >
                <Lock className="size-4 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                <span>
                  Palier {suivant} · {palierDef(suivant).name} — encore{' '}
                  <strong className="text-foreground">
                    {starsMissingFor(progress, floor, suivant)} étoile
                    {starsMissingFor(progress, floor, suivant) > 1 ? 's' : ''}
                  </strong>{' '}
                  au palier {palierDef(sommet).name}
                </span>
              </p>
            </li>
          ) : null}
          {visibles.map((level, index) => (
            <motion.li
              key={level}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.05 }}
            >
              <PalierRow
                format={format}
                level={level}
                isCurrent={level === current}
                stars={starsAt(progress, level)}
                best={bestAt(progress, level)}
                accuracy={accuracyAt(progress, level)}
                timeMs={standings[level]?.bestMs ?? bestTimeAt(progress, level)}
                speed={speedLabelFor(standings[level])}
                acquises={acquises[level - 1] ?? 0}
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
          Deux étoiles font apparaître le palier suivant. Une étoile décrochée ne
          se reperd jamais : un palier ouvert reste ouvert, même après une mauvaise
          partie.
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

/** Un barreau du donjon : un palier OUVERT, ce qu'il contient, et par où y entrer. */
function PalierRow({
  format,
  level,
  isCurrent,
  stars,
  best,
  accuracy,
  timeMs,
  speed,
  acquises,
}: {
  format: GameFormat
  level: PalierLevel
  isCurrent: boolean
  stars: 0 | 1 | 2 | 3
  best: number
  /** Meilleur taux de réussite mémorisé, ou null : place le curseur de la piste. */
  accuracy: number | null
  /** Meilleur temps de bouclage, ou null tant que le palier n'a pas été gagné. */
  timeMs: number | null
  /** « Top 5 % des joueurs », ou null quand il n'y a rien d'honnête à dire. */
  speed: string | null
  /** Étoiles décrochées sur ce palier (locales ou déjà payées), pour ses gains. */
  acquises: number
}) {
  const def = palierDef(level)
  const timed = timeMs !== null && hasTimeRecord(format)
  // LA RÉCOMPENSE SUR LE BOUTON, à partir du palier 2 (Lucas, 14/10/2026) :
  // l'XP qui reste à décrocher ici, et la gemme le jour où un palier en paie.
  const recompense = level >= 2 ? recompenseDuPalier(level, acquises) : null
  const promesse = recompense !== null && (recompense.xp > 0 || recompense.gemmes > 0)
  const libelleGain = promesse
    ? ` — ${recompense.xp} XP à gagner${recompense.gemmes > 0 ? ` et ${recompense.gemmes} gemmes` : ''}`
    : ''

  const body = (
    <>
      {/* Le numéro du palier, dans la robe du jeu. */}
      <span
        aria-hidden="true"
        className="font-heading grid size-14 shrink-0 place-items-center rounded-2xl bg-[color:var(--jeu-accent)] text-2xl font-extrabold text-[color:var(--jeu-ink)] shadow-sm"
      >
        {level}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-heading text-lg font-extrabold">{def.name}</span>
          <PalierStars stars={stars} size="sm" />
          {isCurrent ? (
            <span className="font-heading rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-primary-foreground uppercase">
              En cours
            </span>
          ) : null}
        </span>

        <span className="mt-0.5 block text-sm text-muted-foreground">{def.tagline}</span>

        {/* Les jetons descriptifs (« 9 escales », « 10 s / escale ») sont partis
            le 24/09/2026 — Lucas : « pas clairs ». Ne pas les remettre. */}
        {/* LA PISTE DU PALIER (22/09/2026) : une ligne, les trois jalons de
            gemmes (migration 373 : une par étoile, au tarif du palier), et le
            curseur du record dessus — au meilleur taux de réussite, l'axe des
            étoiles. Elle réunit les anciens jetons « Gains » et la ligne
            « Record ». Le chrono de bouclage n'y figure que là où il veut dire
            quelque chose (`hasTimeRecord`) — sur un sprint de 40 secondes, tout
            le monde met 40 secondes. Le pourcentage de place ne s'affiche
            qu'au-delà de 100 joueurs classés (`speedLabelFor`). */}
        <PistePalier
          level={level}
          stars={stars}
          acquises={acquises}
          accuracy={accuracy}
          best={best}
          timeMs={timed ? (timeMs as number) : null}
          speed={speed}
          unlocked
        />
      </span>

      {/* LE BOUTON : « Jouer » au palier 1 ; à partir du 2, la récompense qui
          reste à prendre — l'éclair (et la gemme, le jour où il y en aura). */}
      <span
        aria-hidden="true"
        className={cn(
          'font-heading flex h-11 shrink-0 items-center gap-1 self-center rounded-2xl px-3 text-sm font-extrabold tabular-nums transition-colors duration-200',
          isCurrent
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-primary/10 text-primary',
        )}
      >
        <Play className="size-4 fill-current" />
        {promesse ? (
          <>
            <XpIcon className="ml-0.5 size-5" />+{recompense.xp}
            {recompense.gemmes > 0 ? (
              <>
                <GemIcon className="ml-1 size-4" />+{recompense.gemmes}
              </>
            ) : null}
          </>
        ) : (
          <span className="ml-0.5">{recompense !== null ? 'Rejouer' : 'Jouer'}</span>
        )}
      </span>
    </>
  )

  const shell =
    'flex items-start gap-3 rounded-3xl p-3.5 text-left ring-1 transition-colors duration-200'

  return (
    <Link
      href={`/defi/jeux/${format.id}/${level}`}
      onClick={() => sfx.tap()}
      aria-label={`Jouer le palier ${level}, ${def.name} — ${stars} étoile${stars > 1 ? 's' : ''} sur 3${libelleGain}`}
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
