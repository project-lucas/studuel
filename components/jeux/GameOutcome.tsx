'use client'

import Link from 'next/link'
import {
  Ghost,
  Infinity as InfinityIcon,
  Map,
  RotateCcw,
  Timer,
  Trophy,
  Unlock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import type { Gain } from '@/lib/gains'
import type { GameFormat } from '@/lib/jeux/formats'
import { runAchieved, runTarget, type GameRun } from '@/lib/jeux/run'
import type { GameTrophyOutcome } from '@/app/defi/actions'
import { trophyBand } from '@/lib/trophy-road'
import type { GameGhost } from '@/lib/jeux/ghost-server'
import PalierStars from '@/components/jeux/PalierStars'
import {
  formatDuration,
  nextStarAccuracy,
  palierDef,
  type PalierLevel,
  type PalierOutcome,
} from '@/lib/jeux/paliers'
import {
  speedLabelFor,
  type PalierTimeStanding,
} from '@/lib/jeux/palier-standing'
import { coteTitle, nextCoteTitle } from '@/lib/jeux/ultime'
import { gradeLabel, worldLabel } from '@/lib/jeux/ultime-standing'
import type { UltimeResult } from '@/lib/jeux/use-ultime-run'

/**
 * L'écran de fin d'un jeu de salon. Il raconte la partie DANS LA LANGUE DU JEU
 * (« Tour du monde bouclé ! », « La machine a calé ») plutôt qu'avec un « Bravo »
 * interchangeable — c'est la dernière chose que l'élève voit, et donc ce qui
 * décide s'il relance.
 *
 * Une défaite ne se moque jamais : elle affiche ce qui a été fait, pas ce qui a
 * manqué, et le bouton « Rejouer » est le plus gros de l'écran.
 */
export default function GameOutcome({
  format,
  palier,
  palierOutcome,
  palierStanding,
  ultime,
  run,
  best,
  isRecord,
  saved,
  gains,
  trophies,
  ghost,
  onReplay,
}: {
  format: GameFormat
  /** Le palier joué, ou null pour un jeu hors échelle (le « Programme »). */
  palier: PalierLevel | null
  /** Étoiles décrochées et palier ouvert par CETTE partie (null tant que rien n'est rangé). */
  palierOutcome: PalierOutcome | null
  /**
   * Ma place au chrono sur ce palier (null en attente du serveur, ou quand il
   * n'y a rien à en dire : partie perdue, migration 313 pas passée).
   */
  palierStanding: PalierTimeStanding | null
  /**
   * Résultat d'une ÉPREUVE ULTIME, quand c'est elle qu'on vient de jouer : le
   * niveau atteint, et la cote qu'il donne. Remplace alors le bloc des étoiles —
   * l'épreuve n'en a pas, elle a un classement.
   */
  ultime?: UltimeResult | null
  run: GameRun
  /** Meilleur score local sur ce jeu (0 s'il n'y en a pas encore). */
  best: number
  isRecord: boolean
  /** Partie enregistrée côté serveur : null tant que la réponse n'est pas là. */
  saved: boolean | null
  /** XP réellement versée, telle que renvoyée par le serveur (null en attente). */
  /** Ce que la partie a rapporté, tel que la base l'a écrit. */
  gains: Gain[]
  /**
   * Mouvement de trophées sur la Route (null en attente, ou quand le serveur
   * n'a rien accordé : visiteur, couple hors catalogue, borne de rythme).
   */
  trophies?: GameTrophyOutcome
  /** Le meilleur score d'un ami sur ce jeu, s'il y en a un. */
  ghost?: GameGhost | null
  onReplay: () => void
  /**
   * Sortie du jeu. Désormais portée par la flèche retour du header ModeStage :
   * la prop reste acceptée pour compat avec les appelants, mais l'écran de fin
   * n'affiche plus son propre bouton de retour (seul « Rejouer » subsiste).
   */
  onExit?: () => void
}) {
  const won = run.status === 'won'
  const target = runTarget(format)
  // `runAchieved` et non `runProgress` : la case porte un libellé de RÉUSSITE
  // (« drapeau planté », « organe localisé »), pas d'avancement.
  const achieved = runAchieved(format, run)

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 pt-6 text-center">
      <div
        className={cn(
          'grid size-24 place-items-center rounded-3xl text-5xl',
          won
            ? 'bg-[color:var(--jeu-accent)] shadow-lg'
            : 'bg-black/6 grayscale',
        )}
      >
        <span className="animate-in zoom-in duration-500" aria-hidden="true">
          {won ? format.emoji : '💤'}
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-extrabold text-balance">
          {won ? format.lexicon.win : format.lexicon.lose}
        </h2>
        {isRecord ? (
          <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-highlight">
            <Trophy className="size-4" aria-hidden="true" /> Nouveau record
            personnel !
          </p>
        ) : null}
      </div>

      {ultime ? (
        <UltimeResultBlock gameId={format.id} result={ultime} />
      ) : (
        <PalierResult
          gameId={format.id}
          level={palier}
          outcome={palierOutcome}
          standing={palierStanding}
        />
      )}

      <p className="font-mono text-5xl font-extrabold tabular-nums">
        {run.score}
      </p>

      {/* Le détail de la partie, dans le vocabulaire du jeu. */}
      <dl className="grid w-full grid-cols-3 gap-2 text-xs">
        <Stat
          label={format.lexicon.hit}
          value={target !== null ? `${achieved}/${target}` : String(run.correct)}
        />
        <Stat label="meilleure série" value={`×${run.bestStreak}`} />
        {/* `best` a déjà été remonté au nouveau score par la table de jeu. */}
        <Stat label="record" value={String(best)} />
      </dl>

      {/* CE QUE LA PARTIE A RAPPORTÉ, et le geste qui va avec : les pastilles
          se posent, puis une poignée de jetons file vers le bandeau du haut.

          ⚠️ CE BLOC ÉTAIT UN « +85 XP » EN GROS CHIFFRES, ET IL MENTAIT. La
          valeur venait de `XP_RULES` — un barème PUR, calculé côté client —
          alors que depuis la migration 348 jouer n'acquiert rien : le
          portefeuille ne versait pas un point pour une partie de salon. Le
          badge le plus voyant de l'écran de fin annonçait donc une récompense
          que le compteur du bandeau ne recevait jamais. */}
      <PanneauRecompenses gains={gains} className="w-full" />

      <TrophyLine trophies={trophies} />
      <GhostLine ghost={ghost} score={run.score} />

      <p className="min-h-5 text-sm text-muted-foreground">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Partie non enregistrée (connecte-toi pour garder ta progression).'
            : ''}
      </p>

      {/* `shine` : l'écran de fin n'a qu'UNE action qui compte — relancer.
          Le balayage de lumière la désigne sans un mot. Le retour à l'arène
          vit dans la flèche flottante (ArenaBackButton). */}
      <Button size="lg" shine onClick={onReplay} className="w-full">
        <RotateCcw className="size-4" aria-hidden="true" /> Rejouer
      </Button>
    </div>
  )
}

/**
 * LE RÉSULTAT DE L'ÉPREUVE ULTIME : le niveau atteint, la cote, et les deux
 * classements.
 *
 * L'ordre n'est pas décoratif. Le NIVEAU d'abord, parce qu'il est immédiat et
 * qu'il appartient au joueur. La COTE ensuite, parce qu'elle résume tout ce
 * qu'il a fait sur ce jeu. Les CLASSEMENTS en dernier — le mondial avant celui
 * de la classe, parce que c'est le mondial qui donne son sens à l'épreuve : un
 * 6e y dépasse un Terminale, et c'est cette phrase-là qu'il vient chercher.
 *
 * Rien ne s'affiche qui ne soit vrai : sans serveur (migration 314 absente,
 * réseau coupé), il reste le niveau atteint, et c'est déjà une nouvelle.
 */
function UltimeResultBlock({
  gameId,
  result,
}: {
  gameId: string
  result: UltimeResult
}) {
  const { standing } = result
  const world = worldLabel(standing)
  const grade = gradeLabel(standing)
  const next = standing ? nextCoteTitle(standing.cote) : null

  return (
    <section className="w-full space-y-3" aria-label="Résultat de l’épreuve ultime">
      <p className="font-heading flex items-center justify-center gap-2 text-sm font-extrabold tracking-wide uppercase">
        <InfinityIcon className="size-4" aria-hidden="true" />
        Niveau {result.level + 1} atteint
      </p>

      {standing ? (
        <div className="space-y-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
          <p className="flex items-baseline justify-center gap-2">
            <span className="font-mono text-3xl font-extrabold tabular-nums">
              {standing.cote}
            </span>
            <span className="font-heading text-sm font-extrabold text-primary uppercase">
              {coteTitle(standing.cote)}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Ta cote sur ce jeu — la moyenne de tes 3 meilleures épreuves.
          </p>

          {/* Le mondial en premier : c'est lui qui compare tout le monde. */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {world ? (
              <span className="font-heading rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-primary-foreground uppercase">
                {world}
              </span>
            ) : null}
            {grade ? (
              <span className="rounded-full bg-highlight/20 px-3 py-1 text-[11px] font-bold">
                {grade}
              </span>
            ) : null}
          </div>

          {next ? (
            <p className="text-xs text-muted-foreground">
              Encore {next.from - standing.cote} points de cote pour devenir{' '}
              <span className="font-bold text-foreground">{next.name}</span>.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Classement indisponible pour l’instant — ton niveau, lui, est bien
          celui-là.
        </p>
      )}

      <Link
        href={`/defi/jeux/${gameId}`}
        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-primary underline-offset-4 transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
      >
        <Map className="size-3.5" aria-hidden="true" />
        Voir la carte du jeu
      </Link>
    </section>
  )
}

/**
 * LES ÉTOILES DU PALIER — la vraie nouvelle de l'écran de fin.
 *
 * Le score dit combien on a fait ; les étoiles disent OÙ ON EN EST. Elles sont
 * placées au-dessus du score parce que ce sont elles qui ouvrent le palier
 * suivant, donc elles qui donnent une raison de relancer.
 *
 * Quand il en manque, on annonce le seuil exact à viser plutôt qu'un
 * encouragement creux : « 80 % de réussite » se joue, « courage » non.
 */
function PalierResult({
  gameId,
  level,
  outcome,
  standing,
}: {
  gameId: string
  level: PalierLevel | null
  outcome: PalierOutcome | null
  standing: PalierTimeStanding | null
}) {
  if (level === null) return null
  const def = palierDef(level)
  const stars = outcome?.stars ?? 0
  const gained = outcome?.gained ?? 0
  const target = nextStarAccuracy(stars)
  const speed = speedLabelFor(standing)

  return (
    <section className="w-full space-y-2" aria-label="Étoiles du palier">
      <PalierStars stars={stars} size="lg" className="justify-center" />

      <p className="text-sm font-bold">
        Palier {level} · {def.name}
        {gained > 0 ? (
          <span className="text-highlight">
            {' '}
            +{gained} étoile{gained > 1 ? 's' : ''} !
          </span>
        ) : null}
      </p>

      {/* Le CHRONO de bouclage, et la place qu'il donne. Il n'apparaît que sur
          une partie gagnée : une partie perdue n'a pas de temps comparable, et
          en afficher un ferait du plus vite abandonné le meilleur chrono du
          jeu. Le pourcentage arrive après (aller-retour serveur) ; sans lui, le
          chrono se tient très bien tout seul. */}
      {outcome && outcome.timeMs !== null ? (
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 font-mono font-bold tabular-nums">
            <Timer className="size-4" aria-hidden="true" />
            {formatDuration(outcome.timeMs)}
          </span>
          {outcome.isBestTime ? (
            <span className="font-heading rounded-full bg-highlight px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-foreground uppercase">
              Meilleur temps
            </span>
          ) : null}
          {speed ? (
            <span className="font-bold text-primary">{speed}</span>
          ) : null}
        </p>
      ) : null}

      {outcome?.unlocked ? (
        <Link
          href={`/defi/jeux/${gameId}`}
          className="font-heading flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-md transition-colors duration-200 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <Unlock className="size-4" aria-hidden="true" />
          Palier {outcome.unlocked} · {palierDef(outcome.unlocked).name} ouvert !
        </Link>
      ) : (
        <>
          {target !== null ? (
            <p className="text-xs text-muted-foreground">
              {stars === 0
                ? `Vise ${Math.round(target * 100)} % de bonnes réponses pour ta première étoile.`
                : `Termine la partie avec ${Math.round(target * 100)} % de réussite pour l’étoile suivante.`}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Palier maîtrisé — il ne reste que ton propre record à battre.
            </p>
          )}
          <Link
            href={`/defi/jeux/${gameId}`}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-primary underline-offset-4 transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
          >
            <Map className="size-3.5" aria-hidden="true" />
            Voir la carte des paliers
          </Link>
        </>
      )}
    </section>
  )
}

/**
 * Le mouvement de trophées sur la Route. Trois choses, dans cet ordre : ce que
 * la partie a rapporté, le compteur du jeu, et CE QUE VAUDRA LA PROCHAINE
 * VICTOIRE.
 *
 * Cette dernière ligne est le cœur du système et non une décoration : c'est en
 * lisant « +10 » ici et « +3 » sur son jeu habituel que l'élève arbitre tout
 * seul, et va vers la compétence qu'il n'a jamais travaillée. Brawl Stars ne
 * l'affiche pas ; une app scolaire le doit — on ne veut pas que l'arbitrage
 * reste réservé à ceux qui devinent la courbe.
 *
 * La perte ne prend JAMAIS la couleur d'alerte : un trophée perdu n'est pas une
 * erreur à corriger, et la doctrine du Défi est de ne pas punir l'échec au
 * point de faire fuir un collégien.
 */
function TrophyLine({ trophies }: { trophies?: GameTrophyOutcome }) {
  if (!trophies) return null

  const gained = trophies.delta > 0
  const shielded = trophies.delta === 0
  const nextWin = trophyBand(trophies.after).win

  return (
    <div className="w-full space-y-1.5 rounded-2xl bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Trophy className="size-4" aria-hidden="true" /> Trophées
        </span>
        <span
          className={cn(
            'font-mono text-xl font-extrabold tabular-nums',
            gained ? 'text-highlight' : 'text-muted-foreground',
          )}
        >
          {gained ? '+' : ''}
          {trophies.delta}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {shielded && !gained
            ? 'Rien perdu — tu débutes sur ce jeu'
            : `Total sur ce jeu : ${trophies.after}`}
        </span>
        <span>
          Prochaine victoire{' '}
          <strong className="font-mono font-bold text-foreground tabular-nums">
            +{nextWin}
          </strong>
        </span>
      </div>
    </div>
  )
}

/**
 * LE FANTÔME — le meilleur score d'un ami sur ce jeu.
 *
 * Il tient la place des dix « adversaires » en dur du mode classé supprimé
 * (Maxou, BrainZ, La Taupe…), tirés par une graine. Un collégien repère vite
 * un adversaire scripté, et la ladder devient alors une machine à sous. Une
 * ligne qui appartient à quelqu'un de réel, elle, continue de mordre.
 *
 * Le dépassement se célèbre ; l'échec ne se commente pas au-delà du chiffre —
 * on affiche l'écart, jamais un jugement.
 */
function GhostLine({
  ghost,
  score,
}: {
  ghost?: GameGhost | null
  score: number
}) {
  if (!ghost) return null

  const beaten = score > ghost.score

  return (
    <p
      className={cn(
        'flex w-full items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-sm',
        beaten
          ? 'bg-highlight/20 font-bold text-foreground'
          : 'text-muted-foreground',
      )}
    >
      <Ghost className="size-4 shrink-0" aria-hidden="true" />
      {beaten ? (
        <span>
          Tu viens de battre {ghost.name} ({ghost.score}) !
        </span>
      ) : (
        <span>
          {ghost.name} tient le record : {ghost.score}
        </span>
      )}
    </p>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card px-2 py-2.5 shadow-sm">
      <dd className="font-mono text-lg font-bold tabular-nums">{value}</dd>
      <dt className="mt-0.5 leading-tight text-muted-foreground">{label}</dt>
    </div>
  )
}
